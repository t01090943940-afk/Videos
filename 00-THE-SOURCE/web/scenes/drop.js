// ─────────────────────────────────────────────────────────────────────────────
//  ACT 2 · 电影（b52–72）· DROP
//  每拍一切 → 半拍一切 → 三联 / 四联分屏 → 三台手机 → 两个收尾镜头。
//  每一刀的入场方式都不同（代码解码 / 墨迹晕染 / 横条错位 / 像素 / 径向推进 / Voronoi 碎裂 / 故障 / 甩镜），
//  它们本身就是这 28 部片子里用过的转场手法。
// ─────────────────────────────────────────────────────────────────────────────
import { DROP, SPLITS, PHONES, DROP_TAIL } from '../../src/timeline.mjs';
import { clamp, seg, E, hash, hit, M4, T, WHITE, hex, col, BYKEY, lowerThird, glow, scramble } from './common.js';

const SHOTS = [...DROP, ...DROP_TAIL];
const ORANGE = hex('#FF7A3D');

function drawShot(ctx, sh, t) {
  const t0 = T(sh.b0), dur = T(sh.b1) - t0;
  const lt = t - t0;
  const vid = ctx.video(sh.clip, Math.max(0, lt));
  const push = 1.0 + 0.07 * clamp(lt / Math.max(dur, 0.5));
  const punch = 1 + 0.09 * Math.exp(-Math.max(lt, 0) / 0.09);
  const s = push * punch;
  const drift = Math.sin(hash(sh.b0) * 6 + lt * 0.8) * 0.01;
  const g = sh.fx === 'glyph' ? { work: sh.work, density: 'fine', amount: 1, reveal: E.io2(seg(lt, 0, 0.36)), seed: sh.b0, hotColor: col(BYKEY[sh.work].model) } : null;
  ctx.sprite({ w: 1920, h: 1080, tex: vid, uv: ctx.coverUV(vid.w, vid.h, 1920, 1080, s, drift, drift * 0.5), glyph: g });
}

const TW = { ink: [0.03, 0.3], shatter: [0.02, 0.28], zoom: [0.05, 0.14], slice: [0.02, 0.2], pixel: [0.05, 0.12], rgb: [0.03, 0.12], whip: [0.06, 0.1] };

function montage(ctx) {
  const t = ctx.t, b = ctx.b;
  const i = SHOTS.findIndex((s) => b >= s.b0 && b < s.b1);
  if (i < 0) return;
  const sh = SHOTS[i];
  const prev = SHOTS[i - 1] && SHOTS[i - 1].b1 === sh.b0 ? SHOTS[i - 1] : null;
  const w = TW[sh.fx];
  const lt = t - T(sh.b0);
  if (w && prev && lt < w[1]) {
    const p = seg(lt, -w[0], w[1]);
    const A = ctx.layer((c) => drawShot(c, prev, t));
    const B = ctx.layer((c) => drawShot(c, sh, t));
    ctx.trans(A, B, p, sh.fx, sh.b0, [0.5 + hash(sh.b0, 1) * 0.2 - 0.1, 0.5]);
  } else drawShot(ctx, sh, t);
  // 下一镜的"预切"：甩镜/推进在本镜尾部就开始
  const nx = SHOTS[i + 1];
  if (nx && TW[nx.fx] && nx.b0 === sh.b1) {
    const pre = T(nx.b0) - t;
    if (pre < TW[nx.fx][0]) {
      const A = ctx.layer((c) => drawShot(c, sh, t));
      const B = ctx.layer((c) => drawShot(c, nx, t));
      ctx.trans(A, B, seg(-pre, -TW[nx.fx][0], TW[nx.fx][1]), nx.fx, nx.b0, [0.5, 0.5]);
    }
  }
  lowerThird(ctx, sh.work, sh.tag, sh.src, seg(lt, 0, 0.45), 1);
  // 镜号
  const n = String(i + 1).padStart(2, '0');
  ctx.text(n, { fam: 'barlow', size: 84, weight: 900 }, { x: 960 - 90, y: -540 + 110, anchor: 1, alpha: 0.9, color: WHITE, s: 1 + 0.25 * Math.exp(-lt / 0.08) });
  ctx.text('CUT', { fam: 'mono', size: 18, spacing: 4 }, { x: 960 - 90, y: -540 + 168, anchor: 1, alpha: 0.55, color: WHITE });
}

// 分屏：竖条从上下交替滑入
function splits(ctx, sp) {
  const t = ctx.t, b = ctx.b;
  const n = sp.panes.length, gap = 10;
  const pw = (1920 - gap * (n - 1)) / n;
  const out = E.in3(seg(b, sp.b1 - 0.2, sp.b1));
  sp.panes.forEach((p, k) => {
    const b0 = sp.b0 + k * 0.25;
    const e = E.outExpo(seg(b, b0, b0 + 0.55));
    if (e <= 0) return;
    const dir = k % 2 === 0 ? 1 : -1;
    const x = -960 + pw / 2 + k * (pw + gap);
    const y = (1 - e) * dir * 1100 + out * -dir * 1100;
    const vid = ctx.video(p.clip, t - T(b0));
    const z = 1.05 + 0.05 * seg(b, b0, sp.b1);
    ctx.sprite({ x, y, w: pw, h: 1080, tex: vid, uv: ctx.coverUV(vid.w, vid.h, pw, 1080, z),
      glyph: { work: p.work, density: 'fine', amount: 1, reveal: E.io2(seg(b, b0, b0 + 0.7)), seed: k + sp.b0, hotColor: col(BYKEY[p.work].model) } });
    const w = BYKEY[p.work];
    const lk = seg(b, b0 + 0.2, b0 + 0.8);
    ctx.rect({ x: x - pw / 2 + 30, y: y - 380, w: 4, h: 60 * E.out3(lk), color: col(w.model), alpha: 1 });
    ctx.text(w.title, { fam: 'sans', size: 34 }, { x: x - pw / 2 + 44, y: y - 366, anchor: 0, alpha: E.out3(lk), color: WHITE });
    ctx.text(p.tag, { fam: 'sans7', size: 20 }, { x: x - pw / 2 + 46, y: y - 400, anchor: 0, alpha: 0.85 * E.out3(lk), color: WHITE });
  });
  for (let k = 1; k < n; k++) ctx.rect({ x: -960 + k * (pw + gap) - gap / 2, y: 0, w: 2, h: 1080 * E.outExpo(seg(b, sp.b0, sp.b0 + 0.5)), color: ORANGE, alpha: 0.6, blend: 'add' });
}

