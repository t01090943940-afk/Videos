"""Scenes part 1: shared helpers, prologue, origins timeline, build 1."""
import math, functools
import numpy as np, cv2
import core as C
from core import W, H, e_out3, e_out5, e_io3, e_in3, e_expo, e_back, ramp, clamp01, lerp, smooth
import timeline as TL

SCENES = {}


def scene(fn):
    SCENES[fn.__name__] = fn
    return fn


# ================================================================ shared helpers
@functools.lru_cache(maxsize=64)
def text_points(text, fkey, size, n, seed=0, tracking=0.0):
    a, base, _, pad = C.text_mask(text, fkey, size, tracking)
    ys, xs = np.nonzero(a > 0.5)
    r = np.random.default_rng(seed)
    idx = r.choice(len(xs), size=min(n, len(xs)), replace=len(xs) < n)
    x = xs[idx] + r.random(len(idx)) - 0.5
    y = ys[idx] + r.random(len(idx)) - 0.5
    cx = (xs.min() + xs.max()) / 2; cy = (ys.min() + ys.max()) / 2
    return np.stack([x - cx, y - cy], 1).astype(np.float32)


@functools.lru_cache(maxsize=8)
def star_box(n=2500, seed=3, spread=(40, 24), depth=60):
    r = np.random.default_rng(seed)
    P = np.stack([r.uniform(-spread[0], spread[0], n), r.uniform(-spread[1], spread[1], n), r.uniform(0, depth, n)], 1)
    return P.astype(np.float32), r.uniform(0.3, 1.0, n).astype(np.float32)


def starfield(cv, travel, color=(0.6, 0.8, 1.0), n=2500, depth=60, bright=1.0, fov=60, streak=0.0, roll=0.0):
    P, lum = star_box(n, 3, (40, 24), depth)
    Q = P.copy()
    Q[:, 2] = (P[:, 2] - travel) % depth + 0.5
    if roll:
        Q = Q @ C.rz(roll).T
    cam = C.Cam((0, 0, 0), (0, 0, 1), fov)
    xy, z = cam.project(Q)
    w = lum * np.clip(1 - z / depth, 0, 1) ** 1.5 * bright * 3.0
    if streak > 0:
        Q2 = Q.copy(); Q2[:, 2] += streak
        xy2, z2 = cam.project(Q2)
        m = w > 0.15
        C.lines(cv, xy[m], xy2[m], np.asarray(color)[None] * w[m, None] * 0.8, 1)
    C.splat(cv, xy, np.asarray(color, np.float32), w, z=z)


def label(cv, text, x, y, t, color=C.WHITE, size=18, align='l', alpha=1.0, fkey='m7', tracking=0.2, speed=40.0):
    """typed label with a small leading tick"""
    n = int(clamp01(t) * speed * 2) if t < 1e8 else len(text)
    shown = text[:max(0, min(len(text), int(t * speed)))]
    if not shown:
        return
    C.draw_text(cv, shown, fkey, size, x, y, color, alpha, align + 'm', tracking=tracking)


def typed(text, t, rate):
    k = int(max(0, t) * rate)
    return text[:k]


def dimmer(cv, k):
    if k > 0:
        cv *= (1 - k)


def year_overlay(ctx, year):
    """big year slams in on the downbeat, then flies to the top-left badge"""
    tb = ctx.tb
    if tb < 0.95:
        p1 = e_out5(tb / 0.12)
        fly = e_io3(ramp(tb, 0.42, 0.95))
        size = 360
        sc = lerp(1.35, 1.0, p1)
        sc = lerp(sc, 64 / size, fly)
        tw, _ = C.text_size(year, 'anton', size)
        x = lerp(W / 2, 80 + tw * (64 / size) / 2, fly)
        y = lerp(H / 2, 128, fly)
        dimmer(ctx.cv, 0.72 * (1 - fly))
        ctx.year_fly = (year, x, y, sc, fly, size)
    else:
        ctx.year_badge = (year, 1.0)


def draw_year_fly(cv, yf):
    year, x, y, sc, fly, size = yf
    C.draw_text(cv, year, 'anton', size, x, y, C.WHITE, 1.0, 'mm', scale=sc)
    if fly < 0.05:
        C.draw_text(cv, year, 'anton', size, x, y, C.CYAN, 0.35 * (1 - fly * 20), 'mm', scale=sc * 1.06, outline=3)


def _patch(cv, x, y, r, fn):
    pad = 4
    x0 = int(math.floor(x - r - pad)); y0 = int(math.floor(y - r - pad))
    n = int(2 * r + 2 * pad + 2)
    X0, Y0, X1, Y1 = max(0, x0), max(0, y0), min(W, x0 + n), min(H, y0 + n)
    if X1 <= X0 or Y1 <= Y0:
        return
    L = np.zeros((Y1 - Y0, X1 - X0, 3), np.float32)
    fn(L, (x - X0) * 16, (y - Y0) * 16)
    cv[Y0:Y1, X0:X1] += L


def glow_circle(cv, x, y, r, color, alpha=1.0, thick=-1):
    if r <= 0.2:
        return
    c = tuple(float(v * alpha) for v in color)
    _patch(cv, x, y, r + max(thick, 0), lambda L, px, py: cv2.circle(L, (int(px), int(py)), int(r * 16), c, thick,
                                                                        cv2.LINE_AA, 4))


def ring(cv, x, y, r, color, thick=2, alpha=1.0, a0=0, a1=360):
    if r <= 0.5:
        return
    c = tuple(float(v * alpha) for v in color)
    _patch(cv, x, y, r + thick, lambda L, px, py: cv2.ellipse(L, (int(px), int(py)), (int(r * 16), int(r * 16)), 0,
                                                                a0, a1, c, thick, cv2.LINE_AA, 4))


def fill_circle(cv, x, y, r, color, alpha=1.0):
    if r <= 0.3:
        return
    m = np.zeros((int(2 * r + 6), int(2 * r + 6)), np.float32)
    cv2.circle(m, (int((r + 3) * 16), int((r + 3) * 16)), int(r * 16), 1.0, -1, cv2.LINE_AA, 4)
    C.blend(cv, m, int(x - r - 3), int(y - r - 3), color, alpha, 'over')


def bezier(p0, p1, p2, n=40):
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2


