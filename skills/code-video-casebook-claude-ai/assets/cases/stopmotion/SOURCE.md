# stopmotion · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show stopmotion <路径>`；还原成真实目录：`python3 scripts/casebook.py copy stopmotion <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `stop-motion-3d/LICENSE.txt` | 18 | 67 |
| 2 | `stop-motion-3d/SKILL.md` | 178 | 90 |
| 3 | `stop-motion-3d/assets/examples/story-episode.json` | 287 | 273 |
| 4 | `stop-motion-3d/assets/template/package-lock.json` | 954 | 565 |
| 5 | `stop-motion-3d/assets/template/package.json` | 18 | 1524 |
| 6 | `stop-motion-3d/assets/template/scripts/capture.mjs` | 103 | 1547 |
| 7 | `stop-motion-3d/assets/template/src/entry/film.ts` | 59 | 1655 |
| 8 | `stop-motion-3d/assets/template/src/entry/sandbox.ts` | 132 | 1719 |
| 9 | `stop-motion-3d/assets/template/src/episode/episode.json` | 914 | 1856 |
| 10 | `stop-motion-3d/assets/template/src/looks/block.ts` | 60 | 2775 |
| 11 | `stop-motion-3d/assets/template/src/looks/clay.ts` | 75 | 2840 |
| 12 | `stop-motion-3d/assets/template/src/looks/comic.ts` | 72 | 2920 |
| 13 | `stop-motion-3d/assets/template/src/looks/common.ts` | 78 | 2997 |
| 14 | `stop-motion-3d/assets/template/src/looks/diorama.ts` | 73 | 3080 |
| 15 | `stop-motion-3d/assets/template/src/looks/index.ts` | 11 | 3158 |
| 16 | `stop-motion-3d/assets/template/src/looks/prims.ts` | 77 | 3174 |
| 17 | `stop-motion-3d/assets/template/src/looks/screens.ts` | 17 | 3256 |
| 18 | `stop-motion-3d/assets/template/src/looks/sketch.ts` | 67 | 3278 |
| 19 | `stop-motion-3d/assets/template/src/looks/tex.ts` | 130 | 3350 |
| 20 | `stop-motion-3d/assets/template/src/looks/types.ts` | 82 | 3485 |
| 21 | `stop-motion-3d/assets/template/src/looks/vox.ts` | 86 | 3572 |
| 22 | `stop-motion-3d/assets/template/src/looks/watercolor.ts` | 72 | 3663 |
| 23 | `stop-motion-3d/assets/template/src/runtime/acting.ts` | 58 | 3740 |
| 24 | `stop-motion-3d/assets/template/src/runtime/camera.ts` | 26 | 3803 |
| 25 | `stop-motion-3d/assets/template/src/runtime/clock.ts` | 63 | 3834 |
| 26 | `stop-motion-3d/assets/template/src/runtime/film.ts` | 340 | 3902 |
| 27 | `stop-motion-3d/assets/template/src/runtime/mg.ts` | 173 | 4247 |
| 28 | `stop-motion-3d/assets/template/src/runtime/post.ts` | 155 | 4425 |
| 29 | `stop-motion-3d/assets/template/src/runtime/rig.ts` | 331 | 4585 |
| 30 | `stop-motion-3d/assets/template/src/runtime/rng.ts` | 30 | 4921 |
| 31 | `stop-motion-3d/assets/template/src/runtime/types.ts` | 158 | 4956 |
| 32 | `stop-motion-3d/assets/template/src/world/backdrop.ts` | 89 | 5119 |
| 33 | `stop-motion-3d/assets/template/src/world/hooks.ts` | 14 | 5213 |
| 34 | `stop-motion-3d/assets/template/src/world/palette.ts` | 39 | 5232 |
| 35 | `stop-motion-3d/assets/template/src/world/poses.json` | 784 | 5276 |
| 36 | `stop-motion-3d/assets/template/src/world/props.ts` | 251 | 6065 |
| 37 | `stop-motion-3d/assets/template/src/world/studio.ts` | 381 | 6321 |
| 38 | `stop-motion-3d/assets/template/src/world/world.json` | 982 | 6707 |
| 39 | `stop-motion-3d/assets/template/tsconfig.json` | 8 | 7694 |
| 40 | `stop-motion-3d/assets/template/web/film.html` | 8 | 7707 |
| 41 | `stop-motion-3d/assets/template/web/sandbox.html` | 31 | 7720 |
| 42 | `stop-motion-3d/references/acting.md` | 111 | 7756 |
| 43 | `stop-motion-3d/references/directing.md` | 139 | 7872 |
| 44 | `stop-motion-3d/references/first-principles.md` | 158 | 8016 |
| 45 | `stop-motion-3d/references/lessons.md` | 54 | 8179 |
| 46 | `stop-motion-3d/references/looks.md` | 141 | 8238 |
| 47 | `stop-motion-3d/references/render-qc.md` | 99 | 8384 |
| 48 | `stop-motion-3d/references/sound.md` | 97 | 8488 |
| 49 | `stop-motion-3d/references/world.md` | 176 | 8590 |
| 50 | `stop-motion-3d/scripts/audio.py` | 693 | 8771 |
| 51 | `stop-motion-3d/scripts/compare_frames.py` | 62 | 9469 |
| 52 | `stop-motion-3d/scripts/contact_sheet.py` | 74 | 9536 |
| 53 | `stop-motion-3d/scripts/finalize.py` | 201 | 9615 |
| 54 | `stop-motion-3d/scripts/init_project.py` | 56 | 9821 |
| 55 | `stop-motion-3d/scripts/validate.py` | 287 | 9882 |

---

### 1/55 · `stop-motion-3d/LICENSE.txt`
<!-- casebook-file {"path": "stop-motion-3d/LICENSE.txt", "lines": 18, "final_newline": true, "sha256": "4016a01b70fb30cf985aa5c3d5540ac3d7bd47062e2eab948bab42d13b3db442", "original_sha256": "4016a01b70fb30cf985aa5c3d5540ac3d7bd47062e2eab948bab42d13b3db442"} -->
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

### 2/55 · `stop-motion-3d/SKILL.md`
<!-- casebook-file {"path": "stop-motion-3d/SKILL.md", "lines": 178, "final_newline": true, "sha256": "8efc7682aa61d138cce8c895c363117374e4ced0ef0d22fc249d226568e372a3", "original_sha256": "8efc7682aa61d138cce8c895c363117374e4ced0ef0d22fc249d226568e372a3"} -->
````markdown
---
name: stop-motion-3d
description: Make stop-motion-feel 3D animated videos entirely in code (product/skill promos, explainers, montages, short dramas and 漫剧 series). Build a reusable Three.js sandbox world once (set, props, puppets, named cameras), then shoot episodes from JSON shot lists in any of seven real render pipelines (miniature diorama, voxel block/MC-like, claymation, Vox-style paper collage, hand-drawn line sketch, cyberpunk comic, watercolor), with rigid on-twos puppets, IK hand contacts, state continuity, motion-graphics overlays, derived Foley plus original music, and a QC-verified H.264 MP4. Use when the user asks for an animated/3D/stop-motion/MC/Vox/hand-drawn style video, a style-switch montage, a reusable scene for a series, or a code-generated short film. Not for photoreal rendering, AI image/video generation, or editing existing footage.
license: Complete terms in LICENSE.txt
compatibility: Node 18+ and Python 3.9+ with numpy, scipy and Pillow; ffmpeg/ffprobe; a Chromium that Playwright can launch (headless SwiftShader works, no GPU needed). Network is needed once for npm install.
---

# stop-motion-3d · 代码定格动画工作室

把"做一条动画"拆成四层，每层只做一件事，层与层之间只通过数据契约说话：

| 层 | 是什么 | 文件 | 生命周期 |
|---|---|---|---|
| **World 沙盒世界** | 布景、道具、角色木偶、机位、标记点、可持有物、世界状态 | `src/world/*` | 搭一次，整个系列复用 |
| **Episode 剧集** | 镜头表：节拍、机位、画风、表演关键帧、事件、MG 字幕 | `src/episode/*.json` | 每条片一个 |
| **Look 画风** | 一整条渲染管线：几何处理 + 着色 + 布光 + 屏幕空间后期 + 帧节奏 | `src/looks/*.ts` | 内置 7 个，可加 |
| **Delivery 交付** | 逐帧采集 → 派生音频 → 封装 → 机器可证 QC | `scripts/*` | 通用 |

核心信条：**同一个世界，任意画风；同一份数据，画面/声音/QC 全部派生。** 所以换风格不用重搭场景，拍续集不用重做道具，声音永远不会和画面错位。

为什么这样拆、每个取舍背后的实测数据 → `references/first-principles.md`（改架构前必读）。

---

## 0. 开工前先问（用 AskUserQuestion，一次问完）

画风是最贵、最难回头的决定，**必须先问**。给用户选项，而不是让用户描述：

1. **画风**（可多选；多选 = 混剪/换风格片）。选项文案直接用下表的「中文名 + 一句话」，有预览图可以一并给：`assets/style-previews/<id>.jpg`，总览 `assets/style-previews/gallery.jpg`。
2. **片子是干什么的**：产品/skill 宣传、知识讲解、剧情短片/漫剧、公益/安全提示（决定节拍模板，见 `references/directing.md`）。
3. **时长**：15s / 30s / 60s（默认）/ 90–180s（要展开节拍，不是拉长镜头）。
4. **世界**：复用内置「程序员开放式工作室」，还是要新场景（工地、教室、厨房……）。新场景 = 新的 world.json + props，runtime 和 looks 原样复用（`references/world.md` §新世界）。

用户说"你定"时的默认：60s、宣传片模板、内置工作室、画风按内容选（决策表在 `references/looks.md` §选型）。

## 1. 七个内置画风（真正不同的管线，不是换色）

| id | 中文名 | 一句话 | 节奏 | 关键技术 | 相对成本 |
|---|---|---|---|---|---|
| `diorama` | 微缩沙盘 | 桌面模型、真实光影、小景深 | 12fps | 倒角几何 + PBR + 深度 AO + ACES | 1.0× |
| `block` | 方块世界 | MC 式体素，16px 贴图 | 12fps | 圆柱/球→方块 + Lambert + 像素纹理 | 0.8× |
| `clay` | 黏土定格 | 手捏黏土、指纹、暖光、浅景深 | 8fps | 圆角团块 + bump + 8 采样 DOF | 1.3× |
| `vox` | Vox 纸片拼贴 | 编辑部配色、纸边、网点、错版 | 8fps + 相机步进 | 2 阶 toon + 撕纸边 + 纸层投影 + 45° 网点 | 1.1× |
| `sketch` | 手绘线稿 | 每帧都像一笔笔画出来的 | 12fps + 相机步进 | 法线/深度描边 + 线条抖动(boil) + 排线 | 1.0× |
| `comic` | 赛博漫画 | 夜景霓虹、粗墨线、网点 | 12fps | 3 阶 toon + 霓虹辉光 + 墨线 + 网点 | 1.2× |
| `watercolor` | 水彩晕染 | 湿边、颜料沉积、纸纹、铅笔底稿 | 12fps | UV 漂移 + 7 采样晕染 + 边缘积色 | 1.2× |

每个画风的配方、参数、专属失败检查 → `references/looks.md`。**加新画风**只需实现一个 `LookDef`（契约也在那里），世界代码一行不改。

## 2. 流程（每一关都要真的看图，不跳关）

```bash
S=<this skill dir>
python3 $S/scripts/init_project.py my-film --install      # 复制模板工程 + npm install + 构建
cd my-film
npm run build                                               # esbuild → web/dist/{film,sandbox}.js
python3 $S/scripts/validate.py . --timeline                 # 数据先过：引用、时序、连续性、导演规则
node scripts/capture.mjs --meta --out out/meta.json         # 时长、镜头起点、事件帧
node scripts/capture.mjs --frames 0,130,310,500 --out out/stills   # 故事板/画风抽帧
python3 $S/scripts/contact_sheet.py out/stills out/qc/board.jpg --columns 4
node scripts/capture.mjs --inspect 0:1440 --out out/qc/inspect.json # 接触/穿插/姿态签名（不出像素，快）
node scripts/capture.mjs --range 0:1440 --out out/frames    # 全片（可断点续渲，后台跑）
python3 $S/scripts/audio.py --out out/audio                 # 由 meta + inspect 派生全部声音
python3 $S/scripts/finalize.py .                            # 封装 + 9 项 QC + manifest
```

关卡（顺序固定；越早发现的错越便宜）：

1. **Story lock**：`validate.py --timeline` 把片子读成文字。一句情绪句写进 episode 顶部注释或 `title`：*看完观众应该感到 ___，因为 ___ 变了*。
2. **World lock**：打开 `web/sandbox.html`（本地起任意静态服务器），自由环绕真实布景、看所有机位视锥和标记点、切画风、拖时间轴看状态。
3. **Storyboard lock**：每个镜头抽 1–2 帧拼 contact sheet，查构图、遮挡、屏幕方向、道具连续。
4. **Look lock**：每个用到的画风抽"最暗 / 最亮 / 特写"三帧，锁密度、对比、可读性。
5. **Animation lock**：最难的一次交互（抓取、按键、倒水）单独渲 3–5 秒连续帧看接触和节奏；`inspect.json` 里 penetration=0、surface 接触 ≥ −1cm。
6. **Full render → audio → finalize**：`finalize.py` 全绿才算交付；有 FAIL 就如实报告，不说"完成"。

性能预算（SwiftShader 纯 CPU 实测，1280×720）：单画风 0.7–1.3 s/帧；wipe 转场期间 ×2；分屏 bands 最多 ×7。60s = 1440 帧 ≈ 20–35 分钟。**渲染一定后台跑 + 断点续渲**，期间做音频和文档。

## 3. 数据契约速查

**world.json**（详见 `references/world.md`）：`id, title, variants[day,night], state{}, holdables{}, desks{}, marks{}, cameras[], actors{}`。
- 机位是**命名的、预先装好的**：`{id, role, fov, from{pos,target}, to?{pos,target}, ease?}`。没有自由飞行。
- 世界状态 `state` 是连续性的唯一事实源，比如 `hold.mug: "home" | "mia.R"`、`plant.watered: false`。

**episode.json**（详见 `references/directing.md`）：
```json
{ "title": "...", "world": "studio", "fps": 24, "width": 1280, "height": 720,
  "screens": {"1": "block"},                       // 显示器 N 显示哪个画风的实时缩略图
  "shots": [{
    "id": "S04", "beat": "opportunity", "story_function": "一句话：这个镜头为什么存在",
    "duration": 4.5, "camera": "CAM_MIA_FRONT", "look": "clay", "variant": "day",
    "transition": {"type": "wipe", "from": "block", "frames": 14},
    "acting": [
      {"actor": "mia", "loop": "typing", "from": 0, "to": 1.1},
      {"actor": "mia", "at": 1.35, "pose": "reach_mug", "ease": "inOut"},
      {"actor": "mia", "at": 2.0,  "pose": "reach_mug", "ease": "hold"},
      {"actor": "mia", "at": 2.4,  "pose": "hold_mug"}],
    "events": [{"t": 2.0, "set": {"hold.mug": "mia.R"}}],
    "mg": [{"kind": "lower", "from": 0.55, "to": 4.35, "text": "黏土定格", "sub": "Claymation", "tags": "..."}],
    "bands": {"looks": ["block","clay"], "start": 0.9, "stagger": 0.45}  // 可选：分屏并列多画风
  }]}
```

**poses.json**（详见 `references/acting.md`）：`{name: {base?, torso?, head?, armL?, armR?, handL?: {reach, offset?, exact?}, handR?, tiltR?}}`。手的 `reach` 指向道具锚点（`keyboard`/`enter`/`mug_home`/`plant`…）或 `mouth`，IK 自动求解；`exact: true` 表示指尖必须精确到点（按键、握杯）。

**页面契约**（`src/entry/film.ts`）：`window.film = {ready, frame(f) → JPEG dataURL, inspect(f), meta()}`。渲染是帧号的纯函数，所以可断点、可并行、可复现。

## 4. 导演默认值（详见 `references/directing.md`）

- **8 节拍**：world → character → problem/opportunity → decision → work → turn → result → echo。60s 片 8–14 镜；180s 片把节拍**展开成更多镜头**，不是拉长。
- 每镜一个命名机位；运动只做缓推、缓拉、平移，不做恒速环绕；全片守同一侧轴线，角色屏幕左右不变。
- 每个有意义的动作都是 **预备 → 动作 → 反应 → 停顿**；演完之后的无台词静止 ≤ 3 帧再切。
- **定格表演，MG 解释**：信息用 2D 图层（title / chip / lower / note / bandLabels / mark）讲，角色只负责做事。
- 宣传/混剪模板（本 skill 自带样片就是它）：开场全景 → 每个角色 = 一个画风（正面镜 4.5s 带 wipe 进场 + 过肩镜 3s 讲一条原理）→ 结尾拉远，同一世界分屏成全部画风 + 标语。
- 画风切换用 **wipe**（带强调色的噪声斜边，14 帧）；同画风内用硬切。

## 5. 表演与连续性（详见 `references/acting.md`）

- 两个时钟：`t` 连续（相机、粒子、光、MG），`poseT` 按画风的 poseFps 步进（木偶）。手绘类画风连相机也步进（`cameraOnTwos`）。量化一律 `floor(x + 1e-6)`。
- 木偶是 6 块刚体（腿/身/头/臂 + 手），单位 PX = 0.055 m；接触分三种：`surface`（落在平面上，自动补偿下沉）、`exact`（指尖到点）、`free`（空中/到嘴边）。
- 可持有物只由 `hold.<prop>` 状态决定挂在哪：`home` 或 `<actor>.R|L`；事件在步进时钟上触发，这样"手到了"和"杯子跟手"是同一帧。
- 事件帧写在 episode 里，**音频、QC、画面全部从 meta.json 读同一个帧号**。

## 6. 声音（详见 `references/sound.md`）

`scripts/audio.py` 零采样、全程序化、确定性，四个 stem：
- **room** 环境底噪（日/夜两种），永远不是数字静音；
- **music** 原创：96 BPM（2.5s 一小节，7.5s 的画风段刚好落在小节线上），C–G–Am–F，**每个画风一种乐器**（方块=方波琶音、黏土=马林巴、Vox=拨弦+拍手、线稿=钢琴、漫画=锯齿贝斯、水彩=钟琴）；
- **foley** 由 `inspect.json` 的姿态到位帧派生（打字、铅笔、回车）+ 由事件派生（杯子、纸、水壶、浇水、植物）；
- **fx** 转场 whoosh **提前 0.33s**（声音领先画面）+ 每个画风一个签名音效。
- 片尾标题前 0.5s **音乐全停**（静默是标点），再落终止和弦。响度 −16 LUFS，真峰值 ≤ −2 dBTP（AAC 后断言 ≤ −1.0）。

## 7. 交付与 QC（详见 `references/render-qc.md`）

`finalize.py` 先写 `qc-report.json`（status=running），每步更新，崩了也留下真实记录。检查：帧齐全、音画等长、H.264 yuv420p + BT.709 三项显式 + limited range、faststart、`-xerror` 全解码、freezedetect(0.4s)、blackdetect、MP4 内 AAC 的响度/真峰值、穿插=0、接触深度、步进节奏规整。最后写 `manifest.json`（sha256）。

交付清单：`final.mp4`、contact sheet、`qc-report.md`、音频 stems + cues.json、工程源码。**做不到的检查写成 limitation**（例如"没有人耳试听"），不写"全部通过"。

## 8. 铁律（每条都是踩过的坑，原因见 `references/lessons.md`）

1. 先写数据再写渲染；镜头、姿态、连续性全在 JSON 里，不靠记忆。
2. 世界代码只说"这是什么"（`"wood"`、`"cloth:#e0663f"`、`"screen:2"`），不说"长什么样"——那是画风的事。
3. 画风 = 整条管线。只换调色板的"风格"不算风格。
4. 渲染是帧号的纯函数：没有 `Math.random()`、没有 `Date.now()`、没有累积状态。随机用 `rng(seed)`。
5. 远景是画出来的（背景画布），不是建模出来的；相机在墙外时隐藏那面墙（wild walls）。
6. 关掉的灯要 `visible=false`，不是 intensity=0——每盏点光在 CPU 渲染下都按像素收费。
7. 读回 HalfFloat 目标不会同步 GPU，测性能要读 RGBA8 探针，否则数字是假的。
8. QC 用数字：`inspect()` 报接触距离和穿插深度；目测"还行"不算。
9. 报告和 manifest 早落盘；长任务脚本能脱离会话单独跑、能断点续跑。
10. 原片永不覆盖；改版另存。
11. AAC 编码会抬高真峰值：母带留余量，断言的是 MP4 里的值。
12. 显式写 BT.709 并做 full→limited range 转换，否则不同播放器颜色不一样。

## 9. 目录

```
scripts/
  init_project.py     复制模板工程、改名、可选 npm install + build
  validate.py         数据校验 + --timeline 文字版成片
  audio.py            派生音频（room/music/foley/fx 四 stem + 响度）
  finalize.py         封装 H.264/AAC + 9 项 QC + manifest
  contact_sheet.py    抽帧拼图（故事板 / 画风对比）
  compare_frames.py   改了共享布景后做视觉回归
assets/
  template/           完整工程：runtime + 7 looks + 工作室世界 + 样片 episode + capture.mjs + sandbox 查看器
  style-previews/     每个画风的样帧 + gallery.jpg（问画风时给用户看）
  examples/           额外的 episode 示例（单画风剧情短片，复用同一世界）
references/
  first-principles.md 为什么这样设计 + 实测数据（改架构前读）
  world.md            沙盒世界：manifest、道具契约、语义材质、灯光句柄、新世界步骤
  looks.md            画风契约、7 个配方、选型决策表、加新画风、各画风失败检查
  directing.md        episode 结构、节拍、机位、转场、MG、分屏、各类片型模板
  acting.md           木偶、姿态、IK、循环、连续性状态、inspect
  sound.md            audio.py 设计与定制
  render-qc.md        采集契约、性能、封装参数、QC 项、交付
  lessons.md          坑与修法（工程 + 节奏 + 流程）
```

按需读：只改剧情 → directing + acting；换/加画风 → looks；新场景 → world；声音不对 → sound；成片检查失败 → render-qc + lessons。
````

### 3/55 · `stop-motion-3d/assets/examples/story-episode.json`
<!-- casebook-file {"path": "stop-motion-3d/assets/examples/story-episode.json", "lines": 287, "final_newline": false, "sha256": "eaac6e20e04bcdb6415cbb7c44840ced362a6126cef5687c1c36dbca43678035", "original_sha256": "eaac6e20e04bcdb6415cbb7c44840ced362a6126cef5687c1c36dbca43678035"} -->
```json
{
 "title": "午夜上线 · a single-look short",
 "world": "studio",
 "fps": 24,
 "width": 1280,
 "height": 720,
 "screens": {
  "1": "comic",
  "2": "comic",
  "3": "comic",
  "4": "comic",
  "5": "comic",
  "6": "comic"
 },
 "shots": [
  {
   "id": "S01",
   "beat": "world",
   "story_function": "夜里的工作室，只有霓虹和显示器亮着；全片只有一个人还没走。",
   "duration": 5,
   "camera": "CAM_EST",
   "look": "comic",
   "mg": [
    {
     "kind": "title",
     "from": 0.6,
     "to": 4.6,
     "text": "23:58",
     "sub": "距离上线还有 2 分钟",
     "size": 96
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 5,
     "text": "午夜上线 · stop-motion-3d"
    }
   ]
  },
  {
   "id": "S02",
   "beat": "character",
   "story_function": "诺娃在敲键盘，耳机里是自己的节奏。",
   "duration": 5,
   "camera": "CAM_NOVA_FRONT",
   "look": "comic",
   "acting": [
    {
     "actor": "nova",
     "loop": "typing",
     "from": 0,
     "to": 3.2,
     "rate": 3
    },
    {
     "actor": "nova",
     "at": 3.6,
     "pose": "look_screen",
     "ease": "inOut"
    }
   ],
   "mg": [
    {
     "kind": "note",
     "from": 0.6,
     "to": 4.6,
     "text": "诺娃",
     "sub": "还差最后一个测试"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 5,
     "text": "午夜上线 · stop-motion-3d"
    }
   ]
  },
  {
   "id": "S03",
   "beat": "problem",
   "story_function": "过肩看到屏幕：一个红色失败。她往后一靠。",
   "duration": 4,
   "camera": "CAM_NOVA_OTS",
   "look": "comic",
   "acting": [
    {
     "actor": "nova",
     "at": 0.4,
     "pose": "point_screen",
     "ease": "inOut"
    },
    {
     "actor": "nova",
     "at": 1.8,
     "pose": "point_screen",
     "ease": "hold"
    },
    {
     "actor": "nova",
     "at": 2.3,
     "pose": "lean_back",
     "ease": "inOut"
    }
   ],
   "mg": [
    {
     "kind": "chip",
     "from": 0.3,
     "to": 4,
     "text": "127 / 128",
     "color": "#ff3fa4"
    },
    {
     "kind": "note",
     "from": 0.5,
     "to": 3.8,
     "text": "1 个测试失败",
     "sub": "只剩 90 秒"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4,
     "text": "午夜上线 · stop-motion-3d"
    }
   ]
  },
  {
   "id": "S04",
   "beat": "decision",
   "story_function": "她点头，决定不回滚，直接修。",
   "duration": 4,
   "camera": "CAM_NOVA_FRONT",
   "look": "comic",
   "acting": [
    {
     "actor": "nova",
     "loop": "nod",
     "from": 0,
     "to": 1.4
    },
    {
     "actor": "nova",
     "loop": "typing",
     "from": 1.6,
     "to": 4,
     "rate": 4
    }
   ],
   "mg": [
    {
     "kind": "note",
     "from": 0.4,
     "to": 3.8,
     "text": "不回滚",
     "sub": "修掉它"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4,
     "text": "午夜上线 · stop-motion-3d"
    }
   ]
  },
  {
   "id": "S05",
   "beat": "work",
   "story_function": "过肩：飞快地打字，屏幕在变。",
   "duration": 4,
   "camera": "CAM_NOVA_OTS",
   "look": "comic",
   "acting": [
    {
     "actor": "nova",
     "loop": "typing",
     "from": 0,
     "to": 4,
     "rate": 4.5
    }
   ],
   "mg": [
    {
     "kind": "mark",
     "from": 0,
     "to": 4,
     "text": "午夜上线 · stop-motion-3d"
    }
   ]
  },
  {
   "id": "S06",
   "beat": "turn",
   "story_function": "预备——按下回车。",
   "duration": 3,
   "camera": "CAM_NOVA_FRONT",
   "look": "comic",
   "acting": [
    {
     "actor": "nova",
     "at": 0.2,
     "pose": "look_screen",
     "ease": "inOut"
    },
    {
     "actor": "nova",
     "at": 1.0,
     "pose": "anticipate_enter",
     "ease": "inOut"
    },
    {
     "actor": "nova",
     "at": 1.6,
     "pose": "anticipate_enter",
     "ease": "hold"
    },
    {
     "actor": "nova",
     "at": 1.85,
     "pose": "hit_enter",
     "ease": "in"
    },
    {
     "actor": "nova",
     "at": 2.6,
     "pose": "hit_enter",
     "ease": "hold"
    }
   ],
   "mg": [
    {
     "kind": "mark",
     "from": 0,
     "to": 3,
     "text": "午夜上线 · stop-motion-3d"
    }
   ]
  },
  {
   "id": "S07",
   "beat": "result",
   "story_function": "全部通过。她握拳，工作室还是那么安静。",
   "duration": 5,
   "camera": "CAM_NOVA_FRONT",
   "look": "comic",
   "acting": [
    {
     "actor": "nova",
     "at": 0.5,
     "pose": "fist_pump",
     "ease": "out"
    },
    {
     "actor": "nova",
     "at": 1.6,
     "pose": "fist_pump",
     "ease": "hold"
    },
    {
     "actor": "nova",
     "at": 2.2,
     "pose": "lean_back",
     "ease": "inOut"
    }
   ],
   "mg": [
    {
     "kind": "title",
     "from": 1.0,
     "to": 5.0,
     "text": "128 / 128",
     "sub": "00:00 · 上线",
     "size": 96,
     "color": "#27e3ff",
     "panel": true,
     "y": 0.3
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 5,
     "text": "午夜上线 · stop-motion-3d"
    }
   ]
  }
 ]
}
```

