import * as THREE from 'three';
import { SHOTS, FPB, FPS, TOTAL_FRAMES } from './shots.js';
import { W, H, MONO, SANS, rng, clamp, lerp, easeOut, back, makeCanvas } from './lib.js';
import { SCENES as A } from './scenes_a.js';
import { SCENES as B } from './scenes_b.js';
import { SCENES as C } from './scenes_c.js';
const SCENES = { ...A, ...B, ...C };

const out = document.getElementById('out');
const octx = out.getContext('2d');
const sceneCanvas = makeCanvas(); const sctx = sceneCanvas.getContext('2d');
const glCanvas = makeCanvas();
const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
let glScale = 1;
const GL = {
  THREE, renderer, canvas: glCanvas,
  draw(ctx, scene, cam, scale = 1) {
    if (scale !== glScale) { renderer.setSize(Math.round(W * scale), Math.round(H * scale), false); glScale = scale; }
    renderer.render(scene, cam);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(glCanvas, 0, 0, W, H); ctx.restore();
  },
};
export const ACC = { '2D': '#00E5FF', '2.5D': '#FFD600', '3D': '#FF3D7F', '4D': '#B388FF' };

const inited = new Set();
const vignette = (() => { const c = makeCanvas(); const x = c.getContext('2d');
  const g = x.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.72)'); x.fillStyle = g; x.fillRect(0, 0, W, H); return c; })();

function locate(F) {
  const beat = F / FPB;
  let i = SHOTS.findIndex(s => beat >= s.start && beat < s.start + s.b); if (i < 0) i = SHOTS.length - 1;
  return i;
}

function drawScene(i, sf, liveFrames) {
  const s = SHOTS[i], sc = SCENES[s.id];
  if (!sc) { sctx.fillStyle = '#300'; sctx.fillRect(0, 0, W, H); sctx.fillStyle = '#fff'; sctx.font = `60px ${MONO}`; sctx.fillText('TODO ' + s.id, 100, 200); return; }
  const env = { t: sf / FPS, f: sf, p: clamp(sf / Math.max(1, liveFrames - 1)), beat: sf / FPB, live: liveFrames / FPS,
    liveFrames, GL, shot: s, acc: ACC[s.dim] };
  if (!inited.has(s.id)) { sc.init && sc.init(env); inited.add(s.id); }
  sctx.save(); sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalAlpha = 1; sctx.globalCompositeOperation = 'source-over';
  sc.draw(sctx, env); sctx.restore();
}

function roundRect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }

function hud(i, lf, freeze, F) {
  const s = SHOTS[i], acc = ACC[s.dim], c = octx;
  c.save();
  let g = c.createLinearGradient(0, 0, 0, 150); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, 150);
  g = c.createLinearGradient(0, 800, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.82)');
  c.fillStyle = g; c.fillRect(0, 800, W, H - 800);
  // top-left brand + counter
  c.textBaseline = 'alphabetic';
  c.font = `bold 22px ${MONO}`; c.fillStyle = 'rgba(255,255,255,.9)'; c.fillText('CODE × COSMOS', 60, 70);
  c.font = `20px ${MONO}`; c.fillStyle = acc;
  const n = String(i + 1).padStart(2, '0');
  c.fillText(`SHOT ${n}/${SHOTS.length}  ·  STYLE #${n}`, 60, 102);
  // top-right dimension chips
  const dims = ['2D', '2.5D', '3D', '4D']; let x = W - 60;
  c.font = `bold 22px ${MONO}`; c.textAlign = 'center';
  for (let k = dims.length - 1; k >= 0; k--) {
    const d = dims[k], w = d.length > 2 ? 92 : 70; x -= w;
    roundRect(c, x, 44, w, 42, 8);
    if (d === s.dim) { c.fillStyle = ACC[d]; c.fill(); c.fillStyle = '#000'; }
    else { c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.stroke(); c.fillStyle = 'rgba(255,255,255,.45)'; }
    c.fillText(d, x + w / 2, 73); x -= 12;
  }
  c.textAlign = 'left';
  // bottom-left event
  c.font = `900 66px ${SANS}`; c.fillStyle = '#fff'; c.fillText(s.ev, 60, 968);
  c.font = `bold 30px ${MONO}`; c.fillStyle = acc; c.fillText(s.t, 62, 1012);
  // bottom-right style
  c.textAlign = 'right';
  c.font = `bold 34px ${MONO}`; c.fillStyle = '#fff'; c.fillText(s.style, W - 60, 942);
  c.font = `500 24px ${SANS}`; c.fillStyle = 'rgba(255,255,255,.75)'; c.fillText(`${s.zh} · ${s.dim}`, W - 60, 976);
  c.font = `20px ${MONO}`; const cw = c.measureText(s.code).width + 28;
  roundRect(c, W - 60 - cw, 990, cw, 34, 6); c.fillStyle = 'rgba(0,0,0,.6)'; c.fill();
  c.strokeStyle = acc; c.globalAlpha = .6; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;
  c.fillStyle = acc; c.fillText(s.code, W - 60 - 14, 1014);
  c.textAlign = 'left';
  // timeline
  const x0 = 60, x1 = W - 60, total = SHOTS.reduce((a, b) => a + b.b, 0), gap = 4;
  const usable = x1 - x0 - gap * (SHOTS.length - 1); let xx = x0;
  const resetting = s.id === 'loop' && lf >= (s.b - 1) * FPB; // loop: timeline resets at the very end
  SHOTS.forEach((t, k) => {
    const w = usable * t.b / total;
    let fill = 'rgba(255,255,255,.14)';
    if (!resetting) {
      if (k < i) fill = ACC[t.dim] + 'aa';
      if (k === i) fill = ACC[t.dim];
    } else if (k === 0) fill = ACC['2D'] + '66';
    c.fillStyle = fill; c.fillRect(xx, 1042, w, k === i && !resetting ? 10 : 6);
    xx += w + gap;
  });
  c.font = `13px ${MONO}`; c.fillStyle = 'rgba(255,255,255,.5)';
  c.fillText('BEFORE TIME', x0, 1072); c.textAlign = 'right'; c.fillText('HEAT DEATH → ?', x1, 1072); c.textAlign = 'left';
  c.restore();
}

