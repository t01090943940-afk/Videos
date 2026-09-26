---
name: code-video-casebook
description: Casebook of 31 finished code-generated videos (product promos, club and festival films, explainers, beat-synced montages, style-switch films, stop-motion, ink, watercolor, pixel and 3D looks). Each case ships its original CoExp retrospective verbatim, its original source code unzipped, a retrieval card and a contact-sheet preview, plus a search/copy tool. Use when asked to make a video with code (代码视频, 用代码做宣传片/MG 动画/卡点视频/节日祝福视频/风格混剪/定格动画) using Python (numpy, Pillow, OpenCV, cairo, skia, EGL/GLSL), browser Canvas/DOM/WebGL/Three.js/HyperFrames captured with Playwright, ffmpeg, or procedural music; or when planning story, beat grids, transitions, audio sync, rendering speed, file size or QA for such a video. Find the closest case, read its card and retrospective, copy its source, then adapt it. Rendered videos are not included.
---

# Code Video Casebook · 代码视频案例库

31 个真实做完的代码视频案例（Kimi / SWE / GPT / Claude Opus 等模型产出），每个案例都带：

- **`references/cases/<id>/CoExp.md`**：作者当时写的复盘原文，一字未改（需求拆解、设计意图、技术栈、核心代码、坑、流程模板、开工提示词模板）。
- **`assets/cases/<id>/`**：原始源代码，已解压成真实文件、逐字节等于原档案（sha256 记录在 `references/index.json`）。没有单独源码包的案例，代码写在 CoExp 里。
- **`references/cases/<id>/CARD.md`**：检索卡——一句话、规格、什么时候抄它、架构与文件地图、怎么跑、最值得抄的做法、坑、CoExp 行号导读。
- **`references/cases/<id>/FILES.md`**：源码文件清单（行数、大小、摘要）与未收录文件说明；**`preview.jpg`**：成片 20 帧联系表。

原视频不收录。这个 Skill 就是一本可以直接抄的案例库：能力强时从多个案例组合出新方案；能力一般时挑最接近的案例，照着 CoExp 和源码做出同等水准。

## 铁律：先找原文，再动手

1. **先检索，不要凭空写。** 任何代码视频需求，先在下面的路由表或 `references/catalog.md` 里找 1–3 个最接近的案例。
2. **按顺序读**：`CARD.md` →（需要细节时）`CoExp.md` 的对应行 → 源码文件。CARD 的"CoExp 导读"给了行号。
3. **抄原工程，不要从零重写**：`copy` 出来先原样跑通，再只替换数据层（文案、数字、配色、素材、时间表）。
4. **遵守跨案例共识**（见下方"工程铁律"和 `references/playbook.md`）；出处案例的坑表逐条规避。
5. 案例里的名字、数字、二维码、成员信息都属于原项目，做新片时换成用户自己的真实信息，不确定的事实请用户确认。

## 检索工具 `scripts/casebook.py`（仅标准库，Python 3.8+）

```bash
python3 scripts/casebook.py list                                  # 31 个案例：id、规格、标题、技术栈
python3 scripts/casebook.py search "侧链|sidechain"               # 全文检索（卡片 + CoExp + 源码 + 汇总文档），正则、不区分大小写
python3 scripts/casebook.py search "toDataURL" --in source --glob '*.mjs'
python3 scripts/casebook.py search "字体" --case protocom,skillshub --in coexp -C 1
python3 scripts/casebook.py where oneink                          # 该案例所有文件的路径
python3 scripts/casebook.py files oneink                          # 源码文件清单（行数 + 摘要）
python3 scripts/casebook.py show oneink main.js --lines 1040:1100 # 读源码（路径、后缀或通配符）
python3 scripts/casebook.py show oneink CoExp.md --lines 448:472  # 读 CARD.md / CoExp.md / FILES.md 的指定行
python3 scripts/casebook.py copy oneink work/oneink               # 把原工程拷出来改（--only 'src/*' 只拷部分）
python3 scripts/casebook.py verify                                # 校验源码 sha256 与索引一致
```

搜索结果形如 `assets/cases/<id>/<path>:<行>` 或 `references/cases/<id>/CoExp.md:<行>`，可直接用 `show` 读上下文。长 base64 内联资源会被自动忽略。

## 案例路由表

按用途挑选；更细的路由（画幅、时长、栈、画风、素材、声音、约束）在 [references/catalog.md](references/catalog.md)。源码列：✅ 有完整工程 · 📄 代码在 CoExp 里 · 🧰 工具 / Skill / 资料。

**产品 / 工具 / 组织宣传**

