// ─────────────────────────────────────────────────────────────────────────────
//  ACT 3 · 全部（b72–90）
//  336 格 = 28 部作品 × 各 12 帧，贴在一颗球的内壁上。摄像机从球心出发 → 穿过球壳 →
//  看见整颗"作品之球"在转 → 球摊开成一面 24×14 的墙 → 整面墙从左到右退回成源码。
// ─────────────────────────────────────────────────────────────────────────────
import { ORB, ORB_TEXT } from '../../src/timeline.mjs';
import { clamp, seg, E, hash, hit, M4, T, WHITE, hex, glow, scramble } from './common.js';

const N = 336, R = 1500;
let SPH = null, WALLP = null;
function prep() {
  if (SPH) return;
  SPH = []; WALLP = [];
  const order = [...Array(N).keys()].sort((a, b) => hash(a, 77) - hash(b, 77));
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let k = 0; k < N; k++) {
    const i = order[k];
    const y = 1 - (k + 0.5) / N * 2, r = Math.sqrt(1 - y * y), th = ga * k;
    SPH[i] = [Math.cos(th) * r, y, Math.sin(th) * r];
  }
  const order2 = [...Array(N).keys()].sort((a, b) => hash(a, 91) - hash(b, 91));
  for (let k = 0; k < N; k++) {
    const i = order2[k], c = k % ORB.cols, r = Math.floor(k / ORB.cols);
    WALLP[i] = [(c - (ORB.cols - 1) / 2) * 168, ((ORB.rows - 1) / 2 - r) * 98, c, r];
  }
}

