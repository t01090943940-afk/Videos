---
id: "gpt-autumn"
title: "把日子，慢慢过圆（中秋 60s）"
model: "GPT"
folder: "gpt-mid-autumn-general-video"
spec: "1920×1080 · 60fps · 60s"
stack: ["Python", "pycairo", "Pillow", "numpy", "scipy", "SoundFile", "FluidSynth（MIDI→音频）", "ffmpeg"]
genre: ["节日情感片", "中秋", "历史穿越", "祝福"]
look: ["铅笔纸张", "唐代金色矢量", "宋代水墨视差", "明清雕花月饼", "现代 2.5D 视频通话", "祝福文字墙"]
techniques: ["情绪曲线→时间预算表", "每镜一个信息任务", "0.24s 文字快速入场 reveal()", "0.22s 材质 wipe（diagonal/radial）", "圆形母题 match cut", "BGM 骤停三重置零", "程序化 MIDI 编曲+FluidSynth", "程序 Foley whoosh/click/thump/bell", "cairo 2.5D cam()", "月饼扇形 clip", "人物吃月饼 reach/咬痕", "四段并行+concat -c:v copy", "两遍 loudnorm raw_decode", "编码后静音验证"]
---

# 把日子，慢慢过圆 · 中秋 60 秒情绪旅行

![20 帧联系表](preview.jpg)

> **一句话**：不讲"中秋知识"，而让观众经历"现在太快 → 骤停 → 记忆 → 历史穿越 → 回到今天 → 未圆满也有人惦念 → 祝福 → 回到开场那轮月"；21 镜、每镜只做一件事，用"圆"（月亮/月饼/时钟/圆环）当跨时代的剪辑胶水。

| 项 | 值 |
|---|---|
| 原目录 | `gpt-mid-autumn-general-video/`（`MidAutumn_Final_60s_Source.zip`） |
| 成片 | 1920×1080 · 60 fps · 60.000 s · 3600 帧 · 21 镜 · 120 BPM · 28 MiB · 无旁白 |
| 迭代 | 先做 116 s/30fps/20 镜 → 反馈"太慢、空白多、'电子散步'是语音误识别" → **重做**（不是倍速）为 60 s/60fps |
| 收录 | `CoExp.md`（1142 行，全库最长、"慢→快"改版教训最详）· 源码 `assets/cases/gpt-autumn/`（18 个文件，含 MIDI）· `FILES.md` · `preview.jpg` |

## 什么时候抄它

- **节日/情感类**祝福短片（中秋、春节、毕业、纪念日），要"有情绪曲线、有历史厚度、落到一个具体动作"。
- 用户说 **"节奏太慢、太空"**——本案例就是"如何把慢片改快"的标准答案。
- 纯 Python 2D/2.5D：**pycairo 矢量 + Pillow 中文 + numpy 程序纹理**，不用浏览器。
- 需要 **程序化 MIDI 编曲**（1840 个事件，FluidSynth 渲染）+ **程序化 Foley**。

## 架构

```
timeline.json（21 镜 start/end/name/top/sub：画面、章节、字幕共用）
src/artwork.py  程序资产层：月面、城市窗格、纸纹、水墨山 make_hill、雕花月饼 make_cake、亭台 pavilion、人物、树枝 → 预生成 Cairo surface 并缓存
src/film60.py   FUNCS[i](c, t, u) 场景函数（绝对时间 t + 局部 u）；reveal() 0.24s 入场；WIPES 表；cam() 2.5D；eat_macro() 吃月饼近景；
                --stills 出 21 张故事板；--start/--end 局部渲；Cairo BGRA raw → ffmpeg crf18 g120
src/music60.py  120 BPM MIDI（D/G/Bm/A/Em，共享三音主题）→ FluidSynth；Foley：whoosh/click/thump/bell；5.5–6.0s 三重置零（CC120 + 数组置零 + 母带再置零）
src/master_audio.py  loudnorm 两遍（I=-16 TP=-1.3 LRA=9，json raw_decode 解析）→ 48k/24bit FLAC
build.py        4 段并行（0–16/16–30/30–45/45–60）→ concat -c:v copy + AAC 256k + chapters → QA
```

## 文件地图（`assets/cases/gpt-autumn/` 下路径，前缀 `MidAutumn_60s_Final/`）

