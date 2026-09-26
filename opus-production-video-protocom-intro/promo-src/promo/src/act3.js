// 38–62s · Us. The style converges: warm paper (the human) × precise UI (the machine).
// Members, verifiable tokens, running products, and the handbook's principles.
import {
  W, H, C, F, clamp, lerp, prog, ease, hash, hs, text, revealText, typeText, measure, fillBg, images, circleImage, roundRect, zoomAt,
} from './core.js';
import { MEMBERS, TOKENS, PRODUCTS, FEED, PRINCIPLES } from './data.js';

const BG = '#FAF8F3';
const INK = '#141414';
const MUTED = '#8A857C';

// Fine print-dot screen over upscaled avatars: reads as texture, hides the upscale.
let dots = null;
function halftone(ctx, cx, cy, r, a) {
  if (!dots) {
    const c = document.createElement('canvas'); c.width = c.height = 8;
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.arc(4, 4, 1.6, 0, 7); g.fill();
    dots = ctx.createPattern(c, 'repeat');
  }
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  ctx.fillStyle = dots; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r);
  g.addColorStop(0, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}
export function avatar(ctx, m, cx, cy, r, o = {}) {
  const { alpha = 1, dark = false, ring = 0 } = o;
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (m.img && images['av_' + m.img]) {
    circleImage(ctx, images['av_' + m.img], cx, cy, r);
    if (r > 110) halftone(ctx, cx, cy, r, m.img.endsWith('_big') ? 0.1 : 0.2);
  } else {
    ctx.fillStyle = dark ? '#1E2124' : '#F1EEE8';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'; ctx.lineWidth = Math.max(1, r * 0.02);
    ctx.stroke();
    text(ctx, m.mono || m.name[0], cx, cy + r * 0.2, { family: F.sans, size: r * 0.62, weight: 400, color: dark ? '#9C978D' : '#6F6A62', align: 'center' });
  }
  if (ring > 0) {
    ctx.strokeStyle = C.coral; ctx.lineWidth = Math.max(2, r * 0.035); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.09, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring); ctx.stroke();
  }
  ctx.restore();
}
function chip(ctx, label, x, y, size = 22, o = {}) {
  const { dark = false, alpha = 1, accent = false } = o;
  const w = measure(ctx, label, { size, weight: 500 }) + size * 1.1;
  const h = size * 1.7;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.fillStyle = accent ? C.coral : dark ? 'rgba(255,255,255,0.1)' : '#EFEBE3';
  roundRect(ctx, x, y - h * 0.72, w, h, h / 2); ctx.fill();
  ctx.restore();
  text(ctx, label, x + size * 0.55, y + size * 0.1, { size, weight: 500, color: accent ? '#fff' : dark ? C.cream : INK, alpha });
  return w;
}
function statusChip(ctx, x, y, t, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.fillStyle = '#EFEBE3'; roundRect(ctx, x, y - 22, 118, 36, 18); ctx.fill();
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);
  ctx.fillStyle = `rgba(52,168,110,${0.25 * pulse})`; ctx.beginPath(); ctx.arc(x + 22, y - 4, 10 + pulse * 3, 0, 7); ctx.fill();
  ctx.fillStyle = '#34A86E'; ctx.beginPath(); ctx.arc(x + 22, y - 4, 5.5, 0, 7); ctx.fill();
  ctx.restore();
  text(ctx, '运行中', x + 38, y + 4, { size: 20, weight: 500, color: INK, alpha });
}
function card(ctx, x, y, w, h, o = {}) {
  const { alpha = 1, dark = false, r = 22 } = o;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.shadowColor = 'rgba(40,30,20,0.08)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  ctx.fillStyle = dark ? '#16181B' : '#FFFFFF';
  roundRect(ctx, x, y, w, h, r); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : '#E9E4DA'; ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, r); ctx.stroke();
  ctx.restore();
}
function grid(ctx, color = 'rgba(20,20,20,0.045)') {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 96) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 96) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
}
function corner(ctx, l, r, dark, alpha = 1) {
  const col = dark ? C.creamDim : MUTED;
  text(ctx, l, 80, 84, { family: F.mono, size: 20, color: col, ls: 3, alpha });
  text(ctx, r, W - 80, 84, { family: F.mono, size: 20, color: col, ls: 3, align: 'right', alpha });
}
function bars(ctx, arr, x, y, w, h, p, color = INK) {
  const n = arr.length, bw = w / n;
  arr.forEach((v, i) => {
    const lp = ease.outExpo(clamp(p * 1.6 - (i / n) * 0.6));
    const bh = Math.max(2, v * h * lp);
    ctx.fillStyle = color;
    ctx.fillRect(x + i * bw + bw * 0.12, y + h - bh, bw * 0.76, bh);
  });
}

