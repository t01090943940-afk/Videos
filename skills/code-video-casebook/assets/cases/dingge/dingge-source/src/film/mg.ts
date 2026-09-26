import { clamp, ease, invLerp, lerp } from '../core/math';

// Motion-graphics layer (Canvas2D, 1920x1080). One visual system for the whole film:
// safety yellow / danger red / safe green / ink / paper; one font family; three text levels; every element enters
// with a short overshoot (like a cut-out being slapped onto the frame) and leaves with ease-in.

export const C = { yellow: '#FFC400', red: '#E53935', green: '#2EAD5B', ink: '#111418', paper: '#F4F1EA', grey: '#9AA3AD' };
export const FONT = '"Noto Sans CJK SC","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif';
export type G = CanvasRenderingContext2D;
export interface Pt { x: number; y: number; vis: boolean }

const font = (g: G, size: number, weight = 900) => { g.font = `${weight} ${size}px ${FONT}`; };
/** 0→1 appear over [t0,t0+d] with overshoot, 1→0 disappear over [t1-d2, t1] */
export function env(t: number, t0: number, t1 = 1e9, d = 0.35, d2 = 0.25, e: keyof typeof ease = 'outBack') {
  if (t < t0 || t > t1) return 0;
  const a = ease[e](clamp((t - t0) / d)), b = 1 - ease.inCubic(clamp((t - (t1 - d2)) / d2));
  return Math.min(a, b);
}

function roundRect(g: G, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

export function hazardBand(g: G, x: number, y: number, w: number, h: number, a = C.yellow, b = C.ink, offset = 0) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = a; g.fillRect(x, y, w, h);
  g.fillStyle = b; const s = h * 1.2;
  for (let i = -2; i < w / s + 3; i++) { const x0 = x + i * s * 2 + (offset % (s * 2)); g.beginPath(); g.moveTo(x0, y + h); g.lineTo(x0 + s, y + h); g.lineTo(x0 + s + h, y); g.lineTo(x0 + h, y); g.closePath(); g.fill(); }
  g.restore();
}

/** Main caption: yellow bar + big line + optional small line, lower-left third. */
export function caption(g: G, t: number, t0: number, t1: number, text: string, sub = '', pos: 'll' | 'center' | 'top' | 'tr' = 'll', color = C.paper) {
  const a = env(t, t0, t1, 0.4);
  if (a <= 0) return;
  const reveal = clamp((t - t0) / 0.5);
  g.save();
  font(g, 64); const tw = g.measureText(text).width;
  font(g, 30, 700); const sw = sub ? g.measureText(sub).width : 0;
  const w = Math.max(tw, sw) + 80;
  let x = 110, y = 790;
  if (pos === 'center') { x = 960 - w / 2; y = 470; }
  if (pos === 'top') { x = 110; y = 110; }
  if (pos === 'tr') { x = 1810 - w; y = 110; }
  g.globalAlpha = clamp(a * 1.2);
  g.translate(x, y); g.scale(lerp(0.92, 1, a), lerp(0.92, 1, a));
  g.fillStyle = 'rgba(17,20,24,0.78)';
  roundRect(g, 0, 0, w * reveal, sub ? 150 : 104, 6); g.fill();
  g.fillStyle = C.yellow; g.fillRect(0, 0, 10, sub ? 150 : 104);
  g.beginPath(); g.rect(0, 0, w * reveal, 160); g.clip();
  g.fillStyle = color; font(g, 64); g.textBaseline = 'top'; g.fillText(text, 40, 18);
  if (sub) { g.fillStyle = C.grey; font(g, 30, 700); g.fillText(sub, 42, 100); }
  g.restore();
}

/** Subtitle-style centred line near the bottom (for narration lines). */
export function subtitle(g: G, t: number, t0: number, t1: number, text: string) {
  const a = env(t, t0, t1, 0.25, 0.2, 'outCubic');
  if (a <= 0) return;
  g.save(); g.globalAlpha = a; font(g, 44, 700); g.textAlign = 'center'; g.textBaseline = 'middle';
  const w = g.measureText(text).width + 60;
  g.fillStyle = 'rgba(17,20,24,0.6)'; roundRect(g, 960 - w / 2, 960, w, 70, 8); g.fill();
  g.fillStyle = C.paper; g.fillText(text, 960, 996); g.restore();
}

