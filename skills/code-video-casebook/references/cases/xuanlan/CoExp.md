# 玄览 PocketWebShell 宣传片 · 代码视频复盘

> 成片：`XuanLan-PocketWebShell-promo`，55 秒，1920×1080，60 fps，120 BPM，H.264 + AAC。
> 制作环境：Claude Code 云端容器（Linux，4 核，15 GB 内存，无 GPU，无显示器，出网经代理）。
> 制作时间：2026-09-24 19:16 → 19:48 UTC，墙钟约 32 分钟，产出约 2300 行代码。
> 本文只记录这次真实发生的过程、参数和踩坑，供下次直接复用。

---

## 零、一页速览（先看这个）

- **方法**：一个 HTML Canvas 2D 页面，暴露纯函数 `renderAt(t)`。Playwright 驱动无头 Chromium 按 `t = frame / fps` 逐帧取 JPEG，4 个页面并行渲染。Python（numpy + scipy）按同一份 `timeline.js` 合成配乐和音效，最后用 ffmpeg（imageio-ffmpeg 自带的静态版）封装成 MP4。
- **为什么不用 AE / Remotion / 屏幕录制**：容器里没有 GUI，也没有 GPU。Canvas + 逐帧截图完全确定，不掉帧，没有音画漂移，重渲一次只要 74 秒。
- **最关键的三个做法**：
  1. **共享时间轴**：画面和声音读同一个 `timeline.js`，天然卡点。
  2. **所有动画都是 t 的纯函数**：没有 `Date.now()`、`Math.random()`、CSS transition，任何一帧都能单独渲染预览。
  3. **每写完一幕就抽帧拼联系表（contact sheet）看图**：共拼了 4 张，发现并修掉了 8 处视觉问题。
- **最耗时的环节**：写场景代码，约 18 分钟。其次是 x264 `-preset slow` 编码，55 秒片子编了约 2.3 分钟，比渲染本身的 74 秒还慢。
- **最容易翻车的坑**：容器没有中文字体；Playwright 自带的 ffmpeg 是阉割版；嵌套透明度用 `=` 覆盖会留下"鬼影"；帧缓存会复用旧帧；母版 64 MB 超过 30 MiB 的发送上限。

---

## 一、创作思路

### 1. 需求如何拆成叙事结构

用户的原始需求可以拆成 6 个硬指标：

| 需求原话 | 落地成什么 |
|---|---|
| 30–60s | 55 秒，120 BPM，每小节 2 秒，共 27.5 小节，所有剪辑点都落在 0.5 秒的节拍网格上 |
| 有叙事感 | 「困境 → 混乱 → 觉醒 → 能力展示 → 愿景 → 定版」六段式 |
| 互联网浏览器时代混剪 | 1993 / 1996 / 1999 / 2004 / 2008 / 2015 六个时代，每拍一切 |
| 进化到手机端 | 浏览器窗口直接形变成手机屏幕，标签页图标飞进桌面网格 |
| 中间介绍所有核心点，有交互动画 | 7 个功能段，每段都有「手机交互演示 + 真实代码逐字敲出」 |
| 后面给出愿景：导入代理、Agent 控制 | 独立的 Act IV，明确标注 ROADMAP |

**情绪 / 能量曲线与时间段对应**（这是整片的骨架，先定它，再写代码）：

```
能量
 ▲                                         ┌──功能段满编 groove──┐
 │                 ┌─┐        ┌冲击┐     ┌─┘                    └┐   ┌─┐定版
 │        ┌混剪────┘ │重击×3  │    │     │                        │   │ │大和弦
 │        │          │        │    └─呼吸┘                        └┐ ┌┘ │
 │  ┌─独白┘          └─静默───┘                                  └─┘半拍 └淡出
 └──┴────┴──────────┴───┴────┴──────┴─────────────────────────────┴───┴──────► t
   0     4          10.5  12  14    16                            42  50 51.2 55
   冷开场  浏览器时代    三连重击  进化  品牌   七个功能                    愿景  AI 定版
```

| 时间 | 段落 | 情绪 | 能量 | 画幅 |
|---|---|---|---|---|
| 0–4s | SC.01 冷开场 | 悬念、克制 | 极低（嗡鸣 + 打字声） | 2.39:1 遮幅 |
| 4–10.5s | SC.02 浏览器时代 | 怀旧 → 焦躁 | 四拍底鼓 → 八分 → 十六分加速 | 2.39:1 |
| 10.5–12s | 三连重击字幕 | 痛点宣判 | 音乐几乎静默，只剩重击 | 2.39:1 |
| 12–14s | SC.03 进化 | 转折、期待 | 铺底 + 升调 | 2.39:1 → 13.4s 起打开 |
| 14–16s | 品牌亮相 | 释放 | 冲击 + 大和弦 | 16:9 全画幅 |
| 16–42s | 7 个功能段 | 自信、信息密度高 | 满编 groove + 琶音 | 16:9 |
| 42–50s | 愿景（代理 / Agent） | 神秘、未来 | 半拍、暗色、延迟琶音 | 16:9 |
| 50–51.2s | AI 就绪字幕 | 爬升 | 军鼓滚奏 + 星空曲速 | 16:9 |
| 51.2–55s | 定版 | 落定、余韵 | 大和弦 + 钟声 + 混响尾 | 遮幅重新合上 |

画幅本身也参与叙事：「过去」用电影遮幅（2.39:1），「现在 / 手机」一出现遮幅就打开成 16:9，片尾再合上。观众会感到"眼前一亮"，这个感受是画幅变化给的，不靠台词。

### 2. 各段落的设计意图

**冷开场（0–4s）**
- 纯黑背景，只有尘埃粒子，打字机逐字打出「每一个网站，都曾困在一扇窗口里。」，下面接英文 `EVERY WEBSITE WAS BORN INSIDE A WINDOW.`，字距从 16 收到 7。
- 意图：先抛命题，不出现任何产品。「窗口」一词是整片的母题，下一秒就兑现成一个真实的浏览器窗口。
- 2.6–4.0s：画面中央横向拉开一道暖色光缝（`E.inX` 指数加速），4.0s 冲击帧切进 1993。光缝可以理解成"窗口被打开"。

**浏览器时代混剪（4–10.5s）**
- 每拍一个时代，每个时代的视觉语言都不同：
  - 1993：灰底 Mosaic 式界面、衬线字、蓝色下划线链接、隔行加载的"图片"、转动的地球图标。以 0.42 倍分辨率绘制后用最近邻放大，带像素感。
  - 1996：星空背景、彩虹渐变标题、施工黄黑斜纹条、访客计数器（VT323 点阵字）、跑马灯。
  - 1999：Win98 窗口、门户网站、拨号对话框和分段进度条，配 56K 调制解调器的啸叫声。
  - 2004：Web 2.0 高光渐变、BETA 徽章、标签云；鼠标点击「+」，标签页诞生。
  - 2008：极简地址栏，输入 `pocket web` 弹出建议，下方九宫格快速拨号。
  - 2015：标签数每 0.25 秒翻倍（8 → 512），弹窗越堆越多，右上角红色计数，镜头抖动、色差、故障逐渐加码。
- 每个镜头背后都有一个巨大的描边年份数字，左下角是金色年份 + 中文标题 + 英文小字，构成"拉片感"的下三分之一字幕。
- 时代越早，渲染分辨率越低（0.42 / 0.5 / 0.62 / 1.0），并叠加 CRT 扫描线。用画质本身交代年代，比加字幕说明更直观。

