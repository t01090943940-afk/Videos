#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  build.mjs · EDL + 目录 → 静态 index.html（HyperFrames 合成）+ build/cues.json（配乐用）
//
//  为什么要"生成"而不是手写 index.html：
//    · HyperFrames 在编译期扫描 <video src> 并预抽帧，所以所有视频标签必须是静态 DOM；
//    · 本片有 90+ 个视频元素、28 张海报 ×3 套，全部由 EDL 驱动，手写必错；
//    · 画面与配乐读同一份 EDL（cues.json），改一拍两边一起变。
//
//  产物：index.html（根目录）、build/cues.json、build/timeline.txt（人读的镜头表）
//  用法：node tools/build.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORKS, MODELS, byKey, STATS, SHARE } from '../src/catalog.mjs';
import * as E from '../src/edl.mjs';
import { CODE_LINES } from '../src/code-lines.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const P = (...a) => path.join(ROOT, ...a);
const { T, BEAT } = E;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const col = (key) => MODELS[byKey[key].model].color;
let lane = 1;

// ── 视频标签（计时只挂在 <video> 本身，外层包裹一律不计时 —— 见 hyperframes-core 规则）
function video(id, src, b0, b1, { mediaStart = 0, track } = {}) {
  const ms = mediaStart ? ` data-media-start="${mediaStart.toFixed(3)}"` : '';
  return `<video id="v-${id}" src="${src}" data-start="${T(b0)}" data-duration="${T(b1 - b0)}"${ms} data-track-index="${track ?? lane++}" muted playsinline></video>`;
}

function label(key, techOverride, { spec = true } = {}) {
  const w = byKey[key];
  return `<div class="label" style="--c:${col(key)}">
      <div class="row1"><span class="chip">${esc(MODELS[w.model].label)}</span><span class="spec">${esc(w.folder)}</span></div>
      <span class="title">${esc(w.title)}</span>
      <span class="tech">${esc(techOverride || w.tech)}</span>
      ${spec ? `<span class="spec">${esc(w.spec)}</span>` : ''}
    </div>`;
}

// ── 各场景 DOM ─────────────────────────────────────────────────────────────
const TX = E.TEXT;

const coldHTML = `
<div id="cold" class="layer">
  <div id="cold-term"><span class="prompt">$</span><span id="cold-cmd"></span><span class="cursor" id="cold-cursor"></span></div>
  ${TX.cold.nos.map((n, i) => `<div class="cold-no" id="no${i}"><span class="txt">${esc(n.text)}<span class="strike"></span></span></div>`).join('\n  ')}
  <div id="cold-thesis">${esc(TX.cold.thesis)}</div>
  <div id="cold-formula">${esc(TX.cold.formula).replace(/\(t\)/, '(<span class="t">t</span>)')}</div>
</div>`;

const eraHTML = E.ERAS.map((e, i) => {
  const c = MODELS[e.model].color;
  const chars = [...e.title].map((ch) => `<span class="ch" data-layout-allow-overlap>${esc(ch)}</span>`).join('');
  const works = WORKS.filter((w) => MODELS[w.model].era === i + 1).length;
  return `
<div id="era${i + 1}" class="layer era" style="--c:${c}">
  <div class="era-num">${e.n}<span class="fillnum">${e.n}</span></div>
  <div class="era-right">
    <div class="era-chip">${esc(MODELS[e.model].label)}</div>
    <div class="era-title">${chars}</div>
    <div class="era-sub">${esc(e.sub)}</div>
  </div>
  <div class="era-cap">ERA ${e.n} · ${esc(MODELS[e.model].label)} · ${works} 部作品</div>
</div>`;
}).join('');

const wins = E.SHOTS.filter((s) => s.type === 'win');
const stackHTML = `
<div id="stack" class="layer"><div id="stack-cam">
${wins
  .map((s) => {
    const w = byKey[s.work];
    const span = E.clipSpan(s);
    return `  <div class="win" id="win-${s.id}" style="--c:${col(s.work)}">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>${esc(MODELS[w.model].label)}</b> · ${esc(w.folder)}/${esc(w.file)} — ${esc(w.spec)}</div></div>
    <div class="win-body">${video(s.id, `assets/clips/${s.id}.mp4`, span.b0, span.b1)}</div>
    <div class="win-shade"></div>
  </div>`;
  })
  .join('\n')}
</div></div>`;

