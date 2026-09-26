"""Smoke test: render first/mid/last frame of every shot; fails loudly on any scene error."""
import render as R, timeline as TL, time
t0 = time.time(); n = 0
for s in TL.SHOTS:
    f0 = int(round(s['b0'] * TL.FPB)); f1 = int(round(s['b1'] * TL.FPB)) - 1
    for f in sorted(set([f0, (f0 + f1) // 2, f1])):
        R.render_frame(f); n += 1
print('ok', n, 'frames', (time.time() - t0) / n, 's/frame')
