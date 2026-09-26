# 做代码视频的通用打法（从 24 份 CoExp 里提炼的共识）

这里只写**多个案例独立验证过**的做法；每条后面标了出处，想看原文就打开对应 `references/cases/<id>/CoExp.md`。单个案例的细节以它自己的 CoExp 为准。

## 目录

1. [两种用法：照抄 vs 二创](#1-两种用法照抄-vs-二创)
2. [标准工作流（10 关）](#2-标准工作流10-关)
3. [开工前必须问清 / 查清的事](#3-开工前必须问清--查清的事)
4. [创作原则（叙事、节奏、画面、声音）](#4-创作原则叙事节奏画面声音)
5. [工程铁律](#5-工程铁律)
6. [高频坑 Top 30（跨案例重复出现）](#6-高频坑-top-30跨案例重复出现)
7. [交付清单与如实说明](#7-交付清单与如实说明)
8. [通用开工提示词模板](#8-通用开工提示词模板)
9. [各案例原文模板在哪](#9-各案例原文模板在哪)

---

## 1. 两种用法：照抄 vs 二创

**照抄（能力一般时推荐，稳）**

1. 在 `catalog.md` 找到与需求最接近的案例（用途 + 画幅 + 栈都接近最好）。
2. 读它的 `CARD.md`，再读它的 `CoExp.md` 中"需求拆解 / 设计意图 / 坑 / 开工提示词模板"四节。
3. `python3 scripts/casebook.py copy <id> work/<id>` 把原始工程拷出来，**先原样跑通**（环境、字体、ffmpeg 都通了再改）。
4. 只替换"数据层"：文案、数字、配色、素材、BPM 与段落表（timeline / cues / shots / plan / edl 等唯一时间源）。管线、渲染器、合成器、QC 脚本不动。
5. 按该案例 CoExp 的清单逐项自查，按它的坑表逐条规避。

**二创（能力强时）**

1. 从 2–3 个案例里各取一块：比如 `skillshub` 的 DOM 舞台 + `codecosmos` 的定格语法 + `shuchenglin` 的歌曲重构。
2. 仍然遵守第 5 节的工程铁律（纯函数、唯一时间源、整数帧拍、声音同源、先骨架后细节）——这些是所有案例的公约数，换任何风格都成立。
3. 新画风先做一张静帧确认可行，再进时间线；不熟的库先查 `atlas`（能力与边界），再做 2 秒小样。

## 2. 标准工作流（10 关）

几乎所有 CoExp 的"流程模板"都能归到这 10 关（`shuchenglin` L8 的 10 步产线、`skillshub` L493、`xuanlan` L582、`gpt-autumn` L884 最完整）：

| 关 | 做什么 | 产物 | 通过标准 |
|---|---|---|---|
| 0 约束 | 时长、画幅、fps、交付渠道与体积上限、是否要声音、能否访问素材/网络 | 规格表 | 用户确认 |
| 1 调研 | 读用户给的资料/仓库/素材；列出可上屏的真实数字（写下统计命令）、原话金句、线索 | 素材表 + 线索表 | 每个数字可复现 |
| 2 主线 | 一句话主线 + 母题 + 情绪曲线 | 一句话 + 曲线 | 能用一句话讲给别人 |
| 3 分镜 | BPM、段落、每镜：时间/拍、画面、字幕、音效、转场延续物、素材依据 | 分镜表 + 唯一时间源文件 | 关键时间做整除验算 |
| 4 环境 | ffmpeg 编码器、Chromium/GL、中文字体、Python 包、核数、磁盘 | 探针脚本输出 | 能出一帧带中文的图 |
| 5 骨架 | 渲染器 + 所有场景占位 + HUD + 全片时长跑通 | 占位联系表 | 时长/结构正确 |
| 6 配乐 | 按同一时间源合成；打印分段 RMS、画频谱 | music.wav | 曲线与情绪一致 |
| 7 场景 | 逐段填内容；每写 2–3 段出一次静帧联系表 | 分段静帧 | 转场前后帧已检查 |
| 8 全片 | 后台分段并行渲染（可续跑）；草稿 30fps → 定稿 | 母版 | 帧数 = 时长 × fps |
| 9 交付 | 编码（按体积反推码率）、响度、机器 QC、成片抽帧复查、README、如实说明 | 成片 + 报告 | QC 全绿或写明 limitation |

## 3. 开工前必须问清 / 查清的事

- **画幅**（横 16:9 / 竖 9:16）——事后改要重排全部版式（`codecosmos` L325 流程坑）。
- **交付渠道与体积上限**：聊天附件常见 30 MB、GitHub 50 MB 警告 / 100 MB 拒收（`skillshub`、`studysolo`、`protocom`）。有上限就从一开始用固定码率。
- **画风**（多画风片要让用户从选项里选，`stopmotion` SKILL.md §0）。
- **事实**：社团名、歌名、"第几个中秋"、口径（"264 次分享"不是"264 个网站"）——推断的要列出来请用户确认（`protocom`、`gongcishi`、`shuchenglin`）。
- **素材是否真的在磁盘上**：聊天里发的图不一定在文件系统（`protocom` 坑）；先 `ls`。
- **环境**：`ffmpeg -encoders | grep -E "264|aac"`（Playwright 自带 ffmpeg 只有 vp8；用 `pip install imageio-ffmpeg`）、`ffmpeg -filters | grep drawtext`、`fc-list :lang=zh`、Chromium 路径与 playwright 版本匹配、`nproc`、外网（字体 CDN、GitHub raw 常被拦 → npm `@fontsource`）。

## 4. 创作原则（叙事、节奏、画面、声音）

**叙事**
- 先找**母题**（一个想法 / 一个问题 / 一个符号 / 圆），全片围绕它；首尾呼应（`protocom`、`studysolo`、`hust1037`、`gpt-autumn`、`gongcishi`）。
- **形式承载内容**：风格变化对应戏剧功能或内容本质（`phasegate`、`protocom`、`codecosmos`、`beyond`）。
- **真实 > 精美**：数字、原话、源码行、截图都要可溯源；不确定的不上屏（`skillshub`、`studysolo`、`shuchenglin`、`yusheng`）。
- **可信度要论证而不是宣称**（引用回到原文、真实数据、真实运行的页面）。
- 最后一句把主语交给观众（"下一个是你"、"署你的名字"、"下一部由你来写"）。

**节奏**
- 情绪曲线 = 能量曲线 = 响度曲线（多个案例实测每秒 RMS 对照）。
- **燃来自反差**：最响之后最静、最密之后冻结；drop 前静默（半拍 / 1 拍 / 1 秒）。
- 核心观点放在最安静处；至少一个"三重叠合"时刻（叙事 + 音乐 + 视觉高潮同帧）。
- 分层卡点（小节 / 拍 / 十六分 / 帧）+ 相邻段变速；大卡点多通道确认。
- 动作落点对拍（结束对拍，不是起点对拍）；whoosh/风声提前 0.12–0.33 s。
- 停留时长：纯画面 ≥ 1 拍、8–10 字字幕 ≥ 2 拍、两行观点 ≥ 4 拍。

**画面**
- 统一外壳、多变内核：固定 HUD 安全区、固定配色体系、一条主缓动（outExpo）+ 回弹例外。
- 匹配剪辑的终点对准下一镜头第 0 帧**实际画出的位置**（先算两边屏幕坐标）。
- 界面 / 产品截图按视频尺度放大 1.2–1.3 倍；字幕 ≥ 34 px；文字压复杂背景时加底衬或压暗背景到 15%。
- 颗粒 ≤ 8–10%（否则码率爆炸）；白到黑用"满白 → 硬切"。
- 代码画不好真人就不画人，画关系 / 符号 / 木偶（`hust1037`、`dingge`、`stopmotion`）。

**声音**
- 全部程序合成最安全（无版权）；用现成歌曲就先解剖网格，只在同一小节位置下刀。
- 声音事件从画面数据导出（事件表 / cues / inspect），而不是事后对齐。
- 侧链让律动呼吸；静默要设计（写进 cue），拼接处 5–12 ms 淡变防爆音。
- 响度：先测再定增益；目标 −14 LUFS（平台）或 −16 LUFS，真峰值 ≤ −1 dBTP（AAC 编码后再测）。
- **AI 听不到**：用 RMS 曲线、频谱图、波形图验证结构，交付时写"需要人耳复听"。

## 5. 工程铁律

1. **画面是时间/帧号的纯函数**；随机数全部种子化（mulberry32 / hash(帧号)）；有状态的东西预计算或写成插值。
2. **唯一时间源**：一个文件写 BPM、段落、镜头（拍数）、冲击点、静默段、音效 cue；画面与配乐都读它；起点由累加算出。
3. **每拍整数帧**（BPM × FPS 查表）；总时长 = 拍数 × 拍长；音频多生成 1 秒再用 `-t` / `-shortest` 裁齐。
4. **先骨架后细节**：占位跑通全片 → 联系表 → 逐镜打磨。
5. **渲染可分段、可续跑、可只重渲某区间**；长任务后台跑，同时写音频和文档。
6. **字体就绪才渲染**：本地字体（@fontsource / 裁字内嵌）+ `document.fonts.load(font, 全部文字)` + `fonts.ready` + `__ready` 握手。
7. **无 GPU 的 Chromium**：`--disable-accelerated-2d-canvas --disable-gpu-rasterization`，WebGL 用 SwiftShader，`preserveDrawingBuffer: true`；用 http 服务而不是 file://。
8. **截图方式**：`canvas.toDataURL('image/jpeg')` 或 CDP `Page.captureScreenshot` JPEG，不用 `page.screenshot` PNG；ffmpeg `image2pipe` 管道直编码并处理背压。
9. **状态隔离**：Canvas 每场景 save/restore；场景代码不 `setTransform`；透明度乘法叠加。
10. **原片永不覆盖；报告早落盘**；工具链与项目依赖隔离。

## 6. 高频坑 Top 30（跨案例重复出现）

| # | 坑 | 出现在 | 解法 |
|---|---|---|---|
| 1 | 无 GPU 时 Canvas 2D 截图一帧几十秒 | protocom、oneink、phasegate | `--disable-accelerated-2d-canvas`；测"绘制 + 导出"总时间 |
| 2 | 系统/Playwright 的 ffmpeg 没有 libx264/AAC/drawtext | skillshub、studysolo、yusheng | `pip install imageio-ffmpeg`；标签在 HTML 里自己画 |
| 3 | 中文字体后备、分片未加载、`display:none` 不下载 | skillshub、yusheng、protocom、phasegate、samemoon | 全量 `document.fonts.load` + 预热；本地化字体 |
| 4 | 页面无 charset → 中文乱码 | samemoon | `route.fulfill` 补 `<meta charset>`；第一张截图必须含中文 |
| 5 | 字体 CDN / GitHub raw 被拦，下到错误页 | yusheng、studysolo | npm `@fontsource`；curl 加 `-f` 并检查文件大小 |
| 6 | 颗粒 + 低 CRF 让体积爆炸（88–775 MB） | protocom、codecosmos、yusheng、studysolo、skillshub | 颗粒 ≤ 10%；有上限用两遍固定码率 |
| 7 | 单遍 loudnorm 对短片不准；AAC 抬高真峰值 | yusheng、stopmotion、cosmos30 | ebur128 测 + 静态增益，或两遍 loudnorm；母带留余量 |
| 8 | 配乐全段一样响（tanh 压扁） | yusheng、skillshub、gongcishi | 分段总线自动化；按秒量 RMS |
| 9 | 转场叠画只在成片里才发现 | yusheng、studysolo | 静帧覆盖每个转场的起点、中点、终点 |
| 10 | 形状匹配转场错位 / DOM↔WebGL 交接跳一下 | studysolo、protocom | 先算两边屏幕坐标；交接帧滤镜/透明度两边一致 |
| 11 | 分层叠加导致的布局冲突（HUD 压内容、文字重叠） | codecosmos、skillshub、yusheng | 定义安全区常量；联系表按最终合成检查 |
| 12 | Canvas 状态泄漏污染下一场景 | codecosmos、samemoon | 每场景 save/setTransform/restore |
| 13 | seek 后截到上一帧 | skillshub、phasegate | 等两帧 rAF；CDP 连拍两次一致 |
| 14 | 接管 rAF 后 `page.screenshot` 超时 | shuchenglin | CDP `captureScreenshot` |
| 15 | `mix-blend-mode` 在独立层叠上下文里失效 | skillshub | 后期层不依赖 blend mode |
| 16 | 浅色背景下 `lighter`/`screen` 看不见 | skillshub | 主题对象里放 blend；浅底用 multiply |
| 17 | 时间线跳号漏镜头 → 黑屏 | shuchenglin、ageint | 拍号连续编号；黑帧扫描 |
| 18 | 原曲 → 成片时间换算算错 | shuchenglin | 只保留一个换算公式，整除验算 |
| 19 | BPM 与 FPS 不整除，越往后越拖拍 | codecosmos、ageint | 查整除表选 BPM |
| 20 | 图池取模重复 | shuchenglin | 乘数与图池长度互质 |
| 21 | 动画时长超过拍长 / 物体只出现两帧 | yusheng、phasegate | 动画结束早于镜头结束；物体至少停 10–20 帧 |
| 22 | 字幕数量与画面不符 | skillshub | 叙事字幕不写具体数量 |
| 23 | 上屏数字统计错（草稿、目录名、空行被算进去） | yusheng | 精确脚本 + 对照条目列表复核 |
| 24 | 3D 相机路径穿过物体 / HDR 发光物过曝 / bloom 把 NaN 扩散 | studysolo、phasegate | 抬升弧线；最近距离下检查；`clamp(c,0,64)` |
| 25 | 性能数字是假的（HalfFloat 读回不同步） | stopmotion | RGBA8 探针计时 |
| 26 | `pkill -f` 杀掉自己的 shell（退出码 144） | skillshub、studysolo、shuchenglin | `cfg[A]` 技巧或 `ps … | grep -v grep` |
| 27 | 前台 `sleep` 等渲染被拦 / 超时 | studysolo、yusheng | 后台运行 + until 循环同时匹配成功与失败 |
| 28 | 用 Python `str.replace` 批量改源码改到两处 | yusheng | `assert s.count(anchor) == 1` |
| 29 | 仓库 lint 扫到视频目录 / `.gitignore` 忽略成片目录 | skillshub、studysolo、protocom | 配置 lint 忽略；成片放不被忽略的目录或 `git add -f` |
| 30 | "AI 听不到、看不到连续运动" | 几乎全部 | 数据验证 + 交付说明请人复听复看 |

## 7. 交付清单与如实说明

- [ ] `ffprobe` 核对：时长、分辨率、帧率、两路流、`yuv420p`、`+faststart`（必要时显式 BT.709 + limited range）。
- [ ] 帧数 = 时长 × fps；无黑帧/冻结帧意外；全解码无错（`-xerror`）。
- [ ] 响度与真峰值（在 MP4 里测）；分段 RMS 与情绪曲线一致。
- [ ] 成片每 2–2.5 s 抽一帧拼表复查（不要只看源码渲染的静帧）。
- [ ] 体积低于渠道上限；超过则准备压缩版（两遍编码）或改用 Release / 链接。
- [ ] README：分镜表、复现命令、依赖；源码入库，母版/中间产物不入库。
- [ ] **如实说明**：哪些是脚本化的（AI 回答、计时数字）、哪些是推断待确认的事实、哪些没验证（没有人耳试听、没看连续运动）、哪些素材有许可问题。

## 8. 通用开工提示词模板

把这段交给执行的 AI（或自己按它执行）。花括号里的内容按需求填写；"参考案例"填从 `catalog.md` 选出的 1–3 个 id。

```text
你要用代码制作一支 {时长} 秒、{1920×1080 横屏 / 1080×1920 竖屏}、{30/60} fps 的 {片型：产品宣传片/节日片/…}，交付 H.264 + AAC 的 MP4。

【参考案例】先读 code-video-casebook 里 {id1}、{id2} 的 CARD.md 和 CoExp.md（需求拆解、设计意图、坑、提示词模板四节），
并用 `python3 scripts/casebook.py copy {id1} work/{id1}` 拷出源码，先原样跑通再改。

【素材与事实】
- 资料/素材路径：{路径}。先列出全部素材，排除草稿与测试内容；上屏数字用精确脚本统计并写下命令。
- 必须出现的真实名称/数据：{…}；不确定的事实列出来让我确认，不要编。

【叙事】
- 一句话主线：{…}；母题：{…}；结尾把主语交给观众：{…}
- 情绪曲线 → 段落表（时间 / 拍 / 画面 / 字幕 / 音效 / 转场延续物 / 素材依据），先交分镜表再写代码。

【技术要求】
1. 画面是 render(t) 的纯函数：不用 Date.now / 未设种子的随机数 / CSS 动画；随机数种子化。
2. 一份时间源文件（BPM、段落、镜头拍数、冲击点、静默段、音效 cue），画面和配乐都读它；BPM 让每拍是整数帧。
3. 配乐用 numpy/scipy（或 Web Audio）合成，无采样；drop 前留静默；侧链；按秒打印 RMS。
4. 渲染：{按参考案例的管线}；分段并行、可续跑、可只重渲某区间；无 GPU 时加 --disable-accelerated-2d-canvas。
5. 每写 2–3 段出静帧联系表自查（覆盖每个转场的起点/中点/终点）；全片先出 30fps 草稿。
6. 导出：母版 + {体积上限} 以内的两遍编码交付版；响度 −14 LUFS、真峰值 ≤ −1 dBTP（在 MP4 里测）。

【交付】成片路径、源码与 README（分镜 + 复现命令）、QC 结果、需要人工确认的事项（试听、事实、许可）。
```

## 9. 各案例原文模板在哪

每份 CoExp 末尾都有"流程模板"和"给 AI 的开工提示词模板"，比上面的通用版更贴合各自的片型——**照抄时优先用对应案例的原文模板**：

| 案例 | 流程模板 | 开工提示词模板 |
|---|---|---|
| ageint | CoExp L457 | CoExp L510 |
| ai-rise | CoExp L254 | CoExp L268 |
| codecosmos | CoExp L313（用模板做新视频 7 步）、L484（合成器最小骨架） | — |
| cosmos30 | CoExp L622 | CoExp L783 |
| dingge | CoExp L374 | CoExp L405 |
| f12 | CoExp L361 | CoExp L381 |
| gongcishi | CoExp L680 | CoExp L738 |
| gpt-autumn | CoExp L884 | CoExp L1023 |
| hust1037 | CoExp L119（以本片为模板的经验）、L340（附录代码） | — |
| kimi-beat | CoExp L387 | CoExp L421 |
| kimi-film | CoExp L211 | CoExp L227 |
| moonlamp | CoExp L667 | CoExp L714 |
| oneink | CoExp L412 | CoExp L448 |
| phasegate | CoExp L923 | CoExp L974 |
| protocom | CoExp L931 | CoExp L985 |
| readclub | CoExp L427 | CoExp L489 |
| samemoon | CoExp L357 | CoExp L394 |
| senpai | CoExp L89（V2 结构可直接套） | — |
| shatter | CoExp L487 | CoExp L534 |
| shuchenglin | CoExp L312（60 秒骨架）、L522（常用命令） | — |
| skillshub | CoExp L493 | CoExp L537 |
| studysolo | CoExp L395 | CoExp L426 |
| xuanlan | CoExp L582 | CoExp L630 |
| yusheng | CoExp L451 | CoExp L521 |
| stopmotion | `assets/cases/stopmotion/stop-motion-3d/SKILL.md` §2 | 同文件 §0（开工前先问） |
