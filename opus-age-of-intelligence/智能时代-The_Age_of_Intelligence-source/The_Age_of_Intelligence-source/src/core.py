"""Rendering core: text sprites, compositing, 3D projection, splatting, bloom, easing."""
import os
import numpy as np, cv2, math, functools
from PIL import Image, ImageDraw, ImageFont
import timeline as TL

cv2.setNumThreads(1)
W, H = TL.W, TL.H
FD = TL.FONT_DIR + os.sep

# ------------------------------------------------------------------ palette (RGB float)
BG = np.array([0.010, 0.013, 0.028], np.float32)
CYAN = (0.20, 0.88, 1.00)
MAG = (1.00, 0.22, 0.52)
AMBER = (1.00, 0.68, 0.22)
WHITE = (1.0, 1.0, 1.0)
LIME = (0.72, 1.00, 0.35)
VIOLET = (0.55, 0.40, 1.00)
GREY = (0.55, 0.60, 0.70)
DIM = (0.25, 0.30, 0.40)
HUES = [CYAN, MAG, AMBER]


def col(c, k=1.0):
    return tuple(float(v) * k for v in c)


def mixc(a, b, t):
    return tuple(a[i] * (1 - t) + b[i] * t for i in range(3))


# ------------------------------------------------------------------ easing
def clamp01(x):
    return max(0.0, min(1.0, x))


def lerp(a, b, t):
    return a + (b - a) * t


def ramp(x, a, b):
    """0 at a, 1 at b (clamped)"""
    if b == a:
        return 1.0 if x >= b else 0.0
    return clamp01((x - a) / (b - a))


def e_out3(t):
    t = clamp01(t); return 1 - (1 - t) ** 3


def e_out5(t):
    t = clamp01(t); return 1 - (1 - t) ** 5


def e_in3(t):
    t = clamp01(t); return t ** 3


def e_io3(t):
    t = clamp01(t); return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def e_expo(t):
    t = clamp01(t); return 1.0 if t >= 1 else 1 - 2 ** (-10 * t)


def e_back(t, s=1.9):
    t = clamp01(t) - 1; return t * t * ((s + 1) * t + s) + 1


def e_elastic(t):
    t = clamp01(t)
    if t in (0, 1):
        return t
    return 2 ** (-10 * t) * math.sin((t * 10 - 0.75) * (2 * math.pi) / 3) + 1


def smooth(t):
    t = clamp01(t); return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ fonts & text
FONTS = {
    'anton': 'anton.ttf', 'bebas': 'bebas.ttf', 'g4': 'grotesk400.ttf', 'g5': 'grotesk500.ttf', 'g7': 'grotesk700.ttf',
    'm4': 'mono400.ttf', 'm7': 'mono700.ttf', 'm8': 'mono800.ttf', 'i3': 'inter300.ttf', 'i4': 'inter400.ttf',
    'i6': 'inter600.ttf', 'i8': 'inter800.ttf', 'i9': 'inter900.ttf', 'u8': 'unbounded800.ttf', 'u9': 'unbounded900.ttf',
    'dejavu': 'DejaVuSans.ttf', 'sc5': 'notosc500.ttf', 'sc7': 'notosc700.ttf', 'sc9': 'notosc900.ttf',
}


@functools.lru_cache(maxsize=256)
def font(key, size):
    p = FONTS[key]
    return ImageFont.truetype(p if p.startswith('/') else FD + p, int(size))


def _is_cjk(ch):
    o = ord(ch)
    return o >= 0x2E80 and not (0x2000 <= o <= 0x206F)


_CMAPS = {}


def has_glyph(key, ch):
    if key not in _CMAPS:
        from fontTools.ttLib import TTFont
        p = FONTS[key]
        _CMAPS[key] = set(TTFont(p if p.startswith('/') else FD + p).getBestCmap().keys())
    return ord(ch) in _CMAPS[key]


