import * as THREE from "three";
import { rng } from "../runtime/rng";

/**
 * Painted backdrop seen through the windows: sky gradient + two rows of city silhouettes with
 * lit windows. "Infinity" is painted, never modeled. Deterministic (seeded).
 */
export function cityBackdrop(variant: "day" | "night"): THREE.CanvasTexture {
  const W = 2048, H = 768;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  const sky = g.createLinearGradient(0, 0, 0, H);
  if (variant === "day") {
    sky.addColorStop(0, "#7fb4e6");
    sky.addColorStop(0.65, "#cfe3f2");
    sky.addColorStop(1, "#f4e7d2");
  } else {
    sky.addColorStop(0, "#070a1c");
    sky.addColorStop(0.6, "#1b1840");
    sky.addColorStop(1, "#4a2350");
  }
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  const r = rng(variant === "day" ? 21 : 22);
  if (variant === "day") {
    g.fillStyle = "rgba(255,255,255,0.55)";
    for (let i = 0; i < 9; i++) {
      const x = r() * W, y = 60 + r() * 220, w = 120 + r() * 260;
      for (let k = 0; k < 5; k++) g.fillRect(x + k * w * 0.13, y - k * 6 + (k % 2) * 10, w * 0.5, 22 + k * 3);
    }
  } else {
    g.fillStyle = "rgba(255,255,255,0.8)";
    for (let i = 0; i < 140; i++) g.fillRect(r() * W, r() * H * 0.55, 2, 2);
  }
  const rows = [
    { base: H * 0.93, hMin: 140, hMax: 380, col: variant === "day" ? "#9fb1c4" : "#191830", win: variant === "day" ? "#b9c8d6" : "#ffcf7a", p: 0.18 },
    { base: H * 1.0, hMin: 200, hMax: 520, col: variant === "day" ? "#6f8499" : "#0e0d1d", win: variant === "day" ? "#8ea4b8" : "#ffd98a", p: 0.3 },
  ];
  for (const row of rows) {
    let x = -20;
    while (x < W) {
      const w = 60 + r() * 140, h = row.hMin + r() * (row.hMax - row.hMin);
      g.fillStyle = row.col;
      g.fillRect(x, row.base - h, w, h);
      if (r() < 0.3) g.fillRect(x + w * 0.4, row.base - h - 40, 6, 40); // antenna
      g.fillStyle = row.win;
      for (let wy = row.base - h + 14; wy < row.base - 12; wy += 18)
        for (let wx = x + 8; wx < x + w - 10; wx += 14) if (r() < row.p) g.fillRect(wx, wy, 7, 9);
      x += w + 4 + r() * 16;
    }
  }
  if (variant === "night") {
    // neon signs on the far skyline
    const neon = ["#ff3fa4", "#27e3ff", "#b36bff"];
    for (let i = 0; i < 10; i++) {
      g.fillStyle = neon[i % 3];
      g.fillRect(r() * W, H * 0.55 + r() * H * 0.3, 30 + r() * 50, 6);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** The studio TV / logo card. */
export function logoTexture(): THREE.CanvasTexture {
  const W = 1024, H = 576;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#101318";
  g.fillRect(0, 0, W, H);
  const cols = ["#e0663f", "#f2c14e", "#3f9ad6", "#57b36a", "#b36bff", "#ff3fa4"];
  // six style swatches in a 3x2 grid (one per look) — the studio's "render wall"
  cols.forEach((c, i) => {
    g.fillStyle = c;
    g.fillRect(170 + (i % 3) * 240, 90 + Math.floor(i / 3) * 190, 200, 160);
  });
  g.fillStyle = "#f4efe6";
  g.font = "700 40px 'Noto Sans CJK SC', sans-serif";
  g.textAlign = "center";
  g.fillText("stop-motion-3d", W / 2, 520);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
