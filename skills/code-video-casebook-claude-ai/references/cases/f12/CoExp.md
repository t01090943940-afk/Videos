# 《DevTools in 60 Seconds》代码视频复盘

> 项目：60 秒、1920×1080、30fps 的 F12 开发者工具讲解视频（高信息密度、强节奏、炫酷风格），并嵌入一个可交互的仿真浏览器网站。
> 制作时间：2026-09-25 02:08 开工 → 约 03:01 交付（UTC+13），单次会话完成。
> 环境：云端 Linux 容器（2 核 / 7 GB 内存），Node 22、Python 3（numpy 2.4 / scipy 1.17 / Pillow 12）、ffmpeg、Playwright 1.56 + 预装 Chromium。
> 本文只记录这次真实发生的做法和问题。

---

## 一、创作思路

### 1. 需求拆解成叙事结构

用户的要求可以拆成三个硬约束：
- **60 秒**
- **极高信息密度**：讲清 F12 的所有核心面板、各自长什么样、有什么行为
- **极其炫酷**

我的拆法是：**先定音乐网格，再往网格里填内容**。
- BPM 选 128（电子乐常用速度）：1 拍 = 60/128 = 0.46875 s，1 小节 = 4 拍 = 1.875 s。
- 60 s ÷ 1.875 = **正好 32 小节**。所有场景长度都取整数个小节，转场自然落在强拍上。这是“卡点”的根本保证，不需要后期对齐。

场景表（小节数 → 起止时间）：

| # | 场景 | 小节 | 时间 | 能量 |
|---|---|---|---|---|
| 0 | Intro：F12 键帽砸下 + DEVTOOLS 标题 | 2 | 0–3.75 | 积蓄 |
| 1 | Open it：打开方式 + 停靠位置 | 2 | 3.75–7.5 | 积蓄（Riser） |
| 2 | Elements | 3 | 7.5–13.125 | **Drop 1** |
| 3 | Styles / Computed / Layout | 2 | 13.125–16.875 | 高 |
| 4 | Console | 3 | 16.875–22.5 | 高 |
| 5 | Sources（调试器） | 3 | 22.5–28.125 | 高 |
| 6 | Network | 3 | 28.125–33.75 | 高 |
| 7 | Performance | 3 | 33.75–39.375 | 高 |
| 8 | Memory | 2 | 39.375–43.125 | **Breakdown**（喘息） |
| 9 | Application | 2 | 43.125–46.875 | **Drop 2**（更满） |
| 10 | Device mode | 2 | 46.875–50.625 | 高 |
| 11 | Lighthouse | 2 | 50.625–54.375 | 高 |
| 12 | Power tools（命令菜单 + 工具拼贴） | 2 | 54.375–58.125 | 高潮 |
| 13 | Outro：12 面板汇总 + “Press F12” | 1 | 58.125–60 | 收束 |

合计 2+2+3+2+3+3+3+3+2+2+2+2+2+1 = 32 小节。

**能量曲线**：
- 前 7.5 s 是 Intro 和 Riser，负责制造期待。
- 7.5 s 是第一次 Drop，信息从这里开始全速输出。
- 39.4 s 进入 2 小节 Breakdown（Memory）：去掉底鼓，让耳朵喘口气。
- 43.1 s 第二次 Drop，并叠加 Supersaw 和弦，比第一次更满。
- 58.1 s 用 Impact + 长音收尾。

重要度高、交互复杂的面板（Elements / Console / Sources / Network / Performance）给 3 小节，其余给 2 小节。

### 2. 各段设计意图

- **开场（0–3.75 s）**
  - F12 键帽从 −900 px 落下，在第 1 拍（0.469 s）砸地：触发屏幕白闪、两个冲击波圆环（蓝、橙），音频上同时是一次 Impact。
  - 键帽随后缩小上移，“DEVTOOLS”逐字母弹入，用 back 缓动并带颜色残影。
  - 最后弹出 10 个面板标签作为“目录”。
  - 意图：一个动作就说清主题“按 F12”，目录则预告信息量。
