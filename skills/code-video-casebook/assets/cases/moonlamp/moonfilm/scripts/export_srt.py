#!/usr/bin/env python3
"""
Export the film's on-screen text as an SRT subtitle file  (added for the source package)

The render does NOT use this file: every character is drawn into the picture by
src/mg/subtitles.ts, with text and timing from src/timeline.ts. This SRT is a plain-text copy of
the same cues (e.g. for a player, an edit, or a translation), exported from the page's meta().

    python3 scripts/export_srt.py [--meta out/meta.json] [--out subtitles/subtitles.zh-CN.srt]

Each line runs from its first segment to its `out` time (the moment it starts to fade). The end
card is split where the 加油 seal and the inscription appear. UTF-8, no BOM.
"""
import argparse
import json
from pathlib import Path


def ts(t: float) -> str:
    ms = round(t * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--out", default="subtitles/subtitles.zh-CN.srt")
    a = ap.parse_args()
    meta = json.loads(Path(a.meta).read_text(encoding="utf-8"))
    c = meta["cues"]
    end = meta["total"] / meta["fps"]

    cues = [(s["segs"][0]["at"], s["out"], "".join(g["text"] for g in s["segs"])) for s in c["subs"]]
    title, seal, insc = c["title"], c["seal"], c["inscription"]
    cues += [
        (title["at"], seal["at"], title["text"]),
        (seal["at"], insc["at"], f"{title['text']}【{seal['text']}】"),
        (insc["at"], end, f"{title['text']}【{seal['text']}】\n{insc['text']}"),
    ]

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    blocks = [f"{i}\n{ts(t0)} --> {ts(t1)}\n{text}\n" for i, (t0, t1, text) in enumerate(cues, 1)]
    out.write_text("\n".join(blocks), encoding="utf-8")
    print(f"{len(cues)} cues -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
