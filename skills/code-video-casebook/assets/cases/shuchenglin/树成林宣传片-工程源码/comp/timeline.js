/* ================================================================
   TIMELINE — every cut sits on the music grid (beat = .375s from 4.0)
   ACT0 0–4 冷开场 | ACT1 4–15.28 作品混剪 | 15.28–16 断拍
   ACT1b 16–23.55 说一句话→拿到成品 | ACT2 23.55–31 墙 | ACT3 31–55.02 拆墙后全面爆发
   ACT4 55.02–60 品牌落版
   ================================================================ */
const SHOTS = [], OVER = [];
const shot = (s, e, f) => SHOTS.push({ s, e, f });
const over = (s, e, f) => OVER.push({ s, e, f });
const OFFS = window.OFFS || {};
const off = (k, d) => (OFFS[k] !== undefined ? OFFS[k] : d);

/* ---- helpers ---- */
const SMALL = mk(160, 90), SMc = SMALL.getContext('2d');
function blurBg(im, dark = .55) {
  if (!im) return; SMc.clearRect(0, 0, 160, 90);
  const s = Math.max(160 / im.width, 90 / im.height); SMc.drawImage(im, (160 - im.width * s) / 2, (90 - im.height * s) / 2, im.width * s, im.height * s);
  ctx.save(); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(SMALL, -40, -20, W + 80, H + 40); ctx.restore(); fill('#000', dark);
}
function stamp(word, lt, { size = 380, dur = .34, color = '#fff', solid = false } = {}) {
  if (lt > dur) return;
  const p = prog(lt, 0, dur);
  ctx.save(); if (!solid) ctx.globalCompositeOperation = 'difference'; else { ctx.shadowColor = 'rgba(0,0,0,.9)'; ctx.shadowBlur = 60; }
  const sc = 1.25 - .25 * E.outExpo(p * 2);
  ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2);
  ctx.globalAlpha = 1 - E.inCubic(prog(lt, dur * .55, dur * .45));
  text(word, W / 2, H / 2 + size * .36, { size, mode: 'none', color, ls: size * .04 });
  ctx.restore();
}
// full-bleed still with Ken Burns
function full(key, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await img(key); const d = e - s;
    const z0 = o.z0 ?? 1.06, z1 = o.z1 ?? 1.16;
    cover(im, { zoom: lerp(z0, z1, lt / Math.max(d, .01)), fx: o.fx ?? .5, fy: o.fy ?? .5, filter: o.filter });
    if (o.dark) fill('#000', o.dark);
    FX.credit = o.credit ?? CREDIT[key] ?? '';
  });
}
// browser-framed still over blurred self
function win(key, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await img(key); const d = e - s, p = lt / Math.max(d, .01);
    blurBg(im, .5);
    const w = o.w ?? 1480, h = w * 0.625 + 38;
    const x = (W - w) / 2 + (o.dx ?? 0) * (1 - p) , y = (H - h) / 2 + lerp(40, -10, E.outCubic(p));
    const sc = lerp(.94, 1, E.outExpo(clamp(p * 3)));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.rotate((o.rot ?? 0) * (1 - E.outExpo(clamp(p * 2)))); ctx.translate(-W / 2, -H / 2);
    browser(im, x, y, w, h, o.url ?? (CREDIT[key] || '').split(' — ')[0]);
    ctx.restore();
    FX.credit = o.credit ?? CREDIT[key] ?? '';
  });
}
// sequence full-bleed
function seqFull(name, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await seq(name, (o.from ?? 0) / FPS + lt * (o.speed ?? 1), { loop: o.loop });
    cover(im, { zoom: lerp(o.z0 ?? 1.02, o.z1 ?? 1.08, lt / (e - s)), fx: o.fx ?? .5, fy: o.fy ?? .5, filter: o.filter });
    if (o.dark) fill('#000', o.dark);
    FX.credit = o.credit ?? '';
  });
}
function seqWin(name, s, e, o = {}) {
  shot(s, e, async (lt) => {
    const im = await seq(name, (o.from ?? 0) / FPS + lt * (o.speed ?? 1));
    blurBg(im, .6);
    const w = o.w ?? 1500, h = w * 0.5625 + 38, p = lt / (e - s);
    browser(im, (W - w) / 2, (H - h) / 2 + lerp(30, -10, E.outCubic(p)), w, h, o.url ?? '');
    FX.credit = o.credit ?? '';
  });
}
function chapter(s, e, label) { over(s, e, () => { FX.chapter = label; }); }
function hudOff(s, e) { over(s, e, () => { FX.hud = false; }); }
function caption(s, e, str, o = {}) {
  over(s, e, (lt) => {
    const size = o.size ?? 72, y = o.y ?? 900;
    const w = measure(str, size) + 80;
    ctx.save(); ctx.globalAlpha = E.outExpo(clamp(lt / .12));
    ctx.fillStyle = 'rgba(0,0,0,.78)'; ctx.fillRect(W / 2 - w / 2, y - size * 1.02, w, size * 1.36);
    ctx.fillStyle = RED; ctx.fillRect(W / 2 - w / 2, y - size * 1.02, 8, size * 1.36);
    ctx.restore();
    text(str, W / 2, y, { size, lt, mode: 'rise', stagger: .018, dur: .3 });
  });
}