@functools.lru_cache(maxsize=4096)
def text_mask(text, fkey, size, tracking=0.0, cjk_key=None):
    """Return (alpha float32 HxW, baseline_y, advances list, pad). tracking in em units. Per-glyph font fallback."""
    f = font(fkey, size)
    asc, desc = f.getmetrics()
    pad = int(size * 0.25) + 4
    xs = []; x = 0.0
    for ch in text:
        if ch == ' ' or has_glyph(fkey, ch):
            ff = f
        elif _is_cjk(ch) or ch in '，。：；！？“”《》、（）…':
            ff = font(cjk_key or 'sc7', size)
        elif has_glyph('dejavu', ch):
            ff = font('dejavu', size * 0.92)
        else:
            ff = font('sc7', size)
        adv = ff.getlength(ch)
        xs.append((ch, x, adv, ff))
        x += adv + tracking * size
    width = int(math.ceil(x - (tracking * size if text else 0))) + 2 * pad
    hh = asc + desc + 2 * pad
    im = Image.new('L', (max(width, 1), hh), 0)
    d = ImageDraw.Draw(im)
    for ch, cx, adv, ff in xs:
        if ff is f:
            d.text((pad + cx, pad), ch, font=ff, fill=255)
        else:  # align baselines of fallback glyphs
            fa = ff.getmetrics()[0]
            d.text((pad + cx, pad + asc - fa), ch, font=ff, fill=255)
    a = np.asarray(im, np.float32) / 255.0
    # trim vertical to ink bounds but keep baseline info
    return a, pad + asc, [(ch, pad + cx, adv) for ch, cx, adv, ff in xs], pad


def text_size(text, fkey, size, tracking=0.0, cjk_key=None):
    a, base, adv, pad = text_mask(text, fkey, size, tracking, cjk_key)
    return a.shape[1] - 2 * pad, a.shape[0] - 2 * pad


@functools.lru_cache(maxsize=512)
def outline_mask(text, fkey, size, tracking=0.0, width=3):
    a, _, _, _ = text_mask(text, fkey, size, tracking)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * width + 1, 2 * width + 1))
    d = cv2.dilate(a, k)
    return np.clip(d - a, 0, 1)


def blend(canvas, mask, x0, y0, color, alpha=1.0, mode='over'):
    """composite a float mask at integer position (top-left) onto canvas"""
    if alpha <= 0.001:
        return
    h, w = mask.shape[:2]
    X0, Y0 = max(0, x0), max(0, y0)
    X1, Y1 = min(W, x0 + w), min(H, y0 + h)
    if X1 <= X0 or Y1 <= Y0:
        return
    m = mask[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0]
    reg = canvas[Y0:Y1, X0:X1]
    c = np.asarray(color, np.float32)
    if m.ndim == 2:
        m = m[..., None]
    m = m * alpha
    if mode == 'add':
        reg += m * c
    elif mode == 'mul':
        reg *= (1 - m) + m * c
    elif mode == 'sub':
        reg -= m * c
        np.maximum(reg, 0, out=reg)
    else:
        reg *= (1 - m)
        reg += m * c


def warp_mask(mask, scale=1.0, rot=0.0, skew=0.0, sx=None, sy=None):
    """scale/rotate a mask about its centre; returns new mask and centre offset"""
    sx = scale if sx is None else sx
    sy = scale if sy is None else sy
    h, w = mask.shape
    if abs(sx - 1) < 1e-4 and abs(sy - 1) < 1e-4 and abs(rot) < 1e-4 and abs(skew) < 1e-4:
        return mask
    c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    A = np.array([[c * sx, -s * sy + skew * sx], [s * sx, c * sy]])
    corners = np.array([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]) @ A.T
    nw = int(math.ceil(corners[:, 0].max() - corners[:, 0].min())) + 2
    nh = int(math.ceil(corners[:, 1].max() - corners[:, 1].min())) + 2
    M = np.zeros((2, 3))
    M[:, :2] = A
    M[:, 2] = np.array([nw / 2, nh / 2]) - A @ np.array([w / 2, h / 2])
    interp = cv2.INTER_AREA if max(sx, sy) < 0.7 else cv2.INTER_LINEAR
    return cv2.warpAffine(mask, M, (nw, nh), flags=interp)


