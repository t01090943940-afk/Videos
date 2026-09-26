// Offline renderer: deterministic frame-by-frame capture through headless Chromium, then ffmpeg.
//   node scripts/render.mjs                 full film  → out/frames/*.jpg + out/audio.wav + out/dingge_1080p.mp4
//   node scripts/render.mjs --stills        one mid-frame per shot → out/stills/Sxx.jpg (review sheet)
//   node scripts/render.mjs --frames 12,40  specific frames → out/stills/f00012.jpg
//   node scripts/render.mjs --check         clipping report → out/collision-report.json
//   node scripts/render.mjs --audio         soundtrack only
// Frames shot "on twos" are rendered once and hard-linked for the duplicate frame.
import { chromium } from 'playwright';
import { build, preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const has = f => args.includes(f);
const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const OUT = path.resolve('out');
fs.mkdirSync(OUT, { recursive: true });

// render from a frozen production build, so editing sources mid-render can't reload the page
await build({ root: process.cwd(), logLevel: 'error', build: { outDir: 'out/render-build', emptyOutDir: true } });
const server = await preview({ root: process.cwd(), preview: { port: 5197 }, build: { outDir: 'out/render-build' }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-watchdog'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
page.on('console', m => { const t = m.text(); if (!t.includes('[vite]')) console.log('>', t); });
await page.goto('http://localhost:5197/?mode=render');
await page.waitForFunction('window.ready === true', null, { timeout: 600000 });
const info = await page.evaluate(() => ({ total: window.__film.totalFrames, shots: window.__film.shots, stats: window.__film.stats() }));
console.log(`film: ${info.total} frames, ${info.shots.length} shots`, info.stats);

const save = (file, dataUrl) => fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));

async function audio() {
  const b64 = await page.evaluate(() => window.__film.audio());
  fs.writeFileSync(path.join(OUT, 'audio.wav'), Buffer.from(b64, 'base64'));
  console.log('audio.wav written');
}

if (has('--check')) {
  const t = Date.now();
  const rep = await page.evaluate(() => window.__film.collisions());
  fs.writeFileSync(path.join(OUT, 'collision-report.json'), JSON.stringify(rep, null, 1));
  const worst = rep.flatMap(r => r.hits.map(h => ({ ...h, frame: r.frame, shot: r.shot }))).sort((a, b) => b.depth - a.depth).slice(0, 15);
  console.log(`collision check: ${rep.length} frames with contacts (${Date.now() - t}ms)`);
  console.table(worst);
} else if (has('--audio')) {
  await audio();
} else if (has('--stills') || val('--frames')) {
  const dir = path.join(OUT, 'stills'); fs.mkdirSync(dir, { recursive: true });
  let frames;
  if (val('--frames')) frames = val('--frames').split(',').map(Number).map(f => [f, `f${String(f).padStart(5, '0')}`]);
  else {
    const only = val('--stills') && !val('--stills').startsWith('--') ? val('--stills').split(',') : null;
    const at = Number(val('--at') ?? 0.6);
    frames = info.shots.filter(s => !only || only.includes(s.id)).map(s => [Math.floor((s.start + s.dur * at) * 24), s.id]);
  }
  for (const [f, name] of frames) {
    const t = Date.now();
    save(path.join(dir, `${name}.jpg`), await page.evaluate(i => window.__film.renderFrame(i), f));
    console.log(name, f, `${Date.now() - t}ms`);
  }
} else {
  const dir = path.join(OUT, 'frames'); fs.mkdirSync(dir, { recursive: true });
  const from = Number(val('--from') ?? 0), to = Number(val('--to') ?? info.total);
  let lastKey = null, lastFile = null, rendered = 0; const t0 = Date.now();
  for (let f = from; f < to; f++) {
    const file = path.join(dir, `${String(f).padStart(5, '0')}.jpg`);
    const key = await page.evaluate(i => window.__film.frameKey(i), f);
    if (key === lastKey && lastFile) {
      if (!fs.existsSync(file)) fs.linkSync(lastFile, file);
    } else if (!fs.existsSync(file) || has('--force')) {
      save(file, await page.evaluate(i => window.__film.renderFrame(i), f));
      rendered++;
      if (rendered % 20 === 0) { const el = (Date.now() - t0) / 1000; console.log(`frame ${f}/${to} · ${rendered} rendered · ${(el / rendered).toFixed(2)} s/frame · eta ${((to - f) / 2 * el / rendered / 60).toFixed(1)} min`); }
    }
    lastKey = key; lastFile = file;
  }
  console.log(`frames done: ${rendered} unique renders in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
  if (!has('--noaudio')) await audio();
  if (!has('--noencode')) {
    const mp4 = path.join(OUT, 'dingge_1080p.mp4');
    execFileSync('ffmpeg', ['-y', '-framerate', '24', '-i', path.join(dir, '%05d.jpg'), '-i', path.join(OUT, 'audio.wav'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
      '-c:a', 'aac', '-b:a', '256k', '-shortest', mp4], { stdio: 'inherit' });
    console.log('encoded', mp4);
  }
}
await browser.close(); await server.close();
process.exit(0);
