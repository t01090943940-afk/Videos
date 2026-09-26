// 20–38s · The AI big bang: the mountain dissolves into tokens, the tools arrive,
// code stops being scarce — then a rewind back to the one thing that still is.
import {
  W, H, C, F, clamp, lerp, prog, ease, hash, hs, text, typeText, revealText, measure, fillBg, images, roundRect, zoomAt,
} from './core.js';
import { SLAMS, GRID_LOGOS, CODE_LINES } from './data.js';
import { drawAct1, pyramidEdges } from './act1.js';

let raw = null;
export function setRaw(fn) { raw = fn; }
export function clearThumbs() { thumbCache.clear(); }

const GLYPHS = '{}[]()<>=+*/;:01AIλ∑→#$%&@?!ab∫∂πΩ令牌想法做出来';
let particles = null;
function getParticles() {
  if (particles) return particles;
  particles = [];
  const edges = pyramidEdges(18.9);
  let cx = 0, cy = 0, n = 0;
  edges.forEach(([a, b]) => { cx += a[0] + b[0]; cy += a[1] + b[1]; n += 2; });
  cx /= n; cy /= n;
  let id = 0;
  edges.forEach(([a, b]) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.floor(L / 30));
    for (let i = 0; i < k; i++) {
      if (hash(id, 99) > 0.55) { id++; continue; }
      const u = (i + 0.5) / k;
      const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u);
      const ang = Math.atan2(y - cy, x - cx) + hs(id, 1) * 0.7;
      const sp = 300 + hash(id, 2) * 900;
      particles.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, ch: GLYPHS[Math.floor(hash(id, 3) * GLYPHS.length)], c: hash(id, 4), size: 18 + hash(id, 5) * 26, id });
      id++;
    }
  });
  return particles;
}