def draw_text(canvas, text, fkey, size, x, y, color=WHITE, alpha=1.0, anchor='mm', scale=1.0, rot=0.0,
              tracking=0.0, mode='over', skew=0.0, reveal=None, sx=None, sy=None, cjk=None, outline=0, blur=0):
    """anchor: first char l/m/r horizontal, second t/m/b vertical (relative to cap box)"""
    if not text or alpha <= 0.001:
        return (0, 0)
    if outline:
        a = outline_mask(text, fkey, size, tracking, outline)
        _, base, _, pad = text_mask(text, fkey, size, tracking, cjk)
    else:
        a, base, _, pad = text_mask(text, fkey, size, tracking, cjk)
    if reveal is not None:  # left->right wipe 0..1
        a = a.copy(); cut = int(pad + (a.shape[1] - 2 * pad) * clamp01(reveal))
        a[:, cut:] = 0
    if blur > 0:
        a = cv2.GaussianBlur(a, (0, 0), blur)
    tw, th = a.shape[1] - 2 * pad, a.shape[0] - 2 * pad
    # vertical reference: cap-height box ~ from (base - 0.72*size) to base
    f = font(fkey, size)
    asc, desc = f.getmetrics()
    cap_top = base - size * (0.72 if fkey not in ('anton', 'bebas') else 0.86)
    cy_box = (cap_top + base) / 2
    ax = {'l': pad, 'm': pad + tw / 2, 'r': pad + tw}[anchor[0]]
    ay = {'t': cap_top, 'm': cy_box, 'b': base}[anchor[1]]
    s_x = scale if sx is None else sx
    s_y = scale if sy is None else sy
    if abs(s_x - 1) < 1e-4 and abs(s_y - 1) < 1e-4 and abs(rot) < 1e-4 and abs(skew) < 1e-4:
        blend(canvas, a, int(round(x - ax)), int(round(y - ay)), color, alpha, mode)
    else:
        h, w = a.shape
        m2 = warp_mask(a, scale, rot, skew, s_x, s_y)
        # position of anchor after transform relative to new centre
        c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
        A = np.array([[c * s_x, -s * s_y + skew * s_x], [s * s_x, c * s_y]])
        off = A @ np.array([ax - w / 2, ay - h / 2])
        nx = x - off[0] - m2.shape[1] / 2
        ny = y - off[1] - m2.shape[0] / 2
        blend(canvas, m2, int(round(nx)), int(round(ny)), color, alpha, mode)
    return (tw * s_x, th * s_y)


def char_layout(text, fkey, size, tracking=0.0):
    """per-char centres (relative to string centre) for kinetic typography"""
    a, base, adv, pad = text_mask(text, fkey, size, tracking)
    tw = a.shape[1] - 2 * pad
    out = []
    for ch, cx, w_ in adv:
        out.append((ch, cx - pad + w_ / 2 - tw / 2))
    return out, tw


def kinetic(canvas, text, fkey, size, x, y, t, color=WHITE, stagger=0.04, dur=0.35, tracking=0.0,
            style='rise', mode='over', alpha=1.0, seed=0):
    """animated per-char entrance; t in seconds since start"""
    chars, tw = char_layout(text, fkey, size, tracking)
    r = np.random.default_rng(seed)
    n = len(chars)
    for i, (ch, cx) in enumerate(chars):
        if ch == ' ':
            continue
        k = (t - i * stagger) / dur
        if k <= 0:
            continue
        e = e_out5(k)
        if style == 'rise':
            draw_text(canvas, ch, fkey, size, x + cx, y + (1 - e) * size * 0.6, color, alpha * clamp01(k * 2.5), 'mm',
                      scale=1.0, mode=mode)
        elif style == 'slam':
            sc = 1 + (1 - e_out3(k)) * 1.2
            draw_text(canvas, ch, fkey, size, x + cx, y, color, alpha * clamp01(k * 4), 'mm', scale=sc, mode=mode)
        elif style == 'scramble':
            if k < 1:
                glyph = chr(int(r.integers(65, 91))) if r.random() < 0.8 else r.choice(list('#%&@$*<>/\\01'))
                draw_text(canvas, glyph, fkey, size, x + cx, y, mixc(color, CYAN, 0.6), alpha * 0.9, 'mm', mode=mode)
            else:
                draw_text(canvas, ch, fkey, size, x + cx, y, color, alpha, 'mm', mode=mode)
        elif style == 'spin':
            draw_text(canvas, ch, fkey, size, x + cx, y, color, alpha * clamp01(k * 3), 'mm',
                      sx=1.0, sy=max(0.05, e), rot=(1 - e) * 30, mode=mode)
    return tw


