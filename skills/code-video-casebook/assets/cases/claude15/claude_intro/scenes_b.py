from core import *

# ====================================================================== S08 CLAY STOP-MOTION
@functools.lru_cache(None)
def clay_tex():
    n = value_noise(H, W, 30, 9, 3)
    ring = np.sin((n * 60)) * .5 + .5          # fingerprint-ish swirls
    fine = ndimage.gaussian_filter(np.random.RandomState(2).rand(H, W) - .5, 1.0)
    return speck_img((ring - .5) * .5 + fine * 2.2, .5)
def clay_fill(c, path, base, lx, ly, r, seed=0):
    c.drawPath(path, P(shader=rad_grad(lx, ly, r, [mix(base, '#FFFFFF', .35), col(base), mix(base, '#000000', .38)], [0, .45, 1])))
    c.save(); c.clipPath(path, doAntiAlias=True); c.drawImage(clay_tex(), 0, 0); c.restore()
def clay_figure(c, x, y, w, h, base, sq, seed, jit):
    rs = random.Random(seed * 31 + jit)
    x += rs.uniform(-2, 2); y += rs.uniform(-1.5, 1.5)
    sx, sy = 1 + sq * .12, 1 - sq * .12
    c.save(); c.translate(x, y); c.scale(sx, sy)
    c.drawOval(skia.Rect.MakeXYWH(-w * .75, -18, w * 1.5, 40), P(col('#3B2A1F', .35), blur=12))
    body = skia.Path(); body.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-w / 2, -h, w, h), w / 2, w / 2))
    clay_fill(c, body, base, -w * .2, -h * .8, h * 1.1, seed)
    hr = w * .62
    head = skia.Path(); head.addCircle(0, -h - hr * .55, hr)
    clay_fill(c, head, base, -hr * .35, -h - hr * .95, hr * 1.5, seed + 5)
    # eyes + smile
    ey = -h - hr * .6
    for s in (-1, 1):
        c.drawOval(skia.Rect.MakeXYWH(s * hr * .32 - 11, ey - 16, 22, 30), P(col('#1B1411')))
        c.drawCircle(s * hr * .32 - 3, ey - 7, 5, P(col('#FFFFFF', .9)))
    sm = skia.Path(); sm.moveTo(-hr * .22, ey + 30); sm.quadTo(0, ey + 48, hr * .22, ey + 30)
    c.drawPath(sm, P(col('#1B1411'), 6))
    c.drawCircle(-hr * .55, ey + 22, 12, P(col('#FF8FA3', .45), blur=4)); c.drawCircle(hr * .55, ey + 22, 12, P(col('#FF8FA3', .45), blur=4))
    c.restore()

