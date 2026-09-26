# COSMOS｜从未知，到寂静：代码视频制作 CoExp 复盘

> 复盘范围：基于本次最终成片 `COSMOS_30_STYLES_72s_1080p.mp4`、`COSMOS_Storyboard.md` 与 `COSMOS_Source_and_Storyboard.zip` 中实际交付源码还原。本文尽量只写能从最终工程、生成记录与本轮实际迭代中确认的做法；没有留下精确日志的部分会明确标为估算，而不是事后虚构。

## 成片基线

- 时长：72.000 s。
- 画幅：1920×1080，横屏。
- 展示帧率：30 fps；总展示帧 2160。
- 定格姿态频率：10 Hz；每个姿态保持 3 个输出帧。
- 镜头数：30；每镜 2.4 s；每镜 72 帧。
- 配乐：原创程序合成，200 BPM；1 拍 = 0.3 s；每镜正好 8 拍，也就是两个 4/4 小节。
- 视频：H.264 High / yuv420p，最终视频码率约 1.97 Mb/s。
- 音频：AAC-LC / 48 kHz / stereo / 256 kb/s 目标，最终实测流码率约 270.7 kb/s。
- 文件：20,212,569 bytes，约 20.2 MB（十进制）。
- 最终音频母带：-14.0 LUFS，true peak -2.01 dBTP，LRA 4.7。
- 所有视觉与音乐均由工程代码生成；没有拼第三方视频和歌曲。中文说明烧录进画面，同时另存 SRT。

---

# 一、创作思路

## 1. 如何把需求拆成叙事结构

这次需求其实有三个互相牵制的目标：

1. 至少 20 种、而且要跨 2D / 2.5D / 3D / 4D 的代码视频语言；
2. 每种只给 2–3 秒，整体要像高燃卡点混剪；
3. 所有镜头不能只是“风格展览”，还必须完整讲完“宇宙之前 → 宇宙诞生 → 结构形成 → 地球与生命 → 未来 → 可能的热寂”。

最后采用的关键数学约束是：**30 镜 × 2.4 秒 = 72 秒**。这样既超过 20 种风格，又能把 30 镜平均分成三幕，每幕正好 10 镜、24 秒。

随后反过来用音乐把镜头长度锁死。最终选择 **200 BPM**，因为：

```text
每拍长度 = 60 / 200 = 0.3 秒
每镜长度 = 8 拍 × 0.3 = 2.4 秒
```

这一步非常关键。它让“镜头长度”和“音乐小节”不是凭感觉对齐，而是整数关系：每个镜头正好两个 4/4 小节。后续所有视觉切换、鼓点、riser、impact、UI 里的 8 个节拍点都共享同一套时间基准。

### 三幕叙事

| 时间 | 叙事任务 | 情绪 / 节奏 |
|---|---|---|
| 0.0–24.0 s | 未知、理论边界、暴涨、热大爆炸、粒子、轻元素核、原子、CMB | 从极静、神秘逐渐加速到第一次炽热爆发 |
| 24.0–48.0 s | 黑暗时代、第一批恒星、再电离、宇宙网、星系、重元素、太阳系、地球 | 进入“建造宇宙”的上升段，视觉密度和结构感最强 |
| 48.0–72.0 s | 生命、人类观测、今天的时空、遥远未来、恒星衰老、残骸、黑洞、热寂 | 先短暂回到“人”的尺度，再逐渐冷却、抽离，最终归于寂静 |

更细的情绪曲线是：

- **0–9.6 s：悬念与加速。** BEFORE、四维隐喻、故障边界、暴涨隧道。先不急着把画面塞满，让观众先接受“我们不知道之前是什么”。
- **9.6–24 s：第一次爆发。** 9.6 s 热大爆炸起，暖色和粒子密度明显提升；随后逐步冷却到 CMB。
- **24–40.8 s：结构形成主高潮。** 黑暗时代 → 星体坍缩 → 点燃 → 再电离 → 宇宙网 → 银河 → 超新星，这一段是最“高燃”的宇宙建造段。
- **40.8–52.8 s：从宏观回到我们。** 星尘、太阳系、地球、生命、天文台。视觉上增加浅色场景，给观众一个呼吸段，同时建立“我们就是宇宙演化的一部分”。
- **52.8–64.8 s：时间尺度骤然拉远。** 3+1D 世界线、未来曲线、老去的太阳、最后星光、冷残骸，音乐密度开始收。
- **64.8–72 s：最后一次冲击后退场。** 黑洞镜头给最后一记高能视觉；四维切片把“差异消散”抽象化；最后 AFTER 回到开场同一位置的光点，并逐渐消掉运动与声音。

这里的“闭环”是叙事和构图闭环，不是科学上暗示宇宙必然循环：开场 `BEFORE` 与结尾 `AFTER` 共用同一位置的光点，只是在视觉上让整条时间线收束成一个问题。

## 2. 每个段落 / 场景为什么这样设计

### 开场：不用“爆”，先用“空”

第 1 镜没有马上上粒子海或宇宙爆炸，而是大面积负空间、巨大 `BEFORE`、右侧一个小光点。原因是：如果第一秒就把能量打满，72 秒没有上升空间。开场先把信息压缩到极少，后面每增加一层结构都会更有冲击。

第 2 镜马上放 4D 超立方体投影，不是为了声称宇宙真的有四个空间维，而是用“超出日常直觉的数学对象”承接“时间的边界”。第 3 镜故障扫描线再把观众拉回“理论无法继续”的边界感。

### 第一次加速：暴涨 → 热大爆炸

第 4 镜采用参数化欧普隧道。它用极坐标环、辐射线、log(r) 结构制造空间被急剧拉伸的深度感；第 5 镜立刻切到 3D/fBM 热辐射，把冷色几何转为高亮暖色体积场。这两个镜头是一个典型的“几何 → 物质”转场。

9.6 s 同时也是音乐中的一个大转折点：riser 在前 2.4 秒上升，切入热大爆炸时 crash + impact 落下。视觉和音频都在同一个绝对时间点完成“门槛跨越”。

### 早期物质：让风格从“宏大”切到“可触摸”

热大爆炸之后没有继续堆烟雾，而是连续切换反应扩散、黏土球体、蓝图、剪纸、孔版印刷。这样做有两个作用：

1. 把“粒子、核、原子、光子脱耦”这些抽象过程转译成不同的视觉材质；
2. 避免连续五个“宇宙烟云”镜头造成审美疲劳。

尤其黏土和剪纸加入以后，宇宙史不再只有“冷冰冰的科学图”，而是像一套手工制作的宇宙模型，和定格主题更统一。