### 4/55 · `stop-motion-3d/assets/template/package-lock.json`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/package-lock.json", "lines": 954, "final_newline": true, "sha256": "1d993854455b1b650ba3a1899b78870520e01d3cfef1a1c595fdffea75f50d59", "original_sha256": "1d993854455b1b650ba3a1899b78870520e01d3cfef1a1c595fdffea75f50d59"} -->
```json
{
  "name": "studio-promo",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "studio-promo",
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

### 5/55 · `stop-motion-3d/assets/template/package.json`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/package.json", "lines": 18, "final_newline": true, "sha256": "5c64db75533e281e144edf7bb35803d1ccb3803364e8cbc737a7d86e93a076ba", "original_sha256": "5c64db75533e281e144edf7bb35803d1ccb3803364e8cbc737a7d86e93a076ba"} -->
```json
{
  "name": "studio-promo",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "esbuild src/entry/film.ts --bundle --format=esm --outfile=web/dist/film.js --loader:.json=json && esbuild src/entry/sandbox.ts --bundle --format=esm --outfile=web/dist/sandbox.js --loader:.json=json",
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

### 6/55 · `stop-motion-3d/assets/template/scripts/capture.mjs`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/scripts/capture.mjs", "lines": 103, "final_newline": true, "sha256": "604eb5dee4df58fcf22111b20d9a706ea9728a054b4d943a587f9116cf9c15f2", "original_sha256": "604eb5dee4df58fcf22111b20d9a706ea9728a054b4d943a587f9116cf9c15f2"} -->
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

### 7/55 · `stop-motion-3d/assets/template/src/entry/film.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/entry/film.ts", "lines": 59, "final_newline": true, "sha256": "ed3b36b9ab715ba86147d2e611fab2dd3690603866df69290cf3d50921f5ebf1", "original_sha256": "ed3b36b9ab715ba86147d2e611fab2dd3690603866df69290cf3d50921f5ebf1"} -->
```ts
import { Film } from "../runtime/film";
import type { Episode, WorldManifest } from "../runtime/types";
import type { PoseSpec } from "../runtime/rig";
import { LOOKS } from "../looks";
import { PALETTE } from "../world/palette";
import { studioHooks } from "../world/hooks";
import { logoTexture } from "../world/backdrop";
import worldJson from "../world/world.json";
import episodeJson from "../episode/episode.json";
import posesJson from "../world/poses.json";

/**
 * Capture page. Exposes the render contract on window.film:
 *   ready   — resolves once fonts, world copies and monitor thumbnails exist
 *   frame(f) → JPEG data URL of frame f (WebGL plate + MG layer)
 *   inspect(f) → contact / penetration / pose-signature report (no pixels)
 *   meta()  → shots, frame ranges, events (for audio + QC scripts)
 */
declare global {
  interface Window { film: unknown }
}

const glCanvas = document.getElementById("gl") as HTMLCanvasElement;
const outCanvas = document.getElementById("out") as HTMLCanvasElement;

async function boot() {
  await document.fonts.load("800 40px 'Noto Sans CJK SC'");
  await document.fonts.load("500 20px 'Noto Sans CJK SC'");
  const world = worldJson as unknown as WorldManifest;
  const film = new Film({
    world,
    episode: episodeJson as unknown as Episode & { screens: Record<string, string> },
    looks: LOOKS,
    poses: posesJson as unknown as Record<string, PoseSpec>,
    palette: PALETTE,
    hooks: studioHooks(world),
    canvas: glCanvas,
    out: outCanvas,
    staticScreens: { 0: logoTexture() },
  });
  film.init();
  return film;
}

const ready = boot();
window.film = {
  ready: ready.then((f) => f.meta()),
  async frame(f: number, quality = 0.93) {
    const film = await ready;
    film.render(f);
    return outCanvas.toDataURL("image/jpeg", quality);
  },
  async inspect(f: number) {
    return (await ready).inspect(f);
  },
  async meta() {
    return (await ready).meta();
  },
};
```

### 8/55 · `stop-motion-3d/assets/template/src/entry/sandbox.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/entry/sandbox.ts", "lines": 132, "final_newline": true, "sha256": "daf9a6a75757570828eb6a2c677e8051014a42d9cb8ec5f5e7bf41970c74097f", "original_sha256": "daf9a6a75757570828eb6a2c677e8051014a42d9cb8ec5f5e7bf41970c74097f"} -->
```ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Film } from "../runtime/film";
import type { Episode, WorldManifest } from "../runtime/types";
import type { PoseSpec } from "../runtime/rig";
import { stateAt } from "../runtime/clock";
import { LOOKS } from "../looks";
import { PALETTE } from "../world/palette";
import { studioHooks } from "../world/hooks";
import { logoTexture } from "../world/backdrop";
import worldJson from "../world/world.json";
import episodeJson from "../episode/episode.json";
import posesJson from "../world/poses.json";

/**
 * SANDBOX VIEWER — the world on its own, before and outside any film:
 * free orbit around the real set, every named camera and mark as a gizmo, switch look pipelines
 * live, scrub the episode to see poses and the world state (continuity) at any frame.
 * Same Film runtime as the renderer, so what you inspect here is what renders.
 */
const world = worldJson as unknown as WorldManifest;
const episode = episodeJson as unknown as Episode & { screens: Record<string, string> };
const glCanvas = document.getElementById("gl") as HTMLCanvasElement;
const outCanvas = document.createElement("canvas");
const W = 1280, H = 720;

const film = new Film({
  world, episode, looks: LOOKS, poses: posesJson as unknown as Record<string, PoseSpec>, palette: PALETTE,
  hooks: studioHooks(world), canvas: glCanvas, out: outCanvas, staticScreens: { 0: logoTexture() },
});
film.init();

const ui = { look: "diorama", frame: 0, mode: "orbit" as "orbit" | "shot", gizmos: true, playing: false };
const orbitCam = new THREE.PerspectiveCamera(42, W / H, 0.05, 400);
orbitCam.position.set(9, 7.5, 11);
const controls = new OrbitControls(orbitCam, document.getElementById("stage")!);
controls.target.set(0, 1, -0.5);
controls.update();

// gizmos: named cameras (frustum lines) + marks (rings)
const gizmos = new THREE.Group();
for (const c of world.cameras) {
  const g = new THREE.Group();
  const from = new THREE.Vector3(...c.from.pos), tgt = new THREE.Vector3(...c.from.target);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.3), new THREE.MeshBasicMaterial({ color: "#66d9ff" }));
  body.position.copy(from);
  body.lookAt(tgt);
  g.add(body);
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, tgt]), new THREE.LineBasicMaterial({ color: "#66d9ff" })));
  if (c.to) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, new THREE.Vector3(...c.to.pos)]), new THREE.LineBasicMaterial({ color: "#ffcc33" })));
  g.userData.id = c.id;
  gizmos.add(g);
}
for (const m of Object.values(world.marks)) {
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.36, 24), new THREE.MeshBasicMaterial({ color: "#ff5c8a", side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(m.pos[0], 0.03, m.pos[2]);
  gizmos.add(ring);
}

function frameInfo() {
  const st = film.stage(ui.look);
  const time = film.timeAt(ui.frame, st.look);
  const shot = episode.shots[time.shotIndex];
  const state = stateAt(shot, film.starts[time.shotIndex], time.poseT);
  return { st, time, shot, state };
}

function draw() {
  const { st, time, shot, state } = frameInfo();
  film.poseActors(st, time.shotIndex, time.poseT);
  film.cfg.hooks.update(st.handles, state, shot, time);
  let cam = orbitCam;
  if (ui.mode === "shot") {
    film.render(ui.frame);
    const g = (glCanvas.getContext("webgl2") as WebGL2RenderingContext);
    void g;
  } else {
    film.cfg.hooks.beforeRender(st.handles, cam);
    if (ui.gizmos) st.scene.add(gizmos);
    st.look.post({ renderer: film.renderer, gbuf: film.gbuf, scene: st.scene, camera: cam, out: null, time, width: W, height: H });
    st.scene.remove(gizmos);
  }
  const panel = document.getElementById("state")!;
  panel.innerHTML = `<dt>frame</dt><dd>${ui.frame} / ${film.total - 1}</dd><dt>shot</dt><dd>${shot.id} · ${shot.camera}</dd>
    <dt>t / poseT</dt><dd>${time.t.toFixed(2)} / ${time.poseT.toFixed(3)}</dd>` +
    Object.entries(state).map(([k, v]) => `<dt>${k}</dt><dd class="${v && v !== "home" ? "on" : ""}">${v}</dd>`).join("");
  (document.getElementById("scrub") as HTMLInputElement).value = String(ui.frame);
}

function buildUI() {
  const looks = document.getElementById("looks")!;
  for (const [id, l] of Object.entries(LOOKS)) {
    const b = document.createElement("button");
    b.textContent = `${l.zh}`;
    b.title = l.blurb;
    b.onclick = () => { ui.look = id; sync(); };
    b.dataset.id = id;
    looks.appendChild(b);
  }
  const shots = document.getElementById("shots")!;
  episode.shots.forEach((s, i) => {
    const b = document.createElement("button");
    b.innerHTML = `<b>${s.id}</b><small>${s.look} · ${s.camera.replace("CAM_", "")}</small>`;
    b.onclick = () => { ui.frame = film.frameStarts[i]; ui.look = s.look; ui.mode = "shot"; sync(); };
    shots.appendChild(b);
  });
  const scrub = document.getElementById("scrub") as HTMLInputElement;
  scrub.max = String(film.total - 1);
  scrub.oninput = () => { ui.frame = Number(scrub.value); draw(); };
  document.getElementById("orbit")!.onclick = () => { ui.mode = "orbit"; sync(); };
  document.getElementById("shot")!.onclick = () => { ui.mode = "shot"; sync(); };
  document.getElementById("giz")!.onclick = () => { ui.gizmos = !ui.gizmos; sync(); };
  document.getElementById("play")!.onclick = () => { ui.playing = !ui.playing; sync(); };
}
function sync() {
  document.querySelectorAll<HTMLButtonElement>("#looks button").forEach((b) => b.classList.toggle("on", b.dataset.id === ui.look));
  document.getElementById("orbit")!.classList.toggle("on", ui.mode === "orbit");
  document.getElementById("shot")!.classList.toggle("on", ui.mode === "shot");
  document.getElementById("giz")!.classList.toggle("on", ui.gizmos);
  document.getElementById("play")!.textContent = ui.playing ? "❚❚" : "▶";
  draw();
}
buildUI();
sync();
controls.addEventListener("change", () => ui.mode === "orbit" && draw());
setInterval(() => {
  if (!ui.playing) return;
  ui.frame = (ui.frame + 1) % film.total;
  draw();
}, 1000 / 12);
(window as unknown as { sandbox: unknown }).sandbox = { film, ui, draw, sync };
```

### 9/55 · `stop-motion-3d/assets/template/src/episode/episode.json`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/episode/episode.json", "lines": 914, "final_newline": false, "sha256": "a2132d023b4c894ba9671cd8ba449bb5ae2e79fed91096e6a9f46dd89355b16e", "original_sha256": "a2132d023b4c894ba9671cd8ba449bb5ae2e79fed91096e6a9f46dd89355b16e"} -->
```json
{
 "title": "stop-motion-3d · skill intro",
 "world": "studio",
 "fps": 24,
 "width": 1280,
 "height": 720,
 "screens": {
  "1": "block",
  "2": "clay",
  "3": "vox",
  "4": "sketch",
  "5": "comic",
  "6": "watercolor"
 },
 "shots": [
  {
   "id": "S01",
   "beat": "world",
   "story_function": "Establish the sandbox: one loft, six developers, six monitors each already showing a different look.",
   "duration": 5.0,
   "camera": "CAM_EST",
   "look": "diorama",
   "mg": [
    {
     "kind": "title",
     "from": 0.5,
     "to": 4.7,
     "text": "stop-motion-3d",
     "sub": "一个沙盒世界 · 任意画风的 3D 定格动画",
     "size": 84,
     "y": 0.44
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 5.0
    }
   ]
  },
  {
   "id": "S02",
   "beat": "character",
   "story_function": "阿凯 works in the block look: the whole world re-renders in this style as we arrive.",
   "duration": 4.5,
   "camera": "CAM_KAI_FRONT",
   "look": "block",
   "transition": {
    "type": "wipe",
    "from": "diorama",
    "frames": 14
   },
   "acting": [
    {
     "actor": "kai",
     "loop": "typing",
     "from": 0,
     "to": 2.1,
     "rate": 3.5
    },
    {
     "actor": "kai",
     "at": 2.3,
     "pose": "look_screen",
     "ease": "inOut"
    },
    {
     "actor": "kai",
     "at": 3.2,
     "pose": "anticipate_enter",
     "ease": "inOut"
    }
   ],
   "events": [],
   "mg": [
    {
     "kind": "chip",
     "from": 0.3,
     "to": 4.5,
     "text": "01 / 06"
    },
    {
     "kind": "lower",
     "from": 0.55,
     "to": 4.35,
     "text": "方块世界",
     "sub": "Block · pixel textures · on twos",
     "tags": "几何量化为方块 · 16px 像素贴图"
    },
    {
     "kind": "note",
     "from": 0.9,
     "to": 4.3,
     "text": "阿凯",
     "sub": "敲代码 → 准备按下回车"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4.5
    }
   ]
  },
  {
   "id": "S03",
   "beat": "character",
   "story_function": "Over-the-shoulder: 阿凯's action lands; the monitor shows the block render. Explains one skill principle.",
   "duration": 3.0,
   "camera": "CAM_KAI_OTS",
   "look": "block",
   "acting": [
    {
     "actor": "kai",
     "at": 0,
     "pose": "anticipate_enter",
     "ease": "hold"
    },
    {
     "actor": "kai",
     "at": 0.33,
     "pose": "hit_enter",
     "ease": "in"
    },
    {
     "actor": "kai",
     "at": 0.83,
     "pose": "hit_enter",
     "ease": "hold"
    },
    {
     "actor": "kai",
     "at": 1.33,
     "pose": "cheer",
     "ease": "out"
    },
    {
     "actor": "kai",
     "at": 1.92,
     "pose": "cheer_b",
     "ease": "inOut"
    },
    {
     "actor": "kai",
     "at": 2.5,
     "pose": "cheer",
     "ease": "inOut"
    }
   ],
   "events": [],
   "mg": [
    {
     "kind": "chip",
     "from": 0,
     "to": 3.0,
     "text": "01 / 06",
     "fade": 0.01
    },
    {
     "kind": "note",
     "from": 0.25,
     "to": 2.85,
     "text": "同一个沙盒 · 同一套命名机位",
     "sub": "回车 = 用新画风重渲整个世界"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 3.0
    }
   ]
  },
  {
   "id": "S04",
   "beat": "opportunity",
   "story_function": "米娅 works in the clay look: the whole world re-renders in this style as we arrive.",
   "duration": 4.5,
   "camera": "CAM_MIA_FRONT",
   "look": "clay",
   "transition": {
    "type": "wipe",
    "from": "block",
    "frames": 14
   },
   "acting": [
    {
     "actor": "mia",
     "loop": "typing",
     "from": 0,
     "to": 1.2,
     "rate": 3
    },
    {
     "actor": "mia",
     "at": 1.92,
     "pose": "reach_mug",
     "ease": "inOut"
    },
    {
     "actor": "mia",
     "at": 2.25,
     "pose": "reach_mug",
     "ease": "hold"
    },
    {
     "actor": "mia",
     "at": 3.0,
     "pose": "hold_mug",
     "ease": "inOut"
    },
    {
     "actor": "mia",
     "at": 3.83,
     "pose": "sip",
     "ease": "inOut"
    }
   ],
   "events": [
    {
     "t": 2.0,
     "set": {
      "hold.mug": "mia.R"
     }
    }
   ],
   "mg": [
    {
     "kind": "chip",
     "from": 0.3,
     "to": 4.5,
     "text": "02 / 06"
    },
    {
     "kind": "lower",
     "from": 0.55,
     "to": 4.35,
     "text": "黏土定格",
     "sub": "Clay · rounded lumps · on threes",
     "tags": "圆角泥块 · 指纹凹凸 · 暖光"
    },
    {
     "kind": "note",
     "from": 0.9,
     "to": 4.3,
     "text": "米娅",
     "sub": "伸手拿起咖啡"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4.5
    }
   ]
  },
  {
   "id": "S05",
   "beat": "opportunity",
   "story_function": "Over-the-shoulder: 米娅's action lands; the monitor shows the clay render. Explains one skill principle.",
   "duration": 3.0,
   "camera": "CAM_MIA_OTS",
   "look": "clay",
   "acting": [
    {
     "actor": "mia",
     "at": 0,
     "pose": "sip",
     "ease": "hold"
    },
    {
     "actor": "mia",
     "at": 0.75,
     "pose": "content",
     "ease": "inOut"
    },
    {
     "actor": "mia",
     "at": 1.5,
     "pose": "reach_mug",
     "ease": "inOut"
    },
    {
     "actor": "mia",
     "at": 2.0,
     "pose": "reach_mug",
     "ease": "hold"
    },
    {
     "actor": "mia",
     "at": 2.5,
     "pose": "look_screen",
     "ease": "inOut"
    }
   ],
   "events": [
    {
     "t": 2.0,
     "set": {
      "hold.mug": "home"
     }
    }
   ],
   "mg": [
    {
     "kind": "chip",
     "from": 0,
     "to": 3.0,
     "text": "02 / 06",
     "fade": 0.01
    },
    {
     "kind": "note",
     "from": 0.25,
     "to": 2.85,
     "text": "道具有状态",
     "sub": "杯子拿起 → 啜一口 → 放回杯垫"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 3.0
    }
   ]
  },
  {
   "id": "S06",
   "beat": "decision",
   "story_function": "李奥 works in the vox look: the whole world re-renders in this style as we arrive.",
   "duration": 4.5,
   "camera": "CAM_LEO_FRONT",
   "look": "vox",
   "transition": {
    "type": "wipe",
    "from": "clay",
    "frames": 14
   },
   "acting": [
    {
     "actor": "leo",
     "loop": "typing",
     "from": 0,
     "to": 1.0,
     "rate": 3
    },
    {
     "actor": "leo",
     "at": 1.67,
     "pose": "reach_sheet",
     "ease": "inOut"
    },
    {
     "actor": "leo",
     "at": 2.0,
     "pose": "reach_sheet",
     "ease": "hold"
    },
    {
     "actor": "leo",
     "at": 2.83,
     "pose": "show_sheet",
     "ease": "inOut"
    },
    {
     "actor": "leo",
     "at": 3.67,
     "pose": "study_sheet",
     "ease": "inOut"
    }
   ],
   "events": [
    {
     "t": 2.0,
     "set": {
      "hold.sheet": "leo.R"
     }
    }
   ],
   "mg": [
    {
     "kind": "chip",
     "from": 0.3,
     "to": 4.5,
     "text": "03 / 06"
    },
    {
     "kind": "lower",
     "from": 0.55,
     "to": 4.35,
     "text": "Vox 纸片拼贴",
     "sub": "Paper collage · halftone · cut-out",
     "tags": "平涂色块 · 网点 · 纸边投影"
    },
    {
     "kind": "note",
     "from": 0.9,
     "to": 4.3,
     "text": "李奥",
     "sub": "抽出一张拼贴稿"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4.5
    }
   ]
  },
  {
   "id": "S07",
   "beat": "decision",
   "story_function": "Over-the-shoulder: 李奥's action lands; the monitor shows the vox render. Explains one skill principle.",
   "duration": 3.0,
   "camera": "CAM_LEO_OTS",
   "look": "vox",
   "acting": [
    {
     "actor": "leo",
     "at": 0,
     "pose": "study_sheet",
     "ease": "hold"
    },
    {
     "actor": "leo",
     "at": 0.75,
     "pose": "show_sheet",
     "ease": "inOut"
    },
    {
     "actor": "leo",
     "at": 1.58,
     "pose": "reach_sheet",
     "ease": "inOut"
    },
    {
     "actor": "leo",
     "at": 2.0,
     "pose": "reach_sheet",
     "ease": "hold"
    },
    {
     "actor": "leo",
     "at": 2.5,
     "pose": "look_screen",
     "ease": "inOut"
    }
   ],
   "events": [
    {
     "t": 2.0,
     "set": {
      "hold.sheet": "home"
     }
    }
   ],
   "mg": [
    {
     "kind": "chip",
     "from": 0,
     "to": 3.0,
     "text": "03 / 06",
     "fade": 0.01
    },
    {
     "kind": "note",
     "from": 0.25,
     "to": 2.85,
     "text": "画风 = 渲染管线，不是换皮",
     "sub": "几何 · 着色 · 后期 · 节奏 一起换"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 3.0
    }
   ]
  },
  {
   "id": "S08",
   "beat": "work",
   "story_function": "小雨 works in the sketch look: the whole world re-renders in this style as we arrive.",
   "duration": 4.5,
   "camera": "CAM_YU_FRONT",
   "look": "sketch",
   "transition": {
    "type": "wipe",
    "from": "vox",
    "frames": 14
   },
   "acting": [
    {
     "actor": "yu",
     "loop": "draw",
     "from": 0,
     "to": 3.0,
     "rate": 4
    },
    {
     "actor": "yu",
     "at": 3.5,
     "pose": "think",
     "ease": "inOut"
    }
   ],
   "events": [],
   "mg": [
    {
     "kind": "chip",
     "from": 0.3,
     "to": 4.5,
     "text": "04 / 06"
    },
    {
     "kind": "lower",
     "from": 0.55,
     "to": 4.35,
     "text": "手绘线稿",
     "sub": "Hand-drawn · boiling lines · on twos",
     "tags": "铅笔线每拍抖动 · 排线阴影"
    },
    {
     "kind": "note",
     "from": 0.9,
     "to": 4.3,
     "text": "小雨",
     "sub": "在数位板上画分镜"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4.5
    }
   ]
  },
  {
   "id": "S09",
   "beat": "work",
   "story_function": "Over-the-shoulder: 小雨's action lands; the monitor shows the sketch render. Explains one skill principle.",
   "duration": 3.0,
   "camera": "CAM_YU_OTS",
   "look": "sketch",
   "acting": [
    {
     "actor": "yu",
     "loop": "draw",
     "from": 0,
     "to": 1.75,
     "rate": 4
    },
    {
     "actor": "yu",
     "at": 2.0,
     "pose": "tap",
     "ease": "in"
    },
    {
     "actor": "yu",
     "at": 2.62,
     "pose": "admire",
     "ease": "inOut"
    }
   ],
   "events": [],
   "mg": [
    {
     "kind": "chip",
     "from": 0,
     "to": 3.0,
     "text": "04 / 06",
     "fade": 0.01
    },
    {
     "kind": "note",
     "from": 0.25,
     "to": 2.85,
     "text": "线条每一拍重新抖动",
     "sub": "手绘的“呼吸感”来自阶梯时钟"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 3.0
    }
   ]
  },
  {
   "id": "S10",
   "beat": "turn",
   "story_function": "诺娃 works in the comic look: the whole world re-renders in this style as we arrive.",
   "duration": 4.5,
   "camera": "CAM_NOVA_FRONT",
   "look": "comic",
   "transition": {
    "type": "wipe",
    "from": "sketch",
    "frames": 14
   },
   "acting": [
    {
     "actor": "nova",
     "loop": "nod",
     "from": 0,
     "to": 2.5,
     "rate": 2.4
    },
    {
     "actor": "nova",
     "at": 3.0,
     "pose": "point_screen",
     "ease": "inOut"
    }
   ],
   "events": [],
   "mg": [
    {
     "kind": "chip",
     "from": 0.3,
     "to": 4.5,
     "text": "05 / 06"
    },
    {
     "kind": "lower",
     "from": 0.55,
     "to": 4.35,
     "text": "赛博漫画",
     "sub": "Cyberpunk comic · ink + neon · night variant",
     "tags": "墨线 · 网点 · 霓虹夜景"
    },
    {
     "kind": "note",
     "from": 0.9,
     "to": 4.3,
     "text": "诺娃",
     "sub": "戴着耳机跟着节拍"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4.5
    }
   ]
  },
  {
   "id": "S11",
   "beat": "turn",
   "story_function": "Over-the-shoulder: 诺娃's action lands; the monitor shows the comic render. Explains one skill principle.",
   "duration": 3.0,
   "camera": "CAM_NOVA_OTS",
   "look": "comic",
   "acting": [
    {
     "actor": "nova",
     "at": 0,
     "pose": "point_screen",
     "ease": "hold"
    },
    {
     "actor": "nova",
     "at": 0.67,
     "pose": "lean_back",
     "ease": "inOut"
    },
    {
     "actor": "nova",
     "loop": "nod",
     "from": 1.0,
     "to": 2.0,
     "rate": 2.4
    },
    {
     "actor": "nova",
     "at": 2.17,
     "pose": "fist_pump",
     "ease": "out"
    }
   ],
   "events": [],
   "mg": [
    {
     "kind": "chip",
     "from": 0,
     "to": 3.0,
     "text": "05 / 06",
     "fade": 0.01
    },
    {
     "kind": "note",
     "from": 0.25,
     "to": 2.85,
     "text": "同一场景的夜景变体",
     "sub": "灯光是状态，不用重新建模"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 3.0
    }
   ]
  },
  {
   "id": "S12",
   "beat": "result",
   "story_function": "琳 works in the watercolor look: the whole world re-renders in this style as we arrive.",
   "duration": 4.5,
   "camera": "CAM_RIN_FRONT",
   "look": "watercolor",
   "transition": {
    "type": "wipe",
    "from": "comic",
    "frames": 14
   },
   "acting": [
    {
     "actor": "rin",
     "loop": "typing",
     "from": 0,
     "to": 0.8,
     "rate": 3
    },
    {
     "actor": "rin",
     "at": 1.5,
     "pose": "reach_can",
     "ease": "inOut"
    },
    {
     "actor": "rin",
     "at": 1.83,
     "pose": "reach_can",
     "ease": "hold"
    },
    {
     "actor": "rin",
     "at": 2.67,
     "pose": "lift_can",
     "ease": "inOut"
    },
    {
     "actor": "rin",
     "at": 3.33,
     "pose": "pour",
     "ease": "inOut"
    }
   ],
   "events": [
    {
     "t": 1.83,
     "set": {
      "hold.can": "rin.R"
     }
    },
    {
     "t": 3.33,
     "set": {
      "rin.pour": true
     }
    }
   ],
   "mg": [
    {
     "kind": "chip",
     "from": 0.3,
     "to": 4.5,
     "text": "06 / 06"
    },
    {
     "kind": "lower",
     "from": 0.55,
     "to": 4.35,
     "text": "水彩晕染",
     "sub": "Watercolor · washes · pigment edges",
     "tags": "颜料边缘沉积 · 纸纹颗粒"
    },
    {
     "kind": "note",
     "from": 0.9,
     "to": 4.3,
     "text": "琳",
     "sub": "拿起小水壶"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 4.5
    }
   ]
  },
  {
   "id": "S13",
   "beat": "result",
   "story_function": "Over-the-shoulder: 琳's action lands; the monitor shows the watercolor render. Explains one skill principle.",
   "duration": 3.0,
   "camera": "CAM_RIN_OTS",
   "look": "watercolor",
   "acting": [
    {
     "actor": "rin",
     "at": 0,
     "pose": "pour",
     "ease": "hold"
    },
    {
     "actor": "rin",
     "at": 2.08,
     "pose": "lift_can",
     "ease": "inOut"
    },
    {
     "actor": "rin",
     "at": 2.67,
     "pose": "admire_can",
     "ease": "inOut"
    }
   ],
   "events": [
    {
     "t": 1.17,
     "set": {
      "plant.watered": true
     }
    },
    {
     "t": 1.83,
     "set": {
      "rin.pour": false
     }
    }
   ],
   "mg": [
    {
     "kind": "chip",
     "from": 0,
     "to": 3.0,
     "text": "06 / 06",
     "fade": 0.01
    },
    {
     "kind": "note",
     "from": 0.25,
     "to": 2.85,
     "text": "状态跨镜头延续",
     "sub": "浇过水的植物，之后一直是抬头的"
    },
    {
     "kind": "mark",
     "from": 0,
     "to": 3.0
    }
   ]
  },
  {
   "id": "S14",
   "beat": "echo",
   "story_function": "Pull back to the whole set: the same world, split into all six looks side by side.",
   "duration": 10.0,
   "camera": "CAM_END",
   "look": "diorama",
   "state": {
    "hold.mug": "home",
    "hold.sheet": "home",
    "hold.can": "home",
    "rin.pour": false
   },
   "transition": {
    "type": "wipe",
    "from": "watercolor",
    "frames": 14
   },
   "bands": {
    "looks": [
     "block",
     "clay",
     "vox",
     "sketch",
     "comic",
     "watercolor"
    ],
    "start": 0.9,
    "stagger": 0.45
   },
   "mg": [
    {
     "kind": "bandLabels",
     "from": 1.0,
     "to": 6.2,
     "labels": [
      "方块",
      "黏土",
      "纸片拼贴",
      "手绘",
      "赛博漫画",
      "水彩"
     ]
    },
    {
     "kind": "title",
     "from": 6.3,
     "to": 10.0,
     "text": "搭一次世界，拍任何画风",
     "sub": "沙盒优先 · 场景与道具复用 · 画风即渲染管线",
     "size": 66,
     "y": 0.44,
     "fade": 0.5,
     "panel": true
    },
    {
     "kind": "title",
     "from": 7.2,
     "to": 10.0,
     "text": "stop-motion-3d  ·  a Claude skill",
     "size": 30,
     "y": 0.61,
     "color": "#f2c14e",
     "fade": 0.5
    }
   ]
  }
 ]
}
```

### 10/55 · `stop-motion-3d/assets/template/src/looks/block.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/block.ts", "lines": 60, "final_newline": true, "sha256": "eae8c9c3712cce6a4a1e8da6290ae59fddb3f25f7f8414d6dc5d696bb6c2a183", "original_sha256": "eae8c9c3712cce6a4a1e8da6290ae59fddb3f25f7f8414d6dc5d696bb6c2a183"} -->
```ts
import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * BLOCK — block-world grammar: every primitive becomes a cuboid (cylinders and spheres turn
 * square), 16 px pixel-art textures at one world density (1 texel ≈ 3 cm), nearest filtering,
 * Lambert shading with hard-ish sun shadows. Original textures only — never official game assets.
 */
let pass: Pass | null = null;
const family = (kind: string) =>
  kind === "floor" || kind === "wood" || kind === "woodDark" || kind === "cork" ? "planks"
  : kind === "brick" ? "brick"
  : kind === "plant" || kind === "plantDark" ? "leaf"
  : "noise";

export const block: LookDef = {
  id: "block",
  label: "Block",
  zh: "方块世界",
  blurb: "Everything is a cuboid with 16px pixel-art textures; puppets are six blocks — the classic block-game grammar.",
  tags: "cuboid geometry · 16px textures · on twos",
  poseFps: 12,
  variant: "day",
  accent: "#57b36a",
  uvUnit: 0.48,
  geometry: {
    cyl: (rt, rb, h) => new THREE.BoxGeometry(2 * Math.max(rt, rb), h, 2 * Math.max(rt, rb)),
    sphere: (r) => new THREE.BoxGeometry(2 * r, 2 * r, 2 * r),
  },
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) {
      if ((sp as THREE.MeshBasicMaterial).map && (sem.kind === "screen" || sem.kind === "tv")) return sp;
      return sp;
    }
    const c = grade(sem.hex, { mulS: 1.12 });
    return new THREE.MeshLambertMaterial({ color: c, map: TEX.pixel(family(sem.kind)) });
  },
  setup(scene, ctx) {
    scene.background = new THREE.Color("#9cc9ee");
    standardLights(ctx, { sun: 3.0, hemi: 1.05, bounce: 0.8, beams: 0.06 });
    ctx.handles.sun.shadow.radius = 1;
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      void main(){
        vec3 c = colorAA(vUv);
        c = toSRGB(aces(c * 1.08));
        c = mix(vec3(luma(c)), c, 1.08);
        c = vignette(c, vUv, .3);
        gl_FragColor = vec4(c, 1.);
      }`);
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
```

### 11/55 · `stop-motion-3d/assets/template/src/looks/clay.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/clay.ts", "lines": 75, "final_newline": true, "sha256": "9393fdb1aaa04b816ed59b4e99b0c6c4a45a89e88229484ef5117a422f856477", "original_sha256": "9393fdb1aaa04b816ed59b4e99b0c6c4a45a89e88229484ef5117a422f856477"} -->
```ts
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * CLAY — plasticine stop-motion: every box is a soft rounded lump, surfaces carry fingerprint
 * bumps, colors are saturated and warm, light is a soft studio key, the depth of field is shallow
 * like a miniature set, and puppets move on threes (8 poses/s).
 */
let pass: Pass | null = null;

export const clay: LookDef = {
  id: "clay",
  label: "Clay",
  zh: "黏土定格",
  blurb: "Plasticine stop-motion: rounded lumps, fingerprint texture, warm soft light, shallow miniature focus, on threes.",
  tags: "rounded lumps · fingerprints · on threes",
  poseFps: 8,
  variant: "day",
  accent: "#e3a33a",
  uvUnit: 0.35,
  geometry: {
    box: (w, h, d) => {
      const m = Math.min(w, h, d);
      return m < 0.01 ? new THREE.BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, 3, Math.min(0.07, m * 0.32));
    },
    cyl: (rt, rb, h, seg) => new THREE.CylinderGeometry(rt, rb, h, Math.max(seg, 16), 2),
    sphere: (r) => new THREE.SphereGeometry(r, 16, 12),
  },
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    const c = grade(sem.hex, { mulS: 1.05, light: 0.02 });
    return new THREE.MeshStandardMaterial({ color: c, roughness: 0.62, metalness: 0, bumpMap: TEX.clayBump(), bumpScale: 1.4 });
  },
  setup(scene, ctx) {
    scene.background = new THREE.Color("#e9dccb");
    standardLights(ctx, { sun: 2.4, hemi: 1.25, bounce: 1.05, beams: 0.04, warm: "#ffe6c8" });
    ctx.handles.hemi.color.set("#fff1dc");
    ctx.handles.sun.shadow.radius = 6;
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform float uFocus;
      void main(){
        float d = linDepth(vUv);
        float coc = clamp(abs(d - uFocus) / d * 4., 0., 1.) * 3.;   // miniature-set shallow focus
        vec3 acc = colorAA(vUv); float w = 1.;
        for (int i = 0; i < 8; i++){
          float a = float(i) * .785398; vec2 o = vec2(cos(a), sin(a)) * coc / uRes;
          acc += texture2D(tColor, vUv + o).rgb; w += 1.;
        }
        vec3 c = acc / w;
        c = toSRGB(aces(c * 1.05));
        c = mix(c, c * vec3(1.04, 1., .94), .5);                       // warm grade
        c = vignette(c, vUv, .45);
        gl_FragColor = vec4(c, 1.);
      }`, { uFocus: { value: 3 } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    const fwd = new THREE.Vector3();
    c.camera.getWorldDirection(fwd);
    pass.u.uFocus.value = focusDistance(c.camera);
    pass.run(c.renderer, c.out);
  },
};

/** focus on whatever the camera aims at (its target, stored by the runtime) */
export function focusDistance(cam: THREE.PerspectiveCamera) {
  return (cam.userData.focus as number) ?? 3;
}
```

### 12/55 · `stop-motion-3d/assets/template/src/looks/comic.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/comic.ts", "lines": 72, "final_newline": true, "sha256": "f1c1326ab5851aca5e2182997d4dfdcbf3f6e451b47da50e3dd35d7449df5969", "original_sha256": "f1c1326ab5851aca5e2182997d4dfdcbf3f6e451b47da50e3dd35d7449df5969"} -->
```ts
import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights, toonRamp } from "./common";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * COMIC — cyberpunk comic panel: the SAME studio at night (night variant = practical neon, desk
 * lamps and monitors are the only light), 3-tone cel shading, heavy ink contours, magenta/cyan
 * halftone in the midtones and neon glow bleeding off every practical.
 */
let pass: Pass | null = null;

export const comic: LookDef = {
  id: "comic",
  label: "Cyberpunk comic",
  zh: "赛博漫画",
  blurb: "Night variant of the same set: neon practicals, 3-tone cel shading, heavy ink, halftone midtones, neon glow.",
  tags: "night variant · ink · halftone · neon",
  poseFps: 12,
  variant: "night",
  accent: "#ff3fa4",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "night", { neonBoost: 3 });
    if (sp) return sp;
    return new THREE.MeshToonMaterial({ color: grade(sem.hex, { mulS: 1.3, mulL: 0.95 }), gradientMap: toonRamp([40, 140, 255]) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#0c0b1c");
    standardLights(ctx, {});
    ctx.handles.hemi.intensity = 0.55;
    ctx.handles.bounce.intensity = 0.25;
    ctx.handles.bounce.color.set("#7b5cff");
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      void main(){
        vec2 px = 1. / uRes;
        vec3 lin = texture2D(tColor, vUv).rgb;
        vec3 c = toSRGB(aces(lin * 1.35));
        // neon glow: bright pixels bleed (two rings)
        vec3 glow = vec3(0.);
        for (int i = 0; i < 8; i++){
          float a = float(i) * .785398;
          vec2 o = vec2(cos(a), sin(a));
          vec3 s1 = toSRGB(aces(texture2D(tColor, vUv + o * 7. * px).rgb * 1.35));
          vec3 s2 = toSRGB(aces(texture2D(tColor, vUv + o * 18. * px).rgb * 1.35));
          glow += max(s1 - .72, 0.) * .5 + max(s2 - .72, 0.) * .3;
        }
        c += glow * .45;
        float l = luma(c);
        // grade: shadows to indigo, lifts to magenta/cyan
        c = mix(vec3(.05, .04, .13), c, smoothstep(0., .5, l) * .85 + .15);
        c = mix(vec3(l), c, 1.25);
        // halftone in the midtones
        vec2 g = mat2(.8, -.6, .6, .8) * (vUv * uRes) / 6.;
        float dotR = (1. - smoothstep(.15, .7, l)) * smoothstep(.02, .15, l) * .5;
        float ht = 1. - smoothstep(dotR - .07, dotR + .07, length(fract(g) - .5));
        c = mix(c, c * vec3(.55, .35, .8), ht * .6);
        // heavy ink
        float e = max(edgeDN(vUv, 2., .04, .3, vec2(0.)), edgeC(vUv, 1.5, .18) * .6);
        c = mix(c, vec3(.02, .02, .05), clamp(e, 0., 1.));
        c = vignette(c, vUv, .6);
        gl_FragColor = vec4(c, 1.);
      }`);
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
```

### 13/55 · `stop-motion-3d/assets/template/src/looks/common.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/common.ts", "lines": 78, "final_newline": true, "sha256": "f788934c8d1f91a6b782c64bc5c18117bb0e33175700b24c84802bd549691e9d", "original_sha256": "f788934c8d1f91a6b782c64bc5c18117bb0e33175700b24c84802bd549691e9d"} -->
```ts
import * as THREE from "three";
import type { Sem, SetupCtx } from "./types";
import { screenTexture } from "./screens";
import { cityBackdrop } from "../world/backdrop";

/** Materials every look shares the logic of: screens, glass, backdrop, neon, lamp glow. */
export function specialMaterial(sem: Sem, variant: "day" | "night", o: { toon?: THREE.Texture; neonBoost?: number } = {}): THREE.Material | null {
  switch (sem.kind) {
    case "screen":
    case "tv":
      return new THREE.MeshBasicMaterial({ map: screenTexture(sem.screen ?? Number(sem.key.split(":")[1] ?? 0)), toneMapped: false });
    case "backdrop":
      return new THREE.MeshBasicMaterial({ map: cityBackdrop(variant), fog: false, toneMapped: false });
    case "glass": {
      const m = new THREE.MeshBasicMaterial({ color: variant === "night" ? "#1a2040" : "#dff0ff", transparent: true, opacity: variant === "night" ? 0.25 : 0.12, depthWrite: false });
      return m;
    }
    case "neon": {
      const c = new THREE.Color(sem.hex).multiplyScalar(variant === "night" ? (o.neonBoost ?? 2.4) : 0.9);
      return new THREE.MeshBasicMaterial({ color: c });
    }
    case "glow":
      return new THREE.MeshBasicMaterial({ color: new THREE.Color(sem.hex).multiplyScalar(variant === "night" ? 3 : 1.1) });
  }
  return null;
}

export const ROUGH: Record<string, number> = {
  metal: 0.45, metalDark: 0.5, plasticDark: 0.55, plasticLight: 0.5, ceramic: 0.35, glass: 0.1, rubber: 0.9,
};
export const METAL: Record<string, number> = { metal: 0.6, metalDark: 0.4 };

/** Day/night key light setup shared by the lit (non-flat) looks. */
export function standardLights(ctx: SetupCtx, o: { sun?: number; hemi?: number; bounce?: number; beams?: number; warm?: string } = {}) {
  const h = ctx.handles;
  const night = ctx.variant === "night";
  h.sun.intensity = night ? 0 : o.sun ?? 3.2;
  h.sun.color.set(o.warm ?? "#fff0d4");
  h.hemi.intensity = night ? 0.25 : o.hemi ?? 1.0;
  h.hemi.color.set(night ? "#6a5cff" : "#dfe9f5");
  h.hemi.groundColor.set(night ? "#1a1024" : "#8a6a50");
  h.bounce.intensity = night ? 0.15 : o.bounce ?? 0.6;
  for (const b of h.beams) {
    b.visible = !night && (o.beams ?? 0.1) > 0;
    ((b as THREE.Mesh).material as THREE.ShaderMaterial).uniforms.uStrength.value = o.beams ?? 0.1;
  }
  // practicals that are off are REMOVED from lighting (each point light costs every pixel)
  for (const l of h.practicals.lamps) { l.intensity = 1.6; l.visible = night; }
  for (const l of h.practicals.neon) { l.intensity = 3.5; l.visible = night; }
  for (const l of h.practicals.pendants) { l.intensity = 4; l.visible = night; }
}

/** Re-grade a semantic color for a look (HSL offsets, clamped). */
export function grade(hex: string, o: { sat?: number; light?: number; hue?: number; mulS?: number; mulL?: number } = {}) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  hsl.h = (hsl.h + (o.hue ?? 0) + 1) % 1;
  hsl.s = Math.min(1, Math.max(0, hsl.s * (o.mulS ?? 1) + (o.sat ?? 0)));
  hsl.l = Math.min(1, Math.max(0, hsl.l * (o.mulL ?? 1) + (o.light ?? 0)));
  return new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
}

/** Stepped toon ramp (N bands) for MeshToonMaterial. */
const ramps = new Map<string, THREE.DataTexture>();
export function toonRamp(levels: number[]) {
  const key = levels.join(",");
  let t = ramps.get(key);
  if (!t) {
    const data = new Uint8Array(levels.length * 4);
    levels.forEach((v, i) => data.set([v, v, v, 255], i * 4));
    t = new THREE.DataTexture(data, levels.length, 1);
    t.magFilter = t.minFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    ramps.set(key, t);
  }
  return t;
}
```

### 14/55 · `stop-motion-3d/assets/template/src/looks/diorama.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/diorama.ts", "lines": 73, "final_newline": true, "sha256": "b554393697dfba8940c5d9e674c928f05b08d93f21287772c1f3dd4a9d5a8622", "original_sha256": "b554393697dfba8940c5d9e674c928f05b08d93f21287772c1f3dd4a9d5a8622"} -->
```ts
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { LookDef } from "./types";
import { METAL, ROUGH, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * DIORAMA — the sandbox "as built": a physically lit miniature set. Bevelled edges catch light,
 * procedural wood/brick/plaster, sun through the windows, soft shadows, screen-space AO.
 * This is the neutral look used to judge the world itself (look-lock of the SET).
 */
let pass: Pass | null = null;

export const diorama: LookDef = {
  id: "diorama",
  label: "Diorama",
  zh: "微缩沙盘",
  blurb: "The sandbox as built: physically lit miniature set, bevelled edges, soft sun and AO.",
  tags: "PBR · soft shadows · SSAO",
  poseFps: 12,
  variant: "day",
  accent: "#f2c14e",
  uvUnit: 1.2,
  geometry: {
    box: (w, h, d) => (Math.min(w, h, d) > 0.03 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(0.012, Math.min(w, h, d) * 0.2)) : new THREE.BoxGeometry(w, h, d)),
  },
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    const map =
      sem.kind === "floor" || sem.kind === "wood" || sem.kind === "woodDark" ? TEX.planks()
      : sem.kind === "brick" ? TEX.brick()
      : sem.kind === "plaster" ? TEX.plaster()
      : sem.kind === "fabric" || sem.kind === "cloth" ? TEX.fabric()
      : null;
    return new THREE.MeshStandardMaterial({
      color: sem.hex, map, roughness: ROUGH[sem.kind] ?? 0.78, metalness: METAL[sem.kind] ?? 0,
    });
  },
  setup(scene, ctx) {
    scene.background = new THREE.Color("#cfe3f2");
    standardLights(ctx, { sun: 3.4, hemi: 0.85, bounce: 0.95, beams: 0.09 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform float uAO;
      float ao(vec2 uv){
        float d = linDepth(uv); vec3 n = nrm(uv); float occ = 0.;
        float rad = clamp(22. / d, 3., 26.);
        for (int i = 0; i < 8; i++){
          float a = float(i) * 2.39996 + hash12(uv*uRes)*6.28; float rr = rad * (float(i)+1.)/8.;
          vec2 o = vec2(cos(a), sin(a)) * rr / uRes;
          float dd = d - linDepth(uv + o);
          occ += smoothstep(.02, .25, dd) * (1. - smoothstep(.25, 1.2, dd));
        }
        return 1. - occ / 8. * .55;
      }
      void main(){
        vec3 c = colorAA(vUv);
        if (!isSky(vUv)) c *= mix(1., ao(vUv), uAO);
        c = toSRGB(aces(c * 1.05));
        c = vignette(c, vUv, .38);
        c += (hash12(vUv*uRes + uFrame) - .5) * .018;
        gl_FragColor = vec4(c, 1.);
      }`, { uAO: { value: 1 } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.u.uAO.value = (globalThis as any).__ao ?? 1;
    pass.run(c.renderer, c.out);
  },
};
```

### 15/55 · `stop-motion-3d/assets/template/src/looks/index.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/index.ts", "lines": 11, "final_newline": true, "sha256": "30c3c9871db2f80ffbef98455705cf38435cb7d42886b1612ca7bb5f394b6193", "original_sha256": "30c3c9871db2f80ffbef98455705cf38435cb7d42886b1612ca7bb5f394b6193"} -->
```ts
import type { LookDef } from "./types";
import { diorama } from "./diorama";
import { block } from "./block";
import { clay } from "./clay";
import { vox } from "./vox";
import { sketch } from "./sketch";
import { comic } from "./comic";
import { watercolor } from "./watercolor";

/** Look registry. A shot picks one with "look": "<id>". Each look is a full rendering pipeline. */
export const LOOKS: Record<string, LookDef> = { diorama, block, clay, vox, sketch, comic, watercolor };
```

### 16/55 · `stop-motion-3d/assets/template/src/looks/prims.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/prims.ts", "lines": 77, "final_newline": true, "sha256": "a20b77d18320b59da484acc023bff0918c49672515409c778357eed67c2fd5c2", "original_sha256": "a20b77d18320b59da484acc023bff0918c49672515409c778357eed67c2fd5c2"} -->
```ts
import * as THREE from "three";
import type { LookDef, PrimOpts, Prims, Sem } from "./types";

/** World-level registry filled while building one look's copy of the world. */
export interface BuildRegistry {
  colliders: THREE.Mesh[];
  screens: THREE.Mesh[];
}

export const EMISSIVE_KINDS = new Set(["screen", "neon", "glow", "backdrop", "sky", "tv"]);

export function parseSem(spec: string, palette: Record<string, string>): Sem {
  const [kind, arg] = spec.split(":");
  const sem: Sem = { key: spec, kind, hex: palette[kind] ?? "#ff00ff", emissive: EMISSIVE_KINDS.has(kind) };
  if (arg?.startsWith("#")) sem.hex = arg;
  else if (kind === "screen" && arg !== undefined) sem.screen = Number(arg);
  return sem;
}

/** Scale BoxGeometry-style UVs to world size so textures keep one physical density everywhere. */
function worldUV(g: THREE.BufferGeometry, w: number, h: number, d: number, unit: number) {
  const uv = g.getAttribute("uv") as THREE.BufferAttribute | undefined;
  const n = g.getAttribute("normal") as THREE.BufferAttribute | undefined;
  if (!uv || !n) return;
  for (let i = 0; i < uv.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let su = w, sv = h;
    if (ax >= ay && ax >= az) { su = d; sv = h; } else if (ay >= az) { su = w; sv = d; }
    uv.setXY(i, (uv.getX(i) * su) / unit, (uv.getY(i) * sv) / unit);
  }
  uv.needsUpdate = true;
}

export function makePrims(look: LookDef, palette: Record<string, string>, reg: BuildRegistry): Prims {
  const matCache = new Map<string, THREE.Material>();
  const mat = (spec: string) => {
    let m = matCache.get(spec);
    if (!m) {
      m = look.material(parseSem(spec, palette));
      matCache.set(spec, m);
    }
    return m;
  };
  const finish = (mesh: THREE.Mesh, sem: string, o: PrimOpts = {}) => {
    const s = parseSem(sem, palette);
    mesh.castShadow = o.cast ?? !s.emissive;
    mesh.receiveShadow = o.receive ?? !s.emissive;
    mesh.userData.sem = sem;
    mesh.userData.dynamic = !!o.dynamic;
    if (o.name) mesh.name = o.name;
    if (o.collider) reg.colliders.push(mesh);
    if (s.kind === "screen" || s.kind === "tv") reg.screens.push(mesh);
    return mesh;
  };
  return {
    look,
    box(w, h, d, sem, o) {
      const g = look.geometry?.box?.(w, h, d) ?? new THREE.BoxGeometry(w, h, d);
      worldUV(g, w, h, d, look.uvUnit);
      return finish(new THREE.Mesh(g, mat(sem)), sem, o);
    },
    cyl(rt, rb, h, sem, o) {
      const seg = o?.seg ?? 20;
      const g = look.geometry?.cyl?.(rt, rb, h, seg) ?? new THREE.CylinderGeometry(rt, rb, h, seg);
      worldUV(g, Math.PI * 2 * Math.max(rt, rb), h, Math.PI * 2 * Math.max(rt, rb), look.uvUnit);
      return finish(new THREE.Mesh(g, mat(sem)), sem, o);
    },
    sphere(r, sem, o) {
      const g = look.geometry?.sphere?.(r) ?? new THREE.SphereGeometry(r, 18, 12);
      return finish(new THREE.Mesh(g, mat(sem)), sem, o);
    },
    plane(w, h, sem, o) {
      const g = new THREE.PlaneGeometry(w, h);
      return finish(new THREE.Mesh(g, mat(sem)), sem, { cast: false, ...o });
    },
  };
}
```

