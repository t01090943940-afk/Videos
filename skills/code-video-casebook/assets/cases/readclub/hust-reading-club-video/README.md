# 华中大读书会 · 《慢下来》代码短片 源码

竖屏 1080×1920 · 30fps · 37 秒。画面（Canvas 2D）与配乐（Web Audio 合成）全部由代码生成，无外部素材。

## 文件说明

| 文件 | 作用 |
|---|---|
| `video.src.html` | **主源码**。画面引擎 + 全部分镜 + 音乐合成器 + 播放器，都在这一个文件里 |
| `build.py` | 构建：把用到的汉字从字体里裁出来，base64 内嵌，生成自包含的 `video.html` |
| `video.built.html` | 已构建好的成品，可直接双击用浏览器打开播放 |
| `render.py` | 逐帧渲染 + 离线渲染音轨，用 ffmpeg 合成 `out.mp4` |
| `snap.py` | 抽指定时间点的帧到 `snaps/`，改完画面快速检查用 |
| `package.json` | 字体依赖（Fontsource：马善政、站酷快乐体、站酷庆科黄油体、龙藏体、思源宋体） |

## 环境

- Node.js（只用来 `npm install` 下载字体）
- Python 3.9+：`pip install fonttools brotli playwright`，然后 `playwright install chromium`
- ffmpeg（导出 MP4 时需要）

## 使用

```bash
npm install                 # 下载字体到 node_modules/@fontsource
python3 build.py            # 生成 video.html
# 浏览器打开 video.html 预览（点击播放，需开声音）
python3 snap.py 3.3,17.9,29.5   # 可选：抽帧检查，输出到 snaps/
python3 render.py           # 导出 out.mp4（约 2–4 分钟）
```

浏览器调试参数：`video.html?t=17.9` 打开即停在该秒；`?render=1` 为渲染模式（隐藏按钮）。
播放时空格键暂停，底部进度条可点击跳转。

## 源码结构（video.src.html）

- **时间结构**：`SC_T`（A 段 7 个场景起点）、`B0=16.0`（爆燃起点，150BPM，`BB=0.4` 秒一拍）、`B_END=25.6`（骤停）、`C0=26.4`（慢下来）、`DUR=37`
- **A 段 温暖手卷**：`sc0`~`sc6` 每个函数一个场景，`partA` 负责横移镜头、季节背景、红线、21 天推镜
  - 改文案：各场景里的 `header(...)` / `caption(...)`
- **B 段 爆燃**：`B_drop`（读 + 数据）、`B_film`（拉片）、`B_books`（书单，改 `BOOKS` 数组）、`B_clash`（学科对撞）、`B_depts`（部门，改 `DEPTS`）、`B_vortex`（倍速刷屏 + 万物归一漩涡，改 `FRAGS`）
- **C 段 慢下来**：`partC` / `drawC`，片尾文案在 `drawC` 末尾"片尾"一节
- **音乐**：`class Music` 是合成器（音乐盒、钟琴、钢琴、底鼓、超级锯齿波等），`score()` 是乐谱
  - A 段 F 大调 120BPM；B 段 D 小调 150BPM + 侧链泵感；C 段把 A 段主旋律放慢用钢琴重奏
  - 画面卡点和音乐卡点共用同一套时间常数，改时间时两边一起改

## 注意

- 改了文案里的**新汉字**后必须重新 `python3 build.py`，否则新字会回退成系统字体。
- 总时长改动时，同步修改 `video.src.html` 的 `DUR` 和 `render.py` 的 `DUR`。
- 字体均为 SIL OFL 开源授权（通过 Fontsource 分发），可免费商用。