def travel_dots(cv, pts, k, color, r=4, alpha=1.0):
    """dot travelling along polyline pts at fraction k"""
    if k <= 0 or k >= 1:
        return
    seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    cum = np.concatenate([[0], np.cumsum(seg)])
    d = k * cum[-1]
    i = min(np.searchsorted(cum, d) - 1, len(seg) - 1)
    i = max(i, 0)
    u = (d - cum[i]) / max(seg[i], 1e-6)
    p = pts[i] * (1 - u) + pts[i + 1] * u
    glow_circle(cv, p[0], p[1], r, color, alpha)


def bracket_box(cv, x0, y0, x1, y1, color, alpha=1.0, L=16, th=2):
    for (x, y, sx, sy) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
        C.rect(cv, x, y, x + sx * L, y + sy * th, color, alpha, 'add')
        C.rect(cv, x, y, x + sx * th, y + sy * L, color, alpha, 'add')


# ================================================================ PROLOGUE
@scene
def terminal_intro(ctx):
    cv = ctx.cv
    b = ctx.b
    # ambient backdrop from frame 0: glow + faint neural sphere (bookends the end card)
    cv += _INTRO_GLOW
    from scenes2 import draw_brain
    bcam = C.Cam(C.orbit(12.5 - 1.0 * ctx.p, b * 0.05, 0.12), (0, 0, 0), 45)
    draw_brain(cv, bcam, b * TL.BEAT, 3.3, 0.32, (C.CYAN, C.VIOLET))
    starfield(cv, travel=b * 0.8, bright=0.55, color=(0.55, 0.7, 1.0))
    C.dot_grid(cv, 64, (0.05, 0.07, 0.11), alpha=0.6 + 0.4 * ramp(b, 0, 3))
    txt = typed(TL.INTRO_PROMPT, (b - TL.INTRO_TYPE_START), TL.INTRO_TYPE_RATE)
    size = 84
    zoom = 1 + 0.05 * ctx.p
    full_w, _ = C.text_size('> ' + TL.INTRO_PROMPT, 'm7', size)
    x0 = W / 2 - full_w * zoom / 2
    y = H / 2 - 20
    fade = 0.75 + 0.25 * e_out3(ramp(b, 0.0, 0.6))
    C.draw_text(cv, '>', 'm7', size, x0, y, C.CYAN, fade, 'lm', scale=zoom)
    pw, _ = C.text_size('> ', 'm7', size)
    if txt:
        C.draw_text(cv, txt, 'm7', size, x0 + pw * zoom, y, C.WHITE, 1.0, 'lm', scale=zoom)
    tw = C.text_size(txt, 'm7', size)[0] if txt else 0
    blink = (b % 1.0) < 0.55
    done_b = TL.INTRO_TYPE_START + len(TL.INTRO_PROMPT) / TL.INTRO_TYPE_RATE
    if blink or b < done_b:
        cx = x0 + (pw + tw + 8) * zoom
        C.rect(cv, cx, y - size * 0.42 * zoom, cx + size * 0.55 * zoom, y + size * 0.42 * zoom, C.CYAN, 0.9 * fade)
    enter_b = done_b + 0.25
    if b > enter_b:
        k = e_out5((b - enter_b) / 0.8)
        C.rect(cv, W / 2 - 520 * k, y + 80, W / 2 + 520 * k, y + 82, C.CYAN, 0.8, 'add')
        cap = typed('A. M. TURING  ·  COMPUTING MACHINERY AND INTELLIGENCE  ·  MIND, 1950', (b - enter_b - 0.3), 40)
        C.draw_text(cv, cap, 'm4', 20, W / 2, y + 124, C.GREY, 0.95, 'mm', tracking=0.14)
        # hit flash on the text at enter
        g = math.exp(-(b - enter_b) * 3)
        if txt:
            C.draw_text(cv, txt, 'm7', size, x0 + pw * zoom, y, C.CYAN, 0.8 * g, 'lm', scale=zoom, mode='add')
    ctx.post['hud'] = 0.6 + 0.4 * ramp(b, 0.5, 2.5)
    ctx.post['bloom'] = 1.0


_INTRO_GLOW = C.make_bg((0.035, 0.07, 0.13), (0.0, 0.0, 0.0), 0.5, 0.47, 0.95) - C.make_bg((0.0, 0.0, 0.0), (0.0, 0.0, 0.0))


@functools.lru_cache(maxsize=4)
def _num_points(text, n):
    return text_points(text, 'anton', 560, n, 5)


@scene
def year_1950(ctx):
    cv = ctx.cv
    tb, b = ctx.tb, ctx.b
    starfield(cv, travel=b * 1.2 + tb * tb * 0.3, bright=0.5, color=(0.55, 0.7, 1.0))
    C.line_grid(cv, 120, (0.025, 0.035, 0.055), offset=(0, int(-b * 20)))
    size = 560
    push = 1 + 0.08 * e_io3(ctx.p)
    dissolve = e_in3(ramp(tb, 5.2, 8.0))
    # echo outlines pulsing on beats
    pulse = math.exp(-((tb % 1.0) * TL.BEAT) / 0.12)
    if dissolve < 0.98:
        for k in range(4, 0, -1):
            sc = push * (1 + 0.035 * k * (0.5 + 0.5 * pulse))
            C.draw_text(cv, '1950', 'anton', size, W / 2, H / 2 - 70, C.mixc(C.CYAN, C.VIOLET, k / 4),
                        (0.28 - 0.05 * k) * (1 - dissolve), 'mm', scale=sc, outline=2, mode='add')
        # outline + scan fill
        C.draw_text(cv, '1950', 'anton', size, W / 2, H / 2 - 70, C.WHITE, 0.9 * (1 - dissolve), 'mm', scale=push,
                    outline=3, mode='add')
        fillk = e_io3(ramp(tb, 0.2, 3.5))
        a, base, _, pad = C.text_mask('1950', 'anton', size)
        m = a.copy()
        hh = m.shape[0]
        top = pad + (hh - 2 * pad) * (1 - fillk)
        m[:int(top)] = 0
        m2 = C.warp_mask(m, push)
        C.blend(cv, m2, int(W / 2 - m2.shape[1] / 2), int(H / 2 - 70 - m2.shape[0] / 2 + (size * 0.0)),
                (0.92, 0.96, 1.0), 0.95 * (1 - dissolve))
        # scan line
        if 0 < fillk < 1:
            ytop = H / 2 - 70 - (hh / 2 - top) * push
            C.rect(cv, W / 2 - 520, ytop - 1, W / 2 + 520, ytop + 1, C.CYAN, 1.2, 'add')
    if dissolve > 0:
        pts = _num_points('1950', 9000) * push
        r = np.random.default_rng(11)
        vel = r.normal(0, 1, (len(pts), 3)).astype(np.float32)
        vel[:, 2] = np.abs(vel[:, 2]) * 2 + 1
        d = dissolve
        P3 = np.concatenate([pts / 100.0, np.zeros((len(pts), 1), np.float32)], 1)
        P3[:, 1] *= -1
        P3 = P3 + vel * (d ** 1.5) * 6 * r.uniform(0.3, 1, (len(pts), 1)).astype(np.float32)
        cam = C.Cam((0, 0, -12), (0, 0, 0), 50)
        xy, z = cam.project(P3)
        # align projection scale so d=0 matches the 2D text
        k = 100.0 / (cam.f / 12)
        xy = (xy - [W / 2, H / 2]) * k + [W / 2, H / 2 - 70]
        colr = np.where((r.random(len(pts)) < 0.5)[:, None], np.array(C.CYAN)[None], np.array(C.WHITE)[None])
        C.splat(cv, xy, colr.astype(np.float32), np.full(len(pts), 0.9 * (1 - d * 0.6), np.float32))
    cap_a = e_out3(ramp(tb, 1.0, 1.6)) * (1 - dissolve)
    C.draw_text(cv, '“I PROPOSE TO CONSIDER THE QUESTION, ‘CAN MACHINES THINK?’”', 'm7', 24, W / 2, H / 2 + 262,
                C.WHITE, cap_a, 'mm', tracking=0.12)
    C.draw_text(cv, 'A. M. TURING — COMPUTING MACHINERY AND INTELLIGENCE', 'm4', 18, W / 2, H / 2 + 304, C.GREY,
                cap_a * 0.9, 'mm', tracking=0.2)
    ctx.post['punch'] += 0.015 * pulse