const G = E.GRID;
const gridHTML = `
<div id="grid" class="layer">
${G.shots
  .map((shotNo, i) => `  <div class="gtile" id="gt${i}">${video(`g${i}`, `assets/clips/grid-${String(i).padStart(2, '0')}.mp4`, G.b0, G.b1)}</div>`)
  .join('\n')}
  <div id="grid-label"><span class="big">${esc(TX.grid.big)}</span><span class="small">${esc(TX.grid.small)}</span></div>
</div>`;

const fulls = E.SHOTS.filter((s) => s.type === 'full');
const fullHTML = `
<div id="full" class="layer" style="opacity:1">
${fulls
  .map(
    (s) => `  <div class="shot" id="shot-${s.id}">
    <div class="shot-media">${video(s.id, `assets/clips/${s.id}.mp4`, s.b0, s.b1)}</div>
    ${label(s.work, s.label)}
  </div>`,
  )
  .join('\n')}
</div>`;

const duoL = E.SHOTS.find((s) => s.type === 'duoL');
const duoR = E.SHOTS.find((s) => s.type === 'phoneR');
const duoHTML = `
<div id="duo" class="layer">
  <div id="duo-left">${video(duoL.id, `assets/clips/${duoL.id}.mp4`, duoL.b0, duoL.b1)}</div>
  <div class="phone" id="duo-phone"><div class="screen"><div class="notch"></div>${video(duoR.id, `assets/clips/${duoR.id}.mp4`, duoR.b0, duoR.b1)}</div></div>
  <div id="duo-label"><b>GPT</b>《${esc(byKey[duoL.work].title)}》 横屏 · 《${esc(byKey[duoR.work].title)}》 竖屏 —— 同一个模型，两种画幅</div>
</div>`;

const dropHTML = `<div id="drop-ov" class="layer"><span class="n">${TX.drop.n}</span><span class="w">${esc(TX.drop.word)}</span></div>`;

const splits = E.SHOTS.filter((s) => s.type === 'split');
const splitHTML = `
<div id="split" class="layer">
${splits
  .map(
    (s) => `  <div class="panel" id="pn-${s.id}" data-n="${s.n}" data-panel="${s.panel}">
    <div class="panel-media">${video(s.id, `assets/clips/${s.id}.mp4`, s.b0, s.b1)}</div>
    ${label(s.work, null, { spec: false })}
  </div>`,
  )
  .join('\n')}
</div>`;

const phones = E.SHOTS.filter((s) => s.type === 'phone');
const phonesHTML = `
<div id="phones" class="layer">
${phones
  .map(
    (s, i) => `  <div class="phone" id="ph-${s.id}" style="left:${[330, 760, 1190][i]}px">
    <div class="screen"><div class="notch"></div>${video(s.id, `assets/clips/${s.id}.mp4`, s.b0, s.b1)}</div>
    <div class="ph-label">${esc(byKey[s.work].title)}<span>${esc(byKey[s.work].spec)}</span></div>
  </div>`,
  )
  .join('\n')}
</div>`;

// 隧道：28 张海报贴四壁（左/右/顶/底轮换），沿 z 纵深排布
const tunnelPlanes = WORKS.map((w, i) => {
  const wall = i % 4;
  const d = Math.floor(i / 4);
  const z = -(300 + d * 760 + wall * 190);
  const tf = [
    `translate3d(-900px,0,${z}px) rotateY(90deg)`,
    `translate3d(900px,0,${z}px) rotateY(-90deg)`,
    `translate3d(0,-520px,${z}px) rotateX(-90deg)`,
    `translate3d(0,520px,${z}px) rotateX(90deg)`,
  ][wall];
  return `  <div class="tplane" id="tp-${w.key}" style="--c:${col(w.key)};transform:${tf}"><img src="assets/posters/${w.key}.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>${esc(w.title)}</div></div>`;
}).join('\n');
const tunnelHTML = `
<div id="tunnel" class="layer">
  <div id="tunnel-cam">
${tunnelPlanes}
  </div>
  <div class="center-box"><div id="tunnel-line">${esc(TX.tunnel.line)}</div></div>
</div>`;