# ------------------------------------------------------------------ backgrounds
_yy, _xx = np.mgrid[0:H, 0:W].astype(np.float32)
_R = np.sqrt(((_xx - W / 2) / (W / 2)) ** 2 + ((_yy - H / 2) / (H / 2)) ** 2)
VIGNETTE = np.clip(1.08 - 0.42 * _R ** 2.2, 0.25, 1.0)[..., None].astype(np.float32)


def make_bg(c1=(0.020, 0.030, 0.065), c0=(0.004, 0.005, 0.012), cx=0.5, cy=0.45, rad=1.1):
    r = np.sqrt(((_xx - W * cx) / (W * 0.5)) ** 2 + ((_yy - H * cy) / (H * 0.5)) ** 2) / rad
    t = np.clip(1 - r, 0, 1) ** 1.6
    bg = np.asarray(c0, np.float32) + t[..., None] * (np.asarray(c1, np.float32) - np.asarray(c0, np.float32))
    return bg.astype(np.float32)


BG_MAIN = make_bg()
BG_WARM = make_bg((0.06, 0.025, 0.03), (0.006, 0.004, 0.006))
BG_VIOLET = make_bg((0.04, 0.02, 0.08), (0.004, 0.003, 0.01))
BG_TEAL = make_bg((0.0, 0.05, 0.06), (0.002, 0.006, 0.008))


def dot_grid(canvas, spacing=48, color=(0.12, 0.16, 0.24), alpha=1.0, offset=(0, 0), r=1):
    ox, oy = offset
    xs = np.arange((ox % spacing), W, spacing).astype(int)
    ys = np.arange((oy % spacing), H, spacing).astype(int)
    c = np.asarray(color, np.float32) * alpha
    for dy in range(-r + 1, r):
        for dx in range(-r + 1, r):
            yy = np.clip(ys + dy, 0, H - 1); xx = np.clip(xs + dx, 0, W - 1)
            canvas[np.ix_(yy, xx)] += c
    if r == 1:
        canvas[np.ix_(ys, xs)] += c


def line_grid(canvas, spacing=96, color=(0.05, 0.07, 0.11), offset=(0, 0), thick=1):
    ox, oy = offset
    c = np.asarray(color, np.float32)
    for x in np.arange(ox % spacing, W, spacing).astype(int):
        canvas[:, x:x + thick] += c
    for y in np.arange(oy % spacing, H, spacing).astype(int):
        canvas[y:y + thick, :] += c


# ------------------------------------------------------------------ 3D
def rx(a):
    c, s = math.cos(a), math.sin(a); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], np.float32)


def ry(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]], np.float32)


def rz(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], np.float32)


class Cam:
    def __init__(self, pos, target=(0, 0, 0), fov=50, up=(0, 1, 0), roll=0.0, cx=W / 2, cy=H / 2):
        self.pos = np.asarray(pos, np.float32)
        tg = np.asarray(target, np.float32)
        f = tg - self.pos; f /= np.linalg.norm(f)
        u = np.asarray(up, np.float32)
        r = np.cross(u, f); r /= np.linalg.norm(r)
        u = np.cross(f, r)
        if roll:
            c, s = math.cos(roll), math.sin(roll)
            r, u = r * c + u * s, -r * s + u * c
        self.R = np.stack([r, -u, f])  # camera space: x right, y down, z forward
        self.f = (H / 2) / math.tan(math.radians(fov) / 2)
        self.cx, self.cy = cx, cy

    def project(self, P):
        Pc = (np.asarray(P, np.float32) - self.pos) @ self.R.T
        z = Pc[:, 2]
        zs = np.maximum(z, 1e-3)
        x = self.cx + self.f * Pc[:, 0] / zs
        y = self.cy + self.f * Pc[:, 1] / zs
        return np.stack([x, y], 1), z


