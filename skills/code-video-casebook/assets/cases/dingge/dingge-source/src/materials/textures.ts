import * as THREE from 'three';
import { TileNoise, mulberry32, clamp } from '../core/math';

// Procedural, tileable PBR texture sets (albedo + normal + roughness) generated on canvas.
// No external image assets: the whole site ships as code and renders identically everywhere.

export interface TexSet { map: THREE.Texture; normalMap?: THREE.Texture; roughnessMap?: THREE.Texture }

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function canvas(size: number, h = size) {
  const c = document.createElement('canvas');
  c.width = size; c.height = h;
  return c;
}

function toTexture(c: HTMLCanvasElement, srgb: boolean, repeat = true): THREE.Texture {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

/** Build albedo/normal/roughness from per-pixel callbacks returning colour, height, roughness. */
function buildSet(size: number, fn: (u: number, v: number, x: number, y: number) => { c: RGB; h: number; r: number }, normalStrength = 2.0): TexSet {
  const n = size * size;
  const col = new Uint8ClampedArray(n * 4), rough = new Uint8ClampedArray(n * 4);
  const height = new Float32Array(n);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const s = fn(x / size, y / size, x, y);
    col[i * 4] = s.c[0]; col[i * 4 + 1] = s.c[1]; col[i * 4 + 2] = s.c[2]; col[i * 4 + 3] = 255;
    const r = clamp(s.r) * 255; rough[i * 4] = r; rough[i * 4 + 1] = r; rough[i * 4 + 2] = r; rough[i * 4 + 3] = 255;
    height[i] = s.h;
  }
  const nrm = new Uint8ClampedArray(n * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const hx = height[y * size + ((x + 1) % size)] - height[y * size + ((x - 1 + size) % size)];
    const hy = height[((y + 1) % size) * size + x] - height[((y - 1 + size) % size) * size + x];
    let nx = -hx * normalStrength, ny = -hy * normalStrength, nz = 1;
    const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const i = (y * size + x) * 4;
    nrm[i] = (nx * 0.5 + 0.5) * 255; nrm[i + 1] = (-ny * 0.5 + 0.5) * 255; nrm[i + 2] = (nz * 0.5 + 0.5) * 255; nrm[i + 3] = 255;
  }
  const mk = (data: Uint8ClampedArray, srgb: boolean) => {
    const c = canvas(size); c.getContext('2d')!.putImageData(new ImageData(data as unknown as ImageDataArray, size, size), 0, 0); return toTexture(c, srgb);
  };
  return { map: mk(col, true), normalMap: mk(nrm, false), roughnessMap: mk(rough, false) };
}

// ---------------------------------------------------------------- materials

export function concrete(seed = 1, tint: RGB = [168, 166, 160], size = 512): TexSet {
  const N = new TileNoise(seed), r = mulberry32(seed + 7);
  const pores: [number, number, number][] = Array.from({ length: 260 }, () => [r(), r(), 0.002 + r() * 0.004]);
  return buildSet(size, (u, v) => {
    const big = N.fbm(u, v, 3, 4), fine = N.fbm(u, v, 32, 3), stain = N.fbm(u + 0.3, v * 0.6, 2, 3);
    let h = fine * 0.6 + big * 0.4;
    let pore = 0;
    for (const p of pores) { const dx = Math.min(Math.abs(u - p[0]), 1 - Math.abs(u - p[0])), dy = Math.min(Math.abs(v - p[1]), 1 - Math.abs(v - p[1])); if (dx * dx + dy * dy < p[2] * p[2]) pore = 1; }
    // formwork panel seam lines (1 tile ≈ 2.4m, plywood 1.22 x 2.44)
    const seamU = Math.min(Math.abs(u - 0.5), u, 1 - u) < 0.0025 ? 1 : 0;
    const seamV = Math.min(v, 1 - v) < 0.0025 ? 1 : 0;
    const k = 0.82 + big * 0.22 + fine * 0.08 - stain * 0.12 - pore * 0.25 - (seamU + seamV) * 0.08;
    h -= pore * 0.6 + (seamU + seamV) * 0.3;
    const c: RGB = [tint[0] * k, tint[1] * k, tint[2] * k * 0.98];
    return { c, h, r: 0.82 + fine * 0.15 };
  }, 3);
}

