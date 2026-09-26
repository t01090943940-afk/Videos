# AI:RISE — 代码驱动卡点视频复盘

> 成片参数：1920×1080 / 30fps / 39.9s / H.264 High@L4.0 / 129.2 BPM 全帧级节拍锁定 / 122MB→72MB
> 核心方法论：**不剪视频，写渲染器。** 整个视频是一个 `renderAt(t)` 纯函数 + 逐帧截图序列。

---

## 一、创作思路

### 1.1 需求 → 叙事结构的拆解

原始需求只有四个关键词：AI 主题、有价值、高燃卡点、1–5 分钟。拆解路径：

- **"有价值"** → 不能只是炫技，需要一个观点弧线。最终定为：**觉醒 → 能力 → 恐惧 → 回答**。即 "它学会了 → 它能看/写/造 → 它会取代我们吗？→ 人机共生，放大我们"。这是 AI 叙事里最经典也最有信息量的三段论。
- **"高燃卡点"** → 节奏来自音乐而非画面。先选 BGM 再排镜头，而不是反过来。
- **时长**：先做了 102s（v1），用户反馈"宁要 30 秒也要快"后重剪为 40s（v2）——**密度 > 时长**，这是本项目最重要的创作决策转折点。

**情绪曲线与时间的对应（v2 成片）：**

```
能量
 ▲        dropA                          dropB
 │      ┌─┐  ╲                    ╱─╲   ┌─┐╲
 │   ╱  │  │  ╲╱真空          ╱─╯  ╲  │  │ ╲╱尾
 │ ╱    │  │      ╲        ╱─╯       ╲│  │
 │╱     │  │       ╲──────╱          │  │   ─
 └──────────────────────────────────────────► t
  0   3.7  8.8   14.4   17.6  20.4 26.0 26.9  34.4 36.2 39.9 s
  boot reveal rain→slams  问  amplify build 黑场 montage 共生 end
```

| 区间 | 拍数 | 内容 | 情绪 |
|---|---|---|---|
| 0→3.72s | v0–8 | 终端开机（打字+折叠消失） | 悬念、蓄力 |
| 3.72→6.04 | v8–13 | `AI` 560px 巨字砸落（drop A） | 爆发 |
| 6.04→11.61 | v13–25 | 代码雨 IT LEARNED + 神经网格 1.8T | 炫技 |
| 11.61→14.40 | v25–31 | IT SEES/WRITES/CREATES 三连锤 | 加速 |
| 14.40→17.65 | v31–38 | 真空段「它会取代我们吗？」 | 骤然安静（对比） |
| 17.65→20.43 | v38–44 | 双圆融合 AMPLIFY 放大我们 | 回答 |
| 20.43→26.01 | v44–56 | 计数器狂飙+边缘能量条+3·2·1 | 蓄力爬升 |
| 26.01→26.94 | v56–58 | 黑场（一条收缩青线） | 屏息 |
| 26.94→34.37 | v58–74 | **drop B**：16 张领域卡每拍一张 | 最高潮 |
| 34.37→36.23 | v74–78 | 白底「人机共生」 | 顿悟 |
| 36.23→39.94 | v78–86 | AI:// 标 + 金句收尾淡出 | 余韵 |

### 1.2 每场设计意图

- **开场（终端）**：用"代码正在启动"的意象点题——观众第一秒就知道这是"代码做的视频"，同时终端是 AI 最合法的视觉语言。最后 0.6s 整个终端收缩折叠进 drop，完成转场。
- **揭示（AI 砸落）**：全片只有两次真正意义上的"巨型字砸落"，这里是第一次。超大 Anton 字体 + 色差残影 + 每拍抖动，用最大对比度把"主角"立住。
- **能力段（三连锤）**：受用户"说到'它创造'时加人声"启发，三个 2 拍单元各配一个英文 TTS 人声 + 冲击音效 + 左侧色条 + 线性图标（眼/笔/星芒）。2 拍一换=0.93s 一切，是拉片感的最快安全节奏。
- **真空段（问题）**：高燃视频必须有低谷才有对比。黑底衬线字逐字打出中文问题，同时用"真空抽吸"音效把能量瞬间抽空——为后面的 drop B 蓄势。
- **高潮（领域蒙太奇）**：v1 的教训是"卡片重复会腻"。v2 改为 16 张卡每拍一张且**语义递进**：治愈→教导→书写→交易→注视→画像→预测→评判→决定→无处不在→所有人→**你？**。颜色从青→柠檬→琥珀→品红→白→红渐变，最后一张"YOU?"直指观众，完成"细思极恐"的寓意升级。
- **结尾（人机共生→金句）**：白底黑字是整个片子唯一的亮底场景，视觉上"翻页"=叙事上的"答案揭晓"。

