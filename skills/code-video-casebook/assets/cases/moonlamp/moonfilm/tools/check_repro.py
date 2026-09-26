#!/usr/bin/env python3
"""
Compare a fresh render with the original one  (added for the source package)

reference/ holds the sha256 of every original frame (frames.sha256), of the original audio
(audio.sha256) and the original meta.json. This script reports how much of out/ is byte-identical.

    python3 tools/check_repro.py [--frames out/frames] [--audio out/audio]

Byte-identical output needs the same renderer: Chromium 141.0.7390.37 with SwiftShader on Linux
x86_64, fontconfig's usual Ubuntu hinting defaults (hintslight), and numpy/scipy builds that round
the same way. On another OS/GPU/Chromium the frames look the same but differ at pixel level,
which is expected; use tools/seam_check.py or scripts/kit/compare_frames.py to judge by eye/diff.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "reference"


def sha(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def read_sums(p: Path) -> dict:
    out = {}
    for line in p.read_text().splitlines():
        if line.strip():
            h, name = line.split(maxsplit=1)
            out[name.strip()] = h
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", default=str(ROOT / "out" / "frames"))
    ap.add_argument("--audio", default=str(ROOT / "out" / "audio"))
    ap.add_argument("--meta", default=str(ROOT / "out" / "meta.json"))
    a = ap.parse_args()
    ok_all = True

    meta = Path(a.meta)
    if meta.exists():
        same = json.loads(meta.read_text(encoding="utf-8")) == json.loads((REF / "meta.json").read_text(encoding="utf-8"))
        print(f"meta.json      : {'identical' if same else 'DIFFERENT'} to reference/meta.json")
        ok_all &= same

    ref = read_sums(REF / "frames.sha256")
    frames = Path(a.frames)
    present = [n for n in sorted(ref) if (frames / n).exists()]
    diff = [n for n in present if sha(frames / n) != ref[n]]
    print(f"frames         : {len(present) - len(diff)}/{len(present)} present frames byte-identical "
          f"({len(ref) - len(present)} of {len(ref)} not rendered yet)")
    if diff:
        print("                 differing:", ", ".join(diff[:12]) + (" …" if len(diff) > 12 else ""))
    ok_all &= not diff

    aref = read_sums(REF / "audio.sha256")
    for name, h in aref.items():
        p = Path(a.audio) / name
        if p.exists():
            same = sha(p) == h
            print(f"audio {name:14s}: {'identical' if same else 'DIFFERENT'}")
            ok_all &= same

    print("result         :", "bit-exact so far" if ok_all else "differs from the original render (see above)")
    return 0 if ok_all else 1


if __name__ == "__main__":
    raise SystemExit(main())
