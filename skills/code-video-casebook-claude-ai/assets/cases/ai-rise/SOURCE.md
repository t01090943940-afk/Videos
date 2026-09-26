# ai-rise · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show ai-rise <路径>`；还原成真实目录：`python3 scripts/casebook.py copy ai-rise <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `audio_mix.py` | 73 | 26 |
| 2 | `audio_mix2.py` | 101 | 104 |
| 3 | `index.html` | 47 | 210 |
| 4 | `main.js` | 760 | 262 |
| 5 | `main_v2.js` | 759 | 1027 |
| 6 | `render.py` | 39 | 1791 |
| 7 | `render_boot.py` | 14 | 1835 |
| 8 | `render_rng.py` | 14 | 1854 |
| 9 | `scenes_v2.js` | 512 | 1873 |
| 10 | `timeline.js` | 1 | 2390 |
| 11 | `timeline.json` | 1 | 2396 |
| 12 | `tts_gen.py` | 21 | 2402 |
| 13 | `v2_head.js` | 151 | 2428 |
| 14 | `v2_tail.js` | 97 | 2584 |

---

### 1/14 · `audio_mix.py`
<!-- casebook-file {"path": "audio_mix.py", "lines": 73, "final_newline": true, "sha256": "83437da3a29ff7cac7df7640ec794f8943b95a2b66f01ace1e8d43eddddf1c0e", "original_sha256": "83437da3a29ff7cac7df7640ec794f8943b95a2b66f01ace1e8d43eddddf1c0e"} -->
```python
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
```

### 2/14 · `audio_mix2.py`
<!-- casebook-file {"path": "audio_mix2.py", "lines": 101, "final_newline": true, "sha256": "67e67b7ebc8c461a019815bc7404d513893d9a73956104f2bc0eeb2e71cacdf0", "original_sha256": "67e67b7ebc8c461a019815bc7404d513893d9a73956104f2bc0eeb2e71cacdf0"} -->
```python
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
```

### 3/14 · `index.html`
<!-- casebook-file {"path": "index.html", "lines": 47, "final_newline": true, "sha256": "6629471f43dd465378161e7381c386057be3389de7eb461f52b024bb3be4328f", "original_sha256": "6629471f43dd465378161e7381c386057be3389de7eb461f52b024bb3be4328f"} -->
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@font-face { font-family: 'Anton'; src: url('fonts/Anton.ttf'); }
@font-face { font-family: 'ArchivoBlack'; src: url('fonts/ArchivoBlack.ttf'); }
@font-face { font-family: 'SpaceGrotesk'; src: url('fonts/SpaceGrotesk.ttf'); }
@font-face { font-family: 'NotoBlack'; src: url('file:///usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'); }
@font-face { font-family: 'NotoSerifBlack'; src: url('file:///usr/share/fonts/opentype/noto/NotoSerifCJK-Black.ttc'); }
@font-face { font-family: 'JetMono'; src: url('file:///usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-ExtraBold.ttf'); }
@font-face { font-family: 'JetMonoReg'; src: url('file:///usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf'); }
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1920px; height:1080px; overflow:hidden; background:#000;
  font-family:'SpaceGrotesk',sans-serif; }
#bg { position:absolute; inset:0; z-index:0; }
#stageA,#stageB { position:absolute; inset:0; z-index:1; }
#stageB { z-index:0; }
#fx { position:absolute; inset:0; z-index:3; pointer-events:none; }
#scan { position:absolute; inset:0; z-index:4; pointer-events:none;
  background:repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,.16) 3px, rgba(0,0,0,0) 4px); }
#grain { position:absolute; inset:0; width:1920px; height:1080px; z-index:5; pointer-events:none; image-rendering:pixelated; }
#vig { position:absolute; inset:0; z-index:6; pointer-events:none;
  background:radial-gradient(ellipse 130% 110% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%); }
#hud { position:absolute; inset:0; z-index:7; pointer-events:none; font-family:'JetMonoReg',monospace; }
#lb { position:absolute; inset:0; z-index:8; pointer-events:none; }
#lb .bar { position:absolute; left:0; right:0; height:56px; background:#000; }
#lb .top { top:0; } #lb .bot { bottom:0; }
#flash { position:absolute; inset:0; z-index:9; pointer-events:none; background:#fff; opacity:0; }
hud-el { position:absolute; font-family:'JetMonoReg'; }
</style>
</head>
<body>
<canvas id="bg" width="1920" height="1080"></canvas>
<div id="stageB"></div>
<div id="stageA"></div>
<canvas id="fx" width="1920" height="1080"></canvas>
<div id="scan"></div>
<canvas id="grain" width="960" height="540"></canvas>
<div id="vig"></div>
<div id="hud"></div>
<div id="lb"><div class="bar top"></div><div class="bar bot"></div></div>
<div id="flash"></div>
<script src="timeline.js"></script>
<script src="main.js"></script>
</body>
</html>
```

### 4/14 · `main.js`
<!-- casebook-file {"path": "main.js", "lines": 760, "final_newline": true, "sha256": "e0984d79fe5b52ef4cc3de64d3c39b33893acb67cdfe9623355944276acb4475", "original_sha256": "e0984d79fe5b52ef4cc3de64d3c39b33893acb67cdfe9623355944276acb4475"} -->
```js
/* ============================================================
   AI://MIND_SYNC — deterministic beat-synced motion graphics
   renderAt(t) renders the exact frame for time t (seconds)
   ============================================================ */
const W=1920,H=1080,FPS=30;
const $=id=>document.getElementById(id);
const stageA=$('stageA'),stageB=$('stageB'),fxc=$('fx'),bgc=$('bg'),grainC=$('grain'),hud=$('hud'),flashEl=$('flash');
const bx=bgc.getContext('2d'),fx=fxc.getContext('2d'),gx=grainC.getContext('2d');

/* ---------- math helpers ---------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const easeOutExpo=k=>k>=1?1:1-Math.pow(2,-10*k);
const easeOutBack=k=>{const c=1.70158;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
const easeOutCubic=k=>1-Math.pow(1-k,3);
const easeInCubic=k=>k*k*k;
const easeInOut=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const smooth=(a,b,t)=>{const k=clamp((t-a)/(b-a),0,1);return k*k*(3-2*k);};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function B(k){return k*TL.interval;}
const BAR=4*TL.interval;

/* beat state at time t */
function beatInfo(t){
  const i=Math.floor(t/TL.interval);
  if(i<0)return{i:-1,phase:0,pulse:0,accent:false,e:0};
  const phase=(t-B(i))/TL.interval;
  const pulse=Math.exp(-phase*4.2);
  const si=clamp(i<36?i-8:i+76,0,TL.energy.length-1);
  const e=TL.energy[si]||0;
  return{i,phase,pulse,accent:i%4===0,e};
}
const PAL={cyan:'#00e5ff',mag:'#ff2d78',vio:'#a78bfa',lime:'#b8ff2e',amber:'#ffb62e',wht:'#eaf6ff',dim:'#33415e',ink:'#04060c'};

/* ---------- persistent particle field ---------- */
const NP=560;
const parts=[];
{const r=mulberry32(7);
 for(let i=0;i<NP;i++)parts.push({x:r()*2-1,y:r()*2-1,z:r(),s:.4+r()*1.6,tw:r()*6.28,hue:r()});
}
function drawParticles(t,mode,intensity,pulse){
  const f=1.6;
  const warp=mode==='warp';
  const n=Math.floor(NP*(mode==='sparse'?0.25:1));
  for(let i=0;i<n;i++){
    const p=parts[i];
    let z=(p.z + (warp? t*2.2 : t*0.05) + i*0.001)%1;
    let zz=0.06+z*1.4;
    let sx=W/2 + (p.x/zz)*W*0.62*f;
    let sy=H/2 + (p.y/zz)*H*0.62*f;
    if(sx<-40||sx>W+40||sy<-40||sy>H+40)continue;
    const sz=p.s*(1.5-z)*(1+pulse*1.4)*intensity;
    const tw=.5+.5*Math.sin(p.tw+t*3);
    const a=clamp((1.2-z),0,1)*(0.25+0.75*tw)*intensity;
    bx.globalAlpha=clamp(a,0,1);
    if(p.hue<0.55)bx.fillStyle=PAL.cyan;else if(p.hue<0.8)bx.fillStyle=PAL.vio;else bx.fillStyle=PAL.wht;
    if(warp){
      const px=W/2+(p.x/(zz+0.03))*W*0.62*f, py=H/2+(p.y/(zz+0.03))*H*0.62*f;
      bx.strokeStyle=bx.fillStyle;bx.lineWidth=sz*0.9;
      bx.beginPath();bx.moveTo(px,py);bx.lineTo(sx,sy);bx.stroke();
    }else if(mode==='burst'){
      // radial kick outward on each beat pulse
      const dx=sx-W/2,dy=sy-H/2,dl=Math.sqrt(dx*dx+dy*dy)||1;
      const kick=pulse*46;
      bx.fillRect(sx+dx/dl*kick,sy+dy/dl*kick,sz*1.4,sz*1.4);
    }else{
      bx.fillRect(sx,sy,sz,sz);
    }
  }
  bx.globalAlpha=1;
}

/* ---------- background: gradient + perspective grid ---------- */
function drawBG(t,cfg){
  const {cx,cy,c1,c2,c3,grid=true,gridSpeed=0.35,ring=0}=cfg;
  let g=bx.createRadialGradient(W*cx,H*cy,60,W*cx,H*cy,W*0.75);
  g.addColorStop(0,c1);g.addColorStop(0.45,c2);g.addColorStop(1,c3);
  bx.fillStyle=g;bx.fillRect(0,0,W,H);
  if(!grid)return;
  // floor grid, horizon at 62%
  const hz=H*0.62;
  bx.save();
  bx.strokeStyle='rgba(0,229,255,0.10)';bx.lineWidth=1;
  const sp=(t*gridSpeed)%1;
  for(let i=0;i<14;i++){
    const k=(i+sp)/14;
    const y=hz+Math.pow(k,2.4)*(H-hz);
    bx.globalAlpha=0.10+0.35*k;
    bx.beginPath();bx.moveTo(0,y);bx.lineTo(W,y);bx.stroke();
  }
  bx.globalAlpha=0.14;
  for(let i=-14;i<=14;i++){
    bx.beginPath();
    bx.moveTo(W/2+i*70,hz);
    bx.lineTo(W/2+i*W*0.22,H);
    bx.stroke();
  }
  bx.globalAlpha=1;bx.restore();
}
/* shockwave rings on accent beats */
function drawRings(t,bi){
  if(bi.i<0)return;
  for(let k=0;k<3;k++){
    const bt=B(bi.i-k*4);
    const dt=t-bt;
    if(dt<0||dt>1.6)continue;
    const r=easeOutCubic(dt/1.6)*W*0.42;
    const a=(1-dt/1.6)*0.16;
    bx.strokeStyle=`rgba(0,229,255,${a})`;
    bx.lineWidth=3-dt;
    bx.beginPath();bx.arc(W/2,H/2,r,0,6.283);bx.stroke();
  }
}

/* ---------- grain ---------- */
const noiseTile=document.createElement('canvas');noiseTile.width=160;noiseTile.height=160;
{const nx=noiseTile.getContext('2d'),id=nx.createImageData(160,160),r=mulberry32(99);
 for(let i=0;i<id.data.length;i+=4){const v=r()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=26;}
 nx.putImageData(id,0,0);}
function drawGrain(frame){
  gx.clearRect(0,0,960,540);
  const r=mulberry32(frame);
  const ox=r()*160,oy=r()*160;
  gx.globalAlpha=0.9;
  for(let x=-160;x<960+160;x+=160)for(let y=-160;y<540+160;y+=160)
    gx.drawImage(noiseTile,x-ox,y-oy);
  gx.globalAlpha=1;
}

/* ---------- DOM helpers ---------- */
function el(tag,css,parent,html){const d=document.createElement(tag);d.style.cssText=css;if(html!=null)d.innerHTML=html;(parent||stageA).appendChild(d);return d;}
function txt(css,html,parent){return el('div',`position:absolute;font-family:Anton;white-space:nowrap;`+css,parent,html);}
function mono(css,html,parent){return el('div',`position:absolute;font-family:JetMonoReg;white-space:pre;`+css,parent,html);}
function cjk(css,html,parent){return el('div',`position:absolute;font-family:NotoBlack;white-space:nowrap;`+css,parent,html);}

/* chromatic split via stacked copies */
function chromaText(css,html,parent,dx){
  const wrap=el('div','position:absolute;'+css,parent);
  const mk=(col,x)=>{const t=el('div',`position:absolute;left:${x}px;top:0;color:${col};mix-blend-mode:screen;`,wrap,html);return t;};
  mk('rgba(255,45,120,.85)',-dx);mk('rgba(0,229,255,.85)',dx);
  const main=el('div','position:relative;color:#fff;',wrap,html);
  return{wrap,main};
}
/* text-slam timing */
function slam(t,t0,dur=0.34){
  const k=clamp((t-t0)/dur,0,1);
  return{scale:1+2.6*(1-easeOutExpo(k)),op:k<0.05?k/0.05:1,blur:(1-k)*22,k};
}

/* ============================================================
/* ============================================================
   SCENES — v2 hypercut, 86 beats ≈ 39.94s
   beat k => time B(k) = k*0.464399
   ============================================================ */
const scenes=[];
function scene(id,s,e,build,draw){scenes.push({id,s,e,build,draw,built:false,el:null});}
function getScene(id){return scenes.find(s=>s.id===id);}

/* ---- S0 BOOT (v0→8) ---- */
const BOOT_LINES=[
 ['$ neural_core --init --mode=sentient',0.25],
 ['[OK] corpus indexed :: 15.7T tokens',0.9],
 ['[OK] synaptic mesh :: 1.8T params',1.55],
 ['[!!] consciousness threshold :: 99.7%',2.2],
];
scene('boot',0,B(8),
 div=>{
   el('div','position:absolute;left:0;right:0;top:0;bottom:0;',div).id='bootwrap';
   const w=$('bootwrap');
   const term=el('div','position:absolute;left:50%;top:47%;width:1240px;transform:translate(-50%,-50%);background:rgba(5,12,20,.93);border:1px solid rgba(0,229,255,.5);border-radius:10px;box-shadow:0 0 110px rgba(0,229,255,.22), inset 0 0 80px rgba(0,0,0,.55);padding:38px 46px;',w);
   el('div','height:14px;margin-bottom:22px;',term).innerHTML='<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ff5f56;margin-right:8px"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ffbd2e;margin-right:8px"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#27c93f"></span><span style="font-family:JetMonoReg;font-size:15px;color:#3b4a63;margin-left:20px">neural_core — zsh — 140×36</span>';
   el('div','font-family:JetMonoReg;font-size:30px;line-height:1.9;color:#8fffd0;min-height:280px;text-shadow:0 0 8px rgba(126,249,198,.4);white-space:pre;',term).id='termlines';
   mono('left:70px;bottom:76px;font-size:19px;color:#55688a;letter-spacing:2px;','',w).id='bootcap';
   mono('right:70px;top:70px;font-size:16px;color:#33415e;text-align:right;','SESSION 0924\nLOG://AWAKENING',w);
 },
 (div,t)=>{
   const tl=$('termlines');
   let html='';
   for(const[line,t0]of BOOT_LINES){
     if(t<t0)break;
     const chars=Math.floor((t-t0)*60);
     const s=line.slice(0,chars);
     html+=s.replace(/\[OK\]/g,'<span style="color:#00e5ff">[OK]</span>').replace(/\[!!\]/g,'<span style="color:#ff2d78">[!!]</span>').replace(/\$/g,'<span style="color:#a78bfa">$</span>');
     if(chars<line.length)html+='<span style="background:#7ef9c6;color:#000">&nbsp;</span>';
     html+='\n';
   }
   if(t>BOOT_LINES[BOOT_LINES.length-1][1]&&Math.floor(t*3)%2===0)html+='<span style="background:#7ef9c6;color:#000">&nbsp;</span>';
   tl.innerHTML=html;
   $('bootcap').textContent = t<1.4 ? '2026 // 觉醒前夜' : t<2.6 ? 'SIGNAL INCOMING …' : '> transmit';
   const w=$('bootwrap');
   const col=smooth(3.0,3.65,t);
   if(col>0){
     const sc=1-0.4*easeInCubic(col), jit=col*col*9;
     const r=mulberry32(Math.floor(t*90));
     w.style.transform=`scale(${sc}) translate(${(r()-0.5)*jit*8}px,${(r()-0.5)*jit*4}px)`;
     w.style.filter=`hue-rotate(${(r()-0.5)*col*160}deg) brightness(${1+col*2.2})`;
   }else{
     w.style.transform='none';w.style.filter=`brightness(${0.72+0.28*smooth(0,0.9,t)})`;
   }
 });
scenes[0].bg=t=>({cx:0.5,cy:0.55,c1:'#060a14',c2:'#04060c',c3:'#010204',grid:true,gridSpeed:0.06,pmode:'sparse',pi:0.5});

/* ---- S1 AI REVEAL (v8→13) ---- */
scene('reveal',B(8),B(13),
 div=>{
   el('div','position:absolute;inset:0;',div).id='revealInner';
   const inner=$('revealInner');
   el('div','position:absolute;left:50%;top:40%;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,255,.16) 0%,rgba(0,229,255,.05) 40%,transparent 70%);transform:translate(-50%,-50%);',inner).id='aiAura';
   const big=txt('left:50%;top:40%;font-size:560px;color:#fff;letter-spacing:-0.02em;','AI',inner);big.id='bigAI';
   const sub=txt('left:50%;top:76%;font-family:ArchivoBlack;font-size:64px;color:#fff;letter-spacing:0.5em;','ARTIFICIAL INTELLIGENCE',inner);sub.id='aiSub';
   cjk('left:50%;top:20%;font-size:46px;color:#00e5ff;letter-spacing:1.2em;','人 工 智 能',inner).id='aiCjk';
 },
 (div,t)=>{
   const s=slam(t,B(8),0.4);
   const bi=beatInfo(t);
   const big=$('bigAI');
   const shakeAmp=bi.pulse*9;
   const r=mulberry32(Math.floor(t*60));
   const jx=(r()-0.5)*shakeAmp,jy=(r()-0.5)*shakeAmp*0.6;
   // glitch hits on each beat: chroma explode + tiny rotation
   const hit=bi.pulse;
   big.style.transform=`translate(-50%,-50%) scale(${s.scale+hit*0.03}) rotate(${(1-s.k)*-4+(r()-0.5)*shakeAmp*0.24}deg) translate(${jx}px,${jy}px)`;
   big.style.opacity=s.op;
   big.style.filter=`blur(${(1-s.k)*10}px)`;
   big.style.textShadow=`${-hit*14}px 0 rgba(255,45,120,.6), ${hit*14}px 0 rgba(0,229,255,.6), 0 0 90px rgba(0,229,255,.35)`;
   $('aiAura').style.transform=`translate(-50%,-50%) scale(${0.7+hit*0.35})`;
   $('aiAura').style.opacity=0.4+hit*0.6;
   $('aiSub').style.opacity=smooth(B(8.5),B(10),t);
   $('aiSub').style.letterSpacing=`${0.5-easeOutCubic(seg(t,B(8.5),B(10)))*0.32}em`;
   $('aiCjk').style.opacity=smooth(B(9),B(10.5),t);
 });
getScene('reveal').bg=t=>({cx:0.5,cy:0.5,c1:'#0a1430',c2:'#060a18',c3:'#02030a',grid:true,gridSpeed:0.5,pmode:'burst',pi:1});

/* ---- S2 CODE RAIN — IT LEARNED (v13→19) ---- */
scene('rain',B(13),B(19),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='rainCv';
   const big=txt('left:110px;top:36%;font-size:200px;color:#fff;','IT LEARNED',div);big.id='rainT1';
   const mid=el('div','position:absolute;left:110px;top:57%;font-family:SpaceGrotesk;font-weight:700;font-size:54px;color:#fff;letter-spacing:.06em;',div,'FROM EVERYTHING WE EVER MADE');mid.id='rainT2';
   cjk('left:110px;top:67%;font-size:40px;color:#00e5ff;','它消化了人类写下的一切',div).id='rainCjk';
   mono('right:110px;top:34%;font-size:32px;color:#b8ff2e;text-align:right;','',div).id='rainCnt';
   mono('right:110px;top:40%;font-size:18px;color:#55688a;text-align:right;','TOKENS · INGESTED',div);
   txt('right:110px;top:52%;font-size:96px;color:#ff2d78;','',div).id='rainKw';
   mono('right:110px;bottom:14%;font-size:15px;color:#3b4a63;text-align:right;line-height:1.9;width:520px;white-space:pre-wrap;','',div).id='rainLog';
 },
 (div,t)=>{
   const cv=$('rainCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   const bi=beatInfo(t);
   const cols=44,pool='アイウエオカキクケコサシスセソ01{}<>[];=+*#$λΣΦΨ∴';
   const ramp=1+seg(t,B(13),B(19))*1.6;
   for(let i=0;i<cols;i++){
     const r=mulberry32(i*7+13);
     const x=i*(W/cols)+r()*20;
     const speed=(14+r()*22)*60*ramp;
     const len=10+Math.floor(r()*22);
     const y0=((t*speed + r()*4000)%(H+len*26))-len*26;
     for(let j=0;j<len;j++){
       const y=y0-j*26;
       if(y<-30||y>H+30)continue;
       const ch=pool[Math.floor(mulberry32(i*31+j*7+Math.floor(t*8))()*pool.length)];
       const head=j===0;
       c.font=`${head?24:20}px JetMonoReg`;
       c.fillStyle=head?'#dffcff':(r()<0.1?PAL.mag:`rgba(0,229,255,${0.6*(1-j/len)})`);
       c.fillText(ch,x,y);
     }
   }
   const s1=slam(t,B(13),0.32),s2=slam(t,B(14),0.35);
   const big=$('rainT1');
   big.style.transform=`translateX(${(1-s1.k)*-160}px) skewX(${(1-s1.k)*-14}deg)`;
   big.style.opacity=s1.op;
   big.style.textShadow=`${-bi.pulse*10}px 0 rgba(255,45,120,.5), ${bi.pulse*10}px 0 rgba(0,229,255,.5)`;
   const mid=$('rainT2');
   mid.style.transform=`translateX(${(1-s2.k)*160}px)`;
   mid.style.opacity=s2.op;
   $('rainCjk').style.opacity=smooth(B(14.5),B(16),t);
   const cnt=$('rainCnt');
   const v=easeOutCubic(seg(t,B(13),B(19)))*15728441036;
   cnt.textContent=Math.floor(v).toLocaleString('en-US');
   // per-beat keyword escalation
   const KWS=[['BOOKS','#00e5ff'],['CODE','#b8ff2e'],['ART','#ffb62e'],['EVERYTHING','#ff2d78']];
   const kw=$('rainKw');
   const ki=bi.i-15;
   if(ki>=0&&ki<4){
     const ks=slam(t,B(15+ki),0.24);
     if(kw.dataset.k!==KWS[ki][0]){kw.dataset.k=KWS[ki][0];kw.textContent=KWS[ki][0];kw.style.color=KWS[ki][1];}
     kw.style.transform=`translateY(${(1-ks.k)*40}px) scale(${ks.scale})`;
     kw.style.opacity=ks.op*(ki===3?1:1-seg(t,B(16+ki),B(16+ki)+0.3));
   }else kw.style.opacity=0;
   const log=$('rainLog');
   const src=['> ingest("arxiv.*") … ok','> parse(human.history) … ok','> embed(culture.full) … ok','> distill(code.all) … ok','> compose(tomorrow) …'];
   const li=Math.floor((t-B(13))/0.45);
   log.textContent=src.slice(Math.max(0,li-6),li+1).join('\n');
   log.style.opacity=0.9;
 });
