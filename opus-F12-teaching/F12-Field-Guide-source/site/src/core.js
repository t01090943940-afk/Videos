/* ================= core ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const h=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fmtBytes=b=>b===0?'0 B':b<1000?b+' B':b<1e6?(b/1000).toFixed(1)+' kB':(b/1e6).toFixed(1)+' MB';
const fmtMs=ms=>ms<1000?Math.round(ms)+' ms':(ms/1000).toFixed(2)+' s';
const now=()=>performance.now();
const store={get(k,d){try{const v=localStorage.getItem('f12g:'+k);return v===null?d:JSON.parse(v)}catch{return d}},set(k,v){try{localStorage.setItem('f12g:'+k,JSON.stringify(v))}catch{}}};

const bus={h:{},on(e,f){(this.h[e]=this.h[e]||[]).push(f)},emit(e,d){(this.h[e]||[]).forEach(f=>{try{f(d)}catch(err){console.error(err)}})}};
const track=t=>bus.emit('task',t);

const IC={
 clear:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M4.2 11.8l7.6-7.6"/></svg>',
 rec:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4.2"/></svg>',
 reload:'<svg class="i" viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M13 2.5v3h-3"/></svg>',
 eye:'<svg class="i" viewBox="0 0 16 16"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>',
 gear:'<svg class="i" viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/></svg>',
 dl:'<svg class="i" viewBox="0 0 16 16"><path d="M8 2v8M5 7l3 3 3-3M3 13.5h10"/></svg>',
 up:'<svg class="i" viewBox="0 0 16 16"><path d="M8 14V6M5 9l3-3 3 3M3 2.5h10"/></svg>',
 funnel:'<svg class="i" viewBox="0 0 16 16"><path d="M2 3h12l-4.5 5.5V13l-3-1.5v-3z"/></svg>',
 resume:'<svg class="i" viewBox="0 0 16 16"><path d="M3 3v10"/><path d="M6.5 3l7 5-7 5z" fill="currentColor"/></svg>',
 over:'<svg class="i" viewBox="0 0 16 16"><path d="M2.5 9a5.5 5.5 0 0 1 10.3-2.6"/><path d="M13.3 2.8v3.8H9.6"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor"/></svg>',
 into:'<svg class="i" viewBox="0 0 16 16"><path d="M8 1.5v7.5M5 6l3 3 3-3"/><circle cx="8" cy="13" r="1.3" fill="currentColor"/></svg>',
 out:'<svg class="i" viewBox="0 0 16 16"><path d="M8 10V2.5M5 5.5l3-3 3 3"/><circle cx="8" cy="13" r="1.3" fill="currentColor"/></svg>',
 step:'<svg class="i" viewBox="0 0 16 16"><path d="M2 8h9M8 5l3 3-3 3"/><circle cx="13.5" cy="8" r="1.2" fill="currentColor"/></svg>',
 deact:'<svg class="i" viewBox="0 0 16 16"><path d="M2 4.5h8l3.5 3.5-3.5 3.5H2z"/><path d="M1.5 14L14 2"/></svg>',
 trash:'<svg class="i" viewBox="0 0 16 16"><path d="M3 4.5h10M6 4.5V3h4v1.5M4.5 4.5l.7 9h5.6l.7-9"/></svg>',
 play:'<svg class="i" viewBox="0 0 16 16"><path d="M4.5 3l8 5-8 5z" fill="currentColor"/></svg>',
 plus:'<svg class="i" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',
};

/* ---------- simulator state ---------- */
const ST={open:true,dock:'bottom',panel:'elements',inspecting:false,device:false,drawer:false,drawerTab:'console',sel:null,
 throttle:'none',cpu:1,offline:false,disableCache:true,preserve:false,blocked:new Set(),jsDisabled:false,forceHover:new WeakSet(),
 scheme:'light',vision:'none',paint:false,shifts:false,fps:false,hidden:new WeakSet(),loadCount:0,coverage:null,changes:[]};
const PANELS=[['elements','Elements'],['console','Console'],['sources','Sources'],['network','Network'],['performance','Performance'],['memory','Memory'],['application','Application'],['lighthouse','Lighthouse']];

/* ---------- toast inside the simulated browser ---------- */
let toastT;function toast(msg){const b=$('#browser');let t=$('.toast',b);if(!t){t=h('<div class="toast"></div>');b.appendChild(t)}t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2200)}

