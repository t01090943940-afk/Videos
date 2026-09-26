// Procedural sound library. Every effect is a function of (context, destination, start time, gain) and works in both
// a live AudioContext (sandbox) and an OfflineAudioContext (film render), so the set's sounds are reusable assets.

type Ctx = BaseAudioContext;
const noiseCache = new WeakMap<Ctx, AudioBuffer>();
function noise(ctx: Ctx): AudioBuffer {
  let b = noiseCache.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0); let s = 12345;
    for (let i = 0; i < d.length; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = (s / 0x7fffffff) * 2 - 1; }
    noiseCache.set(ctx, b);
  }
  return b;
}
function env(ctx: Ctx, dest: AudioNode, t: number, a: number, peak: number, d: number, sustain = 0, rel = 0.05): GainNode {
  const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(Math.max(1e-4, peak * sustain + 1e-4), t + a + d);
  if (sustain > 0) g.gain.setTargetAtTime(0, t + a + d, rel);
  g.connect(dest); return g;
}
function noiseSrc(ctx: Ctx, t: number, dur: number, type: BiquadFilterType, f: number, q: number, out: AudioNode, f2?: number) {
  const s = ctx.createBufferSource(); s.buffer = noise(ctx); s.loop = true;
  const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
  s.connect(fl); fl.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
  return fl;
}
function tone(ctx: Ctx, t: number, dur: number, f: number, type: OscillatorType, out: AudioNode, f2?: number) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  o.connect(out); o.start(t); o.stop(t + dur + 0.05); return o;
}
/** struck steel tube: inharmonic partials with separate decays */
function metal(ctx: Ctx, t: number, out: AudioNode, base: number, gain: number, decay = 0.8) {
  const ratios = [1, 2.76, 5.4, 8.93];
  ratios.forEach((r, i) => { const g = env(ctx, out, t, 0.002, gain / (i + 1.2), decay / (i * 0.6 + 1)); tone(ctx, t, decay, base * r, 'sine', g); });
  const g2 = env(ctx, out, t, 0.001, gain * 0.6, 0.03); noiseSrc(ctx, t, 0.05, 'highpass', 2000, 0.7, g2);
}

export type SfxFn = (ctx: Ctx, out: AudioNode, t: number, gain?: number) => void;

