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
