import subprocess,json,re
from pathlib import Path
import soundfile as sf
import numpy as np
p=Path(__file__).resolve().parents[1]
src=p/'assets'/'score60_raw.wav'
cmd=['ffmpeg','-hide_banner','-i',str(src),'-af','loudnorm=I=-16:TP=-1.3:LRA=9:print_format=json','-f','null','-']
r=subprocess.run(cmd,capture_output=True,text=True,check=True)
report=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0]
(p/'qa'/'audio_first_pass.json').write_text(json.dumps(report,indent=2))
a='loudnorm=I=-16:TP=-1.3:LRA=9:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true:print_format=json'.format(**report)
tmp=p/'assets'/'score60_master_tmp.wav'
r=subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(src),'-af',a,'-ar','48000','-c:a','pcm_s24le',str(tmp)],capture_output=True,text=True,check=True)
(p/'qa'/'audio_second_pass.txt').write_text(r.stderr)
z,sr=sf.read(tmp,dtype='float32',always_2d=True)
z=z[:60*sr];z[int(5.5*sr):int(6*sr)]=0
sf.write(p/'assets'/'score60_master.flac',z,sr,subtype='PCM_24')
print('Mastered frames',len(z),'SR',sr,'peak',float(np.max(np.abs(z))))
tmp.unlink()
