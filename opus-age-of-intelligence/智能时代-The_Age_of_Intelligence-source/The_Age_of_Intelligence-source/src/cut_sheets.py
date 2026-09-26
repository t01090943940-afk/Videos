"""[补全] QA contact sheets: grab frame (cut + 2) of every shot from a rendered video, 16 per sheet.
usage: python3 src/cut_sheets.py build/AGE_OF_INTELLIGENCE_1080p60.mp4
"""
import os, sys, glob, subprocess
import cv2, numpy as np
import timeline as TL

video = sys.argv[1]
d = os.path.join(TL.BUILD, 'cuts'); os.makedirs(d, exist_ok=True)
for f in glob.glob(os.path.join(d, 'c*.png')):
    os.remove(f)
frames = [int(round(s['b0'] * TL.FPB)) + 2 for s in TL.SHOTS]
sel = '+'.join(f'eq(n\\,{f})' for f in frames)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', video, '-vf', f"select='{sel}',scale=480:270",
                '-vsync', '0', os.path.join(d, 'c%03d.png')], check=True)
files = sorted(glob.glob(os.path.join(d, 'c*.png')))
for k in range(0, len(files), 16):
    ims = [cv2.imread(f) for f in files[k:k + 16]]
    for i, im in enumerate(ims):
        s = TL.SHOTS[k + i]
        cv2.putText(im, f"{k + i} b{s['b0']} {s['scene']}", (6, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
    while len(ims) < 16:
        ims.append(np.zeros_like(ims[0]))
    grid = np.vstack([np.hstack(ims[r * 4:(r + 1) * 4]) for r in range(4)])
    cv2.imwrite(os.path.join(TL.BUILD, f'cutsheet{k // 16}.png'), grid)
print('sheets written to', TL.BUILD)
