# skillshub · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show skillshub <路径>`；还原成真实目录：`python3 scripts/casebook.py copy skillshub <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `promo/.gitignore` | 3 | 42 |
| 2 | `promo/README.md` | 98 | 50 |
| 3 | `promo/audio/make-track.py` | 512 | 153 |
| 4 | `promo/package-lock.json` | 57 | 670 |
| 5 | `promo/package.json` | 19 | 732 |
| 6 | `promo/render.mjs` | 119 | 756 |
| 7 | `promo/src/cues.json` | 21 | 880 |
| 8 | `promo/src/index.html` | 20 | 906 |
| 9 | `promo/src/js/data.js` | 91 | 931 |
| 10 | `promo/src/js/engine.js` | 156 | 1027 |
| 11 | `promo/src/js/fx.js` | 159 | 1188 |
| 12 | `promo/src/js/main.js` | 186 | 1352 |
| 13 | `promo/src/js/scenes/beyond.js` | 183 | 1543 |
| 14 | `promo/src/js/scenes/chaos.js` | 236 | 1731 |
| 15 | `promo/src/js/scenes/chapter.js` | 41 | 1972 |
| 16 | `promo/src/js/scenes/extend.js` | 135 | 2018 |
| 17 | `promo/src/js/scenes/finale.js` | 67 | 2158 |
| 18 | `promo/src/js/scenes/growth.js` | 124 | 2230 |
| 19 | `promo/src/js/scenes/intro.js` | 80 | 2359 |
| 20 | `promo/src/js/scenes/link.js` | 79 | 2444 |
| 21 | `promo/src/js/scenes/see.js` | 80 | 2528 |
| 22 | `promo/src/js/scenes/share.js` | 118 | 2613 |
| 23 | `promo/src/js/scenes/store.js` | 126 | 2736 |
| 24 | `promo/src/js/scenes/team.js` | 83 | 2867 |
| 25 | `promo/src/js/scenes/title.js` | 100 | 2955 |
| 26 | `promo/src/js/theme.js` | 56 | 3060 |
| 27 | `promo/src/js/ui.js` | 142 | 3121 |
| 28 | `promo/src/styles/stage.css` | 103 | 3268 |
| 29 | `promo/src/styles/tokens.css` | 116 | 3376 |
| 30 | `promo/src/styles/ui.css` | 216 | 3497 |

---

### 1/30 · `promo/.gitignore`
<!-- casebook-file {"path": "promo/.gitignore", "lines": 3, "final_newline": true, "sha256": "77ac0a574818c72b9d2c7099191edbf307f884dd8496083b270e7e1f54118e53", "original_sha256": "77ac0a574818c72b9d2c7099191edbf307f884dd8496083b270e7e1f54118e53"} -->
```
node_modules/
# 渲染产物：配乐 wav、草稿、静帧。成片单独放在 film/ 下提交（根 .gitignore 忽略所有 dist/）。
out/
```

### 2/30 · `promo/README.md`
<!-- casebook-file {"path": "promo/README.md", "lines": 98, "final_newline": true, "sha256": "f93866196cfd9e292041921b3593b27f765d8532e94539bcc52b73fdf3e51c77", "original_sha256": "f93866196cfd9e292041921b3593b27f765d8532e94539bcc52b73fdf3e51c77"} -->
````markdown
# Skills Hub 宣传片（promo/）

> 57 秒卡点宣传片 + 片中那套「从 0 到 1 重做的前端」。
> 成片：[`film/skills-hub-promo.mp4`](film/skills-hub-promo.mp4)（1920×1080 · 60fps · H.264 + AAC · 浅色版）

这个目录**不属于 pnpm workspace**，不影响 `pnpm lint / typecheck / build`。它做两件事：

1. **片子本身**：一个 1920×1080 的 HTML 舞台，画面是时间 `t` 的纯函数；渲染器逐帧 `seek(t)` 截图，管道喂给 ffmpeg，混入同一张节拍网格合成出来的配乐。所以每一刀都精确落在拍点上。
2. **新前端的底稿**：片里出现的总览页、库存面板、分享对话框、Agent 对话、排行榜，都是用 `src/styles/tokens.css` + `src/styles/ui.css` 这套组件真实排出来的 DOM，不是贴图。片子做完之后，要不要把它迁回 `apps/web`，见文末。

## 叙事：从一个文件夹到连接一切

节拍网格：F 小调，120 BPM（一拍 0.5s，一小节 2s），共 114 拍。段落口径在 [`src/cues.json`](src/cues.json)，画面和配乐读的是同一份。

| 时间 | 拍 | 段落 | 画面 | 素材依据 |
|---|---|---|---|---|
| 0:00 | b0 | 起初 | 信箱画幅 + 时间码（「过去」的影像感）；光标键入 `~/.claude/skills/pptx`，SKILL.md 展开：`name` + `description` | 会议纪要：skill 本质是一个文件夹，name + description 大家都能读 |
| 0:04 | b8 | 生长 | 卡片每两拍翻倍 1→128，计数滚到 213；「有人写了一个 / 大家都开始写 / 装进每一个 Agent / 越来越多」 | 真实 skill 名（见下） |
| 0:12 | b24 | 混乱 | 卡片炸开，27 个客户端目录瀑布；**27 个目录 → 581 份副本**；`demo-init` ×26 扇形牌堆、两个内容变体；黑白反相四连问；「很多。很怪。没人知道。」故障大字 | `docs/audits/skills-full-scan-2026-08-16.md` 的真机数字 |
| 0:19.75 | b39.5 | 静默 | 半拍黑场 + 吸气 | |
| 0:20 | b40 | 定名 | 冲击、信箱打开、Logo 从爆点收束：**Skills Hub**，「把团队散落的 Skills，收成一个系统。」 | |
| 0:22 | b44 | 01 收 | 副本被吸进统一库存，581 → 213，列表逐行给出 sha256 与「N 份副本 → 1」，demo-init 两个变体分开保留 | Step 1：按整个文件夹内容哈希去重，不按文件名 |
| 0:26 | b52 | 02 链 | 库存居中，逐拍把符号链接挂到 8 个 Agent；改 `version: 1 → 2`，一道光同时冲到所有节点「✓ 已同步」 | Step 3–5：改的是原件，全局改、不漂移 |
| 0:30 | b60 | 03 看 | 重做的总览页从透视里落定；KPI 计数、用量 Top 8 柱图生长、近期收录开关逐拍打开 | Step 6：一个地方统一看 |
| 0:34 | b68 | 04 享 | 分享对话框推到 `club/skills`，链接分发到成员；**甩镜**到 Agent：「帮我找一个做 PPT 的 skill」→ `enable_links` 待批准 → 批准 → 已启用 | 共享层：授信成员直接写、链接分发、零服务器；Agent 写策略先批准 |
| 0:38 | b76 | 05 扩 | 确定性内核居中，`StorageProvider / SourceProvider / ClientAdapter / IdentityProvider` 四个模块逐拍「咔」进来；收成 A→B/C→D 工程 DAG；「为团队而生，为扩展而建。」 | `packages/core/src/interfaces.ts`、架构规范 DAG |
| 0:44 | b88 | 06 人 | 成员主页卡（在用多少、置顶什么）→ 社团精选本周排行 | 社区玩法：个人主页 → 置顶 → 全站精选 |
| 0:48 | b96 | 跨次元 | 曲速星空，界面坍缩成点，长成 skill 点阵星球，拉远成「前端组 / 设计组 / 社团 / 企业团队 / 开源世界」星系；**Skills · 连接 · 一切** | |
| 0:52 | b104 | 定版 | Logo 锁定：「团队的 Skill 中枢 · Skills 连接一切」+ `$ skills-hub ui` | |

片中出现的 skill 名全部真实存在：`anthropics/skills`（pptx、docx、xlsx、pdf、skill-creator、mcp-builder、frontend-design、webapp-testing、canvas-design…）、`obra/superpowers`（brainstorming、systematic-debugging、test-driven-development、writing-plans…）、`vercel-labs`（vercel-react-best-practices、web-design-guidelines、find-skills…）、`remotion-dev/skills`（remotion-best-practices），以及本仓库真机扫描报告里的 hyperframes、demo-init、concept-keeper 等。成员主页里的 `@mio` 等是演示用的占位账号。

## 手法清单

- **卡点**：所有冲击、切镜、计数翻页都按拍号写死（`kf / hit / prog` 以拍为单位），配乐由 `audio/make-track.py` 在同一网格上合成（底鼓、军鼓、reese 低音、拨弦琶音、铺底、上升音、反向镲、冲击低频、故障切片），无采样、无版权素材。
- **拉片感**：前 40 拍是 2.39:1 信箱 + 时间码 + REC（「过去」），冲击时信箱打开进入产品时代；颗粒、暗角、变形宽银幕光斑、震屏、闪白。
- **明暗节奏**：全片纸白基底；混乱段的反相问句和「很多。很怪。没人知道。」切到墨色底，是全片最暗的一刻，接半拍黑场，再闪白进入定名。
- **MG / 转场**：逐字模糊显影、遮罩升字、弹簧回弹、甩镜动态模糊、推拉镜、3D 透视落定、SVG 描边生长、粒子爆发与冲击环、红青色散 + 横切片故障字、黑白反相快切、点阵星球与星系拉远。

## 渲染

```bash
cd promo
npm install                  # playwright-core + 字体（Geist / Geist Mono / Noto Sans SC）
pip install numpy scipy imageio-ffmpeg
npm run audio                # → out/track.wav
node render.mjs              # 全片 60fps → out/skills-hub-promo.mp4（约 10 分钟）
node render.mjs --fps 30 --from 20 --to 30 --preset veryfast   # 局部草稿
node render.mjs --stills 12.5,20.1,33 --dir out/review        # 审片静帧
node render.mjs --theme dark --out out/promo-dark.mp4          # 深色版
```

实时预览：`npx http-server . -c-1` 后打开 `/src/index.html?play`（点一下画面开始，跟随音频播放）；`?t=21.5` 定格到某一秒；`?theme=dark` 切深色。

需要 Chromium（默认找 `/opt/pw-browsers/chromium-1194`，或设 `CHROME_PATH`）和带 libx264 的 ffmpeg（默认用 imageio-ffmpeg 的静态版，或设 `FFMPEG`）。

## 目录

```
promo/
  src/
    cues.json            节拍网格与段落（画面 + 配乐共用）
    index.html           舞台
    styles/tokens.css    ★ 设计令牌（新前端的视觉语言；:root 浅色，[data-theme="dark"] 深色）
    styles/ui.css        ★ 产品组件（侧栏、KPI、柱图、行、开关、对话框、Toast、Agent 对话）
    styles/stage.css     片子专用：分层、大字、章节题签、后期
    js/engine.js         时间线引擎：缓动、关键帧、冲击包络、确定性随机
    js/theme.js          画布 / 特效用的主题色（粒子、星空、点阵球、故障色散的混合模式）
    js/ui.js             ★ 产品界面构件：Logo、图标、完整总览页
    js/fx.js             故障字、粒子、冲击环、星空、颗粒
    js/data.js           片中数据（真实 skill 名、扫描数字、客户端路径）
    js/scenes/*.js       12 个场景
    js/main.js           挂载、后期、__seek(t) 渲染接口、预览
  audio/make-track.py    配乐合成
  render.mjs             逐帧渲染 + ffmpeg 合成
  film/                  成片
```

## 新前端：设计语言摘要，以及要不要迁回 apps/web

片里的界面遵循 `app-shell-v2` 的信息架构（左侧 总览 / 统计 / Skills 管理 / Agent，左下角设置），但视觉是重新定的：

| | 现行 `ui-design-v1` | 片中新语言 |
|---|---|---|
| 基底 | 浅色、白底灰阶 | 浅色纸白 `#f6f6f3` + 白色卡面（默认）；同名令牌另有一套深色 |
| 品牌色 | 控件与导航禁止品牌色 | 一支信号色 Volt：面用 `#c8f53c`（主按钮、柱、开关、Logo 核心），线与字用加深的 `#4d7c0f`，只给「当前 / 主动作 / 已链接」 |
| 系列色 | 图表蓝 / 青 / 琥珀 / 紫 | 图表 Volt + 青，来源标记 clay / violet / cyan / amber |
| 字体 | 系统栈 + 等宽 | Geist + Geist Mono，中文回落 Noto Sans SC |
| 高度 | 无阴影，仅两档极弱 | 两档极弱阴影 + 一档信号光（只在「刚发生」时出现） |
| 动效 | 分层 token + spring / smooth | 沿用同一套缓动口径 |

**建议**：浅色基底、信息架构、组件清单、动效口径与现行规范一致，可以直接复用；真正的冲突只剩「品牌信号色进入控件」这一条（外加可选的深色模式），它正是 `ui-design-v1` 明文禁止的。按 AGENTS.md「遇到架构矛盾先修文档」，迁回的顺序应当是：

1. 先提一版 `ui-design-v2`（或 v1 修订），写明为什么要引入唯一信号色、面 / 线两种用法的边界，以及深色模式是否进入范围；
2. 再把 `tokens.css` 的变量映射进 `apps/web/src/index.css` 的 `@theme`，把 `ui.css` 里的组件逐个落到 `components/ui/` 现有组件上（Button / Card / Switch / Badge / Tabs…），不新开第三套控件；
3. 统计页的柱图、Skills 的行、Agent 的工具卡片按片中样式改，逐页替换、各自走 PR。

这一步需要团队拍板，片子本身不改动 `apps/web`。
````

### 3/30 · `promo/audio/make-track.py`
<!-- casebook-file {"path": "promo/audio/make-track.py", "lines": 512, "final_newline": true, "sha256": "650d29bb5292ebfab96cbdbd0c5349b8641e618c3b8f488b2b27180b37c5d614", "original_sha256": "650d29bb5292ebfab96cbdbd0c5349b8641e618c3b8f488b2b27180b37c5d614"} -->
```python
"""Skills Hub 宣传片配乐：纯 numpy/scipy 合成，节拍网格与画面共用 src/cues.json。

F 小调，120 BPM（一拍 0.5s，一小节 2s）。所有音色都是算出来的，无采样、无版权素材。
输出 out/track.wav（48kHz 立体声 16bit）。

  python3 audio/make-track.py
"""

import json
import os
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = Path(__file__).resolve().parent.parent
CUES = json.loads((ROOT / "src" / "cues.json").read_text(encoding="utf-8"))
OUT = ROOT / "out"

SR = 48000
BPM = CUES["bpm"]
BEAT = 60.0 / BPM
TOTAL_BEATS = CUES["beats"]
N = int(TOTAL_BEATS * BEAT * SR) + SR  # 尾部多留 1s，最后裁掉
RNG = np.random.default_rng(20260815)  # 第一次同步会的日期当种子：结果可复现


def at(beat: float) -> int:
    return int(round(beat * BEAT * SR))


def secs(s: float) -> np.ndarray:
    return np.arange(int(s * SR)) / SR


def midi(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(x: np.ndarray, kind: str, freq, order: int = 2) -> np.ndarray:
    sos = butter(order, freq, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, x, axis=-1)


def sweep_filter(x: np.ndarray, f0: float, f1: float, kind: str = "bandpass", block: int = 512) -> np.ndarray:
    """分块近似时变滤波：中心频率按指数从 f0 走到 f1。"""
    out = np.zeros_like(x)
    nb = max(1, len(x) // block)
    for i in range(nb + 1):
        s, e = i * block, min(len(x), (i + 1) * block)
        if s >= e:
            break
        f = f0 * (f1 / f0) ** (i / max(1, nb))
        if kind == "bandpass":
            band = [max(20.0, f * 0.7), min(SR / 2 - 100, f * 1.4)]
            out[s:e] = filt(x[max(0, s - 2048):e], "bandpass", band)[-(e - s):]
        else:
            out[s:e] = filt(x[max(0, s - 2048):e], kind, min(SR / 2 - 100, f))[-(e - s):]
    return out


class Bus:
    def __init__(self) -> None:
        self.x = np.zeros((2, N))

    def add(self, sig: np.ndarray, beat: float, gain: float = 1.0, pan: float = 0.0) -> None:
        i = at(beat)
        if i >= N:
            return
        if sig.ndim == 1:
            l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
            sig = np.stack([sig * l * 1.414, sig * r * 1.414])
        n = min(sig.shape[1], N - i)
        self.x[:, i:i + n] += sig[:, :n] * gain


drums, bass, music, fx = Bus(), Bus(), Bus(), Bus()

# ---------------------------------------------------------------- 音色


def kick(power: float = 1.0) -> np.ndarray:
    t = secs(0.55)
    f = 44 + 120 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.26 * power))
    click = filt(RNG.standard_normal(len(t)), "highpass", 2500) * np.exp(-t / 0.004) * 0.35
    return np.tanh(1.6 * (body + click)) * power


def heartbeat() -> np.ndarray:
    t = secs(0.7)
    f = 38 + 60 * np.exp(-t / 0.05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)


def snare() -> np.ndarray:
    t = secs(0.35)
    tone = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05) * 0.6
    noise = filt(RNG.standard_normal(len(t)), "bandpass", [1200, 9000]) * np.exp(-t / 0.13)
    return np.tanh(1.3 * (tone + noise))


def clap() -> np.ndarray:
    t = secs(0.4)
    env = np.zeros_like(t)
    for d in (0.0, 0.011, 0.022):
        env += (t >= d) * np.exp(-np.clip(t - d, 0, None) / 0.008)
    env += (t >= 0.03) * np.exp(-np.clip(t - 0.03, 0, None) / 0.14)
    return filt(RNG.standard_normal(len(t)), "bandpass", [900, 4200]) * env * 0.8


def hat(open_: bool = False) -> np.ndarray:
    t = secs(0.45 if open_ else 0.08)
    return filt(RNG.standard_normal(len(t)), "bandpass", [7000, 14000]) * np.exp(-t / (0.22 if open_ else 0.022)) * 0.7


def crash(length: float = 2.6) -> np.ndarray:
    t = secs(length)
    n = filt(RNG.standard_normal(len(t)), "highpass", 3500) * np.exp(-t / 0.9)
    ring = sum(np.sin(2 * np.pi * f * t + RNG.uniform(0, 6)) for f in (3120, 4470, 5310, 6870)) * 0.05
    return (n + ring * np.exp(-t / 0.6)) * 0.7


def sub_boom(length: float = 2.8, f_hi: float = 62, f_lo: float = 32) -> np.ndarray:
    t = secs(length)
    f = f_lo + (f_hi - f_lo) * np.exp(-t / 0.35)
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 1.0))


def saw_additive(freq: float, t: np.ndarray, harmonics: int = 24, bright=None) -> np.ndarray:
    """带限锯齿：谐波叠加，高于奈奎斯特的谐波直接丢弃。bright(k, t) 给每个谐波随时间的包络。"""
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if k * freq > SR / 2 - 1000:
            break
        amp = 1.0 / k
        if bright is not None:
            amp = amp * bright(k, t)
        out += amp * np.sin(2 * np.pi * k * freq * t)
    return out


def pluck(m: float, length: float = 0.45) -> np.ndarray:
    t = secs(length)
    f = midi(m)
    return saw_additive(f, t, 18, lambda k, tt: np.exp(-tt * (6 + 2.2 * k))) * 0.5


def blip(m: float, length: float = 0.18) -> np.ndarray:
    t = secs(length)
    f = midi(m)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.05) * np.minimum(1, t / 0.002)


def stab(notes, length: float = 0.9, bright_decay: float = 0.25) -> np.ndarray:
    t = secs(length)
    out = np.zeros_like(t)
    for m in notes:
        for det in (-0.08, 0.0, 0.08):
            out += saw_additive(midi(m + det), t, 20, lambda k, tt: np.exp(-tt * k / (bright_decay * 12)))
    env = np.minimum(1, t / 0.004) * np.exp(-t / (length * 0.35))
    return np.tanh(out * env * 0.25)


def pad(notes, length: float, attack: float = 0.6, release: float = 0.8, cutoff: float = 2200) -> np.ndarray:
    t = secs(length)
    left, right = np.zeros_like(t), np.zeros_like(t)
    for m in notes:
        for i, det in enumerate((-0.12, -0.04, 0.05, 0.13)):
            v = saw_additive(midi(m + det), t, 14)
            if i % 2:
                left += v
            else:
                right += v
    env = np.minimum(1, t / attack) * np.minimum(1, np.clip(length - t, 0, None) / release)
    sig = np.stack([left, right]) * env * 0.09
    return filt(sig, "lowpass", cutoff)


def bass_note(m: float, length: float, reese: bool = False) -> np.ndarray:
    t = secs(length)
    f = midi(m)
    if reese:
        v = saw_additive(f * 0.994, t, 30) + saw_additive(f * 1.006, t, 30)
        v = np.tanh(filt(v, "lowpass", 900) * 1.4)
    else:
        v = saw_additive(f, t, 16, lambda k, tt: np.exp(-tt * k * 1.5)) + 0.6 * np.sin(2 * np.pi * f * t)
    env = np.minimum(1, t / 0.004) * np.minimum(1, np.clip(length - t, 0, None) / 0.02)
    return v * env * 0.55


def riser(length: float, f0: float = 300, f1: float = 9000) -> np.ndarray:
    t = secs(length)
    n = sweep_filter(RNG.standard_normal(len(t)), f0, f1)
    tone_f = 180 * (12 ** (t / length))
    tone = np.sin(2 * np.pi * np.cumsum(tone_f) / SR) * 0.25
    env = (t / length) ** 2.2
    return (n * 0.9 + tone) * env


def whoosh(length: float = 0.6) -> np.ndarray:
    t = secs(length)
    n = RNG.standard_normal(len(t))
    half = len(t) // 2
    up = sweep_filter(n[:half], 400, 6000)
    down = sweep_filter(n[half:], 6000, 900)
    env = np.sin(np.pi * t / length) ** 2
    return np.concatenate([up, down]) * env * 0.6


def reverse_swell(length: float) -> np.ndarray:
    return crash(length)[::-1] * np.linspace(0, 1, int(length * SR)) ** 1.5


def clack() -> np.ndarray:
    """模块「咔」地插进内核：短噪声 + 非谐金属共振。"""
    t = secs(0.5)
    n = filt(RNG.standard_normal(len(t)), "bandpass", [1500, 7000]) * np.exp(-t / 0.012)
    ring = sum(np.sin(2 * np.pi * f * t) for f in (1860, 2790, 4133)) * np.exp(-t / 0.09) * 0.2
    body = np.sin(2 * np.pi * 95 * t) * np.exp(-t / 0.06) * 0.8
    return n + ring + body


def type_click() -> np.ndarray:
    t = secs(0.03)
    return filt(RNG.standard_normal(len(t)), "bandpass", [2000, 6000]) * np.exp(-t / 0.004) * 0.6


def tom(m: float) -> np.ndarray:
    t = secs(0.6)
    f = midi(m) * (1 + 0.6 * np.exp(-t / 0.03))
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22))


def shimmer(notes, length: float = 3.0) -> np.ndarray:
    t = secs(length)
    out = np.zeros_like(t)
    for i, m in enumerate(notes):
        d = i * 0.06
        tt = np.clip(t - d, 0, None)
        out += (t >= d) * np.sin(2 * np.pi * midi(m) * t) * np.exp(-tt / 1.1) * np.minimum(1, tt / 0.01)
    return out * 0.18


# ---------------------------------------------------------------- 和声

CHORDS = {
    "Fm": [53, 56, 60], "Db": [49, 53, 56], "Ab": [56, 60, 63], "Eb": [51, 55, 58],
    "Bbm": [58, 61, 65], "C": [48, 52, 55], "Abmaj": [56, 60, 63, 67],
}
# 每小节（4 拍）一个和弦，对应 cues.json 的段落
BARS = (
    ["Fm", "Fm"]                                  # intro   b0–8
    + ["Fm", "Db", "Ab", "Eb"]                    # growth  b8–24
    + ["Fm", "Db", "Bbm", "C"]                    # chaos   b24–40
    + ["Fm"]                                      # title   b40–44
    + ["Db", "Ab", "Eb", "Fm", "Db", "Ab", "Eb", "C"]  # system  b44–76
    + ["Fm", "Db", "Ab"]                          # extend  b76–88
    + ["Eb", "C"]                                 # team    b88–96
    + ["Db", "Eb"]                                # beyond  b96–104
    + ["Abmaj", "Abmaj", "Abmaj"]                 # finale  b104–114（落到关系大调：远景）
)


def chord(bar: int):
    return CHORDS[BARS[min(bar, len(BARS) - 1)]]


def root(bar: int) -> int:
    notes = chord(bar)
    return notes[0] - 24 if notes[0] >= 50 else notes[0] - 12


def in_silence(b: float) -> bool:
    return any(s <= b < e for s, e in CUES["silences"])


kicks: list[float] = []


def K(b: float, power: float = 1.0) -> None:
    if in_silence(b):
        return
    drums.add(kick(power), b, 0.95)
    kicks.append(b)


# ---------------------------------------------------------------- 编曲

# intro b0–8：心跳 + 低垫 + 打字声（与画面 typing 同步：b1–b3 键入 21 个字符）
for b in (0, 2, 4, 6):
    drums.add(heartbeat(), b, 0.8)
    drums.add(heartbeat(), b + 0.3, 0.45)
music.add(pad(chord(0), 8 * BEAT + 0.4, attack=2.5, cutoff=900), 0, 0.9)
for i in range(21):
    fx.add(type_click(), 1 + i * (2 / 21) + RNG.uniform(-0.02, 0.02), 0.5, pan=RNG.uniform(-0.3, 0.3))
fx.add(riser(2 * BEAT, 800, 6000), 6, 0.35)

# growth b8–24：四踩进场，卡片每两拍翻倍（上行 blip）
for b in range(8, 24):
    K(b)
    if b >= 12:
        drums.add(hat(), b + 0.5, 0.35, pan=0.2)
    if b >= 16 and b % 2 == 1:
        drums.add(clap(), b, 0.55)
for i, b in enumerate(range(8, 24, 2)):
    fx.add(blip(72 + [0, 3, 7, 12, 15, 19, 24, 27][i]), b, 0.28)
for bar in range(2, 6):
    music.add(pad(chord(bar), 4 * BEAT + 0.3, attack=0.4, cutoff=1800), bar * 4, 0.7)
    notes = chord(bar)
    arp = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[0] + 24]
    for s in range(16):
        b = bar * 4 + s * 0.25
        g = 0.12 + 0.18 * (b - 8) / 16
        music.add(pluck(arp[s % 4] + (12 if s % 8 >= 6 else 0)), b, g, pan=0.35 * np.sin(s))
    for s in range(4):
        bass.add(bass_note(root(bar), BEAT * 0.45), bar * 4 + s + 0.5, 0.6)
for s in range(8):
    drums.add(snare(), 22 + s * 0.25, 0.15 + 0.05 * s)
fx.add(whoosh(1.0), 23, 0.5)

# chaos b24–40：reese 低音、军鼓、切片故障、三记重音「很多 / 很怪 / 没人知道」
drums.add(crash(), 24, 0.6)
fx.add(sub_boom(1.6), 24, 0.6)
for b in range(24, 40):
    K(b, 1.05)
    if b % 2 == 1 and b < 38:
        drums.add(snare(), b, 0.7)
    for s in range(4):
        if not in_silence(b + s * 0.25):
            drums.add(hat(), b + s * 0.25, 0.22 if s % 2 else 0.3, pan=-0.25)
for bar in range(6, 10):
    for s in range(8):
        b = bar * 4 + s * 0.5
        if b < 39.5:
            bass.add(bass_note(root(bar), BEAT * 0.48, reese=True), b, 0.75)
    music.add(pad(chord(bar), 4 * BEAT, attack=0.1, cutoff=1400), bar * 4, 0.55)
for b in (28, 30, 32, 34):
    fx.add(whoosh(0.4), b - 0.35, 0.35)
for b, nm in ((36, "Fm"), (37, "Db"), (38, "C")):
    music.add(stab([n + 12 for n in CHORDS[nm]] + [CHORDS[nm][0]], 0.9), b, 0.6)
    fx.add(sub_boom(0.9, 70, 40), b, 0.55)
for s in range(12):
    drums.add(snare(), 38 + s * 0.125, 0.2 + 0.04 * s)
fx.add(riser(7.5 * BEAT, 250, 11000), 32, 0.6)
fx.add(reverse_swell(1.2), 40 - 1.2 / BEAT, 0.7)

# title b40–44：大冲击 + Logo 微光
drums.add(crash(3.5), 40, 0.9)
fx.add(sub_boom(3.2), 40, 1.0)
music.add(stab([41, 53, 56, 60, 65], 2.2, bright_decay=0.5), 40, 0.75)
music.add(pad(chord(10), 4 * BEAT + 0.8, attack=0.05, release=1.2, cutoff=2600), 40, 0.8)
fx.add(shimmer([77, 80, 84, 89, 92], 3.0), 40.5, 0.8)
fx.add(blip(84, 0.4), 42, 0.25)
fx.add(reverse_swell(0.9), 44 - 0.9 / BEAT, 0.45)

# system b44–76：主律动，四章节每章 8 拍，章首 crash + whoosh
for b in range(44, 76):
    K(b)
    if b % 2 == 1:
        drums.add(clap(), b, 0.6)
    for s in range(4):
        drums.add(hat(open_=(s == 2)), b + s * 0.25, [0.28, 0.16, 0.22, 0.16][s], pan=0.25 if s % 2 else -0.15)
for b in (44, 52, 60, 68):
    drums.add(crash(2.0), b, 0.45)
    fx.add(whoosh(0.6), b - 0.6, 0.4)
for bar in range(11, 19):
    notes = chord(bar)
    music.add(pad(notes, 4 * BEAT + 0.2, attack=0.2, cutoff=2400), bar * 4, 0.6)
    r = root(bar)
    for s in range(16):
        b = bar * 4 + s * 0.25
        m = r + (12 if s % 4 == 2 else 0)
        if s % 4 != 0:
            bass.add(bass_note(m, BEAT * 0.22), b, 0.55)
    arp = [notes[0] + 12, notes[2] + 12, notes[1] + 24, notes[2] + 12]
    for s in range(8):
        music.add(pluck(arp[s % 4], 0.35), bar * 4 + s * 0.5 + 0.25, 0.14, pan=-0.4 if s % 2 else 0.4)
# 链：8 个客户端节点逐拍点亮，上行音阶
for i, b in enumerate(range(52, 60)):
    fx.add(blip([65, 68, 72, 75, 77, 80, 84, 87][i], 0.25), b, 0.25, pan=-0.6 + i * 0.17)
# 看：界面进场
fx.add(whoosh(0.9), 59.6, 0.5)
for b in (61, 63, 65):
    fx.add(blip(89, 0.12), b + 0.5, 0.15)

# extend b76–88：四个接口模块逐拍插入内核
drums.add(crash(2.2), 76, 0.55)
for b in range(76, 88):
    K(b)
    if b % 2 == 1:
        drums.add(clap(), b, 0.55)
    drums.add(hat(), b + 0.5, 0.3)
for b in (77, 79, 81, 83):
    fx.add(clack(), b, 0.7)
    fx.add(sub_boom(0.5, 90, 50), b, 0.35)
for bar in range(19, 22):
    notes = chord(bar)
    music.add(pad(notes, 4 * BEAT + 0.2, attack=0.3, cutoff=2000), bar * 4, 0.6)
    for s in range(16 if bar == 21 else 8):
        step = 0.25 if bar == 21 else 0.5
        music.add(pluck([notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[0] + 24][s % 4], 0.3), bar * 4 + s * step, 0.13)
    for s in range(4):
        bass.add(bass_note(root(bar), BEAT * 0.45), bar * 4 + s + 0.5, 0.55)
fx.add(riser(2 * BEAT, 500, 8000), 86, 0.35)

# team b88–96：轻一点的律动，尾部过门进入远景
drums.add(crash(2.0), 88, 0.45)
for b in range(88, 96):
    K(b, 0.95)
    if b % 2 == 1:
        drums.add(clap(), b, 0.5)
    drums.add(hat(), b + 0.5, 0.26)
    drums.add(hat(), b + 0.75, 0.14)
for bar in (22, 23):
    notes = chord(bar)
    music.add(pad(notes, 4 * BEAT + 0.2, attack=0.2, cutoff=2600), bar * 4, 0.6)
    for s in range(8):
        bass.add(bass_note(root(bar), BEAT * 0.22), bar * 4 + s * 0.5 + 0.25, 0.5)
for i, m in enumerate((45, 43, 41, 38)):
    drums.add(tom(m), 94 + i * 0.5, 0.5)
fx.add(reverse_swell(1.0), 96 - 1.0 / BEAT, 0.6)

# beyond b96–104：远景推进，三记重音「Skills / 连接 / 一切」
drums.add(crash(3.0), 96, 0.8)
fx.add(sub_boom(2.0), 96, 0.8)
for b in range(96, 104):
    K(b, 1.05)
    for s in (0.5,):
        drums.add(tom(40), b + s, 0.25)
for bar in (24, 25):
    notes = chord(bar)
    music.add(pad(notes + [notes[0] + 12], 4 * BEAT + 0.2, attack=0.1, cutoff=3200), bar * 4, 0.75)
    for s in range(16):
        music.add(pluck([notes[0] + 24, notes[1] + 24, notes[2] + 24, notes[1] + 12][s % 4], 0.3), bar * 4 + s * 0.25, 0.14)
    for s in range(8):
        bass.add(bass_note(root(bar), BEAT * 0.45, reese=True), bar * 4 + s * 0.5, 0.45)
for b, nm in ((98, "Db"), (100, "Eb"), (102, "Eb")):
    music.add(stab([n + 12 for n in CHORDS[nm]] + [CHORDS[nm][0]], 1.0), b, 0.5)
    fx.add(sub_boom(1.0, 70, 38), b, 0.55)
fx.add(riser(3.5 * BEAT, 300, 12000), 100, 0.55)
fx.add(reverse_swell(1.0), 104 - 1.0 / BEAT, 0.8)

# finale b104–114：定版冲击，关系大调长音收尾
drums.add(crash(5.0), 104, 1.0)
fx.add(sub_boom(4.0, 60, 30), 104, 1.0)
music.add(stab([44, 56, 60, 63, 67, 72], 3.0, bright_decay=0.6), 104, 0.7)
music.add(pad([44, 56, 60, 63, 67], 10 * BEAT, attack=0.05, release=3.0, cutoff=3000), 104, 0.9)
fx.add(shimmer([80, 84, 87, 91, 96, 99], 4.5), 104.5, 0.9)
fx.add(blip(96, 0.6), 110, 0.12)

# ---------------------------------------------------------------- 混音

t_all = np.arange(N) / SR
side = np.ones(N)
for b in kicks:
    i = at(b)
    n = min(int(0.35 * SR), N - i)
    tt = np.arange(n) / SR
    side[i:i + n] = np.minimum(side[i:i + n], 1 - 0.6 * np.exp(-tt / 0.1))

bass.x *= side
music.x *= side
bass.x = filt(bass.x, "highpass", 30)

dry = drums.x + bass.x * 0.9 + music.x + fx.x * 0.85

ir_t = secs(2.4)
ir = np.stack([
    filt(RNG.standard_normal(len(ir_t)), "lowpass", 5000) * np.exp(-ir_t / 0.55),
    filt(RNG.standard_normal(len(ir_t)), "lowpass", 5000) * np.exp(-ir_t / 0.55),
])
ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
send = music.x * 0.45 + fx.x * 0.5 + drums.x * 0.08
wet = np.stack([fftconvolve(send[c], ir[c])[:N] for c in range(2)]) * 0.55

mix = dry + wet
mix = filt(mix, "highpass", 24)
mix = filt(mix, "lowpass", 15000)

# 静默段：硬切（画面同时黑场）；保留混响尾和反向铺垫，让「吸气」更明显
for s, e in CUES["silences"]:
    i0, i1 = at(s), at(e)
    ramp = np.linspace(1, 0, 240)
    mix[:, i0:i0 + 240] *= ramp
    mix[:, i0 + 240:i1] *= 0.0
    mix[:, i0 + 240:i1] += fx.x[:, i0 + 240:i1] * 0.85 + wet[:, i0 + 240:i1] * 0.4

# 故障切片：把 1/32 拍的碎片重复几遍（混乱段）
for b in (31.5, 35.5, 38.75):
    i = at(b)
    L = int(BEAT / 8 * SR)
    grain = mix[:, i:i + L].copy()
    for r in range(4):
        mix[:, i + r * L:i + (r + 1) * L] = grain * (1 - 0.12 * r)

# 母带：软削波 + 峰值归一
mix = np.tanh(mix * 0.9)
mix = mix[:, : int(TOTAL_BEATS * BEAT * SR)]
fade = int(1.2 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade) ** 2
mix /= np.abs(mix).max() / 0.89

OUT.mkdir(exist_ok=True)
wavfile.write(OUT / "track.wav", SR, (mix.T * 32767).astype(np.int16))

rms = lambda x: 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)  # noqa: E731
print(f"wrote {OUT / 'track.wav'}  {mix.shape[1] / SR:.2f}s  rms={rms(mix):.1f} dBFS")
for sec in CUES["sections"]:
    a, b = at(sec["start"]), at(sec["end"])
    print(f"  {sec['id']:<7} b{sec['start']:>3}-{sec['end']:<3} rms={rms(mix[:, a:b]):6.1f} dBFS")
```

