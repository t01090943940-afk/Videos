import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Prims } from "../looks/types";
import type { WorldManifest, WorldState } from "../runtime/types";
import { Puppet, type AnchorLookup } from "../runtime/rig";
import { rng } from "../runtime/rng";
import { PROPS, type PropBuild } from "./props";

/**
 * THE SANDBOX. A bounded loft studio built once per look from semantic primitives.
 * Everything an episode can touch is exposed as a handle; nothing here knows about shots.
 *
 * Room: x ∈ [-9, 9], z ∈ [-5, 4.6], ceiling beams at 4.3. Back wall (z = -5) holds four tall
 * windows with the sun behind them; the other three walls are WILD WALLS — hidden whenever the
 * camera stands outside them, exactly like flats on a real stage.
 */
export interface Holdable {
  obj: THREE.Object3D;
  home: THREE.Object3D;
  homePos: THREE.Vector3;
  homeRot: THREE.Euler;
  holdPos: THREE.Vector3;
  holdRot: THREE.Euler;
}

export interface StudioHandles {
  root: THREE.Group;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  bounce: THREE.DirectionalLight;
  actors: Record<string, Puppet>;
  seatTop: Record<string, number>;
  anchors: (actor: string) => AnchorLookup;
  deskAnchors: Record<string, Record<string, THREE.Object3D>>;
  holdables: Record<string, Holdable>;
  enterKeys: Record<string, THREE.Object3D>;
  plantLeaves: Record<string, THREE.Object3D>;
  practicals: { lamps: THREE.PointLight[]; neon: THREE.PointLight[]; pendants: THREE.PointLight[] };
  wild: { obj: THREE.Object3D; point: THREE.Vector3; normal: THREE.Vector3 }[];
  ceiling: THREE.Object3D;
  beams: THREE.Object3D[];
  dust: THREE.Points;
  drops: THREE.Points;
  backdrop: THREE.Mesh;
  windowGlass: THREE.Mesh[];
  colliders: THREE.Mesh[];
  screens: THREE.Mesh[];
}

const HOLD: Record<string, { pos: [number, number, number]; rot: [number, number, number] }> = {
  mug: { pos: [0, -0.05, 0.07], rot: [0, -Math.PI / 2, 0] },
  sheet: { pos: [0, 0.03, 0.06], rot: [0, 0, 0] },
  stylus: { pos: [0, 0.0, 0.03], rot: [0, 0, 0] },
  can: { pos: [0, 0.0, 0.03], rot: [0, 0, 0] },
};

