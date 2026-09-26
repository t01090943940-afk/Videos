# beyond · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show beyond <路径>`；还原成真实目录：`python3 scripts/casebook.py copy beyond <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `AI_BEYOND_GENERATION/Chinese_Subtitles.srt` | 67 | 31 |
| 2 | `AI_BEYOND_GENERATION/README.md` | 77 | 103 |
| 3 | `AI_BEYOND_GENERATION/SOURCES.md` | 56 | 185 |
| 4 | `AI_BEYOND_GENERATION/index.html` | 7 | 246 |
| 5 | `AI_BEYOND_GENERATION/qa/QA_REPORT.json` | 33 | 258 |
| 6 | `AI_BEYOND_GENERATION/qa/ffprobe.json` | 375 | 296 |
| 7 | `AI_BEYOND_GENERATION/qa/final_loudness.log` | 158 | 676 |
| 8 | `AI_BEYOND_GENERATION/requirements.txt` | 4 | 839 |
| 9 | `AI_BEYOND_GENERATION/source/art.py` | 425 | 848 |
| 10 | `AI_BEYOND_GENERATION/source/audio.py` | 102 | 1278 |
| 11 | `AI_BEYOND_GENERATION/source/finalize.py` | 23 | 1385 |
| 12 | `AI_BEYOND_GENERATION/source/nativegl.py` | 202 | 1413 |
| 13 | `AI_BEYOND_GENERATION/source/preview.py` | 19 | 1620 |
| 14 | `AI_BEYOND_GENERATION/source/render.py` | 50 | 1644 |
| 15 | `AI_BEYOND_GENERATION/source/render_all.py` | 19 | 1699 |
| 16 | `AI_BEYOND_GENERATION/source/story.json` | 127 | 1723 |
| 17 | `AI_BEYOND_GENERATION/source/threeworlds.py` | 146 | 1855 |
| 18 | `AI_BEYOND_GENERATION/source/validate.py` | 48 | 2006 |
| 19 | `AI_BEYOND_GENERATION/timeline.json` | 176 | 2059 |

---

### 1/19 · `AI_BEYOND_GENERATION/Chinese_Subtitles.srt`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/Chinese_Subtitles.srt", "lines": 67, "final_newline": true, "sha256": "89d4a6e1e7305ceaf9595c49eaf79cd5155bbcabcc5734ad2032340fd10ba9d6", "original_sha256": "89d4a6e1e7305ceaf9595c49eaf79cd5155bbcabcc5734ad2032340fd10ba9d6"} -->
```srt
1
00:00:00,200 --> 00:00:03,600
让 AI 不止回答，更把事情做对。

2
00:00:04,000 --> 00:00:11,090
目标、约束、验收标准，先于提示词。

3
00:00:11,500 --> 00:00:18,590
能用清晰工作流，就先别堆复杂 Agent。

4
00:00:19,000 --> 00:00:26,090
给任务相关材料，不是无限堆字数。

5
00:00:26,500 --> 00:00:33,590
外部事实要检索，关键结论要回源。

6
00:00:34,000 --> 00:00:41,090
工具负责执行；调用结果仍然要验证。

7
00:00:41,500 --> 00:00:48,590
区分临时上下文与长期保存的信息。

8
00:00:49,000 --> 00:00:56,090
听起来合理，不等于有事实依据。

9
00:00:56,500 --> 00:01:03,590
把“做得不错”变成明确的验收条件。

10
00:01:04,000 --> 00:01:11,090
只开放必要工具；高风险动作需确认。

11
00:01:11,500 --> 00:01:18,590
重要节点可以暂停、复核、撤回。

12
00:01:19,000 --> 00:01:26,090
缺证据时，标注未知，不填补想象。

13
00:01:26,500 --> 00:01:33,590
执行、检查、修正，并设置停止条件。

14
00:01:34,000 --> 00:01:41,090
更长推理，不自动等于更大价值。

15
00:01:41,500 --> 00:01:48,590
用真实任务与失败样本，测试整体系统。

16
00:01:49,000 --> 00:01:56,090
AI 提供更多可能；目标与责任仍由人承担。

17
00:01:56,400 --> 00:01:59,900
不止生成，更要可靠。
```

### 2/19 · `AI_BEYOND_GENERATION/README.md`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/README.md", "lines": 77, "final_newline": false, "sha256": "f5aa912721dc29132513f0961b7f1f7bf989ecbd11ea452d55d1073f97716ff1", "original_sha256": "f5aa912721dc29132513f0961b7f1f7bf989ecbd11ea452d55d1073f97716ff1"} -->
````markdown
# 超越生成 · BEYOND GENERATION

一部 120 秒的原创代码动画短片，围绕 15 个 AI 系统设计原则，以 15 种独立视觉风格呈现。

## 观看

双击 index.html 打开本地逐帧播放器，或直接打开 AI_BEYOND_GENERATION_1080p.mp4。
播放器支持 15 章跳转、0.25–2 倍速、单帧步进、按拍跳转与真实音轨波形。
键盘：空格播放/暂停；左右方向键逐帧；Shift + 方向键按拍跳转。
视频已内嵌中文字幕。Chinese_Subtitles.srt 是另附的可编辑字幕，不必重复开启。

## 成片规格

1920 × 1080，30 fps，120 秒，16:9，H.264 视频，AAC 立体声音频。
128 BPM；15 个主体世界各 16 拍，片头片尾各 8 拍。
全部镜头由同一条 120 秒时间线驱动。视频切点按最近帧取整，与音频节拍误差最多约 16.7 毫秒。

## 15 种视觉风格

01 纯线条手绘：先定义问题。
02 原创 3D MC 式方块场景：把任务拆开。
03 程序粘土定格：给足上下文。
04 Vox 式解释性拼贴：让答案有出处。
05 SVG 式纯几何矢量：用工具接入现实。
06 8-BIT 像素街机：记忆要可控。
07 半调漫画：流畅不等于正确。
08 蓝晒工程图：让结果可测试。
09 瑞士动态字体：最小权限。
10 分层剪纸剧场：让人保留决定权。
11 东方水墨：不确定就说明。
12 霓虹赛博线框：反馈驱动改进。
13 液态铬金属：算清成本与延迟。
14 三维粒子数据宇宙：小规模验证整体系统。
15 棱镜玻璃光学：把创造力还给人。

## 素材与音乐说明

网上检索并核对了 Kevin MacLeod 的《EDM Detection Mode》与其授权，但此环境无法取得该曲音频文件。
实际成片不含该曲录音，使用为本片编写的原创 128 BPM 合成电子配乐、冲击、掠过和提示音。
assets/original_score.wav 为原始合成混音；source/audio.py 可重生成。
视觉素材全部由原创代码绘制。粘土、纸张、玻璃为程序化视觉模拟，不是实拍扫描，也不是物理精确光线追踪。
“MC 式”和“Vox 式”仅描述美术参考，不代表官方素材、授权联名或相关机构背书。
AI 内容参考的原始资料、使用范围与网络曲目的未使用说明见 SOURCES.md。

## 可复现的源代码

source/art.py：二维图形、排版、手绘、纸张、水墨、像素、镜头剪辑与遮罩转场。
source/nativegl.py：原生 EGL / OpenGL，三角网格、深度测试、阴影贴图、程序材质。
source/threeworlds.py：方块、粘土、赛博、铬金属、粒子与玻璃场景。
source/story.json：中英文主标题、字幕与章节。
source/audio.py：原创音乐与音效合成。
source/render.py：按全局时间线渲染一段。
source/render_all.py：两进程并行渲染完整电影。
source/finalize.py：拼接、响度处理与导出。
timeline.json：时间、帧数和章节数据。

## 环境

需要 Linux、Python 3、NumPy、SciPy、Pillow、pycairo，以及 FFmpeg、Mesa EGL / OpenGL。
不需要联网下载 JavaScript 库，也不使用浏览器截图录屏。
字体使用本机 Noto CJK、Inter、DejaVu 与楷体；字体文件未打包。其他系统请在 source/art.py 中修改字体路径。

复现顺序：

```bash
python source/audio.py
python source/preview.py
python source/render_all.py
python source/finalize.py
```

源程序展示的是本片实现，不是 After Effects 工程文件，也不宣称可在所有设备无修改运行。

## 质量检查

qa/ 中包含章节概览、分镜抽帧与检测报告。
检测范围在 QA_REPORT.json 中明确记录；自动检测不能替代完整的人工美术审片。
````

### 3/19 · `AI_BEYOND_GENERATION/SOURCES.md`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/SOURCES.md", "lines": 56, "final_newline": true, "sha256": "0c96cacc866a752a35d4d7ec835d27934e40e4ba707b72b9e50bf3aadf4f7e3c", "original_sha256": "0c96cacc866a752a35d4d7ec835d27934e40e4ba707b72b9e50bf3aadf4f7e3c"} -->
```markdown
# Research sources and asset provenance

Sources were checked online during production. The film is an original explanatory synthesis,
not a vendor product announcement, a set of measured benchmark results or a claim of endorsement.

## S1 - Simple workflows, task decomposition, tools, feedback, stopping conditions, cost
Anthropic, Building effective agents, 2024-12-19.
https://www.anthropic.com/engineering/building-effective-agents
Used for worlds 01, 02, 05, 10, 12 and 13. The page notes that its tooling landscape has evolved;
this film uses its general design principles, not its historical product recommendations.

## S2 - Context curation and memory
Anthropic, Effective context engineering for AI agents, 2025-09-29.
https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
Used for worlds 03 and 06: select relevant context and distinguish in-context information
from deliberately persisted information. Memory-control wording is a design recommendation.

## S3 - Evidence, success criteria and end-to-end evaluations
Anthropic, Demystifying evals for AI agents, 2026-01-09.
https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
Used for worlds 04, 08 and 14. Grounding, source quality, final environmental state and realistic
failure cases inform the film. No numerical performance claims from the article are reproduced.

## S4 - Hallucination and uncertainty
OpenAI, Why language models hallucinate, 2025-09-05.
https://openai.com/index/why-language-models-hallucinate/
Used for worlds 07 and 11: fluent, confident text may be false; uncertainty should be stated.

## S5 - Human review and sensitive tool actions
OpenAI developer documentation, Guardrails and human review.
https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
Used for worlds 09 and 10. The film's least-privilege statement is a system-design recommendation.

## Editorial conclusion
World 15 is the film's human-centered creative proposition, not a measured factual finding.

## Music that was researched but NOT used
Kevin MacLeod, EDM Detection Mode, 128 BPM.
https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500026
The artist page states Creative Commons Attribution 4.0. The audio download could not be obtained
in this execution environment. No part of this recording is present in the exported film.
Do not attribute the actual soundtrack to Kevin MacLeod.

## Actual soundtrack and visuals
The score in assets/original_score.wav was synthesized for this film at 128 BPM using source/audio.py.
It combines original oscillator-based drums, bass, chord pads, arpeggios, transitions and impacts.
There are no sampled third-party recordings and no generated spoken voice.
Every visual frame is rendered from original code. No external photos or video clips were used.
The editorial collage is Vox-inspired visual language, not an official Vox production.
The block world is an original construction in an MC-inspired aesthetic, with no game assets.
Clay and paper looks are simulations. Chrome and glass use procedural lighting/reflection models,
not a claim of path-traced physically exact optics. Particle positions are an artistic construction.

## Fonts
Fonts are system dependencies only and are not redistributed in this package.
See source/art.py for the font paths. Substitute local equivalents when reproducing the render.
```