/** World-anchored callout: ring on the point, leader to a numbered label. */
export function callout(g: G, t: number, t0: number, t1: number, p: Pt, n: number, label: string, color = C.red, side: 1 | -1 = 1, lift = -140, labelY?: number) {
  if (!p.vis) return;
  const a = env(t, t0, t1, 0.45);
  if (a <= 0) return;
  const ring = ease.outBack(clamp((t - t0) / 0.35));
  const lead = ease.outCubic(clamp((t - t0 - 0.15) / 0.3));
  const txt = ease.outCubic(clamp((t - t0 - 0.3) / 0.3));
  g.save();
  g.globalAlpha = clamp(a * 1.5);
  g.lineWidth = 6; g.strokeStyle = color;
  g.beginPath(); g.arc(p.x, p.y, 46 * ring, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 2; g.globalAlpha *= 0.6; g.beginPath(); g.arc(p.x, p.y, 58 * ring + 6 * Math.sin(t * 6), 0, Math.PI * 2); g.stroke(); g.globalAlpha = clamp(a * 1.5);
  const ex = p.x + side * 50 * Math.SQRT1_2, ey = p.y - 50 * Math.SQRT1_2;
  const kx = ex + side * (labelY !== undefined ? 60 : 90) * lead, ky = labelY !== undefined ? lerp(ey, labelY, lead) : ey + lift * lead * 0.6;
  const lx = kx + side * (labelY !== undefined ? 60 : 120) * lead;
  g.lineWidth = 4; g.beginPath(); g.moveTo(ex, ey); g.lineTo(kx, ky); g.lineTo(lx, ky); g.stroke();
  if (txt > 0) {
    font(g, 46); const tw = g.measureText(label).width;
    const bx = side > 0 ? lx : lx - tw - 110, by = ky - 40;
    g.globalAlpha = clamp(a * 1.5) * txt;
    g.fillStyle = color; roundRect(g, bx, by, tw + 110, 80, 8); g.fill();
    g.fillStyle = C.paper; g.beginPath(); g.arc(bx + 42, by + 40, 26, 0, Math.PI * 2); g.fill();
    g.fillStyle = color; font(g, 38); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), bx + 42, by + 42);
    g.fillStyle = C.paper; font(g, 46); g.textAlign = 'left'; g.fillText(label, bx + 84, by + 42);
  }
  g.restore();
}