### 4/30 · `promo/package-lock.json`
<!-- casebook-file {"path": "promo/package-lock.json", "lines": 57, "final_newline": true, "sha256": "933cf8c0d44b216b6e1c0e19c493fc6ba04229b2bc7d84f64da813ed9d56c8ea", "original_sha256": "933cf8c0d44b216b6e1c0e19c493fc6ba04229b2bc7d84f64da813ed9d56c8ea"} -->
```json
{
  "name": "skills-hub-promo",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "skills-hub-promo",
      "version": "0.1.0",
      "dependencies": {
        "@fontsource-variable/geist": "5.3.0",
        "@fontsource-variable/geist-mono": "5.3.0",
        "@fontsource-variable/noto-sans-sc": "5.3.0",
        "playwright-core": "1.56.1"
      }
    },
    "node_modules/@fontsource-variable/geist": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource-variable/geist/-/geist-5.3.0.tgz",
      "integrity": "sha512-j0m+vLQuG5XAYoHtGCVu0spvlGreR3EzpECUVzkFmI1mTVnAO38l/NEPDCFgZ177JxzYJCLSmTQibIiYPilGrA==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource-variable/geist-mono": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource-variable/geist-mono/-/geist-mono-5.3.0.tgz",
      "integrity": "sha512-vBbuwDEo9AkrqADMXOrlAR3DFcJi4/JxeuU43FoiQERnNwsfXNnvxvReZG02cQKmyk4DZkZdBZX3oTDvy2zBAw==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/@fontsource-variable/noto-sans-sc": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@fontsource-variable/noto-sans-sc/-/noto-sans-sc-5.3.0.tgz",
      "integrity": "sha512-lNar1dF7Ik/lHNPo/7JWG0TolXY29LtsqYgMvEysooZ5bsO9uH4shJmRrwyJ3PjyTPljhpMJEK0jDuLSU4vJ1w==",
      "license": "OFL-1.1",
      "funding": {
        "url": "https://github.com/sponsors/ayuhito"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.56.1",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.56.1.tgz",
      "integrity": "sha512-hutraynyn31F+Bifme+Ps9Vq59hKuUCz7H1kDOcBs+2oGguKkWTU50bBWrtz34OUWmIwpBTWDxaRPXrIXkgvmQ==",
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=18"
      }
    }
  }
}
```

### 5/30 · `promo/package.json`
<!-- casebook-file {"path": "promo/package.json", "lines": 19, "final_newline": true, "sha256": "c9d825318ef6c209ab18d5601cf00a2defcd9b12bb338a05e67eef9ad3b8b808", "original_sha256": "c9d825318ef6c209ab18d5601cf00a2defcd9b12bb338a05e67eef9ad3b8b808"} -->
```json
{
  "name": "skills-hub-promo",
  "version": "0.1.0",
  "private": true,
  "description": "Skills Hub 宣传片：确定性逐帧渲染的 HTML 舞台 + 合成配乐（不属于 pnpm workspace）",
  "type": "module",
  "scripts": {
    "audio": "python3 audio/make-track.py",
    "preview": "npx http-server src -p 5180 -c-1",
    "render": "node render.mjs",
    "render:draft": "node render.mjs --fps 30 --scale 0.5"
  },
  "dependencies": {
    "@fontsource-variable/geist": "5.3.0",
    "@fontsource-variable/geist-mono": "5.3.0",
    "@fontsource-variable/noto-sans-sc": "5.3.0",
    "playwright-core": "1.56.1"
  }
}
```

### 6/30 · `promo/render.mjs`
<!-- casebook-file {"path": "promo/render.mjs", "lines": 119, "final_newline": true, "sha256": "369b0646f58e0e088d287155ad9b76e5d41b19f0686b0ea67db572f5a47d1f24", "original_sha256": "369b0646f58e0e088d287155ad9b76e5d41b19f0686b0ea67db572f5a47d1f24"} -->
```js
#!/usr/bin/env node
/**
 * 逐帧渲染：起本地静态服务 → Chromium 打开舞台 → 每帧 __seek(t) 截图 → 管道喂给 ffmpeg，混入配乐。
 *
 *   node render.mjs                         # 全片 60fps → out/skills-hub-promo.mp4
 *   node render.mjs --fps 30 --from 20 --to 30
 *   node render.mjs --stills 3,12,21        # 只出静帧到 out/stills/（--dir 可改），用于审片
 *   node render.mjs --theme dark            # 深色版（默认浅色）
 *
 * 环境：CHROME_PATH 覆盖浏览器；FFMPEG 覆盖 ffmpeg（默认找 imageio-ffmpeg 的静态版或 PATH 里的 ffmpeg）。
 */
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "out");
mkdirSync(OUT, { recursive: true });

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : "1"]);
    return acc;
  }, []),
);

const cues = JSON.parse(readFileSync(path.join(ROOT, "src", "cues.json"), "utf8"));
const DURATION = (cues.beats * 60) / cues.bpm;
const fps = Number(args.fps ?? cues.fps);
const from = Number(args.from ?? 0);
const to = Math.min(DURATION, Number(args.to ?? DURATION));
const outFile = path.resolve(args.out ?? path.join(OUT, "skills-hub-promo.mp4"));

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const guesses = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/usr/bin/chromium", "/usr/bin/google-chrome"];
  return guesses.find((p) => existsSync(p));
}

function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    return execFileSync("python3", ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"]).toString().trim();
  } catch {
    return "ffmpeg";
  }
}

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".wav": "audio/wav", ".svg": "image/svg+xml" };
const server = createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(ROOT) || !existsSync(p)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const browser = await chromium.launch({
  executablePath: findChrome(),
  args: ["--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb", "--hide-scrollbars"],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("[page]", e.message));
page.on("console", (m) => m.type() === "error" && console.error("[console]", m.text()));
await page.goto(`http://127.0.0.1:${port}/src/index.html${args.theme ? `?theme=${args.theme}` : ""}`);
await page.waitForFunction(() => globalThis.__ready === true, null, { timeout: 60000 });
const cdp = await page.context().newCDPSession(page);

async function grab(t, format = "jpeg") {
  await page.evaluate((tt) => globalThis.__seek(tt), t);
  const { data } = await cdp.send("Page.captureScreenshot", { format, quality: format === "jpeg" ? 94 : undefined, captureBeyondViewport: false });
  return Buffer.from(data, "base64");
}

