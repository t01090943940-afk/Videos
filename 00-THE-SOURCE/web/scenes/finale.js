// ─────────────────────────────────────────────────────────────────────────────
//  ACT 4–7 · 凝视 → 通通开源 → 里面 → 下一行（b90–132）
// ─────────────────────────────────────────────────────────────────────────────
import { SILENCE, REVEAL, INSIDE, OUTRO } from '../../src/timeline.mjs';
import { clamp, seg, E, hash, hit, M4, T, WHITE, hex, glow, scramble, WORKS, col, rampTex } from './common.js';

const ORANGE = hex('#FF7A3D'), AMB = hex('#FFB36B');

// ── ACT 4 · 凝视 ───────────────────────────────────────────────────────────
export function silence(ctx) {
  const t = ctx.t, b = ctx.b, P = ctx.post;
  P.letterbox = E.io3(seg(b, 90, 90.6)); P.bloom = 0.5; P.grain = 0.06; P.vignette = 0.8;
  const beat = Math.max(...[91, 93, 95].map((x) => hit(t, T(x), 0.12) + hit(t, T(x + 0.35), 0.12) * 0.7));
  P.exposure = 1 + beat * 0.08;
  for (const L of SILENCE.lines) {
    if (b < L.b0 || b > L.b1 + 0.5) continue;
    const k = E.out3(seg(b, L.b0, L.b0 + 0.8));
    const last = L === SILENCE.lines[2];
    const o = last ? E.in3(seg(b, 97.6, 98)) : E.in2(seg(b, L.b1 - 0.1, L.b1 + 0.3));
    const s = last ? 1 + 0.03 * seg(b, L.b0, 97.6) - 0.12 * o : 1 + 0.02 * seg(b, L.b0, L.b1);
    ctx.chars(L.text, { fam: 'serifvf', size: 92, weight: 700, spacing: 12 }, { x: 0, y: 10, s }, (i) => {
      const kk = E.out3(seg(b, L.b0 + i * 0.06, L.b0 + i * 0.06 + 0.9));
      return { alpha: kk * (1 - o), y: 10 - (1 - kk) * 16, color: [0.96, 0.95, 0.93] };
    });
    if (last) glow(ctx, 0, 10, 1400, AMB, 0.08 * k * (1 - o));
  }
}

// ── ACT 5 · 通通开源 ───────────────────────────────────────────────────────
const TILE = 24;
const CX = [-1.5, -0.5, 0.5, 1.5].map((k) => k * 410);
const HERO = [25, 3]; // 「源」字里的一格
function mosaicMask(ctx, chars, sizes, alphaFn) {
  return ctx.layer((c) => {
    chars.forEach((ch, i) => {
      const a = alphaFn(i);
      if (a <= 0) return;
      c.text(ch.c, { fam: 'sans', size: sizes }, { x: ch.x, y: ch.y, s: ch.s, alpha: a, color: WHITE });
    });
  });
}

