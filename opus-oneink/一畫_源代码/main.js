'use strict';
// ═══════════════════════════════════════════════════════════════
//  一畫 —— 以代码书写的水墨手卷
// ═══════════════════════════════════════════════════════════════
const W = 1920, H = 1080, FPS = 30;
const DUR = 60.5;
const DT = 1 / FPS;

// ───────── utilities ─────────
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let rnd = mulberry32(20260926);
const rr = (a, b) => a + (b - a) * rnd();
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeIO = t => t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t);
function hash1(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
function vnoise(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash1(i), hash1(i + 1), u); }
function hash2(x, y) { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
function gnoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const g = (i, j) => { const a = hash2(ix + i, iy + j) * 6.2831853; return Math.cos(a) * (fx - i) + Math.sin(a) * (fy - j); };
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  return lerp(lerp(g(0, 0), g(1, 0), ux), lerp(g(0, 1), g(1, 1), ux), uy);
}
function psi(x, y, t) { return gnoise(x + t * 0.05, y - t * 0.03) + 0.5 * gnoise(x * 2.1 - t * 0.08, y * 2.1 + 3.3) + 0.25 * gnoise(x * 4.3, y * 4.3 + t * 0.1); }
function curl(x, y, t) { const e = 0.02; return [(psi(x, y + e, t) - psi(x, y - e, t)) / (2 * e), -(psi(x + e, y, t) - psi(x - e, y, t)) / (2 * e)]; }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// ───────── layers ─────────
const cvA = mkCanvas(W, H), cA = cvA.getContext('2d');           // ink density (alpha)
const cvB = mkCanvas(W / 2, H / 2), cB = cvB.getContext('2d');   // wet halo source
const cvC = mkCanvas(W, H), cC = cvC.getContext('2d');           // vermilion layer
const cvD = mkCanvas(W, H), cD = cvD.getContext('2d');           // end title overlay
for (const c of [cA, cB, cC]) { c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; }