### 中段高潮：黑暗 → 点亮 → 宇宙网 → 银河 → 超新星

第 11 镜先故意压暗，建立“没有星星”的低谷；第 12 镜体素积木从分散位置坍缩，第 13 镜用赛璐璐太阳和漫画放射线把点燃做成一次非常明确的视觉 hit。

然后不是直接跳太阳系，而是继续放大结构：点云再电离、拓扑宇宙网、粒子银河。这样叙事上完成“局部恒星 → 大尺度结构 → 星系”的层级升级。

第 17 镜超新星采用漫画冲击帧，`BOOM`、放射星形和 C/O/Fe 元素文字同时出现。它故意不是写实 3D 爆炸，因为这里承担的是“重元素被锻造和抛出”的叙事标点，图形化更像一个句号。

### 回到我们：用浅色镜头降压

第 18–22 镜连续出现拼贴卡片、低多边形太阳系、电影化地球、像素生命、等距天文台。这里的关键不是“更炫”，而是把尺度从亿万光年收回到一个可以理解和触摸的世界。

联系表里可以看到这一段浅背景比例明显增加。它起到视觉换气作用，同时避免全片 72 秒一直是深色宇宙背景。

### 未来段：从“运动越来越多”转为“差异越来越少”

第 23 镜 3+1D 世界线把“现在”当作时间线上的一个截面；第 24 镜用科学图解风格表现未来膨胀；第 25 镜水墨红巨星开始把形态边界变软；第 26–27 镜减少亮点数量、把材质改为金属残骸；第 28 镜黑洞是最后的强视觉；第 29 镜 4D 超球切片开始只剩点与几何；第 30 镜只留光点与逐渐消失的光绘。

这是一条很重要的反向设计原则：**讲热寂不能越到结尾越复杂。** 如果结尾还在疯狂堆特效，会和“可用能量差异逐渐耗尽”的主题打架。

## 3. 节奏、剪辑和音画配合

### 3.1 硬切而不是滥用转场

30 种风格本来就有巨大的材质差异，因此大多数镜头直接在强拍上硬切。没有给每个镜头加统一溶解或花哨 transition，因为那会把风格边界糊掉。

真正承担“连接”的不是转场特效，而是：

- 统一的 2.4 s 镜头长度；
- 每镜 8 拍的节拍结构；
- 固定顶部信息条、底部标题区、进度条和 8 个节拍标记；
- 共同的宇宙时间线；
- 大节点的 riser / crash / impact。

### 3.2 定格不是把成片改成 10 fps

最终 MP4 仍是 30 fps，但画面只在 10 Hz 更新姿态：

```python
for pose in range(24):
    im = make_frame(renderer, scene, pose / 10)
    frame = im.tobytes()
    for _ in range(3):
        ffmpeg_stdin.write(frame)
```

因此每个 2.4 s 镜头有 24 个“作者姿态”，每个姿态在输出里保持 3 帧。优点是：

- 播放器和平台仍得到标准 30 fps 文件；
- 动作有明确的定格跳步；
- 不需要实时浏览器录屏；
- 音频仍能在 0.3 s 拍点上精确工作。

而且定格感不只来自采样率。体素星体有“分散 → 坍缩 → 点燃”的关键姿势；拼贴卡片有离散旋转、接触阴影；天文望远镜只按节拍小角度跳动；材质还使用纸张、黏土、金属、粗粝纹理。

### 3.3 用整数拍解决卡点同步

`B = 0.3` 秒是全工程最重要的节奏常量之一。配乐、画面 `uBeat`、底部节拍 UI 都依赖它。

Shader 接收的拍点脉冲为：

```python
beat = math.exp(-((t / 0.3) % 1) * 8)
```

也就是说每个拍点一开始能量最大，然后快速衰减。热大爆炸镜头的核心亮度就直接乘了 `uBeat`，因此鼓点与亮度不是“目测差不多”，而是同一个数学时钟。

### 3.4 音乐密度不是从头到尾拉满

配乐里前四镜密度约为 0.45；主段提升到 1；生命和天文台两个镜头又主动降到约 0.65；67.2 s 后进入尾声。这样“高燃”有对比，而不是 72 秒持续轰炸。

---

# 二、具体的创作方式

## 1. 技术栈与完整工作流

### 实际技术栈

- **Python 3**：主编排、场景逻辑、离线渲染。
- **NumPy 2.3.5**：几何、粒子、4D 坐标、音频数组。
- **SciPy 1.17.0**：`scipy.ndimage.laplace` / `gaussian_filter`，以及 `scipy.signal` 音频滤波。
- **Pillow 12.3.0**：文字排版、2D 矢量绘制、拼贴、后叠 UI。
- **GLSL 330 Core**：程序材质、fBM、星空、解析球体、银河采样、黑洞近似等。
- **Mesa EGL + OpenGL**：Linux 无头离屏渲染。
- **ctypes**：直接调用 `libEGL.so.1` / `libGL.so.1`，没有依赖 PyOpenGL。
- **FFmpeg / ffprobe**：逐镜 H.264 编码、响度处理、拼接、AAC、章节、最终 QA。
- **字体**：系统安装的 Noto Sans CJK、Noto Serif CJK、Inter、DejaVu Sans Mono。
- **Motion Library Atlas**：前期作为代码动画能力词典使用，主要用于核对“定格不是只降帧”“时间要显式统一”“声音必须用可检验事件对齐”等原则；最终渲染器仍是自写工程，不是套某个统一框架。

### 为什么没有用浏览器录屏 / Three.js / Remotion

这次需要 30 种完全不同的画面语言，而且交付目标是确定性的 MP4。最终选择离线渲染，原因是：

- 不受浏览器实时掉帧影响；
- 每个场景可以直接用 NumPy/Pillow/GLSL 各自最合适的表达；
- `t` 是显式的，任何一帧都可重现；
- 更容易做到 72 帧/镜的严格验证；
- headless Linux 不需要桌面环境。

### 完整流水线

