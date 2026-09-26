import * as THREE from "three";
import type { CameraDef } from "./types";
import { ease } from "./rng";

/** Sample a named rig at progress u (0..1). Cameras live on the CONTINUOUS clock. */
export function sampleCamera(def: CameraDef, u: number) {
  const to = def.to ?? def.from;
  const k = ease[def.ease ?? "inOut"](Math.min(1, Math.max(0, u)));
  const l = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] - v) * k) as [number, number, number];
  const fa = def.from.fov ?? def.fov, fb = to.fov ?? def.fov;
  return { pos: l(def.from.pos, to.pos), target: l(def.from.target, to.target), fov: fa + (fb - fa) * k };
}

export function applyCamera(cam: THREE.PerspectiveCamera, s: ReturnType<typeof sampleCamera>, aspect: number) {
  cam.position.set(...s.pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(...s.target);
  cam.fov = s.fov;
  cam.aspect = aspect;
  cam.near = 0.05;
  cam.far = 400;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
  // focus distance for depth-of-field looks = distance to the rig's target
  cam.userData.focus = Math.hypot(s.pos[0] - s.target[0], s.pos[1] - s.target[1], s.pos[2] - s.target[2]);
}
