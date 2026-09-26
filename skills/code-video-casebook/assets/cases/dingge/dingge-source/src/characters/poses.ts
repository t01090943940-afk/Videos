import type { Joint, JointRot } from './rig';
import { JOINTS } from './rig';

// Pose library (degrees, YXZ). Conventions for a puppet facing +Z:
//  spine/chest/head  +X = bend forward / look down, +Y = turn to own left
//  upperArm          -X = raise forward, +Z(L)/-Z(R) = raise sideways; forearm -X = flex elbow
//  thigh             -X = hip flexion (leg forward); shin +X = knee flexion; foot auto-flattened when planted

export type PoseName = keyof typeof POSES;

const P = (p: JointRot) => p;

export const POSES = {
  stand: P({ upperArmL: [2, 0, 6], upperArmR: [2, 0, -6], forearmL: [-12, 0, 0], forearmR: [-12, 0, 0] }),
  standRelaxed: P({ hips: [0, 0, 2], spine: [3, 0, -1], upperArmL: [4, 0, 8], upperArmR: [0, 0, -5], forearmL: [-18, 0, 0], forearmR: [-10, 0, 0], thighL: [-4, 0, 3], shinL: [8, 0, 0], head: [2, 4, 0] }),
  // squatting on the mesh, tying bars between the feet
  crouchTie: P({
    hips: [18, 0, 0], spine: [22, 0, 0], chest: [14, 0, 0], neck: [10, 0, 0], head: [16, 0, 0],
    thighL: [-118, -8, 6], shinL: [138, 0, 0], thighR: [-112, 8, -6], shinR: [132, 0, 0],
    upperArmL: [-58, 0, 12], forearmL: [-42, 0, 0], upperArmR: [-62, 0, -10], forearmR: [-38, -20, 0],
    handL: [10, 0, 0], handR: [20, 0, 0],
  }),
  lookUp: P({ neck: [-12, 0, 0], head: [-22, 0, 0], spine: [-4, 0, 0], upperArmL: [2, 0, 7], upperArmR: [2, 0, -7], forearmL: [-10, 0, 0], forearmR: [-10, 0, 0] }),
  // right hand up to a hook above and slightly in front
  reachUpR: P({ spine: [-3, 0, 0], chest: [-4, 0, 3], neck: [-10, 0, 0], head: [-26, 0, 0], upperArmR: [-162, 0, 12], forearmR: [-14, 0, 0], handR: [10, 0, 0], upperArmL: [2, 0, 8], forearmL: [-15, 0, 0] }),
  reachUpRNear: P({ spine: [-3, 0, 0], chest: [-4, 0, 3], neck: [-8, 0, 0], head: [-22, 0, 0], upperArmR: [-150, 0, 14], forearmR: [-34, 0, 0], handR: [0, 0, 0], upperArmL: [-20, 0, 8], forearmL: [-40, 0, 0] }),
  // 吊钩下降 signal: right arm to the front-side, ~30° below horizontal, palm down, looking at the load
  signalDown: P({ neck: [-12, 0, 0], head: [-20, 0, 0], chest: [0, -10, 0], upperArmR: [-58, 0, -32], forearmR: [-6, 0, 0], handR: [0, 0, 0], upperArmL: [4, 0, 10], forearmL: [-14, 0, 0] }),
  // both hands at the chin: buckling the strap
  buckleChin: P({ neck: [8, 0, 0], head: [6, 0, 0], upperArmL: [-58, -30, 20], forearmL: [-118, 0, 0], handL: [0, 30, 0], upperArmR: [-58, 30, -20], forearmR: [-118, 0, 0], handR: [0, -30, 0] }),
  // bend to lift the mid rail (knees + back), both hands forward-low
  liftLow: P({ hips: [28, 0, 0], spine: [26, 0, 0], chest: [8, 0, 0], head: [-10, 0, 0], thighL: [-62, 0, 4], shinL: [70, 0, 0], thighR: [-52, 0, -4], shinR: [60, 0, 0], upperArmL: [-72, 0, 14], forearmL: [-8, 0, 0], upperArmR: [-72, 0, -14], forearmR: [-8, 0, 0] }),
  // hold a tube in front at waist height
  carry: P({ spine: [-4, 0, 0], upperArmL: [-26, 0, 16], forearmL: [-62, 0, 0], upperArmR: [-26, 0, -16], forearmR: [-62, 0, 0] }),
  // hands on the rail in front (checking it)
  pushRail: P({ spine: [10, 0, 0], chest: [4, 0, 0], head: [8, 0, 0], upperArmL: [-58, 0, 12], forearmL: [-24, 0, 0], upperArmR: [-58, 0, -12], forearmR: [-24, 0, 0], thighL: [-12, 0, 0], shinL: [10, 0, 0] }),
  // lost balance: arms thrown up, back arching, head snapping back
  stumble: P({ spine: [-24, 0, 0], chest: [-18, 0, 0], neck: [-14, 0, 0], head: [-20, 0, 0], upperArmL: [-118, 0, 48], forearmL: [-30, 0, 0], upperArmR: [-128, 0, -52], forearmR: [-24, 0, 0], thighL: [-38, 0, 4], shinL: [44, 0, 0], thighR: [8, 0, -2], shinR: [12, 0, 0] }),
  fallBack: P({ spine: [-30, 0, 0], chest: [-20, 0, 0], neck: [-6, 0, 0], head: [8, 0, 0], upperArmL: [-148, 0, 38], forearmL: [-24, 0, 0], upperArmR: [-156, 0, -40], forearmR: [-18, 0, 0], thighL: [-72, 0, 6], shinL: [58, 0, 0], thighR: [-40, 0, -4], shinR: [22, 0, 0] }),
  // back against the top rail, hands gripping it behind
  caught: P({ spine: [10, 0, 0], chest: [8, 0, 0], neck: [6, 0, 0], head: [10, 0, 0], upperArmL: [38, 0, 28], forearmL: [-40, 0, 0], handL: [0, 0, 0], upperArmR: [38, 0, -28], forearmR: [-40, 0, 0], thighL: [-16, 0, 4], shinL: [20, 0, 0], thighR: [-6, 0, -4], shinR: [10, 0, 0] }),
  exhale: P({ spine: [14, 0, 0], chest: [6, 0, 0], neck: [6, 0, 0], head: [8, 0, 0], upperArmL: [30, 0, 20], forearmL: [-30, 0, 0], upperArmR: [30, 0, -20], forearmR: [-30, 0, 0], thighL: [-10, 0, 2], shinL: [14, 0, 0], thighR: [-10, 0, -2], shinR: [14, 0, 0] }),
  thumbsUp: P({ upperArmR: [-78, 0, -14], forearmR: [-80, 0, 0], handR: [0, 90, 0], upperArmL: [2, 0, 8], forearmL: [-14, 0, 0], head: [-4, 0, 0] }),
  pointFwd: P({ upperArmR: [-86, 0, -8], forearmR: [-6, 0, 0], upperArmL: [2, 0, 8], forearmL: [-14, 0, 0], head: [-2, 0, 0] }),
  handsOnHips: P({ upperArmL: [8, 0, 32], forearmL: [-100, -40, 0], upperArmR: [8, 0, -32], forearmR: [-100, 40, 0] }),
  hammer: P({ spine: [20, 0, 0], chest: [8, 0, 0], head: [16, 0, 0], upperArmR: [-120, 0, -8], forearmR: [-60, 0, 0], upperArmL: [-60, 0, 10], forearmL: [-30, 0, 0], thighL: [-18, 0, 0], shinL: [22, 0, 0], thighR: [-8, 0, 0], shinR: [14, 0, 0] }),
} satisfies Record<string, JointRot>;

