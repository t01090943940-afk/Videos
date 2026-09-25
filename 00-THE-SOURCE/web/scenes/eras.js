// ─────────────────────────────────────────────────────────────────────────────
//  ACT 1 · 进化（b16–52）
//  KIMI / SWE：每个新作品是一个窗口，从前方飞入，旧窗口向后上方退成一座塔；
//              越旧的窗口越"退回代码"（字形叠加），塔越长越高。
//  GPT：COSMOS 一格裂成 4 格、16 格；然后十五个世界围成一圈，摄像机每半拍甩向下一个世界。
//  OPUS 预告：能力曲线冲出画框，所有世界被吸进一个奇点 → 半拍真空。
// ─────────────────────────────────────────────────────────────────────────────
import { ERAS, TOWER, COSMOS, WORLDS, GPT_TAIL, PREDROP } from '../../src/timeline.mjs';
import { Ctx } from '../engine.js';
import { codePlane } from './genesis.js';
import { clamp, seg, E, hash, hit, M4, T, WHITE, hex, glow, drawWindow, BYKEY, scramble } from './common.js';

const WORLD_NAMES = ['HAND-DRAWN', 'BLOCK WORLD', 'CLAYMATION', 'EDITORIAL COLLAGE', 'PURE VECTOR', 'PIXEL ARCADE',
  'HALFTONE COMIC', 'BLUEPRINT', 'KINETIC TYPE', 'PAPER THEATRE', 'INK & SILENCE', 'NEON SYSTEM', 'LIQUID CHROME',
  'PARTICLE COSMOS', 'PRISMATIC GLASS'];

const eraAt = (b) => ERAS.reduce((a, e) => (b >= e.b0 ? e : a), ERAS[0]);

// ── 时代卡 ─────────────────────────────────────────────────────────────────
function eraCard(ctx, e) {
  const b = ctx.b;
  const k = seg(b, e.b0, e.b0 + 0.8);
  const out = E.in2(seg(b, e.b0 + 2.6, e.b0 + 3.3));
  if (k <= 0 || out >= 1) return;
  const c = hex(e.color);
  const x0 = -960 + 110, y0 = 60;
  const a = 1 - out;
  const sl = (1 - E.out3(k)) * 60 + out * -40;
  ctx.rect({ x: x0 - 30, y: y0 + 10, w: 6, h: 300 * E.outExpo(seg(b, e.b0, e.b0 + 0.6)), color: c, alpha: a });
  ctx.text(`GEN ${e.n}`, { fam: 'mono', size: 24, spacing: 8 }, { x: x0, y: y0 + 130, anchor: 0, color: c, alpha: a * E.out2(k * 2) });
  ctx.chars(e.model, { fam: 'barlow', size: 156, weight: 900, spacing: 2 }, { x: x0, y: y0 + 40, anchor: 0 }, (i) => {
    const kk = E.out3(seg(b, e.b0 + i * 0.05, e.b0 + i * 0.05 + 0.6));
    return { alpha: kk * a, y: y0 + 40 - (1 - kk) * 80 + sl * 0.2, color: WHITE };
  });
  const vk = seg(b, e.b0 + 0.35, e.b0 + 1.1);
  ctx.text(e.verb, { fam: 'sans', size: 70 }, { x: x0 + sl, y: y0 - 60, anchor: 0, alpha: a * E.out3(vk), color: WHITE });
  ctx.text(scramble(e.en, seg(b, e.b0 + 0.5, e.b0 + 1.6), 7, ctx.t * 30), { fam: 'mono', size: 21, spacing: 6 },
    { x: x0 + 2, y: y0 - 124, anchor: 0, alpha: a * 0.8, color: c });
  ctx.text(e.spec, { fam: 'sans7', size: 26 }, { x: x0 + 2, y: y0 - 170, anchor: 0, alpha: a * 0.65 * E.out2(seg(b, e.b0 + 0.9, e.b0 + 1.6)), color: WHITE });
}

// 常驻的小时代标
function eraBadge(ctx, e, alpha) {
  const b = ctx.b;
  const a = alpha * E.out2(seg(b, e.b0 + 2.8, e.b0 + 3.6));
  if (a <= 0.01) return;
  const c = hex(e.color);
  ctx.rect({ x: -960 + 60, y: 540 - 96, w: 4, h: 30, color: c, alpha: a });
  ctx.text(`GEN ${e.n} · ${e.model} · ${e.verb}`, { fam: 'sans7', size: 24 }, { x: -960 + 74, y: 540 - 96, anchor: 0, alpha: a * 0.9, color: WHITE });
}