1. **把需求变成 30 镜 storyboard。** 每镜定义 `index/style/dimension/title/caption/epoch/status/start/duration`。
2. **先锁时间。** 30 × 2.4 s；200 BPM；8 beats/shot。
3. **建立统一渲染器。** `glrender.py` 创建 EGL pbuffer，编译一个全屏三角形 vertex shader + `cosmos.frag`。
4. **建立视觉分层。** GLSL 负责底层程序材质和解析 3D；Pillow 负责几何叠加、文字、UI、需要精细控制的 2D/2.5D 元素。
5. **先跑预览。** `python render.py --preview`，每个镜头只取 `t=1.2 s`，640×360，生成 5×6 contact sheet。
6. **针对关键镜头单独迭代。** 本次实际有 shader preview、contact sheet 复查，以及银河镜头的单独 refined 预览。
7. **全分辨率逐镜渲染。** 每个镜头 24 个姿态 × 每姿态重复 3 帧，直接 pipe 给 FFmpeg。
8. **程序生成音乐。** `score.py` 生成 72 s / 48 kHz 双声道 PCM，再 `master_audio.py` 做响度整理。
9. **组装与验证。** `assemble.py` 先检查每个源镜头 72 帧、1920×1080、2.4 s，再 concat + 音频 + chapters，最后写 manifest。
10. **QA。** 完整视频和音频 decode、检查 60 个镜头边界帧非空、ffprobe 核对时长/帧率/stream、记录 SHA-256。

## 2. 项目结构、关键模块和关键代码

```text
COSMOS/
├─ render.py                 # 30 镜主视觉、Pillow、3D/4D几何、定格姿态
├─ cosmos.frag               # GLSL 程序材质 / 解析球体 / 银河 / 黑洞
├─ glrender.py               # ctypes + EGL/OpenGL headless renderer
├─ storyboard.json           # 30 镜结构化分镜
├─ COSMOS_ZH.srt             # 30 段独立字幕文件
├─ score.py                  # 原创 200 BPM 程序配乐
├─ master_audio.py           # FFmpeg loudnorm + 二次线性增益修正
├─ assemble.py               # 镜头验证、concat、AAC、章节、manifest
├─ build.sh                  # 一键构建入口
├─ requirements.txt          # NumPy / SciPy / Pillow 精确版本
├─ chapters.ffmeta           # 30 章节
├─ score.wav                 # 最终母带 WAV
├─ audio_measurements.json   # LUFS / dBTP / LRA
├─ audio_analysis.log
├─ delivery_manifest.json    # ffprobe、hash、QA 数据
├─ QA.txt
├─ contact_sheet.jpg
└─ README_ZH.md

# 运行时生成但没有全部打进源码包：
clips/                       # 00.mp4 ... 29.mp4
stills/                      # 预览帧
score_raw.wav                # 音乐临时文件
concat.txt                   # FFmpeg concat 列表
```

### `glrender.py`：无头 OpenGL

核心环境：

```python
os.environ.setdefault('LIBGL_ALWAYS_SOFTWARE', '1')
os.environ.setdefault('EGL_PLATFORM', 'surfaceless')
os.environ.setdefault('LP_NUM_THREADS', '3')
```

渲染器创建 EGL pbuffer，并通过 `glReadPixels` 把 GPU/软件栅格结果读回 NumPy：

```python
self.locations = {
    name: glGetUniformLocation(self.program, name.encode())
    for name in ['uRes', 'uTime', 'uScene', 'uBeat']
}

u2f(self.locations['uRes'], w, h)

def render(self, scene, t, beat=0.):
    u1i(self.locations['uScene'], scene)
    u1f(self.locations['uTime'], t)
    u1f(self.locations['uBeat'], beat)
    glDrawArrays(GL_TRIANGLES, 0, 3)
    glReadPixels(...)
    return self.buffer[::-1, :, :3].copy()
```

vertex shader 只画一个覆盖全屏的三角形，所有真正的视觉逻辑都在 fragment shader 里，因此不需要维护复杂 GPU mesh pipeline。

### `render.py`：统一时间 + 混合渲染

每一帧先从 GLSL 得到底图，再加 Python/Pillow 层：

```python
def make_frame(renderer, s, t):
    arr = renderer.render(s, t, math.exp(-((t/.3) % 1) * 8))
    im = Image.fromarray(arr).convert('RGB')
    art = Art(im)
    embellish(art, s, t)   # 场景专属几何/文字/拼贴
    overlay(art, s, t)     # 全片统一信息层
    return im.convert('RGB')
```

这个架构非常值得复用：**底层 shader 负责“材质与空间”，Pillow 负责“信息与造型”**。如果全部放 GLSL，中文字体和排版会非常麻烦；如果全部放 Pillow，银河、黑洞、体积噪声又会慢且难写。

### 固定随机种子

视觉和音乐都不是每次 build 随机变化：

```python
RNG = np.random.default_rng(28092026)
# reaction-diffusion 单独使用 default_rng(510)
# score.py 使用 default_rng(802360)
```

这让预览、修图、最终重渲染之间可以一一对应。

### 4D 超立方体的真正做法

16 个顶点来自 4 个坐标轴上的 ±1 组合；如果两个顶点只差一个坐标，就连边。然后真正对 `(x,w)`、`(y,w)` 等平面做 4D rotation，再按 w 做透视压缩，最后才进入普通 3D projection：

```python
HYPER = np.array([
    [1 if (i >> b) & 1 else -1 for b in range(4)]
    for i in range(16)
], float)

for i, j, theta in [(0,3,ang), (1,3,ang*.6), (1,2,.5)]:
    u = q[:, i].copy()
    v = q[:, j].copy()
    q[:, i] = u*np.cos(theta) - v*np.sin(theta)
    q[:, j] = u*np.sin(theta) + v*np.cos(theta)

pts = q[:, :3] / (3.3 - q[:, 3, None]) * 2.5
```

因此它不是“画两个立方体再连起来”的假 4D 图，而是先在 4D 坐标里旋转，再投影。

## 3. 30 种视觉风格是怎么实现的