### 1.3 节奏与音画技巧

- **节拍网格驱动一切**：`B(k)=k*0.4644s`（实测值），所有动画的起止时间、砸字、闪光、画面切换都写成拍数而非秒数——保证每个视觉事件精确落在鼓点上。
- **脉冲函数**：`pulse=exp(-phase*4.2)`，每拍开始时为 1 并指数衰减。用它驱动抖动幅度、色差宽度、粒子径向冲击、镜头呼吸缩放——画面在每一拍"打一拳然后衰减"，这是"卡点感"在逐帧层面的实现。
- **Strobe 反转**：蒙太奇段奇数拍整屏反白底黑字，0.46s 一次黑白交替=癫痫式频闪，是最便宜的"燃"手段。
- **动静对比**：真空段与黑场两处"几乎全黑"的时刻（各 ~1s），都让画面有呼吸，也让 drop 更有力。
- **音画点位的绑法**：SFX 不写"第几秒"，写"第几拍"（`adelay=beat*464ms`），BGM 剪断点也只在拍边界——音画永不错位。

---

## 二、具体的创作方式

### 2.1 技术栈与工作流

| 环节 | 工具 | 实际用法 |
|---|---|---|
| 节拍分析 | `librosa` (beat_track, 锁 start_bpm=129, tightness=200) | 输出 beats[]+energy[] → timeline.json |
| 画面渲染 | HTML5 Canvas + DOM + CSS，**无动画库**，全部手写 | `renderAt(t)` 纯函数 |
| 逐帧截图 | Playwright headless Chromium ×6 worker | `page.evaluate("renderAt(t)")` → screenshot jpeg q90 |
| 音频剪辑 | ffmpeg filter_complex (atrim/concat/adelay/amix/alimiter) | BGM 按拍剪 + 50 个 SFX + 8 条 TTS |
| TTS | `edge-tts`（微软神经网络，免费） | en-US-ChristopherNeural / en-GB-RyanNeural |
| 编码 | ffmpeg libx264 | CRF21 母带 / CRF22+maxrate14M 分发版 |
| QC | ffmpeg blackdetect/freezedetect + 抽帧目检 | 逐场景截图检查 |

**工作流**：选 BGM → 写节拍检测脚本 → 人工设计场景表（拍数×内容）→ 写 index.html 分层画布 → 写 main.js 场景 → Playwright 逐帧渲染 → ffmpeg 混音 → 合成 MP4 → 抽帧 QC → 改代码重渲（局部帧重渲）→ 交付。

### 2.2 项目结构

```
video/
├── index.html      # 分层渲染画布：bg/stageA/stageB/fx/scan/grain/vig/hud/lb/flash
├── timeline.js     # TL={bpm,beat0,interval,beats[191],energy[191]} 由 librosa 生成
├── main.js         # 引擎+全部场景（~760行）：helpers + 12个scene + HUD + renderAt
├── render.py       # 6 worker Playwright 逐帧截图
├── audio_mix2.py   # 生成 ffmpeg filter_complex：BGM四段拼接+TTS+SFX
├── tts_gen.py      # edge-tts 批量生成 8 条英文人声
├── fonts/          # Anton / ArchivoBlack / SpaceGrotesk
├── audio/          # mk_403.mp3(BGM) + sfx_*.mp3 ×28 + tts/*.mp3
├── frames/         # f_00000.jpg … f_01197.jpg（412MB中间产物）
└── ai_rise_v2_fix.mp4
```

**分层架构（index.html 里按 z-index 叠放）**：

```
z0 canvas#bg      —— 渐变底 + 透视网格 + 560粒子 + 冲击环
z0 div#stageB     —— 转场时的上一场景
z1 div#stageA     —— 当前场景（DOM 文字/元素）
z3 canvas#fx      —— 扫光条
z4 #scan          —— CSS 扫描线（repeating-linear-gradient）
z5 canvas#grain   —— 960×540 噪点放大像素化铺满（胶片颗粒）
z6 #vig           —— 径向暗角
z7 #hud           —— HUD：EQ条/SEQ字幕/帧号/进度线
z8 #lb            —— 56px 黑边 letterbox
z9 #flash         —— 白闪覆盖层
```

**核心代码模式**——每个场景是 `scene(id, 起始拍, 结束拍, build, draw)`：