### 4/19 · `AI_BEYOND_GENERATION/index.html`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/index.html", "lines": 7, "final_newline": false, "sha256": "2c787f40bffbf78874d64b93e77e10a0ef096d2130e17eca98c1bb45fe804df3", "original_sha256": "2c787f40bffbf78874d64b93e77e10a0ef096d2130e17eca98c1bb45fe804df3"} -->
```html
<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BEYOND GENERATION / 15 DIMENSIONS</title>
<style>
:root{--paper:#f4f4ef;--ink:#192927;--muted:#79847a;--line:#daddd2;--accent:#e4613b}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,"Noto Sans CJK SC","Microsoft YaHei",sans-serif}.shell{max-width:1480px;margin:auto;padding:30px 40px 50px}header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding:0 0 22px;margin-bottom:26px}.brand{font-size:13px;letter-spacing:3px;display:flex;gap:12px;align-items:center}.mark{width:21px;height:21px;border:5px solid var(--accent);transform:rotate(45deg)}.spec{font-size:12px;color:var(--muted);letter-spacing:1px}h1{font-size:clamp(28px,3vw,48px);letter-spacing:-2px;font-weight:750;margin:0 0 8px}.sub{color:var(--muted);margin:0 0 23px;font-size:15px}.stage{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:24px;align-items:start}video{width:100%;aspect-ratio:16/9;background:#091017;display:block;border-radius:4px}.side{padding:10px 0 0}.eyebrow{font:12px monospace;color:var(--accent);letter-spacing:2px}.side h2{font-size:29px;line-height:1.4;margin:18px 0}.side p{font-size:15px;line-height:1.9;color:#65746d}.counter{font-size:67px;letter-spacing:-5px;font-weight:750;border-bottom:1px solid var(--line);padding-bottom:18px;margin-bottom:18px}.counter span{font-size:22px;letter-spacing:0;color:#98a095;margin-left:8px}.keys{font-size:11px;color:var(--muted);line-height:2.1;margin-top:32px}.transport{display:flex;align-items:center;gap:8px;padding:16px 0}button,select{font:inherit;border:1px solid var(--line);color:var(--ink);background:#fbfcf6;border-radius:3px;padding:9px 12px;cursor:pointer}button:hover{border-color:var(--accent);color:var(--accent)}.primary{background:var(--ink);color:#fff;border-color:var(--ink)}.time{font:14px monospace;margin-left:7px;margin-right:auto}.wave{height:66px;width:100%;display:block;cursor:crosshair}.section-title{display:flex;align-items:center;justify-content:space-between;margin:30px 0 14px;font-size:13px;letter-spacing:2px}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.chapter{padding:0;border:1px solid var(--line);border-radius:4px;overflow:hidden;text-align:left;background:#fcfcf7;transition:transform .15s}.chapter:hover{transform:translateY(-3px)}.chapter.active{border:2px solid var(--accent)}.chapter img{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}.ch-label{padding:11px 12px;font-size:12px;display:flex;gap:10px}.ch-label b{font:11px monospace;color:var(--accent)}.ch-label span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}footer{margin-top:28px;border-top:1px solid var(--line);padding-top:20px;color:var(--muted);font-size:12px;line-height:1.9}a{color:#63776b} @media(max-width:950px){.stage{grid-template-columns:1fr}.side{display:none}.shell{padding:20px}.grid{grid-template-columns:repeat(3,1fr)}.spec{display:none}} @media(max-width:560px){.grid{grid-template-columns:repeat(2,1fr)}.transport{flex-wrap:wrap}.time{margin-right:0}}
</style><main class="shell"><header><div class="brand"><i class="mark"></i>BEYOND GENERATION</div><div class="spec">120 SECONDS &nbsp;/&nbsp; 1080p &nbsp;/&nbsp; 30 FPS &nbsp;/&nbsp; 128 BPM</div></header><h1>超越生成 · 15 DIMENSIONS</h1><p class="sub">让 AI 不止回答，更把事情做对。</p><div class="stage"><section><video id="v" src="AI_BEYOND_GENERATION_1080p.mp4" poster="qa/contact_sheet.jpg" preload="metadata" controls playsinline></video><div class="transport"><button id="play" class="primary">PLAY / PAUSE</button><button id="prev">−1 FRAME</button><button id="next">+1 FRAME</button><span class="time" id="tc">00:00.00 / 02:00</span><select id="speed" aria-label="Playback speed"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select><button id="full">FULLSCREEN</button></div><canvas class="wave" id="wave"></canvas></section><aside class="side"><div class="eyebrow">NOW EXPLORING</div><div class="counter" id="idx">00<span>/ 15</span></div><h2 id="stitle">超越生成</h2><p id="scaption">让 AI 不止回答，更把事情做对。</p><p id="style"></p><div class="keys">SPACE — PLAY / PAUSE<br>← / → — ONE FRAME<br>SHIFT + ← / → — ONE BEAT<br>CLICK WAVEFORM — SEEK</div></aside></div><div class="section-title"><span>CHAPTERS / 15 WORLDS</span><span>CLICK TO JUMP</span></div><section class="grid" id="grid"></section><footer>画面、配乐与音效均为本片原创代码生成。网络选曲未写入成片；实际音轨为原创 128 BPM 合成电子配乐。Vox 式、MC 式为视觉参考，不代表官方素材。研究来源与素材说明见 SOURCES.md。<br>Project sources: <a href="README.md">README</a> · <a href="SOURCES.md">Research &amp; provenance</a> · <a href="Chinese_Subtitles.srt">Chinese subtitles</a></footer></main>
<script>const chapters=[{"index": 1, "start": 3.75, "end": 11.25, "start_frame": 113, "style": "纯线条手绘", "title": "先定义问题", "caption": "目标、约束、验收标准，先于提示词。", "tag": "HAND-DRAWN / 01", "beats": 16}, {"index": 2, "start": 11.25, "end": 18.75, "start_frame": 338, "style": "3D MC 方块世界", "title": "把任务拆开", "caption": "能用清晰工作流，就先别堆复杂 Agent。", "tag": "BLOCK WORLD / 02", "beats": 16}, {"index": 3, "start": 18.75, "end": 26.25, "start_frame": 563, "style": "粘土定格", "title": "给足上下文", "caption": "给任务相关材料，不是无限堆字数。", "tag": "CLAYMATION / 03", "beats": 16}, {"index": 4, "start": 26.25, "end": 33.75, "start_frame": 788, "style": "Vox 式解释拼贴", "title": "让答案有出处", "caption": "外部事实要检索，关键结论要回源。", "tag": "EDITORIAL COLLAGE / 04", "beats": 16}, {"index": 5, "start": 33.75, "end": 41.25, "start_frame": 1013, "style": "SVG 几何矢量", "title": "用工具接入现实", "caption": "工具负责执行；调用结果仍然要验证。", "tag": "PURE VECTOR / 05", "beats": 16}, {"index": 6, "start": 41.25, "end": 48.75, "start_frame": 1238, "style": "8-BIT 像素街机", "title": "记忆要可控", "caption": "区分临时上下文与长期保存的信息。", "tag": "PIXEL ARCADE / 06", "beats": 16}, {"index": 7, "start": 48.75, "end": 56.25, "start_frame": 1463, "style": "半调漫画", "title": "流畅 ≠ 正确", "caption": "听起来合理，不等于有事实依据。", "tag": "HALFTONE COMIC / 07", "beats": 16}, {"index": 8, "start": 56.25, "end": 63.75, "start_frame": 1688, "style": "蓝晒工程制图", "title": "让结果可测试", "caption": "把“做得不错”变成明确的验收条件。", "tag": "BLUEPRINT / 08", "beats": 16}, {"index": 9, "start": 63.75, "end": 71.25, "start_frame": 1913, "style": "瑞士动态字体", "title": "最小权限", "caption": "只开放必要工具；高风险动作需确认。", "tag": "KINETIC TYPE / 09", "beats": 16}, {"index": 10, "start": 71.25, "end": 78.75, "start_frame": 2138, "style": "立体剪纸剧场", "title": "让人保留决定权", "caption": "重要节点可以暂停、复核、撤回。", "tag": "PAPER THEATRE / 10", "beats": 16}, {"index": 11, "start": 78.75, "end": 86.25, "start_frame": 2363, "style": "东方水墨", "title": "不确定，就说明", "caption": "缺证据时，标注未知，不填补想象。", "tag": "INK & SILENCE / 11", "beats": 16}, {"index": 12, "start": 86.25, "end": 93.75, "start_frame": 2588, "style": "霓虹赛博线框", "title": "反馈驱动改进", "caption": "执行、检查、修正，并设置停止条件。", "tag": "NEON SYSTEM / 12", "beats": 16}, {"index": 13, "start": 93.75, "end": 101.25, "start_frame": 2813, "style": "液态铬金属", "title": "算清成本与延迟", "caption": "更长推理，不自动等于更大价值。", "tag": "LIQUID CHROME / 13", "beats": 16}, {"index": 14, "start": 101.25, "end": 108.75, "start_frame": 3038, "style": "粒子数据宇宙", "title": "先做小规模验证", "caption": "用真实任务与失败样本，测试整体系统。", "tag": "PARTICLE COSMOS / 14", "beats": 16}, {"index": 15, "start": 108.75, "end": 116.25, "start_frame": 3263, "style": "棱镜玻璃光学", "title": "把创造力还给人", "caption": "AI 提供更多可能；目标与责任仍由人承担。", "tag": "PRISMATIC GLASS / 15", "beats": 16}],wave=[0.3173, 0.1682, 0.1797, 0.1638, 0.2694, 0.1976, 0.115, 0.1934, 0.1315, 0.3308, 0.1764, 0.1124, 0.2061, 0.102, 0.2688, 0.1954, 0.1715, 0.1637, 0.2472, 0.3208, 0.1557, 0.1975, 0.1421, 0.2696, 0.1949, 0.1078, 0.1938, 0.1051, 0.3308, 0.1692, 0.1647, 0.1827, 0.2349, 0.2186, 0.1401, 0.2043, 0.1396, 0.4502, 0.4414, 0.2164, 0.2612, 0.162, 0.4484, 0.3056, 0.1401, 0.1981, 0.2823, 0.3754, 0.1807, 0.1937, 0.1337, 0.3965, 0.3946, 0.1729, 0.1909, 0.1162, 0.3979, 0.2954, 0.1269, 0.207, 0.1075, 0.4272, 0.2203, 0.1854, 0.1488, 0.3632, 0.3557, 0.1711, 0.1932, 0.1155, 0.4664, 0.3229, 0.1575, 0.2054, 0.1297, 0.4152, 0.2353, 0.183, 0.1571, 0.3963, 0.3518, 0.1432, 0.1909, 0.1171, 0.4041, 0.3597, 0.1466, 0.1999, 0.0936, 0.4174, 0.2097, 0.1668, 0.1739, 0.3603, 0.4019, 0.1842, 0.1928, 0.1316, 0.4019, 0.3431, 0.123, 0.1899, 0.1022, 0.4106, 0.2677, 0.1803, 0.1784, 0.3463, 0.369, 0.1673, 0.2048, 0.1501, 0.4589, 0.4608, 0.236, 0.2338, 0.0982, 0.4113, 0.1822, 0.1252, 0.2046, 0.2951, 0.3812, 0.1602, 0.2046, 0.1479, 0.4009, 0.3098, 0.1341, 0.2025, 0.1201, 0.3957, 0.2736, 0.1256, 0.1979, 0.12, 0.3818, 0.1358, 0.181, 0.1638, 0.3635, 0.3677, 0.1323, 0.2091, 0.1156, 0.4289, 0.2253, 0.1534, 0.2166, 0.1233, 0.4166, 0.2089, 0.1785, 0.1679, 0.3939, 0.2562, 0.1381, 0.1974, 0.1355, 0.4215, 0.2172, 0.1396, 0.2116, 0.1036, 0.3915, 0.2422, 0.1744, 0.1687, 0.3655, 0.3758, 0.1894, 0.1946, 0.1443, 0.3935, 0.2426, 0.1302, 0.1978, 0.1058, 0.4214, 0.202, 0.1635, 0.1843, 0.349, 0.2895, 0.1743, 0.2081, 0.1594, 0.4522, 0.4337, 0.2165, 0.2612, 0.1621, 0.4487, 0.3059, 0.1402, 0.1982, 0.2821, 0.3755, 0.1807, 0.1937, 0.1337, 0.3958, 0.3946, 0.173, 0.1912, 0.1162, 0.3981, 0.295, 0.127, 0.2074, 0.1077, 0.4267, 0.2205, 0.1853, 0.1488, 0.3633, 0.3556, 0.1711, 0.1933, 0.1156, 0.4664, 0.3229, 0.1578, 0.2059, 0.1297, 0.4157, 0.2352, 0.183, 0.157, 0.3961, 0.3518, 0.1432, 0.1907, 0.117, 0.4037, 0.3598, 0.1466, 0.1999, 0.0935, 0.4173, 0.2097, 0.1674, 0.174, 0.3607, 0.402, 0.1843, 0.1927, 0.1315, 0.4018, 0.3432, 0.1229, 0.19, 0.1022, 0.4103, 0.2677, 0.18, 0.1784, 0.3495, 0.372, 0.1753, 0.2155, 0.1569, 0.4614, 0.4542, 0.2366, 0.2337, 0.0984, 0.4112, 0.1823, 0.1252, 0.2044, 0.2951, 0.3814, 0.1602, 0.2044, 0.148, 0.4007, 0.31, 0.134, 0.2023, 0.1201, 0.3957, 0.2736, 0.1254, 0.198, 0.1199, 0.3818, 0.1358, 0.181, 0.1638, 0.3634, 0.3672, 0.1324, 0.2091, 0.1156, 0.4289, 0.2253, 0.153, 0.2165, 0.1234, 0.4166, 0.2089, 0.1786, 0.1681, 0.3938, 0.2563, 0.1381, 0.1974, 0.1355, 0.4214, 0.2172, 0.1395, 0.2115, 0.1035, 0.3913, 0.2422, 0.1743, 0.1688, 0.3654, 0.3758, 0.1894, 0.1943, 0.1447, 0.3936, 0.2425, 0.13, 0.1979, 0.1056, 0.4214, 0.2022, 0.1645, 0.1841, 0.352, 0.2861, 0.166, 0.2017, 0.1521, 0.4693, 0.4507, 0.2199, 0.2622, 0.1628, 0.4797, 0.322, 0.144, 0.199, 0.3145, 0.4075, 0.192, 0.1934, 0.1337, 0.4337, 0.4176, 0.1829, 0.1922, 0.1168, 0.4316, 0.3076, 0.1297, 0.208, 0.1082, 0.458, 0.2336, 0.1859, 0.1487, 0.4005, 0.3775, 0.1813, 0.1933, 0.1161, 0.4984, 0.3409, 0.1639, 0.2064, 0.1299, 0.4454, 0.2499, 0.1817, 0.1562, 0.4352, 0.3741, 0.1523, 0.1899, 0.1165, 0.4371, 0.3801, 0.1537, 0.2004, 0.0939, 0.4504, 0.2248, 0.1662, 0.1735, 0.3962, 0.4238, 0.1945, 0.1922, 0.1312, 0.4407, 0.3619, 0.1299, 0.1893, 0.1024, 0.4414, 0.2846, 0.1818, 0.1782, 0.3834, 0.3951, 0.179, 0.2044, 0.1468, 0.4811, 0.4764, 0.2417, 0.2355, 0.0983, 0.4469, 0.196, 0.1279, 0.2053, 0.3257, 0.41, 0.1688, 0.2047, 0.148, 0.4386, 0.3331, 0.1419, 0.2029, 0.1203, 0.426, 0.2902, 0.1291, 0.1985, 0.1214, 0.4146, 0.1455, 0.1803, 0.1653, 0.3992, 0.3902, 0.1406, 0.2094, 0.1157, 0.4642, 0.2425, 0.1567, 0.2163, 0.1235, 0.4497, 0.2218, 0.1778, 0.1688, 0.4312, 0.2778, 0.1458, 0.1972, 0.1363, 0.4543, 0.2355, 0.1491, 0.2127, 0.1036, 0.4307, 0.2576, 0.1735, 0.1697, 0.4014, 0.4011, 0.2007, 0.1938, 0.1457, 0.4321, 0.2579, 0.1372, 0.1975, 0.1061, 0.4539, 0.214, 0.1646, 0.184, 0.3854, 0.3151, 0.1845, 0.2013, 0.1514, 0.469, 0.4486, 0.2209, 0.2622, 0.163, 0.4797, 0.322, 0.1438, 0.199, 0.3149, 0.4074, 0.1921, 0.1935, 0.1338, 0.4339, 0.418, 0.1829, 0.1922, 0.1168, 0.4319, 0.3074, 0.1295, 0.208, 0.1082, 0.4579, 0.2336, 0.1859, 0.1488, 0.4004, 0.3775, 0.1814, 0.1935, 0.1161, 0.4982, 0.3408, 0.1638, 0.2063, 0.1299, 0.4454, 0.2499, 0.1813, 0.1564, 0.4348, 0.374, 0.1522, 0.1899, 0.1167, 0.4373, 0.3803, 0.1536, 0.2006, 0.0939, 0.4508, 0.2248, 0.1657, 0.1734, 0.3961, 0.4235, 0.1944, 0.1918, 0.1312, 0.4406, 0.362, 0.1301, 0.1894, 0.1025, 0.4413, 0.2843, 0.1818, 0.1783, 0.3813, 0.3948, 0.1881, 0.2177, 0.1557, 0.4926, 0.4831, 0.2414, 0.2354, 0.0983, 0.4472, 0.1961, 0.1281, 0.2049, 0.3255, 0.4101, 0.1688, 0.2047, 0.1483, 0.4386, 0.3329, 0.1419, 0.2029, 0.1203, 0.4259, 0.29, 0.1295, 0.1984, 0.1213, 0.4146, 0.1456, 0.1803, 0.1653, 0.3993, 0.3902, 0.1406, 0.2096, 0.1158, 0.4644, 0.2429, 0.1566, 0.2165, 0.1235, 0.4496, 0.2218, 0.1778, 0.1688, 0.4315, 0.2778, 0.1459, 0.1972, 0.1363, 0.4538, 0.2355, 0.1491, 0.2127, 0.1036, 0.4307, 0.2576, 0.1738, 0.1698, 0.402, 0.4011, 0.2007, 0.1936, 0.1457, 0.4321, 0.2579, 0.1372, 0.1974, 0.1061, 0.4533, 0.2141, 0.1646, 0.1842, 0.3857, 0.3143, 0.175, 0.1973, 0.1468, 0.4683, 0.4527, 0.2208, 0.2627, 0.163, 0.4795, 0.3221, 0.1438, 0.199, 0.3152, 0.4072, 0.1922, 0.1939, 0.1339, 0.4345, 0.4182, 0.1828, 0.1922, 0.1168, 0.4318, 0.3074, 0.1296, 0.2079, 0.1082, 0.4577, 0.2336, 0.186, 0.1487, 0.4005, 0.3775, 0.1813, 0.1937, 0.1162, 0.4982, 0.3409, 0.1638, 0.2063, 0.1297, 0.4452, 0.2498, 0.1813, 0.1563, 0.4347, 0.3739, 0.1522, 0.1899, 0.1169, 0.4372, 0.38, 0.1537, 0.2004, 0.0939, 0.4508, 0.2247, 0.1656, 0.1734, 0.3959, 0.4236, 0.1943, 0.1923, 0.1312, 0.4406, 0.362, 0.1301, 0.1894, 0.1025, 0.4413, 0.2841, 0.1819, 0.1784, 0.3837, 0.3943, 0.1809, 0.1999, 0.1505, 0.4777, 0.4792, 0.2401, 0.2353, 0.0983, 0.4479, 0.1964, 0.1279, 0.2051, 0.3255, 0.4101, 0.1688, 0.2044, 0.1481, 0.4381, 0.3331, 0.1419, 0.203, 0.1203, 0.426, 0.2903, 0.1297, 0.1984, 0.1214, 0.4146, 0.1455, 0.1803, 0.1652, 0.3993, 0.3902, 0.1407, 0.2094, 0.1158, 0.4645, 0.243, 0.1566, 0.2165, 0.1235, 0.4492, 0.222, 0.1778, 0.1689, 0.4314, 0.2778, 0.1459, 0.197, 0.1361, 0.4532, 0.2356, 0.1493, 0.2128, 0.1036, 0.4306, 0.2576, 0.1738, 0.1698, 0.402, 0.401, 0.2007, 0.1933, 0.1457, 0.432, 0.2579, 0.1372, 0.1974, 0.1061, 0.4532, 0.214, 0.1646, 0.1842, 0.3862, 0.3171, 0.1848, 0.2034, 0.1558, 0.464, 0.4811, 0.2246, 0.1241, 0.093, 0.0779, 0.0778, 0.0853, 0.0862, 0.0795, 0.0653, 0.0721, 0.0763, 0.0693, 0.0632, 0.0687, 0.077, 0.0902, 0.0819, 0.4122, 0.2253, 0.1062, 0.0573, 0.0539, 0.063, 0.0708, 0.0854, 0.0835, 0.0755, 0.0678, 0.0682, 0.0772, 0.0679, 0.0814, 0.1017, 0.1135, 0.1181, 0.116, 0.4136, 0.18, 0.0847, 0.0887, 0.0735, 0.068, 0.0813, 0.0844, 0.0689, 0.0659, 0.0719, 0.0724, 0.0864, 0.0828, 0.0563, 0.0609, 0.1073, 0.0902, 0.3961, 0.3283, 0.1326, 0.0902, 0.0846, 0.0703, 0.0716, 0.0841, 0.0768, 0.0681, 0.0671, 0.0721, 0.0782, 0.085, 0.0769, 0.066, 0.1048, 0.1378, 0.111, 0.4776, 0.4772, 0.2404, 0.2355, 0.0982, 0.4477, 0.1964, 0.1279, 0.2053, 0.3258, 0.4101, 0.1688, 0.2044, 0.1481, 0.4384, 0.3331, 0.1418, 0.2033, 0.1203, 0.426, 0.2902, 0.1295, 0.1984, 0.1214, 0.4146, 0.1455, 0.1803, 0.1652, 0.3989, 0.3902, 0.1406, 0.2094, 0.1157, 0.4643, 0.2426, 0.1567, 0.2165, 0.1235, 0.4494, 0.222, 0.1774, 0.1688, 0.431, 0.2778, 0.1458, 0.1971, 0.1361, 0.4533, 0.2356, 0.1493, 0.2129, 0.1036, 0.4307, 0.2576, 0.1738, 0.1698, 0.402, 0.401, 0.2007, 0.1936, 0.1455, 0.4312, 0.258, 0.1371, 0.1975, 0.1061, 0.4534, 0.2141, 0.1646, 0.1842, 0.3843, 0.3103, 0.1778, 0.1965, 0.1464, 0.4739, 0.4495, 0.2207, 0.2636, 0.1629, 0.4817, 0.3222, 0.144, 0.1986, 0.3114, 0.408, 0.1919, 0.195, 0.1343, 0.4364, 0.4182, 0.1826, 0.1932, 0.1169, 0.4331, 0.3072, 0.1303, 0.2094, 0.1087, 0.4583, 0.2342, 0.1863, 0.1499, 0.4009, 0.3766, 0.1804, 0.1944, 0.1166, 0.4991, 0.3416, 0.1645, 0.2067, 0.1301, 0.4473, 0.2507, 0.1821, 0.1568, 0.4359, 0.3745, 0.1527, 0.1911, 0.118, 0.4383, 0.3792, 0.1548, 0.2017, 0.094, 0.4517, 0.2247, 0.1682, 0.1735, 0.3971, 0.4249, 0.1951, 0.1918, 0.1315, 0.4403, 0.3624, 0.1311, 0.1902, 0.103, 0.4423, 0.2833, 0.1813, 0.1784, 0.3832, 0.3927, 0.1732, 0.2036, 0.1427, 0.4709, 0.4764, 0.2414, 0.2351, 0.0992, 0.4496, 0.1957, 0.1295, 0.2048, 0.3266, 0.4105, 0.1695, 0.2042, 0.1492, 0.4403, 0.334, 0.1422, 0.2032, 0.1203, 0.4269, 0.2906, 0.1306, 0.199, 0.1213, 0.4148, 0.1454, 0.1802, 0.1648, 0.3994, 0.3895, 0.141, 0.2106, 0.1165, 0.466, 0.242, 0.1575, 0.2175, 0.1239, 0.4486, 0.2223, 0.1774, 0.1691, 0.4319, 0.2776, 0.1459, 0.1979, 0.1367, 0.4546, 0.235, 0.1496, 0.2134, 0.1041, 0.4302, 0.2568, 0.1743, 0.1702, 0.4035, 0.4003, 0.2011, 0.1944, 0.1458, 0.4329, 0.2583, 0.1377, 0.1983, 0.1068, 0.4544, 0.2143, 0.1638, 0.1845, 0.3839, 0.3136, 0.1848, 0.2061, 0.1555, 0.4693, 0.4561, 0.2207, 0.2633, 0.1628, 0.4818, 0.3221, 0.144, 0.1986, 0.3112, 0.408, 0.1919, 0.1948, 0.1342, 0.4368, 0.4179, 0.1827, 0.1932, 0.117, 0.4332, 0.3071, 0.1301, 0.2095, 0.1089, 0.4584, 0.2343, 0.186, 0.1498, 0.4006, 0.3765, 0.1804, 0.1945, 0.1167, 0.4992, 0.3417, 0.1647, 0.207, 0.1301, 0.4481, 0.2507, 0.1821, 0.1568, 0.4357, 0.3745, 0.1527, 0.191, 0.118, 0.4378, 0.3791, 0.1548, 0.2017, 0.094, 0.452, 0.2247, 0.1682, 0.1734, 0.3976, 0.425, 0.195, 0.1918, 0.1315, 0.4403, 0.3625, 0.1311, 0.1902, 0.1029, 0.4423, 0.2832, 0.1814, 0.1787, 0.3832, 0.3961, 0.1857, 0.2056, 0.157, 0.498, 0.5016, 0.2812, 0.2611, 0.1327, 0.4584, 0.2102, 0.1464, 0.2188, 0.3283, 0.4151, 0.1737, 0.2041, 0.153, 0.4394, 0.3318, 0.144, 0.204, 0.1199, 0.4273, 0.2894, 0.1264, 0.1825, 0.1051, 0.3207, 0.0993, 0.1106, 0.0962, 0.1916, 0.1801, 0.0537, 0.0653, 0.032, 0.0898, 0.041, 0.0143, 0.0129, 0.0025];const v=document.getElementById('v'),grid=document.getElementById('grid'),cv=document.getElementById('wave'),ctx=cv.getContext('2d');const buttons=[];chapters.forEach((s,i)=>{let b=document.createElement('button');b.className='chapter';let img=document.createElement('img');img.src='qa/world_'+String(i+1).padStart(2,'0')+'.png';img.alt=s.style;let label=document.createElement('div');label.className='ch-label';let no=document.createElement('b');no.textContent=String(i+1).padStart(2,'0');let name=document.createElement('span');name.textContent=s.style;label.append(no,name);b.append(img,label);b.onclick=()=>{v.currentTime=s.start+.18;v.play().catch(()=>{});};grid.append(b);buttons.push(b);});
const toggle=()=>v.paused?v.play().catch(()=>{}):v.pause();document.getElementById('play').onclick=toggle;document.getElementById('prev').onclick=()=>{v.pause();v.currentTime=Math.max(0,v.currentTime-1/30)};document.getElementById('next').onclick=()=>{v.pause();v.currentTime=Math.min(120,v.currentTime+1/30)};document.getElementById('speed').onchange=e=>v.playbackRate=Number(e.target.value);document.getElementById('full').onclick=()=>v.requestFullscreen&&v.requestFullscreen();window.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT')return;if(e.code==='Space'){e.preventDefault();toggle()}if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();v.pause();v.currentTime=Math.max(0,Math.min(120,v.currentTime+(e.code==='ArrowLeft'?-1:1)*(e.shiftKey?60/128:1/30)))}});
cv.onclick=e=>{const r=cv.getBoundingClientRect();v.currentTime=120*(e.clientX-r.left)/r.width};let active=-2;function draw(){const dpr=devicePixelRatio||1;const w=cv.clientWidth,h=cv.clientHeight;if(cv.width!==w*dpr){cv.width=w*dpr;cv.height=h*dpr;}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const t=v.currentTime||0;for(let i=0;i<w;i+=2){let amp=wave[Math.min(wave.length-1,Math.floor(i/w*wave.length))];let hh=Math.max(1,amp*h*1.8);ctx.fillStyle=i/w<t/120?'#dc704b':'#c9cfc3';ctx.fillRect(i,(h-hh)/2,1,hh)}ctx.fillStyle='#273c34';ctx.fillRect(t/120*w,0,1,h);let n=chapters.findIndex(s=>t>=s.start&&t<s.end);if(n!==active){active=n;buttons.forEach((b,i)=>b.classList.toggle('active',i===n));if(n>=0){const s=chapters[n];document.getElementById('idx').innerHTML=String(n+1).padStart(2,'0')+'<span>/ 15</span>';document.getElementById('stitle').textContent=s.title;document.getElementById('scaption').textContent=s.caption;document.getElementById('style').textContent=s.style;}else{document.getElementById('idx').innerHTML=(t>116?'END':'00')+'<span>/ 15</span>';}}let m=Math.floor(t/60),ss=(t%60).toFixed(2).padStart(5,'0');document.getElementById('tc').textContent=String(m).padStart(2,'0')+':'+ss+' / 02:00';requestAnimationFrame(draw)}draw();</script></html>
```

### 5/19 · `AI_BEYOND_GENERATION/qa/QA_REPORT.json`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/qa/QA_REPORT.json", "lines": 33, "final_newline": false, "sha256": "9c63b49079ffe22de45b4e88677c72c53355274ae83f7a19c56ff0659b3e43f9", "original_sha256": "9c63b49079ffe22de45b4e88677c72c53355274ae83f7a19c56ff0659b3e43f9"} -->
```json
{
  "video": "AI_BEYOND_GENERATION_1080p.mp4",
  "bytes": 52870272,
  "duration_seconds": 120.0,
  "width": 1920,
  "height": 1080,
  "fps": "30/1",
  "decoded_frames": 3600,
  "expected_frames": 3600,
  "video_codec": "h264",
  "audio_codec": "aac",
  "audio_sample_rate": "48000",
  "audio_channels": 2,
  "audio_video_duration_difference": 0.0,
  "chapters": 17,
  "all_black_frame_count": 0,
  "all_white_frame_count": 0,
  "uniform_blank_frame_count": 0,
  "minimum_frame_mean": 7.6168402777777775,
  "minimum_frame_std": 17.11636390759885,
  "maximum_exact_duplicate_run_full_resolution": 3,
  "maximum_exact_duplicate_run_scaled_screen": 3,
  "beat_alignment_maximum_rounding_error_ms": 16.666666666666668,
  "visual_review": "Chapter overviews and 3 samples per segment. Dedicated reading zones during close-ups; no text crossfades. This does not claim exhaustive human review of every pixel.",
  "music": "Original synthesized score. The researched third-party BGM recording was not downloaded and is not used.",
  "analysis_seconds": 25.660648822784424,
  "encoded_audio_integrated_loudness_lufs": -16.7,
  "encoded_audio_true_peak_dbtp": -1.02,
  "encoded_audio_loudness_range_lu": 1.3,
  "sha256": "601f16537ee2b6bf74f8b5e52c2ac47ec81b3e7c2db511f4364b960eb3706774",
  "player_javascript_syntax": "PASS, node --check",
  "player_end_to_end_browser_test": "Not completed: managed Chromium blocked file:// and localhost navigation. Main MP4 was fully decoded independently with FFmpeg."
}
```

