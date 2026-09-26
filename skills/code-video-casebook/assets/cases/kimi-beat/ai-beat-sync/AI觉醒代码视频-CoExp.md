# AI觉醒代码视频-CoExp · 复盘经验总结

> 项目：`videos/ai-beat-sync/` ｜ 成片：`renders/ai-beat-sync.mp4`（1920×1080 · 30fps · 51.293s · 15.0MB · H.264+AAC）
> 工作流：HyperFrames 0.8.73 `/music-to-video` ｜ BGM：Kevin MacLeod《Volatile Reaction》（CC-BY 4.0）
> 本文基于本次真实制作过程写成，所有命令、参数、代码均来自实际执行记录。

---

# 一、创作思路

## 1.1 需求拆解：先把音乐变成曲线，再把曲线变成叙事

用户的需求是"AI 主题、高燃卡点、节奏极快、宁可短也要快"。拆解动作不是先写故事，而是**先把音乐分析成数据**：

1. 选曲标准不是好听，是**曲子内部有剧情**。《Volatile Reaction》152BPM，全曲 161s，内部有完整的 安静冷启动 → SURGE 蓄力 → DROP 爆发 → 骤停 结构。
2. 对**全曲**跑节拍分析器得到 `audiomap.json`：BPM、每一拍的时间戳（`grid.beats_sec[]`）、能量值、军鼓/roll 位置。1 拍 = 60/152 = **0.39474s**。
3. 按能量曲线裁窗：取原曲 **46.324s–97.617s** 这 51.293s，窗口边缘**对齐到 downbeat**（不是随手掐的）。裁完，音乐结构直接翻译成了叙事结构：

| 本地时间 | 音乐事件 | 叙事功能 | 帧 |
|---|---|---|---|
| 0–4.644s | 冷启动，kick 2.42/2.81 | 点火：2017 年那篇论文 | F1 终端打字机 |
| 4.644–10.913s | SURGE @4.676（e=0.93），军鼓流 4.78–9.24 | 破门：主标题砸字 | F2 kinetic cascade |
| 10.913–22.662s | kick 流加密，roll @12.4，roll 21.8–22.6 加速 | 蓄能：编年史 → 产品时代 | F3 瓷砖墙+卡片flyby |
| 22.662–36.966s | **DROP @23.676（e=0.94，全曲最高点）** | 爆发 | F4 频闪+代码雨+数据卡 |
| 36.966–48.599s | 25-onset 密集尾段，最后一次军鼓 @47.28 | 释放→定格 | F5 字拳+反色+终砸 |
| 48.599–51.293s | **音乐骤停（95s 处）** | 落版 | F6 静音黑场+署名 |

关键认知：**"起承转合"一个字都没编，全是曲子里本来就有的。** 分镜工作只是"读出来"。

## 1.2 每个段落的设计意图

- **F1 冷启动（终端打字机）**：开场是音乐最安静的四秒半，用 CRT 终端质感"低开"。`$ boot --year 2017` + 逐词打出 "attention is all you need"，kick 落下时关键词 "transformer" 砸入并在尾部三次击中时切换字体（ serif/mono/brand 交替）。意图：AI 故事的奇点就是那篇论文，打字机 = 诞生的仪式感。低开是为了给后面蓄落差。
- **F2 主标题（kinetic cascade）**：SURGE 就是"门被踹开"，所以第一个 kick（4.676）同步砸下 460px 巨型中文词「机器/学会了/思考」逐词 reveal，kick 9.59 落 climax「ai 觉醒」（全片第一次出现橙色大字）。意图：把主题句拆开，让音乐一句一句"顶"出来。
- **F3 里程碑蓄能（瓷砖墙 → 卡片纵深 flyby）**：kick 流越来越密，对应"历史在加速"。前半 12 块真实里程碑瓷砖（alexnet/alphago/transformer/gpt-3/chatgpt/sora/deepseek-r1/kimi k2…）逐拍弹入，roll 时整墙换色；后半 6 张产品卡（chatgpt/gpt-4/claude/kimi/sora/agent 时代）带 18° yaw 从纵深飞来，一张一个 kick。最后一张「agent 时代」**停在 DROP 前一瞬**——蓄能到嗓子眼。
- **F4 爆发（全片峰值）**：DROP 那一瞬做三件事：①「爆发」大字频闪（5 套品牌色反转 look 按 kick 切换）；②二进制代码雨点火，26 列确定性字符流持续漂移，每击翻洗 1/3 列；③三张数据卡砸入——**全部真实数据**："175b parameters · gpt-3"、"100m users · 2 months · chatgpt"、"1 prompt → anything"。尾段接词槽「agents 能做什么：写代码/做设计/剪视频/做科研/开公司」，exit wipe 切走。
- **F5 释放→定格**：25 个 onset 的密集段做 hypercut 字拳（看懂的人/已经/上车/builders win/信息差/就是生产力），一个 kick 一个字；43.56s 出现**全片唯一的反色帧**「all in」（橙底黑字频闪，峰值对比）；47.28s 最后一次军鼓 → 「未来已来」crash-zoom 砸满全屏并 **hold 进静场**。
- **F6 落版**：音乐骤停后 2.7 秒黑场 + 音乐署名。48 秒密不透风的鼓点之后，**静音是最狠的一锤**。

