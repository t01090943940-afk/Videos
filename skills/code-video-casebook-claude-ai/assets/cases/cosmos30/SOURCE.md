# cosmos30 · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show cosmos30 <路径>`；还原成真实目录：`python3 scripts/casebook.py copy cosmos30 <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `COSMOS/COSMOS_ZH.srt` | 149 | 28 |
| 2 | `COSMOS/QA.txt` | 9 | 182 |
| 3 | `COSMOS/README_ZH.md` | 132 | 196 |
| 4 | `COSMOS/assemble.py` | 25 | 333 |
| 5 | `COSMOS/audio_analysis.log` | 37 | 363 |
| 6 | `COSMOS/audio_measurements.json` | 6 | 405 |
| 7 | `COSMOS/build.sh` | 9 | 416 |
| 8 | `COSMOS/chapters.ffmeta` | 154 | 430 |
| 9 | `COSMOS/cosmos.frag` | 86 | 589 |
| 10 | `COSMOS/delivery_manifest.json` | 840 | 680 |
| 11 | `COSMOS/glrender.py` | 69 | 1525 |
| 12 | `COSMOS/master_audio.py` | 18 | 1599 |
| 13 | `COSMOS/render.py` | 516 | 1622 |
| 14 | `COSMOS/requirements.txt` | 3 | 2143 |
| 15 | `COSMOS/score.py` | 108 | 2151 |
| 16 | `COSMOS/storyboard.json` | 362 | 2264 |

---

### 1/16 · `COSMOS/COSMOS_ZH.srt`
<!-- casebook-file {"path": "COSMOS/COSMOS_ZH.srt", "lines": 149, "final_newline": true, "sha256": "431b4d3f4b5dc792a366d4bd8becf67173eaaa620615acbf273e88c23c18bed8", "original_sha256": "431b4d3f4b5dc792a366d4bd8becf67173eaaa620615acbf273e88c23c18bed8"} -->
```srt
﻿1
00:00:00,000 --> 00:00:02,400
宇宙之前
所谓“之前”，我们还不知道。

2
00:00:02,400 --> 00:00:04,800
时间的边界
时间是否有起点，仍是未知。

3
00:00:04,800 --> 00:00:07,200
抵达理论边界
现有理论无法描述最初一刻。

4
00:00:07,200 --> 00:00:09,600
空间急剧拉伸
暴涨假说：微小起伏被放大。

5
00:00:09,600 --> 00:00:12,000
热大爆炸
宇宙进入炽热、致密的早期。

6
00:00:12,000 --> 00:00:14,400
粒子的海洋
膨胀与冷却，改变物质形态。

7
00:00:14,400 --> 00:00:16,800
物质开始成形
夸克结合，质子与中子形成。

8
00:00:16,800 --> 00:00:19,200
最初的元素核
最初几分钟，轻元素核诞生。

9
00:00:19,200 --> 00:00:21,600
宇宙变得透明
电子被俘获，原子开始形成。

10
00:00:21,600 --> 00:00:24,000
最古老的光
这束余辉，今天仍能被看见。

11
00:00:24,000 --> 00:00:26,400
宇宙的黑暗时代
恒星尚未点燃，引力悄然工作。

12
00:00:26,400 --> 00:00:28,800
第一批恒星
气体聚拢，终于点燃核聚变。

13
00:00:28,800 --> 00:00:31,200
星光亮起
第一代恒星，照亮漫长黑夜。

14
00:00:31,200 --> 00:00:33,600
光改变了宇宙
星光逐渐让星系间气体再电离。

15
00:00:33,600 --> 00:00:36,000
引力编织宇宙网
物质沿丝状结构汇聚，星系生长。

16
00:00:36,000 --> 00:00:38,400
亿万星辰成河
恒星与气体，汇成壮丽星系。

17
00:00:38,400 --> 00:00:40,800
恒星锻造元素
恒星演化与爆发，丰富了元素。

18
00:00:40,800 --> 00:00:43,200
我们来自星尘
碳、氧、铁，成为新世界的原料。

19
00:00:43,200 --> 00:00:45,600
太阳系诞生
尘埃在年轻太阳周围聚集。

20
00:00:45,600 --> 00:00:48,000
一颗蓝色星球
尘埃聚成地球，海洋逐渐出现。

21
00:00:48,000 --> 00:00:50,400
生命展开
地球上，生命演化出复杂世界。

22
00:00:50,400 --> 00:00:52,800
宇宙开始被追问
直到今天，我们开始追问来处。

23
00:00:52,800 --> 00:00:55,200
走到此刻
宇宙约138亿岁，仍在膨胀。

24
00:00:55,200 --> 00:00:57,600
远方渐不可及
若加速膨胀继续，远方渐不可及。

25
00:00:57,600 --> 00:01:00,000
太阳也会老去
约50亿年后，太阳走向红巨星。

26
00:01:00,000 --> 00:01:02,400
最后的星光
漫长岁月后，恒星时代渐近尾声。

27
00:01:02,400 --> 00:01:04,800
残骸的漫长时代
若持续冷却，残骸将主宰长夜。

28
00:01:04,800 --> 00:01:07,200
黑洞也非永恒
理论预言：黑洞也会缓慢蒸发。

29
00:01:07,200 --> 00:01:09,600
差异逐渐消散
可用于做功的能量梯度持续衰减。

30
00:01:09,600 --> 00:01:12,000
从未知，到寂静
热寂或是终章，但并非定论。
```

### 2/16 · `COSMOS/QA.txt`
<!-- casebook-file {"path": "COSMOS/QA.txt", "lines": 9, "final_newline": true, "sha256": "5d955e4f669aa030403118df29832cfaa787d6e951ee9bc80156206627b99f54", "original_sha256": "5d955e4f669aa030403118df29832cfaa787d6e951ee9bc80156206627b99f54"} -->
```text
PASS: all 30 source shots contain exactly 72 frames at 1920x1080.
PASS: 72 seconds; 2160 display frames; 30 fps.
PASS: complete video and audio decode with no ffmpeg errors.
PASS: all 60 shot-boundary frames decode, have full dimensions and non-flat image content.
Authored pose cadence is 10 Hz, with every pose held for 3 output frames.
Music: original procedural score, 200 BPM, eight beats per shot.
Audio mastered to a -14 LUFS target with a -1.3 dBTP limit before AAC encoding.
See delivery_manifest.json and audio_analysis.log for measured stream information.
Scientific limitations and artistic approximations are listed in README_ZH.md.
```

### 3/16 · `COSMOS/README_ZH.md`
<!-- casebook-file {"path": "COSMOS/README_ZH.md", "lines": 132, "final_newline": true, "sha256": "2689c032dd78c42d36b1d3f9edefe0c561d019579f66fdddce3b775d2a994ac3", "original_sha256": "2689c032dd78c42d36b1d3f9edefe0c561d019579f66fdddce3b775d2a994ac3"} -->
````markdown
# COSMOS｜从未知，到寂静

30 种代码视觉语言，组成一条宇宙叙事。72 秒，横屏 1920×1080，30 fps 输出；主体姿态以 10 Hz 更新，保留定格的离散动作。每镜 2.4 秒，配乐 200 BPM，每镜对应 8 拍。

画面与音乐均由本工程的代码生成，未拼接第三方视频、影视片段或歌曲。无旁白，中文解说已烧录在画面内，另附 SRT。四维镜头采用数学投影或切片；3＋1 维时空镜头另行区分。

这里的“30 种风格”是创作性分类，不是严格互斥、穷尽所有可能性的目录。维度、材质、算法、运动方式本来就是不同分类轴。各镜头用不同的几何、着色、构图与运动机制，而非仅替换颜色滤镜。

## 叙事结构

0.0–24.0 秒：起点之前的未知、理论边界、暴涨假说、热大爆炸、粒子、轻元素核、原子与最古老的光。

24.0–48.0 秒：黑暗时代、第一代恒星、再电离、宇宙网、星系、恒星元素合成、太阳系与地球。

48.0–72.0 秒：生命与人类观测、今天的时空、条件性的遥远未来、恒星衰老、残骸、黑洞蒸发理论与可能的热寂。

开场 BEFORE 与结尾 AFTER 使用同一位置的光点，构成叙事呼应。它不意味着宇宙必然循环、反弹或重新诞生。

## 完整镜头表

| 镜头 | 成片时间 | 视觉风格 | 表现维度 | 宇宙叙事 | 画面上的边界提示 |
|---|---|---|---|---|---|
| 01 | 00.0-02.4s | 极简动态字体 | 2D | 宇宙之前 | 未知 |
| 02 | 02.4-04.8s | 四维超立方体投影 | 4D → 3D | 时间的边界 | 数学隐喻 |
| 03 | 04.8-07.2s | 故障艺术与扫描线 | 2D | 抵达理论边界 | 未知 |
| 04 | 07.2-09.6s | 参数线条与欧普隧道 | 2.5D | 空间急剧拉伸 | 假说 |
| 05 | 09.6-12.0s | 体积光与热辐射 | 3D | 热大爆炸 | 标准宇宙学 |
| 06 | 12.0-14.4s | 反应扩散与液态场 | 2D | 粒子的海洋 | 过程示意 |
| 07 | 14.4-16.8s | 黏土微缩定格 | 3D | 物质开始成形 | 过程示意 |
| 08 | 16.8-19.2s | 矢量工程蓝图 | 2D | 最初的元素核 | 过程示意 |
| 09 | 19.2-21.6s | 层叠剪纸与视差 | 2.5D | 宇宙变得透明 | 过程示意 |
| 10 | 21.6-24.0s | 孔版印刷与半调 | 2D | 最古老的光 | 非实测图 |
| 11 | 24.0-26.4s | 多平面剪影舞台 | 2.5D | 宇宙的黑暗时代 | 过程示意 |
| 12 | 26.4-28.8s | 体素积木定格 | 3D | 第一批恒星 | 时间为近似 |
| 13 | 28.8-31.2s | 赛璐璐与漫画描边 | 3D | 星光亮起 | 过程示意 |
| 14 | 31.2-33.6s | 全息点云 | 3D | 光改变了宇宙 | 过程示意 |
| 15 | 33.6-36.0s | 生成式拓扑线框 | 3D | 引力编织宇宙网 | 结构示意 |
| 16 | 36.0-38.4s | 粒子银河摄影 | 3D | 亿万星辰成河 | 形态示意 |
| 17 | 38.4-40.8s | 漫画网点与冲击帧 | 2D | 恒星锻造元素 | 过程示意 |
| 18 | 40.8-43.2s | 拼贴与活字印刷 | 2.5D | 我们来自星尘 | 叙事概括 |
| 19 | 43.2-45.6s | 低多边形纸模 | 3D | 太阳系诞生 | 过程示意 |
| 20 | 45.6-48.0s | 程序材质与电影星球 | 3D | 一颗蓝色星球 | 程序地貌 |
| 21 | 48.0-50.4s | 像素生命与细胞自动机 | 2D | 生命展开 | 生命的视觉隐喻 |
| 22 | 50.4-52.8s | 等距微缩机械 | 2.5D | 宇宙开始被追问 | 叙事隐喻 |
| 23 | 52.8-55.2s | 时空世界线 | 3+1D | 走到此刻 | 时空示意 |
| 24 | 55.2-57.6s | 数据叙事与科学图解 | 2D | 远方渐不可及 | 条件性未来 |
| 25 | 57.6-60.0s | 水墨流体与晕染 | 2D | 太阳也会老去 | 时间为近似 |
| 26 | 60.0-62.4s | 动力雕塑与装置定格 | 3D | 最后的星光 | 长期演化推演 |
| 27 | 62.4-64.8s | 金属材质与粗粝微缩 | 3D | 残骸的漫长时代 | 条件性未来 |
| 28 | 64.8-67.2s | 引力透镜与光线偏折 | 3D | 黑洞也非永恒 | 理论预言 |
| 29 | 67.2-69.6s | 四维超球切片 | 4D → 3D | 差异逐渐消散 | 数学隐喻 |
| 30 | 69.6-72.0s | 光绘与负空间 | 2D | 从未知，到寂静 | 条件性未来 |

## 科学边界与视觉约定

宇宙“之前”是否有意义、时间是否有起点，以及极早期量子引力如何运作，均没有被本片当作已解问题。黑色背景和光点是叙事隐喻，不是“绝对虚无产生宇宙”的科学证明。[1][2][3]

暴涨是早期宇宙的理论框架，驱动机制仍不明确。片中把暴涨与随后的热演化区分开来；热大爆炸也不是一个物体向既有空旷空间爆炸。[1][3]

原初核合成发生于最初几分钟，原子形成、光子退耦与宇宙微波背景对应约 38 万年后的阶段；第一代恒星的时间只作数量级近似。结构生长、星系演化和恒星元素合成实际彼此交叠，不是互不重叠的历史开关。[1][2][3]

太阳系和地球年龄、太阳走向红巨星的时间，均按科普尺度取近似值。生命镜头使用细胞自动机作复杂性的视觉隐喻，并不模拟生命起源。[4][5][6]

未来段落采用“持续膨胀并走向冷却”的条件性情景。暗能量的性质与演化尚不确定，因此不把热寂包装成唯一、已证实的未来。霍金辐射导致黑洞蒸发在本片中明确标为理论预言。残骸阶段没有假定质子衰变已经得到实验证实。[7][8][9]

热寂指可用于持续做功的能量差异趋于耗尽，而不是宇宙突然爆炸、时间停摆或全部物质瞬间消失。结尾是一种可能情景的艺术收束，不是确定预报。[8][9]

四维超立方体与超球切片由真实四维坐标计算，随后投影到三维／二维。它们只是数学隐喻，不是宇宙实际具有四个空间维度的证据。时空世界线镜头使用三维空间加一维时间的图解语言，不应与四个空间维度混为一谈。

CMB 是程序生成的艺术示意图，不是观测数据；星球地貌是程序材质，不是精确地球地图；黑洞透镜为视觉近似，并非广义相对论数值求解。黑洞环状亮光和飞出粒子是解释蒸发概念的艺术表达，不是实际拍到的霍金辐射。所有几何尺度与时间压缩均不按比例。

## 代码与复现

`render.py`：30 个镜头、字体布局、三维网格投影、四维旋转／切片、Gray–Scott 反应扩散、细胞自动机和逐姿态渲染。

`cosmos.frag`：GLSL 程序材质、解析球体光线求交、三维银河体积采样、蓝图／纸张／半调、星球和黑洞透镜近似。

`glrender.py`：通过 ctypes 调用 Mesa EGL 与 OpenGL，离屏渲染，不需要浏览器录屏。

`score.py`：原创双声道鼓组、Reese 低音、拨弦旋律、和声垫底、合成铜管、上升音、冲击音和尾声。最后使用 FFmpeg 做响度整理。

`assemble.py`：验证每镜 72 帧与 2.4 秒，拼接全部镜头、加入配乐，并写入 30 个可跳转章节。

`storyboard.json`、`COSMOS_ZH.srt`：可编辑字幕与分镜数据。`score.wav` 为已生成的配乐。

本次实际运行环境为 Linux、Mesa/EGL、FFmpeg、NumPy、Pillow、SciPy。字体为本地安装的 Noto Sans CJK、Inter、DejaVu Sans Mono；字体路径集中在 `render.py` 开头，未打包任何字体文件。其他操作系统与字体布局没有测试。

在已安装系统依赖和字体的同类 Linux 环境中，安装 `requirements.txt` 中的 Python 依赖后运行：

```bash
bash build.sh
```

也可以先运行 `python render.py --preview` 生成分镜联系表。完整输出为原生 1920×1080，预览联系表的单格为 640×360。

本片有快速切换、故障艺术与强节奏声。观看时先使用适中音量。

## 素材与许可说明

没有打包第三方歌曲、视频素材、照片或字体。工程依赖、系统图形库和本地字体仍受各自许可约束。科学资料仅用于事实核对，不代表这些机构为本片背书。配乐是程序合成，不是乐队录音或真人演奏。

## 科学核对资料

[1] NASA Science, Universe Overview / Cosmic History
https://science.nasa.gov/universe/overview/

[2] CERN, The early universe
https://home.cern/science/physics/early-universe/

[3] NASA, Big Bang and the Evolution of the Universe
https://science.nasa.gov/astrophysics/programs/physics-of-the-cosmos/big-bang-and-the-evolution-of-the-universe/

[4] NASA Space Place, How Did the Solar System Form?
https://spaceplace.nasa.gov/solar-system-formation/en/

[5] NASA Science, What was the Earth like right after it formed?
https://science.nasa.gov/astrobiology/learning-resources/alp/earth-right-after-it-formed/

[6] NASA Science, Star Types / Main Sequence Stars / Red Giants
https://science.nasa.gov/universe/stars/types/

[7] ESA Euclid, The dark Universe
https://www.esa.int/Science_Exploration/Space_Science/Euclid/The_dark_Universe

[8] Adams & Laughlin, A Dying Universe: The Long Term Fate and Evolution of Astrophysical Objects, Reviews of Modern Physics 69, 337–372 (1997)
https://arxiv.org/abs/astro-ph/9701131

[9] NASA, Shedding Light on Black Holes
https://science.nasa.gov/science-research/astrophysics/shedding-light-on-black-holes/

[10] DESI Collaboration / Berkeley Lab, dark-energy results (19 March 2025): hints of evolution, not a settled replacement for standard cosmology
https://www.desi.lbl.gov/2025/03/19/more-than-a-hint-of-evolving-dark-energy-new-results-and-data-from-desi/
````