**三连重击（10.5–12s）**
- 背景是冻结的标签爆炸画面，模糊 14px、亮度 0.35。三句话各占 0.5 秒：「书签，只会收藏。」「标签，只会堆积。」「网站，值得一个家。」前两句白色，第三句金色。
- 每句从 1.35 倍缩放到 1，字距从 24 收到 4，入场只用 0.22 秒（`E.outX`）。
- 意图：把痛点压缩成三拍口号，第三句同时抛出解法的方向。音乐在这里几乎抽空，只剩重击声，制造"宣判"感。

**进化（12–16s）**
- 12.0s 出现一个干净的现代浏览器（6 个标签：GitHub、Wikipedia、YouTube、知乎、B 站、掘金）。
- 12.45–13.45s 窗口的矩形、圆角、宽高插值成手机屏幕（`E.ioX`）；浏览器内容淡出，壁纸淡入；6 个标签页的 favicon 沿弧线飞进桌面网格的 0–5 号槽位，从 16px 长到 60px；13.0s 之后手机边框逐渐长出。
- 这是整片的**概念镜头**：标签页 → App 图标，一个镜头讲完产品定位。
- 14.0s 冲击：手机滑到左侧，右侧品牌标（太极环 + 金色星核 + 倾斜轨道 + 伴星，路径直接照搬 `ic_launcher_foreground.xml`）画线点亮，粒子迸发；「玄」「览」逐字放大入场，一道扫光掠过；接着是 `POCKETWEBSHELL` 字距收紧，和「把网站，装进口袋桌面。」

**七个功能段（16–42s）**
- 统一版式：手机在左（x=560，缩放 0.98）；右栏依次是编号 `01 / 07`、80px 中文标题、英文副题、3 个关键词胶囊，再下面是 Xcode 暗色风格的代码卡片，代码逐字敲出，当前讲到的那一行高亮；底部是 7 格目录进度条。
- 左侧空白区用来放"解释层"，比如 HTML 元数据胶囊、`5 × 4 = 20` 公式、拖拽步骤表、事件日志、WebView 池示意图、安全清单、主题名。
- 每段都有一个**记忆点**：

| 段 | 时长 | 记忆点 |
|---|---|---|
| 01 添加即成应用 | 4s | 输入 `yuque.com` → 解析 → HTML 标签以胶囊形式从页面飞出 → 三个候选图标 → 选中的图标沿弧线飞进桌面槽位 |
| 02 确定性网格 | 3.5s | 蓝图虚线网格 + `60dp` 标注；8 个图标依次弹入，「添加」格被一格格往后挤，满页后翻到新页；远程大图放大到 2.3 倍后被弹回固定单元格（红框变绿框） |
| 03 桌面级拖拽（高潮） | 6s | 推镜到被按住的图标 → 长按进度环 → 玻璃菜单 → 16dp 阈值圈 → 拿起；**等轴测分层爆炸视图**（Grid / DragLayer / 触点三层）；悬停 500ms 合并成文件夹；边缘悬停 450ms 翻页 |
| 04 一站一会话 | 4s | 点图标展开成站点壳 → 悬浮球 → 2×2 标签卡；左侧 `ShellListener` 事件沿贝塞尔连线精确送到对应 `sessionId` 的卡片；LRU 池淘汰示意 + 前台服务通知 |
| 05 外部文件 | 3s | 聊天里的 `.md` / `.html` 文件 → 「打开方式」面板选玄览 → Markdown 全屏站点壳逐行渲染 → 回到主屏出现新图标 |
| 06 安全 | 2.5s | HTTP 未加密确认弹窗 → 证书无效拦截 → 锁屏上的前台服务通知；左侧 4 项打勾动画 |
| 07 主题 + 技术栈 | 3s | 从 Dock 位置圆形擦除，依次切换纯白 / 纯黑 / 照片 / 跟随系统；Dock 扫光；随后 11 个技术栈胶囊在十六分音符上依次弹出 |

**愿景（42–51.2s）**
- 画面整体切到星空，色温转向冷蓝和金色。42s「下一站」金色大字，外面绕一圈品牌标的轨道椭圆（呼应 logo），伴星沿轨道运行。
- 导入代理：手机上输入订阅链接 → 导入 3 个节点 → 按站点列出路由；右侧是「玄览 → 节点 → 站点」的流动虚线路由图，线上有光点流动。
- Agent 控制：紫青金渐变的 AI 光标（✦）自己点开 GitHub → 虚线框标出 `tap("Pull requests")` → 扫描 PR 列表 → 弹出总结气泡；右侧终端同步打出 `open / tap / read` 调用日志；手机顶部常驻「Agent 操作中 · 随时可接管」。
- 两段都挂着「ROADMAP · 规划中」徽章，避免夸大宣传。
- 50–51.2s：「你的口袋网站，/ 为 AI 时代就绪。」星点拉成曲速线，把能量推到最后一个冲击点。

**定版（51.2–55s）**
- 遮幅重新合上。品牌标在画面中央重画一遍，外圈是大轨道。依次出现「玄览」、`POCKETWEBSHELL`、「涤除玄览 · 把网站，装进口袋桌面」（应用名出自《老子》"涤除玄览"），以及官网、仓库、Android 10+、GPL-3.0。
- 54.2–55s 淡到黑。首尾呼应："窗口"开场，"遮幅"收尾。

### 3. 节奏、剪辑与音画配合技巧

| 技巧 | 这次怎么用 | 为什么有效 |
|---|---|---|
| **节拍网格剪辑** | 120 BPM，所有剪辑点都是 0.5 的倍数（4.0、5.0、…、23.5、29.5） | 剪辑点和底鼓重合，观众会下意识觉得"很带感" |
| **能量递进后突然抽空** | 9–10.5s 底鼓从四分变八分、军鼓十六分滚奏；10.5s 音乐抽掉 92% | 期待被拉满后落空，重击字幕的冲击力翻倍 |
| **冲击帧四件套** | `impacts` 时间点同时触发：闪白 0.55、镜头抖动 14px、色差 9px、画面推近 1.8%、故障切片；音频侧同时触发次低频 boom 和噪声镲片 | 视觉和听觉在同一帧爆发，"打击感"来自多通道同步 |
| **小切点** | `cuts` 时间点：闪白 0.35、抖动 4px、色差 5px；音频配快门声 | 区分大小层级，避免每次都是大冲击导致疲劳 |
| **呼啸声提前起音** | `whoosh` 在事件点前 `d × 0.55` 秒就开始 | 声音先到画面后到，观众的感受是"画面被声音带进来" |
| **侧链压缩** | 每个底鼓后，铺底和贝斯压低 55%，按 90ms 指数恢复 | 产生 EDM 式的"呼吸泵感"，同时给底鼓腾出空间 |
| **推镜强调** | 拖拽段 23.95–24.25s 以被按住的图标为锚点推近 1.55 倍 | 16dp 这种微小交互必须放大才看得见 |
| **分层爆炸视图** | 仿射矩阵从单位矩阵插值到等轴测矩阵，三层上下拉开 | 把"浮层不参与测量"这个抽象的架构点直接画出来 |
| **遮幅开合** | 过去用 2.39:1，进化那一刻打开，定版时合上 | 画幅变化本身就是情绪信号 |
| **HUD 拉片元素** | 遮幅黑边里放场次号、时间码、闪烁的 REC 红点、镜头参数 | 带来"电影拉片"的专业质感，又不占主画面 |
| **代码逐字敲出 + 行高亮跟随** | 每段约 1.7 秒打完代码；高亮行随演示阶段切换 | "代码视频"的核心卖点：画面在做的事和高亮的那行代码对得上 |
| **弹簧缓动** | `spr(t, a, d)` 阻尼弹簧用于所有弹出元素 | 比 easeOut 更"物理"，更接近 iOS 的手感 |
| **UI 音效对位** | taps / dings / types / pings / blips 全部来自时间轴 | 每个点击都有声音，整体显得精致、可信 |

