#!/usr/bin/env python3
"""
Validate a stop-motion-3d project's DATA before spending minutes per second of footage on renders.

  python3 validate.py <project_root> [--episode src/episode/episode.json] [--timeline]

Reads  src/world/world.json, src/world/poses.json, src/episode/*.json
Scans  src/looks/index.ts (look ids), src/world/props.ts (prop types + anchor names),
       src/runtime/acting.ts (loop names), src/runtime/mg.ts (MG kinds)  — best-effort regex, so a
       project that renames things still validates what it can.
Checks references (cameras, marks, actors, desks, poses, anchors, looks, loops, MG kinds), timing
(acting keys and events inside the shot, wipe length, bands fit), continuity (a holdable is never in
two hands, never taken from someone who still holds it), and a few directing rules as WARNINGs.
--timeline prints the film as text: every shot, its beat, camera, look, acting and events.
Exit 1 on any ERROR. WARNINGs are judgment calls — read them.
"""
import argparse, json, re, sys
from pathlib import Path

ERR, WARN = [], []
err = ERR.append
warn = WARN.append


def scan(path, pattern, flags=0):
    try:
        return set(re.findall(pattern, Path(path).read_text(), flags))
    except FileNotFoundError:
        return set()


def block(path, start_pat):
    """Text of the first {...} block after start_pat (brace matched)."""
    try:
        s = Path(path).read_text()
    except FileNotFoundError:
        return ""
    m = re.search(start_pat, s)
    if not m:
        return ""
    i = s.index("{", m.end() - 1)
    d = 0
    for j in range(i, len(s)):
        d += s[j] == "{"
        d -= s[j] == "}"
        if d == 0:
            return s[i: j + 1]
    return ""


def _strip(txt):
    """drop comments and string/template literal contents so braces inside them don't count."""
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.S)
    txt = re.sub(r"//[^\n]*", "", txt)
    return re.sub(r"`[^`]*`|'[^'\n]*'|\"[^\"\n]*\"", '""', txt)


def top_keys(txt):
    """keys at depth 1 of a JS object literal (properties, methods and shorthand)."""
    txt = _strip(txt)
    keys, d, i = set(), 0, 0
    while i < len(txt):
        c = txt[i]
        if c in "{[(":
            d += 1
        elif c in "}])":
            d -= 1
        elif d == 1 and (c.isalpha() or c == "_") and re.match(r"[\s{,]", txt[i - 1]):
            m = re.match(r"([A-Za-z_]\w*)\s*(?=[:(,}\n])", txt[i:])
            if m:
                keys.add(m.group(1))
            j = re.match(r"\w*", txt[i:]).end()
            i += max(j, 1)
            continue
        i += 1
    return keys


