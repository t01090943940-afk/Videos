/* ─────────────────────────────────────────────────────────────────────────────
   runtime.js · 整支片子 = 一个函数 render(t)
   ---------------------------------------------------------------------------
   这正是合集里 28 部片子共同的秘密：画面是时间的纯函数。
   本片也不例外 —— 没有 requestAnimationFrame，没有 Date.now()，没有未播种的随机数。
   HyperFrames 逐帧 seek GSAP 时间轴 → onUpdate → render(tl.time())。
   任意一帧都能单独渲染：在浏览器控制台执行 __render(37.2) 即可预览第 37.2 秒。

   结构：
     §1 数学 / 缓动 / 伪随机        §6 GPT：宫格倍增 / 全屏 / 双画幅
     §2 DOM 写入缓存               §7 OPUS：DROP / 分屏 / 手机 / 隧道 / 巨墙
     §3 事件表（闪白/震屏/冲击波）  §8 凝视 / 通通开源 / 三柱 / 卡片 / 尾声
     §4 冷开场                     §9 HUD（时间码、时代、28 槽时间尺）
     §5 时代卡 + 能力曲线 / 窗口堆叠 §10 前后景 FX 画布（颗粒、代码墙、速度线…）
   ───────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const D = window.__EDL;
  const { BEAT, FPS, DURATION, TEXT: TX } = D;
  const W = 1920, H = 1080, CX = 960, CY = 540;

  // ═══ §1 数学 ═══════════════════════════════════════════════════════════════
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (x, a, b) => clamp((x - a) / (b - a));
  const Ez = {
    oC: (x) => 1 - Math.pow(1 - x, 3),
    iC: (x) => x * x * x,
    ioC: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    oE: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    iE: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
    oQ: (x) => 1 - Math.pow(1 - x, 5),
    oB: (x, s = 1.9) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
    ioS: (x) => 0.5 - 0.5 * Math.cos(Math.PI * x),
  };
  // 阻尼弹簧：0→1，带一次过冲（AE 里 "Overshoot" 表达式的解析版）
  const spring = (x, freq = 2.2, decay = 6) => (x <= 0 ? 0 : x >= 1.6 ? 1 : 1 - Math.exp(-decay * x) * Math.cos(freq * Math.PI * x));
  // 包络：a0→a1 淡入，b0→b1 淡出
  const env = (x, a0, a1, b0, b1) => Math.min(seg(x, a0, a1), 1 - seg(x, b0, b1));
  const pulse = (x, at, decay) => (x < at ? 0 : Math.exp(-(x - at) / decay));
  const inR = (x, a, b) => x >= a && x < b;
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f3 = (v) => (Math.abs(v) < 1e-4 ? 0 : +v.toFixed(3));

  // ═══ §2 DOM ════════════════════════════════════════════════════════════════
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const memo = new WeakMap();
  function css(el, prop, val) {
    if (!el) return;
    let c = memo.get(el);
    if (!c) memo.set(el, (c = {}));
    if (c[prop] !== val) {
      c[prop] = val;
      if (prop.startsWith('--')) el.style.setProperty(prop, val);
      else el.style[prop] = val;
    }
  }
  const op = (el, v) => css(el, 'opacity', v <= 0.002 ? '0' : v >= 0.998 ? '1' : v.toFixed(3));
  const tf = (el, s) => css(el, 'transform', s);
  function txt(el, s) {
    if (!el) return;
    let c = memo.get(el);
    if (!c) memo.set(el, (c = {}));
    if (c.__t !== s) { c.__t = s; el.textContent = s; }
  }

  const byKey = Object.fromEntries(D.WORKS.map((w) => [w.key, w]));
  const SHOTS = D.SHOTS;
  const wins = SHOTS.filter((s) => s.type === 'win');
  const fulls = SHOTS.filter((s) => s.type === 'full');
  const pairShots = SHOTS.filter((s) => s.type === 'pair');
  const splits = SHOTS.filter((s) => s.type === 'split');
  const phones = SHOTS.filter((s) => s.type === 'phone');

  const el = {};
  function grab() {
    ['stage', 'cold', 'cold-term', 'cold-cmd', 'cold-cursor', 'cold-thesis', 'cold-formula', 'stack', 'stack-cam', 'grid', 'grid-label',
      'full', 'duo', 'duo-left', 'duo-phone', 'duo-label', 'drop-ov', 'split', 'phones', 'tunnel', 'tunnel-cam', 'tunnel-line',
      'wall', 'wall-cam', 'wall-title', 'wall-sub', 'breath', 'flyers', 'reveal', 'rv-row', 'rv-en', 'rv-sweep', 'pillars', 'card', 'share',
      'folder', 'sh-count', 'sh-link-t', 'sh-link-u', 'qrbox', 'qr-scan', 'card-cta', 'card-note', 'outro', 'out-term', 'out-cmd', 'out-cursor',
      'out-answer', 'out-self', 'mini', 'hud-tl', 'hud-rec', 'hud-time', 'hud-frame', 'hud-era', 'hud-era-k', 'hud-era-v', 'ruler', 'ruler-base', 'playhead',
      'autopsy', 'at-head', 'at-tail', 'marathon', 'mar-strip', 'mar-count', 'mar-n', 'mar-title',
      'hud-count', 'hud-count-n', 'lbx-top', 'lbx-bot', 'fxback', 'fxfront'].forEach((id) => (el[id] = $(id)));
    el.boot = TX.cold.boot.map((_, i) => $('bt' + i));
    el.nos = TX.cold.nos.map((_, i) => $('no' + i));
    el.strikes = el.nos.map((n) => n.querySelector('.strike'));
    el.formulaT = el['cold-formula'].querySelector('.t');
    el.eras = D.ERAS.map((_, i) => {
      const r = $('era' + (i + 1));
      return { root: r, num: r.querySelector('.era-num'), fill: r.querySelector('.fillnum'), chip: r.querySelector('.era-chip'),
        chars: $$('.ch', r), sub: r.querySelector('.era-sub'), cap: r.querySelector('.era-cap'), title: r.querySelector('.era-title') };
    });
    el.wins = wins.map((s) => { const r = $('win-' + s.id); return { r, shade: r.querySelector('.win-shade') }; });
    el.gtiles = D.GRID.shots.map((_, i) => $('gt' + i));
    el.shots = fulls.map((s) => { const r = $('shot-' + s.id); return { r, media: r.querySelector('.shot-media'), label: r.querySelector('.label') }; });
    el.panels = splits.map((s) => { const r = $('pn-' + s.id); return { r, media: r.querySelector('.panel-media'), label: r.querySelector('.label') }; });
    el.phones = phones.map((s) => { const r = $('ph-' + s.id); return { r, label: r.querySelector('.ph-label') }; });
    el.phonesLayer = $('phones'); // el.phones 是数组，层的 id 单独存
    el.tplanes = D.WORKS.map((w) => $('tp-' + w.key));
    el.wtiles = D.WORKS.map((w) => { const r = $('wt-' + w.key); return { r, flash: r.querySelector('.flash'), freeze: r.querySelector('img.freeze'), wl: r.querySelector('.wl') }; });
    el.pairs = D.PAIRS.map((pr, i) => {
      const r = $('pair-' + i);
      return { r, code: r.querySelector('.code-pane'), film: r.querySelector('.film-pane'), media: r.querySelector('.film-media'),
        beam: r.querySelector('.beam'), lock: r.querySelector('.lock'), label: r.querySelector('.film-label'),
        lines: pr.lines.map((_, j) => $('cl-' + i + '-' + j)) };
    });
    el.stats = TX.autopsy.stats.map((_, i) => ({ r: $('st' + i), n: $('sn' + i) }));
    el.mtiles = D.WORKS.map((w) => $('mt-' + w.key));
    el.rslices = TX.reveal.chars.map((_, i) => { const c = $('rc' + i); return { t: c.querySelector('.sl-t'), m: c.querySelector('.sl-m'), b: c.querySelector('.sl-b') }; });
    el.blines = TX.breath.map((_, i) => { const r = $('bl' + i); return { r, big: r.querySelector('.big'), small: r.querySelector('.small') }; });
    el.flyers = D.WORKS.map((w) => $('fl-' + w.key));
    el.flyersLayer = $('flyers'); // el.flyers 是数组，层的 id 单独存
    el.rchars = TX.reveal.chars.map((_, i) => $('rc' + i));
    el.pillars = TX.pillars.items.map((_, i) => { const r = $('pl' + i); return { r, num: r.querySelector('.pl-num'), list: r.querySelector('.pl-list'), rows: +r.querySelector('.pl-list').dataset.rows }; });
    el.pillarsLayer = $('pillars'); // el.pillars 是数组，层的 id 单独存
    el.credits = TX.outro.credits.map((_, i) => $('cr' + i));
    el.slots = D.WORKS.map((w) => { const r = $('sl-' + w.key); return { r, on: r.querySelector('.on') }; });
    el.cb = el.fxback.getContext('2d');
    el.cf = el.fxfront.getContext('2d');
  }

  // ═══ §3 事件表（单位：拍）═════════════════════════════════════════════════
  const FLASH = [], SHAKE = [], RING = [], GLITCH = [];
  function buildEvents() {
    const fl = (b, a, d = 0.3, c = '255,255,255') => FLASH.push({ b, a, d, c });
    const sh = (b, amp, d = 0.4) => SHAKE.push({ b, amp, d });
    const ring = (b, x, y, c, r = 900, d = 1.2, w = 10) => RING.push({ b, x, y, c, r, d, w });
    TX.cold.nos.forEach((n) => sh(n.b, 7, 0.25));
    D.ERAS.forEach((e, i) => { if (i < 3) { fl(e.b0, 0.55, 0.35); sh(e.b0, 12, 0.35); ring(e.b0, CX, CY, D.MODELS[e.model].color, 1100, 1.4, 14); } });
    fulls.forEach((s) => fl(s.b0, s.b0 === 88 ? 1 : 0.2, s.b0 === 88 ? 0.7 : 0.18));
    D.GRID.steps.forEach((st) => fl(st.b, 0.22, 0.2));
    fl(62, 0.4, 0.3, '169,139,255');
    sh(88, 30, 0.55); ring(88, CX, CY, '#FF7A3D', 1500, 1.6, 22); ring(88.25, CX, CY, '#FFFFFF', 1200, 1.2, 6);
    for (let b = 90; b < 112; b++) sh(b, 5, 0.18);
    [114, 116, 118, 120].forEach((b) => { fl(b, 0.3, 0.22); sh(b, 8, 0.25); });
    fl(124, 0.5, 0.35); // 隧道冲入
    fl(138, 0.65, 0.4); sh(138, 16, 0.4); ring(138, CX, CY, '#FFFFFF', 1400, 1.2, 8); // 巨墙砸定
    fl(148, 0.55, 0.3); sh(148, 8, 0.3); // 28 格定格卡·齐拍快门
    TX.reveal.b.forEach((b, i) => {
      const x = 160 + i * 400 + 200, y = 500;
      fl(b, 0.5 + i * 0.06, 0.25); sh(b, 18 + i * 5, 0.35);
      ring(b, x, y, '#FF7A3D', 900 + i * 150, 1.3, 16); ring(b + 0.12, x, y, '#FFFFFF', 600, 0.9, 5);
    });
    fl(210, 0.75, 0.45); sh(210, 24, 0.5); ring(210, CX, 500, '#FFD166', 1800, 1.8, 26); // OPEN SOURCE
    fl(222, 0.35, 0.3); fl(232, 0.35, 0.3); fl(235, 0.3, 0.3, '61,139,255'); // 三柱 / 闪传卡
    fl(263, 0.3, 0.5); // 「由你来写」
    [[15.55, 0.35], [55.7, 0.3], [87.1, 0.35], [120, 0.4], [149.55, 0.45], [205.5, 0.3], [216.6, 0.3]].forEach(([b, len]) => GLITCH.push({ b, len }));
  }
  const sumPulse = (list, b) => {
    let a = 0;
    for (const e of list) if (b >= e.b && b < e.b + e.d * 6) a = Math.max(a, e.a * pulse(b, e.b, e.d));
    return a;
  };

  // ═══ §4 冷开场 b0–20 ══════════════════════════════════════════════════════
  function sceneCold(b, t) {
    const C = TX.cold;
    const vis = b < 19.9;
    op(el.cold, vis ? seg(b, 0, 0.8) : 0);
    if (!vis) return;
    // boot 日志逐行点亮，打字开始后退场
    el.boot.forEach((node, i) => {
      op(node, seg(b, C.bootB0 + i * 0.75, C.bootB0 + i * 0.75 + 0.3) * (1 - seg(b, C.typeB0 - 0.2, C.typeB0 + 0.4)));
    });
    // 终端打字
    const n = Math.floor(seg(b, C.typeB0, C.typeB1) * C.command.length + 1e-6);
    txt(el['cold-cmd'], C.command.slice(0, n));
    const typing = b >= C.typeB0 && b < C.typeB1 + 0.3;
    op(el['cold-cursor'], typing ? 1 : Math.floor(t * 2.4) % 2 === 0 ? 1 : 0);
    // 回车后：命令飞向左上角，变成 HUD 里的 render(t)
    const fly = Ez.ioC(seg(b, 5, 5.9));
    tf(el['cold-term'], `translate(${f3(lerp(0, -736, fly))}px,${f3(lerp(0, -483, fly))}px) scale(${f3(lerp(1, 0.29, fly))})`);
    op(el['cold-term'], 1 - seg(b, 5.6, 5.95));
    // 没有 AE / 没有 PR / 没有剪辑软件
    el.nos.forEach((node, i) => {
      const bi = C.nos[i].b;
      const s = seg(b, bi, bi + 0.3);
      const out = Ez.iE(seg(b, C.nosOut + i * 0.06, C.nosOut + 0.4 + i * 0.06));
      const struck = seg(b, bi + 0.5, bi + 0.72);
      op(node, seg(b, bi, bi + 0.08) * (1 - out) * (1 - 0.42 * struck));
      tf(node, `translateX(${f3((i % 2 ? 1 : -1) * out * 1500)}px) scale(${f3(lerp(1.55, 1, Ez.oE(s)))})`);
      css(node, 'filter', s < 1 ? `blur(${f3((1 - Ez.oE(s)) * 14)}px)` : 'none');
      tf(el.strikes[i], `scaleX(${f3(Ez.oE(struck))})`);
    });
    // 论点：每一帧，都是时间的函数
    const th = Ez.oC(seg(b, C.thesisB0, C.thesisB0 + 0.7));
    const thOut = seg(b, C.thesisB1, C.thesisB1 + 0.35);
    op(el['cold-thesis'], th * (1 - thOut));
    css(el['cold-thesis'], 'clipPath', `inset(-20% ${f3((1 - th) * 100)}% -20% 0)`);
    css(el['cold-thesis'], 'letterSpacing', `${f3(lerp(0.3, 0.06, th))}em`);
    tf(el['cold-thesis'], `scale(${f3(1 + thOut * 0.12)})`);
    const fo = Ez.oC(seg(b, C.thesisB0 + 1, C.thesisB0 + 1.5));
    op(el['cold-formula'], fo * (1 - thOut));
    tf(el['cold-formula'], `translateY(${f3((1 - fo) * 30)}px)`);
    const beatFrac = b - Math.floor(b);
    const tp = b > C.thesisB0 + 1 ? Math.exp(-beatFrac * 5) : 0;
    tf(el.formulaT, `scale(${f3(1 + 0.45 * tp)})`);
    css(el.formulaT, 'textShadow', `0 0 ${f3(10 + 30 * tp)}px rgba(255,122,61,${f3(0.4 + 0.6 * tp)})`);
  }

  // ═══ §5 时代卡 + 能力曲线 ══════════════════════════════════════════════════
  const NODE_X = [0.14, 0.38, 0.62, 0.86].map((v) => v * W);
  const NODE_Y = [860, 776, 628, -520];
  const CURVE_P = [{ x: 96, y: 912 }].concat(NODE_X.map((x, i) => ({ x, y: NODE_Y[i] })));
  function bez(A, B, s, rocket) {
    const c1 = { x: A.x + (B.x - A.x) * (rocket ? 0.62 : 0.5), y: A.y };
    const c2 = rocket ? { x: B.x - 20, y: B.y + 640 } : { x: A.x + (B.x - A.x) * 0.5, y: B.y };
    const u = 1 - s;
    return { x: u * u * u * A.x + 3 * u * u * s * c1.x + 3 * u * s * s * c2.x + s * s * s * B.x, y: u * u * u * A.y + 3 * u * u * s * c1.y + 3 * u * s * s * c2.y + s * s * s * B.y };
  }
  function drawCurve(ctx, q, alpha, headGlow) {
    // q ∈ [0,4]：曲线从起点画到第 q 段
    ctx.save();
    ctx.globalAlpha = alpha;
    // 坐标轴
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(90, 930); ctx.lineTo(1830, 930); ctx.stroke();
    ctx.font = '700 20px NotoSansSC'; ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.save(); ctx.translate(66, 910); ctx.rotate(-Math.PI / 2); ctx.fillText('代码视频的上限 →', 0, 0); ctx.restore();
    D.ERAS.forEach((e, i) => {
      const c = D.MODELS[e.model].color;
      const reached = q >= i + 1 - 1e-6;
      ctx.fillStyle = reached ? c : 'rgba(255,255,255,0.3)';
      ctx.font = '800 24px Barlow';
      ctx.textAlign = 'center';
      ctx.fillText(D.MODELS[e.model].label, NODE_X[i], 972);
      ctx.fillRect(NODE_X[i] - 1, 922, 2, 16);
    });
    ctx.textAlign = 'left';
    // 曲线本体
    const pts = [];
    const segs = Math.min(4, Math.max(0, q));
    for (let i = 0; i < 4 && i < segs; i++) {
      const part = Math.min(1, segs - i);
      const N = 48;
      for (let k = 0; k <= N * part; k++) pts.push(bez(CURVE_P[i], CURVE_P[i + 1], k / N, i === 3));
    }
    if (pts.length > 1) {
      const g = ctx.createLinearGradient(90, 0, 1830, 0);
      g.addColorStop(0, D.MODELS.KIMI.color); g.addColorStop(0.35, D.MODELS.SWE.color); g.addColorStop(0.6, D.MODELS.GPT.color); g.addColorStop(0.85, D.MODELS.OPUS.color);
      // 面积
      ctx.beginPath(); ctx.moveTo(pts[0].x, 930);
      pts.forEach((p) => ctx.lineTo(p.x, p.y)); ctx.lineTo(pts[pts.length - 1].x, 930); ctx.closePath();
      const ga = ctx.createLinearGradient(0, 300, 0, 930); ga.addColorStop(0, 'rgba(255,122,61,0.22)'); ga.addColorStop(1, 'rgba(255,122,61,0)');
      ctx.fillStyle = ga; ctx.fill();
      // 线
      ctx.shadowColor = 'rgba(255,160,90,0.9)'; ctx.shadowBlur = 24;
      ctx.strokeStyle = g; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      ctx.shadowBlur = 0;
      // 已到达节点
      for (let i = 0; i < 4; i++) if (q >= i + 1 - 1e-6 && NODE_Y[i] > 0) {
        ctx.fillStyle = D.MODELS[D.ERAS[i].model].color;
        ctx.beginPath(); ctx.arc(NODE_X[i], NODE_Y[i], 11, 0, Math.PI * 2); ctx.fill();
      }
      // 光头
      const hd = pts[pts.length - 1];
      if (hd.y > -50) {
        const r = 18 + 26 * headGlow;
        const rg = ctx.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, r * 3);
        rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.25, 'rgba(255,170,100,0.8)'); rg.addColorStop(1, 'rgba(255,122,61,0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hd.x, hd.y, r * 3, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  function sceneEras(b, ctxB) {
    D.ERAS.forEach((e, i) => {
      const E4 = i === 3;
      const end = e.b1;
      const R = el.eras[i];
      const vis = inR(b, e.b0, end);
      op(R.root, vis ? 1 : 0);
      if (!vis) return;
      const u = b - e.b0;
      const k = Ez.iC(seg(b, end - 0.3, end));
      css(R.root, 'clipPath', k > 0 ? `inset(${f3(k * 50)}% 0 ${f3(k * 50)}% 0)` : 'none');
      const ni = Ez.oE(seg(u, 0, 0.5));
      tf(R.num, `translateX(${f3(lerp(-280, 0, ni))}px) scale(${f3(lerp(1.3, 1, ni))})`);
      op(R.num, seg(u, 0, 0.12));
      css(R.fill, 'clipPath', `inset(${f3((1 - Ez.oC(seg(u, 0.3, 1.3))) * 100)}% 0 0 0)`);
      op(R.chip, seg(u, 0.15, 0.35));
      tf(R.chip, `translateY(${f3((1 - Ez.oC(seg(u, 0.15, 0.45))) * 24)}px)`);
      R.chars.forEach((c, j) => {
        const d = 0.18 + j * 0.13;
        const s = seg(u, d, d + 0.4);
        op(c, E4 ? 0 : seg(u, d, d + 0.1));
        tf(c, `translateY(${f3(lerp(-190, 0, Ez.oB(s)))}px) rotate(${f3(lerp(-8, 0, Ez.oC(s)))}deg)`);
      });
      op(R.sub, seg(u, 0.6, 1.0));
      tf(R.sub, `translateY(${f3((1 - Ez.oC(seg(u, 0.6, 1.0))) * 22)}px)`);
      op(R.cap, seg(u, 0.3, 0.6));
      // 能力曲线
      const q = i + Ez.oC(seg(u, 0.1, E4 ? 1.35 : 1.1));
      drawCurve(ctxB, q, 1 - k, pulse(b, e.b0 + 1.1, 0.4));
      if (E4 && q > 3.5) {
        // 冲破天花板：一束竖直光柱
        const a = seg(q, 3.5, 4) * (1 - k);
        const g = ctxB.createLinearGradient(NODE_X[3] - 80, 0, NODE_X[3] + 80, 0);
        g.addColorStop(0, 'rgba(255,122,61,0)'); g.addColorStop(0.5, `rgba(255,220,180,${f3(0.9 * a)})`); g.addColorStop(1, 'rgba(255,122,61,0)');
        ctxB.fillStyle = g; ctxB.fillRect(NODE_X[3] - 80, 0, 160, 930);
      }
    });
  }

  // ─── 窗口堆叠 b23–58（ERA02 的窗口入场做 4 步/拍的像素量化停顿）───────────
  function sceneStack(b) {
    const vis = (inR(b, 23, 34) || inR(b, 37, D.STACK_END));
    op(el.stack, vis ? 1 : 0);
    if (!vis) return;
    const drift = Math.sin(b * 0.35) * 3;
    tf(el['stack-cam'], `translateZ(${f3(lerp(0, -260, seg(b, 23, 58)))}px) rotateY(${f3(drift)}deg) rotateX(${f3(Math.cos(b * 0.27) * 1.5)}deg)`);
    wins.forEach((s, i) => {
      const W_ = el.wins[i];
      if (b < s.b0) { op(W_.r, 0); return; }
      let d = 0;
      for (let j = i + 1; j < wins.length; j++) d += Ez.oE(seg(b, wins[j].b0, wins[j].b0 + 0.4));
      // ERA02「像素」时代的窗口：入场运动量化成一拍 4 步 —— 抽帧顿挫感
      const bt = s.b0 >= 37 ? Math.floor(b * 4) / 4 : b;
      const e = spring(seg(bt, s.b0, s.b0 + 0.9) * 1.6, 1.6, 5.2);
      const pose = { x: -150 * d, y: -64 * d, z: -300 * d, ry: -12 - 3 * d, rx: 4 };
      const from = { x: 950, y: 140, z: 520, ry: -42, rx: 8 };
      const p = (a, bb) => lerp(from[a], pose[a], clamp(e, 0, 1.2)) + (bb || 0);
      tf(W_.r, `translate3d(${f3(p('x'))}px,${f3(p('y'))}px,${f3(p('z'))}px) rotateY(${f3(p('ry'))}deg) rotateX(${f3(p('rx'))}deg)`);
      op(W_.r, seg(b, s.b0, s.b0 + 0.12) * clamp(1 - 0.12 * d) * (d > 6.5 ? 1 - seg(d, 6.5, 7.5) : 1));
      op(W_.shade, clamp(0.14 * d, 0, 0.7));
    });
  }

  // ═══ §6 GPT ═══════════════════════════════════════════════════════════════
  const GA = { x: 120, y: 68, w: 1680, h: 945, gap: 10 };
  function gridPos(i, n) {
    const k = Math.round(Math.sqrt(n));
    const tw = (GA.w - (k - 1) * GA.gap) / k, th = (GA.h - (k - 1) * GA.gap) / k;
    return { x: GA.x + (i % k) * (tw + GA.gap), y: GA.y + Math.floor(i / k) * (th + GA.gap), s: tw / 640, tw, th };
  }
  function sceneGrid(b) {
    const G = D.GRID;
    const vis = inR(b, G.b0, G.b1);
    op(el.grid, vis ? 1 : 0);
    if (!vis) return;
    let si = 0;
    G.steps.forEach((st, k) => { if (b >= st.b) si = k; });
    const cur = G.steps[si], prev = G.steps[Math.max(0, si - 1)];
    const p = si === 0 ? 1 : Ez.oE(seg(b, cur.b, cur.b + 0.32));
    el.gtiles.forEach((tile, i) => {
      if (i >= cur.n) { op(tile, 0); return; }
      const B_ = gridPos(i, cur.n);
      let x, y, s, a = 1;
      if (i < prev.n && si > 0) {
        const A = gridPos(i, prev.n);
        x = lerp(A.x, B_.x, p); y = lerp(A.y, B_.y, p); s = lerp(A.s, B_.s, p);
      } else {
        a = Ez.oB(seg(b, cur.b + i * 0.015, cur.b + 0.35 + i * 0.015), 1.4);
        s = B_.s * a; x = B_.x + (B_.tw * (1 - a)) / 2; y = B_.y + (B_.th * (1 - a)) / 2;
      }
      op(tile, clamp(a * 3));
      tf(tile, `translate(${f3(x)}px,${f3(y)}px) scale(${f3(Math.max(0.001, s))})`);
    });
    const L = TX.grid;
    const lp = seg(b, L.b0, L.b0 + 0.35);
    op(el['grid-label'], Ez.oC(lp));
    tf(el['grid-label'], `scale(${f3(lerp(1.7, 1, Ez.oE(lp)))})`);
  }

  function sceneFull(b) {
    fulls.forEach((s, i) => {
      const S = el.shots[i];
      const vis = inR(b, s.b0, s.b1);
      op(S.r, vis ? 1 : 0);
      if (!vis) return;
      const u = b - s.b0;
      const pin = Ez.oE(seg(u, 0, 0.6));
      const dir = i % 2 ? 1 : -1;
      tf(S.media, `scale(${f3(lerp(1.16, 1.0, pin) + 0.018 * u)}) rotate(${f3(dir * lerp(0.9, 0, pin))}deg) translateX(${f3(dir * lerp(30, 0, pin))}px)`);
      const lp = Ez.oE(seg(u, 0, 0.32));
      op(S.label, seg(u, 0, 0.14));
      tf(S.label, `translateX(${f3(lerp(-50, 0, lp))}px)`);
    });
    // DROP 大字：04 电影
    const Dr = TX.drop;
    const dv = inR(b, Dr.b0, Dr.b1);
    op(el['drop-ov'], dv ? env(b, Dr.b0, Dr.b0 + 0.06, Dr.b1 - 0.45, Dr.b1 - 0.05) : 0);
    if (dv) {
      const s = Ez.oE(seg(b, Dr.b0, Dr.b0 + 0.3));
      const out = Ez.iC(seg(b, Dr.b1 - 0.45, Dr.b1));
      tf(el['drop-ov'], `scale(${f3(lerp(2.2, 1, s) + out * 0.9)})`);
      css(el['drop-ov'], 'filter', `blur(${f3((1 - s) * 10 + out * 16)}px)`);
    }
  }

  const DUO0 = SHOTS.find((s) => s.type === 'duoL').b0;
  const DUO1 = SHOTS.find((s) => s.type === 'duoL').b1;
  function sceneDuo(b) {
    const vis = inR(b, DUO0, DUO1);
    op(el.duo, vis ? 1 : 0);
    if (!vis) return;
    const l = Ez.oE(seg(b, DUO0, DUO0 + 0.5));
    tf(el['duo-left'], `translateX(${f3(lerp(-420, 0, l))}px) scale(${f3(1 + 0.025 * (b - DUO0))})`);
    const p = seg(b, DUO0 + 0.25, DUO0 + 1.05);
    tf(el['duo-phone'], `translateY(${f3(lerp(900, 0, Ez.oB(p, 1.3)))}px) rotate(${f3(lerp(14, -3, Ez.oC(p)))}deg)`);
    op(el['duo-label'], seg(b, DUO0 + 0.7, DUO0 + 1.1));
  }

  // ═══ §7 OPUS ══════════════════════════════════════════════════════════════
  const SK = 70;
  function panelGeom(s) {
    const n = s.n, i = s.panel;
    const x0 = (i * W) / n, x1 = ((i + 1) * W) / n;
    return { x0, x1, cx: (x0 + x1) / 2, L: i === 0 ? -300 : x0, R: i === n - 1 ? W + 300 : x1 };
  }
  const SP0 = splits[0].b0, SP1 = splits[splits.length - 1].b1;
  function sceneSplit(b, ctxF) {
    const vis = inR(b, SP0, SP1);
    op(el.split, vis ? 1 : 0);
    if (!vis) return;
    splits.forEach((s, k) => {
      const P_ = el.panels[k];
      const on = inR(b, s.b0, s.b1);
      op(P_.r, on ? 1 : 0);
      if (!on) return;
      const g = panelGeom(s);
      const d = s.panel * 0.14;
      const e = Ez.oE(seg(b, s.b0 + d, s.b0 + d + 0.42));
      const dirY = s.panel % 2 ? 1 : -1;
      tf(P_.r, `translateY(${f3(dirY * (1 - e) * 1100)}px)`);
      css(P_.r, 'clipPath', `polygon(${f3(g.L + SK)}px 0px, ${f3(g.R + SK)}px 0px, ${f3(g.R - SK)}px 1080px, ${f3(g.L - SK)}px 1080px)`);
      const u = b - s.b0;
      tf(P_.media, `translateX(${f3(g.cx - 960 + u * 10 * dirY)}px) scale(${f3(1.06 - 0.02 * u)})`);
      css(P_.label, 'left', `${f3(g.x0 + 48 + (s.panel === 0 ? 20 : SK))}px`);
      op(P_.label, seg(b, s.b0 + d + 0.25, s.b0 + d + 0.45));
    });
    // 斜切分割线（橙色辉光）
    const grp = splits.filter((s) => inR(b, s.b0, s.b1));
    if (grp.length > 1) {
      ctxF.save();
      ctxF.strokeStyle = 'rgba(255,122,61,0.95)'; ctxF.lineWidth = 4; ctxF.shadowColor = '#FF7A3D'; ctxF.shadowBlur = 18;
      for (let i = 1; i < grp[0].n; i++) {
        const x = (i * W) / grp[0].n;
        const a = Ez.oE(seg(b, grp[0].b0 + 0.2, grp[0].b0 + 0.6));
        ctxF.globalAlpha = a;
        ctxF.beginPath(); ctxF.moveTo(x + SK, 0); ctxF.lineTo(x + SK - 2 * SK * a, 1080 * a); ctxF.stroke();
      }
      ctxF.restore();
    }
  }

  const PH0 = phones[0].b0, PH1 = phones[0].b1;
  function scenePhones(b) {
    const vis = inR(b, PH0, PH1);
    op(el.phonesLayer, vis ? 1 : 0);
    if (!vis) return;
    el.phones.forEach((P_, i) => {
      const d = i * 0.16;
      const p = seg(b, PH0 + d, PH0 + 0.62 + d);
      const rest = [-6, 0, 6][i];
      tf(P_.r, `translateY(${f3(lerp(1000, i === 1 ? -18 : 0, Ez.oB(p, 1.25)))}px) rotate(${f3(lerp(rest * 3, rest, Ez.oC(p)))}deg)`);
      op(P_.label, seg(b, PH0 + 0.5 + d, PH0 + 0.8 + d));
    });
  }

  function sceneTunnel(b, ctxF, ctxB) {
    const T_ = D.TUNNEL;
    const vis = inR(b, T_.b0, T_.b1);
    op(el.tunnel, vis ? 1 : 0);
    if (!vis) return;
    const p = seg(b, T_.b0, T_.b1);
    const zc = lerp(0, 6200, Math.pow(p, 1.7));
    const roll = Math.sin(b * 0.55) * 5 + p * 24;
    tf(el['tunnel-cam'], `translateZ(${f3(zc)}px) rotateZ(${f3(roll)}deg)`);
    D.WORKS.forEach((w, i) => {
      const wall = i % 4, d = Math.floor(i / 4);
      const zr = -(300 + d * 760 + wall * 190) + zc;
      const a = zr > 560 ? 0 : clamp((zr + 5600) / 1600);
      op(el.tplanes[i], a);
    });
    const L = TX.tunnel;
    op(el['tunnel-line'], env(b, L.b0, L.b0 + 0.6, L.b1 - 0.5, L.b1));
    tf(el['tunnel-line'], `scale(${f3(lerp(0.5, 1.28, seg(b, L.b0, L.b1)))})`);
    // 中心辉光
    const rg = ctxB.createRadialGradient(CX, CY, 0, CX, CY, 700);
    rg.addColorStop(0, `rgba(255,150,90,${f3(0.28 + 0.4 * p)})`); rg.addColorStop(1, 'rgba(255,122,61,0)');
    ctxB.fillStyle = rg; ctxB.fillRect(0, 0, W, H);
    // 速度线
    const speed = 0.25 + p * p * 2.2;
    ctxF.save();
    ctxF.lineCap = 'round';
    for (let k = 0; k < 110; k++) {
      const ang = hash(k * 3.1) * Math.PI * 2;
      const ph = (hash(k * 7.7) + (b - T_.b0) * speed * (0.4 + hash(k) * 0.8)) % 1;
      const r0 = 120 + ph * ph * 1300;
      const len = 30 + speed * 140 * ph;
      const a = 0.15 + 0.6 * ph;
      ctxF.strokeStyle = k % 5 === 0 ? `rgba(255,150,90,${f3(a)})` : `rgba(255,255,255,${f3(a * 0.8)})`;
      ctxF.lineWidth = 1 + 2.5 * ph;
      ctxF.beginPath();
      ctxF.moveTo(CX + Math.cos(ang) * r0, CY + Math.sin(ang) * r0);
      ctxF.lineTo(CX + Math.cos(ang) * (r0 + len), CY + Math.sin(ang) * (r0 + len));
      ctxF.stroke();
    }
    ctxF.restore();
  }

  const WALL_FOCUS = D.WORKS.findIndex((w) => w.key === 'oneink');
  function wallCenter(i) {
    const { TW, TH, GAP, x0, y0 } = D.wall;
    const c = i % D.WALL.cols, r = Math.floor(i / D.WALL.cols);
    return { x: x0 + c * (TW + GAP) + TW / 2, y: y0 + r * (TH + GAP) + TH / 2, c, r };
  }
  function sceneWall(b) {
    const Wl = D.WALL;
    const FRZ = Wl.freezeAt; // 148：28 格齐拍定格成照片卡
    const vis = inR(b, Wl.b0, 165.6);
    op(el.wall, vis ? 1 - seg(b, 150, 151.4) * 0.55 - seg(b, 160, 165.6) * 0.45 : 0);
    if (!vis) return;
    const fc = wallCenter(WALL_FOCUS);
    const p = Ez.ioC(seg(b, Wl.b0, Wl.b0 + 3.6));
    let s = lerp(3.3, 0.94, p) + 0.06 * seg(b, Wl.b0 + 3.6, FRZ);
    let tx = -(fc.x - CX) * s * (1 - p), ty = -(fc.y - CY) * s * (1 - p);
    const rx = lerp(20, 0, p), rz = lerp(-7, 0, p);
    // 骤停后：缓慢后退、去色
    const br = seg(b, 150, 160);
    s *= lerp(1, 0.84, Ez.oC(br));
    const stop = pulse(b, 150, 0.35);
    ty += stop * 26;
    tf(el['wall-cam'], `perspective(1500px) translate(${f3(tx)}px,${f3(ty)}px) scale(${f3(s)}) rotateX(${f3(rx)}deg) rotateZ(${f3(rz)}deg)`);
    const gray = seg(b, 150, 151.2);
    css(el['wall-cam'], 'filter', gray > 0 ? `grayscale(${f3(gray)}) brightness(${f3(1 - 0.45 * gray - 0.5 * stop)})` : 'none');
    const frz = seg(b, FRZ, FRZ + 0.15);
    const fzPulse = pulse(b, FRZ, 0.28);
    el.wtiles.forEach((T_, i) => {
      const c = wallCenter(i);
      const dist = Math.hypot(c.c - fc.c, c.r - fc.r);
      const a = Ez.oB(seg(b, Wl.b0 + dist * 0.07, Wl.b0 + 0.45 + dist * 0.07), 1.5);
      // 定格瞬间：整体轻轻一压 + 白边照片卡
      tf(T_.r, `scale(${f3(lerp(0.5, 1, a) * (1 - 0.035 * fzPulse))})`);
      op(T_.r, clamp(a * 2));
      op(T_.flash, 0.85 * pulse(b, 144 + (c.c + c.r) * 0.13, 0.22));
      op(T_.freeze, frz);
      op(T_.wl, 1 - seg(b, 150, 150.8)); // 骤停后格内标签整体退场（巨墙变成纯照片墙）
      css(T_.r, 'outline', frz > 0.02 ? `3px solid rgba(255,255,255,${f3(0.9 * frz)})` : '');
    });
    op(el['wall-title'], env(b, 140.4, 141, 148, 148.4));
    css(el['wall-title'], 'letterSpacing', `${f3(lerp(0.7, 0.32, Ez.oC(seg(b, 140.4, 141.6))))}em`);
    op(el['wall-sub'], env(b, 141.6, 142.2, 148, 148.4));
  }

  // ═══ §7b 解剖：左真实源码 / 右成片输出 b166–196 ═══════════════════════════
  function sceneAutopsy(b) {
    const A = TX.autopsy;
    // A.b0/b1 是标题窗口；段落本体 = A.b0 → A.statsB1
    const secEnd = A.statsB1;
    const vis = inR(b, A.b0, secEnd + 0.6);
    op(el.autopsy, vis ? env(b, A.b0, A.b0 + 0.4, secEnd, secEnd + 0.5) : 0);
    if (!vis) return;
    const hp = Ez.oC(seg(b, A.b0, A.b0 + 0.7)) * (1 - seg(b, secEnd - 0.6, secEnd - 0.1));
    op(el['at-head'], hp);
    tf(el['at-head'], `translateY(${f3((1 - hp) * 26)}px)`);
    el.pairs.forEach((P_, i) => {
      const sh = pairShots[i];
      if (!inR(b, sh.b0, sh.b1 + 0.4)) { op(P_.r, 0); return; }
      const ein = Ez.oE(seg(b, sh.b0, sh.b0 + 0.6));
      const fadeOut = 1 - seg(b, sh.b1, sh.b1 + 0.35);
      op(P_.r, clamp(ein * 1.5) * fadeOut);
      tf(P_.code, `translateX(${f3(lerp(-140, 0, ein))}px)`);
      tf(P_.film, `translateX(${f3(lerp(140, 0, ein))}px)`);
      // 真实代码行逐行点亮（≈1.05 拍一行），beam 同步脉冲
      const lit = Math.floor((b - sh.b0 - 0.7) / 1.05);
      P_.lines.forEach((ln, j) => ln.classList.toggle('hot', j === lit && lit >= 0 && b < sh.b1));
      const bp = lit >= 0 ? pulse(b, sh.b0 + 0.7 + lit * 1.05, 0.22) : 0;
      op(P_.beam, clamp(bp * 1.4));
      // 追踪括号线收紧
      const lp = Ez.oE(seg(b, sh.b0 + 0.3, sh.b0 + 1.1));
      op(P_.lock, seg(b, sh.b0 + 0.3, sh.b0 + 0.5));
      tf(P_.lock, `scale(${f3(lerp(1.12, 1, lp))})`);
      css(P_.media, 'transform', `scale(${f3(1 + 0.02 * (b - sh.b0))})`);
      const lbp = Ez.oC(seg(b, sh.b0 + 0.8, sh.b0 + 1.3));
      op(P_.label, lbp);
      tf(P_.label, `translateY(${f3((1 - lbp) * 14)}px)`);
    });
    // 统计数字滚动
    el.stats.forEach((S, i) => {
      const d = A.statsB0 + i * 1.15;
      const e2 = Ez.oE(seg(b, d, d + 0.5));
      op(S.r, e2);
      tf(S.r, `translateY(${f3((1 - e2) * 40)}px)`);
      const to = +S.n.dataset.to;
      txt(S.n, Math.round(to * Ez.oC(seg(b, d + 0.2, d + 2.8))).toLocaleString('en-US'));
    });
    op(el['at-tail'], seg(b, A.statsB0 + 3.6, A.statsB0 + 4.4));
  }

  // ═══ §7c 马拉松：28 部 × 半拍海报带 b196–206 ══════════════════════════════
  const TILE_W = 660;
  function sceneMarathon(b) {
    const M = D.MARATHON;
    const vis = inR(b, M.b0, M.b1 + 0.5);
    op(el.marathon, vis ? env(b, M.b0, M.b0 + 0.3, M.b1 - 0.1, M.b1 + 0.4) : 0);
    if (!vis) return;
    const cont = clamp((b - M.b0) / M.per, 0, 27.999);
    const i0 = Math.floor(cont);
    const fr = cont - i0;
    const sm = Math.min(27, i0 + Ez.oC(Math.min(1, fr * 1.7)));
    tf(el['mar-strip'], `translateX(${f3(CX - 320 - sm * TILE_W)}px)`);
    el.mtiles.forEach((m, i) => {
      const d = Math.abs(i - sm);
      op(m, i > cont + 4 ? 0 : clamp(1.7 - d * 0.5));
      const s = lerp(0.8, 1, clamp(1.6 - d));
      const brt = lerp(0.3, 1, clamp(1.5 - d));
      css(m, 'filter', `brightness(${f3(brt)}) saturate(${f3(lerp(0.4, 1.15, clamp(1.5 - d)))})`);
      tf(m, `translateX(${f3(i * TILE_W)}px) scale(${f3(s)})`);
    });
    const pk = Math.pow(1 - fr, 2);
    txt(el['mar-n'], String(Math.min(28, i0 + 1)).padStart(2, '0'));
    tf(el['mar-count'], `scale(${f3(1 + 0.15 * pk)})`);
    op(el['mar-count'], env(b, M.b0, M.b0 + 0.3, M.b1 - 0.4, M.b1));
    op(el['mar-title'], env(b, M.b0 + 0.5, M.b0 + 1, M.b1 - 0.4, M.b1));
  }

  // ═══ §8 凝视 / 通通开源 / 卡片 / 尾声 ═════════════════════════════════════
  function sceneBreath(b) {
    TX.breath.forEach((l, i) => {
      const L = el.blines[i];
      const a = env(b, l.b0, l.b0 + 0.7, l.b1 - 0.5, l.b1);
      op(L.r, a);
      if (a <= 0) return;
      const p = Ez.oC(seg(b, l.b0, l.b0 + 1.2));
      css(L.big, 'letterSpacing', `${f3(lerp(0.22, 0.06, p))}em`);
      tf(L.big, `translateY(${f3((1 - p) * 22)}px)`);
      if (L.small) op(L.small, seg(b, l.b0 + 0.8, l.b0 + 1.3));
    });
  }

  const FOLDER = { x: 150 + 56 + 105, y: 236 + 150 + 88 };
  const flyRnd = D.WORKS.map((_, i) => {
    const r = mulberry32(9001 + i * 17);
    return { ang: r() * Math.PI * 2, spin: (r() - 0.5) * 540, tilt: (r() - 0.5) * 120, R: 900 + r() * 700, delay: r() * 0.35,
      sx: r() < 0.5 ? -200 - r() * 300 : W + 200 + r() * 300, sy: r() * H, cx: CX + (r() - 0.5) * 900, cy: -200 + r() * 400 };
  });
  const FLY_B0 = TX.card.b0; // 232：飞进闪传文件夹的起点
  const arrivals = D.WORKS.map((_, i) => FLY_B0 + 0.25 + i * 0.085 + 0.95);
  function sceneFlyers(b) {
    // 爆散阶段在「通通开源」大字之后（下层）；吸入阶段必须压在分享卡片之上
    css(el.flyersLayer, 'zIndex', b >= FLY_B0 ? '5' : '0');
    el.flyers.forEach((f, i) => {
      const R = flyRnd[i];
      // A · 爆散：跟着「通通开源」四拍，从纵深中心冲向镜头
      const bg = TX.reveal.b[i % 4] + R.delay;
      if (inR(b, bg, bg + 2.4)) {
        const q = seg(b, bg, bg + 2.4);
        const rad = R.R * Ez.oC(q);
        const z = lerp(-2600, 700, Ez.iC(q));
        const x = Math.cos(R.ang) * rad, y = Math.sin(R.ang) * rad * 0.62;
        tf(f, `translate3d(${f3(x)}px,${f3(y)}px,${f3(z)}px) rotateZ(${f3(R.spin * q)}deg) rotateY(${f3(R.tilt * q)}deg) scale(0.9)`);
        op(f, env(q, 0, 0.08, 0.82, 0.98));
        return;
      }
      // B · 吸入：28 部片子飞进 QQ 闪传文件夹
      const s0 = FLY_B0 + 0.25 + i * 0.085;
      if (inR(b, s0, s0 + 0.95)) {
        const q = Ez.iC(seg(b, s0, s0 + 0.95));
        const u = 1 - q;
        const x = u * u * R.sx + 2 * u * q * R.cx + q * q * FOLDER.x;
        const y = u * u * R.sy + 2 * u * q * R.cy + q * q * FOLDER.y;
        tf(f, `translate3d(${f3(x - 960)}px,${f3(y - 540)}px,0px) rotateZ(${f3(R.spin * 0.3 * u)}deg) scale(${f3(lerp(0.75, 0.04, q))})`);
        op(f, seg(b, s0, s0 + 0.1));
        return;
      }
      op(f, 0);
    });
  }

  function sceneReveal(b) {
    const Rv = TX.reveal;
    const vis = inR(b, Rv.b[0], 222.4);
    op(el.reveal, vis ? 1 - seg(b, 221.8, 222.4) : 0);
    if (!vis) return;
    el.rchars.forEach((c, i) => {
      const bi = Rv.b[i];
      const s = seg(b, bi, bi + 0.2);
      const k = pulse(b, bi, 0.32);
      op(c, seg(b, bi, bi + 0.04));
      tf(c, `scale(${f3(lerp(2.8, 1, Ez.oE(s)) + 0.05 * Math.sin(clamp((b - bi) / 0.5) * Math.PI) * (1 - clamp(b - bi - 0.5)))})`);
      css(c, 'textShadow', `${f3(-16 * k)}px 0 rgba(255,40,60,${f3(0.85 * k)}), ${f3(16 * k)}px 0 rgba(40,220,255,${f3(0.85 * k)}), 0 0 ${f3(40 + 80 * k + 40 * pulse(b, Rv.enB, 0.6))}px rgba(255,122,61,${f3(0.35 + 0.45 * k + 0.3 * pulse(b, Rv.enB, 0.6))})`);
      css(c, 'filter', s < 1 ? `blur(${f3((1 - Ez.oE(s)) * 18)}px)` : 'none');
      // 切片爆发式排版：上/下两片横向错位撕开再合拢
      const sl = el.rslices[i];
      const k2 = pulse(b, bi, 0.22);
      tf(sl.t, `translateX(${f3(-30 * k2)}px)`);
      tf(sl.m, `translateX(${f3(12 * k2)}px)`);
      tf(sl.b, `translateX(${f3(30 * k2)}px)`);
    });
    const up = Ez.ioC(seg(b, Rv.out, Rv.out + 0.7));
    tf(el['rv-row'], `translateY(${f3(lerp(0, -232, up))}px) scale(${f3((1 + 0.09 * pulse(b, Rv.enB, 0.35)) * lerp(1, 0.42, up))})`);
    const en = seg(b, Rv.enB + 0.2, Rv.enB + 0.8);
    op(el['rv-en'], Ez.oC(en) * (1 - seg(b, Rv.out, Rv.out + 0.3)));
    css(el['rv-en'], 'letterSpacing', `${f3(lerp(1.1, 0.5, Ez.oE(en)))}em`);
    const sw = seg(b, 211, 213);
    op(el['rv-sweep'], env(b, 211, 211.2, 212.8, 213));
    css(el['rv-sweep'], 'backgroundPosition', `${f3(lerp(100, 0, Ez.ioS(sw)))}% 0`);
  }

  function scenePillars(b) {
    const Pl = TX.pillars;
    const vis = inR(b, Pl.b0, Pl.b1);
    op(el.pillarsLayer, vis ? 1 : 0);
    if (!vis) return;
    const out = Ez.iC(seg(b, Pl.b1 - 0.5, Pl.b1));
    el.pillars.forEach((P_, i) => {
      const d = Pl.b0 + 0.3 + i * 0.25;
      const e = Ez.oE(seg(b, d, d + 0.5));
      op(P_.r, e * (1 - out));
      tf(P_.r, `translateY(${f3((1 - e) * 70)}px) scale(${f3(1 - out * 0.25)})`);
      const n = Math.round(Pl.items[i].num * Ez.oC(seg(b, d + 0.2, d + 1.5)));
      txt(P_.num, String(n));
      const rowH = 30, total = P_.rows * rowH;
      tf(P_.list, `translateY(${f3(-(((b - Pl.b0) * 95) % total))}px)`);
    });
  }

  function sceneCard(b) {
    const C = TX.card;
    const vis = inR(b, C.b0, 257.2);
    op(el.card, vis ? 1 - seg(b, 255.2, 256.4) : 0);
    if (!vis) return;
    const e = Ez.oE(seg(b, C.b0, C.b0 + 0.75));
    const push = seg(b, 244, 255);
    const toMini = Ez.ioC(seg(b, 255, 256.4));
    tf(el.card, `translate(${f3(toMini * 520)}px,${f3(toMini * 300)}px) scale(${f3((1 + 0.03 * push) * lerp(1, 0.35, toMini))})`);
    let bounce = 0;
    let arrived = 0;
    arrivals.forEach((a) => { if (b >= a) { arrived++; bounce += pulse(b, a, 0.12) * 0.1; } });
    tf(el.share, `perspective(1600px) translateX(${f3(lerp(-240, 0, e))}px) rotateY(${f3(lerp(-68, 0, e))}deg)`);
    op(el.share, seg(b, C.b0, C.b0 + 0.2));
    tf(el.folder, `scale(${f3(1 + Math.min(0.35, bounce))})`);
    txt(el['sh-count'], `${arrived} / 28`);
    const url = D.SHARE.url;
    const n = Math.floor(seg(b, 239, 240.4) * url.length + 1e-6);
    txt(el['sh-link-t'], url.slice(0, n));
    tf(el['sh-link-u'], `scaleX(${f3(Ez.oC(seg(b, 240.4, 241)))})`);
    const q = seg(b, 236, 236.7);
    tf(el.qrbox, `scale(${f3(lerp(0.6, 1, Ez.oB(q, 1.5)))})`);
    op(el.qrbox, seg(b, 236, 236.2));
    const sc = ((b - 236.5) % 2.5) / 2.5;
    tf(el['qr-scan'], `translateY(${f3(lerp(-90, 520, sc))}px)`);
    op(el['qr-scan'], b > 236.5 ? 1 : 0);
    const bar = pulse(b % 4, 0, 0.5);
    css(el.qrbox, 'boxShadow', `0 40px 120px rgba(0,0,0,.6), 0 0 ${f3(20 + 50 * bar)}px rgba(61,139,255,${f3(0.3 + 0.4 * bar)})`);
    op(el['card-cta'], seg(b, 239.5, 240));
    tf(el['card-cta'], `translateY(${f3((1 - Ez.oC(seg(b, 239.5, 240.1))) * 30)}px)`);
    op(el['card-note'], seg(b, 240.2, 240.8));
  }

  function sceneOutro(b, t) {
    const O = TX.outro;
    const vis = inR(b, O.b0, 301);
    const fade = 1 - seg(b, O.fadeB0, 295.2);
    op(el.outro, vis ? seg(b, O.b0 + 0.3, O.b0 + 0.9) * fade : 0);
    op(el.mini, vis ? seg(b, 255.6, 256.4) * (1 - seg(b, 293, 294.5)) : 0);
    if (!vis) return;
    const cmd = TX.cold.command;
    const n = Math.floor(seg(b, O.typeB0, O.typeB1) * cmd.length + 1e-6);
    txt(el['out-cmd'], cmd.slice(0, n));
    op(el['out-cursor'], b < O.typeB1 + 0.3 ? 1 : Math.floor(t * 2.4) % 2 === 0 ? 1 : 0);
    // 自指：本片也是 render(t) 的输出
    op(el['out-self'], env(b, O.selfB, O.selfB + 0.4, O.selfB + 2.2, O.selfB + 2.8));
    const a = Ez.oC(seg(b, O.answerB, O.answerB + 1.1));
    op(el['out-answer'], a);
    css(el['out-answer'], 'clipPath', `inset(-30% ${f3((1 - a) * 100)}% -30% 0)`);
    css(el['out-answer'], 'textShadow', `0 0 ${f3(30 + 60 * pulse(b, O.answerB, 0.8))}px rgba(255,122,61,${f3(0.25 + 0.5 * pulse(b, O.answerB, 0.8))})`);
    el.credits.forEach((c, i) => {
      const d = O.creditsB + i * 0.6;
      op(c, Ez.oC(seg(b, d, d + 0.6)));
      tf(c, `translateY(${f3((1 - Ez.oC(seg(b, d, d + 0.6))) * 18)}px)`);
    });
  }

  // ═══ §9 HUD ═══════════════════════════════════════════════════════════════
  function hud(b, t, f) {
    const breathDim = 1 - 0.8 * env(b, 150, 150.6, 165.6, 166);
    const endFade = 1 - seg(b, 293, 295.4);
    const base = seg(b, 5.2, 6) * breathDim * endFade;
    op(el['hud-tl'], base);
    txt(el['hud-time'], `t = ${t.toFixed(3).padStart(6, '0')}s`);
    txt(el['hud-frame'], `f ${String(f).padStart(4, '0')}`);
    op(el['hud-rec'], Math.floor(t * 2) % 2 === 0 ? 1 : 0.35);
    let era = null;
    D.ERAS.forEach((e) => { if (b >= e.b0) era = e; });
    const allMode = b >= 150;
    op(el['hud-era'], (b >= 20 ? 1 : 0) * breathDim * endFade);
    if (era) {
      txt(el['hud-era-k'], allMode ? 'ALL ERAS' : `ERA ${era.n}`);
      txt(el['hud-era-v'], allMode ? '28 部 · 通通开源' : D.MODELS[era.model].label);
      css(el['hud-era'], '--c', allMode ? '#FFD166' : D.MODELS[era.model].color);
    }
    op(el.ruler, seg(b, 5, 6) * (0.35 + 0.65 * breathDim) * endFade);
    tf(el['ruler-base'], `scaleX(${f3(Ez.oC(seg(b, 5, 6.3)))})`);
    css(el.playhead, 'left', `${f3((1600 * t) / DURATION)}px`);
    let seen = 0;
    D.WORKS.forEach((w, i) => {
      const fs = D.firstSeen[w.key];
      const on = b >= fs ? Ez.oE(seg(b, fs, fs + 0.3)) : 0;
      if (b >= fs) seen++;
      op(el.slots[i].on, on);
      tf(el.slots[i].r, `scaleY(${f3(1 + 1.6 * pulse(b, fs, 0.25) * (b >= fs ? 1 : 0))})`);
    });
    txt(el['hud-count-n'], String(seen));
    op(el['hud-count'], seg(b, 20, 20.5) * breathDim * endFade);
    const lb = Math.max(env(b, 150, 150.7, 165.8, 166), seg(b, 256, 257));
    tf(el['lbx-top'], `translateY(${f3(-100 * (1 - Ez.ioC(lb)))}%)`);
    tf(el['lbx-bot'], `translateY(${f3(100 * (1 - Ez.ioC(lb)))}%)`);
  }

  // ═══ §10 FX 画布 ══════════════════════════════════════════════════════════
  const grainTiles = [];
  function makeGrain() {
    for (let k = 0; k < 6; k++) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const x = c.getContext('2d');
      const img = x.createImageData(256, 256);
      const r = mulberry32(777 + k * 131);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (r() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      grainTiles.push(c);
    }
  }

  // 冷开场蓝图自绘：把 frame = render(t) 当工程图画出来
  function blueprint(ctx, b) {
    const C = TX.cold;
    if (!inR(b, C.blueprintB0, C.codeWallB1)) return;
    const p = Ez.ioC(seg(b, C.blueprintB0, C.blueprintB1));
    const a = env(b, C.blueprintB0, C.blueprintB0 + 0.5, 19.4, 19.9) * 0.85;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = 'rgba(96,220,255,0.8)';
    ctx.fillStyle = 'rgba(96,220,255,0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 10]);
    const n = p * 6;
    if (n > 0) ctx.strokeRect(420, 260, 1080, 560);
    if (n > 1) { ctx.beginPath(); ctx.moveTo(920, 540); ctx.lineTo(1000, 540); ctx.moveTo(960, 500); ctx.lineTo(960, 580); ctx.stroke(); }
    if (n > 2) { ctx.beginPath(); ctx.moveTo(420, 260); ctx.lineTo(1500, 820); ctx.stroke(); }
    if (n > 3) for (let i = 0; i <= 12; i++) { const x = 420 + i * 90; ctx.beginPath(); ctx.moveTo(x, 830); ctx.lineTo(x, 848); ctx.stroke(); }
    if (n > 4) { ctx.beginPath(); ctx.arc(960, 540, 130, 0, Math.PI * 2); ctx.stroke(); }
    if (n > 4.6) {
      ctx.font = '500 22px Plex'; ctx.setLineDash([]);
      ctx.fillText('FIG.01 · frame = render(t)', 420, 244);
      ctx.fillText('1920', 938, 862);
      ctx.fillText('1 beat = 48 frames @120fps', 420, 900);
    }
    if (p < 1) {
      const sx = 420 + 1080 * ((p * 3) % 1);
      ctx.setLineDash([]);
      ctx.fillRect(sx, 250, 2, 600);
    }
    ctx.restore();
  }

  // 冷开场代码墙：真实源码行，从下往上加速滚动
  function codeWall(ctx, b) {
    const C = TX.cold;
    if (!inR(b, C.codeWallB0, C.codeWallB1)) return;
    const p = seg(b, C.codeWallB0, C.codeWallB1);
    const a = lerp(0.05, 0.38, Ez.iC(seg(b, C.codeWallB0, C.codeWallB0 + 1.5))) + 0.55 * Ez.iE(seg(b, C.codeWallB1 - 0.8, C.codeWallB1 - 0.05));
    const off = Math.pow(b - C.codeWallB0, 2.1) * 120;
    const L = D.CODE_LINES;
    ctx.save();
    ctx.font = '500 19px Plex';
    ctx.textBaseline = 'top';
    const rowH = 30;
    for (let col = 0; col < 3; col++) {
      const colX = 60 + col * 640;
      for (let r = -2; r < 40; r++) {
        const rowAbs = r + Math.floor(off / rowH) + col * 13;
        const y = r * rowH - (off % rowH);
        const li = L[(((rowAbs * 7 + col * 3) % L.length) + L.length) % L.length];
        const hl = hash(rowAbs * 1.7 + col) > 0.82;
        ctx.globalAlpha = a * (hl ? 1 : 0.55) * (0.4 + 0.6 * seg(y, 0, 300)) * (1 - 0.5 * seg(y, 800, 1080));
        if (hl && p > 0.2) {
          // 高亮行：代码 + 出处（观众可以在源码包里 Ctrl+F 到这一行）
          const code = li.line.slice(0, 34);
          ctx.fillStyle = '#FF7A3D';
          ctx.fillText(code, colX, y);
          ctx.fillStyle = '#3CF0C8';
          ctx.fillText('  // ' + li.src.split('/')[0], colX + ctx.measureText(code).width, y);
        } else {
          ctx.fillStyle = hl ? '#FF7A3D' : '#E8E4DA';
          ctx.fillText(li.line.slice(0, 58), colX, y);
        }
      }
    }
    ctx.restore();
  }

  // 通通开源背景：缓慢漂移的余烬
  const embers = Array.from({ length: 140 }, (_, i) => { const r = mulberry32(5150 + i); return { x: r() * W, y: r() * H, z: 0.3 + r() * 0.7, s: r() }; });
  function drawEmbers(ctx, b) {
    const B0 = TX.reveal.b[0]; // 206
    if (!inR(b, B0, 257)) return;
    const a = env(b, B0, B0 + 0.5, 255.5, 257);
    ctx.save();
    embers.forEach((e, i) => {
      const y = ((e.y - (b - B0) * 22 * e.z) % H + H) % H;
      const x = e.x + Math.sin(b * 0.6 + i) * 14 * e.z;
      const r = 1 + e.z * 2.4;
      ctx.globalAlpha = a * (0.25 + 0.55 * e.s) * (0.6 + 0.4 * Math.sin(b * 2 + i));
      ctx.fillStyle = i % 3 ? '#FFB27A' : '#FFFFFF';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  // DROP → 分屏 段：每拍一次橙色漏光
  function lightLeak(ctx, b) {
    if (!inR(b, 88, 124)) return;
    const k = pulse(b - Math.floor(b), 0, 0.28) * (inR(b, 88, 112) ? 1 : 0.5);
    const side = Math.floor(b) % 2 ? 0 : W;
    const g = ctx.createRadialGradient(side, CY, 0, side, CY, 1100);
    g.addColorStop(0, `rgba(255,122,61,${f3(0.32 * k)})`); g.addColorStop(1, 'rgba(255,122,61,0)');
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  function fxFront(ctx, b, f) {
    // 冲击波
    RING.forEach((r) => {
      if (b < r.b || b > r.b + r.d) return;
      const q = seg(b, r.b, r.b + r.d);
      ctx.save();
      ctx.globalAlpha = (1 - q) * 0.9;
      ctx.strokeStyle = r.c; ctx.lineWidth = r.w * (1 - q) + 1; ctx.shadowColor = r.c; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.arc(r.x, r.y, 40 + r.r * Ez.oC(q), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    lightLeak(ctx, b);
    // 故障条
    GLITCH.forEach((g) => {
      if (b < g.b || b > g.b + g.len) return;
      const r = mulberry32(f * 31 + 7);
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 14; i++) {
        const y = r() * H, h = 4 + r() * 60;
        ctx.fillStyle = ['rgba(255,40,80,0.55)', 'rgba(40,220,255,0.55)', 'rgba(255,255,255,0.35)'][i % 3];
        ctx.fillRect((r() - 0.5) * 300, y, W, h);
      }
      ctx.restore();
    });
    // 隧道尽头白化
    const whiteout = Ez.iC(seg(b, 137.2, 138));
    const flash = Math.max(sumPulse(FLASH, b), b < 138 ? whiteout : 0);
    if (flash > 0.003) {
      ctx.save(); ctx.globalAlpha = Math.min(1, flash); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    // 真空：DROP 前半拍 / 冷开场进正片 / 骤停 全黑
    if (inR(b, 87.5, 88) || inR(b, 19.9, 20) || inR(b, 165.75, 166)) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
    // 胶片颗粒（按帧号换图块 → 确定性）
    const tile = grainTiles[f % grainTiles.length];
    if (tile) {
      ctx.save();
      ctx.globalAlpha = 0.055 + 0.04 * env(b, 150, 151, 165, 166);
      ctx.globalCompositeOperation = 'overlay';
      const ox = (hash(f) * 256) | 0, oy = (hash(f + 0.5) * 256) | 0;
      for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(tile, x, y);
      ctx.restore();
    }
    // CRT 关机收尾：画面垂直塌缩成线 → 线缩成亮点 → 熄灭
    crtOff(ctx, b);
  }

  function crtOff(ctx, b) {
    if (b < TX.outro.crtB0) return;
    const p1 = Ez.iC(seg(b, TX.outro.crtB0, 297.2)); // 垂直塌缩
    const p2 = Ez.iC(seg(b, 297.2, 299));            // 水平塌缩
    const p3 = seg(b, 299.3, 300);                    // 熄灭
    ctx.fillStyle = '#000';
    const band = lerp(H, 0, p1);
    const cutY = (H - band) / 2;
    ctx.fillRect(0, 0, W, cutY);
    ctx.fillRect(0, H - cutY, W, cutY);
    if (p1 >= 1) {
      const lw = lerp(W, 0, p2);
      const cutX = (W - lw) / 2;
      ctx.fillRect(0, 0, cutX, H);
      ctx.fillRect(W - cutX, 0, cutX, H);
      if (lw > 0.5 && p2 < 1) {
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.fillRect(cutX, CY - 2, lw, 4);
      }
      if (p2 >= 1 && p3 < 1) {
        ctx.fillStyle = `rgba(255,255,255,${f3(1 - p3)})`;
        ctx.beginPath(); ctx.arc(CX, CY, 4, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      ctx.fillStyle = `rgba(255,255,255,${f3(0.12 + 0.8 * p1)})`;
      ctx.fillRect(0, CY - 1, W, 2);
    }
  }

  // 震屏（按帧号取伪随机 → 确定性）
  function shake(b, f) {
    let amp = 0;
    SHAKE.forEach((s) => { if (b >= s.b && b < s.b + s.d * 6) amp += s.amp * pulse(b, s.b, s.d); });
    amp += 12 * Ez.iC(seg(b, 86.3, 87.5)) * (b < 87.5 ? 1 : 0);
    if (amp < 0.05) { tf(el.stage, 'none'); return; }
    const x = (hash(f * 1.37) - 0.5) * 2 * amp, y = (hash(f * 2.11 + 3) - 0.5) * 2 * amp, r = (hash(f * 0.73 + 9) - 0.5) * amp * 0.06;
    tf(el.stage, `translate(${f3(x)}px,${f3(y)}px) rotate(${f3(r)}deg)`);
  }

  // ═══ render(t) ═════════════════════════════════════════════════════════════
  function render(tIn) {
    const t = clamp(tIn, 0, DURATION - 1e-6);
    const b = t / BEAT;
    const f = Math.round(t * FPS);
    const cb = el.cb, cf = el.cf;
    const DPR = el.fxback.width / W; // 4K 后备画布 → 全部 FX 以 1920 坐标绘制、硬件放大
    cb.setTransform(DPR, 0, 0, DPR, 0, 0); cb.clearRect(0, 0, W, H);
    cf.setTransform(DPR, 0, 0, DPR, 0, 0); cf.clearRect(0, 0, W, H);
    shake(b, f);
    codeWall(cb, b);
    blueprint(cb, b);
    drawEmbers(cb, b);
    sceneCold(b, t);
    sceneEras(b, cb);
    sceneStack(b);
    sceneGrid(b);
    sceneFull(b);
    sceneDuo(b);
    sceneSplit(b, cf);
    scenePhones(b);
    sceneTunnel(b, cf, cb);
    sceneWall(b);
    sceneBreath(b);
    sceneAutopsy(b);
    sceneMarathon(b);
    sceneFlyers(b);
    sceneReveal(b);
    scenePillars(b);
    sceneCard(b);
    sceneOutro(b, t);
    hud(b, t, f);
    fxFront(cf, b, f);
  }

  // ═══ 启动：字体就绪后再建时间轴（异步构建完成后才注册，见 hyperframes-core）═══
  function init() {
    grab();
    buildEvents();
    makeGrain();
    const tl = gsap.timeline({ paused: true });
    const clock = { t: 0 };
    tl.to(clock, { t: DURATION, duration: DURATION, ease: 'none' }, 0);
    tl.eventCallback('onUpdate', () => render(tl.time()));
    render(0);
    window.__render = render;
    window.__timelines = window.__timelines || {};
    window.__timelines['main'] = tl;
    if (window.__hfForceTimelineRebind) window.__hfForceTimelineRebind();
  }
  const fontLoads = ['900 100px HanSerifH', '900 100px NotoSerifSC', '700 40px NotoSansSC', '900 40px NotoSansSC', '800 40px Barlow', '900 40px Barlow', '600 40px Barlow', '500 20px Plex']
    .map((f) => document.fonts.load(f, '通开源代码视频ABC0123').catch(() => null));
  Promise.all(fontLoads).then(() => document.fonts.ready).then(init);
})();