export function buildStudio(P: Prims, world: WorldManifest, variant: string, colliders: THREE.Mesh[], screens: THREE.Mesh[]): StudioHandles {
  const root = new THREE.Group();
  const night = variant === "night";
  const r = rng(1234);
  const put = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number, parent: THREE.Object3D = root) => {
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };
  const wild: StudioHandles["wild"] = [];

  // ── shell ───────────────────────────────────────────────────────────────
  put(P.box(19.2, 0.3, 10.4, "woodDark"), 0, -0.15, -0.2); // set platform (the diorama base)
  put(P.box(18.4, 0.02, 9.6, "floor"), 0, 0.01, -0.2);
  put(P.box(12, 0.012, 2.4, "fabric:#6b3f3a"), 0, 0.02, -0.25); // long rug under the desks

  // back wall with four tall windows (x centers), openings y 0.8..3.9
  const back = new THREE.Group();
  root.add(back);
  const winX = [-6.3, -2.1, 2.1, 6.3], winW = 3.0, y0 = 0.8, y1 = 3.9, H = 4.4, BZ = -5;
  put(P.box(18.4, y0, 0.3, "brick"), 0, y0 / 2, BZ, back);
  put(P.box(18.4, H - y1, 0.3, "brick"), 0, (H + y1) / 2, BZ, back);
  const edges = [-9.2, ...winX.flatMap((x) => [x - winW / 2, x + winW / 2]), 9.2];
  for (let i = 0; i < edges.length; i += 2) {
    const w = edges[i + 1] - edges[i];
    if (w > 0.01) put(P.box(w, y1 - y0, 0.3, "brick"), (edges[i] + edges[i + 1]) / 2, (y0 + y1) / 2, BZ, back);
  }
  const windowGlass: THREE.Mesh[] = [];
  for (const x of winX) {
    // steel mullions: 3 columns x 4 rows
    for (let c = 0; c <= 3; c++) put(P.box(0.06, y1 - y0, 0.08, "metalDark"), x - winW / 2 + (c * winW) / 3, (y0 + y1) / 2, BZ + 0.1, back);
    for (let k = 0; k <= 4; k++) put(P.box(winW, 0.06, 0.08, "metalDark"), x, y0 + (k * (y1 - y0)) / 4, BZ + 0.1, back);
    put(P.box(winW + 0.2, 0.1, 0.3, "plaster"), x, y0 - 0.05, BZ + 0.2, back); // sill
    const glass = put(P.plane(winW, y1 - y0, "glass", { cast: false, receive: false }), x, (y0 + y1) / 2, BZ + 0.06, back);
    glass.userData.noOutline = true;
    windowGlass.push(glass);
  }
  // painted backdrop behind the windows
  const backdrop = put(P.plane(70, 26, "backdrop", { cast: false, receive: false }), 0, 7, -22);

  // wild walls: front (z = 4.6), left (x = -9.2), right (x = 9.2)
  const front = new THREE.Group();
  root.add(front);
  put(P.box(18.4, H, 0.3, "plaster"), 0, H / 2, 4.75, front);
  put(P.box(1.1, 2.2, 0.08, "wood"), 6.8, 1.1, 4.58, front); // door
  put(P.box(3.4, 1.4, 0.05, "whiteboard"), -1.2, 1.7, 4.58, front);
  for (let i = 0; i < 7; i++) put(P.box(0.35 + r() * 0.8, 0.02, 0.012, "plasticDark:#3a5fa8"), -2.4 + r() * 1.8, 1.25 + r() * 0.9, 4.55, front);
  // six style posters (one per look) on the front wall
  const posterCols = ["#57b36a", "#e3a33a", "#c8423a", "#eeece6", "#b36bff", "#8fc4ae"];
  posterCols.forEach((c, i) => {
    const px = 1.6 + (i % 3) * 1.1, py = i < 3 ? 2.5 : 1.35;
    put(P.box(0.9, 0.95, 0.02, "paper"), px, py, 4.58, front);
    put(P.box(0.72, 0.5, 0.012, `paper:${c}`), px, py + 0.12, 4.565, front);
    put(P.box(0.5, 0.06, 0.012, "paper:#26292f"), px, py - 0.28, 4.565, front);
  });
  wild.push({ obj: front, point: new THREE.Vector3(0, 0, 4.6), normal: new THREE.Vector3(0, 0, -1) });

  const left = new THREE.Group();
  root.add(left);
  put(P.box(0.3, H, 9.9, "brick"), -9.35, H / 2, -0.2, left);
  const tv = put(P.plane(3.2, 1.8, "tv:0", { cast: false }), -9.13, 2.3, -0.4, left);
  tv.rotation.y = Math.PI / 2;
  put(P.box(0.08, 1.95, 3.35, "plasticDark"), -9.2, 2.3, -0.4, left);
  for (let s = 0; s < 3; s++) {
    put(P.box(0.3, 0.04, 1.6, "wood"), -9.05, 0.6 + s * 0.45, 2.9, left);
    for (let b = 0; b < 8; b++) {
      const h = 0.22 + r() * 0.14;
      put(P.box(0.2, h, 0.06, `paper:${["#c8423a", "#3f9ad6", "#f2c14e", "#2f8f83", "#eeece6"][b % 5]}`), -9.05, 0.62 + s * 0.45 + h / 2, 2.2 + b * 0.09 + r() * 0.03, left);
    }
  }
  wild.push({ obj: left, point: new THREE.Vector3(-9.2, 0, 0), normal: new THREE.Vector3(1, 0, 0) });

  const right = new THREE.Group();
  root.add(right);
  put(P.box(0.3, H, 9.9, "plaster"), 9.35, H / 2, -0.2, right);
  put(P.box(0.4, 2.2, 1.8, "woodDark"), 9.0, 1.1, 1.6, right);
  for (let s = 0; s < 4; s++) for (let b = 0; b < 10; b++) {
    const h = 0.2 + r() * 0.16;
    put(P.box(0.24, h, 0.12, `paper:${["#c8423a", "#3f9ad6", "#f2c14e", "#2f8f83", "#eeece6", "#b36bff"][(b + s) % 6]}`), 8.86, 0.3 + s * 0.5 + h / 2, 0.85 + b * 0.15, right);
  }
  wild.push({ obj: right, point: new THREE.Vector3(9.2, 0, 0), normal: new THREE.Vector3(-1, 0, 0) });

  // ceiling: beams + pendant lamps (hidden when the camera rises above them)
  const ceiling = new THREE.Group();
  root.add(ceiling);
  for (let i = 0; i < 7; i++) put(P.box(18.4, 0.22, 0.16, "woodDark"), 0, 4.3, -4.4 + i * 1.5, ceiling);
  const pendants: THREE.PointLight[] = [];
  for (const x of [-4.4, 0, 4.4]) {
    put(P.cyl(0.006, 0.006, 1.6, "metalDark", { seg: 6 }), x, 3.5, 0.4, ceiling);
    put(P.cyl(0.08, 0.28, 0.24, "metalDark", { seg: 18 }), x, 2.6, 0.4, ceiling);
    put(P.sphere(0.07, "glow", { cast: false }), x, 2.5, 0.4, ceiling);
    const pl = new THREE.PointLight("#ffd29a", night ? 5 : 0, 6, 1.6);
    put(pl, x, 2.4, 0.4, ceiling);
    pendants.push(pl);
  }

  // floor dressing: big plants, bean bag
  for (const [x, z, s] of [[-8.2, -4.2, 3.2], [8.2, -4.1, 3.6], [-8.3, 3.8, 2.6]] as const) {
    const pb = PROPS.plant(P, { size: s, seed: Math.floor(x * 10) });
    put(pb.root, x, 0, z);
  }
  put(P.box(0.9, 0.5, 0.9, "fabric:#d0633d"), 7.6, 0.25, 3.2).rotation.y = 0.4;
  put(P.box(0.7, 0.3, 0.2, "fabric:#d0633d"), 7.7, 0.62, 3.55).rotation.set(-0.3, 0.4, 0);

  // ── desks, props, actors ────────────────────────────────────────────────
  const actors: Record<string, Puppet> = {};
  const seatTop: Record<string, number> = {};
  const deskAnchors: StudioHandles["deskAnchors"] = {};
  const holdables: Record<string, Holdable> = {};
  const enterKeys: Record<string, THREE.Object3D> = {};
  const plantLeaves: Record<string, THREE.Object3D> = {};
  const lamps: THREE.PointLight[] = [], neon: THREE.PointLight[] = [];

  for (const [deskId, d] of Object.entries(world.desks)) {
    const g = put(new THREE.Group(), d.x, 0, d.z);
    const anchors: Record<string, THREE.Object3D> = {};
    for (const it of d.items) {
      const b: PropBuild = PROPS[it.type](P, { ...(it.params ?? {}), night });
      b.root.position.set(it.at[0], it.y ?? 0, it.at[1]);
      b.root.rotation.y = ((it.yaw ?? 0) * Math.PI) / 180;
      g.add(b.root);
      Object.assign(anchors, b.anchors);
      if (b.parts?.enter) enterKeys[d.actor] = b.parts.enter;
      if (b.parts?.leaves && deskId !== undefined) plantLeaves[d.actor] = b.parts.leaves;
      if (b.parts?.light) (it.type === "neonSign" ? neon : lamps).push(b.parts.light as THREE.PointLight);
      for (const [name, obj] of Object.entries(b.holdables ?? {})) {
        const home = obj.parent!;
        const hp = HOLD[name] ?? { pos: [0, 0, 0], rot: [0, 0, 0] };
        holdables[name] = {
          obj, home, homePos: obj.position.clone(), homeRot: obj.rotation.clone(),
          holdPos: new THREE.Vector3(...hp.pos), holdRot: new THREE.Euler(...hp.rot),
        };
      }
    }
    const ch = PROPS.chair(P, { color: d.chair });
    ch.root.position.set(0, 0, -0.6);
    g.add(ch.root);
    deskAnchors[deskId] = anchors;

    const a = world.actors[d.actor];
    const pup = new Puppet(P, d.actor, a.costume);
    const mk = world.marks[a.mark];
    pup.root.position.set(...mk.pos);
    pup.root.rotation.y = (mk.yaw * Math.PI) / 180;
    root.add(pup.root);
    actors[d.actor] = pup;
    seatTop[d.actor] = 0.46;
  }

  // ── lights (looks set colors/intensities) ───────────────────────────────
  const sun = new THREE.DirectionalLight("#fff1d6", 3);
  sun.position.set(-6, 14, -24);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -14; sc.right = 14; sc.top = 12; sc.bottom = -12; sc.near = 1; sc.far = 60;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  root.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight("#dfe9f5", "#8a6a50", 1.2);
  root.add(hemi);
  const bounce = new THREE.DirectionalLight("#ffe2c4", 0.6); // soft front fill (the "open 4th wall")
  bounce.position.set(2, 3, 10);
  root.add(bounce);

  // god-ray shafts along the sun direction from each window (additive, no outline)
  const beams: THREE.Object3D[] = [];
  const sunDir = new THREE.Vector3().subVectors(sun.target.position, sun.position).normalize();
  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color("#ffe6b8") }, uStrength: { value: 0.1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uStrength; varying vec2 vUv;
      void main(){ float a = smoothstep(0., .25, vUv.y) * smoothstep(1., .55, vUv.y) * smoothstep(0., .2, vUv.x) * smoothstep(1., .8, vUv.x);
      gl_FragColor = vec4(uColor * a * uStrength, 1.); }`,
  });
  for (const x of winX) {
    const len = 9;
    const bm = new THREE.Mesh(new THREE.PlaneGeometry(winW * 0.95, len), beamMat);
    const start = new THREE.Vector3(x, (y0 + y1) / 2 + 0.3, BZ + 0.2);
    bm.position.copy(start).addScaledVector(sunDir, len / 2);
    bm.lookAt(bm.position.clone().add(new THREE.Vector3(1, 0, 0)));
    bm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sunDir.clone().negate());
    bm.userData.noOutline = true;
    bm.renderOrder = 5;
    root.add(bm);
    beams.push(bm);
  }

  // dust motes in the sun (continuous clock) and water drops (Rin's can)
  const dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: "#fff3d6", size: 0.014, transparent: true, opacity: 0.55, depthWrite: false }));
  dust.geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(260 * 3), 3));
  dust.userData.seed = Array.from({ length: 260 }, () => [r() * 16 - 8, r() * 3.4 + 0.3, r() * 4.5 - 4.8, r()]);
  dust.frustumCulled = false;
  root.add(dust);
  const drops = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: "#8fd0ff", size: 0.02, transparent: true, opacity: 0.9, depthWrite: false }));
  drops.geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(60 * 3), 3));
  drops.frustumCulled = false;
  drops.visible = false;
  root.add(drops);

  const anchorsFor = (actor: string): AnchorLookup => {
    const deskId = world.actors[actor].desk!;
    return (name: string) => deskAnchors[deskId][name];
  };

  bakeStatic(root);
  return {
    root, sun, hemi, bounce, actors, seatTop, anchors: anchorsFor, deskAnchors, holdables, enterKeys, plantLeaves,
    practicals: { lamps, neon, pendants }, wild, ceiling, beams, dust, drops, backdrop, windowGlass, colliders, screens,
  };
}

/** Per-frame, state-driven world updates (held props, key presses, plant, particles). */
export function updateStudio(h: StudioHandles, state: WorldState, t: number, absT: number, pourSince: number | null) {
  // holdables follow state: "home" or "<actor>.<R|L>"
  for (const [name, hd] of Object.entries(h.holdables)) {
    const v = String(state[`hold.${name}`] ?? "home");
    if (v === "home") {
      if (hd.obj.parent !== hd.home) hd.home.add(hd.obj);
      hd.obj.position.copy(hd.homePos);
      hd.obj.rotation.copy(hd.homeRot);
    } else {
      const [actor, side] = v.split(".");
      const sock = h.actors[actor].socket[side as "L" | "R"];
      if (hd.obj.parent !== sock) sock.add(hd.obj);
      hd.obj.position.copy(hd.holdPos);
      hd.obj.rotation.copy(hd.holdRot);
    }
  }
  // enter keys depress when a hand tip touches them (derived, never keyed by hand)
  const tip = new THREE.Vector3(), key = new THREE.Vector3();
  for (const [actor, k] of Object.entries(h.enterKeys)) {
    k.position.y = 0.75 + 0.022;
    h.actors[actor].tip("R", tip);
    k.getWorldPosition(key);
    if (tip.distanceTo(key) < 0.035) k.position.y -= 0.005;
  }
  // plants perk up after watering
  for (const [actor, leaves] of Object.entries(h.plantLeaves)) {
    const perk = actor === "rin" && state["plant.watered"] ? 1 : 0;
    leaves.scale.set(1, 0.82 + 0.26 * perk, 1);
  }
  // dust motes drift on the continuous clock
  const pa = h.dust.geometry.getAttribute("position") as THREE.BufferAttribute;
  (h.dust.userData.seed as number[][]).forEach(([x, y, z, ph], i) => {
    pa.setXYZ(i, x + Math.sin(absT * 0.2 + ph * 6) * 0.3, ((y + absT * 0.05 * (0.5 + ph)) % 3.8) + 0.2, z + Math.cos(absT * 0.17 + ph * 9) * 0.3);
  });
  pa.needsUpdate = true;
  // water drops from Rin's spout while pouring
  h.drops.visible = !!state["rin.pour"];
  if (h.drops.visible && h.holdables.can) {
    const spout = h.deskAnchors.desk6?.spout;
    if (spout) {
      const s = spout.getWorldPosition(new THREE.Vector3());
      const da = h.drops.geometry.getAttribute("position") as THREE.BufferAttribute;
      const since = pourSince ?? 0;
      for (let i = 0; i < da.count; i++) {
        const ph = (i / da.count + since * 2.2) % 1;
        da.setXYZ(i, s.x + Math.sin(i * 12.9) * 0.012, s.y - ph * 0.28, s.z + Math.cos(i * 7.3) * 0.012 + ph * 0.03);
      }
      da.needsUpdate = true;
    }
  }
}

/** Wild walls + ceiling hide when the camera must shoot through them (real stage practice). */
export function updateWildWalls(h: StudioHandles, camPos: THREE.Vector3) {
  for (const w of h.wild) w.obj.visible = camPos.clone().sub(w.point).dot(w.normal) > 0;
  h.ceiling.visible = camPos.y < 4.1 && camPos.z < 4.6;
}

/**
 * Merge every static mesh into one batch per material: ~1000 meshes → a few dozen draw calls.
 * Dynamic meshes (puppets, held props, screens, key caps) and helper objects stay separate.
 */
function bakeStatic(root: THREE.Group) {
  root.updateMatrixWorld(true);
  const groups = new Map<string, { mat: THREE.Material; geos: THREE.BufferGeometry[]; cast: boolean; receive: boolean; noOutline: boolean }>();
  const remove: THREE.Mesh[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.userData.dynamic || m.userData.collider || Array.isArray(m.material)) return;
    if ((m.material as THREE.Material).type === "ShaderMaterial") return;
    let p: THREE.Object3D | null = m.parent;
    while (p) {
      if (p.userData.keepSeparate || p.name.startsWith("actor:")) return;
      p = p.parent;
    }
    const key = `${(m.material as THREE.Material).uuid}|${m.castShadow}|${m.receiveShadow}|${!!m.userData.noOutline}|${wildOf(m)}`;
    let g = groups.get(key);
    if (!g) groups.set(key, (g = { mat: m.material as THREE.Material, geos: [], cast: m.castShadow, receive: m.receiveShadow, noOutline: !!m.userData.noOutline }));
    let geo = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
    for (const k of Object.keys(geo.attributes)) if (!["position", "normal", "uv"].includes(k)) geo.deleteAttribute(k);
    geo.applyMatrix4(m.matrixWorld);
    g.geos.push(geo);
    remove.push(m);
  });
  const wildGroups = new Map<string, THREE.Object3D>();
  root.traverse((o) => {
    if (o.parent === root && (o as THREE.Group).isGroup) wildGroups.set(o.uuid, o);
  });
  for (const m of remove) m.parent?.remove(m);
  for (const [key, g] of groups) {
    const merged = mergeGeometries(g.geos, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, g.mat);
    mesh.castShadow = g.cast;
    mesh.receiveShadow = g.receive;
    mesh.userData.noOutline = g.noOutline;
    const wid = key.split("|")[4];
    (wid && wildGroups.get(wid) ? wildGroups.get(wid)! : root).add(mesh);
    // merged vertices are already in world space; parent groups must be identity for this
    mesh.matrixAutoUpdate = true;
  }
}

/** which top-level group (wall/ceiling) a mesh belongs to, so merged batches keep hide-ability */
function wildOf(m: THREE.Object3D) {
  let p: THREE.Object3D | null = m;
  while (p && p.parent && p.parent.parent) p = p.parent;
  if (p && p.parent && (p as THREE.Group).isGroup && p.position.lengthSq() === 0 && p.rotation.x === 0 && p.rotation.y === 0) return p.uuid;
  return "";
}
