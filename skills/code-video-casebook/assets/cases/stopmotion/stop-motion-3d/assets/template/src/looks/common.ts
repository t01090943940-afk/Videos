import * as THREE from "three";
import type { Sem, SetupCtx } from "./types";
import { screenTexture } from "./screens";
import { cityBackdrop } from "../world/backdrop";

/** Materials every look shares the logic of: screens, glass, backdrop, neon, lamp glow. */
export function specialMaterial(sem: Sem, variant: "day" | "night", o: { toon?: THREE.Texture; neonBoost?: number } = {}): THREE.Material | null {
  switch (sem.kind) {
    case "screen":
    case "tv":
      return new THREE.MeshBasicMaterial({ map: screenTexture(sem.screen ?? Number(sem.key.split(":")[1] ?? 0)), toneMapped: false });
    case "backdrop":
      return new THREE.MeshBasicMaterial({ map: cityBackdrop(variant), fog: false, toneMapped: false });
    case "glass": {
      const m = new THREE.MeshBasicMaterial({ color: variant === "night" ? "#1a2040" : "#dff0ff", transparent: true, opacity: variant === "night" ? 0.25 : 0.12, depthWrite: false });
      return m;
    }
    case "neon": {
      const c = new THREE.Color(sem.hex).multiplyScalar(variant === "night" ? (o.neonBoost ?? 2.4) : 0.9);
      return new THREE.MeshBasicMaterial({ color: c });
    }
    case "glow":
      return new THREE.MeshBasicMaterial({ color: new THREE.Color(sem.hex).multiplyScalar(variant === "night" ? 3 : 1.1) });
  }
  return null;
}

export const ROUGH: Record<string, number> = {
  metal: 0.45, metalDark: 0.5, plasticDark: 0.55, plasticLight: 0.5, ceramic: 0.35, glass: 0.1, rubber: 0.9,
};
export const METAL: Record<string, number> = { metal: 0.6, metalDark: 0.4 };

/** Day/night key light setup shared by the lit (non-flat) looks. */
export function standardLights(ctx: SetupCtx, o: { sun?: number; hemi?: number; bounce?: number; beams?: number; warm?: string } = {}) {
  const h = ctx.handles;
  const night = ctx.variant === "night";
  h.sun.intensity = night ? 0 : o.sun ?? 3.2;
  h.sun.color.set(o.warm ?? "#fff0d4");
  h.hemi.intensity = night ? 0.25 : o.hemi ?? 1.0;
  h.hemi.color.set(night ? "#6a5cff" : "#dfe9f5");
  h.hemi.groundColor.set(night ? "#1a1024" : "#8a6a50");
  h.bounce.intensity = night ? 0.15 : o.bounce ?? 0.6;
  for (const b of h.beams) {
    b.visible = !night && (o.beams ?? 0.1) > 0;
    ((b as THREE.Mesh).material as THREE.ShaderMaterial).uniforms.uStrength.value = o.beams ?? 0.1;
  }
  // practicals that are off are REMOVED from lighting (each point light costs every pixel)
  for (const l of h.practicals.lamps) { l.intensity = 1.6; l.visible = night; }
  for (const l of h.practicals.neon) { l.intensity = 3.5; l.visible = night; }
  for (const l of h.practicals.pendants) { l.intensity = 4; l.visible = night; }
}

/** Re-grade a semantic color for a look (HSL offsets, clamped). */
export function grade(hex: string, o: { sat?: number; light?: number; hue?: number; mulS?: number; mulL?: number } = {}) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  hsl.h = (hsl.h + (o.hue ?? 0) + 1) % 1;
  hsl.s = Math.min(1, Math.max(0, hsl.s * (o.mulS ?? 1) + (o.sat ?? 0)));
  hsl.l = Math.min(1, Math.max(0, hsl.l * (o.mulL ?? 1) + (o.light ?? 0)));
  return new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
}

/** Stepped toon ramp (N bands) for MeshToonMaterial. */
const ramps = new Map<string, THREE.DataTexture>();
export function toonRamp(levels: number[]) {
  const key = levels.join(",");
  let t = ramps.get(key);
  if (!t) {
    const data = new Uint8Array(levels.length * 4);
    levels.forEach((v, i) => data.set([v, v, v, 255], i * 4));
    t = new THREE.DataTexture(data, levels.length, 1);
    t.magFilter = t.minFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    ramps.set(key, t);
  }
  return t;
}