/** Dimension line between two projected points, with ticks and a label. */
export function dimension(g: G, t: number, t0: number, t1: number, p: Pt, q: Pt, label: string, offset: [number, number] = [0, 0], color = C.yellow) {
  if (!p.vis || !q.vis) return;
  const a = env(t, t0, t1, 0.4, 0.25, 'outCubic');
  if (a <= 0) return;
  const P = { x: p.x + offset[0], y: p.y + offset[1] }, Q = { x: q.x + offset[0], y: q.y + offset[1] };
  const k = ease.outCubic(clamp((t - t0) / 0.45));
  const mx = lerp(P.x, Q.x, 0.5), my = lerp(P.y, Q.y, 0.5);
  const ax = lerp(mx, P.x, k), ay = lerp(my, P.y, k), bx = lerp(mx, Q.x, k), by = lerp(my, Q.y, k);
  const dx = Q.x - P.x, dy = Q.y - P.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L * 16, ny = dx / L * 16;
  g.save(); g.globalAlpha = a; g.strokeStyle = color; g.lineWidth = 4;
  g.setLineDash([]); g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
  g.beginPath(); g.moveTo(ax - nx, ay - ny); g.lineTo(ax + nx, ay + ny); g.moveTo(bx - nx, by - ny); g.lineTo(bx + nx, by + ny); g.stroke();
  g.setLineDash([6, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(P.x, P.y); g.moveTo(q.x, q.y); g.lineTo(Q.x, Q.y); g.stroke(); g.setLineDash([]);
  if (k > 0.6) {
    font(g, 40); const tw = g.measureText(label).width;
    g.fillStyle = C.ink; roundRect(g, mx - tw / 2 - 18, my - 30, tw + 36, 60, 6); g.fill();
    g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, mx, my + 2);
  }
  g.restore();
}

/** Title card: stripes slam in, title letters drop one by one. */
export function titleCard(g: G, t: number, title: string, sub: string) {
  g.save();
  g.fillStyle = C.ink; g.fillRect(0, 0, 1920, 1080);
  const s1 = ease.outCubic(clamp(t / 0.4)), s2 = ease.outCubic(clamp((t - 0.1) / 0.4));
  hazardBand(g, -1920 + 1920 * s1, 250, 1920, 46, C.yellow, C.ink, t * 60);
  hazardBand(g, 1920 - 1920 * s2, 784, 1920, 46, C.yellow, C.ink, -t * 60);
  font(g, 260); g.textAlign = 'center'; g.textBaseline = 'middle';
  const chars = [...title];
  const total = chars.reduce((w, c) => w + g.measureText(c).width + 40, -40);
  let x = 960 - total / 2;
  chars.forEach((c, i) => {
    const w = g.measureText(c).width;
    const u = ease.outBack(clamp((t - 0.35 - i * 0.14) / 0.3));
    g.globalAlpha = clamp(u * 2);
    g.fillStyle = i === 1 ? C.yellow : C.paper;
    g.fillText(c, x + w / 2, 500 - (1 - u) * 160);
    x += w + 40;
  });
  const su = env(t, 0.9, 1e9, 0.4, 0.2, 'outCubic');
  g.globalAlpha = su; font(g, 48, 700); g.fillStyle = C.grey; g.fillText(sub, 960, 680);
  g.restore();
}

/** Character introduction card pinned next to a world point. */
export function characterCard(g: G, t: number, t0: number, p: Pt, name: string, lines: string[]) {
  const a = env(t, t0, 1e9, 0.4);
  if (a <= 0 || !p.vis) return;
  g.save();
  const x = p.x + 120, y = p.y - 220;
  g.globalAlpha = clamp(a * 1.4);
  g.strokeStyle = C.yellow; g.lineWidth = 4; g.beginPath(); g.moveTo(p.x + 30, p.y - 20); g.lineTo(x, y + 150); g.stroke();
  g.translate(x, y); g.scale(lerp(0.85, 1, a), lerp(0.85, 1, a));
  g.fillStyle = C.paper; roundRect(g, 0, 0, 520, 230, 10); g.fill();
  hazardBand(g, 0, 0, 520, 24, C.yellow, C.ink, 0);
  g.fillStyle = C.ink; font(g, 76); g.textBaseline = 'top'; g.fillText(name, 34, 44);
  font(g, 34, 700); g.fillStyle = '#39414a';
  lines.forEach((l, i) => g.fillText(l, 36, 138 + i * 44));
  g.restore();
}

/** Reason's Swiss-cheese model: three slices slide in, holes align, arrow passes through. */
export function swissCheese(g: G, t: number, t0: number, labels: string[]) {
  const a = env(t, t0, 1e9, 0.4, 0.2, 'outCubic');
  if (a <= 0) return;
  g.save();
  const X = 1300, Y = 250, W = 560, H = 470;
  g.globalAlpha = a; g.fillStyle = 'rgba(17,20,24,0.82)'; roundRect(g, X, Y, W, H + 140, 12); g.fill();
  g.fillStyle = C.paper; font(g, 34, 700); g.textBaseline = 'top'; g.fillText('瑞士奶酪模型 · 每一层防护都有漏洞', X + 30, Y + 24);
  for (let i = 0; i < 3; i++) {
    const u = ease.outBack(clamp((t - t0 - 0.3 - i * 0.25) / 0.4));
    const cx = X + 130 + i * 150, cy = Y + 280;
    g.save(); g.translate(cx, cy + (1 - u) * 300); g.transform(1, -0.35, 0, 1, 0, 0);
    g.globalAlpha = a * clamp(u * 2);
    g.fillStyle = '#F2C94C'; g.strokeStyle = '#B8860B'; g.lineWidth = 3;
    roundRect(g, -42, -150, 84, 300, 10); g.fill(); g.stroke();
    // holes; the aligned one at y=0 (appears last)
    g.fillStyle = 'rgba(17,20,24,0.85)';
    for (const [hx, hy, r] of [[-12, -95, 12], [14, 70, 15], [-8, 115, 9]]) { g.beginPath(); g.arc(hx, hy + i * 7, r, 0, Math.PI * 2); g.fill(); }
    const hole = ease.outBack(clamp((t - t0 - 1.3 - i * 0.2) / 0.35));
    g.fillStyle = C.red; g.beginPath(); g.arc(0, 0, 24 * hole, 0, Math.PI * 2); g.fill();
    g.restore();
    g.globalAlpha = a * clamp(u * 2);
    g.fillStyle = C.paper; font(g, 28, 700); g.textAlign = 'center'; g.fillText(labels[i], cx, Y + H + 40);
    g.fillStyle = C.red; font(g, 32); g.fillText(String(i + 1), cx, Y + H + 2);
    g.textAlign = 'left';
  }
  const arrow = ease.inOutCubic(clamp((t - t0 - 2.2) / 0.8));
  if (arrow > 0) {
    const y0 = Y + 280 - 0.35 * 0, x0 = X + 40, x1 = lerp(x0, X + W - 40, arrow);
    g.globalAlpha = a; g.strokeStyle = C.red; g.fillStyle = C.red; g.lineWidth = 10;
    g.beginPath(); g.moveTo(x0, y0 + 60); g.lineTo(x1, y0 + 60 - (x1 - x0) * 0.35 * 0.35); g.stroke();
    const ay = y0 + 60 - (x1 - x0) * 0.1225;
    g.beginPath(); g.moveTo(x1 + 18, ay); g.lineTo(x1 - 14, ay - 18); g.lineTo(x1 - 14, ay + 18); g.closePath(); g.fill();
    if (arrow > 0.95) { g.fillStyle = C.paper; font(g, 34); g.fillText('事故', X + W - 110, ay - 70); }
  }
  g.restore();
}

/** Big number card with a growing bar. */
export function statCard(g: G, t: number, value: number, label: string, source: string) {
  g.save();
  g.fillStyle = 'rgba(17,20,24,0.9)'; g.fillRect(0, 0, 1920, 1080);
  const k = ease.outCubic(clamp((t - 0.3) / 1.4));
  const a = env(t, 0.1, 1e9, 0.4, 0.2, 'outCubic');
  g.globalAlpha = a;
  font(g, 46, 700); g.fillStyle = C.grey; g.textBaseline = 'alphabetic'; g.fillText(label, 200, 330);
  font(g, 230); g.fillStyle = C.yellow; g.fillText((value * k).toFixed(2), 190, 560);
  const nw = g.measureText((value * k).toFixed(2)).width;
  font(g, 120); g.fillText('%', 200 + nw, 560);
  g.fillStyle = '#2a3038'; roundRect(g, 200, 640, 1520, 64, 32); g.fill();
  g.fillStyle = C.red; roundRect(g, 200, 640, Math.max(64, 1520 * (value / 100) * k), 64, 32); g.fill();
  const other = [['物体打击', 12.05], ['起重伤害', 6.53], ['坍塌', 6.53], ['其他', 15.82]] as const;
  let x = 200 + 1520 * value / 100;
  other.forEach(([n, v], i) => {
    const u = clamp((t - 1.6 - i * 0.12) / 0.3);
    const w = 1520 * v / 100;
    g.globalAlpha = a * u; g.fillStyle = ['#56606b', '#465059', '#3a434c', '#2f363e'][i]; g.fillRect(x, 648, w - 4, 48);
    font(g, 26, 700); g.fillStyle = C.grey; g.fillText(n, x + 6, 750);
    x += w;
  });
  g.globalAlpha = a; font(g, 28, 400); g.fillStyle = '#6f7a86'; g.fillText(source, 200, 900);
  g.restore();
}

/** Freeze-frame stamp: red frame corners + 'PAUSED' timecode. */
export function freezeUI(g: G, t: number, t0: number, code: string) {
  const a = env(t, t0, 1e9, 0.2, 0.2, 'outCubic');
  if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.strokeStyle = C.red; g.lineWidth = 8;
  const m = 60, L = 120;
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [1920 - m, m, -1, 1], [m, 1080 - m, 1, -1], [1920 - m, 1080 - m, -1, -1]]) {
    g.beginPath(); g.moveTo(x, y + sy * L); g.lineTo(x, y); g.lineTo(x + sx * L, y); g.stroke();
  }
  g.fillStyle = C.red; g.fillRect(m + 30, m + 30, 22, 64); g.fillRect(m + 64, m + 30, 22, 64);
  font(g, 44, 900); g.textBaseline = 'middle'; g.fillText('定格', m + 110, m + 64);
  font(g, 32, 700); g.fillStyle = C.paper; g.textAlign = 'right'; g.fillText(code, 1920 - m - 30, m + 64);
  g.restore();
}

