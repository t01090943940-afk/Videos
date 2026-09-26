# moon-letter · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show moon-letter <路径>`；还原成真实目录：`python3 scripts/casebook.py copy moon-letter <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `Moon_Letter_Interactive.html` | 225 | 13 |

---

### 1/1 · `Moon_Letter_Interactive.html`
<!-- casebook-file {"path": "Moon_Letter_Interactive.html", "lines": 225, "final_newline": true, "sha256": "e1bf248fe7eea1977e288436242ff7347098117940e26ea97926bbca21a9fe12", "original_sha256": "ca16a2df0abef5e7a4b0db64d3dcfecf4bfe7e7cde9d48ae23553345e5c7afd4", "stripped_base64": [{"mime": "audio/mp4", "base64_chars": 935588}]} -->
```html
<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>今晚的月亮，不催你</title><style>
*{box-sizing:border-box}html,body{margin:0;min-height:100%;background:#132c34;color:#f1dfbc;font-family:system-ui,sans-serif}body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:18px}canvas{height:min(88vh,900px);width:auto;max-width:96vw;object-fit:contain;box-shadow:0 24px 80px #0005;border-radius:5px}nav{width:min(48vh,500px);display:flex;align-items:center;gap:14px;padding:18px 0}button{border:1px solid #e5c28b66;background:#e5c28b18;color:inherit;border-radius:999px;padding:8px 20px;cursor:pointer;white-space:nowrap}input{min-width:0;flex:1;accent-color:#d8b37c}span{font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(prefers-reduced-motion:reduce){canvas{box-shadow:none}}
</style></head><body><canvas id="film" aria-label="A Mid-Autumn letter of encouragement"></canvas><nav><button id="play">&#x64ad;&#x653e;</button><input id="seek" type="range" min="0" max="28.8" value="0" step="0.01" aria-label="Playback position"><span id="time">0:00 / 0:29</span></nav><p class="sr" id="transcript"></p><audio id="music" preload="auto" src="data:audio/mp4;base64,CASEBOOK-STRIPPED-audio-mp4-701691B"></audio><script>
/* Moon Letter - deterministic, original Canvas animation. No external assets. */
'use strict';
const W=1080,H=1920,DURATION=28.8;
const cv=document.getElementById('film'); cv.width=W; cv.height=H;
const main=cv.getContext('2d',{alpha:false});
const SERIF='"Noto Serif CJK SC","Songti SC","SimSun",serif';
const SANS='"Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif';
const C={ivory:'#fff2d4',gold:'#e8bd77',orange:'#d78353',ink:'#254149',pale:'#f5e5c8',red:'#b85d45'};
const titles=[
 ['\u5b66\u59d0\uff0c','\u4eca\u665a\u7684\u6708\u4eae','\u4e0d\u50ac\u4f60\u3002'],
 ['\u4f60\u603b\u60f3\u8ba9\u4e16\u754c','\u5bf9\u522b\u4eba\u518d\u597d\u4e00\u70b9\u3002','\u8fd9\u6b21\uff0c\u6362\u6211\u4e3a\u4f60\u70b9\u4e00\u76cf\u706f\u3002'],
 ['\u4e0d\u5fc5\u6bcf\u4e00\u5929\u90fd\u5f88\u5389\u5bb3\uff0c','\u4e5f\u503c\u5f97\u88ab\u597d\u597d\u60e6\u8bb0\u3002'],
 ['\u6162\u4e00\u70b9\uff0c\u4e0d\u7b49\u4e8e\u505c\u4e0b\u3002','\u4f60\u8d70\u8fc7\u7684\u6bcf\u4e00\u6b65\uff0c\u90fd\u7b97\u6570\u3002'],
 ['\u613f\u4f60','\u843d\u7b14\u6709\u5e95\u6c14\uff0c','\u62ac\u5934\u6709\u6708\u5149\u3002'],
 ['\u5b66\u59d0\uff0c','\u4e2d\u79cb\u5feb\u4e50\uff01','\u6708\u997c\u5206\u4f60\u4e00\u534a\uff0c','\u52a0\u6cb9\u5168\u90e8\u7ed9\u4f60\u3002']
];
const starts=[0,4.8,9.6,14.4,19.2,23.4],ends=[4.8,9.6,14.4,19.2,23.4,28.8];
let ctx=main;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const out=x=>1-Math.pow(1-clamp(x),3);
const ease=x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const back=x=>{x=clamp(x);return 1+2.70158*Math.pow(x-1,3)+1.70158*Math.pow(x-1,2)};
function rand(n){let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function alpha(a,fn){ctx.save();ctx.globalAlpha*=clamp(a);fn();ctx.restore()}
function tr(x,y,r,s,fn){ctx.save();ctx.translate(x,y);ctx.rotate(r||0);ctx.scale(s||1,s||1);fn();ctx.restore()}
function path(points,fill,stroke,lw=1){ctx.beginPath();points(ctx);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function rr(x,y,w,h,r,fill,stroke,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function ellipse(x,y,rx,ry,fill,rot=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function line(x1,y1,x2,y2,color,w=2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke()}
function grad(x0,y0,x1,y1,colors){let g=ctx.createLinearGradient(x0,y0,x1,y1);colors.forEach((c,i)=>g.addColorStop(i/(colors.length-1),c));return g}
function glow(x,y,r,color,a=1){alpha(a,()=>{let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(239,190,104,0)');ellipse(x,y,r,r,g)})}
function txt(text,x,y,size,color=C.ivory,weight=400,family=SERIF,spacing=0){ctx.font=`${weight} ${size}px ${family}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;if(!spacing){ctx.fillText(text,x,y);return}let a=[...text],ww=a.reduce((n,c)=>n+ctx.measureText(c).width,0)+spacing*(a.length-1);let xx=x-ww/2;ctx.textAlign='left';a.forEach(c=>{ctx.fillText(c,xx,y);xx+=ctx.measureText(c).width+spacing})}
function star(x,y,r,color=C.gold,rot=0){tr(x,y,rot,1,()=>{path(c=>{c.moveTo(0,-r);c.quadraticCurveTo(r*.16,-r*.16,r,0);c.quadraticCurveTo(r*.16,r*.16,0,r);c.quadraticCurveTo(-r*.16,r*.16,-r,0);c.quadraticCurveTo(-r*.16,-r*.16,0,-r)},color)})}
function petal(x,y,s,rot,col){tr(x,y,rot,s,()=>{path(c=>{c.moveTo(0,0);c.bezierCurveTo(-12,-20,8,-36,20,-38);c.bezierCurveTo(24,-17,14,-1,0,0)},col)})}
function blossom(x,y,s=1,a=1){alpha(a,()=>tr(x,y,0,s,()=>{for(let k=0;k<4;k++)ellipse(Math.cos(k*Math.PI/2)*6,Math.sin(k*Math.PI/2)*6,7,5,C.gold,k*Math.PI/2);ellipse(0,0,2,2,'#fcf0b9')}))}
const paper=document.createElement('canvas');paper.width=240;paper.height=240;{
 const p=paper.getContext('2d'),im=p.createImageData(240,240);for(let i=0;i<240*240;i++){let a=rand(i);let v=a>.5?255:30;im.data[i*4]=v;im.data[i*4+1]=v;im.data[i*4+2]=v;im.data[i*4+3]=Math.floor(4+rand(i+99)*8)}p.putImageData(im,0,0);
}
let bgCache=[];
function bg(which){if(bgCache[which]){ctx.drawImage(bgCache[which],0,0);return}let old=ctx,c=document.createElement('canvas');c.width=W;c.height=H;ctx=c.getContext('2d');
 const palettes=[['#142e38','#28474a','#45615b'],['#17353c','#345348','#52634d'],['#203c43','#46574e','#6a6855'],['#193b43','#355b58','#747961'],['#23424b','#3a5b60','#7c8170'],['#f6ebd7','#eddbc0','#e3c79e']];
 ctx.fillStyle=grad(0,0,800,H,palettes[which]);ctx.fillRect(0,0,W,H);
 glow(580,1110,820,which===5?'rgba(255,255,245,.95)':'rgba(250,203,131,.12)');
 for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(530,1090,470+k*85,490+k*130,-.22,0,Math.PI*2);ctx.strokeStyle=which===5?'rgba(128,92,55,.06)':'rgba(255,230,176,.035)';ctx.lineWidth=1.2;ctx.stroke()}
 ctx.fillStyle=ctx.createPattern(paper,'repeat');ctx.fillRect(0,0,W,H);
 let v=ctx.createRadialGradient(540,960,420,540,960,1200);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,which===5?'rgba(123,72,40,.09)':'rgba(0,12,21,.3)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
 ctx=old;bgCache[which]=c;ctx.drawImage(c,0,0);
}
function celestial(t,bright=false){
 for(let i=0;i<42;i++){let x=70+rand(i+7)*940,y=190+rand(i+800)*1440;let a=(.15+.35*(.5+.5*Math.sin(t*.65+i*4)))*(bright?.58:1);let s=1.5+rand(i+27)*2.0;alpha(a,()=>ellipse(x+4*Math.sin(t*.2+i),y,s,s,bright?'#a67e49':'#f9dfab'))}
 for(let i=0;i<9;i++){let x=90+rand(i+151)*900,y=750+rand(i+600)*780;alpha(.3+.25*Math.sin(t+i)**2,()=>star(x+12*Math.sin(t*.25+i),y-12*Math.sin(t*.3+i),5+rand(i)*4,bright?'#b79259':'#eed193',.1*Math.sin(t+i)))}
}
function header(i,t){let bright=i===5,col=bright?'rgba(84,68,46,.6)':'rgba(249,230,189,.61)';line(92,153,375,153,col,1);line(705,153,988,153,col,1);txt('\u6708\u5149\u6765\u4fe1',540,151,25,col,400,SANS,9);alpha(.7,()=>{for(let j=0;j<6;j++){let x=463+j*31;ellipse(x,1760,j===i?5:3,j===i?5:3,bright?'#a27041':C.gold)}});txt('\u4e2d\u79cb\u00b7\u5199\u7ed9\u5b66\u59d0',540,1815,21,col,400,SANS,4)}
function moon(x,y,r,t,a=1){alpha(a,()=>{glow(x,y,r*1.7,'rgba(241,196,115,.20)');tr(x,y,0,1,()=>{
 let g=ctx.createRadialGradient(-r*.32,-r*.42,r*.05,0,0,r);g.addColorStop(0,'#fff4d8');g.addColorStop(.65,'#f3d8a1');g.addColorStop(1,'#d2a66a');ellipse(0,0,r,r,g);
 ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.clip();
 for(let k=0;k<37;k++){let xx=(rand(k+11)-.5)*r*1.8,yy=(rand(k+61)-.5)*r*1.8,sz=r*(.026+rand(k+90)*.16);ellipse(xx,yy,sz,sz*.7,'rgba(156,121,78,.033)',rand(k)*3)}
 let gg=ctx.createLinearGradient(-r,-r,r,r);gg.addColorStop(0,'rgba(255,255,240,.25)');gg.addColorStop(.6,'rgba(255,247,218,0)');gg.addColorStop(1,'rgba(136,94,50,.1)');ctx.fillStyle=gg;ctx.fillRect(-r,-r,r*2,r*2);
 ctx.fillStyle=ctx.createPattern(paper,'repeat');ctx.globalAlpha*=.8;ctx.fillRect(-r,-r,r*2,r*2);ctx.restore();
 ctx.beginPath();ctx.arc(0,0,r-.5,0,Math.PI*2);ctx.strokeStyle='rgba(255,247,219,.5)';ctx.lineWidth=1.3;ctx.stroke();
 })})}
