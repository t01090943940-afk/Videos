# moonlamp · 源码文件索引（自动生成）

> 月光替你亮着灯（真 3D 一镜到底 · 月夜水彩）。原目录 `opus-mid-autumn-for-my-dg02/`。
> 源码已原样解压在 **`assets/cases/moonlamp/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show moonlamp <路径>`；拷出来改：`python3 scripts/casebook.py copy moonlamp <目标目录>`。

来源档案：

- `gpt-mid-autumn-for-my-dg03/月光替你亮着灯-source.zip` · zip · 1.6 MB · sha256 `ad345a7250c38afa…`

收录：文本 56 个（425.3 KB）· 二进制 4 个（544.7 KB，字体/小图）· 未收录 2 个（1.0 MB）

目录：文本文件 · 随附二进制（原样） · 未收录（视频 / 音频 / 大字体 / QA 图）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `moonfilm/.gitignore` | 5 | 0.0 KB |  |
| `moonfilm/README.md` | 235 | 19.8 KB | 月光替你亮着灯 · 源码包 |
| `moonfilm/audio/score.py` | 559 | 23.4 KB | Original score + sound for 月光替你亮着灯 — deterministic, sample-free, numpy/scipy only. |
| `moonfilm/docs/brief.md` | 37 | 3.3 KB | 月光替你亮着灯 · Story lock |
| `moonfilm/docs/retrospective.md` | 745 | 56.6 KB | 《月光替你亮着灯》代码视频复盘 |
| `moonfilm/package-lock.json` | 954 | 29.3 KB |  |
| `moonfilm/package.json` | 18 | 0.4 KB | npm scripts: build, typecheck |
| `moonfilm/reference/audio.sha256` | 4 | 0.3 KB |  |
| `moonfilm/reference/cues.json` | 45 | 0.8 KB |  |
| `moonfilm/reference/frames.sha256` | 672 | 50.5 KB |  |
| `moonfilm/reference/loudness.json` | 16 | 0.2 KB |  |
| `moonfilm/reference/manifest.json` | 16 | 0.4 KB |  |
| `moonfilm/reference/meta.json` | 317 | 4.4 KB |  |
| `moonfilm/reference/qc-report.json` | 81 | 1.5 KB |  |
| `moonfilm/reference/qc-report.md` | 15 | 0.9 KB | QC report — PASS |
| `moonfilm/reference/qc-report_crf18.json` | 81 | 1.5 KB |  |
| `moonfilm/requirements.txt` | 8 | 0.4 KB |  |
| `moonfilm/scripts/capture.mjs` | 103 | 5.0 KB | Deterministic frame capture for a window.film page (see the skill's references/runtime.md). |
| `moonfilm/scripts/export_srt.py` | 53 | 1.9 KB | Export the film's on-screen text as an SRT subtitle file (added for the source package) |
| `moonfilm/scripts/kit/LICENSE.txt` | 18 | 1.1 KB |  |
| `moonfilm/scripts/kit/audio.py` | 693 | 28.0 KB | Procedural soundtrack for a stop-motion-3d episode — deterministic, no samples, numpy only. |
| `moonfilm/scripts/kit/compare_frames.py` | 62 | 2.6 KB | Visual regression for sets: diff two keyframe folders rendered from the same frames. |
| `moonfilm/scripts/kit/contact_sheet.py` | 74 | 3.0 KB | Tile rendered keyframes into one labeled contact sheet for visual QC. |
| `moonfilm/scripts/kit/finalize.py` | 201 | 10.5 KB | Assemble + QC a stop-motion-3d render into a deliverable MP4. Never claims what it did not verify. |
| `moonfilm/scripts/make_fonts.py` | 106 | 4.5 KB | Rebuild the bundled font subsets in web/fonts/ (added for the source package) |
| `moonfilm/scripts/render_all.sh` | 51 | 2.6 KB | 从零渲染《月光替你亮着灯》成片（源码包新增的一键脚本；每一步也可以单独运行，见 README） |
| `moonfilm/scripts/verify_mp4.py` | 46 | 2.1 KB | Independent check of the delivered MP4: streams, duration, and a contact sheet of frames |
| `moonfilm/src/cam/path.ts` | 101 | 3.6 KB | ONE-TAKE CAMERA. Keys give position + aim + fov at times; between keys we use cubic Hermite |
| `moonfilm/src/core/anim.ts` | 64 | 2.7 KB | 0 before a, 1 after b, smooth between |
| `moonfilm/src/core/post.ts` | 155 | 6.8 KB | Shared G-buffer for screen-space looks |
| `moonfilm/src/core/rng.ts` | 30 | 1.0 KB | Seeded RNG — every "random" choice must be reproducible frame to frame and render to render. |
| `moonfilm/src/core/tex.ts` | 475 | 16.6 KB | Deterministic canvas textures. Nothing here is loaded from disk or the network |
| `moonfilm/src/entry/film.ts` | 189 | 7.4 KB | Capture page. Render contract on window.film (same as the stop-motion-3d kit) |
| `moonfilm/src/layout.ts` | 34 | 1.8 KB | LAYOUT — the set, in meters. +y up. The window wall is the plane z = 0; the room is z < 0, |
| `moonfilm/src/look/moonwash.ts` | 269 | 10.9 KB | LOOK — 月夜水彩 · Moonlit Watercolor (the ONLY look in this film). |
| `moonfilm/src/mg/subtitles.ts` | 249 | 9.0 KB | MG LAYER — Chinese subtitles, the end title, the red seal and the inscription, drawn on the |
| `moonfilm/src/timeline.ts` | 131 | 7.5 KB | TIMELINE — the single source of truth for picture AND sound. |
| `moonfilm/src/world/girl.ts` | 536 | 23.4 KB | 学姐 — a soft seated puppet: rounded primitives, painted face decals, 2-bone IK arms. |
| `moonfilm/src/world/index.ts` | 193 | 7.4 KB | pose the whole world at time t (pure function of t) |
| `moonfilm/src/world/outside.ts` | 521 | 23.2 KB | OUTSIDE — the night: painted far landscape, the osmanthus tree, the string of lanterns, and |
| `moonfilm/src/world/room.ts` | 355 | 16.2 KB | THE ROOM — her study corner. World code says WHAT things are ("wood", "paper", "cover:#…"); |
| `moonfilm/src/world/sky.ts` | 109 | 5.3 KB | SKY DOME — painted, not modeled: gradient, drifting cloud washes, gouache-dot stars, and the |
| `moonfilm/subtitles/subtitles.zh-CN.srt` | 44 | 0.8 KB |  |
| `moonfilm/tools/angle_check.py` | 64 | 2.9 KB | Framing angles before building the set (补全：reconstructed from the conversation) |
| `moonfilm/tools/audio_report.py` | 126 | 5.0 KB | Objective checks of the soundtrack (补全：reconstructed from the conversation) |
| `moonfilm/tools/check_repro.py` | 78 | 2.8 KB | Compare a fresh render with the original one (added for the source package) |
| `moonfilm/tools/compare_psnr.sh` | 15 | 0.9 KB | 两个版本的逐帧 PSNR 对比（补全：制作时是对话里的内联命令） |
| `moonfilm/tools/final_seconds.py` | 46 | 1.6 KB | One frame per second from the finished MP4, as one labelled sheet (补全：reconstructed from the conversation) |
| `moonfilm/tools/frame_crops.py` | 47 | 1.7 KB | Crops of the MP4 at chosen times, tiled 2 across (补全：reconstructed from the conversation) |
| `moonfilm/tools/preview.sh` | 17 | 1.0 KB | 半分辨率全片预览 + 带时间标注的拼图（补全：制作时是对话里的内联命令，按记录整理成脚本） |
| `moonfilm/tools/preview_strips.py` | 63 | 2.4 KB | Time-labelled contact sheets from preview frames (补全：reconstructed from the conversation) |
| `moonfilm/tools/seam_check.py` | 47 | 1.6 KB | Seam check after a partial re-render (补全：reconstructed from the conversation) |
| `moonfilm/tsconfig.json` | 8 | 0.3 KB |  |
| `moonfilm/web/film.html` | 16 | 1.2 KB | 月光替你亮着灯 |
| `moonfilm/web/fonts/OFL.txt` | 103 | 4.7 KB |  |
| `moonfilm/web/fonts/charset.txt` | 1 | 0.4 KB |  |

## 随附二进制（原样）

| 路径 | 类型 | 大小 |
|---|---|---:|
| `moonfilm/web/fonts/NotoSerifCJKsc-Black.subset.otf` | font | 135.5 KB |
| `moonfilm/web/fonts/NotoSerifCJKsc-Bold.subset.otf` | font | 137.0 KB |
| `moonfilm/web/fonts/NotoSerifCJKsc-Regular.subset.otf` | font | 136.0 KB |
| `moonfilm/web/fonts/NotoSerifCJKsc-SemiBold.subset.otf` | font | 136.2 KB |

## 未收录（视频 / 音频 / 大字体 / QA 图）

| 路径 | 类型 | 大小 | sha256 | 如何补回 |
|---|---|---:|---|---|
| `moonfilm/reference/final_seconds.jpg` | image | 560.8 KB | `929d11f8184e` | QC 参考联系表 |
| `moonfilm/reference/verify_sheet.jpg` | image | 467.8 KB | `99dff7af8bc5` | QC 参考联系表 |