- **Open it**：左边的浏览器依次演示右键 → Inspect → 停靠在右侧 → 底部 → 左侧；右侧信息栏把快捷键做成立体键帽，逐个弹出。
- **各面板段落：统一的“双栏”版式**
  - 左侧 1140×808 是仿真浏览器舞台，演示真实操作：光标移动、点击涟漪、悬停盒模型高亮、打字、断点、瀑布图生长等。
  - 右侧 630 宽是信息栏，内容依次为：章节号 → 巨型标题（Bricolage 800，104 px，超宽自动缩放）→ 一句话定义 → 快捷键键帽 → 5–6 条要点（按拍依次滑入）。
  - 意图：观众同时看到“它长什么样 / 它怎么动”和“要记住什么”。
- **信息密度的“三层”**
  - 顶部 HUD：12 段章节进度条。
  - 底部：时间码、“PANEL 05/12”，以及持续滚动的 TIP 跑马灯（12 条冷门技巧）。
  - 背景：巨型描边水印文字（每段不同，例如“200 304 404 500 · NETWORK”）。
  - 静止任一帧都有 4 处以上可读信息。
- **配色即主题**：主色取自 DevTools 盒模型高亮的四色——content #6FA8DC、padding #93C47D、border #FFE599、margin #F6B26B，另加粉 #FF4F8B、青 #3FD8F2。每个面板一个强调色，驱动标题光晕、要点方块、进度条和光斑。
- **高潮（Power tools）**：先是命令菜单打字 “show”，列表高亮下移；1.55 s 后切成 2×2 拼贴（Coverage 红蓝条 / Rendering 绿色重绘闪烁 + FPS / Recorder 步骤 / Changes diff），逐块 pop 进来。画面最满的时刻放在音乐最满的地方。
- **结尾**：12 个面板名方块按 0.05 s 间隔 pop 出来，然后 “Press [F12]” 巨字以 slam 进场，最后一句 “Inspect everything. Break anything. Fix it live.” 首尾呼应开场的 F12 键帽。

### 3. 节奏、剪辑与音画配合技巧

- **音乐网格驱动**：所有时间都写成 `B` 的倍数（`scene(bars, …)` 自动累加），画面和音乐用同一个常量 `B=60/128`，天然同步。
- **每拍脉冲（kick pulse）**：`kick = exp(-7·(t mod B)/B) × energy`。它驱动标题缩放 1+0.035·kick、舞台缩放 1+0.006·kick、背景光斑透明度。只在 Drop 段 energy=1，Intro 段 0.35、Breakdown 段 0.5，所以画面“呼吸”跟音乐能量一致。
- **转场三件套**，全部在场景起点前后 0.14 s 内：
  1. 白色 `mix-blend-mode:screen` 闪光，透明度按 0.55 线性衰减 0.16 s；
  2. 7 条随机的品红、青、黄横向色带（伪随机种子 = 帧号）；
  3. 整个场景加 `drop-shadow` 做 RGB 分离，并水平抖动 ±15 px。

  音频上同一时刻有 Whoosh（在切点前 0.42 s 起，向切点扫频）和 Glitch（8-bit 方波）。
- **场景入场**：舞台 `perspective + rotateY(8°→0) + translateX(-80→0) + scale(0.9→1)`，用 expo 缓动 0.45 s，给每一段一个“甩入”的动势。
- **信息按拍出现**：要点的 `data-in` 间隔取 0.42–0.62 s（约 1 拍），出现节奏和鼓点一致，观众更容易读完。
- **光标 + 点击涟漪**：光标轨迹用关键帧定义，每段最多用 0.45 s 的 easeInOut 移动；点击处出现 0.4 s 的扩散圆环（颜色 = 段落强调色）。这让“演示”看起来像真人操作，而不是幻灯片。
- **粒子**：每拍在随机位置爆出 10×energy 个火花（带重力的抛物线），再加 34 个漂浮的代码符号（`{ } </> $0 =>`），让背景一直在动。