def orbit(radius, az, el, target=(0, 0, 0)):
    t = np.asarray(target, np.float32)
    return t + radius * np.array([math.sin(az) * math.cos(el), math.sin(el), -math.cos(az) * math.cos(el)], np.float32)


def splat(canvas, xy, color, w=None, sigma=0.0, z=None, soft=0.85, gain=2.2):
    """additive bilinear point splat, softened with a small gaussian inside the points' bbox"""
    xy = np.asarray(xy, np.float32)
    n = len(xy)
    if n == 0:
        return
    col_ = np.asarray(color, np.float32)
    if col_.ndim == 1:
        col_ = np.broadcast_to(col_, (n, 3))
    if w is not None:
        col_ = col_ * np.asarray(w, np.float32)[:, None]
    m = (xy[:, 0] >= 1) & (xy[:, 0] < W - 2) & (xy[:, 1] >= 1) & (xy[:, 1] < H - 2)
    if z is not None:
        m &= np.asarray(z) > 0.05
    xy = xy[m]; col_ = col_[m]
    if len(xy) == 0:
        return
    pad = 6
    bx0 = max(0, int(xy[:, 0].min()) - pad); by0 = max(0, int(xy[:, 1].min()) - pad)
    bx1 = min(W, int(xy[:, 0].max()) + pad + 2); by1 = min(H, int(xy[:, 1].max()) + pad + 2)
    lw, lh = bx1 - bx0, by1 - by0
    layer = np.zeros((lh, lw, 3), np.float32)
    x0 = np.floor(xy[:, 0]).astype(np.int32); y0 = np.floor(xy[:, 1]).astype(np.int32)
    fx = xy[:, 0] - x0; fy = xy[:, 1] - y0
    x0 -= bx0; y0 -= by0
    flat = layer.reshape(-1, 3)
    for dx, dy, wt in ((0, 0, (1 - fx) * (1 - fy)), (1, 0, fx * (1 - fy)), (0, 1, (1 - fx) * fy), (1, 1, fx * fy)):
        idx = (y0 + dy) * lw + (x0 + dx)
        for c in range(3):
            flat[:, c] += np.bincount(idx, weights=col_[:, c] * wt, minlength=lw * lh)[:lw * lh].astype(np.float32)
    if sigma > 0:
        layer = cv2.GaussianBlur(layer, (0, 0), sigma) * (2 * math.pi * sigma * sigma) ** 0.5
    elif soft > 0:
        layer = cv2.GaussianBlur(layer, (5, 5), soft) * gain
    canvas[by0:by1, bx0:bx1] += layer


def dots(canvas, xy, radii, colors, alpha=1.0, mode='add'):
    """draw anti-aliased discs (for < few thousand points)"""
    layer = np.zeros_like(canvas) if mode == 'add' else canvas
    xy = np.asarray(xy); radii = np.broadcast_to(np.asarray(radii, np.float32), (len(xy),))
    colors = np.asarray(colors, np.float32)
    if colors.ndim == 1:
        colors = np.broadcast_to(colors, (len(xy), 3))
    for (x, y), r, c in zip(xy, radii, colors):
        if -20 < x < W + 20 and -20 < y < H + 20 and r > 0.2:
            cv2.circle(layer, (int(x * 16), int(y * 16)), max(1, int(r * 16)), tuple(float(v * alpha) for v in c), -1,
                       cv2.LINE_AA, 4)
    if mode == 'add':
        canvas += layer


def _bbox(pts, pad=8):
    pts = np.asarray(pts, np.float64).reshape(-1, 2)
    pts = pts[np.isfinite(pts).all(1)]
    if len(pts) == 0:
        return None
    x0 = int(max(0, np.floor(pts[:, 0].min()) - pad)); y0 = int(max(0, np.floor(pts[:, 1].min()) - pad))
    x1 = int(min(W, np.ceil(pts[:, 0].max()) + pad)); y1 = int(min(H, np.ceil(pts[:, 1].max()) + pad))
    if x1 <= x0 or y1 <= y0:
        return None
    return x0, y0, x1, y1