| # | 风格 | 实际代码方法 |
|---:|---|---|
| 01 | 极简动态字体 2D | GLSL 深色负空间 + Pillow 超大 `BEFORE`；右侧固定光点用多层半透明圆做 bloom，半径轻微衰减。结尾复用同一坐标。 |
| 02 | 四维超立方体投影 4D→3D | 16 个 4D 顶点、32 条边；在 x-w / y-w / y-z 平面旋转，按 w 透视后再做 3D projection。 |
| 03 | 故障艺术与扫描线 2D | GLSL 用 `floor(t*10)`、hash、行扫描、离散彩条制造数据故障；Pillow 叠 `t=0`、UNKNOWN 和理论边界文本。 |
| 04 | 参数线条与欧普隧道 2.5D | 极坐标 `r/angle`、`log(r)` 环、spokes、旋转制造“无限纵深”；没有真正 3D mesh，但视觉上有透视隧道。 |
| 05 | 体积光与热辐射 3D感 | 3D fBM + 二次 warp；径向 ray pattern；热色渐变；中心亮度乘 `uBeat`；最后做 `1-exp(-c*1.35)` tone mapping。 |
| 06 | 反应扩散与液态场 2D | 210×210 Gray–Scott：`Da=.20, Db=.10, feed=.034, kill≈.062`；迭代 750 次，从第 270 次开始每 20 次缓存一帧，共 24 个姿态；自定义四色 palette。 |
| 07 | 黏土微缩定格 3D | GLSL 解析 ray-sphere intersection；六个球按 cluster 聚合；高 roughness、程序 grain、指纹状 normal 扰动、地面软阴影；标签移到物体外部。 |
| 08 | 矢量工程蓝图 2D | shader 生成大小网格；Pillow 用圆、arc、leader line 画 H/He/Li 核结构，核子用红蓝圆点离散组装。 |
| 09 | 层叠剪纸与视差 2.5D | shader 画 7 层不规则同心纸片，每层独立颜色、边缘阴影和纸噪；时间只轻微扰动边缘，避免像液体。 |
| 10 | 孔版印刷与半调 2D | 米白纸张、fBM 椭圆 CMB 示意、蓝/红双色油墨、规则 halftone 点阵和纸噪；右侧加印刷色条。 |
| 11 | 多平面剪影舞台 2.5D | 5 层由不同频率/相位正弦曲线形成的暗色地形 polygon，前后层产生 parallax 感；大字 `NO STARS YET.`。 |
| 12 | 体素积木定格 3D | 82 个随机 3D voxel；`collapse` 从分散到中心，使用自写 Mesh 进行面法线光照与深度排序；1.7 s 后追加点燃放射线。 |
| 13 | 赛璐璐与漫画描边 3D | 解析球体；Lambert 光照被量化成三个 band；轮廓处强制深色；外围图形射线按离散 pose 轻微跳变。 |
| 14 | 全息点云 3D | 1700 点均匀填充球体；3D project 后按半径阈值逐渐“电离”，由暗青点变为亮青点；加扫描线背景。 |
| 15 | 生成式拓扑线框 3D | 34 个随机 3D 节点，每点连最近 3 个邻居；每条 edge 又画 3 条略带正弦弯曲的并行丝线，整体缓慢旋转。 |
| 16 | 粒子银河摄影 3D | 双层方案：GLSL 沿视线 24 次采样构造三臂银河密度 + fBM；Python 再叠 2300 个确定性螺旋粒子，做深度透视和冷暖核色。 |
| 17 | 漫画网点与冲击帧 2D | shader 生成黄/红 radial burst + halftone；Pillow 画交替长短半径的爆炸星形、多描边 `BOOM` 与 C/O/Fe。 |
| 18 | 拼贴与活字印刷 2.5D | C/O/Fe 三张元素卡片独立生成、轻微旋转、每 0.3–0.6 s 改变角度；复制 alpha 生成接触阴影，再贴到纸张底。 |
| 19 | 低多边形纸模 3D | 自写 icosahedron mesh；太阳和行星全部是真正 flat-shaded 三角面；附加轨道圆和 34 个小型 asteroid icos。 |
| 20 | 程序材质与电影星球 3D | 解析球体 + 球面经纬映射；fBM 生成大陆和云；rim light 模拟大气；夜侧用高频 noise 生成城市点光。 |
| 21 | 像素生命与细胞自动机 2D | 72×128 Conway-like cellular automaton；初始随机网格限制在椭圆 mask；缓存 24 代；NEAREST 放大并加 10px 网格。 |
| 22 | 等距微缩机械 2.5D | 自写 box/cylinder/dome 组成天文台、底座、太阳能板、望远镜；统一面光照和 painter’s sort；望远镜倾角按 `round(t/.3)` 离散变化。 |
| 23 | 时空世界线 3+1D | 12 个不同时间截面的空间圆环 + 16 条 worldline；半径随 `t^1.8` 扩张；整体 3D 投影，并额外画时间箭头。 |
| 24 | 数据叙事与科学图解 2D | 浅色坐标系 + 网格；主曲线用指数函数归一化，动画只逐步显露 x 区间；另画虚线线性参考。 |
| 25 | 水墨流体与晕染 2D | GLSL fBM 扭曲的径向 mask，纸张噪声，深红/棕 ink；半径随时间扩大，模拟恒星红巨星阶段的晕染。 |
| 26 | 动力雕塑与装置定格 3D | 6 个金属/发光球按时间依次熄灭；GLSL 解析相机与 Python overlay 共享同一相机基向量，确保 ON/OFF 引导线对准球体。 |
| 27 | 金属材质与粗粝微缩 3D | 5 个金属球体；normal 由多组 noise 扰动；高 metal、低 roughness，并混入自制环境反射颜色，得到冷残骸质感。 |
| 28 | 引力透镜与光线偏折 3D | 不是 GR 数值解，而是 shader 视觉近似：`p*(1 + k/r²)` 扭曲星空；事件视界、photon ring、扁平吸积盘、背面弧和非对称增亮；再叠 Hawking 粒子。 |
| 29 | 四维超球切片 4D→3D | 2000 个 4D 单位向量组成 S³；在 x-w/y-w/z-w 平面旋转；选择 `|w-c|<0.18` 的截面，再投影成 3D 点云。 |
| 30 | 光绘与负空间 2D | 与开场同一深色底和同一光点；5 条正弦光轨在 1.8 s 内逐渐把振幅与 alpha 收到 0；大字换成 `AFTER`。 |

## 4. 音频怎么处理

### 4.1 音乐不是找 BGM，而是直接生成

`score.py` 创建四个 stereo bus：

```python
buses = {
    k: np.zeros((72*48000, 2), np.float32)
    for k in ['drums', 'bass', 'music', 'fx']
}
```

基础声部：

- kick：正弦频率从约 203 Hz 快速落到 48 Hz，并叠高频 click，再 tanh 饱和；
- snare：1–11.5 kHz 带通噪声 + 182 Hz 附近下滑 tone + 两个极短 transient；
- hat / open hat：高频带通噪声；
- Reese bass：0.994 / 1.006 detune、多谐波、tanh；
- pluck：FM-ish 相位扰动 + 短 envelope；
- bell：非整数泛音比 1 / 2.01 / 2.76 / 4.03；
- pad：双声道轻微 detune；
- brass：多个音叠加后 bandpass；
- FX：riser、crash、impact、短 tick。

### 4.2 编曲结构