---

## 二、具体的创作方式

### 1. 技术栈与工作流

| 环节 | 工具 | 说明 |
|---|---|---|
| 画面 | HTML5 Canvas 2D（原生 JS，无框架） | 单个 1920×1080 canvas，用离屏 canvas 做后期合成 |
| 字体 | Noto Sans SC 400/700/900、Inter 400/600/800/900、JetBrains Mono、Tinos、VT323、Comic Neue、Arimo | Google Fonts CSS API 下载 TTF 到本地，用 `@font-face` 加载 |
| 逐帧截取 | Playwright 1.56（全局安装在 `/opt/node22/lib/node_modules/playwright`）+ 预装的 Chromium | `page.evaluate` 调用 `canvas.toDataURL('image/jpeg', .94)` |
| 静态服务 | Node 内置 `http` 模块，脚本里自带 | 避免 `file://` 下字体和跨域的问题 |
| 音频 | Python 3.11 + numpy + scipy（`butter` / `sosfilt` / `fftconvolve`） | 全部程序化合成，不用任何采样素材 |
| 编码 | `imageio-ffmpeg` 自带的静态 ffmpeg 7.0.2（含 libx264 和 aac） | Playwright 自带的 ffmpeg 不能用，原因见"踩过的坑" |
| 预览拼图 | Pillow | 自写 `sheet.py`，3 列拼接，每格 640×360 |

**完整步骤（实际执行顺序）**：

1. 读项目：`README.md`、`PROJECT_ANALYSIS.md`、`docs/DESIGN.md`、`CHANGELOG.md`、`AGENTS.md`，以及 `docs/verification/` 里的真实截图（壁纸、Dock、图标尺寸、配色），`ic_launcher_foreground.xml`（品牌标路径和颜色），`HomeGestures.kt` / `AddUrl.kt` / `WebViewPool.kt` / `ShellListener.kt`（为代码镜头取真实的常量和 API 名）。
2. 查环境：`which ffmpeg`、`fc-list`、`nproc`、`free`、`pip download`（测试网络）、`ls /opt/pw-browsers`。
3. 装依赖：下载字体，`pip install imageio-ffmpeg numpy pillow scipy`。
4. 定时间轴 `timeline.js`，这是分镜的"机器可读版"。
5. 写引擎：`lib.js`（工具和组件）→ `main.js`（合成器和后期）→ `scenes.js`（Act I–II）。
6. 写 `render.mjs`，抽 15 帧拼成 `sheet1` 检查，修正。
7. 写 `features.js`，抽 28 帧拼成 `sheet2a` / `sheet2b` 检查，修正。
8. 写 `vision.js`，抽 15 帧拼成 `sheet3` 检查，修正（透明度 bug）。
9. 写 `soundtrack.py`，生成 wav，逐秒测 RMS，调整母带。
10. 全片渲染：4 个 worker，60 fps，3300 帧，用时 74 秒。
11. 抽 21 个转场附近的帧拼成 `sheet4`，做最后一轮检查。
12. `encode.sh` 输出母版 → 720p 预览版 → 两遍编码的分享版 → 源码 zip → 发送。

### 2. 项目结构与关键模块

```
promo-video/               （仓库 .gitignore 已忽略该目录）
├── index.html             画布 + @font-face + 按顺序加载脚本
├── timeline.js            window.TL = {...} 画面和声音共用的时间轴（唯一真相源）
├── lib.js                 缓动、弹簧、哈希噪声、文字、图标、手机、Dock、壁纸、代码卡片
├── scenes.js              renderScene 分发 + 冷开场 / 时代混剪 / 进化 / 品牌 + homeScreen
├── features.js            7 个功能段 + 右栏 panel + 目录条
├── vision.js              星空 / 代理 / Agent / 定版
├── main.js                后期合成器 + 字体就绪 + 播放器 + frameJPEG 接口
├── render.mjs             stills / video 两种模式的逐帧截取
├── soundtrack.py          配乐 + 音效 → soundtrack.wav
├── encode.sh              帧序列 + wav → mp4
├── fetch-fonts.sh         字体下载
├── sheet.py               联系表拼图
└── out/                   stills/ frames/ *.mp4 sheet*.jpg
```

**核心代码 1：共享时间轴（节选）**

```js
window.TL = {
  "bpm": 120, "duration": 55.0,
  "features": [[16,20],[20,23.5],[23.5,29.5],[29.5,33.5],[33.5,36.5],[36.5,39],[39,42]],
  "impacts": [4.0, 10.5, 11.0, 11.5, 14.0, 16.0, 42.0, 43.5, 51.2],
  "cuts":    [5.0, 6.0, 7.0, 8.0, 9.0, 12.0, 20.0, 23.5, 29.5, 33.5, 36.5, 39.0, 46.5, 50.0],
  "whooshes":[12.35, 13.55, 19.25, ...],
  "risers":  [[2.6,4.0],[12.0,14.0],[15.0,16.0],[41.0,42.0],[49.2,51.2]],
  "taps": [...], "dings": [...], "types": [[0.30,1.55,15], ...], "pings": [...], "blips": [...], "modem": [6.0,6.9]
};
```

Python 端用正则把 JSON 抠出来：

```python
TL = json.loads(re.search(r"window\.TL\s*=\s*(\{.*\});", Path("timeline.js").read_text(), re.S).group(1))
```

注意：想让 Python 能读，`timeline.js` 里必须写**严格 JSON**（键名带双引号，不能有注释，不能有尾逗号）。

**核心代码 2：确定性工具（lib.js）**

```js
const seg = (t, a, b) => clamp((t - a) / (b - a));            // 把 [a,b] 映射到 0..1
function spr(t, a, d = .6, bounce = 1) {                       // 阻尼弹簧，所有"弹出"都用它
  const x = (t - a) / d; if (x <= 0) return 0;
  return 1 - Math.exp(-6 * x) * Math.cos(bounce * 10 * x);
}
function pulse(t, a, d = .25) { const x = t - a; return x < 0 ? 0 : Math.exp(-x / d * 3); }  // 冲击衰减
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); } // 代替 Math.random
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }
```

**核心代码 3：合成器 renderAt（main.js，简化）**

```js
function renderAt(t) {
  sctx.fillStyle = '#000'; sctx.fillRect(0, 0, W, H);
  renderScene(sctx, t);                                    // 场景只负责画内容，并通过 SCENE_FX 请求特效
  const imp = impactAt(t), cut = cutAt(t);                 // 从 TL.impacts / TL.cuts 算 pulse 之和
  const shake = imp * 14 + cut * 4 + (SCENE_FX.shake || 0);
  const sx = noise1(t * 40) * shake, sy = noise1(t * 40 + 77) * shake;
  const zoom = 1 + imp * .018 + cut * .006, ab = imp * 9 + cut * 5 + (SCENE_FX.aberration || 0);
  // 色差：用 multiply 把场景拆成 R/G/B 三张，再用 lighter 错位叠回
  // 故障：把输出拷到 TMP，随机取横条错位重绘
  // 闪白 → 暗角 → 颗粒(overlay 5.5%) → 遮幅 + HUD → 首尾淡入淡出
}
window.frameJPEG = (t, q = .93) => { renderAt(t); return OUT.toDataURL('image/jpeg', q); };
```