## 1.3 节奏与音画配合的专业技巧（及为什么有效）

1. **beat_cut 硬切**：所有转场落在 `beats_sec` 的拍点上，零淡入淡出。帧边界全部是节拍时间戳（4.644 / 10.913 / 22.662 / 36.966 / 48.599）。硬切+拍点 = 拉片感的来源。
2. **每 2 拍必变规则**：任何镜头 ≈0.8s 内必须有可见变化。F3 一个 11.7s 的段落里藏了 4 个镜头（瓷砖弹入→整墙换色→纵深 flyby→卡片连发）。
3. **三层节奏嵌套**：拍（0.4s，字母/瓷砖/代码雨闪烁）→ 小节（1.6s，大字/场景）→ 乐句（~12s，段落能量升降）。
4. **重音稀缺原则**：全片只砸 2 个 bass impact（23.676 DROP、47.276 终砸），音量 1.0/0.95 拉满；标题处 4.676 给一个 0.9。砸多了就没有重音。
5. **铺垫-释放**：riser 音效 13.65s 起铺、时长 10.03s——**正好推到 DROP 点 23.68s**。没有铺垫的高潮只是噪音。
6. **kick 同步屏幕微震**：`shakeFx()` 在每次 kick 给画面 0.03s×N 步的衰减抖动（`steps(1)` 离散缓动），身体能"感觉"到鼓点而不只是听到。
7. **静默即重锤**：47.28 终砸后 hold 进 48.6s 的骤停黑场。快不是目的，"快→骤停"的落差才是。
8. **真实信息当燃料**：快剪每秒都在收观众的"注意力税"，真实数据（175B 参数、100M 用户）让 0.8s 一闪而过也值得。frame.md 里有硬规则：任何数字不得编造。

---

# 二、具体的创作方式

## 2.1 技术栈与完整工作流

| 层 | 工具 | 版本/参数 |
|---|---|---|
| 视频框架 | HyperFrames（npm 包，项目内 pin 死版本） | `hyperframes@0.8.73` |
| 工作流 skill | `/music-to-video`（自带分析器与校验脚本） | `C:/Users/AIMFl/.agents/skills/music-to-video/scripts/` |
| 动画 | GSAP（本地化） | 3.15，`assets/gsap.min.js` |
| 节拍分析 | Python + librosa | `pip install librosa numpy soundfile` |
| 音频处理 | ffmpeg | 8.1.1 |
| 字体 | Google Fonts 下载到本地 | Barlow 400/600/700/800/900、IBMPlexMono-500、NotoSansSC-700/900 |

完整步骤（按真实执行顺序）：