### 17/55 · `stop-motion-3d/assets/template/src/looks/screens.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/screens.ts", "lines": 17, "final_newline": true, "sha256": "c9b41dd4bb8a5a473cbdd064281e30e65c2f1d8ed68f8664d8f4281efebf9394", "original_sha256": "c9b41dd4bb8a5a473cbdd064281e30e65c2f1d8ed68f8664d8f4281efebf9394"} -->
```ts
import * as THREE from "three";

/**
 * Screen content registry. "screen:N" / "tv:N" materials sample SCREENS[N].
 * The film fills these before rendering (monitor thumbnails are real renders of the sandbox in
 * each look — the film shows the films its characters are making).
 */
export const SCREENS: THREE.Texture[] = [];

export function screenTexture(i: number): THREE.Texture {
  if (!SCREENS[i]) {
    const t = new THREE.DataTexture(new Uint8Array([20, 22, 28, 255]), 1, 1);
    t.needsUpdate = true;
    SCREENS[i] = t;
  }
  return SCREENS[i];
}
```

### 18/55 · `stop-motion-3d/assets/template/src/looks/sketch.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/sketch.ts", "lines": 67, "final_newline": true, "sha256": "93f5d164af62ea97e63711cb96e1629e9e3a42a825d4d2fc91b87a420540a875", "original_sha256": "93f5d164af62ea97e63711cb96e1629e9e3a42a825d4d2fc91b87a420540a875"} -->
```ts
import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * SKETCH — hand-drawn line art: graphite contours on cream paper, loose hatching for shadow,
 * a thin marker wash that misses the lines, and LINE BOIL — every contour is re-drawn with a
 * new wobble on each pose step, exactly like redrawn animation paper.
 */
let pass: Pass | null = null;

export const sketch: LookDef = {
  id: "sketch",
  label: "Hand-drawn",
  zh: "手绘线稿",
  blurb: "Pencil contours on paper that re-wobble every pose step (line boil), hatching for shadow, a loose marker wash.",
  tags: "pencil contours · line boil · hatching",
  poseFps: 12,
  cameraOnTwos: true,
  variant: "day",
  accent: "#f4efe2",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    return new THREE.MeshLambertMaterial({ color: grade(sem.hex, { mulS: 0.9 }) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#ffffff");
    standardLights(ctx, { sun: 2.6, hemi: 1.2, bounce: 0.9, beams: 0 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform sampler2D tPaper;
      void main(){
        vec2 px = 1. / uRes;
        float seed = floor(uStep * 12. + .5);                    // changes every pose step → boil
        vec2 j1 = (vec2(fbm(vUv * 7. + seed * 3.1), fbm(vUv * 7. + 11. + seed * 1.7)) - .5) * 5.;
        vec2 j2 = (vec2(fbm(vUv * 9. + 5. + seed * 2.3), fbm(vUv * 9. + 3. + seed * 4.1)) - .5) * 5.;
        float e1 = edgeDN(vUv, 1.6, .035, .25, j1);
        float e2 = edgeDN(vUv, 1.1, .035, .25, j2) * .6;
        float grain = .65 + .35 * vnoise(vUv * uRes * .6);
        float line = clamp(max(e1, e2) * grain, 0., 1.);
        vec3 lit = toSRGB(aces(texture2D(tColor, vUv + j1 * px * 1.5).rgb * 1.1));
        float l = isSky(vUv) ? 1. : luma(lit);
        // marker wash: pale, offset from the lines, paper shows through
        vec3 paper = vec3(.965, .945, .9) * (.9 + .1 * texture2D(tPaper, vUv * uRes / 512.).rgb);
        float lq = floor(l * 3. + .5) / 3.;                           // flat value, not 3D shading
        vec3 wash = mix(paper, lit / max(l, .05) * mix(lq, 1., .55), .2);
        vec3 c = isSky(vUv) ? paper : wash;
        // hatching (45° for mid shadow, -45° cross-hatch for deep shadow), also boils
        vec2 p = vUv * uRes + j1 * 1.5;
        float h1 = smoothstep(.42, .26, l) * (1. - smoothstep(.1, .3, abs(fract((p.x + p.y) / 10.) - .5) * 2.));
        float h2 = smoothstep(.2, .08, l) * (1. - smoothstep(.1, .3, abs(fract((p.x - p.y) / 10.) - .5) * 2.));
        c = mix(c, vec3(.3, .29, .31), clamp(h1 * .4 + h2 * .45, 0., .7) * (isSky(vUv) ? 0. : 1.) * (.6 + .4 * vnoise(p * .08)));
        c = mix(c, vec3(.16, .15, .17), line);
        gl_FragColor = vec4(c, 1.);
      }`, { tPaper: { value: TEX.paper() } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
```

### 19/55 · `stop-motion-3d/assets/template/src/looks/tex.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/tex.ts", "lines": 130, "final_newline": true, "sha256": "e07e7b1506d4c6f405b180b30bd0c0b80fa9f69d2019b254cca70904e68a491b", "original_sha256": "e07e7b1506d4c6f405b180b30bd0c0b80fa9f69d2019b254cca70904e68a491b"} -->
```ts
import * as THREE from "three";
import { rng, hash } from "../runtime/rng";

/**
 * Procedural texture helpers (browser canvas). All deterministic. Detail maps are gray around
 * 0.8–1.0 and are MULTIPLIED by the semantic color, so one texture serves every tint.
 */
const cache = new Map<string, THREE.Texture>();

function canvasTex(id: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, o: { nearest?: boolean; srgb?: boolean } = {}) {
  const hit = cache.get(id);
  if (hit) return hit;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d")!;
  draw(g, rng(hash(id)));
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (o.nearest) {
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
  } else t.anisotropy = 4;
  t.colorSpace = o.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  cache.set(id, t);
  return t;
}

const gray = (v: number) => `rgb(${v},${v},${v})`;

export const TEX = {
  planks: () =>
    canvasTex("planks", 256, 256, (g, r) => {
      for (let i = 0; i < 8; i++) {
        const base = 205 + r() * 40;
        g.fillStyle = gray(base | 0);
        g.fillRect(0, i * 32, 256, 32);
        for (let k = 0; k < 40; k++) {
          g.fillStyle = `rgba(80,60,40,${0.04 + r() * 0.06})`;
          g.fillRect(r() * 256, i * 32 + r() * 32, 30 + r() * 80, 1 + r() * 1.5);
        }
        g.fillStyle = "rgba(40,30,20,0.35)";
        g.fillRect(0, i * 32, 256, 1.5);
        g.fillRect(((i * 97) % 256) | 0, i * 32, 1.5, 32);
      }
    }),
  brick: () =>
    canvasTex("brick", 256, 256, (g, r) => {
      g.fillStyle = gray(236);
      g.fillRect(0, 0, 256, 256);
      for (let row = 0; row < 8; row++)
        for (let c = -1; c < 5; c++) {
          const x = c * 64 + (row % 2) * 32 + 2, y = row * 32 + 2;
          g.fillStyle = gray((190 + r() * 55) | 0);
          g.fillRect(x, y, 60, 28);
          for (let k = 0; k < 6; k++) {
            g.fillStyle = `rgba(0,0,0,${r() * 0.08})`;
            g.fillRect(x + r() * 56, y + r() * 24, 4, 3);
          }
        }
    }),
  plaster: () =>
    canvasTex("plaster", 256, 256, (g, r) => {
      g.fillStyle = gray(240);
      g.fillRect(0, 0, 256, 256);
      for (let k = 0; k < 1400; k++) {
        g.fillStyle = `rgba(0,0,0,${r() * 0.035})`;
        g.fillRect(r() * 256, r() * 256, 2 + r() * 6, 2 + r() * 6);
      }
    }),
  fabric: () =>
    canvasTex("fabric", 64, 64, (g, r) => {
      for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
        g.fillStyle = gray((((x + y) % 4 < 2 ? 228 : 246) - r() * 18) | 0);
        g.fillRect(x, y, 1, 1);
      }
    }),
  /** 16×16 pixel-art noise for the block look (per material family) */
  pixel: (family: string) =>
    canvasTex(`px:${family}`, 16, 16, (g, r) => {
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        let v = 200 + r() * 55;
        if (family === "planks" && y % 4 === 0) v = 150;
        if (family === "planks" && x === ((y >> 2) * 5) % 16) v = 160;
        if (family === "brick" && (y % 4 === 0 || (x + (y >> 2) * 4) % 8 === 0)) v = 245;
        if (family === "brick" && !(y % 4 === 0 || (x + (y >> 2) * 4) % 8 === 0)) v = 150 + r() * 40;
        if (family === "leaf" && r() < 0.2) v = 140;
        g.fillStyle = gray(v | 0);
        g.fillRect(x, y, 1, 1);
      }
    }, { nearest: true }),
  /** fingerprints + lumps for clay (bump map) */
  clayBump: () =>
    canvasTex("clayBump", 128, 128, (g, r) => {
      g.fillStyle = gray(128);
      g.fillRect(0, 0, 128, 128);
      for (let k = 0; k < 90; k++) {
        const x = r() * 128, y = r() * 128, rad = 6 + r() * 18;
        for (let ring = 0; ring < rad; ring += 2.2) {
          g.strokeStyle = `rgba(${r() < 0.5 ? "255,255,255" : "0,0,0"},0.05)`;
          g.lineWidth = 1;
          g.beginPath();
          g.arc(x, y, ring, 0, Math.PI * 2);
          g.stroke();
        }
      }
      for (let k = 0; k < 300; k++) {
        g.fillStyle = `rgba(${r() < 0.5 ? "255,255,255" : "0,0,0"},0.06)`;
        g.beginPath();
        g.arc(r() * 128, r() * 128, 2 + r() * 5, 0, Math.PI * 2);
        g.fill();
      }
    }),
  /** paper fiber for the collage / sketch / watercolor looks (used in post) */
  paper: () =>
    canvasTex("paperFiber", 512, 512, (g, r) => {
      g.fillStyle = gray(236);
      g.fillRect(0, 0, 512, 512);
      for (let k = 0; k < 5000; k++) {
        g.strokeStyle = `rgba(${r() < 0.5 ? "255,255,255" : "90,80,70"},${0.05 + r() * 0.07})`;
        g.lineWidth = 0.6;
        g.beginPath();
        const x = r() * 512, y = r() * 512, a = r() * Math.PI;
        g.moveTo(x, y);
        g.lineTo(x + Math.cos(a) * (4 + r() * 12), y + Math.sin(a) * (4 + r() * 12));
        g.stroke();
      }
    }),
};
```

### 20/55 · `stop-motion-3d/assets/template/src/looks/types.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/types.ts", "lines": 82, "final_newline": true, "sha256": "b627826834098224481ef94474e8a16a18fbbacb7f1081529bec0477932e37b8", "original_sha256": "b627826834098224481ef94474e8a16a18fbbacb7f1081529bec0477932e37b8"} -->
```ts
import type * as THREE from "three";
import type { StageTime } from "../runtime/types";
import type { GBuffer } from "../runtime/post";

/**
 * Semantic material: world code says WHAT a surface is ("wood", "cloth:#e0663f", "screen:2"),
 * never how it looks. A LOOK turns it into a real material.
 */
export interface Sem {
  key: string; // full spec string, used as cache key
  kind: string;
  hex: string; // base color (world palette or explicit override)
  screen?: number; // "screen:N" → N
  emissive?: boolean;
}

export interface PrimOpts {
  /** not merged into static batches (animated, attached to hands, state-driven) */
  dynamic?: boolean;
  cast?: boolean;
  receive?: boolean;
  /** register the world AABB as a collider for penetration QC */
  collider?: boolean;
  name?: string;
}

/** Geometry primitives. World/prop/puppet code is written ONLY against this interface. */
export interface Prims {
  look: LookDef;
  box(w: number, h: number, d: number, sem: string, o?: PrimOpts): THREE.Mesh;
  /** Y-axis cylinder / cone */
  cyl(rTop: number, rBot: number, h: number, sem: string, o?: PrimOpts & { seg?: number }): THREE.Mesh;
  sphere(r: number, sem: string, o?: PrimOpts): THREE.Mesh;
  /** flat panel facing +Z (screens, posters, window glass, painted backdrops) */
  plane(w: number, h: number, sem: string, o?: PrimOpts): THREE.Mesh;
}

export interface SetupCtx {
  variant: string;
  renderer?: THREE.WebGLRenderer;
  handles: import("../world/studio").StudioHandles;
}

export interface PostCtx {
  renderer: THREE.WebGLRenderer;
  gbuf: GBuffer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  out: THREE.WebGLRenderTarget | null;
  time: StageTime;
  width: number;
  height: number;
}

/**
 * A LOOK is a complete rendering pipeline over the same world — not a palette swap:
 * geometry treatment + shading model + lighting rig + screen-space post + cadence.
 */
export interface LookDef {
  id: string;
  label: string; // English name
  zh: string; // Chinese name
  blurb: string; // one line for the style menu
  tags: string; // short tech tags for on-screen chips
  poseFps: number; // puppet cadence at 24 fps output (12 = on twos, 8 = on threes)
  cameraOnTwos?: boolean; // hand-made 2D looks also step the camera
  variant: "day" | "night";
  accent: string; // UI / transition accent color
  /** meters per texture tile for world-space UVs */
  uvUnit: number;
  material(sem: Sem): THREE.Material;
  /** geometry treatment (block → squares, clay → rounded lumps). Defaults to plain primitives. */
  geometry?: {
    box?(w: number, h: number, d: number): THREE.BufferGeometry;
    cyl?(rTop: number, rBot: number, h: number, seg: number): THREE.BufferGeometry;
    sphere?(r: number): THREE.BufferGeometry;
  };
  setup(scene: THREE.Scene, ctx: SetupCtx): void;
  /** per-frame look-specific updates (flicker, beams) */
  update?(scene: THREE.Scene, ctx: SetupCtx, time: StageTime): void;
  post(ctx: PostCtx): void;
}
```

### 21/55 · `stop-motion-3d/assets/template/src/looks/vox.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/vox.ts", "lines": 86, "final_newline": true, "sha256": "257efd1858a8c70c1e65751d599b9138de9432a5cfc3aa1fae035ded76603579", "original_sha256": "257efd1858a8c70c1e65751d599b9138de9432a5cfc3aa1fae035ded76603579"} -->
```ts
import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights, toonRamp } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * VOX — the paper-collage explainer look (Vox-style): every surface is a flat cut of colored
 * card, shadows are cast by layers of paper (screen-space depth offset), dark tones are printed
 * as halftone dots, ink misregisters slightly, and the whole frame sits on fibrous stock.
 * Hand-made cadence: puppets on threes, the camera steps on twos.
 */
let pass: Pass | null = null;
const EDITORIAL: Record<string, string> = {
  floor: "#d8c3a0", wood: "#d7a26a", woodDark: "#8a5a3a", brick: "#c65b43", plaster: "#efe4cf", backdrop: "#f0e2c6",
  metalDark: "#2d2f36", plasticDark: "#26282e", fabric: "#2f6e8f", plant: "#3c9a5f", plantDark: "#2c7a4a",
};

export const vox: LookDef = {
  id: "vox",
  label: "Paper collage",
  zh: "Vox 纸片拼贴",
  blurb: "Vox-style paper collage: flat card cut-outs, layered paper shadows, halftone print, misregistered ink, fibre paper.",
  tags: "flat card · halftone · paper shadows · on threes",
  poseFps: 8,
  cameraOnTwos: true,
  variant: "day",
  accent: "#e0663f",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    const base = EDITORIAL[sem.kind] ?? sem.hex;
    return new THREE.MeshToonMaterial({ color: grade(base, { mulS: 1.35, light: 0.02 }), gradientMap: toonRamp([150, 255]) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#f0e2c6");
    standardLights(ctx, { sun: 2.2, hemi: 1.6, bounce: 1.0, beams: 0 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform sampler2D tPaper;
      void main(){
        vec2 px = 1. / uRes;
        // torn-edge wobble, fixed per poster (not per frame): cut paper does not boil
        vec2 j = (vec2(fbm(vUv * 38.), fbm(vUv * 38. + 9.)) - .5) * 2.4;
        vec3 lin = texture2D(tColor, vUv + j * px * .35).rgb;
        vec3 c = toSRGB(aces(lin * 1.1));
        float l = luma(c);
        // flat card: posterize value to 3 steps, keep hue
        float q = floor(l * 3. + .5) / 3.;
        c = clamp(c * (q + .12) / max(l, .05), 0., 1.);
        if (isSky(vUv)) c = vec3(.94, .89, .78);
        // paper layers cast offset shadows: a nearer cut above-left darkens what lies below-right
        float d = linDepth(vUv), dn = linDepth(vUv - vec2(9., -9.) * px);
        float sh = step(.05, (d - dn) / d) * step(dn, 60.);
        c *= mix(1., .58, sh);
        // white cut rim: the top layer of paper shows its cut edge
        float rim = 0.;
        for (int i = 0; i < 4; i++){
          vec2 o = (i==0 ? vec2(1,0) : i==1 ? vec2(-1,0) : i==2 ? vec2(0,1) : vec2(0,-1)) * 3. * px;
          rim = max(rim, step(.04, (linDepth(vUv + o + j * px) - d) / d));
        }
        c = mix(c, vec3(.97, .94, .87), rim * .85);
        // halftone print in darker tones (45° screen)
        vec2 g = mat2(.7071, -.7071, .7071, .7071) * (vUv * uRes) / 7.;
        float dotR = sqrt(clamp(1. - l * 1.25, 0., 1.)) * .62;
        float ht = 1. - smoothstep(dotR - .08, dotR + .08, length(fract(g) - .5));
        c = mix(c, c * .45, ht * .55);
        // ink cut lines + slight red misregistration
        float e = edgeDN(vUv, 1.6, .05, .35, j);
        float er = edgeDN(vUv + vec2(2., 1.) * px, 1.2, .05, .35, j);
        c = mix(c, vec3(.1, .09, .09), e * .85);
        c.r = mix(c.r, .85, er * (1. - e) * .35);
        // paper stock
        vec3 paper = texture2D(tPaper, vUv * uRes / 512.).rgb;
        c *= .82 + .2 * paper;
        gl_FragColor = vec4(c, 1.);
      }`, { tPaper: { value: TEX.paper() } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
```

### 22/55 · `stop-motion-3d/assets/template/src/looks/watercolor.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/looks/watercolor.ts", "lines": 72, "final_newline": true, "sha256": "3fb63dbf3e7c24ec7048cf550aaa3e8bf992427ae0c4e9dbefbe1885160e536f", "original_sha256": "3fb63dbf3e7c24ec7048cf550aaa3e8bf992427ae0c4e9dbefbe1885160e536f"} -->
```ts
import * as THREE from "three";
import type { LookDef } from "./types";
import { grade, specialMaterial, standardLights } from "./common";
import { TEX } from "./tex";
import { bindCommon, fsPass, type Pass } from "../runtime/post";

/**
 * WATERCOLOR — transparent washes on cold-press paper: pale pigments, color that wanders a few
 * pixels off the drawing, pigment pooling (dark rims) where washes meet, granulation in the
 * shadows, faint pencil underdrawing, and white paper breathing at the frame edge.
 */
let pass: Pass | null = null;

export const watercolor: LookDef = {
  id: "watercolor",
  label: "Watercolor",
  zh: "水彩晕染",
  blurb: "Transparent washes on paper: wandering pigment, dark pooled edges, granulated shadows, faint pencil underdrawing.",
  tags: "washes · pooled edges · granulation",
  poseFps: 12,
  variant: "day",
  accent: "#8fc4ae",
  uvUnit: 1,
  material(sem) {
    const sp = specialMaterial(sem, "day");
    if (sp) return sp;
    return new THREE.MeshLambertMaterial({ color: grade(sem.hex, { mulS: 1.15, light: 0.06 }) });
  },
  setup(scene, ctx) {
    ctx.handles.dust.visible = false; // 2D looks: specks read as dirt, not light
    scene.background = new THREE.Color("#f6f1e6");
    standardLights(ctx, { sun: 2.4, hemi: 1.35, bounce: 1.0, beams: 0 });
  },
  post(c) {
    pass ??= fsPass(/* glsl */ `
      uniform sampler2D tPaper;
      vec3 samp(vec2 uv){ return toSRGB(aces(texture2D(tColor, uv).rgb * 1.25)); }
      void main(){
        vec2 px = 1. / uRes;
        vec2 w = (vec2(fbm(vUv * 5.), fbm(vUv * 5. + 7.)) - .5) * 7. * px;   // pigment wanders
        vec2 uv = vUv + w;
        vec3 c0 = samp(uv);
        vec3 m = c0;
        for (int i = 0; i < 6; i++){
          float a = float(i) * 1.0472; m += samp(uv + vec2(cos(a), sin(a)) * 4. * px);
        }
        m /= 7.;
        vec3 c = mix(c0, m, .6);                                          // soft wash
        float pool = clamp(length(c0 - m) * 3.5, 0., 1.);                  // pooled rims
        c = mix(c, c * c * .85, pool * .7);
        float l = luma(c);
        vec3 paperTex = texture2D(tPaper, vUv * uRes / 512.).rgb;
        float gran = vnoise(vUv * uRes * .35) * .5 + vnoise(vUv * uRes * .09) * .5;
        c *= mix(1., .82 + .25 * gran, smoothstep(.85, .35, l));           // granulation in shadows
        vec3 paper = vec3(.975, .96, .925) * (.92 + .08 * paperTex);
        c = mix(paper, c * paper, .88);
        c = mix(vec3(luma(c)), c, 1.18);
        c = mix(c, paper, smoothstep(.72, .98, l) * .7);                   // whites are the paper
        if (isSky(vUv)) c = mix(paper, vec3(.78, .87, .93), .35 * (1. - vUv.y));
        float e = edgeDN(vUv, 1., .05, .35, (vec2(fbm(vUv * 11.), fbm(vUv * 11. + 3.)) - .5) * 3.);
        c = mix(c, vec3(.35, .32, .33), e * .28);                          // pencil underdrawing
        // paper breathes at the frame edge
        vec2 q = vUv - .5; float edge = smoothstep(.36, .52, max(abs(q.x) * 1.02, abs(q.y) * 1.08) + (fbm(vUv * 9.) - .5) * .06);
        c = mix(c, paper, edge);
        gl_FragColor = vec4(c, 1.);
      }`, { tPaper: { value: TEX.paper() } });
    c.gbuf.renderColor(c.renderer, c.scene, c.camera);
    c.gbuf.renderNormalDepth(c.renderer, c.scene, c.camera);
    bindCommon(pass, c.gbuf, c.camera, c.time.frame, c.time.poseT, c.time.t);
    pass.run(c.renderer, c.out);
  },
};
```

### 23/55 · `stop-motion-3d/assets/template/src/runtime/acting.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/acting.ts", "lines": 58, "final_newline": true, "sha256": "578da6ef6152502551c43f129b77725408c0c050a9a94f6b1503ab5ba3e3594c", "original_sha256": "578da6ef6152502551c43f129b77725408c0c050a9a94f6b1503ab5ba3e3594c"} -->
```ts
import type { ActKey, ActLoop, Shot, WorldManifest } from "./types";
import { ease, hash, rng } from "./rng";

/**
 * Performance = named key poses on the stepped clock.
 * Loops (typing, drawing, nodding) are generators that expand into keys, so a shot reads like a
 * dope sheet: "kai: typing 0–2.4s, anticipate 2.4, hit enter 2.9 (hold), cheer 3.4".
 */
export const LOOPS: Record<string, { poses: string[]; rate: number; ease: ActKey["ease"] }> = {
  typing: { poses: ["type_a", "type_b"], rate: 3, ease: "hold" },
  draw: { poses: ["draw_a", "draw_b", "draw_c", "draw_b"], rate: 4, ease: "hold" },
  nod: { poses: ["nod_a", "nod_b"], rate: 2.2, ease: "inOut" },
  idle: { poses: ["seated_idle", "seated_breathe"], rate: 0.8, ease: "inOut" },
};

export function expandLoop(l: ActLoop, phase = 0): ActKey[] {
  const def = LOOPS[l.loop];
  if (!def) throw new Error(`unknown loop "${l.loop}"`);
  const step = 1 / (l.rate ?? def.rate);
  const keys: ActKey[] = [];
  let i = 0;
  for (let t = l.from + phase * step; t < l.to - 1e-6; t += step, i++) keys.push({ actor: l.actor, at: t, pose: def.poses[i % def.poses.length], ease: def.ease });
  if (!keys.length || keys[0].at > l.from + 1e-6) keys.unshift({ actor: l.actor, at: l.from, pose: def.poses[0], ease: def.ease });
  return keys;
}

export interface Track {
  keys: ActKey[];
}

/** Compile a shot's acting into one sorted key track per actor (ambient loops for everyone else). */
export function compileShot(shot: Shot, world: WorldManifest): Record<string, Track> {
  const out: Record<string, Track> = {};
  for (const a of shot.acting ?? []) {
    const keys = "loop" in a ? expandLoop(a) : [a];
    (out[a.actor] ??= { keys: [] }).keys.push(...keys);
  }
  for (const [id, def] of Object.entries(world.actors)) {
    if (out[id]) continue;
    const r = rng(hash(`${shot.id}:${id}`));
    if (def.ambient === "typing") out[id] = { keys: expandLoop({ actor: id, loop: "typing", from: 0, to: shot.duration, rate: 2.2 + r() * 1.4 }, r()) };
    else out[id] = { keys: [{ actor: id, at: 0, pose: "seated_idle" }] };
  }
  for (const t of Object.values(out)) t.keys.sort((a, b) => a.at - b.at);
  return out;
}

/** Which two poses and how far between them, at stepped time t. */
export function sampleTrack(track: Track, t: number): { a: string; b: string; u: number; keyed: boolean } {
  const k = track.keys;
  let i = 0;
  while (i + 1 < k.length && k[i + 1].at <= t + 1e-6) i++;
  const k0 = k[i], k1 = k[i + 1];
  if (!k1 || k1.ease === "hold" || t <= k0.at) return { a: k0.pose, b: k0.pose, u: 0, keyed: true };
  const raw = (t - k0.at) / Math.max(1e-6, k1.at - k0.at);
  const e = ease[(k1.ease ?? "inOut") as keyof typeof ease] ?? ease.inOut;
  return { a: k0.pose, b: k1.pose, u: e(Math.min(1, raw)), keyed: raw <= 1e-6 };
}
```

### 24/55 · `stop-motion-3d/assets/template/src/runtime/camera.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/camera.ts", "lines": 26, "final_newline": true, "sha256": "246f1f9981c7a22feda3347cb4ad8b747a5f4a3444a9d8a3632364bd8c68dd5d", "original_sha256": "246f1f9981c7a22feda3347cb4ad8b747a5f4a3444a9d8a3632364bd8c68dd5d"} -->
```ts
import * as THREE from "three";
import type { CameraDef } from "./types";
import { ease } from "./rng";

/** Sample a named rig at progress u (0..1). Cameras live on the CONTINUOUS clock. */
export function sampleCamera(def: CameraDef, u: number) {
  const to = def.to ?? def.from;
  const k = ease[def.ease ?? "inOut"](Math.min(1, Math.max(0, u)));
  const l = (a: number[], b: number[]) => a.map((v, i) => v + (b[i] - v) * k) as [number, number, number];
  const fa = def.from.fov ?? def.fov, fb = to.fov ?? def.fov;
  return { pos: l(def.from.pos, to.pos), target: l(def.from.target, to.target), fov: fa + (fb - fa) * k };
}

export function applyCamera(cam: THREE.PerspectiveCamera, s: ReturnType<typeof sampleCamera>, aspect: number) {
  cam.position.set(...s.pos);
  cam.up.set(0, 1, 0);
  cam.lookAt(...s.target);
  cam.fov = s.fov;
  cam.aspect = aspect;
  cam.near = 0.05;
  cam.far = 400;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld(true);
  // focus distance for depth-of-field looks = distance to the rig's target
  cam.userData.focus = Math.hypot(s.pos[0] - s.target[0], s.pos[1] - s.target[1], s.pos[2] - s.target[2]);
}
```

### 25/55 · `stop-motion-3d/assets/template/src/runtime/clock.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/clock.ts", "lines": 63, "final_newline": true, "sha256": "0d72b0c72b26c355f6474ced67263dffeb55c6d3a28c399232f86a99dd802f15", "original_sha256": "0d72b0c72b26c355f6474ced67263dffeb55c6d3a28c399232f86a99dd802f15"} -->
```ts
import type { Episode, StageTime, WorldState, Shot } from "./types";

export const shotFrames = (s: Shot, fps: number) => Math.round(s.duration * fps);
export const totalFrames = (ep: Episode) => ep.shots.reduce((n, s) => n + shotFrames(s, ep.fps), 0);

export function shotStarts(ep: Episode) {
  const out: number[] = [];
  let f = 0;
  for (const s of ep.shots) {
    out.push(f);
    f += shotFrames(s, ep.fps);
  }
  return out;
}

/**
 * THE stop-motion rule, in integer frames (never float division):
 * puppets are held for `hold = fps / poseFps` output frames. poseFps comes from the shot's LOOK
 * (block 12, clay 8 ...), so the same performance reads "on twos" or "on threes" per style.
 */
export function stageTime(ep: Episode, frame: number, poseFpsOf: (look: string) => number): StageTime {
  const starts = shotStarts(ep);
  let i = ep.shots.length - 1;
  for (let k = 0; k < ep.shots.length; k++) {
    if (frame < starts[k] + shotFrames(ep.shots[k], ep.fps)) {
      i = k;
      break;
    }
  }
  const shot = ep.shots[i];
  const len = shotFrames(shot, ep.fps);
  const local = Math.min(Math.max(0, frame - starts[i]), len - 1);
  const hold = Math.max(1, Math.round(ep.fps / poseFpsOf(shot.look)));
  const stepped = Math.floor(local / hold) * hold;
  return { frame, fps: ep.fps, shotIndex: i, localFrame: local, t: local / ep.fps, poseT: stepped / ep.fps, u: local / Math.max(1, len - 1) };
}

/** Continuity: shot N starts from shot N-1's END state, then its own overrides, then timed events. */
export function resolveStates(ep: Episode, defaults: WorldState) {
  const starts: WorldState[] = [];
  let carry = { ...defaults };
  for (const shot of ep.shots) {
    const start = { ...carry, ...(shot.state ?? {}) };
    starts.push(start);
    carry = { ...start };
    for (const ev of shot.events ?? []) carry = { ...carry, ...ev.set };
  }
  return starts;
}

/** Events fire on the stepped clock (a hand flips the switch on a held pose). */
export function stateAt(shot: Shot, start: WorldState, poseT: number): WorldState {
  let s = { ...start };
  for (const ev of shot.events ?? []) if (poseT >= ev.t - 1e-6) s = { ...s, ...ev.set };
  return s;
}

/** Seconds since the latest event that set `key` (continuous clock) — for ramps and particles. */
export function sinceEvent(shot: Shot, key: string, t: number): number | null {
  let since: number | null = null;
  for (const ev of shot.events ?? []) if (key in ev.set && t >= ev.t) since = t - ev.t;
  return since;
}
```

### 26/55 · `stop-motion-3d/assets/template/src/runtime/film.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/film.ts", "lines": 340, "final_newline": true, "sha256": "fe328fad1d69220f99d7df45d2aaae0588e63db90307b81ddbca6a7f9d86d877", "original_sha256": "fe328fad1d69220f99d7df45d2aaae0588e63db90307b81ddbca6a7f9d86d877"} -->
```ts
import * as THREE from "three";
import type { Episode, Shot, StageTime, WorldManifest, WorldState } from "./types";
import { resolveStates, shotStarts, shotFrames, stateAt, totalFrames } from "./clock";
import { applyCamera, sampleCamera } from "./camera";
import { compileShot, sampleTrack, type Track } from "./acting";
import { blendPose, mergeSpec, resolvePose, type PoseSpec, type Puppet, type ResolvedPose, type AnchorLookup } from "./rig";
import { GBuffer, fsPass, indexNoOutline, type Pass } from "./post";
import { drawMG } from "./mg";
import { makePrims, type BuildRegistry } from "../looks/prims";
import type { LookDef } from "../looks/types";
import { SCREENS } from "../looks/screens";
import { clamp01, ease } from "./rng";

/**
 * FILM RUNTIME — the thin contract between a sandbox world, looks, and an episode.
 *   frame → StageTime (two clocks) → state (continuity) → poses (IK, stepped) → look pipeline(s)
 *   → composite (cut / wipe / bands) → MG overlay → one image.
 * Pure function of the frame number. The capture harness only ever calls render(frame).
 */
export interface WorldHandles {
  root: THREE.Group;
  actors: Record<string, Puppet>;
  seatTop: Record<string, number>;
  anchors: (actor: string) => AnchorLookup;
  colliders: THREE.Mesh[];
}

export interface WorldHooks<H extends WorldHandles> {
  build(P: ReturnType<typeof makePrims>, variant: string, reg: BuildRegistry): H;
  /** state-driven world updates (props, particles) for one look's copy */
  update(h: H, state: WorldState, shot: Shot, time: StageTime): void;
  /** camera-dependent visibility (wild walls, ceiling) */
  beforeRender(h: H, camera: THREE.PerspectiveCamera): void;
}

export interface FilmConfig<H extends WorldHandles> {
  world: WorldManifest;
  episode: Episode & { screens?: Record<string, string> };
  looks: Record<string, LookDef>;
  poses: Record<string, PoseSpec>;
  palette: Record<string, string>;
  hooks: WorldHooks<H>;
  canvas: HTMLCanvasElement; // WebGL canvas
  out: HTMLCanvasElement; // 2D canvas (final image with MG)
  /** screen index → texture made outside (e.g. the TV logo) */
  staticScreens?: Record<number, THREE.Texture>;
}

interface Stage<H> {
  look: LookDef;
  scene: THREE.Scene;
  handles: H;
  reg: BuildRegistry;
}

export class Film<H extends WorldHandles> {
  renderer: THREE.WebGLRenderer;
  camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 400);
  gbuf: GBuffer;
  stages: Record<string, Stage<H>> = {};
  tracks: Record<string, Track>[] = [];
  starts: WorldState[];
  frameStarts: number[];
  total: number;
  private rts: THREE.WebGLRenderTarget[] = [];
  private screenRTs: Record<number, THREE.WebGLRenderTarget> = {};
  private poseCache = new Map<string, ResolvedPose>();
  private copy: Pass;
  private wipe: Pass;
  private bands: Pass;
  private g2: CanvasRenderingContext2D;
  W: number;
  H: number;

  constructor(public cfg: FilmConfig<H>) {
    const ep = cfg.episode;
    this.W = ep.width;
    this.H = ep.height;
    this.renderer = new THREE.WebGLRenderer({ canvas: cfg.canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.W, this.H, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // post passes encode sRGB themselves
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.gbuf = new GBuffer(this.W, this.H);
    for (let i = 0; i < 7; i++) this.rts.push(new THREE.WebGLRenderTarget(this.W, this.H));
    this.g2 = cfg.out.getContext("2d")!;
    cfg.out.width = this.W;
    cfg.out.height = this.H;
    this.starts = resolveStates(ep, cfg.world.state);
    this.frameStarts = shotStarts(ep);
    this.total = totalFrames(ep);
    this.tracks = ep.shots.map((s) => compileShot(s, cfg.world));
    this.copy = fsPass(`uniform sampler2D tA; void main(){ gl_FragColor = vec4(texture2D(tA, vUv).rgb, 1.); }`, { tA: { value: null } });
    this.wipe = fsPass(/* glsl */ `
      uniform sampler2D tA, tB; uniform float uP; uniform vec3 uAccent;
      void main(){
        float s = (vUv.x + (1. - vUv.y) * .35) / 1.35;
        float edge = uP * 1.3 - .15 + (fbm(vUv * vec2(6., 18.)) - .5) * .09;
        float m = smoothstep(edge + .004, edge - .004, s);
        vec3 c = mix(texture2D(tA, vUv).rgb, texture2D(tB, vUv).rgb, m);
        float line = smoothstep(.012, 0., abs(s - edge)) * step(.001, uP) * step(uP, .999);
        gl_FragColor = vec4(mix(c, uAccent, line * .9), 1.);
      }`, { tA: { value: null }, tB: { value: null }, uP: { value: 0 }, uAccent: { value: new THREE.Color() } });
    this.bands = fsPass(/* glsl */ `
      uniform sampler2D t0, t1, t2, t3, t4, t5, tBase; uniform float uN; uniform float uR[6];
      vec3 pick(int i, vec2 uv){ return i==0 ? texture2D(t0,uv).rgb : i==1 ? texture2D(t1,uv).rgb : i==2 ? texture2D(t2,uv).rgb : i==3 ? texture2D(t3,uv).rgb : i==4 ? texture2D(t4,uv).rgb : texture2D(t5,uv).rgb; }
      void main(){
        float fi = floor(vUv.x * uN); int i = int(fi);
        float r = i==0 ? uR[0] : i==1 ? uR[1] : i==2 ? uR[2] : i==3 ? uR[3] : i==4 ? uR[4] : uR[5];
        float edge = 1. - r * 1.15 + (fbm(vec2(vUv.x * 30., fi)) - .5) * .06;
        float m = smoothstep(edge - .004, edge + .004, 1. - vUv.y) ;
        m = r >= .999 ? 1. : m * step(.001, r);
        vec3 c = mix(texture2D(tBase, vUv).rgb, pick(i, vUv), m);
        float bx = fract(vUv.x * uN); float sep = step(bx, 2. / uRes.x * uN) * step(.001, r);
        gl_FragColor = vec4(mix(c, vec3(.98, .96, .92), sep), 1.);
      }`, {
      t0: { value: null }, t1: { value: null }, t2: { value: null }, t3: { value: null }, t4: { value: null }, t5: { value: null }, tBase: { value: null },
      uN: { value: 6 }, uR: { value: [0, 0, 0, 0, 0, 0] },
    });
  }

  /** Build one copy of the world per look, then render the monitor thumbnails. */
  init() {
    const { cfg } = this;
    Object.entries(cfg.staticScreens ?? {}).forEach(([i, t]) => (SCREENS[Number(i)] = t));
    for (const [i] of Object.entries(cfg.episode.screens ?? {})) {
      const rt = new THREE.WebGLRenderTarget(this.W, this.H, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
      this.screenRTs[Number(i)] = rt;
      SCREENS[Number(i)] = rt.texture;
    }
    const need = new Set<string>(Object.values(cfg.episode.screens ?? {}));
    for (const s of cfg.episode.shots) {
      need.add(s.look);
      if (s.transition?.from) need.add(s.transition.from);
      s.bands?.looks.forEach((l) => need.add(l));
    }
    for (const id of need) this.stage(id);
    // monitor thumbnails: each look renders the thumbnail camera with all screens hidden
    const thumb = cfg.world.cameras.find((c) => c.role === "monitor-content");
    if (thumb) {
      for (const [i, lookId] of Object.entries(cfg.episode.screens ?? {})) {
        const st = this.stage(lookId);
        const time: StageTime = { frame: 0, fps: 24, shotIndex: 0, localFrame: 0, t: 0, poseT: 0, u: 0 };
        this.poseActors(st, 0, 0, true);
        applyCamera(this.camera, sampleCamera(thumb, 0), this.W / this.H);
        cfg.hooks.beforeRender(st.handles, this.camera);
        const vis = st.reg.screens.map((m) => m.visible);
        st.reg.screens.forEach((m) => (m.visible = false));
        cfg.hooks.update(st.handles, cfg.world.state, cfg.episode.shots[0], time);
        st.look.post({ renderer: this.renderer, gbuf: this.gbuf, scene: st.scene, camera: this.camera, out: this.screenRTs[Number(i)], time, width: this.W, height: this.H });
        st.reg.screens.forEach((m, k) => (m.visible = vis[k]));
      }
    }
  }

  stage(lookId: string): Stage<H> {
    if (this.stages[lookId]) return this.stages[lookId];
    const look = this.cfg.looks[lookId];
    if (!look) throw new Error(`unknown look "${lookId}"`);
    const reg: BuildRegistry = { colliders: [], screens: [] };
    const P = makePrims(look, this.cfg.palette, reg);
    const scene = new THREE.Scene();
    const handles = this.cfg.hooks.build(P, look.variant, reg);
    scene.add(handles.root);
    look.setup(scene, { variant: look.variant, handles: handles as never, renderer: this.renderer });
    indexNoOutline(scene);
    return (this.stages[lookId] = { look, scene, handles, reg });
  }

  /** stepped pose time for a given look inside the current shot */
  private steppedT(localFrame: number, look: LookDef) {
    const fps = this.cfg.episode.fps;
    const hold = Math.max(1, Math.round(fps / look.poseFps));
    return (Math.floor(localFrame / hold) * hold) / fps;
  }

  resolved(st: Stage<H>, actor: string, pose: string): ResolvedPose {
    const key = `${actor}|${pose}`;
    let p = this.poseCache.get(key);
    if (!p) {
      const pup = st.handles.actors[actor];
      const spec = mergeSpec(pose, this.cfg.poses);
      p = resolvePose(pup, spec, st.handles.anchors(actor), st.handles.seatTop[actor] ?? 0.46);
      this.poseCache.set(key, p);
    }
    return p;
  }

  /** Apply every actor's pose at stepped time `poseT` of shot `si`. */
  poseActors(st: Stage<H>, si: number, poseT: number, idle = false) {
    for (const [id, pup] of Object.entries(st.handles.actors)) {
      if (idle) {
        pup.apply(this.resolved(st, id, "seated_idle"));
        continue;
      }
      const tr = this.tracks[si][id];
      const s = sampleTrack(tr, poseT);
      const a = this.resolved(st, id, s.a);
      const p = s.u > 0 ? blendPose(a, this.resolved(st, id, s.b), s.u) : a;
      pup.apply(p);
    }
    st.handles.root.updateMatrixWorld(true);
  }

  timeAt(frame: number, look: LookDef): StageTime {
    const ep = this.cfg.episode;
    let i = ep.shots.length - 1;
    for (let k = 0; k < ep.shots.length; k++) if (frame < this.frameStarts[k] + shotFrames(ep.shots[k], ep.fps)) { i = k; break; }
    const len = shotFrames(ep.shots[i], ep.fps);
    const local = Math.min(Math.max(0, frame - this.frameStarts[i]), len - 1);
    return { frame, fps: ep.fps, shotIndex: i, localFrame: local, t: local / ep.fps, poseT: this.steppedT(local, look), u: local / Math.max(1, len - 1) };
  }

  /** Render one look's view of this frame into rts[slot]. */
  private renderLook(frame: number, lookId: string, slot: number) {
    const st = this.stage(lookId);
    const time = this.timeAt(frame, st.look);
    const shot = this.cfg.episode.shots[time.shotIndex];
    const state = stateAt(shot, this.starts[time.shotIndex], time.poseT);
    const cam = this.cfg.world.cameras.find((c) => c.id === shot.camera);
    if (!cam) throw new Error(`shot ${shot.id}: unknown camera ${shot.camera}`);
    const len = shotFrames(shot, this.cfg.episode.fps);
    const u = st.look.cameraOnTwos ? (Math.floor(time.localFrame / 2) * 2) / Math.max(1, len - 1) : time.u;
    applyCamera(this.camera, sampleCamera(cam, u), this.W / this.H);
    this.poseActors(st, time.shotIndex, time.poseT);
    this.cfg.hooks.update(st.handles, state, shot, time);
    this.cfg.hooks.beforeRender(st.handles, this.camera);
    st.look.update?.(st.scene, { variant: st.look.variant, handles: st.handles as never }, time);
    st.look.post({ renderer: this.renderer, gbuf: this.gbuf, scene: st.scene, camera: this.camera, out: this.rts[slot], time, width: this.W, height: this.H });
    return { time, shot };
  }

  /** THE contract: draw frame `f` into the 2D output canvas. */
  render(frame: number) {
    const ep = this.cfg.episode;
    const base = this.timeAt(frame, this.cfg.looks[ep.shots[0].look]);
    const shot = ep.shots[base.shotIndex];
    const look = this.cfg.looks[shot.look];
    const r = this.renderer;
    const tr = shot.transition;
    const wf = tr?.type === "wipe" ? tr.frames ?? 14 : 0;
    if (shot.bands) {
      const b = shot.bands;
      const local = base.localFrame / ep.fps;
      this.renderLook(frame, shot.look, 6);
      const rr = b.looks.map((_, i) => clamp01((local - b.start - i * b.stagger) / 0.55));
      b.looks.forEach((l, i) => (rr[i] > 0 ? this.renderLook(frame, l, i) : null));
      const u = this.bands.u;
      b.looks.forEach((_, i) => (u[`t${i}`].value = this.rts[i].texture));
      u.tBase.value = this.rts[6].texture;
      u.uN.value = b.looks.length;
      u.uR.value = rr.map((x) => ease.inOut(x));
      (u.uRes.value as THREE.Vector2).set(this.W, this.H);
      this.bands.run(r, null);
    } else if (tr?.type === "wipe" && tr.from && base.localFrame < wf + 1) {
      this.renderLook(frame, tr.from, 0);
      this.renderLook(frame, shot.look, 1);
      this.wipe.u.tA.value = this.rts[0].texture;
      this.wipe.u.tB.value = this.rts[1].texture;
      this.wipe.u.uP.value = ease.inOut(clamp01(base.localFrame / wf));
      (this.wipe.u.uAccent.value as THREE.Color).set(look.accent);
      this.wipe.run(r, null);
    } else {
      this.renderLook(frame, shot.look, 0);
      this.copy.u.tA.value = this.rts[0].texture;
      this.copy.run(r, null);
    }
    // final image = WebGL plate + MG layer
    const g = this.g2;
    g.clearRect(0, 0, this.W, this.H);
    g.drawImage(this.cfg.canvas, 0, 0, this.W, this.H);
    const time = this.timeAt(frame, look);
    drawMG({ g, w: this.W, h: this.H, shot, time, accent: look.accent });
    return { shot: shot.id, look: shot.look };
  }

  /**
   * QC probe for one frame (no pixels): contact errors of keyed reaches and puppet/set
   * penetration depth, plus a pose signature for on-twos checks.
   */
  inspect(frame: number) {
    const ep = this.cfg.episode;
    const t0 = this.timeAt(frame, this.cfg.looks[ep.shots[0].look]);
    const shot = ep.shots[t0.shotIndex];
    const st = this.stage(shot.look);
    const time = this.timeAt(frame, st.look);
    this.poseActors(st, time.shotIndex, time.poseT);
    const state = stateAt(shot, this.starts[time.shotIndex], time.poseT);
    this.cfg.hooks.update(st.handles, state, shot, time);
    st.handles.root.updateMatrixWorld(true);
    const contacts: { actor: string; hand: string; mode: string; pose: string; gap: number; surface: number }[] = [];
    const pen: { actor: string; part: string; collider: string; depth: number }[] = [];
    const sig: Record<string, string> = {};
    const v = new THREE.Vector3();
    const boxes = st.handles.colliders.map((c) => ({ name: c.name || c.userData.sem, box: new THREE.Box3().setFromObject(c) }));
    for (const [id, pup] of Object.entries(st.handles.actors)) {
      const tr = this.tracks[time.shotIndex][id];
      const s = sampleTrack(tr, time.poseT);
      sig[id] = `${s.a}>${s.b}@${s.u.toFixed(3)}`;
      if (s.u === 0) {
        const p = this.resolved(st, id, s.a);
        for (const c of p.contacts) {
          if (c.mode === "free") continue;
          // exact: distance from the target point to the hand box; surface: lowest corner vs surface (− = sinking)
          contacts.push({
            actor: id, hand: c.hand, mode: c.mode, pose: s.a,
            gap: +pup.handDistance(c.hand as "L" | "R", c.target).toFixed(4),
            surface: +(pup.handLowestY(c.hand as "L" | "R") - c.target.y).toFixed(4),
          });
        }
      }
      for (const part of pup.parts) {
        part.mesh.updateMatrixWorld(true);
        for (const b of boxes) {
          let depth = 0;
          for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
            v.set(sx * part.half.x, sy * part.half.y, sz * part.half.z).applyMatrix4(part.mesh.matrixWorld);
            if (b.box.containsPoint(v)) {
              const d = Math.min(v.x - b.box.min.x, b.box.max.x - v.x, v.y - b.box.min.y, b.box.max.y - v.y, v.z - b.box.min.z, b.box.max.z - v.z);
              depth = Math.max(depth, d);
            }
          }
          if (depth > 0.004) pen.push({ actor: id, part: part.name, collider: b.name, depth: +depth.toFixed(4) });
        }
      }
    }
    return { frame, shot: shot.id, look: shot.look, localFrame: time.localFrame, poseT: time.poseT, sig, contacts, pen, state };
  }

  meta() {
    const ep = this.cfg.episode;
    return {
      title: ep.title, fps: ep.fps, width: this.W, height: this.H, total: this.total,
      shots: ep.shots.map((s, i) => ({ id: s.id, look: s.look, start: this.frameStarts[i], frames: shotFrames(s, ep.fps), camera: s.camera, beat: s.beat })),
      events: ep.shots.flatMap((s, i) => (s.events ?? []).map((e) => ({ shot: s.id, frame: this.frameStarts[i] + Math.round(e.t * ep.fps), set: e.set }))),
    };
  }
}
```

### 27/55 · `stop-motion-3d/assets/template/src/runtime/mg.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/mg.ts", "lines": 173, "final_newline": true, "sha256": "03e569552a03c88f9a397ce91d18635c01b1eff495bbc52bdaceebe7fa1fa708", "original_sha256": "03e569552a03c88f9a397ce91d18635c01b1eff495bbc52bdaceebe7fa1fa708"} -->
```ts
import type { MgItem, Shot, StageTime } from "./types";
import { clamp01, ease } from "./rng";

/**
 * MG (motion-graphics) layer: flat 2D information drawn over the 3D plate — titles, chips,
 * lower thirds, end cards. Stop-motion ACTS; MG EXPLAINS. MG runs on the continuous clock.
 */
export const FONT = "'Noto Sans CJK SC', 'Noto Sans CJK', sans-serif";

export interface MgContext {
  g: CanvasRenderingContext2D;
  w: number;
  h: number;
  shot: Shot;
  time: StageTime;
  accent: string;
}

type Drawer = (c: MgContext, it: MgItem, k: number, local: number) => void;

function inOut(it: MgItem, t: number, fade = 0.35) {
  const a = clamp01((t - it.from) / fade), b = clamp01((it.to - t) / fade);
  return Math.min(ease.out(a), ease.out(b));
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export const MG: Record<string, Drawer> = {
  /** big centered title with a subtitle (opening / end) */
  title(c, it, k) {
    const { g, w, h } = c;
    g.save();
    g.globalAlpha = k;
    const y = h * ((it.y as number) ?? 0.42) + (1 - k) * 18;
    g.textAlign = "center";
    if (it.panel) {
      g.font = `800 ${(it.size as number) ?? 86}px ${FONT}`;
      const tw = g.measureText(it.text ?? "").width + 120;
      const ph = (it.size as number ?? 86) + (it.sub ? 90 : 40);
      g.fillStyle = "rgba(14,16,21,0.62)";
      roundRect(g, w / 2 - tw / 2, y - (it.size as number ?? 86) - 18, tw, ph, 22);
      g.fill();
    }
    g.shadowColor = "rgba(0,0,0,0.45)";
    g.shadowBlur = 18;
    g.fillStyle = (it.color as string) ?? "#fbf7ef";
    g.font = `800 ${(it.size as number) ?? 86}px ${FONT}`;
    g.fillText(it.text ?? "", w / 2, y);
    if (it.sub) {
      g.font = `500 ${(it.subSize as number) ?? 30}px ${FONT}`;
      g.fillStyle = (it.subColor as string) ?? "#f2ead8";
      g.fillText(it.sub, w / 2, y + ((it.subGap as number) ?? 58));
    }
    g.restore();
  },
  /** top-left index chip "02 / 06" with the accent color */
  chip(c, it, k) {
    const { g } = c;
    g.save();
    g.globalAlpha = k;
    const x = 44 - (1 - k) * 30, y = 40;
    g.fillStyle = (it.color as string) ?? c.accent;
    roundRect(g, x, y, 128, 40, 20);
    g.fill();
    g.fillStyle = "#15171c";
    g.font = `800 22px ${FONT}`;
    g.textAlign = "center";
    g.fillText(it.text ?? "", x + 64, y + 28);
    g.restore();
  },
  /** lower third: small tag line, big style name (zh), English line */
  lower(c, it, k) {
    const { g, h } = c;
    g.save();
    g.globalAlpha = k;
    const x = 56 - (1 - k) * 40, y = h - 118;
    g.font = `800 50px ${FONT}`;
    const wName = g.measureText(it.text ?? "").width;
    g.font = `600 21px ${FONT}`;
    const wSub = g.measureText(it.sub ?? "").width;
    const bw = Math.max(wName, wSub, 300) + 48;
    g.fillStyle = "rgba(14,16,21,0.74)";
    roundRect(g, x - 18, y - 84, bw, 142, 16);
    g.fill();
    g.fillStyle = (it.color as string) ?? c.accent;
    g.fillRect(x - 18, y - 84, 8, 142);
    g.textAlign = "left";
    if (it.tags) {
      g.font = `600 18px ${FONT}`;
      g.fillStyle = (it.color as string) ?? c.accent;
      g.fillText(String(it.tags), x + 8, y - 52);
    }
    g.font = `800 50px ${FONT}`;
    g.fillStyle = "#fbf7ef";
    g.fillText(it.text ?? "", x + 6, y + 4);
    g.font = `600 21px ${FONT}`;
    g.fillStyle = "#c9ccd4";
    g.fillText(it.sub ?? "", x + 8, y + 40);
    g.restore();
  },
  /** small caption line (who is doing what) at the top right */
  note(c, it, k) {
    const { g, w } = c;
    g.save();
    g.globalAlpha = k * 0.95;
    g.textAlign = "right";
    g.font = `600 22px ${FONT}`;
    g.fillStyle = "#fbf7ef";
    g.shadowColor = "rgba(0,0,0,0.6)";
    g.shadowBlur = 8;
    g.fillText(it.text ?? "", w - 48, 70);
    if (it.sub) {
      g.font = `500 17px ${FONT}`;
      g.fillStyle = "#e3e5ea";
      g.fillText(it.sub, w - 48, 98);
    }
    g.restore();
  },
  /** labels under each band of a split-screen */
  bandLabels(c, it, _k, local) {
    const { g, w, h, shot } = c;
    const b = shot.bands;
    if (!b) return;
    const n = b.looks.length;
    const labels = (it.labels as string[]) ?? b.looks;
    g.save();
    g.textAlign = "center";
    for (let i = 0; i < n; i++) {
      const kk = clamp01((local - b.start - i * b.stagger - 0.3) / 0.4);
      if (kk <= 0) continue;
      g.globalAlpha = ease.out(kk) * clamp01((it.to - local) / 0.4);
      const cx = ((i + 0.5) / n) * w;
      g.fillStyle = "rgba(14,16,21,0.75)";
      roundRect(g, cx - 78, h - 86 + (1 - kk) * 10, 156, 40, 20);
      g.fill();
      g.fillStyle = "#fbf7ef";
      g.font = `700 20px ${FONT}`;
      g.fillText(labels[i], cx, h - 59 + (1 - kk) * 10);
    }
    g.restore();
  },
  /** persistent small watermark */
  mark(c, it, k) {
    const { g, w, h } = c;
    g.save();
    g.globalAlpha = 0.75 * k;
    g.textAlign = "right";
    g.font = `700 18px ${FONT}`;
    g.fillStyle = "#fbf7ef";
    g.shadowColor = "rgba(0,0,0,0.5)";
    g.shadowBlur = 6;
    g.fillText(it.text ?? "stop-motion-3d", w - 36, h - 30);
    g.restore();
  },
};

export function drawMG(c: MgContext) {
  for (const it of c.shot.mg ?? []) {
    const t = c.time.t;
    if (t < it.from || t > it.to) continue;
    const k = inOut(it, t, (it.fade as number) ?? 0.35);
    const d = MG[it.kind];
    if (d) d(c, it, k, t);
  }
}
```

### 28/55 · `stop-motion-3d/assets/template/src/runtime/post.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/post.ts", "lines": 155, "final_newline": true, "sha256": "eae9326a83136f54aaf13a766b2cbf66b86d311a1fe3712db19225e2f2708359", "original_sha256": "eae9326a83136f54aaf13a766b2cbf66b86d311a1fe3712db19225e2f2708359"} -->
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

### 29/55 · `stop-motion-3d/assets/template/src/runtime/rig.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/rig.ts", "lines": 331, "final_newline": true, "sha256": "cc5a9c8d5a44ae339d64cb95135a50abc008d08b2e6b7044c8e633adcf103474", "original_sha256": "cc5a9c8d5a44ae339d64cb95135a50abc008d08b2e6b7044c8e633adcf103474"} -->
```ts
import * as THREE from "three";
import type { Costume, Vec3 } from "./types";
import type { Prims } from "../looks/types";

/** 1 px = 5.5 cm. The puppet is 32 px (1.76 m) tall, built from rigid parts on pivots. */
export const PX = 0.055;
const D2R = Math.PI / 180;

export type Joint = "torso" | "head" | "armL" | "armR" | "legL" | "legR";
export const JOINTS: Joint[] = ["torso", "head", "armL", "armR", "legL", "legR"];

export interface Reach {
  /** anchor name on the actor's desk ("keyboard", "mug_home") or "mouth" */
  reach: string;
  /** offset in the anchor's local frame (meters) */
  offset?: Vec3;
  /** exact contact: the torso leans to make the hand land exactly on the point (one hand per pose) */
  exact?: boolean;
  /** hover height above the point (0 = touching) */
  lift?: number;
}

export interface PoseSpec {
  base?: string;
  sit?: boolean;
  lift?: number;
  torso?: Vec3;
  head?: Vec3;
  armL?: Vec3;
  armR?: Vec3;
  legL?: Vec3;
  legR?: Vec3;
  handL?: Reach;
  handR?: Reach;
  /** tilt of a held prop around the hand's X axis (pouring, showing) in degrees */
  tiltR?: number;
  tiltL?: number;
}

export interface ResolvedPose {
  hipY: number;
  rot: Record<Joint, [number, number, number]>; // radians
  tiltR: number;
  tiltL: number;
  /** which hands were solved to a contact target (for QC) */
  contacts: { hand: "L" | "R"; target: THREE.Vector3; mode: "exact" | "surface" | "free" }[];
}

export interface PartRef {
  name: string;
  mesh: THREE.Mesh;
  /** local half extents of the box, meters */
  half: THREE.Vector3;
}

/**
 * The rigid puppet. It knows sizes, pivots and SEMANTIC materials only — the look's Prims decide
 * whether a part is a textured cuboid, a clay lump, a paper cut-out or a voxel stack.
 */
export class Puppet {
  root = new THREE.Group();
  hips = new THREE.Group();
  torso = new THREE.Group();
  neck = new THREE.Group();
  sh = { L: new THREE.Group(), R: new THREE.Group() };
  leg = { L: new THREE.Group(), R: new THREE.Group() };
  socket = { L: new THREE.Group(), R: new THREE.Group() };
  parts: PartRef[] = [];
  /** where "mouth" reaches go (front of face) */
  mouth = new THREE.Object3D();

  constructor(private P: Prims, public id: string, public costume: Costume) {
    const c = costume;
    const cloth = `cloth:${c.top}`, pants = `cloth:${c.bottom}`, skin = `skin:${c.skin}`, hair = `hair:${c.hair}`;
    this.root.name = `actor:${id}`;
    this.root.add(this.hips);
    // legs pivot at the hip
    for (const s of ["L", "R"] as const) {
      const g = this.leg[s];
      g.position.set((s === "L" ? -2 : 2) * PX, 0, 0);
      this.hips.add(g);
      this.part(g, `leg${s}`, [4, 10, 4], [0, -5, 0], pants);
      this.part(g, `shoe${s}`, [4.2, 2, 4.8], [0, -11, 0.35], `shoe:${"#2a2b30"}`);
    }
    this.hips.add(this.torso);
    this.part(this.torso, "body", [8, 12, 4], [0, 6, 0], cloth);
    // head on the neck pivot
    this.neck.position.set(0, 12 * PX, 0);
    this.torso.add(this.neck);
    this.part(this.neck, "head", [8, 8, 8], [0, 4, 0], skin);
    this.mouth.position.set(0, 2.6 * PX, 4.6 * PX);
    this.neck.add(this.mouth);
    this.face(hair);
    // arms: sleeve + hand, socket at the hand tip
    for (const s of ["L", "R"] as const) {
      const g = this.sh[s];
      g.position.set((s === "L" ? -6 : 6) * PX, 10 * PX, 0);
      this.torso.add(g);
      this.part(g, `arm${s}`, [4, 7.5, 4], [0, -1.75, 0], cloth);
      this.part(g, `hand${s}`, [3.6, 3, 3.6], [0, -7, 0], skin);
      this.socket[s].position.set(0, -8.5 * PX, 0);
      g.add(this.socket[s]);
    }
    this.root.traverse((o) => ((o as THREE.Mesh).isMesh ? (o.userData.dynamic = true) : null));
  }

  private part(parent: THREE.Object3D, name: string, size: Vec3, off: Vec3, sem: string) {
    const m = this.P.box(size[0] * PX, size[1] * PX, size[2] * PX, sem, { dynamic: true, name });
    m.position.set(off[0] * PX, off[1] * PX, off[2] * PX);
    parent.add(m);
    this.parts.push({ name, mesh: m, half: new THREE.Vector3(size[0], size[1], size[2]).multiplyScalar(PX / 2) });
    return m;
  }

  private deco(parent: THREE.Object3D, size: Vec3, off: Vec3, sem: string) {
    const m = this.P.box(size[0] * PX, size[1] * PX, size[2] * PX, sem, { dynamic: true });
    m.position.set(off[0] * PX, off[1] * PX, off[2] * PX);
    parent.add(m);
    return m;
  }

  private face(hair: string) {
    const c = this.costume, n = this.neck;
    const eyes = `eyes:${c.eyes ?? "#1a1b22"}`;
    // eyes + mouth (geometry, so every look can read the face)
    this.deco(n, [1.3, 1.7, 0.5], [-1.8, 4.3, 4.1], eyes);
    this.deco(n, [1.3, 1.7, 0.5], [1.8, 4.3, 4.1], eyes);
    this.deco(n, [2.2, 0.45, 0.4], [0, 2.3, 4.05], `eyes:#8a4a3a`);
    const style = c.hairStyle ?? "short";
    if (style === "beanie") {
      this.deco(n, [9, 3.4, 9], [0, 7.6, 0], `cloth:${c.top}`);
      this.deco(n, [9.2, 1, 9.2], [0, 6.1, 0], `cloth:#e9e3d6`);
    } else {
      this.deco(n, [8.6, 2.2, 8.6], [0, 7.3, 0], hair); // cap
      this.deco(n, [8.6, style === "long" ? 9 : 5.5, 1.4], [0, style === "long" ? 3.2 : 5, -4.1], hair); // back
      this.deco(n, [1.2, 3.5, 8.6], [-4.1, 5.6, 0], hair);
      this.deco(n, [1.2, 3.5, 8.6], [4.1, 5.6, 0], hair);
      this.deco(n, [8.6, 1.3, 1], [0, 6.3, 4.1], hair); // fringe
      if (style === "bun") this.deco(n, [3.6, 3, 3.6], [0, 9.2, -1.5], hair);
      if (style === "spiky") for (const x of [-3, -1, 1, 3]) this.deco(n, [1.6, 1.8, 1.6], [x, 9, (x % 2) * 0.8], hair);
    }
    if (c.glasses) {
      const f = "plasticDark";
      for (const x of [-1.8, 1.8]) {
        this.deco(n, [2.8, 0.4, 0.3], [x, 5.4, 4.35], f);
        this.deco(n, [2.8, 0.4, 0.3], [x, 3.3, 4.35], f);
        this.deco(n, [0.4, 2.4, 0.3], [x - 1.2, 4.35, 4.35], f);
        this.deco(n, [0.4, 2.4, 0.3], [x + 1.2, 4.35, 4.35], f);
      }
      this.deco(n, [1, 0.4, 0.3], [0, 4.9, 4.35], f);
    }
    if (c.headphones) {
      this.deco(n, [9.6, 1, 2.2], [0, 8.6, 0], "plasticDark");
      this.deco(n, [1, 4, 2.2], [-4.6, 6.6, 0], "plasticDark");
      this.deco(n, [1, 4, 2.2], [4.6, 6.6, 0], "plasticDark");
      this.deco(n, [1.6, 3.6, 3.4], [-4.9, 4.2, 0], `neon:#27e3ff`);
      this.deco(n, [1.6, 3.6, 3.4], [4.9, 4.2, 0], `neon:#27e3ff`);
    }
  }

  apply(p: ResolvedPose) {
    this.hips.position.y = p.hipY;
    const set = (g: THREE.Object3D, r: [number, number, number]) => g.rotation.set(r[0], r[1], r[2]);
    set(this.torso, p.rot.torso);
    set(this.neck, p.rot.head);
    set(this.sh.L, p.rot.armL);
    set(this.sh.R, p.rot.armR);
    set(this.leg.L, p.rot.legL);
    set(this.leg.R, p.rot.legR);
    // held props stay upright: socket = (torso · arm)^-1 · tilt, so a prop keeps the hips' frame
    // (character forward = +Z) whatever the arm does, then the pose's tilt pours/shows it
    for (const s of ["L", "R"] as const) {
      const arm = s === "L" ? p.rot.armL : p.rot.armR;
      const tilt = s === "L" ? p.tiltL : p.tiltR;
      _qa.setFromEuler(_e.set(p.rot.torso[0], p.rot.torso[1], p.rot.torso[2]));
      _qb.setFromEuler(_e.set(arm[0], arm[1], arm[2]));
      _qa.multiply(_qb).invert();
      _qb.setFromEuler(_e.set(tilt, 0, 0));
      this.socket[s].quaternion.copy(_qa.multiply(_qb));
    }
  }

  /** hand tip in world space (end face center of the hand box) */
  tip(s: "L" | "R", out = new THREE.Vector3()) {
    return this.socket[s].getWorldPosition(out);
  }

  /** distance from a world point to the hand box (0 = touching / inside) — the real contact metric */
  handDistance(s: "L" | "R", point: THREE.Vector3) {
    const part = this.parts.find((p) => p.name === `hand${s}`)!;
    const local = part.mesh.worldToLocal(point.clone());
    const cl = local.clone().clamp(part.half.clone().negate(), part.half);
    return part.mesh.localToWorld(cl).distanceTo(point);
  }

  /** lowest world Y of the hand box's 8 corners */
  handLowestY(s: "L" | "R") {
    const part = this.parts.find((p) => p.name === `hand${s}`)!;
    let y = Infinity;
    const v = new THREE.Vector3();
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      v.set(sx * part.half.x, sy * part.half.y, sz * part.half.z).applyMatrix4(part.mesh.matrixWorld);
      y = Math.min(y, v.y);
    }
    return y;
  }
}

