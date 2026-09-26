import * as THREE from "three";

export const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const smooth = (u: number) => {
  u = clamp01(u);
  return u * u * (3 - 2 * u);
};
export const smoother = (u: number) => {
  u = clamp01(u);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
export const easeOut = (u: number) => 1 - Math.pow(1 - clamp01(u), 3);
export const easeIn = (u: number) => Math.pow(clamp01(u), 3);
export const easeOutBack = (u: number, k = 1.7) => {
  u = clamp01(u);
  const c3 = k + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + k * Math.pow(u - 1, 2);
};
/** 0 before a, 1 after b, smooth between */
export const win = (t: number, a: number, b: number, f = smooth) => f((t - a) / (b - a));
/** rises over [a0,a1], falls over [b0,b1] */
export const pulse = (t: number, a0: number, a1: number, b0: number, b1: number) => win(t, a0, a1) * (1 - win(t, b0, b1));

/** scalar key track: [[t, v], ...] eased per segment (poses hold at keys) */
export function track(keys: [number, number][], t: number, f = smoother) {
  if (t <= keys[0][0]) return keys[0][1];
  const n = keys.length;
  if (t >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0;
  while (i < n - 2 && t > keys[i + 1][0]) i++;
  const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
  return lerp(v0, v1, f((t - t0) / (t1 - t0)));
}

/** vec3 key track */
export function track3(keys: [number, number, number, number][], t: number, f = smoother, out = new THREE.Vector3()) {
  if (t <= keys[0][0]) return out.set(keys[0][1], keys[0][2], keys[0][3]);
  const n = keys.length;
  if (t >= keys[n - 1][0]) return out.set(keys[n - 1][1], keys[n - 1][2], keys[n - 1][3]);
  let i = 0;
  while (i < n - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1];
  const u = f((t - a[0]) / (b[0] - a[0]));
  return out.set(lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u));
}

/** Catmull-Rom through points, u in 0..1 over the whole list (uniform) */
export function crPath(pts: THREE.Vector3[], u: number, out = new THREE.Vector3()) {
  const n = pts.length - 1;
  const x = clamp01(u) * n;
  const i = Math.min(n - 1, Math.floor(x));
  const s = x - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  const s2 = s * s, s3 = s2 * s;
  const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3);
  return out.set(f(p0.x, p1.x, p2.x, p3.x), f(p0.y, p1.y, p2.y, p3.y), f(p0.z, p1.z, p2.z, p3.z));
}

/** deterministic hash → [0,1) */
export function h1(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