// ── 能力曲线：右下角，OPUS 段冲出画框 ────────────────────────────────────
function curve(ctx, alpha) {
  if (alpha <= 0.01) return;
  const b = ctx.b;
  const bx = 540, by = -430, bw = 330, bh = 170;
  ctx.rect({ x: bx + bw / 2, y: by, w: bw, h: 1.5, color: WHITE, alpha: 0.35 * alpha });
  ctx.rect({ x: bx, y: by + bh / 2, w: 1.5, h: bh, color: WHITE, alpha: 0.35 * alpha });
  ctx.rect({ x: bx + bw / 2, y: by + bh, w: bw, h: 1, color: [1, 0.4, 0.3], alpha: 0.25 * alpha });
  ctx.text('代码视频的上限', { fam: 'sans7', size: 17 }, { x: bx + 8, y: by + bh + 16, anchor: 0, alpha: 0.6 * alpha, color: WHITE });
  const pts = [[0, 0.04], ...ERAS.map((e, i) => [0.16 + i * 0.25, e.level])];
  let last = null;
  ERAS.forEach((e, i) => {
    const k = E.io2(seg(b, e.b0, e.b0 + (i === 3 ? 5 : 1.2)));
    if (k <= 0) return;
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const X0 = bx + x0 * bw, Y0 = by + y0 * bh;
    let X1 = bx + (x0 + (x1 - x0) * k) * bw, Y1 = by + (y0 + (y1 - y0) * k) * bh;
    if (i === 3) Y1 = by + (y0 + (y1 - y0) * k + E.inExpo(seg(b, 47, 51)) * 6) * bh;
    const c = hex(e.color);
    const len = Math.hypot(X1 - X0, Y1 - Y0), ang = Math.atan2(Y1 - Y0, X1 - X0);
    ctx.rect({ x: (X0 + X1) / 2, y: (Y0 + Y1) / 2, w: len, h: 3, rz: ang, color: c, alpha });
    ctx.rect({ x: (X0 + X1) / 2, y: (Y0 + Y1) / 2, w: len, h: 12, rz: ang, color: c, alpha: alpha * 0.18, blend: 'add' });
    ctx.rect({ x: X1, y: Y1, w: 12, h: 12, radius: 6, color: c, alpha });
    glow(ctx, X1, Y1, 90 + 140 * hit(ctx.t, T(e.b0), 0.3), c, alpha * 0.8);
    if (k >= 1 && i < 3) ctx.text(e.model, { fam: 'mono', size: 14 }, { x: X1, y: Y1 - 22, alpha: alpha * 0.7, color: c });
    last = [X1, Y1];
  });
  if (b > 49 && b < 51) {
    ctx.text('冲破上限', { fam: 'sans', size: 30 }, { x: bx + bw - 10, y: by + bh + 50, anchor: 1, alpha: alpha * E.out2(seg(b, 49, 49.5)), color: hex('#FF7A3D') });
  }
}

