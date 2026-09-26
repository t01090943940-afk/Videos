import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
import fs from 'fs';

const mode = process.argv[2] || 'sample';
const FPS = 30, DUR = 60;
const browser = await chromium.launch({ args: ['--disable-web-security', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('PAGEERR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.goto('file:///home/claude/f12/video.html');
await page.waitForFunction(() => window.__ready === true);

if (mode === 'sample') {
  const times = (process.argv[3] || '1,2.5,5,9,11,12.5,15,19,21.5,25,27,30,33,35.5,38,41,44,46,48,50,52,55,57.5,59').split(',').map(Number);
  fs.mkdirSync('/home/claude/f12/samples', { recursive: true });
  for (const t of times) {
    // walk from scene start to t so any first-frame builders run
    await page.evaluate(t => { window.render(Math.max(0, t - 0.5)); window.render(t); }, t);
    await page.screenshot({ path: `/home/claude/f12/samples/t${String(t).replace('.', '_')}.jpg`, type: 'jpeg', quality: 80 });
  }
  console.log('samples done');
} else {
  const start = +(process.argv[3] || 0), end = +(process.argv[4] || FPS * DUR);
  const out = process.argv[5] || '/home/claude/f12/video_raw.mp4';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = start; f < end; f++) {
    await page.evaluate(t => window.render(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`frame ${f} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', out);
}
await browser.close();
