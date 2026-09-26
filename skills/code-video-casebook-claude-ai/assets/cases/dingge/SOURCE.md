# dingge · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show dingge <路径>`；还原成真实目录：`python3 scripts/casebook.py copy dingge <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `dingge-source/README.md` | 31 | 45 |
| 2 | `dingge-source/docs/DIRECTOR.md` | 183 | 81 |
| 3 | `dingge-source/index.html` | 18 | 269 |
| 4 | `dingge-source/package-lock.json` | 1908 | 292 |
| 5 | `dingge-source/package.json` | 29 | 2205 |
| 6 | `dingge-source/scripts/profile.mjs` | 21 | 2239 |
| 7 | `dingge-source/scripts/render.mjs` | 90 | 2265 |
| 8 | `dingge-source/scripts/shot.mjs` | 20 | 2360 |
| 9 | `dingge-source/src/app/main.ts` | 156 | 2385 |
| 10 | `dingge-source/src/app/ui.ts` | 125 | 2546 |
| 11 | `dingge-source/src/audio/score.ts` | 87 | 2676 |
| 12 | `dingge-source/src/audio/sfx.ts` | 114 | 2768 |
| 13 | `dingge-source/src/characters/actor.ts` | 159 | 2887 |
| 14 | `dingge-source/src/characters/poses.ts` | 103 | 3051 |
| 15 | `dingge-source/src/characters/rig.ts` | 261 | 3159 |
| 16 | `dingge-source/src/core/engine.ts` | 121 | 3425 |
| 17 | `dingge-source/src/core/math.ts` | 107 | 3551 |
| 18 | `dingge-source/src/film/mg.ts` | 296 | 3663 |
| 19 | `dingge-source/src/film/shots.ts` | 213 | 3964 |
| 20 | `dingge-source/src/film/stage.ts` | 376 | 4182 |
| 21 | `dingge-source/src/film/timeline.ts` | 124 | 4563 |
| 22 | `dingge-source/src/materials/library.ts` | 83 | 4692 |
| 23 | `dingge-source/src/materials/textures.ts` | 379 | 4780 |
| 24 | `dingge-source/src/world/building.ts` | 272 | 5164 |
| 25 | `dingge-source/src/world/city.ts` | 150 | 5441 |
| 26 | `dingge-source/src/world/crane.ts` | 200 | 5596 |
| 27 | `dingge-source/src/world/geo.ts` | 101 | 5801 |
| 28 | `dingge-source/src/world/layout.ts` | 37 | 5907 |
| 29 | `dingge-source/src/world/props.ts` | 206 | 5949 |
| 30 | `dingge-source/src/world/site.ts` | 49 | 6160 |
| 31 | `dingge-source/src/world/sky.ts` | 106 | 6214 |
| 32 | `dingge-source/tsconfig.json` | 15 | 6325 |
| 33 | `dingge-source/vite.config.ts` | 7 | 6345 |

---

### 1/33 · `dingge-source/README.md`
<!-- casebook-file {"path": "dingge-source/README.md", "lines": 31, "final_newline": true, "sha256": "51350b4689487917ade7cb736a94a0e7e23bbd139314f1cc868d901cf379e612", "original_sha256": "51350b4689487917ade7cb736a94a0e7e23bbd139314f1cc868d901cf379e612"} -->
````markdown
# 定格 · 工地沙盒 + 定格动画短片（TypeScript / Three.js）

## 运行
```bash
npm i
npm run dev            # 沙盒：漫游(60fps) / 影片播放 / 镜头跳转 / 机位预设 / 太阳与画质
npm run check          # 全片逐帧穿模检查 → out/collision-report.json
npm run render         # 离线逐帧渲染 + 合成音轨 + ffmpeg → out/dingge_1080p.mp4（可断点续渲）
node scripts/render.mjs --stills        # 每个镜头一张审片图
```

## 架构（场地 / 表演 / 镜头 三层分离）
```
src/core        math(确定性随机、缓动、关键帧) · engine(渲染器+后期：GTAO/Bokeh/调色/颗粒)
src/materials   程序化 PBR 贴图(混凝土、覆膜板、钢筋网、锈钢、安全网、标牌文字) · 材质库
src/world       layout(全部尺寸唯一来源) · building · crane · props · city · sky · site(静态几何按材质合批)
src/characters  rig(木偶骨架+全套劳保) · poses(姿势库/步态) · actor(表演：关键姿势+步态+地面吸附+安全绳)
src/film        stage(Take=连续表演，含接触求解) · shots(22 个镜头=纯数据) · timeline(on twos 量化/boil/复用) · mg(MG 图层)
src/audio       sfx(可复用合成音效) · score(环境声+音效提示+配乐，离线渲 WAV)
docs/DIRECTOR.md  导演稿：调研依据、文稿、导演阐述、分镜表、速度与防穿模规范
```
拍新片：保留 world/ 与 characters/，新写一份 Take（stage.ts）和 shots.ts 即可。

## 定格规则如何落地
- 时间按镜头 step 量化：2 = 每秒 12 张（on twos），冲击动作用 1。
- 只有木偶真的被“重新摆过”的帧才 boil（关节 ±0.35°、主光 ±1.5%），定格帧与环绕机位不抖。
- 未变化的 3D 画面直接复用，只重绘 MG。

## 已知限制
- 人物是“可摆拍木偶”风格（真实比例 + 全套 PPE），不是写实数字人。
- 无配音：云端无法访问 TTS，字幕与 MG 承担信息；`docs/DIRECTOR.md` 文稿可直接用于后期配音。
````

### 2/33 · `dingge-source/docs/DIRECTOR.md`
<!-- casebook-file {"path": "dingge-source/docs/DIRECTOR.md", "lines": 183, "final_newline": true, "sha256": "5655e11a6e67ad3d11643a26ffbb6a8c3f6ab9574469c33ae36df35859210b9a", "original_sha256": "5655e11a6e67ad3d11643a26ffbb6a8c3f6ab9574469c33ae36df35859210b9a"} -->
```markdown
# 《定格》导演稿 · 工地安全警示横屏短片

> 1920×1080 · 24fps（定格 on twos：每秒 12 张独立画面，关键冲击镜头 on ones）· 约 87 秒 · B 站横屏
> 本文件是拍摄与剪辑的唯一参照：`src/film/shots.ts` 里的每一个镜头都能在下面的分镜表里找到同号条目。

---

## 0. 一句话主旨

**高处坠落不是一个错误，是几层防护同时被打开。** 全片只挖这一个点：一次坠落，三个“省事”，一帧定格。

不做“十条安全规定”式清单。清单观众记不住；一个人、一个动作、一帧停住的画面，记得住。

---

## 1. 调研综述：本片用到的导演 / 剪辑 / 动画原理

### 1.1 导演工作流：从文稿到导演稿

| 阶段 | 产物 | 本片对应 |
|---|---|---|
| 文学剧本 | 事件、人物、因果 | §2 文稿 |
| 导演阐述 | 主题、结构、风格、色彩、声音、节奏 | §3 |
| 分镜头剧本 | 镜号、景别、机位/运动、画面内容、台词字幕、声音、时长 | §4 分镜表 |
| 拍摄 | 按镜头数据驱动相机与角色 | `src/film/shots.ts` |
| 剪辑 | 剪辑点、转场、节奏、混音 | `src/film/Timeline.ts` + `src/audio/Score.ts` |

分镜头剧本的标准栏目（镜号 / 景别 / 摄法 / 画面内容 / 台词 / 音效音乐 / 时长）参考了国内分镜教材的通用格式，本片额外增加三栏：**帧步**（定格的 1s/2s）、**剪辑点**、**存在理由**。最后一栏用来执行“无无意义镜头”：说不出这个镜头给观众新增了什么信息或情绪的，删掉。

### 1.2 剪辑：Murch 六法则（《眨眼之间》）

优先级从高到低：**情绪 51% > 故事 23% > 节奏 10% > 视线轨迹 7% > 二维平面（轴线）5% > 三维空间连续 4%**。
落到本片：

- **情绪优先**：定格那一帧的“停”，比任何解说都重。定格前 2 个镜头逐步缩短（4s → 2s → 2.5s 定格），制造加速感，然后声音全部抽空，只剩心跳。
- **视线轨迹**：上一镜头的视觉焦点在画面哪里，下一镜头的焦点就放在同一区域附近（例如 S08 挂钩在画面右中，S09 老周也在画面右中起步）。
- **轴线**：6F 作业面所有镜头机位都在楼体外侧 → 内侧这一半空间，老周后退方向在画面上始终是“向左”（机位统一在东侧，顺光拍摄）。S09、S18 用同一机位，S10、S19 用同一机位，观众能一眼对照两次结果的差别。

### 1.3 剪辑技法清单（本片实际使用）

- **动作剪辑（cut on action）**：S09→S10 在脚落地瞬间切；S16 系下颏带的“咔”在动作完成帧切。
- **匹配剪辑**：S01（开场定格）与 S11（剧情中定格）是同一帧，用来闭合开场悬念。S08（解开挂钩）与 S17（挂上挂钩）同景别同机位，一反一正。
- **J-cut / L-cut**：塔吊哨声先于 S07 画面进入（J-cut）；S11 定格后心跳延续进 S12 的 MG 分析（L-cut）。
- **景别递进**：每个动作段按“全景交代空间 → 中景交代动作 → 特写交代细节”推进；结尾用极远景拉开，把个人事件放回整个工地。
- **两极镜头**：S20（人物中近景）直接切 S21（极远航拍），用于从情绪收回到全局。

### 1.4 定格动画的顶层原理（以及在代码里怎么落地）

| 原理 | 实拍定格里的含义 | 本项目实现 |
|---|---|---|
| **On twos** | 12 张独立画面 × 每张拍 2 帧 = 24fps。节奏更“顿”，手工感来源 | 时间量化 `t = floor(t·12)/12`；角色、相机、灯光全部步进 |
| **On ones 用于快动作** | 快速动作若 on twos 会“跳”，关键冲击用 1s | S10 滑倒、S11 坠出、S19 被护栏拦住：`step: 1` |
| **Hold（停帧）** | 同一画面连续拍多帧，让观众读清姿势 | 定格镜头 = 单帧 hold；每个关键姿势到位后 hold 3–4 张 |
| **Boiling（手工抖动）** | 每次摆拍都有微小误差、灯光有微小起伏 | 以帧号为种子的确定性噪声：关节 ±0.35°、主光强度 ±1.5% |
| **无运动模糊** | 每张都是静止照片 | 不加 motion blur；快动作靠姿势的“拉伸”（smear pose）读出速度 |
| **缩微景深** | 真实定格是微缩模型，景深浅 | 特写镜头开启 Bokeh 景深，焦点锁定到角色/道具 |
| **运动控制相机** | 相机也是逐张移动 | 相机路径与角色使用同一量化时钟 |
| **Pose-to-pose** | 先定关键姿势，再补中间张 | 动作 = 关键姿势序列 + 缓入缓出插值 |

动画十二法则里本片重点用：**预备动作**（滑倒前重心后移、解扣前手先停顿）、**缓入缓出**、**弧线运动**（手臂挥动、安全帽飞出的抛物线）、**跟随与重叠**（安全带挂绳在人停下后继续晃动 2–3 张）、**时间节奏**（慢镜头交代、快镜头冲击）。

### 1.5 MG 动画原理

- **一块只说一件事**：每条字幕 ≤ 12 字；标注框只指一个部位。
- **层级**：主句 72px 粗体、说明 34px、出处 20px 灰色；同屏不超过 3 级。
- **缓动**：进入用 `easeOutBack`（轻微过冲，像定格里被“拍”上去），退出用 `easeInCubic`，不使用线性。
- **世界锚定标注**：标注圈的位置由 3D 点投影得到，跟着镜头走，不会漂移。
- **统一视觉系统**：全片只用一套安全色——警示黄 `#FFC400`、危险红 `#E53935`、安全绿 `#2EAD5B`、深墨 `#111418`、纸白 `#F4F1EA`。
- **MG 同样 on twos**，和定格画面保持同一种“手工节拍”。

### 1.6 安全内容依据（字幕里出现的每一个数字都能追溯）

| 字幕内容 | 依据 |
|---|---|
| 高处坠落占 59.07%（407 / 689 起） | 住建部办公厅《关于 2020 年房屋市政工程生产安全事故情况的通报》（建办质〔2021〕17 号） |
| 防护栏杆：上杆 1.2m、挡脚板 ≥180mm、立杆间距 ≤2m | JGJ 80-2016《建筑施工高处作业安全技术规范》4.3 |
| 安全带优先使用上方挂点（高挂低用），严禁常规工况低挂高用 | GB 23468-2025《坠落防护装备的选择、使用和维护》（2025-09-01 实施）；新标准从“必须”改为“优先”，但不允许低挂高用 |
| 起重臂和吊物下不准有人停留或行走 | 起重吊装“十不吊”第 1 条 |
| “三宝四口五临边” | JGJ 59-2011《建筑施工安全检查标准》 |

---

## 2. 文稿（文学剧本）

上午九点四十，某住宅项目，主体结构做到第 6 层。

钢筋工**老周**干了 22 年，正在 6F 楼面绑扎板筋。年轻工人**小李**为了把一捆钢筋从楼边推进来，拆下了临边防护栏杆的一段，顺手靠在一边，准备“一会儿再装”。

塔吊吊着下一捆钢筋过来了。老周要到楼边接应。他的安全帽下颏带一直没系，嫌勒。安全带挂在头顶的生命线上，可往楼边退时挂绳拽着后背，碍事——他解开挂钩，省了三秒。

他背对楼边后退，抬头看吊物，打手势。脚下踩到一截短钢筋头，一滑。

身后，正是小李拆开的那段缺口。

**画面在这里定格。**

三个“省事”——拆开的护栏、没挂的安全带、没系的下颏带——在同一秒对齐了。

现实没有暂停键。我们把时间倒回去，重来一次：护栏不拆；下颏带系紧；挂钩留在头顶上方的生命线上，还拽了两下确认挂牢。同样的一滑，这次护栏拦住了他，安全带绷紧了。老周扶着栏杆，长出一口气。

定格，只存在于视频里。

---

## 3. 导演阐述

**主题**：瑞士奶酪模型——每一层防护都有洞，事故发生在洞对齐的那一刻。片子要让观众亲眼看到“三个洞对齐”。

**结构**：倒叙钩子 → 建置 → 三个洞依次打开 → 定格 → 分析 → 倒带 → 三个洞依次关上 → 同样的意外、不同的结局 → 收。前后两段镜头一一对应，形成对照。

**风格**：写实材质 + 定格节拍。场景追求真实（混凝土、钢筋、脚手架、密目网、塔吊桁架、日光阴影），人物是“可摆拍的木偶”——真实比例、真实劳保装备、带一点手工感的脸。写实场景和手工节奏叠在一起，是本片的辨识度。

**色彩**：上午 9–10 点日光，太阳高度约 38°，暖白主光 + 天空蓝色补光，阴影偏冷。事故段落饱和度逐步降低，定格帧去色 60% 只保留警示红；重来段落饱和度恢复并略偏暖。

**声音**：工地环境声（远处车流、风、敲击、塔吊电机）贯穿；定格瞬间所有声音在同一帧切断，只剩低频心跳；倒带用磁带倒卷音效；重来段落的“咔”（下颏带、挂钩）做成全片最清晰的两个音效。音乐只在建置和结尾出现，事故段不用音乐。

**节奏**：建置段镜头 3–6 秒；进入事故链后逐镜缩短到 2 秒；定格后放慢到 5–7 秒让观众读图；重来段回到 3 秒左右的平稳节奏。

**表演**：老周的动作要“熟练而随意”——解扣不看、后退不回头，这才是老工人真实的危险。重来段同样熟练，只是多了三个 1 秒钟的动作。

---

## 4. 分镜头表

景别：EWS 极远景 · WS 全景 · MS 中景 · MCU 中近景 · CU 特写 · ECU 大特写
帧步：2 = on twos（12 张/秒），1 = on ones（24 张/秒），H = 单帧 hold

| 镜号 | 时长 | 景别 / 机位 / 运动 | 画面与动作 | MG / 字幕 | 声音 | 帧步 | 剪辑点 | 存在理由 |
|---|---|---|---|---|---|---|---|---|
| S01 | 4.0 | MS，楼外侧齐 6F 高度，**环绕定格帧 40°**（bullet time） | 老周背向楼外、身体后仰越过缺口，安全帽离开头顶，全部静止 | “如果时间能定格在这一帧——” | 静默 → 低频心跳 | H（相机 2） | 硬切黑 | 倒叙钩子：先给结果，制造悬念 |
| S02 | 3.0 | 片名卡 | 警示条纹从两侧“拍”进，片名落下 | 《定格》/ 一次高处坠落的复盘 | 重音鼓点 | 2 | 条纹擦除 | 立题 |
| S03 | 6.0 | EWS，航拍，**缓慢下摇 + 前推** | 整个工地：塔吊回转吊钢筋、搅拌车、工人走动、周边楼群 | “上午 9:40 · 6F 作业面” | 工地环境声渐入，音乐起 | 2 | 叠化到 S04 | 建立空间：楼、塔吊、6F 的位置关系 |
| S04 | 4.0 | MS，6F 楼面内侧，平视，轻微推 | 老周蹲姿绑扎板筋，扎钩转两圈 → 画面停住 | 人物卡：“老周 · 钢筋工 · 干了 22 年” | 扎丝声 | 2 | 人物卡飞出后切 | 人物登场；“老手”就是危险的伏笔 |
| S05 | 4.0 | MS，楼边侧面，固定 | 小李拆下一段临边栏杆（两根横杆），靠在柱边 | 标注圈①“临边防护被拆开” | 钢管碰撞 | 2 | 栏杆落地动作点切 | 第一个洞：环境缺陷 |
| S06 | 3.0 | CU，老周头部侧面，固定 | 老周站起，下颏带在下巴下晃动 | 标注圈②“下颏带没系” | 呼吸、风声 | 2 | 视线看向画面右 → 切 | 第二个洞：个人防护 |
| S07 | 3.0 | MS 仰拍，楼边向上，固定 | 吊物（钢筋捆）从画面上方降入，吊索绷紧 | — | 塔吊哨声（J-cut 提前 0.5s） | 2 | 吊物入画停稳切 | 给出“要去楼边”的动机 |
| S08 | 3.0 | ECU，头顶生命线上的挂点 | 手指压开挂钩舌片，挂钩离开钢筋；挂绳甩开 | 标注圈③“安全带解开 · 省 3 秒” | “咔哒” | 2 | 挂绳甩出方向切 | 第三个洞：行为 |
| S09 | 4.0 | WS，楼面侧向，固定 | 老周背向楼边后退、抬头、挥手指挥吊物 | — | 脚步、哨声 | 2 | 右脚落地瞬间切（cut on action） | 交代空间：他正走向缺口 |
| S10 | 2.0 | CU，脚部低机位 | 靴子踩上钢筋头，滚动打滑 | — | 钢筋滚动声 | **1** | 身体失衡帧切 | 意外触发点 |
| S11 | 2.5 | MS，楼外侧（= S01 机位起点） | 身体后仰越过缺口，安全帽飞出 → **定格** | — | 所有声音同帧切断 → 心跳 | **1 → H** | 定格后不切，MG 叠入 | 闭合开场悬念 |
| S12 | 7.0 | 定格帧上叠 MG，画面去色 | 三个标注圈同时亮起；右侧三片“奶酪”滑入，洞对齐，箭头穿过 | “不是一个错误 / 是三层防护同时失效” | 心跳延续（L-cut），低音 | 2 | 奶酪片退出 | 核心论点 |
| S13 | 5.0 | 全屏 MG 数据卡 | 条形图生长到 59.07% | “高处坠落 · 占房屋市政工程事故 59.07%” + 出处 | 数字滚动音 | 2 | 条纹擦除 | 用数据说明这不是个例 |
| S14 | 4.0 | 回到 S11 定格帧 → **倒放** | 画面逐张倒退：身体回正、挂钩回扣、栏杆回到原位 | “现实没有暂停键。/ 但这次，我们倒回去。” | 磁带倒卷声 | 1（倒序） | 倒到 S05 起点切 | 转折，引出正确做法 |
| S15 | 5.0 | MS，同 S05 机位 | 小李伸手要拆栏杆，停住，改为从栏杆上方传递钢筋；栏杆完好 | 尺寸标注：上杆 1.2m / 挡脚板 ≥180mm / 立杆间距 ≤2m · JGJ 80-2016 | 轻鼓点起 | 2 | 标注收回切 | 关上第一个洞 |
| S16 | 3.0 | CU，同 S06 机位 | 老周双手扣上下颏带，收紧 | “下颏带 · 系紧” | 清脆“咔” | 2 | “咔”帧切 | 关上第二个洞 |
| S17 | 3.0 | ECU，同 S08 景别，挂点在头顶上方的钢丝绳生命线 | 手伸向挂钩，不解，改为下拉两次确认挂牢 | “安全带 · 挂在上方” · GB 23468-2025 | 两声挂绳拉紧 | 2 | 舌片闭合帧切 | 关上第三个洞 |
| S18 | 3.5 | WS，同 S09 机位 | 同样后退、指挥吊物；身后挂绳随行 | — | 脚步、哨声 | 2 | 脚落地切 | 对照：同样的工作 |
| S19 | 3.5 | MS，同 S11 机位 | 同样一滑；腰背撞上护栏上杆、挂绳绷直；老周抓住栏杆稳住 | — | 钢管闷响 + 绳子绷紧声 | **1** → 2 | 稳住后 hold 4 张切 | 同样意外、不同结局 |
| S20 | 3.0 | MCU，老周正面偏侧 | 长出一口气，抬头看挂点；吊物平稳落在料架上 | — | 呼气、远处哨声两短 | 2 | 抬头方向切 | 情绪落地 |
| S21 | 7.0 | EWS，航拍**上升后拉** | 工地继续运转，塔吊回转 | “定格，只存在于视频里。/ 现实里，没有倒带。” | 音乐回归，环境声 | 2 | 渐黑 | 从个人回到全局 |
| S22 | 5.0 | 全屏 MG 结尾卡 | 三个图标依次落下：安全帽 / 安全带 / 护栏 | “下颏带系紧 · 安全带高挂 · 临边不拆” / 三宝 四口 五临边 | 结束音 | 2 | — | 可截图带走的一句话 |

合计 87 秒，22 个镜头（2088 帧）。

---

## 5. 动作速度与防穿模规范

**速度（按真实比例，定格节拍下仍需可信）**

- 正常步行 1.1–1.3 m/s，步频约 1.8 步/秒；后退步行 0.6–0.8 m/s，步幅缩短 30%。
- 蹲起：1.0–1.2 秒，含 0.2 秒预备（重心先前移）。
- 解/扣挂钩：手到位 0.4 秒 → 停顿 0.15 秒 → 按压 0.2 秒 → 离开 0.3 秒。
- 滑倒：失衡到越过栏杆高度 ≈ 0.5 秒（on ones 12 张）。
- 塔吊回转角速度 ≤ 0.6 rpm（约 3.6°/s），吊钩下降 ≤ 0.5 m/s 近地时减速。

**防穿模**

1. **地面吸附**：每帧计算双脚最低点，把骨盆高度修正到脚底 = 楼面标高，脚永远不陷入楼板也不悬空。
2. **碰撞体登记**：栏杆、柱、楼板边、料架、吊物都登记为轴对齐包围盒；角色的 16 个采样点（头、胸、骨盆、手、肘、膝、脚）每帧与之检测。
3. **离线审查**：`npm run check` 对全片逐帧检测，输出穿透深度 > 1cm 的帧号、镜号、部位，报告写入 `out/collision-report.json`。
4. **接触帧手摆**：S19 撞栏杆的姿势由求解器算出躯干刚好贴上上杆的角度，而不是手调数字。

---

## 6. 场地与资产复用

场地、人物、动作、灯光、声音全部是模块，拍新片只需要写一份新的 `shots.ts`：

- `world/` 建筑、塔吊、脚手架、护栏、道具、周边城市、天空 —— 通过 `Site` 统一搭建，暴露锚点（如 `site.anchors.edgeGap`、`site.anchors.lifeline`）。
- `characters/` 木偶骨架 + 劳保装备 + 姿势库 + 动作（行走、蹲绑、挥手指挥、解扣、扣扣、滑倒、被拦住）。
- `film/` 镜头 = 纯数据（相机路径、角色动作轨、MG 轨、声音提示、帧步），时间线负责量化、boil、渲染。
- `audio/` 所有音效是可复用的合成函数，沙盒实时播放和离线出片用同一套代码。
```

### 3/33 · `dingge-source/index.html`
<!-- casebook-file {"path": "dingge-source/index.html", "lines": 18, "final_newline": true, "sha256": "2f6a01781a26d46138410f2ed3375e4b2b8207f3f33438bef97790342fae3c9f", "original_sha256": "2f6a01781a26d46138410f2ed3375e4b2b8207f3f33438bef97790342fae3c9f"} -->
```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>定格 · 工地沙盒</title>
<style>
  html,body{margin:0;height:100%;background:#0d0f12;overflow:hidden;font-family:"Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif}
  #stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
  #frame{position:relative;aspect-ratio:16/9;width:min(100vw,calc(100vh*16/9))}
  #frame canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
</style>
</head>
<body>
<div id="stage"><div id="frame"></div></div>
<script type="module" src="/src/app/main.ts"></script>
</body>
</html>
```

### 4/33 · `dingge-source/package-lock.json`
<!-- casebook-file {"path": "dingge-source/package-lock.json", "lines": 1908, "final_newline": true, "sha256": "256391717209b42e8085efa925ba12a7854c2d1ef86c2242264cfa782db69d2b", "original_sha256": "256391717209b42e8085efa925ba12a7854c2d1ef86c2242264cfa782db69d2b"} -->
```json
{
  "name": "site-film",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "site-film",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "three": "^0.186.0"
      },
      "devDependencies": {
        "@types/three": "^0.186.0",
        "playwright": "^1.56.0",
        "tsx": "^4.23.15",
        "typescript": "^7.0.2",
        "vite": "^8.3.0",
        "vite-plugin-singlefile": "^2.3.3"
      }
    },
    "node_modules/@dimforge/rapier3d-compat": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/@dimforge/rapier3d-compat/-/rapier3d-compat-0.12.0.tgz",
      "integrity": "sha512-uekIGetywIgopfD97oDL5PfeezkFpNhwlzlaEYNOA0N6ghdsOvh/HYjSMek5Q2O1PYvRSDFcqFVJl4r4ZBwOow==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@oxc-project/types": {
      "version": "0.150.0",
      "resolved": "https://registry.npmjs.org/@oxc-project/types/-/types-0.150.0.tgz",
      "integrity": "sha512-rDS5/31E9HfPl/CIzGrn0DOlvBbXFseQ5URJ9sYMfstbKLD/c6Gm9vmRzRGDdAXyOIL4zmO37lc9RIwYqVruZw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/oxc-project"
      }
    },
    "node_modules/@rolldown/binding-android-arm-eabi": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm-eabi/-/binding-android-arm-eabi-1.2.9.tgz",
      "integrity": "sha512-tNISae1QEf/vkb3xkRcjV5SEdzPE97We5IVaa2Z8jSszQPZ8U60B/YCYpw4QI7VidYsBtKavczXf+DyDs9WGxw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-android-arm64": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm64/-/binding-android-arm64-1.2.9.tgz",
      "integrity": "sha512-YC8YsI30o606GTZi0VyzYlsDKFP8W61i/QzayHDkLbNEz/IShqAmTa+hsJRj13xTHA0H+6fk4b2UmGn+Q/cMlg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-arm64": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-arm64/-/binding-darwin-arm64-1.2.9.tgz",
      "integrity": "sha512-IwhlH3qK5urrY8hZiEgGkHKEFN901p/p2bjxCxJlr4GyNnF7wYpUvK+Y43uaRYuC4hpfjzbR3SJC3arX1jGvmw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-x64": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-x64/-/binding-darwin-x64-1.2.9.tgz",
      "integrity": "sha512-XxpJfVzFh+jilRxIXUqcfYAYcunIc/XEzIizsOL1fcJee5Sf7H3mH8WlLmfHfluz5amqR88QQo9izKtmMlavAw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-freebsd-x64": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-freebsd-x64/-/binding-freebsd-x64-1.2.9.tgz",
      "integrity": "sha512-kSfvhmgeWyfkbT3p/1s5vSgboogoah2zkm9fX2zjg2hHxSV7T4KhMWRUUaRk4OXNqoD3QAUeRqLcs1aZOK4U1g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm-gnueabihf": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.2.9.tgz",
      "integrity": "sha512-1RVzG17pxqbTfYLC352JlLt6kKLG+6Hr30n8DlIJqsnV5luUDd2Qdx9Ayw1Cabfyb1K9k0jXEZ7evxkRoT+uiw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-gnu": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.2.9.tgz",
      "integrity": "sha512-BXqPvZ2drqVD+/Z8UpKwcs4Mp7grM+eGFku4CAEKrEtcbAsUpzREphK1sogCRZGreVPiMkiiBtw0n3TPteuqvw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-musl": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.2.9.tgz",
      "integrity": "sha512-11vWvo8YDwLzukt27J3aYDWU+gg2P7J+ZOmiJ0hkF5BXZDW7pVya7r40MXDy6ya0i9KamoENSVKIugvJNgFXIA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-ppc64-gnu": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.2.9.tgz",
      "integrity": "sha512-a1tijMkdwsIARtc0F39ApURROkf3NwqinI6TOiSSWCTR7dT96dffNvMUtDHnq64wKNTIZOIlzKrFvvFUznJiyw==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-s390x-gnu": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.2.9.tgz",
      "integrity": "sha512-x6SQNdAvv4c3hWqTMaWuawzMX9myaCs/yEmlGsxJzkdClnHW7FbrjQuSiRDhuSYzEYoEMhsaJy9qHG/XNemJPQ==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-gnu": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.2.9.tgz",
      "integrity": "sha512-9s0AZ8BFK5/n7B/TBoa2yJE3gI3KURrbXcPBlsAsvjU4VeJKgE90y1YtNxyEUIcHPQkg6/yfF3qihUrcM/Kf0Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-musl": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.2.9.tgz",
      "integrity": "sha512-P7VWAmV+WdJluH7ovnRGoiv2i8To7GAZ+kGzfGup635cyL7SyYl3lSUaA3Gp5THf0n/Co5EyEqb2zbqq+nMOHQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-openharmony-arm64": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-openharmony-arm64/-/binding-openharmony-arm64-1.2.9.tgz",
      "integrity": "sha512-1qixtsE4BK8h+yS3BfmZ09UhA7O/N4IACva6YBr7EBvCJraByTuRcgOTaiA62Tm0vey3UcKXLOaoGHtYmNGEVg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-arm64-msvc": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.2.9.tgz",
      "integrity": "sha512-ok8IQjcEPs1AKZfuEUznVBrJw+gK4soq+bx8b1X2XoMqVClarc1q5JDmVtWXY1xfr6ZuHTAsPXHTgTrqKTZeww==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-x64-msvc": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.2.9.tgz",
      "integrity": "sha512-Ip2mXoU0hM0boq3Rf+ekuT653OROSo6aSYcPT1VHE4q52KvyxgFkQgrgb/IEsxOuvQ2fZZbs8khJAyCEPM24/g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.1.tgz",
      "integrity": "sha512-2j9bGt5Jh8hj+vPtgzPtl72j0yRxHAyumoo6TNfAjsLB04UtpSvPbPcDcBMxz7n+9CYB0c1GxQFxYRg2jimqGw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tweenjs/tween.js": {
      "version": "23.1.3",
      "resolved": "https://registry.npmjs.org/@tweenjs/tween.js/-/tween.js-23.1.3.tgz",
      "integrity": "sha512-vJmvvwFxYuGnF2axRtPYocag6Clbb5YS7kLL+SO/TeVFzHqDIWrNKYtcsPMibjDx9O+bu+psAy9NKfWklassUA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/stats.js": {
      "version": "0.17.4",
      "resolved": "https://registry.npmjs.org/@types/stats.js/-/stats.js-0.17.4.tgz",
      "integrity": "sha512-jIBvWWShCvlBqBNIZt0KAshWpvSjhkwkEu4ZUcASoAvhmrgAUI2t1dXrjSL4xXVLB4FznPrIsX3nKXFl/Dt4vA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/three": {
      "version": "0.186.0",
      "resolved": "https://registry.npmjs.org/@types/three/-/three-0.186.0.tgz",
      "integrity": "sha512-mxYSBpDC+D0pLfSP6sW4WZTcT+nrtmZcimMqnVmy36Hte3XpeYSrvgg4TRdaM1GemGog1AWzI5qL2VoIfMXbJQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@dimforge/rapier3d-compat": "~0.12.0",
        "@tweenjs/tween.js": "~23.1.3",
        "@types/stats.js": "*",
        "@types/webxr": ">=0.5.17",
        "fflate": "~0.8.3",
        "meshoptimizer": "~1.1.1"
      }
    },
    "node_modules/@types/webxr": {
      "version": "0.5.24",
      "resolved": "https://registry.npmjs.org/@types/webxr/-/webxr-0.5.24.tgz",
      "integrity": "sha512-h8fgEd/DpoS9CBrjEQXR+dIDraopAEfu4wYVNY2tEPwk60stPWhvZMf4Foo5FakuQ7HFZoa8WceaWFervK2Ovg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@typescript/typescript-aix-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-aix-ppc64/-/typescript-aix-ppc64-7.0.2.tgz",
      "integrity": "sha512-MTKKkWB7p/0E9xi1d1tHtZ5PiLkGEMIq88pK2CubZjOsLtYTLqhgIgi6zepFa+9GHZ6h05NMCkQxGKiPXMxXtQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-arm64/-/typescript-darwin-arm64-7.0.2.tgz",
      "integrity": "sha512-gowzar9MwS/aRWp6f3a4KUqzRjAZjOsmGNCM6LcTgXum+dBfgsBVMN+AgvOCCbguXyick6LJhpBszxMebJ8syA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-x64/-/typescript-darwin-x64-7.0.2.tgz",
      "integrity": "sha512-SZ9xZInqApNlNGc9s0W1VSsktYSOe9cFqNOIqmN1Gs8SmkjKZYFt017G4VwPxASInODuAdbTW7sXiFUf893RgA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-arm64/-/typescript-freebsd-arm64-7.0.2.tgz",
      "integrity": "sha512-W5NH4y/J0plIIS5b2xvTEkU7JFxyqdMAOgf+Ilhl0vHQXKO5dZoxd+C/jEtq56c4F3wk71RB4BMRQ2XdI+bwYQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-x64/-/typescript-freebsd-x64-7.0.2.tgz",
      "integrity": "sha512-UMGDx5sTpzNw3WiPebH7l90IWfJggEd+egHt/q6p7/Cm3zqoV7VxkGXt+3DxPIw8CcmvAB0j3sVVfbhX+M4Tpw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm/-/typescript-linux-arm-7.0.2.tgz",
      "integrity": "sha512-gffT3xPz9sR7j/YJExkyPntrI0P2EP9XbOyWzth2/Gs0RstK+90RBcO0ncXoXy/beYll1SXw846Nf2zdnEz0QQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm64/-/typescript-linux-arm64-7.0.2.tgz",
      "integrity": "sha512-Qh4eU4/y3yDjnfjjyPYihMj5/ODIlmt+Bzu17OI+fiSRDW57QmU5SiN63exPRNJPKUzcc1INa1NXdrJ+MqHjUQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-loong64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-loong64/-/typescript-linux-loong64-7.0.2.tgz",
      "integrity": "sha512-uEHck9i8hoAzXPiYRib1O7miOnz23SxIeVl6F4LXox+qov1K35jHcEW6VHKvZI+pyvl7fZEP4MCU5LYvIq1GuQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-mips64el": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-mips64el/-/typescript-linux-mips64el-7.0.2.tgz",
      "integrity": "sha512-R4KvAMnE43W5Qeqb0Ly56O3mWMWIAgsMyz36DCaycd5nbg/9kzm0liw3JocfRqyJY0KPmzFjbswozXyW0DnIYA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-ppc64/-/typescript-linux-ppc64-7.0.2.tgz",
      "integrity": "sha512-DORx5b3sd/4S7eayxm4FQv+A7CrkUIGRaHiwI8oiHTAI1fAPWhF4J0vAlkC8biAlHSVVwxMQ3tjZ2/DVbnQiiA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-riscv64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-riscv64/-/typescript-linux-riscv64-7.0.2.tgz",
      "integrity": "sha512-wf0jqEDOjrPRnKwYRyyJDRo11KMbvMFrU+q4zqKyChODBzvlkbhNQfKvLxQCcwTpdDaXSHZTVuh0JoCrKCUMHQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-s390x": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-s390x/-/typescript-linux-s390x-7.0.2.tgz",
      "integrity": "sha512-IkwJc3L7yhytWd/ewjyxNDfOmswCm9GWMJT/ue/dU4aZNbwZeYAetq42VyLmsmSjvoX7z74X6ZaYCtzAr0EuGw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-x64/-/typescript-linux-x64-7.0.2.tgz",
      "integrity": "sha512-EYdf2cNg7rgCWJnxCdJ+F3V39O8ihb37eHAu1LK8oAFizgTQbPOK7zHHXbPt8rX24COqODXeI3sIf0fCXG7H/A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-arm64/-/typescript-netbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-+polYF4MF04aPpO5FTkHran9yUQDSXqy5GiSDKpsll5jy3l3+g9QLhpf39T+ePtefhXLOGrLl0QIjkQP6VnelA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-x64/-/typescript-netbsd-x64-7.0.2.tgz",
      "integrity": "sha512-8YIT0EHM/3dq10ZOVF/A7pc/YSMtbcecct4rWtexrnSCHOPcpC2KTLXfTCR6vDpnSiY12heNb1GiN/wu+T/FyA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-arm64/-/typescript-openbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-APT8+ClYnuYm1u9+kgGXoMj2VzWzcymwh2gNSQVySHfkRDGOTVkoWLjCmOQSaO+PoqQ57B0flRp9SA+7GnnkzQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-x64/-/typescript-openbsd-x64-7.0.2.tgz",
      "integrity": "sha512-yX7s+Q0Dln0Dt9tEzZsAjXXR/+ytBM7AlglaqyeMPxQszJ1JhlJdZ6jLA+IzldHtflX81em7lDao1xXu+aRRkg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-sunos-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-sunos-x64/-/typescript-sunos-x64-7.0.2.tgz",
      "integrity": "sha512-dLJDGaLZ1D4HPQn62u1n8mBDkJREwMsAkCdkwd4Ieqw+x3TUyTsqY0YiBCtE6H6OzzgGk3iuZ3vFWRS+E8/d1g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-arm64/-/typescript-win32-arm64-7.0.2.tgz",
      "integrity": "sha512-Gyl1Vy6OsWesLzmq+EP0Fb7b4Nid5232AvcA2SFcdYreldpNtYFFofPjnt62y9hQy7VTaZp65ICJjuAQRaVcIQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-x64/-/typescript-win32-x64-7.0.2.tgz",
      "integrity": "sha512-0BQ3HkAHHlKLSp1qRvf3SUhGpGsDuhB/jgFw75guyqbxJqEaS0Cw/VFO8i2nHglJUzQCRtMMR/IBAKE3ETMC4g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fflate": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.3.tgz",
      "integrity": "sha512-tbZNuJrLwGUp3zshBtdy4W+ORxZuIh8a5ilyIEQDC5rY1f3U20JMry0Ll3WBzU58EZKsEuJFXhb5gwv8CsPvgA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.2.tgz",
      "integrity": "sha512-xiqMQR4xAeHTuB9uWm+fFRcIOgKBMiOBP+eXiyT7jsgVCq1bkVygt00oASowB7EdtpOHaaPgKt812P9ab+DDKA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.33.0.tgz",
      "integrity": "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.33.0",
        "lightningcss-darwin-arm64": "1.33.0",
        "lightningcss-darwin-x64": "1.33.0",
        "lightningcss-freebsd-x64": "1.33.0",
        "lightningcss-linux-arm-gnueabihf": "1.33.0",
        "lightningcss-linux-arm64-gnu": "1.33.0",
        "lightningcss-linux-arm64-musl": "1.33.0",
        "lightningcss-linux-x64-gnu": "1.33.0",
        "lightningcss-linux-x64-musl": "1.33.0",
        "lightningcss-win32-arm64-msvc": "1.33.0",
        "lightningcss-win32-x64-msvc": "1.33.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.33.0.tgz",
      "integrity": "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.33.0.tgz",
      "integrity": "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.33.0.tgz",
      "integrity": "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.33.0.tgz",
      "integrity": "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.33.0.tgz",
      "integrity": "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.33.0.tgz",
      "integrity": "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.33.0.tgz",
      "integrity": "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.33.0.tgz",
      "integrity": "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.33.0.tgz",
      "integrity": "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.33.0.tgz",
      "integrity": "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.33.0.tgz",
      "integrity": "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/meshoptimizer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/meshoptimizer/-/meshoptimizer-1.1.1.tgz",
      "integrity": "sha512-oRFNWJRDA/WTrVj7NWvqa5HqE1t9MYDj2VaWirQCzCCrAd2GHrqR/sQezCxiWATPNlKTcRaPRHPJwIRoPBAp5g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/micromatch/node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/playwright": {
      "version": "1.56.0",
      "resolved": "https://registry.npmjs.org/playwright/-/playwright-1.56.0.tgz",
      "integrity": "sha512-X5Q1b8lOdWIE4KAoHpW3SE8HvUB+ZZsUoN64ZhjnN8dOb1UpujxBtENGiZFE+9F/yhzJwYa+ca3u43FeLbboHA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright-core": "1.56.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "fsevents": "2.3.2"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.56.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.56.0.tgz",
      "integrity": "sha512-1SXl7pMfemAMSDn5rkPeZljxOCYAmQnYLBTExuh6E8USHXGSX3dx6lYZN/xPpTz1vimXmPA9CDnILvmJaB8aSQ==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/rolldown": {
      "version": "1.2.9",
      "resolved": "https://registry.npmjs.org/rolldown/-/rolldown-1.2.9.tgz",
      "integrity": "sha512-hx/Pv0N1haXRb11qkfnK5MXB/iqr7i0yjWQqmO9uHqZpBgQSqzc8UsSnEpalsh+j1I8qQ2CkXAkJC8Br3dKSlg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@oxc-project/types": "=0.150.0",
        "@rolldown/pluginutils": "^1.0.0"
      },
      "bin": {
        "rolldown": "bin/cli.mjs"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "optionalDependencies": {
        "@rolldown/binding-android-arm-eabi": "1.2.9",
        "@rolldown/binding-android-arm64": "1.2.9",
        "@rolldown/binding-darwin-arm64": "1.2.9",
        "@rolldown/binding-darwin-x64": "1.2.9",
        "@rolldown/binding-freebsd-x64": "1.2.9",
        "@rolldown/binding-linux-arm-gnueabihf": "1.2.9",
        "@rolldown/binding-linux-arm64-gnu": "1.2.9",
        "@rolldown/binding-linux-arm64-musl": "1.2.9",
        "@rolldown/binding-linux-ppc64-gnu": "1.2.9",
        "@rolldown/binding-linux-s390x-gnu": "1.2.9",
        "@rolldown/binding-linux-x64-gnu": "1.2.9",
        "@rolldown/binding-linux-x64-musl": "1.2.9",
        "@rolldown/binding-openharmony-arm64": "1.2.9",
        "@rolldown/binding-win32-arm64-msvc": "1.2.9",
        "@rolldown/binding-win32-x64-msvc": "1.2.9"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/three": {
      "version": "0.186.0",
      "resolved": "https://registry.npmjs.org/three/-/three-0.186.0.tgz",
      "integrity": "sha512-cr/fIM2ddMSVbYVgkfD4jLJv7Fh/8ZTjvo+7gQeSVGUZHxpx9FDwoL5iC7hUz/LiRA8wMbqfnb90xKfm1/HHkQ==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/tsx": {
      "version": "4.23.15",
      "resolved": "https://registry.npmjs.org/tsx/-/tsx-4.23.15.tgz",
      "integrity": "sha512-Yiex1Ovn8z2xPpOWckIiysV1SSyRMY9BkLF++q0yKiDxCqRhosKfMg3janKkiLBwZ5c/YryloKwGZcrEmtwxKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "~0.28.0"
      },
      "bin": {
        "tsx": "dist/cli.mjs"
      },
      "engines": {
        "node": ">=18.0.0"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      }
    },
    "node_modules/tsx/node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/typescript": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-7.0.2.tgz",
      "integrity": "sha512-8FYau96o3NKOhbjKi/qNvG/W5jhzxkbdm5sj9AbZ/5T5sWqn3hJgLfGx27sRKZWTvyzCP8dLRBTf5tBTSRVUNA==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc"
      },
      "engines": {
        "node": ">=16.20.0"
      },
      "optionalDependencies": {
        "@typescript/typescript-aix-ppc64": "7.0.2",
        "@typescript/typescript-darwin-arm64": "7.0.2",
        "@typescript/typescript-darwin-x64": "7.0.2",
        "@typescript/typescript-freebsd-arm64": "7.0.2",
        "@typescript/typescript-freebsd-x64": "7.0.2",
        "@typescript/typescript-linux-arm": "7.0.2",
        "@typescript/typescript-linux-arm64": "7.0.2",
        "@typescript/typescript-linux-loong64": "7.0.2",
        "@typescript/typescript-linux-mips64el": "7.0.2",
        "@typescript/typescript-linux-ppc64": "7.0.2",
        "@typescript/typescript-linux-riscv64": "7.0.2",
        "@typescript/typescript-linux-s390x": "7.0.2",
        "@typescript/typescript-linux-x64": "7.0.2",
        "@typescript/typescript-netbsd-arm64": "7.0.2",
        "@typescript/typescript-netbsd-x64": "7.0.2",
        "@typescript/typescript-openbsd-arm64": "7.0.2",
        "@typescript/typescript-openbsd-x64": "7.0.2",
        "@typescript/typescript-sunos-x64": "7.0.2",
        "@typescript/typescript-win32-arm64": "7.0.2",
        "@typescript/typescript-win32-x64": "7.0.2"
      }
    },
    "node_modules/vite": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/vite/-/vite-8.3.0.tgz",
      "integrity": "sha512-lhZBVvEHefgE+HQZC9O7EBJgCU/nVzFNl7vkS4RE0APtWLP02/8QVIkQtzBxPquh7lq5/78NHipTj7ODQ6XuyQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lightningcss": "^1.33.0",
        "picomatch": "^4.0.7",
        "postcss": "^8.5.28",
        "rolldown": "~1.2.6",
        "tinyglobby": "^0.2.17"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "@vitejs/devtools": "^0.7.1",
        "esbuild": "^0.27.0 || ^0.28.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "@vitejs/devtools": {
          "optional": true
        },
        "esbuild": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/vite-plugin-singlefile": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/vite-plugin-singlefile/-/vite-plugin-singlefile-2.3.3.tgz",
      "integrity": "sha512-XVnGH0QzbOa8fxRSsHdCarVN1BSBXNi7uLMQYlrGRN5apdHkk62XQWRJhVever0lnfuyBkwn+kvVChdm/OoOUg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">18.0.0"
      },
      "peerDependencies": {
        "rollup": "^4.59.0",
        "vite": "^5.4.21 || ^6.0.0 || ^7.0.0 || ^8.0.0"
      },
      "peerDependenciesMeta": {
        "rollup": {
          "optional": true
        }
      }
    },
    "node_modules/vite/node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    }
  }
}
```

### 5/33 · `dingge-source/package.json`
<!-- casebook-file {"path": "dingge-source/package.json", "lines": 29, "final_newline": false, "sha256": "e5987873b99766df3a6b1dd93ac64dd728e0c8ce09a92aaabe470531b76f2cd5", "original_sha256": "e5987873b99766df3a6b1dd93ac64dd728e0c8ce09a92aaabe470531b76f2cd5"} -->
```json
{
  "name": "site-film",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:single": "vite build --mode single",
    "typecheck": "tsc --noEmit",
    "render": "node scripts/render.mjs",
    "check": "node scripts/render.mjs --check"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "three": "^0.186.0"
  },
  "devDependencies": {
    "@types/three": "^0.186.0",
    "playwright": "^1.56.0",
    "tsx": "^4.23.15",
    "typescript": "^7.0.2",
    "vite": "^8.3.0",
    "vite-plugin-singlefile": "^2.3.3"
  },
  "type": "module"
}
```

### 6/33 · `dingge-source/scripts/profile.mjs`
<!-- casebook-file {"path": "dingge-source/scripts/profile.mjs", "lines": 21, "final_newline": true, "sha256": "69cf5fc1c0aa3a6a37b7103a779c073e581b7007c5998cb1e514a4a5a27b6c1d", "original_sha256": "69cf5fc1c0aa3a6a37b7103a779c073e581b7007c5998cb1e514a4a5a27b6c1d"} -->
```js
import { chromium } from 'playwright';
import { createServer } from 'vite';
const server = await createServer({ root: process.cwd(), server: { port: 5196 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('http://localhost:5196/?mode=render');
await page.waitForFunction('window.ready === true', null, { timeout: 600000 });
const r = await page.evaluate(async () => {
  const film = window.__filmObj, F = window.__film; const out = {};
  const alpha = (g) => { const d = g.getImageData(0, 0, 1920, 1080).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; };
  for (const f of [1368, 1531, 1694]) { F.renderFrame(f); out['ov' + f] = alpha(film.g); }
  const url = F.renderFrame(1694); out.len = url.length;
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const g2 = c.getContext('2d');
  g2.drawImage(window.__engine.renderer.domElement, 0, 0); 
  const d = g2.getImageData(100, 120, 1, 1).data; out.glPixelTopLeft = Array.from(d);
  return out;
});
console.log(r);
await browser.close(); await server.close();
```

### 7/33 · `dingge-source/scripts/render.mjs`
<!-- casebook-file {"path": "dingge-source/scripts/render.mjs", "lines": 90, "final_newline": true, "sha256": "6bb080c3c129f917dc7049512e70eabd5d878c24a12000eb52b282ad889bc1d4", "original_sha256": "6bb080c3c129f917dc7049512e70eabd5d878c24a12000eb52b282ad889bc1d4"} -->
```js
// Offline renderer: deterministic frame-by-frame capture through headless Chromium, then ffmpeg.
//   node scripts/render.mjs                 full film  → out/frames/*.jpg + out/audio.wav + out/dingge_1080p.mp4
//   node scripts/render.mjs --stills        one mid-frame per shot → out/stills/Sxx.jpg (review sheet)
//   node scripts/render.mjs --frames 12,40  specific frames → out/stills/f00012.jpg
//   node scripts/render.mjs --check         clipping report → out/collision-report.json
//   node scripts/render.mjs --audio         soundtrack only
// Frames shot "on twos" are rendered once and hard-linked for the duplicate frame.
import { chromium } from 'playwright';
import { build, preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const has = f => args.includes(f);
const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const OUT = path.resolve('out');
fs.mkdirSync(OUT, { recursive: true });

// render from a frozen production build, so editing sources mid-render can't reload the page
await build({ root: process.cwd(), logLevel: 'error', build: { outDir: 'out/render-build', emptyOutDir: true } });
const server = await preview({ root: process.cwd(), preview: { port: 5197 }, build: { outDir: 'out/render-build' }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-watchdog'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
page.on('console', m => { const t = m.text(); if (!t.includes('[vite]')) console.log('>', t); });
await page.goto('http://localhost:5197/?mode=render');
await page.waitForFunction('window.ready === true', null, { timeout: 600000 });
const info = await page.evaluate(() => ({ total: window.__film.totalFrames, shots: window.__film.shots, stats: window.__film.stats() }));
console.log(`film: ${info.total} frames, ${info.shots.length} shots`, info.stats);

const save = (file, dataUrl) => fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));

async function audio() {
  const b64 = await page.evaluate(() => window.__film.audio());
  fs.writeFileSync(path.join(OUT, 'audio.wav'), Buffer.from(b64, 'base64'));
  console.log('audio.wav written');
}

if (has('--check')) {
  const t = Date.now();
  const rep = await page.evaluate(() => window.__film.collisions());
  fs.writeFileSync(path.join(OUT, 'collision-report.json'), JSON.stringify(rep, null, 1));
  const worst = rep.flatMap(r => r.hits.map(h => ({ ...h, frame: r.frame, shot: r.shot }))).sort((a, b) => b.depth - a.depth).slice(0, 15);
  console.log(`collision check: ${rep.length} frames with contacts (${Date.now() - t}ms)`);
  console.table(worst);
} else if (has('--audio')) {
  await audio();
} else if (has('--stills') || val('--frames')) {
  const dir = path.join(OUT, 'stills'); fs.mkdirSync(dir, { recursive: true });
  let frames;
  if (val('--frames')) frames = val('--frames').split(',').map(Number).map(f => [f, `f${String(f).padStart(5, '0')}`]);
  else {
    const only = val('--stills') && !val('--stills').startsWith('--') ? val('--stills').split(',') : null;
    const at = Number(val('--at') ?? 0.6);
    frames = info.shots.filter(s => !only || only.includes(s.id)).map(s => [Math.floor((s.start + s.dur * at) * 24), s.id]);
  }
  for (const [f, name] of frames) {
    const t = Date.now();
    save(path.join(dir, `${name}.jpg`), await page.evaluate(i => window.__film.renderFrame(i), f));
    console.log(name, f, `${Date.now() - t}ms`);
  }
} else {
  const dir = path.join(OUT, 'frames'); fs.mkdirSync(dir, { recursive: true });
  const from = Number(val('--from') ?? 0), to = Number(val('--to') ?? info.total);
  let lastKey = null, lastFile = null, rendered = 0; const t0 = Date.now();
  for (let f = from; f < to; f++) {
    const file = path.join(dir, `${String(f).padStart(5, '0')}.jpg`);
    const key = await page.evaluate(i => window.__film.frameKey(i), f);
    if (key === lastKey && lastFile) {
      if (!fs.existsSync(file)) fs.linkSync(lastFile, file);
    } else if (!fs.existsSync(file) || has('--force')) {
      save(file, await page.evaluate(i => window.__film.renderFrame(i), f));
      rendered++;
      if (rendered % 20 === 0) { const el = (Date.now() - t0) / 1000; console.log(`frame ${f}/${to} · ${rendered} rendered · ${(el / rendered).toFixed(2)} s/frame · eta ${((to - f) / 2 * el / rendered / 60).toFixed(1)} min`); }
    }
    lastKey = key; lastFile = file;
  }
  console.log(`frames done: ${rendered} unique renders in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
  if (!has('--noaudio')) await audio();
  if (!has('--noencode')) {
    const mp4 = path.join(OUT, 'dingge_1080p.mp4');
    execFileSync('ffmpeg', ['-y', '-framerate', '24', '-i', path.join(dir, '%05d.jpg'), '-i', path.join(OUT, 'audio.wav'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
      '-c:a', 'aac', '-b:a', '256k', '-shortest', mp4], { stdio: 'inherit' });
    console.log('encoded', mp4);
  }
}
await browser.close(); await server.close();
process.exit(0);
```

### 8/33 · `dingge-source/scripts/shot.mjs`
<!-- casebook-file {"path": "dingge-source/scripts/shot.mjs", "lines": 20, "final_newline": true, "sha256": "097a27253fd5be34e5327f0d1361617404037b7c480bba937e95bb7e5a3c1e4a", "original_sha256": "097a27253fd5be34e5327f0d1361617404037b7c480bba937e95bb7e5a3c1e4a"} -->
```js
// Look-dev screenshots: node scripts/shot.mjs "<query>" out.png [more pairs...]
import { chromium } from 'playwright';
import { createServer } from 'vite';

const pairs = process.argv.slice(2);
const server = await createServer({ root: process.cwd(), server: { port: 5198 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('console', m => { const t = m.text(); if (!t.includes('vite')) console.log('>', t); });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
for (let i = 0; i < pairs.length; i += 2) {
  const t = Date.now();
  await page.goto(`http://localhost:5198/?${pairs[i]}`);
  await page.waitForFunction('window.ready === true', null, { timeout: 300000 });
  const stats = await page.evaluate('window.stats');
  await page.locator('canvas').first().screenshot({ path: pairs[i + 1] });
  console.log(pairs[i + 1], (Date.now() - t) + 'ms', JSON.stringify(stats));
}
await browser.close(); await server.close();
```

### 9/33 · `dingge-source/src/app/main.ts`
<!-- casebook-file {"path": "dingge-source/src/app/main.ts", "lines": 156, "final_newline": true, "sha256": "87877d30a40185986859579dcc1e13ec04448ce74a7b436896aa7f7c276616d3", "original_sha256": "87877d30a40185986859579dcc1e13ec04448ce74a7b436896aa7f7c276616d3"} -->
```ts
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Engine, type Quality } from '../core/engine';
import { buildSite } from '../world/site';
import { Stage } from '../film/stage';
import { Film } from '../film/timeline';
import { SHOTS, FPS, TOTAL, shotStarts } from '../film/shots';
import { renderSoundtrack, wavBytes } from '../audio/score';
import { buildUI } from './ui';

// Entry point. Three modes share one set:
//   ?mode=render  → deterministic offline renderer API for scripts/render.mjs (1920x1080, film quality)
//   default       → interactive sandbox (free camera, live crew, 60fps) + film player with shot list

const params = new URLSearchParams(location.search);
const mode = params.get('mode') ?? 'sandbox';
const frameEl = document.getElementById('frame')!;

function makeOverlay() {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080;
  c.style.pointerEvents = 'none';
  frameEl.appendChild(c);
  return c;
}

if (mode === 'render') {
  const engine = new Engine(frameEl, 1920, 1080, 'film');
  const site = buildSite(engine.renderer, { shadowRes: Number(params.get('shadow') ?? 2048) });
  engine.setScene(site.scene);
  const stage = new Stage(site);
  const film = new Film(engine, site, stage, makeOverlay());
  Object.assign(window, { __engine: engine, __filmObj: film });
  const api = {
    totalFrames: film.totalFrames,
    shots: SHOTS.map((s, i) => ({ id: s.id, title: s.title, start: shotStarts()[i], dur: s.dur })),
    frameKey: (i: number) => film.frameKey(i).key,
    renderFrame: (i: number) => { film.render(i); return film.capture(); },
    collisions: () => {
      const out: { frame: number; shot: string; hits: ReturnType<Stage['collisions']> }[] = [];
      let last = '';
      for (let f = 0; f < film.totalFrames; f++) {
        const fk = film.frameKey(f); if (fk.key === last) continue; last = fk.key;
        film.seek(f);
        const sh = SHOTS[fk.shot];
        if (sh.take === 'none') continue;
        const hits = stage.collisions();
        if (hits.length) out.push({ frame: f, shot: sh.id, hits });
      }
      return out;
    },
    audio: async () => {
      const buf = await renderSoundtrack(48000);
      const bytes = wavBytes(buf);
      let s = ''; const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk));
      return btoa(s);
    },
    stats: () => ({ ...site.stats, calls: engine.renderer.info.render.calls }),
  };
  (window as unknown as { __film: typeof api }).__film = api;
  (window as unknown as { ready: boolean }).ready = true;
} else {
  startSandbox();
}

function startSandbox() {
  let quality: Quality = (params.get('q') as Quality) ?? (Math.min(screen.width, screen.height) < 700 ? 'low' : 'high');
  const rect = () => frameEl.getBoundingClientRect();
  const W = () => Math.min(1920, Math.round(rect().width * Math.min(devicePixelRatio, 1.5)));
  const H = () => Math.round(W() * 9 / 16);
  const engine = new Engine(frameEl, W(), H(), quality);
  engine.renderer.domElement.style.touchAction = 'none';
  const site = buildSite(engine.renderer, { shadowRes: quality === 'low' ? 2048 : 4096 });
  engine.setScene(site.scene);
  const stage = new Stage(site);
  const overlay = makeOverlay();
  const film = new Film(engine, site, stage, overlay);
  const controls = new OrbitControls(engine.camera, engine.renderer.domElement);
  controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.495; controls.minDistance = 1.2; controls.maxDistance = 420;
  const presets: Record<string, [number[], number[]]> = {
    '航拍全景': [[66, 46, 74], [0, 9, -2]],
    '6F 作业面': [[11.4, 16.9, 9.5], [5.2, 15.6, 4.8]],
    '临边缺口': [[9.3, 16.55, 10.9], [5.35, 15.95, 7.0]],
    '塔吊': [[-18, 30, 18], [0, 30, -15]],
    '大门 · 五牌一图': [[-22, 3.2, 34], [-26, 2, 18]],
    '钢筋加工棚': [[-18, 5, -16], [-33, 1.5, -30]],
  };
  const setPreset = (name: string) => { const [p, q] = presets[name]; engine.camera.position.set(p[0], p[1], p[2]); controls.target.set(q[0], q[1], q[2]); controls.update(); };
  setPreset('航拍全景');
  engine.camera.fov = 40; engine.camera.updateProjectionMatrix();

  const state = { mode: 'explore' as 'explore' | 'film', playing: true, filmT: 0, worldT: -8, take: 'good' as 'good' | 'bad' };
  let audioCtx: AudioContext | null = null, audioBuf: AudioBuffer | null = null, audioSrc: AudioBufferSourceNode | null = null, audioT0 = 0;
  const stopAudio = () => { try { audioSrc?.stop(); } catch { /* already stopped */ } audioSrc = null; };
  const startAudio = async () => {
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      if (!audioBuf) { ui.toast('正在合成声音…'); audioBuf = await renderSoundtrack(44100); }
      stopAudio();
      audioSrc = audioCtx.createBufferSource(); audioSrc.buffer = audioBuf; audioSrc.connect(audioCtx.destination);
      audioSrc.start(0, Math.max(0, state.filmT)); audioT0 = audioCtx.currentTime - state.filmT;
    } catch { audioSrc = null; }
  };

  const ui = buildUI({
    shots: SHOTS.map((s, i) => ({ id: s.id, title: s.title, start: shotStarts()[i], dur: s.dur })),
    total: TOTAL, presets: Object.keys(presets), quality,
    onMode: m => {
      state.mode = m; controls.enabled = m === 'explore';
      overlay.style.display = m === 'film' ? 'block' : 'none';
      engine.bokeh.enabled = false;
      const gu = engine.grade.uniforms; gu.keepRed.value = 0; gu.fade.value = 0; gu.flash.value = 0; gu.saturation.value = 1.05; gu.exposure.value = 1;
      if (m === 'film') { state.playing = true; ui.setPlaying(true); startAudio(); }
      else { stopAudio(); site.light.focusShadow(new THREE.Vector3(0, 0, 0), 60); engine.camera.fov = 40; engine.camera.updateProjectionMatrix(); }
    },
    onPreset: n => { if (state.mode !== 'explore') ui.setMode('explore'); setPreset(n); },
    onSeek: t => { state.filmT = t; if (state.mode !== 'film') ui.setMode('film'); else if (state.playing) startAudio(); },
    onPlay: p => { state.playing = p; if (state.mode === 'film') { if (p) startAudio(); else stopAudio(); } },
    onTake: t => { state.take = t; state.worldT = -2; },
    onSun: (e, a) => site.light.setSun(e, a),
    onQuality: q => { quality = q; const u = new URL(location.href); u.searchParams.set('q', q); location.href = u.toString(); },
  });
  overlay.style.display = 'none';

  addEventListener('resize', () => engine.resize(W(), H()));
  let last = performance.now(), fpsAcc = 0, fpsN = 0;
  const focus = new THREE.Vector3();
  const loop = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    fpsAcc += dt; fpsN++;
    if (fpsAcc > 0.5) { ui.fps(fpsN / fpsAcc, site.stats); fpsAcc = 0; fpsN = 0; }
    if (state.mode === 'explore') {
      if (state.playing) state.worldT += dt;
      if (state.worldT > 22) state.worldT = -8;
      stage.apply(state.take, state.worldT, 0, 0);
      controls.update();
      // shadow frustum follows what you're looking at: tight near the deck, wide from the air
      const dist = engine.camera.position.distanceTo(controls.target);
      focus.copy(controls.target); focus.y = 0;
      site.light.focusShadow(focus, THREE.MathUtils.clamp(dist * 0.9, 12, 80));
      site.light.update(engine.camera);
      site.building.deckRebar.visible = engine.camera.position.distanceTo(new THREE.Vector3(5, 15, 4)) < 36;
      engine.render();
      ui.clock(state.worldT);
    } else {
      if (state.playing) state.filmT = audioCtx && audioSrc ? audioCtx.currentTime - audioT0 : state.filmT + dt;
      if (state.filmT >= TOTAL) { state.filmT = 0; if (state.playing) startAudio(); }
      const f = Math.max(0, Math.min(film.totalFrames - 1, Math.floor(state.filmT * FPS)));
      film.render(f);
      ui.progress(state.filmT, film.locate(f).index);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  (window as unknown as { ready: boolean }).ready = true;
}
```

### 10/33 · `dingge-source/src/app/ui.ts`
<!-- casebook-file {"path": "dingge-source/src/app/ui.ts", "lines": 125, "final_newline": true, "sha256": "4c290c64ce0ea65e9d31afb8a36d81ce1d0bd4872f0ca72480cc0066bef3b1a9", "original_sha256": "4c290c64ce0ea65e9d31afb8a36d81ce1d0bd4872f0ca72480cc0066bef3b1a9"} -->
```ts
import type { Quality } from '../core/engine';

// Sandbox UI: floating right-side dock (mode, shots, viewpoints, settings), bottom shot-segmented scrubber,
// small HUD. Same palette as the film's MG layer.

interface UIOpts {
  shots: { id: string; title: string; start: number; dur: number }[];
  total: number; presets: string[]; quality: Quality;
  onMode(m: 'explore' | 'film'): void; onPreset(n: string): void; onSeek(t: number): void; onPlay(p: boolean): void;
  onTake(t: 'good' | 'bad'): void; onSun(elev: number, az: number): void; onQuality(q: Quality): void;
}

const CSS = `
:root{--ink:#111418;--ink2:#1b2027;--line:#2c333c;--paper:#F4F1EA;--mute:#9AA3AD;--y:#FFC400;--r:#E53935;--g:#2EAD5B}
.ui{position:fixed;inset:0;pointer-events:none;font-family:"Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif;color:var(--paper);z-index:5}
.ui *{box-sizing:border-box}
.hud{position:absolute;left:16px;top:14px;display:flex;gap:10px;align-items:center;pointer-events:none}
.hud .t{background:var(--ink);border:1px solid var(--line);padding:8px 12px;border-radius:10px;font-weight:900;letter-spacing:.04em}
.hud .t b{color:var(--y)}
.hud .m{background:rgba(17,20,24,.72);padding:6px 10px;border-radius:8px;font:600 12px/1.2 ui-monospace,monospace;color:var(--mute)}
.dock{position:absolute;right:16px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:6px;background:rgba(17,20,24,.88);border:1px solid var(--line);border-radius:18px;padding:8px;pointer-events:auto;backdrop-filter:blur(6px)}
.dock button{all:unset;cursor:pointer;width:64px;padding:9px 0 7px;border-radius:12px;text-align:center;font-size:12px;font-weight:700;color:var(--mute);display:flex;flex-direction:column;align-items:center;gap:4px}
.dock button svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2}
.dock button:hover{background:var(--ink2);color:var(--paper)}
.dock button.on{background:var(--y);color:var(--ink)}
.dock hr{border:0;border-top:1px solid var(--line);margin:2px 6px}
.panel{position:absolute;right:100px;top:50%;transform:translateY(-50%);width:min(340px,calc(100vw - 132px));max-height:78vh;overflow:auto;background:rgba(17,20,24,.94);border:1px solid var(--line);border-radius:16px;padding:14px;pointer-events:auto;display:none}
.panel.show{display:block}
.panel h3{margin:2px 0 10px;font-size:14px;color:var(--y);letter-spacing:.06em}
.panel .row{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;cursor:pointer;font-size:14px}
.panel .row:hover{background:var(--ink2)}
.panel .row.cur{background:#2a2410;outline:1px solid var(--y)}
.panel .row .id{font:700 12px ui-monospace,monospace;color:var(--y);width:34px}
.panel .row .d{margin-left:auto;color:var(--mute);font:600 12px ui-monospace,monospace}
.panel label{display:block;font-size:13px;color:var(--mute);margin:12px 2px 6px}
.panel input[type=range]{width:100%;accent-color:var(--y)}
.seg{display:flex;gap:6px}.seg button{all:unset;cursor:pointer;flex:1;text-align:center;padding:8px;border-radius:9px;border:1px solid var(--line);font-size:13px;font-weight:700}
.seg button.on{background:var(--y);color:var(--ink);border-color:var(--y)}
.bar{position:absolute;left:16px;right:100px;bottom:14px;display:none;align-items:center;gap:10px;pointer-events:auto}
.bar.show{display:flex}
.bar .pp{all:unset;cursor:pointer;width:40px;height:40px;border-radius:50%;background:var(--y);color:var(--ink);display:grid;place-items:center;flex:none}
.bar .pp svg{width:18px;height:18px;fill:currentColor}
.track{position:relative;flex:1;height:40px;background:rgba(17,20,24,.85);border:1px solid var(--line);border-radius:10px;overflow:hidden;cursor:pointer}
.track .s{position:absolute;top:0;bottom:0;border-right:1px solid var(--line);font:700 10px ui-monospace,monospace;color:var(--mute);padding:4px 5px;white-space:nowrap;overflow:hidden}
.track .s.cur{background:rgba(255,196,0,.14);color:var(--y)}
.track .ph{position:absolute;top:0;bottom:0;width:2px;background:var(--r)}
.bar .tc{font:700 13px ui-monospace,monospace;color:var(--paper);background:rgba(17,20,24,.85);padding:10px;border-radius:10px;flex:none}
.toast{position:absolute;left:50%;top:18px;transform:translateX(-50%);background:var(--ink);border:1px solid var(--y);padding:8px 14px;border-radius:10px;font-size:13px;opacity:0;transition:opacity .3s}
.toast.show{opacity:1}
.help{font-size:12px;color:var(--mute);line-height:1.6;margin-top:8px}
@media (max-width:720px){.dock{top:auto;bottom:70px;transform:none;right:10px}.dock button{width:52px;font-size:11px}.panel{right:74px;top:auto;bottom:70px;transform:none}.bar{right:74px;left:10px}.hud .m{display:none}}
`;

const ICON = {
  explore: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
  film: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M3 15h18M8 5v4M16 5v4M8 15v4M16 15v4"/></svg>',
  shots: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  views: '<svg viewBox="0 0 24 24"><path d="M3 18l6-6 4 4 8-8"/><path d="M15 8h6v6"/></svg>',
  set: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
};

export function buildUI(o: UIOpts) {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const root = document.createElement('div'); root.className = 'ui';
  root.innerHTML = `
    <div class="hud"><div class="t">定格 · <b>工地沙盒</b></div><div class="m" id="hm">—</div></div>
    <div class="toast" id="toast"></div>
    <nav class="dock">
      <button data-m="explore" class="on">${ICON.explore}漫游</button>
      <button data-m="film">${ICON.film}影片</button>
      <hr>
      <button data-p="shots">${ICON.shots}镜头</button>
      <button data-p="views">${ICON.views}机位</button>
      <button data-p="set">${ICON.set}设置</button>
    </nav>
    <div class="panel" id="p-shots"><h3>分镜 · ${o.shots.length} 个镜头</h3>${o.shots.map((s, i) => `<div class="row" data-i="${i}"><span class="id">${s.id}</span><span>${s.title}</span><span class="d">${s.dur.toFixed(1)}s</span></div>`).join('')}</div>
    <div class="panel" id="p-views"><h3>机位预设</h3>${o.presets.map(p => `<div class="row" data-v="${p}">${p}</div>`).join('')}<div class="help">左键旋转 · 右键平移 · 滚轮推拉</div></div>
    <div class="panel" id="p-set"><h3>设置</h3>
      <label>漫游时的表演</label><div class="seg" id="take"><button data-t="good" class="on">正确做法</button><button data-t="bad">事故版</button></div>
      <label>画质</label><div class="seg" id="q"><button data-q="low">流畅</button><button data-q="high">高</button><button data-q="film">成片</button></div>
      <label>太阳高度 <span id="se">38°</span></label><input type="range" id="elev" min="8" max="75" value="38">
      <label>太阳方位 <span id="sa">128°</span></label><input type="range" id="az" min="60" max="300" value="128">
      <div class="help">上午 9:40 前后：高度 35–40°，方位 东南（120–135°）。</div>
    </div>
    <div class="bar" id="bar"><button class="pp" id="pp"></button><div class="track" id="track">${o.shots.map((s, i) => `<div class="s" data-i="${i}" style="left:${s.start / o.total * 100}%;width:${s.dur / o.total * 100}%">${s.id}</div>`).join('')}<div class="ph" id="ph"></div></div><div class="tc" id="tc">00:00</div></div>`;
  document.body.appendChild(root);
  const $ = (s: string) => root.querySelector(s) as HTMLElement;
  const $$ = (s: string) => [...root.querySelectorAll(s)] as HTMLElement[];
  const PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>', PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  let playing = true;
  const setPlaying = (p: boolean) => { playing = p; $('#pp').innerHTML = p ? PAUSE : PLAY; };
  setPlaying(true);
  const setMode = (m: 'explore' | 'film') => {
    $$('.dock [data-m]').forEach(b => b.classList.toggle('on', b.dataset.m === m));
    $('#bar').classList.toggle('show', m === 'film');
    o.onMode(m);
  };
  $$('.dock [data-m]').forEach(b => b.onclick = () => setMode(b.dataset.m as 'explore' | 'film'));
  $$('.dock [data-p]').forEach(b => b.onclick = () => {
    const id = 'p-' + b.dataset.p, show = !$('#' + id).classList.contains('show');
    $$('.panel').forEach(p => p.classList.remove('show')); $$('.dock [data-p]').forEach(x => x.classList.remove('on'));
    if (show) { $('#' + id).classList.add('show'); b.classList.add('on'); }
  });
  $$('#p-shots .row').forEach(r => r.onclick = () => o.onSeek(o.shots[+r.dataset.i!].start + 0.001));
  $$('#p-views .row').forEach(r => r.onclick = () => o.onPreset(r.dataset.v!));
  $$('#take button').forEach(b => b.onclick = () => { $$('#take button').forEach(x => x.classList.toggle('on', x === b)); o.onTake(b.dataset.t as 'good' | 'bad'); });
  $$('#q button').forEach(b => { b.classList.toggle('on', b.dataset.q === o.quality); b.onclick = () => o.onQuality(b.dataset.q as Quality); });
  const sun = () => { const e = +($('#elev') as HTMLInputElement).value, a = +($('#az') as HTMLInputElement).value; $('#se').textContent = e + '°'; $('#sa').textContent = a + '°'; o.onSun(e, a); };
  ($('#elev') as HTMLInputElement).onchange = sun; ($('#az') as HTMLInputElement).onchange = sun;
  $('#pp').onclick = () => { setPlaying(!playing); o.onPlay(playing); };
  $('#track').onclick = e => { const r = $('#track').getBoundingClientRect(); o.onSeek((e.clientX - r.left) / r.width * o.total); };
  let tt = 0;
  return {
    setMode, setPlaying,
    toast(msg: string) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = window.setTimeout(() => t.classList.remove('show'), 1800); },
    fps(v: number, s: { drawables: number; triangles: number }) { $('#hm').textContent = `${v.toFixed(0)} fps · ${s.drawables} meshes · ${(s.triangles / 1e6).toFixed(2)}M tris`; },
    clock(t: number) { void t; },
    progress(t: number, shot: number) {
      $('#ph').style.left = (t / o.total * 100) + '%';
      $('#tc').textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(1).padStart(4, '0')}`;
      $$('#track .s').forEach((s, i) => s.classList.toggle('cur', i === shot));
      $$('#p-shots .row').forEach((s, i) => s.classList.toggle('cur', i === shot));
    },
  };
}
```

### 11/33 · `dingge-source/src/audio/score.ts`
<!-- casebook-file {"path": "dingge-source/src/audio/score.ts", "lines": 87, "final_newline": true, "sha256": "a042ced4f5e1fcc63016c49535f681287c48d46ae89083905f0d5e3f292f3e82", "original_sha256": "a042ced4f5e1fcc63016c49535f681287c48d46ae89083905f0d5e3f292f3e82"} -->
```ts
import { SFX, ambience } from './sfx';
import { SHOTS, shotStarts, TOTAL } from '../film/shots';

// Soundtrack = ambience bed (automated per shot) + SFX cues (from the shot list) + two music themes.
// Rendered offline to a WAV for the film; the same functions drive live sound in the sandbox.
// Rule from the director's notes: no music during the incident; hard silence on the freeze frame.

const BPM = 92, BEAT = 60 / BPM;
const note = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
// A: A minor, restrained;  B: C major, lifted
const PROG = {
  A: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],
  B: [[48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 65]],
};

function music(ctx: BaseAudioContext, out: AudioNode, theme: 'A' | 'B', t0: number, t1: number) {
  const bus = ctx.createGain(); bus.gain.setValueAtTime(0, t0); bus.gain.linearRampToValueAtTime(1, t0 + 0.6);
  bus.gain.setValueAtTime(1, Math.max(t0 + 0.6, t1 - 0.8)); bus.gain.linearRampToValueAtTime(0, t1); bus.connect(out);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = theme === 'A' ? 1600 : 2400; lp.connect(bus);
  const bar = BEAT * 4;
  for (let t = t0, i = 0; t < t1; t += bar, i++) {
    const chord = PROG[theme][i % 4];
    // pad
    for (const n of chord) for (const det of [-6, 6]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = note(n); o.detune.value = det;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.018, t + 0.5); g.gain.setValueAtTime(0.018, t + bar - 0.3); g.gain.linearRampToValueAtTime(0, t + bar + 0.1);
      o.connect(g); g.connect(lp); o.start(t); o.stop(t + bar + 0.15);
    }
    // bass
    const b = ctx.createOscillator(); b.type = 'triangle'; b.frequency.value = note(chord[0] - 12);
    const bg = ctx.createGain(); bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(0.09, t + 0.02); bg.gain.exponentialRampToValueAtTime(0.02, t + bar);
    b.connect(bg); bg.connect(bus); b.start(t); b.stop(t + bar);
    // plucked pulse on eighths (arpeggio)
    for (let k = 0; k < 8; k++) {
      const tt = t + k * BEAT / 2; if (tt > t1) break;
      const n = chord[[0, 1, 2, 1, 0, 2, 1, 2][k]] + 12;
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = note(n);
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(2600, tt); f.frequency.exponentialRampToValueAtTime(500, tt + 0.2);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(theme === 'A' ? 0.02 : 0.026, tt + 0.005); g.gain.exponentialRampToValueAtTime(0.0005, tt + 0.28);
      o.connect(f); f.connect(g); g.connect(bus); o.start(tt); o.stop(tt + 0.3);
    }
    // soft kick on 1 and 3 (theme B also 2 and 4 hats)
    for (const beat of [0, 2]) { const tt = t + beat * BEAT; const o = ctx.createOscillator(); o.frequency.setValueAtTime(110, tt); o.frequency.exponentialRampToValueAtTime(42, tt + 0.18); const g = ctx.createGain(); g.gain.setValueAtTime(0.14, tt); g.gain.exponentialRampToValueAtTime(0.001, tt + 0.25); o.connect(g); g.connect(bus); o.start(tt); o.stop(tt + 0.3); }
  }
}

export function buildSoundtrack(ctx: BaseAudioContext) {
  const master = ctx.createDynamicsCompressor();
  master.threshold.value = -14; master.ratio.value = 3; master.attack.value = 0.005; master.release.value = 0.2;
  const out = ctx.createGain(); out.gain.value = 0.95; master.connect(out); out.connect(ctx.destination);
  const starts = shotStarts();
  const bed = ambience(ctx, master, 0, TOTAL + 1);
  // ambience automation: settle to each shot's level, hard cut when the level is 0 (freeze = silence)
  SHOTS.forEach((s, i) => {
    const t = starts[i], lvl = s.amb ?? 0.7;
    if (lvl === 0) bed.gain.setValueAtTime(0, t);
    else { bed.gain.setValueAtTime(bed.gain.value, t); bed.gain.setTargetAtTime(lvl, t, 0.15); }
  });
  // sfx cues
  SHOTS.forEach((s, i) => { for (const c of s.sfx ?? []) { const f = SFX[c.id]; if (f) f(ctx, master, Math.max(0, starts[i] + c.t), c.gain); } });
  // music segments: consecutive shots with the same theme
  let cur: 'A' | 'B' | null = null, segStart = 0;
  SHOTS.forEach((s, i) => {
    const m = s.music ?? null;
    if (m !== cur) { if (cur) music(ctx, master, cur, segStart, starts[i] + 0.4); cur = m; segStart = starts[i]; }
  });
  if (cur) music(ctx, master, cur, segStart, TOTAL);
}

export async function renderSoundtrack(sampleRate = 48000): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(2, Math.ceil((TOTAL + 0.5) * sampleRate), sampleRate);
  buildSoundtrack(ctx);
  return ctx.startRendering();
}

export function wavBytes(buf: AudioBuffer): Uint8Array {
  const ch = buf.numberOfChannels, len = buf.length, sr = buf.sampleRate;
  const data = new DataView(new ArrayBuffer(44 + len * ch * 2));
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); data.setUint32(4, 36 + len * ch * 2, true); w(8, 'WAVE'); w(12, 'fmt '); data.setUint32(16, 16, true);
  data.setUint16(20, 1, true); data.setUint16(22, ch, true); data.setUint32(24, sr, true); data.setUint32(28, sr * ch * 2, true);
  data.setUint16(32, ch * 2, true); data.setUint16(34, 16, true); w(36, 'data'); data.setUint32(40, len * ch * 2, true);
  const chans = Array.from({ length: ch }, (_, i) => buf.getChannelData(i));
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, chans[c][i])); data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  return new Uint8Array(data.buffer);
}
```

### 12/33 · `dingge-source/src/audio/sfx.ts`
<!-- casebook-file {"path": "dingge-source/src/audio/sfx.ts", "lines": 114, "final_newline": true, "sha256": "fdde2a55ceae481c41e15f7d13afd631948eb0d542b7b8fc0fa21ee1e31bcf48", "original_sha256": "fdde2a55ceae481c41e15f7d13afd631948eb0d542b7b8fc0fa21ee1e31bcf48"} -->
```ts
// Procedural sound library. Every effect is a function of (context, destination, start time, gain) and works in both
// a live AudioContext (sandbox) and an OfflineAudioContext (film render), so the set's sounds are reusable assets.

type Ctx = BaseAudioContext;
const noiseCache = new WeakMap<Ctx, AudioBuffer>();
function noise(ctx: Ctx): AudioBuffer {
  let b = noiseCache.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0); let s = 12345;
    for (let i = 0; i < d.length; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = (s / 0x7fffffff) * 2 - 1; }
    noiseCache.set(ctx, b);
  }
  return b;
}
function env(ctx: Ctx, dest: AudioNode, t: number, a: number, peak: number, d: number, sustain = 0, rel = 0.05): GainNode {
  const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak * sustain + 1e-4), t + a + d);
  if (sustain > 0) g.gain.setTargetAtTime(0, t + a + d, rel);
  g.connect(dest); return g;
}
function noiseSrc(ctx: Ctx, t: number, dur: number, type: BiquadFilterType, f: number, q: number, out: AudioNode, f2?: number) {
  const s = ctx.createBufferSource(); s.buffer = noise(ctx); s.loop = true;
  const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
  s.connect(fl); fl.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
  return fl;
}
function tone(ctx: Ctx, t: number, dur: number, f: number, type: OscillatorType, out: AudioNode, f2?: number) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  o.connect(out); o.start(t); o.stop(t + dur + 0.05); return o;
}
/** struck steel tube: inharmonic partials with separate decays */
function metal(ctx: Ctx, t: number, out: AudioNode, base: number, gain: number, decay = 0.8) {
  const ratios = [1, 2.76, 5.4, 8.93];
  ratios.forEach((r, i) => { const g = env(ctx, out, t, 0.002, gain / (i + 1.2), decay / (i * 0.6 + 1)); tone(ctx, t, decay, base * r, 'sine', g); });
  const g2 = env(ctx, out, t, 0.001, gain * 0.6, 0.03); noiseSrc(ctx, t, 0.05, 'highpass', 2000, 0.7, g2);
}

export type SfxFn = (ctx: Ctx, out: AudioNode, t: number, gain?: number) => void;

export const SFX: Record<string, SfxFn> = {
  heart: (c, o, t, g = 1) => {
    for (const [dt, a] of [[0, 1], [0.16, 0.7]] as const) { const e = env(c, o, t + dt, 0.005, 0.9 * g * a, 0.18); tone(c, t + dt, 0.2, 62, 'sine', e, 38); }
  },
  type: (c, o, t, g = 0.5) => { for (let i = 0; i < 12; i++) { const e = env(c, o, t + i * 0.07 + (i % 3) * 0.01, 0.001, 0.25 * g, 0.02); noiseSrc(c, t + i * 0.07, 0.03, 'bandpass', 3500, 2, e); } },
  slam: (c, o, t, g = 1) => { const e = env(c, o, t, 0.003, 1.0 * g, 0.9); tone(c, t, 0.9, 90, 'sine', e, 32); const e2 = env(c, o, t, 0.002, 0.5 * g, 0.4); noiseSrc(c, t, 0.4, 'lowpass', 1800, 0.7, e2, 200); },
  hit: (c, o, t, g = 1) => { const e = env(c, o, t, 0.002, 0.8 * g, 0.25); tone(c, t, 0.25, 120, 'sine', e, 45); const e2 = env(c, o, t, 0.001, 0.35 * g, 0.12); noiseSrc(c, t, 0.14, 'bandpass', 1800, 0.8, e2); },
  whistle: (c, o, t, g = 1) => {
    for (const [dt, d] of [[0, 0.55]] as const) {
      const e = env(c, o, t + dt, 0.02, 0.22 * g, d, 0.8, 0.05);
      const osc = tone(c, t + dt, d, 2900, 'sine', e);
      const lfo = c.createOscillator(); lfo.frequency.value = 34; const lg = c.createGain(); lg.gain.value = 140; lfo.connect(lg); lg.connect(osc.frequency); lfo.start(t + dt); lfo.stop(t + dt + d);
    }
  },
  whistle2: (c, o, t, g = 1) => { SFX.whistle(c, o, t, g * 0.8); SFX.whistle(c, o, t + 0.7, g * 0.8); },
  whistleFar: (c, o, t, g = 0.4) => { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2400; f.connect(o); SFX.whistle(c, f, t, g * 0.5); },
  tie: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.02, 0.35 * g, 0.28); const fl = noiseSrc(c, t, 0.3, 'bandpass', 5200, 3, e); fl.frequency.linearRampToValueAtTime(3200, t + 0.3); metal(c, t + 0.26, o, 1800, 0.05 * g, 0.2); },
  stamp: (c, o, t, g = 0.8) => { const e = env(c, o, t, 0.002, 0.6 * g, 0.18); tone(c, t, 0.2, 140, 'sine', e, 60); const e2 = env(c, o, t, 0.001, 0.2 * g, 0.08); noiseSrc(c, t, 0.1, 'lowpass', 3000, 0.7, e2); },
  pipeLift: (c, o, t, g = 0.7) => { metal(c, t, o, 410, 0.12 * g, 1.2); const e = env(c, o, t + 0.05, 0.05, 0.12 * g, 0.4); noiseSrc(c, t + 0.05, 0.45, 'bandpass', 2600, 4, e); },
  pipeDrop: (c, o, t, g = 0.8) => { metal(c, t, o, 380, 0.28 * g, 1.6); metal(c, t + 0.12, o, 395, 0.12 * g, 1.1); },
  pipeKnock: (c, o, t, g = 0.7) => { metal(c, t, o, 300, 0.18 * g, 0.5); const e = env(c, o, t, 0.001, 0.3 * g, 0.06); tone(c, t, 0.08, 160, 'sine', e, 90); },
  step: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.003, 0.4 * g, 0.09); tone(c, t, 0.1, 110, 'sine', e, 60); metal(c, t + 0.01, o, 2200, 0.02 * g, 0.12); const e2 = env(c, o, t, 0.002, 0.08 * g, 0.06); noiseSrc(c, t, 0.08, 'bandpass', 900, 1, e2); },
  cloth: (c, o, t, g = 0.4) => { const e = env(c, o, t, 0.08, 0.1 * g, 0.3); noiseSrc(c, t, 0.4, 'bandpass', 1500, 0.6, e); },
  breath: (c, o, t, g = 0.4) => { const e = env(c, o, t, 0.25, 0.07 * g, 0.45); noiseSrc(c, t, 0.7, 'bandpass', 900, 0.8, e, 1400); },
  exhale: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.05, 0.12 * g, 1.1); noiseSrc(c, t, 1.2, 'bandpass', 1100, 0.7, e, 500); },
  gasp: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.03, 0.16 * g, 0.22); noiseSrc(c, t, 0.26, 'bandpass', 1400, 1.2, e, 2300); },
  craneHum: (c, o, t, g = 0.6) => {
    const e = env(c, o, t, 0.6, 0.08 * g, 3.0, 0.6, 0.4);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.connect(e);
    tone(c, t, 3.5, 52, 'sawtooth', lp); tone(c, t, 3.5, 104.5, 'sawtooth', lp);
    const e2 = env(c, o, t, 0.8, 0.012 * g, 3.0, 0.5, 0.4); tone(c, t, 3.5, 640, 'triangle', e2, 690);
  },
  click: (c, o, t, g = 1) => { for (const dt of [0, 0.045]) { const e = env(c, o, t + dt, 0.0005, 0.45 * g, 0.012); noiseSrc(c, t + dt, 0.02, 'highpass', 3500, 0.8, e); metal(c, t + dt, o, 3900, 0.05 * g, 0.12); } },
  buckle: (c, o, t, g = 1) => { for (const dt of [0, 0.03]) { const e = env(c, o, t + dt, 0.0005, 0.5 * g, 0.015); noiseSrc(c, t + dt, 0.02, 'bandpass', 2200, 1.5, e); } const e2 = env(c, o, t, 0.001, 0.12 * g, 0.05); tone(c, t, 0.06, 1500, 'square', e2, 900); },
  webbing: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.05, 0.12 * g, 0.3); noiseSrc(c, t, 0.35, 'bandpass', 700, 1.2, e, 2400); },
  tug: (c, o, t, g = 0.7) => { const e = env(c, o, t, 0.004, 0.25 * g, 0.08); noiseSrc(c, t, 0.1, 'bandpass', 600, 1.5, e); const e2 = env(c, o, t, 0.002, 0.25 * g, 0.1); tone(c, t, 0.12, 95, 'sine', e2, 60); },
  rebarRoll: (c, o, t, g = 0.8) => { for (let i = 0; i < 7; i++) metal(c, t + i * 0.045 + (i % 2) * 0.012, o, 1500 + i * 80, 0.05 * g, 0.15); const e = env(c, o, t, 0.01, 0.12 * g, 0.35); noiseSrc(c, t, 0.4, 'lowpass', 500, 0.7, e); },
  scuff: (c, o, t, g = 0.7) => { const e = env(c, o, t, 0.01, 0.2 * g, 0.25); noiseSrc(c, t, 0.3, 'bandpass', 1200, 0.8, e, 400); },
  freeze: (c, o, t, g = 1) => { const e = env(c, o, t, 0.002, 0.35 * g, 0.4); tone(c, t, 0.42, 420, 'sawtooth', e, 38); const e2 = env(c, o, t, 0.001, 0.5 * g, 0.9); tone(c, t, 1.0, 55, 'sine', e2, 30); },
  pop: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.002, 0.25 * g, 0.09); tone(c, t, 0.1, 520, 'sine', e, 980); },
  tick: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.001, 0.2 * g, 0.03); tone(c, t, 0.04, 1800, 'square', e); },
  whoosh: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.25, 0.25 * g, 0.4); noiseSrc(c, t, 0.7, 'bandpass', 300, 1.4, e, 3000); },
  riser: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.9, 0.18 * g, 0.2); noiseSrc(c, t, 1.1, 'bandpass', 400, 2, e, 5000); const e2 = env(c, o, t, 0.9, 0.06 * g, 0.2); tone(c, t, 1.1, 110, 'sawtooth', e2, 440); },
  counter: (c, o, t, g = 0.5) => { let x = 0; for (let i = 0; i < 26; i++) { x += 0.02 + i * 0.0022; const e = env(c, o, t + x, 0.001, 0.12 * g, 0.02); tone(c, t + x, 0.03, 2400, 'square', e); } },
  rewind: (c, o, t, g = 0.8) => {
    const dur = 2.7;
    const e = env(c, o, t, 0.05, 0.14 * g, dur, 0.9, 0.1);
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.2; bp.connect(e);
    const osc = tone(c, t, dur, 900, 'sawtooth', bp);
    const lfo = c.createOscillator(); lfo.frequency.setValueAtTime(5, t); lfo.frequency.linearRampToValueAtTime(14, t + dur);
    const lg = c.createGain(); lg.gain.value = 600; lfo.connect(lg); lg.connect(osc.frequency); lfo.start(t); lfo.stop(t + dur);
    const e2 = env(c, o, t, 0.05, 0.1 * g, dur, 0.9, 0.1); noiseSrc(c, t, dur, 'highpass', 3000, 0.7, e2);
  },
  railHit: (c, o, t, g = 1) => { metal(c, t, o, 260, 0.3 * g, 1.3); const e = env(c, o, t, 0.002, 0.7 * g, 0.2); tone(c, t, 0.22, 95, 'sine', e, 50); },
  ropeTaut: (c, o, t, g = 1) => { const e = env(c, o, t, 0.002, 0.35 * g, 0.12); noiseSrc(c, t, 0.14, 'bandpass', 800, 2, e); const e2 = env(c, o, t, 0.002, 0.3 * g, 0.18); tone(c, t, 0.2, 140, 'triangle', e2, 70); },
  chime: (c, o, t, g = 0.6) => { [880, 1320, 1760, 2640].forEach((f, i) => { const e = env(c, o, t, 0.003, (0.18 / (i + 1)) * g, 2.2 / (i * 0.4 + 1)); tone(c, t, 2.4, f, 'sine', e); }); },
  hammerFar: (c, o, t, g = 0.3) => metal(c, t, o, 900 + Math.random() * 300, 0.04 * g, 0.3),
};

/** Continuous site ambience (traffic rumble, wind, distant work). Returns the gain node to automate. */
export function ambience(ctx: Ctx, out: AudioNode, t0: number, dur: number): GainNode {
  const bed = ctx.createGain(); bed.gain.value = 0; bed.connect(out);
  const r1 = ctx.createGain(); r1.gain.value = 0.16; r1.connect(bed);
  noiseSrc(ctx, t0, dur, 'lowpass', 220, 0.5, r1);
  const w = ctx.createGain(); w.gain.value = 0.05; w.connect(bed);
  const wf = noiseSrc(ctx, t0, dur, 'bandpass', 700, 0.5, w);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13; const lg = ctx.createGain(); lg.gain.value = 300; lfo.connect(lg); lg.connect(wf.frequency); lfo.start(t0); lfo.stop(t0 + dur);
  let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let t = t0 + 0.4; t < t0 + dur; t += 0.25 + rnd() * 1.4) { if (rnd() < 0.7) SFX.hammerFar(ctx, bed, t, 0.5 + rnd() * 0.6); }
  return bed;
}
```

### 13/33 · `dingge-source/src/characters/actor.ts`
<!-- casebook-file {"path": "dingge-source/src/characters/actor.ts", "lines": 159, "final_newline": true, "sha256": "4e9cee2c15b93ecfc4d9da434baca74f39ffffe710092e20362cf3b1676b161a", "original_sha256": "4e9cee2c15b93ecfc4d9da434baca74f39ffffe710092e20362cf3b1676b161a"} -->
```ts
import * as THREE from 'three';
import { Puppet, type JointRot, JOINTS, type PuppetStyle } from './rig';
import { POSES, blend, gait, cycleLen, setRot, type PoseName } from './poses';
import { type Key, sampleKeys, sampleVecKeys, smooth, invLerp, ease, type EaseName, hash2 } from '../core/math';
import { materials } from '../materials/library';

// A Performance is a puppet's part in a take: root path, facing, a sequence of key poses (pose-to-pose),
// walk windows (gait phase is driven by distance travelled, so feet never skate), procedural overlays,
// and the planted-feet ground snap that prevents feet from sinking into the deck or floating above it.

export interface PoseKey { t: number; pose: PoseName | JointRot; e?: EaseName }
export interface PerformanceDef {
  floorY: number;
  path: Key<number[]>[];              // [x, z]
  yaw: Key<number>[];                 // radians, 0 = facing +Z
  poses: PoseKey[];
  walks?: { t0: number; t1: number; back?: boolean; arms?: boolean }[];
  overlay?: (t: number, rot: JointRot, p: Puppet) => void;
  snap?: Key<number>[];               // 1 = feet planted on floor, 0 = free (falls)
  tilt?: Key<number>[];               // radians about local X at pivot (negative = fall backwards)
  pivot?: [number, number, number];
  lift?: Key<number>[];               // extra root height (m)
  chin?: (t: number) => boolean;      // chin strap fastened?
  blinkSeed?: number;
}

const poseOf = (p: PoseName | JointRot): JointRot => (typeof p === 'string' ? POSES[p] : p);

export class Actor {
  puppet: Puppet;
  def: PerformanceDef;
  private dist: Float32Array = new Float32Array(0);
  private t0 = 0;
  private dt = 1 / 120;
  constructor(puppet: Puppet | PuppetStyle, def: PerformanceDef) {
    this.puppet = puppet instanceof Puppet ? puppet : new Puppet(puppet);
    this.def = def;
    this.bake();
  }
  setDef(def: PerformanceDef) { this.def = def; this.bake(); }
  private bake() {
    const k = this.def.path; const a = k[0].t - 1, b = k[k.length - 1].t + 1;
    this.t0 = a; const n = Math.ceil((b - a) / this.dt) + 2;
    this.dist = new Float32Array(n);
    let prev = sampleVecKeys(k, a), acc = 0;
    for (let i = 1; i < n; i++) {
      const p = sampleVecKeys(k, a + i * this.dt);
      acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]) * (this.walkSign(a + i * this.dt));
      this.dist[i] = acc; prev = p;
    }
  }
  private walkSign(t: number) { const w = this.def.walks?.find(w => t >= w.t0 - 0.3 && t <= w.t1 + 0.3); return w?.back ? -1 : 1; }
  private distAt(t: number) { const i = Math.max(0, Math.min(this.dist.length - 1, Math.round((t - this.t0) / this.dt))); return this.dist[i]; }
  speedAt(t: number) { const a = sampleVecKeys(this.def.path, t - 0.05), b = sampleVecKeys(this.def.path, t + 0.05); return Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.1; }

  /** Evaluate the performance at take time t. boil = stop-motion hand-posing jitter amplitude (deg), frame = seed. */
  evaluate(t: number, boil = 0, frame = 0) {
    const d = this.def, P = this.puppet;
    // ---- base pose: pose-to-pose with easing
    let rot: JointRot = {};
    const ks = d.poses;
    if (t <= ks[0].t) rot = { ...poseOf(ks[0].pose) };
    else if (t >= ks[ks.length - 1].t) rot = { ...poseOf(ks[ks.length - 1].pose) };
    else for (let i = 0; i < ks.length - 1; i++) {
      if (t >= ks[i].t && t < ks[i + 1].t) { const u = ease[ks[i + 1].e ?? 'inOutCubic']((t - ks[i].t) / (ks[i + 1].t - ks[i].t)); rot = blend(poseOf(ks[i].pose), poseOf(ks[i + 1].pose), u); break; }
    }
    // ---- gait overlay inside walk windows (weight eases in/out)
    for (const w of d.walks ?? []) {
      if (t < w.t0 - 0.25 || t > w.t1 + 0.25) continue;
      const wgt = smooth(invLerp(w.t0 - 0.25, w.t0 + 0.15, t)) * (1 - smooth(invLerp(w.t1 - 0.15, w.t1 + 0.25, t)));
      const phase = this.distAt(t) / cycleLen(!!w.back);
      const g = gait(phase, w.back, w.arms !== false);
      const legs: JointRot = {}; const arms: JointRot = {};
      for (const k of Object.keys(g) as (keyof JointRot)[]) (String(k).startsWith('upperArm') || String(k).startsWith('forearm') ? arms : legs)[k] = g[k];
      setRot(rot, legs, wgt);
      if (w.arms !== false) setRot(rot, arms, wgt * 0.8);
    }
    d.overlay?.(t, rot, P);
    // ---- boil: tiny per-frame deviation, as if each frame were re-posed by hand
    if (boil > 0) for (let i = 0; i < JOINTS.length; i++) {
      const n = JOINTS[i]; const r = rot[n] ?? [0, 0, 0];
      rot[n] = [r[0] + (hash2(frame, i * 3) - 0.5) * 2 * boil, r[1] + (hash2(frame, i * 3 + 1) - 0.5) * 2 * boil, r[2] + (hash2(frame, i * 3 + 2) - 0.5) * 2 * boil];
    }
    P.applyRot(rot);
    const snap = d.snap ? sampleKeys(d.snap, t) : 1;
    if (snap > 0.5) P.footFlat();

    // ---- root transform
    const xz = sampleVecKeys(d.path, t);
    P.root.position.set(xz[0], d.floorY + (d.lift ? sampleKeys(d.lift, t) : 0), xz[1]);
    P.root.rotation.set(0, sampleKeys(d.yaw, t), 0);
    const pv = d.pivot ?? [0, 0, 0];
    P.tilt.position.set(pv[0], pv[1], pv[2]);
    P.body.position.set(-pv[0], -pv[1], -pv[2]);
    P.tilt.rotation.set(d.tilt ? sampleKeys(d.tilt, t) : 0, 0, 0);
    P.root.updateMatrixWorld(true);
    if (snap > 0) {
      const dy = d.floorY - P.soleMinY();
      P.root.position.y += dy * snap;
      P.root.updateMatrixWorld(true);
    }
    // ---- face & PPE details
    const chin = d.chin ? d.chin(t) : true;
    P.setChinStrap(chin, chin ? 0 : Math.sin(t * 5.3) * 0.25 + (P.j.head.rotation.x * 0.5));
    const bs = d.blinkSeed ?? 1;
    const bt = (t + bs * 1.7) % 3.1;
    P.setBlink(bt < 0.12 ? 1 - Math.abs(bt - 0.06) / 0.06 : 0);
  }
}

/** Safety lanyard: webbing with energy absorber pack and a snap hook; sags when slack, straight when taut. */
export class Lanyard {
  mesh: THREE.Mesh;
  hook: THREE.Group;
  pack: THREE.Mesh;
  length: number;
  taut = 0;
  private geo: THREE.TubeGeometry | null = null;
  constructor(length = 2.0) {
    this.length = length;
    const m = new THREE.MeshStandardMaterial({ color: 0xff8f00, roughness: 0.7 });
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), m); this.mesh.castShadow = true; this.mesh.frustumCulled = false;
    this.pack = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.05), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })); this.pack.castShadow = true;
    this.hook = new THREE.Group();
    const steel = materials().galv.mat;
    const body = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.0075, 8, 20, Math.PI * 1.55), steel); body.rotation.z = Math.PI * 0.72; body.castShadow = true;
    const gate = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.05, 6), materials().redPaint.mat); gate.position.set(0.028, -0.012, 0); gate.rotation.z = 0.35; gate.name = 'gate';
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.07, 8), steel); shank.position.y = -0.06; shank.castShadow = true;
    this.hook.add(body, gate, shank);
  }
  addTo(p: THREE.Object3D) { p.add(this.mesh, this.hook, this.pack); }
  set visible(v: boolean) { this.mesh.visible = this.hook.visible = this.pack.visible = v; }
  /** a = D-ring (world), b = hook position (world). gateOpen 0..1 */
  update(a: THREE.Vector3, b: THREE.Vector3, gateOpen = 0) {
    const d = a.distanceTo(b);
    const slack = Math.max(0, this.length - d);
    this.taut = slack < 0.02 ? 1 : 0;
    const pts: THREE.Vector3[] = [];
    const sag = Math.sqrt(Math.max(0, this.length * this.length - d * d)) * 0.45;
    for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      const p = a.clone().lerp(b, u);
      p.y -= Math.sin(Math.PI * u) * sag * (1 - 0.15 * u);
      pts.push(p);
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    this.geo?.dispose();
    this.geo = new THREE.TubeGeometry(curve, 28, 0.009, 5, false);
    this.mesh.geometry = this.geo;
    const pa = curve.getPointAt(0.07), pb = curve.getPointAt(0.12);
    this.pack.position.copy(pa); this.pack.lookAt(pb); this.pack.rotateX(Math.PI / 2);
    const end = curve.getPointAt(0.97);
    this.hook.position.copy(b);
    this.hook.up.set(0, 0, 1);
    const dir = b.clone().sub(end).normalize();
    this.hook.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.negate()).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0));
    const g = this.hook.getObjectByName('gate'); if (g) g.rotation.z = 0.35 + gateOpen * 0.9;
  }
}
```

### 14/33 · `dingge-source/src/characters/poses.ts`
<!-- casebook-file {"path": "dingge-source/src/characters/poses.ts", "lines": 103, "final_newline": true, "sha256": "dc1a0a5d166008921f836461e462708e18437b3ed38bd67307c48d6f24ec6929", "original_sha256": "dc1a0a5d166008921f836461e462708e18437b3ed38bd67307c48d6f24ec6929"} -->
```ts
import type { Joint, JointRot } from './rig';
import { JOINTS } from './rig';

// Pose library (degrees, YXZ). Conventions for a puppet facing +Z:
//  spine/chest/head  +X = bend forward / look down, +Y = turn to own left
//  upperArm          -X = raise forward, +Z(L)/-Z(R) = raise sideways; forearm -X = flex elbow
//  thigh             -X = hip flexion (leg forward); shin +X = knee flexion; foot auto-flattened when planted

export type PoseName = keyof typeof POSES;

const P = (p: JointRot) => p;

export const POSES = {
  stand: P({ upperArmL: [2, 0, 6], upperArmR: [2, 0, -6], forearmL: [-12, 0, 0], forearmR: [-12, 0, 0] }),
  standRelaxed: P({ hips: [0, 0, 2], spine: [3, 0, -1], upperArmL: [4, 0, 8], upperArmR: [0, 0, -5], forearmL: [-18, 0, 0], forearmR: [-10, 0, 0], thighL: [-4, 0, 3], shinL: [8, 0, 0], head: [2, 4, 0] }),
  // squatting on the mesh, tying bars between the feet
  crouchTie: P({
    hips: [18, 0, 0], spine: [22, 0, 0], chest: [14, 0, 0], neck: [10, 0, 0], head: [16, 0, 0],
    thighL: [-118, -8, 6], shinL: [138, 0, 0], thighR: [-112, 8, -6], shinR: [132, 0, 0],
    upperArmL: [-58, 0, 12], forearmL: [-42, 0, 0], upperArmR: [-62, 0, -10], forearmR: [-38, -20, 0],
    handL: [10, 0, 0], handR: [20, 0, 0],
  }),
  lookUp: P({ neck: [-12, 0, 0], head: [-22, 0, 0], spine: [-4, 0, 0], upperArmL: [2, 0, 7], upperArmR: [2, 0, -7], forearmL: [-10, 0, 0], forearmR: [-10, 0, 0] }),
  // right hand up to a hook above and slightly in front
  reachUpR: P({ spine: [-3, 0, 0], chest: [-4, 0, 3], neck: [-10, 0, 0], head: [-26, 0, 0], upperArmR: [-162, 0, 12], forearmR: [-14, 0, 0], handR: [10, 0, 0], upperArmL: [2, 0, 8], forearmL: [-15, 0, 0] }),
  reachUpRNear: P({ spine: [-3, 0, 0], chest: [-4, 0, 3], neck: [-8, 0, 0], head: [-22, 0, 0], upperArmR: [-150, 0, 14], forearmR: [-34, 0, 0], handR: [0, 0, 0], upperArmL: [-20, 0, 8], forearmL: [-40, 0, 0] }),
  // 吊钩下降 signal: right arm to the front-side, ~30° below horizontal, palm down, looking at the load
  signalDown: P({ neck: [-12, 0, 0], head: [-20, 0, 0], chest: [0, -10, 0], upperArmR: [-58, 0, -32], forearmR: [-6, 0, 0], handR: [0, 0, 0], upperArmL: [4, 0, 10], forearmL: [-14, 0, 0] }),
  // both hands at the chin: buckling the strap
  buckleChin: P({ neck: [8, 0, 0], head: [6, 0, 0], upperArmL: [-58, -30, 20], forearmL: [-118, 0, 0], handL: [0, 30, 0], upperArmR: [-58, 30, -20], forearmR: [-118, 0, 0], handR: [0, -30, 0] }),
  // bend to lift the mid rail (knees + back), both hands forward-low
  liftLow: P({ hips: [28, 0, 0], spine: [26, 0, 0], chest: [8, 0, 0], head: [-10, 0, 0], thighL: [-62, 0, 4], shinL: [70, 0, 0], thighR: [-52, 0, -4], shinR: [60, 0, 0], upperArmL: [-72, 0, 14], forearmL: [-8, 0, 0], upperArmR: [-72, 0, -14], forearmR: [-8, 0, 0] }),
  // hold a tube in front at waist height
  carry: P({ spine: [-4, 0, 0], upperArmL: [-26, 0, 16], forearmL: [-62, 0, 0], upperArmR: [-26, 0, -16], forearmR: [-62, 0, 0] }),
  // hands on the rail in front (checking it)
  pushRail: P({ spine: [10, 0, 0], chest: [4, 0, 0], head: [8, 0, 0], upperArmL: [-58, 0, 12], forearmL: [-24, 0, 0], upperArmR: [-58, 0, -12], forearmR: [-24, 0, 0], thighL: [-12, 0, 0], shinL: [10, 0, 0] }),
  // lost balance: arms thrown up, back arching, head snapping back
  stumble: P({ spine: [-24, 0, 0], chest: [-18, 0, 0], neck: [-14, 0, 0], head: [-20, 0, 0], upperArmL: [-118, 0, 48], forearmL: [-30, 0, 0], upperArmR: [-128, 0, -52], forearmR: [-24, 0, 0], thighL: [-38, 0, 4], shinL: [44, 0, 0], thighR: [8, 0, -2], shinR: [12, 0, 0] }),
  fallBack: P({ spine: [-30, 0, 0], chest: [-20, 0, 0], neck: [-6, 0, 0], head: [8, 0, 0], upperArmL: [-148, 0, 38], forearmL: [-24, 0, 0], upperArmR: [-156, 0, -40], forearmR: [-18, 0, 0], thighL: [-72, 0, 6], shinL: [58, 0, 0], thighR: [-40, 0, -4], shinR: [22, 0, 0] }),
  // back against the top rail, hands gripping it behind
  caught: P({ spine: [10, 0, 0], chest: [8, 0, 0], neck: [6, 0, 0], head: [10, 0, 0], upperArmL: [38, 0, 28], forearmL: [-40, 0, 0], handL: [0, 0, 0], upperArmR: [38, 0, -28], forearmR: [-40, 0, 0], thighL: [-16, 0, 4], shinL: [20, 0, 0], thighR: [-6, 0, -4], shinR: [10, 0, 0] }),
  exhale: P({ spine: [14, 0, 0], chest: [6, 0, 0], neck: [6, 0, 0], head: [8, 0, 0], upperArmL: [30, 0, 20], forearmL: [-30, 0, 0], upperArmR: [30, 0, -20], forearmR: [-30, 0, 0], thighL: [-10, 0, 2], shinL: [14, 0, 0], thighR: [-10, 0, -2], shinR: [14, 0, 0] }),
  thumbsUp: P({ upperArmR: [-78, 0, -14], forearmR: [-80, 0, 0], handR: [0, 90, 0], upperArmL: [2, 0, 8], forearmL: [-14, 0, 0], head: [-4, 0, 0] }),
  pointFwd: P({ upperArmR: [-86, 0, -8], forearmR: [-6, 0, 0], upperArmL: [2, 0, 8], forearmL: [-14, 0, 0], head: [-2, 0, 0] }),
  handsOnHips: P({ upperArmL: [8, 0, 32], forearmL: [-100, -40, 0], upperArmR: [8, 0, -32], forearmR: [-100, 40, 0] }),
  hammer: P({ spine: [20, 0, 0], chest: [8, 0, 0], head: [16, 0, 0], upperArmR: [-120, 0, -8], forearmR: [-60, 0, 0], upperArmL: [-60, 0, 10], forearmL: [-30, 0, 0], thighL: [-18, 0, 0], shinL: [22, 0, 0], thighR: [-8, 0, 0], shinR: [14, 0, 0] }),
} satisfies Record<string, JointRot>;

export function blend(a: JointRot, b: JointRot, t: number, out: JointRot = {}): JointRot {
  for (const n of JOINTS) {
    const x = a[n], y = b[n];
    if (!x && !y) { delete out[n]; continue; }
    const p = x ?? [0, 0, 0], q = y ?? [0, 0, 0];
    out[n] = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  }
  return out;
}
export function addRot(base: JointRot, add: JointRot, w = 1): JointRot {
  for (const k of Object.keys(add) as Joint[]) {
    const a = add[k]!; const b = base[k] ?? [0, 0, 0];
    base[k] = [b[0] + a[0] * w, b[1] + a[1] * w, b[2] + a[2] * w];
  }
  return base;
}
export function setRot(base: JointRot, add: JointRot, w = 1): JointRot {
  // override (lerp toward) given joints
  for (const k of Object.keys(add) as Joint[]) {
    const a = add[k]!; const b = base[k] ?? [0, 0, 0];
    base[k] = [b[0] + (a[0] - b[0]) * w, b[1] + (a[1] - b[1]) * w, b[2] + (a[2] - b[2]) * w];
  }
  return base;
}

const bump = (p: number, c: number, w: number) => { let d = Math.abs(p - c); d = Math.min(d, 1 - d); return Math.exp(-(d * d) / (2 * w * w)); };

/** Procedural gait at phase φ (cycles). back = walking backwards (shorter, stiffer steps). Returns leg/pelvis/arm offsets. */
export function gait(phase: number, back = false, armSwing = true): JointRot {
  const tau = Math.PI * 2;
  const A = back ? 15 : 22, K = back ? 38 : 58;
  const out: JointRot = {};
  const leg = (p: number, side: 'L' | 'R') => {
    p = ((p % 1) + 1) % 1;
    const hip = A * Math.cos(tau * p);
    const knee = 4 + 12 * bump(p, 0.1, 0.06) + K * bump(p, 0.72, 0.12);
    const ankle = -8 * bump(p, 0.02, 0.05) + 16 * bump(p, 0.58, 0.07) - 8 * bump(p, 0.8, 0.08);
    out[`thigh${side}`] = [-hip, 0, 0];
    out[`shin${side}`] = [knee, 0, 0];
    out[`foot${side}`] = [ankle, 0, 0];
  };
  leg(phase, 'L'); leg(phase + 0.5, 'R');
  const s = Math.cos(tau * phase);
  out.hips = [back ? -2 : 3, 5 * s, 2.5 * Math.sin(tau * phase * 2)];
  out.spine = [back ? -3 : 2, -6 * s, 0];
  if (armSwing) {
    out.upperArmL = [16 * s, 0, 6];
    out.upperArmR = [-16 * s, 0, -6];
    out.forearmL = [-16 - 8 * Math.max(0, -s), 0, 0];
    out.forearmR = [-16 - 8 * Math.max(0, s), 0, 0];
  }
  return out;
}
/** metres per full gait cycle (two steps) */
export const cycleLen = (back: boolean) => (back ? 0.9 : 1.3);
```

### 15/33 · `dingge-source/src/characters/rig.ts`
<!-- casebook-file {"path": "dingge-source/src/characters/rig.ts", "lines": 261, "final_newline": true, "sha256": "c5fc9de44bd94bcd78e67d32667bdd0a18b8d00843179e9d1d9fe38cb91cf6f4", "original_sha256": "c5fc9de44bd94bcd78e67d32667bdd0a18b8d00843179e9d1d9fe38cb91cf6f4"} -->
```ts
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { faceTexture } from '../materials/textures';
import { DEG } from '../core/math';

// Stop-motion puppet: a real-proportion worker built on an armature of joints (like a ball-and-socket wire armature).
// Full PPE: ABS helmet with adjustable chin strap, hi-vis vest with retro-reflective bands, full-body 5-point harness
// with dorsal D-ring, cotton work gloves, work boots. Facing +Z, standing on y=0, 1.72m tall.

export const JOINTS = [
  'hips', 'spine', 'chest', 'neck', 'head',
  'shoulderL', 'upperArmL', 'forearmL', 'handL',
  'shoulderR', 'upperArmR', 'forearmR', 'handR',
  'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR',
] as const;
export type Joint = (typeof JOINTS)[number];
export type JointRot = Partial<Record<Joint, [number, number, number]>>; // degrees XYZ

export interface PuppetStyle {
  name: string;
  helmet: number;         // colour
  shirt: number; pants: number; vest: number;
  face: 'zhou' | 'li' | 'lin' | 'generic';
  seed: number;
  scale?: number;
  harness?: boolean;
  moustache?: boolean;
}

export const STYLES: Record<string, PuppetStyle> = {
  zhou: { name: '老周', helmet: 0xf5c400, shirt: 0x3d5a80, pants: 0x2b3345, vest: 0xff6d00, face: 'zhou', seed: 11, harness: true, moustache: true },
  li: { name: '小李', helmet: 0xf5c400, shirt: 0x6b6f75, pants: 0x3a3f48, vest: 0xc6ff00, face: 'li', seed: 12, scale: 1.03, harness: true },
  lin: { name: '安全员', helmet: 0xd32f2f, shirt: 0xf0f0f0, pants: 0x2d3440, vest: 0xc6ff00, face: 'lin', seed: 13, harness: false },
};

const mats = new Map<string, THREE.Material>();
function mat(key: string, make: () => THREE.Material) { if (!mats.has(key)) mats.set(key, make()); return mats.get(key)!; }
const fabric = (c: number) => mat('fab' + c, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.92 }));
const plastic = (c: number) => mat('pl' + c, () => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.35 }));
const reflective = () => mat('refl', () => new THREE.MeshStandardMaterial({ color: 0xd9dcdf, roughness: 0.35, metalness: 0.55 }));
const webbing = (c: number) => mat('web' + c, () => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
const metal = () => mat('metal', () => new THREE.MeshStandardMaterial({ color: 0xb8bcc2, roughness: 0.3, metalness: 0.9 }));
const rubber = () => mat('rub', () => new THREE.MeshStandardMaterial({ color: 0x1e1c1a, roughness: 0.85 }));
const leather = () => mat('lea', () => new THREE.MeshStandardMaterial({ color: 0x3b2a1e, roughness: 0.7 }));
const glove = () => mat('glove', () => new THREE.MeshStandardMaterial({ color: 0xece8dc, roughness: 1 }));
const eyeMat = () => mat('eye', () => new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.08, clearcoat: 1 }));
const hairMat = () => mat('hair', () => new THREE.MeshStandardMaterial({ color: 0x1d1a18, roughness: 0.9 }));

function capsule(r: number, len: number, m: THREE.Material, taper = 1): THREE.Mesh {
  // limb segment hanging down from its joint (0 → -len); taper < 1 narrows the far end
  const pts: THREE.Vector2[] = [];
  const n = 8;
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * r * taper, -len - Math.cos(a) * r * taper + r * taper)); }
  for (let i = n; i >= 0; i--) { const a = (i / n) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * r, Math.cos(a) * r - r)); }
  pts.reverse();
  const g = new THREE.LatheGeometry(pts, 12);
  g.translate(0, r * 0.3, 0);
  const mesh = new THREE.Mesh(g, m); mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}
function rbox(w: number, h: number, d: number, m: THREE.Material, r = 0.03): THREE.Mesh {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3)), m);
  mesh.castShadow = mesh.receiveShadow = true; return mesh;
}
function place<T extends THREE.Object3D>(o: T, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0): T { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); return o; }

export class Puppet {
  root = new THREE.Group();
  /** tilt pivot (for falls) sits under root; body hangs from it */
  tilt = new THREE.Group();
  body = new THREE.Group();
  j = {} as Record<Joint, THREE.Group>;
  rest = {} as Record<Joint, THREE.Vector3>;
  helmet!: THREE.Group;
  chinStrap!: { fastened: THREE.Group; loose: THREE.Group };
  eyelids: THREE.Mesh[] = [];
  dRing = new THREE.Object3D();       // dorsal attachment point
  hipLoop = new THREE.Object3D();     // where a stowed lanyard hook is parked
  sampleNames: string[] = [];
  samplePts: THREE.Object3D[] = [];   // collision sample points
  style: PuppetStyle;

  constructor(style: PuppetStyle) {
    this.style = style;
    this.root.name = style.name;
    this.root.add(this.tilt); this.tilt.add(this.body);
    const s = style.scale ?? 1;
    this.body.scale.setScalar(s);
    const J = (name: Joint, parent: THREE.Object3D, x: number, y: number, z: number) => {
      const g = new THREE.Group(); g.name = name; g.position.set(x, y, z); parent.add(g); this.j[name] = g; this.rest[name] = g.position.clone(); return g;
    };
    const shirt = fabric(style.shirt), pants = fabric(style.pants), vest = fabric(style.vest);
    const skin = mat('skin' + style.face, () => new THREE.MeshStandardMaterial({ color: style.face === 'zhou' ? 0xa87050 : 0xc99070, roughness: 0.75 }));

    // ---------------- armature
    const hips = J('hips', this.body, 0, 0.96, 0);
    const spine = J('spine', hips, 0, 0.08, 0);
    const chest = J('chest', spine, 0, 0.2, 0);
    const neck = J('neck', chest, 0, 0.23, -0.01);
    const head = J('head', neck, 0, 0.06, 0.01);
    const shL = J('shoulderL', chest, 0.12, 0.17, 0), shR = J('shoulderR', chest, -0.12, 0.17, 0);
    const uaL = J('upperArmL', shL, 0.085, 0, 0), uaR = J('upperArmR', shR, -0.085, 0, 0);
    const faL = J('forearmL', uaL, 0, -0.28, 0), faR = J('forearmR', uaR, 0, -0.28, 0);
    const hdL = J('handL', faL, 0, -0.25, 0), hdR = J('handR', faR, 0, -0.25, 0);
    const thL = J('thighL', hips, 0.095, -0.05, 0), thR = J('thighR', hips, -0.095, -0.05, 0);
    const snL = J('shinL', thL, 0, -0.42, 0), snR = J('shinR', thR, 0, -0.42, 0);
    const ftL = J('footL', snL, 0, -0.42, 0), ftR = J('footR', snR, 0, -0.42, 0);

    // ---------------- pelvis & legs (work trousers with knee pads, boots)
    hips.add(place(rbox(0.33, 0.2, 0.22, pants, 0.07), 0, -0.02, 0));
    hips.add(place(rbox(0.345, 0.045, 0.235, leather(), 0.015), 0, 0.07, 0));           // belt
    hips.add(place(rbox(0.05, 0.035, 0.012, metal(), 0.005), 0, 0.07, 0.12));           // buckle
    for (const [th, sn, ft, side] of [[thL, snL, ftL, 1], [thR, snR, ftR, -1]] as const) {
      th.add(capsule(0.078, 0.42, pants, 0.82));
      th.add(place(rbox(0.07, 0.1, 0.02, pants, 0.01), side * 0.07, -0.18, 0.02, 0, side * 0.9, 0)); // side pocket
      sn.add(capsule(0.06, 0.42, pants, 0.8));
      sn.add(place(rbox(0.1, 0.09, 0.03, fabric(0x1f232b), 0.012), 0, -0.02, 0.06));      // knee patch
      // boot: shaft + upper + sole, toe forward (+z)
      ft.add(place(capsule(0.056, 0.06, leather(), 1), 0, 0.1, 0));
      ft.add(place(rbox(0.105, 0.085, 0.27, leather(), 0.035), 0, -0.02, 0.05));
      ft.add(place(rbox(0.112, 0.03, 0.285, rubber(), 0.012), 0, -0.065, 0.05));
      for (let k = 0; k < 3; k++) ft.add(place(rbox(0.1, 0.006, 0.01, rubber(), 0.002), 0, 0.022, 0.0 + k * 0.03)); // laces
    }

    // ---------------- torso: shirt, vest with reflective bands, harness
    spine.add(place(rbox(0.31, 0.22, 0.2, shirt, 0.07), 0, 0.08, 0));
    chest.add(place(rbox(0.37, 0.3, 0.22, shirt, 0.09), 0, 0.08, 0));
    for (const side of [1, -1]) { const d = place(new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), shirt), side * 0.165, 0.17, 0); d.scale.set(1, 0.85, 1); d.castShadow = true; chest.add(d); } // deltoids
    const vestBody = place(rbox(0.385, 0.42, 0.235, vest, 0.08), 0, 0.02, 0);
    chest.add(vestBody);
    spine.add(place(rbox(0.33, 0.16, 0.215, vest, 0.07), 0, 0.03, 0));
    for (const y of [-0.08, 0.05]) {
      chest.add(place(rbox(0.392, 0.03, 0.24, reflective(), 0.012), 0, y, 0));
    }
    for (const x of [0.09, -0.09]) {
      chest.add(place(rbox(0.035, 0.34, 0.012, reflective(), 0.006), x, 0.08, 0.118));
      chest.add(place(rbox(0.035, 0.34, 0.012, reflective(), 0.006), x, 0.08, -0.118));
    }
    chest.add(place(rbox(0.08, 0.035, 0.012, plastic(0x222222), 0.006), -0.08, 0.16, 0.12)); // name badge
    if (style.harness) {
      const w = webbing(0x111111), y2 = webbing(0xffc400);
      for (const x of [0.07, -0.07]) {
        chest.add(place(rbox(0.04, 0.36, 0.012, w, 0.005), x, 0.08, 0.124));                    // front straps
        chest.add(place(rbox(0.04, 0.36, 0.012, w, 0.005), x * 0.5, 0.08, -0.124, 0, 0, x > 0 ? 0.2 : -0.2)); // back X
        chest.add(place(rbox(0.04, 0.012, 0.24, w, 0.005), x * 1.2, 0.235, 0));                  // over shoulders
      }
      chest.add(place(rbox(0.2, 0.035, 0.012, y2, 0.005), 0, 0.06, 0.128));                    // chest strap
      chest.add(place(rbox(0.035, 0.02, 0.012, metal(), 0.004), 0, 0.06, 0.134));
      hips.add(place(rbox(0.35, 0.05, 0.24, w, 0.01), 0, 0.02, 0));                            // waist belt
      for (const [th, side] of [[thL, 1], [thR, -1]] as const) {
        th.add(place(new THREE.Mesh(new THREE.TorusGeometry(0.083, 0.012, 6, 16), y2), 0, -0.1, 0, Math.PI / 2 - 0.2, 0, side * 0.1));
      }
      const dr = place(new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 6, 14), metal()), 0, 0.17, -0.132, 0, 0, 0);
      dr.castShadow = true; chest.add(dr);
      this.dRing.position.set(0, 0.15, -0.14); chest.add(this.dRing);
      this.hipLoop.position.set(0.16, 0.0, -0.06); hips.add(this.hipLoop);
    }

    // ---------------- arms (sleeves), gloves
    for (const [ua, fa, hd, side] of [[uaL, faL, hdL, 1], [uaR, faR, hdR, -1]] as const) {
      ua.add(capsule(0.056, 0.28, shirt, 0.85));
      fa.add(capsule(0.047, 0.25, shirt, 0.8));
      fa.add(place(capsule(0.05, 0.03, glove(), 1), 0, -0.21, 0));                              // glove cuff
      const palm = place(rbox(0.085, 0.1, 0.035, glove(), 0.015), 0, -0.055, 0.0); hd.add(palm);
      const fingers = new THREE.Group(); fingers.name = 'fingers'; fingers.position.set(0, -0.1, 0); hd.add(fingers);
      fingers.add(place(rbox(0.082, 0.07, 0.03, glove(), 0.013), 0, -0.03, 0.0));
      hd.add(place(capsule(0.014, 0.05, glove(), 0.9), side * -0.04, -0.03, 0.022, 0.6, 0, side * 0.6));
    }

    // ---------------- head
    const face = new THREE.SphereGeometry(0.108, 28, 20); face.rotateY(-Math.PI / 2);
    const headMesh = new THREE.Mesh(face, mat('face' + style.face, () => new THREE.MeshStandardMaterial({ map: faceTexture(style.face, style.seed), roughness: 0.7 })));
    headMesh.scale.set(0.95, 1.12, 1.0); headMesh.position.y = 0.1; headMesh.castShadow = true; head.add(headMesh);
    neck.add(place(capsule(0.05, 0.08, skin, 1), 0, 0.08, 0));
    // jaw
    { const jaw = place(new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), skin), 0, 0.045, 0.03); jaw.scale.set(1.15, 0.8, 1.0); head.add(jaw); }
    for (const side of [1, -1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), skin); ear.scale.set(0.5, 1, 0.8); place(ear, side * 0.102, 0.1, -0.005); head.add(ear);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.0125, 12, 8), eyeMat()); place(eye, side * 0.037, 0.115, 0.095); head.add(eye);
      const white = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), mat('white', () => new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: 0.4 }))); white.scale.set(1, 0.8, 0.5); place(white, side * 0.037, 0.115, 0.09); head.add(white);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), skin); lid.scale.set(1.05, 0.0, 0.8); place(lid, side * 0.037, 0.117, 0.092); head.add(lid); this.eyelids.push(lid);
    }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8), skin); nose.scale.set(0.85, 1.2, 1.1); place(nose, 0, 0.09, 0.108); head.add(nose);
    if (style.moustache) head.add(place(rbox(0.07, 0.012, 0.02, hairMat(), 0.005), 0, 0.058, 0.1));
    // hair at the nape (visible under helmet rim)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.113, 20, 12, Math.PI * 1.08, Math.PI * 0.84, 0, Math.PI * 0.64), hairMat()); hair.position.y = 0.1; hair.scale.set(0.97, 1.12, 1.02); head.add(hair);
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.114, 20, 6, 0, Math.PI * 2, 0, Math.PI * 0.2), hairMat()); fringe.position.y = 0.1; fringe.scale.set(0.97, 1.12, 1.02); head.add(fringe);

    // ---------------- helmet (ABS shell, ribs, peak, suspension, chin strap)
    this.helmet = new THREE.Group(); this.helmet.name = 'helmet';
    const shellM = plastic(style.helmet);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.135, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), shellM);
    shell.scale.set(0.98, 0.95, 1.12); shell.castShadow = true; this.helmet.add(shell);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.155, 0.012, 32, 1, true), shellM); brim.scale.set(1, 1, 1.12); brim.position.y = -0.005; this.helmet.add(brim);
    const brimRing = new THREE.Mesh(new THREE.TorusGeometry(0.149, 0.007, 6, 36), shellM); brimRing.rotation.x = Math.PI / 2; brimRing.scale.set(1, 1.12, 1); brimRing.position.y = -0.01; this.helmet.add(brimRing);
    const peak = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 4, -Math.PI * 0.28, Math.PI * 0.56, Math.PI * 0.49, Math.PI * 0.05), shellM); peak.rotation.y = Math.PI / 2; peak.scale.set(1, 1, 1.15); peak.position.y = 0.002; this.helmet.add(peak);
    for (const a of [-0.35, 0, 0.35]) { // ribs
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.133, 0.009, 6, 24, Math.PI), shellM);
      rib.rotation.set(0, Math.PI / 2 + a, 0); rib.scale.set(1.12, 0.96, 1); rib.castShadow = true; this.helmet.add(rib);
    }
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.108, 0.01, 6, 24), webbing(0x222222)); band.rotation.x = Math.PI / 2; band.scale.set(1, 1.12, 1); band.position.y = 0.005; this.helmet.add(band);
    this.helmet.position.set(0, 0.19, -0.004); this.helmet.scale.setScalar(0.93); head.add(this.helmet);
    // chin strap variants: fastened (under chin) / loose (dangling loop)
    const strapM = webbing(0x1a1a1a);
    const fastened = new THREE.Group(), loose = new THREE.Group();
    for (const side of [1, -1]) {
      const f = rbox(0.012, 0.16, 0.005, strapM, 0.002); place(f, side * 0.085, -0.075, 0.04, -0.35, 0, side * -0.28); fastened.add(f);
    }
    fastened.add(place(rbox(0.08, 0.012, 0.012, strapM, 0.003), 0, -0.155, 0.075));
    fastened.add(place(rbox(0.02, 0.014, 0.016, plastic(0x222222), 0.004), 0.02, -0.155, 0.08));
    const loopCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.09, -0.01, 0.02), new THREE.Vector3(0.07, -0.16, 0.07), new THREE.Vector3(0, -0.22, 0.09), new THREE.Vector3(-0.07, -0.16, 0.07), new THREE.Vector3(-0.09, -0.01, 0.02)]);
    loose.add(new THREE.Mesh(new THREE.TubeGeometry(loopCurve, 20, 0.004, 4), strapM));
    loose.add(place(rbox(0.02, 0.014, 0.016, plastic(0x222222), 0.004), 0.02, -0.215, 0.09));
    this.helmet.add(fastened, loose);
    this.chinStrap = { fastened, loose };
    this.setChinStrap(true);

    // ---------------- collision sample points (world-tested against site colliders)
    const sp = (n: string, parent: THREE.Object3D, x: number, y: number, z: number) => { const o = new THREE.Object3D(); o.position.set(x, y, z); parent.add(o); this.sampleNames.push(n); this.samplePts.push(o); };
    sp('head', head, 0, 0.12, 0); sp('chestF', chest, 0, 0.08, 0.12); sp('chestB', chest, 0, 0.08, -0.12);
    sp('pelvisB', hips, 0, 0, -0.11); sp('handL', hdL, 0, -0.08, 0); sp('handR', hdR, 0, -0.08, 0);
    sp('elbowL', faL, 0, 0, 0); sp('elbowR', faR, 0, 0, 0); sp('kneeL', snL, 0, 0, 0.05); sp('kneeR', snR, 0, 0, 0.05);
    sp('toeL', ftL, 0, -0.06, 0.18); sp('toeR', ftR, 0, -0.06, 0.18); sp('heelL', ftL, 0, -0.06, -0.08); sp('heelR', ftR, 0, -0.06, -0.08);
  }

  setChinStrap(fastened: boolean, swing = 0) {
    this.chinStrap.fastened.visible = fastened;
    this.chinStrap.loose.visible = !fastened;
    this.chinStrap.loose.rotation.x = swing;
  }
  setBlink(v: number) { for (const l of this.eyelids) l.scale.y = Math.max(0.001, v) * 1.05; }
  setGrip(side: 'L' | 'R', v: number) {
    const f = this.j[side === 'L' ? 'handL' : 'handR'].getObjectByName('fingers');
    if (f) f.rotation.x = -v * 1.6;
  }

  /** Apply joint rotations (degrees) on top of rest pose. Missing joints reset to 0. */
  applyRot(rot: JointRot) {
    for (const n of JOINTS) {
      const r = rot[n];
      if (r) this.j[n].rotation.set(r[0] * DEG, r[1] * DEG, r[2] * DEG, 'YXZ');
      else this.j[n].rotation.set(0, 0, 0);
    }
  }

  /** Keep soles parallel to the ground (for planted feet). */
  footFlat() {
    for (const side of ['L', 'R'] as const) {
      const th = this.j[`thigh${side}`].rotation, sn = this.j[`shin${side}`].rotation, hp = this.j.hips.rotation;
      const f = this.j[`foot${side}`].rotation;
      f.x = -(hp.x + th.x + sn.x) + f.x;
    }
  }

  /** Lowest sole point in world space (after updateMatrixWorld). */
  soleMinY(): number {
    let m = Infinity; const v = new THREE.Vector3();
    for (let i = 10; i < 14; i++) { this.samplePts[i].getWorldPosition(v); if (v.y < m) m = v.y; }
    return m - 0.02;
  }
}
```

### 16/33 · `dingge-source/src/core/engine.ts`
<!-- casebook-file {"path": "dingge-source/src/core/engine.ts", "lines": 121, "final_newline": true, "sha256": "08b2f0ad6ee18e1ad9ef261cc5d716b34d74b45ee442ee5c58e3d58f14687307", "original_sha256": "08b2f0ad6ee18e1ad9ef261cc5d716b34d74b45ee442ee5c58e3d58f14687307"} -->
```ts
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAPass } from 'three/examples/jsm/postprocessing/FXAAPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Renderer + post chain: scene → GTAO (contact shadows under props & feet) → bloom (sun glints) → Bokeh DOF
// (miniature/stop-motion depth) → ACES output → FXAA → grade (saturation, warmth, keep-red desaturation for the
// freeze frame, vignette, frame-seeded grain).

export type Quality = 'low' | 'high' | 'film';

export const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    saturation: { value: 1.05 }, contrast: { value: 1.04 }, warmth: { value: 0.02 }, exposure: { value: 1.0 },
    keepRed: { value: 0.0 },          // 0 = normal, 1 = desaturate everything except reds
    vignette: { value: 0.28 }, grain: { value: 0.035 }, seed: { value: 0 },
    flash: { value: 0 },              // white flash (cuts on impact)
    fade: { value: 0 },               // to black
    resolution: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float saturation, contrast, warmth, exposure, keepRed, vignette, grain, seed, flash, fade;
    uniform vec2 resolution; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed*13.17) * 43758.5453); }
    vec3 rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g)); vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y); float e=1e-10; return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb * exposure;
      float l = dot(c, vec3(0.2126,0.7152,0.0722));
      c = mix(vec3(l), c, saturation);
      c = (c - 0.5) * contrast + 0.5;
      c += vec3(warmth, warmth*0.35, -warmth);
      if (keepRed > 0.0) {
        vec3 hsv = rgb2hsv(clamp(c,0.,1.));
        float red = smoothstep(0.08, 0.02, min(hsv.x, 1.0-hsv.x)) * smoothstep(0.35, 0.6, hsv.y);
        float g = dot(c, vec3(0.2126,0.7152,0.0722));
        c = mix(c, mix(vec3(g), c, red), keepRed);
      }
      vec2 q = vUv - 0.5; q.x *= resolution.x/resolution.y;
      c *= 1.0 - vignette * smoothstep(0.35, 1.05, length(q));
      c += (h(vUv*resolution) - 0.5) * grain;
      c = mix(c, vec3(1.0), flash);
      c = mix(c, vec3(0.0), fade);
      gl_FragColor = vec4(clamp(c,0.,1.), 1.0);
    }`,
};

export class Engine {
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  renderPass: RenderPass;
  gtao: GTAOPass | null = null;
  bokeh: BokehPass;
  bloom: UnrealBloomPass;
  grade: ShaderPass;
  fxaa: FXAAPass;
  width: number; height: number;
  quality: Quality;

  constructor(container: HTMLElement, width: number, height: number, quality: Quality, scene: THREE.Scene | null = null) {
    this.width = width; this.height = height; this.quality = quality;
    const r = new THREE.WebGLRenderer({ antialias: quality !== 'film', powerPreference: 'high-performance', preserveDrawingBuffer: quality === 'film' });
    r.setPixelRatio(quality === 'film' ? 1 : Math.min(window.devicePixelRatio, 1.5));
    r.setSize(width, height, false);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.92;
    r.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(r.domElement);
    this.renderer = r;
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.05, 6000);

    const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: quality === 'high' ? 4 : 0 });
    this.composer = new EffectComposer(r, rt);
    this.renderPass = new RenderPass(scene ?? new THREE.Scene(), this.camera);
    this.composer.addPass(this.renderPass);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(width / 2, height / 2), 0.12, 0.4, 3.0);
    this.bokeh = new BokehPass(scene ?? new THREE.Scene(), this.camera, { focus: 10, aperture: 0.0008, maxblur: 0.008 });
    this.bokeh.enabled = false;
    this.grade = new ShaderPass(GradeShader);
    this.grade.uniforms.resolution.value.set(width, height);
    this.fxaa = new FXAAPass();
    this.fxaa.setSize?.(width, height);
  }

  setScene(scene: THREE.Scene) {
    this.renderPass.scene = scene;
    (this.bokeh as unknown as { scene: THREE.Scene }).scene = scene;
    if (this.quality !== 'low') {
      this.gtao = new GTAOPass(scene, this.camera, this.width, this.height);
      this.gtao.output = GTAOPass.OUTPUT.Default;
      this.gtao.blendIntensity = 0.85;
      this.gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: this.quality === 'film' ? 10 : 8 });
      this.gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 8 });
      this.composer.addPass(this.gtao);
    }
    this.composer.addPass(this.bloom);
    this.composer.addPass(this.bokeh);
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.fxaa);
    this.composer.addPass(this.grade);
  }

  resize(w: number, h: number) {
    this.width = w; this.height = h;
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.grade.uniforms.resolution.value.set(w, h);
  }

  render() { this.composer.render(); }
}
```

### 17/33 · `dingge-source/src/core/math.ts`
<!-- casebook-file {"path": "dingge-source/src/core/math.ts", "lines": 107, "final_newline": true, "sha256": "7390b9103f2f1305574f0407561b0d0803e51f3046c1af05e502b54f83230926", "original_sha256": "7390b9103f2f1305574f0407561b0d0803e51f3046c1af05e502b54f83230926"} -->
```ts
// Deterministic helpers shared by world, characters and film.
// Everything that looks random is seeded, so frame N always renders the same image.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stateless hash → [0,1). Used for per-frame "boil" so it never depends on call order. */
export function hash1(n: number): number {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}
export const hash2 = (a: number, b: number) => hash1(Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663));

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
export const smooth = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const DEG = Math.PI / 180;

export const ease = {
  linear: (t: number) => t,
  inQuad: (t: number) => t * t,
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  inCubic: (t: number) => t * t * t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: (t: number) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
};
export type EaseName = keyof typeof ease;

/** Piecewise keyframe track over scalars or number arrays. */
export interface Key<T> { t: number; v: T; e?: EaseName }
export function sampleKeys(keys: Key<number>[], t: number): number {
  if (t <= keys[0].t) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.t) return last.v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a.t && t <= b.t) {
      const u = ease[b.e ?? 'inOutCubic']((t - a.t) / (b.t - a.t || 1));
      return lerp(a.v, b.v, u);
    }
  }
  return last.v;
}
export function sampleVecKeys(keys: Key<number[]>[], t: number, out: number[] = []): number[] {
  const n = keys[0].v.length;
  if (t <= keys[0].t) { for (let i = 0; i < n; i++) out[i] = keys[0].v[i]; return out; }
  const last = keys[keys.length - 1];
  if (t >= last.t) { for (let i = 0; i < n; i++) out[i] = last.v[i]; return out; }
  for (let k = 0; k < keys.length - 1; k++) {
    const a = keys[k], b = keys[k + 1];
    if (t >= a.t && t <= b.t) {
      const u = ease[b.e ?? 'inOutCubic']((t - a.t) / (b.t - a.t || 1));
      for (let i = 0; i < n; i++) out[i] = lerp(a.v[i], b.v[i], u);
      return out;
    }
  }
  return out;
}

/** Periodic value noise (tileable) for procedural textures. */
export class TileNoise {
  private perm: Uint8Array;
  private vals: Float32Array;
  constructor(seed: number) {
    const r = mulberry32(seed);
    this.perm = new Uint8Array(512);
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    this.vals = new Float32Array(256);
    for (let i = 0; i < 256; i++) this.vals[i] = r();
  }
  private lattice(ix: number, iy: number, period: number) {
    ix = ((ix % period) + period) % period; iy = ((iy % period) + period) % period;
    return this.vals[this.perm[(this.perm[ix & 255] + iy) & 511]];
  }
  noise(x: number, y: number, period: number) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = this.lattice(ix, iy, period), b = this.lattice(ix + 1, iy, period);
    const c = this.lattice(ix, iy + 1, period), d = this.lattice(ix + 1, iy + 1, period);
    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }
  /** fbm in [0,1], u,v in [0,1) tile space */
  fbm(u: number, v: number, base: number, oct = 5, gain = 0.5) {
    let amp = 0.5, f = base, s = 0, norm = 0;
    for (let o = 0; o < oct; o++) { s += amp * this.noise(u * f, v * f, f); norm += amp; amp *= gain; f *= 2; }
    return s / norm;
  }
}
```

### 18/33 · `dingge-source/src/film/mg.ts`
<!-- casebook-file {"path": "dingge-source/src/film/mg.ts", "lines": 296, "final_newline": true, "sha256": "fb97450c7d6b0291ae82c866aa2cd86afd2c273037ce60698ab3e58f35349368", "original_sha256": "fb97450c7d6b0291ae82c866aa2cd86afd2c273037ce60698ab3e58f35349368"} -->
```ts
import { clamp, ease, invLerp, lerp } from '../core/math';

// Motion-graphics layer (Canvas2D, 1920x1080). One visual system for the whole film:
// safety yellow / danger red / safe green / ink / paper; one font family; three text levels; every element enters
// with a short overshoot (like a cut-out being slapped onto the frame) and leaves with ease-in.

export const C = { yellow: '#FFC400', red: '#E53935', green: '#2EAD5B', ink: '#111418', paper: '#F4F1EA', grey: '#9AA3AD' };
export const FONT = '"Noto Sans CJK SC","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif';
export type G = CanvasRenderingContext2D;
export interface Pt { x: number; y: number; vis: boolean }

const font = (g: G, size: number, weight = 900) => { g.font = `${weight} ${size}px ${FONT}`; };
/** 0→1 appear over [t0,t0+d] with overshoot, 1→0 disappear over [t1-d2, t1] */
export function env(t: number, t0: number, t1 = 1e9, d = 0.35, d2 = 0.25, e: keyof typeof ease = 'outBack') {
  if (t < t0 || t > t1) return 0;
  const a = ease[e](clamp((t - t0) / d)), b = 1 - ease.inCubic(clamp((t - (t1 - d2)) / d2));
  return Math.min(a, b);
}

function roundRect(g: G, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

export function hazardBand(g: G, x: number, y: number, w: number, h: number, a = C.yellow, b = C.ink, offset = 0) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = a; g.fillRect(x, y, w, h);
  g.fillStyle = b; const s = h * 1.2;
  for (let i = -2; i < w / s + 3; i++) { const x0 = x + i * s * 2 + (offset % (s * 2)); g.beginPath(); g.moveTo(x0, y + h); g.lineTo(x0 + s, y + h); g.lineTo(x0 + s + h, y); g.lineTo(x0 + h, y); g.closePath(); g.fill(); }
  g.restore();
}

/** Main caption: yellow bar + big line + optional small line, lower-left third. */
export function caption(g: G, t: number, t0: number, t1: number, text: string, sub = '', pos: 'll' | 'center' | 'top' | 'tr' = 'll', color = C.paper) {
  const a = env(t, t0, t1, 0.4);
  if (a <= 0) return;
  const reveal = clamp((t - t0) / 0.5);
  g.save();
  font(g, 64); const tw = g.measureText(text).width;
  font(g, 30, 700); const sw = sub ? g.measureText(sub).width : 0;
  const w = Math.max(tw, sw) + 80;
  let x = 110, y = 790;
  if (pos === 'center') { x = 960 - w / 2; y = 470; }
  if (pos === 'top') { x = 110; y = 110; }
  if (pos === 'tr') { x = 1810 - w; y = 110; }
  g.globalAlpha = clamp(a * 1.2);
  g.translate(x, y); g.scale(lerp(0.92, 1, a), lerp(0.92, 1, a));
  g.fillStyle = 'rgba(17,20,24,0.78)';
  roundRect(g, 0, 0, w * reveal, sub ? 150 : 104, 6); g.fill();
  g.fillStyle = C.yellow; g.fillRect(0, 0, 10, sub ? 150 : 104);
  g.beginPath(); g.rect(0, 0, w * reveal, 160); g.clip();
  g.fillStyle = color; font(g, 64); g.textBaseline = 'top'; g.fillText(text, 40, 18);
  if (sub) { g.fillStyle = C.grey; font(g, 30, 700); g.fillText(sub, 42, 100); }
  g.restore();
}

/** Subtitle-style centred line near the bottom (for narration lines). */
export function subtitle(g: G, t: number, t0: number, t1: number, text: string) {
  const a = env(t, t0, t1, 0.25, 0.2, 'outCubic');
  if (a <= 0) return;
  g.save(); g.globalAlpha = a; font(g, 44, 700); g.textAlign = 'center'; g.textBaseline = 'middle';
  const w = g.measureText(text).width + 60;
  g.fillStyle = 'rgba(17,20,24,0.6)'; roundRect(g, 960 - w / 2, 960, w, 70, 8); g.fill();
  g.fillStyle = C.paper; g.fillText(text, 960, 996); g.restore();
}

/** World-anchored callout: ring on the point, leader to a numbered label. */
export function callout(g: G, t: number, t0: number, t1: number, p: Pt, n: number, label: string, color = C.red, side: 1 | -1 = 1, lift = -140, labelY?: number) {
  if (!p.vis) return;
  const a = env(t, t0, t1, 0.45);
  if (a <= 0) return;
  const ring = ease.outBack(clamp((t - t0) / 0.35));
  const lead = ease.outCubic(clamp((t - t0 - 0.15) / 0.3));
  const txt = ease.outCubic(clamp((t - t0 - 0.3) / 0.3));
  g.save();
  g.globalAlpha = clamp(a * 1.5);
  g.lineWidth = 6; g.strokeStyle = color;
  g.beginPath(); g.arc(p.x, p.y, 46 * ring, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 2; g.globalAlpha *= 0.6; g.beginPath(); g.arc(p.x, p.y, 58 * ring + 6 * Math.sin(t * 6), 0, Math.PI * 2); g.stroke(); g.globalAlpha = clamp(a * 1.5);
  const ex = p.x + side * 50 * Math.SQRT1_2, ey = p.y - 50 * Math.SQRT1_2;
  const kx = ex + side * (labelY !== undefined ? 60 : 90) * lead, ky = labelY !== undefined ? lerp(ey, labelY, lead) : ey + lift * lead * 0.6;
  const lx = kx + side * (labelY !== undefined ? 60 : 120) * lead;
  g.lineWidth = 4; g.beginPath(); g.moveTo(ex, ey); g.lineTo(kx, ky); g.lineTo(lx, ky); g.stroke();
  if (txt > 0) {
    font(g, 46); const tw = g.measureText(label).width;
    const bx = side > 0 ? lx : lx - tw - 110, by = ky - 40;
    g.globalAlpha = clamp(a * 1.5) * txt;
    g.fillStyle = color; roundRect(g, bx, by, tw + 110, 80, 8); g.fill();
    g.fillStyle = C.paper; g.beginPath(); g.arc(bx + 42, by + 40, 26, 0, Math.PI * 2); g.fill();
    g.fillStyle = color; font(g, 38); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), bx + 42, by + 42);
    g.fillStyle = C.paper; font(g, 46); g.textAlign = 'left'; g.fillText(label, bx + 84, by + 42);
  }
  g.restore();
}

/** Dimension line between two projected points, with ticks and a label. */
export function dimension(g: G, t: number, t0: number, t1: number, p: Pt, q: Pt, label: string, offset: [number, number] = [0, 0], color = C.yellow) {
  if (!p.vis || !q.vis) return;
  const a = env(t, t0, t1, 0.4, 0.25, 'outCubic');
  if (a <= 0) return;
  const P = { x: p.x + offset[0], y: p.y + offset[1] }, Q = { x: q.x + offset[0], y: q.y + offset[1] };
  const k = ease.outCubic(clamp((t - t0) / 0.45));
  const mx = lerp(P.x, Q.x, 0.5), my = lerp(P.y, Q.y, 0.5);
  const ax = lerp(mx, P.x, k), ay = lerp(my, P.y, k), bx = lerp(mx, Q.x, k), by = lerp(my, Q.y, k);
  const dx = Q.x - P.x, dy = Q.y - P.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L * 16, ny = dx / L * 16;
  g.save(); g.globalAlpha = a; g.strokeStyle = color; g.lineWidth = 4;
  g.setLineDash([]); g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
  g.beginPath(); g.moveTo(ax - nx, ay - ny); g.lineTo(ax + nx, ay + ny); g.moveTo(bx - nx, by - ny); g.lineTo(bx + nx, by + ny); g.stroke();
  g.setLineDash([6, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(P.x, P.y); g.moveTo(q.x, q.y); g.lineTo(Q.x, Q.y); g.stroke(); g.setLineDash([]);
  if (k > 0.6) {
    font(g, 40); const tw = g.measureText(label).width;
    g.fillStyle = C.ink; roundRect(g, mx - tw / 2 - 18, my - 30, tw + 36, 60, 6); g.fill();
    g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, mx, my + 2);
  }
  g.restore();
}

/** Title card: stripes slam in, title letters drop one by one. */
export function titleCard(g: G, t: number, title: string, sub: string) {
  g.save();
  g.fillStyle = C.ink; g.fillRect(0, 0, 1920, 1080);
  const s1 = ease.outCubic(clamp(t / 0.4)), s2 = ease.outCubic(clamp((t - 0.1) / 0.4));
  hazardBand(g, -1920 + 1920 * s1, 250, 1920, 46, C.yellow, C.ink, t * 60);
  hazardBand(g, 1920 - 1920 * s2, 784, 1920, 46, C.yellow, C.ink, -t * 60);
  font(g, 260); g.textAlign = 'center'; g.textBaseline = 'middle';
  const chars = [...title];
  const total = chars.reduce((w, c) => w + g.measureText(c).width + 40, -40);
  let x = 960 - total / 2;
  chars.forEach((c, i) => {
    const w = g.measureText(c).width;
    const u = ease.outBack(clamp((t - 0.35 - i * 0.14) / 0.3));
    g.globalAlpha = clamp(u * 2);
    g.fillStyle = i === 1 ? C.yellow : C.paper;
    g.fillText(c, x + w / 2, 500 - (1 - u) * 160);
    x += w + 40;
  });
  const su = env(t, 0.9, 1e9, 0.4, 0.2, 'outCubic');
  g.globalAlpha = su; font(g, 48, 700); g.fillStyle = C.grey; g.fillText(sub, 960, 680);
  g.restore();
}

/** Character introduction card pinned next to a world point. */
export function characterCard(g: G, t: number, t0: number, p: Pt, name: string, lines: string[]) {
  const a = env(t, t0, 1e9, 0.4);
  if (a <= 0 || !p.vis) return;
  g.save();
  const x = p.x + 120, y = p.y - 220;
  g.globalAlpha = clamp(a * 1.4);
  g.strokeStyle = C.yellow; g.lineWidth = 4; g.beginPath(); g.moveTo(p.x + 30, p.y - 20); g.lineTo(x, y + 150); g.stroke();
  g.translate(x, y); g.scale(lerp(0.85, 1, a), lerp(0.85, 1, a));
  g.fillStyle = C.paper; roundRect(g, 0, 0, 520, 230, 10); g.fill();
  hazardBand(g, 0, 0, 520, 24, C.yellow, C.ink, 0);
  g.fillStyle = C.ink; font(g, 76); g.textBaseline = 'top'; g.fillText(name, 34, 44);
  font(g, 34, 700); g.fillStyle = '#39414a';
  lines.forEach((l, i) => g.fillText(l, 36, 138 + i * 44));
  g.restore();
}

/** Reason's Swiss-cheese model: three slices slide in, holes align, arrow passes through. */
export function swissCheese(g: G, t: number, t0: number, labels: string[]) {
  const a = env(t, t0, 1e9, 0.4, 0.2, 'outCubic');
  if (a <= 0) return;
  g.save();
  const X = 1300, Y = 250, W = 560, H = 470;
  g.globalAlpha = a; g.fillStyle = 'rgba(17,20,24,0.82)'; roundRect(g, X, Y, W, H + 140, 12); g.fill();
  g.fillStyle = C.paper; font(g, 34, 700); g.textBaseline = 'top'; g.fillText('瑞士奶酪模型 · 每一层防护都有漏洞', X + 30, Y + 24);
  for (let i = 0; i < 3; i++) {
    const u = ease.outBack(clamp((t - t0 - 0.3 - i * 0.25) / 0.4));
    const cx = X + 130 + i * 150, cy = Y + 280;
    g.save(); g.translate(cx, cy + (1 - u) * 300); g.transform(1, -0.35, 0, 1, 0, 0);
    g.globalAlpha = a * clamp(u * 2);
    g.fillStyle = '#F2C94C'; g.strokeStyle = '#B8860B'; g.lineWidth = 3;
    roundRect(g, -42, -150, 84, 300, 10); g.fill(); g.stroke();
    // holes; the aligned one at y=0 (appears last)
    g.fillStyle = 'rgba(17,20,24,0.85)';
    for (const [hx, hy, r] of [[-12, -95, 12], [14, 70, 15], [-8, 115, 9]]) { g.beginPath(); g.arc(hx, hy + i * 7, r, 0, Math.PI * 2); g.fill(); }
    const hole = ease.outBack(clamp((t - t0 - 1.3 - i * 0.2) / 0.35));
    g.fillStyle = C.red; g.beginPath(); g.arc(0, 0, 24 * hole, 0, Math.PI * 2); g.fill();
    g.restore();
    g.globalAlpha = a * clamp(u * 2);
    g.fillStyle = C.paper; font(g, 28, 700); g.textAlign = 'center'; g.fillText(labels[i], cx, Y + H + 40);
    g.fillStyle = C.red; font(g, 32); g.fillText(String(i + 1), cx, Y + H + 2);
    g.textAlign = 'left';
  }
  const arrow = ease.inOutCubic(clamp((t - t0 - 2.2) / 0.8));
  if (arrow > 0) {
    const y0 = Y + 280 - 0.35 * 0, x0 = X + 40, x1 = lerp(x0, X + W - 40, arrow);
    g.globalAlpha = a; g.strokeStyle = C.red; g.fillStyle = C.red; g.lineWidth = 10;
    g.beginPath(); g.moveTo(x0, y0 + 60); g.lineTo(x1, y0 + 60 - (x1 - x0) * 0.35 * 0.35); g.stroke();
    const ay = y0 + 60 - (x1 - x0) * 0.1225;
    g.beginPath(); g.moveTo(x1 + 18, ay); g.lineTo(x1 - 14, ay - 18); g.lineTo(x1 - 14, ay + 18); g.closePath(); g.fill();
    if (arrow > 0.95) { g.fillStyle = C.paper; font(g, 34); g.fillText('事故', X + W - 110, ay - 70); }
  }
  g.restore();
}

/** Big number card with a growing bar. */
export function statCard(g: G, t: number, value: number, label: string, source: string) {
  g.save();
  g.fillStyle = 'rgba(17,20,24,0.9)'; g.fillRect(0, 0, 1920, 1080);
  const k = ease.outCubic(clamp((t - 0.3) / 1.4));
  const a = env(t, 0.1, 1e9, 0.4, 0.2, 'outCubic');
  g.globalAlpha = a;
  font(g, 46, 700); g.fillStyle = C.grey; g.textBaseline = 'alphabetic'; g.fillText(label, 200, 330);
  font(g, 230); g.fillStyle = C.yellow; g.fillText((value * k).toFixed(2), 190, 560);
  const nw = g.measureText((value * k).toFixed(2)).width;
  font(g, 120); g.fillText('%', 200 + nw, 560);
  g.fillStyle = '#2a3038'; roundRect(g, 200, 640, 1520, 64, 32); g.fill();
  g.fillStyle = C.red; roundRect(g, 200, 640, Math.max(64, 1520 * (value / 100) * k), 64, 32); g.fill();
  const other = [['物体打击', 12.05], ['起重伤害', 6.53], ['坍塌', 6.53], ['其他', 15.82]] as const;
  let x = 200 + 1520 * value / 100;
  other.forEach(([n, v], i) => {
    const u = clamp((t - 1.6 - i * 0.12) / 0.3);
    const w = 1520 * v / 100;
    g.globalAlpha = a * u; g.fillStyle = ['#56606b', '#465059', '#3a434c', '#2f363e'][i]; g.fillRect(x, 648, w - 4, 48);
    font(g, 26, 700); g.fillStyle = C.grey; g.fillText(n, x + 6, 750);
    x += w;
  });
  g.globalAlpha = a; font(g, 28, 400); g.fillStyle = '#6f7a86'; g.fillText(source, 200, 900);
  g.restore();
}

/** Freeze-frame stamp: red frame corners + 'PAUSED' timecode. */
export function freezeUI(g: G, t: number, t0: number, code: string) {
  const a = env(t, t0, 1e9, 0.2, 0.2, 'outCubic');
  if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.strokeStyle = C.red; g.lineWidth = 8;
  const m = 60, L = 120;
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [1920 - m, m, -1, 1], [m, 1080 - m, 1, -1], [1920 - m, 1080 - m, -1, -1]]) {
    g.beginPath(); g.moveTo(x, y + sy * L); g.lineTo(x, y); g.lineTo(x + sx * L, y); g.stroke();
  }
  g.fillStyle = C.red; g.fillRect(m + 30, m + 30, 22, 64); g.fillRect(m + 64, m + 30, 22, 64);
  font(g, 44, 900); g.textBaseline = 'middle'; g.fillText('定格', m + 110, m + 64);
  font(g, 32, 700); g.fillStyle = C.paper; g.textAlign = 'right'; g.fillText(code, 1920 - m - 30, m + 64);
  g.restore();
}

/** Rewind overlay: ◀◀, scanlines, running timecode. */
export function rewindUI(g: G, t: number, t0: number, code: string) {
  const a = env(t, t0, 1e9, 0.1, 0.1, 'linear');
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = (t * 900) % 6; y < 1080; y += 6) g.fillRect(0, y, 1920, 2);
  g.fillStyle = C.paper;
  const x = 110, y = 110;
  for (const dx of [0, 46]) { g.beginPath(); g.moveTo(x + dx + 46, y); g.lineTo(x + dx, y + 30); g.lineTo(x + dx + 46, y + 60); g.closePath(); g.fill(); }
  font(g, 44, 900); g.textBaseline = 'middle'; g.fillText('倒带', x + 120, y + 32);
  font(g, 34, 700); g.textAlign = 'right'; g.fillText(code, 1810, y + 32);
  g.restore();
}

/** End card: three PPE icons land in sequence + slogan. */
export function endCard(g: G, t: number) {
  g.save();
  g.fillStyle = C.ink; g.fillRect(0, 0, 1920, 1080);
  hazardBand(g, 0, 0, 1920, 30, C.yellow, C.ink, t * 40);
  hazardBand(g, 0, 1050, 1920, 30, C.yellow, C.ink, -t * 40);
  const items = [
    { t: '下颏带系紧', icon: helmetIcon },
    { t: '安全带高挂', icon: hookIcon },
    { t: '临边不拆除', icon: railIcon },
  ];
  items.forEach((it, i) => {
    const u = ease.outBack(clamp((t - 0.2 - i * 0.3) / 0.45));
    const cx = 480 + i * 480, cy = 420;
    g.save(); g.globalAlpha = clamp(u * 2); g.translate(cx, cy - (1 - u) * 120);
    g.fillStyle = '#1d2229'; g.beginPath(); g.arc(0, 0, 150, 0, Math.PI * 2); g.fill();
    g.strokeStyle = C.yellow; g.lineWidth = 8; g.stroke();
    it.icon(g);
    g.fillStyle = C.paper; font(g, 58); g.textAlign = 'center'; g.textBaseline = 'top'; g.fillText(it.t, 0, 190);
    g.restore();
  });
  const s = env(t, 1.4, 1e9, 0.5, 0.2, 'outCubic');
  g.globalAlpha = s; g.textAlign = 'center'; g.fillStyle = C.grey; font(g, 40, 700); g.fillText('三宝 · 四口 · 五临边   安全帽 · 安全带 · 安全网', 960, 860);
  g.fillStyle = '#6f7a86'; font(g, 26, 400); g.fillText('依据：JGJ 59-2011 · JGJ 80-2016 · GB 23468-2025 · 住建部 2020 年房屋市政工程事故通报', 960, 930);
  g.restore();
}
function helmetIcon(g: G) {
  g.fillStyle = C.yellow; g.beginPath(); g.arc(0, 20, 90, Math.PI, 0); g.lineTo(110, 20); g.lineTo(110, 36); g.lineTo(-110, 36); g.lineTo(-110, 20); g.closePath(); g.fill();
  g.fillStyle = '#d9a700'; g.fillRect(-12, -70, 24, 90);
  g.strokeStyle = C.paper; g.lineWidth = 8; g.beginPath(); g.moveTo(-70, 36); g.quadraticCurveTo(0, 130, 70, 36); g.stroke();
}
function hookIcon(g: G) {
  g.strokeStyle = C.paper; g.lineWidth = 8; g.beginPath(); g.moveTo(-110, -70); g.lineTo(110, -70); g.stroke();
  g.strokeStyle = C.yellow; g.lineWidth = 16; g.beginPath(); g.arc(0, -40, 34, Math.PI * 1.1, Math.PI * 2.2); g.stroke();
  g.strokeStyle = '#ff8f00'; g.lineWidth = 14; g.beginPath(); g.moveTo(10, -10); g.quadraticCurveTo(30, 60, -10, 110); g.stroke();
  g.fillStyle = C.green; font(g, 56); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('↑', 70, 10);
}
function railIcon(g: G) {
  g.strokeStyle = C.red; g.lineWidth = 14;
  for (const x of [-90, 0, 90]) { g.beginPath(); g.moveTo(x, -80); g.lineTo(x, 90); g.stroke(); }
  g.strokeStyle = C.paper; for (const y of [-70, 0]) { g.beginPath(); g.moveTo(-110, y); g.lineTo(110, y); g.stroke(); }
  hazardBand(g, -110, 64, 220, 30, C.yellow, C.ink, 0);
}

export const fmtTime = (s: number) => { const m = Math.floor(s / 60), ss = Math.floor(s % 60), ff = Math.floor((s % 1) * 24); return `09:${String(40 + m).padStart(2, '0')}:${String(ss).padStart(2, '0')}:${String(ff).padStart(2, '0')}`; };
export { invLerp };
```

### 19/33 · `dingge-source/src/film/shots.ts`
<!-- casebook-file {"path": "dingge-source/src/film/shots.ts", "lines": 213, "final_newline": true, "sha256": "8b4a223194ac00eff2a3db7a53bc23b4951e32043b81a37d1a7f4857cf53cb8f", "original_sha256": "8b4a223194ac00eff2a3db7a53bc23b4951e32043b81a37d1a7f4857cf53cb8f"} -->
```ts
import * as THREE from 'three';
import type { Key } from '../core/math';
import { L } from '../world/layout';
import { T_FREEZE } from './stage';
import type { Stage, TakeName } from './stage';
import * as M from './mg';

// The shot list = the director's breakdown (docs/DIRECTOR.md §4) as data.
// A shot picks a take, maps shot-local time → take time (tk), and defines camera, depth of field, grade, MG and sound.
// step: 2 = on twos (12 unique images/s), 1 = on ones. Everything (camera, puppets, MG) is quantised to the step.

export interface Cam { pos: Key<number[]>[]; tgt: Key<number[]>[]; fov: Key<number>[] }
export interface MGCtx { stage: Stage; project: (v: THREE.Vector3) => M.Pt; world: (who: 'zhou' | 'li', joint: string, local?: [number, number, number]) => THREE.Vector3 }
export interface Cue { t: number; id: string; gain?: number }
export interface Shot {
  id: string; dur: number; title: string;
  take: TakeName | 'none';
  tk: Key<number>[];
  step: number | ((t: number) => number);
  cam: Cam;
  dof?: { focus: Key<number>[]; aperture: number };
  shadow: { c: [number, number, number]; r: number };
  grade?: (t: number) => Partial<{ saturation: number; keepRed: number; warmth: number; fade: number; flash: number; exposure: number; vignette: number; contrast: number }>;
  mg?: (g: CanvasRenderingContext2D, t: number, c: MGCtx) => void;
  sfx?: Cue[];
  amb?: number;           // ambience bed level 0..1
  music?: 'A' | 'B' | null;
  boil?: number;
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const Y = L.standY;
const k = (t: number, v: number[] | number, e?: Key<number>['e']) => ({ t, v, e }) as never;
const still = (p: number[], q: number[], fov: number): Cam => ({ pos: [k(0, p)], tgt: [k(0, q)], fov: [k(0, fov)] });
// S12/S13 continue from the new low S11 set-up
const DECK_SHADOW = { c: [5, 15, 4.5] as [number, number, number], r: 14 };

// Camera set-ups reused between the two takes so the comparison reads instantly (匹配镜头)
const CAM_EDGE_OUT = { p: [9.3, 15.75, 10.9], q: [5.4, 15.95, 7.1] };     // outside, 6F height, looking at the gap
const CAM_RAIL = { p: [7.7, 16.15, 5.05], q: [4.75, 15.7, 6.45] };          // 小李 at the rail
const CAM_CHIN = { p: [6.05, 16.78, 4.18], q: [5.2, 16.66, 4.96] };          // 老周 head CU
const CAM_RING = { p: [5.78, 17.3, 5.42], q: [5.2, 17.02, 4.82] };           // hook on lifeline ECU
const CAM_SIDE = { p: [11.4, 16.35, 5.75], q: [5.2, 15.95, 5.75] };          // deck side WS (movement → screen-left)

export const SHOTS: Shot[] = [
  {
    id: 'S01', dur: 4.0, title: '倒叙钩子 · 定格帧环绕', take: 'bad', tk: [k(0, T_FREEZE)], step: 2,
    cam: { pos: [k(0, [9.9, 15.7, 9.8]), k(4, [6.3, 16.2, 11.8], 'inOutSine')], tgt: [k(0, [5.4, 15.9, 7.3])], fov: [k(0, 30), k(4, 27)] },
    dof: { focus: [k(0, 5.2), k(4, 4.9)], aperture: 0.0016 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: t => ({ keepRed: 0.55, saturation: 0.9, contrast: 1.1, fade: Math.max(0, 1 - t / 0.5) * 0.9 }),
    mg: (g, t) => { M.freezeUI(g, t, 0.2, '09:41:52:07'); M.caption(g, t, 0.9, 3.9, '如果时间能定格在这一帧——', '', 'll'); },
    sfx: [{ t: 0, id: 'heart', gain: 0.9 }, { t: 1.05, id: 'heart', gain: 0.9 }, { t: 2.1, id: 'heart', gain: 0.9 }, { t: 3.15, id: 'heart', gain: 0.9 }, { t: 0.9, id: 'type' }], amb: 0,
  },
  {
    id: 'S02', dur: 3.0, title: '片名', take: 'none', tk: [k(0, 0)], step: 2, cam: still([0, 0, 0], [0, 0, -1], 30), shadow: DECK_SHADOW,
    mg: (g, t) => M.titleCard(g, t, '定格', '一次高处坠落的复盘'),
    sfx: [{ t: 0.0, id: 'slam' }, { t: 0.4, id: 'hit' }, { t: 0.55, id: 'hit', gain: 0.6 }], music: 'A', amb: 0,
  },
  {
    id: 'S03', dur: 6.0, title: '航拍建立空间', take: 'bad', tk: [k(0, -6), k(6, 0, 'linear')], step: 2,
    cam: { pos: [k(0, [66, 46, 74]), k(6, [34, 28.5, 38], 'inOutSine')], tgt: [k(0, [0, 9, -2]), k(6, [4, 14, 3], 'inOutSine')], fov: [k(0, 38), k(6, 36)] },
    shadow: { c: [0, 0, 0], r: 65 },
    mg: (g, t) => M.caption(g, t, 1.0, 5.6, '上午 9:40 · 住宅楼 6F 作业面', '主体结构施工 · 绑扎楼板钢筋'),
    sfx: [{ t: 2.5, id: 'whistleFar', gain: 0.4 }], amb: 0.9, music: 'A',
  },
  {
    id: 'S04', dur: 4.0, title: '人物登场', take: 'bad', tk: [k(0, -3.6), k(2.1, -1.5, 'linear')], step: 2,
    cam: { pos: [k(0, [8.7, 16.3, 5.45]), k(4, [8.15, 16.22, 5.3], 'inOutSine')], tgt: [k(0, [5.2, 15.72, 4.95])], fov: [k(0, 34)] },
    dof: { focus: [k(0, 3.5), k(4, 3.0)], aperture: 0.0012 }, shadow: DECK_SHADOW,
    mg: (g, t, c) => M.characterCard(g, t, 2.15, c.project(c.world('zhou', 'head', [0, 0.1, 0])), '老周', ['钢筋工 · 干了 22 年', '“这活我闭着眼都会”']),
    sfx: [{ t: 0.2, id: 'tie' }, { t: 0.95, id: 'tie' }, { t: 1.7, id: 'tie' }, { t: 2.15, id: 'stamp' }], amb: 0.8, music: 'A',
  },
  {
    id: 'S05', dur: 4.0, title: '第一个洞：临边防护被拆', take: 'bad', tk: [k(0, 0), k(4, 4, 'linear')], step: 2,
    cam: still(CAM_RAIL.p, CAM_RAIL.q, 36), dof: { focus: [k(0, 3.2)], aperture: 0.0008 }, shadow: DECK_SHADOW,
    mg: (g, t, c) => M.callout(g, t, 2.9, 4.0, c.project(V(5.0, L.deckY + 0.9, L.railZ)), 1, '临边防护被拆开', M.C.red, 1),
    sfx: [{ t: 0.95, id: 'pipeLift' }, { t: 3.25, id: 'pipeDrop' }, { t: 3.9, id: 'step' }], amb: 0.8, music: 'A',
  },
  {
    id: 'S06', dur: 3.0, title: '第二个洞：下颏带没系', take: 'bad', tk: [k(0, 3.6), k(3, 6.1, 'linear')], step: 2,
    cam: still(CAM_CHIN.p, CAM_CHIN.q, 30), dof: { focus: [k(0, 1.15)], aperture: 0.002 }, shadow: { c: [5, 15, 5], r: 6 },
    mg: (g, t, c) => M.callout(g, t, 1.5, 3.0, c.project(c.world('zhou', 'head', [0, -0.06, 0.07])), 2, '下颏带没系', M.C.red, -1, -60),
    sfx: [{ t: 0.4, id: 'cloth' }, { t: 1.3, id: 'breath' }], amb: 0.7,
  },
  {
    id: 'S07', dur: 3.0, title: '动机：吊物来了', take: 'bad', tk: [k(0, 4.4), k(3, 7.4, 'linear')], step: 2,
    cam: { pos: [k(0, [7.9, 15.45, 6.2])], tgt: [k(0, [5.5, 22.8, 2.4]), k(3, [5.5, 21.6, 2.3])], fov: [k(0, 40)] }, shadow: { c: [5, 20, 2], r: 14 },
    sfx: [{ t: -0.5, id: 'whistle' }, { t: 0.0, id: 'craneHum', gain: 0.8 }], amb: 0.75,
  },
  {
    id: 'S08', dur: 3.0, title: '第三个洞：安全带解开', take: 'bad', tk: [k(0, 6.3), k(3, 7.9, 'linear')], step: 2,
    cam: still(CAM_RING.p, CAM_RING.q, 30), dof: { focus: [k(0, 0.8)], aperture: 0.0026 }, shadow: { c: [5, 16, 5], r: 5 },
    mg: (g, t, c) => M.callout(g, t, 1.8, 3.0, c.project(V(5.2, Y + L.lifeH - 0.1, L.lifeZ + 0.05)), 3, '安全带解开 · 省 3 秒', M.C.red, -1, 80),
    sfx: [{ t: 0.95, id: 'click', gain: 1.0 }, { t: 1.5, id: 'webbing' }], amb: 0.7,
  },
  {
    id: 'S09', dur: 3.5, title: '走向缺口', take: 'bad', tk: [k(0, 7.9), k(3.5, 11.4, 'linear')], step: 2,
    cam: still(CAM_SIDE.p, CAM_SIDE.q, 38), dof: { focus: [k(0, 6.1)], aperture: 0.0005 }, shadow: DECK_SHADOW,
    sfx: [{ t: 0.9, id: 'step', gain: 0.6 }, { t: 1.8, id: 'step', gain: 0.6 }, { t: 2.7, id: 'step', gain: 0.6 }, { t: 0.4, id: 'whistle', gain: 0.5 }], amb: 0.7,
  },
  {
    id: 'S10', dur: 2.0, title: '意外触发', take: 'bad', tk: [k(0, 11.15), k(2, 11.75, 'linear')], step: 1,
    cam: still([6.55, 15.32, 6.05], [5.3, 15.16, 6.7], 32), dof: { focus: [k(0, 1.35)], aperture: 0.0022 }, shadow: { c: [5.3, 15, 6.6], r: 4 },
    grade: t => ({ saturation: 1 - t * 0.1 }),
    sfx: [{ t: 0.6, id: 'rebarRoll' }, { t: 0.62, id: 'scuff' }], amb: 0.6,
  },
  {
    id: 'S11', dur: 2.5, title: '坠落 → 定格', take: 'bad', tk: [k(0, 11.6), k(1.4, T_FREEZE, 'linear')], step: t => (t < 1.4 ? 1 : 2),
    cam: still(CAM_EDGE_OUT.p, CAM_EDGE_OUT.q, 30), dof: { focus: [k(0, 5.0)], aperture: 0.0012 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: t => ({ keepRed: t > 1.4 ? 0.55 : 0, flash: t > 1.4 && t < 1.5 ? 0.6 : 0, saturation: t > 1.4 ? 0.9 : 0.95, contrast: t > 1.4 ? 1.1 : 1.04 }),
    mg: (g, t) => M.freezeUI(g, t, 1.4, '09:41:52:07'),
    sfx: [{ t: 0.1, id: 'gasp' }, { t: 1.4, id: 'freeze' }, { t: 1.45, id: 'heart', gain: 1 }], amb: 0,
  },
  {
    id: 'S12', dur: 7.0, title: '分析：三层防护同时失效', take: 'bad', tk: [k(0, T_FREEZE)], step: 2,
    cam: { pos: [k(0, CAM_EDGE_OUT.p), k(7, [8.6, 15.9, 10.2], 'inOutSine')], tgt: [k(0, CAM_EDGE_OUT.q), k(7, [5.9, 15.95, 7.0], 'inOutSine')], fov: [k(0, 30), k(7, 34)] },
    dof: { focus: [k(0, 5.0)], aperture: 0.0006 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: () => ({ keepRed: 0.75, saturation: 0.85, contrast: 1.1, exposure: 0.85 }),
    mg: (g, t, c) => {
      M.freezeUI(g, t, 0, '09:41:52:07');
      M.callout(g, t, 0.2, 6.9, c.project(V(5.0, L.deckY + 0.6, L.railZ)), 1, '护栏缺口', M.C.red, 1, 0, 700);
      M.callout(g, t, 0.45, 6.9, c.project(c.world('zhou', 'hips', [0.16, 0.0, -0.06])), 3, '安全带未挂', M.C.red, 1, 0, 540);
      M.callout(g, t, 0.7, 6.9, c.project(c.world('zhou', 'head', [0, -0.05, 0.07])), 2, '下颏带未系', M.C.red, 1, 0, 380);
      M.swissCheese(g, t, 1.2, ['临边防护', '安全带', '安全帽']);
      M.caption(g, t, 3.8, 6.9, '不是一个错误', '是三层防护，在同一秒同时失效');
    },
    sfx: [{ t: 0.05, id: 'heart', gain: 0.8 }, { t: 1.1, id: 'heart', gain: 0.7 }, { t: 2.15, id: 'heart', gain: 0.6 }, { t: 0.2, id: 'pop' }, { t: 0.45, id: 'pop' }, { t: 0.7, id: 'pop' }, { t: 1.5, id: 'whoosh', gain: 0.5 }, { t: 3.4, id: 'riser' }, { t: 3.8, id: 'hit', gain: 0.7 }], amb: 0,
  },
  {
    id: 'S13', dur: 5.0, title: '数据', take: 'bad', tk: [k(0, T_FREEZE)], step: 2,
    cam: still([8.6, 15.9, 10.2], [5.9, 15.95, 7.0], 34), shadow: { c: [5, 15, 6], r: 12 },
    grade: () => ({ keepRed: 0.9, saturation: 0.6, exposure: 0.7 }),
    mg: (g, t) => M.statCard(g, t, 59.07, '全国房屋市政工程生产安全事故中，高处坠落占比', '数据来源：住房和城乡建设部办公厅《关于2020年房屋市政工程生产安全事故情况的通报》（建办质〔2021〕17号），689 起中 407 起'),
    sfx: [{ t: 0.3, id: 'counter' }, { t: 1.7, id: 'hit', gain: 0.8 }], amb: 0,
  },
  {
    id: 'S14', dur: 4.0, title: '倒带', take: 'bad', tk: [k(0, T_FREEZE), k(1.3, T_FREEZE), k(4.0, -0.3, 'inCubic')], step: 1,
    cam: { pos: [k(0, [12.2, 18.6, 12.4]), k(4, [11.4, 18.0, 11.5], 'inOutSine')], tgt: [k(0, [4.9, 15.6, 5.3])], fov: [k(0, 40)] }, shadow: DECK_SHADOW,
    grade: t => ({ keepRed: t < 1.3 ? 0.75 : 0.35, saturation: t < 1.3 ? 0.85 : 0.7, contrast: 1.12 }),
    mg: (g, t) => {
      if (t < 1.3) M.freezeUI(g, t, 0, '09:41:52:07');
      M.caption(g, t, 0.15, 1.35, '现实没有暂停键。', '', 'center');
      if (t >= 1.3) { M.rewindUI(g, t, 1.3, M.fmtTime(Math.max(0, 112 - (t - 1.3) * 40))); M.caption(g, t, 1.5, 4.0, '但这一次，倒回去重来', '', 'll'); }
    },
    sfx: [{ t: 1.3, id: 'rewind' }], amb: 0,
  },
  {
    id: 'S15', dur: 5.0, title: '关上第一个洞：护栏不拆', take: 'good', tk: [k(0, 0), k(5, 5, 'linear')], step: 2,
    cam: still(CAM_RAIL.p, CAM_RAIL.q, 36), dof: { focus: [k(0, 3.2)], aperture: 0.0006 }, shadow: DECK_SHADOW,
    grade: () => ({ warmth: 0.035, saturation: 1.1 }),
    mg: (g, t, c) => {
      const post = (x: number, y: number) => c.project(V(x, L.deckY + y, L.railPostZ + 0.03));
      M.dimension(g, t, 1.2, 5.0, post(6, 0), post(6, L.railTop), '上杆 1.2 m', [60, 0]);
      M.dimension(g, t, 1.6, 5.0, post(4, L.railTop + 0.12), post(6, L.railTop + 0.12), '立杆间距 ≤ 2 m', [0, -40]);
      M.dimension(g, t, 2.0, 5.0, post(3.3, 0), post(3.3, L.toeH), '挡脚板 ≥ 180 mm', [-50, 0]);
      M.caption(g, t, 2.6, 5.0, '临边防护 · 不拆、不缺', 'JGJ 80-2016《建筑施工高处作业安全技术规范》', 'tr', M.C.paper);
    },
    sfx: [{ t: 1.8, id: 'pipeKnock' }, { t: 2.15, id: 'pipeKnock', gain: 0.8 }, { t: 1.2, id: 'tick' }, { t: 1.6, id: 'tick' }, { t: 2.0, id: 'tick' }], amb: 0.8, music: 'B',
  },
  {
    id: 'S16', dur: 3.0, title: '关上第二个洞：下颏带系紧', take: 'good', tk: [k(0, 3.8), k(3, 6.8, 'linear')], step: 2,
    cam: still(CAM_CHIN.p, CAM_CHIN.q, 30), dof: { focus: [k(0, 1.15)], aperture: 0.002 }, shadow: { c: [5, 15, 5], r: 6 },
    grade: () => ({ warmth: 0.035, saturation: 1.1 }),
    mg: (g, t, c) => M.callout(g, t, 1.3, 3.0, c.project(c.world('zhou', 'head', [0, -0.06, 0.07])), 2, '下颏带 · 系紧', M.C.green, -1, -60),
    sfx: [{ t: 1.2, id: 'buckle', gain: 1.0 }], amb: 0.7, music: 'B',
  },
  {
    id: 'S17', dur: 3.0, title: '关上第三个洞：挂在上方', take: 'good', tk: [k(0, 6.0), k(3, 8.2, 'linear')], step: 2,
    cam: still(CAM_RING.p, CAM_RING.q, 30), dof: { focus: [k(0, 0.8)], aperture: 0.0026 }, shadow: { c: [5, 16, 5], r: 5 },
    grade: () => ({ warmth: 0.035, saturation: 1.1 }),
    mg: (g, t, c) => {
      M.callout(g, t, 1.4, 3.0, c.project(V(5.2, Y + L.lifeH - 0.1, L.lifeZ + 0.05)), 3, '安全带 · 挂在上方', M.C.green, -1, 80);
      M.caption(g, t, 1.6, 3.0, '优先使用上方牢固挂点（高挂低用）', 'GB 23468-2025《坠落防护装备的选择、使用和维护》', 'top');
    },
    sfx: [{ t: 1.1, id: 'tug' }, { t: 1.7, id: 'tug', gain: 0.8 }], amb: 0.7, music: 'B',
  },
  {
    id: 'S18', dur: 3.5, title: '同样的工作', take: 'good', tk: [k(0, 7.9), k(3.5, 11.4, 'linear')], step: 2,
    cam: still(CAM_SIDE.p, CAM_SIDE.q, 38), dof: { focus: [k(0, 6.1)], aperture: 0.0005 }, shadow: DECK_SHADOW,
    grade: () => ({ warmth: 0.03, saturation: 1.08 }),
    sfx: [{ t: 0.9, id: 'step', gain: 0.6 }, { t: 1.8, id: 'step', gain: 0.6 }, { t: 2.7, id: 'step', gain: 0.6 }, { t: 0.4, id: 'whistle', gain: 0.5 }], amb: 0.7,
  },
  {
    id: 'S19', dur: 3.5, title: '同样的意外，不同的结局', take: 'good', tk: [k(0, 11.1), k(1.3, 11.75, 'linear'), k(3.5, 12.9, 'linear')], step: t => (t < 1.3 ? 1 : 2),
    cam: still(CAM_EDGE_OUT.p, CAM_EDGE_OUT.q, 30), dof: { focus: [k(0, 5.0)], aperture: 0.0012 }, shadow: { c: [5, 15, 6], r: 12 },
    grade: () => ({ warmth: 0.03, saturation: 1.05 }),
    sfx: [{ t: 0.5, id: 'rebarRoll' }, { t: 0.8, id: 'railHit' }, { t: 0.82, id: 'ropeTaut' }], amb: 0.6,
  },
  {
    id: 'S20', dur: 3.0, title: '情绪落地', take: 'good', tk: [k(0, 12.9), k(3, 15.1, 'linear')], step: 2,
    cam: { pos: [k(0, [5.95, 16.45, 5.1]), k(3, [5.9, 16.42, 4.95])], tgt: [k(0, [5.25, 16.4, 6.45])], fov: [k(0, 32)] },
    dof: { focus: [k(0, 1.6)], aperture: 0.0016 }, shadow: { c: [5, 15, 6], r: 6 },
    grade: () => ({ warmth: 0.04, saturation: 1.08 }),
    sfx: [{ t: 0.6, id: 'exhale' }, { t: 2.2, id: 'whistle2', gain: 0.5 }], amb: 0.75,
  },
  {
    id: 'S21', dur: 7.0, title: '拉开：回到全局', take: 'good', tk: [k(0, 15.5), k(7, 22.5, 'linear')], step: 2,
    cam: { pos: [k(0, [13.5, 19.5, 15.5]), k(7, [72, 56, 86], 'inOutCubic')], tgt: [k(0, [5.2, 15.8, 5.5]), k(7, [1, 10, -1], 'inOutCubic')], fov: [k(0, 36), k(7, 40)] },
    shadow: { c: [0, 0, 0], r: 60 },
    grade: t => ({ warmth: 0.03, saturation: 1.06, fade: Math.max(0, (t - 6.3) / 0.7) }),
    mg: (g, t) => { M.caption(g, t, 1.0, 3.9, '定格，只存在于视频里。', '', 'center'); M.caption(g, t, 4.0, 6.8, '现实里，没有倒带。', '', 'center', M.C.yellow); },
    sfx: [{ t: 0.5, id: 'whistleFar', gain: 0.4 }], amb: 0.9, music: 'A',
  },
  {
    id: 'S22', dur: 5.0, title: '结尾卡', take: 'none', tk: [k(0, 0)], step: 2, cam: still([0, 0, 0], [0, 0, -1], 30), shadow: DECK_SHADOW,
    mg: (g, t) => M.endCard(g, t),
    sfx: [{ t: 0.2, id: 'pop' }, { t: 0.5, id: 'pop' }, { t: 0.8, id: 'pop' }, { t: 1.4, id: 'chime' }], music: 'A', amb: 0,
  },
];

export const FPS = 24;
export function shotStarts(): number[] { const s: number[] = []; let acc = 0; for (const sh of SHOTS) { s.push(acc); acc += sh.dur; } return s; }
export const TOTAL = SHOTS.reduce((a, s) => a + s.dur, 0);
```

### 20/33 · `dingge-source/src/film/stage.ts`
<!-- casebook-file {"path": "dingge-source/src/film/stage.ts", "lines": 376, "final_newline": true, "sha256": "fbbc5655a061115496bc4c6ba0c03ed4fc421268560508e7bb4b54e9810628b3", "original_sha256": "fbbc5655a061115496bc4c6ba0c03ed4fc421268560508e7bb4b54e9810628b3"} -->
```ts
import * as THREE from 'three';
import type { Site } from '../world/site';
import { L } from '../world/layout';
import { Puppet, STYLES, type JointRot, type PuppetStyle } from '../characters/rig';
import { Actor, Lanyard, type PerformanceDef } from '../characters/actor';
import { addRot } from '../characters/poses';
import { DEG, sampleKeys, smooth, invLerp, clamp, mulberry32, lerp, type Key } from '../core/math';
import { materials } from '../materials/library';

// The Stage owns every moving thing on the set and evaluates a TAKE (a continuous performance) at world time T.
// Shots never animate anything themselves: they only pick a window of a take and a camera. That is how real
// coverage works, and it is why cut-on-action and match cuts line up for free.

export type TakeName = 'bad' | 'good';

export const T_FREEZE = 12.3;      // the frame the film stops on
export const T_SLIP = 11.4;
const Y = L.standY;
const FACE_NORTH = Math.PI, FACE_EAST = Math.PI / 2, FACE_WEST = -Math.PI / 2;
const RING = new THREE.Vector3(5.2, L.standY + L.lifeH - 0.035, L.lifeZ);

interface TakeState { zhou: PerformanceDef; li: PerformanceDef; lin: PerformanceDef }

export class Stage {
  site: Site;
  zhou: Actor; li: Actor; lin: Actor;
  bg: { actor: Actor; period: number; t0: number }[] = [];
  lanyard = new Lanyard(2.0);
  landedLoad: THREE.Object3D;
  defs: Record<TakeName, TakeState>;
  helmetHome = new THREE.Matrix4();
  helmetDetach: THREE.Matrix4 | null = null;
  offcutHome = new THREE.Vector3();
  caughtTilt = -10 * DEG;
  take: TakeName = 'bad';
  private tmp = new THREE.Vector3();

  constructor(site: Site) {
    this.site = site;
    const dyn = site.scene.getObjectByName('dynamic')!;
    const zp = new Puppet(STYLES.zhou), lp = new Puppet(STYLES.li), sp = new Puppet(STYLES.lin);
    dyn.add(zp.root, lp.root, sp.root);
    this.lanyard.addTo(dyn);
    this.defs = { bad: this.badTake(), good: this.goodTake() };
    this.zhou = new Actor(zp, this.defs.bad.zhou);
    this.li = new Actor(lp, this.defs.bad.li);
    this.lin = new Actor(sp, this.defs.bad.lin);
    this.helmetHome.copy(zp.helmet.matrix);

    // offcut sits exactly under 老周's right heel at the moment of the slip (solved, not hand-placed)
    this.zhou.evaluate(T_SLIP - 0.02);
    zp.samplePts[zp.sampleNames.indexOf('heelR')].getWorldPosition(this.offcutHome);
    this.offcutHome.set(this.offcutHome.x, Y + 0.011, this.offcutHome.z + 0.02);

    // contact solve: how far can he tip back before his back meets the top rail? (bisection on tilt)
    this.zhou.setDef(this.defs.good.zhou);
    this.caughtTilt = this.solveCaughtTilt();
    this.defs.good = this.goodTake();
    this.zhou.setDef(this.defs.bad.zhou);

    // the bundle left on the sleepers after the crane unhooks
    this.landedLoad = site.crane.loadGroup.clone();
    this.landedLoad.position.set(L.landX, Y + 0.1 + 0.0125, L.landZ);
    this.landedLoad.visible = false;
    dyn.add(this.landedLoad);

    this.buildBackground(dyn);
    site.light.refreshEnv();
  }

  // ------------------------------------------------------------------ takes
  private zhouCommon(): Partial<PerformanceDef> {
    return {
      floorY: Y, blinkSeed: 2,
      overlay: undefined,
    };
  }

  private badTake(): TakeState {
    const tie = (t: number, rot: JointRot) => {
      if (t < 3.0) { const w = 1 - smooth(invLerp(2.7, 3.0, t)); addRot(rot, { forearmR: [0, 38 * Math.sin(t * 2 * Math.PI * 2.4), 0], handR: [12 * Math.sin(t * 2 * Math.PI * 2.4 + 1), 0, 0] }, w); }
    };
    const signal = (t: number, rot: JointRot) => {
      if (t > 8.4 && t < 11.5) addRot(rot, { handR: [0, 28 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0], forearmR: [-6 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0, 0] }, smooth(invLerp(8.4, 8.8, t)) * (1 - smooth(invLerp(11.3, 11.5, t))));
    };
    const zhou: PerformanceDef = {
      ...this.zhouCommon(), floorY: Y,
      path: [{ t: -30, v: [5.2, 4.95] }, { t: 8.5, v: [5.2, 4.95] }, { t: 11.4, v: [5.25, 6.4], e: 'inOutSine' }, { t: 11.75, v: [5.27, 6.52], e: 'outQuad' }, { t: 12.3, v: [5.3, 6.78], e: 'inQuad' }],
      yaw: [{ t: -30, v: FACE_EAST }, { t: 4.2, v: FACE_EAST }, { t: 5.1, v: FACE_NORTH }],
      poses: [
        { t: -30, pose: 'crouchTie' }, { t: 3.0, pose: 'crouchTie' }, { t: 3.35, pose: { ...POSE_ANTIC } , e: 'inOutQuad' }, { t: 4.2, pose: 'stand' },
        { t: 5.0, pose: 'lookUp' }, { t: 6.0, pose: 'lookUp' }, { t: 6.6, pose: 'reachUpR' }, { t: 6.9, pose: 'reachUpR' },
        { t: 7.6, pose: 'reachUpRNear' }, { t: 8.3, pose: 'lookUp' }, { t: 8.9, pose: 'signalDown' }, { t: 11.35, pose: 'signalDown' },
        { t: 11.6, pose: 'stumble', e: 'outQuad' }, { t: 12.3, pose: 'fallBack', e: 'inOutQuad' },
      ],
      walks: [{ t0: 8.55, t1: 11.3, back: true, arms: false }],
      overlay: (t, rot) => { tie(t, rot); signal(t, rot); slipLeg(t, rot, 1); },
      snap: [{ t: -30, v: 1 }, { t: 11.62, v: 1 }, { t: 11.7, v: 0 }],
      pivot: [-0.095, 0.02, -0.34],
      tilt: [{ t: -30, v: 0 }, { t: 11.66, v: 0 }, { t: 12.3, v: -74 * DEG, e: 'inQuad' }],
      lift: [{ t: -30, v: 0 }, { t: 11.7, v: 0 }, { t: 12.3, v: 0.12, e: 'outQuad' }],
      chin: () => false,
    };
    const li: PerformanceDef = {
      floorY: Y, blinkSeed: 5,
      path: [{ t: -30, v: [5.0, 6.33] }, { t: 1.5, v: [5.0, 6.33] }, { t: 2.8, v: [4.1, 6.28] }, { t: 3.6, v: [4.1, 6.28] }, { t: 4.3, v: [3.7, 5.8], e: 'linear' }, { t: 8.5, v: [-1.8, 6.0], e: 'linear' }],
      yaw: [{ t: -30, v: 0 }, { t: 1.4, v: 0 }, { t: 2.2, v: FACE_WEST }, { t: 3.3, v: FACE_WEST }],
      poses: [
        { t: -30, pose: 'stand' }, { t: 0.2, pose: 'stand' }, { t: 0.85, pose: 'liftLow' }, { t: 1.0, pose: 'liftLow' }, { t: 1.55, pose: 'carry' },
        { t: 2.8, pose: 'carry' }, { t: 3.2, pose: 'pushRail' }, { t: 3.5, pose: 'pushRail' }, { t: 3.9, pose: 'standRelaxed' },
      ],
      walks: [{ t0: 1.55, t1: 2.8, arms: false }, { t0: 3.6, t1: 8.5 }],
      chin: () => true,
    };
    const lin: PerformanceDef = { floorY: 0.06, path: [{ t: -30, v: [-24, 20.4] }, { t: 30, v: [-24, 20.4] }], yaw: [{ t: -30, v: 0.3 }], poses: [{ t: -30, pose: 'handsOnHips' }], blinkSeed: 7 };
    return { zhou, li, lin };
  }

  private goodTake(): TakeState {
    const bad = this.badTake();
    const tug = (t: number, rot: JointRot) => {
      if (t > 6.8 && t < 7.7) { const k = Math.max(0, Math.sin((t - 6.8) / 0.45 * Math.PI * 2)); addRot(rot, { upperArmR: [14 * k, 0, 0], forearmR: [-10 * k, 0, 0] }); }
    };
    const signal = (t: number, rot: JointRot) => {
      if (t > 8.4 && t < 11.5) addRot(rot, { handR: [0, 28 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0], forearmR: [-6 * Math.sin((t - 8.4) * 2 * Math.PI * 1.4), 0, 0] }, smooth(invLerp(8.4, 8.8, t)) * (1 - smooth(invLerp(11.3, 11.5, t))));
    };
    const tie = (t: number, rot: JointRot) => {
      if (t < 3.0) { const w = 1 - smooth(invLerp(2.7, 3.0, t)); addRot(rot, { forearmR: [0, 38 * Math.sin(t * 2 * Math.PI * 2.4), 0], handR: [12 * Math.sin(t * 2 * Math.PI * 2.4 + 1), 0, 0] }, w); }
    };
    const ct = this.caughtTilt;
    const zhou: PerformanceDef = {
      ...bad.zhou,
      path: [{ t: -30, v: [5.2, 4.95] }, { t: 8.5, v: [5.2, 4.95] }, { t: 11.4, v: [5.25, 6.4], e: 'inOutSine' }, { t: 11.62, v: [5.26, 6.57], e: 'outQuad' }, { t: 12.8, v: [5.26, 6.57] }, { t: 13.8, v: [5.24, 6.3] }],
      pivot: [-0.095, 0.02, -0.23],
      poses: [
        { t: -30, pose: 'crouchTie' }, { t: 3.0, pose: 'crouchTie' }, { t: 3.35, pose: { ...POSE_ANTIC }, e: 'inOutQuad' }, { t: 4.2, pose: 'stand' },
        { t: 4.6, pose: 'buckleChin' }, { t: 5.2, pose: 'buckleChin' }, { t: 5.7, pose: 'lookUp' }, { t: 6.0, pose: 'lookUp' },
        { t: 6.6, pose: 'reachUpR' }, { t: 7.7, pose: 'reachUpR' }, { t: 8.3, pose: 'lookUp' }, { t: 8.9, pose: 'signalDown' }, { t: 11.35, pose: 'signalDown' },
        { t: 11.55, pose: 'stumble', e: 'outQuad' }, { t: 11.85, pose: 'caught', e: 'outQuad' }, { t: 12.9, pose: 'caught' }, { t: 13.6, pose: 'exhale' },
        { t: 14.4, pose: 'exhale' }, { t: 15.2, pose: 'lookUp' },
      ],
      walks: [{ t0: 8.55, t1: 11.3, back: true, arms: false }, { t0: 12.9, t1: 13.8 }],
      overlay: (t, rot) => { tie(t, rot); tug(t, rot); signal(t, rot); slipLeg(t, rot, 0.55); },
      snap: [{ t: -30, v: 1 }, { t: 11.5, v: 1 }, { t: 11.56, v: 0 }, { t: 12.8, v: 0 }, { t: 13.0, v: 1 }],
      tilt: [{ t: -30, v: 0 }, { t: 11.5, v: 0 }, { t: 11.66, v: ct, e: 'inQuad' }, { t: 11.74, v: ct * 0.8, e: 'outQuad' }, { t: 11.84, v: ct, e: 'inQuad' }, { t: 12.8, v: ct }, { t: 13.0, v: 0 }],
      lift: undefined,
      chin: t => t > 5.0,
    };
    const li: PerformanceDef = {
      floorY: Y, blinkSeed: 5,
      path: [{ t: -30, v: [2.6, 5.9] }, { t: 0.0, v: [2.6, 5.9] }, { t: 1.0, v: [5.0, 6.36], e: 'inOutSine' }, { t: 3.0, v: [5.0, 6.36] }, { t: 3.8, v: [4.3, 5.8], e: 'linear' }, { t: 8.0, v: [-1.8, 6.0], e: 'linear' }],
      yaw: [{ t: -30, v: FACE_EAST }, { t: 0.7, v: FACE_EAST }, { t: 1.1, v: 0 }, { t: 2.9, v: 0 }, { t: 3.4, v: FACE_WEST }],
      poses: [{ t: -30, pose: 'stand' }, { t: 1.0, pose: 'stand' }, { t: 1.4, pose: 'pushRail' }, { t: 2.5, pose: 'pushRail' }, { t: 3.0, pose: 'standRelaxed' }],
      walks: [{ t0: 0.0, t1: 1.0 }, { t0: 3.1, t1: 8.0 }],
      overlay: (t, rot) => {
        if (t > 1.6 && t < 2.3) addRot(rot, { spine: [6 * Math.sin((t - 1.6) / 0.35 * Math.PI), 0, 0] });   // shove the rail twice: it holds
        if (t > 2.4 && t < 2.9) addRot(rot, { head: [14 * Math.sin((t - 2.4) / 0.25 * Math.PI), 0, 0] });  // nod
      },
      chin: () => true,
    };
    const lin: PerformanceDef = {
      floorY: Y, blinkSeed: 7,
      path: [{ t: -30, v: [8.9, 3.7] }, { t: 30, v: [8.9, 3.7] }],
      yaw: [{ t: -30, v: FACE_WEST + 0.35 }],
      poses: [{ t: -30, pose: 'handsOnHips' }, { t: 14.3, pose: 'handsOnHips' }, { t: 14.9, pose: 'thumbsUp', e: 'outBack' }, { t: 16.6, pose: 'thumbsUp' }, { t: 17.2, pose: 'handsOnHips' }],
      chin: () => true,
    };
    return { zhou, li, lin };
  }

  private solveCaughtTilt(): number {
    const P = this.zhou.puppet;
    const back = ['chestB', 'pelvisB'].map(n => P.samplePts[P.sampleNames.indexOf(n)]);
    const limitZ = L.railZ - 0.024 - 0.005;
    const d = this.zhou.def;
    const test = (th: number) => {
      d.tilt = [{ t: -30, v: th }];
      this.zhou.evaluate(11.62);
      return Math.max(...back.map(o => o.getWorldPosition(this.tmp).z));
    };
    let lo = 0, hi = -40 * DEG;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (test(mid) < limitZ) lo = mid; else hi = mid; }
    return lo;
  }

  // ------------------------------------------------------------------ background crew (looping, deterministic)
  private buildBackground(dyn: THREE.Object3D) {
    const r = mulberry32(3);
    const gen = (i: number): PuppetStyle => ({
      name: 'bg' + i, helmet: [0xf5c400, 0xf5c400, 0xf5c400, 0x1e88e5, 0xffffff][i % 5], shirt: [0x3d5a80, 0x5d6d4e, 0x8d6e63, 0x455a64, 0x6d4c41][i % 5],
      pants: [0x2b3345, 0x37474f, 0x3e2723][i % 3], vest: [0xff6d00, 0xc6ff00][i % 2], face: 'generic', seed: 40 + i, scale: 0.96 + r() * 0.08, harness: i % 2 === 0,
    });
    const G = 0.06;
    const loops: { style: PuppetStyle; def: PerformanceDef; period: number }[] = [];
    // two walkers along the haul road, one carrying a bucket-like load
    const walkLoop = (x0: number, z0: number, x1: number, z1: number, speed: number, carry: boolean, t0: number) => {
      const len = Math.hypot(x1 - x0, z1 - z0), dur = len / speed, turn = 1.0;
      const yawA = Math.atan2(x1 - x0, z1 - z0), yawB = yawA + Math.PI;
      return {
        period: 2 * (dur + turn),
        def: {
          floorY: G, path: [{ t: t0, v: [x0, z0] }, { t: t0 + dur, v: [x1, z1], e: 'linear' as const }, { t: t0 + dur + turn, v: [x1, z1] }, { t: t0 + 2 * dur + turn, v: [x0, z0], e: 'linear' as const }, { t: t0 + 2 * dur + 2 * turn, v: [x0, z0] }],
          yaw: [{ t: t0, v: yawA }, { t: t0 + dur, v: yawA }, { t: t0 + dur + turn, v: yawB }, { t: t0 + 2 * dur + turn, v: yawB }, { t: t0 + 2 * dur + 2 * turn, v: yawA + Math.PI * 2 }],
          poses: [{ t: t0, pose: carry ? 'carry' as const : 'stand' as const }],
          walks: [{ t0: t0, t1: t0 + dur, arms: !carry }, { t0: t0 + dur + turn, t1: t0 + 2 * dur + turn, arms: !carry }],
        } as PerformanceDef,
      };
    };
    const add = (i: number, l: { period: number; def: PerformanceDef }) => loops.push({ style: gen(i), ...l });
    add(0, walkLoop(-24, 12, 18, 12.5, 1.15, false, -40));
    add(1, walkLoop(16, 13.6, -22, 13.2, 1.05, true, -40));
    add(2, walkLoop(-23.5, -18, -23.5, 8, 1.2, false, -40));
    add(3, walkLoop(-30, -24, -20, -24, 0.9, true, -40));
    // crouched rebar fixers on the far side of the deck
    const fixer = (x: number, z: number, yaw: number, ph: number): { period: number; def: PerformanceDef } => ({
      period: 4, def: { floorY: Y, path: [{ t: 0, v: [x, z] }, { t: 4, v: [x, z] }], yaw: [{ t: 0, v: yaw }], poses: [{ t: 0, pose: 'crouchTie' }], overlay: (t, rot) => addRot(rot, { forearmR: [0, 36 * Math.sin((t + ph) * 2 * Math.PI * 2.2), 0] }) },
    });
    add(4, fixer(-8.2, -3.1, 0.4, 0.3));
    add(5, fixer(-11.5, 2.4, -2.2, 0.8));
    add(6, fixer(-5.2, 3.6, 2.6, 0.5));
    // brick handlers at the pallets, hammering at the rebar shed
    const bender = (x: number, z: number, yaw: number, ph: number, floor = G): { period: number; def: PerformanceDef } => ({
      period: 3.2, def: { floorY: floor, path: [{ t: 0, v: [x, z] }, { t: 3.2, v: [x, z] }], yaw: [{ t: 0, v: yaw }], poses: [{ t: 0, pose: 'stand' }, { t: 0.8 + ph, pose: 'liftLow' }, { t: 1.4 + ph, pose: 'liftLow' }, { t: 2.2 + ph, pose: 'carry' }, { t: 3.2, pose: 'stand' }] },
    });
    add(7, bender(-9.5, 19.6, Math.PI, 0.0));
    add(8, bender(-6.4, 19.7, Math.PI + 0.3, 0.3));
    add(9, { period: 1.2, def: { floorY: G, path: [{ t: 0, v: [-33.5, -32.8] }, { t: 1.2, v: [-33.5, -32.8] }], yaw: [{ t: 0, v: Math.PI }], poses: [{ t: 0, pose: 'hammer' }], overlay: (t, rot) => addRot(rot, { upperArmR: [40 * Math.max(0, Math.sin(t * 2 * Math.PI / 1.2)), 0, 0], forearmR: [30 * Math.max(0, Math.sin(t * 2 * Math.PI / 1.2)), 0, 0] }) } });
    for (const l of loops) {
      const p = new Puppet(l.style); dyn.add(p.root);
      this.bg.push({ actor: new Actor(p, l.def), period: l.period, t0: l.def.path[0].t });
    }
  }

  // ------------------------------------------------------------------ evaluate
  apply(take: TakeName, T: number, frame = 0, boil = 0) {
    if (take !== this.take) {
      this.take = take;
      this.zhou.setDef(this.defs[take].zhou); this.li.setDef(this.defs[take].li); this.lin.setDef(this.defs[take].lin);
    }
    const s = this.site, P = this.zhou.puppet;
    this.zhou.evaluate(T, boil, frame);
    this.li.evaluate(T, boil, frame + 101);
    this.lin.evaluate(T, boil, frame + 202);
    for (const b of this.bg) b.actor.evaluate(b.t0 + (((T - b.t0) % b.period) + b.period) % b.period, boil * 0.6, frame + 303);

    // ---- crane: slew from yard to landing, lower, unhook, raise
    const yard = s.crane.aim(-30, -26), land = s.crane.aim(L.landX, L.landZ);
    const hookLand = Y + 0.1 + 0.0125 + 3.22;
    const slewK: Key<number>[] = [{ t: -40, v: yard.slew + 0.3 }, { t: -16, v: yard.slew }, { t: -1, v: land.slew, e: 'inOutSine' }];
    const trolK: Key<number>[] = [{ t: -40, v: yard.radius }, { t: -12, v: yard.radius }, { t: 2.5, v: land.radius, e: 'inOutSine' }];
    const hookK: Key<number>[] = [{ t: -40, v: 4 }, { t: -24, v: 4 }, { t: -16, v: 27, e: 'inOutSine' }, { t: 4.5, v: 27 }, { t: 12.8, v: hookLand + 0.5, e: 'inOutSine' }, { t: 14.5, v: hookLand, e: 'outQuad' }, { t: 16.6, v: hookLand - 0.25 }, { t: 17.2, v: hookLand + 0.6 }, { t: 24, v: 26, e: 'inOutSine' }];
    const swing = 0.12 * Math.sin(T * 0.9) * (1 - smooth(invLerp(10, 14.5, T)));
    const attached = T < 16.8;
    s.crane.setState({ slew: sampleKeys(slewK, T), trolley: sampleKeys(trolK, T), hookY: sampleKeys(hookK, T), swing, loadAttached: attached });
    this.landedLoad.visible = !attached;

    // ---- hoist cage shuttles between floors
    const cyc = ((T + 100) % 44) / 44;
    s.building.hoistCage.position.y = 0.15 + 9 * smooth(clamp(Math.sin(cyc * Math.PI * 2) * 1.6 + 0.5, 0, 1));

    // ---- guardrail bay: bad take = removed by 小李, good take = stays
    const top = s.building.gapTopRail, mid = s.building.gapMidRail;
    const installed = (m: THREE.Mesh, h: number) => { m.position.set((L.gapX0 + L.gapX1) / 2, L.deckY + h, L.railZ); m.rotation.set(0, 0, 0); };
    const lean = (m: THREE.Mesh, bottom: THREE.Vector3, tip: THREE.Vector3) => {
      m.position.copy(bottom).add(tip).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tip.clone().sub(bottom).normalize());
    };
    const leanTopB = new THREE.Vector3(3.62, Y + 0.026, 6.3), leanTopT = new THREE.Vector3(3.27, Y + 1.9, 6.62);
    const leanMidB = new THREE.Vector3(3.68, Y + 0.026, 6.42), leanMidT = new THREE.Vector3(3.28, Y + 1.88, 6.78);
    if (take === 'good') { installed(top, L.railTop); installed(mid, L.railMid); }
    else {
      lean(top, leanTopB, leanTopT);
      const LP = this.li.puppet;
      const hl = LP.j.handL.localToWorld(new THREE.Vector3(0, -0.09, 0.02)), hr = LP.j.handR.localToWorld(new THREE.Vector3(0, -0.09, 0.02));
      if (T < 0.95) installed(mid, L.railMid);
      else if (T < 2.8) {
        const c = hl.clone().add(hr).multiplyScalar(0.5);
        const w = smooth(invLerp(0.95, 1.1, T));
        const home = new THREE.Vector3((L.gapX0 + L.gapX1) / 2, L.deckY + L.railMid, L.railZ);
        mid.position.copy(home.lerp(c, w));
        const axis = new THREE.Vector3().subVectors(hl, hr).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis);
        mid.quaternion.slerpQuaternions(new THREE.Quaternion(), q, w);
      } else {
        const u = smooth(invLerp(2.8, 3.35, T));
        const c = hl.clone().add(hr).multiplyScalar(0.5);
        const axis = new THREE.Vector3().subVectors(hl, hr).normalize();
        const qa = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis);
        const qb = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), leanMidT.clone().sub(leanMidB).normalize());
        mid.position.lerpVectors(c, leanMidB.clone().add(leanMidT).multiplyScalar(0.5), u);
        mid.quaternion.slerpQuaternions(qa, qb, u);
      }
    }
    this.li.puppet.setGrip('L', take === 'bad' && T > 0.9 && T < 3.3 ? 1 : 0.2);
    this.li.puppet.setGrip('R', take === 'bad' && T > 0.9 && T < 3.3 ? 1 : 0.2);

    // ---- the off-cut rolls when stepped on
    const oc = s.props.offcut;
    const roll = smooth(invLerp(T_SLIP, T_SLIP + 0.3, T)) * Math.min(take === 'bad' ? 0.16 : 0.1, L.toeZ - 0.035 - this.offcutHome.z);
    oc.position.set(this.offcutHome.x, this.offcutHome.y, this.offcutHome.z + roll);
    oc.rotation.set(roll / 0.011, 0, 0);

    // ---- lanyard: clipped to the lifeline ring / in the hand / parked on the hip loop
    const dr = P.dRing.getWorldPosition(new THREE.Vector3());
    const hand = P.j.handR.localToWorld(new THREE.Vector3(0, -0.1, 0.03));
    const hip = P.hipLoop.getWorldPosition(new THREE.Vector3());
    let end: THREE.Vector3, gate = 0;
    if (take === 'bad') {
      if (T < 6.75) end = RING.clone();
      else if (T < 7.25) { const u = smooth(invLerp(6.75, 7.25, T)); end = RING.clone().lerp(hand, u); gate = T < 7.1 ? smooth(invLerp(6.75, 6.95, T)) : 1 - smooth(invLerp(7.1, 7.25, T)); }
      else if (T < 8.3) end = hand;
      else end = hand.clone().lerp(hip, smooth(invLerp(8.3, 8.6, T)));
    } else end = RING.clone();
    this.lanyard.update(dr, end, gate);
    s.building.lifeRing.position.copy(RING); s.building.lifeRing.rotation.set(0, Math.PI / 2, 0);
    P.setGrip('R', (take === 'bad' && T > 6.7 && T < 8.5) || (take === 'good' && T > 6.7 && T < 7.7) ? 0.9 : 0.25);

    // ---- helmet: flies off (chin strap undone) at the start of the fall, frozen mid-air in the freeze frame
    const tD = 11.95;
    if (take === 'bad' && T > tD) {
      if (!this.helmetDetach) {
        const T0 = T; this.zhou.evaluate(tD); P.helmet.updateMatrixWorld(true);
        this.helmetDetach = P.helmet.matrixWorld.clone(); this.zhou.evaluate(T0, boil, frame);
      }
      const dt = T - tD;
      const pos = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
      this.helmetDetach.decompose(pos, q, sc);
      pos.add(new THREE.Vector3(0.1 * dt, 1.4 * dt - 4.9 * dt * dt, 1.9 * dt));
      q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-3.2 * dt, 0.8 * dt, 0.5 * dt)));
      const dyn = s.scene.getObjectByName('dynamic')!;
      if (P.helmet.parent !== dyn) dyn.add(P.helmet);
      P.helmet.position.copy(pos); P.helmet.quaternion.copy(q); P.helmet.scale.copy(sc);
    } else if (P.helmet.parent !== P.j.head) {
      P.j.head.add(P.helmet); this.helmetHome.decompose(P.helmet.position, P.helmet.quaternion, P.helmet.scale);
    }
    if (take === 'bad' && T > tD) P.setChinStrap(false, -0.6);
  }

  /** Penetration test of the three hero puppets against registered colliders. Returns worst depth per sample. */
  collisions(): { who: string; part: string; tag: string; depth: number }[] {
    const out: { who: string; part: string; tag: string; depth: number }[] = [];
    const v = new THREE.Vector3();
    const cols = this.site.colliders;
    for (const a of [this.zhou, this.li, this.lin]) {
      const P = a.puppet;
      P.samplePts.forEach((o, i) => {
        o.getWorldPosition(v);
        for (const c of cols) {
          if (v.x > c.min.x && v.x < c.max.x && v.y > c.min.y && v.y < c.max.y && v.z > c.min.z && v.z < c.max.z) {
            const depth = Math.min(v.x - c.min.x, c.max.x - v.x, v.y - c.min.y, c.max.y - v.y, v.z - c.min.z, c.max.z - v.z);
            if (depth > 0.01) out.push({ who: P.style.name, part: P.sampleNames[i], tag: c.tag, depth: +depth.toFixed(3) });
          }
        }
        // floor: nothing below the deck while standing on it
        if (a.def.floorY === Y && v.y < L.deckY - 0.02 && v.z < L.bz1 - 0.05) out.push({ who: P.style.name, part: P.sampleNames[i], tag: 'deck', depth: +(L.deckY - v.y).toFixed(3) });
      });
    }
    return out;
  }
}

// anticipation before standing up: weight shifts forward, head dips (十二法则: 预备动作)
const POSE_ANTIC: JointRot = {
  hips: [26, 0, 0], spine: [30, 0, 0], chest: [16, 0, 0], neck: [8, 0, 0], head: [6, 0, 0],
  thighL: [-112, -8, 6], shinL: [128, 0, 0], thighR: [-108, 8, -6], shinR: [124, 0, 0],
  upperArmL: [-30, 0, 14], forearmL: [-50, 0, 0], upperArmR: [-34, 0, -12], forearmR: [-46, 0, 0],
};

/** the rear (right) foot shoots back as the off-cut rolls; w scales how far */
function slipLeg(t: number, rot: JointRot, w: number) {
  const u = smooth(invLerp(T_SLIP, T_SLIP + 0.22, t)) * w;
  if (u <= 0) return;
  addRot(rot, { thighR: [18 * u, 0, 0], shinR: [8 * u, 0, 0], footR: [-14 * u, 0, 0], thighL: [-18 * u, 0, 0], shinL: [24 * u, 0, 0] });
}

void lerp; void materials;
```

### 21/33 · `dingge-source/src/film/timeline.ts`
<!-- casebook-file {"path": "dingge-source/src/film/timeline.ts", "lines": 124, "final_newline": true, "sha256": "bcc87314a49d3b21397b766f876f86a165ece6ea01ec52c3aa746286b46e8bbe", "original_sha256": "bcc87314a49d3b21397b766f876f86a165ece6ea01ec52c3aa746286b46e8bbe"} -->
```ts
import * as THREE from 'three';
import { Engine } from '../core/engine';
import { Stage } from './stage';
import { SHOTS, FPS, shotStarts, TOTAL, type Shot, type MGCtx } from './shots';
import { sampleKeys, sampleVecKeys, hash2 } from '../core/math';
import type { Site } from '../world/site';

// Film timeline: global frame → (shot, quantised local time) → stage state + camera + grade + MG.
// Stop-motion rules live here: time is quantised to the shot's step (on twos/ones), the puppets "boil" only on frames
// where they were actually re-posed, and the key light flickers by ±1.5% per re-shot frame, like real practical lights.

export interface FrameKey { shot: number; lq: number; key: string }

export class Film {
  engine: Engine; stage: Stage; site: Site;
  overlay: HTMLCanvasElement; g: CanvasRenderingContext2D;
  starts = shotStarts();
  totalFrames = Math.round(TOTAL * FPS);
  private v = new THREE.Vector3();
  private state3D = '';
  private last3D = '';
  private cap: HTMLCanvasElement | null = null;

  constructor(engine: Engine, site: Site, stage: Stage, overlay: HTMLCanvasElement) {
    this.engine = engine; this.site = site; this.stage = stage; this.overlay = overlay;
    this.g = overlay.getContext('2d', { willReadFrequently: true })!;
  }

  locate(frame: number): { index: number; shot: Shot; lt: number } {
    const t = frame / FPS;
    let i = SHOTS.length - 1;
    for (let k = 0; k < SHOTS.length; k++) if (t < this.starts[k] + SHOTS[k].dur - 1e-6) { i = k; break; }
    return { index: i, shot: SHOTS[i], lt: t - this.starts[i] };
  }
  stepOf(shot: Shot, lt: number) { return typeof shot.step === 'function' ? shot.step(lt) : shot.step; }
  /** quantised local time for a frame (on twos → pairs of identical frames) */
  frameKey(frame: number): FrameKey {
    const { index, shot, lt } = this.locate(frame);
    const localFrame = Math.round(lt * FPS);
    const step = this.stepOf(shot, lt);
    const lq = (Math.floor(localFrame / step) * step) / FPS;
    return { shot: index, lq, key: `${index}:${lq.toFixed(4)}` };
  }

  /** Put the whole world into the state of `frame`. Returns the frame key. */
  seek(frame: number): FrameKey {
    const fk = this.frameKey(frame);
    const shot = SHOTS[fk.shot], lq = fk.lq;
    const e = this.engine, cam = e.camera;
    const seed = fk.shot * 10000 + Math.round(lq * FPS);

    // ---- stage (take time), with boil only when the puppets actually moved since the previous exposure
    if (shot.take !== 'none') {
      const T = sampleKeys(shot.tk, lq);
      const Tprev = sampleKeys(shot.tk, Math.max(0, lq - this.stepOf(shot, lq) / FPS));
      const moving = Math.abs(T - Tprev) > 1e-5 || lq === 0 && shot.tk.length > 1;
      this.stage.apply(shot.take, T, seed, moving ? (shot.boil ?? 0.35) : 0);
      this.site.light.sun.intensity = this.site.light.baseIntensity * (moving ? 1 + (hash2(seed, 7) - 0.5) * 0.03 : 1);
    }
    // ---- camera
    const p = sampleVecKeys(shot.cam.pos, lq), q = sampleVecKeys(shot.cam.tgt, lq);
    cam.position.set(p[0], p[1], p[2]); cam.lookAt(q[0], q[1], q[2]);
    cam.fov = sampleKeys(shot.cam.fov, lq); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    this.site.light.focusShadow(new THREE.Vector3(...shot.shadow.c), shot.shadow.r);
    this.site.light.update(cam);
    this.site.building.deckRebar.visible = cam.position.distanceTo(this.v.set(5, 15, 4)) < 36;
    // ---- depth of field
    const bk = e.bokeh;
    if (shot.dof) {
      bk.enabled = true;
      const u = bk.uniforms as Record<string, { value: number }>;
      u.focus.value = sampleKeys(shot.dof.focus, lq); u.aperture.value = shot.dof.aperture; u.maxblur.value = 0.01;
    } else bk.enabled = false;
    // ---- grade
    const gu = e.grade.uniforms;
    const d = { saturation: 1.05, keepRed: 0, warmth: 0.02, fade: 0, flash: 0, exposure: 1, vignette: 0.28, contrast: 1.04, ...(shot.grade?.(lq) ?? {}) };
    for (const [k2, val] of Object.entries(d)) gu[k2].value = val;
    gu.seed.value = seed % 997;
    // identity of the rendered 3D image: if nothing visible changed (held frame, still camera), reuse it
    const Tk = shot.take === 'none' ? 'none' : `${shot.take}:${sampleKeys(shot.tk, lq).toFixed(4)}`;
    this.state3D = [Tk, p.map(x => x.toFixed(4)), q.map(x => x.toFixed(4)), cam.fov.toFixed(3), JSON.stringify(d), bk.enabled ? (bk.uniforms as Record<string, { value: number }>).focus.value.toFixed(3) : '-'].join('|');
    // ---- MG overlay
    const g = this.g;
    g.clearRect(0, 0, 1920, 1080);
    if (shot.mg) {
      const ctx: MGCtx = {
        stage: this.stage,
        project: (w: THREE.Vector3) => {
          const s = w.clone().project(cam);
          return { x: (s.x * 0.5 + 0.5) * 1920, y: (-s.y * 0.5 + 0.5) * 1080, vis: s.z < 1 && s.z > -1 };
        },
        world: (who, joint, local = [0, 0, 0]) => {
          const P = who === 'zhou' ? this.stage.zhou.puppet : this.stage.li.puppet;
          const j = (P.j as Record<string, THREE.Object3D>)[joint];
          return j.localToWorld(new THREE.Vector3(...local));
        },
      };
      shot.mg(g, lq, ctx);
    }
    return fk;
  }

  render(frame: number): FrameKey {
    const fk = this.seek(frame);
    const shot = SHOTS[fk.shot];
    if (shot.take === 'none') {
      const r = this.engine.renderer; r.setClearColor(0x111418, 1); r.clear();
    } else if (this.state3D !== this.last3D || !this.engine.renderer.getContextAttributes()?.preserveDrawingBuffer) this.engine.render();
    this.last3D = this.state3D;
    return fk;
  }

  /** JPEG of the composited frame (3D + MG), for the offline renderer. */
  capture(quality = 0.94): string {
    // CPU-backed canvases: a GPU 2D canvas can hand drawImage a stale snapshot under software GL
    if (!this.cap) { this.cap = document.createElement('canvas'); this.cap.width = 1920; this.cap.height = 1080; }
    const c = this.cap;
    const g = c.getContext('2d', { willReadFrequently: true })!;
    g.clearRect(0, 0, 1920, 1080);
    g.drawImage(this.engine.renderer.domElement, 0, 0, 1920, 1080);
    g.drawImage(this.overlay, 0, 0);
    return c.toDataURL('image/jpeg', quality);
  }
}
```

### 22/33 · `dingge-source/src/materials/library.ts`
<!-- casebook-file {"path": "dingge-source/src/materials/library.ts", "lines": 83, "final_newline": true, "sha256": "a429145ce32a44817606621368d019bc005cd50db4a7969385a1fbcde9d1dd6b", "original_sha256": "a429145ce32a44817606621368d019bc005cd50db4a7969385a1fbcde9d1dd6b"} -->
```ts
import * as THREE from 'three';
import * as T from './textures';

// One shared material library. World-space UVs (see world/geo.ts) mean `uvScale` is metres per texture tile.

export interface MatDef { mat: THREE.Material; uvScale: number }

export type MatKey =
  | 'concrete' | 'concreteDark' | 'concreteOld' | 'plywood' | 'timber' | 'rebar' | 'craneYellow' | 'craneWhite' | 'steelDark'
  | 'galv' | 'railRW' | 'toeYB' | 'greenMesh' | 'flatNet' | 'dirt' | 'asphalt' | 'grass' | 'paving' | 'brick' | 'block'
  | 'containerWhite' | 'containerBlue' | 'roofBlue' | 'glass' | 'cable' | 'rubber' | 'kerb' | 'lineWhite' | 'lineYellow'
  | 'hoardingBlue' | 'treeLeaf' | 'treeLeaf2' | 'bark' | 'facadeA' | 'facadeB' | 'facadeC' | 'facadeD' | 'roofGrey'
  | 'orangePlastic' | 'rebarDeck' | 'cementBag' | 'waterBlack' | 'lamp' | 'redPaint' | 'blackMatte';

let lib: Record<MatKey, MatDef> | null = null;

function std(p: THREE.MeshStandardMaterialParameters, tex?: T.TexSet): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ ...p });
  if (tex) { m.map = tex.map; if (tex.normalMap) m.normalMap = tex.normalMap; if (tex.roughnessMap) m.roughnessMap = tex.roughnessMap; }
  return m;
}

export function materials(): Record<MatKey, MatDef> {
  if (lib) return lib;
  const conc = T.concrete(1);
  const concOld = T.concrete(5, [150, 148, 142]);
  const stripesRW = T.stripes('#f2f0ea', '#d0262a', 3);
  const stripesYB = T.stripes('#f4c20d', '#1b1b1b', 3);
  const mesh = T.safetyMesh();
  const facadeTex = [
    T.facade({ wall: [226, 218, 204], accent: [180, 150, 120], glass: [70, 96, 120], seed: 21 }),
    T.facade({ wall: [206, 214, 222], accent: [120, 132, 150], glass: [60, 86, 110], seed: 22 }),
    T.facade({ wall: [232, 206, 180], accent: [170, 120, 90], glass: [76, 96, 112], seed: 23 }),
    T.facade({ wall: [196, 190, 182], accent: [140, 136, 130], glass: [58, 74, 92], seed: 24 }),
  ];
  const fac = (i: number) => std({ roughness: 1, metalness: 0, normalScale: new THREE.Vector2(0.6, 0.6) }, facadeTex[i]);

  lib = {
    concrete: { mat: std({ roughness: 1, normalScale: new THREE.Vector2(0.8, 0.8) }, conc), uvScale: 2.44 },
    concreteDark: { mat: std({ roughness: 1, color: 0xb8b4ae }, conc), uvScale: 2.44 },
    concreteOld: { mat: std({ roughness: 1 }, concOld), uvScale: 3 },
    rebarDeck: { mat: std({ roughness: 1 }, T.rebarDeck(14)), uvScale: 2.4 },
    plywood: { mat: std({ roughness: 1 }, T.plywood(2)), uvScale: 2.44 },
    timber: { mat: std({ roughness: 1 }, T.timber(3)), uvScale: 1.2 },
    rebar: { mat: std({ roughness: 1, metalness: 0.55 }, T.rust(4)), uvScale: 0.6 },
    craneYellow: { mat: std({ roughness: 1, metalness: 0.35 }, T.paintedSteel(11, [236, 178, 22])), uvScale: 1.5 },
    craneWhite: { mat: std({ roughness: 1, metalness: 0.3 }, T.paintedSteel(12, [226, 226, 220])), uvScale: 1.5 },
    steelDark: { mat: std({ color: 0x3a3d42, roughness: 0.55, metalness: 0.7 }), uvScale: 1 },
    galv: { mat: std({ roughness: 1, metalness: 0.75 }, T.galvanized(6)), uvScale: 1 },
    railRW: { mat: std({ map: stripesRW, roughness: 0.45, metalness: 0.2 }), uvScale: 0.8 },
    toeYB: { mat: std({ map: stripesYB, roughness: 0.55 }), uvScale: 0.9 },
    greenMesh: { mat: std({ map: mesh.map, alphaMap: mesh.alpha, transparent: true, opacity: 0.92, side: THREE.DoubleSide, roughness: 0.9, depthWrite: true }), uvScale: 1.8 },
    flatNet: { mat: std({ map: T.flatNet(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.9, transparent: false }), uvScale: 0.8 },
    dirt: { mat: std({ roughness: 1, normalScale: new THREE.Vector2(1.2, 1.2) }, T.dirt(7)), uvScale: 9 },
    asphalt: { mat: std({ roughness: 1 }, T.asphalt(8)), uvScale: 6 },
    grass: { mat: std({ roughness: 1 }, T.grass(9)), uvScale: 8 },
    paving: { mat: std({ roughness: 1 }, T.paving(10)), uvScale: 2.4 },
    brick: { mat: std({ roughness: 1 }, T.brick(11)), uvScale: 1.0 },
    block: { mat: std({ roughness: 1, color: 0xd8d4cc }, T.concrete(13, [210, 206, 196], 256)), uvScale: 1.2 },
    containerWhite: { mat: std({ color: 0xeef0f0, roughness: 0.55, metalness: 0.2 }), uvScale: 1 },
    containerBlue: { mat: std({ color: 0x1e5aa8, roughness: 0.5, metalness: 0.25 }), uvScale: 1 },
    roofBlue: { mat: std({ color: 0x2a64b0, roughness: 0.5, metalness: 0.35 }), uvScale: 1 },
    glass: { mat: new THREE.MeshPhysicalMaterial({ color: 0x5f7a8c, roughness: 0.05, metalness: 0.1, transmission: 0, reflectivity: 0.8, clearcoat: 1 }), uvScale: 1 },
    cable: { mat: std({ color: 0x2b2b2b, roughness: 0.4, metalness: 0.8 }), uvScale: 1 },
    rubber: { mat: std({ color: 0x1a1a1a, roughness: 0.9 }), uvScale: 1 },
    kerb: { mat: std({ roughness: 1, color: 0xcfcac2 }, conc), uvScale: 1.2 },
    lineWhite: { mat: std({ color: 0xe8e8e2, roughness: 0.7 }), uvScale: 1 },
    lineYellow: { mat: std({ color: 0xe0b400, roughness: 0.7 }), uvScale: 1 },
    hoardingBlue: { mat: std({ color: 0x1d4f91, roughness: 0.5, metalness: 0.3 }), uvScale: 1 },
    treeLeaf: { mat: std({ color: 0x4d7a36, roughness: 0.85, flatShading: true }), uvScale: 1 },
    treeLeaf2: { mat: std({ color: 0x3f6b30, roughness: 0.85, flatShading: true }), uvScale: 1 },
    bark: { mat: std({ color: 0x5a4636, roughness: 1 }), uvScale: 1 },
    facadeA: { mat: fac(0), uvScale: 1 }, facadeB: { mat: fac(1), uvScale: 1 }, facadeC: { mat: fac(2), uvScale: 1 }, facadeD: { mat: fac(3), uvScale: 1 },
    roofGrey: { mat: std({ roughness: 1, color: 0x9a978f }, concOld), uvScale: 4 },
    orangePlastic: { mat: std({ color: 0xff6a13, roughness: 0.5 }), uvScale: 1 },
    cementBag: { mat: std({ color: 0xd9d2c0, roughness: 0.95 }), uvScale: 1 },
    waterBlack: { mat: std({ color: 0x1b1d20, roughness: 0.25, metalness: 0.2 }), uvScale: 1 },
    lamp: { mat: std({ color: 0xffffff, emissive: 0xfff4d6, emissiveIntensity: 0.4 }), uvScale: 1 },
    redPaint: { mat: std({ color: 0xc62828, roughness: 0.45, metalness: 0.2 }), uvScale: 1 },
    blackMatte: { mat: std({ color: 0x151618, roughness: 0.8 }), uvScale: 1 },
  };
  return lib;
}
```

### 23/33 · `dingge-source/src/materials/textures.ts`
<!-- casebook-file {"path": "dingge-source/src/materials/textures.ts", "lines": 379, "final_newline": true, "sha256": "26458cc52e61203a579eb708d3b625af7ea2d085997f0573a0b2ea70277c09b9", "original_sha256": "26458cc52e61203a579eb708d3b625af7ea2d085997f0573a0b2ea70277c09b9"} -->
```ts
import * as THREE from 'three';
import { TileNoise, mulberry32, clamp } from '../core/math';

// Procedural, tileable PBR texture sets (albedo + normal + roughness) generated on canvas.
// No external image assets: the whole site ships as code and renders identically everywhere.

export interface TexSet { map: THREE.Texture; normalMap?: THREE.Texture; roughnessMap?: THREE.Texture }

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function canvas(size: number, h = size) {
  const c = document.createElement('canvas');
  c.width = size; c.height = h;
  return c;
}

function toTexture(c: HTMLCanvasElement, srgb: boolean, repeat = true): THREE.Texture {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

/** Build albedo/normal/roughness from per-pixel callbacks returning colour, height, roughness. */
function buildSet(size: number, fn: (u: number, v: number, x: number, y: number) => { c: RGB; h: number; r: number }, normalStrength = 2.0): TexSet {
  const n = size * size;
  const col = new Uint8ClampedArray(n * 4), rough = new Uint8ClampedArray(n * 4);
  const height = new Float32Array(n);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const s = fn(x / size, y / size, x, y);
    col[i * 4] = s.c[0]; col[i * 4 + 1] = s.c[1]; col[i * 4 + 2] = s.c[2]; col[i * 4 + 3] = 255;
    const r = clamp(s.r) * 255; rough[i * 4] = r; rough[i * 4 + 1] = r; rough[i * 4 + 2] = r; rough[i * 4 + 3] = 255;
    height[i] = s.h;
  }
  const nrm = new Uint8ClampedArray(n * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const hx = height[y * size + ((x + 1) % size)] - height[y * size + ((x - 1 + size) % size)];
    const hy = height[((y + 1) % size) * size + x] - height[((y - 1 + size) % size) * size + x];
    let nx = -hx * normalStrength, ny = -hy * normalStrength, nz = 1;
    const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const i = (y * size + x) * 4;
    nrm[i] = (nx * 0.5 + 0.5) * 255; nrm[i + 1] = (-ny * 0.5 + 0.5) * 255; nrm[i + 2] = (nz * 0.5 + 0.5) * 255; nrm[i + 3] = 255;
  }
  const mk = (data: Uint8ClampedArray, srgb: boolean) => {
    const c = canvas(size); c.getContext('2d')!.putImageData(new ImageData(data as unknown as ImageDataArray, size, size), 0, 0); return toTexture(c, srgb);
  };
  return { map: mk(col, true), normalMap: mk(nrm, false), roughnessMap: mk(rough, false) };
}

// ---------------------------------------------------------------- materials

export function concrete(seed = 1, tint: RGB = [168, 166, 160], size = 512): TexSet {
  const N = new TileNoise(seed), r = mulberry32(seed + 7);
  const pores: [number, number, number][] = Array.from({ length: 260 }, () => [r(), r(), 0.002 + r() * 0.004]);
  return buildSet(size, (u, v) => {
    const big = N.fbm(u, v, 3, 4), fine = N.fbm(u, v, 32, 3), stain = N.fbm(u + 0.3, v * 0.6, 2, 3);
    let h = fine * 0.6 + big * 0.4;
    let pore = 0;
    for (const p of pores) { const dx = Math.min(Math.abs(u - p[0]), 1 - Math.abs(u - p[0])), dy = Math.min(Math.abs(v - p[1]), 1 - Math.abs(v - p[1])); if (dx * dx + dy * dy < p[2] * p[2]) pore = 1; }
    // formwork panel seam lines (1 tile ≈ 2.4m, plywood 1.22 x 2.44)
    const seamU = Math.min(Math.abs(u - 0.5), u, 1 - u) < 0.0025 ? 1 : 0;
    const seamV = Math.min(v, 1 - v) < 0.0025 ? 1 : 0;
    const k = 0.82 + big * 0.22 + fine * 0.08 - stain * 0.12 - pore * 0.25 - (seamU + seamV) * 0.08;
    h -= pore * 0.6 + (seamU + seamV) * 0.3;
    const c: RGB = [tint[0] * k, tint[1] * k, tint[2] * k * 0.98];
    return { c, h, r: 0.82 + fine * 0.15 };
  }, 3);
}

export function plywood(seed = 2, size = 512): TexSet {
  // film-faced formwork plywood: reddish brown, worn to pale wood at scuffs, panel seams, nail heads
  const N = new TileNoise(seed), r = mulberry32(seed);
  const nails = Array.from({ length: 40 }, () => [r(), r()]);
  return buildSet(size, (u, v) => {
    const wear = N.fbm(u, v, 4, 5), grain = N.fbm(u * 1, v * 8, 6, 3), dirt = N.fbm(u + 0.5, v + 0.2, 8, 4);
    const film: RGB = [122, 64, 40], bare: RGB = [196, 160, 110];
    let c = mix(film, bare, clamp((wear - 0.62) * 4));
    c = mix(c, [90, 80, 70], clamp((dirt - 0.55) * 2) * 0.5);
    const g = 0.92 + grain * 0.12; c = [c[0] * g, c[1] * g, c[2] * g];
    const seam = (Math.min(u, 1 - u) < 0.003 || Math.min(v, 1 - v) < 0.003 || Math.abs(u - 0.5) < 0.0025) ? 1 : 0;
    let nail = 0; for (const n of nails) if (Math.hypot(u - n[0], v - n[1]) < 0.003) nail = 1;
    if (seam) c = [c[0] * 0.45, c[1] * 0.45, c[2] * 0.45];
    if (nail) c = [70, 70, 72];
    return { c, h: grain * 0.2 - seam * 0.8 + nail * 0.4, r: 0.45 + wear * 0.4 };
  }, 2);
}

/** Plywood deck seen through a two-layer Ø10@200 rebar mat (tile = 2.4m → 12 bars). Mipmaps kill the moiré of thin geometry. */
export function rebarDeck(seed = 14, size = 1024): TexSet {
  const N = new TileNoise(seed);
  const ply = plywoodFn(seed);
  return buildSet(size, (u, v) => {
    const base = ply(u, v);
    const fu = (u * 12) % 1, fv = (v * 12) % 1;
    const bw = 0.045;
    const barU = Math.min(fu, 1 - fu) < bw, barV = Math.min(fv, 1 - fv) < bw;
    const shadowU = !barU && fu > bw && fu < bw * 3, shadowV = !barV && fv > bw && fv < bw * 3;
    let c = base.c, h = base.h, r = base.r;
    if (shadowU || shadowV) c = [c[0] * 0.55, c[1] * 0.55, c[2] * 0.55];
    if (barU || barV) {
      const k = 0.8 + N.fbm(u, v, 64, 2) * 0.4;
      const rustc: RGB = N.fbm(u, v, 12, 3) > 0.5 ? [120, 64, 36] : [70, 58, 50];
      c = [rustc[0] * k, rustc[1] * k, rustc[2] * k]; h = 1.0; r = 0.7;
      if (barU && barV) { c = [40, 38, 36]; h = 1.3; }
    }
    return { c, h, r };
  }, 3);
}

function plywoodFn(seed: number) {
  const N = new TileNoise(seed);
  return (u: number, v: number) => {
    const wear = N.fbm(u, v, 4, 5), grain = N.fbm(u, v * 8, 6, 3);
    const film: RGB = [122, 64, 40], bare: RGB = [196, 160, 110];
    let c = mix(film, bare, clamp((wear - 0.62) * 4));
    const g = 0.92 + grain * 0.12; c = [c[0] * g, c[1] * g, c[2] * g];
    return { c, h: grain * 0.2, r: 0.5 + wear * 0.3 };
  };
}

export function timber(seed = 3, size = 256): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const ring = Math.sin((u * 18 + N.fbm(u, v, 4, 3) * 6) * Math.PI) * 0.5 + 0.5;
    const k = 0.8 + ring * 0.2 - N.fbm(u, v, 16, 3) * 0.1;
    return { c: [205 * k, 170 * k, 118 * k], h: ring * 0.3, r: 0.75 };
  }, 1.5);
}

export function rust(seed = 4, size = 256): TexSet {
  // rebar / old steel: dark mill scale with orange rust bloom
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 6, 5), b = N.fbm(u + 0.3, v + 0.7, 24, 3);
    const scale: RGB = [58, 50, 46], rustc: RGB = [128, 66, 34];
    const c = mix(scale, rustc, clamp((a - 0.42) * 3));
    const k = 0.85 + b * 0.3;
    return { c: [c[0] * k, c[1] * k, c[2] * k], h: a * 0.5 + b * 0.3, r: 0.6 + a * 0.35 };
  }, 3);
}

export function paintedSteel(seed: number, base: RGB, size = 256): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const chip = N.fbm(u, v, 10, 5), grime = N.fbm(u + 0.2, v * 0.3, 3, 4);
    let c = base;
    const chipped = chip > 0.7;
    if (chipped) c = mix([70, 58, 50], [120, 70, 40], (chip - 0.7) * 3);
    c = mix(c, [60, 58, 52], clamp((grime - 0.5) * 1.6) * 0.45);
    return { c, h: chipped ? -0.4 : 0, r: chipped ? 0.8 : 0.42 + grime * 0.2 };
  }, 2);
}

export function galvanized(seed = 6, size = 256): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const s = N.fbm(u, v, 8, 4), sp = N.fbm(u, v, 40, 2);
    const k = 0.72 + s * 0.25 + sp * 0.08;
    return { c: [150 * k, 154 * k, 158 * k], h: s * 0.2, r: 0.4 + s * 0.3 };
  });
}

export function dirt(seed = 7, size = 1024): TexSet {
  // compacted site soil with gravel, tyre ruts and puddle-dark patches
  const N = new TileNoise(seed), r = mulberry32(seed);
  const stones = Array.from({ length: 900 }, () => [r(), r(), 0.0015 + r() * 0.004, r()]);
  const grid = new Map<number, number[][]>();
  for (const s of stones) { const k = Math.floor(s[0] * 32) + Math.floor(s[1] * 32) * 32; if (!grid.has(k)) grid.set(k, []); grid.get(k)!.push(s); }
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 4, 6), b = N.fbm(u, v, 48, 3), wet = N.fbm(u + 0.4, v + 0.1, 2, 4);
    const rut = Math.pow(Math.abs(Math.sin((v + N.fbm(u, v, 2, 2) * 0.1) * Math.PI * 6)), 18);
    let c: RGB = mix([142, 118, 92], [108, 90, 72], a);
    c = mix(c, [86, 74, 62], clamp((wet - 0.58) * 3) * 0.6);
    let h = a * 0.4 + b * 0.35 - rut * 0.3, rr = 0.92 - clamp((wet - 0.58) * 3) * 0.25;
    const gx = Math.floor(u * 32), gy = Math.floor(v * 32);
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
      const list = grid.get(((gx + ox + 32) % 32) + ((gy + oy + 32) % 32) * 32); if (!list) continue;
      for (const s of list) {
        let dx = Math.abs(u - s[0]); dx = Math.min(dx, 1 - dx); let dy = Math.abs(v - s[1]); dy = Math.min(dy, 1 - dy);
        const d = Math.hypot(dx, dy) / s[2];
        if (d < 1) { const t = s[3]; c = mix(c, [150 + t * 60, 145 + t * 55, 138 + t * 50], 0.85); h += (1 - d * d) * 0.8; rr = 0.7; }
      }
    }
    const k = 0.95 + b * 0.1;
    return { c: [c[0] * k, c[1] * k, c[2] * k], h, r: rr };
  }, 4);
}

export function asphalt(seed = 8, size = 512): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 64, 2), b = N.fbm(u, v, 4, 4), crack = Math.abs(N.fbm(u, v, 6, 4) - 0.5) < 0.006 ? 1 : 0;
    const k = 0.75 + a * 0.35 + b * 0.1 - crack * 0.4;
    return { c: [62 * k, 63 * k, 66 * k], h: a * 0.6 - crack, r: 0.88 };
  }, 3);
}

export function grass(seed = 9, size = 512): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const a = N.fbm(u, v, 5, 5), b = N.fbm(u, v, 80, 2), dry = N.fbm(u + 0.7, v, 3, 3);
    let c: RGB = mix([66, 102, 46], [92, 120, 58], a);
    c = mix(c, [140, 128, 84], clamp((dry - 0.6) * 3) * 0.6);
    const k = 0.8 + b * 0.4;
    return { c: [c[0] * k, c[1] * k, c[2] * k], h: b, r: 0.95 };
  }, 2);
}

export function paving(seed = 10, size = 512): TexSet {
  const N = new TileNoise(seed);
  return buildSet(size, (u, v) => {
    const tu = (u * 4) % 1, tv = (v * 8) % 1;
    const joint = tu < 0.03 || tv < 0.06 ? 1 : 0;
    const tile = Math.floor(u * 4) + Math.floor(v * 8) * 5;
    const tone = 0.85 + ((tile * 7919) % 13) / 13 * 0.15 + N.fbm(u, v, 32, 2) * 0.08;
    const c: RGB = joint ? [96, 94, 90] : [178 * tone, 172 * tone, 162 * tone];
    return { c, h: joint ? -0.6 : N.fbm(u, v, 64, 2) * 0.2, r: 0.85 };
  }, 2);
}

export function brick(seed = 11, size = 512): TexSet {
  // Chinese solid clay / aerated block infill: 240x115x53 bricks with 10mm joints (tile = 1m x 0.504m*2)
  const N = new TileNoise(seed);
  const rows = 16, cols = 4;
  return buildSet(size, (u, v) => {
    const row = Math.floor(v * rows); const off = (row % 2) * 0.5;
    const cu = (u * cols + off) % 1, cv = (v * rows) % 1;
    const mortar = cu < 0.04 || cv < 0.16;
    const id = Math.floor(u * cols + off) + row * 13;
    const tone = 0.8 + ((id * 2654435761) >>> 0) % 100 / 100 * 0.3;
    const n = N.fbm(u, v, 24, 3);
    const c: RGB = mortar ? [168, 162, 152] : [150 * tone * (0.9 + n * 0.2), 72 * tone, 52 * tone];
    return { c, h: mortar ? -0.7 : n * 0.3, r: mortar ? 0.95 : 0.85 };
  }, 3);
}

// ---------------------------------------------------------------- flat / graphic textures

export function stripes(a: string, b: string, count = 4, size = 256): THREE.Texture {
  // 45° safety stripes, tileable
  const c = canvas(size), g = c.getContext('2d')!;
  g.fillStyle = a; g.fillRect(0, 0, size, size);
  g.fillStyle = b;
  const w = size / count;
  for (let i = -count * 2; i < count * 2; i++) {
    g.beginPath();
    g.moveTo(i * w * 2, 0); g.lineTo(i * w * 2 + w, 0); g.lineTo(i * w * 2 + w + size, size); g.lineTo(i * w * 2 + size, size); g.closePath(); g.fill();
  }
  return toTexture(c, true);
}

export function safetyMesh(size = 256): { map: THREE.Texture; alpha: THREE.Texture } {
  // 密目式安全立网: ≥2000 目/100cm². Tile = 0.5m; we show the weave at ~0.08 scale plus the border rope
  const c = canvas(size), g = c.getContext('2d')!;
  g.fillStyle = '#1f7a3a'; g.fillRect(0, 0, size, size);
  const a = canvas(size), ga = a.getContext('2d')!;
  ga.fillStyle = '#d8d8d8'; ga.fillRect(0, 0, size, size);
  const cell = 4;
  ga.fillStyle = '#6a6a6a';
  for (let y = 0; y < size; y += cell) for (let x = 0; x < size; x += cell) ga.fillRect(x + 1, y + 1, 2, 2);
  g.fillStyle = 'rgba(255,255,255,0.06)';
  for (let y = 0; y < size; y += cell * 2) g.fillRect(0, y, size, 1);
  g.fillStyle = 'rgba(233,233,226,0.55)'; g.fillRect(0, 0, size, 2); g.fillRect(0, 0, 2, size); // eyelet rope
  return { map: toTexture(c, true), alpha: toTexture(a, false) };
}

export function flatNet(size = 256): THREE.Texture {
  // 安全平网 (white nylon, 100mm mesh), alpha texture
  const c = canvas(size), g = c.getContext('2d')!;
  g.clearRect(0, 0, size, size);
  g.strokeStyle = '#ffffff'; g.lineWidth = 3;
  const n = 8, s = size / n;
  for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, size); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(size, i * s); g.stroke(); }
  return toTexture(c, true);
}

/** Text panel texture (hoardings, notice boards, site signs). */
export function signPanel(opts: { w: number; h: number; bg: string; lines: { text: string; color: string; size: number; weight?: number; y: number }[]; band?: string; border?: string }): THREE.Texture {
  const c = canvas(opts.w, opts.h), g = c.getContext('2d')!;
  g.fillStyle = opts.bg; g.fillRect(0, 0, opts.w, opts.h);
  if (opts.band) { g.fillStyle = opts.band; g.fillRect(0, opts.h * 0.82, opts.w, opts.h * 0.18); }
  if (opts.border) { g.strokeStyle = opts.border; g.lineWidth = opts.h * 0.03; g.strokeRect(0, 0, opts.w, opts.h); }
  for (const l of opts.lines) {
    g.fillStyle = l.color;
    g.font = `${l.weight ?? 900} ${l.size}px "Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(l.text, opts.w / 2, l.y);
  }
  // weathering
  const N = new TileNoise(opts.w + opts.h);
  const img = g.getImageData(0, 0, opts.w, opts.h);
  for (let y = 0; y < opts.h; y += 1) for (let x = 0; x < opts.w; x += 1) {
    const i = (y * opts.w + x) * 4, k = 0.9 + N.fbm(x / opts.w, y / opts.h, 6, 3) * 0.12 - (y / opts.h) * 0.05;
    img.data[i] *= k; img.data[i + 1] *= k; img.data[i + 2] *= k;
  }
  g.putImageData(img, 0, 0);
  return toTexture(c, true, false);
}

/** Residential facade: storeys of windows with frames, AC units, balcony rails. Tile = 1 bay x 1 storey. */
export function facade(style: { wall: RGB; accent: RGB; glass: RGB; seed: number }, size = 256): TexSet {
  const N = new TileNoise(style.seed), r = mulberry32(style.seed);
  const lit = r();
  const set = buildSet(size, (u, v) => {
    const n = N.fbm(u, v, 8, 3);
    const inWin = u > 0.18 && u < 0.82 && v > 0.22 && v < 0.78;
    const frame = inWin && (u < 0.2 || u > 0.8 || v < 0.24 || v > 0.76 || Math.abs(u - 0.5) < 0.012);
    const slab = v > 0.9;
    const ac = u > 0.84 && u < 0.98 && v > 0.62 && v < 0.8;
    let c: RGB = style.wall, h = 0, rr = 0.85;
    if (slab) c = style.accent;
    if (inWin) {
      const sky = 1 - v; c = mix(style.glass, [200, 210, 225], sky * 0.5 + (lit > 0.5 ? 0.1 : 0)); rr = 0.08; h = -0.5;
      if (Math.abs(u - 0.35 - n * 0.1) < 0.08 && v > 0.3) c = mix(c, [220, 214, 200], 0.35); // curtain
    }
    if (frame) { c = [215, 215, 210]; rr = 0.5; h = 0; }
    if (ac) { c = [228, 228, 224]; h = 0.6; rr = 0.6; }
    const k = 0.92 + n * 0.12 - (v < 0.05 ? 0.1 : 0);
    return { c: [c[0] * k, c[1] * k, c[2] * k], h, r: rr };
  }, 2);
  return set;
}

export function cloudDome(size = 1024): THREE.Texture {
  const N = new TileNoise(77);
  const c = canvas(size, size / 2), g = c.getContext('2d')!;
  const img = g.createImageData(size, size / 2);
  for (let y = 0; y < size / 2; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / (size / 2);
    const lat = 1 - v; // 1 = zenith
    const f = N.fbm(u * 1.0, v * 0.5, 6, 6);
    const band = Math.exp(-Math.pow((lat - 0.22) / 0.16, 2)); // clouds bunch toward the horizon
    const d = clamp((f - 0.5) * 3.2) * (0.25 + band * 0.9) * clamp(lat * 12);
    const i = (y * size + x) * 4;
    const shade = 235 + f * 20;
    img.data[i] = shade; img.data[i + 1] = shade; img.data[i + 2] = shade + 4; img.data[i + 3] = d * 255;
  }
  g.putImageData(img, 0, 0);
  const t = toTexture(c, true);
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

export function faceTexture(kind: 'zhou' | 'li' | 'lin' | 'generic', seed = 1): THREE.Texture {
  // painted puppet face on a front-facing hemisphere UV (u: around head, v: up)
  const s = 256, c = canvas(s), g = c.getContext('2d')!;
  const r = mulberry32(seed);
  const skin = kind === 'zhou' ? '#b27a55' : kind === 'li' ? '#d19a72' : kind === 'lin' ? '#c98f68' : `hsl(${22 + r() * 8},${38 + r() * 10}%,${50 + r() * 10}%)`;
  g.fillStyle = skin; g.fillRect(0, 0, s, s);
  const N = new TileNoise(seed + 3);
  const img = g.getImageData(0, 0, s, s);
  for (let i = 0; i < s * s; i++) { const k = 0.94 + N.fbm((i % s) / s, Math.floor(i / s) / s, 16, 3) * 0.1; img.data[i * 4] *= k; img.data[i * 4 + 1] *= k; img.data[i * 4 + 2] *= k; }
  g.putImageData(img, 0, 0);
  // cheeks (sun-burnt for the veteran)
  g.fillStyle = kind === 'zhou' ? 'rgba(150,60,40,0.25)' : 'rgba(210,110,90,0.18)';
  g.beginPath(); g.ellipse(s * 0.36, s * 0.47, 14, 9, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(s * 0.64, s * 0.47, 14, 9, 0, 0, 7); g.fill();
  // brows
  g.strokeStyle = kind === 'zhou' ? '#3a3330' : '#1c1612'; g.lineWidth = kind === 'zhou' ? 5 : 4; g.lineCap = 'round';
  g.beginPath(); g.moveTo(s * 0.38, s * 0.39); g.quadraticCurveTo(s * 0.43, s * 0.365, s * 0.47, s * 0.385); g.stroke();
  g.beginPath(); g.moveTo(s * 0.53, s * 0.385); g.quadraticCurveTo(s * 0.57, s * 0.365, s * 0.62, s * 0.39); g.stroke();
  // mouth
  g.strokeStyle = '#6a3a2c'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(s * 0.46, s * 0.6); g.quadraticCurveTo(s * 0.5, s * 0.615, s * 0.54, s * 0.6); g.stroke();
  if (kind === 'zhou') {
    // stubble + moustache + forehead lines
    g.fillStyle = 'rgba(40,36,34,0.55)'; g.beginPath(); g.ellipse(s * 0.5, s * 0.575, 20, 5, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(40,36,34,0.12)';
    for (let i = 0; i < 400; i++) { const a = r() * Math.PI, rr = 30 + r() * 12; g.fillRect(s * 0.5 + Math.cos(a) * rr * 0.9, s * 0.55 + Math.sin(a) * rr * 0.55, 1.5, 1.5); }
    g.strokeStyle = 'rgba(90,50,35,0.35)'; g.lineWidth = 1.5;
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(s * 0.4, s * (0.3 - k * 0.025)); g.quadraticCurveTo(s * 0.5, s * (0.29 - k * 0.025), s * 0.6, s * (0.3 - k * 0.025)); g.stroke(); }
  }
  return toTexture(c, true, false);
}
```

### 24/33 · `dingge-source/src/world/building.ts`
<!-- casebook-file {"path": "dingge-source/src/world/building.ts", "lines": 272, "final_newline": true, "sha256": "3e598d58fc6a89ef401e25dc3098912f0c1d8611236e9ef4266e0d2bbca10377", "original_sha256": "3e598d58fc6a89ef401e25dc3098912f0c1d8611236e9ef4266e0d2bbca10377"} -->
```ts
import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { materials } from '../materials/library';
import { mulberry32 } from '../core/math';

// Six-storey RC frame under construction:
//  1F–4F poured (1F–2F brick infill in progress), 5F storey filled with shoring under the 6F formwork deck,
//  6F deck: film-faced plywood + two-layer rebar mesh + column starter cages, south edge guarded by rails.

export interface BuildingParts {
  gapTopRail: THREE.Mesh; gapMidRail: THREE.Mesh;   // the bay 小李 removes
  hoistCage: THREE.Group;
  lifeRing: THREE.Mesh;
  deckRebar: THREE.Group;   // LOD: visible when camera < ~35m
}

export function buildBuilding(b: Builder, root: THREE.Group): BuildingParts {
  const rnd = mulberry32(42);
  const { floorH: H, bx0, bx1, bz0, bz1, col } = L;

  // ---------------- ground slab / foundation plinth
  b.boxMM('concreteOld', bx0 - 0.3, -0.4, bz0 - 0.3, bx1 + 0.3, 0.15, bz1 + 0.3);

  // ---------------- columns (1F..5F) with slight per-pour tone breaks
  for (const x of L.colX) for (const z of L.colZ) for (let s = 0; s < 5; s++) {
    b.box(s % 2 ? 'concrete' : 'concreteDark', x, s * H + H / 2 + 0.075, z, col, H - 0.15, col, 0, 'column');
  }

  // ---------------- poured slabs + downstand beams
  for (let k = 1; k <= L.pouredLevels; k++) {
    const y = k * H;
    b.boxMM('concrete', bx0, y - L.slab, bz0, bx1, y, bz1);
    for (const z of L.colZ) b.box('concreteDark', 0, y - L.slab - 0.2, z, bx1 - bx0, 0.4, 0.25);
    for (const x of L.colX) b.box('concreteDark', x, y - L.slab - 0.2, 0, 0.25, 0.4, bz1 - bz0);
    // slab edge drip + slight lip
    b.boxMM('concreteOld', bx0 - 0.02, y - 0.16, bz1 - 0.01, bx1 + 0.02, y - 0.1, bz1 + 0.02);
  }

  // ---------------- brick infill on 1F/2F (window openings 1.8 x 1.5, sill 0.9)
  const wallBay = (x0: number, x1: number, z0: number, z1: number, y0: number, opening: boolean) => {
    const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    const len = alongX ? x1 - x0 : z1 - z0, t = 0.2, h = H - 0.5;
    const c = alongX ? (z0 + z1) / 2 : (x0 + x1) / 2;
    const seg = (a: number, bb: number, ya: number, yb: number) => {
      if (bb - a < 0.01 || yb - ya < 0.01) return;
      if (alongX) b.boxMM('brick', x0 + a, y0 + ya, c - t / 2, x0 + bb, y0 + yb, c + t / 2);
      else b.boxMM('brick', c - t / 2, y0 + ya, z0 + a, c + t / 2, y0 + yb, z0 + bb);
    };
    if (!opening) { seg(0, len, 0, h); return; }
    const w0 = len / 2 - 0.9, w1 = len / 2 + 0.9;
    seg(0, w0, 0, h); seg(w1, len, 0, h); seg(w0, w1, 0, 0.9); seg(w0, w1, 2.4, h);
    // precast lintel
    if (alongX) b.boxMM('concreteDark', x0 + w0 - 0.2, y0 + 2.4, c - t / 2 - 0.005, x0 + w1 + 0.2, y0 + 2.6, c + t / 2 + 0.005);
    else b.boxMM('concreteDark', c - t / 2 - 0.005, y0 + 2.4, z0 + w0 - 0.2, c + t / 2 + 0.005, y0 + 2.6, z0 + w1 + 0.2);
  };
  for (let s = 0; s < 2; s++) {
    const y0 = s * H + 0.15;
    const xs = L.colX, zs = L.colZ;
    for (let i = 0; i < xs.length - 1; i++) {
      const xa = xs[i] + col / 2, xb = xs[i + 1] - col / 2;
      wallBay(xa, xb, bz0 + 0.15, bz0 + 0.15, y0, true);                  // north
      if (s === 0 || i < 3) wallBay(xa, xb, bz1 - 0.15, bz1 - 0.15, y0, true); // south (2F partly done)
    }
    for (let j = 0; j < zs.length - 1; j++) {
      const za = zs[j] + col / 2, zb = zs[j + 1] - col / 2;
      wallBay(bx0 + 0.15, bx0 + 0.15, za, zb, y0, j === 0);
      wallBay(bx1 - 0.15, bx1 - 0.15, za, zb, y0, j === 1);
    }
  }
  // unfinished courses on 2F south, bays 3..4: a few stepped courses + mortar tub
  for (let c = 0; c < 6; c++) b.boxMM('brick', L.colX[3] + col / 2, H + 0.15, bz1 - 0.25, L.colX[3] + col / 2 + 5.5 - c * 0.24, H + 0.15 + (c + 1) * 0.063, bz1 - 0.05);

  // ---------------- 5F storey shoring (满堂支撑架) under the 6F deck
  const y0 = 4 * H, yDeck = L.deckY;
  for (let x = bx0 + 0.6; x < bx1 - 0.3; x += 1.2) for (let z = bz0 + 0.6; z < bz1 - 0.3; z += 1.2) {
    b.tube('galv', [x, y0, z], [x, yDeck - 0.2, z], 0.024, 5);
    b.box('steelDark', x, yDeck - 0.19, z, 0.14, 0.02, 0.14); // U-head jack
  }
  for (const hy of [y0 + 0.3, y0 + 1.8]) {
    for (let x = bx0 + 0.6; x < bx1 - 0.3; x += 1.2) b.tube('galv', [x, hy, bz0 + 0.5], [x, hy, bz1 - 0.5], 0.024, 5);
    for (let z = bz0 + 0.6; z < bz1 - 0.3; z += 1.2) b.tube('galv', [bx0 + 0.5, hy + 0.05, z], [bx1 - 0.5, hy + 0.05, z], 0.024, 5);
  }
  // main steel pipes (double) + timber joists (木方 50x100 @300) under plywood
  for (let x = bx0 + 0.6; x < bx1 - 0.3; x += 1.2) {
    b.tube('galv', [x - 0.03, yDeck - 0.15, bz0 + 0.1], [x - 0.03, yDeck - 0.15, bz1 - 0.1], 0.024, 5);
    b.tube('galv', [x + 0.03, yDeck - 0.15, bz0 + 0.1], [x + 0.03, yDeck - 0.15, bz1 - 0.1], 0.024, 5);
  }
  for (let z = bz0 + 0.15; z < bz1; z += 0.3) b.boxMM('timber', bx0 + 0.05, yDeck - 0.118, z - 0.025, bx1 - 0.05, yDeck - 0.018, z + 0.025);
  // plywood deck + beam boxes
  b.boxMM('plywood', bx0, yDeck - 0.018, bz0, bx1, yDeck - 0.001, bz1);
  // edge form (side board) on the perimeter
  b.boxMM('plywood', bx0 - 0.02, yDeck - 0.5, bz1, bx1 + 0.02, yDeck + 0.15, bz1 + 0.02, 'edgeForm');
  b.boxMM('plywood', bx0 - 0.02, yDeck - 0.5, bz0 - 0.02, bx1 + 0.02, yDeck + 0.15, bz0);
  b.boxMM('plywood', bx0 - 0.02, yDeck - 0.5, bz0, bx0, yDeck + 0.15, bz1);
  b.boxMM('plywood', bx1, yDeck - 0.5, bz0, bx1 + 0.02, yDeck + 0.15, bz1);

  // ---------------- two-layer rebar mesh on the deck (Ø10 @200).
  // Whole deck: painted mat (mipmapped, no moiré at distance). Action zone: real bars, shown only when the camera is close.
  b.boxMM('rebarDeck', bx0 + 0.02, yDeck, bz0 + 0.02, bx1 - 0.02, yDeck + 0.002, bz1 - 0.02);
  const rb = new Builder();
  const rr = 0.0065, zx0 = -1.2, zx1 = 12.2, zz0 = 0.6, zz1 = 6.96;
  const layers = [{ y: yDeck + 0.025 }, { y: L.standY - 0.012 }];
  layers.forEach((ly, li) => {
    for (let z = zz0 + 0.1; z < zz1; z += 0.2) rb.tube('rebar', [zx0, ly.y, z], [zx1, ly.y, z], rr, 4);
    for (let x = zx0 + 0.1; x < zx1; x += 0.2) rb.tube('rebar', [x, ly.y + rr * 2, zz0], [x, ly.y + rr * 2, zz1], rr, 4);
    if (li === 1) for (let x = zx0 + 0.5; x < zx1; x += 1.0) for (let z = zz0 + 0.5; z < zz1; z += 1.0) rb.box('orangePlastic', x + 0.1, ly.y - 0.03, z + 0.1, 0.04, 0.05, 0.04);
  });
  // tie-wire twists at a sparse set of intersections (readable in close-ups near 老周's position)
  for (let x = 3.1; x < 7.5; x += 0.2) for (let z = 3.3; z < 6.3; z += 0.2) if (rnd() < 0.55) rb.box('steelDark', x, L.standY - 0.002, z, 0.012, 0.006, 0.012);
  const deckRebar = rb.build('deckRebar');
  root.add(deckRebar);

  // ---------------- column starter cages (8 bars + stirrups @200)
  for (const x of L.colX) for (const z of L.colZ) {
    const hs = col / 2 - 0.04;
    const bars = [[-hs, -hs], [hs, -hs], [hs, hs], [-hs, hs], [0, -hs], [hs, 0], [0, hs], [-hs, 0]];
    for (const [dx, dz] of bars) b.tube('rebar', [x + dx, yDeck - 0.4, z + dz], [x + dx, L.cageTop + (dx === 0 || dz === 0 ? -0.05 : 0), z + dz], 0.011, 5);
    for (let y = yDeck + 0.15; y < L.cageTop - 0.1; y += 0.2) {
      const s = hs + 0.012;
      b.tube('rebar', [x - s, y, z - s], [x + s, y, z - s], 0.004, 3); b.tube('rebar', [x + s, y, z - s], [x + s, y, z + s], 0.004, 3);
      b.tube('rebar', [x + s, y, z + s], [x - s, y, z + s], 0.004, 3); b.tube('rebar', [x - s, y, z + s], [x - s, y, z - s], 0.004, 3);
    }
    b.colliders.push({ min: new THREE.Vector3(x - col / 2, yDeck, z - col / 2), max: new THREE.Vector3(x + col / 2, L.cageTop, z + col / 2), tag: 'cage' });
  }

  // ---------------- guardrails: 6F deck south edge + open slab edges at 3F/4F/5F
  const rails = (y: number, gap: boolean) => {
    for (const x of L.railPostXs) {
      b.tube('railRW', [x, y, L.railPostZ], [x, y + L.railTop + 0.05, L.railPostZ], 0.024, 6, gap ? 'railPost' : undefined);
      b.box('steelDark', x, y + 0.005, L.railPostZ, 0.16, 0.01, 0.16);
    }
    const xs = L.railPostXs;
    for (let i = 0; i < xs.length - 1; i++) {
      const xa = xs[i], xb = xs[i + 1];
      const isGap = gap && xa === L.gapX0;
      if (!isGap) {
        b.tube('railRW', [xa, y + L.railTop, L.railZ], [xb, y + L.railTop, L.railZ], 0.024, 6, gap ? 'railTop' : undefined);
        b.tube('railRW', [xa, y + L.railMid, L.railZ], [xb, y + L.railMid, L.railZ], 0.024, 6, gap ? 'railMid' : undefined);
      }
      // right-angle couplers
      b.box('steelDark', xa, y + L.railTop, L.railZ + 0.03, 0.09, 0.08, 0.07);
      b.box('steelDark', xa, y + L.railMid, L.railZ + 0.03, 0.09, 0.08, 0.07);
    }
    b.boxMM('toeYB', xs[0], y, L.toeZ - 0.012, xs[xs.length - 1], y + L.toeH, L.toeZ + 0.012, gap ? 'toeBoard' : undefined);
    // end returns
    b.tube('railRW', [xs[0], y + L.railTop, L.railZ], [L.bx0 + 0.3, y + L.railTop, L.railZ], 0.024);
    b.tube('railRW', [xs[xs.length - 1], y + L.railTop, L.railZ], [L.bx1 - 0.3, y + L.railTop, L.railZ], 0.024);
  };
  rails(L.deckY, true);
  rails(3 * H, false); rails(4 * H, false);

  const railMat = materials().railRW.mat;
  const railGeo = new THREE.CylinderGeometry(0.024, 0.024, L.gapX1 - L.gapX0, 8);
  railGeo.rotateZ(Math.PI / 2);
  const setRailUV = (g: THREE.BufferGeometry) => { const uv = g.getAttribute('uv'); for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getY(i) * 2.5, uv.getX(i) * 0.2); };
  setRailUV(railGeo);
  const gapTopRail = new THREE.Mesh(railGeo, railMat); gapTopRail.castShadow = gapTopRail.receiveShadow = true;
  const gapMidRail = new THREE.Mesh(railGeo, railMat); gapMidRail.castShadow = gapMidRail.receiveShadow = true;
  gapTopRail.name = 'gapTopRail'; gapMidRail.name = 'gapMidRail';
  root.add(gapTopRail, gapMidRail);

  // ---------------- lifeline: two braced stanchions + Ø8 wire rope with slight sag
  const lx = [L.lifeX0, L.lifeX1], ly = L.standY + L.lifeH;
  for (const x of lx) {
    b.tube('craneYellow', [x, L.deckY, L.lifeZ], [x, ly + 0.15, L.lifeZ], 0.04, 8, 'stanchion');
    b.box('steelDark', x, L.deckY + 0.01, L.lifeZ, 0.3, 0.02, 0.3);
    const dir = x < 5 ? -1 : 1;
    b.tube('craneYellow', [x, ly - 0.2, L.lifeZ], [x + dir * 1.1, L.deckY + 0.02, L.lifeZ], 0.022, 6);
    b.tube('craneYellow', [x, ly - 0.4, L.lifeZ], [x, L.deckY + 0.02, L.lifeZ - 1.0], 0.022, 6);
    b.tube('craneYellow', [x, ly - 0.4, L.lifeZ], [x, L.deckY + 0.02, L.lifeZ + 1.0], 0.022, 6);
    b.box('steelDark', x, ly + 0.02, L.lifeZ, 0.12, 0.1, 0.12);
  }
  const segs = 24;
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs, t1 = (i + 1) / segs;
    const sag = (t: number) => -0.06 * 4 * t * (1 - t);
    b.tube('cable', [L.lifeX0 + (L.lifeX1 - L.lifeX0) * t0, ly + sag(t0), L.lifeZ], [L.lifeX0 + (L.lifeX1 - L.lifeX0) * t1, ly + sag(t1), L.lifeZ], 0.004, 4);
  }
  // wire-rope clips and turnbuckle
  for (const x of [L.lifeX0 + 0.25, L.lifeX0 + 0.45, L.lifeX1 - 0.3]) b.box('steelDark', x, ly - 0.005, L.lifeZ, 0.05, 0.035, 0.03);
  const lifeRing = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.007, 8, 20), materials().galv.mat);
  lifeRing.castShadow = true; lifeRing.name = 'lifeRing';
  root.add(lifeRing);

  // ---------------- load landing sleepers (timber) where the crane sets the rebar bundle
  for (const dx of [-2.2, 0, 2.2]) b.boxMM('timber', L.landX + dx - 0.06, L.standY - 0.01, L.landZ - 0.6, L.landX + dx + 0.06, L.standY + 0.1, L.landZ + 0.6, 'sleeper');

  // ---------------- double-row scaffold with dense safety mesh
  scaffold(b);

  // ---------------- construction hoist (施工升降机) on the south face at x=10.5
  const hx = 10.5, hz = L.bz1 + 1.6;
  const mastTop = 21;
  for (const [dx, dz] of [[-0.325, -0.325], [0.325, -0.325], [0.325, 0.325], [-0.325, 0.325]]) b.tube('craneWhite', [hx + dx, 0, hz + dz], [hx + dx, mastTop, hz + dz], 0.038, 6);
  for (let y = 0.5; y < mastTop; y += 0.75) {
    b.tube('craneWhite', [hx - 0.325, y, hz - 0.325], [hx + 0.325, y + 0.37, hz - 0.325], 0.012, 4);
    b.tube('craneWhite', [hx - 0.325, y, hz + 0.325], [hx + 0.325, y + 0.37, hz + 0.325], 0.012, 4);
    b.tube('craneWhite', [hx - 0.325, y + 0.37, hz - 0.325], [hx - 0.325, y + 0.75, hz + 0.325], 0.012, 4);
    b.tube('craneWhite', [hx + 0.325, y + 0.37, hz - 0.325], [hx + 0.325, y + 0.75, hz + 0.325], 0.012, 4);
  }
  // rack
  b.boxMM('steelDark', hx + 0.36, 0, hz - 0.04, hx + 0.4, mastTop, hz + 0.04);
  // base enclosure
  const bx = hx, bz = hz + 1.2;
  for (const [x0, z0, x1, z1] of [[bx - 2, bz - 0.2, bx + 2, bz - 0.15], [bx - 2, bz + 1.45, bx + 2, bz + 1.5], [bx + 1.95, bz - 0.2, bx + 2, bz + 1.5]]) b.boxMM('galv', x0, 0.15, z0, x1, 2.1, z1);
  // floor landings with gates at 1..5
  for (let k = 1; k <= 4; k++) {
    const y = k * H;
    b.boxMM('timber', hx - 1.4, y - 0.05, L.bz1, hx + 1.4, y, hz + 0.3);
    b.boxMM('orangePlastic', hx - 0.8, y, hz + 0.28, hx + 0.8, y + 1.8, hz + 0.32);
  }
  // tie-ins
  for (let y = 4.5; y < mastTop; y += 6) b.tube('craneWhite', [hx, y, hz - 0.33], [hx, y, L.bz1], 0.05);
  const hoistCage = new THREE.Group(); hoistCage.name = 'hoistCage';
  {
    const cb = new Builder();
    cb.boxMM('containerWhite', -1.5, 0, 0.45, 1.5, 0.15, 1.95);               // floor
    cb.boxMM('containerWhite', -1.5, 2.5, 0.45, 1.5, 2.6, 1.95);            // roof
    for (const x of [-1.5, 1.5]) for (const z of [0.45, 1.95]) cb.boxMM('craneYellow', x - 0.04, 0, z - 0.04, x + 0.04, 2.6, z + 0.04);
    cb.boxMM('greenMesh', -1.5, 0.15, 1.94, 1.5, 2.5, 1.96);
    cb.boxMM('greenMesh', -1.5, 0.15, 0.44, -0.4, 2.5, 0.46);
    cb.boxMM('craneYellow', -1.5, 1.0, 1.95, 1.5, 1.1, 2.0);
    cb.boxMM('containerBlue', -0.5, 2.6, 0.9, 0.5, 3.0, 1.5);                  // drive unit
    hoistCage.add(cb.build('hoistCage'));
  }
  hoistCage.position.set(hx, 0, hz - 0.33);
  root.add(hoistCage);

  return { gapTopRail, gapMidRail, hoistCage, lifeRing, deckRebar };
}

function scaffold(b: Builder) {
  const { bx0, bx1, bz0, bz1 } = L;
  const inner = 0.35, rowGap = 1.05, bay = 1.5, lift = 1.8;
  type Face = { a: THREE.Vector3; dir: THREE.Vector3; out: THREE.Vector3; len: number; top: number };
  const faces: Face[] = [
    { a: new THREE.Vector3(bx0 - inner - rowGap, 0, bz0 - inner), dir: new THREE.Vector3(1, 0, 0), out: new THREE.Vector3(0, 0, -1), len: bx1 - bx0 + 2 * (inner + rowGap), top: 16.6 },
    { a: new THREE.Vector3(bx1 + inner, 0, bz0 - inner - rowGap), dir: new THREE.Vector3(0, 0, 1), out: new THREE.Vector3(1, 0, 0), len: bz1 - bz0 + 2 * (inner + rowGap), top: 16.6 },
    { a: new THREE.Vector3(bx0 - inner, 0, bz0 - inner - rowGap), dir: new THREE.Vector3(0, 0, 1), out: new THREE.Vector3(-1, 0, 0), len: bz1 - bz0 + 2 * (inner + rowGap), top: 16.6 },
    { a: new THREE.Vector3(bx0 - inner - rowGap, 0, bz1 + inner), dir: new THREE.Vector3(1, 0, 0), out: new THREE.Vector3(0, 0, 1), len: 13.5, top: 7.6 }, // south, west part only
  ];
  const P = (f: Face, s: number, row: number, y: number) => f.a.clone().addScaledVector(f.dir, s).addScaledVector(f.out, row * rowGap).setY(y);
  for (const f of faces) {
    const n = Math.floor(f.len / bay);
    for (let i = 0; i <= n; i++) for (const row of [0, 1]) {
      const p = P(f, i * bay, row, 0.05);
      b.tube('galv', p, P(f, i * bay, row, f.top + (row ? 1.2 : 0)), 0.024, 5);
      b.box('timber', p.x, 0.03, p.z, 0.25, 0.05, 0.25);
    }
    for (let y = 0.2; y <= f.top + 1.2; y += lift) for (const row of [0, 1]) {
      if (!row && y > f.top) continue;
      b.tube('galv', P(f, 0, row, y), P(f, n * bay, row, y), 0.024, 5);
      b.tube('galv', P(f, 0, row, y + 0.9), P(f, n * bay, row, y + 0.9), 0.02, 5).tube('galv', P(f, 0, 1, y + 0.45), P(f, n * bay, 1, y + 0.45), 0.02, 5);
    }
    for (let y = 0.2; y <= f.top; y += lift) for (let i = 0; i <= n; i++) b.tube('galv', P(f, i * bay, -0.2, y + 0.06), P(f, i * bay, 1.1, y + 0.06), 0.024, 5);
    // working platforms: steel planks on every other lift + toe board
    for (let y = 0.2 + lift * 2; y <= f.top; y += lift * 2) {
      const a = P(f, 0, 0, y + 0.1), c = P(f, n * bay, 1, y + 0.13);
      b.boxMM('galv', Math.min(a.x, c.x), y + 0.1, Math.min(a.z, c.z), Math.max(a.x, c.x), y + 0.13, Math.max(a.z, c.z));
    }
    // scissor bracing on the outer face
    for (let i = 0; i + 4 <= n; i += 4) for (let y = 0.2; y + lift * 3 <= f.top + 1.3; y += lift * 3) {
      b.tube('galv', P(f, i * bay, 1.03, y), P(f, (i + 4) * bay, 1.03, y + lift * 3), 0.022, 5);
      b.tube('galv', P(f, (i + 4) * bay, 1.05, y), P(f, i * bay, 1.05, y + lift * 3), 0.022, 5);
    }
    // dense mesh on the outer face
    const m0 = P(f, 0, 1.06, 0.4), m1 = P(f, n * bay, 1.06, f.top + 1.2);
    if (Math.abs(f.dir.x) > 0) b.boxMM('greenMesh', Math.min(m0.x, m1.x), 0.4, m0.z - 0.004, Math.max(m0.x, m1.x), f.top + 1.2, m0.z + 0.004);
    else b.boxMM('greenMesh', m0.x - 0.004, 0.4, Math.min(m0.z, m1.z), m0.x + 0.004, f.top + 1.2, Math.max(m0.z, m1.z));
  }
}
```

### 25/33 · `dingge-source/src/world/city.ts`
<!-- casebook-file {"path": "dingge-source/src/world/city.ts", "lines": 150, "final_newline": true, "sha256": "ad5e136782c7522863f73d2388171ff6b15baa01dc32273697ec55c5241181b6", "original_sha256": "ad5e136782c7522863f73d2388171ff6b15baa01dc32273697ec55c5241181b6"} -->
```ts
import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { mulberry32 } from '../core/math';
import type { MatKey } from '../materials/library';

// The surroundings that frame every exterior shot: ring roads with markings and street trees, then a believable
// Chinese residential district (6-storey walk-ups near, 18–33 storey towers behind), then fogged skyline + hills.
// Facade UVs are written per building (1 UV tile = 1 bay × 1 storey) so windows line up with floors.

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function facadeBox(b: Builder, key: MatKey, cx: number, cz: number, w: number, d: number, floors: number, fh = 3.0, bay = 3.3) {
  const h = floors * fh;
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.getAttribute('uv'), n = g.getAttribute('normal');
  for (let i = 0; i < uv.count; i++) {
    const ax = Math.abs(n.getX(i)), az = Math.abs(n.getZ(i));
    const span = ax > 0.5 ? d : az > 0.5 ? w : 0;
    if (span === 0) { uv.setXY(i, 0.05, 0.95); continue; } // roofs sample the slab band
    uv.setXY(i, uv.getX(i) * Math.max(1, Math.round(span / bay)), uv.getY(i) * floors);
  }
  b.geo(key, g, [cx, h / 2, cz], [0, 0, 0], [1, 1, 1], true);
  // roof: parapet + water tank + stair house
  b.boxMM('roofGrey', cx - w / 2, h, cz - d / 2, cx + w / 2, h + 0.05, cz + d / 2);
  b.boxMM('concreteOld', cx - w / 2, h, cz - d / 2, cx + w / 2, h + 1.1, cz - d / 2 + 0.2);
  b.boxMM('concreteOld', cx - w / 2, h, cz + d / 2 - 0.2, cx + w / 2, h + 1.1, cz + d / 2);
  b.boxMM('concreteOld', cx - w * 0.15, h, cz - d * 0.2, cx + w * 0.15, h + 3.0, cz + d * 0.2);
}

export function buildCity(b: Builder) {
  const r = mulberry32(99);
  const road = L.roadW, walk = 4;
  const ox0 = L.sx0 - walk, ox1 = L.sx1 + walk, oz0 = L.sz0 - walk, oz1 = L.sz1 + walk; // outer edge of pavements next to hoarding

  // ---------------- base ground to the horizon
  b.boxMM('grass', -1600, -0.35, -1600, 1600, -0.25, 1600);

  // pavements around the hoarding
  b.boxMM('paving', ox0, -0.2, oz1 - walk, ox1, 0.12, oz1);
  b.boxMM('paving', ox0, -0.2, oz0, ox1, 0.12, oz0 + walk);
  b.boxMM('paving', ox0, -0.2, oz0, ox0 + walk, 0.12, oz1);
  b.boxMM('paving', ox1 - walk, -0.2, oz0, ox1, 0.12, oz1);

  // ring roads (long straight roads extending to the fog so the edge of the world never shows)
  const R = 900;
  const roads: [number, number, number, number][] = [
    [-R, oz1, R, oz1 + road], [-R, oz0 - road, R, oz0],
    [ox0 - road, -R, ox0, R], [ox1, -R, ox1 + road, R],
  ];
  for (const [x0, z0, x1, z1] of roads) b.boxMM('asphalt', x0, -0.25, z0, x1, 0.0, z1);
  // kerbs + far pavements
  b.boxMM('kerb', -R, -0.2, oz1 + road, R, 0.15, oz1 + road + 0.2).boxMM('paving', -R, -0.2, oz1 + road + 0.2, R, 0.13, oz1 + road + walk);
  b.boxMM('kerb', -R, -0.2, oz0 - road - 0.2, R, 0.15, oz0 - road).boxMM('paving', -R, -0.2, oz0 - road - walk, R, 0.13, oz0 - road - 0.2);
  b.boxMM('kerb', ox0 - road - 0.2, -0.2, -R, ox0 - road, 0.15, R).boxMM('paving', ox0 - road - walk, -0.2, -R, ox0 - road - 0.2, 0.13, R);
  b.boxMM('kerb', ox1 + road, -0.2, -R, ox1 + road + 0.2, 0.15, R).boxMM('paving', ox1 + road + 0.2, -0.2, -R, ox1 + road + walk, 0.13, R);
  // lane markings: dashed white lanes, double yellow centre
  const dash = (a: THREE.Vector3, c: THREE.Vector3, key: MatKey, w = 0.15, dl = 4, gl = 6) => {
    const len = a.distanceTo(c), dir = c.clone().sub(a).normalize();
    for (let s = 0; s < len; s += dl + gl) {
      const p = a.clone().addScaledVector(dir, s), q = a.clone().addScaledVector(dir, Math.min(len, s + dl));
      const m = p.clone().add(q).multiplyScalar(0.5);
      b.box(key, m.x, 0.005, m.z, Math.abs(dir.x) * (dl) + w * Math.abs(dir.z), 0.01, Math.abs(dir.z) * dl + w * Math.abs(dir.x));
    }
  };
  const zc1 = oz1 + road / 2, zc0 = oz0 - road / 2, xc0 = ox0 - road / 2, xc1 = ox1 + road / 2;
  for (const zc of [zc1, zc0]) {
    b.boxMM('lineYellow', -R, 0.0, zc - 0.2, R, 0.01, zc - 0.08).boxMM('lineYellow', -R, 0.0, zc + 0.08, R, 0.01, zc + 0.2);
    dash(V(-R, 0, zc - road / 4), V(R, 0, zc - road / 4), 'lineWhite');
    dash(V(-R, 0, zc + road / 4), V(R, 0, zc + road / 4), 'lineWhite');
  }
  for (const xc of [xc0, xc1]) {
    b.boxMM('lineYellow', xc - 0.2, 0.0, -R, xc - 0.08, 0.01, R).boxMM('lineYellow', xc + 0.08, 0.0, -R, xc + 0.2, 0.01, R);
    dash(V(xc - road / 4, 0, -R), V(xc - road / 4, 0, R), 'lineWhite');
    dash(V(xc + road / 4, 0, -R), V(xc + road / 4, 0, R), 'lineWhite');
  }
  // zebra crossing at the gate
  for (let i = 0; i < 10; i++) b.boxMM('lineWhite', -27 + i * 0.8, 0.0, oz1 + 0.5, -26.5 + i * 0.8, 0.012, oz1 + road - 0.5);

  // ---------------- street trees + lamps along all four sides of the site
  const tree = (x: number, z: number, s: number) => {
    b.tube('bark', V(x, 0, z), V(x, 2.2 * s, z), 0.12 * s, 6);
    const k = r() < 0.5 ? 'treeLeaf' : 'treeLeaf2';
    for (let i = 0; i < 4; i++) {
      const g = new THREE.IcosahedronGeometry(1.3 * s * (0.8 + r() * 0.4), 0);
      b.geo(k, g, [x + (r() - 0.5) * 1.4 * s, (3.2 + r() * 1.4) * s, z + (r() - 0.5) * 1.4 * s], [r(), r(), r()]);
    }
    b.boxMM('concreteOld', x - 0.6, 0.12, z - 0.6, x + 0.6, 0.18, z + 0.6);
  };
  const lamp = (x: number, z: number, dirx: number, dirz: number) => {
    b.tube('galv', V(x, 0, z), V(x, 8, z), 0.08, 8).tube('galv', V(x, 8, z), V(x + dirx * 1.6, 8.3, z + dirz * 1.6), 0.05, 6);
    b.box('lamp', x + dirx * 1.7, 8.2, z + dirz * 1.7, 0.7, 0.12, 0.35);
  };
  for (let x = -R * 0.35; x < R * 0.35; x += 8) {
    if (x > -30 && x < -16) continue;
    tree(x, oz1 + road + 2, 0.9 + r() * 0.3); tree(x + 4, oz0 - road - 2, 0.9 + r() * 0.3);
    if (Math.round(x / 8) % 3 === 0) { lamp(x + 2, oz1 + road + 0.8, 0, -1); lamp(x + 2, oz0 - road - 0.8, 0, 1); }
  }
  for (let z = -R * 0.35; z < R * 0.35; z += 8) {
    tree(ox0 - road - 2, z, 0.9 + r() * 0.3); tree(ox1 + road + 2, z + 4, 0.9 + r() * 0.3);
    if (Math.round(z / 8) % 3 === 0) { lamp(ox0 - road - 0.8, z + 2, 1, 0); lamp(ox1 + road + 0.8, z + 2, -1, 0); }
  }
  // parked / queued cars on the far kerbs
  const carKeys: MatKey[] = ['containerWhite', 'blackMatte', 'galv', 'redPaint', 'containerBlue', 'containerWhite'];
  const car = (x: number, z: number, yaw: number) => {
    const k = carKeys[Math.floor(r() * carKeys.length)];
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const P = (lx: number, lz: number) => [x + lx * c + lz * s, z - lx * s + lz * c];
    let p = P(0, 0); b.box(k, p[0], 0.62, p[1], 4.5, 0.7, 1.8, yaw);
    p = P(-0.2, 0); b.box('glass', p[0], 1.2, p[1], 2.4, 0.55, 1.62, yaw);
    for (const lx of [-1.45, 1.45]) for (const lz of [-0.8, 0.8]) { p = P(lx, lz); const w = new THREE.CylinderGeometry(0.33, 0.33, 0.22, 12); w.rotateX(Math.PI / 2); b.geo('rubber', w, [p[0], 0.33, p[1]], [0, yaw, 0]); }
  };
  for (let x = -200; x < 200; x += 5.5 + r() * 9) if (Math.abs(x + 23) > 10) car(x, oz1 + road - 1.6, 0);
  for (let x = -200; x < 200; x += 5.5 + r() * 12) car(x, oz0 - road + 1.6, Math.PI);
  for (let z = -150; z < 150; z += 6 + r() * 12) { car(ox1 + road - 1.6, z, -Math.PI / 2); car(ox0 - road + 1.6, z, Math.PI / 2); }

  // ---------------- residential blocks
  const keys: MatKey[] = ['facadeA', 'facadeB', 'facadeC', 'facadeD'];
  const occupied: [number, number, number, number][] = [[ox0 - road - walk - 2, oz0 - road - walk - 2, ox1 + road + walk + 2, oz1 + road + walk + 2]];
  const free = (x0: number, z0: number, x1: number, z1: number) => !occupied.some(o => x1 > o[0] && x0 < o[2] && z1 > o[1] && z0 < o[3]);
  let tries = 0;
  while (tries++ < 2600) {
    const ang = r() * Math.PI * 2, dist = 30 + Math.pow(r(), 0.8) * 520;
    const cx = Math.cos(ang) * dist + (r() - 0.5) * 20, cz = Math.sin(ang) * dist;
    const tall = dist > 110 && r() < 0.55;
    const floors = tall ? 18 + Math.floor(r() * 16) : 5 + Math.floor(r() * 3);
    const w = tall ? 16 + r() * 18 : 30 + r() * 30, d = tall ? 14 + r() * 6 : 11 + r() * 3;
    const rot = r() < 0.5;
    const W = rot ? d : w, D = rot ? w : d;
    const pad = tall ? 16 : 10;
    if (!free(cx - W / 2 - pad, cz - D / 2 - pad, cx + W / 2 + pad, cz + D / 2 + pad)) continue;
    occupied.push([cx - W / 2 - pad / 2, cz - D / 2 - pad / 2, cx + W / 2 + pad / 2, cz + D / 2 + pad / 2]);
    facadeBox(b, keys[Math.floor(r() * keys.length)], cx, cz, W, D, floors);
    // ground-floor paving pad + a couple of trees for the yard
    b.boxMM('paving', cx - W / 2 - 3, -0.25, cz - D / 2 - 3, cx + W / 2 + 3, 0.02, cz + D / 2 + 3);
    if (dist < 260) for (let i = 0; i < 3; i++) tree(cx + (r() - 0.5) * (W + 10), cz + (rot ? 1 : -1) * (D / 2 + 5), 0.8 + r() * 0.4);
  }

  // ---------------- far skyline + hills (fog does the rest)
  for (let i = 0; i < 90; i++) {
    const ang = (i / 90) * Math.PI * 2 + r() * 0.05, dist = 700 + r() * 350;
    const h = 30 + r() * 90, w = 20 + r() * 40;
    b.box('concreteOld', Math.cos(ang) * dist, h / 2, Math.sin(ang) * dist, w, h, w * 0.7, ang);
  }
  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 2 + r(), dist = 1300 + r() * 200;
    const g = new THREE.SphereGeometry(1, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    b.geo('treeLeaf2', g, [Math.cos(ang) * dist, -10, Math.sin(ang) * dist], [0, 0, 0], [260 + r() * 200, 90 + r() * 120, 200 + r() * 100]);
  }
}
```

### 26/33 · `dingge-source/src/world/crane.ts`
<!-- casebook-file {"path": "dingge-source/src/world/crane.ts", "lines": 200, "final_newline": true, "sha256": "c8e4ac5f294a572298d8e4b8ed1f046f3497f95fca6f73733a89395311f1906b", "original_sha256": "c8e4ac5f294a572298d8e4b8ed1f046f3497f95fca6f73733a89395311f1906b"} -->
```ts
import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { materials } from '../materials/library';
import { signPanel } from '../materials/textures';

// Hammerhead tower crane (QTZ-class): lattice mast, slewing unit + cab, A-frame tower head,
// triangular jib with trolley, counter-jib with ballast and winch, pendant tie bars, 4-fall hoist rope, hook block,
// two-leg sling carrying a rebar bundle (多点起吊 per 十不吊 #3).

export interface CraneRig {
  group: THREE.Group;
  setState(s: { slew: number; trolley: number; hookY: number; swing?: number; loadAttached?: boolean }): void;
  hookWorld: THREE.Vector3;
  loadGroup: THREE.Group;
  /** slew angle that points the jib at world (x,z), and the trolley radius needed */
  aim(x: number, z: number): { slew: number; radius: number };
}

function lattice(b: Builder, key: 'craneYellow' | 'craneWhite', a: THREE.Vector3, c: THREE.Vector3, r = 0.03) { b.tube(key, a, c, r, 5); }

export function buildCrane(root: THREE.Group): CraneRig {
  const group = new THREE.Group(); group.name = 'crane';
  group.position.set(L.craneX, 0, L.craneZ);
  root.add(group);
  const M = materials();

  // ---------------- static mast
  const sb = new Builder();
  const w = L.mast / 2, top = L.craneJibY - 3.2, sec = 2.8;
  sb.boxMM('concreteOld', -3.5, -0.2, -3.5, 3.5, 0.6, 3.5); // foundation block
  for (const [x, z] of [[-w, -w], [w, -w], [w, w], [-w, w]]) sb.box('craneYellow', x, top / 2 + 0.6, z, 0.14, top, 0.14);
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  for (let y = 0.6; y < top; y += sec) {
    const y1 = Math.min(y + sec, top);
    const faces: [THREE.Vector3, THREE.Vector3][] = [[V(-w, 0, -w), V(w, 0, -w)], [V(w, 0, -w), V(w, 0, w)], [V(w, 0, w), V(-w, 0, w)], [V(-w, 0, w), V(-w, 0, -w)]];
    for (const [p, q] of faces) {
      lattice(sb, 'craneYellow', p.clone().setY(y), q.clone().setY(y), 0.035);
      lattice(sb, 'craneYellow', p.clone().setY(y), q.clone().setY((y + y1) / 2), 0.03);
      lattice(sb, 'craneYellow', q.clone().setY((y + y1) / 2), p.clone().setY(y1), 0.03);
    }
    // bolted splice plates
    for (const [x, z] of [[-w, -w], [w, -w], [w, w], [-w, w]]) sb.box('steelDark', x, y, z, 0.22, 0.12, 0.22);
  }
  // ladder + rest platforms inside mast
  for (let y = 1; y < top; y += 0.3) sb.box('steelDark', 0, y, -w + 0.25, 0.4, 0.02, 0.02);
  for (let y = 9; y < top; y += 9) sb.boxMM('galv', -w, y, -w, w, y + 0.03, w);
  // wall ties to the building (附着) at 12m and 24m
  for (const y of [12, 24]) {
    sb.tube('craneYellow', V(-w, y, w), V(-3, y, L.bz0 - 0.1 - L.craneZ), 0.06);
    sb.tube('craneYellow', V(w, y, w), V(3, y, L.bz0 - 0.1 - L.craneZ), 0.06);
    sb.boxMM('craneYellow', -w - 0.2, y - 0.2, -w - 0.2, w + 0.2, y + 0.2, w + 0.2);
  }
  group.add(sb.build('craneMast'));

  // ---------------- slewing assembly
  const slew = new THREE.Group(); slew.name = 'slew'; slew.position.y = top;
  group.add(slew);
  const b = new Builder();
  const J = L.craneJibLen, C = L.craneCounterLen;
  b.boxMM('craneYellow', -1.4, 0, -1.4, 1.4, 0.8, 1.4);          // slewing ring / turntable
  b.boxMM('steelDark', -1.1, -0.15, -1.1, 1.1, 0, 1.1);
  // platform + tower head A-frame (apex 7m above jib root)
  const jibY = 1.2, apexY = jibY + 7.2;
  for (const [x, z] of [[-w, -w], [w, -w], [w, w], [-w, w]]) lattice(b, 'craneYellow', V(x, 0.8, z), V(0, apexY, 0), 0.08);
  for (let y = 2.5; y < apexY - 1; y += 1.8) {
    const s = w * (1 - (y - 0.8) / (apexY - 0.8));
    for (const [p, q] of [[V(-s, y, -s), V(s, y, -s)], [V(s, y, -s), V(s, y, s)], [V(s, y, s), V(-s, y, s)], [V(-s, y, s), V(-s, y, -s)]]) lattice(b, 'craneYellow', p, q, 0.03);
  }
  b.box('steelDark', 0, apexY + 0.2, 0, 0.5, 0.4, 0.5);
  // jib: triangular, bottom chords at z=±0.6, top chord at y+1.25
  const bz = 0.6, jh = 1.25, panel = 1.25;
  const bot1 = (x: number) => V(x, jibY, -bz), bot2 = (x: number) => V(x, jibY, bz), topc = (x: number) => V(x, jibY + jh * (1 - 0.35 * Math.max(0, (x - J * 0.6) / (J * 0.4))), 0);
  b.box('craneYellow', w + J / 2, jibY, -bz, J, 0.12, 0.12); b.box('craneYellow', w + J / 2, jibY, bz, J, 0.12, 0.12);
  for (let x = w; x < w + J; x += panel) {
    const x1 = Math.min(x + panel, w + J);
    lattice(b, 'craneYellow', topc(x), topc(x1), 0.05);
    lattice(b, 'craneYellow', bot1(x), topc((x + x1) / 2), 0.025); lattice(b, 'craneYellow', topc((x + x1) / 2), bot1(x1), 0.025);
    lattice(b, 'craneYellow', bot2(x), topc((x + x1) / 2), 0.025); lattice(b, 'craneYellow', topc((x + x1) / 2), bot2(x1), 0.025);
    lattice(b, 'craneYellow', bot1(x), bot2(x), 0.022);
    if (((x - w) / panel) % 2 < 1) lattice(b, 'craneYellow', bot1(x), bot2(x1), 0.02);
  }
  // red/white tip + jib-end buffer
  b.box('redPaint', w + J, jibY + 0.4, 0, 0.3, 1.0, 1.4);
  // counter-jib: flat twin girders, walkway, ballast, winch, slogan banner
  b.box('craneYellow', -w - C / 2, jibY, -1.0, C, 0.35, 0.18); b.box('craneYellow', -w - C / 2, jibY, 1.0, C, 0.35, 0.18);
  for (let x = -w; x > -w - C; x -= 1.5) { lattice(b, 'craneYellow', V(x, jibY, -1.0), V(x, jibY, 1.0), 0.04); lattice(b, 'craneYellow', V(x, jibY, -1.0), V(x - 1.5, jibY, 1.0), 0.03); }
  b.boxMM('galv', -w - C, jibY + 0.18, -0.9, -w, jibY + 0.21, 0.9);
  for (let i = 0; i < 4; i++) b.boxMM('concreteOld', -w - C + 0.2 + i * 0.62, jibY - 1.8, -0.8, -w - C + 0.78 + i * 0.62, jibY + 0.1, 0.8);
  b.boxMM('containerBlue', -w - 6.5, jibY + 0.2, -0.7, -w - 3.5, jibY + 1.4, 0.7);      // hoist winch housing
  b.tube('steelDark', V(-w - 5.9, jibY + 0.8, -0.72), V(-w - 5.9, jibY + 0.8, 0.72), 0.35, 12); // drum
  // handrails along counter-jib
  for (const z of [-1.05, 1.05]) { b.tube('craneYellow', V(-w, jibY + 1.1, z), V(-w - C, jibY + 1.1, z), 0.02); for (let x = -w; x > -w - C; x -= 1.5) b.tube('craneYellow', V(x, jibY, z), V(x, jibY + 1.1, z), 0.018); }
  // pendant tie bars
  lattice(b, 'craneYellow', V(0, apexY, 0), topc(w + 19), 0.05);
  lattice(b, 'craneYellow', V(0, apexY, 0), topc(w + 37), 0.045);
  lattice(b, 'craneYellow', V(0, apexY, 0.1), V(-w - C + 0.5, jibY + 0.2, 0.9), 0.05);
  lattice(b, 'craneYellow', V(0, apexY, -0.1), V(-w - C + 0.5, jibY + 0.2, -0.9), 0.05);
  // operator cab on the +z side of the turntable
  b.boxMM('craneWhite', 0.2, 0.2, 1.4, 2.6, 2.6, 3.2);
  b.boxMM('glass', 2.6, 0.7, 1.5, 2.62, 2.5, 3.1);
  b.boxMM('glass', 0.3, 0.7, 3.2, 2.5, 2.5, 3.22);
  b.boxMM('galv', -0.2, 0.15, 1.4, 2.8, 0.2, 3.5);
  slew.add(b.build('craneSlew'));

  // banner on counter-jib
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(C * 0.7, 1.4), new THREE.MeshStandardMaterial({ map: signPanel({ w: 1024, h: 160, bg: '#c62828', lines: [{ text: '安全第一  预防为主', color: '#ffffff', size: 110, y: 82 }] }), roughness: 0.7, side: THREE.DoubleSide }));
  banner.position.set(-w - C / 2 - 0.8, jibY + 1.9, 1.08); banner.castShadow = true;
  slew.add(banner);
  const banner2 = banner.clone(); banner2.position.z = -1.08; banner2.rotation.y = Math.PI; slew.add(banner2);

  // warning light at apex
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshStandardMaterial({ color: 0xff3020, emissive: 0xff2010, emissiveIntensity: 1.5 }));
  beacon.position.set(0, apexY + 0.55, 0); slew.add(beacon);

  // ---------------- trolley, ropes, hook block, load
  const trolley = new THREE.Group(); trolley.name = 'trolley';
  {
    const tb = new Builder();
    tb.boxMM('craneYellow', -0.7, -0.35, -0.75, 0.7, -0.05, 0.75);
    for (const x of [-0.5, 0.5]) for (const z of [-0.6, 0.6]) tb.tube('steelDark', V(x, 0.0, z - 0.08), V(x, 0.0, z + 0.08), 0.1, 10);
    tb.tube('steelDark', V(0, -0.45, -0.3), V(0, -0.45, 0.3), 0.16, 12);
    trolley.add(tb.build('trolley'));
  }
  trolley.position.y = jibY - 0.06;
  slew.add(trolley);

  const ropeMat = M.cable.mat;
  const ropeGeo = new THREE.CylinderGeometry(0.009, 0.009, 1, 5); ropeGeo.translate(0, -0.5, 0);
  const ropes: THREE.Mesh[] = [];
  for (const dz of [-0.12, -0.04, 0.04, 0.12]) { const r = new THREE.Mesh(ropeGeo, ropeMat); r.position.set(0, -0.45, dz); r.castShadow = true; trolley.add(r); ropes.push(r); }

  const hook = new THREE.Group(); hook.name = 'hookBlock';
  {
    const hb = new Builder();
    hb.boxMM('craneYellow', -0.18, -0.25, -0.35, 0.18, 0.35, 0.35);
    hb.tube('steelDark', V(-0.2, 0.15, -0.28), V(-0.2, 0.15, 0.28), 0.14, 12);
    hb.box('redPaint', 0, -0.1, 0.36, 0.3, 0.3, 0.01);
    hb.tube('steelDark', V(0, -0.25, 0), V(0, -0.45, 0), 0.05, 8);
    const hookCurve = new THREE.TorusGeometry(0.12, 0.035, 8, 16, Math.PI * 1.5);
    hb.geo('steelDark', hookCurve, [0, -0.57, 0], [0, 0, Math.PI * 0.75]);
    hook.add(hb.build('hook'));
  }
  group.add(hook);

  const loadGroup = new THREE.Group(); loadGroup.name = 'load';
  {
    const lb = new Builder();
    // bundle of 24 x Ø25 bars, 6m, hexagonal-ish stacking, two tie wires
    let n = 0;
    for (let row = 0; row < 4; row++) for (let c = 0; c < 7 - (row % 2); c++) {
      if (n++ >= 24) break;
      const z = (c - 3 + (row % 2) * 0.5) * 0.052, y = row * 0.045;
      lb.tube('rebar', V(-3, y, z), V(3, y, z), 0.0125, 6);
    }
    for (const x of [-1.8, 1.8]) { lb.box('steelDark', x, 0.07, 0, 0.03, 0.2, 0.4); }
    loadGroup.add(lb.build('load'));
  }
  group.add(loadGroup);
  const slingGeo = new THREE.CylinderGeometry(0.012, 0.012, 1, 5); slingGeo.translate(0, 0.5, 0);
  const slings = [new THREE.Mesh(slingGeo, M.orangePlastic.mat), new THREE.Mesh(slingGeo, M.orangePlastic.mat)];
  slings.forEach(s => { s.castShadow = true; group.add(s); });

  const hookWorld = new THREE.Vector3();
  const tmp = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const pivot = new THREE.Vector3(L.craneX, 0, L.craneZ);
  const jibDir = new THREE.Vector3();

  function setState(s: { slew: number; trolley: number; hookY: number; swing?: number; loadAttached?: boolean }) {
    slew.rotation.y = s.slew;
    trolley.position.x = w + Math.max(2, Math.min(J - 1, s.trolley));
    const trolleyWorldY = top + jibY - 0.06 - 0.45;
    const ropeLen = Math.max(0.5, trolleyWorldY - (s.hookY + 0.35));
    ropes.forEach(r => (r.scale.y = ropeLen));
    jibDir.set(Math.cos(s.slew), 0, -Math.sin(s.slew));
    const sw = s.swing ?? 0;
    hook.position.set(jibDir.x * trolley.position.x + jibDir.z * sw, s.hookY, jibDir.z * trolley.position.x - jibDir.x * sw);
    hook.rotation.y = s.slew;
    hookWorld.copy(hook.position).add(pivot);
    // load hangs 2.6m under the hook on a two-leg sling, bundle axis along world x (landing orientation)
    const hookEye = hook.position.clone().add(tmp.set(0, -0.62, 0));
    loadGroup.position.set(hookEye.x, hookEye.y - 2.6, hookEye.z);
    loadGroup.rotation.y = 0;
    loadGroup.visible = s.loadAttached !== false;
    const ends = [new THREE.Vector3(-1.8, 0.14, 0), new THREE.Vector3(1.8, 0.14, 0)];
    slings.forEach((sl, i) => {
      sl.visible = loadGroup.visible;
      const a = ends[i].clone().add(loadGroup.position);
      const d = hookEye.clone().sub(a);
      sl.position.copy(a); sl.scale.set(1, d.length(), 1);
      sl.quaternion.setFromUnitVectors(up, d.normalize());
    });
  }
  function aim(x: number, z: number) {
    const dx = x - L.craneX, dz = z - L.craneZ;
    return { slew: Math.atan2(-dz, dx), radius: Math.hypot(dx, dz) - w };
  }
  setState({ slew: 0, trolley: 20, hookY: 20 });
  return { group, setState, hookWorld, loadGroup, aim };
}
```

### 27/33 · `dingge-source/src/world/geo.ts`
<!-- casebook-file {"path": "dingge-source/src/world/geo.ts", "lines": 101, "final_newline": true, "sha256": "5280b34f734411cba2094d7eed1ac4fce3d535cc0b0b245946e549b708f12d58", "original_sha256": "5280b34f734411cba2094d7eed1ac4fce3d535cc0b0b245946e549b708f12d58"} -->
```ts
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { materials, type MatKey } from '../materials/library';

// Static-geometry batcher. Every static piece of the site is pushed here, transformed into world space,
// given world-space box-projected UVs (so textures keep real-world scale), then merged per material.
// Result: thousands of tubes / bars / panels → a few dozen draw calls, which is what keeps the sandbox at 60fps.

export interface AABB { min: THREE.Vector3; max: THREE.Vector3; tag: string }

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0);

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const cylCache = new Map<number, THREE.CylinderGeometry>();
function unitCyl(seg: number) {
  if (!cylCache.has(seg)) cylCache.set(seg, new THREE.CylinderGeometry(1, 1, 1, seg, 1, false));
  return cylCache.get(seg)!;
}

export function worldUV(g: THREE.BufferGeometry, scale: number) {
  const p = g.getAttribute('position'), n = g.getAttribute('normal');
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u: number, v: number;
    if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); }
    else if (ax >= az) { u = p.getZ(i); v = p.getY(i); }
    else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u / scale; uv[i * 2 + 1] = v / scale;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

export class Builder {
  private parts = new Map<MatKey, THREE.BufferGeometry[]>();
  colliders: AABB[] = [];
  noShadow = new Set<MatKey>(['greenMesh', 'flatNet', 'lineWhite', 'lineYellow', 'dirt', 'asphalt', 'grass', 'paving', 'kerb', 'rebarDeck']);

  add(key: MatKey, geo: THREE.BufferGeometry, matrix?: THREE.Matrix4, keepUV = false) {
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (matrix) g.applyMatrix4(matrix);
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if (!keepUV || !g.getAttribute('uv')) worldUV(g, materials()[key].uvScale);
    if (!this.parts.has(key)) this.parts.set(key, []);
    this.parts.get(key)!.push(g);
    return this;
  }

  /** Axis-aligned box by centre & size, optional yaw. */
  box(key: MatKey, cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw = 0, collide?: string) {
    _q.setFromAxisAngle(UP, yaw);
    _m.compose(_v.set(cx, cy, cz), _q, _s.set(sx, sy, sz));
    this.add(key, unitBox, _m);
    if (collide && yaw === 0) this.colliders.push({ min: new THREE.Vector3(cx - sx / 2, cy - sy / 2, cz - sz / 2), max: new THREE.Vector3(cx + sx / 2, cy + sy / 2, cz + sz / 2), tag: collide });
    return this;
  }
  boxMM(key: MatKey, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, collide?: string) {
    return this.box(key, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0), 0, collide);
  }
  /** Cylinder between two points. */
  tube(key: MatKey, a: THREE.Vector3 | number[], b: THREE.Vector3 | number[], r: number, seg = 6, collide?: string) {
    const A = Array.isArray(a) ? new THREE.Vector3(a[0], a[1], a[2]) : a;
    const B = Array.isArray(b) ? new THREE.Vector3(b[0], b[1], b[2]) : b;
    const d = _v.subVectors(B, A); const len = d.length(); if (len < 1e-4) return this;
    _q.setFromUnitVectors(UP, d.normalize());
    const mid = A.clone().add(B).multiplyScalar(0.5);
    _m.compose(mid, _q, _s.set(r, len, r));
    this.add(key, unitCyl(seg), _m);
    if (collide) {
      this.colliders.push({ min: new THREE.Vector3(Math.min(A.x, B.x) - r, Math.min(A.y, B.y) - r, Math.min(A.z, B.z) - r), max: new THREE.Vector3(Math.max(A.x, B.x) + r, Math.max(A.y, B.y) + r, Math.max(A.z, B.z) + r), tag: collide });
    }
    return this;
  }
  geo(key: MatKey, g: THREE.BufferGeometry, pos: number[], rot: number[] = [0, 0, 0], scl: number[] = [1, 1, 1], keepUV = false) {
    _q.setFromEuler(new THREE.Euler(rot[0], rot[1], rot[2]));
    _m.compose(_v.set(pos[0], pos[1], pos[2]), _q, _s.set(scl[0], scl[1], scl[2]));
    return this.add(key, g, _m, keepUV);
  }

  build(name = 'static'): THREE.Group {
    const grp = new THREE.Group(); grp.name = name;
    const L = materials();
    for (const [key, list] of this.parts) {
      // merge in chunks to keep individual buffers reasonable
      for (let i = 0; i < list.length; i += 4000) {
        const merged = mergeGeometries(list.slice(i, i + 4000), false);
        if (!merged) continue;
        merged.computeBoundingSphere();
        const mesh = new THREE.Mesh(merged, L[key].mat);
        mesh.name = `${name}:${key}`;
        mesh.castShadow = !this.noShadow.has(key);
        mesh.receiveShadow = true;
        mesh.matrixAutoUpdate = false;
        grp.add(mesh);
      }
    }
    this.parts.clear();
    return grp;
  }
}
```

### 28/33 · `dingge-source/src/world/layout.ts`
<!-- casebook-file {"path": "dingge-source/src/world/layout.ts", "lines": 37, "final_newline": true, "sha256": "d07b8652f2462d16f184f2b4e579d37027be681fbf39e936fd52befd8a3370b1", "original_sha256": "d07b8652f2462d16f184f2b4e579d37027be681fbf39e936fd52befd8a3370b1"} -->
```ts
// Single source of truth for site dimensions (metres). Shots, takes, collision and props all read from here,
// so moving a column or the guardrail gap updates the whole film consistently.

export const L = {
  floorH: 3.0,
  bx0: -15, bx1: 15, bz0: -7, bz1: 7,          // building footprint
  colX: [-14.75, -9, -3, 3, 9, 14.75],
  colZ: [-6.75, 0, 6.75],
  col: 0.5,
  slab: 0.12,
  pouredLevels: 4,                              // slabs at y=3,6,9,12 are poured concrete
  deckY: 15.0,                                  // 6F formwork deck (plywood top)
  standY: 15.1,                                 // top of the rebar mesh = where feet stand
  cageTop: 17.2,                                // column starter cages above the deck

  // south-edge guardrail (JGJ 80-2016: top rail 1.2m, posts ≤2m, toe board ≥180mm)
  railPostZ: 6.92, railZ: 6.87, toeZ: 6.9,
  railTop: 1.2, railMid: 0.6, toeH: 0.18,
  railPostXs: [-14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14],
  gapX0: 4, gapX1: 6,                           // the bay 小李 opens

  // horizontal lifeline (steel wire rope) over the working area
  lifeZ: 4.8, lifeX0: 1.0, lifeX1: 11.0, lifeH: 2.0,

  // load landing sleepers
  landX: 5.5, landZ: 2.2,

  // tower crane
  craneX: 0, craneZ: -15, craneJibY: 36, craneJibLen: 50, craneCounterLen: 13, mast: 1.8,

  // site boundary (hoarding)
  sx0: -42, sx1: 42, sz0: -40, sz1: 26,
  hoardH: 2.5,
  roadW: 14,
};

export const edgeZ = L.bz1; // south slab edge (z = 7)
```

### 29/33 · `dingge-source/src/world/props.ts`
<!-- casebook-file {"path": "dingge-source/src/world/props.ts", "lines": 206, "final_newline": true, "sha256": "cb00f5582b99fdbf827c38f3cb854ccabe44a9812a950bfbf11a898a20fa74bf", "original_sha256": "cb00f5582b99fdbf827c38f3cb854ccabe44a9812a950bfbf11a898a20fa74bf"} -->
```ts
import * as THREE from 'three';
import { Builder } from './geo';
import { L } from './layout';
import { mulberry32 } from '../core/math';
import { signPanel } from '../materials/textures';
import { materials, type MatKey } from '../materials/library';

// Everything on the site that is not the building or the crane: ground, roads inside the hoarding,
// hoarding + gate + 五牌一图, container offices, rebar shed, material yard, covered spoil heaps, mixer truck,
// small props on the 6F deck. All static geometry goes through the Builder (merged per material).

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export interface PropParts { offcut: THREE.Mesh; signs: THREE.Group }

export function buildProps(b: Builder, root: THREE.Group): PropParts {
  const r = mulberry32(7);
  const { sx0, sx1, sz0, sz1 } = L;

  // ---------------- ground inside the site: compacted soil + hardened concrete haul road (文明施工要求道路硬化)
  b.boxMM('dirt', sx0, -0.2, sz0, sx1, 0, sz1);
  b.boxMM('concreteOld', -27, 0, 9, -19, 0.06, sz1);          // gate road
  b.boxMM('concreteOld', -27, 0, 9, 38, 0.06, 15);            // road along the south of the building
  b.boxMM('concreteOld', -27, 0, -40, -21, 0.06, 9);          // to the yard
  b.boxMM('concreteOld', -21, 0, -26, 38, 0.06, -20);         // north road under the crane
  // wheel-wash bay at the gate: grating + gutters
  b.boxMM('steelDark', -26, 0.06, 19, -20, 0.1, 23);
  for (let x = -26; x <= -20; x += 0.25) b.boxMM('galv', x, 0.1, 19, x + 0.05, 0.12, 23);

  // ---------------- hoarding (2.5m steel panels) with a gap for the gate at x ∈ [-27,-19]
  const H = L.hoardH;
  const hoardRun = (a: THREE.Vector3, c: THREE.Vector3, outward: THREE.Vector3) => {
    const len = a.distanceTo(c), dir = c.clone().sub(a).normalize();
    for (let s = 0; s < len; s += 2) {
      const p = a.clone().addScaledVector(dir, s);
      b.tube('galv', p, p.clone().setY(H + 0.1), 0.04, 6);
      const back = p.clone().addScaledVector(outward, -0.6);
      b.tube('galv', p.clone().setY(H * 0.7), back.setY(0), 0.025, 5);
    }
    const e = c.clone().add(a).multiplyScalar(0.5);
    const yaw = Math.atan2(-dir.z, dir.x);
    b.box('hoardingBlue', e.x + outward.x * 0.03, H / 2 + 0.05, e.z + outward.z * 0.03, len, H - 0.3, 0.04, yaw);
    b.box('containerWhite', e.x + outward.x * 0.035, H - 0.1, e.z + outward.z * 0.035, len, 0.2, 0.05, yaw);
    b.box('containerWhite', e.x + outward.x * 0.035, 0.12, e.z + outward.z * 0.035, len, 0.24, 0.05, yaw);
  };
  hoardRun(V(sx0, 0, sz1), V(-27, 0, sz1), V(0, 0, 1));
  hoardRun(V(-19, 0, sz1), V(sx1, 0, sz1), V(0, 0, 1));
  hoardRun(V(sx1, 0, sz1), V(sx1, 0, sz0), V(1, 0, 0));
  hoardRun(V(sx1, 0, sz0), V(sx0, 0, sz0), V(0, 0, -1));
  hoardRun(V(sx0, 0, sz0), V(sx0, 0, sz1), V(-1, 0, 0));

  // gate portal
  b.boxMM('containerWhite', -27.8, 0, sz1 - 0.4, -27, 5.2, sz1 + 0.4);
  b.boxMM('containerWhite', -19, 0, sz1 - 0.4, -18.2, 5.2, sz1 + 0.4);
  b.boxMM('hoardingBlue', -27.8, 5.2, sz1 - 0.4, -18.2, 6.4, sz1 + 0.4);
  // sliding gate leaves (open)
  for (let x = -18; x < -10; x += 0.2) b.tube('galv', V(x, 0.1, sz1 + 0.2), V(x, 2.2, sz1 + 0.2), 0.012, 4);
  b.tube('galv', V(-18, 2.2, sz1 + 0.2), V(-10, 2.2, sz1 + 0.2), 0.03).tube('galv', V(-18, 0.15, sz1 + 0.2), V(-10, 0.15, sz1 + 0.2), 0.03);
  // guard hut
  b.boxMM('containerWhite', -31, 0, 22, -28.2, 2.8, 25.2).boxMM('glass', -28.19, 1.0, 22.3, -28.18, 2.3, 24.9).boxMM('roofBlue', -31.2, 2.8, 21.8, -28, 3.0, 25.4);

  // ---------------- text boards (canvas textures, not merged)
  const signs = new THREE.Group(); signs.name = 'signs';
  root.add(signs);
  const sign = (tex: THREE.Texture, w: number, h: number, pos: number[], yaw: number, double = false) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, side: double ? THREE.DoubleSide : THREE.FrontSide }));
    m.position.set(pos[0], pos[1], pos[2]); m.rotation.y = yaw; m.castShadow = true; m.receiveShadow = true; signs.add(m); return m;
  };
  const slogan = (t: string, sub: string) => signPanel({ w: 1024, h: 256, bg: '#1d4f91', lines: [{ text: t, color: '#ffffff', size: 118, y: 108 }, { text: sub, color: '#ffd23f', size: 44, weight: 700, y: 212 }] });
  const slogans: [string, string][] = [['安全第一 预防为主', 'SAFETY FIRST · PREVENTION FIRST'], ['进入施工现场 必须戴好安全帽', '安全帽 · 系好下颏带'], ['高处作业 必须系挂安全带', '优先挂在上方牢固挂点'], ['临边洞口 防护齐全', '严禁私自拆除防护设施'], ['文明施工 绿色建造', '绿色 · 低碳 · 标准化工地']];
  for (let i = 0; i < 12; i++) {
    const x = -12 + i * 4.4; if (x > 40) break;
    sign(slogan(...slogans[i % slogans.length]), 4.2, 1.05, [x, 1.3, sz1 + 0.06], 0);
  }
  for (let i = 0; i < 12; i++) { const z = -36 + i * 5; sign(slogan(...slogans[(i + 2) % slogans.length]), 4.8, 1.2, [sx1 + 0.06, 1.3, z], Math.PI / 2); }
  sign(signPanel({ w: 1024, h: 128, bg: '#1d4f91', lines: [{ text: '安全文明施工标准化工地', color: '#ffffff', size: 84, y: 66 }] }), 9.4, 1.1, [-23, 5.8, sz1 + 0.41], 0);
  // 五牌一图 just inside the gate
  const boards = ['工程概况牌', '管理人员名单及监督电话牌', '消防保卫牌', '安全生产牌', '文明施工和环境保护牌', '施工现场总平面图'];
  boards.forEach((t, i) => {
    const x = -34.5 + i * 1.3;
    const tex = signPanel({ w: 256, h: 360, bg: '#f4f6f8', border: '#1d4f91', lines: [{ text: t.length > 6 ? t.slice(0, 6) : t, color: '#1d4f91', size: 26, y: 40 }, ...(t.length > 6 ? [{ text: t.slice(6), color: '#1d4f91', size: 26, y: 72 }] : []), ...Array.from({ length: 8 }, (_, k) => ({ text: '————————', color: '#9aa6b4', size: 18, weight: 400, y: 120 + k * 26 }))] });
    sign(tex, 1.15, 1.6, [x, 1.6, 17.6], 0);
    b.tube('galv', V(x - 0.5, 0, 17.55), V(x - 0.5, 2.5, 17.55), 0.03).tube('galv', V(x + 0.5, 0, 17.55), V(x + 0.5, 2.5, 17.55), 0.03);
  });
  b.boxMM('roofBlue', -35.3, 2.5, 17.2, -27, 2.6, 18.0);
  // gate PPE warning sign (禁止/必须戴安全帽)
  sign(signPanel({ w: 512, h: 640, bg: '#ffffff', border: '#1565c0', lines: [{ text: '必须戴安全帽', color: '#1565c0', size: 64, y: 560 }, { text: '⛑', color: '#1565c0', size: 300, weight: 400, y: 260 }] }), 0.8, 1.0, [-19.6, 1.6, sz1 - 0.42], Math.PI);

  // ---------------- container offices (2 storeys, 8 units per floor) along the west hoarding
  for (let f = 0; f < 2; f++) for (let i = 0; i < 8; i++) {
    const z = -8 + i * 3.05, y = f * 2.95;
    b.boxMM('containerWhite', -40.5, y, z, -34.5, y + 2.9, z + 3.0);
    b.boxMM('containerBlue', -40.55, y + 2.72, z - 0.02, -34.45, y + 2.9, z + 3.02);
    b.boxMM('containerBlue', -40.55, y, z - 0.02, -34.45, y + 0.18, z + 3.02);
    b.boxMM('glass', -34.49, y + 1.0, z + 0.4, -34.48, y + 2.2, z + 1.5);
    b.boxMM('containerBlue', -34.49, y + 0.2, z + 1.9, -34.47, y + 2.2, z + 2.7); // door
  }
  // corridor + rail + stairs
  b.boxMM('galv', -34.5, 2.9, -8, -33.2, 3.0, 16.4);
  for (let z = -8; z <= 16.4; z += 1.5) b.tube('galv', V(-33.25, 3.0, z), V(-33.25, 4.1, z), 0.02);
  b.tube('galv', V(-33.25, 4.1, -8), V(-33.25, 4.1, 16.4), 0.025);
  for (let s = 0; s < 16; s++) b.boxMM('galv', -34.4, s * 0.185, 16.4 + s * 0.25, -33.3, s * 0.185 + 0.03, 16.4 + s * 0.25 + 0.25);

  // ---------------- rebar processing shed (north-west) + stock
  const shed = { x0: -40, x1: -26, z0: -38, z1: -28 };
  for (let x = shed.x0; x <= shed.x1; x += 3.5) for (const z of [shed.z0, shed.z1]) b.box('craneYellow' as MatKey, x, 2.5, z, 0.2, 5, 0.2);
  b.boxMM('roofBlue', shed.x0 - 0.5, 5.0, shed.z0 - 0.5, shed.x1 + 0.5, 5.15, shed.z1 + 0.5);
  b.boxMM('containerWhite', shed.x0 - 0.5, 4.7, shed.z0 - 0.52, shed.x1 + 0.5, 5.0, shed.z0 - 0.48);
  // benches, bending machines
  for (let i = 0; i < 3; i++) { const x = shed.x0 + 2 + i * 4; b.boxMM('containerBlue', x, 0, -34, x + 1.0, 0.8, -33.2).boxMM('steelDark', x + 0.2, 0.8, -33.9, x + 0.8, 0.86, -33.3); }
  // rebar stock racks: bundles of 9m bars on sleepers
  for (let k = 0; k < 6; k++) {
    const z = -26 + k * 0.9;
    for (const x of [-38, -33, -28]) b.boxMM('timber', x, 0, z - 0.4, x + 0.15, 0.15, z + 0.4);
    for (let n = 0; n < 20; n++) b.tube('rebar', V(-38.5, 0.18 + Math.floor(n / 7) * 0.04, z - 0.18 + (n % 7) * 0.05), V(-27.5, 0.18 + Math.floor(n / 7) * 0.04, z - 0.18 + (n % 7) * 0.05), 0.014, 5);
  }
  // timber (木方) & plywood stacks, steel pipe stack
  for (let s = 0; s < 3; s++) {
    const x = -22 + s * 5;
    for (let l = 0; l < 8; l++) for (let n = 0; n < 8; n++) b.boxMM('timber', x + n * 0.13, l * 0.1, -37, x + n * 0.13 + 0.05, l * 0.1 + 0.1, -33);
    for (let l = 0; l < 20; l++) b.boxMM('plywood', x - 0.2, 1.0 + l * 0.018, -32, x + 1.1, 1.0 + (l + 1) * 0.018, -29.6);
  }
  for (let l = 0; l < 6; l++) for (let n = 0; n < 12 - l; n++) b.tube('galv', V(-6 + n * 0.05 + l * 0.025, 0.03 + l * 0.043, -37), V(-6 + n * 0.05 + l * 0.025, 0.03 + l * 0.043, -31), 0.024, 6);

  // ---------------- covered spoil / sand heaps (裸土覆盖 green dust net) on the east
  const heap = (cx: number, cz: number, rx: number, rz: number, h: number, key: MatKey) => {
    const g = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const p = g.getAttribute('position');
    const n = mulberry32(Math.floor(cx * 13 + cz));
    for (let i = 0; i < p.count; i++) { const k = 1 + (n() - 0.5) * 0.08; p.setXYZ(i, p.getX(i) * k, p.getY(i), p.getZ(i) * k); }
    g.computeVertexNormals();
    b.geo(key, g, [cx, 0, cz], [0, 0, 0], [rx, h, rz]);
  };
  heap(30, -12, 7, 5, 2.6, 'greenMesh' as MatKey); heap(30, -12, 6.9, 4.9, 2.55, 'dirt');
  heap(33, 2, 4, 3.5, 1.8, 'greenMesh' as MatKey); heap(33, 2, 3.95, 3.45, 1.78, 'dirt');

  // ---------------- mixer truck (east road) + small plant
  mixerTruck(b, 25, 12, Math.PI);
  // water tank, portable toilets, fire station
  b.tube('containerBlue', V(38, 0, -30), V(38, 3.2, -30), 1.3, 20);
  for (let i = 0; i < 3; i++) b.boxMM(i === 1 ? 'containerBlue' : 'containerWhite', 36 + i * 1.3, 0, 20, 37.2 + i * 1.3, 2.3, 21.2);
  b.boxMM('redPaint' as MatKey, -18, 0, 9.5, -16.8, 1.6, 9.9);
  for (let i = 0; i < 4; i++) b.tube('redPaint' as MatKey, V(-17.8 + i * 0.28, 0.1, 10.1), V(-17.8 + i * 0.28, 0.7, 10.1), 0.08, 10);
  // brick pallets, cement bags, wheelbarrow near the south face
  for (let p = 0; p < 6; p++) {
    const x = -12 + p * 1.6, z = 18;
    b.boxMM('timber', x, 0.06, z, x + 1.1, 0.16, z + 1.1);
    b.boxMM('brick', x + 0.02, 0.16, z + 0.02, x + 1.08, 1.0 + (p % 3) * 0.1, z + 1.08);
  }
  for (let i = 0; i < 30; i++) { const x = 2 + (i % 6) * 0.52, z = 18 + Math.floor(i / 6) * 0.36; b.box('cementBag', x, 0.14 + Math.floor(i / 12) * 0.12, z, 0.48, 0.12, 0.33, (r() - 0.5) * 0.1); }
  wheelbarrow(b, 9.5, 17.5, 0.6);
  // traffic cones along the haul road
  for (let i = 0; i < 8; i++) cone(b, -18 + i * 5, 15.3);

  // ---------------- 6F deck props (visible in the incident shots)
  // bundle of short bars waiting to be placed, tie-wire coil, tool bucket, a loose plank
  for (let n = 0; n < 14; n++) b.tube('rebar', V(-1.5, L.standY + 0.012 + Math.floor(n / 7) * 0.024, 5.2 + (n % 7) * 0.026), V(1.2, L.standY + 0.012 + Math.floor(n / 7) * 0.024, 5.2 + (n % 7) * 0.026), 0.011, 5);
  b.geo('steelDark', new THREE.TorusGeometry(0.16, 0.05, 6, 16), [7.3, L.standY + 0.05, 5.6], [Math.PI / 2, 0, 0]);
  b.tube('orangePlastic', V(7.9, L.standY, 5.1), V(7.9, L.standY + 0.3, 5.1), 0.13, 12);
  b.boxMM('timber', -4, L.standY, 3.6, -1.2, L.standY + 0.05, 3.9);

  // the loose rebar off-cut 老周 steps on (dynamic: it rolls)
  const offGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.55, 6); offGeo.rotateZ(Math.PI / 2);
  const offcut = new THREE.Mesh(offGeo, materials().rebar.mat);
  offcut.castShadow = true; offcut.name = 'offcut';
  root.add(offcut);

  return { offcut, signs };
}

function cone(b: Builder, x: number, z: number) {
  b.geo('orangePlastic', new THREE.ConeGeometry(0.15, 0.7, 12), [x, 0.41, z]);
  b.boxMM('blackMatte', x - 0.2, 0.06, z - 0.2, x + 0.2, 0.09, z + 0.2);
  b.geo('lineWhite', new THREE.CylinderGeometry(0.095, 0.11, 0.1, 12, 1, true), [x, 0.5, z]);
}

function wheelbarrow(b: Builder, x: number, z: number, yaw: number) {
  const g = new THREE.Group();
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const P = (lx: number, ly: number, lz: number) => new THREE.Vector3(x + lx * c + lz * s, ly, z - lx * s + lz * c);
  b.tube('galv', P(-0.8, 0.55, -0.25), P(0.4, 0.35, -0.2), 0.02).tube('galv', P(-0.8, 0.55, 0.25), P(0.4, 0.35, 0.2), 0.02);
  b.tube('rubber', P(0.5, 0.2, -0.05), P(0.5, 0.2, 0.05), 0.2, 14);
  b.box('containerBlue', x, 0.55, z, 0.8, 0.3, 0.6, yaw);
  void g;
}

function mixerTruck(b: Builder, x: number, z: number, yaw: number) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const P = (lx: number, ly: number, lz: number) => [x + lx * c + lz * s, ly, z - lx * s + lz * c];
  const box = (k: MatKey, lx: number, ly: number, lz: number, sx: number, sy: number, sz: number) => { const p = P(lx, ly, lz); b.box(k, p[0], p[1], p[2], sx, sy, sz, yaw); };
  box('blackMatte', 0, 0.9, 0, 8.8, 0.3, 1.0);                         // chassis
  box('containerWhite', 3.6, 1.9, 0, 1.8, 1.9, 2.4);                   // cab
  box('glass', 4.52, 2.3, 0, 0.02, 0.8, 2.1);
  box('redPaint' as MatKey, 3.6, 1.0, 0, 1.9, 0.4, 2.45);
  const drum = new THREE.CylinderGeometry(1.0, 1.25, 4.6, 18, 1); drum.rotateZ(Math.PI / 2 - 0.12);
  const dp = P(-0.9, 2.45, 0); b.geo('craneWhite', drum, dp, [0, yaw, 0]);
  const cone1 = new THREE.ConeGeometry(1.0, 1.1, 18); cone1.rotateZ(Math.PI / 2 + 0.12);
  b.geo('craneWhite', cone1, P(-3.6, 2.2, 0), [0, yaw, 0]);
  const stripes = new THREE.CylinderGeometry(1.26, 1.26, 0.3, 18, 1, true); stripes.rotateZ(Math.PI / 2 - 0.12);
  b.geo('redPaint' as MatKey, stripes, P(-0.4, 2.47, 0), [0, yaw, 0]);
  box('galv', -4.2, 2.0, 0, 0.8, 0.9, 1.0);                             // chute
  for (const lx of [3.4, -1.2, -2.6, -3.9]) for (const lz of [-1.05, 1.05]) {
    const w = new THREE.CylinderGeometry(0.5, 0.5, 0.36, 16); w.rotateX(Math.PI / 2);
    b.geo('rubber', w, P(lx, 0.5, lz), [0, yaw, 0]);
  }
}
```

### 30/33 · `dingge-source/src/world/site.ts`
<!-- casebook-file {"path": "dingge-source/src/world/site.ts", "lines": 49, "final_newline": true, "sha256": "9bab23630be1808dfd92d504ede73e0018cf702adea506843953219149413daf", "original_sha256": "9bab23630be1808dfd92d504ede73e0018cf702adea506843953219149413daf"} -->
```ts
import * as THREE from 'three';
import { Builder, type AABB } from './geo';
import { buildBuilding, type BuildingParts } from './building';
import { buildProps, type PropParts } from './props';
import { buildCity } from './city';
import { buildCrane, type CraneRig } from './crane';
import { buildDaylight, type Daylight } from './sky';

// The reusable filming location. Everything a new film needs from the set is exposed here:
// dynamic parts (crane, removable rails, hoist, offcut), colliders for the clipping check, and the daylight rig.

export interface Site {
  scene: THREE.Scene;
  building: BuildingParts;
  props: PropParts;
  crane: CraneRig;
  light: Daylight;
  colliders: AABB[];
  stats: { drawables: number; triangles: number };
}

export function buildSite(renderer: THREE.WebGLRenderer, opts: { shadowRes?: number; city?: boolean } = {}): Site {
  const scene = new THREE.Scene();
  const dyn = new THREE.Group(); dyn.name = 'dynamic'; scene.add(dyn);

  const b = new Builder();
  const building = buildBuilding(b, dyn);
  const props = buildProps(b, dyn);
  const colliders = [...b.colliders];
  scene.add(b.build('site'));

  if (opts.city !== false) {
    const cb = new Builder();
    buildCity(cb);
    const city = cb.build('city');
    city.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = false; } });
    scene.add(city);
  }

  const crane = buildCrane(dyn);
  const light = buildDaylight(scene, renderer, opts.shadowRes ?? 4096);

  let drawables = 0, triangles = 0;
  scene.traverse(o => {
    const m = o as THREE.Mesh;
    if (m.isMesh) { drawables++; const g = m.geometry; triangles += (g.index ? g.index.count : g.getAttribute('position')?.count ?? 0) / 3; }
  });
  return { scene, building, props, crane, light, colliders, stats: { drawables, triangles: Math.round(triangles) } };
}
```

### 31/33 · `dingge-source/src/world/sky.ts`
<!-- casebook-file {"path": "dingge-source/src/world/sky.ts", "lines": 106, "final_newline": true, "sha256": "54c4e3318575e3dfcf2e03146d9dd22a001377a5896080c6ba058129dbb4a156", "original_sha256": "54c4e3318575e3dfcf2e03146d9dd22a001377a5896080c6ba058129dbb4a156"} -->
```ts
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { cloudDome } from '../materials/textures';

// Daylight rig: physically-based Preetham sky, a sun whose direction drives both the sky and the shadow light,
// sky-derived IBL (PMREM) for believable ambient/reflections, soft cloud dome and aerial-perspective fog.
// Mid-morning in a Chinese city: sun ~38° high from the south-east, slight haze.

export interface Daylight {
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  setSun(elevDeg: number, azimDeg: number): void;
  /** Fit the shadow frustum around a region (per-shot focus keeps texel density high). */
  focusShadow(center: THREE.Vector3, radius: number): void;
  sunDir: THREE.Vector3;
  baseIntensity: number;
  update(camera: THREE.Camera): void;
  /** re-apply IBL to materials added after construction (puppets) */
  refreshEnv(): void;
}

export function buildDaylight(scene: THREE.Scene, renderer: THREE.WebGLRenderer, shadowRes = 4096): Daylight {
  const sky = new Sky();
  sky.scale.setScalar(4500);
  const u = sky.material.uniforms;
  u.turbidity.value = 5.5; u.rayleigh.value = 1.35; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.82;
  // sky + clouds live in their own scene and are baked into a cube map (background) whenever the sun moves:
  // one texture lookup per sky pixel instead of the full scattering shader — a big win for offline software rendering
  const skyScene = new THREE.Scene();
  skyScene.add(sky);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(4000, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: cloudDome(), transparent: true, side: THREE.BackSide, depthWrite: false, fog: false, opacity: 0.85 }),
  );
  clouds.renderOrder = 1;
  skyScene.add(clouds);
  const cubeRT = new THREE.WebGLCubeRenderTarget(1024, { type: THREE.HalfFloatType, generateMipmaps: false });
  const cubeCam = new THREE.CubeCamera(1, 10000, cubeRT);
  skyScene.add(cubeCam);
  scene.background = cubeRT.texture;

  const sun = new THREE.DirectionalLight(0xfff1dc, 3.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowRes, shadowRes);
  sun.shadow.bias = -0.00025;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = 2.5;
  scene.add(sun, sun.target);

  const hemi = new THREE.HemisphereLight(0xc4dcff, 0x9a8670, 1.05);
  scene.add(hemi);

  scene.fog = new THREE.FogExp2(0xc4d2e0, 0.0019);

  const sunDir = new THREE.Vector3();
  const pmrem = new THREE.PMREMGenerator(renderer);
  let envRT: THREE.WebGLRenderTarget | null = null;
  const focus = { c: new THREE.Vector3(), r: 60 };

  const lastSun: [number, number] = [38, 128];
  function setSun(elevDeg: number, azimDeg: number) {
    lastSun[0] = elevDeg; lastSun[1] = azimDeg;
    const phi = THREE.MathUtils.degToRad(90 - elevDeg), theta = THREE.MathUtils.degToRad(azimDeg);
    // azimuth measured from north (-Z) clockwise toward east (+X)
    sunDir.set(Math.sin(phi) * Math.sin(theta), Math.cos(phi), -Math.sin(phi) * Math.cos(theta)).normalize();
    u.sunPosition.value.copy(sunDir);
    // environment map from the sky only (no clouds) for clean IBL
    const envScene = new THREE.Scene();
    const s2 = new Sky(); s2.scale.setScalar(1000); (s2.material as THREE.ShaderMaterial).uniforms = THREE.UniformsUtils.clone(u); envScene.add(s2);
    envRT?.dispose();
    envRT = pmrem.fromScene(envScene, 0, 0.1, 2000);
    // image-based light only on reflective materials (metal, glass, clearcoat): they need the sky reflection;
    // rough mineral surfaces get the equivalent ambient from the hemisphere light at a fraction of the cost
    scene.environment = null;
    const env = envRT.texture;
    scene.traverse(o => {
      const mm = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined; if (!mm) return;
      for (const m of Array.isArray(mm) ? mm : [mm]) {
        const st = m as THREE.MeshStandardMaterial & { clearcoat?: number };
        if (!st.isMeshStandardMaterial) continue;
        if (st.metalness > 0.15 || (st.clearcoat ?? 0) > 0) { st.envMap = env; st.envMapIntensity = 0.35; st.needsUpdate = true; }
      }
    });
    cubeCam.update(renderer, skyScene);
    const warm = THREE.MathUtils.clamp((elevDeg - 5) / 40, 0, 1);
    sun.color.setRGB(1, 0.86 + 0.1 * warm, 0.72 + 0.2 * warm);
    focusShadow(focus.c, focus.r);
  }
  function focusShadow(center: THREE.Vector3, radius: number) {
    focus.c.copy(center); focus.r = radius;
    sun.target.position.copy(center);
    sun.position.copy(center).addScaledVector(sunDir, 260);
    const cam = sun.shadow.camera;
    cam.left = -radius; cam.right = radius; cam.top = radius; cam.bottom = -radius;
    cam.near = 50; cam.far = 520;
    cam.updateProjectionMatrix();
    sun.target.updateMatrixWorld();
  }
  setSun(38, 128);
  return {
    sun, hemi, setSun, focusShadow, sunDir, baseIntensity: sun.intensity,
    update(camera: THREE.Camera) { void camera; },
    refreshEnv: () => setSun(lastSun[0], lastSun[1]),
  };
}
```

### 32/33 · `dingge-source/tsconfig.json`
<!-- casebook-file {"path": "dingge-source/tsconfig.json", "lines": 15, "final_newline": true, "sha256": "0133ba3ccf3024a7792d660a1dffde9082a3fda5649b5a673a92dfe5a209a7b0", "original_sha256": "0133ba3ccf3024a7792d660a1dffde9082a3fda5649b5a673a92dfe5a209a7b0"} -->
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUnusedLocals": false,
    "skipLibCheck": true,
    "types": ["vite/client"],
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

### 33/33 · `dingge-source/vite.config.ts`
<!-- casebook-file {"path": "dingge-source/vite.config.ts", "lines": 7, "final_newline": true, "sha256": "2679729adeaa4fff1e9ff201fc6b4d0487773178045bd48553c035af2ef7e784", "original_sha256": "2679729adeaa4fff1e9ff201fc6b4d0487773178045bd48553c035af2ef7e784"} -->
```ts
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig(({ mode }) => ({
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: { outDir: mode === 'single' ? 'dist-single' : 'dist', chunkSizeWarningLimit: 4000 },
  server: { port: 5173 },
}));
```