/* =================== ACT 0 · 冷开场 0–4.0 =================== */
hudOff(0, 4.0);
shot(0, 4.0, async () => { fill('#000'); });
over(0, 1.0, (lt) => {           // 载入计数(官网开场同款)
  const n = Math.floor(E.inCubic(clamp(lt / 1.0)) * 180);
  text(String(n).padStart(3, '0'), W / 2, H / 2 + 60, { size: 200, fam: LAT, mode: 'none', ls: 6 });
  mono('FIRST EDUCATION — LOADING', W / 2, H / 2 + 140, { size: 18, align: 'center', color: 'rgba(255,255,255,.6)' });
});
over(1.0, 1.75, (lt) => { text('一个群。', W / 2, H / 2 + 70, { size: 200, lt, mode: 'drop', stagger: .03, dur: .35 }); });
over(1.75, 2.5, (lt) => {
  const w1 = measure('12', 230, LAT), w2 = measure(' 天。', 200);
  const x0 = W / 2 - (w1 + w2) / 2;
  text('12', x0, H / 2 + 80, { size: 230, fam: LAT, align: 'left', lt, mode: 'drop', dur: .3 });
  text(' 天。', x0 + w1, H / 2 + 80, { size: 200, align: 'left', lt: lt - .05, mode: 'drop', dur: .35 });
});
over(2.5, 3.25, (lt) => {
  const n = Math.round(lerp(180, 264, E.outExpo(clamp(lt / .25))));
  const w1 = measure('264', 230, LAT), w2 = measure(' 个网站。', 170);
  const x0 = W / 2 - (w1 + w2) / 2;
  text(String(n), x0, H / 2 + 80, { size: 230, fam: LAT, align: 'left', mode: 'none', color: RED });
  text(' 个网站。', x0 + w1, H / 2 + 80, { size: 170, align: 'left', lt, mode: 'drop', dur: .35 });
  mono('25IP 训练营 · 群内作品分享记录', W / 2, H / 2 + 190, { size: 20, align: 'center', color: 'rgba(255,255,255,.55)' });
});
over(0, 3.25, (lt) => { ctx.fillStyle = RED; ctx.fillRect(0, H - 6, W * E.inCubic(lt / 3.25), 6); });
over(3.25, 4.0, (lt) => {        // 红幕上切 + FIRST EDUCATION 字符锁定
  const p = E.outExpo(prog(lt, 0, .3));
  ctx.fillStyle = RED; ctx.fillRect(0, H * (1 - p), W, H * p);
  if (lt > .12) scramble('FIRST EDUCATION', W / 2, H / 2 + 40, lt - .12, { size: 120, color: '#000', per: .028 });
  if (lt > .55) { const q = E.inExpo(prog(lt, .55, .2)); fill('#fff', q); }
});
over(0.85, 4.0, (lt, t) => { // 八分音符脉冲
  const k = Math.floor((t - 0.85) / .1875); FX.glitch = (k % 4 === 0 && (t - .85 - k * .1875) < .05) ? .35 : 0;
});

/* =================== ACT 1 · 作品混剪 4.0–15.28 =================== */
chapter(4.0, 7.0, '01 — 网站 · WEBSITE');
full('wjm1', bt(0), bt(1), { z0: 1.12, z1: 1.02 });
seqFull('p918b', bt(1), bt(2), { from: off('p918b', 212), speed: 1.4, credit: 'PORSCHE 918 · 帧序列网页' });
seqFull('zero_intro', bt(2), bt(3), { from: off('zero_intro', 40), speed: 1.5, credit: '从 0 到 1，是最贵的' });
win('wjm3', bt(3), bt(4), { rot: -.04 });
seqFull('lang_intro', bt(4), bt(5), { from: off('lang_intro', 60), credit: '语言的力量 — 雪糕wo' });
full('nuelian', bt(5), bt(6), { z0: 1.2, z1: 1.05 });
seqFull('truth_intro', bt(6), bt(7), { from: off('truth_intro', 40), credit: 'AI 时代的残酷真相' });
win('kaijie1', bt(7), bt(8), { rot: .04 });
over(bt(0), bt(0) + .4, (lt) => stamp('网站', lt));

chapter(7.0, 10.0, '02 — 写真 · PORTRAIT');
seqFull('gallery', bt(8), bt(9), { from: off('gallery', 20), speed: 2.2, credit: 'AI 海报精选 · 真实生成结果', z0: 1.25, z1: 1.3 });
// 盖牌叠层:三张写真合辑逐拍落位
shot(bt(9), bt(12), async (lt, t) => {
  fill('#0a0a0a');
  const keys = ['cJiang', 'cQiu', 'cShu'], xs = [W / 2 - 560, W / 2, W / 2 + 560], rots = [-.05, .02, .05];
  for (let i = 0; i < 3; i++) {
    const lt2 = t - bt(9 + i); if (lt2 < 0) continue;
    const im = await img(keys[i]); const p = E.outBack(clamp(lt2 / .3));
    const h = 820, w = h * im.width / im.height;
    ctx.save(); ctx.translate(xs[i], H / 2 + (1 - p) * -700); ctx.rotate(rots[i] * (1.6 - .6 * p));
    ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 50; ctx.fillStyle = '#fff'; ctx.fillRect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20);
    ctx.shadowBlur = 0; ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
  }
  FX.credit = '个性写真 · 没有摄影师，整本杂志级写真';
});
shot(bt(12), bt(13), async (lt) => { const im = await img('cYi'); blurBg(im, .45); cover(im, { contain: true, zoom: lerp(.92, 1, lt / BEAT) }); FX.credit = '个性写真 · 合辑海报'; });
seqFull('gallery', bt(13), bt(14), { from: off('gallery2', 200), speed: 1.5, credit: 'AI 海报精选 · 真实生成结果', z0: 1.25, z1: 1.3 });
win('archive1', bt(15), bt(16), { rot: -.03, url: 'portrait-archive · 写真档案馆', credit: '写真档案馆 · 真实生成结果' });
full('imgflow', bt(14), bt(15), { credit: '写真工作流 · 一张照片进，整套风格出', z0: 1.0, z1: 1.08 });
over(bt(8), bt(8) + .4, (lt) => stamp('写真', lt));