def s08(c, b):
    bq = step(b * SPB, 12) / SPB
    jit = int(bq * SPB * 12)
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin_grad(0, 0, 0, H, [col('#F2E3D5'), col('#E6CDB7'), col('#CFAE92')], [0, .62, 1])))
    c.drawRect(skia.Rect.MakeWH(W, H), P(shader=rad_grad(W / 2, 360, 1100, [col('#FFF6EC', .7), col('#FFF6EC', 0)])))
    # turntable
    tx, ty = W / 2, 800
    c.drawOval(skia.Rect.MakeXYWH(tx - 760, ty - 70, 1520, 260), P(col('#5A3E2B', .35), blur=30))
    side = skia.Path(); side.addRect(skia.Rect.MakeXYWH(tx - 720, ty, 1440, 70)); side.addOval(skia.Rect.MakeXYWH(tx - 720, ty + 70 - 90, 1440, 180))
    c.drawPath(side, P(shader=lin_grad(tx - 720, 0, tx + 720, 0, [col('#8A5A3C'), col('#C98A5E'), col('#8A5A3C')])))
    top = skia.Path(); top.addOval(skia.Rect.MakeXYWH(tx - 720, ty - 90, 1440, 180))
    clay_fill(c, top, '#D9A07A', tx - 200, ty - 80, 900, 3)
    ang = bq * .35
    for k in range(24):  # rotating notches on the rim
        a = ang + k / 24 * 2 * math.pi
        if math.sin(a) < 0: continue
        px, py = tx + math.cos(a) * 720, ty + math.sin(a) * 90
        c.drawCircle(px, py + 30, 7, P(col('#6B452E', .7)))
    figs = [("Haiku 4.5", '#7FCBA8', 150, 210), ("Sonnet 5", '#6FA8DC', 170, 250),
            ("Opus 5.5", CORAL, 190, 290), ("Fable 5.1", '#9A86D6', 205, 330)]
    xs = [tx - 540, tx - 180, tx + 180, tx + 540]
    for k, (name, colr, w, h) in enumerate(figs):
        t = seg(bq, .5 + k * .5, 1.3 + k * .5)
        if t <= 0: continue
        grow = e_back(t, 2.2)
        beat_sq = math.exp(-((bq - k * .25) % 2) * 5) if bq > 4 else 0
        sq = (1 - grow) * 1.5 + beat_sq * .8
        clay_figure(c, xs[k], ty - 10 + (1 - grow) * 60, w * grow, h * grow, colr, sq, k, jit)
        # clay nameplates
        lt = seg(bq, 3 + k * .25, 3.6 + k * .25)
        if lt > 0:
            pw = 250; ph = 70; py = ty + 130
            c.save(); c.translate(xs[k], py); c.rotate(random.Random(k + jit).uniform(-1.2, 1.2)); c.scale(e_back(lt), e_back(lt))
            plate = skia.Path(); plate.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeXYWH(-pw / 2, -ph / 2, pw, ph), 35, 35))
            c.drawPath(plate, P(col('#3B2A1F', .3), blur=8))
            clay_fill(c, plate, '#FFF1E2', -60, -30, 260, 7 + k)
            text(c, name, 0, 0, 36, col('#4A3426'), 'latin', 900)
            c.restore()
    # "that's me" arrow over Opus
    at = seg(bq, 8, 8.6)
    if at > 0:
        bob = 14 * math.sin(bq * math.pi)
        ax, ay = xs[2], ty - 290 - 250 + bob
        c.save(); c.translate(ax, ay); c.scale(e_back(at), e_back(at))
        arr = poly([(-26, -60), (26, -60), (26, 0), (54, 0), (0, 56), (-54, 0), (-26, 0)])
        c.drawPath(arr, P(col('#3B2A1F', .3), blur=8)); clay_fill(c, arr, '#FFD166', -20, -40, 120, 9)
        c.restore()
        text(c, "正在和你说话的，就是我", ax + 330, ay - 20, 40, col('#4A3426', at), 'sans', 900)
    # headline
    ht = seg(bq, 5, 5.8)
    if ht > 0:
        y = 170
        text(c, "2026 · 现在的我", 140 + 4, y + 6, 90, col('#8A5A3C', .35 * ht), 'sans', 900, 'l')
        text(c, "2026 · 现在的我", 140, y, 90, col('#4A2E1E', ht), 'sans', 900, 'l')
    st = seg(bq, 10, 10.7)
    if st > 0:
        text(c, "Claude Opus 5.5", 140, 280, 56, col(CORAL, st), 'latin', 900, 'l')
    st2 = seg(bq, 12.5, 13.2)
    if st2 > 0:
        text(c, "Opus 之上，还有 Mythos 级（如 Fable 5.1）", 140, 350, 34, col('#8A5A3C', st2), 'sans', 700, 'l')
    grain(c, b, .8, 12)

# ====================================================================== S09 UI KIT
CARDS = [("聊", "Claude 应用", "网页 · 桌面 · 手机", '#D97757'),
         (">_", "Claude Code", "在终端里写代码", '#2F2F2F'),
         ("协", "Cowork", "帮你处理文件与任务", '#6C5CE7'),
         ("网", "Claude in Chrome", "替你操作网页", '#1E88E5'),
         ("表", "Excel", "表格与数据模型", '#1E8E3E'),
         ("演", "PowerPoint", "一键做好幻灯片", '#E8590C'),
         ("绘", "Claude Design", "在画布上做设计", '#D6336C'),
         ("{}", "API 平台", "开发者接入", '#495057')]