function cloud(x,y,s,a=1,col='#aac2b3'){alpha(a,()=>tr(x,y,0,s,()=>{path(c=>{c.moveTo(-170,20);c.bezierCurveTo(-205,-10,-173,-58,-123,-40);c.bezierCurveTo(-124,-116,-10,-126,6,-70);c.bezierCurveTo(49,-111,129,-87,137,-38);c.bezierCurveTo(199,-60,234,6,191,23);c.bezierCurveTo(117,44,-102,41,-170,20)},col)}))}
function sprig(x,y,s,r,t,a=1){alpha(a,()=>tr(x,y,r+Math.sin(t*.55)*.018,s,()=>{
 path(c=>{c.moveTo(0,0);c.bezierCurveTo(38,-100,88,-180,123,-330)},null,'#b8995f',3);
 for(let j=0;j<8;j++){let yy=-38-j*34,xx=(38+j*12)*.75,sg=j%2?1:-1;line(xx,yy,xx+sg*35,yy-34,'#b8995f',2);petal(xx+sg*35,yy-34,.83,sg*.65,'#70846a');blossom(xx+sg*35,yy-34,.65);blossom(xx+sg*24,yy-22,.48)}
 }))}
function book(x,y,w,h,rot,col,label,open=false){tr(x,y,rot,1,()=>{
 ctx.save();ctx.shadowColor='rgba(0,10,12,.2)';ctx.shadowBlur=28;ctx.shadowOffsetY=20;rr(-w/2,0,w,h,10,col);ctx.restore();
 rr(-w/2+10,5,w-20,h-14,5,grad(0,0,0,h,['#f5e4c6','#d1ba91']));
 for(let j=0;j<5;j++)line(-w/2+24,10+j*(h-20)/5,w/2-14,10+j*(h-20)/5,'rgba(100,78,50,.2)',1);
 rr(-w/2-2,-6,w+4,10,4,col);rr(-w/2-2,h-6,w+4,10,4,col);
 rr(-w/2,0,20,h,5,col);
 if(label){txt(label,0,h/2,20,'#836941',400,SERIF,3)}
 })}