// ── KIMI / SWE：窗口塔 ─────────────────────────────────────────────────────
function tower(ctx, fade) {
  const b = ctx.b, t = ctx.t;
  const D = Ctx.camDist(40);
  const arrived = TOWER.filter((w) => b >= w.b);
  const kTot = arrived.reduce((s, w, i) => s + (i === 0 ? 0 : E.out3(seg(b, w.b, w.b + 0.6))), 0);
  // 摄像机：盯住最新窗口，随塔升高，绕塔缓慢环行；进入 SWE 时甩一下
  const phiN = 0.42 - 0.5 * E.io2(seg(b, 16, 32)) + 0.35 * E.io3(seg(b, 23.6, 24.6)) - 0.35 * E.io3(seg(b, 23.6, 25.5));
  const f0 = E.io3(seg(b, 16, 17.4)); // 开场：相机贴着第一窗（正好满屏）→ 拉开
  const phi = 0.3 + (phiN - 0.3) * f0;
  const tgtN = [-kTot * 38, kTot * 30, -kTot * 120];
  const tgt = tgtN.map((v) => v * f0);
  const dist = D * (0.46875 + (1.05 + 0.02 * kTot - 0.46875) * f0);
  const exitK = E.in3(seg(b, 32, 33));
  const eye = [tgt[0] + Math.sin(phi) * dist, tgt[1] + (90 + Math.sin(t * 0.6) * 20) * f0, tgt[2] + Math.cos(phi) * dist];
  ctx.cam3d({ eye, at: tgt, fov: 40 });
  // 从后往前画
  const list = TOWER.map((w, i) => {
    if (b < w.b) return null;
    let k = 0;
    for (let j = i + 1; j < TOWER.length; j++) k += E.out3(seg(b, TOWER[j].b, TOWER[j].b + 0.6));
    return { w, i, k };
  }).filter(Boolean).sort((a, c) => c.k - a.k);
  for (const { w, i, k } of list) {
    const era = TOWER[i].b < 24 ? ERAS[0] : ERAS[1];
    const size = era === ERAS[0] ? [900, 506] : [1000, 562];
    const e = E.out3(seg(b, w.b, w.b + 0.7));
    // 槽位
    let x = -k * 170, y = k * 105, z = -k * 430, ry = 0.3 + 0.015 * k; const s = 1;
    if (i > 0) { x += (1 - e) * 700; y += (1 - e) * -260; z += (1 - e) * 900; ry += (1 - e) * -0.5; }
    x -= exitK * 3200; z -= exitK * 800;
    const vid = ctx.video(w.clip, t - T(w.b));
    const acc = hex(era.color);
    const glyphAmt = i === 0 && b < 16.2 ? 0 : clamp((k - 2.2) * 0.22, 0, 0.8);
    const reveal = i === 0 ? 1 : E.io2(seg(b, w.b, w.b + 0.9));
    drawWindow(ctx, M4.trs(x, y, z, 0, ry, 0, s, s, 1), {
      tex: vid, w: size[0], h: size[1], title: `${BYKEY[w.work].folder} · ${BYKEY[w.work].title}`, accent: acc,
      alpha: fade * (1 - exitK * 0.6), bright: 1 - Math.min(k, 9) * 0.06,
      glyph: { work: w.work, density: 'coarse', amount: reveal < 1 ? 1 : glyphAmt, reveal: reveal < 1 ? reveal : 0, seed: i, hot: 1.2, hotColor: acc },
      edge: 8 * hit(t, T(w.b) + 0.1, 0.3),
    });
  }
  ctx.cam2d();
}

// ── GPT：COSMOS 倍增宫格 ───────────────────────────────────────────────────
function cosmos(ctx) {
  const b = ctx.b, t = ctx.t;
  const D = Ctx.camDist(40);
  const inK = E.out3(seg(b, 32, 32.8));
  const outK = E.in3(seg(b, 35.4, 36));
  ctx.cam3d({ eye: [Math.sin(t * 0.7) * 120, 40, D * (1.02 - outK * 0.5)], at: [0, 0, 0], fov: 40 });
  const step = COSMOS.steps.reduce((a, s) => (b >= s.b ? s : a), COSMOS.steps[0]);
  const n = Math.round(Math.sqrt(step.n));
  const W = 1280, H = 720;
  const M = M4.trs((1 - inK) * 1400 + 170, 0, (1 - inK) * -600, 0, -0.16 * inK + 0.12 * Math.sin(t * 0.8) * 0.3, 0, 1 + 0.08 * seg(b, 32, 36), 1 + 0.08 * seg(b, 32, 36), 1);
  const acc = hex(ERAS[2].color);
  // 面板
  ctx.sprite({ m: M4.mul(M, M4.trs(0, 15, -1)), w: W + 14, h: H + 44, color: [0.035, 0.04, 0.05], alpha: 1 - outK, radius: 12, mode: 2 });
  const title = ctx.e.textTex('gpt-universe-30-change · COSMOS 从未知到寂静', { fam: 'mono', size: 17 });
  ctx.sprite({ m: M4.mul(M, M4.trs(-W / 2 + 20 + title.w / 2 - title.pad, H / 2 + 17, 0)), w: title.w, h: title.h, tex: title, mode: 1, color: [0.75, 0.78, 0.82], alpha: 1 - outK });
  const cw = W / n, ch = H / n;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const idx = r * n + c;
    const since = b - step.b;
    const d = (Math.abs(c - (n - 1) / 2) + Math.abs(r - (n - 1) / 2)) * 0.06;
    const pk = n === 1 ? 1 : E.outBack(seg(since, d, d + 0.45), 2.2);
    const clip = `grid-${String(idx % 16).padStart(2, '0')}`;
    const vid = ctx.video(clip, t - T(step.b) + idx * 0.13, true);
    const cx = -W / 2 + (c + 0.5) * cw, cy = H / 2 - (r + 0.5) * ch;
    ctx.sprite({ m: M4.mul(M, M4.trs(cx, cy, 1 + (1 - pk) * 80, 0, 0, 0, pk, pk, 1)), w: cw - 4, h: ch - 4, tex: vid,
      uv: ctx.coverUV(vid.w, vid.h, cw, ch), alpha: 1 - outK, radius: 3,
      glyph: { work: 'cosmos30', density: 'fine', amount: 1, reveal: E.io2(seg(since, d, d + 0.6)), seed: idx, hotColor: acc } });
  }
  ctx.cam2d();
  // ×30
  const lk = seg(b, 34, 34.6);
  if (lk > 0) {
    const a = E.out3(lk) * (1 - outK);
    const s = 1 + 0.4 * (1 - E.outExpo(lk));
    ctx.text('×30', { fam: 'barlow', size: 190, weight: 900 }, { x: 560, y: -300, s, alpha: a, color: acc });
    ctx.text('种画风，一支片', { fam: 'sans', size: 46 }, { x: 560, y: -410, alpha: a, color: WHITE });
  }
}

