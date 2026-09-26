// ─────────────────────────────────────────────────────────────────────────────
//  EDL · 整支片子的"乐谱"（唯一真相源）— V2 · 300 拍 / 120 s / 4K·120fps
//
//  坐标系：一切以"拍"为单位。150 BPM → 1 拍 = 0.4 s。
//          帧整除表：24 帧/拍@60fps，48 帧/拍@120fps —— 任何档都零漂移。
//          1 小节 = 4 拍 = 1.6 s。全片 300 拍 = 75 小节 = 120.0 s。
//
//  画面（tools/build.mjs → index.html → src/runtime.js）
//  音乐（audio/score.py，读取 build/cues.json）
//  两边读的是同一份数据：画面切在哪一拍，鼓就落在哪一拍 —— 音画同源。
//
//  叙事（双波峰锯齿弧线）：
//    ACT 0  冷开场   b0–20    "没有 AE / 没有 PR / 没有剪辑软件" → frame = render(t) + 蓝图自绘
//    ACT 1  ERA 01   b20–34   KIMI   · 觉醒：字跟着鼓点砸下来（窗口开始堆叠）
//    ACT 2  ERA 02   b34–58   SWE    · 像素：不开浏览器，逐像素算（堆叠长高 + 抽帧量化）
//    ACT 3  ERA 03   b58–81   GPT    · 世界：宫格倍增 → 15 个世界每拍一切 → 横竖同框
//    ACT 4  ERA 04   b81–150  OPUS   · 电影：26 连拍 DROP → 斜切分屏 → 手机阵 → 隧道 → 巨墙定格
//    ACT 5  凝视     b150–166 音乐骤停。"28 部片子。6.9 万帧，没有一帧是手剪的。它们是怎么做出来的？"
//    ACT 6  解剖     b166–196 【新旗舰场景】左真实源码 / 右成片输出 —— 每一帧都是 render(t) 的输出 + 数据洪流
//    ACT 7  闪回     b196–206 28 部作品 × 半拍马拉松 —— 一部都不能少
//    ACT 8  通通开源 b206–232 四字砸屏（切片爆发式排版）→ 三柱（源码/复盘/成片）
//    ACT 9  闪传     b232–256 QQ 闪传卡片 + 二维码（长停 9.6s，留足扫码时间）
//    ACT 10 尾声     b256–300 回到终端：本片同样是 render(t) → 下一部，由你来写 → CRT 关机
// ─────────────────────────────────────────────────────────────────────────────

export const BPM = 150;
export const BEAT = 60 / BPM; // 0.4 s
export const FPS = 30;
export const TOTAL_BEATS = 300;
export const DURATION = TOTAL_BEATS * BEAT; // 120.0 s
export const T = (b) => +(b * BEAT).toFixed(4);

// ─── 段落（音乐编曲与画面场景共用）────────────────────────────────────────
export const SECTIONS = [
  { id: 'cold', b0: 0, b1: 20, energy: 0.12 },
  { id: 'era1', b0: 20, b1: 34, energy: 0.5 },
  { id: 'era2', b0: 34, b1: 58, energy: 0.62 },
  { id: 'era3', b0: 58, b1: 81, energy: 0.78 },
  { id: 'era4card', b0: 81, b1: 88, energy: 0.9 },
  { id: 'drop', b0: 88, b1: 114, energy: 1.0 },
  { id: 'splits', b0: 114, b1: 120, energy: 0.95 },
  { id: 'phones', b0: 120, b1: 124, energy: 0.9 },
  { id: 'tunnel', b0: 124, b1: 138, energy: 0.95 },
  { id: 'wall', b0: 138, b1: 150, energy: 1.0 },
  { id: 'breath', b0: 150, b1: 166, energy: 0.05 },
  { id: 'autopsy', b0: 166, b1: 196, energy: 0.55 },
  { id: 'marathon', b0: 196, b1: 206, energy: 0.92 },
  { id: 'reveal', b0: 206, b1: 222, energy: 1.0 },
  { id: 'pillars', b0: 222, b1: 232, energy: 0.7 },
  { id: 'card', b0: 232, b1: 256, energy: 0.6 },
  { id: 'outro', b0: 256, b1: 300, energy: 0.2 },
];

