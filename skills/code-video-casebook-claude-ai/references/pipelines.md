# 管线骨架（按技术栈）：从哪个案例抄哪个文件

每条管线都给出：适用场景 → 最小骨架 → 本仓库里可以直接复制的真实文件（`assets/cases/<id>/…`）→ 这条管线特有的坑。所有路径都能用 `python3 scripts/casebook.py show <id> <path>` 打开，或 `copy <id> <dest>` 整包拷出。

## 目录

0. [所有管线共用的契约](#0-所有管线共用的契约)
1. [Python 逐像素：numpy / Pillow / OpenCV / cairo / skia → rawvideo 管道](#1-python-逐像素numpy--pillow--opencv--cairo--skia--rawvideo-管道)
2. [Python + 无头 OpenGL（EGL，ctypes 直调）](#2-python--无头-openglegl-ctypes-直调)
3. [浏览器 Canvas 2D + Playwright 逐帧](#3-浏览器-canvas-2d--playwright-逐帧)
4. [浏览器 DOM/CSS 舞台 + CDP 截图](#4-浏览器-domcss-舞台--cdp-截图)
5. [HyperFrames + GSAP](#5-hyperframes--gsap)
6. [Three.js 离线渲染（定格、写实、一镜到底）](#6-threejs-离线渲染定格写实一镜到底)
7. [单文件 HTML：画面 + Web Audio + 播放器 + 离线导出](#7-单文件-html画面--web-audio--播放器--离线导出)
8. [录制真实网页 / 真实应用](#8-录制真实网页--真实应用)
9. [真实照片与视频素材](#9-真实照片与视频素材)
10. [程序化配乐与音效](#10-程序化配乐与音效)
11. [编码、体积、响度与机器 QC](#11-编码体积响度与机器-qc)

---

## 0. 所有管线共用的契约

几乎每一篇 CoExp 都独立得出了同样的结论，这是整个仓库的"地基"：

1. **画面是时间（或帧号）的纯函数**：`render(t)` / `renderAt(t)` / `renderFrame(F)` / `window.film.frame(f)`。不用 `Date.now()`、不用未设种子的 `Math.random()`、不用 CSS transition/animation、不依赖上一帧状态。好处：任意帧可单独重渲、可分段并行、可断点续渲、联系表抽帧稳定可复现、定格可以"重画"而不是缓存。有状态的东西（粒子、元胞自动机、物理）→ 在 init 里预计算成查表，或写成 `lerp(起点, 终点, ease(p))`。判断标准（`codecosmos` CoExp L414）："直接调 `renderFrame(500)` 不经过 0–499，画面对不对？"
2. **一份时间表是唯一真相源**，画面和声音都读它：`timeline.py`（ageint）、`timeline.json`（xuanlan、yusheng 建议）、`cues.json`（skillshub）、`shots.js`（codecosmos）、`plan.py`（claude15）、`score.py`（gongcishi）、`edl.mjs`（supercut）、`episode.json`（stopmotion）、`timeline.ts`（moonlamp）。镜头起点由拍数**累加算出**，不手写。
3. **BPM × FPS 让每拍是整数帧**：120 BPM × 30/60 fps（15/30 帧）、150 BPM × 30 fps（12 帧）、128.571 BPM × 60 fps（28 帧，ageint）、200 BPM × 30 fps（9 帧，cosmos30）、96 BPM 让 7.5 s 段落落在小节线（stopmotion）。表见 `codecosmos` CoExp L49。
4. **声音从同一份数据派生**：画面代码导出事件（`ev()` → `events.json`，studysolo / oneink），或配乐直接读时间表；whoosh 提前 0.12–0.33 s 起、峰值落在切点。
5. **先看全貌再抠细节**：占位跑通全片 → 联系表（每镜中间帧 / 最后有效帧 / 转场前后）→ 逐镜打磨 → 全量渲染（后台、分段、可续跑）。
6. **交付前机器 QC + 如实说明**：帧数、时长、编码参数、响度、黑帧/冻结帧、体积；"AI 听不到声音"写进交付说明。

---

## 1. Python 逐像素：numpy / Pillow / OpenCV / cairo / skia → rawvideo 管道

**适用**：不想依赖浏览器；需要多进程；要完全控制每个像素；大量镜头或照片素材。

```python
# 骨架（kimi-film/film_par.py 的精简）
SCENES = [(t0, t1, fn), ...]            # fn(local_t) -> HxWx3 uint8
def render_range(f0, f1, path):
    ff = Popen(["ffmpeg","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
                "-c:v","libx264","-preset","medium","-crf","17","-pix_fmt","yuv420p",path], stdin=PIPE)
    for f in range(f0, f1):
        t = f / FPS; s = next(s for s in SCENES if s[0] <= t < s[1])
        ff.stdin.write(s[2](t - s[0]).tobytes())
    ff.stdin.close(); ff.wait()
# Pool(N) 分段 → concat -c copy → 混入 score.wav
```

| 要抄的 | 文件 |
|---|---|
| 最小并行骨架（8 进程切片 + concat + 混音） | `kimi-film/film_par.py`、`kimi-film/kit.py`（beam 距离场光束、高斯辉光、文字精灵缓存）、`kimi-film/scenes.py` |
| 大型工程：时间线 + 单帧管线 + 拍反应后期 + HUD + 字幕 + 管道 | `ageint/The_Age_of_Intelligence-source/src/{timeline,render,core,scenes,scenes2,scenes3}.py`；QA：`src/qa_frames.py`、`src/cut_sheets.py`、`src/smoke.py`；字体回退：`scripts/build_fonts.py` |
| OpenCV 亚像素抗锯齿（`LINE_AA` + `shift=4`）、3D 相机、柔光点云 `bincount` splat | `ageint` CoExp L122 起 6 段关键代码 |
| skia-python：拉片表 + 转场表 + 离屏 surface 回调蒙太奇 | `claude15/claude_intro/{plan,core,scenes_a,scenes_b,render}.py` |
| pycairo 矢量 + 2.5D `cam()` + 月饼扇形 clip | `gpt-autumn/MidAutumn_60s_Final/src/{film60,artwork}.py`；并行与组装 `build.py` |
| 真实照片：图层 Shot、`place()` 焦点夹紧、时间窗解码、分块可续跑 | `gongcishi` CoExp L195 起（原工程未入库，代码在 CoExp） |
| 自写 3D 合成器（相机、单应贴图、画家算法、景深、运动模糊） | `shatter` CoExp L59 起 |

**坑**：`Pillow` 懒加载坏图（`load()` 才报错）；中文字体缺字 → fontTools 读 cmap 逐字回退（ageint、gongcishi）；OpenCV 5 移除 `CascadeClassifier` → `opencv-python-headless<5`；3D 相机 `cross(up,f)` 手性搞反画面镜像（ageint）。

## 2. Python + 无头 OpenGL（EGL，ctypes 直调）

**适用**：要着色器画风 / 真 3D，但环境没有浏览器或不想用浏览器；无 GPU 时 Mesa EGL 软件渲染。

```python
os.environ.setdefault('EGL_PLATFORM', 'surfaceless')
# ctypes 载入 libEGL/libGL → eglGetDisplay/eglInitialize/创建 pbuffer 上下文 → 编译 shader
# 每帧：设 uniform(uTime, uScene, uBeat) → glDrawArrays(全屏三角形) → glReadPixels → numpy → Pillow 叠文字 → rawvideo 管道
```

| 要抄的 | 文件 |
|---|---|
| **单个 fragment shader 用 `uScene` 分支 30 种画风**；EGL ctypes 封装；每镜 raw pipe；组装前 assert 帧数 | `cosmos30/COSMOS/{glrender.py, cosmos.frag, render.py, assemble.py, storyboard.json}` |
| 原生 GL 三角网格 + 深度测试 + **阴影贴图**；15 个世界；分段并行 bgra pipe | `beyond/AI_BEYOND_GENERATION/source/{nativegl.py, threeworlds.py, art.py, render.py, render_all.py}` |
| 两遍 loudnorm 母带、章节 ffmeta、manifest + sha256 | `cosmos30/COSMOS/{master_audio.py, chapters.ffmeta, delivery_manifest.json}` |

为什么不用浏览器 / Three.js / Remotion：`cosmos30` CoExp L159。

## 3. 浏览器 Canvas 2D + Playwright 逐帧

**适用**：最通用的一条路。文字排版、中文字体、2D 特效、少量 WebGL 后期都方便；同一页面可以实时预览。

```js
// 页面：window.renderFrame(f) 或 window.render(t) 画完同步返回；window.ready / __ready 表示字体图片已就绪
const browser = await chromium.launch({ args: [
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
  '--disable-accelerated-2d-canvas', '--disable-gpu-rasterization'] });   // 无 GPU 时 2D 必须关加速
await page.goto('http://127.0.0.1:PORT/index.html');                        // 用 http，不用 file://
await page.evaluate(() => window.ready);
const ff = spawn('ffmpeg', ['-y','-f','image2pipe','-framerate',FPS,'-c:v','mjpeg','-i','-',
                            '-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p', seg]);
for (let f = a; f < b; f++) {
  const b64 = await page.evaluate(f => { window.renderFrame(f); return canvas.toDataURL('image/jpeg', .95).split(',')[1]; }, f);
  if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await once(ff.stdin, 'drain');   // 处理背压
}
// N 个进程各渲一段 → concat -c:v copy → 混音
```

| 要抄的 | 文件 |
|---|---|
| 4 进程 + 字体全时间轴预热 3 遍 + `drawRaw(c,t,scale)` 缩略图复用 + WebGL1 后期一 pass | `protocom/promo/{render.mjs, src/main.js, src/core.js, src/post.js}` |
| Canvas2D 多图层 + WebGL2 合成着色器（墨）+ 有状态模拟的 `stepOnly(i)` | `oneink/{render.js, main.js, preview.js}` |
| 分镜表 + 合成器（有效/定格）+ 三后端统一画到 sceneCanvas + 帧号列表渲染 | `codecosmos/{render.mjs, web/engine.js, web/shots.js, web/lib.js}` |
| renderAt(t) + 10 层画布 + 拍脉冲 + 6 worker 交错（Python Playwright） | `ai-rise/{render.py, main_v2.js, scenes_v2.js, timeline.js}` |
| 场景用 `scene(bars, def)` 自动累加 + 声明式 `data-in`/`data-fx` | `f12/F12-Field-Guide-source/{video.html, render.mjs, build.py}` |
| 竖屏；Python Playwright 取 `__frame(t)` + `__renderAudio()` | `readclub/hust-reading-club-video/{video.src.html, render.py, build.py}` |
| CoExp 内的完整核心代码（无源码包） | `xuanlan` CoExp L170（时间轴/确定性工具/renderAt 合成器/逐帧截取）、`hust1037` CoExp L340（附录关键代码）、`senpai` CoExp、`samemoon` CoExp §四 |

**坑**（出现频率最高的几条）：
- 无 GPU 时 Canvas 2D 也走 SwiftShader，**截图一帧 41–54 s** → `--disable-accelerated-2d-canvas`（protocom、oneink）。测"绘制 + 导出"总时间。
- `page.screenshot` PNG 很慢 → `canvas.toDataURL('image/jpeg')` 或 CDP JPEG。
- 中文字体按 unicode-range 分片、`display:none` 不触发下载 → `document.fonts.load(font, 全部文字)`，protocom 用"全时间轴每 1/20 s 画一遍收集字体"预热。
- Canvas 状态泄漏（`globalAlpha`/`textAlign`/`lineDash`/`filter`）污染下一场景 → 每场景 `save/setTransform/restore`；场景内禁止 `setTransform`（否则不能当缩略图复用）。
- 透明度一律乘法叠加，辅助函数里 `c.globalAlpha = a` 会覆盖外层淡出（samemoon）。
- `shadowBlur` 在软件渲染下很贵 → 宽半透明线 + 窄实线叠画（codecosmos）。

## 4. 浏览器 DOM/CSS 舞台 + CDP 截图

**适用**：产品界面、设计令牌、密集排版、真实组件；画面主要是 HTML 元素而不是画布。

```js
// 场景：{ id, start, end /*拍*/, mount(root) {建一次 DOM}, update(b, ctx) {只改 style，css() 缓存只写变化} }
window.__seek = t => { render(t); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(true)))); };
// 渲染器：await page.evaluate(t => __seek(t), t); const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 94 });
```

| 要抄的 | 文件 |
|---|---|
| **四层舞台**（bg canvas / DOM world / fx canvas / post）+ 场景接口 + engine（prog/kf/hit/css）+ 主题令牌深浅切换 + render.mjs（--stills/--fps/--from/--to/--theme） | `skillshub/promo/src/{index.html, js/engine.js, js/main.js, js/theme.js, js/fx.js, js/scenes/*.js, styles/*.css, cues.json}`、`skillshub/promo/render.mjs` |
| 单文件 composition.html：SCENES 重叠区间、牛顿法 cubic-bezier、beatEnv、文字像素粒子形变 | `yusheng` CoExp L118 |
| DOM 仿真 DevTools、光标关键帧用 CSS 选择器实时解析 | `f12/F12-Field-Guide-source/video.html` |
| 真实截图窗内推拉 + DOM → WebGL 同坐标交接 | `studysolo` CoExp L207 |

**坑**：`mix-blend-mode` 在有 `z-index` 的父层里失效（颗粒把画面洗灰，skillshub）；seek 后要等两帧 rAF 再截图；`<div hidden>` 被 `display:flex` 覆盖（phasegate）；`filter: blur` 只在值 > 0.05 时写入；界面类镜头按 1.2–1.3 倍设计才看得清。

## 5. HyperFrames + GSAP

**适用**：HTML 合成、多段视频代理、想用 GSAP 时间轴又要逐帧确定性。

| 要抄的 | 文件 |
|---|---|
| 音乐分析成 `audiomap.json` → 6 个独立 HTML 帧、paused 根时间轴、kick 抖动 `steps(1)`、DOM 代码雨、`hyperframes check` 闸门 | `kimi-beat/ai-beat-sync/{index.html, compositions/frames/*.html, audiomap.json, STORYBOARD.md, MAKING-OF.md, CLAUDE.md, AGENTS.md}` |
| EDL → 构建静态 index.html（90+ `<video>`）→ GSAP seek → `render(tl.time())` 纯函数；prep 代理切片；score.py 读 cues | `supercut/{src/edl.mjs, src/runtime.js, tools/build.mjs, tools/prep_media.mjs, audio/score.py, package.json}` |

命令：`npx hyperframes@0.8.x check` / `snapshot` / `render . -q delivery --fps 60 -o out.mp4`。能力边界见 `atlas/motion-library-atlas/references/libraries/hyperframes/README.md`。

## 6. Three.js 离线渲染（定格、写实、一镜到底）

**适用**：真 3D 空间、角色木偶、写实材质、同一世界多画风。

```ts
// 契约：window.film = { ready, frame(f) → JPEG dataURL, inspect(f), meta() }
// 两个时钟：连续 t（相机/光/粒子/MG）与步进 poseT = floor(t*poseFps + 1e-6)/poseFps（木偶，定格感）
new THREE.WebGLRenderer({ preserveDrawingBuffer: true });   // 截图必须
// Chromium: --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist
```

| 要抄的 | 文件 |
|---|---|
| **完整工具包**：World/Episode/Look/Delivery；7 条画风管线；capture.mjs 断点续渲；validate/audio/finalize | `stopmotion/stop-motion-3d/`（先读它自己的 `SKILL.md`） |
| 写实定格：场地 / Take / 镜头三层；`shots.ts` 镜头即数据；on twos 量化 + 重复帧硬链接；静态合批；程序化 PBR；接触二分求解 | `dingge/dingge-source/src/{film,world,characters,materials,audio}/`、`scripts/render.mjs`、`docs/DIRECTOR.md` |
| 一镜到底：Hermite 样条 + Fritsch-Carlson；两骨 IK；12 步水彩 GLSL；inspect QC；13 项 finalize | `moonlamp/moonfilm/src/{timeline.ts, cam/path.ts, look/moonwash.ts, core/post.ts, world/*.ts}`、`scripts/{capture.mjs, kit/finalize.py}` |
| 同一物体跨画风换装、fov 0.6° 伪正交与 SVG 像素对齐、希区柯克变焦 | `phasegate` CoExp L276（7 段核心代码） |
| HDR 颜色只让线和节点泛光、弧长表、`Vector3.project` 放 DOM 标签 | `studysolo` CoExp L207 D 段 |
| 物理相机：CoC 景深、快门子帧积分运动模糊、测光曝光、13 种运镜 | `town-camera-lab/town-camera-lab.html`（L882–L1497） |

**坑**：读回 HalfFloat 目标不同步 GPU，性能数字是假的（用 RGBA8 探针）；intensity=0 的灯仍然收费（`visible=false`）；UnrealBloom 把 NaN 扩散成黑块（`clamp(c,0,64)`）；手陷进桌面（按手块 OBB 迭代补偿）；木偶插值成 24fps 连续会失去定格感。

## 7. 单文件 HTML：画面 + Web Audio + 播放器 + 离线导出

**适用**：要一个能在线播放的网页版，同时导出 MP4；配乐在页面内合成。

```js
window.FILM = { ready, render(t), renderWav() /* OfflineAudioContext → WAV */, wavChunk(i) /* 分块 btoa，每块 3 MB */ };
// 播放器模式：画面时钟跟随 ac.currentTime；导出模式：Playwright 逐帧 render(t) + 取 WAV
```

| 要抄的 | 文件 |
|---|---|
| 竖屏 A 慢 → B 爆燃 → 骤停 → C 真慢；手卷镜头 camXAt；Web Audio 合成配方；侧链 pump；`?t=` 跳转；fontTools 裁字 base64 内嵌 | `readclub/hust-reading-club-video/{video.src.html, build.py, render.py}`、成品 `readclub/华中大读书会_慢下来_代码版.html` |
| 854 行中秋片：13 段调度、CAPS 双语字幕、Karplus-Strong 古筝、骤停连混响返回一起切、`route.fulfill` 补 charset、拦截 Google Fonts 换本地 | `samemoon` CoExp §四（L191 起） |
| 竖屏信笺：6 幕、圆形 clip 扩散转场、播放器、无障碍 transcript | `moon-letter/Moon_Letter_Interactive.html` |

## 8. 录制真实网页 / 真实应用

| 做法 | 案例与文件 |
|---|---|
| **虚拟时间逐帧录屏**：接管 `performance.now`/`Date`/rAF/`setTimeout`/CSS 动画/`<video>`，`__advance(33.333)` 后 CDP 截图；配置驱动（pre/scroll 表达式；Lenis 用 `lenis.scrollTo(immediate)`） | `shuchenglin/树成林宣传片-工程源码/{vtime.js, capture.py, cfgA.json, cfgB.json, cfgC.json}` |
| **页面内伪造 AI 流式回答**：`addInitScript` 覆写 fetch，`/api/chat` 返回页面内 ReadableStream，按 AI SDK UI Message Stream 协议逐 chunk 推送并截图 | `studysolo` CoExp L99 核心 2 |
| 自己从零写产品前端再拍（不依赖真实应用） | `skillshub/promo/src/styles/{tokens,ui}.css`、`js/ui.js` |
| 仿真浏览器 / 仿真工具界面 | `f12/F12-Field-Guide-source/site/src/*.js` |

**坑**：接管 rAF 后 `page.screenshot` 永远等不到帧（用 CDP）；滚动触发的动画在虚拟时间下全黑（先录 2 秒试帧）；KaTeX 收到半截公式报错（整块推送）；界面上的真实计时要改成展示值并在交付说明写清。

## 9. 真实照片与视频素材

| 环节 | 案例与位置 |
|---|---|
| 素材普查：去重（MD5）、验坏（`load()`）、rotation、联系表、机器看片（运动/亮度/清晰度/响度/人脸）、线索表 | `gongcishi` CoExp L36 |
| 图层化镜头、Ken Burns、焦点夹紧不露边、视频按时间窗解码缓存、分块渲染可续跑 | `gongcishi` CoExp L195 |
| 抠像拆层 2.5D（MediaPipe + 导向滤波）、补背景、等比缩放补偿、出框 | `shatter` CoExp L91 |
| 大量成片混剪的代理切片、高光入点 `wallIn` | `supercut/tools/prep_media.mjs`、`src/catalog.mjs` |

## 10. 程序化配乐与音效

所有配乐都没有使用采样或版权素材（除 `kimi-beat`、`shuchenglin` 用了授权歌曲）。直接抄的合成器文件：

| 文件 | 特点 |
|---|---|
| `kimi-film/score.py` | 每幕独立 BPM 与配器、五声动机贯穿、逐秒 RMS 验音 |
| `ageint/The_Age_of_Intelligence-source/src/music.py` | 128.571 BPM、侧链、tape stop、stutter、分频 RMS 实测混音 |
| `cosmos30/COSMOS/{score.py, master_audio.py}` | 200 BPM、bus 结构、两遍 loudnorm + 线性 |
| `skillshub/promo/audio/make-track.py` | 读 cues.json；kick/snare/clap/hat/pluck/pad/reese/stab/boom/riser/反向镲/clack 配方；静默段 5 ms 渐弱 |
| `protocom/promo/audio/synth.py` | 干声/混响/DUCK 三总线，时间抄画面常量 |
| `codecosmos/music.py` | 读分镜表：嗖声提前 0.12 s、定格快门、stutter、磁带停转重采样 |
| `stopmotion/stop-motion-3d/scripts/audio.py` | room/music/foley/fx 四 stem，由 meta/inspect 派生，每画风一种乐器 |
| `oneink/audio.py` | 古琴加法合成（17 非谐分音 + 按音滑动）、声像跟随大笔、按高潮 RMS 归一 |
| `f12/F12-Field-Guide-source/music.py` | 128 BPM 32 小节、侧链、母带 |
| `gpt-autumn/MidAutumn_60s_Final/src/{music60.py, master_audio.py}` | 程序化 MIDI + FluidSynth、两遍 loudnorm |
| `beyond/AI_BEYOND_GENERATION/source/audio.py`、`claude15/claude_intro/music.py`、`supercut/audio/score.py`、`moonlamp/moonfilm/audio/score.py`、`shuchenglin/…/audio.py`（歌曲重构 + SFX + 包络限幅） | 其他风格 |
| `dingge/dingge-source/src/audio/{score.ts, sfx.ts}` | Web Audio OfflineAudioContext |

常用配方（kick 扫频正弦 + 点击噪声 + tanh；clap 三次 11 ms 脉冲；hat 7–14 kHz 带通噪声；supersaw 失谐锯齿；riser 时变低通噪声 + 上扫正弦；侧链 `1 − k·exp(−t/τ)`；FFT 卷积混响 IR = 指数衰减噪声）在 `skillshub` CoExp L223、`studysolo` CoExp L249、`yusheng` CoExp L264、`xuanlan` CoExp L300 都有完整参数表。

## 11. 编码、体积、响度与机器 QC

```bash
# 母版（有颗粒时 CRF 从 21 起步；先编 5–10 秒样本估体积）
ffmpeg -f image2pipe -framerate 60 -c:v mjpeg -i - -i music.wav -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p \
  -profile:v high -movflags +faststart -c:a aac -b:a 256k -shortest master.mp4
# 有体积上限：码率 ≈ 上限MB×8/时长s − 音频Mbps（留 10%），两遍编码
ffmpeg -i master.mp4 -c:v libx264 -preset slow -b:v 3300k -pass 1 -an -f null /dev/null
ffmpeg -i master.mp4 -c:v libx264 -preset slow -b:v 3300k -pass 2 -c:a aac -b:a 192k -movflags +faststart share.mp4
# 分段拼接不重编码
ffmpeg -f concat -safe 0 -i parts.txt -i music.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out.mp4
# 一拍二定格（12 张独立画面 → 24fps，颗粒每输出帧变化）
ffmpeg -framerate 12 -i f%05d.jpg -vf "fps=24,noise=alls=2:allf=t,format=yuv420p" ...
# 显式 BT.709 + limited range（stopmotion/scripts/finalize.py）
-vf "scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p" -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709
# 响度：先测再定增益（单遍 loudnorm 对短片不准）
ffmpeg -i out.mp4 -af ebur128=framelog=quiet:peak=true -f null -     # 或两遍 loudnorm（gpt-autumn/src/master_audio.py）
# QC
ffmpeg -v error -xerror -i out.mp4 -f null -                           # 全解码
ffmpeg -i out.mp4 -vf "freezedetect=n=0.002:d=0.4,blackdetect=d=0.25:pix_th=0.06" -an -f null -
ffmpeg -i out.mp4 -vf "select='gt(scene,0.28)',showinfo" -f null -    # 硬切时刻 → 对拍网格（gongcishi）
ffmpeg -i out.mp4 -vf "fps=2,scale=320:180,tile=10x12" -frames:v 1 sheet.jpg   # 联系表
```

| 体积 / 响度实测 | 案例 |
|---|---|
| CRF15 + 颗粒 775 MB → CRF21 45 MB → CRF24 27 MB | `protocom` |
| CRF18 + 颗粒 442 MB → 两遍 3 Mbps 26 MB | `codecosmos` |
| CRF18 88 MB → 固定 6 Mbps 22.6 MB；单遍 loudnorm −11.9 → ebur128 + `volume=-3dB` −14.0 LUFS | `yusheng` |
| CRF16 75 MB → 两遍 3.3 Mbps 25 MB | `shuchenglin` |
| AAC 编码把真峰值从 −1.5 抬到 ≈0 dBTP → 母带留 −2 dB，断言 MP4 内的值 | `stopmotion` |
| 颗粒 ≤ 0.08–10%；`-tune grain` 反而更大 | `studysolo`、`protocom` |

机器 QC 脚本可直接抄：`stopmotion/stop-motion-3d/scripts/{finalize.py, contact_sheet.py, compare_frames.py, validate.py}`、`moonlamp/moonfilm/scripts/{kit/finalize.py, verify_mp4.py}`、`ageint/…/src/{qa_frames.py, cut_sheets.py}`、`beyond/…/source/{validate.py, finalize.py}`、`supercut/tools/qa_probe.mjs`。
