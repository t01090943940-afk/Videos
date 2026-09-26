// 0–20s · Cold open + the hand-drawn era: an idea, and the mountain between it and reality.
import {
  W, H, C, F, clamp, lerp, prog, ease, hash, hs, noise1, text, typeText, sketchPoly, sketchCircle, hatch,
  rotY, rotX, fillBg, roundRect, measure,
} from './core.js';

// ---------- paper texture (generated once) ----------
let paperTex = null;
function paper() {
  if (paperTex) return paperTex;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 90000; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * H, a = hash(i, 3);
    g.fillStyle = a > 0.5 ? `rgba(90,70,40,${0.035 * hash(i, 4)})` : `rgba(255,255,255,${0.12 * hash(i, 5)})`;
    g.fillRect(x, y, 1 + hash(i, 6) * 1.6, 1 + hash(i, 7) * 1.6);
  }
  for (let i = 0; i < 700; i++) {
    const x = hash(i, 11) * W, y = hash(i, 12) * H, a = hash(i, 13) * Math.PI, l = 6 + hash(i, 14) * 22;
    g.strokeStyle = `rgba(120,95,60,${0.05 + hash(i, 15) * 0.05})`;
    g.lineWidth = 0.6;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 3, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  // faint sketchbook dot grid
  g.fillStyle = 'rgba(60,90,120,0.10)';
  for (let x = 40; x < W; x += 48) for (let y = 36; y < H; y += 48) g.fillRect(x, y, 2, 2);
  paperTex = c;
  return c;
}
export function drawPaper(ctx) { ctx.drawImage(paper(), 0, 0); }

// ---------- hand lettering: wipe reveal with a pen nib ----------
export function handText(ctx, str, x, y, size, p, o = {}) {
  const { color = C.graphite, align = 'center', family = F.hand, alpha = 1 } = o;
  if (p <= 0) return;
  const w = measure(ctx, str, { family, size });
  const x0 = align === 'center' ? x - w / 2 : x;
  const e = ease.inOutCubic(clamp(p));
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0 - 20, y - size * 1.3, (w + 40) * e, size * 1.9);
  ctx.clip();
  text(ctx, str, x0, y, { family, size, color, alpha });
  ctx.restore();
  if (p < 1) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8 * alpha;
    ctx.beginPath(); ctx.arc(x0 - 20 + (w + 40) * e, y - size * 0.3 + Math.sin(p * 40) * size * 0.2, 3, 0, 7); ctx.fill();
    ctx.restore();
  }
}

// ---------- light bulb (the idea) ----------
export function drawBulb(ctx, x, y, s, t, p, o = {}) {
  const { glow = 0, color = C.graphite, seed = 11, lit = 1 } = o;
  const r = 100 * s;
  if (glow > 0) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3.2);
    g.addColorStop(0, `rgba(232,160,58,${0.38 * glow})`);
    g.addColorStop(1, 'rgba(232,160,58,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 3.4, y - r * 3.4, r * 6.8, r * 6.8);
  }
  const lw = Math.max(1.4, 3.2 * s);
  sketchCircle(ctx, x, y, r, { t, seed, progress: prog(p, 0, 0.45), width: lw, color, start: Math.PI * 0.62 });
  // neck
  const nb = y + r * 0.78;
  sketchPoly(ctx, [[x - r * 0.42, nb], [x - r * 0.36, nb + r * 0.55]], { t, seed: seed + 1, progress: prog(p, 0.35, 0.5), width: lw, color });
  sketchPoly(ctx, [[x + r * 0.42, nb], [x + r * 0.36, nb + r * 0.55]], { t, seed: seed + 2, progress: prog(p, 0.38, 0.52), width: lw, color });
  for (let i = 0; i < 3; i++) {
    const yy = nb + r * (0.62 + i * 0.17);
    sketchPoly(ctx, [[x - r * 0.4, yy], [x + r * 0.4, yy + r * 0.04]], { t, seed: seed + 3 + i, progress: prog(p, 0.45 + i * 0.04, 0.58 + i * 0.04), width: lw * 0.9, color });
  }
  sketchPoly(ctx, [[x - r * 0.18, nb + r * 1.12], [x, nb + r * 1.22], [x + r * 0.18, nb + r * 1.12]], { t, seed: seed + 8, progress: prog(p, 0.58, 0.66), width: lw, color });
  // filament
  const fp = [];
  for (let i = 0; i <= 8; i++) fp.push([x - r * 0.3 + (i / 8) * r * 0.6, y + r * 0.15 + (i % 2 ? -r * 0.22 : 0)]);
  sketchPoly(ctx, [[x - r * 0.25, nb], [x - r * 0.3, y + r * 0.15]], { t, seed: seed + 9, progress: prog(p, 0.6, 0.68), width: lw * 0.7, color });
  sketchPoly(ctx, fp, { t, seed: seed + 10, progress: prog(p, 0.64, 0.8), width: lw * 0.8, color: lit > 0.5 ? '#C4561F' : color, jitter: 0.8 });
  sketchPoly(ctx, [[x + r * 0.3, y + r * 0.15], [x + r * 0.25, nb]], { t, seed: seed + 11, progress: prog(p, 0.78, 0.84), width: lw * 0.7, color });
  // rays
  const rp = prog(p, 0.82, 1);
  if (rp > 0 && lit > 0) {
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.42;
      const r1 = r * 1.28, r2 = r * (1.55 + (i % 2) * 0.18);
      sketchPoly(ctx, [[x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a) * r2, y + Math.sin(a) * r2]],
        { t, seed: seed + 20 + i, progress: ease.outCubic(clamp(rp * 1.6 - i * 0.08)), width: lw * 0.9, color, alpha: lit });
    }
  }
}