getScene('rain').bg=t=>({cx:0.5,cy:0.4,c1:'#051018',c2:'#030810',c3:'#010206',grid:true,gridSpeed:0.7,pmode:'burst',pi:0.8});

/* ---- S3 NEURAL MESH — 1.8T (v19→25) ---- */
scene('neural',B(19),B(25),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='netCv';
   mono('left:110px;top:24%;font-size:18px;color:#55688a;letter-spacing:3px;','TOPOLOGY // DEEP-MESH-7',div);
   const big=txt('left:110px;top:30%;font-size:130px;color:#fff;','',div);big.id='netBig';
   cjk('left:110px;top:47%;font-size:44px;color:#a78bfa;','万亿参数 · 编织成网',div).id='netCjk';
   mono('left:110px;top:57%;font-size:19px;color:#7ef9c6;','PARAMETERS // SYNAPTIC MESH',div).id='netSub';
   mono('right:110px;bottom:22%;font-size:17px;color:#55688a;text-align:right;line-height:2;','FLOPS 2.4×10²¹\nLAYERS 96\nLATENCY 3.1ms',div).id='netStats';
   mono('right:110px;top:24%;font-size:20px;color:#55688a;letter-spacing:2px;text-align:right;','',div).id='netLayer';
 },
 (div,t)=>{
   const cv=$('netCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   const bi=beatInfo(t);
   const rot=t*1.1;
   const L=5,nodesPer=[8,12,12,12,6];
   const proj=[];
   for(let l=0;l<L;l++){
     const n=nodesPer[l];
     for(let j=0;j<n;j++){
       const yy=(j/(n-1)-0.5)*1.5;
       const xx=(l/(L-1)-0.5)*2.0;
       const zz=Math.sin(j*1.7+l*2.3)*0.5;
       const xr=xx*Math.cos(rot)-zz*Math.sin(rot);
       const zr=xx*Math.sin(rot)+zz*Math.cos(rot);
       const z=0.9+zr*0.45;
       const sx=W*0.58+xr/z*W*0.36, sy=H*0.5+yy/z*H*0.4;
       proj.push({l,j,sx,sy,z});
     }
   }
   c.lineWidth=1;
   for(let l=0;l<L-1;l++){
     const a0=proj.filter(p=>p.l===l),a1=proj.filter(p=>p.l===l+1);
     for(const p of a0)for(const q of a1){
       const ax=(p.sx+q.sx)/2;
       const depth=(p.z+q.z)/2;
       const wave=Math.exp(-Math.pow(((bi.i%8)/8 + bi.phase*0.125 - l/(L-1))*6,2));
       const al=(0.09+0.4*wave)*(1.4-depth);
       c.strokeStyle=`rgba(167,139,250,${clamp(al,0,0.6)})`;
       c.beginPath();c.moveTo(p.sx,p.sy);c.quadraticCurveTo(ax,(p.sy+q.sy)/2-14,q.sx,q.sy);c.stroke();
     }
   }
   for(const p of proj){
     const wave=Math.exp(-Math.pow(((bi.i%8)/8 + bi.phase*0.125 - p.l/(L-1))*6,2));
     const r=(4.6+wave*8)*(1.6-p.z*0.5);
     c.fillStyle=`rgba(0,229,255,${0.35+0.6*wave})`;
     c.beginPath();c.arc(p.sx,p.sy,r,0,6.283);c.fill();
     c.fillStyle=`rgba(255,255,255,${0.9*wave})`;
     c.beginPath();c.arc(p.sx,p.sy,r*0.35,0,6.283);c.fill();
   }
   // counter rolls up to 1.8T
   const roll=easeOutCubic(seg(t,B(19),B(23)));
   const s=slam(t,B(19),0.35);
   const big=$('netBig');
   big.textContent=(roll*1.8).toFixed(2)+'T';
   big.style.transform=`scale(${s.scale})`; big.style.transformOrigin='left center';
   big.style.opacity=s.op;
   big.style.textShadow=`${-bi.pulse*8}px 0 rgba(255,45,120,.5),${bi.pulse*8}px 0 rgba(0,229,255,.5)`;
   $('netCjk').style.opacity=smooth(B(20),B(21),t);
   $('netSub').style.opacity=smooth(B(21),B(22),t);
   $('netStats').style.opacity=smooth(B(22),B(24),t);
   $('netLayer').textContent=`LAYER ${String(Math.min(96,1+Math.floor(seg(t,B(19),B(25))*96))).padStart(2,'0')} / 96`;
 });
getScene('neural').bg=t=>({cx:0.55,cy:0.5,c1:'#0a0820',c2:'#05040f',c3:'#020108',grid:true,gridSpeed:0.4,pmode:'ambient',pi:0.7});

/* ---- S4 TRI-SLAM w/ VOICE (v25→31) ---- */
const SLAMS=[
 {v:25,en:'IT SEES',cn:'它 看 见',glyph:'eye',col:PAL.cyan},
 {v:27,en:'IT WRITES',cn:'它 书 写',glyph:'pen',col:PAL.mag},
 {v:29,en:'IT CREATES',cn:'它 创 造',glyph:'spark',col:PAL.lime},
];
scene('slams',B(25),B(31),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='slamCv';
   const w=el('div','position:absolute;inset:0;',div);w.id='slamWrap';
   const g=el('canvas','position:absolute;left:200px;top:50%;transform:translateY(-50%);width:380px;height:380px;',w);g.id='slamGlyph';g.width=380;g.height=380;
   txt('left:640px;top:38%;font-size:210px;color:#fff;','',w).id='slamEn';
   cjk('left:640px;top:60%;font-size:74px;','',w).id='slamCn';
   mono('left:640px;top:74%;font-size:20px;color:#55688a;letter-spacing:3px;','',w).id='slamSeq';
 },
 (div,t)=>{
   const w=$('slamWrap');
   const bi=beatInfo(t);
   const active=[...SLAMS].reverse().find(s=>bi.i>=s.v)||SLAMS[0];
   const t0=B(active.v),t1=B(active.v+2);
   const s=slam(t,t0,0.26);
   const r=mulberry32(Math.floor(t*60));
   const jit=bi.pulse*8;
   const en=$('slamEn'),cn=$('slamCn'),sq=$('slamSeq');
   if(en.dataset.k!==active.en){en.dataset.k=active.en;en.textContent=active.en;cn.textContent=active.cn;cn.style.color=active.col;sq.textContent=`CAPABILITY :: ${active.en.split(' ')[1]} // VOICE.ON`;}
   en.style.transform=`scale(${s.scale+bi.pulse*0.02}) translate(${(r()-0.5)*jit}px,${(r()-0.5)*jit*0.5}px)`;
   en.style.transformOrigin='left center';
   en.style.opacity=s.op;
   en.style.textShadow=`${-(s.k<1?(1-s.k)*24+bi.pulse*6:bi.pulse*6)}px 0 rgba(255,45,120,.55), ${(s.k<1?(1-s.k)*24+bi.pulse*6:bi.pulse*6)}px 0 rgba(0,229,255,.55)`;
   cn.style.opacity=smooth(t0+0.12,t0+0.4,t);
   sq.style.opacity=smooth(t0+0.2,t0+0.5,t);
   const g=$('slamGlyph').getContext('2d');g.clearRect(0,0,380,380);
   g.strokeStyle=active.col;g.lineWidth=7;g.lineCap='round';
   const gi=slam(t,t0,0.3).k;
   g.save();g.translate(190,190);g.scale(gi,gi);g.rotate((1-gi)*-0.3);
   if(active.glyph==='eye'){
     g.beginPath();g.ellipse(0,0,140,80,0,0,6.283);g.stroke();
     g.beginPath();g.arc(0,0,52,0,6.283);g.stroke();
     g.fillStyle=active.col;g.beginPath();g.arc(0,0,24,0,6.283);g.fill();
     for(let a=0;a<4;a++){g.globalAlpha=0.5;g.beginPath();g.arc(0,0,110+a*22,-0.6+a*0.4,-0.4+a*0.4);g.stroke();}
   }else if(active.glyph==='pen'){
     g.beginPath();g.moveTo(-120,110);g.lineTo(60,-120);g.lineTo(120,-60);g.lineTo(-60,110);g.closePath();g.stroke();
     g.beginPath();g.moveTo(-120,110);g.lineTo(-150,140);g.stroke();
     for(let i=0;i<4;i++){g.globalAlpha=0.4+i*0.15;g.beginPath();g.moveTo(-140,-80+i*40);g.lineTo(-40+i*18,-80+i*40);g.stroke();}
   }else{
     for(let a=0;a<8;a++){g.save();g.rotate(a*Math.PI/4);g.beginPath();g.moveTo(0,-50);g.lineTo(0,-150);g.lineWidth=5+((a%2)*4);g.stroke();g.restore();}
     g.beginPath();g.arc(0,0,44,0,6.283);g.stroke();
     g.fillStyle=active.col;g.beginPath();g.arc(0,0,18,0,6.283);g.fill();
   }
   g.restore();
   const cv=$('slamCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   c.globalAlpha=1;c.fillStyle=active.col;c.fillRect(140,H*0.28,10,H*0.44);
   // segment progress ticks under the bar
   for(let i=0;i<3;i++){c.globalAlpha=SLAMS[i].v<=bi.i?0.9:0.25;c.fillStyle=SLAMS[i].col;c.fillRect(140+ i*26,H*0.28-30,18,8);}
   c.globalAlpha=1;c.font='17px JetMonoReg';c.fillStyle='#33415e';
   c.fillText(`FR_${String(bi.i).padStart(3,'0')}`,1500,980);
 });
getScene('slams').bg=t=>({cx:0.35,cy:0.5,c1:'#0a0e1c',c2:'#05070f',c3:'#020307',grid:true,gridSpeed:0.6,pmode:'ambient',pi:0.6});

/* ---- S5 QUESTION — the vacuum (v31→38) ---- */
scene('question',B(31),B(38),
 div=>{
   el('div','position:absolute;inset:0;',div).id='qInner';
   const w=$('qInner');
   cjk('left:50%;top:40%;font-family:NotoSerifBlack;font-size:120px;color:#eaf6ff;','',w).id='qCjk';
   mono('left:50%;top:58%;font-size:26px;color:#55688a;letter-spacing:8px;','WILL IT REPLACE US ?',w).id='qEn';
   const bar=el('div','position:absolute;left:50%;top:72%;width:760px;transform:translateX(-50%);',w);
   mono('font-size:17px;color:#3b4a63;letter-spacing:2px;','AUTOMATION INDEX',bar);
   el('div','height:8px;background:#0c1322;margin-top:10px;border:1px solid #16233a;',bar).innerHTML='<div id="qFill" style="height:100%;width:0%;background:linear-gradient(90deg,#00e5ff,#ff2d78);box-shadow:0 0 18px rgba(255,45,120,.5)"></div>';
   mono('font-size:15px;color:#3b4a63;margin-top:8px;','',bar).id='qPct';
   mono('left:50%;top:30%;font-size:17px;color:#33415e;letter-spacing:3px;','/// SEQUENCE 05 — THE QUESTION',w).id='qSeq';
 },
 (div,t)=>{
   const w=$('qInner');
   const k=smooth(B(31),B(31)+0.8,t);
   const bi=beatInfo(t);
   const q=$('qCjk');
   const full='它会取代我们吗？';
   const n=Math.min(full.length,Math.floor(seg(t,B(31)+0.4,B(34.5))*full.length));
   q.textContent=full.slice(0,n)+(n<full.length?'▏':'');
   q.style.transform=`translate(-50%,-50%) scale(${0.94+0.06*k})`;
   q.style.opacity=k;
   $('qEn').style.opacity=smooth(B(35),B(37),t);
   $('qSeq').style.opacity=smooth(B(31.5),B(33),t);
   const pct=easeInOut(seg(t,B(33),B(37.8)))*47;
   const f=$('qFill');if(f)f.style.width=pct+'%';
   const p=$('qPct');if(p)p.textContent=`${pct.toFixed(1)}% ${pct>40?'▲ RISING':'computing…'}`;
   w.style.filter=`saturate(${0.55+bi.pulse*0.3}) brightness(${0.8+0.2*k})`;
 });
getScene('question').bg=t=>({cx:0.5,cy:0.45,c1:'#05070d',c2:'#03040a',c3:'#010203',grid:true,gridSpeed:0.1,pmode:'sparse',pi:0.35});

/* ---- S6 AMPLIFY (v38→44) ---- */
scene('amplify',B(38),B(44),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='ampWrap';
   const cL=el('div','position:absolute;left:50%;top:50%;width:520px;height:520px;border-radius:50%;border:2px solid #00e5ff;background:rgba(0,229,255,.06);mix-blend-mode:screen;box-shadow:0 0 90px rgba(0,229,255,.25) inset, 0 0 60px rgba(0,229,255,.15);',w);cL.id='ampL';
   const cR=el('div','position:absolute;left:50%;top:50%;width:520px;height:520px;border-radius:50%;border:2px solid #ff2d78;background:rgba(255,45,120,.06);mix-blend-mode:screen;box-shadow:0 0 90px rgba(255,45,120,.25) inset, 0 0 60px rgba(255,45,120,.15);',w);cR.id='ampR';
   mono('left:33%;top:24%;font-size:26px;color:#00e5ff;letter-spacing:6px;','HUMAN',w).id='ampLt';
   mono('right:33%;top:24%;font-size:26px;color:#ff2d78;letter-spacing:6px;','MACHINE',w).id='ampRt';
   txt('left:50%;top:50%;font-size:150px;color:#fff;','AMPLIFY',w).id='ampBig';
   cjk('left:50%;top:66%;font-size:52px;color:#fff;','放 大 我 们',w).id='ampCjk';
   mono('left:50%;top:78%;font-size:18px;color:#55688a;letter-spacing:4px;','NOT REPLACE — HUMAN × MACHINE',w).id='ampSeq';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const k=easeInOut(seg(t,B(38),B(41)));
   const d=lerp(560,120,k);
   $('ampL').style.transform=`translate(calc(-50% - ${d}px),-50%)`;
   $('ampR').style.transform=`translate(calc(-50% + ${d}px),-50%)`;
   const s=slam(t,B(41),0.35);
   const big=$('ampBig');
   big.style.transform=`translate(-50%,-50%) scale(${s.scale+bi.pulse*0.03})`;
   big.style.opacity=s.op;
   big.style.textShadow=`${-bi.pulse*9}px 0 rgba(0,229,255,.5), ${bi.pulse*9}px 0 rgba(255,45,120,.5)`;
   $('ampCjk').style.opacity=smooth(B(41.5),B(42.5),t);
   $('ampSeq').style.opacity=smooth(B(42),B(43.5),t);
   $('ampLt').style.opacity=smooth(B(38),B(39),t);
   $('ampRt').style.opacity=smooth(B(38),B(39),t);
 });
getScene('amplify').bg=t=>({cx:0.5,cy:0.5,c1:'#070b16',c2:'#04060d',c3:'#010204',grid:true,gridSpeed:0.25,pmode:'ambient',pi:0.5});

/* ---- S7 BUILD + COUNTDOWN (v44→56) ---- */
scene('build',B(44),B(56),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='buildWrap';
   mono('left:50%;top:26%;font-size:19px;color:#55688a;letter-spacing:5px;','/// SEQUENCE 07 — IGNITION SEQUENCE',w);
   el('div','position:absolute;left:60px;bottom:120px;width:14px;background:#0c1322;border:1px solid #16233a;',w).id='barL';
   el('div','position:absolute;right:60px;bottom:120px;width:14px;background:#0c1322;border:1px solid #16233a;',w).id='barR';
   const rows=el('div','position:absolute;left:50%;top:38%;transform:translate(-50%,0);width:1100px;',w);rows.id='buildRows';
   [['MODELS DEPLOYED','b1',3071991],['IMAGES / SEC','b2',48211],['PAPERS / DAY','b3',412],['CITIES ONLINE','b4',3119]].forEach(([label,id],i)=>{
     const row=el('div','display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #101a2e;padding:14px 4px;',rows);
     mono('position:relative;font-size:20px;color:#3b4a63;letter-spacing:2px;',label,row);
     mono('position:relative;font-family:JetMono;font-size:44px;color:#eaf6ff;','',row).id=id;
   });
   txt('left:50%;top:62%;font-size:340px;color:#fff;','',w).id='countNum';
   mono('left:50%;top:88%;font-size:22px;color:#ff2d78;letter-spacing:8px;','SYSTEM GO',w).id='goTag';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const prog=seg(t,B(44),B(52));
   const acc=Math.pow(prog,1.7);
   const rr=mulberry32(Math.floor(t*30));
   const w=$('buildWrap');
   w.style.transform=`translate(${(rr()-0.5)*acc*18}px,${(rr()-0.5)*acc*10}px)`;
   w.style.filter=`brightness(${1+acc*0.5+bi.pulse*0.4})`;
   const rows=$('buildRows');
   rows.style.opacity=clamp(1-seg(t,B(50),B(52)),0,1);
   const bh=Math.floor(acc*560);
   for(const id of ['barL','barR']){const b=$(id);b.style.height=bh+'px';b.innerHTML=`<div style="position:absolute;left:0;right:0;top:0;height:${bh}px;background:linear-gradient(0deg,#00e5ff,#ff2d78);box-shadow:0 0 16px rgba(0,229,255,.5)"></div>`;}
   $('b1').textContent=Math.floor(acc*3071991).toLocaleString();
   $('b2').textContent=Math.floor(acc*48211).toLocaleString();
   $('b3').textContent=Math.floor(acc*412).toLocaleString();
   $('b4').textContent=Math.floor(acc*3119).toLocaleString();
   const cn=$('countNum'),gt=$('goTag');
   if(t>=B(52)){
     const labels={52:'3',53:'2',54:'1',55:'→'};
     cn.textContent=labels[bi.i]||'';
     const s=slam(t,B(bi.i),0.22);
     cn.style.transform=`translate(-50%,-50%) scale(${s.scale})`;
     cn.style.opacity=s.op;
     cn.style.color=bi.i===55?PAL.lime:'#fff';
     gt.style.opacity=1;gt.style.color=bi.i===55?PAL.lime:'#ff2d78';
   }else{cn.textContent='';gt.style.opacity=0;}
 });
getScene('build').bg=t=>({cx:0.5,cy:0.55,c1:'#0a0c18',c2:'#05060f',c3:'#010204',grid:true,gridSpeed:1.4,pmode:'warp',pi:1});

/* ---- S7b BLACKOUT (v56→58) ---- */
scene('blackout',B(56),B(58),
 div=>{el('div','position:absolute;left:50%;top:50%;width:0;height:2px;background:#fff;',div).id='blkLine';},
 (div,t)=>{
   const k=seg(t,B(56),B(58));
   const l=$('blkLine');
   l.style.width=`${(1-easeInOut(k))*W*0.4+4}px`;
   l.style.transform='translateX(-50%)';
   l.style.boxShadow='0 0 40px rgba(0,229,255,.8)';
   l.style.background='#00e5ff';
   l.style.opacity=1-k*0.6;
 });
getScene('blackout').bg=t=>({cx:0.5,cy:0.5,c1:'#000',c2:'#000',c3:'#000',grid:false,pmode:'sparse',pi:0});

/* ---- S8 MONTAGE — escalation (v58→74, 16 cards, 1 per beat) ---- */
const CARDS=[
 ['HEALS','治 愈',PAL.cyan,'✚'],
 ['TEACHES','教 导',PAL.cyan,'✎'],
 ['FEEDS','喂 养',PAL.cyan,'◈'],
 ['DRIVES','驾 驶',PAL.cyan,'▶'],
 ['WRITES','书 写',PAL.lime,'✎'],
 ['PAINTS','作 画',PAL.lime,'◐'],
 ['COMPOSES','作 曲',PAL.lime,'♪'],
 ['TRADES','交 易',PAL.amber,'$'],
 ['WATCHES','注 视',PAL.mag,'◉'],
 ['PROFILES','画 像',PAL.mag,'◎'],
 ['PREDICTS','预 测',PAL.mag,'≋'],
 ['JUDGES','评 判',PAL.mag,'⚖'],
 ['DECIDES','决 定',PAL.mag,'▲'],
 ['EVERYWHERE','无 处 不 在',PAL.wht,'✳'],
 ['EVERYONE','所 有 人',PAL.wht,'●'],
 ['YOU ?','你 ?','#ff3355','?'],
];
scene('montage',B(58),B(74),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='mWrap';
   el('div','position:absolute;left:0;right:0;top:0;bottom:0;',w).id='mStrobe';
   txt('left:50%;top:42%;font-size:300px;color:#fff;','',w).id='mEn';
   cjk('left:50%;top:64%;font-size:100px;color:#fff;','',w).id='mCn';
   mono('left:50%;top:82%;font-size:22px;color:#fff;letter-spacing:6px;','',w).id='mTag';
   txt('left:50%;top:38%;font-size:340px;','',w).id='mGlyph';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const w=$('mWrap'),st=$('mStrobe');
   const rel=clamp(bi.i-58,0,15);
   const rr=mulberry32(Math.floor(t*90));
   const inv=rel%2===1;
   st.style.background=inv?'#eaf6ff':'transparent';
   const card=CARDS[rel];
   const showGlyph=rel%2===1;
   const en=$('mEn'),cn=$('mCn'),gl=$('mGlyph'),tag=$('mTag');
   const s=slam(t,B(bi.i),0.2);
   if(en.dataset.k!==card[0]+showGlyph){
     en.dataset.k=card[0]+showGlyph;
     en.textContent=card[0];
     en.style.fontSize=card[0].length>7?'230px':'300px';
     cn.textContent=card[1];
     gl.textContent=showGlyph?card[3]:'';
     tag.textContent=`AI × ${card[0]} :: ${String(rel+1).padStart(2,'0')}/16`;
   }
   const jit=bi.pulse*16;
   const jx=(rr()-0.5)*jit,jy=(rr()-0.5)*jit*0.6;
   en.style.transform=`translate(-50%,-50%) scale(${s.scale+bi.pulse*0.04}) rotate(${(rr()-0.5)*jit*0.4}deg) translate(${jx}px,${jy}px)`;
   en.style.opacity=showGlyph?0.10:s.op;
   en.style.color=inv?'#000':card[2];
   en.style.textShadow=inv?`${-jx*0.5}px 0 rgba(255,45,120,.7), ${jx*0.5}px 0 rgba(0,229,255,.7)`:`${-jit*0.8}px 0 rgba(255,45,120,.6), ${jit*0.8}px 0 rgba(0,229,255,.6)`;
   gl.style.transform=`translate(-50%,-50%) scale(${s.scale}) rotate(${s.k<1?(1-s.k)*30:0}deg)`;
   st.style.boxShadow=inv?'none':`inset 0 0 0 4px ${card[2]}`;
   gl.style.opacity=showGlyph?s.op:0;
   gl.style.color=inv?'#000':card[2];
   cn.style.transform=`translate(-50%,-50%) scale(${0.9+0.1*s.k})`;
   cn.style.opacity=s.op;
   cn.style.color=inv?'#000':'#fff';
   tag.style.opacity=0.8;tag.style.color=inv?'#000':'#55688a';
   w.style.filter=`contrast(1.15) brightness(${1+bi.pulse*0.55})`;
   w.style.transform=`scale(${1+bi.pulse*0.015})`;
 });
getScene('montage').bg=t=>({cx:0.5,cy:0.5,c1:'#0e0f1e',c2:'#070812',c3:'#030308',grid:true,gridSpeed:1.8,pmode:'burst',pi:1});