// ─── 时代卡 ────────────────────────────────────────────────────────────────
export const ERAS = [
  { n: '01', model: 'KIMI', title: '觉醒', sub: '让每一个字，都砸在鼓点上', b0: 20, b1: 23, node: 0 },
  { n: '02', model: 'SWE', title: '像素', sub: '不开浏览器，逐像素算出每一帧', b0: 34, b1: 37, node: 1 },
  { n: '03', model: 'GPT', title: '世界', sub: '一个模型，三十个世界', b0: 58, b1: 61, node: 2 },
  { n: '04', model: 'OPUS', title: '电影', sub: 'AE 级合成 · 水墨 · 3D · 4K', b0: 84, b1: 87.5, node: 3 },
];

// ─── 镜头表 ────────────────────────────────────────────────────────────────
//  type:
//   win    浮动窗口，在 3D 空间里一层层堆叠（ERA 01/02）
//   full   全屏英雄镜头
//   duoL / phoneR   左横屏 + 右手机竖屏
//   split  n 联斜切分屏（拉片感）；panel = 0..n-1
//   phone  竖屏作品放进手机框
//   pair   【新】解剖场景：左真实代码行 / 右成片输出（见 PAIRS）
//  in = 源片入点（秒），b0/b1 = 在本片中的起止拍
export const SHOTS = [
  // ERA 01 · KIMI —— 窗口开始堆叠（6 窗）
  { id: 'w01', type: 'win', work: 'kimi-beat', in: 1.9, b0: 23, b1: 25 },
  { id: 'w02', type: 'win', work: 'kimi-beat', in: 4.9, b0: 25, b1: 27 },
  { id: 'w03', type: 'win', work: 'kimi-beat', in: 23.62, b0: 27, b1: 29 },
  { id: 'w04', type: 'win', work: 'kimi-beat', in: 45.8, b0: 29, b1: 31 },
  { id: 'w05', type: 'win', work: 'kimi-beat', in: 12.0, b0: 31, b1: 33 },
  { id: 'w06', type: 'win', work: 'kimi-beat', in: 35.0, b0: 33, b1: 35 },
  // ERA 02 · SWE —— 堆叠继续长高（8 窗）
  { id: 'w07', type: 'win', work: 'ai-rise', in: 3.62, b0: 37, b1: 39 },
  { id: 'w08', type: 'win', work: 'ai-rise', in: 6.1, b0: 39, b1: 41 },
  { id: 'w09', type: 'win', work: 'kimi-film', in: 4.6, b0: 41, b1: 43 },
  { id: 'w10', type: 'win', work: 'kimi-film', in: 13.6, b0: 43, b1: 45 },
  { id: 'w11', type: 'win', work: 'ai-rise', in: 26.9, b0: 45, b1: 47 },
  { id: 'w12', type: 'win', work: 'kimi-film', in: 33.2, b0: 47, b1: 49 },
  { id: 'w13', type: 'win', work: 'ai-rise', in: 15.0, b0: 49, b1: 51 },
  { id: 'w14', type: 'win', work: 'kimi-film', in: 48.0, b0: 51, b1: 53 },

  // ERA 03 · GPT —— 15 个世界每拍一切（宫格在 b61–67 先倍增）
  { id: 'f01', type: 'full', work: 'beyond', in: 12.0, b0: 67, b1: 68, label: '15 个世界 · 体素岛' },
  { id: 'f02', type: 'full', work: 'beyond', in: 18.0, b0: 68, b1: 69, label: '15 个世界 · 黏土机器人' },
  { id: 'f03', type: 'full', work: 'beyond', in: 30.0, b0: 69, b1: 70, label: '15 个世界 · 发条城' },
  { id: 'f04', type: 'full', work: 'beyond', in: 48.0, b0: 70, b1: 71, label: '15 个世界 · 波普网点' },
  { id: 'f05', type: 'full', work: 'beyond', in: 60.0, b0: 71, b1: 72, label: '15 个世界 · 浮世绘' },
  { id: 'f06', type: 'full', work: 'beyond', in: 84.0, b0: 72, b1: 73, label: '15 个世界 · 霓虹' },
  { id: 'f07', type: 'full', work: 'beyond', in: 96.0, b0: 73, b1: 74, label: '15 个世界 · 铬金属' },
  { id: 'f08', type: 'full', work: 'beyond', in: 102.0, b0: 74, b1: 75, label: '15 个世界 · 粒子' },
  { id: 'f09', type: 'full', work: 'gpt-autumn', in: 6.0, b0: 75, b1: 77, label: '铅笔线描 → 水墨 → 雕刻' },
  { id: 'duoA', type: 'duoL', work: 'gpt-autumn', in: 20.5, b0: 77, b1: 81 },
  { id: 'duoB', type: 'phoneR', work: 'moon-letter', in: 15.0, b0: 77, b1: 81 },

  // ERA 04 · OPUS —— DROP：每拍一切，26 连发（18 部作品各一镜 + 8 镜返场）
  { id: 'd01', type: 'full', work: 'f12', in: 20.8, b0: 88, b1: 89, label: 'Console · 故障字' },
  { id: 'd02', type: 'full', work: 'phasegate', in: 13.0, b0: 89, b1: 90, label: '升维 · 曲速' },
  { id: 'd03', type: 'full', work: 'yusheng', in: 6.5, b0: 90, b1: 91, label: '每一拍一个动作' },
  { id: 'd04', type: 'full', work: 'xuanlan', in: 24.0, b0: 91, b1: 92, label: '浏览器三十年' },
  { id: 'd05', type: 'full', work: 'shuchenglin', in: 38.0, b0: 92, b1: 93, label: '去色信息流' },
  { id: 'd06', type: 'full', work: 'studysolo', in: 15.5, b0: 93, b1: 94, label: '过去|现在 分屏' },
  { id: 'd07', type: 'full', work: 'samemoon', in: 64.0, b0: 94, b1: 95, label: '单文件 854 行' },
  { id: 'd08', type: 'full', work: 'stopmotion', in: 53.0, b0: 95, b1: 96, label: '定格动画 Skill' },
  { id: 'd09', type: 'full', work: 'gongcishi', in: 160.0, b0: 96, b1: 97, label: '217 份真实素材' },
  { id: 'd10', type: 'full', work: 'codecosmos', in: 10.0, b0: 97, b1: 98, label: '4D 超立方体' },
  { id: 'd11', type: 'full', work: 'hust1037', in: 104.0, b0: 98, b1: 99, label: '几百只小手连成山脊' },
  { id: 'd12', type: 'full', work: 'claude15', in: 50.5, b0: 99, b1: 100, label: '15 种画风 · 体素' },
  { id: 'd13', type: 'full', work: 'ageint', in: 36.6, b0: 100, b1: 101, label: '注意力机制 · 3D' },
  { id: 'd14', type: 'full', work: 'skillshub', in: 19.8, b0: 101, b1: 102, label: 'Logo 冲击出场' },
  { id: 'd15', type: 'full', work: 'dingge', in: 34.6, b0: 102, b1: 103, label: 'Three.js 定格 · 慢动作坠落' },
  { id: 'd16', type: 'full', work: 'shatter', in: 3.0, b0: 103, b1: 104, label: '自写 3D 合成器 · Voronoi 碎裂' },
  { id: 'd17', type: 'full', work: 'oneink', in: 4.6, b0: 104, b1: 105, label: '「永」字八法 · 按笔顺书写' },
  { id: 'd18', type: 'full', work: 'protocom', in: 47.0, b0: 105, b1: 106, label: '4K 60fps 定版' },
  // 返场 · 重锤六连
  { id: 'd19', type: 'full', work: 'shatter', in: 12.0, b0: 106, b1: 107, label: 'MoGraph 魔方墙 · 336 立方体' },
  { id: 'd20', type: 'full', work: 'codecosmos', in: 33.0, b0: 107, b1: 108, label: '一拍二 · 定格语法' },
  { id: 'd21', type: 'full', work: 'oneink', in: 50.0, b0: 108, b1: 109, label: '逆锋压笔 · 泼墨一笔' },
  { id: 'd22', type: 'full', work: 'protocom', in: 75.4, b0: 109, b1: 110, label: '升维 · 字面意义' },
  { id: 'd23', type: 'full', work: 'dingge', in: 77.4, b0: 110, b1: 111, label: '2560×1440 · 60fps' },
  { id: 'd24', type: 'full', work: 'ageint', in: 60.0, b0: 111, b1: 112, label: '4170 行 Python' },
  { id: 'd25', type: 'full', work: 'phasegate', in: 26.5, b0: 112, b1: 113, label: '静默门 · 确认↵' },
  { id: 'd26', type: 'full', work: 'skillshub', in: 47.5, b0: 113, b1: 114, label: '顺手写了套前端' },

  // 拉片 · 斜切分屏（whip 链）
  { id: 's1a', type: 'split', n: 2, panel: 0, work: 'xuanlan', in: 24.0, b0: 114, b1: 116 },
  { id: 's1b', type: 'split', n: 2, panel: 1, work: 'studysolo', in: 15.5, b0: 114, b1: 116 },
  { id: 's2a', type: 'split', n: 3, panel: 0, work: 'yusheng', in: 6.5, b0: 116, b1: 118 },
  { id: 's2b', type: 'split', n: 3, panel: 1, work: 'shuchenglin', in: 38.0, b0: 116, b1: 118 },
  { id: 's2c', type: 'split', n: 3, panel: 2, work: 'protocom', in: 47.0, b0: 116, b1: 118 },
  { id: 's3a', type: 'split', n: 4, panel: 0, work: 'stopmotion', in: 53.0, b0: 118, b1: 120 },
  { id: 's3b', type: 'split', n: 4, panel: 1, work: 'codecosmos', in: 33.0, b0: 118, b1: 120 },
  { id: 's3c', type: 'split', n: 4, panel: 2, work: 'gongcishi', in: 160.0, b0: 118, b1: 120 },
  { id: 's3d', type: 'split', n: 4, panel: 3, work: 'samemoon', in: 64.0, b0: 118, b1: 120 },

  // 竖屏手机阵
  { id: 'p1', type: 'phone', panel: 0, work: 'readclub', in: 25.0, b0: 120, b1: 124 },
  { id: 'p2', type: 'phone', panel: 1, work: 'senpai', in: 21.5, b0: 120, b1: 124 },
  { id: 'p3', type: 'phone', panel: 2, work: 'moonlamp', in: 8.6, b0: 120, b1: 124 },

  // 【新】解剖场景：左 = 该项目真实源码行，右 = 成片输出（代码↔画面对位）
  { id: 'a0', type: 'pair', work: 'oneink', in: 49.8, b0: 170, b1: 175.5 },
  { id: 'a1', type: 'pair', work: 'codecosmos', in: 10.0, b0: 175.5, b1: 181 },
  { id: 'a2', type: 'pair', work: 'ageint', in: 36.6, b0: 181, b1: 186.5 },
  { id: 'a3', type: 'pair', work: 'skillshub', in: 19.8, b0: 186.5, b1: 192 },
];

