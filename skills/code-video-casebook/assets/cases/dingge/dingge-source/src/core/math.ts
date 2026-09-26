// Deterministic helpers shared by world, characters and film.
// Everything that looks random is seeded, so frame N always renders the same image.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stateless hash → [0,1). Used for per-frame "boil" so it never depends on call order. */
export function hash1(n: number): number {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}
export const hash2 = (a: number, b: number) => hash1(Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663));

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
export const smooth = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const DEG = Math.PI / 180;

export const ease = {
  linear: (t: number) => t,
  inQuad: (t: number) => t * t,
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  inCubic: (t: number) => t * t * t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: (t: number) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
};
export type EaseName = keyof typeof ease;

/** Piecewise keyframe track over scalars or number arrays. */
export interface Key<T> { t: number; v: T; e?: EaseName }
export function sampleKeys(keys: Key<number>[], t: number): number {
  if (t <= keys[0].t) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t <= b.t) {
      const u = ease[b.e ?? 'inOutCubic']((t - a.t) / (b.t - a.t || 1));
      return lerp(a.v, b.v, u);
    }
  }
  return last.v;
}
export function sampleVecKeys(keys: Key<number[]>[], t: number, out: number[] = []): number[] {
  const n = keys[0].v.length;
  if (t <= keys[0].t) { for (let i = 0; i < n; i++) out[i] = keys[0].v[i]; return out; }
  const last = keys[keys.length - 1];
  if (t >= last.t) { for (let i = 0; i < n; i++) out[i] = last.v[i]; return out; }
  for (let k = 0; k < keys.length - 1; k++) {
    const a = keys[k], b = keys[k + 1];
    if (t >= a.t && t <= b.t) {
      const u = ease[b.e ?? 'inOutCubic']((t - a.t) / (b.t - a.t || 1));
      for (let i = 0; i < n; i++) out[i] = lerp(a.v[i], b.v[i], u);
      return out;
    }
  }
  return out;
}

/** Periodic value noise (tileable) for procedural textures. */
export class TileNoise {
  private perm: Uint8Array;
  private vals: Float32Array;
  constructor(seed: number) {
    const r = mulberry32(seed);
    this.perm = new Uint8Array(512);
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    this.vals = new Float32Array(256);
    for (let i = 0; i < 256; i++) this.vals[i] = r();
  }
  private lattice(ix: number, iy: number, period: number) {
    ix = ((ix % period) + period) % period; iy = ((iy % period) + period) % period;
    return this.vals[this.perm[(this.perm[ix & 255] + iy) & 511]];
  }
  noise(x: number, y: number, period: number) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = this.lattice(ix, iy, period), b = this.lattice(ix + 1, iy, period);
    const c = this.lattice(ix, iy + 1, period), d = this.lattice(ix + 1, iy + 1, period);
    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }
  /** fbm in [0,1], u,v in [0,1) tile space */
  fbm(u: number, v: number, base: number, oct = 5, gain = 0.5) {
    let amp = 0.5, f = base, s = 0, norm = 0;
    for (let o = 0; o < oct; o++) { s += amp * this.noise(u * f, v * f, f); norm += amp; amp *= gain; f *= 2; }
    return s / norm;
  }
}