if (args.stills) {
  const dir = path.resolve(args.dir ?? path.join(OUT, "stills"));
  mkdirSync(dir, { recursive: true });
  for (const s of String(args.stills).split(",")) {
    const t = Number(s);
    writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(6, "0")}.png`), await grab(t, "png"));
    console.log("still", t);
  }
} else {
  const ffmpeg = findFfmpeg();
  const track = path.join(OUT, "track.wav");
  const withAudio = existsSync(track) && !args.mute;
  const ff = spawn(ffmpeg, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    ...(withAudio ? ["-ss", String(from), "-t", String(to - from), "-i", track] : []),
    "-c:v", "libx264", "-preset", args.preset ?? "slow", "-crf", args.crf ?? "15", "-pix_fmt", "yuv420p",
    "-profile:v", "high", "-movflags", "+faststart",
    ...(withAudio ? ["-c:a", "aac", "-b:a", "256k", "-shortest"] : []),
    outFile,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const frames = Math.round((to - from) * fps);
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const buf = await grab(from + i / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % fps === 0) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`\rframe ${i}/${frames}  ${(i / Math.max(el, 0.001)).toFixed(1)} fps  eta ${(((frames - i) * el) / Math.max(i, 1)).toFixed(0)}s   `);
    }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log(`\nwrote ${outFile}`);
}

await browser.close();
server.close();
```

### 7/30 · `promo/src/cues.json`
<!-- casebook-file {"path": "promo/src/cues.json", "lines": 21, "final_newline": true, "sha256": "d7c0b67e64c023d8421ce72a603df62fbec484e8057fa4e10d09dce918a561c0", "original_sha256": "d7c0b67e64c023d8421ce72a603df62fbec484e8057fa4e10d09dce918a561c0"} -->
```json
{
  "bpm": 120,
  "beats": 114,
  "fps": 60,
  "sections": [
    { "id": "intro",  "start": 0,   "end": 8,   "title": "起初，只是一个文件夹" },
    { "id": "growth", "start": 8,   "end": 24,  "title": "一个，十个，一百个" },
    { "id": "chaos",  "start": 24,  "end": 40,  "title": "很多，很怪，没人知道" },
    { "id": "title",  "start": 40,  "end": 44,  "title": "Skills Hub" },
    { "id": "store",  "start": 44,  "end": 52,  "title": "收 · 内容哈希去重" },
    { "id": "link",   "start": 52,  "end": 60,  "title": "链 · 一处修改全局生效" },
    { "id": "see",    "start": 60,  "end": 68,  "title": "看 · 一个地方统一看" },
    { "id": "share",  "start": 68,  "end": 76,  "title": "享 · 授信仓库 + Agent" },
    { "id": "extend", "start": 76,  "end": 88,  "title": "为扩展而建" },
    { "id": "team",   "start": 88,  "end": 96,  "title": "每个人在用什么" },
    { "id": "beyond", "start": 96,  "end": 104, "title": "Skills 连接一切" },
    { "id": "finale", "start": 104, "end": 114, "title": "Logo 定版" }
  ],
  "impacts": [40, 96, 104],
  "silences": [[39.5, 40], [103.5, 104]]
}
```

### 8/30 · `promo/src/index.html`
<!-- casebook-file {"path": "promo/src/index.html", "lines": 20, "final_newline": true, "sha256": "a2fd33448c472b1e30351b932244b99400476b28561a65f7d77a8391c7740491", "original_sha256": "a2fd33448c472b1e30351b932244b99400476b28561a65f7d77a8391c7740491"} -->
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>Skills Hub — Film</title>
    <link rel="icon" href="data:," />
    <link rel="stylesheet" href="./styles/tokens.css" />
    <link rel="stylesheet" href="./styles/ui.css" />
    <link rel="stylesheet" href="./styles/stage.css" />
  </head>
  <body>
    <div id="stage">
      <canvas id="bg" width="1920" height="1080"></canvas>
      <div id="world"></div>
      <canvas id="fx" width="1920" height="1080"></canvas>
      <div id="post"></div>
    </div>
    <script type="module" src="./js/main.js"></script>
  </body>
</html>
```

### 9/30 · `promo/src/js/data.js`
<!-- casebook-file {"path": "promo/src/js/data.js", "lines": 91, "final_newline": true, "sha256": "b381a912253ca3db59db9ebb3a3dff164d890b674aa8ba34332b116626b5d8ea", "original_sha256": "b381a912253ca3db59db9ebb3a3dff164d890b674aa8ba34332b116626b5d8ea"} -->
```js
// 片中出现的真实数据。
// skill 名：公开仓库里真实存在的技能（anthropics/skills、obra/superpowers、vercel-labs、remotion-dev），
// 以及项目自己的真机扫描报告 docs/audits/skills-full-scan-2026-08-16.md 里出现的名字。
// 数字：同一份扫描报告（27 个目录 / 581 份副本 / 213 个唯一 skill / demo-init ×26）。

export const SOURCES = {
  anthropic: { label: "anthropics/skills", color: "#e0845e" },
  superpowers: { label: "obra/superpowers", color: "#a293ff" },
  vercel: { label: "vercel-labs/agent-skills", color: "#d4d4d8" },
  remotion: { label: "remotion-dev/skills", color: "#5ad7ff" },
  local: { label: "本机自建", color: "#c8f53c" },
  club: { label: "club/skills", color: "#ffb547" },
};

export const SKILLS = [
  ["pptx", "anthropic", "创建、编辑和分析 PowerPoint 演示文稿"],
  ["frontend-design", "anthropic", "做出有设计感、不像模板的前端界面"],
  ["systematic-debugging", "superpowers", "先找根因，再动手修 bug"],
  ["skill-creator", "anthropic", "创建、评测、迭代新的 skill"],
  ["vercel-react-best-practices", "vercel", "React / Next.js 性能最佳实践"],
  ["brainstorming", "superpowers", "动手之前先把需求聊透"],
  ["docx", "anthropic", "读写 Word 文档与修订"],
  ["mcp-builder", "anthropic", "构建高质量的 MCP 服务器"],
  ["test-driven-development", "superpowers", "先写失败的测试，再写实现"],
  ["web-design-guidelines", "vercel", "按界面规范审查页面"],
  ["xlsx", "anthropic", "表格读写、公式与清洗"],
  ["find-skills", "vercel", "在 skills.sh 上找现成的 skill"],
  ["pdf", "anthropic", "PDF 提取、合并、填表"],
  ["writing-plans", "superpowers", "把需求拆成可执行的计划"],
  ["remotion-best-practices", "remotion", "用 Remotion 写视频的最佳实践"],
  ["webapp-testing", "anthropic", "用 Playwright 测本地 Web 应用"],
  ["canvas-design", "anthropic", "海报与静态视觉设计"],
  ["executing-plans", "superpowers", "按计划分批执行并回报"],
  ["using-git-worktrees", "superpowers", "隔离的 git worktree 工作区"],
  ["algorithmic-art", "anthropic", "p5.js 生成艺术"],
  ["requesting-code-review", "superpowers", "提交前请求代码审查"],
  ["theme-factory", "anthropic", "给产物套主题"],
  ["subagent-driven-development", "superpowers", "子代理并行推进开发"],
  ["brand-guidelines", "anthropic", "品牌色与字体规范"],
  ["vercel-composition-patterns", "vercel", "React 组合模式"],
  ["verification-before-completion", "superpowers", "宣布完成之前先验证"],
  ["web-artifacts-builder", "anthropic", "多组件 Web 产物"],
  ["slack-gif-creator", "anthropic", "为 Slack 做动图"],
  ["internal-comms", "anthropic", "内部沟通文稿"],
  ["doc-coauthoring", "anthropic", "结构化协作写文档"],
  ["dispatching-parallel-agents", "superpowers", "把独立任务分派给并行代理"],
  ["writing-skills", "superpowers", "写出好用的 skill"],
  ["hyperframes", "local", "HTML 视频合成"],
  ["faceless-explainer", "local", "无出镜讲解视频"],
  ["concept-keeper", "local", "概念与术语看护"],
  ["demo-init", "local", "演示项目初始化"],
  ["distributing-skills-across-local-agents", "local", "把 skill 分发到本机各 Agent"],
  ["creating-formal-reports-from-software-products", "local", "从软件产品生成正式报告"],
  ["react-native-skills", "vercel", "React Native 开发"],
  ["finishing-a-development-branch", "superpowers", "收尾一个开发分支"],
];

export const CLIENTS = [
  { id: "claude", name: "Claude Code", path: "~/.claude/skills", color: "#e0845e" },
  { id: "codex", name: "Codex", path: "~/.codex/skills", color: "#3f3f46" },
  { id: "cursor", name: "Cursor", path: "~/.cursor/skills", color: "#8b919b" },
  { id: "gemini", name: "Gemini CLI", path: "~/.gemini/skills", color: "#5ad7ff" },
  { id: "trae", name: "Trae", path: "~/.trae/skills", color: "#ff6f91" },
  { id: "windsurf", name: "Windsurf", path: "~/.windsurf/skills", color: "#6ee7a8" },
  { id: "kiro", name: "Kiro", path: "~/.kiro/skills", color: "#a293ff" },
  { id: "opencode", name: "OpenCode", path: "~/.config/opencode/skills", color: "#ffb547" },
];

// 扫描报告里的 27 个 root（按报告出现的客户端 id 还原成路径）
export const ROOTS = [
  "~/.agents/skills", "~/.claude/skills", "~/.codex/skills", "~/.cursor/skills", "~/.gemini/skills",
  "~/.trae/skills", "~/.trae-cn/skills", "~/.windsurf/skills", "~/.kiro/skills", "~/.qoder/skills",
  "~/.qoder-cn/skills", "~/.qoderworkcn/skills", "~/.cline/skills", "~/.codebuddy/skills", "~/.continue/skills",
  "~/.copilot/skills", "~/.devin/skills", "~/.grok/skills", "~/.openclaw/skills", "~/.quickwork/skills",
  "~/.workbuddy/skills", "~/.0-1-cli/skills", "~/.hub/skills", "~/.config/opencode/skills",
  "~/.cursor/skills-cursor", "~/.gemini/antigravity/skills", "~/.codeium/windsurf/skills",
];

export const SCAN = { roots: 27, copies: 581, unique: 213, demoInit: 26 };

export const TEAM = [
  { handle: "@mio", role: "前端", color: "#c8f53c", n: 34, pins: ["frontend-design", "vercel-react-best-practices", "web-design-guidelines"] },
  { handle: "@kaze", role: "后端", color: "#5ad7ff", n: 27, pins: ["systematic-debugging", "mcp-builder", "test-driven-development"] },
  { handle: "@yuki", role: "设计", color: "#ffb547", n: 22, pins: ["canvas-design", "theme-factory", "brand-guidelines"] },
  { handle: "@sora", role: "算法", color: "#a293ff", n: 31, pins: ["xlsx", "writing-plans", "pdf"] },
];

export function glyphOf(name) {
  const parts = name.split("-");
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}
```

### 10/30 · `promo/src/js/engine.js`
<!-- casebook-file {"path": "promo/src/js/engine.js", "lines": 156, "final_newline": true, "sha256": "cc8ce2b1fa753fda8802cb0a52c96fbd16cfda3542f2076a3429931ef960f87b", "original_sha256": "cc8ce2b1fa753fda8802cb0a52c96fbd16cfda3542f2076a3429931ef960f87b"} -->
```js
// 确定性时间线引擎：画面是 t（秒）的纯函数。渲染器逐帧 seek，预览模式跟随音频。

export const W = 1920;
export const H = 1080;

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mix = lerp;

export const E = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  inExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutExpo: (t) =>
    t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  outBack: (t) => {
    const c1 = 1.9;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  // 阻尼弹簧：到 1 后有一次小回弹
  spring: (t) => 1 - Math.exp(-7 * t) * Math.cos(10 * t),
};

/** b 在 [b0,b1] 内的归一化进度，带缓动。 */
export const prog = (b, b0, b1, ease = E.linear) => ease(clamp((b - b0) / (b1 - b0)));

/** 进入—停留—退出 的可见度：[inStart,inEnd] 淡入，[outStart,outEnd] 淡出。 */
export function life(b, inStart, inEnd, outStart, outEnd, easeIn = E.outCubic, easeOut = E.inCubic) {
  if (b < inStart || b > outEnd) return 0;
  if (b < inEnd) return easeIn(clamp((b - inStart) / (inEnd - inStart)));
  if (b > outStart) return 1 - easeOut(clamp((b - outStart) / (outEnd - outStart)));
  return 1;
}

/** 关键帧：frames = [[beat, value, ease?], ...]，ease 作用于该帧到下一帧的区间。 */
export function kf(b, frames) {
  if (b <= frames[0][0]) return frames[0][1];
  for (let i = 0; i < frames.length - 1; i++) {
    const [b0, v0, ease = E.inOutCubic] = frames[i];
    const [b1, v1] = frames[i + 1];
    if (b <= b1) {
      const t = ease(clamp((b - b0) / (b1 - b0)));
      return Array.isArray(v0) ? v0.map((x, j) => lerp(x, v1[j], t)) : lerp(v0, v1, t);
    }
  }
  return frames[frames.length - 1][1];
}

/** 冲击包络：命中后按指数衰减，用于闪白 / 震屏 / 发光。 */
export function hit(b, at, decay = 0.35) {
  if (b < at) return 0;
  return Math.exp(-(b - at) / decay);
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 稳定的伪哈希（片中展示用，真实产品是 sha256 文件夹哈希）。 */
export function fakeHash(text, len = 12) {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  let out = "";
  while (out.length < len) {
    for (let i = 0; i < text.length; i++) {
      h1 = Math.imul(h1 ^ text.charCodeAt(i), 16777619) >>> 0;
      h2 = Math.imul(h2 ^ (text.charCodeAt(i) + out.length), 2246822507) >>> 0;
    }
    out += ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0");
    text += out;
  }
  return out.slice(0, len);
}

/** 建 DOM：el("div", "a b", parent, html) */
export function el(tag, cls, parent, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  if (parent) parent.appendChild(n);
  return n;
}

const styleCache = new WeakMap();
/** 只在值变化时写 style，逐帧调用也不抖。 */
export function css(node, props) {
  let c = styleCache.get(node);
  if (!c) {
    c = {};
    styleCache.set(node, c);
  }
  for (const k in props) {
    const v = props[k];
    if (c[k] !== v) {
      c[k] = v;
      if (k.startsWith("--")) node.style.setProperty(k, v);
      else node.style[k] = v;
    }
  }
}

export function toggle(node, cls, on) {
  if (node.classList.contains(cls) !== on) node.classList.toggle(cls, on);
}

/** 拆字，返回每个字的 span（空格保留宽度）。 */
export function split(parent, text, cls = "ch") {
  const out = [];
  for (const c of text) {
    const s = el("span", cls, parent);
    s.textContent = c === " " ? " " : c;
    out.push(s);
  }
  return out;
}

/** 逐字模糊显影：字从 blur+下沉 到清晰，stagger 以拍计。 */
export function revealChars(chars, b, start, stagger = 0.04, dur = 0.5, out = null) {
  chars.forEach((c, i) => {
    const p = prog(b, start + i * stagger, start + i * stagger + dur, E.outCubic);
    let o = p;
    let y = (1 - p) * 0.35;
    let blur = (1 - p) * 14;
    if (out) {
      const q = prog(b, out[0] + i * (out[2] ?? 0.02), out[1] + i * (out[2] ?? 0.02), E.inCubic);
      o *= 1 - q;
      y -= q * 0.3;
      blur += q * 10;
    }
    css(c, { opacity: o.toFixed(3), transform: `translateY(${y.toFixed(3)}em)`, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none" });
  });
}

/** 数字滚动。 */
export const rollNum = (b, b0, b1, from, to, ease = E.outExpo) => Math.round(lerp(from, to, prog(b, b0, b1, ease)));

export function svg(tag, attrs, parent) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
```

### 11/30 · `promo/src/js/fx.js`
<!-- casebook-file {"path": "promo/src/js/fx.js", "lines": 159, "final_newline": true, "sha256": "341f5a738572b0c3eccaef523ce266fa1a80b2cd7986de37abd5295b6254c735", "original_sha256": "341f5a738572b0c3eccaef523ce266fa1a80b2cd7986de37abd5295b6254c735"} -->
```js
// 片中特效：故障字、粒子爆发、星空、冲击环。全部是 (b, frame) 的纯函数。
import { T } from "./theme.js";
import { E, W, H, clamp, css, el, rng } from "./engine.js";

/** 故障字：主层 + 红青色散层 + 横向切片层。 */
/** onDark：这段文字压在深色底上（反相镜头），色散层改用 screen。 */
export function glitchText(parent, html, cls = "", onDark = T.name === "dark") {
  const root = el("div", `glitch ${cls}`, parent);
  root.style.position = "relative";
  root.style.display = "inline-block";
  const main = el("div", "", root, html);
  main.style.position = "relative";
  const mk = (color, blend) => {
    const n = el("div", "", root, html);
    n.style.cssText = `position:absolute;inset:0;color:${color};mix-blend-mode:${blend};opacity:0;`;
    return n;
  };
  const pair = onDark ? [["#ff2a4d", "screen"], ["#2af0ff", "screen"]] : T.glitch;
  const red = mk(pair[0][0], pair[0][1]);
  const cyan = mk(pair[1][0], pair[1][1]);
  const slices = [];
  for (let i = 0; i < 6; i++) {
    const s = el("div", "", root, html);
    const top = (i / 6) * 100;
    s.style.cssText = `position:absolute;inset:0;clip-path:inset(${top}% 0 ${100 - top - 100 / 6}% 0);opacity:0;`;
    slices.push(s);
  }
  return { root, main, red, cyan, slices };
}

export function updateGlitch(g, amount, frame, seed = 1) {
  const r = rng(frame * 7919 + seed * 104729);
  const a = clamp(amount, 0, 2);
  const off = a * 14;
  css(g.red, { opacity: a > 0.02 ? "0.9" : "0", transform: `translate(${(-off - r() * off).toFixed(1)}px, ${(r() - 0.5) * off * 0.3}px)` });
  css(g.cyan, { opacity: a > 0.02 ? "0.9" : "0", transform: `translate(${(off + r() * off).toFixed(1)}px, ${(r() - 0.5) * off * 0.3}px)` });
  const sliceOn = a > 0.15;
  g.slices.forEach((s) => {
    const on = sliceOn && r() < 0.35 + a * 0.3;
    css(s, { opacity: on ? "1" : "0", transform: on ? `translateX(${((r() - 0.5) * a * 120).toFixed(1)}px)` : "none" });
  });
  css(g.main, { opacity: sliceOn && r() < a * 0.15 ? "0.2" : "1" });
}

/** 粒子爆发：预生成参数，按时间推进。 */
export function makeBurst(seed, count = 160, opts = {}) {
  const r = rng(seed);
  const colors = opts.colors ?? T.burst;
  return Array.from({ length: count }, () => {
    const a = r() * Math.PI * 2;
    return {
      a,
      v: (opts.speed ?? 900) * (0.25 + r() * 0.95),
      life: (opts.life ?? 1.6) * (0.4 + r() * 0.8),
      size: (opts.size ?? 2.6) * (0.4 + r()),
      color: colors[Math.floor(r() * colors.length)],
      streak: r() < 0.5,
    };
  });
}

export function drawBurst(ctx, parts, b, at, x, y, beatSec = 0.5) {
  const tt = b - at;
  if (tt < 0) return;
  for (const p of parts) {
    if (tt > p.life) continue;
    const k = tt / p.life;
    const d = p.v * E.outExpo(clamp(tt / p.life)) * p.life * beatSec;
    const px = x + Math.cos(p.a) * d;
    const py = y + Math.sin(p.a) * d;
    ctx.globalAlpha = (1 - k) * (1 - k);
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color;
    if (p.streak) {
      const back = 22 * (1 - k);
      ctx.lineWidth = p.size * 0.7;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - Math.cos(p.a) * back, py - Math.sin(p.a) * back);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(px, py, p.size * (1 - k * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

export function drawRing(ctx, b, at, x, y, maxR = 1200, dur = 1.2, color = T.accentRGB, width = 3) {
  const tt = (b - at) / dur;
  if (tt < 0 || tt > 1) return;
  const r = maxR * E.outExpo(tt);
  ctx.strokeStyle = `rgba(${color},${(1 - tt) * 0.9})`;
  ctx.lineWidth = width * (1 - tt) + 0.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

/** 星空：z 随时间向镜头推进，speed 可按段落变化（曲速感）。 */
export function makeStars(seed, n = 900) {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({ x: (r() - 0.5) * 4000, y: (r() - 0.5) * 2400, z: r(), m: 0.4 + r() * 0.8 }));
}

export function drawStars(ctx, stars, travel, alpha = 1, streak = 0) {
  const depth = 1;
  for (const s of stars) {
    let z = (s.z - travel) % depth;
    if (z <= 0) z += depth;
    const zz = 0.05 + z * 1.6;
    const px = W / 2 + s.x / zz / 2.2;
    const py = H / 2 + s.y / zz / 2.2;
    if (px < -50 || px > W + 50 || py < -50 || py > H + 50) continue;
    const bright = clamp((1 - z) * 1.2) * alpha * s.m;
    if (bright < 0.02) continue;
    ctx.globalAlpha = bright;
    ctx.fillStyle = T.star;
    if (streak > 0.01) {
      const zb = zz + streak * 0.25;
      const bx = W / 2 + s.x / zb / 2.2;
      const by = H / 2 + s.y / zb / 2.2;
      ctx.strokeStyle = T.star;
      ctx.lineWidth = 1.2 * (1.4 - z);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(px, py);
      ctx.stroke();
    } else {
      const size = 1.6 * (1.3 - z);
      ctx.fillRect(px, py, size, size);
    }
  }
  ctx.globalAlpha = 1;
}

/** 预生成颗粒噪声帧，逐帧轮换。黑白两色 + 低透明度，普通混合即可，不依赖 mix-blend-mode。 */
export function makeGrain(count = 8, w = 960, h = 540) {
  const frames = [];
  const r = rng(99);
  for (let i = 0; i < count; i++) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    const img = g.createImageData(w, h);
    for (let p = 0; p < img.data.length; p += 4) {
      const v = r() < 0.5 ? 0 : 255;
      img.data[p] = v;
      img.data[p + 1] = v;
      img.data[p + 2] = v;
      img.data[p + 3] = Math.floor(r() * r() * 60);
    }
    g.putImageData(img, 0, 0);
    frames.push(c);
  }
  return frames;
}
```

### 12/30 · `promo/src/js/main.js`
<!-- casebook-file {"path": "promo/src/js/main.js", "lines": 186, "final_newline": true, "sha256": "7565d9db9005f3dd881d9ad33e4abaa0040669ab9211daf35da95893557dbcb3", "original_sha256": "7565d9db9005f3dd881d9ad33e4abaa0040669ab9211daf35da95893557dbcb3"} -->
```js
// 舞台入口：挂载所有场景，提供 window.__seek(t) 给逐帧渲染器；?play 时跟随音频实时预览。
import { T } from "./theme.js";
import { E, H, W, clamp, css, el, hit, prog, rng } from "./engine.js";
import { makeGrain } from "./fx.js";
import intro from "./scenes/intro.js";
import growth from "./scenes/growth.js";
import chaos from "./scenes/chaos.js";
import title from "./scenes/title.js";
import store from "./scenes/store.js";
import link from "./scenes/link.js";
import see from "./scenes/see.js";
import share from "./scenes/share.js";
import extend from "./scenes/extend.js";
import team from "./scenes/team.js";
import beyond from "./scenes/beyond.js";
import finale from "./scenes/finale.js";

const SCENES = [intro, growth, chaos, title, store, link, see, share, extend, team, beyond, finale];

const cues = await fetch("./cues.json").then((r) => r.json());
const BEAT = 60 / cues.bpm;
const FPS = cues.fps;

const stage = document.getElementById("stage");
const world = document.getElementById("world");
const bgC = document.getElementById("bg");
const fxC = document.getElementById("fx");
const bg = bgC.getContext("2d");
const fx = fxC.getContext("2d");
const post = document.getElementById("post");

const vignette = el("div", "", post);
vignette.id = "vignette";
const grain = el("canvas", "", post);
grain.id = "grain";
grain.width = 960;
grain.height = 540;
const grainCtx = grain.getContext("2d");
const grainFrames = makeGrain();
const flare = el("div", "", post);
flare.id = "flare";
const bars = el("div", "", post);
bars.id = "bars";
const barTop = el("i", "", bars);
const barBot = el("i", "", bars);
const flash = el("div", "", post);
flash.id = "flash";
const black = el("div", "", post);
black.style.cssText = "position:absolute;inset:0;background:#000;opacity:0;";

// 信箱里的「拉片」信息：影片前 40 拍是「过去」，带时间码；冲击之后信箱打开，进入产品时代
const hud = el("div", "", post);
hud.id = "hud";
const hudTL = el("div", "", hud);
const hudTR = el("div", "", hud);
const hudBL = el("div", "", hud);
const hudBR = el("div", "", hud);
[hudTL, hudTR, hudBL, hudBR].forEach((n, i) => {
  n.style.cssText = `position:absolute;${i % 2 ? "right" : "left"}:64px;${i < 2 ? "top" : "bottom"}:56px;font-family:var(--sh-mono);font-size:13px;letter-spacing:.14em;color:#5c6470;white-space:nowrap;`;
});
hudTL.textContent = "SKILL-HUB · FIRST SYNC · 2026.08.15";

for (const sc of SCENES) {
  sc.root = el("div", `scene scene-${sc.id}`, world);
  sc.mount(sc.root);
}

const SHAKES = [
  [8, 0.4], [24, 1], [25, 0.6], [26, 0.6], [31.5, 0.5], [36, 1.1], [37, 1.1], [38, 1.3],
  [40, 1.6], [44, 0.4], [52, 0.3], [60, 0.3], [68, 0.3], [77, 0.5], [79, 0.5], [81, 0.5], [83, 0.5],
  [96, 1.1], [98, 0.7], [100, 0.7], [102, 0.8], [104, 1.4],
];
const FLASHES = [[8, 0.25], [24, 0.5], [40, 1], [44, 0.25], [96, 0.7], [104, 1]];
const FLARES = [[24, 540, 0.6], [40, 470, 1], [96, 540, 0.8], [104, 375, 1]];

function timecode(t) {
  const f = Math.floor((t % 1) * 24);
  const s = Math.floor(t);
  return `TC 00:00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

let lastFrame = -1;
export function render(t) {
  const b = t / BEAT;
  const frame = Math.round(t * FPS);
  bg.clearRect(0, 0, W, H);
  fx.clearRect(0, 0, W, H);
  const ctx = { b, t, frame, bg, fx };

  for (const sc of SCENES) {
    const on = b >= sc.start - (sc.pre ?? 0) && b < sc.end + (sc.post ?? 0);
    if (sc.root.classList.contains("is-on") !== on) sc.root.classList.toggle("is-on", on);
    if (on) sc.update(b, ctx);
  }

  // 震屏
  let amp = 0;
  for (const [at, a] of SHAKES) amp += a * hit(b, at, 0.18);
  const r = rng(frame * 31 + 7);
  const sx = (r() - 0.5) * 36 * amp;
  const sy = (r() - 0.5) * 24 * amp;
  const rot = (r() - 0.5) * 1.2 * amp;
  css(world, { transform: amp > 0.01 ? `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px) rotate(${rot.toFixed(3)}deg)` : "none" });
  css(fxC, { transform: amp > 0.01 ? `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)` : "none" });

  let fl = 0;
  for (const [at, a] of FLASHES) fl = Math.max(fl, a * hit(b, at, 0.1));
  css(flash, { opacity: fl.toFixed(3) });

  let flr = 0;
  let flrY = 540;
  for (const [at, y, a] of FLARES) {
    const v = a * hit(b, at, 0.5);
    if (v > flr) {
      flr = v;
      flrY = y;
    }
  }
  css(flare, { opacity: flr.toFixed(3), top: `${flrY}px`, transform: `scaleX(${(0.6 + 0.6 * flr).toFixed(3)}) scaleY(${(1 + 2 * flr).toFixed(2)})` });

  const silent = cues.silences.some(([a, z]) => b >= a && b < z);
  css(black, { opacity: silent ? "1" : "0" });

  // 信箱：b0–40 合上，b40 冲击时打开
  const barH = 140 * (1 - prog(b, 40, 40.8, E.outExpo));
  css(barTop, { height: `${barH.toFixed(1)}px` });
  css(barBot, { height: `${barH.toFixed(1)}px` });
  const hudOn = b < 40 ? 1 : 0;
  css(hud, { opacity: String(hudOn) });
  if (hudOn) {
    const sec = cues.sections.find((x) => b >= x.start && b < x.end);
    const idx = cues.sections.indexOf(sec) + 1;
    hudTR.textContent = `SCENE ${String(idx).padStart(2, "0")} — ${sec.id.toUpperCase()}`;
    hudBL.textContent = timecode(t);
    hudBR.innerHTML = `<span style="color:${b % 1 < 0.5 ? "#ff5a5a" : "#5c6470"}">●</span> REC`;
  }

  if (frame !== lastFrame) {
    grainCtx.clearRect(0, 0, 960, 540);
    grainCtx.drawImage(grainFrames[frame % grainFrames.length], 0, 0);
    lastFrame = frame;
  }
  css(grain, { opacity: ((T.name === "dark" ? 0.7 : 0.5) + 0.3 * clamp(amp)).toFixed(3) });
}

// 字体：隐藏场景是 display:none，不会触发加载，这里按全部文字显式预载
async function loadFonts() {
  const text = world.textContent + "0123456789×→·#$";
  const loads = [];
  for (const w of [400, 500, 600, 700, 800, 900]) {
    loads.push(document.fonts.load(`${w} 40px "Noto Sans SC Variable"`, text));
    loads.push(document.fonts.load(`${w} 40px "Geist Variable"`, text));
    loads.push(document.fonts.load(`${w} 40px "Geist Mono Variable"`, text));
  }
  loads.push(document.fonts.load('600 20px "Noto Sans SC Variable"', "前端组后端组设计组算法组社团企业团队开源世界"));
  await Promise.all(loads);
  await document.fonts.ready;
}

await loadFonts();

window.__cues = cues;
window.__seek = (t) => {
  render(t);
  return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => res(true))));
};
window.__ready = true;

// 预览：?play 跟随音频；?t=秒 定格
const params = new URLSearchParams(location.search);
if (params.has("play")) {
  const audio = new Audio("../out/track.wav");
  audio.currentTime = Number(params.get("t") ?? 0);
  const start = () => {
    audio.play();
    const loop = () => {
      render(audio.currentTime);
      requestAnimationFrame(loop);
    };
    loop();
  };
  stage.addEventListener("click", start, { once: true });
  render(audio.currentTime);
} else {
  render(Number(params.get("t") ?? 0));
}
```

### 13/30 · `promo/src/js/scenes/beyond.js`
<!-- casebook-file {"path": "promo/src/js/scenes/beyond.js", "lines": 183, "final_newline": true, "sha256": "b60bc9962835d74d360f0dfc538d11c175185b27eb86ba5ee8f92d50128b8a0b", "original_sha256": "b60bc9962835d74d360f0dfc538d11c175185b27eb86ba5ee8f92d50128b8a0b"} -->
```js
// b96–104 跨次元：界面坍缩成点，长成一颗 skill 星球，再拉远成团队星系 —— Skills 连接一切。
import { T } from "../theme.js";
import { SKILLS } from "../data.js";
import { E, W, H, clamp, css, el, kf, prog, rng } from "../engine.js";
import { drawRing, drawStars, makeStars } from "../fx.js";

let s;

function fib(n, r) {
  const pts = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    pts.push([Math.cos(g * i) * rad * r, y * r, Math.sin(g * i) * rad * r]);
  }
  return pts;
}

function makeWorld() {
  const r = rng(96);
  const main = { c: [0, 0, 0], R: 380, pts: fib(1100, 1), arcs: [] };
  for (let i = 0; i < 80; i++) main.arcs.push([Math.floor(r() * 1100), Math.floor(r() * 1100), r(), r() < 0.7 ? T.arc[0] : r() < 0.5 ? T.arc[1] : T.arc[2]]);
  const names = ["前端组", "后端组", "设计组", "算法组", "社团", "企业团队", "开源世界"];
  const sats = names.map((name, i) => {
    const a = (i / names.length) * Math.PI * 2 + 0.4;
    const d = 1350 + r() * 350;
    return { name, c: [Math.cos(a) * d, Math.sin(a) * d * 0.55, (r() - 0.5) * 600], R: 120 + r() * 90, pts: fib(260, 1), arcs: [], spin: r() * 6 };
  });
  return { main, sats, labels: SKILLS.map((x) => x[0]) };
}

