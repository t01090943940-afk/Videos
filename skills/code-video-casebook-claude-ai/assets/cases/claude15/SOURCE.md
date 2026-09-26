# claude15 · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show claude15 <路径>`；还原成真实目录：`python3 scripts/casebook.py copy claude15 <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `claude_intro/README.md` | 11 | 19 |
| 2 | `claude_intro/core.py` | 270 | 35 |
| 3 | `claude_intro/music.py` | 255 | 310 |
| 4 | `claude_intro/plan.py` | 25 | 570 |
| 5 | `claude_intro/render.py` | 244 | 600 |
| 6 | `claude_intro/scenes_a.py` | 730 | 849 |
| 7 | `claude_intro/scenes_b.py` | 421 | 1584 |

---

### 1/7 · `claude_intro/README.md`
<!-- casebook-file {"path": "claude_intro/README.md", "lines": 11, "final_newline": true, "sha256": "3e0f5ca0ee85de2247856f361bcd09e0a2b169f0bc020b594814251bde744bb1", "original_sha256": "3e0f5ca0ee85de2247856f361bcd09e0a2b169f0bc020b594814251bde744bb1"} -->
```markdown
# Claude 自我介绍 · 纯代码视频

依赖：pip install skia-python numpy scipy ；系统需 ffmpeg、Noto CJK / AR PL UKai / Unifont 字体

    python3 music.py music.wav                 # 合成 128 BPM 配乐
    mkdir -p segs sheets
    python3 render.py sheet 4                  # 某镜头的 6 帧联系表（拉片检查）
    python3 render.py shots 0 1 2 ... 14       # 逐镜头编码
    python3 render.py final out.mp4            # 拼接 + 混音

plan.py 是拉片表：每个镜头 16 拍，改这里就能重排镜头和转场。
```

### 2/7 · `claude_intro/core.py`
<!-- casebook-file {"path": "claude_intro/core.py", "lines": 270, "final_newline": true, "sha256": "bc9602f9fc49edef87d0d3f8f10327f040f658bbb10c6dfae45e4e690c4eddc8", "original_sha256": "bc9602f9fc49edef87d0d3f8f10327f040f658bbb10c6dfae45e4e690c4eddc8"} -->
```python
"""core engine — timing / easing / fonts / paint / textures / ortho-3D"""
import math, random, functools
import numpy as np
import skia
from scipy import ndimage

W, H = 1920, 1080
FPS = 30
BPM = 128
SPB = 60.0 / BPM            # seconds per beat
SCENE_BEATS = 16
TAIL_BEATS = 4

def b2t(b): return b * SPB
def t2b(t): return t / SPB

# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0): return a if x < a else b if x > b else x
def lerp(a, b, t): return a + (b - a) * t
def seg(x, a, b): return clamp((x - a) / (b - a)) if b != a else float(x >= a)
def e_lin(t): return clamp(t)
def e_in3(t): t = clamp(t); return t * t * t
def e_out3(t): t = clamp(t); return 1 - (1 - t) ** 3
def e_io3(t):
    t = clamp(t); return 4 * t * t * t if t < .5 else 1 - (-2 * t + 2) ** 3 / 2
def e_outexp(t): t = clamp(t); return 1 if t >= 1 else 1 - 2 ** (-10 * t)
def e_inexp(t): t = clamp(t); return 0 if t <= 0 else 2 ** (10 * t - 10)
def e_back(t, s=1.9):
    t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1
def e_elastic(t):
    t = clamp(t)
    if t in (0, 1): return t
    return 2 ** (-10 * t) * math.sin((t * 10 - .75) * (2 * math.pi / 3)) + 1
def hit(b, at, decay=5.0):
    """impulse that fires at beat `at` and decays"""
    return math.exp(-(b - at) * decay) if b >= at else 0.0
def kick(b, decay=6.0):
    return math.exp(-(b % 1.0) * decay) if b >= 0 else 0.0
def step(x, fps_div):  # quantise (stop-motion)
    return math.floor(x * fps_div) / fps_div

# ---------------------------------------------------------------- colour
def col(h, a=1.0):
    h = h.lstrip('#')
    r, g, bb = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return skia.Color(r, g, bb, int(clamp(a) * 255))
def rgb(h):
    h = h.lstrip('#'); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], float) / 255
def c3(v, a=1.0):
    v = np.clip(v, 0, 1); return skia.Color(int(v[0]*255), int(v[1]*255), int(v[2]*255), int(clamp(a)*255))
def mix(h1, h2, t, a=1.0): return c3(rgb(h1) * (1 - t) + rgb(h2) * t, a)

CORAL = '#D97757'; CREAM = '#F0EEE6'; INK = '#141413'

# ---------------------------------------------------------------- paint
def P(color=None, stroke=0, cap='round', blur=0, shader=None, aa=True, blend=None, alpha=None):
    p = skia.Paint(AntiAlias=aa)
    if color is not None: p.setColor(color)
    if alpha is not None: p.setAlphaf(clamp(alpha))
    if stroke:
        p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(stroke)
        p.setStrokeCap({'round': skia.Paint.kRound_Cap, 'butt': skia.Paint.kButt_Cap,
                        'square': skia.Paint.kSquare_Cap}[cap])
        p.setStrokeJoin(skia.Paint.kRound_Join)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    if shader is not None: p.setShader(shader)
    if blend is not None: p.setBlendMode(blend)
    return p

def rrect(c, x, y, w, h, r, paint):
    c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(x, y, w, h), r, r), paint)
def shadow_rrect(c, x, y, w, h, r, dy=12, blur=18, a=.25, colr='#000000'):
    rrect(c, x, y + dy, w, h, r, P(col(colr, a), blur=blur))
def poly(pts, close=True):
    p = skia.Path(); p.addPoly([skia.Point(float(a), float(b)) for a, b in pts], close); return p
def lin_grad(x0, y0, x1, y1, cols, pos=None):
    return skia.GradientShader.MakeLinear([skia.Point(x0, y0), skia.Point(x1, y1)], cols, pos)
def rad_grad(x, y, r, cols, pos=None):
    return skia.GradientShader.MakeRadial(skia.Point(x, y), max(r, 1e-3), cols, pos)
def bg(c, h): c.clear(col(h))
def vgrad_bg(c, top, bot):
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin_grad(0, 0, 0, H, [col(top), col(bot)])))
def vignette(c, a=.55, colr='#000000'):
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=rad_grad(W/2, H/2, W*.75, [col(colr, 0), col(colr, 0), col(colr, a)], [0, .55, 1])))

# ---------------------------------------------------------------- fonts
FAM = {'sans': 'Noto Sans CJK SC', 'serif': 'Noto Serif CJK SC', 'kai': 'AR PL UKai CN',
       'pixel': 'Unifont', 'mono': 'Noto Sans Mono CJK SC', 'latin': 'Liberation Sans',
       'dejamono': 'DejaVu Sans Mono', 'zen': 'WenQuanYi Zen Hei'}
@functools.lru_cache(None)
def TF(fam, w=700):
    return skia.Typeface(FAM.get(fam, fam), skia.FontStyle(w, 5, skia.FontStyle.kUpright_Slant))
@functools.lru_cache(512)
def F(fam, size, w=700, alias=False):
    f = skia.Font(TF(fam, w), size)
    if alias:
        f.setEdging(skia.Font.Edging.kAlias); f.setHinting(skia.FontHinting.kNone)
    else:
        f.setSubpixel(True); f.setEdging(skia.Font.Edging.kAntiAlias)
    return f
def tw(s, size, fam='sans', w=700, sp=0):
    f = F(fam, size, w); return f.measureText(s) + sp * max(len(s) - 1, 0)

def text(c, s, x, y, size, color, fam='sans', w=700, align='c', paint=None, sp=0, alias=False, mid=True):
    """draw a line of text.  y = visual centre (mid=True) or baseline."""
    f = F(fam, size, w, alias)
    p = paint or P(color)
    if paint is not None and color is not None: p.setColor(color)
    width = f.measureText(s) + sp * max(len(s) - 1, 0)
    x0 = x - width / 2 if align == 'c' else x - width if align == 'r' else x
    yb = y + size * .36 if mid else y
    if sp == 0:
        c.drawString(s, x0, yb, f, p)
    else:
        cx = x0
        for ch in s:
            c.drawString(ch, cx, yb, f, p); cx += f.measureText(ch) + sp
    return width

def chars(c, s, x, y, size, color, fam='sans', w=700, align='c', fn=None, sp=0, paint=None):
    """per-character animated text. fn(i,n)->(dx,dy,scale,alpha,rot_deg)"""
    f = F(fam, size, w)
    ws = [f.measureText(ch) for ch in s]
    total = sum(ws) + sp * max(len(s) - 1, 0)
    cx = x - total / 2 if align == 'c' else x - total if align == 'r' else x
    n = len(s)
    for i, ch in enumerate(s):
        dx, dy, sc, al, rot = fn(i, n) if fn else (0, 0, 1, 1, 0)
        if al > 0.002 and sc > 0.002:
            p = skia.Paint(paint) if paint is not None else P(color)
            if paint is not None and color is not None: p.setColor(color)
            p.setAlphaf(p.getAlphaf() * clamp(al))
            ccx = cx + ws[i] / 2 + dx; ccy = y + dy
            c.save(); c.translate(ccx, ccy); c.rotate(rot); c.scale(sc, sc)
            c.drawString(ch, -ws[i] / 2, size * .36, f, p)
            c.restore()
        cx += ws[i] + sp
    return total

def text_path(s, x, y, size, fam='sans', w=700, align='c'):
    f = F(fam, size, w); width = f.measureText(s)
    x0 = x - width / 2 if align == 'c' else x - width if align == 'r' else x
    blob = skia.TextBlob.MakeFromString(s, f)
    return blob, x0, y + size * .36

# ---------------------------------------------------------------- noise / textures
def value_noise(h, w, cell, seed=0, octaves=4):
    rs = np.random.RandomState(seed); out = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        gh, gw = max(2, int(h / cell) + 2), max(2, int(w / cell) + 2)
        g = rs.rand(gh, gw)
        z = ndimage.zoom(g, (h / (gh - 1) * 1.0, w / (gw - 1) * 1.0), order=3)[:h, :w]
        if z.shape != (h, w): z = np.pad(z, ((0, h - z.shape[0]), (0, w - z.shape[1])), mode='edge')
        out += z * amp; tot += amp; amp *= .5; cell = max(cell / 2, 1)
    return out / tot

def to_img(arr_rgb, alpha=None):
    a = np.clip(arr_rgb * 255, 0, 255).astype(np.uint8)
    al = np.full(a.shape[:2], 255, np.uint8) if alpha is None else np.clip(alpha * 255, 0, 255).astype(np.uint8)
    a = (a.astype(np.uint16) * al[..., None] // 255).astype(np.uint8)   # premultiply
    rgba = np.dstack([a, al]).copy()
    return skia.Image.fromarray(rgba, colorType=skia.ColorType.kRGBA_8888_ColorType, alphaType=skia.AlphaType.kPremul_AlphaType)
def speck_img(n, strength):
    """n: signed field (~ -.5..5). white where >0, black where <0, alpha = |n|*strength"""
    v = (n > 0).astype(float)
    return to_img(np.dstack([v, v, v]), np.clip(np.abs(n) * strength, 0, 1))
@functools.lru_cache(None)
def paper_speck(seed=21):
    h, w = H // 2, W // 2
    n = value_noise(h, w, 90, seed) - .5
    g = np.random.RandomState(seed + 7).rand(h, w) - .5
    fib = ndimage.gaussian_filter1d(np.random.RandomState(seed + 3).rand(h, w) - .5, 6, axis=1)
    f = n * .5 + g * .8 + fib * 3
    f = ndimage.zoom(f, 2, order=1)[:H, :W]
    return speck_img(f, .35)

@functools.lru_cache(None)
def tex_paper(hexc, grain=.06, fiber=.05, seed=1, w=W, h=H):
    base = rgb(hexc)
    n = value_noise(h // 2, w // 2, 90, seed) - .5
    g = np.random.RandomState(seed + 7).rand(h // 2, w // 2) - .5
    fib = ndimage.gaussian_filter1d(np.random.RandomState(seed + 3).rand(h // 2, w // 2) - .5, 6, axis=1)
    v = 1 + n * fiber * 2 + g * grain + fib * fiber * 6
    v = ndimage.zoom(v, 2, order=1)[:h, :w]
    return to_img(base[None, None, :] * v[..., None])

@functools.lru_cache(None)
def grain_img(seed):
    g = np.random.RandomState(seed).rand(H, W) - .5
    return speck_img(g, .22)

def draw_full(c, img, blend=None, alpha=1.0):
    p = P(); p.setAlphaf(alpha)
    if blend is not None: p.setBlendMode(blend)
    c.drawImageRect(img, skia.Rect.MakeWH(W, H), skia.SamplingOptions(skia.FilterMode.kLinear), p)

def grain(c, b, strength=1.0, fps_div=12):
    k = int(step(b * SPB, fps_div) * fps_div) % 4
    p = P(); p.setAlphaf(clamp(.6 * strength)); c.drawImage(grain_img(3 + k), 0, 0, skia.SamplingOptions(), p)

# ---------------------------------------------------------------- rough / hand-drawn
def rough_line(x0, y0, x1, y1, seed, amp=2.5, n=None):
    rs = random.Random(seed)
    L = math.hypot(x1 - x0, y1 - y0); n = n or max(3, int(L / 40))
    nx, ny = (-(y1 - y0) / (L + 1e-9), (x1 - x0) / (L + 1e-9))
    pts = []
    bow = rs.uniform(-1, 1) * amp * 1.6
    for i in range(n + 1):
        t = i / n; j = rs.uniform(-amp, amp) * (1 if 0 < i < n else .4)
        o = j + bow * math.sin(math.pi * t)
        pts.append((x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o))
    return pts
def smooth_path(pts, close=False):
    p = skia.Path()
    if len(pts) < 2: return p
    p.moveTo(*pts[0])
    for i in range(1, len(pts) - 1):
        mx, my = (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2
        p.quadTo(pts[i][0], pts[i][1], mx, my)
    p.lineTo(*pts[-1])
    if close: p.close()
    return p
def partial(path, t):
    """trim a path to fraction t (draw-on)"""
    if t >= 1: return path
    if t <= 0: return skia.Path()
    meas = skia.PathMeasure(path, False)
    out = skia.Path(); first = True
    while True:
        L = meas.getLength()
        dst = skia.Path(); meas.getSegment(0, L * t, dst, True)
        out.addPath(dst)
        if not meas.nextContour(): break
    return out
def rough_circle(cx, cy, r, seed, amp=3, turns=1.08, n=40):
    rs = random.Random(seed); ph = rs.uniform(0, 6.28); pts = []
    for i in range(int(n * turns) + 1):
        a = ph + i / n * 2 * math.pi
        rr = r + rs.uniform(-amp, amp) + amp * 1.5 * math.sin(a * 2 + ph)
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr * .96))
    return pts

# ---------------------------------------------------------------- ortho 3D
def rot_mat(yaw, pitch):
    cy, sy, cp, sp = math.cos(yaw), math.sin(yaw), math.cos(pitch), math.sin(pitch)
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rx = np.array([[1, 0, 0], [0, cp, -sp], [0, sp, cp]])
    return Rx @ Ry

DIRS = [((1, 0, 0), [(1, 0, 0), (1, 1, 0), (1, 1, 1), (1, 0, 1)]),
         ((-1, 0, 0), [(0, 0, 1), (0, 1, 1), (0, 1, 0), (0, 0, 0)]),
         ((0, 1, 0), [(0, 1, 0), (0, 1, 1), (1, 1, 1), (1, 1, 0)]),
         ((0, -1, 0), [(0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1)]),
         ((0, 0, 1), [(1, 0, 1), (1, 1, 1), (0, 1, 1), (0, 0, 1)]),
         ((0, 0, -1), [(0, 0, 0), (0, 1, 0), (1, 1, 0), (1, 0, 0)])]
FACE_KIND = ['side', 'side', 'top', 'bottom', 'side', 'side']

def voxel_faces(vox):
    """vox: dict (x,y,z)->payload. returns list of (corners(4,3) local, normal, payload, key, kind)"""
    out = []
    for key, pay in vox.items():
        x, y, z = key
        for di, (n, cs) in enumerate(DIRS):
            if (x + n[0], y + n[1], z + n[2]) in vox: continue
            out.append((np.array([(x + a, y + b, z + cc) for a, b, cc in cs], float), np.array(n, float), pay, key, FACE_KIND[di]))
    return out

def project(pts, R, scale, cx, cy):
    q = pts @ R.T
    return np.stack([cx + q[..., 0] * scale, cy - q[..., 1] * scale], -1), q[..., 2]
```

