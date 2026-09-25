# Skills Hub 宣传片代码视频 · 复盘经验总结(CoExp)

> 成片:57 秒 · 1920×1080 · 60fps · H.264 + AAC · 120 BPM / 114 拍 · 先深色后浅色两版
> 仓库位置:`promo/`(舞台 `src/`、配乐 `audio/make-track.py`、渲染器 `render.mjs`、成片 `film/skills-hub-promo.mp4`)
> 这份总结只写这次真实发生的过程,目标是让下一次(人或 AI)直接复用。

---

## 一、创作思路

### 1. 需求如何拆成叙事结构

**原始需求的关键词**:30–60 秒、卡点、高剪辑感、拉片感;叙事是「skill 刚发起 → 越来越多 → 系统性表述」;背景是「skill 很多很怪、大家用了什么不知道」;定位是团队版、强调可扩展性;必须参考会议纪要;要出现真实的顶尖 skill 名;结尾跨次元、「Skills 连接一切」;并且要顺手从零做一套前端,用它来拍。

**拆解步骤(实际做法)**:

1. 先读仓库 `README`、会议纪要原文(Step 1 存 → 2 用 → 3 改 → 4 删 → 5 项目/全局 → 6 统一看,以及共享、社区、DAG),再读 `docs/audits/skills-full-scan-2026-08-16.md` 找**真实数字**:27 个客户端目录、581 份副本、213 个唯一 skill、demo-init 26 份两个内容变体。
2. 用一句话定主线:「从一个文件夹,到很多、很怪、没人知道,到收成一个系统,到连接一切」。
3. 画情绪曲线,再按 120 BPM(一拍 0.5s、一小节 2s)切成 12 段,每段落在小节线上:

| 时间 | 拍 | 段落 | 情绪 / 能量 | 核心镜头 |
| --- | --- | --- | --- | --- |
| 0:00–0:04 | 0–8 | 起源 | 安静、好奇(低) | 光标键入 `~/.claude/skills/pptx`,SKILL.md 展开 |
| 0:04–0:12 | 8–24 | 生长 | 上扬(中) | 卡片每两拍翻倍 1→128,计数滚到 213 |
| 0:12–0:19.75 | 24–39.5 | 混乱 | 焦虑、紧张(高且乱) | 27→581 大数字、demo-init ×26 牌堆、四连问、「很多。很怪。没人知道。」 |
| 0:19.75–0:20 | 39.5–40 | 静默 | 吸气(零) | 半拍黑场 |
| 0:20–0:22 | 40–44 | 定名 | 释放(最高点之一) | Logo 冲击出场 |
| 0:22–0:38 | 44–76 | 系统 | 稳定、自信(中高、规整) | 01 收 / 02 链 / 03 看 / 04 享,每章 8 拍 |
| 0:38–0:44 | 76–88 | 可扩展 | 力量感(中高) | 四个接口模块逐拍「咔」进内核 + DAG |
| 0:44–0:48 | 88–96 | 人 | 温度(中) | 成员主页 → 社团精选排行 |
| 0:48–0:52 | 96–104 | 跨次元 | 宏大(最高) | 星空曲速 → 点阵星球 → 星系;「Skills · 连接 · 一切」 |
| 0:52–0:57 | 104–114 | 定版 | 收束(回落) | Logo 锁定 + `$ skills-hub ui` + 渐黑 |

**曲线形态**:低 → 升 → 乱且高 → 骤停 → 爆发 → 平稳推进 → 再升 → 回暖 → 最高 → 回落。两处「骤停 + 爆发」(20s、52s)是整片的骨架。

### 2. 每个段落的设计意图

- **开场(起源)**:用最小、最具体的物件开场——一个路径 + 一个 SKILL.md。会议纪要里「skill 本质是一个文件夹,name + description 大家都能读」就是这里的依据。画面用 2.39:1 信箱 + 时间码 + REC,暗示「这是过去的影像」。
- **生长**:把「越来越多」直接可视化为翻倍,数量感来自几何级增长;叙事字幕只写「有人写了一个 / 大家都开始写 / 装进每一个 Agent / 越来越多」,**不写具体数量**(具体数字交给左上计数器,避免字幕和画面对不上)。
- **混乱**:用真实数字当武器,每一击都卡在拍上:27(目录)→ 581(副本)→ demo-init ×26 → 四连问(谁在用什么 / 哪一份最新 / 改的是哪一份 / 删了会怎样)→ 三记重音「很多。很怪。没人知道。」。浅色版里这三记切到墨色反相底,是全片最暗的一刻。
- **静默 + 定名**:半拍黑场是「吸气」,闪白 + 信箱打开 + Logo 冲击是「呼气」;信箱打开意味着从「过去」进入「产品时代」。定名后 3.4 拍整体放大 + 模糊「穿过去」进入下一章。
- **系统四章**:同构章节(左上角编号 + 大汉字题签「收 / 链 / 看 / 享」+ 英文小字,底部字幕),每章 8 拍、章首 crash——观众会预期节奏,信息更好吸收。每章一个核心动作:收 = 吸入 + 581→213;链 = 逐拍挂链接 + 一处修改全局同步;看 = 重做的总览页从透视里落定 + 镜头推 KPI / 图表 / 列表;享 = 分享到仓库 + 甩镜到 Agent 审批。
- **可扩展(差异化)**:用户明确说团队版的核心是可扩展性,所以单独给 12 拍:确定性内核居中,`StorageProvider / SourceProvider / ClientAdapter / IdentityProvider` 四个接口(来自 `packages/core/src/interfaces.ts`)逐拍插入,再收成会议纪要里的 A→B/C→D 工程 DAG,落字「为团队而生,为扩展而建」。
- **人**:会议纪要里的社区玩法(个人主页 → 置顶 → 全站精选)——片子需要一段「温度」,也为「连接」做铺垫。
- **跨次元(高潮)**:界面坍缩成一个点 → 长成 skill 点阵星球 → 拉远成「前端组 / 设计组 / 社团 / 企业团队 / 开源世界」星系,三记大字每两拍一个。尺度从「一个文件夹」一路放大到「世界」,和开场首尾呼应。
- **结尾**:冲击 + Logo 锁定 + 一行真实命令 `$ skills-hub ui`(观众知道怎么用),最后 2 拍渐黑。