function openbook(x,y,s,t,progress=1){tr(x,y,-.065,s,()=>{
 ctx.save();ctx.shadowColor='rgba(0,0,0,.2)';ctx.shadowBlur=30;ctx.shadowOffsetY=18;
 path(c=>{c.moveTo(0,-32);c.bezierCurveTo(-70,-85,-171,-89,-290,-65);c.lineTo(-270,114);c.bezierCurveTo(-165,77,-68,79,0,113);c.bezierCurveTo(91,67,165,77,285,89);c.lineTo(308,-84);c.bezierCurveTo(168,-94,72,-78,0,-32)},'#bc8458');ctx.restore();
 for(let j=5;j>=0;j--){let dy=j*3;path(c=>{c.moveTo(0,-42+dy);c.bezierCurveTo(-65,-99,-169,-100,-290,-79);c.lineTo(-273,94+dy);c.bezierCurveTo(-156,63+dy,-61,81+dy,0,108+dy);c.bezierCurveTo(98,65+dy,175,61+dy,292,77+dy);c.lineTo(309,-99+dy);c.bezierCurveTo(167,-109+dy,72,-94+dy,0,-42+dy)},j===0?grad(-280,0,310,0,['#dfcba6','#fff0d2','#c9b18c','#f4e8ca']):'#d8c5a1','rgba(101,89,69,.15)',1)}
 path(c=>{c.moveTo(0,-42);c.bezierCurveTo(-3,4,0,65,0,108)},null,'rgba(129,109,77,.4)',2);
 for(let k=0;k<7;k++){path(c=>{c.moveTo(-251,-37+k*16);c.quadraticCurveTo(-130,-50+k*16,-39,-7+k*14)},null,'rgba(132,118,89,.24)',1.7);path(c=>{c.moveTo(41,-10+k*14);c.quadraticCurveTo(143,-56+k*16,261,-47+k*16)},null,'rgba(132,118,89,.24)',1.7)}
 path(c=>{c.moveTo(22,-53);c.bezierCurveTo(20,10,22,64,16,113);c.lineTo(40,145);c.lineTo(48,116);c.bezierCurveTo(44,46,46,-11,46,-61)},'#b96849');
 })}