**核心代码 4：逐帧截取（render.mjs，关键部分）**

```js
const browser = await playwright.chromium.launch({ args: ['--force-device-scale-factor=1'] });
async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('pageerror:', e.message));   // 必须监听，否则 JS 报错悄无声息
  await page.goto(`http://127.0.0.1:${port}/index.html?capture=1`);   // ?capture 关掉实时播放循环
  await page.evaluate(() => window.ready);                             // 等字体和静态资源
  return page;
}
// 4 个页面共享一个 next 计数器，并行领帧
await Promise.all(Array.from({ length: workers }, async () => {
  const page = await openPage();
  while (next < total) {
    const f = next++;
    save(`out/frames/f_${String(f).padStart(5, '0')}.jpg`, await page.evaluate(t => window.frameJPEG(t, .94), f / fps));
  }
}));
```

**核心代码 5：主屏数据模型（一个函数画出所有桌面状态）**

```js
// items: [{k, slot, page, s, a, pos:[x,y], ghost, folder:[keys], add:true, label, shadow}]
homeScreen(ctx, { items, pages: 2, pageOffset: po, theme: 'dark', dim: .28, sheen: .5 });
```

拖拽、文件夹、翻页、重排、主题切换，全都只是在构造不同的 `items` 数组（见 `f3State(t)`）。有了这个模型，"交互动画"就变成了"每一帧的状态函数"。

### 3. 各视觉风格的代码实现

| 风格 / 效果 | 实现方式 |
|---|---|
| 年代像素感 | 在离屏 canvas 上用 `setTransform(r,0,0,r,0,0)` 以 r = 0.42 / 0.5 / 0.62 绘制 1280×720 的内容，再 `imageSmoothingEnabled = false` 放大到 1040×585 |
| CRT 扫描线 | 窗口上每 4px 画一条 2px 黑线，透明度 0.16；再用 `lighter` 叠一层淡蓝径向辉光 |
| 标签爆炸 | `N = min(512, 8 * 2^floor(lt/0.25))`，标签宽 `max(2.2, 1160/N)`；弹窗数 `floor(lt/0.075)`，位置由 `hash(i)` 决定；同时设置 `SCENE_FX.shake / aberration / glitch` 随时间增长 |
| 冻结 + 模糊背景 | `ctx.filter = 'blur(14px) brightness(.35)'` 绘制冻结帧，只在 10.5–12s 用，控制软件渲染的开销 |
| 字幕重击 | `slam()`：缩放从 1.35 到 1（`E.outX`，0.22s），`ctx.letterSpacing` 从 24 收到 4；金色版用线性渐变填充 + `shadowBlur 40` |
| 打字机 | `line.slice(0, floor(progress * len))`；居中时先量整行宽度再左对齐绘制，已打出的字不会随长度增加而左右晃动 |
| 窗口 → 手机形变 | 矩形的 x/y/w/h/圆角同时插值（`E.ioX`），内容用 `clip` 限制在矩形内；浏览器内容与壁纸交叉淡化；favicon 沿 `lerp + sin(πq) * 70` 的弧线飞行 |
| 品牌标 | 按 108dp viewport 1:1 复刻 VectorDrawable：外环 `arc` 按进度绘制，星核 `outB` 弹出，轨道 `ellipse(0,0,44,15)` 旋转 −28°，伴星用 `cos/sin` 沿轨道运动，带 `shadowBlur` 发光 |
| 扫光 | 在文字区域 `clip` 后，以 `lighter` 叠一条 120px 宽的线性渐变，从左扫到右 |
| 粒子迸发 | 70 个粒子，角度和速度来自 `hash(i)`，位移 `sp * (1 - exp(-3lt))`，透明度线性衰减 |
| 液态玻璃 Dock | 半透明圆角矩形填充 + 从上到下由白到透明的渐变描边；扫光同上。没有真做实时模糊，用静态材质模拟，也契合项目"只有一处 live blur"的规范 |
| 手机外壳 | 双层圆角矩形：钛金渐变描边 + 黑色边框 + 屏幕 `clip` + 挖孔摄像头 + 侧键 + 斜向玻璃反光带 |
| 壁纸 | 启动时预渲染到 2 倍尺寸的离屏 canvas：线性渐变底色 + 3 条贝塞尔色带 + 径向暗角；照片主题用天空渐变、太阳和噪声山丘拼成 |
| 代码卡片 | 正则分词器（注释 / 字符串 / 数字 / 注解 / 标识符），配色取 Xcode Dark（关键字 `#ff7ab2`、字符串 `#ff8170`、类型 `#5dd8ff`、函数 `#67b7a4`、常量 `#b281eb`）；按字符数逐步显示；高亮行是一条半透明色条加左侧竖线 |
| 推镜 | 保持焦点的全局坐标不变：`C' = g − (f − SW/2) · s0 · z`，在 0.3 秒内用 `E.ioC` 插值 |
| 等轴测爆炸视图 | 线性矩阵在单位矩阵和 `[cosθ·k, sinθ·k·.55, −sinθ·k, cosθ·k·.55]`（θ=40°，k=0.8）之间插值后 `ctx.transform`；三层在屏幕 y 方向上相隔 ±150·p；引线标签的端点用同一个矩阵投影 |
| 事件连线 | 事件日志框到卡片中心画 `bezierCurveTo`，光点沿 `lerp` 加 `E.ioC` 移动，外圈叠 `lighter` 光晕 |
| 圆形擦除换主题 | 先画旧主题，再 `arc(…, wipe*1000)` 做 `clip` 画新主题，边缘补一圈白色描边 |
| 流动虚线路由图 | `setLineDash([10,8])` + `lineDashOffset = −t*70`；贝塞尔手动采样 24 个点，便于做"生长"进度；光点在曲线参数上循环 |
| 曲速线 | 星点沿中心放射方向画线段，长度 `warp * 260 * z` |
| 色差 | 三张全屏离屏 canvas：`drawImage(S)` 后以 `multiply` 填纯红 / 绿 / 蓝，主画布用 `lighter` 以 `−ab / 0 / +ab` 偏移叠回。只在 `ab > 0.6` 时启用，节省开销 |
| 故障切片 | 输出拷到 TMP，取 `4 + gl*10` 条随机横带（`hash2(帧号, i)`）水平错位重绘 |
| 胶片颗粒 | 启动时生成 4 张 512² 的灰噪声图，按 24 fps 轮换并随机偏移平铺，`overlay` 模式，透明度 5.5% |
| 遮幅 + HUD | 上下各 131px 黑边（2.39:1），里面用 13–14px 等宽字写场次、时间码（按 24 fps 格式化）和 REC 红点 |

### 4. 音频处理

全部在 `soundtrack.py` 里用 numpy 合成，48 kHz 立体声，16 位 wav。

**分轨总线**：
- `dry`：鼓、冲击、界面音效，直出。
- `wet`：送混响（2.4 秒指数衰减的立体声白噪声 IR，6 kHz 低通，`fftconvolve`）。
- `pad_bus`：音乐部分（铺底、贝斯、琶音），接受侧链压缩。

**乐器配方**（参数都是这次实际用的）：

