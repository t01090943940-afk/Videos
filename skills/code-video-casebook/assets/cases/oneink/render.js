const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
(async () => {
  const out = process.argv[2] || 'video.mp4';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--disable-background-networking','--disable-component-update','--no-first-run','--disable-accelerated-2d-canvas','--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('http://localhost:8123/index.html');
  await p.waitForFunction(() => window.ready || window.bootError, null, { timeout: 180000 });
  const be = await p.evaluate(() => window.bootError); if (be) { console.log(be); process.exit(1); }
  fs.writeFileSync('events.json', JSON.stringify(await p.evaluate(() => window.EVENTS)));
  const N = await p.evaluate(() => window.NFRAMES);
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'ignore', 'ignore'] });
  const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    const url = await p.evaluate(f => { window.renderFrame(f); return document.getElementById('gl').toDataURL('image/jpeg', 0.95); }, f);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 30 === 0) { console.log('frame', f, '/', N, ((Date.now() - t0) / 1000).toFixed(0) + 's'); fs.writeFileSync('last_frame.jpg', buf); }
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', ((Date.now() - t0) / 1000).toFixed(0) + 's');
  await b.close();
})();