export function plywood(seed = 2, size = 512): TexSet {
  // film-faced formwork plywood: reddish brown, worn to pale wood at scuffs, panel seams, nail heads
  const N = new TileNoise(seed), r = mulberry32(seed);
  const nails = Array.from({ length: 40 }, () => [r(), r()]);
  return buildSet(size, (u, v) => {
    const wear = N.fbm(u, v, 4, 5), grain = N.fbm(u * 1, v * 8, 6, 3), dirt = N.fbm(u + 0.5, v + 0.2, 8, 4);
    const film: RGB = [122, 64, 40], bare: RGB = [196, 160, 110];
    let c = mix(film, bare, clamp((wear - 0.62) * 4));
    c = mix(c, [90, 80, 70], clamp((dirt - 0.55) * 2) * 0.5);
    const g = 0.92 + grain * 0.12; c = [c[0] * g, c[1] * g, c[2] * g];
    const seam = (Math.min(u, 1 - u) < 0.003 || Math.min(v, 1 - v) < 0.003 || Math.abs(u - 0.5) < 0.0025) ? 1 : 0;
    let nail = 0; for (const n of nails) if (Math.hypot(u - n[0], v - n[1]) < 0.003) nail = 1;
    if (seam) c = [c[0] * 0.45, c[1] * 0.45, c[2] * 0.45];
    if (nail) c = [70, 70, 72];
    return { c, h: grain * 0.2 - seam * 0.8 + nail * 0.4, r: 0.45 + wear * 0.4 };
  }, 2);
}

/** Plywood deck seen through a two-layer Ø10@200 rebar mat (tile = 2.4m → 12 bars). Mipmaps kill the moiré of thin geometry. */
export function rebarDeck(seed = 14, size = 1024): TexSet {
  const N = new TileNoise(seed);
  const ply = plywoodFn(seed);
  return buildSet(size, (u, v) => {
    const base = ply(u, v);
    const fu = (u * 12) % 1, fv = (v * 12) % 1;
    const bw = 0.045;
    const barU = Math.min(fu, 1 - fu) < bw, barV = Math.min(fv, 1 - fv) < bw;
    const shadowU = !barU && fu > bw && fu < bw * 3, shadowV = !barV && fv > bw && fv < bw * 3;
    let c = base.c, h = base.h, r = base.r;
    if (shadowU || shadowV) c = [c[0] * 0.55, c[1] * 0.55, c[2] * 0.55];
    if (barU || barV) {
      const k = 0.8 + N.fbm(u, v, 64, 2) * 0.4;
      const rustc: RGB = N.fbm(u, v, 12, 3) > 0.5 ? [120, 64, 36] : [70, 58, 50];
      c = [rustc[0] * k, rustc[1] * k, rustc[2] * k]; h = 1.0; r = 0.7;
      if (barU && barV) { c = [40, 38, 36]; h = 1.3; }
    }
    return { c, h, r };
  }, 3);
}

function plywoodFn(seed: number) {
  const N = new TileNoise(seed);
  return (u: number, v: number) => {
    const wear = N.fbm(u, v, 4, 5), grain = N.fbm(u, v * 8, 6, 3);
    const film: RGB = [122, 64, 40], bare: RGB = [196, 160, 110];
    let c = mix(film, bare, clamp((wear - 0.62) * 4));
    const g = 0.92 + grain * 0.12; c = [c[0] * g, c[1] * g, c[2] * g];
    return { c, h: grain * 0.2, r: 0.5 + wear * 0.3 };
  };
}

export function timber(seed = 3, size = 256): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const ring = Math.sin((u * 18 + N.fbm(u, v, 4, 3) * 6) * Math.PI) * 0.5 + 0.5;
    const k = 0.8 + ring * 0.2 - N.fbm(u, v, 16, 3) * 0.1;
    return { c: [205 * k, 170 * k, 118 * k], h: ring * 0.3, r: 0.75 };
  }, 1.5);
}

