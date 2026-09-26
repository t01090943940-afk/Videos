#!/usr/bin/env python3
"""Original time-coded chamber score and synthetic Foley, rendered offline.
The locally installed TimGM6mb sample bank is not included in the project.
No copied song, copyrighted composition, or voice recording is used.
"""
from __future__ import annotations
import ctypes as C, ctypes.util, math, json, struct, os
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import butter,sosfilt

ROOT=Path(__file__).resolve().parents[1];SR=44100;DUR=60;N=SR*DUR
rng=np.random.default_rng(925)
lib=C.CDLL(ctypes.util.find_library('fluidsynth'))
def fn(name,restype,args):
 f=getattr(lib,name);f.restype=restype;f.argtypes=args;return f
ptr=C.c_void_p;I=C.c_int;F=C.c_float;D=C.c_double;S=C.c_char_p
settings=fn('new_fluid_settings',ptr,[])()
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.sample-rate',SR)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.gain',.52)
fn('fluid_settings_setint',I,[ptr,S,I])(settings,b'synth.polyphony',256)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.room-size',.72)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.damp',.48)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.width',76)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.level',.27)
synth=fn('new_fluid_synth',ptr,[ptr])(settings)
bank=os.environ.get('MOON_SOUNDFONT','/usr/share/sounds/sf2/TimGM6mb.sf2')
loaded=fn('fluid_synth_sfload',I,[ptr,S,I])(synth,bank.encode(),1)
if loaded<0:raise RuntimeError('Unable to load sound bank: '+bank)
program=fn('fluid_synth_program_change',I,[ptr,I,I]);cc=fn('fluid_synth_cc',I,[ptr,I,I,I])
on=fn('fluid_synth_noteon',I,[ptr,I,I,I]);off=fn('fluid_synth_noteoff',I,[ptr,I,I])
write=fn('fluid_synth_write_float',I,[ptr,I,ptr,I,I,ptr,I,I])
programs={0:0,1:46,2:48,3:42,4:73,5:8,6:89,7:107,8:43,10:11}
for ch,p in programs.items():
 program(synth,ch,p);cc(synth,ch,7,{0:102,1:75,2:70,3:67,4:45,5:65,6:35,7:72,8:69,10:48}[ch]);cc(synth,ch,10,{0:57,1:40,2:76,3:45,4:79,5:73,6:64,7:36,8:62,10:85}[ch])
 cc(synth,ch,91,43 if ch in [0,1,5,7] else 29)
# New 120-bpm arrangement. Shared motif, new structure; no sped-up master audio.
PI=math.pi;TAU=2*PI
events=[]
def ev(t,kind,*args):
 if 0<=t<DUR:events.append((float(t),kind,*args))
def note(ch,n,t,d,vel=64):
 if t>=DUR:return
 ev(t,'on',ch,int(n),int(np.clip(vel,1,113)))
 ev(min(t+d,DUR-.012),'off',ch,int(n))
def ctrl(t,ch,num,val):ev(t,'cc',ch,num,int(np.clip(val,0,127)))
chords={'D':[38,50,57,62,66,69,76], 'G':[43,55,59,62,66,69,74],
        'Bm':[35,47,54,59,62,66,73], 'A':[33,45,57,61,64,69,74],
        'Em':[40,52,55,59,62,66,74]}
theme=[[(74,0,.70),(78,1,.70),(81,2,1.45)],[(78,0,.8),(76,1.5,.65),(74,2.5,1.1)],
       [(71,0,.7),(74,1.2,.7),(78,2.5,1.1)],[(76,0,1.2),(73,1.6,.6),(69,2.7,1)],
       [(74,0,.9),(76,1,.75),(78,2.5,1)],[(81,0,.65),(83,1,.7),(81,2.2,1.4)]]
# Exact editorial intervals, with a 0.5-second beat within each interval.
bars=[(0,2,'D','intro'),(2,2,'Bm','busy'),(4,1.5,'A','busy'),
      (6,2,'Bm','memory'),(8,1.5,'G','memory'),(9.5,1.5,'A','rewind')]
for i,t in enumerate(np.arange(11,24,2)):
 bars.append((float(t),min(2,24-t),['D','G','Bm','A','D','G','A'][i],'history'))
for i,t in enumerate(np.arange(24,36,2)):
 bars.append((float(t),2,['D','G','Bm','A','G','A'][i],'present'))
bars.extend([(36,2,'Bm','heart'),(38,2,'G','heart'),(40,2,'A','heart')])
for i,t in enumerate(np.arange(42,52,2)):
 bars.append((float(t),2,['D','G','Bm','Em','A'][i],'wishes'))
