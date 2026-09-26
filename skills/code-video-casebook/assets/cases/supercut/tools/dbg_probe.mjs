import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(path.join(process.env.APPDATA || '', 'npm/node_modules/x/'));
const { chromium } = req('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await p.goto('file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/'));
await p.waitForTimeout(3500);
const r = await p.evaluate((tt) => {
  try { window.__render(tt); } catch (e) { return { err: e.message, stack: e.stack.split('\n').slice(0, 6) }; }
  const g = (id) => {
    const n = document.getElementById(id);
    return n ? { op: n.style.opacity, cs: getComputedStyle(n).opacity.slice(0, 6) } : null;
  };
  return {
    autopsy: g('autopsy'), pair0: g('pair-0'), pair1: g('pair-1'), head: g('at-head'),
    st0: g('st0'), mar: g('marathon'), breath: g('breath'), wall: g('wall'),
    D_PAIRS: (window.__EDL.PAIRS || []).length,
    shots_pairs: window.__EDL.SHOTS.filter((s) => s.type === 'pair').map((s) => [s.id, s.b0, s.b1]),
  };
}, 69);
console.log(JSON.stringify(r, null, 1));
await b.close();
