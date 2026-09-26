import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * WATERCOLOR — transparent washes on cold-press paper: pale pigments, color that wanders a few
 * pixels off the drawing, pigment pooling (dark rims) where washes meet, granulation in the
 * shadows, faint pencil underdrawing, and white paper breathing at the frame edge.
 */
let pass: Pass | null = null;

export const watercolor: LookDef = {
  id: "watercolor",
  label: "Watercolor",
  zh: "水彩晕染",
  blurb: "Transparent washes on paper: wandering pigment, dark pooled edges, granulated shadows, faint pencil underdrawing.",
  tags: "washes · pooled edges · granulation",
  poseFps: 12,
  variant: "day",
  accent: "#8fc4ae",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    return new THREE.MeshLambertMaterial({ color: grade(sem.hex, { mulS: 1.15, light: 0.06 }) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#f6f1e6");
    standardLights(ctx, { sun: 2.4, hemi: 1.35, bounce: 1.0, beams: 0 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform sampler2D tPaper;
      vec3 samp(vec2 uv){ return toSRGB(aces(texture2D(tColor, uv).rgb * 1.25)); }
      void main(){
        vec2 px = 1. / uRes;
        vec2 w = (vec2(fbm(vUv * 5.), fbm(vUv * 5. + 7.)) - .5) * 7. * px;   // pigment wanders
        vec2 uv = vUv + w;
        vec3 c0 = samp(uv);
        vec3 m = c0;
        for (int i = 0; i < 6; i++){
          float a = float(i) * 1.0472; m += samp(uv + vec2(cos(a), sin(a)) * 4. * px);
        }
        m /= 7.;
        vec3 c = mix(c0, m, .6);                                          // soft wash
        float pool = clamp(length(c0 - m) * 3.5, 0., 1.);                  // pooled rims
        c = mix(c, c * c * .85, pool * .7);
        float l = luma(c);
        vec3 paperTex = texture2D(tPaper, vUv * uRes / 512.).rgb;
        float gran = vnoise(vUv * uRes * .35) * .5 + vnoise(vUv * uRes * .09) * .5;
        c *= mix(1., .82 + .25 * gran, smoothstep(.85, .35, l));           // granulation in shadows
        vec3 paper = vec3(.975, .96, .925) * (.92 + .08 * paperTex);
        c = mix(paper, c * paper, .88);
        c = mix(vec3(luma(c)), c, 1.18);
        c = mix(c, paper, smoothstep(.72, .98, l) * .7);                   // whites are the paper
        if (isSky(vUv)) c = mix(paper, vec3(.78, .87, .93), .35 * (1. - vUv.y));
        float e = edgeDN(vUv, 1., .05, .35, (vec2(fbm(vUv * 11.), fbm(vUv * 11. + 3.)) - .5) * 3.);
        c = mix(c, vec3(.35, .32, .33), e * .28);                          // pencil underdrawing
        // paper breathes at the frame edge
        vec2 q = vUv - .5; float edge = smoothstep(.36, .52, max(abs(q.x) * 1.02, abs(q.y) * 1.08) + (fbm(vUv * 9.) - .5) * .06);
        c = mix(c, paper, edge);
        gl_FragColor = vec4(c, 1.);
      }`, { tPaper: { value: TEX.paper() } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