// ---------- pyramid of barriers ----------
const BR = { w: 3.0, h: 1.15, d: 1.5 };
const BRICKS = [
  { x: -3.1, y: 0, label: '学三年编程' },
  { x: 3.1, y: 0, label: '写十万行代码' },
  { x: 0, y: 0, label: '凑齐一个团队' },
  { x: -1.55, y: BR.h, label: '找设计 · 找服务器' },
  { x: 1.55, y: BR.h, label: '拉到第一笔钱' },
  { x: 0, y: BR.h * 2, label: '还得有人愿意用' },
];
export const BRICK_TIMES = BRICKS.map((_, i) => 8 + i);

function camAt(t) {
  // slow orbit, then a fast swing + low angle at 14s
  const swing = ease.inOutExpo(prog(t, 14, 14.7));
  const yaw = lerp(-0.32 + (t - 6) * 0.01, 0.5, swing);
  const pitch = lerp(0.36, -0.05, ease.inOutCubic(prog(t, 14, 15.6)));
  const dist = lerp(24, 17.5, ease.inOutCubic(prog(t, 14, 16)));
  const ty = lerp(1.3, 2.2, ease.inOutCubic(prog(t, 14, 16)));
  return { yaw, pitch, dist, target: [0, ty, 0], f: 2150, cyOff: lerp(70, -75, ease.inOutCubic(prog(t, 14, 16))) };
}
function project(cam, p) {
  let q = [p[0] - cam.target[0], p[1] - cam.target[1], p[2] - cam.target[2]];
  q = rotY(q, cam.yaw); q = rotX(q, cam.pitch);
  const z = q[2] + cam.dist;
  const k = cam.f / z;
  return [W / 2 + q[0] * k, H / 2 + cam.cyOff - q[1] * k, z, q];
}
function boxFaces(x, y, z, w, h, d) {
  const x0 = x - w / 2, x1 = x + w / 2, y0 = y, y1 = y + h, z0 = z - d / 2, z1 = z + d / 2;
  return [
    { k: 'front', n: [0, 0, -1], v: [[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]] },
    { k: 'back', n: [0, 0, 1], v: [[x1, y1, z1], [x0, y1, z1], [x0, y0, z1], [x1, y0, z1]] },
    { k: 'top', n: [0, 1, 0], v: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] },
    { k: 'bottom', n: [0, -1, 0], v: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] },
    { k: 'left', n: [-1, 0, 0], v: [[x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [x0, y0, z1]] },
    { k: 'right', n: [1, 0, 0], v: [[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]] },
  ];
}
// Returns screen-space edges of the pyramid for the particle explosion.
export function pyramidEdges(t) {
  const cam = camAt(t);
  const out = [];
  BRICKS.forEach((b) => {
    boxFaces(b.x, b.y, 0, BR.w, BR.h, BR.d).forEach((f) => {
      const pts = f.v.map((v) => project(cam, v));
      for (let i = 0; i < 4; i++) out.push([pts[i], pts[(i + 1) % 4]]);
    });
  });
  return out;
}
export function pyramidBounds(t) {
  const e = pyramidEdges(t).flat();
  const xs = e.map((p) => p[0]), ys = e.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function drawScene3D(ctx, t, o = {}) {
  const { lineColor = C.graphite, faceColor = C.paper, dim = 0 } = o;
  const cam = camAt(t);
  // ground line
  const gp = prog(t, 6.8, 7.8);
  const g0 = project(cam, [-11, 0, 0]), g1 = project(cam, [11, 0, 0]);
  sketchPoly(ctx, [[g0[0], g0[1]], [lerp(g0[0], g1[0], 0.5), lerp(g0[1], g1[1], 0.5) + 2], [g1[0], g1[1]]], { t, seed: 91, progress: gp, width: 2.4, color: lineColor });
  // ground scribbles
  for (let i = 0; i < 14; i++) {
    const u = -10 + i * 1.5 + hash(i, 5);
    const a = project(cam, [u, 0, -0.6 - hash(i, 3) * 1.2]), b = project(cam, [u + 0.5, 0, -0.6 - hash(i, 3) * 1.2]);
    sketchPoly(ctx, [[a[0], a[1]], [b[0], b[1]]], { t, seed: 300 + i, progress: prog(gp, 0.3 + i * 0.04, 0.5 + i * 0.04), width: 1.3, color: lineColor, alpha: 0.5 });
  }
  // the idea (bulb) stands on the left, "现实" flag on the right
  const bulbBase = project(cam, [-7.0, 0, 0]);
  const flag = project(cam, [7.0, 0, 0]);
  const flagTop = project(cam, [7.0, 3.2, 0]);
  const fp = prog(t, 7.1, 7.9);
  sketchPoly(ctx, [[flag[0], flag[1]], [flagTop[0], flagTop[1]]], { t, seed: 71, progress: fp, width: 2.6, color: lineColor });
  const fw = 120 * (cam.f / cam.dist / 90);
  sketchPoly(ctx, [[flagTop[0], flagTop[1]], [flagTop[0] + fw, flagTop[1] + fw * 0.28], [flagTop[0], flagTop[1] + fw * 0.56]], { t, seed: 72, progress: prog(fp, 0.4, 1), width: 2.4, color: C.coral });
  if (fp > 0.5) hatch(ctx, [[flagTop[0], flagTop[1]], [flagTop[0] + fw, flagTop[1] + fw * 0.28], [flagTop[0], flagTop[1] + fw * 0.56]], { t, color: C.coral, spacing: 7, alpha: 0.7, progress: prog(fp, 0.6, 1) });
  handText(ctx, '现实', flag[0] + 10, flag[1] + 64, 50, prog(t, 7.5, 8.2), { color: lineColor });

  // faces
  const faces = [];
  BRICKS.forEach((b, i) => {
    const t0 = BRICK_TIMES[i];
    if (t < t0) return;
    const fall = ease.outBounce(prog(t, t0, t0 + 0.42));
    const y = b.y + (1 - fall) * 7.5;
    boxFaces(b.x, y, 0, BR.w, BR.h, BR.d).forEach((f) => {
      let n = rotX(rotY(f.n, cam.yaw), cam.pitch);
      const P = f.v.map((v) => project(cam, v));
      const c = P.reduce((a, p) => [a[0] + p[3][0] / 4, a[1] + p[3][1] / 4, a[2] + (p[3][2] + cam.dist) / 4], [0, 0, 0]);
      if (n[0] * c[0] + n[1] * c[1] + n[2] * c[2] >= 0) return;
      faces.push({ f, P, depth: c[2], i, b, draw: prog(t, t0, t0 + 0.3) });
    });
  });
  faces.sort((a, b) => b.depth - a.depth);
  faces.forEach(({ f, P, i, b, draw }) => {
    const poly = P.map((p) => [p[0], p[1]]);
    ctx.save();
    ctx.beginPath(); poly.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    ctx.fillStyle = f.k === 'top' ? '#F8F4EA' : faceColor;
    ctx.globalAlpha = clamp(draw * 3);
    ctx.fill();
    ctx.restore();
    if (f.k === 'left' || f.k === 'right') hatch(ctx, poly, { t, seed: i * 7 + 1, progress: prog(draw, 0.5, 1), color: lineColor, alpha: 0.38, spacing: 10 });
    if (f.k === 'top') hatch(ctx, poly, { t, seed: i * 7 + 2, progress: prog(draw, 0.6, 1), color: lineColor, alpha: 0.12, spacing: 16, angle: 0.3 });
    sketchPoly(ctx, poly, { t, seed: i * 31 + f.k.length, closed: true, progress: draw, width: 2.3, color: lineColor });
    if (f.k === 'front' && draw > 0.4) {
      // map label onto the face (affine is exact enough at this focal length)
      const [a, bq, , d] = poly;
      const WF = 300, HF = 115;
      ctx.save();
      ctx.transform((bq[0] - a[0]) / WF, (bq[1] - a[1]) / WF, (d[0] - a[0]) / HF, (d[1] - a[1]) / HF, a[0], a[1]);
      text(ctx, b.label, 150, 74, { family: F.hand, size: b.label.length > 6 ? 36 : 42, color: lineColor, align: 'center', alpha: clamp((draw - 0.4) * 3) });
      ctx.restore();
    }
  });
  // impact dust
  BRICKS.forEach((b, i) => {
    const tl = BRICK_TIMES[i] + 0.3;
    const dp = prog(t, tl, tl + 0.45);
    if (dp <= 0 || dp >= 1) return;
    for (const side of [-1, 1]) {
      const base = project(cam, [b.x + side * BR.w * 0.5, b.y, -BR.d / 2]);
      for (let k = 0; k < 3; k++) {
        const a = -Math.PI / 2 + side * (0.9 + k * 0.35);
        const r0 = 14 + dp * 50, r1 = r0 + 18 * (1 - dp);
        sketchPoly(ctx, [[base[0] + Math.cos(a) * r0 * side * side, base[1] + Math.sin(a) * r0 * 0.4], [base[0] + Math.cos(a) * r1, base[1] + Math.sin(a) * r1 * 0.4]],
          { t, seed: 500 + i * 9 + k, width: 1.6, color: lineColor, alpha: 1 - dp });
      }
    }
  });
  return { cam, bulbBase };
}

function drawCursor(ctx, x, y, s = 1, press = 0) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s * (1 - press * 0.12), s * (1 - press * 0.12));
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(8.5, 26); ctx.lineTo(14, 39); ctx.lineTo(19.5, 36.5); ctx.lineTo(14, 24); ctx.lineTo(25, 24); ctx.closePath();
  ctx.fillStyle = '#0B0D0F'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
  ctx.fill(); ctx.shadowColor = 'transparent'; ctx.stroke();
  ctx.restore();
}

