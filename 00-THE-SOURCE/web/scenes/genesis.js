// ─────────────────────────────────────────────────────────────────────────────
//  ACT 0 · 源（b0–16）
//  微距掠过一整面真实源码 →「一行代码，能走多远？」→ 敲下 opus-oneink/main.js 的第 2 行
//  → 回车：35 个字符炸成 5000+ 个字形粒子 → 拼成《AI 觉醒》第一帧（由它自己的源码字符组成）
//  → 从代码"解码"成真实画面
// ─────────────────────────────────────────────────────────────────────────────
import { GENESIS as G } from '../../src/timeline.mjs';
import { Ctx } from '../engine.js';
import { clamp, seg, E, hash, hit, M4, T, WHITE, glow } from './common.js';

let SWARM = null;

export function prepareGenesis(eng) {
  const page = eng.codePage(G.work, 'coarse');
  const [cols, rows] = page.cells;
  const data = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = page.grid[r][c];
      if (ch === ' ') continue;
      const ci = Math.min(95, Math.max(0, ch.charCodeAt(0) - 32));
      const li = Math.floor(hash(c, r, 5) * G.line.replace(/ /g, '').length);
      data.push(c, r, ci, li);
    }
  }
  // lineIdx 映射到行里非空格字符的真实位置
  const pos = [...G.line].map((c, i) => [c, i]).filter(([c]) => c !== ' ').map(([, i]) => i);
  for (let k = 3; k < data.length; k += 4) data[k] = pos[data[k]];
  SWARM = { data: new Float32Array(data), count: data.length / 4, cols, rows };
}

const SYN = (tok) => /^(const|let|var)$/.test(tok) ? [0.78, 0.57, 0.92] : /^\d+$/.test(tok) ? [0.97, 0.55, 0.42] : /^[=,;]$/.test(tok) ? [0.54, 0.87, 1] : [0.93, 0.94, 0.96];
function syntaxColors(line) {
  const out = [];
  const re = /(\w+|[^\w\s]|\s)/g;
  let m;
  while ((m = re.exec(line))) for (const _ of m[0]) out.push(SYN(m[0]));
  return out;
}

const MONO = { fam: 'mono', size: 60 };

// 贯穿开场的微距代码平面（分 28 条带：雾 + 一道移动的"读取光"）
export function codePlane(ctx, { work = 'oneink', alpha = 1, speed = 1, light = 1, tint = [0.62, 0.74, 0.9] } = {}) {
  const D = Ctx.camDist(40);
  const drift = ctx.t * 60 * speed;
  const eye = [Math.sin(ctx.t * 0.21) * 60, 60 + Math.sin(ctx.t * 0.33) * 12, 900];
  ctx.cam3d({ eye, at: [eye[0] * 0.3, -170, -900], fov: 44 });
  const page = ctx.e.codePage(work, 'coarse');
  const PW = 5200, PH = 2925, N = 28;
  const lightZ = -2900 + ((ctx.t * 420 * light) % 2600);
  const off = drift / PH;
  for (let i = 0; i < N; i++) {
    const v0 = i / N, v1 = (i + 1) / N;
    const zc = 400 - (i + 0.5) / N * PH;
    const dist = eye[2] - zc;
    const fog = clamp(1 - (dist - 300) / 2800) * clamp((dist - 60) / 250);
    const lit = Math.exp(-(((zc - lightZ) / 260) ** 2));
    const a = alpha * fog * (0.22 + 0.9 * lit);
    if (a < 0.004) continue;
    const c = [tint[0] + lit * 0.4, tint[1] + lit * 0.25, tint[2] + lit * 0.05];
    ctx.sprite({ m: M4.trs(0, -260, zc, -Math.PI / 2, 0, 0), w: PW, h: PH / N, tex: page, mode: 1,
      uv: [0, v0 + off, 1, v1 + off], color: c, alpha: a });
  }
  ctx.cam2d();
}

