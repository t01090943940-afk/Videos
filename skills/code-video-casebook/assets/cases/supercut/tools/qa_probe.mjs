// qa_probe.mjs · 用 Playwright 加载 index.html，抓 JS 错误/控制台，并按时刻渲染自查
// 用法: node tools/qa_probe.mjs [t1,t2,...]  —— 会在每 t 调 __render(t) 并截图到 build/qa/
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(path.join(process.env.APPDATA || '', 'npm/node_modules/x/'));
const { chromium } = req('playwright');

const times = process.argv[2] ? process.argv[2].split(',').map(Number) : [0, 3, 7, 13, 18, 23, 31, 44, 47, 50, 55, 61, 63.2, 64.5, 70, 78, 81, 83, 85, 87, 90, 94, 96.5, 99, 103, 106, 110, 114, 117, 119, 121, 126, 130, 134, 145, 150, 155];
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
