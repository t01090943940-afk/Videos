# 00-supercut-trailer · AI-Coding SuperVideos 合集总片 V2

120.0 秒 · 150 BPM · 3840×2160 @120fps 母版。
28 部代码视频的"片子"，本身也是一部代码视频：没有一个剪辑软件，
每一帧由 `render(t)` 算出，配乐由 numpy 逐样本合成 —— 画面和音乐读同一份 EDL。

## 流水线（顺序执行）

```bash
npm install            # pin hyperframes@0.8.77
npm run prep           # ffmpeg 切 110+ 段代理/海报/竖屏转横屏 → assets/clips, assets/posters
                       #   （--force 全量重建：改入点后必须带）
npm run build          # 生成 index.html（111 个静态 <video>）+ build/cues.json
npm run score          # python audio/score.py → assets/score.wav（121s · 48kHz 立体声）
npm run check          # hyperframes check（lint + runtime + layout 一门闸）
npm run snapshot       # 抽帧截图人工验收（tools/qa_probe.mjs，单位是秒！）
npm run render:4k      # → renders/master-v2-4k120.mp4（3840×2160 120fps）
```

依赖：Node 24、ffmpeg 8、Python 3.14 + numpy + scipy、headless Chrome（hyperframes 自带管理）、
Playwright（qa_probe 用，`%APPDATA%/npm/node_modules/x` 下解析）。

## 文件地图

| 文件 | 职责 |
|---|---|
| `src/catalog.mjs` | 28 部作品元数据：路径/规格/时代/高光入点 `wallIn`（唯一真相源） |
| `src/edl.mjs` | 乐谱：300 拍节拍图、76 镜头、PAIRS 解剖对、GRID/WALL/TUNNEL/MARATHON、全部文字、180 个音效 cue |
| `src/code-lines.mjs` | 37 行真实源码（代码墙用，可在源码包 Ctrl+F 复现） |
| `src/style.css` | 视觉系统：字体栈/层/窗口/分屏/手机框/巨墙/解剖对/马拉松/切片字/闪传卡/HUD |
| `src/runtime.js` | `render(t)` 纯函数：16 个场景 + 事件表 + 双 FX 画布（4K 后备），零 rAF/零未播种随机 |
| `tools/prep_media.mjs` | ffmpeg 预切：镜头代理、海报、竖屏转横屏、QA 联系表 |
| `tools/build.mjs` | EDL → 静态 index.html（勿手改 index.html；runtime.js 是内嵌的，改后必须 rebuild） |
| `tools/qa_probe.mjs` | Playwright 逐时刻 `__render(t)` + 截图 + 错误捕获（**参数单位是秒**） |
| `tools/dbg_probe.mjs` | 单时刻 DOM/样式 live 调试 |
| `audio/score.py` | numpy 合成 121s：鼓/贝斯/supersaw/动机 + 机械 foley（boot/tick/drafting/modem/crtoff） |
| `STORYBOARD.md` | 分幕表与画面/配乐系统说明 |
| `_survey/` | 28 部成片 20 格联系表（选点依据，留档） |

## V2 新增场景

- **解剖（b166–196）**：左边该项目真实源码文件逐行点亮 + beam 脉冲，右边 TRACKING 括号线框住它的成片输出 —— "每一帧 = render(t) 的输出" 的现场证明。
- **马拉松（b196–206）**：28 部 × 半拍海报带横扫，计数器狂跳，一部都不能少。
- **切片爆发式排版（b206–222）**：「通通开源」每字上/中/下三片横向撕开再合拢。
- **定格卡（b148）**：巨墙 28 格在骤停拍齐换照片海报 + 白边 + 快门音。
- **CRT 关机（b295–300）**：画面垂直塌缩成线 → 线缩成亮点 → 熄灭。
- **机械 foley**：boot 蜂鸣、打字机踩镲、铅笔制图、调制解调器握手、CRT 断电哨声。

## 验收要点

- `build/qa/contact-shots.jpg` / `contact-wall.jpg`：每个镜头入点是否取到高光帧。
- 拍点对齐：镜头起始拍 × 0.4 应压在鼓点上（cues.json 同网格生成）。
- 二维码：b232–256（92.8s–102.4s）全尺寸显示 9.6s，成片抽帧实测可扫。
- 确定性：同一 `t` 渲染两次逐像素一致（runtime 无 rAF/Date.now/裸 Math.random）。
- 音频自动化：loudnorm 母带到 ≈-15.5 LUFS / ≤-1.0 dBTP。

## 已知取舍

- 代理片段统一 30fps 输出；120fps 交付时源视频帧重复 4×，MG 层（文字/HUD/FX/画布）是真 120fps。
- 胶片颗粒/震屏按 `f=round(t*30)` 量化 —— 30hz 颗粒步进是故意的胶片语法，在 120fps 里成立。
- 镜头入点来自 20 格联系表目检，误差 ±1s；验收时对照 contact 表微调。
- index.html 内嵌 runtime.js 与全部 DOM —— 改任何 src/ 后必须 `npm run build`。