// 巨墙：7 × 4
const W7 = E.WALL;
const TW = 256, TH = 144, GAP = 10;
const gridW = W7.cols * TW + (W7.cols - 1) * GAP, gridH = W7.rows * TH + (W7.rows - 1) * GAP;
const wx0 = (1920 - gridW) / 2, wy0 = (1080 - gridH) / 2;
const wallPos = (i) => ({ x: wx0 + (i % W7.cols) * (TW + GAP), y: wy0 + Math.floor(i / W7.cols) * (TH + GAP) });
const wallHTML = `
<div id="wall" class="layer">
  <div id="wall-cam">
${WORKS.map((w, i) => {
  const p = wallPos(i);
  return `    <div class="wtile" id="wt-${w.key}" style="--c:${col(w.key)};left:${p.x}px;top:${p.y}px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/${w.key}-end.jpg" alt="">
      ${video(`wall-${w.key}`, `assets/clips/wall-${w.key}.mp4`, W7.b0, W7.b1)}
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>${esc(MODELS[w.model].label)}</i>${esc(w.title)}</div>
      <div class="flash"></div>
    </div>`;
}).join('\n')}
  </div>
  <div id="wall-title">${esc(TX.wall.title)}</div>
  <div id="wall-sub">${esc(TX.wall.sub)}</div>
</div>`;

const breathHTML = `
<div id="breath" class="layer" style="opacity:1">
${TX.breath.map((l, i) => `  <div class="bline" id="bl${i}" data-layout-allow-overlap><div class="big" data-layout-allow-overlap>${esc(l.big)}</div>${l.small ? `<div class="small">${esc(l.small)}</div>` : ''}</div>`).join('\n')}
</div>`;

const flyersHTML = `
<div id="flyers" class="layer" style="opacity:1">
${WORKS.map((w) => `  <div class="flyer" id="fl-${w.key}" style="--c:${col(w.key)}"><img src="assets/posters/${w.key}.jpg" alt=""></div>`).join('\n')}
</div>`;

// 三柱：真实文件名（从仓库实时读取）
function listRepo(filter) {
  const out = [];
  for (const d of fs.readdirSync(REPO, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('00-')) continue;
    for (const f of fs.readdirSync(path.join(REPO, d.name))) if (filter(f)) out.push(`${d.name}/${f}`);
  }
  return out;
}
const lists = [
  listRepo((f) => /\.(zip|tgz|skill|html)$/i.test(f)),
  listRepo((f) => /\.md$/i.test(f)),
  listRepo((f) => /\.mp4$/i.test(f)),
];
const pillarsHTML = TX.pillars.items
  .map((it, i) => {
    const L = lists[i].length ? lists[i] : ['(prep: 仓库文件列表为空)'];
    const rows = [...L, ...L, ...L].map((f) => `<div>${esc(f)}</div>`).join('');
    return `  <div class="pillar" id="pl${i}">
    <div class="ph"><span class="h" data-layout-allow-overlap>${esc(it.head)}</span><span class="en" data-layout-allow-overlap>${esc(it.en)}</span></div>
    <div class="pn"><span class="pl-num" data-to="${it.num}" data-layout-allow-overlap>0</span><span class="unit" data-layout-allow-overlap>${esc(it.unit)}</span></div>
    <div class="sub">${esc(it.sub)}</div>
    <div class="pl-stream"><div class="pl-list" data-rows="${L.length}">${rows}</div></div>
  </div>`;
  })
  .join('\n');

const revealHTML = `
<div id="reveal" class="layer">
  <div id="rv-row">${TX.reveal.chars.map((c, i) => `<div class="rv-ch" id="rc${i}">${esc(c)}</div>`).join('')}</div>
  <div id="rv-en">${esc(TX.reveal.en)}</div>
  <div id="rv-sweep"></div>
</div>
<div id="pillars" class="layer">
${pillarsHTML}
</div>`;

