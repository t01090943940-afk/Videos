#!/usr/bin/env python3
"""Visual regression for sets: diff two keyframe folders rendered from the same frames.

Use it after editing a shared set/kit asset: render the set tour (and episodes that use the set)
before and after, then see exactly which shots changed and by how much.

usage: python compare_frames.py <before_dir> <after_dir> [--threshold 0.5] [--diff-out diffs/]
  threshold = % of pixels allowed to change before a frame is flagged (default 0.5)
Renders are bit-identical on the same machine + renderer when the scene is a pure function of
frame; across machines/GPUs expect tiny noise, so keep a small threshold instead of 0.
Requires Pillow.
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("Pillow is required: pip install pillow")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("before")
    ap.add_argument("after")
    ap.add_argument("--threshold", type=float, default=0.5)
    ap.add_argument("--diff-out")
    a = ap.parse_args()
    exts = {".jpg", ".jpeg", ".png"}
    for d in (a.before, a.after):
        if not Path(d).is_dir():
            sys.exit(f"not a folder: {d}")
    before = {p.name: p for p in Path(a.before).iterdir() if p.suffix.lower() in exts}
    after = {p.name: p for p in Path(a.after).iterdir() if p.suffix.lower() in exts}
    flagged = 0
    for name in sorted(before.keys() | after.keys()):
        if name not in before or name not in after:
            print(f"{'ONLY-IN-' + ('AFTER' if name in after else 'BEFORE'):<14}{name}")
            flagged += 1
            continue
        x, y = Image.open(before[name]).convert("RGB"), Image.open(after[name]).convert("RGB")
        if x.size != y.size:
            print(f"{'SIZE':<14}{name} {x.size} -> {y.size}")
            flagged += 1
            continue
        diff = ImageChops.difference(x, y).convert("L").point(lambda v: 255 if v > 24 else 0)
        pct = 100.0 * diff.histogram()[255] / (x.width * x.height)
        tag = "CHANGED" if pct > a.threshold else "same"
        flagged += pct > a.threshold
        print(f"{tag:<14}{name}  {pct:6.2f}% pixels")
        if a.diff_out and pct > a.threshold:
            Path(a.diff_out).mkdir(parents=True, exist_ok=True)
            overlay = Image.blend(y, Image.new("RGB", y.size, (255, 0, 80)), 0.0)
            overlay.paste((255, 0, 80), mask=diff)
            Image.blend(y, overlay, 0.6).save(Path(a.diff_out) / name)
    print(f"\n{flagged} frame(s) flagged of {len(before.keys() | after.keys())}")
    return 1 if flagged else 0


if __name__ == "__main__":
    raise SystemExit(main())