const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _e = new THREE.Euler();

// ── pose resolution (library → joint angles, with contact IK) ────────────────
const HAND_TIP = 8.5 * PX; // shoulder pivot → hand tip

export interface AnchorLookup {
  (name: string): THREE.Object3D | undefined;
}

export function mergeSpec(name: string, lib: Record<string, PoseSpec>, depth = 0): PoseSpec {
  const s = lib[name];
  if (!s) throw new Error(`unknown pose "${name}"`);
  if (!s.base || depth > 8) return s;
  return { ...mergeSpec(s.base, lib, depth + 1), ...s };
}

function deg(v?: Vec3): [number, number, number] {
  return v ? [v[0] * D2R, v[1] * D2R, v[2] * D2R] : [0, 0, 0];
}

/** Aim an arm (pointing −Y at rest) at a world point. Euler XYZ: x = atan2(−dz, −dy), z = asin(dx). */
function aimArm(pup: Puppet, s: "L" | "R", target: THREE.Vector3): [number, number, number] {
  pup.root.updateMatrixWorld(true);
  const local = pup.torso.worldToLocal(target.clone()).sub(pup.sh[s].position).normalize();
  const z = Math.asin(Math.max(-1, Math.min(1, local.x)));
  const x = Math.atan2(-local.z, -local.y);
  return [x, 0, z];
}

function shoulderWorld(pup: Puppet, s: "L" | "R") {
  pup.root.updateMatrixWorld(true);
  return pup.sh[s].getWorldPosition(new THREE.Vector3());
}

/**
 * Resolve a pose for one puppet at its current root transform. Reaches become joint angles:
 *  - exact hand: the torso leans until shoulder→target distance equals the arm length, then aims
 *  - other hands: land on the anchor's surface plane at arm's length, nearest to the target
 * Then the hand's lowest corner is measured and the target raised so nothing sinks into the desk.
 */
export function resolvePose(pup: Puppet, spec: PoseSpec, anchors: AnchorLookup, seatTop: number): ResolvedPose {
  const rot: ResolvedPose["rot"] = {
    torso: deg(spec.torso), head: deg(spec.head), armL: deg(spec.armL), armR: deg(spec.armR), legL: deg(spec.legL), legR: deg(spec.legR),
  };
  const hipY = (spec.sit ? seatTop + 2 * PX : 12 * PX) + (spec.lift ?? 0);
  const p: ResolvedPose = { hipY, rot, tiltR: (spec.tiltR ?? 0) * D2R, tiltL: (spec.tiltL ?? 0) * D2R, contacts: [] };
  pup.apply(p);
  const reaches = (["L", "R"] as const).filter((s) => (s === "L" ? spec.handL : spec.handR));
  if (!reaches.length) return p;

  const targetOf = (r: Reach) => {
    const a = r.reach === "mouth" ? pup.mouth : anchors(r.reach);
    if (!a) throw new Error(`actor ${pup.id}: unknown anchor "${r.reach}"`);
    a.updateWorldMatrix(true, false);
    return a.localToWorld(new THREE.Vector3(...(r.offset ?? [0, 0, 0]))).add(new THREE.Vector3(0, r.lift ?? 0, 0));
  };

  // exact hand: turn the torso toward the target (yaw) and lean (pitch, bisection) until
  // |shoulder − target| = arm length; the hand then lands exactly on the point.
  const exact = reaches.find((s) => (s === "L" ? spec.handL : spec.handR)!.exact);
  if (exact) {
    const tgt = targetOf((exact === "L" ? spec.handL : spec.handR)!);
    if (!spec.torso || spec.torso[1] === 0) {
      pup.root.updateMatrixWorld(true);
      const local = pup.hips.worldToLocal(tgt.clone());
      const side = exact === "L" ? -6 * PX : 6 * PX;
      rot.torso = [rot.torso[0], Math.atan2(local.x - side, Math.max(0.05, local.z)) * 0.55, rot.torso[2]];
    }
    let lo = -30 * D2R, hi = 45 * D2R;
    const f = (pitch: number) => {
      rot.torso = [pitch, rot.torso[1], rot.torso[2]];
      pup.apply(p);
      return shoulderWorld(pup, exact).distanceTo(tgt) - HAND_TIP;
    }
    if (f(lo) * f(hi) < 0) {
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        if (f(lo) * f(mid) <= 0) hi = mid;
        else lo = mid;
      }
      f((lo + hi) / 2);
    }
  }

  // hands: exact → aim at the point; surface → land on the plane at arm's length nearest the point.
  // Then measure the hand's lowest corner and raise the plane by how far it sank (3 passes).
  const comp: Record<string, number> = {};
  for (let pass = 0; pass < 4; pass++) {
    for (const s of reaches) {
      const r = (s === "L" ? spec.handL : spec.handR)!;
      const tgt = targetOf(r);
      const planeY = tgt.y + (comp[s] ?? 0);
      const aim = new THREE.Vector3(tgt.x, planeY, tgt.z);
      const sw = shoulderWorld(pup, s);
      if (!r.exact && r.reach !== "mouth") {
        const dy = sw.y - planeY;
        if (Math.abs(dy) < HAND_TIP) {
          const rho = Math.sqrt(HAND_TIP * HAND_TIP - dy * dy);
          const h = new THREE.Vector2(tgt.x - sw.x, tgt.z - sw.z);
          const len = h.length() || 1;
          aim.set(sw.x + (h.x / len) * rho, planeY, sw.z + (h.y / len) * rho);
        }
      }
      const a = aimArm(pup, s, aim);
      if (s === "L") rot.armL = a;
      else rot.armR = a;
      pup.apply(p);
      if (r.reach !== "mouth" && !r.lift) {
        pup.root.updateMatrixWorld(true);
        comp[s] = (comp[s] ?? 0) + (tgt.y - pup.handLowestY(s));
      }
      if (pass === 3) p.contacts.push({ hand: s, target: tgt, mode: r.reach === "mouth" || r.lift ? "free" : r.exact ? "exact" : "surface" });
    }
  }
  return p;
}

export function blendPose(a: ResolvedPose, b: ResolvedPose, u: number): ResolvedPose {
  const l = (x: number, y: number) => x + (y - x) * u;
  const rot = {} as ResolvedPose["rot"];
  for (const j of JOINTS) rot[j] = [l(a.rot[j][0], b.rot[j][0]), l(a.rot[j][1], b.rot[j][1]), l(a.rot[j][2], b.rot[j][2])];
  return { hipY: l(a.hipY, b.hipY), rot, tiltR: l(a.tiltR, b.tiltR), tiltL: l(a.tiltL, b.tiltL), contacts: u < 0.5 ? a.contacts : b.contacts };
}
```

### 30/55 · `stop-motion-3d/assets/template/src/runtime/rng.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/rng.ts", "lines": 30, "final_newline": true, "sha256": "67855f69556b0043f68d6875651b2be7d4a8b1f8e737bc1830f446cd6c581d82", "original_sha256": "67855f69556b0043f68d6875651b2be7d4a8b1f8e737bc1830f446cd6c581d82"} -->
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

### 31/55 · `stop-motion-3d/assets/template/src/runtime/types.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/runtime/types.ts", "lines": 158, "final_newline": true, "sha256": "1bfbf919bfca9f2cb69b0b8ce1140081fe8672f4ac16bb0a6fc0f5ce4f4751a9", "original_sha256": "1bfbf919bfca9f2cb69b0b8ce1140081fe8672f4ac16bb0a6fc0f5ce4f4751a9"} -->
```ts
// ─────────────────────────────────────────────────────────────────────────────
// Data contracts. The WORLD (sandbox) and the EPISODE (film) are plain JSON that
// match these types. Code builds the world once; episodes only reference it.
// ─────────────────────────────────────────────────────────────────────────────
export type Vec3 = [number, number, number];
export type StateValue = boolean | number | string;
export type WorldState = Record<string, StateValue>;
export type Ease = "linear" | "inOut" | "in" | "out";

export interface CamKey {
  pos: Vec3;
  target: Vec3;
  fov?: number;
}

/** A named, pre-rigged camera. `to` makes it a move; omit for a locked-off shot. */
export interface CameraDef {
  id: string;
  role: string;
  fov: number;
  from: CamKey;
  to?: CamKey;
  ease?: Ease;
}

/** A tape mark on the stage floor: where an actor stands or sits, and which way they face. */
export interface Mark {
  pos: Vec3;
  yaw: number; // degrees around +Y, 0 = facing +Z
}

export interface Costume {
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  eyes?: string;
  hairStyle?: "short" | "bun" | "long" | "beanie" | "spiky";
  glasses?: boolean;
  headphones?: boolean;
}

export interface ActorDef {
  name: string;
  mark: string;
  /** desk (set piece) this actor works at — its anchors resolve IK targets like "keyboard" */
  desk?: string;
  seated?: boolean;
  costume: Costume;
  /** what the actor does when a shot gives them no acting: a seeded background loop */
  ambient?: "typing" | "idle" | "none";
}

/** A workstation: desk + chair + props, with its actor seated at the desk's "seat" mark. */
export interface DeskItem {
  type: string; // prop library id
  at: [number, number]; // desk-local x, z (actor sits at z = -0.56 facing +Z; right hand = +X)
  y?: number; // base height (props built from the floor, e.g. a plant placed ON the desk: 0.75)
  yaw?: number;
  params?: Record<string, unknown>;
}
export interface DeskSpec {
  x: number;
  z: number;
  actor: string;
  chair: string;
  items: DeskItem[];
}

/** world.json — the sandbox's public contract. Episodes read ONLY this, never the build code. */
export interface WorldManifest {
  desks: Record<string, DeskSpec>;
  /** state keys for holdable props: value = "home" | "<actor>.R" | "<actor>.L" */
  holdables: Record<string, { desk: string; home: string }>;
  id: string;
  title: string;
  variants: string[];
  state: WorldState;
  marks: Record<string, Mark>;
  cameras: CameraDef[];
  actors: Record<string, ActorDef>;
}

// ── episode ──────────────────────────────────────────────────────────────────
/** One acting key: at local time `at` the actor reaches `pose`. `ease: "hold"` = snap (no in-between). */
export interface ActKey {
  actor: string;
  at: number;
  pose: string;
  ease?: Ease | "hold";
}
/** A generated loop (typing, drawing...) expanded into keys by the engine. */
export interface ActLoop {
  actor: string;
  loop: string;
  from: number;
  to: number;
  rate?: number;
}
export type Acting = ActKey | ActLoop;

export interface ShotEvent {
  t: number;
  set: WorldState;
}

export interface Transition {
  type: "cut" | "wipe";
  /** the look the shot starts in; it wipes into shot.look */
  from?: string;
  frames?: number;
}

export interface MgItem {
  kind: string; // "chip" | "title" | "lower" | "card" | ...
  from: number;
  to: number;
  text?: string;
  sub?: string;
  [k: string]: unknown;
}

export interface Shot {
  id: string;
  beat: string;
  story_function: string;
  duration: number; // seconds
  camera: string;
  look: string;
  variant?: string;
  transition?: Transition;
  acting?: Acting[];
  events?: ShotEvent[];
  state?: WorldState;
  mg?: MgItem[];
  /** split-screen reveal: several looks side by side in vertical bands */
  bands?: { looks: string[]; start: number; stagger: number };
}

export interface Episode {
  title: string;
  world: string;
  fps: number;
  width: number;
  height: number;
  shots: Shot[];
}

/** The only time object scene code ever sees. Never read wall-clock time. */
export interface StageTime {
  frame: number; // absolute output frame
  fps: number;
  shotIndex: number;
  localFrame: number;
  t: number; // continuous seconds in shot (camera, particles, light ramps)
  poseT: number; // stepped seconds in shot (puppets, events) — held fps/poseFps frames
  u: number; // 0..1 progress through the shot (continuous)
}
```