// ------------------------------------------------------------
const BIG = MEMBERS.slice(0, 4);
const FAST = MEMBERS.slice(4);

function memberBig(ctx, m, i, lt, t) {
  const dark = i % 2 === 1, flip = i % 2 === 1;
  fillBg(ctx, dark ? '#0B0D0F' : BG);
  grid(ctx, dark ? 'rgba(255,255,255,0.035)' : 'rgba(20,20,20,0.04)');
  const fg = dark ? C.cream : INK, sub = dark ? C.creamDim : MUTED;
  const e = ease.outExpo(clamp(lt / 0.3));
  ctx.save();
  zoomAt(ctx, 1.06 - 0.06 * e + lt * 0.05, W / 2, H / 2);
  const ax = flip ? W - 560 : 560, tx = flip ? W - 1000 : 1000, al = flip ? 'right' : 'left';
  avatar(ctx, m, ax + (flip ? -1 : 1) * (1 - e) * 120, H / 2, 250, { ring: ease.outCubic(clamp(lt / 0.45)), dark });
  const sx = (1 - e) * (flip ? -80 : 80);
  text(ctx, `${String(i + 1).padStart(2, '0')} / 11`, tx + sx, 330, { family: F.mono, size: 24, color: C.coral, align: al, ls: 3, alpha: e });
  text(ctx, m.name, tx + sx, 480, { family: F.sans, size: m.name.length > 8 ? 120 : 150, weight: 900, color: fg, align: al, alpha: e });
  text(ctx, `${m.handle}  ·  ${m.real}`, tx + sx * 1.4, 560, { family: F.mono, size: 40, color: sub, align: al, alpha: e });
  const cw = measure(ctx, m.role, { size: 30, weight: 500 }) + 33;
  chip(ctx, m.role, flip ? tx + sx * 1.6 - cw : tx + sx * 1.6, 640, 30, { dark, alpha: e, accent: m.role === '构建者' });
  if (m.line) text(ctx, m.line, tx + sx * 1.8, 760, { family: F.serif, size: 48, weight: 700, color: fg, align: al, alpha: e });
  if (m.joined) text(ctx, m.joined, tx + sx * 2, 830, { family: F.mono, size: 26, color: sub, align: al, alpha: e });
  ctx.restore();
  corner(ctx, 'MEMBERS  ·  成员', '加入了 Protocom', dark);
}
function memberFast(ctx, m, i, lt) {
  const dark = i % 2 === 0;
  fillBg(ctx, dark ? '#0B0D0F' : BG);
  const fg = dark ? C.cream : INK;
  const e = ease.outExpo(clamp(lt / 0.12));
  ctx.save();
  zoomAt(ctx, 1.12 - 0.12 * e, W / 2, H / 2);
  const side = i % 2 === 0 ? -1 : 1;
  avatar(ctx, m, W / 2 + side * 380, H / 2, 300, { dark });
  const al = side < 0 ? 'left' : 'right';
  const tx = side < 0 ? W / 2 + 40 : W / 2 - 40;
  text(ctx, m.name, tx, H / 2 + 20, { family: F.sans, size: 170, weight: 900, color: fg, align: al });
  text(ctx, m.handle, tx, H / 2 + 110, { family: F.mono, size: 48, color: C.coral, align: al });
  ctx.restore();
  text(ctx, `${String(i + 5).padStart(2, '0')} / 11`, 80, 84, { family: F.mono, size: 20, color: dark ? C.creamDim : MUTED, ls: 3 });
}
function memberGrid(ctx, t) {
  fillBg(ctx, BG);
  grid(ctx);
  const p0 = 44.75;
  revealText(ctx, '成员', 180, 200, { family: F.sans, size: 64, weight: 900, color: INK }, prog(t, p0, p0 + 0.3), { stagger: 0.05, rise: 20 });
  text(ctx, '有公开地址的人。', 180, 250, { size: 28, color: MUTED, alpha: prog(t, p0 + 0.15, p0 + 0.4) });
  text(ctx, '11 位 · 同路人与构建者', W - 180, 200, { family: F.mono, size: 26, color: C.coral, align: 'right', alpha: prog(t, p0 + 0.2, p0 + 0.5) });
  const cols = 4, cw = 390, chh = 150, gx = W / 2 - (cols * cw + (cols - 1) * 20) / 2, gy = 310;
  const tiles = [...MEMBERS, null];
  tiles.forEach((m, k) => {
    const cx = gx + (k % cols) * (cw + 20), cy = gy + Math.floor(k / cols) * (chh + 22);
    const p = ease.outBack(prog(t, p0 + 0.1 + k * 0.05, p0 + 0.45 + k * 0.05));
    if (p <= 0) return;
    ctx.save();
    ctx.translate(cx + cw / 2, cy + chh / 2); ctx.scale(0.85 + 0.15 * p, 0.85 + 0.15 * p); ctx.translate(-cx - cw / 2, -cy - chh / 2);
    ctx.globalAlpha = clamp(p);
    if (m) {
      card(ctx, cx, cy, cw, chh, { r: 20 });
      avatar(ctx, m, cx + 72, cy + chh / 2, 42);
      text(ctx, m.name, cx + 134, cy + 68, { size: 32, weight: 700, color: INK });
      text(ctx, m.handle, cx + 134, cy + 108, { family: F.mono, size: 22, color: MUTED });
      chip(ctx, m.role, cx + cw - 110, cy + chh / 2 + 6, 20, { accent: m.role === '构建者' });
    } else {
      // the empty seat
      ctx.setLineDash([10, 8]); ctx.strokeStyle = C.coral; ctx.lineWidth = 2.5;
      roundRect(ctx, cx, cy, cw, chh, 20); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.coral; ctx.beginPath(); ctx.arc(cx + 72, cy + chh / 2, 42, 0, 7); ctx.stroke();
      text(ctx, '+', cx + 72, cy + chh / 2 + 16, { size: 48, color: C.coral, align: 'center' });
      text(ctx, '下一个是你', cx + 134, cy + 68, { size: 32, weight: 700, color: C.coral });
      typeText(ctx, '@________', cx + 134, cy + 108, { family: F.mono, size: 22, color: C.coral }, 1, true, t);
    }
    ctx.restore();
  });
}

