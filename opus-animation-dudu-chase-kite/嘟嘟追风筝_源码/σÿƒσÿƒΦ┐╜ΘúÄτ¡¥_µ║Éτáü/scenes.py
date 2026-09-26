# Scenes for "嘟嘟追风筝" — 30s original cartoon
from lib import *

T1, T2, T3, T4, T5, T6, T7, END = 2.8, 7.6, 10.0, 18.0, 21.2, 25.2, 28.4, 30.0


def dev2log(cr, x, y):
    dx, dy = cr.user_to_device(x, y)
    return dx / SC, dy / SC


def flash(cr, a, col=WHITE):
    if a > 0:
        rgb(cr, col, clamp(a))
        cr.rectangle(-10, -10, 1300, 740)
        cr.fill()


def dangling(cr, kx, ky, t, L=110):
    string(cr, kx, ky, kx - 25 + 12 * math.sin(t * 5), ky + L, sag=10)


# ======================= S1 TITLE =======================
def s1(cr, t):
    sky(cr, [(0, (0.50, 0.80, 1.0)), (1, (1.0, 0.92, 0.80))])
    cr.save()
    apply_cam(cr, zoom=1.0 + 0.03 * t)
    sun(cr, 1060, lerp(640, 170, eob(prog(t, 0, 1.0), 1.4)), 58, t)
    for i, (bx, by, s) in enumerate([(100, 120, 1.0), (420, 70, 0.7), (800, 150, 0.9), (1180, 90, 0.8)]):
        cloud(cr, bx + t * 20 * (1 + i % 2), by, s)
    hill_layer(cr, t * 10, 610, 90, 700, (0.58, 0.84, 0.58), 1.0)
    hill_layer(cr, t * 25, 690, 70, 500, (0.42, 0.76, 0.38), 2.3, olw=4)
    for i in range(9):
        flower(cr, 60 + i * 145 + hsh(i, 3) * 40, 712 - hsh(i, 4) * 10, 1.1,
               [(1, 0.5, 0.6), (1, 1, 1), (0.7, 0.5, 1)][i % 3], t)
    kx = lerp(1480, 950, eob(prog(t, 1.5, 2.0), 1.6))
    draw_kite(cr, kx, 470 + 14 * math.sin(t * 3), 1.1, 0.15 * math.sin(t * 2.5), t, "happy", tail_ang=PI * 0.7)
    py = lerp(1120, 712, eob(prog(t, 1.25, 1.7), 1.6))
    draw_pig(cr, 640, py, 1.2, t, arms=(0.3, 2.5 + 0.45 * math.sin(t * 18)), expr="happy", wind=1, wind_amp=0.3,
             ear=0.08 * math.sin(t * 9))
    cr.restore()
    cols = [(1, 0.45, 0.62), (1, 0.6, 0.15), (0.3, 0.6, 1), (0.35, 0.8, 0.35), (0.72, 0.45, 0.95)]
    for i, ch in enumerate("嘟嘟追风筝"):
        ti = 0.2 + i * 0.12
        sc = eob(prog(t, ti, ti + 0.35), 2.8)
        x = 640 + (i - 2) * 152
        y = 225 + math.sin(t * 5 + i * 0.9) * 7 * prog(t, ti + 0.35, ti + 0.6)
        rot = (1 - min(sc, 1)) * 0.7 * (1 if i % 2 else -1) + 0.05 * math.sin(t * 4 + i)
        text(cr, ch, x, y, 140, fill=cols[i], ring=WHITE, scale=sc, rot=rot)
    a = prog(t, 1.05, 1.4)
    text(cr, "原创动画 · 小猪嘟嘟的风筝大冒险", 640, 352 + (1 - eoc(a)) * 30, 34, fill=WHITE,
         ol=(0.9, 0.35, 0.5), alpha=a, shadow=False)
    for i in range(12):
        r = 16 * max(0, math.sin(t * 5 + i * 1.9)) * prog(t, 0.8, 1.2)
        sparkle(cr, 250 + hsh(i, 7) * 780, 110 + hsh(i, 8) * 230, r, t, WHITE)


# ======================= HILLTOP (S2/S3) =======================
def hilltop_bg(cr, t, gust):
    sun(cr, 170, 120, 50, t)
    for i, (bx, by, s) in enumerate([(200, 110, 0.9), (650, 70, 0.7), (1000, 160, 1.0), (1350, 90, 0.8)]):
        cloud(cr, (bx + t * 25 + gust * (t - 6.2) * 300) % 1800 - 250, by, s)
    hill_layer(cr, 0, 520, 110, 800, (0.62, 0.85, 0.64), 0.5)
    hill_layer(cr, 300, 600, 80, 600, (0.52, 0.81, 0.50), 1.9)
    pts = [(-400, 700), (-150, 610), (150, 566), (420, 562), (700, 590), (950, 640), (1250, 660), (1750, 690)]
    smooth_path(cr, pts)
    cr.line_to(1750, 1400)
    cr.line_to(-400, 1400)
    cr.close_path()
    fs(cr, (0.44, 0.78, 0.36), 4)
    for (x, y, s) in [(1010, 648, 1.15), (1170, 664, 0.95), (1330, 676, 1.2), (-70, 640, 1.0)]:
        sway = 0.08 * math.sin(t * 2 + x) + gust * (0.45 + 0.15 * math.sin(t * 13 + x))
        tree(cr, x, y, s, sway)
    fl = [(150, 610), (250, 600), (560, 615), (650, 630), (780, 650), (880, 672), (330, 626), (480, 612), (60, 640), (720, 700), (400, 690)]
    for i, (x, y) in enumerate(fl):
        cr.save()
        cr.translate(x, y)
        cr.rotate(0.1 * math.sin(t * 3 + i) + gust * 0.4)
        flower(cr, 0, 0, 1.0, [(1, 0.5, 0.6), (1, 1, 1), (0.7, 0.5, 1), (1, 0.7, 0.2)][i % 4], t * 0.5)
        cr.restore()
    for i in range(14):
        tuft(cr, 40 + i * 95, 700 + hsh(i, 2) * 20)


