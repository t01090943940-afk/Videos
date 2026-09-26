import os,sys,time,subprocess,concurrent.futures
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
(ROOT/'renders').mkdir(exist_ok=True)
def render(part):
 log=ROOT/'renders'/f'part_{part:02d}.log'
 env=os.environ.copy();env['OPENBLAS_NUM_THREADS']='1';env['LP_NUM_THREADS']='2'
 start=time.time()
 with open(log,'w') as f:
  p=subprocess.run([sys.executable,str(ROOT/'source'/'render.py'),'--part',str(part)],stdout=f,stderr=subprocess.STDOUT,env=env)
 if p.returncode:raise RuntimeError(f'part {part}: '+log.read_text()[-4000:])
 return part,time.time()-start
if __name__=='__main__':
 t=time.time()
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
  futures=[pool.submit(render,p) for p in range(17)]
  for future in concurrent.futures.as_completed(futures):
   part,elapsed=future.result();print(f'Completed {part:02d}/16 in {elapsed:.1f}s; total {time.time()-t:.1f}s',flush=True)
 print('ALL 3600 FRAMES COMPLETE',flush=True)
