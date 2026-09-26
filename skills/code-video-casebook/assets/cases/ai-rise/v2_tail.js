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
