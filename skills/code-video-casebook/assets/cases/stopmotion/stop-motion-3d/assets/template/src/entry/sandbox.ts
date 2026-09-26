import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Film } from "../runtime/film";
import type { Episode, WorldManifest } from "../runtime/types";
import type { PoseSpec } from "../runtime/rig";
import { stateAt } from "../runtime/clock";
import { LOOKS } from "../looks";
import { PALETTE } from "../world/palette";
import { studioHooks } from "../world/hooks";
import { logoTexture } from "../world/backdrop";
import worldJson from "../world/world.json";
import episodeJson from "../episode/episode.json";
import posesJson from "../world/poses.json";

/**
 * SANDBOX VIEWER — the world on its own, before and outside any film:
 * free orbit around the real set, every named camera and mark as a gizmo, switch look pipelines
 * live, scrub the episode to see poses and the world state (continuity) at any frame.
 * Same Film runtime as the renderer, so what you inspect here is what renders.
 */
const world = worldJson as unknown as WorldManifest;
const episode = episodeJson as unknown as Episode & { screens: Record<string, string> };
const glCanvas = document.getElementById("gl") as HTMLCanvasElement;
const outCanvas = document.createElement("canvas");
const W = 1280, H = 720;

const film = new Film({
  world, episode, looks: LOOKS, poses: posesJson as unknown as Record<string, PoseSpec>, palette: PALETTE,
  hooks: studioHooks(world), canvas: glCanvas, out: outCanvas, staticScreens: { 0: logoTexture() },
});
film.init();

const ui = { look: "diorama", frame: 0, mode: "orbit" as "orbit" | "shot", gizmos: true, playing: false };
const orbitCam = new THREE.PerspectiveCamera(42, W / H, 0.05, 400);
orbitCam.position.set(9, 7.5, 11);
const controls = new OrbitControls(orbitCam, document.getElementById("stage")!);
controls.target.set(0, 1, -0.5);
controls.update();

// gizmos: named cameras (frustum lines) + marks (rings)
const gizmos = new THREE.Group();
for (const c of world.cameras) {
  const g = new THREE.Group();
  const from = new THREE.Vector3(...c.from.pos), tgt = new THREE.Vector3(...c.from.target);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.3), new THREE.MeshBasicMaterial({ color: "#66d9ff" }));
  body.position.copy(from);
  body.lookAt(tgt);
  g.add(body);
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, tgt]), new THREE.LineBasicMaterial({ color: "#66d9ff" })));
  if (c.to) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, new THREE.Vector3(...c.to.pos)]), new THREE.LineBasicMaterial({ color: "#ffcc33" })));
  g.userData.id = c.id;
  gizmos.add(g);
}
for (const m of Object.values(world.marks)) {
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.36, 24), new THREE.MeshBasicMaterial({ color: "#ff5c8a", side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(m.pos[0], 0.03, m.pos[2]);
  gizmos.add(ring);
}

function frameInfo() {
  const st = film.stage(ui.look);
  const time = film.timeAt(ui.frame, st.look);
  const shot = episode.shots[time.shotIndex];
  const state = stateAt(shot, film.starts[time.shotIndex], time.poseT);
  return { st, time, shot, state };
}

function draw() {
  const { st, time, shot, state } = frameInfo();
  film.poseActors(st, time.shotIndex, time.poseT);
  film.cfg.hooks.update(st.handles, state, shot, time);
  let cam = orbitCam;
  if (ui.mode === "shot") {
    film.render(ui.frame);
    const g = (glCanvas.getContext("webgl2") as WebGL2RenderingContext);
    void g;
  } else {
    film.cfg.hooks.beforeRender(st.handles, cam);
    if (ui.gizmos) st.scene.add(gizmos);
    st.look.post({ renderer: film.renderer, gbuf: film.gbuf, scene: st.scene, camera: cam, out: null, time, width: W, height: H });
    st.scene.remove(gizmos);
  }
  const panel = document.getElementById("state")!;
  panel.innerHTML = `<dt>frame</dt><dd>${ui.frame} / ${film.total - 1}</dd><dt>shot</dt><dd>${shot.id} · ${shot.camera}</dd>
    <dt>t / poseT</dt><dd>${time.t.toFixed(2)} / ${time.poseT.toFixed(3)}</dd>` +
    Object.entries(state).map(([k, v]) => `<dt>${k}</dt><dd class="${v && v !== "home" ? "on" : ""}">${v}</dd>`).join("");
  (document.getElementById("scrub") as HTMLInputElement).value = String(ui.frame);
}

function buildUI() {
  const looks = document.getElementById("looks")!;
  for (const [id, l] of Object.entries(LOOKS)) {
    const b = document.createElement("button");
    b.textContent = `${l.zh}`;
    b.title = l.blurb;
    b.onclick = () => { ui.look = id; sync(); };
    b.dataset.id = id;
    looks.appendChild(b);
  }
  const shots = document.getElementById("shots")!;
  episode.shots.forEach((s, i) => {
    const b = document.createElement("button");
    b.innerHTML = `<b>${s.id}</b><small>${s.look} · ${s.camera.replace("CAM_", "")}</small>`;
    b.onclick = () => { ui.frame = film.frameStarts[i]; ui.look = s.look; ui.mode = "shot"; sync(); };
    shots.appendChild(b);
  });
  const scrub = document.getElementById("scrub") as HTMLInputElement;
  scrub.max = String(film.total - 1);
  scrub.oninput = () => { ui.frame = Number(scrub.value); draw(); };
  document.getElementById("orbit")!.onclick = () => { ui.mode = "orbit"; sync(); };
  document.getElementById("shot")!.onclick = () => { ui.mode = "shot"; sync(); };
  document.getElementById("giz")!.onclick = () => { ui.gizmos = !ui.gizmos; sync(); };
  document.getElementById("play")!.onclick = () => { ui.playing = !ui.playing; sync(); };
}
function sync() {
  document.querySelectorAll<HTMLButtonElement>("#looks button").forEach((b) => b.classList.toggle("on", b.dataset.id === ui.look));
  document.getElementById("orbit")!.classList.toggle("on", ui.mode === "orbit");
  document.getElementById("shot")!.classList.toggle("on", ui.mode === "shot");
  document.getElementById("giz")!.classList.toggle("on", ui.gizmos);
  document.getElementById("play")!.textContent = ui.playing ? "❚❚" : "▶";
  draw();
}
buildUI();
sync();
controls.addEventListener("change", () => ui.mode === "orbit" && draw());
setInterval(() => {
  if (!ui.playing) return;
  ui.frame = (ui.frame + 1) % film.total;
  draw();
}, 1000 / 12);
(window as unknown as { sandbox: unknown }).sandbox = { film, ui, draw, sync };