function cup(x,y,s,t){tr(x,y,0,s,()=>{
 ellipse(0,72,113,22,'rgba(0,10,15,.17)');ellipse(0,53,105,25,'#b9c0a6');ellipse(0,48,94,20,'#ebd9b7');
 ctx.beginPath();ctx.ellipse(74,-11,33,36,0,0,Math.PI*2);ctx.strokeStyle='#dfcba7';ctx.lineWidth=14;ctx.stroke();
 path(c=>{c.moveTo(-66,-52);c.lineTo(-56,27);c.bezierCurveTo(-49,67,49,67,57,25);c.lineTo(65,-52);c.closePath()},grad(-60,0,70,0,['#bfae8e','#fff0d0','#d8bd94']));ellipse(0,-52,65,17,'#fff0d0');ellipse(0,-51,53,11,'#8c6845');
 for(let j=0;j<3;j++)alpha(.24,()=>{path(c=>{let xx=(j-1)*20;c.moveTo(xx,-76);c.bezierCurveTo(xx-25+Math.sin(t*1.4+j)*14,-109,xx+29,-125,xx+Math.sin(t+j)*18,-169-j*17)},null,'#f7e7c9',3)})
 })}
function lantern(x,y,s,t,hero=false,col='#ebbd75'){tr(x,y,Math.sin(t*.6+x)*.045,s,()=>{
 if(hero)glow(0,20,245,'rgba(255,200,96,.23)');
 line(0,-190,0,-111,'rgba(242,216,167,.57)',2);
 ellipse(0,13,100,119,grad(-95,0,95,0,['#ba7343',col,'#fbe5ac',col,'#af6b40']));
 for(let j=-2;j<=2;j++){path(c=>{let xx=j*28;c.moveTo(xx*.63,-96);c.bezierCurveTo(xx*1.6,-54,xx*1.6,69,xx*.63,117)},null,'rgba(118,77,39,.3)',2)}
 for(let j=0;j<4;j++){ctx.beginPath();ctx.ellipse(0,-67+j*54,Math.sqrt(Math.max(0,1-Math.pow((-67+j*54-13)/123,2)))*98,9,0,0,Math.PI*2);ctx.strokeStyle='rgba(163,94,42,.16)';ctx.lineWidth=1.5;ctx.stroke()}
 rr(-58,-104,116,15,4,'#96734f');rr(-56,113,112,13,4,'#96734f');line(0,128,0,169,'#e1b170',4);
 for(let j=-3;j<=3;j++)path(c=>{c.moveTo(j*2,164);c.quadraticCurveTo(j*4+Math.sin(t*2)*5,183,j*6+Math.sin(t*2)*6,204)},null,'#d89760',3);
 if(hero){txt('\u613f',0,10,53,'#966036',500,SERIF)}
 })}