chapter(10.0, 11.5, '03 — 视频 · VIDEO');
full('gen1', bt(16), bt(17), { z0: 1.25, z1: 1.08, credit: 'AI 生视频' });
full('gen3', bt(17), bt(18), { z0: 1.2, z1: 1.05, credit: 'AI 生视频' });
full('gen2', bt(18), bt(19), { z0: 1.05, z1: 1.2, credit: 'AI 生视频' });
full('gen4', bt(19), bt(20), { z0: 1.05, z1: 1.2, credit: 'AI 生视频' });
over(bt(16), bt(16) + .4, (lt) => stamp('视频', lt));

chapter(11.5, 15.28, '04 — 智能体 · AGENT');
seqWin('xhs', bt(20), bt(22), { from: off('xhs', 200), speed: 3, url: 'xhs-crawler · 实录', credit: '数据 · 选题调研' });
caption(bt(20) + .08, bt(22), '关键词进去，选题库出来。');
seqWin('aiweb', bt(22), bt(24), { from: off('aiweb', 0), speed: 3, url: 'ai-webpage · 实录', credit: '网站 · 浏览器里即时生成' });
caption(bt(22) + .08, bt(24), '一句需求进去，网站出来。');
seqWin('kb', bt(24), bt(26), { from: off('kb', 60), speed: 4, url: 'feishu kb · 公众号内容知识库', credit: '知识库 · 内容沉淀' });
caption(bt(24) + .08, bt(26), '一堆资料，长成知识库。');
shot(bt(26), bt(28), async (lt) => {   // 剪辑前后分屏
  const a = await img('clipRaw'), b = await img('clipCut'); fill('#0a0a0a');
  const p = E.outExpo(clamp(lt / .3));
  cover(a, { x: 0, y: 0, w: W / 2 - 4, h: H, zoom: 1.05, filter: 'grayscale(1) brightness(.8)' });
  cover(b, { x: W / 2 + 4, y: H * (1 - p), w: W / 2 - 4, h: H, zoom: 1.05 });
  mono('原素材 RAW', 80, 150, { size: 20, wt: 700 }); mono('成片 CUT', W / 2 + 60, 150, { size: 20, wt: 700, color: RED });
  FX.credit = '视频 · 智能剪辑';
});
caption(bt(26) + .08, bt(28), '口播素材进，成片出。');
over(bt(20), bt(20) + .4, (lt) => stamp('智能体', lt, { size: 320 }));

// 十六分音符快闪 14.5–15.28
const FLASH1 = ['lucky1', 'mom1', 'feng1', 'ipr1', 'mirror1', 'fwall', 'fourlaws', 'demos1', 'live2'];
FLASH1.forEach((k, i) => {
  const s = 14.5 + i * .09375, e = Math.min(15.28, s + .09375);
  if (s < 15.28) full(k, s, e, { z0: 1.1 + i * .05, z1: 1.14 + i * .05 });
});
over(14.5, 15.28, (lt) => { FX.rgb = 6 + lt * 18; FX.glitch = .25; });
// 断拍 15.28–16.0:冻结 + 去色
shot(15.28, 16.0, async (lt) => {
  const im = await img('live2'); cover(im, { zoom: 1.5, filter: 'grayscale(1) brightness(.16) blur(3px)' });
  FX.credit = '';
});
over(15.3, 16.0, (lt) => {
  text('每一件，', W / 2, H / 2 - 10, { size: 96, lt, mode: 'rise', stagger: .03, dur: .35 });
  text('都从一句话开始。', W / 2, H / 2 + 120, { size: 96, lt: lt - .2, mode: 'rise', stagger: .03, dur: .35 });
});

/* =================== ACT 1b · 说一句话 → 拿到成品 16.0–23.55 =================== */
chapter(16.0, 23.55, '05 — 许愿式开发 · ONE PROMPT');
shot(16.0, 17.5, async (lt, t) => {
  fill('#050505');
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
  const p = E.outExpo(clamp(lt / .3)), sc = 1.18 - .18 * p;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2); ctx.globalAlpha = clamp(p * 2);
  const x = 170, y = 440, w = W - 340, h = 190;
  ctx.fillStyle = '#0d0d0d'; ctx.fillRect(x, y, w, h); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
  mono('PROMPT ▸', x, y - 28, { size: 26, wt: 700, color: RED });
  mono('树成林 · 许愿式开发', x + w, y - 26, { size: 18, align: 'right', color: 'rgba(255,255,255,.55)' });
  const str = '给我一个乔布斯看了都震惊的网页。';
  const n = Math.floor(clamp((t - 16.3) / 1.05) * [...str].length + 1e-6);
  const shown = [...str].slice(0, n).join('');
  const tw = text(shown, x + 60, y + 124, { size: 84, wt: 700, align: 'left', mode: 'none' });
  if (Math.floor(t * 4) % 2 === 0 || n < [...str].length) { ctx.fillStyle = RED; ctx.fillRect(x + 68 + (n ? tw : 0), y + 44, 10, 100); }
  if (t > 17.3) mono('ENTER ↵', x + w - 30, y + h + 50, { size: 22, wt: 700, align: 'right', color: '#fff' });
  ctx.restore();
  FX.credit = '';
});
seqFull('site_intro', 17.5, 19.75, { from: 22, speed: 2.0, z0: 1.0, z1: 1.04, credit: 'shuchenglin-handbook.pages.dev' });
shot(19.75, 21.25, async (lt) => {
  const im = await seq('site_intro', 6.4 - .01); cover(im, { zoom: 1.08 + lt * .03 }); fill('#000', .72);
  FX.credit = '';
});
over(19.75, 21.25, (lt) => {
  const f = { size: 190, stagger: .05, dur: .5 };
  text('说一句话。', W / 2, 500, { ...f, lt, mode: 'rise' });
  text('拿到成品。', W / 2, 720, { ...f, lt: lt - .375, mode: 'rise' });
  ctx.fillStyle = RED; ctx.fillRect(W / 2 - 60, 780, 120 * E.outExpo(prog(lt, .6, .4)), 10);
});
seqFull('site_full', 21.25, 22.0, { from: off('site_full', 300), speed: 1.5, z0: 1.0, z1: 1.02, credit: 'shuchenglin-handbook.pages.dev · 由多个 AI 窗口并行建造' });