/* ---- S9 STATEMENT (v74→78) ---- */
scene('statement',B(74),B(78),
 div=>{
   const w=el('div','position:absolute;inset:0;background:#eaf6ff;',div);w.id='stmtBg';
   mono('left:50%;top:30%;font-size:34px;color:#0a0e18;letter-spacing:4px;','NOT HUMAN. NOT MACHINE.',w).id='stEn';
   cjk('left:50%;top:46%;font-family:NotoSerifBlack;font-size:190px;color:#04060c;','人机共生',w).id='stCjk';
   mono('left:50%;top:72%;font-size:20px;color:#33415e;letter-spacing:6px;','BOTH. — SYMBIOSIS // 共生',w).id='stSub';
   el('div','position:absolute;left:50%;top:82%;width:1px;height:60px;background:#04060c;',w).id='stRule';
 },
 (div,t)=>{
   const w=$('stmtBg');
   const bi=beatInfo(t);
   const s=slam(t,B(74),0.35);
   const cj=$('stCjk');
   cj.style.transform=`translate(-50%,-50%) scale(${s.scale})`;
   cj.style.opacity=s.op;
   $('stEn').style.opacity=smooth(B(74)+0.15,B(75.5),t);
   $('stSub').style.opacity=smooth(B(76),B(77.5),t);
   $('stRule').style.opacity=smooth(B(76.5),B(77.8),t);
   w.style.transform=`scale(${1+seg(t,B(74),B(78))*0.03})`;
   w.style.filter=`brightness(${1+bi.pulse*0.12})`;
 });
getScene('statement').bg=t=>({cx:0.5,cy:0.5,c1:'#eaf6ff',c2:'#dfeaf5',c3:'#c8d6e6',grid:false,pmode:'sparse',pi:0.15});

/* ---- S10 END CARD (v78→86) ---- */
scene('end',B(78),B(86)+0.5,
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='endWrap';
   const mark=el('div','position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);width:170px;height:170px;border:2px solid #00e5ff;border-radius:32px;box-shadow:0 0 60px rgba(0,229,255,.3), inset 0 0 40px rgba(0,229,255,.12);display:flex;align-items:center;justify-content:center;font-family:JetMono;font-size:44px;color:#00e5ff;',w);mark.id='endMark';
   mark.innerHTML='<span>AI://</span>';
   txt('left:50%;top:56%;font-family:ArchivoBlack;font-size:56px;color:#fff;letter-spacing:.14em;','INTELLIGENCE IS THE NEW ELECTRICITY',w).id='endEn';
   cjk('left:50%;top:66%;font-size:34px;color:#a78bfa;letter-spacing:.5em;','智 能 即 电 力',w).id='endCjk';
   mono('left:50%;top:78%;font-size:16px;color:#33415e;letter-spacing:3px;','129 BPM · FRAME-LOCKED SYNC · GENERATED BY CODE',w).id='endTag';
   el('div','position:absolute;left:50%;top:52%;width:340px;height:1px;background:linear-gradient(90deg,transparent,#00e5ff,transparent);',w).id='endRule';
 },
 (div,t)=>{
   const k=smooth(B(78),B(79.5),t);
   const w=$('endWrap');
   w.style.opacity=k*(1-seg(t,B(84.2),B(86)+0.3));
   const m=$('endMark');
   const bi=beatInfo(t);
   m.style.transform=`translate(-50%,-50%) rotate(${45+seg(t,B(78),B(82))*135}deg) scale(${0.6+0.4*easeOutBack(k)})`;
   m.style.opacity=k;
   m.querySelector('span').style.transform=`rotate(${-(45+seg(t,B(78),B(82))*135)}deg)`;
   $('endEn').style.opacity=smooth(B(79),B(80.5),t);
   $('endEn').style.transform=`translate(-50%,-50%) scale(${0.96+0.04*smooth(B(79),B(82),t)})`;
   $('endCjk').style.opacity=smooth(B(81),B(82.5),t);
   $('endTag').style.opacity=smooth(B(82),B(84),t);
   $('endRule').style.opacity=k;
   w.style.filter=`brightness(${1+bi.pulse*0.15})`;
 });
getScene('end').bg=t=>({cx:0.5,cy:0.5,c1:'#05070d',c2:'#030409',c3:'#010203',grid:true,gridSpeed:0.12,pmode:'sparse',pi:0.3});
/* ============================================================
   HUD (always on)
   ============================================================ */
const CAPTIONS=[
 [0,'LOG://AWAKENING'],[B(8),'SEQ.01 IGNITION'],[B(13),'SEQ.02 IT LEARNED'],
 [B(19),'SEQ.03 DEEP MESH'],[B(25),'SEQ.04 CAPABILITIES'],[B(31),'SEQ.05 THE QUESTION'],
 [B(38),'SEQ.06 AMPLIFY'],[B(44),'SEQ.07 COUNTDOWN'],[B(58),'SEQ.08 AI × WORLD'],
 [B(74),'SEQ.09 人机共生'],[B(78),'SEQ.10 NEW ELECTRICITY'],
];
function drawHUD(t,frame,bi,activeId){
  const cap=CAPTIONS.filter(c=>t>=c[0]).pop();
  const blink=bi.pulse>0.5?'#00e5ff':'#33415e';
  let eq='';
  for(let i=0;i<16;i++){
    const r=mulberry32(i*7+ (bi.i<0?0:bi.i));
    const h=4+r()*(10+bi.pulse*46*(0.5+r()*0.7))*(bi.i<0?0.2:1);
    eq+=`<div style="display:inline-block;width:9px;height:${h}px;background:${i%4===0?'#00e5ff':'#22304d'};margin-right:5px;vertical-align:bottom;box-shadow:${i%4===0?'0 0 8px rgba(0,229,255,.6)':'none'}"></div>`;
  }
  hud.innerHTML=`
  <div style="position:absolute;left:44px;top:20px;font-size:15px;color:#55688a;letter-spacing:2px;">AI://MIND_SYNC <span style="color:${blink}">●</span></div>
  <div style="position:absolute;right:44px;top:20px;font-size:15px;color:#55688a;letter-spacing:2px;text-align:right;">129.2 BPM · SYNC LOCK<br><span style="color:#33415e">F${String(frame).padStart(5,'0')}</span></div>
  <div style="position:absolute;left:44px;bottom:66px;height:52px;display:flex;align-items:flex-end;">${eq}</div>
  <div style="position:absolute;right:44px;bottom:70px;font-size:15px;color:#55688a;letter-spacing:2px;text-align:right;">${cap?cap[1]:''}<br><span style="color:#33415e">T+${t.toFixed(2)}s</span></div>
  <div style="position:absolute;left:44px;bottom:20px;right:44px;height:1px;background:#16233a;"><div style="height:100%;width:${(t/39.95*100).toFixed(2)}%;background:linear-gradient(90deg,#00e5ff,#ff2d78)"></div></div>`;
}

/* ============================================================
   TRANSITIONS + MASTER RENDER
   ============================================================ */
const TRANS=0.16;
const flashes=new Set([8,13,19,25,31,38,44,58,74,78].map(k=>Math.ceil(B(k)*FPS)));
// stronger white flash on the two drops + statement
const bigFlashFrames=new Set([8,58,74].map(k=>Math.ceil(B(k)*FPS)));

let curScene=null,prevScene=null;
function renderScene(sc,t,host){
  if(!sc.built||sc.el!==host){host.innerHTML='';sc.build(host);sc.el=host;sc.built=true;}
  sc.draw(host,t);
}
window.renderAt=function(t){
  const frame=Math.round(t*FPS);
  const bi=beatInfo(t);
  // pick active scene; prevScene = previous scene in timeline (not last-rendered)
  const sidx=scenes.findIndex(s=>t>=s.s&&t<s.e);
  const sc=sidx<0?scenes[scenes.length-1]:scenes[sidx];
  prevScene=sidx>0?scenes[sidx-1]:null;
  curScene=sc;
  // background
  const cfg=sc.bg?sc.bg(t):{cx:.5,cy:.5,c1:'#060a14',c2:'#04060c',c3:'#010204',grid:true,pmode:'ambient',pi:0.5};
  drawBG(t,cfg);
  drawRings(t,bi);
  drawParticles(t,cfg.pmode||'ambient',cfg.pi==null?0.6:cfg.pi,bi.pulse);
  // fx: sweep line
  fx.clearRect(0,0,W,H);
  const sy=((t*140)%(H+200))-100;
  const sg=fx.createLinearGradient(0,sy-60,0,sy+60);
  sg.addColorStop(0,'rgba(0,229,255,0)');sg.addColorStop(0.5,`rgba(0,229,255,${0.05+bi.pulse*0.04})`);sg.addColorStop(1,'rgba(0,229,255,0)');
  fx.fillStyle=sg;fx.fillRect(0,sy-60,W,120);
  // scenes
  const sinceStart=t-sc.s;
  const inTrans=sinceStart<TRANS&&prevScene&&prevScene!==sc;
  // camera pulse
  const camSc=1+bi.pulse*0.008;
  if(inTrans){
    renderScene(prevScene,t,stageB);
    stageB.style.opacity=1-sinceStart/TRANS;
    const rr=mulberry32(frame);
    stageB.style.transform=`translate(${(rr()-0.5)*14}px,${(rr()-0.5)*8}px) scale(${camSc})`;
    stageB.style.filter=`hue-rotate(${(rr()-0.5)*90}deg) brightness(1.4)`;
  }else{
    stageB.style.opacity=0;
  }
  renderScene(sc,t,stageA);
  if(inTrans){
    const rr=mulberry32(frame+7);
    stageA.style.transform=`translate(${(rr()-0.5)*10}px,0) scale(${camSc+0.01})`;
    stageA.style.clipPath=`inset(0 0 ${(1-sinceStart/TRANS)*60}% 0)`;
    stageA.style.filter=`contrast(1.2)`;
  }else{
    stageA.style.transform=`scale(${camSc})`;
    stageA.style.clipPath='none';
    stageA.style.filter='none';
  }
  // flash on accented scene-start beats
  let fo=0;
  if(bigFlashFrames.has(frame)||flashes.has(frame))fo=bigFlashFrames.has(frame)?0.9:0.55;
  else{
    // decay over ~3 frames
    for(const f of bigFlashFrames){if(frame>f&&frame-f<4)fo=Math.max(fo,0.9*(1-(frame-f)/4));}
    for(const f of flashes){if(frame>f&&frame-f<3)fo=Math.max(fo,0.55*(1-(frame-f)/3));}
  }
  flashEl.style.opacity=fo;
  // grain + hud
  drawGrain(frame);
  drawHUD(t,frame,bi,sc.id);
  return sc.id;
};
```

### 5/14 · `main_v2.js`
<!-- casebook-file {"path": "main_v2.js", "lines": 759, "final_newline": true, "sha256": "0e6dcae8e99da27d150c35e6694231712417e972cf55c5d2f26a9176cb0c4923", "original_sha256": "0e6dcae8e99da27d150c35e6694231712417e972cf55c5d2f26a9176cb0c4923"} -->
```js
/* ============================================================
   AI://MIND_SYNC — deterministic beat-synced motion graphics
   renderAt(t) renders the exact frame for time t (seconds)
   ============================================================ */
const W=1920,H=1080,FPS=30;
const $=id=>document.getElementById(id);
const stageA=$('stageA'),stageB=$('stageB'),fxc=$('fx'),bgc=$('bg'),grainC=$('grain'),hud=$('hud'),flashEl=$('flash');
const bx=bgc.getContext('2d'),fx=fxc.getContext('2d'),gx=grainC.getContext('2d');

/* ---------- math helpers ---------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const easeOutExpo=k=>k>=1?1:1-Math.pow(2,-10*k);
const easeOutBack=k=>{const c=1.70158;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
const easeOutCubic=k=>1-Math.pow(1-k,3);
const easeInCubic=k=>k*k*k;
const easeInOut=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const smooth=(a,b,t)=>{const k=clamp((t-a)/(b-a),0,1);return k*k*(3-2*k);};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function B(k){return k*TL.interval;}
const BAR=4*TL.interval;

/* beat state at time t */
function beatInfo(t){
  const i=Math.floor(t/TL.interval);
  if(i<0)return{i:-1,phase:0,pulse:0,accent:false,e:0};
  const phase=(t-B(i))/TL.interval;
  const pulse=Math.exp(-phase*4.2);
  const si=clamp(i<36?i-8:i+76,0,TL.energy.length-1);
  const e=TL.energy[si]||0;
  return{i,phase,pulse,accent:i%4===0,e};
}
const PAL={cyan:'#00e5ff',mag:'#ff2d78',vio:'#a78bfa',lime:'#b8ff2e',amber:'#ffb62e',wht:'#eaf6ff',dim:'#33415e',ink:'#04060c'};

/* ---------- persistent particle field ---------- */
const NP=560;
const parts=[];
{const r=mulberry32(7);
 for(let i=0;i<NP;i++)parts.push({x:r()*2-1,y:r()*2-1,z:r(),s:.4+r()*1.6,tw:r()*6.28,hue:r()});
}
function drawParticles(t,mode,intensity,pulse){
  const f=1.6;
  const warp=mode==='warp';
  const n=Math.floor(NP*(mode==='sparse'?0.25:1));
  for(let i=0;i<n;i++){
    const p=parts[i];
    let z=(p.z + (warp? t*2.2 : t*0.05) + i*0.001)%1;
    let zz=0.06+z*1.4;
    let sx=W/2 + (p.x/zz)*W*0.62*f;
    let sy=H/2 + (p.y/zz)*H*0.62*f;
    if(sx<-40||sx>W+40||sy<-40||sy>H+40)continue;
    const sz=p.s*(1.5-z)*(1+pulse*1.4)*intensity;
    const tw=.5+.5*Math.sin(p.tw+t*3);
    const a=clamp((1.2-z),0,1)*(0.25+0.75*tw)*intensity;
    bx.globalAlpha=clamp(a,0,1);
    if(p.hue<0.55)bx.fillStyle=PAL.cyan;else if(p.hue<0.8)bx.fillStyle=PAL.vio;else bx.fillStyle=PAL.wht;
    if(warp){
      const px=W/2+(p.x/(zz+0.03))*W*0.62*f, py=H/2+(p.y/(zz+0.03))*H*0.62*f;
      bx.strokeStyle=bx.fillStyle;bx.lineWidth=sz*0.9;
      bx.beginPath();bx.moveTo(px,py);bx.lineTo(sx,sy);bx.stroke();
    }else if(mode==='burst'){
      // radial kick outward on each beat pulse
      const dx=sx-W/2,dy=sy-H/2,dl=Math.sqrt(dx*dx+dy*dy)||1;
      const kick=pulse*46;
      bx.fillRect(sx+dx/dl*kick,sy+dy/dl*kick,sz*1.4,sz*1.4);
    }else{
      bx.fillRect(sx,sy,sz,sz);
    }
  }
  bx.globalAlpha=1;
}

/* ---------- background: gradient + perspective grid ---------- */
function drawBG(t,cfg){
  const {cx,cy,c1,c2,c3,grid=true,gridSpeed=0.35,ring=0}=cfg;
  let g=bx.createRadialGradient(W*cx,H*cy,60,W*cx,H*cy,W*0.75);
  g.addColorStop(0,c1);g.addColorStop(0.45,c2);g.addColorStop(1,c3);
  bx.fillStyle=g;bx.fillRect(0,0,W,H);
  if(!grid)return;
  // floor grid, horizon at 62%
  const hz=H*0.62;
  bx.save();
  bx.strokeStyle='rgba(0,229,255,0.10)';bx.lineWidth=1;
  const sp=(t*gridSpeed)%1;
  for(let i=0;i<14;i++){
    const k=(i+sp)/14;
    const y=hz+Math.pow(k,2.4)*(H-hz);
    bx.globalAlpha=0.10+0.35*k;
    bx.beginPath();bx.moveTo(0,y);bx.lineTo(W,y);bx.stroke();
  }
  bx.globalAlpha=0.14;
  for(let i=-14;i<=14;i++){
    bx.beginPath();
    bx.moveTo(W/2+i*70,hz);
    bx.lineTo(W/2+i*W*0.22,H);
    bx.stroke();
  }
  bx.globalAlpha=1;bx.restore();
}
/* shockwave rings on accent beats */
function drawRings(t,bi){
  if(bi.i<0)return;
  for(let k=0;k<3;k++){
    const bt=B(bi.i-k*4);
    const dt=t-bt;
    if(dt<0||dt>1.6)continue;
    const r=easeOutCubic(dt/1.6)*W*0.42;
    const a=(1-dt/1.6)*0.16;
    bx.strokeStyle=`rgba(0,229,255,${a})`;
    bx.lineWidth=3-dt;
    bx.beginPath();bx.arc(W/2,H/2,r,0,6.283);bx.stroke();
  }
}

/* ---------- grain ---------- */
const noiseTile=document.createElement('canvas');noiseTile.width=160;noiseTile.height=160;
{const nx=noiseTile.getContext('2d'),id=nx.createImageData(160,160),r=mulberry32(99);
 for(let i=0;i<id.data.length;i+=4){const v=r()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=26;}
 nx.putImageData(id,0,0);}
function drawGrain(frame){
  gx.clearRect(0,0,960,540);
  const r=mulberry32(frame);
  const ox=r()*160,oy=r()*160;
  gx.globalAlpha=0.9;
  for(let x=-160;x<960+160;x+=160)for(let y=-160;y<540+160;y+=160)
    gx.drawImage(noiseTile,x-ox,y-oy);
  gx.globalAlpha=1;
}

/* ---------- DOM helpers ---------- */
function el(tag,css,parent,html){const d=document.createElement(tag);d.style.cssText=css;if(html!=null)d.innerHTML=html;(parent||stageA).appendChild(d);return d;}
function txt(css,html,parent){return el('div',`position:absolute;font-family:Anton;white-space:nowrap;`+css,parent,html);}
function mono(css,html,parent){return el('div',`position:absolute;font-family:JetMonoReg;white-space:pre;`+css,parent,html);}
function cjk(css,html,parent){return el('div',`position:absolute;font-family:NotoBlack;white-space:nowrap;`+css,parent,html);}

/* chromatic split via stacked copies */
function chromaText(css,html,parent,dx){
  const wrap=el('div','position:absolute;'+css,parent);
  const mk=(col,x)=>{const t=el('div',`position:absolute;left:${x}px;top:0;color:${col};mix-blend-mode:screen;`,wrap,html);return t;};
  mk('rgba(255,45,120,.85)',-dx);mk('rgba(0,229,255,.85)',dx);
  const main=el('div','position:relative;color:#fff;',wrap,html);
  return{wrap,main};
}
/* text-slam timing */
function slam(t,t0,dur=0.34){
  const k=clamp((t-t0)/dur,0,1);
  return{scale:1+2.6*(1-easeOutExpo(k)),op:k<0.05?k/0.05:1,blur:(1-k)*22,k};
}

/* ============================================================
/* ============================================================
   SCENES — v2 hypercut, 86 beats ≈ 39.94s
   beat k => time B(k) = k*0.464399
   ============================================================ */
const scenes=[];
function scene(id,s,e,build,draw){scenes.push({id,s,e,build,draw,built:false,el:null});}
function getScene(id){return scenes.find(s=>s.id===id);}

/* ---- S0 BOOT (v0→8) ---- */
const BOOT_LINES=[
 ['$ neural_core --init --mode=sentient',0.25],
 ['[OK] corpus indexed :: 15.7T tokens',0.9],
 ['[OK] synaptic mesh :: 1.8T params',1.55],
 ['[!!] consciousness threshold :: 99.7%',2.2],
];
scene('boot',0,B(8),
 div=>{
   el('div','position:absolute;left:0;right:0;top:0;bottom:0;',div).id='bootwrap';
   const w=$('bootwrap');
   const term=el('div','position:absolute;left:50%;top:47%;width:1240px;transform:translate(-50%,-50%);background:rgba(5,12,20,.93);border:1px solid rgba(0,229,255,.5);border-radius:10px;box-shadow:0 0 110px rgba(0,229,255,.22), inset 0 0 80px rgba(0,0,0,.55);padding:38px 46px;',w);
   el('div','height:14px;margin-bottom:22px;',term).innerHTML='<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ff5f56;margin-right:8px"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ffbd2e;margin-right:8px"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#27c93f"></span><span style="font-family:JetMonoReg;font-size:15px;color:#3b4a63;margin-left:20px">neural_core — zsh — 140×36</span>';
   el('div','font-family:JetMonoReg;font-size:30px;line-height:1.9;color:#8fffd0;min-height:280px;text-shadow:0 0 8px rgba(126,249,198,.4);white-space:pre;',term).id='termlines';
   mono('left:70px;bottom:76px;font-size:19px;color:#55688a;letter-spacing:2px;','',w).id='bootcap';
   mono('right:70px;top:70px;font-size:16px;color:#33415e;text-align:right;','SESSION 0924\nLOG://AWAKENING',w);
 },
 (div,t)=>{
   const tl=$('termlines');
   let html='';
   for(const[line,t0]of BOOT_LINES){
     if(t<t0)break;
     const chars=Math.floor((t-t0)*60);
     const s=line.slice(0,chars);
     html+=s.replace(/\[OK\]/g,'<span style="color:#00e5ff">[OK]</span>').replace(/\[!!\]/g,'<span style="color:#ff2d78">[!!]</span>').replace(/\$/g,'<span style="color:#a78bfa">$</span>');
     if(chars<line.length)html+='<span style="background:#7ef9c6;color:#000">&nbsp;</span>';
     html+='\n';
   }
   if(t>BOOT_LINES[BOOT_LINES.length-1][1]&&Math.floor(t*3)%2===0)html+='<span style="background:#7ef9c6;color:#000">&nbsp;</span>';
   tl.innerHTML=html;
   $('bootcap').textContent = t<1.4 ? '2026 // 觉醒前夜' : t<2.6 ? 'SIGNAL INCOMING …' : '> transmit';
   const w=$('bootwrap');
   const col=smooth(3.0,3.65,t);
   if(col>0){
     const sc=1-0.4*easeInCubic(col), jit=col*col*9;
     const r=mulberry32(Math.floor(t*90));
     w.style.transform=`scale(${sc}) translate(${(r()-0.5)*jit*8}px,${(r()-0.5)*jit*4}px)`;
     w.style.filter=`hue-rotate(${(r()-0.5)*col*160}deg) brightness(${1+col*2.2})`;
   }else{
     w.style.transform='none';w.style.filter=`brightness(${0.72+0.28*smooth(0,0.9,t)})`;
   }
 });
scenes[0].bg=t=>({cx:0.5,cy:0.55,c1:'#060a14',c2:'#04060c',c3:'#010204',grid:true,gridSpeed:0.06,pmode:'sparse',pi:0.5});