```js
function beatInfo(t){
  const i=Math.floor(t/TL.interval);           // 当前第几拍
  const phase=(t-B(i))/TL.interval;            // 拍内进度 0~1
  const pulse=Math.exp(-phase*4.2);            // 拍脉冲：1→0 衰减
  return{i,phase,pulse,accent:i%4===0,e};
}
function slam(t,t0,dur=0.34){                  // 砸字缓动
  const k=clamp((t-t0)/dur,0,1);
  return{scale:1+2.6*(1-easeOutExpo(k)),op:...,blur:(1-k)*22,k};
}
scene('slams',B(25),B(31), build=>(...), draw=>(div,t)=>{ /*每帧按t算样式*/ });
```

**转场**：`renderAt` 在场景起始后 0.16s 内把上一场景画进 `#stageB`（加抖动+hue偏移淡出），新场景在 `#stageA` 用 `clip-path: inset(0 0 X% 0)` 竖向划入。**关键**：prevScene 必须是 `scenes[sidx-1]`（时间轴上的前一个），不能是"上次渲染的场景"——多 worker 交错渲染时后者会错。

### 2.3 每种视觉风格的实现

- **砸字**：`scale(1+2.6*(1-easeOutExpo))` + `blur(22px→0)` + textShadow 红蓝双色分离（宽度=pulse×14px）+ 每拍微抖动（mulberry32 种子随机，保证确定性）
- **色差/故障**：三层同文字叠放 `mix-blend-mode:screen`，红 -dx / 青 +dx 偏移，主层白色
- **代码雨**：44 列 Canvas 逐列随机速度下落，每列头白尾青渐隐，字符池含片假名/符号/希腊字母；列速随场景进度 ramp×1.6 加速
- **3D 神经网**：5 层 44 节点，y 轴旋转投影 `sx=cx+xr/z*scale`，层间连线按"波峰函数"逐拍扫过亮边
- **粒子**：560 个种子化粒子，`z` 深度投影；三种模式 ambient/burst(拍脉冲径向外冲46px)/warp(拖尾线)
- **颗粒**：160×160 噪点 tile 铺满 960×540 再像素化放大——每帧用帧号做随机偏移种子 → 确定的"胶片抖动"
- **终端打字**：逐字 `slice(0, floor((t-t0)*60))` + 光标块 `"&nbsp;"` 背景色闪烁
- **黑白频闪**：蒙太奇里 `rel%2===1` 时给最底层盖白色 div，文字反黑

### 2.4 音频处理

**BGM**：Mixkit mk_403（129.2bpm，104s）。v2 按时长诉求把 BGM 在**拍边界**剪成 4 段：

```
atrim=9.2415:12.9567  → 前奏尾巴 8 拍（引入）
atrim=12.9567:25.9599 → dropA 段 28 拍
atrim=64.9694:75.1865 → build 段 22 拍
atrim=75.1865:86.3318 → dropB+尾 24+4 拍
concat → afade=t=out:st=37.9:d=1.9
```

**SFX**（28 个 Mixkit 音效，全部按拍落点 `adelay=ms|ms`）：
- 冲击落地：sfx_1143/788@dropA、sfx_2908+1143@dropB
- 转场呼啸：sfx_2595/1044/1093 各场景入口
- 真空抽吸：sfx_2608@真空段、sfx_1088 磁带倒带@黑场前
- 三连锤垫底：sfx_2150 punch 每条人声下垫一个
- 节奏 tick：sfx_2521 逐拍渐强铺满 build 段
- 环境底：sfx_2507 全程 -30% 音量铺底
- 终点：sfx_2672 swell + sfx_1039 低频垫底 + sfx_2521 收尾 tick

**TTS**：edge-tts 生成 → `silenceremove` 去首尾静音 → `highpass=160Hz` → `aecho` 双延迟回声（空灵）→ `volume×1.55`；阴暗音色再加 `asetrate*0.9` 降调。**中文 TTS 实测难听，全部英文**。

### 2.5 渲染与导出参数

```bash
# 逐帧渲染（6 worker）
python3 render.py            # DUR=39.95 → 1198 帧 jpeg q90

# 混音
python3 audio_mix2.py        # → audio/mix2.m4a (amix normalize=0 + alimiter 0.95)

# 母带（高码率存档）
ffmpeg -framerate 30 -i frames/f_%05d.jpg -i audio/mix2.m4a \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -movflags +faststart out_master.mp4

# 分发版（兼容性优先）
ffmpeg -framerate 30 -i frames/f_%05d.jpg -i audio/mix2.m4a \
  -c:v libx264 -preset slow -crf 22 -maxrate 14M -bufsize 28M \
  -level 4.0 -pix_fmt yuv420p -r 30 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a aac -b:a 160k -ar 48000 -ac 2 -movflags +faststart -shortest out_share.mp4
```