### 3/7 · `claude_intro/music.py`
<!-- casebook-file {"path": "claude_intro/music.py", "lines": 255, "final_newline": true, "sha256": "ec028153edd95fb3b37833ae2a72ede1730de2ac7629156d961712faced824d6", "original_sha256": "ec028153edd95fb3b37833ae2a72ede1730de2ac7629156d961712faced824d6"} -->
```python
"""128 BPM soundtrack, 100% synthesised with numpy. Every section = 1 shot = 16 beats."""
import numpy as np
from scipy import signal
from scipy.io import wavfile
from core import SPB, SCENE_BEATS, TAIL_BEATS
from plan import N_SHOTS, TYPING, BIG_DROPS

SR = 44100
TOTAL_BEATS = N_SHOTS * SCENE_BEATS + TAIL_BEATS
N = int(TOTAL_BEATS * SPB * SR) + SR
rng = np.random.RandomState(7)

L = np.zeros(N); R = np.zeros(N)          # music bus (sidechained)
DL = np.zeros(N); DR = np.zeros(N)        # drum bus
FX = np.zeros((2, N))                     # fx bus (not sidechained)
kick_times = []

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def bi(b): return int(b * SPB * SR)
def add(buf, start, x, gain=1.0):
    if start >= N: return
    e = min(N, start + len(x)); buf[start:e] += x[:e - start] * gain
def addst(bl, br, start, x, g=1.0, pan=0.0):
    add(bl, start, x, g * np.sqrt(.5 * (1 - pan))); add(br, start, x, g * np.sqrt(.5 * (1 + pan)))
def env_adsr(n, a=.005, d=.1, s=.6, r=.1, hold=None):
    a_, d_, r_ = int(a * SR), int(d * SR), int(r * SR)
    hold = n if hold is None else hold
    e = np.zeros(n + r_)
    e[:a_] = np.linspace(0, 1, a_, False) if a_ else 1
    dd = min(d_, max(hold - a_, 0)); e[a_:a_ + dd] = np.linspace(1, s, dd, False)
    e[a_ + dd:hold] = s
    e[hold:hold + r_] = np.linspace(s, 0, r_) if r_ else 0
    return e[:hold + r_]
def lp(x, fc, order=2):
    b, a = signal.butter(order, min(fc / (SR / 2), .99)); return signal.lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = signal.butter(order, min(fc / (SR / 2), .99), 'high'); return signal.lfilter(b, a, x)
def bp(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), min(hi / (SR / 2), .99)], 'band'); return signal.lfilter(b, a, x)
def saw(f, n, ph=0.0): t = np.arange(n) / SR; return 2 * ((f * t + ph) % 1.0) - 1
def sq(f, n, duty=.5): t = np.arange(n) / SR; return np.where((f * t) % 1.0 < duty, 1.0, -1.0)
def sine(f, n): return np.sin(2 * np.pi * f * np.arange(n) / SR)
def tri(f, n): return 2 * np.abs(saw(f, n)) - 1

# ------------------------------------------------------------------ harmony
PROG = [  # (bass, pad voicing) per bar : Am  F  C  G
    (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67])]
HOOK = [[(0, 76, .5), (.75, 72, .25), (1.5, 69, .5), (2.5, 72, .5), (3, 76, .75)],
        [(0, 77, .5), (.75, 76, .25), (1.5, 72, .5), (2.5, 69, 1.)],
        [(0, 79, .5), (.75, 76, .25), (1.5, 72, .5), (2.5, 76, .5), (3, 79, .75)],
        [(0, 74, .5), (.75, 71, .25), (1.5, 67, .5), (2.5, 71, .5), (3, 74, 1.)]]
def chord_at(beat): return PROG[int(beat // 4) % 4]

# ------------------------------------------------------------------ voices
def v_kick(b, g=1.0, hard=False):
    n = int(.45 * SR); t = np.arange(n) / SR
    f = 42 + 150 * np.exp(-t * 32); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * (7 if hard else 9))
    x[:200] += rng.randn(200) * .25 * np.linspace(1, 0, 200)
    x = np.tanh(x * 1.6)
    addst(DL, DR, bi(b), x, .95 * g); kick_times.append(bi(b))
def v_clap(b, g=1.0):
    n = int(.3 * SR); t = np.arange(n) / SR; z = bp(rng.randn(n), 900, 5000)
    e = np.exp(-t * 18); 
    for o in (.0, .011, .022): e += np.where(t >= o, np.exp(-(t - o) * 160), 0) * .6
    x = z * e * .35
    addst(DL, DR, bi(b), x, g, -.1); addst(FX[0], FX[1], bi(b), x, .12 * g, .2)
def v_hat(b, g=1.0, open_=False, pan=.25):
    n = int((.25 if open_ else .06) * SR); t = np.arange(n) / SR
    x = hp(rng.randn(n), 7500) * np.exp(-t * (14 if open_ else 70))
    addst(DL, DR, bi(b), x, .22 * g, pan)
def v_bass(b, m, dur, g=1.0, bright=900, chip=False):
    n = int(dur * SPB * SR)
    if chip:
        x = sq(mtof(m), n, .5) * .35 * env_adsr(n, .002, .05, .8, .02, n)[:n]
    else:
        f = mtof(m); x = .6 * saw(f, n) + .5 * saw(f * 1.005, n, .3) + .7 * sine(f / 2, n)
        x = lp(x, bright) * env_adsr(n, .004, .12, .7, .03, n)[:n]
    addst(L, R, bi(b), x, .42 * g)
def v_pad(b, notes, dur, g=1.0, cutoff=2200):
    n = int(dur * SPB * SR); x = np.zeros(n)
    for m in notes:
        f = mtof(m)
        for d, ph in ((-.12, .1), (0, .5), (.11, .8)):
            x += saw(f * 2 ** (d / 12), n, ph)
    x = lp(x / (len(notes) * 3), cutoff) * env_adsr(n, .25, .3, .8, .5, n)[:n]
    xr = np.roll(x, 331)
    add(L, bi(b), x, .38 * g); add(R, bi(b), xr, .38 * g)
def v_pluck(b, m, g=1.0, pan=0.0, dec=9.0, bright=5000):
    n = int(.5 * SR); t = np.arange(n) / SR; f = mtof(m)
    x = (saw(f, n) * .6 + sq(f, n) * .3) * np.exp(-t * dec)
    x = lp(x, bright)
    addst(L, R, bi(b), x, .22 * g, pan); addst(FX[0], FX[1], bi(b), x, .06 * g, -pan)
def v_chip(b, m, dur, g=1.0, duty=.25, pan=0.):
    n = int(dur * SPB * SR); x = sq(mtof(m), n, duty) * env_adsr(n, .001, .06, .6, .01, n)[:n]
    addst(L, R, bi(b), x, .11 * g, pan)
def v_lead(b, m, dur, g=1.0):
    n = int(dur * SPB * SR); f = mtof(m); t = np.arange(n) / SR
    vib = 1 + .004 * np.sin(2 * np.pi * 5.5 * t) * np.clip(t * 4, 0, 1)
    x = np.zeros(n)
    for d in (-.18, -.07, 0, .07, .18):
        x += 2 * ((np.cumsum(f * vib * 2 ** (d / 12)) / SR) % 1.0) - 1
    x = lp(x / 5, 4200) * env_adsr(n, .01, .15, .75, .12, n)[:n]
    addst(L, R, bi(b), x, .2 * g, .0); addst(FX[0], FX[1], bi(b), x, .08 * g)
def v_stab(b, notes, g=1.0):
    n = int(.35 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in notes:
        for d in (-.1, .1): x += saw(mtof(m + 12) * 2 ** (d / 12), n)
    x = lp(x / len(notes), 3500) * np.exp(-t * 9)
    addst(L, R, bi(b), x, .16 * g); addst(FX[0], FX[1], bi(b), x, .1 * g)
def v_riser(b0, b1, g=1.0):
    n = bi(b1) - bi(b0); t = np.linspace(0, 1, n)
    z = rng.randn(n); out = np.zeros(n); chunk = 2048
    for i in range(0, n, chunk):
        fc = 400 + 9000 * t[i] ** 2
        out[i:i + chunk] = bp(z[i:i + chunk], fc * .7, fc * 1.3) if i else 0
    f = 110 * 2 ** (t * 3); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * .25
    x = (out * 1.2 + tone) * t ** 2
    add(FX[0], bi(b0), x, .45 * g); add(FX[1], bi(b0), np.roll(x, 200), .45 * g)
def v_impact(b, g=1.0):
    n = int(2.2 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.2)
    crash = hp(rng.randn(n), 3000) * np.exp(-t * 2.8) * .35
    x = np.tanh(boom * 1.4) * .9 + crash
    add(DL, bi(b), x, .8 * g); add(DR, bi(b), x, .8 * g); addst(FX[0], FX[1], bi(b), crash, .3 * g)
def v_whoosh(b_end, length=1.0, g=1.0):
    n = int(length * SPB * SR); t = np.linspace(0, 1, n)
    z = rng.randn(n); out = np.zeros(n); chunk = 1024
    for i in range(chunk, n, chunk):
        fc = 300 + 5000 * t[i] ** 1.5; out[i:i + chunk] = bp(z[i:i + chunk], fc * .6, fc * 1.4)
    x = out * np.sin(np.pi * t * .5) ** 2 * .55
    add(FX[0], bi(b_end) - n, x, g); add(FX[1], bi(b_end) - n, np.roll(x, 90), g)
def v_click(b, g=1.0):
    n = int(.03 * SR); t = np.arange(n) / SR
    x = hp(rng.randn(n), 2500) * np.exp(-t * 220) + sine(1800 + rng.rand() * 800, n) * np.exp(-t * 400) * .4
    addst(FX[0], FX[1], bi(b), x, .35 * g, rng.uniform(-.4, .4))
def v_blip(b, m=84, g=1.0):
    n = int(.08 * SR); x = sq(mtof(m), n, .5) * np.exp(-np.arange(n) / SR * 40)
    addst(FX[0], FX[1], bi(b), x, .08 * g)

# ------------------------------------------------------------------ arrangement
def section(s):
    B = s * SCENE_BEATS
    full_drums = s in (2, 4, 5, 6, 9, 10, 13)
    for bar in range(4):
        b0 = B + bar * 4; bass, pad = PROG[bar]
        # ---------- harmony beds
        if s in (0,):
            v_pad(b0, pad, 4, .7, cutoff=700 + bar * 250)
            add(L, bi(b0), sine(mtof(33), bi(4)) * .12); add(R, bi(b0), sine(mtof(33), bi(4)) * .12)
        elif s in (7, 11):  # chiptune shots
            for i in range(8): v_bass(b0 + i * .5, bass - 12 + (12 if i % 2 else 0), .45, .8, chip=True)
            arp = pad + [pad[1] + 12]
            for i in range(16 if s == 11 else 8):
                st = .25 if s == 11 else .5
                v_chip(b0 + i * st, arp[i % len(arp)] + 12, st * .9, 1.0, .25, pan=.3 if i % 2 else -.3)
        elif s == 14:
            v_pad(b0, pad, 4, .9, cutoff=1600)
            for i, m in enumerate(pad):
                v_pluck(b0 + i * .5 + (bar == 3) * 0, m + 12, .6, pan=(i - 1.5) * .3, dec=4, bright=3000)
            if bar < 2: v_bass(b0, bass - 12, 3.5, .7, bright=500)
        elif s == 12:  # blueprint build
            v_pad(b0, pad, 4, .8, cutoff=900 + bar * 700)
            for i in range(8): v_pluck(b0 + i * .5, pad[i % 4] + 12, .55 + bar * .12, pan=.3 * (-1) ** i, bright=2000 + bar * 1000)
            if bar >= 2:
                for i in range(8): v_bass(b0 + i * .5, bass, .4, .8)
        elif s == 8:  # half-time clay
            v_pad(b0, pad, 4, .9, cutoff=1800)
            v_bass(b0, bass - 12, 1.5, 1.0, bright=500); v_bass(b0 + 2.5, bass - 12, 1.0, .8, bright=500)
            for i in (0, 1.5, 3): v_pluck(b0 + i, pad[int(i) % 4] + 12, .7, pan=-.2, dec=6)
        else:
            v_pad(b0, pad, 4, .55 if s in (1, 3) else .75, cutoff=2600 if s != 3 else 1500)
            for i in range(8):  # offbeat pumping bass
                v_bass(b0 + i * .5, bass + (12 if i % 4 == 3 and s >= 4 else 0), .42, .9 if s > 1 else .7, bright=700 + 250 * (s >= 4))
            if s in (1, 3, 6, 9):
                st = .25 if s in (6, 9) else .5
                seq = pad + pad[::-1][1:3]
                for i in range(int(4 / st)):
                    v_pluck(b0 + i * st, seq[i % len(seq)] + (12 if s != 3 else 0), .9 if s != 3 else 1.1,
                            pan=.35 * np.sin(i), dec=12 if s == 3 else 9, bright=2600 if s == 3 else 5000)
            if s in (4, 5, 13):
                for (o, m, d) in HOOK[bar]: v_lead(b0 + o, m, d, 1.0 if s != 5 else .75)
            if s == 13:
                for i in range(16): v_pluck(b0 + i * .25, pad[i % 4] + 24, .45, pan=.4 * (-1) ** i)
            if s == 10:
                for i in range(4): v_stab(b0 + i, pad, 1.0)
        # ---------- drums
        for i in range(4):
            b = b0 + i
            if s == 0: continue
            if s == 8:
                if i in (0,): v_kick(b)
                if i == 2: v_clap(b, 1.0)
                if i == 1: v_kick(b + .5, .7)
                for k in range(2): v_hat(b + k * .5 + .25, .5)
                continue
            if s == 12:
                if bar == 2: v_kick(b, .8); v_kick(b + .5, .6)
                if bar == 3:
                    for k in range(4): v_kick(b + k * .25, .5 + .12 * i); v_clap(b + k * .25, .25 + i * .12)
                continue
            if s == 14 and bar >= 2: continue
            if s in (7, 11):
                v_kick(b, .8)
                n_ = int(.12 * SR); nz = rng.randn(n_) * np.exp(-np.arange(n_) / SR * 30)
                if i % 2: addst(DL, DR, bi(b), np.sign(nz) * np.abs(nz) ** .5 * .15)
                v_hat(b + .5, .5)
                continue
            v_kick(b, 1.0, hard=s == 13)
            if i % 2 == 1 and s >= 2: v_clap(b)
            if s >= 1: v_hat(b + .5, .8 if full_drums else .5, open_=full_drums and s in (5, 13), pan=.2)
            if full_drums:
                v_hat(b + .25, .35, pan=-.3); v_hat(b + .75, .35, pan=-.3)
        if s == 10 and bar == 3: v_clap(b0 + 3.5, .8); v_clap(b0 + 3.75, .9)
    # ---------- transitions
    if s < N_SHOTS - 1:
        v_whoosh(B + 16, .75, .8)
    if s in BIG_DROPS: v_impact(B, 1.0)
    elif s > 0: v_impact(B, .35)

def build(path):
    for s in range(N_SHOTS): section(s)
    # S00 specifics: typing clicks, riser, boot blips
    for b0, b1, txt in TYPING:
        for i in range(len(txt)): v_click(b0 + (b1 - b0) * i / len(txt))
    for k in range(4): v_blip(8 + k * .5, 84 + k * 3)
    v_riser(12, 15.5, 1.0); v_riser(12 * 16 + 8, 13 * 16, 1.0)
    # outro final hit + long chord
    END = N_SHOTS * SCENE_BEATS
    v_impact(END, .7)
    v_pad(END, [45, 57, 64, 69, 72], TAIL_BEATS, 1.0, cutoff=1200)
    v_kick(END, .8)
    # sidechain
    sc = np.ones(N); env = np.exp(-np.arange(int(.22 * SR)) / SR * 16)
    for k in kick_times:
        e = min(N, k + len(env)); sc[k:e] = np.minimum(sc[k:e], 1 - .72 * env[:e - k])
    # reverb on fx + music send
    ir_n = int(2.0 * SR); tt = np.arange(ir_n) / SR
    irL = rng.randn(ir_n) * np.exp(-tt * 3.2); irR = rng.randn(ir_n) * np.exp(-tt * 3.2)
    irL = lp(irL, 5000); irR = lp(irR, 5000)
    send = FX + np.stack([L, R]) * .15
    wetL = signal.fftconvolve(send[0], irL)[:N] * .09; wetR = signal.fftconvolve(send[1], irR)[:N] * .09
    outL = L * sc + DL + FX[0] + wetL; outR = R * sc + DR + FX[1] + wetR
    out = np.stack([outL, outR], 1)
    out = hp(out.T, 25).T
    out = np.tanh(out * 1.3) / np.tanh(1.3)
    # fade tail
    endi = int(TOTAL_BEATS * SPB * SR); fade = int(1.5 * SR)
    out[endi - fade:endi] *= np.linspace(1, 0, fade)[:, None]; out = out[:endi]
    out = out / np.max(np.abs(out)) * .93
    wavfile.write(path, SR, (out * 32767).astype(np.int16))
    print('audio', out.shape[0] / SR, 's')

if __name__ == '__main__':
    import sys; build(sys.argv[1] if len(sys.argv) > 1 else 'music.wav')
```

