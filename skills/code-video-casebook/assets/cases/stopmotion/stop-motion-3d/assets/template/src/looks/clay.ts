import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * CLAY — plasticine stop-motion: every box is a soft rounded lump, surfaces carry fingerprint
 * bumps, colors are saturated and warm, light is a soft studio key, the depth of field is shallow
 * like a miniature set, and puppets move on threes (8 poses/s).
 */
let pass: Pass | null = null;

export const clay: LookDef = {
  id: "clay",
  label: "Clay",
  zh: "黏土定格",
  blurb: "Plasticine stop-motion: rounded lumps, fingerprint texture, warm soft light, shallow miniature focus, on threes.",
  tags: "rounded lumps · fingerprints · on threes",
  poseFps: 8,
  variant: "day",
  accent: "#e3a33a",
  uvUnit: 0.35,
  geometry: {
    box: (w, h, d) => {
      const m = Math.min(w, h, d);
      return m < 0.01 ? new THREE.BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, 3, Math.min(0.07, m * 0.32));
    },
    cyl: (rt, rb, h, seg) => new THREE.CylinderGeometry(rt, rb, h, Math.max(seg, 16), 2),
    sphere: (r) => new THREE.SphereGeometry(r, 16, 12),
  },
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    const c = grade(sem.hex, { mulS: 1.05, light: 0.02 });
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.62, metalness: 0, bumpMap: TEX.clayBump(), bumpScale: 1.4 });
  },
  setup(scene, ctx) {
    scene.background = new THREE.Color("#e9dccb");
    standardLights(ctx, { sun: 2.4, hemi: 1.25, bounce: 1.05, beams: 0.04, warm: "#ffe6c8" });
    ctx.handles.hemi.color.set("#fff1dc");
    ctx.handles.sun.shadow.radius = 6;
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform float uFocus;
      void main(){
        float d = linDepth(vUv);
        float coc = clamp(abs(d - uFocus) / d * 4., 0., 1.) * 3.;   // miniature-set shallow focus
        vec3 acc = colorAA(vUv); float w = 1.;
        for (int i = 0; i < 8; i++){
          float a = float(i) * .785398; vec2 o = vec2(cos(a), sin(a)) * coc / uRes;
          acc += texture2D(tColor, vUv + o).rgb; w += 1.;
        }
        vec3 c = acc / w;
        c = toSRGB(aces(c * 1.05));
        c = mix(c, c * vec3(1.04, 1., .94), .5);                       // warm grade
        c = vignette(c, vUv, .45);
        gl_FragColor = vec4(c, 1.);
      }`, { uFocus: { value: 3 } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    const fwd = new THREE.Vector3();
    c.camera.getWorldDirection(fwd);
    pass.u.uFocus.value = focusDistance(c.camera);
    pass.run(c.renderer, c.out);
  },
};

/** focus on whatever the camera aims at (its target, stored by the runtime) */
export function focusDistance(cam: THREE.PerspectiveCamera) {
  return (cam.userData.focus as number) ?? 3;
}