def wind_streaks(cr, t, g):
    if g <= 0:
        return
    for i in range(8):
        y = 110 + i * 80 + 20 * math.sin(i * 2.3)
        ph = (t * 1.5 + hsh(i, 3)) % 1
        x = lerp(-500, 1500, ph)
        cr.move_to(x, y)
        cr.curve_to(x + 120, y - 25, x + 240, y + 25, x + 360, y)
        cr.curve_to(x + 430, y - 8, x + 430, y - 55, x + 385, y - 50)
        rgb(cr, WHITE, 0.75 * g)
        cr.set_line_width(6)
        cr.set_line_cap(cairo.LINE_CAP_ROUND)
        cr.stroke()


def kite2(t):
    gust = eio(prog(t, 6.2, 6.7))
    kx = 890 + 50 * math.sin(1.3 * t) + gust * 230
    ky = 200 + 30 * math.sin(1.9 * t) - gust * 90
    krot = 0.2 * math.sin(2.3 * t) + gust * (0.3 + 0.15 * math.sin(t * 16))
    return kx, ky, krot, gust


def s2(cr, t):
    kx, ky, krot, gust = kite2(t)
    sky(cr, [(0, (0.45, 0.75, 1.0)), (1, (0.86, 0.95, 1.0))])
    cr.save()
    shx, shy = shake(t, 3 * gust)
    apply_cam(cr, 620, 380, 1.0 + 0.06 * prog(t, T1, T2), 0, shx, shy)
    hilltop_bg(cr, t, gust)
    phase = ((t - T1) / 0.4) % 1
    hop = math.sin(PI * phase) * 28 * (1 - gust)
    sq = max(0, 1 - min(phase, 1 - phase) / 0.12) * (1 - gust)
    px = 420 + gust * 25 + gust * 3 * math.sin(t * 30)
    arms = (lerp(0.35 + 0.25 * math.sin(t * 8), -2.0, gust), lerp(2.3, 2.1, gust))
    pig = draw_pig(cr, px, 562 - hop, 1.0, t, rot=0.22 * gust, sx=1 + 0.1 * sq, sy=1 - 0.12 * sq, arms=arms,
                   expr="determined" if gust > 0.3 else "happy", look=0.5, gaze=(0.6, -0.6), wind=1,
                   wind_amp=0.35 + gust, ear=0.1 * math.sin(t * 10))
    string(cr, *pig["rh"], kx, ky, sag=lerp(40, 4, gust))
    draw_kite(cr, kx, ky, 1.0, krot, t, "cheeky" if gust > 0.5 else "happy",
              tail_ang=lerp(PI * 0.45, PI * 0.08, gust), wave=1 + gust * 1.5)
    wind_streaks(cr, t, gust)
    cr.restore()
    bubble(cr, "飞高高咯～", 575, 245, 40, pop_scale(t, 3.3, 5.8), tail=(-75, 85))
    text(cr, "呼——！", 330, 190, 92, fill=(0.7, 0.9, 1), ring=WHITE, scale=pop_scale(t, 6.3, 7.55),
         rot=-0.12 + 0.03 * math.sin(t * 20))


