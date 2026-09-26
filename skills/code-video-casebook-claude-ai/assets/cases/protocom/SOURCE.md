# protocom · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show protocom <路径>`；还原成真实目录：`python3 scripts/casebook.py copy protocom <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `promo/.gitignore` | 4 | 30 |
| 2 | `promo/METHOD.md` | 205 | 39 |
| 3 | `promo/README.md` | 40 | 249 |
| 4 | `promo/audio/synth.py` | 543 | 294 |
| 5 | `promo/index.html` | 29 | 842 |
| 6 | `promo/package-lock.json` | 114 | 876 |
| 7 | `promo/package.json` | 24 | 995 |
| 8 | `promo/preview.mjs` | 45 | 1024 |
| 9 | `promo/render.mjs` | 94 | 1074 |
| 10 | `promo/sheet.py` | 7 | 1173 |
| 11 | `promo/src/act1.js` | 364 | 1185 |
| 12 | `promo/src/act2.js` | 340 | 1554 |
| 13 | `promo/src/act3.js` | 379 | 1899 |
| 14 | `promo/src/act4.js` | 337 | 2283 |
| 15 | `promo/src/core.js` | 279 | 2625 |
| 16 | `promo/src/data.js` | 84 | 2909 |
| 17 | `promo/src/main.js` | 78 | 2998 |
| 18 | `promo/src/post.js` | 101 | 3081 |

---

### 1/18 · `promo/.gitignore`
<!-- casebook-file {"path": "promo/.gitignore", "lines": 4, "final_newline": true, "sha256": "459ea00e254165e0b46d248239f3058980576f43dcae574b59cb8d03e5dce36b", "original_sha256": "459ea00e254165e0b46d248239f3058980576f43dcae574b59cb8d03e5dce36b"} -->
```
node_modules/
out/segments/
out/*.log
audio/*.wav
```

### 2/18 · `promo/METHOD.md`
<!-- casebook-file {"path": "promo/METHOD.md", "lines": 205, "final_newline": true, "sha256": "64ffef1a0798f281793a12696e88f149280f0109e8e1d69777c95f415ff53b17", "original_sha256": "64ffef1a0798f281793a12696e88f149280f0109e8e1d69777c95f415ff53b17"} -->
````markdown
# 用代码做宣传片：方法、经验与踩坑全记录

> 以 protocom 宣传片（80 秒 · 1080p60 · 带配乐）为样本整理。源码在 `promo/`。

---

## 一、核心方法

### 1. 总体思路：把视频当成一个纯函数

整条片子只有一个入口：`renderFrame(t)`。给它一个时间点（秒），它就画出那一帧，别的什么都不依赖。

- **没有状态、没有随机、不看真实时钟。** 同一个 `t` 在任何机器、任何进程里画出来都一模一样。
- 所以可以**任意跳到某一帧预览**，也可以**把时间轴切成几段、多进程并行渲染**，最后直接拼接。
- 所有"随机"都来自哈希函数 `hash(i, seed, ...)`，而不是 `Math.random()`。

### 2. 技术栈

| 层 | 用什么 | 作用 |
|---|---|---|
| 画面 | Canvas 2D | 文字、线条、图片、卡片、3D 投影（手写的） |
| 后期 | WebGL 着色器（一次全屏 pass） | 色差、径向/方向模糊、故障切片、反相、镜像、扫描线、暗角、颗粒、辉光、闪白 |
| 驱动 | Playwright 控制的无头 Chromium | 逐帧调用 `renderFrame(t)`，把画布导出成 JPEG |
| 编码 | ffmpeg（`imageio-ffmpeg` 自带的静态版） | JPEG 管道进 → x264；分段拼接后混入音频 |
| 音频 | Python + numpy + scipy | 所有乐器、音效、混响全部从零合成 |
| 素材 | `@fontsource/*` 字体、`@lobehub/icons-static-svg` AI 图标、截图里抠的头像 | 全部放在本地，渲染时不走网络 |

### 3. 流水线

```
data.js（事实）──┐
                 ├─> act1..4.js 画每一帧 ─> post.js 后期 ─> JPEG ─> ffmpeg 分段
时间表（拍点） ──┤                                                    │
                 └─> synth.py 合成音乐和音效 ────────────────────────> 混流 → mp4
```

1. **先定节拍，再写画面。** 120 BPM，一拍 0.5 秒，一小节 2 秒。所有镜头的起止时间都落在拍点或半拍上。
2. **分幕写代码。** 每一幕一个文件，每幕内部用 `if (t < x)` 切成若干镜头；镜头内部用 `prog(t, a, b)` 把绝对时间换成 0→1 的进度，再套缓动函数。
3. **画面和音频用同一张时间表。** 音频脚本里的每个 `add(音效, 时间)` 都照抄画面代码里的时间常数，所以天然卡点。
4. **静帧预览 → 拼图检查 → 修 → 再预览**，最后才全片渲染。

### 4. 叙事结构：风格变化本身就是叙事

| 幕 | 风格 | 情绪 | 叙事功能 |
|---|---|---|---|
| 冷开场 | 黑底终端 | 安静 | 抛出母题：一个想法 |
| 手绘时代 | 铅笔、纸、等轴立体 | 温暖但受阻 | 建立矛盾：想法和现实之间隔着一座山 |
| AI 爆发 | 深色、霓虹、故障 | 爆炸、加速 | 矛盾被打破；随后反问什么才稀缺 |
| 我们 | 暖白纸 + 精确 UI | 自信、可信 | 给证据：人、数据、产品、原则 |
| 升维 | 星空、线框、4D | 升华 | 把"我们"抬到"时代"的高度，收品牌 |

手绘代表人，霓虹代表机器，暖白纸加精确 UI 代表人和 AI 的结合，也就是社团自己的样子。**风格往哪边变，观众就往哪边被带。**

---

## 二、以这支片子为模板整理的经验

### 1. 节奏与剪辑

- **先有 BPM，后有镜头。** 120 BPM 的好处是一拍正好 0.5 秒，心算方便。
- **镜头长度要有变化，才有"快剪"的感觉。** 成员混剪先是 4 张 × 0.5 秒（按拍），再是 7 张 × 0.25 秒（八分音符），最后停在一张 2 秒多的全员目录上。**越来越快，然后突然停住**，比匀速快剪有力得多。
- **高潮前一定要留白。** 19.5–20 秒全黑，只有一个小小的"2022"，然后才砸下去。没有这半秒静默，后面的爆发就不响。
- **一个词占一拍。** "注意力 / 判断力 / 品味"每个 0.5 秒、明暗交替，比一句话慢慢打出来冲击力强得多。
- **转场尽量做成"匹配剪辑"**：让上一个镜头的某个元素变成下一个镜头的开头。
  - 终端光标放大成一张纸
  - 被选中的"山"碎成 token
  - 拉片倒带停在最初的灯泡上
  - 头像行里的第一个头像放大，直接变成第一张成员卡
  - 超立方体塌缩成一个点，点里长出 Logo

### 2. 画面语言

- **每个"冲击点"都要叠 3 层以上反馈**：缩放回弹（1.5→1.0，expo 缓出）+ 径向模糊 + 色差尖峰 + 一帧轻微闪白，再配上音效。单独用任何一种都显得软。
- **缓动基本只用 expo out**：出现快、收尾慢，是 MG 最标志的手感。进入画面用 out，离开或吸入用 in。
- **逐字出现 = 上移 + 去模糊 + 淡入 + 错开**，每个字之间错开 0.03–0.06 秒。这一招把普通文字变成"动效文字"。
- **手绘感的关键是"抖"**：线条的随机偏移每 1/12 秒换一次种子，也就是 12 帧抽帧，模拟逐帧手绘。线再画两遍、稍微错开，末端出头，就有铅笔味。
- **HUD 小字是廉价的高级感**：四角的等宽小字（`MODEL 03 / 08`、时间码、编号）加角标线，立刻有"系统感"。
- **镜像和反相要当作节奏点用，不要当作风格**：只闪几帧（logo 段反拍上 0.06 秒的镜像）、或者每个镜头换一次（原则段明暗交替）。一直开着就成噪音了。
- **把真实界面搬进片子里。** 成员卡、排行榜、产品卡都照着 protocom 的真实页面重画，观众会觉得"这是真的在跑的东西"。这就是可信度。

### 3. 内容与说服力

- **真实数据比漂亮形容词有力一百倍。** "76.0B Tokens · 4 位公开参与者"、真实的 PR 标题、真实的成员 handle，全部可以查证。所有事实集中放在 `data.js`，一个数都不编。
- **用"问题"制造转折。** "当代码不再稀缺——那么，什么才是稀缺的？"让片子从"AI 很猛"转到"我们有什么"。
- **结尾要升一个维度，而不只是放 Logo。** 从"一个学生就是一支团队"到"一群学生就是一个时代"，再落到"下一个故事，由你书写"。结尾要落在观众身上，而不是落在自己身上。
- **给观众留一个空位。** 成员目录的第 12 格"下一个是你"，超立方体上 5 个没人认领的发光顶点，片尾的 `join protocom --as @你`。同一个邀请重复出现三次。

### 4. 声音

- **声音至少占片子一半的冲击力**，而且完全可以用代码合成：
  - 底鼓：正弦波从 160Hz 快速扫到 45Hz，指数衰减，加一点高频"咔"
  - 冲击：底鼓 + 超低频下扫 + 高通噪声镲片 + 混响
  - 嗖声：带通噪声，中心频率随时间上扫
  - 上升音（riser）：扫频正弦 + 嗖声，音量按平方增长
  - 打字、快门、铅笔摩擦：短噪声加不同的带通滤波
- **侧链压缩**（底鼓一响，贝斯和和弦就被压低）是电子乐"泵感"的来源。用一个全局增益包络就能实现。
- **每个画面动作都要有声音**：砖块落地有闷响，打字有键声，logo 砸入有冲击，成员快切有快门声。

### 5. 工程

- **静帧预览是主力工具。** `node preview.mjs 目录 5.9 22.2 45.9` 导出几张图，再拼成一张大图一次看完。比渲染整片快两个数量级。
- **全片渲染后，从成片里再抽转场帧检查一遍。** 有些问题只在真实时间点才出现。
- **按时间段并行**：4 个 Chromium 进程各渲染四分之一，每个直接管道进一个 ffmpeg，最后 `concat` 无损拼接。80 秒 60fps 大约 20–25 分钟。
- **渲染母版和交付版分开。** 颗粒让码率暴涨：CRF 15 时 80 秒就有 775MB，CRF 21 降到 45MB，CRF 24 只有 27MB，肉眼几乎看不出区别。

---

## 三、踩过的坑

### 渲染环境

| 坑 | 现象 | 原因 | 解决 |
|---|---|---|---|
| 截图极慢 | 一帧截图要 41 秒 | 无头 Chromium 用 SwiftShader 做 2D 画布的 GPU 光栅化 | 启动参数加 `--disable-accelerated-2d-canvas --disable-gpu-rasterization`，2D 走 CPU（快得多），WebGL 仍走 SwiftShader。之后一帧 150–500ms |
| WebGL 不可用 | 后期着色器是黑的 | 无头环境默认拒绝软件 GL | 加 `--enable-unsafe-swiftshader --use-angle=swiftshader --ignore-gpu-blocklist` |
| 页面没准备好就截图 | `renderFrame is not a function` | 模块顶层 `await` 还没跑完，`window.__ready` 此时是 undefined | 先 `waitForFunction(() => window.__ready)`，再 `await` 它 |
| 导出方式 | `page.screenshot` 较慢 | 走的是合成器截图 | 在页面里 `canvas.toDataURL('image/jpeg', 0.96)` 直接返回，WebGL 上下文要开 `preserveDrawingBuffer: true` |

### 字体

| 坑 | 原因 | 解决 |
|---|---|---|
| 中文显示成后备字体 | fontsource 的中文字体按 unicode-range 切成上百个小文件，canvas 用到哪个字才去加载哪一片，第一次画的时候还没下完 | 渲染前**把整条时间轴粗扫两三遍**（每 1/20 秒画一次），记下所有"字体 + 文字"组合，逐个 `document.fonts.load()`，全部完成后才开始 |
| 缩略图里是后备字体 | 缩略图在字体没加载完时就被缓存了 | 字体预加载完成后清空缩略图缓存 |
| "——"画成了"一一" | 手写字体（Long Cang）里破折号字形像两个"一" | 手写体里不用破折号，改成逗号 |
| 系统里没有中文字体 | 容器只有文泉驿 | 通过 npm 装 fontsource，全部本地化 |

### 画布与坐标

| 坑 | 现象 | 原因 | 解决 |
|---|---|---|---|
| 拉片的缩略图全是白的 | 胶片上一片空白 | 缩略图用 `ctx.scale(0.25)` 缩小，但 `drawRaw` 和 `fillBg` 里调用了 `setTransform(1,0,0,1,0,0)`，把缩放清掉了 | `drawRaw` 接收一个 `scale` 参数；`fillBg` 不再重置变换，改成画一个足够大的矩形 |
| 砖块上的字跟砖块错位 | 镜头推近时文字不跟着动 | 贴图用了 `setTransform`（绝对变换），丢掉了外层的镜头推拉 | 改用 `ctx.transform`（相对变换） |
| 分辨率低的头像放大后很糊 | 原图只有约 38 像素 | 只能从成员列表截图里抠 | 大尺寸时叠一层细网点和明暗渐变，把"糊"变成"印刷质感"。**根本解决办法是要原图** |
| 亮色头像变成白色圆斑 | 星座段看不出是谁 | 辉光（bloom）阈值会把浅色图片也当成光源 | 这一段把 bloom 从 0.55 降到 0.1。**辉光只给真正该发光的东西** |
| 用户上传的图不在磁盘上 | 后发的 10 张截图没有文件 | 对话中途发的图只进了上下文，没有落地 | 能用的头像都从第一张成员列表里抠，数据从截图里读 |

### 构图

| 坑 | 解决 |
|---|---|
| 3D 场景太小、太远，地面线太斜 | 焦距从 1650 调到 2150，偏航角减小，灯泡和旗子往中间收 |
| 提示框挡住被选中的山 | 仰拍时整体上移（`cyOff` 从 +70 过渡到 −75），提示框下移 |
| 第三句文案超出屏幕右边 | 不写死 x 坐标，先量三句的宽度，再整体居中排布 |
| 超立方体顶点转出画面 | 缩小尺寸，中心上移 |
| 星座节点贴到画面顶端 | 散开的范围改小 |
| Logo 周围的头像环压住字 | 改成扁椭圆轨道，Logo 整体上移 |
| 匹配剪辑没对上 | 放大头像的终点要等于下一镜头**第 0 帧**的位置（下一镜头带入场偏移，所以是 680 而不是 560） |
| 产品卡里的迷你图压住描述文字 | 直接删掉，一张卡只讲一件事 |

### 音频

| 坑 | 解决 |
|---|---|
| 两段数组长度差 1，无法相加 | 采样数取整误差，相加前取 `min(len)` 截齐 |
| 侧链不起作用 | 被压的轨道必须在底鼓之后 `add`，因为压缩包络是底鼓写进去的 |
| **我没法亲耳听** | 只能检查每 2 秒的 RMS 响度曲线，确认动态起伏符合设计。听感必须交给人来确认 |

### 交付

| 坑 | 解决 |
|---|---|
| 成片 775MB | 每帧随机颗粒几乎无法压缩。分段直接用 CRF 21 编码（45MB） |
| 超过 30MB 的上传限制 | 另外压一份 CRF 24 的分享版（27MB）专门用来发送 |
| 成片没进 git | 仓库根目录的 `.gitignore` 忽略了 `out/`，需要 `git add -f` |
| 缩略图、时间码的时间点 | 缩略图要取"画完了"的时间点（灯泡取 5.95 秒，而不是还在画的 4.9 秒） |

### 内容准确性

- **不给没核实过的事实。** 本来想在每个 AI logo 下标年份，但各家发布时间说不准，就只写"2022 → 2026"。
- **社团名没定。** 落地页写的是"此处应有名字"，我从成员页的"加入了 protocom"推断用 protocom，并把它做成一个常量方便替换。
- **真名、商标**：档案里的真名、各家的 logo，内部传播没问题，公开投放前要确认。

---

## 四、做类似视频最重要的思路

1. **先找母题，再找画面。** 这支片子的母题是"一个想法"。它开头出现，被山挡住，被 AI 解放，在拉片中被找回，最后变成"下一个故事"。有母题，60 个镜头才是一个故事，而不是 60 张 PPT。

2. **冲突 → 转折 → 证据 → 升华。** 宣传片也需要戏剧结构：先让观众感到阻力（那座山），再给出改变（AI），然后问一个更深的问题（什么才稀缺），用真实证据回答（人、数据、产品、原则），最后抬高维度收尾。

3. **风格变化要有意义。** 从手绘到霓虹再到暖白纸加精确 UI，每次切换都对应叙事里的一个转折。风格不是换皮，是在讲故事。

4. **可信度来自真实。** 对投资人最有杀伤力的不是"颠覆""赋能"，而是 76.0B、246 天、PR #170 这种可以查证的细节。宁可少说，不要编。

5. **节奏大于特效。** 同样的画面，卡在拍子上就高级，不卡就廉价。先把时间表写对，再谈画面。高潮前的静默、越来越快的快剪、最后的急停，这些都比任何特效更重要。

6. **每个冲击点叠多层反馈，但平时要克制。** 冲击的时候缩放、模糊、色差、闪白、声音一起上；不冲击的时候画面要干净、留白要多。对比才有力量。

7. **确定性渲染 + 静帧迭代。** 代码视频最大的优势是能精确跳到任何一帧。把"写 → 渲染几张静帧 → 拼图看 → 改"的循环压到一分钟以内，质量是迭代出来的。

8. **结尾要落在观众身上。** "我们很牛"不如"下一个是你"。给观众留一个位置，片子才会被转发。

9. **人来做判断。** 听感、真名、商标、社团名，这些代码替代不了。这也正好是片子本身的主张：判断力本身，就是资产。

---

## 附：复用这套模板的最小步骤

1. 改 `src/data.js`：成员、数据、产品、原则、品牌名
2. 换 `assets/avatars/` 里的头像（尽量用原图）
3. 在 act 文件里调文案和时间点；如果改了时间，同步改 `audio/synth.py` 里对应的时间
4. 用 `node preview.mjs` 看关键帧，满意后再全片渲染
5. `python3 audio/synth.py audio/music.wav` → `node render.mjs 4 60 out/xxx.mp4`
6. 交付前另压一份小体积的分享版
````

### 3/18 · `promo/README.md`
<!-- casebook-file {"path": "promo/README.md", "lines": 40, "final_newline": true, "sha256": "96d61945777c200944eb7599cddac238350a96b5e57507ea145974d303c10bf1", "original_sha256": "96d61945777c200944eb7599cddac238350a96b5e57507ea145974d303c10bf1"} -->
````markdown
# protocom · 宣传片

80 秒、1080p60 的社团宣传片，整条片子都是代码生成的：画面用 Canvas 2D 加一层 WebGL 后期，逐帧渲染；配乐和音效用 Python 从零合成，所有卡点都对着同一张时间表。

## 叙事结构（120 BPM，每拍 0.5s）

| 时间 | 段落 | 视觉风格 | 内容 |
|---|---|---|---|
| 0–4s | 冷开场 | 黑底终端 | `> 每一个了不起的东西，都始于一个想法。` 光标放大成一张纸 |
| 4–20s | 手绘时代 | 铅笔线稿（12fps 抖线）、等轴立体 | 灯泡（想法）→ 六块积木垒成一座山（学三年编程 / 写十万行代码 / 凑齐团队…）→ 镜头绕到山脚仰拍 → AI 选框框住整座山，输入「把它做出来。」 |
| 19.5–20s | 静默 | 纯黑 | 2022 |
| 20–38s | AI 爆发 | 深色霓虹、反相闪白、扫描线 | 山碎成 token →「然后，AI 来了。」→ 8 个模型 Logo 逐拍砸入（镜像抽帧）→ 32 格工具墙 → 冲进画面 → 95%（YC W25）→ Karpathy vibe coding → 「当代码不再稀缺——」→ **拉片**倒带回到最初的灯泡 →「那么，什么才是稀缺的？」→ 注意力 / 判断力 / 品味（深浅反转） |
| 38–62s | 我们 | 暖白纸 × 精确 UI（protocom 的界面语言） | 于是在华科 → 11 位成员混剪（4 张大卡按拍切 + 7 张八分音符快切，明暗与左右交替）→ 成员目录，末格是「下一个是你」→ **76.0B Tokens** 公开排行榜 → 「不是 PPT 上的项目，是正在运行的系统」：产品 bento 加 obelisk 的真实 PR 动态 → 共建手册六条（上下分屏对向滑入） |
| 62–80s | 升维 | 星空、线框 | 成员连成星座 →「靠交付赢得信任 · 靠信任换取速度 · 靠速度做出真东西」→ 2D→3D→4D 超立方体 →「一个学生，就是一支团队。一群学生，就是一个时代。」→ 收缩成指纹标志 **protocom** →「下一个故事，由你书写。」 |

画面上的每一条数据（成员、Token、PR、手册原句）都来自 protocom 成员页、Tokens 排行榜和《共建手册 v0.1》，见 `src/data.js`。

## 渲染

```bash
cd promo
npm install                       # 字体（@fontsource）与 AI 图标（@lobehub/icons-static-svg）
pip install numpy scipy imageio-ffmpeg
python3 audio/synth.py audio/music.wav
node render.mjs 4 60 out/protocom-promo.mp4   # 4 个 Chromium 进程并行，约 10 分钟
node preview.mjs out/stills 5.9 22.2 45.9    # 按时间点导出静帧
```

实时预览：在 `promo/` 下起一个静态服务器，打开 `index.html?play=0`（从第 N 秒开始播）或 `index.html?t=22.2`（只看某一帧）。

## 文件

- `src/core.js`：缓动、确定性噪声、文字排版、铅笔线条、3D 投影
- `src/post.js`：WebGL 后期（色差、径向/方向模糊、故障切片、反相、镜像、扫描线、暗角、胶片颗粒、辉光）
- `src/act1.js` … `src/act4.js`：四幕
- `src/data.js`：片中出现的全部事实数据
- `audio/synth.py`：配乐与音效
- `render.mjs` / `preview.mjs`：逐帧渲染与静帧预览

改社团名只需要改 `src/data.js` 里的 `BRAND`，片尾的终端命令在 `audio/synth.py` 里也要同步改。
````