### 3. 节奏、剪辑、音画配合的技巧

- **结束对拍**:动作的落点对拍而不是起点——模块插入用 `inCubic` 在拍前 0.5 拍起步、拍上撞击,再叠 `hit()` 回弹;撞击感就落在拍上。
- **多层级卡点**:小节级(段落 / 章节)、拍级(翻倍、四连问、挂链接)、八分(文档逐行、排行逐行、开关逐个)、十六分(demo-init 26 张牌每 1/16 拍一张,×N 同步跳)、帧级(闪白 1–2 帧、故障切片每帧换)。
- **静默前置**:冲击前半拍硬切成黑 + 音乐只留反向镲,冲击力翻倍。
- **同构重复**:四个章节同长度同版式,形成可预期节奏,再在「可扩展」段打破(更长、更重的金属声)。
- **反差**:快切后给停顿;满屏后给单个 Logo;暗(反相重音)→ 黑(静默)→ 白(闪白)→ 亮(定名)。
- **画幅即叙事**:前 40 拍信箱 + 时间码 = 过去;冲击时黑边打开 = 现在。
- **甩镜**:分享 → Agent 用一次整屏甩镜 + 速度相关动态模糊,比硬切更有「一气呵成」的感觉。
- **一个画面事件 = 一个声音事件**:21 个键入字符配 21 下键盘 click;翻倍配上行 blip(每次高一个和弦音);挂链接配逐拍上行音阶;模块插入配金属 clack + 短 sub;章首配 crash + 提前半拍的 whoosh。
- **sidechain**:底鼓让铺底 / 低音「呼吸」,律动感更强。

---

## 二、具体的创作方式

### 1. 技术栈与整体工作流

