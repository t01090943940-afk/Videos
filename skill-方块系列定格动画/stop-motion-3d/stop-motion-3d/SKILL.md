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