- 开头 0–9.6 s 用 bell + 36.71/55 Hz hum 建立空间感；
- 0 / 2.4 / 4.8 / 7.2 s 只给关键 kick，避免起手就满鼓组；
- 每镜 8 个 pluck，间隔刚好 0.3 s；另在 0.225 s 加较轻 echo，制造 3/4 拍位的切分；
- 每镜拆成两个 1.2 s 小节块；kick/snare/hat 基于同一 `B=.3` 排列；
- 第 4 镜后整体 density 提升；第 21–22 镜附近主动降低；
- 大型 riser 指向 **9.6 / 28.8 / 52.8 / 64.8 s**；每次目标点叠 crash、impact 和 0.6 s snare roll；
- 67.2 s 后撤掉大部分主段结构，重新用 bell/pad 收尾；
- 最后 1.65 s 总 mix 用 `linspace(1,0)^1.5` 做 fade。

### 4.3 响度处理

不是简单 normalize peak，而是两步：

第一遍：

```bash
ffmpeg -i score_raw.wav \
  -af loudnorm=I=-14:TP=-1.3:LRA=7 \
  -ar 48000 -c:a pcm_s16le score_normalized_tmp.wav
```

随后再次测量 `loudnorm ... print_format=json`，根据实际 `input_i` 和 `input_tp` 计算额外线性增益：

```python
gain = min(-14.0 - input_i, -1.65 - input_tp)
```

本次二次 trim 为约 **-0.76 dB**，最终 WAV 实测：

- Integrated loudness：**-14.0 LUFS**
- True peak：**-2.01 dBTP**
- LRA：**4.7**

这样比只做一次“看起来目标是 -14”的 loudnorm 更稳，也给后续 AAC 编码留了峰值余量。

## 5. 渲染和导出的具体命令与参数

### 5.1 一键构建

`build.sh`：

```bash
export OPENBLAS_NUM_THREADS=1
export LP_NUM_THREADS=3
python render.py
python score.py
python master_audio.py
python assemble.py
```

`OPENBLAS_NUM_THREADS=1` 防止 NumPy/BLAS 在同一机器上过度抢线程；Mesa llvmpipe 则限制为 3 线程。

### 5.2 单镜渲染

每个镜头通过 raw RGB pipe 直接送 FFmpeg：

```bash
ffmpeg -y -loglevel error \
  -f rawvideo -pix_fmt rgb24 -s 1920x1080 -r 30 -i - \
  -an \
  -c:v libx264 -preset fast -crf 18 \
  -pix_fmt yuv420p -threads 2 \
  -movflags +faststart \
  clips/XX.mp4
```

重要点：

- 不是先写 2160 张 PNG 再编码，省掉大量 I/O；
- 每个镜头独立编码，出问题时可以只重渲一个 scene；
- 所有 clip 参数完全一致，为后续 `-c:v copy` concat 做准备；
- CRF 18 保留足够锐度，特别是细线、中文字体和 halftone。

### 5.3 组装最终 MP4

`assemble.py` 先检查每个 clip：

```python
assert int(v['nb_frames']) == 72
assert (v['width'], v['height']) == (1920,1080)
assert abs(float(format['duration']) - 2.4) < .01
```

最终命令等价于：

```bash
ffmpeg -y -hide_banner -loglevel warning \
  -f concat -safe 0 -i concat.txt \
  -i score.wav \
  -i chapters.ffmeta \
  -map 0:v:0 -map 1:a:0 \
  -map_metadata 2 -map_chapters 2 \
  -c:v copy \
  -c:a aac -b:a 256k -ar 48000 \
  -t 72 \
  -movflags +faststart \
  COSMOS_30_STYLES_72s_1080p.mp4
```

这里 `-c:v copy` 非常重要：逐镜已经 H.264 编好，最终只拼，不再重新压一代。既快，也避免文字和细线再次损失。

### 5.4 最终实测

- 1920×1080；
- H.264 High；
- yuv420p；
- 30/1 fps；
- 2160 视频帧；
- 72.000 s；
- video bitrate ≈ 1,965,606 bit/s；
- AAC-LC 48 kHz stereo；
- audio bitrate ≈ 270,721 bit/s；
- 总 bitrate ≈ 2,245,841 bit/s；
- 文件 20,212,569 bytes；
- SHA-256：`a09a203ec3ce5705ea5568b4a0cf55de38ed60ee9968add6626083bb0bc7cd09`。

### 5.5 如果下次平台有更严格的下载大小限制

本次并没有再压第二版，因为 20.2 MB 已经处于可分享体积。若平台要求更小，建议从最终 master 另做 share copy，而不是把源渲染质量一起降掉：

```bash
ffmpeg -i master.mp4 \
  -c:v libx264 -preset medium -crf 22 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 160k \
  -movflags +faststart \
  share.mp4
```

这条是下次的可选压缩方案，**不是本次最终成片实际采用的编码参数**。

## 6. 大致时间分配与如何提速

这次没有保存完整的分阶段 wall-clock 日志，所以不能诚实地写成“策划 3 分 12 秒、渲染 8 分 41 秒”这种伪精确数字。

能确认的是：源码包中文件的保存时间显示，从 `glrender.py` 首个已保留版本到 `delivery_manifest.json` 生成，核心工程文件跨度约 **20.5 分钟**；这不包含此前所有构思，也不能代表每一分钟都在连续计算。

按实际工作量做合理复盘，时间主要分布大约是：

| 环节 | 粗略占比 | 为什么耗时 |
|---|---:|---|
| 叙事 / 30 风格映射 / storyboard | 15–20% | 要确保每个风格不是随机插入，而是服务宇宙时间线 |
| 视觉代码与镜头迭代 | 45–55% | 30 套完全不同的图形逻辑、3D/4D 投影、字体和画面安全区，是最大头 |
| 音乐生成与卡点 | 15–20% | 先试节奏，再写鼓组/贝斯/旋律/FX，最后响度测量 |
| 编码、QA、manifest、打包 | 10–15% | 单镜验证、全片 decode、边界帧、ffprobe、体积/哈希 |

### 最耗时的并不是最后 FFmpeg 拼接

真正昂贵的是：

1. 30 个镜头的视觉差异化；
2. shader 与 Pillow overlay 的坐标匹配；
3. 为防穿模、文字遮挡、风格重复而反复看 contact sheet / 单镜预览；
4. 全分辨率 headless software rendering。

### 下次提速的直接办法

