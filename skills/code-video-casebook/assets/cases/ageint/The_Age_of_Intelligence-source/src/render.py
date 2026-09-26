"""Frame renderer: scene dispatch, beat-reactive post, HUD, subtitles, ffmpeg piping."""
import sys, json, math, argparse, subprocess, time
import numpy as np, cv2
import timeline as TL
import core as C
import scenes as SC

import os
AN = json.load(open(os.path.join(TL.BUILD, 'audio_analysis.json')))
KICKS = np.array(AN['kicks'])
RMS = np.array(AN['rms']); LOW = np.array(AN['low'])
IMPACTS = [64, 128, 176, 184]


class Ctx:
    pass


def kick_env(b, tau=0.09):
    past = KICKS[KICKS <= b + 1e-6]
    if len(past) == 0:
        return 0.0
    dt = (b - past[-1]) * TL.BEAT
    return math.exp(-dt / tau)


def find_shot(f):
    b = f / TL.FPB
    for i, s in enumerate(TL.SHOTS):
        if s['b0'] <= b + 1e-9 < s['b1']:
            return i, s
    return len(TL.SHOTS) - 1, TL.SHOTS[-1]


def chapter_at(b):
    cur = TL.CHAPTERS[0]
    for c in TL.CHAPTERS:
        if b >= c[0]:
            cur = c
    return cur


