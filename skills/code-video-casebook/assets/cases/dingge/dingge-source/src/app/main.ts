import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Engine, type Quality } from '../core/engine';
import { buildSite } from '../world/site';
import { Stage } from '../film/stage';
import { Film } from '../film/timeline';
import { SHOTS, FPS, TOTAL, shotStarts } from '../film/shots';
import { renderSoundtrack, wavBytes } from '../audio/score';
import { buildUI } from './ui';

// Entry point. Three modes share one set:
//   ?mode=render  → deterministic offline renderer API for scripts/render.mjs (1920x1080, film quality)
//   default       → interactive sandbox (free camera, live crew, 60fps) + film player with shot list

const params = new URLSearchParams(location.search);
const mode = params.get('mode') ?? 'sandbox';
const frameEl = document.getElementById('frame')!;

function makeOverlay() {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080;
  c.style.pointerEvents = 'none';
  frameEl.appendChild(c);
  return c;
}

if (mode === 'render') {
  const engine = new Engine(frameEl, 1920, 1080, 'film');
  const site = buildSite(engine.renderer, { shadowRes: Number(params.get('shadow') ?? 2048) });
  engine.setScene(site.scene);
  const stage = new Stage(site);
  const film = new Film(engine, site, stage, makeOverlay());
  Object.assign(window, { __engine: engine, __filmObj: film });
  const api = {
    totalFrames: film.totalFrames,
    shots: SHOTS.map((s, i) => ({ id: s.id, title: s.title, start: shotStarts()[i], dur: s.dur })),
    frameKey: (i: number) => film.frameKey(i).key,
    renderFrame: (i: number) => { film.render(i); return film.capture(); },
    collisions: () => {
      const out: { frame: number; shot: string; hits: ReturnType<Stage['collisions']> }[] = [];
      let last = '';
      for (let f = 0; f < film.totalFrames; f++) {
        const fk = film.frameKey(f); if (fk.key === last) continue; last = fk.key;
        film.seek(f);
        const sh = SHOTS[fk.shot];
        if (sh.take === 'none') continue;
        const hits = stage.collisions();
        if (hits.length) out.push({ frame: f, shot: sh.id, hits });
      }
      return out;
    },
    audio: async () => {
      const buf = await renderSoundtrack(48000);
      const bytes = wavBytes(buf);
      let s = ''; const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk));
      return btoa(s);
    },
    stats: () => ({ ...site.stats, calls: engine.renderer.info.render.calls }),
  };
  (window as unknown as { __film: typeof api }).__film = api;
  (window as unknown as { ready: boolean }).ready = true;
} else {
  startSandbox();
}