/* ---------- context menus ---------- */
function openMenu(x,y,items,anchor=$('#browser')){closeMenu();const m=h('<div class="menu" role="menu"></div>');
 items.forEach(it=>{if(it==='-'){m.appendChild(document.createElement('hr'));return}if(it.head){m.appendChild(h(`<div class="h">${esc(it.head)}</div>`));return}
  const b=h(`<button role="menuitem">${esc(it.label)}${it.hint?`<small>${esc(it.hint)}</small>`:''}</button>`);b.onclick=e=>{e.stopPropagation();closeMenu();it.act&&it.act()};m.appendChild(b)});
 anchor.appendChild(m);const ar=anchor.getBoundingClientRect();let lx=x-ar.left,ly=y-ar.top;const mw=m.offsetWidth,mh=m.offsetHeight;if(lx+mw>ar.width-4)lx=ar.width-mw-4;if(ly+mh>ar.height-4)ly=Math.max(4,ly-mh);m.style.left=lx+'px';m.style.top=ly+'px';
 setTimeout(()=>document.addEventListener('mousedown',closeMenuOut,{once:true}),0);return m}
function closeMenuOut(e){if(!e.target.closest('.menu'))closeMenu();else document.addEventListener('mousedown',closeMenuOut,{once:true})}
function closeMenu(){$$('.menu').forEach(m=>m.remove())}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Copied to clipboard')}catch{toast('Clipboard blocked here — text logged to Console');CON.add({type:'log',args:[t],src:'copy'})}}

/* ================= demo page (lives in a shadow root) ================= */
const PRODUCTS=[
 {id:'guji',name:'Ethiopia Guji',notes:'Peach · jasmine · honey',price:18.5,art:'linear-gradient(135deg,#C8553D,#F28F3B)'},
 {id:'huila',name:'Colombia Huila',notes:'Red apple · cocoa · caramel',price:17,art:'linear-gradient(135deg,#588B8B,#C8D5B9)'},
 {id:'nyeri',name:'Kenya Nyeri',notes:'Blackcurrant · grapefruit',price:19.5,art:'linear-gradient(135deg,#6B4E71,#E0A458)'}];

