import * as THREE from "three";
import { GBuffer, fsPass, bindCommon, type Pass } from "../core/post";
import { TEX } from "../core/tex";

/**
 * LOOK — 月夜水彩 · Moonlit Watercolor (the ONLY look in this film).
 * A night variant of the kit's watercolor pipeline, touching all five layers:
 *   geometry  soft primitives (rounded, low-poly lumps read as brush shapes)
 *   shading   Lambert washes, palette pulled toward indigo / lamp-gold
 *   light     cool moon key + warm desk lamp + indigo hemisphere
 *   post      pigment wander → 7-tap wash → pooled rims → wet-in-wet glow → granulation →
 *             cold-press paper → indigo pencil underdrawing → paper-white highlights
 *   cadence   continuous 24 fps (Mode A), paper grain fixed to the sheet
 */

export const PAL: Record<string, string> = {
  wall: "#cdb89a",
  wallOut: "#9c8a78",
  floor: "#7c5236",
  ceiling: "#b8a68c",
  wood: "#9a6440",
  woodDark: "#5e3a24",
  woodLight: "#c18f62",
  frame: "#6f4a30",
  paper: "#f3ead8",
  pageEdge: "#e2d6bd",
  skin: "#f0c0a2",
  hair: "#382822",
  sweater: "#b9accb",
  skirt: "#3f4a66",
  shoe: "#5b3c30",
  lampMetal: "#e3d8c2",
  mug: "#ece6dc",
  mugBand: "#6c8bb0",
  tea: "#8d5d25",
  plate: "#f0eadf",
  cakeSide: "#b7743a",
  pen: "#2e3b5c",
  sticky: "#f4d468",
  curtain: "#efe4d0",
  trunk: "#3f3129",
  leaf: "#2f4a38",
  flower: "#f2a93b",
  rope: "#35261f",
  lanternCap: "#caa048",
  tassel: "#c23a2c",
  pole: "#34313a",
  clip: "#f3b447",
  shelf: "#6b4630",
  plantPot: "#b86b4a",
  plant: "#4d7a4f",
};

export type Mat = THREE.Material;

/** semantic → material, cached. World code only ever says WHAT a surface is. */
export class MatLib {
  private cache = new Map<string, Mat>();
  get(sem: string): Mat {
    let m = this.cache.get(sem);
    if (m) return m;
    m = this.make(sem);
    this.cache.set(sem, m);
    return m;
  }
  private make(sem: string): Mat {
    const [kind, arg] = sem.split(":");
    const hex = arg && arg.startsWith("#") ? arg : PAL[kind] ?? "#ff00ff";
    switch (kind) {
      case "curtain":
        return new THREE.MeshLambertMaterial({ color: hex, transparent: true, opacity: 0.62, side: THREE.DoubleSide, depthWrite: false });
      case "lampShadeIn":
        return new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd89a").multiplyScalar(1.0), side: THREE.BackSide });
      case "paperLamp":
        return new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffc98a").multiplyScalar(1.6) });
      case "bulb":
        return new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff1cf").multiplyScalar(2.2) });
      case "flower":
        return new THREE.MeshLambertMaterial({ color: hex, emissive: new THREE.Color("#f0a030"), emissiveIntensity: 0.28 });
      case "mooncakeTop":
        return new THREE.MeshLambertMaterial({ map: TEX.mooncake() });
      case "sweater":
        return new THREE.MeshLambertMaterial({ color: hex, map: TEX.knit() });
      case "hair":
        return new THREE.MeshPhongMaterial({ color: hex, specular: new THREE.Color("#3d3236"), shininess: 12 });
      case "tea":
        return new THREE.MeshLambertMaterial({ color: hex, emissive: new THREE.Color("#3a2008"), emissiveIntensity: 0.25 });
      default:
        return new THREE.MeshLambertMaterial({ color: hex });
    }
  }
}

/** one lantern's paper: each lantern gets its own so it can be lit independently */
export function lanternMaterial() {
  return new THREE.MeshLambertMaterial({
    map: TEX.lantern(),
    color: "#ffffff",
    emissive: new THREE.Color("#ff8a3c"),
    emissiveMap: TEX.lantern(),
    emissiveIntensity: 0,
  });
}

/** additive glow sprite material */
export function glowMaterial(color: string, opacity = 1) {
  return new THREE.SpriteMaterial({
    map: TEX.glow(),
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });
}