### 4/16 · `COSMOS/assemble.py`
<!-- casebook-file {"path": "COSMOS/assemble.py", "lines": 25, "final_newline": true, "sha256": "86ec6e7ea9d43775f37e46860f70931c0f4dfb5478b5b1180ab9f1764ed0c0d5", "original_sha256": "86ec6e7ea9d43775f37e46860f70931c0f4dfb5478b5b1180ab9f1764ed0c0d5"} -->
```python
"""Validate, concatenate and mux the thirty deterministic shot renders."""
from pathlib import Path
import subprocess,json,hashlib,os
BASE=Path(__file__).resolve().parent
OUT=Path(os.environ.get('COSMOS_OUTPUT',str(BASE/'COSMOS_30_STYLES_72s_1080p.mp4')))
rows=json.loads((BASE/'storyboard.json').read_text())
for i in range(30):
 p=BASE/'clips'/f'{i:02}.mp4'
 if not p.exists():raise FileNotFoundError(p)
 d=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
 v=next(x for x in d['streams'] if x['codec_type']=='video')
 assert int(v['nb_frames'])==72,(i,v.get('nb_frames'))
 assert (v['width'],v['height'])==(1920,1080),(i,v['width'],v['height'])
 assert abs(float(d['format']['duration'])-2.4)<.01
concat=BASE/'concat.txt';concat.write_text(''.join("file '"+str(BASE/'clips'/f'{i:02}.mp4')+"'\n" for i in range(30)))
meta=[';FFMETADATA1','title=COSMOS - Thirty Coded Worlds','artist=Original procedural film and score','comment=30 styles / 72 seconds / 200 BPM / 10 Hz stop-motion poses / scientific scenarios are labelled']
for r in rows:
 meta += ['[CHAPTER]','TIMEBASE=1/1000',f"START={round(r['start']*1000)}",f"END={round((r['start']+2.4)*1000)}",f"title={r['index']+1:02} - {r['style']} - {r['title']}"]
(BASE/'chapters.ffmeta').write_text('\n'.join(meta)+'\n',encoding='utf-8')
cmd=['ffmpeg','-y','-hide_banner','-loglevel','warning','-f','concat','-safe','0','-i',str(concat),'-i',str(BASE/'score.wav'),'-i',str(BASE/'chapters.ffmeta'),'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-t','72','-movflags','+faststart',str(OUT)]
subprocess.run(cmd,check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-show_chapters','-of','json',str(OUT)]))
manifest={'output':str(OUT),'bytes':OUT.stat().st_size,'sha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'dimensions':[1920,1080],'display_fps':30,'pose_fps':10,'shots':30,'shot_seconds':2.4,'music_bpm':200,'beats_per_shot':8,'probe':probe}
(BASE/'delivery_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('DELIVERED',OUT,OUT.stat().st_size)
```

### 5/16 · `COSMOS/audio_analysis.log`
<!-- casebook-file {"path": "COSMOS/audio_analysis.log", "lines": 37, "final_newline": true, "sha256": "6aafca710c0bb8cfbecc893eaddcc918b4f121d0afcadb49ef273654e07ec165", "original_sha256": "6aafca710c0bb8cfbecc893eaddcc918b4f121d0afcadb49ef273654e07ec165"} -->
```
[aist#0:0/pcm_s16le @ 0x562d98553340] Guessed Channel Layout: stereo
Input #0, wav, from '/mnt/data/cosmos_build/score.wav':
  Metadata:
    encoder         : Lavf61.7.103
  Duration: 00:01:12.00, bitrate: 1536 kb/s
  Stream #0:0: Audio: pcm_s16le ([1][0][0][0] / 0x0001), 48000 Hz, stereo, s16, 1536 kb/s
Stream mapping:
  Stream #0:0 -> #0:0 (pcm_s16le (native) -> pcm_s16le (native))
Press [q] to stop, [?] for help
Output #0, null, to 'pipe:':
  Metadata:
    encoder         : Lavf61.7.103
  Stream #0:0: Audio: pcm_s16le, 192000 Hz, stereo, s16, 6144 kb/s
      Metadata:
        encoder         : Lavc61.19.101 pcm_s16le
size=N/A time=00:00:03.80 bitrate=N/A speed= 7.6x    
size=N/A time=00:00:14.90 bitrate=N/A speed=14.8x    
size=N/A time=00:00:25.30 bitrate=N/A speed=16.8x    
size=N/A time=00:00:36.10 bitrate=N/A speed=  18x    
size=N/A time=00:00:46.90 bitrate=N/A speed=18.7x    
size=N/A time=00:00:57.30 bitrate=N/A speed=19.1x    
size=N/A time=00:01:08.30 bitrate=N/A speed=19.5x    
[Parsed_loudnorm_0 @ 0x7f65cc002740] 
{
	"input_i" : "-14.00",
	"input_tp" : "-2.01",
	"input_lra" : "4.70",
	"input_thresh" : "-24.12",
	"output_i" : "-14.35",
	"output_tp" : "-1.30",
	"output_lra" : "4.00",
	"output_thresh" : "-24.40",
	"normalization_type" : "dynamic",
	"target_offset" : "0.35"
}
[out#0/null @ 0x562d98553500] video:0KiB audio:54000KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: unknown
size=N/A time=00:01:12.00 bitrate=N/A speed=19.5x    
```

### 6/16 · `COSMOS/audio_measurements.json`
<!-- casebook-file {"path": "COSMOS/audio_measurements.json", "lines": 6, "final_newline": false, "sha256": "4efe09fcb10e693680109f192f9f5824525416f6423425442362bc67a1113a55", "original_sha256": "4efe09fcb10e693680109f192f9f5824525416f6423425442362bc67a1113a55"} -->
```json
{
  "linear_trim_db": -0.7599999999999998,
  "measured_lufs": -14.0,
  "measured_true_peak_dbtp": -2.01,
  "measured_lra": 4.7
}
```

### 7/16 · `COSMOS/build.sh`
<!-- casebook-file {"path": "COSMOS/build.sh", "lines": 9, "final_newline": true, "sha256": "83d0135cddf2c2b6437ca9d3ab1c76a0c6646f5aa537dd7614c0be05e865cdb4", "original_sha256": "83d0135cddf2c2b6437ca9d3ab1c76a0c6646f5aa537dd7614c0be05e865cdb4"} -->
```bash
#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"
export OPENBLAS_NUM_THREADS=1
export LP_NUM_THREADS=3
python render.py
python score.py
python master_audio.py
python assemble.py
```

### 8/16 · `COSMOS/chapters.ffmeta`
<!-- casebook-file {"path": "COSMOS/chapters.ffmeta", "lines": 154, "final_newline": true, "sha256": "72e567001345e97f0febe09030e67ccbdfda516bad06e337eca86e8c088e9f2a", "original_sha256": "72e567001345e97f0febe09030e67ccbdfda516bad06e337eca86e8c088e9f2a"} -->
```
;FFMETADATA1
title=COSMOS - Thirty Coded Worlds
artist=Original procedural film and score
comment=30 styles / 72 seconds / 200 BPM / 10 Hz stop-motion poses / scientific scenarios are labelled
[CHAPTER]
TIMEBASE=1/1000
START=0
END=2400
title=01 - 极简动态字体 - 宇宙之前
[CHAPTER]
TIMEBASE=1/1000
START=2400
END=4800
title=02 - 四维超立方体投影 - 时间的边界
[CHAPTER]
TIMEBASE=1/1000
START=4800
END=7200
title=03 - 故障艺术与扫描线 - 抵达理论边界
[CHAPTER]
TIMEBASE=1/1000
START=7200
END=9600
title=04 - 参数线条与欧普隧道 - 空间急剧拉伸
[CHAPTER]
TIMEBASE=1/1000
START=9600
END=12000
title=05 - 体积光与热辐射 - 热大爆炸
[CHAPTER]
TIMEBASE=1/1000
START=12000
END=14400
title=06 - 反应扩散与液态场 - 粒子的海洋
[CHAPTER]
TIMEBASE=1/1000
START=14400
END=16800
title=07 - 黏土微缩定格 - 物质开始成形
[CHAPTER]
TIMEBASE=1/1000
START=16800
END=19200
title=08 - 矢量工程蓝图 - 最初的元素核
[CHAPTER]
TIMEBASE=1/1000
START=19200
END=21600
title=09 - 层叠剪纸与视差 - 宇宙变得透明
[CHAPTER]
TIMEBASE=1/1000
START=21600
END=24000
title=10 - 孔版印刷与半调 - 最古老的光
[CHAPTER]
TIMEBASE=1/1000
START=24000
END=26400
title=11 - 多平面剪影舞台 - 宇宙的黑暗时代
[CHAPTER]
TIMEBASE=1/1000
START=26400
END=28800
title=12 - 体素积木定格 - 第一批恒星
[CHAPTER]
TIMEBASE=1/1000
START=28800
END=31200
title=13 - 赛璐璐与漫画描边 - 星光亮起
[CHAPTER]
TIMEBASE=1/1000
START=31200
END=33600
title=14 - 全息点云 - 光改变了宇宙
[CHAPTER]
TIMEBASE=1/1000
START=33600
END=36000
title=15 - 生成式拓扑线框 - 引力编织宇宙网
[CHAPTER]
TIMEBASE=1/1000
START=36000
END=38400
title=16 - 粒子银河摄影 - 亿万星辰成河
[CHAPTER]
TIMEBASE=1/1000
START=38400
END=40800
title=17 - 漫画网点与冲击帧 - 恒星锻造元素
[CHAPTER]
TIMEBASE=1/1000
START=40800
END=43200
title=18 - 拼贴与活字印刷 - 我们来自星尘
[CHAPTER]
TIMEBASE=1/1000
START=43200
END=45600
title=19 - 低多边形纸模 - 太阳系诞生
[CHAPTER]
TIMEBASE=1/1000
START=45600
END=48000
title=20 - 程序材质与电影星球 - 一颗蓝色星球
[CHAPTER]
TIMEBASE=1/1000
START=48000
END=50400
title=21 - 像素生命与细胞自动机 - 生命展开
[CHAPTER]
TIMEBASE=1/1000
START=50400
END=52800
title=22 - 等距微缩机械 - 宇宙开始被追问
[CHAPTER]
TIMEBASE=1/1000
START=52800
END=55200
title=23 - 时空世界线 - 走到此刻
[CHAPTER]
TIMEBASE=1/1000
START=55200
END=57600
title=24 - 数据叙事与科学图解 - 远方渐不可及
[CHAPTER]
TIMEBASE=1/1000
START=57600
END=60000
title=25 - 水墨流体与晕染 - 太阳也会老去
[CHAPTER]
TIMEBASE=1/1000
START=60000
END=62400
title=26 - 动力雕塑与装置定格 - 最后的星光
[CHAPTER]
TIMEBASE=1/1000
START=62400
END=64800
title=27 - 金属材质与粗粝微缩 - 残骸的漫长时代
[CHAPTER]
TIMEBASE=1/1000
START=64800
END=67200
title=28 - 引力透镜与光线偏折 - 黑洞也非永恒
[CHAPTER]
TIMEBASE=1/1000
START=67200
END=69600
title=29 - 四维超球切片 - 差异逐渐消散
[CHAPTER]
TIMEBASE=1/1000
START=69600
END=72000
title=30 - 光绘与负空间 - 从未知，到寂静
```

