import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1500, height: 1000 } });
const errs = [];
pg.on('pageerror', e => errs.push('PAGEERR ' + e.message + ' ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
await pg.goto('file:///home/claude/f12/site/index.html');
await pg.waitForTimeout(1200);
const shot = async n => pg.locator('#sim').screenshot({ path: `/home/claude/f12/samples/s_${n}.png` });
const step = async (name, fn) => { try { await fn(); } catch (e) { errs.push(`STEP ${name}: ${e.message.split('\n')[0]}`); } };
const inPage = sel => pg.locator('#pageHost').locator(sel); // playwright pierces open shadow roots

await step('elements hover', async () => { await pg.hover('#tree .tr:nth-child(8)'); await pg.waitForTimeout(150); });
await shot('elements');
await step('toggle decl', async () => { await pg.locator('#styles input[type=checkbox]').nth(2).click(); });
await step('inspect', async () => { await pg.click('#inspectBtn'); await inPage('.card').first().hover(); await pg.waitForTimeout(100); await inPage('.card').first().click(); });
await step('computed', async () => { await pg.click('#elSub [data-k=computed]'); await pg.click('#elSub [data-k=layout]'); await pg.click('#elSub [data-k=listeners]'); await pg.click('#elSub [data-k=a11y]'); await pg.click('#elSub [data-k=styles]'); });
await step('add to cart', async () => { await inPage('.btn.add').first().click(); await inPage('.btn.add').nth(2).click(); await inPage('.btn.add').nth(2).click(); });
await step('console', async () => {
  await pg.click('.ptab[data-p=console]');
  const ta = pg.locator('.panel.on textarea');
  for (const c of ["document.title", "$0", "$$('.card').length", "console.table(orders)", "await fetch('/api/cart', {method:'POST'})", "let q = 5", "q * 2", "cart.items", "nope.x"]) { await ta.fill(c); await ta.press('Enter'); await pg.waitForTimeout(120); }
  await pg.waitForTimeout(500);
});
await shot('console');
await step('sources', async () => {
  await pg.click('.ptab[data-p=sources]');
  await pg.click('#code .ln[data-l="11"] .g');
  await inPage('.btn.checkout').click();
  await pg.waitForTimeout(300);
  await pg.click('#dOver'); await pg.click('#dOver');
});
await shot('sources');
await step("resume", async () => { for (let i = 0; i < 8; i++) { if (await pg.locator("#dResume").isEnabled()) await pg.click("#dResume"); await pg.waitForTimeout(60);} });
await step('network', async () => { await pg.click('.ptab[data-p=network]'); await pg.click('#nReload'); await pg.waitForTimeout(1500); await pg.evaluate(()=>document.querySelector('#nRows .nr').click()); await pg.click('#nDet [data-t=timing]'); });
await shot('network');
await step('perf', async () => { await pg.click('.ptab[data-p=performance]'); await pg.click('#pfRec'); await pg.waitForTimeout(300); await pg.click('#browser .ptab[data-p=performance]'); await inPage('.theme-toggle').click(); await inPage('.btn.add').first().click(); await pg.waitForTimeout(600); await pg.click('#pfStop'); await pg.waitForTimeout(1000); });
await shot('perf');
await step('perf tabs', async () => { await pg.click('.pbottom [data-k=bottomup]'); await pg.click('.pbottom [data-k=calltree]'); await pg.click('.pbottom [data-k=log]'); });
await step('memory', async () => { await pg.click('.ptab[data-p=memory]'); await pg.click('#mGo'); await pg.waitForTimeout(1500); for (let i = 0; i < 3; i++) await inPage('.btn.subscribe').click(); await pg.waitForTimeout(2800); await pg.click('#mRec'); await pg.waitForTimeout(1600); await pg.fill('#mFilter', 'Detached'); await pg.locator('#mMain tr[data-k]').first().click(); });
await shot('memory');
await step('app', async () => { await pg.click('.ptab[data-p=application]'); for (const v of ['ss', 'idb', 'cookies', 'cache', 'sw', 'manifest', 'storage', 'bfcache', 'ls']) await pg.click(`#atree [data-v=${v}]`); });
await step('lighthouse', async () => { await pg.click('.ptab[data-p=lighthouse]'); await pg.click('#lhGo'); await pg.waitForTimeout(3600); });
await shot('lighthouse');
await step('device', async () => { await pg.click('#deviceBtn'); await pg.selectOption('#devSel', 'iPhone SE'); await pg.waitForTimeout(200); });
await shot('device');
await step('drawer', async () => { await pg.click('#deviceBtn'); await pg.click('.ptab[data-p=elements]'); await pg.click('#tree'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(100); for (const t of ['rendering', 'coverage', 'changes', 'issues', 'console']) await pg.click(`#drawer [data-k=${t}]`); });
await step('cmd', async () => { await pg.click('#kebab'); await pg.click('.menu button:has-text("Run command")'); await pg.keyboard.type('dark'); await pg.keyboard.press('Enter'); });
await shot('drawer');
const info = await pg.evaluate(() => ({ con: CON.msgs.map(m => m.type + ':' + (m.args || []).map(a => typeof a === 'string' ? a : typeof a).join(' ')).slice(-20), done: [...DONE], net: NET.entries.length }));
console.log(JSON.stringify(info, null, 1));
await pg.screenshot({ path: '/home/claude/f12/samples/s_full.png', fullPage: true });
console.log(errs.join('\n') || 'NO ERRORS');
await b.close();