def s3(cr, t):
    k0x, k0y, _, _ = kite2(T2)
    q1 = eoc(prog(t, 7.6, 8.2))
    q2 = eic(prog(t, 8.2, 10.0))
    kx = k0x + 20 * q1 + 160 * q2
    ky = k0y - 10 * q1 - 170 * q2
    krot = 0.4 + TAU * 1.5 * q1 + 0.3 * math.sin(t * 6)
    ks = 1 - 0.35 * q2
    close = t < 8.3
    sky(cr, [(0, (0.45, 0.75, 1.0)), (1, (0.86, 0.95, 1.0))])
    cr.save()
    if close:
        shx, shy = shake(t, 12 * (1 - prog(t, 7.6, 8.1)))
        apply_cam(cr, 530, 385, 2.0 - 0.1 * prog(t, 7.6, 8.3), 0, shx, shy)
    else:
        e = eoc(prog(t, 8.3, 8.8))
        shx, shy = shake(t, 7 * (1 - prog(t, 9.35, 9.7)) * (t > 9.35))
        apply_cam(cr, lerp(470, 640, e), lerp(420, 360, e), lerp(1.35, 1.0, e), 0, shx, shy)
    hilltop_bg(cr, t, 0.3 * (1 - prog(t, 7.6, 8.6)))
    # pig
    px = 445 - 15 * eoc(prog(t, 7.6, 7.9))
    rot = lerp(0.22, 0, eel(prog(t, 7.6, 8.5)))
    py = 562
    if t < 7.75:
        expr, arms = "determined", (-2.0, 2.1)
    elif t < 9.3:
        expr = "shock"
        arms = (2.3 + 0.12 * math.sin(t * 30), 2.3 + 0.12 * math.sin(t * 30 + 1))
    else:
        expr = "determined"
        arms = (0.5, 2.95)
        py = 562 - 45 * math.sin(PI * prog(t, 9.3, 9.65))
    pig = draw_pig(cr, px, py, 1.0, t, rot=rot, arms=arms, expr=expr, look=0.4, gaze=(0.8, -0.8) if expr == "shock" else (0.5, 0),
                   wind=1, wind_amp=0.6, ear=0.25 * math.sin(t * 25) * (7.75 < t < 9.3))
    # strings
    hx, hy = pig["rh"]
    sp = prog(t, 7.6, 8.3)
    Sx, Sy = lerp(hx, k0x, 0.28), lerp(hy, k0y, 0.28)
    if t < 9.3:
        ex, ey = lerp(Sx, hx + 15, eoc(sp * 1.3)), lerp(Sy, hy + 95, eoc(sp * 1.3))
        string(cr, hx, hy, ex, ey, sag=lerp(0, 20, sp))
    ux = kx + (Sx - k0x) * lerp(1, 0.45, eoc(sp)) + 10 * math.sin(t * 9)
    uy = ky + (Sy - k0y) * lerp(1, 0.45, eoc(sp)) + 60 * eoc(sp)
    string(cr, kx, ky, ux, uy, sag=15)
    draw_kite(cr, kx, ky, ks, krot, t, "cheeky", tail_ang=PI * 0.3, wave=2)
    sc = pop_scale(t, 7.6, 8.28, dur=0.18)
    if sc > 0:
        burst(cr, Sx, Sy, 60 * sc, YEL, t)
        text(cr, "啪！", Sx + 4, Sy, 44, fill=RED, scale=sc, shadow=False)
    if 8.3 < t < 9.3:
        hdx, hdy = pig["head"]
        b = abs(math.sin(t * 12)) * 12
        text(cr, "！", hdx - 50, hdy - 110 - b, 60, fill=RED, ring=WHITE, rot=-0.2)
        text(cr, "！", hdx + 40, hdy - 120 - (12 - b), 70, fill=RED, ring=WHITE, rot=0.2)
    cr.restore()
    if 8.3 < t < 9.1:
        conc_lines(cr, t, 460, 400, 0.35)
    if 9.3 < t < 9.9:
        conc_lines(cr, t, 460, 400, 0.4 * (1 - prog(t, 9.6, 9.9)), col=(1, 0.3, 0.3))
    bubble(cr, "我的风筝！！", 790, 235, 44, pop_scale(t, 8.45, 9.3), tail=(-170, 95))
    text(cr, "冲！", 740, 300, 150, fill=RED, ring=YEL, scale=pop_scale(t, 9.35, dur=0.25), rot=-0.12)
    flash(cr, 1 - prog(t, 7.6, 7.72))


# ======================= S4 CHASE =======================
PIGX, G = 430, 648
JUMPS = [(13.0, 0.6, 150, 0), (14.6, 0.6, 170, 0), (15.9, 1.1, 290, 1)]
LANDS = [12.2, 13.6, 15.2, 17.0]


def dist(t):
    if t < T3:
        return 0.0
    if t < 12:
        return 520 * (t - 10)
    if t < 12.4:
        return 1040 + 520 * (t - 12) + 630 * (t - 12) ** 2 / 0.8
    return 1374 + 1150 * (t - 12.4)


def jump_at(t):
    for (s, d, h, f) in JUMPS:
        if s <= t < s + d:
            return (t - s) / d, h, f
    return None


def pig4(t):
    """return pig state in chase"""
    if t < 11.85:
        return dict(y=G, legs="run", run=(t - 10) * 20, board=False, rot=0.0, air=False)
    if t < 12.2:
        p = prog(t, 11.85, 12.2)
        return dict(y=lerp(G, G - 26, p) - 70 * math.sin(PI * p), legs="tuck", board=False, rot=-0.15 * math.sin(PI * p), air=True)
    j = jump_at(t)
    if j:
        p, h, f = j
        rot = f * TAU * eio(p) if f else -0.25 * math.sin(PI * p)
        return dict(y=G - 26 - 4 * h * p * (1 - p), legs="tuck", board=True, rot=rot, air=True)
    return dict(y=G - 26, legs="crouch", board=True, rot=0.03 * math.sin(t * 9), air=False)


def rock(cr, x, y):
    cr.move_to(x - 42, y + 4)
    cr.curve_to(x - 44, y - 30, x - 20, y - 52, x + 4, y - 50)
    cr.curve_to(x + 30, y - 48, x + 46, y - 24, x + 44, y + 4)
    cr.close_path()
    fs(cr, (0.62, 0.62, 0.7), 4)
    ellipse(cr, x - 12, y - 32, 12, 7)
    rgb(cr, WHITE, 0.4)
    cr.fill()


def log(cr, x, y):
    rrect(cr, x - 70, y - 44, 140, 44, 22)
    fs(cr, (0.62, 0.4, 0.22), 4)
    ellipse(cr, x + 58, y - 22, 14, 22)
    fs(cr, (0.9, 0.72, 0.48), 3.5)
    ellipse(cr, x + 58, y - 22, 6, 10)
    rgb(cr, OL)
    cr.set_line_width(2)
    cr.stroke()
    for k in (-35, 0, 30):
        cr.move_to(x + k - 12, y - 30)
        cr.line_to(x + k + 12, y - 30)
    cr.stroke()


def bush(cr, x, y, s=1.0):
    for bx, by, br in ((0, 0, 90), (-80, 30, 70), (85, 25, 75), (30, -50, 60)):
        cr.new_sub_path()
        cr.arc(x + bx * s, y + by * s, br * s, 0, TAU)
    rgb(cr, OL)
    cr.set_line_width(8)
    cr.stroke_preserve()
    rgb(cr, (0.2, 0.46, 0.24))
    cr.fill()


