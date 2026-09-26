# kimi-film · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show kimi-film <路径>`；还原成真实目录：`python3 scripts/casebook.py copy kimi-film <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `README.md` | 37 | 18 |
| 2 | `film.py` | 38 | 60 |
| 3 | `film_par.py` | 51 | 103 |
| 4 | `kit.py` | 293 | 159 |
| 5 | `scenes.py` | 627 | 457 |
| 6 | `score.py` | 286 | 1089 |

---

### 1/6 · `README.md`
<!-- casebook-file {"path": "README.md", "lines": 37, "final_newline": true, "sha256": "9de17207661d907d4c3eb704312d96e3fa707742bdcf3bb0379c380ae3f84e51", "original_sha256": "9de17207661d907d4c3eb704312d96e3fa707742bdcf3bb0379c380ae3f84e51"} -->
````markdown
# 月之暗面 · KIMI — 纯代码动画短片

56 秒、1920×1080@30fps、2.35:1 画幅。全部由 Python 代码逐像素渲染，
不含任何图片素材、AI 生图、现成音频——画面是 numpy/PIL 计算的，
配乐是 numpy 逐样本合成的。

## 分幕

| 时间 | 幕 | 视觉语言 | 配乐 |
|------|----|---------|------|
| 0–7s | 月之暗面 | 《Dark Side of the Moon》三棱镜 → 光谱收拢成月 | 环境嗡鸣 + 心跳 + 玻璃铃 |
| 7–15s | 二十万字 | 荧光绿 CRT 终端 / 代码雨 / 计数器 0→200 万 | 120bpm 方波琶音 钟表律动 |
| 15–23s | 时代热浪 | 民国「号外」报纸卡片 / 印刷半调 / 重砸剪辑 | 128bpm 四地板 + 太鼓点 |
| 23–31.5s | 思考之树 | 粉笔星云 / 生长中的思维链树 → 星座 | 72bpm 稀疏毛毡钢琴 |
| 31.5–43.5s | 开源之巅 | K2 雪山 / 山门开启金色光柱 / 石碑快切 | 92bpm 太鼓 + 铜管齐奏 |
| 43.5–56s | 未来眺望 | 环月轨道 / 暗面电路星座 / 地球升起 | 氛围 Pad + 主题铃音再现 |

同一五声音阶主题（E G A B D）在每一幕以不同配器重现——
对应片中「同一轮月亮」。

## 复现

```bash
python3 score.py      # 生成 out/score.wav（48kHz 立体声）
python3 film_par.py   # 8 进程并行渲染 → out/kimi_film.mp4
# 或单进程：python3 film.py
```

依赖：Python 3.10+ / numpy / Pillow / ffmpeg / Noto CJK 字体。

## 文件

- `kit.py` — 渲染工具集：缓动、文字精灵缓存、辉光、胶片颗粒、暗角、遮幅、粒子
- `scenes.py` — 六幕场景渲染函数（全局时间 → 局部时间）
- `score.py` — 合成器（osc/ADSR/鼓组）+ 分幕编曲
- `film_par.py` — 并行渲染 + ffmpeg 拼接混流
- `film.py` — 单进程渲染版
````

### 2/6 · `film.py`
<!-- casebook-file {"path": "film.py", "lines": 38, "final_newline": true, "sha256": "65c734104581589c8cc865dbada27d47c605193ec737f50e6a6cbdcdd2dd3ddc", "original_sha256": "65c734104581589c8cc865dbada27d47c605193ec737f50e6a6cbdcdd2dd3ddc"} -->
```python
"""Driver: render frames -> x264 -> mux score."""
import subprocess, sys, time
import numpy as np
from scenes import SCENES, TOTAL
from kit import W, H, FPS

def main():
    n_frames = int(TOTAL * FPS)
    vpipe = subprocess.Popen(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "out/video_silent.mp4"],
        stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    t0 = time.time()
    for f in range(n_frames):
        gt = f / FPS
        sc = [s for s in SCENES if s[0] <= gt < s[1]] or [SCENES[-1]]
        fr = sc[0][2](gt - sc[0][0])
        if fr.dtype != np.uint8:
            fr = np.clip(fr, 0, 255).astype(np.uint8)
        vpipe.stdin.write(fr.tobytes())
        if f % 60 == 0:
            el = time.time() - t0
            eta = el / (f + 1) * (n_frames - f - 1)
            print(f"frame {f}/{n_frames}  {el:.0f}s elapsed  eta {eta:.0f}s",
                  flush=True)
    vpipe.stdin.close(); vpipe.wait()
    print("video done, muxing…")
    subprocess.run(
        ["ffmpeg", "-y", "-i", "out/video_silent.mp4", "-i", "out/score.wav",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
         "-movflags", "+faststart", "out/kimi_film.mp4"], check=True)
    print("DONE -> out/kimi_film.mp4")

if __name__ == "__main__":
    main()
```

### 3/6 · `film_par.py`
<!-- casebook-file {"path": "film_par.py", "lines": 51, "final_newline": true, "sha256": "b543ae92c62bb0613ff18257bbf13bdd777b37927f4ee959900c5656b9f64c22", "original_sha256": "b543ae92c62bb0613ff18257bbf13bdd777b37927f4ee959900c5656b9f64c22"} -->
```python
"""Parallel render: N chunks -> per-chunk mp4 -> concat -> mux score."""
import subprocess, time, os
import multiprocessing as mp
import numpy as np
from scenes import SCENES, TOTAL
from kit import W, H, FPS

N_JOBS = 8

def render_range(f0, f1, path):
    vpipe = subprocess.Popen(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-pix_fmt", "yuv420p", path],
        stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    for f in range(f0, f1):
        gt = f / FPS
        sc = [s for s in SCENES if s[0] <= gt < s[1]] or [SCENES[-1]]
        fr = sc[0][2](gt - sc[0][0])
        if fr.dtype != np.uint8:
            fr = np.clip(fr, 0, 255).astype(np.uint8)
        vpipe.stdin.write(fr.tobytes())
    vpipe.stdin.close(); vpipe.wait()
    return path

def main():
    n = int(TOTAL * FPS)
    edges = np.linspace(0, n, N_JOBS + 1).astype(int)
    chunks = [(int(edges[i]), int(edges[i + 1])) for i in range(N_JOBS)]
    print("chunks:", chunks, flush=True)
    t0 = time.time()
    with mp.Pool(N_JOBS) as pool:
        res = [pool.apply_async(render_range, (a, b, f"out/chunk_{i:02d}.mp4"))
               for i, (a, b) in enumerate(chunks)]
        for r in res: r.get()
    print(f"render {time.time() - t0:.0f}s", flush=True)
    with open("out/concat.txt", "w") as fh:
        for i in range(len(chunks)):
            fh.write(f"file chunk_{i:02d}.mp4\n")
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0",
                    "-i", "out/concat.txt", "-c", "copy",
                    "out/video_silent.mp4"], check=True)
    subprocess.run(
        ["ffmpeg", "-y", "-i", "out/video_silent.mp4", "-i", "out/score.wav",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
         "-movflags", "+faststart", "out/kimi_film.mp4"], check=True)
    print("DONE -> out/kimi_film.mp4")

if __name__ == "__main__":
    main()
```

