# protocom · 宣传片

80 秒、1080p60 的社团宣传片，整条片子都是代码生成的：画面用 Canvas 2D 加一层 WebGL 后期，逐帧渲染；配乐和音效用 Python 从零合成，所有卡点都对着同一张时间表。

## 叙事结构（120 BPM，每拍 0.5s）

| 时间 | 段落 | 视觉风格 | 内容 |
|---|---|---|---|
| 0–4s | 冷开场 | 黑底终端 | `> 每一个了不起的东西，都始于一个想法。` 光标放大成一张纸 |
| 4–20s | 手绘时代 | 铅笔线稿（12fps 抖线）、等轴立体 | 灯泡（想法）→ 六块积木垒成一座山（学三年编程 / 写十万行代码 / 凑齐团队…）→ 镜头绕到山脚仰拍 → AI 选框框住整座山，输入「把它做出来。」 |
| 19.5–20s | 静默 | 纯黑 | 2022 |
| 20–38s | AI 爆发 | 深色霓虹、反相闪白、扫描线 | 山碎成 token →「然后，AI 来了。」→ 8 个模型 Logo 逐拍砸入（镜像抽帧）→ 32 格工具墙 → 冲进画面 → 95%（YC W25）→ Karpathy vibe coding → 「当代码不再稀缺——」→ **拉片**倒带回到最初的灯泡 →「那么，什么才是稀缺的？」→ 注意力 / 判断力 / 品味（深浅反转） |
| 38–62s | 我们 | 暖白纸 × 精确 UI（protocom 的界面语言） | 于是在华科 → 11 位成员混剪（4 张大卡按拍切 + 7 张八分音符快切，明暗与左右交替）→ 成员目录，末格是「下一个是你」→ **76.0B Tokens** 公开排行榜 → 「不是 PPT 上的项目，是正在运行的系统」：产品 bento 加 obelisk 的真实 PR 动态 → 共建手册六条（上下分屏对向滑入） |
| 62–80s | 升维 | 星空、线框 | 成员连成星座 →「靠交付赢得信任 · 靠信任换取速度 · 靠速度做出真东西」→ 2D→3D→4D 超立方体 →「一个学生，就是一支团队。一群学生，就是一个时代。」→ 收缩成指纹标志 **protocom** →「下一个故事，由你书写。」 |

画面上的每一条数据（成员、Token、PR、手册原句）都来自 protocom 成员页、Tokens 排行榜和《共建手册 v0.1》，见 `src/data.js`。

## 渲染

```bash
cd promo
npm install                       # 字体（@fontsource）与 AI 图标（@lobehub/icons-static-svg）
pip install numpy scipy imageio-ffmpeg
python3 audio/synth.py audio/music.wav
node render.mjs 4 60 out/protocom-promo.mp4   # 4 个 Chromium 进程并行，约 10 分钟
node preview.mjs out/stills 5.9 22.2 45.9    # 按时间点导出静帧
```

实时预览：在 `promo/` 下起一个静态服务器，打开 `index.html?play=0`（从第 N 秒开始播）或 `index.html?t=22.2`（只看某一帧）。

## 文件

- `src/core.js`：缓动、确定性噪声、文字排版、铅笔线条、3D 投影
- `src/post.js`：WebGL 后期（色差、径向/方向模糊、故障切片、反相、镜像、扫描线、暗角、胶片颗粒、辉光）
- `src/act1.js` … `src/act4.js`：四幕
- `src/data.js`：片中出现的全部事实数据
- `audio/synth.py`：配乐与音效
- `render.mjs` / `preview.mjs`：逐帧渲染与静帧预览

改社团名只需要改 `src/data.js` 里的 `BRAND`，片尾的终端命令在 `audio/synth.py` 里也要同步改。
