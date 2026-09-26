import * as THREE from 'three';
import { Puppet, type JointRot, JOINTS, type PuppetStyle } from './rig';
import { POSES, blend, gait, cycleLen, setRot, type PoseName } from './poses';
import { type Key, sampleKeys, sampleVecKeys, smooth, invLerp, ease, type EaseName, hash2 } from '../core/math';
import { materials } from '../materials/library';

// A Performance is a puppet's part in a take: root path, facing, a sequence of key poses (pose-to-pose),
// walk windows (gait phase is driven by distance travelled, so feet never skate), procedural overlays,
// and the planted-feet ground snap that prevents feet from sinking into the deck or floating above it.

export interface PoseKey { t: number; pose: PoseName | JointRot; e?: EaseName }
export interface PerformanceDef {
  floorY: number;
  path: Key<number[]>[];              // [x, z]
  yaw: Key<number>[];                 // radians, 0 = facing +Z
  poses: PoseKey[];
  walks?: { t0: number; t1: number; back?: boolean; arms?: boolean }[];
  overlay?: (t: number, rot: JointRot, p: Puppet) => void;
  snap?: Key<number>[];               // 1 = feet planted on floor, 0 = free (falls)
  tilt?: Key<number>[];               // radians about local X at pivot (negative = fall backwards)
  pivot?: [number, number, number];
  lift?: Key<number>[];               // extra root height (m)
  chin?: (t: number) => boolean;      // chin strap fastened?
  blinkSeed?: number;
}

const poseOf = (p: PoseName | JointRot): JointRot => (typeof p === 'string' ? POSES[p] : p);

export class Actor {
  puppet: Puppet;
  def: PerformanceDef;
  private dist: Float32Array = new Float32Array(0);
  private t0 = 0;
  private dt = 1 / 120;
  constructor(puppet: Puppet | PuppetStyle, def: PerformanceDef) {
    this.puppet = puppet instanceof Puppet ? puppet : new Puppet(puppet);
    this.def = def;
    this.bake();
  }
  setDef(def: PerformanceDef) { this.def = def; this.bake(); }
  private bake() {
    const k = this.def.path; const a = k[0].t - 1, b = k[k.length - 1].t + 1;
    this.t0 = a; const n = Math.ceil((b - a) / this.dt) + 2;
    this.dist = new Float32Array(n);
    let prev = sampleVecKeys(k, a), acc = 0;
    for (let i = 1; i < n; i++) {
      const p = sampleVecKeys(k, a + i * this.dt);
      acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]) * (this.walkSign(a + i * this.dt));
      this.dist[i] = acc; prev = p;
    }
  }
  private walkSign(t: number) { const w = this.def.walks?.find(w => t >= w.t0 - 0.3 && t <= w.t1 + 0.3); return w?.back ? -1 : 1; }
  private distAt(t: number) { const i = Math.max(0, Math.min(this.dist.length - 1, Math.round((t - this.t0) / this.dt))); return this.dist[i]; }
  speedAt(t: number) { const a = sampleVecKeys(this.def.path, t - 0.05), b = sampleVecKeys(this.def.path, t + 0.05); return Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.1; }

  /** Evaluate the performance at take time t. boil = stop-motion hand-posing jitter amplitude (deg), frame = seed. */
  evaluate(t: number, boil = 0, frame = 0) {
    const d = this.def, P = this.puppet;
    // ---- base pose: pose-to-pose with easing
    let rot: JointRot = {};
    const ks = d.poses;
    if (t <= ks[0].t) rot = { ...poseOf(ks[0].pose) };
    else if (t >= ks[ks.length - 1].t) rot = { ...poseOf(ks[ks.length - 1].pose) };
    else for (let i = 0; i < ks.length - 1; i++) {
      if (t >= ks[i].t && t < ks[i + 1].t) { const u = ease[ks[i + 1].e ?? 'inOutCubic']((t - ks[i].t) / (ks[i + 1].t - ks[i].t)); rot = blend(poseOf(ks[i].pose), poseOf(ks[i + 1].pose), u); break; }
    }
    // ---- gait overlay inside walk windows (weight eases in/out)
    for (const w of d.walks ?? []) {
      if (t < w.t0 - 0.25 || t > w.t1 + 0.25) continue;
      const wgt = smooth(invLerp(w.t0 - 0.25, w.t0 + 0.15, t)) * (1 - smooth(invLerp(w.t1 - 0.15, w.t1 + 0.25, t)));
      const phase = this.distAt(t) / cycleLen(!!w.back);
      const g = gait(phase, w.back, w.arms !== false);
      const legs: JointRot = {}; const arms: JointRot = {};
      for (const k of Object.keys(g) as (keyof JointRot)[]) (String(k).startsWith('upperArm') || String(k).startsWith('forearm') ? arms : legs)[k] = g[k];
      setRot(rot, legs, wgt);
      if (w.arms !== false) setRot(rot, arms, wgt * 0.8);
    }
    d.overlay?.(t, rot, P);
    // ---- boil: tiny per-frame deviation, as if each frame were re-posed by hand
    if (boil > 0) for (let i = 0; i < JOINTS.length; i++) {
      const n = JOINTS[i]; const r = rot[n] ?? [0, 0, 0];
      rot[n] = [r[0] + (hash2(frame, i * 3) - 0.5) * 2 * boil, r[1] + (hash2(frame, i * 3 + 1) - 0.5) * 2 * boil, r[2] + (hash2(frame, i * 3 + 2) - 0.5) * 2 * boil];
    }
    P.applyRot(rot);
    const snap = d.snap ? sampleKeys(d.snap, t) : 1;
    if (snap > 0.5) P.footFlat();

    // ---- root transform
    const xz = sampleVecKeys(d.path, t);
    P.root.position.set(xz[0], d.floorY + (d.lift ? sampleKeys(d.lift, t) : 0), xz[1]);
    P.root.rotation.set(0, sampleKeys(d.yaw, t), 0);
    const pv = d.pivot ?? [0, 0, 0];
    P.tilt.position.set(pv[0], pv[1], pv[2]);
    P.body.position.set(-pv[0], -pv[1], -pv[2]);
    P.tilt.rotation.set(d.tilt ? sampleKeys(d.tilt, t) : 0, 0, 0);
    P.root.updateMatrixWorld(true);
    if (snap > 0) {
      const dy = d.floorY - P.soleMinY();
      P.root.position.y += dy * snap;
      P.root.updateMatrixWorld(true);
    }
    // ---- face & PPE details
    const chin = d.chin ? d.chin(t) : true;
    P.setChinStrap(chin, chin ? 0 : Math.sin(t * 5.3) * 0.25 + (P.j.head.rotation.x * 0.5));
    const bs = d.blinkSeed ?? 1;
    const bt = (t + bs * 1.7) % 3.1;
    P.setBlink(bt < 0.12 ? 1 - Math.abs(bt - 0.06) / 0.06 : 0);
  }
}