### 4/6 · `kit.py`
<!-- casebook-file {"path": "kit.py", "lines": 293, "final_newline": true, "sha256": "3811d02d0a5d7c8c3cfa97995c80dd1c471ad65da76cb27ca68d9bbd55b8f607", "original_sha256": "3811d02d0a5d7c8c3cfa97995c80dd1c471ad65da76cb27ca68d9bbd55b8f607"} -->
```python
"""Render toolkit for the Kimi film — pure numpy/PIL, no image assets."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, functools

W, H = 1920, 1080
FPS = 30
BAR_H = int(round((H - W / 2.35) / 2))  # 2.35:1 letterbox bar height

NOTO = "/usr/share/fonts/opentype/noto/"
FONTS = {
    "sans":  (NOTO + "NotoSansCJK-Regular.ttc", 2),
    "sansb": (NOTO + "NotoSansCJK-Bold.ttc", 2),
    "black": (NOTO + "NotoSansCJK-Black.ttc", 2),
    "serif": (NOTO + "NotoSerifCJK-Regular.ttc", 2),
    "serifb": (NOTO + "NotoSerifCJK-Bold.ttc", 2),
    "serifblk": (NOTO + "NotoSerifCJK-Black.ttc", 2),
    "serifl": (NOTO + "NotoSerifCJK-Light.ttc", 2),
}
_mono_cache = {}

def font(name, px):
    key = (name, px)
    if key not in _mono_cache:
        path, idx = FONTS[name]
        _mono_cache[key] = ImageFont.truetype(path, px, index=idx)
    return _mono_cache[key]

# ---------------- easing ----------------
def clamp(x, a=0.0, b=1.0):
    return min(b, max(a, x))

def ss(x):  # smoothstep 0..1
    x = clamp(x)
    return x * x * (3 - 2 * x)

def eo(x):  # ease out cubic
    x = clamp(x); return 1 - (1 - x) ** 3

def ei(x):  # ease in cubic
    x = clamp(x); return x ** 3

def eio(x):  # ease in-out
    x = clamp(x)
    return 4 * x * x * x if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2

def eo_elastic(x):
    x = clamp(x)
    if x == 0 or x == 1: return x
    return 2 ** (-10 * x) * math.sin((x * 10 - 0.75) * (2 * math.pi / 3)) + 1

def eo_back(x, s=1.70158):
    x = clamp(x)
    return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2

def lerp(a, b, t): return a + (b - a) * t

def seg(t, t0, t1):
    """normalized progress of t within [t0,t1]"""
    return clamp((t - t0) / (t1 - t0))

# ---------------- buffers ----------------
_YX = None
def yx():
    global _YX
    if _YX is None:
        _YX = np.mgrid[0:H, 0:W].astype(np.float32)
    return _YX

def canvas(color=(0, 0, 0)):
    img = np.empty((H, W, 3), np.float32)
    img[:, :] = np.asarray(color, np.float32)
    return img

def radial(xx, yy, x, y, r):
    """0..1 soft radial falloff"""
    d2 = (xx - x) ** 2 + (yy - y) ** 2
    return np.exp(-d2 / (2 * (r * 0.5) ** 2 + 1e-6))

def add_glow(img, x, y, r, color, amp=1.0):
    yy, xx = yx()
    g = radial(xx, yy, x, y, r)[..., None]
    img += g * np.asarray(color, np.float32)[None, None, :] * amp
    return img

def add_disc(img, x, y, r, color, soft=0.02):
    yy, xx = yx()
    d = np.sqrt((xx - x) ** 2 + (yy - y) ** 2)
    m = np.clip((r - d) / (r * soft + 1), 0, 1)[..., None]
    img += m * np.asarray(color, np.float32)[None, None, :]
    return img

def beam(img, x0, y0, x1, y1, width, color, amp=1.0, soft=1.5):
    """thick soft line from p0 to p1"""
    yy, xx = yx()
    dx, dy = x1 - x0, y1 - y0
    L2 = dx * dx + dy * dy + 1e-6
    tt = ((xx - x0) * dx + (yy - y0) * dy) / L2
    tt = np.clip(tt, 0, 1)
    px, py = x0 + tt * dx, y0 + tt * dy
    d = np.sqrt((xx - px) ** 2 + (yy - py) ** 2)
    m = np.exp(-((d / max(width, 0.5)) ** 2) * soft)[..., None]
    img += m * np.asarray(color, np.float32)[None, None, :] * amp
    return img

def poly_mask(xx, yy, pts):
    """ray-cast point-in-polygon mask"""
    inside = np.zeros(xx.shape, bool)
    n = len(pts)
    for i in range(n):
        x0, y0 = pts[i]; x1, y1 = pts[(i + 1) % n]
        cond = ((y0 > yy) != (y1 > yy)) & (xx < (x1 - x0) * (yy - y0) / (y1 - y0 + 1e-9) + x0)
        inside ^= cond
    return inside

# ---------------- text sprites ----------------
_sprite_cache = {}
def text_sprite(text, fname="sansb", px=64, color=(255, 255, 255),
                tracking=0, maxw=None, blur=0):
    key = (text, fname, px, color, tracking, maxw, blur)
    if key in _sprite_cache:
        return _sprite_cache[key]
    f = font(fname, px)
    # measure with tracking
    widths = []
    for ch in text:
        b = f.getbbox(ch)
        w = f.getlength(ch)
        widths.append(w)
    tw = int(sum(widths) + tracking * max(0, len(text) - 1))
    asc, desc = f.getmetrics()
    th = asc + desc
    if maxw and tw > maxw:
        scale = maxw / tw
        return text_sprite(text, fname, int(px * scale), color, tracking, None, blur)
    img = Image.new("RGBA", (max(tw, 1) + 8, th + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x = 4
    for ch, w in zip(text, widths):
        d.text((x, 4), ch, font=f, fill=color + (255,))
        x += w + tracking
    if blur:
        img = img.filter(ImageFilter.GaussianBlur(blur))
    arr = np.asarray(img).astype(np.float32)
    _sprite_cache[key] = arr
    return arr

def blit(img, sprite, x, y, alpha=1.0, scale=1.0, center=False):
    """alpha-blend RGBA sprite into float32 img. x,y = top-left or center."""
    if sprite is None or alpha <= 0: return img
    h, w = sprite.shape[:2]
    if scale != 1.0:
        nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
        sprite = np.asarray(
            Image.fromarray(sprite.astype(np.uint8)).resize((nw, nh), Image.LANCZOS)
        ).astype(np.float32)
        h, w = nh, nw
    if center:
        x -= w / 2; y -= h / 2
    x0, y0 = int(round(x)), int(round(y))
    x1, y1 = x0 + w, y0 + h
    # clip
    cx0, cy0 = max(0, x0), max(0, y0)
    cx1, cy1 = min(W, x1), min(H, y1)
    if cx1 <= cx0 or cy1 <= cy0: return img
    sx0, sy0 = cx0 - x0, cy0 - y0
    sp = sprite[sy0:sy0 + (cy1 - cy0), sx0:sx0 + (cx1 - cx0)]
    a = (sp[..., 3:4] / 255.0) * alpha
    img[cy0:cy1, cx0:cx1] = img[cy0:cy1, cx0:cx1] * (1 - a) + sp[..., :3] * a
    return img

def text_center(img, text, y, fname="sansb", px=64, color=(255, 255, 255),
                alpha=1.0, x=W / 2, tracking=0, scale=1.0):
    sp = text_sprite(text, fname, px, color, tracking)
    return blit(img, sp, x, y, alpha=alpha, scale=scale, center=True)

# ---------------- star fields / particles ----------------
def starfield(seed, n, mag=(0.3, 1.0), size=(0.6, 2.2)):
    rng = np.random.default_rng(seed)
    xs = rng.uniform(0, W, n); ys = rng.uniform(0, H, n)
    ms = rng.uniform(*mag, n); ss_ = rng.uniform(*size, n)
    tw = rng.uniform(0.5, 3.0, n); ph = rng.uniform(0, 6.28, n)
    tint = rng.uniform(0.75, 1.0, (n, 3))
    tint[:, 0] *= rng.uniform(0.8, 1.0, n)   # warm/cool variety
    tint[:, 2] *= rng.uniform(0.9, 1.05, n)
    return dict(x=xs, y=ys, m=ms, s=ss_, tw=tw, ph=ph, c=np.clip(tint, 0, 1))

def draw_stars(img, sf, t, amp=1.0, drift=0.0, region=None):
    """patch-based star rendering — each star only paints a small box"""
    m = sf["m"] * (0.62 + 0.38 * np.sin(sf["tw"] * t + sf["ph"])) * amp
    xs = (sf["x"] + drift * t) % W if drift else sf["x"]
    for i in range(len(xs)):
        if m[i] <= 0.02: continue
        x, y, s = xs[i], sf["y"][i], sf["s"][i]
        r = int(math.ceil(s * 3.2)) + 1
        x0, x1 = int(x) - r, int(x) + r + 1
        y0, y1 = int(y) - r, int(y) + r + 1
        if x1 <= 0 or y1 <= 0 or x0 >= W or y0 >= H: continue
        cx0, cy0 = max(0, x0), max(0, y0)
        cx1, cy1 = min(W, x1), min(H, y1)
        lyy, lxx = np.mgrid[cy0:cy1, cx0:cx1].astype(np.float32)
        g = np.exp(-(((lxx - x) ** 2 + (lyy - y) ** 2) / (2 * s * s)))[..., None]
        img[cy0:cy1, cx0:cx1] += g * (m[i] * sf["c"][i])[None, None, :]
    return img

# ---------------- post ----------------
_grain_pool = None
def grain(img, t, amp=6.0):
    global _grain_pool
    if _grain_pool is None:
        rng = np.random.default_rng(7)
        _grain_pool = rng.normal(0, 1, (24, H, W, 1)).astype(np.float32)
    img += _grain_pool[int(t * FPS) % 24] * amp
    return img

def vignette(img, k=0.32):
    yy, xx = yx()
    cx, cy = W / 2, H / 2
    d = np.sqrt(((xx - cx) / (W * 0.62)) ** 2 + ((yy - cy) / (H * 0.62)) ** 2)
    v = np.clip(1 - k * np.clip(d - 0.45, 0, 1) ** 1.6, 0, 1)[..., None]
    img *= v
    return img

def letterbox(img):
    img[:BAR_H] = 0; img[H - BAR_H:] = 0
    return img

def scanlines(img, period=3, amp=0.12):
    yy, _ = yx()
    s = (np.sin(yy * math.pi / period) * 0.5 + 0.5)[..., None]
    img *= (1 - amp * s)
    return img

def add_dots(img, dots, color, amp=1.0, blur=0.0):
    """dots = [(x,y,r)...] via one PIL overlay"""
    ov = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(ov)
    c = tuple(int(min(255, v * amp)) for v in color)
    for x, y, r in dots:
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    if blur:
        ov = ov.filter(ImageFilter.GaussianBlur(blur))
    img += np.asarray(ov).astype(np.float32)
    return img

def add_lines(img, segs, color, width=1, blur=0.0, amp=1.0):
    """draw many segments via one PIL overlay (fast for thin line sets)"""
    ov = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(ov)
    c = tuple(int(min(255, v * amp)) for v in color)
    for x0, y0, x1, y1 in segs:
        d.line([x0, y0, x1, y1], fill=c, width=int(width))
    if blur:
        ov = ov.filter(ImageFilter.GaussianBlur(blur))
    img += np.asarray(ov).astype(np.float32)
    return img

def shake_chroma(img, dx=0, dy=0, chroma=0):
    """integer shift + chromatic aberration split"""
    if chroma:
        r = np.roll(img[..., 0], chroma, axis=1)
        b = np.roll(img[..., 2], -chroma, axis=1)
        img = np.dstack([r[..., None], img[..., 1:2], b[..., None]])
    if dx or dy:
        img = np.roll(np.roll(img, dy, axis=0), dx, axis=1)
    return img

def push_in(img, scale, cx=W / 2, cy=H / 2):
    """crop-zoom via PIL; box clamped inside the frame"""
    if abs(scale - 1) < 1e-4: return img
    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    cw, ch = W / scale, H / scale
    cx = min(max(cx, cw / 2), W - cw / 2)
    cy = min(max(cy, ch / 2), H - ch / 2)
    box = (int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))
    pil = pil.resize((W, H), Image.LANCZOS, box=box)
    out = np.asarray(pil)
    return out.astype(img.dtype) if img.dtype != out.dtype else out

def flash(img, a, color=(255, 255, 255)):
    img += (np.asarray(color, np.float32)[None, None, :] * a)
    return img

def gate_weave(img, t, px=1.2):
    d = int(round(math.sin(t * 11.3) * px))
    return np.roll(img, d, axis=0) if d else img

def finish(img, t, letter=True, vig=0.3, gran=5.0, weave=True):
    if weave: img = gate_weave(img, t)
    if vig: img = vignette(img, vig)
    if gran: img = grain(img, t, gran)
    if letter: img = letterbox(img)
    return np.clip(img, 0, 255).astype(np.uint8)
```

