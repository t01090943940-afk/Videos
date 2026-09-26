# 00-supercut-trailer · AI-Coding SuperVideos 合集总片

62.4 秒 · 150 BPM · 1920×1080 · 交付 720p60。
28 部代码视频的"片子"，本身也是一部代码视频：没有一个剪辑软件，
每一帧由 `render(t)` 算出，配乐由 numpy 逐样本合成 —— 画面和音乐读同一份 EDL。

## 流水线（顺序执行）

```bash
npm install            # pin hyperframes@0.8.77
npm run prep           # ffmpeg 切 90+ 段代理/海报/竖屏转横屏 → assets/clips, assets/posters
npm run build          # 生成 index.html（90+ 静态 <video>）+ build/cues.json + build/timeline.txt
npm run score          # python audio/score.py → assets/score.wav（48kHz 立体声）
npm run check          # hyperframes check（lint + runtime + layout 一门闸）
npm run snapshot       # 抽帧截图人工验收
npm run render         # → renders/supercut-trailer-1080p60.mp4
npm run ship           # ffmpeg 降采样 → renders/AI-Coding-SuperVideos-720p60.mp4（交付物）
```

依赖：Node 24、ffmpeg 8、Python 3.14 + numpy + scipy、headless Chrome（hyperframes 自带管理）。

## 文件地图

| 文件 | 职责 |
|---|---|
| `src/catalog.mjs` | 28 部作品元数据：路径/规格/时代/高光入点 `wallIn`（唯一真相源） |
| `src/edl.mjs` | 乐谱：150BPM 拍网格、41 个镜头、全部文字 cue、62 个音效 cue |
| `src/code-lines.mjs` | 37 行真实源码（代码墙/隧道用，可在源码包 Ctrl+F 复现） |
| `src/style.css` | 视觉系统：字体栈/层/窗口/分屏/手机框/巨墙/闪传卡片/HUD |
| `src/runtime.js` | `render(t)` 纯函数：13 个场景 + FX 画布 + HUD，零 rAF/零未播种随机 |
| `tools/prep_media.mjs` | ffmpeg 预切：镜头代理、海报、竖屏转横屏、QA 联系表 |
| `tools/build.mjs` | EDL → 静态 index.html（勿手改 index.html） |
| `audio/score.py` | numpy 合成：鼓/贝斯/supersaw/钟/SFX，读 build/cues.json |
| `STORYBOARD.md` | 分幕表与画面/配乐系统说明 |
| `_survey/` | 28 部成片 20 格联系表（选点依据，留档） |

## 验收要点

- `build/qa/contact-shots.jpg` / `contact-wall.jpg`：每个镜头入点是否取到高光帧。
- 拍点对齐：`build/timeline.txt` 中镜头起始拍 × 0.4 应压在鼓点上。
- 二维码：`qr.png` 在 128–140 拍段（51.2s–56s）全尺寸显示 8.8s，需实测可扫。
- 确定性：同一 `t` 渲染两次逐像素一致（runtime 无 rAF/Date.now/裸 Math.random）。

## 已知取舍

- 代理片段统一 30fps 输出；720p60 交付时源视频帧重复 2×，MG 层（文字/HUD/FX）是真 60fps。
- `wallIn` 入点来自 20 格联系表目检，误差 ±1s；验收时对照 contact-wall.jpg 微调。