// 窗口一旦出现就一直播放到堆叠结束（后排窗口仍然是"活"的），其余镜头播放 b0→b1
export const STACK_END = 58;
export const clipSpan = (s) => ({ b0: s.b0, b1: s.type === 'win' ? STACK_END : s.b1 });

// 解剖场景：每一"对"的真实代码行（src 指到合集源码包里的文件，Ctrl+F 可查）
export const PAIRS = [
  {
    shot: 'a0', work: 'oneink', title: '一畫', tech: '水墨书法 · 手卷一镜到底',
    lines: [
      { src: 'opus-oneink/main.js', line: 'const W = 1920, H = 1080, FPS = 30;' },
      { src: 'opus-oneink/main.js', line: 'let rnd = mulberry32(20260926);' },
      { src: 'opus-oneink/main.js', line: 'const easeIO = t => t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t);' },
      { src: 'opus-oneink/render.js', line: "const url = await p.evaluate(f => { window.renderFrame(f); return document.getElementById('gl').toDataURL('image/jpeg', 0.95); }, f);" },
    ],
  },
  {
    shot: 'a1', work: 'codecosmos', title: '代码宇宙', tech: '27 种代码风格 · 2D→4D',
    lines: [
      { src: 'opus-universe-history-video/web/engine.js', line: "export const ACC = { '2D': '#00E5FF', '2.5D': '#FFD600', '3D': '#FF3D7F', '4D': '#B388FF' };" },
      { src: 'opus-universe-history-video/web/engine.js', line: 'const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true, alpha: false });' },
      { src: 'opus-universe-history-video/music.py', line: 'SR = 44100; BPM = 120; BEAT = 60 / BPM; DUR = 68.0' },
    ],
  },
  {
    shot: 'a2', work: 'ageint', title: '智能时代', tech: '108 镜 · 4170 行 Python',
    lines: [
      { src: 'opus-age-of-intelligence/src/timeline.py', line: 'BPM = 60.0 * FPS / FPB        # 128.5714' },
      { src: 'opus-age-of-intelligence/src/timeline.py', line: 'N_FRAMES = END_BEAT * FPB     # 5544 frames = 92.4 s' },
      { src: 'opus-age-of-intelligence/src/timeline.py', line: "shot(184, END_BEAT, 'end_card')" },
    ],
  },
  {
    shot: 'a3', work: 'skillshub', title: 'Skills Hub', tech: '顺手从零写一套前端来拍',
    lines: [
      { src: 'opus-production-video-skill-hub/src/js/engine.js', line: 'export const prog = (b, b0, b1, ease = E.linear) => ease(clamp((b - b0) / (b1 - b0)));' },
      { src: 'opus-production-video-skill-hub/src/js/engine.js', line: 'export function hit(b, at, decay = 0.35) {' },
      { src: 'opus-production-video-skill-hub/render.mjs', line: '"-f", "image2pipe", "-framerate", String(fps), "-i", "-",' },
    ],
  },
];

