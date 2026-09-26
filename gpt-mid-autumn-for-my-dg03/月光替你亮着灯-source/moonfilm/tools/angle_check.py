#!/usr/bin/env python3
"""
Framing angles before building the set  (补全：reconstructed from the conversation)

During production this was an inline `python3 - <<EOF` command, never saved as a file. It is the
check that moved the moon from ~19° to 12° elevation: from the key camera positions it prints the
azimuth / elevation of the window lintel and sill, her head and the lantern rope, so you can see
whether the moon (and what hangs in front of it) will actually be framed by the window.

    python3 tools/angle_check.py                # the values used at that point in production
    python3 tools/angle_check.py --el 19 --az 8 # try another moon position

Conventions (same as src/layout.ts): metres, y up, +z out of the window, az = atan2(dx, dz)
(positive = towards +x, her left), el = atan2(dy, horizontal distance). The camera positions and
points below are the ones used at the time; the final values live in src/timeline.ts (CAMERA) and
src/layout.ts (WIN, HIPS/head, LANTERN_ROPE: a=(2.85, 2.45, 4.2), sag 0.22, MOON_DIR).
"""
import argparse
import math


def ang(cam, p):
    dx, dy, dz = [p[i] - cam[i] for i in range(3)]
    return math.degrees(math.atan2(dx, dz)), math.degrees(math.atan2(dy, math.hypot(dx, dz)))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--el", type=float, default=12.0, help="moon elevation, degrees")
    ap.add_argument("--az", type=float, default=8.0, help="moon azimuth, degrees")
    ap.add_argument("--radius", type=float, default=0.068, help="moon angular radius, rad (MOON_ANG_R)")
    a = ap.parse_args()
    r = math.degrees(a.radius)

    el, az = math.radians(a.el), math.radians(a.az)
    md = (math.sin(az) * math.cos(el), math.sin(el), math.cos(az) * math.cos(el))
    print("moon dir", [round(v, 4) for v in md], "  <- paste into MOON_DIR in src/layout.ts")
    print(f"moon     az {a.az:6.1f}°  el {a.el:6.1f}°  (a direction: the same from every camera)\n")

    cams = {"B1end": (0.45, 1.46, -1.85), "B9": (-0.1, 1.62, -2.1), "window": (0.05, 1.6, -0.45)}
    points = {
        "win top": (0, 2.34, -0.1),
        "sill": (0, 0.93, -0.1),
        "head": (0, 1.2, -0.98),
        "lantern mid": (0.45, 2.1, 4.2),
        "lantern end": (2.3, 2.1, 4.2),
    }
    for n, c in cams.items():
        row = [f"{k} ({x:6.1f}°, {y:5.1f}°)" for k, (x, y) in ((k, ang(c, p)) for k, p in points.items())]
        top_el = ang(c, points["win top"])[1]
        sill_el = ang(c, points["sill"])[1]
        if sill_el + r < a.el < top_el - r:
            verdict = "whole disc inside the window"
        elif sill_el - r < a.el < top_el + r:
            verdict = "PARTLY CUT by the lintel or sill"
        else:
            verdict = "HIDDEN (outside the window)"
        print(f"{n:7s}", " | ".join(row))
        print(f"{'':7s} moon (el {a.el - r:.1f}°..{a.el + r:.1f}°): {verdict}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
