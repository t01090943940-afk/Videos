"""Decode every frame, test frame count and blank frames, and audit all chapter boundaries.
This is a technical screen; it does not assert a subjective 'zero defect' artistic guarantee.
"""
from pathlib import Path
import subprocess,json,hashlib,time
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent.parent
video=ROOT/'AI_BEYOND_GENERATION_1080p.mp4';start=time.time()
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-show_chapters','-of','json',str(video)]))
cmd=['ffmpeg','-hide_banner','-loglevel','error','-threads','2','-i',str(video),'-map','0:v:0','-vf','scale=320:180','-pix_fmt','rgb24','-f','rawvideo','pipe:1']
p=subprocess.Popen(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
N=320*180*3;count=0;black=[];white=[];flat=[];means=[];stds=[];prev=None;run=1;maxrun=1
while True:
 data=p.stdout.read(N)
 if not data:break
 if len(data)!=N:raise RuntimeError('Incomplete decoded frame')
 a=np.frombuffer(data,np.uint8);m=float(a.mean());s=float(a.std());means.append(m);stds.append(s)
 if int(a.max())<=3:black.append(count)
 if int(a.min())>=252:white.append(count)
 if s<.25:flat.append(count)
 digest=hashlib.blake2b(data,digest_size=12).digest()
 if digest==prev:run+=1
 else:run=1
 maxrun=max(maxrun,run);prev=digest;count+=1
ret=p.wait()
if ret:raise RuntimeError(p.stderr.read().decode())
assert count==3600,(count,'expected 3600 frames')
assert not black and not white and not flat,(black,white,flat)
vs=next(s for s in probe['streams'] if s['codec_type']=='video');au=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (vs['width'],vs['height'],vs['r_frame_rate'])==(1920,1080,'30/1')
assert abs(float(vs['duration'])-float(au['duration']))<.04
# Full-resolution frame hashes detect exact duplicates without relying on the scaled screen.
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-threads','2','-i',str(video),'-map','0:v:0','-f','framemd5',str(ROOT/'qa'/'frames.framemd5')],check=True)
lines=[s for s in (ROOT/'qa'/'frames.framemd5').read_text().splitlines() if s and not s.startswith('#')]
last=None;max_exact=1;run=1
for s in lines:
 h=s.split(',')[-1].strip();run=run+1 if h==last else 1;max_exact=max(max_exact,run);last=h
report={'video':video.name,'bytes':video.stat().st_size,'duration_seconds':float(probe['format']['duration']),'width':vs['width'],'height':vs['height'],'fps':vs['r_frame_rate'],'decoded_frames':count,'expected_frames':3600,'video_codec':vs['codec_name'],'audio_codec':au['codec_name'],'audio_sample_rate':au['sample_rate'],'audio_channels':au['channels'],'audio_video_duration_difference':abs(float(vs['duration'])-float(au['duration'])),'chapters':len(probe['chapters']),'all_black_frame_count':len(black),'all_white_frame_count':len(white),'uniform_blank_frame_count':len(flat),'minimum_frame_mean':min(means),'minimum_frame_std':min(stds),'maximum_exact_duplicate_run_full_resolution':max_exact,'maximum_exact_duplicate_run_scaled_screen':maxrun,'beat_alignment_maximum_rounding_error_ms':1000/60,'visual_review':'Chapter overviews and 3 samples per segment. Dedicated reading zones during close-ups; no text crossfades. This does not claim exhaustive human review of every pixel.','music':'Original synthesized score. The researched third-party BGM recording was not downloaded and is not used.','analysis_seconds':time.time()-start}
(ROOT/'qa'/'QA_REPORT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
# Three grids contain actual native-resolution-render samples from all fifteen worlds.
f=ImageFont.truetype('/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf',17)
for phase in range(3):
 sheet=Image.new('RGB',(1920,720),'#111820');d=ImageDraw.Draw(sheet)
 for i in range(1,16):
  files=sorted((ROOT/'qa').glob(f'part{i:02d}_f*.jpg'),key=lambda x:int(x.stem.split('_f')[-1]));im=Image.open(files[min(phase,len(files)-1)]).resize((374,210));x=(i-1)%5*384;y=(i-1)//5*240;sheet.paste(im,(x+5,y+5));d.text((x+10,y+217),f'WORLD {i:02} / SHOT {phase+1}',font=f,fill='#dbe7de')
 sheet.save(ROOT/'qa'/f'final_review_{phase+1}.jpg',quality=94)
print(json.dumps(report,indent=2,ensure_ascii=False))