def lines(canvas, P1, P2, colors, thick=1, alpha=1.0, mode='add', layer=None):
    P1 = np.asarray(P1, np.float64); P2 = np.asarray(P2, np.float64)
    if len(P1) == 0:
        return
    colors = np.asarray(colors, np.float32)
    if colors.ndim == 1:
        colors = np.broadcast_to(colors, (len(P1), 3))
    th = np.broadcast_to(np.asarray(thick), (len(P1),))
    ok = (np.abs(P1) < 1e5).all(1) & (np.abs(P2) < 1e5).all(1)
    P1, P2, colors, th = P1[ok], P2[ok], colors[ok], th[ok]
    if len(P1) == 0:
        return
    bb = _bbox(np.concatenate([P1, P2]), 8 + int(th.max()))
    if bb is None:
        return
    x0, y0, x1, y1 = bb
    L = np.zeros((y1 - y0, x1 - x0, 3), np.float32)
    off = np.array([x0, y0])
    A = ((P1 - off) * 16).astype(np.int64); B = ((P2 - off) * 16).astype(np.int64)
    for a, b, c, t in zip(A, B, colors, th):
        cv2.line(L, (int(a[0]), int(a[1])), (int(b[0]), int(b[1])), tuple(float(v * alpha) for v in c), int(max(1, t)),
                 cv2.LINE_AA, 4)
    canvas[y0:y1, x0:x1] += L


def polyline(canvas, pts, color, thick=2, alpha=1.0, closed=False, mode='add'):
    pts = np.asarray(pts, np.float64)
    if len(pts) < 2:
        return
    bb = _bbox(pts, 8 + int(thick))
    if bb is None:
        return
    x0, y0, x1, y1 = bb
    L = np.zeros((y1 - y0, x1 - x0, 3), np.float32)
    cv2.polylines(L, [((pts - [x0, y0]) * 16).astype(np.int32)], closed, tuple(float(v * alpha) for v in color),
                  int(thick), cv2.LINE_AA, 4)
    canvas[y0:y1, x0:x1] += L


def rect(canvas, x0, y0, x1, y1, color, alpha=1.0, mode='over', thick=-1):
    x0, y0, x1, y1 = int(round(x0)), int(round(y0)), int(round(x1)), int(round(y1))
    if thick < 0:
        X0, Y0, X1, Y1 = max(0, min(x0, x1)), max(0, min(y0, y1)), min(W, max(x0, x1)), min(H, max(y0, y1))
        if X1 <= X0 or Y1 <= Y0:
            return
        reg = canvas[Y0:Y1, X0:X1]
        c = np.asarray(color, np.float32)
        if mode == 'add':
            reg += c * alpha
        else:
            reg *= (1 - alpha); reg += c * alpha
    else:
        if mode == 'add':
            L = np.zeros_like(canvas)
            cv2.rectangle(L, (x0, y0), (x1, y1), tuple(float(v * alpha) for v in color), thick, cv2.LINE_AA)
            canvas += L
        else:
            cv2.rectangle(canvas, (x0, y0), (x1, y1), tuple(float(v) for v in color), thick, cv2.LINE_AA)


def rrect_mask(w, h, r):
    m = np.zeros((h, w), np.float32)
    r = int(min(r, w // 2, h // 2))
    cv2.rectangle(m, (r, 0), (w - r - 1, h - 1), 1.0, -1)
    cv2.rectangle(m, (0, r), (w - 1, h - r - 1), 1.0, -1)
    for cx, cy in ((r, r), (w - r - 1, r), (r, h - r - 1), (w - r - 1, h - r - 1)):
        cv2.circle(m, (cx, cy), r, 1.0, -1, cv2.LINE_AA)
    return m


def rrect(canvas, x0, y0, w, h, r, color, alpha=1.0, mode='over'):
    if w < 2 or h < 2:
        return
    blend(canvas, rrect_mask(int(w), int(h), r), int(x0), int(y0), color, alpha, mode)


def rrect_outline(canvas, x0, y0, w, h, r, color, thick=2, alpha=1.0, mode='add'):
    if w < 4 or h < 4:
        return
    m = rrect_mask(int(w), int(h), r)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * thick + 1, 2 * thick + 1))
    o = m - cv2.erode(m, k)
    blend(canvas, o, int(x0), int(y0), color, alpha, mode)