/* ---- S1 AI REVEAL (v8→13) ---- */
scene('reveal',B(8),B(13),
 div=>{
   el('div','position:absolute;inset:0;',div).id='revealInner';
   const inner=$('revealInner');
   el('div','position:absolute;left:50%;top:40%;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,255,.16) 0%,rgba(0,229,255,.05) 40%,transparent 70%);transform:translate(-50%,-50%);',inner).id='aiAura';
   const big=txt('left:50%;top:40%;font-size:560px;color:#fff;letter-spacing:-0.02em;','AI',inner);big.id='bigAI';
   const sub=txt('left:50%;top:76%;font-family:ArchivoBlack;font-size:64px;color:#fff;letter-spacing:0.5em;','ARTIFICIAL INTELLIGENCE',inner);sub.id='aiSub';
   cjk('left:50%;top:20%;font-size:46px;color:#00e5ff;letter-spacing:1.2em;','人 工 智 能',inner).id='aiCjk';
 },
 (div,t)=>{
   const s=slam(t,B(8),0.4);
   const bi=beatInfo(t);
   const big=$('bigAI');
   const shakeAmp=bi.pulse*9;
   const r=mulberry32(Math.floor(t*60));
   const jx=(r()-0.5)*shakeAmp,jy=(r()-0.5)*shakeAmp*0.6;
   // glitch hits on each beat: chroma explode + tiny rotation
   const hit=bi.pulse;
   big.style.transform=`translate(-50%,-50%) scale(${s.scale+hit*0.03}) rotate(${(1-s.k)*-4+(r()-0.5)*shakeAmp*0.24}deg) translate(${jx}px,${jy}px)`;
   big.style.opacity=s.op;
   big.style.filter=`blur(${(1-s.k)*10}px)`;
   big.style.textShadow=`${-hit*14}px 0 rgba(255,45,120,.6), ${hit*14}px 0 rgba(0,229,255,.6), 0 0 90px rgba(0,229,255,.35)`;
   $('aiAura').style.transform=`translate(-50%,-50%) scale(${0.7+hit*0.35})`;
   $('aiAura').style.opacity=0.4+hit*0.6;
   $('aiSub').style.opacity=smooth(B(8.5),B(10),t);
   $('aiSub').style.letterSpacing=`${0.5-easeOutCubic(seg(t,B(8.5),B(10)))*0.32}em`;
   $('aiCjk').style.opacity=smooth(B(9),B(10.5),t);
 });
getScene('reveal').bg=t=>({cx:0.5,cy:0.5,c1:'#0a1430',c2:'#060a18',c3:'#02030a',grid:true,gridSpeed:0.5,pmode:'burst',pi:1});

/* ---- S2 CODE RAIN — IT LEARNED (v13→19) ---- */
scene('rain',B(13),B(19),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='rainCv';
   const big=txt('left:110px;top:36%;font-size:200px;color:#fff;','IT LEARNED',div);big.id='rainT1';
   const mid=el('div','position:absolute;left:110px;top:57%;font-family:SpaceGrotesk;font-weight:700;font-size:54px;color:#fff;letter-spacing:.06em;',div,'FROM EVERYTHING WE EVER MADE');mid.id='rainT2';
   cjk('left:110px;top:67%;font-size:40px;color:#00e5ff;','它消化了人类写下的一切',div).id='rainCjk';
   mono('right:110px;top:34%;font-size:32px;color:#b8ff2e;text-align:right;','',div).id='rainCnt';
   mono('right:110px;top:40%;font-size:18px;color:#55688a;text-align:right;','TOKENS · INGESTED',div);
   txt('right:110px;top:52%;font-size:96px;color:#ff2d78;','',div).id='rainKw';
   mono('right:110px;bottom:14%;font-size:15px;color:#3b4a63;text-align:right;line-height:1.9;width:520px;white-space:pre-wrap;','',div).id='rainLog';
 },
 (div,t)=>{
   const cv=$('rainCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   const bi=beatInfo(t);
   const cols=44,pool='アイウエオカキクケコサシスセソ01{}<>[];=+*#$λΣΦΨ∴';
   const ramp=1+seg(t,B(13),B(19))*1.6;
   for(let i=0;i<cols;i++){
     const r=mulberry32(i*7+13);
     const x=i*(W/cols)+r()*20;
     const speed=(14+r()*22)*60*ramp;
     const len=10+Math.floor(r()*22);
     const y0=((t*speed + r()*4000)%(H+len*26))-len*26;
     for(let j=0;j<len;j++){
       const y=y0-j*26;
       if(y<-30||y>H+30)continue;
       const ch=pool[Math.floor(mulberry32(i*31+j*7+Math.floor(t*8))()*pool.length)];
       const head=j===0;
       c.font=`${head?24:20}px JetMonoReg`;
       c.fillStyle=head?'#dffcff':(r()<0.1?PAL.mag:`rgba(0,229,255,${0.6*(1-j/len)})`);
       c.fillText(ch,x,y);
     }
   }
   const s1=slam(t,B(13),0.32),s2=slam(t,B(14),0.35);
   const big=$('rainT1');
   big.style.transform=`translateX(${(1-s1.k)*-160}px) skewX(${(1-s1.k)*-14}deg)`;
   big.style.opacity=s1.op;
   big.style.textShadow=`${-bi.pulse*10}px 0 rgba(255,45,120,.5), ${bi.pulse*10}px 0 rgba(0,229,255,.5)`;
   const mid=$('rainT2');
   mid.style.transform=`translateX(${(1-s2.k)*160}px)`;
   mid.style.opacity=s2.op;
   $('rainCjk').style.opacity=smooth(B(14.5),B(16),t);
   const cnt=$('rainCnt');
   const v=easeOutCubic(seg(t,B(13),B(19)))*15728441036;
   cnt.textContent=Math.floor(v).toLocaleString('en-US');
   // per-beat keyword escalation
   const KWS=[['BOOKS','#00e5ff'],['CODE','#b8ff2e'],['ART','#ffb62e'],['EVERYTHING','#ff2d78']];
   const kw=$('rainKw');
   const ki=bi.i-15;
   if(ki>=0&&ki<4){
     const ks=slam(t,B(15+ki),0.24);
     if(kw.dataset.k!==KWS[ki][0]){kw.dataset.k=KWS[ki][0];kw.textContent=KWS[ki][0];kw.style.color=KWS[ki][1];}
     kw.style.transform=`translateY(${(1-ks.k)*40}px) scale(${ks.scale})`;
     kw.style.opacity=ks.op*(ki===3?1:1-seg(t,B(16+ki),B(16+ki)+0.3));
   }else kw.style.opacity=0;
   const log=$('rainLog');
   const src=['> ingest("arxiv.*") … ok','> parse(human.history) … ok','> embed(culture.full) … ok','> distill(code.all) … ok','> compose(tomorrow) …'];
   const li=Math.floor((t-B(13))/0.45);
   log.textContent=src.slice(Math.max(0,li-6),li+1).join('\n');
   log.style.opacity=0.9;
 });
getScene('rain').bg=t=>({cx:0.5,cy:0.4,c1:'#051018',c2:'#030810',c3:'#010206',grid:true,gridSpeed:0.7,pmode:'burst',pi:0.8});

/* ---- S3 NEURAL MESH — 1.8T (v19→25) ---- */
scene('neural',B(19),B(25),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='netCv';
   mono('left:110px;top:24%;font-size:18px;color:#55688a;letter-spacing:3px;','TOPOLOGY // DEEP-MESH-7',div);
   const big=txt('left:110px;top:30%;font-size:130px;color:#fff;','',div);big.id='netBig';
   cjk('left:110px;top:47%;font-size:44px;color:#a78bfa;','万亿参数 · 编织成网',div).id='netCjk';
   mono('left:110px;top:57%;font-size:19px;color:#7ef9c6;','PARAMETERS // SYNAPTIC MESH',div).id='netSub';
   mono('right:110px;bottom:22%;font-size:17px;color:#55688a;text-align:right;line-height:2;','FLOPS 2.4×10²¹\nLAYERS 96\nLATENCY 3.1ms',div).id='netStats';
   mono('right:110px;top:24%;font-size:20px;color:#55688a;letter-spacing:2px;text-align:right;','',div).id='netLayer';
 },
 (div,t)=>{
   const cv=$('netCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   const bi=beatInfo(t);
   const rot=t*1.1;
   const L=5,nodesPer=[8,12,12,12,6];
   const proj=[];
   for(let l=0;l<L;l++){
     const n=nodesPer[l];
     for(let j=0;j<n;j++){
       const yy=(j/(n-1)-0.5)*1.5;
       const xx=(l/(L-1)-0.5)*2.0;
       const zz=Math.sin(j*1.7+l*2.3)*0.5;
       const xr=xx*Math.cos(rot)-zz*Math.sin(rot);
       const zr=xx*Math.sin(rot)+zz*Math.cos(rot);
       const z=0.9+zr*0.45;
       const sx=W*0.58+xr/z*W*0.36, sy=H*0.5+yy/z*H*0.4;
       proj.push({l,j,sx,sy,z});
     }
   }
   c.lineWidth=1;
   for(let l=0;l<L-1;l++){
     const a0=proj.filter(p=>p.l===l),a1=proj.filter(p=>p.l===l+1);
     for(const p of a0)for(const q of a1){
       const ax=(p.sx+q.sx)/2;
       const depth=(p.z+q.z)/2;
       const wave=Math.exp(-Math.pow(((bi.i%8)/8 + bi.phase*0.125 - l/(L-1))*6,2));
       const al=(0.09+0.4*wave)*(1.4-depth);
       c.strokeStyle=`rgba(167,139,250,${clamp(al,0,0.6)})`;
       c.beginPath();c.moveTo(p.sx,p.sy);c.quadraticCurveTo(ax,(p.sy+q.sy)/2-14,q.sx,q.sy);c.stroke();
     }
   }
   for(const p of proj){
     const wave=Math.exp(-Math.pow(((bi.i%8)/8 + bi.phase*0.125 - p.l/(L-1))*6,2));
     const r=(4.6+wave*8)*(1.6-p.z*0.5);
     c.fillStyle=`rgba(0,229,255,${0.35+0.6*wave})`;
     c.beginPath();c.arc(p.sx,p.sy,r,0,6.283);c.fill();
     c.fillStyle=`rgba(255,255,255,${0.9*wave})`;
     c.beginPath();c.arc(p.sx,p.sy,r*0.35,0,6.283);c.fill();
   }
   // counter rolls up to 1.8T
   const roll=easeOutCubic(seg(t,B(19),B(23)));
   const s=slam(t,B(19),0.35);
   const big=$('netBig');
   big.textContent=(roll*1.8).toFixed(2)+'T';
   big.style.transform=`scale(${s.scale})`; big.style.transformOrigin='left center';
   big.style.opacity=s.op;
   big.style.textShadow=`${-bi.pulse*8}px 0 rgba(255,45,120,.5),${bi.pulse*8}px 0 rgba(0,229,255,.5)`;
   $('netCjk').style.opacity=smooth(B(20),B(21),t);
   $('netSub').style.opacity=smooth(B(21),B(22),t);
   $('netStats').style.opacity=smooth(B(22),B(24),t);
   $('netLayer').textContent=`LAYER ${String(Math.min(96,1+Math.floor(seg(t,B(19),B(25))*96))).padStart(2,'0')} / 96`;
 });
getScene('neural').bg=t=>({cx:0.55,cy:0.5,c1:'#0a0820',c2:'#05040f',c3:'#020108',grid:true,gridSpeed:0.4,pmode:'ambient',pi:0.7});

/* ---- S4 TRI-SLAM w/ VOICE (v25→31) ---- */
const SLAMS=[
 {v:25,en:'IT SEES',cn:'它 看 见',glyph:'eye',col:PAL.cyan},
 {v:27,en:'IT WRITES',cn:'它 书 写',glyph:'pen',col:PAL.mag},
 {v:29,en:'IT CREATES',cn:'它 创 造',glyph:'spark',col:PAL.lime},
];
scene('slams',B(25),B(31),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='slamCv';
   const w=el('div','position:absolute;inset:0;',div);w.id='slamWrap';
   const g=el('canvas','position:absolute;left:200px;top:50%;transform:translateY(-50%);width:380px;height:380px;',w);g.id='slamGlyph';g.width=380;g.height=380;
   txt('left:640px;top:38%;font-size:210px;color:#fff;','',w).id='slamEn';
   cjk('left:640px;top:60%;font-size:74px;','',w).id='slamCn';
   mono('left:640px;top:74%;font-size:20px;color:#55688a;letter-spacing:3px;','',w).id='slamSeq';
 },
 (div,t)=>{
   const w=$('slamWrap');
   const bi=beatInfo(t);
   const active=[...SLAMS].reverse().find(s=>bi.i>=s.v)||SLAMS[0];
   const t0=B(active.v),t1=B(active.v+2);
   const s=slam(t,t0,0.26);
   const r=mulberry32(Math.floor(t*60));
   const jit=bi.pulse*8;
   const en=$('slamEn'),cn=$('slamCn'),sq=$('slamSeq');
   if(en.dataset.k!==active.en){en.dataset.k=active.en;en.textContent=active.en;cn.textContent=active.cn;cn.style.color=active.col;sq.textContent=`CAPABILITY :: ${active.en.split(' ')[1]} // VOICE.ON`;}
   en.style.transform=`scale(${s.scale+bi.pulse*0.02}) translate(${(r()-0.5)*jit}px,${(r()-0.5)*jit*0.5}px)`;
   en.style.transformOrigin='left center';
   en.style.opacity=s.op;
   en.style.textShadow=`${-(s.k<1?(1-s.k)*24+bi.pulse*6:bi.pulse*6)}px 0 rgba(255,45,120,.55), ${(s.k<1?(1-s.k)*24+bi.pulse*6:bi.pulse*6)}px 0 rgba(0,229,255,.55)`;
   cn.style.opacity=smooth(t0+0.12,t0+0.4,t);
   sq.style.opacity=smooth(t0+0.2,t0+0.5,t);
   const g=$('slamGlyph').getContext('2d');g.clearRect(0,0,380,380);
   g.strokeStyle=active.col;g.lineWidth=7;g.lineCap='round';
   const gi=slam(t,t0,0.3).k;
   g.save();g.translate(190,190);g.scale(gi,gi);g.rotate((1-gi)*-0.3);
   if(active.glyph==='eye'){
     g.beginPath();g.ellipse(0,0,140,80,0,0,6.283);g.stroke();
     g.beginPath();g.arc(0,0,52,0,6.283);g.stroke();
     g.fillStyle=active.col;g.beginPath();g.arc(0,0,24,0,6.283);g.fill();
     for(let a=0;a<4;a++){g.globalAlpha=0.5;g.beginPath();g.arc(0,0,110+a*22,-0.6+a*0.4,-0.4+a*0.4);g.stroke();}
   }else if(active.glyph==='pen'){
     g.beginPath();g.moveTo(-120,110);g.lineTo(60,-120);g.lineTo(120,-60);g.lineTo(-60,110);g.closePath();g.stroke();
     g.beginPath();g.moveTo(-120,110);g.lineTo(-150,140);g.stroke();
     for(let i=0;i<4;i++){g.globalAlpha=0.4+i*0.15;g.beginPath();g.moveTo(-140,-80+i*40);g.lineTo(-40+i*18,-80+i*40);g.stroke();}
   }else{
     for(let a=0;a<8;a++){g.save();g.rotate(a*Math.PI/4);g.beginPath();g.moveTo(0,-50);g.lineTo(0,-150);g.lineWidth=5+((a%2)*4);g.stroke();g.restore();}
     g.beginPath();g.arc(0,0,44,0,6.283);g.stroke();
     g.fillStyle=active.col;g.beginPath();g.arc(0,0,18,0,6.283);g.fill();
   }
   g.restore();
   const cv=$('slamCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   c.globalAlpha=1;c.fillStyle=active.col;c.fillRect(140,H*0.28,10,H*0.44);
   // segment progress ticks under the bar
   for(let i=0;i<3;i++){c.globalAlpha=SLAMS[i].v<=bi.i?0.9:0.25;c.fillStyle=SLAMS[i].col;c.fillRect(140+ i*26,H*0.28-30,18,8);}
   c.globalAlpha=1;c.font='17px JetMonoReg';c.fillStyle='#33415e';
   c.fillText(`FR_${String(bi.i).padStart(3,'0')}`,1500,980);
 });
getScene('slams').bg=t=>({cx:0.35,cy:0.5,c1:'#0a0e1c',c2:'#05070f',c3:'#020307',grid:true,gridSpeed:0.6,pmode:'ambient',pi:0.6});

/* ---- S5 QUESTION — the vacuum (v31→38) ---- */
scene('question',B(31),B(38),
 div=>{
   el('div','position:absolute;inset:0;',div).id='qInner';
   const w=$('qInner');
   cjk('left:50%;top:40%;font-family:NotoSerifBlack;font-size:120px;color:#eaf6ff;','',w).id='qCjk';
   mono('left:50%;top:58%;font-size:26px;color:#55688a;letter-spacing:8px;','WILL IT REPLACE US ?',w).id='qEn';
   const bar=el('div','position:absolute;left:50%;top:72%;width:760px;transform:translateX(-50%);',w);
   mono('font-size:17px;color:#3b4a63;letter-spacing:2px;','AUTOMATION INDEX',bar);
   el('div','height:8px;background:#0c1322;margin-top:10px;border:1px solid #16233a;',bar).innerHTML='<div id="qFill" style="height:100%;width:0%;background:linear-gradient(90deg,#00e5ff,#ff2d78);box-shadow:0 0 18px rgba(255,45,120,.5)"></div>';
   mono('font-size:15px;color:#3b4a63;margin-top:8px;','',bar).id='qPct';
   mono('left:50%;top:30%;font-size:17px;color:#33415e;letter-spacing:3px;','/// SEQUENCE 05 — THE QUESTION',w).id='qSeq';
 },
 (div,t)=>{
   const w=$('qInner');
   const k=smooth(B(31),B(31)+0.8,t);
   const bi=beatInfo(t);
   const q=$('qCjk');
   const full='它会取代我们吗？';
   const n=Math.min(full.length,Math.floor(seg(t,B(31)+0.4,B(34.5))*full.length));
   q.textContent=full.slice(0,n)+(n<full.length?'▏':'');
   q.style.transform=`translate(-50%,-50%) scale(${0.94+0.06*k})`;
   q.style.opacity=k;
   $('qEn').style.opacity=smooth(B(35),B(37),t);
   $('qSeq').style.opacity=smooth(B(31.5),B(33),t);
   const pct=easeInOut(seg(t,B(33),B(37.8)))*47;
   const f=$('qFill');if(f)f.style.width=pct+'%';
   const p=$('qPct');if(p)p.textContent=`${pct.toFixed(1)}% ${pct>40?'▲ RISING':'computing…'}`;
   w.style.filter=`saturate(${0.55+bi.pulse*0.3}) brightness(${0.8+0.2*k})`;
 });
getScene('question').bg=t=>({cx:0.5,cy:0.45,c1:'#05070d',c2:'#03040a',c3:'#010203',grid:true,gridSpeed:0.1,pmode:'sparse',pi:0.35});

/* ---- S6 AMPLIFY (v38→44) ---- */
scene('amplify',B(38),B(44),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='ampWrap';
   const cL=el('div','position:absolute;left:50%;top:50%;width:520px;height:520px;border-radius:50%;border:2px solid #00e5ff;background:rgba(0,229,255,.06);mix-blend-mode:screen;box-shadow:0 0 90px rgba(0,229,255,.25) inset, 0 0 60px rgba(0,229,255,.15);',w);cL.id='ampL';
   const cR=el('div','position:absolute;left:50%;top:50%;width:520px;height:520px;border-radius:50%;border:2px solid #ff2d78;background:rgba(255,45,120,.06);mix-blend-mode:screen;box-shadow:0 0 90px rgba(255,45,120,.25) inset, 0 0 60px rgba(255,45,120,.15);',w);cR.id='ampR';
   mono('left:33%;top:24%;font-size:26px;color:#00e5ff;letter-spacing:6px;','HUMAN',w).id='ampLt';
   mono('right:33%;top:24%;font-size:26px;color:#ff2d78;letter-spacing:6px;','MACHINE',w).id='ampRt';
   txt('left:50%;top:50%;font-size:150px;color:#fff;','AMPLIFY',w).id='ampBig';
   cjk('left:50%;top:66%;font-size:52px;color:#fff;','放 大 我 们',w).id='ampCjk';
   mono('left:50%;top:78%;font-size:18px;color:#55688a;letter-spacing:4px;','NOT REPLACE — HUMAN × MACHINE',w).id='ampSeq';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const k=easeInOut(seg(t,B(38),B(41)));
   const d=lerp(560,120,k);
   $('ampL').style.transform=`translate(calc(-50% - ${d}px),-50%)`;
   $('ampR').style.transform=`translate(calc(-50% + ${d}px),-50%)`;
   const s=slam(t,B(41),0.35);
   const big=$('ampBig');
   big.style.transform=`translate(-50%,-50%) scale(${s.scale+bi.pulse*0.03})`;
   big.style.opacity=s.op;
   big.style.textShadow=`${-bi.pulse*9}px 0 rgba(0,229,255,.5), ${bi.pulse*9}px 0 rgba(255,45,120,.5)`;
   $('ampCjk').style.opacity=smooth(B(41.5),B(42.5),t);
   $('ampSeq').style.opacity=smooth(B(42),B(43.5),t);
   $('ampLt').style.opacity=smooth(B(38),B(39),t);
   $('ampRt').style.opacity=smooth(B(38),B(39),t);
 });
getScene('amplify').bg=t=>({cx:0.5,cy:0.5,c1:'#070b16',c2:'#04060d',c3:'#010204',grid:true,gridSpeed:0.25,pmode:'ambient',pi:0.5});

/* ---- S7 BUILD + COUNTDOWN (v44→56) ---- */
scene('build',B(44),B(56),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='buildWrap';
   mono('left:50%;top:26%;font-size:19px;color:#55688a;letter-spacing:5px;','/// SEQUENCE 07 — IGNITION SEQUENCE',w);
   el('div','position:absolute;left:60px;bottom:120px;width:14px;background:#0c1322;border:1px solid #16233a;',w).id='barL';
   el('div','position:absolute;right:60px;bottom:120px;width:14px;background:#0c1322;border:1px solid #16233a;',w).id='barR';
   const rows=el('div','position:absolute;left:50%;top:38%;transform:translate(-50%,0);width:1100px;',w);rows.id='buildRows';
   [['MODELS DEPLOYED','b1',3071991],['IMAGES / SEC','b2',48211],['PAPERS / DAY','b3',412],['CITIES ONLINE','b4',3119]].forEach(([label,id],i)=>{
     const row=el('div','display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #101a2e;padding:14px 4px;',rows);
     mono('font-size:20px;color:#3b4a63;letter-spacing:2px;',label,row);
     mono('font-family:JetMono;font-size:44px;color:#eaf6ff;','',row).id=id;
   });
   txt('left:50%;top:62%;font-size:340px;color:#fff;','',w).id='countNum';
   mono('left:50%;top:88%;font-size:22px;color:#ff2d78;letter-spacing:8px;','SYSTEM GO',w).id='goTag';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const prog=seg(t,B(44),B(52));
   const acc=Math.pow(prog,1.7);
   const rr=mulberry32(Math.floor(t*30));
   const w=$('buildWrap');
   w.style.transform=`translate(${(rr()-0.5)*acc*18}px,${(rr()-0.5)*acc*10}px)`;
   w.style.filter=`brightness(${1+acc*0.5+bi.pulse*0.4})`;
   const rows=$('buildRows');
   rows.style.opacity=clamp(1-seg(t,B(50),B(52)),0,1);
   const bh=Math.floor(acc*560);
   for(const id of ['barL','barR']){const b=$(id);b.style.height=bh+'px';b.innerHTML=`<div style="position:absolute;left:0;right:0;top:0;height:${bh}px;background:linear-gradient(0deg,#00e5ff,#ff2d78);box-shadow:0 0 16px rgba(0,229,255,.5)"></div>`;}
   $('b1').textContent=Math.floor(acc*3071991).toLocaleString();
   $('b2').textContent=Math.floor(acc*48211).toLocaleString();
   $('b3').textContent=Math.floor(acc*412).toLocaleString();
   $('b4').textContent=Math.floor(acc*3119).toLocaleString();
   const cn=$('countNum'),gt=$('goTag');
   if(t>=B(52)){
     const labels={52:'3',53:'2',54:'1',55:'→'};
     cn.textContent=labels[bi.i]||'';
     const s=slam(t,B(bi.i),0.22);
     cn.style.transform=`translate(-50%,-50%) scale(${s.scale})`;
     cn.style.opacity=s.op;
     cn.style.color=bi.i===55?PAL.lime:'#fff';
     gt.style.opacity=1;gt.style.color=bi.i===55?PAL.lime:'#ff2d78';
   }else{cn.textContent='';gt.style.opacity=0;}
 });
