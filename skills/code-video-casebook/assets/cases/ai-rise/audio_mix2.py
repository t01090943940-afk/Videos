#!/usr/bin/env python3
"""v2 mix: BGM re-cut at beat boundaries + SFX + English TTS hits."""
import subprocess, json

TL = json.load(open('/home/ubuntu/video/timeline.json'))
I = TL['interval']; B0 = TL['beat0']
def Bs(k): return B0 + k*I           # source beats in mk_403.mp3
I_ = I
def Bv(k): return k*I_               # video beats

A = 'audio'
bgm = f'{A}/mk_403.mp3'

# BGM segments (source seconds): -8→0, 0→28, 112→134, 134→162
segs = [(Bs(-8),Bs(0)),(Bs(0),Bs(28)),(Bs(112),Bs(134)),(Bs(134),Bs(162))]

# TTS: (file, video_time, style)
tts = [
 ('sees',    Bv(25), 'norm'),
 ('writes',  Bv(27), 'norm'),
 ('creates', Bv(29), 'norm'),
 ('replace', Bv(33), 'dark'),
 ('amplify', Bv(41), 'norm'),
 ('everything', Bv(71), 'norm'),
 ('you',     Bv(73), 'dark'),
 ('endline', Bv(79), 'norm'),
]

# SFX: (file, video_time, vol, dur)
sfx = [
 ('2507', 0.0,   0.30, 40.0),          # ambience bed
 ('784',  2.75,  0.85, 1.0),           # reverse→drop A
 ('175',  2.3,   0.5,  1.4),
 ('1143', Bv(8), 1.0,  2.0),           # drop A slam
 ('788',  Bv(8), 0.8,  2.0),
 ('2595', Bv(13),0.55, 1.0),           # whooshes on cuts
 ('1044', Bv(19),0.55, 1.0),
 ('1093', Bv(25),0.5,  1.0),
 ('2150', Bv(25),0.5,  0.6),           # punch under voices
 ('2150', Bv(27),0.5,  0.6),
 ('2150', Bv(29),0.55, 0.6),
 ('2608', Bv(31),0.8,  2.0),           # vacuum
 ('790',  Bv(38),0.65, 2.6),           # riser amplify→build
 ('2521', Bv(44),0.4,  0.5),           # build ticks ramp
 ('2521', Bv(46),0.42, 0.5),
 ('2521', Bv(48),0.45, 0.5),
 ('2521', Bv(50),0.5,  0.5),
 ('900',  Bv(52),0.7,  0.4),           # 3-2-1 beeps
 ('900',  Bv(53),0.7,  0.4),
 ('900',  Bv(54),0.75, 0.4),
 ('1088', Bv(55.6),0.7, 1.2),          # tape-stop into blackout
 ('2908', Bv(58),1.0,  2.5),           # drop B mega impact
 ('1143', Bv(58),0.9,  2.0),
 ('561',  Bv(60),0.45, 0.5),           # glitch stabs in montage
 ('2964', Bv(62),0.45, 0.5),
 ('561',  Bv(64),0.45, 0.5),
 ('2964', Bv(66),0.45, 0.5),
 ('561',  Bv(68),0.45, 0.5),
 ('2964', Bv(70),0.5,  0.5),
 ('1492', Bv(72),0.5,  0.6),           # pre-YOU tick
 ('788',  Bv(74),0.85, 1.5),           # statement hit
 ('2672', Bv(77),0.6,  3.0),           # swell into end
 ('1039', Bv(79),0.6,  1.5),           # sub under endline
 ('2521', Bv(83),0.35, 0.4),           # end tick
]

inputs = [bgm]
for n,_,_ in tts: inputs.append(f'audio/tts/{n}.mp3')
for n,_,_,_ in sfx: inputs.append(f'audio/sfx_{n}.mp3')

fc = []
# BGM concat
parts=[]
for i,(a,b) in enumerate(segs):
    fc.append(f'[0:a]atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS[s{i}]')
    parts.append(f'[s{i}]')
fc.append(''.join(parts)+f'concat=n={len(segs)}:v=0:a=1,afade=t=out:st=37.9:d=1.9,volume=1.0[bgm]')

# TTS chains
def tts_fx(style):
    base = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse"
    if style=='dark':
        return base + ",asetrate=48000*0.9,aresample=48000,highpass=f=140,aecho=0.8:0.7:40|80:0.4|0.25,volume=1.7"
    return base + ",highpass=f=160,aecho=0.75:0.6:35|70:0.32|0.2,volume=1.55"

for i,(n,t,st) in enumerate(tts,1):
    fc.append(f'[{i}:a]{tts_fx(st)},adelay={int(t*1000)}|{int(t*1000)}[t{i}]')

off = 1+len(tts)
for j,(n,t,v,d) in enumerate(sfx):
    k = off+j
    fc.append(f'[{k}:a]atrim=0:{d},asetpts=PTS-STARTPTS,adelay={int(t*1000)}|{int(t*1000)},volume={v}[f{k}]')

mix_in = '[bgm]' + ''.join(f'[t{i}]' for i in range(1,len(tts)+1)) + ''.join(f'[f{off+j}]' for j in range(len(sfx)))
fc.append(mix_in + f'amix=inputs={1+len(tts)+len(sfx)}:normalize=0,alimiter=limit=0.95[mix]')

cmd = ['ffmpeg','-y']
for p in inputs: cmd += ['-i',p]
cmd += ['-filter_complex',';'.join(fc),'-map','[mix]','-c:a','aac','-b:a','192k','-t','40.2','audio/mix2.m4a']
r = subprocess.run(cmd,capture_output=True,text=True)
print(r.returncode, r.stderr[-800:] if r.returncode else 'MIX OK')
