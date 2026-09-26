import type { MgItem, Shot, StageTime } from "./types";
import { clamp01, ease } from "./rng";

/**
 * MG (motion-graphics) layer: flat 2D information drawn over the 3D plate — titles, chips,
 * lower thirds, end cards. Stop-motion ACTS; MG EXPLAINS. MG runs on the continuous clock.
 */
export const FONT = "'Noto Sans CJK SC', 'Noto Sans CJK', sans-serif";

export interface MgContext {
  g: CanvasRenderingContext2D;
  w: number;
  h: number;
  shot: Shot;
  time: StageTime;
  accent: string;
}

type Drawer = (c: MgContext, it: MgItem, k: number, local: number) => void;

function inOut(it: MgItem, t: number, fade = 0.35) {
  const a = clamp01((t - it.from) / fade), b = clamp01((it.to - t) / fade);
  return Math.min(ease.out(a), ease.out(b));
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export const MG: Record<string, Drawer> = {
  /** big centered title with a subtitle (opening / end) */
  title(c, it, k) {
    const { g, w, h } = c;
    g.save();
    g.globalAlpha = k;
    const y = h * ((it.y as number) ?? 0.42) + (1 - k) * 18;
    g.textAlign = "center";
    if (it.panel) {
      g.font = `800 ${(it.size as number) ?? 86}px ${FONT}`;
      const tw = g.measureText(it.text ?? "").width + 120;
      const ph = (it.size as number ?? 86) + (it.sub ? 90 : 40);
      g.fillStyle = "rgba(14,16,21,0.62)";
      roundRect(g, w / 2 - tw / 2, y - (it.size as number ?? 86) - 18, tw, ph, 22);
      g.fill();
    }
    g.shadowColor = "rgba(0,0,0,0.45)";
    g.shadowBlur = 18;
    g.fillStyle = (it.color as string) ?? "#fbf7ef";
    g.font = `800 ${(it.size as number) ?? 86}px ${FONT}`;
    g.fillText(it.text ?? "", w / 2, y);
    if (it.sub) {
      g.font = `500 ${(it.subSize as number) ?? 30}px ${FONT}`;
      g.fillStyle = (it.subColor as string) ?? "#f2ead8";
      g.fillText(it.sub, w / 2, y + ((it.subGap as number) ?? 58));
    }
    g.restore();
  },
  /** top-left index chip "02 / 06" with the accent color */
  chip(c, it, k) {
    const { g } = c;
    g.save();
    g.globalAlpha = k;
    const x = 44 - (1 - k) * 30, y = 40;
    g.fillStyle = (it.color as string) ?? c.accent;
    roundRect(g, x, y, 128, 40, 20);
    g.fill();
    g.fillStyle = "#15171c";
    g.font = `800 22px ${FONT}`;
    g.textAlign = "center";
    g.fillText(it.text ?? "", x + 64, y + 28);
    g.restore();
  },
  /** lower third: small tag line, big style name (zh), English line */
  lower(c, it, k) {
    const { g, h } = c;
    g.save();
    g.globalAlpha = k;
    const x = 56 - (1 - k) * 40, y = h - 118;
    g.font = `800 50px ${FONT}`;
    const wName = g.measureText(it.text ?? "").width;
    g.font = `600 21px ${FONT}`;
    const wSub = g.measureText(it.sub ?? "").width;
    const bw = Math.max(wName, wSub, 300) + 48;
    g.fillStyle = "rgba(14,16,21,0.74)";
    roundRect(g, x - 18, y - 84, bw, 142, 16);
    g.fill();
    g.fillStyle = (it.color as string) ?? c.accent;
    g.fillRect(x - 18, y - 84, 8, 142);
    g.textAlign = "left";
    if (it.tags) {
      g.font = `600 18px ${FONT}`;
      g.fillStyle = (it.color as string) ?? c.accent;
      g.fillText(String(it.tags), x + 8, y - 52);
    }
    g.font = `800 50px ${FONT}`;
    g.fillStyle = "#fbf7ef";
    g.fillText(it.text ?? "", x + 6, y + 4);
    g.font = `600 21px ${FONT}`;
    g.fillStyle = "#c9ccd4";
    g.fillText(it.sub ?? "", x + 8, y + 40);
    g.restore();
  },
  /** small caption line (who is doing what) at the top right */
  note(c, it, k) {
    const { g, w } = c;
    g.save();
    g.globalAlpha = k * 0.95;
    g.textAlign = "right";
    g.font = `600 22px ${FONT}`;
    g.fillStyle = "#fbf7ef";
    g.shadowColor = "rgba(0,0,0,0.6)";
    g.shadowBlur = 8;
    g.fillText(it.text ?? "", w - 48, 70);
    if (it.sub) {
      g.font = `500 17px ${FONT}`;
      g.fillStyle = "#e3e5ea";
      g.fillText(it.sub, w - 48, 98);
    }
    g.restore();
  },
  /** labels under each band of a split-screen */
  bandLabels(c, it, _k, local) {
    const { g, w, h, shot } = c;
    const b = shot.bands;
    if (!b) return;
    const n = b.looks.length;
    const labels = (it.labels as string[]) ?? b.looks;
    g.save();
    g.textAlign = "center";
    for (let i = 0; i < n; i++) {
      const kk = clamp01((local - b.start - i * b.stagger - 0.3) / 0.4);
      if (kk <= 0) continue;
      g.globalAlpha = ease.out(kk) * clamp01((it.to - local) / 0.4);
      const cx = ((i + 0.5) / n) * w;
      g.fillStyle = "rgba(14,16,21,0.75)";
      roundRect(g, cx - 78, h - 86 + (1 - kk) * 10, 156, 40, 20);
      g.fill();
      g.fillStyle = "#fbf7ef";
      g.font = `700 20px ${FONT}`;
      g.fillText(labels[i], cx, h - 59 + (1 - kk) * 10);
    }
    g.restore();
  },
  /** persistent small watermark */
  mark(c, it, k) {
    const { g, w, h } = c;
    g.save();
    g.globalAlpha = 0.75 * k;
    g.textAlign = "right";
    g.font = `700 18px ${FONT}`;
    g.fillStyle = "#fbf7ef";
    g.shadowColor = "rgba(0,0,0,0.5)";
    g.shadowBlur = 6;
    g.fillText(it.text ?? "stop-motion-3d", w - 36, h - 30);
    g.restore();
  },
};

export function drawMG(c: MgContext) {
  for (const it of c.shot.mg ?? []) {
    const t = c.time.t;
    if (t < it.from || t > it.to) continue;
    const k = inOut(it, t, (it.fade as number) ?? 0.35);
    const d = MG[it.kind];
    if (d) d(c, it, k, t);
  }
}
