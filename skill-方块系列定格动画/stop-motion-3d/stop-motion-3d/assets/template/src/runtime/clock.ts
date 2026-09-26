import type { Episode, StageTime, WorldState, Shot } from "./types";

export const shotFrames = (s: Shot, fps: number) => Math.round(s.duration * fps);
export const totalFrames = (ep: Episode) => ep.shots.reduce((n, s) => n + shotFrames(s, ep.fps), 0);

export function shotStarts(ep: Episode) {
  const out: number[] = [];
  let f = 0;
  for (const s of ep.shots) {
    out.push(f);
    f += shotFrames(s, ep.fps);
  }
  return out;
}

/**
 * THE stop-motion rule, in integer frames (never float division):
 * puppets are held for `hold = fps / poseFps` output frames. poseFps comes from the shot's LOOK
 * (block 12, clay 8 ...), so the same performance reads "on twos" or "on threes" per style.
 */
export function stageTime(ep: Episode, frame: number, poseFpsOf: (look: string) => number): StageTime {
  const starts = shotStarts(ep);
  let i = ep.shots.length - 1;
  for (let k = 0; k < ep.shots.length; k++) {
    if (frame < starts[k] + shotFrames(ep.shots[k], ep.fps)) {
      i = k;
      break;
    }
  }
  const shot = ep.shots[i];
  const len = shotFrames(shot, ep.fps);
  const local = Math.min(Math.max(0, frame - starts[i]), len - 1);
  const hold = Math.max(1, Math.round(ep.fps / poseFpsOf(shot.look)));
  const stepped = Math.floor(local / hold) * hold;
  return { frame, fps: ep.fps, shotIndex: i, localFrame: local, t: local / ep.fps, poseT: stepped / ep.fps, u: local / Math.max(1, len - 1) };
}

/** Continuity: shot N starts from shot N-1's END state, then its own overrides, then timed events. */
export function resolveStates(ep: Episode, defaults: WorldState) {
  const starts: WorldState[] = [];
  let carry = { ...defaults };
  for (const shot of ep.shots) {
    const start = { ...carry, ...(shot.state ?? {}) };
    starts.push(start);
    carry = { ...start };
    for (const ev of shot.events ?? []) carry = { ...carry, ...ev.set };
  }
  return starts;
}

/** Events fire on the stepped clock (a hand flips the switch on a held pose). */
export function stateAt(shot: Shot, start: WorldState, poseT: number): WorldState {
  let s = { ...start };
  for (const ev of shot.events ?? []) if (poseT >= ev.t - 1e-6) s = { ...s, ...ev.set };
  return s;
}

/** Seconds since the latest event that set `key` (continuous clock) — for ramps and particles. */
export function sinceEvent(shot: Shot, key: string, t: number): number | null {
  let since: number | null = null;
  for (const ev of shot.events ?? []) if (key in ev.set && t >= ev.t) since = t - ev.t;
  return since;
}
