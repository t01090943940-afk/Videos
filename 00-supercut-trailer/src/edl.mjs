// ─────────────────────────────────────────────────────────────────────────────
//  EDL · 整支片子的"乐谱"（唯一真相源）
//
//  坐标系：一切以"拍"为单位。150 BPM → 1 拍 = 0.4 s = 12 帧@30fps（整数，卡点地基）
//          1 小节 = 4 拍 = 1.6 s。全片 156 拍 = 62.4 s。
//
//  画面（tools/build.mjs → index.html → src/runtime.js）
//  音乐（audio/score.py，读取 build/cues.json）
//  两边读的是同一份数据：画面切在哪一拍，鼓就落在哪一拍 —— 音画同源。
//
//  叙事：
//    ACT 0  冷开场   b0–16    "没有 AE / 没有 PR / 没有剪辑软件"  → frame = render(t)
//    ACT 1  ERA 01   b16–27   KIMI   · 觉醒：字跟着鼓点砸下来
//    ACT 2  ERA 02   b27–42   SWE    · 像素：不开浏览器，逐像素算
//    ACT 3  ERA 03   b42–62   GPT    · 世界：一个模型，三十个世界
//    ACT 4  ERA 04   b62–104  OPUS   · 电影：AE 级合成 / 水墨 / 3D / 4K  → 隧道 → 28 宫格巨墙
//    ACT 5  凝视     b104–116 音乐骤停。"28 部片子。6.9 万帧，没有一帧是手剪的。它们是怎么做出来的？"
//    ACT 6  通通开源 b116–140 四字砸屏 → 三柱（源码/复盘/成片）→ QQ 闪传卡片 + 二维码
//    ACT 7  尾声     b140–156 回到终端：下一部，由你来写。
// ─────────────────────────────────────────────────────────────────────────────

export const BPM = 150;
export const BEAT = 60 / BPM; // 0.4 s
export const FPS = 30;
export const TOTAL_BEATS = 156;
export const DURATION = TOTAL_BEATS * BEAT; // 62.4 s
export const T = (b) => +(b * BEAT).toFixed(4);

// ─── 段落（音乐编曲与画面场景共用）────────────────────────────────────────
export const SECTIONS = [
  { id: 'cold', b0: 0, b1: 16, energy: 0.15 },
  { id: 'era1', b0: 16, b1: 27, energy: 0.55 },
  { id: 'era2', b0: 27, b1: 42, energy: 0.65 },
  { id: 'era3', b0: 42, b1: 62, energy: 0.8 },
  { id: 'era4card', b0: 62, b1: 64, energy: 0.9 },
  { id: 'drop', b0: 64, b1: 88, energy: 1.0 },
  { id: 'tunnel', b0: 88, b1: 96, energy: 0.95 },
  { id: 'wall', b0: 96, b1: 104, energy: 1.0 },
  { id: 'breath', b0: 104, b1: 116, energy: 0.05 },
  { id: 'reveal', b0: 116, b1: 128, energy: 1.0 },
  { id: 'card', b0: 128, b1: 140, energy: 0.7 },
  { id: 'outro', b0: 140, b1: 156, energy: 0.2 },
];

// ─── 时代卡 ────────────────────────────────────────────────────────────────
export const ERAS = [
  { n: '01', model: 'KIMI', title: '觉醒', sub: '让每一个字，都砸在鼓点上', b0: 16, b1: 19, node: 0 },
  { n: '02', model: 'SWE', title: '像素', sub: '不开浏览器，逐像素算出每一帧', b0: 27, b1: 30, node: 1 },
  { n: '03', model: 'GPT', title: '世界', sub: '一个模型，三十个世界', b0: 42, b1: 45, node: 2 },
  { n: '04', model: 'OPUS', title: '电影', sub: 'AE 级合成 · 水墨 · 3D · 4K', b0: 62, b1: 64, node: 3 },
];