// ------------------------------------------------------------
function tokens(ctx, t) {
  fillBg(ctx, '#0B0D0F');
  grid(ctx, 'rgba(255,255,255,0.035)');
  const tp = prog(t, 47, 47.3);
  corner(ctx, 'TOKENS  ·  可验证统计', '公开排行榜', true, tp);
  const settle = ease.inOutExpo(prog(t, 48.4, 49.0));
  // headline number
  const v = 76.0 * ease.outExpo(prog(t, 47.05, 48.2));
  ctx.save();
  const hy = lerp(H / 2 + 60, 250, settle), hs2 = lerp(1, 0.46, settle);
  ctx.translate(W / 2, hy); ctx.scale(hs2, hs2);
  const str = v.toFixed(1);
  const nw = measure(ctx, str, { family: F.grotesk, size: 360, weight: 700 });
  text(ctx, str, -70, 0, { family: F.grotesk, size: 360, weight: 700, color: C.cream, align: 'center', ls: -10 });
  text(ctx, 'B', -70 + nw / 2 + 12, 0, { family: F.grotesk, size: 360, weight: 700, color: C.coral });
  ctx.restore();
  text(ctx, '760 亿 Tokens · 来自 4 位公开参与者', W / 2, H / 2 + 170, { family: F.sans, size: 44, weight: 500, color: C.cream, align: 'center', alpha: prog(t, 47.5, 47.8) * (1 - settle) });
  text(ctx, '不是估算。每一个 Token 都可以被验证。', W / 2, H / 2 + 240, { family: F.mono, size: 26, color: C.creamDim, align: 'center', alpha: prog(t, 47.8, 48.1) * (1 - settle) });
  if (settle <= 0) return;
  // leaderboard rows
  TOKENS.forEach((r, i) => {
    const t0 = 48.75 + i * 0.12;
    const p = ease.outExpo(prog(t, t0, t0 + 0.4));
    if (p <= 0) return;
    const y = 400 + i * 150;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.translate((1 - p) * 120, 0);
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; roundRect(ctx, 180, y, W - 360, 124, 20); ctx.fill();
    text(ctx, String(i + 1), 240, y + 80, { family: F.grotesk, size: 48, weight: 700, color: i === 0 ? C.coral : C.cream, align: 'center' });
    avatar(ctx, r, 340, y + 62, 40);
    text(ctx, r.name, 400, y + 56, { size: 34, weight: 700, color: C.cream });
    text(ctx, r.handle, 400, y + 96, { family: F.mono, size: 22, color: C.creamDim });
    text(ctx, `${r.days} 天活跃`, 820, y + 72, { family: F.mono, size: 24, color: C.creamDim });
    text(ctx, `连续 ${r.streak} 天`, 820, y + 104, { family: F.mono, size: 18, color: '#6d6a63' });
    bars(ctx, r.bars, 1060, y + 22, 470, 80, prog(t, t0 + 0.1, t0 + 1.2), i === 0 ? C.coral : C.cream);
    const val = r.value * ease.outExpo(prog(t, t0, t0 + 1.0));
    text(ctx, `${val.toFixed(1)}B`, W - 230, y + 80, { family: F.grotesk, size: 54, weight: 700, color: C.cream, align: 'right' });
    ctx.restore();
  });
}