### 32/55 · `stop-motion-3d/assets/template/src/world/backdrop.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/world/backdrop.ts", "lines": 89, "final_newline": true, "sha256": "b041bcec9fe54af8dadf2dd53ab3d1ce0932cd24ffacd2f2de0ac4bd27f28d87", "original_sha256": "b041bcec9fe54af8dadf2dd53ab3d1ce0932cd24ffacd2f2de0ac4bd27f28d87"} -->
```ts
import * as THREE from "three";
import { rng } from "../runtime/rng";

/**
 * Painted backdrop seen through the windows: sky gradient + two rows of city silhouettes with
 * lit windows. "Infinity" is painted, never modeled. Deterministic (seeded).
 */
export function cityBackdrop(variant: "day" | "night"): THREE.CanvasTexture {
  const W = 2048, H = 768;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  const sky = g.createLinearGradient(0, 0, 0, H);
  if (variant === "day") {
    sky.addColorStop(0, "#7fb4e6");
    sky.addColorStop(0.65, "#cfe3f2");
    sky.addColorStop(1, "#f4e7d2");
  } else {
    sky.addColorStop(0, "#070a1c");
    sky.addColorStop(0.6, "#1b1840");
    sky.addColorStop(1, "#4a2350");
  }
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  const r = rng(variant === "day" ? 21 : 22);
  if (variant === "day") {
    g.fillStyle = "rgba(255,255,255,0.55)";
    for (let i = 0; i < 9; i++) {
      const x = r() * W, y = 60 + r() * 220, w = 120 + r() * 260;
      for (let k = 0; k < 5; k++) g.fillRect(x + k * w * 0.13, y - k * 6 + (k % 2) * 10, w * 0.5, 22 + k * 3);
    }
  } else {
    g.fillStyle = "rgba(255,255,255,0.8)";
    for (let i = 0; i < 140; i++) g.fillRect(r() * W, r() * H * 0.55, 2, 2);
  }
  const rows = [
    { base: H * 0.93, hMin: 140, hMax: 380, col: variant === "day" ? "#9fb1c4" : "#191830", win: variant === "day" ? "#b9c8d6" : "#ffcf7a", p: 0.18 },
    { base: H * 1.0, hMin: 200, hMax: 520, col: variant === "day" ? "#6f8499" : "#0e0d1d", win: variant === "day" ? "#8ea4b8" : "#ffd98a", p: 0.3 },
  ];
  for (const row of rows) {
    let x = -20;
    while (x < W) {
      const w = 60 + r() * 140, h = row.hMin + r() * (row.hMax - row.hMin);
      g.fillStyle = row.col;
      g.fillRect(x, row.base - h, w, h);
      if (r() < 0.3) g.fillRect(x + w * 0.4, row.base - h - 40, 6, 40); // antenna
      g.fillStyle = row.win;
      for (let wy = row.base - h + 14; wy < row.base - 12; wy += 18)
        for (let wx = x + 8; wx < x + w - 10; wx += 14) if (r() < row.p) g.fillRect(wx, wy, 7, 9);
      x += w + 4 + r() * 16;
    }
  }
  if (variant === "night") {
    // neon signs on the far skyline
    const neon = ["#ff3fa4", "#27e3ff", "#b36bff"];
    for (let i = 0; i < 10; i++) {
      g.fillStyle = neon[i % 3];
      g.fillRect(r() * W, H * 0.55 + r() * H * 0.3, 30 + r() * 50, 6);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** The studio TV / logo card. */
export function logoTexture(): THREE.CanvasTexture {
  const W = 1024, H = 576;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  g.fillStyle = "#101318";
  g.fillRect(0, 0, W, H);
  const cols = ["#e0663f", "#f2c14e", "#3f9ad6", "#57b36a", "#b36bff", "#ff3fa4"];
  // six style swatches in a 3x2 grid (one per look) — the studio's "render wall"
  cols.forEach((c, i) => {
    g.fillStyle = c;
    g.fillRect(170 + (i % 3) * 240, 90 + Math.floor(i / 3) * 190, 200, 160);
  });
  g.fillStyle = "#f4efe6";
  g.font = "700 40px 'Noto Sans CJK SC', sans-serif";
  g.textAlign = "center";
  g.fillText("stop-motion-3d", W / 2, 520);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
```

### 33/55 · `stop-motion-3d/assets/template/src/world/hooks.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/world/hooks.ts", "lines": 14, "final_newline": true, "sha256": "ec7bd0ef11d646972c8167ae26f4855c2d6c2ba29a0f85be744c135ed55631cd", "original_sha256": "ec7bd0ef11d646972c8167ae26f4855c2d6c2ba29a0f85be744c135ed55631cd"} -->
```ts
import type * as THREE from "three";
import type { WorldHooks } from "../runtime/film";
import type { WorldManifest } from "../runtime/types";
import { sinceEvent } from "../runtime/clock";
import { buildStudio, updateStudio, updateWildWalls, type StudioHandles } from "./studio";

/** Glue between the generic film runtime and THIS sandbox. */
export function studioHooks(world: WorldManifest): WorldHooks<StudioHandles> {
  return {
    build: (P, variant, reg) => buildStudio(P, world, variant, reg.colliders, reg.screens),
    update: (h, state, shot, time) => updateStudio(h, state, time.t, time.frame / time.fps, sinceEvent(shot, "rin.pour", time.t)),
    beforeRender: (h, cam: THREE.PerspectiveCamera) => updateWildWalls(h, cam.position),
  };
}
```

### 34/55 · `stop-motion-3d/assets/template/src/world/palette.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/world/palette.ts", "lines": 39, "final_newline": true, "sha256": "fa99ddf2e2430b8614a21dfc5ea7e9a75c7466289a2de30c0a5ab164debd7458", "original_sha256": "fa99ddf2e2430b8614a21dfc5ea7e9a75c7466289a2de30c0a5ab164debd7458"} -->
```ts
/**
 * World palette: the "truth" color of every semantic material in THIS world.
 * Looks may reinterpret it (pastel, neon, graphite), but start from here so every look agrees
 * on what is warm, what is dark, what is the hero color.
 */
export const PALETTE: Record<string, string> = {
  floor: "#a8774f",
  brick: "#9c5b46",
  plaster: "#e8e1d4",
  wood: "#b98552",
  woodDark: "#6e4a30",
  metal: "#8c929b",
  metalDark: "#3c4048",
  plasticDark: "#26292f",
  plasticLight: "#d9dadd",
  fabric: "#3d4b5e",
  glass: "#bcd9ea",
  plant: "#4f8f4a",
  plantDark: "#356b34",
  soil: "#4a3325",
  terracotta: "#c46a44",
  ceramic: "#f1ede4",
  paper: "#f6f2e8",
  rubber: "#1d1e21",
  cork: "#c79a62",
  whiteboard: "#f4f5f2",
  screen: "#000000",
  tv: "#000000",
  neon: "#ff3fa4",
  glow: "#ffd7a0",
  backdrop: "#9cc7e8",
  sky: "#9cc7e8",
  skin: "#e7b48f",
  hair: "#2b211b",
  cloth: "#667788",
  eyes: "#1a1b22",
  shoe: "#2a2b30",
  accent: "#e0663f",
};
```

### 35/55 · `stop-motion-3d/assets/template/src/world/poses.json`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/world/poses.json", "lines": 784, "final_newline": false, "sha256": "4a2097f0f6127101a7aeee375e3fc5bbbb93d8292371388c4972b2561c74173c", "original_sha256": "4a2097f0f6127101a7aeee375e3fc5bbbb93d8292371388c4972b2561c74173c"} -->
```json
{
 "seated": {
  "sit": true,
  "legL": [
   -90,
   0,
   0
  ],
  "legR": [
   -90,
   0,
   0
  ]
 },
 "seated_idle": {
  "base": "seated",
  "head": [
   10,
   0,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.15,
    0,
    -0.1
   ]
  },
  "handR": {
   "reach": "keyboard",
   "offset": [
    0.15,
    0,
    -0.1
   ]
  }
 },
 "seated_breathe": {
  "base": "seated_idle",
  "torso": [
   -3,
   0,
   0
  ],
  "head": [
   6,
   2,
   0
  ]
 },
 "type_a": {
  "base": "seated",
  "torso": [
   3,
   0,
   0
  ],
  "head": [
   14,
   -2,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.1,
    0,
    0.0
   ]
  },
  "handR": {
   "reach": "keyboard",
   "offset": [
    0.08,
    0,
    0.03
   ]
  }
 },
 "type_b": {
  "base": "seated",
  "torso": [
   3,
   0,
   0
  ],
  "head": [
   13,
   2,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.07,
    0,
    0.03
   ]
  },
  "handR": {
   "reach": "keyboard",
   "offset": [
    0.11,
    0,
    -0.01
   ]
  }
 },
 "look_screen": {
  "base": "seated_idle",
  "head": [
   4,
   0,
   0
  ],
  "torso": [
   2,
   0,
   0
  ]
 },
 "anticipate_enter": {
  "base": "seated",
  "torso": [
   -6,
   -10,
   0
  ],
  "head": [
   16,
   -10,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.1,
    0,
    0.02
   ]
  },
  "handR": {
   "reach": "enter",
   "lift": 0.24
  }
 },
 "hit_enter": {
  "base": "seated",
  "torso": [
   6,
   -4,
   0
  ],
  "head": [
   20,
   -6,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.1,
    0,
    0.02
   ]
  },
  "handR": {
   "reach": "enter",
   "exact": true
  }
 },
 "cheer": {
  "base": "seated",
  "torso": [
   -8,
   0,
   0
  ],
  "head": [
   -14,
   0,
   0
  ],
  "armL": [
   -172,
   0,
   -14
  ],
  "armR": [
   -172,
   0,
   14
  ]
 },
 "cheer_b": {
  "base": "seated",
  "torso": [
   -6,
   0,
   3
  ],
  "head": [
   -10,
   0,
   6
  ],
  "armL": [
   -160,
   0,
   -28
  ],
  "armR": [
   -160,
   0,
   28
  ]
 },
 "reach_mug": {
  "base": "seated",
  "torso": [
   4,
   6,
   0
  ],
  "head": [
   16,
   10,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.12,
    0,
    -0.06
   ]
  },
  "handR": {
   "reach": "mug_home",
   "offset": [
    0.05,
    0.04,
    0
   ],
   "exact": true
  }
 },
 "hold_mug": {
  "base": "seated",
  "torso": [
   -2,
   0,
   0
  ],
  "head": [
   6,
   4,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.12,
    0,
    -0.06
   ]
  },
  "handR": {
   "reach": "mouth",
   "offset": [
    0.06,
    -0.36,
    0.12
   ]
  }
 },
 "sip": {
  "base": "seated",
  "torso": [
   -6,
   0,
   0
  ],
  "head": [
   -14,
   0,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.12,
    0,
    -0.06
   ]
  },
  "handR": {
   "reach": "mouth",
   "offset": [
    0.05,
    -0.13,
    0.03
   ]
  },
  "tiltR": -25
 },
 "content": {
  "base": "seated",
  "torso": [
   -4,
   0,
   0
  ],
  "head": [
   -4,
   0,
   -6
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.12,
    0,
    -0.06
   ]
  },
  "handR": {
   "reach": "mouth",
   "offset": [
    0.07,
    -0.34,
    0.13
   ]
  }
 },
 "set_mug": {
  "base": "reach_mug"
 },
 "reach_sheet": {
  "base": "seated",
  "torso": [
   6,
   8,
   0
  ],
  "head": [
   18,
   12,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.12,
    0,
    -0.06
   ]
  },
  "handR": {
   "reach": "stack",
   "offset": [
    0,
    0.02,
    -0.1
   ],
   "exact": true
  }
 },
 "show_sheet": {
  "base": "seated",
  "torso": [
   -4,
   0,
   0
  ],
  "head": [
   -2,
   -14,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    -0.12,
    0,
    -0.06
   ]
  },
  "handR": {
   "reach": "mouth",
   "offset": [
    0.1,
    -0.02,
    0.34
   ]
  }
 },
 "study_sheet": {
  "base": "show_sheet",
  "head": [
   8,
   0,
   0
  ]
 },
 "point_up": {
  "base": "seated",
  "torso": [
   -2,
   0,
   0
  ],
  "head": [
   -6,
   -10,
   0
  ],
  "armL": [
   -10,
   0,
   -10
  ],
  "armR": [
   -150,
   0,
   8
  ]
 },
 "draw_a": {
  "base": "seated",
  "torso": [
   8,
   0,
   0
  ],
  "head": [
   24,
   -10,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "tablet",
   "offset": [
    -0.05,
    0,
    -0.03
   ],
   "exact": true
  }
 },
 "draw_b": {
  "base": "seated",
  "torso": [
   8,
   0,
   0
  ],
  "head": [
   24,
   -12,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "tablet",
   "offset": [
    0.02,
    0,
    0.02
   ],
   "exact": true
  }
 },
 "draw_c": {
  "base": "seated",
  "torso": [
   8,
   0,
   0
  ],
  "head": [
   23,
   -8,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "tablet",
   "offset": [
    0.06,
    0,
    -0.02
   ],
   "exact": true
  }
 },
 "think": {
  "base": "seated",
  "torso": [
   -2,
   0,
   0
  ],
  "head": [
   2,
   10,
   8
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "mouth",
   "offset": [
    0.03,
    -0.2,
    0.02
   ]
  }
 },
 "tap": {
  "base": "seated",
  "torso": [
   6,
   0,
   0
  ],
  "head": [
   22,
   -8,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "tablet",
   "offset": [
    0.08,
    0,
    0.02
   ],
   "exact": true
  }
 },
 "lean_back": {
  "base": "seated",
  "torso": [
   -14,
   0,
   0
  ],
  "head": [
   -6,
   0,
   0
  ],
  "armL": [
   -14,
   0,
   -16
  ],
  "armR": [
   -14,
   0,
   16
  ]
 },
 "nod_a": {
  "base": "lean_back",
  "head": [
   6,
   0,
   4
  ],
  "torso": [
   -12,
   0,
   2
  ]
 },
 "nod_b": {
  "base": "lean_back",
  "head": [
   -10,
   0,
   -4
  ],
  "torso": [
   -15,
   0,
   -2
  ]
 },
 "point_screen": {
  "base": "seated",
  "torso": [
   6,
   0,
   0
  ],
  "head": [
   8,
   -4,
   0
  ],
  "armL": [
   -14,
   0,
   -16
  ],
  "armR": [
   -82,
   -6,
   -6
  ]
 },
 "fist_pump": {
  "base": "seated",
  "torso": [
   -8,
   0,
   0
  ],
  "head": [
   -12,
   0,
   0
  ],
  "armL": [
   -14,
   0,
   -16
  ],
  "armR": [
   -168,
   0,
   6
  ]
 },
 "reach_can": {
  "base": "seated",
  "torso": [
   6,
   6,
   0
  ],
  "head": [
   18,
   10,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "can_home",
   "offset": [
    0,
    0.155,
    0
   ],
   "exact": true
  }
 },
 "lift_can": {
  "base": "seated",
  "torso": [
   2,
   10,
   0
  ],
  "head": [
   20,
   16,
   0
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "plant",
   "offset": [
    -0.02,
    0.0,
    -0.15
   ]
  }
 },
 "pour": {
  "base": "lift_can",
  "tiltR": 38,
  "head": [
   24,
   18,
   0
  ]
 },
 "admire": {
  "base": "seated",
  "torso": [
   -4,
   4,
   0
  ],
  "head": [
   4,
   18,
   6
  ],
  "handL": {
   "reach": "keyboard",
   "offset": [
    0,
    0,
    0
   ]
  },
  "handR": {
   "reach": "keyboard",
   "offset": [
    0.16,
    0,
    -0.08
   ]
  }
 },
 "admire_can": {
  "base": "lift_can",
  "head": [
   10,
   22,
   4
  ],
  "torso": [
   -4,
   8,
   0
  ]
 }
}
```

### 36/55 · `stop-motion-3d/assets/template/src/world/props.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/world/props.ts", "lines": 251, "final_newline": true, "sha256": "6cac67dcd6eb827ce93b9b59c7d8d5ac05ccf934cd7d1b35f966a8ed62636f02", "original_sha256": "6cac67dcd6eb827ce93b9b59c7d8d5ac05ccf934cd7d1b35f966a8ed62636f02"} -->
```ts
import * as THREE from "three";
import type { Prims } from "../looks/types";
import { rng } from "../runtime/rng";

/**
 * PROP LIBRARY — reusable set pieces. Each builder returns a group plus named ANCHORS
 * (contact points for IK, homes for holdable props). Props are written in meters, semantic
 * materials only, and never know which look draws them.
 */
export interface PropBuild {
  root: THREE.Group;
  anchors: Record<string, THREE.Object3D>;
  /** holdable props: the object + its home anchor (where it rests when not in a hand) */
  holdables?: Record<string, THREE.Object3D>;
  /** state-driven parts (plant leaves, key caps, lights) */
  parts?: Record<string, THREE.Object3D>;
}

type Build = (P: Prims, params: Record<string, any>) => PropBuild;

function at<T extends THREE.Object3D>(o: T, x: number, y: number, z: number, parent?: THREE.Object3D): T {
  o.position.set(x, y, z);
  parent?.add(o);
  return o;
}
function anchor(parent: THREE.Object3D, x: number, y: number, z: number, name: string) {
  const a = new THREE.Object3D();
  a.name = name;
  return at(a, x, y, z, parent);
}

export const DESK_H = 0.75;

const desk: Build = (P, { w = 1.6, d = 0.8 }) => {
  const g = new THREE.Group();
  at(P.box(w, 0.04, d, "wood", { collider: true, name: "desktop" }), 0, DESK_H - 0.02, 0, g);
  for (const sx of [-1, 1]) {
    at(P.box(0.05, DESK_H - 0.04, 0.05, "metalDark"), sx * (w / 2 - 0.06), (DESK_H - 0.04) / 2, -d / 2 + 0.06, g);
    at(P.box(0.05, DESK_H - 0.04, 0.05, "metalDark"), sx * (w / 2 - 0.06), (DESK_H - 0.04) / 2, d / 2 - 0.06, g);
    at(P.box(0.04, 0.04, d - 0.12, "metalDark"), sx * (w / 2 - 0.06), 0.12, 0, g);
  }
  at(P.box(w - 0.14, 0.32, 0.02, "metalDark"), 0, DESK_H - 0.26, d / 2 - 0.06, g); // modesty panel (far side)
  return { root: g, anchors: { top: anchor(g, 0, DESK_H, 0, "top") } };
};

const chair: Build = (P, { color = "#3d4b5e", seat = 0.46 }) => {
  const g = new THREE.Group();
  const fab = `fabric:${color}`;
  at(P.box(0.48, 0.07, 0.46, fab, { collider: true, name: "seat" }), 0, seat - 0.035, 0, g);
  at(P.box(0.46, 0.52, 0.06, fab), 0, seat + 0.32, -0.25, g).rotation.x = -0.08;
  at(P.box(0.06, 0.2, 0.05, "metalDark"), 0, seat + 0.04, -0.23, g);
  at(P.cyl(0.03, 0.03, seat - 0.12, "metalDark"), 0, (seat - 0.12) / 2 + 0.06, 0, g);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = at(P.box(0.04, 0.035, 0.3, "metalDark"), Math.sin(a) * 0.14, 0.07, Math.cos(a) * 0.14, g);
    leg.rotation.y = a;
    at(P.cyl(0.028, 0.028, 0.035, "rubber", { seg: 10 }), Math.sin(a) * 0.28, 0.02, Math.cos(a) * 0.28, g);
  }
  return { root: g, anchors: { seat: anchor(g, 0, seat, 0, "seat") } };
};

/** monitor facing −Z (toward the actor sitting on the −Z side) */
const monitor: Build = (P, { screen = 0, w = 0.62, h = 0.36 }) => {
  const g = new THREE.Group();
  at(P.box(0.24, 0.02, 0.18, "plasticDark"), 0, DESK_H + 0.01, 0.05, g);
  at(P.box(0.05, 0.26, 0.04, "plasticDark"), 0, DESK_H + 0.14, 0.08, g);
  const y = DESK_H + 0.2 + h / 2;
  at(P.box(w + 0.03, h + 0.03, 0.035, "plasticDark", { collider: true, name: "monitor" }), 0, y, 0.04, g);
  const scr = at(P.plane(w, h, `screen:${screen}`, { dynamic: true }), 0, y, 0.04 - 0.019, g);
  scr.rotation.y = Math.PI;
  return { root: g, anchors: { screen: anchor(g, 0, y, 0.0, "screen") }, parts: { screen: scr } };
};

const keyboard: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.4, 0.018, 0.14, "plasticLight", { collider: true, name: "keyboard" }), 0, DESK_H + 0.009, 0, g);
  const keys = new THREE.Group();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) {
    if (r === 1 && c === 11) continue;
    at(P.box(0.024, 0.008, 0.024, "plasticDark"), -0.165 + c * 0.03, DESK_H + 0.022, -0.045 + r * 0.03, keys);
  }
  const enter = at(P.box(0.024, 0.008, 0.054, "accent", { dynamic: true }), -0.165 + 11 * 0.03, DESK_H + 0.022, -0.045 + 1.5 * 0.03, g);
  g.add(keys);
  return {
    root: g,
    anchors: { keyboard: anchor(g, 0, DESK_H + 0.026, 0, "keyboard"), enter: anchor(g, enter.position.x, DESK_H + 0.026, enter.position.z, "enter") },
    parts: { enter },
  };
};

const mouse: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.24, 0.004, 0.2, "fabric:#2c3440"), 0, DESK_H + 0.002, 0, g);
  at(P.box(0.06, 0.03, 0.1, "plasticLight"), 0, DESK_H + 0.019, 0, g);
  return { root: g, anchors: { mouse: anchor(g, 0, DESK_H + 0.034, 0.01, "mouse") } };
};

const mug: Build = (P, { color = "#e0663f", holdable = false }) => {
  const g = new THREE.Group();
  at(P.cyl(0.055, 0.055, 0.006, "cork", { seg: 16 }), 0, DESK_H + 0.003, 0, g); // coaster
  const home = anchor(g, 0, DESK_H + 0.006, 0, "mug_home");
  const m = new THREE.Group();
  at(P.cyl(0.036, 0.032, 0.09, `ceramic:${color}`, { seg: 16, dynamic: holdable }), 0, 0.045, 0, m);
  at(P.box(0.012, 0.05, 0.012, `ceramic:${color}`, { dynamic: holdable }), 0.045, 0.05, 0, m);
  at(P.box(0.02, 0.01, 0.012, `ceramic:${color}`, { dynamic: holdable }), 0.038, 0.074, 0, m);
  at(P.box(0.02, 0.01, 0.012, `ceramic:${color}`, { dynamic: holdable }), 0.038, 0.026, 0, m);
  at(P.cyl(0.03, 0.03, 0.004, "soil", { seg: 12, dynamic: holdable }), 0, 0.085, 0, m); // coffee
  home.add(m);
  return { root: g, anchors: { mug_home: home, mug_grip: anchor(g, -0.05, DESK_H + 0.05, 0, "mug_grip") }, holdables: holdable ? { mug: m } : undefined };
};

const lamp: Build = (P, { night = false }) => {
  const g = new THREE.Group();
  at(P.cyl(0.07, 0.08, 0.02, "metalDark"), 0, DESK_H + 0.01, 0, g);
  const a1 = at(P.box(0.02, 0.36, 0.02, "metalDark"), 0, DESK_H + 0.19, 0.03, g);
  a1.rotation.x = 0.25;
  const a2 = at(P.box(0.02, 0.3, 0.02, "metalDark"), 0, DESK_H + 0.4, 0.16, g);
  a2.rotation.x = 1.25;
  const head = at(P.cyl(0.03, 0.075, 0.1, "accent", { seg: 16 }), 0, DESK_H + 0.4, 0.28, g);
  head.rotation.x = 0.5;
  at(P.sphere(0.028, "glow", { cast: false }), 0, DESK_H + 0.36, 0.3, g);
  const light = new THREE.PointLight("#ffcf8a", night ? 1.4 : 0.25, 2.2, 1.6);
  at(light, 0, DESK_H + 0.3, 0.3, g);
  return { root: g, anchors: {}, parts: { light } };
};

const plant: Build = (P, { size = 1, seed = 3 }) => {
  const g = new THREE.Group();
  const s = size;
  at(P.cyl(0.07 * s, 0.055 * s, 0.11 * s, "terracotta", { seg: 14 }), 0, 0.055 * s, 0, g);
  at(P.cyl(0.062 * s, 0.062 * s, 0.01, "soil", { seg: 14 }), 0, 0.105 * s, 0, g);
  const leaves = new THREE.Group();
  leaves.position.y = 0.11 * s;
  const r = rng(seed);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + r();
    const stem = new THREE.Group();
    stem.rotation.set(0.35 + r() * 0.35, a, 0);
    const leaf = at(P.box(0.05 * s, 0.14 * s, 0.012 * s, i % 2 ? "plant" : "plantDark", { dynamic: true }), 0, 0.07 * s, 0, stem);
    leaf.rotation.z = (r() - 0.5) * 0.3;
    leaves.add(stem);
  }
  g.add(leaves);
  return { root: g, anchors: { plant: anchor(g, 0, 0.3 * s, 0, "plant") }, parts: { leaves } };
};

const cubeToy: Build = (P) => {
  const g = new THREE.Group();
  const cols = ["#e0663f", "#f2c14e", "#3f9ad6", "#57b36a", "#f2f2ee", "#c0463a"];
  const r = rng(7);
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++)
    at(P.box(0.022, 0.022, 0.022, `plasticLight:${cols[Math.floor(r() * 6)]}`), (x - 1) * 0.024, DESK_H + 0.012 + y * 0.024, (z - 1) * 0.024, g);
  g.rotation.y = 0.5;
  return { root: g, anchors: {} };
};

const paperStack: Build = (P, { holdable = false }) => {
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) at(P.box(0.21, 0.004, 0.29, "paper"), (i % 2) * 0.006, DESK_H + 0.002 + i * 0.004, 0, g).rotation.y = (i - 3) * 0.02;
  const home = anchor(g, 0, DESK_H + 0.03, 0, "sheet_home");
  const sheet = new THREE.Group();
  // the held sheet: a printed collage page (poster colors) — hangs from the grip at its top edge
  const page = at(P.box(0.21, 0.29, 0.004, "paper", { dynamic: true }), 0, -0.13, 0.01, sheet);
  at(P.box(0.15, 0.08, 0.002, "accent", { dynamic: true }), 0, -0.07, 0.014, sheet);
  at(P.box(0.08, 0.1, 0.002, "neon:#27e3ff", { dynamic: true }), -0.04, -0.19, 0.014, sheet);
  at(P.box(0.06, 0.06, 0.002, "cloth:#f2c14e", { dynamic: true }), 0.05, -0.2, 0.014, sheet);
  page.userData.sheet = true;
  sheet.rotation.x = -Math.PI / 2; // lying flat at home
  home.add(sheet);
  return { root: g, anchors: { sheet_home: home, stack: anchor(g, 0, DESK_H + 0.03, 0, "stack") }, holdables: holdable ? { sheet } : undefined };
};

const tablet: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.36, 0.014, 0.24, "plasticDark", { collider: true, name: "tablet" }), 0, DESK_H + 0.007, 0, g);
  at(P.box(0.3, 0.002, 0.18, "paper"), 0, DESK_H + 0.015, 0, g);
  // a few "drawn" strokes on the tablet
  for (let i = 0; i < 4; i++) at(P.box(0.12 - i * 0.02, 0.001, 0.006, "eyes"), -0.03 + i * 0.01, DESK_H + 0.017, -0.05 + i * 0.03, g);
  const stylus = new THREE.Group();
  const pen = at(P.cyl(0.006, 0.006, 0.15, "plasticDark", { seg: 8, dynamic: true }), 0, -0.02, 0.02, stylus);
  pen.rotation.x = 0.9;
  return { root: g, anchors: { tablet: anchor(g, 0, DESK_H + 0.016, 0, "tablet") }, holdables: { stylus } };
};

const wateringCan: Build = (P) => {
  const g = new THREE.Group();
  const home = anchor(g, 0, DESK_H, 0, "can_home");
  const can = new THREE.Group();
  // held by the top handle: body hangs below the grip
  at(P.cyl(0.05, 0.055, 0.1, "metal:#6aa6c9", { seg: 16, dynamic: true }), 0, -0.1, 0, can);
  at(P.box(0.012, 0.06, 0.012, "metal:#6aa6c9", { dynamic: true }), 0, -0.025, -0.03, can);
  at(P.box(0.012, 0.012, 0.07, "metal:#6aa6c9", { dynamic: true }), 0, 0.0, 0.0, can);
  const spout = at(P.cyl(0.008, 0.012, 0.14, "metal:#6aa6c9", { seg: 8, dynamic: true }), 0, -0.08, 0.09, can);
  spout.rotation.x = 1.0;
  can.position.y = 0.155; // rests on the desk
  home.add(can);
  const spoutTip = anchor(can, 0, -0.04, 0.15, "spout");
  return { root: g, anchors: { can_home: home, spout: spoutTip }, holdables: { can } };
};

const neonSign: Build = (P, { color = "#ff3fa4", color2 = "#27e3ff" }) => {
  const g = new THREE.Group();
  at(P.box(0.34, 0.02, 0.08, "plasticDark"), 0, DESK_H + 0.01, 0, g);
  // "</>" in tubes
  const tube = (w: number, h: number, x: number, y: number, rz: number, c: string) => {
    const m = at(P.box(w, h, 0.015, `neon:${c}`, { cast: false }), x, DESK_H + 0.13 + y, 0, g);
    m.rotation.z = rz;
  };
  tube(0.018, 0.1, -0.09, 0.03, 0.7, color);
  tube(0.018, 0.1, -0.09, -0.03, -0.7, color);
  tube(0.018, 0.22, 0, 0, -0.35, color2);
  tube(0.018, 0.1, 0.09, 0.03, -0.7, color);
  tube(0.018, 0.1, 0.09, -0.03, 0.7, color);
  const light = new THREE.PointLight(color, 0, 2.5, 1.5);
  at(light, 0, DESK_H + 0.15, -0.1, g);
  return { root: g, anchors: {}, parts: { light } };
};

const can: Build = (P, { color = "#27e3ff" }) => {
  const g = new THREE.Group();
  at(P.cyl(0.03, 0.03, 0.12, `metal:${color}`, { seg: 14 }), 0, DESK_H + 0.06, 0, g);
  return { root: g, anchors: {} };
};

const speaker: Build = (P) => {
  const g = new THREE.Group();
  at(P.box(0.1, 0.16, 0.1, "plasticDark"), 0, DESK_H + 0.08, 0, g);
  at(P.cyl(0.03, 0.03, 0.01, "metal", { seg: 12 }), 0, DESK_H + 0.1, -0.052, g).rotation.x = Math.PI / 2;
  return { root: g, anchors: {} };
};

const brushJar: Build = (P) => {
  const g = new THREE.Group();
  at(P.cyl(0.04, 0.035, 0.1, "glass", { seg: 14 }), 0, DESK_H + 0.05, 0, g).userData.noOutline = true;
  const r = rng(11);
  for (let i = 0; i < 4; i++) {
    const b = at(P.cyl(0.004, 0.004, 0.18, i % 2 ? "wood" : "accent", { seg: 6 }), (r() - 0.5) * 0.03, DESK_H + 0.12, (r() - 0.5) * 0.03, g);
    b.rotation.set((r() - 0.5) * 0.4, 0, (r() - 0.5) * 0.4);
  }
  return { root: g, anchors: {} };
};

const stickyNotes: Build = (P, { colors = ["#f2c14e", "#ff8fb1"] }) => {
  const g = new THREE.Group();
  (colors as string[]).forEach((c, i) => at(P.box(0.06, 0.06, 0.002, `paper:${c}`), i * 0.07, 0, 0, g).rotation.z = (i - 0.5) * 0.15);
  return { root: g, anchors: {} };
};

export const PROPS: Record<string, Build> = {
  desk, chair, monitor, keyboard, mouse, mug, lamp, plant, cubeToy, paperStack, tablet, wateringCan, neonSign, can, speaker, brushJar, stickyNotes,
};
```

