// ─────────────────────────────────────────────────────────────────────────────
//  timeline.mjs · 《源 · THE SOURCE》的乐谱（画面与配乐唯一真相源）
//
//  坐标系：一切以"拍"为单位。120 BPM → 1 拍 = 0.5 s = 60 帧@120fps = 30 帧@60fps。
//          1 小节 = 4 拍 = 2 s。全片 132 拍 = 66 s。
//  画面（web/scenes.js）与配乐（audio/score.py 读 build/cues.json）读同一份数据。
//
//  叙事（一个问题 → 一个答案）：
//    ACT 0  源        b0–16    「一行代码，能走多远？」一行真实源码 → 炸成字形 → 拼成第一帧
//    ACT 1  进化      b16–52   四代模型：卡点 → 逐像素 → 造世界 → 拍电影（窗口在 3D 里堆成塔）
//    ACT 2  电影      b52–72   DROP：OPUS 全屏连切，每个镜头都从自己的源码里"解码"出来
//    ACT 3  全部      b72–90   336 帧组成一颗旋转的球 → 摊开成墙 → 整面墙退回代码
//    ACT 4  凝视      b90–98   骤停。「它们，是怎么做出来的？」
//    ACT 5  通通开源  b98–108  四字砸屏，每个字由几百个作品帧拼成 → 穿过一帧，钻进它的源码
//    ACT 6  里面      b108–120 真实文件树瀑布 + 实测数字 + 仓库地址
//    ACT 7  下一行    b120–132 「下一行，由你来写。」
// ─────────────────────────────────────────────────────────────────────────────

export const BPM = 120;
export const BEAT = 60 / BPM; // 0.5 s
export const TOTAL_BEATS = 132;
export const DURATION = TOTAL_BEATS * BEAT; // 66 s
export const W = 1920, H = 1080;
export const T = (b) => b * BEAT;

// 仓库实测（tools/prep.py → assets/data/stats.json；这里是展示用的格式化文案）
export const REPO_URL = 'github.com/t01090943940-afk/Videos';

// ─── 段落能量（配乐织体密度 / 画面后期强度共用）──────────────────────────
export const SECTIONS = [
  { id: 'genesis', b0: 0, b1: 16, energy: 0.12 },
  { id: 'gen1', b0: 16, b1: 24, energy: 0.45 },
  { id: 'gen2', b0: 24, b1: 32, energy: 0.6 },
  { id: 'gen3', b0: 32, b1: 46, energy: 0.78 },
  { id: 'predrop', b0: 46, b1: 52, energy: 0.9 },
  { id: 'drop', b0: 52, b1: 72, energy: 1.0 },
  { id: 'orb', b0: 72, b1: 90, energy: 0.92 },
  { id: 'silence', b0: 90, b1: 98, energy: 0.03 },
  { id: 'reveal', b0: 98, b1: 108, energy: 1.0 },
  { id: 'inside', b0: 108, b1: 120, energy: 0.85 },
  { id: 'outro', b0: 120, b1: 132, energy: 0.2 },
];

// ─── ACT 0 ────────────────────────────────────────────────────────────────
export const GENESIS = {
  q1: { text: '一行代码，', b: 2 },
  q2: { text: '能走多远？', b: 3.5 },
  en: { text: 'HOW FAR CAN ONE LINE OF CODE GO?', b: 4.25 },
  qOut: 5.6,
  // 这一行原样摘自 opus-oneink/main.js 第 2 行
  line: 'const W = 1920, H = 1080, FPS = 30;',
  lineSrc: 'opus-oneink/main.js : 2',
  typeB0: 6, typeB1: 9.4,
  enter: 10,
  swarmB0: 10, swarmB1: 14,
  resolveB0: 14, resolveB1: 16,
  clip: 'w03', work: 'kimi-beat',
};