---

## 二、具体的创作方式

### 1. 技术栈与工作流

| 环节 | 工具 |
|---|---|
| 分镜 / 动画引擎 | 单个 `video.html`：原生 JS + CSS，暴露 `window.render(t)`，确定性渲染 |
| 字体 | `npm i @fontsource/bricolage-grotesque @fontsource/jetbrains-mono @fontsource/ibm-plex-sans`，拷贝 woff2 后用本地 `@font-face` 引用 |
| 逐帧截图 | Playwright（Node），`page.evaluate(render)` → `page.screenshot({type:'jpeg',quality:95})` |
| 编码 | ffmpeg：从 stdin 管道接收 MJPEG → libx264 |
| 配乐 | Python：numpy + scipy.signal（butter / sosfilt / fftconvolve）从零合成 → `music.wav` |
| 混流 / 响度 | ffmpeg `loudnorm` |
| 检查 | 抽帧 → Pillow 拼 2×2 联系表 → 人工查看 |

完整步骤：
1. 检查环境：ffmpeg、Node、Playwright 浏览器路径、Python 库、字体、CPU 核数、能否访问 Google Fonts（结果是 403）。
2. 用 npm 装字体，拷贝到 `fonts/`。
3. 写 `video.html`：场景表 + 通用动画系统 + 每场景的 `update(lt)` + HUD + 特效。
4. 写 `render.mjs`：`sample` 模式抽 24 个时间点出图，`full` 模式全量渲染。
5. 抽帧 → 拼联系表 → 看 → 改 → 再抽问题帧（这次改了一轮）。
6. 后台全量渲染 1800 帧（约 6.5 分钟），同时写 `music.py` 并生成配乐（约 7 秒）。
7. ffmpeg 混流 + loudnorm，导出 1080p 母版、720p 网页版和封面图。
8. 按交付渠道的体积上限再压一版。

### 2. 项目结构与关键代码

```
f12/
├─ video.html        # 视频动画引擎（约 700 行）
├─ render.mjs        # Playwright 逐帧渲染 + ffmpeg 管道
├─ music.py          # 配乐合成
├─ fonts/            # 本地 woff2
├─ samples/          # 抽帧与联系表
├─ video_raw.mp4     # 无声 CRF14 中间件
├─ devtools-60s-1080p.mp4                 # 带声母版（CRF17，59 MB）
├─ DevTools-in-60-Seconds-1080p.mp4       # 交付版（26.6 MB）
└─ site/devtools-60s.mp4 + poster.jpg     # 网页嵌入版（720p，10.7 MB）
```

**核心 1：场景按小节注册**
```js
const B=60/128, BAR=4*B; const S=[]; let T0=0;
function scene(bars,def){def.start=T0;def.end=T0+bars*BAR;T0=def.end;S.push(def);return def}
scene(3,{id:'elements',acc:'#6FA8DC',label:'ELEMENTS',info:{…},html:()=>`…`,update(lt,el){…},cursor:[…]});
```

**核心 2：声明式入场动画（绝大部分元素零代码）**
```html
<li data-in="1.2" data-fx="left">…</li>   <!-- fx: up/left/pop/slam/wipe/bar -->
```
```js
s.anims.forEach(a=>{const p=clamp((lt-a.tin)/a.d);
  if(a.fx==='bar'){e.style.transform=`scaleX(${E.out(p)})`;return}
  e.style.opacity=p<=0?0:Math.min(1,p*2.2);
  if(a.fx==='slam')tr=`scale(${lerp(1.9,1,E.expo(p))})`; …
  else if(a.fx==='wipe')e.style.clipPath=`inset(0 ${(1-E.out(p))*100}% 0 0)`;});
```

**核心 3：`render(t)` 必须是纯函数**。所有状态都由 `t` 推导，例如打字机效果：
```js
const n=Math.floor((lt-c.t)*62); row.querySelector('.typ').innerHTML=esc(c.in.slice(0,n))+caret;
```
这样才能任意跳帧、并行渲染、单帧重渲。