### 9/16 · `COSMOS/cosmos.frag`
<!-- casebook-file {"path": "COSMOS/cosmos.frag", "lines": 86, "final_newline": true, "sha256": "45b70fc76d4ac70916e855b205c9aadfd7c6cf8e4e5198868cafa62dd0ac9ba2", "original_sha256": "45b70fc76d4ac70916e855b205c9aadfd7c6cf8e4e5198868cafa62dd0ac9ba2"} -->
```glsl
#version 330 core
uniform vec2 uRes;
uniform float uTime;
uniform int uScene;
uniform float uBeat;
out vec4 frag;
const float PI=3.14159265359;
float hash(float n){return fract(sin(n)*43758.5453123);}
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float h3(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float f=0.,a=.5;for(int j=0;j<4;j++){f+=a*noise(p);p=p*2.04+17.2;a*=.5;}return f;}
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float line(vec2 p,vec2 a,vec2 b){vec2 q=p-a,v=b-a;return length(q-v*clamp(dot(q,v)/dot(v,v),0.,1.));}
vec3 stars(vec2 p,float strength){vec3 c=vec3(0);for(int i=0;i<3;i++){float sc=80.+float(i)*83.;vec2 cell=floor(p*sc),q=fract(p*sc)-.5;float seed=h2(cell+float(i)*37.);vec2 off=vec2(hash(seed*223.),hash(seed*774.))*.55-.275;float rad=length(q-off);float v=pow(max(0.,1.-rad*10.),3.)*step(.985-float(i)*.004,seed);c+=v*mix(vec3(.35,.65,1),vec3(1,.8,.54),hash(seed*90.))*strength;}return c;}
vec3 night(vec2 p){return vec3(.009,.013,.025)+vec3(.018,.035,.065)*exp(-length(p-vec2(.25,.12))*2.5)+stars(p,1.0);}
float sphereHit(vec3 ro,vec3 rd,vec3 ce,float r){vec3 oc=ro-ce;float b=dot(oc,rd),c=dot(oc,oc)-r*r,h=b*b-c;return h<0.?1e5:-b-sqrt(h);}
vec3 envcol(vec3 v){float s1=pow(max(dot(v,normalize(vec3(-1,1,1))),0.),9.);float s2=pow(max(dot(v,normalize(vec3(1,.3,-1))),0.),34.);return vec3(.15,.19,.26)+vec3(2.9,2.3,1.6)*s1+vec3(.25,1.2,1.7)*s2+vec3(.2)*pow(max(v.y,0.),3.);}
vec3 centerOf(int i,int sc,float t){float a=float(i)*2.39996+t*.24;
 if(sc==6){int cluster=i/3;float k=float(i%3);float gap=mix(1.35,.54,smoothstep(0.,1.45,t));return vec3((float(cluster)*2.-1.)*gap+cos(k*2.094+t*.45)*.26,.20+sin(k*2.094+t*.45)*.26,float(cluster)*.08+sin(k*2.094+t*.3)*.24);}
 if(sc==25){return vec3((float(i)-2.5)*.59, .35+sin(a)*.24,cos(a)*.43);}
 if(sc==26){return vec3(cos(a)*(.72+float(i%2)*.42),sin(a*1.5)*.66, sin(a)*.7);}
 return vec3(0,.08,0);
}
vec3 sphereScene(vec2 p,int sc,float t){vec3 ro=vec3(0,.35,4.5),target=vec3(0,.02,0);ro.x=.20*sin(t*.25);vec3 fw=normalize(target-ro),rt=normalize(cross(fw,vec3(0,1,0))),up=cross(rt,fw);vec3 rd=normalize(fw*1.8+rt*(p.x-.15)*1.25+up*(p.y-.07)*1.25);
 int count=sc==6?6:(sc==25?6:(sc==26?5:1));float best=1e5;int hit=-1;vec3 ce=vec3(0);float radius=0.;
 for(int i=0;i<6;i++){if(i>=count)break;vec3 cp=centerOf(i,sc,t);float r=sc==6?.335:(sc==25?.16+float(i%2)*.075:(sc==26?.36+float(i%3)*.06:.92));float d=sphereHit(ro,rd,cp,r);if(d>0.&&d<best){best=d;hit=i;ce=cp;radius=r;}}
 vec3 bg=night(p);
 if(sc==6){bg=vec3(.78,.75,.65)*(.91-.10*p.y);float td=(-.58-ro.y)/rd.y;if(td>0.){vec3 gp=ro+td*rd;float sh=0.;for(int i=0;i<6;i++){vec3 cp=centerOf(i,sc,t);sh+=exp(-dot(gp.xz-cp.xz,gp.xz-cp.xz)*6.)*.1;}bg-=sh;bg+=vec3(.017)*noise(gp*55.);}}
 if(sc==12)bg=vec3(.07,.075,.25)+vec3(.14,.02,.10)*max(0.,1.-length(p));
 if(sc==19)bg+=vec3(.03,.12,.21)*exp(-pow(length(p-vec2(.15,.03))-.37,2.)*180.);
 if(hit<0)return bg;
 vec3 pos=ro+best*rd,n=normalize(pos-ce),base=vec3(.8,.35,.12);float rough=.3,metal=0.;vec3 ld=normalize(vec3(-.6,.7,1.));
 if(sc==6){base=hit%3==0?vec3(.82,.16,.095):(hit%3==1?vec3(.075,.40,.64):vec3(.97,.68,.20));float grain=noise(pos*90.);float fp=sin(60.*length(pos.xy-ce.xy)+noise(pos*12.)*5.);n=normalize(n+vec3(grain-.5,fp*.17,0)*.07);base*=.94+.08*grain;rough=.8;}
 if(sc==12){float nd=dot(n,ld);float band=nd>.65?1.:(nd>.1?.71:.31);float ed=dot(n,-rd);vec3 c=vec3(1.,.49,.06)*band;if(ed<.055)c=vec3(.02,.02,.075);c+=vec3(1,.7,.13)*step(.91,nd)*.18;return c;}
 if(sc==19){float lat=asin(n.y);float lon=atan(n.z,n.x)+t*.16;vec3 q=vec3(cos(lon)*cos(lat),sin(lat),sin(lon)*cos(lat));float f=fbm(q*3.1+4.5)+.16*noise(q*8.);float land=smoothstep(.55,.585,f);base=mix(vec3(.01,.085,.20),mix(vec3(.17,.22,.09),vec3(.38,.30,.14),noise(q*14.)),land);float clouds=smoothstep(.57,.69,fbm(q*6.+vec3(t*.045,0,0)));base=mix(base,vec3(.92,.94,.92),clouds*.9);base=mix(base,vec3(.82,.87,.85),smoothstep(.88,.97,abs(n.y)));rough=.28;}
 if(sc==25){float alive=1.-smoothstep(float(hit)*.30+.4,float(hit)*.30+1.1,t);base=mix(vec3(.055,.067,.08),vec3(1.,.56,.17),alive);metal=.85;rough=.15;}
 if(sc==26){base=mix(vec3(.28,.32,.35),vec3(.45,.30,.12),float(hit%2));float gr=noise(pos*32.);n=normalize(n+(vec3(noise(pos*18.),noise(pos*18.+7.),noise(pos*18.+18.))-.5)*.1);base*=.7+.4*gr;metal=.9;rough=.22;}
 float diff=max(dot(n,ld),0.);float shadow=1.;for(int j=0;j<6;j++){if(j>=count)break;if(j==hit)continue;float tr=sphereHit(pos+n*.02,ld,centerOf(j,sc,t),sc==6?.31:.3);if(tr>0&&tr<7.)shadow*=.25;}
 vec3 c=base*(.16+diff*.83*shadow);vec3 halfv=normalize(ld-rd);float spec=pow(max(dot(n,halfv),0.),mix(100.,12.,rough));c+=spec*mix(vec3(.3),base,metal)*shadow;float rim=pow(1.-max(dot(n,-rd),0.),3.);c+=rim*vec3(.10,.28,.43)*.28;
 if(metal>.5)c=mix(c,envcol(reflect(rd,n))*base,.73);
 if(sc==19){c+=rim*vec3(.025,.32,.65);float cities=step(.74,noise(pos*110.))*step(.57,fbm(pos*3.1+4.5));c+=vec3(.8,.46,.12)*cities*(1.-smoothstep(-.1,.15,dot(n,ld)))*.15;}
 if(sc==25){float alive=1.-smoothstep(float(hit)*.30+.4,float(hit)*.30+1.1,t);c+=base*alive*.7;}
 return c;
}
vec3 galaxy(vec2 p,float t){vec3 ro=vec3(0,2.4,5.7),fw=normalize(-ro),rt=vec3(1,0,0),up=cross(rt,fw);vec3 rd=normalize(fw*1.35+rt*p.x*1.03+up*(p.y-.04)*1.03);vec3 col=night(p)*.5;
 for(int i=0;i<24;i++){float mid=-ro.y/min(rd.y,-.015);float d=mid-.5+float(i)*.043;vec3 q=ro+rd*d;q.xz=rot(t*.07)*q.xz;float r=length(q.xz);float ang=atan(q.z,q.x);float arm=pow(.5+.5*cos(ang*3.-r*5.4),4.);float fl=fbm(q*5.);float den=exp(-abs(q.y)*24.)*exp(-r*.7)*(arm*.8+.09)*(fl*.7+.4);float core=exp(-length(q*vec3(1,2.2,1))*4.);col+=mix(vec3(.22,.39,.82),vec3(1.7,.58,.21),pow(max(1.-r/3.,0.),2.))*den*.27;col+=vec3(1.5,1.05,.56)*core*.08;}
 col+=stars(p*1.4,1.3)*(.3+pow(max(0.,1.-length(p)*1.5),2.));return col;
}
vec3 blackhole(vec2 p,float t){p-=vec2(.12,.06);p*=.62;float shrink=1.-.20*smoothstep(0.,2.4,t);p/=shrink;float r=length(p);vec2 lens=p*(1.+.022/max(r*r,.016));vec3 col=night(lens)*.8;float horizon=.125;float photon=exp(-pow((r-horizon*1.07)/.004,2.));col+=vec3(1.6,.74,.26)*photon;
 float ring=length(vec2(p.x,p.y*4.8));float band=exp(-pow((ring-.24)/.079,2.));float ang=atan(p.y*4.8,p.x);float tex=.65+.35*sin(ring*370.-t*5.+sin(ang*16.));float asym=.65+.65*smoothstep(.3,-.3,p.x);vec3 disk=vec3(1.4,.40,.10)*band*tex*asym;disk+=vec3(1.1,.95,.56)*exp(-pow((ring-.16)/.018,2.));
 float warped=length(vec2(p.x,p.y*1.3));float back=exp(-pow((warped-.17)/.02,2.))*smoothstep(-.04,.09,p.y)*(.7+.3*sin(atan(p.y,p.x)*47.+t*4.));col+=disk;col+=vec3(1.,.6,.22)*back;col+=vec3(1.,.28,.07)*exp(-r*8.)*.10;
 if(r<horizon)col=vec3(.0008,.001,.002);float glow=exp(-pow((r-horizon)/.03,2.))*.1;col+=vec3(1,.4,.1)*glow;return col;
}
void main(){vec2 uv=gl_FragCoord.xy/uRes;vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;float t=uTime;int s=uScene;vec3 c=night(p);
 if(s==0){c=vec3(.007,.009,.013)+vec3(.03,.043,.056)*exp(-length(p-vec2(.38,.06))*5.);}
 if(s==1){c=vec3(.006,.014,.03)+vec3(.014,.095,.18)*exp(-length(p-vec2(.2,.04))*3.);c+=stars(p,.35);}
 if(s==2){float row=floor((p.y+.5)*80.);float scan=step(.78,hash(row+floor(t*10.)));float cols=step(.7,hash(floor(p.x*20.)+row*6.+floor(t*10.)));c=vec3(.012,.025,.026)+vec3(.03,.24,.18)*scan*cols*.30;float b=step(.986,hash(row+floor(t*10.)*5.));c+=vec3(.7,.05,.19)*b*step(p.x,hash(row)-.1);c*=.85+.15*sin(gl_FragCoord.y*PI);}
 if(s==3){vec2 q=p-vec2(.16,.06);q=rot(.16+t*.06)*q;float a=atan(q.y,q.x),r=length(q);float z=1./max(r,.02);float rings=pow(max(.0,cos(log(max(r,.008))*20.-t*7.)),35.);float spokes=pow(abs(cos(a*14.+t*.3)),75.);vec3 col=mix(vec3(.08,.30,.95),vec3(.93,.16,.41),.5+.5*sin(log(r+.03)*2.));c=vec3(.005,.009,.025)+col*(rings*.55+spokes*.45)*smoothstep(.008,.045,r);c+=vec3(.7,.85,1)*exp(-r*30.);}
 if(s==4){vec3 q=vec3(p*2.4,t*.2);vec3 w=vec3(fbm(q+4.),fbm(q+8.),fbm(q+12.));float n=fbm(q*2.7+w*3.);float rays=pow(abs(sin(atan(p.y,p.x)*8.+n*4.)),12.);c=mix(vec3(.18,.005,.025),vec3(1.,.16,.03),smoothstep(.25,.7,n));c+=vec3(1.,.58,.14)*pow(n,3.)*3.;c+=vec3(1.,.9,.64)*pow(max(0.,1.-length(p*vec2(.8,1.2))),3.)*(.9+.2*uBeat);c+=vec3(.4,.06,.01)*rays*.25;}
 if(s==5){vec3 q=vec3(p*5.,t*.22);float n=fbm(q+vec3(fbm(q+3.),fbm(q+8.),fbm(q+19.))*3.);c=.5+.5*cos(vec3(0,1.4,3.1)+n*8.);c*=.8;}
 if(s==6||s==12||s==19||s==25||s==26)c=sphereScene(p,s,t);
 if(s==7){float g=step(.968,fract(p.x*24.))+step(.968,fract(p.y*24.));float major=step(.989,fract(p.x*6.))+step(.989,fract(p.y*6.));c=vec3(.012,.075,.19)+vec3(.09,.23,.36)*g*.2+vec3(.15,.36,.48)*major*.3;}
 if(s==8){vec2 q=p-vec2(.13,.04);q=rot(.12)*q;float a=atan(q.y,q.x);float r=length(q*vec2(.85,1.0))+.015*sin(a*7.+t);c=vec3(.9,.86,.75);for(int i=0;i<7;i++){float rad=.46-float(i)*.049;float edge=smoothstep(rad+.007,rad-.002,r);vec3 ink=.5+.38*cos(vec3(.3,2.1,4.8)+float(i)*.59);c=mix(c,ink,edge);float sh=exp(-pow((r-rad+.007)/.005,2.));c-=sh*.14;}c+=vec3(h2(gl_FragCoord.xy)*.035);}
 if(s==9){c=vec3(.93,.89,.78);vec2 q=(p-vec2(.10,.055))*vec2(1.05,1.9);float r=length(q);float n=fbm(vec3(q*6.8,t*.035));vec3 ink=mix(vec3(.025,.28,.39),vec3(.91,.27,.09),smoothstep(.27,.7,n));float hal=step(length(fract(gl_FragCoord.xy/5.)-.5),.36);float edge=smoothstep(.54,.53,r);c=mix(c,ink*(.82+.18*hal),edge);c+=vec3(h2(gl_FragCoord.xy)*.05-.025);}
 if(s==10){c=vec3(.025,.018,.047)+vec3(.05,.027,.087)*(p.y+.5);c+=vec3(.003)*noise(vec3(p*8.,t*.05));}
 if(s==11){c=vec3(.026,.023,.055)+vec3(.09,.02,.11)*exp(-length(p-vec2(.1,0))*3.);c+=stars(p,.25);}
 if(s==13){c=vec3(.003,.018,.026)+vec3(.005,.10,.12)*exp(-length(p-vec2(.1,0))*2.);float scan=sin(gl_FragCoord.y*PI*.5);c*=.95+.05*scan;}
 if(s==14){c=vec3(.02,.014,.04)+vec3(.06,.015,.11)*exp(-length(p)*2.);}
 if(s==15)c=galaxy(p,t);
 if(s==16){vec2 q=p-vec2(.16,.035);float a=atan(q.y,q.x);float burst=step(.37,fract(a*19./PI));c=mix(vec3(.98,.76,.08),vec3(.92,.15,.035),burst);float dots=step(length(fract(gl_FragCoord.xy/9.)-.5),.18);c*=1.-.19*dots;}
 if(s==17){c=vec3(.84,.82,.71);c+=vec3(h2(gl_FragCoord.xy)*.06-.03);}
 if(s==18){c=vec3(.73,.86,.87)-vec3(.12,.15,.16)*max(0.,-p.y);}
 if(s==20){c=vec3(.025,.07,.05);}
 if(s==21){c=vec3(.88,.88,.80)+vec3(.025,.026,.016)*p.y;}
 if(s==22){c=vec3(.006,.012,.03)+vec3(.023,.04,.105)*exp(-length(p)*2.);}
 if(s==23){c=vec3(.94,.925,.87);float g=step(.978,fract(p.x*18.))+step(.978,fract(p.y*18.));c-=g*.025;}
 if(s==24){vec2 q=p-vec2(.20,.02);float n=fbm(vec3(q*6.,t*.075));float r=length(q)+.05*n;float radius=.16+t*.075;float mask=smoothstep(radius+.065,radius-.025,r+.06*fbm(vec3(q*20.,t*.1)));c=vec3(.90,.85,.73);vec3 ink=mix(vec3(.16,.022,.025),vec3(.73,.085,.045),n);c=mix(c,ink,mask);c+=vec3(.035)*h2(gl_FragCoord.xy);}
 if(s==27)c=blackhole(p,t);
 if(s==28){c=vec3(.008,.013,.021)+vec3(.025,.05,.07)*exp(-length(p)*3.);}
 if(s==29){c=vec3(.007,.009,.013)+vec3(.03,.043,.056)*exp(-length(p-vec2(.38,.06))*5.);}
 float vig=1.-.18*pow(length(p*vec2(.6,1.)),1.4);if(s!=16&&s!=17&&s!=18&&s!=21&&s!=23&&s!=24&&s!=9&&s!=6&&s!=8)c*=vig;
 c=max(c,vec3(0));if(s==4||s==15||s==27)c=1.-exp(-c*1.35);
 c+=vec3((h2(gl_FragCoord.xy+floor(t*10.)*13.)-.5)*.009);
 frag=vec4(clamp(c,0.,1.),1);
}
```

