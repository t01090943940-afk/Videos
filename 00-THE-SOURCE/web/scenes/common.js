// ─────────────────────────────────────────────────────────────────────────────
//  common.js · 场景共用：配色、作品表、窗口外框、标签、HUD
// ─────────────────────────────────────────────────────────────────────────────
import { clamp, seg, E, hash, hit, M4 } from '../lib/math.js';
import { T, ERAS } from '../../src/timeline.mjs';

export let WORKS = [];
export let BYKEY = {};
export async function loadWorks() {
  WORKS = await (await fetch('/00-THE-SOURCE/src/works.json')).json();
  BYKEY = Object.fromEntries(WORKS.map((w, i) => [w.key, { ...w, slot: i }]));
}

export const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
export const MODEL_COLOR = { KIMI: '#3CF0C8', SWE: '#7CC4FF', GPT: '#A98BFF', OPUS: '#FF7A3D', SKILL: '#FFD166' };
export const col = (model) => hex(MODEL_COLOR[model] || '#FFFFFF');
export const WHITE = [1, 1, 1];
export const INK = [0.05, 0.055, 0.07];
export const AMBER = hex('#FFB36B');

// 拍 → 本段局部进度
export const bp = (ctx, b0, b1) => seg(ctx.b, b0, b1);

// 解码式文字：字符在 settle 之前随机跳成源码里的字符
const SCR = '{}[]()<>=+-*/;:#$%&@!?_|~^01ABCDEFxyzfnrt';
export function scramble(str, k, seed, tick) {
  if (k >= 1) return str;
  return [...str].map((c, i) => {
    const th = (i + 1) / (str.length + 1);
    if (k > th * 0.9 + 0.1 * hash(i, seed)) return c;
    if (k < th * 0.6 - 0.1) return ' ';
    if (c === ' ') return c;
    return SCR[Math.floor(hash(i, seed, Math.floor(tick)) * SCR.length)];
  }).join('');
}

// 3D 窗口：暗色面板 + 标题栏 + 视频（可带代码字形）
//   M：窗口中心的模型矩阵；w,h：视频区尺寸
export function drawWindow(ctx, M, { tex, w, h, title = '', accent = WHITE, alpha = 1, glyph, bright = 1, edge = 0 }) {
  const bar = 30;
  const P = (x, y, z = 0) => M4.mul(M, M4.trs(x, y, z));
  ctx.sprite({ m: P(0, bar / 2, -1), w: w + 14, h: h + bar + 14, color: [0.035, 0.04, 0.05], alpha: alpha * 0.96, radius: 12, mode: 2 });
  ctx.sprite({ m: P(0, bar / 2, -0.5), w: w + 16, h: h + bar + 16, color: accent, alpha: alpha * 0.22, radius: 13, mode: 2, blend: 'add' });
  for (let i = 0; i < 3; i++) ctx.sprite({ m: P(-w / 2 + 14 + i * 20, h / 2 + bar / 2 + 2), w: 10, h: 10, radius: 5, mode: 2, color: i === 0 ? accent : [0.3, 0.32, 0.36], alpha });
  if (title) {
    const t = ctx.e.textTex(title, { fam: 'mono', size: 17 });
    ctx.sprite({ m: P(-w / 2 + 76 + t.w / 2 - t.pad, h / 2 + bar / 2 + 2), w: t.w, h: t.h, tex: t, mode: 1, color: [0.75, 0.78, 0.82], alpha });
  }
  ctx.sprite({ m: P(0, 0), w, h, tex, uv: ctx.coverUV(tex.w, tex.h, w, h), alpha, radius: 6, glyph, bright, edge, edgeColor: accent });
}

// 左下角镜头标签（作品名 / 技术点 / 源文件）
export function lowerThird(ctx, work, tag, src, k, alpha = 1) {
  const w = BYKEY[work];
  if (!w) return;
  const c = col(w.model);
  const x0 = -960 + 84, y0 = -540 + 138;
  const a = alpha * E.out3(k * 3);
  ctx.rect({ x: x0 + 3, y: y0 + 8, w: 6, h: 78 * E.out3(k * 4), color: c, alpha: a });
  ctx.text(w.title, { fam: 'sans', size: 46 }, { x: x0 + 24, y: y0 + 26, anchor: 0, alpha: a, color: WHITE });
  const tg = scramble(tag, clamp(k * 2.2), work.length, ctx.t * 30);
  ctx.text(tg, { fam: 'sans7', size: 24 }, { x: x0 + 26, y: y0 - 16, anchor: 0, alpha: a * 0.92, color: [0.86, 0.88, 0.9] });
  if (src) ctx.text('› ' + scramble(src, clamp(k * 1.6 - 0.2), 3, ctx.t * 30), { fam: 'mono', size: 17 }, { x: x0 + 26, y: y0 - 48, anchor: 0, alpha: a * 0.6, color: c });
}

// HUD：左上片名 + REC，右上时间码/帧号，底部 28 槽作品轨
export function hud(ctx, alpha, litUpTo) {
  if (alpha <= 0.01) return;
  const a = alpha * 0.8;
  const blink = Math.floor(ctx.t * 2) % 2 === 0 ? 1 : 0.35;
  ctx.rect({ x: -960 + 56, y: 540 - 50, w: 12, h: 12, radius: 6, color: [1, 0.25, 0.2], alpha: a * blink });
  ctx.text('源  THE SOURCE', { fam: 'mono', size: 18, spacing: 2 }, { x: -960 + 74, y: 540 - 50, anchor: 0, alpha: a });
  const f = String(Math.round(ctx.t * 120)).padStart(5, '0');
  ctx.text(`t = ${ctx.t.toFixed(3)} s   f ${f}   render(t)`, { fam: 'mono', size: 18 }, { x: 960 - 56, y: 540 - 50, anchor: 1, alpha: a * 0.85 });
  // 作品轨
  const n = WORKS.length, gap = 34, x0 = -(n - 1) * gap / 2, y = -540 + 40;
  for (let i = 0; i < n; i++) {
    const lit = litUpTo(WORKS[i].key);
    const c = lit > 0 ? col(WORKS[i].model) : [0.3, 0.3, 0.33];
    ctx.rect({ x: x0 + i * gap, y, w: 20, h: 4 + lit * 6, radius: 2, color: c, alpha: a * (0.45 + 0.55 * lit) });
  }
}

// 径向光晕纹理（一次生成）
export function glowTex(ctx) {
  const e = ctx.e;
  if (e._glow) return e._glow;
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,255,255,.45)');
  g.addColorStop(0.5, 'rgba(255,255,255,.1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  return (e._glow = e._makeTex(c));
}
export function glow(ctx, x, y, size, color, alpha, z = 0) {
  if (ctx.collecting) return;
  const t = glowTex(ctx);
  ctx.sprite({ x, y, z, w: size, h: size, tex: t, mode: 1, color, alpha, blend: 'add' });
}

// 竖直渐变遮罩纹理（上下淡出）
export function rampTex(ctx) {
  const e = ctx.e;
  if (e._ramp) return e._ramp;
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  return (e._ramp = e._makeTex(c));
}

export { clamp, seg, E, hash, hit, M4, T, ERAS };
