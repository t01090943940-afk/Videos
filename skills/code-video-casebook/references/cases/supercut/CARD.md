---
id: "supercut"
title: "AI-Coding SuperVideos 合集总片（28 部代码视频的预告片，62.4s）"
model: "Claude Opus"
folder: "00-supercut-trailer"
spec: "1920×1080 渲染 · 交付 720p60 · 62.4s（150 BPM × 156 拍，1 拍 = 0.4s = 12 帧@30fps）"
stack: ["HyperFrames 0.8.77（GSAP 时间轴逐帧 seek → render(tl.time())）", "原生 JS runtime.js render(t) + DOM/CSS + FX Canvas", "90+ 个 <video> 代理镜头", "Node 构建脚本 build.mjs（EDL → 静态 index.html + cues.json）", "ffmpeg prep_media.mjs", "Python numpy/scipy score.py"]
genre: ["合集预告片", "作品集混剪", "开源发布", "卡点 + 叙事"]
look: ["终端 render(t) 冷开场", "\"没有 AE/PR/剪辑软件\"三连砸 + 划除", "真实代码行墙", "时代卡 + 能力曲线", "3D 空间窗口堆叠", "宫格倍增 1→4→9→16", "全屏每拍一切", "斜切 n 联分屏", "手机框扇形", "海报隧道前冲滚转", "28 宫格巨墙急速拉远", "磁带骤停宽银幕凝视", "四字砸屏 + 冲击波", "三柱数字滚动", "闪传卡片 + 二维码"]
techniques: ["EDL 唯一真相源（画面与配乐同读）", "一切以拍为单位（150BPM × 30fps = 12 帧/拍）", "catalog.mjs 作品元数据 + wallIn 高光入点（20 格联系表目检）", "真实源码行原样截取做代码墙", "模型色系统", "HUD 28 槽时间尺", "能力曲线冲出画框", "半拍真空全黑再 DROP", "凝视段全抽空只剩心跳+钟", "织体密度=section energy", "阻尼弹簧 spring() 解析版 overshoot", "DOM 写入缓存", "事件表驱动闪白/震屏/冲击波", "prep 代理素材（竖屏转横屏、海报）", "hyperframes check/snapshot 闸门", "确定性：同一 t 渲染两次逐像素一致"]
---

# AI-Coding SuperVideos · 用代码剪一支"关于这 28 部代码视频"的预告片

![20 帧联系表](preview.jpg)

> **一句话**：本仓库所有作品的合集总片，本身也是一部代码视频——**没有一个剪辑软件，每一帧由 `render(t)` 算出，配乐由 numpy 逐样本合成，画面和音乐读同一份 EDL**。叙事：终端敲 `render(t)` → "没有 AE / 没有 PR / 没有剪辑软件" → KIMI 觉醒 → SWE 逐像素 → GPT 一个模型三十个世界 → OPUS 把代码做成电影（能力曲线冲破天花板）→ 28 部片子轰成一面墙 → 骤停："它们是怎么做出来的？" → **通 通 开 源** → 扫码全部带走 → `render(t)` 回车："下一部，由你来写。"

| 项 | 值 |
|---|---|
| 原目录 | `00-supercut-trailer/`（整个目录；无 CoExp，方法写在 `README.md` + `STORYBOARD.md` + 源码注释里） |
| 成片 | 渲染 1920×1080 60fps → 交付 1280×720 60p（CRF17）；代理片段 30fps（交付时源视频帧重复 2×，MG 层是真 60fps） |
| 收录 | 源码 `assets/cases/supercut/`（`src/edl.mjs` 乐谱、`src/catalog.mjs` 28 部作品元数据、`src/code-lines.mjs` 37 行真实源码、`src/runtime.js` 900 行、`src/style.css`、`tools/{build,prep_media,qa_probe}.mjs`、`audio/score.py`、`index.html`（构建产物）、`README.md`、`STORYBOARD.md`、字体、`qr.png`、`share-card.png`）· `FILES.md` · `preview.jpg`；**未收录**：90+ 个镜头代理 mp4、海报、`_survey/` 28 张联系表（已缩制为各案例的 `preview.jpg`）、score.wav |

## 什么时候抄它

- 要做**作品集 / 合集 / 年度回顾 / 发布会预告片**：大量已有视频素材按节拍混剪，叙事有递进和"揭晓"。
- 要用 **HyperFrames**（HTML 合成 + GSAP seek）驱动**几十个 `<video>` 代理片段**，同时叠 MG 文字、HUD、FX 画布。
- 要一个**EDL（剪辑决定表）写成代码**的范例：镜头、文字 cue、音效 cue 全在一个文件，构建脚本生成页面与配乐 cue。
- 想查**本仓库 28 部作品的一句话技术卖点**：`src/catalog.mjs`（本 casebook 的案例路由表也取材于此）。