// 三台手机：竖屏作品
function phones(ctx) {
  const t = ctx.t, b = ctx.b;
  const bg = ctx.video(PHONES.bg, t - T(PHONES.b0));
  ctx.sprite({ w: 1920, h: 1080, tex: bg, uv: ctx.coverUV(bg.w, bg.h, 1920, 1080, 1.15), bright: 0.32, sat: 0.5,
    glyph: { work: PHONES.bgWork, density: 'fine', amount: 0.7, reveal: 0, seed: 9 } });
  ctx.cam3d({ eye: [Math.sin(t * 0.9) * 140, 30, 1483.6], at: [0, 0, 0], fov: 40 });
  PHONES.items.forEach((p, k) => {
    const b0 = PHONES.b0 + k * 0.2;
    const e = E.outBack(seg(b, b0, b0 + 0.6), 1.3);
    const ry = (k - 1) * -0.32 + (1 - e) * Math.PI * 0.5 * (k === 1 ? 1 : -1);
    const x = (k - 1) * 560, z = k === 1 ? 120 : -80;
    const M = M4.trs(x, (1 - e) * -200, z, 0, ry, (k - 1) * -0.03);
    const W = 360, H = 640;
    ctx.sprite({ m: M4.mul(M, M4.trs(0, 0, -2)), w: W + 36, h: H + 60, radius: 48, color: [0.06, 0.065, 0.075], mode: 2 });
    ctx.sprite({ m: M4.mul(M, M4.trs(0, 0, -1)), w: W + 40, h: H + 64, radius: 50, color: col(BYKEY[p.work].model), alpha: 0.35, mode: 2, blend: 'add' });
    const vid = ctx.video(p.clip, t - T(b0));
    ctx.sprite({ m: M, w: W, h: H, tex: vid, uv: ctx.coverUV(vid.w, vid.h, W, H), radius: 30,
      glyph: { work: p.work, density: 'coarse', amount: 1, reveal: E.io2(seg(b, b0 + 0.1, b0 + 0.8)), seed: k } });
    ctx.sprite({ m: M4.mul(M, M4.trs(0, H / 2 - 14, 1)), w: 90, h: 16, radius: 8, color: [0, 0, 0], mode: 2 });
  });
  ctx.cam2d();
  ctx.text('竖屏 · 同一套代码', { fam: 'sans', size: 40 }, { x: 0, y: -470, alpha: E.out3(seg(b, 68.6, 69.2)), color: WHITE });
  ctx.text('慢下来 · 中秋给学姐 · 月光替你亮着灯', { fam: 'sans7', size: 22 }, { x: 0, y: -512, alpha: 0.7 * E.out3(seg(b, 68.8, 69.4)), color: WHITE });
}

export function drop(ctx) {
  const t = ctx.t, b = ctx.b;
  const P = ctx.post;
  P.bloom = 0.3; P.bloomThresh = 0.95; P.vignette = 0.6; P.grain = 0.04; P.contrast = 1.06;
  const sp = SPLITS.find((s) => b >= s.b0 && b < s.b1);
  if (sp) splits(ctx, sp);
  else if (b >= PHONES.b0 && b < PHONES.b1) phones(ctx);
  else montage(ctx);
  // 常驻：时代徽章
  ctx.rect({ x: -960 + 60, y: 540 - 96, w: 4, h: 30, color: ORANGE, alpha: 0.9 });
  ctx.text('GEN 04 · CLAUDE OPUS · 学会了拍电影', { fam: 'sans7', size: 24 }, { x: -960 + 74, y: 540 - 96, anchor: 0, alpha: 0.85, color: WHITE });
  // 冲击：DROP 第一拍最狠，之后每刀一次小冲击
  const cuts = [...SHOTS.map((s) => s.b0), ...SPLITS.flatMap((s) => s.panes.map((_, k) => s.b0 + k * 0.25)), PHONES.b0];
  let h = 0;
  for (const c of cuts) h = Math.max(h, hit(t, T(c), 0.1));
  const big = hit(t, T(52), 0.5), bf = hit(t, T(52), 0.12);
  P.flash = [h * 0.05 + bf * 0.8, h * 0.045 + bf * 0.75, h * 0.04 + bf * 0.7];
  P.ca = 0.0015 + h * 0.006 + big * 0.02;
  const sh = h * 0.004 + big * 0.02;
  P.shake = [Math.sin(t * 97) * sh, Math.cos(t * 89) * sh];
  P.zoom = 1 + big * 0.06;
  P.bloom += bf * 0.8;
  P.exposure = 1 - bf * 0.1;
}