### 10/16 · `COSMOS/delivery_manifest.json`
<!-- casebook-file {"path": "COSMOS/delivery_manifest.json", "lines": 840, "final_newline": false, "sha256": "8134cf7061036b68ea053559169222b1108745bd64b107024625e04d937803ed", "original_sha256": "8134cf7061036b68ea053559169222b1108745bd64b107024625e04d937803ed"} -->
```json
{
  "output": "/mnt/data/COSMOS_30_STYLES_72s_1080p.mp4",
  "bytes": 20212569,
  "sha256": "a09a203ec3ce5705ea5568b4a0cf55de38ed60ee9968add6626083bb0bc7cd09",
  "dimensions": [
    1920,
    1080
  ],
  "display_fps": 30,
  "pose_fps": 10,
  "shots": 30,
  "shot_seconds": 2.4,
  "music_bpm": 200,
  "beats_per_shot": 8,
  "probe": {
    "streams": [
      {
        "index": 0,
        "codec_name": "h264",
        "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
        "profile": "High",
        "codec_type": "video",
        "codec_tag_string": "avc1",
        "codec_tag": "0x31637661",
        "width": 1920,
        "height": 1080,
        "coded_width": 1920,
        "coded_height": 1080,
        "closed_captions": 0,
        "film_grain": 0,
        "has_b_frames": 2,
        "pix_fmt": "yuv420p",
        "level": 40,
        "chroma_location": "left",
        "field_order": "progressive",
        "refs": 1,
        "is_avc": "true",
        "nal_length_size": "4",
        "id": "0x1",
        "r_frame_rate": "30/1",
        "avg_frame_rate": "30/1",
        "time_base": "1/15360",
        "start_pts": 0,
        "start_time": "0.000000",
        "duration_ts": 1105920,
        "duration": "72.000000",
        "bit_rate": "1965606",
        "bits_per_raw_sample": "8",
        "nb_frames": "2160",
        "extradata_size": 47,
        "disposition": {
          "default": 1,
          "dub": 0,
          "original": 0,
          "comment": 0,
          "lyrics": 0,
          "karaoke": 0,
          "forced": 0,
          "hearing_impaired": 0,
          "visual_impaired": 0,
          "clean_effects": 0,
          "attached_pic": 0,
          "timed_thumbnails": 0,
          "non_diegetic": 0,
          "captions": 0,
          "descriptions": 0,
          "metadata": 0,
          "dependent": 0,
          "still_image": 0,
          "multilayer": 0
        },
        "tags": {
          "language": "und",
          "handler_name": "VideoHandler",
          "vendor_id": "[0][0][0][0]",
          "encoder": "Lavc61.19.101 libx264"
        }
      },
      {
        "index": 1,
        "codec_name": "aac",
        "codec_long_name": "AAC (Advanced Audio Coding)",
        "profile": "LC",
        "codec_type": "audio",
        "codec_tag_string": "mp4a",
        "codec_tag": "0x6134706d",
        "sample_fmt": "fltp",
        "sample_rate": "48000",
        "channels": 2,
        "channel_layout": "stereo",
        "bits_per_sample": 0,
        "initial_padding": 0,
        "id": "0x2",
        "r_frame_rate": "0/0",
        "avg_frame_rate": "0/0",
        "time_base": "1/48000",
        "start_pts": 0,
        "start_time": "0.000000",
        "duration_ts": 3456000,
        "duration": "72.000000",
        "bit_rate": "270721",
        "nb_frames": "3376",
        "extradata_size": 5,
        "disposition": {
          "default": 1,
          "dub": 0,
          "original": 0,
          "comment": 0,
          "lyrics": 0,
          "karaoke": 0,
          "forced": 0,
          "hearing_impaired": 0,
          "visual_impaired": 0,
          "clean_effects": 0,
          "attached_pic": 0,
          "timed_thumbnails": 0,
          "non_diegetic": 0,
          "captions": 0,
          "descriptions": 0,
          "metadata": 0,
          "dependent": 0,
          "still_image": 0,
          "multilayer": 0
        },
        "tags": {
          "language": "und",
          "handler_name": "SoundHandler",
          "vendor_id": "[0][0][0][0]"
        }
      },
      {
        "index": 2,
        "codec_name": "bin_data",
        "codec_long_name": "binary data",
        "codec_type": "data",
        "codec_tag_string": "text",
        "codec_tag": "0x74786574",
        "id": "0x3",
        "r_frame_rate": "0/0",
        "avg_frame_rate": "0/0",
        "time_base": "1/1000",
        "start_pts": 0,
        "start_time": "0.000000",
        "duration_ts": 72000,
        "duration": "72.000000",
        "bit_rate": "201",
        "nb_frames": "30",
        "extradata_size": 63,
        "disposition": {
          "default": 0,
          "dub": 0,
          "original": 0,
          "comment": 0,
          "lyrics": 0,
          "karaoke": 0,
          "forced": 0,
          "hearing_impaired": 0,
          "visual_impaired": 0,
          "clean_effects": 0,
          "attached_pic": 0,
          "timed_thumbnails": 0,
          "non_diegetic": 0,
          "captions": 0,
          "descriptions": 0,
          "metadata": 0,
          "dependent": 0,
          "still_image": 0,
          "multilayer": 0
        },
        "tags": {
          "language": "eng",
          "handler_name": "SubtitleHandler"
        }
      }
    ],
    "chapters": [
      {
        "id": 0,
        "time_base": "1/1000",
        "start": 0,
        "start_time": "0.000000",
        "end": 2400,
        "end_time": "2.400000",
        "tags": {
          "title": "01 - 极简动态字体 - 宇宙之前"
        }
      },
      {
        "id": 1,
        "time_base": "1/1000",
        "start": 2400,
        "start_time": "2.400000",
        "end": 4800,
        "end_time": "4.800000",
        "tags": {
          "title": "02 - 四维超立方体投影 - 时间的边界"
        }
      },
      {
        "id": 2,
        "time_base": "1/1000",
        "start": 4800,
        "start_time": "4.800000",
        "end": 7200,
        "end_time": "7.200000",
        "tags": {
          "title": "03 - 故障艺术与扫描线 - 抵达理论边界"
        }
      },
      {
        "id": 3,
        "time_base": "1/1000",
        "start": 7200,
        "start_time": "7.200000",
        "end": 9600,
        "end_time": "9.600000",
        "tags": {
          "title": "04 - 参数线条与欧普隧道 - 空间急剧拉伸"
        }
      },
      {
        "id": 4,
        "time_base": "1/1000",
        "start": 9600,
        "start_time": "9.600000",
        "end": 12000,
        "end_time": "12.000000",
        "tags": {
          "title": "05 - 体积光与热辐射 - 热大爆炸"
        }
      },
      {
        "id": 5,
        "time_base": "1/1000",
        "start": 12000,
        "start_time": "12.000000",
        "end": 14400,
        "end_time": "14.400000",
        "tags": {
          "title": "06 - 反应扩散与液态场 - 粒子的海洋"
        }
      },
      {
        "id": 6,
        "time_base": "1/1000",
        "start": 14400,
        "start_time": "14.400000",
        "end": 16800,
        "end_time": "16.800000",
        "tags": {
          "title": "07 - 黏土微缩定格 - 物质开始成形"
        }
      },
      {
        "id": 7,
        "time_base": "1/1000",
        "start": 16800,
        "start_time": "16.800000",
        "end": 19200,
        "end_time": "19.200000",
        "tags": {
          "title": "08 - 矢量工程蓝图 - 最初的元素核"
        }
      },
      {
        "id": 8,
        "time_base": "1/1000",
        "start": 19200,
        "start_time": "19.200000",
        "end": 21600,
        "end_time": "21.600000",
        "tags": {
          "title": "09 - 层叠剪纸与视差 - 宇宙变得透明"
        }
      },
      {
        "id": 9,
        "time_base": "1/1000",
        "start": 21600,
        "start_time": "21.600000",
        "end": 24000,
        "end_time": "24.000000",
        "tags": {
          "title": "10 - 孔版印刷与半调 - 最古老的光"
        }
      },
      {
        "id": 10,
        "time_base": "1/1000",
        "start": 24000,
        "start_time": "24.000000",
        "end": 26400,
        "end_time": "26.400000",
        "tags": {
          "title": "11 - 多平面剪影舞台 - 宇宙的黑暗时代"
        }
      },
      {
        "id": 11,
        "time_base": "1/1000",
        "start": 26400,
        "start_time": "26.400000",
        "end": 28800,
        "end_time": "28.800000",
        "tags": {
          "title": "12 - 体素积木定格 - 第一批恒星"
        }
      },
      {
        "id": 12,
        "time_base": "1/1000",
        "start": 28800,
        "start_time": "28.800000",
        "end": 31200,
        "end_time": "31.200000",
        "tags": {
          "title": "13 - 赛璐璐与漫画描边 - 星光亮起"
        }
      },
      {
        "id": 13,
        "time_base": "1/1000",
        "start": 31200,
        "start_time": "31.200000",
        "end": 33600,
        "end_time": "33.600000",
        "tags": {
          "title": "14 - 全息点云 - 光改变了宇宙"
        }
      },
      {
        "id": 14,
        "time_base": "1/1000",
        "start": 33600,
        "start_time": "33.600000",
        "end": 36000,
        "end_time": "36.000000",
        "tags": {
          "title": "15 - 生成式拓扑线框 - 引力编织宇宙网"
        }
      },
      {
        "id": 15,
        "time_base": "1/1000",
        "start": 36000,
        "start_time": "36.000000",
        "end": 38400,
        "end_time": "38.400000",
        "tags": {
          "title": "16 - 粒子银河摄影 - 亿万星辰成河"
        }
      },
      {
        "id": 16,
        "time_base": "1/1000",
        "start": 38400,
        "start_time": "38.400000",
        "end": 40800,
        "end_time": "40.800000",
        "tags": {
          "title": "17 - 漫画网点与冲击帧 - 恒星锻造元素"
        }
      },
      {
        "id": 17,
        "time_base": "1/1000",
        "start": 40800,
        "start_time": "40.800000",
        "end": 43200,
        "end_time": "43.200000",
        "tags": {
          "title": "18 - 拼贴与活字印刷 - 我们来自星尘"
        }
      },
      {
        "id": 18,
        "time_base": "1/1000",
        "start": 43200,
        "start_time": "43.200000",
        "end": 45600,
        "end_time": "45.600000",
        "tags": {
          "title": "19 - 低多边形纸模 - 太阳系诞生"
        }
      },
      {
        "id": 19,
        "time_base": "1/1000",
        "start": 45600,
        "start_time": "45.600000",
        "end": 48000,
        "end_time": "48.000000",
        "tags": {
          "title": "20 - 程序材质与电影星球 - 一颗蓝色星球"
        }
      },
      {
        "id": 20,
        "time_base": "1/1000",
        "start": 48000,
        "start_time": "48.000000",
        "end": 50400,
        "end_time": "50.400000",
        "tags": {
          "title": "21 - 像素生命与细胞自动机 - 生命展开"
        }
      },
      {
        "id": 21,
        "time_base": "1/1000",
        "start": 50400,
        "start_time": "50.400000",
        "end": 52800,
        "end_time": "52.800000",
        "tags": {
          "title": "22 - 等距微缩机械 - 宇宙开始被追问"
        }
      },
      {
        "id": 22,
        "time_base": "1/1000",
        "start": 52800,
        "start_time": "52.800000",
        "end": 55200,
        "end_time": "55.200000",
        "tags": {
          "title": "23 - 时空世界线 - 走到此刻"
        }
      },
      {
        "id": 23,
        "time_base": "1/1000",
        "start": 55200,
        "start_time": "55.200000",
        "end": 57600,
        "end_time": "57.600000",
        "tags": {
          "title": "24 - 数据叙事与科学图解 - 远方渐不可及"
        }
      },
      {
        "id": 24,
        "time_base": "1/1000",
        "start": 57600,
        "start_time": "57.600000",
        "end": 60000,
        "end_time": "60.000000",
        "tags": {
          "title": "25 - 水墨流体与晕染 - 太阳也会老去"
        }
      },
      {
        "id": 25,
        "time_base": "1/1000",
        "start": 60000,
        "start_time": "60.000000",
        "end": 62400,
        "end_time": "62.400000",
        "tags": {
          "title": "26 - 动力雕塑与装置定格 - 最后的星光"
        }
      },
      {
        "id": 26,
        "time_base": "1/1000",
        "start": 62400,
        "start_time": "62.400000",
        "end": 64800,
        "end_time": "64.800000",
        "tags": {
          "title": "27 - 金属材质与粗粝微缩 - 残骸的漫长时代"
        }
      },
      {
        "id": 27,
        "time_base": "1/1000",
        "start": 64800,
        "start_time": "64.800000",
        "end": 67200,
        "end_time": "67.200000",
        "tags": {
          "title": "28 - 引力透镜与光线偏折 - 黑洞也非永恒"
        }
      },
      {
        "id": 28,
        "time_base": "1/1000",
        "start": 67200,
        "start_time": "67.200000",
        "end": 69600,
        "end_time": "69.600000",
        "tags": {
          "title": "29 - 四维超球切片 - 差异逐渐消散"
        }
      },
      {
        "id": 29,
        "time_base": "1/1000",
        "start": 69600,
        "start_time": "69.600000",
        "end": 72000,
        "end_time": "72.000000",
        "tags": {
          "title": "30 - 光绘与负空间 - 从未知，到寂静"
        }
      }
    ],
    "format": {
      "filename": "/mnt/data/COSMOS_30_STYLES_72s_1080p.mp4",
      "nb_streams": 3,
      "nb_programs": 0,
      "nb_stream_groups": 0,
      "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
      "format_long_name": "QuickTime / MOV",
      "start_time": "0.000000",
      "duration": "72.000000",
      "size": "20212569",
      "bit_rate": "2245841",
      "probe_score": 100,
      "tags": {
        "major_brand": "isom",
        "minor_version": "512",
        "compatible_brands": "isomiso2avc1mp41",
        "title": "COSMOS - Thirty Coded Worlds",
        "artist": "Original procedural film and score",
        "encoder": "Lavf61.7.103",
        "comment": "30 styles / 72 seconds / 200 BPM / 10 Hz stop-motion poses / scientific scenarios are labelled"
      }
    }
  },
  "full_decode_check": "PASS",
  "boundary_frame_checks": [
    {
      "frame": 0,
      "mean_luma": 15.184024884259259,
      "std_luma": 48.94121560090995
    },
    {
      "frame": 71,
      "mean_luma": 15.217564139660494,
      "std_luma": 48.940513930575015
    },
    {
      "frame": 72,
      "mean_luma": 11.46570842978395,
      "std_luma": 25.239313508643512
    },
    {
      "frame": 143,
      "mean_luma": 11.574114101080246,
      "std_luma": 25.602429309281362
    },
    {
      "frame": 144,
      "mean_luma": 11.479412133487655,
      "std_luma": 35.41967674493049
    },
    {
      "frame": 215,
      "mean_luma": 10.984291087962964,
      "std_luma": 35.52000435044596
    },
    {
      "frame": 216,
      "mean_luma": 12.48514805169753,
      "std_luma": 30.848283042165733
    },
    {
      "frame": 287,
      "mean_luma": 12.2579296875,
      "std_luma": 30.880463331735058
    },
    {
      "frame": 288,
      "mean_luma": 95.20349971064815,
      "std_luma": 55.97768671114031
    },
    {
      "frame": 359,
      "mean_luma": 98.2636323302469,
      "std_luma": 54.910439965172664
    },
    {
      "frame": 360,
      "mean_luma": 52.73861448688272,
      "std_luma": 66.73673116437664
    },
    {
      "frame": 431,
      "mean_luma": 64.08634403935186,
      "std_luma": 72.98934682575418
    },
    {
      "frame": 432,
      "mean_luma": 168.56475983796295,
      "std_luma": 44.848930351299025
    },
    {
      "frame": 503,
      "mean_luma": 168.49884500385804,
      "std_luma": 44.727046114676284
    },
    {
      "frame": 504,
      "mean_luma": 21.14518614969136,
      "std_luma": 32.58590142257938
    },
    {
      "frame": 575,
      "mean_luma": 20.56261574074074,
      "std_luma": 31.35081729658851
    },
    {
      "frame": 576,
      "mean_luma": 173.85811824845678,
      "std_luma": 59.204888767259575
    },
    {
      "frame": 647,
      "mean_luma": 173.92478009259258,
      "std_luma": 59.179529311862176
    },
    {
      "frame": 648,
      "mean_luma": 183.21882185570988,
      "std_luma": 70.18939949251377
    },
    {
      "frame": 719,
      "mean_luma": 183.18248697916667,
      "std_luma": 70.24058528437223
    },
    {
      "frame": 720,
      "mean_luma": 19.334390432098765,
      "std_luma": 32.889636686417475
    },
    {
      "frame": 791,
      "mean_luma": 19.36934124228395,
      "std_luma": 32.95063542707926
    },
    {
      "frame": 792,
      "mean_luma": 19.048548418209876,
      "std_luma": 34.45090836407266
    },
    {
      "frame": 863,
      "mean_luma": 15.765258005401234,
      "std_luma": 32.49011917812998
    },
    {
      "frame": 864,
      "mean_luma": 42.037583912037036,
      "std_luma": 46.5213045607706
    },
    {
      "frame": 935,
      "mean_luma": 41.9207388117284,
      "std_luma": 46.3664570730461
    },
    {
      "frame": 936,
      "mean_luma": 12.488497299382717,
      "std_luma": 27.022105270378805
    },
    {
      "frame": 1007,
      "mean_luma": 15.151585165895062,
      "std_luma": 33.70289369257582
    },
    {
      "frame": 1008,
      "mean_luma": 11.64562355324074,
      "std_luma": 27.929343694216882
    },
    {
      "frame": 1079,
      "mean_luma": 11.71676456404321,
      "std_luma": 28.046440007145158
    },
    {
      "frame": 1080,
      "mean_luma": 14.741615547839507,
      "std_luma": 35.208902589825485
    },
    {
      "frame": 1151,
      "mean_luma": 14.765866608796296,
      "std_luma": 35.27177994365833
    },
    {
      "frame": 1152,
      "mean_luma": 103.47758680555556,
      "std_luma": 68.30733990825303
    },
    {
      "frame": 1223,
      "mean_luma": 102.6440658757716,
      "std_luma": 67.2772734810578
    },
    {
      "frame": 1224,
      "mean_luma": 189.4346098572531,
      "std_luma": 43.733390308012204
    },
    {
      "frame": 1295,
      "mean_luma": 189.4077054398148,
      "std_luma": 43.85706406194917
    },
    {
      "frame": 1296,
      "mean_luma": 205.89850308641977,
      "std_luma": 23.104340648177505
    },
    {
      "frame": 1367,
      "mean_luma": 205.87309558256172,
      "std_luma": 23.20795816229459
    },
    {
      "frame": 1368,
      "mean_luma": 18.49254050925926,
      "std_luma": 35.13388050753909
    },
    {
      "frame": 1439,
      "mean_luma": 18.420804880401235,
      "std_luma": 35.47663500526244
    },
    {
      "frame": 1440,
      "mean_luma": 42.26997492283951,
      "std_luma": 60.32616597652166
    },
    {
      "frame": 1511,
      "mean_luma": 30.160027970679014,
      "std_luma": 49.768598965000336
    },
    {
      "frame": 1512,
      "mean_luma": 210.4500323109568,
      "std_luma": 37.285866199375974
    },
    {
      "frame": 1583,
      "mean_luma": 210.4114626736111,
      "std_luma": 37.42354145619195
    },
    {
      "frame": 1584,
      "mean_luma": 11.168882619598765,
      "std_luma": 30.18238557650866
    },
    {
      "frame": 1655,
      "mean_luma": 11.210395929783951,
      "std_luma": 30.241406050300988
    },
    {
      "frame": 1656,
      "mean_luma": 227.30256655092592,
      "std_luma": 29.17348636492425
    },
    {
      "frame": 1727,
      "mean_luma": 227.15906491126543,
      "std_luma": 29.554369718167045
    },
    {
      "frame": 1728,
      "mean_luma": 211.72488040123457,
      "std_luma": 38.68624287164982
    },
    {
      "frame": 1799,
      "mean_luma": 190.00137104552468,
      "std_luma": 65.08240813107275
    },
    {
      "frame": 1800,
      "mean_luma": 16.25636429398148,
      "std_luma": 43.01864185135725
    },
    {
      "frame": 1871,
      "mean_luma": 9.226703317901235,
      "std_luma": 27.295308321710852
    },
    {
      "frame": 1872,
      "mean_luma": 12.928308256172839,
      "std_luma": 31.43662766247737
    },
    {
      "frame": 1943,
      "mean_luma": 12.59217785493827,
      "std_luma": 31.37067029914647
    },
    {
      "frame": 1944,
      "mean_luma": 19.632155671296296,
      "std_luma": 40.767477543650685
    },
    {
      "frame": 2015,
      "mean_luma": 16.18016300154321,
      "std_luma": 37.51237237787463
    },
    {
      "frame": 2016,
      "mean_luma": 10.485483699845679,
      "std_luma": 31.43487343484928
    },
    {
      "frame": 2087,
      "mean_luma": 10.630334201388889,
      "std_luma": 31.67208853246489
    },
    {
      "frame": 2088,
      "mean_luma": 13.78640335648148,
      "std_luma": 45.51760164738527
    },
    {
      "frame": 2159,
      "mean_luma": 13.732613329475308,
      "std_luma": 45.504786834301804
    }
  ],
  "audio_measurements": {
    "linear_trim_db": -0.7599999999999998,
    "measured_lufs": -14.0,
    "measured_true_peak_dbtp": -2.01,
    "measured_lra": 4.7
  }
}
```