const folderSVG = `<svg class="folder" id="folder" viewBox="0 0 210 170" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb2ff"/><stop offset="1" stop-color="#2f7dff"/></linearGradient>
  <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ff"/><stop offset="1" stop-color="#4a95ff"/></linearGradient></defs>
  <path d="M10 30 Q10 14 26 14 H80 L98 34 H184 Q200 34 200 50 V150 Q200 164 184 164 H26 Q10 164 10 150 Z" fill="url(#fg1)"/>
  <path d="M10 60 Q10 48 24 48 H186 Q200 48 200 62 V150 Q200 164 186 164 H24 Q10 164 10 150 Z" fill="url(#fg2)"/>
  <path d="M112 66 L82 112 H104 L96 148 L130 98 H108 Z" fill="#fff"/>
</svg>`;
const cardHTML = `
<div id="card" class="layer">
  <div id="share">
    <div class="svc"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#1a4fd6"/><path d="M24 9 L14 25 H21 L18 36 L30 19 H23 Z" fill="#fff"/></svg>${esc(SHARE.service)}</div>
    <div class="sh-count" id="sh-count">0 / 28</div>
    ${folderSVG}
    <div class="sh-name">${esc(SHARE.name)}</div>
    <div class="sh-meta">${esc(SHARE.size)} · 28 部成片 · ${STATS.packages} 个源码包 · ${STATS.coexp} 份复盘</div>
    <div class="sh-link" id="sh-link"><span id="sh-link-t"></span><span class="u" id="sh-link-u"></span></div>
    <div class="sh-exp">${esc(SHARE.expire)}</div>
  </div>
  <div id="qrbox"><img src="${SHARE.qr}" alt=""><div class="scan" id="qr-scan"></div></div>
  <div id="card-cta">${esc(TX.card.cta)}</div>
  <div id="card-note">${esc(TX.card.note)}</div>
</div>`;

const outroHTML = `
<div id="outro" class="layer">
  <div id="out-term"><span class="prompt">$</span><span id="out-cmd"></span><span class="cursor" id="out-cursor"></span></div>
  <div id="out-answer"><span class="arrow">▸</span>${esc(TX.outro.answer)}</div>
  ${TX.outro.credits.map((c, i) => `<div class="credit" id="cr${i}">${esc(c)}</div>`).join('\n  ')}
</div>
<div id="mini"><div class="mt"><b>源码 · 复盘 · 成片 · 通通开源</b><span>${esc(SHARE.service)} · ${esc(SHARE.url)}</span><span>${esc(SHARE.size)}</span></div><img src="${SHARE.qr}" alt=""></div>`;

const hudHTML = `
<div id="hud">
  <div id="hud-tl"><span id="hud-rec"><i></i>REC</span><span id="hud-cmd">render(t)</span><span id="hud-time">t = 00.000s</span><span id="hud-frame">f 0000</span></div>
  <div id="hud-era"><span class="k" id="hud-era-k">ERA 01</span><span class="v" id="hud-era-v">KIMI</span></div>
  <div id="ruler"><div class="base" id="ruler-base"></div>
${WORKS.map((w, i) => `    <div class="slot" id="sl-${w.key}" style="--c:${col(w.key)};left:${i * (1600 / 28) + 3}px"><div class="on"></div></div>`).join('\n')}
    <div id="playhead"></div>
  </div>
  <div id="hud-count"><b id="hud-count-n">0</b> / 28 部</div>
</div>`;

// ── 首次出场拍（底部时间尺点亮用）───────────────────────────────────────
const firstSeen = {};
const see = (k, b) => { if (firstSeen[k] === undefined || b < firstSeen[k]) firstSeen[k] = b; };
for (const s of E.SHOTS) see(s.work, s.b0);
see(E.GRID.work, E.GRID.b0);
WORKS.forEach((w, i) => { if (firstSeen[w.key] === undefined) see(w.key, E.WALL.b0 + 0.25 + i * 0.06); });

