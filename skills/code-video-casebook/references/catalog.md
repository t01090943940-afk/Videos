# 案例路由表（按用途 / 画幅时长 / 技术栈 / 视觉风格 / 素材 / 声音选案例）

31 个案例全部收录在 `references/cases/<id>/`（CARD.md 检索卡 + CoExp.md 原文复盘 + FILES.md 源码清单 + preview.jpg 联系表），源码原样解压在 `assets/cases/<id>/`。先在这里按需求挑 1–3 个最接近的案例，再读它们的 CARD.md。

## 目录

1. [总表（31 个案例）](#1-总表31-个案例)
2. [按用途 / 片型](#2-按用途--片型)
3. [按画幅与时长](#3-按画幅与时长)
4. [按技术栈](#4-按技术栈)
5. [按视觉风格](#5-按视觉风格)
6. [按素材来源](#6-按素材来源)
7. [按声音做法](#7-按声音做法)
8. [按约束快速挑选](#8-按约束快速挑选)

---

## 1. 总表（31 个案例）

"源码"列：✅ = `assets/cases/<id>/` 有完整工程；📄 = 只有 CoExp（关键代码写在 CoExp 里）；🧰 = 本身是 Skill / 工具 / 资料。

| id | 片名 | 模型 | 规格 | 主栈 | 源码 | 一句话卖点 |
|---|---|---|---|---|---|---|
| [supercut](cases/supercut/CARD.md) | AI-Coding SuperVideos 合集总片 | Opus | 1080p→720p60 · 62.4s | HyperFrames + GSAP + render(t) | ✅ | 28 部代码视频的预告片，EDL 即乐谱 |
| [kimi-beat](cases/kimi-beat/CARD.md) | AI 觉醒 | Kimi | 1080p30 · 51s | HyperFrames + GSAP + librosa | ✅ | 全曲节拍分析，拍点硬切 |
| [ai-rise](cases/ai-rise/CARD.md) | AI:RISE | SWE | 1080p30 · 40s | Canvas + DOM + Playwright ×6 | ✅ | renderAt(t) 纯函数，129.2 BPM 帧级锁拍 |
| [kimi-film](cases/kimi-film/CARD.md) | 月之暗面 · KIMI | SWE | 1080p30 · 56s · 2.35:1 | numpy 逐像素 + PIL | ✅ | 六幕六种视觉语言 + 六种 BPM |
| [cosmos30](cases/cosmos30/CARD.md) | COSMOS · 从未知到寂静 | GPT | 1080p30 · 72s | Python + EGL/GLSL 单 shader | ✅ | 30 种画风 × 2.4s，200 BPM，10Hz 定格 |
| [beyond](cases/beyond/CARD.md) | AI · Beyond Generation | GPT | 1080p30 · 120s | Python + pycairo + 原生 GL | ✅ | 15 个世界 = 15 条原则 × 15 种风格 |
| [gpt-autumn](cases/gpt-autumn/CARD.md) | 把日子，慢慢过圆 | GPT | 1080p60 · 60s | pycairo + MIDI/FluidSynth | ✅ | 21 镜，每个时代换一种材质 |
| [moon-letter](cases/moon-letter/CARD.md) | 月光信笺 | GPT | 竖屏 1080×1920 · 29s | 单文件 HTML Canvas | ✅ | 可交互 HTML 与成片同源 |
| [shatter](cases/shatter/CARD.md) | 碎月重圆 | Opus | 1080p30 · 30s | numpy + OpenCV + MediaPipe | 📄 | 自写 3D 合成器、抠像拆层、23 万粒子 |
| [oneink](cases/oneink/CARD.md) | 一畫 | Opus | 1080p30 · 60.5s | Canvas2D + WebGL2 + hanzi-writer | ✅ | 按笔顺写书法，手卷一镜到底 |
| [dingge](cases/dingge/CARD.md) | 定格 · 工地安全 | Opus | 1080p24 · 87s | TypeScript + Three.js r186 | ✅ | 写实定格动画，瑞士奶酪模型叙事 |
| [claude15](cases/claude15/CARD.md) | Claude 自我介绍 · 15 种画风 | Opus | 1080p30 · 114s | skia-python | ✅ | 拉片表驱动，15 画风一条叙事线 |
| [protocom](cases/protocom/CARD.md) | protocom 社团宣传片 | Opus | 1080p60 · 80s | Canvas2D + WebGL 后期 | ✅ | 用画风变化叙事，2D→3D→4D |
| [codecosmos](cases/codecosmos/CARD.md) | 代码宇宙 | Opus | 1080p · 12→24fps · 68s | Canvas2D + Three.js + GLSL | ✅ | 27 种代码风格，一拍二定格卡点 |
| [phasegate](cases/phasegate/CARD.md) | Phase-Gate 升维 | Opus | 1080p60 · 30s | SVG 手绘 + Three.js | 📄 | 手绘→矢量→扁平→黏土→写实 |
| [ageint](cases/ageint/CARD.md) | 智能时代 | Opus | 1080p60 · 92s | numpy + OpenCV + Pillow | ✅ | 108 镜、4170 行 Python、双 drop |
| [skillshub](cases/skillshub/CARD.md) | Skills Hub 宣传片 | Opus | 1080p60 · 57s | DOM + Canvas + SVG 舞台 | ✅ | 114 拍，从零写一套前端来拍 |
| [f12](cases/f12/CARD.md) | DevTools in 60 Seconds | Opus | 1080p30 · 60s | DOM 仿真 UI + render(t) | ✅ | 128 BPM 32 小节 + 可交互仿真浏览器 |
| [hust1037](cases/hust1037/CARD.md) | 1037 | Opus | 1080p30 · 110s | Canvas2D | 📄 | 一个符号讲完一所大学 |
| [xuanlan](cases/xuanlan/CARD.md) | 玄览 PocketWebShell | Opus | 1080p60 · 55s | Canvas2D + Playwright ×4 | 📄 | 32 分钟完成，浏览器三十年进化史 |
| [studysolo](cases/studysolo/CARD.md) | StudySolo | Opus | 1080p60 · 57s | 真实页面 + 伪造流 + three.js | 📄 | 真实 Agent 页面，过去 \| 现在分屏 |
| [yusheng](cases/yusheng/CARD.md) | 羽升集 | Opus | 1080p60 · 30s | 单文件 HTML + Canvas + SVG | 📄 | 每一拍一个可见动作 |
| [shuchenglin](cases/shuchenglin/CARD.md) | 树成林 | Opus | 1080p30 · 60s | librosa + 虚拟时间录屏 + Canvas | ✅ | 卡点靠坐标，只在同一小节位置剪歌 |
| [stopmotion](cases/stopmotion/CARD.md) | stop-motion-3d Skill | Opus | 720p24 · 60s | TS + Three.js，7 条画风管线 | 🧰✅ | 搭一次世界，拍任何画风 |
| [samemoon](cases/samemoon/CARD.md) | 同一个月亮 | Opus | 1080p30 · 120s | 单文件 Canvas + Web Audio | 📄 | 854 行 HTML，两个半月拼成满月 |
| [gongcishi](cases/gongcishi/CARD.md) | 共此时 | Opus | 1080p30 · 180s | Python 14 文件 + 真实素材 | 📄 | 217 份真实照片视频，机器看片 + 人工看片 |
| [moonlamp](cases/moonlamp/CARD.md) | 月光替你亮着灯 | Opus | 1080p24 · 28s | Three.js + 水彩 GLSL | ✅ | 真 3D 一镜到底，月夜水彩 |
| [readclub](cases/readclub/CARD.md) | 慢下来（读书会） | Opus | 竖屏 1080×1920 · 37s | 单 HTML Canvas + Web Audio | ✅ | 一个 HTML 同时生成画面和音乐 |
| [senpai](cases/senpai/CARD.md) | 中秋 · 给学姐 | Opus | 竖屏 1080×1920 · 29s | Canvas2D + numpy | 📄 | render(t) 纯函数，局部重渲 |
| [atlas](cases/atlas/CARD.md) | VibeMotion / motion-library-atlas | — | 资料 | 111 个库的能力词典 | 🧰✅ | 选型与能力边界百科 |
| [town-camera-lab](cases/town-camera-lab/CARD.md) | 小镇片场 | — | 交互网页 | Three.js r128 + HDR 管线 | ✅ | 物理相机 + 13 种运镜实验室 |

---

## 2. 按用途 / 片型

| 用途 | 首选 | 备选 | 为什么 |
|---|---|---|---|
| **产品 / App / 开发者工具宣传** | `skillshub`、`xuanlan` | `studysolo`、`phasegate`、`f12` | 真实 UI（自写 DOM 或真实页面）、功能段统一版式、真实数据 |
| **AI 产品，要展示流式回答** | `studysolo` | `skillshub` | 页面内伪造 SSE 流逐 chunk 截图 |
| **协议 / 方法论 / skill 介绍（抽象概念）** | `phasegate` | `beyond`、`codecosmos` | 形式承载内容：阶段 = 画风升维 |
| **社团 / 组织 / 社群宣传、招新** | `protocom`、`shuchenglin` | `readclub`、`hust1037` | 母题 + 真实成员与数据 + 行动号召 |
| **学校 / 机构 / 群像** | `hust1037` | `protocom`、`gongcishi` | 一个符号替代真人 |
| **公司 / 品牌发展史** | `kimi-film` | `ageint`、`xuanlan` | 编年 + 视觉母题 + 听觉母题 |
| **自我介绍 / 品牌人格** | `claude15` | `yusheng` | 一条叙事线 + 多画风 |
| **个人博客 / 作品集 / 个人品牌** | `yusheng` | `supercut` | 前段讲人，后段每拍一件作品 |
| **作品合集 / 预告片 / 年度回顾** | `supercut` | `shuchenglin`、`kimi-beat` | EDL 驱动大量视频代理混剪 |
| **AI 主题卡点 / 观点短片** | `ageint`、`kimi-beat` | `ai-rise`、`beyond` | 双 drop、编年、节拍分析 |
| **科普 / 宇宙史 / 时间线** | `codecosmos`、`cosmos30` | `ageint` | 每个阶段一种可视化，风格即隐喻 |
| **软件教学 / 工具讲解** | `f12` | `town-camera-lab` | 仿真 UI + 信息栏 + 按拍要点 |
| **摄影 / 运镜教学、分镜预演** | `town-camera-lab` | `dingge` | 13 种运镜参数化 + 物理相机 |
| **安全教育 / 公益 / 剧情短片** | `dingge` | `stopmotion` | 写实定格、表演 Take、镜头即数据 |
| **节日片（面向大众）** | `samemoon`、`gpt-autumn` | `oneink`、`gongcishi` | 快-停-慢、历史穿越、祝福 |
| **送给某个人的祝福（中秋等）** | `moonlamp`、`senpai` | `moon-letter`、`readclub` | 情绪句先行、让对方成为画面主角 |
| **班级 / 毕业 / 回忆（真实照片视频）** | `gongcishi` | `shatter` | 先看完全部素材、线索表、原声接管 |
| **照片素材做 AE 级特效** | `shatter` | `gongcishi` | 自写 3D 合成器、抠像 2.5D |
| **中国传统文化 / 书法 / 古诗** | `oneink` | `gpt-autumn`、`samemoon` | 按笔顺写字、着色器墨、古琴合成 |
| **风格合集 / "N 种画风"** | `cosmos30`、`codecosmos`、`claude15` | `beyond`、`protocom`、`stopmotion` | 统一外壳、多变内核 |
| **动画系列 / 漫剧（同一世界多集）** | `stopmotion` | `dingge`、`moonlamp` | World/Episode/Look/Delivery 四层 |
| **还不知道用什么库** | `atlas` | — | 111 个库的能力与边界 |

## 3. 按画幅与时长

| 画幅 / 时长 | 案例 |
|---|---|
| **竖屏 9:16** | `readclub`（37s）、`moon-letter`（29s）、`senpai`（29s） |
| **宽银幕 / 遮幅叙事** | `kimi-film`（2.35:1 全片）、`skillshub`（2.39:1 → 满幅）、`xuanlan`（2.39 ↔ 16:9 开合）、`yusheng`（2.35 开合）、`supercut`（凝视段黑边） |
| **≤ 30 秒** | `moonlamp` 28、`senpai` 29、`moon-letter` 29、`yusheng` 30、`phasegate` 30、`shatter` 30 |
| **40–60 秒** | `ai-rise` 40、`kimi-beat` 51、`xuanlan` 55、`kimi-film` 56、`skillshub` 57、`studysolo` 57、`gpt-autumn` 60、`f12` 60、`oneink` 60.5、`shuchenglin` 60、`stopmotion` 60、`supercut` 62.4 |
| **60–100 秒** | `codecosmos` 68、`cosmos30` 72、`protocom` 80、`dingge` 87、`ageint` 92 |
| **≥ 100 秒** | `hust1037` 110、`claude15` 114、`beyond` 120、`samemoon` 120、`gongcishi` 180 |
| **60fps 交付** | `gpt-autumn`、`skillshub`、`studysolo`、`yusheng`、`xuanlan`、`ageint`、`protocom`、`phasegate`、`supercut` |
| **24fps / 定格节奏** | `dingge`（on twos）、`moonlamp`、`codecosmos`（12→24）、`stopmotion`（8/12 步进）、`cosmos30`（30fps 输出、10Hz 姿态） |

## 4. 按技术栈

骨架与可复用代码见 [pipelines.md](pipelines.md)。

| 栈 | 案例 | 适合 |
|---|---|---|
| **纯 Python：numpy / Pillow 逐像素** | `kimi-film`、`senpai`（音频） | 零依赖、可多进程、完全可控 |
| **Python + OpenCV（抗锯齿、仿射、透视）** | `ageint`、`shatter`、`gongcishi` | 大量镜头、照片素材、3D 投影点云 |
| **Python + pycairo** | `gpt-autumn`、`beyond`（2D 部分） | 矢量插画、2.5D |
| **Python + skia-python** | `claude15` | 高质量 2D、离屏 surface 做转场 |
| **Python + 原生 OpenGL / EGL 无头** | `cosmos30`（单 fragment shader）、`beyond`（网格 + 阴影贴图） | 着色器画风、3D，无浏览器 |
| **浏览器 Canvas 2D + Playwright 逐帧** | `ai-rise`、`hust1037`、`xuanlan`、`protocom`、`samemoon`、`readclub`、`senpai`、`moon-letter`、`yusheng`、`oneink` | 最通用；文字排版、字体、特效都方便 |
| **浏览器 DOM/CSS 舞台 + CDP 截图** | `skillshub`、`f12`、`yusheng`、`studysolo` | 产品 UI、排版密集 |
| **HyperFrames + GSAP** | `kimi-beat`、`supercut` | HTML 合成、多段视频代理、seekable 时间线 |
| **Three.js（WebGL）** | `dingge`、`moonlamp`、`stopmotion`、`phasegate`、`studysolo`、`codecosmos`、`town-camera-lab` | 3D 场景、定格、写实材质、真实相机 |
| **自写 WebGL/WebGL2 着色器后期或合成** | `oneink`（墨）、`protocom`（post.js）、`moonlamp`（水彩 12 步） | 胶片质感、墨、水彩、辉光 |
| **单文件 HTML（画面 + Web Audio 配乐 + 播放器）** | `samemoon`、`readclub`、`moon-letter` | 可在线播放 + 离线导出同一份代码 |
| **录制真实网页 / 真实应用** | `shuchenglin`（虚拟时间）、`studysolo`（伪造流） | 用真实产品画面 |
| **TTS 旁白** | `ai-rise`（edge-tts） | 需要人声 |

## 5. 按视觉风格

| 风格 | 案例（具体在哪一段） |
|---|---|
| **手绘 / 铅笔 / 线稿（沸腾线）** | `phasegate`（Act I–II）、`studysolo`（过去段 SVG）、`protocom`（act1 铅笔积木山）、`readclub`（A 段手卷）、`claude15`、`beyond`、`stopmotion`（sketch）、`samemoon`（铅笔段）、`gpt-autumn`（铅笔纸张） |
| **水墨 / 书法** | `oneink`（全片）、`samemoon`（水墨烘云托月）、`gpt-autumn`（宋代水墨视差）、`beyond`（东方水墨）、`cosmos30` |
| **水彩** | `moonlamp`（全片 12 步 GLSL）、`readclub`、`stopmotion`（watercolor） |
| **黏土 / 定格** | `dingge`（写实定格）、`stopmotion`（clay / block / diorama）、`claude15`（方块定格、黏土）、`codecosmos`（一拍二照片卡）、`cosmos30`（10Hz）、`phasegate`（等距黏土） |
| **体素 / 方块 / MC** | `stopmotion`（block）、`codecosmos`（体素地球）、`claude15`、`beyond`、`cosmos30` |
| **像素 / 8-bit / 字符画 / 终端** | `codecosmos`（终端、十六进制、字符画、像素画）、`claude15`（CRT、8-bit）、`ai-rise`、`kimi-beat`、`kimi-film`（CRT）、`supercut`（终端冷开场）、`ageint` |
| **Vox 纸片拼贴 / 剪纸** | `stopmotion`（vox）、`beyond`、`cosmos30` |
| **漫画 / 网点 / 赛博** | `stopmotion`（comic）、`beyond`（半调漫画）、`cosmos30` |
| **扁平 / 瑞士 / 包豪斯排版** | `phasegate`（P3）、`claude15`、`yusheng`（瑞士海报）、`beyond` |
| **写实 3D / PBR** | `dingge`、`phasegate`（P5 钛金属霓虹）、`town-camera-lab`、`moonlamp` |
| **着色器抽象（等离子、反应扩散、光线步进、体积）** | `cosmos30`、`codecosmos`、`beyond`（液态铬、棱镜） |
| **4D / 超立方体** | `protocom`（act4）、`codecosmos`（暴胀）、`cosmos30` |
| **粒子 / 点云 / 星空** | `shatter`（23 万粒子）、`codecosmos`（7 万点云）、`ageint`（柔光点云 splat）、`oneink`（诗云星河）、`skillshub`（点阵星球）、`protocom`（星座） |
| **故障 / RGB 分离 / 频闪** | `kimi-beat`、`ai-rise`、`skillshub`、`codecosmos`、`claude15`、`shuchenglin`、`readclub`（B 段） |
| **真实产品 UI / 仿真界面** | `skillshub`、`f12`、`studysolo`、`xuanlan`、`protocom`（act3） |
| **照片 / 视频素材** | `gongcishi`、`shatter`、`supercut`、`shuchenglin` |
| **风格即年代（每个时代换材质）** | `gpt-autumn`、`samemoon`、`xuanlan`（浏览器年代）、`studysolo`（手绘 vs 真实界面） |

## 6. 按素材来源

| 素材 | 案例 | 关键方法 |
|---|---|---|
| **零素材，全部代码生成** | 大多数（`kimi-film`、`cosmos30`、`codecosmos`、`oneink`、`claude15`、`ageint`、`hust1037`…） | 程序化纹理、合成配乐 |
| **真实照片 / 手机视频** | `gongcishi`、`shatter` | 素材普查、MD5 去重、机器看片、抠像拆层 |
| **真实网页 / 真实应用** | `shuchenglin`、`studysolo`、`supercut`（成片代理） | 虚拟时间录屏、伪造 SSE 流、代理切片 |
| **真实文档 / 数据** | `skillshub`（扫描报告）、`protocom`（data.js）、`studysolo`（教材 grep）、`yusheng`（博客 frontmatter）、`dingge`（事故统计） | 数字必须可溯源，写下统计命令 |
| **授权歌曲** | `shuchenglin`、`kimi-beat` | librosa 解剖 → 只在同一小节位置下刀 |

## 7. 按声音做法

| 做法 | 案例 |
|---|---|
| **numpy/scipy 逐样本合成（无采样）** | 几乎所有 Python/浏览器案例：`kimi-film`、`ageint`、`cosmos30`、`skillshub`、`protocom`、`studysolo`、`yusheng`、`xuanlan`、`oneink`（古琴）、`gongcishi`（古筝/笛）、`codecosmos`、`stopmotion` |
| **Web Audio（页面内合成，OfflineAudioContext 导出）** | `samemoon`、`readclub`、`dingge` |
| **程序化 MIDI + FluidSynth** | `gpt-autumn` |
| **现成歌曲 + 节拍分析** | `kimi-beat`（audiomap）、`shuchenglin`（librosa 重构）、`ai-rise`（按拍剪 BGM） |
| **声音从画面数据派生（events.json / cues / inspect）** | `oneink`、`studysolo`、`stopmotion`、`moonlamp`、`supercut`、`codecosmos` |
| **原声接管（真实视频里的声音）** | `gongcishi` |
| **TTS 旁白** | `ai-rise` |

## 8. 按约束快速挑选

| 约束 | 推荐 |
|---|---|
| **只有 30–60 分钟** | `xuanlan`（32 分钟）、`samemoon`（53 分钟）的流程：单文件 Canvas + 合成配乐 |
| **没有 GPU、没有浏览器** | Python 栈：`kimi-film`、`ageint`、`claude15`、`gpt-autumn`；要着色器用 `cosmos30` 的 EGL 无头 |
| **没有 GPU、有 Chromium** | 加 `--disable-accelerated-2d-canvas`（`protocom`、`oneink` 的教训），3D 用 SwiftShader |
| **体积上限（聊天 30 MB / GitHub 50 MB）** | 从一开始按 `码率 ≈ 上限×8/时长 − 音频` 两遍编码（`yusheng`、`codecosmos`、`shuchenglin`） |
| **要能在线播放的网页版** | `samemoon`、`readclub`、`moon-letter`（同一 HTML 既播放又导出） |
| **要做系列 / 多集** | `stopmotion` |
| **要高信息密度教学** | `f12` |
| **必须用真实产品画面** | `studysolo`（真实页面）、`skillshub`（自写前端）、`shuchenglin`（虚拟时间录屏） |