def s4(cr, t):
    D = dist(t)
    st = pig4(t)
    sky(cr, [(0, (0.45, 0.76, 1.0)), (1, (0.93, 0.97, 1.0))])
    pulse = 0.018 * math.exp(-((t - T3) % 0.4) / 0.07)
    fz = math.sin(PI * prog(t, 15.9, 17.0))
    z = 1 + pulse + 0.2 * fz
    cx, cy = lerp(640, PIGX + 80, fz), lerp(360, st["y"] + 60, fz)
    amp = sum(9 * max(0, 1 - (t - L) / 0.25) for L in LANDS if t >= L)
    shx, shy = shake(t, amp)
    rot = -0.025
    cr.save()
    apply_cam(cr, cx, cy, z, rot, shx, shy, par=0.3)
    sun(cr, 1080, 110, 48, t)
    for i in range(6):
        cloud(cr, (i * 320 - D * 0.05 - t * 30) % 1900 - 300, 80 + hsh(i, 9) * 140, 0.7 + hsh(i, 10) * 0.5)
    hill_layer(cr, D * 0.08, 470, 170, 900, (0.64, 0.73, 0.94), 0.7)
    cr.restore()
    cr.save()
    apply_cam(cr, cx, cy, z, rot, shx, shy)
    hill_layer(cr, D * 0.25, 560, 90, 650, (0.56, 0.84, 0.52), 2.2)
    tree_layer(cr, D * 0.5, 230, 606, 0.75, 1.05, 3, t)
    cr.rectangle(-600, 600, 2600, 900)
    fs(cr, (0.42, 0.74, 0.32), 4)
    for k in range(math.floor((D - 600) / 150), math.floor((D + 1900) / 150)):
        x = k * 150 - D
        cr.move_to(x, 682)
        cr.line_to(x + 50, 682)
        cr.line_to(x + 5, 900)
        cr.line_to(x - 45, 900)
        cr.close_path()
    rgb(cr, (0.3, 0.6, 0.25), 0.35)
    cr.fill()
    cr.rectangle(-600, 618, 2600, 62)
    rgb(cr, (0.95, 0.83, 0.6))
    cr.fill()
    for yy in (618, 680):
        cr.move_to(-600, yy)
        cr.line_to(2000, yy)
    rgb(cr, OL)
    cr.set_line_width(3)
    cr.stroke()
    for k in range(math.floor((D - 600) / 70), math.floor((D + 1900) / 70)):
        if hsh(k, 11) < 0.5:
            ellipse(cr, k * 70 - D + hsh(k, 13) * 40, 630 + hsh(k, 12) * 42, 6, 3.5)
            rgb(cr, (0.8, 0.66, 0.45))
            cr.fill()
    for k in range(math.floor((D - 600) / 55), math.floor((D + 1900) / 55)):
        tuft(cr, k * 55 - D, 604)
    for k in range(math.floor((D - 600) / 130), math.floor((D + 1900) / 130)):
        flower(cr, k * 130 - D + hsh(k, 14) * 60, 720 + hsh(k, 15) * 70, 1.0,
               [(1, 0.5, 0.6), (1, 1, 1), (0.7, 0.5, 1), (1, 0.7, 0.2)][k % 4])
    # obstacles
    rx = dist(13.3) + PIGX - D
    lx = dist(14.9) + PIGX - D
    wx = dist(16.45) + PIGX - D
    if -200 < wx < 1600:
        cr.rectangle(wx - 150, 598, 300, 400)
        fs(cr, (0.36, 0.66, 0.96), 4)
        for k in range(5):
            yy = 640 + k * 26
            off = (t * 120 + k * 40) % 80
            cr.move_to(wx - 130 + off, yy)
            cr.line_to(wx - 80 + off, yy)
            cr.move_to(wx + off, yy + 10)
            cr.line_to(wx + 50 + off, yy + 10)
        rgb(cr, WHITE, 0.7)
        cr.set_line_width(4)
        cr.stroke()
    if -200 < rx < 1600:
        rock(cr, rx, G)
    if -200 < lx < 1600:
        log(cr, lx, G)
    # dust
    step = 0.035
    n0 = math.floor(t / step)
    for k in range(16):
        te = (n0 - k) * step
        age = t - te
        if te < 10.0 or age > 0.55 or pig4(te)["air"]:
            continue
        idx = n0 - k
        ex = PIGX - 45 - age * (380 + hsh(idx, 1) * 220)
        ey = G - 4 - age * (40 + hsh(idx, 2) * 90)
        r = 5 + age * 45
        cr.arc(ex, ey, r, 0, TAU)
        rgb(cr, (0.96, 0.9, 0.78), 0.65 * (1 - age / 0.55))
        cr.fill()
    # skateboard coming in
    if t < 12.2:
        bx = lerp(-200, PIGX, eoc(prog(t, 11.45, 12.15)))
        cr.save()
        cr.translate(bx, G - 26)
        cr.scale(0.85, 0.85)
        skateboard(cr, t * 30)
        cr.restore()
    # pig
    run = st.get("run", 0)
    if st["legs"] == "run":
        arms = (0.6 + 0.6 * math.sin(run), 0.6 - 0.6 * math.sin(run))
    else:
        arms = (1.3 + 0.2 * math.sin(t * 6), 1.5 + 0.2 * math.sin(t * 6 + 1))
    flip = 15.9 < t < 17.0
    if flip:
        arms = (2.7, 2.7)
    draw_pig(cr, PIGX, st["y"], 0.85, t, rot=st["rot"], legs=st["legs"], run=run, arms=arms,
             expr="joy" if flip else "determined", look=0.8, wind=-1, wind_amp=1.3, board=st["board"],
             wheel=t * 30, ear=-0.2)
    # kite
    k = eio(prog(t, 17.0, 17.9))
    kx = lerp(1000 + 60 * math.sin(t * 2.1), 1165, k)
    ky = lerp(170 + 40 * math.sin(t * 2.7), 250, k)
    tx = lerp(1560, 1210, eio(prog(t, 16.9, 17.8)))
    if t > 16.9:
        cr.rectangle(tx - 40, 60, 80, 600)
        fs(cr, (0.56, 0.36, 0.2), 4)
    dangling(cr, kx, ky, t)
    draw_kite(cr, kx, ky, 0.9, 0.2 * math.sin(t * 3) + k * 0.6, t, "cheeky" if k < 0.5 else "scared",
              tail_ang=PI * 0.85, wave=1.6)
    kl = dev2log(cr, kx, ky)
    if t > 16.9:
        for bx_, by_, br in ((0, 0, 170), (-130, 60, 110), (120, 70, 120), (-60, -110, 120), (80, -100, 110)):
            cr.new_sub_path()
            cr.arc(tx + 60 + bx_, 120 + by_, br, 0, TAU)
        rgb(cr, OL)
        cr.set_line_width(10)
        cr.stroke_preserve()
        rgb(cr, (0.3, 0.66, 0.32))
        cr.fill()
        # kite half-hidden: redraw a peeking copy when stuck
        if k > 0.9:
            draw_kite(cr, kx, ky, 0.9, 0.6, t, "scared", tail_ang=PI * 0.85, wave=1.6)
    for kk in range(math.floor((D * 1.5 - 600) / 1000), math.floor((D * 1.5 + 2000) / 1000)):
        x = kk * 1000 - D * 1.5 + hsh(kk, 20) * 300
        if -300 < x < 1600 and kk % 2 == 0:
            bush(cr, x, 790, 1.0)
    cr.restore()
    if t > 12.2:
        speed_lines(cr, t, 22, 0.55)
    text(cr, "嗖——！", 330, 210, 88, fill=ORANGE, ring=WHITE, scale=pop_scale(t, 12.2, 13.0), rot=-0.1)
    text(cr, "哇哦！", 720, 170, 110, fill=(1, 0.5, 0.65), ring=WHITE, scale=pop_scale(t, 16.2, 17.1), rot=0.08)
    if t > 17.5:
        iris(cr, kl[0], kl[1], lerp(1000, 0, eic(prog(t, 17.55, 18.0))))