| 环节 | 工具 |
| --- | --- |
| 画面 | 纯 HTML + CSS + 原生 ES Module JS(无框架),DOM 做文字 / 界面,Canvas 2D 做粒子 / 线 / 星球,SVG 做需要跟随 3D 变换的线 |
| 字体 | `@fontsource-variable/geist`、`geist-mono`、`noto-sans-sc`(npm 本地安装,离线可用) |
| 逐帧渲染 | `playwright-core@1.56.1` + 预装 Chromium(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`)+ CDP `Page.captureScreenshot` |
| 编码 | `imageio-ffmpeg` 自带的 ffmpeg 7.0.2 静态版(有 libx264 / AAC) |
| 配乐 | Python 3 + numpy + scipy(`butter/sosfilt/fftconvolve`、`wavfile`) |
| 审片 | ffmpeg `tile` 拼缩略图表、`showspectrumpic` / `showwavespic` |

**完整步骤**:

1. 读资料(README、会议纪要、扫描报告、客户端目录规范)→ 定主线 + 分镜表
2. 定 BPM / 段落 / 冲击点 / 静默段 → 写 `src/cues.json`
3. 写配乐 `audio/make-track.py`(13 秒出 57 秒 WAV,打印每段 RMS)
4. 搭舞台:`tokens.css`(设计令牌)→ `ui.css`(产品组件)→ `stage.css`(分层、大字、后期)→ `engine.js`(时间线工具)→ `data.js`(真实数据)→ `ui.js`(Logo、总览页构建)→ `fx.js`(故障字、粒子、星空、颗粒)
5. 逐段写 12 个场景 `js/scenes/*.js` + `main.js`(挂载、后期、`__seek`)
6. 写 `render.mjs`(静态服务 + 逐帧截图 + ffmpeg 管道 + 静帧模式)
7. 审片循环:静帧 → 缩略图表 → 修 → 再出(共 5 轮)
8. 30fps 草稿 → 关键时刻抽帧查同步 → 频谱图查配乐
9. 60fps 母版 → 两遍压制交付版(<50MB,入库)+ 预览版(<30MB,对话发送)
10. 第二版(浅色):令牌加浅色 / 深色两套 + 画布主题对象 → 重新审片 → 重出母版和两个压制版

### 2. 项目结构、关键模块与核心代码

```
promo/
  package.json          playwright-core + 三个 fontsource 字体(不进 pnpm workspace,用 npm)
  README.md             分镜表、手法、渲染命令
  render.mjs            渲染器
  audio/make-track.py   配乐合成
  src/
    cues.json           节拍表(画面和配乐共用)
    index.html          四层舞台
    styles/tokens.css   设计令牌(:root 浅色 / [data-theme=dark] 深色)
    styles/ui.css       产品组件(侧栏、KPI、柱图、行、开关、对话框、Toast、Agent 对话)
    styles/stage.css    分层、大字、章节题签、后期层
    js/engine.js        prog / kf / life / hit / rng / css / split / revealChars / rollNum
    js/theme.js         画布与特效的主题色、混合模式
    js/fx.js            glitchText、粒子爆发、冲击环、星空、颗粒
    js/data.js          真实 skill 名、扫描数字、27 个客户端路径、成员
    js/ui.js            Logo SVG、图标、buildApp()
    js/scenes/*.js      intro / growth / chaos / title / store / link / see / share / extend / team / beyond / finale + chapter
    js/main.js          挂载、后期、__seek、字体预载、?play 预览
  film/                 交付成片(进仓库)
  out/                  母版、track.wav、草稿、静帧(gitignore)
```

**节拍表 `cues.json`(节选)**:

```json
{ "bpm": 120, "beats": 114, "fps": 60,
  "sections": [{ "id": "intro", "start": 0, "end": 8 }, { "id": "chaos", "start": 24, "end": 40 }, "..."],
  "impacts": [40, 96, 104],
  "silences": [[39.5, 40], [103.5, 104]] }
```

**舞台四层**:`<canvas id="bg">`(星空、网格、星球)/ `<div id="world">`(DOM 场景)/ `<canvas id="fx">`(冲击环、粒子、拖尾)/ `<div id="post">`(暗角、颗粒、光斑、信箱、闪白、黑场、HUD)。震屏只作用于 `#world` 和 `#fx`。

**场景接口**:

```js
export default {
  id: "store", start: 44, end: 52,            // 单位:拍
  mount(root) { /* 只建一次 DOM,保存引用 */ },
  update(b, ctx) { /* b = 当前拍;只改 style / 属性;ctx = { b, t, frame, bg, fx } */ },
};
```

**时间线工具(engine.js 核心)**:

```js
export const prog = (b, b0, b1, ease = E.linear) => ease(clamp((b - b0) / (b1 - b0)));
export const hit = (b, at, decay = 0.35) => (b < at ? 0 : Math.exp(-(b - at) / decay));
export function kf(b, frames) {             // [[拍, 值或数组, 缓动], ...]
  if (b <= frames[0][0]) return frames[0][1];
  for (let i = 0; i < frames.length - 1; i++) {
    const [b0, v0, ease = E.inOutCubic] = frames[i];
    const [b1, v1] = frames[i + 1];
    if (b <= b1) {
      const t = ease(clamp((b - b0) / (b1 - b0)));
      return Array.isArray(v0) ? v0.map((x, j) => lerp(x, v1[j], t)) : lerp(v0, v1, t);
    }
  }
  return frames[frames.length - 1][1];
}
const cache = new WeakMap();                 // 只在值变化时写 style
export function css(node, props) { /* 比较后再写 */ }
```

**主循环与 seek 接口(main.js)**:

```js
export function render(t) {
  const b = t / BEAT, frame = Math.round(t * FPS);
  bg.clearRect(0, 0, W, H); fx.clearRect(0, 0, W, H);
  for (const sc of SCENES) {
    const on = b >= sc.start && b < sc.end;
    sc.root.classList.toggle("is-on", on);
    if (on) sc.update(b, { b, t, frame, bg, fx });
  }
  // 震屏:SHAKES=[[拍,强度]] 求和 hit();闪白、光斑、信箱(b<40 时 140px,40–40.8 拍 outExpo 收起)、黑场、HUD、颗粒
}
window.__seek = (t) => { render(t); return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(true)))); };
```

**字体预载(必须)**:

```js
const text = world.textContent + "0123456789×→·#$";
await Promise.all([400, 500, 600, 700, 800, 900].flatMap((w) => [
  document.fonts.load(`${w} 40px "Noto Sans SC Variable"`, text),
  document.fonts.load(`${w} 40px "Geist Variable"`, text),
  document.fonts.load(`${w} 40px "Geist Mono Variable"`, text),
]));
await document.fonts.ready;
window.__ready = true;
```

**渲染器核心(render.mjs)**:

```js
await page.goto(`http://127.0.0.1:${port}/src/index.html${theme ? `?theme=${theme}` : ""}`);
await page.waitForFunction(() => globalThis.__ready === true, null, { timeout: 60000 });
const cdp = await page.context().newCDPSession(page);
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => globalThis.__seek(t), from + i / fps);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 94 });
  if (!ff.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
}
```

### 3. 每种视觉风格的代码实现

| 风格 / 手法 | 实现 |
| --- | --- |
| 逐字模糊显影 | 拆字成 `<span>`,每字按 `start + i·stagger` 计算进度 p:`opacity=p`、`translateY((1−p)·0.35em)`、`blur((1−p)·14px)`;退场反向 |
| 遮罩升字(Logo 字标) | 外层 `overflow:hidden`,每字 `translateY(110%→0)`,`outExpo`,stagger 0.05 拍 |
| 键入 + 光标 | 按 `prog(b,1,3)` 计算已键入字符数,未键入的 `display:none`;光标 volt 色块,键入前按拍闪烁 |
| 翻倍生长 | 16×8 网格位置按「离中心距离 + 随机抖动」排序,第 i 张卡属于第 `ceil(log2(i+1))` 批,出现时刻 = 8 + 2·批次 + 随机 0–0.45 拍;每批完成后算包围盒得到镜头缩放,`outExpo` 过渡;平面 `perspective(1600px) rotateX(0→22°)` |
| 爆炸 + 3D 卡片场 | 70 张卡,角度 / 速度 / z / 旋转预生成;位移 = 速度 · `outExpo(进度)`;提问段整体 `blur(3px)` 当景深 |
| 路径瀑布 | 三列 60 行路径,`translateY(-(b−24)·速度 % 1320)`;数字出现后降透明度 + `blur(2px)` |
| 大数字冲击 | `rollNum` 滚动 + `scale(1+0.18·hit)` + 故障强度 `hit·1.4` |
| 故障字 | 主层 + 红 / 青两层(浅底 `multiply`、深底 `screen`)按强度水平错位 + 6 条 `clip-path: inset()` 横切片随机位移;随机数用 `rng(frame·7919 + 种子)` |
| 黑白反相四连问 | 每句一个全屏容器,每拍切一个,深浅交替;进场 1.12→1 缩放 |
| 扇形牌堆 | 每张牌 `translate(-116px,-36px) rotate(ang) translateY(-(120+330·spread))`,绕牌心旋转后沿自身「上」方向外推;选中两张 `zIndex:100` + 抬高 90px + 高亮 |
| 被吸入 + 拖尾 | 起点随机,`inCubic` 加速到中心并缩到 0.15;canvas 画「上一时刻位置 → 当前位置」的渐变线;到达时面板阴影脉冲 |
| 链接描边 | SVG `<line>` 的 `stroke-dasharray = 长度`,`dashoffset` 长度→0;线上光点按周期沿线移动;修改时全部光点同时冲向外侧 |
| 3D 界面落定 + 焦点镜头 | 容器 `perspective:2200px`;`rotateX(32°) rotateZ(-10°) translateY(380)` → 0;镜头关键帧 `[缩放, 焦点x, 焦点y]`,位移 = 画面中心 − 焦点·缩放;缩放变化率大时加模糊 |
| 甩镜 | 左右两屏放在 3840 宽轨道,`inOutExpo` 平移 1920px,`blur(sin(π·进度)·18px)` |
| 模块插入 | 从四个方向 900–1000px 外 `inCubic` 飞入,落点叠 10px 回弹 + 1.05 放大 + 连接点粒子爆发 |
| 冲击环 + 粒子 | 环半径 `maxR·outExpo(t)`、线宽和透明度衰减;粒子参数预生成(角度、速度、寿命、大小、是否拖尾),位置按时间解析计算 |
| 透视网格地面 | 从地平线向下辐射 49 条线 + 12 条随时间下移的横线,`z²` 分布 |
| 曲速星空 | 1100 颗星 (x,y,z),`z` 随时间递减取模;曲速时画「当前 ← 稍远深度」线段 |
| 点阵星球 | 斐波那契球面 1100 点,yaw/pitch 旋转后透视投影,亮度按深度;每 29 个点画一个真实 skill 名;80 条球面弧(二次贝塞尔,中点外推 1.25–1.5 倍)按进度生长 |
| 星系拉远 | 主球缩放 1→0.36;7 个卫星球(1350–1700px 外)出现并用长弧连接,下方标注组织名 |
| 后期 | 颗粒:8 张 960×540 预生成噪声帧(黑白两色、alpha = r·r·60)逐帧轮换;暗角:径向渐变;光斑:横贯全屏的 3px 渐变条 + 大模糊阴影;信箱:上下 140px 黑条 |

### 4. 音频处理

**全部由 numpy 合成,无采样、无版权素材**,48kHz 立体声 16bit,57.00 秒。

- **BGM 编排**:F 小调,120 BPM,每小节一个和弦;生长段 Fm–Db–Ab–Eb,混乱段 Fm–Db–Bbm–C(C 大三是属和弦,制造「要解决」的紧张),系统段循环,远景 Db–Eb,定版落到关系大调 Ab(「远景 / 光明」)。
- **分段能量**:心跳 + 低铺底(起源)→ 四踩 + 反拍镲 + 拍手 + 拨弦琶音(生长)→ reese 失真低音 + 军鼓 + 16 分镲 + 故障切片 + 三记 stab(混乱)→ 静默 → sub boom + crash + 宽和弦 stab + shimmer(定名)→ 完整律动 + 八度低音 + 琶音(系统)→ 金属 clack(扩展)→ 轻律动 + 通鼓过门(人)→ crash + 通鼓 + 大铺底 + reese(远景)→ 大调长音 + shimmer(定版)。
- **音色**:底鼓(正弦频率 44 + 120·e^(−t/0.035) 扫降 + 3ms 高通噪声 click + tanh);军鼓(185Hz + 带通噪声);拍手(三次 11ms 间隔脉冲);镲(带通 7–14kHz,闭 22ms / 开 220ms);拨弦(加法合成锯齿,第 k 谐波按 e^(−t·(6+2.2k)) 衰减);pad(每音 4 个失谐声部分左右声道 + 低通);reese(±0.6% 失谐双锯齿 + 900Hz 低通 + tanh);stab(和弦 × 3 失谐,亮度衰减);sub boom(62→32Hz 扫降);riser(分块时变带通噪声 + 正弦 12 倍上扫,包络 (t/L)^2.2);反向镲(镲反转 × 渐强);clack(带通噪声 + 1860/2790/4133Hz 共振 + 95Hz 主体)。
- **卡点**:所有事件按 `cues.json` 的拍号放置(`at(beat) = round(beat·0.5·48000)`);打字 21 下按 b1–b3 均分 + ±0.02 拍随机;翻倍 blip 在 b8/10/…/22,音高依次 +0/3/7/12/15/19/24/27 半音;链接 blip 在 b52–59 逐拍上行并从左到右声像;模块 clack 在 b77/79/81/83。
- **转场**:章首 crash + 提前 0.6 拍 whoosh(噪声带通先上扫再下扫);冲击前用反向镲结束在冲击点。
- **静默段**:在 39.5–40、103.5–104 拍,先 240 个采样(5ms)线性渐弱防爆音,再清零 dry,只保留 fx 总线(反向镲)和混响尾。
- **混音**:sidechain(按底鼓时间表对 bass / music 压 60%、100ms 恢复);混响 IR = 2.4s 指数衰减噪声(低通 5kHz、左右独立),FFT 卷积,送量 music 0.45 / fx 0.5 / drums 0.08;母带 24Hz 高通 + 15kHz 低通(第二版加)→ tanh(0.9x)→ 裁到 57.00s → 最后 1.2s 平方渐出 → 峰值归一到 0.89。
- **故障切片**:b31.5、35.5、38.75 处把 1/32 拍片段重复 4 次、逐次衰减 12%。
- **与画面合流**:ffmpeg 第二个输入 `-ss from -t len -i track.wav` + `-shortest`,局部渲染时音画同一区间。

### 5. 渲染与导出命令和参数

```bash
# 配乐
python3 audio/make-track.py                      # → out/track.wav(约 13 秒)