export function genesis(ctx) {
  const b = ctx.b, t = ctx.t;
  const P = ctx.post;
  P.bloom = 0.9; P.vignette = 0.85; P.grain = 0.05; P.bloomThresh = 0.55;
  // 背景代码平面：开场淡入，打字时压暗，回车后退场
  const planeA = E.out2(seg(b, 0, 2.2)) * (1 - 0.72 * E.io2(seg(b, 5.4, 6.4))) * (1 - E.in2(seg(b, 10, 12.5)));
  if (planeA > 0.003) codePlane(ctx, { alpha: planeA });

  // ── 提问 ─────────────────────────────────────────────────────────────────
  if (b >= G.q1.b - 0.2 && b < G.qOut + 1) {
    const out = E.in2(seg(b, G.qOut, G.qOut + 0.8));
    const full = G.q1.text + G.q2.text;
    const st = { fam: 'serif', size: 112, spacing: 6 };
    const n1 = [...G.q1.text].length;
    ctx.chars(full, st, { x: 0, y: 26, s: 1 + out * 0.06 }, (i) => {
      const b0 = i < n1 ? G.q1.b + i * 0.12 : G.q2.b + (i - n1) * 0.12;
      const k = E.out3(seg(b, b0, b0 + 0.7));
      if (k <= 0) return null;
      return { alpha: k * (1 - out), y: 26 + (1 - k) * -26, s: (1 + out * 0.06) * (1 + (1 - k) * 0.25), color: [1, 0.98, 0.95] };
    });
    // 冷光晕
    glow(ctx, 0, 26, 1500, [0.25, 0.35, 0.6], 0.18 * E.out2(seg(b, G.q1.b, G.q2.b + 1)) * (1 - out));
    const ek = seg(b, G.en.b, G.en.b + 1.2);
    if (ek > 0) {
      const s = scrambleLocal(G.en.text, ek, t);
      ctx.text(s, { fam: 'mono', size: 22, spacing: 9 }, { x: 0, y: -74, alpha: 0.72 * (1 - out) * E.out2(ek * 2), color: [0.72, 0.8, 0.95] });
    }
  }

  // ── 敲下一行真实代码 ─────────────────────────────────────────────────────
  const L = G.line;
  const adv = ctx.e.measure('0', MONO);
  const lineW = adv * L.length;
  const x0 = -lineW / 2, y0 = 0;
  if (b >= G.typeB0 - 0.6 && b < G.enter) {
    const k = seg(b, G.typeB0, G.typeB1);
    const n = Math.floor(k * L.length + 1e-6);
    const pin = E.out3(seg(b, G.typeB0 - 0.6, G.typeB0));
    const cols = syntaxColors(L);
    // 文件名 + 行号
    ctx.text(G.lineSrc, { fam: 'mono', size: 20, spacing: 1 }, { x: x0, y: y0 + 84, anchor: 0, alpha: 0.55 * pin, color: [1, 0.62, 0.35] });
    ctx.text('2', { fam: 'mono', size: 60 }, { x: x0 - 70, y: y0, anchor: 0, alpha: 0.28 * pin, color: WHITE });
    ctx.rect({ x: x0 - 26, y: y0, w: 2, h: 64, color: WHITE, alpha: 0.18 * pin });
    for (let i = 0; i < n; i++) {
      if (L[i] === ' ') continue;
      const age = (b - (G.typeB0 + (i / L.length) * (G.typeB1 - G.typeB0))) * 0.5;
      const pop = 1 + 0.35 * Math.exp(-age / 0.05);
      ctx.text(L[i], MONO, { x: x0 + (i + 0.5) * adv, y: y0, anchor: 0.5, color: cols[i], s: pop });
    }
    const typing = b < G.typeB1 + 0.1;
    const on = typing || Math.floor((b - G.typeB1) * 2) % 2 === 0;
    if (on) ctx.rect({ x: x0 + (n + 0.5) * adv, y: y0, w: adv * 0.92, h: 72, color: [1, 0.62, 0.35], alpha: 0.9 * pin });
    glow(ctx, x0 + n * adv, 0, 500, [1, 0.5, 0.2], 0.12 * pin);
  }

  // ── 回车：字符炸开，拼成第一帧 ──────────────────────────────────────────
  if (b >= G.swarmB0 && b < G.resolveB0 + 0.001) {
    const k = seg(b, G.swarmB0, G.swarmB1);
    const D = Ctx.camDist(40);
    const orbit = Math.sin(k * Math.PI) * 0.5;
    ctx.cam3d({ eye: [Math.sin(orbit) * D * 0.55, Math.sin(orbit) * 120, D * (0.6 + 0.4 * Math.cos(orbit))], at: [0, 0, 0], fov: 40 });
    const vid = ctx.video(G.clip, 0);
    ctx.instanced('swarm', {
      uVP: ctx.VP, uCells: [SWARM.cols, SWARM.rows], uGrid: [-960, 540, 1920 / SWARM.cols, 1080 / SWARM.rows],
      uLine0: [x0, y0], uCharW: adv, uLineLen: L.length, uT: k * 1.32, uGlyphCols: 16, uFont: 60,
      uVideo: vid, uVideoUV: [0, 0, 1, 1], uGlyphs: ctx.e.glyphs, __blend: 'normal',
    }, [{ data: SWARM.data, size: 4 }], SWARM.count);
    ctx.cam2d();
    P.flash = [hit(t, T(G.enter), 0.08) * 0.35, hit(t, T(G.enter), 0.08) * 0.3, hit(t, T(G.enter), 0.08) * 0.25];
    P.ca = 0.0012 + hit(t, T(G.enter), 0.2) * 0.01;
    P.shake = [Math.sin(t * 90) * hit(t, T(G.enter), 0.15) * 0.01, 0];
  }

  // ── 解码：代码字形 → 真实画面 ────────────────────────────────────────────
  if (b >= G.resolveB0 && b < G.resolveB1 + 0.5) {
    const vt = t - T(G.resolveB0);
    const tex = ctx.video(G.clip, vt);
    const r = E.io2(seg(b, G.resolveB0 + 0.1, G.resolveB1 - 0.3));
    ctx.sprite({ w: 1920, h: 1080, tex, glyph: { work: G.work, density: 'coarse', amount: 1, reveal: r, seed: 3 } });
  }
}

function scrambleLocal(str, k, t) {
  const CH = '01{}[]<>/=+#;:_';
  return [...str].map((c, i) => {
    const th = i / str.length;
    if (k > th * 0.8 + 0.2) return c;
    if (k < th * 0.8) return ' ';
    return c === ' ' ? c : CH[Math.floor(hash(i, Math.floor(t * 30)) * CH.length)];
  }).join('');
}
