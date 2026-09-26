import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { faceTexture } from '../materials/textures';
import { DEG } from '../core/math';

// Stop-motion puppet: a real-proportion worker built on an armature of joints (like a ball-and-socket wire armature).
// Full PPE: ABS helmet with adjustable chin strap, hi-vis vest with retro-reflective bands, full-body 5-point harness
// with dorsal D-ring, cotton work gloves, work boots. Facing +Z, standing on y=0, 1.72m tall.

export const JOINTS = [
  'hips', 'spine', 'chest', 'neck', 'head',
  'shoulderL', 'upperArmL', 'forearmL', 'handL',
  'shoulderR', 'upperArmR', 'forearmR', 'handR',
  'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR',
] as const;
export type Joint = (typeof JOINTS)[number];
export type JointRot = Partial<Record<Joint, [number, number, number]>>; // degrees XYZ

export interface PuppetStyle {
  name: string;
  helmet: number;         // colour
  shirt: number; pants: number; vest: number;
  face: 'zhou' | 'li' | 'lin' | 'generic';
  seed: number;
  scale?: number;
  harness?: boolean;
  moustache?: boolean;
}

export const STYLES: Record<string, PuppetStyle> = {
  zhou: { name: '老周', helmet: 0xf5c400, shirt: 0x3d5a80, pants: 0x2b3345, vest: 0xff6d00, face: 'zhou', seed: 11, harness: true, moustache: true },
  li: { name: '小李', helmet: 0xf5c400, shirt: 0x6b6f75, pants: 0x3a3f48, vest: 0xc6ff00, face: 'li', seed: 12, scale: 1.03, harness: true },
  lin: { name: '安全员', helmet: 0xd32f2f, shirt: 0xf0f0f0, pants: 0x2d3440, vest: 0xc6ff00, face: 'lin', seed: 13, harness: false },
};

const mats = new Map<string, THREE.Material>();
function mat(key: string, make: () => THREE.Material) { if (!mats.has(key)) mats.set(key, make()); return mats.get(key)!; }
const fabric = (c: number) => mat('fab' + c, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.92 }));
const plastic = (c: number) => mat('pl' + c, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.35 }));
const reflective = () => mat('refl', () => new THREE.MeshStandardMaterial({ color: 0xd9dcdf, roughness: 0.35, metalness: 0.55 }));
const webbing = (c: number) => mat('web' + c, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
const metal = () => mat('metal', () => new THREE.MeshStandardMaterial({ color: 0xb8bcc2, roughness: 0.3, metalness: 0.9 }));
const rubber = () => mat('rub', () => new THREE.MeshStandardMaterial({ color: 0x1e1c1a, roughness: 0.85 }));
const leather = () => mat('lea', () => new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 0.7 }));
const glove = () => mat('glove', () => new THREE.MeshStandardMaterial({ color: 0xece8dc, roughness: 1 }));
const eyeMat = () => mat('eye', () => new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.08, clearcoat: 1 }));
const hairMat = () => mat('hair', () => new THREE.MeshStandardMaterial({ color: 0x1d1a18, roughness: 0.9 }));

function capsule(r: number, len: number, m: THREE.Material, taper = 1): THREE.Mesh {
  // limb segment hanging down from its joint (0 → -len); taper < 1 narrows the far end
  const pts: THREE.Vector2[] = [];
  const n = 8;
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * r * taper, -len - Math.cos(a) * r * taper + r * taper)); }
  for (let i = n; i >= 0; i--) { const a = (i / n) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * r, Math.cos(a) * r - r)); }
  pts.reverse();
  const g = new THREE.LatheGeometry(pts, 12);
  g.translate(0, r * 0.3, 0);
  const mesh = new THREE.Mesh(g, m); mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}
function rbox(w: number, h: number, d: number, m: THREE.Material, r = 0.03): THREE.Mesh {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3)), m);
  mesh.castShadow = mesh.receiveShadow = true; return mesh;
}
function place<T extends THREE.Object3D>(o: T, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0): T { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); return o; }

