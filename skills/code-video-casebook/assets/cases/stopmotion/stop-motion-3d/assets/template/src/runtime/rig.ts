import * as THREE from "three";
import type { Costume, Vec3 } from "./types";
import type { Prims } from "../looks/types";

/** 1 px = 5.5 cm. The puppet is 32 px (1.76 m) tall, built from rigid parts on pivots. */
export const PX = 0.055;
const D2R = Math.PI / 180;

export type Joint = "torso" | "head" | "armL" | "armR" | "legL" | "legR";
export const JOINTS: Joint[] = ["torso", "head", "armL", "armR", "legL", "legR"];

export interface Reach {
  /** anchor name on the actor's desk ("keyboard", "mug_home") or "mouth" */
  reach: string;
  /** offset in the anchor's local frame (meters) */
  offset?: Vec3;
  /** exact contact: the torso leans to make the hand land exactly on the point (one hand per pose) */
  exact?: boolean;
  /** hover height above the point (0 = touching) */
  lift?: number;
}

export interface PoseSpec {
  base?: string;
  sit?: boolean;
  lift?: number;
  torso?: Vec3;
  head?: Vec3;
  armL?: Vec3;
  armR?: Vec3;
  legL?: Vec3;
  legR?: Vec3;
  handL?: Reach;
  handR?: Reach;
  /** tilt of a held prop around the hand's X axis (pouring, showing) in degrees */
  tiltR?: number;
  tiltL?: number;
}

export interface ResolvedPose {
  hipY: number;
  rot: Record<Joint, [number, number, number]>; // radians
  tiltR: number;
  tiltL: number;
  /** which hands were solved to a contact target (for QC) */
  contacts: { hand: "L" | "R"; target: THREE.Vector3; mode: "exact" | "surface" | "free" }[];
}

export interface PartRef {
  name: string;
  mesh: THREE.Mesh;
  /** local half extents of the box, meters */
  half: THREE.Vector3;
}

/**
 * The rigid puppet. It knows sizes, pivots and SEMANTIC materials only — the look's Prims decide
 * whether a part is a textured cuboid, a clay lump, a paper cut-out or a voxel stack.
 */
export class Puppet {
  root = new THREE.Group();
  hips = new THREE.Group();
  torso = new THREE.Group();
  neck = new THREE.Group();
  sh = { L: new THREE.Group(), R: new THREE.Group() };
  leg = { L: new THREE.Group(), R: new THREE.Group() };
  socket = { L: new THREE.Group(), R: new THREE.Group() };
  parts: PartRef[] = [];
  /** where "mouth" reaches go (front of face) */
  mouth = new THREE.Object3D();

  constructor(private P: Prims, public id: string, public costume: Costume) {
    const c = costume;
    const cloth = `cloth:${c.top}`, pants = `cloth:${c.bottom}`, skin = `skin:${c.skin}`, hair = `hair:${c.hair}`;
    this.root.name = `actor:${id}`;
    this.root.add(this.hips);
    // legs pivot at the hip
    for (const s of ["L", "R"] as const) {
      const g = this.leg[s];
      g.position.set((s === "L" ? -2 : 2) * PX, 0, 0);
      this.hips.add(g);
      this.part(g, `leg${s}`, [4, 10, 4], [0, -5, 0], pants);
      this.part(g, `shoe${s}`, [4.2, 2, 4.8], [0, -11, 0.35], `shoe:${"#2a2b30"}`);
    }
    this.hips.add(this.torso);
    this.part(this.torso, "body", [8, 12, 4], [0, 6, 0], cloth);
    // head on the neck pivot
    this.neck.position.set(0, 12 * PX, 0);
    this.torso.add(this.neck);
    this.part(this.neck, "head", [8, 8, 8], [0, 4, 0], skin);
    this.mouth.position.set(0, 2.6 * PX, 4.6 * PX);
    this.neck.add(this.mouth);
    this.face(hair);
    // arms: sleeve + hand, socket at the hand tip
    for (const s of ["L", "R"] as const) {
      const g = this.sh[s];
      g.position.set((s === "L" ? -6 : 6) * PX, 10 * PX, 0);
      this.torso.add(g);
      this.part(g, `arm${s}`, [4, 7.5, 4], [0, -1.75, 0], cloth);
      this.part(g, `hand${s}`, [3.6, 3, 3.6], [0, -7, 0], skin);
      this.socket[s].position.set(0, -8.5 * PX, 0);
      g.add(this.socket[s]);
    }
    this.root.traverse((o) => ((o as THREE.Mesh).isMesh ? (o.userData.dynamic = true) : null));
  }

