#!/usr/bin/env python3
"""casebook.py - find, read and copy the code-video cases in this skill. Stdlib only, Python 3.8+.

  python3 scripts/casebook.py list                          # every case: id, spec, title, stack
  python3 scripts/casebook.py search "卡点|beat" [--case ai-rise,kimi-beat] [--in card,coexp,source,refs] [--glob '*.py'] [-C 1] [--max 60]
  python3 scripts/casebook.py where oneink                  # paths of CARD / CoExp / FILES / preview / source dir
  python3 scripts/casebook.py files oneink                  # source files with line counts and one-line summaries
  python3 scripts/casebook.py show oneink main.js [--lines 100:180]    # print one source file (exact path, suffix or glob)
  python3 scripts/casebook.py show oneink CoExp.md --lines 448:472     # or the case's CARD.md / CoExp.md / FILES.md
  python3 scripts/casebook.py copy oneink ./work/oneink [--only 'src/*']   # copy the original project out to work on it
  python3 scripts/casebook.py verify [case]                 # sha256 of every source file against references/index.json

Works on both builds of this skill: the standard one (source unzipped under assets/cases/<id>/) and the
claude.ai one (source packed into assets/cases/<id>/SOURCE.md because claude.ai allows <=200 files).
Search is a case-insensitive Python regex; long inline base64 runs are ignored.
"""
from __future__ import annotations

import argparse
import fnmatch
import hashlib
import json
import re
import shutil
import signal
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / "references"
CASEREFS = REFS / "cases"
ASSETS = ROOT / "assets" / "cases"
FILE_RE = re.compile(r"^<!-- casebook-file (\{.*\}) -->$")
B64_RUN = re.compile(r"[A-Za-z0-9+/=]{200,}")

if hasattr(signal, "SIGPIPE"):  # quiet exit when piped into head/less
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)


def load_index() -> dict:
    p = REFS / "index.json"
    if not p.exists():
        die("references/index.json missing - regenerate with tools/build_casebook.py")
    return {c["id"]: c for c in json.loads(p.read_text(encoding="utf-8"))["cases"]}


INDEX = load_index()


def need_case(cid: str) -> dict:
    if cid in INDEX:
        return INDEX[cid]
    close = [c for c in INDEX if cid.lower() in c.lower() or cid.lower() in INDEX[c]["title"].lower()]
    die(f"unknown case '{cid}'. " + (f"Did you mean: {', '.join(close)}" if close else f"Known: {', '.join(INDEX)}"))


def frontmatter(path: Path) -> dict:
    """Tiny reader for the `key: value` lines between --- fences (values are JSON; plain text also accepted)."""
    if not path.exists():
        return {}
    lines = path.read_text(encoding="utf-8").split("\n")
    if not lines or lines[0].strip() != "---":
        return {}
    out = {}
    for ln in lines[1:]:
        if ln.strip() == "---":
            break
        m = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", ln)
        if m:
            v = m.group(2).strip()
            try:  # cards store values as JSON (valid YAML): "text" or ["a", "b"]
                out[m.group(1)] = json.loads(v)
            except ValueError:
                out[m.group(1)] = [x.strip() for x in v[1:-1].split(",") if x.strip()] if v.startswith("[") and v.endswith("]") else v
    return out