export function blend(a: JointRot, b: JointRot, t: number, out: JointRot = {}): JointRot {
  for (const n of JOINTS) {
    const x = a[n], y = b[n];
    if (!x && !y) { delete out[n]; continue; }
    const p = x ?? [0, 0, 0], q = y ?? [0, 0, 0];
    out[n] = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  }
  return out;
}
export function addRot(base: JointRot, add: JointRot, w = 1): JointRot {
  for (const k of Object.keys(add) as Joint[]) {
    const a = add[k]!; const b = base[k] ?? [0, 0, 0];
    base[k] = [b[0] + a[0] * w, b[1] + a[1] * w, b[2] + a[2] * w];
  }
  return base;
}
export function setRot(base: JointRot, add: JointRot, w = 1): JointRot {
  // override (lerp toward) given joints
  for (const k of Object.keys(add) as Joint[]) {
    const a = add[k]!; const b = base[k] ?? [0, 0, 0];
    base[k] = [b[0] + (a[0] - b[0]) * w, b[1] + (a[1] - b[1]) * w, b[2] + (a[2] - b[2]) * w];
  }
  return base;
}

const bump = (p: number, c: number, w: number) => { let d = Math.abs(p - c); d = Math.min(d, 1 - d); return Math.exp(-(d * d) / (2 * w * w)); };

/** Procedural gait at phase φ (cycles). back = walking backwards (shorter, stiffer steps). Returns leg/pelvis/arm offsets. */
export function gait(phase: number, back = false, armSwing = true): JointRot {
  const tau = Math.PI * 2;
  const A = back ? 15 : 22, K = back ? 38 : 58;
  const out: JointRot = {};
  const leg = (p: number, side: 'L' | 'R') => {
    p = ((p % 1) + 1) % 1;
    const hip = A * Math.cos(tau * p);
    const knee = 4 + 12 * bump(p, 0.1, 0.06) + K * bump(p, 0.72, 0.12);
    const ankle = -8 * bump(p, 0.02, 0.05) + 16 * bump(p, 0.58, 0.07) - 8 * bump(p, 0.8, 0.08);
    out[`thigh${side}`] = [-hip, 0, 0];
    out[`shin${side}`] = [knee, 0, 0];
    out[`foot${side}`] = [ankle, 0, 0];
  };
  leg(phase, 'L'); leg(phase + 0.5, 'R');
  const s = Math.cos(tau * phase);
  out.hips = [back ? -2 : 3, 5 * s, 2.5 * Math.sin(tau * phase * 2)];
  out.spine = [back ? -3 : 2, -6 * s, 0];
  if (armSwing) {
    out.upperArmL = [16 * s, 0, 6];
    out.upperArmR = [-16 * s, 0, -6];
    out.forearmL = [-16 - 8 * Math.max(0, -s), 0, 0];
    out.forearmR = [-16 - 8 * Math.max(0, s), 0, 0];
  }
  return out;
}
/** metres per full gait cycle (two steps) */
export const cycleLen = (back: boolean) => (back ? 0.9 : 1.3);
