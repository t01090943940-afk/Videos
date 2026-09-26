# gpt-autumn · 源码文件索引（自动生成）

> 把日子，慢慢过圆（中秋 60s）。原目录 `gpt-mid-autumn-general-video/`。
> 源码已原样解压在 **`assets/cases/gpt-autumn/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show gpt-autumn <路径>`；拷出来改：`python3 scripts/casebook.py copy gpt-autumn <目标目录>`。

来源档案：

- `gpt-mid-autumn-general-video/MidAutumn_Final_60s_Source.zip` · zip · 11.6 MB · sha256 `d89cc34eef5c00e6…`

收录：文本 17 个（79.5 KB）· 二进制 1 个（7.3 KB，字体/小图）· 未收录 3 个（11.6 MB）

目录：文本文件 · 随附二进制（原样） · 未收录（视频 / 音频 / 大字体 / QA 图）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `MidAutumn_60s_Final/README.md` | 51 | 2.3 KB | 把日子，慢慢过圆 · 60 秒最终剪辑 |
| `MidAutumn_60s_Final/SOURCES_AND_ASSETS.md` | 28 | 3.4 KB | Research and asset notes |
| `MidAutumn_60s_Final/assets/audio_cues.json` | 207 | 2.0 KB |  |
| `MidAutumn_60s_Final/build.py` | 35 | 1.5 KB | Build the delivered film using the included mastered soundtrack. |
| `MidAutumn_60s_Final/chapters.ffmeta` | 109 | 1.6 KB |  |
| `MidAutumn_60s_Final/manifest.json` | 14 | 0.2 KB |  |
| `MidAutumn_60s_Final/qa/audio_first_pass.json` | 12 | 0.3 KB |  |
| `MidAutumn_60s_Final/qa/audio_second_pass.txt` | 31 | 1.4 KB |  |
| `MidAutumn_60s_Final/qa/delivery_report.json` | 29 | 0.9 KB |  |
| `MidAutumn_60s_Final/requirements.txt` | 5 | 0.0 KB |  |
| `MidAutumn_60s_Final/screenplay_zh.txt` | 83 | 1.6 KB |  |
| `MidAutumn_60s_Final/src/artwork.py` | 356 | 17.0 KB | Deterministic, layered Cairo code-film. No video footage or generative images. |
| `MidAutumn_60s_Final/src/film60.py` | 756 | 29.8 KB | 60-second, deterministic 2D/2.5D code film; all artwork is procedural. |
| `MidAutumn_60s_Final/src/master_audio.py` | 19 | 1.1 KB |  |
| `MidAutumn_60s_Final/src/music60.py` | 194 | 9.8 KB | Original time-coded chamber score and synthetic Foley, rendered offline. |
| `MidAutumn_60s_Final/subtitles_zh.srt` | 101 | 1.6 KB |  |
| `MidAutumn_60s_Final/timeline.json` | 211 | 4.9 KB |  |

## 随附二进制（原样）

| 路径 | 类型 | 大小 |
|---|---|---:|
| `MidAutumn_60s_Final/assets/score60.mid` | midi | 7.3 KB |

## 未收录（视频 / 音频 / 大字体 / QA 图）

| 路径 | 类型 | 大小 | sha256 | 如何补回 |
|---|---|---:|---|---|
| `MidAutumn_60s_Final/assets/score60_master.flac` | audio | 10.4 MB | `3d405dc45ce9` | 母带：src/music60.py + src/master_audio.py 生成（build.py --rebuild-audio） |
| `MidAutumn_60s_Final/qa/encoded_checks.jpg` | image | 382.9 KB | `9b6aa7f944df` | 故事板 / QA 联系表 |
| `MidAutumn_60s_Final/storyboard_60s.jpg` | image | 913.4 KB | `a24e497a679b` | 故事板 / QA 联系表 |
