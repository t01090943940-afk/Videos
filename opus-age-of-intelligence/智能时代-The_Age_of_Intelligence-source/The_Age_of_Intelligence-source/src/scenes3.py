"""Scenes part 3: BUILD 2, DROP 2 (capabilities), switch-up, OUTRO."""
import math, functools
import numpy as np, cv2
import core as C
from core import W, H, e_out3, e_out5, e_io3, e_in3, e_back, ramp, clamp01, lerp
import timeline as TL
from scenes import (scene, SCENES, glow_circle, ring, fill_circle, bezier, travel_dots, starfield, typed, dimmer,
                    bracket_box, text_points)
from scenes2 import draw_brain, TOKC, _burst


# ================================================================ shared
def grid_floor(cv, travel, c1=C.MAG, c2=C.CYAN, horizon=0.46, roll=0.0, bright=1.0):
    hy = H * horizon
    # horizon glow
    g = np.exp(-((np.arange(H, dtype=np.float32) - hy) / 70.0) ** 2)[:, None, None]
    cv += g * np.array(c1, np.float32) * 0.18 * bright
    cam = C.Cam((0, 1.6, 0), (0, 1.6 - 0.35, 4), 70, roll=roll, cy=hy + 20)
    zs = (np.arange(0, 40, 1.6) - travel % 1.6) + 1.0
    A = np.stack([np.full_like(zs, -60), np.zeros_like(zs), zs], 1)
    B = np.stack([np.full_like(zs, 60), np.zeros_like(zs), zs], 1)
    xa, za = cam.project(A); xb, zb = cam.project(B)
    fade = np.clip(1 - zs / 40, 0, 1) ** 1.5
    C.lines(cv, xa, xb, np.array(c1)[None] * fade[:, None] * bright, 2)
    xs = np.arange(-30, 31, 2.0)
    A = np.stack([xs, np.zeros_like(xs), np.full_like(xs, 0.8)], 1)
    B = np.stack([xs, np.zeros_like(xs), np.full_like(xs, 40.0)], 1)
    xa, _ = cam.project(A); xb, _ = cam.project(B)
    C.lines(cv, xa, xb, np.array(c2) * 0.55 * bright, 1)


def cap_label(ctx, text, idx):
    cv = ctx.cv
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 7)
    C.draw_text(cv, idx, 'm7', 20, 84, 170, C.CYAN, e, 'lm', tracking=0.3)
    C.draw_text(cv, text, 'anton', 104, 80 + (1 - e) * -60, 240, C.WHITE, clamp01(fl / 3), 'lm')
    tw = C.text_size(text, 'anton', 104)[0]
    C.rect(cv, 80, 305, 80 + tw * e, 309, C.CYAN, 1.0, 'add')


def panel(cv, x, y, w, h, a=1.0, title=None):
    C.rrect(cv, x, y, w, h, 18, (0.03, 0.04, 0.065), a * 0.96)
    C.rrect_outline(cv, x, y, w, h, 18, (0.28, 0.38, 0.52), 1, a)
    C.rect(cv, x + 1, y + 44, x + w - 1, y + 45, (0.2, 0.26, 0.36), a)
    for i, c in enumerate([C.MAG, C.AMBER, C.LIME]):
        glow_circle(cv, x + 26 + i * 20, y + 22, 5.5, c, 0.7 * a)
    if title:
        C.draw_text(cv, title, 'm4', 18, x + w / 2, y + 22, C.GREY, a, 'mm', tracking=0.1)


# ================================================================ BUILD 2
@scene
def question_changed(ctx):
    cv = ctx.cv; tb = ctx.tb; b = ctx.b
    v = ctx.shot['v']
    grid_floor(cv, b * 1.2 * (1 + (b - 112) / 10), roll=(0.04 * math.sin(b)) if v else 0.0)
    starfield(cv, b * 0.6, bright=0.4)
    if v == 0:
        C.kinetic(cv, 'THE QUESTION', 'anton', 190, W / 2, H / 2 - 170, ctx.t + 0.15, C.WHITE, 0.05, 0.35,
                  style='scramble', seed=int(ctx.t * 14))
        C.kinetic(cv, 'HAS CHANGED', 'anton', 190, W / 2, H / 2 + 20, ctx.t - 0.9, C.CYAN, 0.05, 0.35,
                  style='scramble', seed=int(ctx.t * 14) + 1)
    else:
        q = 'CAN MACHINES THINK?'
        a = e_out3(ramp(tb, 0.0, 0.3))
        y = H / 2 - 90
        C.draw_text(cv, q, 'm8', 96, W / 2, y, C.WHITE, a * (1 - 0.55 * ramp(tb, 1.4, 2.0)), 'mm')
        tw = C.text_size(q, 'm8', 96)[0]
        k = e_io3(ramp(tb, 1.0, 1.35))
        if k > 0:
            C.rect(cv, W / 2 - tw / 2 - 20, y - 4, W / 2 - tw / 2 - 20 + (tw + 40) * k, y + 6, C.MAG, 1.4, 'add')
        a2 = e_out5(ramp(tb, 2.0, 2.4))
        C.draw_text(cv, '1950’S QUESTION: ANSWERED ENOUGH.', 'm7', 26, W / 2, y + 110, C.GREY, a2, 'mm',
                    tracking=0.25)
        C.draw_text(cv, 'HERE’S THE NEW ONE ↓', 'm7', 26, W / 2, y + 160, C.CYAN, ramp(tb, 2.8, 3.0), 'mm',
                    tracking=0.25)
        if 1.0 <= tb < 1.15:
            ctx.post['glitch'] = 25