# ======================= TREE WORLD (S5/S6) =======================
G5 = 640
MX = 1020
KITE5 = (788, -780)


def crown(cr, t):
    cx, cy = 640, -760
    blobs = [(0, 0, 150), (-120, 40, 100), (120, 40, 100), (-70, -90, 105), (80, -95, 100), (0, -140, 90),
             (-160, -30, 72), (165, -25, 72)]
    for bx, by, br in blobs:
        cr.new_sub_path()
        cr.arc(cx + bx + 3 * math.sin(t * 2 + bx), cy + by, br, 0, TAU)
    rgb(cr, OL)
    cr.set_line_width(10)
    cr.stroke_preserve()
    rgb(cr, (0.30, 0.66, 0.32))
    cr.fill()
    for bx, by, br in ((-60, -110, 40), (70, -120, 35), (-110, 20, 30), (20, -30, 45)):
        cr.arc(cx + bx, cy + by, br, 0, TAU)
        rgb(cr, (0.45, 0.8, 0.4), 0.6)
        cr.fill()


def tree_world(cr, t):
    cr.move_to(596, G5 + 4)
    cr.line_to(620, -660)
    cr.line_to(660, -660)
    cr.line_to(684, G5 + 4)
    cr.close_path()
    fs(cr, (0.56, 0.36, 0.2), 5)
    for k in range(14):
        y = G5 - 60 - k * 95
        x = 628 + hsh(k, 3) * 24
        cr.arc(x, y, 10, PI * 0.2, PI * 0.8)
        rgb(cr, OL, 0.5)
        cr.set_line_width(3)
        cr.stroke()
    for side, y in ((-1, 250), (1, -80), (-1, -380)):
        x0 = 640 + side * 25
        x1, y1 = 640 + side * 150, y - 60
        limb(cr, x0, y, x1, y1, 16, (0.56, 0.36, 0.2))
        for bx, by, br in ((0, 0, 48), (side * 38, 10, 36), (-side * 30, -20, 34)):
            cr.new_sub_path()
            cr.arc(x1 + bx, y1 + by, br, 0, TAU)
        rgb(cr, OL)
        cr.set_line_width(8)
        cr.stroke_preserve()
        rgb(cr, (0.33, 0.7, 0.33))
        cr.fill()
    crown(cr, t)


def bg5(cr, t, cx, cy, z):
    h = clamp((380 - cy) / 1100)
    sky(cr, [(0, lerpc((0.5, 0.78, 1), (0.28, 0.5, 0.95), h)), (1, lerpc((0.9, 0.96, 1), (0.55, 0.78, 1), h))])
    cr.save()
    apply_cam(cr, cx, cy, z, par=0.35)
    for i, (bx, by, s) in enumerate([(200, -100, 1), (1000, -300, 0.8), (300, -600, 1.1), (1100, -850, 0.9),
                                     (600, -1100, 1), (150, -1300, 0.8), (950, -1500, 1.1), (500, -1800, 0.9), (800, 60, 0.8)]):
        cloud(cr, (bx + t * 18) % 1700 - 200, by, s)
    hill_layer(cr, 0, 600, 120, 700, (0.6, 0.82, 0.62), 1.3)
    cr.restore()
    cr.save()
    apply_cam(cr, cx, cy, z, par=0.7)
    for i in range(5):
        bird(cr, 300 + i * 180 + (t * 60) % 400, -900 - hsh(i, 5) * 400, 1.2, t * 12 + i)
    cr.restore()


