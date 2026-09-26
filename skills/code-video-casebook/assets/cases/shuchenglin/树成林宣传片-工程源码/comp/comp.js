/* ================================================================
   树成林 · 60s 宣传片 — code-driven compositor
   seek(t) renders the exact frame for time t (sec). Deterministic.
   ================================================================ */
const W = 1920, H = 1080, FPS = 30, DUR = 60;
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
const RED = '#E32B16';
const CJK = '"Noto Sans CJK SC", "Noto Sans SC", sans-serif';
const LAT = '"Archivo", "Noto Sans CJK SC", sans-serif';
const MONO = '"Space Mono", "Noto Sans CJK SC", monospace';

/* ---------- math ---------- */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, s, d) => clamp((t - s) / d);
const lerp = (a, b, p) => a + (b - a) * p;
const E = {
  outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
  outCubic: x => 1 - Math.pow(1 - x, 3),
  inCubic: x => x * x * x,
  inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  inOutExpo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outBack: x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
};
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = (n) => rng(n * 9301 + 49297)();

/* ---------- beat grid (music edited so the grid is continuous) ---------- */
const T0 = 4.0, BEAT = 0.375, BAR = 1.5;
const bt = k => T0 + BEAT * k;
const DROPS = [[4.0, 15.28], [16.0, 23.55], [31.0, 55.02]];

