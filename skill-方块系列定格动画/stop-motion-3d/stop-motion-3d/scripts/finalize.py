#!/usr/bin/env python3
"""
Assemble + QC a stop-motion-3d render into a deliverable MP4. Never claims what it did not verify.

  python3 finalize.py <project_root> [--frames out/frames] [--audio out/audio/mix.wav]
                      [--out out/final.mp4] [--crf 18] [--skip-assemble]

Steps (the qc report is written FIRST with status "running" and updated after every step, so a
crash still leaves an honest record):
  1. preflight   every frame f00000..f<total-1>.jpg exists and is non-empty; audio length == picture
  2. assemble    H.264 yuv420p (full-range JPEG -> limited BT.709), explicit colour tags via
                 h264_metadata, AAC 192k/48k, +faststart, CFR at the episode fps
  3. probe       ffprobe: codecs, pix_fmt, colour tags, fps, frame count, duration
  4. decode      full decode with -xerror (a file that plays is not the same as a file that decodes)
  5. freeze      freezedetect (d=0.4s): stepped animation holds 2-3 frames, a longer freeze is a bug
  6. black       blackdetect
  7. loudness    integrated LUFS and true peak of the MP4's AAC stream (assert TP <= -1.0 dBTP)
  8. acting      from out/qc/inspect.json if present: penetrations, surface-contact gaps, exact reach
  9. stepping    poseT only changes on the look's pose grid (on twos/threes are real, not jitter)
Writes out/qc/qc-report.json + qc-report.md and out/manifest.json (sha256 of every deliverable).
Exit 1 if any check FAILS.
"""
import argparse, hashlib, json, os, re, subprocess, sys, time
from pathlib import Path


def sh(cmd, check=True):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd[:3])}... failed:\n{r.stderr[-1500:]}")
    return r