### 6/19 · `AI_BEYOND_GENERATION/qa/ffprobe.json`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/qa/ffprobe.json", "lines": 375, "final_newline": true, "sha256": "53435178f281c4eaa223b8c12685025534091a7fbcf7de82f11c9a506b292b7f", "original_sha256": "53435178f281c4eaa223b8c12685025534091a7fbcf7de82f11c9a506b292b7f"} -->
```json
{
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
            "color_range": "tv",
            "color_space": "bt709",
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
            "duration_ts": 1843200,
            "duration": "120.000000",
            "bit_rate": "3237841",
            "bits_per_raw_sample": "8",
            "nb_frames": "3600",
            "extradata_size": 50,
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
            "duration_ts": 5760000,
            "duration": "120.000000",
            "bit_rate": "277804",
            "nb_frames": "5626",
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
            "duration_ts": 120000,
            "duration": "120.000000",
            "bit_rate": "40",
            "nb_frames": "17",
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
            "end": 3750,
            "end_time": "3.750000",
            "tags": {
                "title": "OPEN / BEYOND GENERATION"
            }
        },
        {
            "id": 1,
            "time_base": "1/1000",
            "start": 3750,
            "start_time": "3.750000",
            "end": 11250,
            "end_time": "11.250000",
            "tags": {
                "title": "01 / 纯线条手绘"
            }
        },
        {
            "id": 2,
            "time_base": "1/1000",
            "start": 11250,
            "start_time": "11.250000",
            "end": 18750,
            "end_time": "18.750000",
            "tags": {
                "title": "02 / 3D MC 方块世界"
            }
        },
        {
            "id": 3,
            "time_base": "1/1000",
            "start": 18750,
            "start_time": "18.750000",
            "end": 26250,
            "end_time": "26.250000",
            "tags": {
                "title": "03 / 粘土定格"
            }
        },
        {
            "id": 4,
            "time_base": "1/1000",
            "start": 26250,
            "start_time": "26.250000",
            "end": 33750,
            "end_time": "33.750000",
            "tags": {
                "title": "04 / Vox 式解释拼贴"
            }
        },
        {
            "id": 5,
            "time_base": "1/1000",
            "start": 33750,
            "start_time": "33.750000",
            "end": 41250,
            "end_time": "41.250000",
            "tags": {
                "title": "05 / SVG 几何矢量"
            }
        },
        {
            "id": 6,
            "time_base": "1/1000",
            "start": 41250,
            "start_time": "41.250000",
            "end": 48750,
            "end_time": "48.750000",
            "tags": {
                "title": "06 / 8-BIT 像素街机"
            }
        },
        {
            "id": 7,
            "time_base": "1/1000",
            "start": 48750,
            "start_time": "48.750000",
            "end": 56250,
            "end_time": "56.250000",
            "tags": {
                "title": "07 / 半调漫画"
            }
        },
        {
            "id": 8,
            "time_base": "1/1000",
            "start": 56250,
            "start_time": "56.250000",
            "end": 63750,
            "end_time": "63.750000",
            "tags": {
                "title": "08 / 蓝晒工程制图"
            }
        },
        {
            "id": 9,
            "time_base": "1/1000",
            "start": 63750,
            "start_time": "63.750000",
            "end": 71250,
            "end_time": "71.250000",
            "tags": {
                "title": "09 / 瑞士动态字体"
            }
        },
        {
            "id": 10,
            "time_base": "1/1000",
            "start": 71250,
            "start_time": "71.250000",
            "end": 78750,
            "end_time": "78.750000",
            "tags": {
                "title": "10 / 立体剪纸剧场"
            }
        },
        {
            "id": 11,
            "time_base": "1/1000",
            "start": 78750,
            "start_time": "78.750000",
            "end": 86250,
            "end_time": "86.250000",
            "tags": {
                "title": "11 / 东方水墨"
            }
        },
        {
            "id": 12,
            "time_base": "1/1000",
            "start": 86250,
            "start_time": "86.250000",
            "end": 93750,
            "end_time": "93.750000",
            "tags": {
                "title": "12 / 霓虹赛博线框"
            }
        },
        {
            "id": 13,
            "time_base": "1/1000",
            "start": 93750,
            "start_time": "93.750000",
            "end": 101250,
            "end_time": "101.250000",
            "tags": {
                "title": "13 / 液态铬金属"
            }
        },
        {
            "id": 14,
            "time_base": "1/1000",
            "start": 101250,
            "start_time": "101.250000",
            "end": 108750,
            "end_time": "108.750000",
            "tags": {
                "title": "14 / 粒子数据宇宙"
            }
        },
        {
            "id": 15,
            "time_base": "1/1000",
            "start": 108750,
            "start_time": "108.750000",
            "end": 116250,
            "end_time": "116.250000",
            "tags": {
                "title": "15 / 棱镜玻璃光学"
            }
        },
        {
            "id": 16,
            "time_base": "1/1000",
            "start": 116250,
            "start_time": "116.250000",
            "end": 120000,
            "end_time": "120.000000",
            "tags": {
                "title": "END / BUILD WITH INTENT"
            }
        }
    ],
    "format": {
        "filename": "/mnt/data/ai_dimensions/AI_BEYOND_GENERATION_1080p.mp4",
        "nb_streams": 3,
        "nb_programs": 0,
        "nb_stream_groups": 0,
        "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
        "format_long_name": "QuickTime / MOV",
        "start_time": "0.000000",
        "duration": "120.000000",
        "size": "52870272",
        "bit_rate": "3524684",
        "probe_score": 100,
        "tags": {
            "major_brand": "isom",
            "minor_version": "512",
            "compatible_brands": "isomiso2avc1mp41",
            "title": "超越生成 | BEYOND GENERATION",
            "artist": "Original procedural animation and sound design",
            "encoder": "Lavf61.7.103",
            "comment": "15 visual worlds; original 128 BPM score; 1920x1080, 30 fps. Research and provenance in the project."
        }
    }
}
```

### 7/19 · `AI_BEYOND_GENERATION/qa/final_loudness.log`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/qa/final_loudness.log", "lines": 158, "final_newline": true, "sha256": "1ae8aa51f5d08c7f13204970224ee1e8eba8d1db538f662e216618dfa41ea474", "original_sha256": "1ae8aa51f5d08c7f13204970224ee1e8eba8d1db538f662e216618dfa41ea474"} -->
```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '/mnt/data/AI_BEYOND_GENERATION_1080p.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    title           : 超越生成 | BEYOND GENERATION
    artist          : Original procedural animation and sound design
    encoder         : Lavf61.7.103
    comment         : 15 visual worlds; original 128 BPM score; 1920x1080, 30 fps. Research and provenance in the project.
  Duration: 00:02:00.00, start: 0.000000, bitrate: 3524 kb/s
  Chapters:
    Chapter #0:0: start 0.000000, end 3.750000
      Metadata:
        title           : OPEN / BEYOND GENERATION
    Chapter #0:1: start 3.750000, end 11.250000
      Metadata:
        title           : 01 / 纯线条手绘
    Chapter #0:2: start 11.250000, end 18.750000
      Metadata:
        title           : 02 / 3D MC 方块世界
    Chapter #0:3: start 18.750000, end 26.250000
      Metadata:
        title           : 03 / 粘土定格
    Chapter #0:4: start 26.250000, end 33.750000
      Metadata:
        title           : 04 / Vox 式解释拼贴
    Chapter #0:5: start 33.750000, end 41.250000
      Metadata:
        title           : 05 / SVG 几何矢量
    Chapter #0:6: start 41.250000, end 48.750000
      Metadata:
        title           : 06 / 8-BIT 像素街机
    Chapter #0:7: start 48.750000, end 56.250000
      Metadata:
        title           : 07 / 半调漫画
    Chapter #0:8: start 56.250000, end 63.750000
      Metadata:
        title           : 08 / 蓝晒工程制图
    Chapter #0:9: start 63.750000, end 71.250000
      Metadata:
        title           : 09 / 瑞士动态字体
    Chapter #0:10: start 71.250000, end 78.750000
      Metadata:
        title           : 10 / 立体剪纸剧场
    Chapter #0:11: start 78.750000, end 86.250000
      Metadata:
        title           : 11 / 东方水墨
    Chapter #0:12: start 86.250000, end 93.750000
      Metadata:
        title           : 12 / 霓虹赛博线框
    Chapter #0:13: start 93.750000, end 101.250000
      Metadata:
        title           : 13 / 液态铬金属
    Chapter #0:14: start 101.250000, end 108.750000
      Metadata:
        title           : 14 / 粒子数据宇宙
    Chapter #0:15: start 108.750000, end 116.250000
      Metadata:
        title           : 15 / 棱镜玻璃光学
    Chapter #0:16: start 116.250000, end 120.000000
      Metadata:
        title           : END / BUILD WITH INTENT
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709/unknown/unknown, progressive), 1920x1080, 3237 kb/s, 30 fps, 30 tbr, 15360 tbn (default)
      Metadata:
        handler_name    : VideoHandler
        vendor_id       : [0][0][0][0]
        encoder         : Lavc61.19.101 libx264
  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 277 kb/s (default)
      Metadata:
        handler_name    : SoundHandler
        vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](eng): Data: bin_data (text / 0x74786574), 0 kb/s
      Metadata:
        handler_name    : SubtitleHandler
Stream mapping:
  Stream #0:1 -> #0:0 (aac (native) -> pcm_s16le (native))
Press [q] to stop, [?] for help
Output #0, null, to 'pipe:':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    title           : 超越生成 | BEYOND GENERATION
    artist          : Original procedural animation and sound design
    comment         : 15 visual worlds; original 128 BPM score; 1920x1080, 30 fps. Research and provenance in the project.
    encoder         : Lavf61.7.103
  Chapters:
    Chapter #0:0: start 0.000000, end 3.750000
      Metadata:
        title           : OPEN / BEYOND GENERATION
    Chapter #0:1: start 3.750000, end 11.250000
      Metadata:
        title           : 01 / 纯线条手绘
    Chapter #0:2: start 11.250000, end 18.750000
      Metadata:
        title           : 02 / 3D MC 方块世界
    Chapter #0:3: start 18.750000, end 26.250000
      Metadata:
        title           : 03 / 粘土定格
    Chapter #0:4: start 26.250000, end 33.750000
      Metadata:
        title           : 04 / Vox 式解释拼贴
    Chapter #0:5: start 33.750000, end 41.250000
      Metadata:
        title           : 05 / SVG 几何矢量
    Chapter #0:6: start 41.250000, end 48.750000
      Metadata:
        title           : 06 / 8-BIT 像素街机
    Chapter #0:7: start 48.750000, end 56.250000
      Metadata:
        title           : 07 / 半调漫画
    Chapter #0:8: start 56.250000, end 63.750000
      Metadata:
        title           : 08 / 蓝晒工程制图
    Chapter #0:9: start 63.750000, end 71.250000
      Metadata:
        title           : 09 / 瑞士动态字体
    Chapter #0:10: start 71.250000, end 78.750000
      Metadata:
        title           : 10 / 立体剪纸剧场
    Chapter #0:11: start 78.750000, end 86.250000
      Metadata:
        title           : 11 / 东方水墨
    Chapter #0:12: start 86.250000, end 93.750000
      Metadata:
        title           : 12 / 霓虹赛博线框
    Chapter #0:13: start 93.750000, end 101.250000
      Metadata:
        title           : 13 / 液态铬金属
    Chapter #0:14: start 101.250000, end 108.750000
      Metadata:
        title           : 14 / 粒子数据宇宙
    Chapter #0:15: start 108.750000, end 116.250000
      Metadata:
        title           : 15 / 棱镜玻璃光学
    Chapter #0:16: start 116.250000, end 120.000000
      Metadata:
        title           : END / BUILD WITH INTENT
  Stream #0:0(und): Audio: pcm_s16le, 192000 Hz, stereo, s16, 6144 kb/s (default)
      Metadata:
        handler_name    : SoundHandler
        vendor_id       : [0][0][0][0]
        encoder         : Lavc61.19.101 pcm_s16le
size=N/A time=00:00:18.10 bitrate=N/A speed=36.2x    size=N/A time=00:00:37.20 bitrate=N/A speed=37.2x    size=N/A time=00:00:56.00 bitrate=N/A speed=37.3x    size=N/A time=00:01:14.40 bitrate=N/A speed=37.2x    size=N/A time=00:01:33.90 bitrate=N/A speed=37.5x    size=N/A time=00:01:53.80 bitrate=N/A speed=37.9x    [Parsed_loudnorm_0 @ 0x7fbf58002740] 
{
	"input_i" : "-16.70",
	"input_tp" : "-1.02",
	"input_lra" : "1.30",
	"input_thresh" : "-26.73",
	"output_i" : "-16.16",
	"output_tp" : "-1.00",
	"output_lra" : "1.30",
	"output_thresh" : "-26.17",
	"normalization_type" : "dynamic",
	"target_offset" : "0.16"
}
[out#0/null @ 0x563ba345a640] video:0KiB audio:90000KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: unknown
size=N/A time=00:02:00.00 bitrate=N/A speed=38.4x    
```

### 8/19 · `AI_BEYOND_GENERATION/requirements.txt`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/requirements.txt", "lines": 4, "final_newline": true, "sha256": "90b60132f4b6909a68cf9e77067248090bf56fc830359df368c2a29986c497cf", "original_sha256": "90b60132f4b6909a68cf9e77067248090bf56fc830359df368c2a29986c497cf"} -->
```text
numpy
scipy
Pillow
pycairo
```

