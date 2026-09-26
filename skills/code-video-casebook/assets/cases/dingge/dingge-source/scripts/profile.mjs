import { chromium } from 'playwright';
import { createServer } from 'vite';
const server = await createServer({ root: process.cwd(), server: { port: 5196 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('http://localhost:5196/?mode=render');
await page.waitForFunction('window.ready === true', null, { timeout: 600000 });
const r = await page.evaluate(async () => {
  const film = window.__filmObj, F = window.__film; const out = {};
  const alpha = (g) => { const d = g.getImageData(0, 0, 1920, 1080).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; };
  for (const f of [1368, 1531, 1694]) { F.renderFrame(f); out['ov' + f] = alpha(film.g); }
  const url = F.renderFrame(1694); out.len = url.length;
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const g2 = c.getContext('2d');
  g2.drawImage(window.__engine.renderer.domElement, 0, 0); 
  const d = g2.getImageData(100, 120, 1, 1).data; out.glPixelTopLeft = Array.from(d);
  return out;
});
console.log(r);
await browser.close(); await server.close();