def toggle(c, x, y, on_t):
    w, h = 76, 40
    rrect(c, x, y, w, h, h / 2, P(mix('#D0D0CC', '#2EB872', on_t)))
    kx = x + h / 2 + (w - h) * e_out3(on_t)
    c.drawCircle(kx, y + h / 2 + 2, h / 2 - 4, P(col('#000000', .18), blur=3))
    c.drawCircle(kx, y + h / 2, h / 2 - 4, P(col('#FFFFFF')))

def s09(c, b):
    bg(c, '#F5F4EF')
    # app chrome
    rrect(c, 60, 110, W - 120, 90, 22, P(col('#FFFFFF')))
    rrect(c, 60, 110, W - 120, 90, 22, P(col('#E6E3DA'), 2))
    c.drawCircle(120, 155, 22, P(col(CORAL)))
    text(c, "你可以在哪里找到我", 165, 155, 38, col('#1F1E1B'), 'sans', 900, 'l')
    rrect(c, W - 700, 128, 560, 54, 27, P(col('#F1EFE8')))
    ph = ["搜索：写代码？做表格？", "搜索：做 PPT？看网页？", "搜索：接入我的 App？"][int(b / 5) % 3]
    text(c, "⌕  " + ph, W - 670, 155, 26, col('#8C877C'), 'sans', 500, 'l')
    # grid of cards
    cw, ch, gx, gy = 405, 300, 30, 36
    x0 = W / 2 - (4 * cw + 3 * gx) / 2; y0 = 250
    for i, (ic, title, sub, colr) in enumerate(CARDS):
        t = seg(b, .5 + i * .25, 1.2 + i * .25)
        if t <= 0: continue
        r, q = divmod(i, 4)
        x = x0 + q * (cw + gx); y = y0 + r * (ch + gy) + 80 * (1 - e_back(t, 1.8))
        a = clamp(t * 2)
        hover = hit(b, 6 + i * .5, 3) if b >= 6 else 0
        y -= 10 * hover
        shadow_rrect(c, x, y, cw, ch, 26, 14 + 10 * hover, 24, .10 * a + .06 * hover)
        rrect(c, x, y, cw, ch, 26, P(col('#FFFFFF', a)))
        rrect(c, x, y, cw, ch, 26, P(col('#E6E3DA', a), 2))
        rrect(c, x + 30, y + 30, 84, 84, 22, P(col(colr, a)))
        text(c, ic, x + 72, y + 72, 38 if len(ic) == 1 else 30, col('#FFFFFF', a), 'sans', 900)
        text(c, title, x + 30, y + 160, 38, col('#1F1E1B', a), 'sans', 900, 'l')
        text(c, sub, x + 30, y + 208, 27, col('#7A756B', a), 'sans', 500, 'l')
        on = e_out3(seg(b, 6 + i * .5, 6.3 + i * .5))
        toggle(c, x + cw - 106, y + ch - 66, on)
        chip_a = on * a
        rrect(c, x + 30, y + ch - 62, 124, 34, 17, P(mix('#EFEDE6', '#DDF5E7', on, a)))
        text(c, "已连接" if on > .5 else "未开启", x + 92, y + ch - 45, 21, mix('#8C877C', '#1E8E3E', on, a), 'sans', 700)
    # cursor that clicks each toggle on the beat
    if b >= 5.2:
        k = int(clamp((b - 5.5) * 2, 0, 7.99))
        r, q = divmod(k, 4)
        tx = x0 + q * (cw + gx) + cw - 68; ty = y0 + r * (ch + gy) + ch - 46
        pk = max(k - 1, 0); pr, pq = divmod(pk, 4)
        px = x0 + pq * (cw + gx) + cw - 68; py = y0 + pr * (ch + gy) + ch - 46
        mv = e_io3(((b - 5.5) * 2) % 1 * 2) if b < 9.5 else 1
        cx_, cy_ = lerp(px, tx, mv), lerp(py, ty, mv)
        if b > 10: cx_, cy_ = lerp(tx, W / 2 + 260, e_io3(seg(b, 10, 11))), lerp(ty, 990, e_io3(seg(b, 10, 11)))
        clk = hit(b, 6 + k * .5, 6)
        if clk > .02:
            c.drawCircle(cx_, cy_, 20 + 40 * (1 - clk), P(col(CORAL, .5 * clk), 4))
        cur = poly([(0, 0), (0, 44), (11, 33), (20, 52), (28, 48), (19, 30), (34, 30)])
        c.save(); c.translate(cx_, cy_); c.scale(1 - .12 * clk, 1 - .12 * clk)
        c.drawPath(cur, P(col('#000000', .25), blur=4)); c.drawPath(cur, P(col('#111111'))); c.drawPath(cur, P(col('#FFFFFF'), 3))
        c.restore()
    # toast
    ts = seg(b, 10.5, 11.1)
    if ts > 0:
        x = W - 80 - 620 * e_back(ts, 1.4) + 700 * e_in3(seg(b, 15, 15.6))
        shadow_rrect(c, x, 230, 620, 110, 20, 14, 26, .18)
        rrect(c, x, 230, 620, 110, 20, P(col('#1F1E1B')))
        c.drawCircle(x + 60, 285, 26, P(col('#2EB872')))
        c.drawPath(poly([(x + 47, 285), (x + 57, 296), (x + 75, 274)], False), P(col('#FFFFFF'), 5))
        text(c, "已通过 MCP 连上你的工具", x + 110, 268, 32, col('#FFFFFF'), 'sans', 900, 'l')
        text(c, "日历 · 文档 · 代码库 · 数据库", x + 110, 308, 24, col('#B8B3A7'), 'sans', 500, 'l')
    # chat composer
    ct = seg(b, 11, 11.8)
    if ct > 0:
        y = 1000 - 40 * e_out3(ct) + 40
        shadow_rrect(c, W / 2 - 520, y - 45, 1040, 90, 45, 8, 18, .12 * ct)
        rrect(c, W / 2 - 520, y - 45, 1040, 90, 45, P(col('#FFFFFF', ct)))
        msg = "帮我把这份数据做成图表，再写成周报"
        n = int(len(msg) * clamp((b - 12) / 3))
        text(c, msg[:n] + ("|" if (b * 2) % 1 < .5 else ""), W / 2 - 480, y, 30, col('#1F1E1B', ct), 'sans', 500, 'l')
        c.drawCircle(W / 2 + 470, y, 30, P(col(CORAL, ct)))
        c.drawPath(poly([(W / 2 + 470, y - 14), (W / 2 + 482, y + 2), (W / 2 + 458, y + 2)]), P(col('#FFFFFF', ct)))
        c.drawLine(W / 2 + 470, y - 8, W / 2 + 470, y + 14, P(col('#FFFFFF', ct), 5))

