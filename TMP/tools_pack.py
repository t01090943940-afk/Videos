# -*- coding: utf-8 -*-
"""Build AI-Coding-SuperVideos-pack-<date>.zip at project root.

Excludes: .git, 00-supercut-trailer/, 00-THE-SOURCE/, every *.zip,
all video files (.mp4/.mkv/.mov/...). Includes the extracted <name>/
folders produced by tools_extract_zips.py.
"""
import os
import sys
import time
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
STAMP = time.strftime("%Y%m%d")
OUT = os.path.join(ROOT, f"AI-Coding-SuperVideos-pack-{STAMP}.zip")
TOP = "AI-Coding-SuperVideos"

EXCLUDE_TOP = {".git", "00-supercut-trailer", "00-THE-SOURCE"}
VIDEO_EXTS = {
    ".mp4", ".mkv", ".mov", ".avi", ".webm", ".wmv", ".flv", ".m4v",
    ".mpg", ".mpeg", ".m2ts", ".mts", ".3gp", ".vob",
}


def iter_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_dir = os.path.relpath(dirpath, ROOT)
        top = rel_dir.split(os.sep)[0]
        if rel_dir != "." and top in EXCLUDE_TOP:
            dirnames[:] = []
            continue
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_TOP]
        for fn in sorted(filenames):
            ext = os.path.splitext(fn)[1].lower()
            if ext == ".zip" or ext in VIDEO_EXTS:
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT)
            yield full, TOP + "/" + rel.replace(os.sep, "/")


def main() -> int:
    files = list(iter_files())
    total = sum(os.path.getsize(f) for f, _ in files)
    print(f"{len(files)} files, {total / 1e6:.1f} MB uncompressed -> {os.path.basename(OUT)}")

    written = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED,
                         compresslevel=6, allowZip64=True) as z:
        for full, arc in files:
            z.write(full, arc)
            written += 1
            if written % 500 == 0:
                print(f"  {written}/{len(files)}", flush=True)

    size = os.path.getsize(OUT)
    print(f"done: {OUT}  ({size / 1e6:.1f} MB, {written} files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