export function orb(ctx) {
  prep();
  const t = ctx.t, b = ctx.b;
  const P = ctx.post;
  P.bloom = 0.75; P.bloomThresh = 0.7; P.vignette = 0.75;
  const spin = t * 0.35;
  const cs = Math.cos(spin), sn = Math.sin(spin);
  // 相机
  const exit = E.io3(seg(b, ORB.exit, ORB.full));
  const unfold = E.io3(seg(b, ORB.unfold0 - 0.2, ORB.wall + 0.3));
  const orbitA = 0.25 * Math.sin(t * 0.4);
  let eye = [Math.sin(orbitA) * 5400 * exit, 700 * exit * (1 - unfold), Math.cos(orbitA) * 5400 * exit + 1];
  let at = [0, 0, 0];
  if (exit < 0.02) { // 球内：原地环视
    const yaw = t * 0.55;
    eye = [0, 0, 1];
    at = [Math.sin(yaw) * 100, Math.sin(t * 0.8) * 20, -Math.cos(yaw) * 100 + 1];
  } else if (exit < 1) {
    const yaw = t * 0.55;
    const fwd = [Math.sin(yaw), 0, -Math.cos(yaw)];
    at = [fwd[0] * 100 * (1 - exit), 0, fwd[2] * 100 * (1 - exit)];
  }
  const wallDist = 3115 * (1 - 0.1 * E.io2(seg(b, ORB.wall, ORB.decay0 + 1)) - 0.25 * E.in3(seg(b, 89, 90)));
  eye = eye.map((v, k) => v * (1 - unfold) + [0, 0, wallDist][k] * unfold);
  at = at.map((v) => v * (1 - unfold));
  const fov = exit < 0.02 ? 70 : 70 - 30 * exit;
  ctx.cam3d({ eye, at, fov: fov * (1 - unfold) + 40 * unfold });
  // 球心光
  glow(ctx, 0, 0, 2400 * (1 - unfold), hex('#FF9A55'), 0.35 * (1 - unfold) * E.in2(seg(b, ORB.exit + 0.8, ORB.full)), 0);
  // 实例数据
  const A = new Float32Array(N * 4), B = new Float32Array(N * 4), C = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    const [sx, sy, sz] = SPH[i];
    const rx = sx * cs - sz * sn, rz = sx * sn + sz * cs;
    const p0 = [rx * R, sy * R, rz * R];
    const yaw0 = Math.atan2(rx, rz), pitch0 = -Math.asin(sy);
    const [wx, wy, wc, wr] = WALLP[i];
    const d = hash(i, 5) * 0.8;
    const m = E.io3(seg(b, ORB.unfold0 + d, ORB.unfold0 + d + 2.2));
    const lift = Math.sin(m * Math.PI) * 600;
    A[i * 4] = p0[0] + (wx - p0[0]) * m;
    A[i * 4 + 1] = p0[1] + (wy - p0[1]) * m;
    A[i * 4 + 2] = p0[2] + (0 - p0[2]) * m + lift;
    const pop = E.outBack(seg(b, 72 + hash(i, 8) * 1.2, 72.6 + hash(i, 8) * 1.2), 2);
    A[i * 4 + 3] = (1 + 1.1 * (1 - exit)) * pop;
    // 朝向插值（最短角）
    let dy = (0 - yaw0); dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    B[i * 4] = yaw0 + dy * m;
    B[i * 4 + 1] = pitch0 * (1 - m);
    B[i * 4 + 2] = i;
    const dc = seg(b, ORB.decay0 + (wc / ORB.cols) * 1.1, ORB.decay0 + (wc / ORB.cols) * 1.1 + 0.5);
    const dead = E.in2(seg(b, 89.2 + (wr / ORB.rows) * 0.3, 89.9));
    B[i * 4 + 3] = (0.9 + 0.35 * hit(t, T(ORB.wall) + (Math.abs(wc - 11.5) + Math.abs(wr - 6.5)) * 0.02, 0.15)) * (1 - dead);
    C[i * 2] = dc;
    C[i * 2 + 1] = (1 - m) * 0;
  }
  ctx.instanced('tiles', {
    uVP: ctx.VP, uTileSize: [160, 90], uAtlas: ctx.e.atlas, uCode: ctx.e.codePage('ageint', 'tile'), uAtlasGrid: ctx.e.atlasGrid,
    uTime: t, uEdgeCol: [0.25, 0.18, 0.12], __blend: 'normal',
  }, [{ data: A, size: 4 }, { data: B, size: 4 }, { data: C, size: 2 }], N);
  ctx.cam2d();
  // 文案
  for (const tx of ORB_TEXT) {
    if (b < tx.b0 || b > tx.b1 + 0.4) continue;
    const k = E.out3(seg(b, tx.b0, tx.b0 + 0.6)), o = E.in2(seg(b, tx.b1, tx.b1 + 0.4));
    const y = tx.b0 < 84 ? -390 : 420;
    ctx.text(tx.big, { fam: 'sans', size: 92, spacing: 4 }, { x: 0, y, alpha: k * (1 - o), color: WHITE, s: 1 + (1 - k) * 0.15 });
    ctx.text(scramble(tx.en, seg(b, tx.b0 + 0.2, tx.b0 + 1.2), 4, t * 30), { fam: 'mono', size: 22, spacing: 7 }, { x: 0, y: y - 72, alpha: 0.75 * (1 - o), color: hex('#FFB36B') });
  }
  if (b >= ORB.wall && b < ORB.decay0 + 1) {
    const k = E.out3(seg(b, ORB.wall + 0.3, ORB.wall + 1));
    ctx.text('28 WORKS  ×  12 FRAMES  =  336 LIVE TILES', { fam: 'mono', size: 20, spacing: 6 }, { x: 0, y: -440, alpha: 0.6 * k * (1 - seg(b, ORB.decay0, ORB.decay0 + 1)), color: WHITE });
  }
  // 冲击
  const hb = Math.max(hit(t, T(ORB.b0), 0.35), hit(t, T(ORB.wall), 0.25) * 0.6);
  P.flash = [hb * 0.5, hb * 0.45, hb * 0.4];
  P.ca = 0.0015 + hb * 0.012 + E.in3(seg(b, 88.5, 90)) * 0.015;
  const sh = hb * 0.012 + E.in3(seg(b, 88.5, 90)) * 0.008;
  P.shake = [Math.sin(t * 91) * sh, Math.cos(t * 79) * sh];
  P.zoom = 1 + E.in3(seg(b, 89, 90)) * 0.1;
}