| 元素 | 配方 |
|---|---|
| 底鼓 | 正弦，频率 `44 + 120·e^(−t/0.045)` 用 `cumsum` 积分成相位，振幅按 0.32s 衰减，加一个 12ms 的高通噪声 click，再 `tanh(1.6x)` 饱和 |
| 拍手 | 3 段 900–5000 Hz 带通噪声，间隔 11ms，最后一段衰减 0.12s |
| 军鼓 | 190 Hz 正弦（0.05s 衰减）+ 1.5–9 kHz 带通噪声（0.09s 衰减） |
| 踩镲 | 7.5 kHz 4 阶高通噪声，闭镲衰减 18ms，开镲衰减 90ms |
| 冲击 | 次低频 `36 + 70·e^(−t/0.12)`（0.9s 衰减，`tanh(2.2x)`）+ 5 kHz 低通噪声镲片（0.7s 衰减，送混响）+ 瞬态 click |
| 升调 | 噪声分 24 段做阶梯式带通扫频（300 Hz → 约 7 kHz），叠加 110 Hz 起、升 3 个八度的正弦，包络 `(t/d)^2.2` |
| 呼啸 | 500–4000 Hz 带通噪声，`sin²` 包络，声像从左扫到右，**提前 0.55·d 秒起音** |
| 界面音效 | 点击：1.9 kHz 正弦，12ms 衰减；完成提示：1318.5 Hz 加 2.01 倍和 3.47 倍非谐和泛音的钟声；打字：2–7 kHz 噪声，5ms；通知：随机取 1568 / 1760 / 2093 Hz；电子 blip：880 → 1580 Hz 方波扫频 |
| 拨号音 | 按每秒 14 段在 2100 / 1200 / 扫频之间切换，间隔插入噪声爆发，3.4 kHz 低通 |
| 铺底 | 每个音 5 个锯齿波，失谐 ±0.11 / ±0.05 / 0 半音并左右分布，2 阶低通（1.1–3 kHz） |
| 贝斯 | 锯齿 + 正弦 + 低八度正弦，600 Hz 低通，八分音符，每 4 个音里有 1 个升八度 |
| 琶音 | 锯齿加二次谐波，衰减 0.09s，附点八分延迟两次（0.375s×0.45，0.75s×0.22） |

**和声**：A 小调，i–VI–III–VII（Am9 – F – C – G），每小节换一个和弦。愿景段换成 Am – Em – F – G，滤波压暗，并改成半拍律动。

**卡点**：所有音效直接遍历 `TL.impacts / cuts / whooshes / risers / taps / dings / types / pings / blips / modem` 生成；段落编曲（哪一段是四拍、哪一段半拍、滚奏放在哪里）也按 `TL.acts` 的边界手写。

**侧链**：

```python
for k in kicks:  # 所有底鼓时刻
    i = int(k * SR); seg_ = np.arange(min(int(0.3*SR), N-i)) / SR
    duck[i:i+len(seg_)] = np.minimum(duck[i:i+len(seg_)], 1 - 0.55*np.exp(-seg_/0.09))
pad_bus *= duck[:, None]
```

**静默窗口**：10.5–12s 把 `pad_bus` 乘以 0.08，给三连重击留出空间。

**母带**：

```python
mix = dry + pad_bus*0.9 + rev*0.55
mix = hp(mix, 28)                                  # 切掉 28 Hz 以下的直流和超低频
mix /= np.percentile(np.abs(mix), 99.95)           # 按 99.95 分位归一，只让极少数瞬态进入饱和区
mix = np.tanh(mix * 1.1) / np.tanh(1.1)            # 温和的软削波
mix *= fade                                        # 开头 50ms 淡入，结尾 0.8s 淡出
mix *= 0.89 / np.max(np.abs(mix))                  # 峰值约 −1 dBFS
```

**验收方式**：我听不到声音，所以只能逐秒计算 RMS 来看动态曲线：主体约 −13 dB，冷开场 −31 至 −34 dB，41s 的停顿 −21 dB，结尾逐渐降到 −28 dB，峰值 0.89。形状符合设计的能量曲线。

### 5. 渲染与导出命令

```bash
# 0. 依赖
pip install imageio-ffmpeg numpy scipy pillow
bash fetch-fonts.sh

# 1. 音频
python3 soundtrack.py                                   # → soundtrack.wav（55.0s，48k，16bit）

# 2. 抽帧预览
node render.mjs stills 1.2,3.5,4.5,5.5                  # → out/stills/t_<时间>.jpg
python3 sheet.py out/sheet.jpg out/stills/t_1.20.jpg ...  # 拼成联系表，一次看十几帧

# 3. 全片帧：60fps，4 个 worker
node render.mjs video 60 4                              # → out/frames/f_00000.jpg … f_03299.jpg（用时 74s）

# 4. 母版（encode.sh）
ffmpeg -y -framerate 60 -i out/frames/f_%05d.jpg -i soundtrack.wav \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -tune film \
  -movflags +faststart -c:a aac -b:a 256k -shortest out/…-1080p60.mp4
# 结果：64.4 MB，视频约 9.1 Mbps，编码速度 0.39x 实时，约 2.3 分钟

# 5. 手机预览版（5.7 MB）
ffmpeg -i master.mp4 -vf scale=1280:720 -r 30 -c:v libx264 -preset medium -crf 24 \
  -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart …-720p-preview.mp4

# 6. 分享版：1080p60 两遍编码，控制在 30 MiB 以内（28.3 MB ≈ 27 MiB）
for p in 1 2; do ffmpeg -y -framerate 60 -i out/frames/f_%05d.jpg -i soundtrack.wav \
  -c:v libx264 -preset slow -b:v 3900k -maxrate 7000k -bufsize 8000k -pass $p -passlogfile out/x264 \
  -pix_fmt yuv420p -tune film \
  $( [ $p = 1 ] && echo "-an -f mp4 /dev/null" || echo "-c:a aac -b:a 192k -shortest -movflags +faststart out/…-share.mp4" ); done
```

**目标体积换算码率**：`视频码率 ≈ 目标字节 × 8 / 时长 − 音频码率`。本次按 28 MB 计算：28×8×1024/55 ≈ 4170 kbps，减去 192 kbps 音频，取 3900k。

**校验**：`ffmpeg -i out.mp4` 确认 `Duration: 00:00:55.00`、`h264 (High) yuv420p 1920x1080 60 fps`、`aac 48000 Hz stereo`。

### 6. 时间分配（墙钟，按文件时间戳还原）

| 阶段 | 起止 | 时长 | 备注 |
|---|---|---|---|
| 环境探查 + 读项目 + 下载字体 | 19:16–19:21 | ~5 min | 发现没有中文字体、没有可用的 ffmpeg |
| 时间轴 + lib + main + scenes | 19:21–19:29 | ~8 min | lib.js 405 行，scenes.js 413 行 |
| 截取脚本 + 第 1 轮联系表 + 修正 | 19:29–19:31 | ~2 min | 修了 2 处 |
| features.js + 第 2 轮联系表 + 修正 | 19:31–19:37 | ~6 min | 684 行，全片最大的文件 |
| vision.js + 第 3 轮联系表 + 透明度修正 | 19:37–19:39 | ~3 min | |
| soundtrack.py + 电平调整 | 19:39–19:41 | ~2 min | 合成只要 5.7 秒 |
| 全片渲染 | 19:41–19:42 | 74 s | 约 45 帧/秒 |
| 第 4 轮联系表检查 | 19:42 | ~1 min | |
| 母版编码 | 19:42–19:45 | ~2.5 min | `preset slow` 是瓶颈 |
| 预览版 + 两遍分享版 | 19:45–19:48 | ~3 min | |

**最耗时**：写场景代码（约 18 分钟，占 55%），其次是 x264 慢速编码。

