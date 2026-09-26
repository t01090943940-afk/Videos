import * as THREE from "three";
import type { MatLib } from "../look/moonwash";
import { TEX, faceCapUV } from "../core/tex";
import { HIPS, BOOK, DESK, PEN_REST } from "../layout";
import { ACT, HAND_FLIPS, HAND_FLIP_DUR } from "../timeline";
import { track, track3, win, smoother, smooth, lerp, clamp01 } from "../core/anim";

/**
 * 学姐 — a soft seated puppet: rounded primitives, painted face decals, 2-bone IK arms.
 * Everything is a pure function of t (no state carried between frames).
 */
const D = Math.PI / 180;
export const HEAD_R = 0.105;
const L1 = 0.27; // shoulder → elbow
const L2 = 0.28; // elbow → hand centre
const HAND_R = 0.031;
export const RELEASE = 0.62; // fraction of a hand-flip during which the hand rides the page edge

type V3 = THREE.Vector3;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const Y_AXIS = V(0, 1, 0);

function capsule(r: number, len: number, mat: THREE.Material, seg = 10) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len), 4, seg), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}
function ball(r: number, mat: THREE.Material, w = 18, h = 12) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, w, h), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}
/** place a Y-aligned mesh so it spans a → b */
function span(m: THREE.Object3D, a: V3, b: V3) {
  m.position.copy(a).add(b).multiplyScalar(0.5);
  const d = b.clone().sub(a);
  m.quaternion.setFromUnitVectors(Y_AXIS, d.normalize());
}

/** spherical cap on the face with UVs in (azimuth, latitude) — matches TEX.face */
function faceCap(r: number) {
  const { capH, capV } = faceCapUV();
  const N = 24;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let j = 0; j <= N; j++)
    for (let i = 0; i <= N; i++) {
      const az = -capH + (2 * capH * i) / N, lat = -capV + (2 * capV * j) / N;
      pos.push(r * Math.sin(az) * Math.cos(lat), r * Math.sin(lat), r * Math.cos(az) * Math.cos(lat));
      uv.push(i / N, j / N);
    }
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** two-bone IK: returns elbow + end (end = target if reachable, else as far as the arm goes) */
export function solveIK(shoulder: V3, target: V3, pole: V3, l1 = L1, l2 = L2) {
  const toT = target.clone().sub(shoulder);
  let d = toT.length();
  const dir = toT.clone().normalize();
  d = Math.min(Math.max(d, Math.abs(l1 - l2) + 1e-3), l1 + l2 - 1e-4);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const a1 = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const perp = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir)));
  if (perp.lengthSq() < 1e-8) perp.set(0, -1, 0);
  perp.normalize();
  const elbow = shoulder.clone().add(dir.clone().multiplyScalar(l1 * Math.cos(a1))).add(perp.multiplyScalar(l1 * Math.sin(a1)));
  const end = shoulder.clone().add(dir.clone().multiplyScalar(d));
  return { elbow, end };
}

/** lowest gap between the forearm capsule and the desk / page under it (m; negative = inside) */
const FORE_R = 0.035;
function forearmClearance(elbow: V3, end: V3) {
  let worst = 1;
  for (let k = 0; k <= 6; k++) {
    const q = elbow.clone().lerp(end, k / 6);
    const onBook = Math.abs(q.x - BOOK.x) < BOOK.pageW + 0.005 && Math.abs(q.z - BOOK.z) < BOOK.pageD / 2;
    const onDesk = q.x > DESK.x0 && q.x < DESK.x1 && q.z > DESK.zNear && q.z < DESK.zFar;
    if (!onBook && !onDesk) continue;
    const sy = onBook ? BOOK.y : DESK.top;
    worst = Math.min(worst, q.y - FORE_R - sy);
  }
  return worst;
}

export interface GirlProbe {
  hands: { R: V3; L: V3 };
  handR: number;
  forearms: { R: [V3, V3]; L: [V3, V3] };
  penTip: V3;
  penMode: "write" | "hold" | "rest";
  head: V3;
  headR: number;
}

