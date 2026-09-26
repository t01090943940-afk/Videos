#!/usr/bin/env python3
"""Build the generated parts of skills/code-video-casebook from this repo's originals.

Standard skill layout (hand-written files are never touched by this script):

  SKILL.md                                  hand-written  entry point / router
  scripts/casebook.py                       hand-written  list / search / files / show / copy / verify
  references/catalog.md, techniques.md ...  hand-written  cross-case indexes and methodology
  references/cases/<id>/CARD.md             hand-written  per-case retrieval card
  references/cases/<id>/CoExp.md            GENERATED     byte-identical copy of the original CoExp document
  references/cases/<id>/FILES.md            GENERATED     index of every source file (+ one-line summary) and of left-out binaries
  references/cases/<id>/preview.jpg         GENERATED     20-frame contact sheet of the finished film
  references/index.json                     GENERATED     machine index used by scripts/casebook.py
  references/inventory.md                   GENERATED     what went in / what was left out, per case
  assets/cases/<id>/...                     GENERATED     the original source, UNZIPPED, every file byte-identical

Inclusion policy for assets/cases/<id>/:
  * every text file (UTF-8, no NUL): included verbatim - including HTML with inline base64
  * binaries: fonts / images / small data <= 1 MB included verbatim, EXCEPT
      - all video and audio (original films, clips, music, sfx: renders or third-party material)
      - QA evidence, contact sheets, storyboard sheets, trailer posters, real people's avatars
    Everything left out is listed in FILES.md with size, sha256 and how to regenerate/replace it.

Packaging (--zip):
  dist/code-video-casebook.skill            full standard skill (Claude Code / Agent SDK / API; >200 files)
  dist/code-video-casebook-claude-ai.skill  same skill for claude.ai web upload (<=200 files): each case's
                                            source tree becomes one lossless text bundle assets/cases/<id>/SOURCE.md
                                            (binaries dropped, inline base64 >= 4 KB replaced by a marker);
                                            scripts/casebook.py reads either layout transparently.

Usage:  python3 tools/build_casebook.py [--only id,id] [--zip]
"""
from __future__ import annotations

import argparse
import fnmatch
import hashlib
import io
import json
import re
import shutil
import sys
import tarfile
import tempfile
import zipfile
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath

REPO = Path(__file__).resolve().parents[1]
NAME = "code-video-casebook"
SKILL = REPO / "skills" / NAME
REFS = SKILL / "references"
ASSETS = SKILL / "assets" / "cases"
DIST = REPO / "dist"
SURVEY = REPO / "00-supercut-trailer" / "_survey"

MAX_BIN = 1_000_000
DROP_KINDS = {"video", "audio"}
DROP_GLOBS = ["qa/*", "*/qa/*", "*reference/*.jpg", "_survey/*", "assets/posters/*", "*assets/avatars/*",
              "*storyboard*.jpg", "*contact_sheet*.jpg"]

B64_MIN = 4096
B64_RE = re.compile(r"(data:([A-Za-z0-9.+/-]+);base64,)([A-Za-z0-9+/=]{%d,})" % B64_MIN)


@dataclass
class Case:
    id: str
    title: str
    folder: str
    coexp: str | None = None
    sources: list = field(default_factory=list)   # (kind, repo-relative path, options)
    survey: int | None = None
    preview_from: str | None = None
    notes: dict = field(default_factory=dict)     # glob -> note for left-out binaries