// ─── 镜头表 ────────────────────────────────────────────────────────────────
//  type:
//   win    浮动窗口，在 3D 空间里一层层堆叠（ERA 01/02）
//   full   全屏英雄镜头（每拍一切）
//   duoL / phoneR   左横屏 + 右手机竖屏
//   split  n 联斜切分屏（拉片感）；panel = 0..n-1
//   phone  竖屏作品放进手机框
//   grid   COSMOS 30 风格倍增宫格（特殊，见 GRID）
//   wall   28 宫格巨墙（特殊，见 WALL）
//  in = 源片入点（秒），b0/b1 = 在本片中的起止拍
export const SHOTS = [
  // ERA 01 · KIMI —— 窗口开始堆叠
  { id: 'w01', type: 'win', work: 'kimi-beat', in: 1.9, b0: 19, b1: 21 },
  { id: 'w02', type: 'win', work: 'kimi-beat', in: 4.9, b0: 21, b1: 23 },
  { id: 'w03', type: 'win', work: 'kimi-beat', in: 23.62, b0: 23, b1: 25 },
  { id: 'w04', type: 'win', work: 'kimi-beat', in: 45.8, b0: 25, b1: 27 },
  // ERA 02 · SWE —— 堆叠继续长高
  { id: 'w05', type: 'win', work: 'ai-rise', in: 3.62, b0: 30, b1: 32 },
  { id: 'w06', type: 'win', work: 'ai-rise', in: 6.1, b0: 32, b1: 34 },
  { id: 'w07', type: 'win', work: 'kimi-film', in: 4.6, b0: 34, b1: 36 },
  { id: 'w08', type: 'win', work: 'kimi-film', in: 13.6, b0: 36, b1: 38 },
  { id: 'w09', type: 'win', work: 'ai-rise', in: 26.9, b0: 38, b1: 40 },
  { id: 'w10', type: 'win', work: 'kimi-film', in: 33.2, b0: 40, b1: 42 },

  // ERA 03 · GPT
  //   b45–51 COSMOS 倍增宫格（见 GRID）
  { id: 'g01', type: 'full', work: 'beyond', in: 12.0, b0: 51, b1: 52, label: '15 个世界 · 体素岛' },
  { id: 'g02', type: 'full', work: 'beyond', in: 18.0, b0: 52, b1: 53, label: '15 个世界 · 黏土机器人' },
  { id: 'g03', type: 'full', work: 'beyond', in: 48.0, b0: 53, b1: 54, label: '15 个世界 · 波普网点' },
  { id: 'g04', type: 'full', work: 'beyond', in: 84.0, b0: 54, b1: 55, label: '15 个世界 · 霓虹' },
  { id: 'g05', type: 'full', work: 'beyond', in: 96.0, b0: 55, b1: 56, label: '15 个世界 · 铬金属' },
  { id: 'g06', type: 'full', work: 'beyond', in: 102.0, b0: 56, b1: 57, label: '15 个世界 · 粒子' },
  { id: 'g07', type: 'full', work: 'gpt-autumn', in: 6.0, b0: 57, b1: 59, label: '铅笔线描 → 水墨 → 雕刻' },
  { id: 'g08', type: 'duoL', work: 'gpt-autumn', in: 20.5, b0: 59, b1: 62 },
  { id: 'g09', type: 'phoneR', work: 'moon-letter', in: 15.0, b0: 59, b1: 62 },

  // ERA 04 · OPUS —— DROP：每拍一切
  { id: 'h01', type: 'full', work: 'shatter', in: 3.0, b0: 64, b1: 66, label: '自写 3D 合成器 · Voronoi 碎裂' },
  { id: 'h02', type: 'full', work: 'oneink', in: 50.0, b0: 66, b1: 67, label: '逆锋压笔 · 泼墨一笔' },
  { id: 'h03', type: 'full', work: 'dingge', in: 34.6, b0: 67, b1: 68, label: 'Three.js 定格 · 慢动作坠落' },
  { id: 'h04', type: 'full', work: 'claude15', in: 50.5, b0: 68, b1: 69, label: '15 种画风 · 体素' },
  { id: 'h05', type: 'full', work: 'protocom', in: 75.4, b0: 69, b1: 70, label: '4K 60fps 定版' },
  { id: 'h06', type: 'full', work: 'codecosmos', in: 10.0, b0: 70, b1: 71, label: '4D 超立方体' },
  { id: 'h07', type: 'full', work: 'shatter', in: 12.0, b0: 71, b1: 72, label: 'MoGraph 魔方墙 · 336 立方体' },
  { id: 'h08', type: 'full', work: 'phasegate', in: 19.4, b0: 72, b1: 73, label: '升维 · 曲速' },
  { id: 'h09', type: 'full', work: 'ageint', in: 36.6, b0: 73, b1: 74, label: '注意力机制 · 3D' },
  { id: 'h10', type: 'full', work: 'skillshub', in: 19.8, b0: 74, b1: 75, label: 'Logo 冲击出场' },
  { id: 'h11', type: 'full', work: 'f12', in: 20.8, b0: 75, b1: 76, label: 'Console · 故障字' },
  { id: 'h12', type: 'full', work: 'claude15', in: 74.0, b0: 76, b1: 77, label: '15 种画风 · 瑞士主义' },
  { id: 'h13', type: 'full', work: 'dingge', in: 77.4, b0: 77, b1: 78, label: '2560×1440 · 60fps' },
  { id: 'h14', type: 'full', work: 'hust1037', in: 104.2, b0: 78, b1: 79, label: '几百只小手连成山脊' },
  { id: 'h15', type: 'full', work: 'oneink', in: 4.6, b0: 79, b1: 80, label: '「永」字八法 · 按笔顺书写' },

  // 拉片 · 分屏
  { id: 's1a', type: 'split', n: 2, panel: 0, work: 'xuanlan', in: 24.0, b0: 80, b1: 82 },
  { id: 's1b', type: 'split', n: 2, panel: 1, work: 'studysolo', in: 15.5, b0: 80, b1: 82 },
  { id: 's2a', type: 'split', n: 3, panel: 0, work: 'yusheng', in: 6.5, b0: 82, b1: 84 },
  { id: 's2b', type: 'split', n: 3, panel: 1, work: 'shuchenglin', in: 38.0, b0: 82, b1: 84 },
  { id: 's2c', type: 'split', n: 3, panel: 2, work: 'protocom', in: 47.0, b0: 82, b1: 84 },
  { id: 's3a', type: 'split', n: 4, panel: 0, work: 'stopmotion', in: 53.0, b0: 84, b1: 86 },
  { id: 's3b', type: 'split', n: 4, panel: 1, work: 'codecosmos', in: 33.0, b0: 84, b1: 86 },
  { id: 's3c', type: 'split', n: 4, panel: 2, work: 'gongcishi', in: 160.0, b0: 84, b1: 86 },
  { id: 's3d', type: 'split', n: 4, panel: 3, work: 'samemoon', in: 64.0, b0: 84, b1: 86 },
  { id: 'p1', type: 'phone', panel: 0, work: 'readclub', in: 25.0, b0: 86, b1: 88 },
  { id: 'p2', type: 'phone', panel: 1, work: 'senpai', in: 21.5, b0: 86, b1: 88 },
  { id: 'p3', type: 'phone', panel: 2, work: 'moonlamp', in: 8.6, b0: 86, b1: 88 },
];