// COSMOS 30 风格倍增：1 → 4 → 9 → 16 格，每格是 COSMOS 的不同一镜（每镜 2.4 s）
export const GRID = {
  work: 'cosmos30',
  b0: 61,
  b1: 67,
  steps: [ // 第几拍出现几格
    { b: 61, n: 1 },
    { b: 62, n: 4 },
    { b: 63, n: 9 },
    { b: 64, n: 16 },
  ],
  // COSMOS 30 镜里挑 16 镜（镜号 0..29），入点 = 镜号 × 2.4 s
  shots: [9, 1, 7, 19, 3, 12, 15, 26, 5, 22, 10, 17, 28, 2, 13, 24],
  shotLen: 2.4,
};

// 28 宫格巨墙：7 × 4，每格用 catalog 里的 wallIn 入点；末段齐拍定格成"照片卡"
export const WALL = { b0: 138, b1: 150, cols: 7, rows: 4, clipLen: 4.4, freezeAt: 148 };
// 隧道：28 张海报贴在四壁，摄像机加速前冲（速度坡）
export const TUNNEL = { b0: 124, b1: 138 };
// 马拉松闪回：28 部 × 半拍，海报带横扫
export const MARATHON = { b0: 196, b1: 206, per: 0.5 };

// ─── 文字 cue（全部文字都在这里，改文案只改这一处）─────────────────────────
export const TEXT = {
  cold: {
    prompt: '$ ',
    command: 'render(t)',
    boot: ['> mount AI-Coding-SuperVideos', '> 28 modules · 2.39 GB', '> ok'],
    bootB0: 0.3,
    typeB0: 2.6,
    typeB1: 5.0,
    nos: [
      { text: '没有 AE', b: 7 },
      { text: '没有 PR', b: 8 },
      { text: '没有剪辑软件', b: 9 },
    ],
    nosOut: 11,
    thesis: '每一帧，都是时间的函数',
    formula: 'frame = render(t)',
    thesisB0: 11,
    thesisB1: 18.5,
    // 蓝图自绘：把公式当工程图画出来
    blueprintB0: 13.5,
    blueprintB1: 18,
    codeWallB0: 14.5,
    codeWallB1: 19.9,
  },
  grid: { big: '×30', small: '种画风，一支片', b0: 64, b1: 67 },
  drop: { n: '04', word: '电影', b0: 88, b1: 90 },
  tunnel: { line: '从一行字，到一整个宇宙', b0: 126, b1: 137 },
  wall: { title: 'AI-CODING · SUPERVIDEOS', sub: '28 部 · 全部由代码生成', b0: 140, b1: 150 },
  breath: [
    { big: '28 部片子。', small: '31 分钟 · 6.9 万帧', b0: 151, b1: 155.5 },
    { big: '没有一帧，是手动剪出来的。', small: '每一帧都由 render(t) 算出', b0: 155.5, b1: 160 },
    { big: '它们，是怎么做出来的？', small: '', b0: 160, b1: 164.5 },
  ],
  autopsy: {
    title: '拆给你看',
    sub: '左边 = 真实源码行 · 右边 = 它的输出',
    b0: 166, b1: 170,
    statsB0: 190, statsB1: 196,
    stats: [
      { num: 69000, label: '帧 · 全部算出来', suffix: '+' },
      { num: 515858, label: '字复盘文档', suffix: '' },
      { num: 28, label: '部成片', suffix: '' },
    ],
    tail: '每一帧 = render(t) 的输出',
  },
  marathon: { title: '28 部 · 一部都不能少', b0: 196, b1: 206 },
  reveal: { chars: ['通', '通', '开', '源'], b: [206, 207, 208, 209], en: 'OPEN SOURCE · ALL OF IT', enB: 210, out: 216 },
  pillars: {
    b0: 222,
    b1: 231.5,
    items: [
      { head: '源码', en: 'SOURCE', num: 20, unit: '个工程包', sub: '+ 5 个可交互网页' },
      { head: '复盘', en: 'CoExp', num: 24, unit: '份经验文档', sub: '51 万字 · 每一个坑都写进去了' },
      { head: '成片', en: 'FILM', num: 28, unit: '部代码视频', sub: '2.39 GB · 31 分钟' },
    ],
  },
  card: { b0: 232, b1: 256, cta: '扫码，全部带走', note: '源码 · 复盘 · 成片 · 一个不留' },
  outro: {
    b0: 256,
    b1: 300,
    typeB0: 258,
    typeB1: 259.6,
    self: '> rendering self · 14400/14400',
    selfB: 260.4,
    answerB: 263,
    answer: '下一部，由你来写。',
    creditsB: 266,
    credits: [
      '本片同样 100% 由代码生成',
      '画面 HTML + GSAP · render(t) 纯函数 ｜ 配乐 numpy 逐样本合成',
      'Claude Opus 5.5 · 2026 秋',
    ],
    crtB0: 295,
    fadeB0: 293,
  },
};