### 4/18 · `promo/audio/synth.py`
<!-- casebook-file {"path": "promo/audio/synth.py", "lines": 543, "final_newline": true, "sha256": "e528213094091fb68279e5438dad466f27fb008983393e2fe36b7e32d788839b", "original_sha256": "e528213094091fb68279e5438dad466f27fb008983393e2fe36b7e32d788839b"} -->
```python
"""Soundtrack for the protocom promo — synthesized from scratch, locked to the video's cue sheet.

120 BPM (beat = 0.5 s). A minor. Every hit, whoosh and keystroke below is placed at the
same timestamps the renderer uses, so picture and sound cut together on the frame.
"""
import numpy as np
from scipy import signal
import wave, sys

SR = 44100
DUR = 80.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N); R = np.zeros(N)          # dry bus
RL = np.zeros(N); RR = np.zeros(N)        # reverb send
DUCK = np.ones(N)                          # sidechain envelope (kick-driven)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def at(t):
    return int(round(t * SR))


def add(x, t, gain=1.0, pan=0.0, rev=0.0, duck=False):
    i = at(t)
    if i >= N:
        return
    x = x[: N - i]
    if duck:
        x = x * DUCK[i:i + len(x)]
    gl = gain * np.sqrt(0.5 * (1 - pan)); gr = gain * np.sqrt(0.5 * (1 + pan))
    L[i:i + len(x)] += x * gl; R[i:i + len(x)] += x * gr
    if rev:
        RL[i:i + len(x)] += x * gl * rev; RR[i:i + len(x)] += x * gr * rev


def env(n, a=0.005, d=0.2, curve=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d) ** curve
    return e


def noise(n):
    return rng.standard_normal(n)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype='band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    sos = signal.butter(order, min(f, SR / 2 - 100), btype='low', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def hp(x, f, order=2):
    sos = signal.butter(order, f, btype='high', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def sweep_lp(x, f0, f1, block=512):
    """Time-varying low-pass (exponential cutoff sweep)."""
    out = np.zeros_like(x); zi = None
    nb = int(np.ceil(len(x) / block))
    for b in range(nb):
        f = f0 * (f1 / f0) ** (b / max(1, nb - 1))
        sos = signal.butter(2, min(f, SR / 2 - 200), btype='low', fs=SR, output='sos')
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(sos, seg, zi=zi)
        out[b * block:b * block + len(seg)] = y
    return out


def saw(f, n, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * f + phase) % 1) - 1


# ---------------------------------------------------------------- instruments
def kick(strength=1.0, dur=0.45):
    n = int(SR * dur); t = np.arange(n) / SR
    f = 45 + 120 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.16)
    click = hp(noise(n), 2000) * np.exp(-t / 0.004) * 0.4
    return np.tanh((body + click) * 1.6 * strength)


def clap(dur=0.35):
    n = int(SR * dur); t = np.arange(n) / SR
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        e += (t >= o) * np.exp(-np.maximum(0, t - o) / (0.006 if k < 2 else 0.09))
    return bp(noise(n), 900, 5200) * e * 0.9


def snare(dur=0.25):
    n = int(SR * dur); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05)
    return (bp(noise(n), 1500, 8000) * np.exp(-t / 0.07) * 0.8 + tone * 0.5)


def hat(open_=False):
    d = 0.22 if open_ else 0.035
    n = int(SR * (d * 4)); t = np.arange(n) / SR
    return hp(noise(n), 7500, 4) * np.exp(-t / d) * 0.55


def crash(dur=2.4):
    n = int(SR * dur); t = np.arange(n) / SR
    return hp(noise(n), 3500, 2) * np.exp(-t / 0.7) * 0.5


def sub_boom(dur=2.2, f0=70, f1=32):
    n = int(SR * dur); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.8)


def impact(big=1.0):
    n = int(SR * 3.0); t = np.arange(n) / SR
    x = np.zeros(n)
    k = kick(1.3); x[:len(k)] += k
    s = sub_boom(); x[:len(s)] += s * 0.9
    c = crash(3.0); x[:len(c)] += c * 0.8
    nb = lp(noise(n), 1200) * np.exp(-t / 0.35) * 0.6
    return np.tanh(x * big + nb * big)


def whoosh(dur=0.6, lo=300, hi=6000, peak=0.6):
    n = int(SR * dur); t = np.arange(n) / SR
    x = noise(n)
    out = np.zeros(n); zi = None; block = 256; nb = n // block + 1
    for b in range(nb):
        u = b / nb
        c = lo * (hi / lo) ** u
        sos = signal.butter(2, [c * 0.6, min(c * 1.6, SR / 2 - 100)], btype='band', fs=SR, output='sos')
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(sos, seg, zi=zi)
        out[b * block:b * block + len(seg)] = y
    e = np.where(t < dur * peak, (t / (dur * peak)) ** 2, np.exp(-(t - dur * peak) / (dur * 0.15)))
    return out * e * 2.2


def riser(dur, f0=200, f1=2400):
    n = int(SR * dur); t = np.arange(n) / SR
    u = t / dur
    f = f0 * (f1 / f0) ** u
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25 + saw(1, n) * 0
    nz = whoosh(dur, 200, 9000, 0.98)[:n] * 0.6
    return (tone * u ** 2 + nz) * (u ** 1.5)


def reverse_swell(dur=0.6):
    c = crash(dur * 1.5)[: int(SR * dur)]
    return c[::-1] * 1.2


def click(freq=3000, dur=0.012, amp=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    return bp(noise(n), freq * 0.6, min(freq * 1.8, 20000)) * np.exp(-t / (dur / 4)) * amp


def key_click():
    x = click(2500 + rng.random() * 2500, 0.03, 0.8)
    y = np.concatenate([np.zeros(int(SR * 0.012)), click(900, 0.018, 0.35)])
    m = min(len(x), len(y))
    x[:m] += y[:m]
    return x


def blip(freq, dur=0.09, amp=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)) * np.exp(-t / (dur / 3)) * amp


def pluck(freq, dur=1.6, bright=1.0):
    n = int(SR * dur); t = np.arange(n) / SR
    x = np.zeros(n)
    for h, a in [(1, 1), (2, 0.5 * bright), (3, 0.25 * bright), (4, 0.12 * bright), (5, 0.06 * bright)]:
        x += a * np.sin(2 * np.pi * freq * h * t + h) * np.exp(-t * (1.8 + h * 1.1))
    x += 0.2 * np.sin(2 * np.pi * freq * 2.005 * t) * np.exp(-t * 3)
    return x * np.minimum(1, t / 0.003) * 0.4


def supersaw(notes, dur, cutoff=3000, detune=0.22, voices=6):
    n = int(SR * dur)
    x = np.zeros(n)
    for m in notes:
        f = mtof(m)
        for v in range(voices):
            d = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune
            x += saw(f * 2 ** (d / 12), n, rng.random())
    x /= (len(notes) * voices) ** 0.5 * 2.2
    x = lp(x, cutoff)
    t = np.arange(n) / SR
    a = np.minimum(1, t / 0.02) * np.minimum(1, (dur - t) / 0.05)
    return x * np.clip(a, 0, 1)


def pad(notes, dur, cutoff=1400):
    n = int(SR * dur); t = np.arange(n) / SR
    x = supersaw(notes, dur, cutoff, 0.12, 5)
    a = np.minimum(1, t / 0.6) * np.clip((dur - t) / 0.8, 0, 1)
    return x * a


def bass_note(m, dur, cutoff=420):
    n = int(SR * dur); t = np.arange(n) / SR
    f = mtof(m)
    x = saw(f, n) * 0.6 + np.sin(2 * np.pi * f / 2 * t) * 0.9
    x = lp(x, cutoff)
    return np.tanh(x * 1.4) * np.minimum(1, t / 0.005) * np.clip((dur - t) / 0.02, 0, 1)


def scratch(dur, amp=0.35):
    """Pencil on paper."""
    n = int(SR * dur); t = np.arange(n) / SR
    x = bp(noise(n), 1800, 7000)
    mod = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * (7 + 4 * np.sin(t * 3)) * t)) + 0.3 * rng.random(n) * 0
    e = np.minimum(1, t / 0.03) * np.minimum(1, (dur - t) / 0.05)
    return x * mod * np.clip(e, 0, 1) * amp


def thud():
    n = int(SR * 0.5); t = np.arange(n) / SR
    f = 70 + 90 * np.exp(-t / 0.03)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    wood = bp(noise(n), 200, 1400) * np.exp(-t / 0.03) * 0.7
    return np.tanh((body + wood) * 1.5)


def tape_rewind(dur):
    n = int(SR * dur); t = np.arange(n) / SR
    u = t / dur
    sp = np.sin(np.pi * u) ** 0.6
    f = 300 + 2600 * sp
    chirp = np.sin(2 * np.pi * np.cumsum(f + 200 * np.sin(2 * np.pi * 31 * t)) / SR) * 0.18
    hiss = bp(noise(n), 2000, 9000) * 0.25
    flutter = 0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)
    return (chirp + hiss) * flutter * np.clip(sp * 1.5, 0, 1)


def shutter():
    n = int(SR * 0.08); t = np.arange(n) / SR
    a = hp(noise(n), 2500) * np.exp(-t / 0.006)
    b = np.concatenate([np.zeros(int(SR * 0.03)), hp(noise(n), 1800)[: n - int(SR * 0.03)] * np.exp(-t[: n - int(SR * 0.03)] / 0.01)])
    return (a + b * 0.8) * 0.8


def chime(freq, dur=2.0):
    n = int(SR * dur); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * dcy) for r, a, dcy in [(1, 1, 1.4), (2.76, 0.4, 3), (5.4, 0.2, 5), (8.9, 0.1, 8)])
    return x * np.minimum(1, t / 0.002) * 0.25


# ---------------------------------------------------------------- arrangement helpers
B = 0.5
PROG_A = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]  # Am F C G
PROG_B = [(48, [48, 52, 55]), (55, [55, 59, 62]), (57, [57, 60, 64]), (53, [53, 57, 60])]  # C G Am F


def kicks(t0, t1, step=B, strength=1.0, gain=0.9):
    t = t0
    while t < t1 - 1e-6:
        add(kick(strength), t, gain)
        i = at(t); n = int(SR * 0.28)
        u = np.arange(n) / n
        DUCK[i:i + n] = np.minimum(DUCK[i:i + n], 0.25 + 0.75 * u ** 0.7)
        t += step


def drums(t0, t1, claps=True, hats16=True, open_hats=True, gain=1.0):
    kicks(t0, t1, gain=0.9 * gain)
    t = t0
    k = 0
    while t < t1 - 1e-6:
        if claps and k % 2 == 1:
            add(clap(), t, 0.55 * gain, rev=0.25)
        if open_hats:
            add(hat(True), t + B / 2, 0.22 * gain, pan=0.2)
        if hats16:
            for s in (0.125, 0.375):
                add(hat(False), t + s, 0.18 * gain, pan=-0.25 + rng.random() * 0.1)
        t += B; k += 1


def bassline(t0, t1, prog, gain=0.5, cutoff=420, pattern='8th'):
    t = t0; bar = 0
    while t < t1 - 1e-6:
        root = prog[bar % 4][0] - 24
        step = B / 2 if pattern == '8th' else B
        for s in np.arange(0, 2.0, step):
            if t + s >= t1:
                break
            m = root + (12 if pattern == '8th' and int(s / step) % 4 == 3 else 0)
            add(bass_note(m, step * 0.92, cutoff), t + s, gain, duck=True)
        t += 2.0; bar += 1


def chords(t0, t1, prog, gain=0.35, cutoff=3200, fn=None):
    t = t0; bar = 0
    while t < t1 - 1e-6:
        notes = prog[bar % 4][1]
        d = min(2.0, t1 - t)
        x = supersaw([m + 12 for m in notes] + [notes[0]], d, cutoff) if fn is None else fn(notes, d)
        add(x, t, gain, rev=0.3, duck=True)
        t += 2.0; bar += 1


def arp(t0, t1, prog, gain=0.2, step=B / 2, octave=12, bright=1.0, rev=0.4):
    t = t0; bar = 0
    pat = [0, 1, 2, 1, 2, 0, 1, 2]
    while t < t1 - 1e-6:
        notes = prog[bar % 4][1]
        for i, s in enumerate(np.arange(0, 2.0, step)):
            if t + s >= t1:
                break
            m = notes[pat[i % len(pat)]] + octave + (12 if i % 8 == 6 else 0)
            add(pluck(mtof(m), 1.2, bright), t + s, gain, pan=0.3 * np.sin(i), rev=rev)
        t += 2.0; bar += 1


def type_times(a, b, n):
    return [a + (k / n) * (b - a) for k in range(1, n + 1)]


# ================================================================ SCORE
# ---- 0–4 · cold open: drone + keys
d = pad([33, 40, 45], 4.2, 600); add(d, 0.0, 0.35, rev=0.3)
air = lp(noise(int(SR * 4)), 900) * np.linspace(0, 1, int(SR * 4)) ** 2 * 0.05
add(air, 0.0, 1.0)
for tt in type_times(0.35, 1.5, 11) + type_times(1.75, 2.9, 10):
    add(key_click(), tt, 0.5, pan=rng.random() * 0.4 - 0.2)
add(reverse_swell(0.5), 3.5, 0.6)
add(whoosh(0.5, 300, 5000, 0.9), 3.55, 0.35)

# ---- 4–20 · the sketch era: warm plucked arpeggios, pencil, bricks
add(sub_boom(1.5, 60, 40), 4.0, 0.35)
arp(4.0, 16.0, PROG_A, gain=0.16, step=B, octave=0, bright=0.6, rev=0.55)
chords(8.0, 16.0, PROG_A, gain=0.16, fn=lambda n, d: pad(n, d, 900))
for a, b in [(4.05, 5.6), (5.2, 6.0), (6.8, 7.8), (7.0, 8.0), (14.3, 15.1), (15.0, 15.9)]:
    add(scratch(b - a), a, 0.28, pan=rng.random() - 0.5)
for i in range(6):
    t0 = 8 + i
    add(scratch(0.3, 0.2), t0, 1.0)
    add(thud(), t0 + 0.16, 0.8)
    add(thud()[: int(SR * 0.2)] * 0.3, t0 + 0.31, 0.5)
kicks(8.0, 14.0, B * 2, 0.7, 0.45)
kicks(14.0, 16.0, B, 0.8, 0.55)
for k in range(8):
    add(hat(False), 12.0 + k * 0.5 + 0.25, 0.1)
add(whoosh(0.7, 200, 3000, 0.6), 13.9, 0.5)
# 16–19.5 · the AI moment: build
add(riser(3.5, 150, 1800), 16.0, 0.55)
build = supersaw([57, 60, 64, 69], 3.5, 3000)
build = sweep_lp(build, 250, 6000)
add(build, 16.0, 0.22, rev=0.3)
add(click(4000, 0.015, 0.6), 16.5, 0.6)
add(blip(1320, 0.12, 0.4), 17.05, 0.5)
for tt in type_times(17.45, 18.25, 6):
    add(key_click(), tt, 0.55)
t = 17.0
while t < 19.0:
    step = B / 4 if t < 18.0 else B / 8
    add(snare(), t, 0.18 + 0.25 * (t - 17) / 2)
    t += step
add(click(2500, 0.03, 1.0), 19.0, 0.9)
add(kick(0.6), 19.0, 0.4)
add(reverse_swell(0.5), 19.0, 0.8)
add(blip(220, 0.25, 0.3), 19.55, 0.4, rev=0.5)

# ---- 20–38 · the AI big bang
add(impact(1.2), 20.0, 1.0, rev=0.4)
glitch = hp(noise(int(SR * 0.6)), 400) * (np.sin(2 * np.pi * 60 * np.arange(int(SR * 0.6)) / SR) > 0) * np.linspace(1, 0, int(SR * 0.6))
add(glitch, 20.1, 0.18)
drums(20.0, 33.0)
bassline(20.0, 33.0, PROG_A, 0.5)
chords(20.0, 33.0, PROG_A, 0.28)
add(riser(0.8, 400, 3000), 21.2, 0.4)
for i in range(8):
    add(whoosh(0.25, 800, 9000, 0.3)[::-1], 22.0 + i * 0.5 - 0.12, 0.25)
    add(sub_boom(0.6, 90, 40), 22.0 + i * 0.5, 0.45)
    add(crash(0.5), 22.0 + i * 0.5, 0.25)
penta = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91]
for k in range(32):
    add(blip(mtof(penta[k % 10] + 12 * (k // 10) - 12), 0.07, 0.25), 26.0 + k * 0.036, 0.35, pan=np.sin(k))
add(riser(0.75, 300, 4000), 27.25, 0.6)
add(impact(0.9), 28.0, 0.8, rev=0.35)
for k in range(24):
    u = k / 24
    add(blip(1800 + 400 * u, 0.03, 0.3), 28.05 + (1.25 * (1 - (1 - u) ** 2.5)), 0.25)
for tt in type_times(31.05, 31.7, 21) + type_times(31.7, 32.15, 14):
    add(key_click(), tt, 0.35)
add(sub_boom(1.2, 80, 36), 33.0, 0.6)
add(crash(1.5), 33.0, 0.35)
add(pad([45, 52, 57, 60], 1.0, 1400), 33.0, 0.35, rev=0.5)
add(tape_rewind(1.0), 34.0, 0.7)
add(whoosh(0.45, 400, 8000, 0.9), 35.0, 0.45)
add(pluck(mtof(69), 1.5, 0.6), 35.45, 0.35, rev=0.6)
add(pluck(mtof(76), 1.5, 0.6), 35.45, 0.2, rev=0.6)
for i, tt in enumerate([36.0, 36.5, 37.0]):
    add(impact(0.9 + i * 0.1), tt, 0.75, rev=0.3)
    stab = supersaw([[57, 64, 69], [53, 60, 65], [60, 64, 72]][i], 0.45, 4000)
    add(stab, tt, 0.35, rev=0.4)
add(sub_boom(1.0, 70, 35), 37.5, 0.5)
add(chime(mtof(81)), 37.5, 0.3, rev=0.6)
add(whoosh(0.35, 500, 9000, 0.9), 37.65, 0.4)

# ---- 38–62 · us
add(impact(0.7), 38.0, 0.55, rev=0.5)
arp(38.0, 41.0, PROG_B, gain=0.18, step=B / 2, octave=12, bright=0.8)
chords(38.0, 41.0, PROG_B, gain=0.18, fn=lambda n, d: pad(n, d, 1600))
kicks(38.0, 41.0, B * 2, 0.8, 0.55)
for tt in [39.0, 40.0]:
    add(snare(), tt, 0.35, rev=0.3)
for k in range(11):
    add(blip(mtof(76 + [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24][k]), 0.06, 0.25), 39.6 + k * 0.05, 0.3)
add(whoosh(0.45, 200, 5000, 0.95), 40.55, 0.5)
drums(41.0, 55.0)
bassline(41.0, 55.0, PROG_B, 0.48)
chords(41.0, 55.0, PROG_B, 0.2, cutoff=2600)
arp(41.0, 55.0, PROG_B, gain=0.1, step=B / 2, octave=24, bright=1.0, rev=0.3)
for i in range(4):
    add(shutter(), 41.0 + i * 0.5, 0.7)
for i in range(7):
    add(shutter(), 43.0 + i * 0.25, 0.6)
    add(snare(), 43.0 + i * 0.25, 0.25)
add(impact(0.6), 44.75, 0.5, rev=0.3)
add(shutter(), 44.75, 0.9)
for k in range(12):
    add(blip(mtof(84 + [0, 2, 4, 7, 9, 12][k % 6]), 0.05, 0.2), 44.85 + k * 0.05, 0.3)
for k in range(20):
    u = k / 20
    add(blip(1400 + 900 * u, 0.03, 0.25), 47.05 + 1.15 * (1 - (1 - u) ** 2.5), 0.2)
add(whoosh(0.6, 300, 6000, 0.8), 48.4, 0.35)
for i in range(4):
    add(whoosh(0.3, 800, 7000, 0.5), 48.75 + i * 0.12 - 0.1, 0.18)
add(sub_boom(0.8, 80, 40), 51.0, 0.4)
add(sub_boom(0.8, 80, 40), 51.55, 0.4)
add(whoosh(0.5, 300, 5000, 0.8), 52.0, 0.35)
for i in range(4):
    add(blip(mtof(79 + i * 3), 0.06, 0.25), 52.2 + i * 0.1, 0.3)
# principles: a hit per second, energy climbing
drums(55.0, 61.0, gain=1.05)
bassline(55.0, 61.0, PROG_A, 0.5, cutoff=600)
ss = supersaw([69, 72, 76, 81], 6.0, 3000)
add(sweep_lp(ss, 900, 9000), 55.0, 0.2, rev=0.3, duck=True)
for i in range(6):
    tt = 55.0 + i
    add(crash(1.0), tt, 0.3)
    add(sub_boom(0.7, 90, 40), tt, 0.4)
    add(whoosh(0.4, 600, 8000, 0.3)[::-1], tt - 0.1, 0.25)
t = 60.0
while t < 61.0:
    add(snare(), t, 0.2 + 0.3 * (t - 60))
    t += B / 4
add(reverse_swell(0.85), 61.0, 0.7)
add(riser(0.85, 300, 3000), 61.0, 0.4)

# ---- 62–80 · ascension
add(sub_boom(3.0, 55, 30), 62.0, 0.6)
add(chime(mtof(88), 3.0), 62.0, 0.35, rev=0.7)
for k in range(11):
    add(chime(mtof([69, 72, 76, 79, 81, 84, 88, 91, 93, 96, 100][k]), 1.5), 62.05 + k * 0.07, 0.12, pan=np.sin(k * 1.7), rev=0.6)
arp(62.0, 66.0, PROG_A, gain=0.2, step=B / 2, octave=0, bright=0.5, rev=0.7)
chords(62.0, 72.0, PROG_A, gain=0.2, fn=lambda n, d: pad([m - 12 for m in n] + [n[0] + 12], d, 1300))
for i, tt in enumerate([62.9, 63.85, 64.8]):
    add(chime(mtof([76, 79, 84][i]), 1.6), tt, 0.25, rev=0.6)
kicks(66.0, 68.0, B, 0.9, 0.55)
kicks(68.0, 70.0, B / 2, 0.9, 0.5)
kicks(70.0, 71.0, B / 4, 0.8, 0.45)
add(sub_boom(1.0, 80, 40), 66.2, 0.45)
add(crash(1.2), 68.4, 0.35)
add(crash(1.2), 69.85, 0.4)
bassline(68.0, 71.0, PROG_A, 0.4, pattern='8th')
add(riser(3.4, 200, 3000), 68.5, 0.6)
t = 70.0
while t < 71.8:
    add(snare(), t, 0.2 + 0.25 * (t - 70) / 1.8)
    t += B / 4 if t < 71 else B / 8
add(reverse_swell(0.9), 71.0, 0.9)
# 73.3–74.8 · the thesis
add(whoosh(0.45, 300, 4000, 0.6), 73.28, 0.35)
add(sub_boom(1.2, 70, 36), 73.3, 0.5)
add(chime(mtof(93), 2.2), 73.35, 0.3, rev=0.6)
add(reverse_swell(0.7), 74.15, 0.8)
# 74.8 · the mark
add(impact(1.3), 74.8, 1.0, rev=0.5)
for i, f in enumerate([81, 88, 93, 100]):
    add(chime(mtof(f), 2.5), 74.9 + i * 0.12, 0.25, rev=0.6)
drums(72.0, 76.0)
bassline(72.0, 76.0, PROG_A, 0.5)
chords(72.0, 76.0, PROG_A, 0.3, cutoff=5000)
arp(72.0, 76.0, PROG_A, gain=0.12, step=B / 2, octave=24, bright=1.0, rev=0.4)
for k in range(11):
    add(blip(mtof(84 + [0, 3, 7, 10, 12, 15, 19, 22, 24, 27, 31][k]), 0.05, 0.2), 75.2 + k * 0.045, 0.25)
# 76 · the invitation: everything drops out to one chord and a keyboard
add(impact(0.8), 76.0, 0.7, rev=0.6)
add(pad([45, 52, 57, 60, 64, 69], 4.0, 2200), 76.0, 0.4, rev=0.6)
add(pluck(mtof(69), 3.0, 0.6), 76.3, 0.35, rev=0.7)
add(pluck(mtof(76), 3.0, 0.6), 76.55, 0.25, rev=0.7)
add(pluck(mtof(81), 3.0, 0.6), 76.8, 0.2, rev=0.7)
cmd = '> join Protocom --as @你'
for tt in type_times(77.0, 77.9, len(cmd)):
    add(key_click(), tt, 0.45)
add(key_click(), 78.2, 0.6)
add(sub_boom(1.6, 50, 30), 78.2, 0.3)

# ---------------------------------------------------------------- reverb + master
ir_n = int(SR * 2.6)
ir_t = np.arange(ir_n) / SR
irL = lp(noise(ir_n), 6000) * np.exp(-ir_t / 0.55)
irR = lp(noise(ir_n), 6000) * np.exp(-ir_t / 0.55)
irL /= np.abs(irL).sum() ** 0.5 * 18; irR /= np.abs(irR).sum() ** 0.5 * 18
wetL = signal.fftconvolve(RL, irL)[:N]; wetR = signal.fftconvolve(RR, irR)[:N]
mixL = L + wetL * 0.9; mixR = R + wetR * 0.9
mixL = hp(mixL, 28); mixR = hp(mixR, 28)
# gentle glue: soft clip then normalise
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
mixL /= peak / 1.6; mixR /= peak / 1.6
mixL = np.tanh(mixL) ; mixR = np.tanh(mixR)
# master fades
fi = int(SR * 0.05); mixL[:fi] *= np.linspace(0, 1, fi); mixR[:fi] *= np.linspace(0, 1, fi)
fo = int(SR * 1.6); mixL[-fo:] *= np.linspace(1, 0, fo) ** 1.5; mixR[-fo:] *= np.linspace(1, 0, fo) ** 1.5
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
mixL *= 0.93 / peak; mixR *= 0.93 / peak

out = sys.argv[1] if len(sys.argv) > 1 else 'music.wav'
st = np.stack([mixL, mixR], 1)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote', out, f'{DUR:.1f}s')
```

