# moonlamp · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show moonlamp <路径>`；还原成真实目录：`python3 scripts/casebook.py copy moonlamp <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `moonfilm/.gitignore` | 5 | 68 |
| 2 | `moonfilm/README.md` | 235 | 78 |
| 3 | `moonfilm/audio/score.py` | 559 | 318 |
| 4 | `moonfilm/docs/brief.md` | 37 | 882 |
| 5 | `moonfilm/docs/retrospective.md` | 745 | 924 |
| 6 | `moonfilm/package-lock.json` | 954 | 1674 |
| 7 | `moonfilm/package.json` | 18 | 2633 |
| 8 | `moonfilm/reference/audio.sha256` | 4 | 2656 |
| 9 | `moonfilm/reference/cues.json` | 45 | 2665 |
| 10 | `moonfilm/reference/frames.sha256` | 672 | 2715 |
| 11 | `moonfilm/reference/loudness.json` | 16 | 3392 |
| 12 | `moonfilm/reference/manifest.json` | 16 | 3413 |
| 13 | `moonfilm/reference/meta.json` | 317 | 3434 |
| 14 | `moonfilm/reference/qc-report.json` | 81 | 3756 |
| 15 | `moonfilm/reference/qc-report.md` | 15 | 3842 |
| 16 | `moonfilm/reference/qc-report_crf18.json` | 81 | 3862 |
| 17 | `moonfilm/requirements.txt` | 8 | 3948 |
| 18 | `moonfilm/scripts/capture.mjs` | 103 | 3961 |
| 19 | `moonfilm/scripts/export_srt.py` | 53 | 4069 |
| 20 | `moonfilm/scripts/kit/LICENSE.txt` | 18 | 4127 |
| 21 | `moonfilm/scripts/kit/audio.py` | 693 | 4150 |
| 22 | `moonfilm/scripts/kit/compare_frames.py` | 62 | 4848 |
| 23 | `moonfilm/scripts/kit/contact_sheet.py` | 74 | 4915 |
| 24 | `moonfilm/scripts/kit/finalize.py` | 201 | 4994 |
| 25 | `moonfilm/scripts/make_fonts.py` | 106 | 5200 |
| 26 | `moonfilm/scripts/render_all.sh` | 51 | 5311 |
| 27 | `moonfilm/scripts/verify_mp4.py` | 46 | 5367 |
| 28 | `moonfilm/src/cam/path.ts` | 101 | 5418 |
| 29 | `moonfilm/src/core/anim.ts` | 64 | 5524 |
| 30 | `moonfilm/src/core/post.ts` | 155 | 5593 |
| 31 | `moonfilm/src/core/rng.ts` | 30 | 5753 |
| 32 | `moonfilm/src/core/tex.ts` | 475 | 5788 |
| 33 | `moonfilm/src/entry/film.ts` | 189 | 6268 |
| 34 | `moonfilm/src/layout.ts` | 34 | 6462 |
| 35 | `moonfilm/src/look/moonwash.ts` | 269 | 6501 |
| 36 | `moonfilm/src/mg/subtitles.ts` | 249 | 6775 |
| 37 | `moonfilm/src/timeline.ts` | 131 | 7029 |
| 38 | `moonfilm/src/world/girl.ts` | 536 | 7165 |
| 39 | `moonfilm/src/world/index.ts` | 193 | 7706 |
| 40 | `moonfilm/src/world/outside.ts` | 521 | 7904 |
| 41 | `moonfilm/src/world/room.ts` | 355 | 8430 |
| 42 | `moonfilm/src/world/sky.ts` | 109 | 8790 |
| 43 | `moonfilm/subtitles/subtitles.zh-CN.srt` | 44 | 8904 |
| 44 | `moonfilm/tools/angle_check.py` | 64 | 8953 |
| 45 | `moonfilm/tools/audio_report.py` | 126 | 9022 |
| 46 | `moonfilm/tools/check_repro.py` | 78 | 9153 |
| 47 | `moonfilm/tools/compare_psnr.sh` | 15 | 9236 |
| 48 | `moonfilm/tools/final_seconds.py` | 46 | 9256 |
| 49 | `moonfilm/tools/frame_crops.py` | 47 | 9307 |
| 50 | `moonfilm/tools/preview.sh` | 17 | 9359 |
| 51 | `moonfilm/tools/preview_strips.py` | 63 | 9381 |
| 52 | `moonfilm/tools/seam_check.py` | 47 | 9449 |
| 53 | `moonfilm/tsconfig.json` | 8 | 9501 |
| 54 | `moonfilm/web/film.html` | 16 | 9514 |
| 55 | `moonfilm/web/fonts/OFL.txt` | 103 | 9535 |
| 56 | `moonfilm/web/fonts/charset.txt` | 1 | 9643 |

---

### 1/56 · `moonfilm/.gitignore`
<!-- casebook-file {"path": "moonfilm/.gitignore", "lines": 5, "final_newline": true, "sha256": "759cb9fb32b1cbfb4cd4b7b4447cb63ee12294c3fc2873e81b4d246aa1fe0d4f", "original_sha256": "759cb9fb32b1cbfb4cd4b7b4447cb63ee12294c3fc2873e81b4d246aa1fe0d4f"} -->
```
node_modules/
web/dist/
out/
__pycache__/
*.pyc
```

### 2/56 · `moonfilm/README.md`
<!-- casebook-file {"path": "moonfilm/README.md", "lines": 235, "final_newline": true, "sha256": "a4f5ef85a00d03afbc4eb0ef477b0c4471863457e465a6661142ce596bf8c595", "original_sha256": "a4f5ef85a00d03afbc4eb0ef477b0c4471863457e465a6661142ce596bf8c595"} -->
````markdown
# 月光替你亮着灯 · 源码包

送学姐的中秋小礼物，一条 28 秒、全部由代码生成的短片。这是它的完整源码：场景、动画、画风、字幕、配乐、音效、渲染和封装脚本都在这里，按下面的命令可以从零渲染出成片 MP4。成片本身不在包里。

| 项 | 值 |
|---|---|
| 时长 / 帧率 / 帧数 | 28.0 s / 24 fps / 672 帧 |
| 分辨率 | 输出 1920×1080；3D 画面以 1600×900 渲染后放大，字幕按 1080p 直接绘制 |
| 编码 | H.264 High，yuv420p，BT.709 limited range，CRF 20，faststart；AAC-LC 192 kbps / 48 kHz 立体声 |
| 响度 | −16.08 LUFS，真峰值 −2.6 dBTP |
| Mode / Look | Mode A 真连续 3D，一镜到底；月夜水彩（全片唯一画风） |
| 交付的成片 | `月光替你亮着灯_学姐中秋快乐.mp4`，21,798,041 字节，sha256 `80e7b474…94593cc8`（见 `reference/manifest.json`） |

---

## 快速开始

```bash
# 在解压出来的 moonfilm/ 目录里
npm ci                                      # three / esbuild / typescript / playwright-core（按 package-lock.json 锁定版本）
python3 -m pip install -r requirements.txt  # numpy / scipy / Pillow（+ 可选的 matplotlib / fonttools）
npx playwright-core install chromium        # 本机没有可用的 Chromium 时才需要；会装上和制作时同一个版本 141.0.7390.37
bash scripts/render_all.sh                  # 从零到成片 → out/final.mp4（约 1 小时，主要是逐帧渲染）
```

跑完后看 `out/qc/qc-report.md`（13 项 QC）和 `out/qc/verify_sheet.jpg`（从 MP4 里解码出来的每句字幕画面）。

---

## 目录结构

标记：**【原】** 制作时的原文件，原样收录；**【工具包】** 来自 stop-motion-3d 工具包，未改动；**【改】** 为了脱离当时的机器也能跑而做的小改动；**【新增】** 为这个源码包新写的；**【补全】** 制作时是对话里的内联命令、没有存成文件，按对话记录整理成脚本。

```
moonfilm/
├─ README.md                        【新增】本文件
├─ package.json / package-lock.json 【原】npm 依赖与构建命令（npm run build = esbuild 打包）
├─ tsconfig.json                    【原】
├─ requirements.txt                 【新增】Python 依赖
├─ docs/
│  ├─ brief.md                      【原】故事定稿：Mode / Look、情绪句、戏剧句、禁区、分拍表
│  └─ retrospective.md              【原】之前交付的复盘文档「月光替你亮着灯代码视频复盘.md」（更正了 1 处数字）
├─ src/                             【原】全部画面代码（TypeScript + Three.js）
│  ├─ timeline.ts                   唯一时间源：8 句字幕 + 结尾标题/印章/落款、22 个机位关键帧、所有事件和表演的时间
│  ├─ layout.ts                     布景尺寸（米）：房间、窗、书桌、书、月亮方向、灯笼绳、星座平面
│  ├─ cam/path.ts                   一镜到底：Hermite 样条 + Fritsch–Carlson 限斜率，yaw/pitch 插值方向
│  ├─ core/post.ts                  【工具包】G-buffer、全屏 pass、GLSL 公共库、indexNoOutline
│  ├─ core/rng.ts                   【工具包】确定性随机数
│  ├─ core/anim.ts                  缓动、关键帧轨道、确定性哈希
│  ├─ core/tex.ts                   全部纹理都在运行时用 Canvas 画：纸纹、脸部 5 种表情、书脊、月饼、灯笼纸、桂花、针织、远景 4 层
│  ├─ look/moonwash.ts              唯一画风「月夜水彩」：语义材质库 + bloom 链 + 12 步水彩合成
│  ├─ world/sky.ts                  天空穹顶着色器：渐变、云、星、月盘、日冕、云纱
│  ├─ world/room.ts                 房间、窗、窗帘、书桌、台灯、可翻页的书、书堆、茶和月饼、纸灯
│  ├─ world/outside.ts              远景层、桂花树、灯笼、光点、星座天平、光流、天灯、桂花瓣
│  ├─ world/girl.ts                 学姐：图元角色、贴花表情、两骨 IK、前臂避让桌面、全部动作曲线
│  ├─ world/index.ts                组装场景、灯光、每帧 update(t)
│  ├─ mg/subtitles.ts               逐字显影的中文字幕、结尾标题、「加油」印章、落款（画在 2D 输出画布上）
│  └─ entry/film.ts                 帧契约 window.film = {ready, frame, inspect, meta}，调试开关 hide= / nomoonshadow=
├─ web/
│  ├─ film.html                     【改】渲染页；加了 4 条 @font-face，加载下面的打包字体
│  └─ fonts/                        【新增】渲染时用的 Noto Serif CJK SC 2.002 四个字重的子集 + OFL 许可 + 字表
├─ audio/score.py                   【改】原创配乐 + 音效 + 环境声 + 母带（只改了工具包路径和一处过时注释）
├─ subtitles/subtitles.zh-CN.srt    【新增】字幕的 SRT 版本（从时间轴导出，渲染不使用它）
├─ scripts/
│  ├─ capture.mjs                   【工具包】Playwright 串行出帧 / 导出 meta / QC 探针，支持断点续渲
│  ├─ verify_mp4.py                 【原】从 MP4 里解码抽帧核对字幕，打印流信息
│  ├─ render_all.sh                 【新增】一键从零到成片
│  ├─ export_srt.py                 【新增】从 meta.json 导出 SRT
│  ├─ make_fonts.py                 【新增】重新生成 web/fonts 里的字体子集（改了屏幕上的字就要重跑）
│  └─ kit/                          【工具包】finalize.py（封装 + 13 项 QC）、audio.py（DSP）、contact_sheet.py、compare_frames.py、LICENSE.txt
├─ tools/
│  ├─ check_repro.py                【新增】把 out/ 和 reference/ 的原始哈希逐一比对
│  ├─ angle_check.py                【补全】摆场景前算月亮、窗楣、窗台、人头、灯笼的方位角和仰角
│  ├─ preview.sh + preview_strips.py【补全】半分辨率 6 fps 全片预览 + 带时间标注的拼图
│  ├─ seam_check.py                 【补全】局部重渲后检查接缝
│  ├─ audio_report.py               【补全】频谱、分轨 RMS、静音窗、八度频带平衡、爆音与直流检查
│  ├─ final_seconds.py              【补全】从成片每秒解码一帧拼成总览
│  ├─ frame_crops.py                【补全】指定时刻的局部裁切（印章音画对齐检查）
│  └─ compare_psnr.sh               【补全】两个版本的逐帧 PSNR（CRF 18 → 20 的画质论证）
└─ reference/                       【新增】原始渲染的参考数据（不是输入，只用来对照）
   ├─ frames.sha256 / audio.sha256  672 帧原始 JPEG 和音频的哈希
   ├─ meta.json / cues.json         原始 meta 与音频卡点表
   ├─ qc-report.json/.md、qc-report_crf18.json、loudness.json、manifest.json
   └─ verify_sheet.jpg / final_seconds.jpg   原片的字幕抽帧拼图和逐秒总览
```

**关于「素材」**：这部片子没有任何外部图片、视频或音频素材。所有纹理都由 `src/core/tex.ts` 在运行时用 Canvas 画出来，所有声音都由 `audio/score.py` 用 numpy 合成。唯一的外部资源是字体，已经打包在 `web/fonts/`。`reference/` 里的两张 JPG 是原片的检查图，渲染不会用到。

**不在包里的**：成片 MP4；`node_modules/`（`npm ci` 重新装）；`web/dist/`（`npm run build` 生成）；`out/`（渲染输出：672 帧 JPEG 约 222 MB、音频 WAV、各种检查图）。

---

## 环境要求

| 组件 | 要求 | 制作时的版本 |
|---|---|---|
| Node.js | 18 以上 | 22.22.2（npm 10.9.7） |
| npm 包 | 由 `package-lock.json` 锁定 | three 0.186.0 · esbuild 0.28.2 · typescript 7.0.2 · playwright-core 1.56.0 |
| Chromium | Playwright 能启动的 Chromium；不需要 GPU | 141.0.7390.37（Playwright build 1194），SwiftShader 软件渲染 |
| Python | 3.9 以上 | 3.11.15 |
| Python 包 | 见 `requirements.txt` | numpy 2.4.4 · scipy 1.17.1 · Pillow 12.2.0（可选 matplotlib 3.10.9 · fonttools 4.62.1） |
| ffmpeg / ffprobe | 需要 libx264、aac、loudnorm 滤镜、h264_metadata 码流滤镜 | 6.1.1（Ubuntu 24.04 自带） |
| 机器 | 无 GPU 也能跑 | Ubuntu 24.04 x86_64，2 vCPU，7 GB 内存，无 GPU |
| 磁盘 | 输出约 300 MB（帧 222 MB + 音频 42 MB + 成片）；另外 node_modules 约 90 MB，Playwright 下载的 Chromium 几百 MB | |

**Chromium 的查找顺序**（`scripts/capture.mjs`）：环境变量 `CHROME` 指定的可执行文件 → `$PLAYWRIGHT_BROWSERS_PATH`（默认 `/opt/pw-browsers`）下的 `chromium-*` → Playwright 自己安装的浏览器（`npx playwright-core install chromium`）。Linux 上如果缺系统库，再跑一次 `npx playwright-core install-deps chromium`（需要 sudo）。

**字体**：不需要安装。`web/film.html` 用 @font-face 加载 `web/fonts/` 里的子集，只在渲染页内生效，不会装到系统里。

---

## 从零渲染：分步命令

`scripts/render_all.sh` 就是按顺序执行下面这些命令。每一步也可以单独跑，所有命令都在项目根目录执行。

```bash
PAGE="film.html?w=1920&h=1080&pw=1600&ph=900"   # 输出分辨率 w×h，3D 画面分辨率 pw×ph

# 1) 构建 + 类型检查（esbuild 带 --charset=utf8，保证中文原样进入 bundle）
npm run -s build
npx tsc -p .

# 2) 导出 meta.json：时间轴上的全部 cue（字幕、翻页、灯笼、天平、印章……），配乐从这里读时间
node scripts/capture.mjs --page "$PAGE" --meta --out out/meta.json
#    输出里出现 "page errors" 就说明页面报错了（比如着色器编译失败）；这时脚本仍然正常退出，要自己看
#    meta.json 里 "fontsOk": true 表示字体加载成功

# 3) 配乐与音效：约 10 秒，产出 out/audio/mix.wav、stems/*.wav、loudness.json、cues.json
python3 audio/score.py --meta out/meta.json --out out/audio

# 4) QC 探针（不出像素，几秒钟）：手和桌面、书页的接触，前臂穿插，镜头有没有钻进物体
node scripts/capture.mjs --page "$PAGE" --inspect 0:672 --out out/qc/inspect.json

# 5) 逐帧渲染 672 帧：2 核 CPU 平均约 4.9 s/帧，全片约 55 分钟；中断后重跑会跳过已有的帧
mkdir -p out/logs && nohup node scripts/capture.mjs --page "$PAGE" --range 0:672 --out out/frames > out/logs/render.log 2>&1 &
#    进度：tail -f out/logs/render.log（每 24 帧打印一行）

# 6) 封装 + 13 项 QC（约 2 分钟）：full→limited range 转换、BT.709 标记、faststart、全片解码、冻帧、黑帧、响度、穿插……
python3 scripts/kit/finalize.py . --frames out/frames --audio out/audio/mix.wav \
  --out out/final.mp4 --meta out/meta.json --inspect out/qc/inspect.json --crf 20

# 7) 独立校验：从 MP4 里解码出每句字幕的画面拼成 out/qc/verify_sheet.jpg；再和原始渲染逐字节比对
python3 scripts/verify_mp4.py out/final.mp4
python3 tools/check_repro.py
```

**体积**：CRF 20 约 21.8 MB，低于微信直发约 25 MB 的上限。想要高码率母版就用 `--crf 18`（约 29.2 MB），两者逐帧 PSNR 最低 45.5 dB（`bash tools/compare_psnr.sh out/final.mp4 out/final_crf18.mp4`）。

**finalize 内部实际执行的 ffmpeg 命令**（供参考）：

```bash
ffmpeg -framerate 24 -i out/frames/f%05d.jpg -i out/audio/mix.wav \
  -vf scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p \
  -c:v libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 \
  -r 24 -fps_mode cfr -g 48 -c:a aac -b:a 192k -ar 48000 -t 28.000 -movflags +faststart out/final.mp4
```

**耗时参考**（2 vCPU、无 GPU）：npm ci 约 5 s，构建不到 1 s，meta 约 2 s，配乐约 10 s，探针几秒，逐帧渲染约 55 min，封装和 QC 约 2 min。

---

## 核对复现结果

`python3 tools/check_repro.py` 会把 `out/meta.json`、`out/frames/*.jpg`、`out/audio/*.wav` 和 `reference/` 里的原始哈希逐一比对，渲染到一半也能跑。

**逐字节一致需要同样的渲染器**：Chromium 141.0.7390.37 + SwiftShader（`capture.mjs` 里的启动参数），Linux x86_64，以及 Ubuntu 默认的 fontconfig 渲染规则（hintslight 等）。在 macOS、Windows、用 GPU 渲染或换了 Chromium 版本时，预期画面看起来一样（没有在这些平台上验证过），但文字抗锯齿和浮点舍入会带来像素级差异，这是正常的，封装出的 MP4 哈希也会跟着不同。这时可以用 `python3 scripts/kit/compare_frames.py <原帧目录> <新帧目录>` 看差异比例，用 `tools/final_seconds.py` 出逐秒总览，和 `reference/final_seconds.jpg` 对照着看。

**这个源码包做过的验证**（2026-09-25，在制作时的同一台机器上）：

1. 把这个 zip 解压到一个全新目录，`npm ci` 后构建：打出的 `web/dist/film.js` 和当时渲染用的 bundle 逐字节一致。
2. 用 fontconfig 把系统里所有中日韩字体都藏起来（`fc-list` 里一个 Noto / CJK 字体都不剩），只靠 `web/fonts/` 的打包字体渲染：全片每 16 帧抽 1 帧，再加上 7 帧字幕、标题、印章画面，共 49 帧（覆盖全部 9 个小节），全部和原始帧逐字节一致。对照组是不加载打包字体的同一帧，结果不一致，说明这个测试确实在检验字体。
3. 重新合成的 `mix.wav` 和三条分轨与原始文件逐字节一致；`meta.json`、`inspect.json` 也一致。
4. 在全新目录里跑完整的 `render_all.sh`，逐帧渲染这一步直接用原始帧（已有的帧会被跳过）：13 项 QC 全部通过，数值和当时相同；生成的 `out/final.mp4` 与交付成片的 sha256 完全相同。
5. 没做的：没有把 672 帧全部重新渲染一遍（约 55 分钟）。依据是渲染只取决于帧号，第 2 条的抽样结果全部一致。

---

## 修改内容时

- **改字幕文字或时间**：只改 `src/timeline.ts` 的 `SUBS` / `TITLE` / `SEAL` / `INSCRIPTION`。新加了汉字就先跑 `python3 scripts/make_fonts.py`（需要 fonttools 和 Noto Serif CJK 字体文件：Ubuntu 装 `fonts-noto-cjk fonts-noto-cjk-extra`，或者用 `--src-dir` 指向从 https://github.com/notofonts/noto-cjk 下载的 .ttc / .otf），不然新字会退回成别的字体。然后按顺序重跑 meta → 配乐 → 探针 → 渲染，最后用 `python3 scripts/export_srt.py` 更新 SRT。
- **改画面**：用半分辨率预览看运动和转场（`bash tools/preview.sh`，约 5 分钟）；用全分辨率静帧看质感（`node scripts/capture.mjs --page "$PAGE" --frames 0,84,132 --out out/stills`，再用 `python3 scripts/kit/contact_sheet.py out/stills out/qc/board.jpg --columns 3 --width 2400` 拼图）。只有部分帧受影响时，用 `--range a:b --force` 局部重渲，再跑 `python3 tools/seam_check.py --around a,b` 检查接缝。
- **改配乐**：改 `audio/score.py`，重跑后用 `python3 tools/audio_report.py` 看频谱、动态和静音窗。所有 cue 都从 meta.json 来，不要在配乐里手写时间。
- **查画面伪影**：渲染页支持 `&hide=对象名,对象名` 和 `&nomoonshadow=1`，一帧就能二分定位（当时脸上的橙色横条就是这样查到的：窗外灯笼绳在月光阴影里的投影）。
- 更多坑和做法见 `docs/retrospective.md`。

---

## 常见问题

- **找不到 Chromium / 启动失败**：`export CHROME=/path/to/chrome`，或者 `npx playwright-core install chromium`；Linux 缺库时再跑 `npx playwright-core install-deps chromium`。
- **端口 8765 被占用**：`PORT=8766 node scripts/capture.mjs …`（render_all.sh 也认这个环境变量）。
- **输出里有 "page errors"**：页面脚本或着色器出错了，但 capture 仍会出帧。先修错误再渲染。GLSL 变量名要避开 `patch`、`sample`、`filter`、`input`、`output`、`common`、`active`、`partition` 这类保留字。
- **`fontsOk` 是 false、字幕变成别的字体**：确认 `web/fonts/*.otf` 都在；改过字幕的话先跑 `scripts/make_fonts.py`。
- **想快一点**：有 GPU 的机器可以去掉 `capture.mjs` 里的 `--use-angle=swiftshader --enable-unsafe-swiftshader`，工具包文档说能快一个数量级（未验证），但画面会有像素级差异。也可以把页面参数改成 `pw=1280&ph=720`，按实测数据推算大约省 30%，画面会稍软。
- **Windows**：`.sh` 脚本在 Git Bash 或 WSL 里跑；PowerShell 里逐条执行分步命令即可，把 `python3` 换成 `python`，环境变量写成 `$env:CHROME="C:\…\chrome.exe"`。
- **渲染中断**：直接重跑同一条命令，已经存在的帧会跳过。

---

## 相对当时工程的改动、新增与补全

**当时的源码文件都还在，没有丢失。** 做出这部片子所用的全部源码都原样收录；为了让它离开当时那台机器也能跑，只做了下面几处改动：

| 文件 | 改了什么 | 为什么 |
|---|---|---|
| `web/film.html` | 加了 4 条 @font-face，指向 `web/fonts/` | 当时用的是系统安装的 Noto Serif CJK SC；打包字体后任何机器都能用同样的字形。已验证与原片逐字节一致（见上文） |
| `audio/score.py` | 工具包 `audio.py` 的绝对路径 `/home/claude/kits/…` 改为相对路径 `scripts/kit/audio.py`；文件头注释里过时的「限幅 −2.0 dBTP」改为代码实际使用的 −2.6 | 路径是离开原机器后唯一跑不通的地方；注释只是更正，代码未动 |
| `docs/retrospective.md` | 代码节选里的「共 21 个关键帧」改为 22 | 打包时逐个数过 `src/timeline.ts` 的 CAMERA，实际是 22 个 |

**新增**：`README.md`、`requirements.txt`、`.gitignore`、`web/fonts/*`、`scripts/render_all.sh`、`scripts/export_srt.py`、`scripts/make_fonts.py`、`subtitles/subtitles.zh-CN.srt`、`tools/check_repro.py`、`reference/*`。

**补全**：下面这些检查在制作时是对话里临时写的内联命令（`python3 - <<EOF …`），从来没有存成文件。这次按对话记录里的原始命令整理成脚本，逻辑不变，只加了命令行参数、默认路径和注释。

| 脚本 | 当时的用途 |
|---|---|
| `tools/angle_check.py` | 算出从屋里往外看时窗楣的仰角只有约 19°，于是把月亮从 19° 降到 12°（`--el 19` 可以复现「月亮被窗楣切掉一部分」的结论） |
| `tools/preview.sh`、`tools/preview_strips.py` | 半分辨率每 4 帧取 1 的全片预览（168 帧约 5 分钟），拼成带秒数标注的拼图，审运动、转场和节奏 |
| `tools/seam_check.py` | 修印章后只重渲了 600–641 帧，检查两端接缝（结果 1.87–2.01，和相邻帧差一致） |
| `tools/audio_report.py` | 频谱 + 分轨 RMS、静音窗是否真静音、八度频带平衡（加母带 EQ 前后的 2–4 kHz / 8–16 kHz）、爆音和直流 |
| `tools/final_seconds.py` | 交付前从成片每秒解码一帧拼成总览 |
| `tools/frame_crops.py` | 在 25.30 / 25.50 / 25.62 / 26.00 s 裁切印章区域，确认印章正好在 25.50 s 落定 |
| `tools/compare_psnr.sh` | CRF 20 对 CRF 18 的逐帧 PSNR（最低 45.5 dB） |

**没有收录的**：一张「箫旋律包络图」（xiao_env.png）的临时脚本。它调用的是 `score.py` 早期版本的内部函数，旋律改成按乐句换气之后已经对不上；同样的检查可以看 `tools/audio_report.py` 生成的 `music_env.png`。

---

## 许可与致谢

- `scripts/kit/*`、`scripts/capture.mjs`、`src/core/post.ts`、`src/core/rng.ts` 来自 stop-motion-3d 工具包，MIT 许可（`scripts/kit/LICENSE.txt`）。
- `web/fonts/` 是 Noto Serif CJK SC 的子集，SIL Open Font License 1.1（`web/fonts/OFL.txt`）。
- npm 依赖（Three.js、esbuild、TypeScript、Playwright）按各自的许可，通过 `npm ci` 安装，不随包分发。
- 其余代码、文字和配乐是为这部片子原创的。
````

### 3/56 · `moonfilm/audio/score.py`
<!-- casebook-file {"path": "moonfilm/audio/score.py", "lines": 559, "final_newline": true, "sha256": "5d97118615b927d7979285032f46de5c9cf163a10f3def9a466497edbe26649e", "original_sha256": "5d97118615b927d7979285032f46de5c9cf163a10f3def9a466497edbe26649e"} -->
```python
#!/usr/bin/env python3
"""
Original score + sound for 月光替你亮着灯 — deterministic, sample-free, numpy/scipy only.
Every cue is read from out/meta.json (exported by the page from src/timeline.ts), so sound and
picture share one clock.

  python3 audio/score.py --meta out/meta.json --out out/audio [--lufs -16]

Stems (48 kHz float, stereo): music (pad, guzheng, xiao-like flute, bells, bass, hand drum),
sfx (pages, lanterns, stars, seal …), amb (night air + autumn crickets). mix.wav is mastered to
the target LUFS with a 4x-oversampled look-ahead limiter at −2.6 dBTP (headroom for the AAC encode).
"""
import argparse, json, math, os, subprocess, sys, importlib.util
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
RNG = np.random.default_rng(915)

# the kit's DSP helpers (reverb, limiter, loudness measure, whoosh …), vendored unchanged in scripts/kit/
# (source-package change: this path used to be an absolute path to the unpacked stop-motion-3d kit)
KIT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts", "kit", "audio.py")
spec = importlib.util.spec_from_file_location("kit_audio", KIT)
K = importlib.util.module_from_spec(spec)
spec.loader.exec_module(K)

NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def m2f(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def n2m(name):
    """'E5' -> midi"""
    pitch, octv = name[:-1], int(name[-1])
    return 12 * (octv + 1) + NOTE[pitch]


def tax(d):
    return np.arange(int(round(d * SR))) / SR


def add2(buf, mono, t0, g=1.0, pan=0.0):
    K.add2(buf, mono, t0, g, pan)


def lp(x, f, o=2):
    return K.lp(x, f, o)


def hp(x, f, o=2):
    return K.hp(x, f, o)


def bp(x, lo, hi, o=2):
    return K.bp(x, lo, hi, o)


def env(n, a, d_hold, r):
    """attack / hold / release envelope over n samples"""
    t = np.arange(n) / SR
    dur = n / SR
    e = np.clip(t / max(a, 1e-4), 0, 1)
    e *= np.clip((dur - t) / max(r, 1e-4), 0, 1)
    return e


# ----------------------------------------------------------------------------- instruments
def zheng(f, dur=2.4, bend=0.0, bend_at=0.12, vib=0.0, bright=1.0):
    """guzheng-like pluck: additive partials with per-partial decay, pluck transient,
    optional press-bend (按音/推弦) and left-hand vibrato (吟揉)."""
    t = tax(dur)
    bcurve = bend * np.clip((t - bend_at) / 0.16, 0, 1) ** 1.5
    vcurve = vib * np.clip((t - 0.25) / 0.35, 0, 1) * np.sin(2 * np.pi * 5.6 * t)
    fi = f * (2 ** (bcurve / 12)) * (1 + vcurve)
    ph = 2 * np.pi * np.cumsum(fi) / SR
    y = np.zeros_like(t)
    for k in range(1, 11):
        if f * k > 15000:
            break
        a = (1.0 / k ** 0.85) * (1.0 if k < 4 else bright)
        tau = 1.9 / (1 + 0.55 * (k - 1)) * (220 / max(f, 110)) ** 0.25
        y += a * np.sin(k * ph * (1 + 0.00035 * k * k)) * np.exp(-t / tau)
    n = int(0.012 * SR)
    tr = bp(RNG.standard_normal(n), 1500, 7000) * np.exp(-np.arange(n) / (0.002 * SR)) * 0.35
    y[:n] += tr
    att = np.clip(t / 0.002, 0, 1)
    return y * att * 0.32


def xiao_line(phrases, total):
    """a breathing xiao/dizi-like line. phrases = [[(t0, dur, midi, tongued), ...], ...].
    Inside a phrase notes are slurred (45 ms glides) unless tongued; each phrase starts with a
    soft attack and ends with a breath. Long notes swell; vibrato arrives late in each note."""
    n = int(round(total * SR))
    freq = np.full(n, 440.0)
    amp = np.zeros(n)
    vibw = np.zeros(n)
    for ph in phrases:
        p0, p1 = ph[0][0], ph[-1][0] + ph[-1][1]
        for j, (t0, d, m, tongued) in enumerate(ph):
            i0, i1 = int(t0 * SR), min(n, int((t0 + d) * SR))
            L = i1 - i0
            if L <= 0:
                continue
            f = m2f(m)
            seg = np.full(L, f)
            if j > 0:
                pf = m2f(ph[j - 1][2])
                g = min(int((0.03 if tongued else 0.045) * SR), L)
                seg[:g] = pf * (f / pf) ** (0.5 - 0.5 * np.cos(np.linspace(0, np.pi, g)))
            freq[i0:i1] = seg
            tt = np.arange(L) / SR
            a = np.ones(L)
            if d > 0.6:  # swell on long notes
                u = tt / d
                a *= 0.86 + 0.14 * np.sin(np.pi * np.clip(u * 1.15, 0, 1))
            if tongued and j > 0:
                a *= 1 - 0.6 * np.exp(-((tt - 0.012) / 0.014) ** 2)
            amp[i0:i1] = a
            vibw[i0:i1] = np.clip((tt - 0.3) / 0.45, 0, 1) * (1.0 if d > 0.5 else 0.3)
        # phrase envelope: soft attack, breath at the end
        i0, i1 = int(p0 * SR), min(n, int(p1 * SR))
        tt = np.arange(i1 - i0) / SR
        amp[i0:i1] *= np.clip(tt / 0.085, 0, 1) ** 1.5 * np.clip(((p1 - p0) - tt) / 0.2, 0, 1) ** 1.2
    t = np.arange(n) / SR
    fi = freq * (1 + 0.0062 * vibw * np.sin(2 * np.pi * 5.15 * t + 0.35 * np.sin(2 * np.pi * 0.6 * t)))
    phs = 2 * np.pi * np.cumsum(fi) / SR
    tone = np.sin(phs) + 0.3 * np.sin(2 * phs + 0.4) + 0.09 * np.sin(3 * phs + 1.1) + 0.03 * np.sin(4 * phs)
    ampl = lp(amp, 22)
    breath = bp(RNG.standard_normal(n), 900, 5200) * (0.05 + 0.1 * np.clip(np.gradient(ampl) * SR / 12, 0, 1))
    buzz = bp(np.sign(np.sin(phs)) * 0.5, 2500, 7000) * 0.018
    y = (tone * 0.55 + breath + buzz) * ampl
    return y * 0.5


def bell(f, dur=2.6, idx=1.6, dec=0.9):
    t = tax(dur)
    mod = idx * np.exp(-t / 0.45) * np.sin(2 * np.pi * f * 3.5 * t)
    y = np.sin(2 * np.pi * f * t + mod) * np.exp(-t / dec)
    y += 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (dec * 0.35))
    return y * np.clip(t / 0.0015, 0, 1) * 0.5


def pad(midis, dur, a=0.9, r=1.0, cut=1900, g=1.0):
    t = tax(dur)
    y = np.zeros_like(t)
    for m in midis:
        f = m2f(m)
        for det in (-0.09, 0.0, 0.1):
            ph0 = RNG.uniform(0, 6.28)
            for k in range(1, 7):
                if f * k > 9000:
                    break
                y += np.sin(2 * np.pi * f * k * (1 + det / 100) * t + ph0 * k) / (k ** 1.25)
    y = lp(y, cut)
    e = np.minimum(np.clip(t / a, 0, 1), np.clip((dur - t) / r, 0, 1)) ** 1.4
    return y * e * g / (len(midis) * 3.2)


def bass(f, dur):
    t = tax(dur)
    y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return y * np.clip(t / 0.04, 0, 1) * np.exp(-t / 1.6) * np.clip((dur - t) / 0.2, 0, 1) * 0.5


def hand_drum(low=True):
    t = tax(0.5)
    f = (95 if low else 170) + (70 if low else 120) * np.exp(-t / 0.035)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.16 if low else 0.08))
    n = int(0.03 * SR)
    y[:n] += bp(RNG.standard_normal(n), 400, 3500) * np.exp(-np.arange(n) / (0.006 * SR)) * 0.4
    return y * 0.7


def shaker():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return hp(RNG.standard_normal(n), 5000) * np.exp(-((t - 0.02) / 0.018) ** 2) * 0.22


# ----------------------------------------------------------------------------- sfx
def page_flip(dur=0.45, g=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    am = np.clip(np.abs(lp(RNG.standard_normal(n), 35)) * 3.2, 0, 1.6)
    swell = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.7
    y = bp(RNG.standard_normal(n), 900, 7500) * am * swell * 0.55
    # the landing flap
    k = int(0.03 * SR)
    y[-k - int(0.05 * SR):-int(0.05 * SR)] += bp(RNG.standard_normal(k), 300, 2500) * np.exp(-np.arange(k) / (0.006 * SR)) * 0.5
    return y * g


def breeze(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = bp(RNG.standard_normal(n), 250, 2200) * (0.4 + 0.6 * np.abs(lp(RNG.standard_normal(n), 2.5)) * 4)
    return y * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5 * 0.35


def sparkle(base_m, n=4, spread=0.06, g=1.0):
    y = np.zeros(int(1.8 * SR))
    pent = [0, 2, 4, 7, 9, 12, 14, 16]
    for k in range(n):
        m = base_m + pent[int(RNG.integers(0, len(pent)))]
        K.add(y, bell(m2f(m), 1.4, 0.8, 0.45), k * spread + RNG.uniform(0, 0.02), 0.28)
    return y * g


def ignite():
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    puff = lp(RNG.standard_normal(n), 900) * np.exp(-t / 0.09) * np.clip(t / 0.01, 0, 1)
    return puff * 0.5


def whoosh_air(dur, peak=0.55, lo=200, hi=3500, g=1.0):
    return K.whoosh(dur, peak, lo, hi) * g


def shimmer(dur, base=2600):
    t = tax(dur)
    y = np.zeros_like(t)
    for k, f in enumerate([base, base * 1.26, base * 1.5, base * 1.89, base * 2.25]):
        y += np.sin(2 * np.pi * f * t + k) * (0.5 + 0.5 * np.sin(2 * np.pi * (6 + k * 1.3) * t + k))
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.2
    return y * e * 0.05


def stamp():
    """the seal: a padded wooden thump + a tiny bright tick + paper"""
    t = tax(0.6)
    f = 70 + 90 * np.exp(-t / 0.02)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    n = int(0.02 * SR)
    knock = np.zeros_like(t)
    knock[:n] = bp(RNG.standard_normal(n), 800, 5000) * np.exp(-np.arange(n) / (0.004 * SR))
    return body * 0.9 + knock * 0.5


def pen_scratch(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    strokes = (0.5 + 0.5 * np.sin(2 * np.pi * 7.3 * t + 2 * np.sin(2 * np.pi * 1.1 * t))) ** 3
    y = bp(RNG.standard_normal(n), 2500, 9000) * strokes * 0.12
    return y


def crickets(dur):
    """two autumn crickets, far and near"""
    n = int(dur * SR)
    out = np.zeros((n, 2))
    for (fc, rate, pan, g) in [(4350, 0.83, -0.55, 0.05), (5100, 1.27, 0.6, 0.032), (3900, 1.9, 0.1, 0.02)]:
        t = 0.2 + RNG.uniform(0, 0.4)
        while t < dur - 0.3:
            ch = np.zeros(int(0.2 * SR))
            for p in range(3):
                seg = tax(0.018)
                tone = np.sin(2 * np.pi * fc * seg) * np.sin(np.pi * seg / 0.018)
                K.add(ch, tone, p * 0.034)
            add2(out, ch, t, g, pan)
            t += rate * RNG.uniform(0.8, 1.25)
    return out


def night_air(dur):
    n = int(dur * SR)
    b = np.cumsum(RNG.standard_normal(n)) / 600
    b = hp(b, 30)
    b = lp(b, 420)
    b = b / (np.std(b) + 1e-9) * 0.018
    air = bp(RNG.standard_normal(n), 400, 2500) * (0.006 + 0.006 * np.abs(lp(RNG.standard_normal(n), 0.4)) * 6)
    return b + air


# ----------------------------------------------------------------------------- master EQ (RBJ biquads)
def _biquad(kind, f0, gain_db=0.0, q=0.707):
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / SR
    cw, sw = np.cos(w), np.sin(w)
    al = sw / (2 * q)
    if kind == "peak":
        b = [1 + al * A, -2 * cw, 1 - al * A]
        a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind == "lowshelf":
        sq = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * cw + sq), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - sq)]
        a = [(A + 1) + (A - 1) * cw + sq, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - sq]
    elif kind == "highshelf":
        sq = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + sq), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - sq)]
        a = [(A + 1) - (A - 1) * cw + sq, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - sq]
    return np.array(b) / a[0], np.array(a) / a[0]


def master_eq(x2):
    """phones first: trim sub-bass, lift presence so the melody and bells carry on small speakers"""
    y = K.hp(x2.T, 45, 2).T if False else np.stack([K.hp(x2[:, c], 45) for c in range(2)], 1)
    for kind, f0, g, q in [("lowshelf", 160, -2.0, 0.7), ("peak", 420, -1.5, 0.9), ("peak", 2900, 3.0, 0.8), ("highshelf", 6500, 2.5, 0.7)]:
        b, a = _biquad(kind, f0, g, q)
        y = signal.lfilter(b, a, y, axis=0)
    return y


# ----------------------------------------------------------------------------- score
PROG = [  # (bar index 0-based, chord pitch classes for pad/guzheng, bass root midi)
    ("C", [48, 55, 60, 62, 64], 36),        # bar 1  Cadd9
    ("Am7", [45, 52, 57, 60, 64, 67], 45),   # bar 2
    ("Fmaj7", [41, 48, 53, 57, 60, 64], 41), # bar 3
    ("Gsus2", [43, 50, 55, 57, 62], 43),     # bar 4
    ("Em7", [40, 47, 52, 55, 59, 62], 40),   # bar 5
    ("Am7", [45, 52, 57, 60, 64, 67], 45),   # bar 6
    ("Fmaj7", [41, 48, 53, 57, 60, 64], 41), # bar 7
    ("G", [43, 50, 55, 59, 62, 67], 43),     # bar 8
    ("Cadd9", [36, 48, 55, 60, 62, 64, 67], 36),  # bar 9
]
# zheng arpeggio voicings (pentatonic-friendly)
ARP = {
    "C": [48, 55, 60, 62, 64, 67, 64, 62],
    "Am7": [45, 52, 57, 60, 64, 67, 64, 60],
    "Fmaj7": [41, 48, 53, 57, 60, 64, 60, 57],
    "Gsus2": [43, 50, 55, 57, 62, 67, 62, 57],
    "Em7": [40, 47, 52, 55, 59, 62, 59, 55],
    "G": [43, 50, 55, 62, 67, 69, 67, 62],
    "Cadd9": [48, 55, 60, 64, 67, 72, 74, 76],
}
# melody (bar, beat, dur-beats, note[, "t" = tongued]); a new phrase starts at each "|" bar
PHRASE_STARTS = {2, 4, 6, 8, 9}
MEL = [
    (2, 0, 1, "A4"), (2, 1, 0.5, "C5"), (2, 1.5, 0.5, "D5"), (2, 2, 2, "E5"),
    (3, 0, 1, "G5"), (3, 1, 0.5, "E5"), (3, 1.5, 0.5, "D5"), (3, 2, 1, "C5"), (3, 3, 1, "D5"),
    (4, 0, 1.5, "E5"), (4, 1.5, 0.5, "G5"), (4, 2, 2, "A5"),
    (5, 0, 1, "G5"), (5, 1, 1, "E5"), (5, 2, 1.5, "D5"), (5, 3.5, 0.5, "E5"),
    (6, 0, 1, "C5"), (6, 1, 0.5, "D5"), (6, 1.5, 0.5, "E5"), (6, 2, 1, "G5"), (6, 3, 1, "A5"),
    (7, 0, 2, "C6"), (7, 2, 1, "A5"), (7, 3, 1, "G5"),
    (8, 0, 1, "A5"), (8, 1, 0.5, "G5"), (8, 1.5, 0.5, "E5"), (8, 2, 1.1, "D5"),
    (9, 0, 0.5, "E5"), (9, 0.5, 0.5, "G5"), (9, 1, 2, "C6"), (9, 3, 0.5, "D6"), (9, 3.5, 1.9, "C6"),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--out", default="out/audio")
    ap.add_argument("--lufs", type=float, default=-16.0)
    a = ap.parse_args()
    meta = json.load(open(a.meta))
    C = meta["cues"]
    fps, total = meta["fps"], meta["total"]
    dur = total / fps
    N = int(round(dur * SR))
    bar, beat = C["bar"], C["bar"] / 4
    os.makedirs(os.path.join(a.out, "stems"), exist_ok=True)
    pre = np.zeros((N, 2))   # everything that starts before the break
    post = np.zeros((N, 2))  # the glissando and the end card
    sfx = np.zeros((N, 2))
    amb = np.zeros((N, 2))
    cues = []
    sil0, sil1 = C["silence"]

    def T(b, bt):  # bar (1-based), beat -> seconds
        return (b - 1) * bar + bt * beat

    def madd(x, t0, g=1.0, pan=0.0):
        add2(pre if t0 < sil0 - 1e-3 else post, x, t0, g, pan)

    # ------------------------------------------------------------- pad (grows through the film)
    for i, (name, notes, root) in enumerate(PROG):
        t0 = i * bar
        d = bar + (1.2 if i < 8 else 2.2)
        g = [0.36, 0.56, 0.64, 0.72, 0.8, 0.86, 0.95, 0.95, 1.1][i]
        madd(pad(notes, d, a=0.7 if i else 1.4, r=1.0, cut=1600 + 120 * i, g=g * 0.8), t0 - (0.05 if i else 0), 1.0, 0)
    cues.append({"layer": "music", "what": "pad", "progression": [p[0] for p in PROG]})

    # ------------------------------------------------------------- guzheng
    def zheng_bar(b, density):
        name = PROG[b - 1][0]
        arp = ARP[name]
        steps = {1: [0, 3, 5, 6], 2: [0, 2, 3, 4, 6], 3: list(range(8))}[density]
        for s in steps:
            t = T(b, s * 0.5)
            m = arp[s % len(arp)] + (12 if density >= 2 and s % 4 == 3 else 0)
            bend = 2.0 if (b in (3, 6) and s == 5) else 0.0
            vib = 0.004 if s in (0, 4) else 0.0
            madd(zheng(m2f(m), 2.2, bend=bend, vib=vib), t, (0.55 if s else 0.7) * (0.7 if b == 1 else 1.0), -0.35 + 0.1 * (s % 3))

    zheng_bar(1, 1)
    for b in (2, 3, 4):
        zheng_bar(b, 2)
    for b in (5, 6, 7):
        zheng_bar(b, 3)
    # bar 8: arpeggio up to the break, stops at the silence
    for s in range(7):
        t = T(8, s * 0.5)
        if t >= sil0 - 0.05:
            break
        madd(zheng(m2f(ARP["G"][s]), 1.6), t, 0.55, -0.3)
    # bar 9: glissando into the downbeat (audio leads the title), then bright 8ths
    pent = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79]
    g0 = sil1 + 0.002
    for k, m in enumerate(pent):
        madd(zheng(m2f(m), 1.8, bright=1.2), g0 + k * 0.017, 0.42, -0.5 + k * 0.07)
    for s in range(8):
        madd(zheng(m2f(ARP["Cadd9"][s]), 2.4, vib=0.004 if s % 4 == 0 else 0), T(9, s * 0.5) + 0.01, 0.55, -0.3 + 0.08 * s)
    madd(zheng(m2f(72), 3.2, vib=0.005), T(10, 0) + 0.01, 0.5, 0.1)  # tail
    cues.append({"layer": "music", "what": "guzheng arpeggios; glissando", "t": round(g0, 3)})

    # ------------------------------------------------------------- xiao melody (breathes between phrases)
    phrases, cur = [], []
    for k, (b, bt, d, nm) in enumerate(MEL):
        if b in PHRASE_STARTS and bt == 0 and cur:
            phrases.append(cur)
            cur = []
        t0 = T(b, bt)
        dd = d * beat
        if t0 < sil1 and t0 + dd > sil0:
            dd = max(0.05, sil0 - t0 - 0.02)
        prev = MEL[k - 1] if k else None
        tongued = prev is not None and (abs(n2m(nm) - n2m(prev[3])) >= 5 or n2m(nm) == n2m(prev[3]))
        cur.append((t0, dd, n2m(nm), tongued))
    phrases.append(cur)
    # breath: shorten the last note of every phrase a little
    for ph in phrases[:-1]:
        t0, dd, m, tg = ph[-1]
        ph[-1] = (t0, max(0.2, dd - 0.22), m, tg)
    fl_pre = xiao_line([p for p in phrases if p[0][0] < sil0], dur)
    fl_post = xiao_line([p for p in phrases if p[0][0] >= sil0], dur)
    add2(pre, fl_pre, 0, 0.62, 0.12)
    add2(post, fl_post, 0, 0.62, 0.12)
    cues.append({"layer": "music", "what": "xiao melody", "phrases": len(phrases)})

    # ------------------------------------------------------------- bass (from bar 5), warmth
    for i in range(4, 9):
        root = PROG[i][2]
        madd(bass(m2f(root), bar * 0.98), i * bar, 0.55, 0)
        madd(bass(m2f(root + 7), bar * 0.45), i * bar + 2 * beat, 0.28, 0)
    madd(bass(m2f(36), 3.8), T(10, 0) - 0.02, 0.5, 0)

    # ------------------------------------------------------------- bells: lanterns, stars, scale, title
    lant = ["G5", "A5", "C6", "D6", "E6", "G6"]
    for k, t in enumerate(C["lanternIgnite"]):
        madd(bell(m2f(n2m(lant[k])), 2.4, 1.3, 0.9), t, 0.34, -0.5 + 0.2 * k)
    for i in range(14):
        ts = C["constSettle0"] + i * C["constStagger"]
        m = [83, 86, 88, 91, 95, 98, 100][i % 7]  # Em7 colours for the stars
        madd(bell(m2f(m), 1.2, 0.7, 0.4), ts, 0.1, 0.5 - 0.06 * i)
    madd(bell(m2f(n2m("C6")), 3.8, 1.8, 1.4), C["scaleChime"], 0.4, 0.3)
    madd(bell(m2f(n2m("G6")), 3.4, 1.4, 1.2), C["scaleChime"] + 0.01, 0.26, 0.4)
    for k, m in enumerate([72, 76, 79, 84, 88]):
        madd(bell(m2f(m), 3.2, 1.4, 1.2), sil1 + k * 0.045, 0.24, -0.4 + 0.2 * k)
    cues.append({"layer": "music", "what": "bells on lanterns/stars/scale/title"})

    # ------------------------------------------------------------- hand drum + shaker (bar 8 lift, bar 9 joy)
    for s in (2, 3):
        madd(hand_drum(False), T(8, s), 0.22, 0.1)
    for s in range(8):
        t = T(9, s * 0.5)
        if s in (0, 3, 4, 6):
            madd(hand_drum(s in (0, 4)), t, 0.5 if s in (0, 4) else 0.3, 0.05)
        madd(shaker(), t + 0.02, 0.6, 0.45)
    for s in range(4):
        madd(shaker(), T(10, s * 0.5) + 0.02, 0.45 * (1 - s / 4), 0.45)
    madd(hand_drum(True), T(10, 0), 0.45, 0)

    # ------------------------------------------------------------- the break before the end card
    i0, i1 = int(sil0 * SR), int(sil1 * SR)
    f = int(0.07 * SR)
    pre = K.reverb(pre, 0.24, 2.2)
    pre[i0 - f:i0] *= np.linspace(1, 0, f)[:, None]
    pre[i0:] = 0  # the break is real silence: no reverb tails cross it
    post = K.reverb(post, 0.24, 2.2)
    music = pre + post
    cues.append({"layer": "music", "what": "silence (punctuation)", "t0": sil0, "t1": sil1})

    # ------------------------------------------------------------- sfx
    add2(sfx, whoosh_air(1.6, 0.5, 180, 2600, 0.5), 1.0, 1.0, 0.0)  # through the window
    ps = pen_scratch(4.1)
    ps *= np.clip(np.arange(len(ps)) / (0.6 * SR), 0, 1) * np.clip((len(ps) - np.arange(len(ps))) / (0.3 * SR), 0, 1)
    add2(sfx, ps, 2.3, 0.55, -0.2)
    for t in C["handFlips"]:
        add2(sfx, page_flip(0.5, 1.0), t + 0.02, 0.9, -0.15)
    for t in C["breezeFlips"]:
        add2(sfx, page_flip(0.34, 0.7), t, 0.8, -0.1 + RNG.uniform(-0.2, 0.2))
    add2(sfx, breeze(1.6), 7.72, 0.9, 0.3)
    for t in C["moteEmit"]:
        add2(sfx, sparkle(84, 3, 0.05, 0.8), t, 0.5, -0.1)
    for k, t in enumerate(C["lanternIgnite"]):
        add2(sfx, ignite(), t - 0.02, 0.45, -0.5 + 0.2 * k)
    for i in range(14):
        tl = C["constLift0"] + i * C["constStagger"]
        if i % 3 == 0:
            add2(sfx, whoosh_air(0.9, 0.6, 500, 5000, 0.18), tl, 1.0, 0.4)
    a0, a1 = C["constLines"]
    add2(sfx, shimmer(a1 - a0 + 0.4, 2600), a0, 0.8, 0.45)
    s0, s1 = C["streams"]
    add2(sfx, shimmer(s1 - s0 + 0.6, 3100), s0, 0.9, 0.2)
    add2(sfx, whoosh_air(2.2, 0.62, 250, 4200, 0.28), C["moonbeam"] - 1.2, 1.0, 0.0)
    add2(sfx, sparkle(88, 5, 0.07, 0.9), C["moonbeam"] + 0.02, 0.5, 0.2)
    pd = C["act"]["penDown"]
    tap = bp(RNG.standard_normal(int(0.04 * SR)), 900, 5000) * np.exp(-np.arange(int(0.04 * SR)) / (0.005 * SR))
    add2(sfx, tap, pd[1] - 0.08, 0.35, -0.3)
    st = C["act"]["stretch"]
    add2(sfx, breeze(1.0) * 0.6, st[0], 0.5, 0.0)
    r0, r1 = C["ring"]
    add2(sfx, shimmer(r1 - r0 + 0.3, 2200), r0, 0.8, 0.1)
    for k in range(6):
        add2(sfx, whoosh_air(1.4, 0.5, 300, 3000, 0.12), C["skyLanterns"] + 0.1 + k * 0.45, 1.0, -0.5 + 0.2 * k)
    add2(sfx, stamp(), C["seal"]["at"] - 0.005, 0.95, 0.35)
    add2(sfx, sparkle(91, 4, 0.05, 1.0), C["seal"]["at"] + 0.03, 0.4, 0.35)
    brush = bp(RNG.standard_normal(int(0.5 * SR)), 1500, 7000) * np.sin(np.pi * np.linspace(0, 1, int(0.5 * SR))) * 0.12
    add2(sfx, brush, C["inscription"]["at"], 0.6, 0.0)
    # petals: occasional tiny tinkles
    for k in range(9):
        t = C["petalsIn"] + 0.4 + k * 0.62 + RNG.uniform(0, 0.2)
        add2(sfx, bell(m2f(96 + [0, 2, 4, 7, 9][k % 5]), 0.8, 0.5, 0.25), t, 0.05, RNG.uniform(-0.6, 0.6))
    cues.append({"layer": "sfx", "what": "window whoosh, pen, pages, breeze, motes, lantern puffs, star shimmer, moonlight, pen tap, stretch, ring, sky lanterns, seal, brush, petals"})

    # ------------------------------------------------------------- ambience
    air = night_air(dur + 0.5)
    add2(amb, air, 0, 1.0, -0.2)
    add2(amb, night_air(dur + 0.5)[::-1], 0, 0.8, 0.3)
    cr = crickets(dur)
    amb[: len(cr)] += cr * np.clip(1 - np.linspace(0, 1, len(cr)) * 0.35, 0, 1)[:, None]
    amb[i0:i1] *= 1.2  # during the silence the night is heard
    cues.append({"layer": "amb", "what": "night air + three crickets"})

    # ------------------------------------------------------------- edges, stems, mix
    for buf in (music, sfx, amb):
        f0 = int(0.12 * SR)
        buf[:f0] *= np.linspace(0, 1, f0)[:, None]
        g = int(0.9 * SR)
        buf[-g:] *= (np.linspace(1, 0, g) ** 1.6)[:, None]
    stems = {"music": music * 0.62, "sfx": K.reverb(sfx, 0.12, 1.2) * 0.55, "amb": amb * 0.5}
    for k, v in stems.items():
        wavfile.write(os.path.join(a.out, "stems", f"{k}.wav"), SR, v.astype(np.float32))
    mix = master_eq(sum(stems.values()))
    tmp = os.path.join(a.out, "_pre.wav")
    wavfile.write(tmp, SR, mix.astype(np.float32))
    m0 = K.measure(tmp)
    mix *= 10 ** ((a.lufs - m0["I"]) / 20)
    mix = K.limiter(mix, -2.6)
    out = os.path.join(a.out, "mix.wav")
    wavfile.write(out, SR, mix.astype(np.float32))
    os.remove(tmp)
    m1 = K.measure(out)
    rep = {"target_lufs": a.lufs, "pre": m0, "final": m1, "duration": dur, "sr": SR, "ok": abs(m1["I"] - a.lufs) < 1.0 and m1["TP"] <= -1.0}
    json.dump(rep, open(os.path.join(a.out, "loudness.json"), "w"), indent=2)
    json.dump(cues, open(os.path.join(a.out, "cues.json"), "w"), indent=2, ensure_ascii=False)
    print(json.dumps(rep))
    if not rep["ok"]:
        print("LOUDNESS OUT OF SPEC", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
```

### 4/56 · `moonfilm/docs/brief.md`
<!-- casebook-file {"path": "moonfilm/docs/brief.md", "lines": 37, "final_newline": true, "sha256": "29c53fe029da64112e2f50ed5ff5e2cda87dda8ff04f2dfad055ae67420aba6b", "original_sha256": "29c53fe029da64112e2f50ed5ff5e2cda87dda8ff04f2dfad055ae67420aba6b"} -->
```markdown
# 月光替你亮着灯 · Story lock

**Mode A — 真连续 3D，一镜到底。** 28.0 s，24 fps，一个连续机位穿过同一个真实三维空间：
从窗外月亮前方倒拉进学姐的书桌 → 绕到她身边 → 贴近书页 → 抬头望出窗外 → 回到身后看满月。无剪辑、无转场、无 2D 假视差。

**Look（全片唯一）— 月夜水彩 Moonlit Watercolor。** kit 选型表"抒情 / 节日（中秋）→ watercolor"的夜间版：
同一条管线从头到尾——Lambert 底色 → 颜料漂移 → 7 采样晕染 → 色块交界积色 → 暗部颗粒 → 冷压纸纹 →
靛蓝铅笔底稿 → 湿画法辉光（月亮 / 灯笼 / 台灯"化开"在纸上）。天空、月亮、字幕、印章都服从这一种语言。

## 情绪句
看完学姐应该感到 **被看见、被托住、有劲儿**，因为 **她每一页、每一晚的光都被点亮、被接住，最后变成照亮她的月光**。

## 戏剧句
学姐想考上法学研究生，但时间紧、跨专业自学很累，于是（只有这个媒介能做的）每翻一页就放出一粒光——
光点亮窗外的灯笼、连成一架天平、汇成满月，导致月亮变圆变亮、光照回她身上，留下笑意和勇气。

## 英雄道具
台灯（开场唯一的一盏灯）→ 结尾满天的灯与满月。空→满、暗→亮、一盏→全部。

## 禁区（逐条自查）
- 无任何家庭/父母/回家/团圆字样与暗示（"团圆感"只用"月圆 / 圆满 / 光汇成圆"表达）。
- 无倒计时、无日历、无时钟、无数字、无比较。
- 法学只出现为：书脊上的字、一架由星光连成的天平（从倾斜到持平）、一枚"加油"印章。不讲任何知识点。

## 分拍（80 BPM，一小节 = 3.0 s，字幕换行全部落在小节线上）

| 小节 | 时间 | 字幕 | 画面动作（高密度） |
|---|---|---|---|
| 1 | 0–3 | 今晚月亮很圆，/ 你的台灯也还亮着。 | 月亮半隐云后；机位从窗外倒拉：灯笼从头顶掠过、桂花枝从左侧划过、窗框包住画面、台灯与她的背影入画 |
| 2 | 3–6 | 这几个月会很难，/ 但你一直在认真走。 | 机位绕到她左前方；她写字、呼吸；高高一摞法学书；茶在冒热气 |
| 3 | 6–9 | 不急——一页一页，/ 一晚一晚。 | 贴近书页：她亲手翻两页（各放出一粒光）；一阵风再翻过四页，光点成串升起飘出窗外 |
| 4 | 9–12 | 每个认真的夜晚，/ 都算数。 | 机位越过她头顶望出窗外：六粒光依次点亮六盏灯笼（八分音符钟声）；她抬头看 |
| 5 | 12–15 | 你想让世界更公平、/ 更温柔一点， | 灯笼升起光球，远处也升起光，连成一架星光天平（此时是倾斜的） |
| 6 | 15–18 | 这份心，/ 本身就是力量。 | 天平缓缓持平（一声清响）；光流向月亮，云散，月亮变满变亮 |
| 7 | 18–21 | 你照亮过很多人，/ 今晚换月亮照亮你。 | 月光涌进窗，桂花飘进屋；机位转到她右前方：她抬头望月，笑了 |
| 8 | 21–24 | 你在争取的未来，/ 你配得上。 | 放下笔，大大伸个懒腰；星光散开，绕月亮围成一个圆；23.6 s 音乐留白 |
| 9 | 24–28 | **学姐，中秋快乐！** + 印章「加油」 | 满天灯笼升起、桂花回旋；她握拳一挥，印章同时落下；落款「丙午中秋 · 赠学姐」 |
```

### 5/56 · `moonfilm/docs/retrospective.md`
<!-- casebook-file {"path": "moonfilm/docs/retrospective.md", "lines": 745, "final_newline": true, "sha256": "78d5d184da5911a9c9cef31704c48f53bd4bb3d24609f5674068d3469ffb6cdd", "original_sha256": "78d5d184da5911a9c9cef31704c48f53bd4bb3d24609f5674068d3469ffb6cdd"} -->
````markdown
# 《月光替你亮着灯》代码视频复盘

> 一条 28 秒、全部由代码生成的中秋祝福短片，从需求到交付 MP4 的完整复盘。
> 目的：下次做同类「代码视频」时，只看这一份就能复用方法、少踩坑。
> 下文所有数字、参数、命令、报错都来自这次真实的制作过程。

---

## 目录

- [0. 项目档案与一页速览](#0-项目档案与一页速览)
- [一、踩过的坑](#一踩过的坑)
- [二、注意事项清单](#二注意事项清单)
- [三、创作思路](#三创作思路)
- [四、具体的创作方式](#四具体的创作方式)
- [五、可复用的模板](#五可复用的模板)

---

## 0. 项目档案与一页速览

### 0.1 成片参数

| 项 | 值 |
|---|---|
| 片名 | 月光替你亮着灯（送学姐的中秋小礼物） |
| 时长 / 帧率 / 总帧数 | 28.0 s / 24 fps / 672 帧 |
| 分辨率 | 输出 1920×1080；3D 画面（plate）内部渲染 1600×900 再放大，字幕按 1080p 绘制 |
| 编码 | H.264 High, yuv420p, BT.709 limited range, CRF 20, preset slow, GOP 48, faststart；AAC-LC 192 kbps / 48 kHz 立体声 |
| 体积 | 21.8 MB（CRF 18 版为 29.2 MB，超出微信约 25 MB 的直发上限，所以交付 CRF 20 版） |
| 响度 | MP4 内 AAC 实测 −16.08 LUFS，真峰值 −2.6 dBTP，LRA 4.9 |
| Mode | A：真连续 3D，一镜到底，无剪辑 |
| Look | 月夜水彩（stop-motion-3d 工具包 watercolor 管线的夜间版），全片唯一画风 |
| QC | 工具包 finalize.py 的 13 项检查全部 PASS；另外从 MP4 解码抽帧逐句核对字幕 |

### 0.2 真实时间线（北京时间，总计约 2 小时 26 分）

| 时间 | 做了什么 | 用时 |
|---|---|---|
| 02:04–02:11 | 解压两个工具包、读 SKILL.md 和 references、检查环境、用模板渲 5 帧测速度 | 7 min |
| 02:11–02:21 | 定 Mode / Look / 情绪句 / 8 句字幕 + 结尾标题 / 分拍表，写 `docs/brief.md` | 10 min |
| 02:21–约 02:45 | 写全部代码：时间轴、布景、机位样条、纹理、画风后期、天空、人物、室外、字幕、入口 | 约 24 min |
| 约 02:45–03:07 | 静帧迭代 5 轮（v1–v5），修画面、人物、光照、构图 | 约 22 min |
| 03:07–03:15 | 半分辨率全片预览（每 4 帧取 1，共 168 帧，5 分 08 秒）+ 转场专项 | 8 min |
| 03:15–03:23 | 修转场与结尾；写配乐脚本并迭代 3 次；QC 探针发现手臂穿插并修好 | 8 min |
| 03:23–04:19 | **全片渲染 672 帧，55 分 15 秒，平均 4.94 s/帧**（后台运行） | 56 min |
| 04:19–04:30 | 封装 + 13 项 QC（92 s）、解码抽帧核对、修印章音画错位（只重渲 42 帧）、再封装、压到 CRF 20（82 s）、PSNR 对比、交付 | 11 min |

### 0.3 十条最重要的经验

1. **一份时间轴驱动一切**：`src/timeline.ts` 是唯一时间源，画面、字幕、音乐、音效、QC 都从这里取时间。音乐的一小节（80 BPM，3.0 s）等于一句字幕，所以音画天然对齐。
2. **渲染是帧号的纯函数**：没有随机、没有跨帧累积状态。所以可以只重渲局部帧（这次修印章只重渲了 42 帧），接缝也看不出来。
3. **先算角度，再摆场景**：月亮、窗框、人头、灯笼在每个机位下的仰角和方位角，用一个 20 行的 Python 脚本算清楚，比反复试渲快得多。
4. **法线/深度 pass 要排除所有透明物体**：sprite、粒子、alphaTest 远景、天空穹顶都要打 `noOutline` 并调用 `indexNoOutline(scene)`，否则描边会画出方框。
5. **低角度主光不要让室外物体投影**：这次脸上的橙色横条，是窗外 9 mm 粗的灯笼绳投下的影子。
6. **每次改完先渲 1 帧看 page errors**：GLSL 保留字 `patch` 会让着色器编译失败，但渲染脚本照样出帧，不会报错退出。
7. **cue 时间要定义成冲击时刻**：动画要在 cue 那一刻"落定"，声音可以提前起。这次印章的声音比画面早了 0.26 s，就是因为动画是从 cue 开始、而不是在 cue 结束。
8. **用 QC 探针找肉眼看不到的错**：inspect 发现 381/672 帧前臂穿进桌面最深 3 cm，静帧里完全看不出来。
9. **看不了视频就看"带时间标注的连续帧拼图"**：半分辨率、每 4 帧取 1 拼成 contact sheet，是审运动、转场、节奏最有效的方法。
10. **交付前按平台限制算体积**：纸纹颗粒很吃码率。CRF 18 是 29.2 MB，CRF 20 是 21.8 MB，两者逐帧 PSNR ≥ 45.5 dB，肉眼看不出差别。

---

## 一、踩过的坑

每条按「现象 → 根因 → 解决 → 下次预防」四项写。按类别分组，组内大致按发生顺序排列。

### A. 运行环境与依赖

**A1. 没有 GPU，只能用 CPU 软件渲染**
- **现象**：工具包自带模板渲 1280×720、单一水彩画风是 1.26 s/帧；这次的成片（1080p 输出、1600×900 画面、阴影、5 盏灯、天空噪声、bloom、每像素十几次纹理采样的水彩后期（7 次晕染 + 描边 + 两级 bloom + 纸纹）、逐字模糊字幕）平均 4.94 s/帧，全片 55 分钟。
- **根因**：headless Chromium 用 ANGLE + SwiftShader 在 2 个 vCPU 上做纯 CPU 光栅化。
- **解决**：全片渲染用 `nohup` 放后台，并且支持断点续渲（已存在的帧自动跳过）；构图和运动用半分辨率预览（1.6–1.9 s/帧）。
- **下次预防**：开工第一件事是测一帧的耗时，用"s/帧 × 总帧数"估算渲染时间，并把全片渲染安排在最后、只跑一次。按两次实测推算（全分辨率 4.94 s，四分之一像素 1.83 s），每帧约有 0.8 s 的固定开销，另外约 4.1 s 和像素数成正比，**所以降低 plate 分辨率是最有效的提速手段**。

**A2. 渲染期间并行跑重任务，把渲染拖慢了**
- **现象**：全片渲染刚开始时同时跑了音频合成，前 1.5 分钟只出了 15 帧。
- **根因**：只有 2 个 vCPU，SwiftShader 会吃满所有核。
- **解决**：音频在渲染前定稿；渲染期间只做读帧抽查、写校验脚本这类轻活。
- **下次预防**：渲染开始前，把音频、meta、QC 探针全部跑完。

**A3. 网络受限，拿不到素材，也没有可用的 TTS**
- **现象**：沙箱只放行 npm、pip、GitHub，没有图片、音效、音乐素材来源，也没有能用的离线中文语音合成。
- **解决**：所有纹理都用 Canvas 程序化生成（纸纹、脸部表情、书脊书名、月饼花纹、灯笼纸、桂花、针织纹理、远景剪影），所有声音都用 numpy 合成；**放弃旁白**，改用字幕加原创配乐（机械音色的 TTS 会破坏礼物的温度）。
- **下次预防**：开工前先确认"素材从哪里来"。默认全部程序化；如果一定要旁白，先确认 TTS 的来源和音质。

**A4. Playwright 和 Chromium**
- **现象 / 做法**：环境里预装了 `/opt/pw-browsers/chromium-1194`，**不要运行 `playwright install`**。工具包的 `capture.mjs` 会自己去找 Chromium，启动参数是 `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --disable-gpu-vsync --no-sandbox`，一个浏览器、一个页面、串行出帧。
- **下次预防**：先用模板渲 2–3 帧，确认浏览器能启动、WebGL 能用、速度是多少。

**A5. 着色器编译失败时，渲染不会停**
- **现象**：新写的水彩后期中有个变量叫 `patch`，渲染脚本照样输出了帧，只在日志末尾打印 `page errors: ... 'patch' : Illegal use of reserved word`。
- **根因**：`patch` 是 GLSL 保留字；页面报错不会让 capture 脚本以失败退出。
- **解决**：改名为 `patchy`。
- **下次预防**：每次 build 后先渲 1 帧，并执行 `grep "page errors"`。GLSL 变量名要避开 `patch`、`sample`、`input`、`output`、`filter`、`active`、`common`、`partition`、`precise` 这类保留字。

**A6. TypeScript 同名变量**
- **现象**：`room.ts` 里墙体的 `right` 和书页的 `right` 重名，esbuild 和 tsc 都报错。
- **下次预防**：每次改完同时运行 `npm run -s build` 和 `npx tsc -p .`。命名带上语义前缀，比如 `rightWall` 和 `rightPage`。

### B. 渲染管线与画面质量

**B1. 画面四周出现巨大的灰白椭圆"纸边"**
- **现象**：第一批静帧四周有一圈占画面约 20% 的灰白椭圆。
- **根因**：`corner = smoothstep(.62, .78, length(q*vec2(1.02,1.28)))`，在画面上边缘的中点，这个长度已经是 0.64，已经进入过渡区。我对公式的心算是错的。
- **解决**：去掉纸边，只保留角落压暗：`c *= 1. - .34 * pow(clamp(length(q*vec2(1.05,1.25))*1.25, 0., 1.), 2.4)`。
- **下次预防**：任何新的后期效果，都先渲 1 帧看实际效果，不要靠心算。字幕区域绝对不能出现纸白（工具包的水彩失败检查也写了这一条）。

**B2. 描边在花瓣和光点周围画出方框**
- **现象**：桂花瓣、光点、星点周围出现方形的铅笔线，远景圆柱的顶端也出现一条直线。
- **根因**：法线/深度 pass 用 `scene.overrideMaterial = MeshNormalMaterial`，会把 Sprite、InstancedMesh 花瓣、alphaTest 的远景都当成完整的四边形画进深度图，边缘检测就把方框描了出来。工具包靠 `indexNoOutline(scene)` 把这些物体在这个 pass 里隐藏，**我重写场景时忘了调用它**。
- **解决**：场景建完后调用 `indexNoOutline(scene)`；天空穹顶、远景层、地面、sprite、粒子、窗帘、玻璃、脸部贴花都打上 `userData.noOutline = true`。
- **下次预防**：场景一建完就调用 index。新增透明、精灵、粒子类物体时，同时打标记。

**B3. 近景时脸上有一道橙色横条（最难查的一个）**
- **现象**：抬头望月的近景里，她脸上横着一条约 3 cm 宽的暖色带。
- **排查**：在渲染页加 URL 调试开关（`hide=collar,hairLong,neck,torso`、`nomoonshadow=1`），4 个变体各渲一帧，只有关掉月光阴影时横条消失。
- **根因**：窗外的灯笼绳（一根 9 mm 粗的管子）在月光方向光的阴影贴图里，影子正好落在她脸上。月亮仰角只有 12°，室外物体的影子会投进屋里很深。
- **解决**：室外所有物体 `castShadow = false`；头部零件也不投影，避免自投影在脸上形成条纹。
- **下次预防**：低角度的主光只让室内关键物体投影。**渲染页一开始就预留调试开关（隐藏指定对象、关阴影）**，排查速度会快很多。

**B4. 台灯过曝**
- **现象**：手臂和书页一片发白，灯罩内侧是一个巨大的光团。
- **根因**：SpotLight 强度 1.6、衰减 decay=2，在 0.25–0.4 m 的距离上辐照太强；灯罩内壁发光 ×2.6、灯泡 ×6，都远超 bloom 阈值 0.9。
- **解决**：spot 强度降到 0.62，灯罩内壁 ×1.0，灯泡 ×2.2，bloom 阈值提到 1.25。
- **下次预防**：离人很近的光源用低强度，整体明暗用 exposure 统一调；bloom 阈值设在 1.2 以上，只让真正的光源发光。

**B5. 满月变成一团白雾**
- **现象**：高潮和结尾，月亮看不出圆盘的边缘。
- **根因**：日冕项系数 0.5、大范围辉光、月面 HDR 亮度 2.0+2.8×亮度（满月时 4.8）、bloom、结尾提亮，这几项叠加在一起。
- **解决**：日冕系数 0.5 → 0.26 → 0.17；月面 HDR 改成 1.3+0.75×亮度；被月亮照亮的云也减弱。
- **下次预防**：画面主角是发光体时，专门渲它**最亮的那一刻**，检查"圆盘"和"光晕"之间有没有对比。

**B6. "棒棒糖树"**
- **现象**：中景用球体树冠加圆柱树干做的树，在夜景里是一个个黑色圆盘。
- **解决**：全部删掉。远景改成 Canvas 画的 4 层剪影，贴在不同半径的圆柱内壁上：远山（r=150 m）、老城屋顶加宝塔（r=104 m）、树线（r=62 m）、带金色桂花点的庭院树（r=22 m）。每层顶部有一条月光勾出的亮边，底部有一层雾。
- **下次预防**：遵守工具包的铁律——**远景是画出来的，不是建模出来的**。

**B7. 未点亮的灯笼像黑块，镜头还从灯笼下面穿过**
- **现象**：开场是几个巨大的黑色灯笼剪影。
- **根因**：逆光加纯漫反射；灯笼绳离镜头路径太近。
- **解决**：灯笼纸加一点基础自发光（0.05），点亮后是 2.35 再加闪烁；灯笼绳从 z=3.35 移到 z=4.2，高度从 3.05 m 降到 2.45 m；开场机位用角度计算，让月亮正好框在两盏灯笼之间。
- **下次预防**：开场第一帧要单独设计构图，并用角度计算确认主体之间互不遮挡。

**B8. 平面"月光束"露出硬边多边形**
- **解决**：直接删掉。
- **下次预防**：用加法混合平面做体积光时，四条边都必须衰减到 0，而且只在需要的时候才显示。

**B9. 天平星座太小，认不出来**
- **现象**：第一版在画面上只有约 140 px 宽，看起来像一小撮星星。
- **解决**：单位长度 4.1 m → 9.2 m（距离 90 m），仰角提到 0.3 rad，线宽改为距离 × 0.0042。
- **下次预防**：符号类元素，先在最终机位的 fov 下算出像素尺寸，至少要占画面宽度的 1/6。

**B10. 天灯像发白的纸杯**
- **根因**：圆柱体从上往下看就像杯子；自发光 2.2 触发了水彩后期"最亮处变成纸白"的步骤，颜色被洗掉了。
- **解决**：改成圆灯笼，自发光 1.05，外加光晕 sprite；近处的天灯从更远处生成（z 从 3.2–9 改到 6.5–13）。
- **下次预防**：在水彩后期里，高亮物体会被"纸白化"。想保留颜色饱和度，就要控制亮度。

**B11. 小问题**：茶杯的蒸汽像几个白点（透明度 0.16 → 0.07）；落地盆栽在背光下像第二颗人头（删掉）。

**B12. 渲染中的耗时尖峰**
- **现象**：日志里记录到 5 次单帧 16–20 s。日志只打印每第 24 帧，实际可能更多。
- **根因**：**这次没有确认**。可能是大画布和 JPEG dataURL 触发的垃圾回收，也可能是灯光数量变化（`lanternLight` 和 `spill` 的 `visible` 切换）导致材质重新编译。
- **下次预防**：尽量让灯光数量在全片保持不变。要确认原因，可以把 capture 改成每帧都打印耗时。

### C. 帧率与时长

**C1. 时长、帧率、节拍一起设计**
- 24 fps × 28.0 s = 672 帧。80 BPM 下一小节是 3.0 s（72 帧），9 小节加 1 s 尾声。**每句字幕的换行都落在小节线上**（帧号是 72 的倍数，加 3–7 帧的呼吸）。
- 效果：音乐的和弦变化、字幕换句、镜头段落，天然对齐在同一个格子里。

**C2. 所有时间都用秒写**
- 帧号 = round(t × 24)。渲染函数只依赖帧号，是纯函数，所以可以局部重渲：修印章时只用 `--range 600:642 --force` 重渲了 42 帧。
- 接缝检查：比较相邻帧的平均像素差（灰度 0–255），接缝处是 1.87–2.01，和正常帧之间的差值一致。

**C3. 音频长度必须精确等于画面**
- 48 kHz × 28.0 s = 1,344,000 个样本；finalize 的 preflight 检查允许误差 ±0.05 s，ffmpeg 加 `-t 28.000`。实测音频 28.000 s，画面 28.000 s。

**C4. 预览要抽帧，不要全渲**
- 半分辨率（输出 960×540、plate 800×450）、每 4 帧取 1（6 fps），168 帧用了 5 分 08 秒。按秒标注拼成拼图，用来审运动的连续性。

### D. 音频与画面同步

**D1. 印章"声音比画面早"0.26 s**
- **现象**：印章落下的"咚"比画面落定早了 0.26 s。
- **根因**：动画从 `SEAL.at` 开始，经过 0.26 s 的缩放才落定；而音效放在 `SEAL.at`。
- **解决**：动画改为从 `SEAL.at − 0.26` 开始，恰好在 `SEAL.at` 落定——这一刻也正是她握拳的最高点。
- **下次预防**：**约定 cue 时间 = 冲击时刻，所有动画都在 cue 上"结束"**。声音可以提前起（whoosh、刮奏引子），但冲击点必须对齐。

**D2. 静音窗把刮奏一起吞掉了**
- **现象**：原设计的静音窗是 23.62–24.0 s，会把 23.76 s 开始的古筝刮奏一起清零。
- **解决**：静音改为 23.52–23.78 s，刮奏 23.78–24.0 s（14 个音 × 17 ms），落在 24.0 s 的标题上。音乐分成 pre 和 post 两条总线：pre 在静音起点硬切（连混响尾巴一起切掉，才是真正的静音），post 完整保留。
- **下次预防**：静音是"标点"，要和它后面的引子一起放进时间轴设计。

**D3. 单一时间源，避免手工对点**
- 流程是：timeline.ts → 页面的 `meta()` → `out/meta.json` → `score.py` 读取所有 cue（翻页、光点、灯笼、星点、天平、月满、月光、伸懒腰、印章、落款）。**改过时间轴，一定要重新导出 meta，再重新合成音频。**

### E. BGM 与音效卡点

**E1. 灯笼点亮落在八分音符上**：9.375 + 0.375×k 秒。每盏配一个上行的五声音阶钟音（G5 A5 C6 D6 E6 G6），再加一声"噗"的点火声。听感上就是"一盏、一盏，都算数"。

**E2. 天平持平落在第 6 小节第 3 拍（16.5 s）**：画面上星点和连线同时闪光（高斯脉冲，中心 16.5 s），声音是 C6 + G6 两个钟音。

**E3. 箫的旋律一口气吹了 20 秒**
- **现象**：画出包络图才发现，整条旋律从 3 s 连到 23 s，一次都没有换气。
- **根因**：首尾相接的音符全部被当成了连音。
- **解决**：按乐句分组（第 2、4、6、8、9 小节各起一句），句尾缩短 0.22 s 用来换气；大跳（≥ 5 个半音）和同音重复用吐音；长音加渐强渐弱；颤音在音头之后 0.3 s 才进入。
- **下次预防**：合成旋律乐器时，一定要画包络图检查"呼吸"。

**E4. 星点钟声和和弦打架**：第 5 小节是 Em7，钟音原来用了 A 和 C，改成 Em7 的和弦音（B D E G）。**有音高的点缀音效，要按当前小节的和弦取音。**

**E5. 开场太满**：第 1 小节音乐的 RMS 只比后面低 2 dB。调低第 1 小节的 pad 和古筝之后，音乐分轨的动态变成 −25 → −20 → −17 → −14 dB 的逐段推进。**要画各分轨的 RMS 曲线，检查动态弧线。**

**E6. 手机外放发闷**
- 八度频带能量（相对 63–125 Hz）：2–4 kHz 是 −11.1 dB，8–16 kHz 是 −24.4 dB。
- 加母带 EQ：45 Hz 高通、160 Hz 低架 −2 dB、420 Hz −1.5 dB、2.9 kHz +3 dB、6.5 kHz 高架 +2.5 dB。之后两个频带分别是 −6.3 dB 和 −19.9 dB。

**E7. 真峰值要给有损编码留余量**：第一版限幅到 −2.0 dBTP，WAV 实测却是 −1.84 dBTP（实测值比限幅设定高约 0.2 dB）；AAC 这类有损编码还可能再抬高真峰值，逼近 finalize 要求的 TP ≤ −1.0 dBTP。于是限幅器改成 −2.6：WAV 实测 −16.02 LUFS / −2.39 dBTP，MP4 里的 AAC 实测 −16.08 LUFS / −2.6 dBTP。这次 AAC 并没有抬高峰值，但这点余量是很便宜的保险。

**E8. 局限**：我没法用耳朵听，只能用响度、频谱、包络和样本跳变检测做客观检查。交付时如实说明了这一点。

### F. 中文字体与文字排版

**F1. 字体加载**：使用系统字体 Noto Serif CJK SC（fontconfig 提供，SemiBold 600、Black 900、Regular 400）。渲染前用 `document.fonts.load("600 52px 'Noto Serif CJK SC'", "实际要用的字")` 加载，并把 `document.fonts.check` 的结果写进 meta（`fontsOk: true`）。字体没加载完就画，会回退成无衬线字体或豆腐块。

**F2. 逐字显影**：每个字单独 `fillText`，用 `Array.from` 按码点拆字，不会把字拆坏；用 `measureText` 算每个字的宽度，字间距是字号的 0.04 倍。每个字依次延迟 0.055 s，在 0.34 s 内从模糊 7 px 变清晰、从下方 11 px 升到原位；整句消失用时 0.38 s。

**F3. 在任何背景上都读得清**
- 字幕基线在 0.885H。浅色字加 `shadowBlur 16`，字后面再垫一块椭圆"墨晕"（rgba(10,14,34,0.34)，随字幕一起淡入淡出）。
- 水彩后期不画纸白边框，避免字幕落在白纸上。

**F4. 金色强调**：在字幕数据里用子串标注，比如 `gold: ["一页一页"]`，渲染时映射到对应的字。

**F5. 标题位置要靠计算**：结尾时月亮在画面约 0.2H 处。原本标题放在 0.17H，会压在月亮上；改到 0.585H，放在窗下的暗部。

**F6. 编码安全**：esbuild 加 `--charset=utf8`，HTML 写 `<meta charset="utf-8">`。**最后从 MP4 里解码抽帧，逐句核对 8 句字幕和结尾标题、印章、落款**（`verify_mp4.py`），而不是只看源 JPEG。

**F7.** 破折号"——"是两个全角字符，逐字显影时没有问题。

### G. 场景与镜头衔接（一镜到底）

**G1. 用关键帧加 Hermite 样条做一镜到底**
- 普通的 Catmull-Rom 在关键帧间隔不均匀时会过冲，所以用 Fritsch–Carlson 方法限制斜率。
- 方向用 yaw/pitch 插值，**不要插值 target 点**：从远目标（15 m 外的月亮）切到近目标（0.8 m 外的脸）时，插值 target 会导致转速不均匀。

**G2. 150° 大转身扫过一面空墙**
- **现象**：从窗外的星空转到她的脸，1.3 s 的转身里，画面有约 0.5 s 在扫一面空墙。
- **解决**：中间加一个关键帧（18.38 s），让镜头在转身时俯视书桌（她的手、书、月饼），然后再抬起到脸部。
- **下次预防**：大角度转向时，让"转"发生在俯视或仰视的状态下，或者让转向路径经过有内容的地方。

**G3. 转场都用"穿越"，不用剪切**：开场镜头从窗外倒拉、穿过窗户，窗框从画面四周包进来。全片没有剪辑，也没有换画风，满足"Mode 锁死、Look 不混搭"的要求。

**G4. 机位守在人物同一侧**：除了开场，镜头始终在她右侧（−x），不跳轴。

**G5. 月亮仰角从 19° 改成 12°**
- **现象**：从屋子深处往窗外看，窗楣的仰角只有约 19°，月亮会被挡住；灯笼绳也横穿过月亮。
- **解决**：用一个角度计算脚本，算出各机位下窗楣、窗台、人头、灯笼、月亮的仰角和方位角，再定下月亮方向 (0.1361, 0.2079, 0.9686)，也就是方位 8°、仰角 12°；月亮的角半径定为 0.068 rad。

### H. 角色与表演

**H1. 手臂像木偶的管子**：原本粗细均匀、颜色单一、高光很强。改法是变细（上臂半径 0.04、前臂 0.035），加肘部的球和袖口，毛衣换成淡紫色（#b9accb）并加针织纹理贴图。

**H2. 脸像白面具，头发像头盔**
- 肤色调暖（#f0c0a2）。
- 头发改成"后脑壳 + 前额帽 + 6 缕刘海 + 两侧鬓发 + 背后的弧面长发"，刘海缩短，不再挡眼睛。
- Phong 高光调低（原来在蓝色月光下会发紫）。
- 表情用 5 张 Canvas 画的贴图（focus、look、gaze、smile、blink），每次交叉淡化 0.1 s。关键台词"今晚换月亮照亮你"时，用"睁眼抬头 + 微笑"的 gaze 表情，比闭眼笑更有神。

**H3. 脸部镜头几乎是侧脸**：机位和她朝向的夹角有 63°，改到 40°–48°，成为 3/4 侧脸。

**H4. 伸懒腰从背后看像兔耳朵**：改成双臂分开的 V 字形，镜头也退远一些。

**H5. 握拳看不见**：右臂在阴影里。改用被背景纸灯照亮的左臂，拳头举到头顶的高度，和印章落在同一拍。

**H6. 前臂穿进桌面 3 cm（QC 探针发现的）**
- **现象**：inspect 报告 381/672 帧前臂和桌面穿插，最深约 3 cm；静帧里完全看不出来。
- **根因**：IK 的极向量让手肘沉到了桌沿以下。
- **解决**：解算后检查前臂和桌面/书页之间的间隙，不够就把极向量分 10 档逐步转向后外侧，取间隙最大的一个解。结果是 0 帧穿插。同时修正了 QC 里用的前臂半径（0.038 → 0.035，和模型一致）。

**H7. 工具包自己的坑**：模板里 `inspect()` 返回的字段叫 `pen`，而 `finalize.py` 读取的是 `penetration`，所以穿插检查会**永远通过**。自己写 inspect 时，字段名必须是 `penetration`。

### I. 文件体积与下载限制

**I1. CRF 18 的成片 29.2 MB，超过微信约 25 MB 的直发上限**（作为文件发送不受这个限制）
- **根因**：纸纹颗粒很吃码率（CRF 18 时约 8.3 Mbps）。
- **解决**：CRF 20 → 21.8 MB。和 CRF 18 逐帧比较，PSNR 最低 45.5 dB，肉眼看不出差别。
- **下次预防**：交付前先确认目标平台的体积上限，用 CRF 二分法逼近；水彩、颗粒类画面，码率预期在 6–8 Mbps。

### J. 流程层面

**J1. 静帧迭代的成本**：一共做了约 9 轮审阅，每轮 6–20 张全分辨率静帧加一张拼图。全分辨率静帧 4–5 s/张（含启动和首帧编译），半分辨率 1.6–1.9 s/张。**构图和运动用半分辨率看，质感用全分辨率局部裁切放大看。**

**J2. 裁切放大定位问题**：花瓣的方框、脸上的横条，都是裁切放大之后才看清的，比看整张图快得多。

**J3. 用户说"直接开始"时，不要追问**：工具包要求开工前用 AskUserQuestion 问画风。这次用户明确说"请直接开始制作"，就按工具包的选型表（抒情、节日（中秋）→ watercolor）直接定了。

---

## 二、注意事项清单

### 开工前

- [ ] 写清送给谁、什么场合、看完应该是什么情绪、有哪些禁区，并把**每一条禁区**写进 brief（这次包括：家庭相关的字词和隐喻、倒计时、数字、比较、知识点）
- [ ] 锁定 Mode（连续 3D / 平面 2D）和**唯一的 Look**，写进文档，全程不改
- [ ] 定好时长 × 帧率 × BPM：一小节的长度要能装下一句字幕（这次是 80 BPM、3.0 s、24 fps、72 帧）
- [ ] 定好输出分辨率和交付平台的体积上限（微信直发约 25 MB）
- [ ] 确认有没有旁白、TTS 从哪来，以及字幕语言和字体（`fc-list :lang=zh` 查字体）
- [ ] 检查环境：node / npm / python / numpy / scipy / Pillow / ffmpeg / Chromium 路径、有没有 GPU、有几个 CPU
- [ ] 渲 2–3 帧测速度，估算全片渲染时间
- [ ] 确认素材来源（默认全部程序化）和字体许可
- [ ] 读完工具包的 SKILL.md，以及和本片相关的 references

### 制作中

- [ ] 所有时间都写在 `timeline.ts` 里、用秒表示，画面和声音只从这里取
- [ ] 每次改完都跑 `npm run -s build && npx tsc -p .`，再渲 1 帧并 `grep "page errors"`
- [ ] 新增的透明、精灵、粒子、远景物体都要标 `noOutline`；场景建完调用 `indexNoOutline(scene)`
- [ ] 摆场景前，先算关键物体在关键机位下的仰角和方位角
- [ ] 每一轮都出关键帧拼图；每 2–3 轮出一次半分辨率全片抽帧（6 fps，带时间标注）
- [ ] 必看这几帧：最暗帧、最亮帧、人物特写、主发光体最亮的时刻、字幕区域的背景
- [ ] 检查字幕：字体是否加载成功、最长一句的宽度、金色强调、在最亮和最暗背景上是否都能读
- [ ] 检查人物：手、臂、脸与桌面/书页的接触，镜头与人头之间的距离（跑 inspect）
- [ ] 检查音频：旋律包络（有没有呼吸）、各分轨 RMS（动态弧线）、八度频带平衡、静音窗、卡点表
- [ ] 渲染页预留调试开关：`hide=对象名`、`nomoonshadow=1`

### 导出前

- [ ] 改过时间轴的话，按顺序重导 `meta.json` → 重新合成音频 → 重跑 inspect
- [ ] 全片渲染放后台（nohup）、支持断点续渲；渲染期间不跑重任务
- [ ] 确认帧齐全，且每帧都大于 1 KB
- [ ] 确认音频时长等于画面时长，限幅留出余量（−2.6 dBTP）

### 交付前

- [ ] finalize 的 13 项 QC 全部通过：帧、音画时长、编码、faststart、全片解码、冻帧、黑帧、响度、穿插、接触、步进
- [ ] 从 MP4 解码抽帧，逐句核对字幕（不看源帧）
- [ ] 核对音画卡点：每个冲击帧和对应音效的时间
- [ ] 体积不超过平台上限，否则调 CRF，并做 PSNR 对比
- [ ] 再确认一遍文件名、时长、编码（H.264 High + AAC-LC）
- [ ] 如实写出局限（比如没有人耳试听），不写"全部完美"

---

## 三、创作思路

### 1. 需求如何拆成叙事结构

**第一步：先写两句话，把需求翻译成一个故事。**

- 情绪句：看完学姐应该感到**被看见、被托住、有劲儿**，因为**她每一页、每一晚的光都被点亮、被接住，最后变成照亮她的月光**。
- 戏剧句：她想考上法学研究生，但时间紧、跨专业自学很累；于是（只有这个媒介能做到的）每翻一页就放出一粒光——光点亮窗外的灯笼、连成一架天平、汇成满月——月亮变圆变亮，光照回她身上，留下笑意和勇气。

**第二步：把用户给的三段式情绪弧线，展开成 9 小节。** 一小节 = 一句字幕 = 一个动作 = 3.0 s。

| 小节 | 时间 | 情绪功能 | 字幕 | 镜头 | 核心动作 | 声音 |
|---|---|---|---|---|---|---|
| 1 | 0–3 | 世界：安静，被看见 | 今晚月亮很圆，/ 你的台灯也还亮着。 | 窗外月前倒拉，穿过窗户到她身后 | 月亮半隐在云后，灯笼还没亮 | 蟋蟀、夜风、稀疏的古筝，穿窗的风声 |
| 2 | 3–6 | 承认难，不怜悯 | 这几个月会很难，/ 但你一直在认真走。 | 移到她右肩后方 | 写字；社会学概论垫在一摞法学书最下面 | 箫声进入，笔尖的沙沙声 |
| 3 | 6–9 | 把焦虑翻译成节奏 | 不急——一页一页，/ 一晚一晚。 | 低机位从她右侧越过书页 | 亲手翻两页，风再翻四页，每页放出一粒光 | 翻页声、光点的钟声、一阵风 |
| 4 | 9–12 | 积累被"数"到 | 每个认真的夜晚，/ 都算数。 | 她身后，看向窗外 | 六盏灯笼依次点亮，她抬头 | 八分音符上行钟音 + 点火声 |
| 5 | 12–15 | 她的心意与社会 | 你想让世界更公平、/ 更温柔一点， | 推到窗边、仰拍 | 光球升空，连成一架**倾斜**的星光天平 | 星点叮声，连线时的微光声 |
| 6 | 15–18 | 转折：心意就是力量 | 这份心，/ 本身就是力量。 | 窗边缓移 | 天平在第 3 拍**持平**；光流向月亮，月亮变满 | 钟声双音，渐强的微光 |
| 7 | 18–21 | 反转：被照亮的人 | 你照亮过很多人，/ 今晚换月亮照亮你。 | 俯视书桌转身，到她的 3/4 侧脸 | 月光涌上她的脸，桂花飘进屋，抬头微笑 | 最高音 C6 落在"照亮你" |
| 8 | 21–24 | 放松与肯定 | 你在争取的未来，/ 你配得上。 | 升到她身后 | 放下笔，伸懒腰；星点围成一个圆 | 23.52–23.78 s 全部静音 |
| 9 | 24–28 | 祝福与勇气 | **学姐，中秋快乐！** + 「加油」印章 + 丙午中秋 · 赠学姐 | 她身后，缓慢推向满月 | 满天灯笼升起，握拳，印章落下 | 刮奏落拍，手鼓、沙锤，终止和弦 |

**第三步：首尾押韵。** 开场是一盏台灯、半隐的月亮、没点亮的灯笼；结尾是满月、全部灯笼、满天天灯、一圈星光。对应**暗→亮、空→满、一盏→全部**。

**第四步：用规则守住禁区。**
- 不写"团圆"，用"月圆、圆满、光汇成圆"来表达团圆感。
- 画面上没有日历、时钟、数字。
- 法学只出现三次：书脊上的书名、星座天平、印章。

### 2. 各段落的设计意图

- **开场倒拉**：镜头从月亮出发，一路"来到她身边"，先有"被看见"，再看见她。这是一镜到底里最有仪式感的一个动作，窗框从画面四周包进来，本身就是转场。
- **第一句台词的选择**：「你的台灯也还亮着」——只陈述看到的事实，不评价、不说"辛苦了"，懂她的人才会注意到这个细节。
- **过肩镜头 + 书堆**：一摞法学书压在《社会学概论》上，是给她的一个安静的"我看见你跨专业"的彩蛋，没有任何解释。
- **翻页变成光**：把"焦虑"转译成"积累"——每一页都不白费，被物化成一粒光。第一、二页是她亲手翻的（主体性），后四页是风翻的（时间在帮你）。
- **灯笼按节拍点亮**：把"都算数"做成可以看见、也可以听见的计数，但全片不出现任何数字。
- **天平从倾斜到持平**：法学最轻的一次出场，只有一个符号，没有知识点。"不平 → 平"正好对应"让世界更公平"。
- **月亮变满**：用"圆满"替代"团圆"，而且月亮是由她放出的光汇满的。
- **"今晚换月亮照亮你"**：全片的情感反转点——一直在照亮别人的人被照亮。这里给唯一一个正脸 3/4 近景，表情是睁眼抬头加微笑，背景有一盏暖色纸灯，冷月光和暖灯光同时落在她身上。
- **伸懒腰**：身体上的"卸力"，是焦虑的释放。
- **星点围成圆**：视觉上的"圆"，为结尾的满月做铺垫。
- **静音 + 刮奏 + 标题**：留白 0.26 s，让观众屏息，然后古筝刮奏把人"推"进结尾。
- **印章「加油」**：中国画的落款印章，形式上也像一个"盖章生效"的小法律玩笑。它和她的握拳落在同一拍，结尾因此是轻快的，而不是沉重的。
- **落款「丙午中秋 · 赠学姐」**：像一幅画的题款，把整部片子收成一件"礼物"。

### 3. 用到的节奏、剪辑与音画技巧

1. **一小节一句一动作**：每 3 秒只讲一件事，信息密度高但不乱；每一句都有多层运动同时在动（镜头、人物、环境粒子、事件、逐字显影），做到"短而满"。
2. **动机驱动的运镜**：倒拉揭示、过肩、跟着光转、俯视转身、升起收尾；没有匀速环绕，也没有无动机的变焦（工具包的导演规则）。
3. **一镜到底的 C1 连续**：Hermite 样条保证速度不突变，转场全部靠空间穿越完成。
4. **声音先于画面**：窗前风声提前起，刮奏在标题之前 0.22 s 开始，观众会感觉画面是被声音"拉"过去的。
5. **静音是标点**：音乐停 0.26 s，只剩夜风和虫鸣，下一拍的祝福就显得格外亮。
6. **冲击对齐**：灯笼点亮 = 八分音符，天平持平 = 第 3 拍，标题 = 强拍，印章 = 握拳顶点 = "咚"。
7. **旋律轮廓跟着台词走**：第 4 小节旋律上行到 A5（灯笼亮起），第 7 小节到最高音 C6（照亮你），第 9 小节解决到 C6 主音。
8. **动态弧线**：音乐从 −25 dB 一路推到 −14 dB；画面亮度也同步提升（曝光 1.08 → 1.30，暖色提亮 lift 0 → 0.85）。
9. **冷暖对比**：冷的月光和暖的台灯、纸灯、灯笼贯穿全片，结尾暖色占上风。
10. **文字的运动也是剪辑**：逐字显影（0.055 s 一个字）让读字的节奏和画面动作一起走；关键词用灯笼金色。

---

## 四、具体的创作方式

### 1. 技术栈与整体工作流

**技术栈（全部离线、确定性）**
- **3D 与渲染**：Three.js ^0.186、esbuild ^0.28、TypeScript ^7；headless Chromium（Playwright-core ^1.56）+ SwiftShader
- **管线骨架**：用户提供的 `stop-motion-3d` 工具包。复用了它的 `capture.mjs`（帧契约和断点续渲）、`post.ts`（G-buffer、全屏 pass、GLSL 公共库）、`rng.ts`、纸纹纹理、`contact_sheet.py`、`finalize.py`（封装和 QC）、`audio.py`（DSP 工具：混响、限幅器、响度测量、whoosh）
- **参考**：`motion-library-atlas` 工具包里关于节奏、布局安全、统一时间、定格的知识条目
- **音频**：Python 3.11 + numpy 2.4 + scipy 1.17，自己写的 `score.py`
- **封装与检查**：ffmpeg 6.1.1、ffprobe、Pillow 12.2
- **字体**：系统 Noto Serif CJK SC / Noto Sans CJK SC
- **机器**：2 vCPU / 7 GB 内存 / 无 GPU

**完整工作流**

```
需求 → 读工具包 → 测速度 → story lock（brief.md）
  → timeline.ts（字幕、机位、事件、表演，全部用秒）
  → 布景 / 人物 / 画风 / 字幕代码
  → build + tsc → 渲 1 帧看 page errors
  → 关键帧静帧 + 拼图（迭代 5 轮）
  → 半分辨率 6 fps 全片抽帧拼图（审运动和转场）
  → meta.json → score.py 合成音频（包络、RMS、频谱检查）
  → inspect QC 探针（穿插为 0）
  → 全片渲染（后台、可续渲）
  → finalize（封装 + 13 项 QC）
  → 从 MP4 解码抽帧核对字幕 → 修卡点 → 局部重渲 → 再 finalize
  → 按平台压体积（CRF 20 + PSNR 对比）→ 交付
```

### 2. 项目结构与关键代码

```
moonfilm/
├─ docs/brief.md            # story lock：Mode / Look / 情绪句 / 戏剧句 / 禁区 / 分拍表
├─ src/
│  ├─ timeline.ts           # 唯一时间源：字幕、机位关键帧、事件、表演、静音窗
│  ├─ layout.ts             # 布景尺寸（米）：房间、窗、书桌、书、月亮方向、灯笼绳、星座平面
│  ├─ cam/path.ts           # 一镜到底：Hermite 样条（位置、fov）+ yaw/pitch 样条 + 微呼吸
│  ├─ core/post.ts          # 来自工具包：G-buffer、fsPass、GLSL_COMMON、indexNoOutline
│  ├─ core/tex.ts           # 程序化纹理：纸纹、光晕、脸（5 种表情）、书脊、月饼、灯笼纸、桂花、针织、远景 4 层
│  ├─ core/anim.ts          # 缓动、关键帧轨道、Catmull-Rom 路径、确定性哈希
│  ├─ look/moonwash.ts      # 唯一画风：材质库 + 水彩后期（bloom 链 + 12 步合成）
│  ├─ world/sky.ts          # 天空穹顶着色器：渐变、云、星、月盘、日冕、云纱
│  ├─ world/room.ts         # 房间、开窗、窗帘、书桌、台灯、可翻页的书、书堆、茶和月饼、纸灯
│  ├─ world/outside.ts      # 远景层、桂花树、灯笼绳、光点、星座和天平、光流、天灯、桂花瓣
│  ├─ world/girl.ts         # 学姐：圆润图元、贴花表情、两骨 IK、前臂避桌、全部动作曲线
│  ├─ world/index.ts        # 组装、灯光、每帧 update(t)
│  ├─ mg/subtitles.ts       # 字幕逐字显影、标题、印章、落款（绘制在 2D 输出画布上）
│  └─ entry/film.ts         # 帧契约 window.film = {ready, frame, inspect, meta} + 调试开关
├─ audio/score.py           # 原创配乐 + 音效 + 环境声 + 母带
├─ scripts/capture.mjs      # 来自工具包：Playwright 串行出帧 / meta / inspect，支持续渲
├─ scripts/verify_mp4.py    # 从 MP4 解码抽帧核对字幕，打印流信息
├─ web/film.html            # #gl（plate 1600×900）+ #out（1920×1080）
└─ out/                     # frames/ audio/ qc/ meta.json final*.mp4
```

**（1）唯一时间源（节选）**

```ts
export const FPS = 24, DURATION = 28.0, TOTAL = Math.round(DURATION * FPS); // 672
export const BPM = 80, BAR = 3.0, BEAT = 0.75;
export const SUBS = [
  { id: "L4", bar: 4, out: 11.82, segs: [{ text: "每个认真的夜晚，", at: 9.12 },
                                          { text: "都算数。", at: 10.5, gold: ["都算数"] }] },
  // …共 8 句，每句落在小节线上
];
export const LANTERN_IGNITE = [9.375, 9.75, 10.125, 10.5, 10.875, 11.25]; // 八分音符
export const SCALE_LEVEL: [number, number] = [15.78, 16.5]; export const SCALE_CHIME = 16.5;
export const SILENCE: [number, number] = [23.52, 23.78];                  // 标题前的静音
export const SEAL = { text: "加油", at: 25.5 };                            // 冲击时刻 = 握拳顶点
export const CAMERA = [ { t: 0.0, pos: [-0.27, 1.55, 2.3], target: [1.11, 2.94, 12.1], fov: 44 }, /* …共 22 个关键帧 */ ];
```

**（2）帧契约：渲染是帧号的纯函数**

```ts
function render(f: number) {
  const t = f / TL.FPS;
  applyCamera(camera, sampleCamera(t), PLATE_W / PLATE_H);   // 一镜到底样条
  const st = world.update(t, camera);                         // 所有物体都是 t 的解析函数
  post.render(renderer, world.scene, camera,
    { exposure: st.exposure, bloom: st.bloom, lift: st.lift, t }, null); // 水彩后期
  g2.drawImage(glCanvas, 0, 0, OUT_W, OUT_H);                 // 1600×900 放大到 1080p
  drawMG(g2, OUT_W, OUT_H, t, { titleY: 0.585 });             // 字幕按 1080p 清晰绘制
}
window.film = { ready, frame: async (f) => (render(f), outCanvas.toDataURL("image/jpeg", 0.95)),
                inspect: async (f) => inspect(f), meta: async () => meta() };
```

**（3）一镜到底：Hermite 样条 + Fritsch–Carlson 限制斜率 + yaw/pitch 插值方向**

```ts
function build(ts: number[], vs: number[], tension = 0.9) {
  const m = new Array(ts.length).fill(0);                     // 两端速度为 0：缓入缓出
  for (let i = 1; i < ts.length - 1; i++) {
    const s0 = (vs[i] - vs[i-1]) / (ts[i] - ts[i-1]), s1 = (vs[i+1] - vs[i]) / (ts[i+1] - ts[i]);
    m[i] = s0 * s1 <= 0 ? 0 : ((s0 + s1) / 2) * tension;       // 折返处斜率为 0，防过冲
    const lim = 3 * Math.min(Math.abs(s0), Math.abs(s1));
    if (Math.abs(m[i]) > lim) m[i] = Math.sign(m[i]) * lim;
  }
  return { t: ts, v: vs, m };
}
// 方向：每个关键帧先转成 yaw = atan2(dx,dz)、pitch = atan2(dy, hypot(dx,dz))，yaw 做 ±2π 展开后再插值
```

**（4）两骨 IK + 前臂不穿桌面**

```ts
let sol = solveIK(shoulder, handTarget, pole);                 // 余弦定理求肘位置
let best = forearmClearance(sol.elbow, sol.end);                // 前臂胶囊到桌面或书页的最小间隙
if (best < 0.001) for (let k = 1; k <= 10; k++) {              // 把极向量逐步转向后外侧
  const p2 = pole.clone().normalize().lerp(V(side * 0.8, 0.15, -1).normalize(), k / 10);
  const cand = solveIK(shoulder, handTarget, p2);
  const c = forearmClearance(cand.elbow, cand.end);
  if (c > best) { best = c; sol = cand; }
  if (c >= 0.001) break;
}
```

**（5）QC 探针（不出像素，672 帧约 3 秒）**：手部接触间隙、前臂穿插、笔尖到纸面的距离、镜头是否进入碰撞盒、镜头到人头的距离、镜头到灯笼的距离。字段名和工具包的 finalize.py 对齐：`penetration`、`contacts[{mode:"surface"|"exact", gap, surface}]`、`poseT`、`shot`。

**（6）调试开关**：`film.html?...&hide=collar,hairLong&nomoonshadow=1`，一帧就能二分定位画面伪影。

### 3. 画风是怎么用代码实现的（月夜水彩，只有这一种）

工具包的原则是"**画风 = 整条管线**"，要同时作用到几何、着色、光照、屏幕空间和节奏五层。

| 层 | 做法 |
|---|---|
| 几何 | 圆润图元（球、胶囊、车削体），不做倒角；人物由约 40 个图元组成 |
| 着色 | MeshLambert 为主（头发用低高光的 Phong）；语义材质库 `MatLib.get("wood" / "cover:#hex" / "lampShadeIn" …)`，场景代码只说"是什么"，画风决定"长什么样" |
| 光照 | 冷色月光方向光（强度 0.75→2.0，关键台词时再加 0.9 的高斯脉冲，2048 阴影贴图）；台灯 SpotLight 0.62；暖色补光 0.2；背景纸灯 0.5→1.3；灯笼外溢光（随点亮的灯笼数量和结尾增加）；靛蓝半球光 0.55→1.15 |
| 天空 | 穹顶 ShaderMaterial 按视线方向计算：分层渐变、平面投影 fbm 云、110×110 网格哈希出的水粉点星、月盘加月海噪声加边缘变暗、日冕加大范围辉光、横穿月亮的云纱（`uVeil` 1→0.1）；穹顶跟随相机移动，并打上 noOutline |
| 远景 | Canvas 画 4 层剪影（带月光亮边和脚部雾气），贴在 4 个不同半径的圆柱内壁上，打 noOutline |
| 屏幕空间后期 | 见下方代码：bloom 链 + 12 步水彩合成 |
| 节奏 | Mode A，连续 24 fps，人物动作不步进；纸纹固定在画面空间（像画在纸上），不随帧变化 |

**后期 pass 顺序**
1. 颜色 pass：MSAA4、HalfFloat、线性 HDR。
2. 法线+深度 pass：隐藏 noOutline 物体。
3. bright pass：降采样到 1/4，阈值 1.25。
4. 可分离高斯模糊。
5. 再降到 1/8 做大范围辉光，模糊两遍。
6. 最终合成，12 步：

```glsl
vec2 w = (vec2(fbm(vUv*4.7), fbm(vUv*4.7+7.1)) - .5) * 7.5 * px;          // 1 颜料漂移
vec3 c0 = samp(vUv + w); /* 6 个 4.6px 采样取平均 */ c = mix(c0, m, .62); // 2 晕染
c *= mix(1., softStep(L, 6.) / max(L,.004), sky ? .25 : .55);              // 3 明度软量化（一层层罩色）
c = mix(c, c*c*.88, clamp(length(c0-m)*3.6,0.,1.) * (sky ? .25 : .7));    // 4 色块交界积色
c *= .93 + .12 * fbm(vUv*vec2(3.1,2.4)+11.3);                             // 5 颜料不均 + 湿画色偏
c = 1. - (1. - c) * (1. - toSRGB(aces(bloom*.7)));                        // 6 湿画辉光（滤色叠加）
c *= mix(1., .76 + .36*gran, smoothstep(.8, .1, l));                      // 7 暗部颗粒
c = floorC + c * (paper - floorC);                                        // 8 冷压纸；最暗是深靛蓝而不是纯黑
if (!sky) c = mix(c, vec3(.15,.14,.24), edgeDN(...) * .36);               // 9 靛蓝铅笔底稿
c = mix(c, paper*vec3(1.,.985,.95), smoothstep(.87,1.,luma(c)) * .5);    // 10 最亮处留白成纸色
c = mix(c, c*vec3(1.06,1.03,.96) + vec3(.02,.015,0.), uLift);             // 11 结尾暖色提亮
c *= 1. - .34*pow(clamp(length(q*vec2(1.05,1.25))*1.25,0.,1.),2.4);      // 12 只压暗角落，不画纸边
```

**字幕、标题、印章**：画在 2D 输出画布上，不经过水彩后期，所以文字始终清晰。
- 字幕：600 字重，54 px。
- 标题：900 字重，116 px；每个字从 1.28 倍缩放、模糊 14 px 落定，带回弹，落定时身后有一团暖色光晕。
- 印章：离屏 Canvas 画一枚红色圆角方章，挖出白色的"加/油"，用 `destination-out` 做出石纹和毛边；从 1.9 倍砸到 1.0 倍，带一圈扩散的冲击环。
- 落款：400 字重，30 px，字间加细空格。

### 4. 音频是怎么做的

**编曲**：80 BPM，C 宫五声为主。和弦进行是 Cadd9 – Am7 – Fmaj7 – Gsus2 – Em7 – Am7 – Fmaj7 – G – Cadd9，最后 1 s 是尾声。

| 声部 | 合成方法 | 用法 |
|---|---|---|
| 古筝 | 加法合成 10 个泛音，每个泛音单独衰减；0.35‰×k² 的非谐性；2 ms 拨弦瞬态；可选按音推弦（+2 半音）和吟揉（5.6 Hz） | 第 1 小节稀疏；第 2–4 小节 5 个音；第 5–7 小节八分琶音；第 9 小节 14 音刮奏，之后是明亮的八分音符 |
| 箫/笛 | 连续相位的连音线：45 ms 滑音、吐音时振幅下陷、长音渐强渐弱、延迟 0.3 s 的 5.15 Hz 颤音、气声噪声、少量笛膜嗡声；**按乐句换气** | 第 2 小节起主旋律 |
| Pad | 3 个失谐声部 × 6 个泛音，低通 1.6–2.6 kHz，逐小节增益 0.36→1.1 | 贯穿全片的和声底 |
| 贝斯 | 正弦加二次谐波 | 第 5 小节起加入 |
| 钟 | FM 钟（调制比 3.5）加 2.76 倍泛音 | 灯笼、星点、天平、标题 |
| 手鼓和沙锤 | 扫频正弦 + 带通噪声，以及高通噪声 | 第 8 小节轻轻铺垫，第 9 小节表现欢快 |

**音效**（全部由 meta 的 cue 派生）：穿窗的风声（1.0 s 起，提前于画面）、笔尖沙沙声（2.3–6.4 s，淡入）、手翻页 ×2、风翻页 ×4 加一阵风、光点飞出、灯笼点火 ×6、星点升空、连线微光、光流微光、月光涌入（提前 1.2 s 起）、笔放下、伸懒腰时的布料声、星点汇成圆、天灯的风声、印章的"咚"加闪光、落款的笔刷声、桂花落下的叮声。

**环境声**：布朗噪声低频底 + 带通空气声，两路；3 只蟋蟀（3.9、4.35、5.1 kHz，每声 3 个脉冲），随时间逐渐变弱。

**卡点与静音**：pre/post 两条总线各自加卷积混响（0.24、2.2 s）；pre 在 23.52 s 硬切到 0；post 从 23.78 s 的刮奏开始。

**母带**
1. 首尾淡入淡出：开头 0.12 s，结尾 0.9 s，用 1.6 次幂曲线。
2. 各分轨增益：音乐 0.62、音效 0.55（加 1.2 s 混响 0.12）、环境 0.5。
3. 母带 EQ（见坑 E6）。
4. 用 ffmpeg loudnorm 测量，线性增益拉到 −16 LUFS。
5. 4 倍过采样前瞻限幅器，−2.6 dBTP（用的是工具包的 `limiter`）。
6. 复测，并写出 `loudness.json`。

音频合成全程约 9 s。

### 5. 渲染与导出的命令和参数

```bash
# 0) 建工程（复制工具包模板并 npm install）
python3 kits/stop-motion-3d/stop-motion-3d/scripts/init_project.py moonfilm --title moonfilm --install
# 1) 构建（保留中文）+ 类型检查
npm run -s build   # esbuild src/entry/film.ts --bundle --format=esm --charset=utf8 --outfile=web/dist/film.js
npx tsc -p .
# 2) 页面参数：输出分辨率 w/h，3D plate 分辨率 pw/ph
PAGE="film.html?w=1920&h=1080&pw=1600&ph=900"
# 3) 静帧 / 半分辨率预览 / 导出 meta / QC 探针
node scripts/capture.mjs --page "$PAGE" --frames 0,84,132,262,475,660 --out out/stills
node scripts/capture.mjs --page "film.html?w=960&h=540&pw=800&ph=450" --frames 0,4,8,... --out out/preview
node scripts/capture.mjs --page "$PAGE" --meta --out out/meta.json
node scripts/capture.mjs --page "$PAGE" --inspect 0:672 --out out/qc/inspect.json
python3 kits/.../contact_sheet.py out/stills out/qc/board.jpg --columns 3 --width 2400
# 4) 音频
python3 audio/score.py --meta out/meta.json --out out/audio
# 5) 全片渲染（后台、可续渲；局部重渲时加 --range a:b --force）
nohup node scripts/capture.mjs --page "$PAGE" --range 0:672 --out out/frames > out/logs/render.log 2>&1 &
# 6) 封装 + 13 项 QC（CRF 20 是为了微信体积）
python3 kits/.../finalize.py . --frames out/frames --audio out/audio/mix.wav \
  --out out/final_crf20.mp4 --meta out/meta.json --inspect out/qc/inspect.json --crf 20
# 7) 独立校验：从 MP4 解码抽帧核对字幕 + PSNR 对比
python3 scripts/verify_mp4.py out/final_crf20.mp4
ffmpeg -i out/final_crf20.mp4 -i out/final.mp4 -lavfi "[0:v][1:v]psnr=stats_file=-" -f null -
```

**finalize 内部的 ffmpeg 参数**（重点：浏览器导出的 JPEG 是 full range，必须转成 limited range，并把 BT.709 写进码流）：

```bash
ffmpeg -framerate 24 -i out/frames/f%05d.jpg -i out/audio/mix.wav \
  -vf scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p \
  -c:v libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 \
  -r 24 -fps_mode cfr -g 48 -c:a aac -b:a 192k -ar 48000 -t 28.000 -movflags +faststart out/final_crf20.mp4
```

**13 项 QC**：帧齐全、音画等长、封装成功、流参数（h264 / yuv420p / 672 帧 / 24 fps / tv / bt709×3 / 有音轨）、faststart（moov 在 mdat 前）、`-xerror` 全片解码、freezedetect（0.4 s）、blackdetect、MP4 内 AAC 响度（−18~−13 LUFS 且 TP ≤ −1.0）、穿插为 0、接触深度、精确接触误差、步进节奏。

### 6. 时间分配、瓶颈与提速

| 环节 | 用时 | 占比 |
|---|---|---|
| 读工具包、测环境、测速度 | 7 min | 5% |
| 故事定稿（brief） | 10 min | 7% |
| 首版代码 | 约 24 min | 16% |
| 静帧迭代与修图（约 9 轮） | 约 30 min | 21% |
| 音频（3 版） | 约 8 min（与其他工作交叉） | 5% |
| **全片渲染** | **55 min** | **38%** |
| 封装、QC、校验、修卡点、压体积 | 11 min | 8% |

**最耗时的环节和提速办法**
1. **全片渲染**（每帧约 0.8 s 固定开销 + 约 4.1 s 像素开销）。
   - 把 plate 降到 1280×720（水彩本身就软，放大到 1080p 几乎看不出差别），预计 -30%。
   - 后期采样数 7→5，阴影贴图 2048→1024。
   - 有 GPU 时去掉 SwiftShader 参数，工具包文档写的是可快一个数量级（这次没有 GPU，未能验证）。
   - 灯光数量全片保持不变，避免材质重新编译。
2. **静帧迭代**：构图和运动一律用半分辨率；每次只渲有改动的镜头段；用裁切放大看细节，不要反复渲全分辨率大图。
3. **一次改对**：摆场景前先写角度计算脚本；开场第一帧、最亮帧、人物特写这些高风险画面先做专项测试。

---

## 五、可复用的模板

### 模板 A：代码视频制作流程（照着勾）

```text
【0 立项｜10–20 min】
  □ 需求 → 情绪句「看完应该感到 __，因为 __ 变了」+ 戏剧句「主角想 __，但 __，于是（媒介独有的动作）__，导致 __，留下 __」
  □ 禁区清单（逐条写进 brief，之后每句台词都要自查）
  □ Mode（连续 3D / 平面 2D）+ 唯一 Look，写进 docs/brief.md
  □ 时长 T、帧率 F、BPM：小节长 = 60/BPM×4；句数 ≈ T / 小节长；总帧数 = round(T×F)
  □ 交付规格：分辨率、H.264 + AAC、体积上限（微信约 25 MB）、有无旁白、字幕字体

【1 环境与测速｜5–10 min】
  □ node / python / numpy / scipy / Pillow / ffmpeg / Chromium / 字体（fc-list :lang=zh）
  □ 用模板渲 2–3 帧，记录 s/帧，估算全片渲染时间
  □ 素材策略：默认全部程序化（Canvas 纹理 + numpy 声音）

【2 数据先行｜15–30 min】
  □ timeline.ts：SUBS（每句落在小节线上）、CAMERA 关键帧、事件 cue（定义为冲击时刻）、ACT 表演、SILENCE
  □ layout.ts：场景尺寸；写 angle_check.py，算出关键物体在关键机位下的仰角和方位角
  □ 分拍表：小节 | 时间 | 字幕 | 镜头 | 动作 | 声音

【3 搭建｜20–40 min】
  □ 场景 / 人物 / 画风 / 字幕 / 帧契约（frame、inspect、meta）+ 调试开关（hide、关阴影）
  □ build + tsc + 渲 1 帧 + grep "page errors"
  □ indexNoOutline(scene)；透明、精灵、粒子、远景都打 noOutline

【4 迭代｜30–60 min】
  □ 每轮：关键帧静帧 → contact sheet → 问题清单 → 修 → 再渲（只渲有改动的段）
  □ 每 2–3 轮：半分辨率 6 fps 全片抽帧，带时间标注拼图，看运动和转场
  □ 必看：开场第一帧、最亮帧、最暗帧、人物特写、结尾帧、字幕压在最亮和最暗背景上时

【5 声音｜10–20 min】
  □ 导出 meta.json → score.py（从 cue 派生）
  □ 检查：旋律包络（有没有呼吸）、各分轨 RMS（动态弧线）、八度频带平衡、静音窗、点缀音效是否在和弦内
  □ 母带：EQ → 线性增益到 −16 LUFS → 限幅到 −2.6 dBTP

【6 渲染前闸门】
  □ inspect：穿插为 0、镜头不进入任何物体
  □ meta、音频、代码是同一版本

【7 全片渲染】 nohup + 断点续渲；渲染期间不跑重任务；定期看 log

【8 封装与 QC】 finalize.py（13 项）→ verify_mp4.py（解码抽帧核对字幕）→ 核对卡点
  □ 有问题就局部重渲（--range a:b --force）+ 接缝检查（相邻帧平均像素差）

【9 交付】 按体积调 CRF + 做 PSNR 对比 → 命名 → 发送 → 一句话说明 Mode / Look → 如实写局限
```

### 模板 B：给 AI 的开工提示词

```text
请用代码制作一条 {时长，例如 18–30} 秒的视频。

【送给谁 / 场合】{对象、关系、场合、今天的日期或节日}
【核心目标】{看完的情绪，例如：被看见、被鼓励、有动力；结尾偏 {快乐轻盈 / 温暖 / 燃}}
【人物气质】{只用来把握语气，可以写"禁止出现在画面里"}
【叙事弧线】1. {开场：承认什么} 2. {中段：把 {焦虑 / 问题} 翻译成 {可承受的节奏}} 3. {收束：祝福 + 行动号召}
【必须出现的意象】{例如：圆月、灯笼、桂花、温柔的夜色}（不要堆砌口号）
【禁区】{逐条列出：禁止的字词、隐喻、画面、知识讲解、恐吓式倒计时、比较……}
【风格锁定】Mode：{A 真连续 3D 一镜到底 / B 纯平面 2D}，二选一锁死；Look：{唯一画风，或者让你按工具包选型表来选}，全片不混搭。
【字幕】{中文 / 双语}，字体 {例如 Noto Serif CJK SC}，每句落在音乐小节线上，逐字显影，必须 UTF-8，不许乱码。
【声音】{有 / 无}旁白；原创配乐，风格 {例如：五声、古筝 + 箫 + 钟}，{BPM}；关键动作要卡点；高潮前留静音。
【交付规格】{1920×1080}、{24} fps、H.264 High + AAC、BT.709；体积 ≤ {25 MB}（{微信}直发）；文件名 {…}。

【工作方式（请照做）】
1. 先读我给的工具包（SKILL.md 和相关 references），测一帧耗时并估算渲染时间。
2. 先写 story lock：情绪句、戏剧句、禁区自查、分拍表（小节 | 时间 | 字幕 | 镜头 | 动作 | 声音）。
3. 把所有时间写进唯一的 timeline 文件；cue 定义为冲击时刻；渲染必须是帧号的纯函数。
4. 摆场景前，先算关键物体在关键机位下的仰角和方位角。
5. 每轮迭代都出关键帧拼图；定期做半分辨率全片抽帧预览；用 QC 探针检查穿插。
6. 配乐从 timeline 的 cue 派生；检查包络、动态、频谱和静音窗；响度 −16 LUFS，真峰值 ≤ −2.6 dBTP。
7. 后台全片渲染，支持断点续渲；用工具包的 finalize 做封装和全部 QC；从 MP4 解码抽帧核对字幕和卡点。
8. 按体积上限调 CRF，并用 PSNR 证明画质没有明显损失。
9. 交付时附一句 Mode / Look 说明，并如实写出没能验证的部分（例如没有人耳试听）。
直接开始，不要先问我问题；遇到不可逆且两边都合理的决定时再停下来。
```

---

*本文所有数据来自这次项目的日志和 QC 报告：`out/logs/render.log`、`out/qc/qc-report.json`、`out/audio/loudness.json`、`out/manifest.json`，以及制作过程中的静帧和拼图。*
````

### 6/56 · `moonfilm/package-lock.json`
<!-- casebook-file {"path": "moonfilm/package-lock.json", "lines": 954, "final_newline": true, "sha256": "3c0d50057d67dd451763e6dd10e51c13797cfc40e37048d1d1784df653ac63ef", "original_sha256": "3c0d50057d67dd451763e6dd10e51c13797cfc40e37048d1d1784df653ac63ef"} -->
```json
{
  "name": "moonfilm",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "moonfilm",
      "dependencies": {
        "three": "^0.186.0"
      },
      "devDependencies": {
        "@types/three": "^0.186.0",
        "esbuild": "^0.28.2",
        "playwright-core": "^1.56.0",
        "typescript": "^7.0.2"
      }
    },
    "node_modules/@dimforge/rapier3d-compat": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/@dimforge/rapier3d-compat/-/rapier3d-compat-0.12.0.tgz",
      "integrity": "sha512-uekIGetywIgopfD97oDL5PfeezkFpNhwlzlaEYNOA0N6ghdsOvh/HYjSMek5Q2O1PYvRSDFcqFVJl4r4ZBwOow==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@tweenjs/tween.js": {
      "version": "23.1.3",
      "resolved": "https://registry.npmjs.org/@tweenjs/tween.js/-/tween.js-23.1.3.tgz",
      "integrity": "sha512-vJmvvwFxYuGnF2axRtPYocag6Clbb5YS7kLL+SO/TeVFzHqDIWrNKYtcsPMibjDx9O+bu+psAy9NKfWklassUA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/stats.js": {
      "version": "0.17.4",
      "resolved": "https://registry.npmjs.org/@types/stats.js/-/stats.js-0.17.4.tgz",
      "integrity": "sha512-jIBvWWShCvlBqBNIZt0KAshWpvSjhkwkEu4ZUcASoAvhmrgAUI2t1dXrjSL4xXVLB4FznPrIsX3nKXFl/Dt4vA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/three": {
      "version": "0.186.0",
      "resolved": "https://registry.npmjs.org/@types/three/-/three-0.186.0.tgz",
      "integrity": "sha512-mxYSBpDC+D0pLfSP6sW4WZTcT+nrtmZcimMqnVmy36Hte3XpeYSrvgg4TRdaM1GemGog1AWzI5qL2VoIfMXbJQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@dimforge/rapier3d-compat": "~0.12.0",
        "@tweenjs/tween.js": "~23.1.3",
        "@types/stats.js": "*",
        "@types/webxr": ">=0.5.17",
        "fflate": "~0.8.3",
        "meshoptimizer": "~1.1.1"
      }
    },
    "node_modules/@types/webxr": {
      "version": "0.5.24",
      "resolved": "https://registry.npmjs.org/@types/webxr/-/webxr-0.5.24.tgz",
      "integrity": "sha512-h8fgEd/DpoS9CBrjEQXR+dIDraopAEfu4wYVNY2tEPwk60stPWhvZMf4Foo5FakuQ7HFZoa8WceaWFervK2Ovg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@typescript/typescript-aix-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-aix-ppc64/-/typescript-aix-ppc64-7.0.2.tgz",
      "integrity": "sha512-MTKKkWB7p/0E9xi1d1tHtZ5PiLkGEMIq88pK2CubZjOsLtYTLqhgIgi6zepFa+9GHZ6h05NMCkQxGKiPXMxXtQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-arm64/-/typescript-darwin-arm64-7.0.2.tgz",
      "integrity": "sha512-gowzar9MwS/aRWp6f3a4KUqzRjAZjOsmGNCM6LcTgXum+dBfgsBVMN+AgvOCCbguXyick6LJhpBszxMebJ8syA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-x64/-/typescript-darwin-x64-7.0.2.tgz",
      "integrity": "sha512-SZ9xZInqApNlNGc9s0W1VSsktYSOe9cFqNOIqmN1Gs8SmkjKZYFt017G4VwPxASInODuAdbTW7sXiFUf893RgA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-arm64/-/typescript-freebsd-arm64-7.0.2.tgz",
      "integrity": "sha512-W5NH4y/J0plIIS5b2xvTEkU7JFxyqdMAOgf+Ilhl0vHQXKO5dZoxd+C/jEtq56c4F3wk71RB4BMRQ2XdI+bwYQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-x64/-/typescript-freebsd-x64-7.0.2.tgz",
      "integrity": "sha512-UMGDx5sTpzNw3WiPebH7l90IWfJggEd+egHt/q6p7/Cm3zqoV7VxkGXt+3DxPIw8CcmvAB0j3sVVfbhX+M4Tpw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm/-/typescript-linux-arm-7.0.2.tgz",
      "integrity": "sha512-gffT3xPz9sR7j/YJExkyPntrI0P2EP9XbOyWzth2/Gs0RstK+90RBcO0ncXoXy/beYll1SXw846Nf2zdnEz0QQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm64/-/typescript-linux-arm64-7.0.2.tgz",
      "integrity": "sha512-Qh4eU4/y3yDjnfjjyPYihMj5/ODIlmt+Bzu17OI+fiSRDW57QmU5SiN63exPRNJPKUzcc1INa1NXdrJ+MqHjUQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-loong64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-loong64/-/typescript-linux-loong64-7.0.2.tgz",
      "integrity": "sha512-uEHck9i8hoAzXPiYRib1O7miOnz23SxIeVl6F4LXox+qov1K35jHcEW6VHKvZI+pyvl7fZEP4MCU5LYvIq1GuQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-mips64el": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-mips64el/-/typescript-linux-mips64el-7.0.2.tgz",
      "integrity": "sha512-R4KvAMnE43W5Qeqb0Ly56O3mWMWIAgsMyz36DCaycd5nbg/9kzm0liw3JocfRqyJY0KPmzFjbswozXyW0DnIYA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-ppc64/-/typescript-linux-ppc64-7.0.2.tgz",
      "integrity": "sha512-DORx5b3sd/4S7eayxm4FQv+A7CrkUIGRaHiwI8oiHTAI1fAPWhF4J0vAlkC8biAlHSVVwxMQ3tjZ2/DVbnQiiA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-riscv64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-riscv64/-/typescript-linux-riscv64-7.0.2.tgz",
      "integrity": "sha512-wf0jqEDOjrPRnKwYRyyJDRo11KMbvMFrU+q4zqKyChODBzvlkbhNQfKvLxQCcwTpdDaXSHZTVuh0JoCrKCUMHQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-s390x": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-s390x/-/typescript-linux-s390x-7.0.2.tgz",
      "integrity": "sha512-IkwJc3L7yhytWd/ewjyxNDfOmswCm9GWMJT/ue/dU4aZNbwZeYAetq42VyLmsmSjvoX7z74X6ZaYCtzAr0EuGw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-x64/-/typescript-linux-x64-7.0.2.tgz",
      "integrity": "sha512-EYdf2cNg7rgCWJnxCdJ+F3V39O8ihb37eHAu1LK8oAFizgTQbPOK7zHHXbPt8rX24COqODXeI3sIf0fCXG7H/A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-arm64/-/typescript-netbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-+polYF4MF04aPpO5FTkHran9yUQDSXqy5GiSDKpsll5jy3l3+g9QLhpf39T+ePtefhXLOGrLl0QIjkQP6VnelA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-x64/-/typescript-netbsd-x64-7.0.2.tgz",
      "integrity": "sha512-8YIT0EHM/3dq10ZOVF/A7pc/YSMtbcecct4rWtexrnSCHOPcpC2KTLXfTCR6vDpnSiY12heNb1GiN/wu+T/FyA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-arm64/-/typescript-openbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-APT8+ClYnuYm1u9+kgGXoMj2VzWzcymwh2gNSQVySHfkRDGOTVkoWLjCmOQSaO+PoqQ57B0flRp9SA+7GnnkzQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-x64/-/typescript-openbsd-x64-7.0.2.tgz",
      "integrity": "sha512-yX7s+Q0Dln0Dt9tEzZsAjXXR/+ytBM7AlglaqyeMPxQszJ1JhlJdZ6jLA+IzldHtflX81em7lDao1xXu+aRRkg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-sunos-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-sunos-x64/-/typescript-sunos-x64-7.0.2.tgz",
      "integrity": "sha512-dLJDGaLZ1D4HPQn62u1n8mBDkJREwMsAkCdkwd4Ieqw+x3TUyTsqY0YiBCtE6H6OzzgGk3iuZ3vFWRS+E8/d1g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-arm64/-/typescript-win32-arm64-7.0.2.tgz",
      "integrity": "sha512-Gyl1Vy6OsWesLzmq+EP0Fb7b4Nid5232AvcA2SFcdYreldpNtYFFofPjnt62y9hQy7VTaZp65ICJjuAQRaVcIQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-x64/-/typescript-win32-x64-7.0.2.tgz",
      "integrity": "sha512-0BQ3HkAHHlKLSp1qRvf3SUhGpGsDuhB/jgFw75guyqbxJqEaS0Cw/VFO8i2nHglJUzQCRtMMR/IBAKE3ETMC4g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/fflate": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.3.tgz",
      "integrity": "sha512-tbZNuJrLwGUp3zshBtdy4W+ORxZuIh8a5ilyIEQDC5rY1f3U20JMry0Ll3WBzU58EZKsEuJFXhb5gwv8CsPvgA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/meshoptimizer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/meshoptimizer/-/meshoptimizer-1.1.1.tgz",
      "integrity": "sha512-oRFNWJRDA/WTrVj7NWvqa5HqE1t9MYDj2VaWirQCzCCrAd2GHrqR/sQezCxiWATPNlKTcRaPRHPJwIRoPBAp5g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/playwright-core": {
      "version": "1.56.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.56.0.tgz",
      "integrity": "sha512-1SXl7pMfemAMSDn5rkPeZljxOCYAmQnYLBTExuh6E8USHXGSX3dx6lYZN/xPpTz1vimXmPA9CDnILvmJaB8aSQ==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/three": {
      "version": "0.186.0",
      "resolved": "https://registry.npmjs.org/three/-/three-0.186.0.tgz",
      "integrity": "sha512-cr/fIM2ddMSVbYVgkfD4jLJv7Fh/8ZTjvo+7gQeSVGUZHxpx9FDwoL5iC7hUz/LiRA8wMbqfnb90xKfm1/HHkQ==",
      "license": "MIT"
    },
    "node_modules/typescript": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-7.0.2.tgz",
      "integrity": "sha512-8FYau96o3NKOhbjKi/qNvG/W5jhzxkbdm5sj9AbZ/5T5sWqn3hJgLfGx27sRKZWTvyzCP8dLRBTf5tBTSRVUNA==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc"
      },
      "engines": {
        "node": ">=16.20.0"
      },
      "optionalDependencies": {
        "@typescript/typescript-aix-ppc64": "7.0.2",
        "@typescript/typescript-darwin-arm64": "7.0.2",
        "@typescript/typescript-darwin-x64": "7.0.2",
        "@typescript/typescript-freebsd-arm64": "7.0.2",
        "@typescript/typescript-freebsd-x64": "7.0.2",
        "@typescript/typescript-linux-arm": "7.0.2",
        "@typescript/typescript-linux-arm64": "7.0.2",
        "@typescript/typescript-linux-loong64": "7.0.2",
        "@typescript/typescript-linux-mips64el": "7.0.2",
        "@typescript/typescript-linux-ppc64": "7.0.2",
        "@typescript/typescript-linux-riscv64": "7.0.2",
        "@typescript/typescript-linux-s390x": "7.0.2",
        "@typescript/typescript-linux-x64": "7.0.2",
        "@typescript/typescript-netbsd-arm64": "7.0.2",
        "@typescript/typescript-netbsd-x64": "7.0.2",
        "@typescript/typescript-openbsd-arm64": "7.0.2",
        "@typescript/typescript-openbsd-x64": "7.0.2",
        "@typescript/typescript-sunos-x64": "7.0.2",
        "@typescript/typescript-win32-arm64": "7.0.2",
        "@typescript/typescript-win32-x64": "7.0.2"
      }
    }
  }
}
```

### 7/56 · `moonfilm/package.json`
<!-- casebook-file {"path": "moonfilm/package.json", "lines": 18, "final_newline": false, "sha256": "e25bde9e1f67233d0d1a1ae6bd02a1c40c0557694451ea2a22d6e44f400bf4bc", "original_sha256": "e25bde9e1f67233d0d1a1ae6bd02a1c40c0557694451ea2a22d6e44f400bf4bc"} -->
```json
{
  "name": "moonfilm",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "esbuild src/entry/film.ts --bundle --format=esm --charset=utf8 --outfile=web/dist/film.js --loader:.json=json",
    "typecheck": "tsc -p ."
  },
  "dependencies": {
    "three": "^0.186.0"
  },
  "devDependencies": {
    "@types/three": "^0.186.0",
    "esbuild": "^0.28.2",
    "playwright-core": "^1.56.0",
    "typescript": "^7.0.2"
  }
}
```

### 8/56 · `moonfilm/reference/audio.sha256`
<!-- casebook-file {"path": "moonfilm/reference/audio.sha256", "lines": 4, "final_newline": true, "sha256": "3f81ba4f2ee6a739ae467360ed41ce267d8288df7bf3bf9e0eb00198916d0173", "original_sha256": "3f81ba4f2ee6a739ae467360ed41ce267d8288df7bf3bf9e0eb00198916d0173"} -->
```
734981b7dd75da757710bb4c0a98ada96a498bceda94cfe8809443c3e61ee2ea  mix.wav
be6b80104392e870eda7ab63ef76c88ca427cc062b25a43285044e6a477bc4ab  stems/music.wav
903d9e620f1dd3692c97b40c268bb8f46e533f92547254b375f9efc13ac06ea6  stems/sfx.wav
587eb48acf173b34636c8ca2d5224f69f8399a9549c893ae96d90ad13c3d52c1  stems/amb.wav
```

### 9/56 · `moonfilm/reference/cues.json`
<!-- casebook-file {"path": "moonfilm/reference/cues.json", "lines": 45, "final_newline": false, "sha256": "b2f38b6d245a9de48ad86a7e63ad1a272bee1a68bc02f00023fbb3eaf05ccae7", "original_sha256": "b2f38b6d245a9de48ad86a7e63ad1a272bee1a68bc02f00023fbb3eaf05ccae7"} -->
```json
[
  {
    "layer": "music",
    "what": "pad",
    "progression": [
      "C",
      "Am7",
      "Fmaj7",
      "Gsus2",
      "Em7",
      "Am7",
      "Fmaj7",
      "G",
      "Cadd9"
    ]
  },
  {
    "layer": "music",
    "what": "guzheng arpeggios; glissando",
    "t": 23.782
  },
  {
    "layer": "music",
    "what": "xiao melody",
    "phrases": 5
  },
  {
    "layer": "music",
    "what": "bells on lanterns/stars/scale/title"
  },
  {
    "layer": "music",
    "what": "silence (punctuation)",
    "t0": 23.52,
    "t1": 23.78
  },
  {
    "layer": "sfx",
    "what": "window whoosh, pen, pages, breeze, motes, lantern puffs, star shimmer, moonlight, pen tap, stretch, ring, sky lanterns, seal, brush, petals"
  },
  {
    "layer": "amb",
    "what": "night air + three crickets"
  }
]
```

### 10/56 · `moonfilm/reference/frames.sha256`
<!-- casebook-file {"path": "moonfilm/reference/frames.sha256", "lines": 672, "final_newline": true, "sha256": "195c262e1f9c987585a9fbb205ef01278f2878962b0c9dcf41da91c3b9d17766", "original_sha256": "195c262e1f9c987585a9fbb205ef01278f2878962b0c9dcf41da91c3b9d17766"} -->
```
e75f3d004c51b66013434864ef29ac5fce976d889c2ea0ce057d53ab6a11b601  f00000.jpg
177aae73d6a968af3ecb45e910da7d388accb03d055b567b576d6d1b2c1b06c5  f00001.jpg
ecbe8fa5f5c8253631e51e1ee0515d00851d10f29429537a511f244d527f0cd8  f00002.jpg
fef9f22d6d229e5f0997a650d29ff5735c620cafb5e27fa2d437d59370eba82a  f00003.jpg
aa6528f70fcc99a30fea5a3e2a987778eb340bf033ac5e64f0b1e0b73a702d44  f00004.jpg
6686dfe715619ab7cc273164d2669dfa8b170fd98d92567bfb7155570f41c603  f00005.jpg
8f012a9adc38c38276a4bf8f2ca45588625159ad5c96fd8884e49f3332654ba9  f00006.jpg
93bb64c0b7ecd42e06482f9261e09ceb69b8156842b9f8c861259ff850a4a503  f00007.jpg
592b2eacfe93337630a339a3a61dadfa6cdda3b5dbf0ed3cdceadf18b5b1930d  f00008.jpg
bab3f9259aa2596747df61fec18c8fea4853eae852903f98473f7209d97a2d1f  f00009.jpg
c7a1f0795c9346475f53873e38680bedacadff723e2164dd37d55741b6540787  f00010.jpg
d320569a550dd060019be1c746bf42778880021ee8a6c51295b0e4751e96774a  f00011.jpg
46c9f7ebcd606f114d58c5ad5d065e85b8bede4a155f53cbcb729118848a3751  f00012.jpg
3989aca6f74b73c575a44312c7d6234aa0cbcc0d8cd28b2ec68601257ecf904f  f00013.jpg
89ce1a5b031c56399683aae4a538304e4f0fe7ba9df4291e333ecf251698c65e  f00014.jpg
cd80ffd11c8022d7cacb8e959e8c385b873c6ac5e6b1162d842738c10d519016  f00015.jpg
7f5fd2ba761c1f3c6cb0616a8b6d78f42b4b5397ff92c8d564fecc90fe36a4cc  f00016.jpg
2cfb8c2b60f365ac889bcef8dd0bfb72e70536b389160d58f70bae555710d233  f00017.jpg
e95f7a258d7fbf04edcf62fe353c49eda95357bd5943bdd76595b8bd2ab043c5  f00018.jpg
762e2a7ca6bf3e6f3ecd7cf6b149ff8d9a5c09ab417528784a50118e46f7d01b  f00019.jpg
bf15762700f019df4223a9300d3c809bd293398123c2be064cce0d3a47f6ade2  f00020.jpg
010990aff3737ed4ca753c03d1e2a82553b03e1dac729a26c5dc777bef1c8220  f00021.jpg
78e754ac08e14609b1b7606fc188c067d2c0e28ef30ec567c2bbc3b26aadf7b3  f00022.jpg
0850128e93618441ef37fc767038714ec8f1b6708e3557eb9c4f1adc48da5047  f00023.jpg
1f77ea5e42dd11ceff457dc80789faba7ffa89a7d6f25311cb8c10563376a662  f00024.jpg
a9fb4f3a8791489ea1a83a9a91b1eac2ef65e0770954ea79be45b72f10030701  f00025.jpg
a9f268fdf4395b1f335f260c866e636c2a411284970146b9aa95d4874a91e87c  f00026.jpg
66c1e0bd20c5be5a201ad30ce02ca3738e6bf0d2b916eb60c18bc83aa2fdf21a  f00027.jpg
ad501ba4778f942b19824d74c9bbbe2a7cb34ba0dd87c927c294b41a8313a65b  f00028.jpg
20305cc016011e87d99da804545007b131cd159cbde346d99eaf202ceee9b65b  f00029.jpg
804390ffa6148c9e01476dbc2558d289fca54d08c76eca81f8503aff21ed4279  f00030.jpg
7ac687d1aba67db49cdc5ac7466575b5b810ca51f14a8c88d1c325e696a2efe1  f00031.jpg
d179385b9285b7a9a6e5fd687c7d276b4880f37adab1af6b44869966564f6130  f00032.jpg
1adf415d4bfea6e6eb5d3441bfe2d2ca767541d8da99aa7d05fb1a195c2aafb2  f00033.jpg
acd53ecd4da3ec530895d608252d5cabe832ceb0f65a602e15a297feff49f3b9  f00034.jpg
24e354bf419cb6bead747375967ddf175534e11f2961a979b9d6b1b0b9d4b0cb  f00035.jpg
cb25c9e13ec3ff54a0d03e83e4d68433c6365c5cdab7c0a9117c9e8d86278ab8  f00036.jpg
8931143654505533352ebb8c7fa5c21472985afa1ba8b8e517d98d285b753a65  f00037.jpg
6eabd0123f9d748e18b46ca4df33a992067fac939ced6762e5c0cad109502c0c  f00038.jpg
ccc0df86dc9cff372ca4b53a209ef2c2c34b5465c9af2c9b7307c7b14487dbec  f00039.jpg
032c19fb75660575722dcf4fc74570f60acb2c74ef3e8dafe453a94fae2edfb7  f00040.jpg
10011da3514fc6a2a27385c3820ebdd4915de082e6b289f2fcb2c58758f5f021  f00041.jpg
d177e163f679a88d048680a4c8d3bb13aa7b39e5ac68cabffb6de3eaa7fdce1b  f00042.jpg
b9d770f53e9b5584d744398eb57dc734faaf857674bd49e259eb07a64a2ce162  f00043.jpg
ceaef892d1100efbe22a5b8ba058644d937a457f3e5d1f6aa8ce839bd25c767e  f00044.jpg
94908ff03a41ea075790e1e725d20900571d71382acd34123ea31faa983542b4  f00045.jpg
e3b7573215533b3355722f4abe924dd3e86fd66f5f5d2d018f3a284711595a60  f00046.jpg
f2f708f512bb76785a2107dfefb9fae7f679c1c188da0d6e4d3e8bfa71e22c65  f00047.jpg
698da396a8440649fd83614c3ee8d4a0076545a350a4166715910a90a996401c  f00048.jpg
290c033d25c88e581f4994050c3eab6d9b80bc5d7ff7ac11ec2357eed2547447  f00049.jpg
4a9ee398fc8c1200c7bc2a4eed74ca764d4772ca8b410f52be26a940c31b3329  f00050.jpg
b13ed28015ef57c2a7cdb2296a6149d6c97ade4bd0af862227eb663effe47a2e  f00051.jpg
1fc7a27f13fe2f0947aaf8441e538929df337f4d08d1e644cae15ecb8bc1ac6f  f00052.jpg
b3460f54a406b7b0f9a3641075e4b23ef20fa99f18451b40346f15c29c309c6b  f00053.jpg
7cde09f84ca9fe2b9cafc1dcc1363d8fcf2b32688ed4e24d0c4dba302c5e9e76  f00054.jpg
361b2656d699f3b344c01c5f5552fec97d29da734d00ab6f49164a1a8902d953  f00055.jpg
4f52df030cce113caadcaa8340e0ac07bd8727bd40b98ed4d44dd5f881442e4c  f00056.jpg
69bdd14d6f71fc577e194d98f381e0d3fb40c20f873cc8c7349ab5ebf78d0da7  f00057.jpg
ce8e5d389d7f70d2136593320f260b36ea4e7a8dce154c533f4492146959e924  f00058.jpg
2f19f6563b325a8c84109a768bcc4708ea0545ba3b5a10837a0cc35f3209d7d8  f00059.jpg
6ef847d4aac025ae399ea319488e3ffcf2ac505a4585beb379b4df828f8787c8  f00060.jpg
a892e703917386e004765af8ae2d127cd57ddacafb5d093824e8f5eb8fa49f1e  f00061.jpg
104de9b9b2474f9acd82456ce0ddb5d10200ff6d8e47702f90558c361c9a107d  f00062.jpg
925c5f7f2925e9162ac80608ae3c27b67e50ef03416e2f4c922439f9bbbdb328  f00063.jpg
0fe8bc224664c775e968aa6ff264d6cbdb7311f6989ba3d8f595ce0db4dd2f66  f00064.jpg
c1fdfe6ce9bebe51bccc0f69220c7ad8e83163406a6829ef0dcb41f196f7c2ab  f00065.jpg
d795208b1f4f4ab356c296ff507a14252f558215cf185f7572f59de354b57c4d  f00066.jpg
9cbab9ce183da6c1b1e467e4d87efaf44cc5eebed85ff0278304c6af4c3c79c5  f00067.jpg
d8d26572549ef0ec1303b389e25694eaaaa9a173ceced36187ce576a568d7d24  f00068.jpg
536b3bbb1a8996fc6ea3610a45ac1912febd3e6fc76bacb79b257a23af84291e  f00069.jpg
64706fce9b1792ca783b4e3e2b22c988006abb774bb38b7682e39da587462264  f00070.jpg
58be4ad97b72352f5ba997db216a95374141920a7e4fb789d43cc34598ccdf61  f00071.jpg
bd2cea6d3c7ad6be38186d5e72d342ba7fc552f12dfef4c6a5baed16d5c583f7  f00072.jpg
297b24106cd05982cec3a24f1c78109e252d1df55b1162bae6af52fc83752d6a  f00073.jpg
52224b4985aedb07148033808eccb968ff619647c0ade678324d18fc383a4943  f00074.jpg
3ab254a3526f1b67fb773fa44eb6be78173296eb572da2a387c752a143eb8788  f00075.jpg
2fe80b55664ce62e73fb15ebddac91899871227d9de15243a1fd99a2937b6ce2  f00076.jpg
981913c168a9df3b46730487e480df8c544d2fb4b6169ea469f01cf5a8d922ea  f00077.jpg
7feae8b20ec306a2c26f49a2c7fae499020c94522f5c6b864a8fa061f23605d1  f00078.jpg
319c910ec747c46f0ba87e241bf2afaa5b34053c094763c6881f0c421aec85e8  f00079.jpg
2e5899af795ee6444bb376e25c3e846b040058056a06a6ddacf14668502613ed  f00080.jpg
dbba74d75b27790feb605d08dac68dbe9a152d54fa332515d07055ea385bb4e3  f00081.jpg
8f0472d351fc9e69800c4cdf98ff85aeb975082076d7cfcb25d540062e50c1e3  f00082.jpg
02ae39008fe45dff4cbed19ab5c9629dd55fc89d1244ebf8262b36084bf8de18  f00083.jpg
610c357369315c78551b4c398658e3036aea771f2a6f0a510cf2a30a85cb002d  f00084.jpg
cb4787cf17d1bbf55a82c457197099a143f2cdc81158f9c839f72dce3fcbe06c  f00085.jpg
65be7051cf919cfbe4efd2b0ce827f1df829abc950c0cd8d9d7b845ee0d05b95  f00086.jpg
d2b548309cbcd50a5edfa4f018746e3226cd720a6a757cc426941f3d34085ac5  f00087.jpg
6eb7ad635a8d3c81cd17ccf432f059be7a4d84cffcc035af6c0848aea95648ed  f00088.jpg
e8d76bf42b661b2b829d20b4f742a8b97f8a0f8af05da967f9664952639f6e23  f00089.jpg
47da573c7037b326c5195e0b99d727a801f6e29fbc57d3ab0c075e4155521949  f00090.jpg
3894426f590fd10291b56612cd6480c7906a7c3d8c50a92adc4c6ff775e0df4f  f00091.jpg
f31af26dbb6ce00cc120c6adfdec9512fceafe2d6b92758b9001109a529ac8dc  f00092.jpg
55c17c9beaae426d4dfcdcd53ee4c293751e954ada6e4df17198d4b18c74ad6c  f00093.jpg
484b107c72fb8e30129df0f30c72228fb468ae4658058441ab643698d8a7d57d  f00094.jpg
747eaad7fce66da5f67cde02371640910f2dd254012a7563aa7b78c062c48db5  f00095.jpg
7852a45fce761cfb2b629e1f94738da3efec76a5d3b93b4e1dfe3a98cbe75061  f00096.jpg
68d7b2a2caf35294cb4207e2c91b4a2042b51b0282d771ccc3501893652d26d1  f00097.jpg
15cd4880dbbf7acd087a33b1912aecb27792510357e1123eb89272d09534b75a  f00098.jpg
242eac932929c869adbfbaa29a100d401b14b51468d3d9c5cd1710ec81f4d11e  f00099.jpg
05762bb1c0ef138cf99c5f320812905c4eab97fadde8addafad4b3929f56acab  f00100.jpg
c79d1fcb24b42704ce786b91a69996b817791d39cbd659e0ada95d16218ae953  f00101.jpg
c65693a05d81245619c580a0bcdf7ab3fa428510f92c22f08db032877b2e4aa8  f00102.jpg
4924efc10eb346eaebd93f2f6ed5abad027346598b8d247f64b9be661004a644  f00103.jpg
e32c2f64e2ec723d9aa1d58f62f4a3e6c8e4547b8d25d8a0b65b492eee4616e8  f00104.jpg
08207d3f6d215fd134f2b3c55b93a2fd84fb47cb58fc8e82a0aa8161c2f94ca1  f00105.jpg
b4af04e5c83c3bfa1691b57aa6daff83f9f55b58f49506e5a9436a91bf7ba528  f00106.jpg
0798b3c8314ba2d88f7056525d0f0b1be8e07e233b4bbee40a6e55a67d544764  f00107.jpg
e845b47db32de9242247cb0fd0d5a804644383ce89db0e2902007950f8e34e30  f00108.jpg
402bc96163c877584393d9f1b5aa68627f908fca8dd35f13b45c694c2cae71de  f00109.jpg
87743ab9dfc3212f25a0ff053580ac1fc08344bada0ebd0aabea42b31561a33a  f00110.jpg
68e1f5585fef58c1cff58a79de7af6d7b4f91fe0ad33beccd56a5869a386d3e6  f00111.jpg
360abfeaf012f924b5606a0a18d52133213c5b9540b599ed68eb41ebc4127159  f00112.jpg
9823518b0cb7f1dec2a71e4bf34f3df343b49d5249f6f2dccb3ba3649ae6aedc  f00113.jpg
cf6180c2f30d9a230af677d62931dc753a075975e18f7d9fd97e06480be3a74d  f00114.jpg
4907515848595edc0c8caaee0d9dd6dbe8ae080e38376f6c388e9d23dfa2aa66  f00115.jpg
8519aff8b9a3408510fd81931487edbd4d8e6969f9cab245617156a8cdd94718  f00116.jpg
acba765a7fdf4f67f74331f6b0c5e6d267f9f8a905136b803a056f333f8f620e  f00117.jpg
1a6f5d8a8e32a42cdab0953a26940c3e44968d0fe015cdc38ea3ee44e48f220f  f00118.jpg
58adb449c9e2e19081513c221474f041312946285ea9449ef8b7d214daf8d687  f00119.jpg
f41fe6354e2d37090b61cfaf477032fc73139aed35613ef639f35abd860e1fb3  f00120.jpg
563557df6be35445e676d9bd8d2a527da6d84d0d11366a4d1514fd361297cb30  f00121.jpg
60adb95473f206719c5da27485ba2facbe3b57e70e3f900b4fc9f083a18ec203  f00122.jpg
4b6966db49e6bdfd26918be14aa8034e8cf2ade5b2054541d40b3897a8abe095  f00123.jpg
e5781fdfd3fd57e230a45b4dc45639661bec076480c86572a0b2e1bf1506a113  f00124.jpg
cc3491204555d4a5080a64bdb238c3f5a88c4100f4071c9f93f457b9dad202ac  f00125.jpg
898b4eb4507bb1899a89f0c7a4bef61a019447c420a93c301d09159341220b3d  f00126.jpg
7d2988b69eb963736ba3da97b6f43ebd1f243fe767059382d1a27559a2fc1051  f00127.jpg
196974f9317e3689051292ab74ab2ac0fc62db04c148882d825e6fbde6b7c99b  f00128.jpg
7987da02d0e704ad9d11e0511606d61e65d6f686d0199a1f868a238298264770  f00129.jpg
24124299fe2c7dc1ccd4f0244f652bcf910f449b453a5bb53db1f7ad38c331ee  f00130.jpg
40bd9e8122016f839a4fb602827fd9e6347e031488e906ed5c0e4fab2116da07  f00131.jpg
482eaca55421699ec4d4dc5725bb814cb3222db0f09b8574ed038ccdc171be8c  f00132.jpg
26a549ef892e69f47b0971c569f8a3e935c59b9b4338e93085b2223ee745d03a  f00133.jpg
c52a22cc2ab7b2182f36bb4cdea49197100d27c724465f0daf96f407eea38839  f00134.jpg
87c7a1eea75127484327d7f01a1705c1bcb18f897f468dbf4d56bd5009e30f64  f00135.jpg
503bb7ce040c8e2bcbbf72c0659673715aed8578e2eb95f12982fe84c4a3387f  f00136.jpg
10d56931b7c71aafe97f7ba39d9e3967da9dcfee5bbf299effbf8569c5f810f3  f00137.jpg
ad390d65e12784472aaab135565fc2e22ae8a23d33805fce8e6ff2c46bf9497e  f00138.jpg
880b615270acdd99bf24be886d33c827eca9eab57aa2764c0ba8dae56c556f81  f00139.jpg
e288f71215244f0ff72fb33a387cb6d92ea3ca54b33d99efa857c771187c947f  f00140.jpg
2cdfd5d0e3513e86dbb877a5a04eba89b398a425c0d0b63a63d56dd7c07a2180  f00141.jpg
7520697e1dddad9ccaf65e697699b88d836d3b28e0dd7afe0f0c7f9b9ba7fff5  f00142.jpg
af34daba67b64f6dafadf5ae83f66a87ac0e1b59a6bc48b6f9807d7c2156212b  f00143.jpg
3fccd6e32d3fc818aca2af19c3cea57d45686e00234e399ddea0d11300f1c0b0  f00144.jpg
853b0e50cc63395530f422c84ac10c7f60e476ef59529fcae8a4090fc604c4dc  f00145.jpg
251feeb6d0f1ef878f8e89eda29abb23db6f61e730e38cf9283949e4a4daf312  f00146.jpg
401c0502dc39f146f7b9920be8ae7a2ab1120259c77466454aa61b92fc732b88  f00147.jpg
3346fb8b854cfae146fdf09c77e08fc9264af8412a708c439b662ca35869ae32  f00148.jpg
51c3f7f21a7829cc3ac13af0d3bea9ca4c4da59b9ada9f86ca8e729e267aa561  f00149.jpg
8e7ea7824f80c55b5b1d84e58ef7960794763c2e3d48f51a8cd5ecefa868f2b8  f00150.jpg
46de80e91aedca3bff14cbb90fc04286cebac163ae42075981767523d1a4f1ff  f00151.jpg
4494fc7ecbcc1c96d2253fe9a0fecbe22d57218f77ecbfe818f0cf5bdbe7d8ca  f00152.jpg
63566151a39c8085f17564f0879bc190ec410ac34fbbe79950123b054b693688  f00153.jpg
5661e9b63c3a759ffcb581c905d56b16876e31eff73aa39edb58535275c53760  f00154.jpg
dc61bab3cc9826271ad0d1b28a684c949079a8010f096b9c4dc52fd3c3ae9249  f00155.jpg
6b692c5c09e2dc71ac09a878856a3fe122e70767e24e32d3b738af6bbd795d7e  f00156.jpg
d081d7f6bb508bf43b377e0c49bb7e97d9c9e37b5c7a486dd55636fa3c2b6700  f00157.jpg
5b44bd0680f487c11c6f744c5fc58923879be1412c1761280763022fb963dff2  f00158.jpg
e7ece38f3d8d48a829fcfb92e8de27b4211701ea207d93e5869fdb98b9b89066  f00159.jpg
17b8d76368a99546dfc1a063fff4a221b66174d8ceeae8bdd8261351d3fd8c35  f00160.jpg
40b7f0ec358b6fa6c7b108c5fe788db4f33bd35417a555f8b0200eda477320e7  f00161.jpg
205f3ecb48b80f393c86d285d29fd94ea20feeaaf1e12b6fe28f99a640ef9ec3  f00162.jpg
8768aeadc6b167ebf4ba14af81c6b050f7c5c76056c358a6e3783262b53ef9bf  f00163.jpg
9274562df919d14dd30d1d638a1e50a884f55920f6a1070bd02dcf536ebdfe0a  f00164.jpg
6c97664e251824f05351e6873d750a22c521f62a00868b5d0b66df21fe5facb5  f00165.jpg
bc9c370bf3c6d2c0241cc514934a7caf948aa25201154943bb186bf75ea4cea0  f00166.jpg
ee7e7c473f5b3c83ba854ab973e1ff92048bc37e5793b823e1d116f0216da3b7  f00167.jpg
a43fd7aa2106e9b2c3e18b025c2527d2d388fa5f813a4e146624346e3e25a7e8  f00168.jpg
c941d63280ff2e698a478044b8eecd98826283ce381d893852450dc168d35ac1  f00169.jpg
8048e65a4724b28f830d3a4fe8e2b218279e0a505a8889b82a0a393b115a2d84  f00170.jpg
b20c9813da17ecf51fad066cf16cc0f52923d91abd356c16959d3a963d95d5d4  f00171.jpg
f569d907ddff5596b7d37d402f75e626ca0810031da019bb8fccc00ec6c2097f  f00172.jpg
a63b661f2c5639684a0603b0b22b077daaa5e4dc214d3c32edd27d310f369a4f  f00173.jpg
06ff86b4c912ede8c5dbb4d4cf6b0de3f5c3fc9d33c424f83cdc29e1fc225821  f00174.jpg
4e1b30e1a09d37115b6b2401071bee934f1686c0885afb615cab7480027ac99b  f00175.jpg
e57661d32b6706f66ef0208d3022fdf3298078f39347832aa844f719dab3cdda  f00176.jpg
237d04b1034ca9b6714bb8b4da05465a3587a2f655759439b39172f50f102281  f00177.jpg
6db06eaf115b334adf45aee7a6fdf0b6e4c418988a1ab96633d2ee6506f9ff5e  f00178.jpg
0a88e1ac827db6f22d08292de5e141fa9bb9a376245f947b817ae59d9da5df35  f00179.jpg
ea269c7f28d17bcf68e306a9b81d98747e27e71e42581bd943ae73a4b99a7628  f00180.jpg
7c5dde56e82fffcb0d777c79e1d10fc58c152b799b446dfa820ed95337e03f8c  f00181.jpg
216d3458ae21981617037e47643a3b8442b11179fd1994d964e3cd6cd1f35187  f00182.jpg
3f86f440974e34e2e95332dbae94de7416dc6b91c289c9730867be4ff905033b  f00183.jpg
2bd0c2f623728477f56fd1b678a6f363290fb0cbe70f8099b43a084e30ad7d67  f00184.jpg
e0bfeb39022e9807e607f95d022f2d15f627234e16f3375d909378b83670868b  f00185.jpg
987514116d76547f93ba1e2d929e1f2da9b7cb040779b42cf123875459711f1b  f00186.jpg
8eaf097171e81c6aa1e32b0a8a2e13b279a43b1670597b407ac12b4630931827  f00187.jpg
4828c64f3d826276b14a5d41e108dd3fcc46ff6e268a49348f8c319d2272cfde  f00188.jpg
5e5a7b0b25eab9d3fc814939ecbb5a863485e2ed1dd7c203c98729acffef2883  f00189.jpg
c8acb0cb1a133d87cc88a7e95ee7f8565a1548a997d502f563007b4066f32e00  f00190.jpg
8b66400a5d6c72c815bde5d1d0a8fc1e52317eaaa67fdd16cfa4fb767930d8f8  f00191.jpg
882cbd621681b42e2bee3c64236c4e7088d768f040a78e52a3dd076f98738d1f  f00192.jpg
4619f8fb0834e024370ad8a7024cd0c6daf1afe79c96b096053d701cb1a6c537  f00193.jpg
b318c22a62ea199db630667e14994d8772ea1d3dd81e28d0b220fe8d770b59ca  f00194.jpg
1417c8c680ab8d3ca84754d1be68cfab3c634b4ea70cec2ac26d6aeea0ed4e0b  f00195.jpg
a87c7e08cc92f3720e3a5f2bcda82378d0c851d6ab95c5080aac22928769ab15  f00196.jpg
abb2e7bbcfd935b00d4296d5e6fff51c763b3f41bf7ab4a2c2cef09bea148b0f  f00197.jpg
10b7d2cc638dbbb705a207506423fcf6f9d94a05b38574671d2b7e56362f02f0  f00198.jpg
ff8b30b4e78d1d8f97016e67bd55fed4bd86b3dbb263664c5115c72a46b8336d  f00199.jpg
de8b907a54abf287cf7203155ff6c20ab18fa0610f20986e7fe169c1e4e940fa  f00200.jpg
6411b3c6640c96b35c6dfd7cd81e0eb1e5d9de9760046a149bdf75054de98037  f00201.jpg
d9697f86c141cdd26ca21b1024a655722f1fbb6cc064758ee51867bab16579a7  f00202.jpg
69d3cd32271e6b5b7a93d5033ffe07423d70fbdef01fd72d036c73c0c3d7305b  f00203.jpg
7d92b71cf5b5dd3164b9a032475c55606864faa65e59226c2be1dbb6e3674a45  f00204.jpg
6f5fa5388056a4184eb26fb4ab5272e09879703659cf9e6ca615dbcb760604bd  f00205.jpg
00d6b6d1f0a2c386de5a0e12761c62242afbc17660e702bc68f15fdf9c7c3b83  f00206.jpg
64bf6bb2317268bc99372b6e650e577639edb189ce5ac6888005227ad30b1290  f00207.jpg
549dadcfedcd30ccba9f982d426fe931db4a15ba8302dea77c7b44c59d40069a  f00208.jpg
11d2f38ddee0542f251eab57bb39fe33413a8e02e1e9c0cbd9f8c224b0ac4a27  f00209.jpg
658a3e5709a4d652a8cf8c66784220461949ddda64c9df95c6fc54bbd56f5709  f00210.jpg
bc9856891dbba353d27fb6b3153c306fd455552f2c43d083a62b4219baac1ad9  f00211.jpg
54b194112e697af6a024bcdf455ee18a192688bf111553c1f89f2aa157abbf86  f00212.jpg
727cfa7529c47451744dea37e48f2326d467584b1fb0db02e89262be8219ab34  f00213.jpg
412e2fd5c4a30eed81c0c0fc207611317f8534ee5f64a80e313cc2f9f075e69c  f00214.jpg
8f9bf3727a3e8b2dffb893db3a3e9a377476ce69429b510d0c2cc03891aec601  f00215.jpg
0d4d5c59bb44f98e1889c7ef8ab3b07893a554c2502787c4ae27c4b0ea012170  f00216.jpg
a94ae8f4e759c8efe3031c56a1fab14f7f5120bcf2e7ad4392c76acc5498c254  f00217.jpg
6b9041d9786838ba0d87f6365edacc0eb6af89a897ea3696e7634678d8ac0566  f00218.jpg
ea69b5038103ef1ae1e4cbc180ffbf293f692bd60307caa50ec67004993b7184  f00219.jpg
24f0785a09419c4046feedff398b00343bb846ecdc01d45141a2a07e328fe1a9  f00220.jpg
f0118ec6bae433003b1a418ac0d2da6eca002fbe0b2dce29c8ee9ea5c370c875  f00221.jpg
912564bfa19394cc0dfcddbba931f26eb3ab74bd1801f935589f99f89ee6a841  f00222.jpg
41138dcadb12eac7f9769f18a9028107086bb9edd18f63466da4927270865c65  f00223.jpg
f7ca742501b9f59762eea4972364511adf91cce02fc8c6835d891de28556208d  f00224.jpg
5f3fce4ed5d73877cb95a207a528bc4649eacfb8e724b16b6ed7a0d8a2c931da  f00225.jpg
21c21db60ecd09ad878a4baa479a81efc85ec3c0db1270646a70f1553ff685f5  f00226.jpg
69ce146ff0a75044ec7b13904d0a46647e0d1f79cffeebb886bdbf644912a6e4  f00227.jpg
6c166f71aed179aa2fd515513ddd8615c1e73b3201c4d398c6e69813eda0e9cc  f00228.jpg
53506f3d9dc5f0ed42b97a33e7fdb5783c9acadacb1f731146c684246ba65596  f00229.jpg
8d932c88c1e6838d8b5b7ccbf4035539f027159f30c0ebe006c99c0db50abdde  f00230.jpg
987e231df1cec2e5ec669bde49a50a7daf099025f93b677aa9d41068858a61ee  f00231.jpg
55956d483b408276725ace74c9188e0d52d7b78c343d7d1e042cfd70ed38823c  f00232.jpg
21f75432ff39b1594623679529ca697e698649072a5a030b4dee911054f5a44c  f00233.jpg
5c3285038b6d6bf20d93779873708c4e895ec2b1653eadbbfb967b47f98c9b9c  f00234.jpg
9e7d870e11fe11204c7c98a6d9aa1e498209d118101b3b10437233c6acf9abf1  f00235.jpg
2b26c18d9e7f1519d3621b3c10c23019b2c3425504e0651cc63e10167d65fcf9  f00236.jpg
6acb08d843eacb812ae90838ed08e52fd283cd1095337790ca14944f9c7a9edf  f00237.jpg
819fb1db80a3c05a26ef014446b3f53819a519cab000f85d0f47fb8a02fdf96a  f00238.jpg
10ee2723651d31e4ed7b1c024f2df96a5e08ac13385cb5b43ed058dd1a051e1d  f00239.jpg
5d31d6e3c9b8ce834d1950bc89b8515889a48fa35d18db85d48dcb5ee078d717  f00240.jpg
ebd0a0fbfc86a749164f2f50467ef715372dc2ea03082574335f50368a2094f3  f00241.jpg
73ce46cc2bd6810cb6412a92c9f4ce3912ef7c1a966a03fcb9254b44c73228a4  f00242.jpg
d01284cdadf3da92a30699b244484457ef30dd1aaecbac230ec3431fced0b784  f00243.jpg
30a17c50707b607ff1f7b23d71f835af307bb95f105d16d70813f6089219c6df  f00244.jpg
8af572b1ac53ee89d8ba1da4599d6c3e5658470d679862d83e4a264a9f013e51  f00245.jpg
5a315dcce3ad6740053ab9222b0841bfa22d892dc5b1c6e89de2040c27349b32  f00246.jpg
4c3c838b047bb6fe1780664518eee40f11542c9abd9925054468e52701e10ec7  f00247.jpg
cd1824522fafeee64e634a49fbae3cc4a546a3dacba8af7e77b6d6169ab85362  f00248.jpg
9bad2eac96a146ed104765a469f4ca69a4416bae4c76a21df1fadd09d7645e8d  f00249.jpg
476304bfe2545d5c3ad263c4acfae97549d4516667983808196451f3d4eff77c  f00250.jpg
2c3686312b9111ae0446f680677ab809c23ac8c882596a489dab271629744047  f00251.jpg
dca8474916183dd933ed180dafed5258ce0d6f6f8877ead4519edd7bbc4005d3  f00252.jpg
91eaa36a9498bfd95322dbcc29cadaf590137112bf6476dfcfb025ef0e40411a  f00253.jpg
df0af526f8e404fcdced4e247371be870e3d92a51dfb443c2261b23753dcb662  f00254.jpg
69e9a6d04b6542a459338256b21d393cd62fd39e7ab275f83040508e033305f0  f00255.jpg
7040148765e195e4c371343d169b711d42d1231a55e46edd66e68fe5e8f91604  f00256.jpg
5b8d999b62c131ca88cad93cc357e203a0eb18547a4c1a2c7d6b7263078ac868  f00257.jpg
b66ed23d08339d381b3bbe2c1ba6aadf672456839d233a71c47a14482b38ef15  f00258.jpg
a93ba46c3e6ae4f3c4cb51066ee6971f749fa5b518fbf3caa7ce17b9ddc02551  f00259.jpg
23c4b7a2ab242f7dd505cd9cfb4b3f0c174cb07e475ae13d9578ae621bed989b  f00260.jpg
af00b9ee0e51850660c520f45966762ecb3ca4c6b2b046939d793e8bb7bc56eb  f00261.jpg
24e07e9b50b7b1c3f8e5302e586489eb2cf631da6f83bdfb8d9b251e3908ddb0  f00262.jpg
7ce25cf5c15efc57adb905e36ab2647fcf365bd707a6f5fd14195ddc40699d72  f00263.jpg
7fd3130b82808933da8b609a76668e7ec9a0c51af57b17f4a87e8d7aecb5db18  f00264.jpg
85215346870e7c941fb41d03ae7c6cf598e79264613d5999db3d8ed82351ea03  f00265.jpg
d0c984821847a49603f15123402c0607bc9b6513de691b4eba199a0ed88c192d  f00266.jpg
3c984f75618db0051311bb772bb05eb1296ab9b38c18eb82f0f69e406ce26772  f00267.jpg
d30f3031c887605c7ecd157fe071eb31d3c335148d7282d793d88ee1a1a6455f  f00268.jpg
076ad59c8583baa31fb3c12f2a03259bc26e2b0c29fdfcc9837c5bf90a703423  f00269.jpg
271523eab9744f62d1ebffdeb2c62117b0114735d8a05bdfd66877007b8e1c32  f00270.jpg
46955f54a29ec13de203e64b2c6a0b8107b7165cde615048e183556a800c9c0a  f00271.jpg
2b1a683e9df4a4d81bcb4e65c034407c93609a35eeb8dd03367f6c35ed9fba92  f00272.jpg
5afbb8afed0cd0a377af858ee691e4006c3ebb8947a0beb101a690caa5754c22  f00273.jpg
0854c1e12aa821b3dc9bf9d4af5ad5cdcd3da8702c62ea279317f3b11947190a  f00274.jpg
81fba854155cdd43d9c06ff96bb3b87c9bb69ebe570c2607d92fab375c57b221  f00275.jpg
ece05fbc2d7bc978939bdebb3a91c7176822e31f691753075bfb85fb656dcf84  f00276.jpg
4b7f8ef24a569d06cd162009f404c585006b3ff33a02bf26b7f491ca6ab1cf32  f00277.jpg
108cfc5fed6e6d5b0be262abd69c291ca59e8aa08068de2cd0f1989d2d8696d3  f00278.jpg
87029abfc5cc8ae6b7f70623d0c11666b6763d30aef0ba92f62e94a0bd0615da  f00279.jpg
14ce864dfddbe1a8e0ca5a4f07ec75bf110ba54a9acbf6d6af0cea4feb9758b1  f00280.jpg
480d83cc6774f4b4a6334ca9f50d96dd8e9166c92b19358dbfc661f03f00fc81  f00281.jpg
eeef805af91c5202cdcf536ddaa7ee485eb2acef11a1239d26b1b32bef96c324  f00282.jpg
b33ffc040b7beaaaff1c8298b83c5600b6126ad625f8b92c1f928fd72f989e7b  f00283.jpg
66ddc28b5658b7c6c55febf8ca620bc3ceb19c64e8d4cc3701fbc8c382dc8a44  f00284.jpg
cf6672169c99989868ae99fac1b26cb16cf025cf35463afb92a096683d64c24e  f00285.jpg
aae2f7260cd342b5fce022299a24f0d83b85924238347e145b23dd5cef774058  f00286.jpg
dadbc4725850b39c2be3693e56d242adc08fc16abb181b00dd55ec7f531e81c4  f00287.jpg
c5df8d90c259fd96c10fc2e0ea3126818005f02aa4607ed31acd654bafe93bbd  f00288.jpg
d09e64e03d9e8f930919938929fb6ea3bf2402ae997bf34ea248b5c2251aef77  f00289.jpg
d383d98c64912f3310bbd6c8f6c33d9665484a9150ca5104d43eeda19a8bc91f  f00290.jpg
6a2bc206c46762588bad935a1a390f5af4c2edba92f007c5cdd0f050d6121d53  f00291.jpg
3196b9aadc47133bee0330e6db8d9e17538108d5d4a9233e628818b3e082e0fd  f00292.jpg
16239756dbe9b02407ac952f8758ec0c0b5cf708a10d35d5ec63c598e862cca6  f00293.jpg
9b6ae30274c53bf8aa7b03eb4bdd3bd4756f68ba24fb308d4afcf1ddad14f61c  f00294.jpg
98e4e06b9132e2d751f0d743e0a94dd5c9f013dc07f0818b48d6c848d717317c  f00295.jpg
5254c6ea3333bd8f6ddd5157a18d37514363efab122668510ae2217de893bdb3  f00296.jpg
430bb7be770be1222f2ded22f3603ced21368c7e6d8652eade97868d56b40525  f00297.jpg
3f956f03baed2d7aa2d7dfeade08c81aece42ec822b2ea2c130bfd77a8411225  f00298.jpg
6e0c82ed1e37aa52d8308e54b38a8dcba85cbd8eb48bc3cdec793c73d771707e  f00299.jpg
3f5028eea7c0a0041b65a9b896680ff2ae0026a3b42e86032f1c2058c6ff28dd  f00300.jpg
c2c8d63d99d6afb0a93b08d195c5e59b926e538132b0b21f2b4ab06d8c3b310b  f00301.jpg
a9665432e05f32e2ab7bbbc85d0bcf447866a3788dc46e503d637bce6d976e6c  f00302.jpg
2f5cba005c3e92da0028d18a069c5022f15bbef12e5def911485224a6c8a8940  f00303.jpg
c7cf5c26cb3b9f550579a73a208b8700faecff1bdacf822aacb7f0b645c42ec5  f00304.jpg
903f7960b38cd81c381dfbd74229059e2343e04253ce7337bbd774f7cefc2a47  f00305.jpg
1d6a1734e1cdca91a4eea51f0b383d6a3237b3e642723c4205008082eebb0e31  f00306.jpg
d67dbd0cabd3534b081377832dc3d28ee4907ff7ab749acd78b1a762fb614d1d  f00307.jpg
5b9310868961088d9c834682941fd5d08277e0ed060c8e7f786525c539dfa1ac  f00308.jpg
906aee095e5ef751c967e69d8bb6a48b339f3d31fc466c22822e9912f121671c  f00309.jpg
6dace7cf9dd23b1c9ea5a14cc6de450f4abf784041d17ab4b5eeff172df54f1b  f00310.jpg
ca7566fd66dd89e3438274def0583084091b4de85aa083ef9a260f660b636202  f00311.jpg
128b69d37e120809e60bbb4b0631c9b935dfb0cc07f6e8db8a0a0d436043dfbd  f00312.jpg
aab9e9287f6803ed09fd47223f032882396a8ec26cb34e814f22108d58de24f8  f00313.jpg
e328779e7e1d645da86a532d3f29a9208c056f82e2c5f628ea603bae804614cb  f00314.jpg
066a450b51e79acca3ec1ef703f76581bd1eb6cbc9d0297f30fb8793c432e9fb  f00315.jpg
09fec1a7feb9f02fcce4c51935e5a96d544ff8ac7730469a5a53089328a9c7bd  f00316.jpg
a4e4ef15c8536b6194823685fadf9a3049cfd9d5b662512b4a4bf7cfb4d8925c  f00317.jpg
0044d2f22c60a69540eee02278f6c5f2f420eec8290bf22489fea1d29beb549a  f00318.jpg
9ab4317dae0eeea627b4dbac7dcb6a16c904a1a4977e380234037c2aa2e412c2  f00319.jpg
14cc1ad8b39795902afaad34b3146a6f786d6b955d2ee8405db98feb49685196  f00320.jpg
dc117e187ac6cc0cfa6a580f6d7b2dedd1873f7fd0e8400dc0da7733e8329356  f00321.jpg
a71a3c22510bda1342ee161a6fd11116aae528d719c31459440112de6ba2acc8  f00322.jpg
13cf6342443e08eb9039035476a481d51b56c757fddaddd3f6e9b08029408a74  f00323.jpg
a40bcfc57cec289324993141542360b05e36b1741ee08441af9643a1a75c1f4b  f00324.jpg
907e2f20bf82f9e9cce117657687cd97e75dbe45d15654e38eb2ee344142d013  f00325.jpg
0572d353c185e05fb782c7172f12bf5c1ee302a651c6a3281b214dddcd1507c9  f00326.jpg
a81b5b5e6683ca9c189db01f3637db01993f6a677cc868d9fc101744873373b3  f00327.jpg
1fa70cb0830899c6b6466e8255fd1ce58d5b871b5403244af53ce76d4d2fcbfb  f00328.jpg
f9ea8231076e066f4acf28e4c70086613cf20b534a1cc3fbf4825206de58bf5d  f00329.jpg
898ea6a2ecb8340e969a2942adc1e84183cf5534f8e8cde398c94db5f2378956  f00330.jpg
9fb334838f22d4e31ae916fe6f93270c1218caaf5735a0c47ea3164b250dea70  f00331.jpg
91e5077268406a678e7d65a1922cf23f8e2c61191119d7f7cd5a07205f731838  f00332.jpg
de134a17ba88ef3efc3f1002d231c7804bc4803660682f080180417572901493  f00333.jpg
3fb3c935d9ba3e089f5f68ff20e853402439265d463c5bbaf62d5f6fc8d556cb  f00334.jpg
85285d263b8b16f1aac3558ad52e49889ca1723f3ea241c8b99a3ffc9e933c4a  f00335.jpg
c70f5f09fed9288805e218699667695f0a19f051411c482f1c70eab175a60e3b  f00336.jpg
8aed611887b5bd1e53222cff3a768a0337eac5c7bf8bb69ca78aa4f12d30525d  f00337.jpg
3a2305cac87e57d63fcf1ad07114531dceb91586cf6adad9633244b78c546967  f00338.jpg
edb3fab8d2f645522147ca625aed23202cbe7d8f8842c5f02c734287c4ec36f5  f00339.jpg
96c94586e872952f65843389be25a9e6c53633bb2ed51693a7e7f1a5f6b9e463  f00340.jpg
462769d10e58e7a42000561a31ba203663dca8e2a65a258392dba9d1eca67fef  f00341.jpg
f0001289600b139cf78406b3d0534ee37aeebfc55955fe0d802ad688a3050c78  f00342.jpg
2c2e223c44e527a4ec3deccb4a7f2839e9bd9dff24a0c2b8b41562bfb70e104e  f00343.jpg
d45d04410be884e189806bb7d12450ae2eca68dfe0443c3a0ff62e10fdf1d600  f00344.jpg
cbc8e45f193809e7eafddd87af0f376fef232caa978ee2763d7497bc58baf3ad  f00345.jpg
52b9545d08d64458a1fe6745abb0b827a2a2926af8aee4ba1e520417730753d7  f00346.jpg
7f78f344c02623d8d2e682d9089b9c59a1159bc393ed773bcd418d0db9dea3df  f00347.jpg
64fb60474486a9cb4affc63857657debac99ea3db166c1e57512eefff830b32e  f00348.jpg
f2c9289b9384cf586f95344cdc3ba5e487d0b9f0d2e1f23a7816f18be17ace0d  f00349.jpg
4ad09ae6143df6810e19624a9f76553c3b7a089eebad25c19b3bb827935df8fb  f00350.jpg
8d34947a01e50588f2fb8805e9773c2c5d7f8755eb74a23a34089ba5f958b084  f00351.jpg
caec683b75ffa010b708ce1451e52d01bf9ac93fba1a7bc35e28b5fc7260cf55  f00352.jpg
8003d2fa2216a7fa58e8571f052e6c696c7781ee2b7a4b03ca6630429de28d15  f00353.jpg
a20bde7ec5ce42299db03849d1066f65b91a06fd9b045c673beb18187c67cc3c  f00354.jpg
1a78c16de80accc6ed563645455d533bba5607edab438f2afe18ba3e368a3e3b  f00355.jpg
14e48a9d4f2822dfe4da535458f15c1b77f2dc32cd3268eeb3dc3268d7dcfc03  f00356.jpg
d243bc5081f404f684c8eaa52205437b918f5114db8a4aa31ec5adc6de481850  f00357.jpg
401b5772c9256911949ec3afecc4a71c12a13585479e7a2f4f4e5b2b6ec2b4c8  f00358.jpg
5abdf113cc5c91f2d5e275cde02c95e6eb86aeaf528566a9569647e7789c66d3  f00359.jpg
1989c12aa82036ff271eebd0a6efe9feab258388b1901c719f510e4a310a8b3a  f00360.jpg
c31a308989c05776a36bbe05fffe8f9144f51c04a7d9c8c2cc77274b33335b03  f00361.jpg
80767d22af275a30967d5b03fd1ccc448299670821aca196629023c00591029e  f00362.jpg
00d69507fa45d826027e281ef08f851e2012d3ee09945c96fbfbca606c687eb5  f00363.jpg
cf2b8b7493dcb2b574905dd909e061849317b2e55b539aa6faf610597709e07a  f00364.jpg
8dfc5ad0e1ee45cdd72cb4b563c0a3f468941358f5783b44c98d44b8d78e395f  f00365.jpg
cdbd40736d97db1a6dbd9e6cca04d6c2949a6448dfae78d90466ef0e09edd778  f00366.jpg
1ef6950e3b7b01d83138113256186c016e6d8fe78829d7c31247bbc0bc562e60  f00367.jpg
52f71d6ce0baaf0405755762540ef5fa0ac7cf9648e3489092f5c23286101468  f00368.jpg
3470090aa77671e0b796bac090fbd416ba53c9f836035603f9d2b216741c4ee0  f00369.jpg
48f8fb4c69bfa8190d62c324f72ad335f32cad560d308ea93849935d62ff5104  f00370.jpg
2ca411e781f4611ee7c8ca53d48c8020b8bf0de0567e3fd906e921b7c3c52262  f00371.jpg
26e66eebf8c3e4b297286b251a506d1eeb8ca11f7fb7470fd5f555f349e10163  f00372.jpg
263b6381959664904dc227e920debf4fd7ec7fa95c16629fe12303eaffc873b0  f00373.jpg
4f070bed3a102b7132da4edfb7029c26f7ef1c434bfba01e850e3f0b7d4ee380  f00374.jpg
725e8527a3771087c7458269c55faf7fb7964ab0a450b87dc42063e7d48b4107  f00375.jpg
0c37af4b648cae35b87db48af52383e712abfda47a5fe9f9d144f96e9e65f807  f00376.jpg
124ce66ac9cbf1710591998d0a182147c6fb733aff1b8e460168a68dc5896fb0  f00377.jpg
d28b64c6e7a1f6a8f22dce5195247a236b69a73d9711fcb211fcf23f48215d5b  f00378.jpg
48cad35fbc4a2a084fd10d1b16bcd1885e65fa0088e86694a009c17a6cb029d5  f00379.jpg
41d2ee90f37785aa0e37a9026650649dd5c99dfd030b4601f29de535dfe828ac  f00380.jpg
2f98a043dbae6ea445290832527106860a9c788a6e65ae7deba06d2e9f6d0e01  f00381.jpg
c01bad492dab67cfd4829a707c949fa1521399bbf7c92105980ffe93fbccb50c  f00382.jpg
afddd441f6295d4e7d6b1972699afeeff05641f609a6764ef52647c0a7a6c94d  f00383.jpg
8a610dd7270968a4e334c8fa6c627fca5f60f022fedcc76cc81e2260c7a5b472  f00384.jpg
a3b1bfcbe38c926b0c729289a44354cc29560b650c49cc1ae51ac1c6fba912bf  f00385.jpg
1fdf49f3dd9f9a3df9517608f88b4a2780c859e3004c69cb1a1aad2c409dfdeb  f00386.jpg
696ea6e8e8e4da580056b6b1e34abc057eb8e599e88b9e0d411bbceff64e0e00  f00387.jpg
f849f20df85aa84d5d9aafc7091df678bb9125d5fc51794f85f86f95ce2ef79a  f00388.jpg
82a28efd99f686e9f927d68a0af60e77d85fe3a53cdd990334ee30a4a72fcef7  f00389.jpg
16831673a98063b69e1dec061dc12cdcbcc186fff279222064462c634b46fe37  f00390.jpg
be0860181e8e5c5f92cafb1e52b4167e60e0e2265c9f756b49c8f79cccb76f35  f00391.jpg
28e1b6529f19da77d73a2e941baebdcb5b15d65a5f952ff2b7f0b7c622159b4f  f00392.jpg
f821524f449446ce26e7340d7c018e715dcedc95b3b14c11a93b0ade4d4af7ce  f00393.jpg
af767b328084d0f36affd03c6bc95b95a4b3a635661a7183629940a90e6f7678  f00394.jpg
17e1a16efecc4be73c24ddcda2bd3ad7b3db202b81c38dcb7749af9b78f97839  f00395.jpg
2a6df768dd98ca51e5783b1404a398c802ab7c2140b208ad220af70fd027b552  f00396.jpg
d830a3c95eaa4c88b194ba224ef07ce2d864c4fd3f43f49949b2849bf82a0312  f00397.jpg
9f9092d1ac34f3f2d345522d20e6c78fdc5350c27e9eef006695f828da31868b  f00398.jpg
84393342c8a69572f2e76191b3e4f7889317064dd041d58bf2777a736acc001f  f00399.jpg
80840d817a47823663f55b89efb48a441a803b3fd6b7a7961a4ee80631dad5b0  f00400.jpg
47d3725432b21ff7cfd938f0c12745ad41033d1e29badf6f04f30a4918778203  f00401.jpg
e8f791cb8f0d8c6615cb0e0877a1011a9c0ac4abf04b91643057c929194c2d4f  f00402.jpg
a3b65a836d1a454be7a25685b515e966aa2fe55ecb0177e38b178b8464a89832  f00403.jpg
05ede95a6ee3d2dba5483ce39c9c5f487d204fca947331d83ded31acad47a971  f00404.jpg
b383b421be6b199000b5318111dad8929548436fab8675e8bbc51b6e8760067b  f00405.jpg
ed66a4a4385a7cedea4ba1952ea94e6994bb95c31c62253251614136e610ef96  f00406.jpg
9742b1cffe004d0e9e7899875209499db1675ecc63574af15f53ae1fdc8ea116  f00407.jpg
a2949f03b2253e4d034f398f7a00899acfede84f9526671646bc2d2a68631fb3  f00408.jpg
e51bca30a0ffd6e313f8f187f39c2fc94a4a44b2d5945146dc2ba8fa56dba7fd  f00409.jpg
467704f03e22966199266c383515c8ceb205e2f60a9214d04fa2b5bd5ae60556  f00410.jpg
b26229d059438150d71eba36443dc330cde9f86c848526c93c2e5b52b07306cf  f00411.jpg
8d7d2eed978d3cdbad2a5823c5d53021f569f9151dacf9af5a9d5f7a27227bfc  f00412.jpg
d497def8db9563089b8c9e1cd44be1d2d97e512d3ff7089e3b557c0fae3639c6  f00413.jpg
3096bce5fbd9f5b6fcac75545d7647ec3e9a2d170b5b1300a133acf9e9f4c6d3  f00414.jpg
77d8dafd9ce1f3e1366789de10a6502321374864363bd673da157a79f9160895  f00415.jpg
22a2fb4d137d21c89b1c64ae436f1e70fc22d3f33a9692278b592b5f8879464e  f00416.jpg
c0362c9d8cb2ad85f34fa02ca64bf740f8ea726eec3071db7cf4b826257ea5e9  f00417.jpg
bf1d13e50381e5409713b27c181891bfa74ea5ea87467c461e94e9ad7258d01c  f00418.jpg
35a6051aa94e1d972cb4553c5c01e7920f54c688a7017a1c8634a0c7d4d58583  f00419.jpg
e78d8efe54e2ce066a35a33fe458c6f346cbce3c1d5ee8236d64c7bea87eab22  f00420.jpg
a15715f0c0e12e3184deecf8363e788e99a360a709339cc35605b55ddbefb7f4  f00421.jpg
20ecb2646aa2082e3604abb4da7f10b1b0c40b0403de1ee8dac8dc67cba5434a  f00422.jpg
fef9387a351a7ce6585f44bbf344b6cc941f46f84dda0c09427b151de97f7541  f00423.jpg
ce2e4363e637aecb0098cc682a626fcb7ec10097ee1bc065dae58a6df02df8ad  f00424.jpg
ef2c95a0a949c4782c65443a0b52b5b603f53f7e8d13f6dca62fbb86d63939bd  f00425.jpg
74fa7d0478c1be02bd34c816294e68e4c08baaefdcdc34ed7083c4b7024f4849  f00426.jpg
f9524561afb7466663e914fe244002693aca0e08e3c66229afe022f2a902edad  f00427.jpg
a8a32e3e3663e89b160c3ebcd704e980767fff77f4d771e3727a6e5a84e97c66  f00428.jpg
c6a4e5fb5fae30dc460a2854691a8e45a7f615a6a65b0f0ef9dcce10413fd6f8  f00429.jpg
689713fd3a9da63699fbd4e509c756a5b79de3420b04293fcd1ad23413d97cbc  f00430.jpg
af6f055e256c460c2ff6dbb76c47367407f9609268c21bdd74f64ac898fbae3e  f00431.jpg
7da2b670e9df7125311546ad1fa91da4675175b8d37297fdcd988a1360f1efa8  f00432.jpg
56c73d14e018398744789cd020c769a6310ee5f4b70c0c422d71d1f5bdb642ce  f00433.jpg
1261ed0828822aadaf5f6e0eeebfa26b0361b092eacd6734fbf147d9bef3f783  f00434.jpg
597c62a27ef5106af0a39a721a04d51c8d3dda156e19a083723a4d0a5968e4e2  f00435.jpg
9eda1aa5b34a61e050d13de2d5fffedf8dbf321a938d39f9c9416412dd06cd19  f00436.jpg
fd64f1349445ab0adc3339b810b7fc9359c704434895fa649b6fe4434e7d55cf  f00437.jpg
4fa179182a9a442b8660d49fb63073b01db497acc17176a0cbf5fbe8f58c0412  f00438.jpg
7aa1ab40bff4b22d97d6df06bb8938a584526199e87af398564a901d6ec0894c  f00439.jpg
161a269f5bbbeca7507a6f6a58936daa99c317f17ba2799d37444de92d57f4c1  f00440.jpg
dcf50073ac7c2bf5e429cad4437d0f6c80af68fdffcdba614fff7b6ba32bc6cd  f00441.jpg
b878c73e05d435fc9b9edf90b82014eb5c0f877d01a6722df284fccef1d4467a  f00442.jpg
1c45f07a904cb59c407d9afee4dcc16d6f266ab61ef6f3ed3e03a6b973ad7b2f  f00443.jpg
e8c4d0dcbecc88be117013170b3c48d9db5e11c626a878ff05a959fb3cd008bb  f00444.jpg
ca5fe3481f1dbd7fd84e520fedb67d3713fcc9ceaa99ca97fbddfbbf5a812eaf  f00445.jpg
efd10d444029277a7e8c2328dcafab11454a369fc94f40e78d8232938fb1e70f  f00446.jpg
3dd8f88def1c4ec2e19748e5a13457cb6e7eeb5db549e9488a322a00c11eeb39  f00447.jpg
198dc82ba1a332e8b65be996d6073454db30e1e944cb42950d48b1b604551b58  f00448.jpg
47298f00fd136ffa68d451d2e62d178db61026712d68d053c74a5852c910e9b7  f00449.jpg
2d5f801ab8f9c89668c3754fc36590ab55aa00d906f745edfae7f25ff12f9e36  f00450.jpg
a6119c941e48690fda6511bc9742bea3db126cbc199c423f5d1dea9076a1f065  f00451.jpg
f1b1f259a54d536e801796a5a3319111fa880510444bc9ff5da603a8d0d740d5  f00452.jpg
a2676981cf5a25809c1970d7d4dbd865e44ef5ef544bfb645431f18d66bd5645  f00453.jpg
c3ed89a6edab69a18f55d5ea621dac256b1b3c4d5f9dbfa3f0aa654928656e91  f00454.jpg
fc626cf25455724140b7bfbd8833b790377e9ac2b5e8b5c37ff71b079cf66b2a  f00455.jpg
9de13676f2f202567b2c3082c827c0985ecda641c67f6500c9e0413aee830320  f00456.jpg
e16f6c8a0bfe1849245ba49356b8ff05d3176ab3464f0d4fb42c41e99bba09da  f00457.jpg
745f140dc136f5db46235bad5978114bdf4a0e3d1d12b22271fdb1025b1d0d3e  f00458.jpg
ec020df7f9cf1917e05777f95d5f0a9a7059470e124a1b6449400e62db7c3f48  f00459.jpg
7d2c6bb97fee500653f3feeb50409e5627d7d621e662b6ae972b066bf81c1f92  f00460.jpg
94219364d27512adc4ec222904c8b19d4128f1810c824d0089586c158ed15513  f00461.jpg
3ff465eef2cbeb73c03b8677f8e352e3215d0bbb6fdec1b09639b03bb73051c8  f00462.jpg
77e2e899066b11f267fc90c73eb2c9d355f119c148b0d4e0bccc2e4b6b8b3f1c  f00463.jpg
b98b6baed63f3f981dfbcaacbe88b83a498db25a6553a7f85348ee340e9cbcda  f00464.jpg
c01cfc30f15533e29fe962a079529902113cb08415c4d1134e3ef3c0ba415ae8  f00465.jpg
24ecfe2dec4304a86ebe1461b8904c336539166d1032b3b68972543d2cf689a2  f00466.jpg
2d1036cab7005735d43dcccee998c147015ebac82dde5e56434a5a03249859aa  f00467.jpg
d670137d4e6dd86e1869a710470750ab0dd0d652b9a8143768a043084df2ecdd  f00468.jpg
f383e1b4c1d965892d1bb52d3fc5db3f36ab500bd991514c56cfb465990a7dc3  f00469.jpg
d0b62fb55038db6366853a1116ff201c9c81d18482008f3ff4002e4461f221e2  f00470.jpg
48f5be247a2ac209358c454f7140c02df4a1e19628f1f7d1c0f620c9629d8501  f00471.jpg
adcb2bd2d78fa549905d4f02fe5cb80997034136fecddafa120876bfa693cbc8  f00472.jpg
df4cec42a86ce567adca63b26196e7ddd194e07ee6da5774bf60c3c4600a2f4a  f00473.jpg
6ccb9f207e05154c38b1678b7ff6ecb6ce65af910baa3aee675be066ee247bad  f00474.jpg
c4bee041c66e2314efdb8de353e9121311aef0dc40eb524422510d905481a3a9  f00475.jpg
e1459423e16f2e6b1b74223a8bf477e4fce0952b8d8336528674dec7444967d5  f00476.jpg
f87aa706795943babe3ec25ee0d109dd504a0947691ef6b54fa6bccdc670a555  f00477.jpg
215342ff1b6ac2db09237d24d206bd48b532662826d8f591cea23280c450e9a3  f00478.jpg
891953cfc59cdf842c4f98476ebb113500727f4e7d2cd84b7d4489061b68de5b  f00479.jpg
32a63714b97919aca3616fb10a4d8c13ba10d1893fbee9a18e986c429d45834b  f00480.jpg
6604466f7f96fd8ff8463bdbccbbb9c608745afb46281ac7659e03bd76c34ea6  f00481.jpg
379ad1fea7ba793d66df42acac4233559cf29f25669321cf934cd8d0e23834e4  f00482.jpg
771fd56c320e3eaef2deae46c10dc789a982ea73366bf7b852f30691d4b625c7  f00483.jpg
ade8eff9e8a278083f4809a06c878743dcbe87378414cb0232b15fee390d4c5c  f00484.jpg
3a00cb11c94428592a2cb8343b3e92834db0b0dbb511ecb5f3f29ff838f7e8b4  f00485.jpg
b0a00bf08b673800b6ae6f1bd716170709d4aea921ff183a4599915d6d220281  f00486.jpg
8010e830ef345238e0dba907c852f28b78147fcff249df65faef3261bc1fd34b  f00487.jpg
c400837b5153923fc87038c50aff27790f33af86a7f1437dc8cc8f9759f1554b  f00488.jpg
d10b6380ab96ecb84204cd0b9ece51f345ab6ecf0e1626d249ba2eb82f9fbc5d  f00489.jpg
965ecd1d3dea61e136e997ac371a4d62e4103f6377266420dcd98f155ae681ed  f00490.jpg
4e5a8b5bf695fb9011cfb146ab6975dad0cdec04f902881dd61a69fe4075d462  f00491.jpg
974061a9346790de4f8ccf856c59e4a093a6eaf72d99ca6a2cb7480c2e1e3106  f00492.jpg
aa099b0e2a3b9aa64e8a8fd16da777ce3423c0e3310d26fc84ec7c90ffd43650  f00493.jpg
b7ca21b4746b4ce7cf08d79cb51832c35bac9b4ad6e36506d196b125a6d1be0e  f00494.jpg
1afa61ccaf108e7e00fc1b0256cf96391dd99d64c529510a565584f714ef54b4  f00495.jpg
79926ee2f6d572afe9655d2259a6830895b93f21d1c1deadb4cf22733123fcbf  f00496.jpg
5e81776ff5444135fdd5a14f297101d816227d965d0e0337270491175c4184b3  f00497.jpg
5c2c1d57a14dfd56b8fef942bf10e3c6ad4f2a5474f7b82e4423e8f044e90e28  f00498.jpg
535e76a389155aa930a6bfc75e028388d91d342521cb3c6f192067e3800fda24  f00499.jpg
103aae5d4c4a18972159798958244549969e967369ce5a9d9c856d901e93bac7  f00500.jpg
9991f90fa5f510f700cbb1477edc9c47dd0171dc64b1d069cf2d5ce48a375e53  f00501.jpg
5f180432d88370885548411d11b38e6402db62709513a60faa7f74ed16578093  f00502.jpg
70d767fa1d7377e3dd9a41657998b176e235e21c046ed29203dc2e5bf047fd64  f00503.jpg
d569d86dbd40f5eaf3056f5018b63e7fdf35e590ea6cfceb7fec7dff415984f4  f00504.jpg
09bf0af4105da887eb5662956d6c565e65735b965e21f7c16e0a352e3ed388a2  f00505.jpg
94941cac34d9232267187f0e393c8b889da4be5c27ad77e0b980c907b117b68f  f00506.jpg
1025b2e2e932c22f6569889393e42a406e5b27a28765f67f74378c43aed8ca16  f00507.jpg
efada7626d44cedac6b625b8106c04d2c3d71f7d9de603ad5b3234fe41da587c  f00508.jpg
01bcd4c1e6c3fe08b493111a33e687dd785ed97afce4dae07fcbe212f188256d  f00509.jpg
be262efd278703520809454eaf41c8059da13af079b7237c9e9492d277cec4c7  f00510.jpg
c8118d02f422fd277205dedc58c826f9eae64a69c34ed9003ea218722de575af  f00511.jpg
6fb6db5308e9fe83b3eb5f7d96dd8ea32dc9e798e9b561ea503516d897cc096b  f00512.jpg
d20e7b582e433746ea16df1098bf4e9770f2e7477b37168ef57a9e46ab0417ff  f00513.jpg
3db910d2fcce73b05cf6c1d33b5dcb49c527bedbe48059de638615a1768c5ef1  f00514.jpg
7a7ff79917cd17c3a8dd9423e67dd5ce2b561bc29bd25689b0588970faaf0d08  f00515.jpg
2c0d5fbc1ae40d5101ffc154b76eb51592cf63888708237b7a3a09ea9604d90d  f00516.jpg
1be17ec82bdca620753749b11cf63addf89ba83fc2c64e6b30d239a8b820d62f  f00517.jpg
b3c9c72681d0f2fb448317486f1f969ab5c2fff3190fcfd636a4cf7711fa1447  f00518.jpg
0dc027d61b2d379a795c91de30ad5398714a0a6ca50ce602f0ac32f104a0be72  f00519.jpg
becc14c6aa09e6aa562948858c9f24f4d1b9e5f3cc0f21c837c1479927d5af36  f00520.jpg
e31ec8570da970778dc81178afd0b40a7aaa30067aaabef9e3850ec327ddcb6e  f00521.jpg
a0c4f3e38dd2ed567e18fde43e6ba3e05b41280ac840a03eac78cf1b6724009a  f00522.jpg
dabe965719010e172210181861d416a8dddafb6e12e2e3d907186b4b76071424  f00523.jpg
64e6a09f903117dc54e918554e28cb383bf79fcf6a9a6e573871d4686c9f17c1  f00524.jpg
3a8ac93550a58a0cf9b2bc9b755dc193e14344a4917e9d0a968a1830f778255f  f00525.jpg
0aa481596eb50ed55b850fb50c3b620cd2ef60bd1aa363ef3dfe19a83fd9af5e  f00526.jpg
d897a69d8aae54499ce56ad5e096a0b2f09ec187436c555ac44653c7467d3d4a  f00527.jpg
5e4a2744593686b641b155c21ec166b1131dbc2330eec96bc7b365960b50c441  f00528.jpg
c8cc509c5e4f6264c056da9af77ee89f853d050b8ff8bafab04463e7916abf8b  f00529.jpg
3defbcebe160f512d474886aa44561e6ef74bf093e60bac7eef54119d1051d55  f00530.jpg
bbb0b3a1305f25bbaee5ed6a9b63ed35702f37a7d9effebdb94b68c7c0564036  f00531.jpg
24f140c1b8e781ad46b1bdf314284f805ec6d20bd87f406ee897ccfc0e802c73  f00532.jpg
62b25a842dc1495a098dccaf33c4978b490be8eb6251568506138bac44fa5ed7  f00533.jpg
d74f2780e4665832401130afa33ab601f4b17d21a4c9eeb4c5f6f3af6815e17d  f00534.jpg
650231f6fc90b83acb1519f7bfb5797f26476c15eaca437a58d999aacda88fe4  f00535.jpg
b3a07590c1f29a464090da2dd66bef96ecc82132870bce635b051dd489af2dd7  f00536.jpg
90b048dab147690e631d279de4269d1b45f2fc0c2551a554e55d87b2b6b519b1  f00537.jpg
277bac95fea45e88bf136ae334efb03f430a501aa53d1b5b60312f67e5b252ac  f00538.jpg
51e8591a0fdca627a007016c7319931fcf2df971aed1c5ae6aba8c87b5f9ba88  f00539.jpg
e5e185a210364ca0e96a3d4871a9200494cc2d2e5f6f01e571f7b0c90f570531  f00540.jpg
90cdc4cad48d3c3a139ab6b694095d750dbecf8e36db4807c2e4a1cab1e785c9  f00541.jpg
53505635b2ad4c1cc804e25e90c0cd9eb98098254ab54e063822aa529970755e  f00542.jpg
1cffe1c12d8306a6b2ad96c1f956788f7b55c9b52a0b37aa5b46f482c74997be  f00543.jpg
959070064994994f570b5db0a07582f2a379c45d670f0215ca08fdf5bdcd1b36  f00544.jpg
5435c7b428d81fd9057c1c2e38a3bf11791e2b20d4c715b2b730727da1b0e1bf  f00545.jpg
ae92f71e45236f1f587e1379e91335cc7d3017cfef37fea8f235b2cfa9acb098  f00546.jpg
1bba272e0c161780bbf6205bd70b1c46ab0b9c6693bf98a7514d0377dd549f05  f00547.jpg
01bc29018f1ff1871b068981959a1842a276b449c00a55aac709327f6248bd7c  f00548.jpg
f9d8be08f936a0464e70d746c075ea0ca4ece9c1cbb31fd015b8fe2a72272510  f00549.jpg
b4133740ec203badd771e262775e2453257e1b9572236b464f43f2038cc27684  f00550.jpg
12981e9859c695a797ae2571a159547dce4f2b9b2ab5847be525f0d7b56203b0  f00551.jpg
d136e68f341c7940264a31e58bc7b51d1b84874ee0375bc1752ec65f18f7ec25  f00552.jpg
5300e9240cfabcbb01414aa9b6e6ded39a47d7c24cc213b2ba02f4395298df6c  f00553.jpg
9964d4afa4e02db1340544ef3ca9c023e49247f347d2adeae170aa43f65375fc  f00554.jpg
153d28c374ce64a73beb11a51df499f05e755f32b445aa1cc22496df3525d8bd  f00555.jpg
6f1640757f7dcdeec72b5290524cb4ceee949be2c41470a426d034b8e9131534  f00556.jpg
fb43aa6fe2a0ce4d9afcb330e6fbc70e50a519de1907958cd0cdf686c12390ce  f00557.jpg
672ae56a12b0978db174976dd225ddb347ee0518007b1b54378ed71cd81e4ab6  f00558.jpg
fffa22257cc7603a62961592fe22e186b1c9e3a28da1ad6814445726a0d9218a  f00559.jpg
a93612533cb9b1c76fdc6568054e9f9c4c3aacda92de596b47a56ba4dc466f56  f00560.jpg
2583b2787942fd685d872f17badd780568a7fc4131d3a98301aa83ac62312397  f00561.jpg
968bc5dc7ea9e20bfe10a1800e12fb2cac95478466dfc846fdef8ae7fbce807c  f00562.jpg
fed5c5e17893b4356f2a69942040cde2f83a605ce978a19eace283e704d717ad  f00563.jpg
178e27194bfa53873322b99b975983e29b7e810ad1b7aff40f384f280d7aa688  f00564.jpg
22c7ed27ed0aa6226b46d9f5897f55839b5d7a689aaad2e74c36ca6b8a377f04  f00565.jpg
0d422be516259f4e960972bc46050de2e7eaed2a1f7e04d8c216e8f97f9f7e74  f00566.jpg
8818935456e9fceb2bd84ceb81808cf6f14effb0e0a33a163691b255f9423ce0  f00567.jpg
0da0cc3ab47c41da06e48ac9b27d7f96f5073e04f0683ef8f5000274a783ccdd  f00568.jpg
d3de96354d4f272e34350234edb5539375ef172dbfca01b2b272459015510e66  f00569.jpg
aa0b568e92c7a6892d39e719487f59bc20a46c408e1dfbffd114ea9d42591f07  f00570.jpg
aed924c7e76042cacd75ec1aacacb0ddfcd6e0650326597bf2fb9b398ba7f5e0  f00571.jpg
5bd94ee5237b978448bf4c321cce62ce65963ecfbc7e684d4f3de96678c67617  f00572.jpg
5477c6e90515352769a4c1a46af8c69d3cc360ac0d08963a0a898ab98b8ed0c2  f00573.jpg
2eee4c45d37516d68e652092177e340c770cc792a4741e9389fe733961c9252d  f00574.jpg
9f994234f9851722bf6dbf9a908128891d87a6a86e5168723c78d92dcdde37dd  f00575.jpg
ba900a662f060e8572229cb156658bdca486060a642fa998ae46d56bd4709684  f00576.jpg
529a06eb5d7bbc94b3c6a430faf87dc7b09708dd471c74bf0dbaa387c4132131  f00577.jpg
3789eb7f44872348725a77974729f1b9049907bcb475d3f027f276d426a84e9d  f00578.jpg
b8184bf42abd3d835bcaa9452e00dfa211d8eaee2ebbe534ba9de01e42090228  f00579.jpg
daf56485a5cd95bbde39cb5037c841537b81f21f46b3f1560e7c044d1f702a2c  f00580.jpg
9548287798a3d425566a5f25a749e1448bd1469618e145d80d9cfbec56a72fa3  f00581.jpg
d60aaf9972f64911075ebc1ac50c7e4b70b5908a4aedf017badaf9538252fa7f  f00582.jpg
e26458fb211c137e5dcc6e3a812a82b1f62610f443008e467fc1a115c33e4f1e  f00583.jpg
e3b1d9d7c3c78a182b1a8fef0bcee7e683eda4dc18bbc3d05895e5ce88c47949  f00584.jpg
29c9c66dbc570bebd3e0b0a90cde90ed32c22a5af7fa0c95e9124de4e1448665  f00585.jpg
92244c49167254396d69f58ecfd4400ed6d53edf5cf4ac95a2987a72478a4312  f00586.jpg
c058c67aa7e4c9d70c606192e6406aefc209e9bf56514c8257cbe10b5612ed5e  f00587.jpg
29ce909a37c7a98086c98a37f782c3c2f6df367e3f79b3b01ea741a2b9068635  f00588.jpg
3b9d279fabe990e7862f2fd15f037b741b398d6d58255ff022aad9dcfba2c8a8  f00589.jpg
726b589b3b65982dcc47fcceb003f9946b225600796ea004b880def577b2b055  f00590.jpg
e307015cecd76cf3e6cd91e995ada0b81a8aca5ecfa8f285d8f697af251a216c  f00591.jpg
5fa2756a308e613bad3fd9062dd47acb645d1d2e5f0fef26457643cefcbdca05  f00592.jpg
7cd7b14fb0d2b45ef8c9fbba9d4542d921e65b140f85371d5b3a2679e49728bf  f00593.jpg
add4c5fc55b7ef2fb21647ae0aa55f911486722385aa16d187e0c349ac210233  f00594.jpg
963819a97b7f8fb051ec1e509e64ba597f99f69bbe24e8444ae4f94d56ebc04b  f00595.jpg
3e85659405969b5cb64f22eb5ab3d43c9cca17c1254e59b857cdb766607ebe20  f00596.jpg
1808fe2a770d5cfe0b7a82ebded287cf80bbd0eb9d10b9925bcf6f384da67791  f00597.jpg
63e6dfef709ef4e4d9dcb9e3b983c62e60981ce34fa5dbdb247535fd32945a19  f00598.jpg
67ea30eb2c9d1abf8161af291b6ef051e4c75f02b4f6ea674757e2ae8468390a  f00599.jpg
4eefaa652b262bb3729ecb07b39ce3ca1a3a08d1a474a77e7606011f941ceb00  f00600.jpg
4d41fb7fd2cc5bd30ca84242ba86d2623a3b0db333896b3ab28517558386b29c  f00601.jpg
2d4b6e63bb606d1bcbe5020b4d0c6ec4cba8273345d58ae8e3a70f467776bb51  f00602.jpg
a9f45aecca7a0b96026baec40fe2335f3e7994154de93c3850772873383c6484  f00603.jpg
0193183b1d42827902bbd124434babc86c602baf6a349905ff526f98c08a2539  f00604.jpg
e6bfafb6b751875a1082bc833562e3b7dd50db479694cf1a220c18a531dce23c  f00605.jpg
6d00697b76c58a00e6fd2171585bc26fa6396db45bffe00a0b5dfaf8cf453cfc  f00606.jpg
1429cf30d44b5b7e5d6e98a252485720397e57aee47db2dd8707137c512f22d7  f00607.jpg
e909aa8b7fd16b0f6ab8f7e8cf89905e94e51ac90282565192efb51f585e0a88  f00608.jpg
efd0dc6103cd5f741c766ef1ed8217fa3e04d6dc1ab959e1cd6b8a844bdf3b75  f00609.jpg
cb7c008b0c2e40cce06b4e9c9f41b61268757711e415511b5171f1c2c8f4a093  f00610.jpg
0f2d8f70eee0b0be163a054b28d0fc70b8eb9e2a14ba11b7bab7f10e1e7d0e1e  f00611.jpg
5a1f8dd2bf3126f9c15de7e65e1858a42a7d6a9419b26a3a9692ee0709c2bca2  f00612.jpg
775cbae2cc3b6535316e3aa65f40cf6d4778a38eba4aa14dc5ec4056290d000b  f00613.jpg
6a9df5cfad2b8c5f79e5b2f2d0c2a43375c557c82fdd21fe2f85f3a3df2685e4  f00614.jpg
52455a4e997a85728907ab879cd0e85cc2e6703cc4c423195c900cff659bd841  f00615.jpg
8d21c886347eb02889e748c327103447a4b061f4f86c305a161d12bde369da04  f00616.jpg
dc836a6e31ebd5782cc148695723e7a98f3e97ceace4465dcf4cf46bfd263bc7  f00617.jpg
02af13c4caf4ba8fb6c6aab497b225423d67f0996990636e3d5b3fd75b439321  f00618.jpg
159b116d0f08ab4285884c031d613779701ef93551d6ffc6bfc19efc553ed2a7  f00619.jpg
b54ede93a6b38d0a7f82921c15f9e73f69b8c2a705c75be947f83efddc9519d2  f00620.jpg
f4fd3432b76de14da26d0042c8cdb881e25f455adea6fa412fd2f289f392de13  f00621.jpg
f78b2c3bedd2480dc78a173c7dcc5ccca13048b90cab352f890ed19cbf767300  f00622.jpg
62418766b077fb2252833a590fb6c56bd78b6ef246790aca0fdca0422aee0128  f00623.jpg
811074e18e912fca9c3024b23df1423d851150348b59dbf99bfdde12f7880ed9  f00624.jpg
8ef2cc6d3eb29d4c5850ba69a5a6e278d1069053a6ceca70128e7872aba44ae2  f00625.jpg
ba808ddf276425be0eb5b1bf9dda9b43d7aed7de91e78aec7ecafd6a517da401  f00626.jpg
abeb3cf14c7fcb52b54ff14497e589ea175d4903027e50d8944f66859db1ce00  f00627.jpg
1b1b815202cad67cc3570a98db1bdf8d3cfd93aa427332c4d3577d145840d79c  f00628.jpg
46709bdf2a0da7ad66054d306acfaf50ff35c27c49b74192ed2c9a466e179638  f00629.jpg
38f9b2716b9269998960c16f2a81b450251a12699f61035834d36f1351a1e0be  f00630.jpg
195c71054f7c7ab4cfb4fce7c7b5f174f2838930b1eb4628009abdb7ea5e628b  f00631.jpg
d1cda02ecc018a77bcd52db6e473a5d3facd8e302a7ce80f911b8f586128dd5a  f00632.jpg
d4848b336fc0d3276e4ebb64d96155490bc696cbabcd5dd7500f36afe1ff4212  f00633.jpg
29ddc105b2ae1cf6c19fa2978a48180d7ca2552659138d3b483e3a7d79624f84  f00634.jpg
f3917111561cb32acda8f04f218ea64c263559caa9406bf044483996f101389d  f00635.jpg
6a2f1ad52dce178deb1057e0fd4f93f8f1595e2486301c0658dd86f2db3e2c27  f00636.jpg
78d8ae155cf811d1cdaf6c911b9d05567c222b23efe091050627efc031f1a42a  f00637.jpg
2caf68dc5859478414838616129a78ddf6a67acd30168c92a9d4cffd70d0cb11  f00638.jpg
f73b510131f752858f9145c75aa92b99b524197002f49eec9aecfb9ce3c1c866  f00639.jpg
ecc90672e7adaa77bfc114de987114fb0b95dacdd0dd432ab579e395699baada  f00640.jpg
28893f09b83de38ca8631218d74e11bd2bea5370609f3b7d4405b9c9eaa4ce9c  f00641.jpg
3ce37e69af967000b91febd1448615aea5fc3e29c637a2aaf71d77e391c70124  f00642.jpg
4ae56900650675b365a715d2e18f40e8c6b9b0cfebeaeface0af6038bdc0876a  f00643.jpg
44456738dca4c1f97ce11454b022ce9d820011ff6fe3a0321722697053a756db  f00644.jpg
e70f71f05dc376f10dc2eae9a6a0ff4145002f6bd7d9de586f7dc52a426eed26  f00645.jpg
b15c7bb031e95eff376cd16e6221280a4930a56705acc4ad0b98c46e10fc96f9  f00646.jpg
d048242998fb3db5da1f4afc0feb125ef1d0defa7c482d434243474186629255  f00647.jpg
ad837a2bdbac1a5a280d5be737f7b244ab0b3a176819001e253bf7a10c4d5e7c  f00648.jpg
5eb82a3c53fe5818344b82cbc9c5e1a9b5162e43cb8c7f96182c529f0b57399b  f00649.jpg
b505e738f8418b11e0b3735b205e4449f1cf450c08038381cd7dd5db3b382008  f00650.jpg
1cfce718ce1405485749d16a633cc4b4be1753acced7f2ee35be79b6410a3e83  f00651.jpg
335077051aba4ae1addd8177eca01b338010df2fe5283f07e254933de5a5a46f  f00652.jpg
1e94635c0cfe2c625f73665c1e2fad3238532beaeea8c12b9cc01effe979a359  f00653.jpg
980fa0a88a5dae4e34f67356eca488cc8633fa20c07bc3db4f39fd34b5744c42  f00654.jpg
1c2ae46743ad85143754c8a8a2e74ac21ca3039c125a83c3369a4f8e3152244e  f00655.jpg
5a2cfa5674a4c3a1660b238c75385a2d4c4191939c1b8fea27bae8d919a3148a  f00656.jpg
842ad6de357fa7a061b1b3fc9465ab7515504df06d24a95956af319213b7c4cd  f00657.jpg
6112445b7d685a9189580b5f2861de3e2cdf2fc6a52dac48147b19a6d48d8be7  f00658.jpg
293d5e39ba26d5cf7b8c8872f151ebff8c9a7a9ebc0df35c71f05e77bcdcefab  f00659.jpg
a1d893090e391860166010c1be0aa00da79a418c30061c9df37a0dacb184a424  f00660.jpg
05e6288935bef36004089184fd0eb6b4220177c2891e46a6248f38e29ad2db50  f00661.jpg
9aadfdf832f40d060b60d8e2ea1392428ca6f6b428498e2b9af06f2f7ed595d8  f00662.jpg
e9ed3b77bc0aa57a37b9a60c70689b58cb6822bdcc802ba1c13a7cd743541170  f00663.jpg
d8d1ee17a2f093a832f3632f26df47a86b4937e451d441e9a7e027c71416989e  f00664.jpg
d5cb5ee33dc057770c95032696f36cfd9e03906bbe1a46a0f31b6fd7c7551d1f  f00665.jpg
88b832643519d17c5068f6ab7789f28382dd273f6f30659a4aeb68bbcd901f97  f00666.jpg
e47c825c55a2b455a3810cf4b01c64f9898be9d2ef6332f0f895608f01f444d2  f00667.jpg
6d837cf24e95aa84ed26d8c347203e7a9779ecdce6925945557a08519fd1ae07  f00668.jpg
27f0583b94299d6f72fbf109c462ec0333109e6b229dd845d04f46bb09af32cb  f00669.jpg
11955e6bac307664862ae8d222a9cece2d535ea8ee50dace14570d66b543ee54  f00670.jpg
646605f0495090adc9230538edde4bde4c6be7d27fed2879156a6dd85385b983  f00671.jpg
```

### 11/56 · `moonfilm/reference/loudness.json`
<!-- casebook-file {"path": "moonfilm/reference/loudness.json", "lines": 16, "final_newline": false, "sha256": "0828870c79718c5749593f78a328ca40167139869aae7e6da9043a629e24216b", "original_sha256": "0828870c79718c5749593f78a328ca40167139869aae7e6da9043a629e24216b"} -->
```json
{
  "target_lufs": -16.0,
  "pre": {
    "I": -15.26,
    "TP": 0.65,
    "LRA": 5.0
  },
  "final": {
    "I": -16.02,
    "TP": -2.39,
    "LRA": 4.9
  },
  "duration": 28.0,
  "sr": 48000,
  "ok": true
}
```

### 12/56 · `moonfilm/reference/manifest.json`
<!-- casebook-file {"path": "moonfilm/reference/manifest.json", "lines": 16, "final_newline": false, "sha256": "77edb9eba9f39560964bc60b99d1e33b79f5b33bfa1173adb49192885074e891", "original_sha256": "77edb9eba9f39560964bc60b99d1e33b79f5b33bfa1173adb49192885074e891"} -->
```json
{
  "title": "月光替你亮着灯 · 送学姐的中秋小礼物",
  "fps": 24,
  "frames": 672,
  "duration_s": 28.0,
  "files": {
    "out/final_crf20.mp4": {
      "bytes": 21798041,
      "sha256": "80e7b4740f4fe082cd460c1915fae9f4ac5825b7eeac44b3fc62d20c94593cc8"
    },
    "out/qc/qc-report.json": {
      "bytes": 1517,
      "sha256": "55d1d5e92bcd37354c70a81a24792ffbf1d9c9a3a0c5971f41224c084b8ccf63"
    }
  }
}
```

### 13/56 · `moonfilm/reference/meta.json`
<!-- casebook-file {"path": "moonfilm/reference/meta.json", "lines": 317, "final_newline": false, "sha256": "ee88f82683ee9cc05d23f59302ebbd87292531e805cb5fe23de9597eb6494f76", "original_sha256": "ee88f82683ee9cc05d23f59302ebbd87292531e805cb5fe23de9597eb6494f76"} -->
```json
{
 "title": "月光替你亮着灯 · 送学姐的中秋小礼物",
 "mode": "A — continuous 3D, one take",
 "look": "moonwash — 月夜水彩 Moonlit Watercolor",
 "fps": 24,
 "width": 1920,
 "height": 1080,
 "plate": [
  1600,
  900
 ],
 "total": 672,
 "fontsOk": true,
 "shots": [
  {
   "id": "B1",
   "look": "moonwash",
   "start": 0,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "world"
  },
  {
   "id": "B2",
   "look": "moonwash",
   "start": 72,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "character"
  },
  {
   "id": "B3",
   "look": "moonwash",
   "start": 144,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "work"
  },
  {
   "id": "B4",
   "look": "moonwash",
   "start": 216,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "work"
  },
  {
   "id": "B5",
   "look": "moonwash",
   "start": 288,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "opportunity"
  },
  {
   "id": "B6",
   "look": "moonwash",
   "start": 360,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "turn"
  },
  {
   "id": "B7",
   "look": "moonwash",
   "start": 432,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "result"
  },
  {
   "id": "B8",
   "look": "moonwash",
   "start": 504,
   "frames": 72,
   "camera": "ONE_TAKE",
   "beat": "echo"
  },
  {
   "id": "B9",
   "look": "moonwash",
   "start": 576,
   "frames": 96,
   "camera": "ONE_TAKE",
   "beat": "echo"
  }
 ],
 "events": [],
 "cues": {
  "bpm": 80,
  "bar": 3,
  "subs": [
   {
    "id": "L1",
    "bar": 1,
    "out": 2.84,
    "segs": [
     {
      "text": "今晚月亮很圆，",
      "at": 0.28
     },
     {
      "text": "你的台灯也还亮着。",
      "at": 1.9
     }
    ]
   },
   {
    "id": "L2",
    "bar": 2,
    "out": 5.8,
    "segs": [
     {
      "text": "这几个月会很难，",
      "at": 3.12
     },
     {
      "text": "但你一直在认真走。",
      "at": 4.3
     }
    ]
   },
   {
    "id": "L3",
    "bar": 3,
    "out": 8.84,
    "segs": [
     {
      "text": "不急——",
      "at": 6.1
     },
     {
      "text": "一页一页，",
      "at": 6.62
     },
     {
      "text": "一晚一晚。",
      "at": 7.86
     }
    ]
   },
   {
    "id": "L4",
    "bar": 4,
    "out": 11.82,
    "segs": [
     {
      "text": "每个认真的夜晚，",
      "at": 9.12
     },
     {
      "text": "都算数。",
      "at": 10.5
     }
    ]
   },
   {
    "id": "L5",
    "bar": 5,
    "out": 14.82,
    "segs": [
     {
      "text": "你想让世界更公平、",
      "at": 12.12
     },
     {
      "text": "更温柔一点，",
      "at": 13.36
     }
    ]
   },
   {
    "id": "L6",
    "bar": 6,
    "out": 17.82,
    "segs": [
     {
      "text": "这份心，",
      "at": 15.12
     },
     {
      "text": "本身就是力量。",
      "at": 15.95
     }
    ]
   },
   {
    "id": "L7",
    "bar": 7,
    "out": 20.82,
    "segs": [
     {
      "text": "你照亮过很多人，",
      "at": 18.12
     },
     {
      "text": "今晚换月亮照亮你。",
      "at": 19.36
     }
    ]
   },
   {
    "id": "L8",
    "bar": 8,
    "out": 23.5,
    "segs": [
     {
      "text": "你在争取的未来，",
      "at": 21.12
     },
     {
      "text": "你配得上。",
      "at": 22.36
     }
    ]
   }
  ],
  "title": {
   "text": "学姐，中秋快乐！",
   "at": 24.02,
   "gold": [
    "中秋快乐"
   ]
  },
  "seal": {
   "text": "加油",
   "at": 25.5
  },
  "inscription": {
   "text": "丙午中秋 · 赠学姐",
   "at": 26.05
  },
  "silence": [
   23.52,
   23.78
  ],
  "handFlips": [
   6.62,
   7.37
  ],
  "handFlipDur": 0.52,
  "breezeFlips": [
   7.92,
   8.08,
   8.24,
   8.4
  ],
  "moteEmit": [
   6.88,
   7.63,
   8.1,
   8.26,
   8.42,
   8.58
  ],
  "lanternIgnite": [
   9.375,
   9.75,
   10.125,
   10.5,
   10.875,
   11.25
  ],
  "constLift0": 12.05,
  "constSettle0": 12.95,
  "constStagger": 0.09,
  "constLines": [
   13.45,
   14.85
  ],
  "scaleLevel": [
   15.78,
   16.5
  ],
  "scaleChime": 16.5,
  "streams": [
   16.6,
   17.85
  ],
  "moonFull": [
   16.55,
   18.7
  ],
  "moonbeam": 19.36,
  "petalsIn": 18.4,
  "ring": [
   21.35,
   23.45
  ],
  "skyLanterns": 24,
  "act": {
   "lookLanterns": 9.7,
   "lookMoon": 18.25,
   "smile": 19.55,
   "penDown": [
    21.12,
    21.5
   ],
   "stretch": [
    21.62,
    22.72
   ],
   "relax": [
    22.72,
    23.4
   ],
   "cheer": [
    25.12,
    25.5
   ],
   "cheerDown": [
    26.3,
    27.1
   ]
  }
 }
}
```

### 14/56 · `moonfilm/reference/qc-report.json`
<!-- casebook-file {"path": "moonfilm/reference/qc-report.json", "lines": 81, "final_newline": false, "sha256": "55d1d5e92bcd37354c70a81a24792ffbf1d9c9a3a0c5971f41224c084b8ccf63", "original_sha256": "55d1d5e92bcd37354c70a81a24792ffbf1d9c9a3a0c5971f41224c084b8ccf63"} -->
```json
{
  "status": "pass",
  "started": "2026-09-25 04:28:13",
  "checks": {
    "preflight.frames": {
      "ok": true,
      "total": 672,
      "missing": 0,
      "first_missing": []
    },
    "preflight.audio": {
      "ok": true,
      "audio_s": 28.0,
      "picture_s": 28.0
    },
    "assemble": {
      "ok": true,
      "seconds": 81.5,
      "bytes": 21798041
    },
    "probe": {
      "ok": true,
      "vcodec": "h264",
      "pix_fmt": "yuv420p",
      "size": "1920x1080",
      "fps": 24.0,
      "frames": 672,
      "range": "tv",
      "matrix": "bt709",
      "primaries": "bt709",
      "trc": "bt709",
      "acodec": "aac",
      "ar": "48000",
      "duration": 28.0
    },
    "faststart": {
      "ok": true
    },
    "decode": {
      "ok": true,
      "stderr": ""
    },
    "freeze": {
      "ok": true,
      "threshold_s": 0.4,
      "found": []
    },
    "black": {
      "ok": true,
      "found": []
    },
    "loudness": {
      "ok": true,
      "integrated_lufs": -16.08,
      "true_peak_dbtp": -2.6,
      "lra": 4.9
    },
    "acting.penetration": {
      "ok": true,
      "frames_with_penetration": 0,
      "first": []
    },
    "acting.surface_contacts": {
      "ok": true,
      "n": 1247,
      "deepest_m": 0.0025
    },
    "acting.exact_reach": {
      "ok": true,
      "n": 154,
      "worst_gap_m": 0.0159
    },
    "stepping": {
      "ok": true,
      "runs": 663,
      "irregular_runs": 0
    }
  },
  "failed": [],
  "finished": "2026-09-25 04:29:48"
}
```

### 15/56 · `moonfilm/reference/qc-report.md`
<!-- casebook-file {"path": "moonfilm/reference/qc-report.md", "lines": 15, "final_newline": true, "sha256": "919ff55d2689ecab2fd30745a839d6ee7b0f0af322906667c2529dedc82d517a", "original_sha256": "919ff55d2689ecab2fd30745a839d6ee7b0f0af322906667c2529dedc82d517a"} -->
```markdown
# QC report — PASS

- **preflight.frames** ✅ `{"total": 672, "missing": 0, "first_missing": []}`
- **preflight.audio** ✅ `{"audio_s": 28.0, "picture_s": 28.0}`
- **assemble** ✅ `{"seconds": 81.5, "bytes": 21798041}`
- **probe** ✅ `{"vcodec": "h264", "pix_fmt": "yuv420p", "size": "1920x1080", "fps": 24.0, "frames": 672, "range": "tv", "matrix": "bt709", "primaries": "bt709", "trc": "bt709", "acodec": "aac", "ar": "48000", "duration": 28.0}`
- **faststart** ✅ `{}`
- **decode** ✅ `{"stderr": ""}`
- **freeze** ✅ `{"threshold_s": 0.4, "found": []}`
- **black** ✅ `{"found": []}`
- **loudness** ✅ `{"integrated_lufs": -16.08, "true_peak_dbtp": -2.6, "lra": 4.9}`
- **acting.penetration** ✅ `{"frames_with_penetration": 0, "first": []}`
- **acting.surface_contacts** ✅ `{"n": 1247, "deepest_m": 0.0025}`
- **acting.exact_reach** ✅ `{"n": 154, "worst_gap_m": 0.0159}`
- **stepping** ✅ `{"runs": 663, "irregular_runs": 0}`
```

### 16/56 · `moonfilm/reference/qc-report_crf18.json`
<!-- casebook-file {"path": "moonfilm/reference/qc-report_crf18.json", "lines": 81, "final_newline": false, "sha256": "d210040fe9e437c16d88fb53801ddaadfad66dea0d3f4869f3f83585f6fc5406", "original_sha256": "d210040fe9e437c16d88fb53801ddaadfad66dea0d3f4869f3f83585f6fc5406"} -->
```json
{
  "status": "pass",
  "started": "2026-09-25 04:26:08",
  "checks": {
    "preflight.frames": {
      "ok": true,
      "total": 672,
      "missing": 0,
      "first_missing": []
    },
    "preflight.audio": {
      "ok": true,
      "audio_s": 28.0,
      "picture_s": 28.0
    },
    "assemble": {
      "ok": true,
      "seconds": 91.8,
      "bytes": 29183634
    },
    "probe": {
      "ok": true,
      "vcodec": "h264",
      "pix_fmt": "yuv420p",
      "size": "1920x1080",
      "fps": 24.0,
      "frames": 672,
      "range": "tv",
      "matrix": "bt709",
      "primaries": "bt709",
      "trc": "bt709",
      "acodec": "aac",
      "ar": "48000",
      "duration": 28.0
    },
    "faststart": {
      "ok": true
    },
    "decode": {
      "ok": true,
      "stderr": ""
    },
    "freeze": {
      "ok": true,
      "threshold_s": 0.4,
      "found": []
    },
    "black": {
      "ok": true,
      "found": []
    },
    "loudness": {
      "ok": true,
      "integrated_lufs": -16.08,
      "true_peak_dbtp": -2.6,
      "lra": 4.9
    },
    "acting.penetration": {
      "ok": true,
      "frames_with_penetration": 0,
      "first": []
    },
    "acting.surface_contacts": {
      "ok": true,
      "n": 1247,
      "deepest_m": 0.0025
    },
    "acting.exact_reach": {
      "ok": true,
      "n": 154,
      "worst_gap_m": 0.0159
    },
    "stepping": {
      "ok": true,
      "runs": 663,
      "irregular_runs": 0
    }
  },
  "failed": [],
  "finished": "2026-09-25 04:27:55"
}
```

### 17/56 · `moonfilm/requirements.txt`
<!-- casebook-file {"path": "moonfilm/requirements.txt", "lines": 8, "final_newline": true, "sha256": "5517bb886efe27bcf7cad4d948fb6d9b98f546d2535da5e165655e53ebc30f6e", "original_sha256": "5517bb886efe27bcf7cad4d948fb6d9b98f546d2535da5e165655e53ebc30f6e"} -->
```text
# Python 3.9+ (the film was made with Python 3.11.15)
numpy>=1.24        # audio synthesis, QC           (used: 2.4.4)
scipy>=1.10        # filters, reverb, WAV I/O       (used: 1.17.1)
Pillow>=9.0        # contact sheets, MP4 checks     (used: 12.2.0)

# optional helpers
matplotlib>=3.7    # tools/audio_report.py          (used: 3.10.9)
fonttools>=4.40    # scripts/make_fonts.py          (used: 4.62.1)
```

### 18/56 · `moonfilm/scripts/capture.mjs`
<!-- casebook-file {"path": "moonfilm/scripts/capture.mjs", "lines": 103, "final_newline": true, "sha256": "604eb5dee4df58fcf22111b20d9a706ea9728a054b4d943a587f9116cf9c15f2", "original_sha256": "604eb5dee4df58fcf22111b20d9a706ea9728a054b4d943a587f9116cf9c15f2"} -->
```js
#!/usr/bin/env node
// Deterministic frame capture for a window.film page (see the skill's references/runtime.md).
//
//   node scripts/capture.mjs --frames 0,60,120 --out out/stills         # specific stills
//   node scripts/capture.mjs --range 0:1440 --out out/frames            # a range (resumable)
//   node scripts/capture.mjs --inspect 0:1440:2 --out out/qc/inspect.json  # QC probe, no pixels
//   node scripts/capture.mjs --meta --out out/meta.json
//
// One browser, one page, serial frames: parallel headless WebGL on a small CPU box thrashes.
// Frames already on disk are skipped, so a killed render resumes where it stopped.
// env: CHROME=/path/to/chrome  PAGE=web/film.html  PORT=8765
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const has = (k) => args.includes(k);
const root = path.resolve(opt("--root", "web"));
const page = opt("--page", process.env.PAGE || "film.html");
const port = Number(process.env.PORT || 8765);
const out = opt("--out", "out/frames");
// Chrome: $CHROME, else a Playwright-managed chromium under $PLAYWRIGHT_BROWSERS_PATH, else playwright's default.
function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!fs.existsSync(base)) return undefined;
  for (const d of fs.readdirSync(base).filter((d) => d.startsWith("chromium")).sort().reverse()) {
    for (const rel of ["chrome-linux/chrome", "chrome-linux64/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/chrome.exe"]) {
      const p = path.join(base, d, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}
const chrome = findChrome();

const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(port, r));

const browser = await chromium.launch({
  executablePath: chrome,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--disable-gpu-vsync", "--no-sandbox"],
});
const W = Number(opt("--width", 1280)), H = Number(opt("--height", 720));
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const pg = await ctx.newPage();
const errors = [];
pg.on("pageerror", (e) => errors.push(String(e)));
pg.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await pg.goto(`http://127.0.0.1:${port}/${page}`, { waitUntil: "domcontentloaded" });
const t0 = Date.now();
const meta = await pg.evaluate(() => window.film.ready);
console.log(`ready in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${meta.total} frames @ ${meta.fps}fps`);
if (errors.length) console.log("page errors:", errors.slice(0, 5));

function parseRange(s, total) {
  const [a, b, step] = s.split(":").map(Number);
  const list = [];
  for (let f = a || 0; f < (b || total); f += step || 1) list.push(f);
  return list;
}

try {
  if (has("--meta")) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(meta, null, 1));
    console.log(`wrote ${out}`);
  } else if (has("--inspect")) {
    const frames = parseRange(opt("--inspect"), meta.total);
    const rows = [];
    for (const f of frames) rows.push(await pg.evaluate((f) => window.film.inspect(f), f));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(rows));
    console.log(`inspected ${rows.length} frames → ${out}`);
  } else {
    const frames = has("--frames") ? opt("--frames").split(",").map(Number) : parseRange(opt("--range", `0:${meta.total}`), meta.total);
    fs.mkdirSync(out, { recursive: true });
    let n = 0, tSum = 0;
    for (const f of frames) {
      const file = path.join(out, `f${String(f).padStart(5, "0")}.jpg`);
      if (fs.existsSync(file) && !has("--force")) continue;
      const t = Date.now();
      const url = await pg.evaluate((f) => window.film.frame(f), f);
      fs.writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
      tSum += Date.now() - t;
      n++;
      if (n % 24 === 0 || frames.length < 40) console.log(`${file}  ${((Date.now() - t) / 1000).toFixed(2)}s  (avg ${(tSum / n / 1000).toFixed(2)}s)`);
    }
    console.log(`rendered ${n} frame(s), avg ${(tSum / Math.max(1, n) / 1000).toFixed(2)}s/frame`);
  }
  if (errors.length) console.log("page errors:", errors.slice(0, 8));
} finally {
  await browser.close();
  server.close();
}
```

### 19/56 · `moonfilm/scripts/export_srt.py`
<!-- casebook-file {"path": "moonfilm/scripts/export_srt.py", "lines": 53, "final_newline": true, "sha256": "1b766a9df84d9740ace247128bb62bf5b39e804c896515d14b065c6d0676c49f", "original_sha256": "1b766a9df84d9740ace247128bb62bf5b39e804c896515d14b065c6d0676c49f"} -->
```python
#!/usr/bin/env python3
"""
Export the film's on-screen text as an SRT subtitle file  (added for the source package)

The render does NOT use this file: every character is drawn into the picture by
src/mg/subtitles.ts, with text and timing from src/timeline.ts. This SRT is a plain-text copy of
the same cues (e.g. for a player, an edit, or a translation), exported from the page's meta().

    python3 scripts/export_srt.py [--meta out/meta.json] [--out subtitles/subtitles.zh-CN.srt]

Each line runs from its first segment to its `out` time (the moment it starts to fade). The end
card is split where the 加油 seal and the inscription appear. UTF-8, no BOM.
"""
import argparse
import json
from pathlib import Path


def ts(t: float) -> str:
    ms = round(t * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--out", default="subtitles/subtitles.zh-CN.srt")
    a = ap.parse_args()
    meta = json.loads(Path(a.meta).read_text(encoding="utf-8"))
    c = meta["cues"]
    end = meta["total"] / meta["fps"]

    cues = [(s["segs"][0]["at"], s["out"], "".join(g["text"] for g in s["segs"])) for s in c["subs"]]
    title, seal, insc = c["title"], c["seal"], c["inscription"]
    cues += [
        (title["at"], seal["at"], title["text"]),
        (seal["at"], insc["at"], f"{title['text']}【{seal['text']}】"),
        (insc["at"], end, f"{title['text']}【{seal['text']}】\n{insc['text']}"),
    ]

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    blocks = [f"{i}\n{ts(t0)} --> {ts(t1)}\n{text}\n" for i, (t0, t1, text) in enumerate(cues, 1)]
    out.write_text("\n".join(blocks), encoding="utf-8")
    print(f"{len(cues)} cues -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 20/56 · `moonfilm/scripts/kit/LICENSE.txt`
<!-- casebook-file {"path": "moonfilm/scripts/kit/LICENSE.txt", "lines": 18, "final_newline": true, "sha256": "4016a01b70fb30cf985aa5c3d5540ac3d7bd47062e2eab948bab42d13b3db442", "original_sha256": "4016a01b70fb30cf985aa5c3d5540ac3d7bd47062e2eab948bab42d13b3db442"} -->
```text
MIT License

Copyright (c) 2026 stop-motion-3d skill authors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### 21/56 · `moonfilm/scripts/kit/audio.py`
<!-- casebook-file {"path": "moonfilm/scripts/kit/audio.py", "lines": 693, "final_newline": true, "sha256": "b5904502f165f8ca032692341f237b0ab5d9ac0ebd04bf4191e91a49406323ed", "original_sha256": "b5904502f165f8ca032692341f237b0ab5d9ac0ebd04bf4191e91a49406323ed"} -->
```python
#!/usr/bin/env python3
"""
Procedural soundtrack for a stop-motion-3d episode — deterministic, no samples, numpy only.

Everything is DERIVED from what the picture already knows, so sound can never drift from it:
  * meta.json     (capture.mjs --meta)     -> shot starts, looks, state events
  * inspect.json  (capture.mjs --inspect)  -> per-frame pose signatures ("a>b@u") per actor
  * episode.json                            -> transitions (wipes), bands, end-title timing

Layers (stems written separately, then mixed):
  room   : room tone per variant (day studio / night city) — never true digital silence
  music  : original music, one instrument family per LOOK, chord grid locked to the style cuts
  foley  : keystrokes / pencil / enter clack / mug / paper / water ... from pose arrivals + events
  fx     : wipe whooshes (pre-lapped, audio leads picture) + a signature "stamp" per style
Punctuation: a short music drop-out before the end title, then the final chord.

Usage:
  python3 scripts/audio.py --meta out/meta.json --inspect out/qc/inspect.json \
      --episode src/episode/episode.json --out out/audio [--sound sound.json] [--lufs -16]
Outputs: out/audio/mix.wav (48k float), stems/*.wav, cues.json, loudness.json
"""
import argparse, json, math, os, subprocess, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
RNG = np.random.default_rng(7)

# ----------------------------------------------------------------------------- defaults (override via --sound)
DEFAULTS = {
    "bpm": 96,                       # 96 BPM -> 2.5 s bars: 7.5 s style segments land on bar lines
    "progression": ["C", "G", "Am", "F"],
    "look_instrument": {             # look id -> instrument family
        "diorama": "musicbox", "block": "chip", "clay": "marimba", "vox": "pizz",
        "sketch": "piano", "comic": "synth", "watercolor": "bells",
    },
    "pose_foley": {                  # pose name (on ARRIVAL) -> foley kind
        "type_a": "key", "type_b": "key", "hit_enter": "enter", "draw_a": "pencil", "draw_b": "pencil",
        "draw_c": "pencil", "tap": "tick", "reach_mug": None, "fist_pump": "stab", "cheer": "pop",
    },
    "event_foley": {                 # state key -> {value: kind}
        "hold.mug": {"*.R": "mug_up", "home": "mug_down"},
        "hold.sheet": {"*.R": "paper", "home": "paper"},
        "hold.can": {"*.R": "can_up", "home": "can_down"},
        "rin.pour": {"true": "pour_start", "false": "pour_end"},
        "plant.watered": {"true": "sparkle"},
    },
    "background_gain": 0.18,         # off-focus actors' foley (they are in frame only in wides)
    "lead": 0.33,                    # s — audio leads picture on transitions
    "silence": [-0.8, -0.3],         # s relative to end-title start: drop-out window
    "night_looks": ["comic"],
}

NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
CHORD = {"C": [0, 4, 7], "G": [7, 11, 14], "Am": [9, 12, 16], "F": [5, 9, 12], "Dm": [2, 5, 9], "Em": [4, 7, 11]}


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def chord_notes(name, octave=4):
    base = 12 * (octave + 1)
    return [base + n for n in CHORD[name]]


# ----------------------------------------------------------------------------- DSP primitives
def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def env_ad(n, a=0.004, d=0.3, curve=1.0):
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    return att * np.exp(-np.maximum(t - a, 0) / d) ** curve


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, min(hi, SR / 2 - 100)], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, btype="high", fs=SR, output="sos"), x)


def noise(n):
    return RNG.standard_normal(n)


def add(buf, x, t0, gain=1.0):
    i = int(round(t0 * SR))
    if i < 0:
        x = x[-i:]
        i = 0
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[: j - i] * gain


def pan(mono, p):
    """p in [-1,1] -> stereo (constant power)."""
    a = (p + 1) * math.pi / 4
    return np.stack([mono * math.cos(a), mono * math.sin(a)], 1)


def add2(buf2, mono, t0, gain=1.0, p=0.0):
    s = pan(mono, p)
    i = int(round(t0 * SR))
    if i < 0:
        s = s[-i:]
        i = 0
    j = min(len(buf2), i + len(s))
    if j > i:
        buf2[i:j] += s[: j - i] * gain


def reverb_ir(dur=1.6, damp=3000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ir = noise(n) * np.exp(-t / (dur / 6.9) * 1.0)
    ir = lp(ir, damp)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.sqrt(np.sum(ir ** 2))


def reverb(x2, wet=0.18, dur=1.6):
    out = np.zeros_like(x2)
    for c in range(2):
        ir = reverb_ir(dur)
        out[:, c] = signal.fftconvolve(x2[:, c], ir)[: len(x2)]
    return x2 + out * wet


# ----------------------------------------------------------------------------- instruments (note -> mono)
def osc_additive(f, dur, harm, decay=0.5, a=0.003):
    t = t_axis(dur)
    y = np.zeros_like(t)
    for k, amp in harm:
        if f * k < SR / 2 - 500:
            y += amp * np.sin(2 * np.pi * f * k * t + RNG.uniform(0, 6.28))
    return y * env_ad(len(t), a, decay)


def inst_musicbox(f, dur=1.4):
    return osc_additive(f, dur, [(1, 1), (2.01, 0.25), (3.98, 0.12), (6.1, 0.05)], decay=0.45)


def inst_chip(f, dur=0.22, duty=0.25):
    t = t_axis(dur)
    ph = (f * t) % 1.0
    y = np.where(ph < duty, 1.0, -1.0) - (2 * duty - 1)
    y = lp(y, 7000)
    return y * env_ad(len(t), 0.002, 0.09) * 0.45


def inst_marimba(f, dur=0.7):
    return osc_additive(f, dur, [(1, 1), (3.93, 0.28), (9.2, 0.06)], decay=0.16, a=0.002)


def karplus(f, dur=0.6, bright=0.5):
    n = int(dur * SR)
    p = max(2, int(SR / f))
    buf = RNG.uniform(-1, 1, p)
    buf = lp(buf, 800 + 6000 * bright, 1)
    out = np.zeros(n)
    idx = 0
    for i in range(n):
        v = buf[idx]
        nxt = buf[(idx + 1) % p]
        buf[idx] = 0.996 * 0.5 * (v + nxt)
        out[i] = v
        idx = (idx + 1) % p
    return out * env_ad(n, 0.001, dur / 3)


_ks_cache = {}


def inst_pizz(f, dur=0.45):
    key = (round(f, 1), dur)
    if key not in _ks_cache:
        _ks_cache[key] = karplus(f, dur, 0.45) * 2.6
    return _ks_cache[key]


def inst_piano(f, dur=1.8):
    y = osc_additive(f, dur, [(1, 1), (2.002, 0.45), (3.005, 0.22), (4.01, 0.12), (5.02, 0.06)], decay=0.55, a=0.002)
    return lp(y, 5000) * 0.9


def inst_saw(f, dur=0.25, cut=1800, dec=0.12):
    t = t_axis(dur)
    y = np.zeros_like(t)
    for k in range(1, 40):
        if f * k > SR / 2 - 1000:
            break
        y += np.sin(2 * np.pi * f * k * t) / k
    y = lp(y, cut)
    return y * env_ad(len(t), 0.003, dec) * 0.5


def inst_bell(f, dur=2.2, idx=2.2):
    t = t_axis(dur)
    mod = idx * np.exp(-t / 0.5) * np.sin(2 * np.pi * f * 3.5 * t)
    return np.sin(2 * np.pi * f * t + mod) * env_ad(len(t), 0.002, 0.7) * 0.6


def pad(freqs, dur, a=0.6, r=0.8):
    t = t_axis(dur)
    y = np.zeros_like(t)
    for f in freqs:
        for det in (-0.12, 0.0, 0.11):
            y += np.sin(2 * np.pi * f * (1 + det / 100) * t + RNG.uniform(0, 6.28))
            y += 0.3 * np.sin(2 * np.pi * 2 * f * (1 + det / 100) * t)
    e = np.minimum(np.clip(t / a, 0, 1), np.clip((dur - t) / r, 0, 1))
    return lp(y, 2400) * e / (len(freqs) * 3)


def drum_kick(dur=0.35, f0=120, f1=45):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_ad(len(t), 0.001, 0.12)


def drum_snare(dur=0.2):
    n = int(dur * SR)
    return (bp(noise(n), 1500, 7000) * 0.7 + np.sin(2 * np.pi * 190 * np.arange(n) / SR) * 0.4) * env_ad(n, 0.001, 0.06)


def drum_hat(dur=0.06):
    n = int(dur * SR)
    return hp(noise(n), 7000) * env_ad(n, 0.0005, 0.018) * 0.5


def clap():
    n = int(0.25 * SR)
    y = np.zeros(n)
    for k, off in enumerate([0, 0.011, 0.022]):
        seg = bp(noise(n), 900, 4000) * env_ad(n, 0.0005, 0.012 if k < 2 else 0.07)
        add(y, seg, off)
    return y * 0.6


def woodblock():
    return osc_additive(1250, 0.12, [(1, 1), (2.7, 0.3)], decay=0.025) * 0.5


# ----------------------------------------------------------------------------- music: one pattern per family
def music_segment(fam, t0, t1, bpm, prog, out2, intensity=1.0):
    """Trigger notes whose onset is in [t0,t1). Tails may ring past t1 (natural decays)."""
    beat = 60.0 / bpm
    bar = 4 * beat
    e8 = beat / 2
    notes = []  # (time, mono, gain, pan)

    def chord_at(t):
        return prog[int(math.floor(t / bar + 1e-6)) % len(prog)]

    t = math.ceil(t0 / e8 - 1e-6) * e8
    while t < t1 - 1e-6:
        step = int(round(t / e8)) % 8  # 8ths within bar
        ch = chord_at(t)
        tones = chord_notes(ch, 4)
        root = chord_notes(ch, 2)[0]
        if fam == "musicbox":
            if step % 2 == 0:
                m = tones[(step // 2) % 3] + 12
                notes.append((t, inst_musicbox(midi_hz(m)), 0.33, 0.3 * ((step // 2) % 2 * 2 - 1)))
        elif fam == "chip":
            seq = [0, 1, 2, 1, 0, 2, 1, 2]
            notes.append((t, inst_chip(midi_hz(tones[seq[step]] + 12)), 0.3, 0.25))
            if step % 2 == 0:
                notes.append((t, inst_chip(midi_hz(root + 12), 0.28, 0.5), 0.34, -0.1))
            if step in (0, 4):
                notes.append((t, drum_kick(0.2, 160, 60), 0.5, 0))
            notes.append((t, drum_hat(), 0.18, 0.4))
        elif fam == "marimba":
            pat = {0: 0, 1: None, 2: 1, 3: 2, 4: None, 5: 1, 6: 2, 7: 0}
            if pat[step] is not None:
                notes.append((t, inst_marimba(midi_hz(tones[pat[step]] + 12)), 0.4, 0.2 * (step % 3 - 1)))
            if step in (0, 4):
                notes.append((t, inst_marimba(midi_hz(root + 12), 0.9), 0.42, -0.1))
            if step in (2, 6):
                notes.append((t, woodblock(), 0.35, 0.35))
        elif fam == "pizz":
            if step in (0, 2, 3, 5, 6):
                notes.append((t, inst_pizz(midi_hz(tones[step % 3] + 12)), 0.55, 0.3))
            if step in (0, 4):
                notes.append((t, inst_pizz(midi_hz(root + 12), 0.7), 0.6, -0.25))
            if step in (2, 6):
                notes.append((t, clap(), 0.45, 0.05))
        elif fam == "piano":
            if step == 0:
                notes.append((t, inst_piano(midi_hz(root + 12), 2.4), 0.45, -0.2))
            if step in (2, 4, 6):
                notes.append((t, inst_piano(midi_hz(tones[(step // 2) % 3] + 12)), 0.32, 0.2))
            if step == 7:
                notes.append((t, inst_piano(midi_hz(tones[2] + 24), 1.0), 0.18, 0.35))
        elif fam == "synth":
            notes.append((t, inst_saw(midi_hz(root), 0.26, 900, 0.14), 0.62, 0))
            for k in range(2):  # 16ths arp
                m = tones[(step * 2 + k) % 3] + 12
                notes.append((t + k * e8 / 2, inst_saw(midi_hz(m), 0.12, 4200, 0.05), 0.2, 0.45 * (1 if k else -1)))
            if step % 2 == 0:
                notes.append((t, drum_kick(0.3, 140, 42), 0.62, 0))
            if step in (2, 6):
                notes.append((t, drum_snare(), 0.4, 0.05))
            notes.append((t + e8 / 2, drum_hat(), 0.18, 0.4))
        elif fam == "bells":
            if step in (0, 3, 6):
                m = tones[[0, 2, 1][step // 3]] + 12
                notes.append((t, inst_bell(midi_hz(m)), 0.3, 0.35 * (1 if step == 3 else -1)))
        t += e8

    # a soft pad under every family except the drum-heavy ones — glues the segments
    if fam in ("musicbox", "piano", "bells", "marimba"):
        b = math.floor(t0 / bar + 1e-6)
        while b * bar < t1 - 1e-6:
            s = max(b * bar, t0)
            e = min((b + 1) * bar, t1)
            fr = [midi_hz(m) for m in chord_notes(prog[b % len(prog)], 3)]
            notes.append((s, pad(fr, e - s + 0.4, 0.25, 0.45), 0.22 if fam != "bells" else 0.3, 0))
            b += 1
    for (tt, x, g, p) in notes:
        add2(out2, x, tt, g * intensity, p)


# ----------------------------------------------------------------------------- foley
def foley(kind, rs):
    r = rs.uniform
    if kind == "key":
        n = int(0.05 * SR)
        y = bp(noise(n), 1800 * r(0.8, 1.2), 7000) * env_ad(n, 0.0005, 0.008)
        y += bp(noise(n), 300, 900) * env_ad(n, 0.0005, 0.012) * 0.5
        return y * r(0.6, 1.0)
    if kind == "enter":
        n = int(0.16 * SR)
        y = bp(noise(n), 900, 4000) * env_ad(n, 0.0005, 0.02) * 1.3
        y += np.sin(2 * np.pi * 170 * np.arange(n) / SR) * env_ad(n, 0.001, 0.04) * 0.7
        return y
    if kind == "pencil":
        n = int(0.22 * SR)
        am = 0.6 + 0.4 * np.sin(2 * np.pi * r(28, 40) * np.arange(n) / SR)
        return bp(noise(n), 2500, 9000) * am * env_ad(n, 0.02, 0.07) * 0.3
    if kind == "tick":
        n = int(0.06 * SR)
        return bp(noise(n), 2000, 6000) * env_ad(n, 0.0003, 0.006) * 1.1
    if kind in ("mug_up", "mug_down"):
        y = osc_additive(2150, 0.5, [(1, 1), (1.58, 0.5), (2.43, 0.3)], decay=0.09) * 0.35
        if kind == "mug_down":
            n = int(0.1 * SR)
            y[:n] += lp(noise(n), 400) * env_ad(n, 0.001, 0.02) * 1.2
        return y
    if kind == "paper":
        n = int(0.5 * SR)
        am = np.abs(lp(noise(n), 30)) * 3
        return bp(noise(n), 1200, 7000) * np.clip(am, 0, 1.5) * env_ad(n, 0.04, 0.2) * 0.5
    if kind in ("can_up", "can_down"):
        y = osc_additive(1450, 0.4, [(1, 1), (2.76, 0.4), (5.4, 0.2)], decay=0.07) * 0.28
        n = int(0.08 * SR)
        y[:n] += lp(noise(n), 500) * env_ad(n, 0.001, 0.02) * (1.0 if kind == "can_down" else 0.4)
        return y
    if kind == "stab":
        return inst_saw(midi_hz(72), 0.4, 3000, 0.18) * 0.8 + inst_saw(midi_hz(79), 0.4, 3000, 0.18) * 0.5
    if kind == "pop":
        t = t_axis(0.18)
        f = 400 + 900 * (1 - np.exp(-t / 0.03))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.002, 0.05) * 0.4
    if kind == "sparkle":
        y = np.zeros(int(1.6 * SR))
        for k, m in enumerate([84, 88, 91, 96]):
            add(y, inst_bell(midi_hz(m), 1.2, 1.2), k * 0.07, 0.35)
        return y
    return None


def pour_bed(dur, rs):
    """water stream + bubbles for `dur` seconds."""
    n = int(dur * SR)
    stream = bp(noise(n), 500, 2600) * (0.55 + 0.25 * np.abs(lp(noise(n), 8)) * 4)
    y = np.clip(stream, -3, 3) * 0.12
    t = 0.0
    while t < dur - 0.1:
        tt = t_axis(0.05)
        f0 = rs.uniform(600, 1400)
        f = f0 * (1 + 2.5 * tt / 0.05)
        add(y, np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(tt), 0.002, 0.012) * 0.12, t)
        t += rs.uniform(0.03, 0.09)
    fade = np.minimum(1, np.minimum(np.arange(n) / (0.12 * SR), (n - np.arange(n)) / (0.2 * SR)))
    return y * fade


# ----------------------------------------------------------------------------- fx: whoosh + style stamps
def whoosh(dur=0.8, peak=0.55, f_lo=300, f_hi=5000):
    """Band-swept noise via STFT masking. peak = fraction of dur where it is loudest."""
    n = int(dur * SR)
    x = noise(n)
    f, tt, Z = signal.stft(x, SR, nperseg=1024)
    u = tt / dur
    centre = f_lo * (f_hi / f_lo) ** np.clip(u / peak, 0, 1)
    centre = np.where(u > peak, f_hi * (f_lo * 2 / f_hi) ** np.clip((u - peak) / (1 - peak), 0, 1), centre)
    mask = np.exp(-((np.log(f[:, None] + 1) - np.log(centre[None, :])) ** 2) / (2 * 0.35 ** 2))
    amp = np.where(u < peak, (u / peak) ** 2, np.exp(-(u - peak) / (1 - peak) * 4))
    _, y = signal.istft(Z * mask * amp[None, :], SR, nperseg=1024)
    y = y[:n]
    return y / (np.max(np.abs(y)) + 1e-9) * 0.5


def stamp(look, rs):
    if look == "block":   # coin blip
        a = inst_chip(midi_hz(83), 0.08, 0.5)
        b = inst_chip(midi_hz(88), 0.3, 0.5)
        y = np.zeros(int(0.4 * SR)); add(y, a, 0); add(y, b, 0.07); return y * 0.9
    if look == "clay":    # squish-boing
        t = t_axis(0.35)
        f = 180 + 260 * np.exp(-t / 0.05) + 40 * np.sin(2 * np.pi * 14 * t) * np.exp(-t / 0.15)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.004, 0.12) * 0.7
    if look == "vox":     # scissor snip + paper flap
        y = np.zeros(int(0.35 * SR))
        for k in range(2):
            n = int(0.03 * SR)
            add(y, bp(noise(n), 3000, 9000) * env_ad(n, 0.0003, 0.006), k * 0.07, 1.1)
        add(y, foley("paper", rs)[: int(0.25 * SR)], 0.12, 0.8)
        return y
    if look == "sketch":  # pencil flourish
        n = int(0.4 * SR)
        am = np.clip(np.sin(np.pi * np.arange(n) / n) * 1.3, 0, 1)
        return bp(noise(n), 2500, 10000) * am * 0.5
    if look == "comic":   # synth zap
        t = t_axis(0.3)
        f = 2400 * np.exp(-t / 0.06) + 120
        return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * env_ad(len(t), 0.001, 0.08) * 0.28
    if look == "watercolor":  # water drop plip
        t = t_axis(0.25)
        f = 700 * (1 + 2.2 * np.clip(t / 0.03, 0, 1))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(t), 0.001, 0.035) * 0.55
    return np.zeros(10)


# ----------------------------------------------------------------------------- room tone
def room_tone(dur, night):
    n = int(dur * SR)
    br = np.cumsum(noise(n)) / 400
    br = hp(br, 25)
    br = lp(br, 260 if not night else 180)
    air = hp(noise(n), 3000) * 0.012
    y = br / (np.std(br) + 1e-9) * 0.02 + air
    if night:
        t = np.arange(n) / SR
        y += 0.006 * np.sin(2 * np.pi * 55 * t) + 0.003 * np.sin(2 * np.pi * 110 * t)
    return y


# ----------------------------------------------------------------------------- loudness helpers (ffmpeg ebur128)
def measure(path):
    cmd = ["ffmpeg", "-nostats", "-hide_banner", "-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    j = json.loads(err[err.rfind("{"): err.rfind("}") + 1])
    return {"I": float(j["input_i"]), "TP": float(j["input_tp"]), "LRA": float(j["input_lra"])}


def limiter(x2, ceiling_db=-1.6, look=0.004, release=0.08):
    """Look-ahead peak limiter on 4x-oversampled peaks (true-peak-ish)."""
    ceil = 10 ** (ceiling_db / 20)
    up = signal.resample_poly(np.max(np.abs(x2), 1), 4, 1)
    pk = np.abs(up).reshape(-1, 4).max(1)[: len(x2)]
    need = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    la = int(look * SR)
    # sliding min over a symmetric window = gain reaches its floor BEFORE the peak (look-ahead)
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(need, size=2 * la + 1, origin=0)
    # release smoothing (one-pole, only on the way up)
    a = math.exp(-1 / (release * SR))
    out = np.empty_like(g)
    cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else a * cur + (1 - a) * g[i]
        out[i] = cur
    return x2 * out[:, None]


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--inspect", default="out/qc/inspect.json")
    ap.add_argument("--episode", default="src/episode/episode.json")
    ap.add_argument("--sound", default=None, help="optional JSON overriding DEFAULTS keys")
    ap.add_argument("--out", default="out/audio")
    ap.add_argument("--lufs", type=float, default=-16.0)
    a = ap.parse_args()

    cfg = dict(DEFAULTS)
    if a.sound and os.path.exists(a.sound):
        cfg.update(json.load(open(a.sound)))
    meta = json.load(open(a.meta))
    insp = json.load(open(a.inspect))
    ep = json.load(open(a.episode))
    fps = meta["fps"]
    dur = meta["total"] / fps
    N = int(round(dur * SR))
    os.makedirs(os.path.join(a.out, "stems"), exist_ok=True)

    shots = ep["shots"]
    starts = {s["id"]: m["start"] / fps for s, m in zip(shots, meta["shots"])}
    ends = {s["id"]: starts[s["id"]] + s["duration"] for s in shots}
    cues = []

    # --- style segments = maximal runs of the same look (music changes family only here)
    segs = []
    for s in shots:
        if segs and segs[-1]["look"] == s["look"] and not s.get("bands"):
            segs[-1]["t1"] = ends[s["id"]]
        else:
            segs.append({"look": s["look"], "t0": starts[s["id"]], "t1": ends[s["id"]], "shot": s})

    # end title (first title MG in the last shot with bands) -> punctuation window
    last = shots[-1]
    title_t = None
    for m in last.get("mg", []):
        if m["kind"] == "title":
            title_t = starts[last["id"]] + m["from"]
            break
    sil0 = sil1 = None
    if title_t is not None:
        sil0, sil1 = title_t + cfg["silence"][0], title_t + cfg["silence"][1]

    room = np.zeros((N, 2)); music = np.zeros((N, 2)); fol = np.zeros((N, 2)); fx = np.zeros((N, 2))

    # --- room tone per segment (night variant for night looks), crossfaded
    for sg in segs:
        night = sg["look"] in cfg["night_looks"]
        d = sg["t1"] - sg["t0"] + 0.3
        rt = room_tone(d, night)
        fade = np.minimum(1, np.minimum(np.arange(len(rt)) / (0.15 * SR), (len(rt) - np.arange(len(rt))) / (0.15 * SR)))
        add2(room, rt * fade, sg["t0"] - 0.15, 1.0, 0)
        add2(room, room_tone(d, night)[::-1] * fade, sg["t0"] - 0.15, 0.6, 0.6)
    cues.append({"layer": "room", "segments": [(s["look"], round(s["t0"], 2), round(s["t1"], 2)) for s in segs]})

    # --- music
    bpm, prog = cfg["bpm"], cfg["progression"]
    for i, sg in enumerate(segs):
        fam = cfg["look_instrument"].get(sg["look"], "musicbox")
        t0, t1 = sg["t0"], sg["t1"]
        if sg["shot"].get("bands"):
            # finale: bells + pad + soft pluck build, drop-out, final chord on the title (audio leads)
            stop = sil0 if sil0 else t1
            music_segment("bells", t0, stop, bpm, prog, music, 0.9)
            music_segment("musicbox", t0, stop, bpm, prog, music, 0.7)
            b = sg["shot"]["bands"]
            for k, lk in enumerate(b["looks"]):  # one signature note per band as it appears
                tt = t0 + b["start"] + k * b["stagger"]
                famk = cfg["look_instrument"].get(lk, "bells")
                m = [60, 62, 64, 67, 69, 72][k % 6] + 12
                x = {"chip": inst_chip(midi_hz(m), 0.3, 0.5), "marimba": inst_marimba(midi_hz(m)), "pizz": inst_pizz(midi_hz(m)),
                     "piano": inst_piano(midi_hz(m), 1.2), "synth": inst_saw(midi_hz(m), 0.3, 4000, 0.12), "bells": inst_bell(midi_hz(m))}.get(famk, inst_bell(midi_hz(m)))
                add2(music, x, tt - 0.04, 0.55, -0.6 + 1.2 * k / max(1, len(b["looks"]) - 1))
                add2(fx, stamp(lk, RNG), tt - 0.02, 0.35, -0.6 + 1.2 * k / max(1, len(b["looks"]) - 1))
            if sil1:
                hit = sil1
                fr = [midi_hz(m) for m in [48, 55, 60, 64, 67, 72]]
                add2(music, pad(fr, dur - hit, 0.02, 2.5), hit, 1.1, 0)
                for m in [60, 64, 67, 72, 76]:
                    add2(music, inst_bell(midi_hz(m), 3.5, 1.5), hit + RNG.uniform(0, 0.02), 0.28, RNG.uniform(-0.4, 0.4))
                    add2(music, inst_piano(midi_hz(m - 12), 3.5), hit, 0.22, RNG.uniform(-0.3, 0.3))
                add2(music, drum_kick(0.6, 90, 38), hit, 0.6, 0)
                cues.append({"layer": "music", "t": round(hit, 3), "what": "final chord (title at %.2f)" % title_t})
        else:
            music_segment(fam, t0, t1, bpm, prog, music, 1.0)
        cues.append({"layer": "music", "t0": round(t0, 2), "t1": round(t1, 2), "family": fam, "look": sg["look"]})

    # music bus: reverb, then hard drop-out window (the silence IS the punctuation)
    music = reverb(music, 0.22, 1.8)
    if sil0 is not None:
        i0, i1 = int(sil0 * SR), int(sil1 * SR)
        f = int(0.06 * SR)
        music[i0 - f:i0] *= np.linspace(1, 0, f)[:, None]
        music[i0:i1] = 0
        # the final chord starts at sil1 — rebuild what reverb smeared into the gap is already zeroed
        room[i0:i1] *= 0.5
        fol[i0:i1] *= 0.25
        cues.append({"layer": "music", "t0": round(sil0, 3), "t1": round(sil1, 3), "what": "drop-out (silence punctuation)"})

    # --- foley from pose ARRIVALS (sig "a>b@u": a new key begins when the pair changes; arrival = b reached)
    focus = {}
    for s in shots:
        focus[s["id"]] = {k["actor"] for k in s.get("acting", []) if "actor" in k}
    prev = {}
    rs = np.random.default_rng(11)
    nk = 0
    pans = {}
    for fr in insp:
        sid = fr["shot"]
        wide = not focus[sid]
        for actor, sig in fr["sig"].items():
            pair = sig.split("@")[0]
            a_, b_ = pair.split(">")
            key = (sid, actor)
            if prev.get(key) != pair:
                prev[key] = pair
                arrived = a_ == b_  # held key == pose reached (stepped clock)
                if not arrived:
                    continue
                kind = cfg["pose_foley"].get(b_)
                if not kind:
                    continue
                x = foley(kind, rs)
                if x is None:
                    continue
                g = 1.0 if actor in focus[sid] else (0.22 if wide else cfg["background_gain"])
                if actor not in pans:
                    pans[actor] = -0.7 + 1.4 * (len(pans) / 5)
                p = 0.15 if actor in focus[sid] else pans[actor]
                add2(fol, x, fr["frame"] / fps, g * (0.8 if kind == "key" else 1.0), p)
                nk += 1
    cues.append({"layer": "foley", "pose_hits": nk})

    # --- foley from STATE EVENTS (continuity layer)
    pour_on = None
    for ev in meta["events"]:
        t = ev["frame"] / fps
        for k, v in ev["set"].items():
            rules = cfg["event_foley"].get(k, {})
            vs = str(v).lower()
            kind = rules.get(vs) or next((kk for pat, kk in rules.items() if pat.startswith("*") and vs.endswith(pat[1:])), None)
            if not kind:
                continue
            if kind == "pour_start":
                pour_on = t
            elif kind == "pour_end" and pour_on is not None:
                add2(fol, pour_bed(t - pour_on + 0.25, rs), pour_on, 0.9, 0.1)
                cues.append({"layer": "foley", "t0": round(pour_on, 2), "t1": round(t, 2), "what": "pour"})
                pour_on = None
            else:
                x = foley(kind, rs)
                if x is not None:
                    add2(fol, x, t, 0.9, 0.12)
                    cues.append({"layer": "foley", "t": round(t, 2), "what": kind, "event": f"{k}={v}"})

    # --- fx: wipe whoosh (pre-lapped) + style stamp
    for s in shots:
        tr = s.get("transition") or {}
        if tr.get("type") == "wipe":
            t = starts[s["id"]]
            wd = tr.get("frames", 14) / fps
            w = whoosh(cfg["lead"] + wd + 0.2, peak=(cfg["lead"] + wd * 0.5) / (cfg["lead"] + wd + 0.2))
            add2(fx, w, t - cfg["lead"], 0.55, 0)
            add2(fx, stamp(s["look"], RNG), t + wd * 0.6, 0.6, 0.2)
            cues.append({"layer": "fx", "t": round(t - cfg["lead"], 3), "what": f"whoosh -> {s['look']} (+stamp)"})

    # fades at the very edges (no hard digital start/stop)
    for buf in (room, music, fol, fx):
        f = int(0.25 * SR)
        buf[:f] *= np.linspace(0, 1, f)[:, None]
        g = int(1.2 * SR)
        buf[-g:] *= np.linspace(1, 0, g)[:, None] ** 1.5

    stems = {"room": room * 0.3, "music": music * 0.55, "foley": fol * 0.8, "fx": fx * 0.7}
    for k, v in stems.items():
        wavfile.write(os.path.join(a.out, "stems", f"{k}.wav"), SR, v.astype(np.float32))
    mix = sum(stems.values())
    # a touch of shared room so foley and music sit in one space
    mix = reverb(mix, 0.05, 0.6)

    # loudness: measure -> gain -> limit -> verify
    tmp = os.path.join(a.out, "_pre.wav")
    wavfile.write(tmp, SR, mix.astype(np.float32))
    m0 = measure(tmp)
    mix *= 10 ** ((a.lufs - m0["I"]) / 20)
    mix = limiter(mix, -2.0)
    out = os.path.join(a.out, "mix.wav")
    wavfile.write(out, SR, mix.astype(np.float32))
    os.remove(tmp)
    m1 = measure(out)
    rep = {"target_lufs": a.lufs, "pre": m0, "final": m1, "duration": dur, "sr": SR,
           "ok": abs(m1["I"] - a.lufs) < 1.0 and m1["TP"] <= -1.0}
    json.dump(rep, open(os.path.join(a.out, "loudness.json"), "w"), indent=2)
    json.dump(cues, open(os.path.join(a.out, "cues.json"), "w"), indent=2, ensure_ascii=False)
    print(json.dumps(rep))
    if not rep["ok"]:
        print("LOUDNESS OUT OF SPEC", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
```

### 22/56 · `moonfilm/scripts/kit/compare_frames.py`
<!-- casebook-file {"path": "moonfilm/scripts/kit/compare_frames.py", "lines": 62, "final_newline": true, "sha256": "675d9cc3840a03943af5e61ba685d645f11b2aa231373f79603942e30ca3d0ff", "original_sha256": "675d9cc3840a03943af5e61ba685d645f11b2aa231373f79603942e30ca3d0ff"} -->
```python
#!/usr/bin/env python3
"""Visual regression for sets: diff two keyframe folders rendered from the same frames.

Use it after editing a shared set/kit asset: render the set tour (and episodes that use the set)
before and after, then see exactly which shots changed and by how much.

usage: python compare_frames.py <before_dir> <after_dir> [--threshold 0.5] [--diff-out diffs/]
  threshold = % of pixels allowed to change before a frame is flagged (default 0.5)
Renders are bit-identical on the same machine + renderer when the scene is a pure function of
frame; across machines/GPUs expect tiny noise, so keep a small threshold instead of 0.
Requires Pillow.
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("Pillow is required: pip install pillow")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("before")
    ap.add_argument("after")
    ap.add_argument("--threshold", type=float, default=0.5)
    ap.add_argument("--diff-out")
    a = ap.parse_args()
    exts = {".jpg", ".jpeg", ".png"}
    for d in (a.before, a.after):
        if not Path(d).is_dir():
            sys.exit(f"not a folder: {d}")
    before = {p.name: p for p in Path(a.before).iterdir() if p.suffix.lower() in exts}
    after = {p.name: p for p in Path(a.after).iterdir() if p.suffix.lower() in exts}
    flagged = 0
    for name in sorted(before.keys() | after.keys()):
        if name not in before or name not in after:
            print(f"{'ONLY-IN-' + ('AFTER' if name in after else 'BEFORE'):<14}{name}")
            flagged += 1
            continue
        x, y = Image.open(before[name]).convert("RGB"), Image.open(after[name]).convert("RGB")
        if x.size != y.size:
            print(f"{'SIZE':<14}{name} {x.size} -> {y.size}")
            flagged += 1
            continue
        diff = ImageChops.difference(x, y).convert("L").point(lambda v: 255 if v > 24 else 0)
        pct = 100.0 * diff.histogram()[255] / (x.width * x.height)
        tag = "CHANGED" if pct > a.threshold else "same"
        flagged += pct > a.threshold
        print(f"{tag:<14}{name}  {pct:6.2f}% pixels")
        if a.diff_out and pct > a.threshold:
            Path(a.diff_out).mkdir(parents=True, exist_ok=True)
            overlay = Image.blend(y, Image.new("RGB", y.size, (255, 0, 80)), 0.0)
            overlay.paste((255, 0, 80), mask=diff)
            Image.blend(y, overlay, 0.6).save(Path(a.diff_out) / name)
    print(f"\n{flagged} frame(s) flagged of {len(before.keys() | after.keys())}")
    return 1 if flagged else 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 23/56 · `moonfilm/scripts/kit/contact_sheet.py`
<!-- casebook-file {"path": "moonfilm/scripts/kit/contact_sheet.py", "lines": 74, "final_newline": true, "sha256": "c7378739f09122bbb522daea34f480da2af5e65155b6780b8bca5583e8f1e292", "original_sha256": "c7378739f09122bbb522daea34f480da2af5e65155b6780b8bca5583e8f1e292"} -->
```python
#!/usr/bin/env python3
"""Tile rendered keyframes into one labeled contact sheet for visual QC.

usage: python contact_sheet.py <frames_dir> <out.jpg> [--columns 3] [--width 1600]
       python contact_sheet.py <dir_of_dirs> <out.jpg> --rows   # one row per subfolder (e.g. one per style)
Frames are sorted by the trailing _<frame> number (else by name); the stem becomes the label (e.g. S03-b_0180).
Requires Pillow (pip install pillow).
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is required: pip install pillow")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("frames_dir")
    ap.add_argument("out")
    ap.add_argument("--columns", type=int, default=3)
    ap.add_argument("--width", type=int, default=1600, help="sheet width in px")
    ap.add_argument("--rows", action="store_true", help="each subfolder becomes one labeled row")
    a = ap.parse_args()

    def order(p: Path):
        # keyframes.mjs names files <label>_<frame>.jpg — sort by frame so shots stay in film order
        tail = p.stem.rsplit("_", 1)[-1]
        return (int(tail), p.name) if tail.isdigit() else (10**9, p.name)

    imgs = lambda d: sorted((p for p in Path(d).iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}), key=order)
    if a.rows:
        groups = [(d.name, imgs(d)) for d in sorted(Path(a.frames_dir).iterdir()) if d.is_dir()]
        groups = [(n, f) for n, f in groups if f]
        if not groups:
            sys.exit(f"no image subfolders in {a.frames_dir}")
        a.columns = max(len(f) for _, f in groups)
        files = [f for _, fs in groups for f in fs + [None] * (a.columns - len(fs))]
        row_names = [n for n, _ in groups]
    else:
        files = imgs(a.frames_dir)
        row_names = None
    if not files:
        sys.exit(f"no images in {a.frames_dir}")
    cols = max(1, a.columns)
    rows = (len(files) + cols - 1) // cols
    first = Image.open(next(f for f in files if f))
    cell_w = a.width // cols
    cell_h = round(cell_w * first.height / first.width)
    label_h = 22
    sheet = Image.new("RGB", (cell_w * cols, (cell_h + label_h) * rows), (18, 18, 20))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 14)
    except OSError:
        font = ImageFont.load_default()
    for i, f in enumerate(files):
        if f is None:
            continue
        im = Image.open(f).convert("RGB").resize((cell_w, cell_h))
        x, y = (i % cols) * cell_w, (i // cols) * (cell_h + label_h)
        sheet.paste(im, (x, y + label_h))
        label = f"{row_names[i // cols]} · {f.stem}" if row_names else f.stem
        draw.text((x + 6, y + 4), label, fill=(235, 235, 235), font=font)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    sheet.save(a.out, quality=88)
    print(f"{a.out}: {len(files)} frames, {cols}x{rows}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 24/56 · `moonfilm/scripts/kit/finalize.py`
<!-- casebook-file {"path": "moonfilm/scripts/kit/finalize.py", "lines": 201, "final_newline": true, "sha256": "f909c147a624a96cd046d57b289f7495aa5d85b68e9fdfb47bad4f258fbe3acf", "original_sha256": "f909c147a624a96cd046d57b289f7495aa5d85b68e9fdfb47bad4f258fbe3acf"} -->
```python
#!/usr/bin/env python3
"""
Assemble + QC a stop-motion-3d render into a deliverable MP4. Never claims what it did not verify.

  python3 finalize.py <project_root> [--frames out/frames] [--audio out/audio/mix.wav]
                      [--out out/final.mp4] [--crf 18] [--skip-assemble]

Steps (the qc report is written FIRST with status "running" and updated after every step, so a
crash still leaves an honest record):
  1. preflight   every frame f00000..f<total-1>.jpg exists and is non-empty; audio length == picture
  2. assemble    H.264 yuv420p (full-range JPEG -> limited BT.709), explicit colour tags via
                 h264_metadata, AAC 192k/48k, +faststart, CFR at the episode fps
  3. probe       ffprobe: codecs, pix_fmt, colour tags, fps, frame count, duration
  4. decode      full decode with -xerror (a file that plays is not the same as a file that decodes)
  5. freeze      freezedetect (d=0.4s): stepped animation holds 2-3 frames, a longer freeze is a bug
  6. black       blackdetect
  7. loudness    integrated LUFS and true peak of the MP4's AAC stream (assert TP <= -1.0 dBTP)
  8. acting      from out/qc/inspect.json if present: penetrations, surface-contact gaps, exact reach
  9. stepping    poseT only changes on the look's pose grid (on twos/threes are real, not jitter)
Writes out/qc/qc-report.json + qc-report.md and out/manifest.json (sha256 of every deliverable).
Exit 1 if any check FAILS.
"""
import argparse, hashlib, json, os, re, subprocess, sys, time
from pathlib import Path


def sh(cmd, check=True):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd[:3])}... failed:\n{r.stderr[-1500:]}")
    return r


def sha(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


class Report:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.d = {"status": "running", "started": time.strftime("%Y-%m-%d %H:%M:%S"), "checks": {}}
        self.save()

    def check(self, name, ok, **info):
        self.d["checks"][name] = {"ok": bool(ok), **info}
        print(f"[{'PASS' if ok else 'FAIL'}] {name}: " + json.dumps(info, ensure_ascii=False)[:300])
        self.save()

    def save(self):
        self.path.write_text(json.dumps(self.d, indent=2, ensure_ascii=False))

    def finish(self):
        fails = [k for k, v in self.d["checks"].items() if not v["ok"]]
        self.d["status"] = "fail" if fails else "pass"
        self.d["failed"] = fails
        self.d["finished"] = time.strftime("%Y-%m-%d %H:%M:%S")
        self.save()
        md = [f"# QC report — {self.d['status'].upper()}", ""]
        for k, v in self.d["checks"].items():
            info = {kk: vv for kk, vv in v.items() if kk != "ok"}
            md.append(f"- **{k}** {'✅' if v['ok'] else '❌'} `{json.dumps(info, ensure_ascii=False)[:400]}`")
        self.path.with_suffix(".md").write_text("\n".join(md) + "\n")
        return not fails


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--frames", default="out/frames")
    ap.add_argument("--audio", default="out/audio/mix.wav")
    ap.add_argument("--out", default="out/final.mp4")
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--inspect", default="out/qc/inspect.json")
    ap.add_argument("--crf", type=int, default=18)
    ap.add_argument("--freeze", type=float, default=0.4)
    ap.add_argument("--skip-assemble", action="store_true")
    a = ap.parse_args()
    root = Path(a.root).resolve()
    P = lambda p: (root / p) if not os.path.isabs(p) else Path(p)
    rep = Report(P("out/qc/qc-report.json"))
    meta = json.loads(P(a.meta).read_text())
    fps, total = meta["fps"], meta["total"]
    dur = total / fps
    frames, audio, out = P(a.frames), P(a.audio), P(a.out)

    # 1 preflight
    missing = [f for f in range(total) if not (frames / f"f{f:05d}.jpg").exists() or (frames / f"f{f:05d}.jpg").stat().st_size < 1000]
    rep.check("preflight.frames", not missing, total=total, missing=len(missing), first_missing=missing[:5])
    has_audio = audio.exists()
    if has_audio:
        ad = float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(audio)]).stdout.strip())
        rep.check("preflight.audio", abs(ad - dur) < 0.05, audio_s=round(ad, 3), picture_s=dur)
    else:
        rep.check("preflight.audio", False, note=f"no audio at {audio} — silent film is not a deliverable")
    if missing:
        rep.finish()
        sys.exit(1)

    # 2 assemble
    if not a.skip_assemble:
        out.parent.mkdir(parents=True, exist_ok=True)
        vf = "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p"
        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-framerate", str(fps), "-i", str(frames / "f%05d.jpg")]
        if has_audio:
            cmd += ["-i", str(audio)]
        cmd += ["-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-profile:v", "high",
                "-pix_fmt", "yuv420p", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                "-bsf:v", "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0",
                "-r", str(fps), "-fps_mode", "cfr", "-g", str(fps * 2)]
        if has_audio:
            cmd += ["-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
        cmd += ["-t", f"{dur:.3f}", "-movflags", "+faststart", str(out)]
        t = time.time()
        sh(cmd)
        rep.check("assemble", out.exists(), seconds=round(time.time() - t, 1), bytes=out.stat().st_size)

    # 3 probe
    pj = json.loads(sh(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", str(out)]).stdout)
    v = next(s for s in pj["streams"] if s["codec_type"] == "video")
    au = next((s for s in pj["streams"] if s["codec_type"] == "audio"), None)
    rfr = v.get("r_frame_rate", "0/1").split("/")
    probe = {"vcodec": v["codec_name"], "pix_fmt": v["pix_fmt"], "size": f"{v['width']}x{v['height']}",
             "fps": round(int(rfr[0]) / int(rfr[1]), 3), "frames": int(v.get("nb_read_frames", 0)),
             "range": v.get("color_range"), "matrix": v.get("color_space"), "primaries": v.get("color_primaries"), "trc": v.get("color_transfer"),
             "acodec": au and au["codec_name"], "ar": au and au.get("sample_rate"), "duration": round(float(pj["format"]["duration"]), 3)}
    ok = (probe["vcodec"] == "h264" and probe["pix_fmt"] == "yuv420p" and probe["frames"] == total and probe["fps"] == fps
          and probe["range"] == "tv" and probe["matrix"] == probe["primaries"] == probe["trc"] == "bt709" and (au is not None))
    rep.check("probe", ok, **probe)
    head = open(out, "rb").read(64 * 1024)
    rep.check("faststart", head.find(b"moov") != -1 and (head.find(b"mdat") == -1 or head.find(b"moov") < head.find(b"mdat")))

    # 4 decode
    r = sh(["ffmpeg", "-v", "error", "-xerror", "-i", str(out), "-f", "null", "-"], check=False)
    rep.check("decode", r.returncode == 0 and not r.stderr.strip(), stderr=r.stderr.strip()[:300])

    # 5 freeze / 6 black
    r = sh(["ffmpeg", "-hide_banner", "-i", str(out), "-vf", f"freezedetect=n=0.002:d={a.freeze},blackdetect=d=0.25:pix_th=0.06", "-an", "-f", "null", "-"], check=False)
    freezes = re.findall(r"freeze_start: ([\d.]+).*?freeze_duration: ([\d.]+)", r.stderr, re.S)
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", r.stderr)
    rep.check("freeze", not freezes, threshold_s=a.freeze, found=[(float(s), float(d)) for s, d in freezes][:10])
    rep.check("black", not blacks, found=blacks[:10])

    # 7 loudness (of the delivered AAC, not the wav)
    if au is not None:
        r = sh(["ffmpeg", "-nostats", "-hide_banner", "-i", str(out), "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-"], check=False)
        j = json.loads(r.stderr[r.stderr.rfind("{"): r.stderr.rfind("}") + 1])
        I, TP = float(j["input_i"]), float(j["input_tp"])
        rep.check("loudness", -18 <= I <= -13 and TP <= -1.0, integrated_lufs=I, true_peak_dbtp=TP, lra=float(j["input_lra"]))

    # 8 acting / 9 stepping (from the page's own inspect probe)
    ip = P(a.inspect)
    if ip.exists():
        rows = json.loads(ip.read_text())
        pen = [r_ for r_ in rows if r_.get("penetration")]
        surf = [c["surface"] for r_ in rows for c in r_.get("contacts", []) if c.get("mode") == "surface" and c.get("surface") is not None]
        exact = [c["gap"] for r_ in rows for c in r_.get("contacts", []) if c.get("mode") == "exact" and c.get("gap") is not None]
        worst_s = min(surf) if surf else 0
        worst_e = max(exact) if exact else 0
        rep.check("acting.penetration", not pen, frames_with_penetration=len(pen), first=[r_["frame"] for r_ in pen[:5]])
        rep.check("acting.surface_contacts", worst_s > -0.01, n=len(surf), deepest_m=round(worst_s, 4))
        rep.check("acting.exact_reach", worst_e < 0.03, n=len(exact), worst_gap_m=round(worst_e, 4))
        # stepping: count distinct poseT runs per shot; run length must equal the hold (except shot tails)
        bad, runs = 0, 0
        by = {}
        for r_ in rows:
            by.setdefault(r_["shot"], []).append(r_)
        for sid, rs in by.items():
            rs.sort(key=lambda x: x["frame"])
            lens, cur = [], 1
            for p, q in zip(rs, rs[1:]):
                if q["frame"] != p["frame"] + 1:
                    cur = 1
                    continue
                if q["poseT"] == p["poseT"]:
                    cur += 1
                else:
                    lens.append(cur)
                    cur = 1
            if lens:
                runs += len(lens)
                mode = max(set(lens), key=lens.count)
                bad += sum(1 for L in lens if L != mode)
        rep.check("stepping", bad == 0, runs=runs, irregular_runs=bad)
    else:
        rep.check("acting", False, note="no inspect.json — run capture.mjs --inspect first")

    ok = rep.finish()
    man = {"title": meta.get("title"), "fps": fps, "frames": total, "duration_s": dur,
           "files": {str(p.relative_to(root)): {"bytes": p.stat().st_size, "sha256": sha(p)} for p in [out, P("out/qc/qc-report.json")] if p.exists()}}
    P("out/manifest.json").write_text(json.dumps(man, indent=2, ensure_ascii=False))
    print(("QC PASS" if ok else "QC FAIL") + f" -> {rep.path}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
```

### 25/56 · `moonfilm/scripts/make_fonts.py`
<!-- casebook-file {"path": "moonfilm/scripts/make_fonts.py", "lines": 106, "final_newline": true, "sha256": "55b176966ecb451846b98443daf38a9dfe30439bbf824855d367203875cb6730", "original_sha256": "55b176966ecb451846b98443daf38a9dfe30439bbf824855d367203875cb6730"} -->
```python
#!/usr/bin/env python3
"""
Rebuild the bundled font subsets in web/fonts/  (added for the source package)

All text in the film (subtitles, end title, the 加油 seal, the inscription, the book-spine titles)
is drawn on canvas with 'Noto Serif CJK SC' at weights 400 / 600 / 700 / 900. The original render
used the system copies of those fonts (Ubuntu packages fonts-noto-cjk + fonts-noto-cjk-extra,
Noto Serif CJK version 2.002). So that the project renders the same text on a machine without them,
web/film.html loads subsets of exactly those files through @font-face (scoped to the render page;
nothing is installed system-wide). This script regenerates the subsets.

    python3 scripts/make_fonts.py                       # uses /usr/share/fonts/opentype/noto
    python3 scripts/make_fonts.py --src-dir ~/Downloads/NotoSerifCJK   # .ttc collections or SC .otf files

Characters kept: printable ASCII + every non-ASCII character that appears anywhere in src/**/*.ts
(a superset of what the film draws). Run it again after changing any on-screen text.
All name-table records are kept, so the family stays 'Noto Serif CJK SC' with the right weights;
the original timestamps are kept too, so the output is byte-for-byte reproducible.
Requires fonttools:  pip install fonttools
"""
import argparse
import sys
from pathlib import Path

try:
    from fontTools import subset
    from fontTools.ttLib import TTCollection, TTFont
except ImportError:
    sys.exit("fonttools is required: pip install fonttools")

ROOT = Path(__file__).resolve().parent.parent
# CSS weight -> (file stem in the Noto CJK distribution, output name)
WEIGHTS = {
    400: ("Regular", "NotoSerifCJKsc-Regular.subset.otf"),
    600: ("SemiBold", "NotoSerifCJKsc-SemiBold.subset.otf"),
    700: ("Bold", "NotoSerifCJKsc-Bold.subset.otf"),
    900: ("Black", "NotoSerifCJKsc-Black.subset.otf"),
}


def charset() -> str:
    chars = {chr(c) for c in range(0x20, 0x7F)}
    for p in sorted((ROOT / "src").rglob("*.ts")):
        chars.update(ch for ch in p.read_text(encoding="utf-8") if ord(ch) > 0x7F and ch not in "\r\n\t")
    return "".join(sorted(chars))


def family_of(font: TTFont) -> str:
    n = font["name"]
    return n.getDebugName(16) or n.getDebugName(1) or ""


def load_sc(src_dir: Path, stem: str) -> TTFont:
    """The SC face of NotoSerifCJK-<stem>.ttc, or a stand-alone NotoSerifCJKsc-<stem>.otf."""
    ttc = src_dir / f"NotoSerifCJK-{stem}.ttc"
    otf = src_dir / f"NotoSerifCJKsc-{stem}.otf"
    if ttc.exists():
        coll = TTCollection(str(ttc), lazy=True)
        for i, f in enumerate(coll.fonts):
            if family_of(f).startswith("Noto Serif CJK SC"):
                return TTFont(str(ttc), fontNumber=i, recalcTimestamp=False)
        sys.exit(f"no 'Noto Serif CJK SC' face inside {ttc}")
    if otf.exists():
        return TTFont(str(otf), recalcTimestamp=False)
    sys.exit(f"missing {ttc.name} (or {otf.name}) in {src_dir}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src-dir", default="/usr/share/fonts/opentype/noto")
    ap.add_argument("--out-dir", default=str(ROOT / "web" / "fonts"))
    a = ap.parse_args()
    src_dir, out_dir = Path(a.src_dir).expanduser(), Path(a.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    text = charset()
    (out_dir / "charset.txt").write_text(text + "\n", encoding="utf-8")

    opts = subset.Options()
    opts.name_IDs = ["*"]          # keep family / subfamily / typographic names -> same CSS family
    opts.name_languages = ["*"]
    opts.name_legacy = True
    opts.layout_features = ["*"]   # same shaping as the full font
    opts.notdef_outline = True
    opts.recalc_bounds = False
    opts.prune_unicode_ranges = False

    for weight, (stem, out_name) in WEIGHTS.items():
        font = load_sc(src_dir, stem)
        version = font["name"].getDebugName(5)
        sub = subset.Subsetter(options=opts)
        sub.populate(text=text)
        sub.subset(font)
        missing = [ch for ch in text if ord(ch) > 0x7F and ord(ch) not in font.getBestCmap()]
        font.save(str(out_dir / out_name))
        size = (out_dir / out_name).stat().st_size
        print(f"{weight}  {out_name:40s} {size / 1024:7.1f} KB  glyphs={len(font.getGlyphOrder())}  ({version})")
        if missing:
            # only characters from code comments may be missing; anything drawn on screen must be present
            print("     not in font (comment-only characters are fine):", " ".join(f"U+{ord(c):04X}" for c in missing))
    print(f"{len(text)} characters -> {out_dir / 'charset.txt'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

### 26/56 · `moonfilm/scripts/render_all.sh`
<!-- casebook-file {"path": "moonfilm/scripts/render_all.sh", "lines": 51, "final_newline": true, "sha256": "6dac0936b294c26dc1a1d6896c1520b36f427f83c0808a30488f75f167ab3fbc", "original_sha256": "6dac0936b294c26dc1a1d6896c1520b36f427f83c0808a30488f75f167ab3fbc"} -->
```bash
#!/usr/bin/env bash
# 从零渲染《月光替你亮着灯》成片（源码包新增的一键脚本；每一步也可以单独运行，见 README）
#
#   bash scripts/render_all.sh                          # -> out/final.mp4（CRF 20，约 21.8 MB）
#   CRF=18 OUT=out/final_crf18.mp4 bash scripts/render_all.sh   # 高码率母版（约 29 MB）
#
# 断点续渲：out/frames 里已有的帧会被跳过。改过画面代码后，删掉 out/frames，
# 或者只对受影响的帧段重渲：node scripts/capture.mjs --page "$PAGE" --range 600:642 --out out/frames --force
set -euo pipefail
cd "$(dirname "$0")/.."

PAGE="film.html?w=1920&h=1080&pw=1600&ph=900"   # 输出 1920x1080，3D 画面 1600x900
FRAMES=672                                       # 28.0 s x 24 fps（与 src/timeline.ts 一致）
CRF="${CRF:-20}"
OUT="${OUT:-out/final.mp4}"
mkdir -p out/logs out/qc

step() { printf '\n==> %s\n' "$*"; }
# capture.mjs 在页面报错（比如 GLSL 编译失败）时只打印 "page errors"，退出码仍是 0，所以要自己查
check_page() { if grep -q "page errors" "$1"; then echo "!! page errors, see $1"; exit 1; fi; }

step "1/7 构建（esbuild）+ 类型检查"
npm run -s build
npx tsc -p .

step "2/7 导出 meta.json（时间轴上的全部 cue，配乐脚本从这里读时间）"
node scripts/capture.mjs --page "$PAGE" --meta --out out/meta.json 2>&1 | tee out/logs/meta.log
check_page out/logs/meta.log
python3 -c "import json,sys; m=json.load(open('out/meta.json')); sys.exit(0 if m.get('fontsOk') else '!! fonts not loaded: check web/fonts/*.otf')"

step "3/7 配乐与音效（numpy/scipy 合成，约 10 秒）"
python3 audio/score.py --meta out/meta.json --out out/audio

step "4/7 QC 探针（接触、穿插、镜头避让；不出像素）"
node scripts/capture.mjs --page "$PAGE" --inspect "0:$FRAMES" --out out/qc/inspect.json 2>&1 | tee out/logs/inspect.log
check_page out/logs/inspect.log

step "5/7 渲染 $FRAMES 帧（可断点续渲；2 核 CPU + SwiftShader 约 55 分钟）"
node scripts/capture.mjs --page "$PAGE" --range "0:$FRAMES" --out out/frames 2>&1 | tee out/logs/render.log
check_page out/logs/render.log

step "6/7 封装 H.264 + AAC，并跑 13 项 QC"
python3 scripts/kit/finalize.py . --frames out/frames --audio out/audio/mix.wav --out "$OUT" \
  --meta out/meta.json --inspect out/qc/inspect.json --crf "$CRF"

step "7/7 独立校验：从 MP4 里解码每句字幕的画面，拼成 out/qc/verify_sheet.jpg"
python3 scripts/verify_mp4.py "$OUT"
python3 tools/check_repro.py || true   # 与原始渲染逐字节比对（仅供参考，不同平台会有像素级差异）

echo
echo "完成 -> $OUT   （QC 报告：out/qc/qc-report.md）"
```

### 27/56 · `moonfilm/scripts/verify_mp4.py`
<!-- casebook-file {"path": "moonfilm/scripts/verify_mp4.py", "lines": 46, "final_newline": true, "sha256": "58373262fab0af6ac17e6649f8236de7a3b939962892dcefa76a3f560b079b14", "original_sha256": "58373262fab0af6ac17e6649f8236de7a3b939962892dcefa76a3f560b079b14"} -->
```python
#!/usr/bin/env python3
"""Independent check of the delivered MP4: streams, duration, and a contact sheet of frames
decoded FROM THE MP4 at every subtitle line + the end card (so type/encoding is verified on
the actual file, not on the source JPEGs)."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw

mp4 = Path(sys.argv[1] if len(sys.argv) > 1 else "out/final.mp4")
meta = json.load(open("out/meta.json"))
out = Path("out/qc/verify")
out.mkdir(parents=True, exist_ok=True)

pj = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(mp4)], capture_output=True, text=True).stdout)
v = next(s for s in pj["streams"] if s["codec_type"] == "video")
a = next(s for s in pj["streams"] if s["codec_type"] == "audio")
info = {
    "container_duration_s": float(pj["format"]["duration"]),
    "video": f'{v["codec_name"]} {v.get("profile")} {v["width"]}x{v["height"]} {v["pix_fmt"]} {v["r_frame_rate"]}',
    "audio": f'{a["codec_name"]} {a.get("profile")} {a["sample_rate"]} Hz {a["channels"]} ch',
    "size_MB": round(int(pj["format"]["size"]) / 1e6, 2),
}
print(json.dumps(info, ensure_ascii=False, indent=1))

times = []
for s in meta["cues"]["subs"]:
    last = s["segs"][-1]
    times.append((s["id"], min(s["out"] - 0.05, last["at"] + 0.9)))
times += [("TITLE", 25.2), ("SEAL", 26.6), ("END", 27.9)]
tiles = []
for name, t in times:
    f = out / f"{name}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(mp4), "-frames:v", "1", "-q:v", "3", str(f)], check=True)
    tiles.append((name, t, f))
W, H = 640, 360
cols = 3
rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 22)), (18, 18, 18))
d = ImageDraw.Draw(sheet)
for i, (name, t, f) in enumerate(tiles):
    im = Image.open(f).resize((W, H))
    x, y = (i % cols) * W, (i // cols) * (H + 22)
    sheet.paste(im, (x, y + 22))
    d.text((x + 6, y + 5), f"{name} @ {t:.2f}s (decoded from MP4)", fill=(235, 235, 235))
sheet.save("out/qc/verify_sheet.jpg", quality=90)
print("out/qc/verify_sheet.jpg")
```

### 28/56 · `moonfilm/src/cam/path.ts`
<!-- casebook-file {"path": "moonfilm/src/cam/path.ts", "lines": 101, "final_newline": true, "sha256": "3ded27210d23b350461baec6eff4b1d6213b57ec804e8d72660af7354729b467", "original_sha256": "3ded27210d23b350461baec6eff4b1d6213b57ec804e8d72660af7354729b467"} -->
```ts
import * as THREE from "three";
import { CAMERA, type CamKey } from "../timeline";

/**
 * ONE-TAKE CAMERA. Keys give position + aim + fov at times; between keys we use cubic Hermite
 * curves with finite-difference tangents (C1: velocity never jumps, so the move never "restarts"
 * at a key) and zero velocity at the first and last key. Aim is splined as yaw/pitch, not as a
 * target point, so turning from a far target to a near one stays an even rotation.
 */
interface Chan {
  t: number[];
  v: number[];
  m: number[];
}

function build(ts: number[], vs: number[], tension = 0.9): Chan {
  const n = ts.length;
  const m = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    const s0 = (vs[i] - vs[i - 1]) / (ts[i] - ts[i - 1]);
    const s1 = (vs[i + 1] - vs[i]) / (ts[i + 1] - ts[i]);
    // average of slopes, damped where the curve turns back (prevents overshoot)
    m[i] = s0 * s1 <= 0 ? 0 : ((s0 + s1) / 2) * tension;
    // Fritsch–Carlson style limiter
    const lim = 3 * Math.min(Math.abs(s0), Math.abs(s1));
    if (Math.abs(m[i]) > lim) m[i] = Math.sign(m[i]) * lim;
  }
  return { t: ts, v: vs, m };
}

function evalChan(c: Chan, t: number) {
  const n = c.t.length;
  if (t <= c.t[0]) return c.v[0];
  if (t >= c.t[n - 1]) return c.v[n - 1];
  let i = 0;
  while (i < n - 2 && t > c.t[i + 1]) i++;
  const h = c.t[i + 1] - c.t[i];
  const s = (t - c.t[i]) / h;
  const s2 = s * s, s3 = s2 * s;
  const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
  return h00 * c.v[i] + h10 * h * c.m[i] + h01 * c.v[i + 1] + h11 * h * c.m[i + 1];
}

const keys: CamKey[] = CAMERA;
const ts = keys.map((k) => k.t);
const px = build(ts, keys.map((k) => k.pos[0]));
const py = build(ts, keys.map((k) => k.pos[1]));
const pz = build(ts, keys.map((k) => k.pos[2]));
const fov = build(ts, keys.map((k) => k.fov));
// aim as yaw/pitch, unwrapped
const yawRaw = keys.map((k) => Math.atan2(k.target[0] - k.pos[0], k.target[2] - k.pos[2]));
const yaws: number[] = [];
yawRaw.forEach((y, i) => {
  if (i === 0) return yaws.push(y);
  let v = y;
  while (v - yaws[i - 1] > Math.PI) v -= 2 * Math.PI;
  while (v - yaws[i - 1] < -Math.PI) v += 2 * Math.PI;
  yaws.push(v);
});
const pitches = keys.map((k) => {
  const dx = k.target[0] - k.pos[0], dy = k.target[1] - k.pos[1], dz = k.target[2] - k.pos[2];
  return Math.atan2(dy, Math.hypot(dx, dz));
});
const yaw = build(ts, yaws);
const pitch = build(ts, pitches);

export interface CamSample {
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  fov: number;
}

/** deterministic "breath" so holds never look frozen (mm-scale, sub-degree) */
function breath(t: number) {
  return {
    x: 0.0022 * Math.sin(t * 0.83 + 0.4) + 0.0012 * Math.sin(t * 1.91 + 2.1),
    y: 0.0026 * Math.sin(t * 0.67 + 1.3) + 0.001 * Math.sin(t * 2.3),
    yaw: 0.0011 * Math.sin(t * 0.59 + 0.7),
    pitch: 0.0009 * Math.sin(t * 0.77 + 2.4),
  };
}

export function sampleCamera(t: number): CamSample {
  const b = breath(t);
  const pos = new THREE.Vector3(evalChan(px, t) + b.x, evalChan(py, t) + b.y, evalChan(pz, t));
  const yw = evalChan(yaw, t) + b.yaw, pt = evalChan(pitch, t) + b.pitch;
  const dir = new THREE.Vector3(Math.sin(yw) * Math.cos(pt), Math.sin(pt), Math.cos(yw) * Math.cos(pt));
  return { pos, dir, fov: evalChan(fov, t) };
}

export function applyCamera(cam: THREE.PerspectiveCamera, s: CamSample, aspect: number) {
  cam.position.copy(s.pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(s.pos.clone().add(s.dir));
  cam.fov = s.fov;
  cam.aspect = aspect;
  cam.near = 0.03;
  cam.far = 600;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
}
```

### 29/56 · `moonfilm/src/core/anim.ts`
<!-- casebook-file {"path": "moonfilm/src/core/anim.ts", "lines": 64, "final_newline": true, "sha256": "b2e8f721c09b6d893222d2410d8933b998caf268a9fbf3d6dc833c404f1e53d9", "original_sha256": "b2e8f721c09b6d893222d2410d8933b998caf268a9fbf3d6dc833c404f1e53d9"} -->
```ts
import * as THREE from "three";

export const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const smooth = (u: number) => {
  u = clamp01(u);
  return u * u * (3 - 2 * u);
};
export const smoother = (u: number) => {
  u = clamp01(u);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
export const easeOut = (u: number) => 1 - Math.pow(1 - clamp01(u), 3);
export const easeIn = (u: number) => Math.pow(clamp01(u), 3);
export const easeOutBack = (u: number, k = 1.7) => {
  u = clamp01(u);
  const c3 = k + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + k * Math.pow(u - 1, 2);
};
/** 0 before a, 1 after b, smooth between */
export const win = (t: number, a: number, b: number, f = smooth) => f((t - a) / (b - a));
/** rises over [a0,a1], falls over [b0,b1] */
export const pulse = (t: number, a0: number, a1: number, b0: number, b1: number) => win(t, a0, a1) * (1 - win(t, b0, b1));

/** scalar key track: [[t, v], ...] eased per segment (poses hold at keys) */
export function track(keys: [number, number][], t: number, f = smoother) {
  if (t <= keys[0][0]) return keys[0][1];
  const n = keys.length;
  if (t >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0;
  while (i < n - 2 && t > keys[i + 1][0]) i++;
  const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
  return lerp(v0, v1, f((t - t0) / (t1 - t0)));
}

/** vec3 key track */
export function track3(keys: [number, number, number, number][], t: number, f = smoother, out = new THREE.Vector3()) {
  if (t <= keys[0][0]) return out.set(keys[0][1], keys[0][2], keys[0][3]);
  const n = keys.length;
  if (t >= keys[n - 1][0]) return out.set(keys[n - 1][1], keys[n - 1][2], keys[n - 1][3]);
  let i = 0;
  while (i < n - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1];
  const u = f((t - a[0]) / (b[0] - a[0]));
  return out.set(lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u));
}

/** Catmull-Rom through points, u in 0..1 over the whole list (uniform) */
export function crPath(pts: THREE.Vector3[], u: number, out = new THREE.Vector3()) {
  const n = pts.length - 1;
  const x = clamp01(u) * n;
  const i = Math.min(n - 1, Math.floor(x));
  const s = x - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  const s2 = s * s, s3 = s2 * s;
  const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3);
  return out.set(f(p0.x, p1.x, p2.x, p3.x), f(p0.y, p1.y, p2.y, p3.y), f(p0.z, p1.z, p2.z, p3.z));
}

/** deterministic hash → [0,1) */
export function h1(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
```

### 30/56 · `moonfilm/src/core/post.ts`
<!-- casebook-file {"path": "moonfilm/src/core/post.ts", "lines": 155, "final_newline": true, "sha256": "eae9326a83136f54aaf13a766b2cbf66b86d311a1fe3712db19225e2f2708359", "original_sha256": "eae9326a83136f54aaf13a766b2cbf66b86d311a1fe3712db19225e2f2708359"} -->
```ts
import * as THREE from "three";

/**
 * Shared G-buffer for screen-space looks:
 *  - color:  the lit scene (linear HDR, MSAA)
 *  - normal: view normals (packed n*0.5+0.5) + a depth texture
 * Transparent helpers (glass, light shafts, particles) are hidden from the normal pass so they
 * never draw outlines. Mark such objects with userData.noOutline = true.
 */
export class GBuffer {
  color: THREE.WebGLRenderTarget;
  normal: THREE.WebGLRenderTarget;
  private normalMat = new THREE.MeshNormalMaterial();
  /**
   * Measured under SwiftShader (CPU WebGL, 1280x720, ~180k tris): scene pass 1x = 1.17 s,
   * 1x + MSAA4 = 1.61 s, 2x supersampled = 4.19 s. So: MSAA4 on the color pass only; normals/depth
   * single-sample. Per-pixel lights are the other big cost (10 point lights ≈ +0.35 s, PMREM env
   * ≈ +0.4 s) — hide practicals that are off, prefer hemisphere fill over an env map.
   */
  constructor(public width: number, public height: number, public samples = 4) {
    this.color = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples });
    this.normal = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType });
    this.normal.depthTexture = new THREE.DepthTexture(width, height);
  }
  /** restrict all passes to a screen rectangle (split-screen bands render only their slice) */
  scissor(r: THREE.Vector4 | null) {
    for (const t of [this.color, this.normal]) {
      t.scissorTest = !!r;
      if (r) t.scissor.copy(r);
    }
  }
  renderColor(r: THREE.WebGLRenderer, scene: THREE.Scene, cam: THREE.Camera) {
    r.setRenderTarget(this.color);
    r.clear();
    r.render(scene, cam);
  }
  renderNormalDepth(r: THREE.WebGLRenderer, scene: THREE.Scene, cam: THREE.Camera) {
    const hidden: THREE.Object3D[] = scene.userData.noOutline ?? [];
    const vis = hidden.map((o) => o.visible);
    hidden.forEach((o) => (o.visible = false));
    const bg = scene.background, fog = scene.fog;
    scene.background = null;
    scene.fog = null;
    scene.overrideMaterial = this.normalMat;
    r.setRenderTarget(this.normal);
    r.setClearColor(0x8080ff, 1);
    r.clear();
    r.render(scene, cam);
    r.setClearColor(0x000000, 1);
    scene.overrideMaterial = null;
    scene.background = bg;
    scene.fog = fog;
    hidden.forEach((o, i) => (o.visible = vis[i]));
  }
}

/** Collect objects flagged noOutline once per scene (called after the scene is built). */
export function indexNoOutline(scene: THREE.Scene) {
  const list: THREE.Object3D[] = [];
  scene.traverse((o) => {
    if (o.userData.noOutline || (o as THREE.Points).isPoints) list.push(o);
  });
  scene.userData.noOutline = list;
}

const quadGeo = new THREE.PlaneGeometry(2, 2);
const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

export interface Pass {
  mat: THREE.ShaderMaterial;
  u: Record<string, THREE.IUniform>;
  run(r: THREE.WebGLRenderer, target: THREE.WebGLRenderTarget | null): void;
}

/** One full-screen shader pass. Output is DISPLAY-REFERRED (tone-mapped + sRGB-encoded in GLSL). */
export function fsPass(frag: string, uniforms: Record<string, THREE.IUniform> = {}): Pass {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: null }, tNormal: { value: null }, tDepth: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) }, uNear: { value: 0.05 }, uFar: { value: 400 },
      uStep: { value: 0 }, uTime: { value: 0 }, uFrame: { value: 0 },
      ...uniforms,
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: GLSL_COMMON + frag,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(quadGeo, mat);
  mesh.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(mesh);
  return {
    mat,
    u: mat.uniforms,
    run(r, target) {
      r.setRenderTarget(target);
      r.render(scene, orthoCam);
    },
  };
}

/** Bind the g-buffer + camera + time uniforms every look pass needs. */
export function bindCommon(p: Pass, g: GBuffer, cam: THREE.PerspectiveCamera, frame: number, poseStep: number, t: number) {
  p.u.tColor.value = g.color.texture;
  p.u.tNormal.value = g.normal.texture;
  p.u.tDepth.value = g.normal.depthTexture;
  (p.u.uRes.value as THREE.Vector2).set(g.width, g.height);
  p.u.uNear.value = cam.near;
  p.u.uFar.value = cam.far;
  p.u.uFrame.value = frame;
  p.u.uStep.value = poseStep;
  p.u.uTime.value = t;
}

export const GLSL_COMMON = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tColor, tNormal, tDepth;
uniform vec2 uRes; uniform float uNear, uFar, uStep, uTime, uFrame;
vec3 colorAA(vec2 uv){ return texture2D(tColor, uv).rgb; }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= .5; } return s; }
float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
vec3 aces(vec3 x){ const float a=2.51, b=.03, c=2.43, d=.59, e=.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0., 1.); }
vec3 toSRGB(vec3 c){ c = clamp(c, 0., 1.); return mix(c*12.92, 1.055*pow(c, vec3(1./2.4)) - .055, step(.0031308, c)); }
vec3 fromSRGB(vec3 c){ return mix(c/12.92, pow((c+.055)/1.055, vec3(2.4)), step(.04045, c)); }
float linDepth(vec2 uv){ float z = texture2D(tDepth, uv).x*2. - 1.; return 2.*uNear*uFar/(uFar + uNear - z*(uFar - uNear)); }
vec3 nrm(vec2 uv){ return normalize(texture2D(tNormal, uv).xyz*2. - 1.); }
bool isSky(vec2 uv){ return texture2D(tDepth, uv).x > .99999; }
/* silhouette + crease edges; r = radius in px; jitter displaces taps (hand-drawn boil) */
float edgeDN(vec2 uv, float r, float dThr, float nThr, vec2 jitter){
  vec2 px = 1./uRes; vec2 c = uv + jitter*px;
  float d = linDepth(c); vec3 n = nrm(c); float e = 0.;
  for (int i = 0; i < 4; i++){
    vec2 o = (i==0 ? vec2(1,0) : i==1 ? vec2(-1,0) : i==2 ? vec2(0,1) : vec2(0,-1)) * px * r;
    float dd = abs(linDepth(c+o) - d) / max(d, .001);
    float nn = 1. - dot(n, nrm(c+o));
    e = max(e, max(smoothstep(dThr, dThr*2.5, dd), smoothstep(nThr, nThr*3., nn)));
  }
  return e;
}
/* color-region edges (flat-shaded looks: posters, costumes on the same plane) */
float edgeC(vec2 uv, float r, float thr){
  vec2 px = r/uRes; float l = luma(aces(texture2D(tColor, uv).rgb)); float e = 0.;
  e = max(e, abs(l - luma(aces(texture2D(tColor, uv+vec2(px.x,0)).rgb))));
  e = max(e, abs(l - luma(aces(texture2D(tColor, uv+vec2(0,px.y)).rgb))));
  return smoothstep(thr, thr*2.5, e);
}
vec3 vignette(vec3 c, vec2 uv, float k){ vec2 q = uv - .5; return c * (1. - k*dot(q, q)*1.6); }
`;
```

### 31/56 · `moonfilm/src/core/rng.ts`
<!-- casebook-file {"path": "moonfilm/src/core/rng.ts", "lines": 30, "final_newline": true, "sha256": "67855f69556b0043f68d6875651b2be7d4a8b1f8e737bc1830f446cd6c581d82", "original_sha256": "67855f69556b0043f68d6875651b2be7d4a8b1f8e737bc1830f446cd6c581d82"} -->
```ts
/** Seeded RNG — every "random" choice must be reproducible frame to frame and render to render. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const ease = {
  linear: (u: number) => u,
  inOut: (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
  in: (u: number) => u * u,
  out: (u: number) => 1 - (1 - u) * (1 - u),
};
export const smooth = (a: number, b: number, x: number) => {
  const u = clamp01((x - a) / (b - a));
  return u * u * (3 - 2 * u);
};
```

### 32/56 · `moonfilm/src/core/tex.ts`
<!-- casebook-file {"path": "moonfilm/src/core/tex.ts", "lines": 475, "final_newline": true, "sha256": "61a9ffae51277fc3874c06ce2bd02626d0c6a41c8748168bb3870e6b5d1ad9cb", "original_sha256": "61a9ffae51277fc3874c06ce2bd02626d0c6a41c8748168bb3870e6b5d1ad9cb"} -->
```ts
import * as THREE from "three";
import { rng, hash } from "./rng";

/**
 * Deterministic canvas textures. Nothing here is loaded from disk or the network:
 * paper, glow, the face (three expressions), book spines, mooncake, lantern paper,
 * osmanthus flower, and the painted far landscape.
 */
const cache = new Map<string, THREE.Texture>();

function canvasTex(
  id: string,
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, r: () => number) => void,
  o: { srgb?: boolean; repeat?: boolean; mip?: boolean } = {},
) {
  const hit = cache.get(id);
  if (hit) return hit;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d")!;
  draw(g, rng(hash(id)));
  const t = new THREE.CanvasTexture(cv);
  if (o.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = o.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (o.mip === false) {
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
  }
  cache.set(id, t);
  return t;
}

const SERIF = "'Noto Serif CJK SC', 'Noto Serif CJK JP', serif";

export const TEX = {
  /** paper fiber (post-process multiplies it in) */
  paper: () =>
    canvasTex(
      "paperFiber",
      512,
      512,
      (g, r) => {
        g.fillStyle = "rgb(236,236,236)";
        g.fillRect(0, 0, 512, 512);
        for (let k = 0; k < 5200; k++) {
          g.strokeStyle = `rgba(${r() < 0.5 ? "255,255,255" : "90,80,70"},${0.05 + r() * 0.07})`;
          g.lineWidth = 0.6;
          g.beginPath();
          const x = r() * 512, y = r() * 512, a = r() * Math.PI;
          g.moveTo(x, y);
          g.lineTo(x + Math.cos(a) * (4 + r() * 12), y + Math.sin(a) * (4 + r() * 12));
          g.stroke();
        }
        // cold-press tooth: soft blotches
        for (let k = 0; k < 900; k++) {
          g.fillStyle = `rgba(${r() < 0.5 ? "255,255,255" : "70,60,55"},${0.02 + r() * 0.03})`;
          g.beginPath();
          g.arc(r() * 512, r() * 512, 1.5 + r() * 4, 0, Math.PI * 2);
          g.fill();
        }
      },
      { srgb: false, repeat: true },
    ),

  /** knit: soft vertical ribs + a little fuzz (multiplied into the sweater color) */
  knit: () => {
    const t = canvasTex(
      "knit",
      128,
      128,
      (g, r) => {
        g.fillStyle = "#ffffff";
        g.fillRect(0, 0, 128, 128);
        for (let x = 0; x < 128; x += 8) {
          g.fillStyle = "rgba(0,0,0,0.13)";
          g.fillRect(x, 0, 2, 128);
          g.fillStyle = "rgba(255,255,255,0.5)";
          g.fillRect(x + 4, 0, 2, 128);
        }
        for (let k = 0; k < 500; k++) {
          g.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.05})`;
          g.fillRect(r() * 128, r() * 128, 1 + r() * 2, 2 + r() * 3);
        }
      },
      { repeat: true },
    );
    t.repeat.set(6, 3);
    return t;
  },

  /** soft radial glow for additive sprites */
  glow: () =>
    canvasTex(
      "glow",
      128,
      128,
      (g) => {
        const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.18, "rgba(255,255,255,0.75)");
        gr.addColorStop(0.45, "rgba(255,255,255,0.22)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, 128, 128);
      },
      { srgb: false },
    ),

  /** a small bright core for light motes */
  core: () =>
    canvasTex(
      "core",
      64,
      64,
      (g) => {
        const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.35, "rgba(255,255,255,0.9)");
        gr.addColorStop(0.6, "rgba(255,255,255,0.25)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 64);
      },
      { srgb: false },
    ),

  /**
   * Face decal, drawn in (azimuth, latitude) space of the head sphere: u spans ±CAP_H, v ±CAP_V.
   * kind: focus (reading, lids lowered) | look (eyes open, looking up) | smile (happy ^ ^)
   */
  face: (kind: "focus" | "look" | "gaze" | "smile" | "blink") =>
    canvasTex(`face:${kind}`, 512, 512, (g) => {
      const CAP_H = 75, CAP_V = 70;
      const X = (az: number) => 256 + (az / CAP_H) * 256;
      const Y = (lat: number) => 256 - (lat / CAP_V) * 256;
      g.clearRect(0, 0, 512, 512);
      // blush
      for (const s of [-1, 1]) {
        const gr = g.createRadialGradient(X(s * 37), Y(-19), 0, X(s * 37), Y(-19), 34);
        gr.addColorStop(0, kind === "smile" || kind === "gaze" ? "rgba(240,122,122,0.66)" : "rgba(240,140,135,0.45)");
        gr.addColorStop(1, "rgba(240,140,135,0)");
        g.fillStyle = gr;
        g.beginPath();
        g.ellipse(X(s * 37), Y(-19), 40, 26, 0, 0, Math.PI * 2);
        g.fill();
      }
      const ink = "#2a1c1f";
      const iris = "#4a2f2c";
      g.lineCap = "round";
      g.lineJoin = "round";
      for (const s of [-1, 1]) {
        const ex = X(s * 24), ey = Y(-6);
        if (kind === "blink") {
          // gently closed: a lid line bowed downward + lashes
          g.strokeStyle = ink;
          g.lineWidth = 7;
          g.beginPath();
          g.moveTo(ex - 21, ey - 2);
          g.quadraticCurveTo(ex, ey + 13, ex + 21, ey - 2);
          g.stroke();
          g.lineWidth = 4.5;
          g.beginPath();
          g.moveTo(ex + s * 20, ey - 1);
          g.lineTo(ex + s * 28, ey - 6);
          g.stroke();
        } else if (kind === "smile") {
          // happy closed eyes: arcs bowed upward
          g.strokeStyle = ink;
          g.lineWidth = 8;
          g.beginPath();
          g.moveTo(ex - 21, ey + 7);
          g.quadraticCurveTo(ex, ey - 19, ex + 21, ey + 7);
          g.stroke();
          // lash flick at the outer corner
          g.lineWidth = 5;
          g.beginPath();
          g.moveTo(ex + s * 20, ey + 5);
          g.lineTo(ex + s * 29, ey + 1);
          g.stroke();
        } else {
          const lookUp = kind === "look" || kind === "gaze";
          // iris: dark oval with warm lower half
          const iy = lookUp ? ey - 4 : ey + 7;
          const gr = g.createLinearGradient(0, iy - 26, 0, iy + 26);
          gr.addColorStop(0, "#1f1517");
          gr.addColorStop(0.65, iris);
          gr.addColorStop(1, "#7a4a3a");
          g.fillStyle = gr;
          g.save();
          g.beginPath();
          // clip to the part below the upper lid
          const lidY = lookUp ? ey - 22 : ey - 2;
          g.rect(ex - 40, lidY, 80, 80);
          g.clip();
          g.beginPath();
          g.ellipse(ex, iy, 19, 26, 0, 0, Math.PI * 2);
          g.fill();
          // highlights
          g.fillStyle = "rgba(255,255,255,0.95)";
          g.beginPath();
          g.ellipse(ex + s * -6, iy - 10, kind === "gaze" ? 7 : 5.5, kind === "gaze" ? 8 : 6.5, 0, 0, Math.PI * 2);
          g.fill();
          g.fillStyle = "rgba(255,255,255,0.6)";
          g.beginPath();
          g.ellipse(ex + s * 6, iy + 9, 3, 3, 0, 0, Math.PI * 2);
          g.fill();
          g.restore();
          // upper lid line (thick), slightly arched; lowered when focused
          g.strokeStyle = ink;
          g.lineWidth = lookUp ? 7 : 8.5;
          g.beginPath();
          g.moveTo(ex - 22, lidY + (lookUp ? 7 : 3));
          g.quadraticCurveTo(ex, lidY - (lookUp ? 9 : 5), ex + 23, lidY + (lookUp ? 6 : 2));
          g.stroke();
          // lash flick
          g.lineWidth = 4.5;
          g.beginPath();
          g.moveTo(ex + s * 21, lidY + (lookUp ? 4 : 1));
          g.lineTo(ex + s * 30, lidY - (lookUp ? 3 : 2));
          g.stroke();
          // brows (soft)
          g.strokeStyle = "rgba(60,40,38,0.55)";
          g.lineWidth = 4;
          g.beginPath();
          const by = lookUp ? Y(15) : Y(12);
          g.moveTo(ex - 16, by + 3);
          g.quadraticCurveTo(ex, by - 5, ex + 17, by + (lookUp ? 1 : 3));
          g.stroke();
        }
      }
      // mouth
      const mx = X(0), my = Y(-27);
      if (kind === "smile") {
        g.fillStyle = "#9c3f3d";
        g.beginPath();
        g.moveTo(mx - 15, my - 3);
        g.quadraticCurveTo(mx, my + 20, mx + 15, my - 3);
        g.closePath();
        g.fill();
        g.fillStyle = "#e0797a";
        g.beginPath();
        g.ellipse(mx, my + 7, 7, 4, 0, 0, Math.PI * 2);
        g.fill();
      } else if (kind === "gaze") {
        g.strokeStyle = "#a4504a";
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(mx - 14, my - 3);
        g.quadraticCurveTo(mx, my + 11, mx + 14, my - 3);
        g.stroke();
      } else {
        g.strokeStyle = "#a4504a";
        g.lineWidth = 4.5;
        g.beginPath();
        g.moveTo(mx - 9, my);
        g.quadraticCurveTo(mx, my + (kind === "look" ? 6 : 3), mx + 9, my);
        g.stroke();
      }
    }),

  /** book spine with a title; w×h in px (h small) */
  spine: (title: string, bg: string, fg: string) =>
    canvasTex(`spine:${title}:${bg}`, 512, 64, (g, r) => {
      g.fillStyle = bg;
      g.fillRect(0, 0, 512, 64);
      g.fillStyle = "rgba(255,255,255,0.08)";
      g.fillRect(0, 6, 512, 3);
      g.fillRect(0, 55, 512, 3);
      g.fillStyle = fg;
      g.font = `700 40px ${SERIF}`;
      g.textBaseline = "middle";
      g.fillText(title, 40 + r() * 30, 34);
    }),

  /** mooncake top: scalloped rim + ring + osmanthus flower (no characters) */
  mooncake: () =>
    canvasTex("mooncake", 256, 256, (g) => {
      g.fillStyle = "#c8894a";
      g.fillRect(0, 0, 256, 256);
      const c = 128;
      g.strokeStyle = "rgba(120,70,30,0.8)";
      g.lineWidth = 5;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        g.beginPath();
        g.arc(c + Math.cos(a) * 96, c + Math.sin(a) * 96, 16, a + Math.PI * 0.5, a + Math.PI * 1.5);
        g.stroke();
      }
      g.beginPath();
      g.arc(c, c, 70, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "rgba(240,190,120,0.9)";
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        g.beginPath();
        g.ellipse(c + Math.cos(a) * 20, c + Math.sin(a) * 20, 18, 11, a, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = "rgba(120,70,30,0.9)";
      g.beginPath();
      g.arc(c, c, 7, 0, Math.PI * 2);
      g.fill();
    }),

  /** lantern paper: warm red with vertical ribs and a soft hot center (u around, v up) */
  lantern: () =>
    canvasTex("lanternPaper", 256, 128, (g) => {
      const gr = g.createLinearGradient(0, 0, 0, 128);
      gr.addColorStop(0, "#b8322a");
      gr.addColorStop(0.5, "#ea5a3c");
      gr.addColorStop(1, "#b8322a");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 128);
      g.strokeStyle = "rgba(90,20,15,0.55)";
      g.lineWidth = 3;
      for (let i = 0; i < 16; i++) {
        const x = (i / 16) * 256;
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, 128);
        g.stroke();
      }
    }),

  /** osmanthus flower (four round petals, golden) */
  flower: () =>
    canvasTex("osmanthus", 64, 64, (g) => {
      g.clearRect(0, 0, 64, 64);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const gr = g.createRadialGradient(32 + Math.cos(a) * 11, 32 + Math.sin(a) * 11, 1, 32 + Math.cos(a) * 11, 32 + Math.sin(a) * 11, 13);
        gr.addColorStop(0, "rgba(255,214,120,1)");
        gr.addColorStop(0.8, "rgba(240,160,50,1)");
        gr.addColorStop(1, "rgba(240,160,50,0)");
        g.fillStyle = gr;
        g.beginPath();
        g.arc(32 + Math.cos(a) * 11, 32 + Math.sin(a) * 11, 13, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = "rgba(200,110,30,1)";
      g.beginPath();
      g.arc(32, 32, 4, 0, Math.PI * 2);
      g.fill();
    }),

  /**
   * Far landscape, painted: each layer is a colored silhouette with a moonlit rim on its top edge
   * and a mist wash at its foot. u = azimuth (canvas x = 0 ↔ −108.9°), v = up.
   * layer 0 = far hills, 1 = old town roofs + pagoda, 2 = near tree line.
   */
  skyline: (layer: 0 | 1 | 2 | 3) =>
    canvasTex(
      `skyline2:${layer}`,
      2048,
      256,
      (g, r) => {
        const H = 256;
        g.clearRect(0, 0, 2048, 256);
        const azX = (az: number) => ((az + 108.9) / 217.7) * 2048;
        const body = ["#3a4474", "#232a4f", "#141a31", "#0f1426"][layer];
        const rim = ["#6f78a6", "#4c5688", "#2c3558", "#2a3152"][layer];
        const shape = (dy: number) => {
          g.beginPath();
          if (layer === 0) {
            g.moveTo(0, H);
            for (let x = 0; x <= 2048; x += 6) {
              const y = H - (58 + 34 * Math.sin(x * 0.0029 + 1.2) + 20 * Math.sin(x * 0.0083 + 0.3) + 7 * Math.sin(x * 0.023 + 2.0));
              g.lineTo(x, y + dy);
            }
            g.lineTo(2048, H);
            g.closePath();
            g.fill();
            return;
          }
          if (layer === 3) {
            // courtyard: big soft crowns with golden osmanthus specks come later (post pass)
            const rr = (() => { let a = 23; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
            g.moveTo(0, H);
            for (let x = -60; x < 2120; x += 40 + rr() * 60) {
              const rad = 34 + rr() * 46;
              const cy = H - 70 - rad * 0.35 - rr() * 30;
              g.moveTo(x + rad, cy + dy);
              g.arc(x, cy + dy, rad, 0, Math.PI * 2);
              g.moveTo(x + rad * 0.8 + 30, cy + 22 + dy);
              g.arc(x + 30, cy + 22 + dy, rad * 0.8, 0, Math.PI * 2);
            }
            g.rect(0, H - 80 + dy, 2048, 80);
            g.fill();
            return;
          }
          if (layer === 2) {
            const rr = (() => { let a = 7; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
            g.moveTo(0, H);
            for (let x = -30; x < 2100; x += 22 + rr() * 26) {
              const rad = 13 + rr() * 22;
              g.moveTo(x + rad, H - 20 - rad * 0.55 + dy);
              g.arc(x, H - 20 - rad * 0.55 + dy, rad, 0, Math.PI * 2);
            }
            g.rect(0, H - 22 + dy, 2048, 22);
            g.fill();
            return;
          }
          // layer 1: roofs with curved eaves + a pagoda + a round-roofed pavilion
          const roof = (x: number, w: number, base: number, h: number) => {
            g.moveTo(x - w * 0.62, H - base + dy);
            g.quadraticCurveTo(x - w * 0.44, H - base - h * 0.3 + dy, x - w * 0.3, H - base - h + dy);
            g.lineTo(x + w * 0.3, H - base - h + dy);
            g.quadraticCurveTo(x + w * 0.44, H - base - h * 0.3 + dy, x + w * 0.62, H - base + dy);
            g.lineTo(x + w * 0.62, H);
            g.lineTo(x - w * 0.62, H);
            g.closePath();
          };
          const rr = (() => { let a = 11; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
          for (let x = -40; x < 2100; x += 50 + rr() * 60) {
            const w = 60 + rr() * 80;
            const base = 16 + rr() * 16;
            roof(x, w, base, 12 + rr() * 11);
            g.rect(x - w * 0.5, H - base, w, base);
          }
          const px = azX(-14);
          let b = 34;
          for (let k = 0; k < 6; k++) {
            const w = 78 - k * 9;
            g.rect(px - w * 0.3, H - b - 15 + dy, w * 0.6, 15);
            roof(px, w, b + 13, 10);
            b += 23;
          }
          g.moveTo(px - 2.5, H - b - 6 + dy);
          g.lineTo(px, H - b - 30 + dy);
          g.lineTo(px + 2.5, H - b - 6 + dy);
          g.closePath();
          const vx = azX(31);
          g.moveTo(vx - 46, H - 40 + dy);
          g.quadraticCurveTo(vx, H - 96 + dy, vx + 46, H - 40 + dy);
          g.closePath();
          g.rect(vx - 30, H - 42, 60, 42);
          g.fill();
        };
        g.fillStyle = rim;
        shape(0);
        g.fillStyle = body;
        shape(3.2);
        // mist wash at the foot of the layer
        g.globalCompositeOperation = "source-atop";
        const mg = g.createLinearGradient(0, H - 70, 0, H);
        mg.addColorStop(0, "rgba(120,130,180,0)");
        mg.addColorStop(1, `rgba(120,130,185,${[0.5, 0.42, 0.3, 0.12][layer]})`);
        g.fillStyle = mg;
        g.fillRect(0, H - 70, 2048, 70);
        if (layer === 3) {
          for (let k = 0; k < 700; k++) {
            g.fillStyle = `rgba(242,${160 + Math.floor(r() * 50)},60,${0.35 + r() * 0.4})`;
            g.beginPath();
            g.arc(r() * 2048, H - 60 - r() * 120, 0.8 + r() * 1.6, 0, Math.PI * 2);
            g.fill();
          }
        }
        // a few dry-brush specks
        for (let k = 0; k < 900; k++) {
          g.fillStyle = `rgba(${r() < 0.5 ? "255,255,255" : "0,0,0"},${0.04 + r() * 0.05})`;
          g.fillRect(r() * 2048, H - r() * 140, 1 + r() * 3, 1 + r() * 2);
        }
        g.globalCompositeOperation = "source-over";
      },
      { srgb: true },
    ),
};

export function faceCapUV() {
  return { capH: (75 * Math.PI) / 180, capV: (70 * Math.PI) / 180 };
}
```

### 33/56 · `moonfilm/src/entry/film.ts`
<!-- casebook-file {"path": "moonfilm/src/entry/film.ts", "lines": 189, "final_newline": true, "sha256": "5204b1512722e5e569a55111ffef518a6bce32a51d53881716965b15ead9dfe7", "original_sha256": "5204b1512722e5e569a55111ffef518a6bce32a51d53881716965b15ead9dfe7"} -->
```ts
import * as THREE from "three";
import { World } from "../world/index";
import { MoonwashPost } from "../look/moonwash";
import { sampleCamera, applyCamera } from "../cam/path";
import { drawMG, loadFonts } from "../mg/subtitles";
import * as TL from "../timeline";
import { DESK, BOOK } from "../layout";

/**
 * Capture page. Render contract on window.film (same as the stop-motion-3d kit):
 *   ready     → meta once fonts + world exist
 *   frame(f)  → JPEG data URL of frame f (painted 3D plate + MG layer). Pure function of f.
 *   inspect(f)→ QC probe without pixels (contacts, penetration, camera clearance)
 *   meta()    → frames, beats, every timeline cue (the audio script derives sound from this)
 */
declare global {
  interface Window {
    film: unknown;
  }
}

const params = new URLSearchParams(location.search);
const OUT_W = Number(params.get("w") ?? 1920), OUT_H = Number(params.get("h") ?? 1080);
const PLATE_W = Number(params.get("pw") ?? 1600), PLATE_H = Number(params.get("ph") ?? 900);

const glCanvas = document.getElementById("gl") as HTMLCanvasElement;
const outCanvas = document.getElementById("out") as HTMLCanvasElement;
glCanvas.width = PLATE_W;
glCanvas.height = PLATE_H;
outCanvas.width = OUT_W;
outCanvas.height = OUT_H;

let world: World, post: MoonwashPost, renderer: THREE.WebGLRenderer, g2: CanvasRenderingContext2D;
const camera = new THREE.PerspectiveCamera(45, PLATE_W / PLATE_H, 0.03, 600);
let fontsOk = false;

async function boot() {
  fontsOk = await loadFonts();
  renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.setSize(PLATE_W, PLATE_H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // the look encodes sRGB itself
  renderer.toneMapping = THREE.NoToneMapping;
  world = new World();
  const hide = (params.get("hide") ?? "").split(",").filter(Boolean);
  if (hide.length) world.scene.traverse((o) => { if (hide.includes(o.name)) o.userData.debugHidden = true; });
  if (params.get("nomoonshadow")) world.moon.castShadow = false;
  post = new MoonwashPost(PLATE_W, PLATE_H);
  g2 = outCanvas.getContext("2d")!;
  g2.imageSmoothingEnabled = true;
  g2.imageSmoothingQuality = "high";
  return meta();
}

function render(f: number) {
  const t = f / TL.FPS;
  applyCamera(camera, sampleCamera(t), PLATE_W / PLATE_H);
  const st = world.update(t, camera);
  world.scene.traverse((o) => { if (o.userData.debugHidden) o.visible = false; });
  world.scene.updateMatrixWorld(true);
  post.render(renderer, world.scene, camera, { exposure: st.exposure, bloom: st.bloom, lift: st.lift, t }, null);
  g2.clearRect(0, 0, OUT_W, OUT_H);
  g2.drawImage(glCanvas, 0, 0, OUT_W, OUT_H);
  drawMG(g2, OUT_W, OUT_H, t, { titleY: 0.585 });
}

function beatAt(t: number) {
  return (TL.BEATS.find((b) => t >= b.t0 && t < b.t1) ?? TL.BEATS[TL.BEATS.length - 1]).id;
}

/** QC probe: no pixels. */
function inspect(f: number) {
  const t = f / TL.FPS;
  applyCamera(camera, sampleCamera(t), PLATE_W / PLATE_H);
  world.update(t, camera);
  world.scene.updateMatrixWorld(true);
  const p = world.probe;
  const contacts: { actor: string; hand: string; mode: string; pose: string; gap: number; surface: number }[] = [];
  const penetration: { actor: string; part: string; collider: string; depth: number }[] = [];
  const onBook = (v: THREE.Vector3) => Math.abs(v.x - BOOK.x) < BOOK.pageW + 0.005 && Math.abs(v.z - BOOK.z) < BOOK.pageD / 2;
  const onDesk = (v: THREE.Vector3) => v.x > DESK.x0 && v.x < DESK.x1 && v.z > DESK.zNear && v.z < DESK.zFar;
  const surfaceY = (v: THREE.Vector3) => (onBook(v) ? BOOK.y : onDesk(v) ? DESK.top : -1);
  for (const side of ["R", "L"] as const) {
    const h = p.hands[side];
    const sy = surfaceY(h);
    if (sy > 0) {
      const bottom = h.y - p.handR;
      contacts.push({ actor: "xuejie", hand: side, mode: "surface", pose: beatAt(t), gap: +(bottom - sy).toFixed(4), surface: +(bottom - sy).toFixed(4) });
      if (bottom < sy - 0.004) penetration.push({ actor: "xuejie", part: `hand${side}`, collider: onBook(h) ? "book" : "desk", depth: +(sy - bottom).toFixed(4) });
    }
    // forearm capsule vs the desk plane
    const [e, w] = p.forearms[side];
    for (let k = 0; k <= 6; k++) {
      const q = e.clone().lerp(w, k / 6);
      const s2 = surfaceY(q);
      if (s2 > 0 && q.y - 0.035 < s2 - 0.004) penetration.push({ actor: "xuejie", part: `forearm${side}`, collider: "desk", depth: +(s2 - (q.y - 0.035)).toFixed(4) });
    }
  }
  if (p.penMode === "write") {
    contacts.push({ actor: "xuejie", hand: "pen", mode: "exact", pose: "write", gap: +Math.abs(p.penTip.y - BOOK.y).toFixed(4), surface: +(p.penTip.y - BOOK.y).toFixed(4) });
  }
  // camera clearance: never inside set geometry or her head
  const cam = camera.position.clone();
  for (const c of world.colliders) {
    const b = c.box.clone().expandByScalar(0.03);
    if (b.containsPoint(cam)) penetration.push({ actor: "camera", part: "lens", collider: c.name, depth: 0.03 });
  }
  const dHead = cam.distanceTo(p.head) - p.headR;
  if (dHead < 0.06) penetration.push({ actor: "camera", part: "lens", collider: "head", depth: +(0.06 - dHead).toFixed(4) });
  for (const lp of world.out.lanternPos) {
    const d = cam.distanceTo(lp) - 0.2;
    if (d < 0.05) penetration.push({ actor: "camera", part: "lens", collider: "lantern", depth: +(0.05 - d).toFixed(4) });
  }
  return {
    frame: f,
    shot: beatAt(t),
    look: "moonwash",
    localFrame: f,
    poseT: t,
    sig: { xuejie: `t@${t.toFixed(3)}` },
    contacts,
    penetration,
    camera: { pos: cam.toArray().map((v) => +v.toFixed(3)), headClear: +dHead.toFixed(3) },
  };
}

function meta() {
  const fps = TL.FPS;
  return {
    title: "月光替你亮着灯 · 送学姐的中秋小礼物",
    mode: "A — continuous 3D, one take",
    look: "moonwash — 月夜水彩 Moonlit Watercolor",
    fps,
    width: OUT_W,
    height: OUT_H,
    plate: [PLATE_W, PLATE_H],
    total: TL.TOTAL,
    fontsOk,
    shots: TL.BEATS.map((b) => ({ id: b.id, look: "moonwash", start: Math.round(b.t0 * fps), frames: Math.round((b.t1 - b.t0) * fps), camera: "ONE_TAKE", beat: b.beat })),
    events: [],
    cues: {
      bpm: TL.BPM,
      bar: TL.BAR,
      subs: TL.SUBS.map((s) => ({ id: s.id, bar: s.bar, out: s.out, segs: s.segs.map((g) => ({ text: g.text, at: g.at })) })),
      title: TL.TITLE,
      seal: TL.SEAL,
      inscription: TL.INSCRIPTION,
      silence: TL.SILENCE,
      handFlips: TL.HAND_FLIPS,
      handFlipDur: TL.HAND_FLIP_DUR,
      breezeFlips: TL.BREEZE_FLIPS,
      moteEmit: TL.MOTE_EMIT,
      lanternIgnite: TL.LANTERN_IGNITE,
      constLift0: TL.CONST_LIFT0,
      constSettle0: TL.CONST_SETTLE0,
      constStagger: TL.CONST_STAGGER,
      constLines: TL.CONST_LINES,
      scaleLevel: TL.SCALE_LEVEL,
      scaleChime: TL.SCALE_CHIME,
      streams: TL.STREAMS,
      moonFull: TL.MOON_FULL,
      moonbeam: TL.MOONBEAM,
      petalsIn: TL.PETALS_IN,
      ring: TL.RING,
      skyLanterns: TL.SKY_LANTERNS,
      act: TL.ACT,
    },
  };
}

const ready = boot();
window.film = {
  ready,
  async frame(f: number, quality = 0.95) {
    await ready;
    render(f);
    return outCanvas.toDataURL("image/jpeg", quality);
  },
  async inspect(f: number) {
    await ready;
    return inspect(f);
  },
  async meta() {
    await ready;
    return meta();
  },
};
```

### 34/56 · `moonfilm/src/layout.ts`
<!-- casebook-file {"path": "moonfilm/src/layout.ts", "lines": 34, "final_newline": true, "sha256": "a1801fbbf7232a74a826f910ad61e5550795ef6dde57e5140cd0fca49032acc1", "original_sha256": "a1801fbbf7232a74a826f910ad61e5550795ef6dde57e5140cd0fca49032acc1"} -->
```ts
/**
 * LAYOUT — the set, in meters. +y up. The window wall is the plane z = 0; the room is z < 0,
 * the night outside is z > 0. She sits facing +z (the window), so HER right hand is at −x
 * (frame-right when we stand behind her) and her left at +x.
 */
export const ROOM = { x0: -1.85, x1: 1.85, zBack: -3.7, h: 2.72, wallT: 0.2 };
export const WIN = { x0: -0.86, x1: 0.86, y0: 0.93, y1: 2.34, zIn: -0.1, zOut: 0.1 };
export const DESK = { x0: -0.74, x1: 0.74, zNear: -0.74, zFar: -0.12, top: 0.74, t: 0.04 };
export const CHAIR = { x: 0, z: -1.1, seat: 0.45 };
/** open book: spine along z at x = 0; pages are PAGE_W wide each side, PAGE_D deep */
export const BOOK = { x: 0, z: -0.45, y: DESK.top + 0.018, pageW: 0.165, pageD: 0.235 };
export const LAMP = { x: 0.52, z: -0.3 };
export const STACK = { x: -0.55, z: -0.3 };
export const MUG = { x: 0.34, z: -0.25 };
export const PLATE = { x: 0.33, z: -0.62 };
export const PEN_REST = { x: -0.25, z: -0.58 };

/** where she sits */
export const HIPS = { x: 0, y: CHAIR.seat + 0.04, z: -1.07 };

const norm = (x: number, y: number, z: number): [number, number, number] => {
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
};
/** the moon: slightly to her left (+x), a rising moon ~12° above the horizon, straight out of the window */
export const MOON_DIR = norm(0.1361, 0.2079, 0.9686);
export const MOON_ANG_R = 0.068; // angular radius (rad) ≈ 3.5° — a poet's moon, not an astronomer's

/** string of lanterns in the courtyard, in front of the window */
export const LANTERN_ROPE = { a: [2.85, 2.45, 4.2] as [number, number, number], b: [-2.85, 2.45, 4.2] as [number, number, number], sag: 0.22 };
export const LANTERN_COUNT = 6;

/** constellation plane: to the right of the moon (−x), in the sky */
export const CONST = { az: -0.27, el: 0.3, dist: 90, unit: 9.2 };
```

### 35/56 · `moonfilm/src/look/moonwash.ts`
<!-- casebook-file {"path": "moonfilm/src/look/moonwash.ts", "lines": 269, "final_newline": true, "sha256": "6b697938e35c034e1906c4dfe36d9162ee5d25568979d527564b28969a323522", "original_sha256": "6b697938e35c034e1906c4dfe36d9162ee5d25568979d527564b28969a323522"} -->
```ts
import * as THREE from "three";
import { GBuffer, fsPass, bindCommon, type Pass } from "../core/post";
import { TEX } from "../core/tex";

/**
 * LOOK — 月夜水彩 · Moonlit Watercolor (the ONLY look in this film).
 * A night variant of the kit's watercolor pipeline, touching all five layers:
 *   geometry  soft primitives (rounded, low-poly lumps read as brush shapes)
 *   shading   Lambert washes, palette pulled toward indigo / lamp-gold
 *   light     cool moon key + warm desk lamp + indigo hemisphere
 *   post      pigment wander → 7-tap wash → pooled rims → wet-in-wet glow → granulation →
 *             cold-press paper → indigo pencil underdrawing → paper-white highlights
 *   cadence   continuous 24 fps (Mode A), paper grain fixed to the sheet
 */

export const PAL: Record<string, string> = {
  wall: "#cdb89a",
  wallOut: "#9c8a78",
  floor: "#7c5236",
  ceiling: "#b8a68c",
  wood: "#9a6440",
  woodDark: "#5e3a24",
  woodLight: "#c18f62",
  frame: "#6f4a30",
  paper: "#f3ead8",
  pageEdge: "#e2d6bd",
  skin: "#f0c0a2",
  hair: "#382822",
  sweater: "#b9accb",
  skirt: "#3f4a66",
  shoe: "#5b3c30",
  lampMetal: "#e3d8c2",
  mug: "#ece6dc",
  mugBand: "#6c8bb0",
  tea: "#8d5d25",
  plate: "#f0eadf",
  cakeSide: "#b7743a",
  pen: "#2e3b5c",
  sticky: "#f4d468",
  curtain: "#efe4d0",
  trunk: "#3f3129",
  leaf: "#2f4a38",
  flower: "#f2a93b",
  rope: "#35261f",
  lanternCap: "#caa048",
  tassel: "#c23a2c",
  pole: "#34313a",
  clip: "#f3b447",
  shelf: "#6b4630",
  plantPot: "#b86b4a",
  plant: "#4d7a4f",
};

export type Mat = THREE.Material;

/** semantic → material, cached. World code only ever says WHAT a surface is. */
export class MatLib {
  private cache = new Map<string, Mat>();
  get(sem: string): Mat {
    let m = this.cache.get(sem);
    if (m) return m;
    m = this.make(sem);
    this.cache.set(sem, m);
    return m;
  }
  private make(sem: string): Mat {
    const [kind, arg] = sem.split(":");
    const hex = arg && arg.startsWith("#") ? arg : PAL[kind] ?? "#ff00ff";
    switch (kind) {
      case "curtain":
        return new THREE.MeshLambertMaterial({ color: hex, transparent: true, opacity: 0.62, side: THREE.DoubleSide, depthWrite: false });
      case "lampShadeIn":
        return new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd89a").multiplyScalar(1.0), side: THREE.BackSide });
      case "paperLamp":
        return new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffc98a").multiplyScalar(1.6) });
      case "bulb":
        return new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff1cf").multiplyScalar(2.2) });
      case "flower":
        return new THREE.MeshLambertMaterial({ color: hex, emissive: new THREE.Color("#f0a030"), emissiveIntensity: 0.28 });
      case "mooncakeTop":
        return new THREE.MeshLambertMaterial({ map: TEX.mooncake() });
      case "sweater":
        return new THREE.MeshLambertMaterial({ color: hex, map: TEX.knit() });
      case "hair":
        return new THREE.MeshPhongMaterial({ color: hex, specular: new THREE.Color("#3d3236"), shininess: 12 });
      case "tea":
        return new THREE.MeshLambertMaterial({ color: hex, emissive: new THREE.Color("#3a2008"), emissiveIntensity: 0.25 });
      default:
        return new THREE.MeshLambertMaterial({ color: hex });
    }
  }
}

/** one lantern's paper: each lantern gets its own so it can be lit independently */
export function lanternMaterial() {
  return new THREE.MeshLambertMaterial({
    map: TEX.lantern(),
    color: "#ffffff",
    emissive: new THREE.Color("#ff8a3c"),
    emissiveMap: TEX.lantern(),
    emissiveIntensity: 0,
  });
}

/** additive glow sprite material */
export function glowMaterial(color: string, opacity = 1) {
  return new THREE.SpriteMaterial({
    map: TEX.glow(),
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });
}

/* ------------------------------------------------------------------ post pipeline */
export interface LookParams {
  exposure: number; // pre-ACES exposure
  bloom: number; // wet glow strength
  lift: number; // 0..1 overall brightening (ending is brighter)
  t: number;
}

export class MoonwashPost {
  gbuf: GBuffer;
  private rtQ: THREE.WebGLRenderTarget; // 1/4 bright
  private rtQ2: THREE.WebGLRenderTarget;
  private rtE: THREE.WebGLRenderTarget; // 1/8 wide glow
  private rtE2: THREE.WebGLRenderTarget;
  private bright: Pass;
  private blur: Pass;
  private final: Pass;

  constructor(public W: number, public H: number) {
    this.gbuf = new GBuffer(W, H);
    const mk = (w: number, h: number) => new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    this.rtQ = mk(Math.ceil(W / 4), Math.ceil(H / 4));
    this.rtQ2 = mk(Math.ceil(W / 4), Math.ceil(H / 4));
    this.rtE = mk(Math.ceil(W / 8), Math.ceil(H / 8));
    this.rtE2 = mk(Math.ceil(W / 8), Math.ceil(H / 8));
    this.bright = fsPass(
      /* glsl */ `
      uniform sampler2D tSrc; uniform vec2 uSrcPx; uniform float uThr;
      void main(){
        vec3 s = vec3(0.);
        for (int j = 0; j < 4; j++){ vec2 o = vec2(float(j/2) - .5, float(j - (j/2)*2) - .5) * uSrcPx * 2.; s += texture2D(tSrc, vUv + o).rgb; }
        s *= .25;
        float l = max(max(s.r, s.g), s.b);
        float k = uThr > 0. ? smoothstep(uThr, uThr * 2.2, l) : 1.;
        vec3 b = s * k;
        gl_FragColor = vec4(min(b, vec3(12.)), 1.);
      }`,
      { tSrc: { value: null }, uSrcPx: { value: new THREE.Vector2() }, uThr: { value: 1.25 } },
    );
    this.blur = fsPass(
      /* glsl */ `
      uniform sampler2D tSrc; uniform vec2 uDir;
      void main(){
        vec3 s = texture2D(tSrc, vUv).rgb * .2270;
        s += (texture2D(tSrc, vUv + uDir * 1.3846).rgb + texture2D(tSrc, vUv - uDir * 1.3846).rgb) * .3162;
        s += (texture2D(tSrc, vUv + uDir * 3.2308).rgb + texture2D(tSrc, vUv - uDir * 3.2308).rgb) * .0703;
        gl_FragColor = vec4(s, 1.);
      }`,
      { tSrc: { value: null }, uDir: { value: new THREE.Vector2() } },
    );
    this.final = fsPass(
      /* glsl */ `
      uniform sampler2D tBloomA, tBloomB, tPaper;
      uniform float uExposure, uBloom, uLift;
      vec3 tone(vec3 h){ return toSRGB(aces(h * uExposure)); }
      vec3 samp(vec2 uv){ return tone(texture2D(tColor, uv).rgb); }
      float softStep(float x, float n){ float y = x * n; float f = fract(y); return (floor(y) + smoothstep(.28, .72, f)) / n; }
      void main(){
        vec2 px = 1. / uRes;
        bool sky = isSky(vUv);
        // 1 pigment wanders a few px off the drawing
        vec2 w = (vec2(fbm(vUv * 4.7), fbm(vUv * 4.7 + 7.1)) - .5) * 7.5 * px;
        vec2 uv = vUv + w;
        vec3 c0 = samp(uv);
        // 2 soft wash (7 taps, ~4.5 px)
        vec3 m = c0;
        for (int i = 0; i < 6; i++){ float a = float(i) * 1.0472 + .35; m += samp(uv + vec2(cos(a), sin(a)) * 4.6 * px); }
        m /= 7.;
        vec3 c = mix(c0, m, .62);
        // 3 washes are laid in values, not gradients: soft-quantize the value, keep the hue
        float L = luma(c);
        float Lq = softStep(L, 6.);
        c *= mix(1., Lq / max(L, .004), sky ? .25 : .55);
        // 4 pooled rims where washes meet (pigment runs to the edge of a wet area)
        float pool = clamp(length(c0 - m) * 3.6, 0., 1.);
        c = mix(c, c * c * .88, pool * (sky ? .25 : .7));
        // 5 uneven pigment: patchy density + a little wet-in-wet hue drift
        float patchy = fbm(vUv * vec2(3.1, 2.4) + 11.3);
        c *= .93 + .12 * patchy;
        c += vec3(.028, .0, -.02) * (fbm(vUv * 2.2 + 4.) - .5);
        // 6 wet-in-wet glow (bloom), screen blend, slightly irregular like a bloom in wet paint
        vec3 bA = texture2D(tBloomA, vUv + w * 2.).rgb, bB = texture2D(tBloomB, vUv + w * 3.).rgb;
        vec3 bl = (bA * .8 + bB * 1.15) * uBloom;
        bl *= .8 + .4 * fbm(vUv * 9. + 3.);
        vec3 bd = toSRGB(aces(bl * .7));
        c = 1. - (1. - c) * (1. - bd);
        // 7 granulation: pigment settles into the paper's valleys, strongest in mid-darks
        float l = luma(c);
        vec3 pt = texture2D(tPaper, vUv * uRes / 512.).rgb;
        float gran = vnoise(vUv * uRes * .31) * .55 + vnoise(vUv * uRes * .08) * .45;
        c *= mix(1., .76 + .36 * gran, smoothstep(.8, .1, l));
        // 8 the sheet: pigment sits on warm paper; darks are deep indigo, never black
        vec3 paper = vec3(.968, .948, .9) * (.88 + .12 * pt.r);
        vec3 floorC = vec3(.07, .08, .145) * (.85 + .3 * gran);
        c = floorC + c * (paper - floorC);
        // 9 indigo pencil underdrawing (not on sky / far landscape)
        if (!sky){
          float e = edgeDN(vUv, 1.2, .05, .3, (vec2(fbm(vUv * 11.), fbm(vUv * 11. + 3.)) - .5) * 2.8);
          c = mix(c, vec3(.15, .14, .24), e * .36);
        }
        // 10 the brightest washes give way to the paper itself (moon, lantern cores, lit pages)
        float hl = smoothstep(.87, 1.0, luma(c));
        c = mix(c, paper * vec3(1., .985, .95), hl * .5);
        // 11 lift for the happy ending: warm the mids a touch
        c = mix(c, c * vec3(1.06, 1.03, .96) + vec3(.02, .015, 0.), uLift);
        // 12 gentle darkening toward the corners (no paper border — subtitles live near the edge)
        vec2 q = vUv - .5;
        c *= 1. - .34 * pow(clamp(length(q * vec2(1.05, 1.25)) * 1.25, 0., 1.), 2.4);
        gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
      }`,
      { tBloomA: { value: null }, tBloomB: { value: null }, tPaper: { value: TEX.paper() }, uExposure: { value: 1 }, uBloom: { value: 1 }, uLift: { value: 0 } },
    );
  }

  render(r: THREE.WebGLRenderer, scene: THREE.Scene, cam: THREE.PerspectiveCamera, p: LookParams, out: THREE.WebGLRenderTarget | null) {
    const g = this.gbuf;
    g.renderColor(r, scene, cam);
    g.renderNormalDepth(r, scene, cam);
    // bloom chain
    const b = this.bright;
    b.u.tSrc.value = g.color.texture;
    (b.u.uSrcPx.value as THREE.Vector2).set(1 / this.W, 1 / this.H);
    b.run(r, this.rtQ);
    const bl = this.blur;
    const pass = (src: THREE.WebGLRenderTarget, dst: THREE.WebGLRenderTarget, dx: number, dy: number) => {
      bl.u.tSrc.value = src.texture;
      (bl.u.uDir.value as THREE.Vector2).set(dx / src.width, dy / src.height);
      bl.run(r, dst);
    };
    pass(this.rtQ, this.rtQ2, 1, 0);
    pass(this.rtQ2, this.rtQ, 0, 1);
    // wide level from the blurred quarter
    b.u.tSrc.value = this.rtQ.texture;
    (b.u.uSrcPx.value as THREE.Vector2).set(1 / this.rtQ.width, 1 / this.rtQ.height);
    b.u.uThr.value = 0.0;
    b.run(r, this.rtE);
    b.u.uThr.value = 1.25;
    pass(this.rtE, this.rtE2, 1.6, 0);
    pass(this.rtE2, this.rtE, 0, 1.6);
    pass(this.rtE, this.rtE2, 1.6, 0);
    pass(this.rtE2, this.rtE, 0, 1.6);
    const f = this.final;
    bindCommon(f, g, cam, 0, 0, p.t);
    f.u.tBloomA.value = this.rtQ.texture;
    f.u.tBloomB.value = this.rtE.texture;
    f.u.uExposure.value = p.exposure;
    f.u.uBloom.value = p.bloom;
    f.u.uLift.value = p.lift;
    f.run(r, out);
  }
}
```

### 36/56 · `moonfilm/src/mg/subtitles.ts`
<!-- casebook-file {"path": "moonfilm/src/mg/subtitles.ts", "lines": 249, "final_newline": true, "sha256": "fbc8a11b6a1fd2bf210428283bbd355637b122fd6b38a6d6a2a8b6a06ffb0745", "original_sha256": "fbc8a11b6a1fd2bf210428283bbd355637b122fd6b38a6d6a2a8b6a06ffb0745"} -->
```ts
import { SUBS, TITLE, SEAL, INSCRIPTION, type Sub } from "../timeline";
import { rng } from "../core/rng";

/**
 * MG LAYER — Chinese subtitles, the end title, the red seal and the inscription, drawn on the
 * 2D output canvas AFTER the painted plate (so type stays crisp at 1080p).
 * Every character is revealed on its own like ink touching wet paper: blur → sharp, soft rise.
 */
const SERIF = "'Noto Serif CJK SC'";
const CREAM = "#fbf3e2";
const GOLD = "#ffcf72";
const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
const sm = (u: number) => {
  u = clamp01(u);
  return u * u * (3 - 2 * u);
};
const outBack = (u: number) => {
  u = clamp01(u);
  const c1 = 1.9, c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
};

export async function loadFonts() {
  await Promise.all([
    document.fonts.load(`600 52px ${SERIF}`, "今晚月亮很圆学姐中秋快乐"),
    document.fonts.load(`900 120px ${SERIF}`, "学姐，中秋快乐！"),
    document.fonts.load(`700 60px ${SERIF}`, "加油"),
    document.fonts.load(`400 30px ${SERIF}`, "丙午中秋赠学姐"),
  ]);
  return document.fonts.check(`600 52px ${SERIF}`, "今晚月亮很圆");
}

interface Glyph {
  ch: string;
  x: number; // left
  w: number;
  at: number;
  gold: boolean;
}

function layoutSub(g: CanvasRenderingContext2D, s: Sub, size: number): { glyphs: Glyph[]; width: number } {
  g.font = `600 ${size}px ${SERIF}`;
  const glyphs: Glyph[] = [];
  let x = 0;
  for (const seg of s.segs) {
    const chars = Array.from(seg.text);
    const goldMask = new Array(chars.length).fill(false);
    for (const gw of seg.gold ?? []) {
      const i = seg.text.indexOf(gw);
      if (i >= 0) for (let k = 0; k < Array.from(gw).length; k++) goldMask[Array.from(seg.text.slice(0, i)).length + k] = true;
    }
    chars.forEach((ch, j) => {
      const w = g.measureText(ch).width;
      glyphs.push({ ch, x, w, at: seg.at + j * 0.055, gold: goldMask[j] });
      x += w + size * 0.04;
    });
  }
  return { glyphs, width: x - size * 0.04 };
}

/** a hand-carved seal: red stone, white characters, rough edge; drawn once (deterministic) */
let sealCanvas: HTMLCanvasElement | null = null;
function seal(sizePx: number) {
  if (sealCanvas) return sealCanvas;
  const S = sizePx;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const g = cv.getContext("2d")!;
  const r = rng(520);
  g.fillStyle = "#c3322b";
  const m = S * 0.06, rad = S * 0.12;
  g.beginPath();
  g.moveTo(m + rad, m);
  g.lineTo(S - m - rad, m);
  g.quadraticCurveTo(S - m, m, S - m, m + rad);
  g.lineTo(S - m, S - m - rad);
  g.quadraticCurveTo(S - m, S - m, S - m - rad, S - m);
  g.lineTo(m + rad, S - m);
  g.quadraticCurveTo(m, S - m, m, S - m - rad);
  g.lineTo(m, m + rad);
  g.quadraticCurveTo(m, m, m + rad, m);
  g.fill();
  // carve the two characters (white = paper), stacked vertically
  g.fillStyle = "#fbf1df";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `900 ${S * 0.38}px ${SERIF}`;
  g.fillText("加", S / 2, S * 0.3);
  g.fillText("油", S / 2, S * 0.71);
  // stone texture: paper specks through the ink, ragged edge
  g.globalCompositeOperation = "destination-out";
  for (let k = 0; k < 260; k++) {
    const onEdge = r() < 0.45;
    let x = r() * S, y = r() * S;
    if (onEdge) {
      const side = Math.floor(r() * 4);
      const p = r() * S;
      [x, y] = side === 0 ? [p, m + r() * 3] : side === 1 ? [p, S - m - r() * 3] : side === 2 ? [m + r() * 3, p] : [S - m - r() * 3, p];
    }
    g.globalAlpha = 0.25 + r() * 0.6;
    g.beginPath();
    g.arc(x, y, 0.6 + r() * (onEdge ? 2.6 : 1.3), 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";
  sealCanvas = cv;
  return cv;
}

export interface MGLayout {
  titleY: number; // 0..1 of height
}

export function drawMG(g: CanvasRenderingContext2D, W: number, H: number, t: number, lay: MGLayout = { titleY: 0.2 }) {
  const k = H / 1080;
  // ------------------------------------------------------------------ subtitles
  for (const s of SUBS) {
    const t0 = s.segs[0].at - 0.05;
    if (t < t0 || t > s.out + 0.5) continue;
    const size = Math.round(54 * k);
    const { glyphs, width } = layoutSub(g, s, size);
    const x0 = (W - width) / 2;
    const yB = H * 0.885;
    const lineOut = sm((t - s.out) / 0.38);
    // soft ink-wash band for legibility (fades with the line)
    const bandA = 0.34 * sm((t - t0) / 0.3) * (1 - lineOut);
    if (bandA > 0.003) {
      const gr = g.createRadialGradient(W / 2, yB - size * 0.35, 0, W / 2, yB - size * 0.35, width * 0.62 + 90 * k);
      gr.addColorStop(0, `rgba(10,14,34,${bandA})`);
      gr.addColorStop(1, "rgba(10,14,34,0)");
      g.save();
      g.translate(0, 0);
      g.scale(1, 0.22);
      g.fillStyle = gr;
      g.beginPath();
      g.ellipse(W / 2, (yB - size * 0.35) / 0.22, width * 0.62 + 90 * k, (width * 0.62 + 90 * k), 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    g.font = `600 ${size}px ${SERIF}`;
    g.textBaseline = "alphabetic";
    for (const gl of glyphs) {
      const a = sm((t - gl.at) / 0.34) * (1 - lineOut);
      if (a <= 0.002) continue;
      const blur = (1 - sm((t - gl.at) / 0.34)) * 7 * k + lineOut * 5 * k;
      const rise = (1 - sm((t - gl.at) / 0.4)) * 11 * k + lineOut * 8 * k;
      g.save();
      g.globalAlpha = a;
      if (blur > 0.3) g.filter = `blur(${blur.toFixed(2)}px)`;
      g.shadowColor = "rgba(6,10,28,0.85)";
      g.shadowBlur = 16 * k;
      g.fillStyle = gl.gold ? GOLD : CREAM;
      g.fillText(gl.ch, x0 + gl.x, yB - rise);
      g.restore();
    }
  }
  // ------------------------------------------------------------------ end title
  if (t >= TITLE.at - 0.02) {
    const size = Math.round(116 * k);
    g.font = `900 ${size}px ${SERIF}`;
    const chars = Array.from(TITLE.text);
    const gap = size * 0.03;
    const ws = chars.map((c) => g.measureText(c).width);
    const total = ws.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
    let x = (W - total) / 2;
    const yB = H * lay.titleY + size * 0.36;
    const goldStart = TITLE.text.indexOf("中秋快乐");
    chars.forEach((ch, i) => {
      const at = TITLE.at + i * 0.085;
      const u = (t - at) / 0.5;
      if (u > 0) {
        const a = sm(u * 1.4);
        const sc = 1.28 - 0.28 * outBack(u);
        const blur = (1 - sm(u)) * 14 * k;
        const cx = x + ws[i] / 2;
        // warm bloom behind each glyph as it lands
        const bloomA = 0.4 * Math.exp(-Math.pow((t - at - 0.25) / 0.35, 2));
        if (bloomA > 0.01) {
          const gr = g.createRadialGradient(cx, yB - size * 0.36, 0, cx, yB - size * 0.36, size * 0.9);
          gr.addColorStop(0, `rgba(255,205,120,${bloomA})`);
          gr.addColorStop(1, "rgba(255,205,120,0)");
          g.fillStyle = gr;
          g.fillRect(cx - size, yB - size * 1.3, size * 2, size * 2);
        }
        g.save();
        g.globalAlpha = a;
        g.translate(cx, yB - size * 0.36);
        g.scale(sc, sc);
        if (blur > 0.3) g.filter = `blur(${blur.toFixed(2)}px)`;
        g.shadowColor = "rgba(8,10,30,0.8)";
        g.shadowBlur = 24 * k;
        g.fillStyle = i >= goldStart && i < goldStart + 4 ? GOLD : CREAM;
        g.textBaseline = "middle";
        g.textAlign = "center";
        g.fillText(ch, 0, 0);
        g.restore();
      }
      x += ws[i] + gap;
    });
    // ------------------------------------------------------------------ seal (lands with her fist pump)
    const su = (t - (SEAL.at - 0.26)) / 0.26; // lands exactly on SEAL.at (with her fist pump + the thump)
    if (su > -0.05) {
      const S = Math.round(122 * k);
      const cv = seal(S);
      const sx = (W + total) / 2 + 46 * k, sy = yB - size * 0.2;
      const sc = su < 1 ? 1.9 - 0.9 * sm(su) : 1 + 0.05 * Math.exp(-(t - SEAL.at) * 12) * Math.sin((t - SEAL.at) * 40);
      const a = sm(su * 3);
      // impact ring
      if (su > 0.9 && su < 4) {
        const rr = (su - 0.9) / 3.1;
        g.save();
        g.globalAlpha = (1 - rr) * 0.5;
        g.strokeStyle = "#e86a4f";
        g.lineWidth = 3 * k;
        g.beginPath();
        g.arc(sx, sy, S * (0.62 + rr * 0.7), 0, Math.PI * 2);
        g.stroke();
        g.restore();
      }
      g.save();
      g.globalAlpha = a;
      g.translate(sx, sy);
      g.rotate(-0.07);
      g.scale(sc, sc);
      g.shadowColor = "rgba(0,0,0,0.35)";
      g.shadowBlur = 10 * k;
      g.drawImage(cv, -S / 2, -S / 2, S, S);
      g.restore();
    }
    // ------------------------------------------------------------------ inscription
    const iu = (t - INSCRIPTION.at) / 0.7;
    if (iu > 0) {
      const size2 = Math.round(30 * k);
      g.save();
      g.font = `400 ${size2}px ${SERIF}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.globalAlpha = sm(iu) * 0.92;
      if (iu < 1) g.filter = `blur(${((1 - sm(iu)) * 4 * k).toFixed(2)}px)`;
      g.shadowColor = "rgba(6,10,28,0.8)";
      g.shadowBlur = 10 * k;
      g.fillStyle = "#efe2c4";
      const text = Array.from(INSCRIPTION.text).join(" ");
      g.fillText(text, W / 2, yB + size * 0.52);
      g.restore();
    }
  }
}
```

### 37/56 · `moonfilm/src/timeline.ts`
<!-- casebook-file {"path": "moonfilm/src/timeline.ts", "lines": 131, "final_newline": true, "sha256": "4807d299fcc1cc5a1e6fdae59378492820a267b8542fd16bcd4ee9bfab4d5158", "original_sha256": "4807d299fcc1cc5a1e6fdae59378492820a267b8542fd16bcd4ee9bfab4d5158"} -->
```ts
/**
 * TIMELINE — the single source of truth for picture AND sound.
 * Every time below is in seconds on one continuous clock (t = frame / FPS).
 * 80 BPM, 4/4 → one bar = 3.0 s; every subtitle line lands on a bar line.
 * meta() exports all of this so the audio script derives its cues from the same numbers.
 */
export const FPS = 24;
export const DURATION = 28.0;
export const TOTAL = Math.round(DURATION * FPS); // 672 frames
export const BPM = 80;
export const BAR = 3.0;
export const BEAT = 0.75;

/* ------------------------------------------------------------------ subtitles */
export interface SubSeg {
  text: string;
  at: number; // reveal start of this segment
  gold?: string[]; // substrings painted in lantern-gold
}
export interface Sub {
  id: string;
  bar: number;
  out: number; // dissolve start
  segs: SubSeg[];
}
export const SUBS: Sub[] = [
  { id: "L1", bar: 1, out: 2.84, segs: [{ text: "今晚月亮很圆，", at: 0.28 }, { text: "你的台灯也还亮着。", at: 1.9 }] },
  { id: "L2", bar: 2, out: 5.8, segs: [{ text: "这几个月会很难，", at: 3.12 }, { text: "但你一直在认真走。", at: 4.3 }] },
  { id: "L3", bar: 3, out: 8.84, segs: [{ text: "不急——", at: 6.1 }, { text: "一页一页，", at: 6.62, gold: ["一页一页"] }, { text: "一晚一晚。", at: 7.86, gold: ["一晚一晚"] }] },
  { id: "L4", bar: 4, out: 11.82, segs: [{ text: "每个认真的夜晚，", at: 9.12 }, { text: "都算数。", at: 10.5, gold: ["都算数"] }] },
  { id: "L5", bar: 5, out: 14.82, segs: [{ text: "你想让世界更公平、", at: 12.12 }, { text: "更温柔一点，", at: 13.36 }] },
  { id: "L6", bar: 6, out: 17.82, segs: [{ text: "这份心，", at: 15.12 }, { text: "本身就是力量。", at: 15.95, gold: ["力量"] }] },
  { id: "L7", bar: 7, out: 20.82, segs: [{ text: "你照亮过很多人，", at: 18.12 }, { text: "今晚换月亮照亮你。", at: 19.36, gold: ["照亮你"] }] },
  { id: "L8", bar: 8, out: 23.5, segs: [{ text: "你在争取的未来，", at: 21.12 }, { text: "你配得上。", at: 22.36, gold: ["配得上"] }] },
];
/** end card */
export const TITLE = { text: "学姐，中秋快乐！", at: 24.02, gold: ["中秋快乐"] };
export const SEAL = { text: "加油", at: 25.5 };
export const INSCRIPTION = { text: "丙午中秋 · 赠学姐", at: 26.05 };
/** music drop-out (silence is punctuation) right before the end card */
export const SILENCE: [number, number] = [23.52, 23.78];

/* ------------------------------------------------------------------ one-take camera */
export interface CamKey {
  t: number;
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}
export const CAMERA: CamKey[] = [
  // bar 1 — outside, the moon above a string of unlit lanterns; pull back through the open window
  { t: 0.0, pos: [-0.27, 1.55, 2.3], target: [1.11, 2.94, 12.1], fov: 44 },
  { t: 1.1, pos: [-0.2, 1.56, 1.05], target: [1.0, 2.75, 10.9], fov: 46 },
  { t: 2.0, pos: [-0.08, 1.56, -0.35], target: [0.75, 2.25, 9.6], fov: 48 },
  { t: 3.0, pos: [-0.12, 1.5, -1.95], target: [0.12, 1.55, 3.0], fov: 50 },
  // bar 2 — drift over her right shoulder: the pen, the page, the stack of books
  { t: 4.5, pos: [-0.42, 1.52, -1.52], target: [-0.05, 1.0, -0.55], fov: 46 },
  { t: 5.9, pos: [-0.5, 1.4, -1.22], target: [-0.06, 0.86, -0.46], fov: 42 },
  // bar 3 — low at her right, across the book toward the lamp; then turn with the rising lights
  { t: 7.1, pos: [-0.62, 1.22, -0.72], target: [0.02, 0.8, -0.42], fov: 40 },
  { t: 8.2, pos: [-0.55, 1.22, -0.68], target: [0.1, 1.05, -0.12], fov: 44 },
  { t: 9.05, pos: [-0.3, 1.38, -1.0], target: [0.0, 1.8, 2.0], fov: 51 },
  // bar 4 — behind her, the window: the lanterns light one by one
  { t: 10.3, pos: [-0.2, 1.58, -1.55], target: [0.05, 1.66, 4.2], fov: 56 },
  { t: 11.7, pos: [-0.12, 1.6, -1.2], target: [0.0, 1.9, 4.2], fov: 57 },
  // bars 5–6 — at the window: the constellation, the scale levelling, the moon filling
  { t: 13.3, pos: [-0.02, 1.58, -0.6], target: [-0.45, 2.62, 4.27], fov: 58 },
  { t: 14.7, pos: [0.0, 1.62, -0.45], target: [-0.4, 2.7, 4.4], fov: 58 },
  { t: 16.3, pos: [0.04, 1.65, -0.35], target: [0.21, 2.69, 4.54], fov: 56 },
  { t: 17.6, pos: [0.0, 1.62, -0.44], target: [0.35, 2.62, 4.5], fov: 54 },
  { t: 18.38, pos: [-0.2, 1.5, -0.42], target: [0.04, 0.8, -0.62], fov: 46 },
  // bar 7 — pull back and round to her right-front: moonlight on her face
  { t: 18.95, pos: [-0.36, 1.42, -0.42], target: [0.0, 1.27, -0.93], fov: 42 },
  { t: 20.45, pos: [-0.5, 1.31, -0.38], target: [0.0, 1.24, -0.96], fov: 36 },
  // bar 8 — back and up behind her right shoulder (the stretch; stars gather round the moon)
  { t: 21.9, pos: [-0.64, 1.5, -1.82], target: [0.0, 1.28, -0.85], fov: 46 },
  { t: 23.25, pos: [-0.4, 1.63, -2.05], target: [0.18, 1.6, 3.0], fov: 50 },
  // bar 9 — end card: behind her, the full moon, a sky of lanterns
  { t: 24.7, pos: [-0.2, 1.64, -2.2], target: [0.235, 1.38, 2.77], fov: 52 },
  { t: 28.0, pos: [-0.12, 1.67, -2.05], target: [0.28, 1.43, 2.9], fov: 50 },
];

/* ------------------------------------------------------------------ story events */
/** pages turned by her hand ("一页一页") — t = hand grabs the edge; the flip itself lasts FLIP_DUR */
export const HAND_FLIPS = [6.62, 7.37];
export const HAND_FLIP_DUR = 0.52;
/** pages turned by a breeze through the window ("一晚一晚") */
export const BREEZE_FLIPS = [7.92, 8.08, 8.24, 8.4];
export const BREEZE_FLIP_DUR = 0.38;
/** each flip releases a light mote (same order as flips) … */
export const MOTE_EMIT = [6.88, 7.63, 8.1, 8.26, 8.42, 8.58];
/** … which ignites one lantern on the string outside (eighth notes in bar 4) */
export const LANTERN_IGNITE = [9.375, 9.75, 10.125, 10.5, 10.875, 11.25];
/** constellation: orbs lift off at LIFT[i], settle at SETTLE[i] */
export const CONST_LIFT0 = 12.05;
export const CONST_SETTLE0 = 12.95;
export const CONST_STAGGER = 0.09;
export const CONST_LINES: [number, number] = [13.45, 14.85];
export const SCALE_LEVEL: [number, number] = [15.78, 16.5]; // the scale comes to balance …
export const SCALE_CHIME = 16.5; // … and rings on beat 3 of bar 6
export const STREAMS: [number, number] = [16.6, 17.85]; // light flows to the moon
export const MOON_FULL: [number, number] = [16.55, 18.7]; // clouds clear, moon brightens
export const MOONBEAM = 19.36; // moonlight pours into the room
export const PETALS_IN = 18.4;
export const RING: [number, number] = [21.35, 23.45]; // stars gather into a ring around the moon
export const SKY_LANTERNS = 24.0; // many lanterns rise for the end card

/** her acting beats */
export const ACT = {
  lookLanterns: 9.7, // lifts her head to the lanterns
  lookMoon: 18.25, // looks up at the moon
  smile: 19.55, // smile when "今晚换月亮照亮你"
  penDown: [21.12, 21.5] as [number, number],
  stretch: [21.62, 22.72] as [number, number], // arms rise … hold …
  relax: [22.72, 23.4] as [number, number],
  cheer: [25.12, 25.5] as [number, number], // fist pump lands with the seal
  cheerDown: [26.3, 27.1] as [number, number],
};

/* ------------------------------------------------------------------ beats (for meta / QC) */
export const BEATS = [
  { id: "B1", beat: "world", t0: 0, t1: 3 },
  { id: "B2", beat: "character", t0: 3, t1: 6 },
  { id: "B3", beat: "work", t0: 6, t1: 9 },
  { id: "B4", beat: "work", t0: 9, t1: 12 },
  { id: "B5", beat: "opportunity", t0: 12, t1: 15 },
  { id: "B6", beat: "turn", t0: 15, t1: 18 },
  { id: "B7", beat: "result", t0: 18, t1: 21 },
  { id: "B8", beat: "echo", t0: 21, t1: 24 },
  { id: "B9", beat: "echo", t0: 24, t1: 28 },
];
```

### 38/56 · `moonfilm/src/world/girl.ts`
<!-- casebook-file {"path": "moonfilm/src/world/girl.ts", "lines": 536, "final_newline": true, "sha256": "ead2173638795b433e187eda3e93ddc63052bca8486c108141c13c4e0cf1df77", "original_sha256": "ead2173638795b433e187eda3e93ddc63052bca8486c108141c13c4e0cf1df77"} -->
```ts
import * as THREE from "three";
import type { MatLib } from "../look/moonwash";
import { TEX, faceCapUV } from "../core/tex";
import { HIPS, BOOK, DESK, PEN_REST } from "../layout";
import { ACT, HAND_FLIPS, HAND_FLIP_DUR } from "../timeline";
import { track, track3, win, smoother, smooth, lerp, clamp01 } from "../core/anim";

/**
 * 学姐 — a soft seated puppet: rounded primitives, painted face decals, 2-bone IK arms.
 * Everything is a pure function of t (no state carried between frames).
 */
const D = Math.PI / 180;
export const HEAD_R = 0.105;
const L1 = 0.27; // shoulder → elbow
const L2 = 0.28; // elbow → hand centre
const HAND_R = 0.031;
export const RELEASE = 0.62; // fraction of a hand-flip during which the hand rides the page edge

type V3 = THREE.Vector3;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const Y_AXIS = V(0, 1, 0);

function capsule(r: number, len: number, mat: THREE.Material, seg = 10) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len), 4, seg), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}
function ball(r: number, mat: THREE.Material, w = 18, h = 12) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, w, h), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}
/** place a Y-aligned mesh so it spans a → b */
function span(m: THREE.Object3D, a: V3, b: V3) {
  m.position.copy(a).add(b).multiplyScalar(0.5);
  const d = b.clone().sub(a);
  m.quaternion.setFromUnitVectors(Y_AXIS, d.normalize());
}

/** spherical cap on the face with UVs in (azimuth, latitude) — matches TEX.face */
function faceCap(r: number) {
  const { capH, capV } = faceCapUV();
  const N = 24;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let j = 0; j <= N; j++)
    for (let i = 0; i <= N; i++) {
      const az = -capH + (2 * capH * i) / N, lat = -capV + (2 * capV * j) / N;
      pos.push(r * Math.sin(az) * Math.cos(lat), r * Math.sin(lat), r * Math.cos(az) * Math.cos(lat));
      uv.push(i / N, j / N);
    }
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** two-bone IK: returns elbow + end (end = target if reachable, else as far as the arm goes) */
export function solveIK(shoulder: V3, target: V3, pole: V3, l1 = L1, l2 = L2) {
  const toT = target.clone().sub(shoulder);
  let d = toT.length();
  const dir = toT.clone().normalize();
  d = Math.min(Math.max(d, Math.abs(l1 - l2) + 1e-3), l1 + l2 - 1e-4);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const a1 = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const perp = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir)));
  if (perp.lengthSq() < 1e-8) perp.set(0, -1, 0);
  perp.normalize();
  const elbow = shoulder.clone().add(dir.clone().multiplyScalar(l1 * Math.cos(a1))).add(perp.multiplyScalar(l1 * Math.sin(a1)));
  const end = shoulder.clone().add(dir.clone().multiplyScalar(d));
  return { elbow, end };
}

/** lowest gap between the forearm capsule and the desk / page under it (m; negative = inside) */
const FORE_R = 0.035;
function forearmClearance(elbow: V3, end: V3) {
  let worst = 1;
  for (let k = 0; k <= 6; k++) {
    const q = elbow.clone().lerp(end, k / 6);
    const onBook = Math.abs(q.x - BOOK.x) < BOOK.pageW + 0.005 && Math.abs(q.z - BOOK.z) < BOOK.pageD / 2;
    const onDesk = q.x > DESK.x0 && q.x < DESK.x1 && q.z > DESK.zNear && q.z < DESK.zFar;
    if (!onBook && !onDesk) continue;
    const sy = onBook ? BOOK.y : DESK.top;
    worst = Math.min(worst, q.y - FORE_R - sy);
  }
  return worst;
}

export interface GirlProbe {
  hands: { R: V3; L: V3 };
  handR: number;
  forearms: { R: [V3, V3]; L: [V3, V3] };
  penTip: V3;
  penMode: "write" | "hold" | "rest";
  head: V3;
  headR: number;
}

export class Girl {
  root = new THREE.Group();
  private torso = new THREE.Group();
  private headPivot = new THREE.Group();
  private head = new THREE.Group();
  private faces: Record<string, THREE.Mesh> = {};
  private arm: Record<"R" | "L", { up: THREE.Mesh; fore: THREE.Mesh; hand: THREE.Mesh; sh: THREE.Mesh; el: THREE.Mesh; cuff: THREE.Mesh }>;
  private pen = new THREE.Group();
  private hairLong: THREE.Mesh;
  private shoulderLocal = { R: V(-0.165, 0.455, 0), L: V(0.165, 0.455, 0) };
  probe!: GirlProbe;

  constructor(M: MatLib) {
    const skin = M.get("skin"), hair = M.get("hair"), sweater = M.get("sweater"), skirt = M.get("skirt"), shoe = M.get("shoe");
    this.root.position.set(HIPS.x, HIPS.y, HIPS.z);
    this.root.name = "girl";
    // ---------------- lower body (does not bend with the spine)
    const lap = ball(0.14, skirt);
    lap.scale.set(1.12, 0.55, 1.0);
    lap.position.set(0, 0.02, 0.03);
    this.root.add(lap);
    for (const s of [-1, 1]) {
      const thigh = capsule(0.058, 0.36, skirt);
      span(thigh, V(s * 0.085, 0.03, 0.0), V(s * 0.095, 0.04, 0.4));
      const shin = capsule(0.047, 0.36, skirt);
      span(shin, V(s * 0.095, 0.04, 0.41), V(s * 0.095, -0.4, 0.44));
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.055, 0.17), shoe);
      foot.position.set(s * 0.095, -0.445, 0.49);
      foot.castShadow = true;
      this.root.add(thigh, shin, foot);
    }
    // ---------------- torso (pivot at the hips)
    this.root.add(this.torso);
    const prof = [
      [0.0, 0.0], [0.132, 0.0], [0.13, 0.1], [0.128, 0.22], [0.146, 0.33], [0.153, 0.41], [0.14, 0.46], [0.1, 0.505], [0.05, 0.53], [0.0, 0.535],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 28), sweater);
    body.scale.set(1, 1, 0.74);
    body.castShadow = body.receiveShadow = true;
    this.torso.add(body);
    // soft collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.06, 0.07, 20), M.get("sweater"));
    collar.position.set(0, 0.535, 0.006);
    collar.castShadow = true;
    collar.name = "collar";
    body.name = "torso";
    this.torso.add(collar);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.037, 0.085, 14), skin);
    neck.position.set(0, 0.55, 0.006);
    neck.name = "neck";
    this.torso.add(neck);
    // long hair: a curved sheet wrapping the back of the neck and shoulders, uneven ends
    {
      const g = new THREE.CylinderGeometry(0.095, 0.158, 0.4, 24, 6, true, (80 * Math.PI) / 180, (200 * Math.PI) / 180);
      const pos = g.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const bottom = y < -0.19;
        const th = Math.atan2(x, z);
        pos.setXYZ(i, x, y + (bottom ? 0.022 * Math.sin(th * 7) - 0.02 * Math.cos(th) : 0), z);
      }
      g.computeVertexNormals();
      this.hairLong = new THREE.Mesh(g, hair);
      this.hairLong.castShadow = true;
      this.hairLong.receiveShadow = true;
      this.hairLong.scale.set(1.05, 1, 0.82);
      this.hairLong.position.set(0, 0.43, -0.022);
      this.hairLong.name = "hairLong";
      this.torso.add(this.hairLong);
    }
    // ---------------- head
    this.headPivot.position.set(0, 0.575, 0.01);
    this.torso.add(this.headPivot);
    this.head.position.set(0, 0.112, 0.014);
    this.headPivot.add(this.head);
    const skull = new THREE.Group();
    skull.scale.set(1, 1.04, 0.98);
    this.head.add(skull);
    const sk = ball(HEAD_R, skin, 28, 20);
    sk.name = "skull";
    skull.add(sk);
    for (const k of ["focus", "look", "gaze", "smile", "blink"] as const) {
      const m = new THREE.Mesh(
        faceCap(HEAD_R * 1.006),
        new THREE.MeshLambertMaterial({ map: TEX.face(k), transparent: true, depthWrite: false, opacity: 0 }),
      );
      m.userData.noOutline = true;
      m.renderOrder = 2;
      m.name = `face_${k}`;
      skull.add(m);
      this.faces[k] = m;
    }
    // hair: a shell around the back and sides (face left open), a front cap down to the brow,
    // pointed fringe strands, side locks framing the face
    const HR = HEAD_R * 1.085;
    const shell = new THREE.Mesh(new THREE.SphereGeometry(HR, 34, 22, (145 * Math.PI) / 180, (250 * Math.PI) / 180, 0, (150 * Math.PI) / 180), hair);
    shell.position.set(0, 0.004, -0.006);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(HR, 26, 14, (33 * Math.PI) / 180, (114 * Math.PI) / 180, 0, (70 * Math.PI) / 180), hair);
    cap.position.set(0, 0.004, -0.004);
    shell.name = "hairShell";
    cap.name = "hairCap";
    for (const m of [shell, cap]) {
      m.castShadow = true;
      m.receiveShadow = true;
      (m.material as THREE.Material).side = THREE.DoubleSide;
      skull.add(m);
    }
    // fringe: strands hanging from the cap edge (lat ≈ 20°) to just above the eyes
    const strands: [number, number, number][] = [[-46, 0.9, -0.25], [-27, 1.0, 0.18], [-8, 1.08, -0.1], [11, 1.02, 0.2], [30, 0.95, -0.22], [48, 0.85, 0.3]];
    for (const [az, len, tilt] of strands) {
      const f = ball(0.03, hair, 12, 10);
      f.scale.set(0.95, 1.0 * len, 0.42);
      const a0 = (az * Math.PI) / 180, lat = (22 * Math.PI) / 180;
      f.position.set(Math.sin(a0) * Math.cos(lat), Math.sin(lat), Math.cos(a0) * Math.cos(lat)).multiplyScalar(HR * 0.985);
      f.lookAt(f.position.clone().multiplyScalar(2));
      f.rotateX(-0.28);
      f.rotateZ(tilt);
      skull.add(f);
    }
    // side locks framing the face, down past the jaw
    for (const s of [-1, 1]) {
      const lock = capsule(0.022, 0.16, hair, 12);
      span(lock, V(s * HEAD_R * 0.93, 0.03, 0.03), V(s * HEAD_R * 1.0, -0.15, 0.012));
      lock.scale.set(1.15, 1, 0.65);
      skull.add(lock);
    }
    // osmanthus hair clip above her left ear (+x)
    const clipMat = M.get("clip");
    for (let k = 0; k < 6; k++) {
      const b = ball(0.0115, clipMat, 8, 6);
      const a = (58 + (k % 3) * 9) * D, lat = (20 + Math.floor(k / 3) * 10 + (k % 2) * 3) * D;
      b.position.set(Math.sin(a) * Math.cos(lat), Math.sin(lat), Math.cos(a) * Math.cos(lat)).multiplyScalar(HEAD_R * 1.12);
      skull.add(b);
    }
    // ---------------- arms (world-space IK every frame; meshes live under root's parent space)
    const mk = () => {
      const up = capsule(0.04, L1 - 0.03, sweater);
      const fore = capsule(0.035, 0.2, sweater);
      const hand = ball(HAND_R, skin, 14, 10);
      const sh = ball(0.052, sweater, 16, 10);
      const el = ball(0.039, sweater, 12, 8);
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.037, 0.05, 14), sweater);
      cuff.castShadow = true;
      return { up, fore, hand, sh, el, cuff };
    };
    this.arm = { R: mk(), L: mk() };
    // pen: origin at the tip, body along +y
    const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.0058, 0.0058, 0.125, 8), M.get("pen"));
    penBody.position.y = 0.0145 + 0.0625;
    const penTip = new THREE.Mesh(new THREE.ConeGeometry(0.0058, 0.0145, 8), M.get("pen"));
    penTip.rotation.x = Math.PI;
    penTip.position.y = 0.00725;
    this.pen.add(penBody, penTip);
    this.pen.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    this.noHeadShadows();
  }

  /** head parts never cast shadows: the moon's shadow map would stripe the face */
  noHeadShadows() {
    this.head.traverse((o) => ((o as THREE.Mesh).castShadow = false));
  }

  /** meshes that must be added to the scene root (arms + pen are posed in world space) */
  worldParts() {
    const a = this.arm;
    return [a.R.up, a.R.fore, a.R.hand, a.R.sh, a.R.el, a.R.cuff, a.L.up, a.L.fore, a.L.hand, a.L.sh, a.L.el, a.L.cuff, this.pen];
  }

  /* ---------------------------------------------------------------- acting curves */
  private spine(t: number) {
    const breathe = 0.9 * Math.sin((t / 3.6) * Math.PI * 2);
    const pitch = track(
      [[0, 14], [7.9, 14], [8.5, 8], [9.7, 8], [10.3, 5], [18.2, 5], [18.8, 2], [21.62, 2], [22.2, -9], [22.72, -8], [23.4, 4], [25.12, 4], [25.35, 0], [25.6, 3], [26.4, 2], [28, 3]],
      t,
    );
    const yaw = track([[0, 0], [9.7, 0], [10.3, -2], [18.2, -2], [18.8, 3], [21.1, 3], [21.5, -4], [21.62, -4], [22.2, 0], [28, 0]], t);
    const roll = track([[0, 0], [22.2, 0], [22.45, -3], [22.72, 2], [23.4, 0], [25.12, 0], [25.5, -2], [26.4, -1], [28, 0]], t);
    return { pitch: (pitch + breathe) * D, yaw: yaw * D, roll: roll * D };
  }

  private headAngles(t: number) {
    const writeBob = t < 6.4 ? 1.8 * Math.sin(t * Math.PI * 2 * 0.62) : 0;
    const pitch = track(
      [[0, 24], [6.3, 24], [6.6, 27], [7.9, 27], [8.35, 8], [8.8, 2], [9.7, 2], [10.25, -12], [11.9, -12], [12.6, -17], [15.4, -17], [16.2, -15], [18.25, -15], [18.8, -21], [21.12, -21], [21.4, 8], [21.62, 8], [22.2, -24], [22.72, -24], [23.4, -14], [25.12, -14], [25.4, -11], [26.4, -12], [28, -13]],
      t,
    );
    const yaw = track(
      [[0, 0], [6.3, 0], [6.6, -6], [7.9, -6], [8.8, 0], [12.0, 0], [12.6, -7], [15.4, -7], [16.2, 0], [18.25, 0], [18.8, 7], [21.12, 7], [21.4, -12], [21.62, -12], [22.2, 0], [23.4, 5], [28, 3]],
      t,
    );
    const roll = track(
      [[0, 0], [18.25, 0], [18.8, 5], [21.12, 5], [21.4, 0], [22.72, 0], [23.4, 3], [25.12, 3], [25.45, 10], [26.4, 7], [28, 6]],
      t,
    );
    return { pitch: (pitch + writeBob) * D, yaw: yaw * D, roll: roll * D };
  }

  private expression(t: number): Record<string, number> {
    // [start, kind] segments; crossfade 0.1 s at each boundary
    const seq: [number, string][] = [
      [0, "focus"], [9.72, "look"], [12.92, "blink"], [13.06, "look"], [16.8, "blink"], [16.94, "look"], [18.9, "blink"], [19.04, "look"],
      [19.55, "gaze"], [21.1, "look"], [21.66, "smile"], [22.95, "gaze"], [25.08, "smile"],
    ];
    const w: Record<string, number> = { focus: 0, look: 0, gaze: 0, smile: 0, blink: 0 };
    let i = 0;
    while (i < seq.length - 1 && t >= seq[i + 1][0]) i++;
    const cur = seq[i][1];
    const prev = i > 0 ? seq[i - 1][1] : cur;
    const u = i > 0 ? clamp01((t - seq[i][0]) / 0.1) : 1;
    w[cur] += u;
    w[prev] += 1 - u;
    return w;
  }

  /** writing: pen tip walks along lines on her right page (−x side) */
  private writingTip(t: number) {
    const period = 1.55;
    const k = Math.floor(t / period);
    const s = (t - k * period) / period;
    const line = k % 7;
    const xStart = BOOK.x - 0.03, xEnd = BOOK.x - 0.138;
    const z = BOOK.z + 0.075 - line * 0.021;
    const writeU = clamp01(s / 0.86);
    let x = lerp(xStart, xEnd, writeU);
    let y = BOOK.y + 0.0012;
    if (s > 0.86) {
      // carriage return: lifted, sliding back to the next line start
      const r = smooth((s - 0.86) / 0.14);
      x = lerp(xEnd, xStart, r);
      y += 0.012 * Math.sin(r * Math.PI);
    }
    // character-sized squiggles and tiny lifts between strokes
    x += 0.0035 * Math.sin(t * 43.0) + 0.002 * Math.sin(t * 71.0);
    const zz = z + 0.004 * Math.sin(t * 37.0 + 1.1);
    y += 0.0018 * Math.max(0, Math.sin(t * 29.0));
    return V(x, y, zz);
  }

  /** where the flipping page's free edge is (for the hand to ride) */
  static pageEdge(theta: number) {
    return V(BOOK.x - BOOK.pageW * Math.cos(theta), BOOK.y + 0.004 + BOOK.pageW * Math.sin(theta), BOOK.z - 0.07);
  }
  static flipAngle(t: number, t0: number, dur: number) {
    return Math.PI * smoother((t - t0) / dur);
  }

  private rightHand(t: number, penDirWrite: V3) {
    const rest = V(BOOK.x - 0.095, BOOK.y + 0.038, BOOK.z - 0.085);
    const deskRest = V(-0.15, DESK.top + HAND_R + 0.004, -0.665);
    const writeHand = this.writingTip(t).add(penDirWrite.clone().multiplyScalar(0.052));
    const edge0 = Girl.pageEdge(0).add(V(0, 0.03, 0));
    let pos: V3, penMode: "write" | "hold" | "rest" = "hold";
    let pole = V(-0.75, -1, -0.45);
    const [f1, f2] = HAND_FLIPS;
    const ride = (t0: number) => Girl.pageEdge(Girl.flipAngle(t, t0, HAND_FLIP_DUR)).add(V(0, 0.03, 0));
    if (t < 6.4) {
      pos = writeHand;
      penMode = "write";
    } else if (t < f1) {
      const u = smoother((t - 6.4) / (f1 - 6.4));
      pos = this.writingTip(6.4).add(penDirWrite.clone().multiplyScalar(0.052)).lerp(edge0, u);
      pos.y += 0.035 * Math.sin(u * Math.PI);
    } else if (t < f1 + HAND_FLIP_DUR * RELEASE) {
      pos = ride(f1);
    } else if (t < f2) {
      const a = Girl.pageEdge(Math.PI * smoother(RELEASE)).add(V(0, 0.03, 0));
      const u = smoother((t - (f1 + HAND_FLIP_DUR * RELEASE)) / (f2 - (f1 + HAND_FLIP_DUR * RELEASE)));
      pos = a.lerp(edge0, u);
      pos.y += 0.05 * Math.sin(u * Math.PI);
    } else if (t < f2 + HAND_FLIP_DUR * RELEASE) {
      pos = ride(f2);
    } else if (t < ACT.penDown[0]) {
      const a = Girl.pageEdge(Math.PI * smoother(RELEASE)).add(V(0, 0.03, 0));
      const u = smoother((t - (f2 + HAND_FLIP_DUR * RELEASE)) / 0.55);
      pos = a.lerp(rest, u);
      pos.y += 0.04 * Math.sin(u * Math.PI);
      pos.y += 0.002 * Math.sin(t * 1.7);
    } else if (t < ACT.stretch[0]) {
      // put the pen down, then hover
      const dst = V(PEN_REST.x + 0.02, DESK.top + 0.045, PEN_REST.z + 0.01);
      const u = smoother((t - ACT.penDown[0]) / (ACT.penDown[1] - ACT.penDown[0] - 0.08));
      pos = rest.clone().lerp(dst, u);
      pos.y += 0.05 * Math.sin(u * Math.PI);
      if (t > ACT.penDown[1]) pos.y += 0.015 * smooth((t - ACT.penDown[1]) / 0.12);
      penMode = t < ACT.penDown[1] - 0.08 ? "hold" : "rest";
    } else if (t < ACT.relax[1]) {
      const from = V(PEN_REST.x + 0.02, DESK.top + 0.06, PEN_REST.z + 0.01);
      const top = V(-0.21, 1.4, -1.08);
      const sway = t > ACT.stretch[1] - 0.4 ? 0.012 * Math.sin((t - ACT.stretch[1]) * 9) : 0;
      if (t < ACT.stretch[1]) {
        const u = smoother((t - ACT.stretch[0]) / (ACT.stretch[1] - 0.42 - ACT.stretch[0]));
        pos = from.lerp(top, u);
        pos.x += sway;
      } else {
        const u = smoother((t - ACT.relax[0]) / (ACT.relax[1] - ACT.relax[0]));
        pos = top.lerp(deskRest, u);
      }
      pole = V(-1, -0.1, 0.15).lerp(V(-0.75, -1, -0.45), t < ACT.stretch[1] ? 0 : smoother((t - ACT.relax[0]) / 0.5));
      if (t < ACT.stretch[0] + 0.25) pole = V(-0.75, -1, -0.45).lerp(V(-1, -0.1, 0.15), smoother((t - ACT.stretch[0]) / 0.25));
      penMode = "rest";
    } else {
      pos = deskRest.clone();
      pos.y += 0.0015 * Math.sin(t * 1.4);
      pole = V(-0.75, -1, -0.45);
      penMode = "rest";
    }
    return { pos, pole, penMode };
  }

  private leftHand(t: number) {
    const rest = V(BOOK.x + 0.1, BOOK.y + 0.035, BOOK.z - 0.08);
    const deskRest = V(0.15, DESK.top + HAND_R + 0.004, -0.665);
    const top = V(0.21, 1.4, -1.08);
    let pos: V3;
    let pole = V(0.75, -1, -0.45);
    if (t < ACT.stretch[0]) {
      pos = rest.clone();
      // the breeze startles her a little
      pos.y += 0.02 * Math.sin(clamp01((t - 7.95) / 0.8) * Math.PI);
      pos.y += 0.0015 * Math.sin(t * 1.3);
    } else if (t < ACT.stretch[1]) {
      const u = smoother((t - ACT.stretch[0]) / (ACT.stretch[1] - 0.42 - ACT.stretch[0]));
      pos = rest.clone().lerp(top, u);
      if (t > ACT.stretch[1] - 0.4) pos.x += 0.012 * Math.sin((t - ACT.stretch[1]) * 9);
      pole = V(0.75, -1, -0.45).lerp(V(1, -0.1, 0.15), smoother((t - ACT.stretch[0]) / 0.25));
    } else if (t < ACT.relax[1]) {
      const u = smoother((t - ACT.relax[0]) / (ACT.relax[1] - ACT.relax[0]));
      pos = top.clone().lerp(deskRest, u);
      pole = V(1, -0.1, 0.15).lerp(V(0.75, -1, -0.45), smoother(u * 1.5));
    } else {
      // cheer: a fist pump that lands with the seal, two little bounces, then down
      const up = V(0.17, 1.36, -0.9);
      const [c0, c1] = ACT.cheer, [d0, d1] = ACT.cheerDown;
      if (t < c0) pos = deskRest.clone();
      else if (t < c1) pos = deskRest.clone().lerp(up, smoother((t - c0) / (c1 - c0)));
      else if (t < d0) {
        pos = up.clone();
        const k = t - c1;
        pos.y += -0.04 * Math.sin((Math.min(k, 0.56) / 0.56) * Math.PI * 2) * Math.exp(-k * 2.0);
      } else pos = up.clone().lerp(deskRest, smoother((t - d0) / (d1 - d0)));
      pole = V(0.9, -1, 0.1);
    }
    return { pos, pole };
  }

  update(t: number) {
    // spine
    const sp = this.spine(t);
    this.torso.rotation.set(sp.pitch, sp.yaw, sp.roll, "YXZ");
    const ha = this.headAngles(t);
    this.headPivot.rotation.set(ha.pitch, ha.yaw, ha.roll, "YXZ");
    this.hairLong.rotation.set(-0.06 - sp.pitch * 0.35 + 0.012 * Math.sin(t * 1.3), 0.02 * Math.sin(t * 0.9), -sp.roll * 0.4);
    const ex = this.expression(t);
    for (const [k, m] of Object.entries(this.faces)) {
      (m.material as THREE.MeshLambertMaterial).opacity = ex[k];
      m.visible = ex[k] > 0.002;
    }
    this.root.updateMatrixWorld(true);
    // arms
    const penDirWrite = V(-0.32, 0.76, -0.56).normalize();
    const R = this.rightHand(t, penDirWrite);
    const L = this.leftHand(t);
    const out: Record<string, { hand: V3; elbow: V3; sh: V3 }> = {};
    for (const side of ["R", "L"] as const) {
      const sh = this.shoulderLocal[side].clone().applyMatrix4(this.torso.matrixWorld);
      const tgt = side === "R" ? R.pos : L.pos;
      const pole = side === "R" ? R.pole : L.pole;
      // keep the forearm ON the desk, never through it: if the solved elbow sinks the forearm,
      // swing the elbow backward/outward until it clears (choose the best candidate)
      let sol = solveIK(sh, tgt, pole);
      let best = forearmClearance(sol.elbow, sol.end);
      if (best < 0.001) {
        const sx = side === "R" ? -1 : 1;
        for (let k = 1; k <= 10; k++) {
          const p2 = pole.clone().normalize().lerp(V(sx * 0.8, 0.15, -1).normalize(), k / 10);
          const cand = solveIK(sh, tgt, p2);
          const c = forearmClearance(cand.elbow, cand.end);
          if (c > best) {
            best = c;
            sol = cand;
          }
          if (c >= 0.001) break;
        }
      }
      const { elbow, end } = sol;
      const a = this.arm[side];
      a.sh.position.copy(sh);
      span(a.up, sh, elbow);
      const wrist = elbow.clone().add(end.clone().sub(elbow).normalize().multiplyScalar(L2 - HAND_R * 0.9));
      span(a.fore, elbow, wrist);
      a.hand.position.copy(end);
      a.hand.quaternion.copy(a.fore.quaternion);
      a.hand.scale.set(1, 1.1, 0.85);
      a.el.position.copy(elbow);
      const fdir = end.clone().sub(elbow).normalize();
      a.cuff.position.copy(wrist).sub(fdir.clone().multiplyScalar(0.012));
      a.cuff.quaternion.setFromUnitVectors(Y_AXIS, fdir);
      out[side] = { hand: end, elbow, sh };
    }
    // pen
    let tip: V3;
    if (R.penMode === "write") {
      tip = out.R.hand.clone().sub(penDirWrite.clone().multiplyScalar(0.052));
      this.pen.position.copy(tip);
      this.pen.quaternion.setFromUnitVectors(Y_AXIS, penDirWrite);
    } else if (R.penMode === "hold") {
      const fore = out.R.hand.clone().sub(out.R.elbow).normalize();
      const dir = penDirWrite.clone().lerp(fore.clone().negate().add(V(0, 0.9, 0)).normalize(), 0.35).normalize();
      tip = out.R.hand.clone().sub(dir.clone().multiplyScalar(0.052));
      this.pen.position.copy(tip);
      this.pen.quaternion.setFromUnitVectors(Y_AXIS, dir);
    } else {
      // lying on the desk
      tip = V(PEN_REST.x + 0.05, DESK.top + 0.0059, PEN_REST.z - 0.02);
      this.pen.position.copy(tip);
      const dir = V(-0.62, 0, -0.78).normalize();
      this.pen.quaternion.setFromUnitVectors(Y_AXIS, dir);
    }
    const headW = new THREE.Vector3();
    this.head.getWorldPosition(headW);
    this.probe = {
      hands: { R: out.R.hand, L: out.L.hand },
      handR: HAND_R,
      forearms: { R: [out.R.elbow, out.R.hand], L: [out.L.elbow, out.L.hand] },
      penTip: tip,
      penMode: R.penMode,
      head: headW,
      headR: HEAD_R,
    };
    return this.probe;
  }
}
```

### 39/56 · `moonfilm/src/world/index.ts`
<!-- casebook-file {"path": "moonfilm/src/world/index.ts", "lines": 193, "final_newline": true, "sha256": "2b929463857b29347e88c3cee9d79bcc8446a22b70a0fa459e5ba89a462cfdac", "original_sha256": "2b929463857b29347e88c3cee9d79bcc8446a22b70a0fa459e5ba89a462cfdac"} -->
```ts
import * as THREE from "three";
import { MatLib } from "../look/moonwash";
import { indexNoOutline } from "../core/post";
import { makeSky } from "./sky";
import { buildRoom, type RoomHandles, type Collider } from "./room";
import { buildOutside, type OutsideHandles } from "./outside";
import { Girl, RELEASE, type GirlProbe } from "./girl";
import { MOON_DIR, BOOK, MUG, DESK } from "../layout";
import { HAND_FLIPS, HAND_FLIP_DUR, BREEZE_FLIPS, BREEZE_FLIP_DUR, MOON_FULL, SKY_LANTERNS, PETALS_IN, MOONBEAM } from "../timeline";
import { clamp01, smooth, smoother, win, pulse } from "../core/anim";

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

export interface WorldState {
  moonBright: number;
  exposure: number;
  lift: number;
  bloom: number;
}

export class World {
  scene = new THREE.Scene();
  M = new MatLib();
  sky = makeSky();
  room: RoomHandles;
  out: OutsideHandles;
  girl: Girl;
  moon: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  spot: THREE.SpotLight;
  bounce: THREE.PointLight;
  fill: THREE.PointLight;
  spill: THREE.PointLight;
  colliders: Collider[];
  probe!: GirlProbe;

  constructor() {
    const s = this.scene;
    s.add(this.sky.dome);
    this.room = buildRoom(this.M);
    s.add(this.room.group);
    this.out = buildOutside(this.M);
    s.add(this.out.group);
    this.girl = new Girl(this.M);
    s.add(this.girl.root);
    this.girl.worldParts().forEach((p) => s.add(p));
    this.colliders = this.room.colliders;
    // ---------------------------------------------------------------- light
    const md = V(...MOON_DIR);
    this.moon = new THREE.DirectionalLight("#b3c3ff", 0.6);
    const tgt = V(0, 0.95, -0.9);
    this.moon.position.copy(tgt).add(md.clone().multiplyScalar(14));
    this.moon.target.position.copy(tgt);
    this.moon.castShadow = true;
    this.moon.shadow.mapSize.set(2048, 2048);
    const sc = this.moon.shadow.camera as THREE.OrthographicCamera;
    sc.left = -2.4;
    sc.right = 2.4;
    sc.top = 2.4;
    sc.bottom = -2.4;
    sc.near = 2;
    sc.far = 30;
    this.moon.shadow.bias = -0.0006;
    this.moon.shadow.normalBias = 0.02;
    s.add(this.moon, this.moon.target);
    this.hemi = new THREE.HemisphereLight("#3b4d8c", "#23180f", 0.6);
    s.add(this.hemi);
    this.spot = new THREE.SpotLight("#ffc98a", 0.62, 0, 0.95, 0.85, 2);
    this.spot.position.copy(this.room.lampBulb);
    this.spot.target.position.copy(this.room.lampAim);
    s.add(this.spot, this.spot.target);
    this.bounce = new THREE.PointLight("#ffb877", 0.2, 3.2, 2);
    this.bounce.position.set(0.02, 0.97, -0.6);
    s.add(this.bounce);
    // a warm glow from the room behind her, so her hair never sinks into the dark
    this.fill = new THREE.PointLight("#ffc08a", 0.5, 7, 2);
    this.fill.position.set(1.62, 1.28, -2.3);
    s.add(this.fill);
    // the lanterns' warmth spilling in through the window (grows with the lit lanterns + the ending)
    this.spill = new THREE.PointLight("#ffa060", 0, 4.5, 2);
    this.spill.position.set(0.1, 2.05, 0.7);
    this.spill.visible = false;
    s.add(this.spill);
    indexNoOutline(s);
  }

  /** pose the whole world at time t (pure function of t) */
  update(t: number, cam: THREE.Camera): WorldState {
    // moon & sky
    const full = smoother((t - MOON_FULL[0]) / (MOON_FULL[1] - MOON_FULL[0]));
    const moonBright = 0.52 + 0.48 * full;
    const u = this.sky.uniforms;
    u.uMoonBright.value = moonBright;
    u.uVeil.value = 1 - 0.9 * full;
    u.uClear.value = full;
    u.uTime.value = t;
    this.sky.dome.position.copy(cam.position);
    // "今晚换月亮照亮你": a swell of moonlight on her face when the line lands
    const swell = Math.exp(-Math.pow((t - (MOONBEAM + 0.55)) / 0.9, 2));
    this.moon.intensity = 0.75 + 1.25 * full + 0.9 * swell;
    this.hemi.intensity = 0.55 + 0.25 * full + 0.35 * win(t, 23.8, 25.4);
    this.fill.intensity = 0.5 + 0.8 * win(t, 23.6, 25.2);
    const lit = this.out.lanternLit(t) / 6;
    this.spill.intensity = 0.35 * lit + 0.9 * win(t, 23.8, 25.6);
    this.spill.visible = this.spill.intensity > 0.01;
    // world
    this.out.update(t, cam);
    this.poseCurtains(t);
    this.posePages(t);
    this.poseSteam(t);
    this.probe = this.girl.update(t);
    const end = win(t, SKY_LANTERNS, SKY_LANTERNS + 1.6);
    return {
      moonBright,
      exposure: 1.08 + 0.1 * full + 0.12 * end,
      lift: 0.25 * full + 0.6 * end,
      bloom: 0.95 + 0.25 * full + 0.2 * end,
    };
  }

  private gust(t: number) {
    return 0.22 + 0.2 * Math.sin(t * 0.7) * 0.5 + 0.9 * pulse(t, 7.8, 8.05, 8.7, 9.5) + 0.7 * pulse(t, PETALS_IN - 0.2, PETALS_IN + 0.4, 19.8, 21.2) + 0.5 * pulse(t, 23.8, 24.4, 26, 27.5);
  }

  private poseCurtains(t: number) {
    const g = this.gust(t);
    for (const c of this.room.curtains) {
      const geo = c.geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      const base = geo.userData.base as Float32Array;
      const side = c.userData.side as number;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1];
        const v = (y + 0.84) / 1.68; // 0 bottom … 1 rod
        const free = Math.pow(1 - v, 1.4);
        const pleat = 0.032 * Math.sin(x * 44 + side) * (0.55 + 0.45 * v);
        const sway = g * free * (0.1 * Math.sin(t * 2.2 + x * 7 + side) + 0.08);
        pos.setXYZ(i, x - side * g * free * 0.05, y, pleat - sway);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }
  }

  /** leaves: rigid while her hand rides the edge, then fall with a lagging curl */
  private posePages(t: number) {
    const flips = [
      ...HAND_FLIPS.map((t0) => ({ t0, dur: HAND_FLIP_DUR, hand: true })),
      ...BREEZE_FLIPS.map((t0) => ({ t0, dur: BREEZE_FLIP_DUR, hand: false })),
    ];
    this.room.pages.forEach((m, i) => {
      const f = flips[i];
      const u = (t - f.t0) / f.dur;
      m.visible = u > 0 && u < 1;
      if (!m.visible) return;
      const theta = Math.PI * smoother(u);
      let curl: number;
      if (f.hand) curl = u < RELEASE ? 0 : -0.55 * Math.sin((Math.PI * (u - RELEASE)) / (1 - RELEASE));
      else curl = -0.75 * Math.sin(Math.PI * u);
      const geo = m.geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      const cols = 15; // 14 segments → 15 vertices per row
      const W = BOOK.pageW;
      for (let row = 0; row < 2; row++) {
        const z = BOOK.z + (row === 0 ? BOOK.pageD / 2 : -BOOK.pageD / 2);
        let x = BOOK.x, y = BOOK.y + 0.0015 + i * 0.0004;
        for (let c = 0; c < cols; c++) {
          const s = c / (cols - 1);
          if (c > 0) {
            const ang = theta + curl * s;
            x -= Math.cos(ang) * (W / (cols - 1));
            y += Math.sin(ang) * (W / (cols - 1));
          }
          // PlaneGeometry vertex order: rows top→bottom, columns left→right; column 0 = spine side
          pos.setXYZ(row * cols + (cols - 1 - c), x, Math.max(y, BOOK.y + 0.001), z);
        }
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
    });
  }

  private poseSteam(t: number) {
    this.room.steam.forEach((s, i) => {
      const period = 2.6;
      const a = ((t + i * (period / 4)) % period) / period;
      s.position.set(MUG.x + 0.02 * Math.sin(a * 6 + i) + a * 0.02, DESK.top + 0.1 + a * 0.24, MUG.z + 0.01 * Math.cos(a * 5 + i));
      s.scale.setScalar(0.04 + a * 0.1);
      (s.material as THREE.SpriteMaterial).opacity = 0.07 * Math.sin(Math.PI * a);
    });
  }
}
```

### 40/56 · `moonfilm/src/world/outside.ts`
<!-- casebook-file {"path": "moonfilm/src/world/outside.ts", "lines": 521, "final_newline": true, "sha256": "2842f28aa4d4aa25d96dfeb8c98aed2dcf2f70e84629860bc692f2dff8e01ea4", "original_sha256": "2842f28aa4d4aa25d96dfeb8c98aed2dcf2f70e84629860bc692f2dff8e01ea4"} -->
```ts
import * as THREE from "three";
import { type MatLib, lanternMaterial, glowMaterial } from "../look/moonwash";
import { TEX } from "../core/tex";
import { rng } from "../core/rng";
import { MOON_DIR, LANTERN_ROPE, LANTERN_COUNT, CONST, BOOK, WIN, DESK } from "../layout";
import {
  MOTE_EMIT, LANTERN_IGNITE, CONST_LIFT0, CONST_SETTLE0, CONST_STAGGER, CONST_LINES, SCALE_LEVEL, STREAMS, RING,
  SKY_LANTERNS, PETALS_IN, BREEZE_FLIPS,
} from "../timeline";
import { clamp01, smooth, smoother, win, lerp, crPath, easeOut, h1 } from "../core/anim";

/**
 * OUTSIDE — the night: painted far landscape, the osmanthus tree, the string of lanterns, and
 * every light that travels in this film (motes → lanterns → constellation → ring; sky lanterns;
 * petals; the moonbeam). All motion is an analytic function of t.
 */
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const GROUND_Y = -3.5;

export interface OutsideHandles {
  group: THREE.Group;
  update(t: number, cam: THREE.Camera): void;
  lanternLit(t: number): number; // 0..6 (fractional)
  lanternPos: THREE.Vector3[];
}

/* ------------------------------------------------------------------ helpers */
function ropePoint(s: number) {
  const a = V(...LANTERN_ROPE.a), b = V(...LANTERN_ROPE.b);
  const p = a.clone().lerp(b, s);
  p.y -= LANTERN_ROPE.sag * 4 * s * (1 - s);
  return p;
}
function dirFrom(az: number, el: number) {
  return V(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
}
/** constellation plane basis */
const cDir = dirFrom(CONST.az, CONST.el);
const cCenter = cDir.clone().multiplyScalar(CONST.dist);
const cRight = cDir.clone().cross(V(0, 1, 0)).normalize(); // viewer's right when looking out
const cUp = cRight.clone().cross(cDir).normalize();
/** the scale of justice as 14 stars; phi tilts the beam (left pan down when phi > 0) */
function scalePts(phi: number): [number, number][] {
  const pv: [number, number] = [0, 1.0];
  const L: [number, number] = [pv[0] - 1.2 * Math.cos(phi), pv[1] - 1.2 * Math.sin(phi)];
  const R: [number, number] = [pv[0] + 1.2 * Math.cos(phi), pv[1] + 1.2 * Math.sin(phi)];
  const pan = (e: [number, number]): [number, number][] => [[e[0] - 0.42, e[1] - 0.95], [e[0] + 0.42, e[1] - 0.95], [e[0], e[1] - 1.14]];
  return [[0, 1.34], pv, [0, 0.1], [0, -0.95], [-0.5, -1.05], [0.5, -1.05], L, R, ...pan(L), ...pan(R)];
}
const LINES: [number, number][] = [[0, 1], [1, 2], [2, 3], [4, 3], [3, 5], [1, 6], [1, 7], [6, 8], [6, 9], [8, 10], [10, 9], [7, 11], [7, 12], [11, 13], [13, 12]];
function planePoint(p: [number, number]) {
  return cCenter.clone().add(cRight.clone().multiplyScalar(p[0] * CONST.unit)).add(cUp.clone().multiplyScalar(p[1] * CONST.unit));
}
/** ring around the moon */
const mDir = V(...MOON_DIR);
const mCenter = mDir.clone().multiplyScalar(CONST.dist);
const mRight = mDir.clone().cross(V(0, 1, 0)).normalize();
const mUp = mRight.clone().cross(mDir).normalize();
const RING_R = Math.tan(0.142) * CONST.dist;
function ringPoint(i: number, t: number) {
  const a = (i / 14) * Math.PI * 2 + Math.PI / 2 + 0.08 * Math.max(0, t - RING[0]);
  return mCenter.clone().add(mRight.clone().multiplyScalar(Math.cos(a) * RING_R)).add(mUp.clone().multiplyScalar(Math.sin(a) * RING_R));
}

/** billboard strip between two points (screen-facing), width in world units */
function poseLine(m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, width: number, cam: THREE.Camera) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const x = b.clone().sub(a);
  const len = Math.max(1e-4, x.length());
  x.divideScalar(len);
  const toCam = cam.position.clone().sub(mid).normalize();
  const y = toCam.clone().cross(x).normalize();
  const z = x.clone().cross(y).normalize();
  const mat = new THREE.Matrix4().makeBasis(x, y, z);
  mat.scale(V(len, width, 1));
  mat.setPosition(mid);
  m.matrix.copy(mat);
  m.matrixWorldNeedsUpdate = true;
}

function lineMaterial(color: string) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: `varying vec2 vUv; uniform vec3 uColor; uniform float uOpacity;
      void main(){ float a = pow(sin(3.14159 * vUv.y), 2.) * smoothstep(0., .04, vUv.x) * smoothstep(1., .96, vUv.x); gl_FragColor = vec4(uColor * a * uOpacity, 1.); }`,
  });
}

/* ------------------------------------------------------------------ build */
export function buildOutside(M: MatLib): OutsideHandles {
  const group = new THREE.Group();
  group.name = "outside";
  const r = rng(2026);
  const add = (o: THREE.Object3D) => (group.add(o), o);
  const mesh = (g: THREE.BufferGeometry, sem: string, cast = true) => {
    const m = new THREE.Mesh(g, M.get(sem));
    m.castShadow = cast;
    m.receiveShadow = true;
    return m;
  };

  // ---------------------------------------------------------------- ground + painted far landscape
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshBasicMaterial({ color: "#10131f" }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  ground.userData.noOutline = true;
  add(ground);
  const layers: [number, number][] = [[150, 38], [104, 27], [62, 14], [22, 7]];
  layers.forEach(([rad, hgt], i) => {
    const g = new THREE.CylinderGeometry(rad, rad, hgt, 128, 1, true, -1.9, 3.8);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: TEX.skyline(i as 0 | 1 | 2 | 3), alphaTest: 0.5, side: THREE.BackSide, toneMapped: false }));
    m.position.set(0, GROUND_Y + hgt / 2, 0);
    m.userData.noOutline = true;
    add(m);
  });

  // ---------------------------------------------------------------- the osmanthus tree (her left, +x)
  const tree = new THREE.Group();
  const branch = (a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number) => {
    const m = mesh(new THREE.CylinderGeometry(rb, ra, a.distanceTo(b), 10), "trunk");
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
    tree.add(m);
  };
  const T0 = V(3.95, GROUND_Y, 5.4), T1 = V(3.65, 1.0, 5.05), T2 = V(3.35, 2.5, 4.7);
  branch(T0, T1, 0.16, 0.13);
  branch(T1, T2, 0.13, 0.1);
  const tips = [V(2.35, 3.3, 2.6), V(2.25, 3.75, 3.5), V(3.6, 4.2, 5.4), V(2.8, 4.3, 6.1), V(4.3, 3.5, 3.4)];
  tips.forEach((tp) => branch(T2, tp, 0.075, 0.035));
  const blobCenters: [THREE.Vector3, number][] = [];
  tips.forEach((tp, i) => {
    const n = i === 0 ? 5 : 4;
    for (let k = 0; k < n; k++) {
      const c = tp.clone().add(V((r() - 0.5) * 0.9, (r() - 0.3) * 0.6, (r() - 0.5) * 0.9));
      const rad = 0.32 + r() * 0.34;
      blobCenters.push([c, rad]);
      const b = mesh(new THREE.SphereGeometry(rad, 12, 9), "leaf");
      b.scale.set(1.15, 0.8, 1.05);
      b.position.copy(c);
      tree.add(b);
    }
  });
  // golden flower clusters on the blobs, biased toward the window side (−z, −x)
  const nFl = 420;
  const flowers = new THREE.InstancedMesh(new THREE.SphereGeometry(0.02, 6, 4), M.get("flower"), nFl);
  const tmp = new THREE.Object3D();
  for (let i = 0; i < nFl; i++) {
    const [c, rad] = blobCenters[i % blobCenters.length];
    let d = V(r() - 0.5 - 0.35, r() - 0.35, r() - 0.5 - 0.45).normalize();
    tmp.position.copy(c).add(d.multiplyScalar(rad * (0.92 + r() * 0.12)).multiply(V(1.15, 0.8, 1.05)));
    const s = 0.7 + r() * 0.8;
    tmp.scale.set(s, s, s);
    tmp.updateMatrix();
    flowers.setMatrixAt(i, tmp.matrix);
  }
  flowers.castShadow = false;
  tree.add(flowers);
  add(tree);

  // ---------------------------------------------------------------- pole + rope + lanterns
  const poleTop = V(...LANTERN_ROPE.b);
  const pole = mesh(new THREE.CylinderGeometry(0.06, 0.08, poleTop.y - GROUND_Y + 0.15, 10), "pole");
  pole.position.set(poleTop.x - 0.05, (poleTop.y + GROUND_Y) / 2 + 0.07, poleTop.z);
  add(pole);
  const ropePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 24; i++) ropePts.push(ropePoint(i / 24));
  const rope = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ropePts), 48, 0.009, 6), "rope");
  add(rope);
  const lanterns: { pivot: THREE.Group; mat: THREE.MeshLambertMaterial; glow: THREE.Sprite; anchor: THREE.Vector3 }[] = [];
  const lanternPos: THREE.Vector3[] = [];
  for (let k = 0; k < LANTERN_COUNT; k++) {
    const anchor = ropePoint((k + 0.5) / LANTERN_COUNT);
    const pivot = new THREE.Group();
    pivot.position.copy(anchor);
    const mat = lanternMaterial();
    const str = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.11, 4), "rope", false);
    str.position.y = -0.055;
    const capT = mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.045, 16), "lanternCap");
    capT.position.y = -0.13;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), mat);
    body.scale.set(1, 0.84, 1);
    body.position.y = -0.3;
    body.castShadow = true;
    const capB = mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.045, 16), "lanternCap");
    capB.position.y = -0.47;
    const tassel = mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.2, 10), "tassel", false);
    tassel.position.y = -0.6;
    const knot = mesh(new THREE.SphereGeometry(0.022, 8, 6), "lanternCap", false);
    knot.position.y = -0.505;
    const glow = new THREE.Sprite(glowMaterial("#ffb266", 0));
    glow.scale.set(1.5, 1.5, 1);
    glow.position.y = -0.3;
    glow.userData.noOutline = true;
    pivot.add(str, capT, body, capB, tassel, knot, glow);
    add(pivot);
    lanterns.push({ pivot, mat, glow, anchor });
    lanternPos.push(anchor.clone().add(V(0, -0.3, 0)));
  }
  const lanternLight = new THREE.PointLight("#ff9a55", 0, 9, 2);
  lanternLight.position.set(0, 2.5, 3.1);
  lanternLight.visible = false;
  add(lanternLight);

  // ---------------------------------------------------------------- light motes (book → lanterns)
  const moteMat = () => glowMaterial("#ffd08a", 0);
  const coreMat = () => new THREE.SpriteMaterial({ map: TEX.core(), color: new THREE.Color("#fff3d6").multiplyScalar(3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const motes: { core: THREE.Sprite; glow: THREE.Sprite; trail: THREE.Sprite[] }[] = [];
  for (let i = 0; i < MOTE_EMIT.length; i++) {
    const core = new THREE.Sprite(coreMat());
    const glow = new THREE.Sprite(moteMat());
    const trail: THREE.Sprite[] = [];
    for (let k = 0; k < 5; k++) {
      const s = new THREE.Sprite(coreMat());
      s.userData.noOutline = true;
      trail.push(s);
      add(s);
    }
    core.userData.noOutline = glow.userData.noOutline = true;
    add(core);
    add(glow);
    motes.push({ core, glow, trail });
  }
  const motePath = (i: number) => {
    const L = lanternPos[i];
    const off = (i - 2.5) * 0.05;
    return [
      V(BOOK.x + 0.02 + off * 0.3, BOOK.y + 0.03, BOOK.z - 0.02),
      V(0.04 + off, 1.1, -0.4),
      V(off * 2.2, 1.62, -0.06),
      V(L.x * 0.55, lerp(1.95, L.y, 0.6), 1.7),
      V(L.x, L.y + 0.02, L.z - 0.02),
    ];
  };
  const motePaths = MOTE_EMIT.map((_, i) => motePath(i));

  // ---------------------------------------------------------------- constellation (14 stars, 15 lines)
  const stars: { core: THREE.Sprite; glow: THREE.Sprite }[] = [];
  for (let i = 0; i < 14; i++) {
    const core = new THREE.Sprite(coreMat());
    const glow = new THREE.Sprite(glowMaterial("#ffd899", 0));
    core.userData.noOutline = glow.userData.noOutline = true;
    add(core);
    add(glow);
    stars.push({ core, glow });
  }
  const lines: THREE.Mesh[] = LINES.map(() => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lineMaterial("#ffd9a0"));
    m.matrixAutoUpdate = false;
    m.frustumCulled = false;
    m.userData.noOutline = true;
    add(m);
    return m;
  });
  // where each star comes from: stars 0-5 from the six lanterns, 6-13 rise from the far horizon
  const starOrder = [1, 0, 6, 7, 3, 2, 8, 9, 10, 11, 12, 13, 4, 5]; // which point each orb flies to
  const starFrom = (i: number) => {
    if (i < 6) return lanternPos[i].clone();
    const p = planePoint(scalePts(0.19)[starOrder[i]]);
    const d = p.clone().normalize();
    return d.multiplyScalar(CONST.dist * 0.92).setY(GROUND_Y + 4);
  };
  // streams toward the moon
  const streams: THREE.Sprite[] = [];
  for (let i = 0; i < 28; i++) {
    const s = new THREE.Sprite(coreMat());
    s.userData.noOutline = true;
    add(s);
    streams.push(s);
  }

  // ---------------------------------------------------------------- sky lanterns for the end card
  interface SkyL { g: THREE.Group; mat: THREE.MeshLambertMaterial; glow: THREE.Sprite; p0: THREE.Vector3; t0: number; v: number; ph: number; near: boolean }
  const sky: SkyL[] = [];
  const sr = rng(88);
  for (let i = 0; i < 44; i++) {
    const near = i < 18;
    const g = new THREE.Group();
    const mat = lanternMaterial();
    mat.emissiveIntensity = 1.1;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), mat);
    body.scale.set(1, 0.86, 1);
    const capT = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.035, 10), M.get("lanternCap"));
    capT.position.y = 0.145;
    const capB = capT.clone();
    capB.position.y = -0.145;
    const glow = new THREE.Sprite(glowMaterial("#ffb266", 0));
    glow.userData.noOutline = true;
    g.add(body, capT, capB, glow);
    add(g);
    let p0: THREE.Vector3;
    if (near) p0 = V((sr() - 0.5) * 10, -2.2 - sr() * 1.6, 6.5 + sr() * 6.5);
    else {
      const az = (sr() - 0.5) * 1.3;
      const d = 14 + sr() * 50;
      p0 = V(Math.sin(az) * d, -1.5 + sr() * 3, Math.cos(az) * d);
    }
    sky.push({ g, mat, glow, p0, t0: SKY_LANTERNS - 0.35 + sr() * 1.8, v: near ? 1.15 + sr() * 0.5 : 1.4 + sr() * 1.3, ph: sr() * 6.28, near });
  }

  // ---------------------------------------------------------------- osmanthus petals
  const NP = 150;
  const petalMat = new THREE.MeshLambertMaterial({ map: TEX.flower(), alphaTest: 0.35, side: THREE.DoubleSide, emissive: new THREE.Color("#f0a030"), emissiveIntensity: 0.35 });
  const petals = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), petalMat, NP);
  petals.userData.noOutline = true;
  petals.frustumCulled = false;
  petals.castShadow = false;
  add(petals);
  const pr = rng(31);
  const petalSeeds = Array.from({ length: NP }, (_, i) => ({
    a: pr(), b: pr(), c: pr(), d: pr(), e: pr(),
    inbound: i >= 90,
    settled: false,
  }));

  group.traverse((o) => ((o as THREE.Mesh).castShadow = false));

  /* ================================================================ update(t) */
  const lanternLit = (t: number) => LANTERN_IGNITE.reduce((s, ti) => s + clamp01((t - ti) / 0.25), 0);

  function update(t: number, cam: THREE.Camera) {
    // lanterns: sway + ignition
    lanterns.forEach((L, k) => {
      const ti = LANTERN_IGNITE[k];
      const lit = clamp01((t - ti) / 0.22);
      const flash = t > ti ? Math.exp(-(t - ti) * 7) * 1.2 : 0;
      const flick = 1 + 0.045 * Math.sin(t * 13.1 + k * 2.3) + 0.03 * Math.sin(t * 23.7 + k);
      L.mat.emissiveIntensity = 0.05 + lit * (2.35 + flash) * flick;
      (L.glow.material as THREE.SpriteMaterial).opacity = lit * (0.95 + flash * 0.3);
      L.glow.scale.setScalar(1.8 + 0.7 * flash);
      const jolt = t > ti ? 0.09 * Math.exp(-(t - ti) * 2.2) * Math.sin((t - ti) * 9) : 0;
      const gust = 0.05 * win(t, BREEZE_FLIPS[0], BREEZE_FLIPS[0] + 0.5) * (1 - win(t, 8.8, 9.6));
      L.pivot.rotation.z = 0.035 * Math.sin(t * 1.1 + k * 1.7) + jolt + gust * Math.sin(t * 3 + k);
      L.pivot.rotation.x = 0.025 * Math.sin(t * 0.8 + k * 2.9) + jolt * 0.4;
    });
    const nLit = lanternLit(t);
    lanternLight.visible = nLit > 0.01;
    lanternLight.intensity = nLit * 0.55;

    // motes
    motes.forEach((m, i) => {
      const e = MOTE_EMIT[i], f = LANTERN_IGNITE[i];
      const u = (t - e) / (f - e);
      const alive = u > 0 && u < 1.06;
      m.core.visible = m.glow.visible = alive;
      m.trail.forEach((s) => (s.visible = alive));
      if (!alive) return;
      const fadeIn = clamp01(u * 8), fadeOut = 1 - clamp01((u - 1) / 0.06);
      const ease = (x: number) => smoother(x) * 0.65 + x * 0.35;
      const p = crPath(motePaths[i], ease(clamp01(u)));
      const bob = V(0.012 * Math.sin(t * 9 + i), 0.01 * Math.sin(t * 7 + i * 2), 0);
      p.add(bob.multiplyScalar(1 - clamp01(u)));
      const d = cam.position.distanceTo(p);
      const size = Math.max(0.04, d * 0.016);
      m.core.position.copy(p);
      m.core.scale.setScalar(size);
      (m.core.material as THREE.SpriteMaterial).opacity = fadeIn * fadeOut;
      m.glow.position.copy(p);
      m.glow.scale.setScalar(Math.min(size * 6, d * 0.07));
      (m.glow.material as THREE.SpriteMaterial).opacity = 0.85 * fadeIn * fadeOut;
      m.trail.forEach((s, k) => {
        const uu = clamp01(u - (k + 1) * 0.018);
        s.position.copy(crPath(motePaths[i], ease(uu)));
        s.scale.setScalar(size * (0.8 - k * 0.13));
        (s.material as THREE.SpriteMaterial).opacity = fadeIn * fadeOut * (0.5 - k * 0.09);
      });
    });

    // constellation: lift → settle → lines → level → (streams) → ring
    const phi = 0.19 * (1 - smoother((t - SCALE_LEVEL[0]) / (SCALE_LEVEL[1] - SCALE_LEVEL[0]))) + (t > SCALE_LEVEL[1] ? -0.018 * Math.exp(-(t - SCALE_LEVEL[1]) * 3) * Math.sin((t - SCALE_LEVEL[1]) * 10) : 0);
    const pts = scalePts(phi).map(planePoint);
    const starPos: THREE.Vector3[] = [];
    stars.forEach((s, i) => {
      const lift = CONST_LIFT0 + i * CONST_STAGGER, settle = CONST_SETTLE0 + i * CONST_STAGGER;
      const target = pts[starOrder[i]];
      let p: THREE.Vector3;
      let vis = 0;
      if (t < lift) {
        s.core.visible = s.glow.visible = false;
        starPos.push(target);
        return;
      }
      if (t < settle) {
        const u = smoother((t - lift) / (settle - lift));
        const a = starFrom(i);
        const mid = a.clone().lerp(target, 0.5);
        mid.y += 10 + i * 0.4;
        const q = new THREE.QuadraticBezierCurve3(a, mid, target);
        p = q.getPoint(u);
        vis = clamp01((t - lift) / 0.15);
      } else {
        p = target.clone();
        vis = 1;
      }
      // gather into the ring around the moon
      const r0 = RING[0] + (i % 7) * 0.12, r1 = r0 + 1.25;
      if (t > r0) {
        const u = smoother((t - r0) / (r1 - r0));
        const rp = ringPoint(i, t);
        const mid = p.clone().lerp(rp, 0.5).add(mUp.clone().multiplyScalar(6));
        p = new THREE.QuadraticBezierCurve3(p, mid, rp).getPoint(u);
      }
      starPos.push(p);
      const d = cam.position.distanceTo(p);
      const settleFlash = t > settle ? 1 + 1.6 * Math.exp(-(t - settle) * 5) : 1;
      const tw = 1 + 0.12 * Math.sin(t * 5.3 + i * 1.7);
      s.core.visible = s.glow.visible = true;
      s.core.position.copy(p);
      s.glow.position.copy(p);
      const levelFlash = 1 + 0.8 * Math.exp(-Math.pow((t - SCALE_LEVEL[1]) / 0.25, 2));
      s.core.scale.setScalar(Math.max(0.03, d * 0.0068) * settleFlash * levelFlash);
      s.glow.scale.setScalar(Math.max(0.12, d * 0.035) * settleFlash * tw);
      (s.core.material as THREE.SpriteMaterial).opacity = vis;
      (s.glow.material as THREE.SpriteMaterial).opacity = vis * 0.7 * levelFlash;
    });
    lines.forEach((m, l) => {
      const [a, b] = LINES[l];
      const s0 = CONST_LINES[0] + l * ((CONST_LINES[1] - CONST_LINES[0] - 0.45) / (LINES.length - 1));
      const grow = smooth((t - s0) / 0.45);
      const fade = 1 - smooth((t - RING[0]) / 0.45);
      const op = grow * fade;
      m.visible = op > 0.002;
      if (!m.visible) return;
      const A = pts[a], B = pts[b];
      const Bp = A.clone().lerp(B, grow);
      const d = cam.position.distanceTo(A);
      poseLine(m, A, Bp, d * 0.0042, cam);
      const glowBoost = 1 + 0.9 * Math.exp(-Math.pow((t - SCALE_LEVEL[1]) / 0.3, 2));
      (m.material as THREE.ShaderMaterial).uniforms.uOpacity.value = op * 0.85 * glowBoost;
    });
    // streams: from the stars to the moon
    streams.forEach((s, k) => {
      const i = k % 14;
      const t0 = STREAMS[0] + (k / 28) * (STREAMS[1] - STREAMS[0] - 0.7);
      const u = (t - t0) / 0.7;
      s.visible = u > 0 && u < 1;
      if (!s.visible) return;
      const a = pts[starOrder[i]];
      const b = mCenter.clone().add(mRight.clone().multiplyScalar((h1(k) - 0.5) * 3)).add(mUp.clone().multiplyScalar((h1(k + 9) - 0.5) * 3));
      const mid = a.clone().lerp(b, 0.5).add(mUp.clone().multiplyScalar(5 + h1(k + 3) * 4));
      const p = new THREE.QuadraticBezierCurve3(a, mid, b).getPoint(smooth(u));
      s.position.copy(p);
      s.scale.setScalar(cam.position.distanceTo(p) * 0.009);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(Math.PI * u) * 0.9;
    });

    // sky lanterns
    sky.forEach((L, i) => {
      const age = t - L.t0;
      L.g.visible = age > 0;
      if (!L.g.visible) return;
      const p = L.p0.clone();
      p.y += L.v * age + 0.15 * age * age;
      p.x += 0.25 * Math.sin(age * 0.9 + L.ph) + 0.1 * age;
      p.z += 0.2 * Math.sin(age * 0.7 + L.ph * 2);
      L.g.position.copy(p);
      L.g.rotation.z = 0.08 * Math.sin(age * 1.3 + L.ph);
      const fade = L.near ? 1 : clamp01(age / 0.6);
      L.mat.emissiveIntensity = 1.05 * fade * (1 + 0.06 * Math.sin(t * 11 + i));
      const d = cam.position.distanceTo(p);
      L.g.scale.setScalar(L.near ? 1.25 : Math.max(1, d * 0.012));
      L.glow.scale.setScalar(1.5);
      (L.glow.material as THREE.SpriteMaterial).opacity = 0.9 * fade;
    });

    // petals
    const tmpO = new THREE.Object3D();
    petalSeeds.forEach((s, i) => {
      s.settled = false;
      let p: THREE.Vector3;
      let scale = 0.028 + s.e * 0.012;
      if (!s.inbound) {
        const life = 6 + s.a * 4;
        const age = (t + s.b * life) % life;
        const spawn = V(1.4 + s.c * 3.0, 2.3 + s.d * 2.0, 1.6 + s.e * 4.4);
        p = spawn.add(V(-0.42 * age, -0.3 * age, -0.05 * age));
        p.x += 0.12 * Math.sin(age * 2.1 + s.a * 9);
        p.y += 0.05 * Math.sin(age * 3.3 + s.b * 7);
        const edge = Math.min(clamp01(age / 0.5), clamp01((life - age) / 0.5));
        scale *= edge;
      } else {
        const t0 = PETALS_IN + s.a * 7.5;
        const age = t - t0;
        if (age < 0) {
          scale = 0;
          p = V(0, -50, 0);
        } else {
          const spawn = V((s.b - 0.5) * 1.5, 1.55 + s.c * 0.75, 0.9 + s.d * 0.9);
          const wind = V(0.05 * (s.e - 0.5), -0.13, -0.85);
          p = spawn.add(wind.multiplyScalar(age));
          p.x += 0.08 * Math.sin(age * 2.4 + s.e * 9);
          p.y += 0.04 * Math.sin(age * 3.1 + s.a * 5);
          // settle on the desk / floor
          const onDesk = p.x > DESK.x0 && p.x < DESK.x1 && p.z < DESK.zFar && p.z > DESK.zNear;
          const floorY = onDesk ? DESK.top + 0.004 : 0.004;
          if (p.y < floorY) {
            p.y = floorY;
            s.settled = true;
          } else s.settled = false;
          scale *= clamp01(age / 0.4);
        }
      }
      tmpO.position.copy(p);
      const spin = t * (1.5 + s.a * 2) + s.b * 6.28;
      if (s.inbound && s.settled) tmpO.rotation.set(-Math.PI / 2, 0, s.d * 6.28);
      else tmpO.rotation.set(spin, spin * 0.7 + s.c * 3, s.d * 3);
      tmpO.scale.setScalar(scale);
      tmpO.updateMatrix();
      petals.setMatrixAt(i, tmpO.matrix);
    });
    petals.instanceMatrix.needsUpdate = true;

  }

  return { group, update, lanternLit, lanternPos };
}
```

### 41/56 · `moonfilm/src/world/room.ts`
<!-- casebook-file {"path": "moonfilm/src/world/room.ts", "lines": 355, "final_newline": true, "sha256": "2390ae9c5516cadab5d9b2e2dac1dda624aa878065228aeb18a6347ac6dde522", "original_sha256": "2390ae9c5516cadab5d9b2e2dac1dda624aa878065228aeb18a6347ac6dde522"} -->
```ts
import * as THREE from "three";
import type { MatLib } from "../look/moonwash";
import { TEX } from "../core/tex";
import { rng, hash } from "../core/rng";
import { ROOM, WIN, DESK, CHAIR, BOOK, LAMP, STACK, MUG, PLATE } from "../layout";

/**
 * THE ROOM — her study corner. World code says WHAT things are ("wood", "paper", "cover:#…");
 * the look decides how they are painted. Colliders are recorded as named AABBs for QC.
 */
export interface Collider {
  name: string;
  box: THREE.Box3;
}

export interface RoomHandles {
  group: THREE.Group;
  colliders: Collider[];
  curtains: THREE.Mesh[];
  pages: THREE.Mesh[]; // flipping leaves (posed each frame)
  pageRest: { right: THREE.Mesh; left: THREE.Mesh };
  steam: THREE.Sprite[];
  lampBulb: THREE.Vector3;
  lampAim: THREE.Vector3;
}

let M: MatLib;
function mesh(g: THREE.BufferGeometry, sem: string | THREE.Material | THREE.Material[], o: { cast?: boolean; receive?: boolean } = {}) {
  const m = new THREE.Mesh(g, typeof sem === "string" ? M.get(sem) : sem);
  m.castShadow = o.cast ?? true;
  m.receiveShadow = o.receive ?? true;
  return m;
}
function box(w: number, h: number, d: number, sem: string | THREE.Material | THREE.Material[], x: number, y: number, z: number, o: { cast?: boolean; receive?: boolean } = {}) {
  const m = mesh(new THREE.BoxGeometry(w, h, d), sem, o);
  m.position.set(x, y, z);
  return m;
}

/** handwritten page: faint rules, ink lines, one highlighted phrase, a tiny moon doodle */
function pageTexture(seed: string, doodle: boolean) {
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 360;
  const g = cv.getContext("2d")!;
  const r = rng(hash(seed));
  g.fillStyle = "#f4ecdc";
  g.fillRect(0, 0, 256, 360);
  g.strokeStyle = "rgba(120,140,170,0.35)";
  g.lineWidth = 1;
  for (let y = 40; y < 350; y += 20) {
    g.beginPath();
    g.moveTo(14, y);
    g.lineTo(242, y);
    g.stroke();
  }
  g.strokeStyle = "rgba(40,50,90,0.75)";
  g.lineWidth = 1.6;
  for (let y = 36; y < 340; y += 20) {
    let x = 20 + r() * 8;
    const end = 150 + r() * 90;
    while (x < end) {
      const w = 5 + r() * 7;
      g.beginPath();
      g.moveTo(x, y - 2 - r() * 5);
      g.lineTo(x + w * 0.5, y - r() * 3);
      g.lineTo(x + w, y - 3 - r() * 4);
      g.stroke();
      x += w + 2 + r() * 3;
    }
    if (r() < 0.14) {
      g.fillStyle = "rgba(250,210,80,0.45)";
      g.fillRect(24 + r() * 60, y - 12, 50 + r() * 60, 12);
    }
  }
  if (doodle) {
    g.strokeStyle = "rgba(200,120,40,0.9)";
    g.lineWidth = 2.2;
    g.beginPath();
    g.arc(214, 316, 14, Math.PI * 0.35, Math.PI * 1.65);
    g.arc(206, 316, 11, Math.PI * 1.55, Math.PI * 0.45, true);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function buildRoom(lib: MatLib): RoomHandles {
  M = lib;
  const group = new THREE.Group();
  group.name = "room";
  const colliders: Collider[] = [];
  const addC = (name: string, o: THREE.Object3D) => {
    o.updateMatrixWorld(true);
    colliders.push({ name, box: new THREE.Box3().setFromObject(o) });
  };
  const { x0, x1, zBack, h, wallT } = ROOM;
  const W = x1 - x0;
  // ---------------------------------------------------------------- shell
  const floor = box(W, 0.04, -zBack + 0.3, "floor", 0, -0.02, zBack / 2 + 0.05);
  const ceil = box(W, 0.04, -zBack + 0.3, "ceiling", 0, h + 0.02, zBack / 2 + 0.05, { cast: false });
  const back = box(W, h, 0.1, "wall", 0, h / 2, zBack - 0.05);
  const left = box(0.1, h, -zBack, "wall", x1 + 0.05, h / 2, zBack / 2);
  const right = box(0.1, h, -zBack, "wall", x0 - 0.05, h / 2, zBack / 2);
  group.add(floor, ceil, back, left, right);
  addC("wall.left", left);
  addC("wall.right", right);
  addC("floor", floor);
  addC("ceiling", ceil);
  // front wall around the window opening (z = 0 plane, thickness wallT)
  const fw = [
    box(x1 - WIN.x1, h, wallT, "wall", (x1 + WIN.x1) / 2, h / 2, 0),
    box(WIN.x0 - x0, h, wallT, "wall", (x0 + WIN.x0) / 2, h / 2, 0),
    box(WIN.x1 - WIN.x0, h - WIN.y1, wallT, "wall", 0, (h + WIN.y1) / 2, 0),
    box(WIN.x1 - WIN.x0, WIN.y0, wallT, "wall", 0, WIN.y0 / 2, 0),
  ];
  fw.forEach((m, i) => {
    group.add(m);
    addC(`wall.front${i}`, m);
  });
  // soft round rug under the chair (a quiet circle in the room)
  const rug = mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.012, 48), "cover:#6f5a7e", { cast: false });
  rug.position.set(0, 0.006, -1.05);
  group.add(rug);
  // ---------------------------------------------------------------- window: casing, sill, open sashes, curtains
  const cas = 0.07;
  const casing = [
    box(cas, WIN.y1 - WIN.y0 + cas * 2, 0.05, "frame", WIN.x1 + cas / 2, (WIN.y0 + WIN.y1) / 2, WIN.zIn - 0.02),
    box(cas, WIN.y1 - WIN.y0 + cas * 2, 0.05, "frame", WIN.x0 - cas / 2, (WIN.y0 + WIN.y1) / 2, WIN.zIn - 0.02),
    box(WIN.x1 - WIN.x0 + cas * 2, cas, 0.05, "frame", 0, WIN.y1 + cas / 2, WIN.zIn - 0.02),
  ];
  casing.forEach((m, i) => {
    group.add(m);
    addC(`casing${i}`, m);
  });
  const sill = box(WIN.x1 - WIN.x0 + 0.2, 0.045, 0.3, "frame", 0, WIN.y0 - 0.0225, -0.02);
  group.add(sill);
  addC("sill", sill);
  // a small plant on the sill, right corner
  const pot = mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 14), "plantPot");
  pot.position.set(-0.7, WIN.y0 + 0.04, -0.05);
  const leaves = mesh(new THREE.SphereGeometry(0.075, 12, 8), "plant");
  leaves.scale.set(1, 0.8, 1);
  leaves.position.set(-0.7, WIN.y0 + 0.13, -0.05);
  group.add(pot, leaves);
  // open casement sashes (swung outward to the sides), each with a cross bar
  for (const s of [-1, 1]) {
    const sash = new THREE.Group();
    const sw = (WIN.x1 - WIN.x0) / 2, sh = WIN.y1 - WIN.y0, bar = 0.045;
    const bars = [
      box(bar, sh, bar, "frame", -s * bar / 2, sh / 2, 0),
      box(bar, sh, bar, "frame", -s * (sw - bar / 2), sh / 2, 0),
      box(sw, bar, bar, "frame", -s * sw / 2, bar / 2, 0),
      box(sw, bar, bar, "frame", -s * sw / 2, sh - bar / 2, 0),
      box(sw, bar * 0.7, bar * 0.7, "frame", -s * sw / 2, sh * 0.55, 0),
      box(bar * 0.7, sh, bar * 0.7, "frame", -s * sw / 2, sh / 2, 0),
    ];
    bars.forEach((b) => sash.add(b));
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ color: "#c8d8ff", transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide }));
    glass.position.set(-s * sw / 2, sh / 2, 0);
    glass.userData.noOutline = true;
    sash.add(glass);
    sash.position.set(s > 0 ? WIN.x1 : WIN.x0, WIN.y0, WIN.zOut + 0.02);
    sash.rotation.y = s * 1.25; // opened ~72° outward (free edge swings toward +z)
    group.add(sash);
  }
  // curtains: gathered sheer panels either side, posed per frame (breeze)
  const curtains: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const g = new THREE.PlaneGeometry(0.46, 1.68, 18, 12);
    g.userData.base = (g.getAttribute("position") as THREE.BufferAttribute).array.slice();
    const c = mesh(g, "curtain", { cast: false, receive: true });
    c.position.set(s * (WIN.x1 + 0.2), 1.66, -0.2);
    c.userData.side = s;
    c.userData.noOutline = true;
    curtains.push(c);
    group.add(c);
  }
  const rod = mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.3, 8), "woodDark");
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, 2.51, -0.2);
  group.add(rod);
  // sticky notes on the wall right of the window (her right, −x)
  const notes = [["#f4d468", -1.02, 1.62, 0.05], ["#f2a6a0", -1.1, 1.5, -0.08], ["#a8d8c0", -0.99, 1.43, 0.12]] as const;
  for (const [c, x, y, rot] of notes) {
    const n = box(0.075, 0.075, 0.004, `cover:${c}`, x, y, WIN.zIn - 0.002, { cast: false });
    n.rotation.z = rot;
    group.add(n);
  }
  // ---------------------------------------------------------------- desk + chair
  const top = box(DESK.x1 - DESK.x0, DESK.t, DESK.zFar - DESK.zNear, "wood", 0, DESK.top - DESK.t / 2, (DESK.zFar + DESK.zNear) / 2);
  group.add(top);
  addC("desk.top", top);
  for (const [lx, lz] of [[DESK.x0 + 0.04, DESK.zNear + 0.04], [DESK.x1 - 0.04, DESK.zNear + 0.04], [DESK.x0 + 0.04, DESK.zFar - 0.04], [DESK.x1 - 0.04, DESK.zFar - 0.04]]) {
    group.add(box(0.045, DESK.top - DESK.t, 0.045, "woodDark", lx, (DESK.top - DESK.t) / 2, lz));
  }
  const drawer = box(0.42, 0.12, 0.5, "wood", -0.46, DESK.top - DESK.t - 0.06, (DESK.zFar + DESK.zNear) / 2);
  group.add(drawer);
  const seat = box(0.44, 0.04, 0.42, "woodLight", CHAIR.x, CHAIR.seat - 0.02, CHAIR.z);
  group.add(seat);
  addC("chair.seat", seat);
  for (const [lx, lz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) {
    group.add(box(0.035, CHAIR.seat - 0.04, 0.035, "woodDark", CHAIR.x + lx, (CHAIR.seat - 0.04) / 2, CHAIR.z + lz));
  }
  for (const lx of [-0.19, 0.19]) group.add(box(0.03, 0.36, 0.03, "woodDark", CHAIR.x + lx, CHAIR.seat + 0.18, CHAIR.z - 0.2));
  const rail = box(0.44, 0.07, 0.03, "woodLight", CHAIR.x, CHAIR.seat + 0.31, CHAIR.z - 0.205);
  group.add(rail);
  addC("chair.back", rail);
  // ---------------------------------------------------------------- lamp (her left, +x)
  const lampY = DESK.top;
  const base = mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.022, 24), "lampMetal");
  base.position.set(LAMP.x, lampY + 0.011, LAMP.z);
  const stemA = new THREE.Vector3(LAMP.x, lampY + 0.02, LAMP.z);
  const elbow = new THREE.Vector3(LAMP.x - 0.02, lampY + 0.36, LAMP.z + 0.02);
  const head = new THREE.Vector3(LAMP.x - 0.15, lampY + 0.4, LAMP.z - 0.06);
  const rodMesh = (a: THREE.Vector3, b: THREE.Vector3) => {
    const m = mesh(new THREE.CylinderGeometry(0.009, 0.009, a.distanceTo(b), 8), "lampMetal");
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m;
  };
  group.add(base, rodMesh(stemA, elbow), rodMesh(elbow, head));
  const aim = new THREE.Vector3(BOOK.x + 0.02, BOOK.y, BOOK.z);
  const shadeDir = aim.clone().sub(head).normalize();
  const shadeOut = mesh(new THREE.CylinderGeometry(0.048, 0.105, 0.13, 28, 1, true), "lampMetal");
  const shadeIn = mesh(new THREE.CylinderGeometry(0.047, 0.104, 0.129, 28, 1, true), "lampShadeIn", { cast: false, receive: false });
  const bulbPos = head.clone().add(shadeDir.clone().multiplyScalar(0.05));
  for (const s of [shadeOut, shadeIn]) {
    s.position.copy(head).add(shadeDir.clone().multiplyScalar(0.065));
    s.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), shadeDir);
    group.add(s);
  }
  const bulb = mesh(new THREE.SphereGeometry(0.026, 12, 8), "bulb", { cast: false, receive: false });
  bulb.position.copy(bulbPos);
  group.add(bulb);
  addC("lamp.shade", shadeOut);
  // ---------------------------------------------------------------- the open book
  const cover = box(0.36, 0.008, BOOK.pageD + 0.02, "cover:#2f5d62", BOOK.x, DESK.top + 0.004, BOOK.z);
  group.add(cover);
  const edge = M.get("pageEdge");
  const pmR = new THREE.MeshLambertMaterial({ map: pageTexture("pageR", false) });
  const pmL = new THREE.MeshLambertMaterial({ map: pageTexture("pageL", true) });
  const blockH = BOOK.y - (DESK.top + 0.008);
  const rightB = box(BOOK.pageW, blockH, BOOK.pageD, [edge, edge, pmR, edge, edge, edge], BOOK.x - BOOK.pageW / 2 - 0.003, DESK.top + 0.008 + blockH / 2, BOOK.z);
  const leftB = box(BOOK.pageW, blockH, BOOK.pageD, [edge, edge, pmL, edge, edge, edge], BOOK.x + BOOK.pageW / 2 + 0.003, DESK.top + 0.008 + blockH / 2, BOOK.z);
  group.add(rightB, leftB);
  addC("book", rightB);
  addC("book", leftB);
  // flipping leaves: bendable strips (posed per frame)
  const pages: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const g = new THREE.PlaneGeometry(BOOK.pageW, BOOK.pageD, 14, 1);
    const tex = pageTexture(`leaf${i}`, i === 1);
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide }));
    m.castShadow = true;
    m.receiveShadow = true;
    m.visible = false;
    pages.push(m);
    group.add(m);
  }
  // ---------------------------------------------------------------- the stack: law on top of sociology
  const titles: [string, string, string][] = [
    ["社会学概论", "#6d3b3b", "#f1dcb4"],
    ["法理学", "#34506b", "#f3e6c9"],
    ["宪法学", "#3f6b5a", "#f3e6c9"],
    ["民法学", "#8a6a3a", "#fbf0d6"],
    ["刑法学", "#5a4a6b", "#f3e6c9"],
    ["诉讼法", "#2f3f4f", "#e8cf98"],
  ];
  let y = DESK.top;
  const r = rng(77);
  titles.forEach(([t, bg, fg], i) => {
    const hgt = 0.036 + r() * 0.016;
    const w = 0.25 + r() * 0.03, d = 0.18 + r() * 0.02;
    const coverM = M.get(`cover:${bg}`);
    const spineM = new THREE.MeshLambertMaterial({ map: TEX.spine(t, bg, fg) });
    const b = box(w, hgt, d, [edge, edge, coverM, coverM, edge, spineM], STACK.x + (r() - 0.5) * 0.02, y + hgt / 2, STACK.z + (r() - 0.5) * 0.02);
    b.rotation.y = (r() - 0.5) * 0.16 + (i === 0 ? 0 : 0.02);
    group.add(b);
    addC("stack", b);
    y += hgt;
  });
  // ---------------------------------------------------------------- tea + mooncake
  const mug = mesh(new THREE.CylinderGeometry(0.042, 0.039, 0.095, 24), "mug");
  mug.position.set(MUG.x, DESK.top + 0.0475, MUG.z);
  const band = mesh(new THREE.CylinderGeometry(0.0425, 0.0425, 0.014, 24, 1, true), "mugBand", { cast: false });
  band.position.set(MUG.x, DESK.top + 0.07, MUG.z);
  const tea = mesh(new THREE.CylinderGeometry(0.037, 0.037, 0.003, 20), "tea", { cast: false });
  tea.position.set(MUG.x, DESK.top + 0.083, MUG.z);
  const handle = mesh(new THREE.TorusGeometry(0.024, 0.0075, 8, 14, Math.PI), "mug");
  handle.rotation.set(0, Math.PI / 2 + 0.6, -Math.PI / 2);
  handle.position.set(MUG.x - 0.036, DESK.top + 0.05, MUG.z - 0.026);
  group.add(mug, band, tea, handle);
  addC("mug", mug);
  const plate = mesh(new THREE.CylinderGeometry(0.078, 0.07, 0.012, 32), "plate");
  plate.position.set(PLATE.x, DESK.top + 0.006, PLATE.z);
  const cake = mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.03, 32), [M.get("cakeSide"), M.get("mooncakeTop"), M.get("cakeSide")]);
  cake.position.set(PLATE.x, DESK.top + 0.012 + 0.015, PLATE.z);
  group.add(plate, cake);
  addC("plate", plate);
  // steam wisps (sprites, looped deterministically)
  const steam: THREE.Sprite[] = [];
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow(), color: "#dfe6f5", transparent: true, opacity: 0, depthWrite: false }));
    s.userData.noOutline = true;
    steam.push(s);
    group.add(s);
  }
  // ---------------------------------------------------------------- dressing: shelf (−x wall), cork board (+x wall), floor plant
  const shelf = box(0.3, 1.7, 1.1, "shelf", x0 + 0.16, 0.85, -1.9);
  group.add(shelf);
  const sr = rng(5);
  for (let row = 0; row < 4; row++) {
    let z = -2.4;
    while (z < -1.42) {
      const bw = 0.03 + sr() * 0.03, bh = 0.2 + sr() * 0.1;
      const cols = ["#7c3b3b", "#34506b", "#3f6b5a", "#8a6a3a", "#5a4a6b", "#c8b48a", "#2f3f4f"];
      group.add(box(0.2, bh, bw, `cover:${cols[Math.floor(sr() * cols.length)]}`, x0 + 0.24, 0.2 + row * 0.4 + bh / 2, z + bw / 2, { cast: false }));
      z += bw + 0.004;
    }
  }
  const cork = box(0.03, 0.62, 0.9, "cover:#b58e62", x1 - 0.015, 1.55, -1.55, { cast: false });
  group.add(cork);
  const cr = rng(9);
  for (let k = 0; k < 7; k++) {
    const cols = ["#f4d468", "#f2a6a0", "#a8d8c0", "#f7efe0", "#9fc0e6"];
    const n = box(0.004, 0.09 + cr() * 0.05, 0.1 + cr() * 0.05, `cover:${cols[k % cols.length]}`, x1 - 0.034, 1.35 + cr() * 0.4, -1.9 + cr() * 0.7, { cast: false });
    n.rotation.x = (cr() - 0.5) * 0.3;
    group.add(n);
  }
  // a round paper lamp on a small shelf behind her (+x back corner): warm light from the room
  const shelf2 = box(0.34, 0.03, 0.26, "woodDark", x1 - 0.2, 1.12, -2.35);
  group.add(shelf2);
  const paperLamp = mesh(new THREE.SphereGeometry(0.11, 20, 14), "paperLamp", { cast: false, receive: false });
  paperLamp.scale.set(1, 0.92, 1);
  paperLamp.position.set(x1 - 0.2, 1.24, -2.35);
  group.add(paperLamp);
  const plg = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow(), color: new THREE.Color("#ffb46a"), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  plg.scale.setScalar(0.9);
  plg.position.copy(paperLamp.position);
  plg.userData.noOutline = true;
  group.add(plg);
  return {
    group,
    colliders,
    curtains,
    pages,
    pageRest: { right: rightB, left: leftB },
    steam,
    lampBulb: bulbPos,
    lampAim: aim,
  };
}
```

### 42/56 · `moonfilm/src/world/sky.ts`
<!-- casebook-file {"path": "moonfilm/src/world/sky.ts", "lines": 109, "final_newline": true, "sha256": "474d104cab1b6ac2c7f0a55aa5522535d1baf68822c8e070d24d157a7a80e85e", "original_sha256": "474d104cab1b6ac2c7f0a55aa5522535d1baf68822c8e070d24d157a7a80e85e"} -->
```ts
import * as THREE from "three";
import { MOON_DIR, MOON_ANG_R } from "../layout";

/**
 * SKY DOME — painted, not modeled: gradient, drifting cloud washes, gouache-dot stars, and the
 * moon itself (disc + maria + corona) evaluated per view direction, so the moon is a perfect
 * circle at infinity whatever the camera does. Output is linear HDR (the look tone-maps it).
 * The dome is hidden from the normal/depth pass (noOutline) so the post sees it as "sky".
 */
export interface SkyUniforms {
  uMoonBright: { value: number };
  uVeil: { value: number };
  uClear: { value: number };
  uTime: { value: number };
}

export function makeSky() {
  const uniforms = {
    uMoonDir: { value: new THREE.Vector3(...MOON_DIR) },
    uMoonR: { value: MOON_ANG_R },
    uMoonBright: { value: 0.55 },
    uVeil: { value: 1 },
    uClear: { value: 0 },
    uTime: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.);
        vDir = wp.xyz - cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vDir;
      uniform vec3 uMoonDir; uniform float uMoonR, uMoonBright, uVeil, uClear, uTime;
      float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1));
        return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
      float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03 + 17.1; a *= .5; } return s; }
      void main(){
        vec3 d = normalize(vDir);
        float el = d.y;
        // --- base wash: zenith indigo → mid prussian → violet horizon with a faint warm breath
        vec3 zen = vec3(.010, .017, .052);
        vec3 mid = vec3(.026, .040, .105);
        vec3 hor = vec3(.070, .068, .140);
        vec3 col = mix(hor, mid, smoothstep(-.03, .2, el));
        col = mix(col, zen, smoothstep(.2, .78, el));
        col += vec3(.07, .035, .012) * exp(-max(el + .02, 0.) * 16.) * .7;
        // --- moon geometry
        float ca = clamp(dot(d, uMoonDir), -1., 1.);
        float ang = acos(ca);
        float corona = exp(-pow(ang / (uMoonR * 2.4), 2.));
        float wide = exp(-ang / .34);
        col += vec3(.95, .86, .66) * corona * .17 * uMoonBright;
        col += vec3(.20, .21, .30) * wide * .3 * (.4 + .65 * uMoonBright);
        // --- clouds on a virtual ceiling, drifting
        vec2 cp = d.xz / (max(el, 0.) + .14);
        cp = cp * .5 + vec2(uTime * .02, uTime * .005);
        float n1 = fbm(cp * 1.35);
        float n2 = fbm(cp * 3.2 + 5.2);
        float thr = mix(.55, .66, uClear);
        float cl = smoothstep(thr, thr + .24, n1 * .78 + n2 * .34);
        cl *= smoothstep(-.03, .1, el) * (1. - .45 * smoothstep(.62, .95, el));
        vec3 cloudCol = mix(vec3(.045, .055, .11), vec3(.13, .13, .21), n2);
        cloudCol += vec3(.62, .55, .42) * corona * .6 * uMoonBright + vec3(.10, .10, .15) * wide * uMoonBright;
        // --- stars: sparse gouache dots, hidden by moonglow and clouds
        vec2 sp = vec2(atan(d.x, d.z), asin(clamp(d.y, -1., 1.))) * 110.;
        vec2 cell = floor(sp);
        float h = hash12(cell);
        vec2 f = fract(sp) - .5 - (vec2(hash12(cell + 7.), hash12(cell + 13.)) - .5) * .55;
        float star = step(.962, h) * smoothstep(.17, .03, length(f));
        float tw = .6 + .4 * sin(uTime * (1.3 + h * 2.7) + h * 40.);
        float starVis = (1. - smoothstep(0., .45, corona * 1.6)) * smoothstep(.04, .22, el) * (1. - cl);
        col += vec3(.95, .93, 1.) * star * tw * (.55 + 1.2 * fract(h * 17.)) * starVis;
        col = mix(col, cloudCol, cl * .88);
        // --- the moon: paper-white disc, soft maria, limb falloff; HDR so it blooms
        float disc = smoothstep(uMoonR, uMoonR * .962, ang);
        vec3 right = normalize(cross(vec3(0., 1., 0.), uMoonDir));
        vec3 u2 = cross(uMoonDir, right);
        vec2 mc = vec2(dot(d, right), dot(d, u2)) / uMoonR;
        float maria = smoothstep(.46, .72, fbm(mc * 2.1 + 3.)) * .2 + smoothstep(.56, .82, fbm(mc * 4.6 + 1.)) * .08;
        float limb = sqrt(max(0., 1. - dot(mc, mc)));
        vec3 moon = vec3(1., .962, .86) * (1. - maria) * (.84 + .16 * limb);
        moon *= 1.3 + .75 * uMoonBright;
        col = mix(col, moon, disc);
        // --- a thin veil of cloud drawn across the moon at the start (clears later)
        float band = exp(-pow(ang / .17, 2.));
        float vn = smoothstep(.36, .74, fbm(vec2(atan(d.x, d.z) * 8. + uTime * .06, d.y * 15. - uTime * .02)));
        float veil = band * vn * uVeil;
        vec3 veilCol = vec3(.12, .12, .19) + vec3(.55, .5, .4) * corona * (.4 + .6 * uMoonBright);
        col = mix(col, veilCol, veil * .78);
        gl_FragColor = vec4(col, 1.);
      }`,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), mat);
  dome.frustumCulled = false;
  dome.renderOrder = -10;
  dome.userData.noOutline = true;
  return { dome, uniforms: uniforms as unknown as SkyUniforms };
}
```

### 43/56 · `moonfilm/subtitles/subtitles.zh-CN.srt`
<!-- casebook-file {"path": "moonfilm/subtitles/subtitles.zh-CN.srt", "lines": 44, "final_newline": true, "sha256": "ce5f4acda6ac3851202de9a760a55882a121df25f97c2a3d49d64f4f19e5ccdc", "original_sha256": "ce5f4acda6ac3851202de9a760a55882a121df25f97c2a3d49d64f4f19e5ccdc"} -->
```srt
1
00:00:00,280 --> 00:00:02,840
今晚月亮很圆，你的台灯也还亮着。

2
00:00:03,120 --> 00:00:05,800
这几个月会很难，但你一直在认真走。

3
00:00:06,100 --> 00:00:08,840
不急——一页一页，一晚一晚。

4
00:00:09,120 --> 00:00:11,820
每个认真的夜晚，都算数。

5
00:00:12,120 --> 00:00:14,820
你想让世界更公平、更温柔一点，

6
00:00:15,120 --> 00:00:17,820
这份心，本身就是力量。

7
00:00:18,120 --> 00:00:20,820
你照亮过很多人，今晚换月亮照亮你。

8
00:00:21,120 --> 00:00:23,500
你在争取的未来，你配得上。

9
00:00:24,020 --> 00:00:25,500
学姐，中秋快乐！

10
00:00:25,500 --> 00:00:26,050
学姐，中秋快乐！【加油】

11
00:00:26,050 --> 00:00:28,000
学姐，中秋快乐！【加油】
丙午中秋 · 赠学姐
```

### 44/56 · `moonfilm/tools/angle_check.py`
<!-- casebook-file {"path": "moonfilm/tools/angle_check.py", "lines": 64, "final_newline": true, "sha256": "df0183d573549bf2f2ed890e42c05771f15cbb5f689ec60d4706c9e978ea455f", "original_sha256": "df0183d573549bf2f2ed890e42c05771f15cbb5f689ec60d4706c9e978ea455f"} -->
```python
#!/usr/bin/env python3
"""
Framing angles before building the set  (补全：reconstructed from the conversation)

During production this was an inline `python3 - <<EOF` command, never saved as a file. It is the
check that moved the moon from ~19° to 12° elevation: from the key camera positions it prints the
azimuth / elevation of the window lintel and sill, her head and the lantern rope, so you can see
whether the moon (and what hangs in front of it) will actually be framed by the window.

    python3 tools/angle_check.py                # the values used at that point in production
    python3 tools/angle_check.py --el 19 --az 8 # try another moon position

Conventions (same as src/layout.ts): metres, y up, +z out of the window, az = atan2(dx, dz)
(positive = towards +x, her left), el = atan2(dy, horizontal distance). The camera positions and
points below are the ones used at the time; the final values live in src/timeline.ts (CAMERA) and
src/layout.ts (WIN, HIPS/head, LANTERN_ROPE: a=(2.85, 2.45, 4.2), sag 0.22, MOON_DIR).
"""
import argparse
import math


def ang(cam, p):
    dx, dy, dz = [p[i] - cam[i] for i in range(3)]
    return math.degrees(math.atan2(dx, dz)), math.degrees(math.atan2(dy, math.hypot(dx, dz)))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--el", type=float, default=12.0, help="moon elevation, degrees")
    ap.add_argument("--az", type=float, default=8.0, help="moon azimuth, degrees")
    ap.add_argument("--radius", type=float, default=0.068, help="moon angular radius, rad (MOON_ANG_R)")
    a = ap.parse_args()
    r = math.degrees(a.radius)

    el, az = math.radians(a.el), math.radians(a.az)
    md = (math.sin(az) * math.cos(el), math.sin(el), math.cos(az) * math.cos(el))
    print("moon dir", [round(v, 4) for v in md], "  <- paste into MOON_DIR in src/layout.ts")
    print(f"moon     az {a.az:6.1f}°  el {a.el:6.1f}°  (a direction: the same from every camera)\n")

    cams = {"B1end": (0.45, 1.46, -1.85), "B9": (-0.1, 1.62, -2.1), "window": (0.05, 1.6, -0.45)}
    points = {
        "win top": (0, 2.34, -0.1),
        "sill": (0, 0.93, -0.1),
        "head": (0, 1.2, -0.98),
        "lantern mid": (0.45, 2.1, 4.2),
        "lantern end": (2.3, 2.1, 4.2),
    }
    for n, c in cams.items():
        row = [f"{k} ({x:6.1f}°, {y:5.1f}°)" for k, (x, y) in ((k, ang(c, p)) for k, p in points.items())]
        top_el = ang(c, points["win top"])[1]
        sill_el = ang(c, points["sill"])[1]
        if sill_el + r < a.el < top_el - r:
            verdict = "whole disc inside the window"
        elif sill_el - r < a.el < top_el + r:
            verdict = "PARTLY CUT by the lintel or sill"
        else:
            verdict = "HIDDEN (outside the window)"
        print(f"{n:7s}", " | ".join(row))
        print(f"{'':7s} moon (el {a.el - r:.1f}°..{a.el + r:.1f}°): {verdict}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 45/56 · `moonfilm/tools/audio_report.py`
<!-- casebook-file {"path": "moonfilm/tools/audio_report.py", "lines": 126, "final_newline": true, "sha256": "d9f09cebc31180e31392eafe2adc2e6c6cfd1bc9b5ce75ea8a7fb32576b00740", "original_sha256": "d9f09cebc31180e31392eafe2adc2e6c6cfd1bc9b5ce75ea8a7fb32576b00740"} -->
```python
#!/usr/bin/env python3
"""
Objective checks of the soundtrack  (补全：reconstructed from the conversation)

The score could not be judged by ear during production, so these measurements stood in for
listening. They were separate inline commands at the time; this script runs them together.

    python3 tools/audio_report.py [--audio out/audio] [--meta out/meta.json] [--out out/qc]

Writes
  out/qc/audio_analysis.png  spectrogram of the mix + per-stem RMS + mix RMS (bar lines every 3 s)
  out/qc/music_env.png       music-stem envelope in dB + waveform 3-9 s (phrasing / breaths / dynamic arc)
Prints
  music RMS inside the silence window (should be about -inf: the pre bus is cut to real silence)
  octave-band balance relative to 63-125 Hz (production values after the master EQ:
  2-4 kHz -6.3 dB, 8-16 kHz -19.9 dB; before it -11.1 / -24.4 = dull on phone speakers)
  the largest sample-to-sample jumps (clicks) and the DC offset
Requires numpy, scipy, matplotlib.
"""
import argparse
import json
import os

import numpy as np
from scipy import signal
from scipy.io import wavfile

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", default="out/audio")
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--out", default="out/qc")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    sr, mix = wavfile.read(os.path.join(a.audio, "mix.wav"))
    stems = {k: wavfile.read(os.path.join(a.audio, "stems", f"{k}.wav"))[1] for k in ["music", "sfx", "amb"]}

    # ---- spectrogram + stem / mix RMS
    fig, ax = plt.subplots(3, 1, figsize=(16, 10), gridspec_kw={"height_ratios": [3, 1.4, 1.4]})
    m = mix.mean(1)
    f, t, S = signal.spectrogram(m, sr, nperseg=2048, noverlap=1536)
    ax[0].pcolormesh(t, f, 10 * np.log10(S + 1e-12), shading="auto", vmin=-120, vmax=-40, cmap="magma")
    ax[0].set_ylim(0, 9000)
    ax[0].set_title("mix spectrogram")
    for x in range(0, 29, 3):
        ax[0].axvline(x, color="w", lw=0.4, alpha=0.5)
    win = int(0.05 * sr)

    def rms(x):
        x = x.mean(1) if x.ndim > 1 else x
        n = len(x) // win
        return np.sqrt((x[: n * win].reshape(n, win) ** 2).mean(1) + 1e-12)

    tt = np.arange(len(m) // win) * 0.05
    for k, v in stems.items():
        r = rms(v)
        ax[1].plot(tt[: len(r)], 20 * np.log10(r), label=k, lw=0.9)
    ax[1].legend()
    ax[1].set_ylim(-80, -5)
    ax[1].grid(alpha=0.3)
    ax[1].set_title("stem RMS (dBFS, 50 ms)")
    r = rms(mix)
    ax[2].plot(tt[: len(r)], 20 * np.log10(r), color="k", lw=0.9)
    ax[2].set_ylim(-70, 0)
    ax[2].grid(alpha=0.3)
    ax[2].set_title("mix RMS")
    for axx in ax[1:]:
        for x in range(0, 29, 3):
            axx.axvline(x, color="gray", lw=0.5, alpha=0.5)
    plt.tight_layout()
    plt.savefig(os.path.join(a.out, "audio_analysis.png"), dpi=80)
    plt.close(fig)

    # ---- silence window (from the timeline): the music must really stop
    sil0, sil1 = json.load(open(a.meta, encoding="utf-8"))["cues"]["silence"] if os.path.exists(a.meta) else (23.52, 23.78)
    i0, i1 = int((sil0 + 0.03) * sr), int((sil1 - 0.02) * sr)
    print(f"music RMS in break {sil0:.2f}-{sil1:.2f}s (dBFS):",
          round(float(20 * np.log10(np.sqrt((stems["music"][i0:i1] ** 2).mean()) + 1e-12)), 1))
    print("mix peak (sample):", round(float(np.abs(mix).max()), 4))

    # ---- octave-band tonal balance
    fw, P = signal.welch(m, sr, nperseg=8192)
    ref = None
    print("octave bands relative to 63-125 Hz:")
    for lo, hi in [(63, 125), (125, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 16000)]:
        sel = (fw >= lo) & (fw < hi)
        db = 10 * np.log10(P[sel].sum() + 1e-20)
        ref = db if ref is None else ref
        print(f"  {lo:>5}-{hi:<5} Hz  {db - ref:+6.1f} dB")

    # ---- music envelope (breaths between phrases, dynamic arc across the bars)
    mu = stems["music"].mean(1)
    w10 = int(0.01 * sr)
    env = np.sqrt((mu[: len(mu) // w10 * w10].reshape(-1, w10) ** 2).mean(1))
    fig, ax = plt.subplots(2, 1, figsize=(16, 5))
    ax[0].plot(np.arange(len(env)) * 0.01, 20 * np.log10(env + 1e-9))
    ax[0].set_ylim(-60, -5)
    ax[0].grid(alpha=0.3)
    ax[0].set_title("music stem envelope (dB)")
    for b in range(0, 29, 3):
        ax[0].axvline(b, color="r", lw=0.5)
    j0, j1 = int(3.0 * sr), int(9.0 * sr)
    ax[1].plot(np.arange(j1 - j0) / sr + 3.0, mu[j0:j1], lw=0.3)
    ax[1].set_title("music waveform 3-9 s")
    plt.tight_layout()
    plt.savefig(os.path.join(a.out, "music_env.png"), dpi=70)
    plt.close(fig)

    # ---- clicks + DC
    d = np.abs(np.diff(mix[:, 0]))
    idx = np.argsort(d)[-8:]
    print("largest sample jumps (s, size):", [(round(float(i) / sr, 3), round(float(d[i]), 3)) for i in sorted(idx)])
    print("DC:", [round(float(v), 6) for v in mix.mean(0)])
    print("plots:", os.path.join(a.out, "audio_analysis.png"), os.path.join(a.out, "music_env.png"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 46/56 · `moonfilm/tools/check_repro.py`
<!-- casebook-file {"path": "moonfilm/tools/check_repro.py", "lines": 78, "final_newline": true, "sha256": "261870a977bd02f8cc8017a77e0675d431182c70817fbd602b618be79077f260", "original_sha256": "261870a977bd02f8cc8017a77e0675d431182c70817fbd602b618be79077f260"} -->
```python
#!/usr/bin/env python3
"""
Compare a fresh render with the original one  (added for the source package)

reference/ holds the sha256 of every original frame (frames.sha256), of the original audio
(audio.sha256) and the original meta.json. This script reports how much of out/ is byte-identical.

    python3 tools/check_repro.py [--frames out/frames] [--audio out/audio]

Byte-identical output needs the same renderer: Chromium 141.0.7390.37 with SwiftShader on Linux
x86_64, fontconfig's usual Ubuntu hinting defaults (hintslight), and numpy/scipy builds that round
the same way. On another OS/GPU/Chromium the frames look the same but differ at pixel level,
which is expected; use tools/seam_check.py or scripts/kit/compare_frames.py to judge by eye/diff.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "reference"


def sha(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def read_sums(p: Path) -> dict:
    out = {}
    for line in p.read_text().splitlines():
        if line.strip():
            h, name = line.split(maxsplit=1)
            out[name.strip()] = h
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", default=str(ROOT / "out" / "frames"))
    ap.add_argument("--audio", default=str(ROOT / "out" / "audio"))
    ap.add_argument("--meta", default=str(ROOT / "out" / "meta.json"))
    a = ap.parse_args()
    ok_all = True

    meta = Path(a.meta)
    if meta.exists():
        same = json.loads(meta.read_text(encoding="utf-8")) == json.loads((REF / "meta.json").read_text(encoding="utf-8"))
        print(f"meta.json      : {'identical' if same else 'DIFFERENT'} to reference/meta.json")
        ok_all &= same

    ref = read_sums(REF / "frames.sha256")
    frames = Path(a.frames)
    present = [n for n in sorted(ref) if (frames / n).exists()]
    diff = [n for n in present if sha(frames / n) != ref[n]]
    print(f"frames         : {len(present) - len(diff)}/{len(present)} present frames byte-identical "
          f"({len(ref) - len(present)} of {len(ref)} not rendered yet)")
    if diff:
        print("                 differing:", ", ".join(diff[:12]) + (" …" if len(diff) > 12 else ""))
    ok_all &= not diff

    aref = read_sums(REF / "audio.sha256")
    for name, h in aref.items():
        p = Path(a.audio) / name
        if p.exists():
            same = sha(p) == h
            print(f"audio {name:14s}: {'identical' if same else 'DIFFERENT'}")
            ok_all &= same

    print("result         :", "bit-exact so far" if ok_all else "differs from the original render (see above)")
    return 0 if ok_all else 1


if __name__ == "__main__":
    raise SystemExit(main())
```

### 47/56 · `moonfilm/tools/compare_psnr.sh`
<!-- casebook-file {"path": "moonfilm/tools/compare_psnr.sh", "lines": 15, "final_newline": true, "sha256": "f7e017f76f8f8ca0bd6a333f514223d993947051ba19e0ab0ffbd5a9e9555f76", "original_sha256": "f7e017f76f8f8ca0bd6a333f514223d993947051ba19e0ab0ffbd5a9e9555f76"} -->
```bash
#!/usr/bin/env bash
# 两个版本的逐帧 PSNR 对比（补全：制作时是对话里的内联命令）
# 用途：为了微信约 25 MB 的直发上限把 CRF 18 压到 CRF 20 时，证明画质没有明显损失
# （当时的结果：逐帧 PSNR 最低 45.5 dB，肉眼看不出差别）。
#
#   bash tools/compare_psnr.sh out/final_crf20.mp4 out/final_crf18.mp4
set -euo pipefail
A="${1:?usage: compare_psnr.sh <candidate.mp4> <reference.mp4>}"
B="${2:?usage: compare_psnr.sh <candidate.mp4> <reference.mp4>}"
echo "overall:"
ffmpeg -hide_banner -i "$A" -i "$B" -lavfi "[0:v][1:v]psnr" -f null - 2>&1 | grep -E "PSNR" | tail -1
echo "worst 3 frames (psnr_avg, dB):"
ffmpeg -v error -i "$A" -i "$B" -lavfi "[0:v][1:v]psnr=stats_file=-" -f null - 2>/dev/null \
  | awk '{print $6}' | sed 's/psnr_avg://' | sort -n | head -3
for f in "$A" "$B"; do python3 -c "import os,sys; print(f'{sys.argv[1]}  {os.path.getsize(sys.argv[1])/1e6:.1f} MB')" "$f"; done
```

### 48/56 · `moonfilm/tools/final_seconds.py`
<!-- casebook-file {"path": "moonfilm/tools/final_seconds.py", "lines": 46, "final_newline": true, "sha256": "c36b44ddd5a14922648e8ad4f2a1c3908c03d9a0e53049ac9cb8496b5f02bcc5", "original_sha256": "c36b44ddd5a14922648e8ad4f2a1c3908c03d9a0e53049ac9cb8496b5f02bcc5"} -->
```python
#!/usr/bin/env python3
"""
One frame per second from the finished MP4, as one labelled sheet  (补全：reconstructed from the conversation)

The last look before delivery: decode the delivered file itself (not the source JPEGs) at 1 fps
and tile the 28 frames, so the whole arc can be checked at a glance.

    python3 tools/final_seconds.py out/final.mp4        # -> out/qc/final_sec/s01.jpg … + out/qc/final_seconds.jpg

Requires ffmpeg + Pillow.
"""
import argparse
import glob
import os
import subprocess

from PIL import Image, ImageDraw


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4", nargs="?", default="out/final.mp4")
    ap.add_argument("--dir", default="out/qc/final_sec")
    ap.add_argument("--out", default="out/qc/final_seconds.jpg")
    a = ap.parse_args()
    os.makedirs(a.dir, exist_ok=True)
    for f in glob.glob(os.path.join(a.dir, "s*.jpg")):
        os.remove(f)
    subprocess.run(["ffmpeg", "-v", "error", "-i", a.mp4, "-vf", "fps=1,scale=480:-1", "-q:v", "3",
                    os.path.join(a.dir, "s%02d.jpg")], check=True)
    files = sorted(glob.glob(os.path.join(a.dir, "s*.jpg")))
    w, h, cols = 480, 270, 7
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w, rows * (h + 18)), (18, 18, 18))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        x, y = (i % cols) * w, (i // cols) * (h + 18)
        sheet.paste(Image.open(f), (x, y + 18))
        d.text((x + 4, y + 3), f"{i:02d}s", fill=(230, 230, 230))
    sheet.save(a.out, quality=88)
    print(a.out, len(files))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 49/56 · `moonfilm/tools/frame_crops.py`
<!-- casebook-file {"path": "moonfilm/tools/frame_crops.py", "lines": 47, "final_newline": true, "sha256": "b54204cfdd856c481a62b443304efd22c8b2dc042507a2322ef121b67e44d8e8", "original_sha256": "b54204cfdd856c481a62b443304efd22c8b2dc042507a2322ef121b67e44d8e8"} -->
```python
#!/usr/bin/env python3
"""
Crops of the MP4 at chosen times, tiled 2 across  (补全：reconstructed from the conversation)

Used for the A/V-sync fix of the 加油 seal: decode the delivered MP4 just before, at, and after
the cue (SEAL.at = 25.5 s, where the "thump" sits) and check the seal has landed exactly at 25.50.

    python3 tools/frame_crops.py out/final.mp4                     # the seal check -> out/qc/seal_seq.jpg
    python3 tools/frame_crops.py out/final.mp4 --times 9.3,9.4,9.5,9.6 --crop 700,300,1300,700 --out out/qc/lanterns.jpg

Requires ffmpeg + Pillow.
"""
import argparse
import os
import subprocess

from PIL import Image


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4", nargs="?", default="out/final.mp4")
    ap.add_argument("--times", default="25.30,25.50,25.62,26.00")
    ap.add_argument("--crop", default="1150,450,1750,850", help="x0,y0,x1,y1 in 1920x1080 pixels")
    ap.add_argument("--out", default="out/qc/seal_seq.jpg")
    ap.add_argument("--dir", default="out/qc/verify")
    a = ap.parse_args()
    os.makedirs(a.dir, exist_ok=True)
    box = tuple(map(int, a.crop.split(",")))
    cw, ch = box[2] - box[0], box[3] - box[1]
    times = a.times.split(",")
    ims = []
    for t in times:
        f = os.path.join(a.dir, f"crop_{t}.jpg")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", a.mp4, "-frames:v", "1", "-q:v", "3", f], check=True)
        ims.append(Image.open(f).crop(box))
    rows = (len(ims) + 1) // 2
    s = Image.new("RGB", (2 * cw, rows * ch))
    for i, im in enumerate(ims):
        s.paste(im, ((i % 2) * cw, (i // 2) * ch))
    s.save(a.out)
    print(a.out, "times:", ", ".join(times))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 50/56 · `moonfilm/tools/preview.sh`
<!-- casebook-file {"path": "moonfilm/tools/preview.sh", "lines": 17, "final_newline": true, "sha256": "695584a227b82c86e09526e8ffedf3d6573edee5c7a45a5db4cd28ae9b98815f", "original_sha256": "695584a227b82c86e09526e8ffedf3d6573edee5c7a45a5db4cd28ae9b98815f"} -->
```bash
#!/usr/bin/env bash
# 半分辨率全片预览 + 带时间标注的拼图（补全：制作时是对话里的内联命令，按记录整理成脚本）
#
#   bash tools/preview.sh            # 每 4 帧取 1（6 fps）：168 帧，2 核 CPU 约 5 分钟 -> out/qc/strip_*.jpg
#   STEP=2 bash tools/preview.sh     # 12 fps，更细
#
# 输出 960x540、3D 画面 800x450（四分之一像素，约 1.8 s/帧）。用来审运动、转场和节奏，
# 质感和细节要用全分辨率静帧看：node scripts/capture.mjs --frames 0,84,132 --out out/stills
set -euo pipefail
cd "$(dirname "$0")/.."
STEP="${STEP:-4}"
OUT="${OUT:-out/preview}"
TOTAL=$(python3 -c "import json; print(json.load(open('out/meta.json'))['total'])" 2>/dev/null || echo 672)
frames=$(python3 -c "print(','.join(str(f) for f in range(0, $TOTAL, $STEP)))")
mkdir -p "$OUT" out/qc
node scripts/capture.mjs --page "film.html?w=960&h=540&pw=800&ph=450" --frames "$frames" --out "$OUT"
python3 tools/preview_strips.py "$OUT" --out-prefix out/qc/strip
```

### 51/56 · `moonfilm/tools/preview_strips.py`
<!-- casebook-file {"path": "moonfilm/tools/preview_strips.py", "lines": 63, "final_newline": true, "sha256": "2ab41ff250483d6138f9c3457dba70bb7887ac753dc4cb37ff596d7fe06aedd2", "original_sha256": "2ab41ff250483d6138f9c3457dba70bb7887ac753dc4cb37ff596d7fe06aedd2"} -->
```python
#!/usr/bin/env python3
"""
Time-labelled contact sheets from preview frames  (补全：reconstructed from the conversation)

The best way to review motion, transitions and rhythm without watching the video: tile the
half-resolution preview frames (every 4th frame = 6 fps) with the time in seconds on each tile.
During production this was an inline command that wrote out/qc/strip_0.jpg … strip_3.jpg.

    python3 tools/preview_strips.py out/preview                       # -> out/qc/strip_<n>.jpg
    python3 tools/preview_strips.py out/preview2 --single out/qc/strip_trans.jpg

Frames must be named f00000.jpg … (as scripts/capture.mjs writes them). Requires Pillow.
"""
import argparse
import glob
import os

from PIL import Image, ImageDraw


def sheet(files, cols, w, fps):
    h = int(w * 9 / 16)
    rows = (len(files) + cols - 1) // cols
    s = Image.new("RGB", (cols * w, rows * (h + 18)), (20, 20, 20))
    d = ImageDraw.Draw(s)
    for i, f in enumerate(files):
        im = Image.open(f).resize((w, h))
        x, y = (i % cols) * w, (i // cols) * (h + 18)
        s.paste(im, (x, y + 18))
        fr = int(os.path.basename(f)[1:6])
        d.text((x + 4, y + 3), f"{fr / fps:.2f}s", fill=(230, 230, 230))
    return s


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("frames_dir")
    ap.add_argument("--out-prefix", default="out/qc/strip")
    ap.add_argument("--single", help="write one sheet with every frame to this path instead")
    ap.add_argument("--per", type=int, default=42, help="frames per sheet")
    ap.add_argument("--cols", type=int, default=6)
    ap.add_argument("--width", type=int, default=400, help="tile width in px")
    ap.add_argument("--fps", type=float, default=24)
    a = ap.parse_args()
    files = sorted(glob.glob(os.path.join(a.frames_dir, "f*.jpg")))
    if not files:
        raise SystemExit(f"no f*.jpg in {a.frames_dir}")
    if a.single:
        os.makedirs(os.path.dirname(a.single) or ".", exist_ok=True)
        sheet(files, a.cols, a.width, a.fps).save(a.single, quality=88)
        print(a.single, len(files))
        return 0
    os.makedirs(os.path.dirname(a.out_prefix) or ".", exist_ok=True)
    for s in range(0, len(files), a.per):
        chunk = files[s:s + a.per]
        out = f"{a.out_prefix}_{s // a.per}.jpg"
        sheet(chunk, a.cols, a.width, a.fps).save(out, quality=88)
        print(out, len(chunk))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 52/56 · `moonfilm/tools/seam_check.py`
<!-- casebook-file {"path": "moonfilm/tools/seam_check.py", "lines": 47, "final_newline": true, "sha256": "db179ee77a11bd850e08b0cd4883b9c1c190816c373e1f47dc77f1be363585c7", "original_sha256": "db179ee77a11bd850e08b0cd4883b9c1c190816c373e1f47dc77f1be363585c7"} -->
```python
#!/usr/bin/env python3
"""
Seam check after a partial re-render  (补全：reconstructed from the conversation)

When only a range of frames is re-rendered (e.g. the seal fix re-rendered 600-641 with
`capture.mjs --range 600:642 --force`), compare the mean absolute grey-level difference of
neighbouring frames across both boundaries. A seam shows up as a jump well above the
frame-to-frame differences around it (in production: 1.87-2.01 everywhere, no jump).

    python3 tools/seam_check.py --around 600,642          # the check that was run
    python3 tools/seam_check.py --pairs 597:598,599:600    # explicit pairs

Requires numpy + Pillow.
"""
import argparse
import os

import numpy as np
from PIL import Image


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", default="out/frames")
    ap.add_argument("--around", help="comma-separated boundary frames b: checks b-3..b+1")
    ap.add_argument("--pairs", help="comma-separated a:b pairs")
    a = ap.parse_args()

    pairs = []
    if a.around:
        for b in map(int, a.around.split(",")):
            pairs += [(b - 3, b - 2), (b - 2, b - 1), (b - 1, b), (b, b + 1)]
    if a.pairs:
        pairs += [tuple(map(int, p.split(":"))) for p in a.pairs.split(",")]
    if not pairs:
        ap.error("give --around or --pairs")

    def f(i):
        return np.asarray(Image.open(os.path.join(a.frames, f"f{i:05d}.jpg")).convert("L"), dtype=np.float32)

    for x, y in pairs:
        print(x, y, round(float(np.abs(f(x) - f(y)).mean()), 3))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

### 53/56 · `moonfilm/tsconfig.json`
<!-- casebook-file {"path": "moonfilm/tsconfig.json", "lines": 8, "final_newline": true, "sha256": "443b2705114d803ab19954fe2d1b9037f170c68ac4ca57bc44c4dbaeeda345ac", "original_sha256": "443b2705114d803ab19954fe2d1b9037f170c68ac4ca57bc44c4dbaeeda345ac"} -->
```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler",
    "strict": true, "skipLibCheck": true, "resolveJsonModule": true, "esModuleInterop": true,
    "noEmit": true, "lib": ["DOM", "ES2022"]
  },
  "include": ["src"]
}
```

### 54/56 · `moonfilm/web/film.html`
<!-- casebook-file {"path": "moonfilm/web/film.html", "lines": 16, "final_newline": true, "sha256": "b3061087c518c06cda6a2c9623fc5a28f128c7f68003ee8d9be4c1468f7c12b7", "original_sha256": "b3061087c518c06cda6a2c9623fc5a28f128c7f68003ee8d9be4c1468f7c12b7"} -->
```html
<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><link rel="icon" href="data:,"><title>月光替你亮着灯</title>
<style>html,body{margin:0;background:#000}canvas{display:block}#gl{position:absolute;left:-99999px}</style>
<!-- source-package addition: the exact Noto Serif CJK SC 2.002 faces the film was rendered with, subset to the
     characters in src/ (scripts/make_fonts.py). Scoped to this page, so no system font install is needed. -->
<style>
@font-face{font-family:'Noto Serif CJK SC';font-style:normal;font-weight:400;src:url(fonts/NotoSerifCJKsc-Regular.subset.otf) format('opentype')}
@font-face{font-family:'Noto Serif CJK SC';font-style:normal;font-weight:600;src:url(fonts/NotoSerifCJKsc-SemiBold.subset.otf) format('opentype')}
@font-face{font-family:'Noto Serif CJK SC';font-style:normal;font-weight:700;src:url(fonts/NotoSerifCJKsc-Bold.subset.otf) format('opentype')}
@font-face{font-family:'Noto Serif CJK SC';font-style:normal;font-weight:900;src:url(fonts/NotoSerifCJKsc-Black.subset.otf) format('opentype')}
</style>
</head><body>
<canvas id="gl" width="1600" height="900"></canvas>
<canvas id="out" width="1920" height="1080"></canvas>
<script type="module" src="./dist/film.js"></script>
</body></html>
```

### 55/56 · `moonfilm/web/fonts/OFL.txt`
<!-- casebook-file {"path": "moonfilm/web/fonts/OFL.txt", "lines": 103, "final_newline": true, "sha256": "b42f8d2bab0c743b8c95e1bd1da928ce60fff9c96a142784f5d64a49b532ec4b", "original_sha256": "b42f8d2bab0c743b8c95e1bd1da928ce60fff9c96a142784f5d64a49b532ec4b"} -->
```text
The four files NotoSerifCJKsc-*.subset.otf in this folder are subsets (Modified Versions under the
OFL) of Noto Serif CJK SC, version 2.002 (Regular, SemiBold, Bold, Black), as shipped in the Ubuntu
packages fonts-noto-cjk / fonts-noto-cjk-extra. They were cut down with fontTools
(scripts/make_fonts.py) to the characters listed in charset.txt; outlines, metrics and names
are unchanged. Upstream: https://github.com/notofonts/noto-cjk

Copyright notice embedded in the fonts:
  © 2017-2023 Adobe (http://www.adobe.com/).
Noto is a trademark of Google LLC.

This Font Software is licensed under the SIL Open Font License, Version 1.1, reproduced below
(also at https://openfontlicense.org).

-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE

The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font
creation efforts of academic and linguistic communities, and to provide
a free and open framework in which fonts may be shared and improved in
partnership with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply to
any document created using the fonts or their derivatives.

DEFINITIONS

"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components
as distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to,
deleting, or substituting -- in part or in whole -- any of the
components of the Original Version, by changing formats or by porting
the Font Software to a new environment.

"Author" refers to any designer, engineer, programmer, technical writer
or other person who contributed to the Font Software.

PERMISSION & CONDITIONS

Permission is hereby granted, free of charge, to any person obtaining a
copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components, in
Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the
corresponding Copyright Holder. This restriction only applies to the
primary font name as presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole, must
be distributed entirely under this license, and must not be distributed
under any other license. The requirement for fonts to remain under this
license does not apply to any document created using the Font Software.

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

### 56/56 · `moonfilm/web/fonts/charset.txt`
<!-- casebook-file {"path": "moonfilm/web/fonts/charset.txt", "lines": 1, "final_newline": true, "sha256": "e72149c2e58738545a4028a12d99d3bc03956d0d23e041036a2c5a6490bf3060", "original_sha256": "e72149c2e58738545a4028a12d99d3bc03956d0d23e041036a2c5a6490bf3060"} -->
```text
 !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~°±·× –—…→↔−≈、。一上不世丙个中乐也争亮人今份会但你光公几刑力加午取台圆在多夜姐学宪小就平彩很得心快急想换数是晚更替月未本来柔概每民水油法温灯点照物理界的直真着礼社秋算认让论讼诉赠走身过还这送都配量难页！，
```

