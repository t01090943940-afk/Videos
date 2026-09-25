# 00-THE-SOURCE ·《源 · THE SOURCE》AI-Coding SuperVideos 合集总片

**66 秒 · 120 BPM · 1920×1080 · 120fps 母版**（交付：`renders/THE-SOURCE_1080p60.mp4` H.264 / `renders/THE-SOURCE_1080p120.mp4` HEVC）

> 「一行代码，能走多远？」
> 这支片子是整个仓库 28 部代码视频的总片，它本身也是一部代码视频：
> 没有剪辑软件、没有 AE。画面由一个自写的 **WebGL2 合成器**逐帧算出，配乐由 **numpy 逐样本合成**，
> 所有素材都来自本仓库：作品镜头、源码包里的真实代码、CoExp 复盘里的经验标题、源码包里的原始音效。

## 这一版比 00-supercut-trailer 多了什么

| | 00-supercut-trailer | **00-THE-SOURCE** |
|---|---|---|
| 渲染 | HTML + GSAP，DOM 截帧 | 自写 WebGL2 合成器：HDR 缓冲、泛光链、色差、镜头畸变、颗粒、遮幅 |
| 帧率 | 720p60 交付，MG 层 60fps | **1080p 120fps 母版**，60fps 版由 120 帧两两融合（真实运动模糊） |
| 叙事 | 时代卡 + 窗口堆叠 + 墙 | 一个问题 → 一个答案（开头的一行代码 = 结尾的第 45,559 行） |
| "代码"怎么出现 | 背景代码墙 | **每个镜头从它自己的源码里解码出来**（代码字形着色器，字符取自该作品源码包） |
| 空间 | 2.5D 叠层 | 真 3D：窗口塔、十五世界环、336 帧作品球 → 墙、文件树瀑布 |
| 「通通开源」 | 四字砸屏 | 每个字由几百个正在播放的作品帧拼成 → 推焦穿过一帧 → 钻进它的源码 |
| 数据 | 手写统计 | `tools/prep.py` 实测：19 个源码包 · 977 个文件 · 45,558 行代码 · 24 份 CoExp · 515,858 字 |
| 声音 | numpy 合成 | numpy 合成 + 源码包里的真实音效按峰值对齐拍点 + 段落自动化 + 磁带骤停 |

## 流水线

```bash
npm install                       # 只依赖 ws（Playwright / Chromium 用环境自带的）
python3 tools/prep.py             # 读整个仓库 → assets/（逐帧 JPEG、马赛克图集、源码字形语料、文件树、实测统计、音效 wav）
node tools/cues.mjs               # src/timeline.mjs → build/cues.json
python3 audio/score.py            # → build/score.wav（48k / 24bit，≈ -11 LUFS）
python3 tools/audio_report.py     # 频谱 + 响度曲线验收图 → build/audio_report.png
node tools/render.mjs --beats 16,52,98 --w 960         # 按拍抽静帧 → build/stills/
python3 tools/sheet.py                                 # 静帧联系表 → build/sheet.jpg
node tools/render.mjs --fps 120 --out renders/master_1080p120.mkv [--workers 2]   # 母版（近无损 4:4:4）
python3 tools/ship.py             # → THE-SOURCE_1080p60.mp4 / THE-SOURCE_1080p120.mp4 / poster.jpg（各 < 95 MB）
```

依赖：Node 22、Playwright（无头 Chromium，ANGLE + SwiftShader，无需 GPU）、ffmpeg（libx264 / libx265）、Python 3 + numpy + scipy + Pillow。
所有素材路径都相对仓库根目录；镜头代理来自 `00-supercut-trailer/assets/clips`，字体来自 `00-supercut-trailer/assets/fonts`。

## 文件地图

| 文件 | 职责 |
|---|---|
| `src/timeline.mjs` | **唯一真相源**：120 BPM 拍网格、全部镜头 / 文案 / 189 个音效 cue |
| `src/works.json` | 28 部作品元数据（标题 / 模型 / 规格 / 技术点） |
| `web/engine.js` | 合成器：两阶段渲染（collect → 解码 → draw）、LRU 帧纹理、文字纹理、源码字形页、泛光 + 最终合成 |
| `web/lib/shaders.js` | 全部 GLSL：精灵（含代码字形解码）、泛光、最终调色、7 种转场、马赛克、字形粒子、作品瓦片 |
| `web/lib/gl.js` · `web/lib/math.js` | WebGL2 封装 · mat4 / 缓动 / 确定性哈希（全片零 `Math.random`） |
| `web/scenes/*.js` | 各幕：`genesis` 源 · `eras` 四代 · `drop` 电影 · `orb` 球墙 · `finale` 凝视 / 通通开源 / 里面 / 下一行 · `common` 窗口 / 标签 / HUD |
| `tools/render.mjs` | 无头 Chromium 逐帧渲染 → WebSocket 回传 RGBA → ffmpeg |
| `audio/score.py` | 配乐：鼓 / 贝斯 / pad / 超锯 / 琶音 / 主旋律 / 钢琴 / 32 种音效 + 混音母带 |
| `tools/prep.py` · `tools/ship.py` | 素材准备 · 交付编码 |
| `STORYBOARD.md` | 分幕表与画面 / 配乐系统说明 |

## 工程要点（踩过的坑）

- **像素回传**：1080p 一帧 8.3 MB。`fetch` POST 实测 660 ms/帧，WebSocket 二进制 ~90 ms/帧 —— 这是 120fps 能在云端跑完的前提。
- **确定性**：`renderFrame(i)` 先跑一遍场景只登记需要的源片帧，解码完再正式画；没有 rAF / Date.now / Math.random，同一帧号永远同一画面，可以任意分段并行渲染。
- **NaN 会被泛光放大**：某个 alpha 算成 NaN 时，泛光降采样链会把它扩散成大块黑色多边形。精灵在 alpha 非正数时直接跳过，最终合成里也把 NaN 置零。
- **亮底素材 + 泛光 = 过曝**：DROP 段大量浅色背景作品，泛光阈值要提到 0.95、闪白只给第一拍。
- **窗口塔的开场**：不是把第一扇窗缩小，而是让相机先贴在它正前方（距离 = D × 窗宽 / 1920，刚好满屏）再拉开 —— 从全屏到 3D 塔的交接零跳变。
- **配乐不能"听起来差不多"**：用 `tools/audio_report.py` 的频谱 + 响度曲线看结构，母线压缩过重会把 GEN 01 和 DROP 压成一样响，要靠段落自动化把能量曲线做出来。
