# kimi-beat · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show kimi-beat <路径>`；还原成真实目录：`python3 scripts/casebook.py copy kimi-beat <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `ai-beat-sync/AGENTS.md` | 103 | 32 |
| 2 | `ai-beat-sync/AI觉醒代码视频-CoExp.md` | 460 | 140 |
| 3 | `ai-beat-sync/BRIEF.md` | 18 | 605 |
| 4 | `ai-beat-sync/CLAUDE.md` | 103 | 628 |
| 5 | `ai-beat-sync/MAKING-OF.md` | 219 | 736 |
| 6 | `ai-beat-sync/STORYBOARD.md` | 137 | 960 |
| 7 | `ai-beat-sync/assets/gsap.min.js` | 11 | 1102 |
| 8 | `ai-beat-sync/audiomap.json` | 2871 | 1118 |
| 9 | `ai-beat-sync/audiomap_full.json` | 8238 | 3994 |
| 10 | `ai-beat-sync/compositions/frames/01-f1-boot.html` | 349 | 12237 |
| 11 | `ai-beat-sync/compositions/frames/02-f2-title.html` | 428 | 12591 |
| 12 | `ai-beat-sync/compositions/frames/03-f3-montage.html` | 647 | 13024 |
| 13 | `ai-beat-sync/compositions/frames/04-f4-drop.html` | 920 | 13676 |
| 14 | `ai-beat-sync/compositions/frames/05-f5-finale.html` | 555 | 14601 |
| 15 | `ai-beat-sync/compositions/frames/06-f6-outro.html` | 200 | 15161 |
| 16 | `ai-beat-sync/frame.md` | 284 | 15366 |
| 17 | `ai-beat-sync/hyperframes.json` | 13 | 15655 |
| 18 | `ai-beat-sync/index.html` | 117 | 15673 |
| 19 | `ai-beat-sync/meta.json` | 5 | 15795 |
| 20 | `ai-beat-sync/package.json` | 11 | 15805 |

---

### 1/20 · `ai-beat-sync/AGENTS.md`
<!-- casebook-file {"path": "ai-beat-sync/AGENTS.md", "lines": 103, "final_newline": true, "sha256": "6361e5d1b78020e6a17a9c31685104d78cb538a080907ca21fd6f88ec21b7fd3", "original_sha256": "6361e5d1b78020e6a17a9c31685104d78cb538a080907ca21fd6f88ec21b7fd3"} -->
````markdown
# HyperFrames Composition Project

## Skills — USE THESE FIRST

**Always invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that are NOT in generic web docs. Skipping them produces broken compositions.

**Doing anything with HyperFrames?** Start at `/hyperframes` — it tells you what HyperFrames can do and which skill or workflow handles your intent (make a video, TTS / BGM, prep footage, author / animate, render, install blocks), confirms your brief up front (the intent layer), and routes every "make me a…" request (a video, a deck, a composition port) to the right workflow. Read it first, especially when there's no project context to orient you. The workflows it routes to:

- `/product-launch-video` — any **website** URL or brief / script → a product launch / SaaS / promo video, or a site tour / showcase featuring the site's own captured visuals.
- `/faceless-explainer` — arbitrary text (topic / article / notes), **no URL, no website capture** → 60-90s faceless explainer.
- `/embedded-captions` — an existing talking-head video (MP4) → the same footage with captions / subtitles added (rail + embed, or pure-cinematic embed); the footage itself is untouched.
- `/talking-head-recut` — an existing talking-head / interview / podcast video (MP4) → the same footage **packaged with designed graphic overlays** (kinetic titles, lower-thirds, data callouts, pull-quotes, side panels, pip) synced to the transcript; the clip plays unchanged underneath. (Plain captions/subtitles → `/embedded-captions`.)
- `/pr-to-video` — a GitHub PR (URL / `owner/repo#N` / "this PR") → 30-90s code-change explainer (changelog / feature reveal / fix / refactor).
- `/motion-graphics` — a short (typically under 10s) design-led **motion graphic**, motion-is-the-message, no narration: kinetic type, a stat / number count-up, a chart, a logo sting, a lower-third / overlay, or an animated tweet / headline / captured-page highlight; rendered to MP4 or a transparent overlay. Longer / narrated / custom → `/general-video`.
- `/music-to-video` — a **music track** (audio file, video to pull audio from, or one generated from a mood brief) → beat-synced video (lyric / slideshow / kinetic promo). Music drives pacing; user-supplied images / videos are cut onto the same beat grid.
- `/slideshow` — a **presentation / pitch deck / interactive deck** — discrete slides, fragment reveals, branching, hotspot navigation, presenter mode. Output is a navigable deck, not a rendered video.
- `/general-video` — fallback for any other video (title card, longer brand / sizzle reel, multi-scene montage, static loop, custom composition) and the home of **companion mode** — co-create with the full HyperFrames toolbox; the original hyperframes authoring flow, any length.

**Porting an existing composition?** `/remotion-to-hyperframes` translates a Remotion (React) composition into HyperFrames HTML — a source migration, separate from the creation workflows above.

The domain skills (`/hyperframes-core`, `/hyperframes-animation`, `/hyperframes-keyframes`, `/hyperframes-creative`, `/hyperframes-cli`, `/media-use`, `/hyperframes-audio`, `/hyperframes-registry`, `/figma`) and the full capability map live inside `/hyperframes` — it is the single source of truth for which skill handles which intent.

**Changing how real footage or images look or reveal?** Load `/media-use` and read its `references/media-treatments.md` before editing, even when the request only says dark, flat, boring, retro, private, or “make the reveal cooler.” It governs how footage is treated, never whether media may be used. Use canonical media treatments and seek-safe motion; do not improvise equivalent CSS/SVG filters or overlays.

> **Tailwind v4 projects** (`hyperframes init --tailwind`): see `/hyperframes-core` → `references/tailwind.md`.

> **Skill missing or stale?** Run `npx hyperframes skills update <name>` to install/refresh
> the specific skill you need (the `/hyperframes` router does this automatically before
> entering a workflow), or bare `npx hyperframes skills update` to refresh the core set plus
> everything already installed — neither pulls the full set. Restart the agent session so
> newly installed skills load.

## Commands

```bash
npm run dev          # human-operated foreground preview (blocks until stopped)
npx hyperframes preview --background  # agent-safe persistent Studio preview
npx hyperframes preview --status      # verify the persistent preview is listening
npx hyperframes preview --stop        # stop it when review is finished
npm run check        # lint + runtime + layout + motion + contrast (one command)
npm run render       # render to MP4
npm run publish      # publish and get a shareable link
npx hyperframes lint --verbose  # include info-level findings
npx hyperframes lint --json     # machine-readable output for CI
npx hyperframes docs <topic> # reference docs in terminal
```

> **Agents must use `npx hyperframes preview --background` for Studio handoff.** Do not rely
> on a shell/tool `run_in_background` wrapper around `npm run dev`: that foreground process
> remains owned by the invoking session and can disappear while the browser stays open,
> leaving refreshes at `ERR_CONNECTION_TIMED_OUT`. Verify with `preview --status`, keep it
> alive through review, and stop it explicitly with `preview --stop` afterward.

> **Pinned CLI version.** These scripts pin an exact `hyperframes@X.Y.Z` so this project re-renders identically over time. Weeks later that pin lags fixes shipped since. To move up: `npx hyperframes@latest upgrade --project . --check` (shows the delta), then `npx hyperframes@latest upgrade --project .` to rewrite the pins. Always unpinned — the pinned script re-runs the old version against itself.

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx hyperframes docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://hyperframes.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`
- `meta.json` — project metadata (id, name)
- `transcript.json` — whisper word-level transcript (if generated)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Warnings should be reviewed before rendering.

## Key Rules

1. Every timed element needs `data-start` and a duration. `data-start` is what marks it as timed; `data-track-index` is an optional Studio display lane the render never reads
2. Give timed visual elements `class="clip"`. The framework keys visibility off `data-start`, not the class, but the shared `.clip` CSS is what gives a scene its full-frame box, and `lint` warns without it
3. Register one paused root timeline per composition on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
   Scene timelines manually added to this root must not be paused. A paused
   child does not advance when the root is seeked. The runtime activates
   registered composition siblings, not arbitrary nested scene timelines.
4. Videos use `muted` with a separate `<audio>` element for the audio track
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches
````

### 2/20 · `ai-beat-sync/AI觉醒代码视频-CoExp.md`
<!-- casebook-file {"path": "ai-beat-sync/AI觉醒代码视频-CoExp.md", "lines": 460, "final_newline": true, "sha256": "31e617b56108dbb891608a6a9701f6f56fd6495ea2c88ca3e859c71d8166b3e1", "original_sha256": "31e617b56108dbb891608a6a9701f6f56fd6495ea2c88ca3e859c71d8166b3e1"} -->
````markdown
# AI觉醒代码视频-CoExp · 复盘经验总结

> 项目：`videos/ai-beat-sync/` ｜ 成片：`renders/ai-beat-sync.mp4`（1920×1080 · 30fps · 51.293s · 15.0MB · H.264+AAC）
> 工作流：HyperFrames 0.8.73 `/music-to-video` ｜ BGM：Kevin MacLeod《Volatile Reaction》（CC-BY 4.0）
> 本文基于本次真实制作过程写成，所有命令、参数、代码均来自实际执行记录。

---

# 一、创作思路

## 1.1 需求拆解：先把音乐变成曲线，再把曲线变成叙事

用户的需求是"AI 主题、高燃卡点、节奏极快、宁可短也要快"。拆解动作不是先写故事，而是**先把音乐分析成数据**：

1. 选曲标准不是好听，是**曲子内部有剧情**。《Volatile Reaction》152BPM，全曲 161s，内部有完整的 安静冷启动 → SURGE 蓄力 → DROP 爆发 → 骤停 结构。
2. 对**全曲**跑节拍分析器得到 `audiomap.json`：BPM、每一拍的时间戳（`grid.beats_sec[]`）、能量值、军鼓/roll 位置。1 拍 = 60/152 = **0.39474s**。
3. 按能量曲线裁窗：取原曲 **46.324s–97.617s** 这 51.293s，窗口边缘**对齐到 downbeat**（不是随手掐的）。裁完，音乐结构直接翻译成了叙事结构：

| 本地时间 | 音乐事件 | 叙事功能 | 帧 |
|---|---|---|---|
| 0–4.644s | 冷启动，kick 2.42/2.81 | 点火：2017 年那篇论文 | F1 终端打字机 |
| 4.644–10.913s | SURGE @4.676（e=0.93），军鼓流 4.78–9.24 | 破门：主标题砸字 | F2 kinetic cascade |
| 10.913–22.662s | kick 流加密，roll @12.4，roll 21.8–22.6 加速 | 蓄能：编年史 → 产品时代 | F3 瓷砖墙+卡片flyby |
| 22.662–36.966s | **DROP @23.676（e=0.94，全曲最高点）** | 爆发 | F4 频闪+代码雨+数据卡 |
| 36.966–48.599s | 25-onset 密集尾段，最后一次军鼓 @47.28 | 释放→定格 | F5 字拳+反色+终砸 |
| 48.599–51.293s | **音乐骤停（95s 处）** | 落版 | F6 静音黑场+署名 |

关键认知：**"起承转合"一个字都没编，全是曲子里本来就有的。** 分镜工作只是"读出来"。

## 1.2 每个段落的设计意图

- **F1 冷启动（终端打字机）**：开场是音乐最安静的四秒半，用 CRT 终端质感"低开"。`$ boot --year 2017` + 逐词打出 "attention is all you need"，kick 落下时关键词 "transformer" 砸入并在尾部三次击中时切换字体（ serif/mono/brand 交替）。意图：AI 故事的奇点就是那篇论文，打字机 = 诞生的仪式感。低开是为了给后面蓄落差。
- **F2 主标题（kinetic cascade）**：SURGE 就是"门被踹开"，所以第一个 kick（4.676）同步砸下 460px 巨型中文词「机器/学会了/思考」逐词 reveal，kick 9.59 落 climax「ai 觉醒」（全片第一次出现橙色大字）。意图：把主题句拆开，让音乐一句一句"顶"出来。
- **F3 里程碑蓄能（瓷砖墙 → 卡片纵深 flyby）**：kick 流越来越密，对应"历史在加速"。前半 12 块真实里程碑瓷砖（alexnet/alphago/transformer/gpt-3/chatgpt/sora/deepseek-r1/kimi k2…）逐拍弹入，roll 时整墙换色；后半 6 张产品卡（chatgpt/gpt-4/claude/kimi/sora/agent 时代）带 18° yaw 从纵深飞来，一张一个 kick。最后一张「agent 时代」**停在 DROP 前一瞬**——蓄能到嗓子眼。
- **F4 爆发（全片峰值）**：DROP 那一瞬做三件事：①「爆发」大字频闪（5 套品牌色反转 look 按 kick 切换）；②二进制代码雨点火，26 列确定性字符流持续漂移，每击翻洗 1/3 列；③三张数据卡砸入——**全部真实数据**："175b parameters · gpt-3"、"100m users · 2 months · chatgpt"、"1 prompt → anything"。尾段接词槽「agents 能做什么：写代码/做设计/剪视频/做科研/开公司」，exit wipe 切走。
- **F5 释放→定格**：25 个 onset 的密集段做 hypercut 字拳（看懂的人/已经/上车/builders win/信息差/就是生产力），一个 kick 一个字；43.56s 出现**全片唯一的反色帧**「all in」（橙底黑字频闪，峰值对比）；47.28s 最后一次军鼓 → 「未来已来」crash-zoom 砸满全屏并 **hold 进静场**。
- **F6 落版**：音乐骤停后 2.7 秒黑场 + 音乐署名。48 秒密不透风的鼓点之后，**静音是最狠的一锤**。

## 1.3 节奏与音画配合的专业技巧（及为什么有效）

1. **beat_cut 硬切**：所有转场落在 `beats_sec` 的拍点上，零淡入淡出。帧边界全部是节拍时间戳（4.644 / 10.913 / 22.662 / 36.966 / 48.599）。硬切+拍点 = 拉片感的来源。
2. **每 2 拍必变规则**：任何镜头 ≈0.8s 内必须有可见变化。F3 一个 11.7s 的段落里藏了 4 个镜头（瓷砖弹入→整墙换色→纵深 flyby→卡片连发）。
3. **三层节奏嵌套**：拍（0.4s，字母/瓷砖/代码雨闪烁）→ 小节（1.6s，大字/场景）→ 乐句（~12s，段落能量升降）。
4. **重音稀缺原则**：全片只砸 2 个 bass impact（23.676 DROP、47.276 终砸），音量 1.0/0.95 拉满；标题处 4.676 给一个 0.9。砸多了就没有重音。
5. **铺垫-释放**：riser 音效 13.65s 起铺、时长 10.03s——**正好推到 DROP 点 23.68s**。没有铺垫的高潮只是噪音。
6. **kick 同步屏幕微震**：`shakeFx()` 在每次 kick 给画面 0.03s×N 步的衰减抖动（`steps(1)` 离散缓动），身体能"感觉"到鼓点而不只是听到。
7. **静默即重锤**：47.28 终砸后 hold 进 48.6s 的骤停黑场。快不是目的，"快→骤停"的落差才是。
8. **真实信息当燃料**：快剪每秒都在收观众的"注意力税"，真实数据（175B 参数、100M 用户）让 0.8s 一闪而过也值得。frame.md 里有硬规则：任何数字不得编造。

---

# 二、具体的创作方式

## 2.1 技术栈与完整工作流

| 层 | 工具 | 版本/参数 |
|---|---|---|
| 视频框架 | HyperFrames（npm 包，项目内 pin 死版本） | `hyperframes@0.8.73` |
| 工作流 skill | `/music-to-video`（自带分析器与校验脚本） | `C:/Users/AIMFl/.agents/skills/music-to-video/scripts/` |
| 动画 | GSAP（本地化） | 3.15，`assets/gsap.min.js` |
| 节拍分析 | Python + librosa | `pip install librosa numpy soundfile` |
| 音频处理 | ffmpeg | 8.1.1 |
| 字体 | Google Fonts 下载到本地 | Barlow 400/600/700/800/900、IBMPlexMono-500、NotoSansSC-700/900 |

完整步骤（按真实执行顺序）：

```bash
# 0. 初始化：hyperframes 项目（index.html + compositions/ + package.json pin 版本）
# 1. 选曲下载：incompetech 全曲 mp3 → assets/bgm.mp3（161s）
# 2. 全曲节拍分析（关键：对全曲做，不是裁切后）
python analyze-beatgrid.py assets/bgm_full.mp3 --out audiomap_full.json
# 3. 裁窗：取 46.324–97.617，尾 1.79s 淡出，边缘 snap 到 downbeat
ffmpeg -y -v error -ss 46.324 -t 51.293 -i assets/bgm.mp3 \
  -af "afade=t=out:st=49.5:d=1.79" -c:a libmp3lame -b:a 256k assets/bgm_full.mp3 \
  && mv assets/bgm_full.mp3 assets/bgm.mp3
# 4. 从全曲分析图平移出窗口版 audiomap.json（beats_sec 整体 -46.324，丢弃窗外拍点）
#    ——这一步是手工脚本做的，原因见「踩坑①」
# 5. 写 STORYBOARD.md（逐乐句对照能量曲线，role_bindings 绑定 onset 时间戳）
# 6. 写 frame.md 品牌规范（Broadside 预设），字体全部下载到 assets/fonts/
# 7. 6 个帧文件并行构建（subagent 并行），组装 index.html + SFX 音轨层
# 8. 三道质量闸：
node validate-plan.mjs            # 帧铺满 51.293s、0 缝隙、0 warning
npm run check                     # = npx hyperframes@0.8.73 check（lint+layout+motion+contrast）
#    21 个时间点截图 → snapshots/review/contact-sheet-1/2/3.jpg 人工审阅
# 9. 渲染：
npx hyperframes render . --skill=music-to-video -q delivery -o renders/ai-beat-sync.mp4 --fps 30
# 10. 成片复核（从成片本身抽帧，每个时间点单独一条命令）：
ffmpeg -y -v error -ss 23.8  -i renders/ai-beat-sync.mp4 -frames:v 1 renders/verify-23.8.png
ffmpeg -y -v error -ss 30    -i renders/ai-beat-sync.mp4 -frames:v 1 renders/verify-30.png
ffmpeg -y -v error -ss 47.5  -i renders/ai-beat-sync.mp4 -frames:v 1 renders/verify-47.5.png
ffprobe -v error -show_entries format=duration -show_entries stream=codec_type,codec_name \
  -of default=noprint_wrappers=1 renders/ai-beat-sync.mp4
```

## 2.2 项目结构与关键模块

```
ai-beat-sync/
├── index.html                  # 主合成：6 帧拼装 + BGM + 14 个 SFX cue + 根时间轴
├── compositions/frames/        # 6 个独立帧（每个是完整 HTML：template/style/stage/script）
│   ├── 01-f1-boot.html         # 349 行  终端打字机
│   ├── 02-f2-title.html        # 428 行  kinetic cascade 主标题
│   ├── 03-f3-montage.html      # 647 行  瓷砖墙 + 卡片 flyby
│   ├── 04-f4-drop.html         # 920 行  频闪 + 代码雨 + 词槽（全片最重）
│   ├── 05-f5-finale.html       # 555 行  字拳 + 反色 + 终砸
│   └── 06-f6-outro.html        # 200 行  静音落版
├── audiomap.json               # 节拍网格（地面真相）
├── STORYBOARD.md / BRIEF.md / frame.md
├── validate-plan.mjs           # plan 校验（从 skill 拷贝）
└── assets/  bgm.mp3 · fonts/ · sfx/ · gsap.min.js
```

**index.html 的组装逻辑**：每个帧是一个 `<div data-composition-src="..." data-start="..." data-duration="...">`，音频是独立 `<audio>` 元素挂 track-index。帧边界全部取 `audiomap.grid.beats_sec` 的值：

```html
<div id="root" data-composition-id="main" data-start="0" data-duration="51.293"
     data-width="1920" data-height="1080">
  <div class="frame" data-composition-id="01-f1-boot"
       data-composition-src="compositions/frames/01-f1-boot.html"
       data-start="0" data-duration="4.644" data-track-index="1"></div>
  <!-- …F2–F6 依次首尾相接… -->
  <audio id="el-bgm" src="assets/bgm.mp3" data-start="0" data-duration="51.293"
         data-track-index="11" data-volume="0.9"></audio>
  <audio id="sfx-riser" src="assets/sfx/riser.mp3" data-start="13.65"
         data-duration="10.03" data-track-index="15" data-volume="0.4"></audio>
  <!-- …共 14 个 SFX cue… -->
</div>
<script>
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = gsap.timeline({ paused: true });  // 每合成一条 paused 根时间轴
</script>
```

**每个帧文件的骨架**（HyperFrames 契约）：`<template>` 内自带 `<style>`（含完整 @font-face 块）、`#stage`（1920×1080）、`<script>` 注册一条 paused 时间轴到 `window.__timelines[帧ID]`，**帧内所有时间都是帧本地秒**（帧起点=0），时间戳全部来自 STORYBOARD 的 role_bindings。

```js
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({ paused: true });
// …所有动画按秒级时间戳排进 tl…
tl.seek(0);
window.__timelines["01-f1-boot"] = tl;
```

## 2.3 每种视觉风格的代码实现

| 帧 | 风格 | 实现机制 |
|---|---|---|
| F1 | CRT 终端/打字机 | 逐词 `fromTo`（`back.out(2)`）按 onset 弹出；扫描线 = `repeating-linear-gradient` 静态层，kick 时脉冲 opacity；光标闪烁 = 拍点时刻 `tl.set` 交替 autoAlpha；尾部三次击中用 `tl.set` 切 fontFamily（serif→mono→brand） |
| F2 | kinetic typography | 460px 巨词逐字 stagger；`opacity:0;visibility:hidden` 写在 CSS 基线；顶部 surge bar `scaleX(0→1)`；幻影序号用 `-webkit-text-stroke: 1px` 描边空心字 |
| F3 | 瓷砖墙 + z 轴 flyby | 12 瓷砖按 kick 累积弹入 → roll 时整体换色 → 蛇形填充；卡片 `perspective` + `rotationY:18°` + z 位移，落地时间 = kick 时间戳 |
| F4 | 频闪/代码雨/数据卡 | 见下方三段核心代码 |
| F5 | hypercut 字拳/反色/终砸 | 每 onset 一个 fromTo 砸字 + `overwrite:"auto"`；「all in」= 5 套 look 的反转版（橙底黑字）；crash-zoom = scale fromTo + 色差 ghost 层 |
| F6 | 落版 | 静态排版 + 单 whoosh，无任何运动 |

**核心代码①：确定性随机（全片禁用 `Math.random`——渲染必须可复现）**

```js
function mulberry32(a) {           // 种子 PRNG：同一工程两次渲染结果一致
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

**核心代码②：kick 同步屏幕抖动（衰减步进，`steps(1)` 离散化）**

```js
function shakeFx(target, t, amp, steps) {
  for (var k = 0; k < steps; k++) {
    var a = amp * (1 - k / steps);
    tl.to(target, { x: (k % 2 ? -a : a) * 0.9, y: (k % 3 ? a * 0.6 : -a * 0.5),
      duration: 0.03, ease: "steps(1)", overwrite: "auto" }, t + k * 0.03);
  }
  tl.to(target, { x: 0, y: 0, duration: 0.08, ease: "power2.out",
    overwrite: "auto" }, t + steps * 0.03);
}
```

**核心代码③：二进制代码雨（26 列 × 74 行，纯 DOM，无 canvas）**

```js
function rainString(seed, len) {
  var r = mulberry32(seed), s = "";
  for (var i = 0; i < len; i++) {
    var v = r();
    if (v < 0.86) s += r() < 0.5 ? "0" : "1";
    else s += "▓▒░".charAt(Math.floor(r() * 3));
    if (i < len - 1) s += "\n";
  }
  return s;
}
// 每列一条 strip，textContent 预生成；整段持续匀速漂移：
tl.fromTo(strip, { y: startY }, { y: endY, duration: G2_LEN, ease: "none",
  immediateRender: false }, 3.437);
// 每次击中翻洗 1/3 列（轮换），并脉冲一次亮度：
FLICK.forEach(function (t, h) {
  for (var i = 0; i < NCOL; i++) {
    if ((i + h) % 3 !== 0) continue;
    tl.set(strips[i], { textContent: rainString(5000 + i * 131 + h * 991, ROWS) }, t);
    tl.fromTo(cols[i], { opacity: Math.min(1, OP[i] + 0.55) },
      { opacity: OP[i], duration: 0.4, ease: "power2.out",
        overwrite: "auto", immediateRender: false }, t);
  }
});
```

**核心代码④：DROP 频闪（5 套品牌反转 look，按 kick 硬切；浅色 look 时 chrome 同步翻黑）**

```js
var G1_LOOKS = [
  { bg: "#E85D26", ink: "#111111" },  // 0 全反色（DROP 专用）
  { bg: "#F0ECE5", ink: "#111111" },  // 1 米白闪
  { bg: "#111111", ink: "#F0ECE5" },  // 2 米白字
  { bg: "#111111", ink: "#E85D26", scan: true },    // 3 故障扫描
  { bg: "#111111", ink: "transparent", outline: true }, // 4 描边幻影
];
function showLook(idx, t) {
  if (curLook >= 0) tl.set(lookEls[curLook], { opacity: 0 }, t);
  if (idx >= 0)     tl.set(lookEls[idx],     { opacity: 1 }, t);
  var chrome = (idx === 0 || idx === 1) ? "#111111" : "#888880"; // 浅色 look 翻黑 chrome
  tl.set(["#g1 .fx_kicker", "#g1 .fx_meta"], { color: chrome }, t);
  curLook = idx;
}
// THE DROP —— 23.676 本地 0.998：全反色 hold + 最大幅度抖动
showLook(0, 0.998); shakeFx("#g1_inner", 0.998, 30, 10);
```

## 2.4 音频处理

- **BGM 裁窗**：上面的 ffmpeg 命令。`-ss 46.324 -t 51.293` 窗口边缘 snap 到 downbeat；`afade=t=out:st=49.5:d=1.79` 尾部淡出；重编码 `libmp3lame -b:a 256k`。
- **卡点**：不靠耳朵对拍。`audiomap.json` 的 `grid.beats_sec[]` 是唯一时钟源，帧边界、动画时间戳、SFX 的 `data-start` 全部从里面取值。
- **SFX 音效层**：14 个 cue 作为独立 `<audio>` 元素挂在 track 12–16，与 BGM 解耦，用 `data-volume` 调平。完整 cue 表：

| 时间 | 音效 | 音量 | 作用 |
|---|---|---|---|
| 0.10 | typing | 0.5 | 终端打字 |
| 2.42 | key-press | 0.6 | kick 同步击键 |
| 4.644 | whoosh-cinematic | 0.55 | SURGE 转场 |
| 4.676 | impact-bass-1 | 0.9 | 主标题砸点 |
| 12.399 | glitch-1 | 0.4 | roll 铺底 |
| **13.65 + 10.03s** | **riser** | 0.4 | **9 秒铺垫，正好推到 DROP** |
| **23.676** | **impact-bass-2** | **1.0** | **DROP 砸点（全片最重）** |
| 25.588 | glitch-2 | 0.35 | roll ride |
| 27.66 / 29.95 | click ×2 | 0.5 | 数据卡落点 |
| 36.966 | glitch-3 | 0.4 | F5 进入 |
| 44.164 | whoosh-short | 0.6 | roll 转场 |
| **47.276** | **impact-bass-1** | **0.95** | **终砸「未来已来」** |
| 48.599 | whoosh-cinematic | 0.3 | 落版收尾 |

- **淡入淡出**：全片只有两处"淡"：BGM 尾部 1.79s 淡出（ffmpeg afade，渲染前烤进音频），以及落版 whoosh 的自然衰减。画面侧零淡入淡出，全部硬切。
- **静音设计**：F6 没有任何新声音——骤停本身就是音效。

## 2.5 渲染与导出

```bash
npx hyperframes render . --skill=music-to-video -q delivery -o renders/ai-beat-sync.mp4 --fps 30
```

- `-q delivery`：交付质量预设；分辨率跟随合成根节点 `data-width/height`（1920×1080）；`--fps 30`。
- 产出实测（ffprobe）：H.264 + AAC，duration 51.300s，15,764,101 字节 ≈ **15.0MB**，总码率约 2.46 Mbps。
- **体积结论**：51 秒 15MB 已在微信/飞书可直接发送的范围内，无需二次压缩。若以后做更长片子需要压缩，再上一道 `ffmpeg -crf 23 -preset slow` 即可，但本次没动渲染原片——**交付的就是渲染直出**。
- 版本锁定：`package.json` 里 pin 了 `hyperframes@0.8.73`，保证几个月后重渲染结果一致。

## 2.6 时间分配与提速建议

本次为无人值守连续作业，墙钟跨度约十几小时（含渲染等待与中断），活跃工时的大致分布：

| 环节 | 占比（估） | 说明 |
|---|---|---|
| 选曲 + 节拍分析 + 裁窗 | ~15% | 含一次作废重跑（见坑①），是最不该浪费的循环 |
| 分镜 + 品牌规范 | ~15% | STORYBOARD 写细了，后面帧开发几乎零返工 |
| 6 帧并行构建 | ~35% | 最耗时。F4 一帧就 920 行、3 个 group |
| check 修复循环 | ~15% | 字体/transform/闪帧/重叠标注，修一轮过一轮 |
| 截图审阅 + 渲染 + 复核 | ~20% | 21 点截图 + 3 次成片抽帧 |

**提速方法（按收益排序）：**
1. **帧开发用 subagent 并行**（本次已做）：6 帧同时开工，品牌块统一注入，比串行快 3 倍以上。
2. **别在裁切后的音频上重跑分析器**（坑①）：直接全曲分析 + 平移，省掉一整个作废循环。
3. **validate-plan 在渲染前跑**：时间轴缝隙在数据层一秒查出，渲染后肉眼极难抓。
4. **check 报错当天修完再渲染**：本次 layout/contrast/motion 全绿后才渲染，一次渲染即通过，没有返工渲染。
5. 沉淀 SFX 库与帧模板（typing/cascade/strobe/rain 都是可复用模板），下次同类型片子直接进入拼装模式。

---

# 三、注意事项与踩过的坑

## 3.1 逐项打勾清单

**开工前**
- [ ] 选曲看能量结构（冷启动+蓄力+DROP+收尾），不看旋律喜好；授权可商用（CC-BY 需署名）
- [ ] 节拍分析器跑的是**完整原曲**；BPM 结果人工抽听验证（数 10 秒拍数 ×6）
- [ ] 裁窗边缘 snap 到 downbeat；窗口本身有起承转合
- [ ] 品牌预设落到 frame.md（色板/字体/使用纪律）；**字体全部下载本地化**，禁用网络字体
- [ ] `package.json` pin 死 hyperframes 版本
- [ ] 环境依赖装好：`librosa numpy soundfile`、ffmpeg、本地 GSAP
- [ ] 预览用 `npx hyperframes preview --background`（agent 安全），不要 `npm run dev` 挂前台

**制作中**
- [ ] 每个帧文件**各自**在 `<style>` 顶部声明完整 @font-face 块（相对宿主根路径）
- [ ] 所有时间戳取自 audiomap，单位**秒**；帧内用帧本地时间（帧起点=0）
- [ ] 初始隐藏状态写进 **CSS**（`opacity:0;visibility:hidden`），运动态归 GSAP
- [ ] transform 权柄全归 GSAP：居中用 `xPercent/yPercent`，CSS 里不写 `transform: translate(...)`
- [ ] 同一元素多个 fromTo：后面的全部加 `immediateRender:false`
- [ ] 全片禁 `Math.random()` / `Date.now()` / 网络请求：随机用种子 PRNG（mulberry32）
- [ ] 每合成注册一条 paused 根时间轴到 `window.__timelines[id]`；子时间轴不得 paused
- [ ] 重音砸点 ≤2 个；riser 提前 8–10 秒铺；每 2 拍必有可见变化
- [ ] 数字/事实全部真实，不得编造

**导出前**
- [ ] `node validate-plan.mjs`：0 缝隙 0 warning → 才允许渲染
- [ ] `npm run check`：layout / contrast / motion 全绿；蓄意重叠已标 `data-layout-allow-overlap`（溢出标 `data-layout-allow-overflow`）
- [ ] 换色/反色 look 下 chrome 元素对比度单独检查
- [ ] 逐拍截图 contact sheet 人工审阅：无空白帧、无意外重叠、中英字体正确
- [ ] SFX 音量分层：砸点 0.9–1.0，铺垫 0.3–0.5

**交付前**
- [ ] 抽帧从**成片文件**验证关键砸点；**每个时间点单独一条 ffmpeg 命令**
- [ ] ffprobe 确认双流（h264+aac）、时长、体积在可分享范围
- [ ] 音乐署名压进落版帧（CC-BY 义务）
- [ ] 临时验证图（verify-*.png）清理出 renders/

## 3.2 踩过的坑（现象 / 根因 / 解决 / 预防）

**坑① 裁切后的音频重跑节拍分析器，得到假网格（最危险）**
- 现象：对裁好的 51s 音频重跑 `analyze-beatgrid.py`，输出 BPM=78（真实 152）+ 不存在的鼓 roll。若拿它对剪，全片节奏报废。
- 根因：裁切产生的新起止瞬态和相位截断干扰了 librosa 的节拍跟踪；窗口中段的高能量也带偏了 tempo 估计。
- 解决：废弃重跑结果，改用**全曲分析图**（audiomap_full.json），写了个小脚本把 `beats_sec` 整体平移 -46.324 并丢弃窗口外拍点，生成窗口版 audiomap.json。
- 预防：**节拍分析永远只对完整原曲跑一次**；裁窗只做算术平移；正确的 audiomap 是成果物，永不再跑分析器覆盖它。

**坑② ffmpeg 一条命令抽多帧，第二个 `-ss` 静默失效**
- 现象：`ffmpeg -ss 23.8 -i x out1 -ss 47.5 -i x out2` 产出两张**字节级相同**的图，差点误判"渲染画面没变化"。
- 根因：ffmpeg 选项作用域问题，第二个输入的 `-ss` 没生效。
- 解决/预防：**每个时间点单独跑一条命令**；抽帧结果肉眼确认内容确实不同。

**坑③ 帧文件里字体静默回退**
- 现象：帧预览/渲染时 Barlow/Noto 没生效，悄悄回退到系统字体，版面气质全变。
- 根因：帧是独立 HTML 片段（`<template>` 挂载），宿主页面的 @font-face 不自动覆盖帧内渲染上下文。
- 解决：6 个帧文件各自在 `<style>` 顶部注入相同的 @font-face 块，路径相对宿主根（`assets/fonts/...`）。
- 预防：把"帧文件头部字体块"做成模板片段，新帧从模板起手。

**坑④ CSS transform 与 GSAP transform 打架**
- 现象：02 帧 `.g1_ring` 居中用 CSS `transform: translate(-50%,-50%)`，GSAP 一动 transform，居中偏移被覆盖，元素跳位。
- 根因：CSS 和 GSAP 写同一个 transform 属性，GSAP 不感知 CSS 里的初值。
- 解决：居中改由 GSAP 承担（`xPercent:-50, yPercent:-50`），CSS 不再碰 transform。
- 预防：立规矩——**transform 权柄全归 GSAP 一家**。

**坑⑤ fromTo 缺 `immediateRender:false` 导致闪帧**
- 现象：05 帧 `#g3_zoom` 两个 fromTo，后写的 tween 在时间轴起点就把元素渲染到 from 态，画面闪一下再跳走。
- 根因：fromTo 默认 immediateRender:true，多个 fromTo 共用元素时互相抢"初始渲染权"。
- 解决：后续 fromTo 一律 `immediateRender:false`，并在 CSS 写好 `opacity:0` 基线。
- 预防：新写 fromTo 时自问"这是该元素的第一个 tween 吗？不是就加 immediateRender:false"。

**坑⑥ 初始隐藏写在 JS 里，首帧闪现**
- 现象：05 帧 `#g2` 的"初始不可见"由 JS `gsap.set` 设置，渲染首帧已经画出可见状态，闪一下才隐藏。
- 根因：JS 执行晚于首帧绘制。
- 解决：初始隐藏态移入 CSS（`opacity:0;visibility:hidden`）。
- 预防：**初始态归 CSS，运动态归 GSAP**——分工写进模板。

**坑⑦ 蓄意重叠被 layout 检查全部误报**
- 现象：check 报大量重叠 error——但色差层、频闪层、纵深卡片本来就是设计好的叠层。
- 根因：静态检查无法区分"故意"和"事故"。
- 解决：蓄意重叠显式标注 `data-layout-allow-overlap`（f3 卡片、f4 频闪层、f5 色差层），代码雨溢出标 `data-layout-allow-overflow`；其余报错当真 bug 修。
- 预防：设计叠层时同步写豁免标注；标注 = 设计师声明"这里我知道我在干什么"。

**坑⑧ 浅色 look 下 chrome 元素对比度失效**
- 现象：04 帧切到橙色/米白 look 时，顶部 kicker 等装饰文字还是深色模式的灰（#888880），在浅底上糊掉。
- 根因：换 look 只换了底和字，没换 chrome。
- 解决：`showLook()` 里同步翻 chrome 色（浅 look → #111111，深 look → #888880）。
- 预防：任何"换肤"函数，检查清单里加一项"chrome/装饰元素是否同步"。

**坑⑨ 拍不是整数帧**
- 152BPM/30fps：1 拍 = 11.84 帧。若用"持续 12 帧"的思维排动画，51 秒会累积出可感知的脱拍。
- 解决/预防：全片只允许一种计时单位——**秒**，且全部取自 beats_sec。

**坑⑩ 环境/依赖的不确定性**
- 现象（隐患）：网络字体在离线渲染时可能加载失败，导致同一工程两次渲染字形不同。
- 解决：8 个字体文件全部下载到 `assets/fonts/`，GSAP 本地化为 `assets/gsap.min.js`；hyperframes 版本 pin 在 package.json。
- 预防：项目零网络依赖——**可复现才可迭代**。

---

# 四、可复用的模板

## 4.1 代码视频制作流程模板

```
【Phase 0 · 立项】(10min)
  BRIEF.md：主题 / 时长区间 / 品牌预设 / 质量底线(无重叠无空白) / 交付格式

【Phase 1 · 音乐即剧本】(30–60min)
  1. 选曲：能量结构完整(冷启动+蓄力+DROP+收尾)，BPM 140–160，授权可商用
  2. python analyze-beatgrid.py <全曲> --out audiomap_full.json
  3. 按能量曲线裁窗，边缘 snap downbeat：
     ffmpeg -y -v error -ss <起> -t <时长> -i full.mp3 \
       -af "afade=t=out:st=<时长-1.8>:d=1.8" -c:a libmp3lame -b:a 256k bgm.mp3
  4. 从 audiomap_full.json 平移生成窗口版 audiomap.json（勿对裁后音频重跑！）

【Phase 2 · 分镜与品牌】(30min)
  5. STORYBOARD.md：逐乐句映射能量曲线；每帧给出 role_bindings（onset 时间戳）
  6. frame.md：色板+字体+纪律；字体下载到 assets/fonts/

【Phase 3 · 并行构建】(主体工时)
  7. 每帧一个独立 HTML：@font-face 块 + #stage + paused 时间轴注册
     —— 多个帧用 subagent 并行开发，品牌块统一模板
  8. index.html 组装：帧 div 首尾相接 + BGM(track 11) + SFX(track 12–16)

【Phase 4 · 质量闸】(渲染前必须全绿)
  9. node validate-plan.mjs        → 0 缝隙 0 warning
 10. npm run check                 → layout/contrast/motion 全绿
 11. 逐拍截图 contact sheet 人工审阅

【Phase 5 · 渲染与复核】
 12. npx hyperframes render . --skill=music-to-video -q delivery -o renders/<名>.mp4 --fps 30
 13. 成片抽帧复核（每个时间点单独一条 ffmpeg 命令）+ ffprobe 双流确认
 14. 清理临时文件，交付
```

## 4.2 给 AI 的开工提示词模板

```
用 HyperFrames 的 /music-to-video 工作流做一支卡点视频。硬性规则如下，逐条遵守：

【主题与素材】主题：<填主题>。BGM 网上找可商用曲目（CC-BY 优先，140–160BPM，
须含冷启动+蓄力+DROP+骤停结构），按能量曲线裁窗，窗口边缘 snap 到 downbeat。

【节拍纪律】节拍分析只对完整原曲做一次（python analyze-beatgrid.py 全曲 --out
audiomap_full.json），窗口版用算术平移生成，禁止对裁切后音频重跑分析器。全片
所有时间点（帧边界/动画/SFX）取自 audiomap.grid.beats_sec，单位秒，禁用帧数思维。

【画面纪律】1920×1080@30fps。每个帧文件自带完整 @font-face（字体已本地化到
assets/fonts/，禁网络字体）。初始隐藏态写 CSS，运动态归 GSAP；transform 权柄
全归 GSAP（居中用 xPercent/yPercent）；非首个 fromTo 加 immediateRender:false；
禁 Math.random/Date.now/网络请求（随机用 mulberry32 种子）。每合成注册一条
paused 根时间轴到 window.__timelines。

【节奏纪律】全部拍点硬切，零淡入淡出；任何镜头每 2 拍必须有可见变化；全片
bass impact 砸点 ≤2 个（DROP + 终砸）；riser 提前 8–10 秒铺到 DROP；结尾用
音乐骤停做落版。屏幕抖动用 steps(1) 离散缓动同步 kick。

【风格纪律】一套品牌色板+字体锁死全片；点缀色出场 <15% 且只在情绪顶点；
字体分工=信息分层（巨字情绪/中字重锤/mono 小字数据）；每种视觉技法全片只用
一次；所有数字必须真实可查。

【质量闸（渲染前必须全绿）】node validate-plan.mjs 0 缝隙 0 warning → npm run
check（layout/contrast/motion 全绿；蓄意重叠标 data-layout-allow-overlap）→
逐拍截图 contact sheet 人工审阅（无空白/无意外重叠/中英字体正确）。

【渲染与交付】npx hyperframes render . --skill=music-to-video -q delivery -o
renders/<名>.mp4 --fps 30；成片抽帧复核（每时间点单独 ffmpeg 命令）+ ffprobe
确认双流与体积；CC-BY 署名压进落版帧；清理临时验证文件。

时长：<30–60s>。底线：无画面重叠、无空白帧、无脱拍。
```

---

*复盘完成。本文件 + 项目内的 BRIEF.md / STORYBOARD.md / frame.md / audiomap.json 构成完整可复刻资产，下次同类型片子直接从 Phase 1 起跑。*
````

### 3/20 · `ai-beat-sync/BRIEF.md`
<!-- casebook-file {"path": "ai-beat-sync/BRIEF.md", "lines": 18, "final_newline": true, "sha256": "7568005bc92fefdaa96cd0a9d26041f3274ac853c2dd4afe7e1740b2150775bd", "original_sha256": "7568005bc92fefdaa96cd0a9d26041f3274ac853c2dd4afe7e1740b2150775bd"} -->
```markdown
# BRIEF — ai-beat-sync

- **workflow**: music-to-video
- **flow**: automation
- **storyboard**: no
- **mode**: autonomous（用户明确要求自主高速推进："用最快的节奏"、"你自己决定"）
- **subject**: AI —— 高燃卡点拉片视频，传递"AI 正在改变世界/有价值的信息差"主题
- **message**: AI 浪潮已至，智能体时代全面爆发 —— 看懂的人已经上车。
- **destination**: 通用大屏/社媒横屏 → **1920x1080, 30fps**
- **music**: Kevin MacLeod — Volatile Reaction（incompetech.com, CC-BY 4.0），`assets/bgm.mp3`，源时长 165s，按需截取高能量段（目标成片约 60–90s，节奏优先）
- **narration**: no（无旁白，kinetic typography + 视觉卡点驱动）
- **language**: 中文为主字幕（用户语言），搭配英文科技词点缀
- **audio-status**: 未登录 HeyGen（非交互），走离线路径：BGM 直接从网络下载免版税音源，成功
- **user directives**（显式要求）:
  - 节奏必须快，高燃卡点；宁可 30 秒也要快
  - 一个镜头内也要以秒级为单位持续变化/解析
  - 顶尖 AE/MG 设计水准：立体效果、代码动画、剪辑卡点、音效设计、字幕、艺术化表现
  - 底线：无画面重叠、无画面空白等基础问题
```

### 4/20 · `ai-beat-sync/CLAUDE.md`
<!-- casebook-file {"path": "ai-beat-sync/CLAUDE.md", "lines": 103, "final_newline": true, "sha256": "6361e5d1b78020e6a17a9c31685104d78cb538a080907ca21fd6f88ec21b7fd3", "original_sha256": "6361e5d1b78020e6a17a9c31685104d78cb538a080907ca21fd6f88ec21b7fd3"} -->
````markdown
# HyperFrames Composition Project

## Skills — USE THESE FIRST

**Always invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that are NOT in generic web docs. Skipping them produces broken compositions.

**Doing anything with HyperFrames?** Start at `/hyperframes` — it tells you what HyperFrames can do and which skill or workflow handles your intent (make a video, TTS / BGM, prep footage, author / animate, render, install blocks), confirms your brief up front (the intent layer), and routes every "make me a…" request (a video, a deck, a composition port) to the right workflow. Read it first, especially when there's no project context to orient you. The workflows it routes to:

- `/product-launch-video` — any **website** URL or brief / script → a product launch / SaaS / promo video, or a site tour / showcase featuring the site's own captured visuals.
- `/faceless-explainer` — arbitrary text (topic / article / notes), **no URL, no website capture** → 60-90s faceless explainer.
- `/embedded-captions` — an existing talking-head video (MP4) → the same footage with captions / subtitles added (rail + embed, or pure-cinematic embed); the footage itself is untouched.
- `/talking-head-recut` — an existing talking-head / interview / podcast video (MP4) → the same footage **packaged with designed graphic overlays** (kinetic titles, lower-thirds, data callouts, pull-quotes, side panels, pip) synced to the transcript; the clip plays unchanged underneath. (Plain captions/subtitles → `/embedded-captions`.)
- `/pr-to-video` — a GitHub PR (URL / `owner/repo#N` / "this PR") → 30-90s code-change explainer (changelog / feature reveal / fix / refactor).
- `/motion-graphics` — a short (typically under 10s) design-led **motion graphic**, motion-is-the-message, no narration: kinetic type, a stat / number count-up, a chart, a logo sting, a lower-third / overlay, or an animated tweet / headline / captured-page highlight; rendered to MP4 or a transparent overlay. Longer / narrated / custom → `/general-video`.
- `/music-to-video` — a **music track** (audio file, video to pull audio from, or one generated from a mood brief) → beat-synced video (lyric / slideshow / kinetic promo). Music drives pacing; user-supplied images / videos are cut onto the same beat grid.
- `/slideshow` — a **presentation / pitch deck / interactive deck** — discrete slides, fragment reveals, branching, hotspot navigation, presenter mode. Output is a navigable deck, not a rendered video.
- `/general-video` — fallback for any other video (title card, longer brand / sizzle reel, multi-scene montage, static loop, custom composition) and the home of **companion mode** — co-create with the full HyperFrames toolbox; the original hyperframes authoring flow, any length.

**Porting an existing composition?** `/remotion-to-hyperframes` translates a Remotion (React) composition into HyperFrames HTML — a source migration, separate from the creation workflows above.

The domain skills (`/hyperframes-core`, `/hyperframes-animation`, `/hyperframes-keyframes`, `/hyperframes-creative`, `/hyperframes-cli`, `/media-use`, `/hyperframes-audio`, `/hyperframes-registry`, `/figma`) and the full capability map live inside `/hyperframes` — it is the single source of truth for which skill handles which intent.

**Changing how real footage or images look or reveal?** Load `/media-use` and read its `references/media-treatments.md` before editing, even when the request only says dark, flat, boring, retro, private, or “make the reveal cooler.” It governs how footage is treated, never whether media may be used. Use canonical media treatments and seek-safe motion; do not improvise equivalent CSS/SVG filters or overlays.

> **Tailwind v4 projects** (`hyperframes init --tailwind`): see `/hyperframes-core` → `references/tailwind.md`.

> **Skill missing or stale?** Run `npx hyperframes skills update <name>` to install/refresh
> the specific skill you need (the `/hyperframes` router does this automatically before
> entering a workflow), or bare `npx hyperframes skills update` to refresh the core set plus
> everything already installed — neither pulls the full set. Restart the agent session so
> newly installed skills load.

## Commands

```bash
npm run dev          # human-operated foreground preview (blocks until stopped)
npx hyperframes preview --background  # agent-safe persistent Studio preview
npx hyperframes preview --status      # verify the persistent preview is listening
npx hyperframes preview --stop        # stop it when review is finished
npm run check        # lint + runtime + layout + motion + contrast (one command)
npm run render       # render to MP4
npm run publish      # publish and get a shareable link
npx hyperframes lint --verbose  # include info-level findings
npx hyperframes lint --json     # machine-readable output for CI
npx hyperframes docs <topic> # reference docs in terminal
```

> **Agents must use `npx hyperframes preview --background` for Studio handoff.** Do not rely
> on a shell/tool `run_in_background` wrapper around `npm run dev`: that foreground process
> remains owned by the invoking session and can disappear while the browser stays open,
> leaving refreshes at `ERR_CONNECTION_TIMED_OUT`. Verify with `preview --status`, keep it
> alive through review, and stop it explicitly with `preview --stop` afterward.

> **Pinned CLI version.** These scripts pin an exact `hyperframes@X.Y.Z` so this project re-renders identically over time. Weeks later that pin lags fixes shipped since. To move up: `npx hyperframes@latest upgrade --project . --check` (shows the delta), then `npx hyperframes@latest upgrade --project .` to rewrite the pins. Always unpinned — the pinned script re-runs the old version against itself.

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx hyperframes docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://hyperframes.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`
- `meta.json` — project metadata (id, name)
- `transcript.json` — whisper word-level transcript (if generated)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Warnings should be reviewed before rendering.

## Key Rules

1. Every timed element needs `data-start` and a duration. `data-start` is what marks it as timed; `data-track-index` is an optional Studio display lane the render never reads
2. Give timed visual elements `class="clip"`. The framework keys visibility off `data-start`, not the class, but the shared `.clip` CSS is what gives a scene its full-frame box, and `lint` warns without it
3. Register one paused root timeline per composition on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
   Scene timelines manually added to this root must not be paused. A paused
   child does not advance when the root is seeked. The runtime activates
   registered composition siblings, not arbitrary nested scene timelines.
4. Videos use `muted` with a separate `<audio>` element for the audio track
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches
````

### 5/20 · `ai-beat-sync/MAKING-OF.md`
<!-- casebook-file {"path": "ai-beat-sync/MAKING-OF.md", "lines": 219, "final_newline": true, "sha256": "30b71befd485b4aa055d2ac60f77a0bc9fb85973456d4d93cad1d510cdffb854", "original_sha256": "30b71befd485b4aa055d2ac60f77a0bc9fb85973456d4d93cad1d510cdffb854"} -->
````markdown
# 高燃卡点视频制作方法论

> 以「AI 觉醒」51s 卡点视频（ai-beat-sync 项目）为模板的全流程系统复盘
> 核心方法 · 经验模板 · 踩坑全录 · 第一性思路

---

## 0. 项目档案（参考基准）

| 项 | 值 |
|---|---|
| 成片 | 1920×1080 · 30fps · H.264+AAC · 51.293s · 15MB |
| BGM | Kevin MacLeod《Volatile Reaction》(incompetech, CC-BY 4.0) |
| 节拍 | 152 BPM · 132 拍 · 1 拍 = 0.395s |
| 结构 | 6 帧（Frame）· 全部 beat_cut 硬切 · F6 乐句流 |
| 音效 | 14 个 SFX cue，全部对齐节拍网格 |
| 品牌 | Broadside：墨黑 `#111111` / 火橙 `#E85D26` / 米白 `#F0ECE5` |
| 字体 | Barlow 900（拉丁小写）+ Noto Sans SC 900（中文）+ IBM Plex Mono（数据/代码），全部本地化 |
| 工作流 | hyperframes `/music-to-video` |

时间轴结构（裁窗后的音乐弧线即叙事弧线）：

```
0s      4.6s     10.9s        22.7s(DROP)     37.0s     48.6s    51.3s
|冷启动  |主标题    |里程碑蓄能    |「爆发」释放     |字拳连打   |静音落版  |
 F1      F2        F3            F4             F5        F6
```

---

## 1. 核心方法：九步流水线

整套方法的本质是**把创意决策前置到音乐分析阶段，把正确性验证交给自动化工具**，中间的制作环节只做执行。

### Step 1 · 立项（BRIEF.md）
写下主题、目标时长区间、品牌预设、质量底线（无重叠/无空白）、交付格式。这一步只花十分钟，但它是后面所有取舍的裁判。

### Step 2 · 选曲：能量结构优先于旋律喜好
选曲标准不是"好听"，而是**曲子内部有没有剧情**：有没有安静的冷启动段、有没有渐进蓄力、有没有明确的 DROP、有没有骤停收尾。CC-BY 曲库（incompetech 等）可按 BPM 筛选，152 BPM 是高燃卡点视频的甜区——快到有冲击力，又留得下 0.4s/拍的信息窗口。

### Step 3 · 全曲节拍分析（audiomap.json）
对**完整曲目**跑节拍网格分析，产出：BPM、每一拍的时间戳、能量曲线、重音（crash/军鼓）位置。这份文件是后续一切剪辑决策的**地面真相**，全片没有任何一个时间点是"凭感觉"定的。

### Step 4 · 按能量曲线裁窗
不在原曲头尾硬切，而是找一段**自带起承转合的连续高能窗口**。本片的 51.3s 窗口取自原曲 46.3s–97.6s：冷启动(46s) → SURGE(51s) → DROP(70s, 能量 0.94) → 骤停(95s)，尾部加 1.8s 淡出。**裁窗标准：窗口本身就是一个小故事。**

### Step 5 · 分镜（STORYBOARD.md）：把音乐结构翻译成叙事结构
逐乐句对照能量曲线写分镜：安静段放什么、蓄力段堆什么、DROP 瞬间砸什么、骤停后留什么。叙事主题（AI 简史：机器学会了思考）是在看到能量曲线之后才定型为"点火 → 觉醒 → 蓄能 → 爆发 → 释放 → 落版"的。

### Step 6 · 品牌规范（frame.md）
一套色板 + 两套半字体 + 明确的使用纪律，锁死全局风格（详见 §2.2）。所有字体文件本地化到 `assets/fonts/`，渲染不依赖网络。

### Step 7 · 帧级并行构建 + 组装
每个 Frame 是独立 HTML 片段（GSAP 驱动），可并行开发；统一注入相同的 @font-face 与色板变量。组装进 `index.html` 时挂 SFX 音轨层（独立 track），最后做全片时间轴对齐。

### Step 8 · 三道自动质量闸
1. `validate-plan`：帧序列严丝合缝铺满总时长、0 缝隙、0 重叠警告——**渲染之前**拦住节奏错误；
2. `hyperframes check`：layout（重叠/溢出）、contrast（对比度）、motion 静态检查；
3. 逐拍截图审阅：21 个时间点出 contact sheet，人工过一遍空白帧/意外重叠/字体渲染。

### Step 9 · 渲染 + 像素级成片复核
离线渲染出片后，对三个关键砸点（DROP、数据风暴、终砸）从**成片文件本身**抽帧验证——验证的是用户最终拿到的东西，不是预览。

---

## 2. 经验模板（可直接复用）

### 2.1 节奏把控

**① 音乐是唯一剧本，顺序不可逆。**
先定曲、再分析、后分镜。叙事弧线是从能量曲线里"读"出来的，不是凭空编出来再硬贴到音乐上的。本片的"起承转合"没有一个字是编的，全是曲子里本来就有的。

**② 节拍是剪辑的最小单位，不是装饰。**
所有转场一律拍点硬切（beat_cut），零淡入淡出。硬规则：**任何镜头每 2 拍（≈0.8s）必须发生一次可见变化**。一个 11.7s 的"段落"内部要藏 3–4 个镜头——瓷砖逐拍弹入 → 整墙微震 → 纵深 flyby → 卡片迎面飞过。宁可把片子砍短，也不让任何一秒静止。

**③ 三层节奏嵌套。**

| 层级 | 时长 | 承载 |
|---|---|---|
| 拍（0.4s） | 微观 | 字母 stagger、瓷砖 bounce、代码雨 |
| 小节（1.6s） | 中观 | 大字砸屏、场景切换、视角变化 |
| 乐句（~12s） | 宏观 | 段落转场、能量升降 |

**④ 重音是稀缺资源。**
全片 51 秒只砸了 2 个重音：23.68s 的 DROP「爆发」和 47.28s 的终砸「未来已来」。砸多了就没有重音。军鼓/crash 这种音乐重音点，只配给全片最大的视觉事件。

**⑤ 铺垫-释放结构。**
riser 音效提前 9 秒（13.65s）开始铺渐进紧张感，DROP 那一下才顶得起来。没有铺垫的高潮只是噪音。

**⑥ 静默是最强的鼓点。**
48 秒密不透风的鼓点之后，音乐骤停 + 黑场落版——静音比任何低音炮都响。快不是目的，**"快 → 骤停"的落差才是**。

**⑦ 快剪的底气是信息真实。**
每张卡只停 0.8 秒，但 175B 参数、100M 用户/2 个月、alphago 2016 全是真数据。速度再快观众也能捞到真信息——**密度来自真实，不来自堆砌**。

### 2.2 全局风格

**① 一套品牌锁死全片。**
一个色板 + 两套半字体，6 个帧文件注入完全相同的字体与变量块。目标是让 6 段画面像**同一个角色换了六套动作**，而不是六个人各演各的。

**② 主色的克制使用。**
火橙全片出场时间 < 15%，且**只出现在情绪顶点**（「ai 觉醒」「爆发」「未来已来」）。正因为前 20 秒近乎纯黑白，DROP 那一屏橙色才是一个物理事件，而不是一种颜色。点缀色用得越省，它出现时越狠。

**③ 字体分工 = 信息分层。**
Barlow 巨字（300px+）负责情绪，Noto Sans SC 900 负责中文重锤，Plex Mono 小字（14–20px）负责数据、终端、时间码。**极大与极小同框**本身就是张力：观众一眼知道该看哪，余光又能捕捉到"这片子有料"。

**④ 对比系统贯穿全片。**

| 对比 | 本片实例 |
|---|---|
| 快 / 停 | 字拳快切 → 死冻结在「未来已来」 |
| 噪 / 静 | 鼓点墙 → 48.6s 骤静落版 |
| 黑 / 橙 | 全片黑白 → DROP 反色橙屏 |
| 巨 / 微 | 300px 标题与 14px 数据码同框 |

风格的高级感不来自元素的华丽，来自**对比的纪律**。

**⑤ 技法服务节奏，一次一技。**
kinetic typography 逐字级联、z 轴纵深 flyby、CRT 打字机、二进制代码雨、色差故障层——每种技法只在自己的节拍位置出现一次，用完就走。重复即贬值。

### 2.3 工程方法

- **秒级时间戳锚定一切**：152BPM/30fps 下 1 拍 = 11.84 帧，非整数。所有动画锚定 audiomap 的秒级时间戳，禁用"大约几帧"。
- **SFX 独立音轨层**：14 个 cue 挂独立 track，与 BGM 解耦，对齐节拍网格而非画面事件。
- **蓄意与事故要有边界**：故意的重叠（色差层、频闪层）显式声明豁免；意外的重叠一律当 bug 修。

---

## 3. 踩坑全记录

### 3.1 节拍分析坑（最危险的一个）

**坑：对裁切后的音频重跑节拍分析器，得到完全错误的网格**——BPM 被误判为 78（真实 152），还识别出不存在的鼓 roll。如果拿这份假网格去对剪，全片节奏直接报废。

**解法与纪律：**
- 节拍分析永远对**完整原曲**做，再按裁窗偏移量平移出窗口版 audiomap；
- 裁过的音频会骗分析器（起止瞬态、相位截断都会干扰检测）；
- 正确的 audiomap 是成果物，**永不再跑分析器覆盖它**。

### 3.2 字体与渲染坑

**坑①：帧文件不声明 @font-face 则字体静默回退。** 宿主页面注入了字体不代表各 Frame 片段内生效——每个帧文件必须各自在 `<style>` 顶部声明 @font-face，且用相对宿主根的路径。

**坑②：网络字体破坏渲染确定性。** 离线渲染时网络字体可能加载失败/超时，导致同一工程两次渲染字形不同。所有字体必须下载到本地 `assets/fonts/`。

### 3.3 GSAP 动画坑

**坑①：CSS transform 与 GSAP transform 打架。** 元素在 CSS 里写了 `transform: translate(-50%,-50%)`，GSAP 再操作 transform 时会覆盖它，元素位置跳变。解法：居中定位改用 GSAP 的 `xPercent:-50, yPercent:-50`，transform 的全部权柄交给 GSAP 一家。

**坑②：`fromTo` 缺 `immediateRender:false` 导致闪帧。** 同一元素上多个 fromTo 时，后写的 tween 会在时间轴起点就把元素渲染到 from 态，闪一下再跳走。解法：后续 fromTo 加 `immediateRender:false`，并在 CSS 里写好 `opacity:0` 基线。

**坑③：初始隐藏写在 JS 里会首帧闪现。** 元素"初始不可见"的状态必须写进 CSS（静态基线），JS 里 set 隐藏来不及——首帧已经画出来了。原则：**初始态归 CSS，运动态归 GSAP。**

### 3.4 布局坑

**坑①：check 无法区分"故意重叠"和"意外重叠"。** 色差故障层、频闪层、纵深卡片本身就是设计好的重叠，会被 layout 检查全部报错。解法：蓄意重叠显式标注 `data-layout-allow-overlap`；其余重叠报错一律当真 bug 修。标注是设计师在说"这里我知道我在干什么"。

**坑②：浅色 look 下 chrome 元素对比度失效。** 数据风暴段切换浅色 look 时，边框/装饰线（chrome）还是深色模式的低对比样式，直接糊掉。换 look 时 chrome 必须同步翻色。

### 3.5 验证流程坑

**坑①：ffmpeg 单命令多个 `-ss` 只有第一个生效。** 想一条命令抽两张不同时间点的帧，结果第二张图的 `-ss` 被忽略，两张图内容相同——差点误判"渲染画面没变"。解法：每个时间点单独跑一条命令。

**坑②：不要在 plan 验证之前渲染。** 帧序列有 0.1s 缝隙这种错误，渲染成视频后极难看出来（表现为一闪而过的黑帧），但 validate-plan 一秒就能报出来。**节奏问题必须在时间轴数据层面拦住，不能指望肉眼在成片里找。**

**坑③：拍不是整数帧。** 152BPM/30fps = 11.84 帧/拍。任何"这个动画持续 12 帧"的思维都会累积出可感知的脱拍。全片只允许一种计时单位：秒。

---

## 4. 做类似视频最重要的思路（第一性原理）

### ① 先声后画，顺序不可逆
音乐在前，画面在后。选曲时看的不是旋律，是能量结构；分镜时读的不是剧本，是 audiomap。一切"先做画面再配乐"的流程都做不出真正的卡点片——**卡点的本质是画面服从音乐，而服从只能单向。**

### ② 卡点不是对齐，是剪辑的最小单位
把拍点当成胶片时代的剪辑尺：每一拍都是一个可以下刀的位置，每一个下刀的位置都必须在拍上。转场、砸字、音效、静默，全部落网格。**网格内做尽变化，网格外不做任何动作。**

### ③ 能量守恒：一切效果靠对立面供电
快需要慢衬、响需要静衬、密需要空衬、彩需要黑白衬。一支全片 100% 高燃的视频实际上 0% 高燃——没有对比就没有能量。设计时先问：**我的"静"和"空"在哪里？** 本片答案是：开场的冷启动、DROP 前 9 秒的 riser 蓄力、结尾的骤停黑场。

### ④ 少即是狠
一种点缀色、两个重音砸点、每种技法出场一次。克制不是省料，是**给关键瞬间蓄能**。观众的注意力是固定预算，花在第一百个特效上，就从第一个砸点上扣走了。

### ⑤ 真实即密度
快剪每秒都在向观众收"注意力税"，只有真实信息（真实数据、真实里程碑、真实时间线）能让观众觉得税交得值。假的华丽 0.8 秒就被识破，真的密度值得暂停回看。

### ⑥ 把正确性交给流水线，把创意留给设计
无重叠、无空白、无脱拍这些底线，不靠自觉、不靠肉眼，靠 validate-plan + check + 截图审阅三层自动化闸。人的精力是有限的，**让机器守住底线，人才能去碰上限。**

### ⑦ 确定性工程
字体本地化、秒级锚定、全曲分析固定节拍网格、成片抽帧复核——所有环节都追求"同一工程两次渲染结果一致"。创意可以狂野，工程必须刻板。**可复现，才可迭代；可迭代，才可能出极品。**

---

## 附：开工检查单（Checklist）

```
[ ] BRIEF：主题/时长/品牌/底线 已落盘
[ ] 选曲：能量结构完整（冷启动+蓄力+DROP+收尾），授权清晰
[ ] 全曲节拍分析完成，audiomap 已验证（人工抽听几个拍点）
[ ] 裁窗：窗口本身有起承转合，尾部淡出不突兀
[ ] 分镜：每个乐句有对应画面事件，重音点已分配给最大视觉事件
[ ] 品牌：色板/字体/使用纪律已写进 frame.md，字体已本地化
[ ] 每个帧文件各自声明 @font-face
[ ] 初始隐藏态写在 CSS，transform 权柄全归 GSAP
[ ] fromTo 均已检查 immediateRender
[ ] 全部时间戳来自 audiomap，单位为秒
[ ] 蓄意重叠已标注 data-layout-allow-overlap
[ ] SFX 挂独立音轨，riser 提前铺垫，重音砸点 ≤ 2 个
[ ] validate-plan 通过（0 缝隙 0 警告）→ 才允许渲染
[ ] hyperframes check 通过（layout/contrast/motion）
[ ] 逐拍截图 contact sheet 人工审阅（空白/重叠/字体）
[ ] 成片抽帧复核关键砸点（每个 -ss 单独命令）
[ ] 音乐署名已压进落版帧
```

---

*项目：ai-beat-sync ｜ 工作流：hyperframes /music-to-video ｜ 成片：`videos/ai-beat-sync/renders/ai-beat-sync.mp4`*
````

### 6/20 · `ai-beat-sync/STORYBOARD.md`
<!-- casebook-file {"path": "ai-beat-sync/STORYBOARD.md", "lines": 137, "final_newline": true, "sha256": "d697348f99bd0cc530b0e4e2f64bec5aabbb8fc7693af9fe4266d02b6999c5d3", "original_sha256": "d697348f99bd0cc530b0e4e2f64bec5aabbb8fc7693af9fe4266d02b6999c5d3"} -->
```markdown
---
compositionId: bgm
duration_s: 51.293
canvas: { w: 1920, h: 1080, fps: 30 }
mode: autonomous
style:
  font: "Barlow / IBM Plex Mono / Noto Sans SC"
  palette: ["#111111", "#E85D26", "#F0ECE5", "#888880", "#1A1A18"]
assets: false
build_notes: ["one paused timeline per frame", "no remote assets", "152BPM beat grid is real (rolls + dense phases) — hard cuts on beats", "track window 46.324–97.617 of the source, analysis windowed from the full-track map"]
avoid: ["generic slideshow", "tiny unreadable hero text", "任何画面重叠/空白", "uppercase Barlow display (brand rule: lowercase 900)"]
---

## Frame 1 — f1-boot

- src: compositions/frames/01-f1-boot.html
- duration: 4.644s
- span_sec: [0.0, 4.644]
- pacing: beat_cut
- mood: [dark, tense, glitch]
- feel: cold open — medium-energy onset stream (hihat ticks, kicks at 2.42/2.81) straight out of silence, a terminal waking up

### Groups

- **g1** — template: `typewriter-phrase-keyword-shuffle`
  - span_sec: [0.0, 4.644]
  - params: { bgColor: "#111111", textColor: "#F0ECE5", accentColor: "#E85D26", lead1: "$ boot --year 2017", lead2: "// the paper that changed everything", lead3: "", keyword: "transformer", periodChar: "_" }
  - role_bindings: { type_onsets: [0.14, 0.53, 1.11, 1.51, 1.86, 2.09, 2.23, 2.42, 2.81, 3.23], shuffle_hits: [3.81, 4.23, 4.57] }
  - copy: phrase "attention is all you need"（逐词打出），keyword "transformer" 在尾部三次击中切换字体

## Frame 2 — f2-title

- src: compositions/frames/02-f2-title.html
- duration: 6.269s
- span_sec: [4.644, 10.913]
- pacing: beat_cut
- mood: [hype, aggressive]
- feel: SURGE at 4.676 (e=0.93) — the door kicks open; snare stream 4.78–9.24 drives word-by-word reveals, kick 9.59 lands the climax

### Groups

- **g1** — template: `intro-kinetic-cascade`
  - span_sec: [4.644, 10.913]
  - params: { theme: "dark", icon: "sparkle", phrases: "[{\"words\":[\"机器\"],\"hero\":\"机器\"},{\"words\":[\"学会了\"],\"hero\":\"学会\"},{\"words\":[\"思考\"],\"hero\":\"思考\"}]", climax: "{\"word\":\"ai 觉醒\",\"kicker\":\"the awakening · 智能觉醒\"}" }
  - role_bindings: { phrase: { times: [4.97, 6.55, 7.85] }, climax: { in: 9.59, iconAt: 10.17 } }
  - copy: 机器 / 学会了 / 思考 → climax "ai 觉醒"

## Frame 3 — f3-montage

- src: compositions/frames/03-f3-montage.html
- duration: 11.749s
- span_sec: [10.913, 22.662]
- pacing: beat_cut
- mood: [hype, dark]
- feel: dense kick stream builds (11.6–22.6), kick-roll at 12.4 recolors the wall, second roll 21.8–22.6 accelerates into the DROP

### Groups

- **g1** — template: `poster-tile-mosaic`
  - span_sec: [10.913, 17.229]
  - params: { bgColor: "#111111", tiles: "12 mixed-size sharp-rect tiles", bands: "['#1A1A18','#282826','#E85D26']", gap: "6", showText: true, labels: "['2016 alphago','2017 transformer','2022 chatgpt','2023 gpt-4','2024 sora','2025 agents']", program: "accumulate on kicks → locked global recolor on roll 12.399–12.910 → snake-fill to 17.2" }
  - role_bindings: { accumulate: [11.63, 11.91, 12.91, 13.21, 13.47, 13.72], recolor_roll: [12.399, 12.910], snake_fill: [14.07, 14.35, 14.98, 15.19, 15.90, 16.25, 16.42, 17.14] }
  - copy: AI 编年史瓷砖墙（milestone 年份+事件）
- **g2** — template: `card-flyby`
  - span_sec: [17.229, 22.662]
  - params: { theme: "dark", bgColor: "#111111", cards: "['chatgpt','gpt-4','claude','kimi','sora','agent 时代']", landings: "[17.58, 18.60, 19.39, 20.27, 20.94, 22.43]", yaw: "18" }
  - role_bindings: { landings: [17.58, 18.60, 19.39, 20.27, 20.94, 22.43], accel_roll: [21.803, 22.616] }
  - copy: 产品卡纵深飞来，一张一个 kick，最后一张 "agent 时代" 停在 DROP 前一瞬

## Frame 4 — f4-drop

- src: compositions/frames/04-f4-drop.html
- duration: 14.304s
- span_sec: [22.662, 36.966]
- pacing: beat_cut
- mood: [aggressive, glitch, hype]
- feel: DROP at 23.676 (e=0.94, the biggest hit of the track) — strobe burst, then a dense code-storm middle, then a held anchor + cycling slot to the next roll

### Groups

- **g1** — template: `held-text-strobe-burst`
  - span_sec: [22.662, 26.099]
  - params: { markText: "爆发", fontStyle: "barlow-900-lower", markScale: "0.9", idleColor: "#111111", idleInk: "#E85D26", frames: "ships texture-mask PNGs", strobePlan: "burst on [22.94, 23.38, 23.66, 24.03, 24.31, 24.47] + ride roll 25.588–26.099", decor: "1px hairlines", duration: "3.437" }
  - copy: "爆发"（DROP 砸下的大字，纹理频闪）
- **g2** — free_design
  - span_sec: [26.099, 30.998]
  - free_design: { dominant_system: "terminal code storm — binary-decrypt rain columns + counting-punch stat cards slamming on kicks", primitives: ["binary-decrypt", "counting-punch", "chromatic-split", "screen-shake"], density_topology: "accumulate" }
  - anchors: [26.10, 26.84, 27.66, 28.03, 29.56, 29.95, 30.23, 30.74]
  - copy: 代码雨 + 三张数据卡（真实数据）："175b parameters · gpt-3" / "100m users · 2 months · chatgpt" / "1 prompt → anything"
- **g3** — template: `split-anchor-word-slot`
  - span_sec: [30.998, 36.966]
  - params: { bgColor: "#111111", anchors: "left column rows: agents / 能做什么", theme: "dark", showText: true, program: "slot cycles on onsets → per-beat jitter over dense run 34.88–36.13 → box-zoom exit wipe on 36.69 kick" }
  - role_bindings: { slot_cycle: [31.25, 31.79, 32.25, 33.06, 34.20, 35.92], jitter_run: [34.88, 36.13], exit_wipe: 36.69 }
  - copy: slot 词组：写代码 / 做设计 / 剪视频 / 做科研 / 开公司

## Frame 5 — f5-finale

- src: compositions/frames/05-f5-finale.html
- duration: 11.633s
- span_sec: [36.966, 48.599]
- pacing: beat_cut
- mood: [hype, aggressive]
- feel: 25-onset dense finale — burst of four kicks at 37.2, roll at 44.2, double roll-kick at 46.6, snare 47.28 is the last real hit before the void

### Groups

- **g1** — free_design
  - span_sec: [36.966, 43.560]
  - free_design: { dominant_system: "per-onset hypercut typography — one slammed word per kick, flash-cut frames, palette-flip on snare", primitives: ["flash-cut", "hypercut-whip", "palette-flip", "screen-shake", "braam-punch"], density_topology: "accumulate" }
  - anchors: [37.17, 37.31, 37.45, 37.55, 38.20, 39.10, 39.75, 40.40, 40.52, 41.08, 42.86]
  - copy: 快切字拳："看懂的人" / "已经" / "上车" / "builders win" / "信息差" / "就是生产力"
- **g2** — template: `held-text-strobe-burst`
  - span_sec: [43.560, 46.951]
  - params: { markText: "all in", fontStyle: "barlow-900-lower", markScale: "1.0", idleColor: "#E85D26", idleInk: "#111111", frames: "ships texture-mask PNGs", strobePlan: "strobe ride roll 44.164–44.605, double-hit 45.33 / 45.56, final flicker 46.60–46.95", decor: "none", duration: "3.391" }
  - copy: "all in"（橙底黑字反色频闪——全片唯一反色帧，制造峰值对比）
- **g3** — free_design
  - span_sec: [46.951, 48.599]
  - free_design: { dominant_system: "crash-zoom final slam — one word punches to full-frame on the last snare", primitives: ["crash-zoom-in", "braam-punch", "chromatic-split"], density_topology: "resolve" }
  - anchors: [46.70, 46.86, 47.28]
  - copy: "未来已来"（47.28 军鼓 = 全片最后一次重击，砸满全屏后 hold 进静场）

## Frame 6 — f6-outro

- src: compositions/frames/06-f6-outro.html
- duration: 2.694s
- span_sec: [48.599, 51.293]
- pacing: phrase_flow
- mood: [dark, cinematic]
- feel: VOID — the music cuts to silence (48.676–50.676), only the audio fade-out tail remains; held lockup breathes and dims

### Groups

- **g1** — free_design
  - span_sec: [48.599, 51.293]
  - free_design: { dominant_system: "held lockup — blur-resolve in from the slam, slow dim with the audio fade", primitives: ["blur-resolve"], density_topology: "resolve" }
  - anchors: [48.676]
  - copy: "ai · 未来已来" + mono credit 行 "music: volatile reaction — kevin macleod (cc by 4.0)"
```

### 7/20 · `ai-beat-sync/assets/gsap.min.js`
<!-- casebook-file {"path": "ai-beat-sync/assets/gsap.min.js", "lines": 11, "final_newline": true, "sha256": "92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb", "original_sha256": "92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb"} -->
```js
/*!
 * GSAP 3.15.0
 * https://gsap.com
 * 
 * @license Copyright 2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license.
 * @author: Jack Doyle, jack@greensock.com
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).window=t.window||{})}(this,function(e){"use strict";function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function r(t){return"string"==typeof t}function s(t){return"function"==typeof t}function t(t){return"number"==typeof t}function u(t){return void 0===t}function v(t){return"object"==typeof t}function w(t){return!1!==t}function x(){return"undefined"!=typeof window}function y(t){return s(t)||r(t)}function R(t){return(i=bt(t,ht))&&Fe}function S(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")}function T(t,e){return!e&&console.warn(t)}function U(t,e){return t&&(ht[t]=e)&&i&&(i[t]=e)||ht}function V(){return 0}function ga(t){var e,r,i=t[0];if(v(i)||s(i)||(t=[t]),!(e=(i._gsap||{}).harness)){for(r=yt.length;r--&&!yt[r].targetTest(i););e=yt[r]}for(r=t.length;r--;)t[r]&&(t[r]._gsap||(t[r]._gsap=new Xt(t[r],e)))||t.splice(r,1);return t}function ha(t){return t._gsap||ga(Pt(t))[0]._gsap}function ia(t,e,r){return(r=t[e])&&s(r)?t[e]():u(r)&&t.getAttribute&&t.getAttribute(e)||r}function ja(t,e){return(t=t.split(",")).forEach(e)||t}function ka(t){return Math.round(1e5*t)/1e5||0}function la(t){return Math.round(1e7*t)/1e7||0}function ma(t,e){var r=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),"+"===r?t+i:"-"===r?t-i:"*"===r?t*i:t/i}function na(t,e){for(var r=e.length,i=0;t.indexOf(e[i])<0&&++i<r;);return i<r}function oa(){var t,e,r=pt.length,i=pt.slice(0);for(_t={},t=pt.length=0;t<r;t++)(e=i[t])&&e._lazy&&(e.render(e._lazy[0],e._lazy[1],!0)._lazy=0)}function pa(t){return!!(t._initted||t._startAt||t.add)}function qa(t,e,r,i){pt.length&&!I&&oa(),t.render(e,r,i||!!(I&&e<0&&pa(t))),pt.length&&!I&&oa()}function ra(t){var e=parseFloat(t);return(e||0===e)&&(t+"").match(ot).length<2?e:r(t)?t.trim():t}function sa(t){return t}function ta(t,e){for(var r in e)r in t||(t[r]=e[r]);return t}function wa(t,e){for(var r in e)"__proto__"!==r&&"constructor"!==r&&"prototype"!==r&&(t[r]=v(e[r])?wa(t[r]||(t[r]={}),e[r]):e[r]);return t}function xa(t,e){var r,i={};for(r in t)r in e||(i[r]=t[r]);return i}function ya(t){var e=t.parent||L,r=t.keyframes?function _setKeyframeDefaults(i){return function(t,e){for(var r in e)r in t||"duration"===r&&i||"ease"===r||(t[r]=e[r])}}(K(t.keyframes)):ta;if(w(t.inherit))for(;e;)r(t,e.vars.defaults),e=e.parent||e._dp;return t}function Aa(t,e,r,i,n){void 0===r&&(r="_first"),void 0===i&&(i="_last");var a,s=t[i];if(n)for(a=e[n];s&&s[n]>a;)s=s._prev;return s?(e._next=s._next,s._next=e):(e._next=t[r],t[r]=e),e._next?e._next._prev=e:t[i]=e,e._prev=s,e.parent=e._dp=t,e}function Ba(t,e,r,i){void 0===r&&(r="_first"),void 0===i&&(i="_last");var n=e._prev,a=e._next;n?n._next=a:t[r]===e&&(t[r]=a),a?a._prev=n:t[i]===e&&(t[i]=n),e._next=e._prev=e.parent=null}function Ca(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0}function Da(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var r=t;r;)r._dirty=1,r=r.parent;return t}function Fa(t,e,r,i){return t._startAt&&(I?t._startAt.revert(ft):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))}function Ha(t){return t._repeat?wt(t._tTime,t=t.duration()+t._rDelay)*t:0}function Ja(t,e){return(t-e._start)*e._ts+(0<=e._ts?0:e._dirty?e.totalDuration():e._tDur)}function Ka(t){return t._end=la(t._start+(t._tDur/Math.abs(t._ts||t._rts||q)||0))}function La(t,e){var r=t._dp;return r&&r.smoothChildTiming&&t._ts&&(t._start=la(r._time-(0<t._ts?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ka(t),r._dirty||Da(r,t)),t}function Ma(t,e){var r;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(r=Ja(t.rawTime(),e),(!e._dur||Mt(0,e.totalDuration(),r)-e._tTime>q)&&e.render(r,!0)),Da(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(r=t;r._dp;)0<=r.rawTime()&&r.totalTime(r._tTime),r=r._dp;t._zTime=-q}}function Na(e,r,i,n){return r.parent&&Ca(r),r._start=la((t(i)?i:i||e!==L?Ot(e,i,r):e._time)+r._delay),r._end=la(r._start+(r.totalDuration()/Math.abs(r.timeScale())||0)),Aa(e,r,"_first","_last",e._sort?"_start":0),xt(r)||(e._recent=r),n||Ma(e,r),e._ts<0&&La(e,e._tTime),e}function Oa(t,e){return(ht.ScrollTrigger||S("scrollTrigger",e))&&ht.ScrollTrigger.create(e,t)}function Pa(t,e,r,i,n){return Ht(t,e,n),t._initted?!r&&t._pt&&!I&&(t._dur&&!1!==t.vars.lazy||!t._dur&&t.vars.lazy)&&f!==It.frame?(pt.push(t),t._lazy=[n,i],1):void 0:1}function Ua(t,e,r,i){var n=t._repeat,a=la(e)||0,s=t._tTime/t._tDur;return s&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=n?n<0?1e10:la(a*(n+1)+t._rDelay*n):a,0<s&&!i&&La(t,t._tTime=t._tDur*s),t.parent&&Ka(t),r||Da(t.parent,t),t}function Va(t){return t instanceof Gt?Da(t):Ua(t,t._dur)}function Ya(e,r,i){var n,a,s=t(r[1]),o=(s?2:1)+(e<2?0:1),u=r[o];if(s&&(u.duration=r[1]),u.parent=i,e){for(n=u,a=i;a&&!("immediateRender"in n);)n=a.vars.defaults||{},a=w(a.vars.inherit)&&a.parent;u.immediateRender=w(n.immediateRender),e<2?u.runBackwards=1:u.startAt=r[o-1]}return new te(r[0],u,r[1+o])}function Za(t,e){return t||0===t?e(t):e}function _a(t,e){return r(t)&&(e=ut.exec(t))?e[1]:""}function cb(t,e){return t&&v(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&v(t[0]))&&!t.nodeType&&t!==h}function fb(r){return r=Pt(r)[0]||T("Invalid scope")||{},function(t){var e=r.current||r.nativeElement||r;return Pt(t,e.querySelectorAll?e:e===r?T("Invalid scope")||a.createElement("div"):r)}}function gb(t){return t.sort(function(){return.5-Math.random()})}function hb(t){if(s(t))return t;var p=v(t)?t:{each:t},_=jt(p.ease),m=p.from||0,g=parseFloat(p.base)||0,y={},e=0<m&&m<1,T=isNaN(m)||e,b=p.axis,w=m,x=m;return r(m)?w=x={center:.5,edges:.5,end:1}[m]||0:!e&&T&&(w=m[0],x=m[1]),function(t,e,r){var i,n,a,s,o,u,h,l,f,c=(r||p).length,d=y[c];if(!d){if(!(f="auto"===p.grid?0:(p.grid||[1,X])[1])){for(h=-X;h<(h=r[f++].getBoundingClientRect().left)&&f<c;);f<c&&f--}for(d=y[c]=[],i=T?Math.min(f,c)*w-.5:m%f,n=f===X?0:T?c*x/f-.5:m/f|0,l=X,u=h=0;u<c;u++)a=u%f-i,s=n-(u/f|0),d[u]=o=b?Math.abs("y"===b?s:a):$(a*a+s*s),h<o&&(h=o),o<l&&(l=o);"random"===m&&gb(d),d.max=h-l,d.min=l,d.v=c=(parseFloat(p.amount)||parseFloat(p.each)*(c<f?c-1:b?"y"===b?c/f:f:Math.max(f,c/f))||0)*("edges"===m?-1:1),d.b=c<0?g-c:g,d.u=_a(p.amount||p.each)||0,_=_&&c<0?Yt(_):_}return c=(d[t]-d.min)/d.max||0,la(d.b+(_?_(c):c)*d.v)+d.u}}function ib(i){var n=Math.pow(10,((i+"").split(".")[1]||"").length);return function(e){var r=la(Math.round(parseFloat(e)/i)*i*n);return(r-r%1)/n+(t(e)?0:_a(e))}}function jb(h,e){var l,f,r=K(h);return!r&&v(h)&&(l=r=h.radius||X,h.values?(h=Pt(h.values),(f=!t(h[0]))&&(l*=l)):h=ib(h.increment)),Za(e,r?s(h)?function(t){return f=h(t),Math.abs(f-t)<=l?f:t}:function(e){for(var r,i,n=parseFloat(f?e.x:e),a=parseFloat(f?e.y:0),s=X,o=0,u=h.length;u--;)(r=f?(r=h[u].x-n)*r+(i=h[u].y-a)*i:Math.abs(h[u]-n))<s&&(s=r,o=u);return o=!l||s<=l?h[o]:e,f||o===e||t(e)?o:o+_a(e)}:ib(h))}function kb(t,e,r,i){return Za(K(t)?!e:!0===r?!!(r=0):!i,function(){return K(t)?t[~~(Math.random()*t.length)]:(r=r||1e-5)&&(i=r<1?Math.pow(10,(r+"").length-2):1)&&Math.floor(Math.round((t-r/2+Math.random()*(e-t+.99*r))/r)*r*i)/i})}function ob(e,r,t){return Za(t,function(t){return e[~~r(t)]})}function rb(t){return t.replace(tt,function(t){var e=t.indexOf("[")+1,r=t.substring(e||7,e?t.indexOf("]"):t.length-1).split(et);return kb(e?r:+r[0],e?0:+r[1],+r[2]||1e-5)})}function ub(t,e,r){var i,n,a,s=t.labels,o=X;for(i in s)(n=s[i]-e)<0==!!r&&n&&o>(n=Math.abs(n))&&(a=i,o=n);return a}function wb(t){return Ca(t),t.scrollTrigger&&t.scrollTrigger.kill(!!I),t.progress()<1&&At(t,"onInterrupt"),t}function zb(t){if(t)if(t=!t.name&&t.default||t,x()||t.headless){var e=t.name,r=s(t),i=e&&!r&&t.init?function(){this._props=[]}:t,n={init:V,render:_e,add:$t,kill:Te,modifier:ve,rawVars:0},a={targetTest:0,get:0,getSetter:ue,aliases:{},register:0};if(Lt(),t!==i){if(mt[e])return;ta(i,ta(xa(t,n),a)),bt(i.prototype,bt(n,xa(t,a))),mt[i.prop=e]=i,t.targetTest&&(yt.push(i),dt[e]=1),e=("css"===e?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}U(e,i),t.register&&t.register(Fe,i,we)}else Dt.push(t)}function Cb(t,e,r){return(6*(t+=t<0?1:1<t?-1:0)<1?e+(r-e)*t*6:t<.5?r:3*t<2?e+(r-e)*(2/3-t)*6:e)*zt+.5|0}function Db(e,r,i){var n,a,s,o,u,h,l,f,c,d,p=e?t(e)?[e>>16,e>>8&zt,e&zt]:0:Rt.black;if(!p){if(","===e.substr(-1)&&(e=e.substr(0,e.length-1)),Rt[e])p=Rt[e];else if("#"===e.charAt(0)){if(e.length<6&&(e="#"+(n=e.charAt(1))+n+(a=e.charAt(2))+a+(s=e.charAt(3))+s+(5===e.length?e.charAt(4)+e.charAt(4):"")),9===e.length)return[(p=parseInt(e.substr(1,6),16))>>16,p>>8&zt,p&zt,parseInt(e.substr(7),16)/255];p=[(e=parseInt(e.substr(1),16))>>16,e>>8&zt,e&zt]}else if("hsl"===e.substr(0,3))if(p=d=e.match(rt),r){if(~e.indexOf("="))return p=e.match(it),i&&p.length<4&&(p[3]=1),p}else o=+p[0]%360/360,u=p[1]/100,n=2*(h=p[2]/100)-(a=h<=.5?h*(u+1):h+u-h*u),3<p.length&&(p[3]*=1),p[0]=Cb(o+1/3,n,a),p[1]=Cb(o,n,a),p[2]=Cb(o-1/3,n,a);else p=e.match(rt)||Rt.transparent;p=p.map(Number)}return r&&!d&&(n=p[0]/zt,a=p[1]/zt,s=p[2]/zt,h=((l=Math.max(n,a,s))+(f=Math.min(n,a,s)))/2,l===f?o=u=0:(c=l-f,u=.5<h?c/(2-l-f):c/(l+f),o=l===n?(a-s)/c+(a<s?6:0):l===a?(s-n)/c+2:(n-a)/c+4,o*=60),p[0]=~~(o+.5),p[1]=~~(100*u+.5),p[2]=~~(100*h+.5)),i&&p.length<4&&(p[3]=1),p}function Eb(t){var r=[],i=[],n=-1;return t.split(Et).forEach(function(t){var e=t.match(nt)||[];r.push.apply(r,e),i.push(n+=e.length+1)}),r.c=i,r}function Fb(t,e,r){var i,n,a,s,o="",u=(t+o).match(Et),h=e?"hsla(":"rgba(",l=0;if(!u)return t;if(u=u.map(function(t){return(t=Db(t,e,1))&&h+(e?t[0]+","+t[1]+"%,"+t[2]+"%,"+t[3]:t.join(","))+")"}),r&&(a=Eb(t),(i=r.c).join(o)!==a.c.join(o)))for(s=(n=t.replace(Et,"1").split(nt)).length-1;l<s;l++)o+=n[l]+(~i.indexOf(l)?u.shift()||h+"0,0,0,0)":(a.length?a:u.length?u:r).shift());if(!n)for(s=(n=t.split(Et)).length-1;l<s;l++)o+=n[l]+u[l];return o+n[s]}function Ib(t){var e,r=t.join(" ");if(Et.lastIndex=0,Et.test(r))return e=Ft.test(r),t[1]=Fb(t[1],e),t[0]=Fb(t[0],e,Eb(t[1])),!0}function Rb(t){var e=(t+"").split("("),r=Bt[e[0]];return r&&1<e.length&&r.config?r.config.apply(null,~t.indexOf("{")?[function _parseObjectInString(t){for(var e,r,i,n={},a=t.substr(1,t.length-3).split(":"),s=a[0],o=1,u=a.length;o<u;o++)r=a[o],e=o!==u-1?r.lastIndexOf(","):r.length,i=r.substr(0,e),n[s]=isNaN(i)?i.replace(Ut,"").trim():+i,s=r.substr(e+1).trim();return n}(e[1])]:function _valueInParentheses(t){var e=t.indexOf("(")+1,r=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<r?t.indexOf(")",r+1):r)}(t).split(",").map(ra)):Bt._CE&&Nt.test(t)?Bt._CE("",t):r}function Ub(t,e,r,i){void 0===r&&(r=function easeOut(t){return 1-e(1-t)}),void 0===i&&(i=function easeInOut(t){return t<.5?e(2*t)/2:1-e(2*(1-t))/2});var n,a={easeIn:e,easeOut:r,easeInOut:i};return ja(t,function(t){for(var e in Bt[t]=ht[t]=a,Bt[n=t.toLowerCase()]=r,a)Bt[n+("easeIn"===e?".in":"easeOut"===e?".out":".inOut")]=Bt[t+"."+e]=a[e]}),a}function Vb(e){return function(t){return t<.5?(1-e(1-2*t))/2:.5+e(2*(t-.5))/2}}function Wb(r,t,e){function Gm(t){return 1===t?1:i*Math.pow(2,-10*t)*Q((t-a)*n)+1}var i=1<=t?t:1,n=(e||(r?.3:.45))/(t<1?t:1),a=n/G*(Math.asin(1/i)||0),s="out"===r?Gm:"in"===r?function(t){return 1-Gm(1-t)}:Vb(Gm);return n=G/n,s.config=function(t,e){return Wb(r,t,e)},s}function Xb(e,r){function Om(t){return t?--t*t*((r+1)*t+r)+1:0}void 0===r&&(r=1.70158);var t="out"===e?Om:"in"===e?function(t){return 1-Om(1-t)}:Vb(Om);return t.config=function(t){return Xb(e,t)},t}var F,I,l,L,h,n,a,i,o,f,c,d,p,_,m,g,b,k,O,M,C,P,A,D,z,E,B,N,Y={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},j={duration:.5,overwrite:!1,delay:0},X=1e8,q=1/X,G=2*Math.PI,Z=G/4,W=0,$=Math.sqrt,H=Math.cos,Q=Math.sin,J="function"==typeof ArrayBuffer&&ArrayBuffer.isView||function(){},K=Array.isArray,tt=/random\([^)]+\)/g,et=/,\s*/g,rt=/(?:-?\.?\d|\.)+/gi,it=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,nt=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,at=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,st=/[+-]=-?[.\d]+/,ot=/[^,'"\[\]\s]+/gi,ut=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,ht={},lt={suppressEvents:!0,isStart:!0,kill:!1},ft={suppressEvents:!0,kill:!1},ct={suppressEvents:!0},dt={},pt=[],_t={},mt={},gt={},vt=30,yt=[],Tt="",bt=function _merge(t,e){for(var r in e)t[r]=e[r];return t},wt=function _animationCycle(t,e){var r=Math.floor(t=la(t/e));return t&&r===t?r-1:r},xt=function _isFromOrFromStart(t){var e=t.data;return"isFromStart"===e||"isStart"===e},kt={_start:0,endTime:V,totalDuration:V},Ot=function _parsePosition(t,e,i){var n,a,s,o=t.labels,u=t._recent||kt,h=t.duration()>=X?u.endTime(!1):t._dur;return r(e)&&(isNaN(e)||e in o)?(a=e.charAt(0),s="%"===e.substr(-1),n=e.indexOf("="),"<"===a||">"===a?(0<=n&&(e=e.replace(/=/,"")),("<"===a?u._start:u.endTime(0<=u._repeat))+(parseFloat(e.substr(1))||0)*(s?(n<0?u:i).totalDuration()/100:1)):n<0?(e in o||(o[e]=h),o[e]):(a=parseFloat(e.charAt(n-1)+e.substr(n+1)),s&&i&&(a=a/100*(K(i)?i[0]:i).totalDuration()),1<n?_parsePosition(t,e.substr(0,n-1),i)+a:h+a)):null==e?h:+e},Mt=function _clamp(t,e,r){return r<t?t:e<r?e:r},Ct=[].slice,Pt=function toArray(t,e,i){return l&&!e&&l.selector?l.selector(t):!r(t)||i||!n&&Lt()?K(t)?function _flatten(t,e,i){return void 0===i&&(i=[]),t.forEach(function(t){return r(t)&&!e||cb(t,1)?i.push.apply(i,Pt(t)):i.push(t)})||i}(t,i):cb(t)?Ct.call(t,0):t?[t]:[]:Ct.call((e||a).querySelectorAll(t),0)},St=function mapRange(e,t,r,i,n){var a=t-e,s=i-r;return Za(n,function(t){return r+((t-e)/a*s||0)})},At=function _callback(t,e,r){var i,n,a,s=t.vars,o=s[e],u=l,h=t._ctx;if(o)return i=s[e+"Params"],n=s.callbackScope||t,r&&pt.length&&oa(),h&&(l=h),a=i?o.apply(n,i):o.call(n),l=u,a},Dt=[],zt=255,Rt={aqua:[0,zt,zt],lime:[0,zt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,zt],navy:[0,0,128],white:[zt,zt,zt],olive:[128,128,0],yellow:[zt,zt,0],orange:[zt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[zt,0,0],pink:[zt,192,203],cyan:[0,zt,zt],transparent:[zt,zt,zt,0]},Et=function(){var t,e="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";for(t in Rt)e+="|"+t+"\\b";return new RegExp(e+")","gi")}(),Ft=/hsl[a]?\(/,It=(O=Date.now,M=500,C=33,P=O(),A=P,z=D=1e3/240,g={time:0,frame:0,tick:function tick(){zl(!0)},deltaRatio:function deltaRatio(t){return b/(1e3/(t||60))},wake:function wake(){o&&(!n&&x()&&(h=n=window,a=h.document||{},ht.gsap=Fe,(h.gsapVersions||(h.gsapVersions=[])).push(Fe.version),R(i||h.GreenSockGlobals||!h.gsap&&h||{}),Dt.forEach(zb)),m="undefined"!=typeof requestAnimationFrame&&requestAnimationFrame,p&&g.sleep(),_=m||function(t){return setTimeout(t,z-1e3*g.time+1|0)},d=1,zl(2))},sleep:function sleep(){(m?cancelAnimationFrame:clearTimeout)(p),d=0,_=V},lagSmoothing:function lagSmoothing(t,e){M=t||1/0,C=Math.min(e||33,M)},fps:function fps(t){D=1e3/(t||240),z=1e3*g.time+D},add:function add(n,t,e){var a=t?function(t,e,r,i){n(t,e,r,i),g.remove(a)}:n;return g.remove(n),E[e?"unshift":"push"](a),Lt(),a},remove:function remove(t,e){~(e=E.indexOf(t))&&E.splice(e,1)&&e<=k&&k--},_listeners:E=[]}),Lt=function _wake(){return!d&&It.wake()},Bt={},Nt=/^[\d.\-M][\d.\-,\s]/,Ut=/["']/g,Yt=function _invertEase(e){return function(t){return 1-e(1-t)}},jt=function _parseEase(t,e){return t&&(s(t)?t:Bt[t]||Rb(t))||e};function zl(t){var e,r,i,n,a=O()-A,s=!0===t;if((M<a||a<0)&&(P+=a-C),(0<(e=(i=(A+=a)-P)-z)||s)&&(n=++g.frame,b=i-1e3*g.time,g.time=i/=1e3,z+=e+(D<=e?4:D-e),r=1),s||(p=_(zl)),r)for(k=0;k<E.length;k++)E[k](i,b,n,t)}function dn(t){return t<N?B*t*t:t<.7272727272727273?B*Math.pow(t-1.5/2.75,2)+.75:t<.9090909090909092?B*(t-=2.25/2.75)*t+.9375:B*Math.pow(t-2.625/2.75,2)+.984375}ja("Linear,Quad,Cubic,Quart,Quint,Strong",function(t,e){var r=e<5?e+1:e;Ub(t+",Power"+(r-1),e?function(t){return Math.pow(t,r)}:function(t){return t},function(t){return 1-Math.pow(1-t,r)},function(t){return t<.5?Math.pow(2*t,r)/2:1-Math.pow(2*(1-t),r)/2})}),Bt.Linear.easeNone=Bt.none=Bt.Linear.easeIn,Ub("Elastic",Wb("in"),Wb("out"),Wb()),B=7.5625,N=1/2.75,Ub("Bounce",function(t){return 1-dn(1-t)},dn),Ub("Expo",function(t){return Math.pow(2,10*(t-1))*t+t*t*t*t*t*t*(1-t)}),Ub("Circ",function(t){return-($(1-t*t)-1)}),Ub("Sine",function(t){return 1===t?1:1-H(t*Z)}),Ub("Back",Xb("in"),Xb("out"),Xb()),Bt.SteppedEase=Bt.steps=ht.SteppedEase={config:function config(t,e){void 0===t&&(t=1);var r=1/t,i=t+(e?0:1),n=e?1:0;return function(t){return((i*Mt(0,.99999999,t)|0)+n)*r}}},j.ease=Bt["quad.out"],ja("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(t){return Tt+=t+","+t+"Params,"});var Vt,Xt=function GSCache(t,e){this.id=W++,(t._gsap=this).target=t,this.harness=e,this.get=e?e.get:ia,this.set=e?e.getSetter:ue},qt=((Vt=Animation.prototype).delay=function delay(t){return t||0===t?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+t-this._delay),this._delay=t,this):this._delay},Vt.duration=function duration(t){return arguments.length?this.totalDuration(0<this._repeat?t+(t+this._rDelay)*this._repeat:t):this.totalDuration()&&this._dur},Vt.totalDuration=function totalDuration(t){return arguments.length?(this._dirty=0,Ua(this,this._repeat<0?t:(t-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},Vt.totalTime=function totalTime(t,e){if(Lt(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(La(this,t),!r._dp||r.parent||Ma(r,this);r&&r.parent;)r.parent._time!==r._start+(0<=r._ts?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(0<this._ts&&t<this._tDur||this._ts<0&&0<t||!this._tDur&&!t)&&Na(this._dp,this,this._start-this._delay)}return(this._tTime!==t||!this._dur&&!e||this._initted&&Math.abs(this._zTime)===q||!this._initted&&this._dur&&t||!t&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=t),qa(this,t,e)),this},Vt.time=function time(t,e){return arguments.length?this.totalTime(Math.min(this.totalDuration(),t+Ha(this))%(this._dur+this._rDelay)||(t?this._dur:0),e):this._time},Vt.totalProgress=function totalProgress(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this.totalDuration()?Math.min(1,this._tTime/this._tDur):0<=this.rawTime()&&this._initted?1:0},Vt.progress=function progress(t,e){return arguments.length?this.totalTime(this.duration()*(!this._yoyo||1&this.iteration()?t:1-t)+Ha(this),e):this.duration()?Math.min(1,this._time/this._dur):0<this.rawTime()?1:0},Vt.iteration=function iteration(t,e){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(t-1)*r,e):this._repeat?wt(this._tTime,r)+1:1},Vt.timeScale=function timeScale(t,e){if(!arguments.length)return this._rts===-q?0:this._rts;if(this._rts===t)return this;var r=this.parent&&this._ts?Ja(this.parent._time,this):this._tTime;return this._rts=+t||0,this._ts=this._ps||t===-q?0:this._rts,this.totalTime(Mt(-Math.abs(this._delay),this.totalDuration(),r),!1!==e),Ka(this),function _recacheAncestors(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t}(this)},Vt.paused=function paused(t){return arguments.length?(this._ps!==t&&((this._ps=t)?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Lt(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,1===this.progress()&&Math.abs(this._zTime)!==q&&(this._tTime-=q)))),this):this._ps},Vt.startTime=function startTime(t){if(arguments.length){this._start=la(t);var e=this.parent||this._dp;return!e||!e._sort&&this.parent||Na(e,this,this._start-this._delay),this}return this._start},Vt.endTime=function endTime(t){return this._start+(w(t)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},Vt.rawTime=function rawTime(t){var e=this.parent||this._dp;return e?t&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Ja(e.rawTime(t),this):this._tTime:this._tTime},Vt.revert=function revert(t){void 0===t&&(t=ct);var e=I;return I=t,pa(this)&&(this.timeline&&this.timeline.revert(t),this.totalTime(-.01,t.suppressEvents)),"nested"!==this.data&&!1!==t.kill&&this.kill(),I=e,this},Vt.globalTime=function globalTime(t){for(var e=this,r=arguments.length?t:e.rawTime();e;)r=e._start+r/(Math.abs(e._ts)||1),e=e._dp;return!this.parent&&this._sat?this._sat.globalTime(t):r},Vt.repeat=function repeat(t){return arguments.length?(this._repeat=t===1/0?-2:t,Va(this)):-2===this._repeat?1/0:this._repeat},Vt.repeatDelay=function repeatDelay(t){if(arguments.length){var e=this._time;return this._rDelay=t,Va(this),e?this.time(e):this}return this._rDelay},Vt.yoyo=function yoyo(t){return arguments.length?(this._yoyo=t,this):this._yoyo},Vt.seek=function seek(t,e){return this.totalTime(Ot(this,t),w(e))},Vt.restart=function restart(t,e){return this.play().totalTime(t?-this._delay:0,w(e)),this._dur||(this._zTime=-q),this},Vt.play=function play(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},Vt.reverse=function reverse(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},Vt.pause=function pause(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},Vt.resume=function resume(){return this.paused(!1)},Vt.reversed=function reversed(t){return arguments.length?(!!t!==this.reversed()&&this.timeScale(-this._rts||(t?-q:0)),this):this._rts<0},Vt.invalidate=function invalidate(){return this._initted=this._act=0,this._zTime=-q,this},Vt.isActive=function isActive(){var t,e=this.parent||this._dp,r=this._start;return!(e&&!(this._ts&&this._initted&&e.isActive()&&(t=e.rawTime(!0))>=r&&t<this.endTime(!0)-q))},Vt.eventCallback=function eventCallback(t,e,r){var i=this.vars;return 1<arguments.length?(e?(i[t]=e,r&&(i[t+"Params"]=r),"onUpdate"===t&&(this._onUpdate=e)):delete i[t],this):i[t]},Vt.then=function then(t){var i=this,n=i._prom;return new Promise(function(e){function Ao(){var t=i.then;i.then=null,n&&n(),s(r)&&(r=r(i))&&(r.then||r===i)&&(i.then=t),e(r),i.then=t}var r=s(t)?t:sa;i._initted&&1===i.totalProgress()&&0<=i._ts||!i._tTime&&i._ts<0?Ao():i._prom=Ao})},Vt.kill=function kill(){wb(this)},Animation);function Animation(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Ua(this,+t.duration,1,1),this.data=t.data,l&&(this._ctx=l).data.push(this),d||It.wake()}ta(qt.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-q,_prom:0,_ps:!1,_rts:1});var Gt=function(i){function Timeline(t,e){var r;return void 0===t&&(t={}),(r=i.call(this,t)||this).labels={},r.smoothChildTiming=!!t.smoothChildTiming,r.autoRemoveChildren=!!t.autoRemoveChildren,r._sort=w(t.sortChildren),L&&Na(t.parent||L,_assertThisInitialized(r),e),t.reversed&&r.reverse(),t.paused&&r.paused(!0),t.scrollTrigger&&Oa(_assertThisInitialized(r),t.scrollTrigger),r}_inheritsLoose(Timeline,i);var e=Timeline.prototype;return e.to=function to(t,e,r){return Ya(0,arguments,this),this},e.from=function from(t,e,r){return Ya(1,arguments,this),this},e.fromTo=function fromTo(t,e,r,i){return Ya(2,arguments,this),this},e.set=function set(t,e,r){return e.duration=0,e.parent=this,ya(e).repeatDelay||(e.repeat=0),e.immediateRender=!!e.immediateRender,new te(t,e,Ot(this,r),1),this},e.call=function call(t,e,r){return Na(this,te.delayedCall(0,t,e),r)},e.staggerTo=function staggerTo(t,e,r,i,n,a,s){return r.duration=e,r.stagger=r.stagger||i,r.onComplete=a,r.onCompleteParams=s,r.parent=this,new te(t,r,Ot(this,n)),this},e.staggerFrom=function staggerFrom(t,e,r,i,n,a,s){return r.runBackwards=1,ya(r).immediateRender=w(r.immediateRender),this.staggerTo(t,e,r,i,n,a,s)},e.staggerFromTo=function staggerFromTo(t,e,r,i,n,a,s,o){return i.startAt=r,ya(i).immediateRender=w(i.immediateRender),this.staggerTo(t,e,i,n,a,s,o)},e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_=this._time,m=this._dirty?this.totalDuration():this._tDur,g=this._dur,v=t<=0?0:la(t),y=this._zTime<0!=t<0&&(this._initted||!g);if(this!==L&&m<v&&0<=t&&(v=m),v!==this._tTime||r||y){if(_!==this._time&&g&&(v+=this._time-_,t+=this._time-_),i=v,f=this._start,u=!(l=this._ts),y&&(g||(_=this._zTime),!t&&e||(this._zTime=t)),this._repeat){if(d=this._yoyo,o=g+this._rDelay,this._repeat<-1&&t<0)return this.totalTime(100*o+t,e,r);if(i=la(v%o),v===m?(s=this._repeat,i=g):((s=~~(c=la(v/o)))&&s===c&&(i=g,s--),g<i&&(i=g)),c=wt(this._tTime,o),!_&&this._tTime&&c!==s&&this._tTime-c*o-this._dur<=0&&(c=s),d&&1&s&&(i=g-i,p=1),s!==c&&!this._lock){var T=d&&1&c,b=T===(d&&1&s);if(s<c&&(T=!T),_=T?0:v%g?g:v,this._lock=1,this.render(_||(p?0:la(s*o)),e,!g)._lock=0,this._tTime=v,!e&&this.parent&&At(this,"onRepeat"),this.vars.repeatRefresh&&!p&&(this.invalidate()._lock=1,c=s),_&&_!==this._time||u!=!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(g=this._dur,m=this._tDur,b&&(this._lock=2,_=T?g:-1e-4,this.render(_,!0),this.vars.repeatRefresh&&!p&&this.invalidate()),this._lock=0,!this._ts&&!u)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(h=function _findNextPauseTween(t,e,r){var i;if(e<r)for(i=t._first;i&&i._start<=r;){if("isPause"===i.data&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=r;){if("isPause"===i.data&&i._start<e)return i;i=i._prev}}(this,la(_),la(i)))&&(v-=i-(i=h._start)),this._tTime=v,this._time=i,this._act=!!l,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=t,_=0),!_&&v&&g&&!e&&!c&&(At(this,"onStart"),this._tTime!==v))return this;if(_<=i&&0<=t)for(n=this._first;n;){if(a=n._next,(n._act||i>=n._start)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(i-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(i-n._start)*n._ts,e,r),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=-q);break}}n=a}else{n=this._last;for(var w=t<0?t:i;n;){if(a=n._prev,(n._act||w<=n._end)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(w-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(w-n._start)*n._ts,e,r||I&&pa(n)),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=w?-q:q);break}}n=a}}if(h&&!e&&(this.pause(),h.render(_<=i?0:-q)._zTime=_<=i?1:-1,this._ts))return this._start=f,Ka(this),this.render(t,e,r);this._onUpdate&&!e&&At(this,"onUpdate",!0),(v===m&&this._tTime>=this.totalDuration()||!v&&_)&&(f!==this._start&&Math.abs(l)===Math.abs(this._ts)||this._lock||(!t&&g||!(v===m&&0<this._ts||!v&&this._ts<0)||Ca(this,1),e||t<0&&!_||!v&&!_&&m||(At(this,v===m&&0<=t?"onComplete":"onReverseComplete",!0),!this._prom||v<m&&0<this.timeScale()||this._prom())))}return this},e.add=function add(e,i){var n=this;if(t(i)||(i=Ot(this,i,e)),!(e instanceof qt)){if(K(e))return e.forEach(function(t){return n.add(t,i)}),this;if(r(e))return this.addLabel(e,i);if(!s(e))return this;e=te.delayedCall(0,e)}return this!==e?Na(this,e,i):this},e.getChildren=function getChildren(t,e,r,i){void 0===t&&(t=!0),void 0===e&&(e=!0),void 0===r&&(r=!0),void 0===i&&(i=-X);for(var n=[],a=this._first;a;)a._start>=i&&(a instanceof te?e&&n.push(a):(r&&n.push(a),t&&n.push.apply(n,a.getChildren(!0,e,r)))),a=a._next;return n},e.getById=function getById(t){for(var e=this.getChildren(1,1,1),r=e.length;r--;)if(e[r].vars.id===t)return e[r]},e.remove=function remove(t){return r(t)?this.removeLabel(t):s(t)?this.killTweensOf(t):(t.parent===this&&Ba(this,t),t===this._recent&&(this._recent=this._last),Da(this))},e.totalTime=function totalTime(t,e){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=la(It.time-(0<this._ts?t/this._ts:(this.totalDuration()-t)/-this._ts))),i.prototype.totalTime.call(this,t,e),this._forcing=0,this):this._tTime},e.addLabel=function addLabel(t,e){return this.labels[t]=Ot(this,e),this},e.removeLabel=function removeLabel(t){return delete this.labels[t],this},e.addPause=function addPause(t,e,r){var i=te.delayedCall(0,e||V,r);return i.data="isPause",this._hasPause=1,Na(this,i,Ot(this,t))},e.removePause=function removePause(t){var e=this._first;for(t=Ot(this,t);e;)e._start===t&&"isPause"===e.data&&Ca(e),e=e._next},e.killTweensOf=function killTweensOf(t,e,r){for(var i=this.getTweensOf(t,r),n=i.length;n--;)Zt!==i[n]&&i[n].kill(t,e);return this},e.getTweensOf=function getTweensOf(e,r){for(var i,n=[],a=Pt(e),s=this._first,o=t(r);s;)s instanceof te?na(s._targets,a)&&(o?(!Zt||s._initted&&s._ts)&&s.globalTime(0)<=r&&s.globalTime(s.totalDuration())>r:!r||s.isActive())&&n.push(s):(i=s.getTweensOf(a,r)).length&&n.push.apply(n,i),s=s._next;return n},e.tweenTo=function tweenTo(t,e){e=e||{};var r,i=this,n=Ot(i,t),a=e.startAt,s=e.onStart,o=e.onStartParams,u=e.immediateRender,h=te.to(i,ta({ease:e.ease||"none",lazy:!1,immediateRender:!1,time:n,overwrite:"auto",duration:e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale())||q,onStart:function onStart(){if(i.pause(),!r){var t=e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale());h._dur!==t&&Ua(h,t,0,1).render(h._time,!0,!0),r=1}s&&s.apply(h,o||[])}},e));return u?h.render(0):h},e.tweenFromTo=function tweenFromTo(t,e,r){return this.tweenTo(e,ta({startAt:{time:Ot(this,t)}},r))},e.recent=function recent(){return this._recent},e.nextLabel=function nextLabel(t){return void 0===t&&(t=this._time),ub(this,Ot(this,t))},e.previousLabel=function previousLabel(t){return void 0===t&&(t=this._time),ub(this,Ot(this,t),1)},e.currentLabel=function currentLabel(t){return arguments.length?this.seek(t,!0):this.previousLabel(this._time+q)},e.shiftChildren=function shiftChildren(t,e,r){void 0===r&&(r=0);var i,n=this._first,a=this.labels;for(t=la(t);n;)n._start>=r&&(n._start+=t,n._end+=t),n=n._next;if(e)for(i in a)a[i]>=r&&(a[i]+=t);return Da(this)},e.invalidate=function invalidate(t){var e=this._first;for(this._lock=0;e;)e.invalidate(t),e=e._next;return i.prototype.invalidate.call(this,t)},e.clear=function clear(t){void 0===t&&(t=!0);for(var e,r=this._first;r;)e=r._next,this.remove(r),r=e;return this._dp&&(this._time=this._tTime=this._pTime=0),t&&(this.labels={}),Da(this)},e.totalDuration=function totalDuration(t){var e,r,i,n=0,a=this,s=a._last,o=X;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-t:t));if(a._dirty){for(i=a.parent;s;)e=s._prev,s._dirty&&s.totalDuration(),o<(r=s._start)&&a._sort&&s._ts&&!a._lock?(a._lock=1,Na(a,s,r-s._delay,1)._lock=0):o=r,r<0&&s._ts&&(n-=r,(!i&&!a._dp||i&&i.smoothChildTiming)&&(a._start+=la(r/a._ts),a._time-=r,a._tTime-=r),a.shiftChildren(-r,!1,-Infinity),o=0),s._end>n&&s._ts&&(n=s._end),s=e;Ua(a,a===L&&a._time>n?a._time:n,1,1),a._dirty=0}return a._tDur},Timeline.updateRoot=function updateRoot(t){if(L._ts&&(qa(L,Ja(t,L)),f=It.frame),It.frame>=vt){vt+=Y.autoSleep||120;var e=L._first;if((!e||!e._ts)&&Y.autoSleep&&It._listeners.length<2){for(;e&&!e._ts;)e=e._next;e||It.sleep()}}},Timeline}(qt);ta(Gt.prototype,{_lock:0,_hasPause:0,_forcing:0});function cc(t,e,i,n,a,o){var u,h,l,f;if(mt[t]&&!1!==(u=new mt[t]).init(a,u.rawVars?e[t]:function _processVars(t,e,i,n,a){if(s(t)&&(t=Qt(t,a,e,i,n)),!v(t)||t.style&&t.nodeType||K(t)||J(t))return r(t)?Qt(t,a,e,i,n):t;var o,u={};for(o in t)u[o]=Qt(t[o],a,e,i,n);return u}(e[t],n,a,o,i),i,n,o)&&(i._pt=h=new we(i._pt,a,t,0,1,u.render,u,0,u.priority),i!==c))for(l=i._ptLookup[i._targets.indexOf(a)],f=u._props.length;f--;)l[u._props[f]]=h;return u}function ic(t,r,e,i){var n,a,s=r.ease||i||"power1.inOut";if(K(r))a=e[t]||(e[t]=[]),r.forEach(function(t,e){return a.push({t:e/(r.length-1)*100,v:t,e:s})});else for(n in r)a=e[n]||(e[n]=[]),"ease"===n||a.push({t:parseFloat(t),v:r[n],e:s})}var Zt,Wt,$t=function _addPropTween(t,e,i,n,a,o,u,h,l,f){s(n)&&(n=n(a||0,t,o));var c,d=t[e],p="get"!==i?i:s(d)?l?t[e.indexOf("set")||!s(t["get"+e.substr(3)])?e:"get"+e.substr(3)](l):t[e]():d,_=s(d)?l?se:ae:ie;if(r(n)&&(~n.indexOf("random(")&&(n=rb(n)),"="===n.charAt(1)&&(!(c=ma(p,n)+(_a(p)||0))&&0!==c||(n=c))),!f||p!==n||Wt)return isNaN(p*n)||""===n?(d||e in t||S(e,n),function _addComplexStringPropTween(t,e,r,i,n,a,s){var o,u,h,l,f,c,d,p,_=new we(this._pt,t,e,0,1,pe,null,n),m=0,g=0;for(_.b=r,_.e=i,r+="",(d=~(i+="").indexOf("random("))&&(i=rb(i)),a&&(a(p=[r,i],t,e),r=p[0],i=p[1]),u=r.match(at)||[];o=at.exec(i);)l=o[0],f=i.substring(m,o.index),h?h=(h+1)%5:"rgba("===f.substr(-5)&&(h=1),l!==u[g++]&&(c=parseFloat(u[g-1])||0,_._pt={_next:_._pt,p:f||1===g?f:",",s:c,c:"="===l.charAt(1)?ma(c,l)-c:parseFloat(l)-c,m:h&&h<4?Math.round:0},m=at.lastIndex);return _.c=m<i.length?i.substring(m,i.length):"",_.fp=s,(st.test(i)||d)&&(_.e=0),this._pt=_}.call(this,t,e,p,n,_,h||Y.stringFilter,l)):(c=new we(this._pt,t,e,+p||0,n-(p||0),"boolean"==typeof d?de:fe,0,_),l&&(c.fp=l),u&&c.modifier(u,this,t),this._pt=c)},Ht=function _initTween(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_,m=t.vars,g=m.ease,v=m.startAt,y=m.immediateRender,T=m.lazy,b=m.onUpdate,x=m.runBackwards,k=m.yoyoEase,O=m.keyframes,M=m.autoRevert,C=t._dur,P=t._startAt,S=t._targets,A=t.parent,D=A&&"nested"===A.data?A.vars.targets:S,z="auto"===t._overwrite&&!F,R=t.timeline,E=m.easeReverse||k;if(!R||O&&g||(g="none"),t._ease=jt(g,j.ease),t._rEase=E&&(jt(E)||t._ease),t._from=!R&&!!m.runBackwards,t._from&&(t.ratio=1),!R||O&&!m.stagger){if(p=(l=S[0]?ha(S[0]).harness:0)&&m[l.prop],i=xa(m,dt),P&&(P._zTime<0&&P.progress(1),e<0&&x&&y&&!M?P.render(-1,!0):P.revert(x&&C?ft:lt),P._lazy=0),v){if(Ca(t._startAt=te.set(S,ta({data:"isStart",overwrite:!1,parent:A,immediateRender:!0,lazy:!P&&w(T),startAt:null,delay:0,onUpdate:b&&function(){return At(t,"onUpdate")},stagger:0},v))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(I||!y&&!M)&&t._startAt.revert(ft),y&&C&&e<=0&&r<=0)return void(e&&(t._zTime=e))}else if(x&&C&&!P)if(e&&(y=!1),a=ta({overwrite:!1,data:"isFromStart",lazy:y&&!P&&w(T),immediateRender:y,stagger:0,parent:A},i),p&&(a[l.prop]=p),Ca(t._startAt=te.set(S,a)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(I?t._startAt.revert(ft):t._startAt.render(-1,!0)),t._zTime=e,y){if(!e)return}else _initTween(t._startAt,q,q);for(t._pt=t._ptCache=0,T=C&&w(T)||T&&!C,n=0;n<S.length;n++){if(h=(o=S[n])._gsap||ga(S)[n]._gsap,t._ptLookup[n]=c={},_t[h.id]&&pt.length&&oa(),d=D===S?n:D.indexOf(o),l&&!1!==(f=new l).init(o,p||i,t,d,D)&&(t._pt=s=new we(t._pt,o,f.name,0,1,f.render,f,0,f.priority),f._props.forEach(function(t){c[t]=s}),f.priority&&(u=1)),!l||p)for(a in i)mt[a]&&(f=cc(a,i,t,d,o,D))?f.priority&&(u=1):c[a]=s=$t.call(t,o,a,"get",i[a],d,D,0,m.stringFilter);t._op&&t._op[n]&&t.kill(o,t._op[n]),z&&t._pt&&(Zt=t,L.killTweensOf(o,c,t.globalTime(e)),_=!t.parent,Zt=0),t._pt&&T&&(_t[h.id]=1)}u&&be(t),t._onInit&&t._onInit(t)}t._onUpdate=b,t._initted=(!t._op||t._pt)&&!_,O&&e<=0&&R.render(X,!0,!0)},Qt=function _parseFuncOrString(t,e,i,n,a){return s(t)?t.call(e,i,n,a):r(t)&&~t.indexOf("random(")?rb(t):t},Jt=Tt+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Kt={};ja(Jt+",id,stagger,delay,duration,paused,scrollTrigger",function(t){return Kt[t]=1});var te=function(E){function Tween(e,r,i,n){var a;"number"==typeof r&&(i.duration=r,r=i,i=null);var s,o,u,h,l,f,c,d,p=(a=E.call(this,n?r:ya(r))||this).vars,_=p.duration,m=p.delay,g=p.immediateRender,b=p.stagger,x=p.overwrite,k=p.keyframes,O=p.defaults,M=p.scrollTrigger,C=r.parent||L,P=(K(e)||J(e)?t(e[0]):"length"in r)?[e]:Pt(e);if(a._targets=P.length?ga(P):T("GSAP target "+e+" not found. https://gsap.com",!Y.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=x,k||b||y(_)||y(m)){var S=(r=a.vars).easeReverse||r.yoyoEase;if((s=a.timeline=new Gt({data:"nested",defaults:O||{},targets:C&&"nested"===C.data?C.vars.targets:P})).kill(),s.parent=s._dp=_assertThisInitialized(a),s._start=0,b||y(_)||y(m)){if(h=P.length,c=b&&hb(b),v(b))for(l in b)~Jt.indexOf(l)&&((d=d||{})[l]=b[l]);for(o=0;o<h;o++)(u=xa(r,Kt)).stagger=0,S&&(u.easeReverse=S),d&&bt(u,d),f=P[o],u.duration=+Qt(_,_assertThisInitialized(a),o,f,P),u.delay=(+Qt(m,_assertThisInitialized(a),o,f,P)||0)-a._delay,!b&&1===h&&u.delay&&(a._delay=m=u.delay,a._start+=m,u.delay=0),s.to(f,u,c?c(o,f,P):0),s._ease=Bt.none;s.duration()?_=m=0:a.timeline=0}else if(k){ya(ta(s.vars.defaults,{ease:"none"})),s._ease=jt(k.ease||r.ease||"none");var A,D,z,R=0;if(K(k))k.forEach(function(t){return s.to(P,t,">")}),s.duration();else{for(l in u={},k)"ease"===l||"easeEach"===l||ic(l,k[l],u,k.easeEach);for(l in u)for(A=u[l].sort(function(t,e){return t.t-e.t}),o=R=0;o<A.length;o++)(z={ease:(D=A[o]).e,duration:(D.t-(o?A[o-1].t:0))/100*_})[l]=D.v,s.to(P,z,R),R+=z.duration;s.duration()<_&&s.to({},{duration:_-s.duration()})}}_||a.duration(_=s.duration())}else a.timeline=0;return!0!==x||F||(Zt=_assertThisInitialized(a),L.killTweensOf(P),Zt=0),Na(C,_assertThisInitialized(a),i),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(g||!_&&!k&&a._start===la(C._time)&&w(g)&&function _hasNoPausedAncestors(t){return!t||t._ts&&_hasNoPausedAncestors(t.parent)}(_assertThisInitialized(a))&&"nested"!==C.data)&&(a._tTime=-q,a.render(Math.max(0,-m)||0)),M&&Oa(_assertThisInitialized(a),M),a}_inheritsLoose(Tween,E);var e=Tween.prototype;return e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f=this._time,c=this._tDur,d=this._dur,p=t<0,_=c-q<t&&!p?c:t<q?0:t;if(d){if(_!==this._tTime||!t||r||!this._initted&&this._tTime||this._startAt&&this._zTime<0!=p||this._lazy){if(i=_,l=this.timeline,this._repeat){if(s=d+this._rDelay,this._repeat<-1&&p)return this.totalTime(100*s+t,e,r);if(i=la(_%s),_===c?(a=this._repeat,i=d):(a=~~(o=la(_/s)))&&a===o?(i=d,a--):d<i&&(i=d),(u=this._yoyo&&1&a)&&(i=d-i),o=wt(this._tTime,s),i===f&&!r&&this._initted&&a===o)return this._tTime=_,this;a!==o&&this.vars.repeatRefresh&&!u&&!this._lock&&i!==s&&this._initted&&(this._lock=r=1,this.render(la(s*a),!0).invalidate()._lock=0)}if(!this._initted){if(Pa(this,p?t:i,r,e,_))return this._tTime=0,this;if(!(f===this._time||r&&this.vars.repeatRefresh&&a!==o))return this;if(d!==this._dur)return this.render(t,e,r)}if(this._rEase){var m=i<f;if(m!==this._inv){var g=m?f:d-f;this._inv=m,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=f,this._invRecip=g?(m?-1:1)/g:0,this._invScale=m?-this.ratio:1-this.ratio,this._invEase=m?this._rEase:this._ease}this.ratio=h=this._invRatio+this._invScale*this._invEase((i-this._invTime)*this._invRecip)}else this.ratio=h=this._ease(i/d);if(this._from&&(this.ratio=h=1-h),this._tTime=_,this._time=i,!this._act&&this._ts&&(this._act=1,this._lazy=0),!f&&_&&!e&&!o&&(At(this,"onStart"),this._tTime!==_))return this;for(n=this._pt;n;)n.r(h,n.d),n=n._next;l&&l.render(t<0?t:l._dur*l._ease(i/this._dur),e,r)||this._startAt&&(this._zTime=t),this._onUpdate&&!e&&(p&&Fa(this,t,0,r),At(this,"onUpdate")),this._repeat&&a!==o&&this.vars.onRepeat&&!e&&this.parent&&At(this,"onRepeat"),_!==this._tDur&&_||this._tTime!==_||(p&&!this._onUpdate&&Fa(this,t,0,!0),!t&&d||!(_===this._tDur&&0<this._ts||!_&&this._ts<0)||Ca(this,1),e||p&&!f||!(_||f||u)||(At(this,_===c?"onComplete":"onReverseComplete",!0),!this._prom||_<c&&0<this.timeScale()||this._prom()))}}else!function _renderZeroDurationTween(t,e,r,i){var n,a,s,o=t.ratio,u=e<0||!e&&(!t._start&&function _parentPlayheadIsBeforeStart(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||_parentPlayheadIsBeforeStart(e))}(t)&&(t._initted||!xt(t))||(t._ts<0||t._dp._ts<0)&&!xt(t))?0:1,h=t._rDelay,l=0;if(h&&t._repeat&&(l=Mt(0,t._tDur,e),a=wt(l,h),t._yoyo&&1&a&&(u=1-u),a!==wt(t._tTime,h)&&(o=1-u,t.vars.repeatRefresh&&t._initted&&t.invalidate())),u!==o||I||i||t._zTime===q||!e&&t._zTime){if(!t._initted&&Pa(t,e,i,r,l))return;for(s=t._zTime,t._zTime=e||(r?q:0),r=r||e&&!s,t.ratio=u,t._from&&(u=1-u),t._time=0,t._tTime=l,n=t._pt;n;)n.r(u,n.d),n=n._next;e<0&&Fa(t,e,0,!0),t._onUpdate&&!r&&At(t,"onUpdate"),l&&t._repeat&&!r&&t.parent&&At(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===u&&(u&&Ca(t,1),r||I||(At(t,u?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)}(this,t,e,r);return this},e.targets=function targets(){return this._targets},e.invalidate=function invalidate(t){return t&&this.vars.runBackwards||(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(t),E.prototype.invalidate.call(this,t)},e.resetTo=function resetTo(t,e,r,i,n){d||It.wake(),this._ts||this.play();var a,s=Math.min(this._dur,(this._dp._time-this._start)*this._ts);return this._initted||Ht(this,s),a=this._ease(s/this._dur),function _updatePropTweens(t,e,r,i,n,a,s,o){var u,h,l,f,c=(t._pt&&t._ptCache||(t._ptCache={}))[e];if(!c)for(c=t._ptCache[e]=[],l=t._ptLookup,f=t._targets.length;f--;){if((u=l[f][e])&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return Wt=1,t.vars[e]="+=0",Ht(t,s),Wt=0,o?T(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(f=c.length;f--;)(u=(h=c[f])._pt||h).s=!i&&0!==i||n?u.s+(i||0)+a*u.c:i,u.c=r-u.s,h.e&&(h.e=ka(r)+_a(h.e)),h.b&&(h.b=u.s+_a(h.b))}(this,t,e,r,i,a,s,n)?this.resetTo(t,e,r,i,1):(La(this,0),this.parent||Aa(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function kill(t,e){if(void 0===e&&(e="all"),!(t||e&&"all"!==e))return this._lazy=this._pt=0,this.parent?wb(this):this.scrollTrigger&&this.scrollTrigger.kill(!!I),this;if(this.timeline){var i=this.timeline.totalDuration();return this.timeline.killTweensOf(t,e,Zt&&!0!==Zt.vars.overwrite)._first||wb(this),this.parent&&i!==this.timeline.totalDuration()&&Ua(this,this._dur*this.timeline._tDur/i,0,1),this}var n,a,s,o,u,h,l,f=this._targets,c=t?Pt(t):f,d=this._ptLookup,p=this._pt;if((!e||"all"===e)&&function _arraysMatch(t,e){for(var r=t.length,i=r===e.length;i&&r--&&t[r]===e[r];);return r<0}(f,c))return"all"===e&&(this._pt=0),wb(this);for(n=this._op=this._op||[],"all"!==e&&(r(e)&&(u={},ja(e,function(t){return u[t]=1}),e=u),e=function _addAliasesToVars(t,e){var r,i,n,a,s=t[0]?ha(t[0]).harness:0,o=s&&s.aliases;if(!o)return e;for(i in r=bt({},e),o)if(i in r)for(n=(a=o[i].split(",")).length;n--;)r[a[n]]=r[i];return r}(f,e)),l=f.length;l--;)if(~c.indexOf(f[l]))for(u in a=d[l],"all"===e?(n[l]=e,o=a,s={}):(s=n[l]=n[l]||{},o=e),o)(h=a&&a[u])&&("kill"in h.d&&!0!==h.d.kill(u)||Ba(this,h,"_pt"),delete a[u]),"all"!==s&&(s[u]=1);return this._initted&&!this._pt&&p&&wb(this),this},Tween.to=function to(t,e,r){return new Tween(t,e,r)},Tween.from=function from(t,e){return Ya(1,arguments)},Tween.delayedCall=function delayedCall(t,e,r,i){return new Tween(e,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:t,onComplete:e,onReverseComplete:e,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:i})},Tween.fromTo=function fromTo(t,e,r){return Ya(2,arguments)},Tween.set=function set(t,e){return e.duration=0,e.repeatDelay||(e.repeat=0),new Tween(t,e)},Tween.killTweensOf=function killTweensOf(t,e,r){return L.killTweensOf(t,e,r)},Tween}(qt);ta(te.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0}),ja("staggerTo,staggerFrom,staggerFromTo",function(r){te[r]=function(){var t=new Gt,e=Ct.call(arguments,0);return e.splice("staggerFromTo"===r?5:4,0,0),t[r].apply(t,e)}});function qc(t,e,r){return t.setAttribute(e,r)}function yc(t,e,r,i){i.mSet(t,e,i.m.call(i.tween,r,i.mt),i)}var ie=function _setterPlain(t,e,r){return t[e]=r},ae=function _setterFunc(t,e,r){return t[e](r)},se=function _setterFuncWithParam(t,e,r,i){return t[e](i.fp,r)},ue=function _getSetter(t,e){return s(t[e])?ae:u(t[e])&&t.setAttribute?qc:ie},fe=function _renderPlain(t,e){return e.set(e.t,e.p,Math.round(1e6*(e.s+e.c*t))/1e6,e)},de=function _renderBoolean(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},pe=function _renderComplexString(t,e){var r=e._pt,i="";if(!t&&e.b)i=e.b;else if(1===t&&e.e)i=e.e;else{for(;r;)i=r.p+(r.m?r.m(r.s+r.c*t):Math.round(1e4*(r.s+r.c*t))/1e4)+i,r=r._next;i+=e.c}e.set(e.t,e.p,i,e)},_e=function _renderPropTweens(t,e){for(var r=e._pt;r;)r.r(t,r.d),r=r._next},ve=function _addPluginModifier(t,e,r,i){for(var n,a=this._pt;a;)n=a._next,a.p===i&&a.modifier(t,e,r),a=n},Te=function _killPropTweensOf(t){for(var e,r,i=this._pt;i;)r=i._next,i.p===t&&!i.op||i.op===t?Ba(this,i,"_pt"):i.dep||(e=1),i=r;return!e},be=function _sortPropTweensByPriority(t){for(var e,r,i,n,a=t._pt;a;){for(e=a._next,r=i;r&&r.pr>a.pr;)r=r._next;(a._prev=r?r._prev:n)?a._prev._next=a:i=a,(a._next=r)?r._prev=a:n=a,a=e}t._pt=i},we=(PropTween.prototype.modifier=function modifier(t,e,r){this.mSet=this.mSet||this.set,this.set=yc,this.m=t,this.mt=r,this.tween=e},PropTween);function PropTween(t,e,r,i,n,a,s,o,u){this.t=e,this.s=i,this.c=n,this.p=r,this.r=a||fe,this.d=s||this,this.set=o||ie,this.pr=u||0,(this._next=t)&&(t._prev=this)}ja(Tt+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(t){return dt[t]=1}),ht.TweenMax=ht.TweenLite=te,ht.TimelineLite=ht.TimelineMax=Gt,L=new Gt({sortChildren:!1,defaults:j,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0}),Y.stringFilter=Ib;function Gc(t){return(Oe[t]||Me).map(function(t){return t()})}function Hc(){var t=Date.now(),o=[];2<t-Ce&&(Gc("matchMediaInit"),ke.forEach(function(t){var e,r,i,n,a=t.queries,s=t.conditions;for(r in a)(e=h.matchMedia(a[r]).matches)&&(i=1),e!==s[r]&&(s[r]=e,n=1);n&&(t.revert(),i&&o.push(t))}),Gc("matchMediaRevert"),o.forEach(function(e){return e.onMatch(e,function(t){return e.add(null,t)})}),Ce=t,Gc("matchMedia"))}var xe,ke=[],Oe={},Me=[],Ce=0,Pe=0,Se=((xe=Context.prototype).add=function add(t,i,n){function Gw(){var t,e=l,r=a.selector;return e&&e!==a&&e.data.push(a),n&&(a.selector=fb(n)),l=a,t=i.apply(a,arguments),s(t)&&a._r.push(t),l=e,a.selector=r,a.isReverted=!1,t}s(t)&&(n=i,i=t,t=s);var a=this;return a.last=Gw,t===s?Gw(a,function(t){return a.add(null,t)}):t?a[t]=Gw:Gw},xe.ignore=function ignore(t){var e=l;l=null,t(this),l=e},xe.getTweens=function getTweens(){var e=[];return this.data.forEach(function(t){return t instanceof Context?e.push.apply(e,t.getTweens()):t instanceof te&&!(t.parent&&"nested"===t.parent.data)&&e.push(t)}),e},xe.clear=function clear(){this._r.length=this.data.length=0},xe.kill=function kill(i,t){var n=this;if(i?function(){for(var t,e=n.getTweens(),r=n.data.length;r--;)"isFlip"===(t=n.data[r]).data&&(t.revert(),t.getChildren(!0,!0,!1).forEach(function(t){return e.splice(e.indexOf(t),1)}));for(e.map(function(t){return{g:t._dur||t._delay||t._sat&&!t._sat.vars.immediateRender?t.globalTime(0):-1/0,t:t}}).sort(function(t,e){return e.g-t.g||-1/0}).forEach(function(t){return t.t.revert(i)}),r=n.data.length;r--;)(t=n.data[r])instanceof Gt?"nested"!==t.data&&(t.scrollTrigger&&t.scrollTrigger.revert(),t.kill()):t instanceof te||!t.revert||t.revert(i);n._r.forEach(function(t){return t(i,n)}),n.isReverted=!0}():this.data.forEach(function(t){return t.kill&&t.kill()}),this.clear(),t)for(var e=ke.length;e--;)ke[e].id===this.id&&ke.splice(e,1)},xe.revert=function revert(t){this.kill(t||{})},Context);function Context(t,e){this.selector=e&&fb(e),this.data=[],this._r=[],this.isReverted=!1,this.id=Pe++,t&&this.add(t)}var De,Re=((De=MatchMedia.prototype).add=function add(t,e,r){v(t)||(t={matches:t});var i,n,a,s=new Se(0,r||this.scope),o=s.conditions={};for(n in l&&!s.selector&&(s.selector=l.selector),this.contexts.push(s),e=s.add("onMatch",e),s.queries=t)"all"===n?a=1:(i=h.matchMedia(t[n]))&&(ke.indexOf(s)<0&&ke.push(s),(o[n]=i.matches)&&(a=1),i.addListener?i.addListener(Hc):i.addEventListener("change",Hc));return a&&e(s,function(t){return s.add(null,t)}),this},De.revert=function revert(t){this.kill(t||{})},De.kill=function kill(e){this.contexts.forEach(function(t){return t.kill(e,!0)})},MatchMedia);function MatchMedia(t){this.contexts=[],this.scope=t,l&&l.data.push(this)}var Ee={registerPlugin:function registerPlugin(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(function(t){return zb(t)})},timeline:function timeline(t){return new Gt(t)},getTweensOf:function getTweensOf(t,e){return L.getTweensOf(t,e)},getProperty:function getProperty(i,t,e,n){r(i)&&(i=Pt(i)[0]);var a=ha(i||{}).get,s=e?sa:ra;return"native"===e&&(e=""),i?t?s((mt[t]&&mt[t].get||a)(i,t,e,n)):function(t,e,r){return s((mt[t]&&mt[t].get||a)(i,t,e,r))}:i},quickSetter:function quickSetter(r,e,i){if(1<(r=Pt(r)).length){var n=r.map(function(t){return Fe.quickSetter(t,e,i)}),a=n.length;return function(t){for(var e=a;e--;)n[e](t)}}r=r[0]||{};var s=mt[e],o=ha(r),u=o.harness&&(o.harness.aliases||{})[e]||e,h=s?function(t){var e=new s;c._pt=0,e.init(r,i?t+i:t,c,0,[r]),e.render(1,e),c._pt&&_e(1,c)}:o.set(r,u);return s?h:function(t){return h(r,u,i?t+i:t,o,1)}},quickTo:function quickTo(t,i,e){function $x(t,e,r){return n.resetTo(i,t,e,r)}var r,n=Fe.to(t,ta(((r={})[i]="+=0.1",r.paused=!0,r.stagger=0,r),e||{}));return $x.tween=n,$x},isTweening:function isTweening(t){return 0<L.getTweensOf(t,!0).length},defaults:function defaults(t){return t&&t.ease&&(t.ease=jt(t.ease,j.ease)),wa(j,t||{})},config:function config(t){return wa(Y,t||{})},registerEffect:function registerEffect(t){var i=t.name,n=t.effect,e=t.plugins,a=t.defaults,r=t.extendTimeline;(e||"").split(",").forEach(function(t){return t&&!mt[t]&&!ht[t]&&T(i+" effect requires "+t+" plugin.")}),gt[i]=function(t,e,r){return n(Pt(t),ta(e||{},a),r)},r&&(Gt.prototype[i]=function(t,e,r){return this.add(gt[i](t,v(e)?e:(r=e)&&{},this),r)})},registerEase:function registerEase(t,e){Bt[t]=jt(e)},parseEase:function parseEase(t,e){return arguments.length?jt(t,e):Bt},getById:function getById(t){return L.getById(t)},exportRoot:function exportRoot(t,e){void 0===t&&(t={});var r,i,n=new Gt(t);for(n.smoothChildTiming=w(t.smoothChildTiming),L.remove(n),n._dp=0,n._time=n._tTime=L._time,r=L._first;r;)i=r._next,!e&&!r._dur&&r instanceof te&&r.vars.onComplete===r._targets[0]||Na(n,r,r._start-r._delay),r=i;return Na(L,n,0),n},context:function context(t,e){return t?new Se(t,e):l},matchMedia:function matchMedia(t){return new Re(t)},matchMediaRefresh:function matchMediaRefresh(){return ke.forEach(function(t){var e,r,i=t.conditions;for(r in i)i[r]&&(i[r]=!1,e=1);e&&t.revert()})||Hc()},addEventListener:function addEventListener(t,e){var r=Oe[t]||(Oe[t]=[]);~r.indexOf(e)||r.push(e)},removeEventListener:function removeEventListener(t,e){var r=Oe[t],i=r&&r.indexOf(e);0<=i&&r.splice(i,1)},utils:{wrap:function wrap(e,t,r){var i=t-e;return K(e)?ob(e,wrap(0,e.length),t):Za(r,function(t){return(i+(t-e)%i)%i+e})},wrapYoyo:function wrapYoyo(e,t,r){var i=t-e,n=2*i;return K(e)?ob(e,wrapYoyo(0,e.length-1),t):Za(r,function(t){return e+(i<(t=(n+(t-e)%n)%n||0)?n-t:t)})},distribute:hb,random:kb,snap:jb,normalize:function normalize(t,e,r){return St(t,e,0,1,r)},getUnit:_a,clamp:function clamp(e,r,t){return Za(t,function(t){return Mt(e,r,t)})},splitColor:Db,toArray:Pt,selector:fb,mapRange:St,pipe:function pipe(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return function(t){return e.reduce(function(t,e){return e(t)},t)}},unitize:function unitize(e,r){return function(t){return e(parseFloat(t))+(r||_a(t))}},interpolate:function interpolate(e,i,t,n){var a=isNaN(e+i)?0:function(t){return(1-t)*e+t*i};if(!a){var s,o,u,h,l,f=r(e),c={};if(!0===t&&(n=1)&&(t=null),f)e={p:e},i={p:i};else if(K(e)&&!K(i)){for(u=[],h=e.length,l=h-2,o=1;o<h;o++)u.push(interpolate(e[o-1],e[o]));h--,a=function func(t){t*=h;var e=Math.min(l,~~t);return u[e](t-e)},t=i}else n||(e=bt(K(e)?[]:{},e));if(!u){for(s in i)$t.call(c,e,s,"get",i[s]);a=function func(t){return _e(t,c)||(f?e.p:e)}}}return Za(t,a)},shuffle:gb},install:R,effects:gt,ticker:It,updateRoot:Gt.updateRoot,plugins:mt,globalTimeline:L,core:{PropTween:we,globals:U,Tween:te,Timeline:Gt,Animation:qt,getCache:ha,_removeLinkedListItem:Ba,reverting:function reverting(){return I},context:function context(t){return t&&l&&(l.data.push(t),t._ctx=l),l},suppressOverwrites:function suppressOverwrites(t){return F=t}}};ja("to,from,fromTo,delayedCall,set,killTweensOf",function(t){return Ee[t]=te[t]}),It.add(Gt.updateRoot),c=Ee.to({},{duration:0});function Lc(t,e){for(var r=t._pt;r&&r.p!==e&&r.op!==e&&r.fp!==e;)r=r._next;return r}function Nc(t,a){return{name:t,headless:1,rawVars:1,init:function init(t,n,e){e._onInit=function(t){var e,i;if(r(n)&&(e={},ja(n,function(t){return e[t]=1}),n=e),a){for(i in e={},n)e[i]=a(n[i]);n=e}!function _addModifiers(t,e){var r,i,n,a=t._targets;for(r in e)for(i=a.length;i--;)(n=(n=t._ptLookup[i][r])&&n.d)&&(n._pt&&(n=Lc(n,r)),n&&n.modifier&&n.modifier(e[r],t,a[i],r))}(t,n)}}}}var Fe=Ee.registerPlugin({name:"attr",init:function init(t,e,r,i,n){var a,s,o;for(a in this.tween=r,e)o=t.getAttribute(a)||"",(s=this.add(t,"setAttribute",(o||0)+"",e[a],i,n,0,0,a)).op=a,s.b=o,this._props.push(a)},render:function render(t,e){for(var r=e._pt;r;)I?r.set(r.t,r.p,r.b,r):r.r(t,r.d),r=r._next}},{name:"endArray",headless:1,init:function init(t,e){for(var r=e.length;r--;)this.add(t,r,t[r]||0,e[r],0,0,0,0,0,1)}},Nc("roundProps",ib),Nc("modifiers"),Nc("snap",jb))||Ee;te.version=Gt.version=Fe.version="3.15.0",o=1,x()&&Lt();function xd(t,e){return e.set(e.t,e.p,Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function yd(t,e){return e.set(e.t,e.p,1===t?e.e:Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function zd(t,e){return e.set(e.t,e.p,t?Math.round(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function Ad(t,e){return e.set(e.t,e.p,1===t?e.e:t?Math.round(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function Bd(t,e){var r=e.s+e.c*t;e.set(e.t,e.p,~~(r+(r<0?-.5:.5))+e.u,e)}function Cd(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)}function Dd(t,e){return e.set(e.t,e.p,1!==t?e.b:e.e,e)}function Ed(t,e,r){return t.style[e]=r}function Fd(t,e,r){return t.style.setProperty(e,r)}function Gd(t,e,r){return t._gsap[e]=r}function Hd(t,e,r){return t._gsap.scaleX=t._gsap.scaleY=r}function Id(t,e,r,i,n){var a=t._gsap;a.scaleX=a.scaleY=r,a.renderTransform(n,a)}function Jd(t,e,r,i,n){var a=t._gsap;a[e]=r,a.renderTransform(n,a)}function Md(t,e){var r=this,i=this.target,n=i.style,a=i._gsap;if(t in ur&&n){if(this.tfm=this.tfm||{},"transform"===t)return _r.transform.split(",").forEach(function(t){return Md.call(r,t,e)});if(~(t=_r[t]||t).indexOf(",")?t.split(",").forEach(function(t){return r.tfm[t]=wr(i,t)}):this.tfm[t]=a.x?a[t]:wr(i,t),t===gr&&(this.tfm.zOrigin=a.zOrigin),0<=this.props.indexOf(mr))return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(gr,e,"")),t=mr}(n||e)&&this.props.push(t,e,n[t])}function Nd(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))}function Od(){var t,e,r=this.props,i=this.target,n=i.style,a=i._gsap;for(t=0;t<r.length;t+=3)r[t+1]?2===r[t+1]?i[r[t]](r[t+2]):i[r[t]]=r[t+2]:r[t+2]?n[r[t]]=r[t+2]:n.removeProperty("--"===r[t].substr(0,2)?r[t]:r[t].replace(cr,"-$1").toLowerCase());if(this.tfm){for(e in this.tfm)a[e]=this.tfm[e];a.svg&&(a.renderTransform(),i.setAttribute("data-svg-origin",this.svgo||"")),(t=je())&&t.isStart||n[mr]||(Nd(n),a.zOrigin&&n[gr]&&(n[gr]+=" "+a.zOrigin+"px",a.zOrigin=0,a.renderTransform()),a.uncache=1)}}function Pd(t,e){var r={target:t,props:[],revert:Od,save:Md};return t._gsap||Fe.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(t){return r.save(t)}),r}function Rd(t,e){var r=Le.createElementNS?Le.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Le.createElement(t);return r&&r.style?r:Le.createElement(t)}function Sd(t,e,r){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(cr,"-$1").toLowerCase())||i.getPropertyValue(e)||!r&&Sd(t,yr(e)||e,1)||""}function Vd(){(function _windowExists(){return"undefined"!=typeof window})()&&window.document&&(Ie=window,Le=Ie.document,Be=Le.documentElement,Ue=Rd("div")||{style:{}},Rd("div"),mr=yr(mr),gr=mr+"Origin",Ue.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Ve=!!yr("perspective"),je=Fe.core.reverting,Ne=1)}function Wd(t){var e,r=t.ownerSVGElement,i=Rd("svg",r&&r.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),n=t.cloneNode(!0);n.style.display="block",i.appendChild(n),Be.appendChild(i);try{e=n.getBBox()}catch(t){}return i.removeChild(n),Be.removeChild(i),e}function Xd(t,e){for(var r=e.length;r--;)if(t.hasAttribute(e[r]))return t.getAttribute(e[r])}function Yd(e){var r,i;try{r=e.getBBox()}catch(t){r=Wd(e),i=1}return r&&(r.width||r.height)||i||(r=Wd(e)),!r||r.width||r.x||r.y?r:{x:+Xd(e,["x","cx","x1"])||0,y:+Xd(e,["y","cy","y1"])||0,width:0,height:0}}function Zd(t){return!(!t.getCTM||t.parentNode&&!t.ownerSVGElement||!Yd(t))}function $d(t,e){if(e){var r,i=t.style;e in ur&&e!==gr&&(e=mr),i.removeProperty?("ms"!==(r=e.substr(0,2))&&"webkit"!==e.substr(0,6)||(e="-"+e),i.removeProperty("--"===r?e:e.replace(cr,"-$1").toLowerCase())):i.removeAttribute(e)}}function _d(t,e,r,i,n,a){var s=new we(t._pt,e,r,0,1,a?Dd:Cd);return(t._pt=s).b=i,s.e=n,t._props.push(r),s}function ce(t,e,r,i){var n,a,s,o,u=parseFloat(r)||0,h=(r+"").trim().substr((u+"").length)||"px",l=Ue.style,f=dr.test(e),c="svg"===t.tagName.toLowerCase(),d=(c?"client":"offset")+(f?"Width":"Height"),p="px"===i,_="%"===i;if(i===h||!u||Tr[i]||Tr[h])return u;if("px"===h||p||(u=ce(t,e,r,"px")),o=t.getCTM&&Zd(t),(_||"%"===h)&&(ur[e]||~e.indexOf("adius")))return n=o?t.getBBox()[f?"width":"height"]:t[d],ka(_?u/n*100:u/100*n);if(l[f?"width":"height"]=100+(p?h:i),a="rem"!==i&&~e.indexOf("adius")||"em"===i&&t.appendChild&&!c?t:t.parentNode,o&&(a=(t.ownerSVGElement||{}).parentNode),a&&a!==Le&&a.appendChild||(a=Le.body),(s=a._gsap)&&_&&s.width&&f&&s.time===It.time&&!s.uncache)return ka(u/s.width*100);if(!_||"height"!==e&&"width"!==e)!_&&"%"!==h||br[Sd(a,"display")]||(l.position=Sd(t,"position")),a===t&&(l.position="static"),a.appendChild(Ue),n=Ue[d],a.removeChild(Ue),l.position="absolute";else{var m=t.style[e];t.style[e]=100+i,n=t[d],m?t.style[e]=m:$d(t,e)}return f&&_&&((s=ha(a)).time=It.time,s.width=a[d]),ka(p?n*u/100:n&&u?100/n*u:0)}function ee(t,e,r,i){if(!r||"none"===r){var n=yr(e,t,1),a=n&&Sd(t,n,1);a&&a!==r?(e=n,r=a):"borderColor"===e&&(r=Sd(t,"borderTopColor"))}var s,o,u,h,l,f,c,d,p,_,m,g=new we(this._pt,t.style,e,0,1,pe),v=0,y=0;if(g.b=r,g.e=i,r+="","var(--"===(i+="").substring(0,6)&&(i=Sd(t,i.substring(4,i.indexOf(")")))),"auto"===i&&(f=t.style[e],t.style[e]=i,i=Sd(t,e)||i,f?t.style[e]=f:$d(t,e)),Ib(s=[r,i]),i=s[1],u=(r=s[0]).match(nt)||[],(i.match(nt)||[]).length){for(;o=nt.exec(i);)c=o[0],p=i.substring(v,o.index),l?l=(l+1)%5:"rgba("!==p.substr(-5)&&"hsla("!==p.substr(-5)||(l=1),c!==(f=u[y++]||"")&&(h=parseFloat(f)||0,m=f.substr((h+"").length),"="===c.charAt(1)&&(c=ma(h,c)+m),d=parseFloat(c),_=c.substr((d+"").length),v=nt.lastIndex-_.length,_||(_=_||Y.units[e]||m,v===i.length&&(i+=_,g.e+=_)),m!==_&&(h=ce(t,e,f,_)||0),g._pt={_next:g._pt,p:p||1===y?p:",",s:h,c:d-h,m:l&&l<4||"zIndex"===e?Math.round:0});g.c=v<i.length?i.substring(v,i.length):""}else g.r="display"===e&&"none"===i?Dd:Cd;return st.test(i)&&(g.e=0),this._pt=g}function ge(t){var e=t.split(" "),r=e[0],i=e[1]||"50%";return"top"!==r&&"bottom"!==r&&"left"!==i&&"right"!==i||(t=r,r=i,i=t),e[0]=xr[r]||r,e[1]=xr[i]||i,e.join(" ")}function he(t,e){if(e.tween&&e.tween._time===e.tween._dur){var r,i,n,a=e.t,s=a.style,o=e.u,u=a._gsap;if("all"===o||!0===o)s.cssText="",i=1;else for(n=(o=o.split(",")).length;-1<--n;)r=o[n],ur[r]&&(i=1,r="transformOrigin"===r?gr:mr),$d(a,r);i&&($d(a,mr),u&&(u.svg&&a.removeAttribute("transform"),s.scale=s.rotate=s.translate="none",Cr(a,1),u.uncache=1,Nd(s)))}}function le(t){return"matrix(1, 0, 0, 1, 0, 0)"===t||"none"===t||!t}function me(t){var e=Sd(t,mr);return le(e)?Or:e.substr(7).match(it).map(ka)}function ne(t,e){var r,i,n,a,s=t._gsap||ha(t),o=t.style,u=me(t);return s.svg&&t.getAttribute("transform")?"1,0,0,1,0,0"===(u=[(n=t.transform.baseVal.consolidate().matrix).a,n.b,n.c,n.d,n.e,n.f]).join(",")?Or:u:(u!==Or||t.offsetParent||t===Be||s.svg||(n=o.display,o.display="block",(r=t.parentNode)&&(t.offsetParent||t.getBoundingClientRect().width)||(a=1,i=t.nextElementSibling,Be.appendChild(t)),u=me(t),n?o.display=n:$d(t,"display"),a&&(i?r.insertBefore(t,i):r?r.appendChild(t):Be.removeChild(t))),e&&6<u.length?[u[0],u[1],u[4],u[5],u[12],u[13]]:u)}function oe(t,e,r,i,n,a){var s,o,u,h=t._gsap,l=n||ne(t,!0),f=h.xOrigin||0,c=h.yOrigin||0,d=h.xOffset||0,p=h.yOffset||0,_=l[0],m=l[1],g=l[2],v=l[3],y=l[4],T=l[5],b=e.split(" "),w=parseFloat(b[0])||0,x=parseFloat(b[1])||0;r?l!==Or&&(o=_*v-m*g)&&(u=w*(-m/o)+x*(_/o)-(_*T-m*y)/o,w=w*(v/o)+x*(-g/o)+(g*T-v*y)/o,x=u):(w=(s=Yd(t)).x+(~b[0].indexOf("%")?w/100*s.width:w),x=s.y+(~(b[1]||b[0]).indexOf("%")?x/100*s.height:x)),i||!1!==i&&h.smooth?(y=w-f,T=x-c,h.xOffset=d+(y*_+T*g)-y,h.yOffset=p+(y*m+T*v)-T):h.xOffset=h.yOffset=0,h.xOrigin=w,h.yOrigin=x,h.smooth=!!i,h.origin=e,h.originIsAbsolute=!!r,t.style[gr]="0px 0px",a&&(_d(a,h,"xOrigin",f,w),_d(a,h,"yOrigin",c,x),_d(a,h,"xOffset",d,h.xOffset),_d(a,h,"yOffset",p,h.yOffset)),t.setAttribute("data-svg-origin",w+" "+x)}function re(t,e,r){var i=_a(e);return ka(parseFloat(e)+parseFloat(ce(t,"x",r+"px",i)))+i}function ye(t,e,i,n,a){var s,o,u=360,h=r(a),l=parseFloat(a)*(h&&~a.indexOf("rad")?hr:1)-n,f=n+l+"deg";return h&&("short"===(s=a.split("_")[1])&&(l%=u)!==l%180&&(l+=l<0?u:-u),"cw"===s&&l<0?l=(l+36e9)%u-~~(l/u)*u:"ccw"===s&&0<l&&(l=(l-36e9)%u-~~(l/u)*u)),t._pt=o=new we(t._pt,e,i,n,l,yd),o.e=f,o.u="deg",t._props.push(i),o}function ze(t,e){for(var r in e)t[r]=e[r];return t}function Ae(t,e,r){var i,n,a,s,o,u,h,l=ze({},r._gsap),f=r.style;for(n in l.svg?(a=r.getAttribute("transform"),r.setAttribute("transform",""),f[mr]=e,i=Cr(r,1),$d(r,mr),r.setAttribute("transform",a)):(a=getComputedStyle(r)[mr],f[mr]=e,i=Cr(r,1),f[mr]=a),ur)(a=l[n])!==(s=i[n])&&"perspective,force3D,transformOrigin,svgOrigin".indexOf(n)<0&&(o=_a(a)!==(h=_a(s))?ce(r,n,a,h):parseFloat(a),u=parseFloat(s),t._pt=new we(t._pt,i,n,o,u-o,xd),t._pt.u=h||0,t._props.push(n));ze(i,l)}var Ie,Le,Be,Ne,Ue,Ye,je,Ve,Xe=Bt.Power0,qe=Bt.Power1,Ge=Bt.Power2,Ze=Bt.Power3,We=Bt.Power4,$e=Bt.Linear,He=Bt.Quad,Qe=Bt.Cubic,Je=Bt.Quart,Ke=Bt.Quint,tr=Bt.Strong,er=Bt.Elastic,rr=Bt.Back,ir=Bt.SteppedEase,nr=Bt.Bounce,ar=Bt.Sine,sr=Bt.Expo,or=Bt.Circ,ur={},hr=180/Math.PI,lr=Math.PI/180,fr=Math.atan2,cr=/([A-Z])/g,dr=/(left|right|width|margin|padding|x)/i,pr=/[\s,\(]\S/,_r={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},mr="transform",gr=mr+"Origin",vr="O,Moz,ms,Ms,Webkit".split(","),yr=function _checkPropPrefix(t,e,r){var i=(e||Ue).style,n=5;if(t in i&&!r)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);n--&&!(vr[n]+t in i););return n<0?null:(3===n?"ms":0<=n?vr[n]:"")+t},Tr={deg:1,rad:1,turn:1},br={grid:1,flex:1},wr=function _get(t,e,r,i){var n;return Ne||Vd(),e in _r&&"transform"!==e&&~(e=_r[e]).indexOf(",")&&(e=e.split(",")[0]),ur[e]&&"transform"!==e?(n=Cr(t,i),n="transformOrigin"!==e?n[e]:n.svg?n.origin:Pr(Sd(t,gr))+" "+n.zOrigin+"px"):(n=t.style[e])&&"auto"!==n&&!i&&!~(n+"").indexOf("calc(")||(n=kr[e]&&kr[e](t,e,r)||Sd(t,e)||ia(t,e)||("opacity"===e?1:0)),r&&!~(n+"").trim().indexOf(" ")?ce(t,e,n,r)+r:n},xr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},kr={clearProps:function clearProps(t,e,r,i,n){if("isFromStart"!==n.data){var a=t._pt=new we(t._pt,e,r,0,0,he);return a.u=i,a.pr=-10,a.tween=n,t._props.push(r),1}}},Or=[1,0,0,1,0,0],Mr={},Cr=function _parseTransform(t,e){var r=t._gsap||new Xt(t);if("x"in r&&!e&&!r.uncache)return r;var i,n,a,s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w,x,k,O,M,C,P,S,A,D,z,R,E,F=t.style,I=r.scaleX<0,L="deg",B=getComputedStyle(t),N=Sd(t,gr)||"0";return i=n=a=u=h=l=f=c=d=0,s=o=1,r.svg=!(!t.getCTM||!Zd(t)),B.translate&&("none"===B.translate&&"none"===B.scale&&"none"===B.rotate||(F[mr]=("none"!==B.translate?"translate3d("+(B.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+("none"!==B.rotate?"rotate("+B.rotate+") ":"")+("none"!==B.scale?"scale("+B.scale.split(" ").join(",")+") ":"")+("none"!==B[mr]?B[mr]:"")),F.scale=F.rotate=F.translate="none"),m=ne(t,r.svg),r.svg&&(M=r.uncache?(C=t.getBBox(),N=r.xOrigin-C.x+"px "+(r.yOrigin-C.y)+"px",""):!e&&t.getAttribute("data-svg-origin"),oe(t,M||N,!!M||r.originIsAbsolute,!1!==r.smooth,m)),p=r.xOrigin||0,_=r.yOrigin||0,m!==Or&&(T=m[0],b=m[1],w=m[2],x=m[3],i=k=m[4],n=O=m[5],6===m.length?(s=Math.sqrt(T*T+b*b),o=Math.sqrt(x*x+w*w),u=T||b?fr(b,T)*hr:0,(f=w||x?fr(w,x)*hr+u:0)&&(o*=Math.abs(Math.cos(f*lr))),r.svg&&(i-=p-(p*T+_*w),n-=_-(p*b+_*x))):(E=m[6],z=m[7],S=m[8],A=m[9],D=m[10],R=m[11],i=m[12],n=m[13],a=m[14],h=(g=fr(E,D))*hr,g&&(M=k*(v=Math.cos(-g))+S*(y=Math.sin(-g)),C=O*v+A*y,P=E*v+D*y,S=k*-y+S*v,A=O*-y+A*v,D=E*-y+D*v,R=z*-y+R*v,k=M,O=C,E=P),l=(g=fr(-w,D))*hr,g&&(v=Math.cos(-g),R=x*(y=Math.sin(-g))+R*v,T=M=T*v-S*y,b=C=b*v-A*y,w=P=w*v-D*y),u=(g=fr(b,T))*hr,g&&(M=T*(v=Math.cos(g))+b*(y=Math.sin(g)),C=k*v+O*y,b=b*v-T*y,O=O*v-k*y,T=M,k=C),h&&359.9<Math.abs(h)+Math.abs(u)&&(h=u=0,l=180-l),s=ka(Math.sqrt(T*T+b*b+w*w)),o=ka(Math.sqrt(O*O+E*E)),g=fr(k,O),f=2e-4<Math.abs(g)?g*hr:0,d=R?1/(R<0?-R:R):0),r.svg&&(M=t.getAttribute("transform"),r.forceCSS=t.setAttribute("transform","")||!le(Sd(t,mr)),M&&t.setAttribute("transform",M))),90<Math.abs(f)&&Math.abs(f)<270&&(I?(s*=-1,f+=u<=0?180:-180,u+=u<=0?180:-180):(o*=-1,f+=f<=0?180:-180)),e=e||r.uncache,r.x=i-((r.xPercent=i&&(!e&&r.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-i)?-50:0)))?t.offsetWidth*r.xPercent/100:0)+"px",r.y=n-((r.yPercent=n&&(!e&&r.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-n)?-50:0)))?t.offsetHeight*r.yPercent/100:0)+"px",r.z=a+"px",r.scaleX=ka(s),r.scaleY=ka(o),r.rotation=ka(u)+L,r.rotationX=ka(h)+L,r.rotationY=ka(l)+L,r.skewX=f+L,r.skewY=c+L,r.transformPerspective=d+"px",(r.zOrigin=parseFloat(N.split(" ")[2])||!e&&r.zOrigin||0)&&(F[gr]=Pr(N)),r.xOffset=r.yOffset=0,r.force3D=Y.force3D,r.renderTransform=r.svg?Er:Ve?Rr:Sr,r.uncache=0,r},Pr=function _firstTwoOnly(t){return(t=t.split(" "))[0]+" "+t[1]},Sr=function _renderNon3DTransforms(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Rr(t,e)},Ar="0deg",Dr="0px",zr=") ",Rr=function _renderCSSTransforms(t,e){var r=e||this,i=r.xPercent,n=r.yPercent,a=r.x,s=r.y,o=r.z,u=r.rotation,h=r.rotationY,l=r.rotationX,f=r.skewX,c=r.skewY,d=r.scaleX,p=r.scaleY,_=r.transformPerspective,m=r.force3D,g=r.target,v=r.zOrigin,y="",T="auto"===m&&t&&1!==t||!0===m;if(v&&(l!==Ar||h!==Ar)){var b,w=parseFloat(h)*lr,x=Math.sin(w),k=Math.cos(w);w=parseFloat(l)*lr,b=Math.cos(w),a=re(g,a,x*b*-v),s=re(g,s,-Math.sin(w)*-v),o=re(g,o,k*b*-v+v)}_!==Dr&&(y+="perspective("+_+zr),(i||n)&&(y+="translate("+i+"%, "+n+"%) "),!T&&a===Dr&&s===Dr&&o===Dr||(y+=o!==Dr||T?"translate3d("+a+", "+s+", "+o+") ":"translate("+a+", "+s+zr),u!==Ar&&(y+="rotate("+u+zr),h!==Ar&&(y+="rotateY("+h+zr),l!==Ar&&(y+="rotateX("+l+zr),f===Ar&&c===Ar||(y+="skew("+f+", "+c+zr),1===d&&1===p||(y+="scale("+d+", "+p+zr),g.style[mr]=y||"translate(0, 0)"},Er=function _renderSVGTransforms(t,e){var r,i,n,a,s,o=e||this,u=o.xPercent,h=o.yPercent,l=o.x,f=o.y,c=o.rotation,d=o.skewX,p=o.skewY,_=o.scaleX,m=o.scaleY,g=o.target,v=o.xOrigin,y=o.yOrigin,T=o.xOffset,b=o.yOffset,w=o.forceCSS,x=parseFloat(l),k=parseFloat(f);c=parseFloat(c),d=parseFloat(d),(p=parseFloat(p))&&(d+=p=parseFloat(p),c+=p),c||d?(c*=lr,d*=lr,r=Math.cos(c)*_,i=Math.sin(c)*_,n=Math.sin(c-d)*-m,a=Math.cos(c-d)*m,d&&(p*=lr,s=Math.tan(d-p),n*=s=Math.sqrt(1+s*s),a*=s,p&&(s=Math.tan(p),r*=s=Math.sqrt(1+s*s),i*=s)),r=ka(r),i=ka(i),n=ka(n),a=ka(a)):(r=_,a=m,i=n=0),(x&&!~(l+"").indexOf("px")||k&&!~(f+"").indexOf("px"))&&(x=ce(g,"x",l,"px"),k=ce(g,"y",f,"px")),(v||y||T||b)&&(x=ka(x+v-(v*r+y*n)+T),k=ka(k+y-(v*i+y*a)+b)),(u||h)&&(s=g.getBBox(),x=ka(x+u/100*s.width),k=ka(k+h/100*s.height)),s="matrix("+r+","+i+","+n+","+a+","+x+","+k+")",g.setAttribute("transform",s),w&&(g.style[mr]=s)};ja("padding,margin,Width,Radius",function(e,r){var t="Right",i="Bottom",n="Left",o=(r<3?["Top",t,i,n]:["Top"+n,"Top"+t,i+t,i+n]).map(function(t){return r<2?e+t:"border"+t+e});kr[1<r?"border"+e:e]=function(e,t,r,i,n){var a,s;if(arguments.length<4)return a=o.map(function(t){return wr(e,t,r)}),5===(s=a.join(" ")).split(a[0]).length?a[0]:s;a=(i+"").split(" "),s={},o.forEach(function(t,e){return s[t]=a[e]=a[e]||a[(e-1)/2|0]}),e.init(t,s,n)}});var Fr,Ir,Lr,Br={name:"css",register:Vd,targetTest:function targetTest(t){return t.style&&t.nodeType},init:function init(t,e,i,n,a){var s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w,x=this._props,k=t.style,O=i.vars.startAt;for(c in Ne||Vd(),this.styles=this.styles||Pd(t),b=this.styles.props,this.tween=i,e)if("autoRound"!==c&&(o=e[c],!mt[c]||!cc(c,e,i,n,t,a)))if(l=typeof o,f=kr[c],"function"===l&&(l=typeof(o=o.call(i,n,t,a))),"string"===l&&~o.indexOf("random(")&&(o=rb(o)),f)f(this,t,c,o,i)&&(T=1);else if("--"===c.substr(0,2))s=(getComputedStyle(t).getPropertyValue(c)+"").trim(),o+="",Et.lastIndex=0,Et.test(s)||(d=_a(s),(p=_a(o))?d!==p&&(s=ce(t,c,s,p)+p):d&&(o+=d)),this.add(k,"setProperty",s,o,n,a,0,0,c),x.push(c),b.push(c,0,k[c]);else if("undefined"!==l){if(O&&c in O?(s="function"==typeof O[c]?O[c].call(i,n,t,a):O[c],r(s)&&~s.indexOf("random(")&&(s=rb(s)),_a(s+"")||"auto"===s||(s+=Y.units[c]||_a(wr(t,c))||""),"="===(s+"").charAt(1)&&(s=wr(t,c))):s=wr(t,c),h=parseFloat(s),(_="string"===l&&"="===o.charAt(1)&&o.substr(0,2))&&(o=o.substr(2)),u=parseFloat(o),c in _r&&("autoAlpha"===c&&(1===h&&"hidden"===wr(t,"visibility")&&u&&(h=0),b.push("visibility",0,k.visibility),_d(this,k,"visibility",h?"inherit":"hidden",u?"inherit":"hidden",!u)),"scale"!==c&&"transform"!==c&&~(c=_r[c]).indexOf(",")&&(c=c.split(",")[0])),m=c in ur){if(this.styles.save(c),w=o,"string"===l&&"var(--"===o.substring(0,6)){if("calc("===(o=Sd(t,o.substring(4,o.indexOf(")")))).substring(0,5)){var M=t.style.perspective;t.style.perspective=o,o=Sd(t,"perspective"),M?t.style.perspective=M:$d(t,"perspective")}u=parseFloat(o)}if(g||((v=t._gsap).renderTransform&&!e.parseTransform||Cr(t,e.parseTransform),y=!1!==e.smoothOrigin&&v.smooth,(g=this._pt=new we(this._pt,k,mr,0,1,v.renderTransform,v,0,-1)).dep=1),"scale"===c)this._pt=new we(this._pt,v,"scaleY",v.scaleY,(_?ma(v.scaleY,_+u):u)-v.scaleY||0,xd),this._pt.u=0,x.push("scaleY",c),c+="X";else{if("transformOrigin"===c){b.push(gr,0,k[gr]),o=ge(o),v.svg?oe(t,o,0,y,0,this):((p=parseFloat(o.split(" ")[2])||0)!==v.zOrigin&&_d(this,v,"zOrigin",v.zOrigin,p),_d(this,k,c,Pr(s),Pr(o)));continue}if("svgOrigin"===c){oe(t,o,1,y,0,this);continue}if(c in Mr){ye(this,v,c,h,_?ma(h,_+o):o);continue}if("smoothOrigin"===c){_d(this,v,"smooth",v.smooth,o);continue}if("force3D"===c){v[c]=o;continue}if("transform"===c){Ae(this,o,t);continue}}}else c in k||(c=yr(c)||c);if(m||(u||0===u)&&(h||0===h)&&!pr.test(o)&&c in k)u=u||0,(d=(s+"").substr((h+"").length))!==(p=_a(o)||(c in Y.units?Y.units[c]:d))&&(h=ce(t,c,s,p)),this._pt=new we(this._pt,m?v:k,c,h,(_?ma(h,_+u):u)-h,m||"px"!==p&&"zIndex"!==c||!1===e.autoRound?xd:Bd),this._pt.u=p||0,m&&w!==o?(this._pt.b=s,this._pt.e=w,this._pt.r=Ad):d!==p&&"%"!==p&&(this._pt.b=s,this._pt.r=zd);else if(c in k)ee.call(this,t,c,s,_?_+o:o);else if(c in t)this.add(t,c,s||t[c],_?_+o:o,n,a);else if("parseTransform"!==c){S(c,o);continue}m||(c in k?b.push(c,0,k[c]):"function"==typeof t[c]?b.push(c,2,t[c]()):b.push(c,1,s||t[c])),x.push(c)}T&&be(this)},render:function render(t,e){if(e.tween._time||!je())for(var r=e._pt;r;)r.r(t,r.d),r=r._next;else e.styles.revert()},get:wr,aliases:_r,getSetter:function getSetter(t,e,r){var i=_r[e];return i&&i.indexOf(",")<0&&(e=i),e in ur&&e!==gr&&(t._gsap.x||wr(t,"x"))?r&&Ye===r?"scale"===e?Hd:Gd:(Ye=r||{})&&("scale"===e?Id:Jd):t.style&&!u(t.style[e])?Ed:~e.indexOf("-")?Fd:ue(t,e)},core:{_removeProperty:$d,_getMatrix:ne}};Fe.utils.checkPrefix=yr,Fe.core.getStyleSaver=Pd,Lr=ja((Fr="x,y,z,scale,scaleX,scaleY,xPercent,yPercent")+","+(Ir="rotation,rotationX,rotationY,skewX,skewY")+",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",function(t){ur[t]=1}),ja(Ir,function(t){Y.units[t]="deg",Mr[t]=1}),_r[Lr[13]]=Fr+","+Ir,ja("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY",function(t){var e=t.split(":");_r[e[1]]=Lr[e[0]]}),ja("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(t){Y.units[t]="px"}),Fe.registerPlugin(Br);var Nr=Fe.registerPlugin(Br)||Fe,Ur=Nr.core.Tween;e.Back=rr,e.Bounce=nr,e.CSSPlugin=Br,e.Circ=or,e.Cubic=Qe,e.Elastic=er,e.Expo=sr,e.Linear=$e,e.Power0=Xe,e.Power1=qe,e.Power2=Ge,e.Power3=Ze,e.Power4=We,e.Quad=He,e.Quart=Je,e.Quint=Ke,e.Sine=ar,e.SteppedEase=ir,e.Strong=tr,e.TimelineLite=Gt,e.TimelineMax=Gt,e.TweenLite=te,e.TweenMax=Ur,e.default=Nr,e.gsap=Nr;if (typeof(window)==="undefined"||window!==e){Object.defineProperty(e,"__esModule",{value:!0})} else {delete e.default}});

```

### 8/20 · `ai-beat-sync/audiomap.json`
<!-- casebook-file {"path": "ai-beat-sync/audiomap.json", "lines": 2871, "final_newline": false, "sha256": "b364d0e9dca80193a28e6e66d7466345610bb0e28abe48eb37822c1d3577ef01", "original_sha256": "b364d0e9dca80193a28e6e66d7466345610bb0e28abe48eb37822c1d3577ef01"} -->
```json
{
 "version": 2,
 "phraseBars": 4,
 "audio": {
  "path": "assets/bgm.mp3",
  "duration_sec": 51.293,
  "sr": 22050
 },
 "tempo": {
  "bpm": 152.0,
  "beats_per_bar": 4,
  "downbeat_phase": 3,
  "n_beats": 409,
  "n_bars": 102
 },
 "grid": {
  "beats_sec": [
   0.0,
   0.371,
   0.766,
   1.161,
   1.556,
   1.95,
   2.322,
   2.717,
   3.111,
   3.483,
   3.854,
   4.272,
   4.644,
   5.039,
   5.433,
   5.828,
   6.223,
   6.594,
   6.966,
   7.361,
   7.755,
   8.15,
   8.545,
   8.916,
   9.288,
   9.683,
   10.077,
   10.495,
   10.913,
   11.331,
   11.749,
   12.19,
   12.608,
   12.98,
   13.375,
   13.769,
   14.141,
   14.512,
   14.907,
   15.302,
   15.696,
   16.068,
   16.463,
   16.834,
   17.229,
   17.624,
   17.995,
   18.39,
   18.785,
   19.179,
   19.551,
   19.923,
   20.317,
   20.712,
   21.084,
   21.478,
   21.873,
   22.268,
   22.662,
   23.034,
   23.429,
   23.8,
   24.195,
   24.59,
   24.984,
   25.356,
   25.751,
   26.145,
   26.54,
   26.912,
   27.306,
   27.701,
   28.073,
   28.467,
   28.839,
   29.211,
   29.605,
   30.0,
   30.395,
   30.789,
   31.184,
   31.556,
   31.95,
   32.345,
   32.717,
   33.111,
   33.506,
   33.878,
   34.272,
   34.644,
   35.039,
   35.41,
   35.828,
   36.2,
   36.571,
   36.966,
   37.361,
   37.732,
   38.127,
   38.522,
   38.916,
   39.288,
   39.683,
   40.054,
   40.449,
   40.844,
   41.238,
   41.61,
   42.005,
   42.399,
   42.794,
   43.166,
   43.56,
   43.932,
   44.327,
   44.698,
   45.116,
   45.488,
   45.882,
   46.254,
   46.649,
   47.043,
   47.438,
   47.81,
   48.204,
   48.599,
   48.971,
   49.342,
   49.714,
   50.108,
   50.503,
   50.898
  ],
  "downbeats_sec": [
   0.0,
   1.556,
   3.111,
   4.644,
   6.223,
   7.755,
   9.288,
   10.913,
   12.608,
   14.141,
   15.696,
   17.229,
   18.785,
   20.317,
   21.873,
   23.429,
   24.984,
   26.54,
   28.073,
   29.605,
   31.184,
   32.717,
   34.272,
   35.828,
   37.361,
   38.916,
   40.449,
   42.005,
   43.56,
   45.116,
   46.649,
   48.204,
   49.714
  ]
 },
 "energy_phases": [
  {
   "start": 0.0,
   "end": 3.676,
   "level": "HIGH",
   "energy": 0.75,
   "feel": {
    "character": "sparse",
    "bands": [
     "low_mid",
     "sub",
     "bass",
     "mid"
    ]
   },
   "onsets": 10,
   "onsetRate": 2.5,
   "rolls": [],
   "hardStops": [],
   "density": "medium"
  },
  {
   "start": 3.676,
   "end": 4.676,
   "level": "LOW",
   "energy": 0.28,
   "feel": {
    "character": "warm",
    "bands": [
     "low_mid",
     "sub",
     "bass"
    ]
   },
   "onsets": 3,
   "onsetRate": 3.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 4.676,
   "end": 7.676,
   "level": "HIGH",
   "energy": 0.93,
   "feel": {
    "character": "warm",
    "bands": [
     "low_mid",
     "sub",
     "bass"
    ]
   },
   "onsets": 10,
   "onsetRate": 3.3,
   "rolls": [],
   "hardStops": [],
   "density": "medium"
  },
  {
   "start": 7.676,
   "end": 8.676,
   "level": "MEDIUM",
   "energy": 0.61,
   "feel": {
    "character": "warm",
    "bands": [
     "low_mid",
     "sub",
     "bass"
    ]
   },
   "onsets": 4,
   "onsetRate": 4.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 8.676,
   "end": 11.676,
   "level": "HIGH",
   "energy": 0.85,
   "feel": {
    "character": "sparse",
    "bands": [
     "low_mid",
     "sub",
     "bass"
    ]
   },
   "onsets": 8,
   "onsetRate": 2.7,
   "rolls": [],
   "hardStops": [],
   "density": "medium"
  },
  {
   "start": 11.676,
   "end": 12.676,
   "level": "MEDIUM",
   "energy": 0.42,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 4,
   "onsetRate": 4.0,
   "rolls": [
    {
     "start": 58.723,
     "end": 59.234,
     "kind": "accel-roll",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 12.676,
   "end": 14.676,
   "level": "LOW",
   "energy": 0.28,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 10,
   "onsetRate": 5.0,
   "rolls": [
    {
     "start": 58.723,
     "end": 59.234,
     "kind": "accel-roll",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "dense"
  },
  {
   "start": 14.676,
   "end": 17.676,
   "level": "MEDIUM",
   "energy": 0.53,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 13,
   "onsetRate": 4.3,
   "rolls": [
    {
     "start": 61.928,
     "end": 62.346,
     "kind": "accel-roll",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "dense"
  },
  {
   "start": 17.676,
   "end": 20.676,
   "level": "HIGH",
   "energy": 0.74,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 14,
   "onsetRate": 4.7,
   "rolls": [],
   "hardStops": [],
   "density": "medium"
  },
  {
   "start": 20.676,
   "end": 22.676,
   "level": "MEDIUM",
   "energy": 0.54,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 9,
   "onsetRate": 4.5,
   "rolls": [
    {
     "start": 68.127,
     "end": 68.94,
     "kind": "fill",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "dense"
  },
  {
   "start": 22.676,
   "end": 23.676,
   "level": "HIGH",
   "energy": 0.94,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 3,
   "onsetRate": 3.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 23.676,
   "end": 24.676,
   "level": "LOW",
   "energy": 0.34,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 4,
   "onsetRate": 4.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 24.676,
   "end": 25.676,
   "level": "HIGH",
   "energy": 0.71,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 3,
   "onsetRate": 3.0,
   "rolls": [
    {
     "start": 71.912,
     "end": 72.423,
     "kind": "fill",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 25.676,
   "end": 26.676,
   "level": "MEDIUM",
   "energy": 0.62,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass",
     "low_mid"
    ]
   },
   "onsets": 4,
   "onsetRate": 4.0,
   "rolls": [
    {
     "start": 71.912,
     "end": 72.423,
     "kind": "fill",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 26.676,
   "end": 29.676,
   "level": "HIGH",
   "energy": 0.73,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 8,
   "onsetRate": 2.7,
   "rolls": [],
   "hardStops": [],
   "density": "medium"
  },
  {
   "start": 29.676,
   "end": 31.676,
   "level": "MEDIUM",
   "energy": 0.49,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 9,
   "onsetRate": 4.5,
   "rolls": [
    {
     "start": 77.322,
     "end": 77.833,
     "kind": "fill",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "dense"
  },
  {
   "start": 31.676,
   "end": 33.676,
   "level": "HIGH",
   "energy": 0.74,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass",
     "low_mid"
    ]
   },
   "onsets": 5,
   "onsetRate": 2.5,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 33.676,
   "end": 34.676,
   "level": "MEDIUM",
   "energy": 0.45,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 4,
   "onsetRate": 4.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 34.676,
   "end": 35.676,
   "level": "HIGH",
   "energy": 0.8,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 3,
   "onsetRate": 3.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 35.676,
   "end": 36.676,
   "level": "MEDIUM",
   "energy": 0.63,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 5,
   "onsetRate": 5.0,
   "rolls": [
    {
     "start": 82.083,
     "end": 82.454,
     "kind": "accel-roll",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 36.676,
   "end": 37.676,
   "level": "LOW",
   "energy": 0.34,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 6,
   "onsetRate": 6.0,
   "rolls": [
    {
     "start": 83.499,
     "end": 84.01,
     "kind": "accel-roll",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "dense"
  },
  {
   "start": 37.676,
   "end": 38.676,
   "level": "MEDIUM",
   "energy": 0.49,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass"
    ]
   },
   "onsets": 5,
   "onsetRate": 5.0,
   "rolls": [
    {
     "start": 83.499,
     "end": 84.01,
     "kind": "accel-roll",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 38.676,
   "end": 40.676,
   "level": "HIGH",
   "energy": 0.76,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "low_mid",
     "bass"
    ]
   },
   "onsets": 6,
   "onsetRate": 3.0,
   "rolls": [],
   "hardStops": [],
   "density": "medium"
  },
  {
   "start": 40.676,
   "end": 48.676,
   "level": "MEDIUM",
   "energy": 0.54,
   "feel": {
    "character": "heavy",
    "bands": [
     "sub",
     "bass",
     "low_mid"
    ]
   },
   "onsets": 25,
   "onsetRate": 3.1,
   "rolls": [
    {
     "start": 90.488,
     "end": 90.929,
     "kind": "fill",
     "drum": "kick"
    },
    {
     "start": 92.926,
     "end": 93.275,
     "kind": "fill",
     "drum": "kick"
    }
   ],
   "hardStops": [],
   "density": "dense"
  },
  {
   "start": 48.676,
   "end": 50.676,
   "level": "VOID",
   "energy": 0.17,
   "feel": {
    "character": "sparse",
    "bands": [
     "bass",
     "mid",
     "low_mid"
    ]
   },
   "onsets": 0,
   "onsetRate": 0.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  },
  {
   "start": 50.676,
   "end": 51.293,
   "level": "LOW",
   "energy": 0.2,
   "feel": {
    "character": "warm",
    "bands": [
     "low_mid",
     "bass",
     "mid"
    ]
   },
   "onsets": 0,
   "onsetRate": 0.0,
   "rolls": [],
   "hardStops": [],
   "density": "sparse"
  }
 ],
 "key_moments": [
  {
   "t": 4.676,
   "kind": "SURGE",
   "delta": 0.72
  },
  {
   "t": 23.676,
   "kind": "DROP",
   "delta": -0.59
  },
  {
   "t": 11.676,
   "kind": "DROP",
   "delta": -0.5
  },
  {
   "t": 3.676,
   "kind": "DROP",
   "delta": -0.46
  }
 ],
 "hard_stops": [],
 "rolls": [
  {
   "start": 12.399,
   "end": 12.91,
   "dur_sec": 0.511,
   "hits": 5,
   "rate_per_min": 470,
   "kind": "accel-roll",
   "drum": "kick",
   "leads_to": null
  },
  {
   "start": 15.604,
   "end": 16.022,
   "dur_sec": 0.418,
   "hits": 4,
   "rate_per_min": 431,
   "kind": "accel-roll",
   "drum": "kick",
   "leads_to": null
  },
  {
   "start": 21.803,
   "end": 22.616,
   "dur_sec": 0.813,
   "hits": 6,
   "rate_per_min": 369,
   "kind": "fill",
   "drum": "kick",
   "leads_to": "DROP"
  },
  {
   "start": 25.588,
   "end": 26.099,
   "dur_sec": 0.511,
   "hits": 5,
   "rate_per_min": 470,
   "kind": "fill",
   "drum": "kick",
   "leads_to": null
  },
  {
   "start": 30.998,
   "end": 31.509,
   "dur_sec": 0.511,
   "hits": 5,
   "rate_per_min": 470,
   "kind": "fill",
   "drum": "kick",
   "leads_to": null
  },
  {
   "start": 35.759,
   "end": 36.13,
   "dur_sec": 0.371,
   "hits": 4,
   "rate_per_min": 485,
   "kind": "accel-roll",
   "drum": "kick",
   "leads_to": null
  },
  {
   "start": 37.175,
   "end": 37.686,
   "dur_sec": 0.511,
   "hits": 5,
   "rate_per_min": 470,
   "kind": "accel-roll",
   "drum": "kick",
   "leads_to": null
  },
  {
   "start": 44.164,
   "end": 44.605,
   "dur_sec": 0.441,
   "hits": 4,
   "rate_per_min": 408,
   "kind": "fill",
   "drum": "kick",
   "leads_to": null
  },
  {
   "start": 46.602,
   "end": 46.951,
   "dur_sec": 0.349,
   "hits": 4,
   "rate_per_min": 516,
   "kind": "fill",
   "drum": "kick",
   "leads_to": null
  }
 ],
 "silences": [
  {
   "start": 48.676,
   "end": 50.676
  }
 ],
 "events": [
  {
   "t": 0.139,
   "bar": 29,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.31,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 0.534,
   "bar": 29,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.23,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 1.114,
   "bar": 29,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.12,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 1.509,
   "bar": 30,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "hihat",
   "energy": 0.29,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 1.857,
   "bar": 30,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.07,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 2.09,
   "bar": 30,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.45,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 2.229,
   "bar": 30,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.27,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 2.415,
   "bar": 30,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.38,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 2.809,
   "bar": 30,
   "beat_in_bar": 4,
   "step16": 13,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.11,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 3.227,
   "bar": 31,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.23,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 3.808,
   "bar": 31,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.21,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 4.226,
   "bar": 31,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "snare",
   "energy": 0.33,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 4.574,
   "bar": 31,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.15,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 4.783,
   "bar": 32,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.57,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 4.969,
   "bar": 32,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.37,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 5.178,
   "bar": 32,
   "beat_in_bar": 2,
   "step16": 5,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.4,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 5.573,
   "bar": 32,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.26,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 5.944,
   "bar": 32,
   "beat_in_bar": 4,
   "step16": 13,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.14,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 6.292,
   "bar": 33,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "perc",
   "energy": 0.12,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 6.548,
   "bar": 33,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "snare",
   "energy": 0.27,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 6.919,
   "bar": 33,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "snare",
   "energy": 0.36,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 7.291,
   "bar": 33,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.41,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 7.5,
   "bar": 33,
   "beat_in_bar": 4,
   "step16": 13,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.76,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 7.686,
   "bar": 33,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.28,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 7.848,
   "bar": 34,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.24,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 8.266,
   "bar": 34,
   "beat_in_bar": 2,
   "step16": 5,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.13,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 8.661,
   "bar": 34,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.24,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 9.056,
   "bar": 34,
   "beat_in_bar": 4,
   "step16": 14,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.14,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 9.241,
   "bar": 35,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "snare",
   "energy": 0.05,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 9.59,
   "bar": 35,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.24,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 10.008,
   "bar": 35,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.3,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 10.17,
   "bar": 35,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.37,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 10.518,
   "bar": 35,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.59,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 11.378,
   "bar": 36,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.08,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 11.633,
   "bar": 36,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.1,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 11.912,
   "bar": 36,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.02,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 12.097,
   "bar": 36,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "perc",
   "energy": 0.14,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 12.399,
   "bar": 36,
   "beat_in_bar": 4,
   "step16": 14,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.58,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 12.539,
   "bar": 36,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.34,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 12.701,
   "bar": 37,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.07,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 12.794,
   "bar": 37,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.04,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 12.91,
   "bar": 37,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.2,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 13.212,
   "bar": 37,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.29,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 13.305,
   "bar": 37,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.1,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 13.467,
   "bar": 37,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.15,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 13.723,
   "bar": 37,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.12,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 14.071,
   "bar": 37,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.36,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 14.35,
   "bar": 38,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.05,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 14.443,
   "bar": 38,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.04,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 14.698,
   "bar": 38,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.13,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 14.977,
   "bar": 38,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.3,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 15.186,
   "bar": 38,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.25,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 15.604,
   "bar": 38,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.36,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 15.766,
   "bar": 39,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.24,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 15.905,
   "bar": 39,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.05,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 16.022,
   "bar": 39,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.27,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 16.254,
   "bar": 39,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.79,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 16.416,
   "bar": 39,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.59,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 16.718,
   "bar": 39,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "perc",
   "energy": 0.06,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 17.136,
   "bar": 39,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.22,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 17.438,
   "bar": 40,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "perc",
   "energy": 0.05,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 17.577,
   "bar": 40,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.09,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 17.856,
   "bar": 40,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.37,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 18.111,
   "bar": 40,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.08,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 18.32,
   "bar": 40,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.05,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 18.599,
   "bar": 40,
   "beat_in_bar": 4,
   "step16": 14,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.65,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 18.854,
   "bar": 41,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.31,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 18.994,
   "bar": 41,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.51,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 19.11,
   "bar": 41,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.08,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 19.388,
   "bar": 41,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.61,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 19.505,
   "bar": 41,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.1,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 19.621,
   "bar": 41,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.44,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 19.853,
   "bar": 41,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.06,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 20.271,
   "bar": 42,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.16,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 20.549,
   "bar": 42,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.17,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 20.642,
   "bar": 42,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.08,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 20.944,
   "bar": 42,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.18,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 21.13,
   "bar": 42,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.34,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 21.455,
   "bar": 42,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.19,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 21.803,
   "bar": 42,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.15,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 21.966,
   "bar": 43,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.15,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 22.105,
   "bar": 43,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.17,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 22.221,
   "bar": 43,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.35,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 22.43,
   "bar": 43,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.4,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 22.616,
   "bar": 43,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "snare",
   "energy": 0.23,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 22.941,
   "bar": 43,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.1,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 23.382,
   "bar": 44,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.21,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 23.661,
   "bar": 44,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.08,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 23.754,
   "bar": 44,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.04,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 24.032,
   "bar": 44,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.44,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 24.311,
   "bar": 44,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.07,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 24.474,
   "bar": 44,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.24,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 25.17,
   "bar": 45,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.61,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 25.31,
   "bar": 45,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.09,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 25.588,
   "bar": 45,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.16,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 25.704,
   "bar": 45,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.3,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 25.82,
   "bar": 45,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.21,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 25.983,
   "bar": 45,
   "beat_in_bar": 3,
   "step16": 10,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.19,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 26.099,
   "bar": 45,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "snare",
   "energy": 0.17,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 26.842,
   "bar": 46,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.18,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 27.655,
   "bar": 46,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.19,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 28.026,
   "bar": 47,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "snare",
   "energy": 0.35,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 28.375,
   "bar": 47,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.13,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 28.676,
   "bar": 47,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.38,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 28.793,
   "bar": 47,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "hihat",
   "energy": 0.25,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 29.187,
   "bar": 47,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.2,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 29.559,
   "bar": 48,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.26,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 29.954,
   "bar": 48,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.16,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 30.232,
   "bar": 48,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.26,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 30.441,
   "bar": 48,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "perc",
   "energy": 0.15,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 30.743,
   "bar": 48,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.14,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 30.998,
   "bar": 48,
   "beat_in_bar": 4,
   "step16": 14,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.45,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 31.091,
   "bar": 48,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.25,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 31.254,
   "bar": 49,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.05,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 31.37,
   "bar": 49,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.22,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 31.509,
   "bar": 49,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.2,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 31.788,
   "bar": 49,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.25,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 31.904,
   "bar": 49,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.07,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 32.02,
   "bar": 49,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.18,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 32.252,
   "bar": 49,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.08,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 33.065,
   "bar": 50,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.31,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 33.785,
   "bar": 50,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "perc",
   "energy": 0.08,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 34.203,
   "bar": 50,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.31,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 34.481,
   "bar": 51,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "perc",
   "energy": 0.22,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 34.574,
   "bar": 51,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.12,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 34.876,
   "bar": 51,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.38,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 34.992,
   "bar": 51,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "hihat",
   "energy": 0.17,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 35.364,
   "bar": 51,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.14,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 35.759,
   "bar": 51,
   "beat_in_bar": 4,
   "step16": 15,
   "grid": "syncopated",
   "drum": "perc",
   "energy": 0.28,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 35.921,
   "bar": 52,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.13,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 36.014,
   "bar": 52,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.03,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 36.13,
   "bar": 52,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.21,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 36.432,
   "bar": 52,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.22,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 36.687,
   "bar": 52,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.07,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 36.896,
   "bar": 52,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.03,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 37.175,
   "bar": 52,
   "beat_in_bar": 4,
   "step16": 14,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.58,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 37.314,
   "bar": 53,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.17,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 37.454,
   "bar": 53,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.35,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 37.546,
   "bar": 53,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.52,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 37.686,
   "bar": 53,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.24,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 37.941,
   "bar": 53,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "perc",
   "energy": 0.16,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 38.081,
   "bar": 53,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "hihat",
   "energy": 0.12,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 38.197,
   "bar": 53,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.15,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 38.475,
   "bar": 53,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.26,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 39.102,
   "bar": 54,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.29,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 39.242,
   "bar": 54,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.21,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 39.752,
   "bar": 54,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.39,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 40.008,
   "bar": 54,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.28,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 40.403,
   "bar": 55,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.13,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 40.519,
   "bar": 55,
   "beat_in_bar": 1,
   "step16": 1,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.22,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 40.774,
   "bar": 55,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.34,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 41.076,
   "bar": 55,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.38,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 41.192,
   "bar": 55,
   "beat_in_bar": 3,
   "step16": 8,
   "grid": "strong",
   "drum": "hihat",
   "energy": 0.65,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 41.564,
   "bar": 55,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.46,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 42.33,
   "bar": 56,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.28,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 42.608,
   "bar": 56,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "perc",
   "energy": 0.35,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 42.864,
   "bar": 56,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "snare",
   "energy": 0.49,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 43.073,
   "bar": 56,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.35,
   "feel": "intimate",
   "special": null
  },
  {
   "t": 43.886,
   "bar": 57,
   "beat_in_bar": 2,
   "step16": 4,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.27,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 44.164,
   "bar": 57,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.26,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 44.257,
   "bar": 57,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.34,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 44.396,
   "bar": 57,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.28,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 44.605,
   "bar": 57,
   "beat_in_bar": 3,
   "step16": 11,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.2,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 45.325,
   "bar": 58,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.22,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 45.418,
   "bar": 58,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.23,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 45.557,
   "bar": 58,
   "beat_in_bar": 2,
   "step16": 5,
   "grid": "syncopated",
   "drum": "kick",
   "energy": 0.25,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 45.929,
   "bar": 58,
   "beat_in_bar": 3,
   "step16": 9,
   "grid": "syncopated",
   "drum": "perc",
   "energy": 0.2,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 46.208,
   "bar": 58,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.15,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 46.602,
   "bar": 59,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "kick",
   "energy": 0.09,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 46.695,
   "bar": 59,
   "beat_in_bar": 1,
   "step16": 0,
   "grid": "strong",
   "drum": "perc",
   "energy": 0.22,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 46.858,
   "bar": 59,
   "beat_in_bar": 1,
   "step16": 2,
   "grid": "weak",
   "drum": "kick",
   "energy": 0.21,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 46.951,
   "bar": 59,
   "beat_in_bar": 1,
   "step16": 3,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.14,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 47.276,
   "bar": 59,
   "beat_in_bar": 2,
   "step16": 6,
   "grid": "weak",
   "drum": "snare",
   "energy": 0.52,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 47.369,
   "bar": 59,
   "beat_in_bar": 2,
   "step16": 7,
   "grid": "syncopated",
   "drum": "hihat",
   "energy": 0.4,
   "feel": "heavy",
   "special": null
  },
  {
   "t": 47.763,
   "bar": 59,
   "beat_in_bar": 4,
   "step16": 12,
   "grid": "weak",
   "drum": "hihat",
   "energy": 0.2,
   "feel": "heavy",
   "special": null
  }
 ],
 "phrases": [
  {
   "index": 7,
   "start": 0.0,
   "end": 4.644,
   "bars": 4
  },
  {
   "index": 8,
   "start": 4.644,
   "end": 10.913,
   "bars": 4
  },
  {
   "index": 9,
   "start": 10.913,
   "end": 17.229,
   "bars": 4
  },
  {
   "index": 10,
   "start": 17.229,
   "end": 23.429,
   "bars": 4
  },
  {
   "index": 11,
   "start": 23.429,
   "end": 29.605,
   "bars": 4
  },
  {
   "index": 12,
   "start": 29.605,
   "end": 35.828,
   "bars": 4
  },
  {
   "index": 13,
   "start": 35.828,
   "end": 42.005,
   "bars": 4
  },
  {
   "index": 14,
   "start": 42.005,
   "end": 48.204,
   "bars": 4
  },
  {
   "index": 15,
   "start": 48.204,
   "end": 51.293,
   "bars": 4
  }
 ],
 "stats": {
  "drum_counts": {
   "kick": 202,
   "perc": 33,
   "snare": 58,
   "hihat": 245
  },
  "grid_counts": {
   "weak": 150,
   "strong": 65,
   "syncopated": 315,
   "off-grid": 8
  }
 },
 "summary": "152 BPM · windowed 51.293s from full-track analysis · 175 events · 9 rolls · 26 energy phases"
}
```

### 9/20 · `ai-beat-sync/audiomap_full.json`
<!-- casebook-file {"path": "ai-beat-sync/audiomap_full.json", "lines": 8238, "final_newline": false, "sha256": "44f2f4cd94eeafbc25c1cdd225edfc8ddce9dc2495683e13be61a98c7f6742a1", "original_sha256": "44f2f4cd94eeafbc25c1cdd225edfc8ddce9dc2495683e13be61a98c7f6742a1"} -->
```json
{
  "version": 2,
  "phraseBars": 4,
  "summary": "152 BPM · 409 beats / 102 bars · 538 events ({'kick': 202, 'perc': 33, 'snare': 58, 'hihat': 245}) · 10 rolls · 72 energy phases · 165.4s",
  "audio": {
    "path": "assets/bgm_full.mp3",
    "duration_sec": 165.355,
    "sr": 22050
  },
  "tempo": {
    "bpm": 152.0,
    "beats_per_bar": 4,
    "downbeat_phase": 3,
    "n_beats": 409,
    "n_bars": 102
  },
  "grid": {
    "beats_sec": [
      0.07,
      0.464,
      0.836,
      1.231,
      1.625,
      2.02,
      2.392,
      2.763,
      3.158,
      3.553,
      3.947,
      4.342,
      4.737,
      5.108,
      5.503,
      5.875,
      6.269,
      6.664,
      7.059,
      7.454,
      7.825,
      8.197,
      8.591,
      8.963,
      9.381,
      9.776,
      10.147,
      10.542,
      10.913,
      11.285,
      11.68,
      12.074,
      12.469,
      12.864,
      13.235,
      13.63,
      14.002,
      14.373,
      14.768,
      15.163,
      15.557,
      15.952,
      16.324,
      16.718,
      17.09,
      17.485,
      17.879,
      18.274,
      18.646,
      19.04,
      19.412,
      19.807,
      20.201,
      20.596,
      20.991,
      21.362,
      21.734,
      22.129,
      22.523,
      22.895,
      23.29,
      23.684,
      24.079,
      24.451,
      24.845,
      25.217,
      25.612,
      26.006,
      26.401,
      26.796,
      27.167,
      27.539,
      27.934,
      28.328,
      28.723,
      29.118,
      29.489,
      29.884,
      30.279,
      30.65,
      31.045,
      31.44,
      31.835,
      32.229,
      32.601,
      32.996,
      33.367,
      33.739,
      34.133,
      34.528,
      34.923,
      35.294,
      35.689,
      36.084,
      36.479,
      36.873,
      37.268,
      37.64,
      38.011,
      38.406,
      38.777,
      39.172,
      39.567,
      39.962,
      40.356,
      40.728,
      41.123,
      41.494,
      41.889,
      42.284,
      42.678,
      43.073,
      43.445,
      43.862,
      44.304,
      44.768,
      45.163,
      45.534,
      45.929,
      46.324,
      46.695,
      47.09,
      47.485,
      47.88,
      48.274,
      48.646,
      49.041,
      49.435,
      49.807,
      50.178,
      50.596,
      50.968,
      51.363,
      51.757,
      52.152,
      52.547,
      52.918,
      53.29,
      53.685,
      54.079,
      54.474,
      54.869,
      55.24,
      55.612,
      56.007,
      56.401,
      56.819,
      57.237,
      57.655,
      58.073,
      58.514,
      58.932,
      59.304,
      59.699,
      60.093,
      60.465,
      60.836,
      61.231,
      61.626,
      62.02,
      62.392,
      62.787,
      63.158,
      63.553,
      63.948,
      64.319,
      64.714,
      65.109,
      65.503,
      65.875,
      66.247,
      66.641,
      67.036,
      67.408,
      67.802,
      68.197,
      68.592,
      68.986,
      69.358,
      69.753,
      70.124,
      70.519,
      70.914,
      71.308,
      71.68,
      72.075,
      72.469,
      72.864,
      73.236,
      73.63,
      74.025,
      74.397,
      74.791,
      75.163,
      75.535,
      75.929,
      76.324,
      76.719,
      77.113,
      77.508,
      77.88,
      78.274,
      78.669,
      79.041,
      79.435,
      79.83,
      80.202,
      80.596,
      80.968,
      81.363,
      81.734,
      82.152,
      82.524,
      82.895,
      83.29,
      83.685,
      84.056,
      84.451,
      84.846,
      85.24,
      85.612,
      86.007,
      86.378,
      86.773,
      87.168,
      87.562,
      87.934,
      88.329,
      88.723,
      89.118,
      89.49,
      89.884,
      90.256,
      90.651,
      91.022,
      91.44,
      91.812,
      92.206,
      92.578,
      92.973,
      93.367,
      93.762,
      94.134,
      94.528,
      94.923,
      95.295,
      95.666,
      96.038,
      96.432,
      96.827,
      97.222,
      97.617,
      98.011,
      98.406,
      98.778,
      99.149,
      99.544,
      99.939,
      100.333,
      100.728,
      101.1,
      101.494,
      101.889,
      102.261,
      102.632,
      103.027,
      103.422,
      103.793,
      104.211,
      104.583,
      104.954,
      105.349,
      105.744,
      106.115,
      106.51,
      106.905,
      107.323,
      107.671,
      108.066,
      108.437,
      108.832,
      109.227,
      109.621,
      110.016,
      110.388,
      110.782,
      111.154,
      111.549,
      111.92,
      112.315,
      112.71,
      113.104,
      113.476,
      113.871,
      114.265,
      114.73,
      115.217,
      115.612,
      116.007,
      116.378,
      116.773,
      117.168,
      117.563,
      117.934,
      118.329,
      118.7,
      119.095,
      119.49,
      119.861,
      120.256,
      120.628,
      121.022,
      121.417,
      121.812,
      122.183,
      122.578,
      122.973,
      123.344,
      123.739,
      124.134,
      124.529,
      124.923,
      125.295,
      125.666,
      126.061,
      126.456,
      126.851,
      127.222,
      127.617,
      128.012,
      128.383,
      128.755,
      129.173,
      129.544,
      129.939,
      130.334,
      130.728,
      131.1,
      131.471,
      131.866,
      132.238,
      132.632,
      133.027,
      133.422,
      133.817,
      134.188,
      134.583,
      134.978,
      135.349,
      135.721,
      136.115,
      136.51,
      136.905,
      137.3,
      137.694,
      138.066,
      138.461,
      138.855,
      139.25,
      139.622,
      140.016,
      140.388,
      140.783,
      141.177,
      141.549,
      141.944,
      142.338,
      142.733,
      143.105,
      143.499,
      143.894,
      144.289,
      144.66,
      145.032,
      145.427,
      145.821,
      146.216,
      146.588,
      146.982,
      147.354,
      147.749,
      148.12,
      148.492,
      148.886,
      149.281,
      149.676,
      150.071,
      150.442,
      150.837,
      151.232,
      151.626,
      151.998,
      152.393,
      152.787,
      153.159,
      153.554,
      153.948,
      154.32,
      154.715,
      155.086,
      155.481,
      155.876,
      156.27,
      156.642,
      157.037,
      157.431,
      157.826,
      158.198,
      158.592
    ],
    "downbeats_sec": [
      1.231,
      2.763,
      4.342,
      5.875,
      7.454,
      8.963,
      10.542,
      12.074,
      13.63,
      15.163,
      16.718,
      18.274,
      19.807,
      21.362,
      22.895,
      24.451,
      26.006,
      27.539,
      29.118,
      30.65,
      32.229,
      33.739,
      35.294,
      36.873,
      38.406,
      39.962,
      41.494,
      43.073,
      44.768,
      46.324,
      47.88,
      49.435,
      50.968,
      52.547,
      54.079,
      55.612,
      57.237,
      58.932,
      60.465,
      62.02,
      63.553,
      65.109,
      66.641,
      68.197,
      69.753,
      71.308,
      72.864,
      74.397,
      75.929,
      77.508,
      79.041,
      80.596,
      82.152,
      83.685,
      85.24,
      86.773,
      88.329,
      89.884,
      91.44,
      92.973,
      94.528,
      96.038,
      97.617,
      99.149,
      100.728,
      102.261,
      103.793,
      105.349,
      106.905,
      108.437,
      110.016,
      111.549,
      113.104,
      114.73,
      116.378,
      117.934,
      119.49,
      121.022,
      122.578,
      124.134,
      125.666,
      127.222,
      128.755,
      130.334,
      131.866,
      133.422,
      134.978,
      136.51,
      138.066,
      139.622,
      141.177,
      142.733,
      144.289,
      145.821,
      147.354,
      148.886,
      150.442,
      151.998,
      153.554,
      155.086,
      156.642,
      158.198
    ]
  },
  "energy_phases": [
    {
      "start": 0.0,
      "end": 1.0,
      "level": "VOID",
      "energy": 0.03,
      "feel": {
        "character": "sparse",
        "bands": []
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 1.0,
      "end": 3.0,
      "level": "MEDIUM",
      "energy": 0.44,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 9,
      "onsetRate": 4.5,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 3.0,
      "end": 5.0,
      "level": "LOW",
      "energy": 0.29,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 6,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 5.0,
      "end": 7.0,
      "level": "MEDIUM",
      "energy": 0.46,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 7,
      "onsetRate": 3.5,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 7.0,
      "end": 8.0,
      "level": "LOW",
      "energy": 0.36,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 5,
      "onsetRate": 5.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 8.0,
      "end": 12.0,
      "level": "MEDIUM",
      "energy": 0.56,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 15,
      "onsetRate": 3.8,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 12.0,
      "end": 14.0,
      "level": "LOW",
      "energy": 0.34,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 8,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 14.0,
      "end": 18.0,
      "level": "MEDIUM",
      "energy": 0.53,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 11,
      "onsetRate": 2.8,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 18.0,
      "end": 19.0,
      "level": "LOW",
      "energy": 0.36,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 5,
      "onsetRate": 5.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 19.0,
      "end": 27.0,
      "level": "MEDIUM",
      "energy": 0.52,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 28,
      "onsetRate": 3.5,
      "rolls": [],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 27.0,
      "end": 28.0,
      "level": "LOW",
      "energy": 0.32,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 28.0,
      "end": 30.0,
      "level": "MEDIUM",
      "energy": 0.57,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass",
          "low_mid"
        ]
      },
      "onsets": 6,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 30.0,
      "end": 31.0,
      "level": "HIGH",
      "energy": 0.84,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid"
        ]
      },
      "onsets": 2,
      "onsetRate": 2.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 31.0,
      "end": 33.0,
      "level": "MEDIUM",
      "energy": 0.57,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "bass",
          "sub"
        ]
      },
      "onsets": 1,
      "onsetRate": 0.5,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 33.0,
      "end": 35.0,
      "level": "HIGH",
      "energy": 0.76,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass",
          "mid"
        ]
      },
      "onsets": 2,
      "onsetRate": 1.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 35.0,
      "end": 37.0,
      "level": "MEDIUM",
      "energy": 0.55,
      "feel": {
        "character": "heavy",
        "bands": [
          "low_mid",
          "bass",
          "sub"
        ]
      },
      "onsets": 4,
      "onsetRate": 2.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 37.0,
      "end": 40.0,
      "level": "HIGH",
      "energy": 0.74,
      "feel": {
        "character": "heavy",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 5,
      "onsetRate": 1.7,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 40.0,
      "end": 42.0,
      "level": "MEDIUM",
      "energy": 0.59,
      "feel": {
        "character": "heavy",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 5,
      "onsetRate": 2.5,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 42.0,
      "end": 44.0,
      "level": "HIGH",
      "energy": 0.77,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 1.5,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 44.0,
      "end": 46.0,
      "level": "MEDIUM",
      "energy": 0.56,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 6,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 46.0,
      "end": 50.0,
      "level": "HIGH",
      "energy": 0.75,
      "feel": {
        "character": "sparse",
        "bands": [
          "low_mid",
          "sub",
          "bass",
          "mid"
        ]
      },
      "onsets": 10,
      "onsetRate": 2.5,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 50.0,
      "end": 51.0,
      "level": "LOW",
      "energy": 0.28,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 51.0,
      "end": 54.0,
      "level": "HIGH",
      "energy": 0.93,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 10,
      "onsetRate": 3.3,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 54.0,
      "end": 55.0,
      "level": "MEDIUM",
      "energy": 0.61,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 55.0,
      "end": 58.0,
      "level": "HIGH",
      "energy": 0.85,
      "feel": {
        "character": "sparse",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 8,
      "onsetRate": 2.7,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 58.0,
      "end": 59.0,
      "level": "MEDIUM",
      "energy": 0.42,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [
        {
          "start": 58.723,
          "end": 59.234,
          "kind": "accel-roll",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 59.0,
      "end": 61.0,
      "level": "LOW",
      "energy": 0.28,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 10,
      "onsetRate": 5.0,
      "rolls": [
        {
          "start": 58.723,
          "end": 59.234,
          "kind": "accel-roll",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 61.0,
      "end": 64.0,
      "level": "MEDIUM",
      "energy": 0.53,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 13,
      "onsetRate": 4.3,
      "rolls": [
        {
          "start": 61.928,
          "end": 62.346,
          "kind": "accel-roll",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 64.0,
      "end": 67.0,
      "level": "HIGH",
      "energy": 0.74,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 14,
      "onsetRate": 4.7,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 67.0,
      "end": 69.0,
      "level": "MEDIUM",
      "energy": 0.54,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 9,
      "onsetRate": 4.5,
      "rolls": [
        {
          "start": 68.127,
          "end": 68.94,
          "kind": "fill",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 69.0,
      "end": 70.0,
      "level": "HIGH",
      "energy": 0.94,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 70.0,
      "end": 71.0,
      "level": "LOW",
      "energy": 0.34,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 71.0,
      "end": 72.0,
      "level": "HIGH",
      "energy": 0.71,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [
        {
          "start": 71.912,
          "end": 72.423,
          "kind": "fill",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 72.0,
      "end": 73.0,
      "level": "MEDIUM",
      "energy": 0.62,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass",
          "low_mid"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [
        {
          "start": 71.912,
          "end": 72.423,
          "kind": "fill",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 73.0,
      "end": 76.0,
      "level": "HIGH",
      "energy": 0.73,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 8,
      "onsetRate": 2.7,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 76.0,
      "end": 78.0,
      "level": "MEDIUM",
      "energy": 0.49,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 9,
      "onsetRate": 4.5,
      "rolls": [
        {
          "start": 77.322,
          "end": 77.833,
          "kind": "fill",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 78.0,
      "end": 80.0,
      "level": "HIGH",
      "energy": 0.74,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass",
          "low_mid"
        ]
      },
      "onsets": 5,
      "onsetRate": 2.5,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 80.0,
      "end": 81.0,
      "level": "MEDIUM",
      "energy": 0.45,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 81.0,
      "end": 82.0,
      "level": "HIGH",
      "energy": 0.8,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 82.0,
      "end": 83.0,
      "level": "MEDIUM",
      "energy": 0.63,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 5,
      "onsetRate": 5.0,
      "rolls": [
        {
          "start": 82.083,
          "end": 82.454,
          "kind": "accel-roll",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 83.0,
      "end": 84.0,
      "level": "LOW",
      "energy": 0.34,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 6,
      "onsetRate": 6.0,
      "rolls": [
        {
          "start": 83.499,
          "end": 84.01,
          "kind": "accel-roll",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 84.0,
      "end": 85.0,
      "level": "MEDIUM",
      "energy": 0.49,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 5,
      "onsetRate": 5.0,
      "rolls": [
        {
          "start": 83.499,
          "end": 84.01,
          "kind": "accel-roll",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 85.0,
      "end": 87.0,
      "level": "HIGH",
      "energy": 0.76,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "low_mid",
          "bass"
        ]
      },
      "onsets": 6,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 87.0,
      "end": 95.0,
      "level": "MEDIUM",
      "energy": 0.54,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass",
          "low_mid"
        ]
      },
      "onsets": 25,
      "onsetRate": 3.1,
      "rolls": [
        {
          "start": 90.488,
          "end": 90.929,
          "kind": "fill",
          "drum": "kick"
        },
        {
          "start": 92.926,
          "end": 93.275,
          "kind": "fill",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 95.0,
      "end": 97.0,
      "level": "VOID",
      "energy": 0.17,
      "feel": {
        "character": "sparse",
        "bands": [
          "bass",
          "mid",
          "low_mid"
        ]
      },
      "onsets": 0,
      "onsetRate": 0.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 97.0,
      "end": 98.0,
      "level": "LOW",
      "energy": 0.2,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "bass",
          "mid"
        ]
      },
      "onsets": 0,
      "onsetRate": 0.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 98.0,
      "end": 107.0,
      "level": "MEDIUM",
      "energy": 0.5,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass",
          "low_mid"
        ]
      },
      "onsets": 31,
      "onsetRate": 3.4,
      "rolls": [],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 107.0,
      "end": 108.0,
      "level": "LOW",
      "energy": 0.29,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 5,
      "onsetRate": 5.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 108.0,
      "end": 116.0,
      "level": "MEDIUM",
      "energy": 0.5,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 41,
      "onsetRate": 5.1,
      "rolls": [
        {
          "start": 114.033,
          "end": 114.521,
          "kind": "accel-roll",
          "drum": "kick"
        }
      ],
      "hardStops": [],
      "density": "dense"
    },
    {
      "start": 116.0,
      "end": 117.0,
      "level": "LOW",
      "energy": 0.37,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 117.0,
      "end": 119.0,
      "level": "MEDIUM",
      "energy": 0.57,
      "feel": {
        "character": "heavy",
        "bands": [
          "bass",
          "sub"
        ]
      },
      "onsets": 9,
      "onsetRate": 4.5,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 119.0,
      "end": 122.0,
      "level": "LOW",
      "energy": 0.33,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 14,
      "onsetRate": 4.7,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 122.0,
      "end": 124.0,
      "level": "MEDIUM",
      "energy": 0.52,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 8,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 124.0,
      "end": 126.0,
      "level": "LOW",
      "energy": 0.28,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 10,
      "onsetRate": 5.0,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 126.0,
      "end": 129.0,
      "level": "MEDIUM",
      "energy": 0.49,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 10,
      "onsetRate": 3.3,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 129.0,
      "end": 130.0,
      "level": "LOW",
      "energy": 0.39,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 130.0,
      "end": 131.0,
      "level": "MEDIUM",
      "energy": 0.43,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 131.0,
      "end": 132.0,
      "level": "HIGH",
      "energy": 0.75,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 132.0,
      "end": 133.0,
      "level": "MEDIUM",
      "energy": 0.53,
      "feel": {
        "character": "heavy",
        "bands": [
          "sub",
          "bass",
          "low_mid"
        ]
      },
      "onsets": 4,
      "onsetRate": 4.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 133.0,
      "end": 134.0,
      "level": "HIGH",
      "energy": 0.79,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub"
        ]
      },
      "onsets": 2,
      "onsetRate": 2.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 134.0,
      "end": 135.0,
      "level": "MEDIUM",
      "energy": 0.62,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 135.0,
      "end": 138.0,
      "level": "HIGH",
      "energy": 0.76,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 8,
      "onsetRate": 2.7,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 138.0,
      "end": 140.0,
      "level": "MEDIUM",
      "energy": 0.63,
      "feel": {
        "character": "heavy",
        "bands": [
          "low_mid",
          "bass",
          "sub"
        ]
      },
      "onsets": 5,
      "onsetRate": 2.5,
      "rolls": [],
      "hardStops": [],
      "density": "sparse"
    },
    {
      "start": 140.0,
      "end": 142.0,
      "level": "HIGH",
      "energy": 0.79,
      "feel": {
        "character": "heavy",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 6,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [
        142
      ],
      "density": "medium"
    },
    {
      "start": 142.0,
      "end": 144.0,
      "level": "MEDIUM",
      "energy": 0.56,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "bass",
          "sub"
        ]
      },
      "onsets": 7,
      "onsetRate": 3.5,
      "rolls": [],
      "hardStops": [
        142
      ],
      "density": "medium"
    },
    {
      "start": 144.0,
      "end": 147.0,
      "level": "HIGH",
      "energy": 0.81,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "bass",
          "sub"
        ]
      },
      "onsets": 9,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [
        147
      ],
      "density": "medium"
    },
    {
      "start": 147.0,
      "end": 150.0,
      "level": "MEDIUM",
      "energy": 0.56,
      "feel": {
        "character": "sparse",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 10,
      "onsetRate": 3.3,
      "rolls": [],
      "hardStops": [
        147
      ],
      "density": "medium"
    },
    {
      "start": 150.0,
      "end": 152.0,
      "level": "HIGH",
      "energy": 0.73,
      "feel": {
        "character": "sparse",
        "bands": [
          "low_mid",
          "sub",
          "bass",
          "mid"
        ]
      },
      "onsets": 7,
      "onsetRate": 3.5,
      "rolls": [],
      "hardStops": [],
      "density": "medium"
    },
    {
      "start": 152.0,
      "end": 153.0,
      "level": "MEDIUM",
      "energy": 0.59,
      "feel": {
        "character": "heavy",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [
        153
      ],
      "density": "sparse"
    },
    {
      "start": 153.0,
      "end": 154.0,
      "level": "LOW",
      "energy": 0.25,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass",
          "mid"
        ]
      },
      "onsets": 3,
      "onsetRate": 3.0,
      "rolls": [],
      "hardStops": [
        153
      ],
      "density": "sparse"
    },
    {
      "start": 154.0,
      "end": 161.0,
      "level": "HIGH",
      "energy": 0.86,
      "feel": {
        "character": "warm",
        "bands": [
          "low_mid",
          "sub",
          "bass"
        ]
      },
      "onsets": 19,
      "onsetRate": 2.7,
      "rolls": [],
      "hardStops": [
        161
      ],
      "density": "dense"
    },
    {
      "start": 161.0,
      "end": 165.4,
      "level": "VOID",
      "energy": 0.04,
      "feel": {
        "character": "sparse",
        "bands": []
      },
      "onsets": 0,
      "onsetRate": 0.0,
      "rolls": [],
      "hardStops": [
        161
      ],
      "density": "sparse"
    }
  ],
  "key_moments": [
    {
      "t": 161,
      "kind": "DROP",
      "delta": -0.86
    },
    {
      "t": 51,
      "kind": "SURGE",
      "delta": 0.72
    },
    {
      "t": 154,
      "kind": "SURGE",
      "delta": 0.63
    },
    {
      "t": 70,
      "kind": "DROP",
      "delta": -0.59
    },
    {
      "t": 58,
      "kind": "DROP",
      "delta": -0.5
    },
    {
      "t": 50,
      "kind": "DROP",
      "delta": -0.46
    },
    {
      "t": 147,
      "kind": "DROP",
      "delta": -0.46
    },
    {
      "t": 1,
      "kind": "SURGE",
      "delta": 0.42
    }
  ],
  "hard_stops": [
    {
      "t": 161,
      "kind": "DROP",
      "delta": -0.86
    },
    {
      "t": 147,
      "kind": "DROP",
      "delta": -0.46
    },
    {
      "t": 153,
      "kind": "DROP",
      "delta": -0.34
    },
    {
      "t": 142,
      "kind": "DROP",
      "delta": -0.28
    }
  ],
  "rolls": [
    {
      "start": 58.723,
      "end": 59.234,
      "dur_sec": 0.511,
      "hits": 5,
      "rate_per_min": 470,
      "kind": "accel-roll",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 61.928,
      "end": 62.346,
      "dur_sec": 0.418,
      "hits": 4,
      "rate_per_min": 431,
      "kind": "accel-roll",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 68.127,
      "end": 68.94,
      "dur_sec": 0.813,
      "hits": 6,
      "rate_per_min": 369,
      "kind": "fill",
      "drum": "kick",
      "leads_to": "DROP"
    },
    {
      "start": 71.912,
      "end": 72.423,
      "dur_sec": 0.511,
      "hits": 5,
      "rate_per_min": 470,
      "kind": "fill",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 77.322,
      "end": 77.833,
      "dur_sec": 0.511,
      "hits": 5,
      "rate_per_min": 470,
      "kind": "fill",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 82.083,
      "end": 82.454,
      "dur_sec": 0.371,
      "hits": 4,
      "rate_per_min": 485,
      "kind": "accel-roll",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 83.499,
      "end": 84.01,
      "dur_sec": 0.511,
      "hits": 5,
      "rate_per_min": 470,
      "kind": "accel-roll",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 90.488,
      "end": 90.929,
      "dur_sec": 0.441,
      "hits": 4,
      "rate_per_min": 408,
      "kind": "fill",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 92.926,
      "end": 93.275,
      "dur_sec": 0.349,
      "hits": 4,
      "rate_per_min": 516,
      "kind": "fill",
      "drum": "kick",
      "leads_to": null
    },
    {
      "start": 114.033,
      "end": 114.521,
      "dur_sec": 0.488,
      "hits": 4,
      "rate_per_min": 369,
      "kind": "accel-roll",
      "drum": "kick",
      "leads_to": null
    }
  ],
  "silences": [
    {
      "start": 0.0,
      "end": 1.0
    },
    {
      "start": 95.0,
      "end": 97.0
    },
    {
      "start": 161.0,
      "end": 165.4
    }
  ],
  "stats": {
    "drum_counts": {
      "kick": 202,
      "perc": 33,
      "snare": 58,
      "hihat": 245
    },
    "grid_counts": {
      "weak": 150,
      "strong": 65,
      "syncopated": 315,
      "off-grid": 8
    }
  },
  "events": [
    {
      "t": 0.046,
      "bar": -1,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.01,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 0.232,
      "bar": -1,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 0.418,
      "bar": -1,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 0.766,
      "bar": -1,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 1.184,
      "bar": 0,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "perc",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 1.37,
      "bar": 0,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 1.765,
      "bar": 0,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 1.95,
      "bar": 0,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 2.09,
      "bar": 0,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.02,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 2.345,
      "bar": 0,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "off-grid",
      "drum": "perc",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 2.508,
      "bar": 0,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 2.74,
      "bar": 1,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 2.856,
      "bar": 1,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 3.088,
      "bar": 1,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 3.437,
      "bar": 1,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 4.04,
      "bar": 1,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 4.505,
      "bar": 2,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 4.667,
      "bar": 2,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 4.876,
      "bar": 2,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 5.062,
      "bar": 2,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "off-grid",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 5.271,
      "bar": 2,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 5.457,
      "bar": 2,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 5.55,
      "bar": 2,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "off-grid",
      "drum": "kick",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 5.828,
      "bar": 3,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 6.177,
      "bar": 3,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 6.803,
      "bar": 3,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 7.198,
      "bar": 3,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 7.407,
      "bar": 4,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 7.593,
      "bar": 4,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "off-grid",
      "drum": "snare",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 7.709,
      "bar": 4,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 7.941,
      "bar": 4,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 8.104,
      "bar": 4,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 8.359,
      "bar": 4,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 8.545,
      "bar": 4,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 8.731,
      "bar": 4,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 8.94,
      "bar": 5,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 9.334,
      "bar": 5,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "perc",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 9.427,
      "bar": 5,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "perc",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 9.799,
      "bar": 5,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 10.217,
      "bar": 5,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 10.449,
      "bar": 5,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.02,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 10.658,
      "bar": 6,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.01,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 10.867,
      "bar": 6,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 11.238,
      "bar": 6,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 11.471,
      "bar": 6,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 11.633,
      "bar": 6,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.32,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 12.005,
      "bar": 6,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 12.19,
      "bar": 7,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 12.539,
      "bar": 7,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.02,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 12.91,
      "bar": 7,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.02,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 13.166,
      "bar": 7,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 13.375,
      "bar": 7,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 13.56,
      "bar": 7,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 13.932,
      "bar": 8,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 14.327,
      "bar": 8,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 14.93,
      "bar": 8,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 15.279,
      "bar": 9,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 15.65,
      "bar": 9,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.02,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 15.906,
      "bar": 9,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 16.091,
      "bar": 9,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 16.208,
      "bar": 9,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 16.602,
      "bar": 9,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 17.043,
      "bar": 10,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 17.229,
      "bar": 10,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 17.601,
      "bar": 10,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 18.019,
      "bar": 10,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 18.39,
      "bar": 11,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 18.599,
      "bar": 11,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "off-grid",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 18.831,
      "bar": 11,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 18.994,
      "bar": 11,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 19.365,
      "bar": 11,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "off-grid",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 19.76,
      "bar": 12,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 19.946,
      "bar": 12,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 20.178,
      "bar": 12,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 20.317,
      "bar": 12,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 20.735,
      "bar": 12,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 20.944,
      "bar": 12,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 21.107,
      "bar": 12,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 21.316,
      "bar": 12,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 21.525,
      "bar": 13,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 21.664,
      "bar": 13,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 22.059,
      "bar": 13,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.56,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 22.477,
      "bar": 13,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 22.663,
      "bar": 13,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "off-grid",
      "drum": "hihat",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 22.872,
      "bar": 14,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 23.034,
      "bar": 14,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 23.336,
      "bar": 14,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 23.824,
      "bar": 14,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 24.033,
      "bar": 14,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 24.218,
      "bar": 14,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 24.381,
      "bar": 14,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 24.799,
      "bar": 15,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 25.17,
      "bar": 15,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "off-grid",
      "drum": "snare",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 25.379,
      "bar": 15,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 25.751,
      "bar": 15,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 26.169,
      "bar": 16,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 26.517,
      "bar": 16,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 26.749,
      "bar": 16,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 27.121,
      "bar": 16,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 27.469,
      "bar": 16,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 27.841,
      "bar": 17,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 28.444,
      "bar": 17,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 28.793,
      "bar": 17,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 29.211,
      "bar": 18,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 29.396,
      "bar": 18,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 29.629,
      "bar": 18,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 29.745,
      "bar": 18,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 30.209,
      "bar": 18,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.85,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 30.581,
      "bar": 18,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.59,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 31.138,
      "bar": 19,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.54,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 33.901,
      "bar": 21,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.43,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 34.853,
      "bar": 21,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.3,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 35.039,
      "bar": 21,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 35.248,
      "bar": 22,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 35.991,
      "bar": 22,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 36.989,
      "bar": 23,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.36,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 37.384,
      "bar": 23,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 37.941,
      "bar": 23,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.19,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 38.754,
      "bar": 24,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.52,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 39.288,
      "bar": 24,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 39.706,
      "bar": 24,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 40.078,
      "bar": 25,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 40.472,
      "bar": 25,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 40.658,
      "bar": 25,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 41.401,
      "bar": 25,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 41.982,
      "bar": 26,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 42.771,
      "bar": 26,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.37,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 43.375,
      "bar": 27,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.46,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 43.77,
      "bar": 27,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 44.118,
      "bar": 27,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 44.722,
      "bar": 28,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 45.116,
      "bar": 28,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 45.418,
      "bar": 28,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 45.674,
      "bar": 28,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.4,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 45.836,
      "bar": 28,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 46.463,
      "bar": 29,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 46.858,
      "bar": 29,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 47.438,
      "bar": 29,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 47.833,
      "bar": 30,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.29,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 48.181,
      "bar": 30,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 48.414,
      "bar": 30,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.45,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 48.553,
      "bar": 30,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 48.739,
      "bar": 30,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.38,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 49.133,
      "bar": 30,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 49.551,
      "bar": 31,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 50.132,
      "bar": 31,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.21,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 50.55,
      "bar": 31,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.33,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 50.898,
      "bar": 31,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 51.107,
      "bar": 32,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.57,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 51.293,
      "bar": 32,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.37,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 51.502,
      "bar": 32,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.4,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 51.897,
      "bar": 32,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 52.268,
      "bar": 32,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 52.616,
      "bar": 33,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 52.872,
      "bar": 33,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 53.243,
      "bar": 33,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.36,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 53.615,
      "bar": 33,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.41,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 53.824,
      "bar": 33,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.76,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 54.01,
      "bar": 33,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 54.172,
      "bar": 34,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 54.59,
      "bar": 34,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.13,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 54.985,
      "bar": 34,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.24,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 55.38,
      "bar": 34,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 55.565,
      "bar": 35,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 55.914,
      "bar": 35,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 56.332,
      "bar": 35,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.3,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 56.494,
      "bar": 35,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.37,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 56.842,
      "bar": 35,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.59,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 57.702,
      "bar": 36,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 57.957,
      "bar": 36,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 58.236,
      "bar": 36,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.02,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 58.421,
      "bar": 36,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 58.723,
      "bar": 36,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.58,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 58.863,
      "bar": 36,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 59.025,
      "bar": 37,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 59.118,
      "bar": 37,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 59.234,
      "bar": 37,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 59.536,
      "bar": 37,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.29,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 59.629,
      "bar": 37,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 59.791,
      "bar": 37,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 60.047,
      "bar": 37,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 60.395,
      "bar": 37,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.36,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 60.674,
      "bar": 38,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 60.767,
      "bar": 38,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 61.022,
      "bar": 38,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 61.301,
      "bar": 38,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.3,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 61.51,
      "bar": 38,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 61.928,
      "bar": 38,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.36,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 62.09,
      "bar": 39,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 62.229,
      "bar": 39,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 62.346,
      "bar": 39,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 62.578,
      "bar": 39,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.79,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 62.74,
      "bar": 39,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.59,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 63.042,
      "bar": 39,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 63.46,
      "bar": 39,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 63.762,
      "bar": 40,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "perc",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 63.901,
      "bar": 40,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 64.18,
      "bar": 40,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.37,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 64.435,
      "bar": 40,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 64.644,
      "bar": 40,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 64.923,
      "bar": 40,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.65,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 65.178,
      "bar": 41,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 65.318,
      "bar": 41,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.51,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 65.434,
      "bar": 41,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 65.712,
      "bar": 41,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.61,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 65.829,
      "bar": 41,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 65.945,
      "bar": 41,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.44,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 66.177,
      "bar": 41,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 66.595,
      "bar": 42,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 66.873,
      "bar": 42,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 66.966,
      "bar": 42,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 67.268,
      "bar": 42,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 67.454,
      "bar": 42,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 67.779,
      "bar": 42,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 68.127,
      "bar": 42,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 68.29,
      "bar": 43,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 68.429,
      "bar": 43,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 68.545,
      "bar": 43,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.35,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 68.754,
      "bar": 43,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.4,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 68.94,
      "bar": 43,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 69.265,
      "bar": 43,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 69.706,
      "bar": 44,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 69.985,
      "bar": 44,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 70.078,
      "bar": 44,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 70.356,
      "bar": 44,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.44,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 70.635,
      "bar": 44,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 70.798,
      "bar": 44,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 71.494,
      "bar": 45,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.61,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 71.634,
      "bar": 45,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 71.912,
      "bar": 45,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 72.028,
      "bar": 45,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.3,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 72.144,
      "bar": 45,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 72.307,
      "bar": 45,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 72.423,
      "bar": 45,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 73.166,
      "bar": 46,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 73.979,
      "bar": 46,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 74.35,
      "bar": 47,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.35,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 74.699,
      "bar": 47,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 75.0,
      "bar": 47,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.38,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 75.117,
      "bar": 47,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 75.511,
      "bar": 47,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 75.883,
      "bar": 48,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 76.278,
      "bar": 48,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 76.556,
      "bar": 48,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 76.765,
      "bar": 48,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "perc",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 77.067,
      "bar": 48,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 77.322,
      "bar": 48,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.45,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 77.415,
      "bar": 48,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 77.578,
      "bar": 49,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 77.694,
      "bar": 49,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 77.833,
      "bar": 49,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 78.112,
      "bar": 49,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 78.228,
      "bar": 49,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 78.344,
      "bar": 49,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 78.576,
      "bar": 49,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 79.389,
      "bar": 50,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 80.109,
      "bar": 50,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.08,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 80.527,
      "bar": 50,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 80.805,
      "bar": 51,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "perc",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 80.898,
      "bar": 51,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 81.2,
      "bar": 51,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.38,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 81.316,
      "bar": 51,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 81.688,
      "bar": 51,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 82.083,
      "bar": 51,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.28,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 82.245,
      "bar": 52,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 82.338,
      "bar": 52,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 82.454,
      "bar": 52,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 82.756,
      "bar": 52,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 83.011,
      "bar": 52,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 83.22,
      "bar": 52,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 83.499,
      "bar": 52,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.58,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 83.638,
      "bar": 53,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 83.778,
      "bar": 53,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.35,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 83.87,
      "bar": 53,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.52,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 84.01,
      "bar": 53,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 84.265,
      "bar": 53,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "perc",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 84.405,
      "bar": 53,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 84.521,
      "bar": 53,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 84.799,
      "bar": 53,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 85.426,
      "bar": 54,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.29,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 85.566,
      "bar": 54,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 86.076,
      "bar": 54,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.39,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 86.332,
      "bar": 54,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 86.727,
      "bar": 55,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 86.843,
      "bar": 55,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 87.098,
      "bar": 55,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 87.4,
      "bar": 55,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.38,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 87.516,
      "bar": 55,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.65,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 87.888,
      "bar": 55,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.46,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 88.654,
      "bar": 56,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 88.932,
      "bar": 56,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "perc",
      "energy": 0.35,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 89.188,
      "bar": 56,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.49,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 89.397,
      "bar": 56,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.35,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 90.21,
      "bar": 57,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 90.488,
      "bar": 57,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 90.581,
      "bar": 57,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 90.72,
      "bar": 57,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 90.929,
      "bar": 57,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 91.649,
      "bar": 58,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 91.742,
      "bar": 58,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 91.881,
      "bar": 58,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 92.253,
      "bar": 58,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 92.532,
      "bar": 58,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 92.926,
      "bar": 59,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 93.019,
      "bar": 59,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "perc",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 93.182,
      "bar": 59,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 93.275,
      "bar": 59,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 93.6,
      "bar": 59,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.52,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 93.693,
      "bar": 59,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.4,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 94.087,
      "bar": 59,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 100.682,
      "bar": 64,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 101.053,
      "bar": 64,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.38,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 101.425,
      "bar": 64,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 101.634,
      "bar": 64,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 101.796,
      "bar": 64,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 102.028,
      "bar": 64,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 102.214,
      "bar": 65,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 102.377,
      "bar": 65,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 102.586,
      "bar": 65,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 102.795,
      "bar": 65,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 103.004,
      "bar": 65,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 103.166,
      "bar": 65,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 103.306,
      "bar": 65,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 103.561,
      "bar": 65,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 103.77,
      "bar": 66,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 103.956,
      "bar": 66,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 104.141,
      "bar": 66,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 104.327,
      "bar": 66,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 104.536,
      "bar": 66,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "perc",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 104.745,
      "bar": 66,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 104.908,
      "bar": 66,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 105.117,
      "bar": 66,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 105.279,
      "bar": 66,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 105.511,
      "bar": 67,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 105.651,
      "bar": 67,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 105.883,
      "bar": 67,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 106.092,
      "bar": 67,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 106.231,
      "bar": 67,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 106.417,
      "bar": 67,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 106.672,
      "bar": 67,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 106.858,
      "bar": 68,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 107.021,
      "bar": 68,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 107.276,
      "bar": 68,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 107.416,
      "bar": 68,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 107.624,
      "bar": 68,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.35,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 107.787,
      "bar": 68,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 108.019,
      "bar": 68,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 108.182,
      "bar": 68,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 108.414,
      "bar": 69,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 108.577,
      "bar": 69,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 108.785,
      "bar": 69,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 108.948,
      "bar": 69,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 109.18,
      "bar": 69,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 109.389,
      "bar": 69,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.38,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 109.575,
      "bar": 69,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 109.738,
      "bar": 69,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 109.923,
      "bar": 69,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 110.155,
      "bar": 70,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 110.295,
      "bar": 70,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 110.527,
      "bar": 70,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 110.69,
      "bar": 70,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 110.922,
      "bar": 70,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.4,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 111.107,
      "bar": 70,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 111.316,
      "bar": 70,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.42,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 111.479,
      "bar": 70,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 111.665,
      "bar": 71,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 111.851,
      "bar": 71,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 112.036,
      "bar": 71,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 112.268,
      "bar": 71,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 112.477,
      "bar": 71,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 112.686,
      "bar": 71,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.48,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 112.849,
      "bar": 71,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 113.058,
      "bar": 72,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 113.22,
      "bar": 72,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 113.429,
      "bar": 72,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.35,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 113.592,
      "bar": 72,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 113.801,
      "bar": 72,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 114.033,
      "bar": 72,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 114.219,
      "bar": 72,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 114.428,
      "bar": 72,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 114.521,
      "bar": 72,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 114.776,
      "bar": 73,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 114.985,
      "bar": 73,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 115.171,
      "bar": 73,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 115.566,
      "bar": 73,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 115.775,
      "bar": 73,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 115.96,
      "bar": 73,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 116.123,
      "bar": 73,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 116.309,
      "bar": 73,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 116.541,
      "bar": 74,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 116.912,
      "bar": 74,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 117.098,
      "bar": 74,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 117.284,
      "bar": 74,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 117.516,
      "bar": 74,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 117.702,
      "bar": 74,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 117.888,
      "bar": 75,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 118.097,
      "bar": 75,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 118.259,
      "bar": 75,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 118.468,
      "bar": 75,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 118.631,
      "bar": 75,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.01,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 119.002,
      "bar": 75,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 119.234,
      "bar": 75,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 119.606,
      "bar": 76,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 119.792,
      "bar": 76,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 119.978,
      "bar": 76,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 120.21,
      "bar": 76,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.43,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 120.395,
      "bar": 76,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 120.581,
      "bar": 76,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 120.976,
      "bar": 77,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 121.139,
      "bar": 77,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 121.324,
      "bar": 77,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 121.556,
      "bar": 77,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 121.719,
      "bar": 77,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 121.882,
      "bar": 77,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 122.323,
      "bar": 77,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 122.462,
      "bar": 77,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 122.671,
      "bar": 78,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 122.903,
      "bar": 78,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 123.043,
      "bar": 78,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 123.298,
      "bar": 78,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.03,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 123.646,
      "bar": 78,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 123.855,
      "bar": 78,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 124.064,
      "bar": 78,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 124.064,
      "bar": 78,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 124.25,
      "bar": 79,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 124.413,
      "bar": 79,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 124.645,
      "bar": 79,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 124.83,
      "bar": 79,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.36,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 125.039,
      "bar": 79,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.05,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 125.388,
      "bar": 79,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 125.597,
      "bar": 79,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.43,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 125.991,
      "bar": 80,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 126.154,
      "bar": 80,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.48,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 126.363,
      "bar": 80,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 126.781,
      "bar": 80,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 127.152,
      "bar": 80,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 127.361,
      "bar": 81,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.17,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 127.756,
      "bar": 81,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 127.942,
      "bar": 81,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 128.128,
      "bar": 81,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 128.453,
      "bar": 81,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 128.708,
      "bar": 82,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 129.103,
      "bar": 82,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.06,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 129.405,
      "bar": 82,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.21,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 129.869,
      "bar": 82,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.16,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 129.985,
      "bar": 82,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 130.473,
      "bar": 83,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.32,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 130.844,
      "bar": 83,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 130.984,
      "bar": 83,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.57,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 131.17,
      "bar": 83,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.07,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 131.425,
      "bar": 83,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 131.773,
      "bar": 83,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.08,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 132.191,
      "bar": 84,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 132.563,
      "bar": 84,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 132.632,
      "bar": 84,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 132.772,
      "bar": 84,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.04,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 133.166,
      "bar": 84,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.87,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 133.538,
      "bar": 85,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.78,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 134.142,
      "bar": 85,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.36,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 134.513,
      "bar": 85,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.38,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 134.908,
      "bar": 85,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 135.303,
      "bar": 86,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.79,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 135.419,
      "bar": 86,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.59,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 135.512,
      "bar": 86,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.52,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 136.812,
      "bar": 87,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.33,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 137.253,
      "bar": 87,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "kick",
      "energy": 0.32,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 137.648,
      "bar": 87,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.32,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 137.834,
      "bar": 87,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 137.973,
      "bar": 87,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.32,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 138.159,
      "bar": 88,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.13,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 138.623,
      "bar": 88,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.47,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 138.948,
      "bar": 88,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 139.552,
      "bar": 88,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 139.947,
      "bar": 89,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 140.341,
      "bar": 89,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 140.458,
      "bar": 89,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.53,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 140.736,
      "bar": 89,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.28,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 140.899,
      "bar": 89,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 141.317,
      "bar": 90,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.5,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 141.619,
      "bar": 90,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.35,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 142.269,
      "bar": 90,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.21,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 142.64,
      "bar": 90,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 142.849,
      "bar": 91,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 143.058,
      "bar": 91,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.31,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 143.267,
      "bar": 91,
      "beat_in_bar": 2,
      "step16": 6,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.4,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 143.453,
      "bar": 91,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 143.615,
      "bar": 91,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.11,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 144.01,
      "bar": 91,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.39,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 144.382,
      "bar": 92,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.26,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 144.614,
      "bar": 92,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "kick",
      "energy": 0.28,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 144.985,
      "bar": 92,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 145.38,
      "bar": 92,
      "beat_in_bar": 4,
      "step16": 12,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.3,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 145.752,
      "bar": 92,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.46,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 146.332,
      "bar": 93,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.36,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 146.704,
      "bar": 93,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.26,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 146.797,
      "bar": 93,
      "beat_in_bar": 3,
      "step16": 10,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.53,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 147.122,
      "bar": 93,
      "beat_in_bar": 4,
      "step16": 14,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.22,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 147.47,
      "bar": 94,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.25,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 147.679,
      "bar": 94,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 148.074,
      "bar": 94,
      "beat_in_bar": 3,
      "step16": 8,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 148.399,
      "bar": 94,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 148.608,
      "bar": 94,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 148.84,
      "bar": 95,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "snare",
      "energy": 0.34,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 149.049,
      "bar": 95,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.43,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 149.42,
      "bar": 95,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 149.815,
      "bar": 95,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 150.187,
      "bar": 95,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.35,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 150.349,
      "bar": 95,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.12,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 150.79,
      "bar": 96,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.23,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 151.162,
      "bar": 96,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.1,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 151.371,
      "bar": 96,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.39,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 151.51,
      "bar": 96,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.31,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 151.696,
      "bar": 96,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.35,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 152.044,
      "bar": 97,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "perc",
      "energy": 0.15,
      "feel": "heavy",
      "special": "riser"
    },
    {
      "t": 152.509,
      "bar": 97,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.25,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 152.903,
      "bar": 97,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.09,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 153.089,
      "bar": 97,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.09,
      "feel": "heavy",
      "special": "hard_stop"
    },
    {
      "t": 153.507,
      "bar": 98,
      "beat_in_bar": 1,
      "step16": 0,
      "grid": "strong",
      "drum": "hihat",
      "energy": 0.43,
      "feel": "intimate",
      "special": "hard_stop"
    },
    {
      "t": 153.879,
      "bar": 98,
      "beat_in_bar": 1,
      "step16": 3,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.2,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 154.064,
      "bar": 98,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.48,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 154.25,
      "bar": 98,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.14,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 154.413,
      "bar": 98,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.19,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 154.807,
      "bar": 98,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.5,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 155.249,
      "bar": 99,
      "beat_in_bar": 1,
      "step16": 2,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.3,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 155.597,
      "bar": 99,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.18,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 155.736,
      "bar": 99,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "perc",
      "energy": 0.25,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 156.201,
      "bar": 99,
      "beat_in_bar": 3,
      "step16": 11,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.19,
      "feel": "intimate",
      "special": null
    },
    {
      "t": 156.572,
      "bar": 99,
      "beat_in_bar": 4,
      "step16": 15,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.27,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 156.781,
      "bar": 100,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.51,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 156.99,
      "bar": 100,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.37,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 157.129,
      "bar": 100,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "kick",
      "energy": 0.38,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 157.547,
      "bar": 100,
      "beat_in_bar": 3,
      "step16": 9,
      "grid": "syncopated",
      "drum": "snare",
      "energy": 0.34,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 157.919,
      "bar": 100,
      "beat_in_bar": 4,
      "step16": 13,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 158.337,
      "bar": 101,
      "beat_in_bar": 1,
      "step16": 1,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.15,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 158.546,
      "bar": 101,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "snare",
      "energy": 0.22,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 158.941,
      "bar": 101,
      "beat_in_bar": 2,
      "step16": 4,
      "grid": "weak",
      "drum": "hihat",
      "energy": 0.33,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 159.266,
      "bar": 101,
      "beat_in_bar": 2,
      "step16": 7,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.24,
      "feel": "heavy",
      "special": null
    },
    {
      "t": 159.869,
      "bar": 101,
      "beat_in_bar": 2,
      "step16": 5,
      "grid": "syncopated",
      "drum": "hihat",
      "energy": 0.54,
      "feel": "heavy",
      "special": null
    }
  ],
  "phrases": [
    {
      "index": 0,
      "start": 1.231,
      "end": 7.454,
      "bars": 4
    },
    {
      "index": 1,
      "start": 7.454,
      "end": 13.63,
      "bars": 4
    },
    {
      "index": 2,
      "start": 13.63,
      "end": 19.807,
      "bars": 4
    },
    {
      "index": 3,
      "start": 19.807,
      "end": 26.006,
      "bars": 4
    },
    {
      "index": 4,
      "start": 26.006,
      "end": 32.229,
      "bars": 4
    },
    {
      "index": 5,
      "start": 32.229,
      "end": 38.406,
      "bars": 4
    },
    {
      "index": 6,
      "start": 38.406,
      "end": 44.768,
      "bars": 4
    },
    {
      "index": 7,
      "start": 44.768,
      "end": 50.968,
      "bars": 4
    },
    {
      "index": 8,
      "start": 50.968,
      "end": 57.237,
      "bars": 4
    },
    {
      "index": 9,
      "start": 57.237,
      "end": 63.553,
      "bars": 4
    },
    {
      "index": 10,
      "start": 63.553,
      "end": 69.753,
      "bars": 4
    },
    {
      "index": 11,
      "start": 69.753,
      "end": 75.929,
      "bars": 4
    },
    {
      "index": 12,
      "start": 75.929,
      "end": 82.152,
      "bars": 4
    },
    {
      "index": 13,
      "start": 82.152,
      "end": 88.329,
      "bars": 4
    },
    {
      "index": 14,
      "start": 88.329,
      "end": 94.528,
      "bars": 4
    },
    {
      "index": 15,
      "start": 94.528,
      "end": 100.728,
      "bars": 4
    },
    {
      "index": 16,
      "start": 100.728,
      "end": 106.905,
      "bars": 4
    },
    {
      "index": 17,
      "start": 106.905,
      "end": 113.104,
      "bars": 4
    },
    {
      "index": 18,
      "start": 113.104,
      "end": 119.49,
      "bars": 4
    },
    {
      "index": 19,
      "start": 119.49,
      "end": 125.666,
      "bars": 4
    },
    {
      "index": 20,
      "start": 125.666,
      "end": 131.866,
      "bars": 4
    },
    {
      "index": 21,
      "start": 131.866,
      "end": 138.066,
      "bars": 4
    },
    {
      "index": 22,
      "start": 138.066,
      "end": 144.289,
      "bars": 4
    },
    {
      "index": 23,
      "start": 144.289,
      "end": 150.442,
      "bars": 4
    },
    {
      "index": 24,
      "start": 150.442,
      "end": 156.642,
      "bars": 4
    },
    {
      "index": 25,
      "start": 156.642,
      "end": 165.355,
      "bars": 2
    }
  ]
}
```

### 10/20 · `ai-beat-sync/compositions/frames/01-f1-boot.html`
<!-- casebook-file {"path": "ai-beat-sync/compositions/frames/01-f1-boot.html", "lines": 349, "final_newline": true, "sha256": "60303bcec102fadc7229cf258b46a8cd7001295f4d16adf78573b6ff78bfe768", "original_sha256": "60303bcec102fadc7229cf258b46a8cd7001295f4d16adf78573b6ff78bfe768"} -->
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>01-f1-boot — typewriter phrase / keyword shuffle</title>
  </head>
  <body>
    <template>
      <style>
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-400.ttf") format("truetype"); font-weight: 400; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "Microsoft YaHei"; src: local("Microsoft YaHei"); font-weight: 400 900; font-display: block; }

        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        #stage {
          position: relative;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          background: #111111;
          font-family: Barlow, "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
        }
        /* subtle terminal scanline texture (static; opacity pulsed on kicks) */
        #g1_scan {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.45;
          background: repeating-linear-gradient(
            0deg,
            rgba(240, 236, 229, 0.045) 0 1px,
            transparent 1px 4px
          );
        }
        .g1-chrome {
          position: absolute;
          left: 106px;
          right: 106px;
          height: 34px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 10px;
          font-family: "IBM Plex Mono", "Courier New", monospace;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
        }
        #g1_chrome_top {
          top: 44px;
          border-bottom: 1px solid #282826;
        }
        #g1_chrome_bot {
          bottom: 44px;
          border-top: 1px solid #282826;
          align-items: flex-start;
          padding-bottom: 0;
          padding-top: 10px;
        }
        #g1 {
          position: absolute;
          inset: 0;
          padding: 106px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .g1-mono {
          font-family: "IBM Plex Mono", "Courier New", monospace;
          font-size: 30px;
          font-weight: 500;
          letter-spacing: 0.08em;
          line-height: 1.2;
        }
        #g1_lead1 {
          display: flex;
          align-items: center;
          color: #f0ece5;
        }
        #g1_block {
          display: inline-block;
          width: 18px;
          height: 30px;
          margin-right: 14px;
          background: #e85d26;
        }
        #g1_prompt {
          color: #e85d26;
        }
        #g1_lead2 {
          margin-top: 16px;
          color: #888880;
        }
        #g1_phrase {
          margin-top: 84px;
          display: flex;
          gap: 0.22em;
          color: #f0ece5;
          font-size: 108px;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .g1-w {
          display: inline-block;
        }
        #g1_keyrow {
          margin-top: 28px;
          display: flex;
          align-items: baseline;
          line-height: 0.9;
        }
        #g1_key {
          display: inline-block;
          color: #e85d26;
          font-size: 200px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }
        #g1_cursor {
          display: inline-block;
          margin-left: 0.05em;
          color: #f0ece5;
          font-size: 200px;
          font-weight: 900;
          letter-spacing: -0.04em;
        }
        #g1_status {
          margin-top: 76px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        #g1_stub {
          width: 36px;
          height: 2px;
          background: #e85d26;
        }
        #g1_status_text {
          font-family: "IBM Plex Mono", "Courier New", monospace;
          font-size: 22px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
        }
      </style>

      <div
        id="stage"
        data-composition-id="01-f1-boot"
        data-width="1920"
        data-height="1080"
        data-duration="4.644"
        data-root="true"
      >
        <div id="g1_scan"></div>
        <div class="g1-chrome" id="g1_chrome_top">
          <span>tty1 · ai_boot</span>
          <span>f1 / 06</span>
        </div>
        <div class="g1-chrome" id="g1_chrome_bot">
          <span>audio · 152 bpm</span>
          <span>seq 01 · cold open</span>
        </div>

        <div id="g1">
          <div class="g1-mono" id="g1_lead1"><span id="g1_block"></span><span id="g1_prompt">$</span>&nbsp;boot --year 2017</div>
          <div class="g1-mono" id="g1_lead2">// the paper that changed everything</div>
          <div id="g1_phrase">
            <span class="g1-w" id="g1_w0">attention</span>
            <span class="g1-w" id="g1_w1">is</span>
            <span class="g1-w" id="g1_w2">all</span>
            <span class="g1-w" id="g1_w3">you</span>
            <span class="g1-w" id="g1_w4">need</span>
          </div>
          <div id="g1_keyrow">
            <span id="g1_key">transformer</span>
            <span id="g1_cursor">_</span>
          </div>
          <div id="g1_status">
            <span id="g1_stub"></span>
            <span id="g1_status_text">status: ok — session live</span>
          </div>
        </div>
      </div>

      <script>
        (function () {
          var ID = "01-f1-boot";
          var DUR = 4.644;

          // keyword font-shuffle faces (0 = base Barlow 900, shared brand face)
          var FONTS = [
            {
              fontFamily: 'Barlow, "Noto Sans SC", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 900,
              fontStyle: "normal",
              letterSpacing: "-0.04em",
            },
            {
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: 700,
              fontStyle: "normal",
              letterSpacing: "-0.02em",
            },
            {
              fontFamily: '"Courier New", Courier, monospace',
              fontWeight: 700,
              fontStyle: "normal",
              letterSpacing: "-0.06em",
            },
          ];
          function fontProps(i) {
            var f = FONTS[((i % FONTS.length) + FONTS.length) % FONTS.length];
            return {
              fontFamily: f.fontFamily,
              fontWeight: f.fontWeight,
              fontStyle: f.fontStyle,
              letterSpacing: f.letterSpacing,
            };
          }

          // role_bindings → frame-local seconds (frame starts at 0.0)
          var SHUFFLE = [
            { t: 3.81, font: 1 },
            { t: 4.23, font: 2 },
            { t: 4.57, font: 0 },
          ];
          var KICKS = [2.42, 2.81];
          var BLINKS = [3.111, 3.483, 3.854, 4.272]; // beat-grid cursor blinks

          window.__timelines = window.__timelines || {};
          var tl = gsap.timeline({ paused: true });

          var keyed = [
            "#g1_lead1",
            "#g1_lead2",
            "#g1_w0",
            "#g1_w1",
            "#g1_w2",
            "#g1_w3",
            "#g1_w4",
            "#g1_key",
            "#g1_cursor",
            "#g1_status",
          ];
          gsap.set(keyed, { autoAlpha: 0 });
          gsap.set("#g1_key", fontProps(0));

          var POP_IN = { autoAlpha: 0, scale: 0.92, y: 6 };
          var POP_OUT = { autoAlpha: 1, scale: 1, y: 0, duration: 0.1, ease: "back.out(2)" };

          // group visibility across its frame-local span (0ms cut at the tail)
          tl.set("#g1", { autoAlpha: 1 }, 0);

          // 0.14 — the command types over the block cursor
          tl.set("#g1_block", { autoAlpha: 0 }, 0.14);
          tl.fromTo("#g1_lead1", POP_IN, POP_OUT, 0.14);
          // 0.53 — the comment line
          tl.fromTo("#g1_lead2", POP_IN, POP_OUT, 0.53);
          // 1.11 → 2.23 — the phrase, one word per onset
          ["#g1_w0", "#g1_w1", "#g1_w2", "#g1_w3", "#g1_w4"].forEach(function (sel, i) {
            tl.fromTo(sel, POP_IN, POP_OUT, [1.11, 1.51, 1.86, 2.09, 2.23][i]);
          });
          // 2.42 (kick) — the keyword slams in
          tl.fromTo(
            "#g1_key",
            { autoAlpha: 0, scale: 0.8, y: 14 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.16, ease: "back.out(2.2)" },
            2.42
          );
          // 2.81 (kick) — the trailing cursor punches in
          tl.fromTo(
            "#g1_cursor",
            { autoAlpha: 0, scale: 0.3 },
            { autoAlpha: 1, scale: 1, duration: 0.09, ease: "back.out(3)" },
            2.81
          );
          // 3.23 — status row slides in
          tl.fromTo(
            "#g1_status",
            { autoAlpha: 0, x: -16 },
            { autoAlpha: 1, x: 0, duration: 0.14, ease: "power2.out" },
            3.23
          );

          // kick feedback — micro screen-shake + scanline pulse
          KICKS.forEach(function (t, i) {
            tl.fromTo(
              "#g1",
              { x: i % 2 === 0 ? 8 : -7, y: i % 2 === 0 ? -5 : 4 },
              { x: 0, y: 0, duration: 0.18, ease: "power3.out", immediateRender: false },
              t
            );
          });
          KICKS.concat([3.81, 4.23, 4.57]).forEach(function (t) {
            tl.fromTo(
              "#g1_scan",
              { opacity: 0.85 },
              {
                opacity: 0.45,
                duration: Math.min(0.22, DUR - 0.014 - t),
                ease: "power1.out",
                immediateRender: false,
              },
              t
            );
          });

          // beat-grid cursor blinks (after the punch-in settles)
          BLINKS.forEach(function (t, i) {
            tl.set("#g1_cursor", { autoAlpha: i % 2 === 0 ? 0 : 1 }, t);
          });

          // the three tail hits — keyword shuffles face on each hit
          SHUFFLE.forEach(function (s) {
            tl.set("#g1_key", fontProps(s.font), s.t);
            tl.fromTo(
              "#g1_key",
              { x: -7 },
              { x: 0, duration: 0.1, ease: "power2.out", immediateRender: false },
              s.t
            );
          });

          tl.set("#g1", { autoAlpha: 0 }, DUR);

          tl.seek(0);
          window.__timelines[ID] = tl;
        })();
      </script>
    </template>
  </body>
</html>
```

### 11/20 · `ai-beat-sync/compositions/frames/02-f2-title.html`
<!-- casebook-file {"path": "ai-beat-sync/compositions/frames/02-f2-title.html", "lines": 428, "final_newline": true, "sha256": "6f6c15b40d99c7bea23e1c8d4bef1aa97145d654a62045374e4de17c675a1b15", "original_sha256": "6f6c15b40d99c7bea23e1c8d4bef1aa97145d654a62045374e4de17c675a1b15"} -->
```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <template>
      <style>
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-400.ttf") format("truetype"); font-weight: 400; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "Microsoft YaHei"; src: local("Microsoft YaHei"); font-weight: 400 900; font-display: block; }

        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        #stage {
          position: absolute;
          inset: 0;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          background: #111111;
          color: #f0ece5;
          font-family: "Barlow", "Noto Sans SC", sans-serif;
          container-type: size;
        }
        #g1 {
          position: absolute;
          inset: 0;
        }

        /* ── chrome (IBM Plex Mono, uppercase, 0.14em) ── */
        .g1_mono {
          font-family: "IBM Plex Mono", "Noto Sans SC", monospace;
          font-weight: 500;
          font-size: 26px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
        }
        #g1_kicker {
          position: absolute;
          top: 70px;
          left: 106px;
          color: #e85d26;
        }
        #g1_tempo {
          position: absolute;
          top: 70px;
          right: 106px;
        }
        #g1_botrule {
          position: absolute;
          left: 106px;
          right: 106px;
          bottom: 96px;
          height: 1px;
          background: #282826;
        }
        #g1_index {
          position: absolute;
          left: 106px;
          bottom: 112px;
        }
        #g1_frametag {
          position: absolute;
          right: 106px;
          bottom: 112px;
        }
        #g1_ticks {
          position: absolute;
          left: 460px;
          right: 460px;
          bottom: 108px;
          height: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .g1_tick {
          width: 22px;
          height: 6px;
          background: #282826;
        }

        /* ── ghost catalogue numeral (1px hairline stroke, flat) ── */
        #g1_ghost {
          position: absolute;
          right: 30px;
          bottom: -140px;
          font-weight: 900;
          font-size: 720px;
          line-height: 0.8;
          letter-spacing: -0.04em;
          color: #111111;
          -webkit-text-stroke: 1px #282826;
          user-select: none;
        }

        /* ── surge bar (the door kicking open at local 0.032) ── */
        #g1_surge {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: #e85d26;
          transform-origin: 0 50%;
          transform: scaleX(0);
        }

        /* ── phrases: one massive CJK word, hard-cut between anchors ── */
        .g1_phrase {
          position: absolute;
          left: 106px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.02em;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transform-origin: 0 50%;
          will-change: transform, opacity;
        }
        #g1_p1 { font-size: 460px; }
        #g1_p2 { font-size: 400px; }
        #g1_p3 { font-size: 460px; }
        .g1_ch {
          display: inline-block;
          color: #f0ece5;
          will-change: transform, opacity;
        }
        .g1_ch.g1_hero {
          color: #e85d26;
        }

        /* ── climax: "ai 觉醒" slides in on the 9.59 kick, sparkle pops at 10.17 ── */
        #g1_climax {
          position: absolute;
          left: 50%;
          top: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 42px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          will-change: transform, opacity;
        }
        #g1_ckicker {
          font-family: "IBM Plex Mono", "Noto Sans SC", monospace;
          font-weight: 500;
          font-size: 30px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #e85d26;
        }
        #g1_crow {
          display: flex;
          align-items: center;
          gap: 0.32em;
          font-weight: 900;
          font-size: 230px;
          line-height: 1;
          letter-spacing: -0.035em;
        }
        #g1_cw1 {
          color: #f0ece5;
        }
        #g1_cw2 {
          color: #e85d26;
        }
        #g1_icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          width: 265px;
          height: 265px;
          color: #e85d26;
          opacity: 0;
          visibility: hidden;
        }
        #g1_glyph {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 265px;
          height: 265px;
          transform-origin: 50% 50%;
        }
        #g1_glyph svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .g1_ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 345px;
          height: 345px;
          border: 3px solid rgba(232, 93, 38, 0.5);
          opacity: 0;
        }
        .g1_ring.g1_ring2 {
          border-color: rgba(232, 93, 38, 0.22);
        }
      </style>

      <div
        id="stage"
        data-composition-id="02-f2-title"
        data-width="1920"
        data-height="1080"
        data-duration="6.269"
        data-root="true"
        data-layout-allow-overflow
      >
        <div id="g1">
          <div id="g1_ghost" data-layout-allow-overflow data-layout-allow-overlap>02</div>
          <div id="g1_surge"></div>

          <div id="g1_kicker" class="g1_mono">// 02 — surge</div>
          <div id="g1_tempo" class="g1_mono">152 bpm · 4/4</div>
          <div id="g1_index" class="g1_mono">w.00/03</div>
          <div id="g1_frametag" class="g1_mono">f2 · title</div>
          <div id="g1_ticks"></div>
          <div id="g1_botrule"></div>

          <div class="g1_phrase" id="g1_p1"
            ><span class="g1_ch g1_hero">机</span><span class="g1_ch g1_hero">器</span></div
          >
          <div class="g1_phrase" id="g1_p2"
            ><span class="g1_ch g1_hero">学</span><span class="g1_ch g1_hero">会</span><span class="g1_ch">了</span></div
          >
          <div class="g1_phrase" id="g1_p3"
            ><span class="g1_ch g1_hero">思</span><span class="g1_ch g1_hero">考</span></div
          >

          <div id="g1_climax">
            <div id="g1_ckicker">the awakening · 智能觉醒</div>
            <div id="g1_crow">
              <span id="g1_cw1">ai</span>
              <span id="g1_cw2">觉醒</span>
              <span id="g1_icon">
                <span class="g1_ring"></span>
                <span class="g1_ring g1_ring2"></span>
                <span id="g1_glyph">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
                    <path d="M12 1.8l2.1 6.9 6.9 2.1-6.9 2.1L12 19.8l-2.1-6.9L3 10.8l6.9-2.1z" />
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <script>
        (function () {
          // Frame 2 — f2-title · intro-kinetic-cascade fork, Broadside palette.
          // Frame-local time = track time − 4.644. Span 0 … 6.269.
          var SPAN = 6.269;
          var ORANGE = "#E85D26";

          // 152 BPM beats inside [4.644, 10.913), shifted to frame-local.
          var BEATS = [
            0, 0.395, 0.789, 1.184, 1.579, 1.95, 2.322, 2.717, 3.111, 3.506, 3.901, 4.272, 4.644,
            5.039, 5.433, 5.851,
          ];

          // role_bindings (track → local): phrase.times [4.97, 6.55, 7.85] → [0.326, 1.906, 3.206];
          // climax.in 9.59 → 4.946; climax.iconAt 10.17 → 5.526.
          var PHRASES = [
            { id: "g1_p1", at: 0.326, out: 1.906 },
            { id: "g1_p2", at: 1.906, out: 3.206 },
            { id: "g1_p3", at: 3.206, out: 4.946 },
          ];
          var CLIMAX_IN = 4.946;
          var ICON_AT = 5.526;
          var SURGE_AT = 0.032; // SURGE key moment 4.676, e=0.93

          var stage = document.getElementById("stage");
          var ticksEl = document.getElementById("g1_ticks");
          var indexEl = document.getElementById("g1_index");

          // Beat ticks — one per beat, accumulate orange as the frame plays out.
          var ticks = BEATS.map(function (_, i) {
            var t = document.createElement("div");
            t.className = "g1_tick";
            t.id = "g1_tick" + i;
            ticksEl.appendChild(t);
            return t;
          });

          var tl = gsap.timeline({ paused: true });

          // ── initial states ──
          gsap.set("#g1", { autoAlpha: 1 });
          gsap.set(".g1_phrase", { autoAlpha: 0 });
          gsap.set(".g1_ch", { autoAlpha: 0, y: 46 });
          gsap.set("#g1_climax", { xPercent: -50, yPercent: -50, x: 1200, autoAlpha: 0 });
          gsap.set("#g1_icon", { autoAlpha: 0 });
          gsap.set("#g1_glyph", { scale: 0.4, rotation: -8, autoAlpha: 0 });
          gsap.set(".g1_ring", { autoAlpha: 0, scale: 0.4, xPercent: -50, yPercent: -50 });

          // ── group span: g1 covers the whole frame (0 … 6.269) ──
          tl.set("#g1", { autoAlpha: 1 }, 0);
          tl.set("#g1", { autoAlpha: 0 }, SPAN);

          // ── SURGE: the door kicks open ──
          tl.fromTo(
            "#g1_surge",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.28, ease: "power3.out" },
            SURGE_AT,
          );
          tl.to("#g1_surge", { autoAlpha: 0, duration: 0.2, ease: "power1.out" }, SURGE_AT + 0.42);

          // ── beat ticks accumulate, one per beat ──
          ticks.forEach(function (t, i) {
            tl.set(t, { backgroundColor: ORANGE }, BEATS[i]);
          });

          // ── phrases: char-staggered slam on each snare anchor, 0ms cut-out ──
          var INDEX_LABELS = ["w.01/03", "w.02/03", "w.03/03"];
          PHRASES.forEach(function (p, pi) {
            var el = document.getElementById(p.id);
            var chars = el.querySelectorAll(".g1_ch");
            tl.set(el, { autoAlpha: 1 }, p.at);
            tl.fromTo(
              el,
              { scale: 1.06 },
              { scale: 1, duration: 0.3, ease: "power2.out" },
              p.at,
            );
            for (var i = 0; i < chars.length; i++) {
              tl.fromTo(
                chars[i],
                { autoAlpha: 0, y: 46 },
                { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" },
                p.at + i * 0.07,
              );
            }
            tl.set(indexEl, { textContent: INDEX_LABELS[pi] }, p.at);
            // beat-locked pulses while the phrase is up
            BEATS.forEach(function (b) {
              if (b >= p.at + 0.3 && b < p.out) {
                tl.fromTo(el, { scale: 1.045 }, { scale: 1, duration: 0.13, ease: "power2.out" }, b);
              }
            });
            // hard cut to the next phrase
            tl.set(el, { autoAlpha: 0 }, p.out);
          });

          // ── climax: slide in on the 9.59 kick ──
          tl.set(indexEl, { textContent: "the awakening" }, CLIMAX_IN);
          tl.to(
            "#g1_climax",
            { x: 0, autoAlpha: 1, duration: 0.42, ease: "power3.out" },
            CLIMAX_IN,
          );
          tl.fromTo(
            "#g1_ckicker",
            { y: -18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
            CLIMAX_IN + 0.1,
          );

          // ── sparkle pop + square ring pings at 10.17 ──
          tl.to("#g1_icon", { autoAlpha: 1, duration: 0.2, ease: "power3.out" }, ICON_AT);
          tl.fromTo(
            "#g1_glyph",
            { scale: 0.4, rotation: -8, autoAlpha: 0 },
            { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.35, ease: "back.out(2.4)" },
            ICON_AT + 0.05,
          );
          tl.to("#g1_glyph", { rotation: 13, duration: 0.1, ease: "power2.out" }, ICON_AT + 0.4);
          tl.to(
            "#g1_glyph",
            { rotation: 0, duration: 0.85, ease: "elastic.out(1, 0.25)" },
            ICON_AT + 0.5,
          );
          [0, 0.28].forEach(function (off) {
            tl.fromTo(
              ".g1_ring",
              { scale: 0.4, autoAlpha: 0.55, xPercent: -50, yPercent: -50 },
              { scale: 1.5, autoAlpha: 0, xPercent: -50, yPercent: -50, duration: 0.8, ease: "power2.out", stagger: 0.08 },
              ICON_AT + 0.42 + off,
            );
          });

          // ── climax beat pulses (5.851 kick stream tail) ──
          [5.851].forEach(function (b) {
            tl.fromTo(
              "#g1_climax",
              { scale: 1.03 },
              { scale: 1, duration: 0.14, ease: "power2.out" },
              b,
            );
          });

          // hold the climax to the frame edge
          tl.to({}, { duration: SPAN }, 0);
          tl.seek(0);

          window.__timelines["02-f2-title"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
```

### 12/20 · `ai-beat-sync/compositions/frames/03-f3-montage.html`
<!-- casebook-file {"path": "ai-beat-sync/compositions/frames/03-f3-montage.html", "lines": 647, "final_newline": true, "sha256": "9055fc89a014b4f13a9ed8cc9bbcbe11f43eb446a10662939edb6a76d0d63542", "original_sha256": "9055fc89a014b4f13a9ed8cc9bbcbe11f43eb446a10662939edb6a76d0d63542"} -->
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>03-f3-montage</title>
  </head>
  <body>
    <template>
      <style>
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-400.ttf") format("truetype"); font-weight: 400; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "Microsoft YaHei"; src: local("Microsoft YaHei"); font-weight: 400 900; font-display: block; }

        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        #stage {
          position: absolute;
          inset: 0;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          background: #111111;
          font-family: "Barlow", "Noto Sans SC", sans-serif;
        }
        .g {
          position: absolute;
          inset: 0;
        }

        /* ── g1 · poster-tile mosaic (Broadside dark register) ─────────── */
        #g1 {
          background: #111111;
        }
        #g1_wall {
          position: absolute;
          inset: 0;
        }
        .g1-tile {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .g1-yr {
          font-family: "IBM Plex Mono", monospace;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          line-height: 1.2;
          padding: 0 0.55em;
        }
        .g1-ev {
          font-family: "Barlow", "Noto Sans SC", sans-serif;
          font-weight: 900;
          text-transform: lowercase;
          letter-spacing: -0.02em;
          line-height: 0.95;
          padding: 0.12em 0.55em 0.5em;
        }
        .g1-ghost {
          position: absolute;
          border: 1px solid #282826;
        }
        .g1-chrome {
          position: absolute;
          left: 96px;
          right: 96px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-family: "IBM Plex Mono", monospace;
          font-weight: 500;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }
        #g1_chrome_top {
          top: 30px;
          padding-bottom: 12px;
          border-bottom: 1px solid #282826;
        }
        #g1_chrome_bot {
          bottom: 30px;
          padding-top: 12px;
          border-top: 1px solid #282826;
        }
        .g1-ck-a {
          color: #e85d26;
        }
        .g1-ck-b {
          color: #888880;
        }

        /* ── g2 · card flyby (flat, 0 radius, hairline wires) ──────────── */
        #g2 {
          background: #111111;
        }
        #g2_stage {
          position: absolute;
          left: 0;
          top: 0;
          width: 1920px;
          height: 1080px;
          perspective: 2400px;
          perspective-origin: 50% 55%;
        }
        #g2_scene {
          position: absolute;
          left: 0;
          top: 0;
          width: 1920px;
          height: 1080px;
          transform-style: preserve-3d;
        }
        .g2-card {
          position: absolute;
          left: calc(50% - 700px);
          top: calc(50% - 395px);
          width: 1400px;
          height: 790px;
          will-change: transform, opacity;
          --wipe: 0;
          transform-origin: 50% 50%;
        }
        .g2-wire {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(240, 236, 229, 0.35);
          background: rgba(240, 236, 229, 0.012);
          overflow: hidden;
        }
        .g2-wire-label {
          position: absolute;
          left: 64px;
          top: 56px;
          font-family: "IBM Plex Mono", monospace;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240, 236, 229, 0.5);
        }
        .g2-wire-corner {
          position: absolute;
          right: 64px;
          top: 56px;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(240, 236, 229, 0.32);
        }
        .g2-wire-bar {
          position: absolute;
          left: 64px;
          right: 64px;
          bottom: 64px;
          height: 1px;
          background: rgba(240, 236, 229, 0.22);
        }
        .g2-solid {
          position: absolute;
          inset: 0;
          background: var(--color);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 100px;
          clip-path: polygon(
            0% 0%,
            calc(var(--wipe) * 200% - 30%) 0%,
            calc(var(--wipe) * 200% - 80%) 100%,
            0% 100%
          );
        }
        .g2-title {
          font-family: "Barlow", "Noto Sans SC", sans-serif;
          font-size: 170px;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.92;
          color: var(--ink);
          text-align: center;
          max-width: 100%;
          overflow-wrap: break-word;
          text-transform: lowercase;
        }
        #g2_edge {
          position: absolute;
          left: 28px;
          top: 28px;
          right: 28px;
          bottom: 28px;
          border: 1px solid #e85d26;
          opacity: 0;
          pointer-events: none;
        }
      </style>

      <div
        id="stage"
        data-composition-id="03-f3-montage"
        data-width="1920"
        data-height="1080"
        data-duration="11.749"
      >
        <div id="g1" class="g">
          <div id="g1_wall"></div>
          <div id="g1_chrome_top" class="g1-chrome">
            <span class="g1-ck-a">ai chronology — 2016 / 2025</span>
            <span class="g1-ck-b">no. 03 · montage</span>
          </div>
          <div id="g1_chrome_bot" class="g1-chrome">
            <span class="g1-ck-b">152 bpm · kick-locked accumulation</span>
            <span class="g1-ck-b">f3 / f6</span>
          </div>
        </div>
        <div id="g2" class="g">
          <div id="g2_stage">
            <div id="g2_scene"></div>
          </div>
          <div id="g2_edge"></div>
        </div>
      </div>

      <script>
        (function () {
          window.__timelines = window.__timelines || {};
          var tl = gsap.timeline({ paused: true });

          var ORANGE = "#E85D26",
            INK = "#111111",
            CREAM = "#F0ECE5";

          // ══════════════════════════════════════════════════════════════
          //  g1 · POSTER-TILE MOSAIC — fork of the template, Broadside tokens.
          //  program: accumulate on kicks → locked global recolor on the
          //  12.399–12.910 kick roll → snake-fill to 17.2. All times below are
          //  frame-local (track − 10.913).
          // ══════════════════════════════════════════════════════════════
          var wall = document.getElementById("g1_wall");
          var MARGIN = 96,
            GAP = 6,
            N = 12,
            BANDS = 3;
          var innerW = 1920 - MARGIN * 2,
            innerH = 1080 - MARGIN * 2;
          var LABELS = [
            "2012 alexnet",
            "2016 alphago",
            "2017 transformer",
            "2020 gpt-3",
            "2022 chatgpt",
            "2025 agents",
            "2022 midjourney",
            "2023 gpt-4",
            "2024 sora",
            "2024 multimodal",
            "2025 deepseek-r1",
            "2025 kimi k2",
          ];
          // bands ['#1A1A18','#282826','#E85D26'] — the only fills the wall wears
          var THEMES = [
            ["#1A1A18", "#282826", "#1A1A18", "#282826"], // 0 pre-roll dark wall
            ["#1A1A18", "#E85D26", "#282826", "#1A1A18"], // 1 roll flash A
            ["#282826", "#1A1A18", "#E85D26", "#282826"], // 2 roll flash B
            ["#E85D26", "#282826", "#1A1A18", "#E85D26"], // 3 locked post-roll wall
          ];
          function themeColor(t, slot) {
            var pal = THEMES[((t % THEMES.length) + THEMES.length) % THEMES.length];
            return pal[slot % pal.length];
          }
          function inkFor(bg) {
            return bg === ORANGE ? INK : CREAM;
          }
          function yrFor(bg) {
            return bg === ORANGE ? "#111111" : CREAM;
          }

          function packMosaic(n, W, H) {
            var rects = [{ x: 0, y: 0, w: W, h: H }];
            while (rects.length < n) {
              var bi = 0;
              for (var i = 1; i < rects.length; i++) {
                if (rects[i].w * rects[i].h > rects[bi].w * rects[bi].h) bi = i;
              }
              var r = rects.splice(bi, 1)[0];
              var ratio = 0.4 + ((rects.length * 37) % 21) / 100;
              if (r.w >= r.h) {
                var w1 = Math.round(r.w * ratio);
                rects.push({ x: r.x, y: r.y, w: w1, h: r.h });
                rects.push({ x: r.x + w1, y: r.y, w: r.w - w1, h: r.h });
              } else {
                var h1 = Math.round(r.h * ratio);
                rects.push({ x: r.x, y: r.y, w: r.w, h: h1 });
                rects.push({ x: r.x, y: r.y + h1, w: r.w, h: r.h - h1 });
              }
            }
            return rects;
          }
          var rects = packMosaic(N, innerW, innerH);

          var tiles = [],
            ghostEls = [],
            tileEls = [];
          for (var idx = 0; idx < N; idx++) {
            var R = rects[idx];
            var ghost = document.createElement("div");
            ghost.className = "g1-ghost";
            ghost.id = "g1g" + idx;
            ghost.style.left = MARGIN + R.x + GAP / 2 + "px";
            ghost.style.top = MARGIN + R.y + GAP / 2 + "px";
            ghost.style.width = Math.max(1, R.w - GAP) + "px";
            ghost.style.height = Math.max(1, R.h - GAP) + "px";
            wall.appendChild(ghost);
            ghostEls.push(ghost);

            var el = document.createElement("div");
            el.className = "g1-tile";
            el.id = "g1t" + idx;
            el.style.left = MARGIN + R.x + GAP / 2 + "px";
            el.style.top = MARGIN + R.y + GAP / 2 + "px";
            el.style.width = Math.max(1, R.w - GAP) + "px";
            el.style.height = Math.max(1, R.h - GAP) + "px";
            el.style.backgroundColor = themeColor(0, idx);

            var parts = LABELS[idx % LABELS.length].split(" ");
            var yr = document.createElement("span");
            yr.className = "g1-yr";
            yr.textContent = parts[0];
            yr.style.color = yrFor(themeColor(0, idx));
            yr.style.fontSize = Math.round(Math.min(R.w, R.h) * 0.075) + "px";
            var ev = document.createElement("span");
            ev.className = "g1-ev";
            ev.textContent = parts.slice(1).join(" ");
            ev.style.color = inkFor(themeColor(0, idx));
            ev.style.fontSize = Math.round(Math.min(R.w, R.h) * 0.15) + "px";
            el.appendChild(yr);
            el.appendChild(ev);
            wall.appendChild(el);

            tiles.push({
              el: el,
              yr: yr,
              ev: ev,
              idx: idx,
              cx: R.x + R.w / 2,
              cy: R.y + R.h / 2,
            });
            tileEls.push(el);
          }

          // waterfall enter order (top-right → bottom-left) + snake band order
          var enterOrder = tiles
            .map(function (t) {
              return t.idx;
            })
            .sort(function (a, b) {
              return tiles[b].cx - tiles[b].cy - (tiles[a].cx - tiles[a].cy);
            });
          var bandH = innerH / BANDS;
          var snakeOrder = tiles
            .map(function (t) {
              return t.idx;
            })
            .sort(function (a, b) {
              var ba = Math.min(BANDS - 1, Math.floor(tiles[a].cy / bandH));
              var bb = Math.min(BANDS - 1, Math.floor(tiles[b].cy / bandH));
              if (ba !== bb) return ba - bb;
              return (ba % 2 === 0 ? 1 : -1) * (tiles[a].cx - tiles[b].cx);
            });

          function jitter(i) {
            return { x: (((i * 37) % 7) - 3) * 16, y: (((i * 53) % 7) - 3) * 16 };
          }
          function setTheme(t, i, themeIdx) {
            var col = themeColor(themeIdx, i);
            tl.set(tiles[i].el, { backgroundColor: col }, t);
            tl.set(tiles[i].ev, { color: inkFor(col) }, t);
            tl.set(tiles[i].yr, { color: yrFor(col) }, t);
          }

          // initial state: tiles hidden, ghost grid + chrome carry t=0
          gsap.set(tileEls, { autoAlpha: 0 });
          tl.set(tileEls, { autoAlpha: 0 }, 0);
          gsap.set(ghostEls, { opacity: 0.55 });
          tl.set(ghostEls, { opacity: 0.55 }, 0);
          tl.set("#g1", { autoAlpha: 1 }, 0);

          // ── accumulate: 6 kicks, first half of the waterfall, one tile per kick
          var ACC = [0.717, 0.997, 1.997, 2.297, 2.557, 2.807];
          var POP = {
            duration: 0.12,
            ease: "back.out(1.7)",
            overwrite: "auto",
            immediateRender: false,
          };
          enterOrder.slice(0, 6).forEach(function (i, k) {
            var d = jitter(i);
            tl.fromTo(
              tiles[i].el,
              { autoAlpha: 0, scale: 0.78, x: d.x, y: d.y },
              Object.assign({ autoAlpha: 1, scale: 1, x: 0, y: 0 }, POP),
              ACC[k],
            );
          });

          // ── locked global recolor across the kick roll 12.399–12.910
          //    (local 1.486 / 1.626 / 1.788 / 1.997 — flicker A/B then lock to fire)
          var ROLL = [
            [1.486, 1],
            [1.626, 2],
            [1.788, 1],
            [1.997, 3],
          ];
          ROLL.forEach(function (r) {
            tiles.forEach(function (_, i) {
              setTheme(r[0], i, r[1]);
            });
            tl.fromTo(
              "#g1_wall",
              { scale: 1.012 },
              { scale: 1, duration: 0.12, ease: "power1.out", overwrite: "auto" },
              r[0],
            );
          });
          tl.set(ghostEls, { borderColor: ORANGE }, 1.486);
          tl.set(ghostEls, { borderColor: "#282826" }, 1.997);

          // ── snake-fill: remaining 6 tiles across 6 beats, then two accents
          var SNAKE = [3.157, 3.437, 4.067, 4.277, 4.987, 5.337, 5.507, 6.227];
          var accSet = {};
          enterOrder.slice(0, 6).forEach(function (i) {
            accSet[i] = true;
          });
          var snakeRest = snakeOrder.filter(function (i) {
            return !accSet[i];
          });
          snakeRest.forEach(function (i, k) {
            tl.fromTo(
              tiles[i].el,
              { autoAlpha: 0, scale: 0.85, x: 0, y: 0 },
              {
                autoAlpha: 1,
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.1,
                ease: "back.out(1.6)",
                overwrite: "auto",
                immediateRender: false,
              },
              SNAKE[k],
            );
          });
          // beat 7 (5.507): "2025 agents" tiles go full fire
          [5, 11].forEach(function (i) {
            tl.set(tiles[i].el, { backgroundColor: ORANGE }, SNAKE[6]);
            tl.set(tiles[i].ev, { color: INK }, SNAKE[6]);
            tl.set(tiles[i].yr, { color: "#111111" }, SNAKE[6]);
          });
          tl.fromTo(
            ["#g1t5", "#g1t11"],
            { scale: 1.07 },
            { scale: 1, duration: 0.18, ease: "back.out(2.2)", overwrite: "auto", immediateRender: false },
            SNAKE[6],
          );
          // beat 8 (6.227): full-wall punch + seam flash, wall complete → hold to cut
          tl.to("#g1_wall", { scale: 1.02, duration: 0.06, ease: "power2.out", overwrite: "auto" }, SNAKE[7]);
          tl.to("#g1_wall", { scale: 1, duration: 0.12, ease: "power2.inOut", overwrite: "auto" }, SNAKE[7] + 0.06);
          tl.set(ghostEls, { borderColor: ORANGE }, SNAKE[7]);
          tl.set(ghostEls, { borderColor: "#282826" }, SNAKE[7] + 0.12);

          // g1 → g2 cut (0ms)
          tl.set("#g1", { autoAlpha: 0 }, 6.316);

          // ══════════════════════════════════════════════════════════════
          //  g2 · CARD FLYBY — fork of the template, flat Broadside deck.
          //  6 cards land on kicks (local), final "agent 时代" lands at 11.517
          //  and holds; accel-roll 10.890–11.703 shakes the scene into the cut.
          // ══════════════════════════════════════════════════════════════
          gsap.set("#g2", { autoAlpha: 0 });
          tl.set("#g2", { autoAlpha: 0 }, 0);
          tl.set("#g2", { autoAlpha: 1 }, 6.316);

          var scene = document.getElementById("g2_scene");
          var CARDS = [
            { title: "chatgpt" },
            { title: "gpt-4" },
            { title: "claude" },
            { title: "kimi" },
            { title: "sora" },
            { title: "agent 时代" },
          ];
          var CN = CARDS.length;
          var CARD_COLORS = ["#1A1A18", "#282826", "#1A1A18", "#282826", "#1A1A18", ORANGE];
          for (var ci = 0; ci < CN; ci++) {
            var card = document.createElement("div");
            card.className = "g2-card";
            card.id = "g2c" + ci;
            card.setAttribute("data-layout-allow-overlap", "");
            var col = CARD_COLORS[ci % CARD_COLORS.length];
            card.style.setProperty("--color", col);
            card.style.setProperty("--ink", col === ORANGE ? INK : CREAM);
            var wire = document.createElement("div");
            wire.className = "g2-wire";
            wire.setAttribute("data-layout-allow-overlap", "");
            var wlabel = document.createElement("div");
            wlabel.className = "g2-wire-label";
            wlabel.setAttribute("data-layout-allow-overlap", "");
            wlabel.textContent = String(ci + 1).padStart(3, "0") + " / 006";
            wire.appendChild(wlabel);
            var wcorner = document.createElement("div");
            wcorner.className = "g2-wire-corner";
            wire.appendChild(wcorner);
            var wbar = document.createElement("div");
            wbar.className = "g2-wire-bar";
            wire.appendChild(wbar);
            card.appendChild(wire);
            var solid = document.createElement("div");
            solid.className = "g2-solid";
            solid.setAttribute("data-layout-allow-overlap", "");
            var title = document.createElement("div");
            title.className = "g2-title";
            title.setAttribute("data-layout-allow-overlap", "");
            title.textContent = CARDS[ci].title;
            solid.appendChild(title);
            card.appendChild(solid);
            scene.appendChild(card);
          }

          // scene yaw −18 (gsap owns the transform so roll punches compose)
          gsap.set("#g2_scene", { rotationY: -18 });
          tl.set("#g2_scene", { rotationY: -18 }, 0);

          var LANDED = [6.667, 7.687, 8.477, 9.357, 10.027, 11.517];
          function transDur(i) {
            var gap = i === 0 ? (CN > 1 ? LANDED[1] - LANDED[0] : 0.4) : LANDED[i] - LANDED[i - 1];
            return Math.max(0.12, Math.min(0.42, gap * 0.32));
          }

          var SLOT = {
            far: { x: 360, y: 380, z: -1080, rotX: 84, scale: 0.74, opacity: 0, zi: 60 },
            s3: { x: 280, y: 290, z: -820, rotX: 66, scale: 0.8, opacity: 0.32, zi: 70 },
            s2: { x: 195, y: 200, z: -560, rotX: 46, scale: 0.86, opacity: 0.58, zi: 80 },
            s1: { x: 105, y: 105, z: -290, rotX: 22, scale: 0.93, opacity: 0.85, zi: 90 },
            s0: { x: 0, y: 0, z: 0, rotX: 0, scale: 1.0, opacity: 1.0, zi: 100 },
            exit: { x: -90, y: 620, z: 420, rotX: -88, scale: 1.1, opacity: 0, zi: 110 },
          };
          function poseForRel(rel) {
            if (rel <= -1) return SLOT.exit;
            if (rel === 0) return SLOT.s0;
            if (rel === 1) return SLOT.s1;
            if (rel === 2) return SLOT.s2;
            if (rel === 3) return SLOT.s3;
            return SLOT.far;
          }
          function poseTween(i, slot, t, dur, ease) {
            tl.set("#g2c" + i, { zIndex: slot.zi }, t);
            tl.to(
              "#g2c" + i,
              {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                rotationX: slot.rotX,
                scale: slot.scale,
                opacity: slot.opacity,
                force3D: true,
                duration: dur,
                ease: ease || "power2.inOut",
              },
              t,
            );
          }

          // staged stack at t=0 (visible the instant g2 cuts in)
          for (var j = 0; j < CN; j++) {
            var s = poseForRel(j + 1);
            var props = {
              x: s.x,
              y: s.y,
              z: s.z,
              rotationX: s.rotX,
              scale: s.scale,
              opacity: s.opacity,
              zIndex: s.zi,
              force3D: true,
              "--wipe": 0,
            };
            gsap.set("#g2c" + j, props);
            tl.set("#g2c" + j, props, 0);
          }

          // one landing per kick: front exits, card rolls into s0 + wipes its face
          for (var L = 0; L < CN; L++) {
            var dur = transDur(L);
            var t = Math.max(0, LANDED[L] - dur);
            for (var k = L - 1; k <= L + 4; k++) {
              if (k < 0 || k >= CN) continue;
              var rel = k - L;
              var ease = rel === 0 ? "power3.out" : rel < 0 ? "power2.in" : "power2.inOut";
              poseTween(k, poseForRel(rel), t, dur, ease);
            }
            tl.to(
              "#g2c" + L,
              { "--wipe": 1, duration: dur * 0.85, ease: "power2.inOut" },
              t + dur * 0.15,
            );
          }

          // accel roll 21.803–22.616 → scene punches + edge strobes, 5 hits…
          var AHITS = [10.89, 11.053, 11.192, 11.308, 11.517];
          AHITS.forEach(function (t) {
            tl.to("#g2_scene", { scale: 1.03, duration: 0.07, ease: "power2.out", overwrite: "auto" }, t);
            tl.to("#g2_scene", { scale: 1, duration: 0.09, ease: "power2.inOut", overwrite: "auto" }, t + 0.07);
            tl.fromTo(
              "#g2_edge",
              { opacity: 0.75 },
              { opacity: 0, duration: 0.14, ease: "power1.out", overwrite: "auto" },
              t,
            );
          });
          // …6th hit (22.616 snare): push into the DROP cut, edge holds hot to 11.749
          tl.to("#g2_scene", { scale: 1.04, duration: 0.046, ease: "power2.out", overwrite: "auto" }, 11.703);
          tl.fromTo("#g2_edge", { opacity: 0.9 }, { opacity: 0.25, duration: 0.046, ease: "power1.out" }, 11.703);

          tl.seek(0);
          window.__timelines["03-f3-montage"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
```

### 13/20 · `ai-beat-sync/compositions/frames/04-f4-drop.html`
<!-- casebook-file {"path": "ai-beat-sync/compositions/frames/04-f4-drop.html", "lines": 920, "final_newline": true, "sha256": "07804894f19ab02805fe2df094a20eac817abc6008c8d5ad2518f94e95257941", "original_sha256": "07804894f19ab02805fe2df094a20eac817abc6008c8d5ad2518f94e95257941"} -->
```html
<!doctype html>
<html lang="zh">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>04-f4-drop</title>
  </head>
  <body>
    <template>
      <style>
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-400.ttf") format("truetype"); font-weight: 400; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "Microsoft YaHei"; src: local("Microsoft YaHei"); font-weight: 400 900; font-display: block; }

        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        #stage {
          position: relative;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          background: #111111;
          font-family: "Barlow", "Noto Sans SC", "Microsoft YaHei", sans-serif;
        }

        /* ── shared chrome (mono, uppercase, 0.14em) ── */
        .fx_kicker,
        .fx_meta {
          position: absolute;
          top: 26px;
          z-index: 40;
          font-family: "IBM Plex Mono", "JetBrains Mono", Consolas, monospace;
          font-size: 20px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
          white-space: nowrap;
        }
        .fx_kicker {
          left: 106px;
        }
        .fx_meta {
          right: 106px;
          text-align: right;
        }
        .fx_bar {
          position: absolute;
          left: 106px;
          right: 106px;
          height: 1px;
          background: #282826;
          z-index: 40;
        }
        .fx_bar_t {
          top: 64px;
        }
        .fx_bar_b {
          bottom: 64px;
        }
        .fx_rule {
          position: absolute;
          top: 80px;
          left: 106px;
          width: 36px;
          height: 2px;
          background: #e85d26;
          z-index: 40;
        }

        /* ── G1 · held-text-strobe-burst fork (爆发) ── */
        #g1 {
          position: absolute;
          inset: 0;
        }
        #g1_inner {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .g1_plate {
          position: absolute;
          inset: 0;
          background: #111111;
        }
        .g1_look {
          position: absolute;
          inset: 0;
          opacity: 0;
          overflow: hidden;
        }
        .g1_scan {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(240, 236, 229, 0) 0px,
            rgba(240, 236, 229, 0) 3px,
            rgba(240, 236, 229, 0.07) 3px,
            rgba(240, 236, 229, 0.07) 4px
          );
        }
        .g1_wwrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }
        .g1_word {
          font-weight: 900;
          font-size: 423px;
          line-height: 1.05;
          letter-spacing: -0.04em;
          white-space: nowrap;
          text-align: center;
        }

        /* ── G2 · terminal code storm (free design) ── */
        #g2 {
          position: absolute;
          inset: 0;
          background: #111111;
        }
        #g2_inner {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        #g2_rain {
          position: absolute;
          inset: 0;
        }
        .g2_col {
          position: absolute;
          top: 0;
          height: 1080px;
          overflow: hidden;
        }
        .g2_strip {
          font-family: "IBM Plex Mono", "JetBrains Mono", Consolas, monospace;
          font-size: 19px;
          line-height: 30px;
          white-space: pre;
          will-change: transform;
        }
        #g2_cards {
          position: absolute;
          left: 50%;
          bottom: 96px;
          transform: translateX(-50%);
          display: flex;
          gap: 56px;
          z-index: 20;
        }
        .g2_card {
          position: relative;
          width: 500px;
          background: #1a1a18;
          border-top: 1px solid #282826;
          padding: 24px 28px 26px;
          will-change: transform, opacity;
        }
        .g2_numwrap {
          position: relative;
        }
        .g2_num,
        .g2_ghost {
          font-weight: 900;
          font-size: 110px;
          line-height: 1;
          letter-spacing: -0.04em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .g2_num {
          color: #e85d26;
        }
        .g2_ghost {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .g2_gh_a {
          color: #f0ece5;
        }
        .g2_gh_b {
          color: #888880;
        }
        .g2_label {
          margin-top: 16px;
          font-size: 30px;
          font-weight: 400;
          color: #f0ece5;
        }
        .g2_note {
          margin-top: 10px;
          font-family: "IBM Plex Mono", "JetBrains Mono", Consolas, monospace;
          font-size: 19px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
        }

        /* ── G3 · split-anchor word-slot fork ── */
        #g3 {
          position: absolute;
          inset: 0;
          background: #111111;
        }
        #g3_frame {
          position: absolute;
          left: 50%;
          top: 44%;
          transform: translate(-50%, -50%);
        }
        #g3_lockup {
          position: relative;
          display: flex;
          align-items: flex-start;
          will-change: transform;
        }
        #g3_anchors {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .g3_anchor {
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.045em;
          white-space: nowrap;
          color: #f0ece5;
          will-change: transform, opacity;
        }
        .g3_t {
          display: inline-block;
        }
        .g3_anchor .g3_t {
          transform: scaleX(1.12);
          transform-origin: left center;
        }
        #g3_slotbox {
          position: relative;
          margin-left: 0.18em;
          will-change: transform, opacity;
          transform-origin: 50% 42%;
          backface-visibility: hidden;
        }
        .g3_card {
          position: absolute;
          inset: 0;
          background: transparent;
          will-change: transform;
        }
        #g3_card1 {
          z-index: -1;
        }
        #g3_card2 {
          z-index: -2;
          transform: translate(22px, 17px) rotate(-2.8deg);
        }
        #g3_card3 {
          z-index: -3;
          transform: translate(-15px, 10px) rotate(2.1deg);
        }
        .g3_lines {
          position: relative;
          z-index: 1;
          display: grid;
        }
        .g3_sgroup {
          grid-area: 1 / 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
        }
        .g3_sline {
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.045em;
          white-space: nowrap;
          text-align: left;
          background: #e85d26;
          color: #111111;
          padding: 0.04em 0.22em 0.1em 0.16em;
          transform-origin: 0% 50%;
          will-change: transform, opacity;
        }
      </style>

      <div
        id="stage"
        data-composition-id="04-f4-drop"
        data-width="1920"
        data-height="1080"
        data-duration="14.304"
        data-root="true"
      >
        <!-- ═══ G1 · held-text-strobe-burst · local 0 – 3.437 ═══ -->
        <div id="g1">
          <div id="g1_inner" data-layout-allow-overflow data-layout-allow-overlap data-layout-allow-occlusion>
            <div class="g1_plate"></div>
            <div class="g1_wwrap" id="g1_basewrap">
              <div class="g1_word" id="g1_baseword" data-layout-allow-overlap data-layout-allow-occlusion>爆发</div>
            </div>
            <!-- .g1_look layers injected by JS -->
          </div>
          <div class="fx_kicker">drop // section 04</div>
          <div class="fx_meta">drop // 0.94</div>
          <div class="fx_bar fx_bar_t"></div>
          <div class="fx_bar fx_bar_b"></div>
          <div class="fx_rule"></div>
        </div>

        <!-- ═══ G2 · terminal code storm · local 3.437 – 8.336 ═══ -->
        <div id="g2">
          <div id="g2_inner" data-layout-allow-overflow>
            <div id="g2_rain" data-layout-allow-overflow></div>
            <div id="g2_cards">
              <div class="g2_card" id="g2_card1">
                <div class="g2_numwrap">
                  <div class="g2_num"><span id="g2_numv1">0</span>b</div>
                  <div class="g2_ghost g2_gh_a" id="g2_gh1a">175b</div>
                  <div class="g2_ghost g2_gh_b" id="g2_gh1b">175b</div>
                </div>
                <div class="g2_label">parameters</div>
                <div class="g2_note">gpt-3</div>
              </div>
              <div class="g2_card" id="g2_card2">
                <div class="g2_numwrap">
                  <div class="g2_num"><span id="g2_numv2">0</span>m</div>
                  <div class="g2_ghost g2_gh_a" id="g2_gh2a">100m</div>
                  <div class="g2_ghost g2_gh_b" id="g2_gh2b">100m</div>
                </div>
                <div class="g2_label">users · 2 months</div>
                <div class="g2_note">chatgpt</div>
              </div>
              <div class="g2_card" id="g2_card3">
                <div class="g2_numwrap">
                  <div class="g2_num"><span id="g2_numv3">0</span></div>
                  <div class="g2_ghost g2_gh_a" id="g2_gh3a">1</div>
                  <div class="g2_ghost g2_gh_b" id="g2_gh3b">1</div>
                </div>
                <div class="g2_label">prompt → anything</div>
                <div class="g2_note">agents</div>
              </div>
            </div>
          </div>
          <div class="fx_kicker">~/ai --datastorm</div>
          <div class="fx_meta">152 bpm // sec.04</div>
          <div class="fx_bar fx_bar_t"></div>
          <div class="fx_bar fx_bar_b"></div>
          <div class="fx_rule"></div>
        </div>

        <!-- ═══ G3 · split-anchor word-slot · local 8.336 – 14.304 ═══ -->
        <div id="g3">
          <div id="g3_frame">
            <div id="g3_lockup" data-layout-allow-overflow>
              <div id="g3_anchors"></div>
              <div id="g3_slotbox" data-layout-allow-overflow>
                <div class="g3_card" id="g3_card1"></div>
                <div class="g3_card" id="g3_card2"></div>
                <div class="g3_card" id="g3_card3"></div>
                <div class="g3_lines" id="g3_lines"></div>
              </div>
            </div>
          </div>
          <div class="fx_kicker">agents // slot</div>
          <div class="fx_meta">sec.04 // 152 bpm</div>
          <div class="fx_bar fx_bar_t"></div>
          <div class="fx_bar fx_bar_b"></div>
          <div class="fx_rule"></div>
        </div>
      </div>

      <script>
        (function () {
          window.__timelines = window.__timelines || {};
          if (window.__timelines["04-f4-drop"]) return; // idempotent under template re-mount
          var tl = gsap.timeline({ paused: true });
          var DUR = 14.304; // frame span 22.662 – 36.966

          function el(id) {
            return document.getElementById(id);
          }
          function mulberry32(a) {
            return function () {
              a |= 0;
              a = (a + 0x6d2b79f5) | 0;
              var t = Math.imul(a ^ (a >>> 15), 1 | a);
              t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
              return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
          }
          // deterministic per-hit shake — no Math.random at runtime
          function shakeFx(target, t, amp, steps) {
            for (var k = 0; k < steps; k++) {
              var a = amp * (1 - k / steps);
              tl.to(
                target,
                {
                  x: (k % 2 ? -a : a) * 0.9,
                  y: (k % 3 ? a * 0.6 : -a * 0.5),
                  duration: 0.03,
                  ease: "steps(1)",
                  overwrite: "auto",
                },
                t + k * 0.03,
              );
            }
            tl.to(
              target,
              { x: 0, y: 0, duration: 0.08, ease: "power2.out", overwrite: "auto" },
              t + steps * 0.03,
            );
          }

          /* ════════════════ G1 · held-text-strobe-burst fork ════════════════
             爆发 held on #111 (idle ink #E85D26); strobe bursts on
             [0.278, 0.718, 0.998(DROP), 1.368, 1.648, 1.808] + roll ride
             2.926–3.437. Looks are flat brand inversions (no texture PNGs). */
          var g1inner = el("g1_inner");
          var G1_LOOKS = [
            { bg: "#E85D26", ink: "#111111", x: 0, scan: false, outline: false }, // 0 full invert (DROP)
            { bg: "#F0ECE5", ink: "#111111", x: -14, scan: false, outline: false }, // 1 cream flash
            { bg: "#111111", ink: "#F0ECE5", x: 10, scan: false, outline: false }, // 2 cream word
            { bg: "#111111", ink: "#E85D26", x: -26, scan: true, outline: false }, // 3 glitch scan
            { bg: "#111111", ink: "transparent", x: 20, scan: false, outline: true }, // 4 hairline ghost
          ];
          var lookEls = G1_LOOKS.map(function (L) {
            var look = document.createElement("div");
            look.className = "g1_look";
            look.style.background = L.bg;
            var wrap = document.createElement("div");
            wrap.className = "g1_wwrap";
            wrap.style.transform = "translateX(" + L.x + "px)";
            var w = document.createElement("div");
            w.className = "g1_word";
            w.textContent = "爆发";
            if (L.outline) {
              w.style.color = "transparent";
              w.style.webkitTextStroke = "2px #E85D26";
            } else {
              w.style.color = L.ink;
            }
            wrap.appendChild(w);
            look.appendChild(wrap);
            if (L.scan) {
              var s = document.createElement("div");
              s.className = "g1_scan";
              look.appendChild(s);
            }
            g1inner.appendChild(look);
            return look;
          });
          el("g1_baseword").style.color = "#E85D26";

          var curLook = -1;
          function showLook(idx, t) {
            if (curLook >= 0) tl.set(lookEls[curLook], { opacity: 0 }, t);
            if (idx >= 0) tl.set(lookEls[idx], { opacity: 1 }, t);
            // light looks (0 orange / 1 cream) need dark chrome; dark looks keep muted chrome
            var chrome = idx === 0 || idx === 1 ? "#111111" : "#888880";
            tl.set(["#g1 .fx_kicker", "#g1 .fx_meta"], { color: chrome }, t);
            curLook = idx;
          }

          // burst 1 — 22.94 kick
          showLook(3, 0.278);
          showLook(2, 0.358);
          showLook(-1, 0.438);
          shakeFx("#g1_inner", 0.278, 16, 4);
          // burst 2 — 23.38 kick
          showLook(1, 0.718);
          showLook(4, 0.788);
          showLook(-1, 0.868);
          shakeFx("#g1_inner", 0.718, 16, 4);
          // THE DROP — 23.66/23.676, biggest hit: full invert, held
          showLook(0, 0.998);
          shakeFx("#g1_inner", 0.998, 30, 10);
          showLook(1, 1.208);
          showLook(-1, 1.278);
          // burst 4 — 24.03 kick
          showLook(2, 1.368);
          showLook(3, 1.438);
          showLook(-1, 1.518);
          shakeFx("#g1_inner", 1.368, 16, 4);
          // burst 5 — 24.31 kick
          showLook(4, 1.648);
          showLook(1, 1.718);
          showLook(-1, 1.788);
          shakeFx("#g1_inner", 1.648, 14, 4);
          // burst 6 — 24.47 kick
          showLook(3, 1.808);
          showLook(2, 1.868);
          showLook(-1, 1.938);
          shakeFx("#g1_inner", 1.808, 14, 4);
          // idle breathe across the quiet bar
          tl.fromTo(
            "#g1_basewrap",
            { scale: 1 },
            {
              scale: 1.02,
              duration: 0.49,
              ease: "sine.inOut",
              yoyo: true,
              repeat: 1,
              immediateRender: false,
            },
            2.02,
          );
          // roll ride 25.588–26.099 — flips locked to roll hits, ends inverted into the cut
          showLook(1, 2.926);
          showLook(3, 3.042);
          showLook(2, 3.158);
          showLook(4, 3.266);
          showLook(0, 3.351);
          [2.926, 3.042, 3.158, 3.266, 3.351].forEach(function (t) {
            shakeFx("#g1_inner", t, 10, 3);
          });

          /* ════════════════ G2 · terminal code storm ════════════════
             binary-decrypt rain (accumulate) + three counting-punch stat cards
             slamming on kicks; chromatic-split ghosts + screen-shake.
             anchors: 3.438 / 4.178 / 4.998 / 5.368 / 6.898 / 7.288 / 7.568 / 8.078 */
          var G2_LEN = 8.336 - 3.437;
          var NCOL = 26,
            ROWS = 74;
          var rain = el("g2_rain");
          var cols = [],
            strips = [],
            OP = [];

          function rainString(seed, len) {
            var r = mulberry32(seed),
              s = "";
            for (var i = 0; i < len; i++) {
              var v = r();
              if (v < 0.86) s += r() < 0.5 ? "0" : "1";
              else s += "▓▒░".charAt(Math.floor(r() * 3));
              if (i < len - 1) s += "\n";
            }
            return s;
          }

          for (var ci = 0; ci < NCOL; ci++) {
            var accentCol = ci % 6 === 3;
            var col = document.createElement("div");
            col.className = "g2_col";
            col.style.left = ci * 74 - 4 + "px";
            col.style.width = "74px";
            var strip = document.createElement("div");
            strip.className = "g2_strip";
            strip.style.color = accentCol ? "#E85D26" : "#505048";
            strip.textContent = rainString(1000 + ci * 77, ROWS);
            col.appendChild(strip);
            rain.appendChild(col);
            cols.push(col);
            strips.push(strip);
            OP.push(
              accentCol ? 0.5 + ((ci * 13) % 20) / 100 : 0.28 + ((ci * 37) % 38) / 100,
            );
          }
          gsap.set(cols, { autoAlpha: 0 });
          // continuous drift (deterministic per column), running the whole group span
          strips.forEach(function (strip, i) {
            var startY = -((i * 137) % 500);
            var endY = Math.max(-(ROWS * 30 - 1080), startY - (380 + (i % 5) * 95));
            gsap.set(strip, { y: startY });
            tl.fromTo(
              strip,
              { y: startY },
              { y: endY, duration: G2_LEN, ease: "none", immediateRender: false },
              3.437,
            );
          });

          // 26.10 — rain ignition + entry shake
          tl.fromTo(
            cols,
            { autoAlpha: 0 },
            {
              autoAlpha: function (i) {
                return OP[i];
              },
              duration: 0.32,
              ease: "expo.out",
              stagger: 0.018,
              immediateRender: false,
            },
            3.438,
          );
          shakeFx("#g2_inner", 3.438, 24, 6);

          // decrypt flicker — a rotating third of the columns reshuffles per hit
          var FLICK = [4.178, 4.998, 5.368, 7.288, 7.568];
          FLICK.forEach(function (t, h) {
            for (var i = 0; i < NCOL; i++) {
              if ((i + h) % 3 !== 0) continue;
              tl.set(strips[i], { textContent: rainString(5000 + i * 131 + h * 991, ROWS) }, t);
              tl.fromTo(
                cols[i],
                { opacity: Math.min(1, OP[i] + 0.55) },
                {
                  opacity: OP[i],
                  duration: 0.4,
                  ease: "power2.out",
                  overwrite: "auto",
                  immediateRender: false,
                },
                t,
              );
            }
          });

          // counting-punch stat cards
          gsap.set(["#g2_card1", "#g2_card2", "#g2_card3"], { autoAlpha: 0 });
          var ghosts = [
            ["#g2_gh1a", "#g2_gh1b"],
            ["#g2_gh2a", "#g2_gh2b"],
            ["#g2_gh3a", "#g2_gh3b"],
          ];
          gsap.set(".g2_ghost", { opacity: 0 });

          function ghostFlash(pair, t) {
            pair.forEach(function (sel, gi) {
              tl.set(sel, { opacity: 0.8, x: gi % 2 ? 14 : -16, y: gi % 2 ? -3 : 3 }, t);
              tl.set(sel, { opacity: 0, x: 0, y: 0 }, t + 0.06);
            });
          }
          function slam(cardSel, t, pair) {
            tl.fromTo(
              cardSel,
              { autoAlpha: 0, scale: 1.22, y: 24 },
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                duration: 0.16,
                ease: "power4.out",
                overwrite: "auto",
                immediateRender: false,
              },
              t,
            );
            ghostFlash(pair, t);
            shakeFx("#g2_inner", t, 20, 5);
          }
          slam("#g2_card1", 4.178, ghosts[0]);
          slam("#g2_card2", 4.998, ghosts[1]);
          slam("#g2_card3", 5.368, ghosts[2]);

          // number counts — keyframed textContent sets (seek-safe; onUpdate
          // callbacks do NOT fire reliably on paused-timeline seeks)
          function countPunch(spanId, t, target, dur) {
            var span = el(spanId);
            var steps = Math.ceil(dur * 30);
            for (var k = 1; k <= steps; k++) {
              var p = k / steps;
              var e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); // expo.out
              tl.set(span, { textContent: String(Math.floor(target * e)) }, t + p * dur);
            }
          }
          countPunch("g2_numv1", 4.178, 175, 0.6);
          countPunch("g2_numv2", 4.998, 100, 0.6);
          countPunch("g2_numv3", 5.368, 1, 0.3);

          // 29.56 — full reshuffle + orange surge
          for (var fi = 0; fi < NCOL; fi++) {
            tl.set(strips[fi], { textContent: rainString(9000 + fi * 131, ROWS) }, 6.898);
          }
          [3, 9, 15, 21].forEach(function (i) {
            tl.fromTo(
              cols[i],
              { opacity: 1 },
              { opacity: OP[i], duration: 0.5, ease: "power2.out", overwrite: "auto", immediateRender: false },
              6.898,
            );
          });
          shakeFx("#g2_inner", 6.898, 18, 5);

          // 29.95 — chromatic-split flash across all cards
          ghostFlash(ghosts[0].concat(ghosts[1], ghosts[2]), 7.288);
          shakeFx("#g2_inner", 7.288, 22, 5);

          // 30.23 — cards tick
          tl.fromTo(
            ["#g2_card1", "#g2_card2", "#g2_card3"],
            { scale: 1.05 },
            { scale: 1, duration: 0.22, ease: "back.out(2)", overwrite: "auto", immediateRender: false },
            7.568,
          );
          shakeFx("#g2_inner", 7.568, 14, 4);

          // 30.74 — pre-cut punch
          tl.fromTo(
            ["#g2_card1", "#g2_card2", "#g2_card3"],
            { scale: 1.07 },
            { scale: 1, duration: 0.2, ease: "back.out(2.4)", overwrite: "auto", immediateRender: false },
            8.078,
          );
          ghostFlash(ghosts[0].concat(ghosts[1], ghosts[2]), 8.078);
          shakeFx("#g2_inner", 8.078, 30, 6);

          /* ════════════════ G3 · split-anchor word-slot fork ════════════════
             held anchors agents / 能做什么 + orange tape slot cycling
             写代码/做设计/剪视频/做科研/开公司; jitter run 12.218–13.468;
             box-zoom exit wipe at 14.028. */
          var BASE_TILT = -3.5,
            BOX_TILT = 2.6;
          var ANCHORS = ["agents", "能做什么"];
          var SLOT_WORDS = ["写代码", "做设计", "剪视频", "做科研", "开公司", "开公司"];
          var SLOT_T = [8.588, 9.128, 9.588, 10.398, 11.538, 13.258];
          var JITTER = [12.214, 12.33, 12.702, 13.097, 13.259, 13.352, 13.468];
          var FONT_PX = 140,
            ROW_H = 138;

          var lockupEl = el("g3_lockup"),
            anchorsBox = el("g3_anchors"),
            slotbox = el("g3_slotbox"),
            linesBox = el("g3_lines");
          var g3cards = [el("g3_card1"), el("g3_card2"), el("g3_card3")];

          function mkG3Word(text) {
            var d = document.createElement("div");
            d.style.fontSize = FONT_PX + "px";
            d.style.height = ROW_H + "px";
            var sp = document.createElement("span");
            sp.className = "g3_t";
            sp.textContent = text;
            d.appendChild(sp);
            return d;
          }

          var anchorEls = ANCHORS.map(function (a) {
            var row = mkG3Word(a);
            row.className = "g3_anchor";
            anchorsBox.appendChild(row);
            row.style.width = Math.ceil(row.firstChild.getBoundingClientRect().width + 2) + "px";
            return row;
          });

          function lineRot(i) {
            return [-2.0, 1.6, -1.0, 2.2, -1.4, 1.2][i % 6];
          }
          var slotLines = SLOT_WORDS.map(function (word, si) {
            var g = document.createElement("div");
            g.className = "g3_sgroup";
            var row = mkG3Word(word);
            row.className = "g3_sline";
            row.style.marginLeft = [0, 16, 8, 24, 12, 4][si % 6] + "px";
            g.appendChild(row);
            linesBox.appendChild(g);
            return row;
          });

          gsap.set(lockupEl, { rotation: BASE_TILT });
          gsap.set(slotbox, { rotation: BOX_TILT, autoAlpha: 0, scale: 0.86 });
          gsap.set(anchorEls, { autoAlpha: 0, y: 18, scale: 0.9, scaleX: 0.9 });
          slotLines.forEach(function (row, i) {
            gsap.set(row, { autoAlpha: 0, rotation: lineRot(i) });
          });

          // lockup — anchors pop + slot box reveal at group start (8.336)
          anchorEls.forEach(function (row, i) {
            tl.fromTo(
              row,
              { autoAlpha: 0, y: 26, scale: 0.84, scaleX: 0.7 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                scaleX: 1,
                duration: 0.2,
                ease: "expo.out",
                overwrite: "auto",
                immediateRender: false,
              },
              8.336 + i * 0.116,
            );
          });
          tl.fromTo(
            slotbox,
            { autoAlpha: 0, scale: 0.6, rotation: BOX_TILT - 6 },
            {
              autoAlpha: 1,
              scale: 1,
              rotation: BOX_TILT,
              duration: 0.22,
              ease: "back.out(2.2)",
              overwrite: "auto",
              immediateRender: false,
            },
            8.56,
          );

          // slot cycles — tape whips in on each onset, previous arcs out
          slotLines.forEach(function (row, i) {
            var tIn = SLOT_T[i];
            tl.fromTo(
              row,
              { autoAlpha: 0, x: 150, scaleX: 1.7, rotation: lineRot(i) },
              {
                autoAlpha: 1,
                x: 0,
                scaleX: 1.12,
                rotation: lineRot(i),
                duration: 0.24,
                ease: "expo.out",
                overwrite: "auto",
                immediateRender: false,
              },
              tIn,
            );
            if (i < slotLines.length - 1) {
              tl.to(
                row,
                {
                  autoAlpha: 0,
                  x: -120,
                  y: 46,
                  scaleX: 1.4,
                  duration: 0.16,
                  ease: "power3.in",
                  overwrite: "auto",
                },
                SLOT_T[i + 1] - 0.07,
              );
            }
          });

          // per-beat jitter — deterministic jolts around the base tilt
          function jolt(k) {
            return { x: ((k * 37) % 11) - 5, y: ((k * 53) % 9) - 4, r: ((k * 29) % 7) - 3 };
          }
          function joltAt(t, k, amp, rot) {
            var j = jolt(k);
            tl.fromTo(
              lockupEl,
              { x: (j.x * amp) / 5, y: (j.y * amp) / 4, rotation: BASE_TILT + (j.r * rot) / 3 },
              {
                x: 0,
                y: 0,
                rotation: BASE_TILT,
                duration: 0.15,
                ease: "back.out(3)",
                overwrite: "auto",
                immediateRender: false,
              },
              t,
            );
          }
          SLOT_T.slice(0, 5).forEach(function (t, k) {
            joltAt(t, k + 1, 16, 2.2);
          });
          JITTER.forEach(function (t, k) {
            joltAt(t, k + 7, 30, 2.6);
          });

          // exit wipe — 36.69 kick: fade type, orange box zooms to swallow the frame
          tl.to(anchorEls, { autoAlpha: 0, duration: 0.16, ease: "power2.in", overwrite: "auto" }, 14.028);
          tl.to(slotLines, { autoAlpha: 0, duration: 0.14, ease: "power2.in", overwrite: "auto" }, 14.028);
          tl.to(
            "#g3 .fx_kicker, #g3 .fx_meta, #g3 .fx_bar, #g3 .fx_rule",
            { autoAlpha: 0, duration: 0.1, ease: "power2.in", overwrite: "auto" },
            14.028,
          );
          tl.set(lockupEl, { x: 0, y: 0 }, 14.028);
          tl.set(g3cards, { backgroundColor: "#E85D26" }, 14.028);
          tl.fromTo(
            slotbox,
            { scale: 1, filter: "blur(0px)" },
            {
              scale: 2.2,
              filter: "blur(4px)",
              duration: 0.132,
              ease: "power2.out",
              overwrite: "auto",
              immediateRender: false,
            },
            14.028,
          );
          tl.to(
            slotbox,
            { scale: 34, filter: "blur(12px)", duration: 0.124, ease: "power2.in", overwrite: "auto" },
            14.16,
          );

          /* ════════════════ group cuts (0ms) + registration ════════════════ */
          gsap.set("#g2", { autoAlpha: 0 });
          gsap.set("#g3", { autoAlpha: 0 });
          tl.set("#g1", { autoAlpha: 0 }, 3.437);
          tl.set("#g2", { autoAlpha: 1 }, 3.437);
          tl.set("#g2", { autoAlpha: 0 }, 8.336);
          tl.set("#g3", { autoAlpha: 1 }, 8.336);

          tl.set({}, {}, DUR);
          tl.seek(0);
          window.__timelines["04-f4-drop"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
```

### 14/20 · `ai-beat-sync/compositions/frames/05-f5-finale.html`
<!-- casebook-file {"path": "ai-beat-sync/compositions/frames/05-f5-finale.html", "lines": 555, "final_newline": true, "sha256": "6c5afdd8be0c5bc918b5ffc23911f55e97d7fb18a457b8ca9e8a30284a5f6164", "original_sha256": "6c5afdd8be0c5bc918b5ffc23911f55e97d7fb18a457b8ca9e8a30284a5f6164"} -->
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>05-f5-finale</title>
  </head>
  <body>
    <template>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;700;900&family=IBM+Plex+Mono:wght@500&family=Noto+Sans+SC:wght@700;900&display=swap"
      />
      <style>
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-400.ttf") format("truetype"); font-weight: 400; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "Microsoft YaHei"; src: local("Microsoft YaHei"); font-weight: 400 900; font-display: block; }

        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        #stage {
          position: relative;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          background: #111111;
          container-type: size;
          font-family: "Barlow", "Noto Sans SC", sans-serif;
        }

        /* ── group containers (0ms cuts driven by the timeline) ─────────── */
        #g1,
        #g2,
        #g3 {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        #g1 {
          background: #111111;
        }
        #g2,
        #g3 {
          visibility: hidden;
          opacity: 0;
        }

        /* ═══ g1 — per-onset hypercut typography ═══ */
        #g1_chrome {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
        }
        #g1_counter {
          position: absolute;
          top: 5.5cqw;
          left: 5.5cqw;
          font-family: "IBM Plex Mono", monospace;
          font-weight: 500;
          font-size: 0.72cqw;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
        }
        #g1_mark {
          position: absolute;
          top: 5.5cqw;
          right: 5.5cqw;
          font-family: "IBM Plex Mono", monospace;
          font-weight: 500;
          font-size: 0.72cqw;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
        }
        #g1_ticks {
          position: absolute;
          left: 5.5cqw;
          bottom: 5.5cqw;
          display: flex;
          gap: 10px;
        }
        .g1_tick {
          width: 34px;
          height: 6px;
          background: #282826;
        }
        #g1_shake {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }
        .g1_word {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          line-height: 0.95;
          white-space: nowrap;
          color: #f0ece5;
          opacity: 0;
          will-change: transform, filter, opacity;
        }
        .g1_word.cjk {
          font-family: "Noto Sans SC", sans-serif;
          letter-spacing: -0.02em;
        }
        .g1_word.lat {
          font-family: "Barlow", "Noto Sans SC", sans-serif;
          letter-spacing: -0.04em;
        }
        #g1_w0 { font-size: 14cqw; }
        #g1_w1 { font-size: 17cqw; }
        #g1_w2 { font-size: 17cqw; }
        #g1_w3 { font-size: 12.5cqw; }
        #g1_w4 { font-size: 15.5cqw; }
        #g1_w5 { font-size: 12.5cqw; }
        #g1_flash {
          position: absolute;
          inset: 0;
          background: #f0ece5;
          opacity: 0;
          pointer-events: none;
          z-index: 8;
        }

        /* ═══ g2 — held-text-strobe-burst fork: "all in" (orange register) ═══ */
        .g2_base,
        .g2_look {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .g2_base {
          background: #e85d26;
        }
        .g2_look {
          opacity: 0;
          background: var(--bg, #111111);
        }
        .g2_wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .g2_word {
          font-family: "Barlow", "Noto Sans SC", sans-serif;
          font-weight: 900;
          font-size: 24.5cqw;
          line-height: 1.05;
          letter-spacing: -0.03em;
          white-space: nowrap;
          text-align: center;
          color: transparent;
          background-image: var(--solid-fill), var(--texture-url);
          background-blend-mode: multiply;
          background-size: 100% 100%, 150% 150%;
          background-position: center, center;
          background-repeat: repeat;
          -webkit-background-clip: text;
          background-clip: text;
        }
        .g2_word.g2_solid {
          background-image: none;
          color: #111111;
        }

        /* ═══ g3 — crash-zoom final slam: "未来已来" ═══ */
        #g3 {
          background: #111111;
        }
        #g3_radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(232, 93, 38, 0.1) 0%,
            transparent 38%,
            rgba(0, 0, 0, 0.55) 85%
          );
          opacity: 0;
          will-change: opacity, transform;
        }
        #g3_lines {
          position: absolute;
          inset: 0;
          background: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0px,
            transparent 7px,
            rgba(240, 236, 229, 0.09) 8px,
            transparent 9px
          );
          opacity: 0;
          mix-blend-mode: screen;
          will-change: opacity, transform;
        }
        #g3_zoom {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          will-change: transform, filter, opacity;
        }
        #g3_stack {
          position: relative;
          white-space: nowrap;
          font-family: "Noto Sans SC", sans-serif;
          font-weight: 900;
          font-size: 16.7cqw;
          line-height: 1;
          letter-spacing: -0.02em;
          will-change: transform;
        }
        .g3_spacer {
          color: #f0ece5;
        }
        .g3_layer {
          position: absolute;
          top: 0;
          left: 0;
          will-change: transform;
        }
        .g3_o {
          color: #e85d26;
        }
        .g3_m {
          color: #888880;
        }
        .g3_main {
          color: #f0ece5;
        }
        #g3_flash {
          position: absolute;
          inset: 0;
          background: #f0ece5;
          opacity: 0;
          pointer-events: none;
          z-index: 8;
        }
      </style>

      <div
        id="stage"
        data-composition-id="05-f5-finale"
        data-width="1920"
        data-height="1080"
        data-duration="11.633"
        data-root="true"
      >
        <!-- g1 · hypercut typography · local [0, 6.594) -->
        <div id="g1">
          <div id="g1_shake">
            <div class="g1_word cjk" id="g1_w0">看懂的人</div>
            <div class="g1_word cjk" id="g1_w1">已经</div>
            <div class="g1_word cjk" id="g1_w2">上车</div>
            <div class="g1_word lat" id="g1_w3">builders win</div>
            <div class="g1_word cjk" id="g1_w4">信息差</div>
            <div class="g1_word cjk" id="g1_w5" data-layout-allow-overflow>就是生产力</div>
          </div>
          <div id="g1_chrome">
            <div id="g1_counter">hit 00 / 11</div>
            <div id="g1_mark">no. 05 / finale</div>
            <div id="g1_ticks">
              <div class="g1_tick" id="g1_tick0"></div>
              <div class="g1_tick" id="g1_tick1"></div>
              <div class="g1_tick" id="g1_tick2"></div>
              <div class="g1_tick" id="g1_tick3"></div>
              <div class="g1_tick" id="g1_tick4"></div>
              <div class="g1_tick" id="g1_tick5"></div>
              <div class="g1_tick" id="g1_tick6"></div>
              <div class="g1_tick" id="g1_tick7"></div>
              <div class="g1_tick" id="g1_tick8"></div>
              <div class="g1_tick" id="g1_tick9"></div>
              <div class="g1_tick" id="g1_tick10"></div>
            </div>
          </div>
          <div id="g1_flash"></div>
        </div>

        <!-- g2 · held-text-strobe-burst · local [6.594, 9.985) -->
        <div id="g2">
          <div class="g2_base">
            <div class="g2_wrap"><div class="g2_word g2_solid">all in</div></div>
          </div>
          <div class="g2_look" id="g2_look0" style="--bg: #111111">
            <div class="g2_wrap">
              <div
                class="g2_word"
                style="
                  --texture-url: url('assets/texture-mask-text/masks/onyx.png');
                  --solid-fill: linear-gradient(#e85d26, #e85d26);
                "
              >
                all in
              </div>
            </div>
          </div>
          <div class="g2_look" id="g2_look1" style="--bg: #1a1a18">
            <div class="g2_wrap">
              <div
                class="g2_word"
                style="
                  --texture-url: url('assets/texture-mask-text/masks/metal-041-a.png');
                  --solid-fill: linear-gradient(#f0ece5, #f0ece5);
                "
              >
                all in
              </div>
            </div>
          </div>
          <div class="g2_look" id="g2_look2" style="--bg: #e85d26">
            <div class="g2_wrap">
              <div
                class="g2_word"
                style="
                  --texture-url: url('assets/texture-mask-text/masks/lava.png');
                  --solid-fill: linear-gradient(#111111, #111111);
                "
              >
                all in
              </div>
            </div>
          </div>
          <div class="g2_look" id="g2_look3" style="--bg: #111111">
            <div class="g2_wrap">
              <div
                class="g2_word"
                style="
                  --texture-url: url('assets/texture-mask-text/masks/tiles-138.png');
                  --solid-fill: linear-gradient(#f0ece5, #f0ece5);
                "
              >
                all in
              </div>
            </div>
          </div>
        </div>

        <!-- g3 · crash-zoom final slam · local [9.985, 11.633] -->
        <div id="g3">
          <div id="g3_radial"></div>
          <div id="g3_lines"></div>
          <div id="g3_zoom">
            <div id="g3_stack" data-layout-allow-overlap>
              <span class="g3_spacer" data-layout-allow-overlap>未来已来</span>
              <span class="g3_layer g3_o" id="g3_lo" data-layout-allow-overlap>未来已来</span>
              <span class="g3_layer g3_m" id="g3_lm" data-layout-allow-overlap>未来已来</span>
              <span class="g3_layer g3_main" data-layout-allow-overlap>未来已来</span>
            </div>
          </div>
          <div id="g3_flash"></div>
        </div>
      </div>

      <script>
        (function () {
          var tl = gsap.timeline({ paused: true });

          var SPAN0 = 36.966; // frame start (track seconds)
          var DUR = 11.633; // 48.599 − 36.966
          var G1_END = 6.594; // 43.560 − span0 → cut g1 → g2
          var G2_END = 9.985; // 46.951 − span0 → cut g2 → g3

          function L(t) {
            return +(t - SPAN0).toFixed(4);
          }

          /* ── group cuts (0ms swaps) ──────────────────────────────────── */
          tl.set("#g1", { autoAlpha: 1 }, 0);
          tl.set("#g1", { autoAlpha: 0 }, G1_END);
          tl.set("#g2", { autoAlpha: 1 }, G1_END);
          tl.set("#g2", { autoAlpha: 0 }, G2_END);
          tl.set("#g3", { autoAlpha: 1 }, G2_END);

          /* ═══ g1 — one slammed word per kick ═══ */
          // copy order: 看懂的人 / 已经 / 上车 / builders win / 信息差 / 就是生产力
          var WORDS = ["#g1_w0", "#g1_w1", "#g1_w2", "#g1_w3", "#g1_w4", "#g1_w5"];
          // 11 anchors (block order); word index per anchor; snare = last
          var ANCHORS = [
            { t: L(37.17), w: 0, whip: true },
            { t: L(37.31), w: 1, whip: true },
            { t: L(37.45), w: 2, whip: true },
            { t: L(37.55), w: 3, whip: true },
            { t: L(38.2), w: 4 },
            { t: L(39.1), w: 5 },
            { t: L(39.75), w: 3 },
            { t: L(40.4), w: 0 },
            { t: L(40.52), w: 1 },
            { t: L(41.08), w: 5 },
            { t: L(42.86), w: 5, snare: true },
          ];
          var SHAKE_BASE = [26, -22, 18, -14, 10, -6];

          function shake(target, t, amps, step) {
            for (var i = 0; i < amps.length; i++) {
              tl.set(
                target,
                { x: amps[i], y: +(amps[i] * 0.6 * (i % 2 ? -1 : 1)).toFixed(1) },
                +(t + i * step).toFixed(4)
              );
            }
            tl.set(target, { x: 0, y: 0 }, +(t + amps.length * step).toFixed(4));
          }

          // t = 0 ground truth: word 0 already held (no blank first frame)
          tl.set(WORDS[0], { opacity: 1 }, 0);

          ANCHORS.forEach(function (a, i) {
            var word = WORDS[a.w];
            var flashColor = a.snare ? "#E85D26" : "#F0ECE5";
            // flash-cut frame — swap happens under the flash
            tl.set("#g1_flash", { opacity: 0.9, backgroundColor: flashColor }, a.t);
            tl.set("#g1_flash", { opacity: 0 }, +(a.t + 0.05).toFixed(4));
            // word swap (class-wide hide, then reveal target)
            tl.set(".g1_word", { opacity: 0 }, +(a.t + 0.02).toFixed(4));
            tl.set(word, { opacity: 1 }, +(a.t + 0.02).toFixed(4));
            // braam punch (hypercut-whip x-entry on the opening 4-kick burst)
            tl.fromTo(
              word,
              {
                scale: a.snare ? 0.7 : 0.78,
                x: a.whip ? (i % 2 ? 520 : -520) : 0,
                filter: "blur(14px)",
              },
              { scale: 1, x: 0, filter: "blur(0px)", duration: 0.16, ease: "power4.out" },
              a.t
            );
            // screen shake — amplitude grows through the sequence
            var gain = 1 + i * 0.05;
            shake(
              "#g1_shake",
              +(a.t + 0.01).toFixed(4),
              SHAKE_BASE.map(function (v) {
                return Math.round(v * gain);
              }),
              0.028
            );
            // chrome: hit counter + accumulating ticks
            tl.set(
              "#g1_counter",
              { textContent: "hit " + (i + 1 < 10 ? "0" : "") + (i + 1) + " / 11" },
              a.t
            );
            tl.set("#g1_tick" + i, { backgroundColor: "#E85D26" }, a.t);
            // palette-flip on the snare (stays in the dark register)
            if (a.snare) {
              tl.set(word, { color: "#E85D26" }, +(a.t + 0.02).toFixed(4));
              tl.set("#g1_counter", { color: "#E85D26" }, a.t);
              tl.set("#g1", { backgroundColor: "#1A1A18" }, a.t);
            }
          });
          // slow drift keeps the held word alive across the 4.114 → 5.894 gap
          tl.fromTo("#g1_w5", { scale: 1 }, { scale: 1.025, duration: 1.6, ease: "none" }, 4.28);

          /* ═══ g2 — "all in" strobe (fork of held-text-strobe-burst) ═══ */
          var LOOKS = ["#g2_look0", "#g2_look1", "#g2_look2", "#g2_look3"];
          var lookStep = 0;
          var lookPrev = null;
          function flip(t) {
            var cur = LOOKS[lookStep % LOOKS.length];
            if (lookPrev && lookPrev !== cur) tl.set(lookPrev, { opacity: 0 }, t);
            tl.set(cur, { opacity: 1 }, t);
            lookPrev = cur;
            lookStep += 1;
          }
          function off(t) {
            if (lookPrev) tl.set(lookPrev, { opacity: 0 }, t);
            lookPrev = null;
          }
          // entry punch on the downbeat cut
          tl.fromTo("#g2", { scale: 1.06 }, { scale: 1, duration: 0.24, ease: "power4.out" }, G1_END);
          // strobe ride — kick roll 44.164–44.605 (hits at .164/.257/.396/.605)
          flip(L(44.164));
          flip(L(44.257));
          flip(L(44.396));
          flip(L(44.605));
          off(L(44.605) + 0.09);
          // double-hit 45.33 / 45.56
          flip(L(45.325));
          off(L(45.325) + 0.09);
          flip(L(45.557));
          off(L(45.557) + 0.09);
          // final flicker — double roll-kick 46.60–46.95; last look holds into the g3 cut
          flip(L(46.602));
          flip(L(46.695));
          flip(L(46.858));

          /* ═══ g3 — crash-zoom final slam ═══ */
          var CRASH = G2_END; // 9.985 — word begins mid-crash right off the cut
          var LAND = L(47.276); // 10.31 — last snare of the track

          // non-empty first frame: speed-lines + vignette already converging
          tl.fromTo(
            "#g3_lines",
            { opacity: 0.35, scale: 0.3 },
            { opacity: 0.9, scale: 1.4, duration: 0.325, ease: "expo.in" },
            CRASH
          );
          tl.fromTo(
            "#g3_radial",
            { opacity: 0.25, scale: 0.5 },
            { opacity: 0.9, scale: 1.25, duration: 0.325, ease: "expo.in" },
            CRASH
          );
          // the crash — lands exactly on the 47.276 snare
          tl.fromTo("#g3_zoom", { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "power1.in", immediateRender: false }, CRASH);
          tl.fromTo(
            "#g3_zoom",
            { scale: 0.05, filter: "blur(24px)" },
            { scale: 1, filter: "blur(0px)", duration: 0.325, ease: "expo.in", immediateRender: false },
            CRASH
          );
          // landing: flash + braam settle + chromatic split + shake
          tl.set("#g3_flash", { opacity: 0.8 }, LAND);
          tl.set("#g3_flash", { opacity: 0 }, +(LAND + 0.06).toFixed(4));
          tl.to("#g3_stack", { scale: 0.955, duration: 0.09, ease: "power3.out" }, LAND);
          tl.to("#g3_stack", { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.55)" }, +(LAND + 0.09).toFixed(4));
          tl.set("#g3_lo", { x: -28, y: -6 }, LAND);
          tl.set("#g3_lm", { x: 26, y: 5 }, LAND);
          tl.to("#g3_lo", { x: 0, y: 0, duration: 0.5, ease: "power2.out" }, +(LAND + 0.05).toFixed(4));
          tl.to("#g3_lm", { x: 0, y: 0, duration: 0.5, ease: "power2.out" }, +(LAND + 0.05).toFixed(4));
          shake("#g3_zoom", LAND, [16, -13, 10, -8, 6, -4, 2], 0.03);
          // swoosh decay → static hold into the void (f6 picks up from here)
          tl.to("#g3_lines", { opacity: 0, duration: 0.45, ease: "power2.out" }, +(LAND + 0.05).toFixed(4));
          tl.to("#g3_radial", { opacity: 0.4, duration: 0.5, ease: "power2.out" }, LAND);

          window.__timelines["05-f5-finale"] = tl;
          tl.seek(0);
        })();
      </script>
    </template>
  </body>
</html>
```

### 15/20 · `ai-beat-sync/compositions/frames/06-f6-outro.html`
<!-- casebook-file {"path": "ai-beat-sync/compositions/frames/06-f6-outro.html", "lines": 200, "final_newline": true, "sha256": "be1f8ec5d70e601fd066ece0faa87ef038c84846d304e5097a1bd912aae773b9", "original_sha256": "be1f8ec5d70e601fd066ece0faa87ef038c84846d304e5097a1bd912aae773b9"} -->
```html
<!doctype html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <!-- head is metadata only; the runtime clones <template> contents -->
  </head>
  <body>
    <template>
      <style>
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-400.ttf") format("truetype"); font-weight: 400; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
        @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
        @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
        @font-face { font-family: "Microsoft YaHei"; src: local("Microsoft YaHei"); font-weight: 400 900; font-display: block; }

        #stage {
          position: absolute;
          inset: 0;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          background: #111111;
          container-type: size;
          font-family: "Barlow", "Noto Sans SC", sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        #g1 {
          position: absolute;
          inset: 0;
        }
        #g1_dim {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: filter, opacity, transform;
        }
        #g1_resolve {
          display: flex;
          flex-direction: column;
          align-items: center;
          will-change: filter, transform, opacity;
        }
        #g1_rule {
          width: 36px;
          height: 2px;
          background: #e85d26;
          transform-origin: left center;
          margin-bottom: 3.2cqh;
        }
        #g1_lockup {
          display: flex;
          align-items: baseline;
          white-space: nowrap;
          line-height: 1;
          will-change: transform;
        }
        #g1_hero_ai {
          font-family: "Barlow", "Noto Sans SC", sans-serif;
          font-weight: 900;
          font-size: 9.5cqw;
          letter-spacing: -0.04em;
          text-transform: lowercase;
          color: #f0ece5;
        }
        #g1_sep {
          font-family: "Barlow", sans-serif;
          font-weight: 900;
          font-size: 6cqw;
          color: #e85d26;
          padding: 0 2.2cqw;
          will-change: transform, opacity;
        }
        #g1_hero_cjk {
          font-family: "Noto Sans SC", sans-serif;
          font-weight: 900;
          font-size: 9.5cqw;
          letter-spacing: 0;
          color: #f0ece5;
        }
        #g1_credit {
          position: absolute;
          left: 0;
          right: 0;
          top: 89cqh;
          text-align: center;
          font-family: "IBM Plex Mono", monospace;
          font-weight: 500;
          font-size: 0.78cqw;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888880;
        }
        #g1_hairline {
          position: absolute;
          left: 5.5cqw;
          right: 5.5cqw;
          top: 50cqh;
          height: 1px;
          background: #282826;
          transform-origin: center;
          pointer-events: none;
        }
      </style>

      <div
        id="stage"
        data-composition-id="06-f6-outro"
        data-width="1920"
        data-height="1080"
        data-duration="2.694"
      >
        <div id="g1">
          <div id="g1_hairline"></div>
          <div id="g1_dim">
            <div id="g1_resolve">
              <div id="g1_rule"></div>
              <div id="g1_lockup">
                <span id="g1_hero_ai">ai</span>
                <span id="g1_sep">·</span>
                <span id="g1_hero_cjk">未来已来</span>
              </div>
            </div>
          </div>
          <div id="g1_credit">music: volatile reaction — kevin macleod (cc by 4.0)</div>
        </div>
      </div>

      <script>
        const tl = gsap.timeline({ paused: true });

        // group g1 — held lockup, spans the whole frame (local 0 … 2.694)
        tl.set("#g1", { autoAlpha: 1 }, 0);

        // blur-resolve in from the slam: heavy blur + scaled-up + dim → crisp focus
        tl.fromTo(
          "#g1_resolve",
          { filter: "blur(42px)", scale: 1.07, opacity: 0.22 },
          { filter: "blur(0px)", scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
          0,
        );

        // rule stub draws in under the resolve
        tl.fromTo(
          "#g1_rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, ease: "power2.out" },
          0.15,
        );

        // credit line fades up into the void
        tl.fromTo(
          "#g1_credit",
          { opacity: 0 },
          { opacity: 0.9, duration: 0.6, ease: "power1.out" },
          0.3,
        );

        // anchor 0.077 (track 48.676 — music cuts to silence):
        // separator punches in, hairline draws open — the void lands
        tl.fromTo(
          "#g1_sep",
          { scale: 1.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" },
          0.077,
        );
        tl.fromTo(
          "#g1_hairline",
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
          0.077,
        );

        // held lockup breathes through the VOID phase (0.55 … 2.05)
        tl.to("#g1_lockup", { scale: 1.012, duration: 0.75, ease: "sine.inOut" }, 0.55);
        tl.to("#g1_lockup", { scale: 1, duration: 0.75, ease: "sine.inOut" }, 1.3);

        // slow dim with the audio fade-out tail (silence ends local 2.077 → end 2.694)
        tl.to(
          "#g1_dim",
          { opacity: 0.38, filter: "blur(5px)", scale: 0.996, duration: 0.617, ease: "power1.inOut" },
          2.077,
        );
        tl.to("#g1_credit", { opacity: 0.3, duration: 0.617, ease: "power1.inOut" }, 2.077);
        tl.to("#g1_hairline", { opacity: 0.4, duration: 0.617, ease: "power1.inOut" }, 2.077);

        // group cut at frame end (0ms swap)
        tl.set("#g1", { autoAlpha: 0 }, 2.694);

        window.__timelines["06-f6-outro"] = tl;
        tl.seek(0);
      </script>
    </template>
  </body>
</html>
```

### 16/20 · `ai-beat-sync/frame.md`
<!-- casebook-file {"path": "ai-beat-sync/frame.md", "lines": 284, "final_newline": true, "sha256": "3af0a1e5e61bece19841671672d7732082f03d5699b713475e90323a21dbcc89", "original_sha256": "3af0a1e5e61bece19841671672d7732082f03d5699b713475e90323a21dbcc89"} -->
```markdown
---
version: alpha
name: Broadside — Frame (video / frame layer)
description: >
  Video-first companion to Broadside's design.md. The unit is the frame (1920×1080). Atoms are
  identical and sacred — the two-register surface system (dark ink-black / fire-orange), massive
  Barlow in lowercase weight 900 treated as graphic primitive, IBM Plex Mono chrome (uppercase,
  0.14em), the single fire-orange accent, the flat plane, and 1px hairline dividers. Composition +
  frame scale rewritten for the frame. Motion out of scope.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  ink-black: "#111111"
  ink-black-alt: "#1A1A18"
  fire-orange: "#E85D26"
  cream: "#F0ECE5"
  cream-muted: "#888880"
  cream-hint: "#505048"
  border-dark: "#282826"
  ink-on-orange-muted: "rgba(17,17,17,0.75)"
  ink-on-orange-hint: "rgba(17,17,17,0.55)"
  ink-on-orange-faint: "rgba(17,17,17,0.40)"
  ink-on-orange-border: "rgba(17,17,17,0.20)"

typography:
  # — reading ramp —
  body:    { fontFamily: "Barlow", cqw: 1.2, weight: 400, lineHeight: 1.6 }
  lead:    { fontFamily: "Barlow", cqw: 1.6, weight: 400, lineHeight: 1.5 }
  caption: { fontFamily: "Barlow", cqw: 0.9, weight: 400, lineHeight: 1.5 }
  label:   { fontFamily: "IBM Plex Mono", cqw: 0.72, weight: 500, tracking: "0.14em", upper: true }
  # — display / hero ramp (Barlow, lowercase, negative tracking) —
  h3:      { fontFamily: "Barlow", cqw: 2.8, weight: 600, lineHeight: 1.2, lower: true }
  quote-text:{ fontFamily: "Barlow", cqw: 3.8, weight: 700, lineHeight: 1.15, tracking: "-0.02em", lower: true }
  h2:      { fontFamily: "Barlow", cqw: 4.5, weight: 700, lineHeight: 1.1, tracking: "-0.02em", lower: true }
  stat-value:{ fontFamily: "Barlow", cqw: 5.5, weight: 900, lineHeight: 1.0, tracking: "-0.04em" }
  h1:      { fontFamily: "Barlow", cqw: 7.5, weight: 800, lineHeight: 0.9, tracking: "-0.03em", lower: true }
  fadelist-item:{ fontFamily: "Barlow", cqw: 7.5, weight: 900, lineHeight: 1.0, tracking: "-0.03em", lower: true }
  quote-mark:{ fontFamily: "Barlow", cqw: 10.0, weight: 900, lineHeight: 0.6 }
  fadelist-title:{ fontFamily: "Barlow", cqw: 10.5, weight: 900, lineHeight: 0.9, tracking: "-0.04em", lower: true }
  display: { fontFamily: "Barlow", cqw: 13.0, weight: 900, lineHeight: 0.88, tracking: "-0.04em", lower: true }

spacing:
  pad-x: "5.5cqw"
  pad-y: "5.5cqw"
  gap-lg: "3.5cqw"
  gap-md: "2cqw"
  gap-sm: "1cqw"

components:
  registers:
    dark: "ground {colors.ink-black}, text {colors.cream}, accent {colors.fire-orange}"
    orange: "ground {colors.fire-orange}, text {colors.ink-black}"
    description: "Two surfaces only — no cream/paper register. One register per frame."
  slide-chrome:
    rule: "1px solid {colors.border-dark} (dark) / 20% ink (orange)"
    placement: "top + bottom bars (label left, number right)"
    description: "SUPPRESSED on cover/chapter/statement/quote/end — declarative frames let type fill the field."
  kicker:
    typography: "{typography.label}"
    color: "{colors.fire-orange} (dark) / 55% ink (orange)"
    description: "Uppercase mono eyebrow."
  rule:
    backgroundColor: "{colors.fire-orange} (dark) / {colors.ink-black} (orange)"
    size: "36×2px"
    description: "Stub accent bar — the system's only ornament."
  broadside-num:
    typography: "{typography.label}"
    placement: "top-left of orange cover/chapter, low opacity"
    description: "Mono catalogue numeral."
  stat-card:
    borderTop: "1px solid {colors.border-dark}"
    typography: "{typography.stat-value} (orange on dark / ink on orange) + {typography.body} + {typography.label}"
    description: "Top-border-only block, no other borders."
  bullet:
    marker: "orange `/` mono via ::before"
    typography: "{typography.lead}"
    description: "Capped at THREE items."
  bar-track:
    borderLeft: "1px solid {colors.border-dark}"
    bars: "{colors.cream-hint}, one .accent {colors.fire-orange}"
    typography: "{typography.label} axis"
    description: "Vertical bar chart, left axis only."
  compare-panel:
    layout: "two equal panels split by a 1px vertical rule"
    payoff: "right panel may fill {colors.fire-orange}"
    description: "Before/after."
  fadelist:
    typography: "{typography.fadelist-item} ×3 at opacity 1.0/0.5/0.22 + {typography.fadelist-title}"
    description: "Three stacked words + one oversized title opposite."
---

# Broadside — Frame (video / frame layer)

## Overview

Broadside at frame scale is a **protest-poster system where type is so large it stops reading as
text and becomes graphic primitive.** Barlow `display` at 13cqw puts a single lowercase word
nearly across the frame. The system runs in **two registers**: a dark ink-black ground with cream
text for documentation, and a fire-orange ground with dark ink for declaration. Fire-orange is the
_only_ color — accent on dark, environment on orange. The plane is flat; hierarchy is weight, size,
and 1px hairlines.

**Barlow** carries every text role from display to body — expressive range from weight (400–900)
and size, not face contrast. **IBM Plex Mono** is chrome only (numbers, kickers, tags, axis labels,
the `/` bullet marker), always uppercase and tracked. Display is **lowercase** — the system's most
distinctive single decision, a deliberate inversion of the brutalist norm.

**Key characteristics at frame scale:**

- **Two registers** — dark (cream text) / orange (ink text). No cream/paper register.
- **Massive lowercase Barlow 900**, negative-tracked, as graphic primitive (display 13cqw).
- **Fire-orange is the only color** — accent on dark, full environment on orange.
- **IBM Plex Mono chrome** — uppercase, 0.14em; the `/` bullet marker; mono catalogue numbers.
- **Flat plane** — no shadow, no radius (save nav dots), no gradient; 1px hairlines carry structure.
- **Low density** — one statement per frame, bullets capped at three, chrome suppressed on declarative frames.

## The Frame

### Frame Craft Bar

Three eyeball tests gate every frame before any structural check:

- **Squint** — exactly **one display moment dominates** at 3–6× everything else; nothing competes.
- **Silence** — declarative frames read **45–55% empty**; the **stat grid is the one dense exception**.
- **Restraint** — **one register per frame**; **fire-orange is the only color** (accent on dark, environment on orange); one display moment; bullets capped at three.
- **Reference** — aim at **broadside printing / a SPACE10 report / a Wim Crouwel grid with one loud color**; failure looks like a **multi-accent corporate slide deck**.

- **Primary:** 1920×1080 (16:9). Type authored in **`cqw`** (`px ÷ 1920 × 100 = cqw`; or carry the source's `vw` 1:1).
- **Vertical:** 1080×1920 (9:16). **Square:** 1080×1080 (1:1).
- **Safe area:** `pad-x`/`pad-y` 5.5cqw — deliberately tight so the massive type crowds the frame edge.

**The container law (load-bearing).** Every frame ground sets `container-type: size`; ALL
frame-relative units are `cqw`/`cqh` against it — never `vw` (a `vw`-sized frame inflates when not
full-screen). 1px hairlines stay 1px.

## Colors

Tokens identical to the source, in two registers. **Dark:** `{colors.ink-black}` ground,
`{colors.cream}` text, `{colors.fire-orange}` accent (kickers, accent stat, bullet `/`, lead bar,
quote mark, rule stub). **Orange:** `{colors.fire-orange}` ground, `{colors.ink-black}` headlines +
body, with the dark-ink overlays (75/55/40/20%) as the muted tones. Choose one register per frame
and commit. **No second accent color** — on orange, emphasis is weight/opacity on the ink, never a
new hue. Cream text on orange does not exist (ink-on-fire is absolute).

## Typography

Two ramps. The **reading ramp** (Barlow body 1.2cqw, mono label 0.72cqw) carries copy + chrome; the
**display ramp** (Barlow `h2` 4.5cqw → `display` 13cqw, weight 700–900) carries every statement.

- **Legibility floor:** any load-bearing line ≥ **1.4cqw**; mono labels are chrome only.
- **Fit-to-measure:** size the headline to its length. Cap the block at **≤ 78cqw**; ≤2 words → `display`; 3–4 → `h1`; 5+ → `h2`. Broadside packs only ONE display moment per frame.
- **Barlow display is lowercase, weight 700–900, negative-tracked** (−0.04em largest, −0.02em h2). **Mono chrome is uppercase, 0.1em+.** No italic, no underline, no uppercase display.

## Depth & Surface

Flat plane, the only technique. Hierarchy from:

- **Weight + size contrast** — the dominant signal (900 lowercase display).
- **1px hairlines** — chrome bars, stat-card top, compare divider, bar-track left, chart baseline.
- **Color shift** — orange on ink, ink on cream, cream-muted on cream.
- **Negative space** — generous, intentional empty regions.

**Ceiling:** no box-shadow, no elevation, no rounded surface (save nav dots), no gradient ground.

## Shapes

- **0 radius everywhere** except nav dots (50%). Cards, panels, tags, stat blocks, bars — sharp rectangles.

## Components

- **registers** — the two-surface system. **slide-chrome** — optional hairline bars, suppressed on declarative frames.
- **kicker** (mono eyebrow) / **rule** (36×2 stub) / **broadside-num** (catalogue mark) — the chrome ornament set.
- **stat-card** (top-border only) / **bullet** (orange `/`, max 3) / **bar-track** (one accent bar) / **compare-panel** (orange payoff) / **fadelist** (1.0/0.5/0.22 stack).

## Frame Treatments

> Recipe: ground · register · composes · focal · chrome · accent · silence · Fixed/Free · density.
> One statement per frame; chrome suppressed on declarative frames.

### 1 · Cover (identity · move: massive type · ORANGE register · left)

**Ground** fire-orange. **Composes** broadside-num, rule, kicker, display, lead. **Focal** a 1–2 word
Barlow `display` (13cqw) lowercase in ink, left-anchored, over a small ink rule stub + mono kicker; a
Barlow lead line beneath in 75% ink. **Chrome** mono catalogue number top-left, mono meta top-right
(no chrome bars). **Accent** the ink itself is the pop on orange. **Silence** ~45%. **Fixed** ink-on-fire,
lowercase 900, flat. **Free** the word, kicker, lead. **Density** low.

### 2 · Statement (declarative · move: type IS composition · DARK register · left)

**Ground** ink-black. **Composes** kicker, display. **Focal** a 2–4 word Barlow `display`/`h1`
lowercase in cream, with ONE clause inked `{colors.fire-orange}`. **Chrome** mono kicker; no bars.
**Accent** the orange clause. **Silence** ~55%. **Fixed** lowercase 900, one orange clause, flat.
**Free** the statement, which clause is orange. **Density** low.

### 3 · Stat Grid (data · move: top-border cards · DARK · the dense frame)

**Ground** ink-black, chrome bars present. **Composes** slide-chrome, kicker, 3× stat-card. **Focal** a
row of three top-border-only stat-cards — big Barlow-900 numeral in `{colors.fire-orange}`, Barlow
label, mono note. **Chrome** top + bottom hairline bars (label + number). **Accent** the orange
numerals. **Silence** moderate — the density exception. **Fixed** top-border-only cards, orange
numerals, 1px hairlines. **Free** figures (from script), labels. **Density** dense-exception.

### 4 · Fadelist (narrative · move: opacity stack · DARK)

**Ground** ink-black. **Composes** fadelist (3 stacked Barlow-900 words at 1.0/0.5/0.22), fadelist-title.
**Focal** the three-stage word stack opposite an oversized display title in `{colors.fire-orange}`
(before/during/after). **Accent** the orange title. **Silence** moderate. **Fixed** the opacity
ladder, lowercase 900. **Free** the three words, the title. **Density** low-moderate.

### 5 · Pull Quote (quote · move: oversized mark · DARK · left)

**Ground** ink-black, chrome suppressed. **Composes** quote-mark, quote-text, attribution. **Focal** a
Barlow `quote-text` (700, lowercase) at ≤78cqw under an oversized fire-orange `quote-mark` (10cqw,
line-height 0.6). **Chrome** mono attribution (name + role). **Accent** the orange quote mark. **Silence**
~50%. **Fixed** orange mark, lowercase quote. **Free** quote, attribution. **Density** low.

### 6 · Compare (argument · move: split + orange payoff · DARK→ORANGE)

**Ground** ink-black left panel + fire-orange right (payoff) panel, 1px divider. **Composes**
compare-panel pair, kicker, h3. **Focal** two panels — left documents (cream on dark), right declares
(ink on orange). **Chrome** mono panel labels. **Accent** the orange payoff panel. **Silence** moderate.
**Fixed** ink-on-fire right panel, 1px divider, flat. **Free** the before/after content. **Density** standard.

## Composition Rules

### Do

- Set every Barlow display in **lowercase weight 900**, negative-tracked — the system's signature.
- Use **fire-orange as full environment** on declarative frames, the **lone accent** on dark.
- Keep chrome in **IBM Plex Mono uppercase, 0.14em**; use the `/` mono bullet marker.
- **Cap bullets at three; one statement per frame**; build hierarchy from weight, size, 1px hairlines.
- Suppress chrome bars on cover/chapter/statement/quote/end; let type fill the field.
- Lean left on most frames; the type IS the composition.

### Don't

- Never uppercase Barlow display; never add a second accent color.
- Never put cream text on orange (ink-on-fire is absolute); never a cream/paper register.
- No drop shadow, no rounded surface (save nav dots), no gradient ground.
- No serif companion; chrome is never Barlow.
- Don't pack two display moments into one frame; don't blow a long line edge-to-edge — step down.

## Aspect-Ratio Behavior

| Treatment  | 16:9                       | 9:16                       | 1:1              |
| ---------- | -------------------------- | -------------------------- | ---------------- |
| Cover      | word left, lead below      | word top, lead below       | centered word    |
| Statement  | display left               | display stacked taller     | display centered |
| Stat Grid  | 3 across                   | 3 stacked                  | 2+1              |
| Fadelist   | stack + title side-by-side | stack over title           | stack over title |
| Pull Quote | mark + quote left          | mark top, quote below      | centered         |
| Compare    | side-by-side panels        | stacked (dark over orange) | stacked          |

`pad-x` holds tight on the short edge; re-step display so the one big line stays ≤78cqw and above the
1.4cqw floor. Mono chrome stays Latin/digit-only.

## Approved Entities

No real customers, logos, or vendors are defined in the source — render any such mark as a
placeholder (the dashed `img-placeholder` at 55cqh). The system supplies type and one color, not brands.

## Numerals & Claims (hard rule)

Never invent figures, percentages, dates, or counts at frame scale. Render slots as `— figure —`,
`{metric}`, `NN%`. Stat-card numerals and bar heights carry placeholders until the script supplies
them. Catalogue numbers (No. 01) are decorative chrome and may be sequential.

## Pre-Render Self-Audit

- **Squint** — exactly one display moment dominates; nothing competes.
- **Silence** — declarative frames ~45–55% empty; only the stat grid runs dense.
- **Register** — one register per frame; ink-on-fire on orange, cream on dark; no second hue.
- **Type** — Barlow lowercase 900 negative-tracked, fit-to-measure; mono chrome uppercase 0.14em; ≥1.4cqw floor.
- **Depth** — 0 shadow, 0 radius (save nav dots); 1px hairlines only.
- **Bullets** — capped at three, orange `/` marker.
- **Fabrication** — every numeral traces to the script, else placeholder.

## Known Gaps

- **Motion intentionally out of scope.** frame.md specifies composition only; the source's 0.8s deck slide + per-element entry animations are deck mechanics.
- **Barlow + IBM Plex Mono via Google Fonts**; Noto Sans SC is the CJK fallback (the lowercase-display signal has no CJK equivalent — the two-register color system carries the identity, per the source).
- **9:16 / 1:1 are guidance**; verify the one big line stays ≤78cqw and above the floor per ratio.
- Bars, compare panels, and the dashed image placeholder are CSS-only; no external imagery is required.
```

### 17/20 · `ai-beat-sync/hyperframes.json`
<!-- casebook-file {"path": "ai-beat-sync/hyperframes.json", "lines": 13, "final_newline": true, "sha256": "d4aca0771e1b3b6be0e4a35c383adef396253f7fa81f59b39c261efc51a4bfea", "original_sha256": "d4aca0771e1b3b6be0e4a35c383adef396253f7fa81f59b39c261efc51a4bfea"} -->
```json
{
  "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  },
  "media": {
    "autoProxy": true
  },
  "authoringSkill": "music-to-video"
}
```

### 18/20 · `ai-beat-sync/index.html`
<!-- casebook-file {"path": "ai-beat-sync/index.html", "lines": 117, "final_newline": true, "sha256": "481de4ff1595d36869cad37d505dcf4a9da720b40162f93750b668642b826617", "original_sha256": "481de4ff1595d36869cad37d505dcf4a9da720b40162f93750b668642b826617"} -->
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="assets/gsap.min.js"></script>
    <style>
      @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-400.ttf") format("truetype"); font-weight: 400; font-display: block; }
      @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
      @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
      @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
      @font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
      @font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }
      @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
      @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; }
      #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; }
      .frame { position: absolute; inset: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="51.293"
      data-width="1920"
      data-height="1080"
    >
      <div
        id="el-01-f1-boot"
        class="frame"
        data-composition-id="01-f1-boot"
        data-composition-src="compositions/frames/01-f1-boot.html"
        data-start="0"
        data-duration="4.644"
        data-track-index="1"
      ></div>

      <div
        id="el-02-f2-title"
        class="frame"
        data-composition-id="02-f2-title"
        data-composition-src="compositions/frames/02-f2-title.html"
        data-start="4.644"
        data-duration="6.269"
        data-track-index="1"
      ></div>

      <div
        id="el-03-f3-montage"
        class="frame"
        data-composition-id="03-f3-montage"
        data-composition-src="compositions/frames/03-f3-montage.html"
        data-start="10.913"
        data-duration="11.749"
        data-track-index="1"
      ></div>

      <div
        id="el-04-f4-drop"
        class="frame"
        data-composition-id="04-f4-drop"
        data-composition-src="compositions/frames/04-f4-drop.html"
        data-start="22.662"
        data-duration="14.304"
        data-track-index="1"
      ></div>

      <div
        id="el-05-f5-finale"
        class="frame"
        data-composition-id="05-f5-finale"
        data-composition-src="compositions/frames/05-f5-finale.html"
        data-start="36.966"
        data-duration="11.633"
        data-track-index="1"
      ></div>

      <div
        id="el-06-f6-outro"
        class="frame"
        data-composition-id="06-f6-outro"
        data-composition-src="compositions/frames/06-f6-outro.html"
        data-start="48.599"
        data-duration="2.694"
        data-track-index="1"
      ></div>

      <!-- BGM -->
      <audio id="el-bgm" src="assets/bgm.mp3" data-start="0" data-duration="51.293"
        data-track-index="11" data-volume="0.9"></audio>

      <!-- SFX design layer -->
      <audio id="sfx-typing" src="assets/sfx/typing.mp3" data-start="0.10" data-duration="1.5" data-track-index="12" data-volume="0.5"></audio>
      <audio id="sfx-keypress" src="assets/sfx/key-press.mp3" data-start="2.42" data-duration="0.4" data-track-index="12" data-volume="0.6"></audio>
      <audio id="sfx-whoosh-surge" src="assets/sfx/whoosh-cinematic.mp3" data-start="4.644" data-duration="5.544" data-track-index="13" data-volume="0.55"></audio>
      <audio id="sfx-impact-title" src="assets/sfx/impact-bass-1.mp3" data-start="4.676" data-duration="2.116" data-track-index="14" data-volume="0.9"></audio>
      <audio id="sfx-glitch-roll1" src="assets/sfx/glitch-1.mp3" data-start="12.399" data-duration="2.638" data-track-index="12" data-volume="0.4"></audio>
      <audio id="sfx-riser" src="assets/sfx/riser.mp3" data-start="13.65" data-duration="10.03" data-track-index="15" data-volume="0.4"></audio>
      <audio id="sfx-impact-drop" src="assets/sfx/impact-bass-2.mp3" data-start="23.676" data-duration="2.592" data-track-index="14" data-volume="1.0"></audio>
      <audio id="sfx-glitch-roll2" src="assets/sfx/glitch-2.mp3" data-start="25.588" data-duration="3.504" data-track-index="12" data-volume="0.35"></audio>
      <audio id="sfx-click-1" src="assets/sfx/click.mp3" data-start="27.66" data-duration="0.366" data-track-index="16" data-volume="0.5"></audio>
      <audio id="sfx-click-2" src="assets/sfx/click.mp3" data-start="29.95" data-duration="0.366" data-track-index="16" data-volume="0.5"></audio>
      <audio id="sfx-glitch-finale" src="assets/sfx/glitch-3.mp3" data-start="36.966" data-duration="3.096" data-track-index="12" data-volume="0.4"></audio>
      <audio id="sfx-whoosh-roll" src="assets/sfx/whoosh-short.mp3" data-start="44.164" data-duration="0.575" data-track-index="16" data-volume="0.6"></audio>
      <audio id="sfx-impact-final" src="assets/sfx/impact-bass-1.mp3" data-start="47.276" data-duration="2.116" data-track-index="14" data-volume="0.95"></audio>
      <audio id="sfx-whoosh-outro" src="assets/sfx/whoosh-cinematic.mp3" data-start="48.599" data-duration="2.694" data-track-index="13" data-volume="0.3"></audio>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
```

### 19/20 · `ai-beat-sync/meta.json`
<!-- casebook-file {"path": "ai-beat-sync/meta.json", "lines": 5, "final_newline": false, "sha256": "1a0eb762f2aad6b09fefcd0895a2ece07fdf8b328144da2ff899c7bbffad064e", "original_sha256": "1a0eb762f2aad6b09fefcd0895a2ece07fdf8b328144da2ff899c7bbffad064e"} -->
```json
{
  "id": "ai-beat-sync",
  "name": "ai-beat-sync",
  "createdAt": "2026-09-24T17:02:22.203Z"
}
```

### 20/20 · `ai-beat-sync/package.json`
<!-- casebook-file {"path": "ai-beat-sync/package.json", "lines": 11, "final_newline": true, "sha256": "ded517a4910d40c1a9220042fee5a060f03a12e8dd2d3b0ab9091a8e6092e4fb", "original_sha256": "ded517a4910d40c1a9220042fee5a060f03a12e8dd2d3b0ab9091a8e6092e4fb"} -->
```json
{
  "name": "ai-beat-sync",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "npx --yes hyperframes@0.8.73 preview",
    "check": "npx --yes hyperframes@0.8.73 check",
    "render": "npx --yes hyperframes@0.8.73 render",
    "publish": "npx --yes hyperframes@0.8.73 publish"
  }
}
```

