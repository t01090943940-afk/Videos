import * as THREE from "three";
import { rng, hash } from "./rng";

/**
 * Deterministic canvas textures. Nothing here is loaded from disk or the network:
 * paper, glow, the face (three expressions), book spines, mooncake, lantern paper,
 * osmanthus flower, and the painted far landscape.
 */
const cache = new Map<string, THREE.Texture>();

function canvasTex(
  id: string,
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, r: () => number) => void,
  o: { srgb?: boolean; repeat?: boolean; mip?: boolean } = {},
) {
  const hit = cache.get(id);
  if (hit) return hit;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d")!;
  draw(g, rng(hash(id)));
  const t = new THREE.CanvasTexture(cv);
  if (o.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = o.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (o.mip === false) {
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
  }
  cache.set(id, t);
  return t;
}

const SERIF = "'Noto Serif CJK SC', 'Noto Serif CJK JP', serif";

export const TEX = {
  /** paper fiber (post-process multiplies it in) */
  paper: () =>
    canvasTex(
      "paperFiber",
      512,
      512,
      (g, r) => {
        g.fillStyle = "rgb(236,236,236)";
        g.fillRect(0, 0, 512, 512);
        for (let k = 0; k < 5200; k++) {
          g.strokeStyle = `rgba(${r() < 0.5 ? "255,255,255" : "90,80,70"},${0.05 + r() * 0.07})`;
          g.lineWidth = 0.6;
          g.beginPath();
          const x = r() * 512, y = r() * 512, a = r() * Math.PI;
          g.moveTo(x, y);
          g.lineTo(x + Math.cos(a) * (4 + r() * 12), y + Math.sin(a) * (4 + r() * 12));
          g.stroke();
        }
        // cold-press tooth: soft blotches
        for (let k = 0; k < 900; k++) {
          g.fillStyle = `rgba(${r() < 0.5 ? "255,255,255" : "70,60,55"},${0.02 + r() * 0.03})`;
          g.beginPath();
          g.arc(r() * 512, r() * 512, 1.5 + r() * 4, 0, Math.PI * 2);
          g.fill();
        }
      },
      { srgb: false, repeat: true },
    ),

  /** knit: soft vertical ribs + a little fuzz (multiplied into the sweater color) */
  knit: () => {
    const t = canvasTex(
      "knit",
      128,
      128,
      (g, r) => {
        g.fillStyle = "#ffffff";
        g.fillRect(0, 0, 128, 128);
        for (let x = 0; x < 128; x += 8) {
          g.fillStyle = "rgba(0,0,0,0.13)";
          g.fillRect(x, 0, 2, 128);
          g.fillStyle = "rgba(255,255,255,0.5)";
          g.fillRect(x + 4, 0, 2, 128);
        }
        for (let k = 0; k < 500; k++) {
          g.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.05})`;
          g.fillRect(r() * 128, r() * 128, 1 + r() * 2, 2 + r() * 3);
        }
      },
      { repeat: true },
    );
    t.repeat.set(6, 3);
    return t;
  },

  /** soft radial glow for additive sprites */
  glow: () =>
    canvasTex(
      "glow",
      128,
      128,
      (g) => {
        const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.18, "rgba(255,255,255,0.75)");
        gr.addColorStop(0.45, "rgba(255,255,255,0.22)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, 128, 128);
      },
      { srgb: false },
    ),

  /** a small bright core for light motes */
  core: () =>
    canvasTex(
      "core",
      64,
      64,
      (g) => {
        const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.35, "rgba(255,255,255,0.9)");
        gr.addColorStop(0.6, "rgba(255,255,255,0.25)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 64);
      },
      { srgb: false },
    ),

  /**
   * Face decal, drawn in (azimuth, latitude) space of the head sphere: u spans ±CAP_H, v ±CAP_V.
   * kind: focus (reading, lids lowered) | look (eyes open, looking up) | smile (happy ^ ^)
   */
  face: (kind: "focus" | "look" | "gaze" | "smile" | "blink") =>
    canvasTex(`face:${kind}`, 512, 512, (g) => {
      const CAP_H = 75, CAP_V = 70;
      const X = (az: number) => 256 + (az / CAP_H) * 256;
      const Y = (lat: number) => 256 - (lat / CAP_V) * 256;
      g.clearRect(0, 0, 512, 512);
      // blush
      for (const s of [-1, 1]) {
        const gr = g.createRadialGradient(X(s * 37), Y(-19), 0, X(s * 37), Y(-19), 34);
        gr.addColorStop(0, kind === "smile" || kind === "gaze" ? "rgba(240,122,122,0.66)" : "rgba(240,140,135,0.45)");
        gr.addColorStop(1, "rgba(240,140,135,0)");
        g.fillStyle = gr;
        g.beginPath();
        g.ellipse(X(s * 37), Y(-19), 40, 26, 0, 0, Math.PI * 2);
        g.fill();
      }
      const ink = "#2a1c1f";
      const iris = "#4a2f2c";
      g.lineCap = "round";
      g.lineJoin = "round";
      for (const s of [-1, 1]) {
        const ex = X(s * 24), ey = Y(-6);
        if (kind === "blink") {
          // gently closed: a lid line bowed downward + lashes
          g.strokeStyle = ink;
          g.lineWidth = 7;
          g.beginPath();
          g.moveTo(ex - 21, ey - 2);
          g.quadraticCurveTo(ex, ey + 13, ex + 21, ey - 2);
          g.stroke();
          g.lineWidth = 4.5;
          g.beginPath();
          g.moveTo(ex + s * 20, ey - 1);
          g.lineTo(ex + s * 28, ey - 6);
          g.stroke();
        } else if (kind === "smile") {
          // happy closed eyes: arcs bowed upward
          g.strokeStyle = ink;
          g.lineWidth = 8;
          g.beginPath();
          g.moveTo(ex - 21, ey + 7);
          g.quadraticCurveTo(ex, ey - 19, ex + 21, ey + 7);
          g.stroke();
          // lash flick at the outer corner
          g.lineWidth = 5;
          g.beginPath();
          g.moveTo(ex + s * 20, ey + 5);
          g.lineTo(ex + s * 29, ey + 1);
          g.stroke();
        } else {
          const lookUp = kind === "look" || kind === "gaze";
          // iris: dark oval with warm lower half
          const iy = lookUp ? ey - 4 : ey + 7;
          const gr = g.createLinearGradient(0, iy - 26, 0, iy + 26);
          gr.addColorStop(0, "#1f1517");
          gr.addColorStop(0.65, iris);
          gr.addColorStop(1, "#7a4a3a");
          g.fillStyle = gr;
          g.save();
          g.beginPath();
          // clip to the part below the upper lid
          const lidY = lookUp ? ey - 22 : ey - 2;
          g.rect(ex - 40, lidY, 80, 80);
          g.clip();
          g.beginPath();
          g.ellipse(ex, iy, 19, 26, 0, 0, Math.PI * 2);
          g.fill();
          // highlights
          g.fillStyle = "rgba(255,255,255,0.95)";
          g.beginPath();
          g.ellipse(ex + s * -6, iy - 10, kind === "gaze" ? 7 : 5.5, kind === "gaze" ? 8 : 6.5, 0, 0, Math.PI * 2);
          g.fill();
          g.fillStyle = "rgba(255,255,255,0.6)";
          g.beginPath();
          g.ellipse(ex + s * 6, iy + 9, 3, 3, 0, 0, Math.PI * 2);
          g.fill();
          g.restore();
          // upper lid line (thick), slightly arched; lowered when focused
          g.strokeStyle = ink;
          g.lineWidth = lookUp ? 7 : 8.5;
          g.beginPath();
          g.moveTo(ex - 22, lidY + (lookUp ? 7 : 3));
          g.quadraticCurveTo(ex, lidY - (lookUp ? 9 : 5), ex + 23, lidY + (lookUp ? 6 : 2));
          g.stroke();
          // lash flick
          g.lineWidth = 4.5;
          g.beginPath();
          g.moveTo(ex + s * 21, lidY + (lookUp ? 4 : 1));
          g.lineTo(ex + s * 30, lidY - (lookUp ? 3 : 2));
          g.stroke();
          // brows (soft)
          g.strokeStyle = "rgba(60,40,38,0.55)";
          g.lineWidth = 4;
          g.beginPath();
          const by = lookUp ? Y(15) : Y(12);
          g.moveTo(ex - 16, by + 3);
          g.quadraticCurveTo(ex, by - 5, ex + 17, by + (lookUp ? 1 : 3));
          g.stroke();
        }
      }
      // mouth
      const mx = X(0), my = Y(-27);
      if (kind === "smile") {
        g.fillStyle = "#9c3f3d";
        g.beginPath();
        g.moveTo(mx - 15, my - 3);
        g.quadraticCurveTo(mx, my + 20, mx + 15, my - 3);
        g.closePath();
        g.fill();
        g.fillStyle = "#e0797a";
        g.beginPath();
        g.ellipse(mx, my + 7, 7, 4, 0, 0, Math.PI * 2);
        g.fill();
      } else if (kind === "gaze") {
        g.strokeStyle = "#a4504a";
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(mx - 14, my - 3);
        g.quadraticCurveTo(mx, my + 11, mx + 14, my - 3);
        g.stroke();
      } else {
        g.strokeStyle = "#a4504a";
        g.lineWidth = 4.5;
        g.beginPath();
        g.moveTo(mx - 9, my);
        g.quadraticCurveTo(mx, my + (kind === "look" ? 6 : 3), mx + 9, my);
        g.stroke();
      }
    }),

  /** book spine with a title; w×h in px (h small) */
  spine: (title: string, bg: string, fg: string) =>
    canvasTex(`spine:${title}:${bg}`, 512, 64, (g, r) => {
      g.fillStyle = bg;
      g.fillRect(0, 0, 512, 64);
      g.fillStyle = "rgba(255,255,255,0.08)";
      g.fillRect(0, 6, 512, 3);
      g.fillRect(0, 55, 512, 3);
      g.fillStyle = fg;
      g.font = `700 40px ${SERIF}`;
      g.textBaseline = "middle";
      g.fillText(title, 40 + r() * 30, 34);
    }),

  /** mooncake top: scalloped rim + ring + osmanthus flower (no characters) */
  mooncake: () =>
    canvasTex("mooncake", 256, 256, (g) => {
      g.fillStyle = "#c8894a";
      g.fillRect(0, 0, 256, 256);
      const c = 128;
      g.strokeStyle = "rgba(120,70,30,0.8)";
      g.lineWidth = 5;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        g.beginPath();
        g.arc(c + Math.cos(a) * 96, c + Math.sin(a) * 96, 16, a + Math.PI * 0.5, a + Math.PI * 1.5);
        g.stroke();
      }
      g.beginPath();
      g.arc(c, c, 70, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "rgba(240,190,120,0.9)";
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        g.beginPath();
        g.ellipse(c + Math.cos(a) * 20, c + Math.sin(a) * 20, 18, 11, a, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = "rgba(120,70,30,0.9)";
      g.beginPath();
      g.arc(c, c, 7, 0, Math.PI * 2);
      g.fill();
    }),

  /** lantern paper: warm red with vertical ribs and a soft hot center (u around, v up) */
  lantern: () =>
    canvasTex("lanternPaper", 256, 128, (g) => {
      const gr = g.createLinearGradient(0, 0, 0, 128);
      gr.addColorStop(0, "#b8322a");
      gr.addColorStop(0.5, "#ea5a3c");
      gr.addColorStop(1, "#b8322a");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 128);
      g.strokeStyle = "rgba(90,20,15,0.55)";
      g.lineWidth = 3;
      for (let i = 0; i < 16; i++) {
        const x = (i / 16) * 256;
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, 128);
        g.stroke();
      }
    }),

  /** osmanthus flower (four round petals, golden) */
  flower: () =>
    canvasTex("osmanthus", 64, 64, (g) => {
      g.clearRect(0, 0, 64, 64);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const gr = g.createRadialGradient(32 + Math.cos(a) * 11, 32 + Math.sin(a) * 11, 1, 32 + Math.cos(a) * 11, 32 + Math.sin(a) * 11, 13);
        gr.addColorStop(0, "rgba(255,214,120,1)");
        gr.addColorStop(0.8, "rgba(240,160,50,1)");
        gr.addColorStop(1, "rgba(240,160,50,0)");
        g.fillStyle = gr;
        g.beginPath();
        g.arc(32 + Math.cos(a) * 11, 32 + Math.sin(a) * 11, 13, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = "rgba(200,110,30,1)";
      g.beginPath();
      g.arc(32, 32, 4, 0, Math.PI * 2);
      g.fill();
    }),

  /**
   * Far landscape, painted: each layer is a colored silhouette with a moonlit rim on its top edge
   * and a mist wash at its foot. u = azimuth (canvas x = 0 ↔ −108.9°), v = up.
   * layer 0 = far hills, 1 = old town roofs + pagoda, 2 = near tree line.
   */
  skyline: (layer: 0 | 1 | 2 | 3) =>
    canvasTex(
      `skyline2:${layer}`,
      2048,
      256,
      (g, r) => {
        const H = 256;
        g.clearRect(0, 0, 2048, 256);
        const azX = (az: number) => ((az + 108.9) / 217.7) * 2048;
        const body = ["#3a4474", "#232a4f", "#141a31", "#0f1426"][layer];
        const rim = ["#6f78a6", "#4c5688", "#2c3558", "#2a3152"][layer];
        const shape = (dy: number) => {
          g.beginPath();
          if (layer === 0) {
            g.moveTo(0, H);
            for (let x = 0; x <= 2048; x += 6) {
              const y = H - (58 + 34 * Math.sin(x * 0.0029 + 1.2) + 20 * Math.sin(x * 0.0083 + 0.3) + 7 * Math.sin(x * 0.023 + 2.0));
              g.lineTo(x, y + dy);
            }
            g.lineTo(2048, H);
            g.closePath();
            g.fill();
            return;
          }
          if (layer === 3) {
            // courtyard: big soft crowns with golden osmanthus specks come later (post pass)
            const rr = (() => { let a = 23; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
            g.moveTo(0, H);
            for (let x = -60; x < 2120; x += 40 + rr() * 60) {
              const rad = 34 + rr() * 46;
              const cy = H - 70 - rad * 0.35 - rr() * 30;
              g.moveTo(x + rad, cy + dy);
              g.arc(x, cy + dy, rad, 0, Math.PI * 2);
              g.moveTo(x + rad * 0.8 + 30, cy + 22 + dy);
              g.arc(x + 30, cy + 22 + dy, rad * 0.8, 0, Math.PI * 2);
            }
            g.rect(0, H - 80 + dy, 2048, 80);
            g.fill();
            return;
          }
          if (layer === 2) {
            const rr = (() => { let a = 7; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
            g.moveTo(0, H);
            for (let x = -30; x < 2100; x += 22 + rr() * 26) {
              const rad = 13 + rr() * 22;
              g.moveTo(x + rad, H - 20 - rad * 0.55 + dy);
              g.arc(x, H - 20 - rad * 0.55 + dy, rad, 0, Math.PI * 2);
            }
            g.rect(0, H - 22 + dy, 2048, 22);
            g.fill();
            return;
          }
          // layer 1: roofs with curved eaves + a pagoda + a round-roofed pavilion
          const roof = (x: number, w: number, base: number, h: number) => {
            g.moveTo(x - w * 0.62, H - base + dy);
            g.quadraticCurveTo(x - w * 0.44, H - base - h * 0.3 + dy, x - w * 0.3, H - base - h + dy);
            g.lineTo(x + w * 0.3, H - base - h + dy);
            g.quadraticCurveTo(x + w * 0.44, H - base - h * 0.3 + dy, x + w * 0.62, H - base + dy);
            g.lineTo(x + w * 0.62, H);
            g.lineTo(x - w * 0.62, H);
            g.closePath();
          };
          const rr = (() => { let a = 11; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
          for (let x = -40; x < 2100; x += 50 + rr() * 60) {
            const w = 60 + rr() * 80;
            const base = 16 + rr() * 16;
            roof(x, w, base, 12 + rr() * 11);
            g.rect(x - w * 0.5, H - base, w, base);
          }
          const px = azX(-14);
          let b = 34;
          for (let k = 0; k < 6; k++) {
            const w = 78 - k * 9;
            g.rect(px - w * 0.3, H - b - 15 + dy, w * 0.6, 15);
            roof(px, w, b + 13, 10);
            b += 23;
          }
          g.moveTo(px - 2.5, H - b - 6 + dy);
          g.lineTo(px, H - b - 30 + dy);
          g.lineTo(px + 2.5, H - b - 6 + dy);
          g.closePath();
          const vx = azX(31);
          g.moveTo(vx - 46, H - 40 + dy);
          g.quadraticCurveTo(vx, H - 96 + dy, vx + 46, H - 40 + dy);
          g.closePath();
          g.rect(vx - 30, H - 42, 60, 42);
          g.fill();
        };
        g.fillStyle = rim;
        shape(0);
        g.fillStyle = body;
        shape(3.2);
        // mist wash at the foot of the layer
        g.globalCompositeOperation = "source-atop";
        const mg = g.createLinearGradient(0, H - 70, 0, H);
        mg.addColorStop(0, "rgba(120,130,180,0)");
        mg.addColorStop(1, `rgba(120,130,185,${[0.5, 0.42, 0.3, 0.12][layer]})`);
        g.fillStyle = mg;
        g.fillRect(0, H - 70, 2048, 70);
        if (layer === 3) {
          for (let k = 0; k < 700; k++) {
            g.fillStyle = `rgba(242,${160 + Math.floor(r() * 50)},60,${0.35 + r() * 0.4})`;
            g.beginPath();
            g.arc(r() * 2048, H - 60 - r() * 120, 0.8 + r() * 1.6, 0, Math.PI * 2);
            g.fill();
          }
        }
        // a few dry-brush specks
        for (let k = 0; k < 900; k++) {
          g.fillStyle = `rgba(${r() < 0.5 ? "255,255,255" : "0,0,0"},${0.04 + r() * 0.05})`;
          g.fillRect(r() * 2048, H - r() * 140, 1 + r() * 3, 1 + r() * 2);
        }
        g.globalCompositeOperation = "source-over";
      },
      { srgb: true },
    ),
};

export function faceCapUV() {
  return { capH: (75 * Math.PI) / 180, capV: (70 * Math.PI) / 180 };
}