// ───────── camera ─────────
const cam = { x: 0, y: 0, h: 1, rot: 0, vx: 0, vy: 0, sx: 0, sy: 0 };
function camMat(scale) { // world → screen (optionally scaled for half-res)
  const s = H / cam.h * scale, c = Math.cos(cam.rot) * s, sn = Math.sin(cam.rot) * s;
  const a = c, b = sn, cc = -sn, d = c;
  const e = W * scale / 2 - (a * (cam.x + cam.sx) + cc * (cam.y + cam.sy));
  const f = H * scale / 2 - (b * (cam.x + cam.sx) + d * (cam.y + cam.sy));
  return [a, b, cc, d, e, f];
}
function setCam(ctx, scale) { const m = camMat(scale); ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); }
function w2s(x, y) { const m = camMat(1); return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
function viewRect(pad) { const hw = cam.h * W / H / 2 * 1.15 + pad, hh = cam.h / 2 * 1.15 + pad; return [cam.x - hw, cam.y - hh, cam.x + hw, cam.y + hh]; }

// ───────── glyph data (Make Me a Hanzi medians / outlines) ─────────
const GLY = {};
function resampleMed(m) {
  if (m.length === 1) m = [m[0], [m[0][0] + 1, m[0][1] - 1]];
  const pts = [];
  for (let i = 0; i < m.length - 1; i++) {
    const p0 = m[Math.max(0, i - 1)], p1 = m[i], p2 = m[i + 1], p3 = m[Math.min(m.length - 1, i + 2)];
    for (let k = 0; k < 10; k++) {
      const t = k / 10, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(m[m.length - 1]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = Math.max(1, cum[cum.length - 1]);
  const n = Math.max(3, Math.ceil(L / 8));
  const X = new Float32Array(n), Y = new Float32Array(n), S = new Float32Array(n), NX = new Float32Array(n), NY = new Float32Array(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const s = L * i / (n - 1);
    while (j < cum.length - 2 && cum[j + 1] < s) j++;
    const u = (s - cum[j]) / Math.max(1e-6, cum[j + 1] - cum[j]);
    X[i] = lerp(pts[j][0], pts[j + 1][0], clamp(u, 0, 1)); Y[i] = lerp(pts[j][1], pts[j + 1][1], clamp(u, 0, 1)); S[i] = s;
  }
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 2), b = Math.min(n - 1, i + 2);
    let tx = X[b] - X[a], ty = Y[b] - Y[a]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    NX[i] = -ty; NY[i] = tx;
  }
  return { X, Y, S, NX, NY, L, n };
}
async function loadGlyph(c) {
  if (c in GLY) return GLY[c];
  try {
    const r = await fetch('node_modules/hanzi-writer-data/' + encodeURIComponent(c) + '.json');
    if (!r.ok) { GLY[c] = null; return null; }
    const j = await r.json();
    GLY[c] = { c, raw: j.strokes, rawMed: j.medians, paths: j.strokes.map(s => new Path2D(s)), meds: j.medians.map(resampleMed) };
  } catch (e) { GLY[c] = null; }
  return GLY[c];
}

function warpPathStr(str, f) {
  const tk = str.split(/\s+/); const out = [];
  for (let i = 0; i < tk.length;) {
    const t = tk[i];
    if (/^[A-Za-z]$/.test(t)) { out.push(t); i++; continue; }
    const X = +tk[i], Y = +tk[i + 1]; const [a, b] = f(X, Y); out.push(a.toFixed(1), b.toFixed(1)); i += 2;
  }
  return out.join(' ');
}
function warpGlyph(g, w) {
  const f = (X, Y) => {
    const u = (X - 512) / 512, v = (Y - 388) / 512;
    let x = X + w.it * (Y - 388) + w.a * 512 * Math.sin(v * 2.2 + w.p1) * 0.05;
    let y = Y + w.rise * (X - 512) + w.b * 512 * Math.sin(u * 2.4 + w.p2) * 0.05;
    x = 512 + (x - 512) * w.sx;
    return [x, y];
  };
  return { c: g.c, paths: g.raw.map(s => new Path2D(warpPathStr(s, f))), meds: g.rawMed.map(m => resampleMed(m.map(p => f(p[0], p[1])))) };
}
// ───────── events (exported for the score) ─────────
const EVENTS = [];
function ev(t, type, o) { EVENTS.push(Object.assign({ t: +t.toFixed(3), type }, o || {})); }

// ───────── character instances ─────────
const INST = [];
const brush = { load: 1 };
function makeInst(ch, x, y, size, opt, t0, dur) {
  let g = GLY[ch];
  if (!g) return null;
  if (opt.warp) { const w = opt.warp; g = warpGlyph(g, { rise: w.rise * rr(0.6, 1.3), it: w.it * rr(0.4, 1.4), a: rr(-1, 1) * w.amp, b: rr(-1, 1) * w.amp, p1: rr(0, 6), p2: rr(0, 6), sx: w.sx ?? 1 }); }
  const nS = g.paths.length;
  const lens = g.meds.map(m => m.L);
  const ws = lens.map(L => Math.max(0.5, Math.pow(L / 500, 0.7)));
  const gapW = opt.gapW ?? 0.32;
  const tot = ws.reduce((a, b) => a + b, 0) + gapW * (nS - 1);
  let t = t0; const unit = dur / tot;
  const strokes = [];
  // brush ink load
  if (brush.load < (opt.redip ?? 0.35) || opt.dip) { brush.load = 1; }
  const charWet = brush.load;
  for (let i = 0; i < nS; i++) {
    const d = ws[i] * unit;
    const load = brush.load;
    brush.load = Math.max(0, brush.load - lens[i] * (opt.drain ?? 0.00012));
    const dry = clamp(((opt.dryBase ?? 0.0) + (1 - load) * (opt.dryK ?? 0.6)), 0, 1);
    const tone = clamp((opt.toneBase ?? 0.82) + load * (opt.toneK ?? 0.18) + rr(-0.04, 0.04), 0.3, 1);
    strokes.push({ t0: t, t1: t + d, tone, dry, seed: rr(0, 1000), lian: rnd() < (opt.lian ?? 0.5), er: (opt.thin ?? 0) * rr(0.2, 1.4) });
    t += d + gapW * unit;
  }
  const inst = {
    ch, g, x, y, size, rot: opt.rot ?? 0, sx: opt.sx ?? 1, sy: opt.sy ?? 1, bold: opt.bold ?? 0,
    strokes, t0, tEnd: strokes[nS - 1].t1, wet: (opt.wet ?? 0.4) * (0.5 + 0.5 * charWet), alpha: 1,
    cache: {}, sec: opt.sec ?? 0, dissolveT: 1e9, special: opt.special || null, halo: opt.halo ?? 1,
    tint: opt.tint || null
  };
  INST.push(inst);
  return inst;
}
// grid → world point for an instance
function g2w(inst, X, Y) {
  const lx = (X - 512) / 1024 * inst.size * inst.sx, ly = (388 - Y) / 1024 * inst.size * inst.sy;
  const c = Math.cos(inst.rot), s = Math.sin(inst.rot);
  return [inst.x + c * lx - s * ly, inst.y + s * lx + c * ly];
}
const THREADS = []; // inter-character 连笔 threads (world space)

// Lay out one vertical column
function column(text, x, yTop, t0, opt) {
  let y = yTop, t = t0, prev = null;
  const out = [];
  const chars = [...text];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const sz = (opt.sizes && opt.sizes[i]) || opt.size * (1 + rr(-opt.sizeJ, opt.sizeJ));
    const dur = (opt.durs && opt.durs[i]) || opt.dur * (0.8 + 0.4 * rnd());
    y += sz * 0.5 * (opt.pitch ?? 1.0);
    const xo = x + rr(-opt.xJ, opt.xJ) + (opt.sway ? opt.sway(i) : 0);
    const o = Object.assign({}, opt, { rot: rr(-opt.rotJ, opt.rotJ) + (opt.tilt || 0) });
    if (opt.dips && opt.dips.includes(i)) o.dip = true;
    const inst = makeInst(ch, xo, y, sz, o, t, dur);
    if (inst) {
      out.push(inst);
      if (prev && rnd() < (opt.link ?? 0.0) && t - prev.tEnd < 0.6) {
        const lm0 = prev.g.meds[prev.g.meds.length - 1], fm0 = inst.g.meds[0];
        if (lm0.Y[lm0.n - 1] > 250 || fm0.Y[0] < 500) { prev = inst; y += sz * 0.5 * (opt.pitch ?? 1.0) + (opt.gap ?? 0.06); t += dur + (opt.cgap ?? 0.05); continue; }
        const lm = prev.g.meds[prev.g.meds.length - 1], fm = inst.g.meds[0];
        const p0 = g2w(prev, lm.X[lm.n - 1], lm.Y[lm.n - 1]);
        const p3 = g2w(inst, fm.X[0], fm.Y[0]);
        THREADS.push({ p0, p3, t0: prev.tEnd, t1: inst.t0 + 0.02, w: 0.009 * sz, tone: prev.strokes[prev.strokes.length - 1].tone * 0.9 });
      }
      prev = inst;
    }
    y += sz * 0.5 * (opt.pitch ?? 1.0) + (opt.gap ?? 0.06);
    t += dur + (opt.cgap ?? 0.05);
  }
  return { insts: out, tEnd: t, yEnd: y };
}

// ───────── character rendering ─────────
const pool = {};
function poolCanvas(key, n) { let c = pool[key]; if (!c) { c = pool[key] = mkCanvas(n, n); } if (c.width !== n) { c.width = n; c.height = n; } return c; }
const PAD = 1.35;
function strokeProg(st, t) { const u = (t - st.t0) / (st.t1 - st.t0); if (u <= 0) return 0; if (u >= 1) return 1; return 0.55 * easeIO(u) + 0.45 * u; }
function polyPartial(ctx, m, s1) { // path along median up to arclength s1
  ctx.beginPath(); ctx.moveTo(m.X[0], m.Y[0]);
  let i = 1;
  for (; i < m.n && m.S[i] <= s1; i++) ctx.lineTo(m.X[i], m.Y[i]);
  if (i < m.n) { const u = (s1 - m.S[i - 1]) / Math.max(1e-6, m.S[i] - m.S[i - 1]); ctx.lineTo(lerp(m.X[i - 1], m.X[i], u), lerp(m.Y[i - 1], m.Y[i], u)); }
  else ctx.lineTo(m.X[m.n - 1] + 0.1, m.Y[m.n - 1] + 0.1);
}
function drawStreaks(ctx, m, st, s1) {
  const B = 17, span = 150;
  const rs = mulberry32((st.seed * 1000) | 0);
  // texture: faint lighter bristle lines (always present — the hairs of the brush)
  ctx.lineCap = 'round';
  for (let j = -B; j <= B; j++) {
    if (rs() > 0.45) continue;
    const off = j / B * span + (rs() - 0.5) * 6;
    ctx.globalAlpha = 0.05 + rs() * 0.16;
    ctx.lineWidth = 4 + rs() * 6;
    ctx.beginPath(); let started = false;
    for (let i = 0; i < m.n && m.S[i] <= s1; i++) { const x = m.X[i] + m.NX[i] * off, y = m.Y[i] + m.NY[i] * off; if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y); }
    ctx.stroke();
  }
  // dry brush gaps (飞白)
  if (st.dry > 0.02) {
    for (let j = -B; j <= B; j++) {
      const off = j / B * span + (rs() - 0.5) * 8;
      const sd = rs() * 100;
      const edgeF = Math.abs(off) / span;
      ctx.globalAlpha = 0.75 + rs() * 0.25;
      ctx.lineWidth = 5 + rs() * 7;
      ctx.beginPath(); let on = false;
      for (let i = 0; i < m.n && m.S[i] <= s1; i++) {
        const s = m.S[i], sl = s / m.L;
        const v = vnoise(s * 0.018 + sd) * 0.7 + vnoise(s * 0.07 + sd * 3.1) * 0.3;
        const thr = st.dry * (0.15 + 1.0 * sl) * (0.55 + 0.9 * edgeF) - 0.08;
        const gap = v < thr;
        const x = m.X[i] + m.NX[i] * off, y = m.Y[i] + m.NY[i] * off;
        if (gap) { if (!on) { ctx.moveTo(x, y); on = true; } else ctx.lineTo(x, y); }
        else on = false;
      }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}
function renderChar(inst, N, t, target) {
  const g = inst.g;
  const cv = target || poolCanvas('live', N);
  const ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, N, N);
  const sc = poolCanvas('scr' + N, N), sctx = sc.getContext('2d');
  const k = N / PAD / 1024, c = N / 2;
  const T = [k * inst.sx, 0, 0, -k * inst.sy, c - 512 * k * inst.sx, c + 388 * k * inst.sy];
  for (let i = 0; i < g.paths.length; i++) {
    const st = inst.strokes[i];
    let p = strokeProg(st, t);
        if (p <= 0) break;
    const m = g.meds[i];
    const s1 = p * m.L;
    sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalCompositeOperation = 'source-over'; sctx.clearRect(0, 0, N, N);
    sctx.setTransform(T[0], T[1], T[2], T[3], T[4], T[5]);
    sctx.fillStyle = '#000'; sctx.fill(g.paths[i]);
    if (inst.bold > 0) { sctx.lineWidth = inst.bold; sctx.lineJoin = 'round'; sctx.strokeStyle = '#000'; sctx.stroke(g.paths[i]); }
    sctx.globalCompositeOperation = 'destination-out'; sctx.strokeStyle = '#000';
    if (st.er > 0) { sctx.lineWidth = st.er * 2; sctx.lineJoin = 'round'; sctx.stroke(g.paths[i]); }
    drawStreaks(sctx, m, st, s1);
    if (p < 1) {
      sctx.globalCompositeOperation = 'destination-in';
      sctx.lineWidth = 290 + inst.bold; sctx.lineCap = 'round'; sctx.lineJoin = 'round'; sctx.globalAlpha = 1;
      polyPartial(sctx, m, s1); sctx.stroke();
    }
    sctx.globalCompositeOperation = 'source-over';
    let a = st.tone;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(sc, 0, 0); ctx.globalAlpha = 1;
    // 牵丝 — the silk thread between strokes
    if (p >= 1 && i < g.paths.length - 1 && st.lian) {
      const nx = inst.strokes[i + 1];
      const q = clamp((t - st.t1) / Math.max(0.01, nx.t0 - st.t1), 0, 1);
      if (q > 0) {
        const m2 = g.meds[i + 1];
        const x0 = m.X[m.n - 1], y0 = m.Y[m.n - 1], x3 = m2.X[0], y3 = m2.Y[0];
        const d = Math.hypot(x3 - x0, y3 - y0);
        if (d < 520 && d > 40) {
          const ex = m.X[m.n - 1] - m.X[Math.max(0, m.n - 4)], ey = m.Y[m.n - 1] - m.Y[Math.max(0, m.n - 4)], el = Math.hypot(ex, ey) || 1;
          const sx = m2.X[Math.min(m2.n - 1, 3)] - m2.X[0], sy = m2.Y[Math.min(m2.n - 1, 3)] - m2.Y[0], sl = Math.hypot(sx, sy) || 1;
          const x1 = x0 + ex / el * d * 0.45, y1 = y0 + ey / el * d * 0.45, x2 = x3 - sx / sl * d * 0.35, y2 = y3 - sy / sl * d * 0.35;
          ctx.setTransform(T[0], T[1], T[2], T[3], T[4], T[5]);
          ctx.strokeStyle = '#000'; ctx.lineCap = 'round';
          const nseg = 16, segN = Math.ceil(nseg * q);
          let px = x0, py = y0;
          for (let s = 1; s <= segN; s++) {
            const u = Math.min(q, s / nseg), iu = 1 - u;
            const bx = iu * iu * iu * x0 + 3 * iu * iu * u * x1 + 3 * iu * u * u * x2 + u * u * u * x3;
            const by = iu * iu * iu * y0 + 3 * iu * iu * u * y1 + 3 * iu * u * u * y2 + u * u * u * y3;
            ctx.globalAlpha = st.tone * (0.55 + 0.4 * Math.abs(Math.cos(u * Math.PI)));
            ctx.lineWidth = 7 + 12 * Math.abs(Math.cos(u * Math.PI)) + inst.bold * 0.2;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
            px = bx; py = by;
          }
          ctx.globalAlpha = 1;
        }
      }
    }
  }
  return cv;
}
const BUCKETS = [64, 128, 256, 512, 1024, 2048];
function charImage(inst, px, t) {
  const need = Math.min(2048, Math.ceil(px * PAD));
  if (t >= inst.tEnd + 0.02) {
    let b = BUCKETS.find(v => v >= need) || 2048;
    if (!inst.cache[b]) { inst.cache[b] = renderChar(inst, b, inst.tEnd + 1, mkCanvas(b, b)); }
    return inst.cache[b];
  }
  return renderChar(inst, Math.max(32, need), t);
}
function tinted(img, color) {
  const c = poolCanvas('tint' + img.width, img.width), x = c.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, c.width, c.height);
  x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = 'source-over';
  return c;
}
function drawInst(inst, t, vr) {
  if (t < inst.t0) return;
  const r = inst.size;
  if (inst.x + r < vr[0] || inst.x - r > vr[2] || inst.y + r < vr[1] || inst.y - r > vr[3]) return;
  const px = inst.size * H / cam.h;
  if (px < 2) return;
  const img = charImage(inst, px, t);
  let alpha = inst.alpha;
  if (t > inst.dissolveT) alpha *= lerp(1, 0.11, sstep(inst.dissolveT, inst.dissolveT + 1.6, t));
  const S = inst.size * PAD;
  if (inst.tint) {
    const ti = tinted(img, inst.tint);
    setCam(cC, 1); cC.translate(inst.x, inst.y); cC.rotate(inst.rot); cC.globalAlpha = alpha; cC.drawImage(ti, -S / 2, -S / 2, S, S); cC.globalAlpha = 1;
    return;
  }
  setCam(cA, 1); cA.translate(inst.x, inst.y); cA.rotate(inst.rot);
  cA.globalAlpha = alpha; cA.drawImage(img, -S / 2, -S / 2, S, S); cA.globalAlpha = 1;
  const wa = inst.wet * sstep(inst.t0, inst.t0 + 1.4, t) * alpha * inst.halo;
  if (wa > 0.01) { setCam(cB, 0.5); cB.translate(inst.x, inst.y); cB.rotate(inst.rot); cB.globalAlpha = wa; cB.drawImage(img, -S / 2, -S / 2, S, S); cB.globalAlpha = 1; }
}
function drawThreads(t) {
  setCam(cA, 1); cA.strokeStyle = '#000'; cA.lineCap = 'round';
  for (const th of THREADS) {
    if (t < th.t0) continue;
    const q = clamp((t - th.t0) / (th.t1 - th.t0), 0, 1);
    const [x0, y0] = th.p0, [x3, y3] = th.p3;
    const dy_ = Math.max(0.05, y3 - y0); const x1 = x0 - 0.03, y1 = y0 + dy_ * 0.55, x2 = x3 + 0.02, y2 = y3 - dy_ * 0.6;
    let px = x0, py = y0; const nseg = 14;
    let fade = 1; if (th.owner && t > th.owner.dissolveT) fade = lerp(1, 0.11, sstep(th.owner.dissolveT, th.owner.dissolveT + 1.6, t));
    for (let s = 1; s <= Math.ceil(nseg * q); s++) {
      const u = Math.min(q, s / nseg), iu = 1 - u;
      const bx = iu * iu * iu * x0 + 3 * iu * iu * u * x1 + 3 * iu * u * u * x2 + u * u * u * x3;
      const by = iu * iu * iu * y0 + 3 * iu * iu * u * y1 + 3 * iu * u * u * y2 + u * u * u * y3;
      cA.globalAlpha = th.tone * (0.5 + 0.45 * Math.abs(Math.cos(u * Math.PI))) * fade;
      cA.lineWidth = th.w * (0.5 + 0.9 * Math.abs(Math.cos(u * Math.PI)));
      cA.beginPath(); cA.moveTo(px, py); cA.lineTo(bx, by); cA.stroke(); px = bx; py = by;
    }
  }
  cA.globalAlpha = 1;
}

