import numpy as np, librosa, soundfile as sf
sr=48000
y,_=librosa.load('song.mp3',sr=sr,mono=False)  # (2,N)
def seg(a,b): return y[:,int(a*sr):int(b*sr)].copy()
def xjoin(p,q,ms=12):
    n=int(ms/1000*sr); f=np.linspace(0,1,n)
    out=np.concatenate([p[:,:-n], p[:,-n:]*(1-f)+q[:,:n]*f, q[:,n:]],axis=1); return out
A=seg(59.05,81.05+0.006); B=seg(87.05,120.07)
# gentle fade on the very end of B (hard stop but no click)
n=int(0.02*sr); B[:,-n:]*=np.linspace(1,0,n)
m=xjoin(A,B,6)
sil=np.zeros((2,int(0.4*sr)))
C=seg(150.03,155.2); fl=int(3.4*sr); C[:,-fl:]*=np.linspace(1,0,fl)**2
C[:,:int(0.004*sr)]*=np.linspace(0,1,int(0.004*sr))
music=np.concatenate([m,sil,C],axis=1)
fi=int(0.03*sr); music[:,:fi]*=np.linspace(0,1,fi)
T=60.0; N=int(T*sr); music=music[:,:N] if music.shape[1]>=N else np.pad(music,((0,0),(0,N-music.shape[1])))
print('music len', m.shape[1]/sr, 'total', music.shape[1]/sr)
# ---------- SFX ----------
rng=np.random.default_rng(7)
sfx=np.zeros((2,N))
def add(sig,t,g=1.0,pan=0.0):
    i=int(t*sr); j=min(N,i+sig.shape[-1]); s=sig[...,:j-i]
    if s.ndim==1: s=np.vstack([s*(1-max(0,pan)),s*(1+min(0,pan))])
    sfx[:,i:j]+=s*g
def lp(x,a):  # one-pole lowpass, a in (0,1)
    from scipy.signal import lfilter; return lfilter([a],[1,a-1],x)
def hp(x,a): return x-lp(x,a)
def impact(d=1.4):
    t=np.arange(int(d*sr))/sr
    f=38+60*np.exp(-t*9); ph=2*np.pi*np.cumsum(f)/sr
    sub=np.sin(ph)*np.exp(-t*3.2)
    crack=hp(rng.standard_normal(len(t)),0.3)*np.exp(-t*40)*0.6
    body=lp(rng.standard_normal(len(t)),0.05)*np.exp(-t*6)*1.2
    return np.tanh((sub*1.1+crack+body)*1.3)
def riser(d, up=True):
    t=np.arange(int(d*sr))/sr; x=t/d
    noise=rng.standard_normal(len(t))
    out=np.zeros(len(t))
    # sweep filtered noise by chunks
    k=2048
    for i in range(0,len(t),k):
        a=0.02+0.5*(x[i]**2); ch=noise[i:i+k]
        out[i:i+k]=hp(ch,0.9-0.85*x[i])*0 + lp(ch,a)
    f=200+1800*x**2; tone=np.sin(2*np.pi*np.cumsum(f)/sr)*0.25
    env=x**2.2
    return (out*0.9+tone)*env
def whoosh(d=0.35):
    t=np.arange(int(d*sr))/sr; x=t/d
    n=lp(rng.standard_normal(len(t)),0.25)
    return n*np.sin(np.pi*x)**2*0.9
def tick():
    t=np.arange(int(0.03*sr))/sr
    return hp(rng.standard_normal(len(t)),0.5)*np.exp(-t*260)*0.8+np.sin(2*np.pi*2400*t)*np.exp(-t*300)*0.3
def shatter(d=1.2):
    t=np.arange(int(d*sr))/sr; out=np.zeros(len(t))
    for _ in range(90):
        s=int(rng.uniform(0,0.5)**2*sr); L=int(0.05*sr)
        f=rng.uniform(2500,7000); tt=np.arange(L)/sr
        g=np.sin(2*np.pi*f*tt)*np.exp(-tt*rng.uniform(40,120))*rng.uniform(.2,.6)
        out[s:s+L]+=g[:max(0,min(L,len(t)-s))]
    out+=hp(rng.standard_normal(len(t)),0.4)*np.exp(-t*7)*0.7
    return out
def glitch(d=0.12):
    t=np.arange(int(d*sr))/sr
    sq=np.sign(np.sin(2*np.pi*rng.uniform(300,900)*t))*0.3
    return (sq+hp(rng.standard_normal(len(t)),0.6)*0.4)*(t<d)*np.exp(-t*10)
# placement (video time)
for t,g in [(4.0,1.0),(16.0,0.8),(31.0,1.15),(55.42,1.1)]: add(impact(),t,g)
add(riser(3.0),1.0,0.55); add(riser(2.75),28.25,0.7); add(riser(1.2),14.08,0.35)
add(shatter(),31.0,0.8)
for t in [7.0,8.5,10.0,11.5,19.75,22.0,32.5,38.5,44.5,50.5]: add(whoosh(),t-0.2,0.5)
# typing ticks 16.25->17.4
txt='给我一个乔布斯看了都震惊的网页。'
for i in range(len(txt)): add(tick(),16.3+i*(1.05/len(txt)),0.55,pan=rng.uniform(-.3,.3))
add(tick(),17.5,1.0); add(impact(0.6)*0.5,17.5,0.6)
for t in [1.0,1.75,2.5,3.25]: add(glitch(),t,0.45)
for k in range(4): add(impact(0.5)*0.6,27.25+0.375*k,0.55)  # 我不配问 thuds
np.save('sfx_raw.npy',sfx)
print('music peak',np.max(np.abs(music)),'sfx peak',np.max(np.abs(sfx)))
mix=music*0.9+sfx*0.28
# look-ahead-free smooth limiter: gain envelope from peak follower
env=np.max(np.abs(mix),axis=0)
from scipy.ndimage import maximum_filter1d, uniform_filter1d
pk=maximum_filter1d(env,size=int(0.01*sr)); pk=uniform_filter1d(pk,size=int(0.01*sr))
th=0.9; g=np.where(pk>th, th/pk, 1.0)
g=uniform_filter1d(g,size=int(0.005*sr))
mix=mix*g
print('peak after',np.max(np.abs(mix)), 'limited frac', np.mean(g<0.999))
mix=np.clip(mix,-0.98,0.98)
sf.write('soundtrack.wav',mix.T,sr)