function darkBg(ctx, t, tint = null, glow = 0) {
  fillBg(ctx, '#050607');
  if (tint && glow > 0) {
    const g = ctx.createRadialGradient(W / 2, H / 2 - 40, 10, W / 2, H / 2 - 40, 900);
    g.addColorStop(0, tint + Math.round(glow * 90).toString(16).padStart(2, '0'));
    g.addColorStop(1, tint + '00');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = 'rgba(244,239,227,0.07)';
  for (let x = 30; x < W; x += 60) for (let y = 30; y < H; y += 60) ctx.fillRect(x - 1, y - 1, 2, 2);
}
function hud(ctx, left, right, alpha = 1) {
  text(ctx, left, 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, alpha });
  text(ctx, right, W - 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, align: 'right', alpha });
  ctx.save();
  ctx.globalAlpha = 0.35 * alpha; ctx.strokeStyle = C.cream; ctx.lineWidth = 1;
  for (const [x, y, dx, dy] of [[60, 60, 1, 1], [W - 60, 60, -1, 1], [60, H - 60, 1, -1], [W - 60, H - 60, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(x, y + dy * 30); ctx.lineTo(x, y); ctx.lineTo(x + dx * 30, y); ctx.stroke();
  }
  ctx.restore();
}
function drawLogo(ctx, key, x, y, size, alpha = 1) {
  const im = images['logo_' + key];
  if (!im) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.drawImage(im, x - size / 2, y - size / 2, size, size);
  ctx.restore();
}
function codeRain(ctx, t, alpha) {
  ctx.save();
  for (let col = 0; col < 7; col++) {
    const x = 60 + col * 280;
    const speed = 40 + hash(col, 1) * 60;
    for (let r = 0; r < 26; r++) {
      const y = ((r * 46 + t * speed + hash(col, 2) * 900) % (H + 100)) - 50;
      const line = CODE_LINES[Math.floor(hash(col, r) * CODE_LINES.length)];
      text(ctx, line.slice(0, 22), x, y, { family: F.mono, size: 17, color: hash(col, r, 3) > 0.9 ? C.teal : C.cream, alpha: alpha * (0.05 + hash(col, r, 4) * 0.08) });
    }
  }
  ctx.restore();
}

// ---------- film strip for the rewind (拉片) ----------
const THUMB_T = [5.95, 7.6, 10.5, 13.7, 15.8, 17.9, 22.2, 22.7, 23.2, 24.7, 26.9, 29.6, 32.4, 33.6];
const thumbCache = new Map();
function thumb(tt) {
  if (thumbCache.has(tt)) return thumbCache.get(tt);
  const c = document.createElement('canvas');
  c.width = 480; c.height = 270;
  const g = c.getContext('2d');
  raw && raw(g, tt, 0.25);
  thumbCache.set(tt, c);
  return c;
}
function filmStrip(ctx, t, offset, y, fw = 480, fh = 270, alpha = 1) {
  const gap = 36, pitch = fw + gap;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#121212';
  ctx.fillRect(-20, y - fh / 2 - 60, W + 40, fh + 120);
  ctx.fillStyle = '#050505';
  for (let x = ((offset % 60) + 60) % 60 - 60; x < W + 60; x += 60) {
    ctx.fillRect(x, y - fh / 2 - 44, 30, 22);
    ctx.fillRect(x, y + fh / 2 + 22, 30, 22);
  }
  THUMB_T.forEach((tt, i) => {
    const x = offset + i * pitch;
    if (x < -fw || x > W + fw) return;
    ctx.drawImage(thumb(tt), x - fw / 2, y - fh / 2, fw, fh);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2;
    ctx.strokeRect(x - fw / 2, y - fh / 2, fw, fh);
    const f = Math.round(tt * 60);
    text(ctx, `${String(i + 1).padStart(2, '0')}  ·  F${String(f).padStart(4, '0')}`, x - fw / 2, y + fh / 2 + 16, { family: F.mono, size: 14, color: '#E8A04B', alpha: 0.85 });
  });
  ctx.restore();
  return pitch;
}
const tc = (s) => {
  const f = Math.floor((s % 1) * 60), ss = Math.floor(s) % 60, m = Math.floor(s / 60);
  return `00:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

export function drawAct2(ctx, t, P) {
  P.grain = 0.045; P.vig = 0.55; P.bloom = 0.5; P.scan = 0.25;

  // ===== 20–22 · the drop: invert-flash of the sketch, then it bursts into tokens =====
  if (t < 22) {
    if (t < 20.14) {
      drawAct1(ctx, 18.9, {});
      P.invert = 1; P.ca = 0.012; P.zoomBlur = 0.08; P.bloom = 1.2; P.scan = 0;
      return;
    }
    darkBg(ctx, t, '#E8633A', 0.4 * (1 - prog(t, 20.1, 21.5)));
    const lp = ease.outExpo(prog(t, 20.1, 21.4));
    const cp = ease.inOutExpo(prog(t, 21.15, 21.95));
    const ps = getParticles();
    ctx.save();
    ps.forEach((p, i) => {
      const ex = p.x + p.vx * lp * 0.75, ey = p.y + p.vy * lp * 0.75 + lp * lp * 40;
      const ang = (i / ps.length) * Math.PI * 2 + t * 3;
      const rr = 340 * (1 - cp) + 20;
      const x = lerp(ex, W / 2 + Math.cos(ang) * rr, cp), y = lerp(ey, H / 2 - 60 + Math.sin(ang) * rr, cp);
      const col = p.c > 0.8 ? C.coral : p.c > 0.6 ? C.teal : C.cream;
      const ch = hash(p.id, Math.floor(t * 20)) > 0.7 ? GLYPHS[Math.floor(hash(p.id, Math.floor(t * 20), 1) * GLYPHS.length)] : p.ch;
      text(ctx, ch, x, y, { family: F.mono, size: p.size * (1 - cp * 0.5), color: col, align: 'center', alpha: 0.9 });
    });
    ctx.restore();
    const tp = prog(t, 20.25, 21.9);
    if (tp > 0) {
      const a = 1 - prog(t, 21.6, 21.9);
      revealText(ctx, '然后，AI 来了。', W / 2, H / 2 + 50, { family: F.serif, size: 150, weight: 900, color: C.cream, align: 'center', alpha: a }, prog(t, 20.25, 20.9), { stagger: 0.05, rise: 60 });
      text(ctx, 'NOVEMBER 30, 2022  ·  THE WORLD CHANGED ITS DEFAULTS', W / 2, H / 2 + 150, { family: F.mono, size: 22, color: C.creamDim, align: 'center', ls: 4, alpha: a * prog(t, 20.8, 21.1) });
    }
    P.glitch = Math.max(0, 0.6 - (t - 20.14) * 1.2) + (t > 21.85 ? 0.8 : 0);
    P.ca = 0.004 + P.glitch * 0.01;
    P.flash = t > 21.92 ? 0.9 : 0;
    return;
  }

  // ===== 22–26 · logo roll call, one per beat =====
  if (t < 26) {
    const idx = Math.floor((t - 22) / 0.5), lt = (t - 22) - idx * 0.5;
    const s = SLAMS[idx];
    darkBg(ctx, t, s.tint, 0.55);
    // radiating hairlines, mirrored — a kaleidoscope that turns every beat
    ctx.save();
    ctx.translate(W / 2, H / 2 - 60);
    ctx.rotate(idx * 0.26 + lt * 0.3);
    ctx.strokeStyle = s.tint; ctx.globalAlpha = 0.14;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 260, Math.sin(a) * 260); ctx.lineTo(Math.cos(a) * 1400, Math.sin(a) * 1400); ctx.stroke();
    }
    ctx.restore();
    const e = ease.outExpo(clamp(lt / 0.3));
    const sc = 1 + 0.55 * (1 - e);
    ctx.save();
    zoomAt(ctx, sc, W / 2, H / 2 - 60);
    const colorKey = images['logo_' + s.slug + '-color'] && idx % 2 === 1 ? s.slug + '-color' : s.slug;
    drawLogo(ctx, colorKey, W / 2, H / 2 - 70, 300);
    ctx.restore();
    text(ctx, s.name, W / 2, H / 2 + 230, { family: F.grotesk, size: 88, weight: 700, color: C.cream, align: 'center', ls: 2 + (1 - e) * 30, alpha: e });
    hud(ctx, `MODEL ${String(idx + 1).padStart(2, '0')} / 08`, '2022 → 2026');
    // progress ticks
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i <= idx ? C.coral : 'rgba(244,239,227,0.2)';
      ctx.fillRect(W / 2 - 8 * 44 / 2 + i * 44, H - 90, 32, 4);
    }
    P.zoomBlur = 0.14 * (1 - clamp(lt / 0.16));
    P.ca = 0.003 + 0.012 * (1 - clamp(lt / 0.12));
    P.flash = lt < 0.035 ? 0.35 : 0;
    return;
  }

  // ===== 26–28 · the new stack fills the grid, then we dive into it =====
  if (t < 28) {
    darkBg(ctx, t, '#78D7BD', 0.2);
    const cols = 8, rows = 4, cw = 196, ch = 196;
    const gx = W / 2 - (cols * cw) / 2, gy = H / 2 - (rows * ch) / 2 + 20;
    const dive = ease.inExpo(prog(t, 27.25, 28));
    ctx.save();
    zoomAt(ctx, 1 + dive * 14, W / 2, H / 2 + 20);
    ctx.strokeStyle = 'rgba(244,239,227,0.12)'; ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(gx + i * cw, gy); ctx.lineTo(gx + i * cw, gy + rows * ch * prog(t, 26, 26.4)); ctx.stroke(); }
    for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(gx, gy + j * ch); ctx.lineTo(gx + cols * cw * prog(t, 26, 26.4), gy + j * ch); ctx.stroke(); }
    // fill order spirals from the middle outward
    const order = GRID_LOGOS.map((_, i) => i).sort((a, b) => {
      const da = Math.hypot((a % cols) - 3.5, Math.floor(a / cols) - 1.5), db = Math.hypot((b % cols) - 3.5, Math.floor(b / cols) - 1.5);
      return da - db;
    });
    order.forEach((gi, k) => {
      const t0 = 26.0 + k * 0.036;
      const p = ease.outBack(prog(t, t0, t0 + 0.22));
      if (p <= 0) return;
      const x = gx + (gi % cols) * cw + cw / 2, y = gy + Math.floor(gi / cols) * ch + ch / 2;
      const lit = k === 0 ? 1 : 0.85;
      drawLogo(ctx, GRID_LOGOS[gi], x, y, 88 * p, lit);
      text(ctx, GRID_LOGOS[gi].toUpperCase(), x - cw / 2 + 12, y + ch / 2 - 12, { family: F.mono, size: 12, color: C.creamDim, alpha: 0.6 * clamp(p) });
    });
    ctx.restore();
    const a = 1 - dive * 3;
    hud(ctx, 'THE NEW STACK  ·  2022 → 2026', `${Math.min(32, Math.floor(prog(t, 26, 27.2) * 32))} / 32`, clamp(a));
    text(ctx, '工具，一夜之间长满了整个世界。', W / 2, H - 70, { family: F.serif, size: 40, weight: 700, color: C.cream, align: 'center', alpha: clamp(a) * prog(t, 26.3, 26.6) });
    P.zoomBlur = dive * 0.5;
    P.flash = prog(t, 27.82, 28) * 0.95;
    return;
  }

  // ===== 28–31 · 95% =====
  if (t < 31) {
    darkBg(ctx, t);
    codeRain(ctx, t, 1);
    const ip = ease.outExpo(prog(t, 28, 28.5));
    const n = Math.round(95 * ease.outExpo(prog(t, 28.05, 29.3)));
    const exit = ease.inExpo(prog(t, 30.7, 31));
    ctx.save();
    ctx.translate(0, -exit * 200);
    ctx.globalAlpha = 1 - exit;
    zoomAt(ctx, 1.25 - ip * 0.25 + (t - 28) * 0.02, W / 2, H / 2);
    text(ctx, 'Y COMBINATOR  ·  WINTER 2025 BATCH', W / 2, 250, { family: F.mono, size: 26, color: C.creamDim, align: 'center', ls: 6, alpha: ip });
    const nw = measure(ctx, String(n), { family: F.grotesk, size: 400, weight: 700 });
    text(ctx, String(n), W / 2 - 80, 680, { family: F.grotesk, size: 400, weight: 700, color: C.cream, align: 'center', ls: -12 });
    text(ctx, '%', W / 2 - 80 + nw / 2 + 10, 680, { family: F.grotesk, size: 220, weight: 700, color: C.coral });
    revealText(ctx, '四分之一的入选公司，95% 的代码由 AI 写成。', W / 2, 820, { family: F.sans, size: 44, weight: 500, color: C.cream, align: 'center' }, prog(t, 28.6, 29.4), { stagger: 0.02, rise: 20 });
    ctx.restore();
    P.ca = 0.004 + (1 - ip) * 0.01;
    return;
  }

  // ===== 31–33 · vibe coding =====
  if (t < 33) {
    darkBg(ctx, t);
    const o = { family: F.mono, size: 76, weight: 500, color: C.cream, cursorColor: C.coral };
    typeText(ctx, '“forget that the code', 260, 460, o, prog(t, 31.05, 31.7), t < 31.7, t);
    if (t >= 31.7) typeText(ctx, ' even exists.”', 260, 560, { ...o, color: C.coral }, prog(t, 31.7, 32.15), true, t);
    text(ctx, '— Andrej Karpathy, on “vibe coding”', 270, 660, { family: F.mono, size: 26, color: C.creamDim, alpha: prog(t, 32.1, 32.35) });
    text(ctx, '忘掉代码的存在。', W - 260, 800, { family: F.serif, size: 56, weight: 900, color: C.cream, align: 'right', alpha: prog(t, 32.2, 32.45) });
    hud(ctx, 'VIBE CODING', '2025.02');
    P.flash = t > 32.95 ? 0.4 : 0;
    return;
  }

  // ===== 33–34 · when code is no longer scarce =====
  if (t < 34) {
    fillBg(ctx, '#000');
    const p = prog(t, 33.0, 33.5);
    revealText(ctx, '当代码不再稀缺——', W / 2, H / 2 + 45, { family: F.serif, size: 130, weight: 900, color: C.cream, align: 'center' }, p, { stagger: 0.04, rise: 30 });
    const lw = ease.inOutExpo(prog(t, 33.4, 33.9));
    ctx.fillStyle = C.coral; ctx.fillRect(W / 2 - 560, H / 2 + 110, 1120 * lw, 6);
    P.ca = 0.004;
    return;
  }

  // ===== 34–35 · 拉片: rewind through everything we just saw =====
  if (t < 36) {
    const pitch = 480 + 36;
    // end state: frame 0 (the bulb) centered
    const endOff = W / 2;
    const r = ease.inOutCubic(prog(t, 34.0, 35.0));
    const startOff = W / 2 - (THUMB_T.length - 1) * pitch;
    const off = lerp(startOff, endOff, r);
    const vel = (lerp(startOff, endOff, ease.inOutCubic(prog(t + 1 / 60, 34, 35))) - off) * 60;
    const zoom = ease.inOutExpo(prog(t, 35.0, 35.45));
    fillBg(ctx, '#0a0a0a');
    ctx.save();
    // zoom into the idea frame until it fills the screen
    const s = lerp(1, W / 480, zoom);
    ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
    filmStrip(ctx, t, off, H / 2, 480, 270);
    ctx.restore();
    const hudA = 1 - zoom;
    const shown = lerp(33.6, 5.95, r);
    text(ctx, tc(shown), W / 2, 200, { family: F.mono, size: 64, weight: 500, color: '#E8A04B', align: 'center', alpha: hudA, ls: 2 });
    text(ctx, '◀◀  拉片 · REWIND', 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, alpha: hudA });
    text(ctx, `×${Math.max(1, Math.round(Math.abs(vel) / 60))}`, W - 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, align: 'right', alpha: hudA });
    ctx.fillStyle = `rgba(232,160,75,${0.8 * hudA})`; ctx.fillRect(W / 2 - 1, H / 2 - 200, 2, 400);
    P.dirBlur = [clamp(vel / 60000, -0.05, 0.05), 0];
    P.scan = 0.5; P.ca = 0.006; P.bloom = 0.3;
    if (zoom >= 1) {
      // the idea, full frame again — and the question
      raw && raw(ctx, 5.95);
      ctx.fillStyle = 'rgba(243,238,227,0.55)'; ctx.fillRect(0, 0, W, H);
      revealText(ctx, '那么，什么才是稀缺的？', W / 2, H - 120, { family: F.serif, size: 84, weight: 900, color: C.graphite, align: 'center' }, prog(t, 35.45, 35.75), { stagger: 0.025, rise: 20 });
      P.scan = 0; P.bloom = 0; P.vig = 0.4; P.warm = 0.4; P.dirBlur = [0, 0];
    }
    return;
  }

  // ===== 36–38 · the answer, one word per beat, flipping light/dark =====
  const words = [
    ['注意力', 'M-01 · 这个时代唯一真正稀缺的东西', '#050607', C.cream],
    ['判断力', '“你只有不懂，才会认为它说的绝对是对的。”', C.paper, C.ink],
    ['品味', 'TASTE · 做出让人眼前一新的东西', C.coral, C.ink],
  ];
  if (t < 37.5) {
    const i = Math.min(2, Math.floor((t - 36) / 0.5)), lt = t - 36 - i * 0.5;
    const [w, sub, bg, fg] = words[i];
    fillBg(ctx, bg);
    const e = ease.outExpo(clamp(lt / 0.25));
    ctx.save();
    zoomAt(ctx, 1.18 - 0.18 * e + lt * 0.08, W / 2, H / 2);
    text(ctx, w, W / 2, H / 2 + 110, { family: F.serif, size: 320, weight: 900, color: fg, align: 'center', ls: 20 });
    ctx.restore();
    text(ctx, sub, W / 2, H / 2 + 250, { family: F.mono, size: 26, color: fg, align: 'center', alpha: 0.7 * e });
    text(ctx, `0${i + 1} / 03`, 80, 90, { family: F.mono, size: 22, color: fg, ls: 3, alpha: 0.6 });
    P.scan = 0; P.bloom = 0; P.vig = 0.3;
    P.zoomBlur = 0.1 * (1 - clamp(lt / 0.12));
    P.ca = 0.01 * (1 - clamp(lt / 0.15));
    return;
  }
  // 37.5–38: the three words settle into one line + the handbook's thesis
  fillBg(ctx, '#050607');
  const p = ease.outExpo(prog(t, 37.5, 37.75));
  const xs = [-420, 0, 380];
  ['注意力', '判断力', '品味'].forEach((w, i) => {
    text(ctx, w, W / 2 + xs[i] * p, H / 2 + 20, { family: F.serif, size: lerp(320, 120, p), weight: 900, color: i === 2 ? C.coral : C.cream, align: 'center', alpha: i === 1 ? 1 : p });
  });
  text(ctx, '—— 判断力本身，就是资产。', W / 2, H / 2 + 150, { family: F.sans, size: 36, weight: 500, color: C.creamDim, align: 'center', alpha: prog(t, 37.62, 37.8) });
  P.scan = 0; P.bloom = 0.2;
  P.flash = prog(t, 37.9, 38) * 0.9; P.flashColor = [0.953, 0.933, 0.89];
}
