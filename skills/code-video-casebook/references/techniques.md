# 技法索引：想做 X → 哪个案例做过 → 去哪里看

"位置"列：`<id>/…` 是 `assets/cases/<id>/` 下的源码文件；`<id> CoExp Lnn` 是 `references/cases/<id>/CoExp.md` 的行号（用 `python3 scripts/casebook.py show <id> CoExp.md --lines nn:nn+80` 读）。找不到时用 `python3 scripts/casebook.py search "<关键词>"` 全文检索。

## 目录

1. [叙事与结构](#1-叙事与结构)
2. [节奏与卡点](#2-节奏与卡点)
3. [转场与剪辑](#3-转场与剪辑)
4. [文字与排版](#4-文字与排版)
5. [2D 视觉效果](#5-2d-视觉效果)
6. [画风实现](#6-画风实现)
7. [3D、相机与运镜](#7-3d相机与运镜)
8. [角色与表演](#8-角色与表演)
9. [声音](#9-声音)
10. [素材与真实画面](#10-素材与真实画面)
11. [工程、渲染与性能](#11-工程渲染与性能)
12. [QA 与交付](#12-qa-与交付)

---

## 1. 叙事与结构

| 技法 | 案例 | 位置 |
|---|---|---|
| 一句话主线 + 情绪曲线 → 段落表 | 几乎全部；最完整：`gpt-autumn`、`xuanlan`、`skillshub` | `gpt-autumn` CoExp L13；`xuanlan` CoExp L25；`skillshub` CoExp L11 |
| 需求原话逐条变成硬约束表 | `yusheng`、`readclub`、`shatter`（"AE 级"拆成可检验标准） | `yusheng` CoExp L12；`readclub` CoExp L11；`shatter` CoExp L13 |
| 先找母题再定结构（一个想法 / 一个问题 / 一个符号 / 圆） | `protocom`（灯泡五次）、`studysolo`（烂苹果味）、`hust1037`（金弧）、`gongcishi`（圆/月亮） | `protocom` CoExp L53；`studysolo` CoExp L12；`hust1037` CoExp L26、L293；`gongcishi` CoExp L36 |
| 一条线贯穿全片（形状延续） | `studysolo`（心电→书桌→分割线→光线→心跳）、`readclub`（红线） | `studysolo` CoExp L46 |
| 用一个符号替代真人 | `hust1037` | `hust1037` CoExp L26、L293 |
| 风格变化 = 戏剧结构（建立/冲突/转折/证据/升华） | `protocom`、`phasegate`（形式承载内容） | `protocom` CoExp L53；`phasegate` CoExp L36 |
| 风格隐喻 = 阶段本质（28 行对照表） | `codecosmos` | `codecosmos` CoExp L183 |
| 每个世界 = 一条原则 × 一种风格 | `beyond`、`claude15` | `beyond/AI_BEYOND_GENERATION/source/story.json`；`claude15/claude_intro/plan.py` |
| 快 → 停 → 慢（呼吸节奏） | `samemoon`、`readclub`、`gpt-autumn` | `samemoon` CoExp L141；`readclub` CoExp L39 |
| 核心观点放在最安静的段落 + 三重叠合 | `shuchenglin` | `shuchenglin` CoExp L129 |
| 60 秒高燃宣传片骨架（钩子/证据/断拍/方法/观点/高潮/展开/号召/落版） | `shuchenglin` | `shuchenglin` CoExp L312 |
| 8 节拍模板（world → character → … → echo） | `stopmotion` | `stopmotion/stop-motion-3d/references/directing.md` |
| 倒叙钩子 + 定格 + 倒带 + 对照（瑞士奶酪模型） | `dingge` | `dingge` CoExp L13；`dingge/dingge-source/docs/DIRECTOR.md` |
| 先看素材再定主题（线索表） | `gongcishi` | `gongcishi` CoExp L36 |
| 可信度要论证：引用飞回原文、真实数字、真实源码行 | `studysolo`、`skillshub`、`xuanlan`、`supercut` | `studysolo` CoExp L46；`supercut/src/code-lines.mjs` |
| 给观众留位置（"下一个是你"、空座位、`join --as @你`） | `protocom`、`shuchenglin`、`supercut` | `protocom/promo/src/act3.js`、`act4.js` |
| 首尾呼应 / 闭环可循环 | `codecosmos`（终端→终端）、`oneink`、`yusheng`、`gpt-autumn` | `codecosmos` CoExp L183 |
| 画幅即叙事（遮幅开合） | `skillshub`、`xuanlan`、`yusheng`、`kimi-film` | `skillshub/promo/src/js/main.js`；`xuanlan` CoExp L121 |
| 让对方成为画面主角（祝福片） | `senpai`（V1 被否 → V2）、`moonlamp` | `senpai` CoExp；`moonlamp` CoExp L346 |
| 情绪句 + 戏剧句 story lock、禁区清单 | `moonlamp`、`stopmotion` | `moonlamp` CoExp L346；`stopmotion/stop-motion-3d/SKILL.md` §2 |

## 2. 节奏与卡点

| 技法 | 案例 | 位置 |
|---|---|---|
| BPM × FPS 整除表 | `codecosmos` | `codecosmos` CoExp L49 |
| 128.571 BPM 让每拍 28 帧 / 22400 采样 | `ageint` | `ageint/The_Age_of_Intelligence-source/src/timeline.py` |
| 30×2.4 s=72 s、200 BPM 每镜 8 拍 | `cosmos30` | `cosmos30` CoExp L23 |
| 音乐解剖（librosa：BPM/段落/起音/网格） | `shuchenglin`、`kimi-beat`、`ai-rise` | `shuchenglin` CoExp L57；`kimi-beat/ai-beat-sync/audiomap.json` |
| 只在同一小节位置剪歌（整除验算） | `shuchenglin` | `shuchenglin` CoExp L91 |
| 按拍剪 BGM、adelay 按拍落 SFX | `ai-rise` | `ai-rise/audio_mix2.py` |
| 拍脉冲 `exp(-phase*k)` 驱动抖动/色差/缩放 | `ai-rise`、`cosmos30`（uBeat）、`f12`（kick 脉冲） | `ai-rise/main_v2.js`；`cosmos30/COSMOS/cosmos.frag` |
| beatEnv：震动/闪白/色散共用的卡点包络 | `yusheng` | `yusheng` CoExp L118 |
| 拍内冲击缩放表 `[.05,.028,.013,.005,0,0]` + 镜头首帧 +8.5% | `codecosmos` | `codecosmos/web/engine.js` |
| 剪辑间隔 4→2→1→½→¼ 拍加速 | `ageint`、`studysolo`（1 s→0.25 s）、`protocom`（0.5→0.25→急停） | `ageint` CoExp L27 |
| 四层节奏（小节/拍/十六分/镜头内呼吸）+ 相邻段变速 | `shuchenglin`、`skillshub` | `shuchenglin` CoExp L326；`skillshub` CoExp L48 |
| 多通道确认卡点（≥4 通道）+ 风声提前 0.2 s | `shuchenglin` | `shuchenglin` CoExp L347 |
| 动作落点对拍（拍前 0.5 拍起步，拍上撞击） | `skillshub` | `skillshub/promo/src/js/scenes/extend.js` |
| drop 前静默（半拍黑场 / 1/4 拍 / 1 秒全黑） | `skillshub`、`yusheng`、`phasegate`、`gongcishi`、`ageint`、`supercut` | `skillshub/promo/src/cues.json`（silences） |
| 由人输入"确认 ↵"引爆 drop（卖点 = 转折 = drop） | `phasegate` | `phasegate` CoExp L36 |
| 固定小节模式（每 Phase 一小节，第 4 拍确认叮） | `phasegate` | `phasegate` CoExp L186 |
| 一拍二定格语法（N−1 拍有效 + 1 拍照片卡） | `codecosmos` | `codecosmos` CoExp L99、L239 |
| 停留时长表（纯画面 1 拍、字幕 2 拍、观点 4 拍） | `shuchenglin` | `shuchenglin` CoExp L337 |
| 同构章节（收/链/看/享 每章 8 拍）再在关键段打破 | `skillshub` | `skillshub/promo/src/js/scenes/chapter.js` |
| 结构卡点检查：ffmpeg scene 检测对 1/16 拍网格 | `gongcishi` | `gongcishi` CoExp L359 |

## 3. 转场与剪辑

| 技法 | 案例 | 位置 |
|---|---|---|
| 匹配剪辑：终点对准下一镜头第 0 帧实际位置 | `protocom`、`studysolo`、`gongcishi`（月亮→挂钟 zoom=2.35） | `protocom` CoExp L735（坑）；`studysolo` CoExp L352（#15、#16） |
| 圆形母题 match cut | `gpt-autumn`、`samemoon` | `gpt-autumn` CoExp L135 |
| 光标块放大成纸 / 窗口形变成手机 | `protocom`、`xuanlan` | `protocom/promo/src/act1.js`；`xuanlan` CoExp L271 |
| 文字像素粒子形变（一个词变另一个词） | `yusheng` | `yusheng` CoExp L118（sampleText） |
| 烧穿纸面（mask-image 半径扩张 + 火边） | `yusheng` | `yusheng` CoExp L235 |
| 圆形 clip 扩散 / iris | `moon-letter`、`hust1037`、`phasegate`、`xuanlan` | `moon-letter/Moon_Letter_Interactive.html`；`hust1037` CoExp L168 |
| 材质 wipe（diagonal/radial 0.22 s） | `gpt-autumn` | `gpt-autumn/MidAutumn_60s_Final/src/film60.py` |
| 画风 wipe（强调色噪声斜边 14 帧） | `stopmotion` | `stopmotion/stop-motion-3d/assets/template/src/runtime/film.ts` |
| 转场表（flash/whip/tear/iris/zoom/pixel/slide/wipe/glitch） | `claude15` | `claude15/claude_intro/plan.py`（每镜转场类型）、`render.py`（TIN/TOUT 与各转场实现） |
| 转场库（hust1037） | `hust1037` | `hust1037` CoExp L168 |
| 甩镜（3840 轨道 + 速度模糊 / SVG 横向模糊） | `skillshub`、`yusheng`、`hust1037`、`phasegate` | `skillshub/promo/src/js/scenes/share.js` |
| 拉片 / 倒带（真实过去画面缩略图倒飞） | `protocom`、`readclub`（miniScene 画中画） | `protocom/promo/src/act2.js`、`main.js`（drawRaw） |
| 闪回蒙太奇 `sceneTime(t)` 映射回历史时刻 | `phasegate` | `phasegate` CoExp L276 |
| 故障回调蒙太奇（前 12 种画风） | `claude15` | `claude15/claude_intro/scenes_b.py` |
| 距离场蒙版 hero shard 转场 | `shatter` | `shatter` CoExp L137 |
| 满白 → 硬切暗场（不要交叉淡化） | `studysolo` | `studysolo` CoExp L352（#22） |
| 进入转场自动延长上一镜头垫底 | `gongcishi` | `gongcishi` CoExp L195 |
| Murch 六法则、J-cut/L-cut、cut on action、轴线 | `dingge` | `dingge` CoExp L54 |
| J-cut 先声后画（riser 早 1.5–2.5 s） | `yusheng` | `yusheng` CoExp L70 |

## 4. 文字与排版

| 技法 | 案例 | 位置 |
|---|---|---|
| 逐字显影（位移 + 去模糊 + 淡入，stagger） | `protocom`（revealText）、`yusheng`（reveal）、`skillshub`（revealChars）、`studysolo` | `protocom/promo/src/core.js`；`skillshub/promo/src/js/engine.js` |
| 文字引擎 7 种进场（rise/drop/slam/roll/type/fade/none）+ scramble | `shuchenglin` | `shuchenglin/树成林宣传片-工程源码/comp/comp.js` |
| 打字机 + 光标闪烁 | `codecosmos`、`yusheng`、`skillshub`、`xuanlan`（真实源码逐字敲出 + 行高亮） | `codecosmos/web/scenes_a.js`；`xuanlan` CoExp L271 |
| 年份砸入 → 飞入角标 | `ageint` | `ageint` CoExp L122 |
| 故障字（主层 + 红青色散 + clip-path 横切片） | `skillshub` | `skillshub/promo/src/js/fx.js` |
| 巨型描边水印 / 空心大字 | `f12`、`yusheng` | `f12/F12-Field-Guide-source/video.html` |
| 数据驱动双语字幕 CAPS | `samemoon` | `samemoon` CoExp L191 |
| 字幕统一骨架（底部带、2 色语义） | `senpai`、`hust1037` | `hust1037` CoExp L155 |
| 书法：按笔顺写字、行书化、牵丝、飞白 | `oneink` | `oneink/main.js`；`oneink` CoExp L94 |
| 中文字体：@fontsource 本地化、unicode-range 预加载、fontTools 裁字内嵌、cmap 逐字回退 | `readclub`、`protocom`、`ageint`、`gongcishi`、`skillshub` | `readclub/hust-reading-club-video/build.py`；`ageint/…/scripts/build_fonts.py` |
| 先 measure 再排版；按最宽情况测数字 | `protocom`、`studysolo`、`yusheng` | `yusheng` CoExp L417（#14） |
| 阅读带：背景元素进入阅读带自动变暗 | `samemoon` | `samemoon` CoExp L9 |

## 5. 2D 视觉效果

| 技法 | 案例 | 位置 |
|---|---|---|
| 颗粒（预生成噪声帧轮换） | `skillshub`、`studysolo`、`shuchenglin` | `skillshub/promo/src/js/fx.js` |
| 暗角、漏光、闪白、扫描线 | `protocom`（post.js 一 pass）、`studysolo`（fx.js） | `protocom/promo/src/post.js` |
| RGB 分离 / 色差 | `ai-rise`、`codecosmos`（multiply 着色后错位 lighter 叠加）、`shuchenglin` | `codecosmos/web/scenes_b.js` |
| 代码雨 | `kimi-beat`（DOM）、`codecosmos`（双螺旋）、`ai-rise` | `kimi-beat/ai-beat-sync/compositions/frames/04-f4-drop.html`；`codecosmos/web/scenes_b.js` |
| 距离场光束 / 解析高斯辉光 | `kimi-film` | `kimi-film/kit.py` |
| 霓虹线（宽半透明 + 窄实线叠 3 次，不用 shadowBlur） | `codecosmos` | `codecosmos/web/lib.js` |
| 翻倍生长（1→128 + 包围盒镜头） | `skillshub` | `skillshub/promo/src/js/scenes/growth.js` |
| 扇形牌堆 / 3D 卡片场 / 吸入拖尾 | `skillshub` | `skillshub/promo/src/js/scenes/{chaos,store}.js` |
| 作品墙 mosaic、信息流、斜率图、墙 + 裂缝 + 三角碎片 | `shuchenglin` | `shuchenglin/…/comp/comp.js` |
| 翻页（贝塞尔页面 + 明暗） | `studysolo` | `studysolo` CoExp L207 B |
| 月相 `phaseShadow` / destination-out 挖圆 | `samemoon`、`senpai` | `samemoon` CoExp L247 |
| 斐波那契球词云 / 点阵星球 | `samemoon`、`skillshub` | `skillshub/promo/src/js/scenes/beyond.js` |
| 里程表数字（`n % 10` = 目标） | `yusheng` | `yusheng` CoExp L235 |
| 透视网格地面（`z²`/`d^2.3` 分布） | `samemoon`、`skillshub` | `skillshub` CoExp L197 |
| 等轴测分层爆炸视图（仿射矩阵插值） | `xuanlan` | `xuanlan` CoExp L271 |
| 柔光点云 `np.bincount` splat | `ageint` | `ageint` CoExp L122 |
| Gray-Scott 反应扩散（预计算 24 个姿态） | `cosmos30` | `cosmos30/COSMOS/render.py`（scipy `laplace`）；`cosmos30` CoExp L307 |
| 元胞自动机（init 预计算点亮步数） | `codecosmos` | `codecosmos/web/scenes_b.js` |
| 解析轨迹粒子（无仿真，23 万粒子） | `shatter` | `shatter` CoExp L168 |
| 诗云星河（角动量守恒坍缩）、墨烟 curl noise | `oneink` | `oneink/main.js` |
| 180° 快门子帧运动模糊 | `shatter`、`town-camera-lab` | `shatter` CoExp L189；`town-camera-lab/town-camera-lab.html` L1320 |

## 6. 画风实现

| 画风 | 案例 | 位置 |
|---|---|---|
| 30 种画风的 shader 实现表 | `cosmos30` | `cosmos30` CoExp L307；`cosmos30/COSMOS/cosmos.frag` |
| 27 种代码可视化风格速查 | `codecosmos` | `codecosmos` CoExp L270 |
| 15 种画风（skia） | `claude15` | `claude15/claude_intro/scenes_a.py`、`scenes_b.py` |
| 15 个世界（cairo + GL） | `beyond` | `beyond/AI_BEYOND_GENERATION/source/art.py`、`threeworlds.py` |
| 7 条 3D 画风管线（diorama/block/clay/vox/sketch/comic/watercolor） | `stopmotion` | `stopmotion/stop-motion-3d/references/looks.md`、`assets/template/src/looks/*.ts` |
| 手绘铅笔：沸腾线（每 5 帧换 seed / 12fps boil）、双描、端点过冲 | `studysolo`、`protocom`、`phasegate`、`readclub` | `protocom/promo/src/core.js`（sketchPoly）；`phasegate` CoExp L276（strokeD） |
| 水墨：吸墨阈值毛刺、边缘积墨、洇墨光晕、比尔定律 | `oneink` | `oneink/main.js`（着色器）；`oneink` CoExp L161 |
| 水彩：12 步 GLSL | `moonlamp` | `moonlamp/moonfilm/src/look/moonwash.ts`；`moonlamp` CoExp L529 |
| 写实 PBR（程序化贴图 Sobel 法线、GTAO、Bokeh） | `dingge` | `dingge/dingge-source/src/materials/{textures,library}.ts` |
| 同一物体三套外观（扁平/黏土/钛金属） | `phasegate` | `phasegate` CoExp L276 |
| 时代越早分辨率越低（浏览器进化史） | `xuanlan` | `xuanlan` CoExp L271 |
| keepRed 去色留红（每镜 grade 函数） | `dingge` | `dingge/dingge-source/src/film/shots.ts`、`timeline.ts` |
| 深浅主题一键切换（令牌 + 画布主题对象） | `skillshub` | `skillshub/promo/src/styles/tokens.css`、`src/js/theme.js` |

## 7. 3D、相机与运镜

| 技法 | 案例 | 位置 |
|---|---|---|
| 自写投影（Canvas 2D 里的 3D）/ 背面剔除 / 画家算法 | `protocom`（积木山）、`codecosmos`（camera()）、`ageint` | `protocom/promo/src/core.js`；`codecosmos/web/lib.js` |
| 4D 超立方体投影（XW/ZW 旋转，旋转角乘 s_w） | `protocom`、`codecosmos`、`cosmos30` | `protocom/promo/src/act4.js`（tesseract）；`codecosmos/web/scenes_a.js` |
| 一个相机统管正交/等距/透视；fov 0.6° 伪正交 | `phasegate` | `phasegate` CoExp L276 |
| DOM → WebGL 同坐标交接 `D=(H/2)/tan(FOV/2)` | `studysolo` | `studysolo` CoExp L57 |
| 希区柯克变焦 | `phasegate`、`town-camera-lab` | `town-camera-lab/town-camera-lab.html`（MOVES） |
| 一镜到底：样条相机路径（Hermite + Fritsch-Carlson） | `moonlamp` | `moonlamp/moonfilm/src/cam/path.ts` |
| 手卷一镜到底：世界坐标大画布 + 对数插值 + 临界阻尼弹簧跟随 | `oneink` | `oneink/main.js`（camMat、HK/XK） |
| 手卷横移 camXAt | `readclub` | `readclub/hust-reading-club-video/video.src.html` |
| 13 种运镜 + 一句话原理 | `town-camera-lab` | `town-camera-lab/town-camera-lab.html` L1427–L1497 |
| 物理景深 CoC、测光曝光、色温 | `town-camera-lab` | 同上 L882–L1095 |
| 命名机位，无自由飞行；轴线 | `stopmotion`、`dingge` | `stopmotion/stop-motion-3d/references/directing.md` |
| 3D 相机路径避开穿过物体（抬升弧线） | `studysolo` | `studysolo` CoExp L352（#18） |
| 数码推拉（截图窗内放大对准焦点） | `studysolo`、`skillshub`（see.js 焦点镜头） | `skillshub/promo/src/js/scenes/see.js` |
| 自写 3D 合成器（AE 3D 图层最小实现） | `shatter` | `shatter` CoExp L59 |
| 静态几何按材质合批 | `dingge`、`town-camera-lab` | `dingge` CoExp L92 |

## 8. 角色与表演

| 技法 | 案例 | 位置 |
|---|---|---|
| 6 块刚体木偶 + IK（surface/exact/free 接触） | `stopmotion` | `stopmotion/stop-motion-3d/references/acting.md`、`assets/template/src/runtime/rig.ts` |
| 表演 Take 与镜头分离；按距离驱动步态；二分求解接触角 | `dingge` | `dingge/dingge-source/src/characters/{actor,poses,rig}.ts` |
| 两骨 IK + 前臂避桌；5 张表情贴图交叉淡化 | `moonlamp` | `moonlamp/moonfilm/src/world/girl.ts` |
| 预备 → 动作 → 反应 → 停顿；静止 ≤ 3 帧 | `stopmotion` | `stopmotion/stop-motion-3d/SKILL.md` §4 |
| on twos 量化 + boil 只在木偶动过时加 | `dingge` | `dingge` CoExp L92 |
| inspect 探针（穿插深度、接触距离数字化） | `stopmotion`、`moonlamp` | `stopmotion/…/assets/template/src/runtime/film.ts`；`moonlamp/moonfilm/src/entry/film.ts` |
| 世界状态做连续性（hold.<prop>） | `stopmotion` | `stopmotion/…/assets/template/src/world/world.json` |
| 人物吃月饼（reach / 咬痕） | `gpt-autumn` | `gpt-autumn/MidAutumn_60s_Final/src/film60.py` |

## 9. 声音

| 技法 | 案例 | 位置 |
|---|---|---|
| 合成器配方表（kick/snare/clap/hat/pad/pluck/reese/stab/riser/whoosh…） | `skillshub`、`studysolo`、`yusheng`、`xuanlan`、`codecosmos` | `skillshub` CoExp L223；`xuanlan` CoExp L300 |
| 中国乐器：古琴加法合成、古筝（Karplus-Strong / 15 泛音）、笛、箫 | `oneink`、`samemoon`、`gongcishi`、`moonlamp` | `oneink/audio.py`；`gongcishi` CoExp L359；`moonlamp/moonfilm/audio/score.py` |
| 侧链泵感 | 大多数 | `skillshub/promo/audio/make-track.py` |
| 声音事件由画面代码导出（ev → events.json） | `studysolo`、`oneink` | `studysolo` CoExp L99 核心 4；`oneink/main.js` |
| 由 inspect 姿态到位帧派生 Foley | `stopmotion` | `stopmotion/stop-motion-3d/scripts/audio.py` |
| BGM 骤停（连混响返回一起切） | `samemoon`、`gpt-autumn` | `samemoon` CoExp L260 |
| 磁带停转 / stutter | `ageint`、`codecosmos`、`readclub`、`supercut` | `codecosmos/music.py`；`ageint/…/src/music.py` |
| 调式叙事（宫/羽/泛音、万诗归一） | `oneink` | `oneink` CoExp L54 |
| 每幕独立 BPM 与配器 + 贯穿动机 | `kimi-film` | `kimi-film/score.py` |
| 编曲跟着升维叠层、滤波器逐段打开 | `phasegate` | `phasegate` CoExp L500 |
| 同一旋律快版 / 慢版点题 | `readclub` | `readclub` CoExp L211 |
| 原声接管（编曲撤出 + 闪避 −12 dB） | `gongcishi` | `gongcishi` CoExp L359 |
| 歌曲重构 + 包络限幅（不用 tanh 硬压） | `shuchenglin` | `shuchenglin/…/audio.py` |
| 程序化 MIDI + FluidSynth | `gpt-autumn` | `gpt-autumn/MidAutumn_60s_Final/src/music60.py` |
| TTS 旁白处理链 | `ai-rise` | `ai-rise/tts_gen.py` |
| 分段电平自动化（温情段轻、卡点段重） | `yusheng`、`phasegate` | `yusheng` CoExp L264 |
| 响度：两遍 loudnorm / ebur128 + 静态增益；AAC 后断言真峰值 | `gpt-autumn`、`cosmos30`、`yusheng`、`stopmotion` | `gpt-autumn/…/src/master_audio.py`；`stopmotion/…/scripts/finalize.py` |
| "AI 听不到"：RMS 曲线、频谱图、波形图验证 | `skillshub`、`studysolo`、`kimi-film` | `skillshub` CoExp L345（#10） |

## 10. 素材与真实画面

| 技法 | 案例 | 位置 |
|---|---|---|
| 素材普查 + 机器看片 + 线索表 | `gongcishi`、`shuchenglin` | `gongcishi` CoExp L36；`shuchenglin` CoExp L35 |
| 抠像 2.5D 拆层 + 补背景 | `shatter` | `shatter` CoExp L91 |
| 照片瓦片拼满月（落定后预合成） | `gongcishi` | `gongcishi` CoExp L323 |
| 低分辨率素材变风格（拍立得、网点、窗口外框 + 同图模糊背景） | `gongcishi`、`protocom`、`shuchenglin` | `shuchenglin` CoExp L379 |
| 虚拟时间录真实网页 | `shuchenglin` | `shuchenglin/…/vtime.js`、`capture.py` |
| 伪造 AI 流式回答录真实应用 | `studysolo` | `studysolo` CoExp L99 |
| 从截图逐列采样柱状图 | `protocom` | `protocom/promo/src/act3.js` |
| 视频代理切片 + 高光入点 | `supercut` | `supercut/tools/prep_media.mjs` |
| 真实数据集中一处（data.js） | `protocom`、`skillshub` | `protocom/promo/src/data.js`；`skillshub/promo/src/js/data.js` |

## 11. 工程、渲染与性能

| 技法 | 案例 | 位置 |
|---|---|---|
| 分段并行 + concat -c copy | `kimi-film`、`protocom`、`gpt-autumn`、`claude15`、`beyond` | `kimi-film/film_par.py` |
| 断点续渲（帧已存在就跳过） | `studysolo`、`stopmotion`、`gongcishi` | `stopmotion/…/assets/template/scripts/capture.mjs` |
| 局部重渲（只渲帧号列表/区间） | `codecosmos`、`ai-rise`、`senpai` | `codecosmos/render.mjs` |
| 无 GPU：`--disable-accelerated-2d-canvas`（41 s → 0.35 s/帧） | `protocom`、`oneink` | `protocom` CoExp L565 |
| 着色器半分辨率 / 静态光照烘焙 / 计时用 readPixels(1px) | `codecosmos`、`oneink` | `oneink` CoExp L276 |
| 字形/字位图缓存、文字精灵缓存 | `kimi-film`、`oneink`、`gpt-autumn` | `kimi-film/kit.py` |
| 局部小块绘制（只算变化区域） | `ageint`、`kimi-film` | `ageint` CoExp L122 |
| 进程数 ≤ 核数一半（SwiftShader 自身多线程） | `phasegate` | `phasegate` CoExp L705 |
| 视频工具链与项目依赖隔离（PROMO_DEPS / 不进 workspace） | `yusheng`、`skillshub` | `yusheng` CoExp L417（#6） |
| 冻结构建再渲染；重复帧硬链接 | `dingge` | `dingge/dingge-source/scripts/render.mjs` |

## 12. QA 与交付

| 技法 | 案例 | 位置 |
|---|---|---|
| 联系表（每镜中间帧/最后有效帧/转场前后） | 全部；`codecosmos`、`yusheng` 讲得最清楚 | `codecosmos` CoExp L325；`stopmotion/…/scripts/contact_sheet.py` |
| 黑帧扫描找漏镜头 | `shuchenglin`、`ageint`（qa_frames 空白帧） | `shuchenglin` CoExp L293；`ageint/…/src/qa_frames.py` |
| 起音对齐验证（画面领先 1 帧可接受） | `shuchenglin`、`shatter` | `shuchenglin` CoExp L293 |
| 9–13 项 QC finalize（帧齐、等长、BT.709、faststart、全解码、freeze、black、响度、穿插） | `stopmotion`、`moonlamp` | `stopmotion/…/scripts/finalize.py`；`moonlamp/moonfilm/scripts/kit/finalize.py` |
| 数据先校验再渲染（validate --timeline 文字版成片） | `stopmotion`、`beyond`、`ageint`（timeline validate） | `stopmotion/…/scripts/validate.py`；`beyond/…/source/validate.py` |
| 确定性验收：同一 t 渲染两次逐像素一致 / CDP 连拍两次一致 | `supercut`、`phasegate` | `supercut/README.md` |
| 从 MP4 解码抽帧核对字幕 | `moonlamp` | `moonlamp` CoExp L601 |
| 光敏安全（WCAG 闪烁限制） | `ageint` | `ageint` CoExp L399 |
| 交付三版（母版 / 仓库交付 < 50 MB / 聊天预览 < 30 MB） | `skillshub`、`protocom`、`codecosmos` | `skillshub` CoExp L237 |
| 章节元数据、字幕 SRT、manifest + sha256 | `cosmos30`、`beyond`、`gpt-autumn` | `cosmos30/COSMOS/{chapters.ffmeta, delivery_manifest.json}` |
| 如实说明：脚本化内容、未试听、存疑事实 | `studysolo`、`yusheng`、`gongcishi`、`stopmotion` | `studysolo` CoExp L352（末尾） |