# 审片静帧(PNG,1920×1080)
node render.mjs --stills 2.6,9,12.6,20.1 --dir <新目录>

# 30fps 草稿(1710 帧,约 4.5 分钟,191MB)
node render.mjs --fps 30 --preset veryfast --crf 20 --out out/draft30.mp4

# 60fps 母版(3420 帧,约 10 分钟;深色版 349MB ≈ 49Mbps)
node render.mjs --fps 60 --preset slow --crf 17 --out out/skills-hub-promo.mp4
#   内部 ffmpeg 参数:
#   -f image2pipe -framerate 60 -i -  -ss 0 -t 57 -i out/track.wav
#   -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -movflags +faststart
#   -c:a aac -b:a 256k -shortest

# 交付版(两遍编码,≈ 48MB,入仓库,GitHub 50MB 警告线以下)
ffmpeg -y -i master.mp4 -c:v libx264 -preset slow -b:v 6500k -maxrate 12M -bufsize 16M -pass 1 -an -f mp4 /dev/null
ffmpeg -y -i master.mp4 -c:v libx264 -preset slow -b:v 6500k -maxrate 12M -bufsize 16M -pass 2 \
       -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart film/skills-hub-promo.mp4

# 预览版(≈ 26MB,对话 30MiB 上限以下)
... -b:v 3500k -maxrate 7M -bufsize 10M ... -c:a aac -b:a 160k ... preview.mp4