export function reveal(ctx) {
  const t = ctx.t, b = ctx.b, P = ctx.post;
  P.bloom = 0.95; P.bloomThresh = 0.8; P.vignette = 0.7; P.grain = 0.045;
  const slams = REVEAL.b.map((x) => T(x));
  const last = slams.filter((s) => t >= s).pop() ?? slams[0];
  const mask = mosaicMask(ctx, REVEAL.chars.map((c, i) => {
    const k = E.outExpo(seg(t, slams[i], slams[i] + 0.2));
    return { c, x: CX[i], y: 40, s: 1 + 0.6 * (1 - k) };
  }), 380, (i) => (t >= slams[i] ? 1 : 0));
  // 推进：指数推焦到「源」字里的一格 → 换成《一畫》高清原片 → 退化成它的源码
  const pk = E.io3(seg(b, REVEAL.push0, 107.3));
  const Zmax = (1920 / TILE) * 1.02;
  let zoom = (1 + 0.04 * seg(b, 98, 103)) * Zmax ** pk * 4 ** E.in3(seg(b, 107, 108));
  const tgt = [(HERO[0] + 0.5) * TILE, (HERO[1] + 0.5) * TILE * 9 / 16];
  const sK = E.io2(seg(b, REVEAL.push0, 107));
  const cam = [tgt[0] - (tgt[0] * (1 - sK)) / (zoom / (1 + 0.04 * seg(b, 98, 103))), tgt[1] - (tgt[1] * (1 - sK)) / (zoom / (1 + 0.04 * seg(b, 98, 103)))];
  const hot = Math.max(...slams.map((s) => hit(t, s, 0.18)));
  const hero = ctx.video(REVEAL.heroClip, t - T(REVEAL.push0), true);
  ctx.full('mosaic', {
    uAtlas: ctx.e.atlas, uMask: mask, uHero: hero, uCode: ctx.e.codePage(REVEAL.heroWork, 'coarse'),
    uCam: cam, uZoom: zoom, uTile: TILE, uTime: t, uDim: 0.1 + 0.06 * seg(b, 101, 102), uHot: hot,
    uHeroMix: E.io2(seg(Math.log(zoom), Math.log(6), Math.log(28))), uGlyph: E.io2(seg(b, 106.2, 107.4)),
    uRipple: hit(t, last, 0.5), uRippleT: (t - last) * 1.8, uRippleC: [CX[slams.indexOf(last)], 40], uHeroTile: HERO, uAtlasGrid: ctx.e.atlasGrid, uCells: [120, 45],
    __blend: 'normal',
  });
  // 字的白热核（仅砸下瞬间）
  REVEAL.chars.forEach((c, i) => {
    const h = hit(t, slams[i], 0.1);
    if (h > 0.02 && b < REVEAL.push0) ctx.text(c, { fam: 'sans', size: 380 }, { x: CX[i], y: 40, s: 1.02, alpha: h * 0.45, color: [1, 0.9, 0.75], blend: 'add' });
  });
  // 文案
  const tk = seg(b, REVEAL.en.b, REVEAL.en.b + 1.2), to = E.in2(seg(b, REVEAL.push0, REVEAL.push0 + 0.6));
  if (tk > 0 && to < 1) {
    ctx.text(scramble(REVEAL.en.text, tk, 11, t * 30), { fam: 'mono', size: 40, spacing: 16 }, { x: 0, y: -250, alpha: (1 - to), color: AMB });
    ctx.text('28 部代码视频 · 源码 · 复盘 · 一个不留', { fam: 'sans7', size: 30, spacing: 4 }, { x: 0, y: -312, alpha: 0.8 * E.out2(seg(b, 102.6, 103.4)) * (1 - to), color: WHITE });
  }
  if (b < 102 + 0.8) ctx.text('AI-CODING  SUPERVIDEOS', { fam: 'mono', size: 22, spacing: 12 }, { x: 0, y: 330, alpha: 0.65 * E.out2(seg(b, 98.2, 99)) * (1 - to), color: WHITE });
  P.flash = [hot * 0.35, hot * 0.3, hot * 0.25];
  P.ca = 0.0015 + hot * 0.02 + E.in3(seg(b, 106.8, 108)) * 0.012;
  const sh = hot * 0.016;
  P.shake = [Math.sin(t * 93) * sh, Math.cos(t * 81) * sh];
  P.zoom = 1 + hot * 0.04;
}

