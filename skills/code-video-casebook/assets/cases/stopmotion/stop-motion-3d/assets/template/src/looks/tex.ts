import * as THREE from "three";
import { rng, hash } from "../runtime/rng";

/**
 * Procedural texture helpers (browser canvas). All deterministic. Detail maps are gray around
 * 0.8–1.0 and are MULTIPLIED by the semantic color, so one texture serves every tint.
 */
const cache = new Map<string, THREE.Texture>();

function canvasTex(id: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, o: { nearest?: boolean; srgb?: boolean } = {}) {
  const hit = cache.get(id);
  if (hit) return hit;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d")!;
  draw(g, rng(hash(id)));
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (o.nearest) {
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
  } else t.anisotropy = 4;
  t.colorSpace = o.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  cache.set(id, t);
  return t;
}

const gray = (v: number) => `rgb(${v},${v},${v})`;

export const TEX = {
  planks: () =>
    canvasTex("planks", 256, 256, (g, r) => {
      for (let i = 0; i < 8; i++) {
        const base = 205 + r() * 40;
        g.fillStyle = gray(base | 0);
        g.fillRect(0, i * 32, 256, 32);
        for (let k = 0; k < 40; k++) {
          g.fillStyle = `rgba(80,60,40,${0.04 + r() * 0.06})`;
          g.fillRect(r() * 256, i * 32 + r() * 32, 30 + r() * 80, 1 + r() * 1.5);
        }
        g.fillStyle = "rgba(40,30,20,0.35)";
        g.fillRect(0, i * 32, 256, 1.5);
        g.fillRect(((i * 97) % 256) | 0, i * 32, 1.5, 32);
      }
    }),
  brick: () =>
    canvasTex("brick", 256, 256, (g, r) => {
      g.fillStyle = gray(236);
      g.fillRect(0, 0, 256, 256);
      for (let row = 0; row < 8; row++)
        for (let c = -1; c < 5; c++) {
          const x = c * 64 + (row % 2) * 32 + 2, y = row * 32 + 2;
          g.fillStyle = gray((190 + r() * 55) | 0);
          g.fillRect(x, y, 60, 28);
          for (let k = 0; k < 6; k++) {
            g.fillStyle = `rgba(0,0,0,${r() * 0.08})`;
            g.fillRect(x + r() * 56, y + r() * 24, 4, 3);
          }
        }
    }),
  plaster: () =>
    canvasTex("plaster", 256, 256, (g, r) => {
      g.fillStyle = gray(240);
      g.fillRect(0, 0, 256, 256);
      for (let k = 0; k < 1400; k++) {
        g.fillStyle = `rgba(0,0,0,${r() * 0.035})`;
        g.fillRect(r() * 256, r() * 256, 2 + r() * 6, 2 + r() * 6);
      }
    }),
  fabric: () =>
    canvasTex("fabric", 64, 64, (g, r) => {
      for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
        g.fillStyle = gray((((x + y) % 4 < 2 ? 228 : 246) - r() * 18) | 0);
        g.fillRect(x, y, 1, 1);
      }
    }),
  /** 16×16 pixel-art noise for the block look (per material family) */
  pixel: (family: string) =>
    canvasTex(`px:${family}`, 16, 16, (g, r) => {
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        let v = 200 + r() * 55;
        if (family === "planks" && y % 4 === 0) v = 150;
        if (family === "planks" && x === ((y >> 2) * 5) % 16) v = 160;
        if (family === "brick" && (y % 4 === 0 || (x + (y >> 2) * 4) % 8 === 0)) v = 245;
        if (family === "brick" && !(y % 4 === 0 || (x + (y >> 2) * 4) % 8 === 0)) v = 150 + r() * 40;
        if (family === "leaf" && r() < 0.2) v = 140;
        g.fillStyle = gray(v | 0);
        g.fillRect(x, y, 1, 1);
      }
    }, { nearest: true }),
  /** fingerprints + lumps for clay (bump map) */
  clayBump: () =>
    canvasTex("clayBump", 128, 128, (g, r) => {
      g.fillStyle = gray(128);
      g.fillRect(0, 0, 128, 128);
      for (let k = 0; k < 90; k++) {
        const x = r() * 128, y = r() * 128, rad = 6 + r() * 18;
        for (let ring = 0; ring < rad; ring += 2.2) {
          g.strokeStyle = `rgba(${r() < 0.5 ? "255,255,255" : "0,0,0"},0.05)`;
          g.lineWidth = 1;
          g.beginPath();
          g.arc(x, y, ring, 0, Math.PI * 2);
          g.stroke();
        }
      }
      for (let k = 0; k < 300; k++) {
        g.fillStyle = `rgba(${r() < 0.5 ? "255,255,255" : "0,0,0"},0.06)`;
        g.beginPath();
        g.arc(r() * 128, r() * 128, 2 + r() * 5, 0, Math.PI * 2);
        g.fill();
      }
    }),
  /** paper fiber for the collage / sketch / watercolor looks (used in post) */
  paper: () =>
    canvasTex("paperFiber", 512, 512, (g, r) => {
      g.fillStyle = gray(236);
      g.fillRect(0, 0, 512, 512);
      for (let k = 0; k < 5000; k++) {
        g.strokeStyle = `rgba(${r() < 0.5 ? "255,255,255" : "90,80,70"},${0.05 + r() * 0.07})`;
        g.lineWidth = 0.6;
        g.beginPath();
        const x = r() * 512, y = r() * 512, a = r() * Math.PI;
        g.moveTo(x, y);
        g.lineTo(x + Math.cos(a) * (4 + r() * 12), y + Math.sin(a) * (4 + r() * 12));
        g.stroke();
      }
    }),
};
