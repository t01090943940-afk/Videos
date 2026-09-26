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
