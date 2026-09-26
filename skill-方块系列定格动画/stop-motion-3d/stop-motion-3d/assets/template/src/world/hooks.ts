import type * as THREE from "three";
import type { WorldHooks } from "../runtime/film";
import type { WorldManifest } from "../runtime/types";
import { sinceEvent } from "../runtime/clock";
import { buildStudio, updateStudio, updateWildWalls, type StudioHandles } from "./studio";

/** Glue between the generic film runtime and THIS sandbox. */
export function studioHooks(world: WorldManifest): WorldHooks<StudioHandles> {
  return {
    build: (P, variant, reg) => buildStudio(P, world, variant, reg.colliders, reg.screens),
    update: (h, state, shot, time) => updateStudio(h, state, time.t, time.frame / time.fps, sinceEvent(shot, "rin.pour", time.t)),
    beforeRender: (h, cam: THREE.PerspectiveCamera) => updateWildWalls(h, cam.position),
  };
}