// ───────── generic blobs (drops, splashes) ─────────
function blobPath(ctx, x, y, r, seed, rough, n) {
  n = n || 48; ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2;
    const rr_ = r * (1 + rough * (vnoise(Math.cos(a) * 2.1 + seed) - 0.5) * 2 + rough * 0.5 * (vnoise(a * 5.3 + seed * 2.7) - 0.5));
    const px = x + Math.cos(a) * rr_, py = y + Math.sin(a) * rr_;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════
//  SCORE — the composition
// ═══════════════════════════════════════════════════════════════
const SEAMS = [-8.9, -16.4, -23.1, -26.4];
const PAPER = { top: -1.35, bot: 12.95, left: -64, right: 16 };
let YONG = null, DOT = null;
const LABELS = [];      // 永字八法 annotations
const SEALS = [];       // vermilion seals
const SCRIBBLES = [];   // 祭侄稿 strike-outs
const DROPS = [];       // rain & splashes
const ASH = [];
let SEC_INST = { lan: [], ji: [], han: [], shu: [], end: [] };

async function build() {
  const all = '永和九年歲在癸丑暮春之初會于會稽山陰之蘭亭夫人之相與俯仰一世向之所欣俛仰之間已為陳跡死生亦大矣豈不痛哉後之視今亦猶今之視昔悲夫右晉王羲之蘭亭序父陷子死巢傾卵覆天不悔禍誰為荼毒念爾遘殘百身何贖痛嗚呼哀哉唐顏真卿祭姪文稿自我來黃州已過三寒食空庖煮寒菜破竈燒濕葦也擬哭塗窮死灰吹不起宋蘇軾詩達其情性形其哀樂孫過庭書譜一畫者眾有之本萬象之根石濤句側勒努趯策掠啄磔';
  await Promise.all([...new Set(all)].map(loadGlyph));
  const missing = [...new Set(all)].filter(c => !GLY[c]);
  if (missing.length) console.log('missing glyphs', missing.join(''));

  // ── 蘭亭序 (王羲之, 353) ──
  const lanOpt = { warp: { rise: 0.085, it: 0.05, amp: 0.6 }, thin: 13, size: 0.95, sizeJ: 0.14, dur: 0.34, xJ: 0.05, rotJ: 0.05, pitch: 1.0, gap: 0.03, wet: 0.28, drain: 0.00008, dryK: 0.35, toneBase: 0.84, toneK: 0.16, lian: 0.55, link: 0.3, redip: 0.45, sec: 0 };
  const X0 = 0, CP = 1.36;
  // 永 — the first character, written in extreme close-up
  brush.load = 1;
  const yongT = [[3.35, 3.9], [4.05, 5.2], [5.4, 6.35], [6.55, 7.0], [7.2, 8.15]];
  YONG = makeInst('永', X0, 0.52, 1.05, Object.assign({}, lanOpt, { warp: null, thin: 4, rot: -0.02, special: 'yong', lian: 1, wet: 0.35 }), 3.3, 5);
  YONG.strokes.forEach((s, i) => { s.t0 = yongT[i][0]; s.t1 = yongT[i][1]; s.lian = i !== 0; s.tone = 0.97; s.dry = [0, 0.05, 0.12, 0.05, 0.3][i]; });
  YONG.tEnd = yongT[4][1];
  { const m = YONG.g.meds[0]; let sx = 0, sy = 0; for (let i = 0; i < m.n; i++) { sx += m.X[i]; sy += m.Y[i]; } DOT = g2w(YONG, sx / m.n, sy / m.n); }
  // 八法 labels
  const lab = [[0, 0.5, '側', 1], [1, 0.12, '勒', -1], [1, 0.55, '努', 1], [1, 0.985, '趯', -1], [2, 0.12, '策', -1], [2, 0.8, '掠', -1], [3, 0.5, '啄', 1], [4, 0.82, '磔', 1]];
  for (const [si, f, ch, side] of lab) {
    const m = YONG.g.meds[si], st = YONG.strokes[si];
    const idx = Math.min(m.n - 1, Math.round(f * (m.n - 1)));
    const off = 150 * side;
    const [wx, wy] = g2w(YONG, m.X[idx] + m.NX[idx] * off, m.Y[idx] + m.NY[idx] * off);
    const tt = si === 0 ? 3.95 : st.t0 + (st.t1 - st.t0) * Math.min(1, f + 0.05);
    const L = makeInst(ch, wx, wy, 0.085, { rot: 0, thin: 6, tint: 'rgb(178,44,30)', wet: 0, lian: 0.8, toneBase: 0.9, toneK: 0.1, drain: 0 }, tt, 0.42);
    if (L) LABELS.push(L);
  }
  for (const [si] of lab) ev(YONG.strokes[si].t0, 'yong', { i: si, d: YONG.strokes[si].t1 - YONG.strokes[si].t0 });
  // rest of column 0
  let c0 = column('和九年歲在癸丑暮春之初', X0 + 0.02, 1.02, 8.55, Object.assign({}, lanOpt, { durs: [0.55, 0.5, 0.45, 0.42, 0.38] }));
  SEC_INST.lan.push(YONG, ...c0.insts);
  const lanCols = ['會于會稽山陰之蘭亭', '夫人之相與俯仰一世', '向之所欣俛仰之間已為陳跡', '死生亦大矣豈不痛哉', '後之視今亦猶今之視昔悲夫'];
  const lanT = [9.9, 11.2, 12.55, 14.1, 15.9];
  lanCols.forEach((txt, ci) => {
    const o = Object.assign({}, lanOpt);
    if (ci === 3) { o.dur = 0.47; o.size = 1.0; }
    if (ci === 4) { o.dur = 0.36; o.sizes = { 10: 1.1, 11: 1.12 }; o.durs = { 10: 0.75, 11: 0.8 }; }
    const r = column(txt, X0 - CP * (ci + 1) + rr(-0.05, 0.05), 0.02 + rr(0, 0.12), lanT[ci], o);
    SEC_INST.lan.push(...r.insts);
    ev(lanT[ci], 'col', { sec: 'lan', ci, end: r.tEnd });
  });
  let cap = column('右晉王羲之蘭亭序', X0 - CP * 6 - 0.15, 5.8, 20.0, Object.assign({}, lanOpt, { size: 0.36, sizeJ: 0.04, dur: 0.16, toneBase: 0.62, toneK: 0.1, wet: 0.1, link: 0.5 }));
  SEC_INST.lan.push(...cap.insts);

  // ── 祭姪文稿 (顏真卿, 758) ──
  const jiOpt = { warp: { rise: 0.07, it: 0.08, amp: 1.0 }, size: 0.98, sizeJ: 0.2, dur: 0.33, xJ: 0.1, rotJ: 0.09, pitch: 0.97, gap: 0.02, wet: 0.5, drain: 0.00034, dryK: 1.05, dryBase: 0.02, toneBase: 0.62, toneK: 0.38, lian: 0.7, link: 0.45, redip: 0.12, bold: 10, sec: 1 };
  const JX = -10.1;
  const jiCols = ['父陷子死巢傾卵覆', '天不悔禍誰為荼毒', '念爾遘殘痛百身何贖', '嗚呼哀哉'];
  const jiT = [20.6, 21.85, 23.2, 25.35];
  brush.load = 1;
  jiCols.forEach((txt, ci) => {
    const o = Object.assign({}, jiOpt, { tilt: rr(-0.06, 0.06), sway: i => Math.sin(i * 0.7 + ci) * 0.12, dips: [0] });
    if (ci === 3) { o.size = 1.5; o.sizeJ = 0.12; o.dur = 0.62; o.pitch = 0.92; o.dryK = 1.2; o.drain = 0.0005; o.bold = 16; }
    const r = column(txt, JX - CP * ci * (ci === 3 ? 1.12 : 1) - (ci === 3 ? 0.25 : 0), 0.1 + rr(0, 0.25), jiT[ci], o);
    SEC_INST.ji.push(...r.insts);
    ev(jiT[ci], 'col', { sec: 'ji', ci, end: r.tEnd });
    if (ci === 2) { // strike-out the fifth character
      const v = r.insts[4];
      SCRIBBLES.push({ x: v.x, y: v.y, size: v.size, t0: v.tEnd + 0.03, t1: v.tEnd + 0.5, seed: rr(0, 99) });
      ev(v.tEnd + 0.03, 'strike');
    }
  });
  cap = column('右唐顏真卿祭姪文稿', JX - CP * 4.4 - 0.2, 6.2, 27.5, Object.assign({}, lanOpt, { size: 0.36, sizeJ: 0.04, dur: 0.15, toneBase: 0.62, toneK: 0.1, wet: 0.1, sec: 1 }));
  SEC_INST.ji.push(...cap.insts);

  // ── 黃州寒食詩 (蘇軾, 1082) ──
  const hanOpt = { warp: { rise: 0.11, it: 0.02, amp: 0.7 }, size: 0.92, sizeJ: 0.12, dur: 0.3, xJ: 0.06, rotJ: 0.06, pitch: 0.96, gap: 0.03, wet: 0.62, drain: 0.00011, dryK: 0.4, toneBase: 0.86, toneK: 0.14, lian: 0.45, link: 0.25, redip: 0.4, bold: 26, sx: 1.16, sy: 0.9, sec: 2 };
  const HX = -17.8;
  const hanCols = ['自我來黃州已過三寒食', '空庖煮寒菜破竈燒濕葦', '也擬哭塗窮死灰吹不起'];
  const hanT = [28.5, 29.75, 31.1];
  brush.load = 1;
  hanCols.forEach((txt, ci) => {
    const o = Object.assign({}, hanOpt, { tilt: -0.05 - 0.02 * ci });
    if (ci === 2) { o.durs = { 3: 0.42, 4: 0.5, 5: 0.6, 6: 0.62, 7: 0.6, 8: 0.62, 9: 0.75 }; o.sizes = { 3: 1.02, 4: 1.08, 5: 1.12, 6: 1.12, 7: 1.0, 8: 0.98, 9: 1.1 }; }
    const r = column(txt, HX - 1.42 * ci, 0.05 + ci * 0.1, hanT[ci], o);
    SEC_INST.han.push(...r.insts);
    ev(hanT[ci], 'col', { sec: 'han', ci, end: r.tEnd });
    if (ci === 2) {
      const hui = r.insts[6];
      for (let i = 0; i < 90; i++) ASH.push({ x: hui.x + rr(-0.35, 0.35), y: hui.y + rr(-0.35, 0.35), t0: hui.tEnd + rr(0.1, 1.6), life: rr(1.5, 3.5), s: rr(0.6, 1.8), seed: rr(0, 99) });
    }
  });
  cap = column('右宋蘇軾黃州寒食詩', HX - 1.42 * 3 - 0.05, 5.4, 34.6, Object.assign({}, lanOpt, { size: 0.36, sizeJ: 0.04, dur: 0.15, toneBase: 0.62, toneK: 0.1, wet: 0.12, sec: 2 }));
  SEC_INST.han.push(...cap.insts);
  // rain on the 寒食 paper
  for (let i = 0; i < 24; i++) {
    const t = rr(29.0, 35.5);
    DROPS.push({ t, x: rr(-24.0, -15.6), y: rr(-1.0, 12.8), r: rr(0.015, 0.04), a: rr(0.03, 0.08), wet: rr(0.3, 0.6), seed: rr(0, 99), kind: 'rain' });
  }

  // ── 書譜 (孫過庭, 687) ──
  const shuOpt = Object.assign({}, lanOpt, { warp: { rise: 0.08, it: 0.06, amp: 0.6 }, thin: 8, size: 0.98, dur: 0.43, sizeJ: 0.06, wet: 0.3, lian: 0.75, link: 0.5, sec: 3, toneBase: 0.8, dryK: 0.55, drain: 0.00013 });
  brush.load = 1;
  let r = column('達其情性形其哀樂', -24.4, 0.9, 35.55, shuOpt);
  SEC_INST.shu.push(...r.insts);
  ev(35.55, 'col', { sec: 'shu', end: r.tEnd });
  cap = column('右唐孫過庭書譜', -25.5, 6.4, 38.5, Object.assign({}, lanOpt, { size: 0.36, sizeJ: 0.04, dur: 0.15, toneBase: 0.62, toneK: 0.1, wet: 0.1, sec: 3 }));
  SEC_INST.shu.push(...cap.insts);

  // ── Inscription after the 一畫 ──
  brush.load = 1;
  const endOpt = Object.assign({}, lanOpt, { size: 0.5, sizeJ: 0.05, dur: 0.17, toneBase: 0.8, wet: 0.2, lian: 0.7, link: 0.5, sec: 4 });
  r = column('一畫者眾有之本', STROKE.x0 + 0.25, STROKE.y0 + 1.9, 55.2, endOpt);
  SEC_INST.end.push(...r.insts);
  const r2 = column('萬象之根', STROKE.x0 - 0.5, STROKE.y0 + 1.9, 56.45, endOpt);
  SEC_INST.end.push(...r2.insts);
  const r3 = column('石濤句', STROKE.x0 - 0.5, r2.yEnd + 0.14, 57.2, Object.assign({}, endOpt, { size: 0.33, dur: 0.14 }));
  SEC_INST.end.push(...r3.insts);
  ev(55.2, 'inscr');
  SEALS.push({ img: makeSeal(['無盡', '藏'], 'bai'), x: STROKE.x0 - 0.5, y: r3.yEnd + 0.5, size: 0.62, t0: 57.9, a: 1, kind: 'final' });
  ev(57.9, 'seal');
  // 神龍 half-seals on the 蘭亭, 紹興 across a seam — the scars of collectors
  SEALS.push({ img: makeSeal(['神', '龍'], 'zhu'), x: 0.95, y: -0.55, size: 0.5, t0: -1, a: 0.62, clip: 'rightHalf' });
  SEALS.push({ img: makeSeal(['神', '龍'], 'zhu'), x: SEAMS[0], y: 11.9, size: 0.5, t0: -1, a: 0.6, clip: 'leftHalf' });
  SEALS.push({ img: makeSeal(['紹', '興'], 'zhu', true), x: SEAMS[1], y: 11.95, size: 0.46, t0: -1, a: 0.55, split: 0.035 });
  SEALS.push({ img: makeSeal(['紹', '興'], 'zhu', true), x: SEAMS[2], y: 11.9, size: 0.46, t0: -1, a: 0.5, split: -0.03 });

  // assign dissolve wave (right → left)
  for (const s of [SEC_INST.lan, SEC_INST.ji, SEC_INST.han, SEC_INST.shu]) for (const v of s) v.dissolveT = 40.6 + (-v.x) / 26 * 2.4 + rr(0, 0.35);
  for (const L of LABELS) L.dissolveT = 40.4 + rr(0, 0.3);
  for (const th of THREADS) { th.owner = INST.find(v => Math.hypot(v.x - th.p0[0], v.y - th.p0[1]) < v.size); }
  EVENTS.sort((a, b) => a.t - b.t);
}

// ───────── seals ─────────
function makeSeal(cols, type, rect) {
  const S = 512, c = mkCanvas(S, S), x = c.getContext('2d');
  const rs = mulberry32(cols.join('').charCodeAt(0) * 7 + 3);
  const red = 'rgb(196,48,34)';
  x.fillStyle = red;
  const m = 26;
  if (type === 'bai') { // 白文: red block, characters carved white
    x.beginPath(); for (let i = 0; i <= 64; i++) { const u = i / 64; const px = m + u * (S - 2 * m); x.lineTo(px + (rs() - 0.5) * 5, m + (rs() - 0.5) * 6); }
    for (let i = 0; i <= 64; i++) { const u = i / 64; x.lineTo(S - m + (rs() - 0.5) * 6, m + u * (S - 2 * m)); }
    for (let i = 0; i <= 64; i++) { const u = i / 64; x.lineTo(S - m - u * (S - 2 * m), S - m + (rs() - 0.5) * 6); }
    for (let i = 0; i <= 64; i++) { const u = i / 64; x.lineTo(m + (rs() - 0.5) * 6, S - m - u * (S - 2 * m)); }
    x.fill();
    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = '#000'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '900 205px "Noto Serif CJK TC"';
    // right column: 無 盡 ; left column: 藏 (tall)
    x.save(); x.translate(S * 0.72, S * 0.29); x.scale(0.92, 0.98); x.fillText(cols[0][0], 0, 0); x.restore();
    x.save(); x.translate(S * 0.72, S * 0.71); x.scale(0.92, 0.98); x.fillText(cols[0][1], 0, 0); x.restore();
    x.save(); x.translate(S * 0.28, S * 0.5); x.scale(0.92, 2.0); x.fillText(cols[1], 0, 0); x.restore();
  } else { // 朱文: red characters with a border
    x.strokeStyle = red; x.lineWidth = 22; x.strokeRect(m + 10, m + 10, S - 2 * m - 20, rect ? S - 2 * m - 20 : S - 2 * m - 20);
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 200px "Noto Serif CJK TC"';
    x.fillText(cols[0], S * 0.5, S * 0.3); x.fillText(cols[1], S * 0.5, S * 0.71);
  }
  // erosion: age & paste unevenness
  x.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 2600; i++) { x.globalAlpha = rs() * 0.5; x.beginPath(); x.arc(rs() * S, rs() * S, rs() * rs() * 7 + 0.5, 0, 6.283); x.fill(); }
  for (let i = 0; i < 40; i++) { x.globalAlpha = 0.9; x.beginPath(); const a = rs() * 6.283, rad = S * 0.47; x.arc(S / 2 + Math.cos(a) * rad * (rs() < 0.5 ? 1 : 0.93), S / 2 + Math.sin(a) * rad, rs() * 12 + 2, 0, 6.283); x.fill(); }
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  return c;
}
function drawSeals(t) {
  for (const s of SEALS) {
    if (t < s.t0) continue;
    let a = s.a, sc = 1;
    if (s.kind === 'final') { const u = clamp((t - s.t0) / 0.16, 0, 1); a *= u; sc = lerp(1.06, 1, u); }
    const S = s.size * sc;
    setCam(cC, 1);
    cC.save(); cC.translate(s.x, s.y);
    if (s.clip) { cC.beginPath(); if (s.clip === 'rightHalf') cC.rect(-S, -S, S, 2 * S); else cC.rect(0, -S, S, 2 * S); cC.clip(); }
    cC.globalAlpha = a;
    if (s.split) { // 騎縫: two halves slightly misaligned
      cC.save(); cC.beginPath(); cC.rect(-S, -S, S, 2 * S); cC.clip(); cC.drawImage(s.img, -S / 2, -S / 2 + s.split, S, S); cC.restore();
      cC.save(); cC.beginPath(); cC.rect(0, -S, S, 2 * S); cC.clip(); cC.drawImage(s.img, -S / 2, -S / 2, S, S); cC.restore();
    } else cC.drawImage(s.img, -S / 2, -S / 2, S, S);
    cC.restore(); cC.globalAlpha = 1;
  }
}