**核心 4：光标目标用选择器实时解析**，不用硬编码坐标：
```js
cursor:[[0,1000,700],[1.15,['.stitle',0.4,0.5]],[3.55,['.scta',.55,.55],1]]  // [时间, 选择器/坐标, 是否点击]
function rel(sceneEl,node){const a=stage.getBoundingClientRect(),b=node.getBoundingClientRect();
  const sc=a.width/stage.offsetWidth||1; return{x:(b.left-a.left)/sc,…}}  // 除以缩放，抵消脉冲 transform
```

**核心 5：渲染管道（不落地 PNG）**
```js
const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-',
  '-c:v','libx264','-preset','medium','-crf','14','-pix_fmt','yuv420p',out]);
for(let f=0;f<1800;f++){await page.evaluate(t=>window.render(t),f/30);
  const buf=await page.screenshot({type:'jpeg',quality:95});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
```

### 3. 各视觉风格的代码实现

| 效果 | 实现 |
|---|---|
| 深色科技背景 | `radial-gradient` 底色 + 40 px 网格（`linear-gradient` 两层），每帧 `translate` 滚动 |
| 巨型描边水印 | `font:800 330px; color:transparent; -webkit-text-stroke:2px rgba(255,255,255,.06)`，按 `-t*90 % 1400` 平移 |
| 光斑呼吸 | 1400 px 径向渐变圆，`mix-blend-mode:screen`，透明度 = 0.08 + kick×0.12 |
| 扫描线 + 暗角 | `repeating-linear-gradient` 每 3 px 一条 1.8% 白线；`radial-gradient` 暗角 |
| 标题光晕 | `text-shadow:0 0 40px color-mix(in srgb,var(--acc) 55%,transparent)` |
| 立体键帽 | 渐变底 + `box-shadow:0 4px 0 #0E1322`（厚度）+ 内高光 |
| 盒模型高亮 | 四层 div，外三层只用 `border-width` 画环（margin / 边框 / padding），最内层 content 填色，数值来自 `getComputedStyle` |
| 仿真 DevTools | 真实 DOM 手写 Chrome 深色主题色（标签 #5DB0D7、属性值 #F29766、选中 #0B4A78…），12–15 px 字 |
| 瀑布图 / 火焰图 | 绝对定位 div，每帧重算 left/width；火焰图缩放 = 视窗 [v0,v1] 从 [0,3000] 插值到 [880,1360] |
| 量表 | SVG 圆 + `stroke-dasharray` 动画，分数按阈值变色 |
| 甜甜圈图 | SVG circle + dasharray / dashoffset 拼接 |
| 粒子 / 符号 | 单个 1920×1080 canvas，按拍用种子随机数（xorshift）生成，保证确定性 |
| 故障转场 | 随机色带 div + `drop-shadow` 红青分离 + 抖动（仅在切点前后约 4 帧，避免拖慢渲染） |

### 4. 音频处理（`music.py`，全部代码合成）

- 采样率 44.1 kHz 立体声，长度正好 60 s；小节常量和视频一致。
- **乐器**
  - 底鼓：正弦，音高 45 + 110·e^(−t/0.03) Hz，衰减 0.28 s，叠加高通噪声 click，tanh 饱和。
  - 拍手：3 次噪声脉冲，带通 900–4200 Hz。
  - 闭 / 开镲：7.5 kHz 高通噪声。
  - 贝斯：双锯齿波 + 次八度正弦，520 Hz 低通。
  - 琶音：锯齿波 + 方波，16 分音符，左右交替声像。
  - Supersaw：每音 5 个失谐锯齿。
  - Pad：正弦 + 二倍频。
- **和声**：A 小调 i–VI–III–VII（Am–F–C–G），每小节一个和弦。
- **编排**
  - 0–4 小节：Pad + 过滤琶音；2 小节起加镲；2–4 小节 Riser（带通扫频 300→9000 Hz 的噪声 + 上升音）。
  - 4–21 小节：Drop 1。四拍底鼓，2、4 拍拍手，反拍开镲，16 分闭镲，8 分贝斯；12 小节起叠 Supersaw。
  - 21–23 小节：Breakdown。
  - 23–31 小节：Drop 2（更响的琶音 + Supersaw）。
  - 31 小节：Impact + 长和弦尾音。
