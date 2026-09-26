// Look-dev screenshots: node scripts/shot.mjs "<query>" out.png [more pairs...]
import { chromium } from 'playwright';
import { createServer } from 'vite';

const pairs = process.argv.slice(2);
const server = await createServer({ root: process.cwd(), server: { port: 5198 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('console', m => { const t = m.text(); if (!t.includes('vite')) console.log('>', t); });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
for (let i = 0; i < pairs.length; i += 2) {
  const t = Date.now();
  await page.goto(`http://localhost:5198/?${pairs[i]}`);
  await page.waitForFunction('window.ready === true', null, { timeout: 300000 });
  const stats = await page.evaluate('window.stats');
  await page.locator('canvas').first().screenshot({ path: pairs[i + 1] });
  console.log(pairs[i + 1], (Date.now() - t) + 'ms', JSON.stringify(stats));
}
await browser.close(); await server.close();
