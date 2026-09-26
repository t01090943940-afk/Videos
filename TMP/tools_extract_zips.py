# -*- coding: utf-8 -*-
"""Extract every <name>.zip (outside 00-* folders) into <name>/ next to it.

Repairs GBK-encoded member names (zips without the UTF-8 flag) so Chinese
filenames land correctly on disk. Zips themselves are kept in place.
"""
import glob
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
EXCLUDE_DIRS = ("00-supercut-trailer", "00-THE-SOURCE")


def fix_name(info: zipfile.ZipInfo) -> str:
    name = info.filename
    if not (info.flag_bits & 0x800):  # not UTF-8 flagged -> probably GBK
        try:
            name = name.encode("cp437").decode("gbk")
        except (UnicodeEncodeError, UnicodeDecodeError):
            pass
    # zip-slip guard
    parts = [p for p in name.replace("\\", "/").split("/")
             if p not in ("", ".", "..")]
    return "/".join(parts)


def main() -> int:
    zips = [
        p for p in glob.glob(os.path.join(ROOT, "**", "*.zip"), recursive=True)
        if not os.path.relpath(p, ROOT).startswith(EXCLUDE_DIRS)
    ]
    zips.sort()
    total_files = 0
    failures = []

    for zp in zips:
        rel = os.path.relpath(zp, ROOT)
        target = zp[:-4]
        os.makedirs(target, exist_ok=True)
        n = 0
        try:
            with zipfile.ZipFile(zp) as z:
                for info in z.infolist():
                    relname = fix_name(info)
                    if not relname:
                        continue
                    dest = os.path.join(target, *relname.split("/"))
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
        except Exception as e:  # noqa: BLE001
            failures.append((rel, repr(e)))
            print(f"[FAIL] {rel}: {e}")
            continue
        total_files += n
        print(f"[ok] {rel}  ->  {os.path.relpath(target, ROOT)}/  ({n} files)")

    print(f"\n{len(zips) - len(failures)}/{len(zips)} zips extracted, "
          f"{total_files} files total")
    if failures:
        print("FAILURES:", failures)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