bars.extend([(52,2,'D','invitation'),(54,1.5,'A','invitation')])
for bi,(t0,dur,key,style) in enumerate(bars):
 ch=chords[key];beat=.5
 energy={'intro':.56,'busy':.72,'memory':.50,'rewind':.70,'history':.76,'present':.77,'heart':.60,'wishes':.96,'invitation':.80}[style]
 note(0,ch[1],t0,dur*.88,44+energy*26)
 note(0,ch[2],t0+.027,dur*.80,34+energy*24)
 if style in ['history','present','wishes','invitation']:
  note(3,ch[1],t0+.05,dur-.07,40+energy*25)
  note(8,ch[0],t0,dur*.94,35+energy*18)
 # A clear eighth-note ostinato, leaving gaps in the reflective phrase.
 if style in ['memory','heart','intro']:
  positions=[.25,.9,1.45]
 else:positions=list(np.arange(.0,dur-.01,.25))
 for j,pos in enumerate(positions):
  if pos>=dur-.1:continue
  pitch=ch[3+j%4]+(12 if j%6==4 else 0)
  lead=7 if style in ['history','rewind'] else 1
  note(lead,pitch,t0+pos+.014, .24 if style not in ['heart','memory'] else .51,34+energy*21+(j%3)*3)
  if style=='wishes' and j%2==0:note(0,pitch+12,t0+pos+.019,.44,42)
 # Recurrent pentatonic melody, played rather than resampled.
 for n,pos,d in theme[bi%len(theme)]:
  when=t0+pos*beat+.035
  if when<t0+dur-.08:
   note(7 if style=='history' and bi<12 else 0,n,when,min(d*beat,t0+dur-when+.15),51+energy*24)
   if style in ['wishes','invitation']:note(5,n+12,when+.009,.8,40)
 # Bowed inner voices swell across the bar.
 if style not in ['intro','busy','memory']:
  for n in ch[3:6]:note(2,n,t0+.025,dur+.08,40+energy*30)
  for k in range(10):ctrl(t0+k*dur/10,2,11,54+math.sin(k/10*PI)*(22+energy*18))
  if style in ['heart','wishes','present','invitation']:
   for n in ch[3:5]:note(6,n+12,t0+.06,dur+.15,32+energy*10)
 # Percussion stays below the tune: pulse rather than trailer explosions.
 if style in ['busy','history','present','wishes']:
  for pos in [0,1.0]:
   if pos<dur:note(9,36,t0+pos,.16,40+energy*17)
  for pos in [.5,1.5]:
   if pos<dur:note(9,37,t0+pos,.1,29+energy*12)
  for j,pos in enumerate(np.arange(0,dur,.25)):
   note(9,42,t0+float(pos),.055,18+(j%2)*7+energy*6)
 if style=='history':
  note(4,ch[5]+12,t0+.8,min(.85,dur-.5),38)
 if style=='wishes':
  for n in ch[3:6]:note(2,n+12,t0+.2,dur-.05,46)
  note(10,ch[5]+12,t0+.02,1.0,37)
# A warm resolved D(add9) conclusion with an audible descending motif.
for n in [38,50,57,62,66,69,76]:note(0,n,55.5+(n%4)*.018,3.65,66 if n>57 else 52)
for n in [50,62,66,69,74]:note(2,n,55.54,3.05,60)
for n,t in [(81,55.65),(78,56.4),(76,57.18),(74,58.08)]:note(0,n,t,1.8,70)
note(5,86,55.54,2.9,43)
for ch in programs:ctrl(5.5,ch,120,0)
events.sort(key=lambda x:(x[0],0 if x[1] in ['off','cc'] else 1))
out=np.zeros((N,2),np.float32);last=0
for j,e in enumerate(events+[(DUR,'end')]):
 target=min(N,round(e[0]*SR))
 while last<target:
  count=min(16384,target-last);left=np.empty(count,np.float32);right=np.empty(count,np.float32)
  write(synth,count,left.ctypes.data,0,1,right.ctypes.data,0,1)
  out[last:last+count,0]=left;out[last:last+count,1]=right;last+=count
 if e[1]=='on':on(synth,*e[2:])
 elif e[1]=='off':off(synth,*e[2:])
 elif e[1]=='cc':cc(synth,*e[2:])
 if j%650==0:print('Music event',j,'/',len(events),flush=True)
fx=np.zeros_like(out)
def add(sig,t,amp=.04,pan=.5):
 at=int(t*SR);nn=min(len(sig),N-at)
 if nn<=0:return
 fx[at:at+nn,0]+=sig[:nn]*amp*math.sqrt(1-pan)
 fx[at:at+nn,1]+=sig[:nn]*amp*math.sqrt(pan)
def bell(t,f=880,amp=.03):
 tt=np.arange(int(1.7*SR))/SR
 sig=(np.sin(TAU*f*tt)*np.exp(-tt*3.2)+.24*np.sin(TAU*f*2.76*tt)*np.exp(-tt*6))*(1-np.exp(-tt*160))
 add(sig,t,amp,.58)