export const SFX: Record<string, SfxFn> = {
  heart: (c, o, t, g = 1) => {
    for (const [dt, a] of [[0, 1], [0.16, 0.7]] as const) { const e = env(c, o, t + dt, 0.005, 0.9 * g * a, 0.18); tone(c, t + dt, 0.2, 62, 'sine', e, 38); }
  },
  type: (c, o, t, g = 0.5) => { for (let i = 0; i < 12; i++) { const e = env(c, o, t + i * 0.07 + (i % 3) * 0.01, 0.001, 0.25 * g, 0.02); noiseSrc(c, t + i * 0.07, 0.03, 'bandpass', 3500, 2, e); } },
  slam: (c, o, t, g = 1) => { const e = env(c, o, t, 0.003, 1.0 * g, 0.9); tone(c, t, 0.9, 90, 'sine', e, 32); const e2 = env(c, o, t, 0.002, 0.5 * g, 0.4); noiseSrc(c, t, 0.4, 'lowpass', 1800, 0.7, e2, 200); },
  hit: (c, o, t, g = 1) => { const e = env(c, o, t, 0.002, 0.8 * g, 0.25); tone(c, t, 0.25, 120, 'sine', e, 45); const e2 = env(c, o, t, 0.001, 0.35 * g, 0.12); noiseSrc(c, t, 0.14, 'bandpass', 1800, 0.8, e2); },
  whistle: (c, o, t, g = 1) => {
    for (const [dt, d] of [[0, 0.55]] as const) {
      const e = env(c, o, t + dt, 0.02, 0.22 * g, d, 0.8, 0.05);
      const osc = tone(c, t + dt, d, 2900, 'sine', e);
      const lfo = c.createOscillator(); lfo.frequency.value = 34; const lg = c.createGain(); lg.gain.value = 140; lfo.connect(lg); lg.connect(osc.frequency); lfo.start(t + dt); lfo.stop(t + dt + d);
    }
  },
  whistle2: (c, o, t, g = 1) => { SFX.whistle(c, o, t, g * 0.8); SFX.whistle(c, o, t + 0.7, g * 0.8); },
  whistleFar: (c, o, t, g = 0.4) => { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2400; f.connect(o); SFX.whistle(c, f, t, g * 0.5); },
  tie: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.02, 0.35 * g, 0.28); const fl = noiseSrc(c, t, 0.3, 'bandpass', 5200, 3, e); fl.frequency.linearRampToValueAtTime(3200, t + 0.3); metal(c, t + 0.26, o, 1800, 0.05 * g, 0.2); },
  stamp: (c, o, t, g = 0.8) => { const e = env(c, o, t, 0.002, 0.6 * g, 0.18); tone(c, t, 0.2, 140, 'sine', e, 60); const e2 = env(c, o, t, 0.001, 0.2 * g, 0.08); noiseSrc(c, t, 0.1, 'lowpass', 3000, 0.7, e2); },
  pipeLift: (c, o, t, g = 0.7) => { metal(c, t, o, 410, 0.12 * g, 1.2); const e = env(c, o, t + 0.05, 0.05, 0.12 * g, 0.4); noiseSrc(c, t + 0.05, 0.45, 'bandpass', 2600, 4, e); },
  pipeDrop: (c, o, t, g = 0.8) => { metal(c, t, o, 380, 0.28 * g, 1.6); metal(c, t + 0.12, o, 395, 0.12 * g, 1.1); },
  pipeKnock: (c, o, t, g = 0.7) => { metal(c, t, o, 300, 0.18 * g, 0.5); const e = env(c, o, t, 0.001, 0.3 * g, 0.06); tone(c, t, 0.08, 160, 'sine', e, 90); },
  step: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.003, 0.4 * g, 0.09); tone(c, t, 0.1, 110, 'sine', e, 60); metal(c, t + 0.01, o, 2200, 0.02 * g, 0.12); const e2 = env(c, o, t, 0.002, 0.08 * g, 0.06); noiseSrc(c, t, 0.08, 'bandpass', 900, 1, e2); },
  cloth: (c, o, t, g = 0.4) => { const e = env(c, o, t, 0.08, 0.1 * g, 0.3); noiseSrc(c, t, 0.4, 'bandpass', 1500, 0.6, e); },
  breath: (c, o, t, g = 0.4) => { const e = env(c, o, t, 0.25, 0.07 * g, 0.45); noiseSrc(c, t, 0.7, 'bandpass', 900, 0.8, e, 1400); },
  exhale: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.05, 0.12 * g, 1.1); noiseSrc(c, t, 1.2, 'bandpass', 1100, 0.7, e, 500); },
  gasp: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.03, 0.16 * g, 0.22); noiseSrc(c, t, 0.26, 'bandpass', 1400, 1.2, e, 2300); },
  craneHum: (c, o, t, g = 0.6) => {
    const e = env(c, o, t, 0.6, 0.08 * g, 3.0, 0.6, 0.4);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.connect(e);
    tone(c, t, 3.5, 52, 'sawtooth', lp); tone(c, t, 3.5, 104.5, 'sawtooth', lp);
    const e2 = env(c, o, t, 0.8, 0.012 * g, 3.0, 0.5, 0.4); tone(c, t, 3.5, 640, 'triangle', e2, 690);
  },
  click: (c, o, t, g = 1) => { for (const dt of [0, 0.045]) { const e = env(c, o, t + dt, 0.0005, 0.45 * g, 0.012); noiseSrc(c, t + dt, 0.02, 'highpass', 3500, 0.8, e); metal(c, t + dt, o, 3900, 0.05 * g, 0.12); } },
  buckle: (c, o, t, g = 1) => { for (const dt of [0, 0.03]) { const e = env(c, o, t + dt, 0.0005, 0.5 * g, 0.015); noiseSrc(c, t + dt, 0.02, 'bandpass', 2200, 1.5, e); } const e2 = env(c, o, t, 0.001, 0.12 * g, 0.05); tone(c, t, 0.06, 1500, 'square', e2, 900); },
  webbing: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.05, 0.12 * g, 0.3); noiseSrc(c, t, 0.35, 'bandpass', 700, 1.2, e, 2400); },
  tug: (c, o, t, g = 0.7) => { const e = env(c, o, t, 0.004, 0.25 * g, 0.08); noiseSrc(c, t, 0.1, 'bandpass', 600, 1.5, e); const e2 = env(c, o, t, 0.002, 0.25 * g, 0.1); tone(c, t, 0.12, 95, 'sine', e2, 60); },
  rebarRoll: (c, o, t, g = 0.8) => { for (let i = 0; i < 7; i++) metal(c, t + i * 0.045 + (i % 2) * 0.012, o, 1500 + i * 80, 0.05 * g, 0.15); const e = env(c, o, t, 0.01, 0.12 * g, 0.35); noiseSrc(c, t, 0.4, 'lowpass', 500, 0.7, e); },
  scuff: (c, o, t, g = 0.7) => { const e = env(c, o, t, 0.01, 0.2 * g, 0.25); noiseSrc(c, t, 0.3, 'bandpass', 1200, 0.8, e, 400); },
  freeze: (c, o, t, g = 1) => { const e = env(c, o, t, 0.002, 0.35 * g, 0.4); tone(c, t, 0.42, 420, 'sawtooth', e, 38); const e2 = env(c, o, t, 0.001, 0.5 * g, 0.9); tone(c, t, 1.0, 55, 'sine', e2, 30); },
  pop: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.002, 0.25 * g, 0.09); tone(c, t, 0.1, 520, 'sine', e, 980); },
  tick: (c, o, t, g = 0.5) => { const e = env(c, o, t, 0.001, 0.2 * g, 0.03); tone(c, t, 0.04, 1800, 'square', e); },
  whoosh: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.25, 0.25 * g, 0.4); noiseSrc(c, t, 0.7, 'bandpass', 300, 1.4, e, 3000); },
  riser: (c, o, t, g = 0.6) => { const e = env(c, o, t, 0.9, 0.18 * g, 0.2); noiseSrc(c, t, 1.1, 'bandpass', 400, 2, e, 5000); const e2 = env(c, o, t, 0.9, 0.06 * g, 0.2); tone(c, t, 1.1, 110, 'sawtooth', e2, 440); },
  counter: (c, o, t, g = 0.5) => { let x = 0; for (let i = 0; i < 26; i++) { x += 0.02 + i * 0.0022; const e = env(c, o, t + x, 0.001, 0.12 * g, 0.02); tone(c, t + x, 0.03, 2400, 'square', e); } },
  rewind: (c, o, t, g = 0.8) => {
    const dur = 2.7;
    const e = env(c, o, t, 0.05, 0.14 * g, dur, 0.9, 0.1);
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.2; bp.connect(e);
    const osc = tone(c, t, dur, 900, 'sawtooth', bp);
    const lfo = c.createOscillator(); lfo.frequency.setValueAtTime(5, t); lfo.frequency.linearRampToValueAtTime(14, t + dur);
    const lg = c.createGain(); lg.gain.value = 600; lfo.connect(lg); lg.connect(osc.frequency); lfo.start(t); lfo.stop(t + dur);
    const e2 = env(c, o, t, 0.05, 0.1 * g, dur, 0.9, 0.1); noiseSrc(c, t, dur, 'highpass', 3000, 0.7, e2);
  },
  railHit: (c, o, t, g = 1) => { metal(c, t, o, 260, 0.3 * g, 1.3); const e = env(c, o, t, 0.002, 0.7 * g, 0.2); tone(c, t, 0.22, 95, 'sine', e, 50); },
  ropeTaut: (c, o, t, g = 1) => { const e = env(c, o, t, 0.002, 0.35 * g, 0.12); noiseSrc(c, t, 0.14, 'bandpass', 800, 2, e); const e2 = env(c, o, t, 0.002, 0.3 * g, 0.18); tone(c, t, 0.2, 140, 'triangle', e2, 70); },
  chime: (c, o, t, g = 0.6) => { [880, 1320, 1760, 2640].forEach((f, i) => { const e = env(c, o, t, 0.003, (0.18 / (i + 1)) * g, 2.2 / (i * 0.4 + 1)); tone(c, t, 2.4, f, 'sine', e); }); },
  hammerFar: (c, o, t, g = 0.3) => metal(c, t, o, 900 + Math.random() * 300, 0.04 * g, 0.3),
};

/** Continuous site ambience (traffic rumble, wind, distant work). Returns the gain node to automate. */
export function ambience(ctx: Ctx, out: AudioNode, t0: number, dur: number): GainNode {
  const bed = ctx.createGain(); bed.gain.value = 0; bed.connect(out);
  const r1 = ctx.createGain(); r1.gain.value = 0.16; r1.connect(bed);
  noiseSrc(ctx, t0, dur, 'lowpass', 220, 0.5, r1);
  const w = ctx.createGain(); w.gain.value = 0.05; w.connect(bed);
  const wf = noiseSrc(ctx, t0, dur, 'bandpass', 700, 0.5, w);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.13; const lg = ctx.createGain(); lg.gain.value = 300; lfo.connect(lg); lg.connect(wf.frequency); lfo.start(t0); lfo.stop(t0 + dur);
  let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let t = t0 + 0.4; t < t0 + dur; t += 0.25 + rnd() * 1.4) { if (rnd() < 0.7) SFX.hammerFar(ctx, bed, t, 0.5 + rnd() * 0.6); }
  return bed;
}
