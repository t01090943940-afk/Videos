"""Assemble the 17 rendered segments, master the score and write H.264/AAC MP4."""
import json,subprocess,os,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
story=json.loads((ROOT/'source'/'story.json').read_text())
parts=[ROOT/'renders'/f'part_{i:02d}.mp4' for i in range(17)]
for p in parts:
 if not p.exists():raise FileNotFoundError(p)
concat=ROOT/'renders'/'concat.txt';concat.write_text(''.join("file '"+str(p)+"'\n" for p in parts))
meta=[';FFMETADATA1','title='+story['title']+' | BEYOND GENERATION','artist=Original procedural animation and sound design','comment=15 visual worlds; original 128 BPM score; 1920x1080, 30 fps. Research and provenance in the project.']
chapters=[(0,3.75,'OPEN / BEYOND GENERATION')]+[(3.75+i*7.5,3.75+(i+1)*7.5,f"{i+1:02d} / "+s['style']) for i,s in enumerate(story['scenes'])]+[(116.25,120,'END / BUILD WITH INTENT')]
for start,end,title in chapters:meta+=['[CHAPTER]','TIMEBASE=1/1000','START='+str(round(start*1000)),'END='+str(round(end*1000)),'title='+title]
mp=ROOT/'renders'/'chapters.ffmeta';mp.write_text('\n'.join(meta),encoding='utf-8')
# Conservative true-peak ceiling leaves room for the lossy AAC encoder.
# Verify the encoded file, not only the source PCM or loudnorm output.
filt='loudnorm=I=-16:TP=-4:LRA=9:linear=false:print_format=json'
out=ROOT.parent/'AI_BEYOND_GENERATION_1080p.mp4'
cmd=['ffmpeg','-hide_banner','-y','-f','concat','-safe','0','-i',str(concat),'-i',str(ROOT/'assets'/'original_score.wav'),'-i',str(mp),'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-af',filt,'-t','120','-movflags','+faststart',str(out)]
with open(ROOT/'qa'/'final_mux.log','w') as f:subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT,check=True)
local=ROOT/out.name
if local.exists():local.unlink()
os.link(out,local)
print('FINAL',out,out.stat().st_size)
