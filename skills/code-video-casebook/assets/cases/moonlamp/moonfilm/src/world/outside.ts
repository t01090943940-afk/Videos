import * as THREE from "three";
import { type MatLib, lanternMaterial, glowMaterial } from "../look/moonwash";
import { TEX } from "../core/tex";
import { rng } from "../core/rng";
import { MOON_DIR, LANTERN_ROPE, LANTERN_COUNT, CONST, BOOK, WIN, DESK } from "../layout";
import {
  MOTE_EMIT, LANTERN_IGNITE, CONST_LIFT0, CONST_SETTLE0, CONST_STAGGER, CONST_LINES, SCALE_LEVEL, STREAMS, RING,
  SKY_LANTERNS, PETALS_IN, BREEZE_FLIPS,
} from "../timeline";
import { clamp01, smooth, smoother, win, lerp, crPath, easeOut, h1 } from "../core/anim";

/**
 * OUTSIDE — the night: painted far landscape, the osmanthus tree, the string of lanterns, and
 * every light that travels in this film (motes → lanterns → constellation → ring; sky lanterns;
 * petals; the moonbeam). All motion is an analytic function of t.
 */
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const GROUND_Y = -3.5;

export interface OutsideHandles {
  group: THREE.Group;
  update(t: number, cam: THREE.Camera): void;
  lanternLit(t: number): number; // 0..6 (fractional)
  lanternPos: THREE.Vector3[];
}

/* ------------------------------------------------------------------ helpers */
function ropePoint(s: number) {
  const a = V(...LANTERN_ROPE.a), b = V(...LANTERN_ROPE.b);
  const p = a.clone().lerp(b, s);
  p.y -= LANTERN_ROPE.sag * 4 * s * (1 - s);
  return p;
}
function dirFrom(az: number, el: number) {
  return V(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
}
/** constellation plane basis */
const cDir = dirFrom(CONST.az, CONST.el);
const cCenter = cDir.clone().multiplyScalar(CONST.dist);
const cRight = cDir.clone().cross(V(0, 1, 0)).normalize(); // viewer's right when looking out
const cUp = cRight.clone().cross(cDir).normalize();
/** the scale of justice as 14 stars; phi tilts the beam (left pan down when phi > 0) */
function scalePts(phi: number): [number, number][] {
  const pv: [number, number] = [0, 1.0];
  const L: [number, number] = [pv[0] - 1.2 * Math.cos(phi), pv[1] - 1.2 * Math.sin(phi)];
  const R: [number, number] = [pv[0] + 1.2 * Math.cos(phi), pv[1] + 1.2 * Math.sin(phi)];
  const pan = (e: [number, number]): [number, number][] => [[e[0] - 0.42, e[1] - 0.95], [e[0] + 0.42, e[1] - 0.95], [e[0], e[1] - 1.14]];
  return [[0, 1.34], pv, [0, 0.1], [0, -0.95], [-0.5, -1.05], [0.5, -1.05], L, R, ...pan(L), ...pan(R)];
}
const LINES: [number, number][] = [[0, 1], [1, 2], [2, 3], [4, 3], [3, 5], [1, 6], [1, 7], [6, 8], [6, 9], [8, 10], [10, 9], [7, 11], [7, 12], [11, 13], [13, 12]];
function planePoint(p: [number, number]) {
  return cCenter.clone().add(cRight.clone().multiplyScalar(p[0] * CONST.unit)).add(cUp.clone().multiplyScalar(p[1] * CONST.unit));
}
/** ring around the moon */
const mDir = V(...MOON_DIR);
const mCenter = mDir.clone().multiplyScalar(CONST.dist);
const mRight = mDir.clone().cross(V(0, 1, 0)).normalize();
const mUp = mRight.clone().cross(mDir).normalize();
const RING_R = Math.tan(0.142) * CONST.dist;
function ringPoint(i: number, t: number) {
  const a = (i / 14) * Math.PI * 2 + Math.PI / 2 + 0.08 * Math.max(0, t - RING[0]);
  return mCenter.clone().add(mRight.clone().multiplyScalar(Math.cos(a) * RING_R)).add(mUp.clone().multiplyScalar(Math.sin(a) * RING_R));
}

/** billboard strip between two points (screen-facing), width in world units */
function poseLine(m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, width: number, cam: THREE.Camera) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const x = b.clone().sub(a);
  const len = Math.max(1e-4, x.length());
  x.divideScalar(len);
  const toCam = cam.position.clone().sub(mid).normalize();
  const y = toCam.clone().cross(x).normalize();
  const z = x.clone().cross(y).normalize();
  const mat = new THREE.Matrix4().makeBasis(x, y, z);
  mat.scale(V(len, width, 1));
  mat.setPosition(mid);
  m.matrix.copy(mat);
  m.matrixWorldNeedsUpdate = true;
}