getScene('build').bg=t=>({cx:0.5,cy:0.55,c1:'#0a0c18',c2:'#05060f',c3:'#010204',grid:true,gridSpeed:1.4,pmode:'warp',pi:1});

/* ---- S7b BLACKOUT (v56→58) ---- */
scene('blackout',B(56),B(58),
 div=>{el('div','position:absolute;left:50%;top:50%;width:0;height:2px;background:#fff;',div).id='blkLine';},
 (div,t)=>{
   const k=seg(t,B(56),B(58));
   const l=$('blkLine');
   l.style.width=`${(1-easeInOut(k))*W*0.4+4}px`;
   l.style.transform='translateX(-50%)';
   l.style.boxShadow='0 0 40px rgba(0,229,255,.8)';
   l.style.background='#00e5ff';
   l.style.opacity=1-k*0.6;
 });
getScene('blackout').bg=t=>({cx:0.5,cy:0.5,c1:'#000',c2:'#000',c3:'#000',grid:false,pmode:'sparse',pi:0});

/* ---- S8 MONTAGE — escalation (v58→74, 16 cards, 1 per beat) ---- */
const CARDS=[
 ['HEALS','治 愈',PAL.cyan,'✚'],
 ['TEACHES','教 导',PAL.cyan,'✎'],
 ['FEEDS','喂 养',PAL.cyan,'◈'],
 ['DRIVES','驾 驶',PAL.cyan,'▶'],
 ['WRITES','书 写',PAL.lime,'✎'],
 ['PAINTS','作 画',PAL.lime,'◐'],
 ['COMPOSES','作 曲',PAL.lime,'♪'],
 ['TRADES','交 易',PAL.amber,'$'],
 ['WATCHES','注 视',PAL.mag,'◉'],
 ['PROFILES','画 像',PAL.mag,'◎'],
 ['PREDICTS','预 测',PAL.mag,'≋'],
 ['JUDGES','评 判',PAL.mag,'⚖'],
 ['DECIDES','决 定',PAL.mag,'▲'],
 ['EVERYWHERE','无 处 不 在',PAL.wht,'✳'],
 ['EVERYONE','所 有 人',PAL.wht,'●'],
 ['YOU ?','你 ?','#ff3355','?'],
];
scene('montage',B(58),B(74),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='mWrap';
   el('div','position:absolute;left:0;right:0;top:0;bottom:0;',w).id='mStrobe';
   txt('left:50%;top:42%;font-size:300px;color:#fff;','',w).id='mEn';
   cjk('left:50%;top:64%;font-size:100px;color:#fff;','',w).id='mCn';
   mono('left:50%;top:82%;font-size:22px;color:#fff;letter-spacing:6px;','',w).id='mTag';
   txt('left:50%;top:38%;font-size:340px;','',w).id='mGlyph';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const w=$('mWrap'),st=$('mStrobe');
   const rel=clamp(bi.i-58,0,15);
   const rr=mulberry32(Math.floor(t*90));
   const inv=rel%2===1;
   st.style.background=inv?'#eaf6ff':'transparent';
   const card=CARDS[rel];
   const showGlyph=rel%2===1;
   const en=$('mEn'),cn=$('mCn'),gl=$('mGlyph'),tag=$('mTag');
   const s=slam(t,B(bi.i),0.2);
   if(en.dataset.k!==card[0]+showGlyph){
     en.dataset.k=card[0]+showGlyph;
     en.textContent=card[0];
     en.style.fontSize=card[0].length>7?'230px':'300px';
     cn.textContent=card[1];
     gl.textContent=showGlyph?card[3]:'';
     tag.textContent=`AI × ${card[0]} :: ${String(rel+1).padStart(2,'0')}/16`;
   }
   const jit=bi.pulse*16;
   const jx=(rr()-0.5)*jit,jy=(rr()-0.5)*jit*0.6;
   en.style.transform=`translate(-50%,-50%) scale(${s.scale+bi.pulse*0.04}) rotate(${(rr()-0.5)*jit*0.4}deg) translate(${jx}px,${jy}px)`;
   en.style.opacity=showGlyph?0.10:s.op;
   en.style.color=inv?'#000':card[2];
   en.style.textShadow=inv?`${-jx*0.5}px 0 rgba(255,45,120,.7), ${jx*0.5}px 0 rgba(0,229,255,.7)`:`${-jit*0.8}px 0 rgba(255,45,120,.6), ${jit*0.8}px 0 rgba(0,229,255,.6)`;
   gl.style.transform=`translate(-50%,-50%) scale(${s.scale}) rotate(${s.k<1?(1-s.k)*30:0}deg)`;
   st.style.boxShadow=inv?'none':`inset 0 0 0 4px ${card[2]}`;
   gl.style.opacity=showGlyph?s.op:0;
   gl.style.color=inv?'#000':card[2];
   cn.style.transform=`translate(-50%,-50%) scale(${0.9+0.1*s.k})`;
   cn.style.opacity=s.op;
   cn.style.color=inv?'#000':'#fff';
   tag.style.opacity=0.8;tag.style.color=inv?'#000':'#55688a';
   w.style.filter=`contrast(1.15) brightness(${1+bi.pulse*0.55})`;
   w.style.transform=`scale(${1+bi.pulse*0.015})`;
 });
getScene('montage').bg=t=>({cx:0.5,cy:0.5,c1:'#0e0f1e',c2:'#070812',c3:'#030308',grid:true,gridSpeed:1.8,pmode:'burst',pi:1});

/* ---- S9 STATEMENT (v74→78) ---- */
scene('statement',B(74),B(78),
 div=>{
   const w=el('div','position:absolute;inset:0;background:#eaf6ff;',div);w.id='stmtBg';
   mono('left:50%;top:30%;font-size:34px;color:#0a0e18;letter-spacing:4px;','NOT HUMAN. NOT MACHINE.',w).id='stEn';
   cjk('left:50%;top:46%;font-family:NotoSerifBlack;font-size:190px;color:#04060c;','人机共生',w).id='stCjk';
   mono('left:50%;top:72%;font-size:20px;color:#33415e;letter-spacing:6px;','BOTH. — SYMBIOSIS // 共生',w).id='stSub';
   el('div','position:absolute;left:50%;top:82%;width:1px;height:60px;background:#04060c;',w).id='stRule';
 },
 (div,t)=>{
   const w=$('stmtBg');
   const bi=beatInfo(t);
   const s=slam(t,B(74),0.35);
   const cj=$('stCjk');
   cj.style.transform=`translate(-50%,-50%) scale(${s.scale})`;
   cj.style.opacity=s.op;
   $('stEn').style.opacity=smooth(B(74)+0.15,B(75.5),t);
   $('stSub').style.opacity=smooth(B(76),B(77.5),t);
   $('stRule').style.opacity=smooth(B(76.5),B(77.8),t);
   w.style.transform=`scale(${1+seg(t,B(74),B(78))*0.03})`;
   w.style.filter=`brightness(${1+bi.pulse*0.12})`;
 });
getScene('statement').bg=t=>({cx:0.5,cy:0.5,c1:'#eaf6ff',c2:'#dfeaf5',c3:'#c8d6e6',grid:false,pmode:'sparse',pi:0.15});

/* ---- S10 END CARD (v78→86) ---- */
scene('end',B(78),B(86)+0.5,
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='endWrap';
   const mark=el('div','position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);width:170px;height:170px;border:2px solid #00e5ff;border-radius:32px;box-shadow:0 0 60px rgba(0,229,255,.3), inset 0 0 40px rgba(0,229,255,.12);display:flex;align-items:center;justify-content:center;font-family:JetMono;font-size:44px;color:#00e5ff;',w);mark.id='endMark';
   mark.innerHTML='<span>AI://</span>';
   txt('left:50%;top:56%;font-family:ArchivoBlack;font-size:56px;color:#fff;letter-spacing:.14em;','INTELLIGENCE IS THE NEW ELECTRICITY',w).id='endEn';
   cjk('left:50%;top:66%;font-size:34px;color:#a78bfa;letter-spacing:.5em;','智 能 即 电 力',w).id='endCjk';
   mono('left:50%;top:78%;font-size:16px;color:#33415e;letter-spacing:3px;','129 BPM · FRAME-LOCKED SYNC · GENERATED BY CODE',w).id='endTag';
   el('div','position:absolute;left:50%;top:52%;width:340px;height:1px;background:linear-gradient(90deg,transparent,#00e5ff,transparent);',w).id='endRule';
 },
 (div,t)=>{
   const k=smooth(B(78),B(79.5),t);
   const w=$('endWrap');
   w.style.opacity=k*(1-seg(t,B(84.2),B(86)+0.3));
   const m=$('endMark');
   const bi=beatInfo(t);
   m.style.transform=`translate(-50%,-50%) rotate(${45+seg(t,B(78),B(82))*135}deg) scale(${0.6+0.4*easeOutBack(k)})`;
   m.style.opacity=k;
   m.querySelector('span').style.transform=`rotate(${-(45+seg(t,B(78),B(82))*135)}deg)`;
   $('endEn').style.opacity=smooth(B(79),B(80.5),t);
   $('endEn').style.transform=`translate(-50%,-50%) scale(${0.96+0.04*smooth(B(79),B(82),t)})`;
   $('endCjk').style.opacity=smooth(B(81),B(82.5),t);
   $('endTag').style.opacity=smooth(B(82),B(84),t);
   $('endRule').style.opacity=k;
   w.style.filter=`brightness(${1+bi.pulse*0.15})`;
 });
getScene('end').bg=t=>({cx:0.5,cy:0.5,c1:'#05070d',c2:'#030409',c3:'#010203',grid:true,gridSpeed:0.12,pmode:'sparse',pi:0.3});
   HUD (always on)
   ============================================================ */
const CAPTIONS=[
 [0,'LOG://AWAKENING'],[B(8),'SEQ.01 IGNITION'],[B(13),'SEQ.02 IT LEARNED'],
 [B(19),'SEQ.03 DEEP MESH'],[B(25),'SEQ.04 CAPABILITIES'],[B(31),'SEQ.05 THE QUESTION'],
 [B(38),'SEQ.06 AMPLIFY'],[B(44),'SEQ.07 COUNTDOWN'],[B(58),'SEQ.08 AI × WORLD'],
 [B(74),'SEQ.09 人机共生'],[B(78),'SEQ.10 NEW ELECTRICITY'],
];
function drawHUD(t,frame,bi,activeId){
  const cap=CAPTIONS.filter(c=>t>=c[0]).pop();
  const blink=bi.pulse>0.5?'#00e5ff':'#33415e';
  let eq='';
  for(let i=0;i<16;i++){
    const r=mulberry32(i*7+ (bi.i<0?0:bi.i));
    const h=4+r()*(10+bi.pulse*46*(0.5+r()*0.7))*(bi.i<0?0.2:1);
    eq+=`<div style="display:inline-block;width:9px;height:${h}px;background:${i%4===0?'#00e5ff':'#22304d'};margin-right:5px;vertical-align:bottom;box-shadow:${i%4===0?'0 0 8px rgba(0,229,255,.6)':'none'}"></div>`;
  }
  hud.innerHTML=`
  <div style="position:absolute;left:44px;top:20px;font-size:15px;color:#55688a;letter-spacing:2px;">AI://MIND_SYNC <span style="color:${blink}">●</span></div>
  <div style="position:absolute;right:44px;top:20px;font-size:15px;color:#55688a;letter-spacing:2px;text-align:right;">129.2 BPM · SYNC LOCK<br><span style="color:#33415e">F${String(frame).padStart(5,'0')}</span></div>
  <div style="position:absolute;left:44px;bottom:66px;height:52px;display:flex;align-items:flex-end;">${eq}</div>
  <div style="position:absolute;right:44px;bottom:70px;font-size:15px;color:#55688a;letter-spacing:2px;text-align:right;">${cap?cap[1]:''}<br><span style="color:#33415e">T+${t.toFixed(2)}s</span></div>
  <div style="position:absolute;left:44px;bottom:20px;right:44px;height:1px;background:#16233a;"><div style="height:100%;width:${(t/39.95*100).toFixed(2)}%;background:linear-gradient(90deg,#00e5ff,#ff2d78)"></div></div>`;
}

/* ============================================================
   TRANSITIONS + MASTER RENDER
   ============================================================ */
const TRANS=0.16;
const flashes=new Set([8,13,19,25,31,38,44,58,74,78].map(k=>Math.ceil(B(k)*FPS)));
// stronger white flash on the two drops + statement
const bigFlashFrames=new Set([8,58,74].map(k=>Math.ceil(B(k)*FPS)));

let curScene=null,prevScene=null;
function renderScene(sc,t,host){
  if(!sc.built||sc.el!==host){host.innerHTML='';sc.build(host);sc.el=host;sc.built=true;}
  sc.draw(host,t);
}
window.renderAt=function(t){
  const frame=Math.round(t*FPS);
  const bi=beatInfo(t);
  // pick active scene; prevScene = previous scene in timeline (not last-rendered)
  const sidx=scenes.findIndex(s=>t>=s.s&&t<s.e);
  const sc=sidx<0?scenes[scenes.length-1]:scenes[sidx];
  prevScene=sidx>0?scenes[sidx-1]:null;
  curScene=sc;
  // background
  const cfg=sc.bg?sc.bg(t):{cx:.5,cy:.5,c1:'#060a14',c2:'#04060c',c3:'#010204',grid:true,pmode:'ambient',pi:0.5};
  drawBG(t,cfg);
  drawRings(t,bi);
  drawParticles(t,cfg.pmode||'ambient',cfg.pi==null?0.6:cfg.pi,bi.pulse);
  // fx: sweep line
  fx.clearRect(0,0,W,H);
  const sy=((t*140)%(H+200))-100;
  const sg=fx.createLinearGradient(0,sy-60,0,sy+60);
  sg.addColorStop(0,'rgba(0,229,255,0)');sg.addColorStop(0.5,`rgba(0,229,255,${0.05+bi.pulse*0.04})`);sg.addColorStop(1,'rgba(0,229,255,0)');
  fx.fillStyle=sg;fx.fillRect(0,sy-60,W,120);
  // scenes
  const sinceStart=t-sc.s;
  const inTrans=sinceStart<TRANS&&prevScene&&prevScene!==sc;
  // camera pulse
  const camSc=1+bi.pulse*0.008;
  if(inTrans){
    renderScene(prevScene,t,stageB);
    stageB.style.opacity=1-sinceStart/TRANS;
    const rr=mulberry32(frame);
    stageB.style.transform=`translate(${(rr()-0.5)*14}px,${(rr()-0.5)*8}px) scale(${camSc})`;
    stageB.style.filter=`hue-rotate(${(rr()-0.5)*90}deg) brightness(1.4)`;
  }else{
    stageB.style.opacity=0;
  }
  renderScene(sc,t,stageA);
  if(inTrans){
    const rr=mulberry32(frame+7);
    stageA.style.transform=`translate(${(rr()-0.5)*10}px,0) scale(${camSc+0.01})`;
    stageA.style.clipPath=`inset(0 0 ${(1-sinceStart/TRANS)*60}% 0)`;
    stageA.style.filter=`contrast(1.2)`;
  }else{
    stageA.style.transform=`scale(${camSc})`;
    stageA.style.clipPath='none';
    stageA.style.filter='none';
  }
  // flash on accented scene-start beats
  let fo=0;
  if(bigFlashFrames.has(frame)||flashes.has(frame))fo=bigFlashFrames.has(frame)?0.9:0.55;
  else{
    // decay over ~3 frames
    for(const f of bigFlashFrames){if(frame>f&&frame-f<4)fo=Math.max(fo,0.9*(1-(frame-f)/4));}
    for(const f of flashes){if(frame>f&&frame-f<3)fo=Math.max(fo,0.55*(1-(frame-f)/3));}
  }
  flashEl.style.opacity=fo;
  // grain + hud
  drawGrain(frame);
  drawHUD(t,frame,bi,sc.id);
  return sc.id;
};
```

### 6/14 · `render.py`
<!-- casebook-file {"path": "render.py", "lines": 39, "final_newline": true, "sha256": "ff79c55ea3ede78d7a9d33d5fc3b3179789f36670a0ce4399056de653c8aadde", "original_sha256": "ff79c55ea3ede78d7a9d33d5fc3b3179789f36670a0ce4399056de653c8aadde"} -->
```python
#!/usr/bin/env python3
"""Deterministic frame renderer: seeks window.renderAt(t) per frame."""
import asyncio, sys, os, json
from playwright.async_api import async_playwright

FPS = 30
DUR = 39.95
OUT = "/home/ubuntu/video/frames"
os.makedirs(OUT, exist_ok=True)

async def worker(pw, wid, frames, results):
    browser = await pw.chromium.launch(args=["--allow-file-access-from-files","--force-color-profile=srgb","--disable-lcd-text"])
    page = await browser.new_page(viewport={"width":1920,"height":1080}, device_scale_factor=1)
    await page.goto("file:///home/ubuntu/video/index.html")
    await page.evaluate("document.fonts.ready.then(()=>1)")
    await page.evaluate("1")
    for f in frames:
        t = f / FPS
        await page.evaluate(f"renderAt({t})")
        await page.screenshot(path=f"{OUT}/f_{f:05d}.jpg", type="jpeg", quality=90)
        if f % 120 == 0:
            print(f"[w{wid}] frame {f}", flush=True)
    await browser.close()
    results.append(wid)

async def main(start=0, end=None, nw=6):
    total = int(DUR*FPS)
    if end is None: end = total
    allf = list(range(start, min(end,total)))
    chunks = [allf[i::nw] for i in range(nw)]
    async with async_playwright() as pw:
        results=[]
        await asyncio.gather(*[worker(pw,i,ch,results) for i,ch in enumerate(chunks) if ch])
    print("done")

if __name__=="__main__":
    s=int(sys.argv[1]) if len(sys.argv)>1 else 0
    e=int(sys.argv[2]) if len(sys.argv)>2 else None
    asyncio.run(main(s,e))
```

### 7/14 · `render_boot.py`
<!-- casebook-file {"path": "render_boot.py", "lines": 14, "final_newline": true, "sha256": "57283546bb1ba1b4f511842467e1168af6ad4542d11ead1c2d24bad384349bfb", "original_sha256": "57283546bb1ba1b4f511842467e1168af6ad4542d11ead1c2d24bad384349bfb"} -->
```python
import asyncio, pathlib
from playwright.async_api import async_playwright
FR=pathlib.Path('frames')
async def wk(pw,i,nw):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1920,'height':1080})
    await pg.goto('file:///home/ubuntu/video/index.html');await pg.wait_for_timeout(400)
    for f in range(i,389,nw):
        await pg.evaluate(f"renderAt({f/30})")
        await pg.screenshot(path=str(FR/f'f_{f:05d}.jpg'),type='jpeg',quality=90)
    await b.close()
async def main():
    async with async_playwright() as pw:
        await asyncio.gather(*[wk(pw,i,6) for i in range(6)])
asyncio.run(main())
```

### 8/14 · `render_rng.py`
<!-- casebook-file {"path": "render_rng.py", "lines": 14, "final_newline": true, "sha256": "0e97b48ca4e3e1992125d02b0feed76b94b3bfaa01fea57e69d6a2606cb0df15", "original_sha256": "0e97b48ca4e3e1992125d02b0feed76b94b3bfaa01fea57e69d6a2606cb0df15"} -->
```python
import asyncio, pathlib
from playwright.async_api import async_playwright
FR=pathlib.Path('frames')
async def wk(pw,i,nw):
    b=await pw.chromium.launch();pg=await b.new_page(viewport={'width':1920,'height':1080})
    await pg.goto('file:///home/ubuntu/video/index.html');await pg.wait_for_timeout(400)
    for f in range(i,783,nw):
        await pg.evaluate(f"renderAt({f/30})")
        await pg.screenshot(path=str(FR/f'f_{f:05d}.jpg'),type='jpeg',quality=90)
    await b.close()
async def main():
    async with async_playwright() as pw:
        await asyncio.gather(*[wk(pw,613+i,6) for i in range(6)])
asyncio.run(main())
```

### 9/14 · `scenes_v2.js`
<!-- casebook-file {"path": "scenes_v2.js", "lines": 512, "final_newline": true, "sha256": "7255ab390f356759a437c4c3190eb02c36a52c9d2d8c0ea424d046cc2cf90cbf", "original_sha256": "7255ab390f356759a437c4c3190eb02c36a52c9d2d8c0ea424d046cc2cf90cbf"} -->
```js
/* ============================================================
   SCENES — v2 hypercut, 86 beats ≈ 39.94s
   beat k => time B(k) = k*0.464399
   ============================================================ */
const scenes=[];
function scene(id,s,e,build,draw){scenes.push({id,s,e,build,draw,built:false,el:null});}
function getScene(id){return scenes.find(s=>s.id===id);}

/* ---- S0 BOOT (v0→8) ---- */
const BOOT_LINES=[
 ['$ neural_core --init --mode=sentient',0.25],
 ['[OK] corpus indexed :: 15.7T tokens',0.9],
 ['[OK] synaptic mesh :: 1.8T params',1.55],
 ['[!!] consciousness threshold :: 99.7%',2.2],
];
scene('boot',0,B(8),
 div=>{
   el('div','position:absolute;left:0;right:0;top:0;bottom:0;',div).id='bootwrap';
   const w=$('bootwrap');
   const term=el('div','position:absolute;left:50%;top:47%;width:1240px;transform:translate(-50%,-50%);background:rgba(5,12,20,.93);border:1px solid rgba(0,229,255,.5);border-radius:10px;box-shadow:0 0 110px rgba(0,229,255,.22), inset 0 0 80px rgba(0,0,0,.55);padding:38px 46px;',w);
   el('div','height:14px;margin-bottom:22px;',term).innerHTML='<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ff5f56;margin-right:8px"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ffbd2e;margin-right:8px"></span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#27c93f"></span><span style="font-family:JetMonoReg;font-size:15px;color:#3b4a63;margin-left:20px">neural_core — zsh — 140×36</span>';
   el('div','font-family:JetMonoReg;font-size:30px;line-height:1.9;color:#8fffd0;min-height:280px;text-shadow:0 0 8px rgba(126,249,198,.4);white-space:pre;',term).id='termlines';
   mono('left:70px;bottom:76px;font-size:19px;color:#55688a;letter-spacing:2px;','',w).id='bootcap';
   mono('right:70px;top:70px;font-size:16px;color:#33415e;text-align:right;','SESSION 0924\nLOG://AWAKENING',w);
 },
 (div,t)=>{
   const tl=$('termlines');
   let html='';
   for(const[line,t0]of BOOT_LINES){
     if(t<t0)break;
     const chars=Math.floor((t-t0)*60);
     const s=line.slice(0,chars);
     html+=s.replace(/\[OK\]/g,'<span style="color:#00e5ff">[OK]</span>').replace(/\[!!\]/g,'<span style="color:#ff2d78">[!!]</span>').replace(/\$/g,'<span style="color:#a78bfa">$</span>');
     if(chars<line.length)html+='<span style="background:#7ef9c6;color:#000">&nbsp;</span>';
     html+='\n';
   }
   if(t>BOOT_LINES[BOOT_LINES.length-1][1]&&Math.floor(t*3)%2===0)html+='<span style="background:#7ef9c6;color:#000">&nbsp;</span>';
   tl.innerHTML=html;
   $('bootcap').textContent = t<1.4 ? '2026 // 觉醒前夜' : t<2.6 ? 'SIGNAL INCOMING …' : '> transmit';
   const w=$('bootwrap');
   const col=smooth(3.0,3.65,t);
   if(col>0){
     const sc=1-0.4*easeInCubic(col), jit=col*col*9;
     const r=mulberry32(Math.floor(t*90));
     w.style.transform=`scale(${sc}) translate(${(r()-0.5)*jit*8}px,${(r()-0.5)*jit*4}px)`;
     w.style.filter=`hue-rotate(${(r()-0.5)*col*160}deg) brightness(${1+col*2.2})`;
   }else{
     w.style.transform='none';w.style.filter=`brightness(${0.72+0.28*smooth(0,0.9,t)})`;
   }
 });