# ================================================================ ORIGINS
@functools.lru_cache(maxsize=2)
def _ai_cloud():
    pts = text_points('AI', 'anton', 700, 42000, 9)
    r = np.random.default_rng(2)
    z = r.normal(0, 18, len(pts))
    start = r.normal(0, 1, (len(pts), 3)) * np.array([900, 600, 700])
    delay = r.uniform(0, 0.5, len(pts))
    return pts, z.astype(np.float32), start.astype(np.float32), delay.astype(np.float32)


@scene
def ai_points(ctx):
    cv = ctx.cv
    tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    pts, z, start, delay = _ai_cloud()
    k = np.clip((tb - 0.2 - delay * 0.7) / 1.0, 0, 1)
    k = 1 - (1 - k) ** 4
    tgt = np.concatenate([pts, z[:, None]], 1)
    tgt[:, 1] *= -1
    P = start * (1 - k[:, None]) + tgt * k[:, None]
    # breathing noise
    P[:, 2] += np.sin(P[:, 0] * 0.02 + ctx.t * 3) * 6
    ang = math.radians(-18 + 30 * e_io3(ctx.p))
    P = P @ C.ry(ang).T
    P[:, 1] -= 60
    cam = C.Cam((0, 0, -1600), (0, 0, 0), 40)
    xy, zz = cam.project(P)
    hue = np.clip((pts[:, 0] + 350) / 700, 0, 1)[:, None]
    colr = np.array(C.CYAN)[None] * (1 - hue) + np.array(C.VIOLET)[None] * hue
    colr = colr * 0.65 + 0.35 * (1 - k[:, None]) * np.array(C.WHITE)[None]
    C.splat(cv, xy, colr.astype(np.float32), np.full(len(P), 1.7, np.float32), z=zz)
    a = e_out3(ramp(tb, 1.4, 1.9))
    C.draw_text(cv, 'ARTIFICIAL INTELLIGENCE', 'g7', 40, W / 2, H / 2 + 300, C.WHITE, a, 'mm', tracking=0.35)
    C.draw_text(cv, 'DARTMOUTH COLLEGE  ·  SUMMER 1956', 'm4', 18, W / 2, H / 2 + 348, C.GREY, a * 0.9, 'mm',
                tracking=0.25)
    year_overlay(ctx, ctx.shot['year'])