// ─── ACT 1 · 四代 ──────────────────────────────────────────────────────────
export const ERAS = [
  { n: '01', model: 'KIMI', color: '#3CF0C8', verb: '学会了卡点', en: 'IT LEARNED THE BEAT', spec: '字跟着鼓点砸下来', b0: 16, b1: 24, level: 0.16 },
  { n: '02', model: 'SWE', color: '#7CC4FF', verb: '学会了逐像素', en: 'IT LEARNED THE PIXEL', spec: '不开浏览器，一个像素一个像素算', b0: 24, b1: 32, level: 0.3 },
  { n: '03', model: 'GPT', color: '#A98BFF', verb: '学会了造世界', en: 'IT LEARNED TO BUILD WORLDS', spec: '一个模型，三十个世界', b0: 32, b1: 46, level: 0.55 },
  { n: '04', model: 'CLAUDE OPUS', color: '#FF7A3D', verb: '学会了拍电影', en: 'IT LEARNED CINEMA', spec: 'AE 级合成 · 水墨 · 3D · 4K60', b0: 46, b1: 72, level: 1.4 },
];

// 窗口塔：每个窗口出场后一直留在塔里（后排仍在播放）
export const TOWER = [
  { clip: 'w03', work: 'kimi-beat', b: 16 },
  { clip: 'w01', work: 'kimi-beat', b: 18 },
  { clip: 'w02', work: 'kimi-beat', b: 20 },
  { clip: 'w04', work: 'kimi-beat', b: 22 },
  { clip: 'w05', work: 'ai-rise', b: 24 },
  { clip: 'w06', work: 'ai-rise', b: 25.5 },
  { clip: 'w07', work: 'kimi-film', b: 27 },
  { clip: 'w08', work: 'kimi-film', b: 28.5 },
  { clip: 'w09', work: 'ai-rise', b: 30 },
  { clip: 'w10', work: 'kimi-film', b: 31 },
];

// GPT：COSMOS 1 → 4 → 16 倍增，然后十五个世界环绕摄像机
export const COSMOS = { b0: 32, b1: 36, steps: [{ b: 32, n: 1 }, { b: 33, n: 4 }, { b: 34, n: 16 }] };
export const WORLDS = { b0: 36, b1: 43.5, step: 0.5, n: 15 }; // bw00..bw14
export const GPT_TAIL = [
  { clip: 'g07', work: 'gpt-autumn', b0: 43.5, b1: 44.25 },
  { clip: 'g08', work: 'gpt-autumn', b0: 44.25, b1: 45 },
  { clip: 'g09', work: 'moon-letter', b0: 45, b1: 46, vertical: true },
];
export const PREDROP = { card: 46, collapse0: 48, collapse1: 51, vacuum: 51, drop: 52 };