// 作品墙 pull-back
const POOL = ['wjm1', 'porsche', 'fzero', 'flang', 'live1', 'kaijie1', 'nuelian', 'feng1', 'cJiang', 'gen1', 'ipr2', 'lucky1', 'wed1', 'mom1', 'ftruth', 'fwall',
  'wjm2', 'cQiu', 'mirror1', 'fourlaws', 'demos1', 'biaobai1', 'gen2', 'archive1', 'live2', 'kaijie2', 'cShu', 'fpixel', 'wjm4', 'gen3', 'yezhen1', 'manifesto',
  'feng2', 'wed2', 'cYi', 'structure', 'ipr1', 'lucky2', 'gen4', 'fhoper', 'wjm3', 'zhuA'];
async function mosaic({ cols = 8, rows = 6, count = 1e9, seed = 3, zoom = 1, fxp = .5, fyp = .5, gray = false, bright = 1 }) {
  const tw = W / cols, th = H / rows; const r = rng(seed);
  const order = [...Array(cols * rows).keys()].sort(() => r() - .5);
  const rank = new Map(order.map((v, i) => [v, i]));
  ctx.save(); ctx.translate(W * fxp, H * fyp); ctx.scale(zoom, zoom); ctx.translate(-W * fxp, -H * fyp);
  for (let i = 0; i < cols * rows; i++) {
    if (rank.get(i) >= count) continue;
    const c = i % cols, rr = Math.floor(i / cols);
    const im = await img(POOL[(i * 13 + seed) % POOL.length]);
    cover(im, { x: c * tw + 3, y: rr * th + 3, w: tw - 6, h: th - 6, filter: gray ? 'grayscale(1) brightness(.5)' : (bright !== 1 ? `brightness(${bright})` : null) });
  }
  ctx.restore();
}
shot(22.0, 23.55, async (lt) => {
  fill('#000');
  const z = lerp(8, 1, E.inOutExpo(clamp(lt / .9)));
  await mosaic({ zoom: z, fxp: .4375, fyp: .0833, bright: lerp(1, .55, clamp((lt - .6) / .5)) });
  FX.credit = '';
});
over(22.375, 23.55, (lt) => {
  text('这，是树成林的日常。', W / 2, H / 2 + 40, { size: 120, lt, mode: 'rise', stagger: .035, dur: .45, shadow: 30 });
});

/* =================== ACT 2 · 墙 23.55–31.0 (breakdown) =================== */
hudOff(23.55, 31.0);
const WALLBG = (() => {
  const c = mk(), g = c.getContext('2d'); g.fillStyle = '#0e0e0e'; g.fillRect(0, 0, W, H);
  const r = rng(11); g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 4;
  for (let y = 0, row = 0; y < H + 90; y += 90, row++) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
    for (let x = (row % 2) * 120; x < W; x += 240) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 90); g.stroke(); }
  }
  const d = g.getImageData(0, 0, W, H); for (let i = 0; i < d.data.length; i += 4) { const n = (r() - .5) * 18; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } g.putImageData(d, 0, 0);
  return c;
})();
const CHARS4 = ['我', '不', '配', '问'], CX = [W / 2 - 480, W / 2 - 160, W / 2 + 160, W / 2 + 480];
const CRACKS = (() => {
  const r = rng(29), lines = [];
  function walk(x, y, a, len, depth) {
    const pts = [[x, y]]; let L = 0;
    for (let i = 0; i < len; i++) { a += (r() - .5) * .7; const s = 25 + r() * 45; x += Math.cos(a) * s; y += Math.sin(a) * s; L += s; pts.push([x, y]);
      if (depth < 2 && r() < .16) walk(x, y, a + (r() - .5) * 1.6, Math.floor(len * .5), depth + 1); }
    lines.push({ pts, d: depth });
  }
  for (let i = 0; i < 16; i++) walk(W / 2 + (r() - .5) * 60, H / 2 - 40 + (r() - .5) * 40, i / 16 * Math.PI * 2 + r() * .3, 22, 0);
  return lines;
})();
function drawCracks(g, p) {
  if (p <= 0) return;
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  for (const pass of [0, 1]) {
    g.strokeStyle = pass ? '#fff' : RED; g.lineWidth = pass ? 1.6 : 6; g.shadowColor = RED; g.shadowBlur = pass ? 0 : 28;
    for (const ln of CRACKS) {
      const pp = clamp(p * 1.4 - ln.d * .25); const n = Math.floor(pp * (ln.pts.length - 1)); if (n < 1) continue;
      g.beginPath(); g.moveTo(...ln.pts[0]); for (let i = 1; i <= n; i++) g.lineTo(...ln.pts[i]); g.stroke();
    }
  }
  g.restore();
}
function drawWall(t, g = ctx) {
  g.drawImage(WALLBG, 0, 0);
  CHARS4.forEach((c, i) => {
    const lt = t - bt(62 + i); if (lt < 0) return;
    const p = E.outExpo(clamp(lt / .18)), sc = 1.6 - .6 * p;
    g.save(); g.translate(CX[i], H / 2 + 20); g.scale(sc, sc); g.globalAlpha = clamp(p * 2);
    g.font = font(300); g.textAlign = 'center'; g.fillStyle = '#f2f2f2'; g.fillText(c, 0, 105); g.restore();
  });
  drawCracks(g, E.inCubic(prog(t, 28.5, 2.45)));
}
shot(23.55, 25.05, async () => { fill('#000'); });
over(23.6, 25.05, (lt) => {
  text('拉开差距的，', W / 2, 470, { size: 110, lt, mode: 'rise', stagger: .04, dur: .5 });
  text('从来不是技术。', W / 2, 640, { size: 110, lt: lt - .75, mode: 'rise', stagger: .04, dur: .5, out: 1.2 - .75 });
});
shot(25.05, 31.0, async (lt, t) => {
  const a = E.outCubic(clamp(lt / 1.2));
  const sh = t > 28.5 ? (t - 28.5) * 3.2 : 0; const r = rng(Math.floor(t * 30));
  ctx.save(); ctx.translate((r() - .5) * sh, (r() - .5) * sh); ctx.globalAlpha = a; drawWall(t); ctx.restore();
  fill('#000', .15 + .5 * (1 - a));
});
over(25.1, 26.5, (lt) => { text('是一堵墙。', W / 2, H / 2 + 60, { size: 150, lt, mode: 'rise', stagger: .05, dur: .5, out: 1.1 }); });
over(26.5, 31.0, (lt) => { text('墙上写着四个字 ——', W / 2, 250, { size: 46, wt: 500, color: 'rgba(255,255,255,.6)', lt, mode: 'fade', stagger: .02 }); });
over(30.25, 31.0, (lt) => {
  const w1 = measure('今天，', 96);
  text('今天，', W / 2 - 60, 900, { size: 96, lt, mode: 'rise', align: 'right' });
  text('拆了它。', W / 2 - 60, 900, { size: 96, lt: lt - .375, mode: 'rise', align: 'left', color: RED });
});
over(27.25, 31.0, (lt, t) => { // 每落一字一次震
  const k = Math.floor((t - 27.25) / BEAT); const since = t - 27.25 - k * BEAT;
  if (k < 4) FX.shakeAmp = 22 * Math.exp(-since * 14);
});

