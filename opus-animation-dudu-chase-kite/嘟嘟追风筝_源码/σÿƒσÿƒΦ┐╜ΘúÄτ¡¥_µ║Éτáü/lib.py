# Drawing library for the "嘟嘟追风筝" animation (original character)
import cairo, math

W, H = 1920, 1080
FPS = 30
SC = W / 1280.0
OL = (0.30, 0.12, 0.20)
FONT = "Noto Sans CJK SC"
PI = math.pi
TAU = 2 * math.pi

PINK = (1.0, 0.76, 0.80)
PINK2 = (0.97, 0.56, 0.66)
BLUE = (0.25, 0.50, 0.92)
BLUE2 = (0.18, 0.38, 0.78)
ORANGE = (1.0, 0.56, 0.12)
YEL = (1.0, 0.86, 0.25)
RED = (0.93, 0.26, 0.26)
WHITE = (1, 1, 1)


# ---------- math ----------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def lerp(a, b, t):
    return a + (b - a) * t


def lerpc(c1, c2, t):
    return tuple(lerp(a, b, t) for a, b in zip(c1, c2))


def prog(t, a, b):
    return clamp((t - a) / (b - a))


def eob(x, s=1.9):  # ease out back
    x = clamp(x) - 1
    return x * x * ((s + 1) * x + s) + 1


