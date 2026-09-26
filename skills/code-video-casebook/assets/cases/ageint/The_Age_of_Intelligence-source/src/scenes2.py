"""Scenes part 2: DROP 1 (how an LLM works) and the SCALE break."""
import math, functools
import numpy as np, cv2
import core as C
from core import W, H, e_out3, e_out5, e_io3, e_in3, e_back, ramp, clamp01, lerp
import timeline as TL
from scenes import (scene, glow_circle, ring, fill_circle, bezier, travel_dots, starfield, typed, dimmer,
                    bracket_box, text_points)

TOKC = [C.CYAN, C.MAG, C.AMBER, C.LIME, C.VIOLET]


def step_label(cv, num, name, a=1.0):
    if a <= 0:
        return
    C.draw_text(cv, num, 'anton', 110, 80, 190, C.CYAN, a, 'lm', outline=2, mode='add')
    nw = C.text_size(num, 'anton', 110)[0]
    C.draw_text(cv, name, 'g7', 30, 80 + nw + 26, 172, C.WHITE, a, 'lm', tracking=0.3)
    C.rect(cv, 80 + nw + 26, 200, 80 + nw + 26 + 120 * a, 203, C.CYAN, a, 'add')


# ================================================================ impact
@functools.lru_cache(maxsize=1)
def _burst():
    r = np.random.default_rng(8)
    P = C.fib_sphere(5000, 1.0)
    sp = r.uniform(0.4, 1.0, (5000, 1)).astype(np.float32)
    return P, sp, r.random(5000).astype(np.float32)


@scene
def impact_title(ctx):
    cv = ctx.cv; t = ctx.t; tb = ctx.tb
    P, sp, rnd = _burst()
    rad = 1 + 26 * e_out3(t / 0.9) * sp
    Q = P * rad
    Q = Q @ C.ry(t * 0.8).T
    cam = C.Cam((0, 0, -30), (0, 0, 0), 50)
    xy, z = cam.project(Q)
    colr = np.where((rnd < 0.5)[:, None], np.array(C.CYAN)[None], np.array(C.MAG)[None]).astype(np.float32)
    colr[rnd > 0.9] = C.WHITE
    w = np.clip(1.3 - t * 0.6, 0.3, 1.3) * C.depth_fade(z, 5, 60)
    C.splat(cv, xy, colr, w.astype(np.float32), z=z)
    for i in range(3):
        rr = (t - i * 0.07) * 2600
        if rr > 0:
            ring(cv, W / 2, H / 2, rr, C.CYAN if i != 1 else C.MAG, 3, max(0, 1.2 - rr / 1600))
    C.line_grid(cv, 96, (0.03, 0.05, 0.08))
    kin_t = t
    C.kinetic(cv, 'HOW IT THINKS', 'anton', 240, W / 2, H / 2 - 40, kin_t, C.WHITE, stagger=0.02, dur=0.2,
              style='slam', tracking=0.02)
    a = e_out3(ramp(tb, 0.6, 1.0))
    C.draw_text(cv, ctx.shot['sub'], 'm7', 26, W / 2, H / 2 + 120, C.CYAN, a, 'mm', tracking=0.45)
    C.draw_text(cv, '— IN FOUR STEPS —', 'm4', 18, W / 2, H / 2 + 165, C.GREY, a, 'mm', tracking=0.3)
    if 1.0 <= tb < 1.15 or 1.5 <= tb < 1.6:
        ctx.post['glitch'] = 30
        ctx.post['ca'] += 10
    ctx.post['hud'] = 0.6


# ================================================================ 01 tokens
TOKS = ['Token', 'ization', ' turns', ' text', ' into', ' numbers', '.']
TOK_IDS = [4062, 2065, 10800, 1495, 1139, 5219, 13]


def token_row(cv, toks, y, size, split, box_a, fkey='g5', colors=TOKC, alpha=1.0, xoff=0.0, sc=1.0):
    ws = [C.text_size(tk.replace(' ', ' ') if tk.strip() else tk, fkey, size)[0] for tk in toks]
    ws = [C.text_size(tk, fkey, size)[0] if tk.strip() else size * 0.3 for tk in toks]
    gap = 26 * split
    pad = 16 * split
    total = sum(ws) + gap * (len(toks) - 1) + 2 * pad * len(toks)
    x = W / 2 - total / 2 + xoff
    centers = []
    for i, tk in enumerate(toks):
        bw = ws[i] + 2 * pad
        cx = x + bw / 2
        if box_a > 0:
            c = colors[i % len(colors)]
            C.rrect(cv, x, y - size * 0.72, bw, size * 1.4, 12, tuple(v * 0.22 for v in c), box_a * alpha)
            C.rrect_outline(cv, x, y - size * 0.72, bw, size * 1.4, 12, c, 2, box_a * alpha)
        C.draw_text(cv, tk.strip(), fkey, size, cx, y, C.WHITE, alpha, 'mm')
        centers.append((cx, bw))
        x += bw + gap
    return centers


@scene
def tokens_split(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '01', 'TOKENIZATION', e_out3(ramp(tb, 0.0, 0.3)))
    split = e_back(ramp(tb, 0.5, 0.8))
    box_a = ramp(tb, 0.5, 0.65)
    y = H / 2 - 60
    rise = e_out5(tb / 0.25)
    centers = token_row(cv, TOKS, y + (1 - rise) * 40, 64, split, box_a, alpha=1.0)
    for i, (cx, bw) in enumerate(centers):
        k = e_out5(ramp(tb, 1.0 + i * 0.06, 1.3 + i * 0.06))
        if k <= 0:
            continue
        c = TOKC[i % 5]
        C.rect(cv, cx - 1, y + 64, cx + 1, y + 64 + 60 * k, c, 0.8, 'add')
        C.draw_text(cv, str(TOK_IDS[i]), 'm7', 34, cx, y + 150 + (1 - k) * 30, c, k, 'mm')
    a = e_out3(ramp(tb, 1.5, 1.8))
    C.draw_text(cv, 'TEXT  →  TOKENS  →  IDS', 'm7', 22, W / 2, y + 240, C.GREY, a, 'mm', tracking=0.3)