### 5/18 · `promo/index.html`
<!-- casebook-file {"path": "promo/index.html", "lines": 29, "final_newline": true, "sha256": "bc9e4058071251d26838dd078ec87827b79255f8149f75e71cf0e66deffa84f0", "original_sha256": "bc9e4058071251d26838dd078ec87827b79255f8149f75e71cf0e66deffa84f0"} -->
```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<title>青禾·元野 · Protocom — promo</title>
<link rel="stylesheet" href="node_modules/@fontsource/noto-serif-sc/700.css">
<link rel="stylesheet" href="node_modules/@fontsource/noto-serif-sc/900.css">
<link rel="stylesheet" href="node_modules/@fontsource/noto-sans-sc/400.css">
<link rel="stylesheet" href="node_modules/@fontsource/noto-sans-sc/500.css">
<link rel="stylesheet" href="node_modules/@fontsource/noto-sans-sc/700.css">
<link rel="stylesheet" href="node_modules/@fontsource/noto-sans-sc/900.css">
<link rel="stylesheet" href="node_modules/@fontsource/jetbrains-mono/400.css">
<link rel="stylesheet" href="node_modules/@fontsource/jetbrains-mono/500.css">
<link rel="stylesheet" href="node_modules/@fontsource/jetbrains-mono/700.css">
<link rel="stylesheet" href="node_modules/@fontsource/long-cang/400.css">
<link rel="stylesheet" href="node_modules/@fontsource/caveat/600.css">
<link rel="stylesheet" href="node_modules/@fontsource/space-grotesk/500.css">
<link rel="stylesheet" href="node_modules/@fontsource/space-grotesk/700.css">
<style>
  html,body{margin:0;background:#000;overflow:hidden}
  canvas{display:block}
  #src{display:none}
</style>
</head>
<body>
<canvas id="out" width="1920" height="1080"></canvas>
<script type="module" src="src/main.js"></script>
</body>
</html>
```

### 6/18 · `promo/package-lock.json`
<!-- casebook-file {"path": "promo/package-lock.json", "lines": 114, "final_newline": true, "sha256": "1a18161d3f4867c721e2c200682614a49a5117a2ee841ab71adf377e699b83d6", "original_sha256": "1a18161d3f4867c721e2c200682614a49a5117a2ee841ab71adf377e699b83d6"} -->
```json
{
  "name": "promo",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "promo",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "@fontsource/caveat": "^5.3.0",
        "@fontsource/jetbrains-mono": "^5.3.0",
        "@fontsource/long-cang": "^5.3.0",
        "@fontsource/noto-sans-sc": "^5.3.0",
        "@fontsource/noto-serif-sc": "^5.3.0",
        "@fontsource/space-grotesk": "^5.3.0",
        "@lobehub/icons-static-svg": "^1.95.1"
      },
      "devDependencies": {
        "playwright": "^1.63.0"
      }
    },
    "node_modules/@fontsource/caveat": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/caveat/-/caveat-5.3.0.tgz",
      "integrity": "sha512-eHTfzQxFSW9ABERRLNruHoNJmKed2J7pqTUc5lp4a4POMgXGKpxmWj3d9Hz10kmAg6iuTTLe6UagbA4bnsmfQw==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource/jetbrains-mono": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/jetbrains-mono/-/jetbrains-mono-5.3.0.tgz",
      "integrity": "sha512-fqDfB5I9f1p1TV486aUgB9t8zP84P0O1FtQR5Ol9vjwPy+S+EIGlVYm1cvj2W5shcZMTg2nZFdVMoH5wFu8a1A==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource/long-cang": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/long-cang/-/long-cang-5.3.0.tgz",
      "integrity": "sha512-lCcBJb+LWZpYCVtGvQRiZPy5/EaGPuYLycpJXUIOz28EYGGqhTVWBRqY6ucaW8l1F8gvfjutY1PoAPUrFiP0wg==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource/noto-sans-sc": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/noto-sans-sc/-/noto-sans-sc-5.3.0.tgz",
      "integrity": "sha512-HeqIlGm0+ohOKxZLuHj1qW6r6avHH0OWdKERAcSDI0RQ+MXrteuLKA+M+5eOA8rYy0MFvOR5AT0fQo2rUkye0Q==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource/noto-serif-sc": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/noto-serif-sc/-/noto-serif-sc-5.3.0.tgz",
      "integrity": "sha512-0/zaEFkidiWldE62rTeD74x8ygUsQvejiSNtO0LQxQk3qpaHnlMZ3w4C7yH80B4KTIg8VKeFP4oSgwWMchY9+g==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource/space-grotesk": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource/space-grotesk/-/space-grotesk-5.3.0.tgz",
      "integrity": "sha512-ksnGizDPXIDuvqcTYTSrmZ+evx9sDlS8rp7+42BQ7wU+spt3twEoXfbJz672C+5CLg6VeUQwRy5RXshWb67LcQ==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@lobehub/icons-static-svg": {
      "version": "1.95.1",
      "resolved": "https://registry.npmjs.org/@lobehub/icons-static-svg/-/icons-static-svg-1.95.1.tgz",
      "integrity": "sha512-Hw7EPPgVnC4NZLXBfTNJG6hyQgqECfUPC11VVXodPSr1aebKcFxDZlSpxhWwYNdCc6bhxps/x5TtXoPmfKH2ag==",
      "license": "MIT"
    },
    "node_modules/playwright": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright/-/playwright-1.63.0.tgz",
      "integrity": "sha512-+7ziBLidS4NaNCdt57SUDT+wYmmd5fmiQejUic/kb+YsYSCPyOOE9sebzMjNmQrsnNpDJqd4WHvV/8lfKfUDUg==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright-core": "1.63.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.63.0.tgz",
      "integrity": "sha512-rYCsBF/M5HjUch52bbtVONEFjv6Xu8sm8h72dNlR5bzIE1fvC/bxgspzkjSfU+MweEMmPM8KJebG6nnyxo5mCg==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    }
  }
}
```

### 7/18 · `promo/package.json`
<!-- casebook-file {"path": "promo/package.json", "lines": 24, "final_newline": true, "sha256": "887409abb60dc900d9b4b9080313ce1ce3a7b85ef733afb8c97a1e26d7ec40ad", "original_sha256": "887409abb60dc900d9b4b9080313ce1ce3a7b85ef733afb8c97a1e26d7ec40ad"} -->
```json
{
  "name": "promo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@fontsource/caveat": "^5.3.0",
    "@fontsource/jetbrains-mono": "^5.3.0",
    "@fontsource/long-cang": "^5.3.0",
    "@fontsource/noto-sans-sc": "^5.3.0",
    "@fontsource/noto-serif-sc": "^5.3.0",
    "@fontsource/space-grotesk": "^5.3.0",
    "@lobehub/icons-static-svg": "^1.95.1"
  },
  "devDependencies": {
    "playwright": "^1.63.0"
  }
}
```

### 8/18 · `promo/preview.mjs`
<!-- casebook-file {"path": "promo/preview.mjs", "lines": 45, "final_newline": true, "sha256": "b4e2de5ffe49833625dea075a2ff022e8b7f5895ceb5364937e5c58771b8fcbe", "original_sha256": "b4e2de5ffe49833625dea075a2ff022e8b7f5895ceb5364937e5c58771b8fcbe"} -->
```js
// Render stills at given times: node preview.mjs out_dir 4.5 8.2 ...
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' };
export function serve() {
  return new Promise((res) => {
    const s = createServer(async (req, rsp) => {
      try {
        const p = join(ROOT, decodeURIComponent(req.url.split('?')[0]));
        const b = await readFile(p);
        rsp.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' });
        rsp.end(b);
      } catch { rsp.writeHead(404); rsp.end(); }
    });
    s.listen(0, () => res(s));
  });
}
export async function openPage(server, query = '') {
  const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--disable-accelerated-2d-canvas', '--disable-gpu-rasterization'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(`http://localhost:${server.address().port}/index.html${query}`);
  await page.waitForFunction(() => window.__ready, null, { timeout: 600000 });
  await page.evaluate(() => window.__ready);
  return { browser, page };
}