function lineMaterial(color: string) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `varying vec2 vUv; uniform vec3 uColor; uniform float uOpacity;
      void main(){ float a = pow(sin(3.14159 * vUv.y), 2.) * smoothstep(0., .04, vUv.x) * smoothstep(1., .96, vUv.x); gl_FragColor = vec4(uColor * a * uOpacity, 1.); }`,
  });
}

/* ------------------------------------------------------------------ build */
export function buildOutside(M: MatLib): OutsideHandles {
  const group = new THREE.Group();
  group.name = "outside";
  const r = rng(2026);
  const add = (o: THREE.Object3D) => (group.add(o), o);
  const mesh = (g: THREE.BufferGeometry, sem: string, cast = true) => {
    const m = new THREE.Mesh(g, M.get(sem));
    m.castShadow = cast;
    m.receiveShadow = true;
    return m;
  };

  // ---------------------------------------------------------------- ground + painted far landscape
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshBasicMaterial({ color: "#10131f" }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  ground.userData.noOutline = true;
  add(ground);
  const layers: [number, number][] = [[150, 38], [104, 27], [62, 14], [22, 7]];
  layers.forEach(([rad, hgt], i) => {
    const g = new THREE.CylinderGeometry(rad, rad, hgt, 128, 1, true, -1.9, 3.8);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: TEX.skyline(i as 0 | 1 | 2 | 3), alphaTest: 0.5, side: THREE.BackSide, toneMapped: false }));
    m.position.set(0, GROUND_Y + hgt / 2, 0);
    m.userData.noOutline = true;
    add(m);
  });

  // ---------------------------------------------------------------- the osmanthus tree (her left, +x)
  const tree = new THREE.Group();
  const branch = (a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number) => {
    const m = mesh(new THREE.CylinderGeometry(rb, ra, a.distanceTo(b), 10), "trunk");
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
    tree.add(m);
  };
  const T0 = V(3.95, GROUND_Y, 5.4), T1 = V(3.65, 1.0, 5.05), T2 = V(3.35, 2.5, 4.7);
  branch(T0, T1, 0.16, 0.13);
  branch(T1, T2, 0.13, 0.1);
  const tips = [V(2.35, 3.3, 2.6), V(2.25, 3.75, 3.5), V(3.6, 4.2, 5.4), V(2.8, 4.3, 6.1), V(4.3, 3.5, 3.4)];
  tips.forEach((tp) => branch(T2, tp, 0.075, 0.035));
  const blobCenters: [THREE.Vector3, number][] = [];
  tips.forEach((tp, i) => {
    const n = i === 0 ? 5 : 4;
    for (let k = 0; k < n; k++) {
      const c = tp.clone().add(V((r() - 0.5) * 0.9, (r() - 0.3) * 0.6, (r() - 0.5) * 0.9));
      const rad = 0.32 + r() * 0.34;
      blobCenters.push([c, rad]);
      const b = mesh(new THREE.SphereGeometry(rad, 12, 9), "leaf");
      b.scale.set(1.15, 0.8, 1.05);
      b.position.copy(c);
      tree.add(b);
    }
  });
  // golden flower clusters on the blobs, biased toward the window side (−z, −x)
  const nFl = 420;
  const flowers = new THREE.InstancedMesh(new THREE.SphereGeometry(0.02, 6, 4), M.get("flower"), nFl);
  const tmp = new THREE.Object3D();
  for (let i = 0; i < nFl; i++) {
    const [c, rad] = blobCenters[i % blobCenters.length];
    let d = V(r() - 0.5 - 0.35, r() - 0.35, r() - 0.5 - 0.45).normalize();
    tmp.position.copy(c).add(d.multiplyScalar(rad * (0.92 + r() * 0.12)).multiply(V(1.15, 0.8, 1.05)));
    const s = 0.7 + r() * 0.8;
    tmp.scale.set(s, s, s);
    tmp.updateMatrix();
    flowers.setMatrixAt(i, tmp.matrix);
  }
  flowers.castShadow = false;
  tree.add(flowers);
  add(tree);

  // ---------------------------------------------------------------- pole + rope + lanterns
  const poleTop = V(...LANTERN_ROPE.b);
  const pole = mesh(new THREE.CylinderGeometry(0.06, 0.08, poleTop.y - GROUND_Y + 0.15, 10), "pole");
  pole.position.set(poleTop.x - 0.05, (poleTop.y + GROUND_Y) / 2 + 0.07, poleTop.z);
  add(pole);
  const ropePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 24; i++) ropePts.push(ropePoint(i / 24));
  const rope = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ropePts), 48, 0.009, 6), "rope");
  add(rope);
  const lanterns: { pivot: THREE.Group; mat: THREE.MeshLambertMaterial; glow: THREE.Sprite; anchor: THREE.Vector3 }[] = [];
  const lanternPos: THREE.Vector3[] = [];
  for (let k = 0; k < LANTERN_COUNT; k++) {
    const anchor = ropePoint((k + 0.5) / LANTERN_COUNT);
    const pivot = new THREE.Group();
    pivot.position.copy(anchor);
    const mat = lanternMaterial();
    const str = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.11, 4), "rope", false);
    str.position.y = -0.055;
    const capT = mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.045, 16), "lanternCap");
    capT.position.y = -0.13;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), mat);
    body.scale.set(1, 0.84, 1);
    body.position.y = -0.3;
    body.castShadow = true;
    const capB = mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.045, 16), "lanternCap");
    capB.position.y = -0.47;
    const tassel = mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.2, 10), "tassel", false);
    tassel.position.y = -0.6;
    const knot = mesh(new THREE.SphereGeometry(0.022, 8, 6), "lanternCap", false);
    knot.position.y = -0.505;
    const glow = new THREE.Sprite(glowMaterial("#ffb266", 0));
    glow.scale.set(1.5, 1.5, 1);
    glow.position.y = -0.3;
    glow.userData.noOutline = true;
    pivot.add(str, capT, body, capB, tassel, knot, glow);
    add(pivot);
    lanterns.push({ pivot, mat, glow, anchor });
    lanternPos.push(anchor.clone().add(V(0, -0.3, 0)));
  }
  const lanternLight = new THREE.PointLight("#ff9a55", 0, 9, 2);
  lanternLight.position.set(0, 2.5, 3.1);
  lanternLight.visible = false;
  add(lanternLight);

  // ---------------------------------------------------------------- light motes (book → lanterns)
  const moteMat = () => glowMaterial("#ffd08a", 0);
  const coreMat = () => new THREE.SpriteMaterial({ map: TEX.core(), color: new THREE.Color("#fff3d6").multiplyScalar(3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const motes: { core: THREE.Sprite; glow: THREE.Sprite; trail: THREE.Sprite[] }[] = [];
  for (let i = 0; i < MOTE_EMIT.length; i++) {
    const core = new THREE.Sprite(coreMat());
    const glow = new THREE.Sprite(moteMat());
    const trail: THREE.Sprite[] = [];
    for (let k = 0; k < 5; k++) {
      const s = new THREE.Sprite(coreMat());
      s.userData.noOutline = true;
      trail.push(s);
      add(s);
    }
    core.userData.noOutline = glow.userData.noOutline = true;
    add(core);
    add(glow);
    motes.push({ core, glow, trail });
  }
  const motePath = (i: number) => {
    const L = lanternPos[i];
    const off = (i - 2.5) * 0.05;
    return [
      V(BOOK.x + 0.02 + off * 0.3, BOOK.y + 0.03, BOOK.z - 0.02),
      V(0.04 + off, 1.1, -0.4),
      V(off * 2.2, 1.62, -0.06),
      V(L.x * 0.55, lerp(1.95, L.y, 0.6), 1.7),
      V(L.x, L.y + 0.02, L.z - 0.02),
    ];
  };
  const motePaths = MOTE_EMIT.map((_, i) => motePath(i));

  // ---------------------------------------------------------------- constellation (14 stars, 15 lines)
  const stars: { core: THREE.Sprite; glow: THREE.Sprite }[] = [];
  for (let i = 0; i < 14; i++) {
    const core = new THREE.Sprite(coreMat());
    const glow = new THREE.Sprite(glowMaterial("#ffd899", 0));
    core.userData.noOutline = glow.userData.noOutline = true;
    add(core);
    add(glow);
    stars.push({ core, glow });
  }
  const lines: THREE.Mesh[] = LINES.map(() => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lineMaterial("#ffd9a0"));
    m.matrixAutoUpdate = false;
    m.frustumCulled = false;
    m.userData.noOutline = true;
    add(m);
    return m;
  });
  // where each star comes from: stars 0-5 from the six lanterns, 6-13 rise from the far horizon
  const starOrder = [1, 0, 6, 7, 3, 2, 8, 9, 10, 11, 12, 13, 4, 5]; // which point each orb flies to
  const starFrom = (i: number) => {
    if (i < 6) return lanternPos[i].clone();
    const p = planePoint(scalePts(0.19)[starOrder[i]]);
    const d = p.clone().normalize();
    return d.multiplyScalar(CONST.dist * 0.92).setY(GROUND_Y + 4);
  };
  // streams toward the moon
  const streams: THREE.Sprite[] = [];
  for (let i = 0; i < 28; i++) {
    const s = new THREE.Sprite(coreMat());
    s.userData.noOutline = true;
    add(s);
    streams.push(s);
  }

  // ---------------------------------------------------------------- sky lanterns for the end card
  interface SkyL { g: THREE.Group; mat: THREE.MeshLambertMaterial; glow: THREE.Sprite; p0: THREE.Vector3; t0: number; v: number; ph: number; near: boolean }
  const sky: SkyL[] = [];
  const sr = rng(88);
  for (let i = 0; i < 44; i++) {
    const near = i < 18;
    const g = new THREE.Group();
    const mat = lanternMaterial();
    mat.emissiveIntensity = 1.1;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), mat);
    body.scale.set(1, 0.86, 1);
    const capT = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.035, 10), M.get("lanternCap"));
    capT.position.y = 0.145;
    const capB = capT.clone();
    capB.position.y = -0.145;
    const glow = new THREE.Sprite(glowMaterial("#ffb266", 0));
    glow.userData.noOutline = true;
    g.add(body, capT, capB, glow);
    add(g);
    let p0: THREE.Vector3;
    if (near) p0 = V((sr() - 0.5) * 10, -2.2 - sr() * 1.6, 6.5 + sr() * 6.5);
    else {
      const az = (sr() - 0.5) * 1.3;
      const d = 14 + sr() * 50;
      p0 = V(Math.sin(az) * d, -1.5 + sr() * 3, Math.cos(az) * d);
    }
    sky.push({ g, mat, glow, p0, t0: SKY_LANTERNS - 0.35 + sr() * 1.8, v: near ? 1.15 + sr() * 0.5 : 1.4 + sr() * 1.3, ph: sr() * 6.28, near });
  }

  // ---------------------------------------------------------------- osmanthus petals
  const NP = 150;
  const petalMat = new THREE.MeshLambertMaterial({ map: TEX.flower(), alphaTest: 0.35, side: THREE.DoubleSide, emissive: new THREE.Color("#f0a030"), emissiveIntensity: 0.35 });
  const petals = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), petalMat, NP);
  petals.userData.noOutline = true;
  petals.frustumCulled = false;
  petals.castShadow = false;
  add(petals);
  const pr = rng(31);
  const petalSeeds = Array.from({ length: NP }, (_, i) => ({
    a: pr(), b: pr(), c: pr(), d: pr(), e: pr(),
    inbound: i >= 90,
    settled: false,
  }));

  group.traverse((o) => ((o as THREE.Mesh).castShadow = false));

  /* ================================================================ update(t) */
  const lanternLit = (t: number) => LANTERN_IGNITE.reduce((s, ti) => s + clamp01((t - ti) / 0.25), 0);

  function update(t: number, cam: THREE.Camera) {
    // lanterns: sway + ignition
    lanterns.forEach((L, k) => {
      const ti = LANTERN_IGNITE[k];
      const lit = clamp01((t - ti) / 0.22);
      const flash = t > ti ? Math.exp(-(t - ti) * 7) * 1.2 : 0;
      const flick = 1 + 0.045 * Math.sin(t * 13.1 + k * 2.3) + 0.03 * Math.sin(t * 23.7 + k);
      L.mat.emissiveIntensity = 0.05 + lit * (2.35 + flash) * flick;
      (L.glow.material as THREE.SpriteMaterial).opacity = lit * (0.95 + flash * 0.3);
      L.glow.scale.setScalar(1.8 + 0.7 * flash);
      const jolt = t > ti ? 0.09 * Math.exp(-(t - ti) * 2.2) * Math.sin((t - ti) * 9) : 0;
      const gust = 0.05 * win(t, BREEZE_FLIPS[0], BREEZE_FLIPS[0] + 0.5) * (1 - win(t, 8.8, 9.6));
      L.pivot.rotation.z = 0.035 * Math.sin(t * 1.1 + k * 1.7) + jolt + gust * Math.sin(t * 3 + k);
      L.pivot.rotation.x = 0.025 * Math.sin(t * 0.8 + k * 2.9) + jolt * 0.4;
    });
    const nLit = lanternLit(t);
    lanternLight.visible = nLit > 0.01;
    lanternLight.intensity = nLit * 0.55;

    // motes
    motes.forEach((m, i) => {
      const e = MOTE_EMIT[i], f = LANTERN_IGNITE[i];
      const u = (t - e) / (f - e);
      const alive = u > 0 && u < 1.06;
      m.core.visible = m.glow.visible = alive;
      m.trail.forEach((s) => (s.visible = alive));
      if (!alive) return;
      const fadeIn = clamp01(u * 8), fadeOut = 1 - clamp01((u - 1) / 0.06);
      const ease = (x: number) => smoother(x) * 0.65 + x * 0.35;
      const p = crPath(motePaths[i], ease(clamp01(u)));
      const bob = V(0.012 * Math.sin(t * 9 + i), 0.01 * Math.sin(t * 7 + i * 2), 0);
      p.add(bob.multiplyScalar(1 - clamp01(u)));
      const d = cam.position.distanceTo(p);
      const size = Math.max(0.04, d * 0.016);
      m.core.position.copy(p);
      m.core.scale.setScalar(size);
      (m.core.material as THREE.SpriteMaterial).opacity = fadeIn * fadeOut;
      m.glow.position.copy(p);
      m.glow.scale.setScalar(Math.min(size * 6, d * 0.07));
      (m.glow.material as THREE.SpriteMaterial).opacity = 0.85 * fadeIn * fadeOut;
      m.trail.forEach((s, k) => {
        const uu = clamp01(u - (k + 1) * 0.018);
        s.position.copy(crPath(motePaths[i], ease(uu)));
        s.scale.setScalar(size * (0.8 - k * 0.13));
        (s.material as THREE.SpriteMaterial).opacity = fadeIn * fadeOut * (0.5 - k * 0.09);
      });
    });

    // constellation: lift → settle → lines → level → (streams) → ring
    const phi = 0.19 * (1 - smoother((t - SCALE_LEVEL[0]) / (SCALE_LEVEL[1] - SCALE_LEVEL[0]))) + (t > SCALE_LEVEL[1] ? -0.018 * Math.exp(-(t - SCALE_LEVEL[1]) * 3) * Math.sin((t - SCALE_LEVEL[1]) * 10) : 0);
    const pts = scalePts(phi).map(planePoint);
    const starPos: THREE.Vector3[] = [];
    stars.forEach((s, i) => {
      const lift = CONST_LIFT0 + i * CONST_STAGGER, settle = CONST_SETTLE0 + i * CONST_STAGGER;
      const target = pts[starOrder[i]];
      let p: THREE.Vector3;
      let vis = 0;
      if (t < lift) {
        s.core.visible = s.glow.visible = false;
        starPos.push(target);
        return;
      }
      if (t < settle) {
        const u = smoother((t - lift) / (settle - lift));
        const a = starFrom(i);
        const mid = a.clone().lerp(target, 0.5);
        mid.y += 10 + i * 0.4;
        const q = new THREE.QuadraticBezierCurve3(a, mid, target);
        p = q.getPoint(u);
        vis = clamp01((t - lift) / 0.15);
      } else {
        p = target.clone();
        vis = 1;
      }
      // gather into the ring around the moon
      const r0 = RING[0] + (i % 7) * 0.12, r1 = r0 + 1.25;
      if (t > r0) {
        const u = smoother((t - r0) / (r1 - r0));
        const rp = ringPoint(i, t);
        const mid = p.clone().lerp(rp, 0.5).add(mUp.clone().multiplyScalar(6));
        p = new THREE.QuadraticBezierCurve3(p, mid, rp).getPoint(u);
      }
      starPos.push(p);
      const d = cam.position.distanceTo(p);
      const settleFlash = t > settle ? 1 + 1.6 * Math.exp(-(t - settle) * 5) : 1;
      const tw = 1 + 0.12 * Math.sin(t * 5.3 + i * 1.7);
      s.core.visible = s.glow.visible = true;
      s.core.position.copy(p);
      s.glow.position.copy(p);
      const levelFlash = 1 + 0.8 * Math.exp(-Math.pow((t - SCALE_LEVEL[1]) / 0.25, 2));
      s.core.scale.setScalar(Math.max(0.03, d * 0.0068) * settleFlash * levelFlash);
      s.glow.scale.setScalar(Math.max(0.12, d * 0.035) * settleFlash * tw);
      (s.core.material as THREE.SpriteMaterial).opacity = vis;
      (s.glow.material as THREE.SpriteMaterial).opacity = vis * 0.7 * levelFlash;
    });
    lines.forEach((m, l) => {
      const [a, b] = LINES[l];
      const s0 = CONST_LINES[0] + l * ((CONST_LINES[1] - CONST_LINES[0] - 0.45) / (LINES.length - 1));
      const grow = smooth((t - s0) / 0.45);
      const fade = 1 - smooth((t - RING[0]) / 0.45);
      const op = grow * fade;
      m.visible = op > 0.002;
      if (!m.visible) return;
      const A = pts[a], B = pts[b];
      const Bp = A.clone().lerp(B, grow);
      const d = cam.position.distanceTo(A);
      poseLine(m, A, Bp, d * 0.0042, cam);
      const glowBoost = 1 + 0.9 * Math.exp(-Math.pow((t - SCALE_LEVEL[1]) / 0.3, 2));
      (m.material as THREE.ShaderMaterial).uniforms.uOpacity.value = op * 0.85 * glowBoost;
    });
    // streams: from the stars to the moon
    streams.forEach((s, k) => {
      const i = k % 14;
      const t0 = STREAMS[0] + (k / 28) * (STREAMS[1] - STREAMS[0] - 0.7);
      const u = (t - t0) / 0.7;
      s.visible = u > 0 && u < 1;
      if (!s.visible) return;
      const a = pts[starOrder[i]];
      const b = mCenter.clone().add(mRight.clone().multiplyScalar((h1(k) - 0.5) * 3)).add(mUp.clone().multiplyScalar((h1(k + 9) - 0.5) * 3));
      const mid = a.clone().lerp(b, 0.5).add(mUp.clone().multiplyScalar(5 + h1(k + 3) * 4));
      const p = new THREE.QuadraticBezierCurve3(a, mid, b).getPoint(smooth(u));
      s.position.copy(p);
      s.scale.setScalar(cam.position.distanceTo(p) * 0.009);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(Math.PI * u) * 0.9;
    });

    // sky lanterns
    sky.forEach((L, i) => {
      const age = t - L.t0;
      L.g.visible = age > 0;
      if (!L.g.visible) return;
      const p = L.p0.clone();
      p.y += L.v * age + 0.15 * age * age;
      p.x += 0.25 * Math.sin(age * 0.9 + L.ph) + 0.1 * age;
      p.z += 0.2 * Math.sin(age * 0.7 + L.ph * 2);
      L.g.position.copy(p);
      L.g.rotation.z = 0.08 * Math.sin(age * 1.3 + L.ph);
      const fade = L.near ? 1 : clamp01(age / 0.6);
      L.mat.emissiveIntensity = 1.05 * fade * (1 + 0.06 * Math.sin(t * 11 + i));
      const d = cam.position.distanceTo(p);
      L.g.scale.setScalar(L.near ? 1.25 : Math.max(1, d * 0.012));
      L.glow.scale.setScalar(1.5);
      (L.glow.material as THREE.SpriteMaterial).opacity = 0.9 * fade;
    });

    // petals
    const tmpO = new THREE.Object3D();
    petalSeeds.forEach((s, i) => {
      s.settled = false;
      let p: THREE.Vector3;
      let scale = 0.028 + s.e * 0.012;
      if (!s.inbound) {
        const life = 6 + s.a * 4;
        const age = (t + s.b * life) % life;
        const spawn = V(1.4 + s.c * 3.0, 2.3 + s.d * 2.0, 1.6 + s.e * 4.4);
        p = spawn.add(V(-0.42 * age, -0.3 * age, -0.05 * age));
        p.x += 0.12 * Math.sin(age * 2.1 + s.a * 9);
        p.y += 0.05 * Math.sin(age * 3.3 + s.b * 7);
        const edge = Math.min(clamp01(age / 0.5), clamp01((life - age) / 0.5));
        scale *= edge;
      } else {
        const t0 = PETALS_IN + s.a * 7.5;
        const age = t - t0;
        if (age < 0) {
          scale = 0;
          p = V(0, -50, 0);
        } else {
          const spawn = V((s.b - 0.5) * 1.5, 1.55 + s.c * 0.75, 0.9 + s.d * 0.9);
          const wind = V(0.05 * (s.e - 0.5), -0.13, -0.85);
          p = spawn.add(wind.multiplyScalar(age));
          p.x += 0.08 * Math.sin(age * 2.4 + s.e * 9);
          p.y += 0.04 * Math.sin(age * 3.1 + s.a * 5);
          // settle on the desk / floor
          const onDesk = p.x > DESK.x0 && p.x < DESK.x1 && p.z < DESK.zFar && p.z > DESK.zNear;
          const floorY = onDesk ? DESK.top + 0.004 : 0.004;
          if (p.y < floorY) {
            p.y = floorY;
            s.settled = true;
          } else s.settled = false;
          scale *= clamp01(age / 0.4);
        }
      }
      tmpO.position.copy(p);
      const spin = t * (1.5 + s.a * 2) + s.b * 6.28;
      if (s.inbound && s.settled) tmpO.rotation.set(-Math.PI / 2, 0, s.d * 6.28);
      else tmpO.rotation.set(spin, spin * 0.7 + s.c * 3, s.d * 3);
      tmpO.scale.setScalar(scale);
      tmpO.updateMatrix();
      petals.setMatrixAt(i, tmpO.matrix);
    });
    petals.instanceMatrix.needsUpdate = true;

  }

  return { group, update, lanternLit, lanternPos };
}