## 架构（`assets/cases/supercut/`）

```
src/catalog.mjs     CATALOG：28 部作品 {id, title, model, spec, tech 一句话, 路径, 时代, wallIn 高光入点}（唯一真相源之一）
src/edl.mjs         BPM=150, BEAT=.4, FPS=30, TOTAL_BEATS=156；SECTIONS（含 energy 0.05–1.0）、ERAS 时代卡、SHOTS 41 个镜头（type: win/full/duoL/phoneR/split/phone/grid）、TEXT 文字 cue、62 个 SFX cue
src/code-lines.mjs  37 行真实源码（原样截取自各作品源码包 / CoExp，可 Ctrl+F 复现）
src/runtime.js      render(t) 纯函数：§1 数学/缓动/spring()/env()/pulse() §2 DOM 写入缓存 §3 事件表（闪白/震屏/冲击波）§4 冷开场 §5 时代卡+能力曲线/窗口堆叠 §6 GPT 宫格倍增/全屏/双画幅 §7 OPUS DROP/分屏/手机/隧道/巨墙 §8 凝视/通通开源/三柱/卡片/尾声 §9 HUD §10 FX 画布（颗粒、代码墙、速度线）
src/style.css       视觉系统：字体栈、层、窗口、分屏、手机框、巨墙、闪传卡片、HUD；模型色 KIMI #3CF0C8 / SWE #7CC4FF / GPT #A98BFF / OPUS #FF7A3D / SKILL #FFD166
tools/prep_media.mjs  ffmpeg 预切：镜头代理（统一 30fps）、海报、竖屏转横屏、QA 联系表
tools/build.mjs     EDL + 目录 → 静态 index.html（HyperFrames 合成，90+ 静态 <video>）+ build/cues.json + build/timeline.txt（勿手改 index.html）
tools/qa_probe.mjs  Playwright 加载 index.html，抓 JS 错误/控制台，按时刻渲染自查
audio/score.py      D 小调 Dm–B♭–F–C；动机 D4–F4–A4–D5 按段落移调；织体密度 = section energy；鼓/贝斯/supersaw/钟 + 打字/回车/闸刀/快门/whoosh/riser/磁带骤停/吸入 click×28；时变截止低通分块续状态
```

## 怎么跑

```bash
python3 scripts/casebook.py copy supercut work/supercut && cd work/supercut
npm install                     # hyperframes@0.8.77（自带 headless Chrome 管理）
# prep 需要 28 部原片（不随 skill 分发）→ 换成你自己的片子，改 src/catalog.mjs 的路径与 wallIn
npm run prep && npm run build && npm run score && npm run check && npm run snapshot
npm run render && npm run ship  # → renders/…-720p60.mp4
```

## 最值得抄的做法

1. **EDL 就是乐谱**：一切以拍为单位（150 BPM × 30 fps = 12 帧/拍，整数），画面切在哪一拍，鼓就落在哪一拍。
2. **能量曲线写进数据**：每个 section 带 `energy`，配乐织体密度直接读它（冷开场只有 pad → 逐段加 kick/hat/bass/supersaw → DROP 全开 → 凝视段只剩心跳 + 钟 → 揭晓四声 megaimpact）。
3. **两次"真空"**：DROP 前半拍全黑；凝视段磁带骤停 + 颗粒放大 + 宽银幕黑边 + 问句——揭晓前先把能量抽到 0.05。
4. **母题贯穿**：`frame = render(t)` 开场飞成 HUD，尾声回车执行；HUD 底部 28 槽时间尺，每部作品首次出场时按模型色点亮。
5. **可信证据**：代码墙用的是作品真实源码行，可以在源码包里 Ctrl+F 找到。
6. **镜头入点取高光**：先为每部作品做 20 格联系表，目检出 `wallIn`，再在 QA 联系表里核对。
7. **确定性验收**：同一 t 渲染两次逐像素一致（无 rAF / Date.now / 裸 Math.random）；二维码在片尾全尺寸停留 8.8 s，要实测可扫。

## 坑 / 取舍（README "已知取舍"）

- 代理片段统一 30fps，60p 交付时源视频帧重复；MG 层是真 60fps。
- `wallIn` 入点来自联系表目检，误差 ±1 s，需要对照 `contact-wall.jpg` 微调。
- `index.html` 是构建产物，改 EDL 后必须重新 `npm run build`，不要手改。

## 相关

- 用 HyperFrames + GSAP 卡点的单片：`kimi-beat`；28 部作品各自的卡片：`references/catalog.md`。