function startSandbox() {
  let quality: Quality = (params.get('q') as Quality) ?? (Math.min(screen.width, screen.height) < 700 ? 'low' : 'high');
  const rect = () => frameEl.getBoundingClientRect();
  const W = () => Math.min(1920, Math.round(rect().width * Math.min(devicePixelRatio, 1.5)));
  const H = () => Math.round(W() * 9 / 16);
  const engine = new Engine(frameEl, W(), H(), quality);
  engine.renderer.domElement.style.touchAction = 'none';
  const site = buildSite(engine.renderer, { shadowRes: quality === 'low' ? 2048 : 4096 });
  engine.setScene(site.scene);
  const stage = new Stage(site);
  const overlay = makeOverlay();
  const film = new Film(engine, site, stage, overlay);
  const controls = new OrbitControls(engine.camera, engine.renderer.domElement);
  controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.495; controls.minDistance = 1.2; controls.maxDistance = 420;
  const presets: Record<string, [number[], number[]]> = {
    '航拍全景': [[66, 46, 74], [0, 9, -2]],
    '6F 作业面': [[11.4, 16.9, 9.5], [5.2, 15.6, 4.8]],
    '临边缺口': [[9.3, 16.55, 10.9], [5.35, 15.95, 7.0]],
    '塔吊': [[-18, 30, 18], [0, 30, -15]],
    '大门 · 五牌一图': [[-22, 3.2, 34], [-26, 2, 18]],
    '钢筋加工棚': [[-18, 5, -16], [-33, 1.5, -30]],
  };
  const setPreset = (name: string) => { const [p, q] = presets[name]; engine.camera.position.set(p[0], p[1], p[2]); controls.target.set(q[0], q[1], q[2]); controls.update(); };
  setPreset('航拍全景');
  engine.camera.fov = 40; engine.camera.updateProjectionMatrix();

  const state = { mode: 'explore' as 'explore' | 'film', playing: true, filmT: 0, worldT: -8, take: 'good' as 'good' | 'bad' };
  let audioCtx: AudioContext | null = null, audioBuf: AudioBuffer | null = null, audioSrc: AudioBufferSourceNode | null = null, audioT0 = 0;
  const stopAudio = () => { try { audioSrc?.stop(); } catch { /* already stopped */ } audioSrc = null; };
  const startAudio = async () => {
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      if (!audioBuf) { ui.toast('正在合成声音…'); audioBuf = await renderSoundtrack(44100); }
      stopAudio();
      audioSrc = audioCtx.createBufferSource(); audioSrc.buffer = audioBuf; audioSrc.connect(audioCtx.destination);
      audioSrc.start(0, Math.max(0, state.filmT)); audioT0 = audioCtx.currentTime - state.filmT;
    } catch { audioSrc = null; }
  };

  const ui = buildUI({
    shots: SHOTS.map((s, i) => ({ id: s.id, title: s.title, start: shotStarts()[i], dur: s.dur })),
    total: TOTAL, presets: Object.keys(presets), quality,
    onMode: m => {
      state.mode = m; controls.enabled = m === 'explore';
      overlay.style.display = m === 'film' ? 'block' : 'none';
      engine.bokeh.enabled = false;
      const gu = engine.grade.uniforms; gu.keepRed.value = 0; gu.fade.value = 0; gu.flash.value = 0; gu.saturation.value = 1.05; gu.exposure.value = 1;
      if (m === 'film') { state.playing = true; ui.setPlaying(true); startAudio(); }
      else { stopAudio(); site.light.focusShadow(new THREE.Vector3(0, 0, 0), 60); engine.camera.fov = 40; engine.camera.updateProjectionMatrix(); }
    },
    onPreset: n => { if (state.mode !== 'explore') ui.setMode('explore'); setPreset(n); },
    onSeek: t => { state.filmT = t; if (state.mode !== 'film') ui.setMode('film'); else if (state.playing) startAudio(); },
    onPlay: p => { state.playing = p; if (state.mode === 'film') { if (p) startAudio(); else stopAudio(); } },
    onTake: t => { state.take = t; state.worldT = -2; },
    onSun: (e, a) => site.light.setSun(e, a),
    onQuality: q => { quality = q; const u = new URL(location.href); u.searchParams.set('q', q); location.href = u.toString(); },
  });
  overlay.style.display = 'none';

  addEventListener('resize', () => engine.resize(W(), H()));
  let last = performance.now(), fpsAcc = 0, fpsN = 0;
  const focus = new THREE.Vector3();
  const loop = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    fpsAcc += dt; fpsN++;
    if (fpsAcc > 0.5) { ui.fps(fpsN / fpsAcc, site.stats); fpsAcc = 0; fpsN = 0; }
    if (state.mode === 'explore') {
      if (state.playing) state.worldT += dt;
      if (state.worldT > 22) state.worldT = -8;
      stage.apply(state.take, state.worldT, 0, 0);
      controls.update();
      // shadow frustum follows what you're looking at: tight near the deck, wide from the air
      const dist = engine.camera.position.distanceTo(controls.target);
      focus.copy(controls.target); focus.y = 0;
      site.light.focusShadow(focus, THREE.MathUtils.clamp(dist * 0.9, 12, 80));
      site.light.update(engine.camera);
      site.building.deckRebar.visible = engine.camera.position.distanceTo(new THREE.Vector3(5, 15, 4)) < 36;
      engine.render();
      ui.clock(state.worldT);
    } else {
      if (state.playing) state.filmT = audioCtx && audioSrc ? audioCtx.currentTime - audioT0 : state.filmT + dt;
      if (state.filmT >= TOTAL) { state.filmT = 0; if (state.playing) startAudio(); }
      const f = Math.max(0, Math.min(film.totalFrames - 1, Math.floor(state.filmT * FPS)));
      film.render(f);
      ui.progress(state.filmT, film.locate(f).index);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  (window as unknown as { ready: boolean }).ready = true;
}