/** 画一颗点阵球。z 为镜头缩放，alpha 为整体透明度。 */
function drawSphere(g, sph, yaw, pitch, z, cx, cy, alpha, labels = null, arcP = 1) {
  const cyw = Math.cos(yaw);
  const syw = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const proj = (p) => {
    const x = p[0] * cyw - p[2] * syw;
    let zz = p[0] * syw + p[2] * cyw;
    const y = p[1] * cp - zz * sp;
    zz = p[1] * sp + zz * cp;
    const f = 1.6 / (1.6 - zz * 0.35);
    return [cx + (sph.c[0] + x * sph.R * f) * z, cy + (sph.c[1] + y * sph.R * f) * z, zz];
  };
  const P = sph.pts.map(proj);
  for (let i = 0; i < P.length; i++) {
    const [x, y, d] = P[i];
    if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
    const front = (d + 1) / 2;
    g.globalAlpha = alpha * (0.15 + 0.85 * front);
    g.fillStyle = i % 11 === 0 ? T.pointHot : T.point;
    const sz = (0.8 + 1.8 * front) * Math.max(0.6, z) * T.pointScale;
    g.fillRect(x - sz / 2, y - sz / 2, sz, sz);
  }
  // 弧线：球面上两点之间向外鼓起的曲线，按进度生长
  for (const [ia, ib, ph, col] of sph.arcs) {
    const a = sph.pts[ia];
    const b = sph.pts[ib];
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    const ml = Math.hypot(...m) || 1;
    const lift = 1.25 + ph * 0.25;
    const ctrl = [(m[0] / ml) * lift, (m[1] / ml) * lift, (m[2] / ml) * lift];
    const grow = clamp(arcP * 1.6 - ph * 0.6);
    if (grow <= 0) continue;
    g.strokeStyle = `rgba(${col},${(0.55 * alpha).toFixed(3)})`;
    g.lineWidth = 1.2;
    g.beginPath();
    const steps = 18;
    for (let k = 0; k <= steps * grow; k++) {
      const t = k / steps;
      const q = [0, 1, 2].map((j) => (1 - t) * (1 - t) * a[j] + 2 * (1 - t) * t * ctrl[j] + t * t * b[j]);
      const [x, y] = proj(q);
      if (k === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }
  if (labels) {
    g.font = `500 ${Math.round(13 * Math.max(0.7, z))}px "Geist Mono Variable", monospace`;
    for (let i = 0; i < P.length; i += 29) {
      const [x, y, d] = P[i];
      if (d < 0.25) continue;
      g.globalAlpha = alpha * clamp((d - 0.25) * 2) * 0.85;
      g.fillStyle = T.label;
      g.fillText(labels[(i / 29) % labels.length | 0], x + 6, y - 6);
    }
  }
  g.globalAlpha = 1;
  return P;
}

export const world = { get: () => s?.world, drawSphere };

export default {
  id: "beyond",
  start: 96,
  end: 104,
  mount(root) {
    s = { world: makeWorld(), stars: makeStars(7, 1100) };
    s.words = [
      [98, "Skills", "kt-en", 290],
      [100, "连接", "kt", 280],
      [102, "一切", "kt", 280],
    ].map(([at, text, cls, size]) => {
      const n = el("div", `center ${cls}`, root, text);
      n.style.fontSize = `${size}px`;
      n.style.textShadow = `0 0 60px rgba(${T.glowRGB},.45)`;
      return { at, n };
    });
    s.sub = el("div", "abs cap", root, "SKILLS CONNECT EVERYTHING");
    s.sub.style.cssText += "left:0;right:0;top:760px;text-align:center;font-size:18px;color:var(--sh-ink-2);";
  },
  update(b, ctx) {
    const g = ctx.fx;
    const bg = ctx.bg;
    const warp = prog(b, 96, 97.6, E.outCubic);
    const travel = (b - 96) * 0.08 + E.outExpo(warp) * 0.6;
    drawStars(bg, s.stars, travel, clamp(prog(b, 96, 96.3) * (1 - prog(b, 103.3, 103.5))), (1 - warp) * 1.2);

    const emerge = prog(b, 96, 97.2, E.outExpo);
    const zoom = kf(b, [[96, 0.001, E.outExpo], [97.2, 1], [98.8, 1.06, E.inOutCubic], [102.8, 0.36], [103.5, 0.3]]);
    const yaw = (b - 96) * 0.32;
    const alpha = clamp(emerge * (1 - prog(b, 103.2, 103.5)));
    const { main, sats } = s.world;
    const cx = W / 2;
    const cy = H / 2;

    g.globalCompositeOperation = T.blend;
    drawRing(g, b, 96, cx, cy, 1300, 1.2, T.accentRGB, 4);
    drawSphere(g, main, yaw, 0.38, zoom, cx, cy, alpha, s.world.labels, prog(b, 96.6, 99.5));
    const satOn = prog(b, 99.3, 100.6, E.outCubic) * alpha;
    if (satOn > 0) {
      sats.forEach((sat, i) => {
        drawSphere(g, sat, yaw * 1.4 + sat.spin, 0.3, zoom, cx, cy, satOn * 0.9, null, 0);
        const sx = cx + sat.c[0] * zoom;
        const sy = cy + sat.c[1] * zoom;
        // 星系间长弧：主星球 → 卫星
        const grow = prog(b, 99.6 + i * 0.12, 100.8 + i * 0.12, E.outCubic);
        if (grow > 0) {
          const mx = (cx + sx) / 2;
          const my = (cy + sy) / 2 - 180 * zoom;
          g.strokeStyle = `rgba(${T.accentRGB},${(0.6 * satOn).toFixed(3)})`;
          g.lineWidth = 1.4;
          g.beginPath();
          for (let k = 0; k <= 30 * grow; k++) {
            const t = k / 30;
            const x = (1 - t) * (1 - t) * cx + 2 * (1 - t) * t * mx + t * t * sx;
            const y = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * my + t * t * sy;
            if (k === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
          }
          g.stroke();
        }
        g.globalAlpha = satOn;
        g.fillStyle = T.satLabel;
        g.font = '600 20px "Noto Sans SC Variable", sans-serif';
        g.textAlign = "center";
        g.fillText(sat.name, sx, sy + sat.R * zoom + 34);
        g.textAlign = "left";
        g.globalAlpha = 1;
      });
    }
    g.globalCompositeOperation = "source-over";

    s.words.forEach((w, i) => {
      const end = i < 2 ? s.words[i + 1].at : 103.5;
      const on = b >= w.at && b < end;
      css(w.n, { display: on ? "block" : "none" });
      if (!on) return;
      const tt = b - w.at;
      const inP = E.outExpo(clamp(tt / 0.35));
      const outP = prog(b, end - 0.2, end, E.inCubic);
      css(w.n, {
        opacity: (inP * (1 - outP)).toFixed(3),
        transform: `translate(-50%,-50%) scale(${(1.25 - 0.25 * inP + tt * 0.03 + outP * 0.2).toFixed(4)})`,
        filter: inP < 1 || outP > 0 ? `blur(${(18 * (1 - inP) + 16 * outP).toFixed(1)}px)` : "none",
      });
    });
    css(s.sub, { opacity: (prog(b, 102.2, 102.6) * (1 - prog(b, 103.2, 103.5)) * 0.9).toFixed(3) });
  },
};
```

### 14/30 · `promo/src/js/scenes/chaos.js`
<!-- casebook-file {"path": "promo/src/js/scenes/chaos.js", "lines": 236, "final_newline": true, "sha256": "c50b0ca2af714f0e1b5f6904dd8017beeaa9498053d2b0b46f2ff7d0ed408fe7", "original_sha256": "c50b0ca2af714f0e1b5f6904dd8017beeaa9498053d2b0b46f2ff7d0ed408fe7"} -->
```js
// b24–40 很多，很怪，没人知道：真机扫描的数字 + 快切提问 + 故障大字。
import { T } from "../theme.js";
import { ROOTS, SCAN, SKILLS } from "../data.js";
import { E, clamp, css, el, fakeHash, hit, kf, life, prog, rng, rollNum, toggle } from "../engine.js";
import { glitchText, updateGlitch } from "../fx.js";
import { glyph } from "../ui.js";

let s;

function tile(parent, name, src, sub) {
  const t = el("div", "tile", parent);
  glyph(name, src, t);
  const m = el("div", "t-meta", t);
  el("div", "t-name", m, name);
  el("div", "t-src", m, sub);
  return t;
}

const QUESTIONS = [
  [32, "谁在用什么？", "WHO USES WHAT?", "dark"],
  [33, "哪一份是最新的？", "WHICH ONE IS LATEST?", "light"],
  [34, "改的是哪一份？", "WHICH COPY DID I EDIT?", "dark"],
  [35, "删了会怎样？", "WHAT BREAKS IF I DELETE IT?", "light"],
];
const WORDS = [[36, "很多。"], [37, "很怪。"], [38, "没人知道。"]];

export default {
  id: "chaos",
  start: 24,
  end: 40,
  mount(root) {
    s = {};
    const r = rng(24);

    // 背景：三列路径瀑布
    s.paths = el("div", "abs", root);
    s.paths.style.cssText = "inset:0;overflow:hidden;";
    s.cols = [0, 1, 2].map((c) => {
      const col = el("div", "abs kt-mono", s.paths);
      col.style.cssText = `left:${120 + c * 600}px;top:0;font-size:22px;line-height:44px;color:var(--sh-ink-3);opacity:.4;white-space:nowrap;`;
      for (let i = 0; i < 60; i++) {
        const p = ROOTS[(i * 7 + c * 11) % ROOTS.length];
        const name = SKILLS[(i * 5 + c * 3) % SKILLS.length][0];
        const line = el("div", "", col, `${p}/<span style="color:var(--sh-ink-2)">${name}</span>`);
        if ((i + c) % 9 === 0) line.style.color = "var(--sh-volt)";
      }
      return col;
    });

    // 背景：3D 散乱卡片场
    s.field = el("div", "abs", root);
    s.field.style.cssText = "left:960px;top:540px;transform-style:preserve-3d;";
    s.flying = Array.from({ length: 70 }, (_, i) => {
      const [name, src] = SKILLS[i % SKILLS.length];
      const t = tile(s.field, name, src, ROOTS[(i * 3) % ROOTS.length]);
      const a = r() * Math.PI * 2;
      return { t, a, v: 500 + r() * 1100, z: -1400 + r() * 1700, rx: (r() - 0.5) * 140, ry: (r() - 0.5) * 140, rz: (r() - 0.5) * 90, ox: (r() - 0.5) * 600, oy: (r() - 0.5) * 300 };
    });

    // shot1：27 → 581
    s.shot1 = el("div", "abs", root);
    s.shot1.style.cssText = "inset:0;";
    const big = el("div", "abs", s.shot1);
    big.style.cssText = "left:150px;top:260px;";
    s.bigNum = glitchText(big, "27", "kt-en");
    s.bigNum.root.style.cssText += "font-size:420px;font-family:var(--sh-font);font-weight:600;letter-spacing:-0.06em;";
    s.label1 = el("div", "abs", s.shot1);
    s.label1.style.cssText = "left:1060px;top:420px;";
    s.l1cn = el("div", "kt", s.label1, "个 skills 目录");
    s.l1cn.style.fontSize = "72px";
    s.l1en = el("div", "cap", s.label1, "CLIENT ROOTS ON ONE MACHINE");
    s.l1en.style.marginTop = "18px";
    s.l1sub = el("div", "abs kt", s.shot1, "同一个 skill，被复制了一遍又一遍。");
    s.l1sub.style.cssText += "left:0;right:0;top:760px;text-align:center;font-size:38px;font-weight:600;";

    // shot2：demo-init ×26 扇形牌堆
    s.shot2 = el("div", "abs", root);
    s.shot2.style.cssText = "inset:0;";
    s.deck = el("div", "abs", s.shot2);
    s.deck.style.cssText = "left:700px;top:860px;";
    s.cards = Array.from({ length: SCAN.demoInit }, (_, i) => tile(s.deck, "demo-init", "local", ROOTS[i % ROOTS.length]));
    s.x26 = el("div", "abs kt-en", s.shot2);
    s.x26.style.cssText = "left:1320px;top:250px;font-size:230px;color:var(--sh-volt);font-family:var(--sh-mono);font-weight:500;";
    s.x26cap = el("div", "abs", s.shot2);
    s.x26cap.style.cssText = "left:1330px;top:510px;";
    el("div", "kt", s.x26cap, "demo-init").style.cssText = "font-size:44px;font-family:var(--sh-mono);font-weight:500;";
    el("div", "cap", s.x26cap, "26 COPIES · 2 VARIANTS").style.marginTop = "14px";
    s.varA = el("div", "abs sh-chip", s.shot2, `变体 A · #${fakeHash("demo-init-a", 8)}`);
    s.varB = el("div", "abs sh-chip", s.shot2, `变体 B · #${fakeHash("demo-init-b", 8)}`);
    [s.varA, s.varB].forEach((v) => (v.style.cssText += "height:34px;font-size:16px;font-family:var(--sh-mono);border-color:var(--sh-c-amber);color:var(--sh-c-amber);background:rgba(255,181,71,.1);"));
    s.q2 = el("div", "abs", s.shot2);
    s.q2.style.cssText = "left:0;right:0;top:830px;text-align:center;";
    s.q2a = el("div", "kt", s.q2, "同名，内容却不同。");
    s.q2a.style.fontSize = "40px";
    s.q2b = glitchText(el("div", "", s.q2), "哪一份才是真的？", "kt");
    s.q2b.root.style.cssText += "font-size:40px;margin-top:6px;color:var(--sh-volt);";

    // shot3：四连问，黑白反相快切
    s.shot3 = el("div", "abs", root);
    s.shot3.style.cssText = "inset:0;";
    s.qs = QUESTIONS.map(([at, cn, en, tone], i) => {
      const box = el("div", "abs", s.shot3);
      box.style.cssText = `inset:0;background:${tone === "light" ? "var(--sh-invert-bg)" : "transparent"};`;
      const g = glitchText(el("div", "center", box), cn, "kt", tone === "light" ? T.name !== "dark" : T.name === "dark");
      g.root.parentElement.style.textAlign = "center";
      g.root.style.cssText += `font-size:${[190, 150, 160, 180][i]}px;color:${tone === "light" ? "var(--sh-invert-ink)" : i === 2 ? "var(--sh-volt)" : "var(--sh-ink)"};`;
      const cap = el("div", "abs cap", box, en);
      cap.style.cssText += `left:0;right:0;top:${i % 2 ? 300 : 740}px;text-align:center;color:${tone === "light" ? "#5c6470" : "var(--sh-ink-3)"};font-size:18px;`;
      const idx = el("div", "abs kt-mono", box, `0${i + 1} / 04`);
      idx.style.cssText += `left:160px;top:180px;font-size:16px;color:${tone === "light" ? "#5c6470" : "var(--sh-ink-3)"};`;
      return { at, box, g };
    });

    // shot4：很多 / 很怪 / 没人知道
    s.shot4 = el("div", "abs", root);
    // 三记重音用反相底：浅色片里是全片最暗的一刻，紧接黑场与定名闪白
    s.shot4.style.cssText = "inset:0;background:var(--sh-invert-bg);color:var(--sh-invert-ink);";
    s.scan = el("div", "abs", s.shot4);
    s.scan.style.cssText = "inset:0;background:repeating-linear-gradient(0deg,rgba(128,128,128,.07) 0 2px,transparent 2px 5px);";
    s.words = WORDS.map(([at, w], i) => {
      const box = el("div", "center", s.shot4);
      const g = glitchText(box, w, "kt", T.name !== "dark");
      g.root.style.cssText += `font-size:${i === 2 ? 230 : 300}px;font-weight:900;`;
      return { at, box, g };
    });
  },
  update(b, ctx) {
    const f = ctx.frame;

    // 路径瀑布：b24–31 可见，速度很快
    const pathsOn = life(b, 24, 24.3, 30.6, 31.2);
    css(s.paths, { opacity: (pathsOn * (b >= 28 ? 0.45 : 1)).toFixed(3), display: pathsOn > 0 ? "block" : "none", filter: b >= 25 ? "blur(2px)" : "none" });
    s.cols.forEach((c, i) => css(c, { transform: `translateY(${(-((b - 24) * (360 + i * 90)) % 1320).toFixed(0)}px)` }));

    // 卡片场：b24 从中心炸开，之后缓慢漂浮；在提问段作为暗背景
    const fieldOn = b < 39.5;
    css(s.field, { display: fieldOn ? "block" : "none" });
    if (fieldOn) {
      const burst = E.outExpo(clamp((b - 24) / 2.2));
      const drift = b - 24;
      const dim = b >= 28 ? 0.28 : 1;
      const swarm = prog(b, 38, 39.5, E.inCubic);
      s.flying.forEach((p, i) => {
        const d = p.v * burst + drift * 30 + swarm * 900;
        const x = p.ox * (1 - burst) + Math.cos(p.a) * d;
        const y = p.oy * (1 - burst) + Math.sin(p.a) * d * 0.62;
        const z = p.z * burst + swarm * 600;
        css(p.t, {
          opacity: (dim * clamp(1 - Math.max(0, z) / 900)).toFixed(3),
          transform: `translate3d(${(x - 116).toFixed(1)}px,${(y - 36).toFixed(1)}px,${z.toFixed(0)}px) rotateX(${(p.rx * burst + drift * 6).toFixed(1)}deg) rotateY(${(p.ry * burst).toFixed(1)}deg) rotateZ(${(p.rz * burst + i).toFixed(1)}deg)`,
        });
      });
      css(s.field, { transform: `perspective(1200px) rotateZ(${(drift * 1.5).toFixed(2)}deg)`, filter: b >= 28 && b < 38 ? "blur(3px)" : "none" });
    }

    // shot1
    const on1 = b >= 24.9 && b < 28;
    css(s.shot1, { display: on1 ? "block" : "none" });
    if (on1) {
      const n = b < 26 ? SCAN.roots : rollNum(b, 26, 26.45, SCAN.roots, SCAN.copies);
      const txt = String(n);
      [s.bigNum.main, s.bigNum.red, s.bigNum.cyan, ...s.bigNum.slices].forEach((node) => { if (node.textContent !== txt) node.textContent = txt; });
      const punch = Math.max(hit(b, 25, 0.12), hit(b, 26, 0.12));
      css(s.bigNum.root, { transform: `scale(${(1 + 0.18 * punch).toFixed(3)})`, transformOrigin: "left center" });
      updateGlitch(s.bigNum, punch * 1.4, f, 3);
      const cn = b < 26 ? "个 skills 目录" : "份副本";
      const en = b < 26 ? "CLIENT ROOTS ON ONE MACHINE" : "COPIES · SAME SKILLS, AGAIN AND AGAIN";
      if (s.l1cn.textContent !== cn) s.l1cn.textContent = cn;
      if (s.l1en.textContent !== en) s.l1en.textContent = en;
      css(s.label1, { transform: `translateX(${b < 26 ? 0 : 150}px) translateY(${(-30 * punch).toFixed(1)}px)`, opacity: prog(b, 25, 25.2).toFixed(2) });
      css(s.l1sub, { opacity: life(b, 26.6, 26.9, 27.7, 28).toFixed(3), transform: `translateY(${(20 * (1 - prog(b, 26.6, 27, E.outCubic))).toFixed(1)}px)` });
    }

    // shot2
    const on2 = b >= 28 && b < 32;
    css(s.shot2, { display: on2 ? "block" : "none" });
    if (on2) {
      const shown = Math.min(SCAN.demoInit, Math.floor(prog(b, 28, 29.6) * SCAN.demoInit + 1));
      s.cards.forEach((c, i) => {
        const vis = i < shown;
        const t = i / (SCAN.demoInit - 1);
        const spread = prog(b, 28 + i * 0.06, 28.6 + i * 0.06, E.outExpo);
        const ang = (-62 + t * 124) * spread;
        const lift = i === 5 || i === 20 ? prog(b, 30, 30.5, E.outBack) * 90 : 0;
        css(c, {
          opacity: vis ? "1" : "0",
          transform: `translate(-116px,-36px) rotate(${ang.toFixed(2)}deg) translateY(${(-(120 + 330 * spread) - lift).toFixed(1)}px)`,
          zIndex: String(i === 5 || i === 20 ? 100 : i),
        });
        toggle(c, "is-hot", (i === 5 || i === 20) && b >= 30);
      });
      css(s.deck, { transform: `translateY(${kf(b, [[28, 120], [29.6, 0, E.outCubic], [32, -10]]).toFixed(0)}px) rotate(${kf(b, [[28, -4], [32, 3]]).toFixed(2)}deg) scale(${kf(b, [[28, 0.92], [32, 1.04]]).toFixed(3)})` });
      s.x26.textContent = `×${shown}`;
      css(s.x26, { transform: `scale(${(1 + 0.08 * hit(b, 28 + (shown - 1) * (1.6 / SCAN.demoInit), 0.08)).toFixed(3)})`, transformOrigin: "left center" });
      const va = prog(b, 30, 30.4, E.outBack);
      css(s.varA, { left: "1330px", top: "700px", opacity: va.toFixed(2), transform: `scale(${(0.7 + 0.3 * va).toFixed(3)})` });
      css(s.varB, { left: "1330px", top: "752px", opacity: va.toFixed(2), transform: `scale(${(0.7 + 0.3 * va).toFixed(3)})` });
      css(s.q2a, { opacity: life(b, 30, 30.3, 32, 32).toFixed(2) });
      css(s.q2b.root, { opacity: prog(b, 31, 31.1).toFixed(2), transform: `scale(${(1 + 0.2 * hit(b, 31, 0.15)).toFixed(3)})` });
      updateGlitch(s.q2b, hit(b, 31, 0.2) + (b >= 31.5 && b < 32 ? 1.2 : 0), f, 5);
    }

    // shot3：每拍一问
    const on3 = b >= 32 && b < 36;
    css(s.shot3, { display: on3 ? "block" : "none" });
    if (on3) {
      s.qs.forEach((q, i) => {
        const on = b >= q.at && b < q.at + 1;
        css(q.box, { display: on ? "block" : "none" });
        if (!on) return;
        const tt = b - q.at;
        const zoom = 1.12 - 0.12 * E.outExpo(clamp(tt / 0.4)) + tt * 0.04;
        css(q.g.root, { transform: `scale(${zoom.toFixed(4)})` });
        updateGlitch(q.g, hit(b, q.at, 0.1) * 1.2 + (i === 3 && b >= 35.5 ? 1.5 : 0), f, 10 + i);
      });
    }

    // shot4
    const on4 = b >= 36 && b < 39.5;
    css(s.shot4, { display: on4 ? "block" : "none" });
    if (on4) {
      s.words.forEach((w, i) => {
        const next = i < 2 ? WORDS[i + 1][0] : 39.5;
        const on = b >= w.at && b < next;
        css(w.box, { display: on ? "block" : "none" });
        if (!on) return;
        const tt = b - w.at;
        const build = i === 2 ? prog(b, 38.5, 39.5, E.inCubic) : 0;
        const sc = 1.25 - 0.25 * E.outExpo(clamp(tt / 0.3)) + build * 0.25;
        css(w.box, { transform: `translate(-50%,-50%) scale(${sc.toFixed(4)})` });
        updateGlitch(w.g, hit(b, w.at, 0.15) * 1.3 + build * 1.6, f, 20 + i);
      });
      css(s.scan, { opacity: (0.5 + 0.5 * prog(b, 38, 39.5)).toFixed(2), transform: `translateY(${((b * 37) % 5).toFixed(1)}px)` });
    }
  },
};
```

### 15/30 · `promo/src/js/scenes/chapter.js`
<!-- casebook-file {"path": "promo/src/js/scenes/chapter.js", "lines": 41, "final_newline": true, "sha256": "140974933c1653e0d13c603d4a21be9e30bcf3d74bb5e54461a0822a60eee229", "original_sha256": "140974933c1653e0d13c603d4a21be9e30bcf3d74bb5e54461a0822a60eee229"} -->
```js
// 章节题签与底部字幕：四个章节（收 / 链 / 看 / 享）和后续段落共用。
import { E, css, el, life, prog, revealChars, split } from "../engine.js";

export function chapter(root, num, cn, en) {
  const c = el("div", "chapter", root);
  const n = el("div", "ch-num", c, num);
  const line = el("div", "ch-line", c);
  const big = el("div", "ch-cn", c, cn);
  const e = el("div", "ch-en", c, en);
  return { c, n, line, big, e };
}

export function updateChapter(ch, b, start, end) {
  const p = prog(b, start, start + 0.6, E.outExpo);
  const out = prog(b, end - 0.4, end, E.inCubic);
  css(ch.c, { opacity: (1 - out).toFixed(3) });
  css(ch.n, { opacity: p.toFixed(3) });
  css(ch.line, { transform: `scaleX(${p.toFixed(3)})` });
  css(ch.big, { opacity: p.toFixed(3), transform: `translateY(${(24 * (1 - p)).toFixed(1)}px)` });
  css(ch.e, { opacity: (prog(b, start + 0.2, start + 0.8) * 0.9).toFixed(3) });
}

export function caption(root, cn, en, top = null) {
  const c = el("div", "caption", root);
  if (top !== null) {
    c.style.bottom = "auto";
    c.style.top = `${top}px`;
  }
  const t = el("div", "c-cn", c);
  const chars = split(t, cn);
  const e = el("div", "c-en", c, en);
  return { c, chars, e };
}

export function updateCaption(cap, b, at, outAt) {
  const v = life(b, at, at + 0.3, outAt - 0.3, outAt);
  css(cap.c, { display: v > 0 ? "block" : "none" });
  if (v <= 0) return;
  revealChars(cap.chars, b, at, 0.03, 0.45, [outAt - 0.35, outAt, 0.005]);
  css(cap.e, { opacity: (v * 0.9).toFixed(3) });
}
```

### 16/30 · `promo/src/js/scenes/extend.js`
<!-- casebook-file {"path": "promo/src/js/scenes/extend.js", "lines": 135, "final_newline": true, "sha256": "2df3bdc49af17d39b709b2c9a018161e86b306b5a21cc727bb179429ed4e6d83", "original_sha256": "2df3bdc49af17d39b709b2c9a018161e86b306b5a21cc727bb179429ed4e6d83"} -->
```js
// b76–88 为扩展而建：四个接口模块逐拍「咔」进确定性内核，再收成工程 DAG。
import { T } from "../theme.js";
import { E, clamp, css, el, hit, kf, prog, svg, toggle } from "../engine.js";
import { drawBurst, makeBurst } from "../fx.js";
import { chapter, updateChapter } from "./chapter.js";

const CX = 960;
const CY = 560;
const MODULES = [
  { at: 77, name: "StorageProvider", cn: "换介质", desc: "文件目录 → SQLite → 云端", x: CX, y: 250, from: [0, -900] },
  { at: 79, name: "SourceProvider", cn: "接来源", desc: "本地 · GitHub · skills.sh · 浏览器插件", x: 1490, y: CY, from: [1000, 0] },
  { at: 81, name: "ClientAdapter", cn: "接客户端", desc: "任何读 SKILL.md 的 Agent", x: CX, y: 870, from: [0, 900] },
  { at: 83, name: "IdentityProvider", cn: "接账号", desc: "统一登录 · 团队权限", x: 430, y: CY, from: [-1000, 0] },
];
const DAG = [
  { id: "A", cn: "库存与镜像层", en: "STORE · LINKS", x: 430, y: 560 },
  { id: "B", cn: "App 壳", en: "SEE", x: 960, y: 400 },
  { id: "C", cn: "分享层", en: "SHARE", x: 960, y: 720 },
  { id: "D", cn: "社区与统计层", en: "TEAM · STATS", x: 1490, y: 560 },
];
const EDGES = [["A", "B", 84.5], ["A", "C", 85], ["B", "D", 85.5], ["C", "D", 86]];
let s;

function hexPath(r) {
  const pts = [];
  for (let k = 0; k < 6; k++) {
    const a = (30 + k * 60) * (Math.PI / 180);
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

export default {
  id: "extend",
  start: 76,
  end: 88,
  mount(root) {
    s = {};
    s.a = el("div", "abs", root);
    s.a.style.cssText = "inset:0;transform-origin:960px 560px;";
    s.svg = svg("svg", { width: 1920, height: 1080, style: "position:absolute;inset:0;overflow:visible" }, s.a);
    s.links = MODULES.map((m) => svg("line", { x1: CX, y1: CY, x2: m.x, y2: m.y, stroke: `rgba(${T.accentRGB},.8)`, "stroke-width": 2, opacity: 0 }, s.svg));
    const g = svg("g", { transform: `translate(${CX} ${CY})` }, s.svg);
    s.ring = svg("path", { d: hexPath(190), fill: "none", stroke: "var(--sh-line-3)", "stroke-width": 1.5, "stroke-dasharray": "6 10" }, g);
    s.hex = svg("path", { d: hexPath(140), fill: "var(--sh-surface)", stroke: `rgba(${T.accentRGB},.9)`, "stroke-width": 2.5 }, g);
    s.core = el("div", "abs", s.a, "<div style='font-family:var(--sh-mono);font-size:30px;font-weight:500'>core</div><div class='dim' style='margin-top:8px;font-size:17px'>确定性内核</div><div class='sh-hash' style='margin-top:6px'>@skills-hub/core</div>");
    s.core.style.cssText += `left:${CX - 150}px;width:300px;top:${CY - 58}px;text-align:center;`;

    s.mods = MODULES.map((m) => {
      const n = el("div", "node", s.a);
      n.style.left = `${m.x}px`;
      n.style.top = `${m.y}px`;
      n.style.padding = "18px 22px";
      n.innerHTML = `<div><div style="display:flex;gap:10px;align-items:baseline"><span class="volt" style="font-size:22px;font-weight:700;font-family:var(--sh-font-cn)">${m.cn}</span><span style="font-family:var(--sh-mono);font-size:16px;color:var(--sh-ink-2)">${m.name}</span></div><div class="dim" style="margin-top:8px;font-size:15px">${m.desc}</div></div>`;
      return { ...m, n, burst: makeBurst(m.at * 10, 60, { speed: 600, life: 0.9 }) };
    });

    s.title = el("div", "abs", root);
    s.title.style.cssText = "right:96px;top:92px;text-align:right;";
    el("div", "kt", s.title, "接口先抽象，介质随时换。").style.cssText = "font-size:34px;font-weight:700;";
    el("div", "cap", s.title, "ABSTRACT FIRST · SWAP ANYTIME").style.marginTop = "10px";

    // DAG
    s.b = el("div", "abs", root);
    s.b.style.cssText = "inset:0;";
    s.dsvg = svg("svg", { width: 1920, height: 1080, style: "position:absolute;inset:0;overflow:visible" }, s.b);
    const pos = Object.fromEntries(DAG.map((d) => [d.id, d]));
    s.edges = EDGES.map(([a, z, at]) => {
      const A = pos[a];
      const Z = pos[z];
      const dpath = `M ${A.x + 130} ${A.y} C ${(A.x + Z.x) / 2} ${A.y}, ${(A.x + Z.x) / 2} ${Z.y}, ${Z.x - 130} ${Z.y}`;
      return { p: svg("path", { d: dpath, fill: "none", stroke: `rgba(${T.accentRGB},.85)`, "stroke-width": 2, "stroke-dasharray": 700, "stroke-dashoffset": 700 }, s.dsvg), at };
    });
    s.dnodes = DAG.map((d, i) => {
      const n = el("div", "node", s.b);
      n.style.left = `${d.x}px`;
      n.style.top = `${d.y}px`;
      n.style.minWidth = "250px";
      n.innerHTML = `<span style="font-family:var(--sh-mono);font-size:26px;color:var(--sh-volt);width:30px">${d.id}</span><div><div class="n-name">${d.cn}</div><div class="n-path">${d.en}</div></div>`;
      if (d.id === "D") n.style.borderStyle = "dashed";
      return { n, at: [84.2, 84.7, 85.2, 85.7][i] };
    });
    s.big = el("div", "abs", root);
    s.big.style.cssText = "left:0;right:0;top:880px;text-align:center;";
    el("div", "kt", s.big, "为团队而生，为扩展而建。").style.cssText = "font-size:52px;";
    el("div", "cap", s.big, "BUILT FOR TEAMS · BUILT TO EXTEND").style.marginTop = "16px";

    s.ch = chapter(root, "05", "扩", "EXTEND");
  },
  update(b, ctx) {
    updateChapter(s.ch, b, 76, 88);
    const toDag = prog(b, 83.8, 84.4, E.inOutCubic);
    css(s.a, { opacity: (1 - toDag).toFixed(3), transform: `scale(${(kf(b, [[76, 1, E.outExpo], [77, 1.1], [83.8, 1.14]]) * (1 - 0.3 * toDag)).toFixed(4)})`, display: toDag >= 1 ? "none" : "block" });
    css(s.title, { opacity: (prog(b, 76.5, 77) * (1 - toDag)).toFixed(3) });
    const hx = prog(b, 76, 76.6, E.outBack);
    s.hex.setAttribute("transform", `scale(${(hx * (1 + 0.05 * Math.max(...MODULES.map((m) => hit(b, m.at, 0.2))))).toFixed(4)})`);
    s.ring.setAttribute("transform", `rotate(${((b - 76) * 12).toFixed(2)}) scale(${hx.toFixed(3)})`);
    css(s.core, { opacity: prog(b, 76.3, 76.7).toFixed(2) });

    const g = ctx.fx;
    s.mods.forEach((m, i) => {
      const p = prog(b, m.at - 0.5, m.at, E.inCubic);
      const settle = hit(b, m.at, 0.15);
      const ox = m.from[0] * (1 - p);
      const oy = m.from[1] * (1 - p);
      const bump = settle * 10;
      css(m.n, {
        opacity: p > 0 ? "1" : "0",
        transform: `translate(calc(-50% + ${(ox - Math.sign(m.from[0]) * bump).toFixed(1)}px), calc(-50% + ${(oy - Math.sign(m.from[1]) * bump).toFixed(1)}px)) scale(${(1 + 0.05 * settle).toFixed(3)})`,
      });
      toggle(m.n, "is-lit", b >= m.at && b < m.at + 1.2);
      s.links[i].setAttribute("opacity", b >= m.at ? (0.35 + 0.65 * hit(b, m.at, 0.5)).toFixed(3) : "0");
      g.globalCompositeOperation = T.blend;
      const mx = CX + (m.x - CX) * 0.55;
      const my = CY + (m.y - CY) * 0.55;
      drawBurst(g, m.burst, b, m.at, mx, my);
      g.globalCompositeOperation = "source-over";
    });

    const dagOn = b >= 84;
    css(s.b, { display: dagOn ? "block" : "none" });
    if (dagOn) {
      s.dnodes.forEach((d) => {
        const p = prog(b, d.at, d.at + 0.4, E.outBack);
        css(d.n, { opacity: clamp(p).toFixed(3), transform: `translate(-50%,-50%) scale(${(0.7 + 0.3 * p).toFixed(3)})` });
        toggle(d.n, "is-lit", b >= d.at + 0.2 && b < d.at + 0.9);
      });
      s.edges.forEach((e) => e.p.setAttribute("stroke-dashoffset", (700 * (1 - prog(b, e.at, e.at + 0.5, E.outExpo))).toFixed(1)));
      const out = prog(b, 87.5, 88, E.inCubic);
      css(s.b, { opacity: (1 - out).toFixed(3), transform: `translateY(${(-60 * prog(b, 86.2, 87, E.outExpo)).toFixed(1)}px)` });
    }
    const bg = prog(b, 86.3, 86.9, E.outExpo);
    css(s.big, { opacity: (bg * (1 - prog(b, 87.6, 88))).toFixed(3), transform: `translateY(${(30 * (1 - bg)).toFixed(1)}px)`, filter: bg < 1 ? `blur(${(10 * (1 - bg)).toFixed(1)}px)` : "none" });
  },
};
```

### 17/30 · `promo/src/js/scenes/finale.js`
<!-- casebook-file {"path": "promo/src/js/scenes/finale.js", "lines": 67, "final_newline": true, "sha256": "09a0b3c0d389d86ea85c7ace85afd347270bf493a344181192632574ff2a4378", "original_sha256": "09a0b3c0d389d86ea85c7ace85afd347270bf493a344181192632574ff2a4378"} -->
```js
// b104–114 定版：冲击 + Logo 锁定 + 一行命令。
import { T } from "../theme.js";
import { E, css, el, hit, kf, prog, revealChars, split } from "../engine.js";
import { drawBurst, drawRing, makeBurst } from "../fx.js";
import { logoSVG } from "../ui.js";
import { world } from "./beyond.js";

let s;

export default {
  id: "finale",
  start: 104,
  end: 114,
  mount(root) {
    s = {};
    s.glow = el("div", "abs", root);
    s.glow.style.cssText = `left:960px;top:430px;width:1600px;height:1600px;margin:-800px 0 0 -800px;background:radial-gradient(closest-side,rgba(${T.glowRGB},.18),transparent 60%);`;
    s.lock = el("div", "abs", root);
    s.lock.style.cssText = "inset:0;transform-origin:960px 520px;";
    s.logo = el("div", "abs", s.lock, logoSVG(150));
    s.logo.style.cssText = "left:885px;top:300px;width:150px;height:150px;";
    const word = el("div", "abs", s.lock);
    word.style.cssText = "left:0;right:0;top:490px;text-align:center;overflow:hidden;padding-bottom:12px;";
    const inner = el("div", "kt-en", word);
    inner.style.fontSize = "136px";
    s.word = split(inner, "Skills Hub");
    s.tag = el("div", "abs", s.lock);
    s.tag.style.cssText = "left:0;right:0;top:668px;text-align:center;";
    const cn = el("div", "kt", s.tag);
    cn.style.cssText = "font-size:40px;font-weight:600;";
    s.tagChars = split(cn, "团队的 Skill 中枢 · Skills 连接一切");
    s.cmd = el("div", "abs", s.lock);
    s.cmd.style.cssText = "left:50%;top:780px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;height:56px;padding:0 22px;border:1px solid var(--sh-line-2);border-radius:12px;background:var(--sh-surface);font-family:var(--sh-mono);font-size:22px;white-space:nowrap;";
    s.cmd.innerHTML = "<span class='volt'>$</span><span>skills-hub ui</span>";
    s.caret = el("span", "", s.cmd);
    s.caret.style.cssText = "display:inline-block;width:12px;height:26px;background:var(--sh-volt-fill);border:1px solid var(--sh-volt);";
    s.foot = el("div", "abs cap", root, "SKILL-HUB · 社团内部试验版 · 2026");
    s.foot.style.cssText += "left:0;right:0;top:960px;text-align:center;font-size:13px;";
    s.burst = makeBurst(104, 260, { speed: 1400, life: 2.2 });
  },
  update(b, ctx) {
    const h = hit(b, 104, 0.6);
    const fade = prog(b, 112, 114, E.inCubic);
    const ls = kf(b, [[104, 2.4, E.outExpo], [105, 1], [114, 0.97]]);
    css(s.logo, { transform: `scale(${ls.toFixed(4)})`, filter: `drop-shadow(0 0 ${(16 + 60 * h).toFixed(0)}px rgba(${T.glowRGB},.6))` });
    css(s.glow, { opacity: ((0.6 + 0.8 * h) * (1 - fade)).toFixed(3) });
    s.word.forEach((c, i) => {
      const p = prog(b, 104.25 + i * 0.05, 105 + i * 0.05, E.outExpo);
      css(c, { transform: `translateY(${(110 * (1 - p)).toFixed(1)}%)` });
    });
    revealChars(s.tagChars, b, 105.4, 0.035, 0.5);
    const c = prog(b, 106.6, 107.2, E.outExpo);
    css(s.cmd, { opacity: c.toFixed(3), transform: `translateX(-50%) translateY(${(20 * (1 - c)).toFixed(1)}px)` });
    css(s.caret, { opacity: b % 1 < 0.5 ? "1" : "0" });
    css(s.lock, { opacity: (1 - fade).toFixed(3), transform: `scale(${kf(b, [[104, 1.06, E.outExpo], [106, 1], [114, 0.97]]).toFixed(4)})` });
    css(s.foot, { opacity: (prog(b, 107.5, 108.5) * 0.8 * (1 - fade)).toFixed(3) });

    const g = ctx.fx;
    g.globalCompositeOperation = T.blend;
    drawRing(g, b, 104, 960, 375, 1600, 1.5, T.accentRGB, 6);
    drawRing(g, b, 104.1, 960, 375, 1000, 1.2, T.pop, 2);
    drawBurst(g, s.burst, b, 104, 960, 375);
    const w = world.get();
    if (w) world.drawSphere(ctx.bg, w.main, (b - 96) * 0.32, 0.38, 1.35, 960, 1180, 0.22 * prog(b, 104.5, 106) * (1 - fade), null, 1);
    g.globalCompositeOperation = "source-over";
  },
};
```

### 18/30 · `promo/src/js/scenes/growth.js`
<!-- casebook-file {"path": "promo/src/js/scenes/growth.js", "lines": 124, "final_newline": true, "sha256": "1a5b0844c9cf6d2caa35355e87ee2034491b276fb9a3a7920ca8935cc6338b61", "original_sha256": "1a5b0844c9cf6d2caa35355e87ee2034491b276fb9a3a7920ca8935cc6338b61"} -->
```js
// b8–24 一个、十个、一百个：卡片每两拍翻倍，从中心向外长。
import { ROOTS, SKILLS } from "../data.js";
import { E, clamp, css, el, kf, lerp, life, prog, revealChars, rng, split, toggle } from "../engine.js";
import { glyph } from "../ui.js";

const CW = 252;
const CH = 92;
const COUNT = 128;
let s;

function batchOf(i) {
  return i === 0 ? 0 : Math.ceil(Math.log2(i + 1));
}

export default {
  id: "growth",
  start: 8,
  end: 24,
  mount(root) {
    s = {};
    const r = rng(8);
    const cells = [];
    for (let row = -4; row < 4; row++) for (let col = -8; col < 8; col++) {
      const x = (col + 0.5) * CW;
      const y = (row + 0.5) * CH;
      cells.push({ x, y, d: Math.hypot(x / 1.6, y) + r() * 30 });
    }
    cells.sort((a, b) => a.d - b.d);
    // 第一张固定在正中
    cells[0] = { x: 0, y: 0, d: 0 };

    s.plane = el("div", "abs", root);
    s.plane.style.cssText = "left:960px;top:540px;width:0;height:0;transform-style:preserve-3d;";
    s.tiles = cells.slice(0, COUNT).map((c, i) => {
      const [name, src] = i === 0 ? SKILLS[0] : SKILLS[Math.floor(r() * SKILLS.length)];
      const t = el("div", "tile", s.plane);
      glyph(name, src, t);
      const meta = el("div", "t-meta", t);
      el("div", "t-name", meta, name);
      el("div", "t-src", meta, i === 0 ? "~/.claude/skills" : ROOTS[Math.floor(r() * ROOTS.length)]);
      return { t, x: c.x - 116, y: c.y - 36, at: 8 + batchOf(i) * 2 + (i === 0 ? 0 : r() * 0.45), jx: r() - 0.5, jy: r() - 0.5, ph: r() * 6.28 };
    });
    // 每一批完成后的取景：把已出现的卡装进画面
    s.fit = [];
    for (let k = 0; k <= 7; k++) {
      const n = Math.min(COUNT, 2 ** k);
      let mx = 0;
      let my = 0;
      for (let i = 0; i < n; i++) {
        mx = Math.max(mx, Math.abs(cells[i].x) + 126);
        my = Math.max(my, Math.abs(cells[i].y) + 46);
      }
      s.fit.push(Math.min(1.7, 1560 / (2 * mx), 700 / (2 * my)));
    }

    s.counter = el("div", "abs", root);
    s.counter.style.cssText = "left:96px;top:176px;";
    el("div", "cap", s.counter, "SKILLS · 本机").style.letterSpacing = "0.2em";
    s.num = el("div", "kt-en", s.counter);
    s.num.style.cssText = "margin-top:10px;font-size:84px;font-family:var(--sh-mono);font-weight:500;letter-spacing:-0.02em;";

    const phrases = [
      [8.6, "有人写了一个。", "SOMEONE WROTE ONE"],
      [12.5, "大家都开始写。", "THEN EVERYONE DID"],
      [16.5, "装进每一个 Agent。", "INSTALLED INTO EVERY AGENT"],
      [20.5, "越来越多。", "MORE. AND MORE."],
    ];
    s.phrases = phrases.map(([at, cn, en]) => {
      const box = el("div", "abs", root);
      box.style.cssText = "left:0;right:0;top:806px;text-align:center;";
      const glow = el("div", "abs", box);
      glow.style.cssText = "left:50%;top:40%;width:900px;height:220px;transform:translate(-50%,-50%);background:radial-gradient(closest-side,var(--sh-scrim),transparent);";
      const t = el("div", "kt", box);
      t.style.cssText = "position:relative;font-size:60px;";
      const chars = split(t, cn);
      const e = el("div", "cap", box, en);
      e.style.cssText += "position:relative;margin-top:14px;";
      return { at, box, chars, e };
    });
  },
  update(b, ctx) {
    const k = clamp(Math.floor((b - 8) / 2), 0, 7);
    const since = b - (8 + k * 2);
    const prev = s.fit[Math.max(0, k - 1)];
    let scale = k === 0 ? kf(b, [[8, 2.2, E.outExpo], [9.2, s.fit[0]]]) : lerp(prev, s.fit[k], E.outExpo(clamp(since / 1.2)));
    scale *= 1 + 0.03 * Math.exp(-since * 5);
    const rx = kf(b, [[8, 0], [24, 22]]);
    const rz = kf(b, [[8, 0], [24, -6]]);
    const shakeIn = prog(b, 21.5, 24, E.inCubic);
    css(s.plane, { transform: `perspective(1600px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${scale.toFixed(4)})` });

    for (let i = 0; i < s.tiles.length; i++) {
      const tl = s.tiles[i];
      const p = prog(b, tl.at, tl.at + 0.5, E.outBack);
      const o = prog(b, tl.at, tl.at + 0.2);
      if (o <= 0) {
        css(tl.t, { opacity: "0" });
        continue;
      }
      const jit = shakeIn * 14;
      const x = tl.x + tl.jx * jit * Math.sin(b * 9 + tl.ph);
      const y = tl.y + tl.jy * jit * Math.cos(b * 11 + tl.ph);
      css(tl.t, {
        opacity: o.toFixed(3),
        transform: `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(0.55 + 0.45 * p).toFixed(3)})`,
      });
      toggle(tl.t, "is-hot", b - tl.at < 0.6 && b >= tl.at);
    }

    const n = Math.min(COUNT, 2 ** k);
    const shown = b < 22 ? n : Math.round(lerp(128, 213, prog(b, 22, 23.6, E.outExpo)));
    s.num.textContent = String(shown).padStart(3, "0");
    css(s.counter, { opacity: prog(b, 8.2, 8.8).toFixed(2), transform: `scale(${(1 + 0.06 * Math.exp(-since * 6)).toFixed(3)})`, transformOrigin: "left top" });

    s.phrases.forEach((p) => {
      const v = life(b, p.at, p.at + 0.3, p.at + 3.0, p.at + 3.4);
      css(p.box, { opacity: v > 0 ? "1" : "0" });
      if (v <= 0) return;
      revealChars(p.chars, b, p.at, 0.05, 0.45, [p.at + 3.0, p.at + 3.4, 0.01]);
      css(p.e, { opacity: (v * 0.9).toFixed(3) });
    });
    void ctx;
  },
};
```

### 19/30 · `promo/src/js/scenes/intro.js`
<!-- casebook-file {"path": "promo/src/js/scenes/intro.js", "lines": 80, "final_newline": true, "sha256": "287e47d4da84eba5ba1abdf4633f2631e8b50e4b785c91bf6ea58a8d11ed3ac7", "original_sha256": "287e47d4da84eba5ba1abdf4633f2631e8b50e4b785c91bf6ea58a8d11ed3ac7"} -->
```js
// b0–8 起初，只是一个文件夹：光标、键入路径、SKILL.md 展开。
import { E, css, el, kf, life, prog, revealChars, split } from "../engine.js";

const PATH = "~/.claude/skills/pptx";
let s;

export default {
  id: "intro",
  start: 0,
  end: 8,
  mount(root) {
    s = {};
    s.cam = el("div", "abs", root);
    s.cam.style.cssText = "inset:0;transform-origin:960px 560px;";
    s.line = el("div", "abs", s.cam);
    s.line.style.cssText = "left:360px;width:1200px;top:540px;height:1px;background:linear-gradient(90deg,transparent,var(--sh-volt),transparent);transform-origin:center;";

    s.path = el("div", "abs kt-mono", s.cam);
    s.path.style.cssText = "left:0;right:0;top:512px;text-align:center;font-size:40px;color:var(--sh-ink-2);white-space:pre;";
    s.pathChars = split(s.path, PATH);
    s.pathChars.forEach((c, i) => { if (i >= 17) c.style.color = "var(--sh-ink)"; });
    s.caret = el("span", "", s.path);
    s.caret.style.cssText = "display:inline-block;width:18px;height:42px;margin-left:4px;vertical-align:-8px;background:var(--sh-volt-fill);box-shadow:0 0 18px var(--sh-volt-glow);";

    s.docWrap = el("div", "center", s.cam);
    s.docWrap.style.top = "590px";
    s.doc = el("div", "doc", s.docWrap);
    el("div", "d-file", s.doc, "<span style='color:var(--sh-volt)'>●</span> pptx / SKILL.md");
    const lines = [
      "<span class='d-dash'>---</span>",
      "<span class='d-k'>name</span>: <span class='d-v'>pptx</span>",
      "<span class='d-k'>description</span>: <span class='d-v'>Create, edit and analyze</span>",
      "<span class='d-v'>&nbsp;&nbsp;PowerPoint presentations.</span>",
      "<span class='d-dash'>---</span>",
      "<span class='dim'># 教会 Agent 做一件事</span>",
    ];
    s.lines = lines.map((h) => el("div", "", s.doc, h));
    s.scan = el("div", "abs", s.doc);
    s.scan.style.cssText = "left:0;right:0;height:120px;top:0;background:linear-gradient(180deg,transparent,var(--sh-volt-soft),transparent);pointer-events:none;";
    s.doc.style.position = "relative";
    s.doc.style.overflow = "hidden";

    s.cap = el("div", "abs", root);
    s.cap.style.cssText = "left:0;right:0;top:830px;text-align:center;";
    const cn = el("div", "kt", s.cap);
    cn.style.cssText = "font-size:46px;font-weight:700;letter-spacing:0.02em;";
    s.capChars = split(cn, "起初，只是一个文件夹。");
    s.capEn = el("div", "cap", s.cap, "IT STARTED WITH A FOLDER");
    s.capEn.style.marginTop = "16px";
  },
  update(b) {
    // 光标：键入前按拍闪烁，键入时常亮并跟随
    const typed = Math.floor(prog(b, 1, 3) * PATH.length + 1e-6);
    s.pathChars.forEach((c, i) => css(c, { opacity: i < typed ? "1" : "0", display: i < typed ? "inline" : "none" }));
    const blink = b < 1 || b > 3 ? (b % 1 < 0.5 ? 1 : 0.15) : 1;
    css(s.caret, { opacity: (blink * (1 - prog(b, 3.2, 3.6))).toFixed(2) });

    const lw = kf(b, [[0.3, 0, E.outExpo], [1.2, 1], [3, 1, E.inCubic], [3.4, 0]]);
    css(s.line, { transform: `scaleX(${lw.toFixed(3)})`, opacity: (lw * 0.9).toFixed(3) });

    // 路径上移，文档展开
    const up = prog(b, 3, 3.6, E.outExpo);
    css(s.path, { transform: `translateY(${(-250 * up).toFixed(1)}px) scale(${(1 - 0.35 * up).toFixed(3)})` });
    const open = prog(b, 3.2, 4, E.outExpo);
    css(s.docWrap, { opacity: open.toFixed(3), transform: `translate(-50%,-50%) scaleY(${(0.02 + 0.98 * open).toFixed(3)}) scaleX(${(0.6 + 0.4 * open).toFixed(3)})` });
    s.lines.forEach((ln, i) => {
      const p = prog(b, 3.8 + i * 0.25, 4.3 + i * 0.25, E.outCubic);
      css(ln, { opacity: p.toFixed(3), transform: `translateX(${(-16 * (1 - p)).toFixed(1)}px)`, filter: p < 1 ? `blur(${(6 * (1 - p)).toFixed(1)}px)` : "none" });
    });
    css(s.scan, { transform: `translateY(${kf(b, [[5.5, -140], [6.6, 420]]).toFixed(0)}px)`, opacity: life(b, 5.5, 5.7, 6.4, 6.6).toFixed(2) });

    revealChars(s.capChars, b, 4.4, 0.07, 0.6, [7.2, 7.7, 0.015]);
    css(s.capEn, { opacity: (life(b, 5.2, 5.8, 7.2, 7.6) * 0.9).toFixed(3) });

    // 推镜：最后两拍往文档里压
    const push = kf(b, [[5.8, 1, E.inCubic], [8, 1.55]]);
    const tilt = kf(b, [[5.8, 0, E.inCubic], [8, 8]]);
    css(s.cam, { transform: `perspective(1400px) scale(${push.toFixed(4)}) rotateX(${tilt.toFixed(2)}deg)` });
  },
};
```

### 20/30 · `promo/src/js/scenes/link.js`
<!-- casebook-file {"path": "promo/src/js/scenes/link.js", "lines": 79, "final_newline": true, "sha256": "28bbf86ee2d7822180913e2590b355e0c3ccfc8eb2973faa290b4344147a15ae", "original_sha256": "28bbf86ee2d7822180913e2590b355e0c3ccfc8eb2973faa290b4344147a15ae"} -->
```js
// b52–60 链：库存居中，逐拍把符号链接挂到 8 个 Agent；改一处，全局同步。
import { T } from "../theme.js";
import { CLIENTS } from "../data.js";
import { E, css, el, hit, kf, prog, svg, toggle } from "../engine.js";
import { logoSVG } from "../ui.js";
import { caption, chapter, updateCaption, updateChapter } from "./chapter.js";

const CX = 960;
const CY = 560;
let s;

export default {
  id: "link",
  start: 52,
  end: 60,
  mount(root) {
    s = {};
    s.cam = el("div", "abs", root);
    s.cam.style.cssText = "inset:0;transform-origin:960px 560px;";
    s.svg = svg("svg", { width: 1920, height: 1080, viewBox: "0 0 1920 1080", style: "position:absolute;inset:0;overflow:visible" }, s.cam);
    s.nodes = CLIENTS.map((c, i) => {
      const a = (-90 + 22.5 + i * 45) * (Math.PI / 180);
      const x = CX + Math.cos(a) * 640;
      const y = CY + Math.sin(a) * 320;
      const len = Math.hypot(x - CX, y - CY);
      const line = svg("line", { x1: CX, y1: CY, x2: x, y2: y, stroke: `rgba(${T.accentRGB},.85)`, "stroke-width": 2, "stroke-dasharray": len, "stroke-dashoffset": len }, s.svg);
      const dot = svg("circle", { r: 5, fill: T.accent, opacity: 0 }, s.svg);
      const n = el("div", "node", s.cam);
      n.style.left = `${x}px`;
      n.style.top = `${y}px`;
      el("i", "sh-client-dot", n).style.cssText = `width:12px;height:12px;border-radius:4px;background:${c.color}`;
      el("div", "", n, `<div class="n-name">${c.name}</div><div class="n-path">${c.path}/pptx <span class="volt">→</span></div>`);
      const ok = el("div", "sh-chip is-volt", n, "✓ 已同步");
      ok.style.cssText += "margin-left:6px;opacity:0;";
      return { n, line, dot, len, x, y, ok, at: 52 + i };
    });

    s.hub = el("div", "abs", s.cam);
    s.hub.style.cssText = `left:${CX - 90}px;top:${CY - 90}px;width:180px;height:180px;display:grid;place-items:center;border-radius:50%;background:radial-gradient(closest-side,rgba(${T.glowRGB},.22),transparent);`;
    el("div", "", s.hub, logoSVG(110));
    s.hubLabel = el("div", "abs", s.cam, "<div style='font-size:18px;font-weight:600'>skills-hub</div><div class='sh-hash' style='margin-top:4px'>~/.skills-hub/skills/pptx</div>");
    s.hubLabel.style.cssText += `left:${CX - 200}px;width:400px;top:${CY + 88}px;text-align:center;`;

    s.edit = el("div", "abs sh-card", s.cam);
    s.edit.style.cssText += `left:${CX - 190}px;top:${CY - 200}px;width:380px;padding:12px 16px;font-family:var(--sh-mono);font-size:14px;`;
    s.edit.innerHTML = "<div class='dim'>pptx/SKILL.md · 修改</div><div style='margin-top:6px'><span style='color:var(--sh-err)'>- version: 1</span></div><div><span class='volt'>+ version: 2</span></div>";

    s.ch = chapter(root, "02", "链", "LINK");
    s.cap = caption(root, "改一处，全局生效。不漂移。", "ONE SOURCE · SYMLINKED INTO EVERY AGENT");
  },
  update(b) {
    updateChapter(s.ch, b, 52, 60);
    css(s.cam, { transform: `scale(${kf(b, [[52, 1.12, E.outExpo], [53.5, 1], [60, 0.96]]).toFixed(4)}) rotate(${kf(b, [[52, -1.5], [60, 1.5]]).toFixed(2)}deg)` });
    css(s.hub, { transform: `scale(${(prog(b, 52, 52.4, E.outBack) * (1 + 0.12 * hit(b, 58.5, 0.3))).toFixed(3)})` });
    css(s.hubLabel, { opacity: prog(b, 52.2, 52.6).toFixed(2) });

    const wave = hit(b, 58.5, 0.5);
    s.nodes.forEach((nd, i) => {
      const draw = prog(b, nd.at - 0.2, nd.at + 0.15, E.outExpo);
      nd.line.setAttribute("stroke-dashoffset", (nd.len * (1 - draw)).toFixed(1));
      nd.line.setAttribute("stroke-width", (2 + 3 * wave).toFixed(2));
      nd.line.setAttribute("stroke", `rgba(${T.accentRGB},${(0.55 + 0.45 * Math.max(wave, hit(b, nd.at, 0.3))).toFixed(3)})`);
      const appear = prog(b, nd.at - 0.35, nd.at, E.outBack);
      css(nd.n, { opacity: appear.toFixed(3), transform: `translate(-50%,-50%) scale(${(0.7 + 0.3 * appear + 0.06 * hit(b, nd.at + 0.15, 0.2)).toFixed(3)})` });
      toggle(nd.n, "is-lit", b >= nd.at + 0.1);
      // 链上流动的光点；改动时一起冲向外侧
      const cycle = b >= 58.5 ? prog(b, 58.5, 59.2, E.outCubic) : ((b - nd.at) * 0.8 + i * 0.13) % 1;
      const on = b >= nd.at + 0.15;
      nd.dot.setAttribute("cx", (CX + (nd.x - CX) * cycle).toFixed(1));
      nd.dot.setAttribute("cy", (CY + (nd.y - CY) * cycle).toFixed(1));
      nd.dot.setAttribute("opacity", on ? (b >= 58.5 ? 1 - cycle * 0.3 : 0.8).toFixed(2) : "0");
      nd.dot.setAttribute("r", b >= 58.5 ? "7" : "4.5");
      css(nd.ok, { opacity: prog(b, 59 + i * 0.03, 59.2 + i * 0.03).toFixed(2) });
    });
    const e = prog(b, 57.8, 58.2, E.outBack);
    css(s.edit, { opacity: (e * (1 - prog(b, 59.4, 59.8))).toFixed(3), transform: `translateY(${(20 * (1 - e)).toFixed(1)}px) scale(${(0.9 + 0.1 * e).toFixed(3)})` });
    updateCaption(s.cap, b, 55.8, 60);
  },
};
```

### 21/30 · `promo/src/js/scenes/see.js`
<!-- casebook-file {"path": "promo/src/js/scenes/see.js", "lines": 80, "final_newline": true, "sha256": "5f32b9cf3373a46e65a4cb210948b377d98f7474f22a51e58decc5f86d72e106", "original_sha256": "5f32b9cf3373a46e65a4cb210948b377d98f7474f22a51e58decc5f86d72e106"} -->
```js
// b60–68 看：重做后的总览页从透视里落定，镜头依次推到 KPI、图表、列表。
import { T } from "../theme.js";
import { E, css, el, hit, kf, prog, rollNum, toggle } from "../engine.js";
import { buildApp } from "../ui.js";
import { chapter, updateChapter } from "./chapter.js";

let s;

export default {
  id: "see",
  start: 60,
  end: 68,
  post: 0,
  mount(root) {
    s = {};
    s.stage = el("div", "abs", root);
    s.stage.style.cssText = "inset:0;perspective:2200px;";
    s.cam = el("div", "abs", s.stage);
    s.cam.style.cssText = "left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;";
    s.ui = buildApp(s.cam);
    s.ui.app.style.left = "160px";
    s.ui.app.style.top = "110px";
    s.ch = chapter(root, "03", "看", "SEE");
    s.cap = el("div", "abs", root);
    s.cap.style.cssText = "right:96px;top:92px;text-align:right;";
    el("div", "kt", s.cap, "一个地方，统一看。").style.cssText = "font-size:34px;font-weight:700;";
    el("div", "cap", s.cap, "ONE PLACE TO SEE EVERYTHING").style.marginTop = "10px";
  },
  update(b) {
    updateChapter(s.ch, b, 60, 62.1);
    css(s.cap, { opacity: (prog(b, 60.6, 61.2) * (1 - prog(b, 61.9, 62.3))).toFixed(3) });

    // 入场：从倾斜的远处落到正面
    const land = prog(b, 60, 61.8, E.outExpo);
    const rx = 32 * (1 - land);
    const rz = -10 * (1 - land);
    const ty = 380 * (1 - land);
    css(s.stage, { opacity: prog(b, 60, 60.3).toFixed(2) });

    // 镜头：[缩放, 焦点x, 焦点y]，焦点是窗口内要对准画面中心的点
    const [z, fx, fy] = kf(b, [
      [60, [0.86, 960, 580]],
      [62.2, [0.86, 960, 580], E.inOutExpo],
      [63.2, [1.45, 900, 380]],
      [64.2, [1.45, 900, 380], E.inOutExpo],
      [65.1, [1.3, 830, 600]],
      [65.8, [1.3, 830, 600], E.inOutExpo],
      [66.5, [1.35, 960, 870]],
      [67.3, [1.35, 960, 870], E.inOutCubic],
      [68, [0.9, 960, 560]],
    ]);
    const tx = 960 - fx * z;
    const tyy = 580 - fy * z;
    const pan = Math.abs(z - kf(b - 0.05, [[60, 0.86], [62.2, 0.86, E.inOutExpo], [63.2, 1.45], [64.2, 1.45, E.inOutExpo], [65.1, 1.3], [65.8, 1.3, E.inOutExpo], [66.5, 1.35], [67.3, 1.35, E.inOutCubic], [68, 0.9]]));
    css(s.cam, {
      transform: `translate(${tx.toFixed(1)}px,${(tyy + ty).toFixed(1)}px) scale(${z.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`,
      filter: pan > 0.02 ? `blur(${Math.min(6, pan * 60).toFixed(1)}px)` : "none",
    });

    s.ui.kpis.forEach((k, i) => {
      const at = 61 + i * 0.25;
      k.num.textContent = String(rollNum(b, at, at + 1.2, 0, k.value));
      toggle(k.card, "is-lit", b >= 62 + i * 0.5 && b < 62.5 + i * 0.5);
    });
    s.ui.bars.forEach((bar, i) => {
      const at = 62.5 + i * 0.12;
      const p = prog(b, at, at + 0.9, E.outBack);
      const max = 92;
      css(bar.ba, { height: `${(Math.max(0, p) * (bar.a / max) * 190).toFixed(1)}px` });
      css(bar.bb, { height: `${(Math.max(0, p) * (bar.v / max) * 190 * 0.9).toFixed(1)}px` });
      bar.num.textContent = String(Math.round(Math.max(0, Math.min(1, p)) * (bar.a + bar.v)));
    });
    s.ui.rows.forEach((r, i) => {
      const on = b >= 66 + i * 0.25;
      toggle(r.sw, "is-on", on);
      css(r.row, { background: on ? `rgba(${T.glowRGB},${(0.16 * hit(b, 66 + i * 0.25, 0.4)).toFixed(3)})` : "transparent" });
    });
    toggle(s.ui.adopt, "is-pressed", b >= 67.4 && b < 67.55);
  },
};
```

### 22/30 · `promo/src/js/scenes/share.js`
<!-- casebook-file {"path": "promo/src/js/scenes/share.js", "lines": 118, "final_newline": true, "sha256": "2ff01599b9d2146cabfd25e3d495e4b4b6dd9e3a791fc643e75789bb0be1a002", "original_sha256": "2ff01599b9d2146cabfd25e3d495e4b4b6dd9e3a791fc643e75789bb0be1a002"} -->
```js
// b68–76 享：左半推到社团仓库并分发链接；甩镜到右半，Agent 帮你启用 skill。
import { T } from "../theme.js";
import { TEAM } from "../data.js";
import { E, css, el, hit, kf, prog, revealChars, split, svg, toggle } from "../engine.js";
import { icon } from "../ui.js";
import { caption, chapter, updateCaption, updateChapter } from "./chapter.js";

let s;
const USER_MSG = "帮我找一个做 PPT 的 skill，启用到 Codex 和 Cursor。";

export default {
  id: "share",
  start: 68,
  end: 76,
  mount(root) {
    s = {};
    s.track = el("div", "abs", root);
    s.track.style.cssText = "left:0;top:0;width:3840px;height:1080px;";

    // 左半：分享
    const L = el("div", "abs", s.track);
    L.style.cssText = "left:0;top:0;width:1920px;height:1080px;";
    s.dialog = el("div", "abs sh-dialog", L);
    s.dialog.style.cssText += "left:150px;top:250px;transform-origin:0 0;";
    el("h3", "", s.dialog, "分享到社团仓库");
    el("p", "", s.dialog, "授信成员直接写入，别人用链接从统一的地方拿。");
    el("div", "sh-field", s.dialog, `<span class="sh-field-label">仓库</span>${icon("git").replace("<svg", "<svg width='16' height='16' stroke='currentColor' fill='none' stroke-width='2'")}github.com/club/skills`);
    el("div", "sh-field", s.dialog, "<span class='sh-field-label'>Skill</span>frontend-design <span class='sh-chip is-volt' style='margin-left:auto'>anthropics/skills</span>");
    el("div", "sh-field", s.dialog, "<span class='sh-field-label'>分支</span>main");
    const actions = el("div", "", s.dialog);
    actions.style.cssText = "display:flex;justify-content:flex-end;gap:10px;margin-top:18px;";
    el("div", "sh-btn", actions, "取消");
    s.push = el("div", "sh-btn is-primary", actions, `${icon("link")}推送并复制链接`);
    s.toast = el("div", "abs sh-toast", L, `<span class="volt">✓</span> 链接已复制 <code>skills-hub add club/skills/frontend-design</code>`);
    s.toast.style.cssText += "left:150px;top:820px;transform-origin:0 0;";

    s.lines = svg("svg", { width: 1920, height: 1080, style: "position:absolute;inset:0;overflow:visible" }, L);
    s.repo = el("div", "node", L, `${icon("git").replace("<svg", "<svg width='22' height='22' stroke='var(--sh-volt)' fill='none' stroke-width='2'")}<div><div class="n-name">club/skills</div><div class="n-path">社团共享仓库 · 零服务器</div></div>`);
    s.repo.style.left = "1180px";
    s.repo.style.top = "540px";
    s.repoLine = svg("path", { d: "M 960 540 C 1000 540, 1030 540, 1070 540", stroke: `rgba(${T.accentRGB},.9)`, "stroke-width": 2, fill: "none", "stroke-dasharray": 120, "stroke-dashoffset": 120 }, s.lines);
    s.members = TEAM.concat([{ handle: "@nagi", color: "#ff6f91" }]).map((m, i) => {
      const y = 300 + i * 120;
      const x = 1640;
      const p = svg("path", { d: `M 1300 540 C 1450 540, 1480 ${y}, ${x - 40} ${y}`, stroke: `rgba(${T.accentRGB},.7)`, "stroke-width": 1.6, fill: "none", "stroke-dasharray": 520, "stroke-dashoffset": 520 }, s.lines);
      const n = el("div", "abs", L);
      n.style.cssText = `left:${x - 30}px;top:${y - 30}px;display:flex;align-items:center;gap:14px;white-space:nowrap;`;
      el("div", "sh-avatar", n, m.handle[1].toUpperCase()).style.cssText = `width:60px;height:60px;font-size:22px;background:${m.color}`;
      el("div", "", n, `<div style="font-family:var(--sh-mono);font-size:16px">${m.handle}</div><div class="dim" style="font-size:13px;margin-top:4px">已拉取 · frontend-design</div>`);
      return { p, n, at: 70.6 + i * 0.18 };
    });

    // 右半：Agent
    const R = el("div", "abs", s.track);
    R.style.cssText = "left:1920px;top:0;width:1920px;height:1080px;";
    s.chat = el("div", "abs sh-chat", R);
    s.chat.style.cssText += "left:620px;top:150px;transform-origin:50% 0;";
    el("div", "sh-chat-head", s.chat, `${icon("agent").replace("<svg", "<svg width='18' height='18' stroke='var(--sh-volt)' fill='none' stroke-width='1.8'")}Agent · 库存管家<span class="sh-chip">写操作 · 先批准</span>`);
    s.user = el("div", "sh-msg is-user", s.chat);
    s.userChars = split(s.user, USER_MSG);
    s.agent = el("div", "sh-msg is-agent", s.chat, "找到 <code>pptx</code>（anthropics/skills），库存里已有，还没链到 Codex 和 Cursor。");
    s.tool = el("div", "sh-tool", s.chat);
    s.toolStatus = el("span", "sh-chip", null, "待批准");
    const top = el("div", "sh-tool-top", s.tool, `${icon("link").replace("<svg", "<svg width='16' height='16' stroke='currentColor' fill='none' stroke-width='2'")}enable_links`);
    top.appendChild(s.toolStatus);
    el("div", "sh-tool-args", s.tool, `{ skill: "pptx", apps: ["codex", "cursor"] }`);
    s.toolActions = el("div", "sh-tool-actions", s.tool);
    s.approve = el("div", "sh-btn is-primary", s.toolActions, "批准");
    el("div", "sh-btn", s.toolActions, "拒绝");
    s.final = el("div", "sh-msg is-agent", s.chat, "<span class='volt'>✓</span> 已启用到 Codex、Cursor。新开对话即可使用。");
    el("div", "sh-input", s.chat, "问问你的库存…");

    s.ch = chapter(root, "04", "享", "SHARE");
    s.capL = caption(root, "授信成员直接写 · 链接分发 · 零服务器", "SHARE THROUGH ONE TRUSTED REPO");
    s.capR = caption(root, "Agent 帮你管库存，写操作先批准。", "AN AGENT FOR YOUR INVENTORY");
  },
  update(b) {
    updateChapter(s.ch, b, 68, 76);
    // 甩镜：b71.75–72.25
    const whip = prog(b, 71.7, 72.2, E.inOutExpo);
    const speed = Math.sin(Math.PI * whip);
    css(s.track, { transform: `translateX(${(-1920 * whip).toFixed(1)}px)`, filter: speed > 0.05 ? `blur(${(speed * 18).toFixed(1)}px)` : "none" });

    const d = prog(b, 68, 68.6, E.outExpo);
    css(s.dialog, { opacity: d.toFixed(3), transform: `translateY(${(40 * (1 - d)).toFixed(1)}px) scale(${(1.3 * (0.96 + 0.04 * d)).toFixed(3)})` });
    toggle(s.push, "is-pressed", b >= 69.6 && b < 69.85);
    const t = prog(b, 70, 70.4, E.outBack);
    css(s.toast, { opacity: t.toFixed(3), transform: `translateY(${(30 * (1 - t)).toFixed(1)}px) scale(1.25)` });
    s.repoLine.setAttribute("stroke-dashoffset", (120 * (1 - prog(b, 69.8, 70.3, E.outExpo))).toFixed(1));
    const rp = prog(b, 70.1, 70.5, E.outBack);
    css(s.repo, { opacity: rp.toFixed(3), transform: `translate(-50%,-50%) scale(${(0.8 + 0.2 * rp + 0.08 * hit(b, 70.3, 0.2)).toFixed(3)})` });
    toggle(s.repo, "is-lit", b >= 70.3);
    s.members.forEach((m) => {
      m.p.setAttribute("stroke-dashoffset", (520 * (1 - prog(b, m.at - 0.2, m.at + 0.2, E.outExpo))).toFixed(1));
      const a = prog(b, m.at, m.at + 0.35, E.outBack);
      css(m.n, { opacity: a.toFixed(3), transform: `translateX(${(30 * (1 - a)).toFixed(1)}px) scale(${(0.8 + 0.2 * a).toFixed(3)})` });
    });

    revealChars(s.userChars, b, 72.3, 0.022, 0.25);
    css(s.user, { opacity: prog(b, 72.25, 72.35).toFixed(2) });
    const ag = prog(b, 73.2, 73.6, E.outCubic);
    css(s.agent, { opacity: ag.toFixed(3), transform: `translateY(${(10 * (1 - ag)).toFixed(1)}px)`, clipPath: `inset(0 ${(100 * (1 - prog(b, 73.2, 73.9))).toFixed(1)}% 0 0)` });
    const tl = prog(b, 73.8, 74.2, E.outBack);
    css(s.tool, { opacity: tl.toFixed(3), transform: `translateY(${(16 * (1 - tl)).toFixed(1)}px)` });
    const approved = b >= 74.5;
    toggle(s.approve, "is-pressed", b >= 74.4 && b < 74.6);
    toggle(s.toolStatus, "is-volt", approved);
    const status = approved ? "✓ 已完成" : "待批准";
    if (s.toolStatus.textContent !== status) s.toolStatus.textContent = status;
    css(s.toolActions, { opacity: approved ? (1 - prog(b, 74.6, 74.9)).toFixed(2) : "1", height: approved && b > 74.9 ? "0px" : "36px", marginTop: approved && b > 74.9 ? "0px" : "12px", overflow: "hidden" });
    const fin = prog(b, 75, 75.4, E.outCubic);
    css(s.final, { opacity: fin.toFixed(3), transform: `translateY(${(10 * (1 - fin)).toFixed(1)}px)` });
    css(s.chat, { transform: `translateY(${kf(b, [[72, 40], [72.6, 0, E.outExpo], [76, -10]]).toFixed(1)}px) scale(1.32)` });

    updateCaption(s.capL, b, 68.6, 71.7);
    updateCaption(s.capR, b, 72.4, 76);
  },
};
```

### 23/30 · `promo/src/js/scenes/store.js`
<!-- casebook-file {"path": "promo/src/js/scenes/store.js", "lines": 126, "final_newline": true, "sha256": "b836ccc17624f9f07120b7bdd7271e2f912ffb66e7fe39f08615797cacd3d9b3", "original_sha256": "b836ccc17624f9f07120b7bdd7271e2f912ffb66e7fe39f08615797cacd3d9b3"} -->
```js
// b44–52 收：散落的副本被吸进统一库存，581 → 213，按内容哈希去重。
import { T } from "../theme.js";
import { ROOTS, SCAN, SKILLS } from "../data.js";
import { E, clamp, css, el, fakeHash, hit, kf, lerp, prog, rng, rollNum } from "../engine.js";
import { glyph, logoSVG } from "../ui.js";
import { caption, chapter, updateCaption, updateChapter } from "./chapter.js";

const SX = 700;
const SY = 560;
let s;

export default {
  id: "store",
  start: 44,
  end: 52,
  mount(root) {
    s = {};
    const r = rng(44);
    s.ch = chapter(root, "01", "收", "STORE");

    s.tiles = Array.from({ length: 64 }, (_, i) => {
      const [name, src] = SKILLS[i % SKILLS.length];
      const t = el("div", "tile", root);
      glyph(name, src, t);
      const m = el("div", "t-meta", t);
      el("div", "t-name", m, name);
      el("div", "t-src", m, ROOTS[(i * 5) % ROOTS.length]);
      const a = r() * Math.PI * 2;
      const d = 700 + r() * 700;
      return { t, x0: SX + Math.cos(a) * d * 1.3, y0: SY + Math.sin(a) * d * 0.7, s0: 0.5 + r() * 0.8, rot: (r() - 0.5) * 50, at: 44 + r() * 2.6, dur: 0.7 + r() * 0.5 };
    });

    // 库存面板：先是一个小盒子，收完后展开成列表
    s.panel = el("div", "abs sh-card", root);
    s.panel.style.cssText += `left:${SX}px;top:${SY}px;overflow:hidden;border-radius:18px;background:var(--sh-bg-2);`;
    s.head = el("div", "", s.panel);
    s.head.style.cssText = "display:flex;align-items:center;gap:14px;height:84px;padding:0 24px;border-bottom:1px solid var(--sh-line);white-space:nowrap;";
    el("div", "", s.head, logoSVG(34));
    el("div", "", s.head, "<div style='font-size:18px;font-weight:600'>统一库存</div><div class='sh-hash' style='margin-top:4px'>~/.skills-hub/skills</div>");
    s.headCount = el("div", "sh-chip is-volt", s.head, "213 个 skill");
    s.headCount.style.marginLeft = "auto";

    const rows = [
      ["pptx", "anthropic", 17], ["frontend-design", "anthropic", 25], ["systematic-debugging", "superpowers", 17],
      ["demo-init", "local", 26, "A"], ["demo-init", "local", 26, "B"], ["skill-creator", "anthropic", 14], ["remotion-best-practices", "remotion", 10],
    ];
    s.rows = rows.map(([name, src, copies, variant]) => {
      const row = el("div", "", s.panel);
      row.style.cssText = "display:grid;grid-template-columns:36px 1fr 150px 180px;align-items:center;gap:14px;height:58px;padding:0 24px;border-bottom:1px solid var(--sh-line);white-space:nowrap;";
      glyph(name, src, row);
      el("div", "sh-row-name", row, `${name}${variant ? ` <span class='sh-chip' style='height:20px;margin-left:8px;color:var(--sh-c-amber);border-color:rgba(255,181,71,.4)'>变体 ${variant}</span>` : ""}`);
      el("div", "sh-hash", row, `<b>sha256</b> ${fakeHash(name + (variant ?? ""), 8)}`);
      el("div", "", row, `<span class='dim' style='font-family:var(--sh-mono);font-size:13px'>${variant ? 13 : copies} 份副本 → </span><span class='volt' style='font-family:var(--sh-mono);font-size:13px'>1</span>`);
      return row;
    });

    s.counter = el("div", "abs", root);
    s.counter.style.cssText = "left:1340px;top:330px;";
    s.num = el("div", "kt-en", s.counter);
    s.num.style.cssText = "font-size:200px;font-family:var(--sh-font);font-weight:600;letter-spacing:-0.05em;font-variant-numeric:tabular-nums;";
    s.numLabel = el("div", "kt", s.counter);
    s.numLabel.style.cssText = "margin-top:10px;font-size:44px;font-weight:700;";
    s.numEn = el("div", "cap", s.counter);
    s.numEn.style.marginTop = "14px";

    s.cap = caption(root, "按整个文件夹的内容哈希去重，不按文件名。", "DEDUPED BY CONTENT HASH · NOT BY FILE NAME");
  },
  update(b, ctx) {
    updateChapter(s.ch, b, 44, 52);
    const g = ctx.fx;
    let pulse = 0;
    s.tiles.forEach((tl) => {
      const p = prog(b, tl.at, tl.at + tl.dur, E.inCubic);
      const pb = prog(b - 0.07, tl.at, tl.at + tl.dur, E.inCubic);
      if (p >= 1) {
        css(tl.t, { opacity: "0" });
        pulse += hit(b, tl.at + tl.dur, 0.25);
        return;
      }
      const x = lerp(tl.x0, SX, p);
      const y = lerp(tl.y0, SY, p);
      const sc = lerp(tl.s0, 0.15, p);
      css(tl.t, { opacity: (clamp(prog(b, 44, 44.3)) * (1 - p * p)).toFixed(3), transform: `translate(${(x - 116).toFixed(1)}px,${(y - 36).toFixed(1)}px) rotate(${(tl.rot * (1 - p)).toFixed(1)}deg) scale(${sc.toFixed(3)})` });
      if (p > 0.05) {
        const xb = lerp(tl.x0, SX, pb);
        const yb = lerp(tl.y0, SY, pb);
        const grad = g.createLinearGradient(xb, yb, x, y);
        grad.addColorStop(0, `rgba(${T.trail},0)`);
        grad.addColorStop(1, `rgba(${T.trail},${(0.55 * p).toFixed(3)})`);
        g.strokeStyle = grad;
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(xb, yb);
        g.lineTo(x, y);
        g.stroke();
      }
    });

    const open = prog(b, 47.6, 48.6, E.outExpo);
    const pw = lerp(380, 820, open);
    const ph = lerp(86, 86 + 58 * 7, open);
    const px = kf(b, [[47.6, SX], [48.6, 660, E.outExpo]]);
    css(s.panel, {
      width: `${pw.toFixed(1)}px`,
      height: `${ph.toFixed(1)}px`,
      transform: `translate(${(px - SX - pw / 2).toFixed(1)}px,${(-ph / 2).toFixed(1)}px) scale(${(kf(b, [[44, 0.6, E.outBack], [44.5, 1]]) * (1 + 0.04 * Math.min(1, pulse)) * lerp(1, 1.2, open)).toFixed(4)})`,
      opacity: prog(b, 44, 44.3).toFixed(2),
      boxShadow: `0 0 0 1px rgba(${T.accentRGB},${(0.2 + 0.5 * Math.min(1, pulse)).toFixed(3)}), 0 0 ${(30 + 60 * Math.min(1, pulse)).toFixed(0)}px -6px rgba(${T.glowRGB},${(0.2 + 0.5 * Math.min(1, pulse)).toFixed(3)})`,
    });
    css(s.headCount, { opacity: prog(b, 48.2, 48.6).toFixed(2) });
    s.rows.forEach((row, i) => {
      const p = prog(b, 48.4 + i * 0.25, 48.9 + i * 0.25, E.outCubic);
      css(row, { opacity: p.toFixed(3), transform: `translateY(${(14 * (1 - p)).toFixed(1)}px)`, background: i >= 3 && i <= 4 && b > 50 ? "rgba(255,181,71,.06)" : "transparent" });
    });

    const n = rollNum(b, 45, 48, SCAN.copies, SCAN.unique, E.inOutCubic);
    s.num.textContent = String(n);
    const done = b >= 48;
    s.numLabel.textContent = done ? "个真正不同的 skill" : "份副本";
    s.numEn.textContent = done ? "UNIQUE BY CONTENT" : "COPIES FLOWING IN";
    css(s.counter, { opacity: prog(b, 44.4, 44.9).toFixed(2), transform: `scale(${(1 + 0.08 * hit(b, 48, 0.2)).toFixed(3)})`, transformOrigin: "left center" });
    css(s.num, { color: done ? "var(--sh-volt)" : "var(--sh-ink)" });

    updateCaption(s.cap, b, 48.8, 52);
  },
};
```

### 24/30 · `promo/src/js/scenes/team.js`
<!-- casebook-file {"path": "promo/src/js/scenes/team.js", "lines": 83, "final_newline": true, "sha256": "6863c3f77302190c9159ae148eb1dac84cbeb74070b2445e2c483f11de584587", "original_sha256": "6863c3f77302190c9159ae148eb1dac84cbeb74070b2445e2c483f11de584587"} -->
```js
// b88–96 每个人在用什么：成员主页卡逐拍滑入，接社团精选排行。
import { T } from "../theme.js";
import { SKILLS, TEAM } from "../data.js";
import { E, clamp, css, el, hit, kf, prog, toggle } from "../engine.js";
import { glyph } from "../ui.js";
import { chapter, updateChapter } from "./chapter.js";

const BOARD = [
  ["frontend-design", 18], ["systematic-debugging", 15], ["pptx", 13], ["vercel-react-best-practices", 11], ["brainstorming", 9],
];
let s;

export default {
  id: "team",
  start: 88,
  end: 96,
  mount(root) {
    s = {};
    s.head = el("div", "abs", root);
    s.head.style.cssText = "right:96px;top:92px;text-align:right;";
    el("div", "kt", s.head, "每个人在用什么，一目了然。").style.cssText = "font-size:34px;font-weight:700;";
    el("div", "cap", s.head, "PROFILES · PINS · CLUB PICKS").style.marginTop = "10px";

    s.cards = TEAM.map((m, i) => {
      const c = el("div", "abs sh-card", root);
      c.style.cssText += `left:${150 + i * 420}px;top:250px;width:380px;padding:26px;border-radius:20px;`;
      const top = el("div", "", c);
      top.style.cssText = "display:flex;align-items:center;gap:16px;";
      el("div", "sh-avatar", top, m.handle[1].toUpperCase()).style.cssText = `width:64px;height:64px;font-size:24px;background:${m.color}`;
      el("div", "", top, `<div style="font-family:var(--sh-mono);font-size:20px">${m.handle}</div><div style="margin-top:8px"><span class="sh-chip">${m.role}</span></div>`);
      el("div", "", c, `<div style="margin-top:24px;font-size:14px;color:var(--sh-ink-3)">在用</div><div style="font-size:48px;font-weight:600;letter-spacing:-0.04em;margin-top:4px">${m.n}<span style="font-size:18px;color:var(--sh-ink-3);margin-left:6px">个 skill</span></div>`);
      el("div", "", c, "<div style='margin:20px 0 10px;padding-top:18px;border-top:1px solid var(--sh-line);font-size:12px;letter-spacing:.12em;color:var(--sh-ink-3)'>置顶</div>");
      m.pins.forEach((p) => {
        const src = SKILLS.find((x) => x[0] === p)[1];
        const row = el("div", "", c);
        row.style.cssText = "display:flex;align-items:center;gap:12px;height:48px;";
        glyph(p, src, row);
        el("div", "sh-row-name", row, p).style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--sh-mono);font-size:14px;";
      });
      return { c, at: 88 + i * 0.5 };
    });

    s.board = el("div", "abs sh-card", root);
    s.board.style.cssText += "left:460px;top:290px;width:1000px;padding:28px 32px;border-radius:22px;";
    el("div", "", s.board, "<div style='display:flex;align-items:center'><div style='font-size:24px;font-weight:600'>社团精选 · 本周</div><span class='sh-chip is-volt' style='margin-left:auto'>全站排行</span></div>");
    s.rows = BOARD.map(([name, n], i) => {
      const src = SKILLS.find((x) => x[0] === name)[1];
      const row = el("div", "", s.board);
      row.style.cssText = "display:grid;grid-template-columns:44px 40px 1fr 300px 90px;align-items:center;gap:16px;height:84px;border-bottom:1px solid var(--sh-line);";
      el("div", "", row, String(i + 1)).style.cssText = `font-family:var(--sh-mono);font-size:30px;color:${i === 0 ? "var(--sh-volt)" : "var(--sh-ink-3)"}`;
      glyph(name, src, row);
      el("div", "sh-row-name", row, name).style.fontSize = "18px";
      const track = el("div", "", row);
      track.style.cssText = "height:10px;border-radius:5px;background:var(--sh-surface-3);overflow:hidden;";
      const fill = el("div", "", track);
      fill.style.cssText = `height:100%;border-radius:5px;background:${i === 0 ? "var(--sh-volt-fill)" : "var(--sh-c-cyan)"};`;
      el("div", "", row, `${n} 人启用`).style.cssText = "font-family:var(--sh-mono);font-size:14px;color:var(--sh-ink-2);text-align:right;";
      return { row, fill, n, at: 92.2 + i * 0.25 };
    });

    s.ch = chapter(root, "06", "人", "TEAM");
  },
  update(b) {
    updateChapter(s.ch, b, 88, 96);
    css(s.head, { opacity: (prog(b, 88.3, 88.8) * (1 - prog(b, 95.5, 96))).toFixed(3) });
    const leave = prog(b, 91.6, 92.1, E.inExpo);
    s.cards.forEach((c, i) => {
      const p = prog(b, c.at, c.at + 0.5, E.outExpo);
      const y = -900 * prog(b, 91.6 + i * 0.05, 92.1 + i * 0.05, E.inExpo);
      css(c.c, { opacity: (clamp(p) * (1 - leave * 0.3)).toFixed(3), transform: `translate(${(700 * (1 - p)).toFixed(1)}px,${y.toFixed(1)}px) rotate(${(6 * (1 - p)).toFixed(2)}deg)`, display: b > 92.3 ? "none" : "block" });
      toggle(c.c, "is-lit", b >= c.at + 0.3 && b < c.at + 0.9);
    });
    const bIn = prog(b, 92, 92.5, E.outExpo);
    const zoom = kf(b, [[94.5, 1, E.inOutCubic], [95.6, 1.12], [96, 0.2, E.inExpo]]);
    css(s.board, { display: b >= 92 ? "block" : "none", opacity: (bIn * (1 - prog(b, 95.6, 96))).toFixed(3), transform: `translateY(${(80 * (1 - bIn)).toFixed(1)}px) scale(${(zoom * 1.2).toFixed(4)})` });
    s.rows.forEach((r, i) => {
      const p = prog(b, r.at, r.at + 0.35, E.outCubic);
      css(r.row, { opacity: p.toFixed(3), transform: `translateX(${(-30 * (1 - p)).toFixed(1)}px)` });
      css(r.fill, { width: `${(prog(b, r.at + 0.1, r.at + 0.9, E.outExpo) * (r.n / 18) * 100).toFixed(1)}%` });
      if (i === 0) css(r.row, { background: `rgba(${T.glowRGB},${(0.14 * prog(b, 94, 94.5) + 0.1 * hit(b, 94, 0.3)).toFixed(3)})` });
    });
  },
};
```

### 25/30 · `promo/src/js/scenes/title.js`
<!-- casebook-file {"path": "promo/src/js/scenes/title.js", "lines": 100, "final_newline": true, "sha256": "7e28fe7804c33ece5cac77f5ee98ba2398e946239bb98f3df96868ae38a5a8b5", "original_sha256": "7e28fe7804c33ece5cac77f5ee98ba2398e946239bb98f3df96868ae38a5a8b5"} -->
```js
// b40–44 冲击定名：Logo 从爆点里收束，字标逐字升起。
import { T } from "../theme.js";
import { E, clamp, css, el, hit, kf, prog, revealChars, split } from "../engine.js";
import { drawBurst, drawRing, makeBurst } from "../fx.js";
import { logoSVG } from "../ui.js";

let s;

export default {
  id: "title",
  start: 40,
  end: 44,
  mount(root) {
    s = {};
    s.glow = el("div", "abs", root);
    s.glow.style.cssText = `left:960px;top:470px;width:1400px;height:1400px;margin:-700px 0 0 -700px;background:radial-gradient(closest-side,rgba(${T.glowRGB},.26),rgba(${T.glowRGB},.05) 45%,transparent);`;
    s.cam = el("div", "abs", root);
    s.cam.style.cssText = "inset:0;transform-origin:960px 540px;";
    s.logo = el("div", "abs", s.cam, logoSVG(190));
    s.logo.style.cssText = "left:865px;top:375px;width:190px;height:190px;";
    s.spokes = [...s.logo.querySelectorAll(".lg-spoke")];
    s.nodes = [...s.logo.querySelectorAll(".lg-node")];
    s.spokes.forEach((l) => { l.setAttribute("stroke-dasharray", "30"); });

    const word = el("div", "abs", s.cam);
    word.style.cssText = "left:0;right:0;top:600px;text-align:center;overflow:hidden;padding-bottom:10px;";
    const inner = el("div", "kt-en", word);
    inner.style.fontSize = "150px";
    s.word = split(inner, "Skills Hub");

    s.tag = el("div", "abs", s.cam);
    s.tag.style.cssText = "left:0;right:0;top:800px;text-align:center;";
    const cn = el("div", "kt", s.tag);
    cn.style.cssText = "font-size:40px;font-weight:600;letter-spacing:0.01em;";
    s.tagChars = split(cn, "把团队散落的 Skills，收成一个系统。");
    s.tagEn = el("div", "cap", s.tag, "THE SKILL HUB FOR TEAMS");
    s.tagEn.style.marginTop = "16px";

    s.burst = makeBurst(40, 220, { speed: 1300, life: 2 });
    s.burst2 = makeBurst(41, 90, { speed: 500, life: 1.4, colors: T.burstSoft });
  },
  update(b, ctx) {
    const h = hit(b, 40, 0.5);
    const ls = kf(b, [[40, 2.6, E.outExpo], [40.9, 1], [43.4, 1.04, E.inCubic], [44, 3.2]]);
    css(s.logo, { transform: `scale(${ls.toFixed(4)}) rotate(${kf(b, [[40, -60, E.outExpo], [41, 0]]).toFixed(2)}deg)`, filter: `drop-shadow(0 0 ${(18 + 50 * h).toFixed(0)}px rgba(${T.glowRGB},.6))` });
    s.spokes.forEach((l, i) => {
      const p = prog(b, 40 + i * 0.04, 40.6 + i * 0.04, E.outExpo);
      l.setAttribute("stroke-dashoffset", (30 * (1 - p)).toFixed(2));
    });
    s.nodes.forEach((n, i) => {
      const p = prog(b, 40.2 + i * 0.05, 40.6 + i * 0.05, E.outBack);
      n.setAttribute("r", (4.6 * p).toFixed(2));
    });
    css(s.glow, { opacity: (0.5 + 0.8 * h).toFixed(3), transform: `scale(${(0.8 + 0.4 * h).toFixed(3)})` });

    s.word.forEach((c, i) => {
      const p = prog(b, 40.3 + i * 0.05, 41 + i * 0.05, E.outExpo);
      css(c, { transform: `translateY(${(110 * (1 - p)).toFixed(1)}%)`, opacity: p > 0 ? "1" : "0" });
    });
    revealChars(s.tagChars, b, 42, 0.03, 0.5);
    css(s.tagEn, { opacity: (prog(b, 42.4, 43) * 0.9).toFixed(2) });

    const out = prog(b, 43.4, 44, E.inCubic);
    css(s.cam, { opacity: (1 - out).toFixed(3), transform: `scale(${(1 + 0.25 * out).toFixed(3)})`, filter: out > 0 ? `blur(${(12 * out).toFixed(1)}px)` : "none" });

    const g = ctx.fx;
    g.globalCompositeOperation = T.blend;
    drawRing(g, b, 40, 960, 470, 1500, 1.4, T.accentRGB, 5);
    drawRing(g, b, 40.08, 960, 470, 900, 1.1, T.pop, 2);
    drawBurst(g, s.burst, b, 40, 960, 470);
    drawBurst(g, s.burst2, b, 40.05, 960, 470);
    g.globalCompositeOperation = "source-over";

    // 地面透视网格，慢慢亮起
    const grid = prog(b, 40.5, 42, E.outCubic) * (1 - out);
    if (grid > 0) {
      const bg = ctx.bg;
      bg.strokeStyle = `rgba(${T.grid},${(0.16 * grid).toFixed(3)})`;
      bg.lineWidth = 1;
      const horizon = 700;
      for (let i = -24; i <= 24; i++) {
        bg.beginPath();
        bg.moveTo(960 + i * 20, horizon);
        bg.lineTo(960 + i * 260, 1080);
        bg.stroke();
      }
      const off = (b * 0.35) % 1;
      for (let j = 0; j < 12; j++) {
        const z = (j + off) / 12;
        const y = horizon + (1080 - horizon) * z * z;
        bg.globalAlpha = clamp(z * 1.5);
        bg.beginPath();
        bg.moveTo(0, y);
        bg.lineTo(1920, y);
        bg.stroke();
      }
      bg.globalAlpha = 1;
    }
  },
};
```

### 26/30 · `promo/src/js/theme.js`
<!-- casebook-file {"path": "promo/src/js/theme.js", "lines": 56, "final_newline": true, "sha256": "caeab1e85468b1c7f7aae32395f61235edb0129b244013651ec68094aafce7e6", "original_sha256": "caeab1e85468b1c7f7aae32395f61235edb0129b244013651ec68094aafce7e6"} -->
```js
// 画布与特效用的主题色。CSS 的部分在 styles/tokens.css（:root 浅色，[data-theme="dark"] 深色）。
// 浅色是成片默认；?theme=dark 或 render.mjs --theme dark 切回深色。

const LIGHT = {
  name: "light",
  ink: "#0b0c0e",
  ink2: "#4a505a",
  ink3: "#8b919b",
  accent: "#4d7c0f", // 线、描边、强调文字
  accentRGB: "77,124,15",
  glowRGB: "150,215,20",
  fill: "#c8f53c", // 面：按钮、柱、Logo 核心
  pop: "10,12,16", // 冲击环第二圈
  blend: "source-over", // 浅底上加色混合看不见，用普通混合
  burst: ["#4d7c0f", "#9bd21f", "#0b0c0e"],
  burstSoft: ["#0b0c0e", "#9bd21f"],
  star: "#2b3038",
  point: "#353b44",
  pointScale: 1.45, // 浅底上深色小点显得稀，放大一些
  pointHot: "#5b9212",
  label: "#6b7280",
  satLabel: "#0b0c0e",
  glitch: [["#ff2a4d", "multiply"], ["#00b7ff", "multiply"]], // 深色镜头里 glitchText 会自己换成 screen
  trail: "77,124,15",
  grid: "77,124,15",
  arc: ["77,124,15", "14,150,200", "110,90,230"],
};

const DARK = {
  name: "dark",
  ink: "#f3f5f7",
  ink2: "#a3abb6",
  ink3: "#5c6470",
  accent: "#c8f53c",
  accentRGB: "200,245,60",
  glowRGB: "200,245,60",
  fill: "#c8f53c",
  pop: "255,255,255",
  blend: "lighter",
  burst: ["#c8f53c", "#e9ffb0", "#ffffff"],
  burstSoft: ["#ffffff", "#c8f53c"],
  star: "#e8f0ff",
  point: "#dfe7f0",
  pointScale: 1,
  pointHot: "#c8f53c",
  label: "#a3abb6",
  satLabel: "#f3f5f7",
  glitch: [["#ff2a4d", "screen"], ["#2af0ff", "screen"]],
  trail: "200,245,60",
  grid: "200,245,60",
  arc: ["200,245,60", "90,215,255", "162,147,255"],
};

const param = new URLSearchParams(location.search).get("theme");
export const T = param === "dark" ? DARK : LIGHT;
document.documentElement.dataset.theme = T.name;
```

### 27/30 · `promo/src/js/ui.js`
<!-- casebook-file {"path": "promo/src/js/ui.js", "lines": 142, "final_newline": true, "sha256": "51282a5da1a8f698d7ec7a3e7d14f4ce1175808b24f2547301ed6d6255c2fa64", "original_sha256": "51282a5da1a8f698d7ec7a3e7d14f4ce1175808b24f2547301ed6d6255c2fa64"} -->
```js
// 产品界面构件：Logo、图标、完整 App 窗口。样式在 styles/ui.css。
import { CLIENTS, SKILLS, SOURCES, glyphOf } from "./data.js";
import { el, fakeHash } from "./engine.js";

/** Hub 标志：中心库存 + 六条链接到各 Agent。 */
export function logoSVG(size = 64, color = "var(--sh-logo)", core = "var(--sh-logo-core)") {
  const nodes = [];
  const spokes = [];
  for (let k = 0; k < 6; k++) {
    const a = (-90 + k * 60) * (Math.PI / 180);
    const x = 32 + Math.cos(a) * 22;
    const y = 32 + Math.sin(a) * 22;
    spokes.push(`<line class="lg-spoke" x1="32" y1="32" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" />`);
    nodes.push(`<circle class="lg-node" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.6" />`);
  }
  return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none">
    <g stroke="${color}" stroke-width="3" stroke-linecap="round">${spokes.join("")}</g>
    <g fill="${color}">${nodes.join("")}</g><circle class="lg-core" cx="32" cy="32" r="8.5" fill="${core}" stroke="${color}" stroke-width="3" />
  </svg>`;
}

const ICONS = {
  overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  stats: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  skills: '<path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="m2 13 10 5 10-5"/><path d="m2 18 10 5 10-5" opacity=".5"/>',
  agent: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/><circle cx="12" cy="12" r="3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
  git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7M18 11.5c0 3-4 3-9.5 5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
};

export function icon(name) {
  return `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}

export function glyph(name, source, parent) {
  const g = el("div", "sh-glyph", parent, glyphOf(name));
  g.style.background = SOURCES[source].color;
  return g;
}

/** 整个总览页窗口。返回需要逐帧驱动的引用。 */
export function buildApp(parent) {
  const app = el("div", "sh-app", parent);
  const bar = el("div", "sh-titlebar", app);
  el("div", "sh-dots", bar, "<i></i><i></i><i></i>");
  el("div", "sh-title", bar, "Skills Hub — 总览");
  el("div", "sh-addr", bar, "127.0.0.1:4321");

  const body = el("div", "sh-body", app);
  const side = el("aside", "sh-sidebar", body);
  el("div", "sh-brand", side, `${logoSVG(26)}<span>Skills Hub</span>`);
  const navs = [
    ["overview", "总览", ""],
    ["stats", "统计", ""],
    ["skills", "Skills 管理", "213"],
    ["agent", "Agent", ""],
  ].map(([ic, label, count], i) => el("div", `sh-nav${i === 0 ? " is-active" : ""}`, side, `${icon(ic)}<span>${label}</span><span class="sh-count">${count}</span>`));
  el("div", "sh-nav-label", side, "已发现应用 · 27");
  CLIENTS.slice(0, 6).forEach((c, i) => {
    el("div", "sh-nav", side, `<i class="sh-client-dot" style="background:${c.color}"></i><span>${c.name}</span><span class="sh-count">${[186, 171, 158, 122, 97, 64][i]}</span>`);
  });
  el("div", "sh-spacer", side);
  el("div", "sh-nav", side, `${icon("settings")}<span>设置</span>`);

  const main = el("main", "sh-main", body);
  const head = el("div", "sh-head", main);
  el("div", "", head, "<h1>总览</h1><p>本机库存 <span class='sh-hash'>~/.skills-hub</span> · 上次扫描 2 分钟前</p>");
  const actions = el("div", "sh-actions", head);
  el("div", "sh-btn", actions, `${icon("scan")}扫描`);
  const adopt = el("div", "sh-btn is-primary", actions, `${icon("plus")}收录 Skill`);

  const kpis = el("div", "sh-kpis", main);
  const kpiDefs = [
    ["库存 Skills", 213, "", "去重自 <b>581</b> 份副本"],
    ["已发现应用", 27, "", "<b>8</b> 个常用客户端"],
    ["链接覆盖", 94, "%", "<b>+12%</b> 本周"],
    ["本周收录", 12, "", "来自 <b>GitHub</b> 与 skills.sh"],
  ];
  const kpiRefs = kpiDefs.map(([label, value, unit, foot]) => {
    const card = el("div", "sh-card sh-kpi", kpis);
    el("div", "sh-kpi-label", card, label);
    const v = el("div", "sh-kpi-value", card);
    const num = el("span", "", v, "0");
    if (unit) el("small", "", v, unit);
    el("div", "sh-kpi-foot", card, foot);
    return { card, num, value };
  });

  const grid = el("div", "", main);
  grid.style.cssText = "display:grid;grid-template-columns:1.75fr 1fr;gap:14px;";
  const chartCard = el("div", "sh-card", grid);
  const ch = el("div", "sh-card-head", chartCard, "用量 Top 8");
  el("div", "sh-legend sh-sub", ch, "<span><i style='background:var(--sh-volt-fill)'></i>启用</span><span><i style='background:var(--sh-c-cyan)'></i>查看</span>");
  const chart = el("div", "sh-chart", chartCard);
  const top = [
    ["frontend-design", 62, 30], ["systematic-debugging", 55, 28], ["pptx", 49, 31], ["vercel-react-best-practices", 44, 20],
    ["brainstorming", 40, 22], ["skill-creator", 34, 19], ["test-driven-development", 30, 15], ["find-skills", 26, 14],
  ];
  const bars = top.map(([name, a, v]) => {
    const b = el("div", "sh-bar", chart);
    const num = el("div", "sh-bar-num", b, String(a + v));
    const stack = el("div", "sh-bar-stack", b);
    const bb = el("div", "sh-bar-b", stack);
    const ba = el("div", "sh-bar-a", stack);
    el("div", "sh-bar-name", b, name);
    return { num, ba, bb, a, v };
  });

  const todo = el("div", "sh-card", grid);
  el("div", "sh-card-head", todo, "需要处理<span class='sh-sub'>3 项</span>");
  const todoList = el("div", "", todo);
  todoList.style.paddingTop = "8px";
  [
    ["var(--sh-warn)", "<b>demo-init</b> 有 2 个同名内容变体"],
    ["var(--sh-err)", "<b>10</b> 个目录缺少 name / description"],
    ["var(--sh-volt)", "<b>Codex</b> 还有 5 个 skill 未启用"],
    ["var(--sh-c-cyan)", "<b>club/skills</b> 有 4 个新分享"],
  ].forEach(([c, t]) => el("div", "sh-todo", todoList, `<i class="sh-todo-dot" style="background:${c}"></i><span>${t}</span>`));

  const listCard = el("div", "sh-card", main);
  el("div", "sh-card-head", listCard, "近期收录<span class='sh-sub'>按收录时间</span>");
  const list = el("div", "", listCard);
  list.style.padding = "6px 2px 4px";
  const rows = ["pptx", "frontend-design", "systematic-debugging", "remotion-best-practices"].map((name) => {
    const s = SKILLS.find((x) => x[0] === name);
    const row = el("div", "sh-row", list);
    glyph(name, s[1], row);
    el("div", "sh-row-name", row, name);
    el("div", "sh-row-desc", row, s[2]);
    const cl = el("div", "sh-row-clients", row);
    CLIENTS.slice(0, 4).forEach((c) => el("i", "sh-client-dot", cl).style.background = c.color);
    el("div", "sh-hash", row, `<b>#</b>${fakeHash(name, 8)}`);
    const sw = el("div", "sh-switch", row);
    return { row, sw };
  });

  return { app, navs, kpis: kpiRefs, bars, rows, adopt, chartCard, listCard, kpiWrap: kpis };
}
```

### 28/30 · `promo/src/styles/stage.css`
<!-- casebook-file {"path": "promo/src/styles/stage.css", "lines": 103, "final_newline": true, "sha256": "a1256c3416efc07e9d2f09935bbb7222463699994f52f0f1e5bd142dee4fd7f1", "original_sha256": "a1256c3416efc07e9d2f09935bbb7222463699994f52f0f1e5bd142dee4fd7f1"} -->
```css
/* 影片舞台：1920×1080 固定画布，分层 = 背景 canvas / DOM 世界 / 前景 canvas / 后期 */

* { box-sizing: border-box; }
html, body { margin: 0; background: #000; overflow: hidden; }
body { width: 1920px; height: 1080px; }

#stage {
  position: relative;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  background: var(--sh-bg);
  color: var(--sh-ink);
  font-family: var(--sh-font);
  -webkit-font-smoothing: antialiased;
}
#stage canvas { position: absolute; inset: 0; width: 1920px; height: 1080px; pointer-events: none; }
#bg { z-index: 0; }
#world { position: absolute; inset: 0; z-index: 1; transform-origin: 960px 540px; }
#fx { z-index: 2; }
#post { position: absolute; inset: 0; z-index: 3; pointer-events: none; }

.scene { position: absolute; inset: 0; display: none; transform-origin: 960px 540px; }
.scene.is-on { display: block; }
.abs { position: absolute; }
.center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }

/* 后期层 */
#vignette { position: absolute; inset: 0; background: radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, var(--sh-vignette) 100%); }
#grain { position: absolute; inset: 0; width: 1920px; height: 1080px; }
#flash { position: absolute; inset: 0; background: #fff; opacity: 0; }
#bars i { position: absolute; left: 0; right: 0; height: 140px; background: var(--sh-bars); }
#bars i:first-child { top: 0; }
#bars i:last-child { bottom: 0; }
#flare {
  position: absolute;
  left: -10%;
  right: -10%;
  top: 540px;
  height: 3px;
  opacity: 0;
  background: linear-gradient(90deg, transparent, transparent 10%, var(--sh-volt) 50%, transparent 90%, transparent);
  filter: blur(1px);
  box-shadow: 0 0 40px 8px var(--sh-volt-glow);
}
#hud { position: absolute; inset: 0; font-family: var(--sh-mono); font-size: 13px; letter-spacing: 0.08em; color: var(--sh-ink-3); text-transform: uppercase; }
#hud .hud-tl { position: absolute; left: 64px; top: 170px; }
#hud .hud-tr { position: absolute; right: 64px; top: 170px; text-align: right; }

/* 片中大字 */
.kt { font-family: var(--sh-font-cn); font-weight: 800; letter-spacing: -0.04em; line-height: 1; white-space: nowrap; }
.kt-en { font-family: var(--sh-font); font-weight: 600; letter-spacing: -0.045em; line-height: 0.92; white-space: nowrap; }
.kt-mono { font-family: var(--sh-mono); letter-spacing: 0.02em; }
.cap { font-family: var(--sh-mono); font-size: 15px; letter-spacing: 0.22em; color: var(--sh-ink-3); text-transform: uppercase; white-space: nowrap; }
.ch { display: inline-block; will-change: transform, opacity, filter; }
.volt { color: var(--sh-volt); }
.dim { color: var(--sh-ink-3); }

/* 章节题签：左上角编号 + 大字 */
.chapter { position: absolute; left: 96px; top: 96px; display: flex; align-items: center; gap: 22px; }
.chapter .ch-num { font-family: var(--sh-mono); font-size: 14px; letter-spacing: 0.2em; color: var(--sh-volt); }
.chapter .ch-line { width: 64px; height: 1px; background: var(--sh-line-3); transform-origin: left; }
.chapter .ch-cn { font-family: var(--sh-font-cn); font-size: 44px; font-weight: 800; }
.chapter .ch-en { font-family: var(--sh-mono); font-size: 14px; letter-spacing: 0.3em; color: var(--sh-ink-3); }
.caption { position: absolute; left: 0; right: 0; bottom: 88px; text-align: center; }
.caption .c-cn { font-family: var(--sh-font-cn); font-size: 34px; font-weight: 600; letter-spacing: -0.01em; }
.caption .c-en { margin-top: 12px; font-family: var(--sh-mono); font-size: 14px; letter-spacing: 0.24em; color: var(--sh-ink-3); text-transform: uppercase; }

/* 技能卡（生长 / 混乱 / 收录 共用） */
.tile {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 232px;
  height: 72px;
  padding: 0 14px;
  border: 1px solid var(--sh-line-2);
  border-radius: 12px;
  background: linear-gradient(180deg, var(--sh-surface-2), var(--sh-surface));
  box-shadow: var(--sh-shadow-1);
  will-change: transform, opacity;
}
.tile .sh-glyph { flex: none; width: 38px; height: 38px; border-radius: 9px; font-size: 12px; }
.tile .t-name { overflow: hidden; font-family: var(--sh-mono); font-size: 15px; color: var(--sh-ink); text-overflow: ellipsis; white-space: nowrap; }
.tile .t-src { margin-top: 5px; overflow: hidden; font-family: var(--sh-mono); font-size: 11px; color: var(--sh-ink-3); text-overflow: ellipsis; white-space: nowrap; }
.tile .t-meta { min-width: 0; }
.tile.is-hot { border-color: var(--sh-volt-line); box-shadow: var(--sh-glow); }

/* SKILL.md 文档卡 */
.doc { width: 640px; padding: 26px 30px; border: 1px solid var(--sh-line-2); border-radius: 16px; background: var(--sh-surface); box-shadow: var(--sh-shadow-2); font-family: var(--sh-mono); font-size: 20px; line-height: 1.75; }
.doc .d-file { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 14px; letter-spacing: 0.08em; color: var(--sh-ink-3); }
.doc .d-k { color: var(--sh-c-cyan); }
.doc .d-v { color: var(--sh-ink); }
.doc .d-dash { color: var(--sh-ink-3); }

/* 节点（链接 / 扩展 / DAG） */
.node { position: absolute; display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 1px solid var(--sh-line-2); border-radius: 14px; background: var(--sh-surface); box-shadow: var(--sh-shadow-1); transform: translate(-50%, -50%); white-space: nowrap; }
.node .n-name { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
.node .n-path { margin-top: 4px; font-family: var(--sh-mono); font-size: 12px; color: var(--sh-ink-3); }
.node.is-lit { border-color: var(--sh-volt-line); box-shadow: var(--sh-glow); }
```

### 29/30 · `promo/src/styles/tokens.css`
<!-- casebook-file {"path": "promo/src/styles/tokens.css", "lines": 116, "final_newline": true, "sha256": "67141cbc45fe7b5d8a3aed473399d7afc6008d8c14ec74087e910ec4dff7a579", "original_sha256": "67141cbc45fe7b5d8a3aed473399d7afc6008d8c14ec74087e910ec4dff7a579"} -->
```css
/*
 * Skills Hub 设计令牌（宣传片版，0 → 1 重做）
 *
 * 这是为片子里的「新前端」定的视觉语言，也是之后是否提 PR 给 apps/web 的讨论底稿：
 *   - 浅色纸白基底（默认）/ 深色基底，两套同名令牌；一支信号色（Volt），其余全部是灰阶层级
 *   - 系列色只进图表 / 来源标记，不进按钮与导航
 *   - 两种字体：Geist（界面）+ Geist Mono（路径、哈希、命令），中文回落 Noto Sans SC
 */

@import "../../node_modules/@fontsource-variable/geist/index.css";
@import "../../node_modules/@fontsource-variable/geist-mono/index.css";
@import "../../node_modules/@fontsource-variable/noto-sans-sc/index.css";

:root {
  /* 浅色（成片默认）：纸白基底 + 白色卡面，灰阶分层 */
  --sh-bg: #f6f6f3;
  --sh-bg-2: #efefeb;
  --sh-surface: #ffffff;
  --sh-surface-2: #f7f7f5;
  --sh-surface-3: #e9e9e5;

  --sh-line: rgba(10, 12, 16, 0.08);
  --sh-line-2: rgba(10, 12, 16, 0.12);
  --sh-line-3: rgba(10, 12, 16, 0.22);

  --sh-ink: #0b0c0e;
  --sh-ink-2: #4a505a;
  --sh-ink-3: #8b919b;

  /* 信号色分两用：--sh-volt 给线与字（浅底上要够深），--sh-volt-fill 给面 */
  --sh-volt: #4d7c0f;
  --sh-volt-fill: #c8f53c;
  --sh-volt-ink: #0b0e02;
  --sh-volt-soft: rgba(200, 245, 60, 0.3);
  --sh-volt-line: rgba(77, 124, 15, 0.45);
  --sh-volt-glow: rgba(160, 220, 30, 0.45);

  --sh-c-cyan: #38bdf8;
  --sh-c-violet: #7c6cf0;
  --sh-c-amber: #d98a06;
  --sh-c-clay: #d9774f;
  --sh-c-rose: #f43f5e;

  --sh-ok: #15803d;
  --sh-warn: #d98a06;
  --sh-err: #dc2626;

  /* Logo：墨色轮辐 + 信号色核心 */
  --sh-logo: #0b0c0e;
  --sh-logo-core: #c8f53c;

  /* 片子用：大字背后的遮罩、反相镜头、暗角、信箱 */
  --sh-scrim: rgba(246, 246, 243, 0.94);
  --sh-invert-bg: #0b0c0e;
  --sh-invert-ink: #f6f6f3;
  --sh-vignette: rgba(60, 60, 50, 0.16);
  --sh-bars: #0b0c0e;

  --sh-shadow-1: 0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 1px 2px rgba(10, 12, 16, 0.04), 0 10px 28px -14px rgba(10, 12, 16, 0.16);
  --sh-shadow-2: 0 2px 6px rgba(10, 12, 16, 0.05), 0 40px 100px -30px rgba(10, 12, 16, 0.28);
  --sh-glow: 0 0 0 1px var(--sh-volt-line), 0 0 30px -4px var(--sh-volt-glow);
}

[data-theme="dark"] {
  --sh-bg: #050607;
  --sh-bg-2: #0a0c0f;
  --sh-surface: #0f1215;
  --sh-surface-2: #151a1f;
  --sh-surface-3: #1c2228;
  --sh-line: rgba(255, 255, 255, 0.07);
  --sh-line-2: rgba(255, 255, 255, 0.12);
  --sh-line-3: rgba(255, 255, 255, 0.2);
  --sh-ink: #f3f5f7;
  --sh-ink-2: #a3abb6;
  --sh-ink-3: #5c6470;
  --sh-volt: #c8f53c;
  --sh-volt-fill: #c8f53c;
  --sh-volt-soft: rgba(200, 245, 60, 0.12);
  --sh-volt-line: rgba(200, 245, 60, 0.38);
  --sh-volt-glow: rgba(200, 245, 60, 0.55);
  --sh-c-cyan: #5ad7ff;
  --sh-c-violet: #a293ff;
  --sh-c-amber: #ffb547;
  --sh-c-clay: #e0845e;
  --sh-c-rose: #ff6f91;
  --sh-ok: #6ee7a8;
  --sh-warn: #ffc56b;
  --sh-err: #ff7a7a;
  --sh-logo: #c8f53c;
  --sh-logo-core: #c8f53c;
  --sh-scrim: rgba(5, 6, 7, 0.92);
  --sh-invert-bg: #f3f5f7;
  --sh-invert-ink: #050607;
  --sh-vignette: rgba(0, 0, 0, 0.72);
  --sh-bars: #000;
  --sh-shadow-1: 0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 8px 24px -12px rgba(0, 0, 0, 0.6);
  --sh-shadow-2: 0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 40px 120px -30px rgba(0, 0, 0, 0.9);
}

:root {
  /* 字体 */
  --sh-font: "Geist Variable", "Noto Sans SC Variable", system-ui, sans-serif;
  --sh-font-cn: "Noto Sans SC Variable", "Geist Variable", sans-serif;
  --sh-mono: "Geist Mono Variable", "Noto Sans SC Variable", ui-monospace, monospace;

  /* 圆角 */
  --sh-r-xs: 4px;
  --sh-r-sm: 6px;
  --sh-r-md: 10px;
  --sh-r-lg: 14px;
  --sh-r-xl: 20px;

  /* 动效：沿用 apps/web 的分层口径 */
  --sh-ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1);
  --sh-ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 30/30 · `promo/src/styles/ui.css`
<!-- casebook-file {"path": "promo/src/styles/ui.css", "lines": 216, "final_newline": true, "sha256": "2fddc80a893257933c7e7fcfb63266caead888dc79f157c7e9e14999f9807cbc", "original_sha256": "2fddc80a893257933c7e7fcfb63266caead888dc79f157c7e9e14999f9807cbc"} -->
```css
/*
 * Skills Hub 产品界面组件（宣传片里出现的「新前端」）
 * 命名前缀 sh-；只依赖 tokens.css。结构对齐 app-shell-v2：左侧四板块 + 左下角设置。
 */

.sh-app {
  position: absolute;
  display: grid;
  grid-template-rows: 44px 1fr;
  width: 1600px;
  height: 920px;
  overflow: hidden;
  border: 1px solid var(--sh-line-2);
  border-radius: var(--sh-r-xl);
  background: var(--sh-bg-2);
  box-shadow: var(--sh-shadow-2);
  color: var(--sh-ink);
  font-family: var(--sh-font);
}

.sh-titlebar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 18px;
  border-bottom: 1px solid var(--sh-line);
  background: var(--sh-bg);
  font-size: 13px;
  color: var(--sh-ink-3);
}
.sh-dots { display: flex; gap: 8px; }
.sh-dots i { width: 12px; height: 12px; border-radius: 50%; background: var(--sh-surface-3); }
.sh-titlebar .sh-title { flex: 1; text-align: center; color: var(--sh-ink-2); }
.sh-titlebar .sh-addr { font-family: var(--sh-mono); font-size: 12px; }

.sh-body { display: grid; grid-template-columns: 248px 1fr; min-height: 0; }

/* ---------- 侧栏 ---------- */
.sh-sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 14px;
  border-right: 1px solid var(--sh-line);
  background: var(--sh-bg);
}
.sh-brand { display: flex; align-items: center; gap: 10px; padding: 4px 8px 18px; font-weight: 600; font-size: 16px; letter-spacing: -0.02em; }
.sh-brand svg { width: 26px; height: 26px; }
.sh-nav-label { padding: 16px 10px 6px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sh-ink-3); }
.sh-nav {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 38px;
  padding: 0 10px;
  border-radius: var(--sh-r-md);
  font-size: 14px;
  color: var(--sh-ink-2);
}
.sh-nav svg { width: 17px; height: 17px; stroke: currentColor; fill: none; stroke-width: 1.7; }
.sh-nav.is-active { background: var(--sh-surface-3); color: var(--sh-ink); font-weight: 500; }
.sh-nav.is-active::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--sh-volt-fill);
  box-shadow: 0 0 12px var(--sh-volt-glow);
}
.sh-nav .sh-count { margin-left: auto; font-family: var(--sh-mono); font-size: 12px; color: var(--sh-ink-3); }
.sh-client-dot { width: 8px; height: 8px; border-radius: 2px; }
.sh-sidebar .sh-spacer { flex: 1; }
.sh-me { display: flex; align-items: center; gap: 10px; padding: 10px; border-top: 1px solid var(--sh-line); font-size: 13px; color: var(--sh-ink-2); }

/* ---------- 主区 ---------- */
.sh-main { display: flex; flex-direction: column; gap: 22px; min-width: 0; padding: 30px 34px; overflow: hidden; }
.sh-head { display: flex; align-items: flex-end; gap: 16px; }
.sh-head h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.03em; }
.sh-head p { margin: 6px 0 0; font-size: 14px; color: var(--sh-ink-3); }
.sh-head .sh-actions { display: flex; gap: 10px; margin-left: auto; }

.sh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid var(--sh-line-2);
  border-radius: var(--sh-r-md);
  background: var(--sh-surface);
  font-size: 13px;
  font-weight: 500;
  color: var(--sh-ink);
  white-space: nowrap;
}
.sh-btn svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 2; }
.sh-btn.is-primary { border-color: rgba(10, 12, 16, 0.08); background: var(--sh-volt-fill); color: var(--sh-volt-ink); }
.sh-btn.is-pressed { transform: scale(0.96); filter: brightness(0.9); }

.sh-card {
  position: relative;
  border: 1px solid var(--sh-line);
  border-radius: var(--sh-r-lg);
  background: var(--sh-surface);
  box-shadow: var(--sh-shadow-1);
}
.sh-card-head { display: flex; align-items: center; gap: 10px; padding: 16px 18px 0; font-size: 14px; font-weight: 500; }
.sh-card-head .sh-sub { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--sh-ink-3); }

/* KPI */
.sh-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.sh-kpi { padding: 18px 20px; }
.sh-kpi .sh-kpi-label { font-size: 13px; color: var(--sh-ink-3); }
.sh-kpi .sh-kpi-value { margin-top: 10px; font-size: 40px; font-weight: 600; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
.sh-kpi .sh-kpi-value small { margin-left: 4px; font-size: 18px; font-weight: 500; color: var(--sh-ink-3); }
.sh-kpi .sh-kpi-foot { margin-top: 8px; font-size: 12px; color: var(--sh-ink-3); }
.sh-kpi .sh-kpi-foot b { font-weight: 500; color: var(--sh-volt); }
.sh-kpi.is-lit { border-color: var(--sh-volt-line); box-shadow: var(--sh-glow); }

/* 柱状图 */
.sh-chart { display: flex; align-items: flex-end; gap: 18px; height: 250px; padding: 22px 22px 0; }
.sh-bar { display: flex; flex: 1; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end; }
.sh-bar .sh-bar-stack { display: flex; flex-direction: column; justify-content: flex-end; width: 100%; max-width: 46px; height: 190px; }
.sh-bar .sh-bar-a { border-radius: 6px 6px 0 0; background: var(--sh-volt-fill); }
.sh-bar .sh-bar-b { background: color-mix(in oklab, var(--sh-c-cyan) 70%, transparent); }
.sh-bar .sh-bar-num { font-family: var(--sh-mono); font-size: 12px; color: var(--sh-ink-2); }
.sh-bar .sh-bar-name { width: 100%; overflow: hidden; font-family: var(--sh-mono); font-size: 11px; color: var(--sh-ink-3); text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.sh-legend { display: flex; gap: 14px; font-size: 12px; color: var(--sh-ink-3); }
.sh-legend i { display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 2px; }

/* 待处理 */
.sh-todo { display: flex; align-items: center; gap: 12px; margin: 0 14px; padding: 13px 8px; border-bottom: 1px solid var(--sh-line); font-size: 13px; color: var(--sh-ink-2); }
.sh-todo:last-child { border-bottom: 0; }
.sh-todo .sh-todo-dot { width: 7px; height: 7px; border-radius: 50%; }
.sh-todo b { font-weight: 500; color: var(--sh-ink); }

/* 行 */
.sh-row { display: grid; grid-template-columns: 36px 1.2fr 1.5fr 1fr 110px 44px; align-items: center; gap: 14px; height: 54px; padding: 0 16px; border-bottom: 1px solid var(--sh-line); font-size: 13px; }
.sh-row:last-child { border-bottom: 0; }
.sh-row .sh-row-name { font-family: var(--sh-mono); font-size: 13px; color: var(--sh-ink); }
.sh-row .sh-row-desc { overflow: hidden; color: var(--sh-ink-3); text-overflow: ellipsis; white-space: nowrap; }
.sh-row .sh-row-clients { display: flex; gap: 4px; }

.sh-glyph {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-family: var(--sh-mono);
  font-size: 11px;
  font-weight: 600;
  color: #0b0d10;
}

.sh-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 9px;
  border: 1px solid var(--sh-line-2);
  border-radius: 999px;
  background: var(--sh-surface-2);
  font-size: 12px;
  color: var(--sh-ink-2);
  white-space: nowrap;
}
.sh-chip.is-volt { border-color: var(--sh-volt-line); background: var(--sh-volt-soft); color: var(--sh-volt); }
.sh-hash { font-family: var(--sh-mono); font-size: 12px; color: var(--sh-ink-3); }
.sh-hash b { font-weight: 500; color: var(--sh-volt); }

.sh-switch { position: relative; width: 36px; height: 20px; border-radius: 999px; background: var(--sh-surface-3); }
.sh-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: var(--sh-surface); box-shadow: 0 1px 2px rgba(10, 12, 16, 0.2); transition: none; }
.sh-switch.is-on { background: var(--sh-volt-fill); }
.sh-switch.is-on::after { left: 19px; background: var(--sh-volt-ink); }

.sh-avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  color: #0b0d10;
}

/* 对话框 / 输入 */
.sh-dialog { width: 620px; padding: 26px; border: 1px solid var(--sh-line-2); border-radius: var(--sh-r-xl); background: var(--sh-surface); box-shadow: var(--sh-shadow-2); color: var(--sh-ink); font-family: var(--sh-font); }
.sh-dialog h3 { margin: 0 0 6px; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
.sh-dialog p { margin: 0 0 20px; font-size: 14px; color: var(--sh-ink-3); }
.sh-field { display: flex; align-items: center; gap: 10px; height: 46px; margin-bottom: 12px; padding: 0 14px; border: 1px solid var(--sh-line-2); border-radius: var(--sh-r-md); background: var(--sh-bg-2); font-family: var(--sh-mono); font-size: 14px; }
.sh-field .sh-field-label { width: 64px; font-family: var(--sh-font); font-size: 13px; color: var(--sh-ink-3); }

.sh-toast { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 1px solid var(--sh-line-2); border-radius: var(--sh-r-lg); background: var(--sh-surface-2); box-shadow: var(--sh-shadow-2); font-size: 14px; color: var(--sh-ink); }
.sh-toast code { font-family: var(--sh-mono); font-size: 12px; color: var(--sh-ink-3); }

/* Agent 对话 */
.sh-chat { display: flex; flex-direction: column; gap: 16px; width: 680px; padding: 24px; border: 1px solid var(--sh-line-2); border-radius: var(--sh-r-xl); background: var(--sh-bg-2); box-shadow: var(--sh-shadow-2); font-family: var(--sh-font); color: var(--sh-ink); }
.sh-chat-head { display: flex; align-items: center; gap: 10px; padding-bottom: 14px; border-bottom: 1px solid var(--sh-line); font-size: 15px; font-weight: 500; }
.sh-chat-head .sh-chip { margin-left: auto; }
.sh-msg { max-width: 86%; padding: 12px 16px; border-radius: 14px; font-size: 15px; line-height: 1.6; }
.sh-msg.is-user { align-self: flex-end; border-bottom-right-radius: 4px; background: var(--sh-surface-3); }
.sh-msg.is-agent { align-self: flex-start; padding-left: 0; color: var(--sh-ink-2); }
.sh-msg code { padding: 1px 6px; border-radius: 4px; background: var(--sh-surface-2); font-family: var(--sh-mono); font-size: 13px; color: var(--sh-ink); }
.sh-tool { padding: 14px 16px; border: 1px solid var(--sh-line-2); border-radius: var(--sh-r-lg); background: var(--sh-surface); font-size: 13px; }
.sh-tool-top { display: flex; align-items: center; gap: 10px; font-family: var(--sh-mono); color: var(--sh-ink); }
.sh-tool-top .sh-chip { margin-left: auto; }
.sh-tool-args { margin-top: 8px; font-family: var(--sh-mono); font-size: 12px; color: var(--sh-ink-3); }
.sh-tool-actions { display: flex; gap: 8px; margin-top: 12px; }
.sh-input { display: flex; align-items: center; height: 48px; padding: 0 16px; border: 1px solid var(--sh-line-2); border-radius: var(--sh-r-lg); background: var(--sh-surface); font-size: 14px; color: var(--sh-ink-3); }
```

