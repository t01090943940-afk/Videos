// ─────────────────────────────────────────────────────────────────────────────
// Data contracts. The WORLD (sandbox) and the EPISODE (film) are plain JSON that
// match these types. Code builds the world once; episodes only reference it.
// ─────────────────────────────────────────────────────────────────────────────
export type Vec3 = [number, number, number];
export type StateValue = boolean | number | string;
export type WorldState = Record<string, StateValue>;
export type Ease = "linear" | "inOut" | "in" | "out";

export interface CamKey {
  pos: Vec3;
  target: Vec3;
  fov?: number;
}

/** A named, pre-rigged camera. `to` makes it a move; omit for a locked-off shot. */
export interface CameraDef {
  id: string;
  role: string;
  fov: number;
  from: CamKey;
  to?: CamKey;
  ease?: Ease;
}

/** A tape mark on the stage floor: where an actor stands or sits, and which way they face. */
export interface Mark {
  pos: Vec3;
  yaw: number; // degrees around +Y, 0 = facing +Z
}

export interface Costume {
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  eyes?: string;
  hairStyle?: "short" | "bun" | "long" | "beanie" | "spiky";
  glasses?: boolean;
  headphones?: boolean;
}

export interface ActorDef {
  name: string;
  mark: string;
  /** desk (set piece) this actor works at — its anchors resolve IK targets like "keyboard" */
  desk?: string;
  seated?: boolean;
  costume: Costume;
  /** what the actor does when a shot gives them no acting: a seeded background loop */
  ambient?: "typing" | "idle" | "none";
}

/** A workstation: desk + chair + props, with its actor seated at the desk's "seat" mark. */
export interface DeskItem {
  type: string; // prop library id
  at: [number, number]; // desk-local x, z (actor sits at z = -0.56 facing +Z; right hand = +X)
  y?: number; // base height (props built from the floor, e.g. a plant placed ON the desk: 0.75)
  yaw?: number;
  params?: Record<string, unknown>;
}
export interface DeskSpec {
  x: number;
  z: number;
  actor: string;
  chair: string;
  items: DeskItem[];
}

/** world.json — the sandbox's public contract. Episodes read ONLY this, never the build code. */
export interface WorldManifest {
  desks: Record<string, DeskSpec>;
  /** state keys for holdable props: value = "home" | "<actor>.R" | "<actor>.L" */
  holdables: Record<string, { desk: string; home: string }>;
  id: string;
  title: string;
  variants: string[];
  state: WorldState;
  marks: Record<string, Mark>;
  cameras: CameraDef[];
  actors: Record<string, ActorDef>;
}

// ── episode ──────────────────────────────────────────────────────────────────
/** One acting key: at local time `at` the actor reaches `pose`. `ease: "hold"` = snap (no in-between). */
export interface ActKey {
  actor: string;
  at: number;
  pose: string;
  ease?: Ease | "hold";
}
/** A generated loop (typing, drawing...) expanded into keys by the engine. */
export interface ActLoop {
  actor: string;
  loop: string;
  from: number;
  to: number;
  rate?: number;
}
export type Acting = ActKey | ActLoop;

export interface ShotEvent {
  t: number;
  set: WorldState;
}

export interface Transition {
  type: "cut" | "wipe";
  /** the look the shot starts in; it wipes into shot.look */
  from?: string;
  frames?: number;
}

export interface MgItem {
  kind: string; // "chip" | "title" | "lower" | "card" | ...
  from: number;
  to: number;
  text?: string;
  sub?: string;
  [k: string]: unknown;
}

export interface Shot {
  id: string;
  beat: string;
  story_function: string;
  duration: number; // seconds
  camera: string;
  look: string;
  variant?: string;
  transition?: Transition;
  acting?: Acting[];
  events?: ShotEvent[];
  state?: WorldState;
  mg?: MgItem[];
  /** split-screen reveal: several looks side by side in vertical bands */
  bands?: { looks: string[]; start: number; stagger: number };
}

export interface Episode {
  title: string;
  world: string;
  fps: number;
  width: number;
  height: number;
  shots: Shot[];
}

/** The only time object scene code ever sees. Never read wall-clock time. */
export interface StageTime {
  frame: number; // absolute output frame
  fps: number;
  shotIndex: number;
  localFrame: number;
  t: number; // continuous seconds in shot (camera, particles, light ramps)
  poseT: number; // stepped seconds in shot (puppets, events) — held fps/poseFps frames
  u: number; // 0..1 progress through the shot (continuous)
}