// ─── ACT 2 · DROP ─────────────────────────────────────────────────────────
//  fx = 本镜入场方式（全部是 web/fx.js 里的转场着色器）
export const DROP = [
  { clip: 'h01', work: 'shatter', b0: 52, b1: 54, fx: 'glyph', tag: '自写 3D 合成器 · Voronoi 碎裂', src: 'opus-broken-reround' },
  { clip: 'h02', work: 'oneink', b0: 54, b1: 55, fx: 'ink', tag: '逆锋压笔 · 泼墨一笔', src: 'opus-oneink/main.js' },
  { clip: 'h03', work: 'dingge', b0: 55, b1: 56, fx: 'slice', tag: 'Three.js 定格 · 1440p60', src: 'opus-factory-safety-videos/src/world/crane.ts' },
  { clip: 'h04', work: 'claude15', b0: 56, b1: 57, fx: 'pixel', tag: '15 种画风 · 体素', src: 'opus-claude-intro-with-15-way/scenes_a.py' },
  { clip: 'h05', work: 'protocom', b0: 57, b1: 58, fx: 'zoom', tag: '4K · 60fps 定版', src: 'opus-production-video-protocom-intro/src/act4.js' },
  { clip: 'h06', work: 'codecosmos', b0: 58, b1: 59, fx: 'glyph', tag: '2D → 4D 超立方体', src: 'opus-universe-history-video/web/scenes_c.js' },
  { clip: 'h07', work: 'shatter', b0: 59, b1: 60, fx: 'shatter', tag: 'MoGraph 魔方墙 · 336 立方体', src: 'opus-broken-reround' },
  { clip: 'h08', work: 'phasegate', b0: 60, b1: 60.5, fx: 'rgb', tag: '升维 · 曲速', src: 'opus-production-video-ai-phase-skill' },
  { clip: 'h09', work: 'ageint', b0: 60.5, b1: 61, fx: 'slice', tag: '108 镜 · 4170 行 Python', src: 'opus-age-of-intelligence/src/scenes.py' },
  { clip: 'h10', work: 'skillshub', b0: 61, b1: 61.5, fx: 'zoom', tag: 'Logo 冲击出场', src: 'opus-production-video-skill-hub/src/js/fx.js' },
  { clip: 'h11', work: 'f12', b0: 61.5, b1: 62, fx: 'rgb', tag: 'Console · 故障字', src: 'opus-F12-teaching/video.html' },
  { clip: 'h12', work: 'claude15', b0: 62, b1: 62.5, fx: 'whip', tag: '15 种画风 · 瑞士主义', src: 'opus-claude-intro-with-15-way/scenes_b.py' },
  { clip: 'h13', work: 'dingge', b0: 62.5, b1: 63, fx: 'whip', tag: '瑞士奶酪模型', src: 'opus-factory-safety-videos/src/film/shots.ts' },
  { clip: 'h14', work: 'hust1037', b0: 63, b1: 63.5, fx: 'glyph', tag: '一个符号讲完一所大学', src: 'opus-1037-hust-story' },
  { clip: 'h15', work: 'oneink', b0: 63.5, b1: 64, fx: 'ink', tag: '「永」字八法 · 按笔顺书写', src: 'opus-oneink/main.js' },
];
// 分屏 / 手机排面
export const SPLITS = [
  { b0: 64, b1: 66, panes: [
    { clip: 's1a', work: 'xuanlan', tag: '32 分钟写完' },
    { clip: 's1b', work: 'studysolo', tag: '真实 Agent 页面' },
    { clip: 's2c', work: 'protocom', tag: '760 亿 Tokens' },
  ] },
  { b0: 66, b1: 68, panes: [
    { clip: 's2a', work: 'yusheng', tag: '每一拍一个动作' },
    { clip: 's2b', work: 'shuchenglin', tag: '虚拟时间逐帧录屏' },
    { clip: 's3a', work: 'stopmotion', tag: '搭一次世界 拍任何画风' },
    { clip: 's3b', work: 'codecosmos', tag: '27 种代码风格' },
  ] },
];
export const PHONES = { b0: 68, b1: 70, bg: 's3c', bgWork: 'gongcishi', items: [
  { clip: 'p1', work: 'readclub' }, { clip: 'p2', work: 'senpai' }, { clip: 'p3', work: 'moonlamp' },
] };
export const DROP_TAIL = [
  { clip: 's3d', work: 'samemoon', b0: 70, b1: 71, fx: 'glyph', tag: '单文件 854 行 · Canvas + Web Audio', src: 'opus-mid-autumn-genergal-videos' },
  { clip: 's3c', work: 'gongcishi', b0: 71, b1: 72, fx: 'zoom', tag: '三年照片 · 217 份真实素材', src: 'opus-mid-autumn-highschool-videos' },
];

// ─── ACT 3 · 球 → 墙 → 代码 ────────────────────────────────────────────────
export const ORB = {
  b0: 72, inside: 72, exit: 76, full: 78, unfold0: 82, unfold1: 85, wall: 85, decay0: 87.5, decay1: 89.5, b1: 90,
  cols: 24, rows: 14, // 336 块 = 28 部 × 12 帧（atlas 布局一致）
};
export const ORB_TEXT = [
  { big: '28 部代码视频', en: '28 FILMS · EVERY FRAME COMPUTED', b0: 78.5, b1: 82 },
  { big: '0 帧手剪', en: 'ZERO FRAMES CUT BY HAND', b0: 85, b1: 88 },
];