### 9/19 · `AI_BEYOND_GENERATION/source/art.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/art.py", "lines": 425, "final_newline": true, "sha256": "429023e1d2c0cf46ad8fb37a50c5cf456cbbdc19004cc32c991501ad1a302905", "original_sha256": "429023e1d2c0cf46ad8fb37a50c5cf456cbbdc19004cc32c991501ad1a302905"} -->
```python
"""Fifteen art-directed worlds. Vector scenes use native Cairo; 3D is native OpenGL.
All animation is deterministic and driven by a shared 128-BPM timeline.
"""
import json,math,os
from pathlib import Path
from functools import lru_cache
import numpy as np
import cairo
from PIL import Image,ImageDraw,ImageFont
from threeworlds import ThreeWorlds
ROOT=Path(__file__).resolve().parent.parent
STORY=json.loads((ROOT/'source'/'story.json').read_text())
W,H=1920,1080; B=60/128; SCENE=16*B
_SILENT=False
FONTS={'black':'/usr/share/fonts/opentype/inter/InterDisplay-Black.otf','bold':'/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf','regular':'/usr/share/fonts/opentype/inter/InterDisplay-Regular.otf','light':'/usr/share/fonts/opentype/inter/InterDisplay-Light.otf','italic':'/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf','mono':'/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','cn':'/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc','cnreg':'/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','serif':'/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc','ink':'/usr/share/fonts/truetype/arphic-gkai00mp/gkai00mp.ttf'}
def clamp(x,a=0,b=1):return max(a,min(b,x))
def ease(x):x=clamp(x);return 1-(1-x)**3
def smooth(x):x=clamp(x);return x*x*(3-2*x)
def rgb(c):
 if isinstance(c,str):return tuple(int(c.lstrip('#')[j:j+2],16)/255 for j in (0,2,4))
 return tuple(c[:3])
def color(c,co,a=1):c.set_source_rgba(*rgb(co),a)
def rect(c,x,y,w,h,co,alpha=1,r=0):
 if w<=0 or h<=0:return
 color(c,co,alpha)
 if r<=0:c.rectangle(x,y,w,h)
 else:
  r=min(r,w/2,h/2);c.new_sub_path();c.arc(x+w-r,y+r,r,-math.pi/2,0);c.arc(x+w-r,y+h-r,r,0,math.pi/2);c.arc(x+r,y+h-r,r,math.pi/2,math.pi);c.arc(x+r,y+r,r,math.pi,1.5*math.pi);c.close_path()
 c.fill()
def circle(c,x,y,r,co=None,stroke=None,lw=2,alpha=1):
 c.new_path();c.arc(x,y,max(.01,r),0,math.tau)
 if co:color(c,co,alpha);c.fill_preserve()
 if stroke:color(c,stroke,alpha);c.set_line_width(lw);c.stroke()
 else:c.new_path()
def line(c,pts,co='#111111',lw=3,alpha=1,closed=False,dash=None):
 if not pts:return
 c.new_path();c.move_to(*pts[0])
 for p in pts[1:]:c.line_to(*p)
 if closed:c.close_path()
 c.set_line_width(lw);c.set_line_cap(cairo.LINE_CAP_ROUND);c.set_line_join(cairo.LINE_JOIN_ROUND);c.set_dash(dash or []);color(c,co,alpha);c.stroke();c.set_dash([])
def poly(c,pts,co,stroke=None,lw=2,alpha=1):
 c.new_path();c.move_to(*pts[0])
 for p in pts[1:]:c.line_to(*p)
 c.close_path();color(c,co,alpha);c.fill_preserve()
 if stroke:color(c,stroke,alpha);c.set_line_width(lw);c.stroke()
 else:c.new_path()
def arrow(c,a,b,co,lw=5,head=20,alpha=1):
 line(c,[a,b],co,lw,alpha);th=math.atan2(b[1]-a[1],b[0]-a[0]);p1=(b[0]-head*math.cos(th-.5),b[1]-head*math.sin(th-.5));p2=(b[0]-head*math.cos(th+.5),b[1]-head*math.sin(th+.5));line(c,[p1,b,p2],co,lw,alpha)
def shadow(c,x,y,w,h,alpha=.12):
 for k in range(10,0,-1):rect(c,x-k*2+10,y-k*2+16,w+k*4,h+k*4,'#15121E',alpha/17,18+k*2)

def surface_from_bgra(a):
 a=np.ascontiguousarray(a,dtype=np.uint8);s=cairo.ImageSurface.create_for_data(a,cairo.FORMAT_ARGB32,a.shape[1],a.shape[0],a.shape[1]*4);return s,a
@lru_cache(maxsize=1200)
def type_surface(s,size,co,font='black',outline=0):
 if any(ord(x)>255 for x in s) and font not in ['serif','ink','cnreg','cn','mono']:font='cn'
 f=ImageFont.truetype(FONTS[font],int(size));box=f.getbbox(s,stroke_width=outline);w=max(1,box[2]-box[0]+4);h=max(1,box[3]-box[1]+4)
 im=Image.new('RGBA',(w,h));d=ImageDraw.Draw(im);cc=tuple(int(x*255) for x in rgb(co))+(255,)
 if outline:d.text((2-box[0],2-box[1]),s,font=f,fill=(0,0,0,0),stroke_width=outline,stroke_fill=cc)
 else:d.text((2-box[0],2-box[1]),s,font=f,fill=cc)
 a=np.array(im);a[:,:,:3]=((a[:,:,:3].astype(np.uint16)*a[:,:,3:4])//255).astype(np.uint8);a=a[:,:,[2,1,0,3]].copy();surf,arr=surface_from_bgra(a);return surf,arr,w,h

def text(c,s,x,y,size=50,co='#111111',font='black',anchor='lt',alpha=1,angle=0,maxw=None,outline=0):
 if _SILENT and str(s) not in ['?','RAM','ARCHIVE','DELETE']:return (0,0)
 surf,arr,w,h=type_surface(str(s),int(size),co,font,outline);sc=min(1,maxw/w) if maxw else 1
 c.save();c.translate(x,y);c.rotate(angle);c.scale(sc,sc)
 if anchor.startswith('c'):c.translate(-w/2,0)
 elif anchor.startswith('r'):c.translate(-w,0)
 if anchor.endswith('m'):c.translate(0,-h/2)
 elif anchor.endswith('b'):c.translate(0,-h)
 c.set_source_surface(surf,0,0);c.paint_with_alpha(clamp(alpha));c.restore();return w*sc,h*sc

def placed_surface(c,surf,x,y,w,h,alpha=1):
 c.save();c.translate(x,y);c.scale(w/surf.get_width(),h/surf.get_height());c.set_source_surface(surf,0,0);c.paint_with_alpha(alpha);c.restore()

class Art:
 def __init__(self,w=1920,h=1080):
  self.w,self.h=w,h;self.three=None;self.thumb=[];self._texture={}
  for i in range(15):
   p=ROOT/'qa'/f'world_{i+1:02d}.png'
   if p.exists():self.thumb.append(cairo.ImageSurface.create_from_png(str(p)))
 def canvas(self,bg='#FFFFFF',arr=None,w=None,h=None):
  w=w or self.w;h=h or self.h
  if arr is None:
   surf=cairo.ImageSurface(cairo.FORMAT_ARGB32,w,h);a=None
  else:surf,a=surface_from_bgra(arr)
  c=cairo.Context(surf);c.scale(w/W,h/H)
  if arr is None:rect(c,0,0,W,H,bg)
  return surf,c,a
 def grain(self,c,alpha=.06):
  if 'grain' not in self._texture:
   rng=np.random.default_rng(32);n=rng.integers(0,255,(128,128),np.uint8);a=np.repeat(n[:,:,None],4,2);a[:,:,3]=255;s,arr=surface_from_bgra(a);self._texture['grain']=(s,arr)
  p=cairo.SurfacePattern(self._texture['grain'][0]);p.set_extend(cairo.EXTEND_REPEAT);c.set_source(p);c.paint_with_alpha(alpha)
 def tag(self,c,info,co='#111111',x=90,y=55):
  text(c,info['tag'],x,y,23,co,'mono');text(c,'BEYOND GENERATION',1830,y,20,co,'mono',anchor='rt')
 def caption(self,c,info,co='#111111',bg=None,t=1):
  alpha=smooth((t-.2)/.26)
  if bg:rect(c,70,920,1780,102,bg,.90,r=0)
  text(c,info['caption'],960,946,37,co,'cnreg',anchor='ct',alpha=alpha,maxw=1710)
 def subtitle_key(self,c,info,x,y,co='#111111',size=34):text(c,info['key'],x,y,size,co,'cnreg')
 def sketchline(self,c,pts,t,lw=3,alpha=1):
  for j in range(2):
   pp=[(x+1.3*math.sin(k*1.7+j*2+t*1.1),y+1.2*math.cos(k*1.3+j+t)) for k,(x,y) in enumerate(pts)];line(c,pp,'#1F2224',lw if j==0 else .8,alpha*(1 if j==0 else .45))
 def hand(self,c,t,info):
  self.grain(c,.055);self.tag(c,info,'#272724');beat=t/B;shot=min(3,int(beat/4));pulse=math.exp(-(beat%1)*9)
  text(c,'ASK',85,142,250,'#1F2224','black',outline=3)
  text(c,'BETTER.',95,404,128,'#1F2224','black',outline=2)
  text(c,info['title'],98,589,72,'#202522','cn',outline=1)
  self.subtitle_key(c,info,102,700,'#3C413E',31)
  cx,cy=1350,485;rr=238+3*pulse
  c.save();c.translate(cx,cy);c.rotate(.05*math.sin(t*.5))
  # Hand-drawn spherical lattice, not a flat icon.
  for j in range(-7,8):
   yy=j/8;rad=rr*math.sqrt(max(0,1-yy*yy));pts=[]
   for k in range(80):a=k/79*math.tau;pts.append((rad*math.cos(a),yy*rr+rad*.20*math.sin(a)))
   self.sketchline(c,pts,t,1.1,.55)
  for j in range(9):
   a=j*math.pi/9+t*.18;pts=[(rr*math.cos(k/99*math.tau)*math.cos(a),rr*math.sin(k/99*math.tau)) for k in range(100)];self.sketchline(c,pts,t,1.3,.6)
  c.restore()
  circle(c,cx,cy,rr+26,stroke='#242625',lw=2)
  text(c,'?',cx,cy-150,290,'#1B211E','bold',anchor='ct',outline=3)
  # Three clear task constraints drawn onto the page.
  labels=['GOAL','CONSTRAINT','DONE?'];coords=[(1090,802),(1345,802),(1625,802)]
  for j,(x,y) in enumerate(coords):
   box=[(x-98,y-37),(x+101,y-40),(x+100,y+36),(x-100,y+38),(x-98,y-37)]
   self.sketchline(c,box,t,2.2);text(c,labels[j],x,y-16,26,'#232823','mono',anchor='ct')
   self.sketchline(c,[(cx+(j-1)*140,740),(x,y-42)],t,1.8)
  self.sketchline(c,[(670,676),(795,676),(865,560),(1050,560)],t,3)
  arrow(c,(983,560),(1050,560),'#2C302B',3,20)
  for j in range(11):
   a=j*math.tau/11+t*.11;x=cx+(rr+50)*math.cos(a);y=cy+(rr+50)*math.sin(a);self.sketchline(c,[(x,y),(x+20*math.cos(a),y+20*math.sin(a))],t,2)
  self.caption(c,info,t=t)
 def editorial(self,c,t,info):
  rect(c,0,0,W,H,'#FFE449');self.grain(c,.045);self.tag(c,info)
  shot=min(3,int(t/(4*B)));u=(t%(4*B))/(4*B)
  text(c,'SOURCE',85,143,200,'#181A19','black');text(c,'CHECK.',88,361,197,'#181A19','black')
  rect(c,92,596,650,104,'#1A1C1A');text(c,info['title'],116,615,63,'#FFE64D','cn',maxw=595)
  text(c,'NO SOURCE. NO CERTAINTY.',100,749,29,'#282823','mono')
  # Newsroom paper: a cut silhouette, grid globe and marked evidence.
  c.save();c.translate(1320,508);c.rotate(-.064+.012*math.sin(t*.6));c.scale(1+.018*u,1+.018*u)
  shadow(c,-390,-342,766,716,.19)
  rng=np.random.default_rng(3);pts=[(-392,-345),(378,-345)]+[(378+rng.uniform(-7,7),-345+k*45) for k in range(17)]+[(-392,375)]+[(-392+rng.uniform(-5,5),375-k*45) for k in range(17)]
  poly(c,pts,'#F6F2E7')
  rect(c,-348,-294,684,41,'#22231F');text(c,'PRIMARY DOCUMENT / 001',-325,-286,24,'#FAF6E9','mono')
  # An original halftone globe, used as a visual metaphor rather than a factual map.
  gx,gy=0,-28;r=183
  circle(c,gx,gy,r,'#D2D1C5',stroke='#242723',lw=2)
  for j in range(-5,6):
   y=j*r/6;rx=math.sqrt(max(0,r*r-y*y));line(c,[(-rx,y+gy),(rx,y+gy)],'#393C34',1.2,.65)
  for j in range(-4,5):
   c.save();c.translate(gx,gy);c.scale(max(.08,abs(j)/4),1);circle(c,0,0,r,stroke='#484B43',lw=1);c.restore()
  # Geometric land-like patches are explicitly illustrative, not cartographic data.
  patches=[[(-115,-126),(-43,-141),(5,-99),(-20,-63),(-91,-58),(-134,-96)],[(-45,-28),(24,-18),(51,29),(14,76),(-1,141),(-39,104),(-68,22)],[(45,-91),(107,-122),(163,-43),(106,-9),(80,42),(25,1)]]
  for pp in patches:poly(c,[(x,y+gy) for x,y in pp],'#33382F')
  for y in range(-180,149,10):
   for x in range(-180,181,10):
    if x*x+y*y<r*r:circle(c,x,y+gy,1.1,'#EFEBDD',alpha=.28)
  for j in range(3):rect(c,-335,214+j*33,400-j*66,10,'#A9AA9B')
  rect(c,-336,206+shot%3*33,440,28,'#FFE145',.60)
  text(c,'TRACE THE CLAIM.',-335,319,31,'#242721','bold')
  c.restore()
  c.save();c.translate(1666,763);c.rotate(-.14);rect(c,-128,-43,256,86,'#272B24');text(c,'VERIFY',0,-24,44,'#F9F3DD','bold',anchor='ct');c.restore()
  arrow(c,(820,687),(979,621),'#1F241C',7,30)
  self.caption(c,info,t=t)
 def svg(self,c,t,info):
  rect(c,0,0,W,H,'#F4F1E9');self.tag(c,info,'#123EBC');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4;p=math.exp(-(beat%1)*9)
  rect(c,0,115,650,760,'#214DD5');text(c,'MAKE',68,169,147,'#F8F4E8');text(c,'IT',66,333,210,'#F8F4E8');text(c,'REAL.',68,551,143,'#FFD352')
  text(c,info['title'],720,147,67,'#193DAB','cn');text(c,'tool.execute(input)',725,250,34,'#244DCA','mono')
  # Strictly flat paths and fills: a rotating gear, a socket and an execution route.
  cx,cy=1090,539;r=172+2*p;pts=[]
  for j in range(96):
   a=j/96*math.tau+t*.32;rad=r if j%8 in [0,1,6,7] else r+31;pts.append((cx+rad*math.cos(a),cy+rad*math.sin(a)))
  poly(c,pts,'#F36537');circle(c,cx,cy,97,'#F4F1E9');circle(c,cx,cy,40,'#214DD5')
  # Thick Bezier route is drawn as SVG-style vector geometry.
  c.new_path();c.move_to(711,758);c.curve_to(861,758,818,544,916,540);color(c,'#244DCE');c.set_line_width(20);c.stroke()
  c.new_path();c.move_to(1289,541);c.curve_to(1457,541,1433,752,1580,752);color(c,'#244DCE');c.set_line_width(20);c.stroke()
  rect(c,1495,401,279,213,'#FFD352',r=40);rect(c,1553,447,163,114,'#F4F1E9',r=13)
  line(c,[(1581,497),(1617,534),(1690,465)],'#214DD5',18)
  for j in range(3):
   x=740+j*53+((beat%1)*40);circle(c,x,758,11,'#F36537')
  arrow(c,(1390,345),(1510,345),'#244DCE',13,36)
  text(c,'INPUT',703,818,25,'#224FCB','mono');text(c,'TOOL',1038,818,25,'#224FCB','mono');text(c,'VERIFIED OUTPUT',1510,818,25,'#224FCB','mono')
  self.caption(c,info,'#213B80',t=t)
 def pixel(self,c,t,info):
  rect(c,0,0,W,H,'#0C152C');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  # Drawn at quarter resolution by render(), then nearest-neighbour expanded.
  for j in range(60):
   x=(j*137+43)%W;y=(j*71+19)%780;rect(c,x,y,4 if j%4 else 8,4 if j%4 else 8,'#2E5E71')
  self.tag(c,info,'#89E8CA');text(c,'MEMORY',88,159,150,'#F8F0B5','mono');text(c,info['title'],94,328,65,'#82EDD0','cn');text(c,'SAVE ONLY WHAT MATTERS',94,429,29,'#AED9D4','mono')
  for x in range(-100,2020,80):
   xx=x-int(u*80)%80;rect(c,xx,828,76,42,'#477B86');rect(c,xx,832,76,8,'#8AD7B7');rect(c,xx,878,76,30,'#274451')
  for j,label in enumerate(['RAM','ARCHIVE','DELETE']):
   xx=830+j*305;rect(c,xx,302,262,310,'#254051');rect(c,xx+12,314,238,286,'#142338');rect(c,xx+23,332,216,48,'#75DCA5' if j==shot%3 else '#42798B');text(c,label,xx+131,343,29,'#0C152C','mono',anchor='ct')
   for k in range(3):
    yy=413+k*56;on=(k+j+shot)%4!=0;rect(c,xx+46,yy,166,30,'#F4C568' if on else '#233C4C')
    for q in range(7):rect(c,xx+52+q*23,yy-8,9,8,'#D5ECAF');rect(c,xx+52+q*23,yy+30,9,8,'#D5ECAF')
  # A hand-designed, coherent sprite with a two-pose gait.
  sprite=['...XXXXXX...','..XXXXXXXX..','..XOOXXOOX..','..XOOXXOOX..','..XXXXXXXX..','...XWWWWX...','....XXXX....','..YYYYYYYY..','.YYYYYYYYYY.','YY.YYYYYY.YY','YY.YYYYYY.YY','...YYYYYY...','...ZZ..ZZ...','...ZZ..ZZ...','..ZZZ..ZZZ..']
  pal={'X':'#EAA75A','O':'#172534','W':'#FCF1C5','Y':'#77D9B0','Z':'#527CC2'};sx=338+shot*74+u*65;sy=575-int(abs(math.sin(beat*math.pi))*10)
  for yy,row in enumerate(sprite):
   for xx,ch in enumerate(row):
    if ch!='.':rect(c,sx+xx*15+(4 if yy>12 and int(beat*2)%2 else 0),sy+yy*15,15,15,pal[ch])
  for j in range(4):rect(c,690+j*65,689+math.sin(beat+j)*13,26,26,'#F6D06A')
  self.caption(c,info,'#CFEADE',t=t)
 def comic(self,c,t,info):
  rect(c,0,0,W,H,'#F0C638');self.tag(c,info);beat=t/B;shot=min(3,int(beat/4));p=math.exp(-(beat%1)*8)
  # All halftone dots are clipped to their own panels.
  panels=[[(55,137),(643,115),(633,888),(63,892)],[(672,117),(1267,143),(1210,889),(650,888)],[(1293,142),(1863,113),(1860,889),(1238,889)]]
  cols=['#4CABC3','#F3EBDD','#DA5552']
  for k,pts in enumerate(panels):
   poly(c,pts,cols[k],stroke='#17222A',lw=10);c.save();c.new_path();c.move_to(*pts[0]);[c.line_to(*p0) for p0 in pts[1:]];c.close_path();c.clip()
   for y in range(145,900,23):
    for x in range(55+k*598,653+k*598,23):circle(c,x,y,2.4,'#152534',alpha=.19)
   c.restore()
  # Three propositions, not three variants of a generic card layout.
  for j,(cx,cy) in enumerate([(342,656),(958,687),(1554,692)]):
   circle(c,cx,cy,125,'#F6D797',stroke='#17222A',lw=10)
   rect(c,cx-99,cy-70,198,89,'#F8EED9',r=25)
   for s in [-1,1]:circle(c,cx+s*41,cy-24,13,'#182634')
   if j==0:line(c,[(cx-43,cy+49),(cx,cy+72),(cx+43,cy+46)],'#1B2630',8)
   elif j==1:circle(c,cx,cy+62,24,stroke='#1B2630',lw=7)
   else:line(c,[(cx-37,cy+66),(cx+37,cy+66)],'#1B2630',8)
  words=[('SURE?',342,234),('PROOF?',961,231),('CHECK!',1568,218)]
  for j,(word,x,y) in enumerate(words):
   c.save();c.translate(x,y);c.rotate((-.075,.06,-.04)[j]);poly(c,[(-220,-48),(198,-67),(228,74),(28,93),(-49,138),(-56,88),(-215,81)],'#FCF5DC',stroke='#16212D',lw=8);text(c,word,0,-29,78,'#182531','italic',anchor='ct');c.restore()
  # A bold correction stamp arrives on the third beat and holds for reading.
  stamp=ease((t-.5)/.25);c.save();c.translate(970,481);c.rotate(-.07);c.scale(1+.035*p,1+.035*p);rect(c,-552,-60,1104,130,'#F5CA3C');line(c,[(-552,-60),(552,-60),(552,70),(-552,70)],'#172331',9,closed=True);text(c,info['title'],0,-37,87,'#172331','cn',anchor='ct',alpha=stamp);c.restore()
  self.caption(c,info,'#101B27','#F5EFDA',t)
 def blueprint(self,c,t,info):
  rect(c,0,0,W,H,'#06324B');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  for x in range(0,W,24):line(c,[(x,0),(x,H)],'#66C5CE',1,.09 if x%120 else .21)
  for y in range(0,H,24):line(c,[(0,y),(W,y)],'#66C5CE',1,.09 if y%120 else .21)
  self.tag(c,info,'#A8F4DF');text(c,'TEST.',94,155,157,'#B7F4E1','bold');text(c,"DON'T",95,336,123,'#B7F4E1','light');text(c,'GUESS.',94,486,129,'#B7F4E1','bold');text(c,info['title'],99,674,65,'#A8F4DF','cn')
  cx,cy=1339,555;ang=.30+t*.065
  def proj(v):
   x,y,z=v;xx=x*math.cos(ang)-z*math.sin(ang);zz=x*math.sin(ang)+z*math.cos(ang);return (cx+xx*150,cy-y*145+zz*67)
  def wirebox(y,sx,sy,sz,bright=False):
   vs=[(x*sx,y+yy*sy,z*sz) for x in [-1,1] for yy in [-1,1] for z in [-1,1]];pp=[proj(v) for v in vs]
   for j in range(8):
    for k in range(j+1,8):
     if sum(vs[j][d]!=vs[k][d] for d in range(3))==1:line(c,[pp[j],pp[k]],'#C7FFEB' if bright else '#52B7BD',3 if bright else 1.8,.95)
   return pp
  gap=.15+.45*smooth(u)
  for j in range(4):wirebox((j-1.5)*(.9+gap),1.6,.19,1.08,j==shot)
  # Processor pins and exploded assembly guides.
  for s in [-1,1]:
   for j in range(7):line(c,[proj((s*1.6,-1.8,-.9+j*.3)),proj((s*2,-1.8,-.9+j*.3))],'#87DDD4',2)
  for x,z in [(-1.6,-1.08),(1.6,1.08),(-1.6,1.08),(1.6,-1.08)]:line(c,[proj((x,-2.8,z)),proj((x,2.8,z))],'#74D4D1',1.4,.55,dash=[9,8])
  for j,label in enumerate(['INPUT','RULES','TEST','OUTPUT']):
   yy=229+j*159;line(c,[(1650,yy),(1720,yy),(1750,yy-25)],'#82DCD2',2);text(c,label,1761,yy-39,25,'#BFFAEA','mono',maxw=135)
  line(c,[(951,822),(1662,822)],'#A3E9DD',2);line(c,[(950,805),(950,839)],'#A3E9DD',2);line(c,[(1662,805),(1662,839)],'#A3E9DD',2);text(c,'VERIFY THE FINAL STATE',1310,842,23,'#A4DBD6','mono',anchor='ct')
  code='assert output.valid\nassert constraints_met'
  for j,s in enumerate(code.split('\n')):text(c,s[:int(50*clamp(t-.5))],100,787+j*42,27,'#6DD7CA','mono')
  self.caption(c,info,'#BCECDD',t=t)
 def swiss(self,c,t,info):
  rect(c,0,0,W,H,'#EFEDE5');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4;p=math.exp(-(beat%1)*10)
  self.tag(c,info,'#181B1C');rect(c,1298,108,540,779,'#E94735')
  # The permissions themselves are the animated objects.
  words=['READ','WRITE','DELETE'];ys=[136,371,607]
  for j,(word,y) in enumerate(zip(words,ys)):
   active=(shot%3)==j;co='#171C20' if active else '#BDBEB5';off=(1-ease((t-j*.08)/.4))*-150
   text(c,word,82+off,y,228,'#E44532' if active and j>0 else co,'black',maxw=1160)
   if not active and j>0:rect(c,95,y+110,1080,12,'#171C20',.65)
  # A large mechanical lock, without ornamental HUD clutter.
  c.save();c.translate(1567,442);c.scale(1+.018*p,1+.018*p)
  c.new_path();c.arc(0,-18,114,math.pi,math.tau);c.line_to(114,70);c.move_to(-114,-18);c.line_to(-114,70);color(c,'#F3F0E7');c.set_line_width(33);c.stroke()
  rect(c,-148,47,296,238,'#F4F0E6',r=8);circle(c,0,137,28,'#E44834');rect(c,-12,140,24,75,'#E44834');c.restore()
  text(c,info['title'],1560,172,67,'#F9F4E8','cn',anchor='ct');text(c,'ONLY WHAT',1565,759,35,'#F7F2E6','bold',anchor='ct');text(c,'IS NEEDED.',1565,806,35,'#F7F2E6','bold',anchor='ct')
  self.caption(c,info,'#1E2528',t=t)
 def paper(self,c,t,info):
  rect(c,0,0,W,H,'#EBDFCC');self.grain(c,.034);self.tag(c,info,'#5B5248');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  # Layered cut-paper valleys with real separate shadows.
  for j,(yy,co) in enumerate([(738,'#D3C4AA'),(826,'#B4C7B5'),(898,'#819C97')]):
   pts=[(-10,H),(W+10,H),(W+10,yy)]+[(W-k*90,yy-70*math.sin(k*.34+j+t*.015)-j*9) for k in range(23)]+[(-10,yy)]
   poly(c,[(x+8,y+13) for x,y in pts],'#6D6252',alpha=.10);poly(c,pts,co)
  text(c,'HUMAN',93,151,127,'#324C4A','black');text(c,'IN THE LOOP.',96,299,90,'#324C4A','bold');text(c,info['title'],98,461,71,'#324C4A','cn',maxw=930)
  text(c,info['key'],101,565,36,'#5E7167','cnreg')
  # The approval slips have individual folded corners and cast shadows.
  labels=['PAUSE','REVIEW','UNDO'];centers=[(1180,300),(1530,454),(1140,639)]
  for j,(x,y) in enumerate(centers):
   active=shot%3==j;dy=-14*math.sin(t*.8+j);c.save();c.translate(x,y+dy);c.rotate([-.07,.075,-.035][j]);shadow(c,-168,-82,338,165,.17);poly(c,[(-168,-82),(121,-82),(169,-34),(169,83),(-168,83)],'#FCF6E6');poly(c,[(121,-82),(121,-33),(169,-34)],'#DED0B8');text(c,labels[j],0,-30,44,'#D3673D' if active else '#52635C','bold',anchor='ct');c.restore()
  # A cut-paper human, with a clear arm-to-control gesture.
  x,y=1530,700;shadow(c,x-62,y-38,175,206,.1);poly(c,[(x-47,y-49),(x+82,y-38),(x+103,y+194),(x-93,y+194)],'#CB683F');circle(c,x+12,y-115,65,'#DCA87E');poly(c,[(x-50,y-128),(x-36,y-178),(x+40,y-189),(x+80,y-132),(x+16,y-149)],'#344A46')
  # Upper arm and forearm meet at a visible joint instead of passing through the torso.
  handx=x-169-20*math.sin(t*.8);handy=y-56-10*math.cos(t)
  line(c,[(x-44,y-10),(x-105,y+19),(handx,handy)],'#BF5E3A',48);circle(c,handx,handy,25,'#DCA87E')
  line(c,[(x-20,y+192),(x-28,y+233)],'#344E4D',36);line(c,[(x+54,y+191),(x+77,y+231)],'#344E4D',36)
  # Origami decision arrow, moving on a shallow foreground plane.
  px=785+30*math.sin(t);py=768+20*math.sin(t*.7);poly(c,[(px-130,py),(px+138,py-58),(px+26,py+75),(px-5,py+8)],'#F8F0DB');poly(c,[(px-5,py+8),(px+138,py-58),(px+26,py+75)],'#D9C9A8');poly(c,[(px-130,py),(px-5,py+8),(px+138,py-58)],'#FFFAEB')
  self.caption(c,info,'#FAF3E3','#405D58',t)
 def ink(self,c,t,info):
  rect(c,0,0,W,H,'#F1EFE5');self.grain(c,.065);self.tag(c,info,'#4D514D');beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  # Transparent ink washes and a pressure-modulated open enso.
  for j in range(5):
   base=755+j*32;pts=[(0,1080),(1920,1080),(1920,base)]
   for k in range(40,-1,-1):
    x=k*48;y=base-100*(math.sin(k*.18+j*.5)**4)-53*math.sin(k*.37+j);pts.append((x,y))
   pts.append((0,1080));poly(c,pts,'#5B6761',alpha=.045+j*.018)
  cx,cy=756,481;r=235
  for layer in range(6):
   pts=[]
   for k in range(190):
    a=.18+k/189*(math.tau-.55);rad=r+layer*2+3*math.sin(a*17+layer*.7)+math.sin(a*33)*2;pts.append((cx+rad*math.cos(a),cy+rad*.99*math.sin(a)))
   for k in range(len(pts)-1):
    f=k/(len(pts)-1);width=(20+26*math.sin(math.pi*f)**.8)*(1 if layer<2 else .18);line(c,[pts[k],pts[k+1]],'#273530',width,.17 if layer<2 else .06)
  # Sweeping brush filament in the open ring, with enough negative space to read.
  for j in range(30):
   a=j*2.399;rad=18+j*6.9;xx=cx+rad*math.cos(a);yy=cy+rad*math.sin(a);circle(c,xx,yy,1+j%3,'#2B3530',alpha=.16)
  # Vertical calligraphy is deliberately separated into two columns.
  words=info['title'].replace('\uff0c','|').split('|');cols=[1490,1325]
  for col,s in enumerate(words[:2]):
   for k,ch in enumerate(s):text(c,ch,cols[col],230+k*157,132,'#273C35','ink',anchor='ct')
  text(c,info['key'],753,433,67,'#283B33','ink',anchor='ct',maxw=390)
  rect(c,1607,695,79,139,'#A84935',.91);text(c,'?',1646,725,81,'#F4E9D6','serif',anchor='ct')
  text(c,'MAKE ROOM FOR UNCERTAINTY.',141,820,29,'#52615A','mono')
  self.caption(c,info,'#354B42',t=t)
 def overlays3d(self,c,t,info,i):
  shot=min(3,int(t/(4*B)));u=(t%(4*B))/(4*B);alpha=smooth((t-.15)/.25)
  if i==1:
   self.tag(c,info,'#143F45');rect(c,79,136,649,97,'#0F3B48',.90);text(c,info['title'],101,153,66,'#F7EAC3','cn',alpha=alpha);text(c,'PLAN > BUILD > CHECK',89,266,28,'#16444B','mono');self.caption(c,info,'#F9F0D4','#153B46',t)
   for j,s in enumerate(['PLAN','BUILD','CHECK']):rect(c,104+j*188,809,166,47,'#193C42',.93);text(c,s,187+j*188,819,25,'#F8D582','mono',anchor='ct')
  elif i==2:
   self.tag(c,info,'#47394E');text(c,'CONTEXT',90,162,128,'#403447','bold',alpha=alpha,maxw=770);text(c,'MATTERS.',90,309,127,'#403447','bold',alpha=alpha,maxw=770);text(c,info['title'],96,495,72,'#493C4A','cn',alpha=alpha);text(c,info['key'],102,609,33,'#655263','cnreg');self.caption(c,info,'#4F3B4B','#EBDAE4',t)
  elif i==11:
   self.tag(c,info,'#70EADA');text(c,'ACT.',89,163,116,'#BCFFEA','black');text(c,'CHECK.',89,291,105,'#BCFFEA','black');text(c,'ADAPT.',90,412,108,'#BCFFEA','black');text(c,info['title'],93,641,64,'#BFF4E4','cn');self.caption(c,info,'#BFEFDB','#061C2A',t)
   for j,s in enumerate(['PLAN','ACT','CHECK']):text(c,s,1151+j*226,828,26,'#79F4DD','mono',anchor='ct')
  elif i==12:
   self.tag(c,info,'#93A6B4');text(c,'MORE',91,158,171,'#ECF2F3','black',alpha=alpha);text(c,'IS NOT',94,344,118,'#A9BCC6','light',alpha=alpha);text(c,'BETTER.',92,482,136,'#EFF5F6','black',alpha=alpha);text(c,info['title'],97,694,61,'#B5C6CD','cn');self.caption(c,info,'#BCCCD0',t=t)
   for j,s in enumerate(['QUALITY','LATENCY','COST']):line(c,[(1270,792+j*31),(1390,792+j*31)],'#4B717A',2);text(c,s,1410,778+j*31,19,'#738F9D','mono')
  elif i==13:
   self.tag(c,info,'#9DC7D8');text(c,'SYSTEMS',960,154,143,'#A3DCED','light',anchor='ct',outline=1);text(c,info['title'],960,326,64,'#D3F6F3','cn',anchor='ct');self.caption(c,info,'#C6E5E4',t=t)
   for j,s in enumerate(['TASK','TRACE','OUTCOME']):text(c,s,642+j*314,826,27,'#91C6D5','mono',anchor='ct')
  elif i==14:
   self.tag(c,info,'#28404F');text(c,'YOUR',92,165,146,'#243B4B','bold');text(c,'MOVE.',91,330,162,'#243B4B','bold');text(c,info['title'],99,571,70,'#2B4452','cn',maxw=846);text(c,'TOOLS EXPAND POSSIBILITY.',103,704,29,'#435E6B','mono');self.caption(c,info,'#294553','#E3ECEC',t)
 def intro(self,t,outro=False):
  surf,c,a=self.canvas('#090E14');beat=t/B
  # Full-bleed thumbnail wall introduces/recalls the actual fifteen rendered styles.
  if self.thumb:
   for j,s in enumerate(self.thumb):
    x=(j%5)*384;y=(j//5)*360;z=1+.025*math.sin(t*.8+j);placed_surface(c,s,x-(z-1)*192,y-(z-1)*180,384*z,360*z,.45 if not outro else .30)
   rect(c,0,0,W,H,'#050B11',.62 if not outro else .72)
  else:
   for j in range(22):
    cx=960+math.sin(j*.7+t*.15)*240;cy=540;rr=180+j*38;circle(c,cx,cy,rr,stroke='#173745',lw=1.2,alpha=.5)
  rect(c,79,57,12,23,'#FE6A40');text(c,'FIFTEEN WORLDS / ONE PRINCIPLE',109,55,23,'#C5D6D8','mono')
  text(c,'128 BPM',1830,55,23,'#EFD3B4','mono',anchor='rt')
  if not outro:
   if beat<2:
    text(c,'AI',960,185,512,'#F4F0E5','black',anchor='ct');text(c,'BEYOND THE PROMPT',960,758,38,'#FA7449','mono',anchor='ct')
   else:
    kick=1+.04*math.exp(-((beat-2)%1)*10);c.save();c.translate(960,458);c.scale(kick,kick);text(c,'BEYOND',0,-241,216,'#F8F2E7','black',anchor='ct');text(c,'GENERATION',0,-1,188,'#F7F0E5','black',anchor='ct',maxw=1720);c.restore()
    text(c,STORY['title'],960,724,96,'#FF744C','cn',anchor='ct');text(c,STORY['subtitle'],960,893,37,'#CBDCDB','cnreg',anchor='ct')
   for j in range(15):rect(c,487+j*64,1021,49,6,'#F5754B' if j<int(t/3.75*15) else '#33444B')
  else:
   text(c,STORY['ending'],960,284,118,'#F7F0E4','cn',anchor='ct',maxw=1740)
   text(c,'BUILD WITH INTENT.',960,478,104,'#F27951','black',anchor='ct')
   text(c,'15 WORLDS  /  128 BPM  /  ORIGINAL CODE ANIMATION',960,689,27,'#B5CACB','mono',anchor='ct')
   text(c,'SCORE & SOUND DESIGN: ORIGINAL SYNTHESIS',960,777,24,'#829BA4','mono',anchor='ct')
   text(c,'RESEARCH: ANTHROPIC + OPENAI / SOURCES IN PROJECT',960,822,23,'#829BA4','mono',anchor='ct')
   text(c,'BEYOND GENERATION',960,1009,20,'#66818C','mono',anchor='ct')
  surf.flush();return np.frombuffer(surf.get_data(),np.uint8).reshape(self.h,self.w,4).copy()

 def directed_cut(self,arr,i,t):
  beat=t/B;shot=min(3,int(beat/4));u=(beat%4)/4
  if beat>=14:shot=1+int(beat*2)%2
  if shot not in [1,2]:return arr
  settings={0:('#F3F1E9','#243029',1340,490,1.65,2.06),3:('#FFE449','#171C18',1320,475,1.62,1.96),4:('#F4F1E9','#2245C3',1250,535,1.57,2.03),5:('#0C152C','#B8EDD7',1290,467,1.50,1.87),6:('#F0C638','#17222A',965,523,1.19,1.76),7:('#06324B','#B2EBDB',1338,475,1.59,1.94),8:('#EFEDE5','#171C20',1510,472,1.63,2.04),9:('#EBDFCC','#3D574F',1340,470,1.49,1.84),10:('#F1EFE5','#33463D',775,470,1.24,1.48)}
  if i not in settings:return arr
  bg,fg,cx,cy,z1,z2=settings[i];z=(z1 if shot==1 else z2)+u*.045+.015*math.exp(-(beat%1)*10)
  cx=clamp(cx,W/(2*z),W-W/(2*z));cy=clamp(cy,H/(2*z),H-H/(2*z))
  surf,c,a=self.canvas(bg);src,aa=surface_from_bgra(arr)
  c.save();c.translate(W/2-z*cx,H/2-z*cy);c.scale(z*W/self.w,z*H/self.h);c.set_source_surface(src,0,0);c.get_source().set_filter(cairo.FILTER_BILINEAR);c.paint();c.restore()
  # Dedicated header/footer zones preserve the reading area through punch-ins.
  rect(c,0,0,W,111,bg);rect(c,0,789,W,291,bg)
  self.tag(c,STORY['scenes'][i],fg)
  text(c,STORY['scenes'][i]['title'],88,817,65,fg,'cn')
  text(c,STORY['scenes'][i]['key'],1830,837,31,fg,'cnreg',anchor='rt',maxw=850)
  line(c,[(90,909),(1830,909)],fg,1,.25)
  self.caption(c,STORY['scenes'][i],fg,t=t)
  surf.flush();return np.frombuffer(surf.get_data(),np.uint8).reshape(self.h,self.w,4).copy()
 def render(self,i,t):
  global _SILENT
  beat=t/B;shot=min(3,int(beat/4));shot=(1+int(beat*2)%2) if beat>=14 else shot
  _SILENT=i in [0,3,4,5,6,7,8,9,10] and shot in [1,2]
  info=STORY['scenes'][i]; t=max(0,min(SCENE-.001,t))
  if i in [1,2,11,12,13,14]:
   if self.three is None:self.three=ThreeWorlds(self.w,self.h)
   arr=self.three.render(i,t);surf,c,a=self.canvas(arr=arr);self.overlays3d(c,t,info,i)
  elif i==5:
   surf,c,a=self.canvas(w=self.w//4,h=self.h//4);self.pixel(c,t,info);surf.flush();small=np.frombuffer(surf.get_data(),np.uint8).reshape(self.h//4,self.w//4,4).copy();_SILENT=False;return self.directed_cut(np.repeat(np.repeat(small,4,0),4,1),i,t)
  else:
   surf,c,a=self.canvas('#F3F1E9' if i==0 else '#FFFFFF');{0:self.hand,3:self.editorial,4:self.svg,6:self.comic,7:self.blueprint,8:self.swiss,9:self.paper,10:self.ink}[i](c,t,info)
  surf.flush();out=np.frombuffer(surf.get_data(),np.uint8).reshape(self.h,self.w,4).copy();_SILENT=False;return self.directed_cut(out,i,t)

# Hard shape masks replace crossfades: foreground text never ghosts over another world.
def transition(previous,current,p,style):
 h,w=current.shape[:2];s,a=surface_from_bgra(previous.copy());c=cairo.Context(s);c.scale(w/W,h/H);p=clamp(p);mode=style%8
 c.new_path()
 if mode==0:
  r=p*1260;c.arc(960,540,r,0,math.tau)
 elif mode==1:
  x=-900+p*3600;c.move_to(-1,-1);c.line_to(x,-1);c.line_to(x-700,H+1);c.line_to(-1,H+1);c.close_path()
 elif mode==2:
  for j in range(10):
   q=clamp(p*1.3-j*.033);c.rectangle(j*192,0,192,H*q)
 elif mode==3:
  x=p*(W+100)-50;c.move_to(-1,-1);c.line_to(x,-1)
  for j in range(1,29):c.line_to(x+11*math.sin(j*4.8),j*40)
  c.line_to(-1,H+1);c.close_path()
 elif mode==4:
  for y in range(12):
   for x in range(20):
    threshold=((x*37+y*61)%97)/97
    if p>=threshold:c.rectangle(x*96,y*90,97,91)
 elif mode==5:
  for j in range(12):
   yy=j*90;ww=clamp(p*1.4-(j%3)*.15)*W;c.rectangle(0 if j%2==0 else W-ww,yy,ww,91)
 elif mode==6:
  c.move_to(960,540)
  for j in range(100):
   a=j/99*math.tau;r=(1+.06*math.sin(a*11)+.045*math.cos(a*7))*p*1250;c.line_to(960+math.cos(a)*r,540+math.sin(a)*r)
  c.close_path()
 else:
  q=ease(p);c.rectangle(W*(1-q)/2,H*(1-q)/2,W*q,H*q)
 c.clip();cur,aa=surface_from_bgra(current);c.save();c.scale(W/w,H/h);c.set_source_surface(cur,0,0);c.paint();c.restore();s.flush();return np.frombuffer(s.get_data(),np.uint8).reshape(h,w,4).copy()
```