### 11/16 · `COSMOS/glrender.py`
<!-- casebook-file {"path": "COSMOS/glrender.py", "lines": 69, "final_newline": true, "sha256": "a7468445b879306ab7a87445eb440ee54e213940acc0cec7e45c4d1d24480f7b", "original_sha256": "a7468445b879306ab7a87445eb440ee54e213940acc0cec7e45c4d1d24480f7b"} -->
```python
"""Minimal headless EGL/OpenGL renderer. No Python OpenGL package required."""
import os, ctypes as C
os.environ.setdefault('LIBGL_ALWAYS_SOFTWARE','1')
os.environ.setdefault('EGL_PLATFORM','surfaceless')
os.environ.setdefault('LP_NUM_THREADS','3')
import numpy as np
E=C.CDLL('libEGL.so.1'); G=C.CDLL('libGL.so.1')

def api(lib,name,restype,args):
    f=getattr(lib,name); f.restype=restype; f.argtypes=args; return f
P=C.c_void_p; I=C.c_int; U=C.c_uint; F=C.c_float
getd=api(E,'eglGetDisplay',P,[P])
init=api(E,'eglInitialize',U,[P,C.POINTER(I),C.POINTER(I)])
bind=api(E,'eglBindAPI',U,[U])
choose=api(E,'eglChooseConfig',U,[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)])
createp=api(E,'eglCreatePbufferSurface',P,[P,P,C.POINTER(I)])
createc=api(E,'eglCreateContext',P,[P,P,P,C.POINTER(I)])
make=api(E,'eglMakeCurrent',U,[P,P,P,P])
cs=api(G,'glCreateShader',U,[U]); ss=api(G,'glShaderSource',None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)])
compile_=api(G,'glCompileShader',None,[U]); getsi=api(G,'glGetShaderiv',None,[U,U,C.POINTER(I)])
getlog=api(G,'glGetShaderInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
cp=api(G,'glCreateProgram',U,[]); attach=api(G,'glAttachShader',None,[U,U]); link=api(G,'glLinkProgram',None,[U]); use=api(G,'glUseProgram',None,[U])
getpi=api(G,'glGetProgramiv',None,[U,U,C.POINTER(I)])
getplog=api(G,'glGetProgramInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
loc=api(G,'glGetUniformLocation',I,[U,C.c_char_p]); u1f=api(G,'glUniform1f',None,[I,F]); u1i=api(G,'glUniform1i',None,[I,I]); u2f=api(G,'glUniform2f',None,[I,F,F])
viewport=api(G,'glViewport',None,[I,I,I,I]); draw=api(G,'glDrawArrays',None,[U,I,I]); read=api(G,'glReadPixels',None,[I,I,I,I,U,U,P])
genvao=api(G,'glGenVertexArrays',None,[I,C.POINTER(U)]); bindvao=api(G,'glBindVertexArray',None,[U]); finish=api(G,'glFinish',None,[])
getstr=api(G,'glGetString',C.c_char_p,[U])

class Renderer:
    def __init__(self,w,h,fragment):
        self.w,self.h=w,h
        self.display=getd(None); major,minor=I(),I()
        if not init(self.display,C.byref(major),C.byref(minor)): raise RuntimeError('EGL init failed')
        bind(0x30A2)
        attrs=(I*15)(0x3033,1,0x3040,8,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3025,0,0x3038)
        cfg=P(); n=I(); choose(self.display,attrs,C.byref(cfg),1,C.byref(n))
        surfattrs=(I*5)(0x3057,w,0x3056,h,0x3038)
        self.surface=createp(self.display,cfg,surfattrs)
        ctxattrs=(I*1)(0x3038)
        self.context=createc(self.display,cfg,None,ctxattrs)
        if not make(self.display,self.surface,self.surface,self.context): raise RuntimeError('EGL make current failed')
        self.renderer=getstr(0x1F01).decode()
        vert='''#version 330 core\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0,1);}'''
        self.program=cp()
        for typ,src in [(0x8B31,vert),(0x8B30,fragment)]:
            sh=cs(typ); b=C.c_char_p(src.encode()); ss(sh,1,C.byref(b),None); compile_(sh)
            ok=I(); getsi(sh,0x8B81,C.byref(ok))
            if not ok.value:
                buf=C.create_string_buffer(20000); getlog(sh,20000,None,buf); raise RuntimeError(buf.value.decode())
            attach(self.program,sh)
        link(self.program); ok=I(); getpi(self.program,0x8B82,C.byref(ok))
        if not ok.value:
            buf=C.create_string_buffer(20000); getplog(self.program,20000,None,buf); raise RuntimeError(buf.value.decode())
        use(self.program); va=U();genvao(1,C.byref(va));bindvao(va)
        viewport(0,0,w,h)
        self.locations={name:loc(self.program,name.encode()) for name in ['uRes','uTime','uScene','uBeat']}
        u2f(self.locations['uRes'],w,h)
        self.buffer=np.empty((h,w,4),np.uint8)
    def render(self,scene,t,beat=0.):
        u1i(self.locations['uScene'],scene);u1f(self.locations['uTime'],t);u1f(self.locations['uBeat'],beat)
        draw(0x0004,0,3)
        read(0,0,self.w,self.h,0x1908,0x1401,self.buffer.ctypes.data_as(P))
        return self.buffer[::-1,:,:3].copy()

if __name__=='__main__':
    from PIL import Image
    r=Renderer(640,360,'#version 330 core\nuniform vec2 uRes;out vec4 frag;void main(){frag=vec4(gl_FragCoord.xy/uRes,0.3,1.);}')
    print(r.renderer);Image.fromarray(r.render(0,0)).save('/mnt/data/cosmos_build/egl_test.png')
```

### 12/16 · `COSMOS/master_audio.py`
<!-- casebook-file {"path": "COSMOS/master_audio.py", "lines": 18, "final_newline": true, "sha256": "6d5fd4ed00399a4bec9b81053aa8b184df5c6b5346638d3d2fd6caec31342e1d", "original_sha256": "6d5fd4ed00399a4bec9b81053aa8b184df5c6b5346638d3d2fd6caec31342e1d"} -->
```python
"""Two-stage mastering with a measured final linear gain trim."""
from pathlib import Path
import subprocess,re,json,os
BASE=Path(__file__).resolve().parent
tmp=BASE/'score_normalized_tmp.wav'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(BASE/'score_raw.wav'),'-af','loudnorm=I=-14:TP=-1.3:LRA=7','-ar','48000','-c:a','pcm_s16le',str(tmp)],check=True)
def measure(path):
 p=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','loudnorm=I=-14:TP=-1.3:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 chunks=re.findall(r'\{[^{}]+\}',p.stderr,re.S)
 return json.loads(chunks[-1]),p.stderr
m,_=measure(tmp)
gain=min(-14.-float(m['input_i']),-1.65-float(m['input_tp']))
out=BASE/'score_mastered_tmp.wav'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(tmp),'-af',f'volume={gain:.5f}dB','-ar','48000','-c:a','pcm_s16le',str(out)],check=True)
os.replace(out,BASE/'score.wav');tmp.unlink()
m,log=measure(BASE/'score.wav');(BASE/'audio_analysis.log').write_text(log)
(BASE/'audio_measurements.json').write_text(json.dumps({'linear_trim_db':gain,'measured_lufs':float(m['input_i']),'measured_true_peak_dbtp':float(m['input_tp']),'measured_lra':float(m['input_lra'])},indent=2))
print('AUDIO MASTER',m['input_i'],'LUFS,',m['input_tp'],'dBTP',flush=True)
```