/** Safety lanyard: webbing with energy absorber pack and a snap hook; sags when slack, straight when taut. */
export class Lanyard {
  mesh: THREE.Mesh;
  hook: THREE.Group;
  pack: THREE.Mesh;
  length: number;
  taut = 0;
  private geo: THREE.TubeGeometry | null = null;
  constructor(length = 2.0) {
    this.length = length;
    const m = new THREE.MeshStandardMaterial({ color: 0xff8f00, roughness: 0.7 });
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), m); this.mesh.castShadow = true; this.mesh.frustumCulled = false;
    this.pack = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.05), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })); this.pack.castShadow = true;
    this.hook = new THREE.Group();
    const steel = materials().galv.mat;
    const body = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.0075, 8, 20, Math.PI * 1.55), steel); body.rotation.z = Math.PI * 0.72; body.castShadow = true;
    const gate = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.05, 6), materials().redPaint.mat); gate.position.set(0.028, -0.012, 0); gate.rotation.z = 0.35; gate.name = 'gate';
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.07, 8), steel); shank.position.y = -0.06; shank.castShadow = true;
    this.hook.add(body, gate, shank);
  }
  addTo(p: THREE.Object3D) { p.add(this.mesh, this.hook, this.pack); }
  set visible(v: boolean) { this.mesh.visible = this.hook.visible = this.pack.visible = v; }
  /** a = D-ring (world), b = hook position (world). gateOpen 0..1 */
  update(a: THREE.Vector3, b: THREE.Vector3, gateOpen = 0) {
    const d = a.distanceTo(b);
    const slack = Math.max(0, this.length - d);
    this.taut = slack < 0.02 ? 1 : 0;
    const pts: THREE.Vector3[] = [];
    const sag = Math.sqrt(Math.max(0, this.length * this.length - d * d)) * 0.45;
    for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      const p = a.clone().lerp(b, u);
      p.y -= Math.sin(Math.PI * u) * sag * (1 - 0.15 * u);
      pts.push(p);
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    this.geo?.dispose();
    this.geo = new THREE.TubeGeometry(curve, 28, 0.009, 5, false);
    this.mesh.geometry = this.geo;
    const pa = curve.getPointAt(0.07), pb = curve.getPointAt(0.12);
    this.pack.position.copy(pa); this.pack.lookAt(pb); this.pack.rotateX(Math.PI / 2);
    const end = curve.getPointAt(0.97);
    this.hook.position.copy(b);
    this.hook.up.set(0, 0, 1);
    const dir = b.clone().sub(end).normalize();
    this.hook.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.negate()).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0));
    const g = this.hook.getObjectByName('gate'); if (g) g.rotation.z = 0.35 + gateOpen * 0.9;
  }
}