- **卡点**
  - Impact：t = B（F12 砸地）、4 BAR、23 BAR、31 BAR。
  - 每个场景切点 `cuts_bars=[2,4,7,9,12,15,18,21,23,25,27,29,31]` 都放 Whoosh（从 tc−0.42 s 起，扫频 6000→400 Hz）和 Glitch（方波 + 量化）。
  - 小节 3 和 22 放 16 连拍手（军鼓滚奏），力度递增。
- **侧链压缩**：每个底鼓生成一条增益曲线 `0.25 + 0.75·(x/k)^0.6`（220 ms 恢复），整轨乘 `sc^0.55`，再叠回一层不被压的底鼓，得到“抽吸感”。
- **混响**：单独一条 send 总线，用随机噪声 × e^(−t/0.55) 作 2.4 s 脉冲响应，经 `fftconvolve` 后以 0.18 混回。
- **母带**：28 Hz 高通；按 99.7 百分位归一化；`tanh(×1.15)` 软削波；开头 10 ms 淡入、结尾 0.6 s 淡出；峰值 0.93。
- **响度**：原始积分响度 −8.6 LUFS（太响），混流时用 `loudnorm=I=-13:TP=-1.2:LRA=9` 统一。

### 5. 渲染与导出命令

```bash
# 1) 无声中间件：1920x1080 / 30fps / CRF14（Playwright 管道内完成）
# 2) 混音 + 响度标准化 → 母版（CRF17，约 59 MB）
ffmpeg -y -i video_raw.mp4 -i music.wav -filter_complex "[1:a]loudnorm=I=-13:TP=-1.2:LRA=9[a]" \
  -map 0:v -map "[a]" -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest devtools-60s-1080p.mp4
# 3) 网页嵌入版：720p，约 10.7 MB（Artifact 单个二进制文件上限 15 MB）
ffmpeg -y -i devtools-60s-1080p.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset medium \
  -crf 23 -maxrate 1700k -bufsize 3400k -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart site/devtools-60s.mp4
# 4) 交付版：1080p 定码率，26.6 MB（聊天发文件上限 30 MiB）
ffmpeg -y -i devtools-60s-1080p.mp4 -c:v libx264 -preset veryfast -b:v 3300k -maxrate 3800k -bufsize 6000k \
  -pix_fmt yuv420p -c:a copy -movflags +faststart DevTools-in-60-Seconds-1080p.mp4
# 5) 封面
ffmpeg -y -ss 2.9 -i video_raw.mp4 -frames:v 1 -vf scale=1280:720 -q:v 3 site/poster.jpg
```

体积估算：目标 MB × 8 ÷ 秒数 = 总码率（Mbps），再减去音频。例如 26 MB × 8 / 60 ≈ 3.5 Mbps → 视频 3.3 Mbps + 音频 192 kbps。

### 6. 时间分配（按本次时间戳粗估）

| 环节 | 用时 | 备注 |
|---|---|---|
| 环境检查 + 装字体 | 约 3 分钟 | |
| 写 `video.html` 引擎和 14 个场景 | 约 15 分钟 | 最耗时的“人工”环节 |
| 抽帧检查 + 修改 | 约 5 分钟 | 24 帧只需 5.6 秒 |
| 全量渲染 1800 帧 | **约 6.5 分钟** | 约 0.21 s/帧，放后台，同时写配乐和网站 |
| 配乐合成 | 约 7 秒（写代码约 5 分钟） | |
| 混流 + 母版 + 720p | 约 2–3 分钟 | 第一次前台执行超时（见坑 8） |
| 压到 30 MB 以下 | 约 1 分钟 | 用 veryfast |