def sha(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


class Report:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.d = {"status": "running", "started": time.strftime("%Y-%m-%d %H:%M:%S"), "checks": {}}
        self.save()

    def check(self, name, ok, **info):
        self.d["checks"][name] = {"ok": bool(ok), **info}
        print(f"[{'PASS' if ok else 'FAIL'}] {name}: " + json.dumps(info, ensure_ascii=False)[:300])
        self.save()

    def save(self):
        self.path.write_text(json.dumps(self.d, indent=2, ensure_ascii=False))

    def finish(self):
        fails = [k for k, v in self.d["checks"].items() if not v["ok"]]
        self.d["status"] = "fail" if fails else "pass"
        self.d["failed"] = fails
        self.d["finished"] = time.strftime("%Y-%m-%d %H:%M:%S")
        self.save()
        md = [f"# QC report — {self.d['status'].upper()}", ""]
        for k, v in self.d["checks"].items():
            info = {kk: vv for kk, vv in v.items() if kk != "ok"}
            md.append(f"- **{k}** {'✅' if v['ok'] else '❌'} `{json.dumps(info, ensure_ascii=False)[:400]}`")
        self.path.with_suffix(".md").write_text("\n".join(md) + "\n")
        return not fails


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--frames", default="out/frames")
    ap.add_argument("--audio", default="out/audio/mix.wav")
    ap.add_argument("--out", default="out/final.mp4")
    ap.add_argument("--meta", default="out/meta.json")
    ap.add_argument("--inspect", default="out/qc/inspect.json")
    ap.add_argument("--crf", type=int, default=18)
    ap.add_argument("--freeze", type=float, default=0.4)
    ap.add_argument("--skip-assemble", action="store_true")
    a = ap.parse_args()
    root = Path(a.root).resolve()
    P = lambda p: (root / p) if not os.path.isabs(p) else Path(p)
    rep = Report(P("out/qc/qc-report.json"))
    meta = json.loads(P(a.meta).read_text())
    fps, total = meta["fps"], meta["total"]
    dur = total / fps
    frames, audio, out = P(a.frames), P(a.audio), P(a.out)

    # 1 preflight
    missing = [f for f in range(total) if not (frames / f"f{f:05d}.jpg").exists() or (frames / f"f{f:05d}.jpg").stat().st_size < 1000]
    rep.check("preflight.frames", not missing, total=total, missing=len(missing), first_missing=missing[:5])
    has_audio = audio.exists()
    if has_audio:
        ad = float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(audio)]).stdout.strip())
        rep.check("preflight.audio", abs(ad - dur) < 0.05, audio_s=round(ad, 3), picture_s=dur)
    else:
        rep.check("preflight.audio", False, note=f"no audio at {audio} — silent film is not a deliverable")
    if missing:
        rep.finish()
        sys.exit(1)

    # 2 assemble
    if not a.skip_assemble:
        out.parent.mkdir(parents=True, exist_ok=True)
        vf = "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p"
        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-framerate", str(fps), "-i", str(frames / "f%05d.jpg")]
        if has_audio:
            cmd += ["-i", str(audio)]
        cmd += ["-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-profile:v", "high",
                "-pix_fmt", "yuv420p", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                "-bsf:v", "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0",
                "-r", str(fps), "-fps_mode", "cfr", "-g", str(fps * 2)]
        if has_audio:
            cmd += ["-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
        cmd += ["-t", f"{dur:.3f}", "-movflags", "+faststart", str(out)]
        t = time.time()
        sh(cmd)
        rep.check("assemble", out.exists(), seconds=round(time.time() - t, 1), bytes=out.stat().st_size)

    # 3 probe
    pj = json.loads(sh(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", str(out)]).stdout)
    v = next(s for s in pj["streams"] if s["codec_type"] == "video")
    au = next((s for s in pj["streams"] if s["codec_type"] == "audio"), None)
    rfr = v.get("r_frame_rate", "0/1").split("/")
    probe = {"vcodec": v["codec_name"], "pix_fmt": v["pix_fmt"], "size": f"{v['width']}x{v['height']}",
             "fps": round(int(rfr[0]) / int(rfr[1]), 3), "frames": int(v.get("nb_read_frames", 0)),
             "range": v.get("color_range"), "matrix": v.get("color_space"), "primaries": v.get("color_primaries"), "trc": v.get("color_transfer"),
             "acodec": au and au["codec_name"], "ar": au and au.get("sample_rate"), "duration": round(float(pj["format"]["duration"]), 3)}
    ok = (probe["vcodec"] == "h264" and probe["pix_fmt"] == "yuv420p" and probe["frames"] == total and probe["fps"] == fps
          and probe["range"] == "tv" and probe["matrix"] == probe["primaries"] == probe["trc"] == "bt709" and (au is not None))
    rep.check("probe", ok, **probe)
    head = open(out, "rb").read(64 * 1024)
    rep.check("faststart", head.find(b"moov") != -1 and (head.find(b"mdat") == -1 or head.find(b"moov") < head.find(b"mdat")))

    # 4 decode
    r = sh(["ffmpeg", "-v", "error", "-xerror", "-i", str(out), "-f", "null", "-"], check=False)
    rep.check("decode", r.returncode == 0 and not r.stderr.strip(), stderr=r.stderr.strip()[:300])

    # 5 freeze / 6 black
    r = sh(["ffmpeg", "-hide_banner", "-i", str(out), "-vf", f"freezedetect=n=0.002:d={a.freeze},blackdetect=d=0.25:pix_th=0.06", "-an", "-f", "null", "-"], check=False)
    freezes = re.findall(r"freeze_start: ([\d.]+).*?freeze_duration: ([\d.]+)", r.stderr, re.S)
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", r.stderr)
    rep.check("freeze", not freezes, threshold_s=a.freeze, found=[(float(s), float(d)) for s, d in freezes][:10])
    rep.check("black", not blacks, found=blacks[:10])

    # 7 loudness (of the delivered AAC, not the wav)
    if au is not None:
        r = sh(["ffmpeg", "-nostats", "-hide_banner", "-i", str(out), "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-"], check=False)
        j = json.loads(r.stderr[r.stderr.rfind("{"): r.stderr.rfind("}") + 1])
        I, TP = float(j["input_i"]), float(j["input_tp"])
        rep.check("loudness", -18 <= I <= -13 and TP <= -1.0, integrated_lufs=I, true_peak_dbtp=TP, lra=float(j["input_lra"]))

    # 8 acting / 9 stepping (from the page's own inspect probe)
    ip = P(a.inspect)
    if ip.exists():
        rows = json.loads(ip.read_text())
        pen = [r_ for r_ in rows if r_.get("penetration")]
        surf = [c["surface"] for r_ in rows for c in r_.get("contacts", []) if c.get("mode") == "surface" and c.get("surface") is not None]
        exact = [c["gap"] for r_ in rows for c in r_.get("contacts", []) if c.get("mode") == "exact" and c.get("gap") is not None]
        worst_s = min(surf) if surf else 0
        worst_e = max(exact) if exact else 0
        rep.check("acting.penetration", not pen, frames_with_penetration=len(pen), first=[r_["frame"] for r_ in pen[:5]])
        rep.check("acting.surface_contacts", worst_s > -0.01, n=len(surf), deepest_m=round(worst_s, 4))
        rep.check("acting.exact_reach", worst_e < 0.03, n=len(exact), worst_gap_m=round(worst_e, 4))
        # stepping: count distinct poseT runs per shot; run length must equal the hold (except shot tails)
        bad, runs = 0, 0
        by = {}
        for r_ in rows:
            by.setdefault(r_["shot"], []).append(r_)
        for sid, rs in by.items():
            rs.sort(key=lambda x: x["frame"])
            lens, cur = [], 1
            for p, q in zip(rs, rs[1:]):
                if q["frame"] != p["frame"] + 1:
                    cur = 1
                    continue
                if q["poseT"] == p["poseT"]:
                    cur += 1
                else:
                    lens.append(cur)
                    cur = 1
            if lens:
                runs += len(lens)
                mode = max(set(lens), key=lens.count)
                bad += sum(1 for L in lens if L != mode)
        rep.check("stepping", bad == 0, runs=runs, irregular_runs=bad)
    else:
        rep.check("acting", False, note="no inspect.json — run capture.mjs --inspect first")

    ok = rep.finish()
    man = {"title": meta.get("title"), "fps": fps, "frames": total, "duration_s": dur,
           "files": {str(p.relative_to(root)): {"bytes": p.stat().st_size, "sha256": sha(p)} for p in [out, P("out/qc/qc-report.json")] if p.exists()}}
    P("out/manifest.json").write_text(json.dumps(man, indent=2, ensure_ascii=False))
    print(("QC PASS" if ok else "QC FAIL") + f" -> {rep.path}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
