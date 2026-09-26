// ─────────────────────────────────────────────────────────────────────────────
//  CATALOG · 合集里的 28 部代码视频（唯一真相源之一）
//
//  - folder/file：相对仓库根目录（AI-Coding-SuperVideos/）的真实路径
//  - model：文件夹前缀即"是哪个模型写的"，决定它属于哪个时代（ERA）
//  - wallIn：这部片子最有代表性的 1 秒从哪里开始（秒）。用于"28 宫格巨墙"和海报。
//            数值来自对每部成片 20 格联系表的逐格审片（_survey/sheet_XX.jpg），
//            误差约 ±1s —— 下一位 AI 验收时请对照 build/contact-*.jpg 微调。
//  - spec：成片真实规格（ffprobe 实测）
//  - tech：一句话技术亮点（来自各自 CoExp 复盘文档）
// ─────────────────────────────────────────────────────────────────────────────

export const MODELS = {
  KIMI: { label: 'KIMI', color: '#3CF0C8', era: 1 },
  SWE: { label: 'SWE', color: '#7CC4FF', era: 2 },
  GPT: { label: 'GPT', color: '#A98BFF', era: 3 },
  OPUS: { label: 'CLAUDE OPUS', color: '#FF7A3D', era: 4 },
  SKILL: { label: 'SKILL', color: '#FFD166', era: 4 },
};