| 案例 | 源码 | 什么时候抄它 |
|---|---|---|
| [skillshub](references/cases/skillshub/CARD.md) | ✅ | 开发者工具宣传片；DOM 四层舞台 + 从零设计产品界面；深浅两版；57s 114 拍 |
| [xuanlan](references/cases/xuanlan/CARD.md) | 📄 | App 宣传；32 分钟做完；窗口形变成手机；功能段左演示右真实源码逐字敲出 |
| [studysolo](references/cases/studysolo/CARD.md) | 📄 | 真实 Web/AI 应用；页面内伪造流式回答；过去 \| 现在分屏；DOM→three.js 交接 |
| [phasegate](references/cases/phasegate/CARD.md) | 📄 | 抽象方法论 / skill；5 阶段 = 5 次画风升维（手绘→写实 3D）；人按回车引爆 drop |
| [protocom](references/cases/protocom/CARD.md) | ✅ | 社团 / 组织宣传；画风变化叙事；AI Logo 墙、成员卡点、拉片、4D 超立方体 |
| [shuchenglin](references/cases/shuchenglin/CARD.md) | ✅ | 用授权歌曲的 60s 高燃宣传片；librosa 解剖 + 按小节剪歌；虚拟时间录真实网页 |
| [f12](references/cases/f12/CARD.md) | ✅ | 软件教学；仿真 DevTools + 信息栏；128 BPM 32 小节；附可交互仿真网站 |
| [hust1037](references/cases/hust1037/CARD.md) | 📄 | 学校 / 机构 / 群像；一个符号替代真人；颜色交接讲传承 |
| [kimi-film](references/cases/kimi-film/CARD.md) | ✅ | 公司 / 品牌发展史；numpy 逐像素六幕六种风格；零依赖多进程 |
| [claude15](references/cases/claude15/CARD.md) | ✅ | 自我介绍 / 品牌人格；skia-python；15 画风 + 转场表 + 故障回调蒙太奇 |
| [yusheng](references/cases/yusheng/CARD.md) | 📄 | 个人博客 / 作品集；前 12s 讲人、后段每拍一动；单文件 HTML 卡点模板 |
| [supercut](references/cases/supercut/CARD.md) | ✅ | 作品合集预告片；HyperFrames + GSAP 驱动 90+ 视频代理；EDL 即乐谱 |

**卡点 / AI 主题 / 风格合集 / 科普**

| 案例 | 源码 | 什么时候抄它 |
|---|---|---|
| [kimi-beat](references/cases/kimi-beat/CARD.md) | ✅ | 现成歌曲全曲节拍分析 → 拍点硬切；HyperFrames 入门 |
| [ai-rise](references/cases/ai-rise/CARD.md) | ✅ | renderAt(t) + 10 层画布 + 拍脉冲；按拍剪 BGM；TTS 旁白 |
| [ageint](references/cases/ageint/CARD.md) | ✅ | 108 镜、双 drop、纯 Python（numpy + OpenCV）大工程；编年叙事 |
| [cosmos30](references/cases/cosmos30/CARD.md) | ✅ | 30 种画风 × 2.4s；单 fragment shader + EGL 无头；200 BPM；10Hz 定格 |
| [codecosmos](references/cases/codecosmos/CARD.md) | ✅ | 27 种代码可视化风格讲宇宙史；一拍二定格照片卡；帧号纯函数的最佳范本 |
| [beyond](references/cases/beyond/CARD.md) | ✅ | 15 个世界 = 15 条原则 × 15 种风格；pycairo + 原生 GL 阴影；带逐帧 HTML 播放器 |

**节日 / 祝福 / 回忆 / 文化**

| 案例 | 源码 | 什么时候抄它 |
|---|---|---|
| [samemoon](references/cases/samemoon/CARD.md) | 📄 | 面向大众的节日片；单文件 Canvas + Web Audio；BGM 骤停；两个半月拼满月 |
| [gpt-autumn](references/cases/gpt-autumn/CARD.md) | ✅ | 节日片 60s；每个时代换一种材质；圆形母题 match cut；MIDI + FluidSynth |
| [oneink](references/cases/oneink/CARD.md) | ✅ | 书法 / 水墨 / 古诗；按笔顺写字；WebGL2 墨着色器；手卷一镜到底；古琴合成 |
| [gongcishi](references/cases/gongcishi/CARD.md) | 📄 | 217 份真实照片视频做 3 分钟回忆片；素材普查 + 机器看片；原声接管 |
| [shatter](references/cases/shatter/CARD.md) | 📄 | 照片素材做 AE 级特效；自写 3D 合成器、抠像拆层、23 万粒子 |
| [moonlamp](references/cases/moonlamp/CARD.md) | ✅ | 送给某人的祝福；Three.js 真 3D 一镜到底；12 步水彩 GLSL；13 项 QC |
| [senpai](references/cases/senpai/CARD.md) | 📄 | 竖屏温情祝福 29s；让对方成为画面里的光；V1 被否的教训 |
| [moon-letter](references/cases/moon-letter/CARD.md) | ✅ | 竖屏可交互 HTML 信笺；自带播放器；同源导出 MP4 |
| [readclub](references/cases/readclub/CARD.md) | ✅ | 竖屏招新；一个 HTML 同时生成画面与音乐；快 → 骤停 → 真慢 |