/* ------------------------------------------------------------------ post pipeline */
export interface LookParams {
  exposure: number; // pre-ACES exposure
  bloom: number; // wet glow strength
  lift: number; // 0..1 overall brightening (ending is brighter)
  t: number;
}

export class MoonwashPost {
  gbuf: GBuffer;
  private rtQ: THREE.WebGLRenderTarget; // 1/4 bright
  private rtQ2: THREE.WebGLRenderTarget;
  private rtE: THREE.WebGLRenderTarget; // 1/8 wide glow
  private rtE2: THREE.WebGLRenderTarget;
  private bright: Pass;
  private blur: Pass;
  private final: Pass;

  constructor(public W: number, public H: number) {
    this.gbuf = new GBuffer(W, H);
    const mk = (w: number, h: number) => new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    this.rtQ = mk(Math.ceil(W / 4), Math.ceil(H / 4));
    this.rtQ2 = mk(Math.ceil(W / 4), Math.ceil(H / 4));
    this.rtE = mk(Math.ceil(W / 8), Math.ceil(H / 8));
    this.rtE2 = mk(Math.ceil(W / 8), Math.ceil(H / 8));
    this.bright = fsPass(
      /* glsl */ `
      uniform sampler2D tSrc; uniform vec2 uSrcPx; uniform float uThr;
      void main(){
        vec3 s = vec3(0.);
        for (int j = 0; j < 4; j++){ vec2 o = vec2(float(j/2) - .5, float(j - (j/2)*2) - .5) * uSrcPx * 2.; s += texture2D(tSrc, vUv + o).rgb; }
        s *= .25;
        float l = max(max(s.r, s.g), s.b);
        float k = uThr > 0. ? smoothstep(uThr, uThr * 2.2, l) : 1.;
        vec3 b = s * k;
        gl_FragColor = vec4(min(b, vec3(12.)), 1.);
      }`,
      { tSrc: { value: null }, uSrcPx: { value: new THREE.Vector2() }, uThr: { value: 1.25 } },
    );
    this.blur = fsPass(
      /* glsl */ `
      uniform sampler2D tSrc; uniform vec2 uDir;
      void main(){
        vec3 s = texture2D(tSrc, vUv).rgb * .2270;
        s += (texture2D(tSrc, vUv + uDir * 1.3846).rgb + texture2D(tSrc, vUv - uDir * 1.3846).rgb) * .3162;
        s += (texture2D(tSrc, vUv + uDir * 3.2308).rgb + texture2D(tSrc, vUv - uDir * 3.2308).rgb) * .0703;
        gl_FragColor = vec4(s, 1.);
      }`,
      { tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
    );
    this.final = fsPass(
      /* glsl */ `
      uniform sampler2D tBloomA, tBloomB, tPaper;
      uniform float uExposure, uBloom, uLift;
      vec3 tone(vec3 h){ return toSRGB(aces(h * uExposure)); }
      vec3 samp(vec2 uv){ return tone(texture2D(tColor, uv).rgb); }
      float softStep(float x, float n){ float y = x * n; float f = fract(y); return (floor(y) + smoothstep(.28, .72, f)) / n; }
      void main(){
        vec2 px = 1. / uRes;
        bool sky = isSky(vUv);
        // 1 pigment wanders a few px off the drawing
        vec2 w = (vec2(fbm(vUv * 4.7), fbm(vUv * 4.7 + 7.1)) - .5) * 7.5 * px;
        vec2 uv = vUv + w;
        vec3 c0 = samp(uv);
        // 2 soft wash (7 taps, ~4.5 px)
        vec3 m = c0;
        for (int i = 0; i < 6; i++){ float a = float(i) * 1.0472 + .35; m += samp(uv + vec2(cos(a), sin(a)) * 4.6 * px); }
        m /= 7.;
        vec3 c = mix(c0, m, .62);
        // 3 washes are laid in values, not gradients: soft-quantize the value, keep the hue
        float L = luma(c);
        float Lq = softStep(L, 6.);
        c *= mix(1., Lq / max(L, .004), sky ? .25 : .55);
        // 4 pooled rims where washes meet (pigment runs to the edge of a wet area)
        float pool = clamp(length(c0 - m) * 3.6, 0., 1.);
        c = mix(c, c * c * .88, pool * (sky ? .25 : .7));
        // 5 uneven pigment: patchy density + a little wet-in-wet hue drift
        float patchy = fbm(vUv * vec2(3.1, 2.4) + 11.3);
        c *= .93 + .12 * patchy;
        c += vec3(.028, .0, -.02) * (fbm(vUv * 2.2 + 4.) - .5);
        // 6 wet-in-wet glow (bloom), screen blend, slightly irregular like a bloom in wet paint
        vec3 bA = texture2D(tBloomA, vUv + w * 2.).rgb, bB = texture2D(tBloomB, vUv + w * 3.).rgb;
        vec3 bl = (bA * .8 + bB * 1.15) * uBloom;
        bl *= .8 + .4 * fbm(vUv * 9. + 3.);
        vec3 bd = toSRGB(aces(bl * .7));
        c = 1. - (1. - c) * (1. - bd);
        // 7 granulation: pigment settles into the paper's valleys, strongest in mid-darks
        float l = luma(c);
        vec3 pt = texture2D(tPaper, vUv * uRes / 512.).rgb;
        float gran = vnoise(vUv * uRes * .31) * .55 + vnoise(vUv * uRes * .08) * .45;
        c *= mix(1., .76 + .36 * gran, smoothstep(.8, .1, l));
        // 8 the sheet: pigment sits on warm paper; darks are deep indigo, never black
        vec3 paper = vec3(.968, .948, .9) * (.88 + .12 * pt.r);
        vec3 floorC = vec3(.07, .08, .145) * (.85 + .3 * gran);
        c = floorC + c * (paper - floorC);
        // 9 indigo pencil underdrawing (not on sky / far landscape)
        if (!sky){
          float e = edgeDN(vUv, 1.2, .05, .3, (vec2(fbm(vUv * 11.), fbm(vUv * 11. + 3.)) - .5) * 2.8);
          c = mix(c, vec3(.15, .14, .24), e * .36);
        }
        // 10 the brightest washes give way to the paper itself (moon, lantern cores, lit pages)
        float hl = smoothstep(.87, 1.0, luma(c));
        c = mix(c, paper * vec3(1., .985, .95), hl * .5);
        // 11 lift for the happy ending: warm the mids a touch
        c = mix(c, c * vec3(1.06, 1.03, .96) + vec3(.02, .015, 0.), uLift);
        // 12 gentle darkening toward the corners (no paper border — subtitles live near the edge)
        vec2 q = vUv - .5;
        c *= 1. - .34 * pow(clamp(length(q * vec2(1.05, 1.25)) * 1.25, 0., 1.), 2.4);
        gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
      }`,
      { tBloomA: { value: null }, tBloomB: { value: null }, tPaper: { value: TEX.paper() }, uExposure: { value: 1 }, uBloom: { value: 1 }, uLift: { value: 0 } },
    );
  }

  render(r: THREE.WebGLRenderer, scene: THREE.Scene, cam: THREE.PerspectiveCamera, p: LookParams, out: THREE.WebGLRenderTarget | null) {
    const g = this.gbuf;
    g.renderColor(r, scene, cam);
    g.renderNormalDepth(r, scene, cam);
    // bloom chain
    const b = this.bright;
    b.u.tSrc.value = g.color.texture;
    (b.u.uSrcPx.value as THREE.Vector2).set(1 / this.W, 1 / this.H);
    b.run(r, this.rtQ);
    const bl = this.blur;
    const pass = (src: THREE.WebGLRenderTarget, dst: THREE.WebGLRenderTarget, dx: number, dy: number) => {
      bl.u.tSrc.value = src.texture;
      (bl.u.uDir.value as THREE.Vector2).set(dx / src.width, dy / src.height);
      bl.run(r, dst);
    };
    pass(this.rtQ, this.rtQ2, 1, 0);
    pass(this.rtQ2, this.rtQ, 0, 1);
    // wide level from the blurred quarter
    b.u.tSrc.value = this.rtQ.texture;
    (b.u.uSrcPx.value as THREE.Vector2).set(1 / this.rtQ.width, 1 / this.rtQ.height);
    b.u.uThr.value = 0.0;
    b.run(r, this.rtE);
    b.u.uThr.value = 1.25;
    pass(this.rtE, this.rtE2, 1.6, 0);
    pass(this.rtE2, this.rtE, 0, 1.6);
    pass(this.rtE, this.rtE2, 1.6, 0);
    pass(this.rtE2, this.rtE, 0, 1.6);
    const f = this.final;
    bindCommon(f, g, cam, 0, 0, p.t);
    f.u.tBloomA.value = this.rtQ.texture;
    f.u.tBloomB.value = this.rtE.texture;
    f.u.uExposure.value = p.exposure;
    f.u.uBloom.value = p.bloom;
    f.u.uLift.value = p.lift;
    f.run(r, out);
  }
}
