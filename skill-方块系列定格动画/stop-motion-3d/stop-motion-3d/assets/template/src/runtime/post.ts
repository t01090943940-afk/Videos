import * as THREE from "three";

/**
 * Shared G-buffer for screen-space looks:
 *  - color:  the lit scene (linear HDR, MSAA)
 *  - normal: view normals (packed n*0.5+0.5) + a depth texture
 * Transparent helpers (glass, light shafts, particles) are hidden from the normal pass so they
 * never draw outlines. Mark such objects with userData.noOutline = true.
 */
export class GBuffer {
  color: THREE.WebGLRenderTarget;
  normal: THREE.WebGLRenderTarget;
  private normalMat = new THREE.MeshNormalMaterial();
  /**
   * Measured under SwiftShader (CPU WebGL, 1280x720, ~180k tris): scene pass 1x = 1.17 s,
   * 1x + MSAA4 = 1.61 s, 2x supersampled = 4.19 s. So: MSAA4 on the color pass only; normals/depth
   * single-sample. Per-pixel lights are the other big cost (10 point lights ≈ +0.35 s, PMREM env
   * ≈ +0.4 s) — hide practicals that are off, prefer hemisphere fill over an env map.
   */
  constructor(public width: number, public height: number, public samples = 4) {
    this.color = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples });
    this.normal = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType });
    this.normal.depthTexture = new THREE.DepthTexture(width, height);
  }
  /** restrict all passes to a screen rectangle (split-screen bands render only their slice) */
  scissor(r: THREE.Vector4 | null) {
    for (const t of [this.color, this.normal]) {
      t.scissorTest = !!r;
      if (r) t.scissor.copy(r);
    }
  }
  renderColor(r: THREE.WebGLRenderer, scene: THREE.Scene, cam: THREE.Camera) {
    r.setRenderTarget(this.color);
    r.clear();
    r.render(scene, cam);
  }
  renderNormalDepth(r: THREE.WebGLRenderer, scene: THREE.Scene, cam: THREE.Camera) {
    const hidden: THREE.Object3D[] = scene.userData.noOutline ?? [];
    const vis = hidden.map((o) => o.visible);
    hidden.forEach((o) => (o.visible = false));
    const bg = scene.background, fog = scene.fog;
    scene.background = null;
    scene.fog = null;
    scene.overrideMaterial = this.normalMat;
    r.setRenderTarget(this.normal);
    r.setClearColor(0x8080ff, 1);
    r.clear();
    r.render(scene, cam);
    r.setClearColor(0x000000, 1);
    scene.overrideMaterial = null;
    scene.background = bg;
    scene.fog = fog;
    hidden.forEach((o, i) => (o.visible = vis[i]));
  }
}

/** Collect objects flagged noOutline once per scene (called after the scene is built). */
export function indexNoOutline(scene: THREE.Scene) {
  const list: THREE.Object3D[] = [];
  scene.traverse((o) => {
    if (o.userData.noOutline || (o as THREE.Points).isPoints) list.push(o);
  });
  scene.userData.noOutline = list;
}

const quadGeo = new THREE.PlaneGeometry(2, 2);
const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

export interface Pass {
  mat: THREE.ShaderMaterial;
  u: Record<string, THREE.IUniform>;
  run(r: THREE.WebGLRenderer, target: THREE.WebGLRenderTarget | null): void;
}

/** One full-screen shader pass. Output is DISPLAY-REFERRED (tone-mapped + sRGB-encoded in GLSL). */
export function fsPass(frag: string, uniforms: Record<string, THREE.IUniform> = {}): Pass {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: null }, tNormal: { value: null }, tDepth: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) }, uNear: { value: 0.05 }, uFar: { value: 400 },
      uStep: { value: 0 }, uTime: { value: 0 }, uFrame: { value: 0 },
      ...uniforms,
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: GLSL_COMMON + frag,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(quadGeo, mat);
  mesh.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(mesh);
  return {
    mat,
    u: mat.uniforms,
    run(r, target) {
      r.setRenderTarget(target);
      r.render(scene, orthoCam);
    },
  };
}

/** Bind the g-buffer + camera + time uniforms every look pass needs. */
export function bindCommon(p: Pass, g: GBuffer, cam: THREE.PerspectiveCamera, frame: number, poseStep: number, t: number) {
  p.u.tColor.value = g.color.texture;
  p.u.tNormal.value = g.normal.texture;
  p.u.tDepth.value = g.normal.depthTexture;
  (p.u.uRes.value as THREE.Vector2).set(g.width, g.height);
  p.u.uNear.value = cam.near;
  p.u.uFar.value = cam.far;
  p.u.uFrame.value = frame;
  p.u.uStep.value = poseStep;
  p.u.uTime.value = t;
}

export const GLSL_COMMON = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tColor, tNormal, tDepth;
uniform vec2 uRes; uniform float uNear, uFar, uStep, uTime, uFrame;
vec3 colorAA(vec2 uv){ return texture2D(tColor, uv).rgb; }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= .5; } return s; }
float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
vec3 aces(vec3 x){ const float a=2.51, b=.03, c=2.43, d=.59, e=.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0., 1.); }
vec3 toSRGB(vec3 c){ c = clamp(c, 0., 1.); return mix(c*12.92, 1.055*pow(c, vec3(1./2.4)) - .055, step(.0031308, c)); }
vec3 fromSRGB(vec3 c){ return mix(c/12.92, pow((c+.055)/1.055, vec3(2.4)), step(.04045, c)); }
float linDepth(vec2 uv){ float z = texture2D(tDepth, uv).x*2. - 1.; return 2.*uNear*uFar/(uFar + uNear - z*(uFar - uNear)); }
vec3 nrm(vec2 uv){ return normalize(texture2D(tNormal, uv).xyz*2. - 1.); }
bool isSky(vec2 uv){ return texture2D(tDepth, uv).x > .99999; }
/* silhouette + crease edges; r = radius in px; jitter displaces taps (hand-drawn boil) */
float edgeDN(vec2 uv, float r, float dThr, float nThr, vec2 jitter){
  vec2 px = 1./uRes; vec2 c = uv + jitter*px;
  float d = linDepth(c); vec3 n = nrm(c); float e = 0.;
  for (int i = 0; i < 4; i++){
    vec2 o = (i==0 ? vec2(1,0) : i==1 ? vec2(-1,0) : i==2 ? vec2(0,1) : vec2(0,-1)) * px * r;
    float dd = abs(linDepth(c+o) - d) / max(d, .001);
    float nn = 1. - dot(n, nrm(c+o));
    e = max(e, max(smoothstep(dThr, dThr*2.5, dd), smoothstep(nThr, nThr*3., nn)));
  }
  return e;
}
/* color-region edges (flat-shaded looks: posters, costumes on the same plane) */
float edgeC(vec2 uv, float r, float thr){
  vec2 px = r/uRes; float l = luma(aces(texture2D(tColor, uv).rgb)); float e = 0.;
  e = max(e, abs(l - luma(aces(texture2D(tColor, uv+vec2(px.x,0)).rgb))));
  e = max(e, abs(l - luma(aces(texture2D(tColor, uv+vec2(0,px.y)).rgb))));
  return smoothstep(thr, thr*2.5, e);
}
vec3 vignette(vec3 c, vec2 uv, float k){ vec2 q = uv - .5; return c * (1. - k*dot(q, q)*1.6); }
`;