```bash
# 0. 初始化：hyperframes 项目（index.html + compositions/ + package.json pin 版本）
# 1. 选曲下载：incompetech 全曲 mp3 → assets/bgm.mp3（161s）
# 2. 全曲节拍分析（关键：对全曲做，不是裁切后）
python analyze-beatgrid.py assets/bgm_full.mp3 --out audiomap_full.json
# 3. 裁窗：取 46.324–97.617，尾 1.79s 淡出，边缘 snap 到 downbeat
ffmpeg -y -v error -ss 46.324 -t 51.293 -i assets/bgm.mp3 \
  -af "afade=t=out:st=49.5:d=1.79" -c:a libmp3lame -b:a 256k assets/bgm_full.mp3 \
  && mv assets/bgm_full.mp3 assets/bgm.mp3
# 4. 从全曲分析图平移出窗口版 audiomap.json（beats_sec 整体 -46.324，丢弃窗外拍点）
#    ——这一步是手工脚本做的，原因见「踩坑①」
# 5. 写 STORYBOARD.md（逐乐句对照能量曲线，role_bindings 绑定 onset 时间戳）
# 6. 写 frame.md 品牌规范（Broadside 预设），字体全部下载到 assets/fonts/
# 7. 6 个帧文件并行构建（subagent 并行），组装 index.html + SFX 音轨层
# 8. 三道质量闸：
node validate-plan.mjs            # 帧铺满 51.293s、0 缝隙、0 warning
npm run check                     # = npx hyperframes@0.8.73 check（lint+layout+motion+contrast）
#    21 个时间点截图 → snapshots/review/contact-sheet-1/2/3.jpg 人工审阅
# 9. 渲染：
npx hyperframes render . --skill=music-to-video -q delivery -o renders/ai-beat-sync.mp4 --fps 30
# 10. 成片复核（从成片本身抽帧，每个时间点单独一条命令）：
ffmpeg -y -v error -ss 23.8  -i renders/ai-beat-sync.mp4 -frames:v 1 renders/verify-23.8.png
ffmpeg -y -v error -ss 30    -i renders/ai-beat-sync.mp4 -frames:v 1 renders/verify-30.png
ffmpeg -y -v error -ss 47.5  -i renders/ai-beat-sync.mp4 -frames:v 1 renders/verify-47.5.png
ffprobe -v error -show_entries format=duration -show_entries stream=codec_type,codec_name \
  -of default=noprint_wrappers=1 renders/ai-beat-sync.mp4
```

## 2.2 项目结构与关键模块

```
ai-beat-sync/
├── index.html                  # 主合成：6 帧拼装 + BGM + 14 个 SFX cue + 根时间轴
├── compositions/frames/        # 6 个独立帧（每个是完整 HTML：template/style/stage/script）
│   ├── 01-f1-boot.html         # 349 行  终端打字机
│   ├── 02-f2-title.html        # 428 行  kinetic cascade 主标题
│   ├── 03-f3-montage.html      # 647 行  瓷砖墙 + 卡片 flyby
│   ├── 04-f4-drop.html         # 920 行  频闪 + 代码雨 + 词槽（全片最重）
│   ├── 05-f5-finale.html       # 555 行  字拳 + 反色 + 终砸
│   └── 06-f6-outro.html        # 200 行  静音落版
├── audiomap.json               # 节拍网格（地面真相）
├── STORYBOARD.md / BRIEF.md / frame.md
├── validate-plan.mjs           # plan 校验（从 skill 拷贝）
└── assets/  bgm.mp3 · fonts/ · sfx/ · gsap.min.js
```

**index.html 的组装逻辑**：每个帧是一个 `<div data-composition-src="..." data-start="..." data-duration="...">`，音频是独立 `<audio>` 元素挂 track-index。帧边界全部取 `audiomap.grid.beats_sec` 的值：

```html
<div id="root" data-composition-id="main" data-start="0" data-duration="51.293"
     data-width="1920" data-height="1080">
  <div class="frame" data-composition-id="01-f1-boot"
       data-composition-src="compositions/frames/01-f1-boot.html"
       data-start="0" data-duration="4.644" data-track-index="1"></div>
  <!-- …F2–F6 依次首尾相接… -->
  <audio id="el-bgm" src="assets/bgm.mp3" data-start="0" data-duration="51.293"
         data-track-index="11" data-volume="0.9"></audio>
  <audio id="sfx-riser" src="assets/sfx/riser.mp3" data-start="13.65"
         data-duration="10.03" data-track-index="15" data-volume="0.4"></audio>
  <!-- …共 14 个 SFX cue… -->
</div>
<script>
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = gsap.timeline({ paused: true });  // 每合成一条 paused 根时间轴
</script>
```

**每个帧文件的骨架**（HyperFrames 契约）：`<template>` 内自带 `<style>`（含完整 @font-face 块）、`#stage`（1920×1080）、`<script>` 注册一条 paused 时间轴到 `window.__timelines[帧ID]`，**帧内所有时间都是帧本地秒**（帧起点=0），时间戳全部来自 STORYBOARD 的 role_bindings。

```js
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({ paused: true });
// …所有动画按秒级时间戳排进 tl…
tl.seek(0);
window.__timelines["01-f1-boot"] = tl;
```

## 2.3 每种视觉风格的代码实现