// ------------------------------------------------------------
function products(ctx, t) {
  fillBg(ctx, BG);
  grid(ctx);
  corner(ctx, 'PRODUCTS  ·  共同体产品', 'tommy0103/obelisk', false, prog(t, 51, 51.3));
  const h1 = prog(t, 51.0, 51.4), h2 = prog(t, 51.55, 51.95);
  const lift = ease.inOutExpo(prog(t, 52.0, 52.5));
  ctx.save();
  ctx.translate(0, lerp(0, -330, lift));
  const sc = lerp(1, 0.62, lift);
  zoomAt(ctx, sc, W / 2, H / 2);
  revealText(ctx, '不是 PPT 上的项目。', W / 2, H / 2 - 30, { family: F.serif, size: 110, weight: 900, color: INK, align: 'center' }, h1, { stagger: 0.03, rise: 30 });
  if (h2 > 0) {
    const w1 = measure(ctx, '是正在', { family: F.serif, size: 110, weight: 900 });
    const w2 = measure(ctx, '运行', { family: F.serif, size: 110, weight: 900 });
    const w3 = measure(ctx, '的系统。', { family: F.serif, size: 110, weight: 900 });
    const x0 = W / 2 - (w1 + w2 + w3) / 2;
    revealText(ctx, '是正在', x0, H / 2 + 110, { family: F.serif, size: 110, weight: 900, color: INK }, h2, { stagger: 0.03, rise: 30 });
    revealText(ctx, '运行', x0 + w1, H / 2 + 110, { family: F.serif, size: 110, weight: 900, color: C.coral }, h2, { stagger: 0.03, rise: 30 });
    revealText(ctx, '的系统。', x0 + w1 + w2, H / 2 + 110, { family: F.serif, size: 110, weight: 900, color: INK }, h2, { stagger: 0.03, rise: 30 });
  }
  ctx.restore();
  if (lift <= 0) return;
  // bento
  const push = 1 + (t - 52) * 0.012;
  ctx.save();
  zoomAt(ctx, push, W / 2, H / 2 + 120);
  const gy = 340;
  const boxes = [
    [140, gy, 800, 330], [960, gy, 820, 155], [960, gy + 175, 820, 155], [140, gy + 350, 1640, 330],
  ];
  boxes.forEach((b, i) => {
    const p = ease.outBack(prog(t, 52.2 + i * 0.1, 52.6 + i * 0.1));
    if (p <= 0) return;
    const [x, y, w, h] = b;
    ctx.save();
    ctx.globalAlpha = clamp(p);
    ctx.translate(0, (1 - p) * 60);
    card(ctx, x, y, w, h);
    if (i < 3) {
      const pr = PRODUCTS[i];
      ctx.fillStyle = '#F3F0EA'; roundRect(ctx, x + 30, y + 30, 64, 64, 14); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
      // package glyph
      const gx2 = x + 62, gy2 = y + 62;
      ctx.beginPath(); ctx.moveTo(gx2, gy2 - 16); ctx.lineTo(gx2 + 15, gy2 - 8); ctx.lineTo(gx2 + 15, gy2 + 9); ctx.lineTo(gx2, gy2 + 17); ctx.lineTo(gx2 - 15, gy2 + 9); ctx.lineTo(gx2 - 15, gy2 - 8); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx2 - 15, gy2 - 8); ctx.lineTo(gx2, gy2); ctx.lineTo(gx2 + 15, gy2 - 8); ctx.moveTo(gx2, gy2); ctx.lineTo(gx2, gy2 + 17); ctx.stroke();
      text(ctx, pr.name, x + 120, y + 60, { size: 36, weight: 700, color: INK });
      text(ctx, pr.desc, x + 120, y + 100, { size: 24, color: MUTED });
      statusChip(ctx, x + w - 150, y + 58, t);
      if (i === 0) {
        // a live slice of the member directory
        MEMBERS.slice(0, 6).forEach((m, k) => {
          const mx = x + 40 + (k % 2) * 380, my = y + 160 + Math.floor(k / 2) * 56;
          const mp = prog(t, 52.6 + k * 0.08, 52.9 + k * 0.08);
          avatar(ctx, m, mx + 20, my, 20, { alpha: mp });
          text(ctx, m.name, mx + 54, my + 8, { size: 24, weight: 500, color: INK, alpha: mp });
          text(ctx, m.handle, mx + 54 + measure(ctx, m.name, { size: 24, weight: 500 }) + 12, my + 8, { family: F.mono, size: 18, color: MUTED, alpha: mp });
        });
      }
    } else {
      // live GitHub activity feed from obelisk
      text(ctx, '最近活动', x + 40, y + 60, { size: 34, weight: 700, color: INK });
      text(ctx, '社群内可见的近况。', x + 200, y + 60, { size: 24, color: MUTED });
      ctx.save();
      ctx.beginPath(); ctx.rect(x + 20, y + 90, w - 40, h - 110); ctx.clip();
      const scroll = (t - 52.5) * 90;
      for (let k = 0; k < 10; k++) {
        const f = FEED[k % FEED.length];
        const fy = y + 140 + k * 64 - scroll;
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + 54, fy - 8, 11, 0, 7); ctx.fill();
        const s1 = `KinomotoMio ${f[0]} ${f[1]}：`;
        text(ctx, s1, x + 80, fy, { size: 26, weight: 700, color: INK });
        const s1w = measure(ctx, s1, { size: 26, weight: 700 });
        text(ctx, f[2], x + 80 + s1w, fy, { size: 26, color: INK });
        text(ctx, '· tommy0103/obelisk', x + 80 + s1w + measure(ctx, f[2], { size: 26 }) + 14, fy, { family: F.mono, size: 20, color: MUTED });
      }
      ctx.restore();
    }
    ctx.restore();
  });
  ctx.restore();
}

