// Everything on screen that is a fact comes from the protocom member pages,
// the Tokens leaderboard, and the 共建手册 v0.1. Nothing here is invented.
export const BRAND = 'Protocom';
export const BRAND_CN = '青禾·元野';
export const TAGLINE = 'AI 时代的学生创造共同体';
export const SCHOOL = 'NCC';

export const MEMBERS = [
  { id: 'mio', name: 'KinomotoMio', handle: '@mio', real: '万祚全', role: '构建者', img: 'mio_big', line: '31.1B Tokens · 连续 102 天', joined: '武汉 · Asia/Shanghai' },
  { id: 'yusheng', name: '羽升', handle: '@yusheng', real: '孔德羽', role: '同路人', img: 'yusheng', line: '羽化成蝶 升生不息', joined: '7.1B Tokens · 154 天活跃' },
  { id: 'daniel', name: 'Daniel', handle: '@daniel', real: '刘磐', role: '同路人', img: 'daniel_big', line: '24.0B Tokens · 单日峰值 2.1B', joined: '武汉市' },
  { id: 'genshin', name: 'Gazerrr', handle: '@genshin', real: '董奇志', role: '同路人', img: 'genshin_big', line: '咕咕嘎嘎（拉长）', joined: '13.8B Tokens · 178 天活跃' },
  { id: 'elena', name: 'Elena', handle: '@elena', real: '杨明鑫', role: '同路人', img: 'elena' },
  { id: 'torchbearer127', name: '执炬人', handle: '@torchbearer127', real: '王创锐', role: '同路人', img: 'torchbearer127' },
  { id: 'whosxws', name: 'Whosxws', handle: '@whosxws', real: 'Wish King', role: '同路人', img: 'whosxws' },
  { id: 'compass', name: '司南', handle: '@compass', real: '彭司南', role: '同路人', mono: '司' },
  { id: 'why', name: 'why', handle: '@why', real: '王鸿宇', role: '同路人', mono: 'w' },
  { id: 'wzx', name: '王梓鑫', handle: '@wzx', real: '', role: '同路人', mono: '王' },
  { id: 'xlcy', name: '小ye', handle: '@xlcy', real: '范择', role: '同路人', mono: '小' },
];

// Tokens · 公开排行榜: 4 participants, 76.0B public tokens.
export const TOKENS = [
  { id: 'mio', name: 'KinomotoMio', handle: '@mio', value: 31.1, days: 246, peak: '1.0B', streak: 102, img: 'mio_big',
    bars: [0.8, 0.78, 1.0, 0.3, 0.93, 0.62, 0.23, 0.03, 0.12, 0.12, 0.12, 0.17, 0.17, 0.33, 0.05, 0.25, 0.42, 0.65, 0.03, 0.8, 0.07, 0.15, 0.03, 0.4, 0.03] },
  { id: 'daniel', name: 'Daniel', handle: '@daniel', value: 24.0, days: 96, peak: '2.1B', streak: 33, img: 'daniel_big',
    bars: [0.15, 0.15, 0.17, 0.05, 0.05, 0.1, 0.15, 0.45, 0.05, 0.1, 0.2, 0.05, 0.1, 0.05, 1.0, 0.4, 0.03, 0.03, 0.25, 0.12, 0.03, 0.15, 0.03, 0.1] },
  { id: 'genshin', name: 'Gazerrr', handle: '@genshin', value: 13.8, days: 178, peak: '445.6M', streak: 31, img: 'genshin_big',
    bars: [0.07, 1.0, 0.4, 0.45, 0.03, 0.23, 0.5, 0.25, 0.1, 0.12, 0.12, 0.38, 0.25, 0.03, 0.23, 0.17, 0.38, 0.07, 0.68, 0.17, 0.12, 0.28, 0.03, 0.03] },
  { id: 'yusheng', name: '羽升', handle: '@yusheng', value: 7.1, days: 154, peak: '1.2B', streak: 41, img: 'yusheng',
    bars: [0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.04, 0.04, 0.15, 0.04, 0.08, 0.1, 0.02, 0.1, 0.02, 0.1, 0.24, 0.3, 0.52, 0.85, 0.4, 0.02] },
];

