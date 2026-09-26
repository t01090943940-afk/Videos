import type { ActKey, ActLoop, Shot, WorldManifest } from "./types";
import { ease, hash, rng } from "./rng";

/**
 * Performance = named key poses on the stepped clock.
 * Loops (typing, drawing, nodding) are generators that expand into keys, so a shot reads like a
 * dope sheet: "kai: typing 0–2.4s, anticipate 2.4, hit enter 2.9 (hold), cheer 3.4".
 */
export const LOOPS: Record<string, { poses: string[]; rate: number; ease: ActKey["ease"] }> = {
  typing: { poses: ["type_a", "type_b"], rate: 3, ease: "hold" },
  draw: { poses: ["draw_a", "draw_b", "draw_c", "draw_b"], rate: 4, ease: "hold" },
  nod: { poses: ["nod_a", "nod_b"], rate: 2.2, ease: "inOut" },
  idle: { poses: ["seated_idle", "seated_breathe"], rate: 0.8, ease: "inOut" },
};

export function expandLoop(l: ActLoop, phase = 0): ActKey[] {
  const def = LOOPS[l.loop];
  if (!def) throw new Error(`unknown loop "${l.loop}"`);
  const step = 1 / (l.rate ?? def.rate);
  const keys: ActKey[] = [];
  let i = 0;
  for (let t = l.from + phase * step; t < l.to - 1e-6; t += step, i++) keys.push({ actor: l.actor, at: t, pose: def.poses[i % def.poses.length], ease: def.ease });
  if (!keys.length || keys[0].at > l.from + 1e-6) keys.unshift({ actor: l.actor, at: l.from, pose: def.poses[0], ease: def.ease });
  return keys;
}

export interface Track {
  keys: ActKey[];
}

/** Compile a shot's acting into one sorted key track per actor (ambient loops for everyone else). */
export function compileShot(shot: Shot, world: WorldManifest): Record<string, Track> {
  const out: Record<string, Track> = {};
  for (const a of shot.acting ?? []) {
    const keys = "loop" in a ? expandLoop(a) : [a];
    (out[a.actor] ??= { keys: [] }).keys.push(...keys);
  }
  for (const [id, def] of Object.entries(world.actors)) {
    if (out[id]) continue;
    const r = rng(hash(`${shot.id}:${id}`));
    if (def.ambient === "typing") out[id] = { keys: expandLoop({ actor: id, loop: "typing", from: 0, to: shot.duration, rate: 2.2 + r() * 1.4 }, r()) };
    else out[id] = { keys: [{ actor: id, at: 0, pose: "seated_idle" }] };
  }
  for (const t of Object.values(out)) t.keys.sort((a, b) => a.at - b.at);
  return out;
}

/** Which two poses and how far between them, at stepped time t. */
export function sampleTrack(track: Track, t: number): { a: string; b: string; u: number; keyed: boolean } {
  const k = track.keys;
  let i = 0;
  while (i + 1 < k.length && k[i + 1].at <= t + 1e-6) i++;
  const k0 = k[i], k1 = k[i + 1];
  if (!k1 || k1.ease === "hold" || t <= k0.at) return { a: k0.pose, b: k0.pose, u: 0, keyed: true };
  const raw = (t - k0.at) / Math.max(1e-6, k1.at - k0.at);
  const e = ease[(k1.ease ?? "inOut") as keyof typeof ease] ?? ease.inOut;
  return { a: k0.pose, b: k1.pose, u: e(Math.min(1, raw)), keyed: raw <= 1e-6 };
}