要点：频闪/噪点内容码率极高（CRF21→24Mbps），分发时必须 `-maxrate` 限速否则部分播放器解码吃力；`yuv420p`+`bt709` 标签写死避免色彩偏移；`-shortest` 防音视频尾部不齐。

### 2.6 时间分配与提速

| 环节 | 实际耗时 | 备注 |
|---|---|---|
| BGM 挑选+节拍分析 | ~15% | 18 首候选逐一跑 onset/energy 对比 |
| 引擎+场景开发 | ~45% | 最耗时；v1 的 CSS bug 调了很久 |
| 逐帧渲染 | ~10% | 1198帧/6worker ≈ 几分钟，很快 |
| 混音+合成 | ~10% | ffmpeg 秒级 |
| QC+返工重渲 | ~15% | 含 v1→v2 结构性重构 |
| 导出兼容版 | ~5% | |

**提速建议**：抽帧目检优先于整片渲染回放；改场景只重渲受影响帧段（`render_rng.py` 模式）；BGM 节拍分析一次跑对（锁 start_bpm 防半速误判）比事后改时间轴省一小时。

---

## 三、注意事项与踩过的坑

### 3.1 检查清单

**开工前**
- [ ] BGM 拿到文件而非流媒体；跑 librosa 时**锁定 start_bpm**（这首差点被识别成 64.6 半速）
- [ ] 确认字体文件实际存在：中文用系统 `NotoSansCJK-Black.ttc`（file:// 绝对路径），西文 Anton/ArchivoBlack 放本地 fonts/
- [ ] ffmpeg / playwright / chromium 可用：`page.goto(file://…)` 需 `--allow-file-access-from-files`
- [ ] 设计好**拍数场景表**再写代码，不要边写边想

**制作中**
- [ ] 每个 `scene()` 的起止都用拍数 `B(k)`，绝不写裸秒
- [ ] DOM helper（el/txt/mono/cjk）的 position:absolute 会污染 flex/grid 子元素——布局容器里的子项要覆写 `position:relative`
- [ ] 改场景后**只重渲那一段帧**，别整片重渲
- [ ] `white-space:pre` 必须加在等宽字体文本容器上，否则 `\n` 被吃掉
- [ ] 覆盖层（strobe/遮罩）要么先建要么显式 z-index，DOM 顺序=绘制顺序
- [ ] transition 的"上一场景"按时间轴索引取，不按渲染历史取

**导出前**
- [ ] blackdetect + freezedetect 跑全片；每个 hit 抽帧目检确认是刻意暗场
- [ ] 帧数=DUR×FPS，帧序列连续无缺号（`ls frames | wc -l`）
- [ ] 音画时长差 ≤0.1s，结尾 `-shortest` 或 `afade` 对齐
- [ ] TTS/SFX 的 `adelay` 用拍数×464ms 算 ms，别手算秒

**交付前**
- [ ] 分发版加 `-maxrate/-bufsize/-level 4.0/-ar 48000`，实测 ffmpeg 全程解码零错误
- [ ] 体积 >200MB 时主动压一版（CRF22+maxrate14M 约 72MB 可随便发）
- [ ] faststart 必加（流媒体预览要 moov 前置）

### 3.2 实际踩过的坑

