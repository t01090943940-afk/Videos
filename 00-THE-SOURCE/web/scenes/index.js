// ─────────────────────────────────────────────────────────────────────────────
//  scenes/index.js · 按拍调度各幕 + HUD
// ─────────────────────────────────────────────────────────────────────────────
import { TOWER, COSMOS, WORLDS, GPT_TAIL, DROP, SPLITS, PHONES, DROP_TAIL, ORB, SILENCE, REVEAL, INSIDE, OUTRO } from '../../src/timeline.mjs';
import { loadWorks, hud, seg, E } from './common.js';
import { genesis, prepareGenesis } from './genesis.js';
import { eras } from './eras.js';
import { drop } from './drop.js';
import { orb } from './orb.js';
import { silence, reveal, inside, outro } from './finale.js';

// 每部作品第一次出场的拍（HUD 底部 28 槽依次点亮）
const FIRST = {};
const see = (work, b) => { if (FIRST[work] === undefined || b < FIRST[work]) FIRST[work] = b; };
function buildFirst() {
  see('kimi-beat', 14);
  TOWER.forEach((w) => see(w.work, w.b));
  see('cosmos30', COSMOS.b0);
  see('beyond', WORLDS.b0);
  GPT_TAIL.forEach((g) => see(g.work, g.b0));
  [...DROP, ...DROP_TAIL].forEach((d) => see(d.work, d.b0));
  SPLITS.forEach((s) => s.panes.forEach((p, k) => see(p.work, s.b0 + k * 0.25)));
  PHONES.items.forEach((p, k) => see(p.work, PHONES.b0 + k * 0.2));
  see(PHONES.bgWork, PHONES.b0);
}

export async function prepareScenes(eng) {
  await loadWorks();
  buildFirst();
  prepareGenesis(eng);
}

export function scene(ctx) {
  const b = ctx.b;
  if (b < 16) genesis(ctx);
  else if (b < 52) eras(ctx);
  else if (b < ORB.b0) drop(ctx);
  else if (b < SILENCE.b0) orb(ctx);
  else if (b < REVEAL.b[0]) silence(ctx);
  else if (b < INSIDE.b0) reveal(ctx);
  else if (b < OUTRO.b0) inside(ctx);
  else outro(ctx);
  // HUD：进化 → 球墙段
  const ha = E.out2(seg(b, 16.5, 17.5)) * (1 - E.in2(seg(b, 89, 90))) * (b >= 51 && b < 52 ? 0 : 1);
  if (ha > 0) hud(ctx, ha, (key) => E.out3(seg(b, FIRST[key] ?? 999, (FIRST[key] ?? 999) + 0.5)));
}