# 深色 / 浅色切换
node render.mjs --theme dark --out out/promo-dark.mp4
```

| 版本 | 分辨率 / 帧率 | 视频 | 音频 | 体积 |
| --- | --- | --- | --- | --- |
| 母版 | 1920×1080 / 60 | x264 crf 17 slow | AAC 256k | 349MB(深色) |
| 草稿 | 1920×1080 / 30 | x264 crf 20 veryfast | AAC 256k | 191MB |
| 交付 | 1920×1080 / 60 | 两遍 6.5Mbps(峰值 12M) | AAC 192k | 48.0 / 48.3MB |
| 预览 | 1920×1080 / 60 | 两遍 3.5Mbps(峰值 7M) | AAC 160k | 26.4MB |

### 6. 时间分配与提速

大致用时(一次完整会话,约 1.5 小时产出第一版成片,另约 25 分钟出浅色版):

| 环节 | 约用时 | 说明 |
| --- | --- | --- |
| 读资料、定主线与分镜、查环境 | 15–20 分钟 | 会议纪要、扫描报告、工具链检查 |
| 配乐脚本 | 10 分钟 | 写代码为主,运行 13 秒 |
| 舞台 + 引擎 + 12 个场景 | 30–40 分钟 | **最耗「写」的时间** |
| 审片与修改(5 轮静帧) | 15 分钟 | 每轮静帧约 1 分钟 |
| 30fps 草稿 + 抽帧 + 频谱 | 7 分钟 | |
| 60fps 母版 | 10 分钟 | **最耗「等」的时间** |
| 两遍压制 × 2 个版本 | 6–8 分钟 | |
| 浅色版改造 + 审片 + 重出 | 25 分钟 | 其中渲染与压制约 15 分钟 |

**提速办法**:

- 能用静帧判断的绝不出视频;静帧写到新目录、拼成一张表一次看完。
- 草稿用 30fps + `veryfast`,只在最后出 60fps。
- 母版渲染放后台(`run_in_background`),同时写 README、改 lint 配置。
- `filter: blur` 只在值 > 0.05 时写入;重场景(上百张 3D 卡片 + blur)会把速度从约 10 帧/秒拖到 4–5 帧/秒。
- 可以按段落并行渲染多段再 `concat`(这次没用,下次可省一半时间)。
- 主题切换做成令牌 + 主题对象,改版不用逐个场景重写。

---

## 三、注意事项与踩过的坑

### 1. 注意事项清单

**开工前**

- [ ] 读完需求里点名的资料(这次是会议纪要),找出**真实数据**来源(扫描报告、日志)
- [ ] 一句话主线 + 分镜表(时间、拍、画面、声音、素材依据)
- [ ] 定 BPM,确认「每拍帧数」是整数(120 BPM × 60fps = 30 帧 / 拍)
- [ ] 总时长 = 拍数 × 拍长,落在需求区间内(114 × 0.5 = 57s)
- [ ] Chromium 路径可用,playwright-core 版本与之匹配
- [ ] ffmpeg 有 libx264 和 AAC(`ffmpeg -encoders | grep -E "264|aac"`)
- [ ] numpy / scipy 已装;中文字体本地可装(fontsource)
- [ ] 确认交付上限:聊天附件(这次 30MiB)、仓库(GitHub 50MB 警告 / 100MB 拒收)
- [ ] 确认仓库规则:lint 会不会扫到新目录、`.gitignore` 会不会忽略输出目录、要不要进 workspace

**制作中**

- [ ] 所有运动由 `update(b)` 计算,不用 CSS transition / animation、不用 `Date.now()`
- [ ] 随机数全部种子化
- [ ] 字体预载完成后才置 `__ready`
- [ ] 每写完一段就出静帧审
- [ ] 界面类元素按视频可读性放大(1.2–1.3 倍),字幕 ≥ 34px
- [ ] 题签 / 字幕位置固定,不压住主体;镜头推近时淡出题签
- [ ] 信箱时期内容在 140–940px 安全区
- [ ] 换背景明暗时,检查所有混合模式(`lighter` / `screen` / `overlay`)和信号色文字对比度

**导出前**

- [ ] 30fps 草稿在每个转场和冲击点前后抽帧,确认画面状态与拍号一致
- [ ] 频谱图:段落结构清楚、静默段是干净的竖条、高频不过满
- [ ] 波形图:无削顶、结尾渐出
- [ ] 母版时长 = 57.00s,音视频两条流都在(`ffmpeg -i` 看 Duration / Stream)
- [ ] 控制台没有 pageerror(404 favicon 这类噪声先消掉)

**交付前**

- [ ] 交付版 < 50MB、预览版 < 30MiB
- [ ] 从交付版里抽 3–4 帧看压缩质量(路径瀑布、界面细字、星空最容易糊)
- [ ] 母版只留本地,不进仓库
- [ ] README 写清分镜、手法、渲染命令
- [ ] 仓库 lint / typecheck / build 仍通过
- [ ] 标明哪些内容是真实数据、哪些是占位(成员账号)

### 2. 踩过的坑(现象 → 根因 → 解决 → 下次避免)

**渲染与导出**

1. **颗粒把整片洗成灰色**
   - 现象:第一批静帧整体发灰,像蒙了一层雾。
   - 根因:颗粒 canvas 用 `mix-blend-mode: overlay`,但父级 `#post` 设了 `z-index`,形成独立层叠上下文,混合只在 `#post` 内部发生,底下没东西可混,结果按普通透明度盖了一层灰噪声。
   - 解决:噪声改成黑白两色 + 低 alpha(`alpha = r·r·60`),普通混合,分辨率从 480×270 提到 960×540。
   - 避免:后期层不要依赖 mix-blend-mode;要用就把元素直接放在需要混合的那个层叠上下文里。