def vec3(v):
    return isinstance(v, list) and len(v) == 3 and all(isinstance(x, (int, float)) for x in v)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--episode", default=None)
    ap.add_argument("--timeline", action="store_true")
    a = ap.parse_args()
    R = Path(a.root)
    world = json.loads((R / "src/world/world.json").read_text())
    poses = json.loads((R / "src/world/poses.json").read_text())
    eps = [Path(a.episode)] if a.episode else sorted((R / "src/episode").glob("*.json"))

    looks = top_keys(block(R / "src/looks/index.ts", r"LOOKS[^=]*=\s*\{")) or set()
    props = top_keys(block(R / "src/world/props.ts", r"PROPS[^=]*=\s*\{"))
    anchors = set()
    for body in re.findall(r"anchors:\s*\{([^}]*)\}", (R / "src/world/props.ts").read_text() if (R / "src/world/props.ts").exists() else ""):
        anchors |= set(re.findall(r"([A-Za-z_]\w*)\s*:", body))
    loops = top_keys(block(R / "src/runtime/acting.ts", r"LOOPS[^=]*=\s*\{"))
    mgk = top_keys(block(R / "src/runtime/mg.ts", r"MG[^=]*=\s*\{"))

    # ---------------- world
    cams = {}
    for c in world.get("cameras", []):
        if c["id"] in cams:
            err(f"world: duplicate camera {c['id']}")
        cams[c["id"]] = c
        for k in ("from",) + (("to",) if "to" in c else ()):
            if not (vec3(c[k].get("pos")) and vec3(c[k].get("target"))):
                err(f"camera {c['id']}.{k}: pos/target must be [x,y,z]")
        if not 10 <= c.get("fov", 0) <= 90:
            err(f"camera {c['id']}: fov {c.get('fov')} outside 10..90")
    marks = world.get("marks", {})
    actors = world.get("actors", {})
    desks = world.get("desks", {})
    for n, ac in actors.items():
        if ac.get("mark") not in marks:
            err(f"actor {n}: mark {ac.get('mark')} not in world.marks")
        if ac.get("desk") and ac["desk"] not in desks:
            err(f"actor {n}: desk {ac['desk']} missing")
    for dn, d in desks.items():
        if d.get("actor") and d["actor"] not in actors:
            err(f"desk {dn}: actor {d['actor']} missing")
        for it in d.get("items", []):
            if props and it["type"] not in props:
                err(f"desk {dn}: unknown prop type '{it['type']}' (PROPS has {sorted(props)})")
            if abs(it["at"][0]) > 0.8 or abs(it["at"][1]) > 0.45:
                warn(f"desk {dn}: {it['type']} at {it['at']} hangs off a 1.6x0.9 desk")
    for h, hd in world.get("holdables", {}).items():
        if hd["desk"] not in desks:
            err(f"holdable {h}: desk {hd['desk']} missing")
        if anchors and hd.get("home") not in anchors:
            err(f"holdable {h}: home anchor '{hd.get('home')}' not defined by any prop")
        if f"hold.{h}" not in world.get("state", {}):
            err(f"holdable {h}: world.state lacks initial 'hold.{h}'")
    state0 = dict(world.get("state", {}))

    # ---------------- poses
    for pn, p in poses.items():
        if p.get("base") and p["base"] not in poses:
            err(f"pose {pn}: base '{p['base']}' missing")
        for part in ("torso", "head", "armL", "armR", "legL", "legR"):
            if part in p and not vec3(p[part]):
                err(f"pose {pn}.{part}: must be [x,y,z] degrees")
        for hand in ("handL", "handR"):
            r = p.get(hand)
            if r and anchors and r.get("reach") not in anchors | {"mouth"}:
                err(f"pose {pn}.{hand}: reach '{r.get('reach')}' is not an anchor ({len(anchors)} known)")

    # ---------------- episodes
    for ep_path in eps:
        ep = json.loads(ep_path.read_text())
        tag = ep_path.name
        fps = ep.get("fps", 24)
        if ep.get("world") and ep["world"] != world.get("id"):
            err(f"{tag}: world '{ep['world']}' != world.json id '{world.get('id')}'")
        for k, v in (ep.get("screens") or {}).items():
            if looks and v not in looks:
                err(f"{tag}: screens[{k}] = unknown look '{v}'")
        state = dict(state0)
        ids, t_total, prev_look = set(), 0.0, None
        rows = []
        for s in ep["shots"]:
            sid = s["id"]
            w = f"{tag}:{sid}"
            if sid in ids:
                err(f"{w}: duplicate id")
            ids.add(sid)
            d = s["duration"]
            if d <= 0:
                err(f"{w}: duration must be > 0")
            if d < 1.0:
                warn(f"{w}: {d}s shot — under 1s reads as a flash unless it's a deliberate smash")
            if s["camera"] not in cams:
                err(f"{w}: camera '{s['camera']}' not in world.cameras")
            elif cams[s["camera"]].get("role") == "monitor-content":
                warn(f"{w}: shooting through CAM with role monitor-content (reserved for screen thumbnails)")
            if looks and s["look"] not in looks:
                err(f"{w}: look '{s['look']}' unknown (have {sorted(looks)})")
            if s.get("variant") and s["variant"] not in world.get("variants", []):
                err(f"{w}: variant '{s['variant']}' not in world.variants")
            tr = s.get("transition")
            if tr:
                if tr.get("type") not in ("cut", "wipe"):
                    err(f"{w}: transition type '{tr.get('type')}'")
                if tr.get("type") == "wipe":
                    fr = tr.get("frames", 14)
                    if fr / fps > d * 0.5:
                        err(f"{w}: wipe of {fr} frames is > half the shot")
                    if looks and tr.get("from") not in looks:
                        err(f"{w}: wipe.from '{tr.get('from')}' unknown")
                    if prev_look and tr.get("from") != prev_look:
                        warn(f"{w}: wipe.from '{tr.get('from')}' but previous shot's look is '{prev_look}'")
            # acting
            keys_by = {}
            for k in s.get("acting", []):
                if k.get("actor") not in actors:
                    err(f"{w}: acting actor '{k.get('actor')}' missing")
                    continue
                if "loop" in k:
                    if loops and k["loop"] not in loops:
                        err(f"{w}: loop '{k['loop']}' unknown (have {sorted(loops)})")
                    if not 0 <= k.get("from", 0) < k.get("to", d) <= d + 1e-6:
                        err(f"{w}: loop {k['loop']} window {k.get('from')}..{k.get('to')} outside shot")
                    continue
                if k.get("pose") not in poses:
                    err(f"{w}: pose '{k.get('pose')}' missing from poses.json")
                if not 0 <= k.get("at", -1) <= d + 1e-6:
                    err(f"{w}: key at {k.get('at')} outside 0..{d}")
                keys_by.setdefault(k["actor"], []).append(k["at"])
            for actor, ts in keys_by.items():
                if ts != sorted(ts):
                    err(f"{w}: {actor}'s keys are not in time order")
                gaps = [b - a_ for a_, b in zip(ts, ts[1:])]
                if gaps and min(gaps) < 2 / fps:
                    warn(f"{w}: {actor} has keys {min(gaps):.3f}s apart — less than one hold on twos")
            # events + continuity
            for ev in sorted(s.get("events", []), key=lambda e: e["t"]):
                if not 0 <= ev["t"] <= d:
                    err(f"{w}: event at {ev['t']} outside shot")
                for k, v in ev["set"].items():
                    if k not in state0:
                        err(f"{w}: event sets undeclared state '{k}' (declare it in world.state)")
                        continue
                    if k.startswith("hold."):
                        if v != "home" and not re.match(r"^\w+\.(L|R)$", str(v)):
                            err(f"{w}: {k} = '{v}' — must be 'home' or '<actor>.L|R'")
                        elif v != "home" and v.split(".")[0] not in actors:
                            err(f"{w}: {k} -> unknown actor '{v.split('.')[0]}'")
                        cur = state.get(k)
                        if v != "home" and cur not in ("home", v):
                            err(f"{w}: {k} taken by {v} while still held by {cur} (put it home first)")
                        held = [kk for kk, vv in state.items() if kk.startswith("hold.") and vv == v and kk != k]
                        if v != "home" and held:
                            err(f"{w}: {v} already holds {held[0]} — one prop per hand")
                    state[k] = v
            # mg
            for m in s.get("mg", []):
                if mgk and m["kind"] not in mgk:
                    err(f"{w}: MG kind '{m['kind']}' unknown (have {sorted(mgk)})")
                if not 0 <= m["from"] < m["to"] <= d + 1e-6:
                    err(f"{w}: MG {m['kind']} {m['from']}..{m['to']} outside shot")
                if m["kind"] == "lower" and len(m.get("text", "")) > 14:
                    warn(f"{w}: lower-third title '{m['text']}' is long — check it fits")
                if m["kind"] in ("lower", "note", "title") and m["to"] - m["from"] < 1.2:
                    warn(f"{w}: MG '{m.get('text','')}' is on screen < 1.2s — too short to read")
            b = s.get("bands")
            if b:
                if looks and any(l not in looks for l in b["looks"]):
                    err(f"{w}: bands has unknown looks")
                if len(b["looks"]) > 6:
                    err(f"{w}: > 6 bands (each band is one more full render per frame)")
                if b["start"] + b["stagger"] * (len(b["looks"]) - 1) > d - 0.5:
                    err(f"{w}: bands finish after the shot ends")
            rows.append((t_total, s))
            t_total += d
            prev_look = s["look"]
        if a.timeline:
            print(f"\n== {tag}: {ep.get('title')}  {t_total:.2f}s  {round(t_total * fps)} frames @ {fps}fps")
            for t0, s in rows:
                acts = ", ".join(sorted({k.get('pose') or k.get('loop') for k in s.get('acting', [])}))
                evs = "; ".join(f"{e['t']}s {e['set']}" for e in s.get("events", []))
                print(f"{t0:6.2f}s {s['id']:<4} {s.get('beat',''):<10} {s['duration']:>4}s {s['camera']:<16} {s['look']:<11}"
                      f"{('['+s['transition']['type']+']') if s.get('transition') else '':<7} {acts}")
                if s.get("story_function"):
                    print(f"        · {s['story_function']}")
                if evs:
                    print(f"        ! {evs}")
        looks_used = [s["look"] for _, s in rows]
        if len(set(looks_used)) > 1:
            runs = [looks_used[0]]
            for l in looks_used[1:]:
                if l != runs[-1]:
                    runs.append(l)
            if len(runs) != len(set(runs)) and not any(s.get("bands") for _, s in rows):
                warn(f"{tag}: a look returns after another — fine for a montage, confusing for a story")

    for m in ERR:
        print("ERROR  ", m)
    for m in WARN:
        print("warning", m)
    print(f"\n{len(ERR)} error(s), {len(WARN)} warning(s)  | looks={len(looks)} props={len(props)} anchors={len(anchors)} loops={len(loops)} mg={len(mgk)}")
    sys.exit(1 if ERR else 0)


if __name__ == "__main__":
    main()