// 窗口一旦出现就一直播放到堆叠结束（后排窗口仍然是"活"的），其余镜头播放 b0→b1
export const STACK_END = 42;
export const clipSpan = (s) => ({ b0: s.b0, b1: s.type === 'win' ? STACK_END : s.b1 });

// COSMOS 30 风格倍增：1 → 4 → 9 → 16 格，每格是 COSMOS 的不同一镜（每镜 2.4 s）
export const GRID = {
  work: 'cosmos30',
  b0: 45,
  b1: 51,
  steps: [ // 第几拍出现几格
    { b: 45, n: 1 },
    { b: 46, n: 4 },
    { b: 47, n: 9 },
    { b: 48, n: 16 },
  ],
  // COSMOS 30 镜里挑 16 镜（镜号 0..29），入点 = 镜号 × 2.4 s
  shots: [9, 1, 7, 19, 3, 12, 15, 26, 5, 22, 10, 17, 28, 2, 13, 24],
  shotLen: 2.4,
};

// 28 宫格巨墙：7 × 4，每格用 catalog 里的 wallIn 入点
export const WALL = { b0: 96, b1: 104, cols: 7, rows: 4, clipLen: 3.4 };
// 隧道：28 张海报贴在四壁，摄像机前冲
export const TUNNEL = { b0: 88, b1: 96 };