// ───────── opening: the drop ─────────
const SAT = [];
function initDrop() {
  for (let i = 0; i < 9; i++) { const a = rr(0, 6.283), d = rr(0.07, 0.2); SAT.push({ a, d, r: rr(0.0015, 0.005), dt: rr(0.02, 0.12), seed: rr(0, 99), el: rnd() < 0.4 }); }
}
const T_DROP = 2.45;
function drawDrop(t) {
  const [dx, dy] = DOT;
  if (t < T_DROP - 0.6 || t > 12) return;
  setCam(cA, 1); setCam(cB, 0.5);
  if (t < T_DROP) { // the falling drop, seen from above: a soft shadow tightening
    const u = sstep(T_DROP - 0.6, T_DROP, t);
    const r = 0.05 - u * 0.03;
    const gr = cA.createRadialGradient(dx, dy, 0, dx, dy, r * 2);
    gr.addColorStop(0, `rgba(0,0,0,${0.05 + u * 0.45})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
    cA.fillStyle = gr; cA.beginPath(); cA.arc(dx, dy, r * 2, 0, 6.283); cA.fill();
    return;
  }
  const age = t - T_DROP;
  const R = 0.05 * (1 - Math.exp(-age * 9)) + 0.018 * sstep(0, 2.0, age);
  // bloom: dense core that relaxes into a pale wash once the brush has taken the ink
  const k = 1 - 0.78 * sstep(0.85, 1.5, age);
  const gr = cA.createRadialGradient(dx, dy, 0, dx, dy, R * 1.3);
  gr.addColorStop(0, `rgba(0,0,0,${0.97 * k + 0.2 * (1 - k)})`); gr.addColorStop(0.5, `rgba(0,0,0,${0.95 * k + 0.16 * (1 - k)})`);
  gr.addColorStop(0.72, `rgba(0,0,0,${0.6 * k + 0.12})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
  cA.fillStyle = gr; cA.globalAlpha = 1; blobPath(cA, dx, dy, R * 1.3, 3.1, 0.1, 96); cA.fill();
  cA.fillStyle = '#000';
  cB.fillStyle = '#000';
  cB.globalAlpha = 0.95 * sstep(0, 0.9, age); blobPath(cB, dx, dy, R * 1.55, 5.5, 0.22, 64); cB.fill();
  cA.globalAlpha = 1;
  for (const s of SAT) {
    if (age < s.dt) continue;
    const ux = Math.cos(s.a), uy = Math.sin(s.a);
    const x = dx + ux * s.d, y = dy + uy * s.d;
    cA.globalAlpha = 0.85;
    if (s.el) { cA.save(); cA.translate(x, y); cA.rotate(s.a); cA.beginPath(); cA.ellipse(0, 0, s.r * 2.4, s.r * 0.8, 0, 0, 6.283); cA.fill(); cA.restore(); }
    else { blobPath(cA, x, y, s.r, s.seed, 0.15, 20); cA.fill(); }
    cB.globalAlpha = 0.5; blobPath(cB, x, y, s.r * 2.5, s.seed, 0.2, 16); cB.fill();
  }
  cA.globalAlpha = 1; cB.globalAlpha = 1;
}

// ───────── scribbles (strike-outs) ─────────
function drawScribbles(t) {
  setCam(cA, 1); setCam(cB, 0.5);
  for (const s of SCRIBBLES) {
    if (t < s.t0) continue;
    const q = clamp((t - s.t0) / (s.t1 - s.t0), 0, 1);
    const n = 90, m = Math.ceil(n * q);
    let fade = 1; if (t > 40.6) fade = lerp(1, 0.11, sstep(41.8, 43.4, t));
    cA.strokeStyle = '#000'; cA.lineCap = 'round'; cA.lineJoin = 'round';
    let px, py;
    for (let i = 0; i <= m; i++) {
      const u = i / n;
      const x = s.x + s.size * (0.36 * Math.sin(u * 6.283 * 3.2 + s.seed) + 0.08 * Math.sin(u * 40));
      const y = s.y + s.size * (-0.4 + 0.8 * u + 0.12 * Math.sin(u * 6.283 * 5.1 + 1.3));
      if (i > 0) { cA.globalAlpha = 0.9 * fade; cA.lineWidth = s.size * (0.11 + 0.05 * Math.sin(u * 17)); cA.beginPath(); cA.moveTo(px, py); cA.lineTo(x, y); cA.stroke(); }
      px = x; py = y;
    }
    cB.globalAlpha = 0.5 * q * fade; cB.fillStyle = '#000'; blobPath(cB, s.x, s.y, s.size * 0.42, s.seed, 0.2, 40); cB.fill();
  }
  cA.globalAlpha = 1; cB.globalAlpha = 1;
}

// ───────── rain & splash drops ─────────
function drawDrops(t) {
  setCam(cA, 1); setCam(cB, 0.5);
  const vr = viewRect(0.3);
  for (const d of DROPS) {
    if (t < d.t) continue;
    if (d.x < vr[0] || d.x > vr[2] || d.y < vr[1] || d.y > vr[3]) continue;
    const age = t - d.t;
    let fade = 1;
    if (d.kind === 'rain' && t > 40.6) fade = lerp(1, 0.2, sstep(42.2, 44, t));
    if (d.kind === 'rain') {
      const r = d.r * (0.4 + 0.6 * (1 - Math.exp(-age * 9)));
      cA.fillStyle = '#000'; cA.globalAlpha = d.a * fade; blobPath(cA, d.x, d.y, r, d.seed, 0.18, 28); cA.fill();
      cA.globalAlpha = d.a * 0.6 * fade; cA.lineWidth = r * 0.12; cA.strokeStyle = '#000'; blobPath(cA, d.x, d.y, r * 1.02, d.seed + 1, 0.18, 28); cA.stroke();
      cB.fillStyle = '#000'; cB.globalAlpha = d.wet * 0.6 * sstep(0, 0.8, age) * fade; blobPath(cB, d.x, d.y, r * 1.5, d.seed, 0.2, 24); cB.fill();
    } else { // flung ink (泼墨)
      const fl = clamp(age / d.fly, 0, 1);
      if (fl < 1) {
        const x = lerp(d.x0, d.x, fl), y = lerp(d.y0, d.y, fl) - Math.sin(fl * Math.PI) * d.arc;
        const x2 = lerp(d.x0, d.x, Math.max(0, fl - 0.12)), y2 = lerp(d.y0, d.y, Math.max(0, fl - 0.12)) - Math.sin(Math.max(0, fl - 0.12) * Math.PI) * d.arc;
        cA.globalAlpha = 0.85; cA.strokeStyle = '#000'; cA.lineCap = 'round'; cA.lineWidth = d.r * 1.3; cA.beginPath(); cA.moveTo(x2, y2); cA.lineTo(x, y); cA.stroke();
      } else {
        const ang = Math.atan2(d.y - d.y0, d.x - d.x0);
        cA.fillStyle = '#000'; cA.globalAlpha = d.a;
        cA.save(); cA.translate(d.x, d.y); cA.rotate(ang);
        blobPath(cA, 0, 0, d.r, d.seed, 0.22, 30); cA.fill();
        if (d.tail) { cA.beginPath(); cA.ellipse(d.r * 1.8, 0, d.r * 1.6, d.r * 0.35, 0, 0, 6.283); cA.fill(); cA.beginPath(); cA.arc(d.r * 4.0, 0, d.r * 0.35, 0, 6.283); cA.fill(); }
        cA.restore();
        cB.fillStyle = '#000'; cB.globalAlpha = d.wet * sstep(0, 0.9, age - d.fly); blobPath(cB, d.x, d.y, d.r * 1.8, d.seed, 0.25, 24); cB.fill();
      }
    }
  }
  cA.globalAlpha = 1; cB.globalAlpha = 1;
}
function drawAsh(t) {
  const m = camMat(1);
  cA.setTransform(1, 0, 0, 1, 0, 0);
  for (const a of ASH) {
    const age = t - a.t0; if (age < 0 || age > a.life) continue;
    const [vx, vy] = curl(a.x * 0.8 + a.seed, a.y * 0.8, t);
    const x = a.x - age * 0.18 + vx * age * 0.12, y = a.y - age * 0.32 + vy * age * 0.12;
    const sx = m[0] * x + m[2] * y + m[4], sy = m[1] * x + m[3] * y + m[5];
    cA.globalAlpha = 0.5 * Math.sin(age / a.life * Math.PI);
    cA.fillStyle = '#000'; cA.fillRect(sx, sy, a.s, a.s);
  }
  cA.globalAlpha = 1;
}

// ═══════════ 诗云 — dissolve, galaxy, collapse ═══════════
const STROKE = { x0: -44.6, y0: 6.05, L: 15.2 };
const P = [STROKE.x0, STROKE.y0];
const MAXP = 26000;
const PX = new Float32Array(MAXP), PY = new Float32Array(MAXP), PVX = new Float32Array(MAXP), PVY = new Float32Array(MAXP), PB = new Float32Array(MAXP), PS = new Float32Array(MAXP), PA = new Float32Array(MAXP);
let NP = 0;
const T_COL0 = 47.55, T_COL1 = 49.35;
function spawnParticles(inst) {
  const img = inst.cache[128] || (inst.cache[128] = renderChar(inst, 128, inst.tEnd + 1, mkCanvas(128, 128)));
  const d = img.getContext('2d').getImageData(0, 0, 128, 128).data;
  const pts = [];
  for (let y = 0; y < 128; y += 2) for (let x = 0; x < 128; x += 2) if (d[(y * 128 + x) * 4 + 3] > 110) pts.push([x, y]);
  const n = Math.min(pts.length, Math.round(inst.size * inst.size * 150));
  const c = Math.cos(inst.rot), s = Math.sin(inst.rot);
  for (let i = 0; i < n && NP < MAXP; i++) {
    const p = pts[(rnd() * pts.length) | 0];
    const lx = (p[0] / 128 - 0.5) * inst.size * PAD, ly = (p[1] / 128 - 0.5) * inst.size * PAD;
    PX[NP] = inst.x + c * lx - s * ly; PY[NP] = inst.y + s * lx + c * ly;
    PVX[NP] = rr(-0.05, 0.05); PVY[NP] = rr(-0.1, 0.02);
    PB[NP] = inst.dissolveT + rr(0.05, 1.0); PS[NP] = rr(0.7, 1.7); PA[NP] = rr(0.25, 0.6);
    NP++;
  }
}
let CHAINS = [];
function initGalaxy() {
  const lines = window.CORPUS;
  const fonts = ['Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'Long Cang', 'Noto Serif CJK SC'];
  for (let i = 0; i < 380; i++) {
    const ln = lines[(rnd() * lines.length) | 0];
    const st = (rnd() * Math.max(1, ln.length - 6)) | 0;
    const text = [...ln.slice(st, st + 5 + ((rnd() * 9) | 0))];
    const r = 0.8 + Math.pow(rnd(), 0.7) * 9.5;
    const arm = (i % 3) * 2.094;
    CHAINS.push({ text, font: fonts[(rnd() * fonts.length) | 0], r, th: arm + r * 0.42 + rr(-1.2, 1.2), z: rr(-1, 1) * (0.25 + r * 0.14), size: rr(0.16, 0.34) * (0.65 + r * 0.08), f0: 43.1 + rr(0, 3.2) - r * 0.05, w: 0, sp: rr(0.85, 1.15) });
  }
}
function collapseQ(t) { return Math.pow(sstep(T_COL0, T_COL1, t), 1.35); }
function updateParticles(t) {
  const q = collapseQ(t);
  for (let i = 0; i < NP; i++) {
    if (t < PB[i]) continue;
    const dx = P[0] - PX[i], dy = P[1] - PY[i], dist = Math.hypot(dx, dy) + 1e-4;
    const ux = dx / dist, uy = dy / dist;
    const [cx, cy] = curl(PX[i] * 0.33, PY[i] * 0.33, t);
    const att = 0.25 + 2.6 * sstep(41.5, 46.5, t);
    const sw = 1.3 * sstep(42, 46, t) / Math.max(0.6, Math.sqrt(dist * 0.3));
    let tx = cx * 0.9 + ux * att * Math.min(1, dist / 5) - uy * sw * Math.min(1, 9 / dist) * 2.2;
    let ty = cy * 0.9 + uy * att * Math.min(1, dist / 5) + ux * sw * Math.min(1, 9 / dist) * 2.2;
    const k = 0.06;
    PVX[i] += (tx - PVX[i]) * k; PVY[i] += (ty - PVY[i]) * k;
    PX[i] += PVX[i] * DT; PY[i] += PVY[i] * DT;
    if (q > 0) { // accretion
      const f = Math.exp(-DT * (0.5 + 9 * q));
      const ang = DT * (1.5 + 18 * q);
      const rx = PX[i] - P[0], ry = PY[i] - P[1], c = Math.cos(ang), s = Math.sin(ang);
      PX[i] = P[0] + (c * rx - s * ry) * f; PY[i] = P[1] + (s * rx + c * ry) * f;
    }
  }
  for (const ch of CHAINS) {
    const qq = q;
    const reff = ch.r * Math.pow(1 - qq, 1.6) + 0.02;
    const w = 0.55 / Math.sqrt(ch.r) * ch.sp * Math.min(14, Math.pow(ch.r / reff, 0.8));
    ch.th += w * DT;
    ch.reff = reff;
  }
}
function drawParticles(t) {
  if (t < 40.4) return;
  const m = camMat(1), mb = camMat(0.5);
  const q = collapseQ(t);
  cA.setTransform(1, 0, 0, 1, 0, 0); cB.setTransform(1, 0, 0, 1, 0, 0);
  cA.fillStyle = '#000'; cB.fillStyle = '#000';
  const pxu = H / cam.h;
  for (let i = 0; i < NP; i++) {
    if (t < PB[i]) continue;
    const x = PX[i], y = PY[i];
    const sx = m[0] * x + m[2] * y + m[4], sy = m[1] * x + m[3] * y + m[5];
    if (sx < -10 || sy < -10 || sx > W + 10 || sy > H + 10) continue;
    const a = PA[i] * sstep(PB[i], PB[i] + 0.5, t) * (1 + q * 0.8);
    const sz = Math.max(1.0, PS[i] * pxu * 0.011);
    cA.globalAlpha = Math.min(1, a); cA.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
    if ((i & 3) === 0) { cB.globalAlpha = a * 0.5; cB.fillRect((mb[0] * x + mb[2] * y + mb[4]) - sz, (mb[1] * x + mb[3] * y + mb[5]) - sz, sz * 2, sz * 2); }
  }
  cA.globalAlpha = 1; cB.globalAlpha = 1;
}
function drawGalaxy(t) {
  if (t < 43.0 || t > T_COL1 + 0.3) return;
  const q = collapseQ(t);
  const m = camMat(1);
  const pxu = H / cam.h;
  cA.textAlign = 'center'; cA.textBaseline = 'middle'; cA.fillStyle = '#000';
  const tilt = 0.5;
  for (const ch of CHAINS) {
    const fa = sstep(ch.f0, ch.f0 + 1.1, t);
    if (fa <= 0) continue;
    cA.font = `64px "${ch.font}"`;
    const r = ch.reff ?? ch.r;
    const sizeK = 0.25 + 0.75 * Math.pow(r / ch.r, 0.6);
    const sz = ch.size * sizeK;
    for (let j = 0; j < ch.text.length; j++) {
      const th = ch.th - j * sz * 1.08 / Math.max(0.3, r);
      const ct = Math.cos(th), st = Math.sin(th);
      const f = 1 + 0.32 * st;
      const x = P[0] + r * ct, y = P[1] + r * st * tilt + ch.z * (1 - q);
      const sx = m[0] * x + m[2] * y + m[4], sy = m[1] * x + m[3] * y + m[5];
      const spx = sz * f * pxu;
      if (sx < -spx || sy < -spx || sx > W + spx || sy > H + spx) continue;
      if (spx < 0.8) continue;
      const ang = Math.atan2(-ct * tilt, st) + cam.rot;
      cA.globalAlpha = Math.min(1, fa * (0.28 + 0.55 * (f - 0.68) / 0.64) * (1 + q * 1.5));
      const k = spx / 64;
      cA.setTransform(k * Math.cos(ang), k * Math.sin(ang), -k * Math.sin(ang), k * Math.cos(ang), sx, sy);
      cA.fillText(ch.text[j], 0, 0);
    }
  }
  cA.globalAlpha = 1;
}
function drawCore(t) {
  if (t < 48.2) return;
  const rc = 0.3 * sstep(48.3, 49.45, t);
  if (rc <= 0) return;
  setCam(cA, 1); setCam(cB, 0.5);
  const wob = 1 + 0.05 * Math.sin(t * 23) * sstep(49.3, 49.6, t) * (1 - sstep(49.9, 50.1, t));
  cA.fillStyle = '#000'; cA.globalAlpha = 1; blobPath(cA, P[0], P[1], rc * wob, 4.2, 0.12, 64); cA.fill();
  cB.fillStyle = '#000'; cB.globalAlpha = 0.8; blobPath(cB, P[0], P[1], rc * 1.35, 2.2, 0.18, 48); cB.fill();
  cA.globalAlpha = 1; cB.globalAlpha = 1;
}

// ═══════════ 一畫 — the single stroke ═══════════
const T_PRESS = 50.0, T_SWEEP0 = 50.26, T_SWEEP1 = 51.05, T_END1 = 51.35;
const SPU = 330;
let SPR = null, SPRB = null, SPR_X0, SPR_Y0;
function strokeCenter(s) {
  const x = STROKE.x0 + STROKE.L * s;
  const y = STROKE.y0 - 0.5 * s - 0.3 * Math.sin(Math.PI * s);
  return [x, y];
}
function strokeHalfW(s) {
  return 0.6 - 0.15 * sstep(0.02, 0.3, s) + 0.08 * sstep(0.32, 0.62, s) - 0.16 * sstep(0.7, 1.0, s) + 0.02 * Math.sin(s * 19);
}
function buildStroke() {
  SPR_X0 = STROKE.x0 - 2.0; SPR_Y0 = STROKE.y0 - 2.6;
  const Wd = Math.ceil((STROKE.L + 3.4) * SPU), Hd = Math.ceil(5.0 * SPU);
  SPR = mkCanvas(Wd, Hd); const x = SPR.getContext('2d');
  SPRB = mkCanvas(Math.ceil(Wd / 4), Math.ceil(Hd / 4)); const xb = SPRB.getContext('2d');
  const toS = (wx, wy) => [(wx - SPR_X0) * SPU, (wy - SPR_Y0) * SPU];
  const rs = mulberry32(8888);
  const NS = 1400;
  const C = [], N = [];
  for (let i = 0; i <= NS; i++) { const s = i / NS; C.push(strokeCenter(s)); }
  for (let i = 0; i <= NS; i++) { const a = C[Math.max(0, i - 1)], b = C[Math.min(NS, i + 1)]; let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty); N.push([-ty / l, tx / l]); }
  x.fillStyle = '#000'; x.strokeStyle = '#000';
  // head: 逆锋起笔 — heavy pressed head, angled
  const [hx, hy] = toS(STROKE.x0 + 0.05, STROKE.y0 + 0.02);
  x.save(); x.translate(hx, hy); x.rotate(-0.62);
  x.beginPath();
  for (let i = 0; i <= 160; i++) {
    const a = i / 160 * 6.283;
    const ca = Math.cos(a), sa = Math.sin(a);
    const e = 2.6, rx = 0.8 * SPU, ry = 0.62 * SPU;
    let r = 1 / Math.pow(Math.pow(Math.abs(ca / 1), e) + Math.pow(Math.abs(sa / 1), e), 1 / e);
    r *= 1 + 0.05 * (vnoise(a * 3 + 1.7) - 0.5) + 0.03 * (vnoise(a * 17) - 0.5);
    const px = ca * r * rx, py = sa * r * ry;
    if (i === 0) x.moveTo(px, py); else x.lineTo(px, py);
  }
  x.fill();
  x.restore();
  // spiky splash from the head (泼墨)
  for (let i = 0; i < 26; i++) {
    const a = rr(1.6, 4.9) + (rnd() < 0.3 ? rr(-1.4, 1.4) : 0);
    const L = rr(0.2, 0.75) * SPU * (rnd() < 0.15 ? 1.8 : 1);
    const r0 = 0.62 * SPU;
    const bx = hx + Math.cos(a) * r0 * 0.9, by = hy + Math.sin(a) * r0 * 0.8;
    const w0 = rr(8, 26);
    x.beginPath(); x.moveTo(bx - Math.sin(a) * w0, by + Math.cos(a) * w0);
    x.quadraticCurveTo(bx + Math.cos(a) * L * 0.6, by + Math.sin(a) * L * 0.6, bx + Math.cos(a) * L, by + Math.sin(a) * L);
    x.quadraticCurveTo(bx + Math.cos(a) * L * 0.6, by + Math.sin(a) * L * 0.6, bx + Math.sin(a) * w0, by - Math.cos(a) * w0);
    x.fill();
    if (rnd() < 0.7) { x.beginPath(); x.arc(bx + Math.cos(a) * (L + rr(10, 40)), by + Math.sin(a) * (L + rr(10, 40)), rr(3, 10), 0, 6.283); x.fill(); }
  }
  // mist spray
  for (let i = 0; i < 700; i++) { const a = rr(0, 6.283), d = Math.pow(rnd(), 0.6) * 1.7 * SPU + 0.55 * SPU; x.globalAlpha = rr(0.4, 1); x.beginPath(); x.arc(hx + Math.cos(a) * d * 1.1, hy + Math.sin(a) * d * 0.8, rr(0.6, 3.2), 0, 6.283); x.fill(); }
  x.globalAlpha = 1;
  // text strands: every hair of the dry brush is a line of poetry
  const NT = 22;
  const TS = [];
  for (let k = 0; k < NT; k++) {
    const o = ((k + 0.5) / NT * 2 - 1) * 0.92 + rr(-0.012, 0.012);
    const e = clamp(0.98 - 0.5 * Math.pow(Math.abs(o), 1.15) - rr(0, 0.12), 0.5, 1.0);
    TS.push({ o, e, s0: clamp(e - rr(0.25, 0.35), 0.3, 0.8), seed: rr(0, 999) });
  }
  // bristles
  const M = 320;
  const BR = [];
  for (let k = 0; k < M; k++) {
    const o = ((k + 0.5) / M * 2 - 1) + rr(-0.004, 0.004);
    const ao = Math.abs(o);
    let e = 0.98 - 0.42 * Math.pow(ao, 1.6) - Math.pow(rnd(), 2) * 0.32;
    e = clamp(e, 0.3, 1.0);
    let near = null, nd = 1e9;
    for (const t_ of TS) { const d = Math.abs(t_.o - o); if (d < nd) { nd = d; near = t_; } }
    BR.push({ o, e, seed: rr(0, 999), tail: rnd() < 0.5 ? rr(0.02, 0.18) : 0, near, nd });
  }
  x.lineCap = 'round'; x.lineJoin = 'round';
  for (const b of BR) {
    x.lineWidth = rr(2.4, 4.0);
    x.globalAlpha = rr(0.72, 1);
    x.beginPath(); let on = false;
    const iEnd = Math.min(NS, Math.round((b.e + b.tail) * NS));
    for (let i = 0; i <= iEnd; i++) {
      const s = i / NS, hw = strokeHalfW(s);
      const wob = 0.035 * (vnoise(s * 4 + b.seed) - 0.5) + 0.012 * (vnoise(s * 13 + b.seed) - 0.5);
      const spl = 1 + 0.28 * sstep(0.62, 1.0, s);
      const px = C[i][0] + N[i][0] * (b.o * hw * spl + wob), py = C[i][1] + N[i][1] * (b.o * hw * spl + wob);
      const [sx, sy] = toS(px, py);
      const dryness = sstep(b.e - 0.3, b.e, s) + (s > b.e ? 1 : 0);
      const v = vnoise(s * 55 + b.seed) * 0.65 + vnoise(s * 210 + b.seed * 2) * 0.35;
      let gap = v < dryness * 0.66 + (s > b.e ? 0.3 : 0) + 0.06 * sstep(0.12, 0.3, s);
      if (s > b.near.s0 && s > b.e - 0.3 && b.nd * hw * SPU < 6) gap = true; // leave room for the poem-hair
      const taper = s > b.e - 0.06 ? clamp((b.e + b.tail - s) / (0.06 + b.tail), 0.15, 1) : 1;
      if (taper < 1) {
        if (on) { x.stroke(); x.beginPath(); on = false; }
        if (!gap && b.px !== undefined) { const lw = x.lineWidth; x.lineWidth = lw * taper; x.beginPath(); x.moveTo(b.px, b.py); x.lineTo(sx, sy); x.stroke(); x.lineWidth = lw; }
        b.px = sx; b.py = sy; continue;
      }
      b.px = sx; b.py = sy;
      if (!gap) { if (!on) { x.moveTo(sx, sy); on = true; } else x.lineTo(sx, sy); } else on = false;
    }
    x.stroke();
  }
  x.globalAlpha = 1;
  // solid core of the wet body
  x.beginPath();
  const CE = 0.16;
  for (let i = 0; i <= NS * CE; i++) { const s = i / NS, hw = strokeHalfW(s) * (0.85 - 0.3 * sstep(0.08, CE, s)); const [sx, sy] = toS(C[i][0] + N[i][0] * hw, C[i][1] + N[i][1] * hw); i === 0 ? x.moveTo(sx, sy) : x.lineTo(sx, sy); }
  for (let i = Math.floor(NS * CE); i >= 0; i--) { const s = i / NS, hw = strokeHalfW(s) * (0.85 - 0.3 * sstep(0.08, CE, s)); const [sx, sy] = toS(C[i][0] - N[i][0] * hw, C[i][1] - N[i][1] * hw); x.lineTo(sx, sy); }
  x.fill();
  const lines = window.CORPUS;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  TS.forEach((ts, k) => {
    const fs = 12 + (k % 2);
    x.font = `${fs}px "Noto Serif CJK SC"`;
    let str = '';
    let li = (k * 7 + 3) % lines.length;
    while (str.length < 500) { str += lines[li] + '　'; li = (li + 11) % lines.length; }
    let s = ts.s0, ci = 0;
    const sEnd = Math.min(1.0, ts.e + 0.05);
    while (s < sEnd) {
      const i = Math.round(s * NS), hw = strokeHalfW(s);
      const wob = 0.035 * (vnoise(s * 4 + ts.seed) - 0.5) + 0.012 * (vnoise(s * 13 + ts.seed) - 0.5);
      const spl = 1 + 0.28 * sstep(0.62, 1.0, s);
      const px = C[i][0] + N[i][0] * (ts.o * hw * spl + wob), py = C[i][1] + N[i][1] * (ts.o * hw * spl + wob);
      const [sx, sy] = toS(px, py);
      const ang = Math.atan2(C[Math.min(NS, i + 1)][1] - C[Math.max(0, i - 1)][1], C[Math.min(NS, i + 1)][0] - C[Math.max(0, i - 1)][0]);
      const ch = str[ci++ % str.length];
      const dry = sstep(ts.e - 0.12, sEnd, s);
      const v = vnoise(s * 60 + ts.seed);
      const fin = sstep(ts.s0, ts.s0 + 0.06, s);
      if (ch !== '　' && v > dry * 0.7) {
        x.globalAlpha = clamp((0.92 - dry * 0.5) * fin, 0.0, 1);
        x.save(); x.translate(sx, sy); x.rotate(ang); x.fillText(ch, 0, 0); x.restore();
      }
      s += (fs * 1.04) / (STROKE.L * SPU);
    }
  });
  x.globalAlpha = 1;
  // halo sprite (wet areas)
  xb.setTransform(0.25, 0, 0, 0.25, 0, 0);
  xb.drawImage(SPR, 0, 0);
  xb.setTransform(1, 0, 0, 1, 0, 0);
  xb.globalCompositeOperation = 'destination-in';
  const g = xb.createLinearGradient(0, 0, SPRB.width, 0);
  const sx0 = (STROKE.x0 - SPR_X0) / (STROKE.L + 3.4);
  g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(sx0 + 0.02, 'rgba(0,0,0,1)'); g.addColorStop(sx0 + 0.45, 'rgba(0,0,0,0.25)'); g.addColorStop(0.85, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  xb.fillStyle = g; xb.fillRect(0, 0, SPRB.width, SPRB.height);
  xb.globalCompositeOperation = 'source-over';
  // splatter drops
  for (let i = 0; i < 48; i++) {
    const a = rr(1.5, 4.8) + (rnd() < 0.2 ? rr(-1.2, 1.2) : 0);
    const d = rr(0.9, 3.4) * (rnd() < 0.2 ? 1.5 : 1);
    DROPS.push({ kind: 'fling', t: T_PRESS + rr(0.0, 0.08), x0: STROKE.x0, y0: STROKE.y0, x: STROKE.x0 + Math.cos(a) * d, y: STROKE.y0 + Math.sin(a) * d * 0.8, fly: rr(0.06, 0.3), arc: rr(0, 0.3), r: rr(0.012, 0.07) * (rnd() < 0.12 ? 2 : 1), a: rr(0.8, 1), wet: rr(0.4, 1), seed: rr(0, 99), tail: rnd() < 0.5 });
  }
  const [ex, ey] = strokeCenter(0.98);
  for (let i = 0; i < 14; i++) {
    const a = rr(-0.5, 0.25), d = rr(0.3, 1.8);
    DROPS.push({ kind: 'fling', t: T_SWEEP1 + rr(0.05, 0.2), x0: ex, y0: ey, x: ex + Math.cos(a) * d, y: ey + Math.sin(a) * d, fly: rr(0.08, 0.25), arc: rr(0, 0.15), r: rr(0.006, 0.03), a: rr(0.7, 1), wet: 0.3, seed: rr(0, 99), tail: rnd() < 0.7 });
  }
}
function strokeS(t) {
  if (t < T_PRESS) return -1;
  if (t < T_SWEEP0) return 0.035 * sstep(T_PRESS, T_SWEEP0, t);
  if (t < T_SWEEP1) { const u = (t - T_SWEEP0) / (T_SWEEP1 - T_SWEEP0); return 0.035 + (0.93 - 0.035) * (0.25 * u + 0.75 * easeIO(u)); }
  if (t < T_END1) return 0.93 + 0.07 * Math.sin(Math.PI / 2 * (t - T_SWEEP1) / (T_END1 - T_SWEEP1));
  return 1.0;
}
function drawStroke(t) {
  const sb = strokeS(t);
  if (sb < 0) return;
  const [bx] = strokeCenter(sb);
  const cut = (bx - SPR_X0 + 0.02 + (sb >= 1 ? 3 : 0)) * SPU;
  const headR = (0.3 + 1.0 * sstep(T_PRESS, T_PRESS + 0.18, t)) * SPU;
  const [hx, hy] = [(STROKE.x0 - SPR_X0) * SPU, (STROKE.y0 - SPR_Y0) * SPU];
  for (const [ctx, sc, img, f] of [[cA, 1, SPR, 1], [cB, 0.5, SPRB, 4]]) {
    setCam(ctx, sc);
    ctx.save();
    ctx.translate(SPR_X0, SPR_Y0); ctx.scale(1 / SPU, 1 / SPU);
    const hwp = strokeHalfW(Math.max(0, sb)) * SPU * 1.05, [, byw] = strokeCenter(Math.max(0, sb)), byp = (byw - SPR_Y0) * SPU;
    ctx.beginPath(); ctx.rect(0, 0, Math.max(0, cut - (sb >= 1 ? 0 : hwp * 0.9)), img.height * f);
    if (sb < 1 && sb > 0.03) { ctx.moveTo(cut - hwp * 0.9 + hwp, byp); ctx.ellipse(cut - hwp * 0.9, byp, hwp, hwp * 1.1, 0, 0, 6.283); }
    ctx.moveTo(hx + headR * 1.4, hy); ctx.arc(hx, hy, headR * 1.4, 0, 6.283);
    ctx.clip();
    ctx.globalAlpha = sc === 1 ? 1 : 0.95;
    ctx.drawImage(img, 0, 0, img.width * f, img.height * f);
    ctx.restore();
  }
}

// ═══════════ camera script ═══════════
const HK = [ // [t, h]
  [0, 0.3], [2.45, 0.33], [3.1, 0.5], [4.1, 1.5], [8.2, 1.72], [9.7, 5.2], [11.6, 12.2], [14.0, 12.4], [15.6, 8.0], [18.0, 7.6], [19.4, 6.2], [20.4, 6.4], [21.8, 12.2],
  [24.6, 12.0], [25.8, 8.8], [27.4, 9.0], [28.8, 12.2], [31.6, 11.8], [32.8, 8.0], [34.6, 8.2], [35.8, 10.0], [38.6, 9.2], [39.3, 9.4], [42.4, 16.2], [44.2, 15.0], [45.8, 14.3], [47.6, 13.0], [49.3, 10.3],
  [51.4, 10.3], [53.6, 2.55], [54.5, 2.5], [56.4, 10.6], [60.5, 10.9]
];
const XK = [ // [t, x, y, followWeight]
  [0, null, null, 0], [3.4, null, null, 0], [4.1, 0, 0.52, 0], [8.2, 0.0, 0.62, 0], [9.6, -0.6, 2.8, 0.5], [11.0, null, null, 1], [38.9, null, null, 1], [39.4, -24.0, 5.6, 0.2],
  [42.4, -12.2, 5.8, 0], [44.0, -24, 5.9, 0], [45.8, -41.5, 6.0, 0], [47.6, -41.0, 6.0, 0], [49.3, -37.0, 5.95, 0],
  [51.4, -37.0, 5.95, 0], [53.6, -32.9, 5.6, 0], [54.5, -32.55, 5.55, 0], [56.4, -38.0, 7.6, 0], [60.5, -38.0, 7.7, 0]
];
function interpK(K, t, idx) {
  if (t <= K[0][0]) return K[0][idx];
  for (let i = 0; i < K.length - 1; i++) {
    if (t <= K[i + 1][0]) {
      const u = easeIO((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
      return lerp(K[i][idx], K[i + 1][idx], u);
    }
  }
  return K[K.length - 1][idx];
}
const focus = { x: 0, y: 0.5 };
function writingFocus(t) {
  let sx = 0, sy = 0, n = 0;
  for (const v of INST) {
    if (v.tint || v.sec === 4 || v.size < 0.5) continue;
    if (t >= v.t0 - 0.2 && t <= v.tEnd + 0.4) { const w = v.size; sx += v.x * w; sy += v.y * w; n += w; }
  }
  if (n > 0) { focus.x = sx / n; focus.y = sy / n; }
  return focus;
}
function camTarget(t) {
  const h = Math.exp(interpK(HK.map(k => [k[0], Math.log(k[1])]), t, 1));
  let kx, ky;
  const fw = interpK(XK, t, 3);
  const K = XK.map(k => [k[0], k[1] ?? (k[0] < 5 ? DOT[0] : 0), k[2] ?? (k[0] < 5 ? DOT[1] : 0)]);
  kx = interpK(K, t, 1); ky = interpK(K, t, 2);
  if (t < 4.1) { const u = easeIO((t - 3.3) / 0.8); kx = lerp(DOT[0], 0, clamp(u, 0, 1)); ky = lerp(DOT[1], 0.52, clamp(u, 0, 1)); }
  const f = writingFocus(t);
  const yw = clamp((12.4 - h) / 6, 0.0, 0.7);
  const fx = f.x + 0.6, fy = lerp(5.7, f.y, yw);
  return { x: lerp(kx, fx, fw), y: lerp(ky, fy, fw), h };
}
let camInit = false;
function updateCam(t) {
  const tg = camTarget(t);
  cam.h = tg.h;
  if (!camInit) { cam.x = tg.x; cam.y = tg.y; camInit = true; }
  const om = (t > 39 || t < 9) ? 5.5 : 2.4;
  const ax = om * om * (tg.x - cam.x) - 2 * om * cam.vx, ay = om * om * (tg.y - cam.y) - 2 * om * cam.vy;
  cam.vx += ax * DT; cam.vy += ay * DT; cam.x += cam.vx * DT; cam.y += cam.vy * DT;
  // breath of a hand-held camera
  cam.rot = 0.006 * Math.sin(t * 0.21 + 1) + 0.004 * Math.sin(t * 0.47) + (t > 42 && t < 49.5 ? 0.05 * Math.sin((t - 42) * 0.21) * sstep(42, 44, t) * (1 - sstep(48, 49.5, t)) : 0);
  const shake = Math.exp(-Math.max(0, t - T_PRESS) * 9) * (t >= T_PRESS ? 1 : 0) * 0.05 + Math.exp(-Math.max(0, t - T_DROP) * 12) * (t >= T_DROP ? 1 : 0) * 0.004;
  cam.sx = shake * Math.sin(t * 91) * cam.h / 10; cam.sy = shake * Math.cos(t * 77) * cam.h / 10;
  cam.sx += 0.01 * cam.h * (vnoise(t * 0.4) - 0.5); cam.sy += 0.01 * cam.h * (vnoise(t * 0.33 + 9) - 0.5);
}

// ═══════════ WebGL compositor ═══════════
const gl = document.getElementById('gl').getContext('webgl2', { preserveDrawingBuffer: true, antialias: false, alpha: false });
const VS = `#version 300 es
in vec2 p; out vec2 vUv; void main(){ vUv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;
const FS = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 oc;
uniform sampler2D tA,tB,tC,tD,tP,tS,tL;
uniform vec2 res; uniform vec3 cam; uniform float rot, frame, expo, haloLod, detail, dOn, vign, lightAmt, sat;
uniform vec3 lift, gain;
uniform vec4 seams; uniform vec4 paper;
uniform vec3 tint0, tint1, tint2, tint3, tint4;
uniform vec2 lightP;
float absn0(vec4 P, vec4 P2, float detail){ return mix(P.a, P2.a, 0.35+0.4*detail); }
float h12(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 px = vec2(vUv.x*res.x, (1.0-vUv.y)*res.y);
  float s = res.y/cam.z;
  vec2 d = (px-0.5*res)/s;
  float cr = cos(rot), sr = sin(rot);
  vec2 wp = cam.xy + vec2(cr*d.x + sr*d.y, -sr*d.x + cr*d.y);
  // ── paper ──
  vec4 P = texture(tP, wp*0.25);
  vec4 P2 = texture(tP, wp*1.9 + vec2(0.37,0.11));
  vec4 PL = texture(tL, wp*0.25);
  float fib = (P.g-0.5) + (P2.g-0.5)*(0.3+0.7*detail);
  float mott = P.r-0.5;
  float x = wp.x;
  vec3 tint = tint0;
  tint = mix(tint, tint1, smoothstep(seams.x+0.01, seams.x-0.01, x));
  tint = mix(tint, tint2, smoothstep(seams.y+0.01, seams.y-0.01, x));
  tint = mix(tint, tint3, smoothstep(seams.z+0.01, seams.z-0.01, x));
  tint = mix(tint, tint4, smoothstep(seams.w+0.01, seams.w-0.01, x));
  vec3 base = vec3(0.93,0.895,0.82)*tint;
  vec3 pc = base*(1.0+mott*0.07+(PL.g-0.5)*0.08) + fib*0.11*vec3(1.0,0.97,0.92) + (P2.b-0.5)*0.018;
  pc *= 1.0 + (PL.r-0.5)*0.05;
  float sl = 0.0;
  for(int i=0;i<4;i++){ float sx = seams[i]; sl += exp(-pow((x-sx)/0.01,2.0))*0.9 + smoothstep(sx+0.0, sx-0.09, x)*smoothstep(sx-0.2, sx-0.09, x)*0.25; }
  pc *= 1.0 - sl*0.1;
  // ── mounting silk & table ──
  float yT = paper.x, yB = paper.y, xL = paper.z, xR = paper.w;
  float dPaper = max(max(yT - wp.y, wp.y - yB), max(xL - wp.x, wp.x - xR));
  vec3 col = pc;
  if (dPaper > -0.01) {
    float silkW = 1.15;
    float dSilk = dPaper - silkW;
    float wv = texture(tS, wp*vec2(0.8,11.0)).r*0.5 + texture(tS, wp.yx*vec2(0.8,11.0)).r*0.5;
    vec3 silk = vec3(0.60,0.635,0.62)*(0.9 + 0.2*wv);
    silk *= 1.0 - 0.3*exp(-max(dPaper,0.0)/0.03);
    vec3 table = vec3(0.05,0.042,0.036)*(0.75+0.5*wv);
    table *= 1.0 - 0.6*exp(-max(dSilk,0.0)/0.25);
    vec3 outer = mix(table, silk, smoothstep(0.004,-0.004,dSilk));
    col = mix(outer, pc, smoothstep(0.004,-0.004,dPaper));
  }
  // ── ink ──
  float absn = mix(P.a, P2.a, 0.35+0.4*detail);
  float a0 = texture(tA, vUv).a;
  float aS = textureLod(tA, vUv, 0.8+detail*1.2).a;
  float fz = absn-0.5;
  float ew = 0.16;
  float aE = smoothstep(0.5-ew, 0.5+ew, aS + fz*(0.5+0.4*detail)) * max(aS, a0);
  float a = mix(a0, max(a0*0.85, aE), smoothstep(0.02,0.25,aS)*(1.0-smoothstep(0.9,1.0,a0))*0.85);
  float edge = clamp(a - aS, 0.0, 1.0);
  float hb = textureLod(tB, vUv, haloLod).a;
  float hb2 = textureLod(tB, vUv, haloLod+1.3).a;
  hb = max(hb, hb2*0.8);
  float hv = hb + (absn-0.5)*0.26;
  float bl = smoothstep(0.07, 0.26, hv);
  float tide = (smoothstep(0.045, 0.075, hv) - bl*0.9)*step(0.001,hb);
  float od = a*2.75*(1.0 + 0.45*edge);
  od *= 0.93 + 0.14*(mott+0.5)*(1.0-0.5*a) ;
  od *= mix(1.0, 0.72 + 0.56*(fib+0.5), (1.0-a)*0.8);
  float fibr = 0.55 + 0.9*(P2.g*0.5+P.g*0.5);
  od += (bl*0.55*sqrt(hb)*fibr + max(tide,0.0)*0.16)*(1.0-a);
  col *= exp(-od*vec3(1.03,1.0,0.92));
  // ── vermilion ──
  vec4 cc = texture(tC, vUv);
  float paste = 0.8 + 0.4*(P2.g+P.b-0.5);
  col = mix(col, col*cc.rgb*1.18, clamp(cc.a*paste,0.0,1.0));
  // ── light ──
  vec2 q = vUv-0.5; q.x *= res.x/res.y;
  vec2 lq = vUv-lightP; lq.x *= res.x/res.y;
  float lg = exp(-dot(lq,lq)*1.6);
  col *= mix(1.0, 0.72+0.42*lg, lightAmt);
  col *= 1.0 - vign*dot(q,q);
  col = lift + col*gain;
  float lum = dot(col, vec3(0.299,0.587,0.114));
  col = mix(vec3(lum), col, sat);
  col *= expo;
  col += (h12(px*0.7 + fract(frame*0.1317)*113.0)-0.5)*0.012;
  if (dOn > 0.0) { vec4 dd = texture(tD, vUv); col = mix(col, dd.rgb, dd.a*dOn); }
  oc = vec4(clamp(col,0.0,1.0),1.0);
}`;
function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);
const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
const U = n => gl.getUniformLocation(prog, n);
const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
function mkTex(unit, repeat, mip) {
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (aniso && repeat) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  return t;
}
const TEX = { A: mkTex(0, false, true), B: mkTex(1, false, true), C: mkTex(2, false, false), D: mkTex(3, false, false), P: mkTex(4, true, true), S: mkTex(5, true, true), L: mkTex(6, true, true) };
['tA', 'tB', 'tC', 'tD', 'tP', 'tS', 'tL'].forEach((n, i) => gl.uniform1i(U(n), i));
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
function upload(unit, tex, src, mip) {
  gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  if (mip) gl.generateMipmap(gl.TEXTURE_2D);
}
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }

// ═══════════ grading per moment ═══════════
function grade(t) {
  // expo, vign, lightAmt, sat, lift, gain, lightP
  let expo = 1.06, vign = 0.36, la = 0.45, sat = 0.92;
  let gain = [1.0, 0.99, 0.96], lift = [0.012, 0.011, 0.012];
  expo *= sstep(0.1, 2.2, t) * 0.85 + 0.15 * sstep(0.0, 0.6, t);
  // grief: 祭姪 — darker & warmer
  const ji = sstep(20.0, 22.0, t) * (1 - sstep(27.5, 29, t));
  const han = sstep(28.4, 30, t) * (1 - sstep(35.2, 36.8, t));
  const sw = sstep(41.5, 44, t) * (1 - sstep(49.6, 50.2, t));
  expo *= 1 - 0.1 * ji - 0.12 * han - 0.12 * sw;
  vign += 0.18 * ji + 0.12 * han + 0.35 * sw;
  gain = [gain[0] + 0.03 * ji - 0.04 * han, gain[1] - 0.01 * ji - 0.01 * han, gain[2] - 0.05 * ji + 0.04 * han];
  sat -= 0.25 * han;
  // the stroke: bright, clean
  const fin = sstep(50.0, 51.5, t);
  expo *= 1 + 0.06 * fin;
  // flash of the press
  expo *= 1 + 0.12 * Math.exp(-Math.max(0, t - T_PRESS) * 6) * (t >= T_PRESS ? 1 : 0);
  // end fade
  expo *= 1 - sstep(58.3, 59.2, t);
  const lightP = [0.62 + 0.1 * Math.sin(t * 0.07), 0.62 + 0.05 * Math.cos(t * 0.05)];
  if (t < 3) { lightP[0] = lerp(0.8, 0.55, sstep(0, 3, t)); lightP[1] = lerp(0.8, 0.6, sstep(0, 3, t)); la = 0.9 - 0.35 * sstep(0, 4, t); }
  return { expo, vign, la, sat, gain, lift, lightP };
}

// ═══════════ end title ═══════════
let endDrawn = false;
function drawEnd(t) {
  if (t < 59.0) return 0;
  if (!endDrawn) {
    cD.clearRect(0, 0, W, H); cD.fillStyle = '#000'; cD.fillRect(0, 0, W, H);
    cD.textAlign = 'center'; cD.textBaseline = 'middle';
    cD.fillStyle = 'rgb(214,206,190)'; cD.font = '300 64px "Noto Serif CJK TC"';
    cD.fillText('一　畫', W / 2, H / 2 - 40);
    cD.fillStyle = 'rgb(140,134,124)'; cD.font = '300 26px "Noto Serif CJK SC"';
    cD.fillText('Claude Opus 5.5　以代码书写　·　丙午年秋', W / 2, H / 2 + 34);
    endDrawn = true;
  }
  return sstep(59.0, 59.35, t) * (1 - sstep(60.1, 60.5, t) * 0) ;
}

// ═══════════ frame ═══════════
let lastFrame = -1;
let spawned = new Set();
function renderFrame(fi) {
  const t = fi / FPS;
  if (fi !== lastFrame + 1) console.warn('non-sequential frame', fi);
  lastFrame = fi;
  updateCam(t);
  // spawn dissolving particles
  for (const v of INST) {
    if (v.dissolveT < 1e8 && t >= v.dissolveT && !spawned.has(v) && !v.tint) { spawned.add(v); spawnParticles(v); }
  }
  updateParticles(t);
  // clear layers
  for (const [c, cv] of [[cA, cvA], [cB, cvB], [cC, cvC]]) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.clearRect(0, 0, cv.width, cv.height); }
  const vr = viewRect(1.2);
  const _t0 = performance.now();
  drawDrop(t);
  for (const v of INST) drawInst(v, t, vr);
  const _t1 = performance.now();
  drawThreads(t);
  drawScribbles(t);
  drawDrops(t);
  drawAsh(t);
  drawParticles(t);
  drawGalaxy(t);
  drawCore(t);
  drawStroke(t);
  drawSeals(t);
  const dOn = drawEnd(t);
  const _t2 = performance.now();
  // upload & composite
  const _g = [];
  const _px = new Uint8Array(4); const fin = () => { if (window.DEBUGGL) { gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, _px); _g.push(performance.now()); } };
  fin();
  upload(0, TEX.A, cvA, false); fin();
  gl.generateMipmap(gl.TEXTURE_2D); fin();
  upload(1, TEX.B, cvB, true); fin();
  upload(2, TEX.C, cvC, false); fin();
  if (dOn > 0) upload(3, TEX.D, cvD, false);
  const G = grade(t);
  const ppu = H / cam.h;
  const haloLod = clamp(Math.log2(Math.max(1, 0.045 * ppu / 2)), 0, 5.5);
  gl.viewport(0, 0, W, H);
  gl.uniform2f(U('res'), W, H);
  gl.uniform3f(U('cam'), cam.x + cam.sx, cam.y + cam.sy, cam.h);
  gl.uniform1f(U('rot'), cam.rot);
  gl.uniform1f(U('frame'), fi);
  gl.uniform1f(U('expo'), G.expo);
  gl.uniform1f(U('haloLod'), haloLod);
  gl.uniform1f(U('detail'), clamp((2.2 - cam.h) / 1.6, 0, 1));
  gl.uniform1f(U('dOn'), dOn);
  gl.uniform1f(U('vign'), G.vign);
  gl.uniform1f(U('lightAmt'), G.la);
  gl.uniform1f(U('sat'), G.sat);
  gl.uniform3f(U('lift'), ...G.lift);
  gl.uniform3f(U('gain'), ...G.gain);
  gl.uniform2f(U('lightP'), ...G.lightP);
  gl.uniform4f(U('seams'), ...SEAMS);
  gl.uniform4f(U('paper'), PAPER.top, PAPER.bot, PAPER.left, PAPER.right);
  gl.uniform3f(U('tint0'), 1.0, 0.985, 0.955);
  gl.uniform3f(U('tint1'), 0.935, 0.875, 0.765);
  gl.uniform3f(U('tint2'), 0.955, 0.94, 0.905);
  gl.uniform3f(U('tint3'), 0.99, 0.965, 0.92);
  gl.uniform3f(U('tint4'), 1.01, 1.0, 0.975);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); fin();
  if (window.DEBUGGL) window.GLP = _g.slice(1).map((v, i) => (v - _g[i]).toFixed(0)).join(' ');
  const _t3 = performance.now();
  window.PROF = [_t1 - _t0, _t2 - _t1, _t3 - _t2];
}