class Source:
    """Uniform access to one case's source, whether unzipped or bundled."""

    def __init__(self, cid: str):
        self.cid = cid
        self.dir = ASSETS / cid
        self.bundle = self.dir / "SOURCE.md"
        self.mode = "bundle" if self.bundle.exists() else ("dir" if self.dir.is_dir() else "none")
        self._metas = None
        self._lines = None

    def _load_bundle(self):
        if self._metas is None:
            self._lines = self.bundle.read_bytes().decode("utf-8").split("\n")
            self._metas, i = [], 0
            while i < len(self._lines):
                m = FILE_RE.match(self._lines[i])
                if m:
                    meta = json.loads(m.group(1))
                    meta["start"] = i + 2
                    self._metas.append(meta)
                    i += 2 + meta["lines"] + 1
                else:
                    i += 1
        return self._metas

    def text_paths(self) -> list[str]:
        if self.mode == "bundle":
            return [m["path"] for m in self._load_bundle()]
        return [f["path"] for f in INDEX[self.cid]["files"] if f["kind"] == "text"]

    def all_paths(self) -> list[str]:
        if self.mode == "bundle":
            return self.text_paths()
        return [f["path"] for f in INDEX[self.cid]["files"]]

    def read_bytes(self, path: str) -> bytes:
        if self.mode == "dir":
            return (self.dir / path).read_bytes()
        for m in self._load_bundle():
            if m["path"] == path:
                body = self._lines[m["start"]: m["start"] + m["lines"]]
                return ("\n".join(body) + ("\n" if m["final_newline"] else "")).encode("utf-8")
        raise KeyError(path)

    def read_text(self, path: str) -> str:
        return self.read_bytes(path).decode("utf-8")

    def resolve(self, query: str) -> list[str]:
        paths = self.all_paths()
        if query in paths:
            return [query]
        if any(c in query for c in "*?["):
            return [p for p in paths if fnmatch.fnmatch(p, query) or fnmatch.fnmatch(p, "*/" + query)]
        return [p for p in paths if p.endswith("/" + query) or p.endswith(query)]


# ------------------------------------------------------------------ commands

def cmd_list(_a) -> None:
    print(f"{'id':16s} {'C S P':6s} {'spec':30s} title  ·  stack")
    for cid, c in INDEX.items():
        fm = frontmatter(CASEREFS / cid / "CARD.md")
        src = Source(cid)
        flags = " ".join(["C" if c["coexp"] else "-", "S" if src.mode != "none" else "-", "P" if c["preview"] else "-"])
        stack = fm.get("stack", [])
        stack = ", ".join(stack) if isinstance(stack, list) else stack
        print(f"{cid:16s} {flags:6s} {fm.get('spec', '')[:30]:30s} {fm.get('title', c['title'])}  ·  {stack}")
    print("\nC = references/cases/<id>/CoExp.md (original retrospective)   S = assets/cases/<id>/ (original source)   P = preview.jpg"
          "\nCases without S keep all their code inside CoExp.md.  Details: references/cases/<id>/CARD.md")


def _hit_lines(lines, rx, C, label, out, max_hits):
    for i, ln in enumerate(lines):
        probe = B64_RUN.sub(" ", ln) if len(ln) > 400 else ln
        m = rx.search(probe)
        if not m:
            continue
        out.append(f"{label}:{i + 1}")
        for j in range(max(0, i - C), min(len(lines), i + C + 1)):
            t = lines[j] if j != i else probe
            if len(t) > 220:
                a = max(0, (m.start() if j == i else 0) - 70)
                t = ("…" if a else "") + t[a:a + 220] + "…"
            out.append(("  > " if j == i else "    ") + t)
        if sum(1 for x in out if not x.startswith(" ")) >= max_hits:
            return True
    return False


