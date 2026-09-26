import { W, H, DURATION, fontUses, loadImage, loadSvgTinted } from './core.js';
import { createPost } from './post.js';
import { MEMBERS, SLAMS, GRID_LOGOS } from './data.js';
import { drawAct1 } from './act1.js';

const acts = [[0, 20, drawAct1]];
let clearThumbs = () => {};
try { const m = await import('./act2.js'); m.setRaw((c, t, s) => drawRaw(c, t, s)); clearThumbs = m.clearThumbs; acts.push([20, 38, m.drawAct2]); } catch (e) { console.warn(e); }
try { const m = await import('./act3.js'); acts.push([38, 62, m.drawAct3]); } catch (e) { console.warn(e); }
try { const m = await import('./act4.js'); acts.push([62, DURATION, m.drawAct4]); } catch (e) { console.warn(e); }

const SCALE = Math.max(0.1, parseFloat(new URLSearchParams(location.search).get('scale') || '1') || 1);
const src = document.createElement('canvas');
src.width = W * SCALE; src.height = H * SCALE;
const ctx = src.getContext('2d', { willReadFrequently: false });
const out = document.getElementById('out');
out.width = W * SCALE; out.height = H * SCALE;
const post = createPost(out);

export function drawRaw(c, t, scale = 1) {
  const P = { time: t, grain: 0.04, vig: 0.3, ca: 0.0015 };
  c.save();
  c.setTransform(scale, 0, 0, scale, 0, 0);
  c.globalAlpha = 1; c.filter = 'none'; c.globalCompositeOperation = 'source-over';
  for (const [a, b, fn] of acts) if (t >= a && t < b) fn(c, t, P);
  c.restore();
  return P;
}
window.drawRaw = drawRaw;

function renderFrame(t) {
  const P = drawRaw(ctx, t, SCALE);
  post(src, P);
}
window.renderFrame = renderFrame;

async function loadAssets() {
  const jobs = [];
  const avatarIds = new Set(MEMBERS.map((m) => m.img).filter(Boolean));
  ['mio', 'daniel', 'genshin'].forEach((k) => avatarIds.add(k));
  for (const k of avatarIds) jobs.push(loadImage('av_' + k, `assets/avatars/${k}.png`));
  jobs.push(loadImage('club_logo', 'assets/logo.jpg'));
  const slugs = new Set([...SLAMS.map((s) => s.slug), ...GRID_LOGOS]);
  const base = 'node_modules/@lobehub/icons-static-svg/icons/';
  for (const s of slugs) jobs.push(loadSvgTinted('logo_' + s, `${base}${s}.svg`, '#F4EFE3'));
  for (const s of ['claude-color', 'gemini-color', 'deepseek-color', 'qwen-color', 'doubao-color', 'kimi-color'])
    jobs.push(loadSvgTinted('logo_' + s, `${base}${s}.svg`, '#F4EFE3'));
  await Promise.all(jobs);
}

// Fonts are split into unicode-range slices; sweep the timeline so every glyph actually used gets loaded.
async function preloadFonts() {
  for (let pass = 0; pass < 3; pass++) {
    for (let t = 0; t < DURATION; t += 1 / 20) drawRaw(ctx, t);
    const jobs = [];
    for (const k of fontUses) {
      const [f, s] = k.split('\u0000');
      jobs.push(document.fonts.load(f, s).catch(() => {}));
    }
    await Promise.all(jobs);
    await document.fonts.ready;
  }
}

window.__ready = (async () => {
  await document.fonts.ready;
  await loadAssets();
  await preloadFonts();
  clearThumbs();
  const q = new URLSearchParams(location.search);
  if (q.has('t')) renderFrame(parseFloat(q.get('t')));
  if (q.has('play')) {
    const t0 = performance.now() - parseFloat(q.get('play') || '0') * 1000;
    const loop = () => { renderFrame(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); };
    loop();
  }
  return true;
})();