2. **Playwright 自带的 ffmpeg 不能出 MP4**
   - 现象:`ffmpeg -encoders` 里没有 libx264、没有 AAC。
   - 根因:那个构建只为录 webm。
   - 解决:`pip install imageio-ffmpeg`,用它带的静态完整版,`render.mjs` 里自动查找。
   - 避免:开工第一步就检查编码器。
3. **静态 ffmpeg 没有 `drawtext`**
   - 现象:缩略图表想加时间戳标签时报 `No such filter: 'drawtext'`。
   - 解决:不加标签,按文件名(`t012.60.png`)排序拼表。
   - 避免:需要文字标注时准备带 freetype 的构建,或用浏览器生成标注图。
4. **母版 349MB**
   - 现象:crf 17 的 60fps 母版近 49Mbps。
   - 根因:全片颗粒让帧间压缩几乎失效。
   - 解决:母版只留本地,交付用两遍编码 6.5Mbps(48MB),预览 3.5Mbps(26MB)。
   - 避免:一开始就规划三个版本;颗粒强度与目标码率一起考虑。
5. **重场景渲染变慢**
   - 现象:从约 10 帧/秒掉到 4–5 帧/秒。
   - 根因:上百张 3D 卡片 + 多处 `filter: blur`。
   - 解决:接受;草稿用 30fps,母版放后台。
   - 避免:blur 只在需要时写;按段并行渲染。
6. **截图可能拿到上一帧**
   - 解决:seek 后等两个 `requestAnimationFrame` 再截图。
   - 避免:把这个写成 `__seek` 的固定行为。

**帧率和时长**

7. **帧率选择**
   - 这次先用 30fps 草稿验证,最终 60fps。120 BPM 下 60fps 一拍 30 帧、30fps 一拍 15 帧,都能整除,拍点落在整帧上。
   - 避免:选 BPM 时让「一拍帧数」为整数;总时长用拍数算,音频生成时多留 1 秒再裁到精确长度,ffmpeg 加 `-shortest`。

**音频与画面同步**

8. **担心漂移、无法人工比对**
   - 解决:30fps 草稿里在 19.85s(应为黑场)、20.03s(应为闪白)、48.1s(应为星空)、51.9s(应为黑场)、52.1s(应为定版)抽帧,全部吻合。
   - 避免:音画都从同一个 `cues.json` 派生,验证时按冲击点抽帧。
9. **局部渲染音画错位**
   - 解决:音频输入加 `-ss from -t len`,与画面区间一致。

**BGM 与音效卡点**

10. **我听不到声音**
    - 现象:无法主观判断音色和响度。
    - 解决:打印每段 RMS;`showspectrumpic` 看段落结构和高频;`showwavespic` 看动态;交付时明确告知「音色需要人耳确认」。
    - 避免:下次保留这个验证流程,并把「需要人耳复听」写进交付说明。