### 13/16 · `COSMOS/render.py`
<!-- casebook-file {"path": "COSMOS/render.py", "lines": 516, "final_newline": true, "sha256": "83e22e5f099f8e0e005a25ffdb4cd7821e875c01a2f13bb30e0359f89ec4ed00", "original_sha256": "83e22e5f099f8e0e005a25ffdb4cd7821e875c01a2f13bb30e0359f89ec4ed00"} -->
```python
"""COSMOS / Thirty coded worlds.
Native 1920x1080 procedural imagery, 30 fps delivery, 10 fps pose sampling.
No external visual assets. Requires numpy, Pillow, scipy, ffmpeg and Mesa EGL.
"""
from pathlib import Path
import os,sys,json,math,time,argparse,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageChops
from scipy.ndimage import laplace,gaussian_filter
from glrender import Renderer
BASE=Path(__file__).resolve().parent
STORY=json.loads((BASE/'storyboard.json').read_text())
TAU=math.tau
RNG=np.random.default_rng(28092026)
FONT_EN='/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf'
FONT_EN_REG='/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf'
FONT_ZH='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
FONT_ZH_REG='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
FONT_SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
FONT_MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
FONTCACHE={}
LIGHT_SCENES={6,8,9,17,18,21,23,24}
ACCENTS=['#d1e8ff','#61d8ff','#76efbb','#77a7ff','#ffd19c','#80e7dc','#943c2c','#75d6ff','#173b4b','#af3824','#d9c4eb','#ffb959','#ffd34f','#5feced','#de9bff','#ffbd85','#182039','#253230','#195465','#96d9ff','#b6ff98','#18434c','#99bcff','#ab3c24','#76251f','#edcaa7','#a8c6d8','#ffc184','#bdd6ee','#d1e8ff']

def rgb(c):
    if isinstance(c,str):return tuple(bytes.fromhex(c.lstrip('#')))
    return tuple(c)
def mix(a,b,t):return tuple(int(x*(1-t)+y*t) for x,y in zip(rgb(a),rgb(b)))
def smooth(a,b,t):
    x=np.clip((t-a)/(b-a),0.,1.);return x*x*(3-2*x)
def rotate3(points,ay=0.,ax=0.,az=0.):
    p=np.array(points,dtype=float,copy=True)
    for i,j,a in [(0,2,ay),(1,2,ax),(0,1,az)]:
        u=p[:,i].copy();v=p[:,j].copy();p[:,i]=u*np.cos(a)-v*np.sin(a);p[:,j]=u*np.sin(a)+v*np.cos(a)
    return p

def project(points,cx=690,cy=316,scale=155,dist=7.,ay=0.,ax=.3,az=0.):
    q=rotate3(points,ay,ax,az);factor=dist/(dist+q[:,2]);xy=np.stack([cx+q[:,0]*scale*factor,cy-q[:,1]*scale*factor],1)
    return xy,q[:,2],factor

class Art:
    def __init__(self,image,scale=None):
        self.im=image;self.k=image.width/1280 if scale is None else scale;self.d=ImageDraw.Draw(image,'RGBA')
    def pt(self,p):return tuple(float(v)*self.k for v in p)
    def points(self,p):return [(float(x)*self.k,float(y)*self.k) for x,y in p]
    def line(self,p,fill,width=1):
        if len(p)>1:self.d.line(self.points(p),fill=fill,width=max(1,round(width*self.k)),joint='curve')
    def polygon(self,p,fill,outline=None,width=1):
        q=self.points(p);self.d.polygon(q,fill=fill)
        if outline:self.d.line(q+[q[0]],fill=outline,width=max(1,round(width*self.k)),joint='curve')
    def rect(self,b,fill,outline=None,width=1):self.d.rectangle(self.pt(b),fill,outline,width=max(1,round(width*self.k)))
    def ellipse(self,b,fill=None,outline=None,width=1):self.d.ellipse(self.pt(b),fill,outline,width=max(1,round(width*self.k)))
    def dot(self,x,y,r,c):self.ellipse((x-r,y-r,x+r,y+r),c)
    def arc(self,b,start,end,fill,width=1):self.d.arc(self.pt(b),start,end,fill=fill,width=max(1,round(width*self.k)))
    def font(self,size,kind='en'):
        path={'en':FONT_EN,'reg':FONT_EN_REG,'zh':FONT_ZH,'zhreg':FONT_ZH_REG,'mono':FONT_MONO,'serif':FONT_SERIF}[kind]
        key=(path,round(size*self.k),2 if kind in ['zh','zhreg','serif'] else 0)
        if key not in FONTCACHE:FONTCACHE[key]=ImageFont.truetype(key[0],max(key[1],1),index=key[2])
        return FONTCACHE[key]
    def text(self,p,s,size,fill,kind='en',anchor='lt',stroke=0,stroke_fill=None):
        self.d.text(self.pt(p),s,font=self.font(size,kind),fill=fill,anchor=anchor,stroke_width=round(stroke*self.k),stroke_fill=stroke_fill)
    def spaced(self,p,s,size,fill,spacing=3):
        x,y=p;f=self.font(size,'mono')
        for ch in s:
            self.d.text((x*self.k,y*self.k),ch,font=f,fill=fill,anchor='lt');x+=f.getlength(ch)/self.k+spacing
    def paste_layer(self,layer,xy=(0,0)):
        self.im.paste(layer,(round(xy[0]*self.k),round(xy[1]*self.k)),layer);self.d=ImageDraw.Draw(self.im,'RGBA')

# Deterministic authored geometry.
HYPER=np.array([[1 if (i>>b)&1 else -1 for b in range(4)] for i in range(16)],float)
HYPER_EDGES=[(i,j) for i in range(16) for j in range(i+1,16) if np.sum(HYPER[i]!=HYPER[j])==1]
CLOUD=RNG.normal(size=(1700,3));CLOUD/=np.linalg.norm(CLOUD,axis=1,keepdims=True);CLOUD*=RNG.random((1700,1))**(1/3)*2.5
WEB_NODES=RNG.normal(size=(34,3))*np.array([1.9,.60,.72])
WEB_EDGES=[]
for i,p in enumerate(WEB_NODES):
    ds=np.sum((WEB_NODES-p)**2,axis=1)
    for j in np.argsort(ds)[1:4]:
        if i<j:WEB_EDGES.append((i,int(j)))
SPIRAL_N=2300
sr=RNG.exponential(.95,SPIRAL_N);sr=np.clip(sr,.015,3.6)
sa=sr*1.8+RNG.integers(0,3,SPIRAL_N)*TAU/3+RNG.normal(0,.21,SPIRAL_N)
SPIRAL=np.stack([np.cos(sa)*sr,RNG.normal(0,.04,SPIRAL_N),np.sin(sa)*sr],1)
SPIRAL_LIGHT=RNG.random(SPIRAL_N)
VOX_POS=RNG.uniform(-1,1,(82,3));VOX_COL=RNG.random(82)
S4=RNG.normal(size=(2000,4));S4/=np.linalg.norm(S4,axis=1,keepdims=True)

class Mesh:
    def __init__(self,art,cx=690,cy=320,scale=140,ay=.55,ax=.45,dist=10.):
        self.art=art;self.cx=cx;self.cy=cy;self.scale=scale;self.ay=ay;self.ax=ax;self.dist=dist;self.faces=[]
    def face(self,pts,color,edge=None):
        p=np.array(pts,float);q=rotate3(p,self.ay,self.ax)
        n=np.cross(q[1]-q[0],q[2]-q[0]);ln=np.linalg.norm(n)
        if ln>0:n=n/ln
        ld=np.array([-.45,.8,-.65]);ld/=np.linalg.norm(ld)
        shade=.40+.60*max(0,float(np.dot(n,ld)))
        col=tuple(int(np.clip(c*shade,0,255)) for c in rgb(color)[:3])+(255,)
        f=self.dist/(self.dist+q[:,2]);xy=np.stack([self.cx+q[:,0]*self.scale*f,self.cy-q[:,1]*self.scale*f],1)
        self.faces.append((float(q[:,2].mean()),xy,col,edge))
    def box(self,center,size,color):
        x,y,z=center
        if np.isscalar(size):sx=sy=sz=size/2
        else:sx,sy,sz=np.array(size)/2
        p=np.array([[x+sx*a,y+sy*b,z+sz*c] for a,b,c in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]])
        for face in [(0,3,2,1),(4,5,6,7),(0,4,7,3),(1,2,6,5),(3,7,6,2),(0,1,5,4)]:self.face(p[list(face)],color)
    def cylinder(self,a,b,r,color,sides=16):
        a=np.array(a,float);b=np.array(b,float);v=b-a;v/=np.linalg.norm(v)
        u=np.cross(v,[0,1,0] if abs(v[1])<.9 else [1,0,0]);u/=np.linalg.norm(u);w=np.cross(v,u)
        ang=np.linspace(0,TAU,sides,endpoint=False);ring=np.cos(ang)[:,None]*u*r+np.sin(ang)[:,None]*w*r
        pa=a+ring;pb=b+ring
        self.face(pa[::-1],color);self.face(pb,color)
        for i in range(sides):j=(i+1)%sides;self.face([pa[i],pa[j],pb[j],pb[i]],color)
    def ico(self,center,r,color,phase=0.):
        phi=(1+5**.5)/2
        v=np.array([[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]],float)
        v/=np.linalg.norm(v,axis=1,keepdims=True);v=rotate3(v,phase,.14)*r+center
        faces=[(0,11,5),(0,5,1),(0,1,7),(0,7,10),(0,10,11),(1,5,9),(5,11,4),(11,10,2),(10,7,6),(7,1,8),(3,9,4),(3,4,2),(3,2,6),(3,6,8),(3,8,9),(4,9,5),(2,4,11),(6,2,10),(8,6,7),(9,8,1)]
        for f in faces:self.face(v[list(f)],color)
    def dome(self,center,r,color):
        for j in range(6):
            p0=j/6*math.pi/2;p1=(j+1)/6*math.pi/2
            for i in range(24):
                a=i/24*TAU;b=(i+1)/24*TAU
                pts=[[center[0]+r*math.cos(la)*math.cos(lo),center[1]+r*math.sin(la),center[2]+r*math.cos(la)*math.sin(lo)] for la,lo in [(p0,a),(p0,b),(p1,b),(p1,a)]]
                self.face(pts[::-1],color)
    def draw(self):
        for _,xy,col,edge in sorted(self.faces,key=lambda x:x[0],reverse=True):self.art.polygon(xy,col,edge)

RD_FRAMES=[];LIFE_FRAMES=[]
def prepare_fields():
    if RD_FRAMES:return
    rng=np.random.default_rng(510)
    n=210;a=np.ones((n,n),np.float32);b=np.zeros_like(a)
    for _ in range(23):
        x,y=rng.integers(15,n-15,2);a[y-5:y+5,x-5:x+5]=.3;b[y-5:y+5,x-5:x+5]=.9
    a+=rng.normal(0,.02,a.shape)
    for k in range(750):
        ab=a*b*b;a+=(.20*laplace(a)-ab+.034*(1-a));b+=(.10*laplace(b)+ab-(.062+.034)*b)
        if k>=270 and (k-270)%20==0:
            field=np.clip(b*3.,0,1);RD_FRAMES.append(field.copy())
    g=(rng.random((72,128))>.70)
    yy,xx=np.mgrid[:72,:128];mask=((xx-64)/60)**2+((yy-36)/32)**2<1
    g&=mask
    for k in range(24):
        LIFE_FRAMES.append(g.copy())
        nei=sum(np.roll(np.roll(g,i,0),j,1) for i in (-1,0,1) for j in (-1,0,1) if i or j)
        g=((nei==3)|(g&(nei==2)))&mask


def field_image(art,field,kind):
    if kind=='rd':
        f=np.clip(field,0,1)
        c0=np.array([6,27,40]);c1=np.array([47,199,197]);c2=np.array([249,183,106]);c3=np.array([248,245,218])
        a=np.clip(f*3.,0,1)[...,None];b=np.clip((f-.34)*3.,0,1)[...,None];c=np.clip((f-.72)*4.,0,1)[...,None]
        arr=c0*(1-a)+c1*a;arr=arr*(1-b)+c2*b;arr=arr*(1-c)+c3*c
        im=Image.fromarray(np.uint8(arr)).resize(art.im.size,Image.Resampling.BICUBIC)
    else:
        arr=np.zeros((*field.shape,3),np.uint8);arr[:]=[7,22,17];arr[field]=[127,236,125]
        im=Image.fromarray(arr).resize(art.im.size,Image.Resampling.NEAREST)
    art.im.paste(im,(0,0));art.d=ImageDraw.Draw(art.im,'RGBA')


def embellish(art,s,t):
    a=art;k=round(t*10);rng=np.random.default_rng(100+s)
    if s==0:
        a.spaced((64,151),'A CODED HISTORY OF EVERYTHING',12,(150,179,204,230),2)
        a.text((57,204),'BEFORE',158,(234,237,230,255))
        x=1055;y=303;r=4+2*math.exp(-t*3)
        for rr,alpha in [(95,5),(44,10),(19,22),(8,50)]:a.dot(x,y,rr,(153,211,245,alpha))
        a.dot(x,y,r,(245,246,230,255));a.line([(1035,303),(940,303)],(190,215,232,65),1)
        a.text((64,410),'NO CLOCK.  NO CERTAINTY.  A QUESTION.',15,(163,188,202,235),'mono')
    elif s==1:
        q=HYPER.copy();ang=.4+t*.48
        for i,j,theta in [(0,3,ang),(1,3,ang*.6),(1,2,.5)]:
            u=q[:,i].copy();v=q[:,j].copy();q[:,i]=u*np.cos(theta)-v*np.sin(theta);q[:,j]=u*np.sin(theta)+v*np.cos(theta)
        pts=q[:,:3]/(3.3-q[:,3,None])*2.5
        xy,z,f=project(pts,cx=841,cy=319,scale=135,ay=.4+t*.12,ax=.25)
        for i,j in HYPER_EDGES:
            col=(71,216,255,220) if (i^j)==8 else (147,160,224,150)
            a.line([xy[i],xy[j]],col,2.2)
        for p,zz in zip(xy,z):a.dot(*p,3.8,(211,246,255,240))
        a.text((64,179),'TIME',106,(25,63,88,255),stroke=1,stroke_fill=(99,210,238,255))
        a.text((65,300),'x  y  z  w',26,(170,228,246,255),'mono')
        a.spaced((67,353),'4D ROTATION / 3D PROJECTION',11,(139,185,216,230),1)
    elif s==2:
        a.text((66,176),'t = 0',211,(177,245,213,250),'mono')
        for j in range(10):
            y=178+j*24+int(rng.integers(-5,5));dx=int((hash((k,j))%31)-15)
            if (j+k)%3==0:a.rect((80+dx,y,650+dx,y+3),(9,27,23,250))
        a.text((817,230),'[ UNKNOWN ]',25,(236,93,111,255),'mono')
        for i,st in enumerate(['QUANTUM GRAVITY','INSUFFICIENT MODEL','NO VERIFIED ORIGIN']):a.text((820,279+i*31),st,13,(89,204,155,230),'mono')
        a.line([(66,454),(1160,454)],(97,229,165,80),1)
    elif s==3:
        a.text((64,142),'SPACE',69,(221,229,245,245))
        a.text((67,226),'EXPANDS',31,(143,174,234,235))
        a.text((70,285),'a(t) ~ exp(Ht)',18,(176,170,242,220),'mono')
        for j in range(3):a.line([(68,345+j*13),(181+j*17+k*2,345+j*13)],(133,188,255,130),2)
    elif s==4:
        for i,st in enumerate(['SPACE','MATTER','LIGHT']):a.text((68,151+i*70),st,53,(255,244,209,230))
        for j in range(8):
            aa=j*TAU/8+t*.07;rr=150+t*50
            x=750+math.cos(aa)*rr;y=310+math.sin(aa)*rr*.6
            a.line([(x,y),(x+math.cos(aa)*80,y+math.sin(aa)*48)],(255,238,193,85),2)
    elif s==5:
        prepare_fields();field_image(a,RD_FRAMES[min(k,23)],'rd')
        for j in range(36):
            x=(j*97+43+t*37*(j%3-1))%1200+40;y=(j*67+120+t*18)%350+140
            a.ellipse((x-10,y-10,x+10,y+10),None,(212,255,235,95),1.2)
        a.text((69,161),'10',126,(239,247,227,230));a.text((241,158),'10',43,(239,247,227,230));a.text((306,216),'K',58,(239,247,227,230))
    elif s==6:
        # Labels stay outside the clay objects, not on an atomic scale.
        a.text((227,179),'PROTON',18,(63,50,36,240),'mono');a.text((854,179),'NEUTRON',18,(63,50,36,240),'mono')
        a.line([(300,212),(427,270)],(89,75,52,115),1);a.line([(895,212),(845,265)],(89,75,52,115),1)
        a.text((253,436),'u + u + d',19,(69,61,43,225),'mono');a.text((885,436),'u + d + d',19,(69,61,43,225),'mono')
        for x in [72,1198]:
            a.line([(x,160),(x,475)],(66,65,45,80),1)
            for y in range(170,475,14):a.line([(x,y),(x+7,y)],(66,65,45,100),1)
    elif s==7:
        specs=[(285,295,'H',[(0,0)]),(650,295,'He',[(-17,-17),(17,-17),(-17,17),(17,17)]),(1010,295,'Li',[(0,0),(-30,0),(30,0),(-15,-26),(15,-26),(-15,26),(15,26)])]
        for h,(cx,cy,name,pts) in enumerate(specs):
            a.ellipse((cx-107,cy-107,cx+107,cy+107),None,(93,162,202,120),1)
            a.arc((cx-120,cy-120,cx+120,cy+120),int(t*30),int(t*30)+215,(121,226,247,190),2)
            for j,(dx,dy) in enumerate(pts):
                dd=1+.4*(1-smooth(0,.9,t));col=(246,123,81,255) if ((j<3) if len(pts)==7 else (j%2==0)) else (148,205,227,255)
                a.dot(cx+dx*dd,cy+dy*dd,22,col)
            a.text((cx,432),name,36,(216,237,238,255),'en',anchor='mt')
            a.text((cx-62,150),f'NUCLEUS / {h+1:02}',12,(98,197,224,200),'mono')
            a.line([(cx-95,cy),(cx-143,cy),(cx-143,cy-53)],(138,207,228,150),1)
        a.text((82,471),'p + n  ->  H / He / trace light nuclei',16,(193,224,233,200),'mono')
    elif s==8:
        cx=733;cy=331
        for i in range(3):
            ang=t*.55+i*TAU/3;rr=106+i*18
            x=cx+math.cos(ang)*rr;y=cy+math.sin(ang)*rr*.78
            a.dot(x+5,y+8,16,(0,33,35,50));a.dot(x,y,15,(248,237,199,255))
        for j in range(8):
            ang=j*TAU/8+.3;rr=80+((t*80+j*29)%180)
            a.line([(cx+math.cos(ang)*rr,cy+math.sin(ang)*rr),(cx+math.cos(ang)*(rr+34),cy+math.sin(ang)*(rr+34))],(253,246,215,170),2)
        a.text((70,157),'LET LIGHT',39,(31,71,77,245));a.text((70,205),'TRAVEL.',59,(31,71,77,245))
    elif s==9:
        a.text((70,141),'380,000',86,(41,74,75,230));a.text((74,240),'YEARS AFTER',15,(64,92,91,210),'mono')
        a.text((872,440),'CMB / ARTISTIC MAP',13,(63,72,68,230),'mono')
        for j,col in enumerate([(27,84,95),(49,128,140),(205,166,91),(225,76,37)]):a.rect((876+j*54,470,929+j*54,478),col+(255,))
    elif s==10:
        for j in range(5):
            pts=[]
            for x in np.linspace(-40,1320,140):
                y=398+j*22+42*math.sin(x/190+j*1.7+t*.045*(j+1))+22*math.sin(x/82+j)
                pts.append((x,y))
            a.polygon(pts+[(1320,630),(-40,630)],(13+j*4,10+j*3,23+j*6,255))
        a.text((81,183),'NO STARS',96,(186,170,205,175));a.text((86,295),'YET.',96,(186,170,205,175))
        for j in range(16):
            x=140+(j*179)%1000;y=133+(j*97)%260;a.line([(x-12,y),(x+15,y+1)],(114,95,135,25),1)
    elif s==11:
        m=Mesh(a,cx=727,cy=316,scale=134,ay=.3+t*.26,ax=-.32,dist=8)
        collapse=1-smooth(.0,1.7,t)
        for i,p in enumerate(VOX_POS):
            pos=p*(.55+collapse*2.1)
            pos[1]+=.25*math.sin(i*.6+t*1.2)*collapse
            col=mix('#803756','#ffcf78',VOX_COL[i])
            m.box(pos,.21+(1-collapse)*.04,col)
        m.draw()
        a.text((65,157),'BUILD',53,(250,221,184,235));a.text((65,218),'A STAR.',53,(250,221,184,235))
        if t>=1.7:
            for j in range(12):
                aa=j*TAU/12;rr=75+(t-1.7)*80;a.line([(727+math.cos(aa)*rr,316+math.sin(aa)*rr),(727+math.cos(aa)*(rr+55),316+math.sin(aa)*(rr+55))],(255,207,113,220),3)
    elif s==12:
        # Graphic rays are timed to anticipation, contact and settle poses.
        for j in range(14):
            ang=j*TAU/14+t*.13;rr=226+(7 if k%3==0 else 0)
            pts=[(748+math.cos(ang-.028)*rr,309+math.sin(ang-.028)*rr),(748+math.cos(ang)*(rr+48),309+math.sin(ang)*(rr+48)),(748+math.cos(ang+.028)*rr,309+math.sin(ang+.028)*rr)]
            a.polygon(pts,(255,174,28,245),(16,16,53,255),2)
        a.text((74,157),'ON.',109,(255,222,142,255))
        a.text((82,279),'FUSION / IGNITION',15,(242,189,137,235),'mono')
    elif s==13:
        q=CLOUD.copy();q[:,0]*=1.3;q[:,1]*=.66
        xy,z,f=project(q,cx=704,cy=318,scale=119,ay=t*.19,ax=.35)
        rion=.45+t*.95
        for i in np.argsort(z)[::-1]:
            d=np.linalg.norm(q[i]);ion=d<rion;alpha=180 if ion else 62
            col=(167,254,248,alpha) if ion else (16,116,139,alpha)
            a.dot(*xy[i],(1.5 if ion else 1.)*f[i],col)
        for j in range(3):
            cx=520+j*176;cy=315+(-1)**j*48;r=22+t*(24+j*7)
            a.ellipse((cx-r,cy-r*.67,cx+r,cy+r*.67),None,(68,232,240,140),1.5)
            a.dot(cx,cy,3.5,(224,255,239,255))
        a.text((75,150),'LIGHT CHANGES',37,(161,234,231,230));a.text((76,196),'EVERYTHING.',37,(161,234,231,230))
    elif s==14:
        xy,z,f=project(WEB_NODES,cx=700,cy=320,scale=105,ay=.25+t*.14,ax=.1,dist=9)
        for ii,(i,j) in enumerate(WEB_EDGES):
            p0=WEB_NODES[i];p1=WEB_NODES[j]
            for st in [-1,0,1]:
                u=np.linspace(0,1,20);pts=p0[None,:]*(1-u[:,None])+p1[None,:]*u[:,None]
                pts[:,1]+=.09*st*np.sin(u*math.pi)
                linep,_,_=project(pts,cx=700,cy=320,scale=105,ay=.25+t*.14,ax=.1,dist=9)
                a.line(linep,(144+st*15,93,216,140 if st==0 else 50),1.3)
        for p,ff in zip(xy,f):a.dot(*p,3.0*ff,(236,203,255,240))
        a.text((65,151),'GRAVITY',56,(225,192,248,250));a.text((69,222),'WRITES STRUCTURE.',17,(188,152,222,230),'mono')
    elif s==15:
        q=rotate3(SPIRAL,ay=t*.07);ro=np.array([0.,2.4,5.7]);fw=-ro/np.linalg.norm(ro);rt=np.array([1.,0.,0.]);up=np.cross(rt,fw);v=q-ro;z=v@fw;f=6.18/z;px=(v@rt)/z*1.35/1.03;py=.04+(v@up)/z*1.35/1.03;xy=np.stack([640+px*720,360-py*720],1)
        for i in range(SPIRAL_N):
            if SPIRAL_LIGHT[i]>.18:
                cc=mix('#a5b8fc','#ffcb8f',math.exp(-sr[i]*.8));a.dot(*xy[i],(.45+SPIRAL_LIGHT[i]*.8)*f[i],cc+(int(80+SPIRAL_LIGHT[i]*150),))
        a.text((67,140),'BILLIONS',69,(245,225,205,240));a.text((71,219),'OF SUNS.',30,(200,201,220,235))
    elif s==16:
        cx=750;cy=313;pts=[]
        for j in range(32):
            rr=(256 if j%2==0 else 131)*(1+.06*(k%3==0));ang=j*TAU/32-.1;pts.append((cx+math.cos(ang)*rr,cy+math.sin(ang)*rr*.76))
        a.polygon(pts,(254,238,190,255),(24,23,26,255),7)
        a.text((566,260),'BOOM',104,(29,28,36,255))
        for j,el in enumerate(['C','O','Fe']):
            ang=-2.6+j*1.85;rr=215+(t*.7%1)*25;x=cx+math.cos(ang)*rr;y=cy+math.sin(ang)*rr*.68
            a.text((x,y),el,35,(245,239,208,255),stroke=3,stroke_fill=(25,23,25,255))
        a.text((68,149),'STELLAR',41,(29,27,32,255));a.text((69,199),'ALCHEMY',41,(29,27,32,255))
    elif s==17:
        # Rotated printed cards with contact shadows and discrete assembly.
        colors=['#d44835','#e4ad47','#356c6a'];els=['C','O','Fe'];nums=['6','8','26'];names=['CARBON','OXYGEN','IRON']
        for j in range(3):
            w,h=254,291;card=Image.new('RGBA',(round(w*a.k),round(h*a.k)),(0,0,0,0));ca=Art(card,scale=a.k)
            ca.rect((0,0,w,h),rgb(colors[j])+(255,));ca.rect((12,12,w-12,h-12),None,(242,230,190,140),1)
            ca.text((24,24),nums[j],25,(249,235,204,255),'mono');ca.text((24,87),els[j],99,(247,236,207,255));ca.text((27,232),names[j],20,(247,236,207,255),'mono')
            angle=[9,-6,7][j]+(1 if k%6<3 else -1);card=card.rotate(angle,resample=Image.Resampling.BICUBIC,expand=True)
            x=200+j*297;yy=161+(-1)**j*12+(2 if k%6<3 else -2)
            sh=Image.new('RGBA',card.size,(0,0,0,0));sh.putalpha(card.getchannel('A').point(lambda v:int(v*.17)));a.im.paste(sh,(round((x+8)*a.k),round((yy+12)*a.k)),sh);a.im.paste(card,(round(x*a.k),round(yy*a.k)),card);a.d=ImageDraw.Draw(a.im,'RGBA')
        a.text((60,140),'STAR',45,(43,60,52,235));a.text((60,189),'DUST',45,(43,60,52,235))
    elif s==18:
        # Low polygon planets are actual shaded icosahedral meshes.
        for r in [1.1,1.8,2.65]:
            ang=np.linspace(0,TAU,130);p=np.stack([np.cos(ang)*r,np.zeros_like(ang)-.2,np.sin(ang)*r],1)
            xy,_,_=project(p,cx=731,cy=320,scale=126,ay=.24,ax=-.88,dist=10);a.line(xy,(43,106,114,100),1.4)
        m=Mesh(a,cx=731,cy=320,scale=126,ay=.24,ax=-.88,dist=10)
        m.ico(np.array([0,0,0]),.55,'#ffb65e',t*.08)
        for j,(r,col) in enumerate([(1.1,'#a96441'),(1.8,'#317f91'),(2.65,'#d5bb88')]):
            ang=j*2.1+t*(.42-j*.08);m.ico(np.array([math.cos(ang)*r,0,math.sin(ang)*r]),.13+j*.07,col,t*.2)
        for i in range(34):
            ang=i*2.399+t*.1;rad=1.4+.55*math.sin(i*7.1);m.ico(np.array([math.cos(ang)*rad,-.03,math.sin(ang)*rad]),.028,'#b19172')
        m.draw();a.text((66,157),'4.6',104,(30,75,81,250));a.text((71,272),'BILLION YEARS AGO',14,(42,90,93,235),'mono')
    elif s==19:
        a.text((70,151),'HOME.',83,(207,231,240,245));a.text((73,247),'ONE SMALL WORLD.',14,(151,189,211,235),'mono')
        a.arc((406,88,1094,531),-24,28,(149,199,218,140),1)
        a.line([(1123,318),(1068,318)],(133,201,230,150),1);a.text((1093,345),'EARTH',14,(161,211,233,230),'mono')
    elif s==20:
        prepare_fields();field_image(a,LIFE_FRAMES[min(k,23)],'life')
        a.rect((0,0,1280,720),(2,12,10,25))
        for x in range(0,1280,10):a.line([(x,80),(x,541)],(2,10,8,75),1)
        for y in range(90,550,10):a.line([(0,y),(1280,y)],(2,10,8,75),1)
        a.text((69,171),'LIFE',141,(212,255,191,255),stroke=2,stroke_fill=(9,35,20,255))
        a.text((75,340),f'CELLULAR AUTOMATON / GENERATION {k:02}',14,(180,232,163,255),'mono')
        a.text((76,377),'SIMPLE RULES. COMPLEX WORLDS.',14,(180,232,163,230),'mono')
    elif s==21:
        m=Mesh(a,cx=814,cy=385,scale=115,ay=.65+t*.04,ax=-.48,dist=16)
        m.box((0,-.60,0),(3.7,.27,3.0),'#819184');m.box((0,-.4,0),(3.5,.15,2.8),'#d0d5b1')
        for i in range(3):m.box((-1.4-i*.2,-.58-i*.09,.85),(.65,.18,.85),'#a8b29b')
        m.cylinder((.35,-.30,.1),(.35,.37,.1),.66,'#e9e2c8',24);m.dome((.35,.37,.1),.69,'#f2ead6')
        m.box((.38,.88,.11),(.09,.62,1.23),'#475a58')
        # Telescope on its own pedestal; no geometry is placed through the dome.
        m.cylinder((-.94,-.3,-.30),(-.94,.20,-.30),.10,'#748788',12)
        tilt=.30+round(t/.3)*.015
        m.cylinder((-1.02,.23,-.36),(-1.53,.63+tilt,-.60),.13,'#f0e9cf',16)
        m.cylinder((-1.52,.63+tilt,-.60),(-1.58,.69+tilt,-.63),.15,'#255a64',16)
        for xx in [-.8,.38]:
            m.box((xx,-.01,1.02),(.76,.08,.65),'#255b6c')
            for rr in range(4):m.box((xx-.3+rr*.2,.04,1.02),(.025,.015,.58),'#6fa2a5')
        m.draw()
        a.text((65,152),'LOOK UP.',85,(33,67,71,250));a.text((71,255),'ASK WHERE WE CAME FROM.',14,(53,91,89,245),'mono')
        for j in range(5):
            x=723+j*85;y=145+(j*53)%97;a.line([(x-4,y),(x+4,y)],(89,137,134,170),1);a.line([(x,y-4),(x,y+4)],(89,137,134,170),1)
    elif s==22:
        # Three spatial coordinates plus time, projected as stacked worldline slices.
        ay=.24+t*.075;ax=.62
        for j in range(12):
            tm=j/11;r=.28+tm**1.8*1.64;ang=np.linspace(0,TAU,110)
            pts=np.stack([r*np.cos(ang),(tm-.5)*3.05*np.ones_like(ang),r*np.sin(ang)],1)
            xy,_,_=project(pts,cx=825,cy=325,scale=114,ay=ay,ax=ax,dist=8)
            a.line(xy,(145,185,255,170 if j==7 else 56),2 if j==7 else 1)
        for j in range(16):
            aa=j*TAU/16;tm=np.linspace(0,1,70);r=.28+tm**1.8*1.64
            pts=np.stack([r*np.cos(aa+tm*.18), (tm-.5)*3.05,r*np.sin(aa+tm*.18)],1)
            xy,_,_=project(pts,cx=825,cy=325,scale=114,ay=ay,ax=ax,dist=8);a.line(xy,(142,191,251,170),1.6)
        a.text((66,166),'13.8',110,(217,231,248,250));a.text((72,286),'BILLION YEARS',20,(159,187,227,240),'mono')
        a.text((75,365),'3 SPACE + 1 TIME',16,(124,164,220,220),'mono')
        a.line([(1148,456),(1148,183)],(167,198,241,160),1.3);a.polygon([(1143,190),(1148,180),(1153,190)],(167,198,241,220));a.text((1163,222),'t',24,(185,215,249,245),'mono')
    elif s==23:
        x0,y0=513,472;x1,y1=1169,146
        a.line([(x0,y1),(x0,y0),(x1,y0)],(55,69,62,210),2)
        for j in range(1,5):a.line([(x0,y0-j*63),(x1,y0-j*63)],(41,82,75,36),1)
        xs=np.linspace(0,1,140);ys=(np.exp(xs*2.3)-1)/(np.exp(2.3)-1)
        end=.72+.28*smooth(0,2.1,t);valid=xs<=end
        pts=np.stack([x0+xs[valid]*(x1-x0),y0-ys[valid]*(y0-y1)],1);a.line(pts,(176,66,37,250),4)
        alt=np.stack([x0+xs*(x1-x0),y0-xs*.43*(y0-y1)],1)
        for j in range(0,len(alt)-1,8):a.line(alt[j:j+4],(67,122,117,130),1.8)
        if len(pts):a.dot(*pts[-1],6,(189,57,31,255))
        a.text((529,143),'a(t)',20,(68,81,73,245),'mono');a.text((1058,487),'FUTURE',14,(68,81,73,230),'mono')
        a.text((68,158),'FARTHER.',68,(47,72,67,250));a.text((68,239),'FASTER?',68,(47,72,67,250))
        a.text((72,350),'A CONDITIONAL SCENARIO',13,(133,63,44,240),'mono')
    elif s==24:
        a.text((77,159),'EVEN',59,(80,39,30,240));a.text((75,230),'SUNS',102,(80,39,30,245));a.text((80,350),'GROW OLD.',27,(105,48,35,235),'mono')
        a.text((753,289),'SUN',66,(239,202,156,205))
        for j in range(4):
            rr=167+t*35+j*11
            a.arc((780-rr,328-rr*.92,780+rr,328+rr*.92),j*60+int(t*12),j*60+int(t*12)+37,(107,27,21,85),1)
    elif s==25:
        # These coordinates match the analytic camera in the GLSL scene.
        ro=np.array([.20*math.sin(t*.25),.35,4.5]);target=np.array([0,.02,0]);fw=target-ro;fw/=np.linalg.norm(fw);rt=np.cross(fw,[0,1,0]);rt/=np.linalg.norm(rt);up=np.cross(rt,fw)
        for j in range(6):
            ang=j*2.39996+t*.24;ce=np.array([(j-2.5)*.59,.35+math.sin(ang)*.24,math.cos(ang)*.43]);v=ce-ro;z=np.dot(v,fw)
            px=.15+(np.dot(v,rt)/z)*1.8/1.25;py=.07+(np.dot(v,up)/z)*1.8/1.25;x=640+px*720;y=360-py*720
            rr=(.16+(j%2)*.075)/z*1.8/1.25*720
            a.line([(x,141),(x,y-rr)],(191,202,210,140),1.3)
            alive=1-smooth(j*.30+.4,j*.30+1.1,t)
            a.text((x,451),'ON' if alive>.5 else 'OFF',12,(int(125+80*alive),int(130+50*alive),int(138+12*alive),220),'mono',anchor='mt')
        a.line([(355,141),(1130,141)],(187,205,216,120),1.2)
        a.text((70,160),'THE LAST',41,(230,211,184,245));a.text((71,211),'LIGHTS.',41,(230,211,184,245))
    elif s==26:
        a.text((65,151),'REMAINS',62,(190,208,216,235));a.text((70,229),'A LONG, COLD AGE.',16,(141,168,183,230),'mono')
        for j in range(5):
            x=156+j*21;a.line([(x,310),(x,320+(j%3)*22)],(143,166,183,80),2)
    elif s==27:
        a.text((67,153),'NOT EVEN',47,(248,208,163,245));a.text((68,212),'BLACK HOLES.',38,(248,208,163,245))
        a.text((74,282),'HAWKING RADIATION',13,(210,169,123,220),'mono')
        for j in range(32):
            aa=j*2.39996;rr=140+((j*7+t*47)%140);x=779+math.cos(aa)*rr;y=316+math.sin(aa)*rr*.75
            if y<485:a.dot(x,y,.9+(j%3)*.25,(255,202,138,int(90+60*t/2.4)))
    elif s==28:
        q=S4.copy();ang=.2+t*.6
        for i,j,theta in [(0,3,ang),(1,3,ang*.6),(2,3,ang*.2)]:
            u=q[:,i].copy();v=q[:,j].copy();q[:,i]=u*np.cos(theta)-v*np.sin(theta);q[:,j]=u*np.sin(theta)+v*np.cos(theta)
        w=-.6+t*.48;sel=np.abs(q[:,3]-w)<.18
        pts=q[sel,:3]*1.9;xy,z,f=project(pts,cx=830,cy=322,scale=161,ay=.4,ax=.3)
        for i in np.argsort(z)[::-1]:
            col=mix('#628ea6','#e1bf91',.5+.5*pts[i,0]/2);a.dot(*xy[i],1.6*f[i],col+(200,))
        for j in range(5):
            ww=-.8+j*.4;r=math.sqrt(max(0,1-ww*ww))*1.9;aa=np.linspace(0,TAU,100)
            ring=np.stack([r*np.cos(aa),r*np.sin(aa),np.ones_like(aa)*ww],1);xyp,_,_=project(ring,cx=830,cy=322,scale=161,ay=.4,ax=.3)
            a.line(xyp,(130,167,196,60),1)
        a.text((66,157),'LESS',67,(211,221,224,235));a.text((68,236),'DIFFERENCE.',42,(211,221,224,235));a.text((72,312),'4D SLICES / w = c',15,(150,177,200,220),'mono')
    elif s==29:
        a.spaced((64,151),'THE STORY RETURNS TO A QUESTION',12,(150,179,204,230),1.6)
        a.text((58,204),'AFTER',158,(234,237,230,255))
        for j in range(5):
            fade=max(0.,1-t/1.8);pts=[]
            for x in np.linspace(720,1055,100):
                y=303+math.sin((x-720)/100+j*.6)*50*fade*((1055-x)/335)
                pts.append((x,y))
            a.line(pts,(160,208,235,int(72*fade)),1.1)
        for rr,alpha in [(95,5),(44,10),(19,22),(8,50)]:a.dot(1055,303,rr,(153,211,245,alpha))
        a.dot(1055,303,4,(245,246,230,255))
        a.text((66,410),'A POSSIBLE END. NOT A CERTAINTY.',15,(163,188,202,235),'mono')


def overlay(art,s,t):
    a=art;meta=STORY[s];light=s in LIGHT_SCENES;fg=(30,47,51,255) if light else (239,240,230,255);muted=(67,83,82,240) if light else (177,193,205,245);accent=rgb(ACCENTS[s])+(255,)
    # Dedicated lower reading area, never fully opaque or completely empty.
    ov=Image.new('RGBA',a.im.size,(0,0,0,0));arr=np.zeros((a.im.height,1,4),np.uint8)
    ys=np.arange(a.im.height)/a.k
    al=np.clip((ys-460)/170,0,1)*(.94 if not light else .78)
    base=(236,232,215) if light else (5,10,16)
    arr[:,:,0]=base[0];arr[:,:,1]=base[1];arr[:,:,2]=base[2];arr[:,:,3]=(al*255).astype(np.uint8)[:,None]
    strip=Image.fromarray(arr,'RGBA').resize(a.im.size);a.im.paste(strip,(0,0),strip);a.d=ImageDraw.Draw(a.im,'RGBA')
    a.line([(60,46),(1220,46)],fg[:3]+(35,),1)
    a.spaced((62,24),'COSMOS / 30 CODED WORLDS',10,muted,1.4)
    a.text((62,66),meta['style'],16,fg,'zh')
    a.text((1218,64),meta['dimension'],15,accent,'mono',anchor='rt')
    a.text((1218,24),f'{s+1:02} / 30',13,muted,'mono',anchor='rt')
    chapter='I / ORIGIN' if s<10 else ('II / STRUCTURE' if s<20 else 'III / AFTERLIGHT')
    a.spaced((62,528),meta['english'],11,accent,2)
    titlex=62+(-9 if t<.1 else 0)
    a.text((titlex,555),meta['title'],43,fg,'zh')
    a.text((65,614),meta['caption'],22,fg,'zhreg')
    a.text((1216,554),meta['epoch'],14,muted,'zhreg',anchor='rt')
    a.text((1216,586),meta['status'],12,accent,'zhreg',anchor='rt')
    a.text((1216,623),chapter,11,muted,'mono',anchor='rt')
    for i in range(30):
        xx=62+i*38.45
        alpha=200 if i<s else (110 if i==s else 34)
        a.line([(xx,678),(xx+30,678)],accent[:3]+(alpha,),2 if i<=s else 1)
        if i==s:a.line([(xx,678),(xx+30*min(1,t/2.3),678)],fg,3)
    # Eight beats per shot; small markers echo the percussion without full-frame flashes.
    bt=int(t/.3+1e-6)
    for j in range(8):a.rect((1134+j*10,702,1138+j*10,705),accent[:3]+(200 if j==bt else 32,))
    a.text((63,696),'STOP-MOTION / PROCEDURAL CINEMA',9,muted,'mono')


def make_frame(renderer,s,t):
    arr=renderer.render(s,t,math.exp(-((t/.3)%1)*8))
    im=Image.fromarray(arr).convert('RGB');art=Art(im);embellish(art,s,t);overlay(art,s,t)
    return im.convert('RGB')


def preview(w=640,h=360):
    r=Renderer(w,h,(BASE/'cosmos.frag').read_text());sheet=Image.new('RGB',(w*5,h*6))
    out=BASE/'stills';out.mkdir(exist_ok=True)
    for s in range(30):
        im=make_frame(r,s,1.2);im.save(out/f'{s:02}.jpg',quality=94);sheet.paste(im,((s%5)*w,(s//5)*h));print('preview',s,flush=True)
    sheet.save(BASE/'contact_sheet.jpg',quality=92)


def render_video(w=1920,h=1080,start=0,end=30):
    r=Renderer(w,h,(BASE/'cosmos.frag').read_text());out=BASE/'clips';out.mkdir(exist_ok=True)
    for s in range(start,end):
        path=out/f'{s:02}.mp4';t0=time.time()
        cmd=['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','2','-movflags','+faststart',str(path)]
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
        try:
            for pose in range(24):
                im=make_frame(r,s,pose/10);b=im.tobytes()
                for _ in range(3):proc.stdin.write(b)
            proc.stdin.close();rc=proc.wait()
            if rc:raise RuntimeError(f'ffmpeg failed: {rc}')
        except Exception:
            proc.kill();raise
        print(f'shot {s+1:02}/30 done {time.time()-t0:.2f}s {path.stat().st_size/1e6:.2f}MB',flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--preview',action='store_true');p.add_argument('--width',type=int,default=1920);p.add_argument('--height',type=int,default=1080);p.add_argument('--start',type=int,default=0);p.add_argument('--end',type=int,default=30);args=p.parse_args()
    if args.preview:preview(640,360)
    else:render_video(args.width,args.height,args.start,args.end)
```