def whoosh(t,d=.28,amp=.044,pan=.5):
 tt=np.arange(int(d*SR))/SR
 z=sosfilt(butter(2,[420,6000],btype='bandpass',fs=SR,output='sos'),rng.normal(size=len(tt)))
 env=np.sin(PI*tt/d)**1.8
 add(z*env,t,amp,pan)
def click(t,amp=.025):
 tt=np.arange(int(.045*SR))/SR;z=rng.normal(size=len(tt))*np.exp(-tt*140)
 add(z,t,amp,.3+.4*((t*5)%1))
def thump(t,amp=.065):
 tt=np.arange(int(.36*SR))/SR;phase=TAU*(70*tt+35*(1-np.exp(-tt*20))/20)
 sig=np.sin(phase)*np.exp(-tt*12)*(1-np.exp(-tt*400))
 add(sig,t,amp,.5)
PI=math.pi;TAU=PI*2
cuts=[2,7,9.5,11,13.5,16,19,21.5,24,27,30,33.5,36,39,42,45,48,52,55.5]
for i,cut in enumerate(cuts):
 whoosh(max(0,cut-.14),.28,.035 if cut<36 else .045,.25+.5*(i%2))
for tt in np.arange(2.1,5.48,.20):click(float(tt),.029+(tt-2)*.003)
for tt in [11,16,24,36,42,48,55.5]:thump(tt,.057 if tt<42 else .075)
for tt in [6.0,13.5,19,39,42,55.5]:bell(tt,880 if tt<24 else 1108.73,.025)
bell(27.06,659.25,.024);bell(27.22,880,.024)
for tt in [30.72,32.72,53.02]:
 z=rng.normal(size=int(.085*SR));z=sosfilt(butter(2,[900,3500],btype='bandpass',fs=SR,output='sos'),z)
 z*=np.exp(-np.arange(len(z))/SR*65);add(z,tt,.017,.5)
for tt in [7,9.5,11,16,19,42]:
 d=.15;ttt=np.arange(int(d*SR))/SR
 z=sosfilt(butter(2,3500,fs=SR,output='sos'),rng.normal(size=len(ttt)))
 add(z*np.sin(PI*ttt/d)**2,tt,.028,.4)
# Subtle stereo air and natural tails; no narrator is synthesized.
for delay,gain in [(.10,.10),(.22,.06)]:
 n=int(delay*SR);fx[n:]+=fx[:-n,::-1]*gain
mix=out+fx
mix[int(5.5*SR):int(6*SR)]=0
n=int(.005*SR);mix[int(5.5*SR)-n:int(5.5*SR)]*=np.linspace(1,0,n)[:,None]
mix[int(6*SR):int(6*SR)+n]*=np.linspace(0,1,n)[:,None]
mix[:int(.07*SR)]*=np.linspace(0,1,int(.07*SR))[:,None]
n=int(.82*SR);mix[-n:]*=np.linspace(1,0,n)[:,None]**1.3
peak=float(np.abs(mix).max());mix*=.88/max(.88,peak)
(ROOT/'assets').mkdir(exist_ok=True)
sf.write(ROOT/'assets'/'score60_raw.wav',mix,SR,subtype='PCM_24')
# Standard MIDI file, editable without any instrument bank being distributed.
def vlq(v):
 a=[v&127];v>>=7
 while v:a.append((v&127)|128);v>>=7
 return bytes(reversed(a))
me=[]
for ch,p in programs.items():me.append((0,bytes([0xc0+ch,p])))
for e in events:
 tt=round(e[0]*960)
 if e[1]=='on':msg=bytes([0x90+e[2],e[3],e[4]])
 elif e[1]=='off':msg=bytes([0x80+e[2],e[3],0])
 else:msg=bytes([0xb0+e[2],e[3],e[4]])
 me.append((tt,msg))
me.sort(key=lambda x:x[0]);track=b'\x00\xff\x51\x03\x07\xa1\x20';prev=0
for tt,msg in me:track+=vlq(tt-prev)+msg;prev=tt
track+=b'\x00\xff\x2f\x00'
(ROOT/'assets'/'score60.mid').write_bytes(b'MThd'+struct.pack('>IHHH',6,0,1,480)+b'MTrk'+struct.pack('>I',len(track))+track)
(ROOT/'assets'/'audio_cues.json').write_text(json.dumps({'duration':60,'bpm':120,'editorial_silence':[5.5,6.0],'cuts':cuts,'bars':bars,'events':len(events),'narration':False},indent=2,default=lambda x: x.item()))
fn('delete_fluid_synth',None,[ptr])(synth);fn('delete_fluid_settings',None,[ptr])(settings)
print('New 60s score rendered. Peak before scaling:',peak,flush=True)