### 5/6 · `scenes.py`
<!-- casebook-file {"path": "scenes.py", "lines": 627, "final_newline": true, "sha256": "37f7c9bf8586b7a66091a056ea3ec614e8141fc797d477a98e212c040bbdc558", "original_sha256": "37f7c9bf8586b7a66091a056ea3ec614e8141fc797d477a98e212c040bbdc558"} -->
```python
"""Six acts of the Kimi film. Each returns float32 RGB (H,W,3) at local time t."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import math
from kit import *

# ============================================================ ACT 0 · 月之暗面
PRISM_X, PRISM_Y = W * 0.40, H * 0.50
MOON_X, MOON_Y = W * 0.50, H * 0.40
SPECTRUM = [(214, 48, 49), (240, 132, 40), (247, 200, 70),
            (76, 175, 80), (56, 142, 222), (126, 87, 194)]

def act0(t):
    img = canvas((4, 5, 9))
    yy, xx = yx()

    # stars fade in late
    if t > 3.2:
        draw_stars(img, _SF0, t, amp=ss(seg(t, 3.2, 5.5)) * 0.9)

    # ---- phase A: white beam enters prism (0.3 - 1.5s)
    bx, by = -40, H * 0.58           # beam source off left edge
    ex, ey = PRISM_X - 26, PRISM_Y + 10
    p = eo(seg(t, 0.3, 1.5))
    if p > 0:
        bfade = 1 - eio(seg(t, 3.8, 5.0))
        beam(img, bx, by, bx + (ex - bx) * p, by + (ey - by) * p,
             5.5, (255, 252, 240), amp=0.85 * min(1, p * 3) * bfade, soft=1.1)

    # ---- prism triangle
    tri = [(PRISM_X - 44, PRISM_Y + 52), (PRISM_X + 44, PRISM_Y + 52),
           (PRISM_X + 2, PRISM_Y - 46)]
    pm = poly_mask(xx, yy, tri)
    prism_a = ss(seg(t, 1.0, 1.9)) * (1 - ss(seg(t, 3.6, 4.6)))
    if prism_a > 0:
        img[..., :] += pm[..., None] * np.array([26, 30, 40], np.float32) * prism_a
        # triangle edge glow
        for i in range(3):
            x0, y0 = tri[i]; x1, y1 = tri[(i + 1) % 3]
            beam(img, x0, y0, x1, y1, 2.0, (215, 225, 245), amp=0.75 * prism_a, soft=2.6)

    # ---- phase B: spectrum fans out (1.5 - 3.4s)
    # ---- phase C: spectrum collapses into moon (3.4 - 5.0s)
    spec_in = seg(t, 1.55, 3.0)
    collapse = seg(t, 3.4, 5.0)
    for i, col in enumerate(SPECTRUM):
        a_in = eo(clamp(spec_in * 1.35 - i * 0.07))
        if a_in <= 0: continue
        sx, sy = PRISM_X + 30, PRISM_Y + 6 + i * 2.2
        tx, ty = W + 60, H * 0.30 + i * 52          # fan target off right edge
        q = eio(collapse)
        # collapse: endpoint swings to moon, origin also drifts to moon
        gx = sx + (MOON_X - sx) * q; gy = sy + (MOON_Y - sy) * q
        tx2 = tx + (MOON_X + 30 * math.cos(i - 2.5) - tx) * q
        ty2 = ty + (MOON_Y + 30 * math.sin(i - 2.5) - ty) * q
        L = eo(a_in) * (1 - q)
        amp = (0.5 + 0.4 * math.sin(t * 7 + i)) * a_in * (1 - 0.55 * q)
        if L <= 0.01: continue
        beam(img, gx, gy, gx + (tx2 - gx) * L, gy + (ty2 - gy) * L,
             7.5, col, amp=amp, soft=1.6)

    # ---- the moon: ignites from collapse point
    m_on = seg(t, 4.2, 5.4)
    if m_on > 0:
        mr = 152 * eo(m_on)
        add_glow(img, MOON_X, MOON_Y, mr * 4.2, (245, 230, 190), 0.8 * m_on)
        add_disc(img, MOON_X, MOON_Y, mr, (238, 224, 182), soft=0.012)
        # maria + terminator on the right (the dark side)
        d = np.sqrt((xx - MOON_X) ** 2 + (yy - MOON_Y) ** 2)
        inside = d < mr
        term = np.clip((xx - (MOON_X + mr * 0.25)) / (mr * 0.9), 0, 1)
        shade = (0.55 + 0.45 * term) * m_on
        blotch = np.exp(-(((xx - MOON_X + 30) ** 2 + (yy - MOON_Y + 18) ** 2) / (2 * (mr * 0.34) ** 2)))
        img -= (inside & (d >= mr * 0.98))[..., None] * 0
        img *= (1 - inside[..., None] * (blotch[..., None] * 0.16 + (1 - shade[..., None]) * 0.5))

    # ---- titles
    a_t = ss(seg(t, 5.3, 6.3))
    if a_t > 0:
        text_center(img, "月之暗面", H * 0.645, "serifblk", 108,
                    (236, 230, 214), alpha=a_t, tracking=34)
        text_center(img, "M O O N S H O T   A I", H * 0.745, "sans", 30,
                    (168, 172, 186), alpha=a_t * 0.95)
        a2 = ss(seg(t, 5.9, 6.7))
        text_center(img, "2023.3 · 北京 · 一群看月亮的人", H * 0.815, "serif", 30,
                    (140, 146, 160), alpha=a2)
    # tagline top
    a_tag = ss(seg(t, 0.2, 1.1)) * (1 - ss(seg(t, 4.9, 5.6)))
    if a_tag > 0:
        text_center(img, "THE DARK SIDE OF THE MOON", H * 0.13, "sans", 24,
                    (120, 126, 142), alpha=a_tag * 0.8, tracking=6)

    return push_in(finish(img, t, vig=0.42, gran=5), 1 + 0.05 * eio(seg(t, 4.6, 7.0)))

_SF0 = starfield(11, 340, mag=(0.15, 0.8), size=(0.5, 1.9))

# ============================================================ ACT 1 · 二十万字
_POOL = list("月的暗面智能助手长文本无损上下文阅读记忆搜索深度思考联网吴彦祖"
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]()<>/*-+=&|!?;:#.")
_LN_W = 620

def _mk_lines():
    rng = np.random.default_rng(3)
    lines = []
    for i in range(48):
        s = "".join(rng.choice(_POOL, size=rng.integers(14, 30)))
        sp = text_sprite(s, "sans", 30, (60, 235, 130))
        lines.append(sp)
    return lines
_LINES = None

def act1(t):
    global _LINES
    if _LINES is None:
        _LINES = _mk_lines()
    img = canvas((2, 10, 5))
    yy, xx = yx()

    # CRT wash
    img += radial(xx, yy, W / 2, H * 0.52, H * 0.95)[..., None] * np.array([6, 34, 16], np.float32)

    # streaming code lines — 3 depth columns
    rng = np.random.default_rng(9)
    for i, sp in enumerate(_LINES):
        col = i % 6
        depth = 0.45 + 0.55 * ((i * 37) % 10) / 10
        x = col * (W / 6.4) + 26 + (i % 3) * 10
        speed = 210 + (i % 5) * 88
        y = (H * 1.6 - ((t * speed + i * 173) % (H * 1.9))) - H * 0.35
        a = (0.10 + 0.30 * depth) * (0.7 + 0.3 * math.sin(t * 3 + i))
        blit(img, sp, x, y, alpha=a)

    # counter: 0 -> 200,000 then -> 2,000,000
    add_glow(img, W / 2, H * 0.44, 330, (30, 220, 110), 0.42)
    if t < 4.6:
        n = int(eo(seg(t, 0.4, 4.4)) * 200000)
        main, cap = f"{n:,}", "汉字 · 无损上下文"
    else:
        n = int(200000 + eio(seg(t, 4.6, 6.4)) * 1800000)
        main, cap = f"{n:,}", "200万字内测 · 2024.3" if n > 1500000 else "汉字 · 无损上下文"
    text_center(img, main, H * 0.345, "black", 150, (210, 255, 225))
    text_center(img, cap, H * 0.565, "sansb", 40, (120, 240, 165))

    # typed header + timeline caption
    hdr = "MOONSHOT> kimi.chat --context ultra"
    typed = hdr[:int(clamp(seg(t, 0.15, 1.6)) * len(hdr))]
    sp = text_sprite(typed + ("_" if int(t * 3) % 2 else " "), "sans", 34, (110, 250, 165))
    blit(img, sp, 70, H * 0.135)
    if t < 4.4:
        text_center(img, "2023.10.9 · KIMI 问世 · 全球首个 20万汉字", H * 0.80,
                    "sans", 33, (95, 215, 140), alpha=ss(seg(t, 1.8, 2.6)))
    # glitch tears near the end
    g = seg(t, 6.9, 8.0)
    if g > 0 and (int(t * 24) % 4 == 0):
        band = int((t * 977) % H)
        h = 30 + int(50 * g)
        img[band:band + h] = np.roll(img[band:band + h], int(90 * g), axis=1)
    img = scanlines(img, 3, 0.16)
    img = finish(img, t, vig=0.5, gran=7)
    if g > 0:
        img = np.clip(img.astype(np.float32) + g * g * 90, 0, 255).astype(np.uint8)
    return img

# ============================================================ ACT 2 · 时代热浪
_CARDS = [
    ("号外", "$10亿", "B轮融资 · 阿里领投", "2024.2"),
    ("号外", "200万字", "无损上下文 · 内测", "2024.3"),
    ("快讯", "$3亿", "腾讯 · 高榕 加注", "2024.8"),
    ("上新", "探索版", "AI 自主搜索", "2024.10"),
    ("模型", "k0-math", "数学推理", "2024.11"),
    ("模型", "k1", "视觉思考", "2024.12"),
    ("SOTA", "k1.5", "多模态思考 · 比肩 o1", "2025.1"),
    ("跃迁", "K2 前夜", "万亿参数 在路上", "2025 中"),
]
_card_imgs = None
def _mk_cards():
    global _card_imgs
    _card_imgs = []
    rng = np.random.default_rng(5)
    for seal, big, sub, date in _CARDS:
        w, h = 1140, 500
        c = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(c)
        d.rectangle([0, 0, w - 1, h - 1], fill=(233, 224, 202, 255))
        # paper texture
        px = np.asarray(c).astype(np.float32)
        noise = np.random.default_rng(7).normal(0, 6, (h, w, 1))
        px[..., :3] += noise
        c = Image.fromarray(np.clip(px, 0, 255).astype(np.uint8))
        d = ImageDraw.Draw(c)
        d.rectangle([14, 14, w - 15, h - 15], outline=(30, 26, 20, 255), width=3)
        # red seal
        d.rectangle([w - 190, 34, w - 60, 120], outline=(198, 48, 30, 255), width=4)
        sf = font("serifb", 56)
        tw = d.textlength(seal, font=sf)
        d.text((w - 125 - tw / 2, 48), seal, font=sf, fill=(198, 48, 30, 255))
        # headline
        bf = font("serifblk", 148)
        tw = d.textlength(big, font=bf)
        d.text(((w - tw) / 2, 120), big, font=bf, fill=(24, 20, 16, 255))
        sf2 = font("sansb", 52)
        tw = d.textlength(sub, font=sf2)
        d.text(((w - tw) / 2, 300), sub, font=sf2, fill=(70, 58, 44, 255))
        df = font("sans", 40)
        d.text((50, 396), date, font=df, fill=(120, 105, 84, 255))
        d.line([40, 385, w - 40, 385], fill=(30, 26, 20, 255), width=2)
        # halftone dots bottom-left deco
        for ry in range(3):
            for rxx in range(14):
                r = 2 + ry * 1.6
                d.ellipse([60 + rxx * 26 - r, 320 + ry * 22 - r,
                           60 + rxx * 26 + r, 320 + ry * 22 + r],
                          fill=(150, 140, 118, 160))
        _card_imgs.append(c)

def act2(t):
    if _card_imgs is None:
        _mk_cards()
    img = canvas((16, 12, 9))
    yy, xx = yx()
    # paper-stained bg
    img += radial(xx, yy, W / 2, H / 2, H)[..., None] * np.array([30, 20, 12], np.float32)

    beat = 0.9375                  # half-bar at 128bpm
    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    idx_now = min(len(_CARDS) - 1, int(t / beat))

    # pile of previous cards
    for k in range(idx_now):
        age = t - (k + 1) * beat
        sc = 0.60 - 0.028 * (idx_now - k)
        if sc <= 0.2: continue
        rot = ((k * 137) % 13) - 6
        cw, ch = _card_imgs[k].size
        card = _card_imgs[k].resize((int(cw * sc), int(ch * sc)), Image.LANCZOS)
        card = card.rotate(rot, expand=True, resample=Image.BICUBIC)
        a = card.getchannel("A").point(lambda v: int(v * clamp(0.5 - age * 0.06, 0.18, 0.5)))
        card.putalpha(a)
        offx = ((k * 271) % 5 - 2) * 88
        offy = ((k * 173) % 5 - 2) * 56
        pil.paste(card, (int(W / 2 - card.size[0] / 2 + offx),
                         int(H * 0.47 - card.size[1] / 2 + offy)), card)

    # current card slam
    lt = t - idx_now * beat
    p = eo_back(seg(lt, 0, 0.30), s=2.2)
    sc = 1.05 - 0.07 * p
    card = _card_imgs[idx_now]
    cw, ch = card.size
    card2 = card.resize((int(cw * sc), int(ch * sc)), Image.LANCZOS)
    card2 = card2.rotate(((idx_now % 3) - 1) * 2.4 * (1 - p), expand=True, resample=Image.BICUBIC)
    pil.paste(card2, (int(W / 2 - card2.size[0] / 2), int(H * 0.47 - card2.size[1] / 2)), card2)

    img = np.asarray(pil).astype(np.float32)
    # halftone overlay
    dots = (np.sin(xx / 5.5) * np.sin(yy / 5.5))[..., None] * 7
    img += dots

    # impact fx on each slam
    hit = seg(lt, 0.0, 0.22)
    shake = int((1 - hit) ** 2 * (7 if lt < 0.30 else 0)) * (1 if idx_now % 2 else -1)
    chroma = int(5 * (1 - hit)) if lt < 0.30 else 0
    img = shake_chroma(img, shake, 0, chroma)
    if lt < 0.10:
        img = flash(img, (0.10 - lt) * 3.4, (255, 240, 210))

    # masthead
    text_center(img, "二〇二四 · 热浪", H * 0.155, "serifblk", 64,
                (238, 226, 200), alpha=0.95)
    text_center(img, "全民都在谈论那轮月亮", H * 0.865, "serif", 36,
                (196, 184, 156), alpha=0.8)

    # exit swirl
    ex = seg(t, 7.55, 8.0)
    if ex > 0:
        img = push_in(img, 1 + 0.35 * ei(ex), cx=W / 2, cy=H * 0.47)
        img = np.clip(img.astype(np.float32) - 130 * ei(ex), 0, 255)
    return finish(img, t, vig=0.36, gran=8)

# ============================================================ ACT 3 · 思考之树
def _mk_tree():
    rng = np.random.default_rng(21)
    segs = []   # (x0,y0,x1,y1,level)
    nodes = []
    def grow(x, y, ang, ln, lv):
        x1 = x + math.cos(ang) * ln
        y1 = y + math.sin(ang) * ln
        segs.append((x, y, x1, y1, lv))
        nodes.append((x1, y1, lv))
        if lv >= 8: return
        n = 2 if rng.random() < 0.5 else 3
        for i in range(n):
            spread = rng.uniform(0.30, 0.70)
            grow(x1, y1, ang + (i - (n - 1) / 2) * spread + rng.uniform(-0.12, 0.12),
                 ln * rng.uniform(0.64, 0.78), lv + 1)
    grow(W * 0.5, H * 0.95, -math.pi / 2, H * 0.155, 0)
    return segs, nodes
_TREE = None
_TREE_LV = None

def act3(t):
    global _TREE, _TREE_LV
    if _TREE is None:
        _TREE = _mk_tree()
        _TREE_LV = [Image.new("RGBA", (W, H), (0, 0, 0, 0)) for _ in range(9)]
        ds = [ImageDraw.Draw(l) for l in _TREE_LV]
        for x0, y0, x1, y1, lv in _TREE[0]:
            wpx = max(1.4, 5.2 - lv * 0.55)
            ds[lv].line([x0, y0, x1, y1], fill=(175, 205, 240, 235), width=int(wpx))
        for x, y, lv in _TREE[1]:
            r = max(1.6, 4.4 - lv * 0.4)
            ds[lv].ellipse([x - r, y - r, x + r, y + r], fill=(210, 228, 250, 240))
    img = canvas((4, 7, 15))
    yy, xx = yx()
    img += radial(xx, yy, W * 0.5, H * 0.55, H * 0.9)[..., None] * np.array([10, 18, 38], np.float32)

    draw_stars(img, _SF3, t, amp=0.25 + 0.55 * ss(seg(t, 4.5, 8.5)))

    # tree levels appear progressively; lift into constellation late
    lift = seg(t, 5.4, 8.5)
    grow_p = seg(t, 0.25, 4.6)
    for lv in range(9):
        a = ss(clamp(grow_p * 9 - lv))
        if a <= 0.01: continue
        layer = _TREE_LV[lv]
        if lift > 0:
            dy = -60 * eio(lift) * (lv / 8)
            layer = ImageChops.offset(layer, 0, int(dy))
        arr = np.asarray(layer).astype(np.float32)
        alpha = arr[..., 3:4] / 255 * a
        img += arr[..., :3] * alpha * (0.85 + 0.3 * lv / 8)

    # glowing tips at growth front
    front = int(clamp(grow_p, 0, 1) * 9)
    tips = [(x, y - 60 * eio(lift), 4 + 4 * (0.5 + 0.5 * math.sin(t * 2.4 + i)))
            for i, (x, y, lv) in enumerate(_TREE[1])
            if lv == front or (front >= 9 and lv == 8)][:40]
    if tips:
        add_dots(img, tips, (140, 190, 255), amp=0.55, blur=3)

    # drifting chalk math glyphs
    glyphs = "∂∑∫√πλ∇θμσ∴∵"
    for i in range(11):
        gx = (i * 173 + 80) % W
        gy = H * 0.82 - ((t * (14 + i * 2.5) + i * 90) % (H * 0.75))
        a = 0.16 + 0.14 * math.sin(t + i)
        sp = text_sprite(glyphs[i % len(glyphs)], "serif", 44 + (i % 3) * 12,
                         (160, 190, 225))
        blit(img, sp, gx, gy, alpha=a)

    # constellation links late
    if lift > 0:
        cn = [(x, y - 60 * eio(lift)) for x, y, lv in _TREE[1] if lv >= 7]
        add_lines(img, [(cn[i][0], cn[i][1], cn[i + 1][0], cn[i + 1][1])
                        for i in range(0, len(cn) - 1, 2)],
                  (140, 175, 230), width=1, blur=1.5, amp=0.5 * lift)

    # captions
    caps = [("k0-math · 数学推理", 1.2, "2024.11"),
            ("k1 · 视觉思考", 3.1, "2024.12"),
            ("k1.5 · 多模态思考", 5.0, "2025.1"),
            ("强化学习 · 让模型学会探索", 6.9, "RL Scaling")]
    text_center(img, "思 考 之 树", H * 0.14, "serifl", 46, (200, 214, 235),
                alpha=ss(seg(t, 0.2, 1.0)), tracking=8)
    for txt, t0, sub in caps:
        a = ss(seg(t, t0, t0 + 0.8)) * (1 - ss(seg(t, t0 + 1.9, t0 + 2.7)))
        if a > 0:
            text_center(img, txt, H * 0.80, "sansb", 42, (210, 225, 245), alpha=a)
            text_center(img, sub, H * 0.865, "sans", 27, (130, 155, 190), alpha=a)
    img = finish(img, t, vig=0.44, gran=4)
    return push_in(img, 1 + 0.13 * eio(seg(t, 0, 8.5)), cy=H * 0.55)

_SF3 = starfield(23, 300, mag=(0.2, 0.9), size=(0.5, 1.8))

# ============================================================ ACT 4 · 开源之巅
_RIDGE = None
def _mk_ridge():
    rng = np.random.default_rng(8)
    pts = []
    n = 26
    for i in range(n + 1):
        x = i / n * W
        peak = math.exp(-((i / n - 0.5) ** 2) / (2 * 0.09 ** 2))   # centered peak
        y = H * (0.98 - 0.52 * peak) + rng.uniform(-14, 14)
        pts.append((x, y))
    return pts

def act4(t):
    img = canvas((5, 6, 10))
    yy, xx = yx()
    horizon = np.clip((yy - H * 0.2) / H, 0, 1)[..., None]
    img += horizon * np.array([16, 18, 26], np.float32)
    draw_stars(img, _SF4, t, amp=0.5)

    # ---- 0-6s : mountain rises, gate opens at summit
    if t < 6.6:
        rise = eo(seg(t, 0.1, 2.6))
        dy = (1 - rise) * H * 0.62
        pts = [(x, y + dy) for x, y in _mk_ridge()]
        # dawn backlight behind the summit
        add_glow(img, W * 0.5, pts[13][1] + 40, 420, (200, 160, 95), 0.35 * rise)
        add_glow(img, W * 0.5, H * 1.05, 900, (35, 38, 55), 0.5)
        pm = poly_mask(xx, yy, pts + [(W, H * 1.5), (0, H * 1.5)])
        rock = (np.array([26, 29, 38], np.float32)[None, None, :] *
                (0.45 + 0.55 * (yy / H)[..., None]))
        # face shading: light falls from summit
        rock *= (1 + 0.5 * np.clip((pts[13][1] + 120 - yy) / H, 0, 0.5)[..., None])
        img = img * (1 - pm[..., None] * 0.94) + rock * pm[..., None] * 0.94
        # snowcap
        dpeak = np.abs(xx - W * 0.5) / (W * 0.12)
        snow = (pm & (yy < pts[13][1] + 110) & (dpeak < 1)).astype(np.float32)
        img += snow[..., None] * np.array([170, 178, 195], np.float32) * 0.30 * rise
        # ridge rim light
        import numpy as _np
        ridge_y = _np.interp(xx[0], [p[0] for p in pts], [p[1] for p in pts])
        rim = _np.exp(-((yy - ridge_y[None, :]) ** 2) / (2 * 3.5 ** 2))
        img += rim[..., None] * _np.array([220, 195, 140], _np.float32) * 0.35 * rise

        # blizzard streaks
        segs = []
        for i in range(90):
            sx = (i * 137 + t * (350 + i * 7)) % (W + 200) - 100
            sy = (i * 89) % int(H * 0.9)
            segs.append((sx, sy, sx - 34, sy + 8))
        add_lines(img, segs, (190, 200, 215), width=1, blur=1.0, amp=0.35)

        # summit gate: two monolith slabs part, light column
        g = seg(t, 2.6, 4.4)
        gx = W * 0.5
        gy = pts[13][1] + 60
        ga = ss(seg(t, 2.0, 3.0))           # slabs fade in
        so = eio(g) * 150
        for sgn in (-1, 1):
            x0 = gx + sgn * (30 + so)
            m = (np.abs(xx - x0) < 46) & (np.abs(yy - gy + 40) < 150)
            img *= (1 - m[..., None] * 0.9 * ga)
            # gold rim on inner edge
            rim = np.exp(-((xx - (x0 - sgn * 46)) ** 2) / (2 * 8 ** 2)) * m.astype(float)
            img += rim[..., None] * np.array([235, 200, 110], np.float32) * ga * 0.7
        if g > 0:
            wid = 14 + 120 * eio(g)
            beam(img, gx, gy - 280 * g - 10, gx, gy + 60, wid, (240, 200, 110),
                 amp=0.8 * math.sin(math.pi * min(g, 1)) + 0.4, soft=1.6)
            for a in (-0.45, -0.22, 0.22, 0.45):
                beam(img, gx, gy, gx + 640 * math.sin(a), gy - 640 * math.cos(a),
                     8, (232, 196, 108), amp=0.2 * g, soft=2.4)

        # K2 titles slam on beats
        def slam(txt, t0, y, px_, fname="serifblk", color=(235, 230, 215), tr=10):
            lt = t - t0
            if lt < 0 or lt > 2.4: return 0
            p = eo_back(seg(lt, 0, 0.22), 2.0)
            a = 1 if lt < 1.9 else 1 - ss(seg(lt, 1.9, 2.4))
            text_center(img, txt, y, fname, int(px_ * (1.25 - 0.25 * p)),
                        color, alpha=a, tracking=tr)
            return max(0, 1 - seg(lt, 0, 0.25))
        imp = 0
        imp = max(imp, slam("K 2", 3.3, H * 0.30, 220, tr=16))
        imp = max(imp, slam("1.04T MoE · 32B 激活", 4.1, H * 0.46, 62, "sansb", (214, 205, 185), 4))
        imp = max(imp, slam("开 源 权 重", 4.9, H * 0.575, 78, "serifblk", (240, 205, 120), 12))
        imp = max(imp, slam("SWE-bench 65.8 · Agentic SOTA", 5.4, H * 0.68, 40, "sansb", (190, 185, 170), 2))
        text_center(img, "2025.7.11", H * 0.17, "sans", 30, (150, 155, 170),
                    alpha=ss(seg(t, 0.4, 1.4)))
        if imp > 0:
            img = shake_chroma(img, int(imp * 9), 0, int(imp * 5))
            img = flash(img, imp * 0.5, (255, 240, 200))
        # transition: white-hot burn to next sub-act
        b = seg(t, 6.1, 6.6)
        if b > 0:
            img = flash(img, eio(b) * 1.15, (255, 238, 190))

    # ---- 6.6-12s : Thinking & K3 slab montage
    else:
        st = t - 6.6
        slabs = [
            ("K2 THINKING", "会思考的 Agent", "2025.11.6"),
            ("HLE 44.9%", "人类最后的考试", "SOTA"),
            ("BrowseComp 60.2%", "智能体搜索", "SOTA"),
            ("300 步", "连续工具调用 无人工干预", "LONG-HORIZON"),
            ("K 3", "2.8T MoE · 1M 上下文 · KDA", "2026.7"),
        ]
        beat2 = 5.4 / len(slabs)
        idx = min(len(slabs) - 1, int(st / beat2))
        lt = st - idx * beat2
        p = eo(seg(lt, 0, 0.16))
        side = -1 if idx % 2 == 0 else 1
        sx = W / 2 + (1 - p) * side * W * 0.7
        add_glow(img, sx, H * 0.5, 560, (60, 52, 28), 0.6)
        # slab body
        sw, sh = int(1080 * (0.6 + 0.4 * p)), 430
        sxp = np.asarray(Image.new("RGBA", (sw, sh), (0, 0, 0, 0)))
        slab = Image.new("RGBA", (sw, sh), (12, 12, 14, 255))
        dd = ImageDraw.Draw(slab)
        dd.rectangle([0, 0, sw - 1, 5], fill=(226, 186, 96, 255))
        bf = font("serifblk" if idx == len(slabs) - 1 else "black", 150 if len(slabs[idx][0]) < 12 else 120)
        tw = dd.textlength(slabs[idx][0], font=bf)
        dd.text(((sw - tw) / 2, 92), slabs[idx][0], font=bf, fill=(238, 232, 216, 255))
        sf2 = font("sansb", 46)
        tw = dd.textlength(slabs[idx][1], font=sf2)
        dd.text(((sw - tw) / 2, 268), slabs[idx][1], font=sf2, fill=(226, 186, 96, 255))
        df = font("sans", 34)
        tw = dd.textlength(slabs[idx][2], font=df)
        dd.text(((sw - tw) / 2, 342), slabs[idx][2], font=df, fill=(130, 130, 140, 255))
        pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
        pil.paste(slab, (int(sx - sw / 2), int(H * 0.5 - sh / 2)), slab)
        img = np.asarray(pil).astype(np.float32)
        if lt < 0.12:
            img = flash(img, (0.12 - lt) * 6.0, (255, 240, 200))
            img = shake_chroma(img, int((1 - lt / 0.12) * 8), 0, 4)
        text_center(img, "巅 峰 不 是 终 点", H * 0.14, "serifl", 44,
                    (215, 205, 180), alpha=ss(seg(st, 0, 1)), tracking=10)
        # final fade toward space
        b = seg(st, 4.9, 5.4)
        if b > 0:
            img *= (1 - b * 0.85)
    return finish(img, t, vig=0.4, gran=5)

_SF4 = starfield(31, 260, mag=(0.2, 0.8), size=(0.5, 1.7))

# ============================================================ ACT 5 · 未来眺望
_CONST = None
def _constellation():
    """nodes + edges on the moon's dark hemisphere"""
    global _CONST
    if _CONST is not None: return _CONST
    rng = np.random.default_rng(4)
    cx, cy, R = W * 0.62, H * 0.44, 255
    nodes = []
    while len(nodes) < 26:
        a = rng.uniform(0, 2 * math.pi)
        rr = R * math.sqrt(rng.uniform(0, 0.85))
        x, y = cx + rr * math.cos(a), cy + rr * math.sin(a)
        if x > cx + R * 0.15 or rng.random() < 0.4:   # bias to right (dark) side
            nodes.append((x, y))
    edges = []
    for i, (x, y) in enumerate(nodes):
        ds = sorted((( (x - x2) ** 2 + (y - y2) ** 2, j) for j, (x2, y2) in enumerate(nodes) if j != i))
        for _, j in ds[:2]:
            if j > i: edges.append((i, j))
    _CONST = (cx, cy, R, nodes, edges)
    return _CONST

def act5(t):
    img = canvas((4, 5, 12))
    yy, xx = yx()
    # deep space gradient
    g2 = np.clip((yy / H - 0.15), 0, 1)[..., None]
    img += g2 * np.array([10, 12, 26], np.float32)
    draw_stars(img, _SF5a, t, amp=0.8, drift=-4)
    draw_stars(img, _SF5b, t, amp=0.5, drift=-11)

    cx, cy, R, nodes, edges = _constellation()
    # moon with sweeping terminator (orbit feel: light creeps leftward)
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    inside = d < R
    add_glow(img, cx, cy, R * 3.8, (220, 215, 190), 0.55)
    add_disc(img, cx, cy, R, (216, 208, 184), soft=0.008)
    term_x = cx + R * 1.1 - seg(t, 0, 11) * R * 1.9   # shadow sweeps right->left
    lit = np.clip((term_x - xx) / (R * 0.55), 0, 1)
    dark = 1 - lit
    img *= (1 - inside[..., None] * dark[..., None] * 0.78)
    # maria
    for mx, my, mr in ((-60, -40, 46), (20, 70, 34), (-20, 40, 26)):
        b = np.exp(-(((xx - cx - mx) ** 2 + (yy - cy - my) ** 2) / (2 * mr * mr)))
        img *= (1 - inside[..., None] * b[..., None] * 0.13 * lit[..., None])

    # constellation glows where dark
    darkv = np.clip(1 - lit, 0, 1)
    ramp = ss(seg(t, 2.2, 7.5))
    dots = []
    for i, (nx, ny) in enumerate(nodes):
        if inside[int(ny), int(nx)]:
            tw = 0.5 + 0.5 * math.sin(t * 1.7 + i * 2.1)
            dots.append((nx, ny, 3.5 + 3.5 * tw))
    if dots:
        add_dots(img, dots, (125, 230, 255), amp=0.7 * ramp, blur=2)
    add_lines(img, [(nodes[i][0], nodes[i][1], nodes[j][0], nodes[j][1])
                    for i, j in edges], (95, 195, 240), width=1, blur=1.2,
              amp=0.55 * ramp)

    # earthrise hint bottom-left late
    ea = ss(seg(t, 7.5, 10))
    if ea > 0:
        add_glow(img, W * 0.16, H * 1.02, 380, (95, 150, 240), 0.6 * ea)
        add_disc(img, W * 0.16, H * 1.06, 230, (60, 105, 200), soft=0.01)

    # text sequence
    seq = [("从 20万字 到 2.8万亿参数", 2.0, 3.4, "serifb", 56, (225, 222, 208)),
           ("长文本 · 思考 · 行动 · 智能体", 5.6, 3.2, "sansb", 48, (205, 212, 228)),
           ("下一章 —— AGI", 9.0, 2.6, "serifl", 60, (230, 226, 210))]
    for txt, t0, dur, fn, px_, col in seq:
        a = ss(seg(t, t0, t0 + 0.9)) * (1 - ss(seg(t, t0 + dur - 0.8, t0 + dur)))
        if a > 0:
            text_center(img, txt, H * 0.79, fn, px_, col, alpha=a, tracking=4)

    # end card
    ec = seg(t, 10.4, 12.5)
    if ec > 0:
        img *= (1 - 0.75 * ss(ec))
        a = ss(seg(t, 10.7, 11.6))
        text_center(img, "月之暗面 · 探索不止", H * 0.42, "serifblk", 96,
                    (240, 235, 218), alpha=a, tracking=16)
        text_center(img, "T O   T H E   D A R K   S I D E   A N D   B E Y O N D",
                    H * 0.545, "sans", 26, (150, 158, 178), alpha=a, tracking=3)
        text_center(img, "本片全部由 Python 代码逐像素渲染 · 无图像素材 · 无音频素材",
                    H * 0.90, "sans", 24, (110, 116, 132), alpha=ss(seg(t, 11.6, 12.4)))
    # iris out
    ir = seg(t, 11.9, 12.5)
    if ir > 0:
        r = (1 - eio(ir)) * max(W, H)
        m = (np.sqrt((xx - W / 2) ** 2 + (yy - H / 2) ** 2) > r)
        img *= (1 - m[..., None])
    return finish(img, t, vig=0.34, gran=4)

_SF5a = starfield(41, 380, mag=(0.25, 0.95), size=(0.5, 2.0))
_SF5b = starfield(42, 200, mag=(0.15, 0.6), size=(0.6, 2.6))

# ---------------------------------------------------------------
SCENES = [
    (0.0, 7.0, act0),
    (7.0, 15.0, act1),
    (15.0, 23.0, act2),
    (23.0, 31.5, act3),
    (31.5, 43.5, act4),
    (43.5, 56.0, act5),
]
TOTAL = 56.0
```