| 帧 | 风格 | 实现机制 |
|---|---|---|
| F1 | CRT 终端/打字机 | 逐词 `fromTo`（`back.out(2)`）按 onset 弹出；扫描线 = `repeating-linear-gradient` 静态层，kick 时脉冲 opacity；光标闪烁 = 拍点时刻 `tl.set` 交替 autoAlpha；尾部三次击中用 `tl.set` 切 fontFamily（serif→mono→brand） |
| F2 | kinetic typography | 460px 巨词逐字 stagger；`opacity:0;visibility:hidden` 写在 CSS 基线；顶部 surge bar `scaleX(0→1)`；幻影序号用 `-webkit-text-stroke: 1px` 描边空心字 |
| F3 | 瓷砖墙 + z 轴 flyby | 12 瓷砖按 kick 累积弹入 → roll 时整体换色 → 蛇形填充；卡片 `perspective` + `rotationY:18°` + z 位移，落地时间 = kick 时间戳 |
| F4 | 频闪/代码雨/数据卡 | 见下方三段核心代码 |
| F5 | hypercut 字拳/反色/终砸 | 每 onset 一个 fromTo 砸字 + `overwrite:"auto"`；「all in」= 5 套 look 的反转版（橙底黑字）；crash-zoom = scale fromTo + 色差 ghost 层 |
| F6 | 落版 | 静态排版 + 单 whoosh，无任何运动 |

**核心代码①：确定性随机（全片禁用 `Math.random`——渲染必须可复现）**

```js
function mulberry32(a) {           // 种子 PRNG：同一工程两次渲染结果一致
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

**核心代码②：kick 同步屏幕抖动（衰减步进，`steps(1)` 离散化）**

```js
function shakeFx(target, t, amp, steps) {
  for (var k = 0; k < steps; k++) {
    var a = amp * (1 - k / steps);
    tl.to(target, { x: (k % 2 ? -a : a) * 0.9, y: (k % 3 ? a * 0.6 : -a * 0.5),
      duration: 0.03, ease: "steps(1)", overwrite: "auto" }, t + k * 0.03);
  }
  tl.to(target, { x: 0, y: 0, duration: 0.08, ease: "power2.out",
    overwrite: "auto" }, t + steps * 0.03);
}
```

**核心代码③：二进制代码雨（26 列 × 74 行，纯 DOM，无 canvas）**

```js
function rainString(seed, len) {
  var r = mulberry32(seed), s = "";
  for (var i = 0; i < len; i++) {
    var v = r();
    if (v < 0.86) s += r() < 0.5 ? "0" : "1";
    else s += "▓▒░".charAt(Math.floor(r() * 3));
    if (i < len - 1) s += "\n";
  }
  return s;
}
// 每列一条 strip，textContent 预生成；整段持续匀速漂移：
tl.fromTo(strip, { y: startY }, { y: endY, duration: G2_LEN, ease: "none",
  immediateRender: false }, 3.437);