def ground5(cr, t):
    pts = [(-500, G5 + 10), (200, G5), (800, G5 - 4), (1500, G5 + 6), (2200, G5)]
    smooth_path(cr, pts)
    cr.line_to(2200, 1500)
    cr.line_to(-500, 1500)
    cr.close_path()
    fs(cr, (0.44, 0.78, 0.36), 4)
    tree(cr, 150, G5 + 8, 1.0, 0.05 * math.sin(t * 2))
    tree(cr, 1330, G5 + 6, 1.15, 0.05 * math.sin(t * 2 + 1))
    for i in range(12):
        flower(cr, -100 + i * 140 + hsh(i, 6) * 60, G5 + 40 + hsh(i, 7) * 40, 1.0,
               [(1, 0.5, 0.6), (1, 1, 1), (0.7, 0.5, 1), (1, 0.7, 0.2)][i % 4])


def s5(cr, t):
    cy = -560 if t < 18.8 else lerp(-560, 380, eio(prog(t, 18.8, 19.7)))
    cx = lerp(640, 760, eio(prog(t, 20.5, 21.1)))
    z = lerp(1.15, 1.0, eio(prog(t, 18.8, 19.7)))
    bg5(cr, t, cx, cy, z)
    cr.save()
    apply_cam(cr, cx, cy, z)
    ground5(cr, t)
    tree_world(cr, t)
    mushroom(cr, MX, G5, 1.0, 1 + 0.03 * math.sin(t * 6), t)
    kx, ky = KITE5
    dangling(cr, kx, ky, t, 200)
    draw_kite(cr, kx, ky, 0.9, 0.5 + 0.06 * math.sin(t * 9), t, "scared", tail_ang=PI * 0.45)
    kl = dev2log(cr, kx, ky)
    idea = t >= 20.4
    py = G5 - 40 * math.sin(PI * prog(t, 20.4, 20.7))
    arms = (0.3, lerp(0.3, 1.7, eob(prog(t, 20.6, 20.9)))) if idea else (0.12, 0.12)
    pig = draw_pig(cr, 480, py, 0.9, t, arms=arms, expr="idea" if idea else "sad", look=0.4 if idea else 0.3,
                   gaze=(1, 0) if idea else (0.7, -1), wind=1, wind_amp=0.2)
    if idea:
        hx, hy = pig["head"]
        lightbulb(cr, hx, hy - 125, pop_scale(t, 20.4, dur=0.3), t)
    cr.restore()
    bubble(cr, "好……高……", 300, 330, 40, pop_scale(t, 19.75, 20.4), tail=(90, 95))
    if t < 18.5:
        iris(cr, kl[0], kl[1], lerp(0, 1100, eic(prog(t, 18.0, 18.45))))


def pig6(t):
    """pig pose in launch scene"""
    if t < 21.8:
        p = prog(t, T5, 21.8)
        return dict(x=lerp(480, MX, eio(p)), y=lerp(G5, 488, p) - 170 * math.sin(PI * p), legs="tuck", rot=0.0,
                    sx=1, sy=1, arms=(2.4, 2.4), expr="determined", sq=0)
    if t < 22.12:
        sq = eio(prog(t, 21.8, 22.02)) if t < 22.02 else 1 - eoc(prog(t, 22.02, 22.12))
        return dict(x=MX, y=None, legs="crouch", rot=0.0, sx=1 + 0.25 * sq, sy=1 - 0.3 * sq, arms=(1.2, 1.2),
                    expr="determined", sq=sq)
    if t < 23.6:
        q = prog(t, 22.12, 23.6)
        return dict(x=lerp(MX, 674, eio(q)), y=lerp(488, -444, eoc(q)), legs="tuck", rot=-2 * TAU * eoc(q),
                    sx=1 - 0.15 * (1 - q), sy=1 + 0.25 * (1 - q), arms=(2.8, 2.8), expr="joy", sq=0)
    q = prog(t, 23.6, T6)
    return dict(x=674 + 280 * eio(q), y=-444 - 260 * q, legs="dangle",
                rot=0.2 * math.sin((t - 23.6) * 6) * math.exp(-(t - 23.6) * 1.2), sx=1, sy=1,
                arms=(1.9 + 0.4 * math.sin(t * 12), 2.6), expr="joy", sq=0)


