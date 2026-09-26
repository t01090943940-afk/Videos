import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights, toonRamp } from "./common";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * COMIC — cyberpunk comic panel: the SAME studio at night (night variant = practical neon, desk
 * lamps and monitors are the only light), 3-tone cel shading, heavy ink contours, magenta/cyan
 * halftone in the midtones and neon glow bleeding off every practical.
 */
let pass: Pass | null = null;

export const comic: LookDef = {
  id: "comic",
  label: "Cyberpunk comic",
  zh: "赛博漫画",
  blurb: "Night variant of the same set: neon practicals, 3-tone cel shading, heavy ink, halftone midtones, neon glow.",
  tags: "night variant · ink · halftone · neon",
  poseFps: 12,
  variant: "night",
  accent: "#ff3fa4",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "night", { neonBoost: 3 });
    if (sp) return sp;
    return new THREE.MeshToonMaterial({ color: grade(sem.hex, { mulS: 1.3, mulL: 0.95 }), gradientMap: toonRamp([40, 140, 255]) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#0c0b1c");
    standardLights(ctx, {});
    ctx.handles.hemi.intensity = 0.55;
    ctx.handles.bounce.intensity = 0.25;
    ctx.handles.bounce.color.set("#7b5cff");
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      void main(){
        vec2 px = 1. / uRes;
        vec3 lin = texture2D(tColor, vUv).rgb;
        vec3 c = toSRGB(aces(lin * 1.35));
        // neon glow: bright pixels bleed (two rings)
        vec3 glow = vec3(0.);
        for (int i = 0; i < 8; i++){
          float a = float(i) * .785398;
          vec2 o = vec2(cos(a), sin(a));
          vec3 s1 = toSRGB(aces(texture2D(tColor, vUv + o * 7. * px).rgb * 1.35));
          vec3 s2 = toSRGB(aces(texture2D(tColor, vUv + o * 18. * px).rgb * 1.35));
          glow += max(s1 - .72, 0.) * .5 + max(s2 - .72, 0.) * .3;
        }
        c += glow * .45;
        float l = luma(c);
        // grade: shadows to indigo, lifts to magenta/cyan
        c = mix(vec3(.05, .04, .13), c, smoothstep(0., .5, l) * .85 + .15);
        c = mix(vec3(l), c, 1.25);
        // halftone in the midtones
        vec2 g = mat2(.8, -.6, .6, .8) * (vUv * uRes) / 6.;
        float dotR = (1. - smoothstep(.15, .7, l)) * smoothstep(.02, .15, l) * .5;
        float ht = 1. - smoothstep(dotR - .07, dotR + .07, length(fract(g) - .5));
        c = mix(c, c * vec3(.55, .35, .8), ht * .6);
        // heavy ink
        float e = max(edgeDN(vUv, 2., .04, .3, vec2(0.)), edgeC(vUv, 1.5, .18) * .6);
        c = mix(c, vec3(.02, .02, .05), clamp(e, 0., 1.));
        c = vignette(c, vUv, .6);
        gl_FragColor = vec4(c, 1.);
      }`);
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
