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
