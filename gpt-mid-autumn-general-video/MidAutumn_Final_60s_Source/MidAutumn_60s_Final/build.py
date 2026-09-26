#!/usr/bin/env python3
"""Build the delivered film using the included mastered soundtrack."""
import argparse, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def run(args):
 subprocess.run([str(x) for x in args],check=True)

def main():
 p=argparse.ArgumentParser()
 p.add_argument('--workers',type=int,default=3)
 p.add_argument('--out',default=str(ROOT/'MidAutumn_Final_60s_1080p60.mp4'))
 p.add_argument('--rebuild-audio',action='store_true')
 a=p.parse_args()
 if a.rebuild_audio:
  run([sys.executable,ROOT/'src'/'music60.py'])
  run([sys.executable,ROOT/'src'/'master_audio.py'])
 audio=ROOT/'assets'/'score60_master.flac'
 if not audio.is_file():raise FileNotFoundError(audio)
 out=ROOT/'render';out.mkdir(exist_ok=True)
 spans=[(0,16),(16,30),(30,45),(45,60)]
 def part(item):
  i,(start,end)=item
  path=out/f'part{i}.mp4'
  run([sys.executable,ROOT/'src'/'film60.py','--start',start,'--end',end,'--out',path])
  return path
 with ThreadPoolExecutor(max_workers=max(1,min(4,a.workers))) as pool:
  paths=list(pool.map(part,enumerate(spans)))
 listing=out/'concat.txt'
 listing.write_text(''.join("file '"+x.as_posix().replace("'","'\\''")+"'\n" for x in paths))
 run(['ffmpeg','-hide_banner','-y','-f','concat','-safe','0','-i',listing,'-i',audio,'-i',ROOT/'chapters.ffmeta','-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-c:v','copy','-c:a','aac','-b:a','256k','-t','60','-movflags','+faststart',a.out])
 print(a.out)
if __name__=='__main__':main()