def eoc(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def eic(x):
    x = clamp(x)
    return x ** 3


def eio(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def eel(x):  # ease out elastic
    x = clamp(x)
    if x in (0, 1):
        return x
    return 2 ** (-10 * x) * math.sin((x * 10 - 0.75) * TAU / 3) + 1


def hsh(i, k=0):
    v = math.sin(i * 127.1 + k * 311.7) * 43758.5453
    return v - math.floor(v)


def pop_scale(t, t0, t1=None, dur=0.35, out=0.2):
    """scale that pops in at t0 and (optionally) shrinks out ending at t1"""
    s = eob(prog(t, t0, t0 + dur), 2.6)
    if t1 is not None:
        s *= 1 - eic(prog(t, t1 - out, t1))
    return s


# ---------- primitives ----------
def rgb(cr, c, a=1.0):
    cr.set_source_rgba(c[0], c[1], c[2], a)


def ellipse(cr, x, y, rx, ry):
    cr.save()
    cr.translate(x, y)
    cr.scale(max(rx, 1e-3), max(ry, 1e-3))
    cr.new_sub_path()
    cr.arc(0, 0, 1, 0, TAU)
    cr.restore()


def fs(cr, fill, lw=4, ol=OL, a=1.0):
    rgb(cr, fill, a)
    cr.fill_preserve()
    rgb(cr, ol, a)
    cr.set_line_width(lw)
    cr.set_line_join(cairo.LINE_JOIN_ROUND)
    cr.stroke()


def rrect(cr, x, y, w, h, r):
    r = min(r, w / 2, h / 2)
    cr.new_sub_path()
    cr.arc(x + w - r, y + r, r, -PI / 2, 0)
    cr.arc(x + w - r, y + h - r, r, 0, PI / 2)
    cr.arc(x + r, y + h - r, r, PI / 2, PI)
    cr.arc(x + r, y + r, r, PI, 1.5 * PI)
    cr.close_path()


def smooth_path(cr, pts, move=True):
    if move:
        cr.move_to(*pts[0])
    n = len(pts)
    for i in range(n - 1):
        p0 = pts[max(i - 1, 0)]
        p1 = pts[i]
        p2 = pts[i + 1]
        p3 = pts[min(i + 2, n - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        cr.curve_to(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])


def star_path(cr, x, y, R, r, n=5, rot=-PI / 2, jitter=0, seed=0):
    for i in range(2 * n):
        a = rot + i * PI / n
        rr = R if i % 2 == 0 else r
        if jitter:
            rr *= 1 + (hsh(i, seed) - 0.5) * jitter
        px, py = x + rr * math.cos(a), y + rr * math.sin(a)
        if i == 0:
            cr.move_to(px, py)
        else:
            cr.line_to(px, py)
    cr.close_path()


def limb(cr, x1, y1, x2, y2, w, col):
    cr.set_line_cap(cairo.LINE_CAP_ROUND)
    cr.move_to(x1, y1)
    cr.line_to(x2, y2)
    rgb(cr, OL)
    cr.set_line_width(w + 8)
    cr.stroke()
    cr.move_to(x1, y1)
    cr.line_to(x2, y2)
    rgb(cr, col)
    cr.set_line_width(w)
    cr.stroke()


def apply_cam(cr, cx=640, cy=360, zoom=1.0, rot=0.0, shx=0.0, shy=0.0, par=1.0):
    ecx = 640 + (cx - 640) * par
    ecy = 360 + (cy - 360) * par
    cr.translate(640 + shx * par, 360 + shy * par)
    cr.rotate(rot)
    z = 1 + (zoom - 1) * par
    cr.scale(z, z)
    cr.translate(-ecx, -ecy)


def shake(t, amp):
    return (amp * (math.sin(t * 83.1) * 0.6 + math.sin(t * 47.3 + 1.3) * 0.4),
            amp * (math.sin(t * 71.7 + 2.1) * 0.6 + math.sin(t * 39.1 + 0.4) * 0.4))


# ---------- text ----------
def text(cr, s, x, y, size, fill=WHITE, ol=OL, scale=1.0, rot=0.0, alpha=1.0,
         ring=None, shadow=True, weight=cairo.FONT_WEIGHT_BOLD):
    if scale <= 0.01 or alpha <= 0.01:
        return
    cr.save()
    cr.translate(x, y)
    cr.rotate(rot)
    cr.scale(scale, scale)
    cr.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, weight)
    cr.set_font_size(size)
    xb, yb, w, h, xa, ya = cr.text_extents(s)
    ox, oy = -xb - w / 2, -yb - h / 2
    olw = size * 0.14
    cr.set_line_join(cairo.LINE_JOIN_ROUND)
    if shadow:
        cr.move_to(ox + size * 0.04, oy + size * 0.07)
        cr.text_path(s)
        cr.set_source_rgba(0, 0, 0, 0.22 * alpha)
        cr.set_line_width(olw * (2.3 if ring else 1.2))
        cr.stroke_preserve()
        cr.fill()
    cr.move_to(ox, oy)
    cr.text_path(s)
    if ring:
        rgb(cr, ring, alpha)
        cr.set_line_width(olw * 2.3)
        cr.stroke_preserve()
    rgb(cr, ol, alpha)
    cr.set_line_width(olw)
    cr.stroke_preserve()
    rgb(cr, fill, alpha)
    cr.fill()
    cr.restore()


def bubble(cr, s, x, y, size, sc, tail=(-50, 70), fill=WHITE, tcol=OL):
    if sc <= 0.01:
        return
    cr.save()
    cr.translate(x, y)
    cr.scale(sc, sc)
    cr.select_font_face(FONT, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    cr.set_font_size(size)
    xb, yb, w, h, xa, ya = cr.text_extents(s)
    pw, ph = w + size * 1.2, h + size * 0.9
    # tail
    tx, ty = tail
    cr.move_to(-pw * 0.12, ph * 0.3)
    cr.line_to(tx, ty)
    cr.line_to(pw * 0.1, ph * 0.3)
    cr.close_path()
    rrect(cr, -pw / 2, -ph / 2, pw, ph, ph / 2)
    cr.set_source_rgba(0, 0, 0, 0.15)
    cr.save()
    cr.translate(4, 6)
    cr.restore()
    rgb(cr, OL)
    cr.set_line_width(9)
    cr.set_line_join(cairo.LINE_JOIN_ROUND)
    cr.stroke_preserve()
    rgb(cr, fill)
    cr.fill()
    cr.move_to(-xb - w / 2, -yb - h / 2)
    rgb(cr, tcol)
    cr.show_text(s)
    cr.restore()


# ---------- scenery ----------
def sky(cr, stops):
    g = cairo.LinearGradient(0, 0, 0, 720)
    for off, c in stops:
        g.add_color_stop_rgb(off, *c)
    cr.set_source(g)
    cr.rectangle(-50, -50, 1380, 820)
    cr.fill()


def cloud(cr, x, y, s=1.0, col=WHITE, shade=(0.82, 0.89, 0.98), a=1.0):
    puffs = [(0, 0, 1), (0.95, 0.25, 0.75), (-0.95, 0.25, 0.7), (0.45, -0.4, 0.8),
             (-0.4, -0.3, 0.72), (1.7, 0.45, 0.5), (-1.7, 0.45, 0.45)]
    R = 42 * s
    for dy, c in ((9 * s, shade), (0, col)):
        for px, py, pr in puffs:
            cr.new_sub_path()
            cr.arc(x + px * R, y + py * R + dy, pr * R, 0, TAU)
        rgb(cr, c, a)
        cr.fill()


def sun(cr, x, y, r, t, col=(1, 0.85, 0.3), ray=(1, 0.95, 0.6), rays=True, glow=0.5):
    g = cairo.RadialGradient(x, y, r * 0.5, x, y, r * 3)
    g.add_color_stop_rgba(0, col[0], col[1], col[2], glow)
    g.add_color_stop_rgba(1, col[0], col[1], col[2], 0)
    cr.set_source(g)
    cr.arc(x, y, r * 3, 0, TAU)
    cr.fill()
    if rays:
        for i in range(12):
            a = t * 0.6 + i * TAU / 12
            cr.move_to(x + math.cos(a - 0.1) * r * 1.2, y + math.sin(a - 0.1) * r * 1.2)
            cr.line_to(x + math.cos(a) * r * 1.75, y + math.sin(a) * r * 1.75)
            cr.line_to(x + math.cos(a + 0.1) * r * 1.2, y + math.sin(a + 0.1) * r * 1.2)
            cr.close_path()
        rgb(cr, ray, 0.8)
        cr.fill()
    cr.arc(x, y, r, 0, TAU)
    rgb(cr, col)
    cr.fill()


def hill_layer(cr, off, base, amp, wl, col, seed, olw=0, x0=-600, x1=1900, bottom=1600, step=50):
    pts = []
    k0 = math.floor((x0 + off) / step)
    k1 = math.ceil((x1 + off) / step)
    for k in range(k0, k1 + 1):
        xw = k * step
        n = (0.55 * math.sin(xw / wl * TAU + seed) + 0.3 * math.sin(xw / (wl * 0.47) * TAU + seed * 1.7)
             + 0.15 * math.sin(xw / (wl * 0.23) * TAU + seed * 3.1))
        pts.append((xw - off, base - amp * (0.5 + 0.5 * n)))
    smooth_path(cr, pts)
    cr.line_to(pts[-1][0], bottom)
    cr.line_to(pts[0][0], bottom)
    cr.close_path()
    if olw:
        fs(cr, col, olw)
    else:
        rgb(cr, col)
        cr.fill()


def tree(cr, x, y, s, sway=0.0, col=(0.30, 0.68, 0.33)):
    cr.rectangle(x - 9 * s, y - 95 * s, 18 * s, 95 * s)
    fs(cr, (0.56, 0.36, 0.2), 3)
    fx, fy = x + sway * 40 * s, y - 125 * s
    blobs = [(0, 0, 52), (-40, 14, 38), (40, 14, 38), (-20, -38, 40), (22, -36, 40)]
    for bx, by, br in blobs:
        cr.new_sub_path()
        cr.arc(fx + bx * s, fy + by * s, br * s, 0, TAU)
    rgb(cr, OL)
    cr.set_line_width(8)
    cr.stroke_preserve()
    rgb(cr, col)
    cr.fill()
    cr.arc(fx - 16 * s, fy - 30 * s, 16 * s, 0, TAU)
    rgb(cr, (1, 1, 1), 0.25)
    cr.fill()


def tree_layer(cr, off, spacing, y, smin, smax, seed, t, sway=0.05, cols=None):
    cols = cols or [(0.30, 0.68, 0.33), (0.36, 0.74, 0.30), (0.25, 0.60, 0.36)]
    k0 = math.floor((off - 400) / spacing)
    k1 = math.floor((off + 1700) / spacing)
    for k in range(k0, k1 + 1):
        if hsh(k, seed) < 0.22:
            continue
        x = k * spacing - off + (hsh(k, seed + 1) - 0.5) * spacing * 0.5
        s = lerp(smin, smax, hsh(k, seed + 2))
        tree(cr, x, y, s, sway * math.sin(t * 2 + k), cols[k % len(cols)])


def flower(cr, x, y, s, col, t=0):
    cr.move_to(x, y)
    cr.line_to(x, y - 22 * s)
    rgb(cr, (0.2, 0.5, 0.2))
    cr.set_line_width(3)
    cr.stroke()
    cx, cy = x, y - 22 * s
    for i in range(5):
        a = i * TAU / 5 + t
        cr.new_sub_path()
        cr.arc(cx + math.cos(a) * 7 * s, cy + math.sin(a) * 7 * s, 5.5 * s, 0, TAU)
    rgb(cr, col)
    cr.fill()
    cr.arc(cx, cy, 4 * s, 0, TAU)
    rgb(cr, YEL)
    cr.fill()


def tuft(cr, x, y, s=1.0, col=(0.22, 0.5, 0.2)):
    cr.move_to(x - 8 * s, y)
    cr.line_to(x - 10 * s, y - 12 * s)
    cr.move_to(x, y)
    cr.line_to(x, y - 16 * s)
    cr.move_to(x + 8 * s, y)
    cr.line_to(x + 11 * s, y - 11 * s)
    rgb(cr, col)
    cr.set_line_width(3)
    cr.set_line_cap(cairo.LINE_CAP_ROUND)
    cr.stroke()


def sparkle(cr, x, y, r, rot=0.0, col=WHITE, a=1.0):
    if r <= 0.5:
        return
    star_path(cr, x, y, r, r * 0.28, 4, rot)
    rgb(cr, col, a)
    cr.fill()


def heart(cr, x, y, s, col=(1, 0.35, 0.5), a=1.0):
    cr.move_to(x, y + s * 0.9)
    cr.curve_to(x - s * 1.5, y - s * 0.1, x - s * 0.7, y - s * 1.3, x, y - s * 0.45)
    cr.curve_to(x + s * 0.7, y - s * 1.3, x + s * 1.5, y - s * 0.1, x, y + s * 0.9)
    cr.close_path()
    rgb(cr, col, a)
    cr.fill_preserve()
    rgb(cr, OL, a)
    cr.set_line_width(3)
    cr.stroke()


def bird(cr, x, y, s, flap):
    f = math.sin(flap)
    cr.move_to(x - 14 * s, y - 4 * s * f)
    cr.curve_to(x - 9 * s, y - 8 * s * f, x - 4 * s, y - 3 * s, x, y)
    cr.curve_to(x + 4 * s, y - 3 * s, x + 9 * s, y - 8 * s * f, x + 14 * s, y - 4 * s * f)
    rgb(cr, (0.25, 0.12, 0.25))
    cr.set_line_width(3 * s)
    cr.set_line_cap(cairo.LINE_CAP_ROUND)
    cr.stroke()


def burst(cr, x, y, R, col=YEL, t=0, a=1.0, n=14):
    star_path(cr, x, y, R, R * 0.68, n, t * 2, jitter=0.35, seed=int(t * 12))
    rgb(cr, col, a)
    cr.fill_preserve()
    rgb(cr, OL, a)
    cr.set_line_width(6)
    cr.stroke()


def speed_lines(cr, t, n=20, alpha=0.6, vertical=False, col=WHITE):
    cr.set_line_cap(cairo.LINE_CAP_ROUND)
    for i in range(n):
        p = hsh(i, 1)
        L = 120 + hsh(i, 2) * 280
        spd = 2600 + hsh(i, 3) * 1600
        span = 3200
        q = (t * spd + hsh(i, 4) * span) % span
        cr.set_line_width(2 + hsh(i, 5) * 5)
        rgb(cr, col, alpha)
        if not vertical:
            y = p * 720
            x = 1500 - q
            cr.move_to(x, y)
            cr.line_to(x + L, y)
        else:
            x = p * 1280
            y = -300 + q
            cr.move_to(x, y)
            cr.line_to(x, y - L)
        cr.stroke()


def conc_lines(cr, t, cx, cy, alpha, col=(0.25, 0.1, 0.25)):
    seed = int(t * 15)
    for i in range(70):
        a = i / 70 * TAU + hsh(i, seed) * 0.07
        w = 0.01 + hsh(i, seed + 1) * 0.022
        r0 = 300 + hsh(i, seed + 2) * 140
        r1 = 1500
        cr.move_to(cx + math.cos(a - w) * r1, cy + math.sin(a - w) * r1)
        cr.line_to(cx + math.cos(a) * r0, cy + math.sin(a) * r0)
        cr.line_to(cx + math.cos(a + w) * r1, cy + math.sin(a + w) * r1)
        cr.close_path()
    rgb(cr, col, alpha)
    cr.fill()


def lightbulb(cr, x, y, s, t, a=1.0):
    if s <= 0.01:
        return
    cr.save()
    cr.translate(x, y)
    cr.scale(s, s)
    for i in range(8):
        ang = i * TAU / 8 + t * 1.5
        cr.move_to(math.cos(ang) * 36, math.sin(ang) * 36 - 6)
        cr.line_to(math.cos(ang) * 50, math.sin(ang) * 50 - 6)
    rgb(cr, (1, 0.8, 0.1), a)
    cr.set_line_width(5)
    cr.set_line_cap(cairo.LINE_CAP_ROUND)
    cr.stroke()
    cr.arc(0, -6, 24, 0, TAU)
    fs(cr, (1, 0.93, 0.35), 4, a=a)
    cr.rectangle(-11, 16, 22, 14)
    fs(cr, (0.6, 0.6, 0.65), 3, a=a)
    cr.arc(-7, -13, 6, 0, TAU)
    rgb(cr, WHITE, 0.8 * a)
    cr.fill()
    cr.restore()


def iris(cr, cx, cy, r, col=(0.10, 0.08, 0.2)):
    cr.save()
    cr.identity_matrix()
    cr.scale(SC, SC)
    cr.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
    cr.rectangle(-100, -100, 1480, 920)
    cr.new_sub_path()
    cr.arc(cx, cy, max(r, 0.01), 0, TAU)
    rgb(cr, col)
    cr.fill()
    if r > 1:
        cr.arc(cx, cy, r, 0, TAU)
        rgb(cr, (1, 0.55, 0.7))
        cr.set_line_width(8)
        cr.stroke()
    cr.restore()


def band_wipe(cr, p):
    if p <= 0 or p >= 1:
        return
    cols = [PINK2, ORANGE, YEL, BLUE]
    for i, c in enumerate(cols):
        q = clamp(p * 1.6 - (3 - i) * 0.1 + 0.0)
        q = clamp(p * 1.6 - i * 0.1)
        X = -350 + (eio(q) - 0.5) * 2 * 2800
        cr.move_to(X, 820)
        cr.line_to(X + 400, -100)
        cr.line_to(X + 2400, -100)
        cr.line_to(X + 2000, 820)
        cr.close_path()
        rgb(cr, c)
        cr.fill_preserve()
        rgb(cr, OL)
        cr.set_line_width(6)
        cr.stroke()
    # star icon riding on the top band
    q3 = clamp(p * 1.6 - 0.3)
    X = -350 + (eio(q3) - 0.5) * 2 * 2800
    sx = X + 1100
    if -100 < sx < 1400:
        star_path(cr, sx, 360, 90, 42, 5, -PI / 2 + p * 6)
        rgb(cr, WHITE)
        cr.fill()


def vignette(cr):
    g = cairo.RadialGradient(640, 360, 380, 640, 360, 820)
    g.add_color_stop_rgba(0, 0, 0, 0, 0)
    g.add_color_stop_rgba(1, 0.1, 0, 0.1, 0.30)
    cr.set_source(g)
    cr.rectangle(0, 0, 1280, 720)
    cr.fill()


# ---------- characters ----------
def draw_kite(cr, x, y, s, rot, t, face="happy", tail_ang=PI * 0.62, wave=1.0, tail_len=1.0):
    if s <= 0.01:
        return (x, y)
    ca, sa = math.cos(rot), math.sin(rot)
    bx, by = x + (-sa) * 40 * s, y + ca * 40 * s  # bottom point in world
    pts = [(bx, by)]
    dx, dy = math.cos(tail_ang), math.sin(tail_ang)
    for i in range(1, 16):
        d = i * 13 * s * tail_len
        wv = math.sin(t * 9 - i * 0.65) * i * 1.3 * s * wave
        pts.append((bx + dx * d - dy * wv, by + dy * d + dx * wv))
    smooth_path(cr, pts)
    rgb(cr, OL)
    cr.set_line_width(3)
    cr.stroke()
    for j, i in enumerate(range(3, 16, 3)):
        px, py = pts[i]
        cc = RED if j % 2 == 0 else BLUE
        bs = 9 * s
        a = math.atan2(dy, dx) + PI / 2 + math.sin(t * 7 + i) * 0.4
        cr.save()
        cr.translate(px, py)
        cr.rotate(a)
        cr.move_to(0, 0)
        cr.line_to(-bs, -bs * 0.7)
        cr.line_to(-bs, bs * 0.7)
        cr.close_path()
        cr.move_to(0, 0)
        cr.line_to(bs, -bs * 0.7)
        cr.line_to(bs, bs * 0.7)
        cr.close_path()
        fs(cr, cc, 2.5)
        cr.restore()
    cr.save()
    cr.translate(x, y)
    cr.rotate(rot)
    cr.scale(s, s)
    star_path(cr, 0, 0, 50, 24, 5)
    rgb(cr, OL)
    cr.set_line_width(9)
    cr.set_line_join(cairo.LINE_JOIN_ROUND)
    cr.stroke_preserve()
    rgb(cr, YEL)
    cr.fill()
    star_path(cr, 0, 2, 38, 18, 5)
    rgb(cr, (1, 0.72, 0.2), 0.55)
    cr.fill()
    # face
    ey = -4
    if face in ("happy", "cheeky"):
        for ex in (-10, 10):
            if face == "cheeky" and ex > 0:
                cr.arc(ex, ey + 2, 5, PI, TAU)
                rgb(cr, OL)
                cr.set_line_width(3)
                cr.stroke()
            else:
                ellipse(cr, ex, ey, 4, 5.5)
                rgb(cr, OL)
                cr.fill()
                cr.arc(ex - 1.3, ey - 2, 1.5, 0, TAU)
                rgb(cr, WHITE)
                cr.fill()
        cr.arc(0, ey + 6, 6, 0.15 * PI, 0.85 * PI)
        rgb(cr, OL)
        cr.set_line_width(3)
        cr.stroke()
        if face == "cheeky":
            ellipse(cr, 2, ey + 13, 3.5, 4)
            rgb(cr, RED)
            cr.fill()
    else:  # scared
        for ex in (-10, 10):
            ellipse(cr, ex, ey, 5.5, 6.5)
            fs(cr, WHITE, 2)
            cr.arc(ex, ey + 1, 2.2, 0, TAU)
            rgb(cr, OL)
            cr.fill()
        cr.move_to(-7, ey + 12)
        for k in range(1, 8):
            cr.line_to(-7 + k * 2, ey + 12 + (2 if k % 2 else -1))
        rgb(cr, OL)
        cr.set_line_width(2.5)
        cr.stroke()
        # sweat
        cr.move_to(22, -18)
        cr.curve_to(16, -8, 20, -2, 24, -4)
        cr.curve_to(28, -6, 28, -12, 22, -18)
        fs(cr, (0.6, 0.85, 1), 2)
    for ex in (-17, 17):
        ellipse(cr, ex, ey + 7, 4, 2.5)
        rgb(cr, (1, 0.4, 0.4), 0.6)
        cr.fill()
    cr.restore()
    return (x, y)


def string(cr, x1, y1, x2, y2, sag=30):
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2 + sag
    for w, c in ((4.5, OL), (2, (0.98, 0.98, 0.95))):
        cr.move_to(x1, y1)
        cr.curve_to(lerp(x1, mx, 0.7), lerp(y1, my, 0.7), lerp(x2, mx, 0.7), lerp(y2, my, 0.7), x2, y2)
        rgb(cr, c)
        cr.set_line_width(w)
        cr.stroke()


def skateboard(cr, wheel):
    rrect(cr, -66, 0, 132, 13, 6)
    fs(cr, (0.95, 0.45, 0.2), 4)
    cr.rectangle(-50, 4, 100, 3)
    rgb(cr, YEL)
    cr.fill()
    for wx in (-40, 40):
        cr.arc(wx, 21, 9, 0, TAU)
        fs(cr, (0.3, 0.3, 0.38), 3)
        for k in range(3):
            a = wheel + k * TAU / 3
            cr.move_to(wx, 21)
            cr.line_to(wx + math.cos(a) * 7, 21 + math.sin(a) * 7)
        rgb(cr, (0.8, 0.8, 0.85))
        cr.set_line_width(2)
        cr.stroke()



def draw_pig(cr, x, y, s=1.0, t=0.0, rot=0.0, sx=1.0, sy=1.0, legs="stand", run=0.0,
             arms=(0.3, 0.3), expr="happy", look=0.0, gaze=(0, 0), wind=-1, wind_amp=0.2,
             ear=0.0, board=False, wheel=0.0, blink=True):
    out = {}
    cr.save()
    cr.translate(x, y)
    cr.rotate(rot)
    cr.scale(s * sx, s * sy)
    cr.set_line_join(cairo.LINE_JOIN_ROUND)
    cr.set_line_cap(cairo.LINE_CAP_ROUND)

    if board:
        skateboard(cr, wheel)

    bob = 0.0
    if legs == "run":
        bob = -abs(math.sin(run)) * 10
    elif legs == "crouch":
        bob = 8

    # tail
    tx, ty = -46, -44 + bob
    cr.move_to(tx, ty)
    for i in range(1, 22):
        a = i * 0.45 + t * 3
        r = 3 + i * 0.55
        cr.line_to(tx - 6 - i * 0.6 + math.cos(a) * r * 0.5, ty + math.sin(a) * r * 0.6)
    rgb(cr, OL)
    cr.set_line_width(10)
    cr.stroke_preserve()
    rgb(cr, PINK2)
    cr.set_line_width(5)
    cr.stroke()

    # legs
    hips = [(-20, -18 + bob), (20, -18 + bob)]
    feet = []
    for i, (hx, hy) in enumerate(hips):
        side = -1 if i == 0 else 1
        if legs == "run":
            a = math.sin(run + i * PI) * 0.85
            L = 26
            fx, fy = hx + math.sin(a) * L, hy + math.cos(a) * L - max(0, math.cos(run + i * PI)) * 6
        elif legs == "tuck":
            fx, fy = hx + side * 12, hy + 10
        elif legs == "crouch":
            fx, fy = hx + side * 16, -1
        elif legs == "dangle":
            a = math.sin(t * 6 + i * PI) * 0.4
            fx, fy = hx + math.sin(a) * 28, hy + math.cos(a) * 28
        else:
            fx, fy = hx + side * 2, 0
        limb(cr, hx, hy, fx, fy - 4, 15, PINK)
        ellipse(cr, fx, fy - 3, 11, 7)
        rgb(cr, (0.38, 0.2, 0.26))
        cr.fill()
        feet.append((fx, fy))

    # body
    ellipse(cr, 0, -62 + bob, 50, 56)
    rgb(cr, PINK)
    cr.fill()
    cr.save()
    ellipse(cr, 0, -62 + bob, 50, 56)
    cr.clip()
    cr.rectangle(-60, -70 + bob, 120, 80)
    rgb(cr, BLUE)
    cr.fill()
    rrect(cr, -14, -58 + bob, 28, 18, 5)
    rgb(cr, BLUE2)
    cr.fill()
    cr.move_to(-60, -70 + bob)
    cr.line_to(60, -70 + bob)
    rgb(cr, OL)
    cr.set_line_width(3)
    cr.stroke()
    cr.restore()
    for side in (-1, 1):
        cr.move_to(side * 26, -100 + bob)
        cr.line_to(side * 22, -70 + bob)
        rgb(cr, OL)
        cr.set_line_width(11)
        cr.stroke()
        cr.move_to(side * 26, -100 + bob)
        cr.line_to(side * 22, -70 + bob)
        rgb(cr, BLUE)
        cr.set_line_width(6)
        cr.stroke()
        cr.arc(side * 22, -72 + bob, 5, 0, TAU)
        fs(cr, YEL, 2.5)
    ellipse(cr, 0, -62 + bob, 50, 56)
    rgb(cr, OL)
    cr.set_line_width(4)
    cr.stroke()

    # scarf tail
    bx, by = wind * 18, -80 + bob
    pts = [(bx, by)]
    wa = clamp(wind_amp, 0, 1.5)
    for i in range(1, 11):
        px = bx + wind * i * lerp(1.5, 9.5, min(wa, 1))
        py = by + i * lerp(6.5, 1.2, min(wa, 1)) + math.sin(t * 17 - i * 0.75) * i * 0.9 * wa
        pts.append((px, py))
    smooth_path(cr, pts)
    rgb(cr, OL)
    cr.set_line_width(19)
    cr.stroke()
    smooth_path(cr, pts)
    rgb(cr, ORANGE)
    cr.set_line_width(12)
    cr.stroke()

    # arms
    shoulders = [(-40, -84 + bob), (40, -84 + bob)]
    hands = []
    for i, (shx, shy) in enumerate(shoulders):
        side = -1 if i == 0 else 1
        a = arms[i]
        L = 40
        hx, hy = shx + side * math.sin(a) * L, shy + math.cos(a) * L
        limb(cr, shx, shy, hx, hy, 13, PINK)
        cr.arc(hx, hy, 9, 0, TAU)
        fs(cr, PINK, 3.5)
        hands.append((hx, hy))

    # scarf band
    rrect(cr, -44, -94 + bob, 88, 20, 10)
    fs(cr, ORANGE, 4)
    cr.move_to(-30, -84 + bob)
    cr.line_to(30, -84 + bob)
    rgb(cr, (1, 0.8, 0.3))
    cr.set_line_width(3)
    cr.stroke()

    # head
    hy0 = -152 + bob
    for side in (-1, 1):
        cr.save()
        cr.translate(side * 36, hy0 - 40)
        cr.rotate(side * (0.38 + ear))
        cr.scale(side, 1)
        cr.move_to(-17, 8)
        cr.curve_to(-18, -20, -6, -40, 4, -42)
        cr.curve_to(11, -30, 18, -10, 17, 8)
        cr.close_path()
        fs(cr, PINK, 4)
        cr.move_to(-9, 4)
        cr.curve_to(-10, -14, -3, -27, 3, -29)
        cr.curve_to(7, -20, 10, -8, 9, 4)
        cr.close_path()
        rgb(cr, PINK2)
        cr.fill()
        cr.restore()
    ellipse(cr, 0, hy0, 66, 60)
    fs(cr, PINK, 4)
    # little top curl
    cr.move_to(-6, hy0 - 58)
    cr.curve_to(-10, hy0 - 72, 6, hy0 - 76, 4, hy0 - 64)
    rgb(cr, OL)
    cr.set_line_width(4)
    cr.stroke()

    fx = look * 14
    for side in (-1, 1):
        ellipse(cr, fx + side * 42, hy0 + 22, 11, 7.5)
        rgb(cr, (1, 0.42, 0.52), 0.55)
        cr.fill()

    closed = blink and (t % 3.3) < 0.1 and expr not in ("shock",)
    for side in (-1, 1):
        ex, ey = fx + side * 24, hy0 - 12
        e = expr
        if e == "wink" and side == 1:
            e = "joy"
        if e == "joy":
            cr.arc(ex, ey + 5, 11, PI * 1.1, PI * 1.9)
            rgb(cr, OL)
            cr.set_line_width(5)
            cr.stroke()
            continue
        if closed:
            cr.move_to(ex - 11, ey)
            cr.line_to(ex + 11, ey)
            rgb(cr, OL)
            cr.set_line_width(4.5)
            cr.stroke()
        else:
            rx, ry, pr = (17, 21, 5.5) if e == "shock" else (13, 16, 8)
            if e == "idea":
                rx, ry, pr = 14, 17, 8.5
            ellipse(cr, ex, ey, rx, ry)
            fs(cr, WHITE, 3)
            px = ex + look * 3 + gaze[0] * 5
            py = ey + gaze[1] * 6
            cr.arc(px, py, pr, 0, TAU)
            rgb(cr, (0.15, 0.07, 0.12))
            cr.fill()
            cr.arc(px - pr * 0.35, py - pr * 0.4, pr * 0.38, 0, TAU)
            rgb(cr, WHITE)
            cr.fill()
            cr.arc(px + pr * 0.35, py + pr * 0.35, pr * 0.16, 0, TAU)
            cr.fill()
        # brows
        rgb(cr, OL)
        cr.set_line_width(4.5)
        if e == "sad":
            cr.move_to(ex - side * 12, ey - 20)
            cr.line_to(ex + side * 9, ey - 27)
        elif e == "determined":
            cr.move_to(ex - side * 12, ey - 28)
            cr.line_to(ex + side * 10, ey - 19)
        elif e == "shock":
            cr.arc(ex, ey - 22, 10, PI * 1.15, PI * 1.85)
        else:
            cr.arc(ex, ey - 16, 10, PI * 1.25, PI * 1.75)
        cr.stroke()

    snx = fx * 1.25
    ellipse(cr, snx, hy0 + 20, 27, 18)
    fs(cr, PINK2, 3.5)
    for side in (-1, 1):
        ellipse(cr, snx + side * 9, hy0 + 20, 4, 6)
        rgb(cr, (0.55, 0.22, 0.32))
        cr.fill()

    my = hy0 + 46
    rgb(cr, OL)
    cr.set_line_width(4)
    if expr in ("happy", "idea", "wink"):
        cr.arc(fx, my - 10, 13, 0.22 * PI, 0.78 * PI)
        cr.stroke()
    elif expr == "joy":
        cr.move_to(fx - 17, my - 5)
        cr.curve_to(fx - 14, my + 16, fx + 14, my + 16, fx + 17, my - 5)
        cr.close_path()
        fs(cr, (0.6, 0.12, 0.22), 3.5)
        ellipse(cr, fx, my + 5, 8, 4)
        rgb(cr, (1, 0.5, 0.6))
        cr.fill()
    elif expr == "shock":
        ellipse(cr, fx, my + 2, 9, 12)
        fs(cr, (0.55, 0.1, 0.2), 3)
    elif expr == "sad":
        cr.arc(fx, my + 8, 11, 1.2 * PI, 1.8 * PI)
        cr.stroke()
    elif expr == "determined":
        cr.move_to(fx - 13, my - 1)
        cr.curve_to(fx - 4, my + 3, fx + 6, my + 1, fx + 13, my - 4)
        cr.stroke()
        cr.move_to(58, hy0 - 38)
        cr.curve_to(51, hy0 - 26, 55, hy0 - 18, 60, hy0 - 20)
        cr.curve_to(65, hy0 - 22, 65, hy0 - 30, 58, hy0 - 38)
        fs(cr, (0.62, 0.86, 1), 2.5)

    out["lh"] = cr.user_to_device(*hands[0])
    out["rh"] = cr.user_to_device(*hands[1])
    out["head"] = cr.user_to_device(0, hy0)
    out["feet"] = cr.user_to_device(0, 0)
    cr.restore()
    for k in list(out):
        out[k] = cr.device_to_user(*out[k])
    return out


def mushroom(cr, x, y, st=1.0, cs=1.0, t=0.0):
    sh = 70 * st
    rrect(cr, x - 32, y - sh - 6, 64, sh + 6, 18)
    fs(cr, (1, 0.94, 0.84), 4)
    for side in (-1, 1):
        cr.arc(x + side * 11, y - sh * 0.45, 3.5, 0, TAU)
        rgb(cr, OL)
        cr.fill()
    cr.arc(x, y - sh * 0.45 + 2, 6, 0.2 * PI, 0.8 * PI)
    rgb(cr, OL)
    cr.set_line_width(3)
    cr.stroke()
    cyy = y - sh
    rx, ry = 115 * (1 + (1 - cs) * 0.45), 82 * cs
    def cap():
        cr.save()
        cr.translate(x, cyy)
        cr.scale(rx, ry)
        cr.new_sub_path()
        cr.arc(0, 0, 1, PI, TAU)
        cr.curve_to(0.7, 0.18, -0.7, 0.18, -1, 0)
        cr.close_path()
        cr.restore()
    cap()
    cr.save()
    rgb(cr, RED)
    cr.fill_preserve()
    cr.clip()
    for sx_, sy_, sr in ((-0.5, -0.45, 0.2), (0.15, -0.72, 0.17), (0.6, -0.35, 0.16), (-0.05, -0.25, 0.12), (-0.82, -0.12, 0.1)):
        ellipse(cr, x + sx_ * rx, cyy + sy_ * ry, sr * rx, sr * ry * 1.1)
    rgb(cr, WHITE)
    cr.fill()
    cr.restore()
    cap()
    rgb(cr, OL)
    cr.set_line_width(5)
    cr.stroke()
    return cyy - ry