### 4/7 · `claude_intro/plan.py`
<!-- casebook-file {"path": "claude_intro/plan.py", "lines": 25, "final_newline": true, "sha256": "9935afb3cd04dc70f7bf7036f20872b6b4235a76b309ae4ec2313dd699047525", "original_sha256": "9935afb3cd04dc70f7bf7036f20872b6b4235a76b309ae4ec2313dd699047525"} -->
```python
# 拉片表 / shot list — every shot is exactly 16 beats (4 bars) @128 BPM = 7.5 s
SHOTS = [
    # (code, 中文风格, English style, 内容, transition INTO this shot)
    ("S00", "终端 CRT",      "TERMINAL",        "开机：whoami",               None),
    ("S01", "手绘线稿",      "HAND-DRAWN",      "你好，我是 Claude",          "flash"),
    ("S02", "2D 涂鸦",       "FLAT DOODLE",     "出身 Anthropic",             "whip"),
    ("S03", "纸片剪影",      "PAPER CUT",       "2023 诞生",                  "tear"),
    ("S04", "2.5D 等距",     "ISOMETRIC 2.5D",  "2024 Claude 3 家族",         "iris"),
    ("S05", "层级景深",      "LAYERED DEPTH",   "2024 学会做事",              "zoom"),
    ("S06", "体素",          "VOXEL",           "2025 住进终端",              "pixel"),
    ("S07", "方块定格",      "BLOCK STOP-MO",   "2025 Claude 4",              "slide"),
    ("S08", "3D 黏土定格",   "CLAY STOP-MO",    "2026 现在的我",              "flash"),
    ("S09", "2D 组件库",     "UI KIT",          "你在哪能找到我",             "iris"),
    ("S10", "瑞士排版",      "SWISS KINETIC",   "我在乎什么",                 "wipe"),
    ("S11", "8-bit 像素",    "8-BIT PIXEL",     "我的弱点",                   "pixel"),
    ("S12", "工程蓝图",      "BLUEPRINT",       "我是怎么造出来的",           "whip"),
    ("S13", "故障混剪",      "GLITCH MONTAGE",  "全部都是代码",               "glitch"),
    ("S14", "极简收尾",      "MINIMAL",         "很高兴认识你",               "flash"),
]
N_SHOTS = len(SHOTS)

# S00 typing schedule (beat_start, beat_end, text) — shared with the typing SFX
TYPING = [(1.0, 2.5, "whoami"), (4.5, 7.5, "claude --intro --style=all")]
# shots that start with a big impact in the music
BIG_DROPS = {1, 4, 8, 13}
```

### 5/7 · `claude_intro/render.py`
<!-- casebook-file {"path": "claude_intro/render.py", "lines": 244, "final_newline": true, "sha256": "4540c2e5abb0d28e9b9d8cdfa42dd888d9cadb2a4637e27125930e904cbc325a", "original_sha256": "4540c2e5abb0d28e9b9d8cdfa42dd888d9cadb2a4637e27125930e904cbc325a"} -->
```python
import sys, os, subprocess, math, random, time
import numpy as np, skia
from core import *
from plan import SHOTS, N_SHOTS
from scenes_a import s00, s01, s02, s03, s04, s05, s06, s07
from scenes_b import s08, s09, s10, s11, s12, s14

TOTAL_BEATS = N_SHOTS * SCENE_BEATS + TAIL_BEATS
TOTAL_FRAMES = int(math.floor(b2t(TOTAL_BEATS) * FPS))

# ---------------------------------------------------------------- offscreen helpers
OFF = [skia.Surface(W, H) for _ in range(3)]
def shot_img(i, lb, slot=0):
    s = OFF[slot]; oc = s.getCanvas(); oc.clear(col('#000000')); SC[i](oc, lb); return s.makeImageSnapshot()
SAMP_LIN = skia.SamplingOptions(skia.FilterMode.kLinear)
SAMP_NN = skia.SamplingOptions(skia.FilterMode.kNearest)
def cmat(r, g, bb):
    return skia.ColorFilters.Matrix([r, 0, 0, 0, 0, 0, g, 0, 0, 0, 0, 0, bb, 0, 0, 0, 0, 0, 1, 0])
def glitch_draw(c, img, amt, seed):
    rs = random.Random(seed)
    dx = 28 * amt
    c.drawRect(skia.Rect.MakeWH(W, H), P(col('#000000')))
    for (r, g, bb, off) in [(1, 0, 0, -dx), (0, 1, 1, dx)]:
        p = P(); p.setColorFilter(cmat(r, g, bb)); p.setBlendMode(skia.BlendMode.kPlus)
        c.drawImage(img, off, 0, SAMP_LIN, p)
    for k in range(int(14 * amt) + 1):
        y = rs.uniform(0, H); h = rs.uniform(8, 90); sh = rs.uniform(-260, 260) * amt
        c.drawImageRect(img, skia.Rect.MakeXYWH(0, y, W, h), skia.Rect.MakeXYWH(sh, y, W, h), SAMP_LIN, P())
        if rs.random() < .3 * amt:
            c.drawRect(skia.Rect.MakeXYWH(rs.uniform(0, W), y, rs.uniform(100, 700), h * .4), P(col(rs.choice(['#FF2E63', '#08F7FE', '#FFFFFF']), .8)))
def pixelate(c, img, bs):
    bs = max(1, int(bs))
    if bs <= 1: c.drawImage(img, 0, 0); return
    sw, sh = max(1, W // bs), max(1, H // bs)
    small = skia.Surface(sw, sh); small.getCanvas().drawImageRect(img, skia.Rect.MakeWH(sw, sh), SAMP_LIN, P())
    c.drawImageRect(small.makeImageSnapshot(), skia.Rect.MakeWH(W, H), SAMP_NN, P(aa=False))

# ---------------------------------------------------------------- S13 glitch montage
MONT = [(1, 12.5), (2, 13), (3, 12.5), (4, 11), (5, 2.2), (6, 10), (7, 12), (8, 13.5), (9, 12), (10, 9.5), (11, 12), (12, 11.5)]
MSURF = skia.Surface(W, H)
def s13(c, b):
    b = max(b, 0)
    if b < 12:
        k = int(b); fr = b - k; sid, hero = MONT[k]; word = SHOTS[sid][1]; src = hero + fr * .8; onset = k
    else:
        k = int((b - 12) * 2); fr = (b - 12) * 2 - k
        order = [3, 7, 11, 5, 9, 1, 6, 12]
        sid = order[k % 8]; src = MONT[sid - 1][1] + fr * .4; onset = 12 + k * .5
        word = ["全部", "都是", "代码", "写的", "100% CODE"][min(int(b - 12) if b < 15.5 else 4, 4)]
    mc = MSURF.getCanvas(); mc.clear(col('#000000'))
    punch = 1 + .07 * math.exp(-(b - onset) * 6)
    mc.save(); mc.translate(W / 2, H / 2); mc.scale(punch, punch); mc.translate(-W / 2, -H / 2)
    SC[sid](mc, src); mc.restore()
    img = MSURF.makeImageSnapshot()
    amt = math.exp(-(b - onset) * 7)
    glitch_draw(c, img, max(amt, .08), int(b * 30))
    c.drawRect(skia.Rect.MakeWH(W, H), P(col('#07060F', .55)))
    # big word with RGB split
    size = 230 if len(word) <= 4 else 190
    fam = 'latin' if word.isascii() else 'sans'
    sl = 1 + .25 * math.exp(-(b - onset) * 10)
    c.save(); c.translate(W / 2, H / 2); c.scale(sl, sl)
    off = 8 + 26 * amt
    text(c, word, 0, 0, size, col('#000000'), fam, 900, paint=P(col('#000000'), 22))
    for colr, dx in [('#FF2E63', -off), ('#08F7FE', off)]:
        text(c, word, dx, 0, size, col(colr), fam, 900)
    text(c, word, 0, 0, size, col('#FFFFFF'), fam, 900)
    c.restore()
    if b < 12:
        text(c, f"CALLBACK · SHOT {sid:02d} · {SHOTS[sid][2]}", W / 2, H / 2 + 190, 30, col('#FFFFFF', .85), 'dejamono', 700)
    c.drawRect(skia.Rect.MakeWH(W, H), P(col('#FFFFFF', .35 * math.exp(-(b - onset) * 9))))
    for y in range(0, H, 3): c.drawRect(skia.Rect.MakeXYWH(0, y, W, 1), P(col('#000000', .18)))

SC = [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14]

# ---------------------------------------------------------------- transitions
TIN = {'flash': .5, 'whip': .35, 'tear': .6, 'iris': .55, 'zoom': .5, 'pixel': .5, 'slide': .5, 'wipe': .55, 'glitch': .4}
TOUT = {'whip': .3, 'pixel': .5, 'glitch': .25, 'zoom': .25}

def tr_in(c, kind, i, lb, p):
    old = i - 1; olb = SCENE_BEATS + lb
    if kind == 'flash':
        s = 1 + .14 * (1 - e_outexp(p))
        c.save(); c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-W / 2, -H / 2); SC[i](c, lb); c.restore()
        c.drawRect(skia.Rect.MakeWH(W, H), P(col('#FFFFFF', (1 - p) ** 2)))
    elif kind == 'whip':
        xn = W * .6 * (1 - e_out3(p)); bl = 60 * (1 - p)
        for idx, xx, l in [(i, xn, lb), (old, xn - W, olb)]:
            img = shot_img(idx, l, 0 if idx == i else 1)
            pp = P(); pp.setImageFilter(skia.ImageFilters.Blur(bl, 0.1)) if bl > .5 else None
            c.drawImage(img, xx, 0, SAMP_LIN, pp)
    elif kind == 'tear':
        SC[old](c, olb)
        xe = -300 + (W + 600) * e_io3(p)
        edge = rough_line(xe + 200, -40, xe - 200, H + 40, 77, 14, 40)
        region = poly([(-50, -40)] + edge + [(-50, H + 40)])
        c.save(); c.clipPath(region, doAntiAlias=True); SC[i](c, lb); c.restore()
        c.drawPath(smooth_path(edge), P(col('#000000', .35), 26, blur=12))
        c.drawPath(smooth_path(edge), P(col('#FFF8EC'), 16))
    elif kind == 'iris':
        SC[old](c, olb)
        r = e_io3(p) * math.hypot(W, H) / 2 * 1.05
        path = skia.Path(); path.addCircle(W / 2, H / 2, max(r, .1))
        c.save(); c.clipPath(path, doAntiAlias=True); SC[i](c, lb); c.restore()
        c.drawCircle(W / 2, H / 2, r, P(col(CORAL), 24 * (1 - p) + 2))
    elif kind == 'zoom':
        new = shot_img(i, lb, 0); oldi = shot_img(old, olb, 1)
        sn = .7 + .3 * e_out3(p); pn = P()
        if p < 1: pn.setImageFilter(skia.ImageFilters.Blur(18 * (1 - p), 18 * (1 - p)))
        c.save(); c.translate(W / 2, H / 2); c.scale(sn, sn); c.translate(-W / 2, -H / 2); c.drawImage(new, 0, 0, SAMP_LIN, pn); c.restore()
        so = 1 + 1.4 * e_in3(p); po = P(); po.setAlphaf(1 - e_in3(p))
        c.save(); c.translate(W / 2, H / 2); c.scale(so, so); c.translate(-W / 2, -H / 2); c.drawImage(oldi, 0, 0, SAMP_LIN, po); c.restore()
    elif kind == 'pixel':
        pixelate(c, shot_img(i, lb), 1 + 60 * (1 - p) ** 2)
    elif kind == 'slide':
        q = math.floor(p * 4) / 4
        y = H * (1 - e_out3(q))
        c.save(); c.translate(0, y - H); SC[old](c, olb); c.restore()
        c.save(); c.translate(0, y); SC[i](c, lb); c.restore()
    elif kind == 'wipe':
        SC[old](c, olb)
        x = -500 + (W + 1000) * e_io3(p)
        region = poly([(-10, -10), (x + 150, -10), (x - 150, H + 10), (-10, H + 10)])
        c.save(); c.clipPath(region, doAntiAlias=True); SC[i](c, lb); c.restore()
        c.drawPath(poly([(x + 150, -10), (x + 450, -10), (x + 150, H + 10), (x - 150, H + 10)]), P(col('#E4002B')))
    elif kind == 'glitch':
        glitch_draw(c, shot_img(i, lb), 1 - p, int(lb * 60))

def tr_out(c, kind, i, lb, q):
    nxt = i + 1; nlb = lb - SCENE_BEATS
    if kind == 'whip':
        xo = -W * .4 * e_in3(q); bl = 60 * q
        for idx, xx, l in [(i, xo, lb), (nxt, xo + W, nlb)]:
            img = shot_img(idx, l, 0 if idx == i else 1)
            pp = P()
            if bl > .5: pp.setImageFilter(skia.ImageFilters.Blur(bl, .1))
            c.drawImage(img, xx, 0, SAMP_LIN, pp)
    elif kind == 'pixel':
        pixelate(c, shot_img(i, lb), 1 + 60 * q ** 2)
    elif kind == 'glitch':
        glitch_draw(c, shot_img(i, lb), q, int(lb * 60))
    elif kind == 'zoom':
        s = 1 + .08 * e_in3(q)
        c.save(); c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-W / 2, -H / 2); SC[i](c, lb); c.restore()

# ---------------------------------------------------------------- 拉片 HUD
def tc(t):
    f = int(round(t * FPS)); s, ff = divmod(f, FPS); m, s = divmod(s, 60); h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{s:02d}:{ff:02d}"
def chip(c, x, y, w, h, a):
    rrect(c, x, y, w, h, h / 2, P(col('#0B0B0F', .55 * a)))
    rrect(c, x, y, w, h, h / 2, P(col('#FFFFFF', .14 * a), 1.2))
def hud(c, t, b, i, lb):
    a = clamp(b / 1.0) * (1 - seg(b, N_SHOTS * SCENE_BEATS + .5, N_SHOTS * SCENE_BEATS + 2.5))
    if a <= 0: return
    code, cn, en, content, tr = SHOTS[i]
    fs = 21
    left = f"SHOT {i + 1:02d}/{N_SHOTS:02d}   {cn} · {en}"
    wl = tw(left, fs, 'mono', 700) + 90
    chip(c, 34, 26, wl, 46, a)
    on = (b % 1) < .5
    c.drawCircle(60, 49, 8, P(col('#FF3B30', a * (1 if on else .3))))
    text(c, left, 80, 49, fs, col('#FFFFFF', .92 * a), 'mono', 700, 'l')
    bar, beat = int(b // 4) + 1, int(b % 4) + 1
    right = f"TC {tc(t)}   BPM 128   BAR {bar:02d}.{beat}"
    wr = tw(right, fs, 'mono', 700) + 130
    chip(c, W - 34 - wr, 26, wr, 46, a)
    text(c, right, W - 34 - wr + 24, 49, fs, col('#FFFFFF', .92 * a), 'mono', 700, 'l')
    for k in range(4):
        lit = k == int(b % 4)
        c.drawRect(skia.Rect.MakeXYWH(W - 34 - 100 + k * 18, 42, 12, 14), P(col(CORAL if lit else '#FFFFFF', a * (1 if lit else .3))))
    # slate tag for the first beats of each shot
    st = seg(lb, 0, .3) * (1 - seg(lb, 2.2, 2.8))
    if st > 0 and b < N_SHOTS * SCENE_BEATS:
        tag = f"镜头 {i + 1:02d} ｜ 内容：{content} ｜ 入场转场：{(tr or 'cold open').upper()}"
        wt = tw(tag, 19, 'mono', 500) + 40
        chip(c, 34, 82, wt, 38, st * a)
        text(c, tag, 54, 101, 19, col('#FFE3D6', st * a), 'mono', 500, 'l')
    # timeline strip
    x0, x1, y = 34, W - 34, H - 22
    segw = (x1 - x0 - (N_SHOTS - 1) * 4) / N_SHOTS
    for k in range(N_SHOTS):
        x = x0 + k * (segw + 4)
        rrect(c, x, y - 3, segw, 6, 3, P(col('#000000', .35 * a)))
        fill = 1 if k < i else (clamp(lb / SCENE_BEATS) if k == i else 0)
        if fill > 0: rrect(c, x, y - 3, segw * fill, 6, 3, P(col(CORAL if k == i else '#FFFFFF', (.95 if k == i else .6) * a)))
    px = x0 + i * (segw + 4) + segw * clamp(lb / SCENE_BEATS)
    c.drawCircle(px, y, 7 + 3 * kick(b, 8), P(col('#FFFFFF', a)))

# ---------------------------------------------------------------- frame
def frame(c, t):
    b = t2b(t)
    i = min(int(b // SCENE_BEATS), N_SHOTS - 1); lb = b - i * SCENE_BEATS
    tr = SHOTS[i][4]; nxt = SHOTS[i + 1][4] if i + 1 < N_SHOTS else None
    c.clear(col('#000000'))
    if tr and lb < TIN[tr]: tr_in(c, tr, i, lb, lb / TIN[tr])
    elif nxt in TOUT and lb > SCENE_BEATS - TOUT[nxt]: tr_out(c, nxt, i, lb, (lb - (SCENE_BEATS - TOUT[nxt])) / TOUT[nxt])
    else: SC[i](c, lb)
    hud(c, t, b, i, lb)

MAIN = skia.Surface(W, H)
def render_frame(t):
    c = MAIN.getCanvas(); frame(c, t); return MAIN

def frames_for_shot(i):
    s = math.ceil(b2t(i * SCENE_BEATS) * FPS - 1e-9)
    e = TOTAL_FRAMES if i == N_SHOTS - 1 else math.ceil(b2t((i + 1) * SCENE_BEATS) * FPS - 1e-9)
    return range(s, e)

def encode_shot(i, out):
    buf = np.empty((H, W, 4), np.uint8)
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', f'{W}x{H}', '-r', str(FPS),
                           '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-g', '60', out],
                          stdin=subprocess.PIPE)
    info = skia.ImageInfo.MakeN32Premul(W, H)
    t0 = time.time(); fr = frames_for_shot(i)
    for n in fr:
        render_frame(n / FPS).readPixels(info, buf); ff.stdin.write(buf.tobytes())
    ff.stdin.close(); ff.wait()
    print(f"shot {i:02d}: {len(fr)} frames in {time.time() - t0:.1f}s", flush=True)

def contact(i, out, beats=(0.2, 3, 6, 9, 12, 15.2)):
    sheet = skia.Surface(1920, 720); sc = sheet.getCanvas(); sc.clear(col('#222222'))
    for k, lb in enumerate(beats):
        t = b2t(i * SCENE_BEATS + lb); img = render_frame(t).makeImageSnapshot()
        r, q = divmod(k, 3)
        sc.drawImageRect(img, skia.Rect.MakeXYWH(q * 640, r * 360, 640, 360), SAMP_LIN, P())
        text(sc, f"S{i:02d} b{lb}", q * 640 + 8, r * 360 + 20, 20, col('#00FF88'), 'dejamono', 700, 'l')
    sheet.makeImageSnapshot().save(out, skia.kPNG)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'sheet':
        for a in sys.argv[2:]: contact(int(a), f'sheets/s{int(a):02d}.png'); print('sheet', a, flush=True)
    elif cmd == 'still':
        t = float(sys.argv[2]); render_frame(t).makeImageSnapshot().save(sys.argv[3], skia.kPNG)
    elif cmd == 'shots':
        for a in sys.argv[2:]: encode_shot(int(a), f'segs/seg{int(a):02d}.mp4')
    elif cmd == 'final':
        with open('segs/list.txt', 'w') as f:
            for i in range(N_SHOTS): f.write(f"file 'seg{i:02d}.mp4'\n")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'segs/list.txt', '-i', 'music.wav',
                        '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', sys.argv[2]], check=True)
        print('final done')
```