/* =================== ACT 3 · 拆墙 → 全面爆发 31.0–55.02 =================== */
// 墙碎片
const WALLCV = mk();
let wallBaked = false;
const SHARDS = (() => {
  const r = rng(77), cols = 9, rows = 6, P = [];
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) {
    const edge = i === 0 || j === 0 || i === cols || j === rows;
    P.push([i * W / cols + (edge ? 0 : (r() - .5) * 150), j * H / rows + (edge ? 0 : (r() - .5) * 120)]);
  }
  const S = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = P[j * (cols + 1) + i], b = P[j * (cols + 1) + i + 1], c = P[(j + 1) * (cols + 1) + i + 1], d = P[(j + 1) * (cols + 1) + i];
    for (const tri of (r() < .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]])) {
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      const ang = Math.atan2(cy - H / 2, cx - W / 2), dist = Math.hypot(cx - W / 2, cy - H / 2);
      S.push({ tri, cx, cy, vx: Math.cos(ang) * (900 + r() * 1400) * (0.6 + dist / 900), vy: Math.sin(ang) * (700 + r() * 1100) * (0.6 + dist / 900) + 200, vr: (r() - .5) * 9, vz: 1.2 + r() * 2.2 });
    }
  }
  return S;
})();
const BURST = ['p918b', 'gallery', 'wjm2', 'fzero', 'live1', 'feng2', 'gen3', 'wjm4'];
BURST.forEach((k, i) => {
  const s = 31.0 + i * .1875, e = s + .1875;
  if (k === 'p918b' || k === 'gallery') seqFull(k, s, e, { from: k === 'p918b' ? 190 : 120, z0: 1.15, z1: 1.2 });
  else full(k, s, e, { z0: 1.15, z1: 1.25 });
});
over(31.0, 32.0, (lt) => {
  if (!wallBaked) { const g = WALLCV.getContext('2d'); drawWall(30.99, g); wallBaked = true; }
  const p = E.outCubic(clamp(lt / .9));
  for (const s of SHARDS) {
    const tt = lt * lt * .9 + lt * .35;
    ctx.save();
    ctx.translate(s.cx + s.vx * tt * .6, s.cy + s.vy * tt * .6); ctx.rotate(s.vr * tt); ctx.scale(1 + s.vz * tt, 1 + s.vz * tt); ctx.translate(-s.cx, -s.cy);
    ctx.globalAlpha = 1 - E.inCubic(p);
    ctx.beginPath(); ctx.moveTo(...s.tri[0]); ctx.lineTo(...s.tri[1]); ctx.lineTo(...s.tri[2]); ctx.closePath(); ctx.clip();
    ctx.drawImage(WALLCV, 0, 0);
    ctx.strokeStyle = 'rgba(227,43,22,.8)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
  }
  FX.rgb = 14 * (1 - p); FX.hud = lt > .4;
});
chapter(31.0, 32.5, '06 — 拆墙 · BREAK THROUGH');

