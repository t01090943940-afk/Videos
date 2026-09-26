import { SUBS, TITLE, SEAL, INSCRIPTION, type Sub } from "../timeline";
import { rng } from "../core/rng";

/**
 * MG LAYER — Chinese subtitles, the end title, the red seal and the inscription, drawn on the
 * 2D output canvas AFTER the painted plate (so type stays crisp at 1080p).
 * Every character is revealed on its own like ink touching wet paper: blur → sharp, soft rise.
 */
const SERIF = "'Noto Serif CJK SC'";
const CREAM = "#fbf3e2";
const GOLD = "#ffcf72";
const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
const sm = (u: number) => {
  u = clamp01(u);
  return u * u * (3 - 2 * u);
};
const outBack = (u: number) => {
  u = clamp01(u);
  const c1 = 1.9, c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
};

export async function loadFonts() {
  await Promise.all([
    document.fonts.load(`600 52px ${SERIF}`, "今晚月亮很圆学姐中秋快乐"),
    document.fonts.load(`900 120px ${SERIF}`, "学姐，中秋快乐！"),
    document.fonts.load(`700 60px ${SERIF}`, "加油"),
    document.fonts.load(`400 30px ${SERIF}`, "丙午中秋赠学姐"),
  ]);
  return document.fonts.check(`600 52px ${SERIF}`, "今晚月亮很圆");
}

interface Glyph {
  ch: string;
  x: number; // left
  w: number;
  at: number;
  gold: boolean;
}

function layoutSub(g: CanvasRenderingContext2D, s: Sub, size: number): { glyphs: Glyph[]; width: number } {
  g.font = `600 ${size}px ${SERIF}`;
  const glyphs: Glyph[] = [];
  let x = 0;
  for (const seg of s.segs) {
    const chars = Array.from(seg.text);
    const goldMask = new Array(chars.length).fill(false);
    for (const gw of seg.gold ?? []) {
      const i = seg.text.indexOf(gw);
      if (i >= 0) for (let k = 0; k < Array.from(gw).length; k++) goldMask[Array.from(seg.text.slice(0, i)).length + k] = true;
    }
    chars.forEach((ch, j) => {
      const w = g.measureText(ch).width;
      glyphs.push({ ch, x, w, at: seg.at + j * 0.055, gold: goldMask[j] });
      x += w + size * 0.04;
    });
  }
  return { glyphs, width: x - size * 0.04 };
}