**提速建议**：
- 迭代阶段用 `-preset veryfast -crf 23`，只有终版才用 `slow`。
- 分享版和母版不要各自从 3300 张 JPEG 重新编码。更快的做法：终版只做一次两遍编码直接出分享版；母版如果不需要发送，就不必生成。
- 组件库（手机、Dock、图标、代码卡片、合成器）这次已经写好，下次直接复用，可以省下 40% 以上的编码时间。
- 联系表检查比看视频快得多，保持"每写完一幕抽 15–28 帧"的节奏。

---

## 三、注意事项与踩过的坑

### 1. 可逐项打勾的检查清单

**开工前**
- [ ] 确认时长、分辨率、帧率、画幅（横屏 16:9 还是竖屏 9:16）、是否要配乐、是否要真人或旁白。
- [ ] 读项目的 README、设计规范、品牌资产（logo 矢量、主色、真实截图），列出核心卖点，并逐条确认"已实现"还是"规划中"。
- [ ] 从源码摘出代码镜头要用的真实 API / 常量名（本次：`AddUrl.normalize`、`DRAG_START_THRESHOLD = 16.dp`、`FOLDER_HOVER_MILLIS = 500L`、`EDGE_HOVER_MILLIS = 450L`、`WebViewPool.protect(…, KEEP_ALIVE)`、`IncomingIntentParser.parse`），以及对应的文件路径。
- [ ] 查环境：`fc-list | grep -i cjk`、`which ffmpeg && ffmpeg -encoders | grep 264`、`nproc`、`free -g`、Chromium / Playwright 路径、Python 的 numpy / scipy / PIL 是否存在。
- [ ] 查交付限制：单文件发送上限（本环境 30 MiB）、目标平台的码率和体积限制。
- [ ] 查输出目录是否被 `.gitignore` 忽略（`git check-ignore -v <path>`），决定源码交付方式。
- [ ] 先写 `timeline.js`（BPM、段落边界、所有卡点），再写任何画面代码。

**制作中**
- [ ] 所有动画只依赖 `t`；随机数一律用 `hash()`；禁止 `Date.now()`、`Math.random()`、CSS 动画。
- [ ] 每个 `ctx.save()` 之后设透明度一律用 `globalAlpha *=`，不要用 `=`。
- [ ] 组件参数写清单位（像素、dp，还是"平铺尺寸"），调用前确认语义。
- [ ] 同一套几何参数（窗口尺寸、手机位置）只定义一次，不要在两处硬编码。
- [ ] 每写完一幕，抽 15–28 帧拼联系表检查：文字是否重叠、是否出画、层级是否正确、淡出后是否有残影。
- [ ] 转场处单独检查前后各 0.05–0.1 秒的帧。
- [ ] 监听 `pageerror` 和 `console.error`，渲染日志中不允许有报错。
- [ ] 第三方品牌只用字母或几何示意，不用真实商标。
- [ ] 未实现的功能在画面上必须标注 ROADMAP / 规划中。

**导出前**
- [ ] **清空或换新帧目录**：`render.mjs` 遇到已存在的帧会跳过，改过代码后必须用新目录。
- [ ] 帧数 = 时长 × fps（本次 55 × 60 = 3300），抽查首帧、尾帧和中间帧。
- [ ] 音频时长与视频时长一致（55.0s），ffmpeg 加 `-shortest`。
- [ ] 逐秒测音频 RMS 和峰值：主体约 −13 dB，峰值 ≤ −1 dBFS，超过 0.85 的样本比例接近 0。
- [ ] 编码参数：`yuv420p` + `-movflags +faststart` + 偶数分辨率。

**交付前**
- [ ] 用 `ffmpeg -i` 核对时长、分辨率、帧率、编码、音轨。
- [ ] 准备三档成片：母版（本地保留）、1080p 分享版（小于上限）、720p 手机预览版。
- [ ] 抽一帧做封面（本次取 15.0s 的品牌定版 `f_00900.jpg`）。
- [ ] 源码打成 zip 一起交付（字体和帧不入包，附 `fetch-fonts.sh`）。
- [ ] 如实说明哪些没验证过（本次：没有真正"听"过音频，也没有以动态方式看过成片，只看过静帧联系表）。

### 2. 踩过的坑（全部是这次真实发生的）

**坑 1：容器里没有任何中文字体**
- 现象：`fc-list` 只列出 `NotoColorEmoji.ttf`。如果不处理，中文会渲染成方块，或者退回到某个不可预期的字体。
- 根因：云端容器是精简镜像，没有装 CJK 字体。
- 解决：用"老 UA"请求 Google Fonts CSS API，拿到整份 TTF 的直链（新 UA 返回的是按 unicode-range 分片的 woff2），直接下载：
  ```bash
  curl -sS -A "Mozilla/4.0" "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900" | grep -o 'https://[^)]*ttf'
  ```
  页面里用 `@font-face` 引用本地文件，截图前对每个字重执行 `document.fonts.load('900 20px SC', '玄览Aa1')`，再 `await document.fonts.ready`。
- 预防：开工第一步先跑 `fc-list | grep -iE "cjk|han|sc"`。字体文件较大（Noto Sans SC 每个字重约 10 MB），不要入库，写成 `fetch-fonts.sh`。

**坑 2：Playwright 自带的 ffmpeg 编不了 H.264**
- 现象：系统里没有 `ffmpeg`。`/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux` 能运行，但它是用 `--disable-everything` 编译的，只有 VP8 / webm 和 mjpeg。
- 根因：这个二进制只是给 Playwright 录屏用的。
- 解决：`pip install imageio-ffmpeg`，再用 `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"` 取路径。这是完整的静态 ffmpeg 7.0.2，带 libx264 和 aac。
- 预防：先运行 `ffmpeg -encoders | grep -E "264|aac"`。

**坑 3：Python 缺依赖**
- 现象：`ModuleNotFoundError: numpy`，之后又缺 PIL 和 scipy。
- 解决：`pip install numpy pillow scipy imageio-ffmpeg`（pypi 在代理白名单里，能直接装）。
- 预防：开工时一次性装好，不要等写完代码再发现。

**坑 4：时代窗口压住了下三分之一字幕**
- 现象：2004 年的镜头里，「标签页诞生」字幕压在白色窗口上，看不清。
- 根因：窗口 1136×639，中心 y = H/2 − 6，再加 5% 推镜，底边约 875px；字幕基线在 889px，上沿约 843px，两者重叠。
- 解决：窗口改为 1040×585，中心上移到 H/2 − 24。
- 预防：先画"安全区"草图，把字幕区、遮幅区、主体区的像素范围写成常量，所有布局都引用这些常量。

**坑 5：同一套几何参数在两处硬编码**
- 现象：改了时代窗口的尺寸之后，进化段的形变起点仍然是旧尺寸（1136×639），衔接处会跳一下。
- 根因：`drawEraWindow` 和 `sEvolve` 各自写死了数字。
- 解决：用 `sed` 把两处都改成 1040 / 585 / −24。
- 预防：跨场景衔接的几何量（窗口矩形、手机中心和缩放 `PC = {x:560, y:540, s:.98}`）都只定义一次。

**坑 6：飞行图标飞出画面**
- 现象：12.9s 时，favicon 从标签栏飞向网格的途中跑到了画面顶部外面。
- 根因：弧线偏移用了 `sin(πq) × −120`（向上），而起点标签栏本来就在画面上部。
- 解决：改成 `sin(πq) × +70`（向下拱）。
- 预防：飞行路径的最高点和最低点必须在安全区内，先在联系表里检查动画中段的帧。

