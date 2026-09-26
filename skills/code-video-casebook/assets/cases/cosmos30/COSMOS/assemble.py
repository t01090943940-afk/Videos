"""Validate, concatenate and mux the thirty deterministic shot renders."""
from pathlib import Path
import subprocess,json,hashlib,os
BASE=Path(__file__).resolve().parent
OUT=Path(os.environ.get('COSMOS_OUTPUT',str(BASE/'COSMOS_30_STYLES_72s_1080p.mp4')))
rows=json.loads((BASE/'storyboard.json').read_text())
for i in range(30):
 p=BASE/'clips'/f'{i:02}.mp4'
 if not p.exists():raise FileNotFoundError(p)
 d=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
 v=next(x for x in d['streams'] if x['codec_type']=='video')
 assert int(v['nb_frames'])==72,(i,v.get('nb_frames'))
 assert (v['width'],v['height'])==(1920,1080),(i,v['width'],v['height'])
 assert abs(float(d['format']['duration'])-2.4)<.01
concat=BASE/'concat.txt';concat.write_text(''.join("file '"+str(BASE/'clips'/f'{i:02}.mp4')+"'\n" for i in range(30)))
meta=[';FFMETADATA1','title=COSMOS - Thirty Coded Worlds','artist=Original procedural film and score','comment=30 styles / 72 seconds / 200 BPM / 10 Hz stop-motion poses / scientific scenarios are labelled']
for r in rows:
 meta += ['[CHAPTER]','TIMEBASE=1/1000',f"START={round(r['start']*1000)}",f"END={round((r['start']+2.4)*1000)}",f"title={r['index']+1:02} - {r['style']} - {r['title']}"]
(BASE/'chapters.ffmeta').write_text('\n'.join(meta)+'\n',encoding='utf-8')
cmd=['ffmpeg','-y','-hide_banner','-loglevel','warning','-f','concat','-safe','0','-i',str(concat),'-i',str(BASE/'score.wav'),'-i',str(BASE/'chapters.ffmeta'),'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-t','72','-movflags','+faststart',str(OUT)]
subprocess.run(cmd,check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-show_chapters','-of','json',str(OUT)]))
manifest={'output':str(OUT),'bytes':OUT.stat().st_size,'sha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'dimensions':[1920,1080],'display_fps':30,'pose_fps':10,'shots':30,'shot_seconds':2.4,'music_bpm':200,'beats_per_shot':8,'probe':probe}
(BASE/'delivery_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('DELIVERED',OUT,OUT.stat().st_size)