### 6/7 · `claude_intro/scenes_a.py`
<!-- casebook-file {"path": "claude_intro/scenes_a.py", "lines": 730, "final_newline": true, "sha256": "d53a1e92fb31501ce4ad317cfa7f1862048e7f76844d8d737d9d38bce3050d95", "original_sha256": "d53a1e92fb31501ce4ad317cfa7f1862048e7f76844d8d737d9d38bce3050d95"} -->
```python
from core import *
from plan import TYPING

# ====================================================================== S00 TERMINAL / CRT
BIG = {
 'C': [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
 'L': ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
 'A': [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
 'U': ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
 'D': ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
 'E': ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
}
def typed(b, b0, b1, s):
    if b < b0: return ""
    return s[:int(len(s) * clamp((b - b0) / (b1 - b0)) + (1 if b >= b1 else 0))]

def s00(c, b):
    bg(c, '#0B0A09')
    shake = hit(b, 12, 3) * 10 + hit(b, 15, 4) * 18
    rs = random.Random(int(b * 20))
    c.save(); c.translate(rs.uniform(-shake, shake), rs.uniform(-shake, shake))
    # window
    X, Y, WW, HH = 210, 130, 1500, 820
    shadow_rrect(c, X, Y, WW, HH, 22, 30, 50, .6)
    rrect(c, X, Y, WW, HH, 22, P(col('#171513')))
    rrect(c, X, Y, WW, 56, 22, P(col('#24211E'))); c.drawRect(skia.Rect.MakeXYWH(X, Y + 30, WW, 26), P(col('#24211E')))
    for k, h in enumerate(['#FF5F57', '#FEBC2E', '#28C840']):
        c.drawCircle(X + 34 + k * 30, Y + 28, 9, P(col(h)))
    text(c, "claude — zsh — 128 BPM", X + WW / 2, Y + 28, 22, col('#8A837A'), 'mono', 400)
    amber, cream = col(CORAL), col('#E9E3D6')
    glow = P(col(CORAL, .55), blur=9)
    lx, ly, lh, fs = X + 50, Y + 120, 64, 38
    cursor_on = (b * 2) % 2 < 1.2
    if b < 12:
        lines = []
        t1 = typed(b, *TYPING[0]); lines.append(("$ " + t1, cream, b < 3))
        if b >= 3: lines.append(("claude", amber, False))
        if b >= 4: lines.append(("$ " + typed(b, *TYPING[1]), cream, 4 <= b < 8))
        logs = ["[ OK ] 载入 15 种画风", "[ OK ] 合成配乐 · 128 BPM · 纯 NumPy", "[ OK ] 外部素材：0（全部由代码生成）", "[ .. ] 正在渲染：自我介绍.mp4"]
        for k, s in enumerate(logs):
            if b >= 8 + k * .5: lines.append((s, col('#9ED5A0') if 'OK' in s else amber, False))
        for k, (s, colr, cur) in enumerate(lines):
            y = ly + k * lh
            if colr == amber: text(c, s, lx, y, fs, None, 'mono', 700, 'l', paint=glow)
            wdt = text(c, s, lx, y, fs, colr, 'mono', 500, 'l')
            if cur and cursor_on: c.drawRect(skia.Rect.MakeXYWH(lx + wdt + 6, y - fs * .5, fs * .55, fs), P(amber))
        if b >= 10:
            p = e_io3(seg(b, 10, 11.75)); y = ly + len(lines) * lh + 20
            bw = 900; rrect(c, lx, y - 14, bw, 28, 6, P(col('#2A2622')))
            rrect(c, lx, y - 14, bw * p, 28, 6, P(amber))
            text(c, f"{int(p * 100):3d}%", lx + bw + 30, y, fs, cream, 'mono', 700, 'l')
    else:
        # giant block letters built column by column
        word = "CLAUDE"; cell = 28; gap = 4; colsn = len(word) * 6 - 1
        totw = colsn * (cell + gap); x0 = W / 2 - totw / 2; y0 = 390
        reveal = seg(b, 12, 13.2) * colsn
        for li, ch in enumerate(word):
            for r, row in enumerate(BIG[ch]):
                for q, v in enumerate(row):
                    if v != '#': continue
                    gc = li * 6 + q
                    if gc > reveal: continue
                    x = x0 + gc * (cell + gap); y = y0 + r * (cell + gap)
                    fl = .75 + .25 * kick(b, 4)
                    c.drawRect(skia.Rect.MakeXYWH(x - 6, y - 6, cell + 12, cell + 12), P(col(CORAL, .35 * fl), blur=10))
                    c.drawRect(skia.Rect.MakeXYWH(x, y, cell, cell), P(col('#F2A17E' if (r + q) % 3 else CORAL)))
        sub = typed(b, 13.3, 14.6, "an AI model made by Anthropic_")
        text(c, sub, W / 2, 700, 40, cream, 'mono', 500)
        if b >= 14.6:
            text(c, "准备好了吗？", W / 2, 790, 46, col(CORAL, seg(b, 14.6, 14.9)), 'sans', 900)
    c.restore()
    # CRT: scanlines, rgb fringe, vignette, flicker
    sl = P(col('#000000', .22))
    for y in range(0, H, 4): c.drawRect(skia.Rect.MakeXYWH(0, y, W, 1.5), sl)
    vignette(c, .75)
    c.drawRect(skia.Rect.MakeWH(W, H), P(col('#FFB38A', .025 + .02 * math.sin(b * 37))))
    if b > 15.5:
        c.drawRect(skia.Rect.MakeWH(W, H), P(col('#000000', seg(b, 15.5, 15.9))))

# ====================================================================== S01 HAND-DRAWN
def hand_arrow(c, x0, y0, x1, y1, seed, t, paint):
    pts = rough_line(x0, y0, x1, y1, seed, 3)
    c.drawPath(partial(smooth_path(pts), e_out3(t)), paint)
    if t > .8:
        a = math.atan2(y1 - y0, x1 - x0)
        for s in (-1, 1):
            aa = a + math.pi + s * .45
            c.drawPath(smooth_path(rough_line(x1, y1, x1 + math.cos(aa) * 30, y1 + math.sin(aa) * 30, seed + s, 1.2)), paint)

def s01(c, b):
    boil = int(step(b * SPB, 8) * 8) % 3
    draw_full(c, tex_paper('#F4EEE1', seed=11))
    # ruled lines
    for y in range(140, H, 64): c.drawLine(0, y, W, y, P(col('#9DB7D5', .25), 2))
    c.drawLine(150, 0, 150, H, P(col('#E58B8B', .35), 2))
    sc = 1 + .012 * kick(b)
    c.save(); c.translate(W / 2, H / 2); c.scale(sc, sc); c.translate(-W / 2, -H / 2)
    pencil = P(col('#2B2724', .85), 3.2)
    marker = P(col(CORAL, .92), 16)
    cx, cy = 560, 470
    # spark doodle: 12 rays drawn one per 1/4 beat
    for i in range(12):
        a = i / 12 * 2 * math.pi + .12
        r = 190 if i % 2 == 0 else 140
        t = seg(b, i * .18, i * .18 + .35)
        if t <= 0: continue
        pts = rough_line(cx + math.cos(a) * 30, cy + math.sin(a) * 30, cx + math.cos(a) * r, cy + math.sin(a) * r, 100 + i * 7 + boil, 4)
        c.drawPath(partial(smooth_path(pts), e_out3(t)), marker)
    # pencil circle around spark
    circ = smooth_path(rough_circle(cx, cy, 250, 20 + boil, 5))
    c.drawPath(partial(circ, e_io3(seg(b, 2, 3))), pencil)
    # hatching shadow
    if b > 2.5:
        hp_ = P(col('#2B2724', .25 * seg(b, 2.5, 3.5)), 2)
        for k in range(14):
            x = cx - 140 + k * 22
            c.drawLine(x, cy + 280, x + 40, cy + 250, hp_)
    # title written with clip reveal
    def write(s, x, y, size, b0, b1, colr, fam='kai'):
        wdt = tw(s, size, fam)
        p = e_io3(seg(b, b0, b1))
        if p <= 0: return wdt
        c.save(); c.clipRect(skia.Rect.MakeXYWH(x - 10, y - size, (wdt + 20) * p, size * 2))
        text(c, s, x, y, size, colr, fam, 700, 'l')
        c.restore(); return wdt
    ink = col('#1E1B18')
    write("你好，", 930, 360, 150, 2, 3, ink)
    wdt = write("我是 Claude", 930, 540, 150, 3, 4.2, ink)
    # scribble underline
    ul = smooth_path(rough_line(930, 640, 930 + wdt, 632, 50 + boil, 5, 12))
    c.drawPath(partial(ul, e_out3(seg(b, 4.2, 5))), P(col(CORAL), 12))
    ul2 = smooth_path(rough_line(960, 662, 930 + wdt - 40, 660, 60 + boil, 4, 10))
    c.drawPath(partial(ul2, e_out3(seg(b, 4.6, 5.3))), P(col(CORAL, .7), 7))
    # annotations around spark (one per beat)
    notes = [("会聊天", 230, 170, cx - 150, cy - 150), ("会写代码", 180, 790, cx - 170, cy + 170),
             ("会深入思考", 700, 150, cx + 90, cy - 190), ("也会犯错", 760, 820, cx + 150, cy + 170)]
    for k, (s, tx, ty, ax, ay) in enumerate(notes):
        t = seg(b, 6 + k, 6.8 + k)
        if t <= 0: continue
        write(s, tx - tw(s, 54, 'kai') / 2, ty, 54, 6 + k, 6.5 + k, col('#2B2724'))
        hand_arrow(c, tx, ty + (40 if ty < cy else -44), ax, ay, 300 + k * 13 + boil, seg(b, 6.3 + k, 6.9 + k), pencil)
    # highlighter + subtitle
    s = "由 Anthropic 打造的 AI 助手"
    sw = tw(s, 64, 'kai')
    hl = e_out3(seg(b, 10.5, 11.4))
    if hl > 0:
        c.drawPath(poly([(930, 770), (930 + (sw + 30) * hl, 762), (930 + (sw + 30) * hl, 838), (930, 842)]), P(col('#FFE066', .7)))
    write(s, 945, 800, 64, 10, 11.2, ink)
    # doodle stars popping on kicks after beat 12
    for k in range(4):
        if b < 12 + k: continue
        sx, sy = [(1580, 250), (1720, 470), (1500, 950), (820, 960)][k]
        r = 26 * e_back(seg(b, 12 + k, 12.4 + k))
        pts = []
        for j in range(11):
            a = j / 10 * 2 * math.pi - math.pi / 2; rr = r if j % 2 == 0 else r * .45
            pts.append((sx + math.cos(a) * rr, sy + math.sin(a) * rr))
        c.drawPath(smooth_path(pts), P(col(CORAL), 5))
    c.restore()
    grain(c, b, .6)

# ====================================================================== S02 FLAT DOODLE / GRAFFITI
def outlined(c, s, x, y, size, fill, fam='sans', w=900, sw=16, sh=12, fn=None, sp=0, shadow_col='#111111'):
    pst = P(col(shadow_col), sw); pst.setStrokeJoin(skia.Paint.kRound_Join)
    chars(c, s, x + sh, y + sh, size, None, fam, w, fn=fn, sp=sp, paint=pst)
    pf = P(col(shadow_col)); chars(c, s, x + sh, y + sh, size, None, fam, w, fn=fn, sp=sp, paint=pf)
    chars(c, s, x, y, size, None, fam, w, fn=fn, sp=sp, paint=pst)
    chars(c, s, x, y, size, fill, fam, w, fn=fn, sp=sp)

def sticker(c, x, y, w, h, rot, fill, s, size, t, fam='sans'):
    if t <= 0: return
    sc = e_back(t, 2.6)
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc)
    rrect(c, -w / 2 + 10, -h / 2 + 12, w, h, 26, P(col('#111111')))
    rrect(c, -w / 2, -h / 2, w, h, 26, P(col(fill)))
    rrect(c, -w / 2, -h / 2, w, h, 26, P(col('#111111'), 7))
    text(c, s, 0, 0, size, col('#111111'), fam, 900)
    c.restore()

def s02(c, b):
    boil = int(step(b * SPB, 8) * 8) % 3
    bg(c, '#FFD23F')
    # doodle wallpaper
    rs = random.Random(5)
    ink = P(col('#111111', .9), 6)
    for k in range(34):
        x, y = rs.uniform(0, W), rs.uniform(0, H); kind = rs.randint(0, 3); s = rs.uniform(18, 38)
        wob = random.Random(k * 3 + boil)
        x += wob.uniform(-2, 2); y += wob.uniform(-2, 2)
        if kind == 0: c.drawCircle(x, y, s * .6, ink)
        elif kind == 1:
            c.drawLine(x - s / 2, y - s / 2, x + s / 2, y + s / 2, ink); c.drawLine(x - s / 2, y + s / 2, x + s / 2, y - s / 2, ink)
        elif kind == 2:
            c.drawPath(smooth_path([(x - s, y), (x - s / 2, y - s / 2), (x, y), (x + s / 2, y + s / 2), (x + s, y)]), ink)
        else:
            c.drawPath(poly([(x, y - s * .6), (x + s * .5, y + s * .4), (x - s * .5, y + s * .4)]), ink)
    # big flat blobs behind text
    c.drawCircle(1540, 300, 230 * e_back(seg(b, 0, .6)), P(col('#FF6FB5')))
    c.drawCircle(1540, 300, 230 * e_back(seg(b, 0, .6)), P(col('#111111'), 8))
    c.drawCircle(330, 830, 190 * e_back(seg(b, .5, 1.1)), P(col('#3DDC97')))
    c.drawCircle(330, 830, 190 * e_back(seg(b, .5, 1.1)), P(col('#111111'), 8))
    pulse = 1 + .04 * kick(b)
    # headline
    def fn_head(i, n):
        t = seg(b, i * .12, i * .12 + .5)
        return (0, -200 * (1 - e_back(t)), pulse, 1 if t > 0 else 0, (random.Random(i + boil).uniform(-3, 3)))
    outlined(c, "我的出身", 420, 210, 120, col(CORAL), fn=fn_head)
    def fn_big(i, n):
        t = seg(b, 1.8 + i * .14, 2.3 + i * .14)
        return (0, -420 * (1 - e_back(t, 2.2)), pulse, 1 if t > 0 else 0, random.Random(i * 7 + boil).uniform(-4, 4))
    outlined(c, "ANTHROPIC", W / 2, 470, 230, col('#FFFFFF'), fam='latin', w=900, sw=18, sh=16, fn=fn_big, sp=6)
    sticker(c, 430, 740, 470, 130, -6, '#7FD6FF', "2021 年创立", 60, seg(b, 5, 5.5))
    sticker(c, 960, 800, 470, 130, 4, '#FF9EC7', "总部在旧金山", 60, seg(b, 6, 6.5))
    sticker(c, 1490, 740, 520, 130, -3, '#B8F28C', "AI 安全研究公司", 60, seg(b, 7, 7.5))
    # speech bubble
    t = seg(b, 9, 9.6)
    if t > 0:
        sc = e_back(t, 2.4)
        c.save(); c.translate(W / 2, 930); c.scale(sc, sc)
        bub = skia.Path(); bub.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-560, -70, 1120, 120), 60, 60))
        bub.addPoly([skia.Point(-40, 48), skia.Point(10, 48), skia.Point(-70, 95)], True)
        c.save(); c.translate(10, 10); c.drawPath(bub, P(col('#111111'))); c.restore()
        c.drawPath(bub, P(col('#FFFFFF'))); c.drawPath(bub, P(col('#111111'), 8))
        text(c, "它的目标：让 AI 真正对人有益", 0, -10, 58, col('#111111'), 'sans', 900)
        c.restore()
    # spray splats on each beat after 12
    for k in range(int(clamp(b - 11, 0, 5))):
        rs2 = random.Random(900 + k)
        sx, sy = [(1790, 190), (130, 560), (1800, 880), (150, 980), (1250, 110)][k]
        cc = ['#FF4D6D', CORAL, '#6C5CE7', '#00B894', '#111111'][k]
        grow = e_outexp(seg(b, 11 + k, 11.3 + k))
        for j in range(26):
            a = rs2.uniform(0, 6.28); d = rs2.uniform(0, 120) * grow; r = rs2.uniform(4, 24) * (1 - d / 160)
            c.drawCircle(sx + math.cos(a) * d, sy + math.sin(a) * d, max(r, 2), P(col(cc, .9)))
        c.drawCircle(sx, sy, 50 * grow, P(col(cc, .9)))
        for j in range(3):  # drips
            dx = rs2.uniform(-40, 40); L_ = rs2.uniform(60, 180) * e_out3(seg(b, 11.2 + k, 12.5 + k))
            c.drawLine(sx + dx, sy, sx + dx, sy + L_, P(col(cc, .9), rs2.uniform(8, 14)))
    # lightning bolts
    for k, (x, y, rot) in enumerate([(1760, 640, 12), (160, 380, -14)]):
        t = seg(b, 8 + k * .5, 8.4 + k * .5)
        if t <= 0: continue
        c.save(); c.translate(x, y); c.rotate(rot + 6 * math.sin(b * math.pi)); c.scale(e_back(t), e_back(t))
        bolt = poly([(-20, -90), (40, -90), (10, -15), (45, -15), (-30, 95), (-5, 10), (-40, 10)])
        c.drawPath(bolt, P(col('#FFF45C'))); c.drawPath(bolt, P(col('#111111'), 7))
        c.restore()
    grain(c, b, .5)

# ====================================================================== S03 PAPER CUT
def paper_shape(c, path, colr, depth=8, seed=0):
    c.save(); c.translate(0, depth * .6)
    c.drawPath(path, P(col('#3A1E0E', .35), blur=depth)); c.restore()
    c.drawPath(path, P(col(colr)))
    # paper fibre overlay
    c.save(); c.clipPath(path, doAntiAlias=True); c.drawImage(paper_speck(21 + seed % 3), 0, 0); c.restore()
def torn(x0, y0, x1, y1, seed, amp=6):
    return rough_line(x0, y0, x1, y1, seed, amp, n=int(math.hypot(x1 - x0, y1 - y0) / 14))
def mountains(yb, peaks, seed):
    pts = [(-50, H + 50), (-50, yb)]
    rs = random.Random(seed)
    for (px, py) in peaks: pts.append((px + rs.uniform(-8, 8), py))
    pts += [(W + 50, yb), (W + 50, H + 50)]
    out = []
    for i in range(len(pts) - 1): out += torn(*pts[i], *pts[i + 1], seed + i, 4)[:-1]
    out.append(pts[-1]); return poly(out)

def s03(c, b):
    bq = step(b * SPB, 12) / SPB    # 12 fps stop-motion time
    draw_full(c, tex_paper('#F7E6CC', seed=31))
    # sun
    sy = 330 - 60 * e_out3(seg(bq, 0, 2))
    sun = skia.Path(); sun.addCircle(1500, sy, 150)
    paper_shape(c, sun, '#F4A259', 10, 1)
    # clouds drifting
    for k, (x, y, s) in enumerate([(300, 220, 1), (1100, 160, .8), (1750, 420, .7)]):
        xx = x + 60 * bq / 16 * (1 if k % 2 else -1)
        cl = skia.Path()
        for (dx, dy, r) in [(-60, 10, 50), (0, -15, 70), (70, 8, 52), (10, 25, 55)]: cl.addCircle(xx + dx * s, y + dy * s, r * s)
        cl.setFillType(skia.PathFillType.kWinding)
        paper_shape(c, cl, '#FFFBF3', 6, 2 + k)
    # mountain layers slide up on beats 0,1,2
    layers = [(560, [(200, 440), (520, 610), (820, 420), (1180, 600), (1500, 470), (1780, 590)], '#E9B384', 0),
              (700, [(80, 640), (420, 520), (760, 690), (1100, 540), (1450, 700), (1800, 560)], '#D98556', 1),
              (840, [(0, 820), (350, 700), (700, 830), (1000, 720), (1350, 850), (1700, 740), (1950, 800)], '#A8552F', 2)]
    for yb, peaks, colr, k in layers:
        off = 500 * (1 - e_back(seg(bq, k * .5, k * .5 + .8), 1.4))
        c.save(); c.translate(0, off + 6 * math.sin(bq * .8 + k))
        paper_shape(c, mountains(yb, peaks, 40 + k * 10), colr, 14, 5 + k)
        c.restore()
    # banner
    t = seg(bq, 2.5, 3.2)
    if t > 0:
        c.save(); c.translate(W / 2, 110); c.rotate(-1.5); c.scale(e_back(t), 1)
        ban = poly([(-330, -48), (330, -48), (300, 0), (330, 48), (-330, 48), (-300, 0)])
        paper_shape(c, ban, '#C44536', 8, 9)
        text(c, "成长史 · 第一章", 0, 0, 52, col('#FFF3E0'), 'serif', 900)
        c.restore()
    # 2023 flip-cards
    for i, d in enumerate("2023"):
        t = seg(bq, 3.5 + i * .25, 4.1 + i * .25)
        if t <= 0: continue
        x = W / 2 - 240 + i * 160; y = 300
        c.save(); c.translate(x, y); c.rotate([-4, 3, -2, 4][i]); c.scale(1, e_back(t, 2.2))
        card = skia.Path(); card.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-70, -95, 140, 190), 10, 10))
        paper_shape(c, card, ['#264653', '#2A9D8F', '#E76F51', '#264653'][i], 10, 10 + i)
        text(c, d, 0, 0, 150, col('#FFF3E0'), 'serif', 900)
        c.restore()
    # story cards
    def story(x, y, rot, b0, month, title, sub, colr, seed):
        t = seg(bq, b0, b0 + .8)
        if t <= 0: return
        c.save(); c.translate(x, y + 600 * (1 - e_back(t, 1.3))); c.rotate(rot)
        card = skia.Path(); card.addRect(skia.Rect.MakeXYWH(-340, -150, 680, 300))
        edge = torn(-340, 150, 340, 150, seed, 5)
        pp = [(-340, -150), (340, -150)] + [(340, 150)] + edge[::-1][1:]
        paper_shape(c, poly(pp), '#FFF8EC', 16, seed)
        c.drawRect(skia.Rect.MakeXYWH(-340, -150, 22, 300), P(col(colr)))
        text(c, month, -290, -85, 44, col(colr), 'serif', 900, 'l')
        text(c, title, -290, -10, 72, col('#2B1B12'), 'serif', 900, 'l')
        text(c, sub, -290, 80, 42, col('#6B4F3F'), 'serif', 700, 'l')
        # tape
        c.save(); c.translate(0, -155); c.rotate(-3)
        c.drawRect(skia.Rect.MakeXYWH(-80, -22, 160, 44), P(col('#F6E3A1', .75)))
        c.restore()
        c.restore()
    story(520, 700, -2.5, 6, "2023 · 03", "Claude 诞生", "第一次和世界对话", '#E76F51', 71)
    story(1400, 720, 2, 10, "2023 · 07", "Claude 2", "一口气读完一整本书", '#2A9D8F', 72)
    grain(c, b, .7)

# ====================================================================== S04 ISOMETRIC 2.5D
def box_faces(x, y, z, sx, sy, sz):
    out = []
    for n, cs in DIRS:
        out.append((np.array([(x + a * sx, y + bb * sy, z + cc * sz) for a, bb, cc in cs], float), np.array(n, float)))
    return out

def draw_box(c, R, scale, cx, cy, x, y, z, sx, sy, sz, top, left, right, windows=None, lit=0, alpha=1.0):
    faces = box_faces(x, y, z, sx, sy, sz)
    vis = []
    for cs, n in faces:
        vn = R @ n
        if vn[2] <= 1e-6: continue
        p2, d = project(cs, R, scale, cx, cy); vis.append((d.mean(), p2, n))
    vis.sort(key=lambda v: v[0])
    for d, p2, n in vis:
        path = poly(p2)
        if n[1] > 0: shader = lin_grad(*p2[0], *p2[2], [col(top[0], alpha), col(top[1], alpha)])
        elif abs(n[0]) > 0: shader = lin_grad(*p2[1], *p2[0], [col(left[0], alpha), col(left[1], alpha)])
        else: shader = lin_grad(*p2[1], *p2[0], [col(right[0], alpha), col(right[1], alpha)])
        c.drawPath(path, P(shader=shader))
        c.drawPath(path, P(col('#FFFFFF', .25 * alpha), 1.5))
        if windows and n[1] == 0:
            rows, colsn = windows
            p0, p1, p3 = p2[0], p2[1], p2[3]
            k = 0
            for r in range(rows):
                for q in range(colsn):
                    u0, u1 = (r + .25) / rows, (r + .75) / rows
                    v0, v1 = (q + .25) / colsn, (q + .75) / colsn
                    pts = [p0 + (p1 - p0) * u + (p3 - p0) * v for u, v in [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]]
                    on = k < lit
                    c.drawPath(poly(pts), P(col('#FFF4C2' if on else '#000000', .9 if on else .18 * alpha)))
                    k += 1

def s04(c, b):
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin_grad(0, 0, 0, H, [col('#EEE9FF'), col('#D6E2FF')])))
    yaw = math.radians(45 + 10 * math.sin(b / 16 * math.pi)); pitch = math.radians(33)
    R = rot_mat(yaw, pitch); scale = 66; cx, cy = W / 2 + 230, 800
    # floor grid
    gp = P(col('#6C63FF', .18), 1.5)
    for i in range(-7, 8):
        a, _ = project(np.array([[i, 0, -7], [i, 0, 7]], float), R, scale, cx, cy)
        c.drawLine(*a[0], *a[1], gp)
        a, _ = project(np.array([[-7, 0, i], [7, 0, i]], float), R, scale, cx, cy)
        c.drawLine(*a[0], *a[1], gp)
    fams = [("Haiku", "俳句", "最快", 2.0, -4.2, ('#A7F3E4', '#5FD3C0'), ('#3BB3A0', '#2A8C7D'), ('#4FC8B4', '#36A08F'), 2),
            ("Sonnet", "十四行诗", "均衡", 3.6, -.9, ('#FFD0BD', '#F59C7A'), ('#D96F4B', '#B5553A'), ('#EC8A64', '#CC6A4A'), 3),
            ("Opus", "巨著", "最强", 5.4, 2.4, ('#D9CCFF', '#A994FF'), ('#6F55E0', '#5540B8'), ('#8A73F0', '#6D57D0'), 4)]
    # shadows first
    for k, (_, _, _, h, x, *_rest) in enumerate(fams):
        g = e_back(seg(b, 2 + k, 2.9 + k), 1.6)
        if g <= 0: continue
        pts = np.array([[x, 0, -1], [x + 2, 0, -1], [x + 2 + h * g * .9, 0, 1 + h * g * .4], [x + h * g * .9, 0, 1 + h * g * .4]])
        p2, _ = project(pts, R, scale, cx, cy)
        c.drawPath(poly(p2), P(col('#3A2E8C', .18), blur=14))
    order = sorted(range(3), key=lambda k: (R @ np.array([fams[k][4] + 1, 0, 0]))[2])
    for k in order:
        name, cn, tag, h, x, top, left, right, winr = fams[k]
        g = e_back(seg(b, 2 + k, 2.9 + k), 1.6)
        if g <= 0: continue
        hh = h * g
        bob = .08 * math.sin(b * math.pi / 2 + k)
        lit = int(clamp((b - 5) * 3, 0, 99))
        draw_box(c, R, scale, cx, cy, x, bob, -1, 2, hh, 2, top, left, right, windows=(int(winr * 1.6), 2), lit=lit)
        # label
        lt = seg(b, 5 + k * .5, 5.6 + k * .5)
        if lt > 0:
            tip, _ = project(np.array([[x + 1, hh + bob, 0]]), R, scale, cx, cy)
            tx, ty = tip[0]; ly = ty - 70 - 40 * (1 - e_out3(lt)) - (0, 60, 0)[k]; tx0 = tx; tx = tx + (-150, -150, 60)[k]
            c.drawLine(tx0, ty - 8, tx, ly + 34, P(col('#2D2560', .6 * lt), 2))
            bw = 250
            shadow_rrect(c, tx - bw / 2, ly - 44, bw, 88, 18, 8, 14, .18 * lt)
            rrect(c, tx - bw / 2, ly - 44, bw, 88, 18, P(col('#FFFFFF', lt)))
            text(c, name, tx, ly - 12, 34, col('#2D2560', lt), 'latin', 900)
            text(c, f"{cn} · {tag}", tx, ly + 22, 24, col('#6C63FF', lt), 'sans', 700)
    # headline
    t = e_outexp(seg(b, 0, .8))
    text(c, "2024 · 03", 150, 190 - 30 * (1 - t), 40, col('#6C63FF', t), 'latin', 900, 'l')
    text(c, "Claude 3 家族", 150, 265 - 30 * (1 - t), 88, col('#1E1846', t), 'sans', 900, 'l')
    t2 = seg(b, 8, 8.8)
    if t2 > 0:
        text(c, "用诗歌体裁命名：", 150, 360, 40, col('#4A4380', t2), 'sans', 700, 'l')
        text(c, "诗越长，模型越强", 150, 420, 40, col('#4A4380', t2), 'sans', 700, 'l')
    # floating mini cubes
    for k in range(7):
        rs = random.Random(k)
        x, z = rs.uniform(-6, 6), rs.uniform(-6, 6); y = 3 + rs.uniform(0, 3) + .3 * math.sin(b * .8 + k)
        a = seg(b, 10 + k * .3, 10.5 + k * .3)
        if a > 0:
            s_ = .35 * e_back(a)
            draw_box(c, R, scale, cx, cy, x, y, z, s_, s_, s_, ('#FFFFFF', '#E8E4FF'), ('#A99CFF', '#8C7CF5'), ('#C9C0FF', '#B0A4FF'))
    grain(c, b, .35)

# ====================================================================== S05 LAYERED DEPTH
LAYERS = [("2024 · 06", "Claude 3.5 Sonnet", "更聪明，也更快", 'spark'),
          ("2024 · 06", "Artifacts", "边聊天，边把东西做出来", 'window'),
          ("2024 · 10", "Computer Use", "学会看屏幕、动鼠标", 'cursor'),
          ("2024 · 11", "MCP 协议", "一个接口，连上所有工具", 'plug')]
def icon(c, kind, x, y, s, colr):
    p = P(col(colr), s * .09)
    if kind == 'spark':
        for i in range(8):
            a = i / 8 * 2 * math.pi; r = s * (.5 if i % 2 == 0 else .32)
            c.drawLine(x + math.cos(a) * s * .1, y + math.sin(a) * s * .1, x + math.cos(a) * r, y + math.sin(a) * r, p)
    elif kind == 'window':
        rrect(c, x - s * .45, y - s * .35, s * .9, s * .7, s * .08, p)
        c.drawLine(x - s * .45, y - s * .15, x + s * .45, y - s * .15, p)
        c.drawLine(x - s * .1, y + .02 * s, x + s * .25, y + .02 * s, p); c.drawLine(x - s * .1, y + .18 * s, x + s * .15, y + .18 * s, p)
    elif kind == 'cursor':
        c.drawPath(poly([(x - s * .25, y - s * .4), (x + s * .3, y + s * .1), (x + s * .02, y + s * .12), (x - s * .12, y + s * .42)]), p)
    else:
        rrect(c, x - s * .25, y - s * .1, s * .5, s * .35, s * .08, p)
        c.drawLine(x - s * .12, y - s * .1, x - s * .12, y - s * .35, p); c.drawLine(x + s * .12, y - s * .1, x + s * .12, y - s * .35, p)
        c.drawLine(x, y + s * .25, x, y + s * .45, p)

def s05(c, b):
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin_grad(0, 0, W, H, [col('#07091F'), col('#1B1146'), col('#2A0E3A')])))
    # camera z: dolly one layer every 4 beats (move during last .9 beat of each block)
    camz = 0.0
    for k in range(1, 5):
        camz += 4 * e_io3(seg(b, 4 * k - .9, 4 * k - .05))
    camz += .25 * (b % 4) / 4
    OX = [0, 700, -650, 600]; OY = [0, -260, 220, 240]
    camx, camy = OX[0], OY[0]
    for k in range(1, 4):
        e = e_io3(seg(b, 4 * k - .9, 4 * k - .05)); camx += (OX[k] - OX[k - 1]) * e; camy += (OY[k] - OY[k - 1]) * e
    # portal frames flying past
    for k in range(5):
        z = 2 + 4 * k; d = z - camz
        if d < .35: continue
        s = 4 / d; fa = clamp((d - .35) / 1.2) * clamp(1.2 - d / 16)
        fw, fh = 1500 * s, 860 * s; fx = W / 2 + (OX[min(k, 3)] * .5 - camx) * s; fy = H / 2 + (OY[min(k, 3)] * .5 - camy) * s
        rrect(c, fx - fw / 2, fy - fh / 2, fw, fh, 30 * s, P(col('#8C7CFF', .35 * fa), 3 * s + 1))
        for q in range(4):
            cxq = fx + (fw / 2 - 20 * s) * (1 if q % 2 else -1); cyq = fy + (fh / 2 - 20 * s) * (1 if q > 1 else -1)
            c.drawCircle(cxq, cyq, 5 * s + 1, P(col('#FFFFFF', .6 * fa)))
    # bokeh particles in depth
    rs = random.Random(3)
    for k in range(70):
        x, y, z = rs.uniform(-1.6, 1.6), rs.uniform(-1, 1), rs.uniform(0, 26)
        d = z - camz
        if d < .3: continue
        s = 4 / d
        px, py = W / 2 + x * W / 2 * s, H / 2 + y * H / 2 * s
        blur = min(abs(d - 4) * 2.2, 14)
        r = (4 + 5 * rs.random()) * s
        c.drawCircle(px, py, r, P(col(rs.choice(['#7B6CFF', '#FF7AB6', '#58C4FF', CORAL]), clamp(.55 * s)), blur=blur + .5))
    # layers far to near
    for k in reversed(range(4)):
        z = 4 + 4 * k; d = z - camz
        if d < .25: continue
        s = 4 / d
        alpha = clamp((d - .25) / 1.5) * clamp(1.4 - (d - 4) / 12)
        blur = min(abs(d - 4) * 3.2, 22)
        ox = (OX[k] - camx) * s; oy = (OY[k] - camy) * s
        cw, ch = 1100, 460
        c.save(); c.translate(W / 2 + ox, H / 2 + oy - 20); c.scale(s, s)
        lp_ = skia.Paint(); lp_.setAlphaf(clamp(alpha))
        if blur > .6: lp_.setImageFilter(skia.ImageFilters.Blur(blur / s, blur / s))
        c.saveLayer(skia.Rect.MakeXYWH(-cw / 2 - 120, -ch / 2 - 120, cw + 240, ch + 240), lp_)
        rrect(c, -cw / 2, -ch / 2 + 30, cw, ch, 40, P(col('#000000', .5), blur=40))
        rrect(c, -cw / 2, -ch / 2, cw, ch, 40, P(shader=lin_grad(-cw / 2, -ch / 2, cw / 2, ch / 2, [col('#FFFFFF', .16), col('#FFFFFF', .05)])))
        rrect(c, -cw / 2, -ch / 2, cw, ch, 40, P(col('#FFFFFF', .35), 2))
        accent = ['#FF9D7A', '#7FD1FF', '#B69CFF', '#7CF0B4'][k]
        rrect(c, -cw / 2 + 60, -ch / 2 + 70, 150, 150, 36, P(col(accent, .18)))
        icon(c, LAYERS[k][3], -cw / 2 + 135, -ch / 2 + 145, 110, accent)
        date, title, sub, _ = LAYERS[k]
        text(c, date, -cw / 2 + 250, -ch / 2 + 100, 34, col(accent), 'latin', 700, 'l')
        text(c, title, -cw / 2 + 250, -ch / 2 + 172, 68, col('#FFFFFF'), 'sans', 900, 'l')
        text(c, sub, -cw / 2 + 60, ch / 2 - 120, 52, col('#E8E4FF'), 'sans', 700, 'l')
        text(c, f"LAYER 0{k + 1}  ·  z = {z:.0f}", cw / 2 - 50, ch / 2 - 50, 22, col('#FFFFFF', .45), 'dejamono', 400, 'r')
        c.restore(); c.restore()
    t = seg(b, .2, 1)
    text(c, "从「会说」到「会做」", W / 2, 985, 46, col('#FFFFFF', .9 * t), 'sans', 900)
    grain(c, b, .5)

# ====================================================================== S06 VOXEL
GLYPH = {'<': ["...#", "..#.", ".#..", "#...", ".#..", "..#.", "...#"],
         '/': ["...#", "...#", "..#.", ".#..", ".#..", "#...", "#..."],
         '>': ["#...", ".#..", "..#.", "...#", "..#.", ".#..", "#..."]}
def island_vox():
    vox = {}
    rs = random.Random(4)
    for x in range(-5, 6):
        for z in range(-4, 5):
            if abs(x) + abs(z) > 8: continue
            h = 1 + (1 if rs.random() < .25 else 0)
            for y in range(-2, h):
                vox[(x, y, z)] = 'grass' if y == h - 1 else 'dirt'
    for y in range(2, 4): vox[(-3, y, -2)] = 'trunk'
    for dx in (-1, 0, 1):
        for dz in (-1, 0, 1):
            for y in (4, 5):
                if y == 5 and (dx or dz): continue
                vox[(-3 + dx, y, -2 + dz)] = 'leaf'
    # desk + monitor
    for x in (1, 2, 3):
        vox[(x, 2, 1)] = 'desk'
    for x in (1, 2, 3):
        for y in (3, 4, 5): vox[(x, y, 0)] = 'screen' if y in (4, 5) and x == 2 else 'mon'
    return vox
ISLAND = island_vox()
VCOL = {'grass': '#8FD694', 'dirt': '#C9A27E', 'trunk': '#9C6B4E', 'leaf': '#5DBB7A', 'desk': '#E8C99B',
        'mon': '#3B3F58', 'screen': '#1E2033', 'glyph': CORAL}
def draw_voxels(c, items, R, scale, cx, cy, light=np.array([.45, .8, .35]), edge=.18):
    """items: list of (corners(4,3), normal, hexcolor, alpha)"""
    L_ = light / np.linalg.norm(light)
    vis = []
    for cs, n, h, al in items:
        vn = R @ n
        if vn[2] <= 1e-6: continue
        p2, d = project(cs, R, scale, cx, cy)
        shade = .62 + .45 * max(0, float(n @ L_))
        vis.append((d.mean(), p2, h, shade, al))
    vis.sort(key=lambda v: v[0])
    for d, p2, h, sh, al in vis:
        path = poly(p2)
        c.drawPath(path, P(c3(rgb(h) * sh, al)))
        c.drawPath(path, P(c3(rgb(h) * sh * .72, al * .8), 1.4))

def s06(c, b):
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin_grad(0, 0, 0, H, [col('#FFE3C8'), col('#FFC2B0'), col('#F3A6B9')])))
    yaw = math.radians(-22 + 24 * b / 16); pitch = math.radians(26)
    R = rot_mat(yaw, pitch); scale = 44; cx, cy = W / 2 + 380, 800
    items = []
    bob = .15 * math.sin(b * math.pi / 4)
    for (cs, n, kind, key, fk) in voxel_faces(ISLAND):
        h = VCOL[kind]
        if kind == 'screen' and fk == 'side' and n[2] > 0:
            h = '#3DFFA2' if (b * 2) % 1 < .6 else '#1E2033'
        items.append((cs + np.array([0, bob, 0]), n, h, 1.0))
    # voxel glyph "</>" assembling above
    gv = {}
    ox = -7
    for gi, ch in enumerate("</>"):
        for r, row in enumerate(GLYPH[ch]):
            for q, v in enumerate(row):
                if v == '#': gv[(ox + gi * 5 + q, 14 - r, 0)] = gi * 7 + q
    keys = sorted(gv.keys(), key=lambda k: (k[0], -k[1]))
    faces = voxel_faces({k: 1 for k in keys})
    order = {k: i for i, k in enumerate(keys)}
    for cs, n, _, key, fk in faces:
        i = order[key]; t0 = .5 + i / len(keys) * 6.5
        t = seg(b, t0, t0 + .6)
        if t <= 0: continue
        drop = (1 - e_back(t, 1.2)) * 8
        spin = .3 * math.sin(b * math.pi / 8)
        items.append((cs + np.array([0, drop + bob * 2, 0]), n, CORAL if (key[0] + key[1]) % 2 else '#F29B77', 1.0))
    draw_voxels(c, items, R, scale, cx, cy)
    # text panels
    def panel(y, b0, tag, title, sub):
        t = e_outexp(seg(b, b0, b0 + .7))
        if t <= 0: return
        x = 120 - 80 * (1 - t)
        rrect(c, x + 10, y + 12, 720, 210, 8, P(col('#7A3C4E', .35 * t)))
        rrect(c, x, y, 720, 210, 8, P(col('#FFF7F0', .95 * t)))
        for k in range(3): c.drawRect(skia.Rect.MakeXYWH(x + 40 + k * 26, y + 34, 18, 18), P(col(CORAL, t)))
        text(c, tag, x + 140, y + 44, 30, col('#B0506A', t), 'latin', 900, 'l')
        text(c, title, x + 40, y + 108, 60, col('#3B1F2B', t), 'sans', 900, 'l')
        text(c, sub, x + 40, y + 170, 38, col('#7A4A5A', t), 'sans', 700, 'l')
    panel(250, 1, "2025 · 02", "Claude 3.7 Sonnet", "学会先想清楚，再回答")
    panel(560, 8, "2025 · 02", "Claude Code", "住进了开发者的终端")
    grain(c, b, .4)

# ====================================================================== S07 BLOCK STOP-MOTION
def make_tex(kind, seed):
    rs = np.random.RandomState(seed)
    n = rs.rand(16, 16)
    if kind == 'grass_top':
        base = np.array([.36, .68, .25]); img = base * (0.8 + .35 * n[..., None])
    elif kind == 'dirt':
        base = np.array([.53, .37, .24]); img = base * (0.75 + .4 * n[..., None])
        img[rs.rand(16, 16) > .9] *= .6
    elif kind == 'grass_side':
        base = np.array([.53, .37, .24]); img = base * (0.75 + .4 * n[..., None])
        edge = 3 + (rs.rand(16) * 3).astype(int)
        for x in range(16): img[:edge[x], x] = np.array([.36, .68, .25]) * (.85 + .3 * rs.rand())
    elif kind == 'plank':
        base = np.array([.72, .56, .34]); img = base * (0.9 + .15 * n[..., None])
        for y in (3, 7, 11, 15): img[y, :] *= .65
        for (y0, x) in [(0, 5), (4, 12), (8, 3), (12, 9)]: img[y0:y0 + 4, x] *= .65
    elif kind == 'stone':
        base = np.array([.55, .55, .56]); img = base * (0.75 + .4 * n[..., None])
    elif kind == 'orange':
        base = rgb(CORAL); img = base * (0.88 + .2 * n[..., None])
    elif kind == 'face':
        base = rgb(CORAL); img = base * (0.9 + .15 * n[..., None])
        img[6:9, 3:6] = .1; img[6:9, 10:13] = .1; img[11:12, 5:11] = .25; img[6, 4] = 1; img[6, 11] = 1
    elif kind == 'body':
        base = np.array([.25, .27, .35]); img = base * (0.85 + .3 * n[..., None]); img[4:8, 6:10] = rgb('#3DFFA2')
    elif kind == 'leg':
        base = np.array([.18, .2, .28]); img = base * (0.85 + .3 * n[..., None])
    return to_img(img)
@functools.lru_cache(None)
def TEX(kind): return make_tex(kind, abs(hash(kind)) % 1000)

FOUR = ["#.#", "#.#", "###", "..#", "..#"]
def s07(c, b):
    bq = step(b * SPB, 8) / SPB  # 8 fps stop-motion
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin_grad(0, 0, 0, H, [col('#6FA8FF'), col('#BFE0FF')])))
    for k in range(5):  # blocky clouds
        x = (k * 430 + bq * 18) % (W + 400) - 200; y = 110 + (k % 3) * 70
        c.drawRect(skia.Rect.MakeXYWH(x, y, 220, 50), P(col('#FFFFFF', .92)))
        c.drawRect(skia.Rect.MakeXYWH(x + 40, y - 30, 120, 30), P(col('#FFFFFF', .92)))
    yaw = math.radians(35); pitch = math.radians(28)
    R = rot_mat(yaw, pitch); scale = 76; cx, cy = W / 2 + 160, 600
    faces = []   # (corners, normal, texkind)
    ground = {}
    for x in range(-5, 6):
        for z in range(-4, 5):
            ground[(x, -1, z)] = 'g'
            ground[(x, -2, z)] = 's' if (x + z) % 5 == 0 else 'd'
    for cs, n, pay, key, fk in voxel_faces(ground):
        if pay == 'g': kind = 'grass_top' if fk == 'top' else 'grass_side'
        else: kind = 'stone' if pay == 's' else 'dirt'
        faces.append((cs, n, kind))
    # the "4" being built, one block per beat from beat 1.5
    blocks = []
    for r, row in enumerate(FOUR):
        for q, v in enumerate(row):
            if v == '#': blocks.append((q - 1, 4 - r, 0))
    blocks.sort(key=lambda k: (k[1], k[0]))
    placed = []
    for i, k in enumerate(blocks):
        tb = 1.5 + i
        if bq >= tb: placed.append((k, bq - tb))
    for (k, age) in placed:
        pop = 1.0 if age > .25 else .6 + .4 * age / .25
        cs0 = voxel_faces({(0, 0, 0): 1})
        for cs, n, _, _, _ in cs0:
            cc = (cs - .5) * pop + .5 + np.array(k, float) + np.array([0, 0, -2])
            faces.append((cc, n, 'plank'))
    # robot builder (cuboids) — arm swings on each placement
    rx, rz = 2.6, -.2
    swing = math.sin(min((bq % 1) * 6, math.pi)) * .5 if 1.5 <= bq < 11 else 0
    hop = .15 if (bq % 1) < .25 and bq > 1 else 0
    def cuboid(x, y, z, sx, sy, sz, kind, front=None):
        for cs, n in box_faces(x, y, z, sx, sy, sz):
            kk = front if (front and n[0] < 0) else kind
            faces.append((cs, n, kk))
    cuboid(rx, hop, rz, .7, .8, .45, 'leg')
    cuboid(rx - .05, .8 + hop, rz - .05, .8, .9, .55, 'body', front='body')
    cuboid(rx - .1, 1.7 + hop, rz - .1, .9, .9, .75, 'orange', front='face')
    cuboid(rx - .35 + swing * .3, 1.0 + hop + swing * .5, rz + .1, .3, .75, .3, 'orange')
    # draw sorted with textures
    vis = []
    for cs, n, kind in faces:
        vn = R @ n
        if vn[2] <= 1e-6: continue
        p2, d = project(cs, R, scale, cx, cy); vis.append((d.mean(), p2, n, kind))
    vis.sort(key=lambda v: v[0])
    samp = skia.SamplingOptions(skia.FilterMode.kNearest)
    for d, p2, n, kind in vis:
        p0, p1, p3 = p2[0], p2[1], p2[3]
        # texture u along p0->p3, v along p0->p1 (flip v so textures are upright on sides)
        if n[1] == 0:
            a, bb_, org = (p3 - p0) / 16, (p0 - p1) / 16, p1
        else:
            a, bb_, org = (p3 - p0) / 16, (p1 - p0) / 16, p0
        m = skia.Matrix(); m.setAffine([a[0], a[1], bb_[0], bb_[1], org[0], org[1]])
        path = poly(p2)
        c.drawPath(path, P(shader=TEX(kind).makeShader(skia.TileMode.kRepeat, skia.TileMode.kRepeat, samp, m), aa=False))
        shade = 0 if n[1] > 0 else (.22 if abs(n[0]) > 0 else .38)
        if shade: c.drawPath(path, P(col('#000000', shade), aa=False))
    # pixel UI (unifont, crisp)
    def pix_text(s, x, y, size, colr, align='l', shadow=True):
        if shadow: text(c, s, x + size / 8, y + size / 8, size, col('#3F3F3F'), 'pixel', 400, align, alias=True)
        return text(c, s, x, y, size, colr, 'pixel', 400, align, alias=True)
    t = seg(bq, 0, .5)
    if t > 0:
        c.drawRect(skia.Rect.MakeXYWH(90, 150, 640, 230), P(col('#1A1A2E')))
        pix_text("2025 · 05", 120, 205, 48, col('#FFFF55'))
        pix_text("Claude 4", 120, 275, 96, col('#FFFFFF'))
        pix_text("能连续自主工作好几个小时", 120, 345, 32, col('#AAAAAA'))
    ts = seg(bq, 9, 9.5)
    if ts > 0:
        x = W - 620 * e_out3(ts) - 40 + 620 * seg(bq, 15, 15.6)
        c.drawRect(skia.Rect.MakeXYWH(x, 140, 600, 130), P(col('#212121')))
        c.drawRect(skia.Rect.MakeXYWH(x, 140, 600, 130), P(col('#5A5A5A'), 6, aa=False))
        c.drawRect(skia.Rect.MakeXYWH(x + 30, 170, 70, 70), P(col(CORAL)))
        pix_text("新进度达成！", x + 130, 180, 32, col('#FFFF55'), shadow=False)
        pix_text("盖好了一个「4」", x + 130, 230, 32, col('#FFFFFF'), shadow=False)
    # chat line + hotbar
    msgs = [(3, "<Claude> 收到，先打地基。"), (6, "<Claude> 边做边检查，出错就修。"), (12, "<Claude> 完成。下一个任务？")]
    y = 870
    for tb, m in msgs:
        if bq >= tb:
            wdt = tw(m, 32, 'pixel', 400)
            c.drawRect(skia.Rect.MakeXYWH(70, y - 24, wdt + 30, 46), P(col('#000000', .45)))
            pix_text(m, 85, y, 32, col('#FFFFFF')); y -= 52
    sel = int(bq) % 9
    hx = W / 2 - 9 * 80 / 2
    for i in range(9):
        c.drawRect(skia.Rect.MakeXYWH(hx + i * 80, 940, 80, 80), P(col('#8B8B8B', .7)))
        c.drawRect(skia.Rect.MakeXYWH(hx + i * 80 + 4, 944, 72, 72), P(col('#373737', .6)))
        if i in (0, 1, 2):
            k = ['plank', 'grass_side', 'stone'][i]
            m = skia.Matrix(); m.setAffine([2.5, 0, 0, 2.5, hx + i * 80 + 20, 960])
            c.drawRect(skia.Rect.MakeXYWH(hx + i * 80 + 20, 960, 40, 40), P(shader=TEX(k).makeShader(skia.TileMode.kClamp, skia.TileMode.kClamp, samp, m), aa=False))
    c.drawRect(skia.Rect.MakeXYWH(hx + sel * 80 - 4, 936, 88, 88), P(col('#FFFFFF'), 6, aa=False))
```