FONT_NOTE = "大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径"
CASES: list[Case] = [
    Case("supercut", "AI-Coding SuperVideos 合集总片（28 部代码视频的预告片）", "00-supercut-trailer",
         sources=[("dir", "00-supercut-trailer", {})],
         preview_from="00-supercut-trailer/assets/img/share-card.png",
         notes={"assets/clips/*": "镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录）",
                "assets/posters/*": "海报帧：tools/prep_media.mjs 从成片生成",
                "assets/score.wav": "配乐：npm run score（audio/score.py）生成",
                "_survey/*": "28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg）",
                "assets/fonts/*": FONT_NOTE}),
    Case("beyond", "AI · Beyond Generation（15 个世界）", "gpt-15-style-ai-beyond-generation",
         sources=[("zip", "gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_Project.zip", {})],
         survey=1,
         notes={"*.mp4": "成片（原视频不收录）", "*/assets/original_score.wav": "原创配乐：source/audio.py 生成",
                "*/qa/*": "QA 抽帧 / 联系表"}),
    Case("moon-letter", "月光信笺（竖屏可交互 HTML）", "gpt-mid-autumn-for-my-dg03",
         sources=[("file", "gpt-mid-autumn-for-my-dg03/Moon_Letter_Interactive.html", {})],
         survey=2),
    Case("gpt-autumn", "把日子，慢慢过圆（中秋 60s）", "gpt-mid-autumn-general-video",
         coexp="gpt-mid-autumn-general-video/把日子，慢慢过圆代码视频-CoExp.md",
         sources=[("zip", "gpt-mid-autumn-general-video/MidAutumn_Final_60s_Source.zip", {})],
         survey=3,
         notes={"*score60_master.flac": "母带：src/music60.py + src/master_audio.py 生成（build.py --rebuild-audio）",
                "*.jpg": "故事板 / QA 联系表"}),
    Case("cosmos30", "COSMOS · 从未知到寂静（30 种画风）", "gpt-universe-30-change",
         coexp="gpt-universe-30-change/COSMOS从未知到寂静代码视频-CoExp.md",
         sources=[("zip", "gpt-universe-30-change/COSMOS_Source_and_Storyboard.zip", {})],
         survey=4,
         notes={"*score.wav": "配乐：score.py + master_audio.py 生成", "*.jpg": "联系表"}),
    Case("kimi-beat", "AI 觉醒 · 高燃卡点", "kimi-ai-beat-sync",
         coexp="kimi-ai-beat-sync/AI觉醒代码视频-CoExp.md",
         sources=[("zip", "kimi-ai-beat-sync/ai-beat-sync-src.zip", {})],
         survey=5,
         notes={"*assets/bgm.mp3": "BGM：Kevin MacLeod《Volatile Reaction》CC-BY 4.0（incompetech 下载，按 CoExp §2.1 裁窗）；audiomap*.json 是它的节拍分析",
                "*assets/sfx/*": "音效素材（HyperFrames 素材库）", "*assets/fonts/*": FONT_NOTE}),
    Case("hust1037", "1037（一个符号讲完一所大学）", "opus-1037-hust-story",
         coexp="opus-1037-hust-story/HUST宣传代码MG视频-CoExp.md", survey=6),
    Case("f12", "DevTools in 60 Seconds + F12 Field Guide", "opus-F12-teaching",
         coexp="opus-F12-teaching/DevTools-in-60-Seconds代码视频-CoExp.md",
         sources=[("file", "opus-F12-teaching/F12-Field-Guide.html", {}),
                  ("zip", "opus-F12-teaching/F12-Field-Guide-source.zip", {"mount": "F12-Field-Guide-source/"})],
         survey=7),
    Case("ageint", "智能时代 The Age of Intelligence（108 镜）", "opus-age-of-intelligence",
         coexp="opus-age-of-intelligence/智能时代代码视频-CoExp.md",
         sources=[("zip", "opus-age-of-intelligence/智能时代-The_Age_of_Intelligence-source.zip", {})],
         survey=8,
         notes={"*fonts/*.ttf": FONT_NOTE + "（scripts/build_fonts.py 记录了来源与子集化）"}),
    Case("shatter", "碎月重圆（AE 级特效 MG）", "opus-broken-reround",
         coexp="opus-broken-reround/碎月重圆_AE级特效_CoExp.md", survey=9),
    Case("claude15", "Claude 自我介绍 · 15 种画风", "opus-claude-intro-with-15-way",
         sources=[("zip", "opus-claude-intro-with-15-way/claude_intro_源码.zip", {})],
         survey=10),
    Case("dingge", "定格（工地安全 Three.js 定格动画）", "opus-factory-safety-videos",
         coexp="opus-factory-safety-videos/工地安全定格代码视频-CoExp.md",
         sources=[("tgz", "opus-factory-safety-videos/dingge-source.tgz", {})],
         survey=11),
    Case("readclub", "华中大读书会 · 慢下来（竖屏，单 HTML 出画面+音乐）", "opus-hust-read-join-video-v1",
         coexp="opus-hust-read-join-video-v1/华中大读书会《慢下来》代码视频-CoExp.md",
         sources=[("file", "opus-hust-read-join-video-v1/华中大读书会_慢下来_代码版.html", {}),
                  ("zip", "opus-hust-read-join-video-v1/华中大读书会_慢下来_源码.zip", {})],
         survey=12),
    Case("xuanlan", "玄览 PocketWebShell 宣传片", "opus-introduction-video-xuanlan",
         coexp="opus-introduction-video-xuanlan/玄览PocketWebShell宣传片代码视频-CoExp.md", survey=13),
    Case("senpai", "中秋 · 给学姐（竖屏）", "opus-mid-autumn-for-my-dg01",
         coexp="opus-mid-autumn-for-my-dg01/中秋给学姐的温情视频-CoExp.md", survey=14),
    Case("moonlamp", "月光替你亮着灯（真 3D 一镜到底 · 月夜水彩）", "opus-mid-autumn-for-my-dg02",
         coexp="opus-mid-autumn-for-my-dg02/月光替你亮着灯代码视频-CoExp.md",
         # 这份源码包物理上放在 gpt-mid-autumn-for-my-dg03/，但它是本片（Opus，dg02）的源码
         sources=[("zip", "gpt-mid-autumn-for-my-dg03/月光替你亮着灯-source.zip", {})],
         survey=15,
         notes={"*reference/*.jpg": "QC 参考联系表"}),
    Case("samemoon", "同一个月亮（中秋 120s，单文件 Canvas + Web Audio）", "opus-mid-autumn-genergal-videos",
         coexp="opus-mid-autumn-genergal-videos/中秋代码介绍视频-CoExp.md", survey=16),
    Case("gongcishi", "共此时（180s，217 份真实素材的高中纪念片）", "opus-mid-autumn-highschool-videos",
         coexp="opus-mid-autumn-highschool-videos/共此时代码视频-CoExp.md", survey=17),
    Case("oneink", "一畫（水墨书法 · 手卷一镜到底）", "opus-oneink",
         coexp="opus-oneink/一畫代码视频-CoExp.md",
         sources=[("zip", "opus-oneink/一畫_源代码.zip", {"mount": ""})],
         survey=18,
         notes={"tex/paper*.png": "宣纸纹理：python3 gen_tex.py 生成"}),
    Case("phasegate", "Phase-Gate 升维（手绘→矢量→扁平→黏土→写实）", "opus-production-video-ai-phase-skill",
         coexp="opus-production-video-ai-phase-skill/Phase-Gate升维宣传片代码视频-CoExp.md", survey=19),
    Case("protocom", "protocom 宣传片（4K 60fps，用画风变化叙事）", "opus-production-video-protocom-intro",
         coexp="opus-production-video-protocom-intro/protocom宣传片代码视频-CoExp.md",
         sources=[("zip", "opus-production-video-protocom-intro/promo-src.zip", {})],
         survey=20,
         notes={"*audio/music.wav": "配乐：audio/synth.py 生成",
                "*assets/avatars/*": "社区成员头像（真实用户，不再分发）：换成你自己的头像图"}),
    Case("skillshub", "Skills Hub 宣传片（114 拍）", "opus-production-video-skill-hub",
         coexp="opus-production-video-skill-hub/Skills Hub宣传片代码视频-CoExp.md",
         sources=[("zip", "opus-production-video-skill-hub/skills-hub-promo-source.zip", {})],
         survey=21),
    Case("studysolo", "StudySolo 宣传片（真实 Agent 页面 · 过去|现在分屏）", "opus-production-video-studysolo",
         coexp="opus-production-video-studysolo/StudySolo宣传片代码视频-CoExp.md", survey=22),
    Case("yusheng", "羽升集博客宣传片（每一拍一个可见动作）", "opus-production-video-ys-blog",
         coexp="opus-production-video-ys-blog/羽升集宣传片代码视频-CoExp.md", survey=23),
    Case("shuchenglin", "树成林宣传片（虚拟时间逐帧录屏）", "opus-shuchenglin-into",
         coexp="opus-shuchenglin-into/树成林展示视频代码卡点宣传片-方法论-CoExp.md",
         sources=[("zip", "opus-shuchenglin-into/树成林宣传片-工程源码.zip", {})],
         survey=24),
    Case("codecosmos", "代码宇宙（27 种代码风格 · 2D→4D · 一拍二定格）", "opus-universe-history-video",
         coexp="opus-universe-history-video/宇宙变换-CoExp.md",
         sources=[("zip", "opus-universe-history-video/code_cosmos_source.zip", {"mount": ""})],
         survey=25),
    Case("stopmotion", "stop-motion-3d Skill（方块系列定格动画，7 种画风）", "skill-方块系列定格动画",
         sources=[("zip", "skill-方块系列定格动画/stop-motion-3d.skill", {})],   # .zip 与 .skill 逐字节相同
         survey=26),
    Case("atlas", "VibeMotion / motion-library-atlas（代码视频方式全景与启迪）", "skill-代码视频所有绝大部分方式和启迪",
         sources=[("zip", "skill-代码视频所有绝大部分方式和启迪/code-videos-path.zip", {}),
                  ("file", "skill-代码视频所有绝大部分方式和启迪/VibeMotion-本地版.html", {}),
                  ("file", "skill-代码视频所有绝大部分方式和启迪/VIBEMOTION-workstation.html", {})]),
    Case("ai-rise", "AI:RISE · renderAt(t) 帧级锁拍", "swe-ai-rise",
         coexp="swe-ai-rise/AI-RISE代码视频-CoExp.md",
         sources=[("zip", "swe-ai-rise/ai_rise_source.zip", {"mount": ""})],
         survey=27,
         notes={"audio/mk_*.mp3": "候选配乐曲目（Mixkit 外部素材，不再分发）", "audio/sfx_*.mp3": "Mixkit 音效（不再分发）",
                "audio/tts/*": "TTS 人声：tts_gen.py（edge-tts）生成", "audio/mix*.m4a": "混音：audio_mix*.py 生成"}),
    Case("kimi-film", "月之暗面 · KIMI · numpy 逐像素六幕", "swe-kimi-source-intro",
         coexp="swe-kimi-source-intro/月之暗面KIMI介绍代码视频-CoExp.md",
         sources=[("zip", "swe-kimi-source-intro/kimi_film_source.zip", {"mount": ""})],
         survey=28),
    Case("town-camera-lab", "小镇片场：摄影与运镜实验室（单文件交互 HTML）", ".",
         sources=[("file", "town-camera-lab.html", {})]),
]