/** a hand-carved seal: red stone, white characters, rough edge; drawn once (deterministic) */
let sealCanvas: HTMLCanvasElement | null = null;
function seal(sizePx: number) {
  if (sealCanvas) return sealCanvas;
  const S = sizePx;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const g = cv.getContext("2d")!;
  const r = rng(520);
  g.fillStyle = "#c3322b";
  const m = S * 0.06, rad = S * 0.12;
  g.beginPath();
  g.moveTo(m + rad, m);
  g.lineTo(S - m - rad, m);
  g.quadraticCurveTo(S - m, m, S - m, m + rad);
  g.lineTo(S - m, S - m - rad);
  g.quadraticCurveTo(S - m, S - m, S - m - rad, S - m);
  g.lineTo(m + rad, S - m);
  g.quadraticCurveTo(m, S - m, m, S - m - rad);
  g.lineTo(m, m + rad);
  g.quadraticCurveTo(m, m, m + rad, m);
  g.fill();
  // carve the two characters (white = paper), stacked vertically
  g.fillStyle = "#fbf1df";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `900 ${S * 0.38}px ${SERIF}`;
  g.fillText("加", S / 2, S * 0.3);
  g.fillText("油", S / 2, S * 0.71);
  // stone texture: paper specks through the ink, ragged edge
  g.globalCompositeOperation = "destination-out";
  for (let k = 0; k < 260; k++) {
    const onEdge = r() < 0.45;
    let x = r() * S, y = r() * S;
    if (onEdge) {
      const side = Math.floor(r() * 4);
      const p = r() * S;
      [x, y] = side === 0 ? [p, m + r() * 3] : side === 1 ? [p, S - m - r() * 3] : side === 2 ? [m + r() * 3, p] : [S - m - r() * 3, p];
    }
    g.globalAlpha = 0.25 + r() * 0.6;
    g.beginPath();
    g.arc(x, y, 0.6 + r() * (onEdge ? 2.6 : 1.3), 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";
  sealCanvas = cv;
  return cv;
}

export interface MGLayout {
  titleY: number; // 0..1 of height
}

export function drawMG(g: CanvasRenderingContext2D, W: number, H: number, t: number, lay: MGLayout = { titleY: 0.2 }) {
  const k = H / 1080;
  // ------------------------------------------------------------------ subtitles
  for (const s of SUBS) {
    const t0 = s.segs[0].at - 0.05;
    if (t < t0 || t > s.out + 0.5) continue;
    const size = Math.round(54 * k);
    const { glyphs, width } = layoutSub(g, s, size);
    const x0 = (W - width) / 2;
    const yB = H * 0.885;
    const lineOut = sm((t - s.out) / 0.38);
    // soft ink-wash band for legibility (fades with the line)
    const bandA = 0.34 * sm((t - t0) / 0.3) * (1 - lineOut);
    if (bandA > 0.003) {
      const gr = g.createRadialGradient(W / 2, yB - size * 0.35, 0, W / 2, yB - size * 0.35, width * 0.62 + 90 * k);
      gr.addColorStop(0, `rgba(10,14,34,${bandA})`);
      gr.addColorStop(1, "rgba(10,14,34,0)");
      g.save();
      g.translate(0, 0);
      g.scale(1, 0.22);
      g.fillStyle = gr;
      g.beginPath();
      g.ellipse(W / 2, (yB - size * 0.35) / 0.22, width * 0.62 + 90 * k, (width * 0.62 + 90 * k), 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    g.font = `600 ${size}px ${SERIF}`;
    g.textBaseline = "alphabetic";
    for (const gl of glyphs) {
      const a = sm((t - gl.at) / 0.34) * (1 - lineOut);
      if (a <= 0.002) continue;
      const blur = (1 - sm((t - gl.at) / 0.34)) * 7 * k + lineOut * 5 * k;
      const rise = (1 - sm((t - gl.at) / 0.4)) * 11 * k + lineOut * 8 * k;
      g.save();
      g.globalAlpha = a;
      if (blur > 0.3) g.filter = `blur(${blur.toFixed(2)}px)`;
      g.shadowColor = "rgba(6,10,28,0.85)";
      g.shadowBlur = 16 * k;
      g.fillStyle = gl.gold ? GOLD : CREAM;
      g.fillText(gl.ch, x0 + gl.x, yB - rise);
      g.restore();
    }
  }
  // ------------------------------------------------------------------ end title
  if (t >= TITLE.at - 0.02) {
    const size = Math.round(116 * k);
    g.font = `900 ${size}px ${SERIF}`;
    const chars = Array.from(TITLE.text);
    const gap = size * 0.03;
    const ws = chars.map((c) => g.measureText(c).width);
    const total = ws.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
    let x = (W - total) / 2;
    const yB = H * lay.titleY + size * 0.36;
    const goldStart = TITLE.text.indexOf("中秋快乐");
    chars.forEach((ch, i) => {
      const at = TITLE.at + i * 0.085;
      const u = (t - at) / 0.5;
      if (u > 0) {
        const a = sm(u * 1.4);
        const sc = 1.28 - 0.28 * outBack(u);
        const blur = (1 - sm(u)) * 14 * k;
        const cx = x + ws[i] / 2;
        // warm bloom behind each glyph as it lands
        const bloomA = 0.4 * Math.exp(-Math.pow((t - at - 0.25) / 0.35, 2));
        if (bloomA > 0.01) {
          const gr = g.createRadialGradient(cx, yB - size * 0.36, 0, cx, yB - size * 0.36, size * 0.9);
          gr.addColorStop(0, `rgba(255,205,120,${bloomA})`);
          gr.addColorStop(1, "rgba(255,205,120,0)");
          g.fillStyle = gr;
          g.fillRect(cx - size, yB - size * 1.3, size * 2, size * 2);
        }
        g.save();
        g.globalAlpha = a;
        g.translate(cx, yB - size * 0.36);
        g.scale(sc, sc);
        if (blur > 0.3) g.filter = `blur(${blur.toFixed(2)}px)`;
        g.shadowColor = "rgba(8,10,30,0.8)";
        g.shadowBlur = 24 * k;
        g.fillStyle = i >= goldStart && i < goldStart + 4 ? GOLD : CREAM;
        g.textBaseline = "middle";
        g.textAlign = "center";
        g.fillText(ch, 0, 0);
        g.restore();
      }
      x += ws[i] + gap;
    });
    // ------------------------------------------------------------------ seal (lands with her fist pump)
    const su = (t - (SEAL.at - 0.26)) / 0.26; // lands exactly on SEAL.at (with her fist pump + the thump)
    if (su > -0.05) {
      const S = Math.round(122 * k);
      const cv = seal(S);
      const sx = (W + total) / 2 + 46 * k, sy = yB - size * 0.2;
      const sc = su < 1 ? 1.9 - 0.9 * sm(su) : 1 + 0.05 * Math.exp(-(t - SEAL.at) * 12) * Math.sin((t - SEAL.at) * 40);
      const a = sm(su * 3);
      // impact ring
      if (su > 0.9 && su < 4) {
        const rr = (su - 0.9) / 3.1;
        g.save();
        g.globalAlpha = (1 - rr) * 0.5;
        g.strokeStyle = "#e86a4f";
        g.lineWidth = 3 * k;
        g.beginPath();
        g.arc(sx, sy, S * (0.62 + rr * 0.7), 0, Math.PI * 2);
        g.stroke();
        g.restore();
      }
      g.save();
      g.globalAlpha = a;
      g.translate(sx, sy);
      g.rotate(-0.07);
      g.scale(sc, sc);
      g.shadowColor = "rgba(0,0,0,0.35)";
      g.shadowBlur = 10 * k;
      g.drawImage(cv, -S / 2, -S / 2, S, S);
      g.restore();
    }
    // ------------------------------------------------------------------ inscription
    const iu = (t - INSCRIPTION.at) / 0.7;
    if (iu > 0) {
      const size2 = Math.round(30 * k);
      g.save();
      g.font = `400 ${size2}px ${SERIF}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.globalAlpha = sm(iu) * 0.92;
      if (iu < 1) g.filter = `blur(${((1 - sm(iu)) * 4 * k).toFixed(2)}px)`;
      g.shadowColor = "rgba(6,10,28,0.8)";
      g.shadowBlur = 10 * k;
      g.fillStyle = "#efe2c4";
      const text = Array.from(INSCRIPTION.text).join(" ");
      g.fillText(text, W / 2, yB + size * 0.52);
      g.restore();
    }
  }
}