def s6(cr, t):
    st = pig6(t)
    y = st["y"] if st["y"] is not None else 488
    if t < 22.12:
        cx, cy, z = lerp(760, 880, eio(prog(t, T5, 21.8))), 380, 1.0
    elif t < 23.6:
        q = prog(t, 22.12, 23.6)
        cx, cy, z = lerp(880, 720, eio(q)), min(380, y - 40), lerp(1.0, 1.1, eio(q))
    else:
        q = prog(t, 23.6, T6)
        cx, cy, z = st["x"] + 40, st["y"] - 60, lerp(1.1, 1.0, q)
    shx, shy = shake(t, 10 * max(0, 1 - (t - 22.05) / 0.3) * (t > 22.05))
    bg5(cr, t, cx, cy, z)
    cr.save()
    apply_cam(cr, cx, cy, z, 0, shx, shy)
    ground5(cr, t)
    tree_world(cr, t)
    # mushroom
    if t < 22.12:
        stt, cs = 1 - 0.35 * st["sq"], 1 - 0.45 * st["sq"]
    else:
        w = prog(t, 22.12, 23.0)
        stt = 1 + 0.35 * math.sin(w * TAU * 2.5) * (1 - w)
        cs = 1 - 0.2 * math.sin(w * TAU * 2.5) * (1 - w)
    top = mushroom(cr, MX, G5, stt, cs, t)
    if st["y"] is None:
        st["y"] = top
    # kite
    grabbed = t >= 23.6
    if grabbed:
        pig = draw_pig(cr, st["x"], st["y"], 0.9, t, rot=st["rot"], sx=st["sx"], sy=st["sy"], legs=st["legs"],
                       arms=st["arms"], expr=st["expr"], look=0.3, wind=-1, wind_amp=0.8)
        hx, hy = pig["rh"]
        kx, ky = hx + 60 + 5 * math.sin(t * 3), hy - 230 + 4 * math.sin(t * 4)
    else:
        kx, ky = KITE5
    bsc = pop_scale(t, 23.6, 24.4, dur=0.2)
    if bsc > 0:
        burst(cr, kx, ky, 170 * bsc, YEL, t, n=16)
    if grabbed:
        string(cr, hx, hy, kx, ky, sag=10)
    else:
        dangling(cr, kx, ky, t, 200)
    draw_kite(cr, kx, ky, 0.9, 0.5 * (1 - prog(t, 23.6, 24.0)) + 0.1 * math.sin(t * 3), t,
              "happy" if grabbed else "scared", tail_ang=PI * 0.9 if grabbed else PI * 0.45, wave=1.3)
    if not grabbed:
        draw_pig(cr, st["x"], st["y"], 0.9, t, rot=st["rot"], sx=st["sx"], sy=st["sy"], legs=st["legs"],
                 arms=st["arms"], expr=st["expr"], look=0.3, wind=-1 if t > 22.12 else 1, wind_amp=0.9)
    else:
        draw_pig(cr, st["x"], st["y"], 0.9, t, rot=st["rot"], sx=st["sx"], sy=st["sy"], legs=st["legs"],
                 arms=st["arms"], expr=st["expr"], look=0.3, wind=-1, wind_amp=0.8)
    age = t - 23.6
    if 0 < age < 0.9:
        for i in range(18):
            a = i * TAU / 18 + 0.2
            d = eoc(age / 0.9) * 260
            sparkle(cr, kx + math.cos(a) * d, ky + math.sin(a) * d, 16 * (1 - age / 0.9), t * 4,
                    [WHITE, YEL, (1, 0.6, 0.75)][i % 3])
    cr.restore()
    if 22.15 < t < 23.45:
        speed_lines(cr, t, 24, 0.55, vertical=True)
    text(cr, "嘣！", 1060, 260, 100, fill=(1, 0.4, 0.3), ring=WHITE, scale=pop_scale(t, 22.05, 22.7, dur=0.2), rot=-0.15)
    text(cr, "抓到啦！", 640, 610, 110, fill=(1, 0.5, 0.65), ring=WHITE, scale=pop_scale(t, 23.65, 25.05),
         rot=0.05 * math.sin(t * 8))
    flash(cr, 0.9 * (1 - prog(t, 23.6, 23.78)) * (t >= 23.6))


# ======================= S7 SUNSET =======================
def pig7(t):
    x = 560 + 30 * math.sin(t * 1.5)
    y = 440 + 20 * math.sin(t * 2.2)
    b = eio(prog(t, 27.5, 28.3))
    return lerp(x, 640, b), lerp(y, 457, b), b


def s7(cr, t):
    sky(cr, [(0, (0.30, 0.22, 0.55)), (0.45, (0.92, 0.45, 0.50)), (0.75, (1.0, 0.66, 0.42)), (1, (1.0, 0.82, 0.5))])
    e = eoc(prog(t, T6, 27.0))
    cx, cy, z = lerp(610, 640, e), lerp(390, 360, e), lerp(1.18, 1.0, e)
    cr.save()
    apply_cam(cr, cx, cy, z, par=0.2)
    sun(cr, 640, 540, 105, t, col=(1, 0.9, 0.55), rays=False, glow=0.8)
    for i, (bx, by, s) in enumerate([(100, 150, 1.0), (500, 90, 0.7), (900, 210, 1.1), (1300, 130, 0.8), (1700, 260, 0.9)]):
        cloud(cr, (bx - t * 60) % 1900 - 300, by, s, col=(1, 0.82, 0.84), shade=(0.93, 0.6, 0.72))
    cr.restore()
    cr.save()
    apply_cam(cr, cx, cy, z)
    hill_layer(cr, t * 60, 560, 110, 700, (0.74, 0.40, 0.54), 1.1)
    hill_layer(cr, t * 140, 640, 90, 520, (0.52, 0.26, 0.46), 2.7)
    hill_layer(cr, t * 300, 730, 70, 400, (0.32, 0.15, 0.34), 0.3)
    for i in range(5):
        bird(cr, 820 + i * 55 + (t - T6) * 30, 150 + (i % 2) * 22 + i * 6, 1.1, t * 12 + i)
    # sparkle trail
    step = 0.05
    n0 = math.floor(t / step)
    for k in range(34):
        te = (n0 - k) * step
        age = t - te
        idx = n0 - k
        px, py, _ = pig7(te)
        sx_ = px - age * 170 + (hsh(idx, 1) - 0.5) * 30
        sy_ = py + 5 + age * 25 + (hsh(idx, 2) - 0.5) * 30
        r = 11 * (1 - age / 1.7) * abs(math.sin(age * 9 + idx))
        sparkle(cr, sx_, sy_, r, age * 3, [WHITE, YEL, (1, 0.7, 0.85)][idx % 3], 0.9)
    px, py, b = pig7(t)
    if t >= 28.0:
        expr = "wink"
    elif t < 27.0:
        expr = "joy"
    else:
        expr = "happy"
    pig = draw_pig(cr, px, py, 0.9, t, rot=0.12 * math.sin(t * 3) * (1 - b), legs="dangle",
                   arms=(lerp(1.9 + 0.4 * math.sin(t * 12), 2.4 + 0.4 * math.sin(t * 16), b), 2.6), expr=expr,
                   look=0.3 * (1 - b), wind=-1, wind_amp=0.8)
    hx, hy = pig["rh"]
    kx, ky = hx + 60 + 5 * math.sin(t * 3), hy - 230 + 4 * math.sin(t * 4)
    string(cr, hx, hy, kx, ky, sag=10)
    draw_kite(cr, kx, ky, 0.9, 0.1 * math.sin(t * 3), t, "happy", tail_ang=PI * 0.92, wave=1.3)
    hdx, hdy = pig["head"]
    for i in range(5):
        ts = 26.3 + i * 0.3
        age = t - ts
        if 0 < age < 1.4:
            heart(cr, hdx - 40 + hsh(i, 3) * 80 + math.sin(age * 5) * 10, hdy - 70 - age * 120,
                  12 * eob(clamp(age * 3)), a=1 - age / 1.4)
    cr.restore()
    text(cr, "一起飞吧～", 640, 650, 60, fill=WHITE, ol=(0.85, 0.3, 0.5), scale=pop_scale(t, 25.9, 27.9))
    if t > 27.9:
        iris(cr, 640, 320, lerp(900, 190, eio(prog(t, 27.95, T7))))
    flash(cr, 1 - prog(t, T6, 25.45))


