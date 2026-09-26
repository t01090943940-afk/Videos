# skillshub · 源码文件索引（自动生成）

> Skills Hub 宣传片（114 拍）。原目录 `opus-production-video-skill-hub/`。
> 源码已原样解压在 **`assets/cases/skillshub/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show skillshub <路径>`；拷出来改：`python3 scripts/casebook.py copy skillshub <目标目录>`。

来源档案：

- `opus-production-video-skill-hub/skills-hub-promo-source.zip` · zip · 72.5 KB · sha256 `6372b063d708c729…`

收录：文本 30 个（163.4 KB）· 二进制 0 个（0.0 KB，字体/小图）· 未收录 0 个（0.0 KB）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `promo/.gitignore` | 3 | 0.1 KB |  |
| `promo/README.md` | 98 | 9.1 KB | Skills Hub 宣传片（promo/） |
| `promo/audio/make-track.py` | 512 | 18.5 KB | Skills Hub 宣传片配乐：纯 numpy/scipy 合成，节拍网格与画面共用 src/cues.json。 |
| `promo/package-lock.json` | 57 | 2.0 KB |  |
| `promo/package.json` | 19 | 0.6 KB | npm scripts: audio, preview, render, render:draft |
| `promo/render.mjs` | 119 | 5.2 KB | 逐帧渲染：起本地静态服务 → Chromium 打开舞台 → 每帧 seek(t) 截图 → 管道喂给 ffmpeg，混入配乐。 |
| `promo/src/cues.json` | 21 | 1.1 KB |  |
| `promo/src/index.html` | 20 | 0.6 KB | Skills Hub — Film |
| `promo/src/js/data.js` | 91 | 5.7 KB | 片中出现的真实数据。 |
| `promo/src/js/engine.js` | 156 | 5.2 KB | b 在 [b0,b1] 内的归一化进度，带缓动。 |
| `promo/src/js/fx.js` | 159 | 5.6 KB | 故障字：主层 + 红青色散层 + 横向切片层。 |
| `promo/src/js/main.js` | 186 | 6.8 KB | 舞台入口：挂载所有场景，提供 window. seek(t) 给逐帧渲染器；?play 时跟随音频实时预览。 |
| `promo/src/js/scenes/beyond.js` | 183 | 7.1 KB | 画一颗点阵球。z 为镜头缩放，alpha 为整体透明度。 |
| `promo/src/js/scenes/chaos.js` | 236 | 12.4 KB | b24–40 很多，很怪，没人知道：真机扫描的数字 + 快切提问 + 故障大字。 |
| `promo/src/js/scenes/chapter.js` | 41 | 1.5 KB | 章节题签与底部字幕：四个章节（收 / 链 / 看 / 享）和后续段落共用。 |
| `promo/src/js/scenes/extend.js` | 135 | 7.6 KB | b76–88 为扩展而建：四个接口模块逐拍「咔」进确定性内核，再收成工程 DAG。 |
| `promo/src/js/scenes/finale.js` | 67 | 3.7 KB | b104–114 定版：冲击 + Logo 锁定 + 一行命令。 |
| `promo/src/js/scenes/growth.js` | 124 | 5.1 KB | b8–24 一个、十个、一百个：卡片每两拍翻倍，从中心向外长。 |
| `promo/src/js/scenes/intro.js` | 80 | 4.2 KB | b0–8 起初，只是一个文件夹：光标、键入路径、SKILL.md 展开。 |
| `promo/src/js/scenes/link.js` | 79 | 4.7 KB | b52–60 链：库存居中，逐拍把符号链接挂到 8 个 Agent；改一处，全局同步。 |
| `promo/src/js/scenes/see.js` | 80 | 3.4 KB | b60–68 看：重做后的总览页从透视里落定，镜头依次推到 KPI、图表、列表。 |
| `promo/src/js/scenes/share.js` | 118 | 8.0 KB | b68–76 享：左半推到社团仓库并分发链接；甩镜到右半，Agent 帮你启用 skill。 |
| `promo/src/js/scenes/store.js` | 126 | 6.4 KB | b44–52 收：散落的副本被吸进统一库存，581 → 213，按内容哈希去重。 |
| `promo/src/js/scenes/team.js` | 83 | 5.2 KB | b88–96 每个人在用什么：成员主页卡逐拍滑入，接社团精选排行。 |
| `promo/src/js/scenes/title.js` | 100 | 4.2 KB | b40–44 冲击定名：Logo 从爆点里收束，字标逐字升起。 |
| `promo/src/js/theme.js` | 56 | 1.7 KB | 画布与特效用的主题色。CSS 的部分在 styles/tokens.css（:root 浅色，[data-theme="dark"] 深色）。 |
| `promo/src/js/ui.js` | 142 | 7.8 KB | Hub 标志：中心库存 + 六条链接到各 Agent。 |
| `promo/src/styles/stage.css` | 103 | 5.5 KB | 影片舞台：1920×1080 固定画布，分层 = 背景 canvas / DOM 世界 / 前景 canvas / 后期 |
| `promo/src/styles/tokens.css` | 116 | 3.8 KB | Skills Hub 设计令牌（宣传片版，0 → 1 重做） |
| `promo/src/styles/ui.css` | 216 | 10.5 KB | Skills Hub 产品界面组件（宣传片里出现的「新前端」） |
