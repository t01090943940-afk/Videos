# dingge · 源码文件索引（自动生成）

> 定格（工地安全 Three.js 定格动画）。原目录 `opus-factory-safety-videos/`。
> 源码已原样解压在 **`assets/cases/dingge/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show dingge <路径>`；拷出来改：`python3 scripts/casebook.py copy dingge <目标目录>`。

来源档案：

- `opus-factory-safety-videos/dingge-source.tgz` · tgz · 97.2 KB · sha256 `78d5b4dc69c0fcda…`

收录：文本 33 个（313.1 KB）· 二进制 0 个（0.0 KB，字体/小图）· 未收录 0 个（0.0 KB）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `dingge-source/README.md` | 31 | 2.0 KB | 定格 · 工地沙盒 + 定格动画短片（TypeScript / Three.js） |
| `dingge-source/docs/DIRECTOR.md` | 183 | 16.2 KB | 《定格》导演稿 · 工地安全警示横屏短片 |
| `dingge-source/index.html` | 18 | 0.7 KB | 定格 · 工地沙盒 |
| `dingge-source/package-lock.json` | 1908 | 58.7 KB |  |
| `dingge-source/package.json` | 29 | 0.6 KB | npm scripts: dev, build, build:single, typecheck, render, check |
| `dingge-source/scripts/profile.mjs` | 21 | 1.3 KB |  |
| `dingge-source/scripts/render.mjs` | 90 | 5.2 KB | Offline renderer: deterministic frame-by-frame capture through headless Chromium, then ffmpeg. |
| `dingge-source/scripts/shot.mjs` | 20 | 1.1 KB | Look-dev screenshots: node scripts/shot.mjs "<query>" out.png [more pairs...] |
| `dingge-source/src/app/main.ts` | 156 | 7.9 KB | already stopped |
| `dingge-source/src/app/ui.ts` | 125 | 10.2 KB | Sandbox UI: floating right-side dock (mode, shots, viewpoints, settings), bottom shot-segmented scrubber, |
| `dingge-source/src/audio/score.ts` | 87 | 5.5 KB | Soundtrack = ambience bed (automated per shot) + SFX cues (from the shot list) + two music themes. |
| `dingge-source/src/audio/sfx.ts` | 114 | 10.3 KB | struck steel tube: inharmonic partials with separate decays |
| `dingge-source/src/characters/actor.ts` | 159 | 8.2 KB | Evaluate the performance at take time t. boil = stop-motion hand-posing jitter amplitude (deg), frame = seed. |
| `dingge-source/src/characters/poses.ts` | 103 | 7.3 KB | Procedural gait at phase φ (cycles). back = walking backwards (shorter, stiffer steps). Returns leg/pelvis/arm… |
| `dingge-source/src/characters/rig.ts` | 261 | 17.3 KB | tilt pivot (for falls) sits under root; body hangs from it |
| `dingge-source/src/core/engine.ts` | 121 | 6.0 KB | Renderer + post chain: scene → GTAO (contact shadows under props & feet) → bloom (sun glints) → Bokeh DOF |
| `dingge-source/src/core/math.ts` | 107 | 4.6 KB | Stateless hash → [0,1). Used for per-frame "boil" so it never depends on call order. |
| `dingge-source/src/film/mg.ts` | 296 | 16.6 KB | 0→1 appear over [t0,t0+d] with overshoot, 1→0 disappear over [t1-d2, t1] |
| `dingge-source/src/film/shots.ts` | 213 | 15.5 KB | The shot list = the director's breakdown (docs/DIRECTOR.md §4) as data. |
| `dingge-source/src/film/stage.ts` | 376 | 22.6 KB | The Stage owns every moving thing on the set and evaluates a TAKE (a continuous performance) at world time T. |
| `dingge-source/src/film/timeline.ts` | 124 | 6.0 KB | quantised local time for a frame (on twos → pairs of identical frames) |
| `dingge-source/src/materials/library.ts` | 83 | 5.9 KB | One shared material library. World-space UVs (see world/geo.ts) mean `uvScale` is metres per texture tile. |
| `dingge-source/src/materials/textures.ts` | 379 | 19.0 KB | Build albedo/normal/roughness from per-pixel callbacks returning colour, height, roughness. |
| `dingge-source/src/world/building.ts` | 272 | 16.4 KB | Six-storey RC frame under construction |
| `dingge-source/src/world/city.ts` | 150 | 9.1 KB | The surroundings that frame every exterior shot: ring roads with markings and street trees, then a believable |
| `dingge-source/src/world/crane.ts` | 200 | 11.2 KB | slew angle that points the jib at world (x,z), and the trolley radius needed |
| `dingge-source/src/world/geo.ts` | 101 | 4.9 KB | Axis-aligned box by centre & size, optional yaw. |
| `dingge-source/src/world/layout.ts` | 37 | 1.5 KB | Single source of truth for site dimensions (metres). Shots, takes, collision and props all read from here, |
| `dingge-source/src/world/props.ts` | 206 | 13.9 KB | Everything on the site that is not the building or the crane: ground, roads inside the hoarding, |
| `dingge-source/src/world/site.ts` | 49 | 1.8 KB | The reusable filming location. Everything a new film needs from the set is exposed here |
| `dingge-source/src/world/sky.ts` | 106 | 4.9 KB | Fit the shadow frustum around a region (per-shot focus keeps texel density high). |
| `dingge-source/tsconfig.json` | 15 | 0.3 KB |  |
| `dingge-source/vite.config.ts` | 7 | 0.3 KB |  |