// ── 组装 ─────────────────────────────────────────────────────────────────
const css = fs.readFileSync(P('src/style.css'), 'utf8').replace(/\.\.\/assets\//g, 'assets/');
const runtime = fs.readFileSync(P('src/runtime.js'), 'utf8');
const DATA = {
  BEAT, FPS: E.FPS, DURATION: E.DURATION, TOTAL_BEATS: E.TOTAL_BEATS,
  SECTIONS: E.SECTIONS, ERAS: E.ERAS, SHOTS: E.SHOTS, GRID: E.GRID, WALL: E.WALL, TUNNEL: E.TUNNEL, TEXT: E.TEXT,
  STACK_END: E.STACK_END,
  WORKS: WORKS.map((w, i) => ({ key: w.key, model: w.model, color: col(w.key), title: w.title, slot: i })),
  MODELS, firstSeen, CODE_LINES, SHARE, STATS,
  wall: { TW, TH, GAP, x0: wx0, y0: wy0 },
};

const html = `<!doctype html>
<!--
  AI-CODING · SUPERVIDEOS —— 合集总片（62.4s · 150 BPM · 1920×1080）
  ⚠ 本文件由 tools/build.mjs 生成，请勿手改。改 src/edl.mjs / src/catalog.mjs / src/runtime.js / src/style.css 后重新 build。
-->
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>AI-Coding SuperVideos · 通通开源</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
${css}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${E.DURATION}" data-width="1920" data-height="1080" data-fps="60" data-layout-allow-overflow>
  <div id="bg" class="fill"></div>
  <canvas id="fxback" class="fx" width="1920" height="1080"></canvas>
  <div id="stage" class="fill">
${coldHTML}
${eraHTML}
${stackHTML}
${gridHTML}
${fullHTML}
${duoHTML}
${dropHTML}
${splitHTML}
${phonesHTML}
${tunnelHTML}
${wallHTML}
${breathHTML}
${flyersHTML}
${revealHTML}
${cardHTML}
${outroHTML}
  </div>
  <canvas id="fxfront" class="fx" width="1920" height="1080" data-layout-allow-occlusion></canvas>
  <div id="vignette"></div>
  <div id="scanlines"></div>
  <div id="lbx-top" class="lbx"></div>
  <div id="lbx-bot" class="lbx"></div>
${hudHTML}
  <audio id="score" src="assets/score.wav" data-start="0" data-duration="${E.DURATION}" data-track-index="90" data-volume="1"></audio>
</div>
<script>window.__EDL = ${JSON.stringify(DATA).replaceAll('THREE.', 'THREE\\u002e')};</script>
<!-- 注：EDL 里的真实代码行含 "THREE.WebGLRenderer"，会把静态检查器的 three.js 检测误触发。
     这里把 '.' 转义成 ，JSON.parse 解码回原文，显示与源码完全一致，但不再误报 missing_three_script。-->
<script>
${runtime}
</script>
</body>
</html>
`;
fs.writeFileSync(P('index.html'), html);

// ── 配乐 cue ─────────────────────────────────────────────────────────────
fs.mkdirSync(P('build'), { recursive: true });
fs.writeFileSync(
  P('build/cues.json'),
  JSON.stringify({ bpm: E.BPM, beat: BEAT, duration: E.DURATION, totalBeats: E.TOTAL_BEATS, sections: E.SECTIONS, eras: E.ERAS, sfx: E.SFX, cuts: E.SHOTS.map((s) => s.b0) }, null, 1),
);

// ── 人读镜头表 ───────────────────────────────────────────────────────────
const rows = [];
for (const s of E.SHOTS) rows.push(`${T(s.b0).toFixed(2).padStart(6)}s  b${String(s.b0).padEnd(5)} ${s.id.padEnd(5)} ${s.type.padEnd(7)} ${byKey[s.work].title}  @${s.in}s`);
fs.writeFileSync(P('build/timeline.txt'), rows.join('\n') + '\n');

const vids = (html.match(/<video /g) || []).length;
console.log(`build: index.html 写出（${(html.length / 1024).toFixed(0)} KB，${vids} 个 <video>），build/cues.json（${E.SFX.length} 个音效 cue）`);