### 7/7 · `claude_intro/scenes_b.py`
<!-- casebook-file {"path": "claude_intro/scenes_b.py", "lines": 421, "final_newline": true, "sha256": "ef9beb46b4a549f440df51aacd578141f88f2901a85fb218e2cdfdb64b1db1dc", "original_sha256": "ef9beb46b4a549f440df51aacd578141f88f2901a85fb218e2cdfdb64b1db1dc"} -->
```python
from core import *

# ====================================================================== S08 CLAY STOP-MOTION
@functools.lru_cache(None)
def clay_tex():
    n = value_noise(H, W, 30, 9, 3)
    ring = np.sin((n * 60)) * .5 + .5          # fingerprint-ish swirls
    fine = ndimage.gaussian_filter(np.random.RandomState(2).rand(H, W) - .5, 1.0)
    return speck_img((ring - .5) * .5 + fine * 2.2, .5)
def clay_fill(c, path, base, lx, ly, r, seed=0):
    c.drawPath(path, P(shader=rad_grad(lx, ly, r, [mix(base, '#FFFFFF', .35), col(base), mix(base, '#000000', .38)], [0, .45, 1])))
    c.save(); c.clipPath(path, doAntiAlias=True); c.drawImage(clay_tex(), 0, 0); c.restore()
def clay_figure(c, x, y, w, h, base, sq, seed, jit):
    rs = random.Random(seed * 31 + jit)
    x += rs.uniform(-2, 2); y += rs.uniform(-1.5, 1.5)
    sx, sy = 1 + sq * .12, 1 - sq * .12
    c.save(); c.translate(x, y); c.scale(sx, sy)
    c.drawOval(skia.Rect.MakeXYWH(-w * .75, -18, w * 1.5, 40), P(col('#3B2A1F', .35), blur=12))
    body = skia.Path(); body.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-w / 2, -h, w, h), w / 2, w / 2))
    clay_fill(c, body, base, -w * .2, -h * .8, h * 1.1, seed)
    hr = w * .62
    head = skia.Path(); head.addCircle(0, -h - hr * .55, hr)
    clay_fill(c, head, base, -hr * .35, -h - hr * .95, hr * 1.5, seed + 5)
    # eyes + smile
    ey = -h - hr * .6
    for s in (-1, 1):
        c.drawOval(skia.Rect.MakeXYWH(s * hr * .32 - 11, ey - 16, 22, 30), P(col('#1B1411')))
        c.drawCircle(s * hr * .32 - 3, ey - 7, 5, P(col('#FFFFFF', .9)))
    sm = skia.Path(); sm.moveTo(-hr * .22, ey + 30); sm.quadTo(0, ey + 48, hr * .22, ey + 30)
    c.drawPath(sm, P(col('#1B1411'), 6))
    c.drawCircle(-hr * .55, ey + 22, 12, P(col('#FF8FA3', .45), blur=4)); c.drawCircle(hr * .55, ey + 22, 12, P(col('#FF8FA3', .45), blur=4))
    c.restore()

def s08(c, b):
    bq = step(b * SPB, 12) / SPB
    jit = int(bq * SPB * 12)
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin_grad(0, 0, 0, H, [col('#F2E3D5'), col('#E6CDB7'), col('#CFAE92')], [0, .62, 1])))
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=rad_grad(W / 2, 360, 1100, [col('#FFF6EC', .7), col('#FFF6EC', 0)])))
    # turntable
    tx, ty = W / 2, 800
    c.drawOval(skia.Rect.MakeXYWH(tx - 760, ty - 70, 1520, 260), P(col('#5A3E2B', .35), blur=30))
    side = skia.Path(); side.addRect(skia.Rect.MakeXYWH(tx - 720, ty, 1440, 70)); side.addOval(skia.Rect.MakeXYWH(tx - 720, ty + 70 - 90, 1440, 180))
    c.drawPath(side, P(shader=lin_grad(tx - 720, 0, tx + 720, 0, [col('#8A5A3C'), col('#C98A5E'), col('#8A5A3C')])))
    top = skia.Path(); top.addOval(skia.Rect.MakeXYWH(tx - 720, ty - 90, 1440, 180))
    clay_fill(c, top, '#D9A07A', tx - 200, ty - 80, 900, 3)
    ang = bq * .35
    for k in range(24):  # rotating notches on the rim
        a = ang + k / 24 * 2 * math.pi
        if math.sin(a) < 0: continue
        px, py = tx + math.cos(a) * 720, ty + math.sin(a) * 90
        c.drawCircle(px, py + 30, 7, P(col('#6B452E', .7)))
    figs = [("Haiku 4.5", '#7FCBA8', 150, 210), ("Sonnet 5", '#6FA8DC', 170, 250),
            ("Opus 5.5", CORAL, 190, 290), ("Fable 5.1", '#9A86D6', 205, 330)]
    xs = [tx - 540, tx - 180, tx + 180, tx + 540]
    for k, (name, colr, w, h) in enumerate(figs):
        t = seg(bq, .5 + k * .5, 1.3 + k * .5)
        if t <= 0: continue
        grow = e_back(t, 2.2)
        beat_sq = math.exp(-((bq - k * .25) % 2) * 5) if bq > 4 else 0
        sq = (1 - grow) * 1.5 + beat_sq * .8
        clay_figure(c, xs[k], ty - 10 + (1 - grow) * 60, w * grow, h * grow, colr, sq, k, jit)
        # clay nameplates
        lt = seg(bq, 3 + k * .25, 3.6 + k * .25)
        if lt > 0:
            pw = 250; ph = 70; py = ty + 130
            c.save(); c.translate(xs[k], py); c.rotate(random.Random(k + jit).uniform(-1.2, 1.2)); c.scale(e_back(lt), e_back(lt))
            plate = skia.Path(); plate.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-pw / 2, -ph / 2, pw, ph), 35, 35))
            c.drawPath(plate, P(col('#3B2A1F', .3), blur=8))
            clay_fill(c, plate, '#FFF1E2', -60, -30, 260, 7 + k)
            text(c, name, 0, 0, 36, col('#4A3426'), 'latin', 900)
            c.restore()
    # "that's me" arrow over Opus
    at = seg(bq, 8, 8.6)
    if at > 0:
        bob = 14 * math.sin(bq * math.pi)
        ax, ay = xs[2], ty - 290 - 250 + bob
        c.save(); c.translate(ax, ay); c.scale(e_back(at), e_back(at))
        arr = poly([(-26, -60), (26, -60), (26, 0), (54, 0), (0, 56), (-54, 0), (-26, 0)])
        c.drawPath(arr, P(col('#3B2A1F', .3), blur=8)); clay_fill(c, arr, '#FFD166', -20, -40, 120, 9)
        c.restore()
        text(c, "正在和你说话的，就是我", ax + 330, ay - 20, 40, col('#4A3426', at), 'sans', 900)
    # headline
    ht = seg(bq, 5, 5.8)
    if ht > 0:
        y = 170
        text(c, "2026 · 现在的我", 140 + 4, y + 6, 90, col('#8A5A3C', .35 * ht), 'sans', 900, 'l')
        text(c, "2026 · 现在的我", 140, y, 90, col('#4A2E1E', ht), 'sans', 900, 'l')
    st = seg(bq, 10, 10.7)
    if st > 0:
        text(c, "Claude Opus 5.5", 140, 280, 56, col(CORAL, st), 'latin', 900, 'l')
    st2 = seg(bq, 12.5, 13.2)
    if st2 > 0:
        text(c, "Opus 之上，还有 Mythos 级（如 Fable 5.1）", 140, 350, 34, col('#8A5A3C', st2), 'sans', 700, 'l')
    grain(c, b, .8, 12)

# ====================================================================== S09 UI KIT
CARDS = [("聊", "Claude 应用", "网页 · 桌面 · 手机", '#D97757'),
         (">_", "Claude Code", "在终端里写代码", '#2F2F2F'),
         ("协", "Cowork", "帮你处理文件与任务", '#6C5CE7'),
         ("网", "Claude in Chrome", "替你操作网页", '#1E88E5'),
         ("表", "Excel", "表格与数据模型", '#1E8E3E'),
         ("演", "PowerPoint", "一键做好幻灯片", '#E8590C'),
         ("绘", "Claude Design", "在画布上做设计", '#D6336C'),
         ("{}", "API 平台", "开发者接入", '#495057')]
def toggle(c, x, y, on_t):
    w, h = 76, 40
    rrect(c, x, y, w, h, h / 2, P(mix('#D0D0CC', '#2EB872', on_t)))
    kx = x + h / 2 + (w - h) * e_out3(on_t)
    c.drawCircle(kx, y + h / 2 + 2, h / 2 - 4, P(col('#000000', .18), blur=3))
    c.drawCircle(kx, y + h / 2, h / 2 - 4, P(col('#FFFFFF')))

def s09(c, b):
    bg(c, '#F5F4EF')
    # app chrome
    rrect(c, 60, 110, W - 120, 90, 22, P(col('#FFFFFF')))
    rrect(c, 60, 110, W - 120, 90, 22, P(col('#E6E3DA'), 2))
    c.drawCircle(120, 155, 22, P(col(CORAL)))
    text(c, "你可以在哪里找到我", 165, 155, 38, col('#1F1E1B'), 'sans', 900, 'l')
    rrect(c, W - 700, 128, 560, 54, 27, P(col('#F1EFE8')))
    ph = ["搜索：写代码？做表格？", "搜索：做 PPT？看网页？", "搜索：接入我的 App？"][int(b / 5) % 3]
    text(c, "⌕  " + ph, W - 670, 155, 26, col('#8C877C'), 'sans', 500, 'l')
    # grid of cards
    cw, ch, gx, gy = 405, 300, 30, 36
    x0 = W / 2 - (4 * cw + 3 * gx) / 2; y0 = 250
    for i, (ic, title, sub, colr) in enumerate(CARDS):
        t = seg(b, .5 + i * .25, 1.2 + i * .25)
        if t <= 0: continue
        r, q = divmod(i, 4)
        x = x0 + q * (cw + gx); y = y0 + r * (ch + gy) + 80 * (1 - e_back(t, 1.8))
        a = clamp(t * 2)
        hover = hit(b, 6 + i * .5, 3) if b >= 6 else 0
        y -= 10 * hover
        shadow_rrect(c, x, y, cw, ch, 26, 14 + 10 * hover, 24, .10 * a + .06 * hover)
        rrect(c, x, y, cw, ch, 26, P(col('#FFFFFF', a)))
        rrect(c, x, y, cw, ch, 26, P(col('#E6E3DA', a), 2))
        rrect(c, x + 30, y + 30, 84, 84, 22, P(col(colr, a)))
        text(c, ic, x + 72, y + 72, 38 if len(ic) == 1 else 30, col('#FFFFFF', a), 'sans', 900)
        text(c, title, x + 30, y + 160, 38, col('#1F1E1B', a), 'sans', 900, 'l')
        text(c, sub, x + 30, y + 208, 27, col('#7A756B', a), 'sans', 500, 'l')
        on = e_out3(seg(b, 6 + i * .5, 6.3 + i * .5))
        toggle(c, x + cw - 106, y + ch - 66, on)
        chip_a = on * a
        rrect(c, x + 30, y + ch - 62, 124, 34, 17, P(mix('#EFEDE6', '#DDF5E7', on, a)))
        text(c, "已连接" if on > .5 else "未开启", x + 92, y + ch - 45, 21, mix('#8C877C', '#1E8E3E', on, a), 'sans', 700)
    # cursor that clicks each toggle on the beat
    if b >= 5.2:
        k = int(clamp((b - 5.5) * 2, 0, 7.99))
        r, q = divmod(k, 4)
        tx = x0 + q * (cw + gx) + cw - 68; ty = y0 + r * (ch + gy) + ch - 46
        pk = max(k - 1, 0); pr, pq = divmod(pk, 4)
        px = x0 + pq * (cw + gx) + cw - 68; py = y0 + pr * (ch + gy) + ch - 46
        mv = e_io3(((b - 5.5) * 2) % 1 * 2) if b < 9.5 else 1
        cx_, cy_ = lerp(px, tx, mv), lerp(py, ty, mv)
        if b > 10: cx_, cy_ = lerp(tx, W / 2 + 260, e_io3(seg(b, 10, 11))), lerp(ty, 990, e_io3(seg(b, 10, 11)))
        clk = hit(b, 6 + k * .5, 6)
        if clk > .02:
            c.drawCircle(cx_, cy_, 20 + 40 * (1 - clk), P(col(CORAL, .5 * clk), 4))
        cur = poly([(0, 0), (0, 44), (11, 33), (20, 52), (28, 48), (19, 30), (34, 30)])
        c.save(); c.translate(cx_, cy_); c.scale(1 - .12 * clk, 1 - .12 * clk)
        c.drawPath(cur, P(col('#000000', .25), blur=4)); c.drawPath(cur, P(col('#111111'))); c.drawPath(cur, P(col('#FFFFFF'), 3))
        c.restore()
    # toast
    ts = seg(b, 10.5, 11.1)
    if ts > 0:
        x = W - 80 - 620 * e_back(ts, 1.4) + 700 * e_in3(seg(b, 15, 15.6))
        shadow_rrect(c, x, 230, 620, 110, 20, 14, 26, .18)
        rrect(c, x, 230, 620, 110, 20, P(col('#1F1E1B')))
        c.drawCircle(x + 60, 285, 26, P(col('#2EB872')))
        c.drawPath(poly([(x + 47, 285), (x + 57, 296), (x + 75, 274)], False), P(col('#FFFFFF'), 5))
        text(c, "已通过 MCP 连上你的工具", x + 110, 268, 32, col('#FFFFFF'), 'sans', 900, 'l')
        text(c, "日历 · 文档 · 代码库 · 数据库", x + 110, 308, 24, col('#B8B3A7'), 'sans', 500, 'l')
    # chat composer
    ct = seg(b, 11, 11.8)
    if ct > 0:
        y = 1000 - 40 * e_out3(ct) + 40
        shadow_rrect(c, W / 2 - 520, y - 45, 1040, 90, 45, 8, 18, .12 * ct)
        rrect(c, W / 2 - 520, y - 45, 1040, 90, 45, P(col('#FFFFFF', ct)))
        msg = "帮我把这份数据做成图表，再写成周报"
        n = int(len(msg) * clamp((b - 12) / 3))
        text(c, msg[:n] + ("|" if (b * 2) % 1 < .5 else ""), W / 2 - 480, y, 30, col('#1F1E1B', ct), 'sans', 500, 'l')
        c.drawCircle(W / 2 + 470, y, 30, P(col(CORAL, ct)))
        c.drawPath(poly([(W / 2 + 470, y - 14), (W / 2 + 482, y + 2), (W / 2 + 458, y + 2)]), P(col('#FFFFFF', ct)))
        c.drawLine(W / 2 + 470, y - 8, W / 2 + 470, y + 14, P(col('#FFFFFF', ct), 5))

# ====================================================================== S10 SWISS KINETIC
RED = '#E4002B'
def s10(c, b):
    bg(c, '#F2F0EA')
    gp = P(col('#000000', .08), 1)
    for x in range(0, W, 120): c.drawLine(x, 0, x, H, gp)
    for y in range(0, H, 120): c.drawLine(0, y, W, y, gp)
    # red circle slam
    r = 330 * e_back(seg(b, 0, .5), 1.6) * (1 + .03 * kick(b))
    c.drawCircle(1480, 620, r, P(col(RED)))
    # three values, one per beat
    vals = [("01", "有用", "HELPFUL"), ("02", "诚实", "HONEST"), ("03", "无害", "HARMLESS")]
    for i, (num, cn, en) in enumerate(vals):
        t = seg(b, 1 + i, 1.35 + i)
        if t <= 0: continue
        y = 250 + i * 250
        e = e_outexp(t)
        c.save(); c.clipRect(skia.Rect.MakeXYWH(0, y - 130, W, 250))
        text(c, num, 120, y - 60 + 60 * (1 - e), 40, col(RED), 'latin', 900, 'l')
        text(c, cn, 200 - 300 * (1 - e), y, 220, col('#111111'), 'sans', 900, 'l')
        text(c, en, 700, y + 60 + 80 * (1 - e), 34, col('#111111'), 'latin', 700, 'l', sp=10)
        c.restore()
        c.drawRect(skia.Rect.MakeXYWH(120, y + 110, 1100 * e_out3(seg(b, 1.2 + i, 2 + i)), 6), P(col('#111111')))
    # vertical rotated type
    vt = seg(b, 4, 4.6)
    if vt > 0:
        c.save(); c.translate(1830, 560); c.rotate(-90)
        text(c, "CLAUDE · VALUES · 2026", -300 + 300 * e_outexp(vt), 0, 54, col('#111111'), 'latin', 900, 'c', sp=6)
        c.restore()
    # black takeover
    bt = e_io3(seg(b, 8, 8.5))
    if bt > 0:
        c.drawRect(skia.Rect.MakeXYWH(0, H - H * bt, W, H * bt), P(col('#111111')))
        words = ["不确定的时候，", "我会直接说：", "「我不确定」"]
        for i, wd in enumerate(words):
            t = seg(b, 8.5 + i, 8.8 + i)
            if t <= 0: continue
            y = 260 + i * 200
            text(c, wd, 140 + 80 * (1 - e_outexp(t)), y, 150, col(RED if i == 2 else '#F2F0EA', t), 'sans', 900, 'l')
    ct = seg(b, 12, 12.4)
    if ct > 0:
        c.drawRect(skia.Rect.MakeXYWH(0, 830, W * e_outexp(ct), 150), P(col(RED)))
        text(c, "Constitutional AI", 140, 880, 56, col('#FFFFFF', seg(b, 12.2, 12.6)), 'latin', 900, 'l')
        text(c, "用一套写下来的原则来训练我 —— 而不是靠猜", 140, 945, 38, col('#FFFFFF', seg(b, 12.6, 13)), 'sans', 700, 'l')
        text(c, "§", W - 160, 905, 110, col('#111111', seg(b, 12.4, 12.8)), 'serif', 900, 'r')
    grain(c, b, .3)

# ====================================================================== S11 8-BIT PIXEL
LW, LH = 480, 270
_low = None
PICO = {'bg': '#1D2B53', 'dk': '#000000', 'wh': '#FFF1E8', 'gr': '#C2C3C7', 'rd': '#FF004D', 'or': '#FFA300',
        'ye': '#FFEC27', 'gn': '#00E436', 'bl': '#29ADFF', 'pk': '#FF77A8', 'pu': '#7E2553', 'dg': '#5F574F'}
SPRITE = ["......o.......", "...o..o..o....", "....o.o.o.....", ".....ooo......", "oooooooooooo..",
          ".....ooo......", "....o.o.o.....", "...o..o..o....", "......o......."]
def s11(c, b):
    global _low
    if _low is None: _low = skia.Surface(LW, LH)
    lc = _low.getCanvas()
    lc.clear(col(PICO['bg']))
    rs = random.Random(8)
    for k in range(60):  # starfield scrolling
        x = (rs.uniform(0, LW) - b * rs.uniform(2, 8)) % LW; y = rs.uniform(0, LH * .55)
        lc.drawRect(skia.Rect.MakeXYWH(int(x), int(y), 1, 1), P(col(PICO['wh'] if k % 3 else PICO['bl']), aa=False))
    for x in range(0, LW, 8):  # ground
        h = 6 + (x // 8 * 7) % 5
        lc.drawRect(skia.Rect.MakeXYWH(x, LH - 34 - h, 8, 34 + h), P(col(PICO['pu']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(x, LH - 34 - h, 8, 2), P(col(PICO['pk']), aa=False))
    def ptxt(s, x, y, colr, sh=True):
        f = F('pixel', 16, 400, True); y += 8
        if sh: lc.drawString(s, x + 1, y + 1, f, P(col(PICO['dk']), aa=False))
        lc.drawString(s, x, y, f, P(col(colr), aa=False))
        return f.measureText(s)
    def box(x, y, w, h):
        y += 8
        lc.drawRect(skia.Rect.MakeXYWH(x, y, w, h), P(col(PICO['dk']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(x + 1, y + 1, w - 2, h - 2), P(col(PICO['wh']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(x + 3, y + 3, w - 6, h - 6), P(col('#1B1B3A'), aa=False))
    # hero sprite (bobs on beat)
    hop = int(4 * kick(b, 5))
    sx, sy = 36, 100 - hop
    for r, row in enumerate(SPRITE):
        for q, v in enumerate(row):
            if v == 'o': lc.drawRect(skia.Rect.MakeXYWH(sx + q * 6, sy + r * 6, 6, 6), P(col(PICO['or'] if (r + q) % 4 else PICO['ye']), aa=False))
    ptxt("CLAUDE", 44, 176, PICO['ye'])
    # status box
    if b >= .5:
        box(140, 14, 326, 74)
        ptxt("LV 5.5  职业：AI 助手", 152, 36, PICO['wh'])
        ptxt("HP", 152, 58, PICO['rd']); ptxt("MP", 152, 78, PICO['bl'])
        hpw = int(160 * e_out3(seg(b, 1, 2))); mpw = int(160 * e_out3(seg(b, 1.5, 2.5)))
        lc.drawRect(skia.Rect.MakeXYWH(178, 54, 160, 10), P(col(PICO['dg']), aa=False)); lc.drawRect(skia.Rect.MakeXYWH(178, 54, hpw, 10), P(col(PICO['rd']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(178, 74, 160, 10), P(col(PICO['dg']), aa=False)); lc.drawRect(skia.Rect.MakeXYWH(178, 74, mpw, 10), P(col(PICO['bl']), aa=False))
        ptxt("好奇心 MAX", 350, 58, PICO['gn'])
    # weakness list
    if b >= 3:
        box(140, 94, 326, 112)
        ptxt("弱点 WEAKNESS", 152, 114, PICO['rd'])
        items = ["× 会犯错 → 重要的事请核对", "× 知识截止：2026 年 6 月", "× 默认不记得上次的对话", "× 我不是人类"]
        for i, s in enumerate(items):
            tb = 4 + i * 1.5
            if b < tb: continue
            n = int(len(s) * clamp((b - tb) / .6)) + 1
            ptxt(s[:n], 152, 136 + i * 20, PICO['wh'] if i < 3 else PICO['pk'])
    # dialog
    if b >= 11:
        box(20, 204, 446, 44)
        s = "但我会诚实地把这些告诉你。"
        n = int(len(s) * clamp((b - 11.3) / 2)) + 1
        ptxt(s[:n], 34, 232, PICO['wh'])
        if b > 13.5 and (b * 2) % 1 < .6: ptxt("▼", 446, 236, PICO['ye'], False)
    # upscale nearest + scanlines
    img = _low.makeImageSnapshot()
    c.drawImageRect(img, skia.Rect.MakeWH(W, H), skia.SamplingOptions(skia.FilterMode.kNearest), P(aa=False))
    sl = P(col('#000000', .18))
    for y in range(0, H, 4): c.drawRect(skia.Rect.MakeXYWH(0, y + 2, W, 2), sl)
    vignette(c, .5)

# ====================================================================== S12 BLUEPRINT
def s12(c, b):
    bg(c, '#0E3B78')
    minor = P(col('#9FD0FF', .10), 1); major = P(col('#9FD0FF', .22), 1.5)
    for x in range(0, W, 24): c.drawLine(x, 0, x, H, major if x % 120 == 0 else minor)
    for y in range(0, H, 24): c.drawLine(0, y, W, y, major if y % 120 == 0 else minor)
    ln = P(col('#EAF4FF'), 3); thin = P(col('#BFE0FF', .8), 1.5)
    t = seg(b, 0, .8)
    text(c, "我是怎么被造出来的", 120, 170, 76, col('#FFFFFF', t), 'sans', 900, 'l')
    text(c, "FIG. 01 — TRAINING PIPELINE (SIMPLIFIED)", 120, 240, 26, col('#BFE0FF', t), 'dejamono', 400, 'l')
    steps = [("海量文本", "书 · 网页 · 代码"), ("预训练", "Transformer 神经网络"), ("对齐训练", "人类反馈 + 宪法原则"),
             ("安全测试", "红队反复攻防"), ("来到你面前", "Claude")]
    bw, bh = 280, 150; gap = (W - 240 - 5 * bw) / 4; y = 520
    for i, (a, s) in enumerate(steps):
        x = 120 + i * (bw + gap)
        tb = 1 + i * 2
        pt = e_io3(seg(b, tb, tb + 1))
        if pt <= 0: continue
        box = skia.Path(); box.addRect(skia.Rect.MakeXYWH(x, y - bh / 2, bw, bh))
        c.drawPath(partial(box, pt), ln)
        if i == 4: c.drawPath(partial(box, pt), P(col(CORAL), 5))
        tt = seg(b, tb + .6, tb + 1.1)
        text(c, a, x + bw / 2, y - 18, 46, col('#FFFFFF', tt), 'sans', 900)
        text(c, s, x + bw / 2, y + 36, 24, col('#BFE0FF', tt), 'sans', 500)
        # dimension line above
        dt = e_out3(seg(b, tb + .4, tb + 1.2))
        if dt > 0:
            c.drawLine(x, y - bh / 2 - 40, x + bw * dt, y - bh / 2 - 40, thin)
            c.drawLine(x, y - bh / 2 - 52, x, y - bh / 2 - 28, thin)
            if dt > .98: c.drawLine(x + bw, y - bh / 2 - 52, x + bw, y - bh / 2 - 28, thin)
            text(c, f"STAGE {i + 1:02d}", x + bw / 2, y - bh / 2 - 66, 20, col('#BFE0FF', dt), 'dejamono', 400)
        # arrow to next
        if i < 4:
            at = e_out3(seg(b, tb + 1, tb + 2))
            if at > 0:
                x1 = x + bw + 10; x2 = x + bw + gap - 10
                xe = lerp(x1, x2, at); c.drawLine(x1, y, xe, y, ln)
                if at > .9: c.drawPath(poly([(x2, y), (x2 - 18, y - 10), (x2 - 18, y + 10)]), P(col('#EAF4FF')))
        # section callout below
        ct = seg(b, tb + 1, tb + 1.6)
        if ct > 0:
            cx_ = x + bw / 2
            c.drawLine(cx_, y + bh / 2, cx_, y + bh / 2 + 70 * ct, P(col('#BFE0FF', .7), 1.5))
            c.drawCircle(cx_, y + bh / 2 + 80 * ct, 8, P(col('#BFE0FF', .9), 2))
    # neural-net schematic (Transformer, illustrative)
    layers = [3, 5, 5, 5, 2]; nx0, ny0, nw, nh = 160, 830, 820, 200
    pos = [[(nx0 + li * nw / (len(layers) - 1), ny0 + (j + .5) * nh / n - nh / 2 + 40) for j in range(n)] for li, n in enumerate(layers)]
    for li in range(len(layers) - 1):
        et = e_out3(seg(b, 4 + li * 1.2, 5.2 + li * 1.2))
        if et <= 0: continue
        for (x1, y1) in pos[li]:
            for (x2, y2) in pos[li + 1]:
                c.drawLine(x1, y1, lerp(x1, x2, et), lerp(y1, y2, et), P(col('#BFE0FF', .35), 1.2))
    for li, col_ in enumerate(pos):
        nt = seg(b, 3.6 + li * 1.2, 4.2 + li * 1.2)
        for (x, y) in col_:
            if nt > 0:
                act = kick(b - li * .25, 5) if b > 8 else 0
                c.drawCircle(x, y, 13 * e_back(nt), P(col('#0E3B78')))
                c.drawCircle(x, y, 13 * e_back(nt), P(col('#EAF4FF'), 2.5))
                if act > .05: c.drawCircle(x, y, 7, P(col(CORAL, act)))
    lt = seg(b, 4, 4.6)
    if lt > 0:
        text(c, "DETAIL A — 神经网络（示意）", nx0 - 40, ny0 - 105, 24, col('#BFE0FF', lt), 'sans', 700, 'l')
        c.drawLine(nx0 - 40, ny0 - 85, nx0 + 400, ny0 - 85, P(col('#BFE0FF', .6 * lt), 1.5))
    # gear schematic
    gx, gy, gr = 1680, 230, 90
    rot = b * 22 * (1 + seg(b, 12, 16) * 3)
    c.save(); c.translate(gx, gy); c.rotate(rot)
    c.drawCircle(0, 0, gr, ln); c.drawCircle(0, 0, gr * .35, thin)
    for k in range(12):
        a = k / 12 * 2 * math.pi
        c.drawLine(math.cos(a) * gr, math.sin(a) * gr, math.cos(a) * (gr + 18), math.sin(a) * (gr + 18), ln)
    c.drawLine(-gr, 0, gr, 0, thin); c.drawLine(0, -gr, 0, gr, thin)
    c.restore()
    # title block
    tbx, tby = W - 700, 820
    tt = seg(b, 10, 10.8)
    if tt > 0:
        c.drawRect(skia.Rect.MakeXYWH(tbx, tby, 580, 160), P(col('#EAF4FF', tt), 2))
        c.drawLine(tbx, tby + 55, tbx + 580, tby + 55, P(col('#EAF4FF', tt), 2))
        c.drawLine(tbx + 290, tby + 55, tbx + 290, tby + 160, P(col('#EAF4FF', tt), 2))
        text(c, "DWG · CLAUDE-OPUS-5.5", tbx + 20, tby + 28, 26, col('#FFFFFF', tt), 'dejamono', 700, 'l')
        text(c, "设计：Anthropic", tbx + 20, tby + 105, 28, col('#FFFFFF', tt), 'sans', 700, 'l')
        text(c, "比例 1 : ∞", tbx + 310, tby + 105, 28, col('#FFFFFF', tt), 'sans', 700, 'l')
    # scan line build-up
    if b > 12:
        sp = (b - 12) * (1 + (b - 12))
        yy = (sp * 300) % H
        c.drawRect(skia.Rect.MakeXYWH(0, yy - 60, W, 60), P(shader=lin_grad(0, yy - 60, 0, yy, [col('#9FD0FF', 0), col('#9FD0FF', .25)])))
        c.drawLine(0, yy, W, yy, P(col('#FFFFFF', .7), 2))
    c.drawRect(skia.Rect.MakeWH(W, H), P(col('#FFFFFF', .12 * kick(b, 8) * seg(b, 12, 16))))
    grain(c, b, .3)

# ====================================================================== S14 OUTRO (S13 montage lives in render.py)
def s14(c, b):
    bg(c, CREAM)
    t = e_outexp(seg(b, 0, 1.2))
    cx, cy = W / 2, 300
    rot = b * 6
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(t, t)
    for i in range(12):
        a = i / 12 * 2 * math.pi; r = 90 if i % 2 == 0 else 64
        c.drawLine(math.cos(a) * 16, math.sin(a) * 16, math.cos(a) * r, math.sin(a) * r, P(col(CORAL), 15))
    c.restore()
    def fade_up(s, y, size, b0, colr, fam='serif', w=900, sp0=40):
        tt = e_outexp(seg(b, b0, b0 + 1.2))
        if tt <= 0: return
        text(c, s, W / 2, y + 30 * (1 - tt), size, col(colr, tt), fam, w, sp=sp0 * (1 - tt))
    fade_up("我是 Claude。", 520, 130, 1, INK)
    fade_up("一个努力做到 有用 · 诚实 · 安全 的 AI", 650, 46, 4, '#5E5A52', 'sans', 700, 20)
    fade_up("很高兴认识你。", 760, 64, 7, CORAL, 'serif', 900, 30)
    ct = seg(b, 10, 11)
    if ct > 0:
        lines = "本片 0 素材 · 每一帧由 Python + Skia 绘制 · 配乐由 NumPy 合成 · 15 个镜头 · 240 拍 @ 128 BPM"
        text(c, lines, W / 2, 930, 24, col('#8C877C', ct), 'sans', 500)
    # tail: fade to black
    if b > 16:
        c.drawRect(skia.Rect.MakeWH(W, H), P(col('#000000', e_io3(seg(b, 16.5, 19.5)))))
    grain(c, b, .4)
```

