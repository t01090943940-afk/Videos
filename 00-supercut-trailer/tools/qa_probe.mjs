// qa_probe.mjs · 用 Playwright 加载 index.html，抓 JS 错误/控制台，并按时刻渲染自查
// 用法: node tools/qa_probe.mjs [t1,t2,...]  —— 会在每 t 调 __render(t) 并截图到 build/qa/
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(path.join(process.env.APPDATA || '', 'npm/node_modules/x/'));
const { chromium } = req('playwright');

// 注意：单位是秒（1 拍 = 0.4s）。V2 全片 120s，关键拍点×0.4 换算。
const times = process.argv[2] ? process.argv[2].split(',').map(Number) : [0, 1, 2, 3.5, 4.5, 5.5, 6.5, 7.8, 8.5, 9.5, 11, 12.5, 14, 15, 16.5, 18, 19.5, 21, 22.5, 23.5, 25, 26, 27, 28.5, 30, 31.5, 33, 34.5, 35.5, 37, 38.5, 40, 41.5, 43, 44.5, 46, 47, 48.5, 50, 51.5, 53, 55, 56.5, 58, 59.3, 60.5, 62, 64, 66, 67.5, 69, 71, 73, 75, 77, 79, 80.5, 82, 83.5, 85, 86.5, 88, 89.5, 91, 93.5, 95, 97, 99, 101, 102.5, 104, 106, 109, 112, 115, 117, 118.5, 119.5];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message, '\n', (e.stack || '').split('\n').slice(0, 6).join('\n')));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.type(), m.text()); });
await page.goto('file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/'));
await page.waitForTimeout(3500);
const ok = await page.evaluate(() => ({ tl: !!(window.__timelines && window.__timelines.main), render: typeof window.__render }));
console.log('init:', JSON.stringify(ok));
if (ok.render) {
  const fs = await import('node:fs');
  fs.mkdirSync(path.join(ROOT, 'build/qa'), { recursive: true });
  for (const t of times) {
    const err = await page.evaluate((tt) => { try { window.__render(tt); return null; } catch (e) { return e.message + '\n' + e.stack; } }, t);
    if (err) console.log(`RENDER@${t}s ERROR:`, err.split('\n').slice(0, 4).join(' | '));
    await page.screenshot({ path: path.join(ROOT, 'build/qa', `t${String(t).replace('.', '_')}.png`) });
  }
  console.log('snapshots → build/qa/t*.png');
}
await browser.close();