// 每次击中翻洗 1/3 列（轮换），并脉冲一次亮度：
FLICK.forEach(function (t, h) {
  for (var i = 0; i < NCOL; i++) {
    if ((i + h) % 3 !== 0) continue;
    tl.set(strips[i], { textContent: rainString(5000 + i * 131 + h * 991, ROWS) }, t);
    tl.fromTo(cols[i], { opacity: Math.min(1, OP[i] + 0.55) },
      { opacity: OP[i], duration: 0.4, ease: "power2.out",
        overwrite: "auto", immediateRender: false }, t);
  }
});
```

**核心代码④：DROP 频闪（5 套品牌反转 look，按 kick 硬切；浅色 look 时 chrome 同步翻黑）**

```js
var G1_LOOKS = [
  { bg: "#E85D26", ink: "#111111" },  // 0 全反色（DROP 专用）
  { bg: "#F0ECE5", ink: "#111111" },  // 1 米白闪
  { bg: "#111111", ink: "#F0ECE5" },  // 2 米白字
  { bg: "#111111", ink: "#E85D26", scan: true },    // 3 故障扫描
  { bg: "#111111", ink: "transparent", outline: true }, // 4 描边幻影
];
function showLook(idx, t) {
  if (curLook >= 0) tl.set(lookEls[curLook], { opacity: 0 }, t);
  if (idx >= 0)     tl.set(lookEls[idx],     { opacity: 1 }, t);
  var chrome = (idx === 0 || idx === 1) ? "#111111" : "#888880"; // 浅色 look 翻黑 chrome
  tl.set(["#g1 .fx_kicker", "#g1 .fx_meta"], { color: chrome }, t);
  curLook = idx;
}
// THE DROP —— 23.676 本地 0.998：全反色 hold + 最大幅度抖动
showLook(0, 0.998); shakeFx("#g1_inner", 0.998, 30, 10);
```

## 2.4 音频处理

- **BGM 裁窗**：上面的 ffmpeg 命令。`-ss 46.324 -t 51.293` 窗口边缘 snap 到 downbeat；`afade=t=out:st=49.5:d=1.79` 尾部淡出；重编码 `libmp3lame -b:a 256k`。
- **卡点**：不靠耳朵对拍。`audiomap.json` 的 `grid.beats_sec[]` 是唯一时钟源，帧边界、动画时间戳、SFX 的 `data-start` 全部从里面取值。
- **SFX 音效层**：14 个 cue 作为独立 `<audio>` 元素挂在 track 12–16，与 BGM 解耦，用 `data-volume` 调平。完整 cue 表：

| 时间 | 音效 | 音量 | 作用 |
|---|---|---|---|
| 0.10 | typing | 0.5 | 终端打字 |
| 2.42 | key-press | 0.6 | kick 同步击键 |
| 4.644 | whoosh-cinematic | 0.55 | SURGE 转场 |
| 4.676 | impact-bass-1 | 0.9 | 主标题砸点 |
| 12.399 | glitch-1 | 0.4 | roll 铺底 |
| **13.65 + 10.03s** | **riser** | 0.4 | **9 秒铺垫，正好推到 DROP** |
| **23.676** | **impact-bass-2** | **1.0** | **DROP 砸点（全片最重）** |
| 25.588 | glitch-2 | 0.35 | roll ride |
| 27.66 / 29.95 | click ×2 | 0.5 | 数据卡落点 |
| 36.966 | glitch-3 | 0.4 | F5 进入 |
| 44.164 | whoosh-short | 0.6 | roll 转场 |
| **47.276** | **impact-bass-1** | **0.95** | **终砸「未来已来」** |
| 48.599 | whoosh-cinematic | 0.3 | 落版收尾 |

- **淡入淡出**：全片只有两处"淡"：BGM 尾部 1.79s 淡出（ffmpeg afade，渲染前烤进音频），以及落版 whoosh 的自然衰减。画面侧零淡入淡出，全部硬切。
- **静音设计**：F6 没有任何新声音——骤停本身就是音效。

## 2.5 渲染与导出

```bash
npx hyperframes render . --skill=music-to-video -q delivery -o renders/ai-beat-sync.mp4 --fps 30
```

- `-q delivery`：交付质量预设；分辨率跟随合成根节点 `data-width/height`（1920×1080）；`--fps 30`。
- 产出实测（ffprobe）：H.264 + AAC，duration 51.300s，15,764,101 字节 ≈ **15.0MB**，总码率约 2.46 Mbps。
- **体积结论**：51 秒 15MB 已在微信/飞书可直接发送的范围内，无需二次压缩。若以后做更长片子需要压缩，再上一道 `ffmpeg -crf 23 -preset slow` 即可，但本次没动渲染原片——**交付的就是渲染直出**。
- 版本锁定：`package.json` 里 pin 了 `hyperframes@0.8.73`，保证几个月后重渲染结果一致。

## 2.6 时间分配与提速建议

本次为无人值守连续作业，墙钟跨度约十几小时（含渲染等待与中断），活跃工时的大致分布：

| 环节 | 占比（估） | 说明 |
|---|---|---|
| 选曲 + 节拍分析 + 裁窗 | ~15% | 含一次作废重跑（见坑①），是最不该浪费的循环 |
| 分镜 + 品牌规范 | ~15% | STORYBOARD 写细了，后面帧开发几乎零返工 |
| 6 帧并行构建 | ~35% | 最耗时。F4 一帧就 920 行、3 个 group |
| check 修复循环 | ~15% | 字体/transform/闪帧/重叠标注，修一轮过一轮 |
| 截图审阅 + 渲染 + 复核 | ~20% | 21 点截图 + 3 次成片抽帧 |

**提速方法（按收益排序）：**
1. **帧开发用 subagent 并行**（本次已做）：6 帧同时开工，品牌块统一注入，比串行快 3 倍以上。
2. **别在裁切后的音频上重跑分析器**（坑①）：直接全曲分析 + 平移，省掉一整个作废循环。
3. **validate-plan 在渲染前跑**：时间轴缝隙在数据层一秒查出，渲染后肉眼极难抓。
4. **check 报错当天修完再渲染**：本次 layout/contrast/motion 全绿后才渲染，一次渲染即通过，没有返工渲染。
5. 沉淀 SFX 库与帧模板（typing/cascade/strobe/rain 都是可复用模板），下次同类型片子直接进入拼装模式。

---

# 三、注意事项与踩过的坑

## 3.1 逐项打勾清单

**开工前**
- [ ] 选曲看能量结构（冷启动+蓄力+DROP+收尾），不看旋律喜好；授权可商用（CC-BY 需署名）
- [ ] 节拍分析器跑的是**完整原曲**；BPM 结果人工抽听验证（数 10 秒拍数 ×6）
- [ ] 裁窗边缘 snap 到 downbeat；窗口本身有起承转合
- [ ] 品牌预设落到 frame.md（色板/字体/使用纪律）；**字体全部下载本地化**，禁用网络字体
- [ ] `package.json` pin 死 hyperframes 版本
- [ ] 环境依赖装好：`librosa numpy soundfile`、ffmpeg、本地 GSAP
- [ ] 预览用 `npx hyperframes preview --background`（agent 安全），不要 `npm run dev` 挂前台

**制作中**
- [ ] 每个帧文件**各自**在 `<style>` 顶部声明完整 @font-face 块（相对宿主根路径）
- [ ] 所有时间戳取自 audiomap，单位**秒**；帧内用帧本地时间（帧起点=0）
- [ ] 初始隐藏状态写进 **CSS**（`opacity:0;visibility:hidden`），运动态归 GSAP
- [ ] transform 权柄全归 GSAP：居中用 `xPercent/yPercent`，CSS 里不写 `transform: translate(...)`
- [ ] 同一元素多个 fromTo：后面的全部加 `immediateRender:false`
- [ ] 全片禁 `Math.random()` / `Date.now()` / 网络请求：随机用种子 PRNG（mulberry32）
- [ ] 每合成注册一条 paused 根时间轴到 `window.__timelines[id]`；子时间轴不得 paused
- [ ] 重音砸点 ≤2 个；riser 提前 8–10 秒铺；每 2 拍必有可见变化
- [ ] 数字/事实全部真实，不得编造

**导出前**
- [ ] `node validate-plan.mjs`：0 缝隙 0 warning → 才允许渲染
- [ ] `npm run check`：layout / contrast / motion 全绿；蓄意重叠已标 `data-layout-allow-overlap`（溢出标 `data-layout-allow-overflow`）
- [ ] 换色/反色 look 下 chrome 元素对比度单独检查
- [ ] 逐拍截图 contact sheet 人工审阅：无空白帧、无意外重叠、中英字体正确
- [ ] SFX 音量分层：砸点 0.9–1.0，铺垫 0.3–0.5

**交付前**
- [ ] 抽帧从**成片文件**验证关键砸点；**每个时间点单独一条 ffmpeg 命令**
- [ ] ffprobe 确认双流（h264+aac）、时长、体积在可分享范围
- [ ] 音乐署名压进落版帧（CC-BY 义务）
- [ ] 临时验证图（verify-*.png）清理出 renders/

## 3.2 踩过的坑（现象 / 根因 / 解决 / 预防）

**坑① 裁切后的音频重跑节拍分析器，得到假网格（最危险）**
- 现象：对裁好的 51s 音频重跑 `analyze-beatgrid.py`，输出 BPM=78（真实 152）+ 不存在的鼓 roll。若拿它对剪，全片节奏报废。
- 根因：裁切产生的新起止瞬态和相位截断干扰了 librosa 的节拍跟踪；窗口中段的高能量也带偏了 tempo 估计。
- 解决：废弃重跑结果，改用**全曲分析图**（audiomap_full.json），写了个小脚本把 `beats_sec` 整体平移 -46.324 并丢弃窗口外拍点，生成窗口版 audiomap.json。
- 预防：**节拍分析永远只对完整原曲跑一次**；裁窗只做算术平移；正确的 audiomap 是成果物，永不再跑分析器覆盖它。

**坑② ffmpeg 一条命令抽多帧，第二个 `-ss` 静默失效**
- 现象：`ffmpeg -ss 23.8 -i x out1 -ss 47.5 -i x out2` 产出两张**字节级相同**的图，差点误判"渲染画面没变化"。
- 根因：ffmpeg 选项作用域问题，第二个输入的 `-ss` 没生效。
- 解决/预防：**每个时间点单独跑一条命令**；抽帧结果肉眼确认内容确实不同。

**坑③ 帧文件里字体静默回退**
- 现象：帧预览/渲染时 Barlow/Noto 没生效，悄悄回退到系统字体，版面气质全变。
- 根因：帧是独立 HTML 片段（`<template>` 挂载），宿主页面的 @font-face 不自动覆盖帧内渲染上下文。
- 解决：6 个帧文件各自在 `<style>` 顶部注入相同的 @font-face 块，路径相对宿主根（`assets/fonts/...`）。
- 预防：把"帧文件头部字体块"做成模板片段，新帧从模板起手。

**坑④ CSS transform 与 GSAP transform 打架**
- 现象：02 帧 `.g1_ring` 居中用 CSS `transform: translate(-50%,-50%)`，GSAP 一动 transform，居中偏移被覆盖，元素跳位。
- 根因：CSS 和 GSAP 写同一个 transform 属性，GSAP 不感知 CSS 里的初值。
- 解决：居中改由 GSAP 承担（`xPercent:-50, yPercent:-50`），CSS 不再碰 transform。
- 预防：立规矩——**transform 权柄全归 GSAP 一家**。

**坑⑤ fromTo 缺 `immediateRender:false` 导致闪帧**
- 现象：05 帧 `#g3_zoom` 两个 fromTo，后写的 tween 在时间轴起点就把元素渲染到 from 态，画面闪一下再跳走。
- 根因：fromTo 默认 immediateRender:true，多个 fromTo 共用元素时互相抢"初始渲染权"。
- 解决：后续 fromTo 一律 `immediateRender:false`，并在 CSS 写好 `opacity:0` 基线。
- 预防：新写 fromTo 时自问"这是该元素的第一个 tween 吗？不是就加 immediateRender:false"。

