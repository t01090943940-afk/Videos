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