**坑 7：品牌平铺图标巨大化**
- 现象：「打开方式」面板里的玄览图标和通知栏的图标都变成了巨大的深色方块。
- 根因：`brandMark(ctx, x, y, s, …, {tile: true})` 的 `s` 是**平铺边长**（108dp viewport 按 0.62 缩放后换算得到），我误以为它是符号大小，传了 150 / 70 / 80。
- 解决：分别改成 60 / 40 / 44。
- 预防：组件函数的参数单位写进注释；新组件先在一张测试帧里摆出几个尺寸看效果。

**坑 8：嵌套透明度被覆盖，淡出后留下"鬼影"**
- 现象：50.9s 时手机本该已经淡出（外层 `globalAlpha = 0`），画面左侧却还有倾斜的 PR 卡片和总结气泡。
- 根因：屏幕内部的子组件在 `save()` 后写的是 `globalAlpha = pk`（绝对值），把外层的 0 覆盖了。
- 解决：`features.js`、`vision.js`、`scenes.js` 中所有 `globalAlpha = ` 批量改为 `*=`。特殊情况单独处理：连续设置两次的，先存 `ga = ctx.globalAlpha` 再用 `ga * x`；扫描线原来是"设成 0.16 → 画 → 设回 1"，改成 `save / *= / restore`。
- 预防：规范写成**只允许 `*=`**，唯一的例外是每帧开头重置状态。可以用 `grep -n "globalAlpha = "` 做自检。

**坑 9：页码点重复高亮**
- 现象：外部文件段回到主屏时，两个页码点都亮着。
- 根因：为了显示第 2 页，我在 `homeScreen` 之后又手动调用了一次 `pageDots(x, 2, 1)`，而 `homeScreen` 内部已经按 `pageOffset: 0` 画过一次。
- 解决：图标都设成 `page: 1`，传入 `pageOffset: 1`，删掉额外的调用。
- 预防：状态只从一个入口传入，不要在外面"补画"。

**坑 10：HTML 元数据胶囊压到手机上**
- 现象：`<link rel="apple-touch-icon">` 这样的长胶囊右端伸进了手机的屏幕区域。
- 解决：字号从 16 降到 14，目标 x 从 60 改为 36。
- 预防：左侧解释区的可用宽度是 0 到 344px（手机左边缘），放进去的元素都要量宽度。

**坑 11：批量删除命令被安全检查拦截**
- 现象：`cd promo-video && ... rm -f out/stills/*` 被 Claude Code 的内置安全检查拒绝，整条命令都没有执行。
- 根因：`cd` 之后的相对通配符删除无法被静态解析，被判定为高风险。
- 解决：不删除文件，改为按时间戳命名输出（`t_16.60.jpg`），拼联系表时显式列出文件名。
- 预防：不要依赖通配符删除；每次渲染用带版本号的新目录（比如 `out/frames-v2`）。

**坑 12：前台 `sleep` 等待被禁止**
- 现象：`sleep 45; cat render.log` 被工具拒绝。
- 解决：长任务用 `run_in_background: true` 启动，等待用 `until grep -qE "rendered|Error" render.log; do sleep 2; done` 这样的条件循环（也放后台）。
- 预防：渲染和编码一律放后台，日志写到文件里，用条件循环等待。

**坑 13：帧缓存会复用旧帧（潜在的大坑）**
- 现象：这次没有触发，但 `render.mjs` 里有一行 `if (fs.existsSync(file)) continue;`，本意是支持断点续渲。
- 风险：修改代码后再渲染，旧帧会被原样复用，成片混入旧画面，而且很难察觉。这次能躲过去，只是因为全片只渲染了一次，而且是在所有修改完成之后。
- 预防：每次全片渲染使用新的帧目录，或者在命令里显式写 `--fresh` 来清空。结合坑 11，推荐用版本化目录。

**坑 14：音频母带过热**
- 现象：第一版逐秒 RMS 约 −5 到 −8 dB，超过 0.85 的样本占 0.76%，严重饱和。
- 根因：原始混音峰值远大于 1，直接进 `tanh(1.3x)`，等于把所有东西都压扁了。
- 解决：先除以 99.95 分位的幅值，再过 `tanh(1.1x)`。主体变成约 −13 dB，动态也回来了（冷开场 −31 dB，停顿 −21 dB）。
- 预防：母带必须先归一化再饱和；写一个逐秒 RMS 打印函数，对照能量曲线检查。

**坑 15：AI 无法真正"听"和"看动态"**
- 现象：我只能看静帧和数值，听不到声音，也看不到连续的运动。
- 影响：音色好不好听、节奏是否舒服、运动有没有抖动或卡顿，都没有被真正验证过。
- 应对：交付时如实说明，请用户戴耳机看一遍。
- 预防：可以把转场前后 ±6 帧逐帧拼成胶片条来检查运动连续性；音频可以画出频谱图和逐拍的包络图，与时间轴叠放检查。

**坑 16：母版超过发送上限**
- 现象：`SendUserFile` 返回 `61.4 MiB exceeds the 30 MiB upload limit`，母版没有发出去。
- 解决：1080p60 两遍编码 `-b:v 3900k`，得到 28.3 MB（27 MiB）；另出一版 720p30 `crf 24`，5.7 MB。
- 预防：开工时就确认交付上限，直接按目标体积计算码率；从一开始就规划"母版 / 分享版 / 预览版"三档。

**坑 17：ffmpeg 进度输出刷屏**
- 现象：`encode.sh` 带了 `-stats`，工具输出里塞满了几百行进度信息，浪费上下文。
- 预防：在自动化环境里使用 `-nostats -loglevel error`，或者 `2>&1 | tail -3`。

**坑 18：多个脚本里重复定义同名函数**
- 现象：开发中途用 `stub.js` 占位 `sFeatures / sVision`。接入 `features.js` 后，如果 stub 仍然在它之后加载，就会覆盖真实实现。
- 根因：多个经典 `<script>` 共享全局作用域，后加载的同名函数声明覆盖先前的。
- 解决：每接入一个真实文件，就同步从 stub 中删除对应函数，最后删掉 stub。
- 预防：使用 ES module 并显式 import，或者用一个场景注册表（`SCENES.features = …`），重复注册时直接报错。

**坑 19：HUD 场次标签写错**
- 现象：片尾遮幅重新出现时，HUD 显示的是 `SC.09 NEXT`。
- 解决：改成 `SC.12 FIN`。
- 预防：HUD 文案也从时间轴的段落表中读取，不要单独写 if-else。

**坑 20：素材目录被仓库忽略**
- 现象：用户的 `.gitignore` 里本来就写了 `/promo-video/`、`promo-*/`、`promo-studio/`。
- 结论：维护者不希望宣传片素材入库，因此这次没有提交，改为把源码打成 zip 交付。
- 预防：开工时先运行 `git check-ignore -v <目录>`。

**已经被规避、没有出现的问题（做法值得保留）**
- **音画同步**：没有用实时录屏，帧时间是计算出来的 `f / fps`，音频与帧来自同一个时间轴，全片 55.000 秒严格对齐，没有任何漂移。
- **帧率和时长**：3300 帧 ÷ 60 = 55.0 秒，音频 55.0 秒，加上 `-shortest`，时长不会多出或缺少。
- **字体加载竞态**：`window.ready` 等字体加载完成后才开始截图，第一帧就是正确的字体。
- **Playwright 模块路径**：全局安装的包 `require('playwright')` 可能找不到，用 `createRequire` 加上 `/opt/node22/lib/node_modules/playwright` 作为兜底。

---

## 四、可复用的模板

### 模板 A：代码视频制作流程