function stamp(i, k) {
  const s = SHOTS[i], acc = ACC[s.dim], c = octx;
  if (k < 1) return;
  const sc = lerp(1.7, 1, back(Math.min(1, (k - 1) / 1.5)));
  c.save(); c.translate(W / 2 + 520, H / 2 + 200); c.rotate(-0.1); c.scale(sc, sc);
  c.font = `900 54px ${MONO}`; const tw = c.measureText(s.style).width;
  const bw = Math.max(tw, 360) + 56, bh = 150;
  c.fillStyle = 'rgba(0,0,0,.88)'; roundRect(c, -bw / 2, -bh / 2, bw, bh, 10); c.fill();
  c.strokeStyle = acc; c.lineWidth = 6; c.stroke();
  c.textAlign = 'center'; c.fillStyle = acc;
  c.font = `bold 24px ${MONO}`; c.fillText(`#${String(i + 1).padStart(2, '0')} · ${s.dim}`, 0, -30);
  c.font = `900 54px ${MONO}`; c.fillStyle = '#fff'; c.fillText(s.style, 0, 26);
  c.font = `bold 26px ${SANS}`; c.fillStyle = acc; c.fillText(s.zh, 0, 62);
  c.restore();
}

export function renderFrame(F) {
  const i = locate(F), s = SHOTS[i];
  const lf = F - s.start * FPB;
  const noFreeze = s.id === 'loop';
  const liveFrames = noFreeze ? s.b * FPB : (s.b - 1) * FPB;
  const freeze = lf >= liveFrames;
  const sf = freeze ? liveFrames - 1 : lf;
  drawScene(i, sf, liveFrames);
  const r = rng(F * 7919 + 17);
  const c = octx; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  if (!freeze) {
    const k = lf % FPB, first = lf === 0;
    let punch = [0.05, 0.028, 0.013, 0.005, 0, 0][k]; if (first) punch = 0.085;
    const scl = 1.02 + punch, rot = (r() - .5) * 0.006, dx = (r() - .5) * 7, dy = (r() - .5) * 7;
    c.translate(W / 2 + dx, H / 2 + dy); c.rotate(rot); c.scale(scl, scl); c.drawImage(sceneCanvas, -W / 2, -H / 2);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = `rgba(0,0,0,${r() * .07})`; c.fillRect(0, 0, W, H); // exposure flicker
    c.drawImage(vignette, 0, 0);
    hud(i, lf, false, F);
    const fl = first ? .6 : (k === 0 ? .12 : (first && k === 1 ? .2 : 0));
    if (fl) { c.fillStyle = `rgba(255,255,255,${fl})`; c.fillRect(0, 0, W, H); }
  } else {
    const k = lf - liveFrames; const sign = i % 2 ? 1 : -1;
    c.filter = 'blur(10px) brightness(0.32) saturate(1.4)'; c.drawImage(sceneCanvas, -60, -34, W + 120, H + 68); c.filter = 'none';
    const e = easeOut(Math.min(1, k / 2)); const scl = lerp(1.0, 0.8, e), rot = sign * lerp(0, 0.04, e);
    const jx = (r() - .5) * 3, jy = (r() - .5) * 3;
    c.translate(W / 2 + jx, H / 2 - 30 + jy); c.rotate(rot); c.scale(scl, scl);
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(-W / 2 + 18, -H / 2 + 26, W + 40, H + 40);
    c.fillStyle = '#f4f1ea'; c.fillRect(-W / 2 - 22, -H / 2 - 22, W + 44, H + 44);
    c.drawImage(sceneCanvas, -W / 2, -H / 2);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(vignette, 0, 0);
    hud(i, lf, true, F);
    stamp(i, k);
    const fl = [0.85, 0.35, 0.1, 0, 0, 0][k];
    if (fl) { c.fillStyle = `rgba(255,255,255,${fl})`; c.fillRect(0, 0, W, H); }
  }
  c.restore();
  return true;
}
window.renderFrame = renderFrame;
window.TOTAL_FRAMES = TOTAL_FRAMES;
window.SHOTS = SHOTS;
window.READY = true;