# ---------------------------------------------------------------- overlays
def draw_hud(cv, b, f, ctx):
    a = 0.55 * ctx.post.get('hud', 1.0)
    if a <= 0.01:
        return
    col = (0.75, 0.82, 0.95)
    # corner brackets
    L, m = 26, 40
    for (x, y, sx, sy) in ((m, m, 1, 1), (C.W - m, m, -1, 1), (m, C.H - m, 1, -1), (C.W - m, C.H - m, -1, -1)):
        C.rect(cv, x, y, x + sx * L, y + sy * 2, col, a * 0.8)
        C.rect(cv, x, y, x + sx * 2, y + sy * L, col, a * 0.8)
    C.draw_text(cv, 'THE AGE OF INTELLIGENCE', 'm7', 15, 80, 62, col, a, 'lm', tracking=0.18)
    num, name = chapter_at(b)[1], chapter_at(b)[2]
    C.draw_text(cv, f'{num} / {name}', 'm7', 15, C.W - 80, 62, col, a, 'rm', tracking=0.18)
    secs = f / TL.FPS
    tc = f'{int(secs // 60):02d}:{int(secs % 60):02d}:{int(f % TL.FPS):02d}'
    C.draw_text(cv, tc, 'm4', 15, 80, C.H - 62, col, a * 0.9, 'lm', tracking=0.12)
    bar = int(b // 4) + 1; beat = int(b % 4) + 1
    C.draw_text(cv, f'BAR {bar:02d}.{beat}  ·  {TL.BPM:.2f} BPM', 'm4', 15, C.W - 80, C.H - 62, col, a * 0.9, 'rm',
                tracking=0.12)
    # progress line
    p = f / (TL.N_FRAMES - 1)
    C.rect(cv, 300, C.H - 63, C.W - 420, C.H - 62, (0.3, 0.35, 0.45), a * 0.6)
    C.rect(cv, 300, C.H - 64, 300 + (C.W - 720) * p, C.H - 61, C.CYAN, a * 1.2)
    # year badge
    if ctx.year_badge:
        yb, alpha = ctx.year_badge
        C.draw_text(cv, yb, 'anton', 64, 80, 128, C.WHITE, alpha, 'lm')
        C.rect(cv, 80, 168, 80 + 60 * alpha, 171, C.CYAN, alpha)


def draw_subs(cv, b, inv=False):
    for s in TL.SUBS:
        b0, b1, en, zh = s
        if b0 <= b < b1:
            prev = [q for q in TL.SUBS if abs(q[1] - b0) < 1e-6]
            fin = C.e_out3((b - b0) / 0.35)
            if prev:  # adjoining subtitle: swap instantly with a small slide, no dip to empty
                fin = 0.55 + 0.45 * fin
            fout = C.clamp01((b1 - b) / 0.2)
            nxt = [q for q in TL.SUBS if abs(q[0] - b1) < 1e-6]
            if nxt:
                fout = 1.0
            a = fin * fout
            if b1 >= TL.END_BEAT - 1:
                a = fin
            dy = (1 - fin) * 10
            y_en, y_zh = C.H - 150 + dy, C.H - 108 + dy
            # soft shadow plate
            for txt, fk, sz, y, cjk in ((en, 'i6', 31, y_en, None), (zh, 'sc5', 28, y_zh, 'sc5')):
                m, base, _, pad = C.text_mask(txt, fk, sz, 0.0, cjk)
                sh = cv2.GaussianBlur(m, (0, 0), 6) * 0.85
                tw = m.shape[1]
                C.blend(cv, np.clip(sh * 1.6, 0, 1), int(C.W / 2 - tw / 2), int(y - base + sz * 0.36), (1, 1, 1) if inv else (0, 0, 0), a * (0.6 if inv else 0.9))
            C.draw_text(cv, en, 'i6', 31, C.W / 2, y_en, (0.04, 0.05, 0.08) if inv else (0.97, 0.98, 1.0), a, 'mm')
            C.draw_text(cv, zh, 'sc5', 28, C.W / 2, y_zh, (0.0, 0.25, 0.4) if inv else (0.62, 0.90, 1.0), a * 0.95, 'mm', cjk='sc5')
            return


# ---------------------------------------------------------------- frame
def render_frame(f):
    b = f / TL.FPB
    si, shot = find_shot(f)
    ctx = Ctx()
    ctx.f = f; ctx.b = b; ctx.shot = shot; ctx.si = si
    ctx.tb = b - shot['b0']; ctx.dur_b = shot['b1'] - shot['b0']
    ctx.t = ctx.tb * TL.BEAT; ctx.dur = ctx.dur_b * TL.BEAT
    ctx.p = ctx.tb / ctx.dur_b
    ctx.sec = TL.section_at(b)
    ctx.kick = kick_env(b)
    ctx.rms = float(RMS[min(f, len(RMS) - 1)]); ctx.low = float(LOW[min(f, len(LOW) - 1)])
    ctx.rng = np.random.default_rng(si * 1000 + 17)
    ctx.post = dict(punch=0.0, shake=0.0, ca=0.0, flash=0.0, bloom=0.85, thr=0.55, glitch=0.0, invert=False,
                    rblur=0.0, hud=1.0, rot=0.0, grain=0.026)
    ctx.year_badge = None
    ctx.year_fly = None
    cv = C.BG_MAIN.copy()
    ctx.cv = cv
    SC.SCENES[shot['scene']](ctx)
    cv = ctx.cv
    P = ctx.post

    # ---- automatic beat-driven motion
    energetic = ctx.sec in ('drop1', 'drop2', 'build1', 'build2')
    fl = ctx.tb * TL.FPB  # frames since cut
    if energetic:
        P['punch'] += 0.028 * ctx.kick
        P['ca'] += 7 * math.exp(-fl / 4)
        P['punch'] += 0.05 * math.exp(-fl / 3.5)
    elif ctx.sec == 'verse':
        P['punch'] += 0.012 * ctx.kick
        P['ca'] += 3 * math.exp(-fl / 4)
    for ib in IMPACTS:
        d = (b - ib) * TL.BEAT
        if 0 <= d < 1.2:
            P['flash'] += 0.75 * math.exp(-d / 0.09)
            P['shake'] += 16 * math.exp(-d / 0.25)
            P['ca'] += 14 * math.exp(-d / 0.18)
            P['rblur'] += 0.05 * math.exp(-d / 0.1)

    C.bloom(cv, P['thr'], P['bloom'])
    if P['rblur'] > 0.003:
        cv = C.radial_blur(cv, P['rblur'])
    if P['glitch'] > 0:
        C.glitch_slices(cv, P['glitch'], f * 7 + 3, n=int(6 + P['glitch'] / 4))
    sh = P['shake']
    r = np.random.default_rng(f)
    dx, dy = (r.normal(0, sh * 0.6), r.normal(0, sh * 0.6)) if sh > 0.3 else (0, 0)
    sc = 1 + P['punch'] + (0.01 + sh / 900 if sh > 0.3 else 0)
    cv = C.zoom_frame(cv, sc, dx, dy, P['rot'])
    cv = C.chroma(cv, P['ca'])
    if P['invert']:
        cv = (1.0 - np.clip(cv, 0, 1)) * np.array([0.80, 0.84, 0.88], np.float32) + 0.015
    if P['flash'] > 0.001:
        cv += P['flash'] * np.array([0.9, 0.95, 1.0], np.float32)
    cv *= C.VIGNETTE
    cv = C.tonemap(cv)
    cv += C.GRAIN[f % 6] * P['grain']
    draw_hud(cv, b, f, ctx)
    if ctx.year_fly:
        SC.draw_year_fly(cv, ctx.year_fly)
    draw_subs(cv, b, P['invert'])
    return np.clip(cv * 255 + 0.5, 0, 255).astype(np.uint8)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--start', type=int, default=0)
    ap.add_argument('--end', type=int, default=TL.N_FRAMES)
    ap.add_argument('--out', default=os.path.join(TL.BUILD, 'out.mp4'))
    ap.add_argument('--stills', default='')
    ap.add_argument('--scale', type=float, default=1.0)
    a = ap.parse_args()
    if a.stills:
        for tok in a.stills.split(','):
            f = int(round(float(tok[1:]) * TL.FPB)) if tok.startswith('b') else int(tok)
            t0 = time.time()
            img = render_frame(f)
            print(f'frame {f} ({time.time() - t0:.2f}s)', flush=True)
            if a.scale != 1:
                img = cv2.resize(img, None, fx=a.scale, fy=a.scale, interpolation=cv2.INTER_AREA)
            os.makedirs(os.path.join(TL.BUILD, 'stills'), exist_ok=True)
            cv2.imwrite(os.path.join(TL.BUILD, 'stills', f'f{f:05d}.png'), img[..., ::-1])
        return
    cmd = ['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{C.W}x{C.H}', '-r',
           str(TL.FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p',
           '-x264-params', 'keyint=60', a.out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.time()
    for f in range(a.start, a.end):
        p.stdin.write(render_frame(f).tobytes())
        if (f - a.start) % 60 == 0:
            el = time.time() - t0
            print(f'{a.out}: {f - a.start}/{a.end - a.start}  {el:.0f}s', flush=True)
    p.stdin.close(); p.wait()
    print('done', a.out, time.time() - t0)


if __name__ == '__main__':
    main()