**3D / 定格 / 工具与资料**

| 案例 | 源码 | 什么时候抄它 |
|---|---|---|
| [stopmotion](references/cases/stopmotion/CARD.md) | 🧰✅ | 完整 stop-motion-3d Skill：一个世界 × 7 条画风管线；系列 / 漫剧；数字化 QC |
| [dingge](references/cases/dingge/CARD.md) | ✅ | 写实定格动画、安全教育、剧情；场地 / 表演 / 镜头三层分离 |
| [town-camera-lab](references/cases/town-camera-lab/CARD.md) | ✅ | 物理相机（景深、快门、测光）+ 13 种运镜；运镜教学、虚拟摄影棚 |
| [atlas](references/cases/atlas/CARD.md) | 🧰✅ | 还没定用什么库：111 个代码动画库的能力与边界词典 + 检索脚本 |

## 汇总参考（按需读，不要一次全读）

| 文件 | 什么时候读 |
|---|---|
| [references/catalog.md](references/catalog.md) | 选案例：按用途、画幅时长、技术栈、画风、素材、声音、约束的路由表 |
| [references/pipelines.md](references/pipelines.md) | 定管线：11 种技术栈的最小骨架 + 该抄的真实文件 + 该管线特有的坑；编码/响度/QC 命令 |
| [references/techniques.md](references/techniques.md) | 想做某个具体效果（转场、卡点、文字、画风、3D、表演、声音、QA）：技法 → 案例 → 文件或 CoExp 行号 |
| [references/playbook.md](references/playbook.md) | 通用打法：照抄 vs 二创、10 关工作流、开工前要问的事、创作原则、Top 30 坑、交付清单、通用开工提示词、各案例原文模板位置 |
| [references/inventory.md](references/inventory.md) | 全部案例的来源档案、文件数、体积（自动生成） |
| `references/index.json` | 机器可读索引：每个文件的路径、大小、sha256、摘要 |

## 工作流（照抄路线）

1. **问清约束**：时长、横竖屏、fps、交付渠道与体积上限、画风、素材在哪、要不要声音（清单见 playbook §3）。
2. **选案例**：路由表 / `catalog.md` / `casebook.py search`，选 1–3 个；看它们的 `preview.jpg` 确认画面方向。
3. **读原文**：CARD.md 全文；CoExp 的"需求拆解""设计意图""坑""开工提示词模板"四节（CARD 末尾有行号）。
4. **拷工程跑通**：`casebook.py copy <id> work/<id>`，按 CARD"怎么跑"装依赖、原样出几帧。缺的素材（原视频、音乐、头像、大字体）FILES.md 写了是什么、怎么补。
5. **替换数据层**：唯一时间源（timeline / cues / shots / plan / edl / episode）、文案、数字、配色、素材；管线与渲染器不动。
6. **按案例的节奏出片**：骨架 → 联系表 → 分段打磨 → 草稿 → 定稿 → 编码 → QC → 如实说明。

## 工程铁律（所有案例的公约数）

1. 画面是时间 / 帧号的**纯函数**（`render(t)`）；不用 `Date.now()`、未设种子的随机数、CSS 动画；有状态的效果预计算。
2. **一份时间源**同时驱动画面和声音；镜头起点由拍数累加，不手写。
3. **BPM × FPS 让每拍是整数帧**（120×30/60、150×30、128.571×60…）。
4. 声音事件从画面数据派生；drop 前留静默；whoosh 提前起。
5. 先骨架后细节；每写几段出联系表；渲染可分段、可续跑、后台跑。
6. 字体本地化并在渲染前全量加载；无 GPU 的 Chromium 加 `--disable-accelerated-2d-canvas`；用 http 服务打开页面。
7. 有体积上限就按上限反推码率两遍编码；颗粒 ≤ 10%；响度在 MP4 里测。
8. 交付时如实说明：脚本化的内容、待确认的事实、没有人耳试听。

## 目录结构

```
code-video-casebook/
├── SKILL.md
├── scripts/casebook.py              检索 / 阅读 / 拷贝 / 校验
├── references/
│   ├── catalog.md  pipelines.md  techniques.md  playbook.md  inventory.md  index.json
│   └── cases/<id>/CARD.md  CoExp.md  FILES.md  preview.jpg     （31 个案例）
└── assets/cases/<id>/…              原始源码（已解压，逐字节一致）
```

两种打包：标准版（Claude Code / Agent SDK / API）源码是真实文件；claude.ai 版因平台单包 ≤ 200 个文件，把每个案例的源码无损打包进 `assets/cases/<id>/SOURCE.md`（每个文件一个 `### k/n · \`路径\`` 小节 + 原样代码块）。`casebook.py` 两种布局都能读；没有 Python 时直接读 SOURCE.md 并按标题定位文件。
