import * as THREE from "three";
import { CAMERA, type CamKey } from "../timeline";

/**
 * ONE-TAKE CAMERA. Keys give position + aim + fov at times; between keys we use cubic Hermite
 * curves with finite-difference tangents (C1: velocity never jumps, so the move never "restarts"
 * at a key) and zero velocity at the first and last key. Aim is splined as yaw/pitch, not as a
 * target point, so turning from a far target to a near one stays an even rotation.
 */
interface Chan {
  t: number[];
  v: number[];
  m: number[];
}

function build(ts: number[], vs: number[], tension = 0.9): Chan {
  const n = ts.length;
  const m = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    const s0 = (vs[i] - vs[i - 1]) / (ts[i] - ts[i - 1]);
    const s1 = (vs[i + 1] - vs[i]) / (ts[i + 1] - ts[i]);
    // average of slopes, damped where the curve turns back (prevents overshoot)
    m[i] = s0 * s1 <= 0 ? 0 : ((s0 + s1) / 2) * tension;
    // Fritsch–Carlson style limiter
    const lim = 3 * Math.min(Math.abs(s0), Math.abs(s1));
    if (Math.abs(m[i]) > lim) m[i] = Math.sign(m[i]) * lim;
  }
  return { t: ts, v: vs, m };
}

function evalChan(c: Chan, t: number) {
  const n = c.t.length;
  if (t <= c.t[0]) return c.v[0];
  if (t >= c.t[n - 1]) return c.v[n - 1];
  let i = 0;
  while (i < n - 2 && t > c.t[i + 1]) i++;
  const h = c.t[i + 1] - c.t[i];
  const s = (t - c.t[i]) / h;
  const s2 = s * s, s3 = s2 * s;
  const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
  return h00 * c.v[i] + h10 * h * c.m[i] + h01 * c.v[i + 1] + h11 * h * c.m[i + 1];
}

const keys: CamKey[] = CAMERA;
const ts = keys.map((k) => k.t);
const px = build(ts, keys.map((k) => k.pos[0]));
const py = build(ts, keys.map((k) => k.pos[1]));
const pz = build(ts, keys.map((k) => k.pos[2]));
const fov = build(ts, keys.map((k) => k.fov));
// aim as yaw/pitch, unwrapped
const yawRaw = keys.map((k) => Math.atan2(k.target[0] - k.pos[0], k.target[2] - k.pos[2]));
const yaws: number[] = [];
yawRaw.forEach((y, i) => {
  if (i === 0) return yaws.push(y);
  let v = y;
  while (v - yaws[i - 1] > Math.PI) v -= 2 * Math.PI;
  while (v - yaws[i - 1] < -Math.PI) v += 2 * Math.PI;
  yaws.push(v);
});
const pitches = keys.map((k) => {
  const dx = k.target[0] - k.pos[0], dy = k.target[1] - k.pos[1], dz = k.target[2] - k.pos[2];
  return Math.atan2(dy, Math.hypot(dx, dz));
});
const yaw = build(ts, yaws);
const pitch = build(ts, pitches);

export interface CamSample {
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  fov: number;
}

/** deterministic "breath" so holds never look frozen (mm-scale, sub-degree) */
function breath(t: number) {
  return {
    x: 0.0022 * Math.sin(t * 0.83 + 0.4) + 0.0012 * Math.sin(t * 1.91 + 2.1),
    y: 0.0026 * Math.sin(t * 0.67 + 1.3) + 0.001 * Math.sin(t * 2.3),
    yaw: 0.0011 * Math.sin(t * 0.59 + 0.7),
    pitch: 0.0009 * Math.sin(t * 0.77 + 2.4),
  };
}

export function sampleCamera(t: number): CamSample {
  const b = breath(t);
  const pos = new THREE.Vector3(evalChan(px, t) + b.x, evalChan(py, t) + b.y, evalChan(pz, t));
  const yw = evalChan(yaw, t) + b.yaw, pt = evalChan(pitch, t) + b.pitch;
  const dir = new THREE.Vector3(Math.sin(yw) * Math.cos(pt), Math.sin(pt), Math.cos(yw) * Math.cos(pt));
  return { pos, dir, fov: evalChan(fov, t) };
}

export function applyCamera(cam: THREE.PerspectiveCamera, s: CamSample, aspect: number) {
  cam.position.copy(s.pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(s.pos.clone().add(s.dir));
  cam.fov = s.fov;
  cam.aspect = aspect;
  cam.near = 0.03;
  cam.far = 600;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
}
