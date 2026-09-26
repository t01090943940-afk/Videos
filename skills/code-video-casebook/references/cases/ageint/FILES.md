# ageint · 源码文件索引（自动生成）

> 智能时代 The Age of Intelligence（108 镜）。原目录 `opus-age-of-intelligence/`。
> 源码已原样解压在 **`assets/cases/ageint/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show ageint <路径>`；拷出来改：`python3 scripts/casebook.py copy ageint <目标目录>`。

来源档案：

- `opus-age-of-intelligence/智能时代-The_Age_of_Intelligence-source.zip` · zip · 9.3 MB · sha256 `018749c83fa60a20…`

收录：文本 30 个（275.5 KB）· 二进制 16 个（1.4 MB，字体/小图）· 未收录 3 个（13.0 MB）

目录：文本文件 · 随附二进制（原样） · 未收录（视频 / 音频 / 大字体 / QA 图）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `The_Age_of_Intelligence-source/README.md` | 221 | 11.8 KB | The Age of Intelligence｜智能时代 · 完整源码 |
| `The_Age_of_Intelligence-source/docs/智能时代代码视频复盘.md` | 549 | 46.3 KB | 《The Age of Intelligence｜智能时代》代码视频复盘 |
| `The_Age_of_Intelligence-source/fonts/licenses/DejaVu-LICENSE.txt` | 78 | 3.8 KB |  |
| `The_Age_of_Intelligence-source/fonts/licenses/anton-OFL.txt` | 93 | 4.3 KB |  |
| `The_Age_of_Intelligence-source/fonts/licenses/bebas-neue-OFL.txt` | 93 | 4.3 KB |  |
| `The_Age_of_Intelligence-source/fonts/licenses/inter-OFL.txt` | 93 | 4.4 KB |  |
| `The_Age_of_Intelligence-source/fonts/licenses/jetbrains-mono-OFL.txt` | 93 | 4.4 KB |  |
| `The_Age_of_Intelligence-source/fonts/licenses/noto-sans-sc-OFL.txt` | 93 | 4.2 KB |  |
| `The_Age_of_Intelligence-source/fonts/licenses/space-grotesk-OFL.txt` | 93 | 4.3 KB |  |
| `The_Age_of_Intelligence-source/fonts/licenses/unbounded-OFL.txt` | 93 | 4.3 KB |  |
| `The_Age_of_Intelligence-source/package.json` | 22 | 0.8 KB | npm scripts: fonts, render, encode, qa, all |
| `The_Age_of_Intelligence-source/requirements.txt` | 8 | 0.3 KB |  |
| `The_Age_of_Intelligence-source/scripts/build_fonts.py` | 70 | 3.4 KB | [补全] Rebuild fonts .ttf from the @fontsource npm packages (the session did this with inline commands). |
| `The_Age_of_Intelligence-source/scripts/encode.sh` | 19 | 1.1 KB | [补全] Concat segments + mux audio -> 1080p60 master, then a <30 MB 720p60 share cut, then the SRT. |
| `The_Age_of_Intelligence-source/scripts/qa.sh` | 13 | 0.8 KB | [补全] Delivery QA: frame count/duration, black/freeze/silence scan, loudness, per-cut contact sheets. |
| `The_Age_of_Intelligence-source/scripts/render_all.sh` | 30 | 1.2 KB | [补全] Full pipeline up to the intermediate video segments (session ran these steps by hand). |
| `The_Age_of_Intelligence-source/scripts/stills.sh` | 8 | 0.4 KB | [补全] Preview single frames without rendering the film. Beats are prefixed with b. |
| `The_Age_of_Intelligence-source/src/core.py` | 596 | 22.1 KB | Rendering core: text sprites, compositing, 3D projection, splatting, bloom, easing. |
| `The_Age_of_Intelligence-source/src/cut_sheets.py` | 26 | 1.2 KB | [补全] QA contact sheets: grab frame (cut + 2) of every shot from a rendered video, 16 per sheet. |
| `The_Age_of_Intelligence-source/src/make_srt.py` | 15 | 0.6 KB | [补全] Write the bilingual SRT from timeline.SUBS (was an inline snippet in the session). |
| `The_Age_of_Intelligence-source/src/music.py` | 755 | 26.8 KB | Original score + sound design, synthesized from scratch on the timeline's beat grid. |
| `The_Age_of_Intelligence-source/src/qa_frames.py` | 14 | 0.6 KB | Render the first 3 frames + midpoint of every shot and flag frames that read as blank. |
| `The_Age_of_Intelligence-source/src/render.py` | 202 | 7.9 KB | Frame renderer: scene dispatch, beat-reactive post, HUD, subtitles, ffmpeg piping. |
| `The_Age_of_Intelligence-source/src/scenes.py` | 843 | 36.1 KB | Scenes part 1: shared helpers, prologue, origins timeline, build 1. |
| `The_Age_of_Intelligence-source/src/scenes2.py` | 750 | 31.7 KB | Scenes part 2: DROP 1 (how an LLM works) and the SCALE break. |
| `The_Age_of_Intelligence-source/src/scenes3.py` | 741 | 32.9 KB | Scenes part 3: BUILD 2, DROP 2 (capabilities), switch-up, OUTRO. |
| `The_Age_of_Intelligence-source/src/sheet.py` | 13 | 0.5 KB |  |
| `The_Age_of_Intelligence-source/src/smoke.py` | 8 | 0.4 KB | Smoke test: render first/mid/last frame of every shot; fails loudly on any scene error. |
| `The_Age_of_Intelligence-source/src/timeline.py` | 259 | 11.1 KB | Master timeline: one beat grid drives picture, music and sound design. |
| `The_Age_of_Intelligence-source/subtitles/AGE_OF_INTELLIGENCE_subtitles.srt` | 139 | 3.7 KB |  |