// ---------- main draw ----------
export function drawAct1(ctx, t, P) {
  // ===== 0–4 cold open =====
  if (t < 4) {
    fillBg(ctx, '#070809');
    const o = { family: F.mono, size: 64, color: C.cream, weight: 400 };
    const x = 470;
    text(ctx, '~/protocom  ·  zsh', x, 400, { family: F.mono, size: 24, color: '#5d5a53', alpha: prog(t, 0.1, 0.5) });
    typeText(ctx, '> 每一个了不起的东西，', x, 520, o, prog(t, 0.35, 1.5), t < 1.65, t);
    if (t > 1.65) typeText(ctx, '> 都始于一个想法。', x, 628, { ...o, cursorColor: C.amber }, prog(t, 1.75, 2.9), true, t);
    // cursor block blooms into paper (match cut)
    const ep = ease.inExpo(prog(t, 3.55, 4));
    if (ep > 0) {
      const w2 = measure(ctx, '> 都始于一个想法。', o);
      const cx0 = x + w2 + 6 + 16, cy0 = 628 - 64 * 0.82 + 30;
      const cx = lerp(cx0, W / 2, ep), cy = lerp(cy0, H / 2, ep);
      const hw = lerp(16, W * 0.62, ep), hh = lerp(30, H * 0.62, ep);
      ctx.fillStyle = C.paper;
      ctx.fillRect(cx - hw, cy - hh, hw * 2, hh * 2);
    }
    P.grain = 0.05; P.vig = 0.5;
    return;
  }

  // ===== 4–19.5 sketch era =====
  if (t < 19.5) {
    drawPaper(ctx);
    P.grain = 0.035; P.vig = 0.42; P.warm = 0.4;
    const sel = prog(t, 16.5, 17.1);
    const suck = ease.inExpo(prog(t, 19.0, 19.5));
    ctx.save();
    // camera drift + final suck-in
    const drift = 1 + (t - 4) * 0.004;
    ctx.translate(W / 2, H / 2); ctx.scale(drift * (1 + suck * 0.9), drift * (1 + suck * 0.9)); ctx.translate(-W / 2, -H / 2);
    if (t > 19) ctx.translate(hs(Math.floor(t * 60), 1) * 8 * suck, hs(Math.floor(t * 60), 2) * 8 * suck);

    // intro bulb: big & centered, then flies into the scene
    const fly = ease.inOutExpo(prog(t, 6.3, 7.4));
    let sceneInfo = null;
    if (t >= 6.3) sceneInfo = drawScene3D(ctx, t);
    let bx = W / 2, by = H / 2 - 70, bs = 1.25;
    if (sceneInfo) {
      const tgt = sceneInfo.bulbBase;
      const sc = (camAt(t).f / camAt(t).dist) / 90;
      bx = lerp(bx, tgt[0], fly); by = lerp(by, tgt[1] - 210 * 0.55 * sc, fly); bs = lerp(bs, 0.55 * sc, fly);
    }
    const dimmed = t > 14.4 ? 0.35 + 0.65 * (noise1(t * 14, 4) > 0.2 ? 0.4 : 1) : 1;
    drawBulb(ctx, bx, by, bs, t, prog(t, 4.05, 5.6), { glow: prog(t, 5.4, 6) * (t > 14.4 ? dimmed * 0.5 : 1), lit: 1 });
    handText(ctx, '一个想法', W / 2, H / 2 + 260, 96, prog(t, 5.2, 6.0) * (1 - fly), { alpha: 1 - fly });
    if (fly > 0.7) handText(ctx, '想法', bx - 150 * bs, by - 150 * bs, 44, prog(t, 7.2, 7.8));
    text(ctx, 'idea.v0 ↘', W / 2 + 180, H / 2 - 240, { family: F.handLatin, size: 44, color: C.coral, weight: 600, alpha: prog(t, 5.5, 5.8) * (1 - fly) });

    // copy
    handText(ctx, '要把它变成现实，', W / 2, 170, 78, prog(t, 7.0, 8.0), { alpha: 1 - prog(t, 13.6, 14.0) });
    handText(ctx, '想法与现实之间，', W / 2, 150, 84, prog(t, 14.3, 15.1), { alpha: 1 - prog(t, 16.2, 16.5) });
    handText(ctx, '隔着一整座山。', W / 2, 262, 110, prog(t, 15.0, 15.9), { alpha: 1 - prog(t, 16.2, 16.5), color: '#1a1714' });
    ctx.restore();

    // ===== AI moment: select + prompt =====
    if (t >= 16) {
      const [x0, y0, x1, y1] = pyramidBounds(Math.min(t, 16.5));
      const pad = 26;
      const bx0 = x0 - pad, by0 = y0 - pad, bx1 = x1 + pad, by1 = y1 + pad;
      const cIn = ease.outExpo(prog(t, 16.0, 16.5));
      let cx = lerp(W + 60, bx0, cIn), cy = lerp(H + 60, by0, cIn);
      if (t > 16.5) { const d = ease.inOutCubic(sel); cx = lerp(bx0, bx1, d); cy = lerp(by0, by1, d); }
      const promptY = H - 110;
      const btnX = W / 2 + 420, btnY = promptY;
      if (t > 18.3) { const m = ease.inOutExpo(prog(t, 18.3, 18.85)); cx = lerp(bx1, btnX, m); cy = lerp(by1, btnY, m); }
      if (sel > 0) {
        ctx.save();
        const sx1 = lerp(bx0, bx1, ease.inOutCubic(sel)), sy1 = lerp(by0, by1, ease.inOutCubic(sel));
        ctx.fillStyle = 'rgba(232,99,58,0.07)';
        ctx.fillRect(bx0, by0, sx1 - bx0, sy1 - by0);
        ctx.strokeStyle = C.coral; ctx.lineWidth = 2.5;
        ctx.strokeRect(bx0, by0, sx1 - bx0, sy1 - by0);
        if (sel >= 1) {
          for (const [hx, hy] of [[bx0, by0], [bx1, by0], [bx0, by1], [bx1, by1], [(bx0 + bx1) / 2, by0], [(bx0 + bx1) / 2, by1], [bx0, (by0 + by1) / 2], [bx1, (by0 + by1) / 2]]) {
            ctx.fillStyle = '#fff'; ctx.fillRect(hx - 7, hy - 7, 14, 14); ctx.strokeRect(hx - 7, hy - 7, 14, 14);
          }
          const lbl = `${Math.round(bx1 - bx0)} × ${Math.round(by1 - by0)}`;
          const lw = measure(ctx, lbl, { family: F.mono, size: 20, weight: 500 }) + 24;
          ctx.fillStyle = C.coral; roundRect(ctx, (bx0 + bx1) / 2 - lw / 2, by1 + 18, lw, 34, 6); ctx.fill();
          text(ctx, lbl, (bx0 + bx1) / 2, by1 + 42, { family: F.mono, size: 20, weight: 500, color: '#fff', align: 'center' });
          text(ctx, '整座山 · 已选中', bx0, by0 - 18, { family: F.mono, size: 20, weight: 500, color: C.coral });
        }
        ctx.restore();
      }
      // prompt bar
      const pb = ease.outBack(prog(t, 17.05, 17.45));
      if (pb > 0) {
        ctx.save();
        const pw = 980, ph = 92;
        ctx.globalAlpha = clamp(pb);
        ctx.translate(W / 2, promptY + (1 - pb) * 80);
        ctx.shadowColor = 'rgba(20,15,10,0.28)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
        ctx.fillStyle = '#0E1012'; roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 22); ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1.5; roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 22); ctx.stroke();
        text(ctx, '✦', -pw / 2 + 44, 13, { size: 36, color: C.coral, align: 'center' });
        const typed = prog(t, 17.45, 18.25);
        typeText(ctx, '把它做出来。', -pw / 2 + 86, 14, { family: F.sans, size: 38, weight: 500, color: C.cream, cursorColor: C.coral }, typed, t < 18.9, t);
        if (typed === 0) text(ctx, '描述你想要的…', -pw / 2 + 86, 14, { size: 36, color: '#55524c' });
        const press = t > 18.95 && t < 19.15 ? 1 : 0;
        ctx.fillStyle = press ? '#fff' : C.coral;
        ctx.beginPath(); ctx.arc(420, 0, 30 * (1 - press * 0.1), 0, 7); ctx.fill();
        ctx.strokeStyle = press ? C.coral : '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(420, 11); ctx.lineTo(420, -11); ctx.moveTo(410, -2); ctx.lineTo(420, -12); ctx.lineTo(430, -2); ctx.stroke();
        ctx.restore();
      }
      const press = t > 18.95 && t < 19.15 ? 1 : 0;
      drawCursor(ctx, cx, cy, 1.25, press);
    }
    if (t > 19) { P.glitch = suck * 0.5; P.ca = suck * 0.01; P.zoomBlur = suck * 0.25; }
    return;
  }

  // ===== 19.5–20 silence: the year =====
  fillBg(ctx, '#000');
  text(ctx, '2022', W / 2, H / 2 + 12, { family: F.mono, size: 30, color: '#8a867c', align: 'center', ls: 8, alpha: prog(t, 19.55, 19.62) });
  P.grain = 0.05;
}