/* ---------- assets ---------- */
const R = '/src/site/';
const SH = R + 'sections/m-web/assets/shots/';
const SK = R + 'sections/m-skill/assets/';
const VD = R + 'sections/m-video/assets/';
const IMG = {
  wjm1: SH + 'wangjiemin-1.jpg', wjm2: SH + 'wangjiemin-2.jpg', wjm3: SH + 'wangjiemin-3.jpg', wjm4: SH + 'wangjiemin-4.jpg',
  kaijie1: SH + 'kaijie-1.jpg', kaijie2: SH + 'kaijie-2.jpg', live1: SH + '25ip-live-1.jpg', live2: SH + '25ip-live-2.jpg',
  ipr1: SH + 'ipreview-1.jpg', ipr2: SH + 'ipreview-2.jpg', demos1: SH + 'web-demos-1.jpg', mirror1: SH + 'mirror-1.jpg',
  feng1: SH + 'fenglisu-1.jpg', feng2: SH + 'fenglisu-2.jpg', lucky1: SH + 'lucky-sprite-1.jpg', lucky2: SH + 'lucky-sprite-2.jpg',
  mom1: SH + 'mothers-day-1.jpg', wed1: SH + 'wedding-1.jpg', wed2: SH + 'wedding-2.jpg', biaobai1: SH + 'biaobai-1.jpg',
  archive1: SH + 'portrait-archive-1.jpg', yezhen1: SH + 'yezhen-1.jpg',
  porsche: SH + 'shot-porsche.jpg', nuelian: SH + 'shot-nuelian.jpg', fourlaws: SH + 'shot-fourlaws.jpg',
  manifesto: SH + 'shot-manifesto.jpg', structure: SH + 'shot-structure.jpg',
  flang: SH + 'file-language.jpg', fpixel: SH + 'file-language-pixel.jpg', ftruth: SH + 'file-truth.jpg',
  fwall: SH + 'file-wall.jpg', fzero: SH + 'file-zero2one.jpg', fhoper: SH + 'file-hoper.jpg', fstruct: SH + 'file-structure.jpg',
  cJiang: SK + 'collage-jiangge.jpg', cQiu: SK + 'collage-qiuting.jpg', cShu: SK + 'collage-shulin.jpg', cYi: SK + 'collage-yixing.jpg',
  clipRaw: SK + 'poster-clip-raw.jpg', clipCut: SK + 'poster-clip-cut.jpg', imgflow: SK + 'skill-imagegen-workflow.png',
  gen1: VD + 'gen-01-poster.jpg', gen2: VD + 'gen-02-poster.jpg', gen3: VD + 'gen-03-poster.jpg', gen4: VD + 'gen-04-poster.jpg',
  kb01: VD + 'kb-01-poster.jpg', codeLive2: VD + 'code-live-2-poster.jpg', codeZuihou: VD + 'code-live-zuihou-poster.jpg',
  zhuA: R + 'showcase-assets/video-matrix/zhuning-a-poster.jpg',
  qr: R + 'base/assets/qr-course.png',
};
const CREDIT = {
  wjm1: 'wangjiemin.com — 王杰民', wjm2: 'wangjiemin.com — 王杰民', wjm3: 'wangjiemin.com — 王杰民', wjm4: 'wangjiemin.com — 王杰民',
  kaijie1: 'kaijie — 凯杰', kaijie2: 'kaijie — 凯杰', live1: '25IP Live Exhibition — 东渐西被', live2: '25IP Live Exhibition — 东渐西被',
  ipr1: 'ipreview — Rheos', ipr2: 'ipreview — Rheos', demos1: 'web-demos — FATE', mirror1: 'mirror — FATE',
  feng1: 'fancy-fenglisu — 不忧白', feng2: 'fancy-fenglisu — 不忧白', lucky1: 'lucky-sprite — 半杯箫暮', lucky2: 'lucky-sprite — 半杯箫暮',
  mom1: '母亲节贺卡 — 万象榕', wed1: '婚礼祝福网站 — dawn', wed2: '婚礼祝福网站 — dawn', biaobai1: '表白网站 — 昕',
  yezhen1: '野针 AI 识别 — 王杰民', flang: '语言的力量 — 雪糕wo', fpixel: '语言的力量 · 像素版 — 雪糕wo', structure: 'structure — 亮作', fstruct: 'structure — 亮作',
  fzero: '从 0 到 1，是最贵的', ftruth: 'AI 时代的残酷真相', fwall: '有一道看不见的墙', fhoper: 'HOPER VOL.002',
  porsche: 'PORSCHE · 676 帧 · 单文件', nuelian: '虐恋的完美配方', fourlaws: '一切都会 AI 化',
};
const SEQ = {
  site_intro: { dir: '/work/cap/site_intro/', n: 195, base: 0 },
  site_full: { dir: '/work/cap/site_full/', n: 1059, base: 0 },
  zero_intro: { dir: '/work/cap/zero_intro/', n: 120, base: 0 },
  zero_full: { dir: '/work/cap/zero_full/', n: 258, base: 0 },
  truth_intro: { dir: '/work/cap/truth_intro/', n: 105, base: 0 },
  truth_full: { dir: '/work/cap/truth_full/', n: 558, base: 0 },
  lang_intro: { dir: '/work/cap/lang_intro/', n: 90, base: 0 },
  lang_full: { dir: '/work/cap/lang_full/', n: 225, base: 0 },
  attn_intro: { dir: '/work/cap/attn_intro/', n: 90, base: 0 },
  attn_part: { dir: '/work/cap/attn_part/', n: 150, base: 0 },
  strangers: { dir: '/work/cap/strangers/', n: 300, base: 0 },
  last2: { dir: '/work/cap/last2/', n: 180, base: 0 },
  aiweb: { dir: '/work/vid/row-ai-webpage/', n: 485, base: 1 },
  bot: { dir: '/work/vid/row-bot-install/', n: 161, base: 1 },
  kb: { dir: '/work/vid/row-wechat-kb/', n: 336, base: 1 },
  xhs: { dir: '/work/vid/row-xhs-crawler/', n: 900, base: 1 },
  p918a: { dir: '/work/vid/riv-vid-918a/', n: 243, base: 1 },
  p918b: { dir: '/work/vid/riv-vid-918b/', n: 243, base: 1 },
  rAiweb: { dir: '/work/vid/riv-vid-aiweb/', n: 243, base: 1 },
  gallery: { dir: '/work/vid/riv-vid-gallery/', n: 298, base: 1 },
  flow: { dir: '/work/vid/riv-vid-flow/', n: 331, base: 1 },
  wxkb: { dir: '/work/vid/riv-vid-wxkb/', n: 243, base: 1 },
  l0: { dir: '/work/vid/l0/', n: 105, base: 1 }, l3: { dir: '/work/vid/l3/', n: 105, base: 1 }, l5: { dir: '/work/vid/l5/', n: 105, base: 1 },
};
const still = new Map(), frames = new Map();
function loadImg(src) {
  return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => { console.error('ERR ' + src); res(null); }; im.src = src; });
}
async function img(key) { if (!still.has(key)) still.set(key, loadImg(IMG[key] || key)); return still.get(key); }
async function seq(name, sec, { loop = false } = {}) {
  const S = SEQ[name]; let i = Math.floor(sec * FPS + 1e-6);
  i = loop ? ((i % S.n) + S.n) % S.n : clamp(i, 0, S.n - 1);
  const src = S.dir + String(i + S.base).padStart(4, '0') + '.jpg';
  if (!frames.has(src)) {
    frames.set(src, loadImg(src));
    if (frames.size > 260) frames.delete(frames.keys().next().value);
  }
  return frames.get(src);
}