KIND = {".mp4": "video", ".mov": "video", ".webm": "video", ".wav": "audio", ".flac": "audio",
        ".mp3": "audio", ".m4a": "audio", ".ogg": "audio", ".ttf": "font", ".otf": "font", ".woff2": "font",
        ".woff": "font", ".ttc": "font", ".png": "image", ".jpg": "image", ".jpeg": "image", ".webp": "image",
        ".gif": "image", ".npy": "data", ".mid": "midi"}
LANG = {".py": "python", ".js": "js", ".mjs": "js", ".ts": "ts", ".tsx": "tsx", ".json": "json",
        ".html": "html", ".css": "css", ".md": "markdown", ".sh": "bash", ".frag": "glsl",
        ".glsl": "glsl", ".yaml": "yaml", ".yml": "yaml", ".srt": "srt", ".txt": "text"}


def sha(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def is_text(b: bytes) -> bool:
    if b"\x00" in b:
        return False
    try:
        b.decode("utf-8")
        return True
    except UnicodeDecodeError:
        return False


def human(n: int) -> str:
    return f"{n / 1024 / 1024:.1f} MB" if n >= 1024 * 1024 else f"{n / 1024:.1f} KB"


def zip_name(info: zipfile.ZipInfo) -> str:
    if info.flag_bits & 0x800:
        return info.filename
    try:  # zips written without the UTF-8 flag are decoded as cp437 by Python
        return info.filename.encode("cp437").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return info.filename


def safe_rel(path: str) -> str:
    p = PurePosixPath(path)
    if p.is_absolute() or ".." in p.parts:
        raise ValueError(f"unsafe archive path: {path}")
    return p.as_posix()


def read_source(kind: str, rel: str, opts: dict) -> list[tuple[str, bytes]]:
    """[(path inside assets/cases/<id>/, bytes)] for one original source."""
    p = REPO / rel
    if kind == "file":
        return [(opts.get("mount", "") + p.name, p.read_bytes())]
    if kind == "dir":
        return [(f.relative_to(p).as_posix(), f.read_bytes()) for f in sorted(p.rglob("*"))
                if f.is_file() and not {".git", "node_modules", "build", "renders"} & set(f.relative_to(p).parts)]
    if kind == "zip":
        z = zipfile.ZipFile(p)
        items = [(zip_name(i), (lambda i=i: z.read(i))) for i in z.infolist() if not i.is_dir()]
    else:
        t = tarfile.open(p)
        items = [((m.name[2:] if m.name.startswith("./") else m.name), (lambda m=m: t.extractfile(m).read()))
                 for m in t.getmembers() if m.isfile()]
    names = [n for n, _ in items]
    if "mount" in opts:
        mount = opts["mount"]
    elif len({n.split("/")[0] for n in names}) == 1 and all("/" in n for n in names):
        mount = ""  # archive already has one top-level folder: keep it as-is
    else:
        mount = p.stem + "/"
    return [(safe_rel(mount + n), get()) for n, get in items]


def keep_binary(path: str, data: bytes) -> bool:
    kind = KIND.get(Path(path).suffix.lower(), "binary")
    if kind in DROP_KINDS or len(data) > MAX_BIN:
        return False
    return not any(fnmatch.fnmatch(path, g) for g in DROP_GLOBS)


def note_for(case: Case, path: str, kind: str) -> str:
    for pat, note in case.notes.items():
        if fnmatch.fnmatch(path, pat):
            return note
    if kind == "font":
        return FONT_NOTE
    if kind == "video":
        return "视频（原视频/成片/镜头，不收录）"
    if kind == "audio":
        return "音频（程序生成的可由源码再生成；外部素材不再分发）"
    if any(fnmatch.fnmatch(path, g) for g in DROP_GLOBS):
        return "QA / 审片证据图"
    return ""


def summarize(path: str, text: str) -> str:
    """One-line summary of a text file for FILES.md: first meaningful heading / title / docstring / comment line."""
    ext = Path(path).suffix.lower()
    head = text[:8000]
    if path.endswith("package.json"):
        try:
            j = json.loads(text)
            s = j.get("scripts") or {}
            return ("npm scripts: " + ", ".join(list(s)[:8])) if s else (j.get("name") or "")
        except Exception:
            return ""
    cands: list[str] = []
    if ext == ".md":
        cands = re.findall(r"^#{1,3}\s+(.+)$", head, re.M)[:3]
    elif ext in (".html", ".htm"):
        cands = re.findall(r"<title>(.*?)</title>", head, re.S | re.I) + re.findall(r"<!--(.*?)-->", head, re.S)[:3]
    elif ext == ".py":
        m = re.search(r'(?:"""|\'\'\')(.*?)(?:"""|\'\'\')', head, re.S)
        cands = (m.group(1).split("\n") if m else []) + re.findall(r"^#(?!!)\s*(.+)$", head, re.M)[:6]
    elif ext in (".js", ".mjs", ".ts", ".tsx", ".css", ".frag", ".glsl"):
        m = re.search(r"/\*(.*?)\*/", head, re.S)
        cands = (m.group(1).split("\n") if m else []) + re.findall(r"^\s*//+\s*(.+)$", head, re.M)[:6]
    elif ext == ".sh":
        cands = re.findall(r"^#(?!!)\s*(.+)$", head, re.M)[:4]
    for c in cands:
        s = re.sub(r"[═─━—=\-*#/│┃|~_]{2,}", " ", c)
        s = re.sub(r"\s+", " ", s).strip(" *:·-")
        if len(re.findall(r"[A-Za-z\u4e00-\u9fff]", s)) >= 3:
            return s[:110] + ("…" if len(s) > 110 else "")
    return ""


def make_preview(case: Case, out: Path) -> bool:
    from PIL import Image
    src = SURVEY / f"sheet_{case.survey:02d}.jpg" if case.survey else (REPO / case.preview_from if case.preview_from else None)
    if not src or not src.exists():
        return False
    im = Image.open(src).convert("RGB")
    if im.width > 1280:
        im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    im.save(out, "JPEG", quality=72, optimize=True, progressive=True)
    return True


def build_case(case: Case) -> dict:
    ref = REFS / "cases" / case.id
    ref.mkdir(parents=True, exist_ok=True)
    dst = ASSETS / case.id
    if dst.exists():
        shutil.rmtree(dst)
    info = {"id": case.id, "title": case.title, "folder": case.folder, "coexp": None, "origins": [],
            "files": [], "omitted": [], "preview": False}
    if case.coexp:
        b = (REPO / case.coexp).read_bytes()
        (ref / "CoExp.md").write_bytes(b)
        info["coexp"] = {"original": case.coexp, "bytes": len(b), "sha256": sha(b), "lines": b.count(b"\n")}
    seen: set[str] = set()
    for kind, rel, opts in case.sources:
        got = read_source(kind, rel, opts)
        size = sum(len(d) for _, d in got) if kind == "dir" else (REPO / rel).stat().st_size
        info["origins"].append({"kind": kind, "path": rel, "bytes": size,
                                "sha256": None if kind == "dir" else sha((REPO / rel).read_bytes())})
        for path, data in got:
            if path in seen:
                raise SystemExit(f"{case.id}: duplicate path {path}")
            seen.add(path)
            h = sha(data)
            kind_f = "text" if is_text(data) else KIND.get(Path(path).suffix.lower(), "binary")
            if kind_f == "text" or keep_binary(path, data):
                out = dst / path
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_bytes(data)
                e = {"path": path, "bytes": len(data), "sha256": h, "kind": kind_f}
                if kind_f == "text":
                    t = data.decode("utf-8")
                    e["lines"] = t.count("\n") + (0 if t.endswith("\n") or not t else 1)
                    e["summary"] = summarize(path, t)
                info["files"].append(e)
            else:
                note = note_for(case, path, kind_f)
                info["omitted"].append({"path": path, "bytes": len(data), "sha256": h, "kind": kind_f, "note": note})
    info["files"].sort(key=lambda e: e["path"])
    info["omitted"].sort(key=lambda e: e["path"])
    info["preview"] = make_preview(case, ref / "preview.jpg")
    write_files_md(case, info, ref / "FILES.md")
    return info


def write_files_md(case: Case, info: dict, out: Path) -> None:
    L = [f"# {case.id} · 源码文件索引（自动生成）", "", f"> {case.title}。原目录 `{case.folder}/`。"]
    if not info["files"] and not info["omitted"]:
        L += ["", "本案例没有单独的源码包：**代码与方法全部写在 [CoExp.md](CoExp.md) 里**（含关键代码片段、参数、命令）。", ""]
        out.write_text("\n".join(L), encoding="utf-8")
        return
    L += [f"> 源码已原样解压在 **`assets/cases/{case.id}/`**（逐字节等于原档案，sha256 见 `references/index.json`）。",
          f"> 读文件：`python3 scripts/casebook.py show {case.id} <路径>`；拷出来改：`python3 scripts/casebook.py copy {case.id} <目标目录>`。", "",
          "来源档案：", ""]
    for o in info["origins"]:
        L.append(f"- `{o['path']}` · {o['kind']} · {human(o['bytes'])}" + (f" · sha256 `{o['sha256'][:16]}…`" if o["sha256"] else ""))
    texts = [f for f in info["files"] if f["kind"] == "text"]
    bins = [f for f in info["files"] if f["kind"] != "text"]
    L += ["", f"收录：文本 {len(texts)} 个（{human(sum(f['bytes'] for f in texts))}）· 二进制 {len(bins)} 个"
              f"（{human(sum(f['bytes'] for f in bins))}，字体/小图）· 未收录 {len(info['omitted'])} 个"
              f"（{human(sum(f['bytes'] for f in info['omitted']))}）", ""]
    parts = ["文本文件"] + (["随附二进制（原样）"] if bins else []) + (["未收录（视频 / 音频 / 大字体 / QA 图）"] if info["omitted"] else [])
    if len(parts) > 1:  # table of contents for the long indexes
        L += ["目录：" + " · ".join(parts), ""]
    L += ["## 文本文件", "", "| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |", "|---|---:|---:|---|"]
    for f in texts:
        s = f["summary"].replace("|", "\\|")
        L.append(f"| `{f['path']}` | {f['lines']} | {human(f['bytes'])} | {s} |")
    if bins:
        L += ["", "## 随附二进制（原样）", "", "| 路径 | 类型 | 大小 |", "|---|---|---:|"]
        L += [f"| `{f['path']}` | {f['kind']} | {human(f['bytes'])} |" for f in bins]
    if info["omitted"]:
        L += ["", "## 未收录（视频 / 音频 / 大字体 / QA 图）", "", "| 路径 | 类型 | 大小 | sha256 | 如何补回 |", "|---|---|---:|---|---|"]
        for o in info["omitted"]:
            note = o["note"].replace("|", "\\|")
            L.append(f"| `{o['path']}` | {o['kind']} | {human(o['bytes'])} | `{o['sha256'][:12]}` | {note} |")
    L.append("")
    out.write_text("\n".join(L), encoding="utf-8")


def write_inventory(infos: list[dict]) -> None:
    L = ["# Inventory · 收录清单（自动生成）", "",
         "每个案例收录了什么、没收录什么、原件在仓库哪里。由 `tools/build_casebook.py` 生成。", "",
         "| 案例 | 原目录 | CoExp | 源码（assets/cases/<id>/） | 未收录 | 来源档案 |", "|---|---|---:|---|---|---|"]
    tt = to = 0
    for i in infos:
        t = sum(f["bytes"] for f in i["files"])
        o = sum(f["bytes"] for f in i["omitted"])
        tt += t
        to += o
        src = "<br>".join(f"`{Path(x['path']).name}`" for x in i["origins"]) or "—（代码在 CoExp 里）"
        L.append(f"| [{i['id']}](cases/{i['id']}/CARD.md) | `{i['folder']}` | "
                 f"{human(i['coexp']['bytes']) if i['coexp'] else '—'} | "
                 f"{len(i['files'])} 个 · {human(t)} | {len(i['omitted'])} 个 · {human(o)} | {src} |")
    L += ["", f"合计：收录源码 {human(tt)}；未收录 {human(to)}。", "",
          "## 收录规则", "",
          "- **CoExp 原文**：逐字节复制到 `references/cases/<id>/CoExp.md`（原文件名见 `references/index.json` 的 `coexp.original`）。",
          "- **源码**：原档案（zip / tgz / 目录 / 单 HTML）**原样解压**到 `assets/cases/<id>/`，所有文本文件逐字节保留（含内嵌 base64 的 HTML）；≤ 1 MB 的字体与图片也原样随附。",
          "- **不收录**：原视频、成片、镜头代理、所有音频（成片音乐由源码可再生成；外部曲库/音效不再分发）、> 1 MB 的大字体与纹理、QA 联系表、真实人物头像。每一项都在对应 `FILES.md` 里列出大小、sha256 和补回方法。",
          "- 完整原件始终在本仓库各项目目录里。", ""]
    (REFS / "inventory.md").write_text("\n".join(L), encoding="utf-8")


# ------------------------------------------------------------------ claude.ai compact bundle

def bundle_text(case_id: str, info: dict) -> str:
    """Single-file text bundle of assets/cases/<id>/ for claude.ai; read back by scripts/casebook.py."""
    src = ASSETS / case_id
    body, toc = [], []
    texts = [f for f in info["files"] if f["kind"] == "text"]
    for k, f in enumerate(texts, 1):
        text = (src / f["path"]).read_bytes().decode("utf-8")
        stripped = []

        def _strip(m):
            stripped.append({"mime": m.group(2), "base64_chars": len(m.group(3))})
            return f"{m.group(1)}CASEBOOK-STRIPPED-{m.group(2).replace('/', '-')}-{len(m.group(3)) * 3 // 4}B"
        text = B64_RE.sub(_strip, text)
        ends = text.endswith("\n")
        lines = text.split("\n")
        if ends:
            lines = lines[:-1]
        meta = {"path": f["path"], "lines": len(lines), "final_newline": ends,
                "sha256": sha(text.encode("utf-8")), "original_sha256": f["sha256"]}
        if stripped:
            meta["stripped_base64"] = stripped
        fence = "`" * max(3, max((len(x) for x in re.findall(r"`+", text)), default=0) + 1)
        toc.append((k, f["path"], len(lines), len(body)))
        body += [f"### {k}/{len(texts)} · `{f['path']}`", f"<!-- casebook-file {json.dumps(meta, ensure_ascii=False)} -->",
                 fence + LANG.get(Path(f["path"]).suffix.lower(), ""), *lines, fence, ""]
    head = [f"# {case_id} · SOURCE bundle（claude.ai 精简版）", "",
            "> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。",
            "> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。",
            f"> 读单个文件：`python3 scripts/casebook.py show {case_id} <路径>`；还原成真实目录：`python3 scripts/casebook.py copy {case_id} <目标>`。", "",
            "| # | 文件 | 行数 | L |", "|---|---|---:|---:|"]
    off = len(head) + len(toc) + 4
    head += [f"| {k} | `{p}` | {n} | {off + b} |" for k, p, n, b in toc]
    head += ["", "---", ""]
    return "\n".join(head + body) + "\n"


def zip_tree(root: Path, out: Path) -> int:
    if out.exists():
        out.unlink()
    n = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for f in sorted(root.rglob("*")):
            if f.is_file() and "__pycache__" not in f.parts and f.name != ".DS_Store":
                zi = zipfile.ZipInfo(f"{NAME}/{f.relative_to(root).as_posix()}", date_time=(2026, 9, 26, 0, 0, 0))
                zi.compress_type = zipfile.ZIP_DEFLATED
                zi.external_attr = (0o755 if f.suffix == ".py" else 0o644) << 16
                z.writestr(zi, f.read_bytes(), compresslevel=9)
                n += 1
    return n


def package(infos: list[dict]) -> None:
    DIST.mkdir(exist_ok=True)
    full = DIST / f"{NAME}.skill"
    n = zip_tree(SKILL, full)
    unz = sum(f.stat().st_size for f in SKILL.rglob("*") if f.is_file() and "__pycache__" not in f.parts)
    print(f"packaged {full.relative_to(REPO)} · {n} files · {human(full.stat().st_size)} zipped / {human(unz)} unzipped (Claude Code / Agent SDK / API)")
    with tempfile.TemporaryDirectory() as td:
        stage = Path(td) / NAME
        shutil.copytree(SKILL, stage, ignore=shutil.ignore_patterns("assets", "__pycache__"))
        for i in infos:
            if i["files"]:
                d = stage / "assets" / "cases" / i["id"]
                d.mkdir(parents=True, exist_ok=True)
                (d / "SOURCE.md").write_bytes(bundle_text(i["id"], i).encode("utf-8"))
        compact = DIST / f"{NAME}-claude-ai.skill"
        n2 = zip_tree(stage, compact)
        unz2 = sum(f.stat().st_size for f in stage.rglob("*") if f.is_file())
    print(f"packaged {compact.relative_to(REPO)} · {n2} files · {human(compact.stat().st_size)} zipped / {human(unz2)} unzipped (claude.ai web)")
    if n2 > 200:
        raise SystemExit(f"compact package has {n2} files > 200 (claude.ai limit)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--zip", action="store_true")
    args = ap.parse_args()
    only = {x for x in args.only.split(",") if x}
    idx_path = REFS / "index.json"
    old = {c["id"]: c for c in json.loads(idx_path.read_text(encoding="utf-8"))["cases"]} if idx_path.exists() else {}
    infos = []
    for case in CASES:
        if only and case.id not in only and case.id in old:
            infos.append(old[case.id])
            continue
        i = build_case(case)
        infos.append(i)
        print(f"{case.id:16s} coexp={'Y' if i['coexp'] else '-'} files={len(i['files']):4d} "
              f"({human(sum(f['bytes'] for f in i['files']))}) omitted={len(i['omitted']):3d} "
              f"({human(sum(f['bytes'] for f in i['omitted']))}) preview={'Y' if i['preview'] else '-'}")
    idx = {"name": NAME, "generated_by": "tools/build_casebook.py", "cases": infos}
    idx_path.write_text(json.dumps(idx, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    write_inventory(infos)
    if args.zip:
        package(infos)


if __name__ == "__main__":
    sys.exit(main())