def cmd_search(a) -> None:
    try:
        rx = re.compile(a.pattern, re.I)
    except re.error as e:
        die(f"bad regex: {e}")
    cases = [x for x in a.case.split(",") if x] or list(INDEX)
    groups = set(a.within.split(","))
    out: list[str] = []
    if "refs" in groups and not a.case:
        for p in sorted(REFS.glob("*.md")):
            if _hit_lines(p.read_text(encoding="utf-8").split("\n"), rx, a.C, f"references/{p.name}", out, a.max):
                break
    for cid in cases:
        need_case(cid)
        d = CASEREFS / cid
        done = False
        for name, grp in (("CARD.md", "card"), ("FILES.md", "card"), ("CoExp.md", "coexp")):
            if grp in groups and (d / name).exists() and not done:
                done = _hit_lines((d / name).read_text(encoding="utf-8").split("\n"), rx, a.C,
                                  f"references/cases/{cid}/{name}", out, a.max)
        if "source" in groups and not done:
            src = Source(cid)
            for path in src.text_paths():
                if a.glob and not fnmatch.fnmatch(path, a.glob) and not fnmatch.fnmatch(Path(path).name, a.glob):
                    continue
                if _hit_lines(src.read_text(path).split("\n"), rx, a.C, f"assets/cases/{cid}/{path}", out, a.max):
                    done = True
                    break
        if sum(1 for x in out if not x.startswith(" ")) >= a.max:
            out.append(f"… stopped at --max {a.max} hits (narrow with --case / --in / --glob, or raise --max)")
            break
    print("\n".join(out) if out else "no hits")


def cmd_where(a) -> None:
    c = need_case(a.case)
    d = CASEREFS / a.case
    src = Source(a.case)
    rows = [("CARD", d / "CARD.md"), ("CoExp", d / "CoExp.md"), ("FILES", d / "FILES.md"), ("preview", d / "preview.jpg"),
            ("source", src.dir if src.mode == "dir" else src.bundle)]
    for k, p in rows:
        if p.exists():
            print(f"{k:8s} {p.relative_to(ROOT).as_posix()}" + (f"   ({src.mode})" if k == "source" else ""))
    if src.mode == "none":
        print("source   (none - this case's code lives inside CoExp.md)")
    if c["coexp"]:
        print(f"original CoExp file name: {c['coexp']['original']}")
    print(f"original folder in the repo: {c['folder']}/")


def cmd_files(a) -> None:
    c = need_case(a.case)
    src = Source(a.case)
    if src.mode == "none":
        print(f"{a.case} has no separate source: read references/cases/{a.case}/CoExp.md (its code is embedded there)")
        return
    for f in c["files"]:
        if f["kind"] == "text":
            print(f"{f['lines']:6d} lines {f['bytes'] / 1024:8.1f} KB  {f['path']}" + (f"  — {f['summary']}" if f.get("summary") else ""))
        elif src.mode == "dir":
            print(f"{'':6s} {f['kind']:5s} {f['bytes'] / 1024:8.1f} KB  {f['path']}")
    if c["omitted"]:
        print(f"\n{len(c['omitted'])} binaries not included (video/audio/large fonts/QA images): see references/cases/{a.case}/FILES.md")


def print_text(text: str, lines: str | None) -> None:
    if lines:
        s, _, e = lines.partition(":")
        ls = text.split("\n")
        s, e = int(s or 1), int(e or len(ls))
        text = "\n".join(f"{k:5d}  {ls[k - 1]}" for k in range(max(1, s), min(e, len(ls)) + 1)) + "\n"
    sys.stdout.write(text if text.endswith("\n") else text + "\n")


def cmd_show(a) -> None:
    need_case(a.case)
    ref = {"card": "CARD.md", "coexp": "CoExp.md", "files": "FILES.md"}.get(re.sub(r"\.md$", "", a.path.lower()))
    if ref:  # the case's retrieval card, original CoExp or file index
        p = CASEREFS / a.case / ref
        if not p.exists():
            die(f"{a.case} has no {ref} (see: casebook.py where {a.case})")
        print_text(p.read_text(encoding="utf-8"), a.lines)
        return
    src = Source(a.case)
    if src.mode == "none":
        die(f"{a.case} has no separate source; read it with: casebook.py show {a.case} CoExp.md")
    hits = src.resolve(a.path)
    if not hits:
        die(f"no file matches '{a.path}'. Try: casebook.py files {a.case}")
    if len(hits) > 1 and not a.all:
        print("several files match; pick one (or pass --all):\n  " + "\n  ".join(hits), file=sys.stderr)
        sys.exit(2)
    for h in hits:
        data = src.read_bytes(h)
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            print(f"{h}: binary file ({len(data)} bytes) at assets/cases/{a.case}/{h}")
            continue
        if len(hits) > 1:
            print(f"===== {h} =====")
        print_text(text, a.lines)


