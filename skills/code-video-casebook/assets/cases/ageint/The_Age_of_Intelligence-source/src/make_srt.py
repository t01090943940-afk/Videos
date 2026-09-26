"""[补全] Write the bilingual SRT from timeline.SUBS (was an inline snippet in the session)."""
import os, sys
import timeline as TL


def ts(sec):
    ms = int(round(sec * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(TL.BUILD, 'AGE_OF_INTELLIGENCE_subtitles.srt')
blocks = [f'{i}\n{ts(b0 * TL.BEAT)} --> {ts(b1 * TL.BEAT)}\n{en}\n{zh}\n'
          for i, (b0, b1, en, zh) in enumerate(TL.SUBS, 1)]
open(out, 'w', encoding='utf-8').write('\n'.join(blocks))
print('wrote', out, len(blocks), 'cues')