// ── ACT 6 · 里面 ───────────────────────────────────────────────────────────
const MODEL_OF = (folder) => folder.startsWith('kimi') ? 'KIMI' : folder.startsWith('swe') ? 'SWE' : folder.startsWith('gpt') ? 'GPT' : folder.startsWith('skill') ? 'SKILL' : 'OPUS';
let TREE_TEX = null;
function treeTextures(ctx) {
  if (TREE_TEX) return TREE_TEX;
  const tree = ctx.e.tree;
  const NC = 6, per = Math.ceil(tree.length / NC), LH = 30;
  TREE_TEX = [];
  for (let k = 0; k < NC; k++) {
    const c = document.createElement('canvas'); c.width = 1024; c.height = per * LH + 20;
    const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
    x.font = '500 21px Plex'; x.textBaseline = 'middle';
    tree.slice(k * per, (k + 1) * per).forEach((p, i) => {
      const [folder, ...rest] = p.split('/');
      const cc = { KIMI: '#3CF0C8', SWE: '#7CC4FF', GPT: '#A98BFF', OPUS: '#FF7A3D', SKILL: '#FFD166' }[MODEL_OF(folder)];
      x.fillStyle = cc; x.globalAlpha = 0.85;
      x.fillText(folder + '/', 12, 10 + i * LH + LH / 2);
      const w = x.measureText(folder + '/').width;
      x.fillStyle = '#E8ECF2'; x.globalAlpha = 1;
      x.fillText(rest.join('/'), 12 + w, 10 + i * LH + LH / 2);
    });
    const tx = ctx.e._makeTex(c, { mip: true, wrap: 'repeat' });
    tx.h = c.height;
    TREE_TEX.push(tx);
  }
  return TREE_TEX;
}

function waterfall(ctx, alpha) {
  const t = ctx.t, b = ctx.b;
  const tex = treeTextures(ctx);
  ctx.cam3d({ eye: [Math.sin(t * 0.3) * 80, 520, 1100], at: [0, -200, -1800], fov: 50 });
  const NC = tex.length, cw = 1050, L = 5200, N = 20;
  const scroll = (t - T(INSIDE.b0)) * 0.09 + 0.3 * E.out3(seg(b, 108, 109));
  for (let k = 0; k < NC; k++) {
    const x = (k - (NC - 1) / 2) * cw;
    const texh = tex[k].h;
    const vspan = (L / cw) * (1024 / texh);
    for (let i = 0; i < N; i++) {
      const z0 = 600 - (i / N) * L, z1 = 600 - ((i + 1) / N) * L;
      const zc = (z0 + z1) / 2;
      const dist = 1100 - zc;
      const fog = clamp(1 - (dist - 900) / 4200) * clamp((dist - 200) / 400);
      const a = alpha * fog;
      if (a < 0.01) continue;
      const v0 = scroll * (k % 2 ? 1.15 : 1) + (i / N) * vspan, v1 = v0 + vspan / N;
      ctx.sprite({ m: M4.trs(x, -300, zc, -Math.PI / 2, 0, 0), w: cw - 30, h: L / N, tex: tex[k], uv: [0, 1 - v1, 1, 1 - v0], alpha: a, blend: 'add' });
    }
  }
  ctx.cam2d();
}

// 经验标题：真实 CoExp 标题卡片迎面飞来
function lessons(ctx, alpha) {
  const t = ctx.t, b = ctx.b;
  const heads = ctx.e.heads;
  ctx.cam3d({ eye: [0, 0, 1483.6], at: [0, 0, 0], fov: 40 });
  const n = 26;
  const items = [];
  for (let i = 0; i < n; i++) {
    const h = heads[Math.floor(hash(i, 31) * heads.length)];
    const sp = 0.55 + hash(i, 2) * 0.3;
    const ph = ((t - T(INSIDE.b0)) * sp + hash(i, 3)) % 1.4;
    const z = -7000 + ph * 7800;
    const x = (hash(i, 4) - 0.5) * 3400, y = (hash(i, 5) - 0.5) * 1700;
    items.push({ h, z, x, y, i });
  }
  items.sort((a, c) => a.z - c.z);
  for (const it of items) {
    const f = clamp((it.z + 7000) / 2500) * clamp((1300 - it.z) / 500);
    const a = alpha * f;
    if (a < 0.02) continue;
    const w = BYW(it.h.w);
    const tx = ctx.e.textTex(it.h.h, { fam: 'sans7', size: 30 });
    ctx.sprite({ x: it.x, y: it.y, z: it.z, w: tx.w + 30, h: tx.h + 6, radius: 8, color: [0.05, 0.06, 0.08], alpha: a * 0.8, mode: 2 });
    ctx.sprite({ x: it.x - tx.w / 2 - 10, y: it.y, z: it.z + 1, w: 5, h: tx.h - 20, color: w, alpha: a, mode: 2 });
    ctx.sprite({ x: it.x + 6, y: it.y, z: it.z + 1, w: tx.w, h: tx.h, tex: tx, mode: 1, color: WHITE, alpha: a });
  }
  ctx.cam2d();
}
const BYW = (folder) => hex({ KIMI: '#3CF0C8', SWE: '#7CC4FF', GPT: '#A98BFF', OPUS: '#FF7A3D', SKILL: '#FFD166' }[MODEL_OF(folder)]);