/* ---------- drawing primitives ---------- */
function cover(im, o = {}) {
  if (!im) return;
  const { x = 0, y = 0, w = W, h = H, zoom = 1, fx = .5, fy = .5, alpha = 1, filter = null, contain = false } = o;
  const s = (contain ? Math.min(w / im.width, h / im.height) : Math.max(w / im.width, h / im.height)) * zoom;
  const dw = im.width * s, dh = im.height * s;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.globalAlpha = alpha; if (filter) ctx.filter = filter;
  ctx.drawImage(im, x + (w - dw) * fx, y + (h - dh) * fy, dw, dh);
  ctx.restore();
}
function fill(c, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function font(size, fam = CJK, wt = 900) { return `${wt} ${size}px ${fam}`; }

/* per-char text engine: modes rise | drop | slam | type | roll | fade | none */
function text(str, x, y, o = {}) {
  const { size = 100, fam = CJK, wt = 900, color = '#fff', align = 'center', lt = 99, mode = 'rise', stagger = .035, dur = .55,
    ls = 0, out = null, outDur = .35, alpha = 1, shadow = 0, stroke = null } = o;
  ctx.save(); ctx.font = font(size, fam, wt); ctx.textBaseline = 'alphabetic';
  const chars = [...str]; const ws = chars.map(c => ctx.measureText(c).width + ls);
  const total = ws.reduce((a, b) => a + b, 0) - ls;
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const shown = mode === 'type' ? Math.floor(clamp(lt / dur) * chars.length + 1e-6) : chars.length;
  if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = shadow; }
  chars.forEach((c, i) => {
    if (i >= shown) return;
    const p = prog(lt, i * stagger, dur);
    let dy = 0, a = alpha, sc = 1;
    let op = 0; if (out !== null) op = E.inExpo(prog(lt, out + i * stagger * .5, outDur));
    if (mode === 'rise') { dy = (1 - E.outExpo(p)) * size * 1.15 - op * size * 1.15; }
    else if (mode === 'drop') { const q = E.outBack(p); dy = -(1 - q) * size * .9; a *= clamp(p * 3); a *= 1 - op; }
    else if (mode === 'fade') { a *= E.outCubic(p) * (1 - op); }
    else if (mode === 'slam') { const q = prog(lt, 0, .28); sc = 1 + (1 - E.outExpo(q)) * .9; a *= clamp(q * 5) * (1 - op); }
    else if (mode === 'roll') { dy = (1 - E.outExpo(p)) * size * 1.1 - op * size * 1.1; }
    ctx.save();
    if (mode === 'rise' || mode === 'roll') { ctx.beginPath(); ctx.rect(cx - 4, y - size * 1.02, ws[i] + 8, size * 1.28); ctx.clip(); }
    ctx.globalAlpha = clamp(a);
    if (sc !== 1) { const mx = x, my = y - size * .38; ctx.translate(mx, my); ctx.scale(sc, sc); ctx.translate(-mx, -my); }
    if (stroke) { ctx.lineWidth = stroke[1]; ctx.strokeStyle = stroke[0]; ctx.strokeText(c, cx, y + dy); }
    ctx.fillStyle = color; ctx.fillText(c, cx, y + dy);
    ctx.restore();
    cx += ws[i];
  });
  ctx.restore();
  return total;
}
function measure(str, size, fam = CJK, wt = 900, ls = 0) { ctx.save(); ctx.font = font(size, fam, wt); const w = [...str].reduce((a, c) => a + ctx.measureText(c).width + ls, 0) - ls; ctx.restore(); return w; }
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>';
function scramble(str, x, y, lt, o = {}) {
  const { size = 60, color = '#fff', align = 'center', per = .035, start = .08, fam = LAT, ls = size * .08 } = o;
  const r = rng(Math.floor(lt * 30) * 131 + str.length);
  const out = [...str].map((c, i) => (c === ' ' || lt > start + i * per) ? c : GLYPHS[Math.floor(r() * GLYPHS.length)]).join('');
  return text(out, x, y, { size, fam, color, align, mode: 'none', ls });
}
function mono(str, x, y, o = {}) { const { size = 18, color = 'rgba(255,255,255,.75)', align = 'left', ls = 3, wt = 400 } = o; return text(str, x, y, { size, fam: MONO, wt, color, align, mode: 'none', ls }); }

