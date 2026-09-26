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
