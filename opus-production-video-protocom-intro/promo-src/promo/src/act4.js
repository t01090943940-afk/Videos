// 62–80s · Ascension. The members become a constellation, the constellation lifts
// 2D → 3D → 4D, and folds into the mark. Then: the next story is yours.
import { W, H, C, F, clamp, lerp, prog, ease, hash, hs, text, revealText, typeText, measure, fillBg, zoomAt, roundRect, images } from './core.js';
import { MEMBERS, BRAND, BRAND_CN } from './data.js';
import { avatar } from './act3.js';

function stars(ctx, t, alpha = 1) {
  for (let i = 0; i < 260; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * H;
    const tw = 0.5 + 0.5 * Math.sin(t * (1 + hash(i, 3) * 3) + i);
    const r = 0.6 + hash(i, 4) * 1.5;
    ctx.fillStyle = hash(i, 5) > 0.85 ? '#FFD9B8' : C.cream;
    ctx.globalAlpha = alpha * (0.15 + 0.5 * tw * hash(i, 6));
    ctx.beginPath(); ctx.arc(x + (t - 62) * (hash(i, 7) - 0.5) * 6, y, r, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// constellation layout (normalized around the centre)
const NODES = [
  [0, -0.02], [-0.3, -0.24], [0.28, -0.3], [-0.52, 0.02], [0.5, -0.04], [-0.2, 0.2],
  [0.2, 0.22], [-0.42, -0.36], [0.44, 0.3], [-0.05, -0.4], [0.02, 0.4],
];
const LINKS = [[0, 1], [0, 2], [1, 7], [1, 3], [3, 5], [5, 0], [0, 6], [6, 8], [2, 4], [4, 8], [2, 9], [9, 1], [5, 10], [10, 6], [7, 9]];

// tesseract
const V4 = [];
for (let i = 0; i < 16; i++) V4.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
const E4 = [];
for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) { const j = i ^ (1 << b); if (i < j) E4.push([i, j, b]); }
// which tesseract vertex each member settles on (the other 5 are plain stars)
const SLOT = [0, 3, 5, 6, 9, 10, 12, 15, 1, 14, 7];

function tesseract(t, sz, sw, spin, scale) {
  const a = spin;
  return V4.map(([x, y, z, w]) => {
    z *= sz; w *= sw;
    // 4D rotations in XW and ZW planes
    let c = Math.cos(a), s = Math.sin(a);
    [x, w] = [x * c - w * s, x * s + w * c];
    c = Math.cos(a * 0.7); s = Math.sin(a * 0.7);
    [z, w] = [z * c - w * s, z * s + w * c];
    const k4 = 1 / (3 - w);
    x *= k4 * 2; y *= k4 * 2; z *= k4 * 2;
    // 3D orbit
    const yaw = t * 0.45, pitch = 0.42;
    let X = x * Math.cos(yaw) + z * Math.sin(yaw), Z = -x * Math.sin(yaw) + z * Math.cos(yaw);
    let Y = y * Math.cos(pitch) - Z * Math.sin(pitch); Z = y * Math.sin(pitch) + Z * Math.cos(pitch);
    const k = 5 / (5 + Z);
    return [W / 2 + X * k * scale, H / 2 - 70 - Y * k * scale, Z];
  });
}

const LIME = '#D7F329';

// ---------- 73.3–74.8 · the thesis, stated fast ----------
function thesis(ctx, t, P) {
  fillBg(ctx, '#050607');
  stars(ctx, t, 0.5);
  P.grain = 0.06; P.vig = 0.5; P.scan = 0.22; P.ca = 0.0015; P.bloom = 0.25;
  const out = prog(t, 74.5, 74.78);
  const al = 1 - out;
  text(ctx, 'OUR THESIS  ——  青禾·元野', 80, 84, { family: F.mono, size: 20, color: C.creamDim, ls: 3, alpha: prog(t, 73.4, 73.7) * al });
  text(ctx, 'EST. NCC · 2026', W - 80, 84, { family: F.mono, size: 20, color: C.creamDim, ls: 3, align: 'right', alpha: prog(t, 73.4, 73.7) * al });
  revealText(ctx, '让学生自由发展，', W / 2, H / 2 - 60, { family: F.serif, size: 96, weight: 900, color: C.cream, align: 'center', alpha: al }, prog(t, 73.4, 73.85), { stagger: 0.03, rise: 26 });
  const o2 = { family: F.serif, size: 96, weight: 900 };
  const w1 = measure(ctx, '在真实实践中', o2), w2 = measure(ctx, '长出元能力。', o2);
  const x0 = W / 2 - (w1 + w2) / 2;
  revealText(ctx, '在真实实践中', x0, H / 2 + 90, { ...o2, color: C.cream, align: 'left', alpha: al }, prog(t, 73.9, 74.3), { stagger: 0.03, rise: 26 });
  revealText(ctx, '长出元能力。', x0 + w1, H / 2 + 90, { ...o2, color: LIME, align: 'left', alpha: al }, prog(t, 74.05, 74.42), { stagger: 0.03, rise: 26 });
  text(ctx, 'LET STUDENTS BUILD FREE —— META-SKILLS GROW IN REAL WORK', W / 2, H / 2 + 190, { family: F.mono, size: 20, color: C.creamDim, align: 'center', ls: 3, alpha: prog(t, 74.3, 74.55) * al });
  P.flash = out; P.flashColor = [1, 0.97, 0.92];
  P.zoomBlur = out * 0.3;
}

// ---------- the wordmark: per-glyph assemble, RGB-split convergence, sheen sweep ----------
let wmCv = null;
function wordmark(ctx, str, x, y, size, p, t) {
  const o = { family: F.grotesk, size, weight: 700, ls: 6 };
  const chars = [...str];
  const widths = chars.map((c) => measure(ctx, c, o));
  const gap2 = 10;
  const tw = widths.reduce((a, b) => a + b, 0) + gap2 * (chars.length - 1);
  const stagger = 0.055, dur = 0.5, total = dur + stagger * (chars.length - 1);
  // chromatic ghosts converge onto each settling glyph
  ctx.save();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${size}px ${F.grotesk}, ${F.sans}`;
  let ex = x - tw / 2 + widths[0] / 2;
  chars.forEach((c, i) => {
    const lp = clamp((p * total - i * stagger) / dur);
    if (lp > 0 && lp < 1) {
      const e = ease.outExpo(lp);
      const dx = (1 - e) * 30, ry = (1 - e) * 50;
      ctx.globalAlpha = (1 - e) * 0.75;
      ctx.fillStyle = C.coral; ctx.fillText(c, ex + dx, y + ry);
      ctx.fillStyle = C.teal; ctx.fillText(c, ex - dx, y + ry);
    }
    ex += widths[i] + gap2;
  });
  ctx.restore();
  // body: gradient + specular sweep composited on an isolated layer
  const cw0 = Math.ceil(tw + 240), ch0 = Math.ceil(size * 1.9);
  if (!wmCv) wmCv = document.createElement('canvas');
  if (wmCv.width !== cw0) { wmCv.width = cw0; wmCv.height = ch0; }
  const g = wmCv.getContext('2d');
  g.clearRect(0, 0, cw0, ch0);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `700 ${size}px ${F.grotesk}, ${F.sans}`;
  let gx = 120 + widths[0] / 2;
  chars.forEach((c, i) => {
    const lp = clamp((p * total - i * stagger) / dur);
    if (lp <= 0) { gx += widths[i] + gap2; return; }
    const e = ease.outExpo(lp), eb = ease.outBack(lp);
    g.save();
    g.translate(gx, ch0 / 2 + (1 - e) * 50);
    g.scale((0.55 + 0.45 * e) * (1 + (eb - 1) * 0.5), (0.55 + 0.45 * e) * (1 + (eb - 1) * 0.5));
    if (e < 1) g.filter = `blur(${(1 - e) * 9}px)`;
    g.globalAlpha = e;
    g.fillStyle = '#F4EFE3';
    g.fillText(c, 0, 0);
    g.restore();
    gx += widths[i] + gap2;
  });
  g.globalCompositeOperation = 'source-in';
  const grd = g.createLinearGradient(0, ch0 * 0.15, 0, ch0 * 0.85);
  grd.addColorStop(0, '#FFFFFF'); grd.addColorStop(0.5, '#F4EFE3'); grd.addColorStop(1, '#C9A87C');
  g.fillStyle = grd; g.fillRect(0, 0, cw0, ch0);
  const sp = ease.inOutCubic(prog(t, 75.7, 76.8));
  if (sp > 0 && sp < 1) {
    g.globalCompositeOperation = 'source-atop';
    const bx = lerp(-160, cw0 + 160, sp);
    const gr2 = g.createLinearGradient(bx - 150, 0, bx + 150, 0);
    gr2.addColorStop(0, 'rgba(255,255,255,0)');
    gr2.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    gr2.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr2;
    g.save(); g.translate(bx, ch0 / 2); g.rotate(-0.3); g.fillRect(-150, -ch0, 300, ch0 * 2); g.restore();
  }
  g.globalCompositeOperation = 'source-over';
  ctx.save();
  ctx.shadowColor = 'rgba(232,99,58,0.5)'; ctx.shadowBlur = 55;
  ctx.drawImage(wmCv, x - cw0 / 2, y - ch0 / 2);
  ctx.restore();
  ctx.drawImage(wmCv, x - cw0 / 2, y - ch0 / 2);
}

export function drawAct4(ctx, t, P) {
  fillBg(ctx, '#050607');
  P.grain = 0.04; P.vig = 0.55; P.bloom = 0.28; P.ca = 0.002;
  stars(ctx, t, prog(t, 62, 62.8));
  const glow = (x, y, r, a, col = '232,99,58') => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };

  if (t < 72) {
    P.bloom = 0.1;
    // ---- positions: constellation → tesseract ----
    const burst = ease.outExpo(prog(t, 62.0, 62.9));
    const morph = ease.inOutExpo(prog(t, 66.0, 67.0));
    const sz = ease.inOutExpo(prog(t, 67.2, 68.0));
    const sw = ease.inOutExpo(prog(t, 68.5, 69.3));
    const spinT = Math.max(0, t - 68.5);
    const collapse = ease.inExpo(prog(t, 71.0, 71.9));
    const spin = spinT * 0.9 + spinT * spinT * 0.12 + collapse * 3;
    const scale = lerp(230, 250, prog(t, 67, 71)) * (1 - collapse);
    const T = tesseract(t - 66, sz, sw, spin, scale);
    // the flat net slowly reclines into depth before it morphs — 2D → 2.5D → 4D
    const tilt = ease.inOutCubic(prog(t, 63.7, 65.7)) * 0.52;
    const ncy = H / 2 - 145;
    const conPos = NODES.map(([x, y], i) => {
      const px = x * 1360 * burst;
      const py = (y * 760 + Math.sin(t * 0.8 + i * 1.9) * 7) * burst;
      const z0 = hs(i, 77) * 240;
      const y2 = py * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z2 = (py * Math.sin(tilt) + z0 * Math.cos(tilt)) * 0.004;
      const k = 1 / (1 + z2 * 0.22);
      return [W / 2 + px * k, ncy + y2 * k, z2];
    });
    const memberPos = MEMBERS.map((_, i) => {
      const tp = T[SLOT[i]];
      return [lerp(conPos[i][0], tp[0], morph), lerp(conPos[i][1], tp[1], morph), lerp(conPos[i][2], tp[2], morph)];
    });

    glow(W / 2, H / 2 - 30, 700, 0.12 + collapse * 0.4);

    // constellation links (fade out as the structure takes over)
    ctx.save();
    ctx.strokeStyle = C.cream; ctx.lineWidth = 1.5;
    LINKS.forEach(([a, b], k) => {
      const lp = ease.inOutCubic(prog(t, 62.6 + k * 0.1, 63.1 + k * 0.1));
      if (lp <= 0) return;
      ctx.globalAlpha = 0.45 * (1 - morph);
      const [x1, y1] = memberPos[a], [x2, y2] = memberPos[b];
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, lp), lerp(y1, y2, lp)); ctx.stroke();
    });
    ctx.restore();

    // tesseract edges
    if (morph > 0) {
      ctx.save();
      E4.forEach(([i, j, axis]) => {
        const a = T[i], b = T[j];
        const depth = clamp(1 - (a[2] + b[2]) * 0.08);
        ctx.strokeStyle = axis === 3 ? C.coral : axis === 2 ? C.teal : C.cream;
        ctx.globalAlpha = morph * (axis === 3 ? sw : axis === 2 ? Math.max(sz, 0.25) : 1) * 0.85 * depth;
        ctx.lineWidth = axis === 3 ? 2.5 : 2;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });
      // the 5 unclaimed vertices glow as open seats
      const claimed = new Set(SLOT);
      T.forEach((p, i) => {
        if (claimed.has(i)) return;
        ctx.globalAlpha = morph;
        glow(p[0], p[1], 26, 0.8);
        ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, 7); ctx.fill();
      });
      ctx.restore();
    }

    // member nodes
    const order = memberPos.map((p, i) => [p[2], i]).sort((a, b) => b[0] - a[0]);
    order.forEach(([, i]) => {
      const m = MEMBERS[i];
      const [x, y] = memberPos[i];
      const r = lerp(38, 22, morph) * burst * (1 - collapse) * clamp(1 / (1 + memberPos[i][2] * 0.18), 0.7, 1.35);
      if (r < 0.5) return;
      glow(x, y, r * 2.4, 0.35);
      avatar(ctx, m, x, y, r, { dark: true });
      ctx.strokeStyle = 'rgba(244,239,227,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, 7); ctx.stroke();
      text(ctx, m.handle, x, y + r + 26, { family: F.mono, size: 16, color: C.creamDim, align: 'center', alpha: prog(t, 62.8, 63.2) * (1 - morph) });
    });

    // ---- copy ----
    if (t < 66) {
      const lines = [['靠作品', '赢得信任'], ['靠信任', '交换经验'], ['靠经验', '快速迭代原型']];
      lines.forEach(([a, b], k) => {
        const t0 = 62.9 + k * 0.95;
        const p = prog(t, t0, t0 + 0.5);
        if (p <= 0) return;
        const y = 930;
        const o = { family: F.serif, size: 52, weight: 900 };
        const ws = lines.map(([p1, p2]) => measure(ctx, p1 + p2, o));
        const gap = 110, tot = ws.reduce((u, v) => u + v, 0) + gap * 2;
        const x0 = W / 2 - tot / 2 + ws.slice(0, k).reduce((u, v) => u + v, 0) + gap * k;
        const al = 1 - prog(t, 65.6, 65.95);
        revealText(ctx, a, x0, y, { family: F.serif, size: 52, weight: 900, color: C.coral, align: 'left', alpha: al }, p, { stagger: 0.05, rise: 20 });
        revealText(ctx, b, x0 + measure(ctx, a, { family: F.serif, size: 52, weight: 900 }), y, { family: F.serif, size: 52, weight: 900, color: C.cream, align: 'left', alpha: al }, prog(t, t0 + 0.15, t0 + 0.65), { stagger: 0.05, rise: 20 });
      });
      text(ctx, '—— 共建手册 v0.1 · 价值观', W / 2, 1000, { family: F.mono, size: 20, color: C.creamDim, align: 'center', alpha: prog(t, 64.8, 65.2) * (1 - prog(t, 65.6, 65.95)), ls: 2 });
    } else {
      const dim = t < 67.2 ? '2D' : t < 68.5 ? '3D' : '4D';
      const dimA = prog(t, 66.1, 66.3) * (1 - collapse);
      text(ctx, `DIMENSION  ${dim}`, 80, 90, { family: F.mono, size: 24, color: C.coral, ls: 4, alpha: dimA });
      text(ctx, `${Math.round(spin * 57.3) % 360}°  ·  XW / ZW`, W - 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, align: 'right', alpha: dimA * sw });
      const copy = [
        [66.2, 68.3, '当创造被 AI 升维——', 64, C.cream],
        [68.4, 69.8, '一个学生，就是一支团队。', 84, C.cream],
        [69.85, 71.3, '一群学生，就是一个时代。', 84, C.coral],
      ];
      copy.forEach(([a, b, s, size, col]) => {
        if (t < a || t > b) return;
        const out = prog(t, b - 0.2, b);
        revealText(ctx, s, W / 2, H - 110, { family: F.serif, size, weight: 900, color: col, align: 'center', alpha: 1 - out }, prog(t, a, a + 0.5), { stagger: 0.035, rise: 26 });
      });
    }
    P.zoomBlur = collapse * 0.35;
    P.flash = prog(t, 71.8, 72.0);
    P.flashColor = [1, 0.97, 0.92];
    return;
  }

  // ---- 72–73.3 · dark beat before the thesis ----
  if (t < 73.3) {
    fillBg(ctx, '#050607'); stars(ctx, t, 0.4);
    P.grain = 0.06; P.vig = 0.5; P.scan = 0.2;
    return;
  }
  // ---- 73.3–74.8 · the thesis ----
  if (t < 74.8) { thesis(ctx, t, P); return; }

  // ---- 74.8–80 · the mark ----
  const M0 = 74.8;
  const push = 1 + (t - M0) * 0.014;
  const cta = ease.inOutExpo(prog(t, 76.0, 76.7));
  glow(W / 2, H / 2 - 60, 900, 0.16);
  P.bloom = 0.32 + 0.5 * prog(t, M0 + 0.15, M0 + 0.5) * (1 - prog(t, M0 + 0.5, M0 + 1.6));
  // faint tesseract keeps turning behind the mark
  const T = tesseract(t - 66, 1, 1, (t - M0) * 0.5 + 4, 520);
  ctx.save();
  ctx.globalAlpha = 0.12 * prog(t, M0 + 0.2, M0 + 1);
  ctx.strokeStyle = C.cream; ctx.lineWidth = 1.2;
  E4.forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(T[i][0], T[i][1]); ctx.lineTo(T[j][0], T[j][1]); ctx.stroke(); });
  ctx.restore();

  ctx.save();
  zoomAt(ctx, push, W / 2, H / 2);
  ctx.translate(0, -cta * 170);
  const s = lerp(1, 0.72, cta);
  zoomAt(ctx, s, W / 2, H / 2 - 110);
  // app-icon tile + club mark
  const ip = ease.outBack(prog(t, M0, M0 + 0.45));
  const iy = H / 2 - 246;
  ctx.save();
  ctx.translate(W / 2, iy); ctx.scale(ip, ip);
  roundRect(ctx, -95, -95, 190, 190, 44);
  ctx.save(); ctx.clip();
  if (images.club_logo) ctx.drawImage(images.club_logo, -95, -95, 190, 190);
  else { ctx.fillStyle = '#111316'; ctx.fillRect(-95, -95, 190, 190); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(244,239,227,0.2)'; ctx.lineWidth = 2; roundRect(ctx, -95, -95, 190, 190, 44); ctx.stroke();
  ctx.restore();
  // orbit of members around the mark
  MEMBERS.forEach((m, i) => {
    const a = (i / MEMBERS.length) * Math.PI * 2 + (t - M0) * 0.35;
    const op = ease.outExpo(prog(t, M0 + 0.35 + i * 0.045, M0 + 0.9 + i * 0.045));
    if (op <= 0) return;
    const R = 175 * op + 10;
    const x = W / 2 + Math.cos(a) * R * 1.6, y = iy + Math.sin(a) * R * 0.6;
    avatar(ctx, m, x, y, 22, { dark: true, alpha: op * (1 - cta) });
  });
  wordmark(ctx, 'PROTOCOM', W / 2, H / 2 + 84, 172, prog(t, M0 + 0.15, M0 + 0.8), t);
  revealText(ctx, BRAND_CN, W / 2, H / 2 + 192, { family: F.serif, size: 58, weight: 900, color: C.cream, align: 'center', ls: 12 }, prog(t, M0 + 0.7, M0 + 1.2), { stagger: 0.05, rise: 24 });
  text(ctx, 'PROTO COMMONS  ·  NCC  ·  2026', W / 2, H / 2 + 252, { family: F.mono, size: 21, color: C.creamDim, align: 'center', ls: 4, alpha: prog(t, M0 + 1.0, M0 + 1.4) });
  ctx.restore();

  if (cta > 0) {
    revealText(ctx, '下一个故事，由你书写。', W / 2, H / 2 + 250, { family: F.serif, size: 88, weight: 900, color: C.cream, align: 'center' }, prog(t, 76.3, 76.9), { stagger: 0.04, rise: 30 });
    const cmd = `> join ${BRAND} --as @你`;
    const cw = measure(ctx, cmd, { family: F.mono, size: 40 });
    typeText(ctx, cmd, W / 2 - cw / 2, H / 2 + 360, { family: F.mono, size: 40, color: C.coral, cursorColor: C.coral }, prog(t, 77.0, 77.9), true, t);
  }
  P.flash = t < M0 + 0.12 ? 1 - prog(t, M0, M0 + 0.12) : 0;
  P.flashColor = [1, 0.97, 0.92];
}