// ── GPT：十五个世界环绕摄像机 ─────────────────────────────────────────────
function ring(ctx, collapse) {
  const b = ctx.b, t = ctx.t;
  const R = 3300, N = WORLDS.n;
  const pw = 1280, ph = 720;
  const kf = (b - WORLDS.b0) / WORLDS.step;
  const j = clamp(Math.floor(kf), 0, N - 1);
  const fr = kf - Math.floor(kf);
  let yaw = (j + (kf >= N ? 0 : E.outExpo(seg(fr, 0, 0.55)))) * (2 * Math.PI) / N - (2 * Math.PI) / N;
  if (b < WORLDS.b0) yaw = -(2 * Math.PI) / N * (1 - E.out3(seg(b, 35.6, 36)));
  if (b >= WORLDS.b1) yaw = (N - 1) * (2 * Math.PI) / N + (b - WORLDS.b1) * 0.35 + E.in3(seg(b, 48, 51)) * 9;
  // 升起俯瞰
  const rise = E.io3(seg(b, 43.3, 46.5));
  const eye = [0, rise * 5600, rise * 5400];
  const look = [Math.sin(yaw) * R, 0, -Math.cos(yaw) * R];
  const at = [look[0] * (1 - rise), -rise * 500, look[2] * (1 - rise)];
  ctx.cam3d({ eye, at, fov: 24 + rise * 18 });
  for (let k = 0; k < N; k++) {
    const th = (k * 2 * Math.PI) / N;
    const cr = R * (1 - E.in3(collapse));
    const spin = collapse * collapse * 5;
    const x = Math.sin(th + spin) * cr, z = -Math.cos(th + spin) * cr;
    const s = 1 - E.in2(collapse) * 0.97;
    const active = b >= WORLDS.b0 && b < WORLDS.b1 && k === j ? 1 : 0;
    const vid = ctx.video(`bw${String(k).padStart(2, '0')}`, t - T(WORLDS.b0) + k * 0.2, true);
    const hk = b >= WORLDS.b0 ? E.io2(seg(b, WORLDS.b0 + k * WORLDS.step - 0.3, WORLDS.b0 + k * WORLDS.step + 0.25)) : 0;
    ctx.sprite({ m: M4.trs(x, 0, z, 0, -(th + spin), 0, s, s, 1), w: pw, h: ph, tex: vid, radius: 10,
      bright: 0.42 + 0.5 * Math.max(active, rise * 0.8),
      glyph: { work: 'beyond', density: 'coarse', amount: 1 - hk * (1 - collapse * 0.8), reveal: 0, seed: k },
      edge: 10 * active, edgeColor: hex(ERAS[2].color) });
  }
  ctx.cam2d();
  // 世界名
  if (b >= WORLDS.b0 && b < WORLDS.b1) {
    const lk = seg(fr, 0, 0.35);
    ctx.text(`WORLD ${String(j + 1).padStart(2, '0')} / 15`, { fam: 'mono', size: 22, spacing: 6 }, { x: 0, y: -400, alpha: 0.75, color: hex(ERAS[2].color) });
    ctx.text(scramble(WORLD_NAMES[j], lk, j, t * 30), { fam: 'barlow', size: 64, weight: 800, spacing: 6 }, { x: 0, y: -460, alpha: 1, color: WHITE });
    ctx.text('一个模型，十五个世界 · AI · BEYOND GENERATION', { fam: 'sans7', size: 22 }, { x: 0, y: 470, alpha: 0.6, color: WHITE });
  }
}