## 随附二进制（原样）

| 路径 | 类型 | 大小 |
|---|---|---:|
| `The_Age_of_Intelligence-source/fonts/DejaVuSans.ttf` | font | 741.9 KB |
| `The_Age_of_Intelligence-source/fonts/anton.ttf` | font | 24.9 KB |
| `The_Age_of_Intelligence-source/fonts/bebas.ttf` | font | 21.1 KB |
| `The_Age_of_Intelligence-source/fonts/grotesk400.ttf` | font | 31.6 KB |
| `The_Age_of_Intelligence-source/fonts/grotesk500.ttf` | font | 31.6 KB |
| `The_Age_of_Intelligence-source/fonts/grotesk700.ttf` | font | 31.5 KB |
| `The_Age_of_Intelligence-source/fonts/inter300.ttf` | font | 66.6 KB |
| `The_Age_of_Intelligence-source/fonts/inter400.ttf` | font | 66.4 KB |
| `The_Age_of_Intelligence-source/fonts/inter600.ttf` | font | 66.5 KB |
| `The_Age_of_Intelligence-source/fonts/inter800.ttf` | font | 66.4 KB |
| `The_Age_of_Intelligence-source/fonts/inter900.ttf` | font | 66.3 KB |
| `The_Age_of_Intelligence-source/fonts/mono400.ttf` | font | 56.1 KB |
| `The_Age_of_Intelligence-source/fonts/mono700.ttf` | font | 56.0 KB |
| `The_Age_of_Intelligence-source/fonts/mono800.ttf` | font | 56.0 KB |
| `The_Age_of_Intelligence-source/fonts/unbounded800.ttf` | font | 49.8 KB |
| `The_Age_of_Intelligence-source/fonts/unbounded900.ttf` | font | 49.4 KB |

## 未收录（视频 / 音频 / 大字体 / QA 图）

| 路径 | 类型 | 大小 | sha256 | 如何补回 |
|---|---|---:|---|---|
| `The_Age_of_Intelligence-source/fonts/notosc500.ttf` | font | 4.3 MB | `815c6a9b2ed9` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径（scripts/build_fonts.py 记录了来源与子集化） |
| `The_Age_of_Intelligence-source/fonts/notosc700.ttf` | font | 4.3 MB | `19d8f1dd30c1` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径（scripts/build_fonts.py 记录了来源与子集化） |
| `The_Age_of_Intelligence-source/fonts/notosc900.ttf` | font | 4.3 MB | `fa584e269592` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径（scripts/build_fonts.py 记录了来源与子集化） |
