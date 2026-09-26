#!/usr/bin/env python3
"""Consistency check for the code-video-casebook skill. Prints ALL OK, or one BAD line per problem.

Usage: python3 check_consistency.py [casebook_dir]

Default target is the sibling skill skills/code-video-casebook, resolved relative to this
file's location — no absolute paths, works on any machine. No third-party dependencies.
Exit code 0 = ALL OK, 1 = problems found or target missing.
"""
import glob
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[2] / "code-video-casebook"
if not (ROOT / "SKILL.md").exists():
    sys.exit(f"casebook skill not found at {ROOT}")


def frontmatter(text: str) -> dict:
    """Parse `key: value` frontmatter; values are written as JSON by convention."""
    try:
        block = text.split("---")[1]
    except IndexError:
        return {}
    d = {}
    for line in block.splitlines():
        m = re.match(r"(\w+):\s*(.+)", line)
        if not m:
            continue
        v = m.group(2).strip()
        try:
            d[m.group(1)] = json.loads(v)
        except ValueError:
            d[m.group(1)] = v.strip('"')
    return d


os.chdir(ROOT)
bad = []
ids = set(os.listdir("assets/cases"))
allids = set(os.listdir("references/cases"))
idx = {c["id"]: c for c in json.load(open("references/index.json", encoding="utf-8"))["cases"]}
docs = ["SKILL.md"]
docs += [p.as_posix() for p in Path("references").glob("*.md")]
docs += [p.as_posix() for p in Path("references/cases").glob("*/CARD.md")]

for p in docs:
    t = open(p, encoding="utf-8").read()
    if p.endswith("CARD.md"):
        d = frontmatter(t)
        cid = p.split("/")[-2]
        if d.get("id") != cid:
            bad.append((p, "frontmatter id"))
        m = re.search(r"`CoExp\.md`（(\d+) 行", t)
        if m and idx[cid]["coexp"] and int(m.group(1)) != idx[cid]["coexp"]["lines"]:
            bad.append((p, "CoExp 行数"))
    for m in re.finditer(r"`([^`\s]+)`", t):  # 源码路径存在性
        s = m.group(1)
        if s.split("/")[0] in ids and "/" in s:
            mm = re.match(r"(.*)\{([^}]*)\}(.*)", s)
            expanded = [mm.group(1) + x.strip() + mm.group(3) for x in mm.group(2).split(",")] if mm else [s]
            for c in expanded:
                if not glob.glob("assets/cases/" + c.replace("…", "*")):
                    bad.append((p, c))
    for m in re.finditer(r"`?([a-z0-9-]+)`? CoExp L(\d+)", t):  # CoExp 行号有效
        f = f"references/cases/{m.group(1)}/CoExp.md"
        if not os.path.exists(f) or int(m.group(2)) > len(open(f, encoding="utf-8").read().split("\n")):
            bad.append((p, m.group(0)))
    # 相对链接有效；先剥掉代码围栏和行内代码，里面的 `](` 不是链接
    plain = re.sub(r"```.*?```", "", t, flags=re.S)
    plain = re.sub(r"`[^`\n]*`", "", plain)
    for m in re.finditer(r"\]\(([^)#]+)\)", plain):
        if not m.group(1).startswith("http") and not os.path.exists(os.path.join(os.path.dirname(p), m.group(1))):
            bad.append((p, m.group(1)))

sk = open("SKILL.md", encoding="utf-8").read()
fm = frontmatter(sk)
desc = fm.get("description") or ""
if len(desc) > 1024 or re.search(r"<[^>]+>", desc):
    bad.append(("SKILL.md", "description"))
if len(sk.splitlines()) >= 500:
    bad.append(("SKILL.md", "行数"))
missing = allids - set(re.findall(r"references/cases/([^/)]+)/CARD\.md", sk))
if missing:
    bad.append(("SKILL.md 路由表缺少", missing))

for b in bad:
    print("BAD", b)
print("ALL OK" if not bad else f"{len(bad)} problems")
sys.exit(1 if bad else 0)
