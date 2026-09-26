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