### 10/19 · `AI_BEYOND_GENERATION/source/audio.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/audio.py", "lines": 102, "final_newline": true, "sha256": "f9180af5ae969bea2e4b9d6ef1e1c0ba07114c95d83e6a18d2599d1c91bfbf47", "original_sha256": "f9180af5ae969bea2e4b9d6ef1e1c0ba07114c95d83e6a18d2599d1c91bfbf47"} -->
```python
"""Original 128 BPM electronic score and sample-accurate transition sound design.
No samples from the researched Kevin MacLeod recording are used.
"""
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io.wavfile import write
from pathlib import Path
SR=48000; BPM=128; BEAT=60/BPM; DURATION=120
rng=np.random.default_rng(713)
mix=np.zeros((int(SR*DURATION),2),np.float32)
def add(x,t,gain=1,pan=0):
    start=int(t*SR); off=max(0,-start); start=max(0,start); n=min(len(x)-off,len(mix)-start)
    if n<=0:return
    x=np.asarray(x[off:off+n],np.float32)*gain
    if x.ndim==1:
        mix[start:start+n,0]+=x*np.sqrt((1-pan)*.5)
        mix[start:start+n,1]+=x*np.sqrt((1+pan)*.5)
    else: mix[start:start+n]+=x

def tt(d):return np.arange(int(SR*d),dtype=np.float32)/SR
def filt(x,hz,typ='lowpass',order=2):return sosfilt(butter(order,hz,btype=typ,fs=SR,output='sos'),x).astype(np.float32)
def notehz(m):return 440*2**((m-69)/12)
def kick():
 t=tt(.42); freq=48+125*np.exp(-t*44); ph=2*np.pi*np.cumsum(freq)/SR
 return .87*np.sin(ph)*np.exp(-t*10)+.22*rng.normal(0,1,len(t))*np.exp(-t*300)
def snare():
 t=tt(.25); n=filt(rng.normal(0,1,len(t)).astype(np.float32),1400,'highpass')
 return .40*n*np.exp(-t*20)+.35*np.sin(2*np.pi*185*t)*np.exp(-t*28)
def hat(opened=False):
 t=tt(.18 if opened else .045); n=rng.normal(0,1,len(t)).astype(np.float32)
 return filt(n,7000,'highpass')*np.exp(-t*(22 if opened else 85))*.21
K=kick(); S=snare(); HC=hat(); HO=hat(True)
chords=[(40,47,52,55),(36,43,48,52),(43,50,55,59),(38,45,50,54)]
# Pads: wide detuned partials, low-pass movement, and sidechain breathing.
for bar in range(64):
 ci=(bar//2)%4; chord=chords[ci]; start=bar*4*BEAT
 t=tt(4*BEAT+.35); env=np.minimum(t/.07,1)*np.minimum((len(t)/SR-t)/.35,1)
 localbeat=(t/BEAT)%1; sc=.24+.76*(1-np.exp(-localbeat*7))
 pad=np.zeros((len(t),2),np.float32)
 for j,m in enumerate(chord[1:]):
  hz=notehz(m+12)
  for side,det in enumerate([.997,1.003]):
   v=np.zeros(len(t),np.float32)
   for h in range(1,7):v+=np.sin(2*np.pi*hz*det*h*t+j*.37)/(h**1.7)
   pad[:,side]+=v
 gain=.034 if 42<=bar<46 else .024
 add(pad*env[:,None]*sc[:,None],start,gain)
# Bass, drums, metallic hats and micro-fills.
for b in range(256):
 t0=b*BEAT; bar=b//4; ci=(bar//2)%4; root=chords[ci][0]-12
 scene=int(max(0,(b-8)//16)); breakdown=168<=b<184
 intensity=.60 if b<8 else (.90 if b<72 else 1.0)
 if not breakdown or b%4==0: add(K,t0,.66*intensity)
 if b%2==1 and not breakdown: add(S,t0,.46*intensity)
 if not breakdown:
  for q in range(4):add(HC,t0+q*BEAT/4,.36 if q%2==0 else .23,(-1 if q%2 else 1)*.35)
  add(HO,t0+BEAT/2,.25,.35)
  pattern=[0,0,7,0,0,12,7,0]
  for q in range(2):
   m=root+pattern[(b*2+q)%8]; t=tt(BEAT*.44); hz=notehz(m)
   env=(1-np.exp(-t*160))*np.exp(-t*10)
   v=np.sin(2*np.pi*hz*t)+.28*np.sin(2*np.pi*hz*2*t)+.15*np.sin(2*np.pi*hz*3*t)
   add(v*env,t0+q*BEAT/2+.028,.28)
 # Arpeggio: evolving registration, offbeat answer phrases.
 if b>=8:
  arp=[0,7,12,15,19,15,12,7]
  for q in range(2):
   t=tt(.33); m=chords[ci][0]+24+arp[(b*2+q)%8]; hz=notehz(m)
   env=(1-np.exp(-t*210))*np.exp(-t*(16 if not breakdown else 9))
   v=(np.sin(2*np.pi*hz*t)+.32*np.sin(2*np.pi*hz*2*t)+.16*np.sin(2*np.pi*hz*4*t))*env
   gain=.052 if b<200 else .065
   add(v,t0+q*BEAT/2,gain,np.sin(b*.9+q)*.65)
   add(v,t0+q*BEAT/2+BEAT*.75,gain*.22,-.65)
 if (b+1)%16==0 and b<248:
  for q in range(4):add(S,t0+q*BEAT/4,.14+.05*q,q/6-.25)
# Full-spectrum cinematic impacts at each visual-world change.
for idx,b in enumerate(range(8,249,16)):
 center=b*BEAT
 t=tt(.65); n=rng.normal(0,1,len(t)).astype(np.float32)
 whoosh=filt(n,1200+idx%4*800)*np.sin(np.pi*np.arange(len(t))/len(t))**2
 add(whoosh,center-.53,.14,0)
 t=tt(1.15); freq=34+85*np.exp(-t*14); phase=2*np.pi*np.cumsum(freq)/SR
 impact=np.sin(phase)*np.exp(-t*5)+.12*filt(rng.normal(0,1,len(t)).astype(np.float32),2400)*np.exp(-t*11)
 add(impact,center,.44)
 # bright, brief material marker (glass / paper / machine, alternating registers)
 t=tt(.16); hz=[1300,900,440,1750,2300][idx%5]
 click=(np.sin(2*np.pi*hz*t)+.4*np.sin(2*np.pi*hz*1.41*t))*np.exp(-t*50)
 add(click,center,.045,(-1)**idx*.3)
# Final resolution; no abrupt stop.
t=tt(3.5)
for m in [52,59,64,67]:
 v=np.sin(2*np.pi*notehz(m)*t)*np.exp(-t*1.2)
 add(v,116.25,.06,(m-60)/18)
# Tiny stereo room tail, saturation and click-free edges.
for delay,gain in [(0.117,.06),(0.233,.035)]:
 d=int(SR*delay); mix[d:,0]+=mix[:-d,1].copy()*gain; mix[d:,1]+=mix[:-d,0].copy()*gain
mix=np.tanh(mix*1.25)
mix[:int(.008*SR)]*=np.linspace(0,1,int(.008*SR))[:,None]
mix[-int(1.7*SR):]*=np.linspace(1,0,int(1.7*SR))[:,None]**1.2
mix*=.87/max(.001,np.max(np.abs(mix)))
path=Path(__file__).resolve().parent.parent/'assets'/'original_score.wav'; write(path,SR,(mix*32767).astype(np.int16))
print(path, 'peak',float(np.max(np.abs(mix))))
```

