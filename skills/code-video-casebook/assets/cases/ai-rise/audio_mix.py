#!/usr/bin/env python3
"""Build the SFX cue track and mix with BGM via ffmpeg."""
import subprocess, json, os
A = "/home/ubuntu/video/audio"
B0 = 12.9567; BI = 0.4644
def B(k): return B0 + k*BI

# (file, start_time_s, volume)
cues = [
  ("sfx_2507.mp3", 0.0, 0.30),   # sci-fi computer ambience bed (23.5s)
  ("sfx_2297.mp3", 5.6, 0.45),   # bass rumble hum
  ("sfx_2521.mp3", 0.50, 0.20),  # terminal line ticks
  ("sfx_2521.mp3", 2.00, 0.20),
  ("sfx_2521.mp3", 3.50, 0.20),
  ("sfx_2521.mp3", 5.00, 0.20),
  ("sfx_2521.mp3", 6.80, 0.22),
  ("sfx_2521.mp3", 8.20, 0.24),
  ("sfx_784.mp3",  2.86, 0.55),  # reverse cinematic impact -> ends on drop A
  ("sfx_1143.mp3", 12.90, 0.95), # DROP A: cinematic whoosh deep impact
  ("sfx_788.mp3",  12.90, 0.60), # + big cinematic impact layer
  ("sfx_1490.mp3", B(16)-0.05, 0.5),  # transition whooshes per cut
  ("sfx_1492.mp3", B(32)-0.05, 0.5),
  ("sfx_2637.mp3", B(48)-0.05, 0.45),
  ("sfx_2150.mp3", B(55)-0.02, 0.55), # slam hits on each word
  ("sfx_2150.mp3", B(62)-0.02, 0.55),
  ("sfx_175.mp3",  B(65)-0.02, 0.4),
  ("sfx_2608.mp3", B(68)-0.05, 0.6),  # vacuum into breakdown
  ("sfx_561.mp3",  44.8, 0.30),       # long sweep under breakdown
  ("sfx_900.mp3",  B(76), 0.16),      # sparse ui ticks in question
  ("sfx_900.mp3",  B(84), 0.16),
  ("sfx_900.mp3",  B(92), 0.16),
  ("sfx_2520.mp3", B(100), 0.5),      # amplify confirm
  ("sfx_3116.mp3", B(108), 0.4),      # cybernetic affirmation on merge
  ("sfx_790.mp3",  B(112), 0.6),      # riser starts build
  ("sfx_561.mp3",  65.0, 0.28),       # long sweep under build
  ("sfx_1088.mp3", 73.6, 0.55),       # tape rewind suck into blackout
  ("sfx_2908.mp3", B(134)-0.06, 1.0), # DROP B: epic trailer impact
  ("sfx_1143.mp3", B(134)-0.02, 0.7), # layered deep impact
  ("sfx_788.mp3",  B(172)-0.04, 0.85),# statement hit
  ("sfx_2672.mp3", B(180), 0.5),      # angelic swell into end card
  ("sfx_2520.mp3", 100.2, 0.35),      # final confirm tick
]
# accelerating ticks on each beat through the build B(114)..B(133)
for k in range(114,134):
    prog=(k-114)/19
    cues.append(("sfx_2521.mp3", B(k), 0.10+0.35*prog))
# montage glitch stabs at 2-bar accents
for j,(k,f) in enumerate([(138,'2595'),(146,'1457'),(154,'1093'),(162,'1044'),(170,'2595')]):
    cues.append((f"sfx_{f}.mp3", B(k), 0.5))

# write ffmpeg filter script
inputs=[]
filters=[]
mix_inputs=[]
# [0] = bgm
inputs.append(f'{A}/mk_403.mp3')
filters.append("[0:a]atrim=0:102.6,asetpts=PTS-STARTPTS,afade=t=out:st=99.6:d=3,volume=1.0[bgm]")
mix_inputs.append("[bgm]")
for i,(f,st,v) in enumerate(cues):
    inp=f"{A}/{f}"
    inputs.append(inp)
    n=i+1
    ms=int(st*1000)
    filters.append(f"[{n}:a]atrim=0:12,asetpts=PTS-STARTPTS,adelay={ms}|{ms},volume={v}[s{n}]")
    mix_inputs.append(f"[s{n}]")
filters.append(f"{''.join(mix_inputs)}amix=inputs={len(mix_inputs)}:normalize=0:dropout_transition=0,alimiter=limit=0.95:level=false,afade=t=out:st=101.8:d=0.8[out]")

cmd=["ffmpeg","-y"]
for i in inputs: cmd+=["-i",i]
cmd+=["-filter_complex",";".join(filters),"-map","[out]","-ar","48000","-ac","2","-c:a","aac","-b:a","192k","/home/ubuntu/video/audio/mix.m4a"]
print(" ".join(cmd)[:300])
r=subprocess.run(cmd,capture_output=True,text=True)
print(r.returncode, r.stderr[-800:] if r.returncode else "OK")