/** Rewind overlay: ◀◀, scanlines, running timecode. */
export function rewindUI(g: G, t: number, t0: number, code: string) {
  const a = env(t, t0, 1e9, 0.1, 0.1, 'linear');
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = (t * 900) % 6; y < 1080; y += 6) g.fillRect(0, y, 1920, 2);
  g.fillStyle = C.paper;
  const x = 110, y = 110;
  for (const dx of [0, 46]) { g.beginPath(); g.moveTo(x + dx + 46, y); g.lineTo(x + dx, y + 30); g.lineTo(x + dx + 46, y + 60); g.closePath(); g.fill(); }
  font(g, 44, 900); g.textBaseline = 'middle'; g.fillText('倒带', x + 120, y + 32);
  font(g, 34, 700); g.textAlign = 'right'; g.fillText(code, 1810, y + 32);
  g.restore();
}

/** End card: three PPE icons land in sequence + slogan. */
export function endCard(g: G, t: number) {
  g.save();
  g.fillStyle = C.ink; g.fillRect(0, 0, 1920, 1080);
  hazardBand(g, 0, 0, 1920, 30, C.yellow, C.ink, t * 40);
  hazardBand(g, 0, 1050, 1920, 30, C.yellow, C.ink, -t * 40);
  const items = [
    { t: '下颏带系紧', icon: helmetIcon },
    { t: '安全带高挂', icon: hookIcon },
    { t: '临边不拆除', icon: railIcon },
  ];
  items.forEach((it, i) => {
    const u = ease.outBack(clamp((t - 0.2 - i * 0.3) / 0.45));
    const cx = 480 + i * 480, cy = 420;
    g.save(); g.globalAlpha = clamp(u * 2); g.translate(cx, cy - (1 - u) * 120);
    g.fillStyle = '#1d2229'; g.beginPath(); g.arc(0, 0, 150, 0, Math.PI * 2); g.fill();
    g.strokeStyle = C.yellow; g.lineWidth = 8; g.stroke();
    it.icon(g);
    g.fillStyle = C.paper; font(g, 58); g.textAlign = 'center'; g.textBaseline = 'top'; g.fillText(it.t, 0, 190);
    g.restore();
  });
  const s = env(t, 1.4, 1e9, 0.5, 0.2, 'outCubic');
  g.globalAlpha = s; g.textAlign = 'center'; g.fillStyle = C.grey; font(g, 40, 700); g.fillText('三宝 · 四口 · 五临边   安全帽 · 安全带 · 安全网', 960, 860);
  g.fillStyle = '#6f7a86'; font(g, 26, 400); g.fillText('依据：JGJ 59-2011 · JGJ 80-2016 · GB 23468-2025 · 住建部 2020 年房屋市政工程事故通报', 960, 930);
  g.restore();
}
function helmetIcon(g: G) {
  g.fillStyle = C.yellow; g.beginPath(); g.arc(0, 20, 90, Math.PI, 0); g.lineTo(110, 20); g.lineTo(110, 36); g.lineTo(-110, 36); g.lineTo(-110, 20); g.closePath(); g.fill();
  g.fillStyle = '#d9a700'; g.fillRect(-12, -70, 24, 90);
  g.strokeStyle = C.paper; g.lineWidth = 8; g.beginPath(); g.moveTo(-70, 36); g.quadraticCurveTo(0, 130, 70, 36); g.stroke();
}
function hookIcon(g: G) {
  g.strokeStyle = C.paper; g.lineWidth = 8; g.beginPath(); g.moveTo(-110, -70); g.lineTo(110, -70); g.stroke();
  g.strokeStyle = C.yellow; g.lineWidth = 16; g.beginPath(); g.arc(0, -40, 34, Math.PI * 1.1, Math.PI * 2.2); g.stroke();
  g.strokeStyle = '#ff8f00'; g.lineWidth = 14; g.beginPath(); g.moveTo(10, -10); g.quadraticCurveTo(30, 60, -10, 110); g.stroke();
  g.fillStyle = C.green; font(g, 56); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('↑', 70, 10);
}
function railIcon(g: G) {
  g.strokeStyle = C.red; g.lineWidth = 14;
  for (const x of [-90, 0, 90]) { g.beginPath(); g.moveTo(x, -80); g.lineTo(x, 90); g.stroke(); }
  g.strokeStyle = C.paper; for (const y of [-70, 0]) { g.beginPath(); g.moveTo(-110, y); g.lineTo(110, y); g.stroke(); }
  hazardBand(g, -110, 64, 220, 30, C.yellow, C.ink, 0);
}

export const fmtTime = (s: number) => { const m = Math.floor(s / 60), ss = Math.floor(s % 60), ff = Math.floor((s % 1) * 24); return `09:${String(40 + m).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(ff).padStart(2, '0')}`; };
export { invLerp };