// GUIDE 列表 32.5–38.5:8 项 × 2 拍(官网「学生使用指南」同构)
const GUIDE = [
  ['01', '顶级审美的网站', '任何一个学生，一个能上线的网站', { seq: 'rAiweb', from: 30, speed: 2 }],
  ['02', '杂志级个人写真', '没有摄影师，整本杂志级写真', { seq: 'gallery', from: 60, speed: 2 }],
  ['03', '一键产出视频', 'AI 生视频 / AI 代码视频，两条流水线', { key: 'gen4' }],
  ['04', '微信聊天 → 需求单', '群聊 78 条 → 精华 38 条', { seq: 'bot', from: 20, speed: 2 }],
  ['05', '口播素材 → 成片', '字幕、花字、节奏一次到位', { key: 'clipCut' }],
  ['06', '关键词 → 选题库', '小红书爆款笔记，自动采集整理', { seq: 'xhs', from: 420, speed: 3 }],
  ['07', '一堆资料 → 知识库', '公众号 108 篇 → 自动分成 9 类', { seq: 'wxkb', from: 40, speed: 2 }],
  ['08', '整首成歌 · 海报 · 文案', '词曲、合辑海报、公众号长文', { key: 'cShu' }],
];
shot(32.5, 38.5, async (lt, t) => {
  fill('#000');
  const i = clamp(Math.floor(lt / .75), 0, 7), li = lt - i * .75;
  const [num, title, sub, media] = GUIDE[i];
  // media window (right)
  const mx = 980, my = 250, mw = 800, mh = 450;
  const im = media.seq ? await seq(media.seq, media.from / FPS + li * media.speed) : await img(media.key);
  const wp = E.outExpo(clamp(li / .25));
  ctx.save(); ctx.beginPath(); ctx.rect(mx, my + mh * (1 - wp), mw, mh * wp); ctx.clip();
  cover(im, { x: mx, y: my, w: mw, h: mh, zoom: 1.05 + li * .06 });
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.strokeRect(mx, my, mw, mh);
  mono(`PREVIEW · ${num} / 08`, mx, my - 18, { size: 16, color: 'rgba(255,255,255,.6)' });
  // left: number roll + title
  text(num, 140, 520, { size: 240, fam: LAT, align: 'left', lt: li, mode: 'roll', dur: .3, color: RED, ls: -8 });
  text(title, 140, 680, { size: 96, align: 'left', lt: li - .04, mode: 'rise', stagger: .02, dur: .35 });
  text(sub, 144, 760, { size: 36, wt: 500, align: 'left', lt: li - .1, mode: 'fade', stagger: .01, dur: .25, color: 'rgba(255,255,255,.7)' });
  // index rail
  for (let k = 0; k < 8; k++) { ctx.fillStyle = k === i ? RED : 'rgba(255,255,255,.25)'; ctx.fillRect(144 + k * 46, 850, 34, k === i ? 6 : 3); }
  mono('GUIDE — 在树成林，说一句话就能拿到', 140, 200, { size: 22, wt: 700, color: '#fff', ls: 2 });
  FX.credit = '';
});
chapter(32.5, 38.5, '07 — 使用指南 · GUIDE');

// 斜率 38.5–43.0
chapter(38.5, 43.0, '08 — 斜率 · SLOPE');
shot(38.5, 43.0, async (lt, t) => {
  fill('#000');
  const O = [260, 960];
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
  const ax = E.outExpo(clamp(lt / .3));
  ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(O[0] + 1460 * ax, O[1]); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(O[0], O[1] - 800 * ax); ctx.stroke();
  ctx.restore();
  mono('时间 TIME →', O[0] + 1460, O[1] + 40, { size: 18, align: 'right' });
  mono('成长 GROWTH ↑', O[0] - 10, O[1] - 820, { size: 18 });
  mono('成长斜率 · GROWTH SLOPE', 260, 150, { size: 22, wt: 700, color: '#fff' });
  // 15° grey
  const g = E.inOutCubic(prog(t, 38.7, .9)), L1 = 1440;
  const a1 = 15 * Math.PI / 180;
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(O[0] + L1 * g, O[1] - L1 * g * Math.tan(a1)); ctx.stroke();
  ctx.beginPath(); ctx.arc(O[0], O[1], 200, -a1 * g, 0); ctx.stroke(); ctx.restore();
  if (t > 39.3) text('IP 时代 · 15°', O[0] + L1, O[1] - L1 * Math.tan(a1) - 30, { size: 44, wt: 700, align: 'right', color: 'rgba(255,255,255,.6)', lt: t - 39.3, mode: 'fade' });
  // 60° red
  if (t >= 40.0) {
    const q = E.outExpo(clamp((t - 40.0) / .45)), a2 = 60 * Math.PI / 180, L2 = 1150;
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.shadowColor = RED; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(O[0] + L2 * q * Math.cos(a2), O[1] - L2 * q * Math.sin(a2)); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(O[0], O[1], 280, -a2 * q, 0); ctx.stroke(); ctx.restore();
    const deg = Math.round(60 * q);
    text(`AI 时代 · ${deg}°`, 640, 380, { size: 56, align: 'left', color: RED, mode: 'none' });
  }
  if (t < 41.45) text('两个时代，两种斜率。', 1060, 300, { size: 76, align: 'left', lt: t - 38.55, mode: 'rise', stagger: .03, out: 2.6, outDur: .25 });
  if (t > 41.5) {
    text('斜率，', 1060, 300, { size: 100, align: 'left', lt: t - 41.5, mode: 'rise' });
    text('被 AI 拉得无限陡峭。', 1060, 420, { size: 70, align: 'left', lt: t - 41.875, mode: 'rise', stagger: .025 });
  }
  FX.credit = t > 41.5 ? '摘自 · 从 0 到 1，是最贵的' : '';
});
// 重机枪对骑兵 43.0–44.5
shot(43.0, 44.5, async (lt) => {
  const im = await seq('truth_intro', 100 / FPS);
  cover(im, { zoom: 1.1 + lt * .05, filter: 'brightness(.14) blur(6px)' });
  FX.credit = '摘自 · AI 时代的残酷真相与破局之道';
});
over(43.0, 44.5, (lt) => {
  text('AI 对传统做法，', W / 2, 420, { size: 72, lt, mode: 'rise', stagger: .02 });
  const w1 = measure('是', 170), w2 = measure('重机枪', 170), w3 = measure('对骑兵。', 170); const x0 = W / 2 - (w1 + w2 + w3) / 2;
  text('是', x0, 640, { size: 170, align: 'left', lt: lt - .375, mode: 'rise' });
  text('重机枪', x0 + w1, 640, { size: 170, align: 'left', lt: lt - .42, mode: 'rise', color: RED });
  text('对骑兵。', x0 + w1 + w2, 640, { size: 170, align: 'left', lt: lt - .5, mode: 'rise' });
  text('这就是代差。', W / 2, 800, { size: 56, wt: 500, lt: lt - .9, mode: 'fade', color: 'rgba(255,255,255,.75)' });
});