  private part(parent: THREE.Object3D, name: string, size: Vec3, off: Vec3, sem: string) {
    const m = this.P.box(size[0] * PX, size[1] * PX, size[2] * PX, sem, { dynamic: true, name });
    m.position.set(off[0] * PX, off[1] * PX, off[2] * PX);
    parent.add(m);
    this.parts.push({ name, mesh: m, half: new THREE.Vector3(size[0], size[1], size[2]).multiplyScalar(PX / 2) });
    return m;
  }

  private deco(parent: THREE.Object3D, size: Vec3, off: Vec3, sem: string) {
    const m = this.P.box(size[0] * PX, size[1] * PX, size[2] * PX, sem, { dynamic: true });
    m.position.set(off[0] * PX, off[1] * PX, off[2] * PX);
    parent.add(m);
    return m;
  }

  private face(hair: string) {
    const c = this.costume, n = this.neck;
    const eyes = `eyes:${c.eyes ?? "#1a1b22"}`;
    // eyes + mouth (geometry, so every look can read the face)
    this.deco(n, [1.3, 1.7, 0.5], [-1.8, 4.3, 4.1], eyes);
    this.deco(n, [1.3, 1.7, 0.5], [1.8, 4.3, 4.1], eyes);
    this.deco(n, [2.2, 0.45, 0.4], [0, 2.3, 4.05], `eyes:#8a4a3a`);
    const style = c.hairStyle ?? "short";
    if (style === "beanie") {
      this.deco(n, [9, 3.4, 9], [0, 7.6, 0], `cloth:${c.top}`);
      this.deco(n, [9.2, 1, 9.2], [0, 6.1, 0], `cloth:#e9e3d6`);
    } else {
      this.deco(n, [8.6, 2.2, 8.6], [0, 7.3, 0], hair); // cap
      this.deco(n, [8.6, style === "long" ? 9 : 5.5, 1.4], [0, style === "long" ? 3.2 : 5, -4.1], hair); // back
      this.deco(n, [1.2, 3.5, 8.6], [-4.1, 5.6, 0], hair);
      this.deco(n, [1.2, 3.5, 8.6], [4.1, 5.6, 0], hair);
      this.deco(n, [8.6, 1.3, 1], [0, 6.3, 4.1], hair); // fringe
      if (style === "bun") this.deco(n, [3.6, 3, 3.6], [0, 9.2, -1.5], hair);
      if (style === "spiky") for (const x of [-3, -1, 1, 3]) this.deco(n, [1.6, 1.8, 1.6], [x, 9, (x % 2) * 0.8], hair);
    }
    if (c.glasses) {
      const f = "plasticDark";
      for (const x of [-1.8, 1.8]) {
        this.deco(n, [2.8, 0.4, 0.3], [x, 5.4, 4.35], f);
        this.deco(n, [2.8, 0.4, 0.3], [x, 3.3, 4.35], f);
        this.deco(n, [0.4, 2.4, 0.3], [x - 1.2, 4.35, 4.35], f);
        this.deco(n, [0.4, 2.4, 0.3], [x + 1.2, 4.35, 4.35], f);
      }
      this.deco(n, [1, 0.4, 0.3], [0, 4.9, 4.35], f);
    }
    if (c.headphones) {
      this.deco(n, [9.6, 1, 2.2], [0, 8.6, 0], "plasticDark");
      this.deco(n, [1, 4, 2.2], [-4.6, 6.6, 0], "plasticDark");
      this.deco(n, [1, 4, 2.2], [4.6, 6.6, 0], "plasticDark");
      this.deco(n, [1.6, 3.6, 3.4], [-4.9, 4.2, 0], `neon:#27e3ff`);
      this.deco(n, [1.6, 3.6, 3.4], [4.9, 4.2, 0], `neon:#27e3ff`);
    }
  }