// ─── 文字 cue（全部文字都在这里，改文案只改这一处）─────────────────────────
export const TEXT = {
  cold: {
    prompt: '$ ',
    command: 'render(t)',
    typeB0: 2,
    typeB1: 4.6,
    nos: [
      { text: '没有 AE', b: 6 },
      { text: '没有 PR', b: 7 },
      { text: '没有剪辑软件', b: 8 },
    ],
    nosOut: 10,
    thesis: '每一帧，都是时间的函数',
    formula: 'frame = render(t)',
    thesisB0: 10,
    thesisB1: 15.5,
    codeWallB0: 12.5,
    codeWallB1: 15.9,
  },
  grid: { big: '×30', small: '种画风，一支片', b0: 48, b1: 51 },
  drop: { n: '04', word: '电影', b0: 64, b1: 66 },
  tunnel: { line: '从一行字，到一整个宇宙', b0: 89, b1: 95.5 },
  wall: { title: 'AI-CODING · SUPERVIDEOS', sub: '28 部 · 全部由代码生成', b0: 97, b1: 104 },
  breath: [
    { big: '28 部片子。', small: '31 分钟 · 6.9 万帧', b0: 104.5, b1: 107.5 },
    { big: '没有一帧，是手动剪出来的。', small: '每一帧都由 render(t) 算出', b0: 107.5, b1: 110.5 },
    { big: '它们，是怎么做出来的？', small: '', b0: 110.5, b1: 114.5 },
  ],
  reveal: { chars: ['通', '通', '开', '源'], b: [116, 117, 118, 119], en: 'OPEN SOURCE · ALL OF IT', enB: 120, out: 124 },
  pillars: {
    b0: 124,
    b1: 128.6,
    items: [
      { head: '源码', en: 'SOURCE', num: 20, unit: '个工程包', sub: '+ 5 个可交互网页' },
      { head: '复盘', en: 'CoExp', num: 24, unit: '份经验文档', sub: '51 万字 · 每一个坑都写进去了' },
      { head: '成片', en: 'FILM', num: 28, unit: '部代码视频', sub: '2.39 GB · 31 分钟' },
    ],
  },
  card: { b0: 128, b1: 140, cta: '扫码，全部带走', note: '源码 · 复盘 · 成片 · 一个不留' },
  outro: {
    b0: 140,
    b1: 156,
    typeB0: 141,
    typeB1: 142.6,
    answerB: 143,
    answer: '下一部，由你来写。',
    creditsB: 146.5,
    credits: [
      '本片同样 100% 由代码生成',
      '画面 HTML + GSAP · render(t) 纯函数 ｜ 配乐 numpy 逐样本合成',
      'Claude Opus 5.5 · 2026 秋',
    ],
    fadeB0: 153,
  },
};