/* browser-window frame around a screenshot (斜置橱窗 style) */
function browser(im, x, y, w, h, url = '', o = {}) {
  const { zoom = 1, fy = 0, alpha = 1 } = o;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  ctx.fillStyle = '#161616'; ctx.fillRect(x, y, w, h); ctx.restore();
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = '#1d1d1d'; ctx.fillRect(x, y, w, 38);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 22 + i * 20, y + 19, 6, 0, 7); ctx.fill(); });
  ctx.fillStyle = '#0e0e0e'; ctx.fillRect(x + w * .3, y + 8, w * .4, 22);
  ctx.restore();
  if (url) { ctx.save(); ctx.globalAlpha = alpha; mono(url, x + w / 2, y + 25, { size: 13, align: 'center', ls: 1, color: 'rgba(255,255,255,.6)' }); ctx.restore(); }
  cover(im, { x, y: y + 38, w, h: h - 38, zoom, fy, alpha });
}

/* ---------- global FX state (collected per frame) ---------- */
let FX;
function resetFX() { FX = { punch: 0, shakeAmp: 0, rgb: 0, glitch: 0, flash: 0, flashC: '#fff', hud: true, chapter: '', credit: '', grain: .1, gray: false, dark: 0 }; }
function beatPunch(t) {
  for (const [s, e] of DROPS) {
    if (t >= s && t < e) {
      const k = Math.floor((t - s) / BEAT + 1e-6), since = t - (s + k * BEAT);
      const isBar = ((s - T0) / BEAT + k) % 4 === 0;
      return (isBar ? .045 : .02) * Math.exp(-since * 11);
    }
  }
  return 0;
}
const HITS = [[4.0, 1], [16.0, .8], [17.5, .5], [31.0, 1.2], [40.0, .6], [46.75, .5], [55.42, .7]];

/* ---------- offscreen helpers ---------- */
function mk(w = W, h = H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const OFF = mk(), OFFc = OFF.getContext('2d');
const CH = [mk(), mk(), mk()];
function rgbSplit(amt) {
  if (amt < .5) return;
  OFFc.clearRect(0, 0, W, H); OFFc.drawImage(cv, 0, 0);
  ['#f00', '#0f0', '#00f'].forEach((c, i) => {
    const g = CH[i].getContext('2d'); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H); g.drawImage(OFF, 0, 0);
    g.globalCompositeOperation = 'multiply'; g.fillStyle = c; g.fillRect(0, 0, W, H);
  });
  ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(CH[0], amt, 0); ctx.drawImage(CH[1], 0, 0); ctx.drawImage(CH[2], -amt, 0); ctx.restore();
}
function glitchSlices(amt, seed) {
  if (amt <= 0) return;
  OFFc.clearRect(0, 0, W, H); OFFc.drawImage(cv, 0, 0);
  const r = rng(seed); const n = 6 + Math.floor(amt * 10);
  for (let i = 0; i < n; i++) {
    const y = r() * H, h = 8 + r() * 90 * amt, dx = (r() - .5) * 220 * amt;
    ctx.drawImage(OFF, 0, y, W, h, dx, y, W, h);
  }
}
const GR = [0, 1, 2].map(s => { const c = mk(960, 540), g = c.getContext('2d'), d = g.createImageData(960, 540), r = rng(s + 7); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; });
const VIG = (() => { const c = mk(), g = c.getContext('2d'); const gr = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.72)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); return c; })();

/* ---------- HUD (site chrome, persistent memory anchor) ---------- */
function hud(t) {
  const a = FX.hud ? 1 : 0; if (!a) return;
  ctx.save();
  mono('树成林 · STUDENT AI ARCHIVE ®', 56, 58, { size: 17, color: 'rgba(255,255,255,.85)', wt: 700, ls: 2 });
  mono('FIRST EDUCATION', W - 56, 58, { size: 17, align: 'right', color: 'rgba(255,255,255,.85)', wt: 700, ls: 3 });
  // corner marks
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2;
  [[40, 90, 1, 1], [W - 40, 90, -1, 1], [40, H - 90, 1, -1], [W - 40, H - 90, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x, y + 26 * sy); ctx.lineTo(x, y); ctx.lineTo(x + 26 * sx, y); ctx.stroke(); });
  const s = Math.floor(t), f = Math.floor((t - s) * 30);
  mono(`REC ● 00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`, 56, H - 44, { size: 16, color: 'rgba(255,255,255,.7)' });
  // progress
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(W - 356, H - 52, 300, 3);
  ctx.fillStyle = RED; ctx.fillRect(W - 356, H - 52, 300 * t / DUR, 3);
  if (FX.chapter) mono(FX.chapter, W - 56, H - 64, { size: 16, align: 'right', color: 'rgba(255,255,255,.85)', wt: 700 });
  if (FX.credit) {
    ctx.fillStyle = RED; ctx.fillRect(56, H - 108, 12, 12);
    mono(FX.credit, 80, H - 97, { size: 19, color: '#fff', wt: 700, ls: 1 });
  }
  ctx.restore();
}