**提速办法**：
- 截图是瓶颈，可以开 2 个 Playwright 进程分别渲染 0–899 和 900–1799 帧，最后用 `concat` 合并（前提是 `render(t)` 是纯函数，这次满足）。
- 调试阶段用 960×540 渲染。
- 转场的 `drop-shadow` 很贵，只在少数帧开启。

---

## 三、注意事项与踩过的坑

### 1. 可逐项打勾的清单

**开工前**
- [ ] 确认时长、分辨率、帧率、横竖屏、语言（中文要单独准备 CJK 字体）
- [ ] 确认交付渠道的体积上限（这次：Artifact 单文件 15 MB；聊天附件 30 MiB）
- [ ] 检查 `ffmpeg`、Node、Playwright 浏览器路径（`/opt/pw-browsers`，**不要**运行 `playwright install`）、Python 库、CPU 核数
- [ ] 测试能否访问字体 CDN（这次 Google Fonts 返回 403 → 改用 npm 的 `@fontsource`）
- [ ] 先定 BPM 和小节表，让时长 = 整数小节

**制作中**
- [ ] `render(t)` 只依赖 t，不依赖上一帧（跳帧测试：直接调用 `render(35.5)` 结果要正确）
- [ ] 所有时间写成 `B` 的倍数，转场落在小节线上
- [ ] 等 `document.fonts.ready` 后才开始渲染（这次用 `window.__ready` 标记）
- [ ] 抽 20+ 帧拼成联系表检查：文字溢出、元素被压扁、遮挡、空白画面
- [ ] 标题等不定长文字做自动缩放（这次按 `scrollWidth > 630` 等比缩小字号）
- [ ] 长任务一律用 `nohup … &` 放后台，并写日志

**导出前**
- [ ] `ffprobe` 检查时长 = 60.000、1920×1080、h264 + aac
- [ ] 检查响度（`ebur128`），统一到 −13 到 −14 LUFS，真峰值 ≤ −1 dBTP
- [ ] 加 `-movflags +faststart`（网页边下边播）
- [ ] 按各渠道上限分别算码率

**交付前**
- [ ] 确认编码进程已结束再 `ffprobe`（否则会报 moov atom not found）
- [ ] 文件体积 < 渠道上限
- [ ] 网页里的视频用真实 Chrome / Safari 验证（Playwright 自带的 Chromium 不能解码 H.264）
- [ ] 附上源码 zip 和重建命令

### 2. 踩过的坑（现象 → 原因 → 解决 → 预防）

1. **第一条环境检查命令没有执行**
   - 现象：返回 “NOT RUN”。
   - 原因：会话中断重启。
   - 解决：原样重跑。
   - 预防：不要假设之前的命令已执行，关键状态重新检查。
2. **Google Fonts 在容器里 403**
   - 原因：Shell 网络走白名单，只放行 npm、pip 等仓库。
   - 解决：`npm i @fontsource/*`，把 woff2 拷到本地，`@font-face src:url(fonts/…)`。
   - 预防：开工就测字体可达性。截图渲染时拿不到字体会**静默回退**成 DejaVu，非常隐蔽。
3. **盒模型高亮叠成不透明色块，把按钮遮住**
   - 原因：margin / border / padding / content 四层都是完整矩形加半透明底色，叠加后接近不透明。
   - 解决：外三层改成只画 `border-width` 的“环”，只有 content 填色。
   - 预防：半透明图层不要整块叠加，要做成互不重叠的区域。
4. **Styles 场景顶部的迷你 DOM 树消失**
   - 原因：父级是 `flex column`，下面内容太长，树的 `overflow:hidden` 让它被 flex-shrink 压成 0 高。
   - 解决：`.tree{flex:none}`。
   - 预防：固定高度的面板一律加 `flex:none`。
5. **Performance 场景的 “1.62 s” 折成两行**
   - 原因：3 张卡片放在 360 px 里，28 px 等宽字放不下。
   - 解决：字号改为 22 px、`white-space:nowrap`，容器加宽到 400。
   - 预防：数字 KPI 一律 `nowrap`，并在联系表里专门看。
