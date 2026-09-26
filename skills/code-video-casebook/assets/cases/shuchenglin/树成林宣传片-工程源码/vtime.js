(()=>{
  let vt=0; const t0=Date.now();
  const rafQ=new Map(); let rafId=1; const timers=new Map(); let tid=1;
  const _pn=performance.now.bind(performance);
  performance.now=()=>vt;
  Date.now=()=>t0+vt;
  const OD=Date;
  window.Date=class extends OD{constructor(...a){ if(a.length===0) super(t0+vt); else super(...a);} static now(){return t0+vt}};
  window.requestAnimationFrame=cb=>{const id=rafId++;rafQ.set(id,cb);return id};
  window.cancelAnimationFrame=id=>{rafQ.delete(id)};
  window.setTimeout=(cb,ms=0,...a)=>{const id=tid++;timers.set(id,{cb,at:vt+Math.max(0,+ms||0),a});return id};
  window.clearTimeout=id=>{timers.delete(id)};
  window.setInterval=(cb,ms=0,...a)=>{const e=Math.max(4,+ms||0);const id=tid++;timers.set(id,{cb,at:vt+e,a,every:e});return id};
  window.clearInterval=window.clearTimeout;
  const animStart=new WeakMap();
  window.__vt=()=>vt;
  window.__advance=(dt)=>{
    const target=vt+dt; let guard=0;
    while(guard++<5000){ let nid=null,nt=null; for(const [id,t] of timers){ if(t.at<=target && (!nt||t.at<nt.at)){nid=id;nt=t;} } if(!nt)break;
      vt=Math.max(vt,nt.at); if(nt.every) nt.at+=nt.every; else timers.delete(nid);
      try{ typeof nt.cb==='function'?nt.cb(...nt.a):(0,eval)(nt.cb)}catch(e){console.error(e)} }
    vt=target;
    const cbs=[...rafQ.values()]; rafQ.clear(); for(const cb of cbs){try{cb(vt)}catch(e){console.error(e)}}
    try{ for(const a of document.getAnimations()){ if(!animStart.has(a)) animStart.set(a, vt-(a.currentTime||0)); a.pause(); a.currentTime=vt-animStart.get(a);} }catch(e){}
    document.querySelectorAll('video').forEach(v=>{ if(v.__vt0===undefined){v.__vt0=vt;} try{ v.pause(); if(v.duration) v.currentTime=((vt-v.__vt0)/1000)%v.duration; }catch(e){} });
  };
})();