  apply(p: ResolvedPose) {
    this.hips.position.y = p.hipY;
    const set = (g: THREE.Object3D, r: [number, number, number]) => g.rotation.set(r[0], r[1], r[2]);
    set(this.torso, p.rot.torso);
    set(this.neck, p.rot.head);
    set(this.sh.L, p.rot.armL);
    set(this.sh.R, p.rot.armR);
    set(this.leg.L, p.rot.legL);
    set(this.leg.R, p.rot.legR);
    // held props stay upright: socket = (torso · arm)^-1 · tilt, so a prop keeps the hips' frame
    // (character forward = +Z) whatever the arm does, then the pose's tilt pours/shows it
    for (const s of ["L", "R"] as const) {
      const arm = s === "L" ? p.rot.armL : p.rot.armR;
      const tilt = s === "L" ? p.tiltL : p.tiltR;
      _qa.setFromEuler(_e.set(p.rot.torso[0], p.rot.torso[1], p.rot.torso[2]));
      _qb.setFromEuler(_e.set(arm[0], arm[1], arm[2]));
      _qa.multiply(_qb).invert();
      _qb.setFromEuler(_e.set(tilt, 0, 0));
      this.socket[s].quaternion.copy(_qa.multiply(_qb));
    }
  }

  /** hand tip in world space (end face center of the hand box) */
  tip(s: "L" | "R", out = new THREE.Vector3()) {
    return this.socket[s].getWorldPosition(out);
  }

  /** distance from a world point to the hand box (0 = touching / inside) — the real contact metric */
  handDistance(s: "L" | "R", point: THREE.Vector3) {
    const part = this.parts.find((p) => p.name === `hand${s}`)!;
    const local = part.mesh.worldToLocal(point.clone());
    const cl = local.clone().clamp(part.half.clone().negate(), part.half);
    return part.mesh.localToWorld(cl).distanceTo(point);
  }

  /** lowest world Y of the hand box's 8 corners */
  handLowestY(s: "L" | "R") {
    const part = this.parts.find((p) => p.name === `hand${s}`)!;
    let y = Infinity;
    const v = new THREE.Vector3();
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      v.set(sx * part.half.x, sy * part.half.y, sz * part.half.z).applyMatrix4(part.mesh.matrixWorld);
      y = Math.min(y, v.y);
    }
    return y;
  }
}

const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _e = new THREE.Euler();

// ── pose resolution (library → joint angles, with contact IK) ────────────────
const HAND_TIP = 8.5 * PX; // shoulder pivot → hand tip

export interface AnchorLookup {
  (name: string): THREE.Object3D | undefined;
}

export function mergeSpec(name: string, lib: Record<string, PoseSpec>, depth = 0): PoseSpec {
  const s = lib[name];
  if (!s) throw new Error(`unknown pose "${name}"`);
  if (!s.base || depth > 8) return s;
  return { ...mergeSpec(s.base, lib, depth + 1), ...s };
}

function deg(v?: Vec3): [number, number, number] {
  return v ? [v[0] * D2R, v[1] * D2R, v[2] * D2R] : [0, 0, 0];
}

/** Aim an arm (pointing −Y at rest) at a world point. Euler XYZ: x = atan2(−dz, −dy), z = asin(dx). */
function aimArm(pup: Puppet, s: "L" | "R", target: THREE.Vector3): [number, number, number] {
  pup.root.updateMatrixWorld(true);
  const local = pup.torso.worldToLocal(target.clone()).sub(pup.sh[s].position).normalize();
  const z = Math.asin(Math.max(-1, Math.min(1, local.x)));
  const x = Math.atan2(-local.z, -local.y);
  return [x, 0, z];
}

function shoulderWorld(pup: Puppet, s: "L" | "R") {
  pup.root.updateMatrixWorld(true);
  return pup.sh[s].getWorldPosition(new THREE.Vector3());
}

/**
 * Resolve a pose for one puppet at its current root transform. Reaches become joint angles:
 *  - exact hand: the torso leans until shoulder→target distance equals the arm length, then aims
 *  - other hands: land on the anchor's surface plane at arm's length, nearest to the target
 * Then the hand's lowest corner is measured and the target raised so nothing sinks into the desk.
 */