// ─── 音效 cue（score.py 按 kind 合成；gain 为线性增益）──────────────────────
//  机械 foley 主题：打字机当踩镲、风扇起转当 riser、调制解调器握手当"连接"stinger
function build() {
  const s = [];
  const add = (b, kind, o = {}) => s.push({ b, kind, ...o });
  // 冷开场：boot + 打字
  add(TEXT.cold.bootB0, 'boot', { gain: 0.4 });
  [1.1, 1.9].forEach((b) => add(b, 'tick', { gain: 0.4 }));
  const cmd = TEXT.cold.command;
  for (let i = 0; i < cmd.length; i++) {
    add(TEXT.cold.typeB0 + (i * (TEXT.cold.typeB1 - TEXT.cold.typeB0)) / cmd.length, 'key', { gain: 0.5, seed: i });
  }
  add(TEXT.cold.typeB1 + 0.25, 'enter', { gain: 0.7 });
  add(6, 'swoosh', { gain: 0.35 });
  TEXT.cold.nos.forEach((n, i) => {
    add(n.b, 'thump', { gain: 0.85 });
    add(n.b + 0.5, 'strike', { gain: 0.45, seed: i });
  });
  add(11, 'boom', { gain: 0.6 });
  add(TEXT.cold.blueprintB0, 'drafting', { b1: TEXT.cold.blueprintB1, gain: 0.3 }); // 蓝图铅笔沙沙
  add(17, 'riser', { b1: 20, gain: 0.8 });
  add(20, 'revcym', { b1: 20, len: 2.4, gain: 0.5 });

  // 时代卡：冲击 + 曲线上升音
  for (const e of ERAS) {
    if (e.b0 === 84) continue;
    add(e.b0, 'impact', { gain: e.b0 === 20 ? 1.0 : 0.8 });
    add(e.b0, 'scan', { b1: e.b1, gain: 0.3 });
  }
  // 窗口入场
  for (const sh of SHOTS.filter((x) => x.type === 'win')) add(sh.b0, 'whoosh', { gain: 0.32, len: 0.35 });
  // SWE 段像素量化：tick-tock 脉冲
  for (let b = 46; b < 58; b += 2) add(b, 'tick', { gain: 0.3 + 0.2 * (b - 46) / 12 });
  // 宫格倍增
  for (const st of GRID.steps) add(st.b, 'shutter', { gain: 0.55, n: st.n });
  add(64, 'impact', { gain: 0.55 });
  // 15 个世界：每拍快门
  for (const sh of SHOTS.filter((x) => x.id.startsWith('f'))) add(sh.b0, 'shutter', { gain: 0.35 });
  add(75, 'swoosh', { gain: 0.4 });
  // ERA 04：riser → 半拍真空 → DROP
  add(81, 'riser', { b1: 87.5, gain: 1.0 });
  add(83, 'snareroll', { b1: 87.5, gain: 0.55 });
  add(84, 'scan', { b1: 87.5, gain: 0.4 });
  add(88, 'impact', { gain: 1.25 });
  add(88, 'crash', { gain: 0.8 });
  for (const sh of SHOTS.filter((x) => x.id.startsWith('d'))) add(sh.b0, 'hit', { gain: 0.35, seed: sh.b0 });
  // whip 链
  add(114, 'crash', { gain: 0.6 });
  for (let b = 114; b < 124; b += 2) add(b, 'swoosh', { gain: 0.45 });
  add(122, 'glitch', { gain: 0.4, len: 0.4 });
  // 隧道（速度坡）
  add(124, 'crash', { gain: 0.55 });
  add(124, 'tunnel', { b1: 138, gain: 0.55 });
  add(132, 'riser', { b1: 138, gain: 0.7 });
  // 巨墙 + 定格快门
  add(138, 'impact', { gain: 1.0 });
  add(138, 'crash', { gain: 0.7 });
  add(144, 'snareroll', { b1: 148, gain: 0.7 });
  add(144, 'riser', { b1: 148, gain: 0.9 });
  add(148, 'shutter', { gain: 0.9, n: 28 }); // 28 格定格卡：齐拍快门
  // 骤停
  add(150, 'tapestop', { gain: 0.6 });
  [151, 152.2, 154.5, 155.7, 158, 159.2, 162, 163.2].forEach((b) => add(b, 'heart', { gain: 0.6 }));
  add(151, 'bell', { gain: 0.45, note: 62 });
  add(155.5, 'bell', { gain: 0.45, note: 65 });
  add(160, 'bell', { gain: 0.5, note: 69 });
  add(162, 'revswell', { b1: 166, gain: 0.9 });
  add(163, 'riser', { b1: 165.75, gain: 1.0 });
  // 解剖：机械音床
  add(166, 'impact', { gain: 0.8 });
  for (const sh of SHOTS.filter((x) => x.type === 'pair')) add(sh.b0, 'swoosh', { gain: 0.4 });
  for (let b = 170; b < 192; b += 4) add(b, 'tick', { gain: 0.25 });
  add(190, 'riser', { b1: 196, gain: 0.7 });
  // 马拉松：半拍快门连打
  for (let b = 196; b < 206; b += 1) add(b, 'hit', { gain: 0.3, seed: b });
  add(200, 'snareroll', { b1: 205.5, gain: 0.5 });
  add(204, 'riser', { b1: 205.75, gain: 0.9 });
  // 通 通 开 源
  TEXT.reveal.b.forEach((b, i) => {
    add(b, 'megaimpact', { gain: 1.0 + i * 0.08, seed: i });
  });
  add(210, 'crash', { gain: 0.9 });
  add(216, 'swoosh', { gain: 0.5 });
  for (let i = 0; i < 3; i++) add(222 + i * 0.5, 'thump', { gain: 0.6 });
  // 卡片：吸入 + 调制解调器握手（"连接"stinger）+ 长停呼吸
  add(232, 'impact', { gain: 0.7 });
  add(232, 'suck', { b1: 235, gain: 0.55 });
  add(235, 'chime', { gain: 0.6 });
  add(237, 'modem', { gain: 0.4 });
  add(237, 'scan', { b1: 239, gain: 0.35 });
  add(248, 'downlifter', { b1: 254, gain: 0.5 });
  // 尾声
  const cmd2 = TEXT.cold.command;
  for (let i = 0; i < cmd2.length; i++) {
    add(TEXT.outro.typeB0 + (i * (TEXT.outro.typeB1 - TEXT.outro.typeB0)) / cmd2.length, 'key', { gain: 0.45, seed: 40 + i });
  }
  add(TEXT.outro.typeB1 + 0.2, 'enter', { gain: 0.6 });
  add(TEXT.outro.selfB, 'tick', { gain: 0.4 });
  add(TEXT.outro.answerB, 'bell', { gain: 0.55, note: 74 });
  add(TEXT.outro.answerB, 'boom', { gain: 0.4 });
  add(TEXT.outro.crtB0, 'crtoff', { gain: 0.5 });
  return s.sort((a, b) => a.b - b.b);
}
export const SFX = build();
