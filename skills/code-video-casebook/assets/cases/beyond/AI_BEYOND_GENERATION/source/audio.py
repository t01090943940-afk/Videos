"""Original 128 BPM electronic score and sample-accurate transition sound design.
No samples from the researched Kevin MacLeod recording are used.
"""
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io.wavfile import write
from pathlib import Path
SR=48000; BPM=128; BEAT=60/BPM; DURATION=120
rng=np.random.default_rng(713)
mix=np.zeros((int(SR*DURATION),2),np.float32)
def add(x,t,gain=1,pan=0):
    start=int(t*SR); off=max(0,-start); start=max(0,start); n=min(len(x)-off,len(mix)-start)
    if n<=0:return
    x=np.asarray(x[off:off+n],np.float32)*gain
    if x.ndim==1:
        mix[start:start+n,0]+=x*np.sqrt((1-pan)*.5)
        mix[start:start+n,1]+=x*np.sqrt((1+pan)*.5)
    else: mix[start:start+n]+=x

def tt(d):return np.arange(int(SR*d),dtype=np.float32)/SR
def filt(x,hz,typ='lowpass',order=2):return sosfilt(butter(order,hz,btype=typ,fs=SR,output='sos'),x).astype(np.float32)
def notehz(m):return 440*2**((m-69)/12)
def kick():
 t=tt(.42); freq=48+125*np.exp(-t*44); ph=2*np.pi*np.cumsum(freq)/SR
 return .87*np.sin(ph)*np.exp(-t*10)+.22*rng.normal(0,1,len(t))*np.exp(-t*300)
def snare():
 t=tt(.25); n=filt(rng.normal(0,1,len(t)).astype(np.float32),1400,'highpass')
 return .40*n*np.exp(-t*20)+.35*np.sin(2*np.pi*185*t)*np.exp(-t*28)
def hat(opened=False):
 t=tt(.18 if opened else .045); n=rng.normal(0,1,len(t)).astype(np.float32)
 return filt(n,7000,'highpass')*np.exp(-t*(22 if opened else 85))*.21
K=kick(); S=snare(); HC=hat(); HO=hat(True)
chords=[(40,47,52,55),(36,43,48,52),(43,50,55,59),(38,45,50,54)]
# Pads: wide detuned partials, low-pass movement, and sidechain breathing.
for bar in range(64):
 ci=(bar//2)%4; chord=chords[ci]; start=bar*4*BEAT
 t=tt(4*BEAT+.35); env=np.minimum(t/.07,1)*np.minimum((len(t)/SR-t)/.35,1)
 localbeat=(t/BEAT)%1; sc=.24+.76*(1-np.exp(-localbeat*7))
 pad=np.zeros((len(t),2),np.float32)
 for j,m in enumerate(chord[1:]):
  hz=notehz(m+12)
  for side,det in enumerate([.997,1.003]):
   v=np.zeros(len(t),np.float32)
   for h in range(1,7):v+=np.sin(2*np.pi*hz*det*h*t+j*.37)/(h**1.7)
   pad[:,side]+=v
 gain=.034 if 42<=bar<46 else .024
 add(pad*env[:,None]*sc[:,None],start,gain)
# Bass, drums, metallic hats and micro-fills.
for b in range(256):
 t0=b*BEAT; bar=b//4; ci=(bar//2)%4; root=chords[ci][0]-12
 scene=int(max(0,(b-8)//16)); breakdown=168<=b<184
 intensity=.60 if b<8 else (.90 if b<72 else 1.0)
 if not breakdown or b%4==0: add(K,t0,.66*intensity)
 if b%2==1 and not breakdown: add(S,t0,.46*intensity)
 if not breakdown:
  for q in range(4):add(HC,t0+q*BEAT/4,.36 if q%2==0 else .23,(-1 if q%2 else 1)*.35)
  add(HO,t0+BEAT/2,.25,.35)
  pattern=[0,0,7,0,0,12,7,0]
  for q in range(2):
   m=root+pattern[(b*2+q)%8]; t=tt(BEAT*.44); hz=notehz(m)
   env=(1-np.exp(-t*160))*np.exp(-t*10)
   v=np.sin(2*np.pi*hz*t)+.28*np.sin(2*np.pi*hz*2*t)+.15*np.sin(2*np.pi*hz*3*t)
   add(v*env,t0+q*BEAT/2+.028,.28)
 # Arpeggio: evolving registration, offbeat answer phrases.
 if b>=8:
  arp=[0,7,12,15,19,15,12,7]
  for q in range(2):
   t=tt(.33); m=chords[ci][0]+24+arp[(b*2+q)%8]; hz=notehz(m)
   env=(1-np.exp(-t*210))*np.exp(-t*(16 if not breakdown else 9))
   v=(np.sin(2*np.pi*hz*t)+.32*np.sin(2*np.pi*hz*2*t)+.16*np.sin(2*np.pi*hz*4*t))*env
   gain=.052 if b<200 else .065
   add(v,t0+q*BEAT/2,gain,np.sin(b*.9+q)*.65)
   add(v,t0+q*BEAT/2+BEAT*.75,gain*.22,-.65)
 if (b+1)%16==0 and b<248:
  for q in range(4):add(S,t0+q*BEAT/4,.14+.05*q,q/6-.25)
# Full-spectrum cinematic impacts at each visual-world change.
for idx,b in enumerate(range(8,249,16)):
 center=b*BEAT
 t=tt(.65); n=rng.normal(0,1,len(t)).astype(np.float32)
 whoosh=filt(n,1200+idx%4*800)*np.sin(np.pi*np.arange(len(t))/len(t))**2
 add(whoosh,center-.53,.14,0)
 t=tt(1.15); freq=34+85*np.exp(-t*14); phase=2*np.pi*np.cumsum(freq)/SR
 impact=np.sin(phase)*np.exp(-t*5)+.12*filt(rng.normal(0,1,len(t)).astype(np.float32),2400)*np.exp(-t*11)
 add(impact,center,.44)
 # bright, brief material marker (glass / paper / machine, alternating registers)
 t=tt(.16); hz=[1300,900,440,1750,2300][idx%5]
 click=(np.sin(2*np.pi*hz*t)+.4*np.sin(2*np.pi*hz*1.41*t))*np.exp(-t*50)
 add(click,center,.045,(-1)**idx*.3)
# Final resolution; no abrupt stop.
t=tt(3.5)
for m in [52,59,64,67]:
 v=np.sin(2*np.pi*notehz(m)*t)*np.exp(-t*1.2)
 add(v,116.25,.06,(m-60)/18)
# Tiny stereo room tail, saturation and click-free edges.
for delay,gain in [(0.117,.06),(0.233,.035)]:
 d=int(SR*delay); mix[d:,0]+=mix[:-d,1].copy()*gain; mix[d:,1]+=mix[:-d,0].copy()*gain
mix=np.tanh(mix*1.25)
mix[:int(.008*SR)]*=np.linspace(0,1,int(.008*SR))[:,None]
mix[-int(1.7*SR):]*=np.linspace(1,0,int(1.7*SR))[:,None]**1.2
mix*=.87/max(.001,np.max(np.abs(mix)))
path=Path(__file__).resolve().parent.parent/'assets'/'original_score.wav'; write(path,SR,(mix*32767).astype(np.int16))
print(path, 'peak',float(np.max(np.abs(mix))))