@scene
def token_ids(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    LW, LH = 1800, 1500
    layer = np.zeros((LH, LW, 3), np.float32)
    r = np.random.default_rng(5)
    cols, rows = 12, 26
    cw, rh = LW / cols, 58
    scroll = (t * 260) % rh
    hi_row = 13
    for j in range(rows):
        yy = j * rh - scroll + 30
        for i in range(cols):
            v = int(r.integers(10, 100000))
            if j == hi_row and i < len(TOK_IDS):
                continue
            ph = (i * 0.37 + j * 0.61 + t * 3) % 1.0
            br = 0.18 + 0.25 * (ph > 0.85)
            C.draw_text(layer, f'{v:05d}', 'm4', 30, (i + 0.5) * cw, yy, (br * 0.7, br * 0.9, br * 1.2), 1.0, 'mm') \
                if 0 < yy < LH else None
    yy = hi_row * rh - scroll + 30
    for i, v in enumerate(TOK_IDS):
        c = TOKC[i % 5]
        C.rect(layer, i * cw + 10, yy - 24, (i + 1) * cw - 10, yy + 24, tuple(x * 0.25 for x in c), 1.0, 'add')
        C.draw_text(layer, f'{v:05d}', 'm7', 32, (i + 0.5) * cw, yy, C.WHITE, 1.0, 'mm')
    tilt = 0.28 + 0.06 * math.sin(t * 2)
    src = np.float32([[0, 0], [LW, 0], [LW, LH], [0, LH]])
    dst = np.float32([[W * (0.5 - 0.5 * (1 - tilt)) - 120, -60], [W * (0.5 + 0.5 * (1 - tilt)) + 120, -60],
                      [W + 380, H + 60], [-380, H + 60]])
    M = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(layer, M, (W, H), flags=cv2.INTER_LINEAR)
    # fog toward the top
    fog = np.linspace(0.1, 1.0, H, dtype=np.float32)[:, None, None] ** 1.2
    cv += warped * fog
    scan = (t * 1.4) % 1.0
    C.rect(cv, 0, H * scan - 2, W, H * scan + 2, C.CYAN, 0.25, 'add')
    step_label(cv, '01', 'TOKENIZATION')
    a = e_out5(ramp(tb, 0.3, 0.6))
    C.draw_text(cv, 'EVERYTHING BECOMES NUMBERS', 'anton', 110, W / 2, H / 2 - 40, C.WHITE, a, 'mm',
                scale=lerp(1.2, 1, a))
    C.draw_text(cv, 'VOCABULARY: ~50K – 200K TOKENS', 'm7', 24, W / 2, H / 2 + 40, C.CYAN, a, 'mm', tracking=0.3)


@scene
def token_fact(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    # conveyor rows of token boxes
    words = ['the', ' cat', ' sat', ' on', ' the', ' mat', ' and', ' dream', 'ed', ' of', ' code', '.', ' Hello',
             ' world', '!', ' un', 'believ', 'able']
    for row, (y, spd) in enumerate([(210, 420), (H - 250, -520)]):
        x = -((t * spd) % 2400) - 200 if spd > 0 else ((t * -spd) % 2400) - 2400
        i = row * 5
        while x < W + 200:
            tk = words[i % len(words)].strip()
            w_ = C.text_size(tk, 'm7', 30)[0] + 30
            c = TOKC[i % 5]
            C.rrect(cv, x, y - 26, w_, 52, 10, tuple(v * 0.18 for v in c), 0.9)
            C.draw_text(cv, tk, 'm7', 30, x + w_ / 2, y, (0.8, 0.85, 0.9), 0.9, 'mm')
            x += w_ + 14; i += 1
    step_label(cv, '01', 'TOKENIZATION', 0.0)
    k = e_out5(ramp(tb, 0.0, 0.25))
    C.kinetic(cv, '1 TOKEN ≈ ¾ WORD', 'anton', 190, W / 2, H / 2 - 30, t, C.WHITE, 0.025, 0.2, style='rise')
    a = e_out3(ramp(tb, 0.8, 1.1))
    C.draw_text(cv, '≈ 4 CHARACTERS OF ENGLISH TEXT, ON AVERAGE', 'm7', 26, W / 2, H / 2 + 110, C.CYAN, a, 'mm',
                tracking=0.2)


# ================================================================ 02 embeddings
CLUSTERS = {
    'ANIMALS': ['cat', 'dog', 'tiger', 'horse', 'wolf'],
    'ROYALTY': ['king', 'queen', 'prince', 'princess', 'crown'],
    'CODE': ['python', 'function', 'loop', 'array', 'compile'],
    'FOOD': ['apple', 'bread', 'rice', 'noodle', 'mango'],
    'SPACE': ['moon', 'star', 'planet', 'orbit', 'comet'],
    'FEELINGS': ['joy', 'fear', 'love', 'anger', 'calm'],
}
CL_COL = [C.CYAN, C.AMBER, C.LIME, C.MAG, C.VIOLET, (1.0, 0.5, 0.35)]


@functools.lru_cache(maxsize=1)
def _embed():
    r = np.random.default_rng(12)
    names = list(CLUSTERS)
    centers = C.fib_sphere(len(names), 5.0) * np.array([1.25, 0.55, 1.25], np.float32)
    pts, cols, labs = [], [], []
    for ci, nm in enumerate(names):
        P = centers[ci] + r.normal(0, 1.0, (320, 3))
        pts.append(P); cols.append(np.broadcast_to(np.array(CL_COL[ci]), (320, 3)))
        for wi, wd in enumerate(CLUSTERS[nm]):
            labs.append((wd, centers[ci] + r.normal(0, 0.95, 3), ci))
    bg = r.uniform(-9, 9, (900, 3))
    pts.append(bg); cols.append(np.broadcast_to(np.array((0.35, 0.4, 0.55)), (900, 3)))
    return (np.concatenate(pts).astype(np.float32), np.concatenate(cols).astype(np.float32), labs, centers,
            names)


def draw_embed(cv, cam, t, label_size=22, label_alpha=1.0, focus=None, show_axes=True):
    P, cols, labs, centers, names = _embed()
    # gentle drift
    Pd = P + 0.06 * np.sin(P[:, [1, 2, 0]] * 1.3 + t * 2)
    xy, z = cam.project(Pd)
    w = C.depth_fade(z, 4, 30) * 2.0
    C.splat(cv, xy, cols, w.astype(np.float32), z=z)
    if show_axes:
        O = np.zeros((3, 3), np.float32); A = np.eye(3, dtype=np.float32) * 8
        oxy, _ = cam.project(O); axy, _ = cam.project(A)
        C.lines(cv, oxy, axy, (0.35, 0.45, 0.6), 1, 0.8)
        for k, nm in enumerate(['d₁', 'd₂', 'd₃']):
            C.draw_text(cv, nm, 'm7', 20, axy[k, 0] + 10, axy[k, 1], (0.5, 0.6, 0.75), 0.9, 'lm')
    # labelled words
    L = np.array([l[1] for l in labs], np.float32)
    lxy, lz = cam.project(L)
    order = np.argsort(-lz)
    for i in order:
        wd, _, ci = labs[i]
        if lz[i] < 0.5:
            continue
        a = float(np.clip(1.3 - lz[i] / 30, 0.25, 1.0)) * label_alpha
        if focus is not None and ci != focus:
            a *= 0.35
        x, y = lxy[i]
        a *= clamp01((H - 215 - y) / 70)  # keep the subtitle zone clean
        if a <= 0.01:
            continue
        glow_circle(cv, x, y, 5, CL_COL[ci], 1.2 * a)
        sz = int(np.clip(label_size * 14 / lz[i], 14, 64))
        C.draw_text(cv, wd, 'm7', sz, x + 12, y, C.WHITE, a, 'lm')
    cxy, cz = cam.project(centers)
    for ci, nm in enumerate(names):
        if cz[ci] < 0.5:
            continue
        a = 0.8 * label_alpha * (0.35 if (focus is not None and ci != focus) else 1) * clamp01((H - 215 - cxy[ci, 1]) / 70)
        C.draw_text(cv, nm, 'g7', 16, cxy[ci, 0], cxy[ci, 1] - 150 / max(cz[ci], 1) * 10, CL_COL[ci], a, 'mm',
                    tracking=0.3)
    return lxy, lz


@scene
def embed_orbit(ctx):
    cv = ctx.cv; tb = ctx.tb
    p = ctx.p if ctx.shot['scene'] == 'embed_orbit' else (ctx.b % 8) / 8
    az = math.radians(-30 + 110 * e_io3(p))
    cam = C.Cam(C.orbit(16 - 3 * p, az, math.radians(18 + 8 * math.sin(p * 3)), target=(0, -1.3, 0)), (0, -1.3, 0), 50)
    draw_embed(cv, cam, ctx.t, label_alpha=0.55 + 0.45 * e_out3(ramp(tb, 0.0, 0.5)))
    if ctx.shot['scene'] == 'embed_orbit':
        step_label(cv, '02', 'EMBEDDINGS')
        a = e_out3(ramp(tb, 1.0, 1.4))
        C.draw_text(cv, '12,288', 'anton', 96, W - 130, H - 330, C.WHITE, a, 'rm')
        C.draw_text(cv, 'NUMBERS PER TOKEN · GPT-3', 'm7', 20, W - 130, H - 268, C.CYAN, a, 'rm', tracking=0.25)
        C.draw_text(cv, 'SIMILAR MEANING  →  NEARBY POINTS', 'm7', 20, 80, H - 268, C.GREY, a, 'lm',
                    tracking=0.25)


@scene
def embed_zoom(ctx):
    cv = ctx.cv; tb = ctx.tb
    P, cols, labs, centers, names = _embed()
    ci = names.index('ROYALTY')
    tgt = centers[ci]
    k = e_io3(ramp(tb, 0.0, 1.2))
    az = math.radians(80 + 20 * ctx.p)
    pos = C.orbit(lerp(16, 8.5, k), az, math.radians(20), target=tgt * k)
    cam = C.Cam(pos, tgt * k, 50)
    lxy, lz = draw_embed(cv, cam, ctx.t, label_size=30, focus=ci, show_axes=False)
    step_label(cv, '02', 'EMBEDDINGS')
    # vector readout in a fixed panel, linked to "king"
    ki = [i for i, l in enumerate(labs) if l[0] == 'king'][0]
    x, y = lxy[ki]
    a = e_out3(ramp(tb, 0.9, 1.1))
    vec = '[ 0.21, −0.53, 0.88, 0.07, −0.12, 0.64, … ]'
    shown = typed(vec, tb - 0.9, 60)
    px, py = W - 900 + 760, 760
    if a > 0:
        C.lines(cv, [(x + 8, y)], [(px - 760, py + 40)], C.AMBER, 1, 0.8 * a)
        C.draw_text(cv, 'king  =', 'm7', 28, px - 760, py, C.AMBER, a, 'lm')
        C.draw_text(cv, shown, 'm4', 26, px - 760, py + 44, C.WHITE, a, 'lm')
        C.draw_text(cv, '12,288 NUMBERS', 'm7', 18, px - 760, py + 88, C.GREY, a, 'lm', tracking=0.25)


@scene
def embed_math(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '02', 'EMBEDDINGS')
    O = np.array([W / 2 - 520, H / 2 + 210], np.float32)
    V = {'man': np.array([330, -120]), 'woman': np.array([300, -330]), 'king': np.array([760, -60]),
         'queen': np.array([730, -270])}
    colz = {'man': C.CYAN, 'woman': C.MAG, 'king': C.CYAN, 'queen': C.MAG}

    def arrow(p0, p1, c, k, th=3, a=1.0):
        if k <= 0:
            return
        p1 = p0 + (p1 - p0) * k
        C.lines(cv, [p0], [p1], c, th, a)
        d = p1 - p0; n = np.linalg.norm(d) + 1e-6; d /= n
        pr = np.array([-d[1], d[0]])
        h1 = p1 - d * 18 + pr * 9; h2 = p1 - d * 18 - pr * 9
        C.lines(cv, [p1, p1], [h1, h2], c, th, a)

    seq = [('king', -0.3), ('man', 0.5), ('woman', 1.0), ('queen', 1.5)]
    for nm, t0 in seq:
        k = e_out5(ramp(tb, t0, t0 + 0.3))
        arrow(O, O + V[nm], colz[nm], k, 3, 0.9)
        if k > 0:
            p = O + V[nm]
            glow_circle(cv, p[0], p[1], 7, colz[nm], k)
            C.draw_text(cv, nm, 'm7', 30, p[0] + 16, p[1] - 16, C.WHITE, k, 'lm')
    # difference vector woman - man, re-applied at king
    k = e_out5(ramp(tb, 1.0, 1.45))
    if k > 0:
        d = V['woman'] - V['man']
        a0 = O + V['king']
        arrow(a0, a0 + d, C.AMBER, k, 3, 1.0)
        a1 = O + V['man']
        arrow(a1, a1 + d, C.AMBER, k, 2, 0.5)
    if tb > 1.5:
        q = O + V['queen']
        kk = e_out5((tb - 1.5) / 0.3)
        ring(cv, q[0], q[1], 16 + 30 * (1 - kk), C.WHITE, 2, kk)
    glow_circle(cv, O[0], O[1], 5, C.WHITE, 0.8)
    parts = [('KING', -0.2, C.WHITE), (' − MAN', 0.5, C.CYAN), (' + WOMAN', 1.0, C.MAG), (' ≈ QUEEN', 1.5, C.AMBER)]
    x = W / 2 - C.text_size('KING − MAN + WOMAN ≈ QUEEN', 'anton', 96)[0] / 2
    for txt, t0, c in parts:
        k = e_out5(ramp(tb, t0, t0 + 0.2))
        if k > 0:
            C.draw_text(cv, txt, 'anton', 96, x, 330 + (1 - k) * 30, c, k, 'lm')
        x += C.text_size(txt, 'anton', 96)[0] + (C.text_size(' ', 'anton', 96)[0] if txt.startswith(' ') else 0) * 0
    C.draw_text(cv, 'DIRECTIONS IN THE SPACE ENCODE MEANING', 'm7', 20, W - 130, H - 268, C.GREY,
                ramp(tb, 0.3, 0.6), 'rm', tracking=0.25)


# ================================================================ 03 attention
ATT_WORDS = ['The', 'animal', 'didn’t', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired']
ATT_W = [0.03, 0.58, 0.03, 0.04, 0.03, 0.14, 0.05, 0.04, 0.02, 0.02, 0.06]


def att_layout(size=46, y=H / 2 + 130):
    ws = [C.text_size(w_, 'i6', size)[0] for w_ in ATT_WORDS]
    gap = 30
    total = sum(ws) + gap * (len(ws) - 1)
    x = W / 2 - total / 2
    xs = []
    for w_ in ws:
        xs.append(x + w_ / 2); x += w_ + gap
    return xs, ws, y


@scene
def attention_arcs(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    recap = ctx.shot['scene'] != 'attention_arcs'
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    if not recap:
        step_label(cv, '03', 'ATTENTION')
    xs, ws, y = att_layout()
    qi = ATT_WORDS.index('it')
    appear = (0.65 + 0.35 * e_out3(ramp(tb, 0.0, 0.3))) if not recap else 1.0
    for i, w_ in enumerate(ATT_WORDS):
        c = C.AMBER if i == qi else C.WHITE
        C.draw_text(cv, w_, 'i6', 46, xs[i], y, c, appear, 'mm')
    # query marker
    C.rrect_outline(cv, xs[qi] - ws[qi] / 2 - 14, y - 40, ws[qi] + 28, 80, 14, C.AMBER, 2, appear)
    kk = ramp(tb, 0.0, 1.4) if not recap else 1.0
    L = np.zeros_like(cv)
    best = None
    for j in range(len(ATT_WORDS)):
        if j == qi:
            continue
        w = ATT_W[j]
        p0 = np.array([xs[qi], y - 44]); p2 = np.array([xs[j], y - 44])
        h = 60 + abs(xs[qi] - xs[j]) * 0.45
        p1 = (p0 + p2) / 2 - [0, h]
        pts = bezier(p0, p1, p2, 60)
        k = clamp01(kk * 1.6 - abs(j - qi) * 0.05)
        n = max(2, int(60 * k))
        c = C.mixc(C.CYAN, C.AMBER, clamp01(w / 0.5))
        pulse = 1 + 0.5 * math.exp(-((tb % 1.0) * TL.BEAT) / 0.12)
        cv2.polylines(L, [(pts[:n] * 16).astype(np.int32)], False,
                      tuple(v * (0.25 + 1.6 * w) * pulse for v in c), max(1, int(1 + w * 14)), cv2.LINE_AA, 4)
        if j == 1:
            best = pts
        # weight bars under the words
        bk = e_out5(ramp(tb, 1.2 + j * 0.03, 1.6 + j * 0.03)) if not recap else 1
        C.rect(cv, xs[j] - 18, y + 50, xs[j] + 18, y + 50 + 220 * w * bk, c, 0.9, 'add')
        if w > 0.1 and bk > 0:
            C.draw_text(cv, f'{w:.2f}', 'm7', 22, xs[j], y + 70 + 220 * w * bk, C.WHITE, bk, 'mm')
    cv += L
    if best is not None and kk >= 1:
        for q in range(4):
            travel_dots(cv, best[::-1], ((t * 1.5 + q * 0.25) % 1.0), C.WHITE, 5, 1.0)
    if not recap:
        a = e_out5(ramp(tb, 2.0, 2.4))
        C.draw_text(cv, '“it”  =  the animal', 'g7', 60, W / 2, 330, C.WHITE, a, 'mm', tracking=0.02)
        C.draw_text(cv, 'CONTEXT DECIDES WHAT A WORD MEANS', 'm7', 20, W / 2, 390, C.CYAN, a, 'mm', tracking=0.3)


@functools.lru_cache(maxsize=1)
def _att_matrix():
    n = len(ATT_WORDS)
    r = np.random.default_rng(21)
    M = np.tril(r.random((n, n)) ** 3 + np.eye(n) * 0.6)
    M[7] = np.array(ATT_W)
    M = M / M.sum(1, keepdims=True)
    return M.astype(np.float32)


@scene
def attention_matrix(ctx):
    cv = ctx.cv; tb = ctx.tb
    M = _att_matrix()
    n = M.shape[0]
    az = math.radians(35 + 30 * ctx.p)
    cam = C.Cam(C.orbit(25, az, math.radians(36)), (0, 1.4, 0), 42)
    faces = []
    grow = ramp(tb, 0.0, 1.2)
    for i in range(n):
        for j in range(n):
            k = e_out5(clamp01(grow * 2.2 - (i + j) / (2 * n) * 1.2))
            h = 0.08 + M[i, j] * 5.5 * k
            x0, z0 = j - n / 2, i - n / 2
            s = 0.82
            V = np.array([[x0, 0, z0], [x0 + s, 0, z0], [x0 + s, 0, z0 + s], [x0, 0, z0 + s],
                          [x0, h, z0], [x0 + s, h, z0], [x0 + s, h, z0 + s], [x0, h, z0 + s]], np.float32)
            xy, z = cam.project(V)
            c = np.array(C.mixc((0.05, 0.25, 0.55), C.CYAN, clamp01(M[i, j] * 3)))
            if i == 7 and j == 1:
                c = np.array(C.AMBER)
            top = [4, 5, 6, 7]; front = [0, 1, 5, 4]; side = [1, 2, 6, 5]; side2 = [3, 0, 4, 7]
            faces.append((z.mean(), [(xy[top], c * 1.0), (xy[front], c * 0.55), (xy[side], c * 0.4),
                                     (xy[side2], c * 0.4)]))
    faces.sort(key=lambda f: -f[0])
    for _, fs in faces:
        for pts, c in fs[1:] + fs[:1]:
            cv2.fillConvexPoly(cv, (pts * 16).astype(np.int32), tuple(float(v) for v in c), cv2.LINE_AA, 4)
    step_label(cv, '03', 'ATTENTION')
    a = e_out3(ramp(tb, 0.5, 0.9))
    C.draw_text(cv, 'EVERY WORD × EVERY WORD', 'anton', 84, W - 130, H - 330, C.WHITE, a, 'rm')
    C.draw_text(cv, 'ATTENTION WEIGHTS, COMPUTED IN PARALLEL', 'm7', 20, W - 130, H - 268, C.CYAN, a, 'rm',
                tracking=0.25)


def _head_pattern(k, n=14):
    r = np.random.default_rng(100 + k)
    i, j = np.mgrid[0:n, 0:n]
    kind = k % 6
    if kind == 0:
        M = (i == j).astype(float)
    elif kind == 1:
        M = (j == i - 1).astype(float) + 0.1
    elif kind == 2:
        M = np.exp(-np.abs(i - j) / 3.0)
    elif kind == 3:
        M = (j == 0).astype(float) + 0.2 * r.random((n, n))
    elif kind == 4:
        M = (j % 3 == 0).astype(float) * 0.8 + 0.2 * r.random((n, n))
    else:
        M = r.random((n, n)) ** 4
    M = np.tril(M) + 1e-3
    return (M / M.max()).astype(np.float32)


@scene
def multihead(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '03', 'ATTENTION')
    cols, rows = 6, 2
    pw, ph = 190, 190
    gx = W / 2 - (cols * pw + (cols - 1) * 26) / 2
    gy = 270
    for q in range(cols * rows):
        i, j = q % cols, q // cols
        k = e_back(ramp(tb, -0.25 + q * 0.05, 0.1 + q * 0.05))
        if k <= 0:
            continue
        M = _head_pattern(q)
        img = cv2.resize(M, (int(pw), int(ph)), interpolation=cv2.INTER_NEAREST)
        c = TOKC[q % 5]
        rgb = img[..., None] * np.array(c, np.float32)[None, None] * 0.95
        x0 = int(gx + i * (pw + 26)); y0 = int(gy + j * (ph + 64))
        sc = k
        if sc < 0.98:
            rgb = cv2.resize(rgb, (max(2, int(pw * sc)), max(2, int(ph * sc))))
            x0 += int(pw * (1 - sc) / 2); y0 += int(ph * (1 - sc) / 2)
        hh, ww = rgb.shape[:2]
        if 0 <= y0 and y0 + hh <= H and 0 <= x0 and x0 + ww <= W:
            cv[y0:y0 + hh, x0:x0 + ww] += rgb
        C.rect(cv, x0, y0, x0 + ww, y0 + hh, c, 0.5 * clamp01(k), 'add', thick=1)
        C.draw_text(cv, f'HEAD {q + 1:02d}', 'm7', 16, x0, y0 + hh + 20, C.GREY, clamp01(k), 'lm', tracking=0.2)
    a = e_out5(ramp(tb, 0.9, 1.2))
    C.draw_text(cv, 'GPT-3: 96 LAYERS × 96 HEADS', 'anton', 76, W / 2, 830, C.WHITE, a, 'mm')


# ================================================================ 04 predict
PROMPT = 'The best way to predict the future is to'
CANDS = [('invent', 0.41), ('create', 0.22), ('build', 0.14), ('shape', 0.09), ('plan', 0.05)]


@scene
def predict_bars(ctx):
    cv = ctx.cv; tb = ctx.tb
    C.dot_grid(cv, 48, (0.05, 0.07, 0.11))
    step_label(cv, '04', 'PREDICTION')
    size = 50
    pw_ = C.text_size(PROMPT, 'i6', size)[0]
    blank_w = 210
    x0 = W / 2 - (pw_ + 20 + blank_w) / 2
    y = 330
    C.draw_text(cv, PROMPT, 'i6', size, x0, y, C.WHITE, 1.0, 'lm')
    bx = x0 + pw_ + 20
    fly = e_io3(ramp(tb, 1.05, 1.45))
    C.rrect_outline(cv, bx, y - 38, blank_w, 76, 12, C.CYAN, 2, 1.0 - 0.5 * fly)
    if fly <= 0:
        blink = (tb % 0.5) < 0.3
        C.rect(cv, bx + 16, y - 26, bx + 20, y + 26, C.CYAN, 1.0 if blink else 0.2, 'add')
    by0 = 470
    for i, (wd, p) in enumerate(CANDS):
        k = e_out5(ramp(tb, -0.12 + i * 0.07, 0.55 + i * 0.07))
        yy = by0 + i * 70
        hl = (i == 0) and tb > 0.95
        c = C.AMBER if hl else C.CYAN
        C.draw_text(cv, wd, 'm7', 34, W / 2 - 330, yy, C.WHITE, k * (0.4 if (i == 0 and fly > 0) else 1), 'rm')
        C.rect(cv, W / 2 - 300, yy - 20, W / 2 - 300 + 1200 * p * k, yy + 20, c, 0.85 * k, 'add')
        C.draw_text(cv, f'{p * k:.2f}', 'm7', 28, W / 2 - 280 + 1200 * p * k, yy, C.WHITE, k, 'lm')
    if fly > 0:
        sx, sy = W / 2 - 330 - C.text_size('invent', 'm7', 34)[0] / 2, by0
        ex, ey = bx + blank_w / 2, y
        x = lerp(sx, ex, e_out5(fly)); yv = lerp(sy, ey, e_in3(fly))
        C.draw_text(cv, 'invent', 'i6' if fly > 0.5 else 'm7', size if fly > 0.5 else 34, x, yv, C.AMBER, 1.0, 'mm')
        if fly >= 1:
            ctx.post['ca'] += 3
    C.draw_text(cv, 'NEXT-TOKEN PROBABILITIES · ILLUSTRATIVE', 'm7', 18, W / 2, H - 250, C.GREY, 0.9, 'mm',
                tracking=0.3)


@functools.lru_cache(maxsize=1)
def _net3d():
    r = np.random.default_rng(3)
    g = np.linspace(-3, 3, 7)
    X, Y = np.meshgrid(g, g)
    layers = []
    for li in range(12):
        P = np.stack([X.ravel(), Y.ravel() * 0.62, np.full(49, li * 3.0)], 1)
        layers.append(P)
    P = np.concatenate(layers).astype(np.float32)
    links = []
    for li in range(11):
        a = r.integers(0, 49, 60) + li * 49
        b = r.integers(0, 49, 60) + (li + 1) * 49
        links.append(np.stack([a, b], 1))
    return P, np.concatenate(links)


@scene
def deepnet3d(ctx):
    cv = ctx.cv; tb = ctx.tb; t = ctx.t
    P, links = _net3d()
    camz = lerp(-8, 22, e_io3(ctx.p))
    cam = C.Cam((1.2 * math.sin(t), 0.6, camz), (0, 0, camz + 10), 70, roll=0.15 * math.sin(t * 1.3))
    xy, z = cam.project(P)
    wave = camz + 6 + 4 * math.sin(t * 5)
    lz = P[:, 2]
    act = np.exp(-((lz - wave) ** 2) / 4.0)
    C.lines(cv, xy[links[:, 0]], xy[links[:, 1]], (0.1, 0.35, 0.5), 1, 0.7) if True else None
    vis = z > 0.3
    colr = (np.array(C.CYAN)[None] * (0.25 + act[:, None]) + np.array(C.WHITE)[None] * act[:, None] * 0.6)
    rr = cam.f * 0.05 / np.maximum(z, 0.3)
    C.dots(cv, xy[vis], np.clip(rr[vis], 0.8, 14), colr[vis], 1.0)
    step_label(cv, '04', 'PREDICTION')
    a = e_out5(ramp(tb, 0.3, 0.7))
    C.draw_text(cv, 'LAYER AFTER LAYER', 'anton', 130, W / 2, H / 2 - 30, C.WHITE, a, 'mm', scale=lerp(1.15, 1, a))
    C.draw_text(cv, 'EACH ONE REFINES THE GUESS', 'm7', 24, W / 2, H / 2 + 60, C.CYAN, a, 'mm', tracking=0.3)
    ctx.post['rblur'] += 0.015


AUTO_TOK = [' invent', ' it', '.', ' ↻']


@scene
def autoregress(ctx):
    cv = ctx.cv; tb = ctx.tb
    k = ctx.shot['k']
    bgs = [C.BG_MAIN, C.BG_VIOLET, C.BG_TEAL, C.BG_WARM]
    cv[:] = bgs[k]
    C.line_grid(cv, 96, (0.03, 0.045, 0.07), offset=(int(ctx.b * 40), 0))
    step_label(cv, '04', 'PREDICTION')
    base = PROMPT.split(' ')
    toks = [w_ for w_ in base] + [a.strip() for a in AUTO_TOK[:k + 1]]
    size = 52
    fl = ctx.tb * TL.FPB
    ws = [C.text_size(w_, 'i6', size)[0] for w_ in toks]
    gap = 22
    total = sum(ws) + gap * (len(toks) - 1)
    sc = [1.0, 1.08, 0.96, 1.0][k]
    x = W / 2 - total / 2
    y = H / 2 - 20 + [0, -20, 20, -60][k]
    for i, w_ in enumerate(toks):
        new = i == len(toks) - 1
        prev_gen = i >= len(base)
        if new:
            e = e_out5(fl / 6)
            c = C.AMBER
            C.rrect(cv, x - 12, y - 42, ws[i] + 24, 84, 12, tuple(v * 0.3 for v in c), e)
            C.draw_text(cv, w_, 'i6', size, x + ws[i] / 2, y, C.WHITE, 1.0, 'mm', scale=lerp(1.6, 1.0, e))
        else:
            c = C.CYAN if prev_gen else (0.75, 0.8, 0.9)
            C.draw_text(cv, w_, 'i6', size, x + ws[i] / 2, y, c, 0.9, 'mm')
        x += ws[i] + gap
    # loop arrow: output feeds back into input
    a = e_out3(ramp(tb, 0.1, 0.5))
    lx0, lx1 = W / 2 - total / 2, W / 2 + total / 2
    pts = np.array([[lx1 - 20, y + 60], [lx1 - 20, y + 130], [lx0 + 20, y + 130], [lx0 + 20, y + 60]])
    C.polyline(cv, pts, C.GREY, 2, 0.8 * a)
    travel_dots(cv, pts, (tb * 0.9) % 1.0, C.AMBER, 6, a)
    C.draw_text(cv, 'OUTPUT BECOMES INPUT', 'm7', 20, W / 2, y + 170, C.GREY, a, 'mm', tracking=0.3)
    C.draw_text(cv, f'STEP {k + 1}', 'anton', 84, W - 130, 200, C.AMBER, 1.0, 'rm')
    if k == 3:
        e = e_out5(fl / 8)
        C.draw_text(cv, 'ONE TOKEN AT A TIME', 'anton', 120, W / 2, 320, C.WHITE, e, 'mm', scale=lerp(1.3, 1, e))
    ctx.post['rot'] = [0, -1.2, 1.0, 0][k]


# ================================================================ BREAK — SCALE
@functools.lru_cache(maxsize=1)
def _brain():
    r = np.random.default_rng(9)
    P = C.fib_sphere(4200, 1.0)
    n = (np.sin(P[:, 0] * 5) * np.sin(P[:, 1] * 6 + 1) * np.sin(P[:, 2] * 4 + 2))
    P = P * (1 + 0.1 * n[:, None])
    # neighbour links
    idx = r.integers(0, len(P), 2600)
    d = np.linalg.norm(P[idx][:, None] - P[None], axis=2)
    d[np.arange(len(idx)), idx] = 9
    nb = np.argsort(d, axis=1)[:, 3:9][:, r.integers(0, 6, 2)]
    pairs = np.concatenate([np.stack([idx, nb[:, 0]], 1), np.stack([idx, nb[:, 1]], 1)])
    inner = r.normal(0, 0.45, (900, 3)).astype(np.float32)
    return P.astype(np.float32), pairs, inner, r.random(len(P)).astype(np.float32)


def draw_brain(cv, cam, t, scale=3.2, bright=1.0, hue=(C.CYAN, C.VIOLET), rot=None):
    P, pairs, inner, rnd = _brain()
    Rm = C.ry(t * 0.35) @ C.rx(0.25) if rot is None else rot
    Q = (P * scale) @ Rm.T
    xy, z = cam.project(Q)
    depth = C.depth_fade(z, cam_dist(cam) - scale, cam_dist(cam) + scale)
    col = np.array(hue[0])[None] * (1 - rnd[:, None]) + np.array(hue[1])[None] * rnd[:, None]
    tw = 0.6 + 0.4 * np.sin(rnd * 40 + t * 4)
    C.splat(cv, xy, col.astype(np.float32), (depth * tw * 3.2 * bright).astype(np.float32), z=z, soft=1.1, gain=3.0)
    hub = rnd > 0.94
    C.dots(cv, xy[hub], (2.2 + 2.5 * depth[hub]), col[hub] * (depth[hub] * tw[hub] * bright)[:, None], 1.0)
    a, b_ = pairs[:, 0], pairs[:, 1]
    m = (depth[a] > 0.45)
    lc = (np.array(hue[0]) * 0.16 * bright)
    C.lines(cv, xy[a][m], xy[b_][m], lc, 1, 1.0)
    I = (inner * scale) @ Rm.T
    ixy, iz = cam.project(I)
    C.splat(cv, ixy, np.array(C.WHITE, np.float32), np.full(len(I), 0.35 * bright, np.float32), z=iz)
    # pulses along links
    for q in range(40):
        i = (q * 97 + int(t * 3)) % len(pairs)
        u = (t * 3 + q * 0.13) % 1.0
        p = xy[pairs[i, 0]] * (1 - u) + xy[pairs[i, 1]] * u
        if depth[pairs[i, 0]] > 0.5:
            glow_circle(cv, p[0], p[1], 2.5, C.WHITE, 0.9 * bright)
    return xy


def cam_dist(cam):
    return float(np.linalg.norm(cam.pos))


@scene
def brain_sphere(ctx):
    cv = ctx.cv; tb = ctx.tb
    recap = ctx.shot['scene'] != 'brain_sphere'
    starfield(cv, ctx.b * 0.3, bright=0.35)
    cx = W / 2 + (330 if not recap else 0)
    cam = C.Cam(C.orbit(11 - 1.5 * e_io3(ctx.p), math.radians(10 * ctx.p), math.radians(8)), (0, 0, 0), 45, cx=cx)
    draw_brain(cv, cam, ctx.b * TL.BEAT, 3.2 * (1 + 0.03 * ctx.kick))
    if recap:
        return
    a1 = ramp(tb, 0.3, 1.2)
    C.kinetic(cv, 'SCALE', 'anton', 230, 360, H / 2 - 150, ctx.t - 0.15, C.WHITE, 0.06, 0.4, style='scramble',
              seed=int(ctx.t * 12))
    C.kinetic(cv, 'CHANGES EVERYTHING', 'g7', 40, 360, H / 2 - 10, ctx.t - 0.8, C.CYAN, 0.03, 0.3, style='rise',
              tracking=0.2)
    for i, (nm, v) in enumerate([('DATA', 0.8), ('COMPUTE', 0.95), ('PARAMETERS', 0.7)]):
        k = e_out5(ramp(tb, 3.0 + i * 0.7, 3.6 + i * 0.7))
        y = H / 2 + 80 + i * 56
        C.draw_text(cv, nm, 'm7', 22, 150, y, C.WHITE, k, 'lm', tracking=0.25)
        C.rect(cv, 340, y - 3, 340 + 260 * v * k, y + 3, C.CYAN, k, 'add')
        C.draw_text(cv, '↑', 'dejavu', 26, 340 + 260 * v * k + 18, y, C.CYAN, k, 'lm')


@scene
def compute_chart(ctx):
    cv = ctx.cv; tb = ctx.tb
    x0, x1, y0, y1 = 300, 1640, 240, 800
    yr0, yr1 = 2010, 2025
    l0, l1 = 16, 27
    push = 1 + 0.05 * ctx.p

    def X(yr):
        return x0 + (yr - yr0) / (yr1 - yr0) * (x1 - x0)

    def Y(lg):
        return y1 - (lg - l0) / (l1 - l0) * (y1 - y0)

    a = 1.0
    C.rect(cv, x0, y1, x1, y1 + 2, (0.5, 0.55, 0.65), a)
    C.rect(cv, x0, y0, x0 + 2, y1, (0.5, 0.55, 0.65), a)
    sup = str.maketrans('0123456789', '⁰¹²³⁴⁵⁶⁷⁸⁹')
    for lg in range(l0, l1 + 1, 2):
        C.rect(cv, x0, Y(lg), x1, Y(lg) + 1, (0.12, 0.15, 0.22), a, 'add')
        C.draw_text(cv, '10' + str(lg).translate(sup), 'm7', 20, x0 - 16, Y(lg), C.GREY, a, 'rm')
    for yr in range(2010, 2026, 5):
        C.draw_text(cv, str(yr), 'm7', 20, X(yr), y1 + 30, C.GREY, a, 'mm')
    C.draw_text(cv, 'TRAINING COMPUTE (FLOP, LOG SCALE)', 'm7', 16, x0, y0 - 30, C.GREY, a, 'lm', tracking=0.2)
    lk = 0.04 + 0.96 * e_io3(ramp(tb, 0.0, 6.0))
    yrs = np.linspace(2012, 2025, 200)
    lgs = math.log10(4.7e17) + (yrs - 2012) * math.log10(4.6)
    n = max(2, int(200 * lk))
    pts = np.stack([X(yrs), Y(lgs)], 1)
    C.polyline(cv, pts[:n], C.CYAN, 4, 1.0)
    if 0 < lk < 1:
        glow_circle(cv, pts[n - 1][0], pts[n - 1][1], 9, C.WHITE, 1.2)
    r = np.random.default_rng(4)
    ptyr = np.sort(r.uniform(2012.2, 2024.9, 46))
    ptlg = math.log10(4.7e17) + (ptyr - 2012) * math.log10(4.6) + r.normal(0, 0.55, len(ptyr))
    for yr, lg in zip(ptyr, ptlg):
        if yr <= 2012 + 13 * lk:
            glow_circle(cv, X(yr), Y(lg), 5, (0.4, 0.55, 0.8), 0.9)
    for nm, yr, fl, above in [('ALEXNET · 4.7×10¹⁷', 2012.0, 4.7e17, True), ('GPT-3 · 3.1×10²³', 2020.4, 3.1e23, True)]:
        if yr <= 2012 + 13 * lk + 0.01:
            k = e_out5(ramp((2012 + 13 * lk - yr), 0, 0.8))
            px, py = X(yr), Y(math.log10(fl))
            glow_circle(cv, px, py, 8, C.AMBER, 1.2)
            C.rect(cv, px, py - 60 * k, px + 1, py, C.AMBER, 0.8, 'add')
            C.draw_text(cv, nm, 'm7', 20, px + 8, py - 72 * k, C.AMBER, k, 'lm')
    k = e_out5(ramp(tb, -0.15, 0.35))
    C.draw_text(cv, '4–5× PER YEAR', 'anton', 120, x0 + 40, y0 + 90, C.WHITE, k, 'lm', scale=push)
    C.draw_text(cv, 'FRONTIER AI TRAINING COMPUTE · SOURCE: EPOCH AI', 'm7', 18, x0 + 44, y0 + 170, C.CYAN, k, 'lm',
                tracking=0.2)
