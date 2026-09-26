# stopmotion · 源码文件索引（自动生成）

> stop-motion-3d Skill（方块系列定格动画，7 种画风）。原目录 `skill-方块系列定格动画/`。
> 源码已原样解压在 **`assets/cases/stopmotion/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show stopmotion <路径>`；拷出来改：`python3 scripts/casebook.py copy stopmotion <目标目录>`。

来源档案：

- `skill-方块系列定格动画/stop-motion-3d.skill` · zip · 964.4 KB · sha256 `ae74f60f09407710…`

收录：文本 55 个（341.5 KB）· 二进制 8 个（834.9 KB，字体/小图）· 未收录 0 个（0.0 KB）

目录：文本文件 · 随附二进制（原样）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `stop-motion-3d/LICENSE.txt` | 18 | 1.1 KB |  |
| `stop-motion-3d/SKILL.md` | 178 | 14.7 KB | stop-motion-3d · 代码定格动画工作室 |
| `stop-motion-3d/assets/examples/story-episode.json` | 287 | 4.9 KB |  |
| `stop-motion-3d/assets/template/package-lock.json` | 954 | 29.3 KB |  |
| `stop-motion-3d/assets/template/package.json` | 18 | 0.5 KB | npm scripts: build, typecheck |
| `stop-motion-3d/assets/template/scripts/capture.mjs` | 103 | 5.0 KB | Deterministic frame capture for a window.film page (see the skill's references/runtime.md). |
| `stop-motion-3d/assets/template/src/entry/film.ts` | 59 | 1.9 KB | Capture page. Exposes the render contract on window.film |
| `stop-motion-3d/assets/template/src/entry/sandbox.ts` | 132 | 6.1 KB | SANDBOX VIEWER — the world on its own, before and outside any film |
| `stop-motion-3d/assets/template/src/episode/episode.json` | 914 | 16.0 KB |  |
| `stop-motion-3d/assets/template/src/looks/block.ts` | 60 | 2.2 KB | BLOCK — block-world grammar: every primitive becomes a cuboid (cylinders and spheres turn |
| `stop-motion-3d/assets/template/src/looks/clay.ts` | 75 | 3.0 KB | CLAY — plasticine stop-motion: every box is a soft rounded lump, surfaces carry fingerprint |
| `stop-motion-3d/assets/template/src/looks/comic.ts` | 72 | 3.0 KB | COMIC — cyberpunk comic panel: the SAME studio at night (night variant = practical neon, desk |
| `stop-motion-3d/assets/template/src/looks/common.ts` | 78 | 3.6 KB | Materials every look shares the logic of: screens, glass, backdrop, neon, lamp glow. |
| `stop-motion-3d/assets/template/src/looks/diorama.ts` | 73 | 2.9 KB | DIORAMA — the sandbox "as built": a physically lit miniature set. Bevelled edges catch light, |
| `stop-motion-3d/assets/template/src/looks/index.ts` | 11 | 0.5 KB | Look registry. A shot picks one with "look": "<id>". Each look is a full rendering pipeline. |
| `stop-motion-3d/assets/template/src/looks/prims.ts` | 77 | 3.0 KB | World-level registry filled while building one look's copy of the world. |
| `stop-motion-3d/assets/template/src/looks/screens.ts` | 17 | 0.5 KB | Screen content registry. "screen:N" / "tv:N" materials sample SCREENS[N]. |
| `stop-motion-3d/assets/template/src/looks/sketch.ts` | 67 | 3.2 KB | SKETCH — hand-drawn line art: graphite contours on cream paper, loose hatching for shadow, |
| `stop-motion-3d/assets/template/src/looks/tex.ts` | 130 | 4.8 KB | Procedural texture helpers (browser canvas). All deterministic. Detail maps are gray around |
| `stop-motion-3d/assets/template/src/looks/types.ts` | 82 | 2.9 KB | Semantic material: world code says WHAT a surface is ("wood", "cloth:#e0663f", "screen:2"), |
| `stop-motion-3d/assets/template/src/looks/vox.ts` | 86 | 4.0 KB | VOX — the paper-collage explainer look (Vox-style): every surface is a flat cut of colored |
| `stop-motion-3d/assets/template/src/looks/watercolor.ts` | 72 | 3.3 KB | WATERCOLOR — transparent washes on cold-press paper: pale pigments, color that wanders a few |
| `stop-motion-3d/assets/template/src/runtime/acting.ts` | 58 | 2.7 KB | Performance = named key poses on the stepped clock. |
| `stop-motion-3d/assets/template/src/runtime/camera.ts` | 26 | 1.1 KB | Sample a named rig at progress u (0..1). Cameras live on the CONTINUOUS clock. |
| `stop-motion-3d/assets/template/src/runtime/clock.ts` | 63 | 2.4 KB | THE stop-motion rule, in integer frames (never float division) |
| `stop-motion-3d/assets/template/src/runtime/film.ts` | 340 | 16.1 KB | FILM RUNTIME — the thin contract between a sandbox world, looks, and an episode. |
| `stop-motion-3d/assets/template/src/runtime/mg.ts` | 173 | 5.4 KB | MG (motion-graphics) layer: flat 2D information drawn over the 3D plate — titles, chips, |
| `stop-motion-3d/assets/template/src/runtime/post.ts` | 155 | 6.8 KB | Shared G-buffer for screen-space looks |
| `stop-motion-3d/assets/template/src/runtime/rig.ts` | 331 | 13.6 KB | 1 px = 5.5 cm. The puppet is 32 px (1.76 m) tall, built from rigid parts on pivots. |
| `stop-motion-3d/assets/template/src/runtime/rng.ts` | 30 | 1.0 KB | Seeded RNG — every "random" choice must be reproducible frame to frame and render to render. |
| `stop-motion-3d/assets/template/src/runtime/types.ts` | 158 | 4.8 KB | A named, pre-rigged camera. `to` makes it a move; omit for a locked-off shot. |
| `stop-motion-3d/assets/template/src/world/backdrop.ts` | 89 | 3.3 KB | Painted backdrop seen through the windows: sky gradient + two rows of city silhouettes with |
| `stop-motion-3d/assets/template/src/world/hooks.ts` | 14 | 0.7 KB | Glue between the generic film runtime and THIS sandbox. |
| `stop-motion-3d/assets/template/src/world/palette.ts` | 39 | 0.9 KB | World palette: the "truth" color of every semantic material in THIS world. |
| `stop-motion-3d/assets/template/src/world/poses.json` | 784 | 7.2 KB |  |
| `stop-motion-3d/assets/template/src/world/props.ts` | 251 | 11.9 KB | PROP LIBRARY — reusable set pieces. Each builder returns a group plus named ANCHORS |
| `stop-motion-3d/assets/template/src/world/studio.ts` | 381 | 18.4 KB | THE SANDBOX. A bounded loft studio built once per look from semantic primitives. |
| `stop-motion-3d/assets/template/src/world/world.json` | 982 | 11.6 KB |  |
| `stop-motion-3d/assets/template/tsconfig.json` | 8 | 0.3 KB |  |
| `stop-motion-3d/assets/template/web/film.html` | 8 | 0.4 KB | film |
| `stop-motion-3d/assets/template/web/sandbox.html` | 31 | 2.8 KB | Sandbox · studio |
| `stop-motion-3d/references/acting.md` | 111 | 5.9 KB | Acting：木偶、姿态、IK、连续性 |
| `stop-motion-3d/references/directing.md` | 139 | 6.9 KB | Directing：剧集、节拍、机位、转场、MG |
| `stop-motion-3d/references/first-principles.md` | 158 | 8.8 KB | 第一性原理：为什么是这套结构 |
| `stop-motion-3d/references/lessons.md` | 54 | 4.0 KB | Lessons：踩过的坑与修法 |
| `stop-motion-3d/references/looks.md` | 141 | 8.7 KB | Looks：画风 = 一整条渲染管线 |
| `stop-motion-3d/references/render-qc.md` | 99 | 4.5 KB | Render & QC：采集、封装、机器可证的检查 |
| `stop-motion-3d/references/sound.md` | 97 | 4.4 KB | Sound：从画面数据派生的声音 |
| `stop-motion-3d/references/world.md` | 176 | 10.5 KB | World：持久的 3D 沙盒世界 |
| `stop-motion-3d/scripts/audio.py` | 693 | 28.0 KB | Procedural soundtrack for a stop-motion-3d episode — deterministic, no samples, numpy only. |
| `stop-motion-3d/scripts/compare_frames.py` | 62 | 2.6 KB | Visual regression for sets: diff two keyframe folders rendered from the same frames. |
| `stop-motion-3d/scripts/contact_sheet.py` | 74 | 3.0 KB | Tile rendered keyframes into one labeled contact sheet for visual QC. |
| `stop-motion-3d/scripts/finalize.py` | 201 | 10.5 KB | Assemble + QC a stop-motion-3d render into a deliverable MP4. Never claims what it did not verify. |
| `stop-motion-3d/scripts/init_project.py` | 56 | 2.5 KB | Create a stop-motion-3d project from the bundled template (runtime + 7 looks + studio world + |
| `stop-motion-3d/scripts/validate.py` | 287 | 13.4 KB | Validate a stop-motion-3d project's DATA before spending minutes per second of footage on renders. |

## 随附二进制（原样）

| 路径 | 类型 | 大小 |
|---|---|---:|
| `stop-motion-3d/assets/style-previews/block.jpg` | image | 47.0 KB |
| `stop-motion-3d/assets/style-previews/clay.jpg` | image | 33.4 KB |
| `stop-motion-3d/assets/style-previews/comic.jpg` | image | 52.3 KB |
| `stop-motion-3d/assets/style-previews/diorama.jpg` | image | 51.0 KB |
| `stop-motion-3d/assets/style-previews/gallery.jpg` | image | 454.0 KB |
| `stop-motion-3d/assets/style-previews/sketch.jpg` | image | 74.1 KB |
| `stop-motion-3d/assets/style-previews/vox.jpg` | image | 83.3 KB |
| `stop-motion-3d/assets/style-previews/watercolor.jpg` | image | 39.7 KB |