11. **高频过满**
    - 现象:频谱顶部一整片到 23kHz。
    - 根因:踩镲用 7.5kHz 高通噪声,量偏大。
    - 解决:改为 7–14kHz 带通 × 0.7,母带加 15kHz 低通。
12. **动态被压扁、冲击不够突出**
    - 现象:各段 RMS 都在 −8 到 −9 dBFS。
    - 根因:母带 tanh 软削波。
    - 解决:靠冲击前半拍静默 + 反向镲制造对比。
    - 避免:需要更大动态时降低 tanh 驱动,或只对总线做温和压缩。
13. **静默段爆音风险**
    - 解决:清零前先做 240 采样(5ms)线性渐弱。

**中文字体与文字排版**

14. **隐藏场景的字体不加载**
    - 现象:某些场景第一次出现时是回落字体。
    - 根因:`display:none` 的元素不会触发 webfont 下载。
    - 解决:启动时收集舞台全部 `textContent`,按字体 × 字重调用 `document.fonts.load()`;canvas 上用的字(卫星标签)单独再载一次。
    - 避免:把字体预载写进模板,预载完成才允许渲染。
15. **系统中文字体不可靠**
    - 现象:环境里只有文泉驿。
    - 解决:npm 装 `@fontsource-variable/noto-sans-sc`(按 unicode-range 切 101 片,按需加载)。
16. **大字排版**
    - 做法:中文大字 800–900 字重、`letter-spacing:-0.04em`、`white-space:nowrap`;逐字动画用 `em` 做位移单位,字号改了动画不用重调。
17. **信号色文字在浅底上看不清**
    - 现象:浅色版里荧光黄绿的数字和题签编号几乎看不见(约 1.3:1)。
    - 解决:拆成 `--sh-volt`(线 / 字,加深为 `#4d7c0f`)和 `--sh-volt-fill`(面,`#c8f53c`)。

**场景衔接与版式**

18. **产品界面在视频里太小**
    - 现象:分享对话框、Agent 面板、排行榜的字在 1080p 视频里读不清。
    - 解决:统一 `scale(1.2–1.32)` 并重排位置。
    - 避免:界面类镜头一开始就按 1.25 倍设计。
19. **章节题签压住放大的界面**
    - 现象:镜头推近总览页时,「03 看」盖住侧栏。
    - 解决:该场景题签和说明只在落定前 2 拍显示,镜头一动就淡出。
20. **扇形牌堆变成扁平彩虹、压住计数**
    - 根因:`transform-origin` 设在牌下 300px 再叠 translateY,两套位移叠加。
    - 解决:绕牌心旋转后沿自身「上」方向外推半径;变体标签挪到右侧计数下方。
21. **字幕数量与画面不符**
    - 现象:字幕说「十个」时画面只有 4 张卡。
    - 解决:叙事字幕不写具体数量。
22. **全局 canvas 的线和 3D 卡片对不齐**
    - 解决:需要跟随场景 3D 变换的线用场景内 SVG。
23. **路径瀑布抢戏**
    - 解决:数字出现时路径层降到 45% 透明度 + `blur(2px)`。
24. **段落衔接**
    - 用法:大部分是强拍硬切;定名段整体放大 + 模糊「穿过去」;排行榜缩到 0.2 融进远景;远景结束先渐隐再半拍黑场;甩镜只用在同一段内。**不要每个转场都花哨**,硬切在拍上最干净。

**深浅主题切换**

25. **浅色背景上粒子、冲击环、点阵消失**
    - 根因:`globalCompositeOperation = "lighter"`(加色)在白底上无效。
    - 解决:`theme.js` 里放 `blend`(深色 `lighter` / 浅色 `source-over`)和整套画布颜色。
26. **浅色背景上故障字色散消失**
    - 根因:`screen` 在白底上不可见。
    - 解决:浅底用 `multiply`;反相镜头(深底)里的故障字仍用 `screen`,`glitchText(…, onDark)` 按所在底色选择。
27. **浅底上点阵星球显得稀**
    - 解决:点尺寸 × 1.45(`pointScale`)。

**文件体积和下载限制**

28. **对话附件发不出去**
    - 现象:45.8MiB 超过 30MiB 上限。
    - 解决:另压 3.5Mbps 预览版 26MB。
29. **GitHub 体积**
    - 解决:交付版控制在 48MB;注意每次替换成片都会在 git 历史里累积,最好一次定稿。
30. **`.gitignore` 忽略了所有 `dist/`**
    - 现象:成片放 `promo/dist/` 提交不上。
    - 解决:改放 `promo/film/`。

**运行环境与依赖**

31. **仓库 lint 扫到 promo 的浏览器 JS**
    - 现象:37 个 `document / window is not defined`。
    - 解决:`eslint.config.mjs` 给 `promo/src/**/*.js` 声明浏览器全局、给 `promo/*.mjs` 声明 Node 全局、忽略 `promo/out/**`;`page.evaluate` 回调里用 `globalThis` 而不是 `window`。
32. **promo 依赖污染 workspace**
    - 解决:promo 不进 pnpm workspace,单独 `package.json` + npm。
33. **外部数据源受限**
    - 现象:skills.sh 被代理拦截、非授权仓库 GitHub API 返回 403。
    - 解决:用 WebSearch 交叉核实 skill 名,结合本机已知的 anthropics/skills 列表和仓库扫描报告。