1. **第一分钟先锁 BPM 和镜长。** 不要先做 20 个镜头后再找 BGM。
2. **所有场景先跑 640×360 preview。** 只要构图不对就不要上 1080p。
3. **每镜至少检查 start / middle / end 三个姿态。** 本次 `--preview` 只固定取 1.2 s，下一版最好扩展成 3 帧 contact sheet。
4. **用 `--start` / `--end` 只重渲坏镜头。** `render.py` 已支持。
5. **缓存反应扩散、CA、随机几何。** 本次已经把 24 个 RD/CA 姿态预计算到内存。
6. **把统一 overlay 和场景逻辑分层。** 这样改字幕不会动 shader。
7. **草稿编码改 `-preset ultrafast -crf 23~26`，最终再回 `fast/crf18`。**
8. **有可靠 GPU 时可去掉 `LIBGL_ALWAYS_SOFTWARE=1`。** 但必须做一致性验证，不能为了快牺牲可复现性。
9. **镜头可以进程级并行。** 30 镜彼此确定且独立；但并行数必须和 Mesa / x264 线程数一起限流，防止 CPU 过度争抢。

---

# 三、注意事项与踩过的坑

## 1. 可逐项打勾的检查清单

### A. 开工前

- [ ] 先写完整时间线，再选风格；不要先堆 30 个视觉 demo。
- [ ] 确认哪些内容是事实、假说、数学隐喻、未来条件性情景。
- [ ] 确认 4D 数学投影和 3+1D 时空不是同一概念。
- [ ] 锁总时长、镜头数、单镜时长。
- [ ] 用公式检查 BPM：`shot_seconds = beats_per_shot × 60 / BPM`。
- [ ] 确认输出分辨率、fps、横竖屏、是否需要烧录字幕。
- [ ] 确认字体在运行环境中的真实路径，并测试中文 glyph。
- [ ] 确认 FFmpeg、ffprobe、Mesa/EGL、系统字体是系统依赖，不只看 `pip requirements`。
- [ ] 确认所有外部素材授权；本次选择全部代码生成，降低了这一风险。
- [ ] 预估最终附件大小和平台下载限制。

### B. 制作中

- [ ] 所有随机数固定 seed。
- [ ] 时间必须来自 `t`，不要依赖实时 `time.time()` 驱动画面。
- [ ] 先 640×360 preview，再 1080p。
- [ ] 每个镜头检查首姿态 / 中间姿态 / 尾姿态。
- [ ] 定格要做离散姿势、接触、组装、材质或阴影变化，不要只降 fps。
- [ ] 轻背景和暗背景分别检查字幕对比度。
- [ ] 中文标题、caption、epoch/status 不能互相撞，也不能压到主体。
- [ ] 3D 物体做 painter’s sort / 深度检查；望远镜、底座、球体等检查穿模。
- [ ] shader 主体若要被 Pillow 标注，overlay 必须使用同一相机投影公式。
- [ ] 每个风格至少有一项“结构变化”，不能只换 palette。
- [ ] 硬切镜头检查前一镜末帧与后一镜首帧，不只看单镜中间帧。
- [ ] 音效事件时间写成可验证数字，不要“听起来差不多”。

### C. 导出前

- [ ] 每镜帧数固定，本片应为 72。
- [ ] 每镜时长 2.4 s，容差 <0.01 s。
- [ ] 所有 clip 分辨率、fps、pix_fmt、codec 一致。
- [ ] 音频采样率固定 48 kHz，总采样点数对应 72 s。
- [ ] 测 LUFS、true peak、LRA。
- [ ] 最终 concat 尽量 `-c:v copy`，减少二次损失。
- [ ] 加 `-movflags +faststart` 方便网页边下边播。
- [ ] 用 `-t 72` 给最终 mux 一个硬时长边界。
- [ ] ffprobe 核对 2160 帧 / 30 fps / 72.000 s。
- [ ] 完整 decode 一遍，不能只“播放器能打开”。
- [ ] 检查所有镜头边界帧不是纯黑、空白、尺寸异常。

### D. 交付前

- [ ] 最终 MP4 实际点击播放、拖动 seek。
- [ ] 核对文件大小、hash、文件名。
- [ ] README 写清系统依赖和字体依赖。
- [ ] 源码包里不要打包字体文件，除非明确有再分发权利。
- [ ] SRT 是“单独附带”还是“真正 mux 成可切换字幕轨”，要说清楚。
- [ ] 章节 metadata 能否被常见播放器读取。
- [ ] 下载链接必须指向真实存在的最终文件，不要只报文件名。

## 2. 本次实际遇到 / 暴露的坑

下面把“实际修改过的点”和“最终工程暴露出的复现风险”分开，不把后者冒充成已经崩过一次的错误。