**坑⑥ 初始隐藏写在 JS 里，首帧闪现**
- 现象：05 帧 `#g2` 的"初始不可见"由 JS `gsap.set` 设置，渲染首帧已经画出可见状态，闪一下才隐藏。
- 根因：JS 执行晚于首帧绘制。
- 解决：初始隐藏态移入 CSS（`opacity:0;visibility:hidden`）。
- 预防：**初始态归 CSS，运动态归 GSAP**——分工写进模板。

**坑⑦ 蓄意重叠被 layout 检查全部误报**
- 现象：check 报大量重叠 error——但色差层、频闪层、纵深卡片本来就是设计好的叠层。
- 根因：静态检查无法区分"故意"和"事故"。
- 解决：蓄意重叠显式标注 `data-layout-allow-overlap`（f3 卡片、f4 频闪层、f5 色差层），代码雨溢出标 `data-layout-allow-overflow`；其余报错当真 bug 修。
- 预防：设计叠层时同步写豁免标注；标注 = 设计师声明"这里我知道我在干什么"。

**坑⑧ 浅色 look 下 chrome 元素对比度失效**
- 现象：04 帧切到橙色/米白 look 时，顶部 kicker 等装饰文字还是深色模式的灰（#888880），在浅底上糊掉。
- 根因：换 look 只换了底和字，没换 chrome。
- 解决：`showLook()` 里同步翻 chrome 色（浅 look → #111111，深 look → #888880）。
- 预防：任何"换肤"函数，检查清单里加一项"chrome/装饰元素是否同步"。