### 14/16 · `COSMOS/requirements.txt`
<!-- casebook-file {"path": "COSMOS/requirements.txt", "lines": 3, "final_newline": true, "sha256": "f793676a40e71a12c2d9066d4f2e342bf5d920a971a725519c00ed500c4231ed", "original_sha256": "f793676a40e71a12c2d9066d4f2e342bf5d920a971a725519c00ed500c4231ed"} -->
```text
numpy==2.3.5
scipy==1.17.0
Pillow==12.3.0
```

### 15/16 · `COSMOS/score.py`
<!-- casebook-file {"path": "COSMOS/score.py", "lines": 108, "final_newline": true, "sha256": "be898826e8db6dc00ab4e8438265ede400cc2947b547174448abb3e73e1ea1a0", "original_sha256": "be898826e8db6dc00ab4e8438265ede400cc2947b547174448abb3e73e1ea1a0"} -->
```python
"""Original deterministic drumstep score. 200 BPM, eight beats per shot."""
from pathlib import Path
import numpy as np
from scipy.signal import butter,sosfilt
from scipy.io import wavfile
SR=48000;N=72*SR;B=.3;BASE=Path(__file__).resolve().parent
rng=np.random.default_rng(802360)
buses={k:np.zeros((N,2),np.float32) for k in ['drums','bass','music','fx']}
def filt(x,c,kind='lowpass'):return sosfilt(butter(2,c,btype=kind,fs=SR,output='sos'),x).astype(np.float32)
def tt(d):return np.arange(int(d*SR),dtype=np.float32)/SR
def env(t,a=.004,d=.15):return (1-np.exp(-t/a))*np.exp(-t/d)
def hz(m):return 440*2**((m-69)/12)
def add(bus,x,at,g=1.,pan=0.):
 off=int(round(at*SR));x=np.asarray(x,np.float32)
 if off<0:x=x[-off:];off=0
 stop=min(N,off+len(x))
 if stop<=off:return
 x=x[:stop-off]*g
 if x.ndim==1:
  buses[bus][off:stop,0]+=x*np.cos((pan+1)*np.pi/4);buses[bus][off:stop,1]+=x*np.sin((pan+1)*np.pi/4)
 else:buses[bus][off:stop]+=x

t=tt(.42);f=48+155*np.exp(-t*45)
kick=np.sin(2*np.pi*np.cumsum(f)/SR)*env(t,.0006,.09)+filt(rng.normal(0,1,len(t)),[3500,11000],'bandpass')*np.exp(-t*450)*.2
kick=np.tanh(kick*2)*.79
t=tt(.32);snare=filt(rng.normal(0,1,len(t)),[1000,11500],'bandpass')*env(t,.0015,.055)*.95+np.sin(2*np.pi*(182*t-15*t*t))*env(t,.0008,.046)*.45
snare+=filt(rng.normal(0,1,len(t)),[600,4000],'bandpass')*(np.exp(-abs(t-.008)*500)+np.exp(-abs(t-.017)*450))*.12
snare=np.tanh(snare*1.2)*.70
t=tt(.1);hat=filt(rng.normal(0,1,len(t)),[7000,19000],'bandpass')*env(t,.0004,.016)*.30
t=tt(.3);ohat=filt(rng.normal(0,1,len(t)),[6500,17000],'bandpass')*env(t,.001,.066)*.22
t=tt(1.3);crash=filt(rng.normal(0,1,len(t)),[2800,16000],'bandpass')*env(t,.001,.37)*.26

def reese(m,d):
 t=tt(d);f=hz(m);gate=np.minimum(1,t/.004)*np.minimum(1,(d-t)/.038);out=np.zeros(len(t),np.float32)
 for k in range(1,12):out+=(np.sin(2*np.pi*f*.994*k*t)+np.sin(2*np.pi*f*1.006*k*t+.3))/(k**1.4)
 out=.19*out*(.72+.28*np.sin(2*np.pi*3.333*t+.8))+.56*np.sin(2*np.pi*f*t)
 return np.tanh(out*1.35)*gate

def pluck(m,d=.62):
 t=tt(d);ph=2*np.pi*hz(m)*t
 return (np.sin(ph+2.4*np.exp(-t*12)*np.sin(ph*2))*.57+np.sin(ph*2.003)*.13+np.sin(ph*3)*.07)*env(t,.0018,.115)

def bell(m,d=3.):
 t=tt(d);f=hz(m);out=np.zeros(len(t),np.float32)
 for r,a,dec in [(1,1,1.1),(2.01,.33,.6),(2.76,.2,.3),(4.03,.12,.18)]:out+=np.sin(2*np.pi*f*r*t)*a*env(t,.002,dec)
 return out*.30

def pad(chord,d=2.7):
 t=tt(d);e=np.minimum(t/.20,1)*np.minimum(np.maximum(d-t,0)/.42,1);out=np.zeros((len(t),2),np.float32)
 for i,m in enumerate(chord):
  for ch,det in [(0,.997),(1,1.003)]:
   ph=2*np.pi*hz(m)*det*t+i*.47;out[:,ch]+=(np.sin(ph)*.63+np.sin(ph*2)*.15+np.sin(ph*3)*.05)*e/(len(chord)**.6)
 return out*.22

def brass(chord,d=.66):
 t=tt(d);e=env(t,.012,.17);out=np.zeros(len(t),np.float32)
 for m in chord:
  ph=2*np.pi*hz(m)*t;out+=np.sin(ph+(.75+np.exp(-t*12))*np.sin(ph))*e
 return filt(out,[250,6200],'bandpass')*.12

add('fx',bell(86,4),0,.85,-.22);add('music',bell(81,3.2),1.2,.5,.25)
t=tt(9.6);hum=(np.sin(2*np.pi*36.71*t)+.3*np.sin(2*np.pi*55*t))*np.minimum(t/.03,1)*np.minimum((9.6-t),1);add('bass',hum,0,.18)
for at in [0,2.4,4.8,7.2]:add('drums',kick,at,.52 if at<4.8 else .8)
roots=[38,34,41,36];quals=[[0,3,7,10],[0,4,7,11],[0,4,7,9],[0,4,7,10]]
for shot in range(30):
 at=shot*2.4;root=roots[(shot//2)%4];chord=[root+24+q for q in quals[(shot//2)%4]];density=.45 if shot<4 else (.65 if shot in [20,21] else 1)
 if shot<28:add('music',pad(chord),at,.5 if shot<4 else .83)
 if 4<=shot<28:
  add('music',brass([root+24,root+31,root+36]),at,.85*density)
  seq=[0,2,1,3,2,1,0,2]
  for j in range(8):
   m=chord[seq[j]]+(12 if j in [3,7] and shot>=12 else 0);note=pluck(m);when=at+j*.3
   add('music',note,when,.31*density,-.3 if j%2 else .3);add('music',note,when+.225,.085*density,.38 if j%2 else -.38)
 if 2<=shot<28:
  for j in range(2):
   bar=at+j*1.2;main=(shot>=4 and shot not in [20,21]);kb=[0,1.75,2.5] if (shot+j)%2==0 else [0,2,2.75]
   if not main:kb=[0,2]
   for b in kb:add('drums',kick,bar+b*B,.97*density)
   for b in [1,3]:add('drums',snare,bar+b*B,.9*density,.02)
   if main and (shot+j)%3==0:
    for b in [.75,2.75]:add('drums',snare,bar+b*B,.15,-.12)
   for n in range(8):add('drums',hat,bar+n*.15,(.65 if n%2==0 else .4)*density,-.37 if n%2 else .37)
   if main:
    add('drums',ohat,bar+.9,1,.2)
    for b,d,mo,g in [(0,.20,0,.39),(.75,.19,0,.32),(1.5,.16,12,.27),(2,.22,0,.37),(2.75,.17,7,.28),(3.5,.14,0,.30)]:add('bass',reese(root+mo,d),bar+b*.3,g)
   else:add('bass',reese(root,.8),bar,.19)
 if 0<shot<29:
  t=tt(.075);tick=filt(rng.normal(0,1,len(t)),[2000,11000],'bandpass')*np.exp(-t*70);add('fx',tick,at,.09,-.3 if shot%2 else .3)
 if shot%4==0 and 4<=shot<28:add('drums',crash,at,.8,-.23)

for dest in [9.6,28.8,52.8,64.8]:
 t=tt(2.4);ramp=(t/2.4)**1.7;noise=filt(rng.normal(0,1,len(t)),[900,12500],'bandpass');osc=np.sin(2*np.pi*np.cumsum(200+2300*ramp)/SR)
 riser=(noise*.20+osc*.05)*ramp*(.55+.45*np.sin(2*np.pi*(6.667*t+1.8*t*t))**2)
 add('fx',riser,dest-2.4,.74,.08);add('drums',crash,dest,.75,.28)
 t=tt(.9);impact=np.sin(2*np.pi*np.cumsum(38+38*np.exp(-t*10))/SR)*np.exp(-t*5)+filt(rng.normal(0,1,len(t)),900)*np.exp(-t*13)*.27;add('fx',impact,dest,.35)
 for j in range(8):add('drums',snare,dest-.6+j*.075,.10+.025*j,(j%2-.5)*.18)
add('music',bell(81,3.2),48,.72,-.35);add('music',bell(86,3.2),50.4,.65,.35)
for at,m in [(67.2,74),(67.8,77),(68.4,81),(69.6,86),(70.2,81)]:add('music',bell(m,3),at,.54,-.2 if m%2 else .2)
add('music',pad([50,57,62,65],4.8),67.2,.65);add('bass',reese(38,1.8),67.2,.16)
music=buses['music'];wet=np.zeros_like(music)
for delay,g,swap in [(.071,.10,False),(.139,.07,True),(.225,.16,True),(.45,.09,False),(.9,.045,True)]:
 sh=int(delay*SR);wet[sh:]+=(music[:-sh,::-1] if swap else music[:-sh])*g
buses['music']+=wet
for delay,g in [(.037,.045),(.079,.026)]:
 sh=int(delay*SR);buses['drums'][sh:]+=buses['drums'][:-sh,::-1]*g
mix=sum(buses.values());mix=sosfilt(butter(2,24,btype='highpass',fs=SR,output='sos'),mix,axis=0);mix=np.tanh(mix*1.22)
tail=int(1.65*SR);mix[-tail:]*=np.linspace(1,0,tail)[:,None]**1.5;mix*=.89/max(1e-8,np.max(np.abs(mix)))
path=BASE/'score_raw.wav';wavfile.write(path,SR,np.int16(np.clip(mix,-1,1)*32767));print(path,72,'seconds',float(np.max(np.abs(mix))))
```