@scene
def grid_word(ctx):
    cv = ctx.cv; b = ctx.b
    v = ctx.shot['v']; word = ctx.shot['word']; fast = ctx.shot.get('fast', False)
    cols = [(C.MAG, C.CYAN), (C.CYAN, C.VIOLET), (C.AMBER, C.MAG)][v]
    grid_floor(cv, b * 1.8 * (1 + (b - 112) / 8), cols[0], cols[1], roll=0.06 * (v - 1))
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 6)
    size = 300 if len(word) <= 5 else 230
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 40, (0, 0, 0), 0.6, 'mm', scale=lerp(1.35, 1, e) * 1.02,
                blur=10)
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 40, C.WHITE, 1.0, 'mm', scale=lerp(1.35, 1, e))
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 40, cols[0], 0.6 * (1 - e), 'mm', scale=lerp(1.35, 1, e) * 1.04,
                mode='add')
    if fast:
        ctx.post['invert'] = (ctx.si % 2 == 0)
        ctx.post['glitch'] = 18 * math.exp(-fl / 3)


@scene
def icon_flash(ctx):
    cv = ctx.cv
    k = ctx.shot['k']
    bgc = [C.CYAN, C.MAG, C.AMBER, C.LIME][k]
    cv[:] = np.array(bgc, np.float32) * 0.22
    C.line_grid(cv, 80, tuple(v * 0.2 for v in bgc))
    cx, cy = W / 2, H / 2 - 30
    fl = ctx.tb * TL.FPB
    s = lerp(1.25, 1.0, e_out5(fl / 5))
    if k == 0:
        C.draw_text(cv, '</>', 'm8', 300, cx, cy, C.WHITE, 1.0, 'mm', scale=s)
    elif k == 1:
        L = np.zeros_like(cv)
        cv2.ellipse(L, (int(cx * 16), int(cy * 16)), (int(300 * s * 16), int(150 * s * 16)), 0, 0, 360, (1, 1, 1), 14,
                    cv2.LINE_AA, 4)
        cv += L
        fill_circle(cv, cx, cy, 95 * s, (1, 1, 1))
        fill_circle(cv, cx, cy, 45 * s, tuple(v * 0.22 for v in bgc))
    elif k == 2:
        ys = np.linspace(-280, 280, 120) * s
        for ph in (0, math.pi):
            pts = np.stack([cx + np.sin(ys / 60 + ph + ctx.t * 6) * 130 * s, cy + ys], 1)
            C.polyline(cv, pts, C.WHITE, 12, 1.0)
        for yy in ys[::10]:
            x1 = cx + math.sin(yy / 60 + ctx.t * 6) * 130 * s; x2 = cx + math.sin(yy / 60 + math.pi + ctx.t * 6) * 130 * s
            C.lines(cv, [(x1, cy + yy)], [(x2, cy + yy)], C.WHITE, 5, 0.8)
    else:
        ring(cv, cx, cy, 250 * s, C.WHITE, 12, 1.0)
        L = np.zeros_like(cv)
        for i in range(1, 4):
            cv2.ellipse(L, (int(cx * 16), int(cy * 16)), (int(250 * s * i / 4 * 16), int(250 * s * 16)), 0, 0, 360,
                        (1, 1, 1), 6, cv2.LINE_AA, 4)
            yy = cy + (i - 2) * 125 * s
            half = math.sqrt(max(0, (250 * s) ** 2 - ((i - 2) * 125 * s) ** 2))
            cv2.line(L, (int((cx - half) * 16), int(yy * 16)), (int((cx + half) * 16), int(yy * 16)), (1, 1, 1), 6,
                     cv2.LINE_AA, 4)
        cv += L
    ctx.post['glitch'] = 14


# ================================================================ DROP 2
CODE = [
    ('def ', 'k'), ('attention', 'f'), ('(Q, K, V):', 'p'), None,
    ('    ', 'p'), ('# scaled dot-product attention', 'c'), None,
    ('    d_k = Q.shape[-1]', 'p'), None,
    ('    scores = Q @ K.T / ', 'p'), ('math', 'f'), ('.sqrt(d_k)', 'p'), None,
    ('    weights = ', 'p'), ('softmax', 'f'), ('(scores, axis=-1)', 'p'), None,
    ('    ', 'p'), ('return ', 'k'), ('weights @ V', 'p'), None,
    ('', 'p'), None,
    ('', 'p'), ('# generated, reviewed, shipped', 'c'), None,
]
CODE_COL = {'k': C.MAG, 'f': C.CYAN, 'p': (0.88, 0.9, 0.95), 'c': (0.45, 0.52, 0.62), 's': C.AMBER}


def code_lines():
    lines_, cur = [], []
    for tok in CODE:
        if tok is None:
            lines_.append(cur); cur = []
        else:
            cur.append(tok)
    return lines_