### 37/55 · `stop-motion-3d/assets/template/src/world/studio.ts`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/world/studio.ts", "lines": 381, "final_newline": true, "sha256": "b98e6afec3c70950383ea1ed0663d2269af411f3405c734fce49932b9206f112", "original_sha256": "b98e6afec3c70950383ea1ed0663d2269af411f3405c734fce49932b9206f112"} -->
```ts
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Prims } from "../looks/types";
import type { WorldManifest, WorldState } from "../runtime/types";
import { Puppet, type AnchorLookup } from "../runtime/rig";
import { rng } from "../runtime/rng";
import { PROPS, type PropBuild } from "./props";

/**
 * THE SANDBOX. A bounded loft studio built once per look from semantic primitives.
 * Everything an episode can touch is exposed as a handle; nothing here knows about shots.
 *
 * Room: x ∈ [-9, 9], z ∈ [-5, 4.6], ceiling beams at 4.3. Back wall (z = -5) holds four tall
 * windows with the sun behind them; the other three walls are WILD WALLS — hidden whenever the
 * camera stands outside them, exactly like flats on a real stage.
 */
export interface Holdable {
  obj: THREE.Object3D;
  home: THREE.Object3D;
  homePos: THREE.Vector3;
  homeRot: THREE.Euler;
  holdPos: THREE.Vector3;
  holdRot: THREE.Euler;
}

export interface StudioHandles {
  root: THREE.Group;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  bounce: THREE.DirectionalLight;
  actors: Record<string, Puppet>;
  seatTop: Record<string, number>;
  anchors: (actor: string) => AnchorLookup;
  deskAnchors: Record<string, Record<string, THREE.Object3D>>;
  holdables: Record<string, Holdable>;
  enterKeys: Record<string, THREE.Object3D>;
  plantLeaves: Record<string, THREE.Object3D>;
  practicals: { lamps: THREE.PointLight[]; neon: THREE.PointLight[]; pendants: THREE.PointLight[] };
  wild: { obj: THREE.Object3D; point: THREE.Vector3; normal: THREE.Vector3 }[];
  ceiling: THREE.Object3D;
  beams: THREE.Object3D[];
  dust: THREE.Points;
  drops: THREE.Points;
  backdrop: THREE.Mesh;
  windowGlass: THREE.Mesh[];
  colliders: THREE.Mesh[];
  screens: THREE.Mesh[];
}

const HOLD: Record<string, { pos: [number, number, number]; rot: [number, number, number] }> = {
  mug: { pos: [0, -0.05, 0.07], rot: [0, -Math.PI / 2, 0] },
  sheet: { pos: [0, 0.03, 0.06], rot: [0, 0, 0] },
  stylus: { pos: [0, 0.0, 0.03], rot: [0, 0, 0] },
  can: { pos: [0, 0.0, 0.03], rot: [0, 0, 0] },
};

export function buildStudio(P: Prims, world: WorldManifest, variant: string, colliders: THREE.Mesh[], screens: THREE.Mesh[]): StudioHandles {
  const root = new THREE.Group();
  const night = variant === "night";
  const r = rng(1234);
  const put = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number, parent: THREE.Object3D = root) => {
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };
  const wild: StudioHandles["wild"] = [];

  // ── shell ───────────────────────────────────────────────────────────────
  put(P.box(19.2, 0.3, 10.4, "woodDark"), 0, -0.15, -0.2); // set platform (the diorama base)
  put(P.box(18.4, 0.02, 9.6, "floor"), 0, 0.01, -0.2);
  put(P.box(12, 0.012, 2.4, "fabric:#6b3f3a"), 0, 0.02, -0.25); // long rug under the desks

  // back wall with four tall windows (x centers), openings y 0.8..3.9
  const back = new THREE.Group();
  root.add(back);
  const winX = [-6.3, -2.1, 2.1, 6.3], winW = 3.0, y0 = 0.8, y1 = 3.9, H = 4.4, BZ = -5;
  put(P.box(18.4, y0, 0.3, "brick"), 0, y0 / 2, BZ, back);
  put(P.box(18.4, H - y1, 0.3, "brick"), 0, (H + y1) / 2, BZ, back);
  const edges = [-9.2, ...winX.flatMap((x) => [x - winW / 2, x + winW / 2]), 9.2];
  for (let i = 0; i < edges.length; i += 2) {
    const w = edges[i + 1] - edges[i];
    if (w > 0.01) put(P.box(w, y1 - y0, 0.3, "brick"), (edges[i] + edges[i + 1]) / 2, (y0 + y1) / 2, BZ, back);
  }
  const windowGlass: THREE.Mesh[] = [];
  for (const x of winX) {
    // steel mullions: 3 columns x 4 rows
    for (let c = 0; c <= 3; c++) put(P.box(0.06, y1 - y0, 0.08, "metalDark"), x - winW / 2 + (c * winW) / 3, (y0 + y1) / 2, BZ + 0.1, back);
    for (let k = 0; k <= 4; k++) put(P.box(winW, 0.06, 0.08, "metalDark"), x, y0 + (k * (y1 - y0)) / 4, BZ + 0.1, back);
    put(P.box(winW + 0.2, 0.1, 0.3, "plaster"), x, y0 - 0.05, BZ + 0.2, back); // sill
    const glass = put(P.plane(winW, y1 - y0, "glass", { cast: false, receive: false }), x, (y0 + y1) / 2, BZ + 0.06, back);
    glass.userData.noOutline = true;
    windowGlass.push(glass);
  }
  // painted backdrop behind the windows
  const backdrop = put(P.plane(70, 26, "backdrop", { cast: false, receive: false }), 0, 7, -22);

  // wild walls: front (z = 4.6), left (x = -9.2), right (x = 9.2)
  const front = new THREE.Group();
  root.add(front);
  put(P.box(18.4, H, 0.3, "plaster"), 0, H / 2, 4.75, front);
  put(P.box(1.1, 2.2, 0.08, "wood"), 6.8, 1.1, 4.58, front); // door
  put(P.box(3.4, 1.4, 0.05, "whiteboard"), -1.2, 1.7, 4.58, front);
  for (let i = 0; i < 7; i++) put(P.box(0.35 + r() * 0.8, 0.02, 0.012, "plasticDark:#3a5fa8"), -2.4 + r() * 1.8, 1.25 + r() * 0.9, 4.55, front);
  // six style posters (one per look) on the front wall
  const posterCols = ["#57b36a", "#e3a33a", "#c8423a", "#eeece6", "#b36bff", "#8fc4ae"];
  posterCols.forEach((c, i) => {
    const px = 1.6 + (i % 3) * 1.1, py = i < 3 ? 2.5 : 1.35;
    put(P.box(0.9, 0.95, 0.02, "paper"), px, py, 4.58, front);
    put(P.box(0.72, 0.5, 0.012, `paper:${c}`), px, py + 0.12, 4.565, front);
    put(P.box(0.5, 0.06, 0.012, "paper:#26292f"), px, py - 0.28, 4.565, front);
  });
  wild.push({ obj: front, point: new THREE.Vector3(0, 0, 4.6), normal: new THREE.Vector3(0, 0, -1) });

  const left = new THREE.Group();
  root.add(left);
  put(P.box(0.3, H, 9.9, "brick"), -9.35, H / 2, -0.2, left);
  const tv = put(P.plane(3.2, 1.8, "tv:0", { cast: false }), -9.13, 2.3, -0.4, left);
  tv.rotation.y = Math.PI / 2;
  put(P.box(0.08, 1.95, 3.35, "plasticDark"), -9.2, 2.3, -0.4, left);
  for (let s = 0; s < 3; s++) {
    put(P.box(0.3, 0.04, 1.6, "wood"), -9.05, 0.6 + s * 0.45, 2.9, left);
    for (let b = 0; b < 8; b++) {
      const h = 0.22 + r() * 0.14;
      put(P.box(0.2, h, 0.06, `paper:${["#c8423a", "#3f9ad6", "#f2c14e", "#2f8f83", "#eeece6"][b % 5]}`), -9.05, 0.62 + s * 0.45 + h / 2, 2.2 + b * 0.09 + r() * 0.03, left);
    }
  }
  wild.push({ obj: left, point: new THREE.Vector3(-9.2, 0, 0), normal: new THREE.Vector3(1, 0, 0) });

  const right = new THREE.Group();
  root.add(right);
  put(P.box(0.3, H, 9.9, "plaster"), 9.35, H / 2, -0.2, right);
  put(P.box(0.4, 2.2, 1.8, "woodDark"), 9.0, 1.1, 1.6, right);
  for (let s = 0; s < 4; s++) for (let b = 0; b < 10; b++) {
    const h = 0.2 + r() * 0.16;
    put(P.box(0.24, h, 0.12, `paper:${["#c8423a", "#3f9ad6", "#f2c14e", "#2f8f83", "#eeece6", "#b36bff"][(b + s) % 6]}`), 8.86, 0.3 + s * 0.5 + h / 2, 0.85 + b * 0.15, right);
  }
  wild.push({ obj: right, point: new THREE.Vector3(9.2, 0, 0), normal: new THREE.Vector3(-1, 0, 0) });

  // ceiling: beams + pendant lamps (hidden when the camera rises above them)
  const ceiling = new THREE.Group();
  root.add(ceiling);
  for (let i = 0; i < 7; i++) put(P.box(18.4, 0.22, 0.16, "woodDark"), 0, 4.3, -4.4 + i * 1.5, ceiling);
  const pendants: THREE.PointLight[] = [];
  for (const x of [-4.4, 0, 4.4]) {
    put(P.cyl(0.006, 0.006, 1.6, "metalDark", { seg: 6 }), x, 3.5, 0.4, ceiling);
    put(P.cyl(0.08, 0.28, 0.24, "metalDark", { seg: 18 }), x, 2.6, 0.4, ceiling);
    put(P.sphere(0.07, "glow", { cast: false }), x, 2.5, 0.4, ceiling);
    const pl = new THREE.PointLight("#ffd29a", night ? 5 : 0, 6, 1.6);
    put(pl, x, 2.4, 0.4, ceiling);
    pendants.push(pl);
  }

  // floor dressing: big plants, bean bag
  for (const [x, z, s] of [[-8.2, -4.2, 3.2], [8.2, -4.1, 3.6], [-8.3, 3.8, 2.6]] as const) {
    const pb = PROPS.plant(P, { size: s, seed: Math.floor(x * 10) });
    put(pb.root, x, 0, z);
  }
  put(P.box(0.9, 0.5, 0.9, "fabric:#d0633d"), 7.6, 0.25, 3.2).rotation.y = 0.4;
  put(P.box(0.7, 0.3, 0.2, "fabric:#d0633d"), 7.7, 0.62, 3.55).rotation.set(-0.3, 0.4, 0);

  // ── desks, props, actors ────────────────────────────────────────────────
  const actors: Record<string, Puppet> = {};
  const seatTop: Record<string, number> = {};
  const deskAnchors: StudioHandles["deskAnchors"] = {};
  const holdables: Record<string, Holdable> = {};
  const enterKeys: Record<string, THREE.Object3D> = {};
  const plantLeaves: Record<string, THREE.Object3D> = {};
  const lamps: THREE.PointLight[] = [], neon: THREE.PointLight[] = [];

  for (const [deskId, d] of Object.entries(world.desks)) {
    const g = put(new THREE.Group(), d.x, 0, d.z);
    const anchors: Record<string, THREE.Object3D> = {};
    for (const it of d.items) {
      const b: PropBuild = PROPS[it.type](P, { ...(it.params ?? {}), night });
      b.root.position.set(it.at[0], it.y ?? 0, it.at[1]);
      b.root.rotation.y = ((it.yaw ?? 0) * Math.PI) / 180;
      g.add(b.root);
      Object.assign(anchors, b.anchors);
      if (b.parts?.enter) enterKeys[d.actor] = b.parts.enter;
      if (b.parts?.leaves && deskId !== undefined) plantLeaves[d.actor] = b.parts.leaves;
      if (b.parts?.light) (it.type === "neonSign" ? neon : lamps).push(b.parts.light as THREE.PointLight);
      for (const [name, obj] of Object.entries(b.holdables ?? {})) {
        const home = obj.parent!;
        const hp = HOLD[name] ?? { pos: [0, 0, 0], rot: [0, 0, 0] };
        holdables[name] = {
          obj, home, homePos: obj.position.clone(), homeRot: obj.rotation.clone(),
          holdPos: new THREE.Vector3(...hp.pos), holdRot: new THREE.Euler(...hp.rot),
        };
      }
    }
    const ch = PROPS.chair(P, { color: d.chair });
    ch.root.position.set(0, 0, -0.6);
    g.add(ch.root);
    deskAnchors[deskId] = anchors;

    const a = world.actors[d.actor];
    const pup = new Puppet(P, d.actor, a.costume);
    const mk = world.marks[a.mark];
    pup.root.position.set(...mk.pos);
    pup.root.rotation.y = (mk.yaw * Math.PI) / 180;
    root.add(pup.root);
    actors[d.actor] = pup;
    seatTop[d.actor] = 0.46;
  }

  // ── lights (looks set colors/intensities) ───────────────────────────────
  const sun = new THREE.DirectionalLight("#fff1d6", 3);
  sun.position.set(-6, 14, -24);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -14; sc.right = 14; sc.top = 12; sc.bottom = -12; sc.near = 1; sc.far = 60;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  root.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight("#dfe9f5", "#8a6a50", 1.2);
  root.add(hemi);
  const bounce = new THREE.DirectionalLight("#ffe2c4", 0.6); // soft front fill (the "open 4th wall")
  bounce.position.set(2, 3, 10);
  root.add(bounce);

  // god-ray shafts along the sun direction from each window (additive, no outline)
  const beams: THREE.Object3D[] = [];
  const sunDir = new THREE.Vector3().subVectors(sun.target.position, sun.position).normalize();
  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color("#ffe6b8") }, uStrength: { value: 0.1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uStrength; varying vec2 vUv;
      void main(){ float a = smoothstep(0., .25, vUv.y) * smoothstep(1., .55, vUv.y) * smoothstep(0., .2, vUv.x) * smoothstep(1., .8, vUv.x);
      gl_FragColor = vec4(uColor * a * uStrength, 1.); }`,
  });
  for (const x of winX) {
    const len = 9;
    const bm = new THREE.Mesh(new THREE.PlaneGeometry(winW * 0.95, len), beamMat);
    const start = new THREE.Vector3(x, (y0 + y1) / 2 + 0.3, BZ + 0.2);
    bm.position.copy(start).addScaledVector(sunDir, len / 2);
    bm.lookAt(bm.position.clone().add(new THREE.Vector3(1, 0, 0)));
    bm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sunDir.clone().negate());
    bm.userData.noOutline = true;
    bm.renderOrder = 5;
    root.add(bm);
    beams.push(bm);
  }

  // dust motes in the sun (continuous clock) and water drops (Rin's can)
  const dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: "#fff3d6", size: 0.014, transparent: true, opacity: 0.55, depthWrite: false }));
  dust.geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(260 * 3), 3));
  dust.userData.seed = Array.from({ length: 260 }, () => [r() * 16 - 8, r() * 3.4 + 0.3, r() * 4.5 - 4.8, r()]);
  dust.frustumCulled = false;
  root.add(dust);
  const drops = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: "#8fd0ff", size: 0.02, transparent: true, opacity: 0.9, depthWrite: false }));
  drops.geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(60 * 3), 3));
  drops.frustumCulled = false;
  drops.visible = false;
  root.add(drops);

  const anchorsFor = (actor: string): AnchorLookup => {
    const deskId = world.actors[actor].desk!;
    return (name: string) => deskAnchors[deskId][name];
  };

  bakeStatic(root);
  return {
    root, sun, hemi, bounce, actors, seatTop, anchors: anchorsFor, deskAnchors, holdables, enterKeys, plantLeaves,
    practicals: { lamps, neon, pendants }, wild, ceiling, beams, dust, drops, backdrop, windowGlass, colliders, screens,
  };
}

/** Per-frame, state-driven world updates (held props, key presses, plant, particles). */
export function updateStudio(h: StudioHandles, state: WorldState, t: number, absT: number, pourSince: number | null) {
  // holdables follow state: "home" or "<actor>.<R|L>"
  for (const [name, hd] of Object.entries(h.holdables)) {
    const v = String(state[`hold.${name}`] ?? "home");
    if (v === "home") {
      if (hd.obj.parent !== hd.home) hd.home.add(hd.obj);
      hd.obj.position.copy(hd.homePos);
      hd.obj.rotation.copy(hd.homeRot);
    } else {
      const [actor, side] = v.split(".");
      const sock = h.actors[actor].socket[side as "L" | "R"];
      if (hd.obj.parent !== sock) sock.add(hd.obj);
      hd.obj.position.copy(hd.holdPos);
      hd.obj.rotation.copy(hd.holdRot);
    }
  }
  // enter keys depress when a hand tip touches them (derived, never keyed by hand)
  const tip = new THREE.Vector3(), key = new THREE.Vector3();
  for (const [actor, k] of Object.entries(h.enterKeys)) {
    k.position.y = 0.75 + 0.022;
    h.actors[actor].tip("R", tip);
    k.getWorldPosition(key);
    if (tip.distanceTo(key) < 0.035) k.position.y -= 0.005;
  }
  // plants perk up after watering
  for (const [actor, leaves] of Object.entries(h.plantLeaves)) {
    const perk = actor === "rin" && state["plant.watered"] ? 1 : 0;
    leaves.scale.set(1, 0.82 + 0.26 * perk, 1);
  }
  // dust motes drift on the continuous clock
  const pa = h.dust.geometry.getAttribute("position") as THREE.BufferAttribute;
  (h.dust.userData.seed as number[][]).forEach(([x, y, z, ph], i) => {
    pa.setXYZ(i, x + Math.sin(absT * 0.2 + ph * 6) * 0.3, ((y + absT * 0.05 * (0.5 + ph)) % 3.8) + 0.2, z + Math.cos(absT * 0.17 + ph * 9) * 0.3);
  });
  pa.needsUpdate = true;
  // water drops from Rin's spout while pouring
  h.drops.visible = !!state["rin.pour"];
  if (h.drops.visible && h.holdables.can) {
    const spout = h.deskAnchors.desk6?.spout;
    if (spout) {
      const s = spout.getWorldPosition(new THREE.Vector3());
      const da = h.drops.geometry.getAttribute("position") as THREE.BufferAttribute;
      const since = pourSince ?? 0;
      for (let i = 0; i < da.count; i++) {
        const ph = (i / da.count + since * 2.2) % 1;
        da.setXYZ(i, s.x + Math.sin(i * 12.9) * 0.012, s.y - ph * 0.28, s.z + Math.cos(i * 7.3) * 0.012 + ph * 0.03);
      }
      da.needsUpdate = true;
    }
  }
}

/** Wild walls + ceiling hide when the camera must shoot through them (real stage practice). */
export function updateWildWalls(h: StudioHandles, camPos: THREE.Vector3) {
  for (const w of h.wild) w.obj.visible = camPos.clone().sub(w.point).dot(w.normal) > 0;
  h.ceiling.visible = camPos.y < 4.1 && camPos.z < 4.6;
}

/**
 * Merge every static mesh into one batch per material: ~1000 meshes → a few dozen draw calls.
 * Dynamic meshes (puppets, held props, screens, key caps) and helper objects stay separate.
 */
function bakeStatic(root: THREE.Group) {
  root.updateMatrixWorld(true);
  const groups = new Map<string, { mat: THREE.Material; geos: THREE.BufferGeometry[]; cast: boolean; receive: boolean; noOutline: boolean }>();
  const remove: THREE.Mesh[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.userData.dynamic || m.userData.collider || Array.isArray(m.material)) return;
    if ((m.material as THREE.Material).type === "ShaderMaterial") return;
    let p: THREE.Object3D | null = m.parent;
    while (p) {
      if (p.userData.keepSeparate || p.name.startsWith("actor:")) return;
      p = p.parent;
    }
    const key = `${(m.material as THREE.Material).uuid}|${m.castShadow}|${m.receiveShadow}|${!!m.userData.noOutline}|${wildOf(m)}`;
    let g = groups.get(key);
    if (!g) groups.set(key, (g = { mat: m.material as THREE.Material, geos: [], cast: m.castShadow, receive: m.receiveShadow, noOutline: !!m.userData.noOutline }));
    let geo = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
    for (const k of Object.keys(geo.attributes)) if (!["position", "normal", "uv"].includes(k)) geo.deleteAttribute(k);
    geo.applyMatrix4(m.matrixWorld);
    g.geos.push(geo);
    remove.push(m);
  });
  const wildGroups = new Map<string, THREE.Object3D>();
  root.traverse((o) => {
    if (o.parent === root && (o as THREE.Group).isGroup) wildGroups.set(o.uuid, o);
  });
  for (const m of remove) m.parent?.remove(m);
  for (const [key, g] of groups) {
    const merged = mergeGeometries(g.geos, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, g.mat);
    mesh.castShadow = g.cast;
    mesh.receiveShadow = g.receive;
    mesh.userData.noOutline = g.noOutline;
    const wid = key.split("|")[4];
    (wid && wildGroups.get(wid) ? wildGroups.get(wid)! : root).add(mesh);
    // merged vertices are already in world space; parent groups must be identity for this
    mesh.matrixAutoUpdate = true;
  }
}