### 16/16 · `COSMOS/storyboard.json`
<!-- casebook-file {"path": "COSMOS/storyboard.json", "lines": 362, "final_newline": false, "sha256": "93e9e303d795c1166dcdb87d5d98ddb2fc138d1956ef5f4e6d881ba849ee418a", "original_sha256": "93e9e303d795c1166dcdb87d5d98ddb2fc138d1956ef5f4e6d881ba849ee418a"} -->
```json
[
  {
    "index": 0,
    "style": "极简动态字体",
    "dimension": "2D",
    "title": "宇宙之前",
    "caption": "所谓“之前”，我们还不知道。",
    "epoch": "起点之前 · 未知",
    "english": "BEFORE",
    "status": "未知",
    "start": 0.0,
    "duration": 2.4
  },
  {
    "index": 1,
    "style": "四维超立方体投影",
    "dimension": "4D → 3D",
    "title": "时间的边界",
    "caption": "时间是否有起点，仍是未知。",
    "epoch": "高维数学隐喻 · 非观测",
    "english": "THE LIMIT OF TIME",
    "status": "数学隐喻",
    "start": 2.4,
    "duration": 2.4
  },
  {
    "index": 2,
    "style": "故障艺术与扫描线",
    "dimension": "2D",
    "title": "抵达理论边界",
    "caption": "现有理论无法描述最初一刻。",
    "epoch": "极早期 · 理论边界",
    "english": "MODEL LIMIT",
    "status": "未知",
    "start": 4.8,
    "duration": 2.4
  },
  {
    "index": 3,
    "style": "参数线条与欧普隧道",
    "dimension": "2.5D",
    "title": "空间急剧拉伸",
    "caption": "暴涨假说：微小起伏被放大。",
    "epoch": "极早期 · 暴涨假说",
    "english": "INFLATION",
    "status": "假说",
    "start": 7.2,
    "duration": 2.4
  },
  {
    "index": 4,
    "style": "体积光与热辐射",
    "dimension": "3D",
    "title": "热大爆炸",
    "caption": "宇宙进入炽热、致密的早期。",
    "epoch": "早期宇宙 · 热演化开始",
    "english": "HOT BIG BANG",
    "status": "标准宇宙学",
    "start": 9.6,
    "duration": 2.4
  },
  {
    "index": 5,
    "style": "反应扩散与液态场",
    "dimension": "2D",
    "title": "粒子的海洋",
    "caption": "膨胀与冷却，改变物质形态。",
    "epoch": "早期宇宙 · 粒子汤",
    "english": "PARTICLE SOUP",
    "status": "过程示意",
    "start": 12.0,
    "duration": 2.4
  },
  {
    "index": 6,
    "style": "黏土微缩定格",
    "dimension": "3D",
    "title": "物质开始成形",
    "caption": "夸克结合，质子与中子形成。",
    "epoch": "最初百万分之几秒之后",
    "english": "MATTER TAKES SHAPE",
    "status": "过程示意",
    "start": 14.4,
    "duration": 2.4
  },
  {
    "index": 7,
    "style": "矢量工程蓝图",
    "dimension": "2D",
    "title": "最初的元素核",
    "caption": "最初几分钟，轻元素核诞生。",
    "epoch": "大爆炸后 · 最初几分钟",
    "english": "FIRST NUCLEI",
    "status": "过程示意",
    "start": 16.8,
    "duration": 2.4
  },
  {
    "index": 8,
    "style": "层叠剪纸与视差",
    "dimension": "2.5D",
    "title": "宇宙变得透明",
    "caption": "电子被俘获，原子开始形成。",
    "epoch": "大爆炸后 · 约38万年",
    "english": "LIGHT SET FREE",
    "status": "过程示意",
    "start": 19.2,
    "duration": 2.4
  },
  {
    "index": 9,
    "style": "孔版印刷与半调",
    "dimension": "2D",
    "title": "最古老的光",
    "caption": "这束余辉，今天仍能被看见。",
    "epoch": "约38万年 · 宇宙微波背景",
    "english": "THE OLDEST LIGHT",
    "status": "非实测图",
    "start": 21.6,
    "duration": 2.4
  },
  {
    "index": 10,
    "style": "多平面剪影舞台",
    "dimension": "2.5D",
    "title": "宇宙的黑暗时代",
    "caption": "恒星尚未点燃，引力悄然工作。",
    "epoch": "首批恒星出现之前",
    "english": "THE DARK AGES",
    "status": "过程示意",
    "start": 24.0,
    "duration": 2.4
  },
  {
    "index": 11,
    "style": "体素积木定格",
    "dimension": "3D",
    "title": "第一批恒星",
    "caption": "气体聚拢，终于点燃核聚变。",
    "epoch": "大爆炸后 · 约一两亿年起",
    "english": "FIRST STARS",
    "status": "时间为近似",
    "start": 26.4,
    "duration": 2.4
  },
  {
    "index": 12,
    "style": "赛璐璐与漫画描边",
    "dimension": "3D",
    "title": "星光亮起",
    "caption": "第一代恒星，照亮漫长黑夜。",
    "epoch": "首批恒星时代",
    "english": "IGNITION",
    "status": "过程示意",
    "start": 28.8,
    "duration": 2.4
  },
  {
    "index": 13,
    "style": "全息点云",
    "dimension": "3D",
    "title": "光改变了宇宙",
    "caption": "星光逐渐让星系间气体再电离。",
    "epoch": "最初十亿年内 · 再电离",
    "english": "REIONIZATION",
    "status": "过程示意",
    "start": 31.2,
    "duration": 2.4
  },
  {
    "index": 14,
    "style": "生成式拓扑线框",
    "dimension": "3D",
    "title": "引力编织宇宙网",
    "caption": "物质沿丝状结构汇聚，星系生长。",
    "epoch": "结构不断形成 · 非单一时点",
    "english": "THE COSMIC WEB",
    "status": "结构示意",
    "start": 33.6,
    "duration": 2.4
  },
  {
    "index": 15,
    "style": "粒子银河摄影",
    "dimension": "3D",
    "title": "亿万星辰成河",
    "caption": "恒星与气体，汇成壮丽星系。",
    "epoch": "星系演化 · 持续至今",
    "english": "GALAXIES",
    "status": "形态示意",
    "start": 36.0,
    "duration": 2.4
  },
  {
    "index": 16,
    "style": "漫画网点与冲击帧",
    "dimension": "2D",
    "title": "恒星锻造元素",
    "caption": "恒星演化与爆发，丰富了元素。",
    "epoch": "一代又一代恒星",
    "english": "STELLAR ALCHEMY",
    "status": "过程示意",
    "start": 38.4,
    "duration": 2.4
  },
  {
    "index": 17,
    "style": "拼贴与活字印刷",
    "dimension": "2.5D",
    "title": "我们来自星尘",
    "caption": "碳、氧、铁，成为新世界的原料。",
    "epoch": "重元素不断积累",
    "english": "MADE OF STARDUST",
    "status": "叙事概括",
    "start": 40.8,
    "duration": 2.4
  },
  {
    "index": 18,
    "style": "低多边形纸模",
    "dimension": "3D",
    "title": "太阳系诞生",
    "caption": "尘埃在年轻太阳周围聚集。",
    "epoch": "约46亿年前",
    "english": "A SOLAR SYSTEM",
    "status": "过程示意",
    "start": 43.2,
    "duration": 2.4
  },
  {
    "index": 19,
    "style": "程序材质与电影星球",
    "dimension": "3D",
    "title": "一颗蓝色星球",
    "caption": "尘埃聚成地球，海洋逐渐出现。",
    "epoch": "地球形成 · 约45亿年前",
    "english": "A PALE BLUE WORLD",
    "status": "程序地貌",
    "start": 45.6,
    "duration": 2.4
  },
  {
    "index": 20,
    "style": "像素生命与细胞自动机",
    "dimension": "2D",
    "title": "生命展开",
    "caption": "地球上，生命演化出复杂世界。",
    "epoch": "地球历史中的漫长岁月",
    "english": "LIFE EMERGES",
    "status": "生命的视觉隐喻",
    "start": 48.0,
    "duration": 2.4
  },
  {
    "index": 21,
    "style": "等距微缩机械",
    "dimension": "2.5D",
    "title": "宇宙开始被追问",
    "caption": "直到今天，我们开始追问来处。",
    "epoch": "今天 · 人类观测宇宙",
    "english": "THE UNIVERSE ASKS",
    "status": "叙事隐喻",
    "start": 50.4,
    "duration": 2.4
  },
  {
    "index": 22,
    "style": "时空世界线",
    "dimension": "3+1D",
    "title": "走到此刻",
    "caption": "宇宙约138亿岁，仍在膨胀。",
    "epoch": "今天 · 宇宙年龄约138亿年",
    "english": "HERE. NOW.",
    "status": "时空示意",
    "start": 52.8,
    "duration": 2.4
  },
  {
    "index": 23,
    "style": "数据叙事与科学图解",
    "dimension": "2D",
    "title": "远方渐不可及",
    "caption": "若加速膨胀继续，远方渐不可及。",
    "epoch": "未来 · 取决于暗能量",
    "english": "THE EXPANDING HORIZON",
    "status": "条件性未来",
    "start": 55.2,
    "duration": 2.4
  },
  {
    "index": 24,
    "style": "水墨流体与晕染",
    "dimension": "2D",
    "title": "太阳也会老去",
    "caption": "约50亿年后，太阳走向红巨星。",
    "epoch": "未来 · 约50亿年量级",
    "english": "EVEN SUNS GROW OLD",
    "status": "时间为近似",
    "start": 57.6,
    "duration": 2.4
  },
  {
    "index": 25,
    "style": "动力雕塑与装置定格",
    "dimension": "3D",
    "title": "最后的星光",
    "caption": "漫长岁月后，恒星时代渐近尾声。",
    "epoch": "极遥远未来 · 恒星时代之后",
    "english": "THE LAST STARLIGHT",
    "status": "长期演化推演",
    "start": 60.0,
    "duration": 2.4
  },
  {
    "index": 26,
    "style": "金属材质与粗粝微缩",
    "dimension": "3D",
    "title": "残骸的漫长时代",
    "caption": "若持续冷却，残骸将主宰长夜。",
    "epoch": "极遥远未来 · 冷却情景",
    "english": "THE AGE OF REMNANTS",
    "status": "条件性未来",
    "start": 62.4,
    "duration": 2.4
  },
  {
    "index": 27,
    "style": "引力透镜与光线偏折",
    "dimension": "3D",
    "title": "黑洞也非永恒",
    "caption": "理论预言：黑洞也会缓慢蒸发。",
    "epoch": "极遥远未来 · 霍金辐射预言",
    "english": "NOT EVEN BLACK HOLES",
    "status": "理论预言",
    "start": 64.8,
    "duration": 2.4
  },
  {
    "index": 28,
    "style": "四维超球切片",
    "dimension": "4D → 3D",
    "title": "差异逐渐消散",
    "caption": "可用于做功的能量梯度持续衰减。",
    "epoch": "高维视觉隐喻 · 非宇宙模型",
    "english": "THE LAST GRADIENT",
    "status": "数学隐喻",
    "start": 67.2,
    "duration": 2.4
  },
  {
    "index": 29,
    "style": "光绘与负空间",
    "dimension": "2D",
    "title": "从未知，到寂静",
    "caption": "热寂或是终章，但并非定论。",
    "epoch": "可能的热寂 · 不是突然爆炸",
    "english": "AFTER",
    "status": "条件性未来",
    "start": 69.6,
    "duration": 2.4
  }
]
```