def cmd_copy(a) -> None:
    need_case(a.case)
    src = Source(a.case)
    if src.mode == "none":
        die(f"{a.case} has no separate source; its code is inside references/cases/{a.case}/CoExp.md")
    dest = Path(a.dest)
    root = dest.resolve()
    n = 0
    for p in src.all_paths():
        if a.only and not fnmatch.fnmatch(p, a.only):
            continue
        target = (dest / p).resolve()
        if root != target and root not in target.parents:
            die(f"refusing to write outside {dest}: {p}")
        target.parent.mkdir(parents=True, exist_ok=True)
        if src.mode == "dir":
            shutil.copyfile(src.dir / p, target)
        else:
            target.write_bytes(src.read_bytes(p))
        n += 1
    print(f"copied {n} files of '{a.case}' to {dest} ({src.mode} source)")
    omitted = INDEX[a.case]["omitted"]
    if omitted:
        print(f"note: {len(omitted)} binaries (video/audio/large fonts/QA images) are not in this skill; "
              f"references/cases/{a.case}/FILES.md says how to regenerate or replace each one")
    if src.mode == "bundle":
        print("note: claude.ai build - inline base64 media >= 4 KB were replaced by markers and small binaries are absent")


def cmd_verify(a) -> None:
    ids = [a.case] if a.case else list(INDEX)
    bad = n = 0
    for cid in ids:
        c = need_case(cid)
        src = Source(cid)
        if src.mode == "dir":
            for f in c["files"]:
                n += 1
                p = src.dir / f["path"]
                if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest() != f["sha256"]:
                    bad += 1
                    print(f"MISMATCH {cid}: {f['path']}")
        elif src.mode == "bundle":
            for m in src._load_bundle():
                n += 1
                if hashlib.sha256(src.read_bytes(m["path"])).hexdigest() != m["sha256"]:
                    bad += 1
                    print(f"MISMATCH {cid}: {m['path']}")
        if c["coexp"]:
            n += 1
            p = CASEREFS / cid / "CoExp.md"
            if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest() != c["coexp"]["sha256"]:
                bad += 1
                print(f"MISMATCH {cid}: CoExp.md")
    print(f"verified {n} files in {len(ids)} case(s): {'OK' if not bad else f'{bad} FAILED'}")
    sys.exit(1 if bad else 0)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list").set_defaults(fn=cmd_list)
    s = sub.add_parser("search")
    s.add_argument("pattern")
    s.add_argument("--case", default="", help="comma-separated case ids")
    s.add_argument("--in", dest="within", default="card,coexp,source,refs", help="any of card,coexp,source,refs")
    s.add_argument("--glob", default="", help="only source files matching this glob, e.g. '*.py'")
    s.add_argument("-C", type=int, default=0, help="context lines")
    s.add_argument("--max", type=int, default=80)
    s.set_defaults(fn=cmd_search)
    for name, fn in (("where", cmd_where), ("files", cmd_files)):
        s = sub.add_parser(name)
        s.add_argument("case")
        s.set_defaults(fn=fn)
    s = sub.add_parser("show")
    s.add_argument("case")
    s.add_argument("path")
    s.add_argument("--lines", default="", help="e.g. 100:180")
    s.add_argument("--all", action="store_true")
    s.set_defaults(fn=cmd_show)
    s = sub.add_parser("copy")
    s.add_argument("case")
    s.add_argument("dest")
    s.add_argument("--only", default="", help="glob of source paths to copy")
    s.set_defaults(fn=cmd_copy)
    s = sub.add_parser("verify")
    s.add_argument("case", nargs="?")
    s.set_defaults(fn=cmd_verify)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
