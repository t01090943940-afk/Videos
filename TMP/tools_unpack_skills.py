# -*- coding: utf-8 -*-
"""Extract each dist/*.skill into skills/<basename>/, stripping the inner
top-level folder name and repairing GBK-encoded member names."""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, "dist")
SKILLS = os.path.join(ROOT, "skills")


def fix_name(info):
    name = info.filename
    if not (info.flag_bits & 0x800):
        try:
            name = name.encode("cp437").decode("gbk")
        except (UnicodeEncodeError, UnicodeDecodeError):
            pass
    parts = [p for p in name.replace("\\", "/").split("/")
             if p not in ("", ".", "..")]
    return parts


def main():
    os.makedirs(SKILLS, exist_ok=True)
    for fn in sorted(os.listdir(DIST)):
        if not fn.endswith(".skill"):
            continue
        base = fn[:-6]  # strip .skill
        target = os.path.join(SKILLS, base)
        n = 0
        with zipfile.ZipFile(os.path.join(DIST, fn)) as z:
            for info in z.infolist():
                parts = fix_name(info)
                if len(parts) < 2:  # only keep entries under the top folder
                    continue
                rel = parts[1:]  # strip 'code-video-casebook/' prefix
                dest = os.path.join(target, *rel)
                if info.is_dir() or info.filename.endswith("/"):
                    os.makedirs(dest, exist_ok=True)
                    continue
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                with z.open(info) as src, open(dest, "wb") as out:
                    while True:
                        chunk = src.read(1 << 20)
                        if not chunk:
                            break
                        out.write(chunk)
                n += 1
        print(f"[ok] {fn} -> skills/{base}/ ({n} files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