export function rust(seed = 4, size = 256): TexSet {
  // rebar / old steel: dark mill scale with orange rust bloom
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 6, 5), b = N.fbm(u + 0.3, v + 0.7, 24, 3);
    const scale: RGB = [58, 50, 46], rustc: RGB = [128, 66, 34];
    const c = mix(scale, rustc, clamp((a - 0.42) * 3));
    const k = 0.85 + b * 0.3;
    return { c: [c[0] * k, c[1] * k, c[2] * k], h: a * 0.5 + b * 0.3, r: 0.6 + a * 0.35 };
  }, 3);
}

export function paintedSteel(seed: number, base: RGB, size = 256): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const chip = N.fbm(u, v, 10, 5), grime = N.fbm(u + 0.2, v * 0.3, 3, 4);
    let c = base;
    const chipped = chip > 0.7;
    if (chipped) c = mix([70, 58, 50], [120, 70, 40], (chip - 0.7) * 3);
    c = mix(c, [60, 58, 52], clamp((grime - 0.5) * 1.6) * 0.45);
    return { c, h: chipped ? -0.4 : 0, r: chipped ? 0.8 : 0.42 + grime * 0.2 };
  }, 2);
}

export function galvanized(seed = 6, size = 256): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const s = N.fbm(u, v, 8, 4), sp = N.fbm(u, v, 40, 2);
    const k = 0.72 + s * 0.25 + sp * 0.08;
    return { c: [150 * k, 154 * k, 158 * k], h: s * 0.2, r: 0.4 + s * 0.3 };
  });
}

export function dirt(seed = 7, size = 1024): TexSet {
  // compacted site soil with gravel, tyre ruts and puddle-dark patches
  const N = new TileNoise(seed), r = mulberry32(seed);
  const stones = Array.from({ length: 900 }, () => [r(), r(), 0.0015 + r() * 0.004, r()]);
  const grid = new Map<number, number[][]>();
  for (const s of stones) { const k = Math.floor(s[0] * 32) + Math.floor(s[1] * 32) * 32; if (!grid.has(k)) grid.set(k, []); grid.get(k)!.push(s); }
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 4, 6), b = N.fbm(u, v, 48, 3), wet = N.fbm(u + 0.4, v + 0.1, 2, 4);
    const rut = Math.pow(Math.abs(Math.sin((v + N.fbm(u, v, 2, 2) * 0.1) * Math.PI * 6)), 18);
    let c: RGB = mix([142, 118, 92], [108, 90, 72], a);
    c = mix(c, [86, 74, 62], clamp((wet - 0.58) * 3) * 0.6);
    let h = a * 0.4 + b * 0.35 - rut * 0.3, rr = 0.92 - clamp((wet - 0.58) * 3) * 0.25;
    const gx = Math.floor(u * 32), gy = Math.floor(v * 32);
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
      const list = grid.get(((gx + ox + 32) % 32) + ((gy + oy + 32) % 32) * 32); if (!list) continue;
      for (const s of list) {
        let dx = Math.abs(u - s[0]); dx = Math.min(dx, 1 - dx); let dy = Math.abs(v - s[1]); dy = Math.min(dy, 1 - dy);
        const d = Math.hypot(dx, dy) / s[2];
        if (d < 1) { const t = s[3]; c = mix(c, [150 + t * 60, 145 + t * 55, 138 + t * 50], 0.85); h += (1 - d * d) * 0.8; rr = 0.7; }
      }
    }
    const k = 0.95 + b * 0.1;
    return { c: [c[0] * k, c[1] * k, c[2] * k], h, r: rr };
  }, 4);
}

export function asphalt(seed = 8, size = 512): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 64, 2), b = N.fbm(u, v, 4, 4), crack = Math.abs(N.fbm(u, v, 6, 4) - 0.5) < 0.006 ? 1 : 0;
    const k = 0.75 + a * 0.35 + b * 0.1 - crack * 0.4;
    return { c: [62 * k, 63 * k, 66 * k], h: a * 0.6 - crack, r: 0.88 };
  }, 3);
}

