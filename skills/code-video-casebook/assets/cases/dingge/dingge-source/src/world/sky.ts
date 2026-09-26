import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { cloudDome } from '../materials/textures';

// Daylight rig: physically-based Preetham sky, a sun whose direction drives both the sky and the shadow light,
// sky-derived IBL (PMREM) for believable ambient/reflections, soft cloud dome and aerial-perspective fog.
// Mid-morning in a Chinese city: sun ~38° high from the south-east, slight haze.

export interface Daylight {
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  setSun(elevDeg: number, azimDeg: number): void;
  /** Fit the shadow frustum around a region (per-shot focus keeps texel density high). */
  focusShadow(center: THREE.Vector3, radius: number): void;
  sunDir: THREE.Vector3;
  baseIntensity: number;
  update(camera: THREE.Camera): void;
  /** re-apply IBL to materials added after construction (puppets) */
  refreshEnv(): void;
}

export function buildDaylight(scene: THREE.Scene, renderer: THREE.WebGLRenderer, shadowRes = 4096): Daylight {
  const sky = new Sky();
  sky.scale.setScalar(4500);
  const u = sky.material.uniforms;
  u.turbidity.value = 5.5; u.rayleigh.value = 1.35; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.82;
  // sky + clouds live in their own scene and are baked into a cube map (background) whenever the sun moves:
  // one texture lookup per sky pixel instead of the full scattering shader — a big win for offline software rendering
  const skyScene = new THREE.Scene();
  skyScene.add(sky);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(4000, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: cloudDome(), transparent: true, side: THREE.BackSide, depthWrite: false, fog: false, opacity: 0.85 }),
  );
  clouds.renderOrder = 1;
  skyScene.add(clouds);
  const cubeRT = new THREE.WebGLCubeRenderTarget(1024, { type: THREE.HalfFloatType, generateMipmaps: false });
  const cubeCam = new THREE.CubeCamera(1, 10000, cubeRT);
  skyScene.add(cubeCam);
  scene.background = cubeRT.texture;

  const sun = new THREE.DirectionalLight(0xfff1dc, 3.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowRes, shadowRes);
  sun.shadow.bias = -0.00025;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = 2.5;
  scene.add(sun, sun.target);

  const hemi = new THREE.HemisphereLight(0xc4dcff, 0x9a8670, 1.05);
  scene.add(hemi);

  scene.fog = new THREE.FogExp2(0xc4d2e0, 0.0019);

  const sunDir = new THREE.Vector3();
  const pmrem = new THREE.PMREMGenerator(renderer);
  let envRT: THREE.WebGLRenderTarget | null = null;
  const focus = { c: new THREE.Vector3(), r: 60 };

  const lastSun: [number, number] = [38, 128];
  function setSun(elevDeg: number, azimDeg: number) {
    lastSun[0] = elevDeg; lastSun[1] = azimDeg;
    const phi = THREE.MathUtils.degToRad(90 - elevDeg), theta = THREE.MathUtils.degToRad(azimDeg);
    // azimuth measured from north (-Z) clockwise toward east (+X)
    sunDir.set(Math.sin(phi) * Math.sin(theta), Math.cos(phi), -Math.sin(phi) * Math.cos(theta)).normalize();
    u.sunPosition.value.copy(sunDir);
    // environment map from the sky only (no clouds) for clean IBL
    const envScene = new THREE.Scene();
    const s2 = new Sky(); s2.scale.setScalar(1000); (s2.material as THREE.ShaderMaterial).uniforms = THREE.UniformsUtils.clone(u); envScene.add(s2);
    envRT?.dispose();
    envRT = pmrem.fromScene(envScene, 0, 0.1, 2000);
    // image-based light only on reflective materials (metal, glass, clearcoat): they need the sky reflection;
    // rough mineral surfaces get the equivalent ambient from the hemisphere light at a fraction of the cost
    scene.environment = null;
    const env = envRT.texture;
    scene.traverse(o => {
      const mm = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined; if (!mm) return;
      for (const m of Array.isArray(mm) ? mm : [mm]) {
        const st = m as THREE.MeshStandardMaterial & { clearcoat?: number };
        if (!st.isMeshStandardMaterial) continue;
        if (st.metalness > 0.15 || (st.clearcoat ?? 0) > 0) { st.envMap = env; st.envMapIntensity = 0.35; st.needsUpdate = true; }
      }
    });
    cubeCam.update(renderer, skyScene);
    const warm = THREE.MathUtils.clamp((elevDeg - 5) / 40, 0, 1);
    sun.color.setRGB(1, 0.86 + 0.1 * warm, 0.72 + 0.2 * warm);
    focusShadow(focus.c, focus.r);
  }
  function focusShadow(center: THREE.Vector3, radius: number) {
    focus.c.copy(center); focus.r = radius;
    sun.target.position.copy(center);
    sun.position.copy(center).addScaledVector(sunDir, 260);
    const cam = sun.shadow.camera;
    cam.left = -radius; cam.right = radius; cam.top = radius; cam.bottom = -radius;
    cam.near = 50; cam.far = 520;
    cam.updateProjectionMatrix();
    sun.target.updateMatrixWorld();
  }
  setSun(38, 128);
  return {
    sun, hemi, setSun, focusShadow, sunDir, baseIntensity: sun.intensity,
    update(camera: THREE.Camera) { void camera; },
    refreshEnv: () => setSun(lastSun[0], lastSun[1]),
  };
}