scenes[0].bg=t=>({cx:0.5,cy:0.55,c1:'#060a14',c2:'#04060c',c3:'#010204',grid:true,gridSpeed:0.06,pmode:'sparse',pi:0.5});

/* ---- S1 AI REVEAL (v8→13) ---- */
scene('reveal',B(8),B(13),
 div=>{
   el('div','position:absolute;inset:0;',div).id='revealInner';
   const inner=$('revealInner');
   el('div','position:absolute;left:50%;top:40%;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,255,.16) 0%,rgba(0,229,255,.05) 40%,transparent 70%);transform:translate(-50%,-50%);',inner).id='aiAura';
   const big=txt('left:50%;top:40%;font-size:560px;color:#fff;letter-spacing:-0.02em;','AI',inner);big.id='bigAI';
   const sub=txt('left:50%;top:76%;font-family:ArchivoBlack;font-size:64px;color:#fff;letter-spacing:0.5em;','ARTIFICIAL INTELLIGENCE',inner);sub.id='aiSub';
   cjk('left:50%;top:20%;font-size:46px;color:#00e5ff;letter-spacing:1.2em;','人 工 智 能',inner).id='aiCjk';
 },
 (div,t)=>{
   const s=slam(t,B(8),0.4);
   const bi=beatInfo(t);
   const big=$('bigAI');
   const shakeAmp=bi.pulse*9;
   const r=mulberry32(Math.floor(t*60));
   const jx=(r()-0.5)*shakeAmp,jy=(r()-0.5)*shakeAmp*0.6;
   // glitch hits on each beat: chroma explode + tiny rotation
   const hit=bi.pulse;
   big.style.transform=`translate(-50%,-50%) scale(${s.scale+hit*0.03}) rotate(${(1-s.k)*-4+(r()-0.5)*shakeAmp*0.24}deg) translate(${jx}px,${jy}px)`;
   big.style.opacity=s.op;
   big.style.filter=`blur(${(1-s.k)*10}px)`;
   big.style.textShadow=`${-hit*14}px 0 rgba(255,45,120,.6), ${hit*14}px 0 rgba(0,229,255,.6), 0 0 90px rgba(0,229,255,.35)`;
   $('aiAura').style.transform=`translate(-50%,-50%) scale(${0.7+hit*0.35})`;
   $('aiAura').style.opacity=0.4+hit*0.6;
   $('aiSub').style.opacity=smooth(B(8.5),B(10),t);
   $('aiSub').style.letterSpacing=`${0.5-easeOutCubic(seg(t,B(8.5),B(10)))*0.32}em`;
   $('aiCjk').style.opacity=smooth(B(9),B(10.5),t);
 });
getScene('reveal').bg=t=>({cx:0.5,cy:0.5,c1:'#0a1430',c2:'#060a18',c3:'#02030a',grid:true,gridSpeed:0.5,pmode:'burst',pi:1});

/* ---- S2 CODE RAIN — IT LEARNED (v13→19) ---- */
scene('rain',B(13),B(19),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='rainCv';
   const big=txt('left:110px;top:36%;font-size:200px;color:#fff;','IT LEARNED',div);big.id='rainT1';
   const mid=el('div','position:absolute;left:110px;top:57%;font-family:SpaceGrotesk;font-weight:700;font-size:54px;color:#fff;letter-spacing:.06em;',div,'FROM EVERYTHING WE EVER MADE');mid.id='rainT2';
   cjk('left:110px;top:67%;font-size:40px;color:#00e5ff;','它消化了人类写下的一切',div).id='rainCjk';
   mono('right:110px;top:34%;font-size:32px;color:#b8ff2e;text-align:right;','',div).id='rainCnt';
   mono('right:110px;top:40%;font-size:18px;color:#55688a;text-align:right;','TOKENS · INGESTED',div);
   txt('right:110px;top:52%;font-size:96px;color:#ff2d78;','',div).id='rainKw';
   mono('right:110px;bottom:14%;font-size:15px;color:#3b4a63;text-align:right;line-height:1.9;width:520px;white-space:pre-wrap;','',div).id='rainLog';
 },
 (div,t)=>{
   const cv=$('rainCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   const bi=beatInfo(t);
   const cols=44,pool='アイウエオカキクケコサシスセソ01{}<>[];=+*#$λΣΦΨ∴';
   const ramp=1+seg(t,B(13),B(19))*1.6;
   for(let i=0;i<cols;i++){
     const r=mulberry32(i*7+13);
     const x=i*(W/cols)+r()*20;
     const speed=(14+r()*22)*60*ramp;
     const len=10+Math.floor(r()*22);
     const y0=((t*speed + r()*4000)%(H+len*26))-len*26;
     for(let j=0;j<len;j++){
       const y=y0-j*26;
       if(y<-30||y>H+30)continue;
       const ch=pool[Math.floor(mulberry32(i*31+j*7+Math.floor(t*8))()*pool.length)];
       const head=j===0;
       c.font=`${head?24:20}px JetMonoReg`;
       c.fillStyle=head?'#dffcff':(r()<0.1?PAL.mag:`rgba(0,229,255,${0.6*(1-j/len)})`);
       c.fillText(ch,x,y);
     }
   }
   const s1=slam(t,B(13),0.32),s2=slam(t,B(14),0.35);
   const big=$('rainT1');
   big.style.transform=`translateX(${(1-s1.k)*-160}px) skewX(${(1-s1.k)*-14}deg)`;
   big.style.opacity=s1.op;
   big.style.textShadow=`${-bi.pulse*10}px 0 rgba(255,45,120,.5), ${bi.pulse*10}px 0 rgba(0,229,255,.5)`;
   const mid=$('rainT2');
   mid.style.transform=`translateX(${(1-s2.k)*160}px)`;
   mid.style.opacity=s2.op;
   $('rainCjk').style.opacity=smooth(B(14.5),B(16),t);
   const cnt=$('rainCnt');
   const v=easeOutCubic(seg(t,B(13),B(19)))*15728441036;
   cnt.textContent=Math.floor(v).toLocaleString('en-US');
   // per-beat keyword escalation
   const KWS=[['BOOKS','#00e5ff'],['CODE','#b8ff2e'],['ART','#ffb62e'],['EVERYTHING','#ff2d78']];
   const kw=$('rainKw');
   const ki=bi.i-15;
   if(ki>=0&&ki<4){
     const ks=slam(t,B(15+ki),0.24);
     if(kw.dataset.k!==KWS[ki][0]){kw.dataset.k=KWS[ki][0];kw.textContent=KWS[ki][0];kw.style.color=KWS[ki][1];}
     kw.style.transform=`translateY(${(1-ks.k)*40}px) scale(${ks.scale})`;
     kw.style.opacity=ks.op*(ki===3?1:1-seg(t,B(16+ki),B(16+ki)+0.3));
   }else kw.style.opacity=0;
   const log=$('rainLog');
   const src=['> ingest("arxiv.*") … ok','> parse(human.history) … ok','> embed(culture.full) … ok','> distill(code.all) … ok','> compose(tomorrow) …'];
   const li=Math.floor((t-B(13))/0.45);
   log.textContent=src.slice(Math.max(0,li-6),li+1).join('\n');
   log.style.opacity=0.9;
 });
getScene('rain').bg=t=>({cx:0.5,cy:0.4,c1:'#051018',c2:'#030810',c3:'#010206',grid:true,gridSpeed:0.7,pmode:'burst',pi:0.8});

/* ---- S3 NEURAL MESH — 1.8T (v19→25) ---- */
scene('neural',B(19),B(25),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='netCv';
   mono('left:110px;top:24%;font-size:18px;color:#55688a;letter-spacing:3px;','TOPOLOGY // DEEP-MESH-7',div);
   const big=txt('left:110px;top:30%;font-size:130px;color:#fff;','',div);big.id='netBig';
   cjk('left:110px;top:47%;font-size:44px;color:#a78bfa;','万亿参数 · 编织成网',div).id='netCjk';
   mono('left:110px;top:57%;font-size:19px;color:#7ef9c6;','PARAMETERS // SYNAPTIC MESH',div).id='netSub';
   mono('right:110px;bottom:22%;font-size:17px;color:#55688a;text-align:right;line-height:2;','FLOPS 2.4×10²¹\nLAYERS 96\nLATENCY 3.1ms',div).id='netStats';
   mono('right:110px;top:24%;font-size:20px;color:#55688a;letter-spacing:2px;text-align:right;','',div).id='netLayer';
 },
 (div,t)=>{
   const cv=$('netCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   const bi=beatInfo(t);
   const rot=t*1.1;
   const L=5,nodesPer=[8,12,12,12,6];
   const proj=[];
   for(let l=0;l<L;l++){
     const n=nodesPer[l];
     for(let j=0;j<n;j++){
       const yy=(j/(n-1)-0.5)*1.5;
       const xx=(l/(L-1)-0.5)*2.0;
       const zz=Math.sin(j*1.7+l*2.3)*0.5;
       const xr=xx*Math.cos(rot)-zz*Math.sin(rot);
       const zr=xx*Math.sin(rot)+zz*Math.cos(rot);
       const z=0.9+zr*0.45;
       const sx=W*0.58+xr/z*W*0.36, sy=H*0.5+yy/z*H*0.4;
       proj.push({l,j,sx,sy,z});
     }
   }
   c.lineWidth=1;
   for(let l=0;l<L-1;l++){
     const a0=proj.filter(p=>p.l===l),a1=proj.filter(p=>p.l===l+1);
     for(const p of a0)for(const q of a1){
       const ax=(p.sx+q.sx)/2;
       const depth=(p.z+q.z)/2;
       const wave=Math.exp(-Math.pow(((bi.i%8)/8 + bi.phase*0.125 - l/(L-1))*6,2));
       const al=(0.09+0.4*wave)*(1.4-depth);
       c.strokeStyle=`rgba(167,139,250,${clamp(al,0,0.6)})`;
       c.beginPath();c.moveTo(p.sx,p.sy);c.quadraticCurveTo(ax,(p.sy+q.sy)/2-14,q.sx,q.sy);c.stroke();
     }
   }
   for(const p of proj){
     const wave=Math.exp(-Math.pow(((bi.i%8)/8 + bi.phase*0.125 - p.l/(L-1))*6,2));
     const r=(4.6+wave*8)*(1.6-p.z*0.5);
     c.fillStyle=`rgba(0,229,255,${0.35+0.6*wave})`;
     c.beginPath();c.arc(p.sx,p.sy,r,0,6.283);c.fill();
     c.fillStyle=`rgba(255,255,255,${0.9*wave})`;
     c.beginPath();c.arc(p.sx,p.sy,r*0.35,0,6.283);c.fill();
   }
   // counter rolls up to 1.8T
   const roll=easeOutCubic(seg(t,B(19),B(23)));
   const s=slam(t,B(19),0.35);
   const big=$('netBig');
   big.textContent=(roll*1.8).toFixed(2)+'T';
   big.style.transform=`scale(${s.scale})`; big.style.transformOrigin='left center';
   big.style.opacity=s.op;
   big.style.textShadow=`${-bi.pulse*8}px 0 rgba(255,45,120,.5),${bi.pulse*8}px 0 rgba(0,229,255,.5)`;
   $('netCjk').style.opacity=smooth(B(20),B(21),t);
   $('netSub').style.opacity=smooth(B(21),B(22),t);
   $('netStats').style.opacity=smooth(B(22),B(24),t);
   $('netLayer').textContent=`LAYER ${String(Math.min(96,1+Math.floor(seg(t,B(19),B(25))*96))).padStart(2,'0')} / 96`;
 });
getScene('neural').bg=t=>({cx:0.55,cy:0.5,c1:'#0a0820',c2:'#05040f',c3:'#020108',grid:true,gridSpeed:0.4,pmode:'ambient',pi:0.7});

/* ---- S4 TRI-SLAM w/ VOICE (v25→31) ---- */
const SLAMS=[
 {v:25,en:'IT SEES',cn:'它 看 见',glyph:'eye',col:PAL.cyan},
 {v:27,en:'IT WRITES',cn:'它 书 写',glyph:'pen',col:PAL.mag},
 {v:29,en:'IT CREATES',cn:'它 创 造',glyph:'spark',col:PAL.lime},
];
scene('slams',B(25),B(31),
 div=>{
   el('canvas','position:absolute;inset:0;',div).id='slamCv';
   const w=el('div','position:absolute;inset:0;',div);w.id='slamWrap';
   const g=el('canvas','position:absolute;left:200px;top:50%;transform:translateY(-50%);width:380px;height:380px;',w);g.id='slamGlyph';g.width=380;g.height=380;
   txt('left:640px;top:38%;font-size:210px;color:#fff;','',w).id='slamEn';
   cjk('left:640px;top:60%;font-size:74px;','',w).id='slamCn';
   mono('left:640px;top:74%;font-size:20px;color:#55688a;letter-spacing:3px;','',w).id='slamSeq';
 },
 (div,t)=>{
   const w=$('slamWrap');
   const bi=beatInfo(t);
   const active=[...SLAMS].reverse().find(s=>bi.i>=s.v)||SLAMS[0];
   const t0=B(active.v),t1=B(active.v+2);
   const s=slam(t,t0,0.26);
   const r=mulberry32(Math.floor(t*60));
   const jit=bi.pulse*8;
   const en=$('slamEn'),cn=$('slamCn'),sq=$('slamSeq');
   if(en.dataset.k!==active.en){en.dataset.k=active.en;en.textContent=active.en;cn.textContent=active.cn;cn.style.color=active.col;sq.textContent=`CAPABILITY :: ${active.en.split(' ')[1]} // VOICE.ON`;}
   en.style.transform=`scale(${s.scale+bi.pulse*0.02}) translate(${(r()-0.5)*jit}px,${(r()-0.5)*jit*0.5}px)`;
   en.style.transformOrigin='left center';
   en.style.opacity=s.op;
   en.style.textShadow=`${-(s.k<1?(1-s.k)*24+bi.pulse*6:bi.pulse*6)}px 0 rgba(255,45,120,.55), ${(s.k<1?(1-s.k)*24+bi.pulse*6:bi.pulse*6)}px 0 rgba(0,229,255,.55)`;
   cn.style.opacity=smooth(t0+0.12,t0+0.4,t);
   sq.style.opacity=smooth(t0+0.2,t0+0.5,t);
   const g=$('slamGlyph').getContext('2d');g.clearRect(0,0,380,380);
   g.strokeStyle=active.col;g.lineWidth=7;g.lineCap='round';
   const gi=slam(t,t0,0.3).k;
   g.save();g.translate(190,190);g.scale(gi,gi);g.rotate((1-gi)*-0.3);
   if(active.glyph==='eye'){
     g.beginPath();g.ellipse(0,0,140,80,0,0,6.283);g.stroke();
     g.beginPath();g.arc(0,0,52,0,6.283);g.stroke();
     g.fillStyle=active.col;g.beginPath();g.arc(0,0,24,0,6.283);g.fill();
     for(let a=0;a<4;a++){g.globalAlpha=0.5;g.beginPath();g.arc(0,0,110+a*22,-0.6+a*0.4,-0.4+a*0.4);g.stroke();}
   }else if(active.glyph==='pen'){
     g.beginPath();g.moveTo(-120,110);g.lineTo(60,-120);g.lineTo(120,-60);g.lineTo(-60,110);g.closePath();g.stroke();
     g.beginPath();g.moveTo(-120,110);g.lineTo(-150,140);g.stroke();
     for(let i=0;i<4;i++){g.globalAlpha=0.4+i*0.15;g.beginPath();g.moveTo(-140,-80+i*40);g.lineTo(-40+i*18,-80+i*40);g.stroke();}
   }else{
     for(let a=0;a<8;a++){g.save();g.rotate(a*Math.PI/4);g.beginPath();g.moveTo(0,-50);g.lineTo(0,-150);g.lineWidth=5+((a%2)*4);g.stroke();g.restore();}
     g.beginPath();g.arc(0,0,44,0,6.283);g.stroke();
     g.fillStyle=active.col;g.beginPath();g.arc(0,0,18,0,6.283);g.fill();
   }
   g.restore();
   const cv=$('slamCv');if(cv.width!==W){cv.width=W;cv.height=H;}
   const c=cv.getContext('2d');c.clearRect(0,0,W,H);
   c.globalAlpha=1;c.fillStyle=active.col;c.fillRect(140,H*0.28,10,H*0.44);
   // segment progress ticks under the bar
   for(let i=0;i<3;i++){c.globalAlpha=SLAMS[i].v<=bi.i?0.9:0.25;c.fillStyle=SLAMS[i].col;c.fillRect(140+ i*26,H*0.28-30,18,8);}
   c.globalAlpha=1;c.font='17px JetMonoReg';c.fillStyle='#33415e';
   c.fillText(`FR_${String(bi.i).padStart(3,'0')}`,1500,980);
 });
getScene('slams').bg=t=>({cx:0.35,cy:0.5,c1:'#0a0e1c',c2:'#05070f',c3:'#020307',grid:true,gridSpeed:0.6,pmode:'ambient',pi:0.6});

/* ---- S5 QUESTION — the vacuum (v31→38) ---- */
scene('question',B(31),B(38),
 div=>{
   el('div','position:absolute;inset:0;',div).id='qInner';
   const w=$('qInner');
   cjk('left:50%;top:40%;font-family:NotoSerifBlack;font-size:120px;color:#eaf6ff;','',w).id='qCjk';
   mono('left:50%;top:58%;font-size:26px;color:#55688a;letter-spacing:8px;','WILL IT REPLACE US ?',w).id='qEn';
   const bar=el('div','position:absolute;left:50%;top:72%;width:760px;transform:translateX(-50%);',w);
   mono('font-size:17px;color:#3b4a63;letter-spacing:2px;','AUTOMATION INDEX',bar);
   el('div','height:8px;background:#0c1322;margin-top:10px;border:1px solid #16233a;',bar).innerHTML='<div id="qFill" style="height:100%;width:0%;background:linear-gradient(90deg,#00e5ff,#ff2d78);box-shadow:0 0 18px rgba(255,45,120,.5)"></div>';
   mono('font-size:15px;color:#3b4a63;margin-top:8px;','',bar).id='qPct';
   mono('left:50%;top:30%;font-size:17px;color:#33415e;letter-spacing:3px;','/// SEQUENCE 05 — THE QUESTION',w).id='qSeq';
 },
 (div,t)=>{
   const w=$('qInner');
   const k=smooth(B(31),B(31)+0.8,t);
   const bi=beatInfo(t);
   const q=$('qCjk');
   const full='它会取代我们吗？';
   const n=Math.min(full.length,Math.floor(seg(t,B(31)+0.4,B(34.5))*full.length));
   q.textContent=full.slice(0,n)+(n<full.length?'▏':'');
   q.style.transform=`translate(-50%,-50%) scale(${0.94+0.06*k})`;
   q.style.opacity=k;
   $('qEn').style.opacity=smooth(B(35),B(37),t);
   $('qSeq').style.opacity=smooth(B(31.5),B(33),t);
   const pct=easeInOut(seg(t,B(33),B(37.8)))*47;
   const f=$('qFill');if(f)f.style.width=pct+'%';
   const p=$('qPct');if(p)p.textContent=`${pct.toFixed(1)}% ${pct>40?'▲ RISING':'computing…'}`;
   w.style.filter=`saturate(${0.55+bi.pulse*0.3}) brightness(${0.8+0.2*k})`;
 });
getScene('question').bg=t=>({cx:0.5,cy:0.45,c1:'#05070d',c2:'#03040a',c3:'#010203',grid:true,gridSpeed:0.1,pmode:'sparse',pi:0.35});

/* ---- S6 AMPLIFY (v38→44) ---- */
scene('amplify',B(38),B(44),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='ampWrap';
   const cL=el('div','position:absolute;left:50%;top:50%;width:520px;height:520px;border-radius:50%;border:2px solid #00e5ff;background:rgba(0,229,255,.06);mix-blend-mode:screen;box-shadow:0 0 90px rgba(0,229,255,.25) inset, 0 0 60px rgba(0,229,255,.15);',w);cL.id='ampL';
   const cR=el('div','position:absolute;left:50%;top:50%;width:520px;height:520px;border-radius:50%;border:2px solid #ff2d78;background:rgba(255,45,120,.06);mix-blend-mode:screen;box-shadow:0 0 90px rgba(255,45,120,.25) inset, 0 0 60px rgba(255,45,120,.15);',w);cR.id='ampR';
   mono('left:33%;top:24%;font-size:26px;color:#00e5ff;letter-spacing:6px;','HUMAN',w).id='ampLt';
   mono('right:33%;top:24%;font-size:26px;color:#ff2d78;letter-spacing:6px;','MACHINE',w).id='ampRt';
   txt('left:50%;top:50%;font-size:150px;color:#fff;','AMPLIFY',w).id='ampBig';
   cjk('left:50%;top:66%;font-size:52px;color:#fff;','放 大 我 们',w).id='ampCjk';
   mono('left:50%;top:78%;font-size:18px;color:#55688a;letter-spacing:4px;','NOT REPLACE — HUMAN × MACHINE',w).id='ampSeq';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const k=easeInOut(seg(t,B(38),B(41)));
   const d=lerp(560,120,k);
   $('ampL').style.transform=`translate(calc(-50% - ${d}px),-50%)`;
   $('ampR').style.transform=`translate(calc(-50% + ${d}px),-50%)`;
   const s=slam(t,B(41),0.35);
   const big=$('ampBig');
   big.style.transform=`translate(-50%,-50%) scale(${s.scale+bi.pulse*0.03})`;
   big.style.opacity=s.op;
   big.style.textShadow=`${-bi.pulse*9}px 0 rgba(0,229,255,.5), ${bi.pulse*9}px 0 rgba(255,45,120,.5)`;
   $('ampCjk').style.opacity=smooth(B(41.5),B(42.5),t);
   $('ampSeq').style.opacity=smooth(B(42),B(43.5),t);
   $('ampLt').style.opacity=smooth(B(38),B(39),t);
   $('ampRt').style.opacity=smooth(B(38),B(39),t);
 });
getScene('amplify').bg=t=>({cx:0.5,cy:0.5,c1:'#070b16',c2:'#04060d',c3:'#010204',grid:true,gridSpeed:0.25,pmode:'ambient',pi:0.5});