export const PRODUCTS = [
  { name: '身份与档案', desc: '统一身份、成员档案与共同体治理。', tag: 'IDENTITY' },
  { name: '中转站', desc: '共同体的 AI 模型中转站。', tag: 'RELAY' },
  { name: 'Tokens', desc: 'AI Agent Token 使用统计与自愿参与的公开排行榜。', tag: 'TOKENS' },
];

export const FEED = [
  ['发起了', 'Pull Request #177', 'fix(app): produce complete ad-hoc signatures for macOS packages'],
  ['合并了', 'Pull Request #170', '[Development] Index error and performance guidance for agents'],
  ['合并了', 'Pull Request #169', '[Development] Account for persistent recovery failures'],
  ['合并了', 'Pull Request #168', '[Development] Preserve concise rationale in commit history'],
  ['发起了', 'Issue #138', '[Sessions] List capped at 1,000 hides older sessions and understates counts'],
  ['合并了', 'Pull Request #115', 'feat(dsh-plugin): integrate Obelisk through a plugin-owned skill'],
  ['发起了', 'Issue #118', '[Skills] From repeated history to reusable agent skills'],
];

// 共建手册 v0.1 — methodology & values, verbatim headings.
export const PRINCIPLES = [
  { code: 'M-01', kind: '方法论', a: '注意力', b: '是唯一真正稀缺的东西。' },
  { code: 'M-02', kind: '方法论', a: '只做', b: '已有工具覆盖之外的事。' },
  { code: 'M-03', kind: '方法论', a: '一轮闭环，', b: '产出即地基。' },
  { code: 'M-07', kind: '方法论', a: '顺着模型能力做，', b: '不卡它明天的能力。' },
  { code: 'V-01', kind: '价值观', a: '吹出去的，', b: '必须能兑现。' },
  { code: 'V-04', kind: '价值观', a: '创意，', b: '不泡池子。' },
];

// AI logo roll call (lobehub icon slugs + glow tint).
export const SLAMS = [
  { slug: 'openai', name: 'OpenAI', tint: '#FFFFFF' },
  { slug: 'claude', name: 'Claude', tint: '#D97757' },
  { slug: 'deepseek', name: 'DeepSeek', tint: '#4D6BFE' },
  { slug: 'qwen', name: 'Qwen', tint: '#7C5CFF' },
  { slug: 'hunyuan', name: 'Hunyuan', tint: '#2E7DFF' },
  { slug: 'doubao', name: 'Doubao', tint: '#3D7BFF' },
  { slug: 'zhipu', name: 'Zhipu', tint: '#4E8CFF' },
  { slug: 'kimi', name: 'Kimi', tint: '#FFFFFF' },
];
export const GRID_LOGOS = [
  'openai', 'claude', 'gemini', 'deepseek', 'qwen', 'kimi', 'doubao', 'cursor',
  'meta', 'mistral', 'grok', 'zhipu', 'minimax', 'hunyuan', 'wenxin', 'stepfun',
  'perplexity', 'midjourney', 'suno', 'runway', 'huggingface', 'ollama', 'githubcopilot', 'trae',
  'windsurf', 'v0', 'notion', 'sora', 'claudecode', 'cline', 'yi', 'baichuan',
];

export const CODE_LINES = [
  'const idea = await human.imagine();', 'for await (const token of model.stream(prompt)) {', '  canvas.render(token);',
  'export default function Flovvas() {', 'git commit -m "one loop, one foundation"', 'agent.run({ skills, memory, tools })',
  'if (attention.isScarce()) focus(); ', 'SELECT * FROM members WHERE public = true;', 'await obelisk.index(sessions)',
  'npx create-something-people-want', 'while (true) { build(); ship(); learn(); }', 'model.generate({ temperature: 0.7 })',
  'curl relay.protocom/v1/messages', 'return <Canvas entries={["问题","文件","灵感"]} />', 'tokens += 31_100_000_000;',
];