export function resolvePose(pup: Puppet, spec: PoseSpec, anchors: AnchorLookup, seatTop: number): ResolvedPose {
  const rot: ResolvedPose["rot"] = {
    torso: deg(spec.torso), head: deg(spec.head), armL: deg(spec.armL), armR: deg(spec.armR), legL: deg(spec.legL), legR: deg(spec.legR),
  };
  const hipY = (spec.sit ? seatTop + 2 * PX : 12 * PX) + (spec.lift ?? 0);
  const p: ResolvedPose = { hipY, rot, tiltR: (spec.tiltR ?? 0) * D2R, tiltL: (spec.tiltL ?? 0) * D2R, contacts: [] };
  pup.apply(p);
  const reaches = (["L", "R"] as const).filter((s) => (s === "L" ? spec.handL : spec.handR));
  if (!reaches.length) return p;

  const targetOf = (r: Reach) => {
    const a = r.reach === "mouth" ? pup.mouth : anchors(r.reach);
    if (!a) throw new Error(`actor ${pup.id}: unknown anchor "${r.reach}"`);
    a.updateWorldMatrix(true, false);
    return a.localToWorld(new THREE.Vector3(...(r.offset ?? [0, 0, 0]))).add(new THREE.Vector3(0, r.lift ?? 0, 0));
  };

  // exact hand: turn the torso toward the target (yaw) and lean (pitch, bisection) until
  // |shoulder − target| = arm length; the hand then lands exactly on the point.
  const exact = reaches.find((s) => (s === "L" ? spec.handL : spec.handR)!.exact);
  if (exact) {
    const tgt = targetOf((exact === "L" ? spec.handL : spec.handR)!);
    if (!spec.torso || spec.torso[1] === 0) {
      pup.root.updateMatrixWorld(true);
      const local = pup.hips.worldToLocal(tgt.clone());
      const side = exact === "L" ? -6 * PX : 6 * PX;
      rot.torso = [rot.torso[0], Math.atan2(local.x - side, Math.max(0.05, local.z)) * 0.55, rot.torso[2]];
    }
    let lo = -30 * D2R, hi = 45 * D2R;
    const f = (pitch: number) => {
      rot.torso = [pitch, rot.torso[1], rot.torso[2]];
      pup.apply(p);
      return shoulderWorld(pup, exact).distanceTo(tgt) - HAND_TIP;
    }
    if (f(lo) * f(hi) < 0) {
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (f(lo) * f(mid) <= 0) hi = mid;
        else lo = mid;
      }
      f((lo + hi) / 2);
    }
  }

  // hands: exact → aim at the point; surface → land on the plane at arm's length nearest the point.
  // Then measure the hand's lowest corner and raise the plane by how far it sank (3 passes).
  const comp: Record<string, number> = {};
  for (let pass = 0; pass < 4; pass++) {
    for (const s of reaches) {
      const r = (s === "L" ? spec.handL : spec.handR)!;
      const tgt = targetOf(r);
      const planeY = tgt.y + (comp[s] ?? 0);
      const aim = new THREE.Vector3(tgt.x, planeY, tgt.z);
      const sw = shoulderWorld(pup, s);
      if (!r.exact && r.reach !== "mouth") {
        const dy = sw.y - planeY;
        if (Math.abs(dy) < HAND_TIP) {
          const rho = Math.sqrt(HAND_TIP * HAND_TIP - dy * dy);
          const h = new THREE.Vector2(tgt.x - sw.x, tgt.z - sw.z);
          const len = h.length() || 1;
          aim.set(sw.x + (h.x / len) * rho, planeY, sw.z + (h.y / len) * rho);
        }
      }
      const a = aimArm(pup, s, aim);
      if (s === "L") rot.armL = a;
      else rot.armR = a;
      pup.apply(p);
      if (r.reach !== "mouth" && !r.lift) {
        pup.root.updateMatrixWorld(true);
        comp[s] = (comp[s] ?? 0) + (tgt.y - pup.handLowestY(s));
      }
      if (pass === 3) p.contacts.push({ hand: s, target: tgt, mode: r.reach === "mouth" || r.lift ? "free" : r.exact ? "exact" : "surface" });
    }
  }
  return p;
}

export function blendPose(a: ResolvedPose, b: ResolvedPose, u: number): ResolvedPose {
  const l = (x: number, y: number) => x + (y - x) * u;
  const rot = {} as ResolvedPose["rot"];
  for (const j of JOINTS) rot[j] = [l(a.rot[j][0], b.rot[j][0]), l(a.rot[j][1], b.rot[j][1]), l(a.rot[j][2], b.rot[j][2])];
  return { hipY: l(a.hipY, b.hipY), rot, tiltR: l(a.tiltR, b.tiltR), tiltL: l(a.tiltL, b.tiltL), contacts: u < 0.5 ? a.contacts : b.contacts };
}