// ═══════════ boot ═══════════
window.renderFrame = renderFrame;
window.stepOnly = function (fi) { const t = fi / FPS; updateCam(t); for (const v of INST) { if (v.dissolveT < 1e8 && t >= v.dissolveT && !spawned.has(v) && !v.tint) { spawned.add(v); spawnParticles(v); } } updateParticles(t); lastFrame = fi; };
window.EVENTS = EVENTS;
window.NFRAMES = Math.round(DUR * FPS);
(async () => {
  const fams = ['Zhi Mang Xing', 'Liu Jian Mao Cao', 'Ma Shan Zheng', 'Long Cang', 'Noto Serif CJK SC', 'Noto Serif CJK TC'];
  const corpusChars = [...new Set(window.CORPUS.join(''))].join('');
  await Promise.all(fams.map(f => document.fonts.load(`64px "${f}"`, corpusChars)));
  await document.fonts.load('900 64px "Noto Serif CJK TC"', '無盡藏神龍紹興一畫');
  await document.fonts.load('700 64px "Noto Serif CJK TC"', '神龍紹興');
  await document.fonts.load('300 46px "Noto Serif CJK TC"', '一畫');
  const [pi, si, li] = await Promise.all([loadImg('tex/paper.png'), loadImg('tex/streak.png'), loadImg('tex/paperL.png')]);
  upload(4, TEX.P, pi, true); upload(5, TEX.S, si, true); upload(6, TEX.L, li, true);
  initDrop();
  await build();
  buildStroke();
  initGalaxy();
  window.ready = true;
  if (location.hash === '#play') {
    let f = 0; const t0 = performance.now();
    const loop = () => { const target = Math.floor((performance.now() - t0) / 1000 * FPS); while (f <= target && f < window.NFRAMES) renderFrame(f++); if (f < window.NFRAMES) requestAnimationFrame(loop); };
    loop();
  }
})().catch(e => { window.bootError = String(e && e.stack || e); console.error(e); });