34. **favicon 404 刷日志**
    - 解决:`<link rel="icon" href="data:,">`。
35. **删除静帧目录被安全检查拦截**
    - 现象:`cd` 后 `rm out/stills/*` 无法静态解析。
    - 解决:不删,每批静帧写到新目录(`--dir st2 / st3 …`)。
36. **`pkill -f` 杀掉了自己的 shell**
    - 现象:命令退出码 144。
    - 根因:命令行本身包含匹配串。
    - 解决:用 `ps … | grep … | grep -v grep | awk` 精确取 PID。

---

## 四、可复用的模板

### 1. 代码视频制作流程模板

```
阶段 0 · 调研(15–20 分钟)
  □ 读需求点名的资料;找真实数据(报告 / 日志 / 真实命名)
  □ 检查环境:浏览器、ffmpeg(libx264 + AAC)、numpy/scipy、字体
  □ 确认交付上限与仓库规则

阶段 1 · 策划(10 分钟)
  □ 一句话主线
  □ 情绪曲线 → 10–12 段分镜表(时间 / 拍 / 画面 / 声音 / 素材依据)
  □ BPM、总拍数、冲击点、静默段 → cues.json

阶段 2 · 配乐(10 分钟)
  □ 按段落写编排,事件全部按拍号放置
  □ 打印分段 RMS;出频谱图 / 波形图

阶段 3 · 舞台(20 分钟)
  □ tokens.css(浅 / 深两套同名令牌)、ui.css、stage.css
  □ engine.js(prog / kf / life / hit / rng / css / revealChars / rollNum)
  □ theme.js(画布颜色 + 混合模式)、fx.js、data.js、ui.js
  □ main.js:四层舞台、后期、__seek、字体预载、?play 预览
  □ render.mjs:静态服务、逐帧截图、ffmpeg 管道、--stills / --fps / --from / --to / --theme

阶段 4 · 场景(30–40 分钟)
  □ 每段一个 scenes/*.js(mount 建 DOM,update(b) 改样式)
  □ 每写完 2–3 段出一次静帧

阶段 5 · 审片(15 分钟 × N 轮)
  □ 静帧 → 缩略图表 → 修 → 新目录再出
  □ 30fps 草稿 → 冲击点抽帧 → 频谱复查

阶段 6 · 导出(20 分钟,可后台)
  □ 60fps 母版(crf 15–17,slow)
  □ 交付版:两遍 6.5Mbps(< 50MB)
  □ 预览版:两遍 3.5Mbps(< 30MiB)
  □ 抽帧检查压缩质量

阶段 7 · 交付
  □ README(分镜、手法、命令)
  □ 仓库检查(lint / ignore / 体积)
  □ 说明真实数据与占位内容、需要人耳复听的部分
```

### 2. 给 AI 的开工提示词模板

```
你要用代码做一支 {时长,如 45–60 秒} 的 {产品名} 宣传片,1920×1080、60fps、H.264 + AAC。

【素材】
- 产品介绍:{README / 文档路径}
- 必须参考的资料:{会议纪要 / 需求文档路径}
- 真实数据来源:{扫描报告 / 日志 / 统计路径},片中数字必须来自这里
- 需要出现的真实名称:{真实功能名 / skill 名 / 客户名},不得编造

【叙事】
- 一句话主线:{例:从一个文件夹,到很多很怪没人知道,到收成一个系统,到连接一切}
- 必须突出的差异化卖点:{例:面向团队、可扩展性}
- 结尾:{例:跨次元远景 + Logo 定版 + 一行真实命令}

【风格】
- 卡点、高剪辑感、拉片感(信箱画幅、时间码、颗粒、闪白、震屏)
- 配色:{浅色 / 深色},一支信号色 {色值},其余灰阶
- 片中出现的产品界面要用真实 DOM + CSS 从零设计,顺手产出设计令牌

【技术要求(按这套做)】
1. 先读资料,写分镜表(时间 / 拍 / 画面 / 声音 / 素材依据)和 cues.json(BPM、拍数、段落、冲击点、静默段)
2. 配乐用 numpy/scipy 合成,读同一份 cues.json,无采样无版权;冲击前留半拍静默
3. 画面:HTML 舞台四层(bg canvas / DOM 场景 / fx canvas / 后期),画面是时间 t 的纯函数,
   不用 CSS 动画、不用 Date.now(),随机数种子化;暴露 window.__seek(t);字体预载完成才置 __ready
4. 渲染:playwright-core + 本机 Chromium 逐帧 seek,CDP 截 JPEG,管道给 ffmpeg(libx264 + 混入 wav)
5. 每写完几段就出静帧、拼缩略图表自查;30fps 草稿按冲击点抽帧确认同步;用频谱图检查配乐
6. 导出:60fps 母版(本地)+ 两遍压制交付版(<50MB)+ 预览版(<30MB)

【必须提前检查】
- ffmpeg 是否有 libx264 / AAC;浏览器路径;中文字体本地安装
- 深 / 浅背景下混合模式(lighter / screen / overlay)是否可见;信号色做文字是否够对比度
- 产品界面按视频尺度放大 1.2–1.3 倍;题签不压主体
- 仓库 lint 是否会扫到新目录、.gitignore 是否会忽略成片目录

【交付】
成片路径、README(分镜 + 手法 + 渲染命令)、真实数据与占位内容说明、需要人耳复听的部分。
```

---

*对应代码全部在 `promo/`。换产品时替换 `cues.json`、`data.js`、各场景文案与数据,管线不用改。*