// FOMO 44.5–50.5
chapter(44.5, 50.5, '09 — 你在哪 · WHERE ARE YOU');
const FEED = ['cJiang', 'gen1', 'cQiu', 'gen4', 'cShu', 'gen2', 'cYi', 'zhuA', 'gen3', 'kb01', 'codeLive2', 'codeZuihou'];
shot(44.5, 46.75, async (lt, t) => {
  fill('#000');
  const cw = 300, chh = 533;
  for (let c = 0; c < 6; c++) {
    const speed = 1400 + (c % 3) * 400, y0 = -((lt * speed + c * 230) % (chh + 30));
    for (let k = -1; k < 4; k++) {
      const im = await img(FEED[(c * 3 + k + 12 + Math.floor((lt * speed + c * 230) / (chh + 30))) % FEED.length]);
      cover(im, { x: 60 + c * 310, y: y0 + k * (chh + 30), w: cw, h: chh, filter: 'grayscale(1) brightness(.33) blur(2px)' });
    }
  }
  FX.credit = '';
});
over(44.5, 46.0, (lt) => {
  const w1 = measure('你刷短视频的 ', 110), w2 = measure('12', 130, LAT), w3 = measure(' 天里，', 110); const x0 = W / 2 - (w1 + w2 + w3) / 2;
  text('你刷短视频的 ', x0, H / 2 + 40, { size: 110, align: 'left', lt, mode: 'rise', stagger: .03, shadow: 40 });
  text('12', x0 + w1, H / 2 + 40, { size: 130, fam: LAT, align: 'left', lt: lt - .2, mode: 'rise', color: RED });
  text(' 天里，', x0 + w1 + w2, H / 2 + 40, { size: 110, align: 'left', lt: lt - .25, mode: 'rise', shadow: 40 });
});
over(46.0, 46.75, (lt) => { text('他们往群里，晒出了', W / 2, H / 2 + 40, { size: 110, lt, mode: 'rise', stagger: .03, shadow: 40 }); });
shot(46.75, 50.5, async (lt, t) => {
  fill('#000');
  const cnt = Math.floor(96 * E.outCubic(clamp(lt / 2.25))) + (lt > 2.25 ? 96 : 0);
  await mosaic({ cols: 12, rows: 8, count: cnt, seed: 5, bright: t < 49.0 ? .75 : .9 });
  FX.credit = '';
});
over(46.75, 49.0, (lt) => {
  const n = Math.round(264 * E.outCubic(clamp(lt / 2.25)));
  ctx.fillStyle = 'rgba(0,0,0,.8)'; ctx.fillRect(0, H / 2 - 230, W, 400);
  const w1 = measure('264', 330, LAT), w2 = measure(' 个网站', 110); const x0 = W / 2 - (w1 + w2) / 2;
  text(String(n).padStart(3, '0'), x0, H / 2 + 110, { size: 330, fam: LAT, align: 'left', mode: 'none', color: '#fff', ls: -6 });
  text(' 个网站', x0 + w1, H / 2 + 110, { size: 110, align: 'left', mode: 'none', color: RED });
});
['网站', '写真', '视频', '歌'].forEach((wd, i) => over(bt(120 + i), bt(120 + i) + .37, (lt) => stamp(wd, lt, { size: 420, solid: true })));

// 先做，再想。50.5–52.0
chapter(50.5, 55.02, '10 — 现在 · NOW');
shot(50.5, 52.0, async (lt) => {
  const im = await seq('zero_full', 238 / FPS + lt * 1.1);
  cover(im, { zoom: 1.0 + lt * .08, fy: .5 });
  FX.credit = '摘自 · 从 0 到 1，是最贵的（HOPER VOL.002）';
});
caption(51.1, 52.0, '从 0 到 1 不是知识问题，是动作问题。', { size: 54, y: 960 });
// 快闪 52.0–53.5(16 × 十六分音符)
const FLASH2 = ['wjm1', 'porsche', 'cJiang', 'fzero', 'gen1', 'live1', 'nuelian', 'kaijie1', 'cQiu', 'flang', 'feng1', 'gen3', 'wjm3', 'ftruth', 'cShu', 'fourlaws'];
FLASH2.forEach((k, i) => full(k, 52.0 + i * .09375, 52.0 + (i + 1) * .09375, { z0: 1.05 + i * .02, z1: 1.1 + i * .02 }));
over(52.0, 53.5, (lt) => { FX.rgb = 4 + lt * 10; FX.glitch = lt > 1.1 ? .5 : .15; });
// 下一件作品,署你的名字。53.5–55.02(反白)
shot(53.5, 55.02, async () => { fill('#f4f4f4'); FX.hud = false; FX.grain = .05; });
over(53.5, 55.02, (lt) => {
  text('下一件作品，', W / 2, 470, { size: 150, lt, mode: 'rise', color: '#000', stagger: .04 });
  const w1 = measure('署', 190), w2 = measure('你的名字', 190), w3 = measure('。', 190); const x0 = W / 2 - (w1 + w2 + w3) / 2;
  text('署', x0, 720, { size: 190, align: 'left', lt: lt - .75, mode: 'slam', color: '#000' });
  text('你的名字', x0 + w1, 720, { size: 190, align: 'left', lt: lt - .75, mode: 'slam', color: RED });
  text('。', x0 + w1 + w2, 720, { size: 190, align: 'left', lt: lt - .75, mode: 'slam', color: '#000' });
});

