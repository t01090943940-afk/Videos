"""Original deterministic drumstep score. 200 BPM, eight beats per shot."""
from pathlib import Path
import numpy as np
from scipy.signal import butter,sosfilt
from scipy.io import wavfile
SR=48000;N=72*SR;B=.3;BASE=Path(__file__).resolve().parent
rng=np.random.default_rng(802360)
buses={k:np.zeros((N,2),np.float32) for k in ['drums','bass','music','fx']}
def filt(x,c,kind='lowpass'):return sosfilt(butter(2,c,btype=kind,fs=SR,output='sos'),x).astype(np.float32)
def tt(d):return np.arange(int(d*SR),dtype=np.float32)/SR
def env(t,a=.004,d=.15):return (1-np.exp(-t/a))*np.exp(-t/d)
def hz(m):return 440*2**((m-69)/12)
def add(bus,x,at,g=1.,pan=0.):
 off=int(round(at*SR));x=np.asarray(x,np.float32)
 if off<0:x=x[-off:];off=0
 stop=min(N,off+len(x))
 if stop<=off:return
 x=x[:stop-off]*g
 if x.ndim==1:
  buses[bus][off:stop,0]+=x*np.cos((pan+1)*np.pi/4);buses[bus][off:stop,1]+=x*np.sin((pan+1)*np.pi/4)
 else:buses[bus][off:stop]+=x

t=tt(.42);f=48+155*np.exp(-t*45)
kick=np.sin(2*np.pi*np.cumsum(f)/SR)*env(t,.0006,.09)+filt(rng.normal(0,1,len(t)),[3500,11000],'bandpass')*np.exp(-t*450)*.2
kick=np.tanh(kick*2)*.79
t=tt(.32);snare=filt(rng.normal(0,1,len(t)),[1000,11500],'bandpass')*env(t,.0015,.055)*.95+np.sin(2*np.pi*(182*t-15*t*t))*env(t,.0008,.046)*.45
snare+=filt(rng.normal(0,1,len(t)),[600,4000],'bandpass')*(np.exp(-abs(t-.008)*500)+np.exp(-abs(t-.017)*450))*.12
snare=np.tanh(snare*1.2)*.70
t=tt(.1);hat=filt(rng.normal(0,1,len(t)),[7000,19000],'bandpass')*env(t,.0004,.016)*.30
t=tt(.3);ohat=filt(rng.normal(0,1,len(t)),[6500,17000],'bandpass')*env(t,.001,.066)*.22
t=tt(1.3);crash=filt(rng.normal(0,1,len(t)),[2800,16000],'bandpass')*env(t,.001,.37)*.26

def reese(m,d):
 t=tt(d);f=hz(m);gate=np.minimum(1,t/.004)*np.minimum(1,(d-t)/.038);out=np.zeros(len(t),np.float32)
 for k in range(1,12):out+=(np.sin(2*np.pi*f*.994*k*t)+np.sin(2*np.pi*f*1.006*k*t+.3))/(k**1.4)
 out=.19*out*(.72+.28*np.sin(2*np.pi*3.333*t+.8))+.56*np.sin(2*np.pi*f*t)
 return np.tanh(out*1.35)*gate

def pluck(m,d=.62):
 t=tt(d);ph=2*np.pi*hz(m)*t
 return (np.sin(ph+2.4*np.exp(-t*12)*np.sin(ph*2))*.57+np.sin(ph*2.003)*.13+np.sin(ph*3)*.07)*env(t,.0018,.115)

def bell(m,d=3.):
 t=tt(d);f=hz(m);out=np.zeros(len(t),np.float32)
 for r,a,dec in [(1,1,1.1),(2.01,.33,.6),(2.76,.2,.3),(4.03,.12,.18)]:out+=np.sin(2*np.pi*f*r*t)*a*env(t,.002,dec)
 return out*.30

def pad(chord,d=2.7):
 t=tt(d);e=np.minimum(t/.20,1)*np.minimum(np.maximum(d-t,0)/.42,1);out=np.zeros((len(t),2),np.float32)
 for i,m in enumerate(chord):
  for ch,det in [(0,.997),(1,1.003)]:
   ph=2*np.pi*hz(m)*det*t+i*.47;out[:,ch]+=(np.sin(ph)*.63+np.sin(ph*2)*.15+np.sin(ph*3)*.05)*e/(len(chord)**.6)
 return out*.22

def brass(chord,d=.66):
 t=tt(d);e=env(t,.012,.17);out=np.zeros(len(t),np.float32)
 for m in chord:
  ph=2*np.pi*hz(m)*t;out+=np.sin(ph+(.75+np.exp(-t*12))*np.sin(ph))*e
 return filt(out,[250,6200],'bandpass')*.12