| # | 现象 | 根因 | 解决 | 预防 |
|---|---|---|---|---|
| 1 | 全部场景挤在画面顶部、百分比定位全失效 | scene build 里 `div.id='xxx'` 覆盖了 stageA 的 id，`#stageA{position:absolute}` 不再命中 → 元素变 static 高度塌成 0 | 删掉所有覆盖 stage 容器 id 的赋值 | **永远不要给场景宿主容器改 id**；宿主只传引用 |
| 2 | el() 报 appendChild 错误 | 参数顺序：传了 html 到 parent 槽位 | 统一 `el(tag,css,parent,html)` 签名，所有调用自查 | 封装 helper 后写调用示例再批量用 |
| 3 | 蒙太奇白闪盖住文字 | strobe div 最后 append → 画在文字上层 | 创建顺序改到最前 | DOM 覆盖层始终先建/或用 z-index |
| 4 | 转场渲染了错误的上一场景 | prevScene 用"上次渲染的"——6 worker 交错时错乱 | 改 `scenes[sidx-1]` 按时间轴取 | 纯函数渲染：任何状态都不依赖历史 |
| 5 | 闪光帧偏 1 帧（打到上一场景尾帧） | `Math.round` 取整越界 | 改 `Math.ceil(B(k)*FPS)` | 拍→帧换算一律 ceil |
| 6 | 终端文字全挤成一段 | mono 容器没 `white-space:pre`，`\n` 被吞 | 加 `white-space:pre` | 等宽文本容器默认带 pre |
| 7 | build 段计数器全部叠在一起 | mono() 默认 `position:absolute`，flex 行内失效 | 行内子元素覆写 `position:relative` | flex/grid 里不用 absolute helper |
| 8 | 黑场（blackout）场景完全不出现 | scenes.find 取第一个匹配，`build` 与 `blackout` 时间段重叠 | 时间段错开不重叠 | 场景表画一遍拍轴，确认无交叠 |
| 9 | v1 前段"放完动画空等 2-3s" | 场景按内容长度排、不是按节奏排 | v2 全部重排：信息 1-2 拍落定、每拍必须有新东西 | 设计原则：每拍一个变化点 |
| 10 | 蒙太奇重复卡片观感疲劳 | 10 卡循环 4 次无变化 | 16 卡只放一次 + 语义递进 + 颜色分段 | 重复必须每次升级/有寓意 |
| 11 | "后半段格式错误"（播放器打不开） | CRF21 母带 24Mbps 码率过高，部分播放器/预览器扛不住 | 重导出 CRF22+maxrate14M+L4.0+48kHz | 交付版永远限速限级，母带另存 |
| 12 | 中文 TTS 很塑料 | 中文 neural 语音质量差 | 全部英文配音 + 高通+回声电子化 | TTS 只用于英文卡点词 |
| 13 | 102s 版本信息密度低 | 时长≠价值 | 重剪 BGM 取高能段，成片 40s | 先定密度目标（每拍新事件）再定时长 |

---

## 四、可复用模板

### 4.1 代码视频制作流程模板

```
0. 选 BGM → librosa 锁 tempo/tightness 出 beats+energy → timeline.json
1. 场景表（拍数轴上画出每场起止拍 + 每拍的事件点，保证零交叠）
2. index.html 分层画布（bg/stageA/stageB/fx/scan/grain/vig/hud/lb/flash 复制即用）
3. main.js：helpers(clamp/ease/slam/beatInfo/rand) + particles + scene 数组
   - 所有时间写 B(k)；所有运动吃 bi.pulse；build/draw 分离
4. render.py：Playwright ×6 → renderAt(f/30) → jpeg q90
5. audio_mix.py：BGM 拍边界 concat + SFX/TTS adelay=拍×interval + amix+alimiter
6. ffmpeg 合成 → blackdetect/freezedetect → 每场景抽帧目检 → 局部重渲
7. 交付版：crf22 + maxrate14M + level4.0 + 48kHz + faststart + bt709
```

### 4.2 给 AI 的开工提示词模板

```
帮我用代码渲染一个卡点 MG 视频（非剪辑），要求：

- 主题：____（需要有观点弧线，如：觉醒→能力→恐惧→回答）
- BGM：自备或选免版税 120–140BPM 电子乐；先用 librosa 实测节拍
  （start_bpm 锁定，tightness=200），输出 beats[]/energy[] 到 timeline.json
- 时长：按内容密度定，每拍至少一个新信息点，允许 30–60s 高密度 > 120s 松散
- 实现：HTML5 Canvas+DOM 分层渲染，写 renderAt(t) 纯函数（确定性、帧级可寻址）；
  Playwright 6 worker 逐帧截图 1920×1080@30fps jpeg q90 → ffmpeg 合成
- 场景单位用"拍"不写秒；每场景给 build/draw 两函数；
  必须含：砸字(easeOutExpo 2.6x)、色差残影、逐拍脉冲抖动、strobe反转段、
  至少一处真空/黑场蓄势、HUD(进度条+EQ+帧号)、噪点颗粒+扫描线+letterbox
- 音频：BGM 只在拍边界剪接；SFX 用 adelay=拍×间隔 落点；
  TTS 只用英文(edge-tts)+高通+回声处理，只在关键卡点词出现
- QC：blackdetect/freezedetect 全片扫 + 每场景抽帧目检 + 帧序列连续性检查
- 交付：CRF22+maxrate14M+level4.0+48kHz stereo+faststart+bt709，≤200MB
- 底线：无画面重叠、无空白帧、无与音乐错位的剪切
```

---

*复盘基于 2026-09 实际制作过程；源文件：`video/` 目录下 `index.html / timeline.js / main.js / render.py / audio_mix2.py / tts_gen.py`。*
