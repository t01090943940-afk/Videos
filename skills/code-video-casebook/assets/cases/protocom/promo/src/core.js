// Shared primitives: timing, easing, deterministic noise, type, sketch strokes, 3D projection.
export const W = 1920, H = 1080, FPS = 60, BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
export const DURATION = 80;

export const C = {
  paper: '#F3EEE3', paperDeep: '#E8E0CF', graphite: '#26231F',
  ink: '#0B0D0F', inkSoft: '#15181B', cream: '#F4EFE3', creamDim: '#A8A294',
  coral: '#E8633A', teal: '#78D7BD', tealDeep: '#4A7C6F', amber: '#D4A574',
  white: '#FFFFFF', gray: '#78716C', line: '#E7E2D8',
};

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const within = (t, a, b) => t >= a && t < b;

export const ease = {
  linear: (x) => x,
  inCubic: (x) => x * x * x,
  outCubic: (x) => 1 - Math.pow(1 - x, 3),
  inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outQuart: (x) => 1 - Math.pow(1 - x, 4),
  inExpo: (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
  outExpo: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inOutExpo: (x) =>
    x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outBack: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outBackBig: (x) => { const c1 = 3.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outElastic: (x) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  outBounce: (x) => {
    const n1 = 7.5625, d1 = 2.75;
    if (x < 1 / d1) return n1 * x * x;
    if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
    if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  },
};

// Deterministic hash noise — every frame must render identically on every worker.
export function hash(...n) {
  let h = 2166136261;
  for (const v of n) {
    h ^= Math.floor(v * 1000003) | 0;
    h = Math.imul(h, 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return ((h >>> 0) % 1000000) / 1000000;
}
export const hs = (...n) => hash(...n) * 2 - 1;
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hs(i, seed), hs(i + 1, seed), u);
}

// ---------- type ----------
export const F = {
  serif: '"Noto Serif SC"', sans: '"Noto Sans SC"', mono: '"JetBrains Mono"',
  hand: '"Long Cang"', handLatin: '"Caveat"', grotesk: '"Space Grotesk"',
};
export const fontUses = new Set();
export function font(ctx, family, size, weight = 400) {
  const f = `${weight} ${size}px ${family}`;
  ctx.font = family === F.mono || family === F.grotesk ? `${f}, ${F.sans}` : f;
  return ctx.font;
}
export function text(ctx, str, x, y, o = {}) {
  const { family = F.sans, size = 40, weight = 400, color = C.cream, align = 'left', baseline = 'alphabetic', ls = 0, alpha = 1 } = o;
  if (alpha <= 0.001 || !str) return 0;
  ctx.save();
  const f = font(ctx, family, size, weight);
  fontUses.add(f + '\u0000' + str);
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.letterSpacing = `${ls}px`;
  ctx.fillText(str, x, y);
  const w = ctx.measureText(str).width;
  ctx.restore();
  return w;
}
export function measure(ctx, str, o = {}) {
  const { family = F.sans, size = 40, weight = 400, ls = 0 } = o;
  ctx.save();
  font(ctx, family, size, weight);
  ctx.letterSpacing = `${ls}px`;
  const w = ctx.measureText(str).width;
  ctx.restore();
  return w;
}
// Per-glyph reveal: each glyph rises and sharpens with a stagger.
export function revealText(ctx, str, x, y, o, p, { stagger = 0.06, rise = 40, dur = 0.5, blur = true } = {}) {
  const chars = [...str];
  const n = chars.length;
  const total = dur + stagger * (n - 1);
  const align = o.align || 'left';
  const widths = chars.map((c) => measure(ctx, c, o));
  const tw = widths.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
  chars.forEach((c, i) => {
    const lp = clamp((p * total - i * stagger) / dur);
    const e = ease.outExpo(lp);
    if (lp > 0) {
      ctx.save();
      if (blur && lp < 1) ctx.filter = `blur(${(1 - e) * 10}px)`;
      text(ctx, c, cx, y + (1 - e) * rise, { ...o, align: 'left', alpha: (o.alpha ?? 1) * e });
      ctx.restore();
    }
    cx += widths[i];
  });
  return tw;
}
export function typeText(ctx, str, x, y, o, p, cursorOn = true, t = 0) {
  const chars = [...str];
  const k = Math.floor(chars.length * clamp(p));
  const s = chars.slice(0, k).join('');
  const w = text(ctx, s, x, y, o);
  if (cursorOn && Math.floor(t * 2.4) % 2 === 0) {
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.fillStyle = o.cursorColor || o.color || C.cream;
    const s2 = o.size || 40;
    ctx.fillRect(x + w + 6, y - s2 * 0.82, s2 * 0.5, s2 * 0.95);
    ctx.restore();
  }
  return w;
}

// ---------- sketch strokes (pencil that "boils" at 12fps like hand-drawn animation) ----------
export function sketchPoly(ctx, pts, o = {}) {
  const { seed = 1, t = 0, color = C.graphite, width = 2.2, jitter = 1.6, progress = 1, closed = false, passes = 2, alpha = 1, overshoot = 5 } = o;
  if (progress <= 0 || pts.length < 2) return;
  const boil = Math.floor(t * 12);
  const P = closed ? [...pts, pts[0]] : pts;
  const segs = [];
  let total = 0;
  for (let i = 0; i < P.length - 1; i++) {
    const l = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]);
    segs.push(l); total += l;
  }
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let pass = 0; pass < passes; pass++) {
    ctx.strokeStyle = color;
    ctx.globalAlpha *= pass === 0 ? alpha : 1;
    ctx.lineWidth = pass === 0 ? width : width * 0.55;
    if (pass === 1) ctx.globalAlpha = alpha * 0.55;
    let budget = total * progress;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < segs.length && budget > 0; i++) {
      const [x1, y1] = P[i], [x2, y2] = P[i + 1];
      const L = segs[i];
      const frac = Math.min(1, budget / Math.max(L, 0.001));
      budget -= L;
      const dx = (x2 - x1) / (L || 1), dy = (y2 - y1) / (L || 1);
      const nx = -dy, ny = dx;
      const j = jitter * (1 + pass * 0.8);
      const bow = hs(seed, i, pass, boil) * Math.min(L * 0.02, 6) * (jitter / 1.6);
      const ov = overshoot * hash(seed, i, pass, 7);
      const sx = x1 + hs(seed, i, pass, boil, 1) * j - dx * (i === 0 ? ov : 0);
      const sy = y1 + hs(seed, i, pass, boil, 2) * j - dy * (i === 0 ? ov : 0);
      const ex = x2 + hs(seed, i + 1, pass, boil, 1) * j + dx * ov * 0.6;
      const ey = y2 + hs(seed, i + 1, pass, boil, 2) * j + dy * ov * 0.6;
      const mx = (sx + ex) / 2 + nx * bow, my = (sy + ey) / 2 + ny * bow;
      const steps = Math.max(2, Math.ceil(L / 14));
      if (!started) { ctx.moveTo(sx, sy); started = true; } else if (pass >= 0) { ctx.moveTo(sx, sy); }
      for (let s = 1; s <= steps; s++) {
        const u = (s / steps) * frac;
        const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
        ctx.lineTo(a * sx + b * mx + c * ex, a * sy + b * my + c * ey);
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}
export function sketchCircle(ctx, cx, cy, r, o = {}) {
  const { seed = 3, t = 0, progress = 1, start = -Math.PI * 0.6 } = o;
  const boil = Math.floor(t * 12);
  const pts = [];
  const n = 48;
  const turns = 1.08;
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * Math.PI * 2 * turns;
    const rr = r * (1 + noise1(i * 0.35, seed + boil * 0.013) * 0.035 + (i / n) * 0.03);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  sketchPoly(ctx, pts, { ...o, jitter: 0.6, progress, overshoot: 0 });
}
// Diagonal pencil hatching clipped to a polygon.
export function hatch(ctx, poly, o = {}) {
  const { spacing = 11, angle = -0.9, color = C.graphite, alpha = 0.45, seed = 5, t = 0, progress = 1, width = 1.2 } = o;
  if (progress <= 0) return;
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  ctx.save();
  ctx.beginPath();
  poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.closePath();
  ctx.clip();
  const diag = Math.hypot(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const n = Math.ceil(diag / spacing);
  const boil = Math.floor(t * 12);
  for (let i = -n / 2; i < n / 2; i++) {
    if ((i + n / 2) / n > progress) break;
    const off = i * spacing + hs(seed, i, boil) * 2;
    const x1 = cx + -sa * off - ca * diag, y1 = cy + ca * off - sa * diag;
    const x2 = cx + -sa * off + ca * diag, y2 = cy + ca * off + sa * diag;
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha * (0.7 + hash(seed, i) * 0.3);
    ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  ctx.restore();
}

// ---------- 3D ----------
export function rotY(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; }
export function rotX(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }
export function rotZ(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }
// Camera: orbit (yaw/pitch) around target, perspective with focal length f (large f ≈ axonometric).
export function makeCam({ yaw = 0, pitch = 0, target = [0, 0, 0], dist = 20, f = 1400, cx = W / 2, cy = H / 2, scale = 1 }) {
  return (p) => {
    let q = [p[0] - target[0], p[1] - target[1], p[2] - target[2]];
    q = rotY(q, yaw);
    q = rotX(q, pitch);
    const z = q[2] + dist;
    const k = (f / Math.max(z, 0.01)) * scale;
    return [cx + q[0] * k, cy - q[1] * k, z];
  };
}

// ---------- images ----------
export const images = {};
export function loadImage(key, src) {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => { images[key] = im; res(im); };
    im.onerror = () => { console.warn('img fail', src); res(null); };
    im.src = src;
  });
}
export async function loadSvgTinted(key, src, color) {
  const txt = await (await fetch(src)).text();
  const svg = txt
    .replace(/currentColor/g, color)
    .replace(/width="1em"/, 'width="512"')
    .replace(/height="1em"/, 'height="512"');
  const hasFill = /<svg[^>]*fill=/.test(svg);
  const final = hasFill ? svg : svg.replace('<svg ', `<svg fill="${color}" `);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(final);
  return loadImage(key, url);
}
export function circleImage(ctx, im, cx, cy, r, alpha = 1) {
  if (!im) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(im, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
export function fillBg(ctx, color) { ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.fillRect(-W * 2, -H * 2, W * 5, H * 5); ctx.restore(); }
export function withAlpha(ctx, a, fn) { ctx.save(); ctx.globalAlpha *= a; fn(); ctx.restore(); }
// Zoom around a point (camera punch-ins).
export function zoomAt(ctx, s, x = W / 2, y = H / 2) { ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); }
