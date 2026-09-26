import * as THREE from "three";
import { World } from "../world/index";
import { MoonwashPost } from "../look/moonwash";
import { sampleCamera, applyCamera } from "../cam/path";
import { drawMG, loadFonts } from "../mg/subtitles";
import * as TL from "../timeline";
import { DESK, BOOK } from "../layout";

/**
 * Capture page. Render contract on window.film (same as the stop-motion-3d kit):
 *   ready     → meta once fonts + world exist
 *   frame(f)  → JPEG data URL of frame f (painted 3D plate + MG layer). Pure function of f.
 *   inspect(f)→ QC probe without pixels (contacts, penetration, camera clearance)
 *   meta()    → frames, beats, every timeline cue (the audio script derives sound from this)
 */
declare global {
  interface Window {
    film: unknown;
  }
}

const params = new URLSearchParams(location.search);
const OUT_W = Number(params.get("w") ?? 1920), OUT_H = Number(params.get("h") ?? 1080);
const PLATE_W = Number(params.get("pw") ?? 1600), PLATE_H = Number(params.get("ph") ?? 900);

const glCanvas = document.getElementById("gl") as HTMLCanvasElement;
const outCanvas = document.getElementById("out") as HTMLCanvasElement;
glCanvas.width = PLATE_W;
glCanvas.height = PLATE_H;
outCanvas.width = OUT_W;
outCanvas.height = OUT_H;

let world: World, post: MoonwashPost, renderer: THREE.WebGLRenderer, g2: CanvasRenderingContext2D;
const camera = new THREE.PerspectiveCamera(45, PLATE_W / PLATE_H, 0.03, 600);
let fontsOk = false;