# ====================================================================== S10 SWISS KINETIC
RED = '#E4002B'
def s10(c, b):
    bg(c, '#F2F0EA')
    gp = P(col('#000000', .08), 1)
    for x in range(0, W, 120): c.drawLine(x, 0, x, H, gp)
    for y in range(0, H, 120): c.drawLine(0, y, W, y, gp)
    # red circle slam
    r = 330 * e_back(seg(b, 0, .5), 1.6) * (1 + .03 * kick(b))
    c.drawCircle(1480, 620, r, P(col(RED)))
    # three values, one per beat
    vals = [("01", "有用", "HELPFUL"), ("02", "诚实", "HONEST"), ("03", "无害", "HARMLESS")]
    for i, (num, cn, en) in enumerate(vals):
        t = seg(b, 1 + i, 1.35 + i)
        if t <= 0: continue
        y = 250 + i * 250
        e = e_outexp(t)
        c.save(); c.clipRect(skia.Rect.MakeXYWH(0, y - 130, W, 250))
        text(c, num, 120, y - 60 + 60 * (1 - e), 40, col(RED), 'latin', 900, 'l')
        text(c, cn, 200 - 300 * (1 - e), y, 220, col('#111111'), 'sans', 900, 'l')
        text(c, en, 700, y + 60 + 80 * (1 - e), 34, col('#111111'), 'latin', 700, 'l', sp=10)
        c.restore()
        c.drawRect(skia.Rect.MakeXYWH(120, y + 110, 1100 * e_out3(seg(b, 1.2 + i, 2 + i)), 6), P(col('#111111')))
    # vertical rotated type
    vt = seg(b, 4, 4.6)
    if vt > 0:
        c.save(); c.translate(1830, 560); c.rotate(-90)
        text(c, "CLAUDE · VALUES · 2026", -300 + 300 * e_outexp(vt), 0, 54, col('#111111'), 'latin', 900, 'c', sp=6)
        c.restore()
    # black takeover
    bt = e_io3(seg(b, 8, 8.5))
    if bt > 0:
        c.drawRect(skia.Rect.MakeXYWH(0, H - H * bt, W, H * bt), P(col('#111111')))
        words = ["不确定的时候，", "我会直接说：", "「我不确定」"]
        for i, wd in enumerate(words):
            t = seg(b, 8.5 + i, 8.8 + i)
            if t <= 0: continue
            y = 260 + i * 200
            text(c, wd, 140 + 80 * (1 - e_outexp(t)), y, 150, col(RED if i == 2 else '#F2F0EA', t), 'sans', 900, 'l')
    ct = seg(b, 12, 12.4)
    if ct > 0:
        c.drawRect(skia.Rect.MakeXYWH(0, 830, W * e_outexp(ct), 150), P(col(RED)))
        text(c, "Constitutional AI", 140, 880, 56, col('#FFFFFF', seg(b, 12.2, 12.6)), 'latin', 900, 'l')
        text(c, "用一套写下来的原则来训练我 —— 而不是靠猜", 140, 945, 38, col('#FFFFFF', seg(b, 12.6, 13)), 'sans', 700, 'l')
        text(c, "§", W - 160, 905, 110, col('#111111', seg(b, 12.4, 12.8)), 'serif', 900, 'r')
    grain(c, b, .3)