// 顺序 = 底部时间尺上 28 个槽位的顺序（按时代排）
export const WORKS = [
  // ── ERA 01 · KIMI ─────────────────────────────────────────────
  { key: 'kimi-beat', folder: 'kimi-ai-beat-sync', file: 'ai-beat-sync.mp4',
    title: 'AI 觉醒', model: 'KIMI', spec: '1080p · 30fps · 51s',
    tech: 'HyperFrames + GSAP · 全曲节拍分析卡点', wallIn: 27.6 },

  // ── ERA 02 · SWE ──────────────────────────────────────────────
  { key: 'ai-rise', folder: 'swe-ai-rise', file: 'kimi_ai_rise_v2.mp4',
    title: 'AI:RISE', model: 'SWE', spec: '1080p · 30fps · 40s',
    tech: 'renderAt(t) 纯函数 · 129.2 BPM 帧级锁拍', wallIn: 3.6 },
  { key: 'kimi-film', folder: 'swe-kimi-source-intro', file: 'kimi_film_1080p.mp4',
    title: '月之暗面 · KIMI', model: 'SWE', spec: '1080p · 30fps · 56s',
    tech: 'numpy 逐像素渲染 · 六幕六种 BPM', wallIn: 33.4 },

  // ── ERA 03 · GPT ──────────────────────────────────────────────
  { key: 'cosmos30', folder: 'gpt-universe-30-change', file: 'COSMOS_30_STYLES_72s_1080p.mp4',
    title: 'COSMOS · 从未知到寂静', model: 'GPT', spec: '1080p · 30fps · 72s',
    tech: '无头 OpenGL · 30 种画风 · 200 BPM', wallIn: 36.2 },
  { key: 'beyond', folder: 'gpt-15-style-ai-beyond-generation', file: 'AI_BEYOND_GENERATION_1080p.mp4',
    title: 'AI · Beyond Generation', model: 'GPT', spec: '1080p · 30fps · 120s',
    tech: 'Python + 原生 GL · 15 个世界', wallIn: 12.0 },
  { key: 'gpt-autumn', folder: 'gpt-mid-autumn-general-video', file: 'gpt-MidAutumn_Final_60s_1080p60.mp4',
    title: '把日子，慢慢过圆', model: 'GPT', spec: '1080p · 60fps · 60s',
    tech: '21 镜 · 每个时代换一种材质', wallIn: 21.0 },
  { key: 'moon-letter', folder: 'gpt-mid-autumn-for-my-dg03', file: 'Moon_Letter_MidAutumn_1080p.mp4',
    title: '月光信笺', model: 'GPT', spec: '竖屏 1080×1920 · 29s',
    tech: '竖屏 · 可交互 HTML 同源', wallIn: 16.0, vertical: true },

  // ── ERA 04 · CLAUDE OPUS ─────────────────────────────────────
  { key: 'shatter', folder: 'opus-broken-reround', file: '碎月重圆_MG动画.mp4',
    title: '碎月重圆', model: 'OPUS', spec: '1080p · 30fps · 30s',
    tech: '自写 3D 合成器 · 23 万粒子 · 抠像拆层', wallIn: 3.0 },
  { key: 'oneink', folder: 'opus-oneink', file: '一畫_Opus5.5_水墨书法.mp4',
    title: '一畫', model: 'OPUS', spec: '1080p · 30fps · 60s',
    tech: '水墨书法 · 手卷一镜到底 · 泼墨诗云', wallIn: 49.8 },
  { key: 'dingge', folder: 'opus-factory-safety-videos', file: 'dingge_1440p60fps.mp4',
    title: '定格', model: 'OPUS', spec: '1440p · 60fps · 87s',
    tech: 'Three.js 定格动画 · 瑞士奶酪模型', wallIn: 12.5 },
  { key: 'claude15', folder: 'opus-claude-intro-with-15-way', file: 'Claude_自我介绍_15种画风.mp4',
    title: 'Claude 自我介绍 · 15 种画风', model: 'OPUS', spec: '1080p · 30fps · 114s',
    tech: '15 种画风 · 一条叙事线', wallIn: 50.0 },
  { key: 'protocom', folder: 'opus-production-video-protocom-intro', file: 'protocom-intro.mp4',
    title: 'protocom', model: 'OPUS', spec: '4K · 60fps · 80s',
    tech: '4K 60fps · 用画风变化叙事', wallIn: 47.0 },
  { key: 'codecosmos', folder: 'opus-universe-history-video', file: 'code_cosmos_stopmotion.mp4',
    title: '代码宇宙', model: 'OPUS', spec: '1080p · 24fps · 68s',
    tech: '27 种代码风格 · 2D→4D · 一拍二定格', wallIn: 33.0 },
  { key: 'phasegate', folder: 'opus-production-video-ai-phase-skill', file: 'ai-phase-skill-intro.mp4',
    title: 'Phase-Gate 升维', model: 'OPUS', spec: '1080p · 60fps · 30s',
    tech: '手绘 → 矢量 → 扁平 → 黏土 → 写实', wallIn: 13.0 },
  { key: 'ageint', folder: 'opus-age-of-intelligence', file: 'AGE_OF_INTELLIGENCE_720p60_share.mp4',
    title: '智能时代', model: 'OPUS', spec: '60fps · 92s · 108 镜',
    tech: '108 镜 · 4170 行 Python · 双 drop', wallIn: 36.5 },
  { key: 'skillshub', folder: 'opus-production-video-skill-hub', file: 'skills-hub-promo.mp4',
    title: 'Skills Hub', model: 'OPUS', spec: '1080p · 60fps · 57s',
    tech: '114 拍 · 顺手从零写一套前端来拍', wallIn: 47.5 },
  { key: 'f12', folder: 'opus-F12-teaching', file: 'DevTools-in-60-Seconds-1080p.mp4',
    title: 'DevTools in 60 Seconds', model: 'OPUS', spec: '1080p · 30fps · 60s',
    tech: '128 BPM · 32 小节 · 附可交互仿真浏览器', wallIn: 35.5 },
  { key: 'hust1037', folder: 'opus-1037-hust-story', file: '1037_MG试片.mp4',
    title: '1037', model: 'OPUS', spec: '1080p · 30fps · 110s',
    tech: '一个符号讲完一所大学', wallIn: 104.0 },
  { key: 'xuanlan', folder: 'opus-introduction-video-xuanlan', file: 'XuanLan-PocketWebShell-promo-1080p60-share.mp4',
    title: '玄览 PocketWebShell', model: 'OPUS', spec: '1080p · 60fps · 55s',
    tech: '32 分钟写完 · 浏览器三十年进化史', wallIn: 24.0 },
  { key: 'studysolo', folder: 'opus-production-video-studysolo', file: 'studysolo-promo -v1.1.mp4',
    title: 'StudySolo', model: 'OPUS', spec: '1080p · 60fps · 60s',
    tech: '真实 Agent 页面 · 过去|现在 分屏', wallIn: 15.5 },
  { key: 'yusheng', folder: 'opus-production-video-ys-blog', file: 'yusheng-blog.mp4',
    title: '羽升集', model: 'OPUS', spec: '1080p · 60fps · 30s',
    tech: '每一拍一个可见动作', wallIn: 6.5 },
  { key: 'shuchenglin', folder: 'opus-shuchenglin-into', file: '树成林宣传片_60s.mp4',
    title: '树成林', model: 'OPUS', spec: '1080p · 30fps · 60s',
    tech: '虚拟时间逐帧录屏 · 卡点靠坐标', wallIn: 38.0 },
  { key: 'stopmotion', folder: 'skill-方块系列定格动画', file: 'stop-motion-3d-intro-web.mp4',
    title: '方块定格 Skill', model: 'SKILL', spec: '720p · 24fps · 60s',
    tech: '搭一次世界，拍任何画风', wallIn: 53.0 },
  { key: 'samemoon', folder: 'opus-mid-autumn-genergal-videos', file: 'mid-autumn.mp4',
    title: '同一个月亮', model: 'OPUS', spec: '1080p · 30fps · 120s',
    tech: '单文件 854 行 · Canvas + Web Audio', wallIn: 64.0 },
  { key: 'gongcishi', folder: 'opus-mid-autumn-highschool-videos', file: '共此时_预览版_720p.mp4',
    title: '共此时', model: 'OPUS', spec: '180s · 217 份真实素材',
    tech: '三年照片 · 机器看片 + 人工看片', wallIn: 160.0 },
  { key: 'moonlamp', folder: 'opus-mid-autumn-for-my-dg02', file: '月光替你亮着灯_学姐中秋快乐.mp4',
    title: '月光替你亮着灯', model: 'OPUS', spec: '1080p · 24fps · 28s',
    tech: '真 3D 一镜到底 · 月夜水彩', wallIn: 9.0 },
  { key: 'readclub', folder: 'opus-hust-read-join-video-v1', file: '华中大读书会_慢下来.mp4',
    title: '慢下来', model: 'OPUS', spec: '竖屏 1080×1920 · 37s',
    tech: '一个 HTML 同时生成画面和音乐', wallIn: 26.0, vertical: true },
  { key: 'senpai', folder: 'opus-mid-autumn-for-my-dg01', file: '中秋·给学姐.mp4',
    title: '中秋 · 给学姐', model: 'OPUS', spec: '竖屏 1080×1920 · 29s',
    tech: 'render(t) 纯函数 · 局部重渲', wallIn: 22.0, vertical: true },
];

export const byKey = Object.fromEntries(WORKS.map((w, i) => [w.key, { ...w, slot: i }]));

// ─── 合集真实统计（2026-09-26 在仓库上实测，勿凭空修改）─────────────────
//   mp4 成片 28 部，合计 2.39 GB，总时长 1876.8 s（≈31 分钟），合计约 69,000 帧
//   CoExp 复盘 24 份，515,858 字符（其中汉字 173,359 个）
//   源码包（zip / tgz / skill）20 个；可交互 HTML 5 个
export const STATS = {
  films: 28,
  coexp: 24,
  coexpChars: 515858,
  packages: 20,
  htmls: 5,
  minutes: 31,
  frames: 69000,
  sizeGB: '2.39',
};

// ─── 下载方式（来自用户提供的 QQ 闪传截图）──────────────────────────────
export const SHARE = {
  name: 'AI-Coding-SuperVideos',
  size: '2.39 GB',
  service: 'QQ 闪传',
  url: 'qfile.qq.com/q/P2tSnByK4K',
  expire: '2026/10/10 05:25 到期',
  qr: 'assets/img/qr.png',
};