/* ---- S7 BUILD + COUNTDOWN (v44→56) ---- */
scene('build',B(44),B(56),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='buildWrap';
   mono('left:50%;top:26%;font-size:19px;color:#55688a;letter-spacing:5px;','/// SEQUENCE 07 — IGNITION SEQUENCE',w);
   el('div','position:absolute;left:60px;bottom:120px;width:14px;background:#0c1322;border:1px solid #16233a;',w).id='barL';
   el('div','position:absolute;right:60px;bottom:120px;width:14px;background:#0c1322;border:1px solid #16233a;',w).id='barR';
   const rows=el('div','position:absolute;left:50%;top:38%;transform:translate(-50%,0);width:1100px;',w);rows.id='buildRows';
   [['MODELS DEPLOYED','b1',3071991],['IMAGES / SEC','b2',48211],['PAPERS / DAY','b3',412],['CITIES ONLINE','b4',3119]].forEach(([label,id],i)=>{
     const row=el('div','display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #101a2e;padding:14px 4px;',rows);
     mono('font-size:20px;color:#3b4a63;letter-spacing:2px;',label,row);
     mono('font-family:JetMono;font-size:44px;color:#eaf6ff;','',row).id=id;
   });
   txt('left:50%;top:62%;font-size:340px;color:#fff;','',w).id='countNum';
   mono('left:50%;top:88%;font-size:22px;color:#ff2d78;letter-spacing:8px;','SYSTEM GO',w).id='goTag';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const prog=seg(t,B(44),B(52));
   const acc=Math.pow(prog,1.7);
   const rr=mulberry32(Math.floor(t*30));
   const w=$('buildWrap');
   w.style.transform=`translate(${(rr()-0.5)*acc*18}px,${(rr()-0.5)*acc*10}px)`;
   w.style.filter=`brightness(${1+acc*0.5+bi.pulse*0.4})`;
   const rows=$('buildRows');
   rows.style.opacity=clamp(1-seg(t,B(50),B(52)),0,1);
   const bh=Math.floor(acc*560);
   for(const id of ['barL','barR']){const b=$(id);b.style.height=bh+'px';b.innerHTML=`<div style="position:absolute;left:0;right:0;top:0;height:${bh}px;background:linear-gradient(0deg,#00e5ff,#ff2d78);box-shadow:0 0 16px rgba(0,229,255,.5)"></div>`;}
   $('b1').textContent=Math.floor(acc*3071991).toLocaleString();
   $('b2').textContent=Math.floor(acc*48211).toLocaleString();
   $('b3').textContent=Math.floor(acc*412).toLocaleString();
   $('b4').textContent=Math.floor(acc*3119).toLocaleString();
   const cn=$('countNum'),gt=$('goTag');
   if(t>=B(52)){
     const labels={52:'3',53:'2',54:'1',55:'→'};
     cn.textContent=labels[bi.i]||'';
     const s=slam(t,B(bi.i),0.22);
     cn.style.transform=`translate(-50%,-50%) scale(${s.scale})`;
     cn.style.opacity=s.op;
     cn.style.color=bi.i===55?PAL.lime:'#fff';
     gt.style.opacity=1;gt.style.color=bi.i===55?PAL.lime:'#ff2d78';
   }else{cn.textContent='';gt.style.opacity=0;}
 });
getScene('build').bg=t=>({cx:0.5,cy:0.55,c1:'#0a0c18',c2:'#05060f',c3:'#010204',grid:true,gridSpeed:1.4,pmode:'warp',pi:1});

/* ---- S7b BLACKOUT (v56→58) ---- */
scene('blackout',B(56),B(58),
 div=>{el('div','position:absolute;left:50%;top:50%;width:0;height:2px;background:#fff;',div).id='blkLine';},
 (div,t)=>{
   const k=seg(t,B(56),B(58));
   const l=$('blkLine');
   l.style.width=`${(1-easeInOut(k))*W*0.4+4}px`;
   l.style.transform='translateX(-50%)';
   l.style.boxShadow='0 0 40px rgba(0,229,255,.8)';
   l.style.background='#00e5ff';
   l.style.opacity=1-k*0.6;
 });
getScene('blackout').bg=t=>({cx:0.5,cy:0.5,c1:'#000',c2:'#000',c3:'#000',grid:false,pmode:'sparse',pi:0});

/* ---- S8 MONTAGE — escalation (v58→74, 16 cards, 1 per beat) ---- */
const CARDS=[
 ['HEALS','治 愈',PAL.cyan,'✚'],
 ['TEACHES','教 导',PAL.cyan,'✎'],
 ['FEEDS','喂 养',PAL.cyan,'◈'],
 ['DRIVES','驾 驶',PAL.cyan,'▶'],
 ['WRITES','书 写',PAL.lime,'✎'],
 ['PAINTS','作 画',PAL.lime,'◐'],
 ['COMPOSES','作 曲',PAL.lime,'♪'],
 ['TRADES','交 易',PAL.amber,'$'],
 ['WATCHES','注 视',PAL.mag,'◉'],
 ['PROFILES','画 像',PAL.mag,'◎'],
 ['PREDICTS','预 测',PAL.mag,'≋'],
 ['JUDGES','评 判',PAL.mag,'⚖'],
 ['DECIDES','决 定',PAL.mag,'▲'],
 ['EVERYWHERE','无 处 不 在',PAL.wht,'✳'],
 ['EVERYONE','所 有 人',PAL.wht,'●'],
 ['YOU ?','你 ?','#ff3355','?'],
];
scene('montage',B(58),B(74),
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='mWrap';
   el('div','position:absolute;left:0;right:0;top:0;bottom:0;',w).id='mStrobe';
   txt('left:50%;top:42%;font-size:300px;color:#fff;','',w).id='mEn';
   cjk('left:50%;top:64%;font-size:100px;color:#fff;','',w).id='mCn';
   mono('left:50%;top:82%;font-size:22px;color:#fff;letter-spacing:6px;','',w).id='mTag';
   txt('left:50%;top:38%;font-size:340px;','',w).id='mGlyph';
 },
 (div,t)=>{
   const bi=beatInfo(t);
   const w=$('mWrap'),st=$('mStrobe');
   const rel=clamp(bi.i-58,0,15);
   const rr=mulberry32(Math.floor(t*90));
   const inv=rel%2===1;
   st.style.background=inv?'#eaf6ff':'transparent';
   const card=CARDS[rel];
   const showGlyph=rel%2===1;
   const en=$('mEn'),cn=$('mCn'),gl=$('mGlyph'),tag=$('mTag');
   const s=slam(t,B(bi.i),0.2);
   if(en.dataset.k!==card[0]+showGlyph){
     en.dataset.k=card[0]+showGlyph;
     en.textContent=card[0];
     en.style.fontSize=card[0].length>7?'230px':'300px';
     cn.textContent=card[1];
     gl.textContent=showGlyph?card[3]:'';
     tag.textContent=`AI × ${card[0]} :: ${String(rel+1).padStart(2,'0')}/16`;
   }
   const jit=bi.pulse*16;
   const jx=(rr()-0.5)*jit,jy=(rr()-0.5)*jit*0.6;
   en.style.transform=`translate(-50%,-50%) scale(${s.scale+bi.pulse*0.04}) rotate(${(rr()-0.5)*jit*0.4}deg) translate(${jx}px,${jy}px)`;
   en.style.opacity=showGlyph?0.10:s.op;
   en.style.color=inv?'#000':card[2];
   en.style.textShadow=inv?`${-jx*0.5}px 0 rgba(255,45,120,.7), ${jx*0.5}px 0 rgba(0,229,255,.7)`:`${-jit*0.8}px 0 rgba(255,45,120,.6), ${jit*0.8}px 0 rgba(0,229,255,.6)`;
   gl.style.transform=`translate(-50%,-50%) scale(${s.scale}) rotate(${s.k<1?(1-s.k)*30:0}deg)`;
   st.style.boxShadow=inv?'none':`inset 0 0 0 4px ${card[2]}`;
   gl.style.opacity=showGlyph?s.op:0;
   gl.style.color=inv?'#000':card[2];
   cn.style.transform=`translate(-50%,-50%) scale(${0.9+0.1*s.k})`;
   cn.style.opacity=s.op;
   cn.style.color=inv?'#000':'#fff';
   tag.style.opacity=0.8;tag.style.color=inv?'#000':'#55688a';
   w.style.filter=`contrast(1.15) brightness(${1+bi.pulse*0.55})`;
   w.style.transform=`scale(${1+bi.pulse*0.015})`;
 });
getScene('montage').bg=t=>({cx:0.5,cy:0.5,c1:'#0e0f1e',c2:'#070812',c3:'#030308',grid:true,gridSpeed:1.8,pmode:'burst',pi:1});

/* ---- S9 STATEMENT (v74→78) ---- */
scene('statement',B(74),B(78),
 div=>{
   const w=el('div','position:absolute;inset:0;background:#eaf6ff;',div);w.id='stmtBg';
   mono('left:50%;top:30%;font-size:34px;color:#0a0e18;letter-spacing:4px;','NOT HUMAN. NOT MACHINE.',w).id='stEn';
   cjk('left:50%;top:46%;font-family:NotoSerifBlack;font-size:190px;color:#04060c;','人机共生',w).id='stCjk';
   mono('left:50%;top:72%;font-size:20px;color:#33415e;letter-spacing:6px;','BOTH. — SYMBIOSIS // 共生',w).id='stSub';
   el('div','position:absolute;left:50%;top:82%;width:1px;height:60px;background:#04060c;',w).id='stRule';
 },
 (div,t)=>{
   const w=$('stmtBg');
   const bi=beatInfo(t);
   const s=slam(t,B(74),0.35);
   const cj=$('stCjk');
   cj.style.transform=`translate(-50%,-50%) scale(${s.scale})`;
   cj.style.opacity=s.op;
   $('stEn').style.opacity=smooth(B(74)+0.15,B(75.5),t);
   $('stSub').style.opacity=smooth(B(76),B(77.5),t);
   $('stRule').style.opacity=smooth(B(76.5),B(77.8),t);
   w.style.transform=`scale(${1+seg(t,B(74),B(78))*0.03})`;
   w.style.filter=`brightness(${1+bi.pulse*0.12})`;
 });
getScene('statement').bg=t=>({cx:0.5,cy:0.5,c1:'#eaf6ff',c2:'#dfeaf5',c3:'#c8d6e6',grid:false,pmode:'sparse',pi:0.15});

/* ---- S10 END CARD (v78→86) ---- */
scene('end',B(78),B(86)+0.5,
 div=>{
   const w=el('div','position:absolute;inset:0;',div);w.id='endWrap';
   const mark=el('div','position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);width:170px;height:170px;border:2px solid #00e5ff;border-radius:32px;box-shadow:0 0 60px rgba(0,229,255,.3), inset 0 0 40px rgba(0,229,255,.12);display:flex;align-items:center;justify-content:center;font-family:JetMono;font-size:44px;color:#00e5ff;',w);mark.id='endMark';
   mark.innerHTML='<span>AI://</span>';
   txt('left:50%;top:56%;font-family:ArchivoBlack;font-size:56px;color:#fff;letter-spacing:.14em;','INTELLIGENCE IS THE NEW ELECTRICITY',w).id='endEn';
   cjk('left:50%;top:66%;font-size:34px;color:#a78bfa;letter-spacing:.5em;','智 能 即 电 力',w).id='endCjk';
   mono('left:50%;top:78%;font-size:16px;color:#33415e;letter-spacing:3px;','129 BPM · FRAME-LOCKED SYNC · GENERATED BY CODE',w).id='endTag';
   el('div','position:absolute;left:50%;top:52%;width:340px;height:1px;background:linear-gradient(90deg,transparent,#00e5ff,transparent);',w).id='endRule';
 },
 (div,t)=>{
   const k=smooth(B(78),B(79.5),t);
   const w=$('endWrap');
   w.style.opacity=k*(1-seg(t,B(84.2),B(86)+0.3));
   const m=$('endMark');
   const bi=beatInfo(t);
   m.style.transform=`translate(-50%,-50%) rotate(${45+seg(t,B(78),B(82))*135}deg) scale(${0.6+0.4*easeOutBack(k)})`;
   m.style.opacity=k;
   m.querySelector('span').style.transform=`rotate(${-(45+seg(t,B(78),B(82))*135)}deg)`;
   $('endEn').style.opacity=smooth(B(79),B(80.5),t);
   $('endEn').style.transform=`translate(-50%,-50%) scale(${0.96+0.04*smooth(B(79),B(82),t)})`;
   $('endCjk').style.opacity=smooth(B(81),B(82.5),t);
   $('endTag').style.opacity=smooth(B(82),B(84),t);
   $('endRule').style.opacity=k;
   w.style.filter=`brightness(${1+bi.pulse*0.15})`;
 });
