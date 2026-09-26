// usage: node preview.js out_prefix f1 f2 ...   (frames rendered in order; frames in between simulated)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--disable-background-networking','--disable-component-update','--no-first-run','--disable-sync','--disable-accelerated-2d-canvas','--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('[page]', m.text()));
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('http://localhost:8123/index.html');
  await p.waitForFunction(() => window.ready || window.bootError, null, { timeout: 180000 });
  const be = await p.evaluate(() => window.bootError); if (be) { console.log(be); process.exit(1); }
  const out = process.argv[2];
  const frames = process.argv.slice(3).map(Number).sort((a, b) => a - b);
  let cur = 0;
  for (const f of frames) {
    const t0 = Date.now();
    await p.evaluate(([a, b]) => { for (let i = a; i < b; i++) window.stepOnly(i); }, [cur, f]);
    const url = await p.evaluate(f => { window.renderFrame(f); return document.getElementById('gl').toDataURL('image/jpeg', 0.9); }, f);
    fs.writeFileSync(`${out}_${String(f).padStart(4, '0')}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
    console.log('frame', f, Date.now() - t0, 'ms');
    cur = f + 1;
  }
  await b.close();
})();