**坑⑨ 拍不是整数帧**
- 152BPM/30fps：1 拍 = 11.84 帧。若用"持续 12 帧"的思维排动画，51 秒会累积出可感知的脱拍。
- 解决/预防：全片只允许一种计时单位——**秒**，且全部取自 beats_sec。

**坑⑩ 环境/依赖的不确定性**
- 现象（隐患）：网络字体在离线渲染时可能加载失败，导致同一工程两次渲染字形不同。
- 解决：8 个字体文件全部下载到 `assets/fonts/`，GSAP 本地化为 `assets/gsap.min.js`；hyperframes 版本 pin 在 package.json。
- 预防：项目零网络依赖——**可复现才可迭代**。

---

# 四、可复用的模板

## 4.1 代码视频制作流程模板

```
【Phase 0 · 立项】(10min)
  BRIEF.md：主题 / 时长区间 / 品牌预设 / 质量底线(无重叠无空白) / 交付格式

【Phase 1 · 音乐即剧本】(30–60min)
  1. 选曲：能量结构完整(冷启动+蓄力+DROP+收尾)，BPM 140–160，授权可商用
  2. python analyze-beatgrid.py <全曲> --out audiomap_full.json
  3. 按能量曲线裁窗，边缘 snap downbeat：
     ffmpeg -y -v error -ss <起> -t <时长> -i full.mp3 \
       -af "afade=t=out:st=<时长-1.8>:d=1.8" -c:a libmp3lame -b:a 256k bgm.mp3
  4. 从 audiomap_full.json 平移生成窗口版 audiomap.json（勿对裁后音频重跑！）

【Phase 2 · 分镜与品牌】(30min)
  5. STORYBOARD.md：逐乐句映射能量曲线；每帧给出 role_bindings（onset 时间戳）
  6. frame.md：色板+字体+纪律；字体下载到 assets/fonts/

【Phase 3 · 并行构建】(主体工时)
  7. 每帧一个独立 HTML：@font-face 块 + #stage + paused 时间轴注册
     —— 多个帧用 subagent 并行开发，品牌块统一模板
  8. index.html 组装：帧 div 首尾相接 + BGM(track 11) + SFX(track 12–16)

【Phase 4 · 质量闸】(渲染前必须全绿)
  9. node validate-plan.mjs        → 0 缝隙 0 warning
 10. npm run check                 → layout/contrast/motion 全绿
 11. 逐拍截图 contact sheet 人工审阅

【Phase 5 · 渲染与复核】
 12. npx hyperframes render . --skill=music-to-video -q delivery -o renders/<名>.mp4 --fps 30
 13. 成片抽帧复核（每个时间点单独一条 ffmpeg 命令）+ ffprobe 双流确认
 14. 清理临时文件，交付
```