/* CSS rule model = the site's app.css. Styles pane edits this. */
let RULES=[
 {sel:'body.shop',d:[['margin','0'],['font-family','"IBM Plex Sans", system-ui, sans-serif'],['color','#1C1714'],['background','#F4EFE8'],['line-height','1.5']]},
 {sel:'.nav',d:[['display','flex'],['align-items','center'],['gap','18px'],['padding','14px 24px'],['border-bottom','1px solid #E3D9CC'],['position','sticky'],['top','0'],['background','#F4EFE8'],['z-index','5']]},
 {sel:'.logo',d:[['font','800 18px/1 "Bricolage Grotesque", sans-serif'],['letter-spacing','0.12em'],['color','#1C1714'],['text-decoration','none'],['margin-right','auto']]},
 {sel:'.nav-link',d:[['color','#5B4F45'],['text-decoration','none'],['font-size','14px']]},
 {sel:'.icon-btn',d:[['border','1px solid #D8CCBD'],['background','transparent'],['color','#1C1714'],['border-radius','999px'],['padding','5px 12px'],['font-family','inherit'],['font-size','13px'],['cursor','pointer']]},
 {sel:'.hero',d:[['display','grid'],['grid-template-columns','1.3fr 1fr'],['gap','24px'],['align-items','center'],['padding','32px 24px 28px']]},
 {sel:'.hero-title',d:[['font','800 44px/1.02 "Bricolage Grotesque", sans-serif'],['letter-spacing','-0.02em'],['margin','0']]},
 {sel:'.lede',d:[['color','#6A5D52'],['font-size','16px'],['margin','10px 0 18px']]},
 {sel:'.hero-art',d:[['aspect-ratio','4 / 3'],['border-radius','16px'],['background','linear-gradient(135deg, #C8553D, #F28F3B 55%, #FFD6A5)']]},
 {sel:'.btn',d:[['display','inline-block'],['background','#333'],['color','#fff'],['padding','10px 16px'],['border','0'],['border-radius','6px'],['font-family','inherit'],['font-size','14px'],['font-weight','600'],['text-decoration','none'],['cursor','pointer']]},
 {sel:'.btn.cta',d:[['background','#E4572E'],['padding','14px 28px'],['border-radius','999px'],['font-size','16px'],['transition','transform .15s, box-shadow .15s']]},
 {sel:'.btn.cta:hover',d:[['transform','translateY(-2px)'],['box-shadow','0 8px 20px rgb(228 87 46 / 40%)']]},
 {sel:'.cards',d:[['display','grid'],['grid-template-columns','repeat(3, 1fr)'],['gap','16px'],['padding','0 24px 24px']]},
 {sel:'.card',d:[['background','#fff'],['border-radius','12px'],['overflow','hidden'],['box-shadow','0 1px 0 #E3D9CC']]},
 {sel:'.thumb',d:[['height','96px'],['background','var(--art)']]},
 {sel:'.card h3',d:[['font-size','15px'],['margin','10px 12px 2px']]},
 {sel:'.notes',d:[['font-size','12.5px'],['color','#8A7B6D'],['margin','0 12px']]},
 {sel:'.card .row',d:[['display','flex'],['justify-content','space-between'],['align-items','center'],['padding','10px 12px 12px']]},
 {sel:'.price',d:[['font','600 13px "JetBrains Mono", monospace'],['color','#5B4F45']]},
 {sel:'.btn.add',d:[['padding','6px 12px'],['font-size','13px']]},
 {sel:'.cart-bar',d:[['display','flex'],['justify-content','space-between'],['align-items','center'],['gap','12px'],['margin','0 24px 18px'],['padding','12px 16px'],['background','#1C1714'],['color','#F4EFE8'],['border-radius','12px']]},
 {sel:'.btn.checkout',d:[['background','#F4EFE8'],['color','#1C1714']]},
 {sel:'.news',d:[['display','flex'],['gap','12px'],['align-items','center'],['justify-content','space-between'],['padding','8px 24px 48px'],['color','#6A5D52']]},
 {sel:'.toasts',d:[['position','sticky'],['bottom','14px'],['height','0'],['display','flex'],['flex-direction','column'],['justify-content','flex-end'],['align-items','center'],['gap','8px']]},
 {sel:'.toast',d:[['background','#1C1714'],['color','#fff'],['padding','10px 16px'],['border-radius','10px'],['font-size','14px'],['box-shadow','0 8px 20px rgb(0 0 0 / 25%)']]},
 {sel:'.toast.err',d:[['background','#B3261E']]},
 {sel:'body.shop[data-theme="dark"]',d:[['background','#171311'],['color','#F1E9DF']]},
 {sel:'[data-theme="dark"] .nav',d:[['background','#171311'],['border-color','#3A302A']]},
 {sel:'[data-theme="dark"] .card',d:[['background','#241E1B'],['box-shadow','none']]},
 {sel:'[data-theme="dark"] .logo, [data-theme="dark"] .icon-btn',d:[['color','#F1E9DF']]},
 {sel:'.hero',media:'(max-width: 620px)',d:[['grid-template-columns','1fr']]},
 {sel:'.hero-art',media:'(max-width: 620px)',d:[['aspect-ratio','16 / 6']]},
 {sel:'.hero-title',media:'(max-width: 620px)',d:[['font-size','34px']]},
 {sel:'.cards',media:'(max-width: 620px)',d:[['grid-template-columns','1fr']]},
 {sel:'.nav-link',media:'(max-width: 440px)',d:[['display','none']]},
];
RULES.forEach((r,i)=>{r.id=i;r.d=r.d.map(([p,v])=>({p,v,on:true,orig:v}))});
function cssText(forSources){let out='/* Driftwood · app.css */\n';let line=2;const lines=[];
 const emit=s=>{out+=s+'\n';line++};
 let lastMedia=null;
 RULES.forEach(r=>{if(r.media!==lastMedia){if(lastMedia)emit('}');if(r.media)emit(`@media ${r.media} {`);lastMedia=r.media}
  const ind=r.media?'  ':'';r.line=line;emit(`${ind}${r.sel} {`);r.d.forEach(dd=>{dd.line=line;emit(`${ind}  ${dd.on?'':'/* '}${dd.p}: ${dd.v};${dd.on?'':' */'}`)});emit(`${ind}}`)});
 if(lastMedia)emit('}');return out}