export class Puppet {
  root = new THREE.Group();
  /** tilt pivot (for falls) sits under root; body hangs from it */
  tilt = new THREE.Group();
  body = new THREE.Group();
  j = {} as Record<Joint, THREE.Group>;
  rest = {} as Record<Joint, THREE.Vector3>;
  helmet!: THREE.Group;
  chinStrap!: { fastened: THREE.Group; loose: THREE.Group };
  eyelids: THREE.Mesh[] = [];
  dRing = new THREE.Object3D();       // dorsal attachment point
  hipLoop = new THREE.Object3D();     // where a stowed lanyard hook is parked
  sampleNames: string[] = [];
  samplePts: THREE.Object3D[] = [];   // collision sample points
  style: PuppetStyle;

  constructor(style: PuppetStyle) {
    this.style = style;
    this.root.name = style.name;
    this.root.add(this.tilt); this.tilt.add(this.body);
    const s = style.scale ?? 1;
    this.body.scale.setScalar(s);
    const J = (name: Joint, parent: THREE.Object3D, x: number, y: number, z: number) => {
      const g = new THREE.Group(); g.name = name; g.position.set(x, y, z); parent.add(g); this.j[name] = g; this.rest[name] = g.position.clone(); return g;
    };
    const shirt = fabric(style.shirt), pants = fabric(style.pants), vest = fabric(style.vest);
    const skin = mat('skin' + style.face, () => new THREE.MeshStandardMaterial({ color: style.face === 'zhou' ? 0xa87050 : 0xc99070, roughness: 0.75 }));

    // ---------------- armature
    const hips = J('hips', this.body, 0, 0.96, 0);
    const spine = J('spine', hips, 0, 0.08, 0);
    const chest = J('chest', spine, 0, 0.2, 0);
    const neck = J('neck', chest, 0, 0.23, -0.01);
    const head = J('head', neck, 0, 0.06, 0.01);
    const shL = J('shoulderL', chest, 0.12, 0.17, 0), shR = J('shoulderR', chest, -0.12, 0.17, 0);
    const uaL = J('upperArmL', shL, 0.085, 0, 0), uaR = J('upperArmR', shR, -0.085, 0, 0);
    const faL = J('forearmL', uaL, 0, -0.28, 0), faR = J('forearmR', uaR, 0, -0.28, 0);
    const hdL = J('handL', faL, 0, -0.25, 0), hdR = J('handR', faR, 0, -0.25, 0);
    const thL = J('thighL', hips, 0.095, -0.05, 0), thR = J('thighR', hips, -0.095, -0.05, 0);
    const snL = J('shinL', thL, 0, -0.42, 0), snR = J('shinR', thR, 0, -0.42, 0);
    const ftL = J('footL', snL, 0, -0.42, 0), ftR = J('footR', snR, 0, -0.42, 0);

    // ---------------- pelvis & legs (work trousers with knee pads, boots)
    hips.add(place(rbox(0.33, 0.2, 0.22, pants, 0.07), 0, -0.02, 0));
    hips.add(place(rbox(0.345, 0.045, 0.235, leather(), 0.015), 0, 0.07, 0));           // belt
    hips.add(place(rbox(0.05, 0.035, 0.012, metal(), 0.005), 0, 0.07, 0.12));           // buckle
    for (const [th, sn, ft, side] of [[thL, snL, ftL, 1], [thR, snR, ftR, -1]] as const) {
      th.add(capsule(0.078, 0.42, pants, 0.82));
      th.add(place(rbox(0.07, 0.1, 0.02, pants, 0.01), side * 0.07, -0.18, 0.02, 0, side * 0.9, 0)); // side pocket
      sn.add(capsule(0.06, 0.42, pants, 0.8));
      sn.add(place(rbox(0.1, 0.09, 0.03, fabric(0x1f232b), 0.012), 0, -0.02, 0.06));      // knee patch
      // boot: shaft + upper + sole, toe forward (+z)
      ft.add(place(capsule(0.056, 0.06, leather(), 1), 0, 0.1, 0));
      ft.add(place(rbox(0.105, 0.085, 0.27, leather(), 0.035), 0, -0.02, 0.05));
      ft.add(place(rbox(0.112, 0.03, 0.285, rubber(), 0.012), 0, -0.065, 0.05));
      for (let k = 0; k < 3; k++) ft.add(place(rbox(0.1, 0.006, 0.01, rubber(), 0.002), 0, 0.022, 0.0 + k * 0.03)); // laces
    }

    // ---------------- torso: shirt, vest with reflective bands, harness
    spine.add(place(rbox(0.31, 0.22, 0.2, shirt, 0.07), 0, 0.08, 0));
    chest.add(place(rbox(0.37, 0.3, 0.22, shirt, 0.09), 0, 0.08, 0));
    for (const side of [1, -1]) { const d = place(new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), shirt), side * 0.165, 0.17, 0); d.scale.set(1, 0.85, 1); d.castShadow = true; chest.add(d); } // deltoids
    const vestBody = place(rbox(0.385, 0.42, 0.235, vest, 0.08), 0, 0.02, 0);
    chest.add(vestBody);
    spine.add(place(rbox(0.33, 0.16, 0.215, vest, 0.07), 0, 0.03, 0));
    for (const y of [-0.08, 0.05]) {
      chest.add(place(rbox(0.392, 0.03, 0.24, reflective(), 0.012), 0, y, 0));
    }
    for (const x of [0.09, -0.09]) {
      chest.add(place(rbox(0.035, 0.34, 0.012, reflective(), 0.006), x, 0.08, 0.118));
      chest.add(place(rbox(0.035, 0.34, 0.012, reflective(), 0.006), x, 0.08, -0.118));
    }
    chest.add(place(rbox(0.08, 0.035, 0.012, plastic(0x222222), 0.006), -0.08, 0.16, 0.12)); // name badge
    if (style.harness) {
      const w = webbing(0x111111), y2 = webbing(0xffc400);
      for (const x of [0.07, -0.07]) {
        chest.add(place(rbox(0.04, 0.36, 0.012, w, 0.005), x, 0.08, 0.124));                    // front straps
        chest.add(place(rbox(0.04, 0.36, 0.012, w, 0.005), x * 0.5, 0.08, -0.124, 0, 0, x > 0 ? 0.2 : -0.2)); // back X
        chest.add(place(rbox(0.04, 0.012, 0.24, w, 0.005), x * 1.2, 0.235, 0));                  // over shoulders
      }
      chest.add(place(rbox(0.2, 0.035, 0.012, y2, 0.005), 0, 0.06, 0.128));                    // chest strap
      chest.add(place(rbox(0.035, 0.02, 0.012, metal(), 0.004), 0, 0.06, 0.134));
      hips.add(place(rbox(0.35, 0.05, 0.24, w, 0.01), 0, 0.02, 0));                            // waist belt
      for (const [th, side] of [[thL, 1], [thR, -1]] as const) {
        th.add(place(new THREE.Mesh(new THREE.TorusGeometry(0.083, 0.012, 6, 16), y2), 0, -0.1, 0, Math.PI / 2 - 0.2, 0, side * 0.1));
      }
      const dr = place(new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 6, 14), metal()), 0, 0.17, -0.132, 0, 0, 0);
      dr.castShadow = true; chest.add(dr);
      this.dRing.position.set(0, 0.15, -0.14); chest.add(this.dRing);
      this.hipLoop.position.set(0.16, 0.0, -0.06); hips.add(this.hipLoop);
    }

    // ---------------- arms (sleeves), gloves
    for (const [ua, fa, hd, side] of [[uaL, faL, hdL, 1], [uaR, faR, hdR, -1]] as const) {
      ua.add(capsule(0.056, 0.28, shirt, 0.85));
      fa.add(capsule(0.047, 0.25, shirt, 0.8));
      fa.add(place(capsule(0.05, 0.03, glove(), 1), 0, -0.21, 0));                              // glove cuff
      const palm = place(rbox(0.085, 0.1, 0.035, glove(), 0.015), 0, -0.055, 0.0); hd.add(palm);
      const fingers = new THREE.Group(); fingers.name = 'fingers'; fingers.position.set(0, -0.1, 0); hd.add(fingers);
      fingers.add(place(rbox(0.082, 0.07, 0.03, glove(), 0.013), 0, -0.03, 0.0));
      hd.add(place(capsule(0.014, 0.05, glove(), 0.9), side * -0.04, -0.03, 0.022, 0.6, 0, side * 0.6));
    }

    // ---------------- head
    const face = new THREE.SphereGeometry(0.108, 28, 20); face.rotateY(-Math.PI / 2);
    const headMesh = new THREE.Mesh(face, mat('face' + style.face, () => new THREE.MeshStandardMaterial({ map: faceTexture(style.face, style.seed), roughness: 0.7 })));
    headMesh.scale.set(0.95, 1.12, 1.0); headMesh.position.y = 0.1; headMesh.castShadow = true; head.add(headMesh);
    neck.add(place(capsule(0.05, 0.08, skin, 1), 0, 0.08, 0));
    // jaw
    { const jaw = place(new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), skin), 0, 0.045, 0.03); jaw.scale.set(1.15, 0.8, 1.0); head.add(jaw); }
    for (const side of [1, -1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), skin); ear.scale.set(0.5, 1, 0.8); place(ear, side * 0.102, 0.1, -0.005); head.add(ear);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.0125, 12, 8), eyeMat()); place(eye, side * 0.037, 0.115, 0.095); head.add(eye);
      const white = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), mat('white', () => new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: 0.4 }))); white.scale.set(1, 0.8, 0.5); place(white, side * 0.037, 0.115, 0.09); head.add(white);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), skin); lid.scale.set(1.05, 0.0, 0.8); place(lid, side * 0.037, 0.117, 0.092); head.add(lid); this.eyelids.push(lid);
    }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), skin); nose.scale.set(0.85, 1.2, 1.1); place(nose, 0, 0.09, 0.108); head.add(nose);
    if (style.moustache) head.add(place(rbox(0.07, 0.012, 0.02, hairMat(), 0.005), 0, 0.058, 0.1));
    // hair at the nape (visible under helmet rim)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.113, 20, 12, Math.PI * 1.08, Math.PI * 0.84, 0, Math.PI * 0.64), hairMat()); hair.position.y = 0.1; hair.scale.set(0.97, 1.12, 1.02); head.add(hair);
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.114, 20, 6, 0, Math.PI * 2, 0, Math.PI * 0.2), hairMat()); fringe.position.y = 0.1; fringe.scale.set(0.97, 1.12, 1.02); head.add(fringe);

    // ---------------- helmet (ABS shell, ribs, peak, suspension, chin strap)
    this.helmet = new THREE.Group(); this.helmet.name = 'helmet';
    const shellM = plastic(style.helmet);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.135, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), shellM);
    shell.scale.set(0.98, 0.95, 1.12); shell.castShadow = true; this.helmet.add(shell);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.155, 0.012, 32, 1, true), shellM); brim.scale.set(1, 1, 1.12); brim.position.y = -0.005; this.helmet.add(brim);
    const brimRing = new THREE.Mesh(new THREE.TorusGeometry(0.149, 0.007, 6, 36), shellM); brimRing.rotation.x = Math.PI / 2; brimRing.scale.set(1, 1.12, 1); brimRing.position.y = -0.01; this.helmet.add(brimRing);
    const peak = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 4, -Math.PI * 0.28, Math.PI * 0.56, Math.PI * 0.49, Math.PI * 0.05), shellM); peak.rotation.y = Math.PI / 2; peak.scale.set(1, 1, 1.15); peak.position.y = 0.002; this.helmet.add(peak);
    for (const a of [-0.35, 0, 0.35]) { // ribs
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.133, 0.009, 6, 24, Math.PI), shellM);
      rib.rotation.set(0, Math.PI / 2 + a, 0); rib.scale.set(1.12, 0.96, 1); rib.castShadow = true; this.helmet.add(rib);
    }
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.108, 0.01, 6, 24), webbing(0x222222)); band.rotation.x = Math.PI / 2; band.scale.set(1, 1.12, 1); band.position.y = 0.005; this.helmet.add(band);
    this.helmet.position.set(0, 0.19, -0.004); this.helmet.scale.setScalar(0.93); head.add(this.helmet);
    // chin strap variants: fastened (under chin) / loose (dangling loop)
    const strapM = webbing(0x1a1a1a);
    const fastened = new THREE.Group(), loose = new THREE.Group();
    for (const side of [1, -1]) {
      const f = rbox(0.012, 0.16, 0.005, strapM, 0.002); place(f, side * 0.085, -0.075, 0.04, -0.35, 0, side * -0.28); fastened.add(f);
    }
    fastened.add(place(rbox(0.08, 0.012, 0.012, strapM, 0.003), 0, -0.155, 0.075));
    fastened.add(place(rbox(0.02, 0.014, 0.016, plastic(0x222222), 0.004), 0.02, -0.155, 0.08));
    const loopCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.09, -0.01, 0.02), new THREE.Vector3(0.07, -0.16, 0.07), new THREE.Vector3(0, -0.22, 0.09), new THREE.Vector3(-0.07, -0.16, 0.07), new THREE.Vector3(-0.09, -0.01, 0.02)]);
    loose.add(new THREE.Mesh(new THREE.TubeGeometry(loopCurve, 20, 0.004, 4), strapM));
    loose.add(place(rbox(0.02, 0.014, 0.016, plastic(0x222222), 0.004), 0.02, -0.215, 0.09));
    this.helmet.add(fastened, loose);
    this.chinStrap = { fastened, loose };
    this.setChinStrap(true);

    // ---------------- collision sample points (world-tested against site colliders)
    const sp = (n: string, parent: THREE.Object3D, x: number, y: number, z: number) => { const o = new THREE.Object3D(); o.position.set(x, y, z); parent.add(o); this.sampleNames.push(n); this.samplePts.push(o); };
    sp('head', head, 0, 0.12, 0); sp('chestF', chest, 0, 0.08, 0.12); sp('chestB', chest, 0, 0.08, -0.12);
    sp('pelvisB', hips, 0, 0, -0.11); sp('handL', hdL, 0, -0.08, 0); sp('handR', hdR, 0, -0.08, 0);
    sp('elbowL', faL, 0, 0, 0); sp('elbowR', faR, 0, 0, 0); sp('kneeL', snL, 0, 0, 0.05); sp('kneeR', snR, 0, 0, 0.05);
    sp('toeL', ftL, 0, -0.06, 0.18); sp('toeR', ftR, 0, -0.06, 0.18); sp('heelL', ftL, 0, -0.06, -0.08); sp('heelR', ftR, 0, -0.06, -0.08);
  }

  setChinStrap(fastened: boolean, swing = 0) {
    this.chinStrap.fastened.visible = fastened;
    this.chinStrap.loose.visible = !fastened;
    this.chinStrap.loose.rotation.x = swing;
  }
  setBlink(v: number) { for (const l of this.eyelids) l.scale.y = Math.max(0.001, v) * 1.05; }
  setGrip(side: 'L' | 'R', v: number) {
    const f = this.j[side === 'L' ? 'handL' : 'handR'].getObjectByName('fingers');
    if (f) f.rotation.x = -v * 1.6;
  }

  /** Apply joint rotations (degrees) on top of rest pose. Missing joints reset to 0. */
  applyRot(rot: JointRot) {
    for (const n of JOINTS) {
      const r = rot[n];
      if (r) this.j[n].rotation.set(r[0] * DEG, r[1] * DEG, r[2] * DEG, 'YXZ');
      else this.j[n].rotation.set(0, 0, 0);
    }
  }

  /** Keep soles parallel to the ground (for planted feet). */
  footFlat() {
    for (const side of ['L', 'R'] as const) {
      const th = this.j[`thigh${side}`].rotation, sn = this.j[`shin${side}`].rotation, hp = this.j.hips.rotation;
      const f = this.j[`foot${side}`].rotation;
      f.x = -(hp.x + th.x + sn.x) + f.x;
    }
  }

  /** Lowest sole point in world space (after updateMatrixWorld). */
  soleMinY(): number {
    let m = Infinity; const v = new THREE.Vector3();
    for (let i = 10; i < 14; i++) { this.samplePts[i].getWorldPosition(v); if (v.y < m) m = v.y; }
    return m - 0.02;
  }
}