| 文件 | 作用 |
|---|---|
| `src/film60.py` | 21 个场景函数、转场、文字、人物动作（30 KB 主体） |
| `src/artwork.py` | 全部程序资产（纸/墨/月/城/饼/亭/人） |
| `src/music60.py` · `src/master_audio.py` | 编曲 + Foley · 母带 |
| `build.py` | 一键构建 `--workers 3 [--rebuild-audio]` |
| `timeline.json` · `chapters.ffmeta` · `subtitles_zh.srt` · `screenplay_zh.txt` | 时间真源 · 章节 · 字幕 · 剧本 |
| `assets/audio_cues.json` | 全部音效 cue（绝对秒） |
| `SOURCES_AND_ASSETS.md` · `README.md` | 素材与授权说明（字体/SoundFont 不分发）· 复现说明 |
| `qa/delivery_report.json` · `qa/audio_*` | 交付 QA 证据 |

## 怎么跑

```bash
python3 scripts/casebook.py copy gpt-autumn work/gpt-autumn && cd work/gpt-autumn/MidAutumn_60s_Final
pip install -r requirements.txt     # 另需 ffmpeg、fluidsynth + 一个 GM SoundFont、Noto Serif/Sans CJK（MOON_SERIF/MOON_SANS/MOON_BOLD 环境变量可覆盖路径）
python src/film60.py --stills                      # 先看 21 张静帧
python build.py --workers 3 --rebuild-audio        # 缺 assets/score60_master.flac 时必须 --rebuild-audio
python src/film60.py --start 30 --end 33.5 --out closeup.mp4   # 局部返工
```

## 最值得抄的做法

1. **时间预算表先于动画**：`时间 | 信息任务 | 情绪 | 主视觉 | 主动作 | 文字 | 音频事件 | 转场`；60 s 片 15–24 镜，普通镜 1.5–4 s，静止 > 0.5–1 s 必须说明"观众此刻在读/感受什么"。
2. **快 ≠ 倍速**：改短版要重写镜头与音乐；时长减半升 60fps 总帧数只多 3.4%（看 `duration × fps`）。
3. **文字 0.24 s 入场**（60fps 约 14 帧，带 27 px 位移）+ 元素**并行重叠入场**，不串行排队。
4. **转场有动机**：斜向/圆形 wipe 0.22–0.27 s，只在部分切点用；和"圆"母题一致处用 radial。
5. **骤停 ≠ 黑屏**：声音归零时画面继续有月亮/波纹/文字运动；静音要在 MIDI、混音、母带三层置零，并**在最终 AAC 上验证** `silence_peak=0`（避开 codec 帧边界）。
6. **抽象概念必须落到动作**："线上团圆"→ 隔屏各吃一口月饼（`reach` 插值手到嘴、`cycle>.36` 出咬痕、`chew` 表情）。
7. **逐步描边揭示要先铺 28% alpha 的完整底图**，否则 reveal 未到之处是死区。
8. **信息型文字动画求稳**：祝福诗云从"球面投影+碰撞过滤"（会 pop）改为 10 行固定轨道 + 中央阅读孔径。
9. **铅笔抖动是位置函数**（`sin(i*2.2+x*.01)`），不是逐帧随机，不会"虫子一样抖"。
10. **白名单打包**：不打包字体、SoundFont、raw WAV、中间 part；ZIP 后 `testzip()`，成片做 SHA256。

## 坑（CoExp §三.2 共 17 条，节选）

- **语音转文字误识别**（"电子散步"）被当真需求实现了 → 突兀的核心动作词先做语义 sanity check；改需求要**文案、动作、音效三层一起改**。
- `np.int64` 进 `json.dumps` 报错 → 边界层统一转 Python 原生类型（`default=lambda x: x.item()`）。
- 解析 ffmpeg loudnorm 的 stderr JSON 报 Extra data → `json.JSONDecoder().raw_decode(s[s.rfind('{'):])[0]`。
- Cairo 复合遮罩（咬痕）→ 每个子形状前 `c.new_sub_path()`。

## CoExp 导读（行号）

L13 情绪曲线→21 镜时间表 · L43 八段情感曲线 · L58 各段设计（同一扇窗母题、骤停、每时代换材料、吃月饼、未闭合圆、诗云）· L135 节奏技巧（镜长、0.24s 入场、wipe、match cut、音效当标点）· L210 技术栈与 13 步流程 · L241 项目结构 + 统一时间轴/种子/文本缓存/2.5D cam · L335 六种风格实现 · L423 音频（MIDI 编曲、Foley、静音与淡变、两遍母带）· L480 渲染命令与分段并行 · L586 时间分配 · L613 四组清单 · L664 **17 个坑** · L884 **Phase 0–10 流程模板** · L1023 **开工提示词模板** · L1130 十条经验
