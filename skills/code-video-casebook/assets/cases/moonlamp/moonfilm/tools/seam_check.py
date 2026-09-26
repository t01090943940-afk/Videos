#!/usr/bin/env python3
"""
Seam check after a partial re-render  (补全：reconstructed from the conversation)

When only a range of frames is re-rendered (e.g. the seal fix re-rendered 600-641 with
`capture.mjs --range 600:642 --force`), compare the mean absolute grey-level difference of
neighbouring frames across both boundaries. A seam shows up as a jump well above the
frame-to-frame differences around it (in production: 1.87-2.01 everywhere, no jump).

    python3 tools/seam_check.py --around 600,642          # the check that was run
    python3 tools/seam_check.py --pairs 597:598,599:600    # explicit pairs

Requires numpy + Pillow.
"""
import argparse
import os

import numpy as np
from PIL import Image


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", default="out/frames")
    ap.add_argument("--around", help="comma-separated boundary frames b: checks b-3..b+1")
    ap.add_argument("--pairs", help="comma-separated a:b pairs")
    a = ap.parse_args()

    pairs = []
    if a.around:
        for b in map(int, a.around.split(",")):
            pairs += [(b - 3, b - 2), (b - 2, b - 1), (b - 1, b), (b, b + 1)]
    if a.pairs:
        pairs += [tuple(map(int, p.split(":"))) for p in a.pairs.split(",")]
    if not pairs:
        ap.error("give --around or --pairs")

    def f(i):
        return np.asarray(Image.open(os.path.join(a.frames, f"f{i:05d}.jpg")).convert("L"), dtype=np.float32)

    for x, y in pairs:
        print(x, y, round(float(np.abs(f(x) - f(y)).mean()), 3))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
