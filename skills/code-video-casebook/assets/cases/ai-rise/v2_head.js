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
