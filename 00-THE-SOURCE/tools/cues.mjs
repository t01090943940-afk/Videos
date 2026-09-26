// timeline.mjs → build/cues.json（配乐读这个文件：画面与声音同一张表）
import fs from 'node:fs';
import * as TL from '../src/timeline.mjs';
fs.mkdirSync(new URL('../build/', import.meta.url), { recursive: true });
const out = { BPM: TL.BPM, BEAT: TL.BEAT, TOTAL_BEATS: TL.TOTAL_BEATS, DURATION: TL.DURATION, SECTIONS: TL.SECTIONS, CUES: TL.CUES,
  REVEAL: TL.REVEAL, PREDROP: TL.PREDROP, ORB: TL.ORB, SILENCE: TL.SILENCE, INSIDE: TL.INSIDE, OUTRO: TL.OUTRO, GENESIS: TL.GENESIS };
fs.writeFileSync(new URL('../build/cues.json', import.meta.url), JSON.stringify(out, null, 1));
console.log('cues', TL.CUES.length, 'kinds', [...new Set(TL.CUES.map((c) => c.kind))].join(','));