async function boot() {
  fontsOk = await loadFonts();
  renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.setSize(PLATE_W, PLATE_H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // the look encodes sRGB itself
  renderer.toneMapping = THREE.NoToneMapping;
  world = new World();
  const hide = (params.get("hide") ?? "").split(",").filter(Boolean);
  if (hide.length) world.scene.traverse((o) => { if (hide.includes(o.name)) o.userData.debugHidden = true; });
  if (params.get("nomoonshadow")) world.moon.castShadow = false;
  post = new MoonwashPost(PLATE_W, PLATE_H);
  g2 = outCanvas.getContext("2d")!;
  g2.imageSmoothingEnabled = true;
  g2.imageSmoothingQuality = "high";
  return meta();
}

function render(f: number) {
  const t = f / TL.FPS;
  applyCamera(camera, sampleCamera(t), PLATE_W / PLATE_H);
  const st = world.update(t, camera);
  world.scene.traverse((o) => { if (o.userData.debugHidden) o.visible = false; });
  world.scene.updateMatrixWorld(true);
  post.render(renderer, world.scene, camera, { exposure: st.exposure, bloom: st.bloom, lift: st.lift, t }, null);
  g2.clearRect(0, 0, OUT_W, OUT_H);
  g2.drawImage(glCanvas, 0, 0, OUT_W, OUT_H);
  drawMG(g2, OUT_W, OUT_H, t, { titleY: 0.585 });
}

function beatAt(t: number) {
  return (TL.BEATS.find((b) => t >= b.t0 && t < b.t1) ?? TL.BEATS[TL.BEATS.length - 1]).id;
}

/** QC probe: no pixels. */
function inspect(f: number) {
  const t = f / TL.FPS;
  applyCamera(camera, sampleCamera(t), PLATE_W / PLATE_H);
  world.update(t, camera);
  world.scene.updateMatrixWorld(true);
  const p = world.probe;
  const contacts: { actor: string; hand: string; mode: string; pose: string; gap: number; surface: number }[] = [];
  const penetration: { actor: string; part: string; collider: string; depth: number }[] = [];
  const onBook = (v: THREE.Vector3) => Math.abs(v.x - BOOK.x) < BOOK.pageW + 0.005 && Math.abs(v.z - BOOK.z) < BOOK.pageD / 2;
  const onDesk = (v: THREE.Vector3) => v.x > DESK.x0 && v.x < DESK.x1 && v.z > DESK.zNear && v.z < DESK.zFar;
  const surfaceY = (v: THREE.Vector3) => (onBook(v) ? BOOK.y : onDesk(v) ? DESK.top : -1);
  for (const side of ["R", "L"] as const) {
    const h = p.hands[side];
    const sy = surfaceY(h);
    if (sy > 0) {
      const bottom = h.y - p.handR;
      contacts.push({ actor: "xuejie", hand: side, mode: "surface", pose: beatAt(t), gap: +(bottom - sy).toFixed(4), surface: +(bottom - sy).toFixed(4) });
      if (bottom < sy - 0.004) penetration.push({ actor: "xuejie", part: `hand${side}`, collider: onBook(h) ? "book" : "desk", depth: +(sy - bottom).toFixed(4) });
    }
    // forearm capsule vs the desk plane
    const [e, w] = p.forearms[side];
    for (let k = 0; k <= 6; k++) {
      const q = e.clone().lerp(w, k / 6);
      const s2 = surfaceY(q);
      if (s2 > 0 && q.y - 0.035 < s2 - 0.004) penetration.push({ actor: "xuejie", part: `forearm${side}`, collider: "desk", depth: +(s2 - (q.y - 0.035)).toFixed(4) });
    }
  }
  if (p.penMode === "write") {
    contacts.push({ actor: "xuejie", hand: "pen", mode: "exact", pose: "write", gap: +Math.abs(p.penTip.y - BOOK.y).toFixed(4), surface: +(p.penTip.y - BOOK.y).toFixed(4) });
  }
  // camera clearance: never inside set geometry or her head
  const cam = camera.position.clone();
  for (const c of world.colliders) {
    const b = c.box.clone().expandByScalar(0.03);
    if (b.containsPoint(cam)) penetration.push({ actor: "camera", part: "lens", collider: c.name, depth: 0.03 });
  }
  const dHead = cam.distanceTo(p.head) - p.headR;
  if (dHead < 0.06) penetration.push({ actor: "camera", part: "lens", collider: "head", depth: +(0.06 - dHead).toFixed(4) });
  for (const lp of world.out.lanternPos) {
    const d = cam.distanceTo(lp) - 0.2;
    if (d < 0.05) penetration.push({ actor: "camera", part: "lens", collider: "lantern", depth: +(0.05 - d).toFixed(4) });
  }
  return {
    frame: f,
    shot: beatAt(t),
    look: "moonwash",
    localFrame: f,
    poseT: t,
    sig: { xuejie: `t@${t.toFixed(3)}` },
    contacts,
    penetration,
    camera: { pos: cam.toArray().map((v) => +v.toFixed(3)), headClear: +dHead.toFixed(3) },
  };
}

function meta() {
  const fps = TL.FPS;
  return {
    title: "月光替你亮着灯 · 送学姐的中秋小礼物",
    mode: "A — continuous 3D, one take",
    look: "moonwash — 月夜水彩 Moonlit Watercolor",
    fps,
    width: OUT_W,
    height: OUT_H,
    plate: [PLATE_W, PLATE_H],
    total: TL.TOTAL,
    fontsOk,
    shots: TL.BEATS.map((b) => ({ id: b.id, look: "moonwash", start: Math.round(b.t0 * fps), frames: Math.round((b.t1 - b.t0) * fps), camera: "ONE_TAKE", beat: b.beat })),
    events: [],
    cues: {
      bpm: TL.BPM,
      bar: TL.BAR,
      subs: TL.SUBS.map((s) => ({ id: s.id, bar: s.bar, out: s.out, segs: s.segs.map((g) => ({ text: g.text, at: g.at })) })),
      title: TL.TITLE,
      seal: TL.SEAL,
      inscription: TL.INSCRIPTION,
      silence: TL.SILENCE,
      handFlips: TL.HAND_FLIPS,
      handFlipDur: TL.HAND_FLIP_DUR,
      breezeFlips: TL.BREEZE_FLIPS,
      moteEmit: TL.MOTE_EMIT,
      lanternIgnite: TL.LANTERN_IGNITE,
      constLift0: TL.CONST_LIFT0,
      constSettle0: TL.CONST_SETTLE0,
      constStagger: TL.CONST_STAGGER,
      constLines: TL.CONST_LINES,
      scaleLevel: TL.SCALE_LEVEL,
      scaleChime: TL.SCALE_CHIME,
      streams: TL.STREAMS,
      moonFull: TL.MOON_FULL,
      moonbeam: TL.MOONBEAM,
      petalsIn: TL.PETALS_IN,
      ring: TL.RING,
      skyLanterns: TL.SKY_LANTERNS,
      act: TL.ACT,
    },
  };
}

const ready = boot();
window.film = {
  ready,
  async frame(f: number, quality = 0.95) {
    await ready;
    render(f);
    return outCanvas.toDataURL("image/jpeg", quality);
  },
  async inspect(f: number) {
    await ready;
    return inspect(f);
  },
  async meta() {
    await ready;
    return meta();
  },
};