// ─── 音效 cue（score.py 按 kind 合成；gain 为线性增益）──────────────────────
function build() {
  const s = [];
  const add = (b, kind, o = {}) => s.push({ b, kind, ...o });
  // 冷开场：打字
  const cmd = TEXT.cold.command;
  for (let i = 0; i < cmd.length; i++) {
    add(TEXT.cold.typeB0 + (i * (TEXT.cold.typeB1 - TEXT.cold.typeB0)) / cmd.length, 'key', { gain: 0.5, seed: i });
  }
  add(TEXT.cold.typeB1 + 0.25, 'enter', { gain: 0.7 });
  add(5, 'swoosh', { gain: 0.35 });
  TEXT.cold.nos.forEach((n, i) => {
    add(n.b, 'thump', { gain: 0.85 });
    add(n.b + 0.5, 'strike', { gain: 0.45, seed: i });
  });
  add(10, 'boom', { gain: 0.6 });
  add(12.5, 'riser', { b1: 16, gain: 0.8 });
  add(16, 'revcym', { b1: 16, len: 2.4, gain: 0.5 });

  // 时代卡：冲击 + 曲线上升音
  for (const e of ERAS) {
    if (e.b0 === 62) continue;
    add(e.b0, 'impact', { gain: e.b0 === 16 ? 1.0 : 0.8 });
    add(e.b0, 'scan', { b1: e.b1, gain: 0.3 });
  }
  // 窗口入场
  for (const sh of SHOTS.filter((x) => x.type === 'win')) add(sh.b0, 'whoosh', { gain: 0.32, len: 0.35 });
  // 宫格倍增
  for (const st of GRID.steps) add(st.b, 'shutter', { gain: 0.55, n: st.n });
  add(48, 'impact', { gain: 0.55 });
  // 15 个世界 + 分屏：每拍快门
  for (const sh of SHOTS.filter((x) => x.type === 'full' && x.b0 >= 51 && x.b0 < 62)) add(sh.b0, 'shutter', { gain: 0.35 });
  add(59, 'swoosh', { gain: 0.4 });
  // ERA 04：曲线冲破天花板 → 半拍真空 → DROP
  add(58, 'riser', { b1: 63.5, gain: 1.0 });
  add(60, 'snareroll', { b1: 63.5, gain: 0.55 });
  add(62, 'scan', { b1: 63.5, gain: 0.4 });
  add(64, 'impact', { gain: 1.25 });
  add(64, 'crash', { gain: 0.8 });
  for (const sh of SHOTS.filter((x) => x.type === 'full' && x.b0 >= 66 && x.b0 < 80)) add(sh.b0, 'hit', { gain: 0.35, seed: sh.b0 });
  add(80, 'crash', { gain: 0.6 });
  for (let b = 80; b < 88; b += 2) add(b, 'swoosh', { gain: 0.45 });
  add(86, 'glitch', { gain: 0.4, len: 0.4 });
  // 隧道
  add(88, 'crash', { gain: 0.55 });
  add(88, 'tunnel', { b1: 96, gain: 0.55 });
  add(92, 'riser', { b1: 96, gain: 0.7 });
  // 巨墙
  add(96, 'impact', { gain: 1.0 });
  add(96, 'crash', { gain: 0.7 });
  add(100, 'snareroll', { b1: 104, gain: 0.7 });
  add(100, 'riser', { b1: 104, gain: 0.9 });
  // 骤停
  add(104, 'tapestop', { gain: 0.6 });
  [105, 106.2, 108.5, 109.7, 112, 113.2].forEach((b) => add(b, 'heart', { gain: 0.6 }));
  add(104.5, 'bell', { gain: 0.45, note: 62 });
  add(107.5, 'bell', { gain: 0.45, note: 65 });
  add(110.5, 'bell', { gain: 0.5, note: 69 });
  add(112, 'revswell', { b1: 116, gain: 0.9 });
  add(113, 'riser', { b1: 115.75, gain: 1.0 });
  // 通 通 开 源
  TEXT.reveal.b.forEach((b, i) => {
    add(b, 'megaimpact', { gain: 1.0 + i * 0.08, seed: i });
  });
  add(120, 'crash', { gain: 0.9 });
  add(124, 'swoosh', { gain: 0.5 });
  for (let i = 0; i < 3; i++) add(124 + i * 0.5, 'thump', { gain: 0.6 });
  // 卡片
  add(128, 'impact', { gain: 0.7 });
  add(128, 'suck', { b1: 131, gain: 0.55 });
  add(131, 'chime', { gain: 0.6 });
  add(133, 'scan', { b1: 135, gain: 0.35 });
  add(136, 'downlifter', { b1: 140, gain: 0.5 });
  // 尾声
  const cmd2 = TEXT.cold.command;
  for (let i = 0; i < cmd2.length; i++) {
    add(TEXT.outro.typeB0 + (i * (TEXT.outro.typeB1 - TEXT.outro.typeB0)) / cmd2.length, 'key', { gain: 0.45, seed: 40 + i });
  }
  add(TEXT.outro.typeB1 + 0.2, 'enter', { gain: 0.6 });
  add(TEXT.outro.answerB, 'bell', { gain: 0.55, note: 74 });
  add(TEXT.outro.answerB, 'boom', { gain: 0.4 });
  return s.sort((a, b) => a.b - b.b);
}
export const SFX = build();