## 4.2 给 AI 的开工提示词模板

```
用 HyperFrames 的 /music-to-video 工作流做一支卡点视频。硬性规则如下，逐条遵守：

【主题与素材】主题：<填主题>。BGM 网上找可商用曲目（CC-BY 优先，140–160BPM，
须含冷启动+蓄力+DROP+骤停结构），按能量曲线裁窗，窗口边缘 snap 到 downbeat。

【节拍纪律】节拍分析只对完整原曲做一次（python analyze-beatgrid.py 全曲 --out
audiomap_full.json），窗口版用算术平移生成，禁止对裁切后音频重跑分析器。全片
所有时间点（帧边界/动画/SFX）取自 audiomap.grid.beats_sec，单位秒，禁用帧数思维。

【画面纪律】1920×1080@30fps。每个帧文件自带完整 @font-face（字体已本地化到
assets/fonts/，禁网络字体）。初始隐藏态写 CSS，运动态归 GSAP；transform 权柄
全归 GSAP（居中用 xPercent/yPercent）；非首个 fromTo 加 immediateRender:false；
禁 Math.random/Date.now/网络请求（随机用 mulberry32 种子）。每合成注册一条
paused 根时间轴到 window.__timelines。

【节奏纪律】全部拍点硬切，零淡入淡出；任何镜头每 2 拍必须有可见变化；全片
bass impact 砸点 ≤2 个（DROP + 终砸）；riser 提前 8–10 秒铺到 DROP；结尾用
音乐骤停做落版。屏幕抖动用 steps(1) 离散缓动同步 kick。

【风格纪律】一套品牌色板+字体锁死全片；点缀色出场 <15% 且只在情绪顶点；
字体分工=信息分层（巨字情绪/中字重锤/mono 小字数据）；每种视觉技法全片只用
一次；所有数字必须真实可查。

【质量闸（渲染前必须全绿）】node validate-plan.mjs 0 缝隙 0 warning → npm run
check（layout/contrast/motion 全绿；蓄意重叠标 data-layout-allow-overlap）→
逐拍截图 contact sheet 人工审阅（无空白/无意外重叠/中英字体正确）。

【渲染与交付】npx hyperframes render . --skill=music-to-video -q delivery -o
renders/<名>.mp4 --fps 30；成片抽帧复核（每时间点单独 ffmpeg 命令）+ ffprobe
确认双流与体积；CC-BY 署名压进落版帧；清理临时验证文件。

时长：<30–60s>。底线：无画面重叠、无空白帧、无脱拍。
```

---

*复盘完成。本文件 + 项目内的 BRIEF.md / STORYBOARD.md / frame.md / audiomap.json 构成完整可复刻资产，下次同类型片子直接从 Phase 1 起跑。*