function envelope(x,y,s,t,p){tr(x,y,-.08+Math.sin(t*.5)*.02,s,()=>{
 ctx.save();ctx.shadowColor='rgba(0,8,14,.19)';ctx.shadowBlur=48;ctx.shadowOffsetY=30;
 path(c=>{c.moveTo(-226,-10);c.lineTo(0,-191);c.lineTo(226,-10);c.lineTo(226,261);c.lineTo(-226,261);c.closePath()},'#ae8e67');ctx.restore();
 path(c=>{c.moveTo(-222,-8);c.lineTo(0,-174);c.lineTo(222,-8);c.closePath()},'#c4a780');
 tr(0,-80-out(p)*96,0,1,()=>{rr(-192,-58,384,296,7,grad(0,-58,0,240,['#fff2d7','#ead5b0']));rr(-176,-42,352,264,3,null,'rgba(170,135,83,.35)',1);txt('\u7ed9\u4f60',0,34,47,'#8b6e47',400,SERIF,10);line(-71,102,71,102,'rgba(160,131,83,.28)',1.5);star(0,143,21,'#c29350');});
 path(c=>{c.moveTo(-226,-8);c.lineTo(0,137);c.lineTo(226,-8);c.lineTo(226,263);c.lineTo(-226,263);c.closePath()},grad(-226,0,226,260,['#d1ab7d','#edc997','#bd8d59']));
 path(c=>{c.moveTo(-226,263);c.lineTo(-10,89);c.quadraticCurveTo(0,78,10,89);c.lineTo(226,263);c.closePath()},grad(0,85,0,263,['#f0d0a0','#d9b17b']));line(-224,262,-2,87,'rgba(160,113,64,.32)',1);line(225,262,2,87,'rgba(160,113,64,.26)',1);
 ellipse(0,156,39,39,'#aa6349');ellipse(-2,152,33,33,'#c67d59');star(-2,151,18,'#e4b57b');
 })}
function boat(x,y,s,ang,t){tr(x,y,ang,s,()=>{
 ctx.save();ctx.shadowColor='rgba(5,22,30,.25)';ctx.shadowBlur=24;ctx.shadowOffsetY=20;
 path(c=>{c.moveTo(-133,-12);c.lineTo(141,-12);c.lineTo(84,70);c.lineTo(-59,70);c.closePath()},'#d4af79');ctx.restore();
 path(c=>{c.moveTo(-133,-12);c.lineTo(16,19);c.lineTo(-59,70);c.closePath()},'#f4dfb5');path(c=>{c.moveTo(141,-12);c.lineTo(16,19);c.lineTo(84,70);c.closePath()},'#b38c5d');
 path(c=>{c.moveTo(-13,-171);c.lineTo(-106,-26);c.lineTo(66,-26);c.closePath()},grad(-100,-130,40,0,['#fff1d0','#dfc294']));path(c=>{c.moveTo(-13,-171);c.lineTo(90,-26);c.lineTo(12,-26);c.closePath()},'#d1af7c');
 line(-13,-171,12,-26,'rgba(133,101,54,.2)',1);star(-12,-195,10,'#f6d890');
 })}