getScene('end').bg=t=>({cx:0.5,cy:0.5,c1:'#05070d',c2:'#030409',c3:'#010203',grid:true,gridSpeed:0.12,pmode:'sparse',pi:0.3});
```

### 10/14 · `timeline.js`
<!-- casebook-file {"path": "timeline.js", "lines": 1, "final_newline": false, "sha256": "874a936468b56a33d8eafa5008a0a60e85e09b3f0c051f1d7f6a77730d9e8b49", "original_sha256": "874a936468b56a33d8eafa5008a0a60e85e09b3f0c051f1d7f6a77730d9e8b49"} -->
```js
const TL={"bpm": 129.2, "beat0": 12.956734693877552, "interval": 0.46439909297052395, "beats": [12.956734693877552, 13.421133786848072, 13.885532879818594, 14.349931972789115, 14.79111111111111, 15.255510204081633, 15.719909297052155, 16.184308390022675, 16.648707482993196, 17.11310657596372, 17.554285714285715, 18.018684807256236, 18.483083900226756, 18.94748299319728, 19.4118820861678, 19.87628117913832, 20.340680272108845, 20.805079365079365, 21.24625850340136, 21.71065759637188, 22.175056689342405, 22.639455782312925, 23.103854875283446, 23.56825396825397, 24.03265306122449, 24.49705215419501, 24.938231292517006, 25.402630385487527, 25.86702947845805, 26.33142857142857, 26.79582766439909, 27.260226757369615, 27.724625850340136, 28.189024943310656, 28.65342403628118, 29.1178231292517, 29.58222222222222, 30.023401360544216, 30.48780045351474, 30.95219954648526, 31.41659863945578, 31.880997732426305, 32.3221768707483, 32.78657596371882, 33.25097505668934, 33.715374149659866, 34.17977324263038, 34.644172335600906, 35.10857142857143, 35.57297052154195, 36.03736961451247, 36.501768707482995, 36.96616780045351, 37.430566893424036, 37.871746031746035, 38.33614512471655, 38.800544217687076, 39.2649433106576, 39.70612244897959, 40.170521541950116, 40.63492063492063, 41.09931972789116, 41.56371882086168, 42.0281179138322, 42.49251700680272, 42.956916099773245, 43.42131519274376, 43.885714285714286, 44.35011337868481, 44.81451247165533, 45.255691609977326, 45.72009070294784, 46.18448979591837, 46.64888888888889, 47.11328798185941, 47.57768707482993, 48.042086167800456, 48.50648526077097, 48.94766439909297, 49.412063492063496, 49.87646258503401, 50.340861678004536, 50.80526077097505, 51.26965986394558, 51.7340589569161, 52.19845804988662, 52.63963718820862, 53.10403628117914, 53.56843537414966, 54.03283446712018, 54.497233560090706, 54.96163265306122, 55.42603174603175, 55.89043083900227, 56.33160997732426, 56.79600907029479, 57.2604081632653, 57.72480725623583, 58.18920634920635, 58.65360544217687, 59.11800453514739, 59.582403628117916, 60.02358276643991, 60.48798185941043, 60.95238095238095, 61.41678004535147, 61.881179138322, 62.345578231292514, 62.80997732426304, 63.27437641723356, 63.715555555555554, 64.17995464852608, 64.6443537414966, 65.10875283446713, 65.57315192743764, 66.03755102040816, 66.50195011337868, 66.96634920634921, 67.4075283446712, 67.87192743764173, 68.33632653061224, 68.80072562358276, 69.26512471655329, 69.72952380952381, 70.19392290249434, 70.65832199546485, 71.09950113378684, 71.56390022675737, 72.02829931972789, 72.49269841269842, 72.95709750566894, 73.42149659863945, 73.88589569160997, 74.3502947845805, 74.7914739229025, 75.25587301587302, 75.72027210884353, 76.18467120181406, 76.64907029478458, 77.1134693877551, 77.57786848072563, 78.04226757369615, 78.48344671201814, 78.94784580498866, 79.41224489795918, 79.87664399092971, 80.34104308390023, 80.80544217687074, 81.26984126984127, 81.73424036281179, 82.17541950113379, 82.63981859410431, 83.10421768707484, 83.56861678004535, 84.03301587301587, 84.4974149659864, 84.96181405895692, 85.42621315192744, 85.86739229024943, 86.33179138321995, 86.79619047619047, 87.28380952380952, 87.72498866213152, 88.18938775510205, 88.65378684807256, 89.11818594104308, 89.55936507936508, 90.0237641723356, 90.48816326530613, 90.95256235827664, 91.41696145124716, 91.88136054421769, 92.34575963718821, 92.81015873015873, 93.25133786848073, 93.71573696145124, 94.18013605442177, 94.66775510204081, 95.10893424036281, 95.57333333333334, 96.03773242630386, 96.50213151927437, 96.9665306122449, 97.43092970521542, 97.89532879818594, 98.33650793650794, 98.80090702947845, 99.26530612244898, 99.7297052154195, 100.19410430839002, 100.65850340136055], "energy": [0.043427612632513046, 0.0423445962369442, 0.0586673878133297, 0.059584181755781174, 0.2152101844549179, 0.2096073031425476, 0.05891270190477371, 0.10244345664978027, 0.2127951979637146, 0.1793770045042038, 0.09758532792329788, 0.22961868345737457, 0.22669066488742828, 0.22478602826595306, 0.14616209268569946, 0.05550312250852585, 0.22497478127479553, 0.22636474668979645, 0.19289661943912506, 0.21078349649906158, 0.21564987301826477, 0.2096121609210968, 0.05930235609412193, 0.10183960944414139, 0.2130940705537796, 0.18332841992378235, 0.09498763084411621, 0.23009704053401947, 0.22781451046466827, 0.22447219491004944, 0.14459624886512756, 0.05517929419875145, 0.22483693063259125, 0.22647367417812347, 0.19463804364204407, 0.2123059332370758, 0.15407797694206238, 0.05158068612217903, 0.04718174785375595, 0.10132309049367905, 0.21397288143634796, 0.178867369890213, 0.08990541845560074, 0.22921350598335266, 0.2252693474292755, 0.2273758053779602, 0.14162500202655792, 0.05537665635347366, 0.22428138554096222, 0.22217974066734314, 0.19174101948738098, 0.21290835738182068, 0.21236498653888702, 0.2104651927947998, 0.04908448085188866, 0.1004825159907341, 0.2135724276304245, 0.17937374114990234, 0.08862323313951492, 0.22949694097042084, 0.22487641870975494, 0.22709232568740845, 0.141376793384552, 0.055147964507341385, 0.2240367978811264, 0.22172945737838745, 0.1910076141357422, 0.2129511535167694, 0.1001504510641098, 0.11686646193265915, 0.05170029401779175, 0.09261614829301834, 0.1124112606048584, 0.09287779033184052, 0.0582275316119194, 0.16067872941493988, 0.10837333649396896, 0.12209693342447281, 0.051599543541669846, 0.030355434864759445, 0.10332667827606201, 0.09724855422973633, 0.115370973944664, 0.11939752846956253, 0.10332406312227249, 0.1171635091304779, 0.05077847093343735, 0.09210293740034103, 0.10698676109313965, 0.09317897260189056, 0.054406605660915375, 0.15779505670070648, 0.10990584641695023, 0.11289357393980026, 0.05035712197422981, 0.03666942939162254, 0.1126258373260498, 0.10066176950931549, 0.1158653050661087, 0.12039010226726532, 0.019122077152132988, 0.0077112941071391106, 0.03950068727135658, 0.08725433796644211, 0.10090760141611099, 0.08569561690092087, 0.04096734896302223, 0.1570490300655365, 0.11309455335140228, 0.10361139476299286, 0.04050690308213234, 0.024851979687809944, 0.09698665887117386, 0.0944787785410881, 0.10561300814151764, 0.11613218486309052, 0.09824343025684357, 0.10343511402606964, 0.039781514555215836, 0.0883537232875824, 0.09965693950653076, 0.08632964640855789, 0.04142504930496216, 0.15976759791374207, 0.11326615512371063, 0.10234814137220383, 0.040636129677295685, 0.024639222770929337, 0.10542906075716019, 0.10767032206058502, 0.047053735703229904, 0.053074125200510025, 0.2138843834400177, 0.21024706959724426, 0.06184392794966698, 0.09752634912729263, 0.21215540170669556, 0.18339289724826813, 0.09960229694843292, 0.2240835726261139, 0.2270616888999939, 0.2241613119840622, 0.1461528241634369, 0.05851896107196808, 0.22309139370918274, 0.22428347170352936, 0.19305624067783356, 0.21106001734733582, 0.21514545381069183, 0.21057440340518951, 0.06488978117704391, 0.09921768307685852, 0.2124689668416977, 0.1836145520210266, 0.09884330630302429, 0.22391900420188904, 0.22599956393241882, 0.22537994384765625, 0.14574162662029266, 0.05932823568582535, 0.22324244678020477, 0.2232244908809662, 0.1934278905391693, 0.21139174699783325, 0.15527965128421783, 0.05283856391906738, 0.050423476845026016, 0.08585517108440399, 0.174602210521698, 0.13800403475761414, 0.06153591722249985, 0.1422715038061142, 0.13034579157829285, 0.11945068836212158, 0.06974796950817108, 0.027818478643894196, 0.09114232659339905, 0.08091199398040771, 0.06365379691123962, 0.0640258938074112, 0.058153536170721054, 0.052040159702301025, 0.009653747081756592, 0.0221397802233696, 0.03798244893550873, 0.02888478897511959, 0.012350659817457199, 0.027318255975842476, 0.023663321509957314, 0.020353257656097412, 0.0105588398873806]};
```

### 11/14 · `timeline.json`
<!-- casebook-file {"path": "timeline.json", "lines": 1, "final_newline": false, "sha256": "45ae41877b58e89ec4357ef2653113527b8451c65b9eb733ad3893a3dba1e85d", "original_sha256": "45ae41877b58e89ec4357ef2653113527b8451c65b9eb733ad3893a3dba1e85d"} -->
```json
{"bpm": 129.2, "beat0": 12.956734693877552, "interval": 0.46439909297052395, "beats": [12.956734693877552, 13.421133786848072, 13.885532879818594, 14.349931972789115, 14.79111111111111, 15.255510204081633, 15.719909297052155, 16.184308390022675, 16.648707482993196, 17.11310657596372, 17.554285714285715, 18.018684807256236, 18.483083900226756, 18.94748299319728, 19.4118820861678, 19.87628117913832, 20.340680272108845, 20.805079365079365, 21.24625850340136, 21.71065759637188, 22.175056689342405, 22.639455782312925, 23.103854875283446, 23.56825396825397, 24.03265306122449, 24.49705215419501, 24.938231292517006, 25.402630385487527, 25.86702947845805, 26.33142857142857, 26.79582766439909, 27.260226757369615, 27.724625850340136, 28.189024943310656, 28.65342403628118, 29.1178231292517, 29.58222222222222, 30.023401360544216, 30.48780045351474, 30.95219954648526, 31.41659863945578, 31.880997732426305, 32.3221768707483, 32.78657596371882, 33.25097505668934, 33.715374149659866, 34.17977324263038, 34.644172335600906, 35.10857142857143, 35.57297052154195, 36.03736961451247, 36.501768707482995, 36.96616780045351, 37.430566893424036, 37.871746031746035, 38.33614512471655, 38.800544217687076, 39.2649433106576, 39.70612244897959, 40.170521541950116, 40.63492063492063, 41.09931972789116, 41.56371882086168, 42.0281179138322, 42.49251700680272, 42.956916099773245, 43.42131519274376, 43.885714285714286, 44.35011337868481, 44.81451247165533, 45.255691609977326, 45.72009070294784, 46.18448979591837, 46.64888888888889, 47.11328798185941, 47.57768707482993, 48.042086167800456, 48.50648526077097, 48.94766439909297, 49.412063492063496, 49.87646258503401, 50.340861678004536, 50.80526077097505, 51.26965986394558, 51.7340589569161, 52.19845804988662, 52.63963718820862, 53.10403628117914, 53.56843537414966, 54.03283446712018, 54.497233560090706, 54.96163265306122, 55.42603174603175, 55.89043083900227, 56.33160997732426, 56.79600907029479, 57.2604081632653, 57.72480725623583, 58.18920634920635, 58.65360544217687, 59.11800453514739, 59.582403628117916, 60.02358276643991, 60.48798185941043, 60.95238095238095, 61.41678004535147, 61.881179138322, 62.345578231292514, 62.80997732426304, 63.27437641723356, 63.715555555555554, 64.17995464852608, 64.6443537414966, 65.10875283446713, 65.57315192743764, 66.03755102040816, 66.50195011337868, 66.96634920634921, 67.4075283446712, 67.87192743764173, 68.33632653061224, 68.80072562358276, 69.26512471655329, 69.72952380952381, 70.19392290249434, 70.65832199546485, 71.09950113378684, 71.56390022675737, 72.02829931972789, 72.49269841269842, 72.95709750566894, 73.42149659863945, 73.88589569160997, 74.3502947845805, 74.7914739229025, 75.25587301587302, 75.72027210884353, 76.18467120181406, 76.64907029478458, 77.1134693877551, 77.57786848072563, 78.04226757369615, 78.48344671201814, 78.94784580498866, 79.41224489795918, 79.87664399092971, 80.34104308390023, 80.80544217687074, 81.26984126984127, 81.73424036281179, 82.17541950113379, 82.63981859410431, 83.10421768707484, 83.56861678004535, 84.03301587301587, 84.4974149659864, 84.96181405895692, 85.42621315192744, 85.86739229024943, 86.33179138321995, 86.79619047619047, 87.28380952380952, 87.72498866213152, 88.18938775510205, 88.65378684807256, 89.11818594104308, 89.55936507936508, 90.0237641723356, 90.48816326530613, 90.95256235827664, 91.41696145124716, 91.88136054421769, 92.34575963718821, 92.81015873015873, 93.25133786848073, 93.71573696145124, 94.18013605442177, 94.66775510204081, 95.10893424036281, 95.57333333333334, 96.03773242630386, 96.50213151927437, 96.9665306122449, 97.43092970521542, 97.89532879818594, 98.33650793650794, 98.80090702947845, 99.26530612244898, 99.7297052154195, 100.19410430839002, 100.65850340136055], "energy": [0.043427612632513046, 0.0423445962369442, 0.0586673878133297, 0.059584181755781174, 0.2152101844549179, 0.2096073031425476, 0.05891270190477371, 0.10244345664978027, 0.2127951979637146, 0.1793770045042038, 0.09758532792329788, 0.22961868345737457, 0.22669066488742828, 0.22478602826595306, 0.14616209268569946, 0.05550312250852585, 0.22497478127479553, 0.22636474668979645, 0.19289661943912506, 0.21078349649906158, 0.21564987301826477, 0.2096121609210968, 0.05930235609412193, 0.10183960944414139, 0.2130940705537796, 0.18332841992378235, 0.09498763084411621, 0.23009704053401947, 0.22781451046466827, 0.22447219491004944, 0.14459624886512756, 0.05517929419875145, 0.22483693063259125, 0.22647367417812347, 0.19463804364204407, 0.2123059332370758, 0.15407797694206238, 0.05158068612217903, 0.04718174785375595, 0.10132309049367905, 0.21397288143634796, 0.178867369890213, 0.08990541845560074, 0.22921350598335266, 0.2252693474292755, 0.2273758053779602, 0.14162500202655792, 0.05537665635347366, 0.22428138554096222, 0.22217974066734314, 0.19174101948738098, 0.21290835738182068, 0.21236498653888702, 0.2104651927947998, 0.04908448085188866, 0.1004825159907341, 0.2135724276304245, 0.17937374114990234, 0.08862323313951492, 0.22949694097042084, 0.22487641870975494, 0.22709232568740845, 0.141376793384552, 0.055147964507341385, 0.2240367978811264, 0.22172945737838745, 0.1910076141357422, 0.2129511535167694, 0.1001504510641098, 0.11686646193265915, 0.05170029401779175, 0.09261614829301834, 0.1124112606048584, 0.09287779033184052, 0.0582275316119194, 0.16067872941493988, 0.10837333649396896, 0.12209693342447281, 0.051599543541669846, 0.030355434864759445, 0.10332667827606201, 0.09724855422973633, 0.115370973944664, 0.11939752846956253, 0.10332406312227249, 0.1171635091304779, 0.05077847093343735, 0.09210293740034103, 0.10698676109313965, 0.09317897260189056, 0.054406605660915375, 0.15779505670070648, 0.10990584641695023, 0.11289357393980026, 0.05035712197422981, 0.03666942939162254, 0.1126258373260498, 0.10066176950931549, 0.1158653050661087, 0.12039010226726532, 0.019122077152132988, 0.0077112941071391106, 0.03950068727135658, 0.08725433796644211, 0.10090760141611099, 0.08569561690092087, 0.04096734896302223, 0.1570490300655365, 0.11309455335140228, 0.10361139476299286, 0.04050690308213234, 0.024851979687809944, 0.09698665887117386, 0.0944787785410881, 0.10561300814151764, 0.11613218486309052, 0.09824343025684357, 0.10343511402606964, 0.039781514555215836, 0.0883537232875824, 0.09965693950653076, 0.08632964640855789, 0.04142504930496216, 0.15976759791374207, 0.11326615512371063, 0.10234814137220383, 0.040636129677295685, 0.024639222770929337, 0.10542906075716019, 0.10767032206058502, 0.047053735703229904, 0.053074125200510025, 0.2138843834400177, 0.21024706959724426, 0.06184392794966698, 0.09752634912729263, 0.21215540170669556, 0.18339289724826813, 0.09960229694843292, 0.2240835726261139, 0.2270616888999939, 0.2241613119840622, 0.1461528241634369, 0.05851896107196808, 0.22309139370918274, 0.22428347170352936, 0.19305624067783356, 0.21106001734733582, 0.21514545381069183, 0.21057440340518951, 0.06488978117704391, 0.09921768307685852, 0.2124689668416977, 0.1836145520210266, 0.09884330630302429, 0.22391900420188904, 0.22599956393241882, 0.22537994384765625, 0.14574162662029266, 0.05932823568582535, 0.22324244678020477, 0.2232244908809662, 0.1934278905391693, 0.21139174699783325, 0.15527965128421783, 0.05283856391906738, 0.050423476845026016, 0.08585517108440399, 0.174602210521698, 0.13800403475761414, 0.06153591722249985, 0.1422715038061142, 0.13034579157829285, 0.11945068836212158, 0.06974796950817108, 0.027818478643894196, 0.09114232659339905, 0.08091199398040771, 0.06365379691123962, 0.0640258938074112, 0.058153536170721054, 0.052040159702301025, 0.009653747081756592, 0.0221397802233696, 0.03798244893550873, 0.02888478897511959, 0.012350659817457199, 0.027318255975842476, 0.023663321509957314, 0.020353257656097412, 0.0105588398873806]}
```

### 12/14 · `tts_gen.py`
<!-- casebook-file {"path": "tts_gen.py", "lines": 21, "final_newline": true, "sha256": "61333052862e7c3aec92088bda1a7c37fbab801c0ebbe94d10376669cbd78038", "original_sha256": "61333052862e7c3aec92088bda1a7c37fbab801c0ebbe94d10376669cbd78038"} -->
```python
import asyncio, edge_tts
LINES = [
  ("sees",    "it sees.",    "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("writes",  "it writes.",  "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("creates", "it creates.", "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("replace", "will it replace us?", "en-GB-RyanNeural", "-25%", "-8Hz"),
  ("amplify", "it amplifies.", "en-US-ChristopherNeural", "-15%", "-4Hz"),
  ("everything", "everything.", "en-GB-RyanNeural", "-20%", "-8Hz"),
  ("you",     "you.",        "en-GB-RyanNeural", "-30%", "-12Hz"),
  ("endline", "intelligence is the new electricity.", "en-US-ChristopherNeural", "-18%", "-6Hz"),
]
async def gen(name, text, voice, rate, pitch):
    c = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
    await c.save(f"audio/tts/{name}.mp3")
async def main():
    for n,t,v,r,p in LINES:
        try:
            await gen(n,t,v,r,p); print("ok",n)
        except Exception as e:
            print("FAIL",n,e)
asyncio.run(main())
```

### 13/14 · `v2_head.js`
<!-- casebook-file {"path": "v2_head.js", "lines": 151, "final_newline": true, "sha256": "760432d99e6e53c99ec3d9cc1c36c1136e4dae37d9143d72882ace7e51372840", "original_sha256": "760432d99e6e53c99ec3d9cc1c36c1136e4dae37d9143d72882ace7e51372840"} -->
```js
/* ============================================================
   AI://MIND_SYNC — deterministic beat-synced motion graphics
   renderAt(t) renders the exact frame for time t (seconds)
   ============================================================ */
const W=1920,H=1080,FPS=30;
const $=id=>document.getElementById(id);
const stageA=$('stageA'),stageB=$('stageB'),fxc=$('fx'),bgc=$('bg'),grainC=$('grain'),hud=$('hud'),flashEl=$('flash');
const bx=bgc.getContext('2d'),fx=fxc.getContext('2d'),gx=grainC.getContext('2d');

/* ---------- math helpers ---------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,k)=>a+(b-a)*k;
const easeOutExpo=k=>k>=1?1:1-Math.pow(2,-10*k);
const easeOutBack=k=>{const c=1.70158;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
const easeOutCubic=k=>1-Math.pow(1-k,3);
const easeInCubic=k=>k*k*k;
const easeInOut=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const smooth=(a,b,t)=>{const k=clamp((t-a)/(b-a),0,1);return k*k*(3-2*k);};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function B(k){return k*TL.interval;}
const BAR=4*TL.interval;

/* beat state at time t */
function beatInfo(t){
  const i=Math.floor(t/TL.interval);
  if(i<0)return{i:-1,phase:0,pulse:0,accent:false,e:0};
  const phase=(t-B(i))/TL.interval;
  const pulse=Math.exp(-phase*4.2);
  const si=clamp(i<36?i-8:i+76,0,TL.energy.length-1);
  const e=TL.energy[si]||0;
  return{i,phase,pulse,accent:i%4===0,e};
}
const PAL={cyan:'#00e5ff',mag:'#ff2d78',vio:'#a78bfa',lime:'#b8ff2e',amber:'#ffb62e',wht:'#eaf6ff',dim:'#33415e',ink:'#04060c'};

/* ---------- persistent particle field ---------- */
const NP=560;
const parts=[];
{const r=mulberry32(7);
 for(let i=0;i<NP;i++)parts.push({x:r()*2-1,y:r()*2-1,z:r(),s:.4+r()*1.6,tw:r()*6.28,hue:r()});
}
function drawParticles(t,mode,intensity,pulse){
  const f=1.6;
  const warp=mode==='warp';
  const n=Math.floor(NP*(mode==='sparse'?0.25:1));
  for(let i=0;i<n;i++){
    const p=parts[i];
    let z=(p.z + (warp? t*2.2 : t*0.05) + i*0.001)%1;
    let zz=0.06+z*1.4;
    let sx=W/2 + (p.x/zz)*W*0.62*f;
    let sy=H/2 + (p.y/zz)*H*0.62*f;
    if(sx<-40||sx>W+40||sy<-40||sy>H+40)continue;
    const sz=p.s*(1.5-z)*(1+pulse*1.4)*intensity;
    const tw=.5+.5*Math.sin(p.tw+t*3);
    const a=clamp((1.2-z),0,1)*(0.25+0.75*tw)*intensity;
    bx.globalAlpha=clamp(a,0,1);
    if(p.hue<0.55)bx.fillStyle=PAL.cyan;else if(p.hue<0.8)bx.fillStyle=PAL.vio;else bx.fillStyle=PAL.wht;
    if(warp){
      const px=W/2+(p.x/(zz+0.03))*W*0.62*f, py=H/2+(p.y/(zz+0.03))*H*0.62*f;
      bx.strokeStyle=bx.fillStyle;bx.lineWidth=sz*0.9;
      bx.beginPath();bx.moveTo(px,py);bx.lineTo(sx,sy);bx.stroke();
    }else if(mode==='burst'){
      // radial kick outward on each beat pulse
      const dx=sx-W/2,dy=sy-H/2,dl=Math.sqrt(dx*dx+dy*dy)||1;
      const kick=pulse*46;
      bx.fillRect(sx+dx/dl*kick,sy+dy/dl*kick,sz*1.4,sz*1.4);
    }else{
      bx.fillRect(sx,sy,sz,sz);
    }
  }
  bx.globalAlpha=1;
}

/* ---------- background: gradient + perspective grid ---------- */
function drawBG(t,cfg){
  const {cx,cy,c1,c2,c3,grid=true,gridSpeed=0.35,ring=0}=cfg;
  let g=bx.createRadialGradient(W*cx,H*cy,60,W*cx,H*cy,W*0.75);
  g.addColorStop(0,c1);g.addColorStop(0.45,c2);g.addColorStop(1,c3);
  bx.fillStyle=g;bx.fillRect(0,0,W,H);
  if(!grid)return;
  // floor grid, horizon at 62%
  const hz=H*0.62;
  bx.save();
  bx.strokeStyle='rgba(0,229,255,0.10)';bx.lineWidth=1;
  const sp=(t*gridSpeed)%1;
  for(let i=0;i<14;i++){
    const k=(i+sp)/14;
    const y=hz+Math.pow(k,2.4)*(H-hz);
    bx.globalAlpha=0.10+0.35*k;
    bx.beginPath();bx.moveTo(0,y);bx.lineTo(W,y);bx.stroke();
  }
  bx.globalAlpha=0.14;
  for(let i=-14;i<=14;i++){
    bx.beginPath();
    bx.moveTo(W/2+i*70,hz);
    bx.lineTo(W/2+i*W*0.22,H);
    bx.stroke();
  }
  bx.globalAlpha=1;bx.restore();
}
/* shockwave rings on accent beats */
function drawRings(t,bi){
  if(bi.i<0)return;
  for(let k=0;k<3;k++){
    const bt=B(bi.i-k*4);
    const dt=t-bt;
    if(dt<0||dt>1.6)continue;
    const r=easeOutCubic(dt/1.6)*W*0.42;
    const a=(1-dt/1.6)*0.16;
    bx.strokeStyle=`rgba(0,229,255,${a})`;
    bx.lineWidth=3-dt;
    bx.beginPath();bx.arc(W/2,H/2,r,0,6.283);bx.stroke();
  }
}

/* ---------- grain ---------- */
const noiseTile=document.createElement('canvas');noiseTile.width=160;noiseTile.height=160;
{const nx=noiseTile.getContext('2d'),id=nx.createImageData(160,160),r=mulberry32(99);
 for(let i=0;i<id.data.length;i+=4){const v=r()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=26;}
 nx.putImageData(id,0,0);}
function drawGrain(frame){
  gx.clearRect(0,0,960,540);
  const r=mulberry32(frame);
  const ox=r()*160,oy=r()*160;
  gx.globalAlpha=0.9;
  for(let x=-160;x<960+160;x+=160)for(let y=-160;y<540+160;y+=160)
    gx.drawImage(noiseTile,x-ox,y-oy);
  gx.globalAlpha=1;
}

/* ---------- DOM helpers ---------- */
function el(tag,css,parent,html){const d=document.createElement(tag);d.style.cssText=css;if(html!=null)d.innerHTML=html;(parent||stageA).appendChild(d);return d;}
function txt(css,html,parent){return el('div',`position:absolute;font-family:Anton;white-space:nowrap;`+css,parent,html);}
function mono(css,html,parent){return el('div',`position:absolute;font-family:JetMonoReg;white-space:pre;`+css,parent,html);}
function cjk(css,html,parent){return el('div',`position:absolute;font-family:NotoBlack;white-space:nowrap;`+css,parent,html);}

/* chromatic split via stacked copies */
function chromaText(css,html,parent,dx){
  const wrap=el('div','position:absolute;'+css,parent);
  const mk=(col,x)=>{const t=el('div',`position:absolute;left:${x}px;top:0;color:${col};mix-blend-mode:screen;`,wrap,html);return t;};
  mk('rgba(255,45,120,.85)',-dx);mk('rgba(0,229,255,.85)',dx);
  const main=el('div','position:relative;color:#fff;',wrap,html);
  return{wrap,main};
}
/* text-slam timing */
function slam(t,t0,dur=0.34){
  const k=clamp((t-t0)/dur,0,1);
  return{scale:1+2.6*(1-easeOutExpo(k)),op:k<0.05?k/0.05:1,blur:(1-k)*22,k};
}

/* ============================================================
```

### 14/14 · `v2_tail.js`
<!-- casebook-file {"path": "v2_tail.js", "lines": 97, "final_newline": true, "sha256": "23d66fdf1fc6df7503d07b535969ef9186a7f66a54d2b4cc2397989b882ca40b", "original_sha256": "23d66fdf1fc6df7503d07b535969ef9186a7f66a54d2b4cc2397989b882ca40b"} -->
```js
/* ============================================================
   HUD (always on)
   ============================================================ */
const CAPTIONS=[
 [0,'LOG://AWAKENING'],[B(8),'SEQ.01 IGNITION'],[B(13),'SEQ.02 IT LEARNED'],
 [B(19),'SEQ.03 DEEP MESH'],[B(25),'SEQ.04 CAPABILITIES'],[B(31),'SEQ.05 THE QUESTION'],
 [B(38),'SEQ.06 AMPLIFY'],[B(44),'SEQ.07 COUNTDOWN'],[B(58),'SEQ.08 AI × WORLD'],
 [B(74),'SEQ.09 人机共生'],[B(78),'SEQ.10 NEW ELECTRICITY'],
];
function drawHUD(t,frame,bi,activeId){
  const cap=CAPTIONS.filter(c=>t>=c[0]).pop();
  const blink=bi.pulse>0.5?'#00e5ff':'#33415e';
  let eq='';
  for(let i=0;i<16;i++){
    const r=mulberry32(i*7+ (bi.i<0?0:bi.i));
    const h=4+r()*(10+bi.pulse*46*(0.5+r()*0.7))*(bi.i<0?0.2:1);
    eq+=`<div style="display:inline-block;width:9px;height:${h}px;background:${i%4===0?'#00e5ff':'#22304d'};margin-right:5px;vertical-align:bottom;box-shadow:${i%4===0?'0 0 8px rgba(0,229,255,.6)':'none'}"></div>`;
  }
  hud.innerHTML=`
  <div style="position:absolute;left:44px;top:20px;font-size:15px;color:#55688a;letter-spacing:2px;">AI://MIND_SYNC <span style="color:${blink}">●</span></div>
  <div style="position:absolute;right:44px;top:20px;font-size:15px;color:#55688a;letter-spacing:2px;text-align:right;">129.2 BPM · SYNC LOCK<br><span style="color:#33415e">F${String(frame).padStart(5,'0')}</span></div>
  <div style="position:absolute;left:44px;bottom:66px;height:52px;display:flex;align-items:flex-end;">${eq}</div>
  <div style="position:absolute;right:44px;bottom:70px;font-size:15px;color:#55688a;letter-spacing:2px;text-align:right;">${cap?cap[1]:''}<br><span style="color:#33415e">T+${t.toFixed(2)}s</span></div>
  <div style="position:absolute;left:44px;bottom:20px;right:44px;height:1px;background:#16233a;"><div style="height:100%;width:${(t/39.95*100).toFixed(2)}%;background:linear-gradient(90deg,#00e5ff,#ff2d78)"></div></div>`;
}

/* ============================================================
   TRANSITIONS + MASTER RENDER
   ============================================================ */
const TRANS=0.16;
const flashes=new Set([8,13,19,25,31,38,44,58,74,78].map(k=>Math.ceil(B(k)*FPS)));
// stronger white flash on the two drops + statement
const bigFlashFrames=new Set([8,58,74].map(k=>Math.ceil(B(k)*FPS)));

let curScene=null,prevScene=null;
function renderScene(sc,t,host){
  if(!sc.built||sc.el!==host){host.innerHTML='';sc.build(host);sc.el=host;sc.built=true;}
  sc.draw(host,t);
}
window.renderAt=function(t){
  const frame=Math.round(t*FPS);
  const bi=beatInfo(t);
  // pick active scene; prevScene = previous scene in timeline (not last-rendered)
  const sidx=scenes.findIndex(s=>t>=s.s&&t<s.e);
  const sc=sidx<0?scenes[scenes.length-1]:scenes[sidx];
  prevScene=sidx>0?scenes[sidx-1]:null;
  curScene=sc;
  // background
  const cfg=sc.bg?sc.bg(t):{cx:.5,cy:.5,c1:'#060a14',c2:'#04060c',c3:'#010204',grid:true,pmode:'ambient',pi:0.5};
  drawBG(t,cfg);
  drawRings(t,bi);
  drawParticles(t,cfg.pmode||'ambient',cfg.pi==null?0.6:cfg.pi,bi.pulse);
  // fx: sweep line
  fx.clearRect(0,0,W,H);
  const sy=((t*140)%(H+200))-100;
  const sg=fx.createLinearGradient(0,sy-60,0,sy+60);
  sg.addColorStop(0,'rgba(0,229,255,0)');sg.addColorStop(0.5,`rgba(0,229,255,${0.05+bi.pulse*0.04})`);sg.addColorStop(1,'rgba(0,229,255,0)');
  fx.fillStyle=sg;fx.fillRect(0,sy-60,W,120);
  // scenes
  const sinceStart=t-sc.s;
  const inTrans=sinceStart<TRANS&&prevScene&&prevScene!==sc;
  // camera pulse
  const camSc=1+bi.pulse*0.008;
  if(inTrans){
    renderScene(prevScene,t,stageB);
    stageB.style.opacity=1-sinceStart/TRANS;
    const rr=mulberry32(frame);
    stageB.style.transform=`translate(${(rr()-0.5)*14}px,${(rr()-0.5)*8}px) scale(${camSc})`;
    stageB.style.filter=`hue-rotate(${(rr()-0.5)*90}deg) brightness(1.4)`;
  }else{
    stageB.style.opacity=0;
  }
  renderScene(sc,t,stageA);
  if(inTrans){
    const rr=mulberry32(frame+7);
    stageA.style.transform=`translate(${(rr()-0.5)*10}px,0) scale(${camSc+0.01})`;
    stageA.style.clipPath=`inset(0 0 ${(1-sinceStart/TRANS)*60}% 0)`;
    stageA.style.filter=`contrast(1.2)`;
  }else{
    stageA.style.transform=`scale(${camSc})`;
    stageA.style.clipPath='none';
    stageA.style.filter='none';
  }
  // flash on accented scene-start beats
  let fo=0;
  if(bigFlashFrames.has(frame)||flashes.has(frame))fo=bigFlashFrames.has(frame)?0.9:0.55;
  else{
    // decay over ~3 frames
    for(const f of bigFlashFrames){if(frame>f&&frame-f<4)fo=Math.max(fo,0.9*(1-(frame-f)/4));}
    for(const f of flashes){if(frame>f&&frame-f<3)fo=Math.max(fo,0.55*(1-(frame-f)/3));}
  }
  flashEl.style.opacity=fo;
  // grain + hud
  drawGrain(frame);
  drawHUD(t,frame,bi,sc.id);
  return sc.id;
};
```