# ======================= S8 END =======================
def s8(cr, t):
    rgb(cr, (0.10, 0.08, 0.20))
    cr.rectangle(-10, -10, 1300, 740)
    cr.fill()
    for i in range(50):
        sparkle(cr, hsh(i, 1) * 1280, hsh(i, 2) * 720, 3 + 6 * abs(math.sin(t * 3 + i)), 0, WHITE, 0.8)
    R = 190 + 28 * math.sin(PI * prog(t, T7, 28.75))
    cr.save()
    cr.arc(640, 320, R, 0, TAU)
    cr.clip()
    g = cairo.LinearGradient(0, 320 - R, 0, 320 + R)
    g.add_color_stop_rgb(0, 0.92, 0.45, 0.5)
    g.add_color_stop_rgb(1, 1.0, 0.8, 0.5)
    cr.set_source(g)
    cr.paint()
    sp = lerp(0.9, 2.0, eob(prog(t, T7, 28.9), 1.5))
    draw_pig(cr, 640, 320 + 152 * sp, sp, t, arms=(0.3, 2.5 + 0.4 * math.sin(t * 16)), expr="wink", wind=-1, wind_amp=0.5)
    cr.restore()
    cr.arc(640, 320, R, 0, TAU)
    rgb(cr, WHITE)
    cr.set_line_width(14)
    cr.stroke()
    cr.arc(640, 320, R + 9, 0, TAU)
    rgb(cr, (1, 0.55, 0.7))
    cr.set_line_width(6)
    cr.stroke()
    ks = pop_scale(t, 29.05, dur=0.3)
    if ks > 0:
        draw_kite(cr, 640 + R * 0.78, 320 - R * 0.72, 0.9 * ks, 0.3 + 0.1 * math.sin(t * 4), t, "happy",
                  tail_ang=PI * 0.25)
    text(cr, "完", 640, 590, 110, fill=(1, 0.5, 0.65), ring=WHITE, scale=pop_scale(t, 28.95, dur=0.3))
    text(cr, "THE END · 嘟嘟追风筝", 640, 672, 30, fill=WHITE, ol=(0.1, 0.08, 0.2), alpha=prog(t, 29.2, 29.5), shadow=False)
    age = t - 28.95
    if age > 0:
        for i in range(70):
            side = -1 if i % 2 else 1
            x0 = 640 - side * 700
            ang = -PI / 2 + side * (0.25 + hsh(i, 3) * 0.55)
            v = 700 + hsh(i, 4) * 600
            x = x0 + math.cos(ang) * v * age
            y = 740 + math.sin(ang) * v * age + 700 * age * age
            cr.save()
            cr.translate(x, y)
            cr.rotate(age * (6 + hsh(i, 5) * 8))
            cr.scale(1, abs(math.sin(age * 9 + i)))
            cr.rectangle(-7, -4, 14, 8)
            rgb(cr, [(1, 0.45, 0.6), YEL, BLUE, (0.4, 0.85, 0.45), ORANGE, (0.75, 0.5, 1)][i % 6])
            cr.fill()
            cr.restore()
    flash(cr, prog(t, 29.75, 30.0), (0, 0, 0))


# ======================= compositor =======================
def render_frame(t):
    surf = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H)
    cr = cairo.Context(surf)
    cr.scale(SC, SC)
    if t < T1:
        s1(cr, t)
    elif t < T2:
        s2(cr, t)
    elif t < T3:
        s3(cr, t)
    elif t < T4:
        s4(cr, t)
    elif t < T5:
        s5(cr, t)
    elif t < T6:
        s6(cr, t)
    elif t < T7:
        s7(cr, t)
    else:
        s8(cr, t)
    band_wipe(cr, prog(t, 2.55, 3.05))
    band_wipe(cr, prog(t, 9.72, 10.28))
    vignette(cr)
    surf.flush()
    return surf
