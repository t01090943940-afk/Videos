// Render stills at given times: node preview.mjs out_dir 4.5 8.2 ...
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
export function serve() {
  return new Promise((res) => {
    const s = createServer(async (req, rsp) => {
      try {
        const p = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
        const b = await readFile(p);
        rsp.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
        rsp.end(b);
      } catch { rsp.writeHead(404); rsp.end(); }
    });
    s.listen(0, () => res(s));
  });
}
export async function openPage(server, query = '') {
  const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--disable-accelerated-2d-canvas', '--disable-gpu-rasterization'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${server.address().port}/index.html${query}`);
  await page.waitForFunction(() => window.__ready, null, { timeout: 600000 });
  await page.evaluate(() => window.__ready);
  return { browser, page };
}

if (process.argv[1].endsWith('preview.mjs')) {
  const [dir, ...times] = process.argv.slice(2);
  await mkdir(dir, { recursive: true });
  const server = await serve();
  const { browser, page } = await openPage(server);
  for (const t of times) {
    await page.evaluate((t) => window.renderFrame(t), parseFloat(t));
    await page.screenshot({ path: `${dir}/t${String(t).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 85 });
  }
  await browser.close();
  server.close();
}