// ── 预告 OPUS：奇点 ────────────────────────────────────────────────────────
function singularity(ctx) {
  const b = ctx.b, t = ctx.t;
  const k = seg(b, PREDROP.collapse0, PREDROP.collapse1);
  if (k <= 0) return;
  // 汇聚光线
  for (let i = 0; i < 90; i++) {
    const a = hash(i, 1) * Math.PI * 2;
    const sp = 0.6 + hash(i, 2) * 1.4;
    const ph = (t * sp * 1.4 + hash(i, 3)) % 1;
    const r = (1 - ph) * 1400 * (1 - k * 0.5);
    const len = 60 + 380 * k * (1 - ph);
    ctx.rect({ x: Math.cos(a) * r, y: Math.sin(a) * r, w: len, h: 2, rz: a, color: [1, 0.62, 0.35], alpha: 0.35 * k * ph, blend: 'add' });
  }
  glow(ctx, 0, 0, 300 + 1400 * E.in3(k), [1, 0.55, 0.25], 0.5 * k);
  glow(ctx, 0, 0, 120 + 200 * k, WHITE, 0.9 * k);
}

export function eras(ctx) {
  const b = ctx.b, t = ctx.t;
  const P = ctx.post;
  P.bloom = 0.6; P.bloomThresh = 0.82; P.vignette = 0.7;
  const e = eraAt(b);
  if (b < 33.2) {
    const ec = hex(e.color);
    codePlane(ctx, { work: b < 24 ? 'kimi-beat' : 'ai-rise', alpha: 0.32 * (1 - E.in2(seg(b, 32, 33))), tint: [ec[0] * 0.5, ec[1] * 0.5, ec[2] * 0.5], speed: 1.5 });
    tower(ctx, 1);
  }
  if (b >= 32 && b < 36.2) cosmos(ctx);
  const collapse = seg(b, PREDROP.collapse0, PREDROP.collapse1);
  if (b >= 35.4 && b < PREDROP.vacuum) ring(ctx, collapse);
  // GPT 尾巴：中秋 / 月光信笺 在俯瞰环前弹出
  for (const g of GPT_TAIL) {
    if (b < g.b0 || b >= g.b1 + 0.3) continue;
    const vid = ctx.video(g.clip, t - T(g.b0));
    const pk = E.outBack(seg(b, g.b0, g.b0 + 0.45), 1.6), out = E.in2(seg(b, g.b1, g.b1 + 0.3));
    const W = g.vertical ? 380 : 1100, H = g.vertical ? 676 : 619;
    const M = M4.trs(g.vertical ? 560 : -60, g.vertical ? 0 : 30, 0, 0, 0, (g.vertical ? 0.05 : -0.02), pk * (1 - out), pk * (1 - out), 1);
    drawWindow(ctx, M, { tex: vid, w: W, h: H, title: g.vertical ? '月光信笺 · 竖屏' : `${BYKEY[g.work].title}`, accent: hex(ERAS[2].color),
      glyph: { work: g.work, density: 'coarse', amount: 1, reveal: E.io2(seg(b, g.b0, g.b0 + 0.5)) } });
  }
  singularity(ctx);
  // 时代卡 / 徽章 / 曲线
  for (const er of ERAS) if (b >= er.b0 && b < er.b0 + 3.5) eraCard(ctx, er);
  if (b < PREDROP.vacuum) {
    eraBadge(ctx, e, 1);
    curve(ctx, E.out2(seg(b, 16.5, 17.5)) * (1 - E.in2(seg(b, 50.5, 51))));
  }
  // 后期：时代冲击 + 奇点抖动
  const eh = Math.max(...ERAS.map((er) => hit(t, T(er.b0), 0.18)));
  P.ca = 0.0014 + eh * 0.006 + E.in3(collapse) * 0.02;
  P.flash = [eh * 0.12, eh * 0.12, eh * 0.14];
  const sh = E.in2(collapse) * 0.012 + eh * 0.006;
  P.shake = [Math.sin(t * 71) * sh, Math.cos(t * 83) * sh];
  P.zoom = 1 + E.in3(collapse) * 0.12;
  if (b >= PREDROP.vacuum) {
    // 半拍真空：全黑，只剩一个光标在呼吸
    P.bloom = 1.2;
    const pulse = 0.6 + 0.4 * Math.sin((b - PREDROP.vacuum) * Math.PI * 4);
    ctx.rect({ x: 0, y: 0, w: 18, h: 40, color: [1, 0.55, 0.25], alpha: pulse });
  }
  // 窗口入场的光边冲击
  for (const w of TOWER) P.flash[0] += hit(t, T(w.b), 0.06) * 0.03;
}