function genCSS(){let css='';RULES.forEach(r=>{const body=r.d.filter(d=>d.on).map(d=>`${d.p}:${d.v}`).join(';');let sel=r.sel;if(sel.includes(':hover'))sel=sel+', '+sel.replace(/:hover/g,'.__hov');const blk=`${sel}{${body}}`;css+=r.media?`@container page ${r.media}{${blk}}`:blk});return css}
function specificity(sel){const s=sel.replace(/::[\w-]+/g,'');const a=(s.match(/#[\w-]+/g)||[]).length,b=(s.match(/(\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+)/g)||[]).length,c=(s.replace(/(\.[\w-]+|\[[^\]]+\]|:[\w-]+|#[\w-]+)/g,' ').match(/(^|[\s>+~])[a-z][\w-]*/gi)||[]).length;return a*10000+b*100+c}

const pageHost=$('#pageHost');const shadow=pageHost.attachShadow({mode:'open'});
shadow.innerHTML=`<style>:host{display:block;position:absolute;inset:0;overflow:auto;container-type:inline-size;container-name:page;background:#F4EFE8;scrollbar-width:thin}
html{display:block;min-height:100%}head{display:none}
.__web-inspector-hide-shortcut__{visibility:hidden!important}
.hero-art.__blocked{background:repeating-linear-gradient(45deg,#e8e0d6 0 10px,#efe8df 10px 20px)!important;outline:1px dashed #c9bba9}
.__nojs .btn{cursor:not-allowed}
</style><style id="appcss"></style>`;
const appcss=$('#appcss',shadow);
function applyCSS(){cssText();appcss.textContent=ST.effBlocked&&ST.effBlocked.has('app.css')?'':genCSS();bus.emit('css')}
const HTML=document.createElement('html');HTML.setAttribute('lang','en');
const HEAD=document.createElement('head');HEAD.innerHTML='<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Driftwood — Specialty Coffee</title><link rel="manifest" href="/manifest.json"><script src="/js/vendor.min.js" defer></'+'script><script src="/js/app.js" type="module"></'+'script><script src="/js/cart.js" type="module"></'+'script>';
const BODY=document.createElement('body');BODY.className='shop';BODY.dataset.theme='light';
BODY.innerHTML=`<nav class="nav"><a class="logo" href="/">DRIFTWOOD</a><a class="nav-link" href="/shop">Shop</a><a class="nav-link" href="/guides">Brew guides</a><button class="icon-btn theme-toggle" aria-label="Toggle dark theme">☾ Theme</button><button class="icon-btn cart-pill">Cart <b class="count">0</b></button></nav>
<header class="hero"><div><h1 class="hero-title">Slow coffee, fast site.</h1><p class="lede">Single-origin beans, roasted every Tuesday in small batches.</p><a class="btn cta" href="#shop">Order beans →</a></div><div class="hero-art" role="img" aria-label="Pour-over coffee"></div></header>
<section class="cards" id="shop">${PRODUCTS.map(p=>`<article class="card" data-id="${p.id}" style="--art:${p.art}"><div class="thumb"></div><h3>${p.name}</h3><p class="notes">${p.notes}</p><div class="row"><span class="price">$${p.price.toFixed(2)}</span><button class="btn add">Add</button></div></article>`).join('')}</section>
<aside class="cart-bar"><span>Cart: <b class="count">0</b> items · <b class="total">$0.00</b></span><button class="btn checkout">Checkout</button></aside>
<section class="news"><p>Roast-day emails, once a week.</p><button class="btn subscribe">Subscribe</button></section>
<div class="toasts" aria-live="polite"></div>`;
HTML.append(HEAD,BODY);shadow.appendChild(HTML);
const PAGE={root:HTML,body:BODY,shadow,q:s=>BODY.querySelector(s),qa:s=>[...BODY.querySelectorAll(s)]};

/* ---------- storage model (Application panel) ---------- */
const LS=new Map([['theme','light'],['cart','[]'],['lastVisit','2026-09-24T21:14:03Z'],['ab_hero','B'],['consent','{"analytics":true,"ads":false}']]);
const SS=new Map([['checkoutStep','1'],['utm_source','newsletter']]);
let COOKIES=[
 {name:'session',value:'8f2c1d77e91a4b0c',domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:true,secure:true,sameSite:'Lax',priority:'Medium'},
 {name:'csrf_token',value:'Zk3r9Qa7Lm2x',domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:true,secure:true,sameSite:'Strict',priority:'High'},
 {name:'cart_id',value:'c_20931',domain:'.driftwood.coffee',path:'/',expires:'2026-10-24T21:14:03Z',httpOnly:false,secure:false,sameSite:'None',priority:'Medium',issue:'SameSite=None without Secure: this cookie is rejected by the browser.'},
 {name:'_ga',value:'GA1.1.447190.1727212443',domain:'.driftwood.coffee',path:'/',expires:'2027-10-29T09:00:00Z',httpOnly:false,secure:false,sameSite:'Lax',priority:'Medium'},
 {name:'theme',value:'light',domain:'driftwood.coffee',path:'/',expires:'2027-09-24T21:14:03Z',httpOnly:false,secure:true,sameSite:'Lax',priority:'Low'}];
let IDB=[{key:'A-1042',value:'{item:"Ethiopia Guji", qty:2, total:37}'},{key:'A-1043',value:'{item:"Colombia Huila", qty:1, total:17}'},{key:'A-1044',value:'{item:"Kenya Nyeri", qty:3, total:58.5}'}];
let CACHES=[{name:'sw-v3',entries:[['/','text/html','14.2 kB'],['/css/app.css','text/css','8.1 kB'],['/js/app.js','text/javascript','42.7 kB'],['/js/cart.js','text/javascript','6.4 kB'],['/img/hero.avif','image/avif','182 kB']]}];
const SW={status:'activated and is running',offline:false,updateOnReload:false,bypass:false,version:'#412'};

/* ================= console model ================= */
const CON={msgs:[],listeners:[],add(m){m.id=CON.msgs.length?CON.msgs[CON.msgs.length-1].id+1:1;m.time=Date.now();
  const last=CON.msgs[CON.msgs.length-1];
  if(last&&last.type===m.type&&m.type!=='result'&&m.type!=='input'&&!m.table&&last.sig&&last.sig===(m.sig=sigOf(m))){last.count=(last.count||1)+1;CON.listeners.forEach(f=>f('update',last));return last}
  m.sig=m.sig||sigOf(m);CON.msgs.push(m);CON.listeners.forEach(f=>f('add',m));bus.emit('console-count');return m},
 clear(){CON.msgs=[];CON.listeners.forEach(f=>f('clear'));bus.emit('console-count')}};
function sigOf(m){try{return m.type+'|'+(m.src||'')+'|'+m.args.map(a=>typeof a==='object'&&a!==null?'[o]':String(a)).join(' ')}catch{return ''}}
const pageConsole={};
['log','info','warn','error','debug'].forEach(k=>pageConsole[k]=(...args)=>CON.add({type:k==='debug'?'verbose':k,args,src:pageConsole._src||'VM1:1'}));
pageConsole.table=(data)=>CON.add({type:'log',table:data,args:[data],src:pageConsole._src||'VM1:1'});
const timers={},counters={};
pageConsole.time=(l='default')=>{timers[l]=now()};
pageConsole.timeEnd=(l='default')=>{if(timers[l]==null){pageConsole.warn(`Timer '${l}' does not exist`);return}const d=now()-timers[l];delete timers[l];CON.add({type:'log',args:[`${l}: ${d.toFixed(3)} ms`],src:pageConsole._src||'VM1:1',plain:true})};
pageConsole.count=(l='default')=>{counters[l]=(counters[l]||0)+1;CON.add({type:'log',args:[`${l}: ${counters[l]}`],plain:true,src:pageConsole._src||'VM1:1'})};
pageConsole.group=(...a)=>CON.add({type:'log',group:true,args:a.length?a:['console.group'],src:'VM1:1'});pageConsole.groupEnd=()=>{};
pageConsole.trace=(...a)=>CON.add({type:'log',args:['console.trace',...a],trace:['(anonymous) @ VM1:1'],src:'VM1:1'});
pageConsole.assert=(c,...a)=>{if(!c)CON.add({type:'error',args:['Assertion failed:',...a],src:'VM1:1'})};
pageConsole.dir=(o)=>CON.add({type:'log',args:[o],src:'VM1:1'});
pageConsole.clear=()=>{CON.clear();CON.add({type:'verbose',args:['Console was cleared'],plain:true,src:''})};
function withSrc(src,fn){const p=pageConsole._src;pageConsole._src=src;try{fn()}finally{pageConsole._src=p}}

/* ================= network model ================= */
const THROTTLE={none:{k:1,label:'No throttling'},fast4g:{k:1.7,label:'Fast 4G'},slow4g:{k:3.4,label:'Slow 4G'},'3g':{k:5.5,label:'3G'},offline:{k:1,label:'Offline'}};
const RESOURCES=[
 {name:'shop',path:'/shop',type:'document',mime:'text/html',init:'Other',size:14200,start:0,dur:212,first:true},
 {name:'app.css',path:'/css/app.css',type:'stylesheet',mime:'text/css',init:'shop',size:8100,start:226,dur:64,cache:true},
 {name:'IBMPlexSans.woff2',path:'/fonts/IBMPlexSans.woff2',type:'font',mime:'font/woff2',init:'app.css',size:48300,start:298,dur:88,cache:true},
 {name:'app.js',path:'/js/app.js',type:'script',mime:'text/javascript',init:'shop',size:42700,start:228,dur:120,cache:true},
 {name:'cart.js',path:'/js/cart.js',type:'script',mime:'text/javascript',init:'app.js:3',size:6400,start:352,dur:41,cache:true},
 {name:'vendor.min.js',path:'/js/vendor.min.js',type:'script',mime:'text/javascript',init:'shop',size:188000,start:230,dur:170,cache:true},
 {name:'hero.avif',path:'/img/hero.avif',type:'avif',mime:'image/avif',init:'shop',size:182000,start:240,dur:260,cache:true},
 {name:'guji.webp',path:'/img/guji.webp',type:'webp',mime:'image/webp',init:'shop',size:34200,start:420,dur:96,cache:true},
 {name:'huila.webp',path:'/img/huila.webp',type:'webp',mime:'image/webp',init:'shop',size:31800,start:424,dur:91,cache:true},
 {name:'nyeri.webp',path:'/img/nyeri.webp',type:'webp',mime:'image/webp',init:'shop',size:36000,start:430,dur:102,cache:true},
 {name:'products?limit=12',path:'/api/products?limit=12',type:'fetch',mime:'application/json',init:'app.js:41',size:3100,start:520,dur:148,api:true},
 {name:'analytics.js',path:'/js/analytics.js',type:'script',mime:'text/javascript',init:'shop',size:22500,start:560,dur:76,cache:true},
 {name:'og-image.png',path:'/img/og-image.png',type:'png',mime:'text/html',init:'shop',size:512,start:600,dur:48,status:404},
 {name:'collect?v=2',path:'/collect?v=2&tid=G-D1',type:'ping',mime:'text/plain',init:'analytics.js:1',size:0,start:760,dur:35,status:204},
 {name:'manifest.json',path:'/manifest.json',type:'manifest',mime:'application/manifest+json',init:'Other',size:1100,start:820,dur:12,cache:true},
 {name:'sw.js',path:'/sw.js',type:'script',mime:'text/javascript',init:'app.js:88',size:3400,start:840,dur:26},
 {name:'favicon.svg',path:'/favicon.svg',type:'svg+xml',mime:'image/svg+xml',init:'Other',size:912,start:870,dur:14,cache:true}];
const TYPEGROUP={document:'Doc',stylesheet:'CSS',font:'Font',script:'JS',avif:'Img',webp:'Img',png:'Img','svg+xml':'Img',fetch:'Fetch/XHR',xhr:'Fetch/XHR',ping:'Other',manifest:'Manifest'};
const NET={entries:[],seq:0,navStart:0,dcl:0,load:0,listeners:[],emit(){this.listeners.forEach(f=>f())},
 mk(o){const k=THROTTLE[ST.throttle].k;const fromCache=!ST.disableCache&&o.cache&&ST.loadCount>1;const blocked=ST.blocked.has(o.name);const offline=ST.offline||ST.throttle==='offline';
  const dur=fromCache?1+Math.random()*3:o.dur*k*(ST.cpu>1?1.05:1)*(0.9+Math.random()*0.2);
  const e={id:++NET.seq,name:o.name,url:'https://driftwood.coffee'+o.path,path:o.path,method:o.method||'GET',type:o.type,mime:o.mime,initiator:o.init,
   status:blocked?0:offline?0:(o.status||200),size:o.size,transferred:fromCache?0:o.size+ (o.size?420:180),fromCache,blocked,failed:blocked||offline,
   start:o.start*k,dur:blocked||offline?2:dur,phases:null,api:o.api,body:o.body,resBody:o.resBody,t0:now(),reqBody:o.reqBody};
  const d=e.dur;e.phases=o.first&&!fromCache?{queue:d*.04,dns:d*.1,connect:d*.13,ssl:d*.12,ttfb:d*.36,download:d*.25}:fromCache?{queue:d*.4,ttfb:d*.4,download:d*.2}:{queue:d*.08,ttfb:d*.6,download:d*.32};
  e.statusText=e.blocked?'(blocked:devtools)':offline?'(failed)':({200:'OK',204:'No Content',404:'Not Found',500:'Internal Server Error',201:'Created'})[e.status]||'';
  return e},
 pageLoad(){if(!ST.preserve)NET.entries=[];NET.navStart=now();ST.loadCount++;const k=THROTTLE[ST.throttle].k;
  RESOURCES.forEach(r=>{const e=NET.mk(r);e.t0=NET.navStart+e.start/ (k>2?1.4:1)*0+e.start;NET.entries.push(e)});
  NET.dcl=412*k;NET.load=1210*k;NET.emit();
  // console side effects of a load
  setTimeout(()=>{if(ST.offline||ST.throttle==='offline'){CON.add({type:'error',args:['GET https://driftwood.coffee/shop net::ERR_INTERNET_DISCONNECTED'],src:'shop'});return}
   if(!ST.blocked.has('og-image.png'))CON.add({type:'error',args:['GET https://driftwood.coffee/img/og-image.png 404 (Not Found)'],src:'shop:1',net:true});
   CON.add({type:'warn',args:['DevTools failed to load source map: Could not load content for https://driftwood.coffee/js/vendor.min.js.map: HTTP error: status code 404'],src:''});
   if(ST.blocked.has('app.js'))CON.add({type:'error',args:['GET https://driftwood.coffee/js/app.js net::ERR_BLOCKED_BY_CLIENT'],src:'shop:12'});
   else withSrc('app.js:41',()=>pageConsole.info('Driftwood v2.4.1 · 12 products loaded'));
   withSrc('analytics.js:1',()=>pageConsole.debug('[analytics] page_view sent'));
  },Math.min(900,700*k))},
 request(url,opts={}){const path=url.replace(/^https?:\/\/[^/]+/,'');const name=path.split('/').pop()||path;const method=(opts.method||'GET').toUpperCase();
  let status=200,resBody='{}';if(path.startsWith('/api/cart')&&method==='POST'){status=500;resBody='{\n  "error": "inventory service timeout",\n  "requestId": "7f3a9c2e-51b0"\n}'}
  else if(path.startsWith('/api/cart')){resBody=JSON.stringify({items:cart.items},null,2)}else if(path.startsWith('/api/products')){resBody=JSON.stringify(PRODUCTS.map(({art,...p})=>p),null,2)}else if(path.startsWith('/api/')){status=404;resBody='{"error":"not found"}'}
  const e=NET.mk({name,path,type:'fetch',mime:'application/json',init:opts.initiator||'VM1:1',size:resBody.length,start:0,dur:opts.dur||(status===500?310:140),status,method});
  e.reqBody=opts.body||null;e.resBody=resBody;e.t0=now();e.start=now()-(NET.navStart||now());
  if(ST.recordingNet!==false)NET.entries.push(e);NET.emit();
  return new Promise((res,rej)=>{setTimeout(()=>{if(e.failed){const err=new TypeError('Failed to fetch');CON.add({type:'error',args:[`${method} ${e.url} ${e.blocked?'net::ERR_BLOCKED_BY_CLIENT':'net::ERR_INTERNET_DISCONNECTED'}`],src:opts.initiator||'VM1:1'});rej(err);return}
   if(status>=400)CON.add({type:'error',args:[`${method} ${e.url} ${status} (${e.statusText})`],src:opts.initiator||'VM1:1',net:true});
   res({ok:status<400,status,statusText:e.statusText,url:e.url,headers:{'content-type':'application/json'},json:async()=>JSON.parse(resBody),text:async()=>resBody,[Symbol.toStringTag]:'Response'})},e.dur)})}};
const simFetch=(u,o)=>NET.request(String(u),o);

/* ================= demo app logic ("app.js" / "cart.js") ================= */
const cart={items:[]};const orders=[{id:'A-1042',item:'Ethiopia Guji',qty:2,total:37},{id:'A-1043',item:'Colombia Huila',qty:1,total:17},{id:'A-1044',item:'Kenya Nyeri',qty:3,total:58.5}];
const toastCache=[];
function round(n){return Math.round(n*100)/100}
function calcTotal(items){let total=0;for(const item of items){const line=item.price*item.qty;total+=line}if(total>100)total*=0.9;return round(total)}
function renderCart(){const n=cart.items.reduce((a,i)=>a+i.qty,0);PAGE.qa('.count').forEach(c=>c.textContent=n);PAGE.q('.total').textContent='$'+calcTotal(cart.items).toFixed(2)}
function saveCart(){LS.set('cart',JSON.stringify(cart.items.map(i=>({id:i.id,qty:i.qty}))));bus.emit('storage')}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);const it=cart.items.find(i=>i.id===id);if(it)it.qty++;else cart.items.push({id,name:p.name,price:p.price,qty:1});saveCart();renderCart();withSrc('cart.js:24',()=>pageConsole.debug(`added ${p.name} → cart has ${cart.items.length} line(s)`))}
function pageToast(msg,err){const t=document.createElement('div');t.className='toast'+(err?' err':'');t.textContent=msg;PAGE.q('.toasts').appendChild(t);if(window.__memToastHook)window.__memToastHook();setTimeout(()=>{t.remove();toastCache.push(t)},2600)}
function setTheme(v){BODY.dataset.theme=v;LS.set('theme',v);const c=COOKIES.find(c=>c.name==='theme');if(c)c.value=v;bus.emit('storage')}
async function checkout(){if(!cart.items.length){pageToast('Your cart is empty — add a coffee first.');return}
 const total=await DBG.run(cart);  // may pause on breakpoints
 const res=await simFetch('/api/cart',{method:'POST',body:JSON.stringify({total}),initiator:'cart.js:16'}).catch(()=>null);
 if(!res||!res.ok)pageToast(`Checkout failed (${res?res.status:'offline'}). Try again.`,true);}
const LISTENERS=[];
function on(el,type,fn,src){const L={el,type,src,fn};el.addEventListener(type,e=>{if(L.removed||ST.jsDisabled||ST.effBlocked&&ST.effBlocked.has(src.split(':')[0]))return;perfHook(type,el);fn(e)});LISTENERS.push(L)}
function wirePage(){
 on(PAGE.q('.theme-toggle'),'click',()=>setTheme(BODY.dataset.theme==='dark'?'light':'dark'),'app.js:57');
 PAGE.qa('.btn.add').forEach(b=>on(b,'click',()=>addToCart(b.closest('.card').dataset.id),'cart.js:18'));
 on(PAGE.q('.btn.checkout'),'click',()=>checkout(),'cart.js:31');
 on(PAGE.q('.cart-pill'),'click',()=>PAGE.q('.cart-bar').scrollIntoView({behavior:'smooth',block:'center'}),'app.js:63');
 on(PAGE.q('.btn.cta'),'click',e=>{e.preventDefault();PAGE.q('#shop').scrollIntoView({behavior:'smooth'})},'app.js:49');
 on(PAGE.q('.btn.subscribe'),'click',()=>pageToast('Subscribed ✓ See you on roast day.'),'app.js:72');
 PAGE.qa('a').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
}
function perfHook(type,el){bus.emit('page-event',{type,el,t:now()})}
function reloadPage(silent){const vp=$('#viewport');vp.style.transition='none';vp.style.opacity='.25';ST.effBlocked=new Set(ST.blocked);
 PAGE.q('.hero-art').classList.toggle('__blocked',ST.blocked.has('hero.avif'));
 NET.pageLoad();applyCSS();bus.emit('reload');
 const off=ST.offline||ST.throttle==='offline';let dino=$('#dino');if(off&&!dino){dino=h('<div id="dino" style="position:absolute;inset:0;z-index:15;background:#fff;color:#5F6368;display:flex;flex-direction:column;justify-content:center;padding:0 12%;font:400 15px/1.6 var(--body)"><div style="font:600 22px var(--body);color:#202124;margin-bottom:8px">No internet</div><div>Try checking the network cables, modem, and router.</div><div style="font:400 12px var(--mono);margin-top:14px">ERR_INTERNET_DISCONNECTED</div></div>');$('#pagearea').appendChild(dino)}else if(!off&&dino)dino.remove();
 setTimeout(()=>{vp.style.transition='opacity .35s';vp.style.opacity='1'},Math.min(900,260*THROTTLE[ST.throttle].k));
 if(silent!==true)track('reload')}