/* =================== ACT 4 · 品牌落版 55.02–60 =================== */
hudOff(55.02, 60);
shot(55.02, 60, async (lt, t) => {
  fill('#000');
  if (t < 55.42) { const a = E.outCubic(prog(t, 55.1, .3)); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(W / 2, H / 2, 10 * a, 0, 7); ctx.fill(); return; }
  const lt2 = t - 55.42;
  const slide = E.inOutExpo(prog(t, 56.9, .6));
  const cx = lerp(W / 2, 700, slide);
  text('树成林', cx, 560, { size: 250, lt: lt2, mode: 'slam', ls: 10 });
  ctx.fillStyle = RED; ctx.fillRect(cx - 70, 612, 140 * E.outExpo(prog(lt2, .2, .4)), 10);
  text('全国最大的大学生AI社群', cx, 720, { size: 52, wt: 500, lt: lt2 - .35, mode: 'fade', stagger: .02, color: 'rgba(255,255,255,.85)' });
  if (t > 56.9) {
    const q = E.outExpo(prog(t, 57.1, .5)), qr = await img('qr');
    const x = 1230, y = 250, w = 420;
    ctx.save(); ctx.globalAlpha = q; ctx.translate(0, (1 - q) * 60);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, w + 110);
    ctx.drawImage(qr, x + 30, y + 30, w - 60, w - 60);
    text('欢迎加入我们', x + w / 2, y + w + 55, { size: 40, color: '#000', mode: 'none' });
    mono('SCAN · WECHAT', x + w / 2, y + w + 92, { size: 15, align: 'center', color: '#8a8a8a' });
    ctx.restore();
  }
  if (t > 57.8) {
    ctx.save(); ctx.globalAlpha = E.outCubic(prog(t, 57.8, .5));
    mono('FIRST EDUCATION · STUDENT AI ARCHIVE © 2026', 56, H - 60, { size: 17, wt: 700 });
    mono('shuchenglin-handbook.pages.dev', W - 56, H - 60, { size: 17, wt: 700, align: 'right' });
    // 未完待续 · 红点呼吸(官网终幕同款)
    text('未完待续', cx - 30, 830, { size: 34, wt: 500, mode: 'none', color: 'rgba(255,255,255,.6)' });
    const br = .6 + .4 * Math.sin(t * 5);
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(cx + 58, 820, 7 * br + 3, 0, 7); ctx.fill();
    ctx.restore();
  }
  FX.grain = .08;
  const fo = E.inCubic(prog(t, 59.35, .65)); if (fo > 0) fill('#000', fo);
});

/* =================== RENDER =================== */
async function seek(t) {
  resetFX();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  fill('#000');
  // overlays that set FX first (cheap pre-pass so camera knows about shake)
  // camera
  let punch = beatPunch(t);
  for (const [ht, a] of HITS) if (t >= ht && t < ht + .6) { punch += .08 * a * Math.exp(-(t - ht) * 9); }
  let shake = 0; for (const [ht, a] of HITS) if (t >= ht && t < ht + .5) shake += 26 * a * Math.exp(-(t - ht) * 10);
  // base
  const active = SHOTS.filter(s => t >= s.s && t < s.e);
  const r = rng(Math.floor(t * 30) + 1);
  ctx.save();
  const sc = 1 + punch + (shake > 0 ? .03 : 0);
  ctx.translate(W / 2 + (r() - .5) * shake, H / 2 + (r() - .5) * shake); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2);
  for (const s of active) await s.f(t - s.s, t);
  ctx.restore();
  // overlays
  for (const o of OVER) if (t >= o.s && t < o.e) {
    await o.f(t - o.s, t);
  }
  if (FX.shakeAmp > 0) { OFFc.clearRect(0, 0, W, H); OFFc.drawImage(cv, 0, 0); fill('#000'); ctx.drawImage(OFF, (r() - .5) * FX.shakeAmp, (r() - .5) * FX.shakeAmp); }
  // hit flashes
  for (const [ht, a] of HITS) if (t >= ht && t < ht + .25) fill('#fff', .55 * a * (1 - (t - ht) / .25));
  // chroma on bars in drops
  const bp = beatPunch(t); if (bp > .03) FX.rgb = Math.max(FX.rgb, bp * 260);
  glitchSlices(FX.glitch, Math.floor(t * 30) * 17);
  rgbSplit(FX.rgb);
  // grain + vignette
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = FX.grain; ctx.drawImage(GR[Math.floor(t * 30) % 3], 0, 0, W, H); ctx.restore();
  ctx.drawImage(VIG, 0, 0);
  hud(t);
}
window.renderFrame = async (i) => { await seek(i / FPS); return cv.toDataURL('image/jpeg', .93); };
window.preload = async () => {
  await document.fonts.load('900 100px "Noto Sans CJK SC"'); await document.fonts.load('500 100px "Noto Sans CJK SC"');
  await document.fonts.load('700 100px "Noto Sans CJK SC"');
  await document.fonts.load('900 100px "Archivo"'); await document.fonts.load('400 20px "Space Mono"'); await document.fonts.load('700 20px "Space Mono"');
  await Promise.all(Object.keys(IMG).map(img));
  return 'ok';
};
