import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights, toonRamp } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * VOX — the paper-collage explainer look (Vox-style): every surface is a flat cut of colored
 * card, shadows are cast by layers of paper (screen-space depth offset), dark tones are printed
 * as halftone dots, ink misregisters slightly, and the whole frame sits on fibrous stock.
 * Hand-made cadence: puppets on threes, the camera steps on twos.
 */
let pass: Pass | null = null;
const EDITORIAL: Record<string, string> = {
  floor: "#d8c3a0", wood: "#d7a26a", woodDark: "#8a5a3a", brick: "#c65b43", plaster: "#efe4cf", backdrop: "#f0e2c6",
  metalDark: "#2d2f36", plasticDark: "#26282e", fabric: "#2f6e8f", plant: "#3c9a5f", plantDark: "#2c7a4a",
};

export const vox: LookDef = {
  id: "vox",
  label: "Paper collage",
  zh: "Vox 纸片拼贴",
  blurb: "Vox-style paper collage: flat card cut-outs, layered paper shadows, halftone print, misregistered ink, fibre paper.",
  tags: "flat card · halftone · paper shadows · on threes",
  poseFps: 8,
  cameraOnTwos: true,
  variant: "day",
  accent: "#e0663f",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    const base = EDITORIAL[sem.kind] ?? sem.hex;
    return new THREE.MeshToonMaterial({ color: grade(base, { mulS: 1.35, light: 0.02 }), gradientMap: toonRamp([150, 255]) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#f0e2c6");
    standardLights(ctx, { sun: 2.2, hemi: 1.6, bounce: 1.0, beams: 0 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform sampler2D tPaper;
      void main(){
        vec2 px = 1. / uRes;
        // torn-edge wobble, fixed per poster (not per frame): cut paper does not boil
        vec2 j = (vec2(fbm(vUv * 38.), fbm(vUv * 38. + 9.)) - .5) * 2.4;
        vec3 lin = texture2D(tColor, vUv + j * px * .35).rgb;
        vec3 c = toSRGB(aces(lin * 1.1));
        float l = luma(c);
        // flat card: posterize value to 3 steps, keep hue
        float q = floor(l * 3. + .5) / 3.;
        c = clamp(c * (q + .12) / max(l, .05), 0., 1.);
        if (isSky(vUv)) c = vec3(.94, .89, .78);
        // paper layers cast offset shadows: a nearer cut above-left darkens what lies below-right
        float d = linDepth(vUv), dn = linDepth(vUv - vec2(9., -9.) * px);
        float sh = step(.05, (d - dn) / d) * step(dn, 60.);
        c *= mix(1., .58, sh);
        // white cut rim: the top layer of paper shows its cut edge
        float rim = 0.;
        for (int i = 0; i < 4; i++){
          vec2 o = (i==0 ? vec2(1,0) : i==1 ? vec2(-1,0) : i==2 ? vec2(0,1) : vec2(0,-1)) * 3. * px;
          rim = max(rim, step(.04, (linDepth(vUv + o + j * px) - d) / d));
        }
        c = mix(c, vec3(.97, .94, .87), rim * .85);
        // halftone print in darker tones (45° screen)
        vec2 g = mat2(.7071, -.7071, .7071, .7071) * (vUv * uRes) / 7.;
        float dotR = sqrt(clamp(1. - l * 1.25, 0., 1.)) * .62;
        float ht = 1. - smoothstep(dotR - .08, dotR + .08, length(fract(g) - .5));
        c = mix(c, c * .45, ht * .55);
        // ink cut lines + slight red misregistration
        float e = edgeDN(vUv, 1.6, .05, .35, j);
        float er = edgeDN(vUv + vec2(2., 1.) * px, 1.2, .05, .35, j);
        c = mix(c, vec3(.1, .09, .09), e * .85);
        c.r = mix(c.r, .85, er * (1. - e) * .35);
        // paper stock
        vec3 paper = texture2D(tPaper, vUv * uRes / 512.).rgb;
        c *= .82 + .2 * paper;
        gl_FragColor = vec4(c, 1.);
      }`, { tPaper: { value: TEX.paper() } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
