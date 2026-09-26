import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * SKETCH — hand-drawn line art: graphite contours on cream paper, loose hatching for shadow,
 * a thin marker wash that misses the lines, and LINE BOIL — every contour is re-drawn with a
 * new wobble on each pose step, exactly like redrawn animation paper.
 */
let pass: Pass | null = null;

export const sketch: LookDef = {
  id: "sketch",
  label: "Hand-drawn",
  zh: "手绘线稿",
  blurb: "Pencil contours on paper that re-wobble every pose step (line boil), hatching for shadow, a loose marker wash.",
  tags: "pencil contours · line boil · hatching",
  poseFps: 12,
  cameraOnTwos: true,
  variant: "day",
  accent: "#f4efe2",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    return new THREE.MeshLambertMaterial({ color: grade(sem.hex, { mulS: 0.9 }) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#ffffff");
    standardLights(ctx, { sun: 2.6, hemi: 1.2, bounce: 0.9, beams: 0 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform sampler2D tPaper;
      void main(){
        vec2 px = 1. / uRes;
        float seed = floor(uStep * 12. + .5);                    // changes every pose step → boil
        vec2 j1 = (vec2(fbm(vUv * 7. + seed * 3.1), fbm(vUv * 7. + 11. + seed * 1.7)) - .5) * 5.;
        vec2 j2 = (vec2(fbm(vUv * 9. + 5. + seed * 2.3), fbm(vUv * 9. + 3. + seed * 4.1)) - .5) * 5.;
        float e1 = edgeDN(vUv, 1.6, .035, .25, j1);
        float e2 = edgeDN(vUv, 1.1, .035, .25, j2) * .6;
        float grain = .65 + .35 * vnoise(vUv * uRes * .6);
        float line = clamp(max(e1, e2) * grain, 0., 1.);
        vec3 lit = toSRGB(aces(texture2D(tColor, vUv + j1 * px * 1.5).rgb * 1.1));
        float l = isSky(vUv) ? 1. : luma(lit);
        // marker wash: pale, offset from the lines, paper shows through
        vec3 paper = vec3(.965, .945, .9) * (.9 + .1 * texture2D(tPaper, vUv * uRes / 512.).rgb);
        float lq = floor(l * 3. + .5) / 3.;                           // flat value, not 3D shading
        vec3 wash = mix(paper, lit / max(l, .05) * mix(lq, 1., .55), .2);
        vec3 c = isSky(vUv) ? paper : wash;
        // hatching (45° for mid shadow, -45° cross-hatch for deep shadow), also boils
        vec2 p = vUv * uRes + j1 * 1.5;
        float h1 = smoothstep(.42, .26, l) * (1. - smoothstep(.1, .3, abs(fract((p.x + p.y) / 10.) - .5) * 2.));
        float h2 = smoothstep(.2, .08, l) * (1. - smoothstep(.1, .3, abs(fract((p.x - p.y) / 10.) - .5) * 2.));
        c = mix(c, vec3(.3, .29, .31), clamp(h1 * .4 + h2 * .45, 0., .7) * (isSky(vUv) ? 0. : 1.) * (.6 + .4 * vnoise(p * .08)));
        c = mix(c, vec3(.16, .15, .17), line);
        gl_FragColor = vec4(c, 1.);
      }`, { tPaper: { value: TEX.paper() } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