### 11/19 · `AI_BEYOND_GENERATION/source/finalize.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/finalize.py", "lines": 23, "final_newline": true, "sha256": "d0d49593dff221bbd64e007a3ffb7564150c5954ed870c86dcf87aef83a2b1a0", "original_sha256": "d0d49593dff221bbd64e007a3ffb7564150c5954ed870c86dcf87aef83a2b1a0"} -->
```python
"""Assemble the 17 rendered segments, master the score and write H.264/AAC MP4."""
import json,subprocess,os,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
story=json.loads((ROOT/'source'/'story.json').read_text())
parts=[ROOT/'renders'/f'part_{i:02d}.mp4' for i in range(17)]
for p in parts:
 if not p.exists():raise FileNotFoundError(p)
concat=ROOT/'renders'/'concat.txt';concat.write_text(''.join("file '"+str(p)+"'\n" for p in parts))
meta=[';FFMETADATA1','title='+story['title']+' | BEYOND GENERATION','artist=Original procedural animation and sound design','comment=15 visual worlds; original 128 BPM score; 1920x1080, 30 fps. Research and provenance in the project.']
chapters=[(0,3.75,'OPEN / BEYOND GENERATION')]+[(3.75+i*7.5,3.75+(i+1)*7.5,f"{i+1:02d} / "+s['style']) for i,s in enumerate(story['scenes'])]+[(116.25,120,'END / BUILD WITH INTENT')]
for start,end,title in chapters:meta+=['[CHAPTER]','TIMEBASE=1/1000','START='+str(round(start*1000)),'END='+str(round(end*1000)),'title='+title]
mp=ROOT/'renders'/'chapters.ffmeta';mp.write_text('\n'.join(meta),encoding='utf-8')
# Conservative true-peak ceiling leaves room for the lossy AAC encoder.
# Verify the encoded file, not only the source PCM or loudnorm output.
filt='loudnorm=I=-16:TP=-4:LRA=9:linear=false:print_format=json'
out=ROOT.parent/'AI_BEYOND_GENERATION_1080p.mp4'
cmd=['ffmpeg','-hide_banner','-y','-f','concat','-safe','0','-i',str(concat),'-i',str(ROOT/'assets'/'original_score.wav'),'-i',str(mp),'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-af',filt,'-t','120','-movflags','+faststart',str(out)]
with open(ROOT/'qa'/'final_mux.log','w') as f:subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT,check=True)
local=ROOT/out.name
if local.exists():local.unlink()
os.link(out,local)
print('FINAL',out,out.stat().st_size)
```

### 12/19 · `AI_BEYOND_GENERATION/source/nativegl.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/nativegl.py", "lines": 202, "final_newline": true, "sha256": "a908814da075eeb558ac0d49d39d1b5bf36f180d2002092862d31dac28a740ad", "original_sha256": "a908814da075eeb558ac0d49d39d1b5bf36f180d2002092862d31dac28a740ad"} -->
```python
"""Minimal native EGL/OpenGL renderer. No browser, remote library or network dependency.
Rasterized 3D meshes, depth testing, PCF shadow maps and procedural materials.
"""
import os
os.environ.setdefault('EGL_PLATFORM','surfaceless')
os.environ.setdefault('LP_NUM_THREADS','2')
import ctypes as C, ctypes.util, math
import numpy as np
P=C.c_void_p; I=C.c_int; U=C.c_uint; F=C.c_float; B=C.c_ubyte

def norm(v):
 v=np.asarray(v,dtype=np.float32); return v/max(1e-9,np.linalg.norm(v))
def lookat(eye,target,up=(0,1,0)):
 eye=np.array(eye,np.float32); z=norm(eye-np.array(target)); x=norm(np.cross(up,z)); y=np.cross(z,x)
 a=np.eye(4,dtype=np.float32); a[:3,:3]=[x,y,z]; a[:3,3]=-a[:3,:3]@eye; return a

def perspective(fov,aspect,near=.1,far=100):
 f=1/math.tan(math.radians(fov)/2); a=np.zeros((4,4),np.float32)
 a[0,0]=f/aspect; a[1,1]=f; a[2,2]=(far+near)/(near-far);a[2,3]=2*far*near/(near-far);a[3,2]=-1;return a

def ortho(l,r,b,t,n,f):
 a=np.eye(4,dtype=np.float32);a[0,0]=2/(r-l);a[1,1]=2/(t-b);a[2,2]=-2/(f-n)
 a[0,3]=-(r+l)/(r-l);a[1,3]=-(t+b)/(t-b);a[2,3]=-(f+n)/(f-n);return a

def model(pos=(0,0,0),scale=(1,1,1),rot=(0,0,0)):
 x,y,z=rot; cx,sx=math.cos(x),math.sin(x);cy,sy=math.cos(y),math.sin(y);cz,sz=math.cos(z),math.sin(z)
 rx=np.array([[1,0,0],[0,cx,-sx],[0,sx,cx]],np.float32)
 ry=np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]],np.float32)
 rz=np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]],np.float32)
 a=np.eye(4,dtype=np.float32);a[:3,:3]=ry@rz@rx@np.diag(scale);a[:3,3]=pos;return a

def cube_data(center=(0,0,0),scale=(1,1,1),color=(1,1,1)):
 faces=[((1,0,0),[(1,-1,-1),(1,1,-1),(1,1,1),(1,-1,1)]),((-1,0,0),[(-1,-1,1),(-1,1,1),(-1,1,-1),(-1,-1,-1)]),((0,1,0),[(-1,1,-1),(-1,1,1),(1,1,1),(1,1,-1)]),((0,-1,0),[(-1,-1,1),(-1,-1,-1),(1,-1,-1),(1,-1,1)]),((0,0,1),[(1,-1,1),(1,1,1),(-1,1,1),(-1,-1,1)]),((0,0,-1),[(-1,-1,-1),(-1,1,-1),(1,1,-1),(1,-1,-1)])]
 out=[]
 for n,vs in faces:
  for j in [0,1,2,0,2,3]:
   p=np.array(vs[j])*np.array(scale)*.5+center;out.append([*p,*n,*color])
 return np.array(out,np.float32)

def sphere_data(nu=48,nv=24,power=1):
 out=[]
 def v(u,v):
  th=u*2*np.pi; ph=v*np.pi
  p=np.array([np.sin(ph)*np.cos(th),np.cos(ph),np.sin(ph)*np.sin(th)])
  if power!=1:p=np.sign(p)*np.abs(p)**power
  return p
 def normal(u,v):
  if power==1:return norm(vv(u,v))
  p=vfun(u,v); a=vfun(u+.0001,v)-p;b=vfun(u,v+.0001)-p
  n=norm(np.cross(b,a)); return n if np.dot(n,p)>0 else -n
 vv=v;vfun=v
 for j in range(nv):
  for k in range(nu):
   coords=[(k/nu,j/nv),((k+1)/nu,j/nv),((k+1)/nu,(j+1)/nv),(k/nu,(j+1)/nv)]
   for n in [0,1,2,0,2,3]:
    u,w=coords[n];p=v(u,w)
    if power==1:nm=norm(p)
    else:
     # Implicit superellipsoid normal, well-defined at the poles.
     nm=norm(np.sign(p)*np.maximum(np.abs(p),.0001)**(2/power-1))
    out.append([*p,*nm,1,1,1])
 return np.array(out,np.float32)

def torus_data(R=1,r=.23,nu=100,nv=20,knot=False):
 out=[]
 def center(u):
  if not knot:return np.array([R*np.cos(u),0,R*np.sin(u)])
  return np.array([(1+.32*np.cos(3*u))*np.cos(2*u),.55*np.sin(3*u),(1+.32*np.cos(3*u))*np.sin(2*u)])*R
 def vert(u,v):
  c=center(u); t=norm(center(u+.001)-center(u-.001)); ref=np.array([0,1,0])
  if abs(t[1])>.95:ref=np.array([1,0,0])
  b=norm(np.cross(t,ref));n=norm(np.cross(b,t));no=np.cos(v)*n+np.sin(v)*b;return c+r*no,no
 for j in range(nu):
  for k in range(nv):
   uv=[(j/nu*2*np.pi,k/nv*2*np.pi),((j+1)/nu*2*np.pi,k/nv*2*np.pi),((j+1)/nu*2*np.pi,(k+1)/nv*2*np.pi),(j/nu*2*np.pi,(k+1)/nv*2*np.pi)]
   for h in [0,1,2,0,2,3]:
    p,n=vert(*uv[h]);out.append([*p,*n,1,1,1])
 return np.array(out,np.float32)

VERT='''#version 330 core
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNorm; layout(location=2) in vec3 aColor;
uniform mat4 uModel,uVP,uLight; out vec3 vPos,vN,vColor;out vec4 vShadow;
void main(){vec4 w=uModel*vec4(aPos,1.);vPos=w.xyz;vN=normalize(transpose(inverse(mat3(uModel)))*aNorm);vColor=aColor;vShadow=uLight*w;gl_Position=uVP*w;}
'''
FRAG='''#version 330 core
in vec3 vPos,vN,vColor;in vec4 vShadow;out vec4 frag;
uniform vec3 uEye,uTint,uLightPos;uniform int uMode,uShadows;uniform float uTime;uniform sampler2D uDepth;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float shade(){if(uShadows==0)return 1.;vec3 p=vShadow.xyz/vShadow.w*.5+.5;if(p.z>1.||p.x<0.||p.x>1.||p.y<0.||p.y>1.)return 1.;float s=0.;for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)s+=p.z-.0017>texture(uDepth,p.xy+vec2(x,y)/1024.).r?.30:1.;return s/9.;}
vec3 env(vec3 r){vec3 c=mix(vec3(.015,.022,.035),vec3(.24,.28,.32),r.y*.5+.5);float panel=smoothstep(.72,.79,dot(r,normalize(vec3(-.65,.7,1.))));float strip=(1.-smoothstep(.07,.105,abs(r.y-.16)))*smoothstep(-.5,.15,r.x);float side=smoothstep(.88,.94,dot(r,normalize(vec3(.8,.25,-.5))));return c+vec3(3.7,3.75,3.9)*panel+vec3(2.4)*strip+vec3(.4,.9,1.8)*side;}
void main(){vec3 N=normalize(vN);vec3 V=normalize(uEye-vPos);vec3 L=normalize(uLightPos-vPos);vec3 albedo=vColor*uTint;float rough=.65;
 if(uMode==1){float h=hash(floor(vPos*13.));albedo*=.82+.3*h;float edge=max(max(abs(fract(vPos.x*2.)-.5),abs(fract(vPos.y*2.)-.5)),abs(fract(vPos.z*2.)-.5));albedo*=1.-.09*smoothstep(.465,.499,edge);rough=1.;}
 if(uMode==2){vec3 q=vPos*30.;vec3 bump=vec3(sin(q.y+sin(q.z*.7)),sin(q.z+sin(q.x)),sin(q.x+sin(q.y*.8)));N=normalize(N+.045*bump);float grain=hash(floor(vPos*165.));albedo*=.955+.09*grain;rough=.95;}
 if(uMode==6){vec2 q=abs(fract(vPos.xz*.5)-.5);float grid=1.-smoothstep(.006,.018,min(q.x,q.y));albedo=mix(albedo,vec3(.02,.6,.7),grid*.65);}
 float sh=shade();if(uMode==3)sh=1.;float dif=max(dot(N,L),0.);float fill=max(dot(N,normalize(vec3(1.,.5,-.5))),0.);vec3 col=albedo*(.22+.21*max(N.y,0.)+1.05*dif*sh)+albedo*vec3(.2,.25,.4)*fill;
 float spec=pow(max(dot(N,normalize(L+V)),0.),mix(85.,8.,rough));col+=vec3(.22)*spec*sh;
 if(uMode==3){vec3 R=reflect(-V,N);float fr=pow(1.-max(dot(N,V),0.),4.);col=env(R)*mix(vec3(.76,.8,.84),albedo,.13)+vec3(.03,.10,.13)*fr;col*=.68+.32*sh;}
 if(uMode==4){vec3 R=reflect(-V,N);vec3 T=refract(-V,N,1./1.48);float fr=.06+.94*pow(1.-max(dot(N,V),0.),4.);vec3 sky=mix(vec3(.58,.78,.84),vec3(.94,.9,.84),T.y*.5+.5);vec3 rainbow=.55+.45*cos(vec3(0.,2.1,4.2)+T.x*6.+T.z*4.);col=mix(sky*.85+rainbow*.28,env(R)*1.2,fr*.8+.12);col+=pow(max(dot(N,normalize(L+V)),0.),160.)*2.;}
 if(uMode==5){col=albedo*2.4;}
 col=pow(aces(col),vec3(1./2.2));frag=vec4(col,1.);}
'''
BGV='''#version 330 core
out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}
'''
BGF='''#version 330 core
in vec2 uv;out vec4 frag;uniform vec3 uTop,uBottom;uniform float uTime;
void main(){vec3 c=mix(uBottom,uTop,smoothstep(0.,1.,uv.y));float g=exp(-dot((uv-vec2(.58,.6))*vec2(1.1,1.),(uv-vec2(.58,.6))*vec2(1.1,1.))*4.);c+=g*.026;float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.54)-.5;frag=vec4(c+grain*.002,1.);}
'''
DEPTHV='''#version 330 core
layout(location=0) in vec3 aPos;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aPos,1.);}
'''
DEPTHF='''#version 330 core
void main(){}
'''
POINTV='''#version 330 core
layout(location=0) in vec3 aPos;layout(location=1) in vec3 aNorm;layout(location=2) in vec3 aColor;
uniform mat4 uVP,uView;uniform float uTime,uMorph,uSize;out vec3 color;
void main(){float a=aNorm.y*6.2831853;float b=aNorm.z*6.2831853;vec3 p=aPos;
 vec3 q=vec3((1.7+.45*cos(3.*a))*cos(2.*a),.8*sin(3.*a),(1.7+.45*cos(3.*a))*sin(2.*a));q+=.15*vec3(cos(b),sin(b),cos(b*2.));p=mix(p,q,uMorph);
 float co=cos(uTime*.16),si=sin(uTime*.16);p.xz=mat2(co,-si,si,co)*p.xz;vec4 view=uView*vec4(p,1.);gl_Position=uVP*vec4(p,1.);gl_PointSize=clamp(uSize*aNorm.x/max(.2,-view.z),1.,7.);color=aColor;}
'''
POINTF='''#version 330 core
in vec3 color;out vec4 frag;void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(r>1.)discard;float a=exp(-r*3.0)*.68;frag=vec4(color,a);}
'''

class GL:
 def __init__(self,w=1920,h=1080):
  self.w,self.h=w,h; self.E=C.CDLL(ctypes.util.find_library('EGL')); self.G=C.CDLL(ctypes.util.find_library('GL'));self.funcs={};self.uniforms={}
  def ef(n,r,args):x=getattr(self.E,n);x.restype=r;x.argtypes=args;return x
  d=ef('eglGetDisplay',P,[P])(None);a=I();b=I();assert ef('eglInitialize',U,[P,C.POINTER(I),C.POINTER(I)])(d,C.byref(a),C.byref(b))
  ef('eglBindAPI',U,[U])(0x30A2);cfg=P();nn=I();attrs=(I*15)(0x3033,1,0x3040,8,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3025,24,0x3038)
  ef('eglChooseConfig',U,[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)])(d,attrs,C.byref(cfg),1,C.byref(nn))
  ca=(I*7)(0x3098,3,0x30FB,3,0x30FD,1,0x3038);context=ef('eglCreateContext',P,[P,P,P,C.POINTER(I)])(d,cfg,None,ca)
  pa=(I*5)(0x3057,w,0x3056,h,0x3038);surface=ef('eglCreatePbufferSurface',P,[P,P,C.POINTER(I)])(d,cfg,pa)
  assert ef('eglMakeCurrent',U,[P,P,P,P])(d,surface,surface,context)
  specs={
  'glCreateShader':(U,[U]),'glShaderSource':(None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)]),'glCompileShader':(None,[U]),'glGetShaderiv':(None,[U,U,C.POINTER(I)]),'glGetShaderInfoLog':(None,[U,I,C.POINTER(I),C.c_char_p]),
  'glCreateProgram':(U,[]),'glAttachShader':(None,[U,U]),'glLinkProgram':(None,[U]),'glGetProgramiv':(None,[U,U,C.POINTER(I)]),'glGetProgramInfoLog':(None,[U,I,C.POINTER(I),C.c_char_p]),'glUseProgram':(None,[U]),
  'glGenVertexArrays':(None,[I,C.POINTER(U)]),'glBindVertexArray':(None,[U]),'glGenBuffers':(None,[I,C.POINTER(U)]),'glBindBuffer':(None,[U,U]),'glBufferData':(None,[U,C.c_size_t,P,U]),'glEnableVertexAttribArray':(None,[U]),'glVertexAttribPointer':(None,[U,I,U,B,I,P]),
  'glGetUniformLocation':(I,[U,C.c_char_p]),'glUniform1f':(None,[I,F]),'glUniform1i':(None,[I,I]),'glUniform3f':(None,[I,F,F,F]),'glUniformMatrix4fv':(None,[I,I,B,P]),'glViewport':(None,[I,I,I,I]),'glEnable':(None,[U]),'glDisable':(None,[U]),'glClearColor':(None,[F,F,F,F]),'glClear':(None,[U]),'glDrawArrays':(None,[U,I,I]),'glReadPixels':(None,[I,I,I,I,U,U,P]),'glPixelStorei':(None,[U,I]),'glFinish':(None,[]),'glBlendFunc':(None,[U,U]),'glDepthMask':(None,[B]),
  'glGenTextures':(None,[I,C.POINTER(U)]),'glBindTexture':(None,[U,U]),'glTexImage2D':(None,[U,I,I,I,I,I,U,U,P]),'glTexParameteri':(None,[U,U,I]),'glActiveTexture':(None,[U]),'glGenFramebuffers':(None,[I,C.POINTER(U)]),'glBindFramebuffer':(None,[U,U]),'glFramebufferTexture2D':(None,[U,U,U,U,I]),'glDrawBuffer':(None,[U]),'glReadBuffer':(None,[U]),'glColorMask':(None,[B,B,B,B]),'glGetString':(C.c_char_p,[U])}
  for n,(r,args) in specs.items():x=getattr(self.G,n);x.restype=r;x.argtypes=args;setattr(self,n,x)
  vao=U();self.glGenVertexArrays(1,C.byref(vao));self.blank=vao.value;self.glBindVertexArray(self.blank)
  self.main=self.program(VERT,FRAG);self.bg=self.program(BGV,BGF);self.depth=self.program(DEPTHV,DEPTHF);self.points=self.program(POINTV,POINTF)
  tex=U();self.glGenTextures(1,C.byref(tex));self.shadow=tex.value;self.glBindTexture(0x0DE1,self.shadow);self.glTexImage2D(0x0DE1,0,0x81A6,1024,1024,0,0x1902,0x1406,None)
  for par,val in [(0x2801,0x2600),(0x2800,0x2600),(0x2802,0x812F),(0x2803,0x812F)]:self.glTexParameteri(0x0DE1,par,val)
  fb=U();self.glGenFramebuffers(1,C.byref(fb));self.shadowfbo=fb.value;self.glBindFramebuffer(0x8D40,self.shadowfbo);self.glFramebufferTexture2D(0x8D40,0x8D00,0x0DE1,self.shadow,0);self.glDrawBuffer(0);self.glReadBuffer(0);self.glBindFramebuffer(0x8D40,0)
  self.arr=np.empty((h,w,4),np.uint8);self.meshes={};self.glEnable(0x0B71)
  print('Native renderer:',self.glGetString(0x1F01).decode(),flush=True)
 def program(self,vs,fs):
  shaders=[]
  for tp,s in [(0x8B31,vs),(0x8B30,fs)]:
   sh=self.glCreateShader(tp);p=C.c_char_p(s.encode());self.glShaderSource(sh,1,C.byref(p),None);self.glCompileShader(sh);ok=I();self.glGetShaderiv(sh,0x8B81,C.byref(ok))
   if not ok.value:
    e=C.create_string_buffer(8192);self.glGetShaderInfoLog(sh,8192,None,e);raise RuntimeError(e.value.decode())
   shaders.append(sh)
  pr=self.glCreateProgram()
  for s in shaders:self.glAttachShader(pr,s)
  self.glLinkProgram(pr);ok=I();self.glGetProgramiv(pr,0x8B82,C.byref(ok))
  if not ok.value:
   e=C.create_string_buffer(8192);self.glGetProgramInfoLog(pr,8192,None,e);raise RuntimeError(e.value.decode())
  return pr
 def use(self,p):self.current=p;self.glUseProgram(p)
 def uniform(self,n,v):
  k=(self.current,n)
  if k not in self.uniforms:self.uniforms[k]=self.glGetUniformLocation(self.current,n.encode())
  loc=self.uniforms[k]
  if loc<0:return
  if isinstance(v,np.ndarray):
   a=np.ascontiguousarray(v,np.float32);self.glUniformMatrix4fv(loc,1,1,a.ctypes.data)
  elif isinstance(v,(tuple,list)):self.glUniform3f(loc,*v)
  elif n in ['uMode','uShadows','uDepth']:self.glUniform1i(loc,int(v))
  else:self.glUniform1f(loc,float(v))
 def mesh(self,name,data=None):
  if name in self.meshes:return self.meshes[name]
  if data is None:
   if name=='cube':data=cube_data()
   elif name=='sphere':data=sphere_data()
   elif name=='round':data=sphere_data(48,28,.36)
   elif name=='torus':data=torus_data()
   elif name=='knot':data=torus_data(R=1.2,r=.24,nu=160,nv=24,knot=True)
   elif name=='ring':data=torus_data(R=1,r=.04,nu=120,nv=10)
  a=np.ascontiguousarray(data,np.float32);vao=U();vbo=U();self.glGenVertexArrays(1,C.byref(vao));self.glGenBuffers(1,C.byref(vbo));self.glBindVertexArray(vao.value);self.glBindBuffer(0x8892,vbo.value);self.glBufferData(0x8892,a.nbytes,a.ctypes.data,0x88E4)
  for j in range(3):self.glEnableVertexAttribArray(j);self.glVertexAttribPointer(j,3,0x1406,0,36,P(j*12))
  m=(vao.value,len(a),vbo.value);self.meshes[name]=m;return m
 def draw(self,m,primitive=4):self.glBindVertexArray(m[0]);self.glDrawArrays(primitive,0,m[1])
 def render(self,objects,eye=(5,4,7),target=(0,.5,0),fov=40,top=(.88,.90,.94),bottom=(.66,.73,.81),light=(-5,9,6),time=0,shadows=True,particles=None):
  lightmat=ortho(-13,13,-13,13,.1,50)@lookat(light,(0,0,0));view=lookat(eye,target);vp=perspective(fov,self.w/self.h)@view
  if shadows:
   self.glBindFramebuffer(0x8D40,self.shadowfbo);self.glViewport(0,0,1024,1024);self.glEnable(0x0B71);self.glDepthMask(1);self.glClear(0x00000100);self.glColorMask(0,0,0,0);self.use(self.depth)
   for mesh,mat,mode,tint in objects:
    if mode==5:continue
    self.uniform('uMVP',lightmat@mat);self.draw(mesh)
   self.glColorMask(1,1,1,1)
  self.glBindFramebuffer(0x8D40,0);self.glViewport(0,0,self.w,self.h);self.glDisable(0x0BE2);self.glClearColor(*bottom,1);self.glClear(0x4000|0x100);self.glDisable(0x0B71);self.use(self.bg);self.uniform('uTop',top);self.uniform('uBottom',bottom);self.uniform('uTime',time);self.glBindVertexArray(self.blank);self.glDrawArrays(4,0,3)
  self.glEnable(0x0B71);self.use(self.main);self.uniform('uVP',vp);self.uniform('uEye',eye);self.uniform('uLight',lightmat);self.uniform('uLightPos',light);self.uniform('uTime',time);self.uniform('uShadows',int(shadows));self.glActiveTexture(0x84C0);self.glBindTexture(0x0DE1,self.shadow);self.uniform('uDepth',0)
  for mesh,mat,mode,tint in objects:self.uniform('uModel',mat);self.uniform('uMode',mode);self.uniform('uTint',tint);self.draw(mesh)
  if particles:
   mesh,morph,size=particles;self.glEnable(0x8642);self.glEnable(0x0BE2);self.glBlendFunc(0x0302,1);self.glDepthMask(0);self.use(self.points);self.uniform('uVP',vp);self.uniform('uView',view);self.uniform('uTime',time);self.uniform('uMorph',morph);self.uniform('uSize',size);self.draw(mesh,0);self.glDepthMask(1);self.glDisable(0x0BE2)
  self.glPixelStorei(0x0D05,1);self.glReadPixels(0,0,self.w,self.h,0x80E1,0x1401,self.arr.ctypes.data)
  return self.arr[::-1].copy()
```

