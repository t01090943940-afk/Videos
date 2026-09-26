import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { LookDef } from "./types";
import { METAL, ROUGH, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * DIORAMA — the sandbox "as built": a physically lit miniature set. Bevelled edges catch light,
 * procedural wood/brick/plaster, sun through the windows, soft shadows, screen-space AO.
 * This is the neutral look used to judge the world itself (look-lock of the SET).
 */
let pass: Pass | null = null;

export const diorama: LookDef = {
  id: "diorama",
  label: "Diorama",
  zh: "微缩沙盘",
  blurb: "The sandbox as built: physically lit miniature set, bevelled edges, soft sun and AO.",
  tags: "PBR · soft shadows · SSAO",
  poseFps: 12,
  variant: "day",
  accent: "#f2c14e",
  uvUnit: 1.2,
  geometry: {
    box: (w, h, d) => (Math.min(w, h, d) > 0.03 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(0.012, Math.min(w, h, d) * 0.2)) : new THREE.BoxGeometry(w, h, d)),
  },
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    const map =
      sem.kind === "floor" || sem.kind === "wood" || sem.kind === "woodDark" ? TEX.planks()
      : sem.kind === "brick" ? TEX.brick()
      : sem.kind === "plaster" ? TEX.plaster()
      : sem.kind === "fabric" || sem.kind === "cloth" ? TEX.fabric()
      : null;
    return new THREE.MeshStandardMaterial({
      color: sem.hex, map, roughness: ROUGH[sem.kind] ?? 0.78, metalness: METAL[sem.kind] ?? 0,
    });
  },
  setup(scene, ctx) {
    scene.background = new THREE.Color("#cfe3f2");
    standardLights(ctx, { sun: 3.4, hemi: 0.85, bounce: 0.95, beams: 0.09 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform float uAO;
      float ao(vec2 uv){
        float d = linDepth(uv); vec3 n = nrm(uv); float occ = 0.;
        float rad = clamp(22. / d, 3., 26.);
        for (int i = 0; i < 8; i++){
          float a = float(i) * 2.39996 + hash12(uv*uRes)*6.28; float rr = rad * (float(i)+1.)/8.;
          vec2 o = vec2(cos(a), sin(a)) * rr / uRes;
          float dd = d - linDepth(uv + o);
          occ += smoothstep(.02, .25, dd) * (1. - smoothstep(.25, 1.2, dd));
        }
        return 1. - occ / 8. * .55;
      }
      void main(){
        vec3 c = colorAA(vUv);
        if (!isSky(vUv)) c *= mix(1., ao(vUv), uAO);
        c = toSRGB(aces(c * 1.05));
        c = vignette(c, vUv, .38);
        c += (hash12(vUv*uRes + uFrame) - .5) * .018;
        gl_FragColor = vec4(c, 1.);
      }`, { uAO: { value: 1 } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.u.uAO.value = (globalThis as any).__ao ?? 1;
    pass.run(c.renderer, c.out);
  },
};