| 坑 | 现象 / 风险 | 根本原因 | 本次怎么解决 | 下次怎么提前避免 |
|---|---|---|---|---|
| 1. 早期节奏测试 144 BPM 不适合 2.4 s 镜头 | 前期确实测试过 144 BPM；它与 2.4 s 镜长不是整数拍关系 | 144 BPM 每拍约 0.4167 s，2.4 s = 5.76 拍，镜头边界很难一直落在同类强拍 | 最终改为 200 BPM：0.3 s/拍，2.4 s=8 拍 | **先做拍数算术再写画面**；2–3 s 镜头优先选能产生整数拍的 BPM |
| 2. “定格”容易退化成低帧率滤镜 | 如果只是把输出改成 10 fps，会像卡顿，不像 stop-motion | 定格语言依赖关键姿态、接触、组装、材质和有意停顿 | 保持 30 fps 交付；10 Hz 生成姿态并保持 3 帧；体素、卡片、望远镜等做离散动作 | 把 display fps 与 pose fps 分开设计 |
| 3. 4D 与 3+1D 很容易混写 | 四维超立方体、世界线都可能被笼统写成“4D” | “四个空间维数学对象”和“3 空间+1 时间”是不同表达 | 镜头 02/29 明确 `4D→3D`；镜头 23 单独标 `3+1D` | storyboard 的 `dimension` 字段从一开始就强制区分 |
| 4. 30 种风格容易变成 30 个互不相干 demo | 视觉差异很大时，剪在一起会像 showreel，而不是一条故事 | 缺少统一的时间、信息层和叙事因果 | 固定顶部栏、底部标题区、进度条、节拍点；按宇宙时间线排序；开/结尾共用光点 | 先做“叙事地图”，再做“风格地图” |
| 5. shader 主体和 Pillow 标注可能漂位 | 3D 球在 shader 里，标签和 leader line 在 Pillow 里，若两套相机不一致会明显错位 | 两个渲染层默认没有共享 screen-space 坐标 | 在“最后星光”镜头中，Python 直接复算 GLSL 同一 `ro/target/fw/rt/up` 相机基，并算球体屏幕位置 | 把 camera/project 函数抽成共享数学定义；不要目测摆 label |
| 6. 黏土球体标签会压主体 | 源码专门留下“labels stay outside clay objects”的修正注释 | 2.4 s 镜头空间紧；主体又在中央聚合 | PROTON / NEUTRON 移到物体外，并用细 leader line 指向 | 先预留信息安全区，不要最后才把字塞进去 |
| 7. 微缩天文台有穿模风险 | 源码明确注明 telescope 独立底座，避免 geometry through dome | box/cylinder/dome 是手写几何，没有物理碰撞系统 | 望远镜单独 pedestal，重新安排圆顶与镜筒位置；倾角只做小幅离散变化 | 3D 微缩先做静态“碰撞审查帧”，再加运动 |
| 8. 银河镜头需要单独 refinement | 本轮实际曾单独输出 `encoded_galaxy` 与 `galaxy_refined` 预览，不只依赖总 contact sheet | 银河同时需要宏观体积、螺旋结构和局部星点，仅一层噪声很容易缺少层次 | 最终采用 GLSL 24-step 密度采样 + Python 2300 螺旋粒子的双层方案 | 对“英雄镜头”单独做局部小样，不要只看 30 宫格 |
| 9. 一次 loudnorm 不等于最终就精确 -14 LUFS | 目标值和实测值可能有偏差，AAC 后还可能抬 true peak | loudness normalization 本身需要测量反馈 | 先 loudnorm，再测 JSON，再做线性 gain trim；本次 gain≈-0.76 dB，最终 -14.0 LUFS / -2.01 dBTP | 把“测量 → 修正 → 再测量”写成固定脚本 |
| 10. 多镜拼接容易产生 71.97/72.03 s 之类漂移 | 30 个独立编码片如果帧数或 timebase 不统一，最终总长会偏 | 只按“每镜大约 2.4 s”输出不够 | assemble 前逐镜 assert 72 frames、1920×1080、2.4 s；音频本身严格 `N=72*48000`；最终再 `-t 72` | **以帧数和采样点数为主，不以肉眼时间条为主** |
| 11. 最终再编码一代会浪费时间和质量 | 30 镜已经是同规格 H.264，再 encode 没必要 | 很多脚本习惯最后统一 re-encode | concat 时 `-c:v copy`，只编码 AAC | 所有源 clip 从第一天就统一 codec/fps/pix_fmt |
| 12. 中文字体在本机成功，不代表换机器能复现 | 本次没有最终乱码，但源码使用 `/usr/share/fonts/...` 的绝对路径 | `requirements.txt` 管不了系统字体；不同 Linux / macOS / Windows 路径不同 | README 明确列出 Noto/Inter/DejaVu；字体路径集中在 `render.py` 开头 | 启动时写 font preflight；找不到就 fail fast，并允许环境变量覆盖路径 |
| 13. Python requirements 不等于完整环境 | `numpy/scipy/Pillow` 装好仍可能因为 `libEGL.so.1`、`libGL.so.1` 或 ffmpeg 缺失而失败 | 系统库和 Python 包是两个层级 | 采用 Mesa EGL headless，并在 README 说明 Linux/Mesa/FFmpeg；`glrender.py` 不依赖 PyOpenGL | 提供 `preflight.py`：检查 ffmpeg/ffprobe、EGL/GL、字体、codec encoder |
| 14. QA 结果保留了，但 QA 生成脚本没进源码包 | 有 `QA.txt`、manifest 的 60 个 boundary luma 结果，却没有独立 `qa.py` | 最终检查是在交付阶段完成，但可复现脚本没有一起整理 | 最终证据仍保存进 `delivery_manifest.json` | 下次必须把 QA 本身代码化并打包，避免“结果可见、过程不可复现” |
| 15. SRT 是单独文件，不是可开关字幕轨 | 最终画面里的中文已经烧录；源码包也有 SRT，但 `assemble.py` 没有 `-map` SRT | 项目需求更偏直接观看，烧录字幕优先 | 保留 `COSMOS_ZH.srt` 作为编辑/再利用文件 | 若要播放器可开关字幕，额外 mux `mov_text`，并明确区分 burned-in 与 soft subtitle |
| 16. 章节会在 MP4 里表现为 metadata/data，而非普通字幕 | ffprobe 能看到 30 章节，同时还有文本 data stream | MP4/QuickTime 对 chapter metadata 的封装方式与 SRT subtitle 不同 | `chapters.ffmeta` 用 `-map_metadata` / `-map_chapters` 写入 | 交付说明不要把 chapter data stream 误叫字幕轨 |
| 17. 文件体积需要在“最终质量”后再判断 | 本次 1080p/CRF18 最终只有约 20.2 MB，其实不需要为了“怕太大”提前糊掉画面 | 程序画面压缩效率通常比真人视频高，预估容易过度保守 | 保持 CRF18 源质量，最终看实测体积后决定是否另出 share copy | 先产 master，再按平台限制做第二版本，不要反过来 |

---

# 四、可复用模板

## A. 下次直接套用的「代码视频制作流程模板」

### 阶段 0：把数学先锁死

```text
目标时长：T 秒
镜头数：N
镜长：D = T / N
每镜拍数：B_shot（建议 4 / 8 / 16）
BPM = B_shot × 60 / D
展示帧率：FPS_display
姿态频率：FPS_pose
每姿态保持帧数：FPS_display / FPS_pose（最好为整数）
```

例如仍要 2–3 s/镜、8 拍一镜：

```text
160 BPM -> 3.0 s
180 BPM -> 2.667 s
200 BPM -> 2.4 s
240 BPM -> 2.0 s
```

### 阶段 1：先写叙事，不写代码

为每镜至少填：

```json
{
  "index": 0,
  "start": 0.0,
  "duration": 2.4,
  "story_event": "发生什么",
  "style": "视觉语言",
  "dimension": "2D/2.5D/3D/4D/3+1D",
  "visual_action": "主体从什么状态变到什么状态",
  "caption": "观众要理解的唯一一句话",
  "status": "事实/假说/示意/条件性未来"
}
```

先检查所有 `story_event` 连起来能不能不看画面也讲通。

### 阶段 2：建立统一渲染接口

所有镜头接受同一种输入：

```python
render(scene_id, t, beat, resolution, seed) -> RGB frame
```

必须保证同一 `scene_id + t + seed` 输出确定。

### 阶段 3：分层

```text
Layer 1: shader / procedural background
Layer 2: scene-specific geometry / particles / collage
Layer 3: typography / labels
Layer 4: global HUD / progress / beat markers
```