export function grass(seed = 9, size = 512): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 5, 5), b = N.fbm(u, v, 80, 2), dry = N.fbm(u + 0.7, v, 3, 3);
    let c: RGB = mix([66, 102, 46], [92, 120, 58], a);
    c = mix(c, [140, 128, 84], clamp((dry - 0.6) * 3) * 0.6);
    const k = 0.8 + b * 0.4;
    return { c: [c[0] * k, c[1] * k, c[2] * k], h: b, r: 0.95 };
  }, 2);
}

export function paving(seed = 10, size = 512): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const tu = (u * 4) % 1, tv = (v * 8) % 1;
    const joint = tu < 0.03 || tv < 0.06 ? 1 : 0;
    const tile = Math.floor(u * 4) + Math.floor(v * 8) * 5;
    const tone = 0.85 + ((tile * 7919) % 13) / 13 * 0.15 + N.fbm(u, v, 32, 2) * 0.08;
    const c: RGB = joint ? [96, 94, 90] : [178 * tone, 172 * tone, 162 * tone];
    return { c, h: joint ? -0.6 : N.fbm(u, v, 64, 2) * 0.2, r: 0.85 };
  }, 2);
}

export function brick(seed = 11, size = 512): TexSet {
  // Chinese solid clay / aerated block infill: 240x115x53 bricks with 10mm joints (tile = 1m x 0.504m*2)
  const N = new TileNoise(seed);
  const rows = 16, cols = 4;
  return buildSet(size, (u, v) => {
    const row = Math.floor(v * rows); const off = (row % 2) * 0.5;
    const cu = (u * cols + off) % 1, cv = (v * rows) % 1;
    const mortar = cu < 0.04 || cv < 0.16;
    const id = Math.floor(u * cols + off) + row * 13;
    const tone = 0.8 + ((id * 2654435761) >>> 0) % 100 / 100 * 0.3;
    const n = N.fbm(u, v, 24, 3);
    const c: RGB = mortar ? [168, 162, 152] : [150 * tone * (0.9 + n * 0.2), 72 * tone, 52 * tone];
    return { c, h: mortar ? -0.7 : n * 0.3, r: mortar ? 0.95 : 0.85 };
  }, 3);
}

// ---------------------------------------------------------------- flat / graphic textures

export function stripes(a: string, b: string, count = 4, size = 256): THREE.Texture {
  // 45° safety stripes, tileable
  const c = canvas(size), g = c.getContext('2d')!;
  g.fillStyle = a; g.fillRect(0, 0, size, size);
  g.fillStyle = b;
  const w = size / count;
  for (let i = -count * 2; i < count * 2; i++) {
    g.beginPath();
    g.moveTo(i * w * 2, 0); g.lineTo(i * w * 2 + w, 0); g.lineTo(i * w * 2 + w + size, size); g.lineTo(i * w * 2 + size, size); g.closePath(); g.fill();
  }
  return toTexture(c, true);
}

export function safetyMesh(size = 256): { map: THREE.Texture; alpha: THREE.Texture } {
  // 密目式安全立网: ≥2000 目/100cm². Tile = 0.5m; we show the weave at ~0.08 scale plus the border rope
  const c = canvas(size), g = c.getContext('2d')!;
  g.fillStyle = '#1f7a3a'; g.fillRect(0, 0, size, size);
  const a = canvas(size), ga = a.getContext('2d')!;
  ga.fillStyle = '#d8d8d8'; ga.fillRect(0, 0, size, size);
  const cell = 4;
  ga.fillStyle = '#6a6a6a';
  for (let y = 0; y < size; y += cell) for (let x = 0; x < size; x += cell) ga.fillRect(x + 1, y + 1, 2, 2);
  g.fillStyle = 'rgba(255,255,255,0.06)';
  for (let y = 0; y < size; y += cell * 2) g.fillRect(0, y, size, 1);
  g.fillStyle = 'rgba(233,233,226,0.55)'; g.fillRect(0, 0, size, 2); g.fillRect(0, 0, 2, size); // eyelet rope
  return { map: toTexture(c, true), alpha: toTexture(a, false) };
}

