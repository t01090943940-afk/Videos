// ─────────────────────────────────────────────────────────────────────────────
//  真实代码行 · 全部摘自合集里各作品的源码包 / CoExp 复盘中的代码片段（未改动一个字符，只截取单行）
//  冷开场的"代码墙"和隧道壁上的滚动代码都来自这里 —— 画面上出现的每一行，
//  观众下载源码包后都能在对应文件里 Ctrl+F 找到。
// ─────────────────────────────────────────────────────────────────────────────
export const CODE_LINES = [
  { src: 'opus-oneink/main.js', line: 'const W = 1920, H = 1080, FPS = 30;' },
  { src: 'opus-oneink/main.js', line: 'let rnd = mulberry32(20260926);' },
  { src: 'opus-oneink/main.js', line: 'const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };' },
  { src: 'opus-oneink/main.js', line: 'const easeIO = t => t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t);' },
  { src: 'opus-oneink/render.js', line: "const url = await p.evaluate(f => { window.renderFrame(f); return document.getElementById('gl').toDataURL('image/jpeg', 0.95); }, f);" },
  { src: 'opus-universe-history-video/web/engine.js', line: "export const ACC = { '2D': '#00E5FF', '2.5D': '#FFD600', '3D': '#FF3D7F', '4D': '#B388FF' };" },
  { src: 'opus-universe-history-video/web/engine.js', line: 'const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true, alpha: false });' },
  { src: 'opus-universe-history-video/music.py', line: 'SR = 44100; BPM = 120; BEAT = 60 / BPM; DUR = 68.0' },
  { src: 'opus-universe-history-video/music.py', line: 'f = 45 + 110 * np.exp(-t / 0.03) + (30 * np.exp(-t / 0.2) if big else 0)' },
  { src: 'opus-universe-history-video/music.py', line: 'return np.tanh(s * 1.6) * g' },
  { src: 'opus-claude-intro-with-15-way/claude_intro/core.py', line: 'def seg(x, a, b): return clamp((x - a) / (b - a)) if b != a else float(x >= a)' },
  { src: 'opus-claude-intro-with-15-way/claude_intro/core.py', line: 'def e_outexp(t): t = clamp(t); return 1 if t >= 1 else 1 - 2 ** (-10 * t)' },
  { src: 'gpt-universe-30-change/COSMOS/score.py', line: "SR=48000;N=72*SR;B=.3;BASE=Path(__file__).resolve().parent" },
  { src: 'gpt-universe-30-change/COSMOS/score.py', line: "def filt(x,c,kind='lowpass'):return sosfilt(butter(2,c,btype=kind,fs=SR,output='sos'),x).astype(np.float32)" },
  { src: 'gpt-universe-30-change/COSMOS/score.py', line: 'def env(t,a=.004,d=.15):return (1-np.exp(-t/a))*np.exp(-t/d)' },
  { src: 'gpt-universe-30-change/COSMOS/glrender.py', line: 'def render(self,scene,t,beat=0.):' },
  { src: 'opus-age-of-intelligence/src/timeline.py', line: 'BPM = 60.0 * FPS / FPB        # 128.5714' },
  { src: 'opus-age-of-intelligence/src/timeline.py', line: 'N_FRAMES = END_BEAT * FPB     # 5544 frames = 92.4 s' },
  { src: 'opus-age-of-intelligence/src/timeline.py', line: "shot(184, END_BEAT, 'end_card')" },
  { src: 'opus-shuchenglin-into/comp/timeline.js', line: "function stamp(word, lt, { size = 380, dur = .34, color = '#fff', solid = false } = {}) {" },
  { src: 'opus-shuchenglin-into/render.py', line: "d=await pg.evaluate(f'renderFrame({round(t*30)})')" },
  { src: 'opus-production-video-skill-hub/src/js/engine.js', line: 'export const prog = (b, b0, b1, ease = E.linear) => ease(clamp((b - b0) / (b1 - b0)));' },
  { src: 'opus-production-video-skill-hub/src/js/engine.js', line: 'export function hit(b, at, decay = 0.35) {' },
  { src: 'opus-production-video-skill-hub/render.mjs', line: '"-f", "image2pipe", "-framerate", String(fps), "-i", "-",' },
  { src: 'opus-F12-teaching/music.py', line: 'def supersaw(freqs, d, cutoff=2400):' },
  { src: 'swe-ai-rise/main_v2.js', line: 'window.renderAt=function(t){' },
  { src: 'swe-kimi-source-intro/scenes.py', line: 'draw_stars(img, _SF0, t, amp=ss(seg(t, 3.2, 5.5)) * 0.9)' },
  { src: 'swe-kimi-source-intro/film_par.py', line: '["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",' },
  { src: 'swe-kimi-source-intro/kit.py', line: 'def eo_back(x, s=1.70158):' },
  { src: 'opus-mid-autumn-for-my-dg01/CoExp.md', line: 'const seg = (t,a,b) => clamp((t-a)/(b-a));' },
  { src: 'opus-mid-autumn-for-my-dg01/CoExp.md', line: "const eio = x => x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;" },
  { src: 'opus-mid-autumn-for-my-dg01/CoExp.md', line: "await page.evaluate(t => render(t), i / FPS);" },
];