if (process.argv[1].endsWith('preview.mjs')) {
  const [dir, ...times] = process.argv.slice(2);
  await mkdir(dir, { recursive: true });
  const server = await serve();
  const { browser, page } = await openPage(server);
  for (const t of times) {
    await page.evaluate((t) => window.renderFrame(t), parseFloat(t));
    await page.screenshot({ path: `${dir}/t${String(t).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 85 });
  }
  await browser.close();
  server.close();
}
```

### 9/18 · `promo/render.mjs`
<!-- casebook-file {"path": "promo/render.mjs", "lines": 94, "final_newline": true, "sha256": "da4c5764f10a14fb0bde8e379b7b610fe232b18a8a7f352a9d94d78579483738", "original_sha256": "da4c5764f10a14fb0bde8e379b7b610fe232b18a8a7f352a9d94d78579483738"} -->
```js
// Full render: node render.mjs [workers] [fps] [out.mp4] [scale] [mode]
// Splits the timeline across headless Chromium workers, concatenates the segments
// and muxes the synthesized soundtrack.
//   scale: canvas supersample factor, e.g. 2 -> 3840x2160 (true 4K, all drawing is vector/timeline based)
//   mode:  jpeg (default) -> pipes jpeg frames, CRF21
//          png            -> writes lossless PNG frames to disk (resumable), x264 qp0 yuv444p master
import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { serve, openPage } from './preview.mjs';

let FFMPEG = process.env.FFMPEG;
if (!FFMPEG) {
  try { FFMPEG = execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim(); }
  catch { FFMPEG = 'ffmpeg'; }
}
const WORKERS = parseInt(process.argv[2] || '4', 10);
const FPS = parseInt(process.argv[3] || '60', 10);
const OUT = process.argv[4] || 'out/protocom-promo.mp4';
const SCALE = parseFloat(process.argv[5] || '1');
const MODE = process.argv[6] || 'jpeg';
const LOSSLESS = MODE === 'png';
const DURATION = 80;
const TOTAL = DURATION * FPS;
const TMP = 'out/segments';
mkdirSync(TMP, { recursive: true });
console.log(`render ${OUT} · ${FPS}fps · scale ${SCALE} · ${LOSSLESS ? 'lossless png frames (disk)' : 'jpeg frames (pipe)'}`);

const server = await serve();
const t0 = Date.now();
let done = 0;
const tick = () => {
  if (++done % 200 === 0) {
    const el = (Date.now() - t0) / 1000;
    console.log(`${done}/${TOTAL} frames · ${el.toFixed(0)}s · eta ${((el / done) * (TOTAL - done)).toFixed(0)}s`);
  }
};

async function workerPipe(w) {
  const a = Math.floor((TOTAL * w) / WORKERS), b = Math.floor((TOTAL * (w + 1)) / WORKERS);
  const seg = `${TMP}/seg${w}.mp4`;
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', String(FPS), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const { browser, page } = await openPage(server, SCALE === 1 ? '' : `?scale=${SCALE}`);
  for (let f = a; f < b; f++) {
    const b64 = await page.evaluate((t) => {
      window.renderFrame(t);
      return document.getElementById('out').toDataURL('image/jpeg', 0.96).split(',')[1];
    }, f / FPS);
    const buf = Buffer.from(b64, 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    tick();
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  return seg;
}

async function workerDisk(w) {
  const a = Math.floor((TOTAL * w) / WORKERS), b = Math.floor((TOTAL * (w + 1)) / WORKERS);
  const dir = `${TMP}/frames${w}`;
  mkdirSync(dir, { recursive: true });
  const { browser, page } = await openPage(server, SCALE === 1 ? '' : `?scale=${SCALE}`);
  for (let f = a; f < b; f++) {
    const fp = `${dir}/f${String(f).padStart(6, '0')}.png`;
    if (!existsSync(fp)) {
      let buf = null;
      for (let retry = 0; retry < 3 && (!buf || !buf.length); retry++) {
        const b64 = await page.evaluate((t) => {
          window.renderFrame(t);
          return document.getElementById('out').toDataURL('image/png').split(',')[1];
        }, f / FPS);
        buf = Buffer.from(b64 || '', 'base64');
      }
      if (!buf.length) throw new Error(`empty frame ${f}`);
      writeFileSync(fp, buf);
    }
    tick();
  }
  await browser.close();
  const seg = `${TMP}/seg${w}.mp4`;
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-start_number', String(a), '-i', `${dir}/f%06d.png`,
    '-c:v', 'libx264', '-preset', 'medium', '-qp', '0', '-pix_fmt', 'yuv444p', '-r', String(FPS), seg], { stdio: 'inherit' });
  return seg;
}

const worker = LOSSLESS ? workerDisk : workerPipe;
const segs = await Promise.all([...Array(WORKERS).keys()].map(worker));
server.close();
writeFileSync(`${TMP}/list.txt`, segs.map((s) => `file '${s.split('/').pop()}'`).join('\n'));
if (!existsSync('audio/music.wav')) execFileSync('python3', ['audio/synth.py', 'audio/music.wav'], { stdio: 'inherit' });
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${TMP}/list.txt`, '-i', 'audio/music.wav',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', LOSSLESS ? '320k' : '256k', '-shortest', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
console.log('done', OUT, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
```

### 10/18 · `promo/sheet.py`
<!-- casebook-file {"path": "promo/sheet.py", "lines": 7, "final_newline": true, "sha256": "2bd5fa350a603849e56b21291f5d132bc56833df232900cff1aa2e85bc62ac4b", "original_sha256": "2bd5fa350a603849e56b21291f5d132bc56833df232900cff1aa2e85bc62ac4b"} -->
```python
import sys,glob
from PIL import Image
d,o=sys.argv[1],sys.argv[2]
fs=sorted(glob.glob(d+'/*.jpg'),key=lambda f:float(f.split('/t')[-1][:-4]))
sh=Image.new('RGB',(3*640,((len(fs)+2)//3)*360))
for i,f in enumerate(fs): sh.paste(Image.open(f).resize((640,360)),((i%3)*640,(i//3)*360))
sh.save(o)
```

### 11/18 · `promo/src/act1.js`
<!-- casebook-file {"path": "promo/src/act1.js", "lines": 364, "final_newline": true, "sha256": "25942cc0acadb2c1b7e3f187c451c9f56c44c61dbfb8bdcad1dd042e4720f3ac", "original_sha256": "25942cc0acadb2c1b7e3f187c451c9f56c44c61dbfb8bdcad1dd042e4720f3ac"} -->
```js
// 0–20s · Cold open + the hand-drawn era: an idea, and the mountain between it and reality.
import {
  W, H, C, F, clamp, lerp, prog, ease, hash, hs, noise1, text, typeText, sketchPoly, sketchCircle, hatch,
  rotY, rotX, fillBg, roundRect, measure,
} from './core.js';

// ---------- paper texture (generated once) ----------
let paperTex = null;
function paper() {
  if (paperTex) return paperTex;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = C.paper; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 90000; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * H, a = hash(i, 3);
    g.fillStyle = a > 0.5 ? `rgba(90,70,40,${0.035 * hash(i, 4)})` : `rgba(255,255,255,${0.12 * hash(i, 5)})`;
    g.fillRect(x, y, 1 + hash(i, 6) * 1.6, 1 + hash(i, 7) * 1.6);
  }
  for (let i = 0; i < 700; i++) {
    const x = hash(i, 11) * W, y = hash(i, 12) * H, a = hash(i, 13) * Math.PI, l = 6 + hash(i, 14) * 22;
    g.strokeStyle = `rgba(120,95,60,${0.05 + hash(i, 15) * 0.05})`;
    g.lineWidth = 0.6;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 3, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  // faint sketchbook dot grid
  g.fillStyle = 'rgba(60,90,120,0.10)';
  for (let x = 40; x < W; x += 48) for (let y = 36; y < H; y += 48) g.fillRect(x, y, 2, 2);
  paperTex = c;
  return c;
}
export function drawPaper(ctx) { ctx.drawImage(paper(), 0, 0); }

// ---------- hand lettering: wipe reveal with a pen nib ----------
export function handText(ctx, str, x, y, size, p, o = {}) {
  const { color = C.graphite, align = 'center', family = F.hand, alpha = 1 } = o;
  if (p <= 0) return;
  const w = measure(ctx, str, { family, size });
  const x0 = align === 'center' ? x - w / 2 : x;
  const e = ease.inOutCubic(clamp(p));
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0 - 20, y - size * 1.3, (w + 40) * e, size * 1.9);
  ctx.clip();
  text(ctx, str, x0, y, { family, size, color, alpha });
  ctx.restore();
  if (p < 1) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8 * alpha;
    ctx.beginPath(); ctx.arc(x0 - 20 + (w + 40) * e, y - size * 0.3 + Math.sin(p * 40) * size * 0.2, 3, 0, 7); ctx.fill();
    ctx.restore();
  }
}

// ---------- light bulb (the idea) ----------
export function drawBulb(ctx, x, y, s, t, p, o = {}) {
  const { glow = 0, color = C.graphite, seed = 11, lit = 1 } = o;
  const r = 100 * s;
  if (glow > 0) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3.2);
    g.addColorStop(0, `rgba(232,160,58,${0.38 * glow})`);
    g.addColorStop(1, 'rgba(232,160,58,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 3.4, y - r * 3.4, r * 6.8, r * 6.8);
  }
  const lw = Math.max(1.4, 3.2 * s);
  sketchCircle(ctx, x, y, r, { t, seed, progress: prog(p, 0, 0.45), width: lw, color, start: Math.PI * 0.62 });
  // neck
  const nb = y + r * 0.78;
  sketchPoly(ctx, [[x - r * 0.42, nb], [x - r * 0.36, nb + r * 0.55]], { t, seed: seed + 1, progress: prog(p, 0.35, 0.5), width: lw, color });
  sketchPoly(ctx, [[x + r * 0.42, nb], [x + r * 0.36, nb + r * 0.55]], { t, seed: seed + 2, progress: prog(p, 0.38, 0.52), width: lw, color });
  for (let i = 0; i < 3; i++) {
    const yy = nb + r * (0.62 + i * 0.17);
    sketchPoly(ctx, [[x - r * 0.4, yy], [x + r * 0.4, yy + r * 0.04]], { t, seed: seed + 3 + i, progress: prog(p, 0.45 + i * 0.04, 0.58 + i * 0.04), width: lw * 0.9, color });
  }
  sketchPoly(ctx, [[x - r * 0.18, nb + r * 1.12], [x, nb + r * 1.22], [x + r * 0.18, nb + r * 1.12]], { t, seed: seed + 8, progress: prog(p, 0.58, 0.66), width: lw, color });
  // filament
  const fp = [];
  for (let i = 0; i <= 8; i++) fp.push([x - r * 0.3 + (i / 8) * r * 0.6, y + r * 0.15 + (i % 2 ? -r * 0.22 : 0)]);
  sketchPoly(ctx, [[x - r * 0.25, nb], [x - r * 0.3, y + r * 0.15]], { t, seed: seed + 9, progress: prog(p, 0.6, 0.68), width: lw * 0.7, color });
  sketchPoly(ctx, fp, { t, seed: seed + 10, progress: prog(p, 0.64, 0.8), width: lw * 0.8, color: lit > 0.5 ? '#C4561F' : color, jitter: 0.8 });
  sketchPoly(ctx, [[x + r * 0.3, y + r * 0.15], [x + r * 0.25, nb]], { t, seed: seed + 11, progress: prog(p, 0.78, 0.84), width: lw * 0.7, color });
  // rays
  const rp = prog(p, 0.82, 1);
  if (rp > 0 && lit > 0) {
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.42;
      const r1 = r * 1.28, r2 = r * (1.55 + (i % 2) * 0.18);
      sketchPoly(ctx, [[x + Math.cos(a) * r1, y + Math.sin(a) * r1], [x + Math.cos(a) * r2, y + Math.sin(a) * r2]],
        { t, seed: seed + 20 + i, progress: ease.outCubic(clamp(rp * 1.6 - i * 0.08)), width: lw * 0.9, color, alpha: lit });
    }
  }
}

// ---------- pyramid of barriers ----------
const BR = { w: 3.0, h: 1.15, d: 1.5 };
const BRICKS = [
  { x: -3.1, y: 0, label: '学三年编程' },
  { x: 3.1, y: 0, label: '写十万行代码' },
  { x: 0, y: 0, label: '凑齐一个团队' },
  { x: -1.55, y: BR.h, label: '找设计 · 找服务器' },
  { x: 1.55, y: BR.h, label: '拉到第一笔钱' },
  { x: 0, y: BR.h * 2, label: '还得有人愿意用' },
];
export const BRICK_TIMES = BRICKS.map((_, i) => 8 + i);

function camAt(t) {
  // slow orbit, then a fast swing + low angle at 14s
  const swing = ease.inOutExpo(prog(t, 14, 14.7));
  const yaw = lerp(-0.32 + (t - 6) * 0.01, 0.5, swing);
  const pitch = lerp(0.36, -0.05, ease.inOutCubic(prog(t, 14, 15.6)));
  const dist = lerp(24, 17.5, ease.inOutCubic(prog(t, 14, 16)));
  const ty = lerp(1.3, 2.2, ease.inOutCubic(prog(t, 14, 16)));
  return { yaw, pitch, dist, target: [0, ty, 0], f: 2150, cyOff: lerp(70, -75, ease.inOutCubic(prog(t, 14, 16))) };
}
function project(cam, p) {
  let q = [p[0] - cam.target[0], p[1] - cam.target[1], p[2] - cam.target[2]];
  q = rotY(q, cam.yaw); q = rotX(q, cam.pitch);
  const z = q[2] + cam.dist;
  const k = cam.f / z;
  return [W / 2 + q[0] * k, H / 2 + cam.cyOff - q[1] * k, z, q];
}
function boxFaces(x, y, z, w, h, d) {
  const x0 = x - w / 2, x1 = x + w / 2, y0 = y, y1 = y + h, z0 = z - d / 2, z1 = z + d / 2;
  return [
    { k: 'front', n: [0, 0, -1], v: [[x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0]] },
    { k: 'back', n: [0, 0, 1], v: [[x1, y1, z1], [x0, y1, z1], [x0, y0, z1], [x1, y0, z1]] },
    { k: 'top', n: [0, 1, 0], v: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] },
    { k: 'bottom', n: [0, -1, 0], v: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] },
    { k: 'left', n: [-1, 0, 0], v: [[x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [x0, y0, z1]] },
    { k: 'right', n: [1, 0, 0], v: [[x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [x1, y0, z0]] },
  ];
}
// Returns screen-space edges of the pyramid for the particle explosion.
export function pyramidEdges(t) {
  const cam = camAt(t);
  const out = [];
  BRICKS.forEach((b) => {
    boxFaces(b.x, b.y, 0, BR.w, BR.h, BR.d).forEach((f) => {
      const pts = f.v.map((v) => project(cam, v));
      for (let i = 0; i < 4; i++) out.push([pts[i], pts[(i + 1) % 4]]);
    });
  });
  return out;
}
export function pyramidBounds(t) {
  const e = pyramidEdges(t).flat();
  const xs = e.map((p) => p[0]), ys = e.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function drawScene3D(ctx, t, o = {}) {
  const { lineColor = C.graphite, faceColor = C.paper, dim = 0 } = o;
  const cam = camAt(t);
  // ground line
  const gp = prog(t, 6.8, 7.8);
  const g0 = project(cam, [-11, 0, 0]), g1 = project(cam, [11, 0, 0]);
  sketchPoly(ctx, [[g0[0], g0[1]], [lerp(g0[0], g1[0], 0.5), lerp(g0[1], g1[1], 0.5) + 2], [g1[0], g1[1]]], { t, seed: 91, progress: gp, width: 2.4, color: lineColor });
  // ground scribbles
  for (let i = 0; i < 14; i++) {
    const u = -10 + i * 1.5 + hash(i, 5);
    const a = project(cam, [u, 0, -0.6 - hash(i, 3) * 1.2]), b = project(cam, [u + 0.5, 0, -0.6 - hash(i, 3) * 1.2]);
    sketchPoly(ctx, [[a[0], a[1]], [b[0], b[1]]], { t, seed: 300 + i, progress: prog(gp, 0.3 + i * 0.04, 0.5 + i * 0.04), width: 1.3, color: lineColor, alpha: 0.5 });
  }
  // the idea (bulb) stands on the left, "现实" flag on the right
  const bulbBase = project(cam, [-7.0, 0, 0]);
  const flag = project(cam, [7.0, 0, 0]);
  const flagTop = project(cam, [7.0, 3.2, 0]);
  const fp = prog(t, 7.1, 7.9);
  sketchPoly(ctx, [[flag[0], flag[1]], [flagTop[0], flagTop[1]]], { t, seed: 71, progress: fp, width: 2.6, color: lineColor });
  const fw = 120 * (cam.f / cam.dist / 90);
  sketchPoly(ctx, [[flagTop[0], flagTop[1]], [flagTop[0] + fw, flagTop[1] + fw * 0.28], [flagTop[0], flagTop[1] + fw * 0.56]], { t, seed: 72, progress: prog(fp, 0.4, 1), width: 2.4, color: C.coral });
  if (fp > 0.5) hatch(ctx, [[flagTop[0], flagTop[1]], [flagTop[0] + fw, flagTop[1] + fw * 0.28], [flagTop[0], flagTop[1] + fw * 0.56]], { t, color: C.coral, spacing: 7, alpha: 0.7, progress: prog(fp, 0.6, 1) });
  handText(ctx, '现实', flag[0] + 10, flag[1] + 64, 50, prog(t, 7.5, 8.2), { color: lineColor });

  // faces
  const faces = [];
  BRICKS.forEach((b, i) => {
    const t0 = BRICK_TIMES[i];
    if (t < t0) return;
    const fall = ease.outBounce(prog(t, t0, t0 + 0.42));
    const y = b.y + (1 - fall) * 7.5;
    boxFaces(b.x, y, 0, BR.w, BR.h, BR.d).forEach((f) => {
      let n = rotX(rotY(f.n, cam.yaw), cam.pitch);
      const P = f.v.map((v) => project(cam, v));
      const c = P.reduce((a, p) => [a[0] + p[3][0] / 4, a[1] + p[3][1] / 4, a[2] + (p[3][2] + cam.dist) / 4], [0, 0, 0]);
      if (n[0] * c[0] + n[1] * c[1] + n[2] * c[2] >= 0) return;
      faces.push({ f, P, depth: c[2], i, b, draw: prog(t, t0, t0 + 0.3) });
    });
  });
  faces.sort((a, b) => b.depth - a.depth);
  faces.forEach(({ f, P, i, b, draw }) => {
    const poly = P.map((p) => [p[0], p[1]]);
    ctx.save();
    ctx.beginPath(); poly.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    ctx.fillStyle = f.k === 'top' ? '#F8F4EA' : faceColor;
    ctx.globalAlpha = clamp(draw * 3);
    ctx.fill();
    ctx.restore();
    if (f.k === 'left' || f.k === 'right') hatch(ctx, poly, { t, seed: i * 7 + 1, progress: prog(draw, 0.5, 1), color: lineColor, alpha: 0.38, spacing: 10 });
    if (f.k === 'top') hatch(ctx, poly, { t, seed: i * 7 + 2, progress: prog(draw, 0.6, 1), color: lineColor, alpha: 0.12, spacing: 16, angle: 0.3 });
    sketchPoly(ctx, poly, { t, seed: i * 31 + f.k.length, closed: true, progress: draw, width: 2.3, color: lineColor });
    if (f.k === 'front' && draw > 0.4) {
      // map label onto the face (affine is exact enough at this focal length)
      const [a, bq, , d] = poly;
      const WF = 300, HF = 115;
      ctx.save();
      ctx.transform((bq[0] - a[0]) / WF, (bq[1] - a[1]) / WF, (d[0] - a[0]) / HF, (d[1] - a[1]) / HF, a[0], a[1]);
      text(ctx, b.label, 150, 74, { family: F.hand, size: b.label.length > 6 ? 36 : 42, color: lineColor, align: 'center', alpha: clamp((draw - 0.4) * 3) });
      ctx.restore();
    }
  });
  // impact dust
  BRICKS.forEach((b, i) => {
    const tl = BRICK_TIMES[i] + 0.3;
    const dp = prog(t, tl, tl + 0.45);
    if (dp <= 0 || dp >= 1) return;
    for (const side of [-1, 1]) {
      const base = project(cam, [b.x + side * BR.w * 0.5, b.y, -BR.d / 2]);
      for (let k = 0; k < 3; k++) {
        const a = -Math.PI / 2 + side * (0.9 + k * 0.35);
        const r0 = 14 + dp * 50, r1 = r0 + 18 * (1 - dp);
        sketchPoly(ctx, [[base[0] + Math.cos(a) * r0 * side * side, base[1] + Math.sin(a) * r0 * 0.4], [base[0] + Math.cos(a) * r1, base[1] + Math.sin(a) * r1 * 0.4]],
          { t, seed: 500 + i * 9 + k, width: 1.6, color: lineColor, alpha: 1 - dp });
      }
    }
  });
  return { cam, bulbBase };
}

function drawCursor(ctx, x, y, s = 1, press = 0) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s * (1 - press * 0.12), s * (1 - press * 0.12));
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(8.5, 26); ctx.lineTo(14, 39); ctx.lineTo(19.5, 36.5); ctx.lineTo(14, 24); ctx.lineTo(25, 24); ctx.closePath();
  ctx.fillStyle = '#0B0D0F'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
  ctx.fill(); ctx.shadowColor = 'transparent'; ctx.stroke();
  ctx.restore();
}

// ---------- main draw ----------
export function drawAct1(ctx, t, P) {
  // ===== 0–4 cold open =====
  if (t < 4) {
    fillBg(ctx, '#070809');
    const o = { family: F.mono, size: 64, color: C.cream, weight: 400 };
    const x = 470;
    text(ctx, '~/protocom  ·  zsh', x, 400, { family: F.mono, size: 24, color: '#5d5a53', alpha: prog(t, 0.1, 0.5) });
    typeText(ctx, '> 每一个了不起的东西，', x, 520, o, prog(t, 0.35, 1.5), t < 1.65, t);
    if (t > 1.65) typeText(ctx, '> 都始于一个想法。', x, 628, { ...o, cursorColor: C.amber }, prog(t, 1.75, 2.9), true, t);
    // cursor block blooms into paper (match cut)
    const ep = ease.inExpo(prog(t, 3.55, 4));
    if (ep > 0) {
      const w2 = measure(ctx, '> 都始于一个想法。', o);
      const cx0 = x + w2 + 6 + 16, cy0 = 628 - 64 * 0.82 + 30;
      const cx = lerp(cx0, W / 2, ep), cy = lerp(cy0, H / 2, ep);
      const hw = lerp(16, W * 0.62, ep), hh = lerp(30, H * 0.62, ep);
      ctx.fillStyle = C.paper;
      ctx.fillRect(cx - hw, cy - hh, hw * 2, hh * 2);
    }
    P.grain = 0.05; P.vig = 0.5;
    return;
  }

  // ===== 4–19.5 sketch era =====
  if (t < 19.5) {
    drawPaper(ctx);
    P.grain = 0.035; P.vig = 0.42; P.warm = 0.4;
    const sel = prog(t, 16.5, 17.1);
    const suck = ease.inExpo(prog(t, 19.0, 19.5));
    ctx.save();
    // camera drift + final suck-in
    const drift = 1 + (t - 4) * 0.004;
    ctx.translate(W / 2, H / 2); ctx.scale(drift * (1 + suck * 0.9), drift * (1 + suck * 0.9)); ctx.translate(-W / 2, -H / 2);
    if (t > 19) ctx.translate(hs(Math.floor(t * 60), 1) * 8 * suck, hs(Math.floor(t * 60), 2) * 8 * suck);

    // intro bulb: big & centered, then flies into the scene
    const fly = ease.inOutExpo(prog(t, 6.3, 7.4));
    let sceneInfo = null;
    if (t >= 6.3) sceneInfo = drawScene3D(ctx, t);
    let bx = W / 2, by = H / 2 - 70, bs = 1.25;
    if (sceneInfo) {
      const tgt = sceneInfo.bulbBase;
      const sc = (camAt(t).f / camAt(t).dist) / 90;
      bx = lerp(bx, tgt[0], fly); by = lerp(by, tgt[1] - 210 * 0.55 * sc, fly); bs = lerp(bs, 0.55 * sc, fly);
    }
    const dimmed = t > 14.4 ? 0.35 + 0.65 * (noise1(t * 14, 4) > 0.2 ? 0.4 : 1) : 1;
    drawBulb(ctx, bx, by, bs, t, prog(t, 4.05, 5.6), { glow: prog(t, 5.4, 6) * (t > 14.4 ? dimmed * 0.5 : 1), lit: 1 });
    handText(ctx, '一个想法', W / 2, H / 2 + 260, 96, prog(t, 5.2, 6.0) * (1 - fly), { alpha: 1 - fly });
    if (fly > 0.7) handText(ctx, '想法', bx - 150 * bs, by - 150 * bs, 44, prog(t, 7.2, 7.8));
    text(ctx, 'idea.v0 ↘', W / 2 + 180, H / 2 - 240, { family: F.handLatin, size: 44, color: C.coral, weight: 600, alpha: prog(t, 5.5, 5.8) * (1 - fly) });

    // copy
    handText(ctx, '要把它变成现实，', W / 2, 170, 78, prog(t, 7.0, 8.0), { alpha: 1 - prog(t, 13.6, 14.0) });
    handText(ctx, '想法与现实之间，', W / 2, 150, 84, prog(t, 14.3, 15.1), { alpha: 1 - prog(t, 16.2, 16.5) });
    handText(ctx, '隔着一整座山。', W / 2, 262, 110, prog(t, 15.0, 15.9), { alpha: 1 - prog(t, 16.2, 16.5), color: '#1a1714' });
    ctx.restore();

    // ===== AI moment: select + prompt =====
    if (t >= 16) {
      const [x0, y0, x1, y1] = pyramidBounds(Math.min(t, 16.5));
      const pad = 26;
      const bx0 = x0 - pad, by0 = y0 - pad, bx1 = x1 + pad, by1 = y1 + pad;
      const cIn = ease.outExpo(prog(t, 16.0, 16.5));
      let cx = lerp(W + 60, bx0, cIn), cy = lerp(H + 60, by0, cIn);
      if (t > 16.5) { const d = ease.inOutCubic(sel); cx = lerp(bx0, bx1, d); cy = lerp(by0, by1, d); }
      const promptY = H - 110;
      const btnX = W / 2 + 420, btnY = promptY;
      if (t > 18.3) { const m = ease.inOutExpo(prog(t, 18.3, 18.85)); cx = lerp(bx1, btnX, m); cy = lerp(by1, btnY, m); }
      if (sel > 0) {
        ctx.save();
        const sx1 = lerp(bx0, bx1, ease.inOutCubic(sel)), sy1 = lerp(by0, by1, ease.inOutCubic(sel));
        ctx.fillStyle = 'rgba(232,99,58,0.07)';
        ctx.fillRect(bx0, by0, sx1 - bx0, sy1 - by0);
        ctx.strokeStyle = C.coral; ctx.lineWidth = 2.5;
        ctx.strokeRect(bx0, by0, sx1 - bx0, sy1 - by0);
        if (sel >= 1) {
          for (const [hx, hy] of [[bx0, by0], [bx1, by0], [bx0, by1], [bx1, by1], [(bx0 + bx1) / 2, by0], [(bx0 + bx1) / 2, by1], [bx0, (by0 + by1) / 2], [bx1, (by0 + by1) / 2]]) {
            ctx.fillStyle = '#fff'; ctx.fillRect(hx - 7, hy - 7, 14, 14); ctx.strokeRect(hx - 7, hy - 7, 14, 14);
          }
          const lbl = `${Math.round(bx1 - bx0)} × ${Math.round(by1 - by0)}`;
          const lw = measure(ctx, lbl, { family: F.mono, size: 20, weight: 500 }) + 24;
          ctx.fillStyle = C.coral; roundRect(ctx, (bx0 + bx1) / 2 - lw / 2, by1 + 18, lw, 34, 6); ctx.fill();
          text(ctx, lbl, (bx0 + bx1) / 2, by1 + 42, { family: F.mono, size: 20, weight: 500, color: '#fff', align: 'center' });
          text(ctx, '整座山 · 已选中', bx0, by0 - 18, { family: F.mono, size: 20, weight: 500, color: C.coral });
        }
        ctx.restore();
      }
      // prompt bar
      const pb = ease.outBack(prog(t, 17.05, 17.45));
      if (pb > 0) {
        ctx.save();
        const pw = 980, ph = 92;
        ctx.globalAlpha = clamp(pb);
        ctx.translate(W / 2, promptY + (1 - pb) * 80);
        ctx.shadowColor = 'rgba(20,15,10,0.28)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
        ctx.fillStyle = '#0E1012'; roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 22); ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1.5; roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 22); ctx.stroke();
        text(ctx, '✦', -pw / 2 + 44, 13, { size: 36, color: C.coral, align: 'center' });
        const typed = prog(t, 17.45, 18.25);
        typeText(ctx, '把它做出来。', -pw / 2 + 86, 14, { family: F.sans, size: 38, weight: 500, color: C.cream, cursorColor: C.coral }, typed, t < 18.9, t);
        if (typed === 0) text(ctx, '描述你想要的…', -pw / 2 + 86, 14, { size: 36, color: '#55524c' });
        const press = t > 18.95 && t < 19.15 ? 1 : 0;
        ctx.fillStyle = press ? '#fff' : C.coral;
        ctx.beginPath(); ctx.arc(420, 0, 30 * (1 - press * 0.1), 0, 7); ctx.fill();
        ctx.strokeStyle = press ? C.coral : '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(420, 11); ctx.lineTo(420, -11); ctx.moveTo(410, -2); ctx.lineTo(420, -12); ctx.lineTo(430, -2); ctx.stroke();
        ctx.restore();
      }
      const press = t > 18.95 && t < 19.15 ? 1 : 0;
      drawCursor(ctx, cx, cy, 1.25, press);
    }
    if (t > 19) { P.glitch = suck * 0.5; P.ca = suck * 0.01; P.zoomBlur = suck * 0.25; }
    return;
  }

  // ===== 19.5–20 silence: the year =====
  fillBg(ctx, '#000');
  text(ctx, '2022', W / 2, H / 2 + 12, { family: F.mono, size: 30, color: '#8a867c', align: 'center', ls: 8, alpha: prog(t, 19.55, 19.62) });
  P.grain = 0.05;
}
```

### 12/18 · `promo/src/act2.js`
<!-- casebook-file {"path": "promo/src/act2.js", "lines": 340, "final_newline": true, "sha256": "fa07ed453345bebd4e46b6b2f5274de0b619bb36ac371097187b5c1144ee33b1", "original_sha256": "fa07ed453345bebd4e46b6b2f5274de0b619bb36ac371097187b5c1144ee33b1"} -->
```js
// 20–38s · The AI big bang: the mountain dissolves into tokens, the tools arrive,
// code stops being scarce — then a rewind back to the one thing that still is.
import {
  W, H, C, F, clamp, lerp, prog, ease, hash, hs, text, typeText, revealText, measure, fillBg, images, roundRect, zoomAt,
} from './core.js';
import { SLAMS, GRID_LOGOS, CODE_LINES } from './data.js';
import { drawAct1, pyramidEdges } from './act1.js';

let raw = null;
export function setRaw(fn) { raw = fn; }
export function clearThumbs() { thumbCache.clear(); }

const GLYPHS = '{}[]()<>=+*/;:01AIλ∑→#$%&@?!ab∫∂πΩ令牌想法做出来';
let particles = null;
function getParticles() {
  if (particles) return particles;
  particles = [];
  const edges = pyramidEdges(18.9);
  let cx = 0, cy = 0, n = 0;
  edges.forEach(([a, b]) => { cx += a[0] + b[0]; cy += a[1] + b[1]; n += 2; });
  cx /= n; cy /= n;
  let id = 0;
  edges.forEach(([a, b]) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.floor(L / 30));
    for (let i = 0; i < k; i++) {
      if (hash(id, 99) > 0.55) { id++; continue; }
      const u = (i + 0.5) / k;
      const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u);
      const ang = Math.atan2(y - cy, x - cx) + hs(id, 1) * 0.7;
      const sp = 300 + hash(id, 2) * 900;
      particles.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, ch: GLYPHS[Math.floor(hash(id, 3) * GLYPHS.length)], c: hash(id, 4), size: 18 + hash(id, 5) * 26, id });
      id++;
    }
  });
  return particles;
}