### 6/6 · `score.py`
<!-- casebook-file {"path": "score.py", "lines": 286, "final_newline": true, "sha256": "ae96ced700bff1efa6a015b5d36dbca6162bab93319da07c73c834483393b13c", "original_sha256": "ae96ced700bff1efa6a015b5d36dbca6162bab93319da07c73c834483393b13c"} -->
```python
"""Procedural score — every era gets its own instrumentation and groove.
One leitmotif (E-minor pentatonic) threads through all six acts."""
import numpy as np
import wave, math

SR = 48000
TOTAL = 56.0
N = int(SR * TOTAL)
L = np.zeros(N, np.float64)
R = np.zeros(N, np.float64)

rng = np.random.default_rng(11)

# ---------- dsp helpers ----------
def adsr(n, a, d, s, r, sl=0.0):
    env = np.empty(n)
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(0, n - a_n - d_n - r_n)
    i = 0
    if a_n:
        env[i:i + a_n] = np.linspace(0, 1, a_n); i += a_n
    if d_n:
        env[i:i + d_n] = np.linspace(1, sl, d_n); i += d_n
    if s_n:
        env[i:i + s_n] = sl; i += s_n
    if r_n:
        env[i:i + r_n] = np.linspace(sl, 0, r_n); i += r_n
    return env[:n]

def osc(kind, f, n, det=0.0):
    t = np.arange(n) / SR
    ph = 2 * math.pi * f * t
    if kind == "sine": return np.sin(ph)
    if kind == "tri":  return 2 / math.pi * np.arcsin(np.sin(ph))
    if kind == "sqr":  return np.sign(np.sin(ph)) * 0.7
    if kind == "saw":
        v = 2 * (t * f % 1) - 1
        if det:
            v = 0.5 * (v + (2 * (t * f * (1 + det) % 1) - 1))
        return v * 0.6
    if kind == "noise": return rng.normal(0, 1, n) * 0.5
    raise ValueError(kind)

def place(t0, sig, amp=1.0, pan=0.0, gl=L, gr=R):
    i0 = int(t0 * SR); i1 = min(N, i0 + len(sig))
    if i1 <= i0: return
    seg = sig[:i1 - i0] * amp
    # equal-power pan
    al = math.cos((pan + 1) * math.pi / 4)
    ar = math.sin((pan + 1) * math.pi / 4)
    gl[i0:i1] += seg * al
    gr[i0:i1] += seg * ar

def note(t0, f, dur, kind="sine", amp=0.5, pan=0.0, a=0.01, r=0.08, sl=0.0, det=0.0):
    n = int(dur * SR)
    sig = osc(kind, f, n, det) * adsr(n, a, dur * 0.4, r, sl)
    place(t0, sig, amp, pan)

def bell(t0, f, amp=0.4, pan=0.0, dur=1.6):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = (np.sin(2 * math.pi * f * tt)
           + 0.45 * np.sin(2 * math.pi * f * 2.76 * tt)
           + 0.18 * np.sin(2 * math.pi * f * 5.40 * tt))
    sig *= np.exp(-tt * (3.2 + f / 500))
    place(t0, sig, amp, pan)

def felt(t0, f, amp=0.45, pan=0.0, dur=1.4):
    """felt-piano-ish: sine + soft 2nd/3rd, fast attack, long decay"""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = (np.sin(2 * math.pi * f * tt)
           + 0.5 * np.sin(2 * math.pi * f * 2 * tt)
           + 0.22 * np.sin(2 * math.pi * f * 3 * tt))
    env = np.exp(-tt * 2.4) * np.clip(tt * 120, 0, 1)
    place(t0, sig * env, amp, pan)

def pad(t0, freqs, dur, amp=0.16, det=0.006):
    n = int(dur * SR)
    env = adsr(n, dur * 0.3, dur * 0.12, dur * 0.45, dur * 0.18, sl=0.6)
    for f in freqs:
        sig = (osc("tri", f, n) + 0.6 * osc("saw", f, n, det)) * env
        place(t0, sig, amp / max(1, len(freqs) * 0.55), rng.uniform(-0.5, 0.5))

def kick(t0, amp=0.9, f0=140, f1=48, dur=0.30, pan=0.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 28)
    ph = 2 * math.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-tt * 12)
    sig += osc("noise", 0, n) * np.exp(-tt * 90) * 0.5
    place(t0, sig, amp, pan)

def taiko(t0, amp=1.0, pan=0.0):
    n = int(0.55 * SR)
    tt = np.arange(n) / SR
    f = 42 + 66 * np.exp(-tt * 18)
    ph = 2 * math.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-tt * 5.5)
    sig += osc("noise", 0, n) * np.exp(-tt * 45) * 0.8
    place(t0, sig, amp, pan)

def hat(t0, amp=0.22, open_=False, pan=0.0):
    n = int((0.16 if open_ else 0.05) * SR)
    sig = osc("noise", 0, n)
    # crude highpass: diff
    sig = np.diff(sig, prepend=0)
    sig *= np.exp(-np.arange(n) / SR * (35 if open_ else 90))
    place(t0, sig, amp, pan)

def snare(t0, amp=0.5, pan=0.0):
    n = int(0.22 * SR)
    tt = np.arange(n) / SR
    sig = osc("noise", 0, n) * np.exp(-tt * 22) * 0.8
    sig += np.sin(2 * math.pi * 185 * tt) * np.exp(-tt * 28) * 0.6
    place(t0, sig, amp, pan)

def riser(t0, dur, amp=0.3, up=True):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f0, f1 = (240, 3200) if up else (3200, 240)
    f = f0 + (f1 - f0) * tt / dur
    sig = osc("noise", 0, n) * 0.4 + np.sin(2 * math.pi * np.cumsum(f) / SR) * 0.5
    sig *= np.clip(tt / dur, 0, 1) ** 2 * np.exp(-(dur - tt) * 0.4)
    place(t0, sig, amp)

def sub_pulse(t0, f=41.2, dur=0.5, amp=0.5):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = np.sin(2 * math.pi * f * tt) * np.exp(-tt * 4)
    place(t0, sig, amp)

def click_(t0, amp=0.2):
    n = int(0.012 * SR)
    sig = rng.normal(0, 1, n) * np.exp(-np.arange(n) / SR * 400)
    place(t0, sig, amp, rng.uniform(-0.4, 0.4))

# ---------- motif ----------
E4, G4, A4, B4, D5, E5 = 329.63, 392.00, 440.00, 493.88, 587.33, 659.25
E2, E3 = 82.41, 164.81
MOTIF = [E4, G4, A4, B4, D5, B4, A4, G4]

# ================= ACT 0 · ambient origin (0-7s) =================
def a0():
    pad(0.0, [E2, E3, 246.94], 7.4, amp=0.30)          # E drone
    pad(1.8, [123.47, 196.0], 5.2, amp=0.10)           # B2 G3 shimmer
    for t0 in (0.7, 1.7, 2.7):                          # heartbeat
        sub_pulse(t0, 55, 0.42, 0.55)
    bell(4.3, E4, 0.30); bell(5.0, G4, 0.28); bell(5.7, A4, 0.30)
    bell(6.3, B4, 0.26, dur=2.2)
    riser(6.0, 1.05, 0.20)

# ================= ACT 1 · clockwork 120bpm (7-15s) =================
def a1():
    b = 60 / 120 / 2                    # eighth note
    t = 7.0
    arp = [E4, E4, G4, E4, A4, G4, B4, A4, D5, B4, A4, G4, E4, G4, A4, E4]
    i = 0
    while t < 14.6:
        note(t, arp[i % len(arp)], b * 0.92, "sqr", amp=0.115,
             pan=-0.35 if i % 2 else 0.35, a=0.004, r=0.05)
        if i % 2 == 0:
            click_(t, 0.10)
        if i % 4 == 0:
            sub_pulse(t, E2 * 2, b * 1.8, 0.30)
        t += b; i += 1
    pad(7.2, [E2 * 2, 246.94], 7.6, amp=0.075)          # low bed under the arp
    # counter switch at 11.6 (global) — pitch riser + sub drop
    riser(11.2, 0.9, 0.16)
    sub_pulse(11.65, E2, 0.6, 0.55)
    # glitch stutter at the tail
    for k in range(6):
        click_(14.55 + k * 0.07, 0.16)
    riser(14.55, 0.45, 0.22)

# ================= ACT 2 · driving montage 128bpm (15-23s) =================
def a2():
    bt = 60 / 128
    roots = [E2, E2, G4 / 4, A4 / 4, B4 / 4, B4 / 4, D5 / 4, E2]   # low roots
    bar = bt * 4
    for bi in range(8):
        t0 = 15 + bi * bar
        if t0 > 22.9: break
        r = roots[bi]
        for q in range(4):                        # four-on-floor kicks
            kick(t0 + q * bt, 0.75 if q == 0 else 0.5, f0=120)
            if q in (1, 3): snare(t0 + q * bt, 0.28)
        for e in range(8):                        # offbeat hats
            hat(t0 + e * bt / 2 + bt / 4, 0.10 + (e % 2) * 0.06)
        for e in range(8):                        # saw bass 8ths
            note(t0 + e * bt / 2, r, bt * 0.44, "saw", amp=0.20, a=0.005, r=0.04, det=0.01)
    # card slams: 8 thuds synced to the visual card landings (1.0s grid)
    for i in range(8):
        taiko(15.12 + i * 0.9375, 0.65, pan=(i % 3 - 1) * 0.3)
    # motif stab lead 20.5-23
    for i, f in enumerate(MOTIF[:6]):
        note(20.6 + i * 0.235, f, 0.24, "saw", amp=0.22, a=0.004, r=0.07, det=0.008)
    riser(22.3, 0.7, 0.25)

# ================= ACT 3 · contemplation 72bpm (23-31.5s) =================
def a3():
    bar = 60 / 72 * 4
    for i in range(3):
        sub_pulse(23 + i * bar * 2, 36.7, 1.4, 0.42)          # deep root every 2 bars
    # sparse felt motif
    seq = [(23.6, E4), (24.9, G4), (26.2, A4), (27.8, B4), (29.4, D5)]
    for t0, f in seq:
        felt(t0, f, 0.42, pan=rng.uniform(-0.3, 0.3), dur=2.6)
        felt(t0 + 0.02, f * 2, 0.10, dur=1.8)
    pad(23.2, [E3, B4 / 2, D5 / 2], 6.0, amp=0.10)
    pad(28.4, [E3, G4 / 2, B4 / 2, D5 / 2], 3.4, amp=0.12)
    riser(30.3, 1.15, 0.18)

# ================= ACT 4 · monumental 92bpm (31.5-43.5s) =================
def a4():
    bt = 60 / 92
    # sub A: taiko + brass hits synced to visual slams (33.3+... local t)
    slams = [3.3, 4.1, 4.9, 5.4]
    for i, lt in enumerate(slams):
        T = 31.5 + lt
        taiko(T, 0.95)
        for f in [E3, B4 / 4, E4 / 2]:
            note(T, f, 0.55, "saw", amp=0.16, a=0.006, r=0.3, det=0.012)
        sub_pulse(T, E2 / 2, 0.7, 0.5)
    # rolling taiko pattern
    for i in range(14):
        taiko(31.6 + i * bt * 1.0, 0.30, pan=(-1) ** i * 0.3)
    # sub B: slab hits
    for i in range(5):
        T = 38.1 + i * (5.4 / 5)
        kick(T, 0.9, f0=100)
        snare(T, 0.4)
        note(T, D5 / 2, 0.4, "saw", amp=0.14, a=0.005, r=0.2, det=0.015)
    # heroic motif at 40.8
    for i, f in enumerate(MOTIF):
        T = 40.7 + i * 0.32
        for octv in (1, 2):
            note(T, f * octv, 0.34, "saw", amp=0.13 if octv == 1 else 0.08,
                 a=0.008, r=0.12, det=0.01)
        taiko(T, 0.5)
    riser(42.7, 0.8, 0.28)

# ================= ACT 5 · cosmic reprise (43.5-56s) =================
def a5():
    chords = [
        ([E3, B4 / 2, D5 / 2, G4 / 2], 5.0),
        ([164.81 / 2, A4 / 2, 523.25 / 2, E4 / 2], 5.0),   # Cmaj-ish
        ([196.0 / 2, B4 / 2, D5 / 2, G4 / 2], 4.0),
        ([E3, E4, B4, G4], 6.0),
    ]
    t = 43.5
    for fr, dur in chords:
        pad(t, fr, dur, amp=0.16)
        t += dur
    # bell motif reprise, widely spaced
    for i, f in enumerate([E4, G4, A4, B4, D5, E5]):
        bell(44.3 + i * 1.05, f, 0.24, pan=(-1) ** i * 0.35, dur=3.2)
    # heartbeat return at the end
    for t0 in (53.4, 54.3, 55.2):
        sub_pulse(t0, 48, 0.5, 0.5)

# ---------- build ----------
def build():
    for fn in (a0, a1, a2, a3, a4, a5):
        fn()
    mix = np.stack([L, R], axis=1)
    # gentle stereo delay (haas-ish)
    d = int(0.023 * SR)
    mix[d:, 1] += mix[:-d, 0] * 0.18
    mix[d:, 0] += mix[:-d, 1] * 0.12
    # master: soft clip + normalize
    mix = np.tanh(mix * 1.15)
    mix /= (np.abs(mix).max() + 1e-9)
    mix *= 0.94
    # fade in/out
    fi = int(0.25 * SR); fo = int(1.6 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)[:, None]
    mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return (mix * 32767).astype(np.int16)

if __name__ == "__main__":
    m = build()
    with wave.open("out/score.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(m.tobytes())
    print("score.wav", m.shape, m.max(), m.min())
```

