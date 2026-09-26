"""Two-stage mastering with a measured final linear gain trim."""
from pathlib import Path
import subprocess,re,json,os
BASE=Path(__file__).resolve().parent
tmp=BASE/'score_normalized_tmp.wav'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(BASE/'score_raw.wav'),'-af','loudnorm=I=-14:TP=-1.3:LRA=7','-ar','48000','-c:a','pcm_s16le',str(tmp)],check=True)
def measure(path):
 p=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','loudnorm=I=-14:TP=-1.3:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 chunks=re.findall(r'\{[^{}]+\}',p.stderr,re.S)
 return json.loads(chunks[-1]),p.stderr
m,_=measure(tmp)
gain=min(-14.-float(m['input_i']),-1.65-float(m['input_tp']))
out=BASE/'score_mastered_tmp.wav'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(tmp),'-af',f'volume={gain:.5f}dB','-ar','48000','-c:a','pcm_s16le',str(out)],check=True)
os.replace(out,BASE/'score.wav');tmp.unlink()
m,log=measure(BASE/'score.wav');(BASE/'audio_analysis.log').write_text(log)
(BASE/'audio_measurements.json').write_text(json.dumps({'linear_trim_db':gain,'measured_lufs':float(m['input_i']),'measured_true_peak_dbtp':float(m['input_tp']),'measured_lra':float(m['input_lra'])},indent=2))
print('AUDIO MASTER',m['input_i'],'LUFS,',m['input_tp'],'dBTP',flush=True)