// ------------------------------------------------------------
function principle(ctx, t, i, lt) {
  const pr = PRINCIPLES[i];
  const dark = i % 2 === 0;
  const bg = dark ? '#0B0D0F' : BG, fg = dark ? C.cream : INK;
  fillBg(ctx, bg);
  const e = ease.outExpo(clamp(lt / 0.35));
  // mirror-split entrance: top half from the left, bottom half from the right
  const off = (1 - e) * 700;
  const size = 150;
  const draw = () => {
    text(ctx, pr.a, W / 2, H / 2 - 40, { family: F.serif, size, weight: 900, color: i % 3 === 0 ? C.coral : fg, align: 'center' });
    text(ctx, pr.b, W / 2, H / 2 + 150, { family: F.serif, size: size * 0.72, weight: 900, color: fg, align: 'center' });
  };
  const drift = lt * 30;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H / 2 + 30); ctx.clip(); ctx.translate(-off - drift, 0); draw(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 + 30, W, H); ctx.clip(); ctx.translate(off + drift, 0); draw(); ctx.restore();
  ctx.fillStyle = C.coral; ctx.fillRect(0, H / 2 + 29, W * ease.inOutExpo(clamp(lt / 0.4)), 2);
  text(ctx, `${pr.code}  ·  ${pr.kind}`, 80, 84, { family: F.mono, size: 22, color: dark ? C.creamDim : MUTED, ls: 3 });
  text(ctx, '共建手册 v0.1', W - 80, 84, { family: F.mono, size: 22, color: dark ? C.creamDim : MUTED, ls: 3, align: 'right' });
  text(ctx, `${String(i + 1).padStart(2, '0')} / 06`, W - 80, H - 70, { family: F.mono, size: 22, color: C.coral, ls: 3, align: 'right' });
}

