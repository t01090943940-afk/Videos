import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * BLOCK — block-world grammar: every primitive becomes a cuboid (cylinders and spheres turn
 * square), 16 px pixel-art textures at one world density (1 texel ≈ 3 cm), nearest filtering,
 * Lambert shading with hard-ish sun shadows. Original textures only — never official game assets.
 */
let pass: Pass | null = null;
const family = (kind: string) =>
  kind === "floor" || kind === "wood" || kind === "woodDark" || kind === "cork" ? "planks"
  : kind === "brick" ? "brick"
  : kind === "plant" || kind === "plantDark" ? "leaf"
  : "noise";

export const block: LookDef = {
  id: "block",
  label: "Block",
  zh: "方块世界",
  blurb: "Everything is a cuboid with 16px pixel-art textures; puppets are six blocks — the classic block-game grammar.",
  tags: "cuboid geometry · 16px textures · on twos",
  poseFps: 12,
  variant: "day",
  accent: "#57b36a",
  uvUnit: 0.48,
  geometry: {
    cyl: (rt, rb, h) => new THREE.BoxGeometry(2 * Math.max(rt, rb), h, 2 * Math.max(rt, rb)),
    sphere: (r) => new THREE.BoxGeometry(2 * r, 2 * r, 2 * r),
  },
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) {
      if ((sp as THREE.MeshBasicMaterial).map && (sem.kind === "screen" || sem.kind === "tv")) return sp;
      return sp;
    }
    const c = grade(sem.hex, { mulS: 1.12 });
    return new THREE.MeshLambertMaterial({ color: c, map: TEX.pixel(family(sem.kind)) });
  },
  setup(scene, ctx) {
    scene.background = new THREE.Color("#9cc9ee");
    standardLights(ctx, { sun: 3.0, hemi: 1.05, bounce: 0.8, beams: 0.06 });
    ctx.handles.sun.shadow.radius = 1;
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      void main(){
        vec3 c = colorAA(vUv);
        c = toSRGB(aces(c * 1.08));
        c = mix(vec3(luma(c)), c, 1.08);
        c = vignette(c, vUv, .3);
        gl_FragColor = vec4(c, 1.);
      }`);
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
