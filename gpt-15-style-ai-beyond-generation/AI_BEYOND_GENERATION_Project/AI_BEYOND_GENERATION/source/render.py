"""Render the final film. Usage: python render.py --part 0 [--width 1920 --height 1080].
Parts 0..16: intro, 15 worlds, outro. Every frame is placed on the same 30-FPS timeline.
"""
import argparse,json,math,subprocess,time
from pathlib import Path
import numpy as np
from PIL import Image
from art import Art,ROOT,transition,B
FPS=30;DURATION=120.;INTRO=8*B;WORLD=16*B;OUTRO=248*B
CUTS=[0.,INTRO]+[INTRO+i*WORLD for i in range(1,16)]+[DURATION]
# Uniform boundaries round to the closest video frame; max timing error < 16.7 ms.
BOUNDS=[int(t*FPS+.5) for t in CUTS]

def raw(art,idx,t):
 if idx<0:return art.intro(max(0,t))
 if idx>14:return art.intro(max(0,t),True)
 return art.render(idx,t)
def frame_at(art,t):
 boundaries=[INTRO+i*WORLD for i in range(16)]
 near=min(range(16),key=lambda k:abs(t-boundaries[k]));delta=t-boundaries[near];window=.16
 if abs(delta)<window:
  prev=near-1;current=near
  prevstart=0 if prev<0 else INTRO+prev*WORLD
  a=raw(art,prev,t-prevstart);b=raw(art,current,t-boundaries[near]);p=(delta+window)/(2*window)
  return transition(a,b,p,near)
 if t<INTRO:return art.intro(t)
 if t>=OUTRO:return art.intro(t-OUTRO,True)
 i=min(14,int((t-INTRO)/WORLD));return art.render(i,t-INTRO-i*WORLD)

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--part',type=int,required=True);ap.add_argument('--width',type=int,default=1920);ap.add_argument('--height',type=int,default=1080);ap.add_argument('--fps',type=int,default=30);args=ap.parse_args()
 assert args.fps==30,'Timeline is calibrated for 30 fps.'
 start,end=BOUNDS[args.part],BOUNDS[args.part+1];out=ROOT/'renders';out.mkdir(exist_ok=True);path=out/f'part_{args.part:02d}.mp4'
 art=Art(args.width,args.height)
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','bgra','-video_size',f'{args.width}x{args.height}','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','1','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',str(path)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);t0=time.time();stats=[]
 try:
  for n in range(start,end):
   a=frame_at(art,n/FPS);proc.stdin.write(np.ascontiguousarray(a).tobytes())
   if (n-start)%60==0 or n==end-1:
    mean=float(a[:,:,:3].mean());std=float(a[:,:,:3].std());stats.append({'frame':n,'mean':round(mean,3),'std':round(std,3)});print(f'part {args.part:02d}: {n-start+1}/{end-start}, elapsed {time.time()-t0:.1f}s, mean {mean:.1f}',flush=True)
   if n in [start+round((end-start)*.2),start+round((end-start)*.55),start+round((end-start)*.82)]:
    Image.fromarray(a[:,:,[2,1,0]]).resize((960,540)).save(ROOT/'qa'/f'part{args.part:02d}_f{n}.jpg',quality=92)
 finally:
  proc.stdin.close()
 ret=proc.wait()
 if ret:raise RuntimeError(f'ffmpeg exited {ret}')
 (out/f'part_{args.part:02d}.json').write_text(json.dumps({'part':args.part,'start_frame':start,'end_frame_exclusive':end,'frames':end-start,'seconds':(end-start)/FPS,'render_seconds':time.time()-t0,'samples':stats},indent=2))
 print('DONE',path,flush=True)
if __name__=='__main__':main()
