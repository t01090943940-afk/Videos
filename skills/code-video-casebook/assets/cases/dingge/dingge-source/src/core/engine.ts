import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAPass } from 'three/examples/jsm/postprocessing/FXAAPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Renderer + post chain: scene → GTAO (contact shadows under props & feet) → bloom (sun glints) → Bokeh DOF
// (miniature/stop-motion depth) → ACES output → FXAA → grade (saturation, warmth, keep-red desaturation for the
// freeze frame, vignette, frame-seeded grain).

export type Quality = 'low' | 'high' | 'film';

export const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    saturation: { value: 1.05 }, contrast: { value: 1.04 }, warmth: { value: 0.02 }, exposure: { value: 1.0 },
    keepRed: { value: 0.0 },          // 0 = normal, 1 = desaturate everything except reds
    vignette: { value: 0.28 }, grain: { value: 0.035 }, seed: { value: 0 },
    flash: { value: 0 },              // white flash (cuts on impact)
    fade: { value: 0 },               // to black
    resolution: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float saturation, contrast, warmth, exposure, keepRed, vignette, grain, seed, flash, fade;
    uniform vec2 resolution; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed*13.17) * 43758.5453); }
    vec3 rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g)); vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y); float e=1e-10; return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb * exposure;
      float l = dot(c, vec3(0.2126,0.7152,0.0722));
      c = mix(vec3(l), c, saturation);
      c = (c - 0.5) * contrast + 0.5;
      c += vec3(warmth, warmth*0.35, -warmth);
      if (keepRed > 0.0) {
        vec3 hsv = rgb2hsv(clamp(c,0.,1.));
        float red = smoothstep(0.08, 0.02, min(hsv.x, 1.0-hsv.x)) * smoothstep(0.35, 0.6, hsv.y);
        float g = dot(c, vec3(0.2126,0.7152,0.0722));
        c = mix(c, mix(vec3(g), c, red), keepRed);
      }
      vec2 q = vUv - 0.5; q.x *= resolution.x/resolution.y;
      c *= 1.0 - vignette * smoothstep(0.35, 1.05, length(q));
      c += (h(vUv*resolution) - 0.5) * grain;
      c = mix(c, vec3(1.0), flash);
      c = mix(c, vec3(0.0), fade);
      gl_FragColor = vec4(clamp(c,0.,1.), 1.0);
    }`,
};

export class Engine {
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  renderPass: RenderPass;
  gtao: GTAOPass | null = null;
  bokeh: BokehPass;
  bloom: UnrealBloomPass;
  grade: ShaderPass;
  fxaa: FXAAPass;
  width: number; height: number;
  quality: Quality;

  constructor(container: HTMLElement, width: number, height: number, quality: Quality, scene: THREE.Scene | null = null) {
    this.width = width; this.height = height; this.quality = quality;
    const r = new THREE.WebGLRenderer({ antialias: quality !== 'film', powerPreference: 'high-performance', preserveDrawingBuffer: quality === 'film' });
    r.setPixelRatio(quality === 'film' ? 1 : Math.min(window.devicePixelRatio, 1.5));
    r.setSize(width, height, false);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.92;
    r.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(r.domElement);
    this.renderer = r;
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.05, 6000);

    const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: quality === 'high' ? 4 : 0 });
    this.composer = new EffectComposer(r, rt);
    this.renderPass = new RenderPass(scene ?? new THREE.Scene(), this.camera);
    this.composer.addPass(this.renderPass);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(width / 2, height / 2), 0.12, 0.4, 3.0);
    this.bokeh = new BokehPass(scene ?? new THREE.Scene(), this.camera, { focus: 10, aperture: 0.0008, maxblur: 0.008 });
    this.bokeh.enabled = false;
    this.grade = new ShaderPass(GradeShader);
    this.grade.uniforms.resolution.value.set(width, height);
    this.fxaa = new FXAAPass();
    this.fxaa.setSize?.(width, height);
  }

  setScene(scene: THREE.Scene) {
    this.renderPass.scene = scene;
    (this.bokeh as unknown as { scene: THREE.Scene }).scene = scene;
    if (this.quality !== 'low') {
      this.gtao = new GTAOPass(scene, this.camera, this.width, this.height);
      this.gtao.output = GTAOPass.OUTPUT.Default;
      this.gtao.blendIntensity = 0.85;
      this.gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: this.quality === 'film' ? 10 : 8 });
      this.gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 8 });
      this.composer.addPass(this.gtao);
    }
    this.composer.addPass(this.bloom);
    this.composer.addPass(this.bokeh);
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.fxaa);
    this.composer.addPass(this.grade);
  }

  resize(w: number, h: number) {
    this.width = w; this.height = h;
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.grade.uniforms.resolution.value.set(w, h);
  }

  render() { this.composer.render(); }
}