6. **底部停靠时页面条只露出半行标题**
   - 原因：96 px 高的页面条正好截在 h1 中间。
   - 解决：加 `.mini` 类（标题 26 px，隐藏副标题和按钮）。
   - 预防：窄条里的内容要单独设计，不能直接缩原版。
7. **命令菜单过滤后高亮消失、下半屏空白**
   - 原因：高亮索引会走到被隐藏的项；列表用了 `min-height` 占位。
   - 解决：高亮只在可见项 `[0,1,2,3,4,8]` 中循环；去掉 min-height，加一行前缀说明（> ! @ : ?）补足信息量。
8. **混流命令 2 分钟超时被杀（exit 143）**
   - 原因：CRF17 + preset slow 编码 1080p，再接一个 720p，前台超过工具 120 s 上限。
   - 解决：改 preset medium，整条链用 `nohup sh -c '… && … && echo ENCODED' > enc.log &` 放后台，再轮询日志。
   - 预防：任何超过 1 分钟的编码都放后台。
9. **`cd dir && nohup cmd &` 之后的 `ls` 找不到文件**
   - 原因：`&` 把整个 `cd && nohup` 列表放进后台子 shell，后面的命令还在原目录执行。
   - 解决：后续命令用绝对路径。
   - 预防：后台任务单独一行，其余全部用绝对路径。
10. **`ffprobe` 报 “moov atom not found”**
    - 原因：检查时编码还没结束，而 `+faststart` 要等最后才写入 moov。
    - 解决：`pgrep ffmpeg` 确认进程结束后再检查。
    - 预防：编码链末尾 `echo DONE` 写入日志，看到它再验证。
11. **交付文件超限**
    - 现象：1080p CRF17 = 59 MB，CRF21 = 35.3 MiB，都超过聊天附件的 30 MiB 上限，发送失败。
    - 原因：动态图形 + 大量小字 + 全屏粒子，CRF 模式的码率不可控。
    - 解决：改定码率 `-b:v 3300k -maxrate 3800k`，得到 26.6 MB。
    - 预防：有体积上限时直接按“目标体积反推码率”，不要猜 CRF。
12. **Playwright 里视频请求失败（REQFAIL mp4）**
    - 原因：开源 Chromium 不含 H.264 解码器。
    - 解决：确认不是文件问题，交付时说明在真实 Chrome / Safari 中可播放。
    - 预防：需要自测播放时，额外导出一份 VP9 / WebM 用于测试。
13. **配乐原始响度 −8.6 LUFS（过响）**
    - 原因：软削波 + 峰值归一化只控制了峰值，没有控制响度。
    - 解决：混流时用 `loudnorm=I=-13`。
    - 预防：合成后立刻用 `ffmpeg -af ebur128` 测量。
14. **音频没有经过人耳试听**
    - 原因：云端环境没有扬声器，只能用响度统计和结构保证卡点。
    - 预防：交付时说明这一点；下次可以另外导出一份 10 秒的片段，请用户先试听。
15. **中文字体与排版**
    - 这次视频全英文，所以没有踩到中文的坑。但容器里只有 Noto Sans CJK，Bricolage / JetBrains Mono 都不含中文，直接写中文会回退。
    - 预防：中文版要在 `font-family` 栈中显式追加 `"Noto Sans CJK SC"`，中文标题不要用负字距（−0.035em 会挤在一起），要点行宽按每行约 22 个汉字设计。
16. **场景之间的衔接**
    - 现象：各场景 DOM 相互独立，初版切换生硬。
    - 解决：统一三件套转场（闪白 + 色带 + RGB 分离），加上统一的舞台甩入，以及强调色通过 CSS 变量 `--acc` 在每段切换。
    - 预防：先写好全局转场，再写各场景，风格才会统一。
17. **ID 重复**
    - 现象：每个场景都有 `#stage` / `#ov`。
    - 原因：场景各自复用了同样的 ID。
    - 解决：所有查询都用 `$(sel, sceneEl)` 限定在当前场景内。
    - 预防：场景内一律用局部查询，或改用 class。