# ====================================================================== S11 8-BIT PIXEL
LW, LH = 480, 270
_low = None
PICO = {'bg': '#1D2B53', 'dk': '#000000', 'wh': '#FFF1E8', 'gr': '#C2C3C7', 'rd': '#FF004D', 'or': '#FFA300',
        'ye': '#FFEC27', 'gn': '#00E436', 'bl': '#29ADFF', 'pk': '#FF77A8', 'pu': '#7E2553', 'dg': '#5F574F'}
SPRITE = ["......o.......", "...o..o..o....", "....o.o.o.....", ".....ooo......", "oooooooooooo..",
          ".....ooo......", "....o.o.o.....", "...o..o..o....", "......o......."]
def s11(c, b):
    global _low
    if _low is None: _low = skia.Surface(LW, LH)
    lc = _low.getCanvas()
    lc.clear(col(PICO['bg']))
    rs = random.Random(8)
    for k in range(60):  # starfield scrolling
        x = (rs.uniform(0, LW) - b * rs.uniform(2, 8)) % LW; y = rs.uniform(0, LH * .55)
        lc.drawRect(skia.Rect.MakeXYWH(int(x), int(y), 1, 1), P(col(PICO['wh'] if k % 3 else PICO['bl']), aa=False))
    for x in range(0, LW, 8):  # ground
        h = 6 + (x // 8 * 7) % 5
        lc.drawRect(skia.Rect.MakeXYWH(x, LH - 34 - h, 8, 34 + h), P(col(PICO['pu']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(x, LH - 34 - h, 8, 2), P(col(PICO['pk']), aa=False))
    def ptxt(s, x, y, colr, sh=True):
        f = F('pixel', 16, 400, True); y += 8
        if sh: lc.drawString(s, x + 1, y + 1, f, P(col(PICO['dk']), aa=False))
        lc.drawString(s, x, y, f, P(col(colr), aa=False))
        return f.measureText(s)
    def box(x, y, w, h):
        y += 8
        lc.drawRect(skia.Rect.MakeXYWH(x, y, w, h), P(col(PICO['dk']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(x + 1, y + 1, w - 2, h - 2), P(col(PICO['wh']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(x + 3, y + 3, w - 6, h - 6), P(col('#1B1B3A'), aa=False))
    # hero sprite (bobs on beat)
    hop = int(4 * kick(b, 5))
    sx, sy = 36, 100 - hop
    for r, row in enumerate(SPRITE):
        for q, v in enumerate(row):
            if v == 'o': lc.drawRect(skia.Rect.MakeXYWH(sx + q * 6, sy + r * 6, 6, 6), P(col(PICO['or'] if (r + q) % 4 else PICO['ye']), aa=False))
    ptxt("CLAUDE", 44, 176, PICO['ye'])
    # status box
    if b >= .5:
        box(140, 14, 326, 74)
        ptxt("LV 5.5  职业：AI 助手", 152, 36, PICO['wh'])
        ptxt("HP", 152, 58, PICO['rd']); ptxt("MP", 152, 78, PICO['bl'])
        hpw = int(160 * e_out3(seg(b, 1, 2))); mpw = int(160 * e_out3(seg(b, 1.5, 2.5)))
        lc.drawRect(skia.Rect.MakeXYWH(178, 54, 160, 10), P(col(PICO['dg']), aa=False)); lc.drawRect(skia.Rect.MakeXYWH(178, 54, hpw, 10), P(col(PICO['rd']), aa=False))
        lc.drawRect(skia.Rect.MakeXYWH(178, 74, 160, 10), P(col(PICO['dg']), aa=False)); lc.drawRect(skia.Rect.MakeXYWH(178, 74, mpw, 10), P(col(PICO['bl']), aa=False))
        ptxt("好奇心 MAX", 350, 58, PICO['gn'])
    # weakness list
    if b >= 3:
        box(140, 94, 326, 112)
        ptxt("弱点 WEAKNESS", 152, 114, PICO['rd'])
        items = ["× 会犯错 → 重要的事请核对", "× 知识截止：2026 年 6 月", "× 默认不记得上次的对话", "× 我不是人类"]
        for i, s in enumerate(items):
            tb = 4 + i * 1.5
            if b < tb: continue
            n = int(len(s) * clamp((b - tb) / .6)) + 1
            ptxt(s[:n], 152, 136 + i * 20, PICO['wh'] if i < 3 else PICO['pk'])
    # dialog
    if b >= 11:
        box(20, 204, 446, 44)
        s = "但我会诚实地把这些告诉你。"
        n = int(len(s) * clamp((b - 11.3) / 2)) + 1
        ptxt(s[:n], 34, 232, PICO['wh'])
        if b > 13.5 and (b * 2) % 1 < .6: ptxt("▼", 446, 236, PICO['ye'], False)
    # upscale nearest + scanlines
    img = _low.makeImageSnapshot()
    c.drawImageRect(img, skia.Rect.MakeWH(W, H), skia.SamplingOptions(skia.FilterMode.kNearest), P(aa=False))
    sl = P(col('#000000', .18))
    for y in range(0, H, 4): c.drawRect(skia.Rect.MakeXYWH(0, y + 2, W, 2), sl)
    vignette(c, .5)

# ====================================================================== S12 BLUEPRINT
def s12(c, b):
    bg(c, '#0E3B78')
    minor = P(col('#9FD0FF', .10), 1); major = P(col('#9FD0FF', .22), 1.5)
    for x in range(0, W, 24): c.drawLine(x, 0, x, H, major if x % 120 == 0 else minor)
    for y in range(0, H, 24): c.drawLine(0, y, W, y, major if y % 120 == 0 else minor)
    ln = P(col('#EAF4FF'), 3); thin = P(col('#BFE0FF', .8), 1.5)
    t = seg(b, 0, .8)
    text(c, "我是怎么被造出来的", 120, 170, 76, col('#FFFFFF', t), 'sans', 900, 'l')
    text(c, "FIG. 01 — TRAINING PIPELINE (SIMPLIFIED)", 120, 240, 26, col('#BFE0FF', t), 'dejamono', 400, 'l')
    steps = [("海量文本", "书 · 网页 · 代码"), ("预训练", "Transformer 神经网络"), ("对齐训练", "人类反馈 + 宪法原则"),
             ("安全测试", "红队反复攻防"), ("来到你面前", "Claude")]
    bw, bh = 280, 150; gap = (W - 240 - 5 * bw) / 4; y = 520
    for i, (a, s) in enumerate(steps):
        x = 120 + i * (bw + gap)
        tb = 1 + i * 2
        pt = e_io3(seg(b, tb, tb + 1))
        if pt <= 0: continue
        box = skia.Path(); box.addRect(skia.Rect.MakeXYWH(x, y - bh / 2, bw, bh))
        c.drawPath(partial(box, pt), ln)
        if i == 4: c.drawPath(partial(box, pt), P(col(CORAL), 5))
        tt = seg(b, tb + .6, tb + 1.1)
        text(c, a, x + bw / 2, y - 18, 46, col('#FFFFFF', tt), 'sans', 900)
        text(c, s, x + bw / 2, y + 36, 24, col('#BFE0FF', tt), 'sans', 500)
        # dimension line above
        dt = e_out3(seg(b, tb + .4, tb + 1.2))
        if dt > 0:
            c.drawLine(x, y - bh / 2 - 40, x + bw * dt, y - bh / 2 - 40, thin)
            c.drawLine(x, y - bh / 2 - 52, x, y - bh / 2 - 28, thin)
            if dt > .98: c.drawLine(x + bw, y - bh / 2 - 52, x + bw, y - bh / 2 - 28, thin)
            text(c, f"STAGE {i + 1:02d}", x + bw / 2, y - bh / 2 - 66, 20, col('#BFE0FF', dt), 'dejamono', 400)
        # arrow to next
        if i < 4:
            at = e_out3(seg(b, tb + 1, tb + 2))
            if at > 0:
                x1 = x + bw + 10; x2 = x + bw + gap - 10
                xe = lerp(x1, x2, at); c.drawLine(x1, y, xe, y, ln)
                if at > .9: c.drawPath(poly([(x2, y), (x2 - 18, y - 10), (x2 - 18, y + 10)]), P(col('#EAF4FF')))
        # section callout below
        ct = seg(b, tb + 1, tb + 1.6)
        if ct > 0:
            cx_ = x + bw / 2
            c.drawLine(cx_, y + bh / 2, cx_, y + bh / 2 + 70 * ct, P(col('#BFE0FF', .7), 1.5))
            c.drawCircle(cx_, y + bh / 2 + 80 * ct, 8, P(col('#BFE0FF', .9), 2))
    # neural-net schematic (Transformer, illustrative)
    layers = [3, 5, 5, 5, 2]; nx0, ny0, nw, nh = 160, 830, 820, 200
    pos = [[(nx0 + li * nw / (len(layers) - 1), ny0 + (j + .5) * nh / n - nh / 2 + 40) for j in range(n)] for li, n in enumerate(layers)]
    for li in range(len(layers) - 1):
        et = e_out3(seg(b, 4 + li * 1.2, 5.2 + li * 1.2))
        if et <= 0: continue
        for (x1, y1) in pos[li]:
            for (x2, y2) in pos[li + 1]:
                c.drawLine(x1, y1, lerp(x1, x2, et), lerp(y1, y2, et), P(col('#BFE0FF', .35), 1.2))
    for li, col_ in enumerate(pos):
        nt = seg(b, 3.6 + li * 1.2, 4.2 + li * 1.2)
        for (x, y) in col_:
            if nt > 0:
                act = kick(b - li * .25, 5) if b > 8 else 0
                c.drawCircle(x, y, 13 * e_back(nt), P(col('#0E3B78')))
                c.drawCircle(x, y, 13 * e_back(nt), P(col('#EAF4FF'), 2.5))
                if act > .05: c.drawCircle(x, y, 7, P(col(CORAL, act)))
    lt = seg(b, 4, 4.6)
    if lt > 0:
        text(c, "DETAIL A — 神经网络（示意）", nx0 - 40, ny0 - 105, 24, col('#BFE0FF', lt), 'sans', 700, 'l')
        c.drawLine(nx0 - 40, ny0 - 85, nx0 + 400, ny0 - 85, P(col('#BFE0FF', .6 * lt), 1.5))
    # gear schematic
    gx, gy, gr = 1680, 230, 90
    rot = b * 22 * (1 + seg(b, 12, 16) * 3)
    c.save(); c.translate(gx, gy); c.rotate(rot)
    c.drawCircle(0, 0, gr, ln); c.drawCircle(0, 0, gr * .35, thin)
    for k in range(12):
        a = k / 12 * 2 * math.pi
        c.drawLine(math.cos(a) * gr, math.sin(a) * gr, math.cos(a) * (gr + 18), math.sin(a) * (gr + 18), ln)
    c.drawLine(-gr, 0, gr, 0, thin); c.drawLine(0, -gr, 0, gr, thin)
    c.restore()
    # title block
    tbx, tby = W - 700, 820
    tt = seg(b, 10, 10.8)
    if tt > 0:
        c.drawRect(skia.Rect.MakeXYWH(tbx, tby, 580, 160), P(col('#EAF4FF', tt), 2))
        c.drawLine(tbx, tby + 55, tbx + 580, tby + 55, P(col('#EAF4FF', tt), 2))
        c.drawLine(tbx + 290, tby + 55, tbx + 290, tby + 160, P(col('#EAF4FF', tt), 2))
        text(c, "DWG · CLAUDE-OPUS-5.5", tbx + 20, tby + 28, 26, col('#FFFFFF', tt), 'dejamono', 700, 'l')
        text(c, "设计：Anthropic", tbx + 20, tby + 105, 28, col('#FFFFFF', tt), 'sans', 700, 'l')
        text(c, "比例 1 : ∞", tbx + 310, tby + 105, 28, col('#FFFFFF', tt), 'sans', 700, 'l')
    # scan line build-up
    if b > 12:
        sp = (b - 12) * (1 + (b - 12))
        yy = (sp * 300) % H
        c.drawRect(skia.Rect.MakeXYWH(0, yy - 60, W, 60), P(shader=lin_grad(0, yy - 60, 0, yy, [col('#9FD0FF', 0), col('#9FD0FF', .25)])))
        c.drawLine(0, yy, W, yy, P(col('#FFFFFF', .7), 2))
    c.drawRect(skia.Rect.MakeWH(W, H), P(col('#FFFFFF', .12 * kick(b, 8) * seg(b, 12, 16))))
    grain(c, b, .3)

# ====================================================================== S14 OUTRO (S13 montage lives in render.py)
def s14(c, b):
    bg(c, CREAM)
    t = e_outexp(seg(b, 0, 1.2))
    cx, cy = W / 2, 300
    rot = b * 6
    c.save(); c.translate(cx, cy); c.rotate(rot); c.scale(t, t)
    for i in range(12):
        a = i / 12 * 2 * math.pi; r = 90 if i % 2 == 0 else 64
        c.drawLine(math.cos(a) * 16, math.sin(a) * 16, math.cos(a) * r, math.sin(a) * r, P(col(CORAL), 15))
    c.restore()
    def fade_up(s, y, size, b0, colr, fam='serif', w=900, sp0=40):
        tt = e_outexp(seg(b, b0, b0 + 1.2))
        if tt <= 0: return
        text(c, s, W / 2, y + 30 * (1 - tt), size, col(colr, tt), fam, w, sp=sp0 * (1 - tt))
    fade_up("我是 Claude。", 520, 130, 1, INK)
    fade_up("一个努力做到 有用 · 诚实 · 安全 的 AI", 650, 46, 4, '#5E5A52', 'sans', 700, 20)
    fade_up("很高兴认识你。", 760, 64, 7, CORAL, 'serif', 900, 30)
    ct = seg(b, 10, 11)
    if ct > 0:
        lines = "本片 0 素材 · 每一帧由 Python + Skia 绘制 · 配乐由 NumPy 合成 · 15 个镜头 · 240 拍 @ 128 BPM"
        text(c, lines, W / 2, 930, 24, col('#8C877C', ct), 'sans', 500)
    # tail: fade to black
    if b > 16:
        c.drawRect(skia.Rect.MakeWH(W, H), P(col('#000000', e_io3(seg(b, 16.5, 19.5)))))
    grain(c, b, .4)