### 13/19 · `AI_BEYOND_GENERATION/source/preview.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/preview.py", "lines": 19, "final_newline": true, "sha256": "413bcde7f6cee3aa3cfc87f5dd57bd82f6f7befcf16519c6893537b55f0a2859", "original_sha256": "413bcde7f6cee3aa3cfc87f5dd57bd82f6f7befcf16519c6893537b55f0a2859"} -->
```python
import sys,time
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np
from art import Art,ROOT,STORY
art=Art(1280,720)
start=time.time()
for i in range(15):
 t=time.time();a=art.render(i,1.15);im=Image.fromarray(a[:,:,[2,1,0]]);im.save(ROOT/'qa'/f'world_{i+1:02d}.png');print(i+1,round(time.time()-t,3),flush=True)
contact=Image.new('RGB',(1600,1000),'#13191e');d=ImageDraw.Draw(contact);f=ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf',19)
for i in range(15):
 im=Image.open(ROOT/'qa'/f'world_{i+1:02d}.png');im.thumbnail((512,288));x=16+(i%3)*533;y=12+(i//3)*198;im=im.resize((512,288)).crop((0,0,512,288));im.thumbnail((320,180))
 # 3 columns x 5 rows with 16:9 scene stills and their own frame.
 im=Image.open(ROOT/'qa'/f'world_{i+1:02d}.png').resize((340,191));
# Larger 5 x 3 sheet, preserving the entire image rather than cropping captions.
contact=Image.new('RGB',(1920,720),'#111922');d=ImageDraw.Draw(contact)
for i in range(15):
 x=(i%5)*384;y=(i//5)*240;im=Image.open(ROOT/'qa'/f'world_{i+1:02d}.png').resize((374,210));contact.paste(im,(x+5,y+5));d.text((x+10,y+217),f'{i+1:02d}  '+STORY['scenes'][i]['tag'].split(' / ')[0],font=f,fill='#e2edef')
contact.save(ROOT/'qa'/'contact_sheet.jpg',quality=94);print('total',time.time()-start)
```

### 14/19 · `AI_BEYOND_GENERATION/source/render.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/render.py", "lines": 50, "final_newline": true, "sha256": "7cb4c4813740515f1eed6ac4d8a7ca24d22b9fd87f42006fa0d77f1355fd520f", "original_sha256": "7cb4c4813740515f1eed6ac4d8a7ca24d22b9fd87f42006fa0d77f1355fd520f"} -->
```python
"""Render the final film. Usage: python render.py --part 0 [--width 1920 --height 1080].
Parts 0..16: intro, 15 worlds, outro. Every frame is placed on the same 30-FPS timeline.
"""
import argparse,json,math,subprocess,time
from pathlib import Path
import numpy as np
from PIL import Image
from art import Art,ROOT,transition,B
FPS=30;DURATION=120.;INTRO=8*B;WORLD=16*B;OUTRO=248*B
CUTS=[0.,INTRO]+[INTRO+i*WORLD for i in range(1,16)]+[DURATION]
# Uniform boundaries round to the closest video frame; max timing error < 16.7 ms.
BOUNDS=[int(t*FPS+.5) for t in CUTS]

def raw(art,idx,t):
 if idx<0:return art.intro(max(0,t))
 if idx>14:return art.intro(max(0,t),True)
 return art.render(idx,t)
def frame_at(art,t):
 boundaries=[INTRO+i*WORLD for i in range(16)]
 near=min(range(16),key=lambda k:abs(t-boundaries[k]));delta=t-boundaries[near];window=.16
 if abs(delta)<window:
  prev=near-1;current=near
  prevstart=0 if prev<0 else INTRO+prev*WORLD
  a=raw(art,prev,t-prevstart);b=raw(art,current,t-boundaries[near]);p=(delta+window)/(2*window)
  return transition(a,b,p,near)
 if t<INTRO:return art.intro(t)
 if t>=OUTRO:return art.intro(t-OUTRO,True)
 i=min(14,int((t-INTRO)/WORLD));return art.render(i,t-INTRO-i*WORLD)

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--part',type=int,required=True);ap.add_argument('--width',type=int,default=1920);ap.add_argument('--height',type=int,default=1080);ap.add_argument('--fps',type=int,default=30);args=ap.parse_args()
 assert args.fps==30,'Timeline is calibrated for 30 fps.'
 start,end=BOUNDS[args.part],BOUNDS[args.part+1];out=ROOT/'renders';out.mkdir(exist_ok=True);path=out/f'part_{args.part:02d}.mp4'
 art=Art(args.width,args.height)
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','bgra','-video_size',f'{args.width}x{args.height}','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','1','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',str(path)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);t0=time.time();stats=[]
 try:
  for n in range(start,end):
   a=frame_at(art,n/FPS);proc.stdin.write(np.ascontiguousarray(a).tobytes())
   if (n-start)%60==0 or n==end-1:
    mean=float(a[:,:,:3].mean());std=float(a[:,:,:3].std());stats.append({'frame':n,'mean':round(mean,3),'std':round(std,3)});print(f'part {args.part:02d}: {n-start+1}/{end-start}, elapsed {time.time()-t0:.1f}s, mean {mean:.1f}',flush=True)
   if n in [start+round((end-start)*.2),start+round((end-start)*.55),start+round((end-start)*.82)]:
    Image.fromarray(a[:,:,[2,1,0]]).resize((960,540)).save(ROOT/'qa'/f'part{args.part:02d}_f{n}.jpg',quality=92)
 finally:
  proc.stdin.close()
 ret=proc.wait()
 if ret:raise RuntimeError(f'ffmpeg exited {ret}')
 (out/f'part_{args.part:02d}.json').write_text(json.dumps({'part':args.part,'start_frame':start,'end_frame_exclusive':end,'frames':end-start,'seconds':(end-start)/FPS,'render_seconds':time.time()-t0,'samples':stats},indent=2))
 print('DONE',path,flush=True)
if __name__=='__main__':main()
```

### 15/19 · `AI_BEYOND_GENERATION/source/render_all.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/render_all.py", "lines": 19, "final_newline": true, "sha256": "8f1a6d1f69155a6bf0fc75a12364d86f1a7c316154306597add2c3ef3f69f37f", "original_sha256": "8f1a6d1f69155a6bf0fc75a12364d86f1a7c316154306597add2c3ef3f69f37f"} -->
```python
import os,sys,time,subprocess,concurrent.futures
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
(ROOT/'renders').mkdir(exist_ok=True)
def render(part):
 log=ROOT/'renders'/f'part_{part:02d}.log'
 env=os.environ.copy();env['OPENBLAS_NUM_THREADS']='1';env['LP_NUM_THREADS']='2'
 start=time.time()
 with open(log,'w') as f:
  p=subprocess.run([sys.executable,str(ROOT/'source'/'render.py'),'--part',str(part)],stdout=f,stderr=subprocess.STDOUT,env=env)
 if p.returncode:raise RuntimeError(f'part {part}: '+log.read_text()[-4000:])
 return part,time.time()-start
if __name__=='__main__':
 t=time.time()
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
  futures=[pool.submit(render,p) for p in range(17)]
  for future in concurrent.futures.as_completed(futures):
   part,elapsed=future.result();print(f'Completed {part:02d}/16 in {elapsed:.1f}s; total {time.time()-t:.1f}s',flush=True)
 print('ALL 3600 FRAMES COMPLETE',flush=True)
```

### 16/19 · `AI_BEYOND_GENERATION/source/story.json`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/story.json", "lines": 127, "final_newline": false, "sha256": "a6a69066ade2749ced0cb53ba74f19a826d60cff8792022ada630d4876ef49c8", "original_sha256": "a6a69066ade2749ced0cb53ba74f19a826d60cff8792022ada630d4876ef49c8"} -->
```json
{
  "title": "超越生成",
  "subtitle": "让 AI 不止回答，更把事情做对。",
  "ending": "不止生成，更要可靠。",
  "scenes": [
    {
      "style": "纯线条手绘",
      "en": "ASK BETTER.",
      "title": "先定义问题",
      "caption": "目标、约束、验收标准，先于提示词。",
      "key": "目标 / 约束 / 验收",
      "tag": "HAND-DRAWN / 01"
    },
    {
      "style": "3D MC 方块世界",
      "en": "BREAK IT DOWN.",
      "title": "把任务拆开",
      "caption": "能用清晰工作流，就先别堆复杂 Agent。",
      "key": "规划 / 构建 / 检查",
      "tag": "BLOCK WORLD / 02"
    },
    {
      "style": "粘土定格",
      "en": "CONTEXT MATTERS.",
      "title": "给足上下文",
      "caption": "给任务相关材料，不是无限堆字数。",
      "key": "相关 / 清晰 / 够用",
      "tag": "CLAYMATION / 03"
    },
    {
      "style": "Vox 式解释拼贴",
      "en": "SHOW YOUR SOURCES.",
      "title": "让答案有出处",
      "caption": "外部事实要检索，关键结论要回源。",
      "key": "检索 / 引用 / 核验",
      "tag": "EDITORIAL COLLAGE / 04"
    },
    {
      "style": "SVG 几何矢量",
      "en": "CONNECT TO REALITY.",
      "title": "用工具接入现实",
      "caption": "工具负责执行；调用结果仍然要验证。",
      "key": "输入 / 工具 / 结果",
      "tag": "PURE VECTOR / 05"
    },
    {
      "style": "8-BIT 像素街机",
      "en": "MEMORY IS A CHOICE.",
      "title": "记忆要可控",
      "caption": "区分临时上下文与长期保存的信息。",
      "key": "临时 / 保存 / 删除",
      "tag": "PIXEL ARCADE / 06"
    },
    {
      "style": "半调漫画",
      "en": "FLUENT IS NOT TRUE.",
      "title": "流畅 ≠ 正确",
      "caption": "听起来合理，不等于有事实依据。",
      "key": "别被自信语气说服",
      "tag": "HALFTONE COMIC / 07"
    },
    {
      "style": "蓝晒工程制图",
      "en": "TEST. DON'T GUESS.",
      "title": "让结果可测试",
      "caption": "把“做得不错”变成明确的验收条件。",
      "key": "条件 / 执行 / 验收",
      "tag": "BLUEPRINT / 08"
    },
    {
      "style": "瑞士动态字体",
      "en": "LESS ACCESS. MORE CONTROL.",
      "title": "最小权限",
      "caption": "只开放必要工具；高风险动作需确认。",
      "key": "必要才开放",
      "tag": "KINETIC TYPE / 09"
    },
    {
      "style": "立体剪纸剧场",
      "en": "KEEP HUMANS IN CONTROL.",
      "title": "让人保留决定权",
      "caption": "重要节点可以暂停、复核、撤回。",
      "key": "暂停 / 复核 / 撤回",
      "tag": "PAPER THEATRE / 10"
    },
    {
      "style": "东方水墨",
      "en": "UNKNOWN IS AN ANSWER.",
      "title": "不确定，就说明",
      "caption": "缺证据时，标注未知，不填补想象。",
      "key": "未知，不是空白",
      "tag": "INK & SILENCE / 11"
    },
    {
      "style": "霓虹赛博线框",
      "en": "ACT. CHECK. ADAPT.",
      "title": "反馈驱动改进",
      "caption": "执行、检查、修正，并设置停止条件。",
      "key": "行动 / 检查 / 修正",
      "tag": "NEON SYSTEM / 12"
    },
    {
      "style": "液态铬金属",
      "en": "MORE IS NOT BETTER.",
      "title": "算清成本与延迟",
      "caption": "更长推理，不自动等于更大价值。",
      "key": "质量 / 成本 / 延迟",
      "tag": "LIQUID CHROME / 13"
    },
    {
      "style": "粒子数据宇宙",
      "en": "TEST THE WHOLE SYSTEM.",
      "title": "先做小规模验证",
      "caption": "用真实任务与失败样本，测试整体系统。",
      "key": "任务 / 轨迹 / 结果",
      "tag": "PARTICLE COSMOS / 14"
    },
    {
      "style": "棱镜玻璃光学",
      "en": "THE FUTURE IS YOURS.",
      "title": "把创造力还给人",
      "caption": "AI 提供更多可能；目标与责任仍由人承担。",
      "key": "可能性，交给 AI；决定权，留给人。",
      "tag": "PRISMATIC GLASS / 15"
    }
  ]
}
```