---

## 四、可复用模板

### A. 代码视频制作流程模板

```
0. 需求卡：时长 __s｜分辨率 1920x1080｜30fps｜语言 __｜交付渠道及上限 __MB｜风格关键词 __
1. 定网格：BPM __ → B=60/BPM，BAR=4B，总小节 = 时长/BAR（取整，反推 BPM）
2. 场景表：| # | 场景 | 小节 | 起止 | 能量(积蓄/Drop/Breakdown/高潮/收尾) | 画面要点 | 音效点 |
3. 环境：ffmpeg / Node / Playwright(已装浏览器路径) / numpy+scipy / 字体本地化 / 核数
4. 引擎 video.html：
   - scene(bars,def) 自动累加时间
   - data-in / data-fx 声明式入场；update(lt) 处理特殊动画；cursor 关键帧
   - HUD（章节进度、时间码、跑马灯）、背景层、FX canvas、转场三件套、kick 脉冲
   - window.render(t) 纯函数；fonts.ready 后设置 window.__ready
5. 抽帧：node render.mjs sample 1,2.5,5,…（20–24 帧）→ 拼 2x2 联系表 → 修
6. 全量渲染（后台）：nohup node render.mjs full > render.log &   ← 同时做配乐
7. 配乐 music.py：同一 BPM；Impact / Whoosh / Glitch 放在切点列表；侧链；混响；测 LUFS
8. 混流：loudnorm I=-13 TP=-1.2 → 母版；按渠道算码率出 web 版和交付版；+faststart；封面帧
9. 验证：ffprobe（时长 / 分辨率 / 编码）、体积、真实浏览器播放
10. 交付：视频 + 源码 zip + 重建命令 + 已知限制说明
```

### B. 给 AI 的开工提示词模板

```
你要用“HTML 动画 + Playwright 逐帧截图 + ffmpeg 编码 + Python 合成配乐”的方法，
做一个 [时长]s、1920x1080、30fps 的 [主题] 讲解视频，风格：[高信息密度/炫酷/…]，语言：[中文/英文]。

硬性要求：
1. 先定 BPM（默认 128），让总时长 = 整数小节；所有场景长度取整数小节，并输出场景表（小节 / 起止 / 能量 / 画面 / 音效）。
2. video.html 暴露纯函数 window.render(t)，所有状态只由 t 决定；用 data-in / data-fx 做声明式入场；等 document.fonts.ready 后才开始渲染。
3. 字体本地化（npm @fontsource/* 或系统 Noto CJK），不要依赖 Google Fonts CDN；中文字体栈必须包含 "Noto Sans CJK SC"。
4. 版式：左侧演示舞台（真实 DOM 仿真界面 + 光标 + 点击涟漪）+ 右侧信息栏（标题 / 定义 / 快捷键键帽 / 按拍出现的要点）+ 顶部章节进度 + 底部时间码和跑马灯。
5. 转场统一：闪白 0.16s + 色带故障 + RGB 分离，只在切点前后约 4 帧开启；每拍 kick 脉冲驱动标题缩放和背景光斑。
6. 先抽 20+ 帧拼联系表自查（溢出 / 被压扁 / 遮挡 / 空白），修完再全量渲染；全量渲染和编码一律 nohup 后台执行并写日志。
7. 配乐用 numpy/scipy 合成，与画面同一 BPM；Impact、Whoosh、Glitch 放在场景切点；做侧链；用 ebur128 测响度，混流时 loudnorm I=-13 TP=-1.2。
8. 导出：CRF14 无声中间件 → 混流母版 → 按渠道上限 [__MB] 用“体积×8/秒数”反推码率出交付版；全部加 -movflags +faststart；截一帧作封面。
9. 交付前：ffprobe 校验时长、分辨率和编码；确认编码进程已结束；说明未经人耳试听、Playwright 的 Chromium 不能解码 H.264 等限制。
10. 最后给出源码 zip 和一键重建命令。
```