function pen(x,y,s,r){tr(x,y,r,s,()=>{ctx.save();ctx.shadowColor='rgba(0,0,0,.22)';ctx.shadowBlur=10;ctx.shadowOffsetY=8;rr(-15,-192,30,185,13,grad(-15,0,15,0,['#234851','#597d7b','#183941']));ctx.restore();rr(-17,-62,34,16,3,'#cfab69');rr(-16,-190,32,10,3,'#d3ad6a');path(c=>{c.moveTo(-14,-7);c.lineTo(0,48);c.lineTo(14,-7);c.closePath()},grad(-14,0,14,0,['#b88943','#f3d8a0','#b88b45']));line(0,44,0,2,'#7f6338',1.5);ellipse(0,2,2.7,2.7,'#7f6338');line(10,-171,10,-110,'#dcc28a',4)})}
function mooncake(x,y,s,t,cut=false){tr(x,y,-.1,s,()=>{
 function edge(rad,dy){ctx.beginPath();for(let j=0;j<200;j++){let a=j/200*Math.PI*2,r=rad+7*Math.cos(a*14),xx=Math.cos(a)*r,yy=Math.sin(a)*r*.80+dy;j?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.closePath()}
 ctx.save();ctx.shadowColor='rgba(119,63,18,.21)';ctx.shadowBlur=24;ctx.shadowOffsetY=18;edge(110,27);ctx.fillStyle='#a86832';ctx.fill();ctx.restore();edge(110,0);ctx.fillStyle=grad(-80,-90,90,100,['#ecc98a','#d69952','#c17a39']);ctx.fill();
 for(let j=0;j<14;j++){let a=j/14*Math.PI*2;line(Math.cos(a)*110,Math.sin(a)*88+6,Math.cos(a)*110,Math.sin(a)*88+24,'rgba(118,64,24,.27)',2)}
 ctx.beginPath();ctx.ellipse(0,0,90,70,0,0,Math.PI*2);ctx.lineWidth=4;ctx.strokeStyle='#ad6d32';ctx.stroke();ctx.beginPath();ctx.ellipse(0,-2,81,61,0,0,Math.PI*2);ctx.lineWidth=2;ctx.strokeStyle='#f0c585';ctx.stroke();
 for(let k=0;k<8;k++){let a=k*Math.PI/4;tr(Math.cos(a)*63,Math.sin(a)*45,a,1,()=>{path(c=>{c.moveTo(-8,0);c.quadraticCurveTo(0,-19,8,0);c.quadraticCurveTo(0,13,-8,0)},null,'#ae6e33',2)})}
 rr(-32,-29,64,58,10,null,'#a76931',2.5);txt('\u597d',0,0,40,'#a66831',600,SERIF);
 })}
function rabbit(x,y,s,t,joy=0){tr(x,y,Math.sin(t*2)*.025*joy,s,()=>{
 let bounce=Math.max(0,Math.sin(t*Math.PI*2/1.2))*10*joy;
 ctx.translate(0,-bounce);
 ellipse(0,164,143,25,'rgba(109,77,43,.12)');
 ellipse(0,57,113,111,grad(-110,0,80,140,['#fff7e6','#f0dec1','#d9c1a0']));
 ellipse(-43,-150,33,109,'#fbefdb',-.19-.08*Math.sin(t*1.8)*joy);ellipse(48,-159,32,117,'#f8ead4',.18+.12*Math.sin(t*1.8+.6)*joy);
 ellipse(-43,-155,14,78,'#e6b6a2',-.19-.08*Math.sin(t*1.8)*joy);ellipse(48,-164,13,84,'#e6b6a2',.18+.12*Math.sin(t*1.8+.6)*joy);
 ellipse(0,-52,103,91,grad(-90,-150,100,50,['#fff8e9','#f7e7cd','#e7ceb0']));
 let blink=((t%3.7)>3.48)?0.16:1;
 ellipse(-38,-58,6,9*blink,'#5f5143');ellipse(37,-58,6,9*blink,'#5f5143');ellipse(-57,-31,19,10,'rgba(218,147,128,.43)');ellipse(58,-31,19,10,'rgba(218,147,128,.43)');
 path(c=>{c.moveTo(-5,-32);c.quadraticCurveTo(0,-28,5,-32);c.lineTo(0,-24);c.closePath()},'#b37d65');path(c=>{c.moveTo(-14,-15);c.quadraticCurveTo(-3,-5,0,-19);c.quadraticCurveTo(5,-6,16,-16)},null,'#89735c',2.5);
 ellipse(-64,149,48,22,'#ead5b7',-.06);ellipse(63,149,48,22,'#ead5b7',.06);
 ellipse(-88,61,25,48,'#f7e7cc',-.6);ellipse(89,57,24,47,'#f7e7cc',.6);
 })}
function sceneArt(i,u,t){
 let enter=out(u/.95);
 if(i===0){
  moon(565,1010-18*Math.sin(u*.6),273+3*Math.sin(u*.7),t);
  cloud(205+u*7,1178,.9,.55,'#68817a');cloud(883-u*9,1085,.62,.24,'#a0aa88');
  sprig(78,1454,1.12,-.35,t,.84);sprig(933,1575,.75,.35,t,.65);
  glow(513,1460,410,'rgba(234,186,112,.15)');
  tr(510,1445+(1-enter)*40,-.035,1,()=>{book(-44,20,510,67,-.04,'#799086','');book(-26,-45,474,58,.05,'#bf926a','');openbook(-40,-123,.9,t)});
  cup(847,1430,.82,t);
  for(let j=0;j<5;j++)blossom(278+j*99,1551+Math.sin(j*4)*27,.8,.7);
 }
 if(i===1){
  moon(785,960,156,t,.67);cloud(225-u*5,1530,1.55,.12,'#d2c593');
  path(c=>{c.moveTo(-80,799);c.bezierCurveTo(290,1054,745,662,1150,882)},null,'rgba(231,206,153,.38)',2);
  lantern(179,1060+Math.sin(t)*9,.56,t);lantern(884,1200+Math.sin(t+1)*14,.68,t+.8);
  lantern(534,1154-28*enter+Math.sin(u*.8)*17,1.42*mix(.82,1,enter),t,true);
  lantern(965,1546-u*9,.30,t+3);lantern(54,1580-u*7,.27,t+8);
  sprig(124,1633,.9,-.16,t,.7);sprig(963,1510,.72,.15,t,.55);
  for(let k=0;k<14;k++){let d=(u*.11+rand(k+12))%1;let x=330+rand(k+53)*450;alpha(Math.sin(d*Math.PI)*.8,()=>{glow(x,1630-d*470,22,'rgba(255,215,135,.24)');ellipse(x,1630-d*470,2.6,2.6,'#f7d999')})}
 }
 if(i===2){
  moon(525,1091,296,t,.94);
  cloud(901+u*3,1214,.71,.47,'#88947f');cloud(210-u*6,1317,.69,.67,'#98a08a');
  envelope(529,1212+(1-enter)*100,1.12,t,smooth((u-.4)/1.6));
  sprig(185,1540,.94,-.4,t,.81);sprig(954,1553,.72,.38,t,.65);
  for(let k=0;k<6;k++){let a=k/6*Math.PI*2+t*.06;let xx=540+Math.cos(a)*325,yy=1150+Math.sin(a)*294;alpha(.65,()=>star(xx,yy,8+3*Math.sin(t+k),C.gold,a))}
 }
 if(i===3){
  moon(750,988,196,t);
  cloud(153,1518,1.30,.17,'#adbb9c');cloud(1002,1457,1.35,.18,'#b9c2a4');
  let points=[];for(let k=0;k<90;k++){let f=k/89,xx=188+f*580+Math.sin(f*Math.PI*2)*72,yy=1500-f*505;points.push([xx,yy])}
  path(c=>{c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p))},null,'rgba(241,215,164,.14)',2);
  for(let k=0;k<11;k++){let f=k/10,xx=188+f*580+Math.sin(f*Math.PI*2)*72,yy=1500-f*505;let lit=clamp(u/3.4*11-k+.4);alpha(.13+lit*.58,()=>{ellipse(xx,yy,25-k*.9,8,'#ead19d');if(lit>.2)glow(xx,yy,40,'rgba(251,221,154,.16)')})}
  let f=.10+.61*smooth(u/4.4),xx=188+f*580+Math.sin(f*Math.PI*2)*72,yy=1500-f*505;
  boat(xx,yy-122,.92,-.06+Math.sin(u*.9)*.03,t);
  for(let j=0;j<3;j++){path(c=>{c.moveTo(xx-140-j*13,yy+27+j*14);c.quadraticCurveTo(xx,yy+55+j*13,xx+125-j*10,yy+28+j*14)},null,`rgba(221,209,165,${.17-j*.04})`,1.3)}
  sprig(99,1640,.73,-.3,t,.65);sprig(996,1501,.84,.13,t,.6);
  star(781,992,20,'#fff4d0',Math.sin(u)*.1);
 }
 if(i===4){
  moon(715,1000,205,t,.90);
  let p=smooth((u-.25)/2.8);let pnts=[];for(let j=0;j<100;j++){let f=j/99,xx=277+f*517,yy=1298-Math.sin(f*Math.PI)*254-f*120;pnts.push([xx,yy])}
  alpha(.75,()=>{ctx.setLineDash([3,14]);path(c=>{c.moveTo(...pnts[0]);pnts.slice(1).forEach(q=>c.lineTo(...q))},null,'rgba(251,222,166,.24)',2);ctx.setLineDash([])});
  path(c=>{c.moveTo(...pnts[0]);pnts.slice(1,Math.max(2,Math.floor(p*99))).forEach(q=>c.lineTo(...q))},null,'#ebd1a0',2.6);
  let q=pnts[Math.min(99,Math.floor(p*99))];glow(q[0],q[1],53,'rgba(255,231,172,.25)');star(q[0],q[1],10,C.ivory,u*.15);
  openbook(525,1430,.99,t);pen(450+smooth(u/2.4)*160,1312-smooth(u/2.4)*96,1.05,.5-.09*Math.sin(u*.7));
  cloud(999-u*8,1197,.9,.22,'#a1b3a0');sprig(109,1575,1.1,-.28,t,.75);blossom(874,1561,1.1,.8);
 }
 if(i===5){
  moon(547,1119,315,t,.66);
  sprig(108,1400,1.12,-.40,t,.85);sprig(939,1479,.95,.28,t,.8);
  let pp=back(u/.9),bob=Math.max(0,Math.sin((u+.15)*Math.PI*2/1.2));
  tr(536,1174+(1-pp)*110,0,1,()=>{rabbit(0,0,1.06,t,1);mooncake(1,102,.87,t);ellipse(-80,89,23,18,'#f5e5cc',-.4);ellipse(81,86,23,18,'#f4e2c4',.4)});
  lantern(140,721,.42,t,false);lantern(934,783,.42,t+2,false);
  for(let k=0;k<23;k++){let age=u-.45-rand(k+66)*.65;if(age<0)continue;let v=age/3.7,xx=540+(rand(k+103)-.5)*900*(.3+v*.9),yy=1050-(1-Math.pow(v-.6,2))*580+v*v*440;alpha(clamp(1-v)*.75,()=>{if(k%3===0)blossom(xx,yy,.65);else petal(xx,yy,.35+rand(k)*.23,t*.7+k,k%2?'#c79a55':'#be7e63')})}
  star(250,1000+Math.sin(u*2)*10,16,'#b79156',u*.2);star(839,1030+Math.cos(u*2)*10,12,'#b79156',-u*.2);
 }
}
function textLayer(i,u,t){let dur=ends[i]-starts[i];let fadeOut=i===5?1:1-smooth((u-(dur-.30))/.30);let a=out((u-.10)/.60)*fadeOut;let rise=16*(1-out((u-.10)/.75));
 const inLine=(delay,fn)=>alpha(out((u-delay)/.58)*fadeOut,()=>{ctx.save();ctx.translate(0,14*(1-out((u-delay)/.65)));fn();ctx.restore()});
 if(i===0){inLine(.12,()=>txt(titles[0][0],540,322,43,'#e4c797'));inLine(.35,()=>txt(titles[0][1],540,438,77));inLine(.65,()=>txt(titles[0][2],540,555,99,C.ivory,500));inLine(.95,()=>{line(474,657,606,657,'rgba(236,204,151,.55)',1.4);star(540,658,5,C.gold)})}
 if(i===1){inLine(.15,()=>txt(titles[1][0],540,364,68));inLine(.32,()=>txt(titles[1][1],540,464,68));inLine(.80,()=>txt(titles[1][2],540,594,33,'#e7c694',400,SANS))}
 if(i===2){inLine(.12,()=>txt(titles[2][0],540,382,56));inLine(.35,()=>txt(titles[2][1],540,490,63));inLine(.80,()=>{path(c=>{c.moveTo(257,552);c.quadraticCurveTo(526,567,821,547)},null,'rgba(236,198,133,.6)',2)})}
 if(i===3){inLine(.15,()=>txt(titles[3][0],540,394,62));inLine(.48,()=>txt(titles[3][1],540,521,45,'#eedab5',400,SANS));inLine(.75,()=>{star(527,637,8,C.gold);star(552,637,4,C.gold)})}
 if(i===4){inLine(.1,()=>txt(titles[4][0],540,296,40,'#e5c699'));inLine(.25,()=>txt(titles[4][1],540,411,76));inLine(.45,()=>txt(titles[4][2],540,530,76))}
 if(i===5){inLine(.12,()=>txt(titles[5][0],540,313,47,'#936a49'));inLine(.3,()=>txt(titles[5][1],540,456,110,'#a55d42',500));inLine(.9,()=>txt(titles[5][2],540,1489,47,'#755c42'));inLine(1.13,()=>txt(titles[5][3],540,1573,57,'#a75e43',500));}
}
const off=[];for(let k=0;k<2;k++){let c=document.createElement('canvas');c.width=W;c.height=H;off.push(c)}
function single(target,i,t){let old=ctx;ctx=target;ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;bg(i);celestial(t,i===5);sceneArt(i,t-starts[i],t);textLayer(i,t-starts[i],t);header(i,t);ctx=old}
function render(t){t=clamp(t,0,DURATION-.000001);let i=0;for(let k=0;k<starts.length;k++)if(t>=starts[k])i=k;let u=t-starts[i];
 main.setTransform(1,0,0,1,0,0);main.globalAlpha=1;
 if(i>0&&u<.62){single(off[0].getContext('2d'),i-1,t);single(off[1].getContext('2d'),i,t);main.drawImage(off[0],0,0);let p=ease(u/.62);main.save();main.beginPath();let cx=i===5?540:560,cy=i===5?1100:1050;main.arc(cx,cy,Math.max(1,p*1450),0,Math.PI*2);main.clip();main.drawImage(off[1],0,0);main.restore();if(p>.02&&p<.98){main.save();main.beginPath();main.arc(cx,cy,p*1450,0,Math.PI*2);main.strokeStyle=`rgba(246,213,152,${.35*Math.sin(p*Math.PI)})`;main.lineWidth=3;main.stroke();main.restore()}}
 else single(main,i,t);
 window.currentTime=t;
}
window.render=render;window.movieDuration=DURATION;window.filmTitles=titles;
render(0);

</script><script>
const player=document.getElementById('music'),button=document.getElementById('play'),seek=document.getElementById('seek'),clock=document.getElementById('time');let playing=false,epoch=0,offset=0;document.getElementById('transcript').textContent=filmTitles.flat().join(' ');
function drawLoop(now){if(playing){const t=Math.min(movieDuration,offset+(now-epoch)/1000);render(t);seek.value=t;clock.textContent='0:'+String(Math.floor(t)).padStart(2,'0')+' / 0:29';if(t>=movieDuration){playing=false;button.textContent='\u91cd\u64ad';player.pause()}}requestAnimationFrame(drawLoop)}
button.onclick=()=>{if(playing){offset=window.currentTime;playing=false;player.pause();button.textContent='\u64ad\u653e'}else{if(offset>=movieDuration-.1||window.currentTime>=movieDuration-.1)offset=0;player.currentTime=offset;player.play().catch(()=>{});epoch=performance.now();playing=true;button.textContent='\u6682\u505c'}};seek.oninput=()=>{offset=Number(seek.value);epoch=performance.now();player.currentTime=offset;render(offset)};requestAnimationFrame(drawLoop);
</script></body></html>
```