add('fx',bell(86,4),0,.85,-.22);add('music',bell(81,3.2),1.2,.5,.25)
t=tt(9.6);hum=(np.sin(2*np.pi*36.71*t)+.3*np.sin(2*np.pi*55*t))*np.minimum(t/.03,1)*np.minimum((9.6-t),1);add('bass',hum,0,.18)
for at in [0,2.4,4.8,7.2]:add('drums',kick,at,.52 if at<4.8 else .8)
roots=[38,34,41,36];quals=[[0,3,7,10],[0,4,7,11],[0,4,7,9],[0,4,7,10]]
for shot in range(30):
 at=shot*2.4;root=roots[(shot//2)%4];chord=[root+24+q for q in quals[(shot//2)%4]];density=.45 if shot<4 else (.65 if shot in [20,21] else 1)
 if shot<28:add('music',pad(chord),at,.5 if shot<4 else .83)
 if 4<=shot<28:
  add('music',brass([root+24,root+31,root+36]),at,.85*density)
  seq=[0,2,1,3,2,1,0,2]
  for j in range(8):
   m=chord[seq[j]]+(12 if j in [3,7] and shot>=12 else 0);note=pluck(m);when=at+j*.3
   add('music',note,when,.31*density,-.3 if j%2 else .3);add('music',note,when+.225,.085*density,.38 if j%2 else -.38)
 if 2<=shot<28:
  for j in range(2):
   bar=at+j*1.2;main=(shot>=4 and shot not in [20,21]);kb=[0,1.75,2.5] if (shot+j)%2==0 else [0,2,2.75]
   if not main:kb=[0,2]
   for b in kb:add('drums',kick,bar+b*B,.97*density)
   for b in [1,3]:add('drums',snare,bar+b*B,.9*density,.02)
   if main and (shot+j)%3==0:
    for b in [.75,2.75]:add('drums',snare,bar+b*B,.15,-.12)
   for n in range(8):add('drums',hat,bar+n*.15,(.65 if n%2==0 else .4)*density,-.37 if n%2 else .37)
   if main:
    add('drums',ohat,bar+.9,1,.2)
    for b,d,mo,g in [(0,.20,0,.39),(.75,.19,0,.32),(1.5,.16,12,.27),(2,.22,0,.37),(2.75,.17,7,.28),(3.5,.14,0,.30)]:add('bass',reese(root+mo,d),bar+b*.3,g)
   else:add('bass',reese(root,.8),bar,.19)
 if 0<shot<29:
  t=tt(.075);tick=filt(rng.normal(0,1,len(t)),[2000,11000],'bandpass')*np.exp(-t*70);add('fx',tick,at,.09,-.3 if shot%2 else .3)
 if shot%4==0 and 4<=shot<28:add('drums',crash,at,.8,-.23)

for dest in [9.6,28.8,52.8,64.8]:
 t=tt(2.4);ramp=(t/2.4)**1.7;noise=filt(rng.normal(0,1,len(t)),[900,12500],'bandpass');osc=np.sin(2*np.pi*np.cumsum(200+2300*ramp)/SR)
 riser=(noise*.20+osc*.05)*ramp*(.55+.45*np.sin(2*np.pi*(6.667*t+1.8*t*t))**2)
 add('fx',riser,dest-2.4,.74,.08);add('drums',crash,dest,.75,.28)
 t=tt(.9);impact=np.sin(2*np.pi*np.cumsum(38+38*np.exp(-t*10))/SR)*np.exp(-t*5)+filt(rng.normal(0,1,len(t)),900)*np.exp(-t*13)*.27;add('fx',impact,dest,.35)
 for j in range(8):add('drums',snare,dest-.6+j*.075,.10+.025*j,(j%2-.5)*.18)
add('music',bell(81,3.2),48,.72,-.35);add('music',bell(86,3.2),50.4,.65,.35)
for at,m in [(67.2,74),(67.8,77),(68.4,81),(69.6,86),(70.2,81)]:add('music',bell(m,3),at,.54,-.2 if m%2 else .2)
add('music',pad([50,57,62,65],4.8),67.2,.65);add('bass',reese(38,1.8),67.2,.16)
music=buses['music'];wet=np.zeros_like(music)
for delay,g,swap in [(.071,.10,False),(.139,.07,True),(.225,.16,True),(.45,.09,False),(.9,.045,True)]:
 sh=int(delay*SR);wet[sh:]+=(music[:-sh,::-1] if swap else music[:-sh])*g
buses['music']+=wet
for delay,g in [(.037,.045),(.079,.026)]:
 sh=int(delay*SR);buses['drums'][sh:]+=buses['drums'][:-sh,::-1]*g
mix=sum(buses.values());mix=sosfilt(butter(2,24,btype='highpass',fs=SR,output='sos'),mix,axis=0);mix=np.tanh(mix*1.22)
tail=int(1.65*SR);mix[-tail:]*=np.linspace(1,0,tail)[:,None]**1.5;mix*=.89/max(1e-8,np.max(np.abs(mix)))
path=BASE/'score_raw.wav';wavfile.write(path,SR,np.int16(np.clip(mix,-1,1)*32767));print(path,72,'seconds',float(np.max(np.abs(mix))))
