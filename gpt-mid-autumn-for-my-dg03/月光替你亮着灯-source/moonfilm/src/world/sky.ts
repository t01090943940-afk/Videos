import * as THREE from "three";
import { MOON_DIR, MOON_ANG_R } from "../layout";

/**
 * SKY DOME — painted, not modeled: gradient, drifting cloud washes, gouache-dot stars, and the
 * moon itself (disc + maria + corona) evaluated per view direction, so the moon is a perfect
 * circle at infinity whatever the camera does. Output is linear HDR (the look tone-maps it).
 * The dome is hidden from the normal/depth pass (noOutline) so the post sees it as "sky".
 */
export interface SkyUniforms {
  uMoonBright: { value: number };
  uVeil: { value: number };
  uClear: { value: number };
  uTime: { value: number };
}

export function makeSky() {
  const uniforms = {
    uMoonDir: { value: new THREE.Vector3(...MOON_DIR) },
    uMoonR: { value: MOON_ANG_R },
    uMoonBright: { value: 0.55 },
    uVeil: { value: 1 },
    uClear: { value: 0 },
    uTime: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.);
        vDir = wp.xyz - cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vDir;
      uniform vec3 uMoonDir; uniform float uMoonR, uMoonBright, uVeil, uClear, uTime;
      float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1));
        return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
      float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= .5; } return s; }
      void main(){
        vec3 d = normalize(vDir);
        float el = d.y;
        // --- base wash: zenith indigo → mid prussian → violet horizon with a faint warm breath
        vec3 zen = vec3(.010, .017, .052);
        vec3 mid = vec3(.026, .040, .105);
        vec3 hor = vec3(.070, .068, .140);
        vec3 col = mix(hor, mid, smoothstep(-.03, .2, el));
        col = mix(col, zen, smoothstep(.2, .78, el));
        col += vec3(.07, .035, .012) * exp(-max(el + .02, 0.) * 16.) * .7;
        // --- moon geometry
        float ca = clamp(dot(d, uMoonDir), -1., 1.);
        float ang = acos(ca);
        float corona = exp(-pow(ang / (uMoonR * 2.4), 2.));
        float wide = exp(-ang / .34);
        col += vec3(.95, .86, .66) * corona * .17 * uMoonBright;
        col += vec3(.20, .21, .30) * wide * .3 * (.4 + .65 * uMoonBright);
        // --- clouds on a virtual ceiling, drifting
        vec2 cp = d.xz / (max(el, 0.) + .14);
        cp = cp * .5 + vec2(uTime * .02, uTime * .005);
        float n1 = fbm(cp * 1.35);
        float n2 = fbm(cp * 3.2 + 5.2);
        float thr = mix(.55, .66, uClear);
        float cl = smoothstep(thr, thr + .24, n1 * .78 + n2 * .34);
        cl *= smoothstep(-.03, .1, el) * (1. - .45 * smoothstep(.62, .95, el));
        vec3 cloudCol = mix(vec3(.045, .055, .11), vec3(.13, .13, .21), n2);
        cloudCol += vec3(.62, .55, .42) * corona * .6 * uMoonBright + vec3(.10, .10, .15) * wide * uMoonBright;
        // --- stars: sparse gouache dots, hidden by moonglow and clouds
        vec2 sp = vec2(atan(d.x, d.z), asin(clamp(d.y, -1., 1.))) * 110.;
        vec2 cell = floor(sp);
        float h = hash12(cell);
        vec2 f = fract(sp) - .5 - (vec2(hash12(cell + 7.), hash12(cell + 13.)) - .5) * .55;
        float star = step(.962, h) * smoothstep(.17, .03, length(f));
        float tw = .6 + .4 * sin(uTime * (1.3 + h * 2.7) + h * 40.);
        float starVis = (1. - smoothstep(0., .45, corona * 1.6)) * smoothstep(.04, .22, el) * (1. - cl);
        col += vec3(.95, .93, 1.) * star * tw * (.55 + 1.2 * fract(h * 17.)) * starVis;
        col = mix(col, cloudCol, cl * .88);
        // --- the moon: paper-white disc, soft maria, limb falloff; HDR so it blooms
        float disc = smoothstep(uMoonR, uMoonR * .962, ang);
        vec3 right = normalize(cross(vec3(0., 1., 0.), uMoonDir));
        vec3 u2 = cross(uMoonDir, right);
        vec2 mc = vec2(dot(d, right), dot(d, u2)) / uMoonR;
        float maria = smoothstep(.46, .72, fbm(mc * 2.1 + 3.)) * .2 + smoothstep(.56, .82, fbm(mc * 4.6 + 1.)) * .08;
        float limb = sqrt(max(0., 1. - dot(mc, mc)));
        vec3 moon = vec3(1., .962, .86) * (1. - maria) * (.84 + .16 * limb);
        moon *= 1.3 + .75 * uMoonBright;
        col = mix(col, moon, disc);
        // --- a thin veil of cloud drawn across the moon at the start (clears later)
        float band = exp(-pow(ang / .17, 2.));
        float vn = smoothstep(.36, .74, fbm(vec2(atan(d.x, d.z) * 8. + uTime * .06, d.y * 15. - uTime * .02)));
        float veil = band * vn * uVeil;
        vec3 veilCol = vec3(.12, .12, .19) + vec3(.55, .5, .4) * corona * (.4 + .6 * uMoonBright);
        col = mix(col, veilCol, veil * .78);
        gl_FragColor = vec4(col, 1.);
      }`,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), mat);
  dome.frustumCulled = false;
  dome.renderOrder = -10;
  dome.userData.noOutline = true;
  return { dome, uniforms: uniforms as unknown as SkyUniforms };
}