// ------------------------------------------------------------
export function drawAct3(ctx, t, P) {
  P.grain = 0.03; P.vig = 0.25; P.ca = 0.0012;

  // 38–41 · intro
  if (t < 41) {
    fillBg(ctx, BG);
    grid(ctx);
    const a = 1 - prog(t, 40.3, 40.6);
    text(ctx, 'NCC  ·  WUHAN  ·  2025 → NOW', W / 2, 330, { family: F.mono, size: 26, color: MUTED, align: 'center', ls: 6, alpha: prog(t, 38.05, 38.4) * a });
    revealText(ctx, '于是，在 NCC，', W / 2, 500, { family: F.serif, size: 120, weight: 900, color: INK, align: 'center', alpha: a }, prog(t, 38.1, 38.8), { stagger: 0.04 });
    revealText(ctx, '一群学生聚在了一起。', W / 2, 660, { family: F.serif, size: 120, weight: 900, color: INK, align: 'center', alpha: a }, prog(t, 38.7, 39.5), { stagger: 0.04 });
    // avatar row pops in, then the first one grows into the montage (match cut)
    const grow = ease.inExpo(prog(t, 40.55, 41.0));
    MEMBERS.forEach((m, k) => {
      const p = ease.outBack(prog(t, 39.6 + k * 0.05, 39.9 + k * 0.05));
      if (p <= 0) return;
      const baseX = W / 2 + (k - 5) * 118, baseY = 850;
      if (k === 0) {
        const x = lerp(baseX, 680, grow), y = lerp(baseY, H / 2, grow), r = lerp(48, 265, grow);
        avatar(ctx, m, x, y, r * p);
      } else avatar(ctx, m, baseX, baseY + grow * 300, 48 * p, { alpha: 1 - grow });
    });
    return;
  }
  // 41–43 · four big profiles
  if (t < 43) { const i = Math.floor((t - 41) / 0.5); memberBig(ctx, BIG[i], i, t - 41 - i * 0.5, t); P.zoomBlur = 0.06 * (1 - clamp((t - 41 - i * 0.5) / 0.1)); return; }
  // 43–44.75 · seven fast cuts on the 8ths
  if (t < 44.75) { const i = Math.min(6, Math.floor((t - 43) / 0.25)); memberFast(ctx, FAST[i], i, t - 43 - i * 0.25); P.zoomBlur = 0.08 * (1 - clamp((t - 43 - i * 0.25) / 0.08)); return; }
  // 44.75–47 · the directory
  if (t < 47) { memberGrid(ctx, t); P.flash = t < 44.8 ? 0.5 : 0; P.flashColor = [1, 1, 1]; return; }
  // 47–51 · tokens
  if (t < 51) { tokens(ctx, t); P.bloom = 0.25; return; }
  // 51–55 · products
  if (t < 55) { products(ctx, t); return; }
  // 55–61 · six principles, one per bar-half
  if (t < 61) {
    const i = Math.floor((t - 55) / 1), lt = t - 55 - i;
    principle(ctx, t, i, lt);
    P.ca = 0.008 * (1 - clamp(lt / 0.15));
    P.zoomBlur = 0.05 * (1 - clamp(lt / 0.1));
    return;
  }
  // 61–62 · everything collapses into a single point of light
  const c = ease.inExpo(prog(t, 61.0, 61.85));
  fillBg(ctx, '#0B0D0F');
  ctx.save();
  zoomAt(ctx, Math.max(0.001, 1 - c), W / 2, H / 2);
  principle(ctx, t, 5, 1 + (t - 61));
  ctx.restore();
  if (c > 0.02) { ctx.save(); ctx.fillStyle = '#050607'; ctx.globalAlpha = c; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const dotR = 3 + 6 * c;
  ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(W / 2, H / 2, dotR * clamp(c * 3), 0, 7); ctx.fill();
  P.bloom = c; P.zoomBlur = c * 0.2;
}
