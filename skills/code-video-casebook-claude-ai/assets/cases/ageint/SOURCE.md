# ageint · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show ageint <路径>`；还原成真实目录：`python3 scripts/casebook.py copy ageint <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `The_Age_of_Intelligence-source/README.md` | 221 | 42 |
| 2 | `The_Age_of_Intelligence-source/docs/智能时代代码视频复盘.md` | 549 | 268 |
| 3 | `The_Age_of_Intelligence-source/fonts/licenses/DejaVu-LICENSE.txt` | 78 | 822 |
| 4 | `The_Age_of_Intelligence-source/fonts/licenses/anton-OFL.txt` | 93 | 905 |
| 5 | `The_Age_of_Intelligence-source/fonts/licenses/bebas-neue-OFL.txt` | 93 | 1003 |
| 6 | `The_Age_of_Intelligence-source/fonts/licenses/inter-OFL.txt` | 93 | 1101 |
| 7 | `The_Age_of_Intelligence-source/fonts/licenses/jetbrains-mono-OFL.txt` | 93 | 1199 |
| 8 | `The_Age_of_Intelligence-source/fonts/licenses/noto-sans-sc-OFL.txt` | 93 | 1297 |
| 9 | `The_Age_of_Intelligence-source/fonts/licenses/space-grotesk-OFL.txt` | 93 | 1395 |
| 10 | `The_Age_of_Intelligence-source/fonts/licenses/unbounded-OFL.txt` | 93 | 1493 |
| 11 | `The_Age_of_Intelligence-source/package.json` | 22 | 1591 |
| 12 | `The_Age_of_Intelligence-source/requirements.txt` | 8 | 1618 |
| 13 | `The_Age_of_Intelligence-source/scripts/build_fonts.py` | 70 | 1631 |
| 14 | `The_Age_of_Intelligence-source/scripts/encode.sh` | 19 | 1706 |
| 15 | `The_Age_of_Intelligence-source/scripts/qa.sh` | 13 | 1730 |
| 16 | `The_Age_of_Intelligence-source/scripts/render_all.sh` | 30 | 1748 |
| 17 | `The_Age_of_Intelligence-source/scripts/stills.sh` | 8 | 1783 |
| 18 | `The_Age_of_Intelligence-source/src/core.py` | 596 | 1796 |
| 19 | `The_Age_of_Intelligence-source/src/cut_sheets.py` | 26 | 2397 |
| 20 | `The_Age_of_Intelligence-source/src/make_srt.py` | 15 | 2428 |
| 21 | `The_Age_of_Intelligence-source/src/music.py` | 755 | 2448 |
| 22 | `The_Age_of_Intelligence-source/src/qa_frames.py` | 14 | 3208 |
| 23 | `The_Age_of_Intelligence-source/src/render.py` | 202 | 3227 |
| 24 | `The_Age_of_Intelligence-source/src/scenes.py` | 843 | 3434 |
| 25 | `The_Age_of_Intelligence-source/src/scenes2.py` | 750 | 4282 |
| 26 | `The_Age_of_Intelligence-source/src/scenes3.py` | 741 | 5037 |
| 27 | `The_Age_of_Intelligence-source/src/sheet.py` | 13 | 5783 |
| 28 | `The_Age_of_Intelligence-source/src/smoke.py` | 8 | 5801 |
| 29 | `The_Age_of_Intelligence-source/src/timeline.py` | 259 | 5814 |
| 30 | `The_Age_of_Intelligence-source/subtitles/AGE_OF_INTELLIGENCE_subtitles.srt` | 139 | 6078 |

---

### 1/30 · `The_Age_of_Intelligence-source/README.md`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/README.md", "lines": 221, "final_newline": true, "sha256": "f42a8cf97b471ff479bd00bdc06ee44346c174aacf9d722ab7d0bc372193d427", "original_sha256": "f42a8cf97b471ff479bd00bdc06ee44346c174aacf9d722ab7d0bc372193d427"} -->
````markdown
# The Age of Intelligence｜智能时代 · 完整源码

这是一支 92.4 秒 AI 主题卡点视频的全部源码（1920×1080，60 fps，5544 帧，原创配乐，中英双语字幕）。
画面、3D、动效、配乐、音效、字幕全部由代码生成，没有用任何外部视频、图片或音频素材。

> **注意：技术栈是 Python，不是 HTML/JS。**
> 这个项目没有网页场景，也没有浏览器录屏。每一帧都用 numpy、OpenCV、Pillow 在内存里直接画出来，再通过管道逐帧送给 ffmpeg 编码。
> npm 只用来下载字体，所以 `package.json` 里只有字体依赖。

---

## 目录结构

```
The_Age_of_Intelligence-source/
├── README.md                  本文件
├── requirements.txt           Python 依赖（锁定为渲染时的版本）
├── package.json               npm 字体依赖（@fontsource/*），并提供 npm run 快捷命令
├── src/
│   ├── timeline.py            ★ 唯一的“真相源”：BPM、段落、108 个镜头、字幕、音效触发点、路径设置
│   ├── music.py               合成配乐和全部音效 → build/master.wav 和 build/audio_analysis.json
│   ├── core.py                渲染核心：字体与逐字回退、文字遮罩、合成、3D 相机、柔光点云、线条、bloom 等后期效果
│   ├── render.py              单帧管线：场景 → 节拍驱动特效 → 后期 → HUD 和字幕 → 通过管道送给 ffmpeg；另有 --stills 预览模式
│   ├── scenes.py              场景注册与公共工具；序章、起源段（1950–2022）、build1
│   ├── scenes2.py             drop1（token、embedding、attention、预测）和 break（规模）
│   ├── scenes3.py             build2、drop2（各项能力）、switch-up、结尾
│   ├── smoke.py               冒烟测试：每个镜头渲首帧、中帧、尾帧
│   ├── qa_frames.py           空白帧检查：每个镜头开头的亮像素比例须不低于 3%
│   ├── sheet.py               把静帧拼成对照表
│   ├── make_srt.py            [补全] 从 timeline.SUBS 生成双语 SRT
│   └── cut_sheets.py          [补全] 从成片抽出每个切点后第 2 帧，拼成 16 宫格质检图
├── scripts/
│   ├── build_fonts.py         [补全] 从 node_modules/@fontsource 重建 fonts/*.ttf（含思源黑体 102 个分包的合并）
│   ├── render_all.sh          [补全] 校验 → 配乐 → 冒烟测试 → 空白帧检查 → 多进程分段渲染
│   ├── encode.sh              [补全] 拼接、混流出 1080p60 母版 → 30 MB 以内的 720p60 分享版 → SRT
│   ├── qa.sh                  [补全] 核对帧数和时长、扫描黑帧/冻结/静音、测响度、生成切点对照表
│   └── stills.sh              [补全] 只渲几张单帧预览，不渲整片
├── fonts/                     已经构建好的 TTF，开箱即用（另附 licenses/）
│   ├── anton.ttf  bebas.ttf  grotesk{400,500,700}.ttf  mono{400,700,800}.ttf
│   ├── inter{300,400,600,800,900}.ttf  unbounded{800,900}.ttf
│   ├── notosc{500,700,900}.ttf        合并后的思源黑体（每个字重 13,655 字）
│   ├── DejaVuSans.ttf                 符号回退字体（→ ≈ Σ ✓ ½ ᵢ 等）
│   └── licenses/                      SIL OFL 1.1 协议 ×7，DejaVu 协议
├── subtitles/
│   └── AGE_OF_INTELLIGENCE_subtitles.srt   双语字幕（成片交付的那一份）
└── docs/
    └── 智能时代代码视频复盘.md             完整复盘：思路、实现、踩坑、模板
```

所有输出都写进 `build/`，第一次运行时会自动创建。可以用环境变量 `AOI_BUILD` 改到别的位置。

---

## 环境要求

| 项目 | 要求 |
|---|---|
| 系统 | Linux 或 macOS（在 Ubuntu 上测过）；Windows 建议用 WSL2 |
| Python | 3.11（测过），3.10 以上一般都可以 |
| ffmpeg | 6.x，需要 libx264 和 aac（在 6.1.1 上测过） |
| CPU / 内存 | 至少 2 核；内存 4 GB 以上（渲染每个进程约 1–1.5 GB） |
| 磁盘 | 约 2 GB（中间文件约 870 MB，母版约 330 MB） |
| Node / npm | **只有想从源头重建字体时才需要**（在 Node 22、npm 10 上测过）；fonts/ 里已经有构建好的字体 |
| GPU | 不需要 |

---

## 安装

```bash
cd The_Age_of_Intelligence-source
python3 -m venv .venv && source .venv/bin/activate      # 可选
pip install -r requirements.txt
ffmpeg -version | head -1                                # 确认有 ffmpeg
```

（可选）从 npm 重新构建字体。fonts/ 里已经有构建好的文件，一般可以跳过：

```bash
npm install                      # 下载 @fontsource/*（思源黑体约 70 MB）
python3 scripts/build_fonts.py   # 约 10 秒；输出与附带字体的渲染结果逐像素一致
```

---

## 从零渲染出成片

一共三条命令：

```bash
JOBS=2 bash scripts/render_all.sh   # 配乐 + 自检 + 分段渲染（2 核机器约 30 分钟）
bash scripts/encode.sh              # 母版 + 分享版 + SRT（约 20 分钟）
bash scripts/qa.sh                  # 交付前质检
```

也可以用 `npm run all` 一次跑完。

产出文件：

| 文件 | 说明 |
|---|---|
| `build/master.wav` | 配乐和音效（48 kHz 立体声，92.4 秒） |
| `build/audio_analysis.json` | kick 时间点、每帧 RMS，供画面卡点使用 |
| `build/seg*.mp4` | 中间分段（CRF 12） |
| `build/AGE_OF_INTELLIGENCE_1080p60.mp4` | 交付母版（CRF 18，AAC 320k，约 330 MB） |
| `build/AGE_OF_INTELLIGENCE_720p60_share.mp4` | 分享版（两遍编码，2350 kbps，约 28 MB） |
| `build/AGE_OF_INTELLIGENCE_subtitles.srt` | 双语字幕 |
| `build/cutsheet*.png`、`build/*_qa.txt` | 质检产物 |

### 逐步执行（等价于上面的脚本）

```bash
python3 src/timeline.py        # 检查镜头无空隙、无重叠，切点都在整数帧上
python3 src/music.py           # 约 12 秒，生成 build/master.wav 和 audio_analysis.json
python3 src/smoke.py           # 约 2 分钟，324 帧不报错才继续
python3 src/qa_frames.py       # 约 3 分钟，应输出 flagged ≤ 1（speech_wave 首帧 2.97%，内容可见，属正常）
python3 src/render.py --start 0    --end 2772 --out build/seg0.mp4 &
python3 src/render.py --start 2772 --end 5544 --out build/seg1.mp4 &
wait
printf "file 'seg0.mp4'\nfile 'seg1.mp4'\n" > build/list.txt
bash scripts/encode.sh
```

### 常用开关

| 变量 | 作用 |
|---|---|
| `JOBS=4` | 并行渲染进程数，按 CPU 核数设置 |
| `AOI_BUILD=/path` | 输出目录（默认是 `./build`） |
| `AOI_FRAMES=120` | 只渲前 N 帧，用来快速试跑整条流程（约 1 分钟） |
| `SKIP_CHECKS=1` | 跳过冒烟测试和空白帧检查 |

### 只预览几帧

```bash
bash scripts/stills.sh b64.3,b100,b138      # 参数是拍号（b 开头）或帧号
# 输出 build/stills/*.png，以及半分辨率对照表 build/sheet.png
```

### 改片子从哪里下手

- **改镜头顺序、时长、文字、字幕、音效触发点**：只改 `src/timeline.py`。时间单位是“拍”，1 拍 = 28 帧 = 0.4667 秒。改完先运行 `python3 src/timeline.py` 做校验。
- **改某个画面**：到 `scenes*.py` 里找同名函数（用 `@scene` 注册）。
- **改音乐**：在 `src/music.py` 里改；编曲部分按拍写，和声是 Fm–D♭–A♭–E♭，主旋律是 `HOOK`。
- **改全局质感**：`src/render.py` 里 `render_frame` 的 `ctx.post` 默认值，以及自动节拍特效的参数。

---

## 渲染耗时参考

测试环境为 2 核、7 GB 内存、无 GPU：

- 单进程约 0.3 秒/帧。两个进程并行时，每个进程约 0.55 秒/帧，因为 x264 编码也在抢 CPU。整片约 26 分钟。
- 编码母版（`-preset medium`）约 11 分钟；分享版两遍编码约 7 分钟。
- 核数越多越快，设置 `JOBS` 等于核数即可。

---

## 可复现性验证

这份源码包在一个全新目录里做过以下验证：

| 检查项 | 结果 |
|---|---|
| `build/master.wav` 的 MD5 | `e67645df35dfcf1695e82c6562354720`，与成片使用的音频逐字节一致（随机数种子固定） |
| `audio_analysis.json` 的 MD5 | `57606297ec4c3a8853762d6c8abb93b8`，一致 |
| 抽样 7 帧（b4、b30、b64.3、b100、b138、b161.2、b188） | 与原始工程渲染结果逐像素一致（最大差值 0） |
| 用 `scripts/build_fonts.py` 重建字体后的渲染（含中文结尾卡） | 逐像素一致；字体文件本身的 MD5 不同，因为 head 表里有时间戳 |
| `render_all.sh → encode.sh → qa.sh` 用 120 帧试跑 | 全部通过；生成的 SRT 与附带的 SRT 完全相同 |
| 当时交付的成片 | 5544 帧；音频和视频都是 92.400 秒；黑帧、冻结、静音检测都是 0；-9.2 LUFS，峰值 -0.8 dBFS |

---

## 哪些是原件，哪些是补全的

**原件**：制作时实际运行的文件，只做了下面“打包时的修改”一节列出的路径改动。

- `src/timeline.py`、`music.py`、`core.py`、`render.py`
- `src/scenes.py`、`scenes2.py`、`scenes3.py`
- `src/smoke.py`、`qa_frames.py`、`sheet.py`
- `fonts/*.ttf`（制作时实际使用的字体文件）
- `subtitles/*.srt`、`docs/*.md`

**补全**：制作时这些步骤是在终端里直接敲命令或写临时脚本完成的，没有保存成文件。打包时按当时的实现整理成了脚本，并验证过输出一致。

| 文件 | 来源 |
|---|---|
| `scripts/build_fonts.py` | 当时的两段内联脚本：woff 转 ttf，以及思源黑体分包合并。合并逻辑与当时一致；输入改为从 `node_modules/@fontsource` 读取，当时是用 `npm pack` 解压到 fonts_dl/ |
| `scripts/render_all.sh`、`encode.sh`、`qa.sh`、`stills.sh` | 当时手动执行的命令序列，参数完全相同 |
| `src/make_srt.py`、`src/cut_sheets.py` | 当时的内联代码片段 |
| `requirements.txt`、`package.json` | 按当时环境里的实际版本整理 |
| `fonts/DejaVuSans.ttf` 和 `fonts/licenses/` | 当时直接引用系统里的 DejaVu 和 npm 包里的 LICENSE，打包时复制进来 |

**打包时对原件的修改**（只改路径，不改任何逻辑，渲染结果逐像素一致）：

- `timeline.py`：新增 `ROOT`、`FONT_DIR`、`BUILD` 三个路径常量。
- `core.py`：字体目录原本写死为 `/home/claude/av/fonts/`，改为 `FONT_DIR`；DejaVu 原本引用 `/usr/share/fonts/...`，改为 `fonts/DejaVuSans.ttf`。
- `render.py`：`audio_analysis.json`、`--stills` 的输出、`--out` 的默认值都改到 `BUILD` 目录下。
- `music.py`：`master.wav` 和 `audio_analysis.json` 改为输出到 `BUILD`。
- `smoke.py`：只加了一行说明文字。

---

## 没有包含的内容

- 成片 MP4、中间分段、`master.wav`：都可以用上面的命令重新生成，而且完全确定。
- `node_modules/`：只在重建字体时需要，用 `npm install` 即可恢复。
- 制作过程中的临时静帧和对照表。

---

## 字体协议

- Anton、Bebas Neue、Inter、JetBrains Mono、Noto Sans SC（思源黑体）、Space Grotesk、Unbounded 都是 SIL Open Font License 1.1，协议全文见 `fonts/licenses/*-OFL.txt`。其中 `notosc*.ttf` 是把官方分包合并后的衍生文件，同样遵循 OFL。
- DejaVu Sans 使用 Bitstream Vera / DejaVu 协议，见 `fonts/licenses/DejaVu-LICENSE.txt`。

## 片中事实的来源

- 训练算力年增长 4–5 倍：Epoch AI，[Training compute of frontier AI models grows by 4-5x per year](https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year)
- 其余为公开史实：AlexNet 的 ImageNet 前五错误率 15.3%，第二名 26.2%；GPT-3 有 1750 亿参数；AlphaFold 数据库收录 2 亿多个结构；2024 年诺贝尔物理学奖和化学奖。
- 下一个词的概率条和蛋白质的折叠形态只是示意，画面上已标注“ILLUSTRATIVE”。
````

### 2/30 · `The_Age_of_Intelligence-source/docs/智能时代代码视频复盘.md`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/docs/智能时代代码视频复盘.md", "lines": 549, "final_newline": true, "sha256": "f777bf10454140686f1123f3c2ba4c96ca9bf58fa2c2c7f1382b31f9e2dbfc82", "original_sha256": "f777bf10454140686f1123f3c2ba4c96ca9bf58fa2c2c7f1382b31f9e2dbfc82"} -->
````markdown
# 《The Age of Intelligence｜智能时代》代码视频复盘

> 这份复盘记录的是一支纯代码生成的 AI 主题卡点混剪，从接到需求到交付 MP4 的全过程。
> 下面的内容都来自这次实际发生的事：参数、命令、报错和修复方法都是真实的，可以直接照搬。

---

## 0. 项目档案（一眼看懂这次做了什么）

| 项目 | 数值 |
|---|---|
| 成片 | 92.4 秒，1920×1080，60 fps，5544 帧，H.264 + AAC |
| 结构 | 8 个段落，108 个镜头，46 个场景函数，两次 drop |
| 节拍 | 128.571 BPM（每拍正好 28 帧、22400 个采样点），48 小节音乐加 6 拍尾帧 |
| 音乐 | 用 numpy/scipy 从零合成的原创 F 小调 EDM，和弦是 Fm–D♭–A♭–E♭；音效同样全部合成 |
| 字幕 | 中英双语硬字幕 28 条，另附 .srt |
| 代码量 | 约 4170 行 Python（timeline 251、music 754、core 595、render 200、scenes 843+750+741，另有质检脚本） |
| 运行环境 | 云端 Linux 容器，2 核 CPU、7 GB 内存，无 GPU；网络只能访问软件包仓库 |
| 交付物 | 1080p60 母版 332 MiB（CRF 18），720p60 分享版 27.8 MiB（两遍编码），双语 SRT |
| 总耗时 | 约 3 小时 10 分钟（03:27 → 06:36），其中约 60% 在等渲染和编码 |
| 质检结果 | blackdetect、freezedetect、silencedetect 全部为 0；帧数 5544，音频和视频都是 92.400 秒；-9.2 LUFS，峰值 -0.8 dBFS |

---

## 一、创作思路

### 1. 需求如何拆成叙事结构

**需求里的关键词**：AI 主题、有价值的内容、顶级 AE/MG 水准、3D、代码驱动动画、卡点、音效、字幕、1–5 分钟、高能快节奏，而且不能有黑帧或重叠帧。

**叙事主线用一个问题串起来**。开头是图灵 1950 年的提问“Can machines think?”，结尾把它改写成“What will you build?”。首尾是同一个终端界面，打字动作也一样，形成呼应。中间依次是：历史、原理、规模、能力。
- 这样“有价值”就落到了实处：观众看完能知道 AI 的关键里程碑，知道大模型的四步工作原理（token、向量、注意力、逐个预测下一个 token），也知道今天的 AI 能做什么。
- 片长定为 92 秒，理由有三：五个章节刚好讲完；卡点混剪超过 2 分钟后观众的注意力会明显下降；每帧大约 0.3 秒的渲染成本也决定了片子不能太长（每多 1 分钟，渲染就多约 18 分钟）。

**段落、时间、情绪一一对应**（1 拍 = 0.4667 秒，1 小节 = 1.867 秒）：

| 段落 | 拍 | 时间 | 能量（实测 RMS） | 内容 | 平均剪辑间隔 |
|---|---|---|---|---|---|
| intro 序章 | 0–16 | 0–7.5 s | -16.4 dB，最安静 | 终端打出“Can machines think?”，接 1950 大字 | 8 拍 |
| verse 起源 | 16–48 | 7.5–22.4 s | -9.5 dB | 1956→2022 的里程碑，每小节一个 | 4 拍，镜头内还有“年份砸入” |
| build1 蓄力 | 48–64 | 22.4–29.9 s | -9.1 dB，逐渐上升 | 2022 聊天界面，接隧道大字 “IT READS / WRITES…”，再接 “BUT HOW DOES IT REALLY THINK” | 4 → 2 → 1 → ½ 拍逐步加速 |
| gap 静拍 | 63–64 | 0.47 s | 接近静音 | “HOW DOES IT THINK?”定格 | 1 拍 |
| drop1 原理 | 64–96 | 29.9–44.8 s | -8.0 dB | 大模型四步：token、embedding、attention、预测 | 2–4 拍，镜头内按拍有事件 |
| break 规模 | 96–112 | 44.8–52.3 s | -10.6 dB，喘口气 | 神经球体 “SCALE”，接算力对数曲线 | 8 拍 |
| build2 转折 | 112–128 | 52.3–59.7 s | -9.1 dB | “THE QUESTION HAS CHANGED”，旧问题被划掉，再接逐词快闪 | 4 → 1 → ½ → ¼ 拍 |
| gap 静拍 | 127–128 | 0.47 s | 接近静音 | “WHAT CAN IT DO?”定格 | 1 拍 |
| drop2 能力 | 128–176 | 59.7–82.1 s | -7.6 dB，最响 | 写代码、测试、视觉、语音、蛋白质、诺奖、扩散模型、智能体、全球，接 16 个动词快闪、年份回顾、“YOU”频闪 | 2–4 拍，然后 ½ → 1 → ¼ 拍 |
| outro 回答 | 176–198 | 82.1–92.4 s | -9.9 dB | 终端里划掉旧问题、打出新问题，接结尾卡 | 8 拍，最后停住 14 拍 |

能量曲线的设计原则是：**两次“蓄力 → 静一拍 → 爆发”，第二次比第一次更响、更快**。另外 break 必须真正降下来，否则第二个 drop 就不会有冲击感。这一点用分段 RMS 实测过，之前 break 和 drop1 一样响，后来专门修正了。

### 2. 各段落和场景的设计意图

- **开场（terminal_intro）**：一个终端光标，用打字的方式提出问题，只用最少的元素把悬念立起来。背景是一个很淡的神经球体（亮度 0.32）加星空，这样第 0 帧就有内容，不会是黑屏，同时也为结尾埋了伏笔。第一版这里前 0.67 秒几乎全黑，被质检判为黑帧。
- **1950**：巨大的描边数字，从下往上扫描填充，4 层描边随每拍一起脉动。结尾 3 拍让 9000 个粒子炸散，接着第 16 拍的第一个鼓点，由静转动。
- **起源段**：每小节一个里程碑，用同一套“年份砸入 → 飞进左上角”的动作统一节奏。年份在第 0 拍砸到画面中央，同时背景压暗 72%；0.42 拍时开始飞，0.95 拍到达角标位置。每个场景的视觉语言都和它讲的技术对应：
  - 1956 年：点云聚合成 “AI” 两个字，象征一个学科从概念中诞生。
  - 1958 年：感知机，用单个神经元的 MG 图解，外加阶跃函数。
  - 1986 年：多层网络，先是青色的前向传播，再是品红色的梯度反向传播，LOSS 数值从 2.31 降到 0.07。
  - 1997 年：3D 国际象棋棋盘，棋子按拍移动。
  - 2012 年：图像网格加错误率柱状图（26.2% 对比 15.3%）。
  - 2016 年：3D 围棋盘，标出第 37 手。
  - 2017 年：标题逐词翻转出现，下方配注意力弧线。
  - 2020 年：数字滚动到 1750 亿，旁边是 3D 点阵立方体，外加 GPT-2 与 GPT-3 的参数量对比条。
  - 2022 年：通用聊天界面（不模仿任何品牌），加用户数计数器和增长曲线。
- **build1**：使用连续隧道。隧道的前进距离由全局拍号计算，而不是由单个镜头的时间计算，所以虽然每半拍就切一次字，隧道运动却是连贯的，看起来像一个一路加速的镜头。快切的镜头隔一个反色一次，并叠加故障效果。
- **gap（第 63、127 拍）**：音乐做磁带停顿（tape stop）然后静音，画面只留一句问题，加一条倒计时进度线。这样的“缺席”让后面的 drop 显得更重。
- **drop1 原理**：每一步左上角都有 “01 TOKENIZATION”这样的编号。每一步先用一张图讲清楚，再在同一步里换机位或换形式：
  - token：句子拆成彩色方块，再显示 ID。
  - embedding：3D 词向量空间，先环绕，再推近 royalty 簇，最后演示 king − man + woman ≈ queen。
  - attention：“it”连向句中所有词的弧线，接 3D 注意力柱状矩阵，再接 12 个注意力头。
  - 预测：概率条，接 3D 网络层穿梭，最后用 4 个每拍一镜的“STEP 1–4”自回归镜头收尾。
- **break**：色彩、速度、镜头都慢下来。神经球体慢慢旋转，然后是算力对数图，从 AlexNet 画到 GPT-3，标注“4–5× PER YEAR”，来源 Epoch AI。
- **build2**：换成合成波风格的透视网格地面，形成新章节的视觉区隔。旧问题被一条品红线划掉，然后逐词快闪 “NOT / “CAN IT / THINK?” / BUT / WHAT CAN IT DO”，最后是 4 个 ¼ 拍的图标闪切：代码、眼睛、DNA、地球。
- **drop2 能力**：统一的大标题模板（“IT WRITES CODE”，编号 “04 · CAPABILITIES”），每 2–4 拍换一种能力，每种能力的画面形式都不同：编辑器、终端、3D 线框城市加检测框、声波、蛋白质链、金色诺奖环、扩散模型去噪、智能体流程环、带航线的地球。之后进入 switch-up：16 个动词每半拍一个，背景在四种之间轮换；然后是年份回顾（1950/1986/2017/NOW）；最后 16 个 ¼ 拍的“? → YOU”频闪，把焦点推到观众身上。
- **结尾**：第 176 拍的冲击点回到开头的终端，划掉旧问题，打出新问题；第 184 拍进入结尾卡，英文大标题加中文大字，背景是神经球体。最后 2.5 拍画面只压暗 30%，不黑场，避免结尾出现空白帧。

### 3. 节奏、剪辑和音画配合的技巧

1. **把 BPM 设成整数帧**：BPM = 60 × 60 / 28 = 128.571，每拍正好 28 帧。所有切点、字幕、音效、typing 都用“拍”来定义，换算到帧和采样点都是整数，完全没有取整漂移。
2. **切点入场冲击**：每次切镜的前 3–4 帧，画面放大 5%（按 exp(-帧数/3.5) 衰减），同时有 7 px 的色差（按 exp(-帧数/4) 衰减）。这样硬切就像被打了一拳。
3. **鼓点驱动镜头**：从音乐生成器导出每个 kick 的时间点（audio_analysis.json），画面按 `kick_env = exp(-dt/0.09)` 做缩放脉冲（drop 段 2.8%，verse 段 1.2%）。
4. **drop 冲击四件套**：白闪 0.75（按 exp(-t/0.09) 衰减），抖动 16 px，色差 14 px，径向模糊 0.05，同时配合冲击音效（sub boom 加噪声），用在第 64、128、176、184 拍。
5. **剪辑密度加速**：build 段的剪辑间隔依次是 4、2、1、½、¼ 拍，同一时间军鼓连击也从 4 分音符加快到 32 分音符。画面和声音的密度同步上升。
6. **静拍反差**：drop 前留一整拍几乎静音，只放一个反向吸气音效（倒放的冲击声，在 drop 下拍前 4 ms 硬停），画面定格一句问题。
7. **跨快切保持运动连续**：隧道、网格地面、星空这些背景用全局拍号驱动，而不是镜头内时间，所以快切时视觉惯性不会断。
8. **信息分三层、按不同节奏走**：大字每拍或每两拍换一次（第一眼读到的）；场景标签每 2–4 拍换一次；字幕按章节节奏每 1–2 小节换一次（叙事层）。字幕不跟着剪辑频率走，否则根本读不完。
9. **音效和画面同源**：打字音效和画面上的打字共用同一组常量（起始拍、每拍字数）。每个里程碑小节的下拍有 data_hit，年份起飞时有 whoosh，快切时有 swish 或 glitch，测试通过时有 chime，诺奖出现时有 shimmer。
10. **母题重复**：终端、神经球体和编号系统（01–04）在全片反复出现，混剪虽然快，却不会显得散。
11. **光敏安全**：全屏反色控制在每秒 3 次以下（这是 WCAG 2.3.1 的标准），频闪段改用缩放、旋转、色差来替代反色。

---

## 二、具体的创作方式

### 1. 技术栈与完整工作流

**技术栈**（没有用 AE、Blender 或 GPU）：
- Python 3，numpy 2.4，scipy 1.17（`signal.lfilter/butter/sosfilt/fftconvolve`，`ndimage.maximum_filter1d`）
- OpenCV 4.13：所有绘图都开 `LINE_AA` 抗锯齿，并用 `shift=4` 取得亚像素精度；另外用到 `warpAffine`、`warpPerspective`、`GaussianBlur`、`resize`
- Pillow 12.2：把文字渲染成遮罩
- fontTools + brotli：woff 转 ttf，合并中文字体分包
- npm：下载 @fontsource 的字体包（这个环境唯一能用的字体来源）
- ffmpeg 6.1：libx264、aac，以及 blackdetect、freezedetect、silencedetect、ebur128、showspectrumpic

**工作流**（实际的执行顺序）：
1. **探测环境**：`nproc`、`free -g`、ffmpeg 版本、Python 库版本、`fc-list`，再测一下能访问哪些网站。
2. **准备字体**：用 npm pack 下载 fontsource 包，转成 TTF，并合并中文分包。
3. **写 `timeline.py`**：定义节拍常量、段落、镜头表、字幕表、音效表，再用 `validate()` 检查镜头之间有没有空隙或重叠、每个切点是否落在整数帧上。
4. **写 `music.py`**：输出 `master.wav` 和 `audio_analysis.json`（kick 时间点、每帧 RMS 和低频 RMS）。
5. **客观检查音频**：分段、分频段测 RMS（sub、60–250 Hz、250 Hz–2 kHz、2–8 kHz、8 kHz 以上），各音轨单独测，再看频谱图，然后反复调整混音。
6. **写渲染核心 `core.py`**：文字、合成、3D、点云、后期效果。
7. **写 `render.py`**：逐帧分发给场景函数，然后做自动节拍特效、后期、HUD、字幕，最后把帧通过管道送进 ffmpeg。
8. **分三批写场景**（scenes / scenes2 / scenes3）。每写完一批就用 `--stills` 渲 6–18 张半分辨率静帧，拼成 2×3 的对照表，用眼睛检查后再修改。
9. **冒烟测试**（`smoke.py`）：每个镜头渲首帧、中帧、尾帧，共 324 帧，确认没有任何报错才开始全片渲染。
10. **全片渲染**：两个进程各渲一半，分别写成 CRF 12 的中间文件。
11. **拼接和混流**：用 concat 拼接，再编码成交付母版。
12. **质检**：用 ffmpeg 滤镜扫描黑帧、冻结和静音；抽出每个镜头第 2 帧，拼成 16 宫格对照表逐张检查；再用 `qa_frames.py` 在渲染前检查每个镜头的开头是否空白。
13. **修复后重渲**：这次一共全片渲染了 3 次。
14. **导出交付**：CRF 18 的母版，加一个低于 30 MB 的两遍编码分享版，外加 SRT。

### 2. 项目结构与关键代码

```
av/
├── fonts/               # 转换后的 TTF（含合并后的 notosc500/700/900.ttf）
├── timeline.py          # 唯一的“真相源”：节拍、镜头、字幕、音效
├── music.py             # 合成配乐和音效，输出 master.wav 和 audio_analysis.json
├── core.py              # 文字、合成、3D 相机、点云、线条、后期
├── render.py            # 单帧渲染管线、HUD、字幕、ffmpeg 管道
├── scenes.py            # 注册器、公共工具、序章、起源段、build1
├── scenes2.py           # drop1（原理）和 break（规模）
├── scenes3.py           # build2、drop2、switch-up、结尾
├── smoke.py             # 冒烟测试
├── qa_frames.py         # 渲染前的“空白帧”检查
├── sheet.py             # 静帧对照表
└── out/                 # 分段文件、成片、SRT、质检日志
```

**(a) 时间线：一切从拍号出发**

```python
FPS, SR = 60, 48000
FPB, SPB = 28, 22400            # 每拍的帧数 / 采样数
BPM = 60.0 * FPS / FPB          # 128.5714
BEAT = FPB / FPS                # 0.46667 s
END_BEAT = 198; N_FRAMES = END_BEAT * FPB   # 5544

S = []
def shot(b0, b1, scene, **kw): S.append(dict(b0=b0, b1=b1, scene=scene, **kw))
shot(16, 20, 'ai_points', year='1956')
for i, wd in enumerate(['BUT','HOW','DOES','IT','REALLY','THINK']):
    shot(60 + i*0.5, 60.5 + i*0.5, 'tunnel_word', word=wd, hue=i % 3, fast=True)

def validate():                 # 无空隙、无重叠、所有切点都在整数帧上
    t = 0
    for s in SHOTS:
        assert abs(s['b0'] - t) < 1e-9
        f0, f1 = s['b0']*FPB, s['b1']*FPB
        assert abs(f0-round(f0)) < 1e-9 and abs(f1-round(f1)) < 1e-9
        t = s['b1']
    assert abs(t - END_BEAT) < 1e-9
```
字幕 `SUBS=[(b0,b1,en,zh)]` 和音效 `SFX=[(beat,kind,params)]` 也写在同一个文件里。`music.py` 直接 `import timeline` 来生成音效，所以音画不可能错位。

**(b) 单帧管线（render.py 的核心，精简版）**

```python
def render_frame(f):
    b = f / FPB; si, shot = find_shot(f)
    ctx.tb = b - shot['b0']; ctx.t = ctx.tb*BEAT; ctx.p = ctx.tb/(shot['b1']-shot['b0'])
    ctx.kick = kick_env(b)                      # 由音乐导出的 kick 时间点计算
    ctx.post = dict(punch=0, shake=0, ca=0, flash=0, bloom=.85, thr=.55,
                    glitch=0, invert=False, rblur=0, hud=1, rot=0, grain=.026)
    ctx.cv = BG_MAIN.copy()                      # float32 RGB 画布，取值 0..1
    SCENES[shot['scene']](ctx)                   # 场景可以改写 ctx.post
    fl = ctx.tb * FPB                            # 距离上次切镜的帧数
    if energetic: P['punch'] += .028*ctx.kick + .05*exp(-fl/3.5); P['ca'] += 7*exp(-fl/4)
    for ib in IMPACTS: ...                       # 白闪、抖动、色差、径向模糊
    bloom(cv); radial_blur; glitch_slices; zoom_frame(BORDER_REFLECT101); chroma
    invert?; flash; cv *= VIGNETTE; tonemap; cv += GRAIN[f%6]*P['grain']
    draw_hud(); draw_year_fly(); draw_subs()     # 文字层放在后期之后，保持清晰
    return (clip(cv)*255+.5).astype(uint8)
```
要点：**画面层先过后期，文字层（HUD、字幕、飞行中的年份）最后画**，不受缩放、色差、故障效果影响。

**(c) 3D 相机（注意手性，见踩坑第 4 条）**

```python
class Cam:
    def __init__(self, pos, target, fov=50, up=(0,1,0), roll=0, cx=W/2, cy=H/2):
        f = normalize(target - pos)
        r = normalize(np.cross(up, f))          # 注意是 cross(up, f)；反过来画面会左右镜像
        u = np.cross(f, r)
        self.R = np.stack([r, -u, f])           # 相机坐标：x 向右，y 向下，z 向前
        self.f = (H/2) / tan(radians(fov)/2)
    def project(self, P):
        Pc = (P - self.pos) @ self.R.T; z = Pc[:,2]
        return np.stack([cx + f*Pc[:,0]/z, cy + f*Pc[:,1]/z], 1), z
```

**(d) 柔光点云（大量粒子不暗、也不慢的关键）**

```python
def splat(canvas, xy, color, w, soft=0.85, gain=2.2):
    # 只在点云的包围盒内分配图层；用 np.bincount 做双线性累加（比 np.add.at 快）
    layer = zeros((bh, bw, 3))
    for dx, dy, wt in 4 个双线性角:
        idx = (y0+dy)*bw + (x0+dx)
        for c in range(3):
            layer.reshape(-1,3)[:,c] += np.bincount(idx, weights=col[:,c]*wt, minlength=bw*bh)
    layer = cv2.GaussianBlur(layer, (5,5), soft) * gain   # 每个点变成约 3 px 的柔光
    canvas[by0:by1, bx0:bx1] += layer
```

**(e) 字形逐字回退（中英混排、符号不再出现方框）**

```python
def text_mask(text, fkey, size, tracking=0, cjk_key=None):
    for ch in text:
        if ch == ' ' or has_glyph(fkey, ch): ff = font(fkey, size)      # 用 fontTools 读 cmap 判断
        elif is_cjk(ch):                     ff = font(cjk_key or 'sc7', size)
        elif has_glyph('dejavu', ch):        ff = font('dejavu', size*0.92)  # → ≈ Σ ✓ ½ ᵢ
        else:                                ff = font('sc7', size)
    # 回退字体按各自的 ascent 对齐基线：y = pad + asc_main - asc_fallback
```

**(f) 年份“砸入后飞入角标”**：两个阶段共用一个中心坐标插值，避免锚点切换时画面跳一下。

```python
p1 = e_out5(tb/0.12); fly = e_io3(ramp(tb, 0.42, 0.95))
sc = lerp(lerp(1.35, 1.0, p1), 64/360, fly)
x  = lerp(W/2, 80 + textwidth*(64/360)/2, fly); y = lerp(H/2, 128, fly)
dimmer(cv, 0.72*(1-fly))                          # 砸入时把背景压暗
```

### 3. 各种视觉风格的代码实现

| 风格 | 实现方式 |
|---|---|
| 动态文字 | `char_layout` 求出每个字的中心，每个字单独加动画，有 rise（上升）、slam（放大砸入）、scramble（随机字符后定格）、spin（Y 方向从 0 翻开）四种；字距用 em 单位 |
| 描边与发光文字 | 文字遮罩膨胀后减去原遮罩得到描边；多层描边按拍脉动；大字下垫一层高斯模糊的黑影提高对比度 |
| 文字点云 | 在文字遮罩中取 alpha>0.5 的像素（42000 个），z 方向随机散开；每个点带随机延迟，从 3D 随机位置 `1-(1-k)^4` 收拢；**注意 y 轴要取负** |
| 3D 线框和实体 | 相机投影加 `cv2.line(LINE_AA, shift=4)`；棋盘和注意力柱用画家算法按深度排序，再用 `fillConvexPoly` 分面着色（顶面 1.0、正面 0.55、侧面 0.4） |
| 星空和隧道 | 点的 z 坐标取 `(z0 - travel) % depth`，形成无限前进；隧道是 26 个环、每环 90 个点，带 roll 旋转和波动；拖尾就是连接当前点和 z 方向偏移后的点 |
| 神经球体 | 4200 点的斐波那契球，用三角函数噪声让表面起伏；点之间按第 3–8 近邻随机连线（只连最近邻会出现网格纹理）；6% 的点作为大光点；沿连线跑动的光点象征信号 |
| 合成波地面 | 3D 横线和纵线加地平线高斯辉光，前进距离由全局拍号计算 |
| 透视数字墙 | 先在 2D 图层上画数字表格，再用 `warpPerspective` 映射成梯形，远处按高度渐隐 |
| 3D 注意力矩阵 | 11×11 个立柱，高度对应注意力权重，从对角线方向波浪式长高；关键格子（it→animal）用琥珀色 |
| 蛋白质 | 随机游走（loop）和螺旋（helix，半径 0.62、每残基上升 0.16）交替；线段按深度排序后画粗线（螺旋段 16 px、loop 段 7 px，按距离缩放）；颜色从青到紫再到琥珀渐变 |
| 地球 | 9000 点的斐波那契球，用三角噪声阈值 0.12 生成“大陆”；城市之间用 slerp 画弧线，抬升 0.12，只保留夹角 0.3–2.0 弧度的城市对；用世界坐标 z<0.3 剔除背面 |
| 扩散模型 | `x = sqrt(ᾱ)·img + sqrt(1-ᾱ)·ε`，ᾱ = (step/8)^1.6，按八分音符跳步；下方用缩略图展示整个过程 |
| 界面模拟 | 圆角矩形遮罩（矩形加四个圆）、窗口按钮、带语法高亮的逐字打字代码、终端里的 PASSED 列表 |
| 图表 | 对数坐标轴和网格；数据点按趋势线加正态噪声（标注为示意）；线头带光点，边画边长；关键点做引线标注 |
| 后期 | 三级金字塔 bloom（1/4、1/8、1/16 分辨率分别模糊后相加）；径向模糊（5 次缩放叠加）；故障效果（随机水平条带平移，加单通道偏移）；色差（R、B 通道反向缩放）；`tonemap` 在 0.78 以上用 tanh 软压；暗角；6 张预生成的颗粒纹理轮换 |
| 调色板 | 背景接近黑的深蓝 (0.010, 0.013, 0.028)；主色青 (0.20, 0.88, 1.00)；品红 (1.00, 0.22, 0.52)；琥珀 (1.00, 0.68, 0.22)；青柠 (0.72, 1.00, 0.35)；紫罗兰 (0.55, 0.40, 1.00) |
| 字体 | Anton（大标题）、Space Grotesk 700（标签）、JetBrains Mono（HUD 和代码）、Inter 600（英文字幕和正文）、思源黑体 500/900（中文）、DejaVu（符号回退） |

### 4. 音频处理

**合成器件**（全部基于 numpy）：
- **Supersaw**：7 个锯齿波，用 polyBLEP 做抗混叠，失谐 ±0.12–0.16 个半音，声像分布在 -1 到 1。
- **时变滤波器**：RBJ biquad，每 128 个采样用 `lfilter(b, a, x, zi=zi)` 处理一块，并把状态 zi 传给下一块，实现滤波扫频。
- **鼓**：kick 的频率包络是 46 + 130·e^(-t/0.032) Hz，经 tanh 饱和，加 2.5 ms 的点击声；clap 是 3 次噪声脉冲加尾音；snare 是 185 Hz 与 330 Hz 的正弦加带通噪声；hats 是噪声加 808 式的 6 个方波金属声，截止 7.5 kHz；crash 衰减 0.9 秒；impact 是 28–88 Hz 的下滑 sub 加噪声。
- **Pluck 琶音**：先铺成一整轨，再过一个时变低通，截止频率是 `base(t) × (1 + 2.5 × 16分音符包络)`，一个滤波器就同时实现了每个音的起音和整段慢慢打开。
- **FM 贝尔**（用于前奏和间奏）：载波与调制比 1:3.5，调制指数衰减。
- **Growl 低音**（drop2）：FM 合成，用 LFO 控制调制指数和截止频率的摆动，再经 tanh 失真。
- **混响**：合成的立体声 IR（指数衰减噪声、低通、前置延迟），用 `fftconvolve` 实现；大空间 RT60 为 2.8 秒，房间为 0.9 秒。
- **Riser**：带通噪声，中心频率从 300 Hz 扫到 9 kHz，叠加 4 个谐波、上升 2 个八度的音调。

**编曲**：和弦是 Fm–D♭–A♭–E♭，每小节一个和弦。主旋律是 4 小节、16 分音符网格上的 hook。
- verse：4/4 拍 kick，第 32 拍起加 clap，琶音逐渐打开。
- build：军鼓连击从 4 分音符加快到 32 分音符，音高上升；高通从 20 Hz 扫到 900–1200 Hz；bass 淡出。
- drop2：加入 growl 低音和高八度的旋律；第 168–172 拍改为半速；第 172–176 拍做 stutter（先按 1/8 拍重复，再按 1/16 拍重复）。

**卡点和转场处理**：
- **侧链**：每个 kick 触发一次 `1 - 0.82·e^(-t/0.075)` 的压低，持续 0.3 秒；bass 完全吃进这个包络，合成器轨按 `0.35 + 0.65·sc` 吃进。
- **Tape stop**：drop 前半拍把读取速率从 1 降到 0（`rate^1.3` 曲线），用插值重采样，音量降到 0.3，然后清空这一整拍，只留一点混响尾巴。
- **Stutter**：把每 ¼ 拍开头的 1/8 或 1/16 拍循环铺满这 ¼ 拍，两端各做 64 个采样的淡入淡出，避免爆音。
- **音效**：共 14 种，包括 key、enter、blip、tick、whoosh（带通扫频加声像移动）、swish、glitch（随机方波或噪声，降低位深）、data_hit、sub_drop_in（倒放冲击声并在 4 ms 内硬停）、swell、hit_soft、success、shimmer、zap。触发时间全部来自 `timeline.SFX`。
- **淡出**：最后 3 拍按 `(1 - t)^1.5` 淡出。

**混音与母带**（全部靠测量完成，无法用耳朵听）：
- 分段、分轨测 RMS 后定下增益：`mix = drums*0.5 + bass*0.85 + music*2.8`，`fx*0.75`。
- 母带链：25 Hz 高通，`tanh(1.1x)/1.1`，再过前视限制器（4 ms 最大值滤波得到包络，阈值 0.89，释放 80 ms），最后归一化到峰值 0.95。
- 混流时再降 2 dB，最终是 **-9.2 LUFS，真峰值 -0.8 dBFS**。

### 5. 渲染与导出命令

**逐帧通过管道送进 ffmpeg**（中间文件）：
```bash
ffmpeg -loglevel error -y -f rawvideo -pix_fmt rgb24 -s 1920x1080 -r 60 -i - \
  -c:v libx264 -preset medium -crf 12 -pix_fmt yuv420p -x264-params keyint=60 out/seg0.mp4
```
**两个进程并行**（2 核机器），长任务一律后台运行：
```bash
(nohup python3 render.py --start 0    --end 2772 --out out/seg0.mp4 > out/log0.txt 2>&1 &)
(nohup python3 render.py --start 2772 --end 5544 --out out/seg1.mp4 > out/log1.txt 2>&1 &)
```
**拼接、混流，导出交付母版**：
```bash
printf "file 'seg0.mp4'\nfile 'seg1.mp4'\n" > list.txt
ffmpeg -y -f concat -safe 0 -i list.txt -i ../master.wav -map 0:v -map 1:a \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 -r 60 \
  -af "volume=-2dB" -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest \
  AGE_OF_INTELLIGENCE_1080p60.mp4          # 332 MiB
```
**30 MB 以内的分享版**（先降噪再两遍编码）：
```bash
V="hqdn3d=2.5:2.5:5:5,scale=1280:720:flags=lanczos"
ffmpeg -y -i master.mp4 -vf "$V" -c:v libx264 -preset slow -b:v 2350k -maxrate 4000k -bufsize 6000k \
  -pass 1 -passlogfile p720 -an -f null /dev/null
ffmpeg -y -i master.mp4 -vf "$V" -c:v libx264 -preset slow -b:v 2350k -maxrate 4000k -bufsize 6000k \
  -pass 2 -passlogfile p720 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart share_720p60.mp4   # 27.8 MiB
```
码率这样算：`(30 MiB × 8 × 0.97 − 音频码率 × 时长) / 时长`，大约 2.5 Mbps，实际取 2.35 Mbps 留出余量。

**质检命令**：
```bash
ffprobe -v error -count_frames -show_entries stream=codec_name,nb_read_frames,duration -of compact out.mp4
ffmpeg -hide_banner -nostats -i out.mp4 \
  -vf "blackdetect=d=0.01:pix_th=0.06:picture_black_ratio_th=0.98,freezedetect=n=0.0008:d=0.15" \
  -af "silencedetect=n=-50dB:d=0.3,ebur128=peak=true" -f null - 2> qa.txt
grep -E "black_start|freeze_start|silence_start" qa.txt
ffmpeg -i master.wav -lavfi "showspectrumpic=s=1600x500:legend=0:scale=log:fscale=log" spec.png
# 抽出每个镜头第 2 帧做对照表
ffmpeg -i out.mp4 -vf "select='eq(n\,58)+eq(n\,114)+...',scale=480:270" -vsync 0 cuts/c%03d.png
```

### 6. 时间分配与提速方法

| 时段 | 事项 | 用时 |
|---|---|---|
| 03:27–03:31 | 探测环境，下载、转换、合并字体 | 4 分钟 |
| 03:31–03:41 | 时间线、配乐、4 轮混音调整 | 10 分钟 |
| 03:41–04:00 | 渲染核心、46 个场景、3 批静帧审查和修改 | 约 19 分钟 |
| 04:00–04:01 | 冒烟测试（324 帧，平均 0.30 秒/帧） | 2 分钟 |
| 04:01–04:28 | **第 1 次全片渲染** | 26 分钟 |
| 04:28–04:42 | 质检：发现 8 处黑帧，看了 108 张切点对照，修复 | 14 分钟 |
| 04:42–05:11 | **第 2 次全片渲染**（中途为改字幕重启一次） | 29 分钟 |
| 05:11–05:28 | 编码母版（第一次被工具 10 分钟超时杀掉，后台重跑） | 17 分钟 |
| 05:28–05:41 | 质检，第 3 轮修复（字幕切换、地球、蛋白质、标签避让） | 13 分钟 |
| 05:41–06:09 | **第 3 次全片渲染** | 28 分钟 |
| 06:10–06:21 | 编码母版 | 11 分钟 |
| 06:21–06:36 | 最终质检，编码分享版（7 分钟），交付 | 15 分钟 |

**最耗时的是全片重渲**：3 次一共约 83 分钟，加上编码约 35 分钟。单帧 0.3 秒，但两个进程并行时每个进程要 0.55 秒/帧，因为 ffmpeg 编码也在抢 CPU。

**提速方法**：
1. **按镜头分段渲染**：每个镜头单独输出一个文件，文件开头就是关键帧，最后 concat 拼接。改了哪个镜头就只重渲哪个镜头。这次每次修改都要全片重渲，是最大的浪费。
2. **文字层单独输出**：字幕和 HUD 用单独的透明图层或 ASS 字幕叠加，改字幕就不需要重渲画面。这次两处字幕修改一共耗了约 55 分钟。
3. **先渲低分辨率草稿**：先出一版 960×540、30 fps 的预览，单帧成本大约只有四分之一，用来审节奏；定稿后再渲 1080p60。
4. **中间文件用 `-preset ultrafast -crf 12`**，减少编码对 CPU 的抢占。
5. **颗粒最后再加**，或者减弱。颗粒会让 CRF 18 的文件膨胀到 332 MiB，分享版也不得不先降噪。
6. **全片质检前先跑 `qa_frames.py`**（只渲每个镜头的前 3 帧、中帧、尾帧，约 3 分钟），问题在渲染前就能发现。

---

## 三、注意事项与踩过的坑

### 1. 可逐项打勾的检查清单

**开工前**
- [ ] 确认 CPU 核数、内存、磁盘，以及 GPU 是否可用（这次是 2 核、7 GB、无 GPU）
- [ ] 确认 ffmpeg 版本和编码器（libx264、aac），以及 numpy、scipy、cv2、PIL 的版本
- [ ] 测试网络：素材网站、GitHub raw、npm、pip 各自能不能访问（这次只有 npm 和 pip 能用）
- [ ] 确认交付通道的大小上限（这次是 30 MiB），提前规划“母版加分享版”
- [ ] 确认单条工具命令的超时时间（这次是 10 分钟），长任务一律用 nohup 后台运行加轮询
- [ ] 准备字体：标题、正文、等宽、中文、符号回退五类，并逐一测试中文和特殊符号能否正常渲染
- [ ] 确定片长、帧率、分辨率，再按单帧耗时 × 总帧数 ÷ 进程数估算渲染时间
- [ ] **选择 BPM，使每拍的帧数和采样数都是整数**
- [ ] 确定配色和字体体系

**制作中**
- [ ] 镜头表通过 `validate()` 检查：无空隙、无重叠、切点在整数帧上、总长正确
- [ ] 字幕、音效、打字动画都从同一个时间线文件里取值
- [ ] 音频按段、按频段、按轨道测 RMS，确认 drop 比其他段落都响，break 明显更安静
- [ ] 每写完一批场景，先渲半分辨率静帧并拼对照表检查
- [ ] 文字和 3D 点云方向正确（检查镜像、上下颠倒）
- [ ] 字幕区（底部约 215 px）不放重要内容，靠近时淡出
- [ ] 大面积的绘制只在局部小图层上做，不要每次都分配整帧图层
- [ ] 所有动画的起点允许为负，**保证第 0 帧就有主体**
- [ ] 全屏反色或闪烁控制在每秒 3 次以下
- [ ] 冒烟测试全部镜头通过后，才开始全片渲染

**导出前**
- [ ] 跑 `qa_frames.py`：每个镜头的开头和中间，亮像素比例都要不低于 3%
- [ ] 核对字幕阅读速度（每 1.9 秒不超过 7 个英文单词）以及字幕切换时是否闪空
- [ ] 数据类内容逐条核实来源，示意性的内容在画面上标注“ILLUSTRATIVE”
- [ ] 响度约 -9 到 -10 LUFS，真峰值不超过 -1 dBFS

**交付前**
- [ ] 帧数等于理论值（5544），音频和视频时长一致（92.400 秒）
- [ ] blackdetect、freezedetect、silencedetect 结果全部为 0
- [ ] 抽出每个镜头第 2 帧的 16 宫格对照表，逐张检查
- [ ] 文件大小符合通道上限；超出时准备两遍编码的分享版
- [ ] 附上 SRT 和来源列表

### 2. 踩过的坑（现象 → 原因 → 解决 → 下次预防）

**运行环境与依赖**
1. **素材网站访问被拒**：pixabay 和 freemusicarchive 返回 `CONNECT tunnel failed, 403`，GitHub raw 也是 403。原因是容器的出网白名单只放行软件包仓库。解决办法：字体改用 `npm pack @fontsource/*`，音乐改为代码原创。下次开工第一步就用 curl 把各类来源都测一遍，并尽早告诉用户素材来源会怎样变化。
2. **字体包里只有 woff**：fontsource 只提供 woff 和 woff2，PIL 用起来不稳。解决办法：用 `fontTools.TTFont(p); f.flavor=None; f.save('x.ttf')` 批量转成 TTF。
3. **思源黑体被拆成 102 个分包**，找不到一个完整文件。解决办法：自己写合并脚本，遍历每个分包的 cmap，把字形以 `uXXXXX` 的名字复制进基础字体的 glyf 和 hmtx；复合字形先用 TTGlyphPen 拆成简单字形；重建 cmap 的 format 4 和 12 子表；删掉 GSUB、GPOS、GDEF；post 表设为 3.0。每个字重大约 12 秒，共 13655 个字。下次可以直接复用这个脚本。
4. **`e_in3` 未导入导致 NameError**，年份回顾场景里还混进了一行无效语法。靠单帧静帧测试和冒烟测试提前发现。下次任何全片渲染之前都先跑冒烟测试。

**3D 与画面**
5. **“AI”点云左右镜像**：相机用 `cross(f, up)` 算出的 right 向量方向反了。改成 `cross(up, f)` 后又变成上下颠倒，因为文字遮罩的 y 轴向下，而 3D 世界的 y 轴向上。最终把点云 y 取负（1950 粒子消散效果同样处理）。下次写好相机后，先用一个非对称的测试字（比如 “F”）验证方向。
6. **点云几乎看不见**：双线性单像素 splat 把 1 个点的能量分到 4 个像素，经过暗角和 tonemap 后，神经球体在 1080p 下只剩灰点。改为在包围盒内做 5×5 高斯软化，增益 2.2–3.0；球体的权重从 1.3 提到 3.2，另外画 6% 的大光点；星空亮度乘 3。下次看静帧时要**截全分辨率局部**，半分辨率对照表会掩盖“太暗”的问题。
7. **单帧 0.6–0.9 秒，偶尔更慢**：`glow_circle` 和 `ring` 每调用一次就分配一整帧 25 MB 的图层。改成只在局部小块上画；又因为半径 2400 的冲击波环会分配 4800² 的小块，所以再把小块裁剪到屏幕范围内。线条和折线也改为只在包围盒内绘制。下次核心绘图函数一律只处理局部区域。
8. **cv2 报 `Scalar value for argument 'color' is not numeric`**：透明度变成了 numpy 标量，`float(v) * np.float32` 得到的仍是 numpy 类型。统一写成 `tuple(float(v * alpha) for v in color)`。
9. **径向模糊失控**：隧道速度用 `sp = b - 52` 计算，到了第 158 拍的回顾镜头，sp 达到 106，模糊量变成 0.44，“CREATE”被拖得看不清。把 sp 限制在 0 到 12。**凡是跟全局时间挂钩的量都要设上下限**，因为场景会在别的段落被复用。
10. **地球弧线像绕在球外的圈**：抬升 0.35，又连了接近对跖点的城市对。改为抬升 0.12、只保留夹角 0.3–2.0 弧度的城市对，并提亮海洋点，大陆阈值改为 0.12。
11. **蛋白质看起来像一团乱线**：螺旋半径只有 0.23，归一化之后几乎看不出。改为半径 0.62，螺旋段画粗、loop 段画细。
12. **年份飞入角标时跳一下**：飞行过程画在画布上，会被后期缩放；角标画在 HUD 层，不会被缩放。两者衔接时位置对不上。解决办法：飞行中的年份也画在后期之后的文字层，并且全程用中心点插值，不在中途切换锚点。
13. **镜头冲击缩放把贴边文字推出画面**：5% 的放大让 x=80 处的计数器 “0+” 有几帧被裁掉。已用 BORDER_REFLECT101 避免出现黑边，但贴边元素仍会被推出去。下次重要文字距离边缘至少 120 px，或者让冲击缩放以画面主体为中心。

**文字、排版与字幕**
14. **符号显示为方框**：JetBrains Mono 和 Inter 的拉丁子集里没有 → ≈ Σ ᵢ ✓ ½。做了逐字回退：先用 fontTools 读 cmap 判断主字体有没有这个字，没有就依次回退到 DejaVu 和思源，并按 ascent 对齐基线。
15. **排版碰撞**：
    - token 那一行溢出画面，字号从 78 调到 64，间距也缩小；
    - 代码编辑器被大标题挡住，窗口的 x 从 560 移到 700；
    - 多头注意力的大字压住了面板标签，面板从 230 缩到 190，大字放到 y=830；
    - 词向量标签掉进字幕区，距底部 215 px 以内的标签按距离淡出；
    - 1950 的引文压到数字，数字上移 60 px，引文下移。
    
    下次**先定好安全区**：顶部标题区、底部字幕区，加上左右两侧各 80–120 px。
16. **字幕读不完**：起源段每条字幕只有 1.87 秒，却有 11–12 个英文单词。压缩到 7 个词以内，例如 “1958 — The Perceptron learns from examples.”。诺奖那句也从 12 个词压成了 7 个。
17. **字幕切换时闪空**：每条新字幕都从透明度 0 开始淡入，相邻两条之间会闪出一段空白。改为：如果前一条正好在此结束，新字幕从 0.55 的透明度起步，并带 10 px 的上滑。
18. **反色帧上的白字幕看不清**：给字幕加了反色模式，文字改深色，阴影改浅色。

**帧率、时长、黑帧与重复帧**
19. **第 1 版质检查出 8 处黑帧**：序章开头 0–0.67 秒、算力图开头 0.72 秒，以及 5 个镜头的首帧（各 1–4 帧）。原因是所有入场动画都从透明度 0 开始，而且算力图的坐标轴有 0.5 拍的淡入。改为动画起点提前（`ramp(tb, -0.25, …)`），第 0 帧就能看到主体；序章加上背景球体；另外写了 `qa_frames.py`，在渲染前检查每个镜头开头的亮像素比例。**做硬切混剪时，每个镜头的第一帧都必须有主体。**
20. **光敏风险**：stutter 段每秒反色约 4.3 次，icon_flash 在半拍内反色 2 次。改为 stutter 不反色，改用缩放、旋转、色差；switch_word 每 4 个镜头才反色 1 次；icon_flash 取消反色。
21. **重复帧和冻结**：定格镜头（gap、结尾卡）都保留微小的运动，比如闪烁、慢推、慢转。freezedetect（阈值 0.0008，时长 0.15 秒）的结果为 0。结尾不黑场，只压暗 30%。

**音频与音画同步**
22. **第一版混音被低频淹没**：drop 段 250 Hz–2 kHz 只有 -20.9 dB，而 60 Hz 以下有 -8.8 dB；分轨测量发现鼓组 -5.3 dB，合成器 -22 dB。重新设定各轨增益（鼓 0.5，合成器 2.8）。
23. **序章太响、break 和 drop 一样响，动态没有拉开**：前奏的铃音 0.16 太大，pad 0.07–0.08 太大。分别降到 0.06 和 0.04 后，序章 -16.4 dB，break -10.6 dB，drop2 -7.6 dB。build2 的中频太空，补上了琶音。
24. **响度过高**：-7.1 LUFS，LRA 只有 3.5，压得很扁。混流时 `volume=-2dB`，得到 -9.2 LUFS，AAC 编码后峰值 -0.8 dBFS。
25. **音画同步**：BPM 设成整数帧，镜头、音效、打字、kick 都从同一张时间线派生，所以没有出现任何错位。唯一的小差异是分享版 AAC 编码的首帧补偿，使音频时长为 92.416 秒，可以忽略。**不要让音乐和画面各自计时。**

**渲染、导出与文件体积**
26. **`pkill -f "render.py --start"` 把自己的 shell 杀了**，退出码 144，后面的命令都没执行。原因是这个匹配模式也出现在当前 bash 自己的命令行里。改用 `pkill -f "[r]ender.py"` 或者记录 PID 后 `kill`。
27. **最终编码被工具的 10 分钟超时杀掉**：`-preset slow` 编 5544 帧 1080p60 超过 10 分钟。改为 `nohup … &` 后台运行，再用 sleep 轮询日志；预设换成 medium（约 11 分钟）。
28. **文件太大**：CRF 12 的中间文件 866 MB，CRF 18 的母版 332 MiB，主要是颗粒纹理让码率膨胀。发送工具提示 `332.1 MiB exceeds the 30 MiB upload limit`。解决办法：用 hqdn3d 降噪，缩到 720p，两遍 2350 kbps 编码，得到 27.8 MiB。下次提前确认通道上限，颗粒调弱，或者改由编码器合成颗粒；大文件可以通过连接用户电脑的方式直接存到本地。
29. **改一处就要全片重渲**：字幕和 HUD 直接烧在每一帧里，又没有逐镜头的缓存，所以改字幕、修开场都要重渲 26 分钟。下次按镜头分段输出，文字层分离。
30. **两个进程并行时单帧变慢**：从单进程的 0.3 秒变成 0.55 秒/帧，因为 ffmpeg 的 x264 也在用这 2 个核。中间文件用 ultrafast 预设，或者先输出 PNG/无损，最后统一编码。

**风格衔接**
31. **不同风格之间靠“母题加编号加统一的入场冲击”来衔接**：每个章节有自己的底色，比如原理段是点阵网格，build2 是合成波地面，诺奖段是暖色背景；但 HUD、标题模板、编号系统和切点冲击在全片统一，所以风格跨度很大也不会显得乱。快切段落的背景用全局时间驱动，保证连续。

---

## 四、可复用的模板

### A. 代码视频制作流程模板

```
0. 立项（10 分钟）
   □ 一句话主线（问题 → 回答 / 过去 → 未来），首尾呼应的母题
   □ 片长 = 章节数 × 12–20 秒；估算渲染时间 = 帧数 × 单帧秒数 ÷ 核数
   □ 交付规格：分辨率、帧率、通道大小上限、是否需要双语字幕

1. 环境（5 分钟）
   nproc; free -g; ffmpeg -version; python -c "import numpy,scipy,cv2,PIL"
   curl 测试素材站、GitHub raw、npm、pip → 决定素材来源
   npm pack @fontsource/{anton,space-grotesk,jetbrains-mono,inter,noto-sans-sc}
   → fontTools 转 TTF；合并中文分包；测试中文和符号渲染

2. 时间线 timeline.py（15 分钟）
   FPS=60, FPB=28（→ 128.571 BPM），SR=48000, SPB=22400
   SECTIONS：intro / verse / build / gap / drop / break / build / gap / drop / outro
   SHOTS：shot(b0, b1, scene, **params)；build 段剪辑间隔按 4 → 2 → 1 → ½ → ¼ 拍加速
   SUBS：(b0, b1, en, zh)，每 1.9 秒不超过 7 个英文单词，按章节节奏更换
   SFX：(beat, kind, params)，包括打字、whoosh、hit、glitch、倒放吸气、冲击
   validate()

3. 音乐 music.py（20 分钟）
   合成器件 → 编曲 → 侧链 → 混响 → tape stop / stutter → 混音 → 限制器
   输出 master.wav 和 audio_analysis.json（kicks、每帧 rms、每帧 low）
   分段、分频段、分轨测 RMS 和频谱图；目标：drop 最响，break 降 3 dB 以上，前奏约 -16 dB

4. 渲染核心 core.py 和 render.py（30 分钟，可直接复用本次代码）
   文字遮罩（带逐字回退）/ 动态文字 / 局部绘制 / 3D 相机 / 柔光 splat / bloom / 后期
   render_frame：场景 → 自动节拍特效（kick 脉冲、切点冲击、冲击四件套）→ 后期 → 文字层
   参数：--stills b12.5,… --scale 0.5；--start/--end/--out

5. 场景（每批 6–15 个镜头；每批写完 → 渲静帧 → 拼对照表 → 修改）
   安全区：顶部标题、底部 215 px 留给字幕、两侧各 80–120 px
   第 0 帧必须有主体；在全局时间上驱动的量要设上下限

6. 渲染前质检
   python smoke.py        # 每个镜头的首、中、尾帧，确认无报错
   python qa_frames.py    # 每个镜头开头的亮像素比例不低于 3%

7. 渲染（推荐按镜头分段；文字层单独输出）
   nohup 多进程；中间文件用 -crf 12 -preset ultrafast -x264-params keyint=60

8. 合成与交付
   concat + 混流 + volume=-2dB → CRF 18 母版
   降噪 + 两遍编码 → 30 MB 以内的分享版
   生成 SRT

9. 交付前质检
   ffprobe 核对帧数和时长；blackdetect / freezedetect / silencedetect / ebur128
   每个镜头第 2 帧的 16 宫格对照表逐张检查；抽查全分辨率局部
```

### B. 给 AI 的开工提示词模板

```
你要用纯代码（Python + numpy/scipy/OpenCV/Pillow + ffmpeg）制作一支【主题】的卡点混剪视频。
不使用 AE 或 Blender；如果不能下载素材，就用代码原创音乐和画面。

【规格】{时长}秒，1920×1080，60fps，H.264+AAC；{中英双语}硬字幕，另附 .srt；
交付通道大小上限 {30 MB}（需要额外提供一个满足上限的分享版）。

【叙事】主线：{一个问题/一个转变}，首尾呼应。章节：{章节列表}。
所有数据必须核实来源；示意性的内容在画面上标注“ILLUSTRATIVE”。

【必须遵守的方法】
1. 先探测环境（CPU、内存、GPU、ffmpeg、网络白名单、单条命令超时、交付通道上限），再动手。
2. BPM 必须让每拍的帧数和采样数都是整数（60fps 时推荐每拍 28 帧，即 128.571 BPM）。
   写一个 timeline.py 作为唯一的真相源，镜头、字幕、音效、打字动画全部从它派生，并用 validate() 检查。
3. 结构使用“蓄力 → 静一拍 → drop”两次，第二次更强；build 段剪辑间隔 4→2→1→½→¼ 拍；
   break 至少比 drop 低 3 dB，并实测分段 RMS 来验证。
4. 每次切镜加入场冲击（5% 缩放加 7 px 色差，4 帧内衰减）；kick 驱动缩放脉冲；
   drop 下拍用白闪、抖动、色差、径向模糊。
5. 文字层（HUD、字幕）放在后期之后绘制；字体准备好中文和符号回退，按 cmap 判断逐字回退。
6. 性能：绘图只在局部小块上做；粒子用 bincount 加 5×5 高斯柔光；每帧目标约 0.3 秒。
7. 3D 相机用 right = cross(up, forward)，由文字生成的点云要把 y 取负；先用非对称字测试方向。
8. 每个镜头的第 0 帧必须有主体；全屏反色或闪烁每秒不超过 3 次；
   底部 215 px 留给字幕；重要元素距边缘至少 120 px。
9. 字幕每 1.9 秒不超过 7 个英文单词；相邻字幕直接切换，不要闪空。
10. 每写完一批场景就渲半分辨率静帧对照表，并截全分辨率局部检查；
    全片渲染前跑 smoke 测试（每镜首、中、尾帧）和空白帧检查。
11. 按镜头分段渲染（每段开头为关键帧），改动只重渲受影响的镜头；
    长任务一律 nohup 后台运行加轮询，不要用 pkill -f 匹配自己的命令行。
12. 交付前：ffprobe 核对帧数和时长；blackdetect / freezedetect / silencedetect 结果为 0；
    响度约 -9 LUFS，真峰值不超过 -1 dBFS；每镜第 2 帧对照表逐张检查；
    分享版用 hqdn3d 降噪加两遍编码压到上限以内。

请先给出：章节与时间对照表、镜头表草案、配色和字体方案、渲染时间估算，然后开始执行。
```

---

*本次事实来源：Epoch AI《Training compute of frontier AI models grows by 4–5x per year》；另有 AlexNet ImageNet 前五错误率（15.3% 对比 26.2%）、GPT-3 1750 亿参数、AlphaFold 数据库 2 亿以上结构、2024 年诺贝尔物理学奖和化学奖等公开史实。*
````

### 3/30 · `The_Age_of_Intelligence-source/fonts/licenses/DejaVu-LICENSE.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/DejaVu-LICENSE.txt", "lines": 78, "final_newline": true, "sha256": "63d3ba759d12804c5b31a9d5940d855c1820d1f5999e6b0872eb1c7ff045fbc9", "original_sha256": "63d3ba759d12804c5b31a9d5940d855c1820d1f5999e6b0872eb1c7ff045fbc9"} -->
```text
Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/
Upstream-Name: DejaVu fonts
Upstream-Author: Stepan Roh <src@users.sourceforge.net> (original author),
                  see /usr/share/doc/fonts-dejavu-core/AUTHORS for full list
Source: https://dejavu-fonts.github.io/

Files: *
Copyright: Copyright (c) 2003 by Bitstream, Inc. All Rights Reserved. 
 Bitstream Vera is a trademark of Bitstream, Inc.
 DejaVu changes are in public domain.
License: bitstream-vera
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of the fonts accompanying this license ("Fonts") and associated
 documentation files (the "Font Software"), to reproduce and distribute the
 Font Software, including without limitation the rights to use, copy, merge,
 publish, distribute, and/or sell copies of the Font Software, and to permit
 persons to whom the Font Software is furnished to do so, subject to the
 following conditions:
 .
 The above copyright and trademark notices and this permission notice shall
 be included in all copies of one or more of the Font Software typefaces.
 .
 The Font Software may be modified, altered, or added to, and in particular
 the designs of glyphs or characters in the Fonts may be modified and
 additional glyphs or characters may be added to the Fonts, only if the fonts
 are renamed to names not containing either the words "Bitstream" or the word
 "Vera".
 .
 This License becomes null and void to the extent applicable to Fonts or Font
 Software that has been modified and is distributed under the "Bitstream
 Vera" names.
 .
 The Font Software may be sold as part of a larger software package but no
 copy of one or more of the Font Software typefaces may be sold by itself.
 .
 THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT,
 TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL BITSTREAM OR THE GNOME
 FOUNDATION BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING
 ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
 THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE
 FONT SOFTWARE.
 .
 Except as contained in this notice, the names of Gnome, the Gnome
 Foundation, and Bitstream Inc., shall not be used in advertising or
 otherwise to promote the sale, use or other dealings in this Font Software
 without prior written authorization from the Gnome Foundation or Bitstream
 Inc., respectively. For further information, contact: fonts at gnome dot
 org.

Files: debian/*
Copyright: (C) 2005-2006 Peter Cernak <pce@users.sourceforge.net> 
           (C) 2006-2011 Davide Viti <zinosat@tiscali.it>
           (C) 2011-2013 Christian Perrier <bubulle@debian.org>
           (C) 2013 Fabian Greffrath <fabian+debian@greffrath.com>
License: GPL-2+
 This program is free software; you can redistribute it
 and/or modify it under the terms of the GNU General Public
 License as published by the Free Software Foundation; either
 version 2 of the License, or (at your option) any later
 version.
 .
 This program is distributed in the hope that it will be
 useful, but WITHOUT ANY WARRANTY; without even the implied
 warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 PURPOSE.  See the GNU General Public License for more
 details.
 .
 You should have received a copy of the GNU General Public
 License along with this package; if not, write to the Free
 Software Foundation, Inc., 51 Franklin St, Fifth Floor,
 Boston, MA  02110-1301 USA
 .
 On Debian systems, the full text of the GNU General Public
 License version 2 can be found in the file
 /usr/share/common-licenses/GPL-2'.
```

### 4/30 · `The_Age_of_Intelligence-source/fonts/licenses/anton-OFL.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/anton-OFL.txt", "lines": 93, "final_newline": true, "sha256": "9267baca92b7a7ce9db6dd9e6cc32c9fe3ddf1ac96e421d5f87c5746b9089d6a", "original_sha256": "9267baca92b7a7ce9db6dd9e6cc32c9fe3ddf1ac96e421d5f87c5746b9089d6a"} -->
```text
Copyright 2020 The Anton Project Authors (https://github.com/googlefonts/AntonFont.git)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

### 5/30 · `The_Age_of_Intelligence-source/fonts/licenses/bebas-neue-OFL.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/bebas-neue-OFL.txt", "lines": 93, "final_newline": true, "sha256": "66c436339f7490c1a99e4f6a7b8aef5c176676edfd071a31638e7d54c1b0aeda", "original_sha256": "66c436339f7490c1a99e4f6a7b8aef5c176676edfd071a31638e7d54c1b0aeda"} -->
```text
Copyright 2019 The Bebas Neue Project Authors (https://github.com/dharmatype/Bebas-Neue)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

### 6/30 · `The_Age_of_Intelligence-source/fonts/licenses/inter-OFL.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/inter-OFL.txt", "lines": 93, "final_newline": true, "sha256": "3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345", "original_sha256": "3b0a5fca3d17942cde889069889dedbbbd075e9b599968c82a95f4d944e9b345"} -->
```text
Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter) Inter-Italic[opsz,wght].ttf: Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

### 7/30 · `The_Age_of_Intelligence-source/fonts/licenses/jetbrains-mono-OFL.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/jetbrains-mono-OFL.txt", "lines": 93, "final_newline": true, "sha256": "403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b", "original_sha256": "403581b69dac5cff4079205e01c6b467e56af449ecbd7247693ddb1baafa005b"} -->
```text
Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono) JetBrainsMono-Italic[wght].ttf: Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

### 8/30 · `The_Age_of_Intelligence-source/fonts/licenses/noto-sans-sc-OFL.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/noto-sans-sc-OFL.txt", "lines": 93, "final_newline": true, "sha256": "18aabf190848725e2576eefb5c29ba06aac1029d02132252a7f312eac2e50cf3", "original_sha256": "18aabf190848725e2576eefb5c29ba06aac1029d02132252a7f312eac2e50cf3"} -->
```text
Google Inc.

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

### 9/30 · `The_Age_of_Intelligence-source/fonts/licenses/space-grotesk-OFL.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/space-grotesk-OFL.txt", "lines": 93, "final_newline": true, "sha256": "18a4de52385f6b988782639d5d0cc1326e5a8c2de9a7f01d7b20d9aedcc60943", "original_sha256": "18a4de52385f6b988782639d5d0cc1326e5a8c2de9a7f01d7b20d9aedcc60943"} -->
```text
Copyright 2020 The Space Grotesk Project Authors (https://github.com/floriankarsten/space-grotesk)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

### 10/30 · `The_Age_of_Intelligence-source/fonts/licenses/unbounded-OFL.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/fonts/licenses/unbounded-OFL.txt", "lines": 93, "final_newline": true, "sha256": "48a780bc857729859e54d1e691b05792894a26634edc1c4b5dbeabffe6941758", "original_sha256": "48a780bc857729859e54d1e691b05792894a26634edc1c4b5dbeabffe6941758"} -->
```text
Copyright 2022 The Unbounded Project Authors (https://github.com/googlefonts/unbounded)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

### 11/30 · `The_Age_of_Intelligence-source/package.json`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/package.json", "lines": 22, "final_newline": true, "sha256": "de3058b92eb8c5b3e81bf326215ce619d8678b764ad9bc2ce6bb964db6e5c169", "original_sha256": "de3058b92eb8c5b3e81bf326215ce619d8678b764ad9bc2ce6bb964db6e5c169"} -->
```json
{
  "name": "the-age-of-intelligence-source",
  "version": "1.0.0",
  "private": true,
  "description": "Font sources for 'The Age of Intelligence' code-rendered video. Rendering itself is Python; npm is only used to fetch fonts.",
  "scripts": {
    "fonts": "python3 scripts/build_fonts.py",
    "render": "bash scripts/render_all.sh",
    "encode": "bash scripts/encode.sh",
    "qa": "bash scripts/qa.sh",
    "all": "bash scripts/render_all.sh && bash scripts/encode.sh && bash scripts/qa.sh"
  },
  "dependencies": {
    "@fontsource/anton": "5.3.0",
    "@fontsource/bebas-neue": "5.3.0",
    "@fontsource/inter": "5.3.0",
    "@fontsource/jetbrains-mono": "5.3.0",
    "@fontsource/noto-sans-sc": "5.3.0",
    "@fontsource/space-grotesk": "5.3.0",
    "@fontsource/unbounded": "5.3.0"
  }
}
```

### 12/30 · `The_Age_of_Intelligence-source/requirements.txt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/requirements.txt", "lines": 8, "final_newline": true, "sha256": "4390d21d545351f1812a7e609aa98dcb4073128ea033322329b86a0050cb75f9", "original_sha256": "4390d21d545351f1812a7e609aa98dcb4073128ea033322329b86a0050cb75f9"} -->
```text
# Python 3.11 (tested). Versions are the ones the film was rendered with.
numpy==2.4.4
scipy==1.17.1
opencv-python-headless==4.13.0.92
pillow==12.2.0
# only needed to rebuild fonts/ from npm (scripts/build_fonts.py); prebuilt TTFs are included
fonttools==4.62.1
brotli==1.2.0
```

### 13/30 · `The_Age_of_Intelligence-source/scripts/build_fonts.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/scripts/build_fonts.py", "lines": 70, "final_newline": true, "sha256": "1bd81a4e28f292547b28d05c662e3572f8a521b39813ae2dc834132b56baa6ad", "original_sha256": "1bd81a4e28f292547b28d05c662e3572f8a521b39813ae2dc834132b56baa6ad"} -->
```python
"""[补全] Rebuild fonts/*.ttf from the @fontsource npm packages (the session did this with inline commands).

1) woff -> ttf for the Latin fonts
2) Noto Sans SC ships as 102 unicode-range subsets per weight -> merged into one TTF per weight
   (copy glyf/hmtx entries under uXXXXX names, decompose composites, rebuild cmap 4 + 12, drop GSUB/GPOS/GDEF)
usage (from repo root, after `npm install`):  python3 scripts/build_fonts.py
"""
import glob, os
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib.tables import _c_m_a_p
from fontTools.ttLib.tables._c_m_a_p import cmap_format_12

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NM = os.path.join(ROOT, 'node_modules', '@fontsource')
OUT = os.path.join(ROOT, 'fonts')
TMP = os.path.join(ROOT, 'build', 'sc_subsets')
os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)

want = {'anton': 'anton/files/anton-latin-400-normal.woff',
        'bebas': 'bebas-neue/files/bebas-neue-latin-400-normal.woff'}
for w in [400, 500, 700]:
    want[f'grotesk{w}'] = f'space-grotesk/files/space-grotesk-latin-{w}-normal.woff'
for w in [400, 700, 800]:
    want[f'mono{w}'] = f'jetbrains-mono/files/jetbrains-mono-latin-{w}-normal.woff'
for w in [300, 400, 600, 800, 900]:
    want[f'inter{w}'] = f'inter/files/inter-latin-{w}-normal.woff'
for w in [800, 900]:
    want[f'unbounded{w}'] = f'unbounded/files/unbounded-latin-{w}-normal.woff'
for k, p in want.items():
    f = TTFont(os.path.join(NM, p)); f.flavor = None; f.save(os.path.join(OUT, f'{k}.ttf'))
print('latin fonts ok:', len(want))

for w in [500, 700, 900]:
    subs = sorted(glob.glob(os.path.join(NM, 'noto-sans-sc', 'files', f'noto-sans-sc-*-{w}-normal.woff')))
    paths = []
    for p in subs:
        f = TTFont(p); f.flavor = None
        q = os.path.join(TMP, os.path.basename(p).replace('.woff', '.ttf')); f.save(q); paths.append(q)
    base = TTFont(paths[0])
    for t in ['GSUB', 'GPOS', 'GDEF']:
        if t in base:
            del base[t]
    glyf = base['glyf']; hmtx = base['hmtx']; order = list(base.getGlyphOrder()); cmap = {}
    for p in paths:
        f = TTFont(p); fg = f['glyf']; fh = f['hmtx']
        for cp, gn in f.getBestCmap().items():
            if cp in cmap:
                continue
            new = f'u{cp:05X}'
            g = fg[gn]
            if g.isComposite():
                pen = TTGlyphPen(f.getGlyphSet()); f.getGlyphSet()[gn].draw(pen); g = pen.glyph()
            glyf.glyphs[new] = g; hmtx.metrics[new] = fh[gn]; order.append(new); cmap[cp] = new
    base.setGlyphOrder(order); glyf.glyphOrder = order
    t = _c_m_a_p.table__c_m_a_p(); t.tableVersion = 0
    s12 = cmap_format_12(12); s12.platformID = 3; s12.platEncID = 10; s12.format = 12
    s12.reserved = 0; s12.length = 0; s12.language = 0; s12.cmap = cmap
    s4 = _c_m_a_p.CmapSubtable.newSubtable(4); s4.platformID = 3; s4.platEncID = 1; s4.language = 0
    s4.cmap = {k: v for k, v in cmap.items() if k < 0x10000}
    t.tables = [s4, s12]; base['cmap'] = t
    base['maxp'].numGlyphs = len(order)
    if 'post' in base:
        base['post'].formatType = 3.0
    base.save(os.path.join(OUT, f'notosc{w}.ttf'))
    print(f'notosc{w}.ttf: {len(subs)} subsets merged, {len(cmap)} chars')

dv = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
if not os.path.exists(os.path.join(OUT, 'DejaVuSans.ttf')) and os.path.exists(dv):
    import shutil; shutil.copy(dv, OUT)
```

### 14/30 · `The_Age_of_Intelligence-source/scripts/encode.sh`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/scripts/encode.sh", "lines": 19, "final_newline": true, "sha256": "e6762a217067077b7f533f6930012ddd986a5e5e82fb0c23958ad227ca7068da", "original_sha256": "e6762a217067077b7f533f6930012ddd986a5e5e82fb0c23958ad227ca7068da"} -->
```bash
#!/usr/bin/env bash
# [补全] Concat segments + mux audio -> 1080p60 master, then a <30 MB 720p60 share cut, then the SRT.
set -euo pipefail
cd "$(dirname "$0")/.."
BUILD=${AOI_BUILD:-build}
cd "$BUILD"
ffmpeg -loglevel error -y -f concat -safe 0 -i list.txt -i master.wav -map 0:v -map 1:a \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 -r 60 \
  -af "volume=-2dB" -c:a aac -b:a 320k -ar 48000 -movflags +faststart \
  -metadata title="The Age of Intelligence" -shortest AGE_OF_INTELLIGENCE_1080p60.mp4
V="hqdn3d=2.5:2.5:5:5,scale=1280:720:flags=lanczos"
ffmpeg -loglevel error -y -i AGE_OF_INTELLIGENCE_1080p60.mp4 -vf "$V" -c:v libx264 -preset slow \
  -b:v 2350k -maxrate 4000k -bufsize 6000k -pass 1 -passlogfile p720 -an -f null /dev/null
ffmpeg -loglevel error -y -i AGE_OF_INTELLIGENCE_1080p60.mp4 -vf "$V" -c:v libx264 -preset slow \
  -b:v 2350k -maxrate 4000k -bufsize 6000k -pass 2 -passlogfile p720 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart AGE_OF_INTELLIGENCE_720p60_share.mp4
cd - > /dev/null
python3 src/make_srt.py
ls -la "$BUILD"/*.mp4 "$BUILD"/*.srt
```

### 15/30 · `The_Age_of_Intelligence-source/scripts/qa.sh`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/scripts/qa.sh", "lines": 13, "final_newline": true, "sha256": "82242ba52c5f3f435e1a1711b4a3f20eca2a5606f55a0f6101cd11048933b34f", "original_sha256": "82242ba52c5f3f435e1a1711b4a3f20eca2a5606f55a0f6101cd11048933b34f"} -->
```bash
#!/usr/bin/env bash
# [补全] Delivery QA: frame count/duration, black/freeze/silence scan, loudness, per-cut contact sheets.
set -euo pipefail
cd "$(dirname "$0")/.."
F=${1:-${AOI_BUILD:-build}/AGE_OF_INTELLIGENCE_1080p60.mp4}
ffprobe -v error -count_frames -show_entries stream=codec_name,nb_read_frames,duration,width,height,r_frame_rate -of compact "$F"
ffmpeg -hide_banner -nostats -i "$F" \
  -vf "blackdetect=d=0.01:pix_th=0.06:picture_black_ratio_th=0.98,freezedetect=n=0.0008:d=0.15" \
  -af "silencedetect=n=-50dB:d=0.3,ebur128=peak=true" -f null - 2> "${F%.mp4}_qa.txt"
echo "--- issues (empty = clean):"
grep -E "black_start|freeze_start|silence_start" "${F%.mp4}_qa.txt" | sed 's/.*\] //' || true
grep -E "^\s+I:|^\s+Peak:" "${F%.mp4}_qa.txt" | tail -2
python3 src/cut_sheets.py "$F"
```

### 16/30 · `The_Age_of_Intelligence-source/scripts/render_all.sh`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/scripts/render_all.sh", "lines": 30, "final_newline": true, "sha256": "11c8d848248338350cc8f242f076c00157af3e7f2c9c567a1674dedbf159b22f", "original_sha256": "11c8d848248338350cc8f242f076c00157af3e7f2c9c567a1674dedbf159b22f"} -->
```bash
#!/usr/bin/env bash
# [补全] Full pipeline up to the intermediate video segments (session ran these steps by hand).
# usage: JOBS=2 bash scripts/render_all.sh
set -euo pipefail
cd "$(dirname "$0")/.."
JOBS=${JOBS:-2}
BUILD=${AOI_BUILD:-build}; mkdir -p "$BUILD"
PY=python3

echo "[1/5] validate timeline";      $PY src/timeline.py
echo "[2/5] synthesize music + sfx"; $PY src/music.py
if [[ "${SKIP_CHECKS:-0}" != 1 ]]; then
  echo "[3/5] smoke test (first/mid/last frame of all 108 shots)"; $PY src/smoke.py
  echo "[4/5] blank-frame check";      $PY src/qa_frames.py
fi
echo "[5/5] render $JOBS segments in parallel"
N=${AOI_FRAMES:-$($PY -c "import sys; sys.path.insert(0,'src'); import timeline as T; print(T.N_FRAMES)")}   # AOI_FRAMES=120 for a quick test
STEP=$(( (N + JOBS - 1) / JOBS ))
: > "$BUILD/list.txt"
pids=()
for ((i=0; i<JOBS; i++)); do
  s=$(( i * STEP )); e=$(( s + STEP )); (( e > N )) && e=$N
  (( s >= e )) && continue
  $PY src/render.py --start $s --end $e --out "$BUILD/seg$i.mp4" > "$BUILD/log$i.txt" 2>&1 &
  pids+=($!)
  echo "file 'seg$i.mp4'" >> "$BUILD/list.txt"
done
for p in "${pids[@]}"; do wait "$p"; done
tail -n 1 "$BUILD"/log*.txt
echo "segments ready -> run: bash scripts/encode.sh"
```

### 17/30 · `The_Age_of_Intelligence-source/scripts/stills.sh`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/scripts/stills.sh", "lines": 8, "final_newline": true, "sha256": "4602d92f47d783e60ac0b6e6528f0db8a4a8696a8f5d2b3bb65de465602cd994", "original_sha256": "4602d92f47d783e60ac0b6e6528f0db8a4a8696a8f5d2b3bb65de465602cd994"} -->
```bash
#!/usr/bin/env bash
# [补全] Preview single frames without rendering the film. Beats are prefixed with b.
# usage: bash scripts/stills.sh b64.3,b100,b138   -> build/stills/*.png + build/sheet.png
set -euo pipefail
cd "$(dirname "$0")/.."
python3 src/render.py --stills "${1:-b4,b17.5,b64.3,b100,b138,b188}" --scale 0.5
python3 src/sheet.py build/sheet.png build/stills/*.png
echo "-> build/sheet.png"
```

### 18/30 · `The_Age_of_Intelligence-source/src/core.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/core.py", "lines": 596, "final_newline": true, "sha256": "a06773f96ea9ca1a177880adf26bed009ab3e0c7e5ad04ab9ab9297f4dad7554", "original_sha256": "a06773f96ea9ca1a177880adf26bed009ab3e0c7e5ad04ab9ab9297f4dad7554"} -->
```python
"""Rendering core: text sprites, compositing, 3D projection, splatting, bloom, easing."""
import os
import numpy as np, cv2, math, functools
from PIL import Image, ImageDraw, ImageFont
import timeline as TL

cv2.setNumThreads(1)
W, H = TL.W, TL.H
FD = TL.FONT_DIR + os.sep

# ------------------------------------------------------------------ palette (RGB float)
BG = np.array([0.010, 0.013, 0.028], np.float32)
CYAN = (0.20, 0.88, 1.00)
MAG = (1.00, 0.22, 0.52)
AMBER = (1.00, 0.68, 0.22)
WHITE = (1.0, 1.0, 1.0)
LIME = (0.72, 1.00, 0.35)
VIOLET = (0.55, 0.40, 1.00)
GREY = (0.55, 0.60, 0.70)
DIM = (0.25, 0.30, 0.40)
HUES = [CYAN, MAG, AMBER]


def col(c, k=1.0):
    return tuple(float(v) * k for v in c)


def mixc(a, b, t):
    return tuple(a[i] * (1 - t) + b[i] * t for i in range(3))


# ------------------------------------------------------------------ easing
def clamp01(x):
    return max(0.0, min(1.0, x))


def lerp(a, b, t):
    return a + (b - a) * t


def ramp(x, a, b):
    """0 at a, 1 at b (clamped)"""
    if b == a:
        return 1.0 if x >= b else 0.0
    return clamp01((x - a) / (b - a))


def e_out3(t):
    t = clamp01(t); return 1 - (1 - t) ** 3


def e_out5(t):
    t = clamp01(t); return 1 - (1 - t) ** 5


def e_in3(t):
    t = clamp01(t); return t ** 3


def e_io3(t):
    t = clamp01(t); return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def e_expo(t):
    t = clamp01(t); return 1.0 if t >= 1 else 1 - 2 ** (-10 * t)


def e_back(t, s=1.9):
    t = clamp01(t) - 1; return t * t * ((s + 1) * t + s) + 1


def e_elastic(t):
    t = clamp01(t)
    if t in (0, 1):
        return t
    return 2 ** (-10 * t) * math.sin((t * 10 - 0.75) * (2 * math.pi) / 3) + 1


def smooth(t):
    t = clamp01(t); return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ fonts & text
FONTS = {
    'anton': 'anton.ttf', 'bebas': 'bebas.ttf', 'g4': 'grotesk400.ttf', 'g5': 'grotesk500.ttf', 'g7': 'grotesk700.ttf',
    'm4': 'mono400.ttf', 'm7': 'mono700.ttf', 'm8': 'mono800.ttf', 'i3': 'inter300.ttf', 'i4': 'inter400.ttf',
    'i6': 'inter600.ttf', 'i8': 'inter800.ttf', 'i9': 'inter900.ttf', 'u8': 'unbounded800.ttf', 'u9': 'unbounded900.ttf',
    'dejavu': 'DejaVuSans.ttf', 'sc5': 'notosc500.ttf', 'sc7': 'notosc700.ttf', 'sc9': 'notosc900.ttf',
}


@functools.lru_cache(maxsize=256)
def font(key, size):
    p = FONTS[key]
    return ImageFont.truetype(p if p.startswith('/') else FD + p, int(size))


def _is_cjk(ch):
    o = ord(ch)
    return o >= 0x2E80 and not (0x2000 <= o <= 0x206F)


_CMAPS = {}


def has_glyph(key, ch):
    if key not in _CMAPS:
        from fontTools.ttLib import TTFont
        p = FONTS[key]
        _CMAPS[key] = set(TTFont(p if p.startswith('/') else FD + p).getBestCmap().keys())
    return ord(ch) in _CMAPS[key]


@functools.lru_cache(maxsize=4096)
def text_mask(text, fkey, size, tracking=0.0, cjk_key=None):
    """Return (alpha float32 HxW, baseline_y, advances list, pad). tracking in em units. Per-glyph font fallback."""
    f = font(fkey, size)
    asc, desc = f.getmetrics()
    pad = int(size * 0.25) + 4
    xs = []; x = 0.0
    for ch in text:
        if ch == ' ' or has_glyph(fkey, ch):
            ff = f
        elif _is_cjk(ch) or ch in '，。：；！？“”《》、（）…':
            ff = font(cjk_key or 'sc7', size)
        elif has_glyph('dejavu', ch):
            ff = font('dejavu', size * 0.92)
        else:
            ff = font('sc7', size)
        adv = ff.getlength(ch)
        xs.append((ch, x, adv, ff))
        x += adv + tracking * size
    width = int(math.ceil(x - (tracking * size if text else 0))) + 2 * pad
    hh = asc + desc + 2 * pad
    im = Image.new('L', (max(width, 1), hh), 0)
    d = ImageDraw.Draw(im)
    for ch, cx, adv, ff in xs:
        if ff is f:
            d.text((pad + cx, pad), ch, font=ff, fill=255)
        else:  # align baselines of fallback glyphs
            fa = ff.getmetrics()[0]
            d.text((pad + cx, pad + asc - fa), ch, font=ff, fill=255)
    a = np.asarray(im, np.float32) / 255.0
    # trim vertical to ink bounds but keep baseline info
    return a, pad + asc, [(ch, pad + cx, adv) for ch, cx, adv, ff in xs], pad


def text_size(text, fkey, size, tracking=0.0, cjk_key=None):
    a, base, adv, pad = text_mask(text, fkey, size, tracking, cjk_key)
    return a.shape[1] - 2 * pad, a.shape[0] - 2 * pad


@functools.lru_cache(maxsize=512)
def outline_mask(text, fkey, size, tracking=0.0, width=3):
    a, _, _, _ = text_mask(text, fkey, size, tracking)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * width + 1, 2 * width + 1))
    d = cv2.dilate(a, k)
    return np.clip(d - a, 0, 1)


def blend(canvas, mask, x0, y0, color, alpha=1.0, mode='over'):
    """composite a float mask at integer position (top-left) onto canvas"""
    if alpha <= 0.001:
        return
    h, w = mask.shape[:2]
    X0, Y0 = max(0, x0), max(0, y0)
    X1, Y1 = min(W, x0 + w), min(H, y0 + h)
    if X1 <= X0 or Y1 <= Y0:
        return
    m = mask[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0]
    reg = canvas[Y0:Y1, X0:X1]
    c = np.asarray(color, np.float32)
    if m.ndim == 2:
        m = m[..., None]
    m = m * alpha
    if mode == 'add':
        reg += m * c
    elif mode == 'mul':
        reg *= (1 - m) + m * c
    elif mode == 'sub':
        reg -= m * c
        np.maximum(reg, 0, out=reg)
    else:
        reg *= (1 - m)
        reg += m * c


def warp_mask(mask, scale=1.0, rot=0.0, skew=0.0, sx=None, sy=None):
    """scale/rotate a mask about its centre; returns new mask and centre offset"""
    sx = scale if sx is None else sx
    sy = scale if sy is None else sy
    h, w = mask.shape
    if abs(sx - 1) < 1e-4 and abs(sy - 1) < 1e-4 and abs(rot) < 1e-4 and abs(skew) < 1e-4:
        return mask
    c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    A = np.array([[c * sx, -s * sy + skew * sx], [s * sx, c * sy]])
    corners = np.array([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]) @ A.T
    nw = int(math.ceil(corners[:, 0].max() - corners[:, 0].min())) + 2
    nh = int(math.ceil(corners[:, 1].max() - corners[:, 1].min())) + 2
    M = np.zeros((2, 3))
    M[:, :2] = A
    M[:, 2] = np.array([nw / 2, nh / 2]) - A @ np.array([w / 2, h / 2])
    interp = cv2.INTER_AREA if max(sx, sy) < 0.7 else cv2.INTER_LINEAR
    return cv2.warpAffine(mask, M, (nw, nh), flags=interp)


def draw_text(canvas, text, fkey, size, x, y, color=WHITE, alpha=1.0, anchor='mm', scale=1.0, rot=0.0,
              tracking=0.0, mode='over', skew=0.0, reveal=None, sx=None, sy=None, cjk=None, outline=0, blur=0):
    """anchor: first char l/m/r horizontal, second t/m/b vertical (relative to cap box)"""
    if not text or alpha <= 0.001:
        return (0, 0)
    if outline:
        a = outline_mask(text, fkey, size, tracking, outline)
        _, base, _, pad = text_mask(text, fkey, size, tracking, cjk)
    else:
        a, base, _, pad = text_mask(text, fkey, size, tracking, cjk)
    if reveal is not None:  # left->right wipe 0..1
        a = a.copy(); cut = int(pad + (a.shape[1] - 2 * pad) * clamp01(reveal))
        a[:, cut:] = 0
    if blur > 0:
        a = cv2.GaussianBlur(a, (0, 0), blur)
    tw, th = a.shape[1] - 2 * pad, a.shape[0] - 2 * pad
    # vertical reference: cap-height box ~ from (base - 0.72*size) to base
    f = font(fkey, size)
    asc, desc = f.getmetrics()
    cap_top = base - size * (0.72 if fkey not in ('anton', 'bebas') else 0.86)
    cy_box = (cap_top + base) / 2
    ax = {'l': pad, 'm': pad + tw / 2, 'r': pad + tw}[anchor[0]]
    ay = {'t': cap_top, 'm': cy_box, 'b': base}[anchor[1]]
    s_x = scale if sx is None else sx
    s_y = scale if sy is None else sy
    if abs(s_x - 1) < 1e-4 and abs(s_y - 1) < 1e-4 and abs(rot) < 1e-4 and abs(skew) < 1e-4:
        blend(canvas, a, int(round(x - ax)), int(round(y - ay)), color, alpha, mode)
    else:
        h, w = a.shape
        m2 = warp_mask(a, scale, rot, skew, s_x, s_y)
        # position of anchor after transform relative to new centre
        c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
        A = np.array([[c * s_x, -s * s_y + skew * s_x], [s * s_x, c * s_y]])
        off = A @ np.array([ax - w / 2, ay - h / 2])
        nx = x - off[0] - m2.shape[1] / 2
        ny = y - off[1] - m2.shape[0] / 2
        blend(canvas, m2, int(round(nx)), int(round(ny)), color, alpha, mode)
    return (tw * s_x, th * s_y)


def char_layout(text, fkey, size, tracking=0.0):
    """per-char centres (relative to string centre) for kinetic typography"""
    a, base, adv, pad = text_mask(text, fkey, size, tracking)
    tw = a.shape[1] - 2 * pad
    out = []
    for ch, cx, w_ in adv:
        out.append((ch, cx - pad + w_ / 2 - tw / 2))
    return out, tw


def kinetic(canvas, text, fkey, size, x, y, t, color=WHITE, stagger=0.04, dur=0.35, tracking=0.0,
            style='rise', mode='over', alpha=1.0, seed=0):
    """animated per-char entrance; t in seconds since start"""
    chars, tw = char_layout(text, fkey, size, tracking)
    r = np.random.default_rng(seed)
    n = len(chars)
    for i, (ch, cx) in enumerate(chars):
        if ch == ' ':
            continue
        k = (t - i * stagger) / dur
        if k <= 0:
            continue
        e = e_out5(k)
        if style == 'rise':
            draw_text(canvas, ch, fkey, size, x + cx, y + (1 - e) * size * 0.6, color, alpha * clamp01(k * 2.5), 'mm',
                      scale=1.0, mode=mode)
        elif style == 'slam':
            sc = 1 + (1 - e_out3(k)) * 1.2
            draw_text(canvas, ch, fkey, size, x + cx, y, color, alpha * clamp01(k * 4), 'mm', scale=sc, mode=mode)
        elif style == 'scramble':
            if k < 1:
                glyph = chr(int(r.integers(65, 91))) if r.random() < 0.8 else r.choice(list('#%&@$*<>/\\01'))
                draw_text(canvas, glyph, fkey, size, x + cx, y, mixc(color, CYAN, 0.6), alpha * 0.9, 'mm', mode=mode)
            else:
                draw_text(canvas, ch, fkey, size, x + cx, y, color, alpha, 'mm', mode=mode)
        elif style == 'spin':
            draw_text(canvas, ch, fkey, size, x + cx, y, color, alpha * clamp01(k * 3), 'mm',
                      sx=1.0, sy=max(0.05, e), rot=(1 - e) * 30, mode=mode)
    return tw


# ------------------------------------------------------------------ backgrounds
_yy, _xx = np.mgrid[0:H, 0:W].astype(np.float32)
_R = np.sqrt(((_xx - W / 2) / (W / 2)) ** 2 + ((_yy - H / 2) / (H / 2)) ** 2)
VIGNETTE = np.clip(1.08 - 0.42 * _R ** 2.2, 0.25, 1.0)[..., None].astype(np.float32)


def make_bg(c1=(0.020, 0.030, 0.065), c0=(0.004, 0.005, 0.012), cx=0.5, cy=0.45, rad=1.1):
    r = np.sqrt(((_xx - W * cx) / (W * 0.5)) ** 2 + ((_yy - H * cy) / (H * 0.5)) ** 2) / rad
    t = np.clip(1 - r, 0, 1) ** 1.6
    bg = np.asarray(c0, np.float32) + t[..., None] * (np.asarray(c1, np.float32) - np.asarray(c0, np.float32))
    return bg.astype(np.float32)


BG_MAIN = make_bg()
BG_WARM = make_bg((0.06, 0.025, 0.03), (0.006, 0.004, 0.006))
BG_VIOLET = make_bg((0.04, 0.02, 0.08), (0.004, 0.003, 0.01))
BG_TEAL = make_bg((0.0, 0.05, 0.06), (0.002, 0.006, 0.008))


def dot_grid(canvas, spacing=48, color=(0.12, 0.16, 0.24), alpha=1.0, offset=(0, 0), r=1):
    ox, oy = offset
    xs = np.arange((ox % spacing), W, spacing).astype(int)
    ys = np.arange((oy % spacing), H, spacing).astype(int)
    c = np.asarray(color, np.float32) * alpha
    for dy in range(-r + 1, r):
        for dx in range(-r + 1, r):
            yy = np.clip(ys + dy, 0, H - 1); xx = np.clip(xs + dx, 0, W - 1)
            canvas[np.ix_(yy, xx)] += c
    if r == 1:
        canvas[np.ix_(ys, xs)] += c


def line_grid(canvas, spacing=96, color=(0.05, 0.07, 0.11), offset=(0, 0), thick=1):
    ox, oy = offset
    c = np.asarray(color, np.float32)
    for x in np.arange(ox % spacing, W, spacing).astype(int):
        canvas[:, x:x + thick] += c
    for y in np.arange(oy % spacing, H, spacing).astype(int):
        canvas[y:y + thick, :] += c


# ------------------------------------------------------------------ 3D
def rx(a):
    c, s = math.cos(a), math.sin(a); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], np.float32)


def ry(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]], np.float32)


def rz(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], np.float32)


class Cam:
    def __init__(self, pos, target=(0, 0, 0), fov=50, up=(0, 1, 0), roll=0.0, cx=W / 2, cy=H / 2):
        self.pos = np.asarray(pos, np.float32)
        tg = np.asarray(target, np.float32)
        f = tg - self.pos; f /= np.linalg.norm(f)
        u = np.asarray(up, np.float32)
        r = np.cross(u, f); r /= np.linalg.norm(r)
        u = np.cross(f, r)
        if roll:
            c, s = math.cos(roll), math.sin(roll)
            r, u = r * c + u * s, -r * s + u * c
        self.R = np.stack([r, -u, f])  # camera space: x right, y down, z forward
        self.f = (H / 2) / math.tan(math.radians(fov) / 2)
        self.cx, self.cy = cx, cy

    def project(self, P):
        Pc = (np.asarray(P, np.float32) - self.pos) @ self.R.T
        z = Pc[:, 2]
        zs = np.maximum(z, 1e-3)
        x = self.cx + self.f * Pc[:, 0] / zs
        y = self.cy + self.f * Pc[:, 1] / zs
        return np.stack([x, y], 1), z


def orbit(radius, az, el, target=(0, 0, 0)):
    t = np.asarray(target, np.float32)
    return t + radius * np.array([math.sin(az) * math.cos(el), math.sin(el), -math.cos(az) * math.cos(el)], np.float32)


def splat(canvas, xy, color, w=None, sigma=0.0, z=None, soft=0.85, gain=2.2):
    """additive bilinear point splat, softened with a small gaussian inside the points' bbox"""
    xy = np.asarray(xy, np.float32)
    n = len(xy)
    if n == 0:
        return
    col_ = np.asarray(color, np.float32)
    if col_.ndim == 1:
        col_ = np.broadcast_to(col_, (n, 3))
    if w is not None:
        col_ = col_ * np.asarray(w, np.float32)[:, None]
    m = (xy[:, 0] >= 1) & (xy[:, 0] < W - 2) & (xy[:, 1] >= 1) & (xy[:, 1] < H - 2)
    if z is not None:
        m &= np.asarray(z) > 0.05
    xy = xy[m]; col_ = col_[m]
    if len(xy) == 0:
        return
    pad = 6
    bx0 = max(0, int(xy[:, 0].min()) - pad); by0 = max(0, int(xy[:, 1].min()) - pad)
    bx1 = min(W, int(xy[:, 0].max()) + pad + 2); by1 = min(H, int(xy[:, 1].max()) + pad + 2)
    lw, lh = bx1 - bx0, by1 - by0
    layer = np.zeros((lh, lw, 3), np.float32)
    x0 = np.floor(xy[:, 0]).astype(np.int32); y0 = np.floor(xy[:, 1]).astype(np.int32)
    fx = xy[:, 0] - x0; fy = xy[:, 1] - y0
    x0 -= bx0; y0 -= by0
    flat = layer.reshape(-1, 3)
    for dx, dy, wt in ((0, 0, (1 - fx) * (1 - fy)), (1, 0, fx * (1 - fy)), (0, 1, (1 - fx) * fy), (1, 1, fx * fy)):
        idx = (y0 + dy) * lw + (x0 + dx)
        for c in range(3):
            flat[:, c] += np.bincount(idx, weights=col_[:, c] * wt, minlength=lw * lh)[:lw * lh].astype(np.float32)
    if sigma > 0:
        layer = cv2.GaussianBlur(layer, (0, 0), sigma) * (2 * math.pi * sigma * sigma) ** 0.5
    elif soft > 0:
        layer = cv2.GaussianBlur(layer, (5, 5), soft) * gain
    canvas[by0:by1, bx0:bx1] += layer


def dots(canvas, xy, radii, colors, alpha=1.0, mode='add'):
    """draw anti-aliased discs (for < few thousand points)"""
    layer = np.zeros_like(canvas) if mode == 'add' else canvas
    xy = np.asarray(xy); radii = np.broadcast_to(np.asarray(radii, np.float32), (len(xy),))
    colors = np.asarray(colors, np.float32)
    if colors.ndim == 1:
        colors = np.broadcast_to(colors, (len(xy), 3))
    for (x, y), r, c in zip(xy, radii, colors):
        if -20 < x < W + 20 and -20 < y < H + 20 and r > 0.2:
            cv2.circle(layer, (int(x * 16), int(y * 16)), max(1, int(r * 16)), tuple(float(v * alpha) for v in c), -1,
                       cv2.LINE_AA, 4)
    if mode == 'add':
        canvas += layer


def _bbox(pts, pad=8):
    pts = np.asarray(pts, np.float64).reshape(-1, 2)
    pts = pts[np.isfinite(pts).all(1)]
    if len(pts) == 0:
        return None
    x0 = int(max(0, np.floor(pts[:, 0].min()) - pad)); y0 = int(max(0, np.floor(pts[:, 1].min()) - pad))
    x1 = int(min(W, np.ceil(pts[:, 0].max()) + pad)); y1 = int(min(H, np.ceil(pts[:, 1].max()) + pad))
    if x1 <= x0 or y1 <= y0:
        return None
    return x0, y0, x1, y1


def lines(canvas, P1, P2, colors, thick=1, alpha=1.0, mode='add', layer=None):
    P1 = np.asarray(P1, np.float64); P2 = np.asarray(P2, np.float64)
    if len(P1) == 0:
        return
    colors = np.asarray(colors, np.float32)
    if colors.ndim == 1:
        colors = np.broadcast_to(colors, (len(P1), 3))
    th = np.broadcast_to(np.asarray(thick), (len(P1),))
    ok = (np.abs(P1) < 1e5).all(1) & (np.abs(P2) < 1e5).all(1)
    P1, P2, colors, th = P1[ok], P2[ok], colors[ok], th[ok]
    if len(P1) == 0:
        return
    bb = _bbox(np.concatenate([P1, P2]), 8 + int(th.max()))
    if bb is None:
        return
    x0, y0, x1, y1 = bb
    L = np.zeros((y1 - y0, x1 - x0, 3), np.float32)
    off = np.array([x0, y0])
    A = ((P1 - off) * 16).astype(np.int64); B = ((P2 - off) * 16).astype(np.int64)
    for a, b, c, t in zip(A, B, colors, th):
        cv2.line(L, (int(a[0]), int(a[1])), (int(b[0]), int(b[1])), tuple(float(v * alpha) for v in c), int(max(1, t)),
                 cv2.LINE_AA, 4)
    canvas[y0:y1, x0:x1] += L


def polyline(canvas, pts, color, thick=2, alpha=1.0, closed=False, mode='add'):
    pts = np.asarray(pts, np.float64)
    if len(pts) < 2:
        return
    bb = _bbox(pts, 8 + int(thick))
    if bb is None:
        return
    x0, y0, x1, y1 = bb
    L = np.zeros((y1 - y0, x1 - x0, 3), np.float32)
    cv2.polylines(L, [((pts - [x0, y0]) * 16).astype(np.int32)], closed, tuple(float(v * alpha) for v in color),
                  int(thick), cv2.LINE_AA, 4)
    canvas[y0:y1, x0:x1] += L


def rect(canvas, x0, y0, x1, y1, color, alpha=1.0, mode='over', thick=-1):
    x0, y0, x1, y1 = int(round(x0)), int(round(y0)), int(round(x1)), int(round(y1))
    if thick < 0:
        X0, Y0, X1, Y1 = max(0, min(x0, x1)), max(0, min(y0, y1)), min(W, max(x0, x1)), min(H, max(y0, y1))
        if X1 <= X0 or Y1 <= Y0:
            return
        reg = canvas[Y0:Y1, X0:X1]
        c = np.asarray(color, np.float32)
        if mode == 'add':
            reg += c * alpha
        else:
            reg *= (1 - alpha); reg += c * alpha
    else:
        if mode == 'add':
            L = np.zeros_like(canvas)
            cv2.rectangle(L, (x0, y0), (x1, y1), tuple(float(v * alpha) for v in color), thick, cv2.LINE_AA)
            canvas += L
        else:
            cv2.rectangle(canvas, (x0, y0), (x1, y1), tuple(float(v) for v in color), thick, cv2.LINE_AA)


def rrect_mask(w, h, r):
    m = np.zeros((h, w), np.float32)
    r = int(min(r, w // 2, h // 2))
    cv2.rectangle(m, (r, 0), (w - r - 1, h - 1), 1.0, -1)
    cv2.rectangle(m, (0, r), (w - 1, h - r - 1), 1.0, -1)
    for cx, cy in ((r, r), (w - r - 1, r), (r, h - r - 1), (w - r - 1, h - r - 1)):
        cv2.circle(m, (cx, cy), r, 1.0, -1, cv2.LINE_AA)
    return m


def rrect(canvas, x0, y0, w, h, r, color, alpha=1.0, mode='over'):
    if w < 2 or h < 2:
        return
    blend(canvas, rrect_mask(int(w), int(h), r), int(x0), int(y0), color, alpha, mode)


def rrect_outline(canvas, x0, y0, w, h, r, color, thick=2, alpha=1.0, mode='add'):
    if w < 4 or h < 4:
        return
    m = rrect_mask(int(w), int(h), r)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * thick + 1, 2 * thick + 1))
    o = m - cv2.erode(m, k)
    blend(canvas, o, int(x0), int(y0), color, alpha, mode)


# ------------------------------------------------------------------ post
def bloom(canvas, thr=0.55, strength=0.9):
    small = cv2.resize(canvas, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    b = np.maximum(small - thr, 0)
    b1 = cv2.GaussianBlur(b, (0, 0), 2.5)
    s2 = cv2.resize(b, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    b2 = cv2.GaussianBlur(s2, (0, 0), 5)
    b2 = cv2.resize(b2, (W // 4, H // 4), interpolation=cv2.INTER_LINEAR)
    s3 = cv2.resize(b, (W // 16, H // 16), interpolation=cv2.INTER_AREA)
    b3 = cv2.GaussianBlur(s3, (0, 0), 6)
    b3 = cv2.resize(b3, (W // 4, H // 4), interpolation=cv2.INTER_LINEAR)
    comb = b1 * 0.9 + b2 * 0.9 + b3 * 1.0
    canvas += cv2.resize(comb, (W, H), interpolation=cv2.INTER_LINEAR) * strength


def tonemap(c):
    k = 0.78
    over = c > k
    if over.any():
        c[over] = k + (1 - k) * np.tanh((c[over] - k) / (1 - k))
    return c


_grain = [np.random.default_rng(i).normal(0, 1, (H // 2, W // 2)).astype(np.float32) for i in range(6)]
GRAIN = [cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)[..., None] for g in _grain]


def glitch_slices(canvas, amount, seed, n=10):
    r = np.random.default_rng(seed)
    for _ in range(n):
        y = int(r.integers(0, H - 20)); h = int(r.integers(6, 80))
        sh = int(r.normal(0, amount))
        canvas[y:y + h] = np.roll(canvas[y:y + h], sh, axis=1)
        if r.random() < 0.3:
            ch = int(r.integers(0, 3))
            canvas[y:y + h, :, ch] = np.roll(canvas[y:y + h, :, ch], int(sh * 0.6), axis=1)


def chroma(canvas, px):
    if px < 0.5:
        return canvas
    s = 1 + px / (W / 2)
    out = canvas.copy()
    for ch, sc in ((0, s), (2, 1 / s)):
        M = np.float32([[sc, 0, (1 - sc) * W / 2], [0, sc, (1 - sc) * H / 2]])
        out[..., ch] = cv2.warpAffine(canvas[..., ch], M, (W, H), borderMode=cv2.BORDER_REFLECT101)
    return out


def zoom_frame(canvas, scale, dx=0.0, dy=0.0, rot=0.0):
    if abs(scale - 1) < 1e-4 and abs(dx) < 0.05 and abs(dy) < 0.05 and abs(rot) < 1e-4:
        return canvas
    M = cv2.getRotationMatrix2D((W / 2, H / 2), rot, scale)
    M[0, 2] += dx; M[1, 2] += dy
    return cv2.warpAffine(canvas, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT101)


def radial_blur(canvas, amount, steps=5):
    if amount < 0.002:
        return canvas
    acc = canvas.copy()
    for i in range(1, steps + 1):
        s = 1 + amount * i / steps
        acc += zoom_frame(canvas, s)
    return acc / (steps + 1)


# ------------------------------------------------------------------ misc geometry helpers
def fib_sphere(n, r=1.0):
    i = np.arange(n) + 0.5
    phi = np.arccos(1 - 2 * i / n)
    th = np.pi * (1 + 5 ** 0.5) * i
    return np.stack([np.cos(th) * np.sin(phi), np.cos(phi), np.sin(th) * np.sin(phi)], 1).astype(np.float32) * r


def depth_fade(z, near, far):
    return np.clip(1 - (z - near) / (far - near), 0.05, 1.0)
```

### 19/30 · `The_Age_of_Intelligence-source/src/cut_sheets.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/cut_sheets.py", "lines": 26, "final_newline": true, "sha256": "bd32e8b7837ddd8e6bbf79385d28b4716ff4c69ab1464dccd6d9aa746fb9d91f", "original_sha256": "bd32e8b7837ddd8e6bbf79385d28b4716ff4c69ab1464dccd6d9aa746fb9d91f"} -->
```python
"""[补全] QA contact sheets: grab frame (cut + 2) of every shot from a rendered video, 16 per sheet.
usage: python3 src/cut_sheets.py build/AGE_OF_INTELLIGENCE_1080p60.mp4
"""
import os, sys, glob, subprocess
import cv2, numpy as np
import timeline as TL

video = sys.argv[1]
d = os.path.join(TL.BUILD, 'cuts'); os.makedirs(d, exist_ok=True)
for f in glob.glob(os.path.join(d, 'c*.png')):
    os.remove(f)
frames = [int(round(s['b0'] * TL.FPB)) + 2 for s in TL.SHOTS]
sel = '+'.join(f'eq(n\\,{f})' for f in frames)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', video, '-vf', f"select='{sel}',scale=480:270",
                '-vsync', '0', os.path.join(d, 'c%03d.png')], check=True)
files = sorted(glob.glob(os.path.join(d, 'c*.png')))
for k in range(0, len(files), 16):
    ims = [cv2.imread(f) for f in files[k:k + 16]]
    for i, im in enumerate(ims):
        s = TL.SHOTS[k + i]
        cv2.putText(im, f"{k + i} b{s['b0']} {s['scene']}", (6, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
    while len(ims) < 16:
        ims.append(np.zeros_like(ims[0]))
    grid = np.vstack([np.hstack(ims[r * 4:(r + 1) * 4]) for r in range(4)])
    cv2.imwrite(os.path.join(TL.BUILD, f'cutsheet{k // 16}.png'), grid)
print('sheets written to', TL.BUILD)
```

### 20/30 · `The_Age_of_Intelligence-source/src/make_srt.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/make_srt.py", "lines": 15, "final_newline": true, "sha256": "2acc7a40829a895f0ab613cda7f21cf241e16369df3afb5bd46fdda1c1e59fb6", "original_sha256": "2acc7a40829a895f0ab613cda7f21cf241e16369df3afb5bd46fdda1c1e59fb6"} -->
```python
"""[补全] Write the bilingual SRT from timeline.SUBS (was an inline snippet in the session)."""
import os, sys
import timeline as TL


def ts(sec):
    ms = int(round(sec * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(TL.BUILD, 'AGE_OF_INTELLIGENCE_subtitles.srt')
blocks = [f'{i}\n{ts(b0 * TL.BEAT)} --> {ts(b1 * TL.BEAT)}\n{en}\n{zh}\n'
          for i, (b0, b1, en, zh) in enumerate(TL.SUBS, 1)]
open(out, 'w', encoding='utf-8').write('\n'.join(blocks))
print('wrote', out, len(blocks), 'cues')
```

### 21/30 · `The_Age_of_Intelligence-source/src/music.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/music.py", "lines": 755, "final_newline": true, "sha256": "ecd67859af920889d6c27e672bd14d0535159c31d9af3296047fe7d7a36348aa", "original_sha256": "ecd67859af920889d6c27e672bd14d0535159c31d9af3296047fe7d7a36348aa"} -->
```python
"""Original score + sound design, synthesized from scratch on the timeline's beat grid.
F minor, 128.57 BPM, i–VI–III–VII (Fm Db Ab Eb). Outputs master.wav + analysis for visuals.
"""
import os
import numpy as np, json
from scipy.signal import lfilter, butter, sosfilt, fftconvolve
from scipy.ndimage import maximum_filter1d
from scipy.io import wavfile
import timeline as TL

SR, SPB = TL.SR, TL.SPB
TAIL_BEATS = 2
N = (TL.END_BEAT + TAIL_BEATS) * SPB
rng = np.random.default_rng(7)


def bs(b):  # beat -> sample
    return int(round(b * SPB))


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l * 1.414, x * r * 1.414], 1)


def add(buf, start, sig):
    if start >= len(buf):
        return
    if start < 0:
        sig = sig[-start:]; start = 0
    n = min(len(sig), len(buf) - start)
    if n <= 0:
        return
    if buf.ndim == 2 and sig.ndim == 1:
        sig = stereo(sig)
    buf[start:start + n] += sig[:n]


def saw(f, n, ph0=None):
    ph0 = rng.random() if ph0 is None else ph0
    dt = f / SR
    t = (ph0 + dt * np.arange(n)) % 1.0
    y = 2 * t - 1
    m = t < dt; x = t[m] / dt; y[m] -= x + x - x * x - 1
    m = t > 1 - dt; x = (t[m] - 1) / dt; y[m] -= x * x + x + x + 1
    return y


def adsr(n, a=0.005, d=0.1, s=0.8, r=0.05, sustain_len=None):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    hold = n - r if sustain_len is None else sustain_len
    env = np.full(n, s, np.float64)
    ta = min(a, n)
    env[:ta] = np.linspace(0, 1, a, endpoint=False)[:ta]
    if a < n:
        td = min(d, n - a)
        env[a:a + td] = np.linspace(1, s, d, endpoint=False)[:td]
    if 0 < hold < n:
        rel = np.linspace(1, 0, n - hold) ** 2
        env[hold:] *= rel
    return env


def supersaw(m, n, voices=7, detune=0.14, width=1.0):
    out = np.zeros((n, 2))
    dets = np.linspace(-detune, detune, voices)
    for i, d in enumerate(dets):
        pan = (i / (voices - 1) * 2 - 1) * width
        g = 1.0 if abs(d) < 1e-6 else 0.75
        out += stereo(saw(mtof(m + d), n) * g, pan)
    return out / voices * 1.6


def biquad(fc, q, kind):
    w = 2 * np.pi * np.clip(fc, 20, SR * 0.45) / SR
    al = np.sin(w) / (2 * q); c = np.cos(w)
    if kind == 'lp':
        b = [(1 - c) / 2, 1 - c, (1 - c) / 2]
    elif kind == 'hp':
        b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]
    else:  # bandpass (constant peak)
        b = [al, 0, -al]
    a = [1 + al, -2 * c, 1 - al]
    return np.array(b) / a[0], np.array(a) / a[0]


def tvf(x, fc, q=0.8, kind='lp', block=128):
    """time-varying biquad; fc is scalar or per-sample array"""
    x = np.asarray(x, np.float64)
    mono = x.ndim == 1
    X = x[:, None] if mono else x
    fc = np.broadcast_to(np.asarray(fc, np.float64), (len(X),))
    Y = np.zeros_like(X)
    for ch in range(X.shape[1]):
        zi = np.zeros(2)
        for s in range(0, len(X), block):
            b, a = biquad(fc[s], q, kind)
            Y[s:s + block, ch], zi = lfilter(b, a, X[s:s + block, ch], zi=zi)
    return Y[:, 0] if mono else Y


def sfilt(x, kind, f, order=2):
    sos = butter(order, f, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x, axis=0)


def noise(n):
    return rng.standard_normal(n)


def make_ir(rt=2.4, length=3.0, bright=6000, predelay=0.012, seed=1):
    r = np.random.default_rng(seed)
    n = int(length * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-6.9 * t / rt)[:, None]
    ir = sfilt(ir, 'low', bright, 1)
    # darken tail
    ir = ir * (0.55 + 0.45 * np.exp(-t / 0.4))[:, None]
    pd = int(predelay * SR)
    ir = np.vstack([np.zeros((pd, 2)), ir])
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    return ir


IR_BIG = make_ir(2.8, 3.4, 5500, 0.02, 1)
IR_ROOM = make_ir(0.9, 1.2, 7000, 0.006, 2)


def reverb(x, ir, wet):
    y = np.stack([fftconvolve(x[:, 0], ir[:, 0])[:len(x)], fftconvolve(x[:, 1], ir[:, 1])[:len(x)]], 1)
    return y * wet


def delay(x, beats, fb=0.45, taps=5, pingpong=True):
    d = bs(beats)
    y = np.zeros_like(x)
    g = 1.0
    for k in range(1, taps + 1):
        g *= fb
        sh = np.zeros_like(x)
        sh[d * k:] = x[:-d * k]
        if pingpong:
            sh = sh[:, ::-1] if k % 2 else sh
        y += sh * g
    return y


# ------------------------------------------------------------------ drum one-shots
def kick_s(hard=1.0):
    n = int(0.5 * SR); t = np.arange(n) / SR
    f = 46 + 130 * np.exp(-t / 0.032) + 260 * np.exp(-t / 0.004)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / (0.30 * hard))
    body = np.tanh(body * 1.8) / np.tanh(1.8)
    click = sfilt(noise(n), 'high', 3000) * np.exp(-t / 0.0025) * 0.35
    return (body + click) * 0.95


def clap_s():
    n = int(0.6 * SR); t = np.arange(n) / SR
    env = np.zeros(n)
    for k, o in enumerate([0, 0.010, 0.021, 0.030]):
        m = t >= o
        env[m] += np.exp(-(t[m] - o) / (0.006 if k < 3 else 0.16)) * (1 if k < 3 else 0.9)
    x = sfilt(noise(n), 'band', [800, 3200], 2) * env
    return x * 1.3


def snare_s(pitch=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * 185 * pitch * t) + 0.5 * np.sin(2 * np.pi * 330 * pitch * t)) * np.exp(-t / 0.06)
    nz = sfilt(noise(n), 'band', [1200 * pitch, 9000], 2) * np.exp(-t / 0.12)
    return (tone * 0.6 + nz * 1.1) * 0.9


def metal(n):
    t = np.arange(n) / SR
    fs = [205.3, 304.4, 369.6, 522.7, 540.0, 800.0]
    x = sum(np.sign(np.sin(2 * np.pi * f * t + rng.random() * 6)) for f in fs)
    return x / 6


def hat_s(open_=False):
    n = int((0.35 if open_ else 0.08) * SR); t = np.arange(n) / SR
    x = sfilt(noise(n) * 0.7 + metal(n) * 0.6, 'high', 7500, 2)
    return x * np.exp(-t / (0.12 if open_ else 0.022)) * 1.0


def crash_s():
    n = int(2.6 * SR); t = np.arange(n) / SR
    x = sfilt(noise(n) * 0.8 + metal(n) * 0.5, 'high', 3500, 2) * np.exp(-t / 0.9)
    return x * 0.5


def impact_s():
    n = int(3.0 * SR); t = np.arange(n) / SR
    f = 28 + 60 * np.exp(-t / 0.25)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 1.1)
    sub = np.tanh(sub * 2.2) * 0.9
    nz = sfilt(noise(n), 'low', 2500, 2) * np.exp(-t / 0.35) * 0.5
    return sub + nz


# ------------------------------------------------------------------ song data
CH = [  # chord tones (mid register), root midi (sub), bass root
    dict(tones=[65, 68, 72], root=29, name='Fm'),
    dict(tones=[65, 68, 73], root=37, name='Db'),
    dict(tones=[63, 68, 72], root=32, name='Ab'),
    dict(tones=[63, 67, 70], root=39, name='Eb'),
]


def chord_at_beat(b):
    return CH[int(b // 4) % 4]


HOOK = [  # (16th step, midi, len steps) over 4 bars
    (0, 72, 2), (2, 72, 2), (4, 68, 2), (6, 72, 2), (8, 75, 3), (11, 72, 2), (13, 70, 1), (14, 68, 2),
    (16, 77, 3), (19, 75, 3), (22, 72, 2), (24, 73, 2), (26, 72, 2), (28, 70, 2), (30, 68, 2),
    (32, 72, 2), (34, 72, 2), (36, 68, 2), (38, 72, 2), (40, 75, 3), (43, 77, 2), (45, 75, 1), (46, 72, 2),
    (48, 70, 3), (51, 68, 3), (54, 67, 2), (56, 68, 2), (58, 70, 2), (60, 72, 4),
]

drums = np.zeros((N, 2)); bass = np.zeros((N, 2)); synth = np.zeros((N, 2)); fx = np.zeros((N, 2))
send_big = np.zeros((N, 2))
kicks = []; snares = []; impacts = []

K = kick_s(); CL = clap_s(); HC = hat_s(False); HO = hat_s(True); CR = crash_s(); IM = impact_s()


def hit(buf, b, sample, gain=1.0, pan=0.0, send=0.0):
    s = stereo(sample * gain, pan) if sample.ndim == 1 else sample * gain
    add(buf, bs(b), s)
    if send:
        add(send_big, bs(b), s * send)


def kick(b, g=1.0):
    hit(drums, b, K, g); kicks.append((b, g))


# ------------------------------------------------------------------ arrangement: drums
# verse
for b in range(16, 48):
    kick(b, 0.7 if b < 32 else 0.8)
    hit(drums, b + 0.5, HC, 0.55 if b < 32 else 0.7, pan=0.25)
    if b >= 32:
        if b % 2 == 1:
            hit(drums, b, CL, 0.55, send=0.25); snares.append(b)
        hit(drums, b + 0.25, HC, 0.25, pan=-0.3); hit(drums, b + 0.75, HC, 0.3, pan=-0.3)
hit(drums, 16, CR, 0.6, send=0.3)
hit(drums, 32, CR, 0.5, send=0.3)
# build 1: kick 4/4 then snare roll
for b in range(48, 60):
    kick(b, 0.9)
roll = []
roll += [48 + i for i in range(8)]
roll += [56 + i * 0.5 for i in range(8)]
roll += [60 + i * 0.25 for i in range(8)]
roll += [62 + i * 0.125 for i in range(8)]
for i, b in enumerate(roll):
    g = 0.25 + 0.55 * (i / len(roll)) ** 1.3
    hit(drums, b, snare_s(1.0 + 0.6 * i / len(roll)), g, pan=0.0, send=0.25); snares.append(b)
for b in range(60, 63):
    kick(b, 0.8)
    kick(b + 0.5, 0.6)


def drop_drums(b0, b1, heavy=False, halftime=None):
    for b in range(b0, b1):
        if halftime and halftime[0] <= b < halftime[1]:
            if b % 4 == 0:
                kick(b, 1.0); kick(b + 1.5, 0.8)
            if b % 4 == 2:
                hit(drums, b, CL, 0.9, send=0.35); hit(drums, b, snare_s(0.9), 0.5); snares.append(b)
            for s in range(4):
                hit(drums, b + s * 0.25, HC, 0.35 if s % 2 else 0.5, pan=0.3 * (1 if s % 2 else -1))
            continue
        kick(b, 1.0)
        if b % 2 == 1:
            hit(drums, b, CL, 1.0, send=0.3); snares.append(b)
            if heavy:
                hit(drums, b, snare_s(1.1), 0.4)
        hit(drums, b + 0.5, HO, 0.55, pan=0.2)
        for s in [0.25, 0.75]:
            hit(drums, b + s, HC, 0.4, pan=-0.35)
        if heavy:
            hit(drums, b + 0.125 * 7, HC, 0.18, pan=0.5)


drop_drums(64, 96)
hit(drums, 64, CR, 0.9, send=0.4); hit(drums, 80, CR, 0.7, send=0.4)
hit(fx, 64, IM, 1.0); impacts.append(64)
# break: sparse
for b in range(104, 112):
    if b % 4 == 0:
        kick(b, 0.6)
    for s in range(4):
        hit(drums, b + s * 0.25, HC, 0.12 + 0.1 * (s == 2), pan=0.4)
hit(drums, 96, CR, 0.6, send=0.5)
# build 2
for b in range(112, 120):
    kick(b, 0.95)
for b in np.arange(120, 124, 0.5):
    kick(b, 0.9)
for b in np.arange(124, 126, 0.25):
    kick(b, 0.85)
roll2 = [112 + i for i in range(8)] + [120 + i * 0.5 for i in range(8)] + \
        [124 + i * 0.25 for i in range(8)] + [126 + i * 0.125 for i in range(8)]
for i, b in enumerate(roll2):
    g = 0.3 + 0.6 * (i / len(roll2)) ** 1.2
    hit(drums, b, snare_s(1.0 + 0.9 * i / len(roll2)), g, send=0.25); snares.append(b)
hit(drums, 112, CR, 0.6, send=0.3)
# drop 2
drop_drums(128, 172, heavy=True, halftime=(168, 172))
for b in [128, 144, 160, 168]:
    hit(drums, b, CR, 0.8, send=0.4)
hit(fx, 128, IM, 1.1); impacts.append(128)
# final stutter bar 172-176: snare roll + kick 16ths accel
for i in range(16):
    b = 172 + i * 0.25
    hit(drums, b, snare_s(1.0 + i / 16), 0.35 + 0.5 * i / 16, send=0.2); snares.append(b)
    if i % 2 == 0:
        kick(b, 0.8)
# outro
hit(fx, 176, IM, 0.9); impacts.append(176); hit(drums, 176, CR, 0.9, send=0.5); kick(176, 1.0)
hit(fx, 184, IM, 0.8); impacts.append(184); hit(drums, 184, CR, 0.7, send=0.6); kick(184, 0.9)

# ------------------------------------------------------------------ bass
def sub_note(b0, b1, m, g=0.55):
    n = bs(b1) - bs(b0); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * mtof(m) * t) * adsr(n, 0.004, 0.05, 1.0, 0.03)
    add(bass, bs(b0), stereo(np.tanh(x * 1.3) * g))


def mid_bass(b0, b1, m, g=0.25, cutoff=900):
    n = bs(b1) - bs(b0)
    x = (saw(mtof(m + 12), n) + 0.6 * saw(mtof(m + 12.08), n)) * adsr(n, 0.003, 0.08, 0.8, 0.03)
    x = sfilt(x, 'low', cutoff, 2)
    add(bass, bs(b0), stereo(x * g))


for b in range(16, 48, 4):
    c = chord_at_beat(b)
    for k in range(4):
        sub_note(b + k, b + k + 1, c['root'], 0.3 if b < 32 else 0.36)
for b in range(48, 63, 1):
    c = chord_at_beat(b); sub_note(b, b + 1, c['root'], 0.36)
for rng_ in [(64, 96), (128, 172)]:
    for b in range(*rng_):
        c = chord_at_beat(b)
        sub_note(b, b + 1, c['root'], 0.46)
        mid_bass(b + 0.5, b + 1, c['root'], 0.3, 1400)
# growl / FM wobble bass for drop 2
def growl(b0, b1, m, rate_beats=0.5, g=0.22):
    n = bs(b1) - bs(b0); t = np.arange(n) / SR
    f = mtof(m + 12)
    lfo = 0.5 - 0.5 * np.cos(2 * np.pi * t / (rate_beats * TL.BEAT))
    idx = 0.5 + 5.5 * lfo
    mod = np.sin(2 * np.pi * f * 1.0 * t) * idx
    car = np.sin(2 * np.pi * f * t + mod) + 0.5 * saw(f * 1.005, n)
    x = np.tanh(car * 2.2)
    x = tvf(x, 250 + 3200 * lfo, 1.4, 'lp', 64)
    x *= adsr(n, 0.004, 0.05, 1, 0.02)
    add(bass, bs(b0), stereo(x * g))


for b in range(128, 172):
    if 168 <= b < 172:
        continue
    c = chord_at_beat(b)
    if b % 2 == 0:
        growl(b + 0.5, b + 1.0, c['root'], 0.25, 0.27)
    else:
        growl(b + 0.25, b + 1.0, c['root'], 0.375, 0.27)
for b in range(168, 172):
    c = chord_at_beat(b)
    if b % 4 in (0, 2):
        sub_note(b, b + 2, c['root'], 0.6)
        growl(b, b + 2, c['root'], 1.0, 0.24)
for b in range(96, 112, 4):  # break sub
    c = chord_at_beat(b); sub_note(b, b + 4, c['root'], 0.3)
sub_note(176, 184, 29, 0.45); sub_note(184, 196, 29, 0.4)

# ------------------------------------------------------------------ synths
def pad(b0, b1, tones, g=0.12, detune=0.25, attack=0.6, release=1.2):
    n = bs(b1) - bs(b0) + int(release * SR)
    x = sum(supersaw(m, n, 5, detune) for m in tones)
    x *= adsr(n, attack, 0.5, 0.9, release)[:, None]
    add(synth, bs(b0), x * g); add(send_big, bs(b0), x * g * 0.8)


# intro pad + break pad + outro pad
for b in range(0, 16, 4):
    c = CH[0] if b < 8 else CH[(b // 4) % 4]
    pad(b, b + 4, [m - 12 for m in c['tones']] + [c['tones'][0]], 0.04, attack=1.2)
for b in range(96, 112, 4):
    c = chord_at_beat(b); pad(b, b + 4, [m - 12 for m in c['tones']] + c['tones'], 0.04, attack=0.9)
pad(176, 184, [53, 56, 60, 65, 68, 72], 0.05, attack=0.05)
pad(184, 196, [53, 56, 60, 63, 65, 72, 79], 0.05, attack=0.05, release=2.5)


def bell(m, n, g=0.3):
    t = np.arange(n) / SR; f = mtof(m)
    idx = 3.0 * np.exp(-t / 0.25)
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t / 0.9)
    return x * g


# intro glass notes, break hook on bells, outro hook bells
for i, (st, m, ln) in enumerate(HOOK[::2]):
    pass
for b, m in [(2, 84), (3.5, 80), (5, 87), (6.5, 84), (10, 84), (11.5, 89), (13, 87), (14.5, 84)]:
    x = stereo(bell(m, int(2.5 * SR), 0.06), pan=rng.uniform(-0.6, 0.6))
    add(synth, bs(b), x); add(send_big, bs(b), x * 0.9)
for rep in range(2):
    for st, m, ln in HOOK:
        b = 96 + rep * 8 + st * 0.5 / 1.0 * 0.25 * 2  # half speed: 16th -> 8th
        b = 96 + rep * 16 + st * 0.25
        if b >= 112:
            continue
        x = stereo(bell(m + 12, int(1.8 * SR), 0.07), pan=0.3 * np.sin(st))
        add(synth, bs(b), x); add(send_big, bs(b), x)
for st, m, ln in HOOK[:16]:
    b = 186 + st * 0.5
    if b < 197:
        x = stereo(bell(m + 12, int(2.2 * SR), 0.08 * (1 - (b - 186) / 12)), pan=0.4 * np.sin(st))
        add(synth, bs(b), x); add(send_big, bs(b), x * 1.4)

# pluck arp (verse + build 1) through one time-varying filter
arp = np.zeros((N, 2))
ARP_PAT = [0, 1, 2, 3, 2, 1, 3, 4, 0, 2, 1, 3, 4, 3, 2, 1]
for b in np.concatenate([np.arange(16, 63, 0.25), np.arange(112, 127, 0.25)]):
    c = chord_at_beat(b)
    tones = c['tones'] + [c['tones'][0] + 12, c['tones'][1] + 12]
    step = int(round((b - 16) * 4)) % 16
    m = tones[ARP_PAT[step]]
    n = int(0.3 * SR)
    x = (saw(mtof(m), n) * 0.7 + np.sign(np.sin(2 * np.pi * mtof(m + 12) * np.arange(n) / SR)) * 0.2)
    x *= np.exp(-np.arange(n) / SR / 0.13)
    add(arp, bs(b), stereo(x * 0.26, pan=0.35 * np.sin(step * 0.9)))
tt = np.arange(N) / SR
beatpos = tt / TL.BEAT
env16 = np.exp(-((beatpos * 4) % 1) * TL.BEAT / 4 / 0.045)
base = np.interp(beatpos, [16, 32, 48, 56, 63, 112, 120, 127], [500, 1100, 2200, 3500, 7000, 1500, 3500, 9000])
arp = tvf(arp, base * (1 + 2.5 * env16), 1.1, 'lp', 128)
arp[:bs(16)] = 0
synth += arp; send_big += arp * 0.25
synth += delay(arp, 0.75, 0.35, 4) * 0.35

# drop chords + lead
lead = np.zeros((N, 2)); chords = np.zeros((N, 2))


def drop_music(b0, bars, oct_up=False):
    for bar in range(bars):
        b = b0 + bar * 4
        c = chord_at_beat(b)
        n = bs(4)
        x = sum(supersaw(m, n, 7, 0.16) for m in c['tones'] + [c['tones'][0] - 12])
        x *= adsr(n, 0.004, 0.2, 0.85, 0.05)[:, None]
        add(chords, bs(b), x * 0.13)
    for rep in range(bars // 4):
        for st, m, ln in HOOK:
            b = b0 + rep * 16 + st * 0.25
            n = int(ln * 0.25 * TL.BEAT * SR)
            for mm, gg in ([(m, 1.0), (m + 12, 0.45)] if oct_up else [(m, 1.0)]):
                x = supersaw(mm, n + int(0.08 * SR), 7, 0.12)
                x *= adsr(n + int(0.08 * SR), 0.004, 0.08, 0.8, 0.08, sustain_len=n)[:, None]
                add(lead, bs(b), x * 0.2 * gg)


drop_music(64, 8)
drop_music(128, 10, oct_up=True)
# half-time switch bars 168-171: sustained big chords (stutter handled later)
for b in [168, 170]:
    c = chord_at_beat(b); n = bs(2)
    x = sum(supersaw(m, n, 7, 0.2) for m in c['tones'] + [c['tones'][0] + 12])
    add(chords, bs(b), x * adsr(n, 0.003, 0.3, 0.7, 0.1)[:, None] * 0.08)
# stutter bar source: repeated chord
for b in [172]:
    c = CH[3]; n = bs(4)
    x = sum(supersaw(m, n, 7, 0.16) for m in c['tones'] + [c['tones'][0] + 12])
    add(chords, bs(b), x * np.linspace(0.5, 1, n)[:, None] * 0.08)
# outro final chord stab
n = bs(3)
x = sum(supersaw(m, n, 7, 0.18) for m in [53, 60, 65, 68, 72, 77])
add(chords, bs(176), x * adsr(n, 0.003, 0.5, 0.4, 1.0)[:, None] * 0.08)

lead = sfilt(lead, 'low', 7000, 2)
chords = sfilt(chords, 'low', 5200, 2)
synth += lead + chords
send_big += lead * 0.35 + chords * 0.2
synth += delay(lead, 0.75, 0.4, 4) * 0.28

# risers
def riser(b0, b1, g=0.35):
    n = bs(b1) - bs(b0); t = np.linspace(0, 1, n)
    x = noise(n)
    x = tvf(x, 300 * (30 ** t), 2.5, 'bp', 128) * (t ** 2) * g
    f = mtof(53) * (4 ** t)
    x += saw(1, n) * 0  # placeholder for phase continuity
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(ph * k + k) / k for k in range(1, 5)) * (t ** 2.5) * g * 0.35
    s = np.stack([x + tone * 0.8, x * 0.9 + tone], 1)
    add(fx, bs(b0), s); add(send_big, bs(b0), s * 0.6)


riser(48, 63, 0.4)
riser(112, 127, 0.5)
riser(172, 176, 0.35)

# ------------------------------------------------------------------ sound design cues
def sd_key(space=False, seed=0):
    r = np.random.default_rng(seed)
    n = int(0.05 * SR); t = np.arange(n) / SR
    x = sfilt(r.standard_normal(n), 'band', [1500, 6000] if not space else [500, 2500], 2) * np.exp(-t / 0.004)
    x += np.sin(2 * np.pi * (140 if space else 220) * t) * np.exp(-t / 0.01) * 0.4
    return stereo(x * (0.5 if not space else 0.6), r.uniform(-0.3, 0.3))


def sd_blip(f=1200, n_s=0.09, g=0.18):
    n = int(n_s * SR); t = np.arange(n) / SR
    ff = f * (1 + 0.5 * (t / n_s))
    x = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t / 0.03)
    return stereo(x * g)


def sd_whoosh(length=0.6, pan=0.5, g=0.35):
    n = bs(length); t = np.linspace(0, 1, n)
    fc = 300 + 3500 * np.sin(np.pi * t) ** 2
    x = tvf(noise(n), fc, 1.8, 'bp', 64) * np.sin(np.pi * t) ** 1.5 * g
    p = -pan + 2 * pan * t
    l = np.cos((p + 1) * np.pi / 4); r_ = np.sin((p + 1) * np.pi / 4)
    return np.stack([x * l, x * r_], 1) * 1.4


def sd_glitch(length=0.12, seed=0):
    r = np.random.default_rng(seed)
    n = bs(length)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        seg = int(r.uniform(0.008, 0.03) * SR)
        f = r.choice([220, 440, 880, 1760, 3520, 130])
        tt_ = np.arange(seg) / SR
        kind = r.integers(3)
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * f * tt_))
        elif kind == 1:
            s = r.standard_normal(seg)
        else:
            s = np.round(np.sin(2 * np.pi * f * tt_) * 3) / 3
        x[pos:pos + seg] = s[:n - pos] * r.uniform(0.3, 0.8)
        pos += seg
    x = np.round(x * 8) / 8
    return stereo(x * 0.22, r.uniform(-0.5, 0.5))


def sd_data_hit():
    n = int(0.25 * SR); t = np.arange(n) / SR
    sq = np.sign(np.sin(2 * np.pi * 1760 * t)) * np.exp(-t / 0.02) * 0.15
    cr = np.round(rng.standard_normal(n) * 2) / 2 * np.exp(-t / 0.03) * 0.12
    th = np.sin(2 * np.pi * (60 + 80 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.08) * 0.35
    return stereo(sq + cr + th)


def sd_reverse_suck(length_b=1.0):
    n = bs(length_b); t = np.arange(n) / SR
    x = sfilt(noise(n), 'band', [300, 6000], 2) * np.exp(-t / 0.18) * 0.5
    x += np.sin(2 * np.pi * 45 * t) * np.exp(-t / 0.3) * 0.4
    x = x[::-1] * np.linspace(0.2, 1, n)
    x = x * (1 - np.exp(-np.arange(n)[::-1] / (0.004 * SR)))  # hard stop at downbeat
    return np.stack([x, x * 0.95], 1)


def sd_swell(length_b=4, rev=True):
    n = bs(length_b); t = np.linspace(0, 1, n)
    x = tvf(noise(n), 400 + 5000 * t ** 2, 1.2, 'bp', 128) * (t ** 2.2) * 0.25
    return np.stack([x, np.roll(x, 300)], 1)


def sd_hit_soft():
    n = int(2.0 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * (38 + 40 * np.exp(-t / 0.1)) * t) * np.exp(-t / 0.6) * 0.6
    x += sfilt(noise(n), 'low', 1200, 2) * np.exp(-t / 0.15) * 0.25
    return stereo(x)


def sd_success():
    out = np.zeros((int(1.6 * SR), 2))
    for i, m in enumerate([84, 91, 96]):
        add(out, int(i * 0.07 * SR), stereo(bell(m, int(1.4 * SR), 0.12), 0.3 * (i - 1)))
    return out


def sd_shimmer():
    out = np.zeros((int(3.5 * SR), 2))
    for i, m in enumerate([89, 92, 96, 99, 101, 104, 108]):
        add(out, int(i * 0.045 * SR), stereo(bell(m, int(3.0 * SR), 0.06), np.sin(i * 1.7) * 0.8))
    return out


def sd_zap():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 2400 * np.exp(-t / 0.08) + 90
    x = np.sin(2 * np.pi * np.cumsum(f) / SR + 2 * np.sin(2 * np.pi * 57 * t)) * np.exp(-t / 0.12)
    return stereo(np.tanh(x * 2) * 0.22)


for b, kind, kw in TL.SFX:
    if kind == 'key':
        s = sd_key(kw.get('space', False), kw.get('seed', 0))
    elif kind == 'enter':
        s = sd_key(True, 999) * 1.4; add(fx, bs(b + 0.05), sd_blip(1500, 0.12, 0.12))
    elif kind in ('blip', 'tick'):
        s = sd_blip(kw.get('f', 1200), 0.07 if kind == 'blip' else 0.035, 0.14 if kind == 'blip' else 0.09)
    elif kind == 'whoosh':
        s = sd_whoosh(kw.get('length', 0.6), kw.get('pan', 0.5), 0.33)
    elif kind == 'swish':
        s = sd_whoosh(kw.get('length', 0.3), 0.8, 0.26)
    elif kind == 'glitch':
        s = sd_glitch(kw.get('length', 0.1), kw.get('seed', 0))
    elif kind == 'data_hit':
        s = sd_data_hit()
    elif kind == 'sub_drop_in':
        s = sd_reverse_suck(1.0)
    elif kind in ('swell', 'swell_rev'):
        L = kw.get('length', 4); s = sd_swell(L)
    elif kind == 'hit_soft':
        s = sd_hit_soft()
    elif kind == 'success':
        s = sd_success()
    elif kind == 'shimmer':
        s = sd_shimmer()
    elif kind == 'zap':
        s = sd_zap()
    else:
        continue
    add(fx, bs(b), s)
    add(send_big, bs(b), s * 0.3)

# ------------------------------------------------------------------ sidechain
sc = np.ones(N)
L = int(0.30 * SR); tt_sc = np.arange(L) / SR
curve = 1 - 0.82 * np.exp(-tt_sc / 0.075) * (1 - np.exp(-tt_sc / 0.002))
curve[:int(0.004 * SR)] = np.minimum(curve[:int(0.004 * SR)], 1 - 0.82 * np.linspace(0, 1, int(0.004 * SR)))
for b, g in kicks:
    s = bs(b); e = min(N, s + L)
    sc[s:e] = np.minimum(sc[s:e], 1 - (1 - curve[:e - s]) * min(1, g))
bass *= sc[:, None]
synth *= (0.35 + 0.65 * sc)[:, None]

# ------------------------------------------------------------------ busses, reverb, master
wet = reverb(send_big, IR_BIG, 0.55)
room = reverb(drums * 0.25, IR_ROOM, 0.5)
music_bus = synth + wet * (0.5 + 0.5 * sc)[:, None]
drums_bus = drums + room
drums_bus = sfilt(drums_bus, 'high', 30, 2)

# build filter sweeps (highpass on music during builds)
hpf = np.full(N, 20.0)
for a, b_, f0, f1 in [(56, 63, 20, 900), (120, 127, 20, 1200)]:
    s, e = bs(a), bs(b_)
    hpf[s:e] = f0 * (f1 / f0) ** np.linspace(0, 1, e - s)
music_bus = tvf(music_bus, hpf, 0.7, 'hp', 256)
bass_hp = bass.copy()
for a, b_ in [(60, 63), (124, 127)]:
    s, e = bs(a), bs(b_)
    bass_hp[s:e] *= np.linspace(1, 0.2, e - s)[:, None]

mix = drums_bus * 0.5 + bass_hp * 0.85 + music_bus * 2.8

# tape stop + silence in the two "gaps" before drops, stutter in bar 43
def tape_stop(x, b0, b1):
    s, e = bs(b0), bs(b1)
    n = e - s
    rate = np.linspace(1, 0, n) ** 1.3
    pos = s + np.cumsum(rate)
    for ch in range(2):
        x[s:e, ch] = np.interp(pos, np.arange(len(x)), x[:, ch]) * np.linspace(1, 0.3, n)
    return x


for g0 in [63, 127]:
    mix = tape_stop(mix, g0 - 0.5, g0)
    s, e = bs(g0), bs(g0 + 1)
    tail = np.exp(-np.arange(e - s) / (0.05 * SR))
    mix[s:e] *= tail[:, None] * 0.0 + 0.0
    mix[s:e] += (wet[s:e] * 0.25) * np.linspace(1, 0, e - s)[:, None]


def stutter(x, b0, b1, slot_b, rep_b):
    for s0 in np.arange(b0, b1, slot_b):
        s, e = bs(s0), bs(s0 + slot_b)
        chunk = x[s:s + bs(rep_b)].copy()
        fade = min(64, len(chunk) // 4)
        chunk[:fade] *= np.linspace(0, 1, fade)[:, None]; chunk[-fade:] *= np.linspace(1, 0, fade)[:, None]
        reps = int(np.ceil((e - s) / len(chunk)))
        x[s:e] = np.tile(chunk, (reps, 1))[:e - s]
    return x


music_only = music_bus * 2.8 + bass_hp * 0.85
stut = stutter(music_only.copy(), 172, 174, 0.25, 0.125)
stut = stutter(stut, 174, 176, 0.25, 0.0625)
s, e = bs(172), bs(176)
mix[s:e] = drums_bus[s:e] * 0.5 + (stut[s:e] - music_only[s:e]) * 0 + (stut[s:e] * np.linspace(0.8, 1.1, e - s)[:, None]) * 1.0
mix[s:e] += 0  # stutter bus already scaled below

mix += fx * 0.75

# master: highpass, soft clip, limiter
mix = sfilt(mix, 'high', 25, 2)
mix = np.tanh(mix * 1.1) / 1.1
env = maximum_filter1d(np.max(np.abs(mix), 1), size=int(0.004 * SR))
thr = 0.89
g = np.minimum(1.0, thr / np.maximum(env, 1e-9))
# smooth gain (fast attack via min-filter already, release 80ms)
a = np.exp(-1 / (0.08 * SR))
g = lfilter([1 - a], [1, -a], g)
g = np.minimum(g, thr / np.maximum(env, 1e-9))
mix = mix * g[:, None]
# end fade
fe = bs(TL.END_BEAT); fs_ = bs(TL.END_BEAT - 3)
mix[fs_:fe] *= np.linspace(1, 0, fe - fs_)[:, None] ** 1.5
mix[fe:] = 0
mix = mix[:bs(TL.END_BEAT)]
mix *= 0.95 / np.max(np.abs(mix))
wavfile.write(os.path.join(TL.BUILD, 'master.wav'), SR, (mix * 32767).astype(np.int16))

# ------------------------------------------------------------------ analysis for visuals
fpb = TL.FPB
nf = TL.N_FRAMES
spf = SR // TL.FPS
mono = np.abs(mix).mean(1)
low = np.abs(sfilt(mix.mean(1), 'low', 150, 2))
rms = np.array([np.sqrt(np.mean(mono[i * spf:(i + 1) * spf] ** 2)) for i in range(nf)])
lowr = np.array([np.sqrt(np.mean(low[i * spf:(i + 1) * spf] ** 2)) for i in range(nf)])
json.dump(dict(kicks=sorted(set(float(b) for b, g in kicks)), snares=sorted(set(float(b) for b in snares)),
               impacts=impacts, rms=(rms / rms.max()).round(4).tolist(), low=(lowr / lowr.max()).round(4).tolist()),
          open(os.path.join(TL.BUILD, 'audio_analysis.json'), 'w'))
print('done', mix.shape, 'peak', np.max(np.abs(mix)), 'rms dB', 20 * np.log10(np.sqrt(np.mean(mix ** 2))))

if __name__ == '__main__':
    for nm, arr in [('drums', drums_bus), ('bass', bass_hp), ('music', music_bus), ('fx', fx), ('lead', lead), ('chords', chords), ('arp', arp)]:
        out = []
        for s_, e_, n_ in TL.SECTIONS:
            a_, b_ = s_ * SPB, e_ * SPB
            out.append(f"{n_}:{20*np.log10(np.sqrt(np.mean(arr[a_:b_]**2))+1e-9):6.1f}")
        print(f"{nm:7s}", ' '.join(out))
```

### 22/30 · `The_Age_of_Intelligence-source/src/qa_frames.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/qa_frames.py", "lines": 14, "final_newline": true, "sha256": "dab2918738c214b5b5c4389e6efc60440b8e7201795a8d484ee19d675dba80e8", "original_sha256": "dab2918738c214b5b5c4389e6efc60440b8e7201795a8d484ee19d675dba80e8"} -->
```python
"""Render the first 3 frames + midpoint of every shot and flag frames that read as blank."""
import render as R, timeline as TL, numpy as np, sys
bad = []
for i, s in enumerate(TL.SHOTS):
    f0 = int(round(s['b0'] * TL.FPB)); f1 = int(round(s['b1'] * TL.FPB))
    for f in [f0, f0 + 1, f0 + 2, (f0 + f1) // 2, f1 - 1]:
        img = R.render_frame(f).astype(np.float32)
        luma = img @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        ratio = float((luma > 0.06 * 255).mean())
        if ratio < 0.03:
            bad.append((i, s['scene'], f, round(ratio, 4)))
print('flagged', len(bad))
for b in bad:
    print(b)
```

### 23/30 · `The_Age_of_Intelligence-source/src/render.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/render.py", "lines": 202, "final_newline": true, "sha256": "1952122c29f1ea159afc61b4cce4352e7b9bd42c09c06de44afeadb4b6d0bf7b", "original_sha256": "1952122c29f1ea159afc61b4cce4352e7b9bd42c09c06de44afeadb4b6d0bf7b"} -->
```python
"""Frame renderer: scene dispatch, beat-reactive post, HUD, subtitles, ffmpeg piping."""
import sys, json, math, argparse, subprocess, time
import numpy as np, cv2
import timeline as TL
import core as C
import scenes as SC

import os
AN = json.load(open(os.path.join(TL.BUILD, 'audio_analysis.json')))
KICKS = np.array(AN['kicks'])
RMS = np.array(AN['rms']); LOW = np.array(AN['low'])
IMPACTS = [64, 128, 176, 184]


class Ctx:
    pass


def kick_env(b, tau=0.09):
    past = KICKS[KICKS <= b + 1e-6]
    if len(past) == 0:
        return 0.0
    dt = (b - past[-1]) * TL.BEAT
    return math.exp(-dt / tau)


def find_shot(f):
    b = f / TL.FPB
    for i, s in enumerate(TL.SHOTS):
        if s['b0'] <= b + 1e-9 < s['b1']:
            return i, s
    return len(TL.SHOTS) - 1, TL.SHOTS[-1]


def chapter_at(b):
    cur = TL.CHAPTERS[0]
    for c in TL.CHAPTERS:
        if b >= c[0]:
            cur = c
    return cur


# ---------------------------------------------------------------- overlays
def draw_hud(cv, b, f, ctx):
    a = 0.55 * ctx.post.get('hud', 1.0)
    if a <= 0.01:
        return
    col = (0.75, 0.82, 0.95)
    # corner brackets
    L, m = 26, 40
    for (x, y, sx, sy) in ((m, m, 1, 1), (C.W - m, m, -1, 1), (m, C.H - m, 1, -1), (C.W - m, C.H - m, -1, -1)):
        C.rect(cv, x, y, x + sx * L, y + sy * 2, col, a * 0.8)
        C.rect(cv, x, y, x + sx * 2, y + sy * L, col, a * 0.8)
    C.draw_text(cv, 'THE AGE OF INTELLIGENCE', 'm7', 15, 80, 62, col, a, 'lm', tracking=0.18)
    num, name = chapter_at(b)[1], chapter_at(b)[2]
    C.draw_text(cv, f'{num} / {name}', 'm7', 15, C.W - 80, 62, col, a, 'rm', tracking=0.18)
    secs = f / TL.FPS
    tc = f'{int(secs // 60):02d}:{int(secs % 60):02d}:{int(f % TL.FPS):02d}'
    C.draw_text(cv, tc, 'm4', 15, 80, C.H - 62, col, a * 0.9, 'lm', tracking=0.12)
    bar = int(b // 4) + 1; beat = int(b % 4) + 1
    C.draw_text(cv, f'BAR {bar:02d}.{beat}  ·  {TL.BPM:.2f} BPM', 'm4', 15, C.W - 80, C.H - 62, col, a * 0.9, 'rm',
                tracking=0.12)
    # progress line
    p = f / (TL.N_FRAMES - 1)
    C.rect(cv, 300, C.H - 63, C.W - 420, C.H - 62, (0.3, 0.35, 0.45), a * 0.6)
    C.rect(cv, 300, C.H - 64, 300 + (C.W - 720) * p, C.H - 61, C.CYAN, a * 1.2)
    # year badge
    if ctx.year_badge:
        yb, alpha = ctx.year_badge
        C.draw_text(cv, yb, 'anton', 64, 80, 128, C.WHITE, alpha, 'lm')
        C.rect(cv, 80, 168, 80 + 60 * alpha, 171, C.CYAN, alpha)


def draw_subs(cv, b, inv=False):
    for s in TL.SUBS:
        b0, b1, en, zh = s
        if b0 <= b < b1:
            prev = [q for q in TL.SUBS if abs(q[1] - b0) < 1e-6]
            fin = C.e_out3((b - b0) / 0.35)
            if prev:  # adjoining subtitle: swap instantly with a small slide, no dip to empty
                fin = 0.55 + 0.45 * fin
            fout = C.clamp01((b1 - b) / 0.2)
            nxt = [q for q in TL.SUBS if abs(q[0] - b1) < 1e-6]
            if nxt:
                fout = 1.0
            a = fin * fout
            if b1 >= TL.END_BEAT - 1:
                a = fin
            dy = (1 - fin) * 10
            y_en, y_zh = C.H - 150 + dy, C.H - 108 + dy
            # soft shadow plate
            for txt, fk, sz, y, cjk in ((en, 'i6', 31, y_en, None), (zh, 'sc5', 28, y_zh, 'sc5')):
                m, base, _, pad = C.text_mask(txt, fk, sz, 0.0, cjk)
                sh = cv2.GaussianBlur(m, (0, 0), 6) * 0.85
                tw = m.shape[1]
                C.blend(cv, np.clip(sh * 1.6, 0, 1), int(C.W / 2 - tw / 2), int(y - base + sz * 0.36), (1, 1, 1) if inv else (0, 0, 0), a * (0.6 if inv else 0.9))
            C.draw_text(cv, en, 'i6', 31, C.W / 2, y_en, (0.04, 0.05, 0.08) if inv else (0.97, 0.98, 1.0), a, 'mm')
            C.draw_text(cv, zh, 'sc5', 28, C.W / 2, y_zh, (0.0, 0.25, 0.4) if inv else (0.62, 0.90, 1.0), a * 0.95, 'mm', cjk='sc5')
            return


# ---------------------------------------------------------------- frame
def render_frame(f):
    b = f / TL.FPB
    si, shot = find_shot(f)
    ctx = Ctx()
    ctx.f = f; ctx.b = b; ctx.shot = shot; ctx.si = si
    ctx.tb = b - shot['b0']; ctx.dur_b = shot['b1'] - shot['b0']
    ctx.t = ctx.tb * TL.BEAT; ctx.dur = ctx.dur_b * TL.BEAT
    ctx.p = ctx.tb / ctx.dur_b
    ctx.sec = TL.section_at(b)
    ctx.kick = kick_env(b)
    ctx.rms = float(RMS[min(f, len(RMS) - 1)]); ctx.low = float(LOW[min(f, len(LOW) - 1)])
    ctx.rng = np.random.default_rng(si * 1000 + 17)
    ctx.post = dict(punch=0.0, shake=0.0, ca=0.0, flash=0.0, bloom=0.85, thr=0.55, glitch=0.0, invert=False,
                    rblur=0.0, hud=1.0, rot=0.0, grain=0.026)
    ctx.year_badge = None
    ctx.year_fly = None
    cv = C.BG_MAIN.copy()
    ctx.cv = cv
    SC.SCENES[shot['scene']](ctx)
    cv = ctx.cv
    P = ctx.post

    # ---- automatic beat-driven motion
    energetic = ctx.sec in ('drop1', 'drop2', 'build1', 'build2')
    fl = ctx.tb * TL.FPB  # frames since cut
    if energetic:
        P['punch'] += 0.028 * ctx.kick
        P['ca'] += 7 * math.exp(-fl / 4)
        P['punch'] += 0.05 * math.exp(-fl / 3.5)
    elif ctx.sec == 'verse':
        P['punch'] += 0.012 * ctx.kick
        P['ca'] += 3 * math.exp(-fl / 4)
    for ib in IMPACTS:
        d = (b - ib) * TL.BEAT
        if 0 <= d < 1.2:
            P['flash'] += 0.75 * math.exp(-d / 0.09)
            P['shake'] += 16 * math.exp(-d / 0.25)
            P['ca'] += 14 * math.exp(-d / 0.18)
            P['rblur'] += 0.05 * math.exp(-d / 0.1)

    C.bloom(cv, P['thr'], P['bloom'])
    if P['rblur'] > 0.003:
        cv = C.radial_blur(cv, P['rblur'])
    if P['glitch'] > 0:
        C.glitch_slices(cv, P['glitch'], f * 7 + 3, n=int(6 + P['glitch'] / 4))
    sh = P['shake']
    r = np.random.default_rng(f)
    dx, dy = (r.normal(0, sh * 0.6), r.normal(0, sh * 0.6)) if sh > 0.3 else (0, 0)
    sc = 1 + P['punch'] + (0.01 + sh / 900 if sh > 0.3 else 0)
    cv = C.zoom_frame(cv, sc, dx, dy, P['rot'])
    cv = C.chroma(cv, P['ca'])
    if P['invert']:
        cv = (1.0 - np.clip(cv, 0, 1)) * np.array([0.80, 0.84, 0.88], np.float32) + 0.015
    if P['flash'] > 0.001:
        cv += P['flash'] * np.array([0.9, 0.95, 1.0], np.float32)
    cv *= C.VIGNETTE
    cv = C.tonemap(cv)
    cv += C.GRAIN[f % 6] * P['grain']
    draw_hud(cv, b, f, ctx)
    if ctx.year_fly:
        SC.draw_year_fly(cv, ctx.year_fly)
    draw_subs(cv, b, P['invert'])
    return np.clip(cv * 255 + 0.5, 0, 255).astype(np.uint8)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--start', type=int, default=0)
    ap.add_argument('--end', type=int, default=TL.N_FRAMES)
    ap.add_argument('--out', default=os.path.join(TL.BUILD, 'out.mp4'))
    ap.add_argument('--stills', default='')
    ap.add_argument('--scale', type=float, default=1.0)
    a = ap.parse_args()
    if a.stills:
        for tok in a.stills.split(','):
            f = int(round(float(tok[1:]) * TL.FPB)) if tok.startswith('b') else int(tok)
            t0 = time.time()
            img = render_frame(f)
            print(f'frame {f} ({time.time() - t0:.2f}s)', flush=True)
            if a.scale != 1:
                img = cv2.resize(img, None, fx=a.scale, fy=a.scale, interpolation=cv2.INTER_AREA)
            os.makedirs(os.path.join(TL.BUILD, 'stills'), exist_ok=True)
            cv2.imwrite(os.path.join(TL.BUILD, 'stills', f'f{f:05d}.png'), img[..., ::-1])
        return
    cmd = ['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{C.W}x{C.H}', '-r',
           str(TL.FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p',
           '-x264-params', 'keyint=60', a.out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.time()
    for f in range(a.start, a.end):
        p.stdin.write(render_frame(f).tobytes())
        if (f - a.start) % 60 == 0:
            el = time.time() - t0
            print(f'{a.out}: {f - a.start}/{a.end - a.start}  {el:.0f}s', flush=True)
    p.stdin.close(); p.wait()
    print('done', a.out, time.time() - t0)


if __name__ == '__main__':
    main()
```

### 24/30 · `The_Age_of_Intelligence-source/src/scenes.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/scenes.py", "lines": 843, "final_newline": true, "sha256": "00c4143efe714541bc08590e3040b0ba0de215c3e49cb5b5c214bbfe00d6fa41", "original_sha256": "00c4143efe714541bc08590e3040b0ba0de215c3e49cb5b5c214bbfe00d6fa41"} -->
```python
"""Scenes part 1: shared helpers, prologue, origins timeline, build 1."""
import math, functools
import numpy as np, cv2
import core as C
from core import W, H, e_out3, e_out5, e_io3, e_in3, e_expo, e_back, ramp, clamp01, lerp, smooth
import timeline as TL

SCENES = {}


def scene(fn):
    SCENES[fn.__name__] = fn
    return fn


# ================================================================ shared helpers
@functools.lru_cache(maxsize=64)
def text_points(text, fkey, size, n, seed=0, tracking=0.0):
    a, base, _, pad = C.text_mask(text, fkey, size, tracking)
    ys, xs = np.nonzero(a > 0.5)
    r = np.random.default_rng(seed)
    idx = r.choice(len(xs), size=min(n, len(xs)), replace=len(xs) < n)
    x = xs[idx] + r.random(len(idx)) - 0.5
    y = ys[idx] + r.random(len(idx)) - 0.5
    cx = (xs.min() + xs.max()) / 2; cy = (ys.min() + ys.max()) / 2
    return np.stack([x - cx, y - cy], 1).astype(np.float32)


@functools.lru_cache(maxsize=8)
def star_box(n=2500, seed=3, spread=(40, 24), depth=60):
    r = np.random.default_rng(seed)
    P = np.stack([r.uniform(-spread[0], spread[0], n), r.uniform(-spread[1], spread[1], n), r.uniform(0, depth, n)], 1)
    return P.astype(np.float32), r.uniform(0.3, 1.0, n).astype(np.float32)


def starfield(cv, travel, color=(0.6, 0.8, 1.0), n=2500, depth=60, bright=1.0, fov=60, streak=0.0, roll=0.0):
    P, lum = star_box(n, 3, (40, 24), depth)
    Q = P.copy()
    Q[:, 2] = (P[:, 2] - travel) % depth + 0.5
    if roll:
        Q = Q @ C.rz(roll).T
    cam = C.Cam((0, 0, 0), (0, 0, 1), fov)
    xy, z = cam.project(Q)
    w = lum * np.clip(1 - z / depth, 0, 1) ** 1.5 * bright * 3.0
    if streak > 0:
        Q2 = Q.copy(); Q2[:, 2] += streak
        xy2, z2 = cam.project(Q2)
        m = w > 0.15
        C.lines(cv, xy[m], xy2[m], np.asarray(color)[None] * w[m, None] * 0.8, 1)
    C.splat(cv, xy, np.asarray(color, np.float32), w, z=z)


def label(cv, text, x, y, t, color=C.WHITE, size=18, align='l', alpha=1.0, fkey='m7', tracking=0.2, speed=40.0):
    """typed label with a small leading tick"""
    n = int(clamp01(t) * speed * 2) if t < 1e8 else len(text)
    shown = text[:max(0, min(len(text), int(t * speed)))]
    if not shown:
        return
    C.draw_text(cv, shown, fkey, size, x, y, color, alpha, align + 'm', tracking=tracking)


def typed(text, t, rate):
    k = int(max(0, t) * rate)
    return text[:k]


def dimmer(cv, k):
    if k > 0:
        cv *= (1 - k)


def year_overlay(ctx, year):
    """big year slams in on the downbeat, then flies to the top-left badge"""
    tb = ctx.tb
    if tb < 0.95:
        p1 = e_out5(tb / 0.12)
        fly = e_io3(ramp(tb, 0.42, 0.95))
        size = 360
        sc = lerp(1.35, 1.0, p1)
        sc = lerp(sc, 64 / size, fly)
        tw, _ = C.text_size(year, 'anton', size)
        x = lerp(W / 2, 80 + tw * (64 / size) / 2, fly)
        y = lerp(H / 2, 128, fly)
        dimmer(ctx.cv, 0.72 * (1 - fly))
        ctx.year_fly = (year, x, y, sc, fly, size)
    else:
        ctx.year_badge = (year, 1.0)


def draw_year_fly(cv, yf):
    year, x, y, sc, fly, size = yf
    C.draw_text(cv, year, 'anton', size, x, y, C.WHITE, 1.0, 'mm', scale=sc)
    if fly < 0.05:
        C.draw_text(cv, year, 'anton', size, x, y, C.CYAN, 0.35 * (1 - fly * 20), 'mm', scale=sc * 1.06, outline=3)


def _patch(cv, x, y, r, fn):
    pad = 4
    x0 = int(math.floor(x - r - pad)); y0 = int(math.floor(y - r - pad))
    n = int(2 * r + 2 * pad + 2)
    X0, Y0, X1, Y1 = max(0, x0), max(0, y0), min(W, x0 + n), min(H, y0 + n)
    if X1 <= X0 or Y1 <= Y0:
        return
    L = np.zeros((Y1 - Y0, X1 - X0, 3), np.float32)
    fn(L, (x - X0) * 16, (y - Y0) * 16)
    cv[Y0:Y1, X0:X1] += L


def glow_circle(cv, x, y, r, color, alpha=1.0, thick=-1):
    if r <= 0.2:
        return
    c = tuple(float(v * alpha) for v in color)
    _patch(cv, x, y, r + max(thick, 0), lambda L, px, py: cv2.circle(L, (int(px), int(py)), int(r * 16), c, thick,
                                                                        cv2.LINE_AA, 4))


def ring(cv, x, y, r, color, thick=2, alpha=1.0, a0=0, a1=360):
    if r <= 0.5:
        return
    c = tuple(float(v * alpha) for v in color)
    _patch(cv, x, y, r + thick, lambda L, px, py: cv2.ellipse(L, (int(px), int(py)), (int(r * 16), int(r * 16)), 0,
                                                                a0, a1, c, thick, cv2.LINE_AA, 4))


def fill_circle(cv, x, y, r, color, alpha=1.0):
    if r <= 0.3:
        return
    m = np.zeros((int(2 * r + 6), int(2 * r + 6)), np.float32)
    cv2.circle(m, (int((r + 3) * 16), int((r + 3) * 16)), int(r * 16), 1.0, -1, cv2.LINE_AA, 4)
    C.blend(cv, m, int(x - r - 3), int(y - r - 3), color, alpha, 'over')


def bezier(p0, p1, p2, n=40):
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2


def travel_dots(cv, pts, k, color, r=4, alpha=1.0):
    """dot travelling along polyline pts at fraction k"""
    if k <= 0 or k >= 1:
        return
    seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    cum = np.concatenate([[0], np.cumsum(seg)])
    d = k * cum[-1]
    i = min(np.searchsorted(cum, d) - 1, len(seg) - 1)
    i = max(i, 0)
    u = (d - cum[i]) / max(seg[i], 1e-6)
    p = pts[i] * (1 - u) + pts[i + 1] * u
    glow_circle(cv, p[0], p[1], r, color, alpha)


def bracket_box(cv, x0, y0, x1, y1, color, alpha=1.0, L=16, th=2):
    for (x, y, sx, sy) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        C.rect(cv, x, y, x + sx * L, y + sy * th, color, alpha, 'add')
        C.rect(cv, x, y, x + sx * th, y + sy * L, color, alpha, 'add')


# ================================================================ PROLOGUE
@scene
def terminal_intro(ctx):
    cv = ctx.cv
    b = ctx.b
    # ambient backdrop from frame 0: glow + faint neural sphere (bookends the end card)
    cv += _INTRO_GLOW
    from scenes2 import draw_brain
    bcam = C.Cam(C.orbit(12.5 - 1.0 * ctx.p, b * 0.05, 0.12), (0, 0, 0), 45)
    draw_brain(cv, bcam, b * TL.BEAT, 3.3, 0.32, (C.CYAN, C.VIOLET))
    starfield(cv, travel=b * 0.8, bright=0.55, color=(0.55, 0.7, 1.0))
    C.dot_grid(cv, 64, (0.05, 0.07, 0.11), alpha=0.6 + 0.4 * ramp(b, 0, 3))
    txt = typed(TL.INTRO_PROMPT, (b - TL.INTRO_TYPE_START), TL.INTRO_TYPE_RATE)
    size = 84
    zoom = 1 + 0.05 * ctx.p
    full_w, _ = C.text_size('> ' + TL.INTRO_PROMPT, 'm7', size)
    x0 = W / 2 - full_w * zoom / 2
    y = H / 2 - 20
    fade = 0.75 + 0.25 * e_out3(ramp(b, 0.0, 0.6))
    C.draw_text(cv, '>', 'm7', size, x0, y, C.CYAN, fade, 'lm', scale=zoom)
    pw, _ = C.text_size('> ', 'm7', size)
    if txt:
        C.draw_text(cv, txt, 'm7', size, x0 + pw * zoom, y, C.WHITE, 1.0, 'lm', scale=zoom)
    tw = C.text_size(txt, 'm7', size)[0] if txt else 0
    blink = (b % 1.0) < 0.55
    done_b = TL.INTRO_TYPE_START + len(TL.INTRO_PROMPT) / TL.INTRO_TYPE_RATE
    if blink or b < done_b:
        cx = x0 + (pw + tw + 8) * zoom
        C.rect(cv, cx, y - size * 0.42 * zoom, cx + size * 0.55 * zoom, y + size * 0.42 * zoom, C.CYAN, 0.9 * fade)
    enter_b = done_b + 0.25
    if b > enter_b:
        k = e_out5((b - enter_b) / 0.8)
        C.rect(cv, W / 2 - 520 * k, y + 80, W / 2 + 520 * k, y + 82, C.CYAN, 0.8, 'add')
        cap = typed('A. M. TURING  ·  COMPUTING MACHINERY AND INTELLIGENCE  ·  MIND, 1950', (b - enter_b - 0.3), 40)
        C.draw_text(cv, cap, 'm4', 20, W / 2, y + 124, C.GREY, 0.95, 'mm', tracking=0.14)
        # hit flash on the text at enter
        g = math.exp(-(b - enter_b) * 3)
        if txt:
            C.draw_text(cv, txt, 'm7', size, x0 + pw * zoom, y, C.CYAN, 0.8 * g, 'lm', scale=zoom, mode='add')
    ctx.post['hud'] = 0.6 + 0.4 * ramp(b, 0.5, 2.5)
    ctx.post['bloom'] = 1.0


_INTRO_GLOW = C.make_bg((0.035, 0.07, 0.13), (0.0, 0.0, 0.0), 0.5, 0.47, 0.95) - C.make_bg((0.0, 0.0, 0.0), (0.0, 0.0, 0.0))


@functools.lru_cache(maxsize=4)
def _num_points(text, n):
    return text_points(text, 'anton', 560, n, 5)


@scene
def year_1950(ctx):
    cv = ctx.cv
    tb, b = ctx.tb, ctx.b
    starfield(cv, travel=b * 1.2 + tb * tb * 0.3, bright=0.5, color=(0.55, 0.7, 1.0))
    C.line_grid(cv, 120, (0.025, 0.035, 0.055), offset=(0, int(-b * 20)))
    size = 560
    push = 1 + 0.08 * e_io3(ctx.p)
    dissolve = e_in3(ramp(tb, 5.2, 8.0))
    # echo outlines pulsing on beats
    pulse = math.exp(-((tb % 1.0) * TL.BEAT) / 0.12)
    if dissolve < 0.98:
        for k in range(4, 0, -1):
            sc = push * (1 + 0.035 * k * (0.5 + 0.5 * pulse))
            C.draw_text(cv, '1950', 'anton', size, W / 2, H / 2 - 70, C.mixc(C.CYAN, C.VIOLET, k / 4),
                        (0.28 - 0.05 * k) * (1 - dissolve), 'mm', scale=sc, outline=2, mode='add')
        # outline + scan fill
        C.draw_text(cv, '1950', 'anton', size, W / 2, H / 2 - 70, C.WHITE, 0.9 * (1 - dissolve), 'mm', scale=push,
                    outline=3, mode='add')
        fillk = e_io3(ramp(tb, 0.2, 3.5))
        a, base, _, pad = C.text_mask('1950', 'anton', size)
        m = a.copy()
        hh = m.shape[0]
        top = pad + (hh - 2 * pad) * (1 - fillk)
        m[:int(top)] = 0
        m2 = C.warp_mask(m, push)
        C.blend(cv, m2, int(W / 2 - m2.shape[1] / 2), int(H / 2 - 70 - m2.shape[0] / 2 + (size * 0.0)),
                (0.92, 0.96, 1.0), 0.95 * (1 - dissolve))
        # scan line
        if 0 < fillk < 1:
            ytop = H / 2 - 70 - (hh / 2 - top) * push
            C.rect(cv, W / 2 - 520, ytop - 1, W / 2 + 520, ytop + 1, C.CYAN, 1.2, 'add')
    if dissolve > 0:
        pts = _num_points('1950', 9000) * push
        r = np.random.default_rng(11)
        vel = r.normal(0, 1, (len(pts), 3)).astype(np.float32)
        vel[:, 2] = np.abs(vel[:, 2]) * 2 + 1
        d = dissolve
        P3 = np.concatenate([pts / 100.0, np.zeros((len(pts), 1), np.float32)], 1)
        P3[:, 1] *= -1
        P3 = P3 + vel * (d ** 1.5) * 6 * r.uniform(0.3, 1, (len(pts), 1)).astype(np.float32)
        cam = C.Cam((0, 0, -12), (0, 0, 0), 50)
        xy, z = cam.project(P3)
        # align projection scale so d=0 matches the 2D text
        k = 100.0 / (cam.f / 12)
        xy = (xy - [W / 2, H / 2]) * k + [W / 2, H / 2 - 70]
        colr = np.where((r.random(len(pts)) < 0.5)[:, None], np.array(C.CYAN)[None], np.array(C.WHITE)[None])
        C.splat(cv, xy, colr.astype(np.float32), np.full(len(pts), 0.9 * (1 - d * 0.6), np.float32))
    cap_a = e_out3(ramp(tb, 1.0, 1.6)) * (1 - dissolve)
    C.draw_text(cv, '“I PROPOSE TO CONSIDER THE QUESTION, ‘CAN MACHINES THINK?’”', 'm7', 24, W / 2, H / 2 + 262,
                C.WHITE, cap_a, 'mm', tracking=0.12)
    C.draw_text(cv, 'A. M. TURING — COMPUTING MACHINERY AND INTELLIGENCE', 'm4', 18, W / 2, H / 2 + 304, C.GREY,
                cap_a * 0.9, 'mm', tracking=0.2)
    ctx.post['punch'] += 0.015 * pulse


# ================================================================ ORIGINS
@functools.lru_cache(maxsize=2)
def _ai_cloud():
    pts = text_points('AI', 'anton', 700, 42000, 9)
    r = np.random.default_rng(2)
    z = r.normal(0, 18, len(pts))
    start = r.normal(0, 1, (len(pts), 3)) * np.array([900, 600, 700])
    delay = r.uniform(0, 0.5, len(pts))
    return pts, z.astype(np.float32), start.astype(np.float32), delay.astype(np.float32)


@scene
def ai_points(ctx):
    cv = ctx.cv
    tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    pts, z, start, delay = _ai_cloud()
    k = np.clip((tb - 0.2 - delay * 0.7) / 1.0, 0, 1)
    k = 1 - (1 - k) ** 4
    tgt = np.concatenate([pts, z[:, None]], 1)
    tgt[:, 1] *= -1
    P = start * (1 - k[:, None]) + tgt * k[:, None]
    # breathing noise
    P[:, 2] += np.sin(P[:, 0] * 0.02 + ctx.t * 3) * 6
    ang = math.radians(-18 + 30 * e_io3(ctx.p))
    P = P @ C.ry(ang).T
    P[:, 1] -= 60
    cam = C.Cam((0, 0, -1600), (0, 0, 0), 40)
    xy, zz = cam.project(P)
    hue = np.clip((pts[:, 0] + 350) / 700, 0, 1)[:, None]
    colr = np.array(C.CYAN)[None] * (1 - hue) + np.array(C.VIOLET)[None] * hue
    colr = colr * 0.65 + 0.35 * (1 - k[:, None]) * np.array(C.WHITE)[None]
    C.splat(cv, xy, colr.astype(np.float32), np.full(len(P), 1.7, np.float32), z=zz)
    a = e_out3(ramp(tb, 1.4, 1.9))
    C.draw_text(cv, 'ARTIFICIAL INTELLIGENCE', 'g7', 40, W / 2, H / 2 + 300, C.WHITE, a, 'mm', tracking=0.35)
    C.draw_text(cv, 'DARTMOUTH COLLEGE  ·  SUMMER 1956', 'm4', 18, W / 2, H / 2 + 348, C.GREY, a * 0.9, 'mm',
                tracking=0.25)
    year_overlay(ctx, ctx.shot['year'])


@scene
def perceptron(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    cx, cy = W / 2 + 40, H / 2 - 30
    ins = [(W / 2 - 520, cy - 240 + i * 160) for i in range(4)]
    appear = e_out5(ramp(tb, 0.35, 0.9))
    r_n = 90 * e_back(ramp(tb, 0.45, 0.95))
    wts = np.array([0.8, -0.4, 0.6, 0.3]) + 0.35 * np.sin(np.array([1, 2, 3, 4]) * 1.3 + math.floor(tb) * 2.1)
    L = np.zeros_like(cv)
    for i, (x, y) in enumerate(ins):
        k = e_out3(ramp(tb, 0.4 + i * 0.06, 0.9 + i * 0.06))
        ex, ey = lerp(x, cx - 90, k), lerp(y, cy, k)
        w = wts[i]
        c = C.CYAN if w > 0 else C.MAG
        th = int(1 + abs(w) * 5)
        cv2.line(L, (int(x * 16 + 44 * 16), int(y * 16)), (int(ex * 16), int(ey * 16)), tuple(float(v) * 0.8 for v in c),
                 th, cv2.LINE_AA, 4)
        # packet travelling each 16th
        ph = (tb * 2 + i * 0.25) % 1.0
        if tb > 1.0:
            travel_dots(cv, np.array([[x + 44, y], [cx - 90, cy]]), ph, C.WHITE, 5, 0.9)
        ring(cv, x, y, 44 * appear, C.WHITE, 2, 0.9)
        C.draw_text(cv, f'x{i + 1}', 'm7', 26, x, y, C.WHITE, appear, 'mm')
        mx, my = lerp(x + 44, cx - 90, 0.45), lerp(y, cy, 0.45) - 22
        C.draw_text(cv, f'{w:+.2f}', 'm4', 20, mx, my, c, appear * k, 'mm')
    cv += L
    lit = math.exp(-((tb % 1.0) * TL.BEAT) / 0.15) if tb > 1 else 0
    glow_circle(cv, cx, cy, max(r_n, 1), (0.05, 0.15, 0.2), 1.0)
    ring(cv, cx, cy, max(r_n, 1), C.CYAN, 3, 1.0 + lit)
    C.draw_text(cv, 'Σ', 'dejavu', 90, cx, cy + 6, C.WHITE, appear, 'mm')
    # step function graph
    gx, gy = cx + 200, cy
    k2 = e_out3(ramp(tb, 0.9, 1.5))
    C.rect(cv, cx + 90, cy - 1, cx + 90 + 110 * k2, cy + 1, C.WHITE, 0.8, 'add')
    pts = np.array([[gx, gy + 60], [gx + 90, gy + 60], [gx + 90, gy - 60], [gx + 180, gy - 60]])
    if k2 > 0:
        C.polyline(cv, pts[:max(2, int(2 + 2 * k2))], C.AMBER, 4, k2)
        C.rect(cv, gx - 10, gy + 90, gx + 190, gy + 91, C.GREY, 0.5 * k2, 'add')
    out = 1 if (np.dot(wts, [1, 0.5, 1, 0.8]) + 0.3 * math.sin(math.floor(tb) * 4)) > 0.2 else 0
    C.draw_text(cv, str(out), 'anton', 120, gx + 300, gy, C.AMBER, k2, 'mm', scale=1 + 0.15 * lit)
    C.draw_text(cv, 'y = step( Σ wᵢxᵢ + b )', 'm4', 24, cx + 60, cy + 210, C.GREY, k2, 'mm')
    C.draw_text(cv, 'THE PERCEPTRON', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.3)
    C.draw_text(cv, 'F. ROSENBLATT · CORNELL AERONAUTICAL LAB', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm',
                tracking=0.15)
    year_overlay(ctx, ctx.shot['year'])


def _mlp_layout(layers, x0, x1, cy, gap=92):
    pos = []
    for li, n in enumerate(layers):
        x = lerp(x0, x1, li / (len(layers) - 1))
        pos.append([(x, cy + (j - (n - 1) / 2) * gap) for j in range(n)])
    return pos


@scene
def backprop(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    layers = [4, 6, 6, 5, 2]
    pos = _mlp_layout(layers, W / 2 - 560, W / 2 + 560, H / 2 - 20)
    r = np.random.default_rng(4)
    appear = e_out3(ramp(tb, 0.35, 0.9))
    fwd = ramp(tb, 0.9, 2.2)
    bwd = ramp(tb, 2.3, 3.8)
    nl = len(layers)
    L = np.zeros_like(cv)
    for li in range(nl - 1):
        for a_i, (x0, y0) in enumerate(pos[li]):
            for b_i, (x1, y1) in enumerate(pos[li + 1]):
                w = r.normal()
                w2 = w + (r.normal() * 0.8) * bwd
                base_a = 0.18 + 0.25 * abs(w2)
                c = C.mixc(C.CYAN, C.MAG, clamp01(bwd * 1.2)) if bwd > 0 else C.CYAN
                # forward sweep highlight
                fk = clamp01((fwd * (nl - 1) - li) * 1.0)
                bk = clamp01((bwd * (nl - 1) - (nl - 2 - li)) * 1.0)
                hi = (fk * (1 - fk) * 4) * 0.8 + (bk * (1 - bk) * 4) * 0.8
                cc = tuple(v * (base_a + hi) * appear for v in (C.MAG if bk > 0 else c))
                cv2.line(L, (int(x0 * 16), int(y0 * 16)), (int(x1 * 16), int(y1 * 16)), cc, 1, cv2.LINE_AA, 4)
    cv += L
    for li in range(nl):
        fk = clamp01((fwd * (nl - 1) - li + 1))
        bk = clamp01((bwd * (nl - 1) - (nl - 1 - li) + 1))
        for (x, y) in pos[li]:
            glow_circle(cv, x, y, 16 * appear, (0.02, 0.05, 0.08))
            ring(cv, x, y, 16 * appear, C.WHITE, 2, 0.7)
            if fk > 0:
                glow_circle(cv, x, y, 9, C.CYAN, fk * (1 - bk))
            if bk > 0:
                glow_circle(cv, x, y, 9, C.MAG, bk)
    # pulses
    if 0 < fwd < 1:
        li = min(int(fwd * (nl - 1)), nl - 2); u = fwd * (nl - 1) - li
        for (x0, y0) in pos[li]:
            for (x1, y1) in pos[li + 1][::2]:
                glow_circle(cv, lerp(x0, x1, u), lerp(y0, y1, u), 3.5, C.WHITE, 0.9)
    if 0 < bwd < 1:
        li = nl - 1 - min(int(bwd * (nl - 1)), nl - 2); u = bwd * (nl - 1) - (nl - 1 - li)
        for (x0, y0) in pos[li]:
            for (x1, y1) in pos[li - 1][::2]:
                glow_circle(cv, lerp(x0, x1, u), lerp(y0, y1, u), 3.5, C.MAG, 1.0)
    C.draw_text(cv, 'FORWARD  →', 'm7', 22, W / 2 - 560, H / 2 + 330, C.CYAN, appear * (1 - bwd * 0.6), 'lm',
                tracking=0.2)
    C.draw_text(cv, '←  BACKWARD · GRADIENTS', 'm7', 22, W / 2 + 560, H / 2 + 330, C.MAG, ramp(tb, 2.2, 2.5), 'rm',
                tracking=0.2)
    loss = lerp(2.31, 0.07, e_out3(bwd))
    C.draw_text(cv, f'LOSS {loss:.2f}', 'anton', 64, W - 130, 150, C.WHITE, appear, 'rm')
    C.draw_text(cv, 'BACKPROPAGATION', 'g7', 26, W - 130, 205, C.GREY, appear, 'rm', tracking=0.3)
    year_overlay(ctx, ctx.shot['year'])


CHESS_START = {
    (0, 0): '♜', (1, 0): '♞', (2, 0): '♝', (3, 0): '♛', (4, 0): '♚', (5, 0): '♝', (6, 0): '♞', (7, 0): '♜',
    (0, 7): '♖', (1, 7): '♘', (2, 7): '♗', (3, 7): '♕', (4, 7): '♔', (5, 7): '♗', (6, 7): '♘', (7, 7): '♖',
}
for _i in range(8):
    CHESS_START[(_i, 1)] = '♟'; CHESS_START[(_i, 6)] = '♙'
CHESS_MOVES = [((4, 6), (4, 4)), ((4, 1), (4, 3)), ((6, 7), (5, 5)), ((1, 0), (2, 2)), ((5, 7), (1, 3)),
               ((0, 1), (0, 2)), ((1, 3), (0, 4)), ((6, 0), (5, 2))]


@scene
def chess(ctx):
    cv = ctx.cv; tb = ctx.tb
    board = dict(CHESS_START)
    nmoves = int(max(0, (tb - 0.9) * 2)) + 1 if tb > 0.9 else 0
    moving = None
    for i, (a, bq) in enumerate(CHESS_MOVES[:nmoves]):
        if i == nmoves - 1:
            k = e_out5(((tb - 0.9) * 2) % 1.0 / 0.6)
            moving = (board.pop(a), a, bq, k)
        else:
            board[bq] = board.pop(a)
    az = math.radians(-25 + 40 * ctx.p)
    cam = C.Cam(C.orbit(13, az, math.radians(48)), (0, -0.5, 0), 38)
    appear = e_out5(ramp(tb, 0.3, 1.0))
    quads = []
    for i in range(8):
        for j in range(8):
            x0, z0 = i - 4, j - 4
            P = np.array([[x0, 0, z0], [x0 + 1, 0, z0], [x0 + 1, 0, z0 + 1], [x0, 0, z0 + 1]], np.float32)
            P[:, 1] += (1 - appear) * (3 + ((i * 7 + j * 3) % 5))
            xy, z = cam.project(P)
            quads.append((z.mean(), xy, (i + j) % 2, i, j))
    quads.sort(key=lambda q: -q[0])
    for zm, xy, dark, i, j in quads:
        c = (0.05, 0.08, 0.14) if dark else (0.16, 0.22, 0.33)
        cv2.fillConvexPoly(cv, (xy * 16).astype(np.int32), c, cv2.LINE_AA, 4)
        cv2.polylines(cv, [(xy * 16).astype(np.int32)], True, (0.12, 0.35, 0.45), 1, cv2.LINE_AA, 4)
    # highlight squares of the moving piece
    if moving:
        g, a, bq, k = moving
        for sq, cc in ((a, C.AMBER), (bq, C.CYAN)):
            x0, z0 = sq[0] - 4, sq[1] - 4
            P = np.array([[x0, 0.01, z0], [x0 + 1, 0.01, z0], [x0 + 1, 0.01, z0 + 1], [x0, 0.01, z0 + 1]], np.float32)
            xy, _ = cam.project(P)
            L = np.zeros_like(cv)
            cv2.fillConvexPoly(L, (xy * 16).astype(np.int32), tuple(v * 0.35 for v in cc), cv2.LINE_AA, 4)
            cv += L
    pieces = [(sq, g, 1.0) for sq, g in board.items()]
    if moving:
        g, a, bq, k = moving
        pieces.append(((lerp(a[0], bq[0], k), lerp(a[1], bq[1], k)), g, 1.0 + 0.3 * math.sin(math.pi * k)))
    items = []
    for (i, j), g, lift in pieces:
        P = np.array([[i - 3.5, 0.0, j - 3.5]], np.float32)
        xy, z = cam.project(P)
        items.append((z[0], xy[0], g, lift))
    items.sort(key=lambda q: -q[0])
    for z, p, g, lift in items:
        s = 780 / z
        white = g in '♔♕♖♗♘♙'
        colr = (0.95, 0.97, 1.0) if white else C.CYAN
        C.draw_text(cv, g, 'dejavu', 110, p[0], p[1] - s * 0.55 * lift, colr, appear, 'mb', scale=s / 110 * 1.1)
    C.draw_text(cv, 'DEEP BLUE  3½ – 2½  KASPAROV', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.15)
    C.draw_text(cv, 'IBM · NEW YORK · MAY 1997', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm', tracking=0.2)
    year_overlay(ctx, ctx.shot['year'])


@functools.lru_cache(maxsize=64)
def _thumb(seed, w=150, h=110):
    r = np.random.default_rng(seed)
    im = np.zeros((h, w, 3), np.float32)
    yy, xx = np.mgrid[0:h, 0:w]
    base = r.uniform(0.02, 0.2, 3)
    im += base
    for _ in range(r.integers(3, 7)):
        cx, cy = r.uniform(0, w), r.uniform(0, h)
        s = r.uniform(10, 45)
        c = r.uniform(0, 1, 3) * r.uniform(0.4, 1.0)
        im += np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * s * s))[..., None] * c
    return np.clip(im, 0, 1).astype(np.float32)


LABELS = ['tabby cat', 'container ship', 'mushroom', 'cherry', 'leopard', 'garden spider', 'scooter', 'grille',
          'mite', 'lifeboat', 'amphibian', 'fireboat', 'go-kart', 'Madagascar cat', 'dalmatian', 'motor scooter']


@scene
def imagenet(ctx):
    cv = ctx.cv; tb = ctx.tb
    cols, rows = 9, 5
    tw_, th_ = 150, 110
    gx0 = W / 2 - (cols * (tw_ + 16)) / 2
    gy0 = H / 2 - (rows * (th_ + 16)) / 2 - 40
    scroll = ctx.t * 40
    for i in range(cols):
        for j in range(rows):
            k = e_out5(ramp(tb, 0.3 + (i + j) * 0.035, 0.8 + (i + j) * 0.035))
            if k <= 0:
                continue
            im = _thumb(i * 13 + j * 7)
            x = int(gx0 + i * (tw_ + 16)); y = int(gy0 + j * (th_ + 16) - scroll)
            y += int((1 - k) * 60)
            if y < -th_ or y > H:
                continue
            Y0, Y1 = max(0, y), min(H, y + th_)
            reg = cv[Y0:Y1, x:x + tw_]
            reg[:] = reg * (1 - k) + im[Y0 - y:Y1 - y] * k * 0.55
            conf = 0.5 + 0.5 * ((i * 31 + j * 17) % 10) / 10
            lab = LABELS[(i * 5 + j) % len(LABELS)]
            C.rect(cv, x, y + th_ - 22, x + tw_, y + th_, (0, 0, 0), 0.6 * k)
            C.draw_text(cv, lab, 'm4', 13, x + 6, y + th_ - 11, C.WHITE, k * 0.9, 'lm')
            C.rect(cv, x, y + th_ - 3, x + tw_ * conf * e_out3(ramp(tb, 0.8 + i * 0.03, 1.4)), y + th_,
                   C.CYAN, k, 'add')
            C.rect(cv, x, y, x + tw_, y + th_, C.CYAN, 0.25 * k, 'add', thick=1)
    # dark plate + bars
    k = e_out5(ramp(tb, 1.0, 1.6))
    dimmer(cv, 0.55 * k)
    bx0, by = W / 2 - 520, H / 2 - 110
    for idx, (name, val, c) in enumerate([('PREVIOUS BEST (2012 RUNNER-UP)', 26.2, C.GREY), ('ALEXNET · DEEP CNN', 15.3, C.CYAN)]):
        kk = e_out5(ramp(tb, 1.1 + idx * 0.4, 1.9 + idx * 0.4))
        y = by + idx * 150
        C.draw_text(cv, name, 'm7', 22, bx0, y - 34, C.WHITE, kk, 'lm', tracking=0.15)
        C.rect(cv, bx0, y - 14, bx0 + 1040 * val / 30 * kk, y + 30, c, 0.9 * kk, 'add' if idx else 'over')
        C.draw_text(cv, f'{val * kk:.1f}%', 'anton', 58, bx0 + 1040 * val / 30 * kk + 22, y + 8, C.WHITE, kk, 'lm')
    C.draw_text(cv, 'IMAGENET TOP-5 ERROR', 'g7', 30, W - 130, 128, C.WHITE, k, 'rm', tracking=0.25)
    C.draw_text(cv, '1.2M IMAGES · 1,000 CLASSES', 'm4', 16, W - 130, 168, C.GREY, k, 'rm', tracking=0.2)
    year_overlay(ctx, ctx.shot['year'])


@functools.lru_cache(maxsize=1)
def _go_stones():
    r = np.random.default_rng(37)
    cells = set(); out = []
    while len(out) < 36:
        i, j = int(r.integers(2, 17)), int(r.integers(2, 17))
        if (i, j) in cells or (i, j) == (4, 9):
            continue
        cells.add((i, j)); out.append((i, j, len(out) % 2))
    return out


@scene
def go(ctx):
    cv = ctx.cv; tb = ctx.tb
    az = math.radians(20 - 25 * ctx.p)
    cam = C.Cam(C.orbit(17 - 2.5 * e_io3(ctx.p), az, math.radians(58)), (0, 0.6, -0.6), 40)
    appear = e_out5(ramp(tb, 0.3, 1.0))
    s = 9
    # board plate
    P = np.array([[-s - 0.8, 0, -s - 0.8], [s + 0.8, 0, -s - 0.8], [s + 0.8, 0, s + 0.8], [-s - 0.8, 0, s + 0.8]],
                 np.float32) * 0.5
    xy, _ = cam.project(P)
    cv2.fillConvexPoly(cv, (xy * 16).astype(np.int32), (0.10, 0.075, 0.05), cv2.LINE_AA, 4)
    A, B = [], []
    for i in range(19):
        v = (i - 9) * 0.5
        A.append([v, 0, -4.5]); B.append([v, 0, 4.5])
        A.append([-4.5, 0, v]); B.append([4.5, 0, v])
    A = np.array(A, np.float32); B = np.array(B, np.float32)
    kk = appear
    Bm = A + (B - A) * kk
    xa, _ = cam.project(A); xb, _ = cam.project(Bm)
    C.lines(cv, xa, xb, (0.55, 0.45, 0.30), 1, 0.9)
    stones = _go_stones()
    shown = int(clamp01((tb - 0.6) / 2.4) * len(stones))
    items = []
    for n, (i, j, colr) in enumerate(stones[:shown]):
        items.append((i, j, colr, 1.0))
    if tb > 3.0:
        items.append((4, 9, 0, 1.0))
    for i, j, colr, _ in items:
        p3 = np.array([[(i - 9) * 0.5, 0.0, (j - 9) * 0.5]], np.float32)
        xy, z = cam.project(p3)
        rr = cam.f * 0.22 / z[0]
        x, y = xy[0]
        if colr == 0:
            fill_circle(cv, x, y + rr * 0.1, rr, (0.02, 0.02, 0.025), 1.0)
            ring(cv, x, y + rr * 0.1, rr, (0.35, 0.4, 0.5), 1, 0.6)
        else:
            fill_circle(cv, x, y + rr * 0.1, rr, (0.85, 0.87, 0.9), 1.0)
    if tb > 3.0:
        k = e_out5((tb - 3.0) / 0.5)
        p3 = np.array([[(4 - 9) * 0.5, 0, 0]], np.float32)
        xy, z = cam.project(p3)
        x, y = xy[0]
        ring(cv, x, y, 30 + 40 * (1 - k), C.CYAN, 3, 1.4)
        ring(cv, x, y, 60 + 90 * k, C.CYAN, 2, 0.6 * (1 - k))
        C.rect(cv, x + 34, y - 1, x + 34 + 180 * k, y + 1, C.CYAN, 1.0, 'add')
        C.draw_text(cv, 'MOVE 37', 'anton', 72, x + 230, y, C.WHITE, k, 'lm')
        C.draw_text(cv, '“1 IN 10,000”', 'm4', 18, x + 232, y + 50, C.CYAN, k, 'lm', tracking=0.2)
    C.draw_text(cv, 'ALPHAGO  4 – 1  LEE SEDOL', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.15)
    C.draw_text(cv, 'SEOUL · MARCH 2016', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm', tracking=0.2)
    year_overlay(ctx, ctx.shot['year'])


SENT = ['The', 'model', 'reads', 'every', 'word', 'at', 'once']


@scene
def transformer(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    words = ['ATTENTION', 'IS', 'ALL', 'YOU', 'NEED']
    size = 132
    widths = [C.text_size(w_, 'anton', size)[0] for w_ in words]
    gap = 34
    total = sum(widths) + gap * (len(words) - 1)
    x = W / 2 - total / 2
    y = H / 2 - 140
    for i, w_ in enumerate(words):
        start = 0.35 + [0, 1, 1.5, 2, 2.5][i] * 0.9
        k = (tb - start) / 0.3
        if k > 0:
            e = e_out5(k)
            C.draw_text(cv, w_, 'anton', size, x + widths[i] / 2, y + (1 - e) * 40, C.WHITE if i else C.CYAN,
                        clamp01(k * 3), 'mm', sx=1.0, sy=max(0.05, e))
        x += widths[i] + gap
    # token row with attention arcs
    tsize = 30
    tws = [C.text_size(w_, 'm7', tsize)[0] + 36 for w_ in SENT]
    tot = sum(tws) + 18 * (len(SENT) - 1)
    xs = []
    xx = W / 2 - tot / 2
    ty = H / 2 + 230
    appear = e_out3(ramp(tb, 0.5, 1.0))
    for i, w_ in enumerate(SENT):
        C.rrect(cv, xx, ty - 26, tws[i], 52, 10, (0.06, 0.1, 0.16), appear)
        C.rrect_outline(cv, xx, ty - 26, tws[i], 52, 10, C.CYAN, 1, 0.5 * appear)
        C.draw_text(cv, w_, 'm7', tsize, xx + tws[i] / 2, ty, C.WHITE, appear, 'mm')
        xs.append(xx + tws[i] / 2)
        xx += tws[i] + 18
    r = np.random.default_rng(3)
    L = np.zeros_like(cv)
    arcs_k = ramp(tb, 0.8, 3.6)
    npairs = 0
    for i in range(len(SENT)):
        for j in range(len(SENT)):
            if i == j:
                continue
            npairs += 1
            w = r.random() ** 2
            kk = clamp01(arcs_k * 1.4 - (i * 0.08 + j * 0.03))
            if kk <= 0:
                continue
            p0 = np.array([xs[i], ty - 30]); p2 = np.array([xs[j], ty - 30])
            h = 40 + abs(xs[i] - xs[j]) * 0.35
            p1 = (p0 + p2) / 2 - [0, h]
            pts = bezier(p0, p1, p2, 40)
            pts = pts[:max(2, int(len(pts) * kk))]
            c = C.mixc(C.CYAN, C.MAG, (i / len(SENT)))
            cv2.polylines(L, [(pts * 16).astype(np.int32)], False, tuple(v * (0.2 + 0.9 * w) for v in c),
                          1 + int(w * 3), cv2.LINE_AA, 4)
    cv += L
    C.draw_text(cv, 'VASWANI ET AL. · GOOGLE · 2017', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm', tracking=0.2)
    C.draw_text(cv, 'THE TRANSFORMER', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.25)
    year_overlay(ctx, ctx.shot['year'])


@functools.lru_cache(maxsize=1)
def _lattice(n=18):
    g = np.linspace(-1, 1, n)
    X, Y, Z = np.meshgrid(g, g, g)
    P = np.stack([X.ravel(), Y.ravel(), Z.ravel()], 1).astype(np.float32)
    r = np.random.default_rng(1)
    return P, r.random(len(P)).astype(np.float32)


@scene
def params(ctx):
    cv = ctx.cv; tb = ctx.tb
    P, rnd = _lattice(18)
    grow = e_out5(ramp(tb, 0.3, 2.5))
    s = 0.9 + 1.9 * grow
    Q = P * s
    Q = Q @ C.ry(ctx.t * 0.6).T @ C.rx(0.5).T
    cam = C.Cam((0, 0, -11), (0, 0, 0), 50, cx=W / 2 + 420)
    xy, z = cam.project(Q)
    lit = (rnd < 0.15 + 0.85 * grow) * (0.35 + 0.65 * (np.sin(rnd * 50 + ctx.t * 8) > 0.7))
    fade = C.depth_fade(z, 5, 18)
    colr = np.where((rnd > 0.92)[:, None], np.array(C.AMBER)[None], np.array(C.CYAN)[None]).astype(np.float32)
    m = lit > 0
    dots_r = (cam.f * 0.018 / np.maximum(z, 0.1))
    C.dots(cv, xy[m], dots_r[m], colr[m] * (lit[m] * fade[m])[:, None], 1.0)
    # cube frame
    E = np.array([[a, b_] for a in range(8) for b_ in range(8) if a < b_ and bin(a ^ b_).count('1') == 1])
    V = np.array([[(i >> 0 & 1) * 2 - 1, (i >> 1 & 1) * 2 - 1, (i >> 2 & 1) * 2 - 1] for i in range(8)], np.float32)
    V = (V * s * 1.08) @ C.ry(ctx.t * 0.6).T @ C.rx(0.5).T
    vxy, _ = cam.project(V)
    C.lines(cv, vxy[E[:, 0]], vxy[E[:, 1]], C.CYAN, 2, 0.6)
    # counter
    k = e_out3(ramp(tb, 0.35, 2.6))
    val = int(175e9 * (k ** 3))
    s_val = f'{val:,}'
    C.draw_text(cv, s_val, 'anton', 120, 150, H / 2 - 70, C.WHITE, ramp(tb, 0.35, 0.5), 'lm')
    C.draw_text(cv, 'PARAMETERS', 'g7', 34, 154, H / 2 + 20, C.CYAN, ramp(tb, 0.5, 0.8), 'lm', tracking=0.45)
    # comparison bars
    kb = e_out5(ramp(tb, 1.2, 2.2))
    for i, (nm, v) in enumerate([('GPT-2 · 2019', 1.5), ('GPT-3 · 2020', 175)]):
        y = H / 2 + 110 + i * 64
        C.draw_text(cv, nm, 'm7', 20, 154, y, C.GREY, kb, 'lm', tracking=0.1)
        C.rect(cv, 360, y - 12, 360 + 560 * (v / 175) * kb + 3, y + 12, C.CYAN if i else C.GREY, 0.9 * kb, 'add')
        C.draw_text(cv, f'{v:g}B', 'm7', 22, 360 + 560 * (v / 175) * kb + 22, y, C.WHITE, kb, 'lm')
    year_overlay(ctx, ctx.shot['year'])


# ================================================================ BUILD 1
@scene
def chat(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    appear = e_out5(ramp(tb, 0.3, 0.8))
    wx, wy, ww, wh = 150, 300, 860, 430
    wy += (1 - appear) * 80
    C.rrect(cv, wx, wy, ww, wh, 22, (0.035, 0.045, 0.07), appear)
    C.rrect_outline(cv, wx, wy, ww, wh, 22, (0.3, 0.4, 0.55), 1, appear)
    for i, c in enumerate([C.MAG, C.AMBER, C.LIME]):
        glow_circle(cv, wx + 30 + i * 22, wy + 28, 6, c, 0.6 * appear)
    q = 'Explain neural networks like I’m five.'
    qa = e_out3(ramp(tb, 0.6, 0.9))
    qw = C.text_size(q, 'i4', 26)[0] + 40
    C.rrect(cv, wx + ww - qw - 30, wy + 70, qw, 58, 18, (0.12, 0.35, 0.45), qa)
    C.draw_text(cv, q, 'i4', 26, wx + ww - qw / 2 - 30, wy + 99, C.WHITE, qa, 'mm')
    ans = ('Imagine lots of tiny helpers passing notes. Each one checks a small clue, '
           'and together they vote on the answer. When they’re wrong, they adjust — '
           'and slowly get really good at it.')
    shown = typed(ans, tb - 1.0, 55)
    # word wrap
    lines_, cur = [], ''
    for wd in shown.split(' '):
        if C.text_size(cur + ' ' + wd, 'i4', 26)[0] > ww - 110:
            lines_.append(cur); cur = wd
        else:
            cur = (cur + ' ' + wd).strip()
    lines_.append(cur)
    for i, ln in enumerate(lines_):
        C.draw_text(cv, ln, 'i4', 26, wx + 40, wy + 190 + i * 44, (0.85, 0.9, 0.97), 1.0, 'lm')
    if tb > 1.0 and len(shown) < len(ans):
        tx = wx + 40 + C.text_size(lines_[-1], 'i4', 26)[0] + 6
        glow_circle(cv, tx + 6, wy + 190 + (len(lines_) - 1) * 44, 7, C.CYAN, 1.0)
    # user counter
    k = e_out3(ramp(tb, 0.5, 3.4))
    val = int(100_000_000 * k ** 2.2)
    C.draw_text(cv, f'{val:,}', 'anton', 118, W - 150, H / 2 - 40, C.WHITE, ramp(tb, 0.5, 0.7), 'rm')
    C.draw_text(cv, 'USERS', 'g7', 36, W - 150, H / 2 + 50, C.CYAN, ramp(tb, 0.6, 0.9), 'rm', tracking=0.5)
    C.draw_text(cv, 'IN ≈ 2 MONTHS (EST.)', 'm4', 20, W - 150, H / 2 + 100, C.GREY, ramp(tb, 0.8, 1.1), 'rm',
                tracking=0.2)
    # mini growth curve
    xs = np.linspace(0, 1, 80)
    kk = ramp(tb, 0.5, 3.4)
    pts = np.stack([W - 640 + xs * 490, H / 2 + 260 - (xs ** 2.2) * 150], 1)
    n = max(2, int(80 * kk))
    C.polyline(cv, pts[:n], C.CYAN, 3, 1.0)
    glow_circle(cv, pts[n - 1][0], pts[n - 1][1], 7, C.WHITE, 1.0)
    year_overlay(ctx, ctx.shot['year'])


@scene
def tunnel_word(ctx, word=None, hue=None, fast=None, local=False):
    cv = ctx.cv
    b = ctx.b
    word = word or ctx.shot['word']
    hue = ctx.shot.get('hue', 0) if hue is None else hue
    fast = ctx.shot.get('fast', False) if fast is None else fast
    c1 = C.HUES[hue % 3]; c2 = C.HUES[(hue + 1) % 3]
    # continuous tunnel across cuts: travel is a function of global beat
    sp = min(12.0, max(0.0, b - 52))
    travel = 6 * sp + 1.8 * sp * sp * 0.25
    rings, per = 26, 90
    th = np.linspace(0, 2 * np.pi, per, endpoint=False)
    zs = (np.arange(rings) * 2.2 - travel) % (rings * 2.2) + 0.6
    R = 5.0
    pts = []; cols = []; ws = []
    roll = b * 0.15
    for zi, z in enumerate(zs):
        tw = th + roll + zi * 0.08
        wob = 1 + 0.08 * np.sin(tw * 6 + b)
        P = np.stack([np.cos(tw) * R * wob, np.sin(tw) * R * wob * 0.62, np.full(per, z)], 1)
        pts.append(P)
        mix = (zi % 3) / 2
        cols.append(np.broadcast_to(np.array(C.mixc(c1, c2, mix)), (per, 3)))
    P = np.concatenate(pts).astype(np.float32); colr = np.concatenate(cols).astype(np.float32)
    cam = C.Cam((0, 0, 0), (0, 0, 1), 75)
    xy, z = cam.project(P)
    w = np.clip(1 - z / (rings * 2.2), 0, 1) ** 1.2 * 1.8
    C.splat(cv, xy, colr, w, z=z)
    # streaks
    P2 = P.copy(); P2[:, 2] += 0.3 + 0.08 * sp
    xy2, _ = cam.project(P2)
    m = (w > 0.9) & (np.arange(len(P)) % 3 == 0)
    C.lines(cv, xy[m], xy2[m], colr[m] * 0.5, 1)
    starfield(cv, travel * 1.4, color=(0.7, 0.8, 1.0), bright=0.6)
    # word
    fl = ctx.tb * TL.FPB
    k = e_out5(fl / 6)
    size = 250 if len(word) < 9 else 190
    sc = lerp(1.25, 1.0, k) + 0.04 * ctx.p
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 20, (0.02, 0.02, 0.04), 0.6, 'mm', scale=sc * 1.02, blur=8)
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=sc, tracking=0.02)
    C.draw_text(cv, word, 'anton', size, W / 2 + 6, H / 2 - 20, c1, 0.5 * (1 - k), 'mm', scale=sc, mode='add')
    if fast:
        ctx.post['invert'] = (ctx.si % 2 == 1)
        ctx.post['glitch'] = 20 * math.exp(-fl / 3)
    ctx.post['rblur'] += 0.02 + 0.004 * sp


@scene
def question_hold(ctx):
    cv = ctx.cv
    txt = ctx.shot['text']
    C.BG_MAIN  # plain
    starfield(cv, ctx.b * 0.2, bright=0.35)
    fl = ctx.tb * TL.FPB
    flick = 1.0 if (int(fl) % 7 != 3 or fl > 12) else 0.55
    k = e_out5(fl / 5)
    sc = lerp(0.9, 1.0, k) + 0.12 * e_in3(ramp(ctx.tb, 0.6, 1.0))
    C.draw_text(cv, txt, 'anton', 150, W / 2, H / 2 - 20, C.WHITE, flick, 'mm', scale=sc, tracking=0.03)
    # countdown line
    C.rect(cv, W / 2 - 300, H / 2 + 90, W / 2 - 300 + 600 * ctx.p, H / 2 + 93, C.CYAN, 1.0, 'add')
    C.draw_text(cv, 'INCOMING', 'm7', 18, W / 2, H / 2 + 125, C.CYAN, 0.8 * flick, 'mm', tracking=0.5)
    ctx.post['hud'] = 0.4


# import other scene modules (they register themselves)
import scenes2  # noqa: E402,F401
import scenes3  # noqa: E402,F401
```

### 25/30 · `The_Age_of_Intelligence-source/src/scenes2.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/scenes2.py", "lines": 750, "final_newline": true, "sha256": "4601ff08ed26e67a16ef0af4f1b386cfc4885931733abc6cb947dac8f87a376e", "original_sha256": "4601ff08ed26e67a16ef0af4f1b386cfc4885931733abc6cb947dac8f87a376e"} -->
```python
"""Scenes part 2: DROP 1 (how an LLM works) and the SCALE break."""
import math, functools
import numpy as np, cv2
import core as C
from core import W, H, e_out3, e_out5, e_io3, e_in3, e_back, ramp, clamp01, lerp
import timeline as TL
from scenes import (scene, glow_circle, ring, fill_circle, bezier, travel_dots, starfield, typed, dimmer,
                    bracket_box, text_points)

TOKC = [C.CYAN, C.MAG, C.AMBER, C.LIME, C.VIOLET]


def step_label(cv, num, name, a=1.0):
    if a <= 0:
        return
    C.draw_text(cv, num, 'anton', 110, 80, 190, C.CYAN, a, 'lm', outline=2, mode='add')
    nw = C.text_size(num, 'anton', 110)[0]
    C.draw_text(cv, name, 'g7', 30, 80 + nw + 26, 172, C.WHITE, a, 'lm', tracking=0.3)
    C.rect(cv, 80 + nw + 26, 200, 80 + nw + 26 + 120 * a, 203, C.CYAN, a, 'add')


# ================================================================ impact
@functools.lru_cache(maxsize=1)
def _burst():
    r = np.random.default_rng(8)
    P = C.fib_sphere(5000, 1.0)
    sp = r.uniform(0.4, 1.0, (5000, 1)).astype(np.float32)
    return P, sp, r.random(5000).astype(np.float32)


@scene
def impact_title(ctx):
    cv = ctx.cv; t = ctx.t; tb = ctx.tb
    P, sp, rnd = _burst()
    rad = 1 + 26 * e_out3(t / 0.9) * sp
    Q = P * rad
    Q = Q @ C.ry(t * 0.8).T
    cam = C.Cam((0, 0, -30), (0, 0, 0), 50)
    xy, z = cam.project(Q)
    colr = np.where((rnd < 0.5)[:, None], np.array(C.CYAN)[None], np.array(C.MAG)[None]).astype(np.float32)
    colr[rnd > 0.9] = C.WHITE
    w = np.clip(1.3 - t * 0.6, 0.3, 1.3) * C.depth_fade(z, 5, 60)
    C.splat(cv, xy, colr, w.astype(np.float32), z=z)
    for i in range(3):
        rr = (t - i * 0.07) * 2600
        if rr > 0:
            ring(cv, W / 2, H / 2, rr, C.CYAN if i != 1 else C.MAG, 3, max(0, 1.2 - rr / 1600))
    C.line_grid(cv, 96, (0.03, 0.05, 0.08))
    kin_t = t
    C.kinetic(cv, 'HOW IT THINKS', 'anton', 240, W / 2, H / 2 - 40, kin_t, C.WHITE, stagger=0.02, dur=0.2,
              style='slam', tracking=0.02)
    a = e_out3(ramp(tb, 0.6, 1.0))
    C.draw_text(cv, ctx.shot['sub'], 'm7', 26, W / 2, H / 2 + 120, C.CYAN, a, 'mm', tracking=0.45)
    C.draw_text(cv, '— IN FOUR STEPS —', 'm4', 18, W / 2, H / 2 + 165, C.GREY, a, 'mm', tracking=0.3)
    if 1.0 <= tb < 1.15 or 1.5 <= tb < 1.6:
        ctx.post['glitch'] = 30
        ctx.post['ca'] += 10
    ctx.post['hud'] = 0.6


# ================================================================ 01 tokens
TOKS = ['Token', 'ization', ' turns', ' text', ' into', ' numbers', '.']
TOK_IDS = [4062, 2065, 10800, 1495, 1139, 5219, 13]


def token_row(cv, toks, y, size, split, box_a, fkey='g5', colors=TOKC, alpha=1.0, xoff=0.0, sc=1.0):
    ws = [C.text_size(tk.replace(' ', ' ') if tk.strip() else tk, fkey, size)[0] for tk in toks]
    ws = [C.text_size(tk, fkey, size)[0] if tk.strip() else size * 0.3 for tk in toks]
    gap = 26 * split
    pad = 16 * split
    total = sum(ws) + gap * (len(toks) - 1) + 2 * pad * len(toks)
    x = W / 2 - total / 2 + xoff
    centers = []
    for i, tk in enumerate(toks):
        bw = ws[i] + 2 * pad
        cx = x + bw / 2
        if box_a > 0:
            c = colors[i % len(colors)]
            C.rrect(cv, x, y - size * 0.72, bw, size * 1.4, 12, tuple(v * 0.22 for v in c), box_a * alpha)
            C.rrect_outline(cv, x, y - size * 0.72, bw, size * 1.4, 12, c, 2, box_a * alpha)
        C.draw_text(cv, tk.strip(), fkey, size, cx, y, C.WHITE, alpha, 'mm')
        centers.append((cx, bw))
        x += bw + gap
    return centers


@scene
def tokens_split(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '01', 'TOKENIZATION', e_out3(ramp(tb, 0.0, 0.3)))
    split = e_back(ramp(tb, 0.5, 0.8))
    box_a = ramp(tb, 0.5, 0.65)
    y = H / 2 - 60
    rise = e_out5(tb / 0.25)
    centers = token_row(cv, TOKS, y + (1 - rise) * 40, 64, split, box_a, alpha=1.0)
    for i, (cx, bw) in enumerate(centers):
        k = e_out5(ramp(tb, 1.0 + i * 0.06, 1.3 + i * 0.06))
        if k <= 0:
            continue
        c = TOKC[i % 5]
        C.rect(cv, cx - 1, y + 64, cx + 1, y + 64 + 60 * k, c, 0.8, 'add')
        C.draw_text(cv, str(TOK_IDS[i]), 'm7', 34, cx, y + 150 + (1 - k) * 30, c, k, 'mm')
    a = e_out3(ramp(tb, 1.5, 1.8))
    C.draw_text(cv, 'TEXT  →  TOKENS  →  IDS', 'm7', 22, W / 2, y + 240, C.GREY, a, 'mm', tracking=0.3)


@scene
def token_ids(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    LW, LH = 1800, 1500
    layer = np.zeros((LH, LW, 3), np.float32)
    r = np.random.default_rng(5)
    cols, rows = 12, 26
    cw, rh = LW / cols, 58
    scroll = (t * 260) % rh
    hi_row = 13
    for j in range(rows):
        yy = j * rh - scroll + 30
        for i in range(cols):
            v = int(r.integers(10, 100000))
            if j == hi_row and i < len(TOK_IDS):
                continue
            ph = (i * 0.37 + j * 0.61 + t * 3) % 1.0
            br = 0.18 + 0.25 * (ph > 0.85)
            C.draw_text(layer, f'{v:05d}', 'm4', 30, (i + 0.5) * cw, yy, (br * 0.7, br * 0.9, br * 1.2), 1.0, 'mm') \
                if 0 < yy < LH else None
    yy = hi_row * rh - scroll + 30
    for i, v in enumerate(TOK_IDS):
        c = TOKC[i % 5]
        C.rect(layer, i * cw + 10, yy - 24, (i + 1) * cw - 10, yy + 24, tuple(x * 0.25 for x in c), 1.0, 'add')
        C.draw_text(layer, f'{v:05d}', 'm7', 32, (i + 0.5) * cw, yy, C.WHITE, 1.0, 'mm')
    tilt = 0.28 + 0.06 * math.sin(t * 2)
    src = np.float32([[0, 0], [LW, 0], [LW, LH], [0, LH]])
    dst = np.float32([[W * (0.5 - 0.5 * (1 - tilt)) - 120, -60], [W * (0.5 + 0.5 * (1 - tilt)) + 120, -60],
                      [W + 380, H + 60], [-380, H + 60]])
    M = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(layer, M, (W, H), flags=cv2.INTER_LINEAR)
    # fog toward the top
    fog = np.linspace(0.1, 1.0, H, dtype=np.float32)[:, None, None] ** 1.2
    cv += warped * fog
    scan = (t * 1.4) % 1.0
    C.rect(cv, 0, H * scan - 2, W, H * scan + 2, C.CYAN, 0.25, 'add')
    step_label(cv, '01', 'TOKENIZATION')
    a = e_out5(ramp(tb, 0.3, 0.6))
    C.draw_text(cv, 'EVERYTHING BECOMES NUMBERS', 'anton', 110, W / 2, H / 2 - 40, C.WHITE, a, 'mm',
                scale=lerp(1.2, 1, a))
    C.draw_text(cv, 'VOCABULARY: ~50K – 200K TOKENS', 'm7', 24, W / 2, H / 2 + 40, C.CYAN, a, 'mm', tracking=0.3)


@scene
def token_fact(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    # conveyor rows of token boxes
    words = ['the', ' cat', ' sat', ' on', ' the', ' mat', ' and', ' dream', 'ed', ' of', ' code', '.', ' Hello',
             ' world', '!', ' un', 'believ', 'able']
    for row, (y, spd) in enumerate([(210, 420), (H - 250, -520)]):
        x = -((t * spd) % 2400) - 200 if spd > 0 else ((t * -spd) % 2400) - 2400
        i = row * 5
        while x < W + 200:
            tk = words[i % len(words)].strip()
            w_ = C.text_size(tk, 'm7', 30)[0] + 30
            c = TOKC[i % 5]
            C.rrect(cv, x, y - 26, w_, 52, 10, tuple(v * 0.18 for v in c), 0.9)
            C.draw_text(cv, tk, 'm7', 30, x + w_ / 2, y, (0.8, 0.85, 0.9), 0.9, 'mm')
            x += w_ + 14; i += 1
    step_label(cv, '01', 'TOKENIZATION', 0.0)
    k = e_out5(ramp(tb, 0.0, 0.25))
    C.kinetic(cv, '1 TOKEN ≈ ¾ WORD', 'anton', 190, W / 2, H / 2 - 30, t, C.WHITE, 0.025, 0.2, style='rise')
    a = e_out3(ramp(tb, 0.8, 1.1))
    C.draw_text(cv, '≈ 4 CHARACTERS OF ENGLISH TEXT, ON AVERAGE', 'm7', 26, W / 2, H / 2 + 110, C.CYAN, a, 'mm',
                tracking=0.2)


# ================================================================ 02 embeddings
CLUSTERS = {
    'ANIMALS': ['cat', 'dog', 'tiger', 'horse', 'wolf'],
    'ROYALTY': ['king', 'queen', 'prince', 'princess', 'crown'],
    'CODE': ['python', 'function', 'loop', 'array', 'compile'],
    'FOOD': ['apple', 'bread', 'rice', 'noodle', 'mango'],
    'SPACE': ['moon', 'star', 'planet', 'orbit', 'comet'],
    'FEELINGS': ['joy', 'fear', 'love', 'anger', 'calm'],
}
CL_COL = [C.CYAN, C.AMBER, C.LIME, C.MAG, C.VIOLET, (1.0, 0.5, 0.35)]


@functools.lru_cache(maxsize=1)
def _embed():
    r = np.random.default_rng(12)
    names = list(CLUSTERS)
    centers = C.fib_sphere(len(names), 5.0) * np.array([1.25, 0.55, 1.25], np.float32)
    pts, cols, labs = [], [], []
    for ci, nm in enumerate(names):
        P = centers[ci] + r.normal(0, 1.0, (320, 3))
        pts.append(P); cols.append(np.broadcast_to(np.array(CL_COL[ci]), (320, 3)))
        for wi, wd in enumerate(CLUSTERS[nm]):
            labs.append((wd, centers[ci] + r.normal(0, 0.95, 3), ci))
    bg = r.uniform(-9, 9, (900, 3))
    pts.append(bg); cols.append(np.broadcast_to(np.array((0.35, 0.4, 0.55)), (900, 3)))
    return (np.concatenate(pts).astype(np.float32), np.concatenate(cols).astype(np.float32), labs, centers,
            names)


def draw_embed(cv, cam, t, label_size=22, label_alpha=1.0, focus=None, show_axes=True):
    P, cols, labs, centers, names = _embed()
    # gentle drift
    Pd = P + 0.06 * np.sin(P[:, [1, 2, 0]] * 1.3 + t * 2)
    xy, z = cam.project(Pd)
    w = C.depth_fade(z, 4, 30) * 2.0
    C.splat(cv, xy, cols, w.astype(np.float32), z=z)
    if show_axes:
        O = np.zeros((3, 3), np.float32); A = np.eye(3, dtype=np.float32) * 8
        oxy, _ = cam.project(O); axy, _ = cam.project(A)
        C.lines(cv, oxy, axy, (0.35, 0.45, 0.6), 1, 0.8)
        for k, nm in enumerate(['d₁', 'd₂', 'd₃']):
            C.draw_text(cv, nm, 'm7', 20, axy[k, 0] + 10, axy[k, 1], (0.5, 0.6, 0.75), 0.9, 'lm')
    # labelled words
    L = np.array([l[1] for l in labs], np.float32)
    lxy, lz = cam.project(L)
    order = np.argsort(-lz)
    for i in order:
        wd, _, ci = labs[i]
        if lz[i] < 0.5:
            continue
        a = float(np.clip(1.3 - lz[i] / 30, 0.25, 1.0)) * label_alpha
        if focus is not None and ci != focus:
            a *= 0.35
        x, y = lxy[i]
        a *= clamp01((H - 215 - y) / 70)  # keep the subtitle zone clean
        if a <= 0.01:
            continue
        glow_circle(cv, x, y, 5, CL_COL[ci], 1.2 * a)
        sz = int(np.clip(label_size * 14 / lz[i], 14, 64))
        C.draw_text(cv, wd, 'm7', sz, x + 12, y, C.WHITE, a, 'lm')
    cxy, cz = cam.project(centers)
    for ci, nm in enumerate(names):
        if cz[ci] < 0.5:
            continue
        a = 0.8 * label_alpha * (0.35 if (focus is not None and ci != focus) else 1) * clamp01((H - 215 - cxy[ci, 1]) / 70)
        C.draw_text(cv, nm, 'g7', 16, cxy[ci, 0], cxy[ci, 1] - 150 / max(cz[ci], 1) * 10, CL_COL[ci], a, 'mm',
                    tracking=0.3)
    return lxy, lz


@scene
def embed_orbit(ctx):
    cv = ctx.cv; tb = ctx.tb
    p = ctx.p if ctx.shot['scene'] == 'embed_orbit' else (ctx.b % 8) / 8
    az = math.radians(-30 + 110 * e_io3(p))
    cam = C.Cam(C.orbit(16 - 3 * p, az, math.radians(18 + 8 * math.sin(p * 3)), target=(0, -1.3, 0)), (0, -1.3, 0), 50)
    draw_embed(cv, cam, ctx.t, label_alpha=0.55 + 0.45 * e_out3(ramp(tb, 0.0, 0.5)))
    if ctx.shot['scene'] == 'embed_orbit':
        step_label(cv, '02', 'EMBEDDINGS')
        a = e_out3(ramp(tb, 1.0, 1.4))
        C.draw_text(cv, '12,288', 'anton', 96, W - 130, H - 330, C.WHITE, a, 'rm')
        C.draw_text(cv, 'NUMBERS PER TOKEN · GPT-3', 'm7', 20, W - 130, H - 268, C.CYAN, a, 'rm', tracking=0.25)
        C.draw_text(cv, 'SIMILAR MEANING  →  NEARBY POINTS', 'm7', 20, 80, H - 268, C.GREY, a, 'lm',
                    tracking=0.25)


@scene
def embed_zoom(ctx):
    cv = ctx.cv; tb = ctx.tb
    P, cols, labs, centers, names = _embed()
    ci = names.index('ROYALTY')
    tgt = centers[ci]
    k = e_io3(ramp(tb, 0.0, 1.2))
    az = math.radians(80 + 20 * ctx.p)
    pos = C.orbit(lerp(16, 8.5, k), az, math.radians(20), target=tgt * k)
    cam = C.Cam(pos, tgt * k, 50)
    lxy, lz = draw_embed(cv, cam, ctx.t, label_size=30, focus=ci, show_axes=False)
    step_label(cv, '02', 'EMBEDDINGS')
    # vector readout in a fixed panel, linked to "king"
    ki = [i for i, l in enumerate(labs) if l[0] == 'king'][0]
    x, y = lxy[ki]
    a = e_out3(ramp(tb, 0.9, 1.1))
    vec = '[ 0.21, −0.53, 0.88, 0.07, −0.12, 0.64, … ]'
    shown = typed(vec, tb - 0.9, 60)
    px, py = W - 900 + 760, 760
    if a > 0:
        C.lines(cv, [(x + 8, y)], [(px - 760, py + 40)], C.AMBER, 1, 0.8 * a)
        C.draw_text(cv, 'king  =', 'm7', 28, px - 760, py, C.AMBER, a, 'lm')
        C.draw_text(cv, shown, 'm4', 26, px - 760, py + 44, C.WHITE, a, 'lm')
        C.draw_text(cv, '12,288 NUMBERS', 'm7', 18, px - 760, py + 88, C.GREY, a, 'lm', tracking=0.25)


@scene
def embed_math(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '02', 'EMBEDDINGS')
    O = np.array([W / 2 - 520, H / 2 + 210], np.float32)
    V = {'man': np.array([330, -120]), 'woman': np.array([300, -330]), 'king': np.array([760, -60]),
         'queen': np.array([730, -270])}
    colz = {'man': C.CYAN, 'woman': C.MAG, 'king': C.CYAN, 'queen': C.MAG}

    def arrow(p0, p1, c, k, th=3, a=1.0):
        if k <= 0:
            return
        p1 = p0 + (p1 - p0) * k
        C.lines(cv, [p0], [p1], c, th, a)
        d = p1 - p0; n = np.linalg.norm(d) + 1e-6; d /= n
        pr = np.array([-d[1], d[0]])
        h1 = p1 - d * 18 + pr * 9; h2 = p1 - d * 18 - pr * 9
        C.lines(cv, [p1, p1], [h1, h2], c, th, a)

    seq = [('king', -0.3), ('man', 0.5), ('woman', 1.0), ('queen', 1.5)]
    for nm, t0 in seq:
        k = e_out5(ramp(tb, t0, t0 + 0.3))
        arrow(O, O + V[nm], colz[nm], k, 3, 0.9)
        if k > 0:
            p = O + V[nm]
            glow_circle(cv, p[0], p[1], 7, colz[nm], k)
            C.draw_text(cv, nm, 'm7', 30, p[0] + 16, p[1] - 16, C.WHITE, k, 'lm')
    # difference vector woman - man, re-applied at king
    k = e_out5(ramp(tb, 1.0, 1.45))
    if k > 0:
        d = V['woman'] - V['man']
        a0 = O + V['king']
        arrow(a0, a0 + d, C.AMBER, k, 3, 1.0)
        a1 = O + V['man']
        arrow(a1, a1 + d, C.AMBER, k, 2, 0.5)
    if tb > 1.5:
        q = O + V['queen']
        kk = e_out5((tb - 1.5) / 0.3)
        ring(cv, q[0], q[1], 16 + 30 * (1 - kk), C.WHITE, 2, kk)
    glow_circle(cv, O[0], O[1], 5, C.WHITE, 0.8)
    parts = [('KING', -0.2, C.WHITE), (' − MAN', 0.5, C.CYAN), (' + WOMAN', 1.0, C.MAG), (' ≈ QUEEN', 1.5, C.AMBER)]
    x = W / 2 - C.text_size('KING − MAN + WOMAN ≈ QUEEN', 'anton', 96)[0] / 2
    for txt, t0, c in parts:
        k = e_out5(ramp(tb, t0, t0 + 0.2))
        if k > 0:
            C.draw_text(cv, txt, 'anton', 96, x, 330 + (1 - k) * 30, c, k, 'lm')
        x += C.text_size(txt, 'anton', 96)[0] + (C.text_size(' ', 'anton', 96)[0] if txt.startswith(' ') else 0) * 0
    C.draw_text(cv, 'DIRECTIONS IN THE SPACE ENCODE MEANING', 'm7', 20, W - 130, H - 268, C.GREY,
                ramp(tb, 0.3, 0.6), 'rm', tracking=0.25)


# ================================================================ 03 attention
ATT_WORDS = ['The', 'animal', 'didn’t', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired']
ATT_W = [0.03, 0.58, 0.03, 0.04, 0.03, 0.14, 0.05, 0.04, 0.02, 0.02, 0.06]


def att_layout(size=46, y=H / 2 + 130):
    ws = [C.text_size(w_, 'i6', size)[0] for w_ in ATT_WORDS]
    gap = 30
    total = sum(ws) + gap * (len(ws) - 1)
    x = W / 2 - total / 2
    xs = []
    for w_ in ws:
        xs.append(x + w_ / 2); x += w_ + gap
    return xs, ws, y


@scene
def attention_arcs(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    recap = ctx.shot['scene'] != 'attention_arcs'
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    if not recap:
        step_label(cv, '03', 'ATTENTION')
    xs, ws, y = att_layout()
    qi = ATT_WORDS.index('it')
    appear = (0.65 + 0.35 * e_out3(ramp(tb, 0.0, 0.3))) if not recap else 1.0
    for i, w_ in enumerate(ATT_WORDS):
        c = C.AMBER if i == qi else C.WHITE
        C.draw_text(cv, w_, 'i6', 46, xs[i], y, c, appear, 'mm')
    # query marker
    C.rrect_outline(cv, xs[qi] - ws[qi] / 2 - 14, y - 40, ws[qi] + 28, 80, 14, C.AMBER, 2, appear)
    kk = ramp(tb, 0.0, 1.4) if not recap else 1.0
    L = np.zeros_like(cv)
    best = None
    for j in range(len(ATT_WORDS)):
        if j == qi:
            continue
        w = ATT_W[j]
        p0 = np.array([xs[qi], y - 44]); p2 = np.array([xs[j], y - 44])
        h = 60 + abs(xs[qi] - xs[j]) * 0.45
        p1 = (p0 + p2) / 2 - [0, h]
        pts = bezier(p0, p1, p2, 60)
        k = clamp01(kk * 1.6 - abs(j - qi) * 0.05)
        n = max(2, int(60 * k))
        c = C.mixc(C.CYAN, C.AMBER, clamp01(w / 0.5))
        pulse = 1 + 0.5 * math.exp(-((tb % 1.0) * TL.BEAT) / 0.12)
        cv2.polylines(L, [(pts[:n] * 16).astype(np.int32)], False,
                      tuple(v * (0.25 + 1.6 * w) * pulse for v in c), max(1, int(1 + w * 14)), cv2.LINE_AA, 4)
        if j == 1:
            best = pts
        # weight bars under the words
        bk = e_out5(ramp(tb, 1.2 + j * 0.03, 1.6 + j * 0.03)) if not recap else 1
        C.rect(cv, xs[j] - 18, y + 50, xs[j] + 18, y + 50 + 220 * w * bk, c, 0.9, 'add')
        if w > 0.1 and bk > 0:
            C.draw_text(cv, f'{w:.2f}', 'm7', 22, xs[j], y + 70 + 220 * w * bk, C.WHITE, bk, 'mm')
    cv += L
    if best is not None and kk >= 1:
        for q in range(4):
            travel_dots(cv, best[::-1], ((t * 1.5 + q * 0.25) % 1.0), C.WHITE, 5, 1.0)
    if not recap:
        a = e_out5(ramp(tb, 2.0, 2.4))
        C.draw_text(cv, '“it”  =  the animal', 'g7', 60, W / 2, 330, C.WHITE, a, 'mm', tracking=0.02)
        C.draw_text(cv, 'CONTEXT DECIDES WHAT A WORD MEANS', 'm7', 20, W / 2, 390, C.CYAN, a, 'mm', tracking=0.3)


@functools.lru_cache(maxsize=1)
def _att_matrix():
    n = len(ATT_WORDS)
    r = np.random.default_rng(21)
    M = np.tril(r.random((n, n)) ** 3 + np.eye(n) * 0.6)
    M[7] = np.array(ATT_W)
    M = M / M.sum(1, keepdims=True)
    return M.astype(np.float32)


@scene
def attention_matrix(ctx):
    cv = ctx.cv; tb = ctx.tb
    M = _att_matrix()
    n = M.shape[0]
    az = math.radians(35 + 30 * ctx.p)
    cam = C.Cam(C.orbit(25, az, math.radians(36)), (0, 1.4, 0), 42)
    faces = []
    grow = ramp(tb, 0.0, 1.2)
    for i in range(n):
        for j in range(n):
            k = e_out5(clamp01(grow * 2.2 - (i + j) / (2 * n) * 1.2))
            h = 0.08 + M[i, j] * 5.5 * k
            x0, z0 = j - n / 2, i - n / 2
            s = 0.82
            V = np.array([[x0, 0, z0], [x0 + s, 0, z0], [x0 + s, 0, z0 + s], [x0, 0, z0 + s],
                          [x0, h, z0], [x0 + s, h, z0], [x0 + s, h, z0 + s], [x0, h, z0 + s]], np.float32)
            xy, z = cam.project(V)
            c = np.array(C.mixc((0.05, 0.25, 0.55), C.CYAN, clamp01(M[i, j] * 3)))
            if i == 7 and j == 1:
                c = np.array(C.AMBER)
            top = [4, 5, 6, 7]; front = [0, 1, 5, 4]; side = [1, 2, 6, 5]; side2 = [3, 0, 4, 7]
            faces.append((z.mean(), [(xy[top], c * 1.0), (xy[front], c * 0.55), (xy[side], c * 0.4),
                                     (xy[side2], c * 0.4)]))
    faces.sort(key=lambda f: -f[0])
    for _, fs in faces:
        for pts, c in fs[1:] + fs[:1]:
            cv2.fillConvexPoly(cv, (pts * 16).astype(np.int32), tuple(float(v) for v in c), cv2.LINE_AA, 4)
    step_label(cv, '03', 'ATTENTION')
    a = e_out3(ramp(tb, 0.5, 0.9))
    C.draw_text(cv, 'EVERY WORD × EVERY WORD', 'anton', 84, W - 130, H - 330, C.WHITE, a, 'rm')
    C.draw_text(cv, 'ATTENTION WEIGHTS, COMPUTED IN PARALLEL', 'm7', 20, W - 130, H - 268, C.CYAN, a, 'rm',
                tracking=0.25)


def _head_pattern(k, n=14):
    r = np.random.default_rng(100 + k)
    i, j = np.mgrid[0:n, 0:n]
    kind = k % 6
    if kind == 0:
        M = (i == j).astype(float)
    elif kind == 1:
        M = (j == i - 1).astype(float) + 0.1
    elif kind == 2:
        M = np.exp(-np.abs(i - j) / 3.0)
    elif kind == 3:
        M = (j == 0).astype(float) + 0.2 * r.random((n, n))
    elif kind == 4:
        M = (j % 3 == 0).astype(float) * 0.8 + 0.2 * r.random((n, n))
    else:
        M = r.random((n, n)) ** 4
    M = np.tril(M) + 1e-3
    return (M / M.max()).astype(np.float32)


@scene
def multihead(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '03', 'ATTENTION')
    cols, rows = 6, 2
    pw, ph = 190, 190
    gx = W / 2 - (cols * pw + (cols - 1) * 26) / 2
    gy = 270
    for q in range(cols * rows):
        i, j = q % cols, q // cols
        k = e_back(ramp(tb, -0.25 + q * 0.05, 0.1 + q * 0.05))
        if k <= 0:
            continue
        M = _head_pattern(q)
        img = cv2.resize(M, (int(pw), int(ph)), interpolation=cv2.INTER_NEAREST)
        c = TOKC[q % 5]
        rgb = img[..., None] * np.array(c, np.float32)[None, None] * 0.95
        x0 = int(gx + i * (pw + 26)); y0 = int(gy + j * (ph + 64))
        sc = k
        if sc < 0.98:
            rgb = cv2.resize(rgb, (max(2, int(pw * sc)), max(2, int(ph * sc))))
            x0 += int(pw * (1 - sc) / 2); y0 += int(ph * (1 - sc) / 2)
        hh, ww = rgb.shape[:2]
        if 0 <= y0 and y0 + hh <= H and 0 <= x0 and x0 + ww <= W:
            cv[y0:y0 + hh, x0:x0 + ww] += rgb
        C.rect(cv, x0, y0, x0 + ww, y0 + hh, c, 0.5 * clamp01(k), 'add', thick=1)
        C.draw_text(cv, f'HEAD {q + 1:02d}', 'm7', 16, x0, y0 + hh + 20, C.GREY, clamp01(k), 'lm', tracking=0.2)
    a = e_out5(ramp(tb, 0.9, 1.2))
    C.draw_text(cv, 'GPT-3: 96 LAYERS × 96 HEADS', 'anton', 76, W / 2, 830, C.WHITE, a, 'mm')


# ================================================================ 04 predict
PROMPT = 'The best way to predict the future is to'
CANDS = [('invent', 0.41), ('create', 0.22), ('build', 0.14), ('shape', 0.09), ('plan', 0.05)]


@scene
def predict_bars(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '04', 'PREDICTION')
    size = 50
    pw_ = C.text_size(PROMPT, 'i6', size)[0]
    blank_w = 210
    x0 = W / 2 - (pw_ + 20 + blank_w) / 2
    y = 330
    C.draw_text(cv, PROMPT, 'i6', size, x0, y, C.WHITE, 1.0, 'lm')
    bx = x0 + pw_ + 20
    fly = e_io3(ramp(tb, 1.05, 1.45))
    C.rrect_outline(cv, bx, y - 38, blank_w, 76, 12, C.CYAN, 2, 1.0 - 0.5 * fly)
    if fly <= 0:
        blink = (tb % 0.5) < 0.3
        C.rect(cv, bx + 16, y - 26, bx + 20, y + 26, C.CYAN, 1.0 if blink else 0.2, 'add')
    by0 = 470
    for i, (wd, p) in enumerate(CANDS):
        k = e_out5(ramp(tb, -0.12 + i * 0.07, 0.55 + i * 0.07))
        yy = by0 + i * 70
        hl = (i == 0) and tb > 0.95
        c = C.AMBER if hl else C.CYAN
        C.draw_text(cv, wd, 'm7', 34, W / 2 - 330, yy, C.WHITE, k * (0.4 if (i == 0 and fly > 0) else 1), 'rm')
        C.rect(cv, W / 2 - 300, yy - 20, W / 2 - 300 + 1200 * p * k, yy + 20, c, 0.85 * k, 'add')
        C.draw_text(cv, f'{p * k:.2f}', 'm7', 28, W / 2 - 280 + 1200 * p * k, yy, C.WHITE, k, 'lm')
    if fly > 0:
        sx, sy = W / 2 - 330 - C.text_size('invent', 'm7', 34)[0] / 2, by0
        ex, ey = bx + blank_w / 2, y
        x = lerp(sx, ex, e_out5(fly)); yv = lerp(sy, ey, e_in3(fly))
        C.draw_text(cv, 'invent', 'i6' if fly > 0.5 else 'm7', size if fly > 0.5 else 34, x, yv, C.AMBER, 1.0, 'mm')
        if fly >= 1:
            ctx.post['ca'] += 3
    C.draw_text(cv, 'NEXT-TOKEN PROBABILITIES · ILLUSTRATIVE', 'm7', 18, W / 2, H - 250, C.GREY, 0.9, 'mm',
                tracking=0.3)


@functools.lru_cache(maxsize=1)
def _net3d():
    r = np.random.default_rng(3)
    g = np.linspace(-3, 3, 7)
    X, Y = np.meshgrid(g, g)
    layers = []
    for li in range(12):
        P = np.stack([X.ravel(), Y.ravel() * 0.62, np.full(49, li * 3.0)], 1)
        layers.append(P)
    P = np.concatenate(layers).astype(np.float32)
    links = []
    for li in range(11):
        a = r.integers(0, 49, 60) + li * 49
        b = r.integers(0, 49, 60) + (li + 1) * 49
        links.append(np.stack([a, b], 1))
    return P, np.concatenate(links)


@scene
def deepnet3d(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    P, links = _net3d()
    camz = lerp(-8, 22, e_io3(ctx.p))
    cam = C.Cam((1.2 * math.sin(t), 0.6, camz), (0, 0, camz + 10), 70, roll=0.15 * math.sin(t * 1.3))
    xy, z = cam.project(P)
    wave = camz + 6 + 4 * math.sin(t * 5)
    lz = P[:, 2]
    act = np.exp(-((lz - wave) ** 2) / 4.0)
    C.lines(cv, xy[links[:, 0]], xy[links[:, 1]], (0.1, 0.35, 0.5), 1, 0.7) if True else None
    vis = z > 0.3
    colr = (np.array(C.CYAN)[None] * (0.25 + act[:, None]) + np.array(C.WHITE)[None] * act[:, None] * 0.6)
    rr = cam.f * 0.05 / np.maximum(z, 0.3)
    C.dots(cv, xy[vis], np.clip(rr[vis], 0.8, 14), colr[vis], 1.0)
    step_label(cv, '04', 'PREDICTION')
    a = e_out5(ramp(tb, 0.3, 0.7))
    C.draw_text(cv, 'LAYER AFTER LAYER', 'anton', 130, W / 2, H / 2 - 30, C.WHITE, a, 'mm', scale=lerp(1.15, 1, a))
    C.draw_text(cv, 'EACH ONE REFINES THE GUESS', 'm7', 24, W / 2, H / 2 + 60, C.CYAN, a, 'mm', tracking=0.3)
    ctx.post['rblur'] += 0.015


AUTO_TOK = [' invent', ' it', '.', ' ↻']


@scene
def autoregress(ctx):
    cv = ctx.cv; tb = ctx.tb
    k = ctx.shot['k']
    bgs = [C.BG_MAIN, C.BG_VIOLET, C.BG_TEAL, C.BG_WARM]
    cv[:] = bgs[k]
    C.line_grid(cv, 96, (0.03, 0.045, 0.07), offset=(int(ctx.b * 40), 0))
    step_label(cv, '04', 'PREDICTION')
    base = PROMPT.split(' ')
    toks = [w_ for w_ in base] + [a.strip() for a in AUTO_TOK[:k + 1]]
    size = 52
    fl = ctx.tb * TL.FPB
    ws = [C.text_size(w_, 'i6', size)[0] for w_ in toks]
    gap = 22
    total = sum(ws) + gap * (len(toks) - 1)
    sc = [1.0, 1.08, 0.96, 1.0][k]
    x = W / 2 - total / 2
    y = H / 2 - 20 + [0, -20, 20, -60][k]
    for i, w_ in enumerate(toks):
        new = i == len(toks) - 1
        prev_gen = i >= len(base)
        if new:
            e = e_out5(fl / 6)
            c = C.AMBER
            C.rrect(cv, x - 12, y - 42, ws[i] + 24, 84, 12, tuple(v * 0.3 for v in c), e)
            C.draw_text(cv, w_, 'i6', size, x + ws[i] / 2, y, C.WHITE, 1.0, 'mm', scale=lerp(1.6, 1.0, e))
        else:
            c = C.CYAN if prev_gen else (0.75, 0.8, 0.9)
            C.draw_text(cv, w_, 'i6', size, x + ws[i] / 2, y, c, 0.9, 'mm')
        x += ws[i] + gap
    # loop arrow: output feeds back into input
    a = e_out3(ramp(tb, 0.1, 0.5))
    lx0, lx1 = W / 2 - total / 2, W / 2 + total / 2
    pts = np.array([[lx1 - 20, y + 60], [lx1 - 20, y + 130], [lx0 + 20, y + 130], [lx0 + 20, y + 60]])
    C.polyline(cv, pts, C.GREY, 2, 0.8 * a)
    travel_dots(cv, pts, (tb * 0.9) % 1.0, C.AMBER, 6, a)
    C.draw_text(cv, 'OUTPUT BECOMES INPUT', 'm7', 20, W / 2, y + 170, C.GREY, a, 'mm', tracking=0.3)
    C.draw_text(cv, f'STEP {k + 1}', 'anton', 84, W - 130, 200, C.AMBER, 1.0, 'rm')
    if k == 3:
        e = e_out5(fl / 8)
        C.draw_text(cv, 'ONE TOKEN AT A TIME', 'anton', 120, W / 2, 320, C.WHITE, e, 'mm', scale=lerp(1.3, 1, e))
    ctx.post['rot'] = [0, -1.2, 1.0, 0][k]


# ================================================================ BREAK — SCALE
@functools.lru_cache(maxsize=1)
def _brain():
    r = np.random.default_rng(9)
    P = C.fib_sphere(4200, 1.0)
    n = (np.sin(P[:, 0] * 5) * np.sin(P[:, 1] * 6 + 1) * np.sin(P[:, 2] * 4 + 2))
    P = P * (1 + 0.1 * n[:, None])
    # neighbour links
    idx = r.integers(0, len(P), 2600)
    d = np.linalg.norm(P[idx][:, None] - P[None], axis=2)
    d[np.arange(len(idx)), idx] = 9
    nb = np.argsort(d, axis=1)[:, 3:9][:, r.integers(0, 6, 2)]
    pairs = np.concatenate([np.stack([idx, nb[:, 0]], 1), np.stack([idx, nb[:, 1]], 1)])
    inner = r.normal(0, 0.45, (900, 3)).astype(np.float32)
    return P.astype(np.float32), pairs, inner, r.random(len(P)).astype(np.float32)


def draw_brain(cv, cam, t, scale=3.2, bright=1.0, hue=(C.CYAN, C.VIOLET), rot=None):
    P, pairs, inner, rnd = _brain()
    Rm = C.ry(t * 0.35) @ C.rx(0.25) if rot is None else rot
    Q = (P * scale) @ Rm.T
    xy, z = cam.project(Q)
    depth = C.depth_fade(z, cam_dist(cam) - scale, cam_dist(cam) + scale)
    col = np.array(hue[0])[None] * (1 - rnd[:, None]) + np.array(hue[1])[None] * rnd[:, None]
    tw = 0.6 + 0.4 * np.sin(rnd * 40 + t * 4)
    C.splat(cv, xy, col.astype(np.float32), (depth * tw * 3.2 * bright).astype(np.float32), z=z, soft=1.1, gain=3.0)
    hub = rnd > 0.94
    C.dots(cv, xy[hub], (2.2 + 2.5 * depth[hub]), col[hub] * (depth[hub] * tw[hub] * bright)[:, None], 1.0)
    a, b_ = pairs[:, 0], pairs[:, 1]
    m = (depth[a] > 0.45)
    lc = (np.array(hue[0]) * 0.16 * bright)
    C.lines(cv, xy[a][m], xy[b_][m], lc, 1, 1.0)
    I = (inner * scale) @ Rm.T
    ixy, iz = cam.project(I)
    C.splat(cv, ixy, np.array(C.WHITE, np.float32), np.full(len(I), 0.35 * bright, np.float32), z=iz)
    # pulses along links
    for q in range(40):
        i = (q * 97 + int(t * 3)) % len(pairs)
        u = (t * 3 + q * 0.13) % 1.0
        p = xy[pairs[i, 0]] * (1 - u) + xy[pairs[i, 1]] * u
        if depth[pairs[i, 0]] > 0.5:
            glow_circle(cv, p[0], p[1], 2.5, C.WHITE, 0.9 * bright)
    return xy


def cam_dist(cam):
    return float(np.linalg.norm(cam.pos))


@scene
def brain_sphere(ctx):
    cv = ctx.cv; tb = ctx.tb
    recap = ctx.shot['scene'] != 'brain_sphere'
    starfield(cv, ctx.b * 0.3, bright=0.35)
    cx = W / 2 + (330 if not recap else 0)
    cam = C.Cam(C.orbit(11 - 1.5 * e_io3(ctx.p), math.radians(10 * ctx.p), math.radians(8)), (0, 0, 0), 45, cx=cx)
    draw_brain(cv, cam, ctx.b * TL.BEAT, 3.2 * (1 + 0.03 * ctx.kick))
    if recap:
        return
    a1 = ramp(tb, 0.3, 1.2)
    C.kinetic(cv, 'SCALE', 'anton', 230, 360, H / 2 - 150, ctx.t - 0.15, C.WHITE, 0.06, 0.4, style='scramble',
              seed=int(ctx.t * 12))
    C.kinetic(cv, 'CHANGES EVERYTHING', 'g7', 40, 360, H / 2 - 10, ctx.t - 0.8, C.CYAN, 0.03, 0.3, style='rise',
              tracking=0.2)
    for i, (nm, v) in enumerate([('DATA', 0.8), ('COMPUTE', 0.95), ('PARAMETERS', 0.7)]):
        k = e_out5(ramp(tb, 3.0 + i * 0.7, 3.6 + i * 0.7))
        y = H / 2 + 80 + i * 56
        C.draw_text(cv, nm, 'm7', 22, 150, y, C.WHITE, k, 'lm', tracking=0.25)
        C.rect(cv, 340, y - 3, 340 + 260 * v * k, y + 3, C.CYAN, k, 'add')
        C.draw_text(cv, '↑', 'dejavu', 26, 340 + 260 * v * k + 18, y, C.CYAN, k, 'lm')


@scene
def compute_chart(ctx):
    cv = ctx.cv; tb = ctx.tb
    x0, x1, y0, y1 = 300, 1640, 240, 800
    yr0, yr1 = 2010, 2025
    l0, l1 = 16, 27
    push = 1 + 0.05 * ctx.p

    def X(yr):
        return x0 + (yr - yr0) / (yr1 - yr0) * (x1 - x0)

    def Y(lg):
        return y1 - (lg - l0) / (l1 - l0) * (y1 - y0)

    a = 1.0
    C.rect(cv, x0, y1, x1, y1 + 2, (0.5, 0.55, 0.65), a)
    C.rect(cv, x0, y0, x0 + 2, y1, (0.5, 0.55, 0.65), a)
    sup = str.maketrans('0123456789', '⁰¹²³⁴⁵⁶⁷⁸⁹')
    for lg in range(l0, l1 + 1, 2):
        C.rect(cv, x0, Y(lg), x1, Y(lg) + 1, (0.12, 0.15, 0.22), a, 'add')
        C.draw_text(cv, '10' + str(lg).translate(sup), 'm7', 20, x0 - 16, Y(lg), C.GREY, a, 'rm')
    for yr in range(2010, 2026, 5):
        C.draw_text(cv, str(yr), 'm7', 20, X(yr), y1 + 30, C.GREY, a, 'mm')
    C.draw_text(cv, 'TRAINING COMPUTE (FLOP, LOG SCALE)', 'm7', 16, x0, y0 - 30, C.GREY, a, 'lm', tracking=0.2)
    lk = 0.04 + 0.96 * e_io3(ramp(tb, 0.0, 6.0))
    yrs = np.linspace(2012, 2025, 200)
    lgs = math.log10(4.7e17) + (yrs - 2012) * math.log10(4.6)
    n = max(2, int(200 * lk))
    pts = np.stack([X(yrs), Y(lgs)], 1)
    C.polyline(cv, pts[:n], C.CYAN, 4, 1.0)
    if 0 < lk < 1:
        glow_circle(cv, pts[n - 1][0], pts[n - 1][1], 9, C.WHITE, 1.2)
    r = np.random.default_rng(4)
    ptyr = np.sort(r.uniform(2012.2, 2024.9, 46))
    ptlg = math.log10(4.7e17) + (ptyr - 2012) * math.log10(4.6) + r.normal(0, 0.55, len(ptyr))
    for yr, lg in zip(ptyr, ptlg):
        if yr <= 2012 + 13 * lk:
            glow_circle(cv, X(yr), Y(lg), 5, (0.4, 0.55, 0.8), 0.9)
    for nm, yr, fl, above in [('ALEXNET · 4.7×10¹⁷', 2012.0, 4.7e17, True), ('GPT-3 · 3.1×10²³', 2020.4, 3.1e23, True)]:
        if yr <= 2012 + 13 * lk + 0.01:
            k = e_out5(ramp((2012 + 13 * lk - yr), 0, 0.8))
            px, py = X(yr), Y(math.log10(fl))
            glow_circle(cv, px, py, 8, C.AMBER, 1.2)
            C.rect(cv, px, py - 60 * k, px + 1, py, C.AMBER, 0.8, 'add')
            C.draw_text(cv, nm, 'm7', 20, px + 8, py - 72 * k, C.AMBER, k, 'lm')
    k = e_out5(ramp(tb, -0.15, 0.35))
    C.draw_text(cv, '4–5× PER YEAR', 'anton', 120, x0 + 40, y0 + 90, C.WHITE, k, 'lm', scale=push)
    C.draw_text(cv, 'FRONTIER AI TRAINING COMPUTE · SOURCE: EPOCH AI', 'm7', 18, x0 + 44, y0 + 170, C.CYAN, k, 'lm',
                tracking=0.2)
```

### 26/30 · `The_Age_of_Intelligence-source/src/scenes3.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/scenes3.py", "lines": 741, "final_newline": true, "sha256": "60efd0e7442bd8b85fe6cf44d7e1a39fcf043d07dbb50d91606702cd6fca7d41", "original_sha256": "60efd0e7442bd8b85fe6cf44d7e1a39fcf043d07dbb50d91606702cd6fca7d41"} -->
```python
"""Scenes part 3: BUILD 2, DROP 2 (capabilities), switch-up, OUTRO."""
import math, functools
import numpy as np, cv2
import core as C
from core import W, H, e_out3, e_out5, e_io3, e_in3, e_back, ramp, clamp01, lerp
import timeline as TL
from scenes import (scene, SCENES, glow_circle, ring, fill_circle, bezier, travel_dots, starfield, typed, dimmer,
                    bracket_box, text_points)
from scenes2 import draw_brain, TOKC, _burst


# ================================================================ shared
def grid_floor(cv, travel, c1=C.MAG, c2=C.CYAN, horizon=0.46, roll=0.0, bright=1.0):
    hy = H * horizon
    # horizon glow
    g = np.exp(-((np.arange(H, dtype=np.float32) - hy) / 70.0) ** 2)[:, None, None]
    cv += g * np.array(c1, np.float32) * 0.18 * bright
    cam = C.Cam((0, 1.6, 0), (0, 1.6 - 0.35, 4), 70, roll=roll, cy=hy + 20)
    zs = (np.arange(0, 40, 1.6) - travel % 1.6) + 1.0
    A = np.stack([np.full_like(zs, -60), np.zeros_like(zs), zs], 1)
    B = np.stack([np.full_like(zs, 60), np.zeros_like(zs), zs], 1)
    xa, za = cam.project(A); xb, zb = cam.project(B)
    fade = np.clip(1 - zs / 40, 0, 1) ** 1.5
    C.lines(cv, xa, xb, np.array(c1)[None] * fade[:, None] * bright, 2)
    xs = np.arange(-30, 31, 2.0)
    A = np.stack([xs, np.zeros_like(xs), np.full_like(xs, 0.8)], 1)
    B = np.stack([xs, np.zeros_like(xs), np.full_like(xs, 40.0)], 1)
    xa, _ = cam.project(A); xb, _ = cam.project(B)
    C.lines(cv, xa, xb, np.array(c2) * 0.55 * bright, 1)


def cap_label(ctx, text, idx):
    cv = ctx.cv
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 7)
    C.draw_text(cv, idx, 'm7', 20, 84, 170, C.CYAN, e, 'lm', tracking=0.3)
    C.draw_text(cv, text, 'anton', 104, 80 + (1 - e) * -60, 240, C.WHITE, clamp01(fl / 3), 'lm')
    tw = C.text_size(text, 'anton', 104)[0]
    C.rect(cv, 80, 305, 80 + tw * e, 309, C.CYAN, 1.0, 'add')


def panel(cv, x, y, w, h, a=1.0, title=None):
    C.rrect(cv, x, y, w, h, 18, (0.03, 0.04, 0.065), a * 0.96)
    C.rrect_outline(cv, x, y, w, h, 18, (0.28, 0.38, 0.52), 1, a)
    C.rect(cv, x + 1, y + 44, x + w - 1, y + 45, (0.2, 0.26, 0.36), a)
    for i, c in enumerate([C.MAG, C.AMBER, C.LIME]):
        glow_circle(cv, x + 26 + i * 20, y + 22, 5.5, c, 0.7 * a)
    if title:
        C.draw_text(cv, title, 'm4', 18, x + w / 2, y + 22, C.GREY, a, 'mm', tracking=0.1)


# ================================================================ BUILD 2
@scene
def question_changed(ctx):
    cv = ctx.cv; tb = ctx.tb; b = ctx.b
    v = ctx.shot['v']
    grid_floor(cv, b * 1.2 * (1 + (b - 112) / 10), roll=(0.04 * math.sin(b)) if v else 0.0)
    starfield(cv, b * 0.6, bright=0.4)
    if v == 0:
        C.kinetic(cv, 'THE QUESTION', 'anton', 190, W / 2, H / 2 - 170, ctx.t + 0.15, C.WHITE, 0.05, 0.35,
                  style='scramble', seed=int(ctx.t * 14))
        C.kinetic(cv, 'HAS CHANGED', 'anton', 190, W / 2, H / 2 + 20, ctx.t - 0.9, C.CYAN, 0.05, 0.35,
                  style='scramble', seed=int(ctx.t * 14) + 1)
    else:
        q = 'CAN MACHINES THINK?'
        a = e_out3(ramp(tb, 0.0, 0.3))
        y = H / 2 - 90
        C.draw_text(cv, q, 'm8', 96, W / 2, y, C.WHITE, a * (1 - 0.55 * ramp(tb, 1.4, 2.0)), 'mm')
        tw = C.text_size(q, 'm8', 96)[0]
        k = e_io3(ramp(tb, 1.0, 1.35))
        if k > 0:
            C.rect(cv, W / 2 - tw / 2 - 20, y - 4, W / 2 - tw / 2 - 20 + (tw + 40) * k, y + 6, C.MAG, 1.4, 'add')
        a2 = e_out5(ramp(tb, 2.0, 2.4))
        C.draw_text(cv, '1950’S QUESTION: ANSWERED ENOUGH.', 'm7', 26, W / 2, y + 110, C.GREY, a2, 'mm',
                    tracking=0.25)
        C.draw_text(cv, 'HERE’S THE NEW ONE ↓', 'm7', 26, W / 2, y + 160, C.CYAN, ramp(tb, 2.8, 3.0), 'mm',
                    tracking=0.25)
        if 1.0 <= tb < 1.15:
            ctx.post['glitch'] = 25


@scene
def grid_word(ctx):
    cv = ctx.cv; b = ctx.b
    v = ctx.shot['v']; word = ctx.shot['word']; fast = ctx.shot.get('fast', False)
    cols = [(C.MAG, C.CYAN), (C.CYAN, C.VIOLET), (C.AMBER, C.MAG)][v]
    grid_floor(cv, b * 1.8 * (1 + (b - 112) / 8), cols[0], cols[1], roll=0.06 * (v - 1))
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 6)
    size = 300 if len(word) <= 5 else 230
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 40, (0, 0, 0), 0.6, 'mm', scale=lerp(1.35, 1, e) * 1.02,
                blur=10)
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 40, C.WHITE, 1.0, 'mm', scale=lerp(1.35, 1, e))
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 40, cols[0], 0.6 * (1 - e), 'mm', scale=lerp(1.35, 1, e) * 1.04,
                mode='add')
    if fast:
        ctx.post['invert'] = (ctx.si % 2 == 0)
        ctx.post['glitch'] = 18 * math.exp(-fl / 3)


@scene
def icon_flash(ctx):
    cv = ctx.cv
    k = ctx.shot['k']
    bgc = [C.CYAN, C.MAG, C.AMBER, C.LIME][k]
    cv[:] = np.array(bgc, np.float32) * 0.22
    C.line_grid(cv, 80, tuple(v * 0.2 for v in bgc))
    cx, cy = W / 2, H / 2 - 30
    fl = ctx.tb * TL.FPB
    s = lerp(1.25, 1.0, e_out5(fl / 5))
    if k == 0:
        C.draw_text(cv, '</>', 'm8', 300, cx, cy, C.WHITE, 1.0, 'mm', scale=s)
    elif k == 1:
        L = np.zeros_like(cv)
        cv2.ellipse(L, (int(cx * 16), int(cy * 16)), (int(300 * s * 16), int(150 * s * 16)), 0, 0, 360, (1, 1, 1), 14,
                    cv2.LINE_AA, 4)
        cv += L
        fill_circle(cv, cx, cy, 95 * s, (1, 1, 1))
        fill_circle(cv, cx, cy, 45 * s, tuple(v * 0.22 for v in bgc))
    elif k == 2:
        ys = np.linspace(-280, 280, 120) * s
        for ph in (0, math.pi):
            pts = np.stack([cx + np.sin(ys / 60 + ph + ctx.t * 6) * 130 * s, cy + ys], 1)
            C.polyline(cv, pts, C.WHITE, 12, 1.0)
        for yy in ys[::10]:
            x1 = cx + math.sin(yy / 60 + ctx.t * 6) * 130 * s; x2 = cx + math.sin(yy / 60 + math.pi + ctx.t * 6) * 130 * s
            C.lines(cv, [(x1, cy + yy)], [(x2, cy + yy)], C.WHITE, 5, 0.8)
    else:
        ring(cv, cx, cy, 250 * s, C.WHITE, 12, 1.0)
        L = np.zeros_like(cv)
        for i in range(1, 4):
            cv2.ellipse(L, (int(cx * 16), int(cy * 16)), (int(250 * s * i / 4 * 16), int(250 * s * 16)), 0, 0, 360,
                        (1, 1, 1), 6, cv2.LINE_AA, 4)
            yy = cy + (i - 2) * 125 * s
            half = math.sqrt(max(0, (250 * s) ** 2 - ((i - 2) * 125 * s) ** 2))
            cv2.line(L, (int((cx - half) * 16), int(yy * 16)), (int((cx + half) * 16), int(yy * 16)), (1, 1, 1), 6,
                     cv2.LINE_AA, 4)
        cv += L
    ctx.post['glitch'] = 14


# ================================================================ DROP 2
CODE = [
    ('def ', 'k'), ('attention', 'f'), ('(Q, K, V):', 'p'), None,
    ('    ', 'p'), ('# scaled dot-product attention', 'c'), None,
    ('    d_k = Q.shape[-1]', 'p'), None,
    ('    scores = Q @ K.T / ', 'p'), ('math', 'f'), ('.sqrt(d_k)', 'p'), None,
    ('    weights = ', 'p'), ('softmax', 'f'), ('(scores, axis=-1)', 'p'), None,
    ('    ', 'p'), ('return ', 'k'), ('weights @ V', 'p'), None,
    ('', 'p'), None,
    ('', 'p'), ('# generated, reviewed, shipped', 'c'), None,
]
CODE_COL = {'k': C.MAG, 'f': C.CYAN, 'p': (0.88, 0.9, 0.95), 'c': (0.45, 0.52, 0.62), 's': C.AMBER}


def code_lines():
    lines_, cur = [], []
    for tok in CODE:
        if tok is None:
            lines_.append(cur); cur = []
        else:
            cur.append(tok)
    return lines_


@scene
def code_editor(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    x0, y0, w, h = 700, 150, 1120, 660
    panel(cv, x0, y0, w, h, 1.0, 'attention.py')
    lines_ = code_lines()
    total = sum(len(''.join(t for t, _ in ln)) for ln in lines_)
    nchar = int(clamp01((tb - 0.05) / 1.45) * total)
    used = 0
    y = y0 + 100
    for li, ln in enumerate(lines_):
        C.draw_text(cv, f'{li + 1:2d}', 'm4', 26, x0 + 50, y, (0.3, 0.36, 0.46), 1.0, 'rm')
        x = x0 + 80
        for txt, kind in ln:
            if used >= nchar:
                break
            part = txt[:max(0, nchar - used)]
            used += len(part)
            if part:
                C.draw_text(cv, part, 'm4' if kind != 'k' else 'm7', 26, x, y, CODE_COL[kind], 1.0, 'lm')
                x += C.text_size(part, 'm4' if kind != 'k' else 'm7', 26)[0]
        if used >= nchar and used < total:
            if (tb * 4) % 1 < 0.6:
                C.rect(cv, x + 2, y - 16, x + 16, y + 16, C.CYAN, 1.0, 'add')
            break
        y += 50
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@scene
def tests_pass(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    x0, y0, w, h = 700, 150, 1120, 660
    panel(cv, x0, y0, w, h, 1.0, 'terminal')
    tests = ['test_attention_shapes', 'test_softmax_rows_sum_to_one', 'test_causal_mask', 'test_gradients_flow',
             'test_batch_invariance', 'test_fp16_stability', 'test_long_context', 'test_edge_cases']
    C.draw_text(cv, '$ pytest -q', 'm7', 26, x0 + 40, y0 + 100, C.LIME, 1.0, 'lm')
    for i, tname in enumerate(tests):
        k = ramp(tb, 0.1 + i * 0.09, 0.14 + i * 0.09)
        if k <= 0:
            continue
        y = y0 + 150 + i * 44
        C.draw_text(cv, tname, 'm4', 24, x0 + 40, y, (0.8, 0.84, 0.9), 1.0, 'lm')
        dots_w = int(clamp01((tb - 0.1 - i * 0.09) / 0.1) * 18)
        C.draw_text(cv, '.' * dots_w, 'm4', 24, x0 + 520, y, (0.4, 0.45, 0.55), 1.0, 'lm')
        if tb > 0.2 + i * 0.09:
            C.draw_text(cv, 'PASSED', 'm7', 24, x0 + 820, y, C.LIME, 1.0, 'lm')
    k = e_back(ramp(tb, 1.0, 1.3))
    if k > 0:
        C.rrect(cv, W / 2 + 300 - 330 * k, H / 2 + 170, 660 * k, 110, 20, (0.1, 0.25, 0.05), 0.95)
        C.draw_text(cv, '✓  128 PASSED', 'anton', 84, W / 2 + 300, H / 2 + 225, C.LIME, clamp01(k), 'mm', scale=k)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@functools.lru_cache(maxsize=1)
def _city():
    r = np.random.default_rng(6)
    blds = []
    for i in range(-7, 8):
        for j in range(0, 22):
            if i in (-1, 0, 1) or j % 5 == 0:
                continue
            if r.random() < 0.25:
                continue
            hgt = r.uniform(0.6, 5.5) * (1 + 0.6 * (abs(i) > 3))
            blds.append((i * 1.4, j * 1.4, 0.55 + r.random() * 0.3, hgt))
    return blds


@scene
def vision_city(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    travel = t * 5.5
    cam = C.Cam((0.3 * math.sin(t), 2.4, -4 + travel), (0, 1.2, 8 + travel), 62, roll=0.03 * math.sin(t * 2))
    blds = _city()
    edges = [(0, 1), (1, 2), (2, 3), (3, 0), (4, 5), (5, 6), (6, 7), (7, 4), (0, 4), (1, 5), (2, 6), (3, 7)]
    P1, P2, cols = [], [], []
    boxes = []
    for bi, (x, z, s, hgt) in enumerate(blds):
        zz = (z - travel) % (22 * 1.4) + travel - 2
        V = np.array([[x - s, 0, zz - s], [x + s, 0, zz - s], [x + s, 0, zz + s], [x - s, 0, zz + s],
                      [x - s, hgt, zz - s], [x + s, hgt, zz - s], [x + s, hgt, zz + s], [x - s, hgt, zz + s]],
                     np.float32)
        xy, zc = cam.project(V)
        if zc.min() < 0.5:
            continue
        fade = clamp01(1.4 - (zc.mean() - 2) / 26)
        for a, b_ in edges:
            P1.append(xy[a]); P2.append(xy[b_]); cols.append(np.array(C.CYAN) * 0.55 * fade)
        if bi % 7 == 0 and 3 < zc.mean() < 16:
            boxes.append((xy, zc.mean(), bi))
    # ground grid
    for gx in np.arange(-10, 11, 1.4):
        A = np.array([[gx, 0, travel + 0.5]]); B = np.array([[gx, 0, travel + 30]])
        xa, _ = cam.project(A); xb, _ = cam.project(B)
        P1.append(xa[0]); P2.append(xb[0]); cols.append(np.array((0.1, 0.18, 0.3)))
    C.lines(cv, np.array(P1), np.array(P2), np.array(cols), 1)
    # moving cars on the avenue
    r = np.random.default_rng(2)
    for ci in range(9):
        lane = [-0.6, 0.6][ci % 2]
        z = travel + ((ci * 3.1 + t * (6 if lane > 0 else -3)) % 26) + 1.5
        P = np.array([[lane - 0.35, 0, z - 0.6], [lane + 0.35, 0.45, z + 0.6]], np.float32)
        xy, zc = cam.project(P)
        if zc.min() < 0.8:
            continue
        x0_, x1_ = sorted([xy[0, 0], xy[1, 0]]); y0_, y1_ = sorted([xy[0, 1], xy[1, 1]])
        C.rect(cv, x0_, y0_, x1_, y1_, C.AMBER, 0.25, 'add')
        if ci % 3 == 0:
            bracket_box(cv, x0_ - 8, y0_ - 8, x1_ + 8, y1_ + 8, C.AMBER, 1.0, 10, 2)
            C.draw_text(cv, f'car {0.9 + 0.01 * (ci % 9):.2f}', 'm7', 16, x0_ - 8, y0_ - 22, C.AMBER, 1.0, 'lm')
    for xy, zm, bi in boxes[:4]:
        x0_, y0_ = xy.min(0); x1_, y1_ = xy.max(0)
        bracket_box(cv, x0_ - 6, y0_ - 6, x1_ + 6, y1_ + 6, C.LIME, 1.0, 14, 2)
        C.draw_text(cv, f'building {0.93 + (bi % 6) / 100:.2f}', 'm7', 16, x0_ - 6, y0_ - 20, C.LIME, 1.0, 'lm')
    # scan line + reticle
    sy = (t * 900) % H
    C.rect(cv, 0, sy, W, sy + 2, C.LIME, 0.3, 'add')
    ring(cv, W / 2, H / 2, 40, C.WHITE, 1, 0.5)
    C.draw_text(cv, 'OBJECTS: 37   FPS: 60   LATENCY: 12 MS', 'm7', 18, W - 130, 190, C.GREY, 1.0, 'rm',
                tracking=0.15)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@scene
def speech_wave(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    n = 96
    xs = np.linspace(W / 2 - 760, W / 2 + 760, n)
    r = np.random.default_rng(int(t * 30))
    for lane, (y, c, t0, t1) in enumerate([(H / 2 - 40, C.CYAN, 0.0, 0.95), (H / 2 + 150, C.MAG, 1.0, 1.95)]):
        act = ramp(tb, t0, t0 + 0.1) * (1 - ramp(tb, t1 - 0.1, t1))
        env = np.sin(np.linspace(0, math.pi, n)) ** 0.7
        syl = 0.5 + 0.5 * np.sin(xs / 37 + t * 22) * np.sin(xs / 91 - t * 9)
        hgt = 8 + 150 * act * env * np.abs(syl) * (0.6 + 0.4 * r.random(n))
        for x, hh in zip(xs, hgt):
            C.rect(cv, x - 4, y - hh / 2, x + 4, y + hh / 2, c, 0.9, 'add')
        C.draw_text(cv, ['YOU', 'AI'][lane], 'm7', 20, W / 2 - 800, y, c, 1.0, 'rm', tracking=0.3)
    q = '“Summarize this meeting in three bullet points.”'
    a = '“Sure — decisions, owners, and next deadlines…”'
    C.draw_text(cv, typed(q, tb - 0.1, 60), 'i6', 34, W / 2, H / 2 - 150, C.WHITE, 1.0, 'mm')
    C.draw_text(cv, typed(a, tb - 1.1, 60), 'i6', 34, W / 2, H / 2 + 260, (1.0, 0.8, 0.9), 1.0, 'mm')
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@functools.lru_cache(maxsize=1)
def _protein():
    r = np.random.default_rng(15)
    pts = []; kinds = []
    p = np.zeros(3); d = np.array([1.0, 0, 0])
    seg = 0
    while len(pts) < 520:
        kind = seg % 3
        if kind == 0:   # alpha helix
            ax = d / np.linalg.norm(d)
            u = np.cross(ax, [0, 1, 0.3]); u /= np.linalg.norm(u); v = np.cross(ax, u)
            nres = int(r.integers(22, 40))
            for i in range(nres):
                kinds.append(1)
                th = i * 100 / 180 * math.pi
                pts.append(p + ax * i * 0.16 + (u * math.cos(th) + v * math.sin(th)) * 0.62)
            p = pts[-1]
        else:           # loop / strand
            nres = int(r.integers(10, 22))
            for i in range(nres):
                kinds.append(0)
                d = d + r.normal(0, 0.45, 3)
                d /= np.linalg.norm(d)
                p = p + d * 0.55
                pts.append(p.copy())
        seg += 1
    P = np.array(pts[:520])
    P -= P.mean(0)
    P /= np.abs(P).max()
    # smooth
    k = np.ones(3) / 3
    for c in range(3):
        P[1:-1, c] = np.convolve(P[:, c], k, 'valid')
    return P.astype(np.float32), np.array(kinds[:520])


@scene
def protein(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    starfield(cv, ctx.b * 0.4, bright=0.3)
    P, kinds = _protein()
    P = P * 4.8
    Rm = C.ry(t * 0.9) @ C.rx(0.4 + 0.2 * math.sin(t))
    Q = P @ Rm.T
    cam = C.Cam((0, 0, -11), (0, 0, 0), 45, cx=W / 2 + 330, cy=H / 2 + 10)
    xy, z = cam.project(Q)
    grow = e_out3(ramp(tb, -0.35, 1.4))
    n = max(2, int(len(P) * grow))
    u = np.linspace(0, 1, len(P))
    colr = np.array([C.mixc(C.CYAN, C.VIOLET, clamp01(x * 2)) if x < 0.5 else C.mixc(C.VIOLET, C.AMBER, (x - 0.5) * 2)
                     for x in u])
    fade = C.depth_fade(z, 7, 15)
    # thick ribbon drawn back-to-front as segments
    order = np.argsort(-(z[:-1] + z[1:]) / 2)
    L = np.zeros_like(cv)
    for i in order:
        if i + 1 >= n:
            continue
        th = int(max(3, (16 if kinds[i] else 7) * 11 / z[i]))
        c = tuple(float(v * (0.35 + 0.75 * fade[i])) for v in colr[i])
        cv2.line(L, (int(xy[i, 0] * 16), int(xy[i, 1] * 16)), (int(xy[i + 1, 0] * 16), int(xy[i + 1, 1] * 16)), c, th,
                 cv2.LINE_AA, 4)
    cv += L
    C.splat(cv, xy[:n], np.array(C.WHITE, np.float32), (fade[:n] * 0.6).astype(np.float32))
    if n < len(P):
        glow_circle(cv, xy[n - 1, 0], xy[n - 1, 1], 8, C.WHITE, 1.4)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')
    k = e_out3(ramp(tb, 0.0, 2.8))
    val = int(200_000_000 * k ** 2)
    C.draw_text(cv, f'{val:,}+', 'anton', 110, 80, H / 2 + 60, C.WHITE, 1.0, 'lm')
    C.draw_text(cv, 'PROTEIN STRUCTURES PREDICTED', 'g7', 28, 84, H / 2 + 140, C.CYAN, ramp(tb, 0.6, 0.9), 'lm',
                tracking=0.2)
    C.draw_text(cv, 'ALPHAFOLD DATABASE · ILLUSTRATIVE FOLD', 'm4', 18, 84, H / 2 + 185, C.GREY,
                ramp(tb, 0.8, 1.1), 'lm', tracking=0.2)


@scene
def nobel(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    cv[:] = C.BG_WARM
    gold = (1.0, 0.78, 0.35)
    cx, cy = W / 2 - 420, H / 2 + 20
    k = e_out5(ramp(tb, -0.25, 0.6))
    for i, (rr, th, sp) in enumerate([(230, 3, 0.4), (262, 1, -0.25), (300, 2, 0.15), (200, 1, -0.6)]):
        a0 = (t * sp * 180 / math.pi * 3) % 360
        ring(cv, cx, cy, rr * k, gold, th, 0.8, a0, a0 + 300)
    for i in range(72):
        a = i / 72 * 2 * math.pi + t * 0.2
        r1, r2 = 312 * k, (322 if i % 6 else 336) * k
        C.lines(cv, [(cx + math.cos(a) * r1, cy + math.sin(a) * r1)], [(cx + math.cos(a) * r2, cy + math.sin(a) * r2)],
                gold, 1, 0.8)
    C.draw_text(cv, '2024', 'anton', 150, cx, cy - 10, gold, k, 'mm')
    C.draw_text(cv, 'NOBEL PRIZES', 'g7', 26, cx, cy + 80, C.WHITE, k, 'mm', tracking=0.4)
    # gold dust
    r = np.random.default_rng(3)
    P = r.normal(0, 1, (1500, 2)) * [300, 220]
    P[:, 1] -= (t * 60 + r.random(1500) * 200) % 400 - 200
    C.splat(cv, P + [cx, cy], np.array(gold, np.float32), r.uniform(0.2, 0.8, 1500).astype(np.float32))
    cards = [('PHYSICS', 'John Hopfield & Geoffrey Hinton', 'Foundations of machine learning with', 'artificial neural networks'),
             ('CHEMISTRY', 'Demis Hassabis & John Jumper · David Baker', 'Protein structure prediction &',
              'computational protein design')]
    for i, (f1, f2, f3, f4) in enumerate(cards):
        kk = e_out5(ramp(tb, 0.5 + i * 0.5, 1.0 + i * 0.5))
        x = W / 2 + 40 + (1 - kk) * 200
        y = 290 + i * 250
        C.rrect(cv, x, y, 760, 210, 16, (0.08, 0.06, 0.04), 0.9 * kk)
        C.rrect_outline(cv, x, y, 760, 210, 16, gold, 1, kk)
        C.draw_text(cv, f1, 'g7', 24, x + 34, y + 40, gold, kk, 'lm', tracking=0.35)
        C.draw_text(cv, f2, 'i6', 32, x + 34, y + 94, C.WHITE, kk, 'lm')
        C.draw_text(cv, f3, 'i4', 24, x + 34, y + 142, (0.8, 0.8, 0.85), kk, 'lm')
        C.draw_text(cv, f4, 'i4', 24, x + 34, y + 176, (0.8, 0.8, 0.85), kk, 'lm')
    ctx.post['bloom'] = 1.0


@functools.lru_cache(maxsize=1)
def _art(sz=520):
    yy, xx = np.mgrid[0:sz, 0:sz].astype(np.float32) / sz
    sky = np.stack([0.95 - 0.7 * yy, 0.35 + 0.1 * yy, 0.55 + 0.35 * yy], -1)
    sky = np.clip(sky * np.array([1.0, 0.8, 1.0]), 0, 1)
    img = sky.copy()
    sun = np.exp(-(((xx - 0.5) ** 2 + (yy - 0.52) ** 2) / 0.012))[..., None]
    img = img + sun * np.array([1.0, 0.75, 0.35]) * 0.9
    r = np.random.default_rng(4)
    cols = [(0.35, 0.1, 0.45), (0.2, 0.08, 0.35), (0.08, 0.05, 0.2), (0.03, 0.02, 0.08)]
    for li, c in enumerate(cols):
        base = 0.55 + li * 0.1
        ridge = base + 0.07 * np.sin(xx * (6 + li * 3) + li * 2) + 0.04 * np.sin(xx * (17 + li * 5) + li)
        m = (yy > ridge).astype(np.float32)[..., None]
        edge = np.exp(-((yy - ridge) / 0.004) ** 2)[..., None]
        img = img * (1 - m) + np.array(c) * m + edge * np.array([0.2, 0.9, 1.0]) * 0.8 * (li == 0)
    # neon grid on the ground
    g = (np.abs(((xx - 0.5) / np.maximum(yy - 0.82, 0.01) * 0.2) % 0.1 - 0.05) < 0.004) & (yy > 0.86)
    img[g] = img[g] * 0.3 + np.array([1.0, 0.3, 0.8]) * 0.8
    return np.clip(img, 0, 1).astype(np.float32)


@scene
def diffusion(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    art = _art()
    sz = art.shape[0]
    steps = 8
    si = min(steps, int(max(0, tb - 0.25) * 3.2))  # snaps on 8th-note-ish steps
    alpha_bar = (si / steps) ** 1.6
    r = np.random.default_rng(si + 1)
    noise = r.normal(0.5, 0.35, art.shape).astype(np.float32)
    img = np.clip(math.sqrt(alpha_bar) * art + math.sqrt(1 - alpha_bar) * noise, 0, 1)
    x0, y0 = int(W / 2 + 60), int(H / 2 - sz / 2 - 20)
    cv[y0:y0 + sz, x0:x0 + sz] = img * 0.95
    C.rect(cv, x0 - 2, y0 - 2, x0 + sz + 2, y0 + sz + 2, C.CYAN, 0.6, 'add', thick=1)
    C.draw_text(cv, f'STEP {steps - si:02d} / {steps:02d}', 'm7', 22, x0 + sz, y0 - 26, C.CYAN, 1.0, 'rm',
                tracking=0.2)
    # thumbnails of the chain
    for i in range(steps + 1):
        th = 70
        ab = (i / steps) ** 1.6
        rr = np.random.default_rng(i + 1)
        small = cv2.resize(art, (th, th), interpolation=cv2.INTER_AREA)
        nz = rr.normal(0.5, 0.35, small.shape).astype(np.float32)
        im = np.clip(math.sqrt(ab) * small + math.sqrt(1 - ab) * nz, 0, 1)
        tx = int(x0 - 40 - (steps + 1 - i) * 82 + 82 * 0)
        ty = int(y0 + sz - th)
        tx = int(80 + i * 82); ty = int(y0 + sz - th)
        a = 1.0 if i <= si else 0.18
        cv[ty:ty + th, tx:tx + th] = cv[ty:ty + th, tx:tx + th] * (1 - a) + im * a
        if i == si:
            C.rect(cv, tx - 3, ty - 3, tx + th + 3, ty + th + 3, C.AMBER, 1.0, 'add', thick=2)
    C.draw_text(cv, 'prompt:', 'm7', 22, 84, y0 + 150, C.GREY, 1.0, 'lm')
    C.draw_text(cv, typed('“a sunrise over neon mountains”', tb - 0.1, 50), 'i6', 34, 84, y0 + 196, C.WHITE, 1.0,
                'lm')
    C.draw_text(cv, 'NOISE  →  IMAGE', 'm7', 20, 84, y0 + sz - 100, C.CYAN, 1.0, 'lm', tracking=0.3)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


AGENT_STEPS = ['PLAN', 'SEARCH', 'WRITE CODE', 'RUN TESTS', 'FIX', 'DONE ✓']


@scene
def agents(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    cx, cy, R = W / 2 + 330, H / 2 + 50, 290
    n = len(AGENT_STEPS)
    pos = [(cx + R * math.cos(-math.pi / 2 + i / n * 2 * math.pi), cy + 0.72 * R * math.sin(-math.pi / 2 + i / n * 2 * math.pi))
           for i in range(n)]
    prog = clamp01((tb - 0.2) / 3.4) * n
    cur = min(n - 1, int(prog))
    pts = np.array(pos + [pos[0]])
    C.polyline(cv, pts, (0.25, 0.32, 0.45), 2, 1.0)
    u = prog - int(prog)
    if prog < n:
        a, b_ = np.array(pos[cur]), np.array(pos[(cur + 1) % n])
        p = a + (b_ - a) * e_io3(u)
        C.lines(cv, [a], [p], C.CYAN, 3, 1.0)
        glow_circle(cv, p[0], p[1], 9, C.WHITE, 1.3)
    for i, (x, y) in enumerate(pos):
        done = i < cur or (i == cur and u > 0.3) or cur == n - 1
        active = i == cur
        c = C.LIME if done and i != cur else (C.CYAN if active else (0.35, 0.4, 0.5))
        wtxt = C.text_size(AGENT_STEPS[i], 'm7', 24)[0] + 50
        C.rrect(cv, x - wtxt / 2, y - 32, wtxt, 64, 32, (0.04, 0.06, 0.09), 1.0)
        C.rrect_outline(cv, x - wtxt / 2, y - 32, wtxt, 64, 32, c, 2, 1.0)
        C.draw_text(cv, AGENT_STEPS[i], 'm7', 24, x, y, C.WHITE if (done or active) else (0.5, 0.55, 0.65), 1.0, 'mm')
    C.draw_text(cv, 'TOOLS', 'm7', 18, cx, cy - 20, C.GREY, 1.0, 'mm', tracking=0.4)
    C.draw_text(cv, 'browser · terminal · files · APIs', 'm4', 18, cx, cy + 14, (0.5, 0.56, 0.66), 1.0, 'mm')
    log = ['> goal: fix failing checkout test', '> plan: 4 steps', '> search: docs/payments.md', '> edit: cart.py (+12 −3)',
           '> run: pytest … 1 failed', '> fix: rounding bug', '> run: pytest … all passed', '> open PR #214 ✓']
    for i, ln in enumerate(log):
        k = ramp(tb, 0.25 + i * 0.42, 0.3 + i * 0.42)
        if k > 0:
            C.draw_text(cv, typed(ln, (tb - 0.25 - i * 0.42), 80), 'm4', 22, 84, 380 + i * 44,
                        C.LIME if '✓' in ln or 'passed' in ln else (0.75, 0.8, 0.88), 1.0, 'lm')
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@functools.lru_cache(maxsize=1)
def _globe():
    P = C.fib_sphere(9000, 1.0)
    # pseudo-continents from smooth trig noise
    n = (np.sin(P[:, 0] * 3.1 + 1) * np.sin(P[:, 1] * 2.3 + 2) + np.sin(P[:, 2] * 3.7 + P[:, 0] * 1.3)
         + 0.6 * np.sin(P[:, 1] * 7 + P[:, 2] * 5))
    land = n > 0.12
    r = np.random.default_rng(5)
    hubs = P[land][r.choice(land.sum(), 26, replace=False)]
    arcs = [(hubs[i], hubs[j]) for i, j in r.integers(0, 26, (80, 2))
            if i != j and 0.3 < math.acos(float(np.clip(np.dot(hubs[i], hubs[j]), -1, 1))) < 2.0][:40]
    return P.astype(np.float32), land, arcs


def slerp_arc(a, b_, n=48, lift=0.12):
    t = np.linspace(0, 1, n)[:, None]
    om = math.acos(float(np.clip(np.dot(a, b_), -1, 1)))
    if om < 1e-3:
        return np.repeat(a[None], n, 0)
    p = (np.sin((1 - t) * om) * a + np.sin(t * om) * b_) / math.sin(om)
    h = 1 + lift * om / math.pi * np.sin(np.pi * t)
    return p * h


@scene
def globe(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    starfield(cv, ctx.b * 0.3, bright=0.35)
    P, land, arcs = _globe()
    Rm = C.ry(-t * 0.5 + 2.2) @ C.rx(0.35)
    S = 3.4
    Q = (P * S) @ Rm.T
    cam = C.Cam((0, 0, -11), (0, 0, 0), 45, cx=W / 2 + 280)
    xy, z = cam.project(Q)
    front = Q[:, 2] < 0.2
    c = np.where(land[:, None], np.array(C.CYAN)[None], np.array((0.16, 0.3, 0.52))[None]).astype(np.float32)
    w = np.where(front, 1.0, 0.1) * np.where(land, 4.0, 1.3)
    C.splat(cv, xy, c, w.astype(np.float32), z=z)
    ring(cv, W / 2 + 280, H / 2, cam.f * S / math.sqrt(11 ** 2 - S ** 2), C.CYAN, 2, 0.35)
    for i, (a, b_) in enumerate(arcs):
        k = clamp01((tb - i * 0.08) / 0.8)
        if k <= 0:
            continue
        A = slerp_arc(a, b_) * S @ Rm.T
        axy, az = cam.project(A)
        n = max(2, int(len(A) * e_out3(k)))
        vis = A[:n, 2] < 0.3
        colr = C.AMBER if i % 3 == 0 else C.MAG if i % 3 == 1 else C.WHITE
        if vis.sum() >= 2:
            C.polyline(cv, axy[:n][vis], colr, 2, 0.8)
        u = (t * 0.9 + i * 0.17) % 1.0
        j = int(u * (len(A) - 1))
        if A[j, 2] < 0.3 and k >= 1:
            glow_circle(cv, axy[j, 0], axy[j, 1], 4, C.WHITE, 1.0)
    places = ['LABS', 'CLASSROOMS', 'HOSPITALS', 'STUDIOS', 'EVERYWHERE']
    for i, pl in enumerate(places):
        k = e_out5(ramp(tb, -0.1 + i * 0.35, 0.25 + i * 0.35))
        C.draw_text(cv, pl, 'anton', 70 if i < 4 else 92, 84 + (1 - k) * -40, 400 + i * 86 + (18 if i == 4 else 0),
                    C.WHITE if i < 4 else C.CYAN, k, 'lm')


# ================================================================ recap / switch / stutter
@scene
def recap(ctx):
    base = ctx.shot['base']; word = ctx.shot['word']; k = ctx.shot['k']
    if base == 'tunnel_word':
        SCENES['tunnel_word'](ctx, word=' ', hue=k)
    else:
        SCENES[base](ctx)
    cv = ctx.cv
    dimmer(cv, 0.35)
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 6)
    c = [C.CYAN, C.MAG, C.AMBER, C.LIME][k]
    C.draw_text(cv, word, 'anton', 320, W / 2, H / 2 - 30, (0, 0, 0), 0.5, 'mm', scale=lerp(1.3, 1, e), blur=12)
    C.draw_text(cv, word, 'anton', 320, W / 2, H / 2 - 30, C.WHITE, 1.0, 'mm', scale=lerp(1.3, 1, e))
    C.draw_text(cv, word, 'anton', 320, W / 2, H / 2 - 30, c, 0.7, 'mm', scale=lerp(1.3, 1, e) * 1.03, outline=3,
                mode='add')


def burst_bg(cv, t, hue):
    P, sp, rnd = _burst()
    Q = P * (6 + 10 * sp) @ C.ry(t * 2).T
    cam = C.Cam((0, 0, -26), (0, 0, 0), 55)
    xy, z = cam.project(Q)
    C.splat(cv, xy, np.array(hue, np.float32), (C.depth_fade(z, 10, 42) * 1.2).astype(np.float32), z=z)


@scene
def switch_word(ctx):
    cv = ctx.cv; k = ctx.shot['k']; word = ctx.shot['word']; b = ctx.b
    hue = [C.CYAN, C.MAG, C.AMBER, C.LIME, C.VIOLET][k % 5]
    m = k % 4
    if m == 0:
        SCENES['tunnel_word'](ctx, word=' ', hue=k % 3)
    elif m == 1:
        cam = C.Cam(C.orbit(9, b * 0.8, 0.2), (0, 0, 0), 50)
        draw_brain(cv, cam, b * 0.6, 3.4, 1.2, (hue, C.WHITE))
    elif m == 2:
        grid_floor(cv, b * 3, hue, C.WHITE)
    else:
        burst_bg(cv, b * 0.5, hue)
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 5)
    size = 300 if len(word) <= 6 else 220
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 30, (0, 0, 0), 0.55, 'mm', scale=lerp(1.4, 1, e), blur=10)
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 30, C.WHITE, 1.0, 'mm', scale=lerp(1.4, 1, e) + 0.03 * ctx.p)
    C.draw_text(cv, f'{k + 1:02d}', 'm7', 22, W / 2, H / 2 + 130, hue, 1.0, 'mm', tracking=0.4)
    ctx.post['invert'] = (k % 4 == 1)
    ctx.post['glitch'] = 16 * math.exp(-fl / 3)
    ctx.post['rot'] = [-2, 2, -1, 1][k % 4] * (1 - e)


@scene
def year_recap(ctx):
    cv = ctx.cv; k = ctx.shot['k']; year = ctx.shot['year']; b = ctx.b
    hue = [C.CYAN, C.MAG, C.AMBER, C.WHITE][k]
    if k == 0:
        starfield(cv, b * 3, bright=0.8, streak=0.6)
    elif k == 1:
        grid_floor(cv, b * 2, C.MAG, C.CYAN)
    elif k == 2:
        SCENES['tunnel_word'](ctx, word=' ', hue=2)
    else:
        cam = C.Cam(C.orbit(9, b * 0.5, 0.2), (0, 0, 0), 50)
        draw_brain(cv, cam, b * 0.5, 3.6, 1.3)
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 8)
    sc = lerp(1.5, 1.0, e) + 0.06 * ctx.p
    for i in range(3, 0, -1):
        C.draw_text(cv, year, 'anton', 420, W / 2, H / 2 - 20, hue, 0.2, 'mm', scale=sc * (1 + 0.05 * i), outline=2,
                    mode='add')
    C.draw_text(cv, year, 'anton', 420, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=sc)
    ctx.post['glitch'] = 26 * math.exp(-fl / 4)
    ctx.post['ca'] += 6
    ctx.post['invert'] = k == 3 and ctx.tb > 0.5


@scene
def stutter(ctx):
    cv = ctx.cv; k = ctx.shot['k']; b = ctx.b
    hue = [C.CYAN, C.MAG, C.AMBER, C.LIME][k % 4]
    cam = C.Cam(C.orbit(9 - k * 0.25, b * 1.2, 0.2), (0, 0, 0), 50)
    draw_brain(cv, cam, b * 0.8, 3.4 + k * 0.08, 1.2 + k * 0.05, (hue, C.WHITE))
    if k >= 6:
        s = 0.55 + (k - 6) * 0.07
        C.draw_text(cv, 'YOU', 'anton', 420, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=s)
    else:
        C.draw_text(cv, '?', 'anton', 420, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=0.6 + k * 0.05)
    # photosensitivity-safe stutter: no full-frame inversions, alternate zoom/tilt/tint instead
    ctx.post['glitch'] = 10 + k * 1.5
    ctx.post['punch'] += 0.035 * (k % 2)
    ctx.post['rot'] = 2.0 * (1 if k % 4 == 1 else -1 if k % 4 == 3 else 0)
    ctx.post['ca'] += 4 + 0.6 * k


# ================================================================ OUTRO
@scene
def terminal_outro(ctx):
    cv = ctx.cv; b = ctx.b
    starfield(cv, b * 0.5, bright=0.5)
    cam = C.Cam(C.orbit(12, b * 0.1, 0.1), (0, 0, 0), 45)
    draw_brain(cv, cam, b * TL.BEAT, 3.0, 0.35)
    dimmer(cv, 0.2)
    size = 76
    y1, y2 = H / 2 - 110, H / 2 + 20
    old = TL.INTRO_PROMPT
    pw = C.text_size('> ', 'm7', size)[0]
    x0 = W / 2 - C.text_size('> ' + TL.OUTRO_PROMPT, 'm7', size)[0] / 2
    strike_b = 177.2
    fade_old = 1 - 0.55 * ramp(b, strike_b + 0.2, strike_b + 0.8)
    C.draw_text(cv, '>', 'm7', size, x0, y1, C.CYAN, fade_old, 'lm')
    C.draw_text(cv, old, 'm7', size, x0 + pw, y1, C.WHITE, fade_old, 'lm')
    ow = C.text_size(old, 'm7', size)[0]
    k = e_io3(ramp(b, strike_b, strike_b + 0.25))
    if k > 0:
        C.rect(cv, x0 + pw - 10, y1 - 3, x0 + pw - 10 + (ow + 20) * k, y1 + 5, C.MAG, 1.5, 'add')
    txt = typed(TL.OUTRO_PROMPT, b - TL.OUTRO_TYPE_START, TL.OUTRO_TYPE_RATE)
    if b > TL.OUTRO_TYPE_START - 0.6:
        C.draw_text(cv, '>', 'm7', size, x0, y2, C.CYAN, 1.0, 'lm')
    if txt:
        C.draw_text(cv, txt, 'm7', size, x0 + pw, y2, C.WHITE, 1.0, 'lm')
    tw = C.text_size(txt, 'm7', size)[0] if txt else 0
    done_b = TL.OUTRO_TYPE_START + len(TL.OUTRO_PROMPT) / TL.OUTRO_TYPE_RATE
    if b > TL.OUTRO_TYPE_START - 0.6 and ((b % 1.0) < 0.55 or b < done_b):
        cx = x0 + pw + tw + 8
        C.rect(cv, cx, y2 - size * 0.42, cx + size * 0.55, y2 + size * 0.42, C.CYAN, 0.9)
    if b > done_b + 0.25:
        g = math.exp(-(b - done_b - 0.25) * 3)
        C.draw_text(cv, txt, 'm7', size, x0 + pw, y2, C.CYAN, 0.9 * g, 'lm', mode='add')


@scene
def end_card(ctx):
    cv = ctx.cv; tb = ctx.tb; b = ctx.b
    starfield(cv, b * 0.4, bright=0.5)
    cam = C.Cam(C.orbit(10.5 - 1.2 * e_io3(ctx.p), b * 0.08, 0.15), (0, 0, 0), 45)
    draw_brain(cv, cam, b * TL.BEAT, 3.3, 0.55, (C.CYAN, C.VIOLET))
    dimmer(cv, 0.35)
    C.kinetic(cv, 'WHAT WILL YOU BUILD?', 'anton', 176, W / 2, H / 2 - 90, ctx.t + 0.12, C.WHITE, 0.03, 0.35,
              style='rise', tracking=0.01)
    a = e_out3(ramp(tb, 1.0, 1.8))
    C.draw_text(cv, '你会用它创造什么？', 'sc9', 72, W / 2, H / 2 + 60, (0.62, 0.9, 1.0), a, 'mm', cjk='sc9',
                tracking=0.08)
    a2 = e_out3(ramp(tb, 2.5, 3.3))
    C.rect(cv, W / 2 - 180 * a2, H / 2 + 150, W / 2 + 180 * a2, H / 2 + 152, C.CYAN, 1.0, 'add')
    C.draw_text(cv, 'THE AGE OF INTELLIGENCE  ·  1950 → NOW', 'm7', 22, W / 2, H / 2 + 196, C.GREY, a2, 'mm',
                tracking=0.35)
    # gentle settle toward the end (never to black)
    end_dim = 0.3 * e_in3(ramp(b, TL.END_BEAT - 2.5, TL.END_BEAT))
    dimmer(cv, end_dim)
    ctx.post['hud'] = 1 - ramp(b, TL.END_BEAT - 3, TL.END_BEAT - 1)
```

### 27/30 · `The_Age_of_Intelligence-source/src/sheet.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/sheet.py", "lines": 13, "final_newline": true, "sha256": "dfb0c6894466acb618775e3f5ee7cca1bd9f9d849e9559f0dbd6e75c67225992", "original_sha256": "dfb0c6894466acb618775e3f5ee7cca1bd9f9d849e9559f0dbd6e75c67225992"} -->
```python
import sys, cv2, numpy as np, glob
files = sys.argv[2:]
out = sys.argv[1]
ims = [cv2.imread(f) for f in files]
ims = [cv2.resize(i, (800, 450), interpolation=cv2.INTER_AREA) for i in ims]
for i, f in zip(ims, files):
    cv2.putText(i, f.split('/')[-1], (8, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 1)
cols = 2
rows = (len(ims) + cols - 1) // cols
while len(ims) < rows * cols:
    ims.append(np.zeros_like(ims[0]))
grid = np.vstack([np.hstack(ims[r * cols:(r + 1) * cols]) for r in range(rows)])
cv2.imwrite(out, grid)
```

### 28/30 · `The_Age_of_Intelligence-source/src/smoke.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/smoke.py", "lines": 8, "final_newline": true, "sha256": "25cabe1ad2054d0c6599fb8bc4b604c5cf15d6f7554ada7eab9781c35f38cae8", "original_sha256": "25cabe1ad2054d0c6599fb8bc4b604c5cf15d6f7554ada7eab9781c35f38cae8"} -->
```python
"""Smoke test: render first/mid/last frame of every shot; fails loudly on any scene error."""
import render as R, timeline as TL, time
t0 = time.time(); n = 0
for s in TL.SHOTS:
    f0 = int(round(s['b0'] * TL.FPB)); f1 = int(round(s['b1'] * TL.FPB)) - 1
    for f in sorted(set([f0, (f0 + f1) // 2, f1])):
        R.render_frame(f); n += 1
print('ok', n, 'frames', (time.time() - t0) / n, 's/frame')
```

### 29/30 · `The_Age_of_Intelligence-source/src/timeline.py`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/src/timeline.py", "lines": 259, "final_newline": true, "sha256": "46120cd569426a48a3aa186a4c99a291d690e8d91ea906d8a056adcb4d2585e5", "original_sha256": "46120cd569426a48a3aa186a4c99a291d690e8d91ea906d8a056adcb4d2585e5"} -->
```python
"""Master timeline: one beat grid drives picture, music and sound design.

BPM = 128.571428..  ->  1 beat = 28 frames @60fps = 22400 samples @48k.
All cuts are expressed in beats, so every cut lands on an exact frame.
"""
import os

# ---- paths (packaging edit: originally hard-coded /home/claude/av/...)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, 'fonts')
BUILD = os.environ.get('AOI_BUILD', os.path.join(ROOT, 'build'))
os.makedirs(BUILD, exist_ok=True)

FPS = 60
SR = 48000
FPB = 28                      # frames per beat
SPB = 22400                   # samples per beat
BPM = 60.0 * FPS / FPB        # 128.5714
BEAT = FPB / FPS              # 0.46667 s
END_BEAT = 198                # 48 bars of music + held end card
N_FRAMES = END_BEAT * FPB     # 5544 frames = 92.4 s
W, H = 1920, 1080

# ---------------------------------------------------------------- sections
SECTIONS = [  # (start_beat, end_beat, name)
    (0, 16, 'intro'), (16, 48, 'verse'), (48, 64, 'build1'), (64, 96, 'drop1'),
    (96, 112, 'break'), (112, 128, 'build2'), (128, 176, 'drop2'), (176, 198, 'outro'),
]
CHAPTERS = [
    (0, '00', 'PROLOGUE'), (16, '01', 'ORIGINS'), (48, '01', 'ORIGINS'),
    (64, '02', 'HOW IT THINKS'), (96, '03', 'SCALE'), (112, '03', 'SCALE'),
    (128, '04', 'WHAT IT CAN DO'), (176, '05', 'YOU'),
]


def section_at(b):
    for s, e, n in SECTIONS:
        if s <= b < e:
            return n
    return 'outro'


# ---------------------------------------------------------------- typing
INTRO_PROMPT = 'Can machines think?'
INTRO_TYPE_START = 1.0       # beat
INTRO_TYPE_RATE = 5.0        # chars per beat
OUTRO_PROMPT = 'What will you build?'
OUTRO_TYPE_START = 178.5
OUTRO_TYPE_RATE = 6.0

# ---------------------------------------------------------------- shots
S = []


def shot(b0, b1, scene, **kw):
    S.append(dict(b0=b0, b1=b1, scene=scene, **kw))


# PROLOGUE
shot(0, 8, 'terminal_intro')
shot(8, 16, 'year_1950')

# ORIGINS — one milestone per bar; the year slams in and flies to the corner
shot(16, 20, 'ai_points', year='1956')
shot(20, 24, 'perceptron', year='1958')
shot(24, 28, 'backprop', year='1986')
shot(28, 32, 'chess', year='1997')
shot(32, 36, 'imagenet', year='2012')
shot(36, 40, 'go', year='2016')
shot(40, 44, 'transformer', year='2017')
shot(44, 48, 'params', year='2020')

# BUILD 1 — cuts accelerate 4 -> 2 -> 1 -> 1/2 beat
shot(48, 52, 'chat', year='2022')
shot(52, 54, 'tunnel_word', word='IT READS', hue=0)
shot(54, 56, 'tunnel_word', word='IT WRITES', hue=1)
shot(56, 57, 'tunnel_word', word='IT SEES', hue=2)
shot(57, 58, 'tunnel_word', word='IT CODES', hue=0)
shot(58, 59, 'tunnel_word', word='IT TALKS', hue=1)
shot(59, 60, 'tunnel_word', word='IT REASONS', hue=2)
for i, wd in enumerate(['BUT', 'HOW', 'DOES', 'IT', 'REALLY', 'THINK']):
    shot(60 + i * 0.5, 60.5 + i * 0.5, 'tunnel_word', word=wd, hue=i % 3, fast=True)
shot(63, 64, 'question_hold', text='HOW DOES IT THINK?')

# DROP 1 — HOW IT THINKS
shot(64, 66, 'impact_title', text='HOW IT THINKS', sub='HOW A LANGUAGE MODEL WORKS')
shot(66, 68, 'tokens_split')
shot(68, 70, 'token_ids')
shot(70, 72, 'token_fact')
shot(72, 76, 'embed_orbit')
shot(76, 78, 'embed_zoom')
shot(78, 80, 'embed_math')
shot(80, 84, 'attention_arcs')
shot(84, 86, 'attention_matrix')
shot(86, 88, 'multihead')
shot(88, 90, 'predict_bars')
shot(90, 92, 'deepnet3d')
for k in range(4):
    shot(92 + k, 93 + k, 'autoregress', k=k)

# BREAK — SCALE
shot(96, 104, 'brain_sphere')
shot(104, 112, 'compute_chart')

# BUILD 2
shot(112, 116, 'question_changed', v=0)
shot(116, 120, 'question_changed', v=1)
shot(120, 121, 'grid_word', word='NOT', v=0)
shot(121, 122, 'grid_word', word='“CAN IT', v=1)
shot(122, 123, 'grid_word', word='THINK?”', v=2)
shot(123, 124, 'grid_word', word='BUT', v=0)
for i, wd in enumerate(['WHAT', 'CAN', 'IT', 'DO']):
    shot(124 + i * 0.5, 124.5 + i * 0.5, 'grid_word', word=wd, v=(i + 1) % 3, fast=True)
for i in range(4):
    shot(126 + i * 0.25, 126.25 + i * 0.25, 'icon_flash', k=i)
shot(127, 128, 'question_hold', text='WHAT CAN IT DO?')

# DROP 2 — WHAT IT CAN DO
shot(128, 130, 'code_editor', label='IT WRITES CODE')
shot(130, 132, 'tests_pass', label='IT TESTS IT')
shot(132, 134, 'vision_city', label='IT SEES')
shot(134, 136, 'speech_wave', label='IT LISTENS & SPEAKS')
shot(136, 140, 'protein', label='IT FOLDS PROTEINS')
shot(140, 144, 'nobel', label='NOBEL 2024')
shot(144, 148, 'diffusion', label='IT IMAGINES')
shot(148, 152, 'agents', label='IT ACTS')
shot(152, 156, 'globe', label='EVERYWHERE')
RECAP = [('brain_sphere', 'LEARN'), ('embed_orbit', 'BUILD'),
         ('tunnel_word', 'CREATE'), ('attention_arcs', 'DISCOVER')]
for i, (sc, wd) in enumerate(RECAP):
    shot(156 + i, 157 + i, 'recap', base=sc, word=wd, k=i)
SWITCH_WORDS = ['HEAL', 'TEACH', 'TRANSLATE', 'EXPLORE', 'DESIGN', 'COMPOSE', 'SIMULATE',
                'PREDICT', 'CODE', 'CURE', 'INVENT', 'ASK', 'BUILD', 'SHIP', 'LEARN', 'DREAM']
for i, wd in enumerate(SWITCH_WORDS):
    shot(160 + i * 0.5, 160.5 + i * 0.5, 'switch_word', word=wd, k=i)
for i, y in enumerate(['1950', '1986', '2017', 'NOW']):
    shot(168 + i, 169 + i, 'year_recap', year=y, k=i)
for i in range(16):
    shot(172 + i * 0.25, 172.25 + i * 0.25, 'stutter', k=i)

# OUTRO
shot(176, 184, 'terminal_outro')
shot(184, END_BEAT, 'end_card')

SHOTS = S

# ---------------------------------------------------------------- subtitles
SUBS = [
    (0.5, 16, '1950 — Alan Turing asks: “Can machines think?”', '1950年，艾伦·图灵提问：“机器能思考吗？”'),
    (16, 20, '1956 — Dartmouth: AI becomes a field.', '1956年，达特茅斯会议：AI成为一门学科。'),
    (20, 24, '1958 — The Perceptron learns from examples.', '1958年，感知机学会从样本中学习。'),
    (24, 28, '1986 — Backprop: networks learn from mistakes.', '1986年，反向传播：网络从错误中学习。'),
    (28, 32, '1997 — Deep Blue beats Kasparov at chess.', '1997年，“深蓝”击败国际象棋冠军卡斯帕罗夫。'),
    (32, 36, '2012 — AlexNet: ImageNet error 26% → 15%.', '2012年，AlexNet：ImageNet错误率26%→15%。'),
    (36, 40, '2016 — AlphaGo beats Lee Sedol 4–1.', '2016年，AlphaGo以4:1战胜李世石。'),
    (40, 44, '2017 — The Transformer is born.', '2017年，Transformer诞生。'),
    (44, 48, '2020 — GPT-3: 175 billion parameters.', '2020年，GPT-3：1750亿参数。'),
    (48, 52, '2022 — ChatGPT: ~100M users in 2 months (est.)', '2022年，ChatGPT两个月用户约1亿（估算）。'),
    (52, 60, 'It reads. It writes. It sees. It codes.', '它会读、会写、会看、会编程。'),
    (60, 64, 'But how does it actually think?', '但它究竟是怎么“思考”的？'),
    (66, 72, '① Text is chopped into tokens — numbers the model can read.', '① 文本被切成token——模型能读懂的数字。'),
    (72, 80, '② Each token becomes a vector. Meaning becomes geometry.', '② 每个token都变成一个向量，意义变成了几何。'),
    (80, 88, '③ Attention: every word looks at every other word for context.', '③ 注意力：每个词都会关注其他所有词，寻找上下文。'),
    (88, 96, '④ Predict the next token. Then the next. Again and again.', '④ 预测下一个token，再下一个，周而复始。'),
    (96, 104, 'More data. More compute. New abilities emerge.', '更多数据，更多算力，新的能力不断涌现。'),
    (104, 112, 'Frontier training compute has grown about 4–5× per year.', '前沿模型的训练算力，大约每年增长4到5倍。'),
    (112, 120, 'So the question has changed.', '于是，问题变了。'),
    (120, 128, 'Not “Can it think?” — but “What can it do?”', '不再是“它能思考吗？”，而是“它能做什么？”'),
    (128, 136, 'It writes and tests code. It sees. It listens and speaks.', '它能写代码、跑测试，能看，能听，也能说。'),
    (136, 140, 'AlphaFold: 200M+ protein structures predicted.', 'AlphaFold：已预测超过2亿种蛋白质结构。'),
    (140, 144, '2024 — Two Nobel Prizes honor AI breakthroughs.', '2024年，两项诺贝尔奖授予AI相关突破。'),
    (144, 148, 'Diffusion models turn pure noise into images.', '扩散模型能把纯噪声变成图像。'),
    (148, 152, 'Agents plan, use tools, and finish multi-step tasks.', '智能体会规划、调用工具，完成多步骤任务。'),
    (152, 160, 'In labs, classrooms, hospitals and studios — everywhere.', '在实验室、课堂、医院和工作室——无处不在。'),
    (160, 176, 'AI amplifies whoever uses it.', 'AI会放大每一个使用它的人。'),
    (176, 184, 'The question is no longer “Can machines think?”', '问题不再是“机器能思考吗？”'),
]

# ---------------------------------------------------------------- sound design cues
# (beat, kind, params)
SFX = []


def sfx(b, kind, **kw):
    SFX.append((b, kind, kw))


def _typing(start, rate, text, seed):
    for i, ch in enumerate(text):
        sfx(start + i / rate, 'key', space=(ch == ' '), seed=seed + i)
    sfx(start + len(text) / rate + 0.25, 'enter')


_typing(INTRO_TYPE_START, INTRO_TYPE_RATE, INTRO_PROMPT, 100)
sfx(8, 'hit_soft')
sfx(12, 'swell_rev', length=4)
for b in range(16, 48, 4):
    sfx(b, 'data_hit')
    sfx(b + 0.3, 'whoosh', length=0.6, pan=0.6)
sfx(48, 'data_hit')
for b in [52, 54, 56, 57, 58, 59]:
    sfx(b, 'swish', length=0.35)
for i in range(6):
    sfx(60 + 0.5 * i, 'glitch', length=0.12, seed=i)
sfx(63.0, 'sub_drop_in')
for i, d in enumerate([0, 0.5, 1.0, 1.5]):
    sfx(66 + d, 'blip', f=900 + 200 * i)
for i in range(8):
    sfx(68 + i * 0.25, 'tick', f=2400 + 150 * i)
sfx(72, 'whoosh', length=1.2, pan=-0.7)
sfx(78, 'blip', f=1400)
sfx(78.5, 'blip', f=1700)
sfx(79, 'blip', f=2000)
sfx(80, 'whoosh', length=0.8, pan=0.5)
for i in range(4):
    sfx(92 + i, 'data_hit')
sfx(98, 'swell', length=6)
sfx(104, 'whoosh', length=1.5, pan=0.0)
for b in [120, 121, 122, 123]:
    sfx(b, 'swish', length=0.3)
for i in range(4):
    sfx(124 + 0.5 * i, 'glitch', length=0.1, seed=10 + i)
for i in range(4):
    sfx(126 + 0.25 * i, 'glitch', length=0.08, seed=20 + i)
sfx(127.0, 'sub_drop_in')
for b in [130, 132, 134, 136, 140, 144, 148, 152]:
    sfx(b, 'whoosh', length=0.5, pan=(-0.6 if b % 4 else 0.6))
for i in range(12):
    sfx(128.1 + i * 0.13, 'key', space=False, seed=300 + i)
sfx(131.0, 'success')
sfx(140, 'shimmer')
for i in range(4):
    sfx(156 + i, 'data_hit')
for i in range(16):
    sfx(160 + 0.5 * i, 'swish', length=0.18)
for i in range(4):
    sfx(168 + i, 'glitch', length=0.2, seed=40 + i)
for i in range(16):
    sfx(172 + 0.25 * i, 'glitch', length=0.06, seed=60 + i)
sfx(176, 'hit_soft')
sfx(177.2, 'zap')
_typing(OUTRO_TYPE_START, OUTRO_TYPE_RATE, OUTRO_PROMPT, 500)
sfx(184, 'shimmer')


def validate():
    t = 0
    for s in SHOTS:
        assert abs(s['b0'] - t) < 1e-9, ('gap/overlap at', t, s)
        assert s['b1'] > s['b0']
        f0, f1 = s['b0'] * FPB, s['b1'] * FPB
        assert abs(f0 - round(f0)) < 1e-9 and abs(f1 - round(f1)) < 1e-9, s
        t = s['b1']
    assert abs(t - END_BEAT) < 1e-9
    return len(SHOTS)


if __name__ == '__main__':
    print('shots', validate(), 'frames', N_FRAMES, 'dur', N_FRAMES / FPS, 'bpm', BPM)
```

### 30/30 · `The_Age_of_Intelligence-source/subtitles/AGE_OF_INTELLIGENCE_subtitles.srt`
<!-- casebook-file {"path": "The_Age_of_Intelligence-source/subtitles/AGE_OF_INTELLIGENCE_subtitles.srt", "lines": 139, "final_newline": true, "sha256": "ef84f04895cb8a530b80f91e6589e1e7268142ca9a17bdad304ccf37fe6d1858", "original_sha256": "ef84f04895cb8a530b80f91e6589e1e7268142ca9a17bdad304ccf37fe6d1858"} -->
```srt
1
00:00:00,233 --> 00:00:07,467
1950 — Alan Turing asks: “Can machines think?”
1950年，艾伦·图灵提问：“机器能思考吗？”

2
00:00:07,467 --> 00:00:09,333
1956 — Dartmouth: AI becomes a field.
1956年，达特茅斯会议：AI成为一门学科。

3
00:00:09,333 --> 00:00:11,200
1958 — The Perceptron learns from examples.
1958年，感知机学会从样本中学习。

4
00:00:11,200 --> 00:00:13,067
1986 — Backprop: networks learn from mistakes.
1986年，反向传播：网络从错误中学习。

5
00:00:13,067 --> 00:00:14,933
1997 — Deep Blue beats Kasparov at chess.
1997年，“深蓝”击败国际象棋冠军卡斯帕罗夫。

6
00:00:14,933 --> 00:00:16,800
2012 — AlexNet: ImageNet error 26% → 15%.
2012年，AlexNet：ImageNet错误率26%→15%。

7
00:00:16,800 --> 00:00:18,667
2016 — AlphaGo beats Lee Sedol 4–1.
2016年，AlphaGo以4:1战胜李世石。

8
00:00:18,667 --> 00:00:20,533
2017 — The Transformer is born.
2017年，Transformer诞生。

9
00:00:20,533 --> 00:00:22,400
2020 — GPT-3: 175 billion parameters.
2020年，GPT-3：1750亿参数。

10
00:00:22,400 --> 00:00:24,267
2022 — ChatGPT: ~100M users in 2 months (est.)
2022年，ChatGPT两个月用户约1亿（估算）。

11
00:00:24,267 --> 00:00:28,000
It reads. It writes. It sees. It codes.
它会读、会写、会看、会编程。

12
00:00:28,000 --> 00:00:29,867
But how does it actually think?
但它究竟是怎么“思考”的？

13
00:00:30,800 --> 00:00:33,600
① Text is chopped into tokens — numbers the model can read.
① 文本被切成token——模型能读懂的数字。

14
00:00:33,600 --> 00:00:37,333
② Each token becomes a vector. Meaning becomes geometry.
② 每个token都变成一个向量，意义变成了几何。

15
00:00:37,333 --> 00:00:41,067
③ Attention: every word looks at every other word for context.
③ 注意力：每个词都会关注其他所有词，寻找上下文。

16
00:00:41,067 --> 00:00:44,800
④ Predict the next token. Then the next. Again and again.
④ 预测下一个token，再下一个，周而复始。

17
00:00:44,800 --> 00:00:48,533
More data. More compute. New abilities emerge.
更多数据，更多算力，新的能力不断涌现。

18
00:00:48,533 --> 00:00:52,267
Frontier training compute has grown about 4–5× per year.
前沿模型的训练算力，大约每年增长4到5倍。

19
00:00:52,267 --> 00:00:56,000
So the question has changed.
于是，问题变了。

20
00:00:56,000 --> 00:00:59,733
Not “Can it think?” — but “What can it do?”
不再是“它能思考吗？”，而是“它能做什么？”

21
00:00:59,733 --> 00:01:03,467
It writes and tests code. It sees. It listens and speaks.
它能写代码、跑测试，能看，能听，也能说。

22
00:01:03,467 --> 00:01:05,333
AlphaFold: 200M+ protein structures predicted.
AlphaFold：已预测超过2亿种蛋白质结构。

23
00:01:05,333 --> 00:01:07,200
2024 — Two Nobel Prizes honor AI breakthroughs.
2024年，两项诺贝尔奖授予AI相关突破。

24
00:01:07,200 --> 00:01:09,067
Diffusion models turn pure noise into images.
扩散模型能把纯噪声变成图像。

25
00:01:09,067 --> 00:01:10,933
Agents plan, use tools, and finish multi-step tasks.
智能体会规划、调用工具，完成多步骤任务。

26
00:01:10,933 --> 00:01:14,667
In labs, classrooms, hospitals and studios — everywhere.
在实验室、课堂、医院和工作室——无处不在。

27
00:01:14,667 --> 00:01:22,133
AI amplifies whoever uses it.
AI会放大每一个使用它的人。

28
00:01:22,133 --> 00:01:25,867
The question is no longer “Can machines think?”
问题不再是“机器能思考吗？”
```

