import type * as THREE from "three";
import type { StageTime } from "../runtime/types";
import type { GBuffer } from "../runtime/post";

/**
 * Semantic material: world code says WHAT a surface is ("wood", "cloth:#e0663f", "screen:2"),
 * never how it looks. A LOOK turns it into a real material.
 */
export interface Sem {
  key: string; // full spec string, used as cache key
  kind: string;
  hex: string; // base color (world palette or explicit override)
  screen?: number; // "screen:N" → N
  emissive?: boolean;
}

export interface PrimOpts {
  /** not merged into static batches (animated, attached to hands, state-driven) */
  dynamic?: boolean;
  cast?: boolean;
  receive?: boolean;
  /** register the world AABB as a collider for penetration QC */
  collider?: boolean;
  name?: string;
}

/** Geometry primitives. World/prop/puppet code is written ONLY against this interface. */
export interface Prims {
  look: LookDef;
  box(w: number, h: number, d: number, sem: string, o?: PrimOpts): THREE.Mesh;
  /** Y-axis cylinder / cone */
  cyl(rTop: number, rBot: number, h: number, sem: string, o?: PrimOpts & { seg?: number }): THREE.Mesh;
  sphere(r: number, sem: string, o?: PrimOpts): THREE.Mesh;
  /** flat panel facing +Z (screens, posters, window glass, painted backdrops) */
  plane(w: number, h: number, sem: string, o?: PrimOpts): THREE.Mesh;
}

export interface SetupCtx {
  variant: string;
  renderer?: THREE.WebGLRenderer;
  handles: import("../world/studio").StudioHandles;
}

export interface PostCtx {
  renderer: THREE.WebGLRenderer;
  gbuf: GBuffer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  out: THREE.WebGLRenderTarget | null;
  time: StageTime;
  width: number;
  height: number;
}

/**
 * A LOOK is a complete rendering pipeline over the same world — not a palette swap:
 * geometry treatment + shading model + lighting rig + screen-space post + cadence.
 */
export interface LookDef {
  id: string;
  label: string; // English name
  zh: string; // Chinese name
  blurb: string; // one line for the style menu
  tags: string; // short tech tags for on-screen chips
  poseFps: number; // puppet cadence at 24 fps output (12 = on twos, 8 = on threes)
  cameraOnTwos?: boolean; // hand-made 2D looks also step the camera
  variant: "day" | "night";
  accent: string; // UI / transition accent color
  /** meters per texture tile for world-space UVs */
  uvUnit: number;
  material(sem: Sem): THREE.Material;
  /** geometry treatment (block → squares, clay → rounded lumps). Defaults to plain primitives. */
  geometry?: {
    box?(w: number, h: number, d: number): THREE.BufferGeometry;
    cyl?(rTop: number, rBot: number, h: number, seg: number): THREE.BufferGeometry;
    sphere?(r: number): THREE.BufferGeometry;
  };
  setup(scene: THREE.Scene, ctx: SetupCtx): void;
  /** per-frame look-specific updates (flicker, beams) */
  update?(scene: THREE.Scene, ctx: SetupCtx, time: StageTime): void;
  post(ctx: PostCtx): void;
}
