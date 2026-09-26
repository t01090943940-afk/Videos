/**
 * TIMELINE — the single source of truth for picture AND sound.
 * Every time below is in seconds on one continuous clock (t = frame / FPS).
 * 80 BPM, 4/4 → one bar = 3.0 s; every subtitle line lands on a bar line.
 * meta() exports all of this so the audio script derives its cues from the same numbers.
 */
export const FPS = 24;
export const DURATION = 28.0;
export const TOTAL = Math.round(DURATION * FPS); // 672 frames
export const BPM = 80;
export const BAR = 3.0;
export const BEAT = 0.75;

/* ------------------------------------------------------------------ subtitles */
export interface SubSeg {
  text: string;
  at: number; // reveal start of this segment
  gold?: string[]; // substrings painted in lantern-gold
}
export interface Sub {
  id: string;
  bar: number;
  out: number; // dissolve start
  segs: SubSeg[];
}
export const SUBS: Sub[] = [
  { id: "L1", bar: 1, out: 2.84, segs: [{ text: "今晚月亮很圆，", at: 0.28 }, { text: "你的台灯也还亮着。", at: 1.9 }] },
  { id: "L2", bar: 2, out: 5.8, segs: [{ text: "这几个月会很难，", at: 3.12 }, { text: "但你一直在认真走。", at: 4.3 }] },
  { id: "L3", bar: 3, out: 8.84, segs: [{ text: "不急——", at: 6.1 }, { text: "一页一页，", at: 6.62, gold: ["一页一页"] }, { text: "一晚一晚。", at: 7.86, gold: ["一晚一晚"] }] },
  { id: "L4", bar: 4, out: 11.82, segs: [{ text: "每个认真的夜晚，", at: 9.12 }, { text: "都算数。", at: 10.5, gold: ["都算数"] }] },
  { id: "L5", bar: 5, out: 14.82, segs: [{ text: "你想让世界更公平、", at: 12.12 }, { text: "更温柔一点，", at: 13.36 }] },
  { id: "L6", bar: 6, out: 17.82, segs: [{ text: "这份心，", at: 15.12 }, { text: "本身就是力量。", at: 15.95, gold: ["力量"] }] },
  { id: "L7", bar: 7, out: 20.82, segs: [{ text: "你照亮过很多人，", at: 18.12 }, { text: "今晚换月亮照亮你。", at: 19.36, gold: ["照亮你"] }] },
  { id: "L8", bar: 8, out: 23.5, segs: [{ text: "你在争取的未来，", at: 21.12 }, { text: "你配得上。", at: 22.36, gold: ["配得上"] }] },
];
/** end card */
export const TITLE = { text: "学姐，中秋快乐！", at: 24.02, gold: ["中秋快乐"] };
export const SEAL = { text: "加油", at: 25.5 };
export const INSCRIPTION = { text: "丙午中秋 · 赠学姐", at: 26.05 };
/** music drop-out (silence is punctuation) right before the end card */
export const SILENCE: [number, number] = [23.52, 23.78];

/* ------------------------------------------------------------------ one-take camera */
export interface CamKey {
  t: number;
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}
export const CAMERA: CamKey[] = [
  // bar 1 — outside, the moon above a string of unlit lanterns; pull back through the open window
  { t: 0.0, pos: [-0.27, 1.55, 2.3], target: [1.11, 2.94, 12.1], fov: 44 },
  { t: 1.1, pos: [-0.2, 1.56, 1.05], target: [1.0, 2.75, 10.9], fov: 46 },
  { t: 2.0, pos: [-0.08, 1.56, -0.35], target: [0.75, 2.25, 9.6], fov: 48 },
  { t: 3.0, pos: [-0.12, 1.5, -1.95], target: [0.12, 1.55, 3.0], fov: 50 },
  // bar 2 — drift over her right shoulder: the pen, the page, the stack of books
  { t: 4.5, pos: [-0.42, 1.52, -1.52], target: [-0.05, 1.0, -0.55], fov: 46 },
  { t: 5.9, pos: [-0.5, 1.4, -1.22], target: [-0.06, 0.86, -0.46], fov: 42 },
  // bar 3 — low at her right, across the book toward the lamp; then turn with the rising lights
  { t: 7.1, pos: [-0.62, 1.22, -0.72], target: [0.02, 0.8, -0.42], fov: 40 },
  { t: 8.2, pos: [-0.55, 1.22, -0.68], target: [0.1, 1.05, -0.12], fov: 44 },
  { t: 9.05, pos: [-0.3, 1.38, -1.0], target: [0.0, 1.8, 2.0], fov: 51 },
  // bar 4 — behind her, the window: the lanterns light one by one
  { t: 10.3, pos: [-0.2, 1.58, -1.55], target: [0.05, 1.66, 4.2], fov: 56 },
  { t: 11.7, pos: [-0.12, 1.6, -1.2], target: [0.0, 1.9, 4.2], fov: 57 },
  // bars 5–6 — at the window: the constellation, the scale levelling, the moon filling
  { t: 13.3, pos: [-0.02, 1.58, -0.6], target: [-0.45, 2.62, 4.27], fov: 58 },
  { t: 14.7, pos: [0.0, 1.62, -0.45], target: [-0.4, 2.7, 4.4], fov: 58 },
  { t: 16.3, pos: [0.04, 1.65, -0.35], target: [0.21, 2.69, 4.54], fov: 56 },
  { t: 17.6, pos: [0.0, 1.62, -0.44], target: [0.35, 2.62, 4.5], fov: 54 },
  { t: 18.38, pos: [-0.2, 1.5, -0.42], target: [0.04, 0.8, -0.62], fov: 46 },
  // bar 7 — pull back and round to her right-front: moonlight on her face
  { t: 18.95, pos: [-0.36, 1.42, -0.42], target: [0.0, 1.27, -0.93], fov: 42 },
  { t: 20.45, pos: [-0.5, 1.31, -0.38], target: [0.0, 1.24, -0.96], fov: 36 },
  // bar 8 — back and up behind her right shoulder (the stretch; stars gather round the moon)
  { t: 21.9, pos: [-0.64, 1.5, -1.82], target: [0.0, 1.28, -0.85], fov: 46 },
  { t: 23.25, pos: [-0.4, 1.63, -2.05], target: [0.18, 1.6, 3.0], fov: 50 },
  // bar 9 — end card: behind her, the full moon, a sky of lanterns
  { t: 24.7, pos: [-0.2, 1.64, -2.2], target: [0.235, 1.38, 2.77], fov: 52 },
  { t: 28.0, pos: [-0.12, 1.67, -2.05], target: [0.28, 1.43, 2.9], fov: 50 },
];