// ─── ACT 4 · 凝视 ─────────────────────────────────────────────────────────
export const SILENCE = {
  b0: 90, b1: 98,
  lines: [
    { text: '28 部片子。', b0: 90.5, b1: 92.4 },
    { text: '45,558 行代码。', b0: 92.5, b1: 94.4 },
    { text: '它们，是怎么做出来的？', b0: 94.5, b1: 97.6 },
  ],
};

// ─── ACT 5 · 通通开源 ─────────────────────────────────────────────────────
export const REVEAL = {
  chars: ['通', '通', '开', '源'],
  b: [98, 99, 100, 101],
  en: { text: 'OPEN SOURCE · ALL OF IT', b: 102 },
  push0: 103, push1: 108, // 推进 → 穿过「源」字里的一帧 → 进入它的源码
  heroClip: 'h15', heroWork: 'oneink',
};

// ─── ACT 6 · 里面 ─────────────────────────────────────────────────────────
export const INSIDE = {
  b0: 108, b1: 120,
  counters: [
    { num: 19, fmt: '', unit: '个工程源码包', en: 'SOURCE PACKAGES', b: 108.5 },
    { num: 45558, fmt: ',', unit: '行代码', en: 'LINES OF CODE', b: 110 },
    { num: 515858, fmt: ',', unit: '字复盘 · 24 份 CoExp', en: 'WORDS OF LESSONS', b: 111.5 },
    { num: 28, fmt: '', unit: '部成片', en: 'FILMS', b: 113 },
  ],
  url: { b0: 114.5, b1: 120, text: REPO_URL, tagline: '源码 · 复盘 · 踩过的坑 · 一个不留' },
};

// ─── ACT 7 · 下一行 ───────────────────────────────────────────────────────
export const OUTRO = {
  b0: 120, typeB0: 120.5, typeB1: 122.6,
  text: '下一行，由你来写。',
  enter: 124,
  strobe0: 124, strobe1: 125,
  title: 125, creditsB: 126.5, fade0: 130, b1: 132,
  credits: [
    '本片 100% 由代码生成 · 画面 WebGL2 自写合成器 · 配乐 numpy 逐样本合成',
    '所有素材来自本仓库的 28 部作品 · 1080p · 120fps',
  ],
};

