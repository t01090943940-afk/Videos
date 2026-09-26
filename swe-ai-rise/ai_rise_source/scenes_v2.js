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
