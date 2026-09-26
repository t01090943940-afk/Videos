---
id: "atlas"
title: "VibeMotion / motion-library-atlas（代码视频方式全景：111 个库的能力词典 + 研究工作站）"
model: "不详（资料型案例，非单片）"
folder: "skill-代码视频所有绝大部分方式和启迪"
spec: "不是视频，是参考资料：1 个 Skill（111 个库条目 × 2 个实验方向）+ 2 个单文件 HTML 工作站"
stack: ["motion-library-atlas Skill（SKILL.md + catalog-index.json + search_atlas.py）", "VIBEMOTION-workstation.html（React + d3 打包的研究工作站，28 个 Canvas 原理演示）", "VibeMotion-本地版.html（边界图谱）"]
genre: ["选型 / 调研", "能力边界", "知识库"]
look: ["—"]
techniques: ["先区分能力再选工具", "证据等级（documented / 未测保持未知）", "统一时间不必统一代码（直接求值 / 可重放状态 / 预计算状态）", "三种状态的验证：从头求值 vs 跳转求值 vs 回退求值", "虚拟摄影棚先有可信空间", "定格不只是降帧", "从拉片反查组件", "组合库前先查接口边界", "声音的四种材料", "渐进式披露检索", "许可与再分发"]
---

# VibeMotion / motion-library-atlas · 做代码视频之前先查"用什么库、边界在哪"

> **一句话**：这不是一支片子，而是**代码视频技术选型的百科**：`motion-library-atlas` 是一个独立 Skill，收录 **111 个库/工具**（Remotion、HyperFrames、Motion Canvas、Revideo、GSAP、Three/R3F/drei、Theatre、PixiJS、p5、Paper、Rough、Lottie/Rive/Spine、Manim、D3/Vega/ECharts、Tone/Web Audio/Meyda/MIDI、WebCodecs/Mediabunny/ffmpeg.wasm、Playwright/Puppeteer/CCapture、Blender/USD/glTF、Rapier/Matter/Cannon、MapLibre/Cesium/deck.gl、KaTeX/Mermaid、Pretext/SplitText/ScrambleText、WebGL/WebGPU/TypeGPU/regl/OGL…），每条写清**增加了什么能力、值得尝试的表达（2 个原创实验方向）、能力边界、时间线与输出、组合候选**，并有 17 篇方法论短文和 16 个分类入口。两个 HTML 是它的可视化工作站（28 个 Canvas 原理演示 + 边界图谱）。

| 项 | 值 |
|---|---|
| 原目录 | `skill-代码视频所有绝大部分方式和启迪/`（`code-videos-path.zip` + `VibeMotion-本地版.html` + `VIBEMOTION-workstation.html`） |
| 收录 | 源码 `assets/cases/atlas/`：`motion-library-atlas/`（**完整 Skill**：`SKILL.md`、`scripts/search_atlas.py`、`references/catalog-index.json`、`references/libraries/<id>/{README.md, examples/01.md, examples/02.md}` × 111、`references/knowledge/01–17`、`references/categories/*.md` 16 篇、`published-examples.json`、`external-skills.json`、`research/source-register.json`）· `VIBEMOTION-workstation.html`（2.0 MB 单文件，内含 catalog/knowledge/28 个 demo 源码与 vendor）· `VibeMotion-本地版.html`（178 KB）· `FILES.md` |
| 研究快照 | 2026-09-24；**库的模型成功率、质量分、跨库接入均未实测**（条目自己也这么声明） |

## 什么时候查它

- 用户要的效果**本仓库 30 个案例都没有覆盖**（地图、物理、Lottie/Rive 资产、React 组件动效、WebGPU、Blender、数据图表库、MIDI…）→ 先在这里查候选库和边界。
- 要**决定技术栈**（Remotion vs HyperFrames vs 纯 Canvas vs Three.js vs Python），或要组合两个库、担心时间轴不统一。
- 要理解**"AE 级 / MG"到底在比较什么、节奏不是越快越好、重叠与漏检、定格不只是降帧、声音四种材料**这类方法问题。

## 怎么检索（渐进式披露，别整本读）

```bash
A=assets/cases/atlas/motion-library-atlas
python3 $A/scripts/search_atlas.py "形变 地图"            # 关键词 → 3–6 个候选
python3 $A/scripts/search_atlas.py "穿模" --limit 6
python3 $A/scripts/search_atlas.py --id pretext            # 读某个条目
python3 scripts/casebook.py search "seekable" --case atlas # 也可以用本 casebook 的全文检索
```

然后只读命中的 `references/libraries/<id>/README.md`，需要创意时再读同目录 `examples/01.md`、`02.md`。

## 方法论短文（`motion-library-atlas/references/knowledge/`）

| 文件 | 讲什么 |
|---|---|
| `01-orientation.md` | 先区分能力，再选工具 |
| `02-evidence.md` | 证据等级：别把想象写成实测 |
| `03-motion-meaning.md` | MG 与"AE 级"到底在比较什么 |
| `04-pacing.md` | 节奏：不是越快越好 |
| `05-layout-safety.md` | 重叠、越界与漏检 |
| `06-time-and-render.md` | **统一时间，不必统一所有代码**：直接求值 / 可重放状态 / 预计算状态；从头、跳转、回退三种求值对比验证 |
| `07-virtual-studio.md` | 虚拟摄影棚：先有可信的空间 |
| `08-stop-motion.md` | 定格风格，不只是降帧 |
| `09-reference-reading.md` | 从拉片反查组件 |
| `10-combinations.md` | 组合库之前，先检查接口边界 |
| `11-skills-audit.md` | 阅读现成 Skills，但不盲信 |
| `12-audio.md` | 声音的四种材料 |
| `13-experiments.md` | 逐步摸边界，不先造大基准 |
| `14-retrieval.md` / `15-licensing-and-safety.md` / `16-extend.md` / `17-published-examples.md` | 检索、许可、扩充词典、真实发布案例 |

分类入口 `references/categories/`：audio · canvas · creative · data · export · geo · gpu · physics · playback · studio · three · timeline · type · ui · vector · video。

## 与本 casebook 其他案例的关系

| atlas 条目 | 本仓库里真的用它做过片的案例 |
|---|---|
| hyperframes + gsap | `kimi-beat` |
| three / r3f / postprocessing | `phasegate`、`studysolo`、`moonlamp`、`dingge`、`stopmotion`、`codecosmos`、`f12` |
| playwright / puppeteer（逐帧截图） | 几乎所有浏览器管线案例（见 `references/pipelines.md`） |
| web-audio / tone | `samemoon`、`readclub`、`moon-letter` |
| webgl（原生着色器） | `beyond`、`cosmos30`、`oneink`、`protocom`（post.js）、`shatter` |
| ffmpeg | 全部案例 |
| matplotlib / numpy 逐像素 | `kimi-film`、`ageint`、`gongcishi` |

## 注意

- 条目里的"实验方向"是**原创提案，不是已复现的作品**；工作站里 28 个演示大多是原生 Canvas 原理演示，不是对应库的运行测试。
- 版本、价格、支持矩阵会变：下结论前重新核对官方链接（`research/source-register.json`）。
- `VIBEMOTION-workstation.html` 内嵌约 534 KB base64 媒体；用 `casebook.py search` 检索时已自动忽略长 base64 行。