@scene
def perceptron(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    cx, cy = W / 2 + 40, H / 2 - 30
    ins = [(W / 2 - 520, cy - 240 + i * 160) for i in range(4)]
    appear = e_out5(ramp(tb, 0.35, 0.9))
    r_n = 90 * e_back(ramp(tb, 0.45, 0.95))
    wts = np.array([0.8, -0.4, 0.6, 0.3]) + 0.35 * np.sin(np.array([1, 2, 3, 4]) * 1.3 + math.floor(tb) * 2.1)
    L = np.zeros_like(cv)
    for i, (x, y) in enumerate(ins):
        k = e_out3(ramp(tb, 0.4 + i * 0.06, 0.9 + i * 0.06))
        ex, ey = lerp(x, cx - 90, k), lerp(y, cy, k)
        w = wts[i]
        c = C.CYAN if w > 0 else C.MAG
        th = int(1 + abs(w) * 5)
        cv2.line(L, (int(x * 16 + 44 * 16), int(y * 16)), (int(ex * 16), int(ey * 16)), tuple(float(v) * 0.8 for v in c),
                 th, cv2.LINE_AA, 4)
        # packet travelling each 16th
        ph = (tb * 2 + i * 0.25) % 1.0
        if tb > 1.0:
            travel_dots(cv, np.array([[x + 44, y], [cx - 90, cy]]), ph, C.WHITE, 5, 0.9)
        ring(cv, x, y, 44 * appear, C.WHITE, 2, 0.9)
        C.draw_text(cv, f'x{i + 1}', 'm7', 26, x, y, C.WHITE, appear, 'mm')
        mx, my = lerp(x + 44, cx - 90, 0.45), lerp(y, cy, 0.45) - 22
        C.draw_text(cv, f'{w:+.2f}', 'm4', 20, mx, my, c, appear * k, 'mm')
    cv += L
    lit = math.exp(-((tb % 1.0) * TL.BEAT) / 0.15) if tb > 1 else 0
    glow_circle(cv, cx, cy, max(r_n, 1), (0.05, 0.15, 0.2), 1.0)
    ring(cv, cx, cy, max(r_n, 1), C.CYAN, 3, 1.0 + lit)
    C.draw_text(cv, 'Σ', 'dejavu', 90, cx, cy + 6, C.WHITE, appear, 'mm')
    # step function graph
    gx, gy = cx + 200, cy
    k2 = e_out3(ramp(tb, 0.9, 1.5))
    C.rect(cv, cx + 90, cy - 1, cx + 90 + 110 * k2, cy + 1, C.WHITE, 0.8, 'add')
    pts = np.array([[gx, gy + 60], [gx + 90, gy + 60], [gx + 90, gy - 60], [gx + 180, gy - 60]])
    if k2 > 0:
        C.polyline(cv, pts[:max(2, int(2 + 2 * k2))], C.AMBER, 4, k2)
        C.rect(cv, gx - 10, gy + 90, gx + 190, gy + 91, C.GREY, 0.5 * k2, 'add')
    out = 1 if (np.dot(wts, [1, 0.5, 1, 0.8]) + 0.3 * math.sin(math.floor(tb) * 4)) > 0.2 else 0
    C.draw_text(cv, str(out), 'anton', 120, gx + 300, gy, C.AMBER, k2, 'mm', scale=1 + 0.15 * lit)
    C.draw_text(cv, 'y = step( Σ wᵢxᵢ + b )', 'm4', 24, cx + 60, cy + 210, C.GREY, k2, 'mm')
    C.draw_text(cv, 'THE PERCEPTRON', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.3)
    C.draw_text(cv, 'F. ROSENBLATT · CORNELL AERONAUTICAL LAB', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm',
                tracking=0.15)
    year_overlay(ctx, ctx.shot['year'])


def _mlp_layout(layers, x0, x1, cy, gap=92):
    pos = []
    for li, n in enumerate(layers):
        x = lerp(x0, x1, li / (len(layers) - 1))
        pos.append([(x, cy + (j - (n - 1) / 2) * gap) for j in range(n)])
    return pos


@scene
def backprop(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    layers = [4, 6, 6, 5, 2]
    pos = _mlp_layout(layers, W / 2 - 560, W / 2 + 560, H / 2 - 20)
    r = np.random.default_rng(4)
    appear = e_out3(ramp(tb, 0.35, 0.9))
    fwd = ramp(tb, 0.9, 2.2)
    bwd = ramp(tb, 2.3, 3.8)
    nl = len(layers)
    L = np.zeros_like(cv)
    for li in range(nl - 1):
        for a_i, (x0, y0) in enumerate(pos[li]):
            for b_i, (x1, y1) in enumerate(pos[li + 1]):
                w = r.normal()
                w2 = w + (r.normal() * 0.8) * bwd
                base_a = 0.18 + 0.25 * abs(w2)
                c = C.mixc(C.CYAN, C.MAG, clamp01(bwd * 1.2)) if bwd > 0 else C.CYAN
                # forward sweep highlight
                fk = clamp01((fwd * (nl - 1) - li) * 1.0)
                bk = clamp01((bwd * (nl - 1) - (nl - 2 - li)) * 1.0)
                hi = (fk * (1 - fk) * 4) * 0.8 + (bk * (1 - bk) * 4) * 0.8
                cc = tuple(v * (base_a + hi) * appear for v in (C.MAG if bk > 0 else c))
                cv2.line(L, (int(x0 * 16), int(y0 * 16)), (int(x1 * 16), int(y1 * 16)), cc, 1, cv2.LINE_AA, 4)
    cv += L
    for li in range(nl):
        fk = clamp01((fwd * (nl - 1) - li + 1))
        bk = clamp01((bwd * (nl - 1) - (nl - 1 - li) + 1))
        for (x, y) in pos[li]:
            glow_circle(cv, x, y, 16 * appear, (0.02, 0.05, 0.08))
            ring(cv, x, y, 16 * appear, C.WHITE, 2, 0.7)
            if fk > 0:
                glow_circle(cv, x, y, 9, C.CYAN, fk * (1 - bk))
            if bk > 0:
                glow_circle(cv, x, y, 9, C.MAG, bk)
    # pulses
    if 0 < fwd < 1:
        li = min(int(fwd * (nl - 1)), nl - 2); u = fwd * (nl - 1) - li
        for (x0, y0) in pos[li]:
            for (x1, y1) in pos[li + 1][::2]:
                glow_circle(cv, lerp(x0, x1, u), lerp(y0, y1, u), 3.5, C.WHITE, 0.9)
    if 0 < bwd < 1:
        li = nl - 1 - min(int(bwd * (nl - 1)), nl - 2); u = bwd * (nl - 1) - (nl - 1 - li)
        for (x0, y0) in pos[li]:
            for (x1, y1) in pos[li - 1][::2]:
                glow_circle(cv, lerp(x0, x1, u), lerp(y0, y1, u), 3.5, C.MAG, 1.0)
    C.draw_text(cv, 'FORWARD  →', 'm7', 22, W / 2 - 560, H / 2 + 330, C.CYAN, appear * (1 - bwd * 0.6), 'lm',
                tracking=0.2)
    C.draw_text(cv, '←  BACKWARD · GRADIENTS', 'm7', 22, W / 2 + 560, H / 2 + 330, C.MAG, ramp(tb, 2.2, 2.5), 'rm',
                tracking=0.2)
    loss = lerp(2.31, 0.07, e_out3(bwd))
    C.draw_text(cv, f'LOSS {loss:.2f}', 'anton', 64, W - 130, 150, C.WHITE, appear, 'rm')
    C.draw_text(cv, 'BACKPROPAGATION', 'g7', 26, W - 130, 205, C.GREY, appear, 'rm', tracking=0.3)
    year_overlay(ctx, ctx.shot['year'])


CHESS_START = {
    (0, 0): '♜', (1, 0): '♞', (2, 0): '♝', (3, 0): '♛', (4, 0): '♚', (5, 0): '♝', (6, 0): '♞', (7, 0): '♜',
    (0, 7): '♖', (1, 7): '♘', (2, 7): '♗', (3, 7): '♕', (4, 7): '♔', (5, 7): '♗', (6, 7): '♘', (7, 7): '♖',
}
for _i in range(8):
    CHESS_START[(_i, 1)] = '♟'; CHESS_START[(_i, 6)] = '♙'
CHESS_MOVES = [((4, 6), (4, 4)), ((4, 1), (4, 3)), ((6, 7), (5, 5)), ((1, 0), (2, 2)), ((5, 7), (1, 3)),
               ((0, 1), (0, 2)), ((1, 3), (0, 4)), ((6, 0), (5, 2))]


@scene
def chess(ctx):
    cv = ctx.cv; tb = ctx.tb
    board = dict(CHESS_START)
    nmoves = int(max(0, (tb - 0.9) * 2)) + 1 if tb > 0.9 else 0
    moving = None
    for i, (a, bq) in enumerate(CHESS_MOVES[:nmoves]):
        if i == nmoves - 1:
            k = e_out5(((tb - 0.9) * 2) % 1.0 / 0.6)
            moving = (board.pop(a), a, bq, k)
        else:
            board[bq] = board.pop(a)
    az = math.radians(-25 + 40 * ctx.p)
    cam = C.Cam(C.orbit(13, az, math.radians(48)), (0, -0.5, 0), 38)
    appear = e_out5(ramp(tb, 0.3, 1.0))
    quads = []
    for i in range(8):
        for j in range(8):
            x0, z0 = i - 4, j - 4
            P = np.array([[x0, 0, z0], [x0 + 1, 0, z0], [x0 + 1, 0, z0 + 1], [x0, 0, z0 + 1]], np.float32)
            P[:, 1] += (1 - appear) * (3 + ((i * 7 + j * 3) % 5))
            xy, z = cam.project(P)
            quads.append((z.mean(), xy, (i + j) % 2, i, j))
    quads.sort(key=lambda q: -q[0])
    for zm, xy, dark, i, j in quads:
        c = (0.05, 0.08, 0.14) if dark else (0.16, 0.22, 0.33)
        cv2.fillConvexPoly(cv, (xy * 16).astype(np.int32), c, cv2.LINE_AA, 4)
        cv2.polylines(cv, [(xy * 16).astype(np.int32)], True, (0.12, 0.35, 0.45), 1, cv2.LINE_AA, 4)
    # highlight squares of the moving piece
    if moving:
        g, a, bq, k = moving
        for sq, cc in ((a, C.AMBER), (bq, C.CYAN)):
            x0, z0 = sq[0] - 4, sq[1] - 4
            P = np.array([[x0, 0.01, z0], [x0 + 1, 0.01, z0], [x0 + 1, 0.01, z0 + 1], [x0, 0.01, z0 + 1]], np.float32)
            xy, _ = cam.project(P)
            L = np.zeros_like(cv)
            cv2.fillConvexPoly(L, (xy * 16).astype(np.int32), tuple(v * 0.35 for v in cc), cv2.LINE_AA, 4)
            cv += L
    pieces = [(sq, g, 1.0) for sq, g in board.items()]
    if moving:
        g, a, bq, k = moving
        pieces.append(((lerp(a[0], bq[0], k), lerp(a[1], bq[1], k)), g, 1.0 + 0.3 * math.sin(math.pi * k)))
    items = []
    for (i, j), g, lift in pieces:
        P = np.array([[i - 3.5, 0.0, j - 3.5]], np.float32)
        xy, z = cam.project(P)
        items.append((z[0], xy[0], g, lift))
    items.sort(key=lambda q: -q[0])
    for z, p, g, lift in items:
        s = 780 / z
        white = g in '♔♕♖♗♘♙'
        colr = (0.95, 0.97, 1.0) if white else C.CYAN
        C.draw_text(cv, g, 'dejavu', 110, p[0], p[1] - s * 0.55 * lift, colr, appear, 'mb', scale=s / 110 * 1.1)
    C.draw_text(cv, 'DEEP BLUE  3½ – 2½  KASPAROV', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.15)
    C.draw_text(cv, 'IBM · NEW YORK · MAY 1997', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm', tracking=0.2)
    year_overlay(ctx, ctx.shot['year'])


@functools.lru_cache(maxsize=64)
def _thumb(seed, w=150, h=110):
    r = np.random.default_rng(seed)
    im = np.zeros((h, w, 3), np.float32)
    yy, xx = np.mgrid[0:h, 0:w]
    base = r.uniform(0.02, 0.2, 3)
    im += base
    for _ in range(r.integers(3, 7)):
        cx, cy = r.uniform(0, w), r.uniform(0, h)
        s = r.uniform(10, 45)
        c = r.uniform(0, 1, 3) * r.uniform(0.4, 1.0)
        im += np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * s * s))[..., None] * c
    return np.clip(im, 0, 1).astype(np.float32)


LABELS = ['tabby cat', 'container ship', 'mushroom', 'cherry', 'leopard', 'garden spider', 'scooter', 'grille',
          'mite', 'lifeboat', 'amphibian', 'fireboat', 'go-kart', 'Madagascar cat', 'dalmatian', 'motor scooter']


@scene
def imagenet(ctx):
    cv = ctx.cv; tb = ctx.tb
    cols, rows = 9, 5
    tw_, th_ = 150, 110
    gx0 = W / 2 - (cols * (tw_ + 16)) / 2
    gy0 = H / 2 - (rows * (th_ + 16)) / 2 - 40
    scroll = ctx.t * 40
    for i in range(cols):
        for j in range(rows):
            k = e_out5(ramp(tb, 0.3 + (i + j) * 0.035, 0.8 + (i + j) * 0.035))
            if k <= 0:
                continue
            im = _thumb(i * 13 + j * 7)
            x = int(gx0 + i * (tw_ + 16)); y = int(gy0 + j * (th_ + 16) - scroll)
            y += int((1 - k) * 60)
            if y < -th_ or y > H:
                continue
            Y0, Y1 = max(0, y), min(H, y + th_)
            reg = cv[Y0:Y1, x:x + tw_]
            reg[:] = reg * (1 - k) + im[Y0 - y:Y1 - y] * k * 0.55
            conf = 0.5 + 0.5 * ((i * 31 + j * 17) % 10) / 10
            lab = LABELS[(i * 5 + j) % len(LABELS)]
            C.rect(cv, x, y + th_ - 22, x + tw_, y + th_, (0, 0, 0), 0.6 * k)
            C.draw_text(cv, lab, 'm4', 13, x + 6, y + th_ - 11, C.WHITE, k * 0.9, 'lm')
            C.rect(cv, x, y + th_ - 3, x + tw_ * conf * e_out3(ramp(tb, 0.8 + i * 0.03, 1.4)), y + th_,
                   C.CYAN, k, 'add')
            C.rect(cv, x, y, x + tw_, y + th_, C.CYAN, 0.25 * k, 'add', thick=1)
    # dark plate + bars
    k = e_out5(ramp(tb, 1.0, 1.6))
    dimmer(cv, 0.55 * k)
    bx0, by = W / 2 - 520, H / 2 - 110
    for idx, (name, val, c) in enumerate([('PREVIOUS BEST (2012 RUNNER-UP)', 26.2, C.GREY), ('ALEXNET · DEEP CNN', 15.3, C.CYAN)]):
        kk = e_out5(ramp(tb, 1.1 + idx * 0.4, 1.9 + idx * 0.4))
        y = by + idx * 150
        C.draw_text(cv, name, 'm7', 22, bx0, y - 34, C.WHITE, kk, 'lm', tracking=0.15)
        C.rect(cv, bx0, y - 14, bx0 + 1040 * val / 30 * kk, y + 30, c, 0.9 * kk, 'add' if idx else 'over')
        C.draw_text(cv, f'{val * kk:.1f}%', 'anton', 58, bx0 + 1040 * val / 30 * kk + 22, y + 8, C.WHITE, kk, 'lm')
    C.draw_text(cv, 'IMAGENET TOP-5 ERROR', 'g7', 30, W - 130, 128, C.WHITE, k, 'rm', tracking=0.25)
    C.draw_text(cv, '1.2M IMAGES · 1,000 CLASSES', 'm4', 16, W - 130, 168, C.GREY, k, 'rm', tracking=0.2)
    year_overlay(ctx, ctx.shot['year'])


@functools.lru_cache(maxsize=1)
def _go_stones():
    r = np.random.default_rng(37)
    cells = set(); out = []
    while len(out) < 36:
        i, j = int(r.integers(2, 17)), int(r.integers(2, 17))
        if (i, j) in cells or (i, j) == (4, 9):
            continue
        cells.add((i, j)); out.append((i, j, len(out) % 2))
    return out


@scene
def go(ctx):
    cv = ctx.cv; tb = ctx.tb
    az = math.radians(20 - 25 * ctx.p)
    cam = C.Cam(C.orbit(17 - 2.5 * e_io3(ctx.p), az, math.radians(58)), (0, 0.6, -0.6), 40)
    appear = e_out5(ramp(tb, 0.3, 1.0))
    s = 9
    # board plate
    P = np.array([[-s - 0.8, 0, -s - 0.8], [s + 0.8, 0, -s - 0.8], [s + 0.8, 0, s + 0.8], [-s - 0.8, 0, s + 0.8]],
                 np.float32) * 0.5
    xy, _ = cam.project(P)
    cv2.fillConvexPoly(cv, (xy * 16).astype(np.int32), (0.10, 0.075, 0.05), cv2.LINE_AA, 4)
    A, B = [], []
    for i in range(19):
        v = (i - 9) * 0.5
        A.append([v, 0, -4.5]); B.append([v, 0, 4.5])
        A.append([-4.5, 0, v]); B.append([4.5, 0, v])
    A = np.array(A, np.float32); B = np.array(B, np.float32)
    kk = appear
    Bm = A + (B - A) * kk
    xa, _ = cam.project(A); xb, _ = cam.project(Bm)
    C.lines(cv, xa, xb, (0.55, 0.45, 0.30), 1, 0.9)
    stones = _go_stones()
    shown = int(clamp01((tb - 0.6) / 2.4) * len(stones))
    items = []
    for n, (i, j, colr) in enumerate(stones[:shown]):
        items.append((i, j, colr, 1.0))
    if tb > 3.0:
        items.append((4, 9, 0, 1.0))
    for i, j, colr, _ in items:
        p3 = np.array([[(i - 9) * 0.5, 0.0, (j - 9) * 0.5]], np.float32)
        xy, z = cam.project(p3)
        rr = cam.f * 0.22 / z[0]
        x, y = xy[0]
        if colr == 0:
            fill_circle(cv, x, y + rr * 0.1, rr, (0.02, 0.02, 0.025), 1.0)
            ring(cv, x, y + rr * 0.1, rr, (0.35, 0.4, 0.5), 1, 0.6)
        else:
            fill_circle(cv, x, y + rr * 0.1, rr, (0.85, 0.87, 0.9), 1.0)
    if tb > 3.0:
        k = e_out5((tb - 3.0) / 0.5)
        p3 = np.array([[(4 - 9) * 0.5, 0, 0]], np.float32)
        xy, z = cam.project(p3)
        x, y = xy[0]
        ring(cv, x, y, 30 + 40 * (1 - k), C.CYAN, 3, 1.4)
        ring(cv, x, y, 60 + 90 * k, C.CYAN, 2, 0.6 * (1 - k))
        C.rect(cv, x + 34, y - 1, x + 34 + 180 * k, y + 1, C.CYAN, 1.0, 'add')
        C.draw_text(cv, 'MOVE 37', 'anton', 72, x + 230, y, C.WHITE, k, 'lm')
        C.draw_text(cv, '“1 IN 10,000”', 'm4', 18, x + 232, y + 50, C.CYAN, k, 'lm', tracking=0.2)
    C.draw_text(cv, 'ALPHAGO  4 – 1  LEE SEDOL', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.15)
    C.draw_text(cv, 'SEOUL · MARCH 2016', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm', tracking=0.2)
    year_overlay(ctx, ctx.shot['year'])


SENT = ['The', 'model', 'reads', 'every', 'word', 'at', 'once']


@scene
def transformer(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    words = ['ATTENTION', 'IS', 'ALL', 'YOU', 'NEED']
    size = 132
    widths = [C.text_size(w_, 'anton', size)[0] for w_ in words]
    gap = 34
    total = sum(widths) + gap * (len(words) - 1)
    x = W / 2 - total / 2
    y = H / 2 - 140
    for i, w_ in enumerate(words):
        start = 0.35 + [0, 1, 1.5, 2, 2.5][i] * 0.9
        k = (tb - start) / 0.3
        if k > 0:
            e = e_out5(k)
            C.draw_text(cv, w_, 'anton', size, x + widths[i] / 2, y + (1 - e) * 40, C.WHITE if i else C.CYAN,
                        clamp01(k * 3), 'mm', sx=1.0, sy=max(0.05, e))
        x += widths[i] + gap
    # token row with attention arcs
    tsize = 30
    tws = [C.text_size(w_, 'm7', tsize)[0] + 36 for w_ in SENT]
    tot = sum(tws) + 18 * (len(SENT) - 1)
    xs = []
    xx = W / 2 - tot / 2
    ty = H / 2 + 230
    appear = e_out3(ramp(tb, 0.5, 1.0))
    for i, w_ in enumerate(SENT):
        C.rrect(cv, xx, ty - 26, tws[i], 52, 10, (0.06, 0.1, 0.16), appear)
        C.rrect_outline(cv, xx, ty - 26, tws[i], 52, 10, C.CYAN, 1, 0.5 * appear)
        C.draw_text(cv, w_, 'm7', tsize, xx + tws[i] / 2, ty, C.WHITE, appear, 'mm')
        xs.append(xx + tws[i] / 2)
        xx += tws[i] + 18
    r = np.random.default_rng(3)
    L = np.zeros_like(cv)
    arcs_k = ramp(tb, 0.8, 3.6)
    npairs = 0
    for i in range(len(SENT)):
        for j in range(len(SENT)):
            if i == j:
                continue
            npairs += 1
            w = r.random() ** 2
            kk = clamp01(arcs_k * 1.4 - (i * 0.08 + j * 0.03))
            if kk <= 0:
                continue
            p0 = np.array([xs[i], ty - 30]); p2 = np.array([xs[j], ty - 30])
            h = 40 + abs(xs[i] - xs[j]) * 0.35
            p1 = (p0 + p2) / 2 - [0, h]
            pts = bezier(p0, p1, p2, 40)
            pts = pts[:max(2, int(len(pts) * kk))]
            c = C.mixc(C.CYAN, C.MAG, (i / len(SENT)))
            cv2.polylines(L, [(pts * 16).astype(np.int32)], False, tuple(v * (0.2 + 0.9 * w) for v in c),
                          1 + int(w * 3), cv2.LINE_AA, 4)
    cv += L
    C.draw_text(cv, 'VASWANI ET AL. · GOOGLE · 2017', 'm4', 16, W - 130, 168, C.GREY, appear, 'rm', tracking=0.2)
    C.draw_text(cv, 'THE TRANSFORMER', 'g7', 34, W - 130, 128, C.WHITE, appear, 'rm', tracking=0.25)
    year_overlay(ctx, ctx.shot['year'])


@functools.lru_cache(maxsize=1)
def _lattice(n=18):
    g = np.linspace(-1, 1, n)
    X, Y, Z = np.meshgrid(g, g, g)
    P = np.stack([X.ravel(), Y.ravel(), Z.ravel()], 1).astype(np.float32)
    r = np.random.default_rng(1)
    return P, r.random(len(P)).astype(np.float32)


@scene
def params(ctx):
    cv = ctx.cv; tb = ctx.tb
    P, rnd = _lattice(18)
    grow = e_out5(ramp(tb, 0.3, 2.5))
    s = 0.9 + 1.9 * grow
    Q = P * s
    Q = Q @ C.ry(ctx.t * 0.6).T @ C.rx(0.5).T
    cam = C.Cam((0, 0, -11), (0, 0, 0), 50, cx=W / 2 + 420)
    xy, z = cam.project(Q)
    lit = (rnd < 0.15 + 0.85 * grow) * (0.35 + 0.65 * (np.sin(rnd * 50 + ctx.t * 8) > 0.7))
    fade = C.depth_fade(z, 5, 18)
    colr = np.where((rnd > 0.92)[:, None], np.array(C.AMBER)[None], np.array(C.CYAN)[None]).astype(np.float32)
    m = lit > 0
    dots_r = (cam.f * 0.018 / np.maximum(z, 0.1))
    C.dots(cv, xy[m], dots_r[m], colr[m] * (lit[m] * fade[m])[:, None], 1.0)
    # cube frame
    E = np.array([[a, b_] for a in range(8) for b_ in range(8) if a < b_ and bin(a ^ b_).count('1') == 1])
    V = np.array([[(i >> 0 & 1) * 2 - 1, (i >> 1 & 1) * 2 - 1, (i >> 2 & 1) * 2 - 1] for i in range(8)], np.float32)
    V = (V * s * 1.08) @ C.ry(ctx.t * 0.6).T @ C.rx(0.5).T
    vxy, _ = cam.project(V)
    C.lines(cv, vxy[E[:, 0]], vxy[E[:, 1]], C.CYAN, 2, 0.6)
    # counter
    k = e_out3(ramp(tb, 0.35, 2.6))
    val = int(175e9 * (k ** 3))
    s_val = f'{val:,}'
    C.draw_text(cv, s_val, 'anton', 120, 150, H / 2 - 70, C.WHITE, ramp(tb, 0.35, 0.5), 'lm')
    C.draw_text(cv, 'PARAMETERS', 'g7', 34, 154, H / 2 + 20, C.CYAN, ramp(tb, 0.5, 0.8), 'lm', tracking=0.45)
    # comparison bars
    kb = e_out5(ramp(tb, 1.2, 2.2))
    for i, (nm, v) in enumerate([('GPT-2 · 2019', 1.5), ('GPT-3 · 2020', 175)]):
        y = H / 2 + 110 + i * 64
        C.draw_text(cv, nm, 'm7', 20, 154, y, C.GREY, kb, 'lm', tracking=0.1)
        C.rect(cv, 360, y - 12, 360 + 560 * (v / 175) * kb + 3, y + 12, C.CYAN if i else C.GREY, 0.9 * kb, 'add')
        C.draw_text(cv, f'{v:g}B', 'm7', 22, 360 + 560 * (v / 175) * kb + 22, y, C.WHITE, kb, 'lm')
    year_overlay(ctx, ctx.shot['year'])


# ================================================================ BUILD 1
@scene
def chat(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    appear = e_out5(ramp(tb, 0.3, 0.8))
    wx, wy, ww, wh = 150, 300, 860, 430
    wy += (1 - appear) * 80
    C.rrect(cv, wx, wy, ww, wh, 22, (0.035, 0.045, 0.07), appear)
    C.rrect_outline(cv, wx, wy, ww, wh, 22, (0.3, 0.4, 0.55), 1, appear)
    for i, c in enumerate([C.MAG, C.AMBER, C.LIME]):
        glow_circle(cv, wx + 30 + i * 22, wy + 28, 6, c, 0.6 * appear)
    q = 'Explain neural networks like I’m five.'
    qa = e_out3(ramp(tb, 0.6, 0.9))
    qw = C.text_size(q, 'i4', 26)[0] + 40
    C.rrect(cv, wx + ww - qw - 30, wy + 70, qw, 58, 18, (0.12, 0.35, 0.45), qa)
    C.draw_text(cv, q, 'i4', 26, wx + ww - qw / 2 - 30, wy + 99, C.WHITE, qa, 'mm')
    ans = ('Imagine lots of tiny helpers passing notes. Each one checks a small clue, '
           'and together they vote on the answer. When they’re wrong, they adjust — '
           'and slowly get really good at it.')
    shown = typed(ans, tb - 1.0, 55)
    # word wrap
    lines_, cur = [], ''
    for wd in shown.split(' '):
        if C.text_size(cur + ' ' + wd, 'i4', 26)[0] > ww - 110:
            lines_.append(cur); cur = wd
        else:
            cur = (cur + ' ' + wd).strip()
    lines_.append(cur)
    for i, ln in enumerate(lines_):
        C.draw_text(cv, ln, 'i4', 26, wx + 40, wy + 190 + i * 44, (0.85, 0.9, 0.97), 1.0, 'lm')
    if tb > 1.0 and len(shown) < len(ans):
        tx = wx + 40 + C.text_size(lines_[-1], 'i4', 26)[0] + 6
        glow_circle(cv, tx + 6, wy + 190 + (len(lines_) - 1) * 44, 7, C.CYAN, 1.0)
    # user counter
    k = e_out3(ramp(tb, 0.5, 3.4))
    val = int(100_000_000 * k ** 2.2)
    C.draw_text(cv, f'{val:,}', 'anton', 118, W - 150, H / 2 - 40, C.WHITE, ramp(tb, 0.5, 0.7), 'rm')
    C.draw_text(cv, 'USERS', 'g7', 36, W - 150, H / 2 + 50, C.CYAN, ramp(tb, 0.6, 0.9), 'rm', tracking=0.5)
    C.draw_text(cv, 'IN ≈ 2 MONTHS (EST.)', 'm4', 20, W - 150, H / 2 + 100, C.GREY, ramp(tb, 0.8, 1.1), 'rm',
                tracking=0.2)
    # mini growth curve
    xs = np.linspace(0, 1, 80)
    kk = ramp(tb, 0.5, 3.4)
    pts = np.stack([W - 640 + xs * 490, H / 2 + 260 - (xs ** 2.2) * 150], 1)
    n = max(2, int(80 * kk))
    C.polyline(cv, pts[:n], C.CYAN, 3, 1.0)
    glow_circle(cv, pts[n - 1][0], pts[n - 1][1], 7, C.WHITE, 1.0)
    year_overlay(ctx, ctx.shot['year'])


@scene
def tunnel_word(ctx, word=None, hue=None, fast=None, local=False):
    cv = ctx.cv
    b = ctx.b
    word = word or ctx.shot['word']
    hue = ctx.shot.get('hue', 0) if hue is None else hue
    fast = ctx.shot.get('fast', False) if fast is None else fast
    c1 = C.HUES[hue % 3]; c2 = C.HUES[(hue + 1) % 3]
    # continuous tunnel across cuts: travel is a function of global beat
    sp = min(12.0, max(0.0, b - 52))
    travel = 6 * sp + 1.8 * sp * sp * 0.25
    rings, per = 26, 90
    th = np.linspace(0, 2 * np.pi, per, endpoint=False)
    zs = (np.arange(rings) * 2.2 - travel) % (rings * 2.2) + 0.6
    R = 5.0
    pts = []; cols = []; ws = []
    roll = b * 0.15
    for zi, z in enumerate(zs):
        tw = th + roll + zi * 0.08
        wob = 1 + 0.08 * np.sin(tw * 6 + b)
        P = np.stack([np.cos(tw) * R * wob, np.sin(tw) * R * wob * 0.62, np.full(per, z)], 1)
        pts.append(P)
        mix = (zi % 3) / 2
        cols.append(np.broadcast_to(np.array(C.mixc(c1, c2, mix)), (per, 3)))
    P = np.concatenate(pts).astype(np.float32); colr = np.concatenate(cols).astype(np.float32)
    cam = C.Cam((0, 0, 0), (0, 0, 1), 75)
    xy, z = cam.project(P)
    w = np.clip(1 - z / (rings * 2.2), 0, 1) ** 1.2 * 1.8
    C.splat(cv, xy, colr, w, z=z)
    # streaks
    P2 = P.copy(); P2[:, 2] += 0.3 + 0.08 * sp
    xy2, _ = cam.project(P2)
    m = (w > 0.9) & (np.arange(len(P)) % 3 == 0)
    C.lines(cv, xy[m], xy2[m], colr[m] * 0.5, 1)
    starfield(cv, travel * 1.4, color=(0.7, 0.8, 1.0), bright=0.6)
    # word
    fl = ctx.tb * TL.FPB
    k = e_out5(fl / 6)
    size = 250 if len(word) < 9 else 190
    sc = lerp(1.25, 1.0, k) + 0.04 * ctx.p
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 20, (0.02, 0.02, 0.04), 0.6, 'mm', scale=sc * 1.02, blur=8)
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=sc, tracking=0.02)
    C.draw_text(cv, word, 'anton', size, W / 2 + 6, H / 2 - 20, c1, 0.5 * (1 - k), 'mm', scale=sc, mode='add')
    if fast:
        ctx.post['invert'] = (ctx.si % 2 == 1)
        ctx.post['glitch'] = 20 * math.exp(-fl / 3)
    ctx.post['rblur'] += 0.02 + 0.004 * sp


@scene
def question_hold(ctx):
    cv = ctx.cv
    txt = ctx.shot['text']
    C.BG_MAIN  # plain
    starfield(cv, ctx.b * 0.2, bright=0.35)
    fl = ctx.tb * TL.FPB
    flick = 1.0 if (int(fl) % 7 != 3 or fl > 12) else 0.55
    k = e_out5(fl / 5)
    sc = lerp(0.9, 1.0, k) + 0.12 * e_in3(ramp(ctx.tb, 0.6, 1.0))
    C.draw_text(cv, txt, 'anton', 150, W / 2, H / 2 - 20, C.WHITE, flick, 'mm', scale=sc, tracking=0.03)
    # countdown line
    C.rect(cv, W / 2 - 300, H / 2 + 90, W / 2 - 300 + 600 * ctx.p, H / 2 + 93, C.CYAN, 1.0, 'add')
    C.draw_text(cv, 'INCOMING', 'm7', 18, W / 2, H / 2 + 125, C.CYAN, 0.8 * flick, 'mm', tracking=0.5)
    ctx.post['hud'] = 0.4


# import other scene modules (they register themselves)
import scenes2  # noqa: E402,F401
import scenes3  # noqa: E402,F401
