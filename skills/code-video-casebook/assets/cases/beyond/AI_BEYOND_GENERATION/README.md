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