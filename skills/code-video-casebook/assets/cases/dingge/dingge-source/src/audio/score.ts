import { SFX, ambience } from './sfx';
import { SHOTS, shotStarts, TOTAL } from '../film/shots';

// Soundtrack = ambience bed (automated per shot) + SFX cues (from the shot list) + two music themes.
// Rendered offline to a WAV for the film; the same functions drive live sound in the sandbox.
// Rule from the director's notes: no music during the incident; hard silence on the freeze frame.

const BPM = 92, BEAT = 60 / BPM;
const note = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
// A: A minor, restrained;  B: C major, lifted
const PROG = {
  A: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],
  B: [[48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 65]],
};

function music(ctx: BaseAudioContext, out: AudioNode, theme: 'A' | 'B', t0: number, t1: number) {
  const bus = ctx.createGain(); bus.gain.setValueAtTime(0, t0); bus.gain.linearRampToValueAtTime(1, t0 + 0.6);
  bus.gain.setValueAtTime(1, Math.max(t0 + 0.6, t1 - 0.8)); bus.gain.linearRampToValueAtTime(0, t1); bus.connect(out);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = theme === 'A' ? 1600 : 2400; lp.connect(bus);
  const bar = BEAT * 4;
  for (let t = t0, i = 0; t < t1; t += bar, i++) {
    const chord = PROG[theme][i % 4];
    // pad
    for (const n of chord) for (const det of [-6, 6]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = note(n); o.detune.value = det;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.018, t + 0.5); g.gain.setValueAtTime(0.018, t + bar - 0.3); g.gain.linearRampToValueAtTime(0, t + bar + 0.1);
      o.connect(g); g.connect(lp); o.start(t); o.stop(t + bar + 0.15);
    }
    // bass
    const b = ctx.createOscillator(); b.type = 'triangle'; b.frequency.value = note(chord[0] - 12);
    const bg = ctx.createGain(); bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(0.09, t + 0.02); bg.gain.exponentialRampToValueAtTime(0.02, t + bar);
    b.connect(bg); bg.connect(bus); b.start(t); b.stop(t + bar);
    // plucked pulse on eighths (arpeggio)
    for (let k = 0; k < 8; k++) {
      const tt = t + k * BEAT / 2; if (tt > t1) break;
      const n = chord[[0, 1, 2, 1, 0, 2, 1, 2][k]] + 12;
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = note(n);
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(2600, tt); f.frequency.exponentialRampToValueAtTime(500, tt + 0.2);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(theme === 'A' ? 0.02 : 0.026, tt + 0.005); g.gain.exponentialRampToValueAtTime(0.0005, tt + 0.28);
      o.connect(f); f.connect(g); g.connect(bus); o.start(tt); o.stop(tt + 0.3);
    }
    // soft kick on 1 and 3 (theme B also 2 and 4 hats)
    for (const beat of [0, 2]) { const tt = t + beat * BEAT; const o = ctx.createOscillator(); o.frequency.setValueAtTime(110, tt); o.frequency.exponentialRampToValueAtTime(42, tt + 0.18); const g = ctx.createGain(); g.gain.setValueAtTime(0.14, tt); g.gain.exponentialRampToValueAtTime(0.001, tt + 0.25); o.connect(g); g.connect(bus); o.start(tt); o.stop(tt + 0.3); }
  }
}

export function buildSoundtrack(ctx: BaseAudioContext) {
  const master = ctx.createDynamicsCompressor();
  master.threshold.value = -14; master.ratio.value = 3; master.attack.value = 0.005; master.release.value = 0.2;
  const out = ctx.createGain(); out.gain.value = 0.95; master.connect(out); out.connect(ctx.destination);
  const starts = shotStarts();
  const bed = ambience(ctx, master, 0, TOTAL + 1);
  // ambience automation: settle to each shot's level, hard cut when the level is 0 (freeze = silence)
  SHOTS.forEach((s, i) => {
    const t = starts[i], lvl = s.amb ?? 0.7;
    if (lvl === 0) bed.gain.setValueAtTime(0, t);
    else { bed.gain.setValueAtTime(bed.gain.value, t); bed.gain.setTargetAtTime(lvl, t, 0.15); }
  });
  // sfx cues
  SHOTS.forEach((s, i) => { for (const c of s.sfx ?? []) { const f = SFX[c.id]; if (f) f(ctx, master, Math.max(0, starts[i] + c.t), c.gain); } });
  // music segments: consecutive shots with the same theme
  let cur: 'A' | 'B' | null = null, segStart = 0;
  SHOTS.forEach((s, i) => {
    const m = s.music ?? null;
    if (m !== cur) { if (cur) music(ctx, master, cur, segStart, starts[i] + 0.4); cur = m; segStart = starts[i]; }
  });
  if (cur) music(ctx, master, cur, segStart, TOTAL);
}

export async function renderSoundtrack(sampleRate = 48000): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(2, Math.ceil((TOTAL + 0.5) * sampleRate), sampleRate);
  buildSoundtrack(ctx);
  return ctx.startRendering();
}

export function wavBytes(buf: AudioBuffer): Uint8Array {
  const ch = buf.numberOfChannels, len = buf.length, sr = buf.sampleRate;
  const data = new DataView(new ArrayBuffer(44 + len * ch * 2));
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); data.setUint32(4, 36 + len * ch * 2, true); w(8, 'WAVE'); w(12, 'fmt '); data.setUint32(16, 16, true);
  data.setUint16(20, 1, true); data.setUint16(22, ch, true); data.setUint32(24, sr, true); data.setUint32(28, sr * ch * 2, true);
  data.setUint16(32, ch * 2, true); data.setUint16(34, 16, true); w(36, 'data'); data.setUint32(40, len * ch * 2, true);
  const chans = Array.from({ length: ch }, (_, i) => buf.getChannelData(i));
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, chans[c][i])); data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  return new Uint8Array(data.buffer);
}