/* ------------------------------------------------------------------ story events */
/** pages turned by her hand ("一页一页") — t = hand grabs the edge; the flip itself lasts FLIP_DUR */
export const HAND_FLIPS = [6.62, 7.37];
export const HAND_FLIP_DUR = 0.52;
/** pages turned by a breeze through the window ("一晚一晚") */
export const BREEZE_FLIPS = [7.92, 8.08, 8.24, 8.4];
export const BREEZE_FLIP_DUR = 0.38;
/** each flip releases a light mote (same order as flips) … */
export const MOTE_EMIT = [6.88, 7.63, 8.1, 8.26, 8.42, 8.58];
/** … which ignites one lantern on the string outside (eighth notes in bar 4) */
export const LANTERN_IGNITE = [9.375, 9.75, 10.125, 10.5, 10.875, 11.25];
/** constellation: orbs lift off at LIFT[i], settle at SETTLE[i] */
export const CONST_LIFT0 = 12.05;
export const CONST_SETTLE0 = 12.95;
export const CONST_STAGGER = 0.09;
export const CONST_LINES: [number, number] = [13.45, 14.85];
export const SCALE_LEVEL: [number, number] = [15.78, 16.5]; // the scale comes to balance …
export const SCALE_CHIME = 16.5; // … and rings on beat 3 of bar 6
export const STREAMS: [number, number] = [16.6, 17.85]; // light flows to the moon
export const MOON_FULL: [number, number] = [16.55, 18.7]; // clouds clear, moon brightens
export const MOONBEAM = 19.36; // moonlight pours into the room
export const PETALS_IN = 18.4;
export const RING: [number, number] = [21.35, 23.45]; // stars gather into a ring around the moon
export const SKY_LANTERNS = 24.0; // many lanterns rise for the end card

/** her acting beats */
export const ACT = {
  lookLanterns: 9.7, // lifts her head to the lanterns
  lookMoon: 18.25, // looks up at the moon
  smile: 19.55, // smile when "今晚换月亮照亮你"
  penDown: [21.12, 21.5] as [number, number],
  stretch: [21.62, 22.72] as [number, number], // arms rise … hold …
  relax: [22.72, 23.4] as [number, number],
  cheer: [25.12, 25.5] as [number, number], // fist pump lands with the seal
  cheerDown: [26.3, 27.1] as [number, number],
};

/* ------------------------------------------------------------------ beats (for meta / QC) */
export const BEATS = [
  { id: "B1", beat: "world", t0: 0, t1: 3 },
  { id: "B2", beat: "character", t0: 3, t1: 6 },
  { id: "B3", beat: "work", t0: 6, t1: 9 },
  { id: "B4", beat: "work", t0: 9, t1: 12 },
  { id: "B5", beat: "opportunity", t0: 12, t1: 15 },
  { id: "B6", beat: "turn", t0: 15, t1: 18 },
  { id: "B7", beat: "result", t0: 18, t1: 21 },
  { id: "B8", beat: "echo", t0: 21, t1: 24 },
  { id: "B9", beat: "echo", t0: 24, t1: 28 },
];