// ─── 音效 cue（audio/score.py 解释 kind；gain 线性）──────────────────────
function buildCues() {
  const s = [];
  const add = (b, kind, o = {}) => s.push({ b: +b.toFixed(4), kind, ...o });
  // ACT 0
  add(0, 'drone', { b1: 16, gain: 0.6 });
  add(GENESIS.q1.b, 'tick', { gain: 0.5 });
  add(GENESIS.q2.b, 'tick', { gain: 0.6 });
  add(GENESIS.q2.b, 'sub', { gain: 0.5 });
  const L = GENESIS.line;
  for (let i = 0; i < L.length; i++) {
    if (L[i] === ' ') continue;
    add(GENESIS.typeB0 + (i * (GENESIS.typeB1 - GENESIS.typeB0)) / L.length, 'key', { gain: 0.55, seed: i });
  }
  add(GENESIS.enter - 0.02, 'enter', { gain: 0.9 });
  add(GENESIS.enter, 'boom', { gain: 0.9 });
  add(GENESIS.swarmB0, 'swarm', { b1: GENESIS.swarmB1, gain: 0.55 });
  add(12, 'riser', { b1: 16, gain: 0.9 });
  add(14.5, 'revcym', { b1: 16, gain: 0.6 });
  // ACT 1
  for (const e of ERAS) add(e.b0, e.n === '04' ? 'braam' : 'impact', { gain: e.n === '01' ? 1.0 : 0.85 });
  for (const w of TOWER) add(w.b, 'whoosh', { gain: 0.35, seed: w.b });
  for (const st of COSMOS.steps) add(st.b, 'shutter', { gain: 0.6, n: st.n });
  for (let k = 0; k < WORLDS.n; k++) add(WORLDS.b0 + k * WORLDS.step, 'blip', { gain: 0.3, seed: k, note: k });
  for (const g of GPT_TAIL) add(g.b0, 'shutter', { gain: 0.4 });
  add(PREDROP.collapse0, 'riser', { b1: PREDROP.vacuum, gain: 1.0 });
  add(PREDROP.collapse0 + 1, 'snareroll', { b1: PREDROP.vacuum, gain: 0.7 });
  add(PREDROP.collapse0, 'suck', { b1: PREDROP.vacuum, gain: 0.6 });
  // ACT 2
  add(PREDROP.drop, 'megaimpact', { gain: 1.2, seed: 1 });
  add(PREDROP.drop, 'crash', { gain: 0.8 });
  for (const d of [...DROP.slice(1), ...DROP_TAIL]) add(d.b0, 'hit', { gain: 0.42, seed: d.b0 * 2, fx: d.fx });
  for (const sp of SPLITS) sp.panes.forEach((p, i) => add(sp.b0 + i * 0.25, 'shutter', { gain: 0.45 }));
  add(PHONES.b0, 'swoosh', { gain: 0.5 });
  add(64, 'crash', { gain: 0.55 });
  add(68, 'crash', { gain: 0.5 });
  // ACT 3
  add(ORB.b0, 'impact', { gain: 1.0 });
  add(ORB.b0, 'crash', { gain: 0.7 });
  add(ORB.exit, 'whooshbig', { gain: 0.8 });
  add(ORB.full, 'braam', { gain: 0.7 });
  add(ORB.unfold0, 'swoosh', { gain: 0.6 });
  add(ORB.wall, 'impact', { gain: 0.9 });
  add(ORB.decay0 - 1.5, 'riser', { b1: ORB.b1, gain: 0.9 });
  add(ORB.decay0, 'glitch', { gain: 0.6, len: 1.0 });
  add(88, 'snareroll', { b1: 90, gain: 0.7 });
  // ACT 4
  add(SILENCE.b0, 'tapestop', { gain: 0.8 });
  [90.5, 92.5, 94.5].forEach((b, i) => add(b, 'bell', { gain: 0.5, note: [62, 65, 69][i] }));
  [91, 91.35, 93, 93.35, 95, 95.35].forEach((b) => add(b, 'heart', { gain: 0.65 }));
  add(96, 'revswell', { b1: 98, gain: 1.0 });
  add(97.75, 'inhale', { gain: 0.6 });
  // ACT 5
  REVEAL.b.forEach((b, i) => add(b, 'megaimpact', { gain: 1.05 + i * 0.07, seed: 10 + i }));
  add(REVEAL.en.b, 'crash', { gain: 0.85 });
  add(REVEAL.en.b, 'braam', { gain: 0.8 });
  add(106, 'riser', { b1: 108, gain: 0.8 });
  add(107.5, 'whooshbig', { gain: 0.8 });
  // ACT 6
  add(INSIDE.b0, 'impact', { gain: 0.9 });
  add(INSIDE.b0, 'datastream', { b1: 118, gain: 0.35 });
  for (const c of INSIDE.counters) { add(c.b, 'thump', { gain: 0.7 }); add(c.b, 'counter', { b1: c.b + 1, gain: 0.25 }); }
  const U = INSIDE.url.text;
  for (let i = 0; i < U.length; i++) add(INSIDE.url.b0 + 0.25 + i * 0.045, 'key', { gain: 0.35, seed: 100 + i });
  add(INSIDE.url.b0, 'impact', { gain: 0.8 });
  add(118, 'downlifter', { b1: 120, gain: 0.6 });
  // ACT 7
  const O = OUTRO.text;
  for (let i = 0; i < O.length; i++) add(OUTRO.typeB0 + (i * (OUTRO.typeB1 - OUTRO.typeB0)) / O.length, 'key', { gain: 0.5, seed: 200 + i });
  add(OUTRO.enter - 0.02, 'enter', { gain: 0.9 });
  add(OUTRO.enter, 'rewind', { b1: OUTRO.strobe1, gain: 0.6 });
  add(OUTRO.title, 'megaimpact', { gain: 1.1, seed: 99 });
  add(OUTRO.title, 'bell', { gain: 0.55, note: 74 });
  return s.sort((a, b) => a.b - b.b);
}
export const CUES = buildCues();