export function flatNet(size = 256): THREE.Texture {
  // 安全平网 (white nylon, 100mm mesh), alpha texture
  const c = canvas(size), g = c.getContext('2d')!;
  g.clearRect(0, 0, size, size);
  g.strokeStyle = '#ffffff'; g.lineWidth = 3;
  const n = 8, s = size / n;
  for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, size); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(size, i * s); g.stroke(); }
  return toTexture(c, true);
}

/** Text panel texture (hoardings, notice boards, site signs). */
export function signPanel(opts: { w: number; h: number; bg: string; lines: { text: string; color: string; size: number; weight?: number; y: number }[]; band?: string; border?: string }): THREE.Texture {
  const c = canvas(opts.w, opts.h), g = c.getContext('2d')!;
  g.fillStyle = opts.bg; g.fillRect(0, 0, opts.w, opts.h);
  if (opts.band) { g.fillStyle = opts.band; g.fillRect(0, opts.h * 0.82, opts.w, opts.h * 0.18); }
  if (opts.border) { g.strokeStyle = opts.border; g.lineWidth = opts.h * 0.03; g.strokeRect(0, 0, opts.w, opts.h); }
  for (const l of opts.lines) {
    g.fillStyle = l.color;
    g.font = `${l.weight ?? 900} ${l.size}px "Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(l.text, opts.w / 2, l.y);
  }
  // weathering
  const N = new TileNoise(opts.w + opts.h);
  const img = g.getImageData(0, 0, opts.w, opts.h);
  for (let y = 0; y < opts.h; y += 1) for (let x = 0; x < opts.w; x += 1) {
    const i = (y * opts.w + x) * 4, k = 0.9 + N.fbm(x / opts.w, y / opts.h, 6, 3) * 0.12 - (y / opts.h) * 0.05;
    img.data[i] *= k; img.data[i + 1] *= k; img.data[i + 2] *= k;
  }
  g.putImageData(img, 0, 0);
  return toTexture(c, true, false);
}

/** Residential facade: storeys of windows with frames, AC units, balcony rails. Tile = 1 bay x 1 storey. */
export function facade(style: { wall: RGB; accent: RGB; glass: RGB; seed: number }, size = 256): TexSet {
  const N = new TileNoise(style.seed), r = mulberry32(style.seed);
  const lit = r();
  const set = buildSet(size, (u, v) => {
    const n = N.fbm(u, v, 8, 3);
    const inWin = u > 0.18 && u < 0.82 && v > 0.22 && v < 0.78;
    const frame = inWin && (u < 0.2 || u > 0.8 || v < 0.24 || v > 0.76 || Math.abs(u - 0.5) < 0.012);
    const slab = v > 0.9;
    const ac = u > 0.84 && u < 0.98 && v > 0.62 && v < 0.8;
    let c: RGB = style.wall, h = 0, rr = 0.85;
    if (slab) c = style.accent;
    if (inWin) {
      const sky = 1 - v; c = mix(style.glass, [200, 210, 225], sky * 0.5 + (lit > 0.5 ? 0.1 : 0)); rr = 0.08; h = -0.5;
      if (Math.abs(u - 0.35 - n * 0.1) < 0.08 && v > 0.3) c = mix(c, [220, 214, 200], 0.35); // curtain
    }
    if (frame) { c = [215, 215, 210]; rr = 0.5; h = 0; }
    if (ac) { c = [228, 228, 224]; h = 0.6; rr = 0.6; }
    const k = 0.92 + n * 0.12 - (v < 0.05 ? 0.1 : 0);
    return { c: [c[0] * k, c[1] * k, c[2] * k], h, r: rr };
  }, 2);
  return set;
}

export function cloudDome(size = 1024): THREE.Texture {
  const N = new TileNoise(77);
  const c = canvas(size, size / 2), g = c.getContext('2d')!;
  const img = g.createImageData(size, size / 2);
  for (let y = 0; y < size / 2; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / (size / 2);
    const lat = 1 - v; // 1 = zenith
    const f = N.fbm(u * 1.0, v * 0.5, 6, 6);
    const band = Math.exp(-Math.pow((lat - 0.22) / 0.16, 2)); // clouds bunch toward the horizon
    const d = clamp((f - 0.5) * 3.2) * (0.25 + band * 0.9) * clamp(lat * 12);
    const i = (y * size + x) * 4;
    const shade = 235 + f * 20;
    img.data[i] = shade; img.data[i + 1] = shade; img.data[i + 2] = shade + 4; img.data[i + 3] = d * 255;
  }
  g.putImageData(img, 0, 0);
  const t = toTexture(c, true);
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

export function faceTexture(kind: 'zhou' | 'li' | 'lin' | 'generic', seed = 1): THREE.Texture {
  // painted puppet face on a front-facing hemisphere UV (u: around head, v: up)
  const s = 256, c = canvas(s), g = c.getContext('2d')!;
  const r = mulberry32(seed);
  const skin = kind === 'zhou' ? '#b27a55' : kind === 'li' ? '#d19a72' : kind === 'lin' ? '#c98f68' : `hsl(${22 + r() * 8},${38 + r() * 10}%,${50 + r() * 10}%)`;
  g.fillStyle = skin; g.fillRect(0, 0, s, s);
  const N = new TileNoise(seed + 3);
  const img = g.getImageData(0, 0, s, s);
  for (let i = 0; i < s * s; i++) { const k = 0.94 + N.fbm((i % s) / s, Math.floor(i / s) / s, 16, 3) * 0.1; img.data[i * 4] *= k; img.data[i * 4 + 1] *= k; img.data[i * 4 + 2] *= k; }
  g.putImageData(img, 0, 0);
  // cheeks (sun-burnt for the veteran)
  g.fillStyle = kind === 'zhou' ? 'rgba(150,60,40,0.25)' : 'rgba(210,110,90,0.18)';
  g.beginPath(); g.ellipse(s * 0.36, s * 0.47, 14, 9, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(s * 0.64, s * 0.47, 14, 9, 0, 0, 7); g.fill();
  // brows
  g.strokeStyle = kind === 'zhou' ? '#3a3330' : '#1c1612'; g.lineWidth = kind === 'zhou' ? 5 : 4; g.lineCap = 'round';
  g.beginPath(); g.moveTo(s * 0.38, s * 0.39); g.quadraticCurveTo(s * 0.43, s * 0.365, s * 0.47, s * 0.385); g.stroke();
  g.beginPath(); g.moveTo(s * 0.53, s * 0.385); g.quadraticCurveTo(s * 0.57, s * 0.365, s * 0.62, s * 0.39); g.stroke();
  // mouth
  g.strokeStyle = '#6a3a2c'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(s * 0.46, s * 0.6); g.quadraticCurveTo(s * 0.5, s * 0.615, s * 0.54, s * 0.6); g.stroke();
  if (kind === 'zhou') {
    // stubble + moustache + forehead lines
    g.fillStyle = 'rgba(40,36,34,0.55)'; g.beginPath(); g.ellipse(s * 0.5, s * 0.575, 20, 5, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(40,36,34,0.12)';
    for (let i = 0; i < 400; i++) { const a = r() * Math.PI, rr = 30 + r() * 12; g.fillRect(s * 0.5 + Math.cos(a) * rr * 0.9, s * 0.55 + Math.sin(a) * rr * 0.55, 1.5, 1.5); }
    g.strokeStyle = 'rgba(90,50,35,0.35)'; g.lineWidth = 1.5;
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(s * 0.4, s * (0.3 - k * 0.025)); g.quadraticCurveTo(s * 0.5, s * (0.29 - k * 0.025), s * 0.6, s * (0.3 - k * 0.025)); g.stroke(); }
  }
  return toTexture(c, true, false);
}