不要让每个场景自己复制一份字幕系统。

### 阶段 4：只做 preview

先输出：

```text
每镜 3 个时刻：0%、50%、95%
分辨率：640×360 或更低
contact sheet：按叙事顺序排列
```

检查：重复、空白、越界、主体比例、轻/暗场节奏、色彩曲线。

### 阶段 5：音频先对事件点

建立统一事件表：

```text
shot boundary
beat
bar
riser start
impact
drop
breathing section
outro start
fade start
```

让音乐和画面都读取同一组时间常量。

### 阶段 6：全分辨率逐镜输出

- 每镜独立文件；
- 一致 codec/fps/pix_fmt；
- 能按 `--start / --end` 重渲；
- 不写海量无压缩中间 PNG，优先 raw pipe 到 FFmpeg。

### 阶段 7：音频母带

固定流程：

```text
raw mix -> loudnorm -> measure -> linear trim -> re-measure -> final WAV
```

### 阶段 8：assemble 前先 assert

```text
frame count
resolution
fps
duration
codec
pix_fmt
```

任意一镜失败就停止，不要带病 concat。

### 阶段 9：最终 mux

- 能 copy video 就不再 encode；
- 音频 AAC；
- `+faststart`；
- 需要章节就写 ffmetadata；
- 需要软字幕就明确 mux subtitle stream。

### 阶段 10：QA

最少自动化检查：

```text
ffprobe metadata
full video decode
full audio decode
all shot boundary frames
black/blank frame detection
luma/std sanity
loudness / true peak
file size
SHA-256
```

### 阶段 11：交付

```text
master.mp4
share.mp4（只有需要时）
storyboard.md/json
subtitles.srt
source.zip
README
QA report
manifest.json
contact sheet
```

## B. 给 AI 的开工提示词模板

```text
你要制作一个真正可导出的代码视频，不是只给概念、伪代码或网页 demo。

【主题】
[填写主题]

【最终交付】
- MP4：[分辨率]，[横/竖屏]，[展示帧率] fps
- 总时长：[T] 秒
- 需要同时交付：源代码、分镜 JSON/MD、SRT、contact sheet、README、QA/manifest
- 最后必须给真实可下载文件链接

【叙事要求】
把内容先拆成完整时间线。每个镜头必须既承担叙事事件，也承担一种明确视觉语言，不能把风格随机排列。
对于有科学/历史不确定性的内容，必须在 storyboard 中标记“事实 / 假说 / 数学隐喻 / 条件性情景”，不要把艺术表达写成事实。

【节奏约束】
- 镜头数：[N]
- 每镜目标：[2–3 s 或具体值]
- 每镜拍数：[例如 8 beats]
- 先用 `shot_seconds = beats_per_shot * 60 / BPM` 选择 BPM，确保镜头边界落在整数拍上。
- 视觉、BGM、SFX、转折点必须共享同一时间常量。

【定格要求】
输出可以保持 30/60 fps，但主体姿态要按较低 FPS_pose 离散更新；不要把“定格”理解成简单降输出帧率。
每个定格镜头必须至少有：预备 / 关键接触或组装 / 收束，或明确的离散材质/位置变化。

【视觉范围】
至少包含 [N] 种彼此结构上不同的视觉语言，并覆盖：
2D、2.5D、3D、4D数学投影；如涉及 3+1D 时空，必须和 4 个空间维分开表述。
不要只换颜色滤镜来冒充不同风格。

【技术原则】
- 所有场景必须显式使用 `t`，不能依赖实时播放速度。
- 所有随机过程固定 seed。
- 优先采用分层：程序背景 / 场景几何 / 字幕 / 统一 HUD。
- 先生成低分辨率 contact sheet；每镜至少检查首/中/尾姿态，再进行全分辨率渲染。
- 运行环境必须先做 preflight：FFmpeg、ffprobe、字体、EGL/GL/GPU、Python 依赖。

【音频】
可以程序生成或使用明确授权素材。
必须列出 BPM、beat grid、riser/impact/drop 时间点。
最终母带测量 integrated LUFS、true peak、LRA；不能只凭 peak normalize。

【导出】
每个镜头独立输出且 codec/fps/pix_fmt 一致；组装前 assert 帧数、尺寸和时长。
最终尽量避免二次视频编码；MP4 加 `+faststart`。
输出 master 后再看实际体积，只有超过平台限制才做 share compression。

【QA】
没有通过以下检查之前不要宣称“完成”：
1. ffprobe 时长/fps/帧数正确；
2. 全视频+音频 decode 无错误；
3. 所有镜头边界帧可解码且非空白；
4. 中文字体无缺字和越界；
5. 3D 无明显穿模；
6. 音画事件点逐一核对；
7. 文件大小和下载路径真实存在；
8. 生成 manifest 和 hash。

最后同时输出：
1. 成片链接；
2. 源码包；
3. 分镜与 30/更多种风格说明；
4. QA 结果；
5. 已知限制和没有验证的环境。
```

---

# 最值得直接复用的 10 条经验

1. **镜头时长和 BPM 先做整数关系。** 这次从 144 BPM 测试走到 200 BPM，是整个卡点系统真正稳定的转折。
2. **30 fps 文件 + 10 Hz 姿态** 比“直接导出 10 fps”更适合定格代码视频。
3. **硬切并不可怕。** 风格极多时，统一时间、统一 HUD、统一声音比统一转场更重要。
4. **程序画面的统一不是统一画风，而是统一时间和信息架构。**
5. **2D/Pillow 与 GLSL 不要互相排斥。** 两者分层后效率远高于“全都用一种技术硬做”。
6. **4D 画面必须真的从 4D 坐标算。** 否则只是视觉标签，不是代码表达。
7. **英雄镜头单独 refinement。** 银河、黑洞这类高权重镜头值得脱离 contact sheet 单独优化。
8. **音频响度需要闭环测量。** target 不是 measurement。
9. **逐镜 assert + 最终 full decode** 比“我看了一遍没问题”可靠得多。
10. **把 QA 脚本也当源码。** 本次最大的可复现性遗憾之一，就是 QA 结果进包了，但执行 QA 的独立脚本没有一起打包。

这套工程最值得保留的核心不是某个具体 shader，而是这条方法链：

> **叙事时间线 → 整数节拍 → 多风格镜头映射 → 显式时间/固定种子 → 低分辨率 contact sheet → 逐镜确定性渲染 → 原创或可验证音频 → 严格帧数/响度/边界 QA → 最终无损拼接与可复现交付。**