### 17/19 · `AI_BEYOND_GENERATION/source/threeworlds.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/threeworlds.py", "lines": 146, "final_newline": true, "sha256": "78226dfba18005a445757db698ab62d83115962075a022f0eb3c9999e34caa0d", "original_sha256": "78226dfba18005a445757db698ab62d83115962075a022f0eb3c9999e34caa0d"} -->
```python
"""Six spatial worlds: real geometry, animated cameras and material-specific staging."""
import math
import numpy as np
from nativegl import GL, model, cube_data
B=60/128
def shot_id(t):
 b=t/B
 return (2+int(b*2)%2) if b>=14 else min(3,int(b/4))

def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)

class ThreeWorlds:
 def __init__(self,w=1920,h=1080):
  self.gl=GL(w,h);self.ready=set();self.rng=np.random.default_rng(821)
 def obj(self,name,pos=(0,0,0),scale=(1,1,1),rot=(0,0,0),mode=0,col=(1,1,1)):
  return(self.gl.mesh(name),model(pos,scale,rot),mode,col)
 def init_mc(self):
  data=[];rng=np.random.default_rng(71)
  # A constructed floating island: separate grass, soil and stone layers.
  for x in range(-9,10):
   for z in range(-7,8):
    r=(x/9)**2+(z/7)**2
    if r>1+.05*math.sin(x*3+z):continue
    y=.15+.25*(int(rng.integers(0,3)) if abs(x)>4 or abs(z)>4 else 0)
    data.append(cube_data((x*.6,y-.25,z*.6),(.6,.55,.6),(.27+.06*rng.random(),.54+.12*rng.random(),.23)))
    depth=1.2*(1-r)+.25
    data.append(cube_data((x*.6,y-.65-depth/2,z*.6),(.6,depth,.6),(.37,.25,.18)))
  # Cubical trees, stairs and distant clouds; all original meshes.
  for tx,tz in [(-3,1.5),(3.5,-2),(-3.7,-2.4),(2.5,2.5)]:
   data.append(cube_data((tx,1.15,tz),(.35,1.9,.35),(.33,.22,.12)))
   for dx,dy,dz,sc in [(0,2,0,(1.5,.8,1.5)),(.25,2.6,0,(1.05,.7,1.1)),(-.3,2.25,.35,(1.0,.75,1.))]:data.append(cube_data((tx+dx,dy,tz+dz),sc,(.13,.39,.19)))
  for k in range(8):data.append(cube_data((-2.1+k*.6,.45,1),(.52,.25,.52),(.88,.61,.16)))
  # Solid arch with a genuine open center.
  for xx in [-1.25,1.25]:data.append(cube_data((xx,2.0,-1.0),(.4,3.5,.55),(.17,.13,.30)))
  data.append(cube_data((0,3.75,-1),(2.9,.4,.55),(.17,.13,.30)))
  for xx in [-1.01,1.01]:data.append(cube_data((xx,2,-.68),(.07,3,.06),(.45,.35,.98)))
  self.gl.mesh('island',np.vstack(data))
  self.ready.add('mc')
 def mc(self,t):
  if 'mc' not in self.ready:self.init_mc()
  shot=shot_id(t);u=(t%(4*B))/(4*B);p=math.exp(-((t/B)%1)*9)
  poses=[(8.5,7.1,11.5),(-7,5.5,10),(4.1,3.6,7.6),(8.2,8.2,9.3)]
  e=np.array(poses[shot]);theta=.07*(u-.5);e[[0,2]]=np.array([[math.cos(theta),-math.sin(theta)],[math.sin(theta),math.cos(theta)]])@e[[0,2]]
  objs=[self.obj('island',mode=1)]
  # Blocks assemble on beats rather than drifting through each other.
  for i in range(5):
   for j in range(1+i%3):
    dest=(2.4+i*.28,.7+j*.55,-.3+i*.22)
    drop=max(0,1-smooth((t/B-i*.8-j*.3)/.75))*4
    objs.append(self.obj('cube',(dest[0],dest[1]+drop,dest[2]),(.48,.48,.48),mode=1,col=(.26,.61,.86)))
  # Block-built actor walking along the visible gold path.
  x=-1.8+3.6*(.5-.5*math.cos(t*.8));y=.77+.05*abs(math.sin(t*5));z=1.04;walk=math.sin(t*6)*.25
  objs.extend([self.obj('cube',(x,y+.6,z),(.56,.65,.35),mode=1,col=(.08,.56,.60)),self.obj('cube',(x,y+1.14,z),(.48,.48,.48),mode=1,col=(.79,.57,.4))])
  for side in [-1,1]:
   objs.append(self.obj('cube',(x+side*.16,y+.08,z),(.23,.56,.25),(side*walk,0,0),1,(.12,.2,.4)))
   objs.append(self.obj('cube',(x+side*.43,y+.63,z),(.18,.57,.23),(-side*walk,0,0),1,(.72,.48,.32)))
   objs.append(self.obj('cube',(x+side*.10,y+1.18,z+.245),(.065,.065,.025),mode=0,col=(.06,.06,.08)))
  # Small colored signal packets pass through the arch without occupying the frame.
  for j in range(9):
   a=j*2.399+t*.7;objs.append(self.obj('cube',(.73*math.cos(a),2+.85*math.sin(a),-1),(.12,.12,.12),(t,t*.6,0),5,(.15,.52,.8)))
  for x,y,z,s in [(-8,7,-9,2),(5,8,-11,2.7),(10,7,0,1.7)]:objs.append(self.obj('cube',(x,y,z),(s, .65,s*.7),mode=0,col=(.91,.95,1)))
  return self.gl.render(objs,tuple(e),(0,1.0,0),40-p*.4,top=(.38,.67,.87),bottom=(.75,.88,.90),light=(-8,14,10),time=t)
 def clay(self,t):
  qt=math.floor(t*12)/12;shot=shot_id(t);u=(t%(4*B))/(4*B)
  objs=[self.obj('cube',(0,-1.38,0),(200,.3,200),mode=2,col=(.69,.57,.72))]
  bob=.06*math.sin(qt*5); base=np.array([.5,bob,0]);rot=.12*math.sin(qt*.8)
  def part(name,pos,sc,col,rr=(0,0,0)):
   pos=np.array(pos);pos[0]+=.5;pos[1]+=bob;objs.append(self.obj(name,tuple(pos),sc,rr,2,col))
  part('round',(0,.13,0),(.82,.96,.53),(.45,.59,.79))
  part('round',(0,1.95,0),(1.13,.86,.77),(.96,.54,.21))
  part('round',(0,1.84,.70),(.84,.53,.13),(.98,.70,.38))
  for s in [-1,1]:
   part('sphere',(s*.36,2,.83),(.235,.28,.115),(.96,.95,.87))
   part('sphere',(s*.36+.025*math.sin(qt),1.995,.933),(.09,.13,.065),(.08,.10,.15))
   part('sphere',(s*.34,2.04,.978),(.029,.043,.025),(.98,.97,.94))
   part('round',(s*.47,-.91,.03),(.30,.33,.41),(.97,.54,.21))
   # Arms stay outside the torso silhouette; discrete pose changes suggest hand animation.
   a=.22*math.sin(qt*2.1+s)+s*.35
   part('sphere',(s*1.06,.29,.02),(.28,.64,.28),(.42,.54,.73),(0,0,s*.48+a*.24))
   part('sphere',(s*1.35,-.15+.10*math.sin(qt*2),.05),(.29,.29,.29),(.98,.63,.31))
  part('round',(0,1.55,.875),(.25,.037,.055),(.4,.17,.11))
  part('cube',(0,2.96,0),(.055,.48,.055),(.40,.48,.68))
  part('sphere',(0,3.23,0),(.17,.17,.17),(.79,.32,.41))
  # Clay contextual objects arranged with genuine depth and clear separation.
  palette=[(.78,.3,.39),(.36,.70,.52),(.71,.72,.36),(.52,.43,.75)]
  for j in range(4):
   a=j*math.pi/2+qt*.18;cx=.5+2.65*math.cos(a);cz=1.3*math.sin(a);cy=.8+.8*math.sin(a+.5)
   objs.append(self.obj('round',(cx,cy,cz),(.43,.43,.16),(0,-a*.4,math.sin(qt+j)*.09),2,palette[j]))
   objs.append(self.obj('round',(cx,cy,cz+.18),(.22,.065,.024),mode=2,col=(.96,.91,.82)))
  e=[(5.6,3.7,10.8),(3.4,2.7,9.7),(4.8,4.9,9.8),(5.4,3.4,11)][shot];e=(e[0]+u*.35,e[1],e[2])
  return self.gl.render(objs,e,(-.7,.82,0),36,top=(.81,.73,.83),bottom=(.71,.59,.73),light=(-4,9,8),time=t)
 def cyber(self,t):
  shot=shot_id(t);u=(t%(4*B))/(4*B);pulse=math.exp(-((t/B)%1)*9)
  objs=[self.obj('cube',(0,-.27,-5),(45,.2,90),mode=6,col=(.012,.025,.042))]
  for side in [-1,1]:
   for j in range(13):
    h=2.2+(j*7%5)*.8;z=7-j*3.7;x=side*(4.5+(j%3)*.4)
    objs.append(self.obj('cube',(x,h/2-.16,z),(1.8,h,1.9),mode=0,col=(.017,.018,.038)))
    for dx in [-.89,.89]:objs.append(self.obj('cube',(x+dx,h/2,z+.965),(.025,h,.025),mode=5,col=(.015,.19,.30) if j%2 else (.28,.025,.25)))
    for y in [h*.25,h*.55,h*.8]:objs.append(self.obj('cube',(x,y,z+1), (1.65,.025,.025),mode=5,col=(.03,.22,.33)))
  for j in range(6):
   z=-2-j*3.0;col=(.1,.8,.77) if j%2==0 else (.52,.06,.58)
   objs.append(self.obj('ring',(0,2,z),(1.7,1.7,1.7),(math.pi/2,0,t*.12+j*.14),5,col))
  for j in range(6):
   a=j*math.pi/3+t*.8;pos=(1.16*math.cos(a),2+1.16*math.sin(a),-2.5)
   objs.append(self.obj('sphere',pos,(.16,.16,.16),mode=5,col=(.13,.82,.65)))
  objs.append(self.obj('sphere',(0,2,-2.5),(.64,.64,.64),mode=3,col=(.07,.30,.4)))
  eye=[(.1,2,7.5-u*1.1),(1.6,2.8,6.8-u),(-1.5,1.35,7.1-u),(0,2,6.8-u*.9)][shot]
  return self.gl.render(objs,eye,(0,2,-6),49-pulse,top=(.013,.004,.043),bottom=(.006,.015,.033),light=(-4,7,4),time=t,shadows=False)
 def chrome(self,t):
  shot=shot_id(t);u=(t%(4*B))/(4*B);p=math.exp(-((t/B)%1)*8)
  objs=[self.obj('cube',(0,-1.80,0),(200,.2,200),mode=0,col=(.025,.032,.041))]
  objs.append(self.obj('knot',(1,.35,0),(1,1,1),(t*.25,t*.32,.22*math.sin(t*.5)),3,(.83,.88,.92)))
  for j in range(3):
   a=t*.4+j*2.094;objs.append(self.obj('sphere',(1+2.3*math.cos(a),.4+.7*math.sin(a*1.3),2.3*math.sin(a)),(.11,.11,.11),mode=3,col=(.75,.88,.97)))
  poses=[(6.7,3.5,8.1),(4.9,2.2,6.3),(-4.3,3.7,7.8),(6.2,4.7,8.4)];e=np.array(poses[shot]);e[2]-=u*.35
  return self.gl.render(objs,tuple(e),(-.7,.15,0),34,top=(.009,.013,.022),bottom=(.017,.027,.035),light=(-4,8,7),time=t)
 def particles(self,t):
  if 'particles' not in self.ready:
   rng=np.random.default_rng(92);n=22000;v=rng.normal(size=(n,3));v/=np.linalg.norm(v,axis=1,keepdims=True);r=rng.uniform(.9,3.6,n)**.87;v*=r[:,None];a=rng.uniform(size=(n,3));a[:,0]=rng.uniform(.014,.055,n);c=np.zeros((n,3),np.float32);blend=rng.random(n);c[:,0]=.1+.75*blend;c[:,1]=.52+.30*(1-blend);c[:,2]=.86+.14*rng.random(n)
   self.gl.mesh('cosmos',np.hstack((v,a,c)));self.ready.add('particles')
  shot=shot_id(t);u=(t%(4*B))/(4*B);morph=[smooth(u),1,.5+.5*math.cos(u*math.pi),smooth(u)][shot]
  objs=[]
  # A sparse reference cube makes the points' 3D movement legible.
  if shot in [1,3]:
   for ax in range(3):
    for a in [-1,1]:
     for b in [-1,1]:
      pos=[0,0,0];other=[x for x in range(3) if x!=ax];pos[other[0]]=a*2.5;pos[other[1]]=b*2.5;sc=[.006,.006,.006];sc[ax]=5
      objs.append(self.obj('cube',pos,sc,mode=5,col=(.02,.11,.15)))
  e=[(6.5,3.6,10),(-5.2,2.7,9),(4.7,5.7,9.6),(5.5,2.8,10.5)][shot]
  return self.gl.render(objs,e,(0,0,0),40,top=(.002,.005,.014),bottom=(.005,.008,.024),light=(-5,6,3),time=t,shadows=False,particles=(self.gl.mesh('cosmos'),float(morph),760.0))
 def glass(self,t):
  shot=shot_id(t);u=(t%(4*B))/(4*B);pulse=math.exp(-((t/B)%1)*8)
  objs=[self.obj('cube',(0,-1.65,0),(200,.2,200),mode=0,col=(.77,.84,.87))]
  # Art-directed non-intersecting crystal objects on a studio stage.
  objs.append(self.obj('round',(.8,.15,0),(1.15,1.15,.72),(.12,t*.21,.16),4,(.72,.82,.95)))
  objs.append(self.obj('torus',(.3,2.0,-.25),(.83,.83,.83),(math.pi/2+.2*math.sin(t),t*.28,.3),4,(.74,.86,.96)))
  objs.append(self.obj('round',(3.05,-.87,.45),(.47,.47,.47),(0,t*.32,0),4,(.9,.75,.59)))
  objs.append(self.obj('sphere',(-1.7,-.98,-.1),(.52,.52,.52),mode=4,col=(.45,.76,.81)))
  for j in range(3):
   a=j*2.1+t*.3;objs.append(self.obj('sphere',(.7+2.3*math.cos(a),1.4+j*.3,1.5*math.sin(a)),(.1,.1,.1),mode=4,col=(.9,.8,.75)))
  e=[(6.5,3.9,10),(4.3,2.5,8.2),(-5.5,4.8,10),(6,4,11)][shot];e=(e[0]+u*.2,e[1],e[2])
  return self.gl.render(objs,e,(-.8,.2,0),36,top=(.87,.91,.94),bottom=(.77,.84,.89),light=(-5,9,7),time=t)
 def render(self,i,t):
  return {1:self.mc,2:self.clay,11:self.cyber,12:self.chrome,13:self.particles,14:self.glass}[i](t)
```

### 18/19 · `AI_BEYOND_GENERATION/source/validate.py`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/source/validate.py", "lines": 48, "final_newline": true, "sha256": "c33b1926721343665f738c729370e482a6749b7a6b58e0122b069c82d423d8c7", "original_sha256": "c33b1926721343665f738c729370e482a6749b7a6b58e0122b069c82d423d8c7"} -->
```python
"""Decode every frame, test frame count and blank frames, and audit all chapter boundaries.
This is a technical screen; it does not assert a subjective 'zero defect' artistic guarantee.
"""
from pathlib import Path
import subprocess,json,hashlib,time
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent.parent
video=ROOT/'AI_BEYOND_GENERATION_1080p.mp4';start=time.time()
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-show_chapters','-of','json',str(video)]))
cmd=['ffmpeg','-hide_banner','-loglevel','error','-threads','2','-i',str(video),'-map','0:v:0','-vf','scale=320:180','-pix_fmt','rgb24','-f','rawvideo','pipe:1']
p=subprocess.Popen(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
N=320*180*3;count=0;black=[];white=[];flat=[];means=[];stds=[];prev=None;run=1;maxrun=1
while True:
 data=p.stdout.read(N)
 if not data:break
 if len(data)!=N:raise RuntimeError('Incomplete decoded frame')
 a=np.frombuffer(data,np.uint8);m=float(a.mean());s=float(a.std());means.append(m);stds.append(s)
 if int(a.max())<=3:black.append(count)
 if int(a.min())>=252:white.append(count)
 if s<.25:flat.append(count)
 digest=hashlib.blake2b(data,digest_size=12).digest()
 if digest==prev:run+=1
 else:run=1
 maxrun=max(maxrun,run);prev=digest;count+=1
ret=p.wait()
if ret:raise RuntimeError(p.stderr.read().decode())
assert count==3600,(count,'expected 3600 frames')
assert not black and not white and not flat,(black,white,flat)
vs=next(s for s in probe['streams'] if s['codec_type']=='video');au=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (vs['width'],vs['height'],vs['r_frame_rate'])==(1920,1080,'30/1')
assert abs(float(vs['duration'])-float(au['duration']))<.04
# Full-resolution frame hashes detect exact duplicates without relying on the scaled screen.
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-threads','2','-i',str(video),'-map','0:v:0','-f','framemd5',str(ROOT/'qa'/'frames.framemd5')],check=True)
lines=[s for s in (ROOT/'qa'/'frames.framemd5').read_text().splitlines() if s and not s.startswith('#')]
last=None;max_exact=1;run=1
for s in lines:
 h=s.split(',')[-1].strip();run=run+1 if h==last else 1;max_exact=max(max_exact,run);last=h
report={'video':video.name,'bytes':video.stat().st_size,'duration_seconds':float(probe['format']['duration']),'width':vs['width'],'height':vs['height'],'fps':vs['r_frame_rate'],'decoded_frames':count,'expected_frames':3600,'video_codec':vs['codec_name'],'audio_codec':au['codec_name'],'audio_sample_rate':au['sample_rate'],'audio_channels':au['channels'],'audio_video_duration_difference':abs(float(vs['duration'])-float(au['duration'])),'chapters':len(probe['chapters']),'all_black_frame_count':len(black),'all_white_frame_count':len(white),'uniform_blank_frame_count':len(flat),'minimum_frame_mean':min(means),'minimum_frame_std':min(stds),'maximum_exact_duplicate_run_full_resolution':max_exact,'maximum_exact_duplicate_run_scaled_screen':maxrun,'beat_alignment_maximum_rounding_error_ms':1000/60,'visual_review':'Chapter overviews and 3 samples per segment. Dedicated reading zones during close-ups; no text crossfades. This does not claim exhaustive human review of every pixel.','music':'Original synthesized score. The researched third-party BGM recording was not downloaded and is not used.','analysis_seconds':time.time()-start}
(ROOT/'qa'/'QA_REPORT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
# Three grids contain actual native-resolution-render samples from all fifteen worlds.
f=ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf',17)
for phase in range(3):
 sheet=Image.new('RGB',(1920,720),'#111820');d=ImageDraw.Draw(sheet)
 for i in range(1,16):
  files=sorted((ROOT/'qa').glob(f'part{i:02d}_f*.jpg'),key=lambda x:int(x.stem.split('_f')[-1]));im=Image.open(files[min(phase,len(files)-1)]).resize((374,210));x=(i-1)%5*384;y=(i-1)//5*240;sheet.paste(im,(x+5,y+5));d.text((x+10,y+217),f'WORLD {i:02} / SHOT {phase+1}',font=f,fill='#dbe7de')
 sheet.save(ROOT/'qa'/f'final_review_{phase+1}.jpg',quality=94)
print(json.dumps(report,indent=2,ensure_ascii=False))
```

### 19/19 · `AI_BEYOND_GENERATION/timeline.json`
<!-- casebook-file {"path": "AI_BEYOND_GENERATION/timeline.json", "lines": 176, "final_newline": false, "sha256": "de6b4d57bc990d5e90a0d672bd145859c4cdd519a6fac30f8b6d22ba64b83193", "original_sha256": "de6b4d57bc990d5e90a0d672bd145859c4cdd519a6fac30f8b6d22ba64b83193"} -->
```json
{
  "title": "超越生成",
  "duration": 120,
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "bpm": 128,
  "music": "Original procedural electronic score; no third-party recording used",
  "scenes": [
    {
      "index": 1,
      "start": 3.75,
      "end": 11.25,
      "start_frame": 113,
      "style": "纯线条手绘",
      "title": "先定义问题",
      "caption": "目标、约束、验收标准，先于提示词。",
      "tag": "HAND-DRAWN / 01",
      "beats": 16
    },
    {
      "index": 2,
      "start": 11.25,
      "end": 18.75,
      "start_frame": 338,
      "style": "3D MC 方块世界",
      "title": "把任务拆开",
      "caption": "能用清晰工作流，就先别堆复杂 Agent。",
      "tag": "BLOCK WORLD / 02",
      "beats": 16
    },
    {
      "index": 3,
      "start": 18.75,
      "end": 26.25,
      "start_frame": 563,
      "style": "粘土定格",
      "title": "给足上下文",
      "caption": "给任务相关材料，不是无限堆字数。",
      "tag": "CLAYMATION / 03",
      "beats": 16
    },
    {
      "index": 4,
      "start": 26.25,
      "end": 33.75,
      "start_frame": 788,
      "style": "Vox 式解释拼贴",
      "title": "让答案有出处",
      "caption": "外部事实要检索，关键结论要回源。",
      "tag": "EDITORIAL COLLAGE / 04",
      "beats": 16
    },
    {
      "index": 5,
      "start": 33.75,
      "end": 41.25,
      "start_frame": 1013,
      "style": "SVG 几何矢量",
      "title": "用工具接入现实",
      "caption": "工具负责执行；调用结果仍然要验证。",
      "tag": "PURE VECTOR / 05",
      "beats": 16
    },
    {
      "index": 6,
      "start": 41.25,
      "end": 48.75,
      "start_frame": 1238,
      "style": "8-BIT 像素街机",
      "title": "记忆要可控",
      "caption": "区分临时上下文与长期保存的信息。",
      "tag": "PIXEL ARCADE / 06",
      "beats": 16
    },
    {
      "index": 7,
      "start": 48.75,
      "end": 56.25,
      "start_frame": 1463,
      "style": "半调漫画",
      "title": "流畅 ≠ 正确",
      "caption": "听起来合理，不等于有事实依据。",
      "tag": "HALFTONE COMIC / 07",
      "beats": 16
    },
    {
      "index": 8,
      "start": 56.25,
      "end": 63.75,
      "start_frame": 1688,
      "style": "蓝晒工程制图",
      "title": "让结果可测试",
      "caption": "把“做得不错”变成明确的验收条件。",
      "tag": "BLUEPRINT / 08",
      "beats": 16
    },
    {
      "index": 9,
      "start": 63.75,
      "end": 71.25,
      "start_frame": 1913,
      "style": "瑞士动态字体",
      "title": "最小权限",
      "caption": "只开放必要工具；高风险动作需确认。",
      "tag": "KINETIC TYPE / 09",
      "beats": 16
    },
    {
      "index": 10,
      "start": 71.25,
      "end": 78.75,
      "start_frame": 2138,
      "style": "立体剪纸剧场",
      "title": "让人保留决定权",
      "caption": "重要节点可以暂停、复核、撤回。",
      "tag": "PAPER THEATRE / 10",
      "beats": 16
    },
    {
      "index": 11,
      "start": 78.75,
      "end": 86.25,
      "start_frame": 2363,
      "style": "东方水墨",
      "title": "不确定，就说明",
      "caption": "缺证据时，标注未知，不填补想象。",
      "tag": "INK & SILENCE / 11",
      "beats": 16
    },
    {
      "index": 12,
      "start": 86.25,
      "end": 93.75,
      "start_frame": 2588,
      "style": "霓虹赛博线框",
      "title": "反馈驱动改进",
      "caption": "执行、检查、修正，并设置停止条件。",
      "tag": "NEON SYSTEM / 12",
      "beats": 16
    },
    {
      "index": 13,
      "start": 93.75,
      "end": 101.25,
      "start_frame": 2813,
      "style": "液态铬金属",
      "title": "算清成本与延迟",
      "caption": "更长推理，不自动等于更大价值。",
      "tag": "LIQUID CHROME / 13",
      "beats": 16
    },
    {
      "index": 14,
      "start": 101.25,
      "end": 108.75,
      "start_frame": 3038,
      "style": "粒子数据宇宙",
      "title": "先做小规模验证",
      "caption": "用真实任务与失败样本，测试整体系统。",
      "tag": "PARTICLE COSMOS / 14",
      "beats": 16
    },
    {
      "index": 15,
      "start": 108.75,
      "end": 116.25,
      "start_frame": 3263,
      "style": "棱镜玻璃光学",
      "title": "把创造力还给人",
      "caption": "AI 提供更多可能；目标与责任仍由人承担。",
      "tag": "PRISMATIC GLASS / 15",
      "beats": 16
    }
  ]
}
```