const fmt = (n, f) => (f === ',' ? Math.floor(n).toLocaleString('en-US') : String(Math.floor(n)));

export function inside(ctx) {
  const t = ctx.t, b = ctx.b, P = ctx.post;
  P.bloom = 0.8; P.bloomThresh = 0.75; P.vignette = 0.85;
  const urlK = E.io3(seg(b, INSIDE.url.b0, INSIDE.url.b0 + 0.8));
  const bgA = E.out2(seg(b, 108, 108.6)) * (1 - 0.65 * urlK) * (1 - E.in2(seg(b, 119.2, 120)));
  waterfall(ctx, bgA * 0.75);
  lessons(ctx, bgA * (1 - urlK) * E.out2(seg(b, 108.5, 110)));
  // 暗化中心，衬托数字
  ctx.sprite({ x: -560, y: 0, w: 1300, h: 1300, tex: null, mode: 2, color: [0, 0, 0], alpha: 0 });
  // 计数器
  INSIDE.counters.forEach((c, i) => {
    const k = seg(t, T(c.b), T(c.b) + 1.0);
    if (k <= 0) return;
    const v = c.num * E.outExpo(k);
    const e = E.out3(seg(t, T(c.b), T(c.b) + 0.3));
    // 位置：先竖排在左侧，URL 出现时收成顶部一行
    const yA = 300 - i * 170, xA = -820;
    const xB = -720 + i * 480, yB = 390;
    const x = xA + (xB - xA) * urlK, y = yA + (yB - yA) * urlK;
    const s = 1 - 0.5 * urlK;
    const num = fmt(v, c.fmt);
    ctx.text(num, { fam: 'barlow', size: 130, weight: 900 }, { x, y: y + 10, anchor: urlK > 0.5 ? 0.5 : 0, s: s * (1 + 0.2 * (1 - e)), alpha: e, color: WHITE });
    const nw = ctx.e.measure(fmt(c.num, c.fmt), { fam: 'barlow', size: 130, weight: 900 }) * s;
    const ux = urlK > 0.5 ? x : x + nw + 26 * s;
    const uy = urlK > 0.5 ? y - 80 * s : y + 22;
    ctx.text(c.unit, { fam: 'sans', size: 40 }, { x: ux, y: uy, anchor: urlK > 0.5 ? 0.5 : 0, s: s * 1.1, alpha: e, color: WHITE });
    ctx.text(c.en, { fam: 'mono', size: 18, spacing: 6 }, { x: ux + (urlK > 0.5 ? 0 : 2), y: uy - 42 * s, anchor: urlK > 0.5 ? 0.5 : 0, alpha: 0.7 * e, color: AMB });
    glow(ctx, x + (urlK > 0.5 ? 0 : 150), y, 700, ORANGE, 0.14 * hit(t, T(c.b), 0.4));
  });
  // 仓库地址
  if (b >= INSIDE.url.b0) {
    const U = INSIDE.url.text;
    const MON = { fam: 'mono', size: 66 };
    const adv = ctx.e.measure('0', MON);
    const x0 = -(U.length * adv) / 2, y = -40;
    const n = U.split('').filter((_, i) => b >= INSIDE.url.b0 + 0.25 + i * 0.045).length;
    ctx.text('$ git clone https://', { fam: 'mono', size: 26, spacing: 2 }, { x: x0, y: y + 78, anchor: 0, alpha: 0.6 * urlK, color: AMB });
    for (let i = 0; i < n; i++) {
      const age = b - (INSIDE.url.b0 + 0.25 + i * 0.045);
      ctx.text(U[i], MON, { x: x0 + (i + 0.5) * adv, y, anchor: 0.5, s: 1 + 0.4 * Math.exp(-age / 0.06), color: i < 10 ? [0.8, 0.84, 0.9] : WHITE });
    }
    const blink = Math.floor(b * 2) % 2 === 0 || n < U.length;
    if (blink) ctx.rect({ x: x0 + (n + 0.5) * adv, y, w: adv * 0.9, h: 76, color: ORANGE, alpha: 0.95 });
    const lk = E.io3(seg(b, 116.6, 117.4));
    ctx.rect({ x: 0, y: y - 60, w: U.length * adv * lk, h: 3, color: ORANGE, alpha: 1 });
    ctx.rect({ x: 0, y: y - 60, w: U.length * adv * lk, h: 18, color: ORANGE, alpha: 0.25, blend: 'add' });
    glow(ctx, 0, y, 2200, ORANGE, 0.12 * urlK);
    const tg = E.out3(seg(b, 117, 117.8));
    ctx.text(INSIDE.url.tagline, { fam: 'sans', size: 44, spacing: 8 }, { x: 0, y: y - 140, alpha: tg, color: WHITE, s: 1 + 0.08 * (1 - tg) });
    ctx.text('全部开源  ·  OPEN SOURCE', { fam: 'mono', size: 20, spacing: 8 }, { x: 0, y: y - 210, alpha: 0.6 * tg, color: AMB });
  }
  const hb = Math.max(hit(t, T(INSIDE.b0), 0.3), hit(t, T(INSIDE.url.b0), 0.2) * 0.6, ...INSIDE.counters.map((c) => hit(t, T(c.b), 0.1) * 0.4));
  P.flash = [hb * 0.25, hb * 0.2, hb * 0.18];
  P.ca = 0.0015 + hb * 0.01;
  P.shake = [Math.sin(t * 90) * hb * 0.006, 0];
  P.fade = E.in2(seg(b, 119.4, 120));
}