```
阶段 0  需求钉死（5 分钟）
  □ 时长 T、分辨率、fps、画幅、BPM（默认 120：拍 = 0.5s，小节 = 2s）
  □ 交付上限（体积）→ 预先算好分享版码率 = 目标MB × 8192 / T − 音频kbps
  □ 卖点清单：每条标注 [已实现 / 规划中]，并附上源码中的真实 API 名和文件路径
  □ 品牌资产：logo 矢量路径、主色、真实截图、应用名的来历

阶段 1  环境（5 分钟）
  □ fc-list | grep -iE "cjk|sc"      → 没有就下载 Noto Sans SC（Google Fonts，老 UA 拿 TTF）
  □ ffmpeg -encoders | grep 264       → 没有就 pip install imageio-ffmpeg
  □ pip install numpy scipy pillow
  □ Playwright + Chromium 路径；nproc（决定 worker 数）
  □ git check-ignore 输出目录

阶段 2  时间轴（10 分钟，最重要）
  □ 画能量曲线：开场(低) → 痛点(升) → 抽空重击 → 转折 → 释放 → 主体 → 愿景 → 定版
  □ 写 timeline.js（严格 JSON）：acts / segments / impacts / cuts / whooshes / risers / taps / dings / types
  □ 所有切点都落在节拍网格上

阶段 3  引擎（复用本项目的 lib.js / main.js / render.mjs / sheet.py）
  □ renderAt(t) 纯函数；hash 代替随机数；spr / pulse / E.* 缓动
  □ 后期：冲击(闪白+抖动+推近+色差+故障) / 小切点 / 暗角 / 颗粒 / 遮幅 HUD / 首尾淡入淡出
  □ 规范：globalAlpha 只用 *=；组件参数注明单位；几何常量只定义一次

阶段 4  逐幕制作（每幕：写 → 抽 15–28 帧 → 拼联系表 → 修）
  □ 冷开场 → 时代 / 痛点混剪 → 转折概念镜头 → 品牌亮相 → N 个功能段 → 愿景 → 定版
  □ 功能段统一版式：左边手机演示 + 解释层，右边编号/标题/英文/胶囊/代码卡片（逐字敲出 + 行高亮），底部目录条

阶段 5  音频（10 分钟）
  □ 总线：dry / wet(混响) / music(侧链)
  □ 编曲按 acts 分段；音效遍历 timeline；呼啸提前起音；静默窗口
  □ 母带：高通 28Hz → 按 99.95 分位归一 → tanh(1.1) → 淡入淡出 → 峰值 −1 dBFS
  □ 逐秒打印 RMS，对照能量曲线

阶段 6  渲染与导出
  □ 新帧目录（带版本号）→ node render.mjs video 60 4
  □ 转场处拼联系表做终检
  □ 迭代用 veryfast/crf23；终版：分享版两遍编码(目标码率) + 720p 预览版(crf24)；母版可选
  □ ffmpeg -i 核对时长、分辨率、fps、音轨

阶段 7  交付
  □ 分享版 + 预览版 + 封面帧 + 源码 zip（不含字体和帧）+ README
  □ 说明：哪些没有验证（音频听感 / 动态观感），哪些是规划中功能
  □ 提供改版选项：竖屏 9:16、15 秒版、改文案 / 配色 / 节奏
```

### 模板 B：给 AI 的开工提示词

```text
你要为项目「<项目名>」制作一支 <30–60> 秒的代码驱动宣传片，最终交付 MP4。

【项目与卖点】
- 仓库：<路径或 URL>。先读 README、设计规范（<文件>）、CHANGELOG、真实截图（<目录>）、logo 矢量（<文件>）。
- 核心卖点（按顺序）：<1…N>。每条都去源码里找真实的 API / 常量名和文件路径，用在代码镜头里。
- 规划中（未实现）的功能：<列表>。画面上必须标注「ROADMAP · 规划中」。
- 品牌：应用名 <名字>（来历：<出处>），主色 <色值>，logo 按 <文件> 1:1 复刻。

【规格】
- 1920×1080（或 1080×1920），60 fps，<时长> 秒，BPM <120>，所有切点落在节拍网格上。
- 交付上限 <30 MiB>：需要三档成片——分享版（两遍编码，按目标体积计算码率）、720p 预览版、本地母版。

【叙事】
冷开场独白 → 行业/时代痛点混剪（逐拍切换，风格各不相同）→ 三连重击字幕（音乐抽空）→ 概念转折镜头（旧形态直接形变成新形态）
→ 品牌亮相（冲击 + 扫光 + 粒子）→ N 个功能段（左边手机/界面交互演示，右边代码逐字敲出并高亮当前行，底部目录条）
→ 愿景（标注 ROADMAP）→ 定版（logo、口号、网址、许可证），首尾画幅呼应。

【技术路线（必须遵守）】
1. Canvas 2D 页面暴露纯函数 renderAt(t)：禁止 Date.now / Math.random / CSS 动画；随机数用 hash()。
2. timeline.js 写严格 JSON（window.TL = {...}），画面和音频共用：impacts / cuts / whooshes / risers / taps / dings / types。
3. Playwright + Chromium 逐帧 toDataURL('image/jpeg', .94)，4 个 worker 并行；每次全片渲染使用新的帧目录。
4. 音频用 numpy/scipy 程序化合成：dry / wet / music 三条总线，底鼓侧链，母带「按分位归一 → tanh(1.1) → −1 dBFS」，逐秒打印 RMS 自检。
5. ffmpeg 用 imageio-ffmpeg 自带的版本：libx264 yuv420p +faststart，aac；加 -nostats。
6. 开工先检查：中文字体（没有就下载 Noto Sans SC TTF）、ffmpeg 编码器、numpy / scipy / pillow、输出目录是否被 gitignore。

【质量规范】
- globalAlpha 在 save() 之后只能用 *=；组件参数注明单位；跨场景的几何常量只定义一次。
- 每写完一幕，抽 15–28 帧拼联系表自检：文字重叠、出画、淡出残影、层级错误；转场前后 ±0.1 秒单独检查。
- 第三方品牌只用字母或几何示意；未实现的功能必须标注规划中。
- 长任务放后台并用条件循环等待，不要前台 sleep；不要用通配符 rm。

【交付】
分享版 MP4、720p 预览版、封面帧、源码 zip（附 fetch-fonts.sh 和 README），再如实说明哪些没有验证（音频听感、动态观感）。
最后提供改版选项：竖屏 9:16 / 15 秒版 / 修改文案、配色或节奏。
```

---

## 附：本次产物清单

| 文件 | 规格 | 体积 |
|---|---|---|
| `out/XuanLan-PocketWebShell-promo-1080p60.mp4` | 母版，crf 17，slow，AAC 256k | 64.4 MB（超过 30 MiB 上限，未发送） |
| `out/XuanLan-PocketWebShell-promo-1080p60-share.mp4` | 两遍编码 3900k，AAC 192k | 28.3 MB |
| `out/XuanLan-PocketWebShell-promo-720p-preview.mp4` | 720p30，crf 24，AAC 160k | 5.7 MB |
| `out/poster.jpg` | 15.0s 品牌定版帧 | 0.27 MB |
| `out/promo-video-source.zip` | 源码（不含字体和帧） | 56 KB |
| `soundtrack.wav` | 48 kHz 16bit 立体声，55.0s | 10.6 MB |
| 代码规模 | features 684 / scenes 413 / lib 405 / soundtrack 404 / vision 197 / main 126 / render 62 / timeline 32 行 | 共约 2335 行 |
