"""Render the first 3 frames + midpoint of every shot and flag frames that read as blank."""
import render as R, timeline as TL, numpy as np, sys
bad = []
for i, s in enumerate(TL.SHOTS):
    f0 = int(round(s['b0'] * TL.FPB)); f1 = int(round(s['b1'] * TL.FPB))
    for f in [f0, f0 + 1, f0 + 2, (f0 + f1) // 2, f1 - 1]:
        img = R.render_frame(f).astype(np.float32)
        luma = img @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        ratio = float((luma > 0.06 * 255).mean())
        if ratio < 0.03:
            bad.append((i, s['scene'], f, round(ratio, 4)))
print('flagged', len(bad))
for b in bad:
    print(b)