// ── ACT 7 · 下一行 ─────────────────────────────────────────────────────────
const STROBE = ['h14', 'h13', 'h12', 'h11', 'h10', 'h09', 'h08', 'h07', 'h06', 'h05', 'h04', 'h03', 'h02', 'h01',
  'g08', 'g07', 'bw12', 'bw11', 'bw06', 'bw03', 'bw01', 'w10', 'w08', 'w07', 'w06', 'w05', 'w01', 'w03'];

export function outro(ctx) {
  const t = ctx.t, b = ctx.b, P = ctx.post;
  P.bloom = 0.7; P.bloomThresh = 0.75; P.vignette = 0.9; P.grain = 0.05;
  if (b < OUTRO.enter) {
    const Ttx = OUTRO.text;
    const st = { fam: 'serifvf', size: 76, weight: 700, spacing: 6 };
    const n = [...Ttx].filter((_, i) => b >= OUTRO.typeB0 + (i * (OUTRO.typeB1 - OUTRO.typeB0)) / Ttx.length).length;
    const shown = [...Ttx].slice(0, n).join('');
    const full = ctx.e.measure(Ttx, st);
    const x0 = -full / 2 + 60;
    const pin = E.out3(seg(b, 120, 120.5));
    ctx.text('45,559', { fam: 'mono', size: 40 }, { x: x0 - 70, y: 0, anchor: 1, alpha: 0.35 * pin, color: WHITE });
    ctx.rect({ x: x0 - 40, y: 0, w: 2, h: 90, color: WHITE, alpha: 0.2 * pin });
    ctx.text('// 第 45,559 行 · 留给你', { fam: 'sans7', size: 24 }, { x: x0, y: 92, anchor: 0, alpha: 0.5 * pin, color: AMB });
    const w = shown ? ctx.e.measure(shown, st) : 0;
    if (shown) ctx.text(shown, st, { x: x0, y: 0, anchor: 0, color: WHITE });
    const on = b < OUTRO.typeB1 + 0.1 || Math.floor(b * 2) % 2 === 0;
    if (on) ctx.rect({ x: x0 + w + 22, y: 0, w: 34, h: 84, color: ORANGE, alpha: pin });
    glow(ctx, x0 + w, 0, 700, ORANGE, 0.1 * pin);
    return;
  }
  // 回车：28 部作品倒带闪回
  if (b < OUTRO.strobe1) {
    const k = seg(b, OUTRO.strobe0, OUTRO.strobe1);
    const i = Math.min(STROBE.length - 1, Math.floor(E.in2(k) * STROBE.length));
    const clip = STROBE[i];
    const vid = ctx.video(clip, 0.45);
    ctx.sprite({ w: 1920, h: 1080, tex: vid, uv: ctx.coverUV(vid.w, vid.h, 1920, 1080, 1.05 + 0.1 * k), rgb: 0.02 });
    P.ca = 0.01; P.flash = [hit(t, T(OUTRO.enter), 0.06) * 0.8, hit(t, T(OUTRO.enter), 0.06) * 0.8, hit(t, T(OUTRO.enter), 0.06) * 0.8];
    P.shake = [Math.sin(t * 70) * 0.006, Math.cos(t * 60) * 0.004];
    return;
  }
  // 片名：「源」由作品帧拼成
  const k = seg(b, OUTRO.title, OUTRO.title + 1.5);
  const tt = T(OUTRO.title);
  const mask = mosaicMask(ctx, [{ c: '源', x: 0, y: 120, s: 1 + 0.25 * (1 - E.outExpo(seg(t, tt, tt + 0.3))) }], 560, () => 1);
  ctx.full('mosaic', {
    uAtlas: ctx.e.atlas, uMask: mask, uHero: ctx.e.black, uCode: ctx.e.black, uCam: [0, 0], uZoom: 1 + 0.05 * seg(b, OUTRO.title, OUTRO.b1),
    uTile: 16, uTime: t, uDim: 0.035, uHot: hit(t, tt, 0.25), uHeroMix: 0, uGlyph: 0, uRipple: hit(t, tt, 0.8), uRippleT: (t - tt) * 1.2, uRippleC: [0, 120],
    uHeroTile: [-999, -999], uAtlasGrid: ctx.e.atlasGrid, uCells: [1, 1], __blend: 'normal',
  });
  const a1 = E.out3(seg(b, OUTRO.title + 0.4, OUTRO.title + 1.2));
  ctx.chars('THE SOURCE', { fam: 'barlow', size: 70, weight: 900, spacing: 34 }, { x: 0, y: -250 }, (i) => {
    const kk = E.out3(seg(b, OUTRO.title + 0.3 + i * 0.04, OUTRO.title + 0.9 + i * 0.04));
    return { alpha: kk, y: -250 - (1 - kk) * 30, color: WHITE };
  });
  ctx.text('AI-CODING SUPERVIDEOS  ·  28 部代码视频  ·  通通开源', { fam: 'sans7', size: 28, spacing: 4 }, { x: 0, y: -326, alpha: 0.85 * a1, color: WHITE });
  ctx.text(INSIDE.url.text, { fam: 'mono', size: 24, spacing: 2 }, { x: 0, y: -376, alpha: 0.8 * a1, color: AMB });
  const ck = E.out2(seg(b, OUTRO.creditsB, OUTRO.creditsB + 1));
  OUTRO.credits.forEach((c, i) => ctx.text(c, { fam: 'sans7', size: 19, spacing: 2 }, { x: 0, y: -450 - i * 32, alpha: 0.5 * ck, color: WHITE }));
  const h = hit(t, tt, 0.25);
  P.flash = [h * 0.5, h * 0.42, h * 0.35];
  P.ca = 0.0015 + h * 0.015;
  P.shake = [Math.sin(t * 80) * h * 0.012, Math.cos(t * 70) * h * 0.01];
  P.fade = E.io2(seg(b, OUTRO.fade0, OUTRO.b1 - 0.2));
}