function darkBg(ctx, t, tint = null, glow = 0) {
  fillBg(ctx, '#050607');
  if (tint && glow > 0) {
    const g = ctx.createRadialGradient(W / 2, H / 2 - 40, 10, W / 2, H / 2 - 40, 900);
    g.addColorStop(0, tint + Math.round(glow * 90).toString(16).padStart(2, '0'));
    g.addColorStop(1, tint + '00');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = 'rgba(244,239,227,0.07)';
  for (let x = 30; x < W; x += 60) for (let y = 30; y < H; y += 60) ctx.fillRect(x - 1, y - 1, 2, 2);
}
function hud(ctx, left, right, alpha = 1) {
  text(ctx, left, 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, alpha });
  text(ctx, right, W - 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, align: 'right', alpha });
  ctx.save();
  ctx.globalAlpha = 0.35 * alpha; ctx.strokeStyle = C.cream; ctx.lineWidth = 1;
  for (const [x, y, dx, dy] of [[60, 60, 1, 1], [W - 60, 60, -1, 1], [60, H - 60, 1, -1], [W - 60, H - 60, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(x, y + dy * 30); ctx.lineTo(x, y); ctx.lineTo(x + dx * 30, y); ctx.stroke();
  }
  ctx.restore();
}
function drawLogo(ctx, key, x, y, size, alpha = 1) {
  const im = images['logo_' + key];
  if (!im) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.drawImage(im, x - size / 2, y - size / 2, size, size);
  ctx.restore();
}
function codeRain(ctx, t, alpha) {
  ctx.save();
  for (let col = 0; col < 7; col++) {
    const x = 60 + col * 280;
    const speed = 40 + hash(col, 1) * 60;
    for (let r = 0; r < 26; r++) {
      const y = ((r * 46 + t * speed + hash(col, 2) * 900) % (H + 100)) - 50;
      const line = CODE_LINES[Math.floor(hash(col, r) * CODE_LINES.length)];
      text(ctx, line.slice(0, 22), x, y, { family: F.mono, size: 17, color: hash(col, r, 3) > 0.9 ? C.teal : C.cream, alpha: alpha * (0.05 + hash(col, r, 4) * 0.08) });
    }
  }
  ctx.restore();
}

// ---------- film strip for the rewind (拉片) ----------
const THUMB_T = [5.95, 7.6, 10.5, 13.7, 15.8, 17.9, 22.2, 22.7, 23.2, 24.7, 26.9, 29.6, 32.4, 33.6];
const thumbCache = new Map();
function thumb(tt) {
  if (thumbCache.has(tt)) return thumbCache.get(tt);
  const c = document.createElement('canvas');
  c.width = 480; c.height = 270;
  const g = c.getContext('2d');
  raw && raw(g, tt, 0.25);
  thumbCache.set(tt, c);
  return c;
}
function filmStrip(ctx, t, offset, y, fw = 480, fh = 270, alpha = 1) {
  const gap = 36, pitch = fw + gap;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#121212';
  ctx.fillRect(-20, y - fh / 2 - 60, W + 40, fh + 120);
  ctx.fillStyle = '#050505';
  for (let x = ((offset % 60) + 60) % 60 - 60; x < W + 60; x += 60) {
    ctx.fillRect(x, y - fh / 2 - 44, 30, 22);
    ctx.fillRect(x, y + fh / 2 + 22, 30, 22);
  }
  THUMB_T.forEach((tt, i) => {
    const x = offset + i * pitch;
    if (x < -fw || x > W + fw) return;
    ctx.drawImage(thumb(tt), x - fw / 2, y - fh / 2, fw, fh);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2;
    ctx.strokeRect(x - fw / 2, y - fh / 2, fw, fh);
    const f = Math.round(tt * 60);
    text(ctx, `${String(i + 1).padStart(2, '0')}  ·  F${String(f).padStart(4, '0')}`, x - fw / 2, y + fh / 2 + 16, { family: F.mono, size: 14, color: '#E8A04B', alpha: 0.85 });
  });
  ctx.restore();
  return pitch;
}
const tc = (s) => {
  const f = Math.floor((s % 1) * 60), ss = Math.floor(s) % 60, m = Math.floor(s / 60);
  return `00:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

export function drawAct2(ctx, t, P) {
  P.grain = 0.045; P.vig = 0.55; P.bloom = 0.5; P.scan = 0.25;

  // ===== 20–22 · the drop: invert-flash of the sketch, then it bursts into tokens =====
  if (t < 22) {
    if (t < 20.14) {
      drawAct1(ctx, 18.9, {});
      P.invert = 1; P.ca = 0.012; P.zoomBlur = 0.08; P.bloom = 1.2; P.scan = 0;
      return;
    }
    darkBg(ctx, t, '#E8633A', 0.4 * (1 - prog(t, 20.1, 21.5)));
    const lp = ease.outExpo(prog(t, 20.1, 21.4));
    const cp = ease.inOutExpo(prog(t, 21.15, 21.95));
    const ps = getParticles();
    ctx.save();
    ps.forEach((p, i) => {
      const ex = p.x + p.vx * lp * 0.75, ey = p.y + p.vy * lp * 0.75 + lp * lp * 40;
      const ang = (i / ps.length) * Math.PI * 2 + t * 3;
      const rr = 340 * (1 - cp) + 20;
      const x = lerp(ex, W / 2 + Math.cos(ang) * rr, cp), y = lerp(ey, H / 2 - 60 + Math.sin(ang) * rr, cp);
      const col = p.c > 0.8 ? C.coral : p.c > 0.6 ? C.teal : C.cream;
      const ch = hash(p.id, Math.floor(t * 20)) > 0.7 ? GLYPHS[Math.floor(hash(p.id, Math.floor(t * 20), 1) * GLYPHS.length)] : p.ch;
      text(ctx, ch, x, y, { family: F.mono, size: p.size * (1 - cp * 0.5), color: col, align: 'center', alpha: 0.9 });
    });
    ctx.restore();
    const tp = prog(t, 20.25, 21.9);
    if (tp > 0) {
      const a = 1 - prog(t, 21.6, 21.9);
      revealText(ctx, '然后，AI 来了。', W / 2, H / 2 + 50, { family: F.serif, size: 150, weight: 900, color: C.cream, align: 'center', alpha: a }, prog(t, 20.25, 20.9), { stagger: 0.05, rise: 60 });
      text(ctx, 'NOVEMBER 30, 2022  ·  THE WORLD CHANGED ITS DEFAULTS', W / 2, H / 2 + 150, { family: F.mono, size: 22, color: C.creamDim, align: 'center', ls: 4, alpha: a * prog(t, 20.8, 21.1) });
    }
    P.glitch = Math.max(0, 0.6 - (t - 20.14) * 1.2) + (t > 21.85 ? 0.8 : 0);
    P.ca = 0.004 + P.glitch * 0.01;
    P.flash = t > 21.92 ? 0.9 : 0;
    return;
  }

  // ===== 22–26 · logo roll call, one per beat =====
  if (t < 26) {
    const idx = Math.floor((t - 22) / 0.5), lt = (t - 22) - idx * 0.5;
    const s = SLAMS[idx];
    darkBg(ctx, t, s.tint, 0.55);
    // radiating hairlines, mirrored — a kaleidoscope that turns every beat
    ctx.save();
    ctx.translate(W / 2, H / 2 - 60);
    ctx.rotate(idx * 0.26 + lt * 0.3);
    ctx.strokeStyle = s.tint; ctx.globalAlpha = 0.14;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 260, Math.sin(a) * 260); ctx.lineTo(Math.cos(a) * 1400, Math.sin(a) * 1400); ctx.stroke();
    }
    ctx.restore();
    const e = ease.outExpo(clamp(lt / 0.3));
    const sc = 1 + 0.55 * (1 - e);
    ctx.save();
    zoomAt(ctx, sc, W / 2, H / 2 - 60);
    const colorKey = images['logo_' + s.slug + '-color'] && idx % 2 === 1 ? s.slug + '-color' : s.slug;
    drawLogo(ctx, colorKey, W / 2, H / 2 - 70, 300);
    ctx.restore();
    text(ctx, s.name, W / 2, H / 2 + 230, { family: F.grotesk, size: 88, weight: 700, color: C.cream, align: 'center', ls: 2 + (1 - e) * 30, alpha: e });
    hud(ctx, `MODEL ${String(idx + 1).padStart(2, '0')} / 08`, '2022 → 2026');
    // progress ticks
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i <= idx ? C.coral : 'rgba(244,239,227,0.2)';
      ctx.fillRect(W / 2 - 8 * 44 / 2 + i * 44, H - 90, 32, 4);
    }
    P.zoomBlur = 0.14 * (1 - clamp(lt / 0.16));
    P.ca = 0.003 + 0.012 * (1 - clamp(lt / 0.12));
    P.flash = lt < 0.035 ? 0.35 : 0;
    return;
  }

  // ===== 26–28 · the new stack fills the grid, then we dive into it =====
  if (t < 28) {
    darkBg(ctx, t, '#78D7BD', 0.2);
    const cols = 8, rows = 4, cw = 196, ch = 196;
    const gx = W / 2 - (cols * cw) / 2, gy = H / 2 - (rows * ch) / 2 + 20;
    const dive = ease.inExpo(prog(t, 27.25, 28));
    ctx.save();
    zoomAt(ctx, 1 + dive * 14, W / 2, H / 2 + 20);
    ctx.strokeStyle = 'rgba(244,239,227,0.12)'; ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(gx + i * cw, gy); ctx.lineTo(gx + i * cw, gy + rows * ch * prog(t, 26, 26.4)); ctx.stroke(); }
    for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(gx, gy + j * ch); ctx.lineTo(gx + cols * cw * prog(t, 26, 26.4), gy + j * ch); ctx.stroke(); }
    // fill order spirals from the middle outward
    const order = GRID_LOGOS.map((_, i) => i).sort((a, b) => {
      const da = Math.hypot((a % cols) - 3.5, Math.floor(a / cols) - 1.5), db = Math.hypot((b % cols) - 3.5, Math.floor(b / cols) - 1.5);
      return da - db;
    });
    order.forEach((gi, k) => {
      const t0 = 26.0 + k * 0.036;
      const p = ease.outBack(prog(t, t0, t0 + 0.22));
      if (p <= 0) return;
      const x = gx + (gi % cols) * cw + cw / 2, y = gy + Math.floor(gi / cols) * ch + ch / 2;
      const lit = k === 0 ? 1 : 0.85;
      drawLogo(ctx, GRID_LOGOS[gi], x, y, 88 * p, lit);
      text(ctx, GRID_LOGOS[gi].toUpperCase(), x - cw / 2 + 12, y + ch / 2 - 12, { family: F.mono, size: 12, color: C.creamDim, alpha: 0.6 * clamp(p) });
    });
    ctx.restore();
    const a = 1 - dive * 3;
    hud(ctx, 'THE NEW STACK  ·  2022 → 2026', `${Math.min(32, Math.floor(prog(t, 26, 27.2) * 32))} / 32`, clamp(a));
    text(ctx, '工具，一夜之间长满了整个世界。', W / 2, H - 70, { family: F.serif, size: 40, weight: 700, color: C.cream, align: 'center', alpha: clamp(a) * prog(t, 26.3, 26.6) });
    P.zoomBlur = dive * 0.5;
    P.flash = prog(t, 27.82, 28) * 0.95;
    return;
  }

  // ===== 28–31 · 95% =====
  if (t < 31) {
    darkBg(ctx, t);
    codeRain(ctx, t, 1);
    const ip = ease.outExpo(prog(t, 28, 28.5));
    const n = Math.round(95 * ease.outExpo(prog(t, 28.05, 29.3)));
    const exit = ease.inExpo(prog(t, 30.7, 31));
    ctx.save();
    ctx.translate(0, -exit * 200);
    ctx.globalAlpha = 1 - exit;
    zoomAt(ctx, 1.25 - ip * 0.25 + (t - 28) * 0.02, W / 2, H / 2);
    text(ctx, 'Y COMBINATOR  ·  WINTER 2025 BATCH', W / 2, 250, { family: F.mono, size: 26, color: C.creamDim, align: 'center', ls: 6, alpha: ip });
    const nw = measure(ctx, String(n), { family: F.grotesk, size: 400, weight: 700 });
    text(ctx, String(n), W / 2 - 80, 680, { family: F.grotesk, size: 400, weight: 700, color: C.cream, align: 'center', ls: -12 });
    text(ctx, '%', W / 2 - 80 + nw / 2 + 10, 680, { family: F.grotesk, size: 220, weight: 700, color: C.coral });
    revealText(ctx, '四分之一的入选公司，95% 的代码由 AI 写成。', W / 2, 820, { family: F.sans, size: 44, weight: 500, color: C.cream, align: 'center' }, prog(t, 28.6, 29.4), { stagger: 0.02, rise: 20 });
    ctx.restore();
    P.ca = 0.004 + (1 - ip) * 0.01;
    return;
  }

  // ===== 31–33 · vibe coding =====
  if (t < 33) {
    darkBg(ctx, t);
    const o = { family: F.mono, size: 76, weight: 500, color: C.cream, cursorColor: C.coral };
    typeText(ctx, '“forget that the code', 260, 460, o, prog(t, 31.05, 31.7), t < 31.7, t);
    if (t >= 31.7) typeText(ctx, ' even exists.”', 260, 560, { ...o, color: C.coral }, prog(t, 31.7, 32.15), true, t);
    text(ctx, '— Andrej Karpathy, on “vibe coding”', 270, 660, { family: F.mono, size: 26, color: C.creamDim, alpha: prog(t, 32.1, 32.35) });
    text(ctx, '忘掉代码的存在。', W - 260, 800, { family: F.serif, size: 56, weight: 900, color: C.cream, align: 'right', alpha: prog(t, 32.2, 32.45) });
    hud(ctx, 'VIBE CODING', '2025.02');
    P.flash = t > 32.95 ? 0.4 : 0;
    return;
  }

  // ===== 33–34 · when code is no longer scarce =====
  if (t < 34) {
    fillBg(ctx, '#000');
    const p = prog(t, 33.0, 33.5);
    revealText(ctx, '当代码不再稀缺——', W / 2, H / 2 + 45, { family: F.serif, size: 130, weight: 900, color: C.cream, align: 'center' }, p, { stagger: 0.04, rise: 30 });
    const lw = ease.inOutExpo(prog(t, 33.4, 33.9));
    ctx.fillStyle = C.coral; ctx.fillRect(W / 2 - 560, H / 2 + 110, 1120 * lw, 6);
    P.ca = 0.004;
    return;
  }

  // ===== 34–35 · 拉片: rewind through everything we just saw =====
  if (t < 36) {
    const pitch = 480 + 36;
    // end state: frame 0 (the bulb) centered
    const endOff = W / 2;
    const r = ease.inOutCubic(prog(t, 34.0, 35.0));
    const startOff = W / 2 - (THUMB_T.length - 1) * pitch;
    const off = lerp(startOff, endOff, r);
    const vel = (lerp(startOff, endOff, ease.inOutCubic(prog(t + 1 / 60, 34, 35))) - off) * 60;
    const zoom = ease.inOutExpo(prog(t, 35.0, 35.45));
    fillBg(ctx, '#0a0a0a');
    ctx.save();
    // zoom into the idea frame until it fills the screen
    const s = lerp(1, W / 480, zoom);
    ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
    filmStrip(ctx, t, off, H / 2, 480, 270);
    ctx.restore();
    const hudA = 1 - zoom;
    const shown = lerp(33.6, 5.95, r);
    text(ctx, tc(shown), W / 2, 200, { family: F.mono, size: 64, weight: 500, color: '#E8A04B', align: 'center', alpha: hudA, ls: 2 });
    text(ctx, '◀◀  拉片 · REWIND', 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, alpha: hudA });
    text(ctx, `×${Math.max(1, Math.round(Math.abs(vel) / 60))}`, W - 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, align: 'right', alpha: hudA });
    ctx.fillStyle = `rgba(232,160,75,${0.8 * hudA})`; ctx.fillRect(W / 2 - 1, H / 2 - 200, 2, 400);
    P.dirBlur = [clamp(vel / 60000, -0.05, 0.05), 0];
    P.scan = 0.5; P.ca = 0.006; P.bloom = 0.3;
    if (zoom >= 1) {
      // the idea, full frame again — and the question
      raw && raw(ctx, 5.95);
      ctx.fillStyle = 'rgba(243,238,227,0.55)'; ctx.fillRect(0, 0, W, H);
      revealText(ctx, '那么，什么才是稀缺的？', W / 2, H - 120, { family: F.serif, size: 84, weight: 900, color: C.graphite, align: 'center' }, prog(t, 35.45, 35.75), { stagger: 0.025, rise: 20 });
      P.scan = 0; P.bloom = 0; P.vig = 0.4; P.warm = 0.4; P.dirBlur = [0, 0];
    }
    return;
  }

  // ===== 36–38 · the answer, one word per beat, flipping light/dark =====
  const words = [
    ['注意力', 'M-01 · 这个时代唯一真正稀缺的东西', '#050607', C.cream],
    ['判断力', '“你只有不懂，才会认为它说的绝对是对的。”', C.paper, C.ink],
    ['品味', 'TASTE · 做出让人眼前一新的东西', C.coral, C.ink],
  ];
  if (t < 37.5) {
    const i = Math.min(2, Math.floor((t - 36) / 0.5)), lt = t - 36 - i * 0.5;
    const [w, sub, bg, fg] = words[i];
    fillBg(ctx, bg);
    const e = ease.outExpo(clamp(lt / 0.25));
    ctx.save();
    zoomAt(ctx, 1.18 - 0.18 * e + lt * 0.08, W / 2, H / 2);
    text(ctx, w, W / 2, H / 2 + 110, { family: F.serif, size: 320, weight: 900, color: fg, align: 'center', ls: 20 });
    ctx.restore();
    text(ctx, sub, W / 2, H / 2 + 250, { family: F.mono, size: 26, color: fg, align: 'center', alpha: 0.7 * e });
    text(ctx, `0${i + 1} / 03`, 80, 90, { family: F.mono, size: 22, color: fg, ls: 3, alpha: 0.6 });
    P.scan = 0; P.bloom = 0; P.vig = 0.3;
    P.zoomBlur = 0.1 * (1 - clamp(lt / 0.12));
    P.ca = 0.01 * (1 - clamp(lt / 0.15));
    return;
  }
  // 37.5–38: the three words settle into one line + the handbook's thesis
  fillBg(ctx, '#050607');
  const p = ease.outExpo(prog(t, 37.5, 37.75));
  const xs = [-420, 0, 380];
  ['注意力', '判断力', '品味'].forEach((w, i) => {
    text(ctx, w, W / 2 + xs[i] * p, H / 2 + 20, { family: F.serif, size: lerp(320, 120, p), weight: 900, color: i === 2 ? C.coral : C.cream, align: 'center', alpha: i === 1 ? 1 : p });
  });
  text(ctx, '—— 判断力本身，就是资产。', W / 2, H / 2 + 150, { family: F.sans, size: 36, weight: 500, color: C.creamDim, align: 'center', alpha: prog(t, 37.62, 37.8) });
  P.scan = 0; P.bloom = 0.2;
  P.flash = prog(t, 37.9, 38) * 0.9; P.flashColor = [0.953, 0.933, 0.89];
}
```

### 13/18 · `promo/src/act3.js`
<!-- casebook-file {"path": "promo/src/act3.js", "lines": 379, "final_newline": true, "sha256": "d2e600c98d970e288d731068cef1a3443f927810fc77cb24bf6c217690bdb05c", "original_sha256": "d2e600c98d970e288d731068cef1a3443f927810fc77cb24bf6c217690bdb05c"} -->
```js
// 38–62s · Us. The style converges: warm paper (the human) × precise UI (the machine).
// Members, verifiable tokens, running products, and the handbook's principles.
import {
  W, H, C, F, clamp, lerp, prog, ease, hash, hs, text, revealText, typeText, measure, fillBg, images, circleImage, roundRect, zoomAt,
} from './core.js';
import { MEMBERS, TOKENS, PRODUCTS, FEED, PRINCIPLES } from './data.js';

const BG = '#FAF8F3';
const INK = '#141414';
const MUTED = '#8A857C';

// Fine print-dot screen over upscaled avatars: reads as texture, hides the upscale.
let dots = null;
function halftone(ctx, cx, cy, r, a) {
  if (!dots) {
    const c = document.createElement('canvas'); c.width = c.height = 8;
    const g = c.getContext('2d'); g.fillStyle = '#000'; g.beginPath(); g.arc(4, 4, 1.6, 0, 7); g.fill();
    dots = ctx.createPattern(c, 'repeat');
  }
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  ctx.fillStyle = dots; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r);
  g.addColorStop(0, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}
export function avatar(ctx, m, cx, cy, r, o = {}) {
  const { alpha = 1, dark = false, ring = 0 } = o;
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (m.img && images['av_' + m.img]) {
    circleImage(ctx, images['av_' + m.img], cx, cy, r);
    if (r > 110) halftone(ctx, cx, cy, r, m.img.endsWith('_big') ? 0.1 : 0.2);
  } else {
    ctx.fillStyle = dark ? '#1E2124' : '#F1EEE8';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'; ctx.lineWidth = Math.max(1, r * 0.02);
    ctx.stroke();
    text(ctx, m.mono || m.name[0], cx, cy + r * 0.2, { family: F.sans, size: r * 0.62, weight: 400, color: dark ? '#9C978D' : '#6F6A62', align: 'center' });
  }
  if (ring > 0) {
    ctx.strokeStyle = C.coral; ctx.lineWidth = Math.max(2, r * 0.035); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.09, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring); ctx.stroke();
  }
  ctx.restore();
}
function chip(ctx, label, x, y, size = 22, o = {}) {
  const { dark = false, alpha = 1, accent = false } = o;
  const w = measure(ctx, label, { size, weight: 500 }) + size * 1.1;
  const h = size * 1.7;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.fillStyle = accent ? C.coral : dark ? 'rgba(255,255,255,0.1)' : '#EFEBE3';
  roundRect(ctx, x, y - h * 0.72, w, h, h / 2); ctx.fill();
  ctx.restore();
  text(ctx, label, x + size * 0.55, y + size * 0.1, { size, weight: 500, color: accent ? '#fff' : dark ? C.cream : INK, alpha });
  return w;
}
function statusChip(ctx, x, y, t, alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.fillStyle = '#EFEBE3'; roundRect(ctx, x, y - 22, 118, 36, 18); ctx.fill();
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);
  ctx.fillStyle = `rgba(52,168,110,${0.25 * pulse})`; ctx.beginPath(); ctx.arc(x + 22, y - 4, 10 + pulse * 3, 0, 7); ctx.fill();
  ctx.fillStyle = '#34A86E'; ctx.beginPath(); ctx.arc(x + 22, y - 4, 5.5, 0, 7); ctx.fill();
  ctx.restore();
  text(ctx, '运行中', x + 38, y + 4, { size: 20, weight: 500, color: INK, alpha });
}
function card(ctx, x, y, w, h, o = {}) {
  const { alpha = 1, dark = false, r = 22 } = o;
  ctx.save(); ctx.globalAlpha *= alpha;
  ctx.shadowColor = 'rgba(40,30,20,0.08)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  ctx.fillStyle = dark ? '#16181B' : '#FFFFFF';
  roundRect(ctx, x, y, w, h, r); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : '#E9E4DA'; ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, r); ctx.stroke();
  ctx.restore();
}
function grid(ctx, color = 'rgba(20,20,20,0.045)') {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 96) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 96) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();
}
function corner(ctx, l, r, dark, alpha = 1) {
  const col = dark ? C.creamDim : MUTED;
  text(ctx, l, 80, 84, { family: F.mono, size: 20, color: col, ls: 3, alpha });
  text(ctx, r, W - 80, 84, { family: F.mono, size: 20, color: col, ls: 3, align: 'right', alpha });
}
function bars(ctx, arr, x, y, w, h, p, color = INK) {
  const n = arr.length, bw = w / n;
  arr.forEach((v, i) => {
    const lp = ease.outExpo(clamp(p * 1.6 - (i / n) * 0.6));
    const bh = Math.max(2, v * h * lp);
    ctx.fillStyle = color;
    ctx.fillRect(x + i * bw + bw * 0.12, y + h - bh, bw * 0.76, bh);
  });
}

// ------------------------------------------------------------
const BIG = MEMBERS.slice(0, 4);
const FAST = MEMBERS.slice(4);

function memberBig(ctx, m, i, lt, t) {
  const dark = i % 2 === 1, flip = i % 2 === 1;
  fillBg(ctx, dark ? '#0B0D0F' : BG);
  grid(ctx, dark ? 'rgba(255,255,255,0.035)' : 'rgba(20,20,20,0.04)');
  const fg = dark ? C.cream : INK, sub = dark ? C.creamDim : MUTED;
  const e = ease.outExpo(clamp(lt / 0.3));
  ctx.save();
  zoomAt(ctx, 1.06 - 0.06 * e + lt * 0.05, W / 2, H / 2);
  const ax = flip ? W - 560 : 560, tx = flip ? W - 1000 : 1000, al = flip ? 'right' : 'left';
  avatar(ctx, m, ax + (flip ? -1 : 1) * (1 - e) * 120, H / 2, 250, { ring: ease.outCubic(clamp(lt / 0.45)), dark });
  const sx = (1 - e) * (flip ? -80 : 80);
  text(ctx, `${String(i + 1).padStart(2, '0')} / 11`, tx + sx, 330, { family: F.mono, size: 24, color: C.coral, align: al, ls: 3, alpha: e });
  text(ctx, m.name, tx + sx, 480, { family: F.sans, size: m.name.length > 8 ? 120 : 150, weight: 900, color: fg, align: al, alpha: e });
  text(ctx, `${m.handle}  ·  ${m.real}`, tx + sx * 1.4, 560, { family: F.mono, size: 40, color: sub, align: al, alpha: e });
  const cw = measure(ctx, m.role, { size: 30, weight: 500 }) + 33;
  chip(ctx, m.role, flip ? tx + sx * 1.6 - cw : tx + sx * 1.6, 640, 30, { dark, alpha: e, accent: m.role === '构建者' });
  if (m.line) text(ctx, m.line, tx + sx * 1.8, 760, { family: F.serif, size: 48, weight: 700, color: fg, align: al, alpha: e });
  if (m.joined) text(ctx, m.joined, tx + sx * 2, 830, { family: F.mono, size: 26, color: sub, align: al, alpha: e });
  ctx.restore();
  corner(ctx, 'MEMBERS  ·  成员', '加入了 Protocom', dark);
}
function memberFast(ctx, m, i, lt) {
  const dark = i % 2 === 0;
  fillBg(ctx, dark ? '#0B0D0F' : BG);
  const fg = dark ? C.cream : INK;
  const e = ease.outExpo(clamp(lt / 0.12));
  ctx.save();
  zoomAt(ctx, 1.12 - 0.12 * e, W / 2, H / 2);
  const side = i % 2 === 0 ? -1 : 1;
  avatar(ctx, m, W / 2 + side * 380, H / 2, 300, { dark });
  const al = side < 0 ? 'left' : 'right';
  const tx = side < 0 ? W / 2 + 40 : W / 2 - 40;
  text(ctx, m.name, tx, H / 2 + 20, { family: F.sans, size: 170, weight: 900, color: fg, align: al });
  text(ctx, m.handle, tx, H / 2 + 110, { family: F.mono, size: 48, color: C.coral, align: al });
  ctx.restore();
  text(ctx, `${String(i + 5).padStart(2, '0')} / 11`, 80, 84, { family: F.mono, size: 20, color: dark ? C.creamDim : MUTED, ls: 3 });
}
function memberGrid(ctx, t) {
  fillBg(ctx, BG);
  grid(ctx);
  const p0 = 44.75;
  revealText(ctx, '成员', 180, 200, { family: F.sans, size: 64, weight: 900, color: INK }, prog(t, p0, p0 + 0.3), { stagger: 0.05, rise: 20 });
  text(ctx, '有公开地址的人。', 180, 250, { size: 28, color: MUTED, alpha: prog(t, p0 + 0.15, p0 + 0.4) });
  text(ctx, '11 位 · 同路人与构建者', W - 180, 200, { family: F.mono, size: 26, color: C.coral, align: 'right', alpha: prog(t, p0 + 0.2, p0 + 0.5) });
  const cols = 4, cw = 390, chh = 150, gx = W / 2 - (cols * cw + (cols - 1) * 20) / 2, gy = 310;
  const tiles = [...MEMBERS, null];
  tiles.forEach((m, k) => {
    const cx = gx + (k % cols) * (cw + 20), cy = gy + Math.floor(k / cols) * (chh + 22);
    const p = ease.outBack(prog(t, p0 + 0.1 + k * 0.05, p0 + 0.45 + k * 0.05));
    if (p <= 0) return;
    ctx.save();
    ctx.translate(cx + cw / 2, cy + chh / 2); ctx.scale(0.85 + 0.15 * p, 0.85 + 0.15 * p); ctx.translate(-cx - cw / 2, -cy - chh / 2);
    ctx.globalAlpha = clamp(p);
    if (m) {
      card(ctx, cx, cy, cw, chh, { r: 20 });
      avatar(ctx, m, cx + 72, cy + chh / 2, 42);
      text(ctx, m.name, cx + 134, cy + 68, { size: 32, weight: 700, color: INK });
      text(ctx, m.handle, cx + 134, cy + 108, { family: F.mono, size: 22, color: MUTED });
      chip(ctx, m.role, cx + cw - 110, cy + chh / 2 + 6, 20, { accent: m.role === '构建者' });
    } else {
      // the empty seat
      ctx.setLineDash([10, 8]); ctx.strokeStyle = C.coral; ctx.lineWidth = 2.5;
      roundRect(ctx, cx, cy, cw, chh, 20); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.coral; ctx.beginPath(); ctx.arc(cx + 72, cy + chh / 2, 42, 0, 7); ctx.stroke();
      text(ctx, '+', cx + 72, cy + chh / 2 + 16, { size: 48, color: C.coral, align: 'center' });
      text(ctx, '下一个是你', cx + 134, cy + 68, { size: 32, weight: 700, color: C.coral });
      typeText(ctx, '@________', cx + 134, cy + 108, { family: F.mono, size: 22, color: C.coral }, 1, true, t);
    }
    ctx.restore();
  });
}

// ------------------------------------------------------------
function tokens(ctx, t) {
  fillBg(ctx, '#0B0D0F');
  grid(ctx, 'rgba(255,255,255,0.035)');
  const tp = prog(t, 47, 47.3);
  corner(ctx, 'TOKENS  ·  可验证统计', '公开排行榜', true, tp);
  const settle = ease.inOutExpo(prog(t, 48.4, 49.0));
  // headline number
  const v = 76.0 * ease.outExpo(prog(t, 47.05, 48.2));
  ctx.save();
  const hy = lerp(H / 2 + 60, 250, settle), hs2 = lerp(1, 0.46, settle);
  ctx.translate(W / 2, hy); ctx.scale(hs2, hs2);
  const str = v.toFixed(1);
  const nw = measure(ctx, str, { family: F.grotesk, size: 360, weight: 700 });
  text(ctx, str, -70, 0, { family: F.grotesk, size: 360, weight: 700, color: C.cream, align: 'center', ls: -10 });
  text(ctx, 'B', -70 + nw / 2 + 12, 0, { family: F.grotesk, size: 360, weight: 700, color: C.coral });
  ctx.restore();
  text(ctx, '760 亿 Tokens · 来自 4 位公开参与者', W / 2, H / 2 + 170, { family: F.sans, size: 44, weight: 500, color: C.cream, align: 'center', alpha: prog(t, 47.5, 47.8) * (1 - settle) });
  text(ctx, '不是估算。每一个 Token 都可以被验证。', W / 2, H / 2 + 240, { family: F.mono, size: 26, color: C.creamDim, align: 'center', alpha: prog(t, 47.8, 48.1) * (1 - settle) });
  if (settle <= 0) return;
  // leaderboard rows
  TOKENS.forEach((r, i) => {
    const t0 = 48.75 + i * 0.12;
    const p = ease.outExpo(prog(t, t0, t0 + 0.4));
    if (p <= 0) return;
    const y = 400 + i * 150;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.translate((1 - p) * 120, 0);
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; roundRect(ctx, 180, y, W - 360, 124, 20); ctx.fill();
    text(ctx, String(i + 1), 240, y + 80, { family: F.grotesk, size: 48, weight: 700, color: i === 0 ? C.coral : C.cream, align: 'center' });
    avatar(ctx, r, 340, y + 62, 40);
    text(ctx, r.name, 400, y + 56, { size: 34, weight: 700, color: C.cream });
    text(ctx, r.handle, 400, y + 96, { family: F.mono, size: 22, color: C.creamDim });
    text(ctx, `${r.days} 天活跃`, 820, y + 72, { family: F.mono, size: 24, color: C.creamDim });
    text(ctx, `连续 ${r.streak} 天`, 820, y + 104, { family: F.mono, size: 18, color: '#6d6a63' });
    bars(ctx, r.bars, 1060, y + 22, 470, 80, prog(t, t0 + 0.1, t0 + 1.2), i === 0 ? C.coral : C.cream);
    const val = r.value * ease.outExpo(prog(t, t0, t0 + 1.0));
    text(ctx, `${val.toFixed(1)}B`, W - 230, y + 80, { family: F.grotesk, size: 54, weight: 700, color: C.cream, align: 'right' });
    ctx.restore();
  });
}

// ------------------------------------------------------------
function products(ctx, t) {
  fillBg(ctx, BG);
  grid(ctx);
  corner(ctx, 'PRODUCTS  ·  共同体产品', 'tommy0103/obelisk', false, prog(t, 51, 51.3));
  const h1 = prog(t, 51.0, 51.4), h2 = prog(t, 51.55, 51.95);
  const lift = ease.inOutExpo(prog(t, 52.0, 52.5));
  ctx.save();
  ctx.translate(0, lerp(0, -330, lift));
  const sc = lerp(1, 0.62, lift);
  zoomAt(ctx, sc, W / 2, H / 2);
  revealText(ctx, '不是 PPT 上的项目。', W / 2, H / 2 - 30, { family: F.serif, size: 110, weight: 900, color: INK, align: 'center' }, h1, { stagger: 0.03, rise: 30 });
  if (h2 > 0) {
    const w1 = measure(ctx, '是正在', { family: F.serif, size: 110, weight: 900 });
    const w2 = measure(ctx, '运行', { family: F.serif, size: 110, weight: 900 });
    const w3 = measure(ctx, '的系统。', { family: F.serif, size: 110, weight: 900 });
    const x0 = W / 2 - (w1 + w2 + w3) / 2;
    revealText(ctx, '是正在', x0, H / 2 + 110, { family: F.serif, size: 110, weight: 900, color: INK }, h2, { stagger: 0.03, rise: 30 });
    revealText(ctx, '运行', x0 + w1, H / 2 + 110, { family: F.serif, size: 110, weight: 900, color: C.coral }, h2, { stagger: 0.03, rise: 30 });
    revealText(ctx, '的系统。', x0 + w1 + w2, H / 2 + 110, { family: F.serif, size: 110, weight: 900, color: INK }, h2, { stagger: 0.03, rise: 30 });
  }
  ctx.restore();
  if (lift <= 0) return;
  // bento
  const push = 1 + (t - 52) * 0.012;
  ctx.save();
  zoomAt(ctx, push, W / 2, H / 2 + 120);
  const gy = 340;
  const boxes = [
    [140, gy, 800, 330], [960, gy, 820, 155], [960, gy + 175, 820, 155], [140, gy + 350, 1640, 330],
  ];
  boxes.forEach((b, i) => {
    const p = ease.outBack(prog(t, 52.2 + i * 0.1, 52.6 + i * 0.1));
    if (p <= 0) return;
    const [x, y, w, h] = b;
    ctx.save();
    ctx.globalAlpha = clamp(p);
    ctx.translate(0, (1 - p) * 60);
    card(ctx, x, y, w, h);
    if (i < 3) {
      const pr = PRODUCTS[i];
      ctx.fillStyle = '#F3F0EA'; roundRect(ctx, x + 30, y + 30, 64, 64, 14); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
      // package glyph
      const gx2 = x + 62, gy2 = y + 62;
      ctx.beginPath(); ctx.moveTo(gx2, gy2 - 16); ctx.lineTo(gx2 + 15, gy2 - 8); ctx.lineTo(gx2 + 15, gy2 + 9); ctx.lineTo(gx2, gy2 + 17); ctx.lineTo(gx2 - 15, gy2 + 9); ctx.lineTo(gx2 - 15, gy2 - 8); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx2 - 15, gy2 - 8); ctx.lineTo(gx2, gy2); ctx.lineTo(gx2 + 15, gy2 - 8); ctx.moveTo(gx2, gy2); ctx.lineTo(gx2, gy2 + 17); ctx.stroke();
      text(ctx, pr.name, x + 120, y + 60, { size: 36, weight: 700, color: INK });
      text(ctx, pr.desc, x + 120, y + 100, { size: 24, color: MUTED });
      statusChip(ctx, x + w - 150, y + 58, t);
      if (i === 0) {
        // a live slice of the member directory
        MEMBERS.slice(0, 6).forEach((m, k) => {
          const mx = x + 40 + (k % 2) * 380, my = y + 160 + Math.floor(k / 2) * 56;
          const mp = prog(t, 52.6 + k * 0.08, 52.9 + k * 0.08);
          avatar(ctx, m, mx + 20, my, 20, { alpha: mp });
          text(ctx, m.name, mx + 54, my + 8, { size: 24, weight: 500, color: INK, alpha: mp });
          text(ctx, m.handle, mx + 54 + measure(ctx, m.name, { size: 24, weight: 500 }) + 12, my + 8, { family: F.mono, size: 18, color: MUTED, alpha: mp });
        });
      }
    } else {
      // live GitHub activity feed from obelisk
      text(ctx, '最近活动', x + 40, y + 60, { size: 34, weight: 700, color: INK });
      text(ctx, '社群内可见的近况。', x + 200, y + 60, { size: 24, color: MUTED });
      ctx.save();
      ctx.beginPath(); ctx.rect(x + 20, y + 90, w - 40, h - 110); ctx.clip();
      const scroll = (t - 52.5) * 90;
      for (let k = 0; k < 10; k++) {
        const f = FEED[k % FEED.length];
        const fy = y + 140 + k * 64 - scroll;
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + 54, fy - 8, 11, 0, 7); ctx.fill();
        const s1 = `KinomotoMio ${f[0]} ${f[1]}：`;
        text(ctx, s1, x + 80, fy, { size: 26, weight: 700, color: INK });
        const s1w = measure(ctx, s1, { size: 26, weight: 700 });
        text(ctx, f[2], x + 80 + s1w, fy, { size: 26, color: INK });
        text(ctx, '· tommy0103/obelisk', x + 80 + s1w + measure(ctx, f[2], { size: 26 }) + 14, fy, { family: F.mono, size: 20, color: MUTED });
      }
      ctx.restore();
    }
    ctx.restore();
  });
  ctx.restore();
}

// ------------------------------------------------------------
function principle(ctx, t, i, lt) {
  const pr = PRINCIPLES[i];
  const dark = i % 2 === 0;
  const bg = dark ? '#0B0D0F' : BG, fg = dark ? C.cream : INK;
  fillBg(ctx, bg);
  const e = ease.outExpo(clamp(lt / 0.35));
  // mirror-split entrance: top half from the left, bottom half from the right
  const off = (1 - e) * 700;
  const size = 150;
  const draw = () => {
    text(ctx, pr.a, W / 2, H / 2 - 40, { family: F.serif, size, weight: 900, color: i % 3 === 0 ? C.coral : fg, align: 'center' });
    text(ctx, pr.b, W / 2, H / 2 + 150, { family: F.serif, size: size * 0.72, weight: 900, color: fg, align: 'center' });
  };
  const drift = lt * 30;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H / 2 + 30); ctx.clip(); ctx.translate(-off - drift, 0); draw(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 + 30, W, H); ctx.clip(); ctx.translate(off + drift, 0); draw(); ctx.restore();
  ctx.fillStyle = C.coral; ctx.fillRect(0, H / 2 + 29, W * ease.inOutExpo(clamp(lt / 0.4)), 2);
  text(ctx, `${pr.code}  ·  ${pr.kind}`, 80, 84, { family: F.mono, size: 22, color: dark ? C.creamDim : MUTED, ls: 3 });
  text(ctx, '共建手册 v0.1', W - 80, 84, { family: F.mono, size: 22, color: dark ? C.creamDim : MUTED, ls: 3, align: 'right' });
  text(ctx, `${String(i + 1).padStart(2, '0')} / 06`, W - 80, H - 70, { family: F.mono, size: 22, color: C.coral, ls: 3, align: 'right' });
}

// ------------------------------------------------------------
export function drawAct3(ctx, t, P) {
  P.grain = 0.03; P.vig = 0.25; P.ca = 0.0012;

  // 38–41 · intro
  if (t < 41) {
    fillBg(ctx, BG);
    grid(ctx);
    const a = 1 - prog(t, 40.3, 40.6);
    text(ctx, 'NCC  ·  WUHAN  ·  2025 → NOW', W / 2, 330, { family: F.mono, size: 26, color: MUTED, align: 'center', ls: 6, alpha: prog(t, 38.05, 38.4) * a });
    revealText(ctx, '于是，在 NCC，', W / 2, 500, { family: F.serif, size: 120, weight: 900, color: INK, align: 'center', alpha: a }, prog(t, 38.1, 38.8), { stagger: 0.04 });
    revealText(ctx, '一群学生聚在了一起。', W / 2, 660, { family: F.serif, size: 120, weight: 900, color: INK, align: 'center', alpha: a }, prog(t, 38.7, 39.5), { stagger: 0.04 });
    // avatar row pops in, then the first one grows into the montage (match cut)
    const grow = ease.inExpo(prog(t, 40.55, 41.0));
    MEMBERS.forEach((m, k) => {
      const p = ease.outBack(prog(t, 39.6 + k * 0.05, 39.9 + k * 0.05));
      if (p <= 0) return;
      const baseX = W / 2 + (k - 5) * 118, baseY = 850;
      if (k === 0) {
        const x = lerp(baseX, 680, grow), y = lerp(baseY, H / 2, grow), r = lerp(48, 265, grow);
        avatar(ctx, m, x, y, r * p);
      } else avatar(ctx, m, baseX, baseY + grow * 300, 48 * p, { alpha: 1 - grow });
    });
    return;
  }
  // 41–43 · four big profiles
  if (t < 43) { const i = Math.floor((t - 41) / 0.5); memberBig(ctx, BIG[i], i, t - 41 - i * 0.5, t); P.zoomBlur = 0.06 * (1 - clamp((t - 41 - i * 0.5) / 0.1)); return; }
  // 43–44.75 · seven fast cuts on the 8ths
  if (t < 44.75) { const i = Math.min(6, Math.floor((t - 43) / 0.25)); memberFast(ctx, FAST[i], i, t - 43 - i * 0.25); P.zoomBlur = 0.08 * (1 - clamp((t - 43 - i * 0.25) / 0.08)); return; }
  // 44.75–47 · the directory
  if (t < 47) { memberGrid(ctx, t); P.flash = t < 44.8 ? 0.5 : 0; P.flashColor = [1, 1, 1]; return; }
  // 47–51 · tokens
  if (t < 51) { tokens(ctx, t); P.bloom = 0.25; return; }
  // 51–55 · products
  if (t < 55) { products(ctx, t); return; }
  // 55–61 · six principles, one per bar-half
  if (t < 61) {
    const i = Math.floor((t - 55) / 1), lt = t - 55 - i;
    principle(ctx, t, i, lt);
    P.ca = 0.008 * (1 - clamp(lt / 0.15));
    P.zoomBlur = 0.05 * (1 - clamp(lt / 0.1));
    return;
  }
  // 61–62 · everything collapses into a single point of light
  const c = ease.inExpo(prog(t, 61.0, 61.85));
  fillBg(ctx, '#0B0D0F');
  ctx.save();
  zoomAt(ctx, Math.max(0.001, 1 - c), W / 2, H / 2);
  principle(ctx, t, 5, 1 + (t - 61));
  ctx.restore();
  if (c > 0.02) { ctx.save(); ctx.fillStyle = '#050607'; ctx.globalAlpha = c; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const dotR = 3 + 6 * c;
  ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(W / 2, H / 2, dotR * clamp(c * 3), 0, 7); ctx.fill();
  P.bloom = c; P.zoomBlur = c * 0.2;
}
```

### 14/18 · `promo/src/act4.js`
<!-- casebook-file {"path": "promo/src/act4.js", "lines": 337, "final_newline": true, "sha256": "38e9c58277b578ad4cd38ccbc552cdbed7572957f970f1058862a4c0e0cd1ba5", "original_sha256": "38e9c58277b578ad4cd38ccbc552cdbed7572957f970f1058862a4c0e0cd1ba5"} -->
```js
// 62–80s · Ascension. The members become a constellation, the constellation lifts
// 2D → 3D → 4D, and folds into the mark. Then: the next story is yours.
import { W, H, C, F, clamp, lerp, prog, ease, hash, hs, text, revealText, typeText, measure, fillBg, zoomAt, roundRect, images } from './core.js';
import { MEMBERS, BRAND, BRAND_CN } from './data.js';
import { avatar } from './act3.js';

function stars(ctx, t, alpha = 1) {
  for (let i = 0; i < 260; i++) {
    const x = hash(i, 1) * W, y = hash(i, 2) * H;
    const tw = 0.5 + 0.5 * Math.sin(t * (1 + hash(i, 3) * 3) + i);
    const r = 0.6 + hash(i, 4) * 1.5;
    ctx.fillStyle = hash(i, 5) > 0.85 ? '#FFD9B8' : C.cream;
    ctx.globalAlpha = alpha * (0.15 + 0.5 * tw * hash(i, 6));
    ctx.beginPath(); ctx.arc(x + (t - 62) * (hash(i, 7) - 0.5) * 6, y, r, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// constellation layout (normalized around the centre)
const NODES = [
  [0, -0.02], [-0.3, -0.24], [0.28, -0.3], [-0.52, 0.02], [0.5, -0.04], [-0.2, 0.2],
  [0.2, 0.22], [-0.42, -0.36], [0.44, 0.3], [-0.05, -0.4], [0.02, 0.4],
];
const LINKS = [[0, 1], [0, 2], [1, 7], [1, 3], [3, 5], [5, 0], [0, 6], [6, 8], [2, 4], [4, 8], [2, 9], [9, 1], [5, 10], [10, 6], [7, 9]];

// tesseract
const V4 = [];
for (let i = 0; i < 16; i++) V4.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
const E4 = [];
for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) { const j = i ^ (1 << b); if (i < j) E4.push([i, j, b]); }
// which tesseract vertex each member settles on (the other 5 are plain stars)
const SLOT = [0, 3, 5, 6, 9, 10, 12, 15, 1, 14, 7];

function tesseract(t, sz, sw, spin, scale) {
  const a = spin;
  return V4.map(([x, y, z, w]) => {
    z *= sz; w *= sw;
    // 4D rotations in XW and ZW planes
    let c = Math.cos(a), s = Math.sin(a);
    [x, w] = [x * c - w * s, x * s + w * c];
    c = Math.cos(a * 0.7); s = Math.sin(a * 0.7);
    [z, w] = [z * c - w * s, z * s + w * c];
    const k4 = 1 / (3 - w);
    x *= k4 * 2; y *= k4 * 2; z *= k4 * 2;
    // 3D orbit
    const yaw = t * 0.45, pitch = 0.42;
    let X = x * Math.cos(yaw) + z * Math.sin(yaw), Z = -x * Math.sin(yaw) + z * Math.cos(yaw);
    let Y = y * Math.cos(pitch) - Z * Math.sin(pitch); Z = y * Math.sin(pitch) + Z * Math.cos(pitch);
    const k = 5 / (5 + Z);
    return [W / 2 + X * k * scale, H / 2 - 70 - Y * k * scale, Z];
  });
}

const LIME = '#D7F329';

// ---------- 73.3–74.8 · the thesis, stated fast ----------
function thesis(ctx, t, P) {
  fillBg(ctx, '#050607');
  stars(ctx, t, 0.5);
  P.grain = 0.06; P.vig = 0.5; P.scan = 0.22; P.ca = 0.0015; P.bloom = 0.25;
  const out = prog(t, 74.5, 74.78);
  const al = 1 - out;
  text(ctx, 'OUR THESIS  ——  青禾·元野', 80, 84, { family: F.mono, size: 20, color: C.creamDim, ls: 3, alpha: prog(t, 73.4, 73.7) * al });
  text(ctx, 'EST. NCC · 2026', W - 80, 84, { family: F.mono, size: 20, color: C.creamDim, ls: 3, align: 'right', alpha: prog(t, 73.4, 73.7) * al });
  revealText(ctx, '让学生自由发展，', W / 2, H / 2 - 60, { family: F.serif, size: 96, weight: 900, color: C.cream, align: 'center', alpha: al }, prog(t, 73.4, 73.85), { stagger: 0.03, rise: 26 });
  const o2 = { family: F.serif, size: 96, weight: 900 };
  const w1 = measure(ctx, '在真实实践中', o2), w2 = measure(ctx, '长出元能力。', o2);
  const x0 = W / 2 - (w1 + w2) / 2;
  revealText(ctx, '在真实实践中', x0, H / 2 + 90, { ...o2, color: C.cream, align: 'left', alpha: al }, prog(t, 73.9, 74.3), { stagger: 0.03, rise: 26 });
  revealText(ctx, '长出元能力。', x0 + w1, H / 2 + 90, { ...o2, color: LIME, align: 'left', alpha: al }, prog(t, 74.05, 74.42), { stagger: 0.03, rise: 26 });
  text(ctx, 'LET STUDENTS BUILD FREE —— META-SKILLS GROW IN REAL WORK', W / 2, H / 2 + 190, { family: F.mono, size: 20, color: C.creamDim, align: 'center', ls: 3, alpha: prog(t, 74.3, 74.55) * al });
  P.flash = out; P.flashColor = [1, 0.97, 0.92];
  P.zoomBlur = out * 0.3;
}

// ---------- the wordmark: per-glyph assemble, RGB-split convergence, sheen sweep ----------
let wmCv = null;
function wordmark(ctx, str, x, y, size, p, t) {
  const o = { family: F.grotesk, size, weight: 700, ls: 6 };
  const chars = [...str];
  const widths = chars.map((c) => measure(ctx, c, o));
  const gap2 = 10;
  const tw = widths.reduce((a, b) => a + b, 0) + gap2 * (chars.length - 1);
  const stagger = 0.055, dur = 0.5, total = dur + stagger * (chars.length - 1);
  // chromatic ghosts converge onto each settling glyph
  ctx.save();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 ${size}px ${F.grotesk}, ${F.sans}`;
  let ex = x - tw / 2 + widths[0] / 2;
  chars.forEach((c, i) => {
    const lp = clamp((p * total - i * stagger) / dur);
    if (lp > 0 && lp < 1) {
      const e = ease.outExpo(lp);
      const dx = (1 - e) * 30, ry = (1 - e) * 50;
      ctx.globalAlpha = (1 - e) * 0.75;
      ctx.fillStyle = C.coral; ctx.fillText(c, ex + dx, y + ry);
      ctx.fillStyle = C.teal; ctx.fillText(c, ex - dx, y + ry);
    }
    ex += widths[i] + gap2;
  });
  ctx.restore();
  // body: gradient + specular sweep composited on an isolated layer
  const cw0 = Math.ceil(tw + 240), ch0 = Math.ceil(size * 1.9);
  if (!wmCv) wmCv = document.createElement('canvas');
  if (wmCv.width !== cw0) { wmCv.width = cw0; wmCv.height = ch0; }
  const g = wmCv.getContext('2d');
  g.clearRect(0, 0, cw0, ch0);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `700 ${size}px ${F.grotesk}, ${F.sans}`;
  let gx = 120 + widths[0] / 2;
  chars.forEach((c, i) => {
    const lp = clamp((p * total - i * stagger) / dur);
    if (lp <= 0) { gx += widths[i] + gap2; return; }
    const e = ease.outExpo(lp), eb = ease.outBack(lp);
    g.save();
    g.translate(gx, ch0 / 2 + (1 - e) * 50);
    g.scale((0.55 + 0.45 * e) * (1 + (eb - 1) * 0.5), (0.55 + 0.45 * e) * (1 + (eb - 1) * 0.5));
    if (e < 1) g.filter = `blur(${(1 - e) * 9}px)`;
    g.globalAlpha = e;
    g.fillStyle = '#F4EFE3';
    g.fillText(c, 0, 0);
    g.restore();
    gx += widths[i] + gap2;
  });
  g.globalCompositeOperation = 'source-in';
  const grd = g.createLinearGradient(0, ch0 * 0.15, 0, ch0 * 0.85);
  grd.addColorStop(0, '#FFFFFF'); grd.addColorStop(0.5, '#F4EFE3'); grd.addColorStop(1, '#C9A87C');
  g.fillStyle = grd; g.fillRect(0, 0, cw0, ch0);
  const sp = ease.inOutCubic(prog(t, 75.7, 76.8));
  if (sp > 0 && sp < 1) {
    g.globalCompositeOperation = 'source-atop';
    const bx = lerp(-160, cw0 + 160, sp);
    const gr2 = g.createLinearGradient(bx - 150, 0, bx + 150, 0);
    gr2.addColorStop(0, 'rgba(255,255,255,0)');
    gr2.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    gr2.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr2;
    g.save(); g.translate(bx, ch0 / 2); g.rotate(-0.3); g.fillRect(-150, -ch0, 300, ch0 * 2); g.restore();
  }
  g.globalCompositeOperation = 'source-over';
  ctx.save();
  ctx.shadowColor = 'rgba(232,99,58,0.5)'; ctx.shadowBlur = 55;
  ctx.drawImage(wmCv, x - cw0 / 2, y - ch0 / 2);
  ctx.restore();
  ctx.drawImage(wmCv, x - cw0 / 2, y - ch0 / 2);
}

export function drawAct4(ctx, t, P) {
  fillBg(ctx, '#050607');
  P.grain = 0.04; P.vig = 0.55; P.bloom = 0.28; P.ca = 0.002;
  stars(ctx, t, prog(t, 62, 62.8));
  const glow = (x, y, r, a, col = '232,99,58') => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };

  if (t < 72) {
    P.bloom = 0.1;
    // ---- positions: constellation → tesseract ----
    const burst = ease.outExpo(prog(t, 62.0, 62.9));
    const morph = ease.inOutExpo(prog(t, 66.0, 67.0));
    const sz = ease.inOutExpo(prog(t, 67.2, 68.0));
    const sw = ease.inOutExpo(prog(t, 68.5, 69.3));
    const spinT = Math.max(0, t - 68.5);
    const collapse = ease.inExpo(prog(t, 71.0, 71.9));
    const spin = spinT * 0.9 + spinT * spinT * 0.12 + collapse * 3;
    const scale = lerp(230, 250, prog(t, 67, 71)) * (1 - collapse);
    const T = tesseract(t - 66, sz, sw, spin, scale);
    // the flat net slowly reclines into depth before it morphs — 2D → 2.5D → 4D
    const tilt = ease.inOutCubic(prog(t, 63.7, 65.7)) * 0.52;
    const ncy = H / 2 - 145;
    const conPos = NODES.map(([x, y], i) => {
      const px = x * 1360 * burst;
      const py = (y * 760 + Math.sin(t * 0.8 + i * 1.9) * 7) * burst;
      const z0 = hs(i, 77) * 240;
      const y2 = py * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z2 = (py * Math.sin(tilt) + z0 * Math.cos(tilt)) * 0.004;
      const k = 1 / (1 + z2 * 0.22);
      return [W / 2 + px * k, ncy + y2 * k, z2];
    });
    const memberPos = MEMBERS.map((_, i) => {
      const tp = T[SLOT[i]];
      return [lerp(conPos[i][0], tp[0], morph), lerp(conPos[i][1], tp[1], morph), lerp(conPos[i][2], tp[2], morph)];
    });

    glow(W / 2, H / 2 - 30, 700, 0.12 + collapse * 0.4);

    // constellation links (fade out as the structure takes over)
    ctx.save();
    ctx.strokeStyle = C.cream; ctx.lineWidth = 1.5;
    LINKS.forEach(([a, b], k) => {
      const lp = ease.inOutCubic(prog(t, 62.6 + k * 0.1, 63.1 + k * 0.1));
      if (lp <= 0) return;
      ctx.globalAlpha = 0.45 * (1 - morph);
      const [x1, y1] = memberPos[a], [x2, y2] = memberPos[b];
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, lp), lerp(y1, y2, lp)); ctx.stroke();
    });
    ctx.restore();

    // tesseract edges
    if (morph > 0) {
      ctx.save();
      E4.forEach(([i, j, axis]) => {
        const a = T[i], b = T[j];
        const depth = clamp(1 - (a[2] + b[2]) * 0.08);
        ctx.strokeStyle = axis === 3 ? C.coral : axis === 2 ? C.teal : C.cream;
        ctx.globalAlpha = morph * (axis === 3 ? sw : axis === 2 ? Math.max(sz, 0.25) : 1) * 0.85 * depth;
        ctx.lineWidth = axis === 3 ? 2.5 : 2;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });
      // the 5 unclaimed vertices glow as open seats
      const claimed = new Set(SLOT);
      T.forEach((p, i) => {
        if (claimed.has(i)) return;
        ctx.globalAlpha = morph;
        glow(p[0], p[1], 26, 0.8);
        ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, 7); ctx.fill();
      });
      ctx.restore();
    }

    // member nodes
    const order = memberPos.map((p, i) => [p[2], i]).sort((a, b) => b[0] - a[0]);
    order.forEach(([, i]) => {
      const m = MEMBERS[i];
      const [x, y] = memberPos[i];
      const r = lerp(38, 22, morph) * burst * (1 - collapse) * clamp(1 / (1 + memberPos[i][2] * 0.18), 0.7, 1.35);
      if (r < 0.5) return;
      glow(x, y, r * 2.4, 0.35);
      avatar(ctx, m, x, y, r, { dark: true });
      ctx.strokeStyle = 'rgba(244,239,227,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, 7); ctx.stroke();
      text(ctx, m.handle, x, y + r + 26, { family: F.mono, size: 16, color: C.creamDim, align: 'center', alpha: prog(t, 62.8, 63.2) * (1 - morph) });
    });

    // ---- copy ----
    if (t < 66) {
      const lines = [['靠作品', '赢得信任'], ['靠信任', '交换经验'], ['靠经验', '快速迭代原型']];
      lines.forEach(([a, b], k) => {
        const t0 = 62.9 + k * 0.95;
        const p = prog(t, t0, t0 + 0.5);
        if (p <= 0) return;
        const y = 930;
        const o = { family: F.serif, size: 52, weight: 900 };
        const ws = lines.map(([p1, p2]) => measure(ctx, p1 + p2, o));
        const gap = 110, tot = ws.reduce((u, v) => u + v, 0) + gap * 2;
        const x0 = W / 2 - tot / 2 + ws.slice(0, k).reduce((u, v) => u + v, 0) + gap * k;
        const al = 1 - prog(t, 65.6, 65.95);
        revealText(ctx, a, x0, y, { family: F.serif, size: 52, weight: 900, color: C.coral, align: 'left', alpha: al }, p, { stagger: 0.05, rise: 20 });
        revealText(ctx, b, x0 + measure(ctx, a, { family: F.serif, size: 52, weight: 900 }), y, { family: F.serif, size: 52, weight: 900, color: C.cream, align: 'left', alpha: al }, prog(t, t0 + 0.15, t0 + 0.65), { stagger: 0.05, rise: 20 });
      });
      text(ctx, '—— 共建手册 v0.1 · 价值观', W / 2, 1000, { family: F.mono, size: 20, color: C.creamDim, align: 'center', alpha: prog(t, 64.8, 65.2) * (1 - prog(t, 65.6, 65.95)), ls: 2 });
    } else {
      const dim = t < 67.2 ? '2D' : t < 68.5 ? '3D' : '4D';
      const dimA = prog(t, 66.1, 66.3) * (1 - collapse);
      text(ctx, `DIMENSION  ${dim}`, 80, 90, { family: F.mono, size: 24, color: C.coral, ls: 4, alpha: dimA });
      text(ctx, `${Math.round(spin * 57.3) % 360}°  ·  XW / ZW`, W - 80, 90, { family: F.mono, size: 22, color: C.creamDim, ls: 3, align: 'right', alpha: dimA * sw });
      const copy = [
        [66.2, 68.3, '当创造被 AI 升维——', 64, C.cream],
        [68.4, 69.8, '一个学生，就是一支团队。', 84, C.cream],
        [69.85, 71.3, '一群学生，就是一个时代。', 84, C.coral],
      ];
      copy.forEach(([a, b, s, size, col]) => {
        if (t < a || t > b) return;
        const out = prog(t, b - 0.2, b);
        revealText(ctx, s, W / 2, H - 110, { family: F.serif, size, weight: 900, color: col, align: 'center', alpha: 1 - out }, prog(t, a, a + 0.5), { stagger: 0.035, rise: 26 });
      });
    }
    P.zoomBlur = collapse * 0.35;
    P.flash = prog(t, 71.8, 72.0);
    P.flashColor = [1, 0.97, 0.92];
    return;
  }

  // ---- 72–73.3 · dark beat before the thesis ----
  if (t < 73.3) {
    fillBg(ctx, '#050607'); stars(ctx, t, 0.4);
    P.grain = 0.06; P.vig = 0.5; P.scan = 0.2;
    return;
  }
  // ---- 73.3–74.8 · the thesis ----
  if (t < 74.8) { thesis(ctx, t, P); return; }

  // ---- 74.8–80 · the mark ----
  const M0 = 74.8;
  const push = 1 + (t - M0) * 0.014;
  const cta = ease.inOutExpo(prog(t, 76.0, 76.7));
  glow(W / 2, H / 2 - 60, 900, 0.16);
  P.bloom = 0.32 + 0.5 * prog(t, M0 + 0.15, M0 + 0.5) * (1 - prog(t, M0 + 0.5, M0 + 1.6));
  // faint tesseract keeps turning behind the mark
  const T = tesseract(t - 66, 1, 1, (t - M0) * 0.5 + 4, 520);
  ctx.save();
  ctx.globalAlpha = 0.12 * prog(t, M0 + 0.2, M0 + 1);
  ctx.strokeStyle = C.cream; ctx.lineWidth = 1.2;
  E4.forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(T[i][0], T[i][1]); ctx.lineTo(T[j][0], T[j][1]); ctx.stroke(); });
  ctx.restore();

  ctx.save();
  zoomAt(ctx, push, W / 2, H / 2);
  ctx.translate(0, -cta * 170);
  const s = lerp(1, 0.72, cta);
  zoomAt(ctx, s, W / 2, H / 2 - 110);
  // app-icon tile + club mark
  const ip = ease.outBack(prog(t, M0, M0 + 0.45));
  const iy = H / 2 - 246;
  ctx.save();
  ctx.translate(W / 2, iy); ctx.scale(ip, ip);
  roundRect(ctx, -95, -95, 190, 190, 44);
  ctx.save(); ctx.clip();
  if (images.club_logo) ctx.drawImage(images.club_logo, -95, -95, 190, 190);
  else { ctx.fillStyle = '#111316'; ctx.fillRect(-95, -95, 190, 190); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(244,239,227,0.2)'; ctx.lineWidth = 2; roundRect(ctx, -95, -95, 190, 190, 44); ctx.stroke();
  ctx.restore();
  // orbit of members around the mark
  MEMBERS.forEach((m, i) => {
    const a = (i / MEMBERS.length) * Math.PI * 2 + (t - M0) * 0.35;
    const op = ease.outExpo(prog(t, M0 + 0.35 + i * 0.045, M0 + 0.9 + i * 0.045));
    if (op <= 0) return;
    const R = 175 * op + 10;
    const x = W / 2 + Math.cos(a) * R * 1.6, y = iy + Math.sin(a) * R * 0.6;
    avatar(ctx, m, x, y, 22, { dark: true, alpha: op * (1 - cta) });
  });
  wordmark(ctx, 'PROTOCOM', W / 2, H / 2 + 84, 172, prog(t, M0 + 0.15, M0 + 0.8), t);
  revealText(ctx, BRAND_CN, W / 2, H / 2 + 192, { family: F.serif, size: 58, weight: 900, color: C.cream, align: 'center', ls: 12 }, prog(t, M0 + 0.7, M0 + 1.2), { stagger: 0.05, rise: 24 });
  text(ctx, 'PROTO COMMONS  ·  NCC  ·  2026', W / 2, H / 2 + 252, { family: F.mono, size: 21, color: C.creamDim, align: 'center', ls: 4, alpha: prog(t, M0 + 1.0, M0 + 1.4) });
  ctx.restore();

  if (cta > 0) {
    revealText(ctx, '下一个故事，由你书写。', W / 2, H / 2 + 250, { family: F.serif, size: 88, weight: 900, color: C.cream, align: 'center' }, prog(t, 76.3, 76.9), { stagger: 0.04, rise: 30 });
    const cmd = `> join ${BRAND} --as @你`;
    const cw = measure(ctx, cmd, { family: F.mono, size: 40 });
    typeText(ctx, cmd, W / 2 - cw / 2, H / 2 + 360, { family: F.mono, size: 40, color: C.coral, cursorColor: C.coral }, prog(t, 77.0, 77.9), true, t);
  }
  P.flash = t < M0 + 0.12 ? 1 - prog(t, M0, M0 + 0.12) : 0;
  P.flashColor = [1, 0.97, 0.92];
}
```

### 15/18 · `promo/src/core.js`
<!-- casebook-file {"path": "promo/src/core.js", "lines": 279, "final_newline": true, "sha256": "cb02d17b539d742ef793e793ee3a0e714affd0e86470aa80e6a449a9a1e94d04", "original_sha256": "cb02d17b539d742ef793e793ee3a0e714affd0e86470aa80e6a449a9a1e94d04"} -->
```js
// Shared primitives: timing, easing, deterministic noise, type, sketch strokes, 3D projection.
export const W = 1920, H = 1080, FPS = 60, BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
export const DURATION = 80;