@scene
def code_editor(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    x0, y0, w, h = 700, 150, 1120, 660
    panel(cv, x0, y0, w, h, 1.0, 'attention.py')
    lines_ = code_lines()
    total = sum(len(''.join(t for t, _ in ln)) for ln in lines_)
    nchar = int(clamp01((tb - 0.05) / 1.45) * total)
    used = 0
    y = y0 + 100
    for li, ln in enumerate(lines_):
        C.draw_text(cv, f'{li + 1:2d}', 'm4', 26, x0 + 50, y, (0.3, 0.36, 0.46), 1.0, 'rm')
        x = x0 + 80
        for txt, kind in ln:
            if used >= nchar:
                break
            part = txt[:max(0, nchar - used)]
            used += len(part)
            if part:
                C.draw_text(cv, part, 'm4' if kind != 'k' else 'm7', 26, x, y, CODE_COL[kind], 1.0, 'lm')
                x += C.text_size(part, 'm4' if kind != 'k' else 'm7', 26)[0]
        if used >= nchar and used < total:
            if (tb * 4) % 1 < 0.6:
                C.rect(cv, x + 2, y - 16, x + 16, y + 16, C.CYAN, 1.0, 'add')
            break
        y += 50
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@scene
def tests_pass(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    x0, y0, w, h = 700, 150, 1120, 660
    panel(cv, x0, y0, w, h, 1.0, 'terminal')
    tests = ['test_attention_shapes', 'test_softmax_rows_sum_to_one', 'test_causal_mask', 'test_gradients_flow',
             'test_batch_invariance', 'test_fp16_stability', 'test_long_context', 'test_edge_cases']
    C.draw_text(cv, '$ pytest -q', 'm7', 26, x0 + 40, y0 + 100, C.LIME, 1.0, 'lm')
    for i, tname in enumerate(tests):
        k = ramp(tb, 0.1 + i * 0.09, 0.14 + i * 0.09)
        if k <= 0:
            continue
        y = y0 + 150 + i * 44
        C.draw_text(cv, tname, 'm4', 24, x0 + 40, y, (0.8, 0.84, 0.9), 1.0, 'lm')
        dots_w = int(clamp01((tb - 0.1 - i * 0.09) / 0.1) * 18)
        C.draw_text(cv, '.' * dots_w, 'm4', 24, x0 + 520, y, (0.4, 0.45, 0.55), 1.0, 'lm')
        if tb > 0.2 + i * 0.09:
            C.draw_text(cv, 'PASSED', 'm7', 24, x0 + 820, y, C.LIME, 1.0, 'lm')
    k = e_back(ramp(tb, 1.0, 1.3))
    if k > 0:
        C.rrect(cv, W / 2 + 300 - 330 * k, H / 2 + 170, 660 * k, 110, 20, (0.1, 0.25, 0.05), 0.95)
        C.draw_text(cv, '✓  128 PASSED', 'anton', 84, W / 2 + 300, H / 2 + 225, C.LIME, clamp01(k), 'mm', scale=k)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@functools.lru_cache(maxsize=1)
def _city():
    r = np.random.default_rng(6)
    blds = []
    for i in range(-7, 8):
        for j in range(0, 22):
            if i in (-1, 0, 1) or j % 5 == 0:
                continue
            if r.random() < 0.25:
                continue
            hgt = r.uniform(0.6, 5.5) * (1 + 0.6 * (abs(i) > 3))
            blds.append((i * 1.4, j * 1.4, 0.55 + r.random() * 0.3, hgt))
    return blds


@scene
def vision_city(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    travel = t * 5.5
    cam = C.Cam((0.3 * math.sin(t), 2.4, -4 + travel), (0, 1.2, 8 + travel), 62, roll=0.03 * math.sin(t * 2))
    blds = _city()
    edges = [(0, 1), (1, 2), (2, 3), (3, 0), (4, 5), (5, 6), (6, 7), (7, 4), (0, 4), (1, 5), (2, 6), (3, 7)]
    P1, P2, cols = [], [], []
    boxes = []
    for bi, (x, z, s, hgt) in enumerate(blds):
        zz = (z - travel) % (22 * 1.4) + travel - 2
        V = np.array([[x - s, 0, zz - s], [x + s, 0, zz - s], [x + s, 0, zz + s], [x - s, 0, zz + s],
                      [x - s, hgt, zz - s], [x + s, hgt, zz - s], [x + s, hgt, zz + s], [x - s, hgt, zz + s]],
                     np.float32)
        xy, zc = cam.project(V)
        if zc.min() < 0.5:
            continue
        fade = clamp01(1.4 - (zc.mean() - 2) / 26)
        for a, b_ in edges:
            P1.append(xy[a]); P2.append(xy[b_]); cols.append(np.array(C.CYAN) * 0.55 * fade)
        if bi % 7 == 0 and 3 < zc.mean() < 16:
            boxes.append((xy, zc.mean(), bi))
    # ground grid
    for gx in np.arange(-10, 11, 1.4):
        A = np.array([[gx, 0, travel + 0.5]]); B = np.array([[gx, 0, travel + 30]])
        xa, _ = cam.project(A); xb, _ = cam.project(B)
        P1.append(xa[0]); P2.append(xb[0]); cols.append(np.array((0.1, 0.18, 0.3)))
    C.lines(cv, np.array(P1), np.array(P2), np.array(cols), 1)
    # moving cars on the avenue
    r = np.random.default_rng(2)
    for ci in range(9):
        lane = [-0.6, 0.6][ci % 2]
        z = travel + ((ci * 3.1 + t * (6 if lane > 0 else -3)) % 26) + 1.5
        P = np.array([[lane - 0.35, 0, z - 0.6], [lane + 0.35, 0.45, z + 0.6]], np.float32)
        xy, zc = cam.project(P)
        if zc.min() < 0.8:
            continue
        x0_, x1_ = sorted([xy[0, 0], xy[1, 0]]); y0_, y1_ = sorted([xy[0, 1], xy[1, 1]])
        C.rect(cv, x0_, y0_, x1_, y1_, C.AMBER, 0.25, 'add')
        if ci % 3 == 0:
            bracket_box(cv, x0_ - 8, y0_ - 8, x1_ + 8, y1_ + 8, C.AMBER, 1.0, 10, 2)
            C.draw_text(cv, f'car {0.9 + 0.01 * (ci % 9):.2f}', 'm7', 16, x0_ - 8, y0_ - 22, C.AMBER, 1.0, 'lm')
    for xy, zm, bi in boxes[:4]:
        x0_, y0_ = xy.min(0); x1_, y1_ = xy.max(0)
        bracket_box(cv, x0_ - 6, y0_ - 6, x1_ + 6, y1_ + 6, C.LIME, 1.0, 14, 2)
        C.draw_text(cv, f'building {0.93 + (bi % 6) / 100:.2f}', 'm7', 16, x0_ - 6, y0_ - 20, C.LIME, 1.0, 'lm')
    # scan line + reticle
    sy = (t * 900) % H
    C.rect(cv, 0, sy, W, sy + 2, C.LIME, 0.3, 'add')
    ring(cv, W / 2, H / 2, 40, C.WHITE, 1, 0.5)
    C.draw_text(cv, 'OBJECTS: 37   FPS: 60   LATENCY: 12 MS', 'm7', 18, W - 130, 190, C.GREY, 1.0, 'rm',
                tracking=0.15)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@scene
def speech_wave(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    n = 96
    xs = np.linspace(W / 2 - 760, W / 2 + 760, n)
    r = np.random.default_rng(int(t * 30))
    for lane, (y, c, t0, t1) in enumerate([(H / 2 - 40, C.CYAN, 0.0, 0.95), (H / 2 + 150, C.MAG, 1.0, 1.95)]):
        act = ramp(tb, t0, t0 + 0.1) * (1 - ramp(tb, t1 - 0.1, t1))
        env = np.sin(np.linspace(0, math.pi, n)) ** 0.7
        syl = 0.5 + 0.5 * np.sin(xs / 37 + t * 22) * np.sin(xs / 91 - t * 9)
        hgt = 8 + 150 * act * env * np.abs(syl) * (0.6 + 0.4 * r.random(n))
        for x, hh in zip(xs, hgt):
            C.rect(cv, x - 4, y - hh / 2, x + 4, y + hh / 2, c, 0.9, 'add')
        C.draw_text(cv, ['YOU', 'AI'][lane], 'm7', 20, W / 2 - 800, y, c, 1.0, 'rm', tracking=0.3)
    q = '“Summarize this meeting in three bullet points.”'
    a = '“Sure — decisions, owners, and next deadlines…”'
    C.draw_text(cv, typed(q, tb - 0.1, 60), 'i6', 34, W / 2, H / 2 - 150, C.WHITE, 1.0, 'mm')
    C.draw_text(cv, typed(a, tb - 1.1, 60), 'i6', 34, W / 2, H / 2 + 260, (1.0, 0.8, 0.9), 1.0, 'mm')
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@functools.lru_cache(maxsize=1)
def _protein():
    r = np.random.default_rng(15)
    pts = []; kinds = []
    p = np.zeros(3); d = np.array([1.0, 0, 0])
    seg = 0
    while len(pts) < 520:
        kind = seg % 3
        if kind == 0:   # alpha helix
            ax = d / np.linalg.norm(d)
            u = np.cross(ax, [0, 1, 0.3]); u /= np.linalg.norm(u); v = np.cross(ax, u)
            nres = int(r.integers(22, 40))
            for i in range(nres):
                kinds.append(1)
                th = i * 100 / 180 * math.pi
                pts.append(p + ax * i * 0.16 + (u * math.cos(th) + v * math.sin(th)) * 0.62)
            p = pts[-1]
        else:           # loop / strand
            nres = int(r.integers(10, 22))
            for i in range(nres):
                kinds.append(0)
                d = d + r.normal(0, 0.45, 3)
                d /= np.linalg.norm(d)
                p = p + d * 0.55
                pts.append(p.copy())
        seg += 1
    P = np.array(pts[:520])
    P -= P.mean(0)
    P /= np.abs(P).max()
    # smooth
    k = np.ones(3) / 3
    for c in range(3):
        P[1:-1, c] = np.convolve(P[:, c], k, 'valid')
    return P.astype(np.float32), np.array(kinds[:520])


@scene
def protein(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    starfield(cv, ctx.b * 0.4, bright=0.3)
    P, kinds = _protein()
    P = P * 4.8
    Rm = C.ry(t * 0.9) @ C.rx(0.4 + 0.2 * math.sin(t))
    Q = P @ Rm.T
    cam = C.Cam((0, 0, -11), (0, 0, 0), 45, cx=W / 2 + 330, cy=H / 2 + 10)
    xy, z = cam.project(Q)
    grow = e_out3(ramp(tb, -0.35, 1.4))
    n = max(2, int(len(P) * grow))
    u = np.linspace(0, 1, len(P))
    colr = np.array([C.mixc(C.CYAN, C.VIOLET, clamp01(x * 2)) if x < 0.5 else C.mixc(C.VIOLET, C.AMBER, (x - 0.5) * 2)
                     for x in u])
    fade = C.depth_fade(z, 7, 15)
    # thick ribbon drawn back-to-front as segments
    order = np.argsort(-(z[:-1] + z[1:]) / 2)
    L = np.zeros_like(cv)
    for i in order:
        if i + 1 >= n:
            continue
        th = int(max(3, (16 if kinds[i] else 7) * 11 / z[i]))
        c = tuple(float(v * (0.35 + 0.75 * fade[i])) for v in colr[i])
        cv2.line(L, (int(xy[i, 0] * 16), int(xy[i, 1] * 16)), (int(xy[i + 1, 0] * 16), int(xy[i + 1, 1] * 16)), c, th,
                 cv2.LINE_AA, 4)
    cv += L
    C.splat(cv, xy[:n], np.array(C.WHITE, np.float32), (fade[:n] * 0.6).astype(np.float32))
    if n < len(P):
        glow_circle(cv, xy[n - 1, 0], xy[n - 1, 1], 8, C.WHITE, 1.4)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')
    k = e_out3(ramp(tb, 0.0, 2.8))
    val = int(200_000_000 * k ** 2)
    C.draw_text(cv, f'{val:,}+', 'anton', 110, 80, H / 2 + 60, C.WHITE, 1.0, 'lm')
    C.draw_text(cv, 'PROTEIN STRUCTURES PREDICTED', 'g7', 28, 84, H / 2 + 140, C.CYAN, ramp(tb, 0.6, 0.9), 'lm',
                tracking=0.2)
    C.draw_text(cv, 'ALPHAFOLD DATABASE · ILLUSTRATIVE FOLD', 'm4', 18, 84, H / 2 + 185, C.GREY,
                ramp(tb, 0.8, 1.1), 'lm', tracking=0.2)


@scene
def nobel(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    cv[:] = C.BG_WARM
    gold = (1.0, 0.78, 0.35)
    cx, cy = W / 2 - 420, H / 2 + 20
    k = e_out5(ramp(tb, -0.25, 0.6))
    for i, (rr, th, sp) in enumerate([(230, 3, 0.4), (262, 1, -0.25), (300, 2, 0.15), (200, 1, -0.6)]):
        a0 = (t * sp * 180 / math.pi * 3) % 360
        ring(cv, cx, cy, rr * k, gold, th, 0.8, a0, a0 + 300)
    for i in range(72):
        a = i / 72 * 2 * math.pi + t * 0.2
        r1, r2 = 312 * k, (322 if i % 6 else 336) * k
        C.lines(cv, [(cx + math.cos(a) * r1, cy + math.sin(a) * r1)], [(cx + math.cos(a) * r2, cy + math.sin(a) * r2)],
                gold, 1, 0.8)
    C.draw_text(cv, '2024', 'anton', 150, cx, cy - 10, gold, k, 'mm')
    C.draw_text(cv, 'NOBEL PRIZES', 'g7', 26, cx, cy + 80, C.WHITE, k, 'mm', tracking=0.4)
    # gold dust
    r = np.random.default_rng(3)
    P = r.normal(0, 1, (1500, 2)) * [300, 220]
    P[:, 1] -= (t * 60 + r.random(1500) * 200) % 400 - 200
    C.splat(cv, P + [cx, cy], np.array(gold, np.float32), r.uniform(0.2, 0.8, 1500).astype(np.float32))
    cards = [('PHYSICS', 'John Hopfield & Geoffrey Hinton', 'Foundations of machine learning with', 'artificial neural networks'),
             ('CHEMISTRY', 'Demis Hassabis & John Jumper · David Baker', 'Protein structure prediction &',
              'computational protein design')]
    for i, (f1, f2, f3, f4) in enumerate(cards):
        kk = e_out5(ramp(tb, 0.5 + i * 0.5, 1.0 + i * 0.5))
        x = W / 2 + 40 + (1 - kk) * 200
        y = 290 + i * 250
        C.rrect(cv, x, y, 760, 210, 16, (0.08, 0.06, 0.04), 0.9 * kk)
        C.rrect_outline(cv, x, y, 760, 210, 16, gold, 1, kk)
        C.draw_text(cv, f1, 'g7', 24, x + 34, y + 40, gold, kk, 'lm', tracking=0.35)
        C.draw_text(cv, f2, 'i6', 32, x + 34, y + 94, C.WHITE, kk, 'lm')
        C.draw_text(cv, f3, 'i4', 24, x + 34, y + 142, (0.8, 0.8, 0.85), kk, 'lm')
        C.draw_text(cv, f4, 'i4', 24, x + 34, y + 176, (0.8, 0.8, 0.85), kk, 'lm')
    ctx.post['bloom'] = 1.0


@functools.lru_cache(maxsize=1)
def _art(sz=520):
    yy, xx = np.mgrid[0:sz, 0:sz].astype(np.float32) / sz
    sky = np.stack([0.95 - 0.7 * yy, 0.35 + 0.1 * yy, 0.55 + 0.35 * yy], -1)
    sky = np.clip(sky * np.array([1.0, 0.8, 1.0]), 0, 1)
    img = sky.copy()
    sun = np.exp(-(((xx - 0.5) ** 2 + (yy - 0.52) ** 2) / 0.012))[..., None]
    img = img + sun * np.array([1.0, 0.75, 0.35]) * 0.9
    r = np.random.default_rng(4)
    cols = [(0.35, 0.1, 0.45), (0.2, 0.08, 0.35), (0.08, 0.05, 0.2), (0.03, 0.02, 0.08)]
    for li, c in enumerate(cols):
        base = 0.55 + li * 0.1
        ridge = base + 0.07 * np.sin(xx * (6 + li * 3) + li * 2) + 0.04 * np.sin(xx * (17 + li * 5) + li)
        m = (yy > ridge).astype(np.float32)[..., None]
        edge = np.exp(-((yy - ridge) / 0.004) ** 2)[..., None]
        img = img * (1 - m) + np.array(c) * m + edge * np.array([0.2, 0.9, 1.0]) * 0.8 * (li == 0)
    # neon grid on the ground
    g = (np.abs(((xx - 0.5) / np.maximum(yy - 0.82, 0.01) * 0.2) % 0.1 - 0.05) < 0.004) & (yy > 0.86)
    img[g] = img[g] * 0.3 + np.array([1.0, 0.3, 0.8]) * 0.8
    return np.clip(img, 0, 1).astype(np.float32)


@scene
def diffusion(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    art = _art()
    sz = art.shape[0]
    steps = 8
    si = min(steps, int(max(0, tb - 0.25) * 3.2))  # snaps on 8th-note-ish steps
    alpha_bar = (si / steps) ** 1.6
    r = np.random.default_rng(si + 1)
    noise = r.normal(0.5, 0.35, art.shape).astype(np.float32)
    img = np.clip(math.sqrt(alpha_bar) * art + math.sqrt(1 - alpha_bar) * noise, 0, 1)
    x0, y0 = int(W / 2 + 60), int(H / 2 - sz / 2 - 20)
    cv[y0:y0 + sz, x0:x0 + sz] = img * 0.95
    C.rect(cv, x0 - 2, y0 - 2, x0 + sz + 2, y0 + sz + 2, C.CYAN, 0.6, 'add', thick=1)
    C.draw_text(cv, f'STEP {steps - si:02d} / {steps:02d}', 'm7', 22, x0 + sz, y0 - 26, C.CYAN, 1.0, 'rm',
                tracking=0.2)
    # thumbnails of the chain
    for i in range(steps + 1):
        th = 70
        ab = (i / steps) ** 1.6
        rr = np.random.default_rng(i + 1)
        small = cv2.resize(art, (th, th), interpolation=cv2.INTER_AREA)
        nz = rr.normal(0.5, 0.35, small.shape).astype(np.float32)
        im = np.clip(math.sqrt(ab) * small + math.sqrt(1 - ab) * nz, 0, 1)
        tx = int(x0 - 40 - (steps + 1 - i) * 82 + 82 * 0)
        ty = int(y0 + sz - th)
        tx = int(80 + i * 82); ty = int(y0 + sz - th)
        a = 1.0 if i <= si else 0.18
        cv[ty:ty + th, tx:tx + th] = cv[ty:ty + th, tx:tx + th] * (1 - a) + im * a
        if i == si:
            C.rect(cv, tx - 3, ty - 3, tx + th + 3, ty + th + 3, C.AMBER, 1.0, 'add', thick=2)
    C.draw_text(cv, 'prompt:', 'm7', 22, 84, y0 + 150, C.GREY, 1.0, 'lm')
    C.draw_text(cv, typed('“a sunrise over neon mountains”', tb - 0.1, 50), 'i6', 34, 84, y0 + 196, C.WHITE, 1.0,
                'lm')
    C.draw_text(cv, 'NOISE  →  IMAGE', 'm7', 20, 84, y0 + sz - 100, C.CYAN, 1.0, 'lm', tracking=0.3)
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


AGENT_STEPS = ['PLAN', 'SEARCH', 'WRITE CODE', 'RUN TESTS', 'FIX', 'DONE ✓']


@scene
def agents(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    cx, cy, R = W / 2 + 330, H / 2 + 50, 290
    n = len(AGENT_STEPS)
    pos = [(cx + R * math.cos(-math.pi / 2 + i / n * 2 * math.pi), cy + 0.72 * R * math.sin(-math.pi / 2 + i / n * 2 * math.pi))
           for i in range(n)]
    prog = clamp01((tb - 0.2) / 3.4) * n
    cur = min(n - 1, int(prog))
    pts = np.array(pos + [pos[0]])
    C.polyline(cv, pts, (0.25, 0.32, 0.45), 2, 1.0)
    u = prog - int(prog)
    if prog < n:
        a, b_ = np.array(pos[cur]), np.array(pos[(cur + 1) % n])
        p = a + (b_ - a) * e_io3(u)
        C.lines(cv, [a], [p], C.CYAN, 3, 1.0)
        glow_circle(cv, p[0], p[1], 9, C.WHITE, 1.3)
    for i, (x, y) in enumerate(pos):
        done = i < cur or (i == cur and u > 0.3) or cur == n - 1
        active = i == cur
        c = C.LIME if done and i != cur else (C.CYAN if active else (0.35, 0.4, 0.5))
        wtxt = C.text_size(AGENT_STEPS[i], 'm7', 24)[0] + 50
        C.rrect(cv, x - wtxt / 2, y - 32, wtxt, 64, 32, (0.04, 0.06, 0.09), 1.0)
        C.rrect_outline(cv, x - wtxt / 2, y - 32, wtxt, 64, 32, c, 2, 1.0)
        C.draw_text(cv, AGENT_STEPS[i], 'm7', 24, x, y, C.WHITE if (done or active) else (0.5, 0.55, 0.65), 1.0, 'mm')
    C.draw_text(cv, 'TOOLS', 'm7', 18, cx, cy - 20, C.GREY, 1.0, 'mm', tracking=0.4)
    C.draw_text(cv, 'browser · terminal · files · APIs', 'm4', 18, cx, cy + 14, (0.5, 0.56, 0.66), 1.0, 'mm')
    log = ['> goal: fix failing checkout test', '> plan: 4 steps', '> search: docs/payments.md', '> edit: cart.py (+12 −3)',
           '> run: pytest … 1 failed', '> fix: rounding bug', '> run: pytest … all passed', '> open PR #214 ✓']
    for i, ln in enumerate(log):
        k = ramp(tb, 0.25 + i * 0.42, 0.3 + i * 0.42)
        if k > 0:
            C.draw_text(cv, typed(ln, (tb - 0.25 - i * 0.42), 80), 'm4', 22, 84, 380 + i * 44,
                        C.LIME if '✓' in ln or 'passed' in ln else (0.75, 0.8, 0.88), 1.0, 'lm')
    cap_label(ctx, ctx.shot['label'], '04 · CAPABILITIES')


@functools.lru_cache(maxsize=1)
def _globe():
    P = C.fib_sphere(9000, 1.0)
    # pseudo-continents from smooth trig noise
    n = (np.sin(P[:, 0] * 3.1 + 1) * np.sin(P[:, 1] * 2.3 + 2) + np.sin(P[:, 2] * 3.7 + P[:, 0] * 1.3)
         + 0.6 * np.sin(P[:, 1] * 7 + P[:, 2] * 5))
    land = n > 0.12
    r = np.random.default_rng(5)
    hubs = P[land][r.choice(land.sum(), 26, replace=False)]
    arcs = [(hubs[i], hubs[j]) for i, j in r.integers(0, 26, (80, 2))
            if i != j and 0.3 < math.acos(float(np.clip(np.dot(hubs[i], hubs[j]), -1, 1))) < 2.0][:40]
    return P.astype(np.float32), land, arcs


def slerp_arc(a, b_, n=48, lift=0.12):
    t = np.linspace(0, 1, n)[:, None]
    om = math.acos(float(np.clip(np.dot(a, b_), -1, 1)))
    if om < 1e-3:
        return np.repeat(a[None], n, 0)
    p = (np.sin((1 - t) * om) * a + np.sin(t * om) * b_) / math.sin(om)
    h = 1 + lift * om / math.pi * np.sin(np.pi * t)
    return p * h


@scene
def globe(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    starfield(cv, ctx.b * 0.3, bright=0.35)
    P, land, arcs = _globe()
    Rm = C.ry(-t * 0.5 + 2.2) @ C.rx(0.35)
    S = 3.4
    Q = (P * S) @ Rm.T
    cam = C.Cam((0, 0, -11), (0, 0, 0), 45, cx=W / 2 + 280)
    xy, z = cam.project(Q)
    front = Q[:, 2] < 0.2
    c = np.where(land[:, None], np.array(C.CYAN)[None], np.array((0.16, 0.3, 0.52))[None]).astype(np.float32)
    w = np.where(front, 1.0, 0.1) * np.where(land, 4.0, 1.3)
    C.splat(cv, xy, c, w.astype(np.float32), z=z)
    ring(cv, W / 2 + 280, H / 2, cam.f * S / math.sqrt(11 ** 2 - S ** 2), C.CYAN, 2, 0.35)
    for i, (a, b_) in enumerate(arcs):
        k = clamp01((tb - i * 0.08) / 0.8)
        if k <= 0:
            continue
        A = slerp_arc(a, b_) * S @ Rm.T
        axy, az = cam.project(A)
        n = max(2, int(len(A) * e_out3(k)))
        vis = A[:n, 2] < 0.3
        colr = C.AMBER if i % 3 == 0 else C.MAG if i % 3 == 1 else C.WHITE
        if vis.sum() >= 2:
            C.polyline(cv, axy[:n][vis], colr, 2, 0.8)
        u = (t * 0.9 + i * 0.17) % 1.0
        j = int(u * (len(A) - 1))
        if A[j, 2] < 0.3 and k >= 1:
            glow_circle(cv, axy[j, 0], axy[j, 1], 4, C.WHITE, 1.0)
    places = ['LABS', 'CLASSROOMS', 'HOSPITALS', 'STUDIOS', 'EVERYWHERE']
    for i, pl in enumerate(places):
        k = e_out5(ramp(tb, -0.1 + i * 0.35, 0.25 + i * 0.35))
        C.draw_text(cv, pl, 'anton', 70 if i < 4 else 92, 84 + (1 - k) * -40, 400 + i * 86 + (18 if i == 4 else 0),
                    C.WHITE if i < 4 else C.CYAN, k, 'lm')


# ================================================================ recap / switch / stutter
@scene
def recap(ctx):
    base = ctx.shot['base']; word = ctx.shot['word']; k = ctx.shot['k']
    if base == 'tunnel_word':
        SCENES['tunnel_word'](ctx, word=' ', hue=k)
    else:
        SCENES[base](ctx)
    cv = ctx.cv
    dimmer(cv, 0.35)
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 6)
    c = [C.CYAN, C.MAG, C.AMBER, C.LIME][k]
    C.draw_text(cv, word, 'anton', 320, W / 2, H / 2 - 30, (0, 0, 0), 0.5, 'mm', scale=lerp(1.3, 1, e), blur=12)
    C.draw_text(cv, word, 'anton', 320, W / 2, H / 2 - 30, C.WHITE, 1.0, 'mm', scale=lerp(1.3, 1, e))
    C.draw_text(cv, word, 'anton', 320, W / 2, H / 2 - 30, c, 0.7, 'mm', scale=lerp(1.3, 1, e) * 1.03, outline=3,
                mode='add')


def burst_bg(cv, t, hue):
    P, sp, rnd = _burst()
    Q = P * (6 + 10 * sp) @ C.ry(t * 2).T
    cam = C.Cam((0, 0, -26), (0, 0, 0), 55)
    xy, z = cam.project(Q)
    C.splat(cv, xy, np.array(hue, np.float32), (C.depth_fade(z, 10, 42) * 1.2).astype(np.float32), z=z)


@scene
def switch_word(ctx):
    cv = ctx.cv; k = ctx.shot['k']; word = ctx.shot['word']; b = ctx.b
    hue = [C.CYAN, C.MAG, C.AMBER, C.LIME, C.VIOLET][k % 5]
    m = k % 4
    if m == 0:
        SCENES['tunnel_word'](ctx, word=' ', hue=k % 3)
    elif m == 1:
        cam = C.Cam(C.orbit(9, b * 0.8, 0.2), (0, 0, 0), 50)
        draw_brain(cv, cam, b * 0.6, 3.4, 1.2, (hue, C.WHITE))
    elif m == 2:
        grid_floor(cv, b * 3, hue, C.WHITE)
    else:
        burst_bg(cv, b * 0.5, hue)
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 5)
    size = 300 if len(word) <= 6 else 220
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 30, (0, 0, 0), 0.55, 'mm', scale=lerp(1.4, 1, e), blur=10)
    C.draw_text(cv, word, 'anton', size, W / 2, H / 2 - 30, C.WHITE, 1.0, 'mm', scale=lerp(1.4, 1, e) + 0.03 * ctx.p)
    C.draw_text(cv, f'{k + 1:02d}', 'm7', 22, W / 2, H / 2 + 130, hue, 1.0, 'mm', tracking=0.4)
    ctx.post['invert'] = (k % 4 == 1)
    ctx.post['glitch'] = 16 * math.exp(-fl / 3)
    ctx.post['rot'] = [-2, 2, -1, 1][k % 4] * (1 - e)


@scene
def year_recap(ctx):
    cv = ctx.cv; k = ctx.shot['k']; year = ctx.shot['year']; b = ctx.b
    hue = [C.CYAN, C.MAG, C.AMBER, C.WHITE][k]
    if k == 0:
        starfield(cv, b * 3, bright=0.8, streak=0.6)
    elif k == 1:
        grid_floor(cv, b * 2, C.MAG, C.CYAN)
    elif k == 2:
        SCENES['tunnel_word'](ctx, word=' ', hue=2)
    else:
        cam = C.Cam(C.orbit(9, b * 0.5, 0.2), (0, 0, 0), 50)
        draw_brain(cv, cam, b * 0.5, 3.6, 1.3)
    fl = ctx.tb * TL.FPB
    e = e_out5(fl / 8)
    sc = lerp(1.5, 1.0, e) + 0.06 * ctx.p
    for i in range(3, 0, -1):
        C.draw_text(cv, year, 'anton', 420, W / 2, H / 2 - 20, hue, 0.2, 'mm', scale=sc * (1 + 0.05 * i), outline=2,
                    mode='add')
    C.draw_text(cv, year, 'anton', 420, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=sc)
    ctx.post['glitch'] = 26 * math.exp(-fl / 4)
    ctx.post['ca'] += 6
    ctx.post['invert'] = k == 3 and ctx.tb > 0.5


@scene
def stutter(ctx):
    cv = ctx.cv; k = ctx.shot['k']; b = ctx.b
    hue = [C.CYAN, C.MAG, C.AMBER, C.LIME][k % 4]
    cam = C.Cam(C.orbit(9 - k * 0.25, b * 1.2, 0.2), (0, 0, 0), 50)
    draw_brain(cv, cam, b * 0.8, 3.4 + k * 0.08, 1.2 + k * 0.05, (hue, C.WHITE))
    if k >= 6:
        s = 0.55 + (k - 6) * 0.07
        C.draw_text(cv, 'YOU', 'anton', 420, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=s)
    else:
        C.draw_text(cv, '?', 'anton', 420, W / 2, H / 2 - 20, C.WHITE, 1.0, 'mm', scale=0.6 + k * 0.05)
    # photosensitivity-safe stutter: no full-frame inversions, alternate zoom/tilt/tint instead
    ctx.post['glitch'] = 10 + k * 1.5
    ctx.post['punch'] += 0.035 * (k % 2)
    ctx.post['rot'] = 2.0 * (1 if k % 4 == 1 else -1 if k % 4 == 3 else 0)
    ctx.post['ca'] += 4 + 0.6 * k


# ================================================================ OUTRO
@scene
def terminal_outro(ctx):
    cv = ctx.cv; b = ctx.b
    starfield(cv, b * 0.5, bright=0.5)
    cam = C.Cam(C.orbit(12, b * 0.1, 0.1), (0, 0, 0), 45)
    draw_brain(cv, cam, b * TL.BEAT, 3.0, 0.35)
    dimmer(cv, 0.2)
    size = 76
    y1, y2 = H / 2 - 110, H / 2 + 20
    old = TL.INTRO_PROMPT
    pw = C.text_size('> ', 'm7', size)[0]
    x0 = W / 2 - C.text_size('> ' + TL.OUTRO_PROMPT, 'm7', size)[0] / 2
    strike_b = 177.2
    fade_old = 1 - 0.55 * ramp(b, strike_b + 0.2, strike_b + 0.8)
    C.draw_text(cv, '>', 'm7', size, x0, y1, C.CYAN, fade_old, 'lm')
    C.draw_text(cv, old, 'm7', size, x0 + pw, y1, C.WHITE, fade_old, 'lm')
    ow = C.text_size(old, 'm7', size)[0]
    k = e_io3(ramp(b, strike_b, strike_b + 0.25))
    if k > 0:
        C.rect(cv, x0 + pw - 10, y1 - 3, x0 + pw - 10 + (ow + 20) * k, y1 + 5, C.MAG, 1.5, 'add')
    txt = typed(TL.OUTRO_PROMPT, b - TL.OUTRO_TYPE_START, TL.OUTRO_TYPE_RATE)
    if b > TL.OUTRO_TYPE_START - 0.6:
        C.draw_text(cv, '>', 'm7', size, x0, y2, C.CYAN, 1.0, 'lm')
    if txt:
        C.draw_text(cv, txt, 'm7', size, x0 + pw, y2, C.WHITE, 1.0, 'lm')
    tw = C.text_size(txt, 'm7', size)[0] if txt else 0
    done_b = TL.OUTRO_TYPE_START + len(TL.OUTRO_PROMPT) / TL.OUTRO_TYPE_RATE
    if b > TL.OUTRO_TYPE_START - 0.6 and ((b % 1.0) < 0.55 or b < done_b):
        cx = x0 + pw + tw + 8
        C.rect(cv, cx, y2 - size * 0.42, cx + size * 0.55, y2 + size * 0.42, C.CYAN, 0.9)
    if b > done_b + 0.25:
        g = math.exp(-(b - done_b - 0.25) * 3)
        C.draw_text(cv, txt, 'm7', size, x0 + pw, y2, C.CYAN, 0.9 * g, 'lm', mode='add')


@scene
def end_card(ctx):
    cv = ctx.cv; tb = ctx.tb; b = ctx.b
    starfield(cv, b * 0.4, bright=0.5)
    cam = C.Cam(C.orbit(10.5 - 1.2 * e_io3(ctx.p), b * 0.08, 0.15), (0, 0, 0), 45)
    draw_brain(cv, cam, b * TL.BEAT, 3.3, 0.55, (C.CYAN, C.VIOLET))
    dimmer(cv, 0.35)
    C.kinetic(cv, 'WHAT WILL YOU BUILD?', 'anton', 176, W / 2, H / 2 - 90, ctx.t + 0.12, C.WHITE, 0.03, 0.35,
              style='rise', tracking=0.01)
    a = e_out3(ramp(tb, 1.0, 1.8))
    C.draw_text(cv, '你会用它创造什么？', 'sc9', 72, W / 2, H / 2 + 60, (0.62, 0.9, 1.0), a, 'mm', cjk='sc9',
                tracking=0.08)
    a2 = e_out3(ramp(tb, 2.5, 3.3))
    C.rect(cv, W / 2 - 180 * a2, H / 2 + 150, W / 2 + 180 * a2, H / 2 + 152, C.CYAN, 1.0, 'add')
    C.draw_text(cv, 'THE AGE OF INTELLIGENCE  ·  1950 → NOW', 'm7', 22, W / 2, H / 2 + 196, C.GREY, a2, 'mm',
                tracking=0.35)
    # gentle settle toward the end (never to black)
    end_dim = 0.3 * e_in3(ramp(b, TL.END_BEAT - 2.5, TL.END_BEAT))
    dimmer(cv, end_dim)
    ctx.post['hud'] = 1 - ramp(b, TL.END_BEAT - 3, TL.END_BEAT - 1)