# ------------------------------------------------------------------ post
def bloom(canvas, thr=0.55, strength=0.9):
    small = cv2.resize(canvas, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    b = np.maximum(small - thr, 0)
    b1 = cv2.GaussianBlur(b, (0, 0), 2.5)
    s2 = cv2.resize(b, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    b2 = cv2.GaussianBlur(s2, (0, 0), 5)
    b2 = cv2.resize(b2, (W // 4, H // 4), interpolation=cv2.INTER_LINEAR)
    s3 = cv2.resize(b, (W // 16, H // 16), interpolation=cv2.INTER_AREA)
    b3 = cv2.GaussianBlur(s3, (0, 0), 6)
    b3 = cv2.resize(b3, (W // 4, H // 4), interpolation=cv2.INTER_LINEAR)
    comb = b1 * 0.9 + b2 * 0.9 + b3 * 1.0
    canvas += cv2.resize(comb, (W, H), interpolation=cv2.INTER_LINEAR) * strength


def tonemap(c):
    k = 0.78
    over = c > k
    if over.any():
        c[over] = k + (1 - k) * np.tanh((c[over] - k) / (1 - k))
    return c


_grain = [np.random.default_rng(i).normal(0, 1, (H // 2, W // 2)).astype(np.float32) for i in range(6)]
GRAIN = [cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)[..., None] for g in _grain]


def glitch_slices(canvas, amount, seed, n=10):
    r = np.random.default_rng(seed)
    for _ in range(n):
        y = int(r.integers(0, H - 20)); h = int(r.integers(6, 80))
        sh = int(r.normal(0, amount))
        canvas[y:y + h] = np.roll(canvas[y:y + h], sh, axis=1)
        if r.random() < 0.3:
            ch = int(r.integers(0, 3))
            canvas[y:y + h, :, ch] = np.roll(canvas[y:y + h, :, ch], int(sh * 0.6), axis=1)


def chroma(canvas, px):
    if px < 0.5:
        return canvas
    s = 1 + px / (W / 2)
    out = canvas.copy()
    for ch, sc in ((0, s), (2, 1 / s)):
        M = np.float32([[sc, 0, (1 - sc) * W / 2], [0, sc, (1 - sc) * H / 2]])
        out[..., ch] = cv2.warpAffine(canvas[..., ch], M, (W, H), borderMode=cv2.BORDER_REFLECT101)
    return out


def zoom_frame(canvas, scale, dx=0.0, dy=0.0, rot=0.0):
    if abs(scale - 1) < 1e-4 and abs(dx) < 0.05 and abs(dy) < 0.05 and abs(rot) < 1e-4:
        return canvas
    M = cv2.getRotationMatrix2D((W / 2, H / 2), rot, scale)
    M[0, 2] += dx; M[1, 2] += dy
    return cv2.warpAffine(canvas, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT101)


def radial_blur(canvas, amount, steps=5):
    if amount < 0.002:
        return canvas
    acc = canvas.copy()
    for i in range(1, steps + 1):
        s = 1 + amount * i / steps
        acc += zoom_frame(canvas, s)
    return acc / (steps + 1)


# ------------------------------------------------------------------ misc geometry helpers
def fib_sphere(n, r=1.0):
    i = np.arange(n) + 0.5
    phi = np.arccos(1 - 2 * i / n)
    th = np.pi * (1 + 5 ** 0.5) * i
    return np.stack([np.cos(th) * np.sin(phi), np.cos(phi), np.sin(th) * np.sin(phi)], 1).astype(np.float32) * r


def depth_fade(z, near, far):
    return np.clip(1 - (z - near) / (far - near), 0.05, 1.0)