export const C = {
  paper: '#F3EEE3', paperDeep: '#E8E0CF', graphite: '#26231F',
  ink: '#0B0D0F', inkSoft: '#15181B', cream: '#F4EFE3', creamDim: '#A8A294',
  coral: '#E8633A', teal: '#78D7BD', tealDeep: '#4A7C6F', amber: '#D4A574',
  white: '#FFFFFF', gray: '#78716C', line: '#E7E2D8',
};

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const within = (t, a, b) => t >= a && t < b;

export const ease = {
  linear: (x) => x,
  inCubic: (x) => x * x * x,
  outCubic: (x) => 1 - Math.pow(1 - x, 3),
  inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outQuart: (x) => 1 - Math.pow(1 - x, 4),
  inExpo: (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
  outExpo: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inOutExpo: (x) =>
    x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outBack: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outBackBig: (x) => { const c1 = 3.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outElastic: (x) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  outBounce: (x) => {
    const n1 = 7.5625, d1 = 2.75;
    if (x < 1 / d1) return n1 * x * x;
    if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
    if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  },
};

// Deterministic hash noise — every frame must render identically on every worker.
export function hash(...n) {
  let h = 2166136261;
  for (const v of n) {
    h ^= Math.floor(v * 1000003) | 0;
    h = Math.imul(h, 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return ((h >>> 0) % 1000000) / 1000000;
}
export const hs = (...n) => hash(...n) * 2 - 1;
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hs(i, seed), hs(i + 1, seed), u);
}

// ---------- type ----------
export const F = {
  serif: '"Noto Serif SC"', sans: '"Noto Sans SC"', mono: '"JetBrains Mono"',
  hand: '"Long Cang"', handLatin: '"Caveat"', grotesk: '"Space Grotesk"',
};
export const fontUses = new Set();
export function font(ctx, family, size, weight = 400) {
  const f = `${weight} ${size}px ${family}`;
  ctx.font = family === F.mono || family === F.grotesk ? `${f}, ${F.sans}` : f;
  return ctx.font;
}
export function text(ctx, str, x, y, o = {}) {
  const { family = F.sans, size = 40, weight = 400, color = C.cream, align = 'left', baseline = 'alphabetic', ls = 0, alpha = 1 } = o;
  if (alpha <= 0.001 || !str) return 0;
  ctx.save();
  const f = font(ctx, family, size, weight);
  fontUses.add(f + '\u0000' + str);
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.letterSpacing = `${ls}px`;
  ctx.fillText(str, x, y);
  const w = ctx.measureText(str).width;
  ctx.restore();
  return w;
}
export function measure(ctx, str, o = {}) {
  const { family = F.sans, size = 40, weight = 400, ls = 0 } = o;
  ctx.save();
  font(ctx, family, size, weight);
  ctx.letterSpacing = `${ls}px`;
  const w = ctx.measureText(str).width;
  ctx.restore();
  return w;
}
// Per-glyph reveal: each glyph rises and sharpens with a stagger.
export function revealText(ctx, str, x, y, o, p, { stagger = 0.06, rise = 40, dur = 0.5, blur = true } = {}) {
  const chars = [...str];
  const n = chars.length;
  const total = dur + stagger * (n - 1);
  const align = o.align || 'left';
  const widths = chars.map((c) => measure(ctx, c, o));
  const tw = widths.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
  chars.forEach((c, i) => {
    const lp = clamp((p * total - i * stagger) / dur);
    const e = ease.outExpo(lp);
    if (lp > 0) {
      ctx.save();
      if (blur && lp < 1) ctx.filter = `blur(${(1 - e) * 10}px)`;
      text(ctx, c, cx, y + (1 - e) * rise, { ...o, align: 'left', alpha: (o.alpha ?? 1) * e });
      ctx.restore();
    }
    cx += widths[i];
  });
  return tw;
}
export function typeText(ctx, str, x, y, o, p, cursorOn = true, t = 0) {
  const chars = [...str];
  const k = Math.floor(chars.length * clamp(p));
  const s = chars.slice(0, k).join('');
  const w = text(ctx, s, x, y, o);
  if (cursorOn && Math.floor(t * 2.4) % 2 === 0) {
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.fillStyle = o.cursorColor || o.color || C.cream;
    const s2 = o.size || 40;
    ctx.fillRect(x + w + 6, y - s2 * 0.82, s2 * 0.5, s2 * 0.95);
    ctx.restore();
  }
  return w;
}

// ---------- sketch strokes (pencil that "boils" at 12fps like hand-drawn animation) ----------
export function sketchPoly(ctx, pts, o = {}) {
  const { seed = 1, t = 0, color = C.graphite, width = 2.2, jitter = 1.6, progress = 1, closed = false, passes = 2, alpha = 1, overshoot = 5 } = o;
  if (progress <= 0 || pts.length < 2) return;
  const boil = Math.floor(t * 12);
  const P = closed ? [...pts, pts[0]] : pts;
  const segs = [];
  let total = 0;
  for (let i = 0; i < P.length - 1; i++) {
    const l = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]);
    segs.push(l); total += l;
  }
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let pass = 0; pass < passes; pass++) {
    ctx.strokeStyle = color;
    ctx.globalAlpha *= pass === 0 ? alpha : 1;
    ctx.lineWidth = pass === 0 ? width : width * 0.55;
    if (pass === 1) ctx.globalAlpha = alpha * 0.55;
    let budget = total * progress;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < segs.length && budget > 0; i++) {
      const [x1, y1] = P[i], [x2, y2] = P[i + 1];
      const L = segs[i];
      const frac = Math.min(1, budget / Math.max(L, 0.001));
      budget -= L;
      const dx = (x2 - x1) / (L || 1), dy = (y2 - y1) / (L || 1);
      const nx = -dy, ny = dx;
      const j = jitter * (1 + pass * 0.8);
      const bow = hs(seed, i, pass, boil) * Math.min(L * 0.02, 6) * (jitter / 1.6);
      const ov = overshoot * hash(seed, i, pass, 7);
      const sx = x1 + hs(seed, i, pass, boil, 1) * j - dx * (i === 0 ? ov : 0);
      const sy = y1 + hs(seed, i, pass, boil, 2) * j - dy * (i === 0 ? ov : 0);
      const ex = x2 + hs(seed, i + 1, pass, boil, 1) * j + dx * ov * 0.6;
      const ey = y2 + hs(seed, i + 1, pass, boil, 2) * j + dy * ov * 0.6;
      const mx = (sx + ex) / 2 + nx * bow, my = (sy + ey) / 2 + ny * bow;
      const steps = Math.max(2, Math.ceil(L / 14));
      if (!started) { ctx.moveTo(sx, sy); started = true; } else if (pass >= 0) { ctx.moveTo(sx, sy); }
      for (let s = 1; s <= steps; s++) {
        const u = (s / steps) * frac;
        const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
        ctx.lineTo(a * sx + b * mx + c * ex, a * sy + b * my + c * ey);
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}
export function sketchCircle(ctx, cx, cy, r, o = {}) {
  const { seed = 3, t = 0, progress = 1, start = -Math.PI * 0.6 } = o;
  const boil = Math.floor(t * 12);
  const pts = [];
  const n = 48;
  const turns = 1.08;
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * Math.PI * 2 * turns;
    const rr = r * (1 + noise1(i * 0.35, seed + boil * 0.013) * 0.035 + (i / n) * 0.03);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  sketchPoly(ctx, pts, { ...o, jitter: 0.6, progress, overshoot: 0 });
}
// Diagonal pencil hatching clipped to a polygon.
export function hatch(ctx, poly, o = {}) {
  const { spacing = 11, angle = -0.9, color = C.graphite, alpha = 0.45, seed = 5, t = 0, progress = 1, width = 1.2 } = o;
  if (progress <= 0) return;
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  ctx.save();
  ctx.beginPath();
  poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.closePath();
  ctx.clip();
  const diag = Math.hypot(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const n = Math.ceil(diag / spacing);
  const boil = Math.floor(t * 12);
  for (let i = -n / 2; i < n / 2; i++) {
    if ((i + n / 2) / n > progress) break;
    const off = i * spacing + hs(seed, i, boil) * 2;
    const x1 = cx + -sa * off - ca * diag, y1 = cy + ca * off - sa * diag;
    const x2 = cx + -sa * off + ca * diag, y2 = cy + ca * off + sa * diag;
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha * (0.7 + hash(seed, i) * 0.3);
    ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  ctx.restore();
}

// ---------- 3D ----------
export function rotY(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; }
export function rotX(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }
export function rotZ(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }
// Camera: orbit (yaw/pitch) around target, perspective with focal length f (large f ≈ axonometric).
export function makeCam({ yaw = 0, pitch = 0, target = [0, 0, 0], dist = 20, f = 1400, cx = W / 2, cy = H / 2, scale = 1 }) {
  return (p) => {
    let q = [p[0] - target[0], p[1] - target[1], p[2] - target[2]];
    q = rotY(q, yaw);
    q = rotX(q, pitch);
    const z = q[2] + dist;
    const k = (f / Math.max(z, 0.01)) * scale;
    return [cx + q[0] * k, cy - q[1] * k, z];
  };
}

// ---------- images ----------
export const images = {};
export function loadImage(key, src) {
  return new Promise((res) => {
    const im = new Image();
    im.onload = () => { images[key] = im; res(im); };
    im.onerror = () => { console.warn('img fail', src); res(null); };
    im.src = src;
  });
}
export async function loadSvgTinted(key, src, color) {
  const txt = await (await fetch(src)).text();
  const svg = txt
    .replace(/currentColor/g, color)
    .replace(/width="1em"/, 'width="512"')
    .replace(/height="1em"/, 'height="512"');
  const hasFill = /<svg[^>]*fill=/.test(svg);
  const final = hasFill ? svg : svg.replace('<svg ', `<svg fill="${color}" `);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(final);
  return loadImage(key, url);
}
export function circleImage(ctx, im, cx, cy, r, alpha = 1) {
  if (!im) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(im, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
export function fillBg(ctx, color) { ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.fillRect(-W * 2, -H * 2, W * 5, H * 5); ctx.restore(); }
export function withAlpha(ctx, a, fn) { ctx.save(); ctx.globalAlpha *= a; fn(); ctx.restore(); }
// Zoom around a point (camera punch-ins).
export function zoomAt(ctx, s, x = W / 2, y = H / 2) { ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); }
```

### 16/18 · `promo/src/data.js`
<!-- casebook-file {"path": "promo/src/data.js", "lines": 84, "final_newline": true, "sha256": "03ec516bf960519b4e76166a436b116daa4791f130d5d17068be211d6836948d", "original_sha256": "03ec516bf960519b4e76166a436b116daa4791f130d5d17068be211d6836948d"} -->
```js
// Everything on screen that is a fact comes from the protocom member pages,
// the Tokens leaderboard, and the 共建手册 v0.1. Nothing here is invented.
export const BRAND = 'Protocom';
export const BRAND_CN = '青禾·元野';
export const TAGLINE = 'AI 时代的学生创造共同体';
export const SCHOOL = 'NCC';

export const MEMBERS = [
  { id: 'mio', name: 'KinomotoMio', handle: '@mio', real: '万祚全', role: '构建者', img: 'mio_big', line: '31.1B Tokens · 连续 102 天', joined: '武汉 · Asia/Shanghai' },
  { id: 'yusheng', name: '羽升', handle: '@yusheng', real: '孔德羽', role: '同路人', img: 'yusheng', line: '羽化成蝶 升生不息', joined: '7.1B Tokens · 154 天活跃' },
  { id: 'daniel', name: 'Daniel', handle: '@daniel', real: '刘磐', role: '同路人', img: 'daniel_big', line: '24.0B Tokens · 单日峰值 2.1B', joined: '武汉市' },
  { id: 'genshin', name: 'Gazerrr', handle: '@genshin', real: '董奇志', role: '同路人', img: 'genshin_big', line: '咕咕嘎嘎（拉长）', joined: '13.8B Tokens · 178 天活跃' },
  { id: 'elena', name: 'Elena', handle: '@elena', real: '杨明鑫', role: '同路人', img: 'elena' },
  { id: 'torchbearer127', name: '执炬人', handle: '@torchbearer127', real: '王创锐', role: '同路人', img: 'torchbearer127' },
  { id: 'whosxws', name: 'Whosxws', handle: '@whosxws', real: 'Wish King', role: '同路人', img: 'whosxws' },
  { id: 'compass', name: '司南', handle: '@compass', real: '彭司南', role: '同路人', mono: '司' },
  { id: 'why', name: 'why', handle: '@why', real: '王鸿宇', role: '同路人', mono: 'w' },
  { id: 'wzx', name: '王梓鑫', handle: '@wzx', real: '', role: '同路人', mono: '王' },
  { id: 'xlcy', name: '小ye', handle: '@xlcy', real: '范择', role: '同路人', mono: '小' },
];

// Tokens · 公开排行榜: 4 participants, 76.0B public tokens.
export const TOKENS = [
  { id: 'mio', name: 'KinomotoMio', handle: '@mio', value: 31.1, days: 246, peak: '1.0B', streak: 102, img: 'mio_big',
    bars: [0.8, 0.78, 1.0, 0.3, 0.93, 0.62, 0.23, 0.03, 0.12, 0.12, 0.12, 0.17, 0.17, 0.33, 0.05, 0.25, 0.42, 0.65, 0.03, 0.8, 0.07, 0.15, 0.03, 0.4, 0.03] },
  { id: 'daniel', name: 'Daniel', handle: '@daniel', value: 24.0, days: 96, peak: '2.1B', streak: 33, img: 'daniel_big',
    bars: [0.15, 0.15, 0.17, 0.05, 0.05, 0.1, 0.15, 0.45, 0.05, 0.1, 0.2, 0.05, 0.1, 0.05, 1.0, 0.4, 0.03, 0.03, 0.25, 0.12, 0.03, 0.15, 0.03, 0.1] },
  { id: 'genshin', name: 'Gazerrr', handle: '@genshin', value: 13.8, days: 178, peak: '445.6M', streak: 31, img: 'genshin_big',
    bars: [0.07, 1.0, 0.4, 0.45, 0.03, 0.23, 0.5, 0.25, 0.1, 0.12, 0.12, 0.38, 0.25, 0.03, 0.23, 0.17, 0.38, 0.07, 0.68, 0.17, 0.12, 0.28, 0.03, 0.03] },
  { id: 'yusheng', name: '羽升', handle: '@yusheng', value: 7.1, days: 154, peak: '1.2B', streak: 41, img: 'yusheng',
    bars: [0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.04, 0.04, 0.15, 0.04, 0.08, 0.1, 0.02, 0.1, 0.02, 0.1, 0.24, 0.3, 0.52, 0.85, 0.4, 0.02] },
];

export const PRODUCTS = [
  { name: '身份与档案', desc: '统一身份、成员档案与共同体治理。', tag: 'IDENTITY' },
  { name: '中转站', desc: '共同体的 AI 模型中转站。', tag: 'RELAY' },
  { name: 'Tokens', desc: 'AI Agent Token 使用统计与自愿参与的公开排行榜。', tag: 'TOKENS' },
];

export const FEED = [
  ['发起了', 'Pull Request #177', 'fix(app): produce complete ad-hoc signatures for macOS packages'],
  ['合并了', 'Pull Request #170', '[Development] Index error and performance guidance for agents'],
  ['合并了', 'Pull Request #169', '[Development] Account for persistent recovery failures'],
  ['合并了', 'Pull Request #168', '[Development] Preserve concise rationale in commit history'],
  ['发起了', 'Issue #138', '[Sessions] List capped at 1,000 hides older sessions and understates counts'],
  ['合并了', 'Pull Request #115', 'feat(dsh-plugin): integrate Obelisk through a plugin-owned skill'],
  ['发起了', 'Issue #118', '[Skills] From repeated history to reusable agent skills'],
];

// 共建手册 v0.1 — methodology & values, verbatim headings.
export const PRINCIPLES = [
  { code: 'M-01', kind: '方法论', a: '注意力', b: '是唯一真正稀缺的东西。' },
  { code: 'M-02', kind: '方法论', a: '只做', b: '已有工具覆盖之外的事。' },
  { code: 'M-03', kind: '方法论', a: '一轮闭环，', b: '产出即地基。' },
  { code: 'M-07', kind: '方法论', a: '顺着模型能力做，', b: '不卡它明天的能力。' },
  { code: 'V-01', kind: '价值观', a: '吹出去的，', b: '必须能兑现。' },
  { code: 'V-04', kind: '价值观', a: '创意，', b: '不泡池子。' },
];

// AI logo roll call (lobehub icon slugs + glow tint).
export const SLAMS = [
  { slug: 'openai', name: 'OpenAI', tint: '#FFFFFF' },
  { slug: 'claude', name: 'Claude', tint: '#D97757' },
  { slug: 'deepseek', name: 'DeepSeek', tint: '#4D6BFE' },
  { slug: 'qwen', name: 'Qwen', tint: '#7C5CFF' },
  { slug: 'hunyuan', name: 'Hunyuan', tint: '#2E7DFF' },
  { slug: 'doubao', name: 'Doubao', tint: '#3D7BFF' },
  { slug: 'zhipu', name: 'Zhipu', tint: '#4E8CFF' },
  { slug: 'kimi', name: 'Kimi', tint: '#FFFFFF' },
];
export const GRID_LOGOS = [
  'openai', 'claude', 'gemini', 'deepseek', 'qwen', 'kimi', 'doubao', 'cursor',
  'meta', 'mistral', 'grok', 'zhipu', 'minimax', 'hunyuan', 'wenxin', 'stepfun',
  'perplexity', 'midjourney', 'suno', 'runway', 'huggingface', 'ollama', 'githubcopilot', 'trae',
  'windsurf', 'v0', 'notion', 'sora', 'claudecode', 'cline', 'yi', 'baichuan',
];

export const CODE_LINES = [
  'const idea = await human.imagine();', 'for await (const token of model.stream(prompt)) {', '  canvas.render(token);',
  'export default function Flovvas() {', 'git commit -m "one loop, one foundation"', 'agent.run({ skills, memory, tools })',
  'if (attention.isScarce()) focus(); ', 'SELECT * FROM members WHERE public = true;', 'await obelisk.index(sessions)',
  'npx create-something-people-want', 'while (true) { build(); ship(); learn(); }', 'model.generate({ temperature: 0.7 })',
  'curl relay.protocom/v1/messages', 'return <Canvas entries={["问题","文件","灵感"]} />', 'tokens += 31_100_000_000;',
];
```

### 17/18 · `promo/src/main.js`
<!-- casebook-file {"path": "promo/src/main.js", "lines": 78, "final_newline": true, "sha256": "2043efa45ce8a29cad919eeb42835c2d20259bcb5aedfd7c71bebc7f11d904c0", "original_sha256": "2043efa45ce8a29cad919eeb42835c2d20259bcb5aedfd7c71bebc7f11d904c0"} -->
```js
import { W, H, DURATION, fontUses, loadImage, loadSvgTinted } from './core.js';
import { createPost } from './post.js';
import { MEMBERS, SLAMS, GRID_LOGOS } from './data.js';
import { drawAct1 } from './act1.js';

const acts = [[0, 20, drawAct1]];
let clearThumbs = () => {};
try { const m = await import('./act2.js'); m.setRaw((c, t, s) => drawRaw(c, t, s)); clearThumbs = m.clearThumbs; acts.push([20, 38, m.drawAct2]); } catch (e) { console.warn(e); }
try { const m = await import('./act3.js'); acts.push([38, 62, m.drawAct3]); } catch (e) { console.warn(e); }
try { const m = await import('./act4.js'); acts.push([62, DURATION, m.drawAct4]); } catch (e) { console.warn(e); }

const SCALE = Math.max(0.1, parseFloat(new URLSearchParams(location.search).get('scale') || '1') || 1);
const src = document.createElement('canvas');
src.width = W * SCALE; src.height = H * SCALE;
const ctx = src.getContext('2d', { willReadFrequently: false });
const out = document.getElementById('out');
out.width = W * SCALE; out.height = H * SCALE;
const post = createPost(out);

export function drawRaw(c, t, scale = 1) {
  const P = { time: t, grain: 0.04, vig: 0.3, ca: 0.0015 };
  c.save();
  c.setTransform(scale, 0, 0, scale, 0, 0);
  c.globalAlpha = 1; c.filter = 'none'; c.globalCompositeOperation = 'source-over';
  for (const [a, b, fn] of acts) if (t >= a && t < b) fn(c, t, P);
  c.restore();
  return P;
}
window.drawRaw = drawRaw;

function renderFrame(t) {
  const P = drawRaw(ctx, t, SCALE);
  post(src, P);
}
window.renderFrame = renderFrame;

async function loadAssets() {
  const jobs = [];
  const avatarIds = new Set(MEMBERS.map((m) => m.img).filter(Boolean));
  ['mio', 'daniel', 'genshin'].forEach((k) => avatarIds.add(k));
  for (const k of avatarIds) jobs.push(loadImage('av_' + k, `assets/avatars/${k}.png`));
  jobs.push(loadImage('club_logo', 'assets/logo.jpg'));
  const slugs = new Set([...SLAMS.map((s) => s.slug), ...GRID_LOGOS]);
  const base = 'node_modules/@lobehub/icons-static-svg/icons/';
  for (const s of slugs) jobs.push(loadSvgTinted('logo_' + s, `${base}${s}.svg`, '#F4EFE3'));
  for (const s of ['claude-color', 'gemini-color', 'deepseek-color', 'qwen-color', 'doubao-color', 'kimi-color'])
    jobs.push(loadSvgTinted('logo_' + s, `${base}${s}.svg`, '#F4EFE3'));
  await Promise.all(jobs);
}

// Fonts are split into unicode-range slices; sweep the timeline so every glyph actually used gets loaded.
async function preloadFonts() {
  for (let pass = 0; pass < 3; pass++) {
    for (let t = 0; t < DURATION; t += 1 / 20) drawRaw(ctx, t);
    const jobs = [];
    for (const k of fontUses) {
      const [f, s] = k.split('\u0000');
      jobs.push(document.fonts.load(f, s).catch(() => {}));
    }
    await Promise.all(jobs);
    await document.fonts.ready;
  }
}

window.__ready = (async () => {
  await document.fonts.ready;
  await loadAssets();
  await preloadFonts();
  clearThumbs();
  const q = new URLSearchParams(location.search);
  if (q.has('t')) renderFrame(parseFloat(q.get('t')));
  if (q.has('play')) {
    const t0 = performance.now() - parseFloat(q.get('play') || '0') * 1000;
    const loop = () => { renderFrame(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); };
    loop();
  }
  return true;
})();
```

### 18/18 · `promo/src/post.js`
<!-- casebook-file {"path": "promo/src/post.js", "lines": 101, "final_newline": true, "sha256": "79106c8e88783be3f815408e80ab63bc21e4c192275db7ce0e8cd68a5fb2f0ef", "original_sha256": "79106c8e88783be3f815408e80ab63bc21e4c192275db7ce0e8cd68a5fb2f0ef"} -->
```js
// Final-pass WebGL shader: chromatic aberration, zoom/directional blur, glitch slices,
// inversion, mirror, scanlines, vignette, film grain, flash.
const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; v.y = 1.0-v.y; gl_Position = vec4(p,0.,1.); }`;
const FS = `
precision highp float;
varying vec2 v;
uniform sampler2D tex;
uniform vec2 res;
uniform float time, invert, ca, grain, vig, glitch, flash, zoomBlur, scan, mirror, warm, bloom;
uniform vec2 dirBlur;
uniform vec3 flashColor;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
vec3 samp(vec2 u, float k){
  vec2 d = (u-0.5)*k;
  return vec3(texture2D(tex, u+d).r, texture2D(tex, u).g, texture2D(tex, u-d).b);
}
void main(){
  vec2 uv = v;
  if (mirror > 0.5 && uv.x > 0.5) uv.x = 1.0 - uv.x;
  if (mirror > 1.5 && uv.y > 0.5) uv.y = 1.0 - uv.y;
  float fr = floor(time*24.0);
  if (glitch > 0.0) {
    float row = floor(uv.y * 28.0);
    float r = h(vec2(row, fr));
    if (r < glitch*0.6) uv.x += (h(vec2(row*1.7, fr+3.0))-0.5) * 0.18 * glitch;
    float blk = h(vec2(floor(uv.y*9.0), floor(uv.x*6.0)+fr));
    if (blk < glitch*0.12) uv = uv + vec2(0.03, 0.0)*glitch;
  }
  vec3 col = vec3(0.0);
  float cak = ca + glitch*0.012;
  if (zoomBlur > 0.0005 || length(dirBlur) > 0.0005) {
    for (int i = 0; i < 14; i++) {
      float k = float(i)/13.0;
      vec2 u = uv - (uv-0.5)*zoomBlur*k - dirBlur*(k-0.5);
      col += samp(u, cak);
    }
    col /= 14.0;
  } else {
    col = samp(uv, cak);
  }
  if (bloom > 0.0) {
    vec3 b = vec3(0.0);
    for (int i = 0; i < 8; i++) {
      float a = float(i)*0.785398;
      vec2 o = vec2(cos(a), sin(a)) * 0.006;
      b += max(texture2D(tex, uv+o).rgb - 0.55, 0.0);
      b += max(texture2D(tex, uv+o*2.2).rgb - 0.55, 0.0);
    }
    col += b/16.0 * bloom * 2.2;
  }
  col = mix(col, 1.0-col, invert);
  if (scan > 0.0) col *= 1.0 - scan*0.18*(0.5+0.5*sin(gl_FragCoord.y*3.14159*0.5));
  vec2 q = v - 0.5;
  col *= 1.0 - vig * dot(q,q) * 1.35;
  col = mix(col, col*vec3(1.04,1.0,0.94), warm);
  float g = h(gl_FragCoord.xy + fract(time*7.13)*vec2(391.0, 173.0)) - 0.5;
  col += g * grain;
  col = mix(col, flashColor, flash);
  gl_FragColor = vec4(col, 1.0);
}`;

export function createPost(canvas) {
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const U = {};
  ['tex', 'res', 'time', 'invert', 'ca', 'grain', 'vig', 'glitch', 'flash', 'zoomBlur', 'scan', 'mirror', 'warm', 'bloom', 'dirBlur', 'flashColor']
    .forEach((n) => (U[n] = gl.getUniformLocation(pr, n)));
  return (src, P) => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.uniform1i(U.tex, 0);
    gl.uniform2f(U.res, canvas.width, canvas.height);
    for (const k of ['time', 'invert', 'ca', 'grain', 'vig', 'glitch', 'flash', 'zoomBlur', 'scan', 'mirror', 'warm', 'bloom'])
      gl.uniform1f(U[k], P[k] || 0);
    gl.uniform2f(U.dirBlur, ...(P.dirBlur || [0, 0]));
    gl.uniform3f(U.flashColor, ...(P.flashColor || [1, 1, 1]));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}
```

