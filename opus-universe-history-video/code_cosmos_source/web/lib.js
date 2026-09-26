// shared helpers
export const W = 1920, H = 1080;
export const MONO = '"DejaVu Sans Mono","Noto Sans Mono CJK SC",monospace';
export const SANS = '"Noto Sans CJK SC","DejaVu Sans",sans-serif';
export const MATH = '"Latin Modern Roman","LM Roman 10","DejaVu Serif",serif';

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = t => Math.pow(clamp(t), 3);
export const easeInOut = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const back = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

// value noise
const P = new Uint8Array(512); { const r = rng(7); const p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
function grad(h, x, y, z) { const u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); }
export function noise3(x, y, z = 0) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
  return lerp(lerp(lerp(grad(P[AA] & 15, x, y, z), grad(P[BA] & 15, x - 1, y, z), u),
    lerp(grad(P[AB] & 15, x, y - 1, z), grad(P[BB] & 15, x - 1, y - 1, z), u), v),
    lerp(lerp(grad(P[AA + 1] & 15, x, y, z - 1), grad(P[BA + 1] & 15, x - 1, y, z - 1), u),
      lerp(grad(P[AB + 1] & 15, x, y - 1, z - 1), grad(P[BB + 1] & 15, x - 1, y - 1, z - 1), u), v), w);
}
export function fbm(x, y, z = 0, o = 4) { let s = 0, a = .5, f = 1;
  for (let i = 0; i < o; i++) { s += a * noise3(x * f, y * f, z * f); a *= .5; f *= 2; } return s; }

export function makeCanvas(w = W, h = H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// neon line: wide faint + thin bright
export function neon(ctx, pathFn, color, w = 3, glow = 14, a = 1) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color;
  ctx.globalAlpha = .18 * a; ctx.lineWidth = glow; ctx.beginPath(); pathFn(); ctx.stroke();
  ctx.globalAlpha = .35 * a; ctx.lineWidth = glow * .45; ctx.beginPath(); pathFn(); ctx.stroke();
  ctx.globalAlpha = a; ctx.lineWidth = w; ctx.beginPath(); pathFn(); ctx.stroke(); ctx.restore();
}
export function glowDot(ctx, x, y, r, color, a = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
}
export function scanlines(ctx, a = .18, gap = 4) {
  ctx.save(); ctx.fillStyle = `rgba(0,0,0,${a})`;
  for (let y = 0; y < H; y += gap) ctx.fillRect(0, y, W, gap / 2); ctx.restore();
}
// simple 3D camera projection for canvas scenes
export function camera(yaw, pitch, dist, fov = 900, cx = W / 2, cy = H / 2) {
  const cy_ = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return (x, y, z) => {
    let X = x * cy_ - z * sy, Z = x * sy + z * cy_;
    let Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    Z += dist; const k = fov / Math.max(Z, .01);
    return [cx + X * k, cy - Y * k, Z, k];
  };
}