/** which top-level group (wall/ceiling) a mesh belongs to, so merged batches keep hide-ability */
function wildOf(m: THREE.Object3D) {
  let p: THREE.Object3D | null = m;
  while (p && p.parent && p.parent.parent) p = p.parent;
  if (p && p.parent && (p as THREE.Group).isGroup && p.position.lengthSq() === 0 && p.rotation.x === 0 && p.rotation.y === 0) return p.uuid;
  return "";
}
```

### 38/55 · `stop-motion-3d/assets/template/src/world/world.json`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/src/world/world.json", "lines": 982, "final_newline": false, "sha256": "b49edf3a23217047db654a95ec60692d7055366438e2b4a2dcab5b21c928a3e5", "original_sha256": "b49edf3a23217047db654a95ec60692d7055366438e2b4a2dcab5b21c928a3e5"} -->
```json
{
 "id": "studio",
 "title": "Loft studio — six developers, one sandbox",
 "variants": [
  "day",
  "night"
 ],
 "state": {
  "hold.mug": "home",
  "hold.sheet": "home",
  "hold.stylus": "yu.R",
  "hold.can": "home",
  "rin.pour": false,
  "plant.watered": false
 },
 "holdables": {
  "mug": {
   "desk": "desk2",
   "home": "mug_home"
  },
  "sheet": {
   "desk": "desk3",
   "home": "sheet_home"
  },
  "stylus": {
   "desk": "desk4",
   "home": "tablet"
  },
  "can": {
   "desk": "desk6",
   "home": "can_home"
  }
 },
 "desks": {
  "desk1": {
   "x": -5.5,
   "z": 0.4,
   "actor": "kai",
   "chair": "#2f5d62",
   "items": [
    {
     "type": "desk",
     "at": [
      0,
      0
     ]
    },
    {
     "type": "monitor",
     "at": [
      0,
      0.18
     ],
     "params": {
      "screen": 1
     }
    },
    {
     "type": "keyboard",
     "at": [
      0,
      -0.23
     ]
    },
    {
     "type": "lamp",
     "at": [
      -0.64,
      0.26
     ]
    },
    {
     "type": "cubeToy",
     "at": [
      0.6,
      0.05
     ]
    },
    {
     "type": "speaker",
     "at": [
      -0.5,
      0.25
     ]
    },
    {
     "type": "mug",
     "at": [
      -0.46,
      -0.18
     ],
     "params": {
      "color": "#57b36a"
     }
    },
    {
     "type": "mouse",
     "at": [
      0.4,
      -0.2
     ]
    }
   ]
  },
  "desk2": {
   "x": -3.3,
   "z": 0.4,
   "actor": "mia",
   "chair": "#b5652b",
   "items": [
    {
     "type": "desk",
     "at": [
      0,
      0
     ]
    },
    {
     "type": "monitor",
     "at": [
      0,
      0.18
     ],
     "params": {
      "screen": 2
     }
    },
    {
     "type": "keyboard",
     "at": [
      0,
      -0.23
     ]
    },
    {
     "type": "lamp",
     "at": [
      -0.64,
      0.26
     ]
    },
    {
     "type": "mug",
     "at": [
      0.42,
      -0.14
     ],
     "params": {
      "color": "#e0663f",
      "holdable": true
     }
    },
    {
     "type": "plant",
     "at": [
      -0.6,
      0.05
     ],
     "params": {
      "size": 0.9,
      "seed": 5
     },
     "y": 0.75
    },
    {
     "type": "mouse",
     "at": [
      0.66,
      -0.2
     ]
    }
   ]
  },
  "desk3": {
   "x": -1.1,
   "z": 0.4,
   "actor": "leo",
   "chair": "#8a2f2a",
   "items": [
    {
     "type": "desk",
     "at": [
      0,
      0
     ]
    },
    {
     "type": "monitor",
     "at": [
      0,
      0.18
     ],
     "params": {
      "screen": 3
     }
    },
    {
     "type": "keyboard",
     "at": [
      0,
      -0.23
     ]
    },
    {
     "type": "lamp",
     "at": [
      -0.64,
      0.26
     ]
    },
    {
     "type": "paperStack",
     "at": [
      0.52,
      -0.08
     ],
     "params": {
      "holdable": true
     }
    },
    {
     "type": "mug",
     "at": [
      -0.5,
      -0.18
     ],
     "params": {
      "color": "#3f9ad6"
     }
    },
    {
     "type": "stickyNotes",
     "at": [
      -0.62,
      0.3
     ]
    }
   ]
  },
  "desk4": {
   "x": 1.1,
   "z": 0.4,
   "actor": "yu",
   "chair": "#50535c",
   "items": [
    {
     "type": "desk",
     "at": [
      0,
      0
     ]
    },
    {
     "type": "monitor",
     "at": [
      0,
      0.18
     ],
     "params": {
      "screen": 4
     }
    },
    {
     "type": "keyboard",
     "at": [
      -0.28,
      -0.2
     ]
    },
    {
     "type": "lamp",
     "at": [
      -0.64,
      0.26
     ]
    },
    {
     "type": "tablet",
     "at": [
      0.3,
      -0.2
     ]
    },
    {
     "type": "brushJar",
     "at": [
      -0.6,
      0.15
     ]
    }
   ]
  },
  "desk5": {
   "x": 3.3,
   "z": 0.4,
   "actor": "nova",
   "chair": "#3a2f5a",
   "items": [
    {
     "type": "desk",
     "at": [
      0,
      0
     ]
    },
    {
     "type": "monitor",
     "at": [
      0,
      0.18
     ],
     "params": {
      "screen": 5
     }
    },
    {
     "type": "keyboard",
     "at": [
      0,
      -0.23
     ]
    },
    {
     "type": "lamp",
     "at": [
      -0.64,
      0.26
     ]
    },
    {
     "type": "neonSign",
     "at": [
      -0.5,
      0.22
     ]
    },
    {
     "type": "can",
     "at": [
      0.55,
      0.05
     ]
    },
    {
     "type": "mouse",
     "at": [
      0.42,
      -0.2
     ]
    }
   ]
  },
  "desk6": {
   "x": 5.5,
   "z": 0.4,
   "actor": "rin",
   "chair": "#6b8f7d",
   "items": [
    {
     "type": "desk",
     "at": [
      0,
      0
     ]
    },
    {
     "type": "monitor",
     "at": [
      0,
      0.18
     ],
     "params": {
      "screen": 6
     }
    },
    {
     "type": "keyboard",
     "at": [
      -0.2,
      -0.23
     ]
    },
    {
     "type": "lamp",
     "at": [
      -0.64,
      0.26
     ]
    },
    {
     "type": "plant",
     "at": [
      0.46,
      -0.08
     ],
     "params": {
      "size": 1.35,
      "seed": 9
     },
     "y": 0.75
    },
    {
     "type": "wateringCan",
     "at": [
      0.66,
      -0.3
     ]
    },
    {
     "type": "brushJar",
     "at": [
      -0.58,
      0.12
     ]
    }
   ]
  }
 },
 "marks": {
  "desk1.seat": {
   "pos": [
    -5.5,
    0,
    -0.16
   ],
   "yaw": 0
  },
  "desk2.seat": {
   "pos": [
    -3.3,
    0,
    -0.16
   ],
   "yaw": 0
  },
  "desk3.seat": {
   "pos": [
    -1.1,
    0,
    -0.16
   ],
   "yaw": 0
  },
  "desk4.seat": {
   "pos": [
    1.1,
    0,
    -0.16
   ],
   "yaw": 0
  },
  "desk5.seat": {
   "pos": [
    3.3,
    0,
    -0.16
   ],
   "yaw": 0
  },
  "desk6.seat": {
   "pos": [
    5.5,
    0,
    -0.16
   ],
   "yaw": 0
  }
 },
 "cameras": [
  {
   "id": "CAM_EST",
   "role": "establishing",
   "fov": 42,
   "from": {
    "pos": [
     7.4,
     3.6,
     -4.4
    ],
    "target": [
     -1.6,
     0.9,
     0.6
    ]
   },
   "to": {
    "pos": [
     5.6,
     2.8,
     -3.4
    ],
    "target": [
     -1.2,
     1.0,
     0.6
    ]
   }
  },
  {
   "id": "CAM_END",
   "role": "ending",
   "fov": 40,
   "from": {
    "pos": [
     0.2,
     2.6,
     7.8
    ],
    "target": [
     0,
     1.2,
     0
    ]
   },
   "to": {
    "pos": [
     0,
     4.6,
     12.5
    ],
    "target": [
     0,
     1.0,
     -0.5
    ]
   }
  },
  {
   "id": "CAM_THUMB",
   "role": "monitor-content",
   "fov": 46,
   "from": {
    "pos": [
     3.6,
     2.1,
     4.2
    ],
    "target": [
     -1.2,
     1.0,
     -0.8
    ]
   }
  },
  {
   "id": "CAM_KAI_FRONT",
   "role": "character",
   "fov": 38,
   "from": {
    "pos": [
     -3.35,
     1.72,
     1.55
    ],
    "target": [
     -5.58,
     1.12,
     -0.12
    ]
   },
   "to": {
    "pos": [
     -3.7,
     1.62,
     1.28
    ],
    "target": [
     -5.55,
     1.12,
     -0.12
    ]
   }
  },
  {
   "id": "CAM_KAI_OTS",
   "role": "over-shoulder",
   "fov": 40,
   "from": {
    "pos": [
     -4.1,
     1.78,
     -1.7
    ],
    "target": [
     -5.3,
     1.0,
     0.58
    ]
   },
   "to": {
    "pos": [
     -4.28,
     1.7,
     -1.45
    ],
    "target": [
     -5.32,
     1.0,
     0.58
    ]
   }
  },
  {
   "id": "CAM_MIA_FRONT",
   "role": "character",
   "fov": 38,
   "from": {
    "pos": [
     -1.15,
     1.72,
     1.55
    ],
    "target": [
     -3.38,
     1.12,
     -0.12
    ]
   },
   "to": {
    "pos": [
     -1.5,
     1.62,
     1.28
    ],
    "target": [
     -3.35,
     1.12,
     -0.12
    ]
   }
  },
  {
   "id": "CAM_MIA_OTS",
   "role": "over-shoulder",
   "fov": 40,
   "from": {
    "pos": [
     -1.9,
     1.78,
     -1.7
    ],
    "target": [
     -3.1,
     1.0,
     0.58
    ]
   },
   "to": {
    "pos": [
     -2.08,
     1.7,
     -1.45
    ],
    "target": [
     -3.12,
     1.0,
     0.58
    ]
   }
  },
  {
   "id": "CAM_LEO_FRONT",
   "role": "character",
   "fov": 38,
   "from": {
    "pos": [
     1.05,
     1.72,
     1.55
    ],
    "target": [
     -1.18,
     1.12,
     -0.12
    ]
   },
   "to": {
    "pos": [
     0.7,
     1.62,
     1.28
    ],
    "target": [
     -1.15,
     1.12,
     -0.12
    ]
   }
  },
  {
   "id": "CAM_LEO_OTS",
   "role": "over-shoulder",
   "fov": 40,
   "from": {
    "pos": [
     0.3,
     1.78,
     -1.7
    ],
    "target": [
     -0.9,
     1.0,
     0.58
    ]
   },
   "to": {
    "pos": [
     0.12,
     1.7,
     -1.45
    ],
    "target": [
     -0.92,
     1.0,
     0.58
    ]
   }
  },
  {
   "id": "CAM_YU_FRONT",
   "role": "character",
   "fov": 38,
   "from": {
    "pos": [
     3.25,
     1.72,
     1.55
    ],
    "target": [
     1.02,
     1.12,
     -0.12
    ]
   },
   "to": {
    "pos": [
     2.9,
     1.62,
     1.28
    ],
    "target": [
     1.05,
     1.12,
     -0.12
    ]
   }
  },
  {
   "id": "CAM_YU_OTS",
   "role": "over-shoulder",
   "fov": 40,
   "from": {
    "pos": [
     2.5,
     1.78,
     -1.7
    ],
    "target": [
     1.3,
     1.0,
     0.58
    ]
   },
   "to": {
    "pos": [
     2.32,
     1.7,
     -1.45
    ],
    "target": [
     1.28,
     1.0,
     0.58
    ]
   }
  },
  {
   "id": "CAM_NOVA_FRONT",
   "role": "character",
   "fov": 38,
   "from": {
    "pos": [
     5.45,
     1.72,
     1.55
    ],
    "target": [
     3.22,
     1.12,
     -0.12
    ]
   },
   "to": {
    "pos": [
     5.1,
     1.62,
     1.28
    ],
    "target": [
     3.25,
     1.12,
     -0.12
    ]
   }
  },
  {
   "id": "CAM_NOVA_OTS",
   "role": "over-shoulder",
   "fov": 40,
   "from": {
    "pos": [
     4.7,
     1.78,
     -1.7
    ],
    "target": [
     3.5,
     1.0,
     0.58
    ]
   },
   "to": {
    "pos": [
     4.52,
     1.7,
     -1.45
    ],
    "target": [
     3.48,
     1.0,
     0.58
    ]
   }
  },
  {
   "id": "CAM_RIN_FRONT",
   "role": "character",
   "fov": 38,
   "from": {
    "pos": [
     7.65,
     1.72,
     1.55
    ],
    "target": [
     5.42,
     1.12,
     -0.12
    ]
   },
   "to": {
    "pos": [
     7.3,
     1.62,
     1.28
    ],
    "target": [
     5.45,
     1.12,
     -0.12
    ]
   }
  },
  {
   "id": "CAM_RIN_OTS",
   "role": "over-shoulder",
   "fov": 40,
   "from": {
    "pos": [
     6.9,
     1.78,
     -1.7
    ],
    "target": [
     5.7,
     1.0,
     0.58
    ]
   },
   "to": {
    "pos": [
     6.72,
     1.7,
     -1.45
    ],
    "target": [
     5.68,
     1.0,
     0.58
    ]
   }
  }
 ],
 "actors": {
  "kai": {
   "name": "阿凯 Kai",
   "costume": {
    "skin": "#e2b08a",
    "hair": "#1d1a17",
    "top": "#2f8f83",
    "bottom": "#3b3f4a",
    "hairStyle": "beanie"
   },
   "mark": "desk1.seat",
   "desk": "desk1",
   "seated": true,
   "ambient": "typing"
  },
  "mia": {
   "name": "米娅 Mia",
   "costume": {
    "skin": "#f0c09a",
    "hair": "#6b3b25",
    "top": "#e3a33a",
    "bottom": "#4f6d8a",
    "hairStyle": "bun"
   },
   "mark": "desk2.seat",
   "desk": "desk2",
   "seated": true,
   "ambient": "typing"
  },
  "leo": {
   "name": "李奥 Leo",
   "costume": {
    "skin": "#d49a74",
    "hair": "#2a1e18",
    "top": "#c8423a",
    "bottom": "#2d3340",
    "hairStyle": "short",
    "glasses": true
   },
   "mark": "desk3.seat",
   "desk": "desk3",
   "seated": true,
   "ambient": "typing"
  },
  "yu": {
   "name": "小雨 Yu",
   "costume": {
    "skin": "#f2cdb0",
    "hair": "#121212",
    "top": "#eeece6",
    "bottom": "#3a3a3a",
    "hairStyle": "long"
   },
   "mark": "desk4.seat",
   "desk": "desk4",
   "seated": true,
   "ambient": "typing"
  },
  "nova": {
   "name": "诺娃 Nova",
   "costume": {
    "skin": "#c98e6c",
    "hair": "#ff5fb0",
    "top": "#232033",
    "bottom": "#262234",
    "hairStyle": "spiky",
    "headphones": true
   },
   "mark": "desk5.seat",
   "desk": "desk5",
   "seated": true,
   "ambient": "typing"
  },
  "rin": {
   "name": "琳 Rin",
   "costume": {
    "skin": "#f3d0b5",
    "hair": "#3a2a22",
    "top": "#8fc4ae",
    "bottom": "#6f6488",
    "hairStyle": "short"
   },
   "mark": "desk6.seat",
   "desk": "desk6",
   "seated": true,
   "ambient": "typing"
  }
 }
}
```

### 39/55 · `stop-motion-3d/assets/template/tsconfig.json`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/tsconfig.json", "lines": 8, "final_newline": true, "sha256": "443b2705114d803ab19954fe2d1b9037f170c68ac4ca57bc44c4dbaeeda345ac", "original_sha256": "443b2705114d803ab19954fe2d1b9037f170c68ac4ca57bc44c4dbaeeda345ac"} -->
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

### 40/55 · `stop-motion-3d/assets/template/web/film.html`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/web/film.html", "lines": 8, "final_newline": true, "sha256": "d64b47b49c1358cde72d980f9a2342b0f325c3c2d6eae2a7189d06a589c78c43", "original_sha256": "d64b47b49c1358cde72d980f9a2342b0f325c3c2d6eae2a7189d06a589c78c43"} -->
```html
<!doctype html>
<html><head><meta charset="utf-8"><link rel="icon" href="data:,"><title>film</title>
<style>html,body{margin:0;background:#000}canvas{display:block}#gl{position:absolute;left:-99999px}</style>
</head><body>
<canvas id="gl" width="1280" height="720"></canvas>
<canvas id="out" width="1280" height="720"></canvas>
<script type="module" src="./dist/film.js"></script>
</body></html>
```

### 41/55 · `stop-motion-3d/assets/template/web/sandbox.html`
<!-- casebook-file {"path": "stop-motion-3d/assets/template/web/sandbox.html", "lines": 31, "final_newline": true, "sha256": "fc77033778fc959fe4c974d7a3bc23adece3d16a415e37bd8738a0dfd45d6ec5", "original_sha256": "fc77033778fc959fe4c974d7a3bc23adece3d16a415e37bd8738a0dfd45d6ec5"} -->
```html
<!doctype html>
<html lang="zh"><head><meta charset="utf-8"><link rel="icon" href="data:,"><title>Sandbox · studio</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{--bg:#0e1117;--panel:#161b24f0;--line:#2a3242;--ink:#eef2f8;--dim:#8b97ab;--acc:#ffcc33;--cyan:#66d9ff}
  html,body{margin:0;height:100%;background:var(--bg);color:var(--ink);font:13px/1.4 "Noto Sans CJK SC",system-ui,sans-serif;overflow:hidden}
  #stage{position:absolute;top:0;left:0;bottom:0;right:318px;display:flex;align-items:center;justify-content:center}
  #gl{width:min(100vw - 350px,(100vh - 30px)*16/9);height:auto;aspect-ratio:16/9;border-radius:10px;box-shadow:0 10px 40px #0008}
  .dock{position:fixed;top:14px;right:14px;bottom:14px;width:290px;overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:12px}
  header b{font-size:15px} header span{display:block;color:var(--dim);font-size:12px}
  section>label{display:block;color:var(--dim);font-size:11px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px}
  button{background:#1f2633;color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:6px 8px;cursor:pointer;font:inherit}
  button:hover{border-color:var(--cyan)} button.on{background:var(--acc);color:#111;border-color:var(--acc)}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px} .row{display:flex;gap:6px} .row button{flex:1}
  #shots button{display:flex;flex-direction:column;align-items:flex-start;text-align:left} #shots small{opacity:.75;font-size:11px}
  input[type=range]{width:100%;accent-color:var(--acc)}
  dl{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;margin:0;font-variant-numeric:tabular-nums} dt{color:var(--dim)} dd{margin:0} dd.on{color:var(--acc);font-weight:600}
  @media (max-width:760px){#stage{right:0;bottom:44%}.dock{top:auto;left:14px;width:auto;height:42%}#gl{width:100vw}}
</style></head>
<body>
<div id="stage"><canvas id="gl" width="1280" height="720"></canvas></div>
<aside class="dock">
  <header><b>Sandbox · Loft studio</b><span>一个世界 · 六位开发者 · 七条画风管线</span></header>
  <section><label>View</label><div class="row"><button id="orbit">自由环绕</button><button id="shot">镜头机位</button><button id="giz">机位/站位</button></div></section>
  <section><label>Look pipeline</label><div class="grid" id="looks"></div></section>
  <section><label>Time</label><div class="row"><button id="play">▶</button></div><input id="scrub" type="range" min="0" value="0"></section>
  <section><label>Shots</label><div class="grid" id="shots"></div></section>
  <section><label>World state (continuity)</label><dl id="state"></dl></section>
</aside>
<script type="module" src="./dist/sandbox.js"></script>
</body></html>
```

### 42/55 · `stop-motion-3d/references/acting.md`
<!-- casebook-file {"path": "stop-motion-3d/references/acting.md", "lines": 111, "final_newline": true, "sha256": "aef5bebf8bcf3b56ea3cf5a43738a78eb9453a0ae4beb1d420154441a1e20050", "original_sha256": "aef5bebf8bcf3b56ea3cf5a43738a78eb9453a0ae4beb1d420154441a1e20050"} -->
````markdown
# Acting：木偶、姿态、IK、连续性

## 目录
1. 木偶结构
2. poses.json
3. IK：三种接触
4. 表演轨：关键帧与循环
5. 时钟与步进
6. 连续性：状态与事件
7. inspect 探针与数字化验收
8. 扩展（站立、行走、口型）

---

## 1. 木偶结构（`runtime/rig.ts`）

6 块刚体，单位 PX = 0.055 m（像素比例的方头人偶）：

| 部件 | 尺寸 (PX) | 说明 |
|---|---|---|
| 腿 ×2 | 4×10×4 + 鞋 | 坐姿时屈膝 |
| 身体 | 8×12×4 | torso 旋转 [x,y,z]° |
| 头 | 8×8×8 | 眼、嘴、发型（beanie/bun/spiky/long…）、眼镜、耳机 |
| 手臂 ×2 | 4×7.5×4 | 肩关节旋转，末端手 3.6×3×3.6 |

- 手里有 **socket**（肩下 8.5PX）：可持有物挂在这里。socket 的四元数 = inv(身体·手臂) · Rx(tilt)，所以杯子不随手臂歪，`tiltR` 只做有意的倾斜（喝水 −25°，倒水 38°）。
- 坐姿髋高 = 椅面 + 2PX。
- 刚体 + 步进 = 定格感；不要加蒙皮，也不要把关节插值做得过于平滑。

## 2. poses.json

```jsonc
"hit_enter": {
  "base": "seated",                 // 继承
  "torso": [6, -4, 0], "head": [20, -6, 0],     // 度
  "handL": {"reach": "keyboard", "offset": [-0.1, 0, 0.02]},   // surface：落在键盘面上
  "handR": {"reach": "enter", "exact": true}                  // exact：指尖到回车键
},
"sip": { "base": "seated", "torso": [-6,0,0], "head": [-14,0,0],
  "handR": {"reach": "mouth", "offset": [0.05, -0.13, 0.03]}, "tiltR": -25 }
```

- `reach`：道具锚点名（在角色**自己的桌子**上查找）或 `mouth`。
- `offset`：相对锚点的米制偏移（左右手在键盘上分开 ±0.1）。
- `armL/armR` 直接给角度时不走 IK（挥手、欢呼）。
- 姿态库跟世界走（锚点是世界的词汇）；新世界要新锚点，就加新姿态。

样片用到的 34 个姿态：seated, seated_idle, seated_breathe, type_a/b, look_screen, anticipate_enter, hit_enter, cheer, cheer_b, reach_mug, hold_mug, sip, content, reach_sheet, show_sheet, study_sheet, point_up, draw_a/b/c, think, tap, lean_back, nod_a/b, point_screen, fist_pump, reach_can, lift_can, pour, admire, admire_can。

## 3. IK：三种接触

| 模式 | 用在 | 求解 |
|---|---|---|
| `surface` | 手放在桌面/键盘上 | 手的最低点落在目标平面上：对"肩为圆心、臂长为半径的圆"与平面求交；4 轮迭代，累积补偿 `(目标y − 手最低y)`，抵消手块四角下沉 |
| `exact` | 按键、握杯、拿纸 | 指尖（HAND_TIP = 8.5PX）精确到点：身体偏航 = atan2(局部x − 侧偏, z)×0.55，然后对手臂俯仰在 [−30°, 45°] 二分 |
| `free` | 到嘴边、举高、`lift` | 不约束支撑面 |

验收数字（样片实测）：surface 接触深度 ≥ −1.7mm；exact 误差 ≤ 2.5cm；穿插 0。

踩过的坑：把"指尖到目标的距离"当 exact 的指标会误导（手块是有体积的）→ 改用 `handDistance`（点到手的 OBB 的距离）。

## 4. 表演轨（`runtime/acting.ts`）

关键帧：`{actor, at, pose, ease}`，ease ∈ linear/inOut/in/out/**hold**（保持上一姿态直到这个时刻，再跳）。

循环：`{actor, loop, from, to, rate?}`，展开成关键帧：

| loop | 姿态 | 频率 | ease |
|---|---|---|---|
| typing | type_a, type_b | 3/s | hold |
| draw | draw_a, b, c, b | 4/s | hold |
| nod | nod_a, nod_b | 2.2/s | inOut |
| idle | seated_idle, seated_breathe | 0.8/s | inOut |

每个有意义的动作写成四段：
```
预备 anticipate (0.2–0.4s) → 动作 action (0.2–0.5s) → 反应 reaction → 停顿 hold (≥ 0.3s)
```
样片的"按回车"：look_screen → anticipate_enter（抬手、身体后仰）→ hit_enter（exact 到键，键帽按下）→ cheer / cheer_b 交替。

伸手拿东西：`reach_x`（inOut 到位）→ 同一姿态 `hold` 到事件时刻 → 事件把道具挂到手上 → `hold_x`。**拿起的那一帧，手必须已经在道具上**（inspect 验证）。

## 5. 时钟与步进

- `poseT = floor(t × poseFps + 1e-6) / poseFps`；姿态在 poseT 上采样，所以 12fps 画风每姿态 2 帧、8fps 3 帧。
- 同一帧的 IK 结果在所有画风之间共享（pose cache），分屏和 wipe 时不重复求解。
- 动作时长要是 hold 的整数倍才干净：8fps 下 0.375s = 3 张。
- `finalize.py` 的 stepping 检查：每个镜头内 poseT 的连续段长度必须一致（样片：12fps 画风全是 2，8fps 全是 3）。

## 6. 连续性：状态与事件

- 所有"世界里变了的东西"都是 `world.state` 的键；事件 `{t, set}` 在 `poseT ≥ t` 时生效。
- 状态逐镜累积：S04 拿起杯子 → S05 开始时杯子仍在手里 → S05 放回。validate 会模拟整条状态链，检查"一只手两件东西"和"从别人手里拿"。
- 派生优于存储：回车键按下 = 指尖距离 < 3.5cm；植物挺立动画 = 从 `plant.watered` 事件起算的时间（`sinceEvent`）。
- 声音读同一份事件：拿杯 = 瓷器轻碰，放下 = 碰 + 闷响（sound.md）。

## 7. inspect 探针

```bash
node scripts/capture.mjs --inspect 0:1440 --out out/qc/inspect.json
```
每帧一行：`{frame, shot, look, localFrame, poseT, sig{actor:"a>b@u"}, contacts[{actor, hand, mode, pose, gap, surface}], penetration[]}`。

- `sig` 的 `a>b@u`：当前在关键帧 a 和 b 之间，进度 u。`a == b` 表示"到位并保持"——音频用它派生打字声。
- 看表：`python3 -c` 读 json，筛 `penetration` 非空的帧、`surface < -0.01` 的接触、`exact` 且 `gap > 0.03` 的接触。

## 8. 扩展

- **站立/行走**：`seated:false` 站在 mark；行走 = 在 acting 里给 actor 位移关键帧（在 Puppet 根节点上插值位置，腿用 walk_a/b 姿态循环 on twos），脚步声在姿态到位帧派生。
- **口型**：头上已有 mouth 锚点；可加 mouth_open/closed 部件，按 VO 能量包络量化到 poseFps 切换。
- **表情**：眼睛是独立小块，可以按状态换形（眨眼 = 1 张 hold 的压扁）。
````

### 43/55 · `stop-motion-3d/references/directing.md`
<!-- casebook-file {"path": "stop-motion-3d/references/directing.md", "lines": 139, "final_newline": true, "sha256": "0d136aa75a2bb4e5b256d3e0712d80baf0938242d07bce317d0ea8cc937b995f", "original_sha256": "0d136aa75a2bb4e5b256d3e0712d80baf0938242d07bce317d0ea8cc937b995f"} -->
````markdown
# Directing：剧集、节拍、机位、转场、MG

## 目录
1. episode.json 完整字段
2. 8 节拍与时长缩放
3. 戏剧句与英雄道具
4. 镜头语法（机位、运动、轴线）
5. 转场：cut / wipe / bands
6. MG 图层（定格表演，MG 解释）
7. 片型模板：宣传混剪 / 知识讲解 / 剧情短片与漫剧 / 公益提示
8. 写镜头表的顺序

---

## 1. episode.json 完整字段

```jsonc
{
  "title": "stop-motion-3d · skill intro",
  "world": "studio",            // 必须等于 world.json 的 id
  "fps": 24, "width": 1280, "height": 720,
  "screens": {"1": "block", "2": "clay"},   // 显示器 N 显示哪个画风的缩略图（0 号 = 电视 logo）
  "shots": [ Shot, ... ]
}
```

Shot：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✓ | `S01`… 唯一 |
| `beat` | ✓ | world / character / problem / opportunity / decision / work / turn / result / echo |
| `story_function` | ✓ | 一句话：这个镜头为什么存在。写不出来就删掉这个镜头 |
| `duration` | ✓ | 秒；帧数 = round(duration × fps) |
| `camera` | ✓ | world.cameras 的 id |
| `look` | ✓ | 画风 id |
| `variant` |  | 覆盖画风默认的 day/night |
| `transition` |  | `{type:"wipe", from:<上一镜画风>, frames:14}`；缺省 = 硬切 |
| `acting` |  | 关键帧 `{actor, at, pose, ease?}` 或循环 `{actor, loop, from, to, rate?}` |
| `events` |  | `{t, set:{state:value}}`，在步进时钟上触发 |
| `state` |  | 本镜头开始时强制设置的状态（续集/跳切用） |
| `mg` |  | MG 条目，见 §6 |
| `bands` |  | `{looks:[...], start, stagger}` 分屏并列多画风 |

没有写 acting 的角色会自动得到"环境表演"（按种子错开的打字循环），背景永远是活的。

## 2. 8 节拍与时长缩放

```
world → character → problem/opportunity → decision → work → turn → result → echo
0-7s     7-14        14-22                 22-30       30-38   38-46   46-54    54-60
```

- 15s：world + (decision+work) + result，3–4 镜。
- 30s：5–6 镜，character 和 turn 可合并。
- 60s：8–14 镜，**最稳的档位**。
- 90–180s：把节拍**展开成更多镜头**（12–17 镜），不是拉长静帧。每个节拍演完后的无台词静止预算 ≤ 3 帧；后期再砍是反面教材（有片子事后从 184s 砍到 104s）。

结尾与开头押韵：空→满、暗→亮、一个→全部、静→动。样片：开头"一间房、六台显示器各显示一种风格"，结尾"同一间房拉远，分成六条画风并列"。

## 3. 戏剧句与英雄道具

写镜头表之前先写两句：
```
情绪句：看完观众应该感到 ___，因为 ___ 变了。
戏剧句：[角色] 想要 [具体目标]，但是 [阻碍]，于是 [这个媒介特有的动作]，导致 [可见变化]，留下 [情绪结果]。
```
英雄道具 = 世界逻辑 + 视觉焦点 + 情绪符号，早引入、结尾改变状态（样片里：琳的植物，浇水后挺立）。

## 4. 镜头语法

- **机位**全部来自 world.json；每个角色至少 FRONT（3/4 正面，看脸和手）+ OTS（过肩，看屏幕）。
- **运动**只做缓推、缓拉、平移、微摇；`from == to` 是固定机位。禁止恒速环绕、无动机变焦、自由飞行。
- **轴线**：全片守同一侧；角色在画面的左右不变；视线匹配。
- **景深层次**：前景遮挡物（桌角、植物）– 主体 – 背景（墙、窗、远景）。
- 镜头时长：动作镜 3–5s；信息镜（有 lower third）≥ 4s，字幕在屏 ≥ 1.2s（validate 会警告）；全景 5s 左右。
- 一个镜头只讲一件事：一个动作 + 一条信息。

## 5. 转场

| 类型 | 用在 | 成本 |
|---|---|---|
| 硬切 | 同画风内换机位 | 1× |
| wipe（14 帧，噪声斜边，强调色描边） | 换画风 | 转场期间 2× |
| bands（最多 6 条 + 底图） | 结尾对比、"一种世界多种画风" | 最多 7× |

wipe 期间两个画风渲的是**同一帧同一机位**，所以边界上物体完全对位——这就是"世界在换画风"的观感来源。`from` 必须是上一镜的画风。

bands 从 `start` 秒开始、每 `stagger` 秒揭开一条，配 `bandLabels` MG；结尾标语在所有条揭开之后出。

## 6. MG 图层（`runtime/mg.ts`，连续时钟）

| kind | 位置 | 字段 |
|---|---|---|
| `title` | 居中 | text, sub, size(86), y(.42), panel(半透明底), subSize, subGap, color |
| `chip` | 左上 | text（"03 / 06"），color |
| `lower` | 左下 | text（大字名）、sub（英文行）、tags（小字标签行）、color |
| `note` | 右上 | text、sub（谁在做什么 / 一条原理） |
| `bandLabels` | 各分屏底部 | labels[] |
| `mark` | 右下水印 | text |

所有条目都有 `from/to`（镜头内秒）和 0.35s 淡入淡出（`fade` 可改）。

原则：
- **定格表演，MG 解释**。角色不"讲话"，信息靠 MG；MG 不遮手和脸（lower 在左下，所以角色机位让人物偏右）。
- 字号：主标题 86px、lower 50px、note 22px（1280×720）。浅字加阴影，复杂背景加 panel。
- 中文字体：Noto Sans CJK SC（capture 页面会等字体加载完）。

## 7. 片型模板

### A. Skill / 产品宣传混剪（样片，60s）
| 段 | 时长 | 镜头 |
|---|---|---|
| world | 5s | CAM_EST 全景，title："一个世界，七种画风" |
| 每个角色 × 6 | 7.5s | FRONT 4.5s（wipe 进场；chip + lower + note）→ OTS 3s（note 讲一条原理） |
| echo | 10s | CAM_END 拉远 + bands 六画风 + 标语 + 片尾音乐停顿 |

每个角色在 FRONT 里做一件和画风气质相符的事（按回车欢呼 / 端杯喝 / 抽稿纸 / 画板 / 点头指屏 / 浇花），事件驱动道具。

### B. 知识讲解（60–90s，单画风 vox 或 sketch）
world → 问题（角色卡住，note 写问题）→ 三个步骤（每步一个 OTS，屏幕显示结果，lower 写步骤名）→ turn（关键洞见，title）→ result → echo。节奏更慢，信息镜 5–6s。

### C. 剧情短片 / 漫剧（单集 60–180s）
- 单画风为主（comic、clay、watercolor 常用），画风切换只用于"回忆/幻想/梦"。
- 用 variant 做时间：白天→夜晚。
- 连续性全部写成状态事件；续集第一镜用 `state` 接上集结尾。
- 对白：MG note/字幕 + 头部动作；需要配音时 VO 实测时长写回镜头时长（sound.md）。

### D. 公益 / 安全提示（30–60s）
错误示范（comic 或 block，夜/危险）→ 后果停顿（静默）→ 正确做法（diorama 或 clay，白天）→ 口号 title。新场景（工地等）按 world.md §11 建。

## 8. 写镜头表的顺序

1. 情绪句 + 戏剧句。
2. 节拍表：每个节拍一行，写 story_function。
3. 分配机位（缺机位先去 world.json 加）和画风。
4. 表演：每个镜头一个动作，按 预备→动作→反应→停顿 写关键帧。
5. 事件（道具挂点）和 MG。
6. `validate.py --timeline` 读一遍；`capture.mjs --frames` 抽故事板。
````

### 44/55 · `stop-motion-3d/references/first-principles.md`
<!-- casebook-file {"path": "stop-motion-3d/references/first-principles.md", "lines": 158, "final_newline": true, "sha256": "3103dc41cb402438645c5c9dec0e565d8921253d04d7924a80615fd6ef752fcf", "original_sha256": "3103dc41cb402438645c5c9dec0e565d8921253d04d7924a80615fd6ef752fcf"} -->
````markdown
# 第一性原理：为什么是这套结构

改架构之前读这一篇。每一条都写了"要解决什么"、"怎么解"、"证据是什么"。

## 目录
1. 问题到底是什么
2. 四层拆分
3. 为什么先搭世界
4. 为什么画风是整条管线
5. 两个时钟
6. 确定性：渲染是帧号的纯函数
7. 先有数据，再有像素
8. 为什么用原生 Three.js，不用 Remotion + R3F
9. 成本模型（实测）
10. 可验证：inspect 探针
11. 这套结构不擅长什么

---

## 1. 问题到底是什么

"用代码做一条好看的动画片"其实是五个彼此冲突的要求：

| 要求 | 天然冲突 |
|---|---|
| 画面要有**手作感**（定格、手绘、纸片） | 3D 引擎天生是光滑、连续、干净的 |
| 要能**换风格** | 每种风格的材质、光、后期、节奏都不同 |
| 要能**拍系列** | 一次性脚本式场景没法复用 |
| 要**可控**（导演意图精确落地） | 生成式方法不可控，手写每帧又不可维护 |
| 要**可验证**（交付前能证明没穿帮） | "看着还行"不可复查 |

每个冲突都对应一个设计决定。下面逐条展开。

## 2. 四层拆分

```
World（是什么）──► Look（长什么样）──► Frame
     ▲                                  ▲
Episode（何时、谁、做什么）──────────────┘
                                        ▼
                              Delivery（采集 / 声音 / 封装 / QC）
```

拆分依据是**变化频率**和**复用范围**：

- World 变化最慢（一个系列一次），复用最广（所有剧集、所有画风）。
- Look 和世界正交：同一个世界 × N 个画风。
- Episode 变化最快（每条片都不同），但只是数据。
- Delivery 与内容无关。

层与层之间只有窄契约：World 只通过 `Prims`（box/cyl/sphere/plane + 语义材质字符串）造几何；Look 只通过 `LookDef.material(sem)` / `geometry` / `setup` / `post` 起作用；Episode 只引用名字（机位 id、姿态名、画风 id、状态键）。所以任何一层都能单独替换。

## 3. 为什么先搭世界

动画片最贵的不是渲染，是**决策**：这张桌子在哪、灯从哪来、角色坐哪、机位怎么摆。只要这些决策散落在每条片的脚本里，就：

- 连续性没法保证（上一镜杯子在左，下一镜在右）；
- 续集等于重做；
- 换风格等于重做。

所以世界是一个**持久的沙盒**：布景、道具、角色、标记点（marks）、命名机位、可持有物、世界状态全部一次定义。剧集只是"在这个世界里拍什么"。

证据：本 skill 的样片里 6 个画风 × 14 个镜头都来自同一个 `world.json` + `props.ts`；分屏结尾把同一帧用 7 条管线各渲一次再拼，完全对位，这只有在世界和画风彻底解耦时才可能。

## 4. 为什么画风是整条管线

"风格"的第一性定义：**观众靠什么认出这种风格**。拆开看每种风格的识别特征落在五个不同的层：

| 画风 | 几何 | 着色 | 光 | 屏幕空间 | 节奏 |
|---|---|---|---|---|---|
| 方块 | 圆柱/球变方块 | Lambert + 16px 像素纹理 | 平 | 几乎无 | 12fps |
| 黏土 | 圆角团块 | 粗糙 + 指纹 bump | 暖、软 | 浅景深 | 8fps |
| Vox 纸片 | 普通 | 2 阶 toon + 编辑部配色 | 平 | 撕纸边、纸层投影、网点、错版 | 8fps + 相机步进 |
| 手绘线稿 | 普通 | 淡彩 | 平 | 描边 + 线条抖动 + 排线 | 12fps + 相机步进 |
| 水彩 | 普通 | 高饱和底色 | 平 | 晕染、边缘积色、纸纹、底稿 | 12fps |

只改调色板，只动了"着色"一列的一半，所以"换皮像素风"永远不像。**LookDef 必须能碰到全部五列**，这就是它的接口为什么包含 `geometry`、`material`、`setup`（光）、`post`（全屏 pass）、`poseFps/cameraOnTwos`（节奏）。

屏幕空间后期需要的输入是固定的：颜色（MSAA4、HalfFloat）、法线 + 深度（另一张目标）。描边、网点、晕染、景深、AO 都只从这两张图算，所以新画风不必动世界。

## 5. 两个时钟

定格动画的手感来自一个**对比**：角色一格一格地动，但世界（相机、光、尘埃、水）是连续的。全步进会像卡顿，全连续就是普通 CG。

- `t`：连续秒数 → 相机、粒子、光的变化、MG 字幕。
- `poseT = floor(t × poseFps + 1e-6) / poseFps` → 木偶姿态、事件触发。
- `hold = fps / poseFps`：12fps → 每姿态 2 帧（on twos），8fps → 3 帧（on threes）。
- 纯 2D 感的画风（Vox、线稿）连相机也步进（`cameraOnTwos`），因为手绘/剪纸本来就是每张重画。

`+1e-6` 不是装饰：`int(t*12)` 会在浮点误差下偶尔吃掉或多出一格。

事件也用 `poseT` 触发，于是"手到了杯子"和"杯子挂到手上"必然在同一帧。

## 6. 确定性：渲染是帧号的纯函数

`frame(f)` 只依赖 f 和数据。没有 `Math.random()`（用 `rng(seed)`）、没有 `Date.now()`、没有跨帧累积（粒子位置是 `t` 的解析函数）。好处：

- **断点续渲**：已存在的帧跳过；进程被杀后重跑不会出错。
- **任意顺序 / 并行**：抽帧做故事板和全片渲染出来的是同一张图。
- **可回归**：改了共享道具后，用 `compare_frames.py` 比较前后抽帧。
- **姿态缓存**：同一帧的 IK 结果在多个画风之间共享（分屏时省 6 次求解）。

## 7. 先有数据，再有像素

一切"事实"只写一次，其他地方都派生：

| 事实 | 唯一来源 | 派生出 |
|---|---|---|
| 镜头时长与顺序 | episode.json | 帧范围、meta.json、音乐段落、QC 期望帧数 |
| 事件（拿起、放下、倒水） | episode.events | 世界状态、道具挂点、Foley 时刻、cue 表 |
| 姿态到位 | acting 关键帧 → inspect 签名 | 打字/铅笔/回车声 |
| 转场 | shot.transition | wipe 合成、whoosh 提前量、签名音效 |
| 片尾标题时间 | shot.mg | 静默窗口、终止和弦 |

声音不是"对着画面手工对点"，而是读同一份数据算出来的，所以不可能错位。验证在渲染前做（`validate.py`、`--inspect` 不出像素），出错的成本是秒级，而不是全片重渲的半小时。

## 8. 为什么用原生 Three.js，不用 Remotion + R3F

尝试过 Remotion 的 Three 接口。结论是它适合"React 组件里放一个 3D 小物件"，不适合本 skill 的需求：

- 多画风 = 同一世界要**同时存在 7 份场景副本**（每份材质不同），外加自定义 G-buffer 和多个全屏 pass。命令式 Three.js 直接控制 render target、场景副本和 pass 顺序；R3F 的声明式树在这里是阻力。
- 分屏 bands 在一帧内渲 7 次再合成；wipe 渲 2 次。这需要在一帧内精确控制多次 `renderer.render`。
- 采集只需要 `window.film.frame(f)` 一个契约；Playwright 驱动 headless Chromium 即可，不需要额外框架和许可。
- 依赖面小：`three` + `esbuild` + `playwright-core`，四个包。

如果用户项目本来就在 Remotion 里，可以把 `film.frame(f)` 包成一个 `<Img>` 序列帧组件接进去；世界、画风、剧集层不用改。

## 9. 成本模型（SwiftShader 纯 CPU，1280×720，实测）

| 项 | 耗时 |
|---|---|
| 无抗锯齿单次渲染 | 1.17 s |
| MSAA 4×（采用） | 1.61 s（优化后整帧 0.7–1.3 s） |
| 2× 超采样 | 4.19 s（放弃） |
| 10 盏点光 | +0.35 s（→ 关掉的灯设 `visible=false`） |
| PMREM 环境贴图 | +0.4 s（→ 不用，用半球光 + 反弹光替代） |
| wipe 转场帧 | ×2（两个画风各渲一次） |
| 分屏 6 画风 | 最多 ×7 |

教训：读回 HalfFloat 目标不会同步，早期测出来的"MSAA 很快"是假的；改用 RGBA8 探针读回才得到真实数字。**先测再优化，测法本身要先验证。**

60s 片 ≈ 1440 帧，平均 ~1 s/帧，全片 20–35 分钟。所以：渲染后台跑、可续跑；音频、文档、打包在渲染期间并行做。

## 10. 可验证：inspect 探针

`window.film.inspect(f)` 不出像素，只返回：

- 每只手的接触：模式（surface/exact/free）、到目标的距离 `gap`、到支撑面的高度 `surface`；
- 穿插：手的包围盒角点进入任何 collider 且深度 > 4mm；
- 每个角色的姿态签名 `"type_a>type_b@0.500"`（当前关键帧对和插值进度）。

1440 帧的 inspect 只要几十秒。它把"手有没有按到键上"变成数字，也给音频提供"姿态到位"的时刻。

## 11. 这套结构不擅长什么

- 写实渲染、毛发、布料、流体模拟：刻意不做；木偶是刚体，定格的美学本来就不需要。
- 口型同步：木偶有 mouth 锚点，但没有做音素驱动；需要对白时用 MG 字幕 + 头部动作，或扩展 rig（见 acting.md §扩展）。
- 超长片（>5 分钟）的 CPU 渲染时间线性增长；有 GPU 时去掉 SwiftShader 参数可快一个数量级。
````

### 45/55 · `stop-motion-3d/references/lessons.md`
<!-- casebook-file {"path": "stop-motion-3d/references/lessons.md", "lines": 54, "final_newline": true, "sha256": "88660dc8339c6b318ce519bb3ddf5bb7a9cec50bac54d77d83b5a5070ee8cc58", "original_sha256": "88660dc8339c6b318ce519bb3ddf5bb7a9cec50bac54d77d83b5a5070ee8cc58"} -->
```markdown
# Lessons：踩过的坑与修法

按"下次一定别再犯"排序。每条：现象 → 原因 → 修法。

## A. 工程

1. **测出来的性能是假的**：MSAA 看起来几乎不花时间。→ 读回 HalfFloat 目标不会同步 GPU 队列。→ 用 RGBA8 探针目标 `readPixels` 计时。修正后 MSAA4 1.61s vs 1× 1.17s vs 2×SSAA 4.19s，才定下 MSAA4。
2. **关掉的灯仍然很贵**：10 盏 intensity=0 的点光 +0.35s/帧。→ 着色器仍在循环所有灯。→ 白天 `visible=false`。
3. **PMREM 环境贴图 +0.4s/帧**：→ 删掉，用半球光 + 反弹方向光替代。
4. **手陷进桌面 1.6cm**：→ 手块是有体积的，旋转后最低角低于手心。→ surface 模式迭代补偿：把求解平面抬高（目标y − 手最低y）累积 4 轮，误差到 −1.7mm。
5. **exact 指标误导**：指尖点到目标很近但手块穿过去了。→ 改用点到手 OBB 的距离 `handDistance`。
6. **桌上的植物掉到地上**：道具默认 y=0。→ DeskItem 加 `y` 字段（桌面道具写 0.75）。
7. **拿在手里的纸变成一条线**：纸跟着手臂旋转成侧面。→ socket 四元数取手臂的逆，道具保持世界朝向 + 有意的 tilt。
8. **电视被边框挡住**：屏幕平面和边框共面。→ 屏幕平面前移（x = −9.13）。
9. **过肩镜被大头挡住画面**：方头人偶头大。→ 机位移到右后方更高处，target 压低到桌面（反复迭代后定稿）。
10. **2D 画风里尘埃像脏点**：→ 2D 画风 setup 隐藏 dust；尘埃数量 260、粒径 .014。
11. **lower third 文字重叠**：→ 盒子宽度用 measureText 测量；三行固定基线（tags −52 / 名字 / sub +40）。
12. **结尾标题看不清**：六条分屏背景太花。→ title 加 `panel` 半透明底。
13. **查看器画布被右侧面板挡住**：→ `#stage` right: 318px。
14. **Python 批量改 episode 时 KeyError 'text'**：chip/mark 没有 text。→ `m.get("text", "")`。

## B. 节奏与表演

15. 演完之后的静止超过 3 帧就显得"卡住"；长片后期再砍是反面教材——在镜头表里就压住。
16. 每个动作都要预备；没有预备的动作看起来像瞬移。
17. 背景人物不动 = 布景是死的 → 没有 acting 的角色自动打字（错开相位）。
18. `int(t*12)` 偶尔吃掉一格 → 一律 `floor(x + 1e-6)`。
19. 手绘类画风相机连续运动会让线稿像贴纸 → `cameraOnTwos`。
20. 剪纸不沸腾、手绘要沸腾：Vox 的纸边抖动固定，sketch 的线按 uStep 重画。

## C. 声音

21. AAC 编码后真峰值从 −1.5 抬到 ≈0 dBTP，只能整片重编。→ 母带留余量（−2.0），断言 MP4 内的值。
22. 安静开场用 loudnorm 动态归一，环境声被不成比例抬高。→ 恒定增益。
23. 音乐段落跨画风切换点会很乱。→ 选 bpm 让切换落在小节线（样片 96 BPM × 7.5s 段）。
24. 静默必须设计：写进 cue（样片片尾标题前 0.5s）。

## D. 流程

25. **报告最后才写 → 进程被杀后什么都没有**。→ qc-report 开头就落盘，逐步更新；manifest 独立一步。
26. 长任务要能脱离会话独立跑、能续跑（capture 跳过已存在帧）。
27. 原片永不覆盖；改版另存 v2。
28. 做不到的检查写成 limitation；不说"全部完成"。
29. 先写数据再写渲染；镜头、姿态、连续性写在 JSON 里，不靠记忆。
30. 预览五关不跳：story → storyboard → look → animation → final。故事板阶段抓到的错成本是秒级，全片渲染后是半小时。

## E. 反模式（做了就掉出质量线）

- 只换调色板就叫"新画风"。
- 自由飞行相机、恒速环绕、无动机变焦。
- 用 AI 图像/视频生成补画面（本 skill 全部画面由代码生成）。
- 使用官方游戏素材（方块画风的纹理全部程序生成）。
- 信息靠角色"演"出来而不是 MG 讲出来，导致观众看不懂。
- 为了"更流畅"把木偶插值成 24fps 连续运动——定格感就没了。
```

### 46/55 · `stop-motion-3d/references/looks.md`
<!-- casebook-file {"path": "stop-motion-3d/references/looks.md", "lines": 141, "final_newline": true, "sha256": "9db3dcfb4d137981503348991c14d0b0e89f382083e776b9916c7fbde0b5d356", "original_sha256": "9db3dcfb4d137981503348991c14d0b0e89f382083e776b9916c7fbde0b5d356"} -->
````markdown
# Looks：画风 = 一整条渲染管线

## 目录
1. LookDef 契约
2. 共享基础设施（G-buffer、GLSL 公共库、特殊材质）
3. 七个内置配方
4. 选型决策表（问用户时怎么推荐）
5. 加一个新画风（步骤 + 检查）
6. 各画风专属失败检查
7. 调参速查

---

## 1. LookDef 契约（`src/looks/types.ts`）

```ts
interface LookDef {
  id: string; label: string; zh: string; blurb: string; tags: string;
  poseFps: number;          // 木偶节奏：12 = on twos，8 = on threes
  cameraOnTwos?: boolean;   // 手绘/剪纸类：相机也步进
  variant: "day" | "night"; // 这个画风用世界的哪个变体
  accent: string;           // 转场边缘、chip、UI 强调色
  uvUnit: number;           // 多少米一块纹理（世界空间 UV）
  material(sem: Sem): THREE.Material;             // 语义材质 → 真材质（必须缓存/复用）
  geometry?: { box?, cyl?, sphere? };             // 几何处理（方块化、圆角化）
  setup(scene, ctx): void;                        // 布光、背景、雾、隐藏尘埃
  update?(scene, ctx, time): void;                // 每帧（闪烁等）
  post(c: PostCtx): void;                         // 全屏 pass：读 G-buffer，写输出
}
```

一个画风必须能碰到"识别特征"所在的全部五层：几何 / 着色 / 光 / 屏幕空间 / 节奏（原因见 first-principles §4）。

## 2. 共享基础设施

- **GBuffer**（`runtime/post.ts`）：颜色 = MSAA4 HalfFloat 线性；法线 + 深度 = 另一张目标（`scene.userData.noOutline` 里的物体不画进去，比如玻璃、光柱、粒子）。
- **输出是 display-referred**：renderer 设 `LinearSRGBColorSpace + NoToneMapping`，ACES 和 sRGB 在 post 的 GLSL 里做（`aces()`、`toSRGB()`），这样所有画风在同一处控制色调映射。
- **GLSL_COMMON** 提供：`hash12 / vnoise / fbm`（确定性噪声）、`luma`、`aces`、`toSRGB/fromSRGB`、`linDepth`、`nrm`（解包法线）、`isSky`、`edgeDN(uv, r, dThr, nThr, jitter)`（深度+法线描边）、`edgeC`（颜色描边）、`vignette`。
- **fsPass(frag, uniforms)** 建全屏 pass；`bindCommon(pass, c)` 绑定 tColor/tNormal/tDepth/uRes/uTime/uStep。`uStep = floor(poseT*poseFps)` 用来让噪声"按张"变化（线条抖动）。
- **specialMaterial**（`looks/common.ts`）统一处理 screen/tv（实时缩略图纹理）、backdrop、glass、neon（夜间×2.4）、glow。每个画风先调它，返回 null 再走自己的材质。
- **standardLights(ctx, o)**：日/夜通用布光；夜景只开实景灯。
- **grade(hex, {sat, light, hue, mulS, mulL})**：HSL 调色；**toonRamp(levels)**：toon 渐变贴图。
- **TEX**（`looks/tex.ts`）：确定性画布纹理：planks、brick、plaster、fabric、pixel(family)、clayBump、paper。

## 3. 七个内置配方

### diorama 微缩沙盘（中性基准画风）
- 几何：RoundedBox 1.2cm 倒角，边缘抓光。
- 着色：MeshStandard + 程序纹理（木纹、砖、灰泥、织物），ROUGH/METAL 表。
- 光：sun 3.4 / hemi .85 / bounce .95 / 光柱 .09；不用 PMREM。
- 后期：8 采样深度 AO → ACES → 暗角 → 细颗粒。
- 用途：判断**世界本身**有没有问题（布景的 look-lock 用它），开场和结尾用它。

### block 方块世界（MC 式，原创贴图）
- 几何：圆柱和球全部变长方体（`geometry.cyl/sphere → BoxGeometry`）。
- 着色：Lambert + 16px 像素纹理（按材质族生成），`NearestFilter`，uvUnit .48 → 1 texel ≈ 3cm。
- 光：sun 3.0，硬一点的阴影。后期：ACES + 饱和度 + 暗角，**不描边**。
- 禁止使用任何官方游戏素材；纹理全部程序生成。

### clay 黏土定格
- 几何：圆角团块，半径 = min(.07, 最小边×.32)。
- 着色：Standard + 指纹 bump（clayBump），饱和度×1.05，背景暖米色 #e9dccb。
- 光：暖色 key（#ffe6c8），sun 2.4 / hemi 1.25。
- 后期：8 采样景深，`coc = clamp(|d−focus|/d × 4) × 3`，焦点 = 相机到 target 的距离（`cam.userData.focus`）+ 暖色 grade。
- 节奏 8fps（on threes）——黏土片的手感一半来自这里。

### vox 纸片拼贴（Vox Media 解释视频风格）
- 着色：MeshToon 2 阶 + EDITORIAL 编辑部配色表（奶油底、砖红、墨蓝、草绿），饱和×1.35。
- 光：平，背景 #f0e2c6，关闭尘埃。
- 后期（顺序重要）：
  1. 撕纸边抖动（fbm 偏移，**固定不随帧变**：剪纸不会"沸腾"）
  2. 明度 3 阶海报化（保留色相）
  3. 纸层投影：左上更近的纸在右下投 9px 影，×0.58
  4. 白色切边（上层纸露出纸芯）
  5. 45° 网点印在暗部
  6. 墨线 + 红版错位 1–2px
  7. 纤维纸纹理
- 节奏：木偶 8fps + 相机步进。

### sketch 手绘线稿
- 着色：Lambert 淡彩；光平。
- 后期：
  1. **线条沸腾（line boil）**：描边采样坐标用 `hash(floor(uStep*12))` 抖动——每换一张画，线就重新画一遍；
  2. `edgeDN` 半径 1.6/1.1 → 石墨线；
  3. 马克笔淡彩 0.2（故意没对齐线）；
  4. 稀疏排线：亮度 < .42 一层、< .2 两层，间距 10px；
  5. 奶油纸 + 石墨颗粒。
- 节奏：12fps + 相机步进。这是"每一帧都像线画出来的"的关键：连续运动的相机会让线稿看起来像贴图。

### comic 赛博漫画（夜景）
- 用世界的 **night 变体**：只有霓虹、台灯、显示器、吊灯发光；远景换夜城。
- 着色：Toon 3 阶，霓虹增益 3。
- 后期：两圈霓虹辉光 → 靛蓝调色 → 中间调品红/青网点 → 粗墨线（edgeDN r2 + edgeC）→ 暗角。

### watercolor 水彩晕染
- 着色：Lambert，饱和×1.15（后期会冲淡）。
- 后期：UV 漂移（颜料没完全落在线里）→ 7 采样晕染 → 色块交界积色（深边）→ 暗部颗粒 → 冷压纸纹 → 淡铅笔底稿 → 画面边缘露白。

## 4. 选型决策表

| 片子/情绪 | 首选 | 备选 | 理由 |
|---|---|---|---|
| 科技/产品宣传、可信、质感 | diorama | clay | 真实光影 = 可信 |
| 年轻、游戏、搭建感、教程 | block | vox | 方块 = "可以自己搭" |
| 温暖、治愈、儿童、手工 | clay | watercolor | 指纹和暖光 |
| 知识解释、数据、新闻 | vox | sketch | 平面 + 网点 = 编辑部 |
| 创意过程、构思、草图、回忆 | sketch | watercolor | 线条 = 尚未完成 |
| 夜晚、赛博、紧张、黑客 | comic | block(夜) | 霓虹 + 墨线 |
| 抒情、季节、节日（中秋）、诗意 | watercolor | clay | 晕染 = 情绪 |
| 展示"同一件事多种风格" | 混剪 + 结尾 bands | — | 本 skill 样片 |

## 5. 加一个新画风

1. 复制最接近的画风文件，改 `id/label/zh/blurb/tags/accent`。
2. 按五层逐层决定：几何要不要处理？着色模型？布光（改 standardLights 参数还是全新）？后期 pass 列表？poseFps / cameraOnTwos？
3. `material()` 必须按 `sem.key` 缓存；先调 `specialMaterial`。
4. 后期只读 G-buffer 和 uniform；所有随机用 `hash/vnoise(uv, uStep)`，不要用时间以外的状态。
5. 在 `looks/index.ts` 注册；`screens.ts` 里给它一个缩略图；sandbox 查看器自动出现按钮。
6. 验收：sandbox 里 7 个机位各看一眼；抽 3 帧（最暗、最亮、特写）；对比其他画风的同一帧拼成 contact sheet——**如果和某个现有画风只差颜色，就不算新画风**。
7. 性能：单帧超过现有最慢画风 1.5 倍时，先减采样数，再考虑半分辨率 pass。

## 6. 各画风专属失败检查

| 画风 | 典型失败 | 检查 |
|---|---|---|
| diorama | AO 发脏、画面灰 | 暗部仍有细节；AO 只在接触缝 |
| block | 纹理密度不一致；圆的东西没变方 | 近看墙和杯子像素一样大；无圆柱残留 |
| clay | 景深虚掉主体；团块太圆像塑料 | 焦点在角色脸/手；边缘仍有体积 |
| vox | 网点太密变灰；纸边每帧抖（沸腾） | 暗部是清晰圆点；连续两张纸边一致 |
| sketch | 线太密成一团黑；淡彩盖线 | 头发/键盘区域可读；线在彩上面 |
| comic | 夜景太黑看不清人；辉光糊掉字幕 | 脸至少一侧受光；MG 区域无大块辉光 |
| watercolor | 晕染吃掉轮廓；纸边露白挡字幕 | 角色剪影可读；字幕区不在边缘白里 |
| 全部 | 尘埃在 2D 画风里像脏点 | 2D 画风 setup 里 `dust.visible=false` |

## 7. 调参速查

- 画面太灰 → 先查是不是 ACES 前曝光不足（乘 1.1–1.3），再调饱和。
- 描边太粗 → `edgeDN` 的 r 减小或 dThr/nThr 提高。
- 网点太抢 → 只印在 `l < 0.45` 区域，点间距 ≥ 6px。
- 景深太强 → coc 系数从 3 降到 2；焦点跟 camera target 走。
- 夜景太黑 → 给角色附近的台灯 intensity 1.6→2.2，而不是加全局环境光（会破坏夜感）。
````

### 47/55 · `stop-motion-3d/references/render-qc.md`
<!-- casebook-file {"path": "stop-motion-3d/references/render-qc.md", "lines": 99, "final_newline": true, "sha256": "3190ab483cff44a09c5082e6b637ee8a384092d3dc8d044422f12d2b92a8dee6", "original_sha256": "3190ab483cff44a09c5082e6b637ee8a384092d3dc8d044422f12d2b92a8dee6"} -->
````markdown
# Render & QC：采集、封装、机器可证的检查

## 目录
1. 采集契约与 capture.mjs
2. 性能与预算
3. 预览关卡（渲染前置门）
4. 封装参数
5. finalize.py 的九项 QC
6. 交付清单
7. 诚实性

---

## 1. 采集契约

页面 `web/film.html` 加载 `dist/film.js`，暴露：
```ts
window.film = {
  ready: Promise<Meta>,              // 字体、世界副本、显示器缩略图都准备好
  frame(f, quality=0.93): Promise<string>,   // JPEG dataURL（3D 底片 + MG 图层）
  inspect(f): Promise<InspectRow>,   // 不出像素
  meta(): Promise<Meta>              // title, fps, width, height, total, shots[{id,start,look,...}], events[{shot,frame,set}]
}
```

`scripts/capture.mjs`（在工程里，依赖工程的 playwright-core）：
```bash
node scripts/capture.mjs --meta --out out/meta.json
node scripts/capture.mjs --frames 0,130,310 --out out/stills
node scripts/capture.mjs --range 0:1440[:step] --out out/frames [--force]
node scripts/capture.mjs --inspect 0:1440:1 --out out/qc/inspect.json
```
- 内置静态服务器（`--root web`，`PORT` 默认 8765）；Chrome 查找顺序：`$CHROME` → `$PLAYWRIGHT_BROWSERS_PATH/chromium-*/…` → playwright 默认。
- 启动参数 `--use-angle=swiftshader --enable-unsafe-swiftshader`：没有 GPU 也能跑；有 GPU 时去掉这两个参数会快很多。
- 一个浏览器、一个页面、串行出帧：小 CPU 机器上并行 headless WebGL 会互相抢。
- 已存在的帧跳过 → 断点续渲。后台运行：`nohup node scripts/capture.mjs --range 0:1440 --out out/frames > out/logs/render.log 2>&1 &`。

## 2. 性能与预算

实测（SwiftShader，2 核，1280×720）：平均 0.7–1.3 s/帧；clay（DOF）和 wipe 帧最慢；分屏结尾 2–4 s/帧。60s 片全片约 25–30 分钟。

优化顺序（每步先测，测法见 first-principles §9）：
1. 关掉的实景灯 `visible=false`；
2. 静态网格按材质合批（`bakeStatic`），动的东西标 `dynamic`；
3. 后期采样数（AO/DOF/晕染 8→6）；
4. 阴影贴图 2048→1024；
5. 最后才降分辨率。

## 3. 预览关卡（渲染前置门）

全片渲染之前必须完成并**真的看过**：
1. `validate.py --timeline` 无 ERROR；
2. 故事板：每镜 1–2 帧的 contact sheet（`contact_sheet.py`）；
3. 画风：每个用到的画风 3 帧；
4. 动作：最难的交互连续渲 3–5s 看节奏；
5. `inspect.json` 通过（穿插 0）。

## 4. 封装参数（finalize.py 内置）

```
ffmpeg -framerate 24 -i out/frames/f%05d.jpg -i out/audio/mix.wav
  -vf scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p
  -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0
  -r 24 -fps_mode cfr -g 48 -c:a aac -b:a 192k -ar 48000 -t <dur> -movflags +faststart final.mp4
```
- 浏览器导出的 JPEG 是 **full range**，必须转成 limited（tv）再写 BT.709 标签；只写标签不转换，播放器会把黑位抬灰。
- `h264_metadata` 把颜色信息写进码流本身（VUI），不只是容器。

## 5. finalize.py 的九项 QC

| 检查 | 通过条件 |
|---|---|
| preflight.frames | f00000…f(total−1) 全部存在且 > 1KB |
| preflight.audio | 音频时长 = 画面时长 ±0.05s |
| probe | h264 / yuv420p / 帧数 = total / fps 精确 / range=tv / bt709×3 / 有音轨 |
| faststart | moov 在 mdat 之前 |
| decode | `ffmpeg -xerror` 全解码无错 |
| freeze | freezedetect(n=0.002, d=0.4) 无结果（步进 hold 只有 2–3 帧，超过 0.4s 的冻结是 bug） |
| black | blackdetect 无结果 |
| loudness | MP4 内 AAC：−18 ≤ I ≤ −13 LUFS 且 TP ≤ −1.0 dBTP |
| acting | 穿插帧 0；surface 深度 > −1cm；exact 误差 < 3cm；stepping 段长一致 |

报告先以 `status: running` 落盘，每步更新；最后写 `qc-report.md` 和 `manifest.json`（sha256）。

## 6. 交付清单

- `out/final.mp4`
- `out/qc/qc-report.{json,md}`、`out/manifest.json`
- contact sheet（故事板 + 画风对比）
- `out/audio/mix.wav` + stems + `cues.json` + `loudness.json`
- 工程源码 zip（不含 node_modules、out/frames）

## 7. 诚实性

- 没有人耳试听、没有在真实播放器里 1× 播放过，就写进 limitation。
- QC 有 FAIL 就报告 FAIL 和原因，不说"已完成"。
- 不声称存在没生成的文件；交付前 `ls` 一遍。
````

### 48/55 · `stop-motion-3d/references/sound.md`
<!-- casebook-file {"path": "stop-motion-3d/references/sound.md", "lines": 97, "final_newline": true, "sha256": "6cd99f58df6729009f9fe43b613478e1ddb9c637d94314e35e7232e5704d114d", "original_sha256": "6cd99f58df6729009f9fe43b613478e1ddb9c637d94314e35e7232e5704d114d"} -->
````markdown
# Sound：从画面数据派生的声音

`scripts/audio.py`（numpy + scipy，零采样，确定性）。

```bash
python3 $S/scripts/audio.py --meta out/meta.json --inspect out/qc/inspect.json \
    --episode src/episode/episode.json --out out/audio [--sound sound.json] [--lufs -16]
```
产出：`mix.wav`（48k 浮点立体声）、`stems/{room,music,foley,fx}.wav`、`cues.json`（每个声音事件的时间和原因）、`loudness.json`。

## 目录
1. 分层与加入顺序
2. 音乐：每个画风一种乐器
3. Foley：姿态到位 + 事件
4. 转场 FX：声音领先画面
5. 静默是标点
6. 响度
7. 定制（sound.json）
8. 配音（VO）

---

## 1. 分层

```
room(环境) → foley(接触) → fx(转场/签名) → music → 有意的静默
```
- **room**：布朗噪声低通 + 空气嘶声；夜景画风（comic）换低频城市嗡声。永远不是数字零。
- 每个 stem 单独输出，后期可以只改一层。

## 2. 音乐

- 96 BPM → 一小节 2.5s；样片每个画风段 7.5s = 3 小节，**所有画风切换都落在小节线上**。设计新片时让段落长度是小节的整数倍（或者改 bpm 去适配）。
- 和弦 C–G–Am–F 一小节一个。
- 乐器族（`look_instrument`）：

| 画风 | 乐器族 | 织体 |
|---|---|---|
| diorama | musicbox | 八音盒琶音 + pad |
| block | chip | 25% 方波琶音 + 方波贝斯 + 8bit 鼓 |
| clay | marimba | 马林巴切分 + 木鱼 |
| vox | pizz | Karplus-Strong 拨弦 + 二四拍拍手 |
| sketch | piano | 稀疏钢琴 |
| comic | synth | 锯齿贝斯 + 16 分琶音 + 四拍底鼓 + 军鼓 |
| watercolor | bells | FM 钟琴 + pad |

- 结尾 bands：每揭开一条分屏，响一个该画风乐器的音（上行音阶）+ 该画风的签名音效。
- 音乐总线过一个卷积混响（1.8s），全片再过一个很短的共享房间混响，让 Foley 和音乐在同一个空间里。

## 3. Foley

**姿态到位**（从 inspect 的 sig 派生：`a>b` 变成 `b>b` 的那一帧）：

| 姿态 | 声音 |
|---|---|
| type_a / type_b | 键盘敲击（高频噪声 + 低频壳体，随机化） |
| hit_enter | 回车大键（更低、更重 + 170Hz 咚） |
| draw_a/b/c | 铅笔沙沙（带调幅的高频噪声） |
| tap | 触控笔点击 |
| fist_pump | 合成器短音 |
| cheer | "啵" |

焦点角色（本镜头有 acting 的）增益 1.0；全景里的其他人 0.22；特写镜头里画外的人 0.18——背景有生命但不抢。

**事件**（从 meta.events）：`hold.mug` → 瓷器轻碰/放下闷响；`hold.sheet` → 纸声；`hold.can` → 金属轻碰；`rin.pour` true→false 之间 = 水流床 + 气泡；`plant.watered` → 上行钟琴闪光。

## 4. 转场 FX

- wipe 的 whoosh：STFT 频带扫描噪声，**从镜头起点前 0.33s 开始**，峰值在 wipe 中点——声音领先画面 0.3–0.6s 是剪辑的通用规律，观众会感到画面"被声音拉过去"。
- 每个画风一个签名音（wipe 60% 处）：方块=金币、黏土=噗叽弹、Vox=剪刀+纸、线稿=铅笔一划、漫画=电子 zap、水彩=水滴。

## 5. 静默是标点

片尾标题前 0.8s → 0.3s 音乐全停，room 减半、Foley ×0.25，然后在标题出现前 0.3s 落终止和弦（pad + 钟 + 钢琴 + 底鼓）。静默必须设计在 cue 里，不是空档。

## 6. 响度

1. 混音 → ffmpeg loudnorm 测量 → 线性增益到目标（默认 −16 LUFS，60s 网络短片）→ 4× 过采样前瞻限幅器 −2.0 dBTP。
2. **AAC 编码会抬高真峰值**（实测可从 −1.5 抬到 0）：finalize 断言的是 MP4 里 AAC 的真峰值 ≤ −1.0 dBTP。
3. 安静开场的长片（180s）不要用动态 loudnorm，会把环境声抬得不成比例；用恒定增益。长片母带目标 ≈ −18 LUFS / −3.2 dBTP。

## 7. 定制（sound.json）

覆盖 `DEFAULTS` 的任意键：
```json
{ "bpm": 90, "progression": ["Am","F","C","G"],
  "look_instrument": {"clay": "piano"},
  "pose_foley": {"walk_a": "key", "walk_b": "key"},
  "event_foley": {"door.open": {"true": "paper"}},
  "night_looks": ["comic", "block"],
  "lead": 0.4, "silence": [-1.0, -0.3] }
```
新的 foley 类型在 `foley()` 里加一个分支（每种 5–15 行 DSP）。

## 8. 配音（VO）

需要旁白时：先生成 VO（任意 TTS），**实测时长写回镜头**（VO 时长 < 镜头时长 − 起点 − 0.2s，否则提速或加长镜头），VO 作为第五个 stem 混入；音乐在 VO 下 ducking −8dB；字幕由 VO 时间生成，相邻字幕 `end = min(end, 下一条 start)`。
````

### 49/55 · `stop-motion-3d/references/world.md`
<!-- casebook-file {"path": "stop-motion-3d/references/world.md", "lines": 176, "final_newline": true, "sha256": "2b60a1638ee28c116ac67d5737e95de0837b2fb39e0785f926e253df1a28459a", "original_sha256": "2b60a1638ee28c116ac67d5737e95de0837b2fb39e0785f926e253df1a28459a"} -->
````markdown
# World：持久的 3D 沙盒世界

## 目录
1. 世界由什么组成
2. world.json 字段
3. 道具契约（PropBuild）与锚点
4. 语义材质与 Prims
5. 布景：墙、窗、远景、wild walls
6. 灯光句柄契约（画风依赖它）
7. 可持有物与世界状态
8. 命名机位的摆法
9. WorldHooks：世界和 runtime 的胶水
10. 在 sandbox 查看器里检查世界
11. 新世界的步骤（例：工地、教室）
12. 系列复用的规则

---

## 1. 世界由什么组成

| 部件 | 在哪里 | 说明 |
|---|---|---|
| 调色板 | `src/world/palette.ts` | 语义色名 → 颜色（`wood`、`plaster`、`skin`…），画风会再调色 |
| 道具库 | `src/world/props.ts` | 可复用的道具生成函数，返回 group + 锚点 |
| 布景构建 | `src/world/studio.ts` | 房间、墙、窗、远景、灯、粒子；按 manifest 摆桌子、椅子、木偶 |
| 远景画布 | `src/world/backdrop.ts` | 画出来的城市天际线（日/夜），电视 logo |
| 清单 | `src/world/world.json` | 桌子/道具摆放、角色、标记点、机位、状态、变体 |
| 姿态库 | `src/world/poses.json` | 角色姿态（跟着世界走，因为锚点是世界的） |
| 胶水 | `src/world/hooks.ts` | 告诉 runtime 如何 build/update/beforeRender 这个世界 |

单位：米。地面 y=0，+y 向上，镜头默认从 +z 看向 −z（后墙在 z=−5）。

## 2. world.json 字段

```jsonc
{
  "id": "studio", "title": "Dev loft",
  "variants": ["day", "night"],                    // 画风选择 variant；也可在 shot 上覆盖
  "state": { "hold.mug": "home", "rin.pour": false, "plant.watered": false },
  "holdables": { "mug": {"desk": "desk2", "home": "mug_home"} },
  "desks": {
    "desk2": { "x": -3.3, "z": 0.4, "actor": "mia", "chair": "#b5652b",
      "items": [ {"type": "desk", "at": [0, 0]},
                 {"type": "keyboard", "at": [0, -0.23]},
                 {"type": "mug", "at": [0.42, -0.14], "params": {"color": "#e0663f", "holdable": true}},
                 {"type": "plant", "at": [-0.6, 0.05], "y": 0.75, "params": {"size": 0.9, "seed": 5}} ] } },
  "marks":   { "desk2.seat": {"pos": [-3.3, 0, -0.16], "yaw": 0} },
  "cameras": [ {"id": "CAM_MIA_FRONT", "role": "character", "fov": 38,
                "from": {"pos": [-1.15, 1.72, 1.55], "target": [-3.38, 1.12, -0.12]},
                "to":   {"pos": [-1.5, 1.62, 1.28],  "target": [-3.38, 1.12, -0.12]}, "ease": "inOut"} ],
  "actors":  { "mia": {"name": "米娅 Mia", "mark": "desk2.seat", "desk": "desk2", "seated": true, "ambient": "typing",
               "costume": {"skin": "#f0c29c", "hair": "#e3a33a", "top": "#f2e2c4", "bottom": "#5a4636",
                           "hairStyle": "bun", "glasses": false, "headphones": false}} }
}
```

要点：
- 桌面道具坐标 `at: [x, z]` 是**相对桌子**的，`y` 省略时为 0（道具自己知道放在桌面高度）；放在桌面上的"落地型"道具（植物）要写 `"y": 0.75`。
- `marks` 是角色站位。角色的 `seated: true` 会根据椅子座面高度自动求髋部高度。
- `state` 里每个键都必须**先声明初值**，episode 事件只能改已声明的键（validate.py 会查）。

## 3. 道具契约（PropBuild）与锚点

```ts
type Build = (P: Prims, params: Record<string, any>) => PropBuild;
interface PropBuild {
  root: THREE.Group;
  anchors: Record<string, THREE.Object3D>;   // IK 目标、可持有物的家
  holdables?: Record<string, THREE.Object3D>;// 可以被拿起的物件
  parts?: Record<string, THREE.Object3D>;    // 被状态驱动的部件（叶子、键帽、灯）
}
```

写道具的规则：
1. **只用 `P.box / P.cyl / P.sphere / P.plane`** 和语义材质字符串。不要 `new MeshStandardMaterial`——那样画风就管不到它。
2. 需要被手碰到的地方放**锚点**（`keyboard`、`enter`、`mug_home`、`mug_grip`、`stack`、`tablet`、`plant`、`spout`）。锚点名是姿态库的词汇表。
3. 需要做穿插检查的面加 `{collider: true}`（桌面、键盘、显示器、座面、平板）。
4. 会动的部件加 `{dynamic: true}`，否则会被 `bakeStatic` 合批后无法移动。
5. 道具内的随机只用 `rng(params.seed)`。

内置道具：desk, chair, monitor(screen N), keyboard(可按下的回车键), mouse, mug(可持有), lamp(点光), plant(浇水后挺立), cubeToy, paperStack(可持有的纸), tablet(+stylus), wateringCan(可持有, spout 锚点), neonSign, can, speaker, brushJar, stickyNotes。

## 4. 语义材质与 Prims

世界说"这是什么"，画风决定"长什么样"：

| 写法 | 含义 |
|---|---|
| `"wood"` | 调色板里的 wood 色 + 木头类材质 |
| `"cloth:#e0663f"` | 布料类，指定颜色 |
| `"screen:2"` | 第 2 块屏幕（显示 episode.screens["2"] 那个画风的实时缩略图） |
| `"neon:#ff3fa4"` | 自发光，夜间增强 |
| `"glow"`, `"backdrop"`, `"sky"`, `"tv"`, `"glass"` | 特殊材质，由 `looks/common.ts` 的 `specialMaterial` 统一处理 |

`makePrims(look, palette, registry)` 为每个画风生成一套 Prims：画风可以覆盖几何（方块化、圆角化），并按世界尺寸生成 UV（`uvUnit` 米一块纹理），所以一块 3m 的墙和一块 0.3m 的盒子纹理密度一致。

## 5. 布景：墙、窗、远景、wild walls

- **远景是画的**：`cityBackdrop(day|night)` 生成 2048×768 画布，挂在后窗外 z=−22 的平面上。永远不要建模"无限远"。
- **窗**：墙上开洞 + 竖梃 + 半透明玻璃。阳光从窗射入，配合"光柱"平面（beams，加法混合）和尘埃粒子。
- **wild walls**：电影棚里可拆的墙。相机在墙外（例如结尾拉远到 z=12）时，这面墙和天花板自动隐藏（`updateWildWalls` 按相机位置和墙的法线判断）。这样一个封闭的房间也能拍外部全景。
- 前墙挂 6 张风格海报和白板，左墙有电视和书架——角色特写的反打镜头里都有东西可看。

## 6. 灯光句柄契约（画风依赖它）

画风的 `setup()` 通过 `ctx.handles` 调光，所以**任何世界都必须提供同名句柄**：

```ts
sun: DirectionalLight          // 主光（投影 2048）
hemi: HemisphereLight          // 天空/地面环境光
bounce: DirectionalLight       // 反弹补光
beams: Object3D[]              // 光柱平面（ShaderMaterial，uniform uStrength）
practicals: { lamps, neon, pendants: PointLight[] }   // 实景灯：夜景开，白天 visible=false
dust: Points                   // 尘埃（2D 画风会隐藏）
```

`standardLights(ctx, {sun, hemi, bounce, beams, warm})` 是日/夜的通用布光；各画风在它之上微调。新世界如果没有台灯，就给空数组，不要删字段。

## 7. 可持有物与世界状态

- 可持有物在 `world.holdables` 登记：属于哪张桌子、家锚点是谁。
- 它挂在哪**只由状态决定**：`hold.mug = "home"` → 挂回家锚点；`"mia.R"` → 挂到 mia 右手的 socket。
- 手里的朝向由 `HOLD` 表的偏移/旋转决定（studio.ts）。socket 的四元数会抵消手臂旋转，所以杯子始终直立，纸始终朝向镜头，不会侧着变成一条线。
- 其他状态：`plant.watered`（叶子挺立的动画从事件时刻开始算）、`rin.pour`（水滴粒子）。回车键被按下不是状态，而是从指尖到键的距离 < 3.5cm 派生出来的——能派生的就不要存。

## 8. 命名机位的摆法

每个角色至少两台机：
- `CAM_<ACTOR>_FRONT`：斜前方 3/4 正面，fov 38，从 (x+2.15, 1.72, 1.55) 看 (x−0.08, 1.12, −0.12)，缓推到 (x+1.8, 1.62, 1.28)。看脸和手。
- `CAM_<ACTOR>_OTS`：右后方过肩，fov 40，从 (x+1.4, 1.78, −1.7) 看 (x+0.2, 1.0, 0.58)。看屏幕上的画风缩略图——**这是"这个角色在用这个画风"的证据镜头**。

另有 `CAM_EST`（开场全景，从右后上方）、`CAM_END`（结尾从前方拉远到墙外）、`CAM_THUMB`（role=`monitor-content`，只用来渲染显示器里的缩略图，不拍正片）。

规则：机位 = 世界的一部分，不在 episode 里临时造。要新角度就在 world.json 加一台并起名。`from`/`to` 相同就是固定机位。

## 9. WorldHooks：世界和 runtime 的胶水

```ts
interface WorldHooks<H> {
  build(P, variant, registry): H;                 // 每个画风调用一次，造一份世界副本
  update(h, state, shot, time): void;             // 每帧：按状态挂道具、驱动部件、粒子
  beforeRender(h, camera): void;                  // 每帧：wild walls、按相机的可见性
}
```

runtime 为每个用到的画风各 build 一份世界（材质不同），所以 update 必须是**纯状态驱动**，不能依赖上一帧。

## 10. 在 sandbox 查看器里检查世界

```bash
npm run build && python3 -m http.server -d web 8080   # 打开 http://localhost:8080/sandbox.html
```
- 鼠标环绕真实布景；切换 7 个画风；显示所有机位视锥和标记点；
- 切到 shot 模式按镜头看；拖动时间轴，右侧面板显示此刻世界状态；
- 和成片同一个 runtime，看到的就是会渲染的。

## 11. 新世界的步骤（例：工地安全宣传片、教室、厨房）

1. 复制 `src/world/` 为新目录或直接改：
   - `palette.ts` 加新语义色（`concrete`、`steel`、`hivis`、`soil`…）。
   - `props.ts` 加新道具（脚手架、安全帽、吊车钩、护栏…），遵守 §3 规则，放好锚点和 collider。
   - `studio.ts` 改房间：室外场景就不要墙，改地面 + 远景画布（`backdrop.ts` 画工地天际线）+ 太阳角度。
2. 保留 §6 的灯光句柄名（没有的给空）。
3. 写 world.json：摆放、角色、标记、每个角色两台机 + 开场/结尾机、状态初值。
4. 姿态：新动作（戴安全帽、扶栏杆、指向）加进 poses.json，`reach` 指向新锚点。
5. 在 sandbox 里环绕检查；`validate.py` 通过；每台机抽一帧看构图。
6. 7 个画风自动可用；只有需要夜景或特殊天气时才动画风参数。

角色不是必须坐着：`seated: false` 时站在 mark 上；行走需要在 acting 里给 mark 间的位移（扩展方法见 acting.md）。

## 12. 系列复用的规则

- 世界的**名字是 API**：机位 id、锚点名、状态键、道具 type 一旦被剧集引用就不改名；要改就加新的、旧的留着。
- 改了共享道具后做视觉回归：旧版本抽帧 → 改 → 同帧重渲 → `compare_frames.py before after --threshold 0.5`。
- 每条剧集的开头状态来自 `world.state`；续集要从上集结尾状态开始，就在新 episode 的第一个镜头 t=0 放事件设置状态。
- 人物外观（costume）是世界的一部分，剧集里不改；需要换装就定义新 actor 或加状态驱动的配件。
````

### 50/55 · `stop-motion-3d/scripts/audio.py`
<!-- casebook-file {"path": "stop-motion-3d/scripts/audio.py", "lines": 693, "final_newline": true, "sha256": "b5904502f165f8ca032692341f237b0ab5d9ac0ebd04bf4191e91a49406323ed", "original_sha256": "b5904502f165f8ca032692341f237b0ab5d9ac0ebd04bf4191e91a49406323ed"} -->
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

### 51/55 · `stop-motion-3d/scripts/compare_frames.py`
<!-- casebook-file {"path": "stop-motion-3d/scripts/compare_frames.py", "lines": 62, "final_newline": true, "sha256": "675d9cc3840a03943af5e61ba685d645f11b2aa231373f79603942e30ca3d0ff", "original_sha256": "675d9cc3840a03943af5e61ba685d645f11b2aa231373f79603942e30ca3d0ff"} -->
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

### 52/55 · `stop-motion-3d/scripts/contact_sheet.py`
<!-- casebook-file {"path": "stop-motion-3d/scripts/contact_sheet.py", "lines": 74, "final_newline": true, "sha256": "c7378739f09122bbb522daea34f480da2af5e65155b6780b8bca5583e8f1e292", "original_sha256": "c7378739f09122bbb522daea34f480da2af5e65155b6780b8bca5583e8f1e292"} -->
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

### 53/55 · `stop-motion-3d/scripts/finalize.py`
<!-- casebook-file {"path": "stop-motion-3d/scripts/finalize.py", "lines": 201, "final_newline": true, "sha256": "f909c147a624a96cd046d57b289f7495aa5d85b68e9fdfb47bad4f258fbe3acf", "original_sha256": "f909c147a624a96cd046d57b289f7495aa5d85b68e9fdfb47bad4f258fbe3acf"} -->
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

### 54/55 · `stop-motion-3d/scripts/init_project.py`
<!-- casebook-file {"path": "stop-motion-3d/scripts/init_project.py", "lines": 56, "final_newline": true, "sha256": "62d9817bf4460e1af5ba93ca0a9367d0f109449770fcbd53008b36c18c9efd09", "original_sha256": "62d9817bf4460e1af5ba93ca0a9367d0f109449770fcbd53008b36c18c9efd09"} -->
```python
#!/usr/bin/env python3
"""
Create a stop-motion-3d project from the bundled template (runtime + 7 looks + studio world +
sample episode + capture harness + sandbox viewer).

  python3 init_project.py <dir> [--title "My Film"] [--episode promo|story] [--install] [--no-build]

  --episode promo   the 60 s six-look skill promo (default; montage template)
  --episode story   a 30 s single-look short (comic, night) reusing the same world
  --install         npm install (needs network once) and build web/dist/*
Afterwards:  cd <dir> && python3 <skill>/scripts/validate.py . --timeline
"""
import argparse, json, re, shutil, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TPL = HERE.parent / "assets" / "template"
EXAMPLES = HERE.parent / "assets" / "examples"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir")
    ap.add_argument("--title", default=None)
    ap.add_argument("--episode", choices=["promo", "story"], default="promo")
    ap.add_argument("--install", action="store_true")
    ap.add_argument("--no-build", action="store_true")
    a = ap.parse_args()
    dst = Path(a.dir).resolve()
    if dst.exists() and any(dst.iterdir()):
        sys.exit(f"{dst} exists and is not empty")
    shutil.copytree(TPL, dst, ignore=shutil.ignore_patterns("node_modules", "out", "dist"), dirs_exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", (a.title or dst.name).lower()).strip("-") or "stopmo-film"
    pkg = json.loads((dst / "package.json").read_text())
    pkg["name"] = slug
    (dst / "package.json").write_text(json.dumps(pkg, indent=2) + "\n")
    ep_path = dst / "src/episode/episode.json"
    if a.episode == "story":
        shutil.copy(EXAMPLES / "story-episode.json", ep_path)
    if a.title:
        ep = json.loads(ep_path.read_text())
        ep["title"] = a.title
        ep_path.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + "\n")
    for d in ("out/frames", "out/qc", "out/audio", "out/logs"):
        (dst / d).mkdir(parents=True, exist_ok=True)
    print(f"created {dst}  (episode template: {a.episode})")
    if a.install:
        subprocess.run(["npm", "install", "--no-audit", "--no-fund"], cwd=dst, check=True)
        if not a.no_build:
            subprocess.run(["npm", "run", "-s", "build"], cwd=dst, check=True)
            print("built web/dist/film.js + sandbox.js")
    print("next: validate.py . --timeline → capture.mjs --meta → stills → full render → audio.py → finalize.py")


if __name__ == "__main__":
    main()
```

### 55/55 · `stop-motion-3d/scripts/validate.py`
<!-- casebook-file {"path": "stop-motion-3d/scripts/validate.py", "lines": 287, "final_newline": true, "sha256": "ba2b131bd5e2440908ac288f676c2b30b82305302a9425f07bbb5867252cf32f", "original_sha256": "ba2b131bd5e2440908ac288f676c2b30b82305302a9425f07bbb5867252cf32f"} -->
```python
#!/usr/bin/env python3
"""
Validate a stop-motion-3d project's DATA before spending minutes per second of footage on renders.

  python3 validate.py <project_root> [--episode src/episode/episode.json] [--timeline]

Reads  src/world/world.json, src/world/poses.json, src/episode/*.json
Scans  src/looks/index.ts (look ids), src/world/props.ts (prop types + anchor names),
       src/runtime/acting.ts (loop names), src/runtime/mg.ts (MG kinds)  — best-effort regex, so a
       project that renames things still validates what it can.
Checks references (cameras, marks, actors, desks, poses, anchors, looks, loops, MG kinds), timing
(acting keys and events inside the shot, wipe length, bands fit), continuity (a holdable is never in
two hands, never taken from someone who still holds it), and a few directing rules as WARNINGs.
--timeline prints the film as text: every shot, its beat, camera, look, acting and events.
Exit 1 on any ERROR. WARNINGs are judgment calls — read them.
"""
import argparse, json, re, sys
from pathlib import Path

ERR, WARN = [], []
err = ERR.append
warn = WARN.append


def scan(path, pattern, flags=0):
    try:
        return set(re.findall(pattern, Path(path).read_text(), flags))
    except FileNotFoundError:
        return set()


def block(path, start_pat):
    """Text of the first {...} block after start_pat (brace matched)."""
    try:
        s = Path(path).read_text()
    except FileNotFoundError:
        return ""
    m = re.search(start_pat, s)
    if not m:
        return ""
    i = s.index("{", m.end() - 1)
    d = 0
    for j in range(i, len(s)):
        d += s[j] == "{"
        d -= s[j] == "}"
        if d == 0:
            return s[i: j + 1]
    return ""


def _strip(txt):
    """drop comments and string/template literal contents so braces inside them don't count."""
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.S)
    txt = re.sub(r"//[^\n]*", "", txt)
    return re.sub(r"`[^`]*`|'[^'\n]*'|\"[^\"\n]*\"", '""', txt)


def top_keys(txt):
    """keys at depth 1 of a JS object literal (properties, methods and shorthand)."""
    txt = _strip(txt)
    keys, d, i = set(), 0, 0
    while i < len(txt):
        c = txt[i]
        if c in "{[(":
            d += 1
        elif c in "}])":
            d -= 1
        elif d == 1 and (c.isalpha() or c == "_") and re.match(r"[\s{,]", txt[i - 1]):
            m = re.match(r"([A-Za-z_]\w*)\s*(?=[:(,}\n])", txt[i:])
            if m:
                keys.add(m.group(1))
            j = re.match(r"\w*", txt[i:]).end()
            i += max(j, 1)
            continue
        i += 1
    return keys


def vec3(v):
    return isinstance(v, list) and len(v) == 3 and all(isinstance(x, (int, float)) for x in v)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--episode", default=None)
    ap.add_argument("--timeline", action="store_true")
    a = ap.parse_args()
    R = Path(a.root)
    world = json.loads((R / "src/world/world.json").read_text())
    poses = json.loads((R / "src/world/poses.json").read_text())
    eps = [Path(a.episode)] if a.episode else sorted((R / "src/episode").glob("*.json"))

    looks = top_keys(block(R / "src/looks/index.ts", r"LOOKS[^=]*=\s*\{")) or set()
    props = top_keys(block(R / "src/world/props.ts", r"PROPS[^=]*=\s*\{"))
    anchors = set()
    for body in re.findall(r"anchors:\s*\{([^}]*)\}", (R / "src/world/props.ts").read_text() if (R / "src/world/props.ts").exists() else ""):
        anchors |= set(re.findall(r"([A-Za-z_]\w*)\s*:", body))
    loops = top_keys(block(R / "src/runtime/acting.ts", r"LOOPS[^=]*=\s*\{"))
    mgk = top_keys(block(R / "src/runtime/mg.ts", r"MG[^=]*=\s*\{"))

    # ---------------- world
    cams = {}
    for c in world.get("cameras", []):
        if c["id"] in cams:
            err(f"world: duplicate camera {c['id']}")
        cams[c["id"]] = c
        for k in ("from",) + (("to",) if "to" in c else ()):
            if not (vec3(c[k].get("pos")) and vec3(c[k].get("target"))):
                err(f"camera {c['id']}.{k}: pos/target must be [x,y,z]")
        if not 10 <= c.get("fov", 0) <= 90:
            err(f"camera {c['id']}: fov {c.get('fov')} outside 10..90")
    marks = world.get("marks", {})
    actors = world.get("actors", {})
    desks = world.get("desks", {})
    for n, ac in actors.items():
        if ac.get("mark") not in marks:
            err(f"actor {n}: mark {ac.get('mark')} not in world.marks")
        if ac.get("desk") and ac["desk"] not in desks:
            err(f"actor {n}: desk {ac['desk']} missing")
    for dn, d in desks.items():
        if d.get("actor") and d["actor"] not in actors:
            err(f"desk {dn}: actor {d['actor']} missing")
        for it in d.get("items", []):
            if props and it["type"] not in props:
                err(f"desk {dn}: unknown prop type '{it['type']}' (PROPS has {sorted(props)})")
            if abs(it["at"][0]) > 0.8 or abs(it["at"][1]) > 0.45:
                warn(f"desk {dn}: {it['type']} at {it['at']} hangs off a 1.6x0.9 desk")
    for h, hd in world.get("holdables", {}).items():
        if hd["desk"] not in desks:
            err(f"holdable {h}: desk {hd['desk']} missing")
        if anchors and hd.get("home") not in anchors:
            err(f"holdable {h}: home anchor '{hd.get('home')}' not defined by any prop")
        if f"hold.{h}" not in world.get("state", {}):
            err(f"holdable {h}: world.state lacks initial 'hold.{h}'")
    state0 = dict(world.get("state", {}))

    # ---------------- poses
    for pn, p in poses.items():
        if p.get("base") and p["base"] not in poses:
            err(f"pose {pn}: base '{p['base']}' missing")
        for part in ("torso", "head", "armL", "armR", "legL", "legR"):
            if part in p and not vec3(p[part]):
                err(f"pose {pn}.{part}: must be [x,y,z] degrees")
        for hand in ("handL", "handR"):
            r = p.get(hand)
            if r and anchors and r.get("reach") not in anchors | {"mouth"}:
                err(f"pose {pn}.{hand}: reach '{r.get('reach')}' is not an anchor ({len(anchors)} known)")

    # ---------------- episodes
    for ep_path in eps:
        ep = json.loads(ep_path.read_text())
        tag = ep_path.name
        fps = ep.get("fps", 24)
        if ep.get("world") and ep["world"] != world.get("id"):
            err(f"{tag}: world '{ep['world']}' != world.json id '{world.get('id')}'")
        for k, v in (ep.get("screens") or {}).items():
            if looks and v not in looks:
                err(f"{tag}: screens[{k}] = unknown look '{v}'")
        state = dict(state0)
        ids, t_total, prev_look = set(), 0.0, None
        rows = []
        for s in ep["shots"]:
            sid = s["id"]
            w = f"{tag}:{sid}"
            if sid in ids:
                err(f"{w}: duplicate id")
            ids.add(sid)
            d = s["duration"]
            if d <= 0:
                err(f"{w}: duration must be > 0")
            if d < 1.0:
                warn(f"{w}: {d}s shot — under 1s reads as a flash unless it's a deliberate smash")
            if s["camera"] not in cams:
                err(f"{w}: camera '{s['camera']}' not in world.cameras")
            elif cams[s["camera"]].get("role") == "monitor-content":
                warn(f"{w}: shooting through CAM with role monitor-content (reserved for screen thumbnails)")
            if looks and s["look"] not in looks:
                err(f"{w}: look '{s['look']}' unknown (have {sorted(looks)})")
            if s.get("variant") and s["variant"] not in world.get("variants", []):
                err(f"{w}: variant '{s['variant']}' not in world.variants")
            tr = s.get("transition")
            if tr:
                if tr.get("type") not in ("cut", "wipe"):
                    err(f"{w}: transition type '{tr.get('type')}'")
                if tr.get("type") == "wipe":
                    fr = tr.get("frames", 14)
                    if fr / fps > d * 0.5:
                        err(f"{w}: wipe of {fr} frames is > half the shot")
                    if looks and tr.get("from") not in looks:
                        err(f"{w}: wipe.from '{tr.get('from')}' unknown")
                    if prev_look and tr.get("from") != prev_look:
                        warn(f"{w}: wipe.from '{tr.get('from')}' but previous shot's look is '{prev_look}'")
            # acting
            keys_by = {}
            for k in s.get("acting", []):
                if k.get("actor") not in actors:
                    err(f"{w}: acting actor '{k.get('actor')}' missing")
                    continue
                if "loop" in k:
                    if loops and k["loop"] not in loops:
                        err(f"{w}: loop '{k['loop']}' unknown (have {sorted(loops)})")
                    if not 0 <= k.get("from", 0) < k.get("to", d) <= d + 1e-6:
                        err(f"{w}: loop {k['loop']} window {k.get('from')}..{k.get('to')} outside shot")
                    continue
                if k.get("pose") not in poses:
                    err(f"{w}: pose '{k.get('pose')}' missing from poses.json")
                if not 0 <= k.get("at", -1) <= d + 1e-6:
                    err(f"{w}: key at {k.get('at')} outside 0..{d}")
                keys_by.setdefault(k["actor"], []).append(k["at"])
            for actor, ts in keys_by.items():
                if ts != sorted(ts):
                    err(f"{w}: {actor}'s keys are not in time order")
                gaps = [b - a_ for a_, b in zip(ts, ts[1:])]
                if gaps and min(gaps) < 2 / fps:
                    warn(f"{w}: {actor} has keys {min(gaps):.3f}s apart — less than one hold on twos")
            # events + continuity
            for ev in sorted(s.get("events", []), key=lambda e: e["t"]):
                if not 0 <= ev["t"] <= d:
                    err(f"{w}: event at {ev['t']} outside shot")
                for k, v in ev["set"].items():
                    if k not in state0:
                        err(f"{w}: event sets undeclared state '{k}' (declare it in world.state)")
                        continue
                    if k.startswith("hold."):
                        if v != "home" and not re.match(r"^\w+\.(L|R)$", str(v)):
                            err(f"{w}: {k} = '{v}' — must be 'home' or '<actor>.L|R'")
                        elif v != "home" and v.split(".")[0] not in actors:
                            err(f"{w}: {k} -> unknown actor '{v.split('.')[0]}'")
                        cur = state.get(k)
                        if v != "home" and cur not in ("home", v):
                            err(f"{w}: {k} taken by {v} while still held by {cur} (put it home first)")
                        held = [kk for kk, vv in state.items() if kk.startswith("hold.") and vv == v and kk != k]
                        if v != "home" and held:
                            err(f"{w}: {v} already holds {held[0]} — one prop per hand")
                    state[k] = v
            # mg
            for m in s.get("mg", []):
                if mgk and m["kind"] not in mgk:
                    err(f"{w}: MG kind '{m['kind']}' unknown (have {sorted(mgk)})")
                if not 0 <= m["from"] < m["to"] <= d + 1e-6:
                    err(f"{w}: MG {m['kind']} {m['from']}..{m['to']} outside shot")
                if m["kind"] == "lower" and len(m.get("text", "")) > 14:
                    warn(f"{w}: lower-third title '{m['text']}' is long — check it fits")
                if m["kind"] in ("lower", "note", "title") and m["to"] - m["from"] < 1.2:
                    warn(f"{w}: MG '{m.get('text','')}' is on screen < 1.2s — too short to read")
            b = s.get("bands")
            if b:
                if looks and any(l not in looks for l in b["looks"]):
                    err(f"{w}: bands has unknown looks")
                if len(b["looks"]) > 6:
                    err(f"{w}: > 6 bands (each band is one more full render per frame)")
                if b["start"] + b["stagger"] * (len(b["looks"]) - 1) > d - 0.5:
                    err(f"{w}: bands finish after the shot ends")
            rows.append((t_total, s))
            t_total += d
            prev_look = s["look"]
        if a.timeline:
            print(f"\n== {tag}: {ep.get('title')}  {t_total:.2f}s  {round(t_total * fps)} frames @ {fps}fps")
            for t0, s in rows:
                acts = ", ".join(sorted({k.get('pose') or k.get('loop') for k in s.get('acting', [])}))
                evs = "; ".join(f"{e['t']}s {e['set']}" for e in s.get("events", []))
                print(f"{t0:6.2f}s {s['id']:<4} {s.get('beat',''):<10} {s['duration']:>4}s {s['camera']:<16} {s['look']:<11}"
                      f"{('['+s['transition']['type']+']') if s.get('transition') else '':<7} {acts}")
                if s.get("story_function"):
                    print(f"        · {s['story_function']}")
                if evs:
                    print(f"        ! {evs}")
        looks_used = [s["look"] for _, s in rows]
        if len(set(looks_used)) > 1:
            runs = [looks_used[0]]
            for l in looks_used[1:]:
                if l != runs[-1]:
                    runs.append(l)
            if len(runs) != len(set(runs)) and not any(s.get("bands") for _, s in rows):
                warn(f"{tag}: a look returns after another — fine for a montage, confusing for a story")

    for m in ERR:
        print("ERROR  ", m)
    for m in WARN:
        print("warning", m)
    print(f"\n{len(ERR)} error(s), {len(WARN)} warning(s)  | looks={len(looks)} props={len(props)} anchors={len(anchors)} loops={len(loops)} mg={len(mgk)}")
    sys.exit(1 if ERR else 0)


if __name__ == "__main__":
    main()
```