export class Girl {
  root = new THREE.Group();
  private torso = new THREE.Group();
  private headPivot = new THREE.Group();
  private head = new THREE.Group();
  private faces: Record<string, THREE.Mesh> = {};
  private arm: Record<"R" | "L", { up: THREE.Mesh; fore: THREE.Mesh; hand: THREE.Mesh; sh: THREE.Mesh; el: THREE.Mesh; cuff: THREE.Mesh }>;
  private pen = new THREE.Group();
  private hairLong: THREE.Mesh;
  private shoulderLocal = { R: V(-0.165, 0.455, 0), L: V(0.165, 0.455, 0) };
  probe!: GirlProbe;

  constructor(M: MatLib) {
    const skin = M.get("skin"), hair = M.get("hair"), sweater = M.get("sweater"), skirt = M.get("skirt"), shoe = M.get("shoe");
    this.root.position.set(HIPS.x, HIPS.y, HIPS.z);
    this.root.name = "girl";
    // ---------------- lower body (does not bend with the spine)
    const lap = ball(0.14, skirt);
    lap.scale.set(1.12, 0.55, 1.0);
    lap.position.set(0, 0.02, 0.03);
    this.root.add(lap);
    for (const s of [-1, 1]) {
      const thigh = capsule(0.058, 0.36, skirt);
      span(thigh, V(s * 0.085, 0.03, 0.0), V(s * 0.095, 0.04, 0.4));
      const shin = capsule(0.047, 0.36, skirt);
      span(shin, V(s * 0.095, 0.04, 0.41), V(s * 0.095, -0.4, 0.44));
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.055, 0.17), shoe);
      foot.position.set(s * 0.095, -0.445, 0.49);
      foot.castShadow = true;
      this.root.add(thigh, shin, foot);
    }
    // ---------------- torso (pivot at the hips)
    this.root.add(this.torso);
    const prof = [
      [0.0, 0.0], [0.132, 0.0], [0.13, 0.1], [0.128, 0.22], [0.146, 0.33], [0.153, 0.41], [0.14, 0.46], [0.1, 0.505], [0.05, 0.53], [0.0, 0.535],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), sweater);
    body.scale.set(1, 1, 0.74);
    body.castShadow = body.receiveShadow = true;
    this.torso.add(body);
    // soft collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.06, 0.07, 20), M.get("sweater"));
    collar.position.set(0, 0.535, 0.006);
    collar.castShadow = true;
    collar.name = "collar";
    body.name = "torso";
    this.torso.add(collar);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.037, 0.085, 14), skin);
    neck.position.set(0, 0.55, 0.006);
    neck.name = "neck";
    this.torso.add(neck);
    // long hair: a curved sheet wrapping the back of the neck and shoulders, uneven ends
    {
      const g = new THREE.CylinderGeometry(0.095, 0.158, 0.4, 24, 6, true, (80 * Math.PI) / 180, (200 * Math.PI) / 180);
      const pos = g.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const bottom = y < -0.19;
        const th = Math.atan2(x, z);
        pos.setXYZ(i, x, y + (bottom ? 0.022 * Math.sin(th * 7) - 0.02 * Math.cos(th) : 0), z);
      }
      g.computeVertexNormals();
      this.hairLong = new THREE.Mesh(g, hair);
      this.hairLong.castShadow = true;
      this.hairLong.receiveShadow = true;
      this.hairLong.scale.set(1.05, 1, 0.82);
      this.hairLong.position.set(0, 0.43, -0.022);
      this.hairLong.name = "hairLong";
      this.torso.add(this.hairLong);
    }
    // ---------------- head
    this.headPivot.position.set(0, 0.575, 0.01);
    this.torso.add(this.headPivot);
    this.head.position.set(0, 0.112, 0.014);
    this.headPivot.add(this.head);
    const skull = new THREE.Group();
    skull.scale.set(1, 1.04, 0.98);
    this.head.add(skull);
    const sk = ball(HEAD_R, skin, 28, 20);
    sk.name = "skull";
    skull.add(sk);
    for (const k of ["focus", "look", "gaze", "smile", "blink"] as const) {
      const m = new THREE.Mesh(
        faceCap(HEAD_R * 1.006),
        new THREE.MeshLambertMaterial({ map: TEX.face(k), transparent: true, depthWrite: false, opacity: 0 }),
      );
      m.userData.noOutline = true;
      m.renderOrder = 2;
      m.name = `face_${k}`;
      skull.add(m);
      this.faces[k] = m;
    }
    // hair: a shell around the back and sides (face left open), a front cap down to the brow,
    // pointed fringe strands, side locks framing the face
    const HR = HEAD_R * 1.085;
    const shell = new THREE.Mesh(new THREE.SphereGeometry(HR, 34, 22, (145 * Math.PI) / 180, (250 * Math.PI) / 180, 0, (150 * Math.PI) / 180), hair);
    shell.position.set(0, 0.004, -0.006);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(HR, 26, 14, (33 * Math.PI) / 180, (114 * Math.PI) / 180, 0, (70 * Math.PI) / 180), hair);
    cap.position.set(0, 0.004, -0.004);
    shell.name = "hairShell";
    cap.name = "hairCap";
    for (const m of [shell, cap]) {
      m.castShadow = true;
      m.receiveShadow = true;
      (m.material as THREE.Material).side = THREE.DoubleSide;
      skull.add(m);
    }
    // fringe: strands hanging from the cap edge (lat ≈ 20°) to just above the eyes
    const strands: [number, number, number][] = [[-46, 0.9, -0.25], [-27, 1.0, 0.18], [-8, 1.08, -0.1], [11, 1.02, 0.2], [30, 0.95, -0.22], [48, 0.85, 0.3]];
    for (const [az, len, tilt] of strands) {
      const f = ball(0.03, hair, 12, 10);
      f.scale.set(0.95, 1.0 * len, 0.42);
      const a0 = (az * Math.PI) / 180, lat = (22 * Math.PI) / 180;
      f.position.set(Math.sin(a0) * Math.cos(lat), Math.sin(lat), Math.cos(a0) * Math.cos(lat)).multiplyScalar(HR * 0.985);
      f.lookAt(f.position.clone().multiplyScalar(2));
      f.rotateX(-0.28);
      f.rotateZ(tilt);
      skull.add(f);
    }
    // side locks framing the face, down past the jaw
    for (const s of [-1, 1]) {
      const lock = capsule(0.022, 0.16, hair, 12);
      span(lock, V(s * HEAD_R * 0.93, 0.03, 0.03), V(s * HEAD_R * 1.0, -0.15, 0.012));
      lock.scale.set(1.15, 1, 0.65);
      skull.add(lock);
    }
    // osmanthus hair clip above her left ear (+x)
    const clipMat = M.get("clip");
    for (let k = 0; k < 6; k++) {
      const b = ball(0.0115, clipMat, 8, 6);
      const a = (58 + (k % 3) * 9) * D, lat = (20 + Math.floor(k / 3) * 10 + (k % 2) * 3) * D;
      b.position.set(Math.sin(a) * Math.cos(lat), Math.sin(lat), Math.cos(a) * Math.cos(lat)).multiplyScalar(HEAD_R * 1.12);
      skull.add(b);
    }
    // ---------------- arms (world-space IK every frame; meshes live under root's parent space)
    const mk = () => {
      const up = capsule(0.04, L1 - 0.03, sweater);
      const fore = capsule(0.035, 0.2, sweater);
      const hand = ball(HAND_R, skin, 14, 10);
      const sh = ball(0.052, sweater, 16, 10);
      const el = ball(0.039, sweater, 12, 8);
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.037, 0.05, 14), sweater);
      cuff.castShadow = true;
      return { up, fore, hand, sh, el, cuff };
    };
    this.arm = { R: mk(), L: mk() };
    // pen: origin at the tip, body along +y
    const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.0058, 0.0058, 0.125, 8), M.get("pen"));
    penBody.position.y = 0.0145 + 0.0625;
    const penTip = new THREE.Mesh(new THREE.ConeGeometry(0.0058, 0.0145, 8), M.get("pen"));
    penTip.rotation.x = Math.PI;
    penTip.position.y = 0.00725;
    this.pen.add(penBody, penTip);
    this.pen.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    this.noHeadShadows();
  }

  /** head parts never cast shadows: the moon's shadow map would stripe the face */
  noHeadShadows() {
    this.head.traverse((o) => ((o as THREE.Mesh).castShadow = false));
  }

  /** meshes that must be added to the scene root (arms + pen are posed in world space) */
  worldParts() {
    const a = this.arm;
    return [a.R.up, a.R.fore, a.R.hand, a.R.sh, a.R.el, a.R.cuff, a.L.up, a.L.fore, a.L.hand, a.L.sh, a.L.el, a.L.cuff, this.pen];
  }

  /* ---------------------------------------------------------------- acting curves */
  private spine(t: number) {
    const breathe = 0.9 * Math.sin((t / 3.6) * Math.PI * 2);
    const pitch = track(
      [[0, 14], [7.9, 14], [8.5, 8], [9.7, 8], [10.3, 5], [18.2, 5], [18.8, 2], [21.62, 2], [22.2, -9], [22.72, -8], [23.4, 4], [25.12, 4], [25.35, 0], [25.6, 3], [26.4, 2], [28, 3]],
      t,
    );
    const yaw = track([[0, 0], [9.7, 0], [10.3, -2], [18.2, -2], [18.8, 3], [21.1, 3], [21.5, -4], [21.62, -4], [22.2, 0], [28, 0]], t);
    const roll = track([[0, 0], [22.2, 0], [22.45, -3], [22.72, 2], [23.4, 0], [25.12, 0], [25.5, -2], [26.4, -1], [28, 0]], t);
    return { pitch: (pitch + breathe) * D, yaw: yaw * D, roll: roll * D };
  }

  private headAngles(t: number) {
    const writeBob = t < 6.4 ? 1.8 * Math.sin(t * Math.PI * 2 * 0.62) : 0;
    const pitch = track(
      [[0, 24], [6.3, 24], [6.6, 27], [7.9, 27], [8.35, 8], [8.8, 2], [9.7, 2], [10.25, -12], [11.9, -12], [12.6, -17], [15.4, -17], [16.2, -15], [18.25, -15], [18.8, -21], [21.12, -21], [21.4, 8], [21.62, 8], [22.2, -24], [22.72, -24], [23.4, -14], [25.12, -14], [25.4, -11], [26.4, -12], [28, -13]],
      t,
    );
    const yaw = track(
      [[0, 0], [6.3, 0], [6.6, -6], [7.9, -6], [8.8, 0], [12.0, 0], [12.6, -7], [15.4, -7], [16.2, 0], [18.25, 0], [18.8, 7], [21.12, 7], [21.4, -12], [21.62, -12], [22.2, 0], [23.4, 5], [28, 3]],
      t,
    );
    const roll = track(
      [[0, 0], [18.25, 0], [18.8, 5], [21.12, 5], [21.4, 0], [22.72, 0], [23.4, 3], [25.12, 3], [25.45, 10], [26.4, 7], [28, 6]],
      t,
    );
    return { pitch: (pitch + writeBob) * D, yaw: yaw * D, roll: roll * D };
  }

  private expression(t: number): Record<string, number> {
    // [start, kind] segments; crossfade 0.1 s at each boundary
    const seq: [number, string][] = [
      [0, "focus"], [9.72, "look"], [12.92, "blink"], [13.06, "look"], [16.8, "blink"], [16.94, "look"], [18.9, "blink"], [19.04, "look"],
      [19.55, "gaze"], [21.1, "look"], [21.66, "smile"], [22.95, "gaze"], [25.08, "smile"],
    ];
    const w: Record<string, number> = { focus: 0, look: 0, gaze: 0, smile: 0, blink: 0 };
    let i = 0;
    while (i < seq.length - 1 && t >= seq[i + 1][0]) i++;
    const cur = seq[i][1];
    const prev = i > 0 ? seq[i - 1][1] : cur;
    const u = i > 0 ? clamp01((t - seq[i][0]) / 0.1) : 1;
    w[cur] += u;
    w[prev] += 1 - u;
    return w;
  }

  /** writing: pen tip walks along lines on her right page (−x side) */
  private writingTip(t: number) {
    const period = 1.55;
    const k = Math.floor(t / period);
    const s = (t - k * period) / period;
    const line = k % 7;
    const xStart = BOOK.x - 0.03, xEnd = BOOK.x - 0.138;
    const z = BOOK.z + 0.075 - line * 0.021;
    const writeU = clamp01(s / 0.86);
    let x = lerp(xStart, xEnd, writeU);
    let y = BOOK.y + 0.0012;
    if (s > 0.86) {
      // carriage return: lifted, sliding back to the next line start
      const r = smooth((s - 0.86) / 0.14);
      x = lerp(xEnd, xStart, r);
      y += 0.012 * Math.sin(r * Math.PI);
    }
    // character-sized squiggles and tiny lifts between strokes
    x += 0.0035 * Math.sin(t * 43.0) + 0.002 * Math.sin(t * 71.0);
    const zz = z + 0.004 * Math.sin(t * 37.0 + 1.1);
    y += 0.0018 * Math.max(0, Math.sin(t * 29.0));
    return V(x, y, zz);
  }

  /** where the flipping page's free edge is (for the hand to ride) */
  static pageEdge(theta: number) {
    return V(BOOK.x - BOOK.pageW * Math.cos(theta), BOOK.y + 0.004 + BOOK.pageW * Math.sin(theta), BOOK.z - 0.07);
  }
  static flipAngle(t: number, t0: number, dur: number) {
    return Math.PI * smoother((t - t0) / dur);
  }

  private rightHand(t: number, penDirWrite: V3) {
    const rest = V(BOOK.x - 0.095, BOOK.y + 0.038, BOOK.z - 0.085);
    const deskRest = V(-0.15, DESK.top + HAND_R + 0.004, -0.665);
    const writeHand = this.writingTip(t).add(penDirWrite.clone().multiplyScalar(0.052));
    const edge0 = Girl.pageEdge(0).add(V(0, 0.03, 0));
    let pos: V3, penMode: "write" | "hold" | "rest" = "hold";
    let pole = V(-0.75, -1, -0.45);
    const [f1, f2] = HAND_FLIPS;
    const ride = (t0: number) => Girl.pageEdge(Girl.flipAngle(t, t0, HAND_FLIP_DUR)).add(V(0, 0.03, 0));
    if (t < 6.4) {
      pos = writeHand;
      penMode = "write";
    } else if (t < f1) {
      const u = smoother((t - 6.4) / (f1 - 6.4));
      pos = this.writingTip(6.4).add(penDirWrite.clone().multiplyScalar(0.052)).lerp(edge0, u);
      pos.y += 0.035 * Math.sin(u * Math.PI);
    } else if (t < f1 + HAND_FLIP_DUR * RELEASE) {
      pos = ride(f1);
    } else if (t < f2) {
      const a = Girl.pageEdge(Math.PI * smoother(RELEASE)).add(V(0, 0.03, 0));
      const u = smoother((t - (f1 + HAND_FLIP_DUR * RELEASE)) / (f2 - (f1 + HAND_FLIP_DUR * RELEASE)));
      pos = a.lerp(edge0, u);
      pos.y += 0.05 * Math.sin(u * Math.PI);
    } else if (t < f2 + HAND_FLIP_DUR * RELEASE) {
      pos = ride(f2);
    } else if (t < ACT.penDown[0]) {
      const a = Girl.pageEdge(Math.PI * smoother(RELEASE)).add(V(0, 0.03, 0));
      const u = smoother((t - (f2 + HAND_FLIP_DUR * RELEASE)) / 0.55);
      pos = a.lerp(rest, u);
      pos.y += 0.04 * Math.sin(u * Math.PI);
      pos.y += 0.002 * Math.sin(t * 1.7);
    } else if (t < ACT.stretch[0]) {
      // put the pen down, then hover
      const dst = V(PEN_REST.x + 0.02, DESK.top + 0.045, PEN_REST.z + 0.01);
      const u = smoother((t - ACT.penDown[0]) / (ACT.penDown[1] - ACT.penDown[0] - 0.08));
      pos = rest.clone().lerp(dst, u);
      pos.y += 0.05 * Math.sin(u * Math.PI);
      if (t > ACT.penDown[1]) pos.y += 0.015 * smooth((t - ACT.penDown[1]) / 0.12);
      penMode = t < ACT.penDown[1] - 0.08 ? "hold" : "rest";
    } else if (t < ACT.relax[1]) {
      const from = V(PEN_REST.x + 0.02, DESK.top + 0.06, PEN_REST.z + 0.01);
      const top = V(-0.21, 1.4, -1.08);
      const sway = t > ACT.stretch[1] - 0.4 ? 0.012 * Math.sin((t - ACT.stretch[1]) * 9) : 0;
      if (t < ACT.stretch[1]) {
        const u = smoother((t - ACT.stretch[0]) / (ACT.stretch[1] - 0.42 - ACT.stretch[0]));
        pos = from.lerp(top, u);
        pos.x += sway;
      } else {
        const u = smoother((t - ACT.relax[0]) / (ACT.relax[1] - ACT.relax[0]));
        pos = top.lerp(deskRest, u);
      }
      pole = V(-1, -0.1, 0.15).lerp(V(-0.75, -1, -0.45), t < ACT.stretch[1] ? 0 : smoother((t - ACT.relax[0]) / 0.5));
      if (t < ACT.stretch[0] + 0.25) pole = V(-0.75, -1, -0.45).lerp(V(-1, -0.1, 0.15), smoother((t - ACT.stretch[0]) / 0.25));
      penMode = "rest";
    } else {
      pos = deskRest.clone();
      pos.y += 0.0015 * Math.sin(t * 1.4);
      pole = V(-0.75, -1, -0.45);
      penMode = "rest";
    }
    return { pos, pole, penMode };
  }

  private leftHand(t: number) {
    const rest = V(BOOK.x + 0.1, BOOK.y + 0.035, BOOK.z - 0.08);
    const deskRest = V(0.15, DESK.top + HAND_R + 0.004, -0.665);
    const top = V(0.21, 1.4, -1.08);
    let pos: V3;
    let pole = V(0.75, -1, -0.45);
    if (t < ACT.stretch[0]) {
      pos = rest.clone();
      // the breeze startles her a little
      pos.y += 0.02 * Math.sin(clamp01((t - 7.95) / 0.8) * Math.PI);
      pos.y += 0.0015 * Math.sin(t * 1.3);
    } else if (t < ACT.stretch[1]) {
      const u = smoother((t - ACT.stretch[0]) / (ACT.stretch[1] - 0.42 - ACT.stretch[0]));
      pos = rest.clone().lerp(top, u);
      if (t > ACT.stretch[1] - 0.4) pos.x += 0.012 * Math.sin((t - ACT.stretch[1]) * 9);
      pole = V(0.75, -1, -0.45).lerp(V(1, -0.1, 0.15), smoother((t - ACT.stretch[0]) / 0.25));
    } else if (t < ACT.relax[1]) {
      const u = smoother((t - ACT.relax[0]) / (ACT.relax[1] - ACT.relax[0]));
      pos = top.clone().lerp(deskRest, u);
      pole = V(1, -0.1, 0.15).lerp(V(0.75, -1, -0.45), smoother(u * 1.5));
    } else {
      // cheer: a fist pump that lands with the seal, two little bounces, then down
      const up = V(0.17, 1.36, -0.9);
      const [c0, c1] = ACT.cheer, [d0, d1] = ACT.cheerDown;
      if (t < c0) pos = deskRest.clone();
      else if (t < c1) pos = deskRest.clone().lerp(up, smoother((t - c0) / (c1 - c0)));
      else if (t < d0) {
        pos = up.clone();
        const k = t - c1;
        pos.y += -0.04 * Math.sin((Math.min(k, 0.56) / 0.56) * Math.PI * 2) * Math.exp(-k * 2.0);
      } else pos = up.clone().lerp(deskRest, smoother((t - d0) / (d1 - d0)));
      pole = V(0.9, -1, 0.1);
    }
    return { pos, pole };
  }

  update(t: number) {
    // spine
    const sp = this.spine(t);
    this.torso.rotation.set(sp.pitch, sp.yaw, sp.roll, "YXZ");
    const ha = this.headAngles(t);
    this.headPivot.rotation.set(ha.pitch, ha.yaw, ha.roll, "YXZ");
    this.hairLong.rotation.set(-0.06 - sp.pitch * 0.35 + 0.012 * Math.sin(t * 1.3), 0.02 * Math.sin(t * 0.9), -sp.roll * 0.4);
    const ex = this.expression(t);
    for (const [k, m] of Object.entries(this.faces)) {
      (m.material as THREE.MeshLambertMaterial).opacity = ex[k];
      m.visible = ex[k] > 0.002;
    }
    this.root.updateMatrixWorld(true);
    // arms
    const penDirWrite = V(-0.32, 0.76, -0.56).normalize();
    const R = this.rightHand(t, penDirWrite);
    const L = this.leftHand(t);
    const out: Record<string, { hand: V3; elbow: V3; sh: V3 }> = {};
    for (const side of ["R", "L"] as const) {
      const sh = this.shoulderLocal[side].clone().applyMatrix4(this.torso.matrixWorld);
      const tgt = side === "R" ? R.pos : L.pos;
      const pole = side === "R" ? R.pole : L.pole;
      // keep the forearm ON the desk, never through it: if the solved elbow sinks the forearm,
      // swing the elbow backward/outward until it clears (choose the best candidate)
      let sol = solveIK(sh, tgt, pole);
      let best = forearmClearance(sol.elbow, sol.end);
      if (best < 0.001) {
        const sx = side === "R" ? -1 : 1;
        for (let k = 1; k <= 10; k++) {
          const p2 = pole.clone().normalize().lerp(V(sx * 0.8, 0.15, -1).normalize(), k / 10);
          const cand = solveIK(sh, tgt, p2);
          const c = forearmClearance(cand.elbow, cand.end);
          if (c > best) {
            best = c;
            sol = cand;
          }
          if (c >= 0.001) break;
        }
      }
      const { elbow, end } = sol;
      const a = this.arm[side];
      a.sh.position.copy(sh);
      span(a.up, sh, elbow);
      const wrist = elbow.clone().add(end.clone().sub(elbow).normalize().multiplyScalar(L2 - HAND_R * 0.9));
      span(a.fore, elbow, wrist);
      a.hand.position.copy(end);
      a.hand.quaternion.copy(a.fore.quaternion);
      a.hand.scale.set(1, 1.1, 0.85);
      a.el.position.copy(elbow);
      const fdir = end.clone().sub(elbow).normalize();
      a.cuff.position.copy(wrist).sub(fdir.clone().multiplyScalar(0.012));
      a.cuff.quaternion.setFromUnitVectors(Y_AXIS, fdir);
      out[side] = { hand: end, elbow, sh };
    }
    // pen
    let tip: V3;
    if (R.penMode === "write") {
      tip = out.R.hand.clone().sub(penDirWrite.clone().multiplyScalar(0.052));
      this.pen.position.copy(tip);
      this.pen.quaternion.setFromUnitVectors(Y_AXIS, penDirWrite);
    } else if (R.penMode === "hold") {
      const fore = out.R.hand.clone().sub(out.R.elbow).normalize();
      const dir = penDirWrite.clone().lerp(fore.clone().negate().add(V(0, 0.9, 0)).normalize(), 0.35).normalize();
      tip = out.R.hand.clone().sub(dir.clone().multiplyScalar(0.052));
      this.pen.position.copy(tip);
      this.pen.quaternion.setFromUnitVectors(Y_AXIS, dir);
    } else {
      // lying on the desk
      tip = V(PEN_REST.x + 0.05, DESK.top + 0.0059, PEN_REST.z - 0.02);
      this.pen.position.copy(tip);
      const dir = V(-0.62, 0, -0.78).normalize();
      this.pen.quaternion.setFromUnitVectors(Y_AXIS, dir);
    }
    const headW = new THREE.Vector3();
    this.head.getWorldPosition(headW);
    this.probe = {
      hands: { R: out.R.hand, L: out.L.hand },
      handR: HAND_R,
      forearms: { R: [out.R.elbow, out.R.hand], L: [out.L.elbow, out.L.hand] },
      penTip: tip,
      penMode: R.penMode,
      head: headW,
      headR: HEAD_R,
    };
    return this.probe;
  }
}
