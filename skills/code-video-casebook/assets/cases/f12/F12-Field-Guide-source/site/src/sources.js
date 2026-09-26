/* ================= Sources + debugger ================= */
const CART_JS=`// cart.js — cart state, totals and checkout
import { api } from './api.js';
import { products, round, toast } from './app.js';

export const cart = { items: [] };

/** Sum the cart and apply the 10% bulk discount */
export function calcTotal(items) {
  let total = 0;
  for (const item of items) {
    const line = item.price * item.qty;
    total += line;
  }
  if (total > 100) total *= 0.9;
  return round(total);
}

export function addToCart(id) {
  const p = products.find(x => x.id === id);
  const it = cart.items.find(i => i.id === id);
  if (it) it.qty++;
  else cart.items.push({ id, name: p.name, price: p.price, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart.items));
  console.debug(\`added \${p.name} → cart has \${cart.items.length} line(s)\`);
  renderCart();
}

export function renderCart() {
  const n = cart.items.reduce((a, i) => a + i.qty, 0);
  document.querySelectorAll('.count').forEach(c => c.textContent = n);
  document.querySelector('.total').textContent = '$' + calcTotal(cart.items).toFixed(2);
}

export async function checkout() {
  const total = calcTotal(cart.items);
  const res = await api.post('/cart', { total });
  if (!res.ok) toast(\`Checkout failed (\${res.status}). Try again.\`);
  return res;
}

document.querySelectorAll('.btn.add').forEach(b =>
  b.addEventListener('click', () => addToCart(b.closest('.card').dataset.id)));
document.querySelector('.btn.checkout')
  .addEventListener('click', checkout);`;
const APP_JS=`// app.js — Driftwood storefront
import { cart, renderCart } from './cart.js';
import './vendor.min.js';

export const VERSION = '2.4.1';
export const products = [];

export function round(n) {
  return Math.round(n * 100) / 100;
}

export function toast(msg, isError = false) {
  const t = document.createElement('div');
  t.className = 'toast' + (isError ? ' err' : '');
  t.textContent = msg;
  document.querySelector('.toasts').append(t);
  setTimeout(() => {
    t.remove();
    toastCache.push(t);   // ⚠ keeps a reference: detached DOM leak
  }, 2600);
}

export const toastCache = [];

function restoreCart() {
  const saved = JSON.parse(localStorage.getItem('cart') || '[]');
  saved.forEach(({ id, qty }) => {
    const p = products.find(x => x.id === id);
    if (p) cart.items.push({ ...p, qty });
  });
  renderCart();
}

async function loadProducts() {
  const res = await fetch('/api/products?limit=12');
  products.push(...(await res.json()));
  restoreCart();
}

loadProducts().then(() =>
  console.info(\`Driftwood v\${VERSION} · \${products.length} products loaded\`));

// Smooth-scroll the hero call to action
const cta = document.querySelector('.btn.cta');
cta.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
});

// Theme toggle, persisted in localStorage
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem('theme', next);
});

document.querySelector('.cart-pill').addEventListener('click', () =>
  document.querySelector('.cart-bar').scrollIntoView({ block: 'center' }));

// Newsletter
const subscribe = document.querySelector('.btn.subscribe');
subscribe.addEventListener('click', () =>
  toast('Subscribed ✓ See you on roast day.'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`;
const VENDOR_MIN=`!function(e,t){"object"==typeof exports?module.exports=t():e.tiny=t()}(this,function(){"use strict";var e={},t=function(n){return n&&n.__esModule?n:{default:n}};function r(n,o){for(var i=0;i<o.length;i++){var a=o[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(n,a.key,a)}}var o=function(){function n(o){this.el=o,this.handlers={}}return n.prototype.on=function(n,o){return(this.handlers[n]=this.handlers[n]||[]).push(o),this},n.prototype.emit=function(n,o){(this.handlers[n]||[]).forEach(function(i){return i(o)})},n}();return e.Emitter=o,e.interop=t,e.define=r,e});`;
const VENDOR_PRETTY=`!function(e, t) {
    "object" == typeof exports ? module.exports = t() : e.tiny = t()
}(this, function() {
    "use strict";
    var e = {}
      , t = function(n) {
        return n && n.__esModule ? n : {
            default: n
        }
    };
    function r(n, o) {
        for (var i = 0; i < o.length; i++) {
            var a = o[i];
            a.enumerable = a.enumerable || !1,
            a.configurable = !0,
            "value" in a && (a.writable = !0),
            Object.defineProperty(n, a.key, a)
        }
    }
    var o = function() {
        function n(o) {
            this.el = o,
            this.handlers = {}
        }
        return n.prototype.on = function(n, o) {
            return (this.handlers[n] = this.handlers[n] || []).push(o),
            this
        }
        ,
        n.prototype.emit = function(n, o) {
            (this.handlers[n] || []).forEach(function(i) {
                return i(o)
            })
        }
        ,
        n
    }();
    return e.Emitter = o,
    e.interop = t,
    e.define = r,
    e
});`;
const INDEX_HTML=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Driftwood — Specialty Coffee</title>
  <link rel="stylesheet" href="/css/app.css">
  <link rel="manifest" href="/manifest.json">
  <meta property="og:image" content="/img/og-image.png">
  <script src="/js/vendor.min.js" defer></script>
  <script src="/js/app.js" type="module"></script>
  <script src="/js/cart.js" type="module"></script>
  <script src="/js/analytics.js" async></script>
</head>
<body class="shop" data-theme="light">
  <nav class="nav">…</nav>
  <header class="hero">…</header>
  <section class="cards" id="shop"></section>  <!-- filled by app.js -->
  <aside class="cart-bar">…</aside>
  <section class="news">…</section>
  <div class="toasts" aria-live="polite"></div>
</body>
</html>`;
const SNIPPETS={'list-cookies.js':`// Snippet: print every readable cookie as a table\nconsole.table(document.cookie.split('; ').map(c => {\n  const [name, ...v] = c.split('=');\n  return { name, value: v.join('=') };\n}));`,
 'outline-everything.js':`// Snippet: outline every element to debug layout\n$$('body *').forEach(el => el.style.outline = '1px solid rgb(255 0 128 / 50%)');\n'outlined ' + $$('body *').length + ' elements';`};
const SRC={files:{'(index)':{kind:'html',text:()=>INDEX_HTML,path:'driftwood.coffee/(index)'},'app.css':{kind:'css',text:()=>cssText(),path:'driftwood.coffee/css/app.css'},'app.js':{kind:'js',text:()=>APP_JS,path:'driftwood.coffee/js/app.js'},'cart.js':{kind:'js',text:()=>CART_JS,path:'driftwood.coffee/js/cart.js'},'vendor.min.js':{kind:'js',text:()=>SRC.pretty?VENDOR_PRETTY:VENDOR_MIN,path:'driftwood.coffee/js/vendor.min.js'}},
 cur:'cart.js',openTabs:['app.js','cart.js'],bps:new Map(),nav:'page',pretty:false,active:true,watch:['total > 50','cart.items.length'],editing:null,
 open(f,line){if(SNIPPETS[f]){SRC.cur=f}else if(!SRC.files[f])return;SRC.cur=f;if(!SRC.openTabs.includes(f))SRC.openTabs.push(f);setPanel('sources');SRC.render();if(line)setTimeout(()=>{const r=$(`#code .ln[data-l="${line}"]`);if(r){const c=$('#code');c.scrollTop=r.offsetTop-c.clientHeight/3;r.style.transition='none';r.style.background='rgba(255,229,153,.25)';setTimeout(()=>{r.style.transition='background 1.2s';r.style.background=''},60)}},30);track('open-source')}};
function hlJS(s){return esc(s).replace(/(\/\/.*$|\/\*\*?.*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)|\b(import|from|export|function|let|const|var|for|of|if|else|return|async|await|new|typeof|this|true|false|null|undefined|in)\b|\b(\d+(?:\.\d+)?)\b/g,(m,c,s1,k,n)=>c?`<span style="color:var(--com);font-style:italic">${c}</span>`:s1?`<span style="color:var(--str)">${s1}</span>`:k?`<span style="color:var(--kw)">${k}</span>`:`<span style="color:var(--num)">${n}</span>`)}
function hlCSS(s){return esc(s).replace(/(\/\*.*?\*\/)|^(\s*)([^:{}]+?)(\s*\{)$|^(\s*)([\w-]+)(:)(.*)$/,(m,c,a,sel,b,i2,p,col,v)=>c?`<span style="color:var(--com)">${c}</span>`:sel?`${a}<span style="color:#E3E3E3">${sel}</span>${b}`:`${i2}<span style="color:var(--pn)">${p}</span>${col}<span style="color:#F29766">${v}</span>`)}
function hlHTML(s){return esc(s).replace(/(&lt;!--.*?--&gt;)|(&lt;\/?)([\w!-]+)|([\w-]+)=(&quot;[^&]*&quot;|"[^"]*")/g,(m,c,lt,tag,an,av)=>c?`<span style="color:var(--com)">${c}</span>`:tag?`${lt}<span style="color:var(--tag)">${tag}</span>`:`<span style="color:var(--an)">${an}</span>=<span style="color:var(--av)">${av}</span>`)}

function buildSources(p){p.innerHTML=`<div class="split" style="flex:1;min-height:0">
 <div class="nav" data-hs="src-nav"><div class="subt" id="srcNavT">${[['page','Page'],['ws','Workspace'],['ov','Overrides'],['snip','Snippets']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k==='page'}">${l}</button>`).join('')}</div><div class="ftree scroll" id="ftree" style="flex:1"></div></div>
 <div class="ed" data-hs="src-editor"><div class="edtabs" id="edtabs"></div><div class="code scroll" id="code" tabindex="0"></div><div class="tb" id="edfoot" style="border-top:1px solid var(--dtl);border-bottom:0"></div></div>
 <div class="dbg" data-hs="src-debugger"><div class="dbgb" data-hs="src-controls"><button id="dResume" title="Resume (F8)">${IC.resume}</button><button id="dOver" title="Step over (F10)">${IC.over}</button><button id="dInto" title="Step into (F11)">${IC.into}</button><button id="dOut" title="Step out (Shift+F11)">${IC.out}</button><button id="dStep" title="Step (F9)">${IC.step}</button><span style="width:1px;height:16px;background:var(--dtl);margin:0 4px"></span><button id="dDeact" title="Deactivate breakpoints">${IC.deact}</button></div>
  <div id="dbgBody" class="scroll" style="flex:1"></div></div></div>`;
 $('#srcNavT').onclick=e=>{const b=e.target.closest('button');if(!b)return;SRC.nav=b.dataset.k;$$('#srcNavT button').forEach(x=>x.setAttribute('aria-selected',x===b));renderNav()};
 $('#ftree').onclick=e=>{const b=e.target.closest('[data-f]');if(b)SRC.open(b.dataset.f);const n=e.target.closest('[data-new]');if(n){const name=`snippet-${Object.keys(SNIPPETS).length+1}.js`;SNIPPETS[name]='// New snippet\n';SRC.open(name);renderNav()}};
 $('#dResume').onclick=()=>DBG.cmd('resume');$('#dOver').onclick=()=>DBG.cmd('over');$('#dInto').onclick=()=>DBG.cmd('into');$('#dOut').onclick=()=>DBG.cmd('out');$('#dStep').onclick=()=>DBG.cmd('into');
 $('#dDeact').onclick=()=>{SRC.active=!SRC.active;$('#dDeact').style.color=SRC.active?'':'#8AB4F8';toast(SRC.active?'Breakpoints active':'Breakpoints deactivated — nothing will pause');SRC.render()};
 const code=$('#code');
 code.addEventListener('click',e=>{const g=e.target.closest('.g');if(!g)return;const ln=+g.parentNode.dataset.l;toggleBp(SRC.cur,ln)});
 code.addEventListener('contextmenu',e=>{const g=e.target.closest('.g');if(!g)return;e.preventDefault();const ln=+g.parentNode.dataset.l;const k=SRC.cur+':'+ln;const bp=SRC.bps.get(k);if(SRC.files[SRC.cur]?.kind!=='js'){toast('Breakpoints go in JavaScript files');return}
  openMenu(e.clientX,e.clientY,bp?[{label:'Edit breakpoint…',act:()=>{SRC.editing={line:ln,type:bp.type==='log'?'log':'cond'};SRC.render()}},{label:bp.enabled?'Disable breakpoint':'Enable breakpoint',act:()=>{bp.enabled=!bp.enabled;SRC.render()}},{label:'Remove breakpoint',act:()=>{SRC.bps.delete(k);SRC.render()}}]:
   [{label:'Add breakpoint',act:()=>toggleBp(SRC.cur,ln)},{label:'Add conditional breakpoint…',act:()=>{SRC.editing={line:ln,type:'cond'};SRC.render()}},{label:'Add logpoint…',act:()=>{SRC.editing={line:ln,type:'log'};SRC.render()}},'-',{label:'Never pause here',act:()=>{SRC.bps.set(k,{file:SRC.cur,line:ln,type:'cond',expr:'false',enabled:true});SRC.render()}}])});
 SRC.render()}
function toggleBp(f,ln){if(SRC.files[f]?.kind!=='js'){toast('Breakpoints go in JavaScript files');return}const k=f+':'+ln;if(SRC.bps.has(k))SRC.bps.delete(k);else{SRC.bps.set(k,{file:f,line:ln,type:'bp',enabled:true});track('set-bp')}SRC.render()}
function renderNav(){const t=$('#ftree');if(!t)return;const it=(d,label,f,ic)=>`<button style="--d:${d}" ${f?`data-f="${f}"`:''} class="${f&&f===SRC.cur?'on':''}">${ic}${label}</button>`;const fi=c=>`<i class="fi" style="background:${c}"></i>`;
 if(SRC.nav==='page')t.innerHTML=it(0,'▾ top','',fi('#9AA0A6'))+it(1,'▾ driftwood.coffee','',fi('#9AA0A6'))+it(2,'▾ css','',fi('#C9A15A'))+it(3,'app.css','app.css',fi('#6FA8DC'))+it(2,'▾ js','',fi('#C9A15A'))+it(3,'app.js','app.js',fi('#E8C547'))+it(3,'cart.js','cart.js',fi('#E8C547'))+it(3,'vendor.min.js','vendor.min.js',fi('#E8C547'))+it(2,'▸ img','',fi('#C9A15A'))+it(2,'(index)','(index)',fi('#9AA0A6'))+it(1,'▸ fonts.gstatic.com','',fi('#9AA0A6'));
 else if(SRC.nav==='snip')t.innerHTML=Object.keys(SNIPPETS).map(n=>it(0,n,n,fi('#E8C547'))).join('')+`<button style="--d:0;color:#8AB4F8" data-new="1">+ New snippet</button>`;
 else if(SRC.nav==='ov')t.innerHTML=`<div style="padding:12px;font:400 12.5px/1.55 var(--body);color:#BDC1C6">Overrides let you edit a response (HTML, CSS, JS, even headers) and keep the edit across reloads. Pick a local folder and DevTools serves your copy instead of the network one.<br><br><button class="btns">Select folder for overrides</button><br><br><span style="color:#9AA0A6">Network ▸ right-click a request ▸ <b>Override content</b> does the same.</span></div>`;
 else t.innerHTML=`<div style="padding:12px;font:400 12.5px/1.55 var(--body);color:#BDC1C6">Workspace maps a folder on disk to the site so edits made in DevTools save straight to your source files.<br><br><button class="btns">+ Add folder</button></div>`}
SRC.render=function(){if(!P.sources.built)return;renderNav();const f=SRC.cur;const isSnip=!!SNIPPETS[f];
 $('#edtabs').innerHTML=SRC.openTabs.concat(isSnip&&!SRC.openTabs.includes(f)?[f]:[]).map(n=>`<span class="${n===f?'on':''}" data-t="${esc(n)}">${esc(n)}${n==='vendor.min.js'&&SRC.pretty?':formatted':''} <b data-x="${esc(n)}" style="cursor:pointer;opacity:.6">×</b></span>`).join('');
 $$('#edtabs [data-t]').forEach(s=>s.onclick=e=>{if(e.target.dataset.x){SRC.openTabs=SRC.openTabs.filter(x=>x!==e.target.dataset.x);if(SRC.cur===e.target.dataset.x)SRC.cur=SRC.openTabs[0]||'cart.js';SRC.render();return}SRC.cur=s.dataset.t;SRC.render()});
 const code=$('#code');
 if(isSnip){code.innerHTML=`<textarea id="snipTa" spellcheck="false" style="width:100%;height:100%;min-height:260px;background:transparent;border:0;outline:none;color:#E3E3E3;font:400 12.5px/20px var(--mono);padding:4px 12px;resize:none"></textarea>`;const ta=$('#snipTa');ta.value=SNIPPETS[f];ta.oninput=()=>SNIPPETS[f]=ta.value;ta.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();runSnippet(f)}};
  $('#edfoot').innerHTML=`<button class="btnp" id="runSnip">${IC.play} Run</button><span style="color:#9AA0A6">Ctrl+Enter · output goes to the Console</span>`;$('#runSnip').onclick=()=>runSnippet(f);renderDbg();return}
 const F=SRC.files[f];const lines=F.text().split('\n');const paused=DBG.state&&DBG.state.file===f?DBG.state:null;const cov=ST.coverage&&ST.coverage[f];
 code.innerHTML=lines.map((l,i)=>{const n=i+1;const bp=SRC.bps.get(f+':'+n);const cls=bp?`bp${bp.type==='cond'?' cond':bp.type==='log'?' log':''}${!bp.enabled||!SRC.active?' dis':''}`:'';
  const inl=paused&&paused.inline&&paused.inline[n]?`<span class="inl">${esc(paused.inline[n])}</span>`:'';const cv=cov?`<i class="cov" style="background:${cov[i]?'#4FA3F7':'#E46962'}"></i>`:'';
  const hl=F.kind==='js'?hlJS(l):F.kind==='css'?hlCSS(l):hlHTML(l);
  let edit='';if(SRC.editing&&SRC.editing.line===n){const ex=bp&&bp.expr||'';edit=`<div class="bpedit ${SRC.editing.type==='log'?'log':''}">${SRC.editing.type==='log'?'Logpoint — log a message when this line runs (e.g. <code>\'total\', total</code>)':'Conditional breakpoint — pause only when this is true'}<input id="bpInput" value="${esc(ex)}" placeholder="${SRC.editing.type==='log'?"'total is', total":'total > 100'}"></div>`}
  return `<div class="ln${paused&&paused.line===n?' cur':''}" data-l="${n}"><span class="g ${cls}">${n}</span>${cv}<span class="t">${hl||' '}${inl}</span></div>${edit}`}).join('');
 const bi=$('#bpInput');if(bi){bi.focus();bi.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){const v=bi.value.trim();const k=f+':'+SRC.editing.line;if(v)SRC.bps.set(k,{file:f,line:SRC.editing.line,type:SRC.editing.type,expr:v,enabled:true});track(SRC.editing.type==='log'?'logpoint':'cond-bp');SRC.editing=null;SRC.render()}if(e.key==='Escape'){SRC.editing=null;SRC.render()}};bi.onblur=()=>{if(SRC.editing){SRC.editing=null;SRC.render()}}}
 const minified=f==='vendor.min.js';$('#edfoot').innerHTML=`<button class="tbb" id="pp" title="Pretty print" aria-pressed="${SRC.pretty}" style="font:600 13px var(--mono)">{ }</button><span style="color:#9AA0A6">${minified&&!SRC.pretty?'Minified file — click { } to pretty-print':F.kind==='js'?'Click a line number to add a breakpoint · right-click for conditional / logpoint':F.kind==='css'?(ST.changes.length?'Modified by your Styles edits':'Edits made in the Styles pane show up here'):'The HTML the server sent, before JavaScript ran'}</span>${cov?'<span style="margin-left:auto;color:#E46962">■ unused</span><span style="color:#4FA3F7">■ used</span>':''}`;
 $('#pp').onclick=()=>{if(f!=='vendor.min.js'){toast('Only minified files need pretty-printing');return}SRC.pretty=!SRC.pretty;SRC.render();track('pretty-print')};
 if(paused){const r=$(`#code .ln[data-l="${paused.line}"]`);if(r){const c=$('#code');if(r.offsetTop<c.scrollTop||r.offsetTop>c.scrollTop+c.clientHeight-40)c.scrollTop=r.offsetTop-c.clientHeight/3}}
 renderDbg()};
function runSnippet(f){CON.add({type:'input',args:[`// ${f}`]});try{const r=EVAL_OK?runCode(SNIPPETS[f]):undefined;if(!EVAL_OK)throw new EvalError('eval is blocked here');CON.add({type:'result',args:[r]})}catch(e){CON.add({type:'error',args:[`Uncaught ${e.name}: ${e.message}`],src:f})}ST.drawer=true;ST.drawerTab='console';renderDrawer();track('snippet')}
function evalIn(expr,scope){try{if(!EVAL_OK){if(expr in scope)return scope[expr];const m=expr.match(/^([\w$.]+)\s*(>|<|>=|<=|===|==)\s*([\d.]+)$/);if(m){const a=m[1].split('.').reduce((o,k)=>o&&o[k],scope);return eval2(a,m[2],+m[3])}return undefined}
 const ks=Object.keys(scope);return new Function(...ks,'cart','$0',`return (${expr})`)(...ks.map(k=>scope[k]),cart,ST.sel)}catch(e){return e}}
function eval2(a,op,b){return op==='>'?a>b:op==='<'?a<b:op==='>='?a>=b:op==='<='?a<=b:a==b}
function renderDbg(){const b=$('#dbgBody');if(!b)return;const s=DBG.state;
 const bps=[...SRC.bps.values()];const scope=s?s.scope:null;
 b.innerHTML=(s?`<div class="pausemsg">⏸ ${esc(s.reason)}</div>`:'')+
 `<div class="pane" data-hs="src-watch"><h4>Watch <span style="float:right;color:#8AB4F8" id="addWatch">+</span></h4><div class="pb">${SRC.watch.map((w,i)=>{const v=s?evalIn(w,{...s.scope}):undefined;return`<div><span style="color:#E3E3E3">${esc(w)}</span>: ${s?(v instanceof Error?`<span class="muted">&lt;not available&gt;</span>`:prevShort(v)):'<span class="muted">&lt;not available&gt;</span>'} <b data-wx="${i}" style="float:right;cursor:pointer;color:#9AA0A6">×</b></div>`}).join('')}<div id="watchIn"></div></div></div>
 <div class="pane" data-hs="src-bps"><h4>Breakpoints</h4><div class="pb">${bps.length?bps.map(bp=>`<div style="color:${bp.type==='cond'?'#FCAD70':bp.type==='log'?'#FF7FC4':'#E3E3E3'}"><label class="ck"><input type="checkbox" data-bpk="${bp.file}:${bp.line}" ${bp.enabled?'checked':''}>${bp.file}:${bp.line}</label> <span class="muted" style="font-style:normal!important">${bp.expr?esc(bp.expr):esc((SRC.files[bp.file].text().split('\n')[bp.line-1]||'').trim().slice(0,28))}</span></div>`).join(''):'<div class="muted">No breakpoints</div>'}
  ${[...EL.domBps].filter(([n,t])=>t.size).map(([n,t])=>`<div style="color:#C792EA">DOM · ${esc(nodeLabel(n))} · ${[...t].join(', ')}</div>`).join('')}</div></div>
 <div class="pane" data-hs="src-scope"><h4>Scope</h4><div class="pb">${scope?`<div style="color:#9AA0A6">▾ Local</div>${Object.entries(scope).map(([k,v])=>`<div style="padding-left:22px"><span style="color:#E3A7FF">${esc(k)}</span>: ${prevShort(v)}</div>`).join('')}<div style="color:#9AA0A6">▸ Module <span class="muted" style="font-style:normal!important">cart, api, products</span></div><div style="color:#9AA0A6">▸ Global <span style="float:right" class="muted">Window</span></div>`:'<div class="muted">Not paused</div>'}</div></div>
 <div class="pane" data-hs="src-stack"><h4>Call Stack</h4><div class="pb">${s?s.stack.map((fr,i)=>`<div style="${i===0?'background:var(--dsel)':''}"><span style="color:#E3E3E3">${i===0?'▸ ':'&nbsp; '}${esc(fr[0])}</span><span style="float:right;color:#9AA0A6">${esc(fr[1])}</span></div>`).join('')+'<div class="muted">— async: click —</div>':'<div class="muted">Not paused</div>'}</div></div>
 <div class="pane"><h4>XHR/fetch Breakpoints</h4><div class="pb"><div class="muted">Pause when a URL contains…</div></div></div>
 <div class="pane"><h4>Event Listener Breakpoints</h4><div class="pb"><div class="muted">▸ Mouse · Keyboard · Timer · XHR…</div></div></div>`;
 ['dResume','dOver','dInto','dOut','dStep'].forEach(id=>$('#'+id).disabled=!s);
 $$('[data-bpk]',b).forEach(c=>c.onchange=()=>{SRC.bps.get(c.dataset.bpk).enabled=c.checked;SRC.render()});
 $$('[data-wx]',b).forEach(x=>x.onclick=()=>{SRC.watch.splice(+x.dataset.wx,1);renderDbg()});
 $('#addWatch',b).onclick=e=>{e.stopPropagation();const w=$('#watchIn',b);w.innerHTML='<input class="inp" style="width:100%" placeholder="Expression, e.g. item.qty">';const i=$('input',w);i.focus();i.onkeydown=ev=>{ev.stopPropagation();if(ev.key==='Enter'&&i.value.trim()){SRC.watch.push(i.value.trim());track('watch');renderDbg()}if(ev.key==='Escape')renderDbg()}}}

/* ---------- execution trace + stepping ---------- */
const DBG={state:null,resolve:null,trace:null,i:0,
 build(c){const items=c.items.map(x=>({...x}));const T=[];const fr=(fn,ln)=>[fn,'cart.js:'+ln];
  const S=(line,depth,scope,inline)=>T.push({file:'cart.js',line,depth,scope,inline,stack:depth?[fr('calcTotal',line),fr('checkout',35),['(anonymous)','cart.js:44']]:[fr('checkout',line),['(anonymous)','cart.js:44']]});
  S(35,0,{cart:c,total:undefined},{});let total=0;S(9,1,{items,total:undefined},{8:`items = Array(${items.length})`});
  for(const item of items){S(10,1,{items,total,item},{9:`total = ${total}`,10:`item = {name: '${item.name}', …}`});S(11,1,{items,total,item,line:undefined},{9:`total = ${total}`,10:`item = {name: '${item.name}', …}`});const line=item.price*item.qty;S(12,1,{items,total,item,line},{9:`total = ${total}`,11:`line = ${line}`});total+=line}
  S(14,1,{items,total},{9:`total = ${total}`});if(total>100)total*=0.9;S(15,1,{items,total},{14:`total = ${round(total)}`});const res=round(total);S(36,0,{cart:c,total:res},{35:`total = ${res}`});this.result=res;return T},
 async run(c){this.trace=this.build(c);this.i=-1;return new Promise(res=>{this.resolve=res;this.advance(t=>this.hitBp(t))})},
 hitBp(step){const bp=SRC.bps.get(step.file+':'+step.line);if(!bp||!bp.enabled||!SRC.active)return false;if(bp.type==='log'){const v=evalIn(`[${bp.expr}]`,step.scope);withSrc(`cart.js:${step.line}`,()=>pageConsole.log(...(Array.isArray(v)?v:[v])));track('logpoint-hit');return false}if(bp.type==='cond'){const v=evalIn(bp.expr,step.scope);return v===true||(v&&!(v instanceof Error))}return true},
 advance(stop){while(++this.i<this.trace.length){const st=this.trace[this.i];const isStop=stop(st);if(isStop){const bp=SRC.bps.get(st.file+':'+st.line);this.pause(st,bp&&bp.enabled&&SRC.active&&bp.type!=='log'?'Paused on breakpoint':'Debugger paused');return}}
  this.finish()},
 pause(st,reason){this.state={...st,reason};if(!ST.open)toggleDevtools(true);setPanel('sources');SRC.cur=st.file;if(!SRC.openTabs.includes(st.file))SRC.openTabs.push(st.file);SRC.render();showPauseBar(true);track('paused')},
 finish(){this.state=null;showPauseBar(false);SRC.render();const r=this.resolve;this.resolve=null;if(r)r(this.result)},
 cmd(k){if(!this.state)return;if(this.state.dom){this.state=null;showPauseBar(false);SRC.render();return}const d=this.state.depth;this.state=null;
  const f={resume:st=>this.hitBp(st),over:st=>st.depth<=d||this.hitBp(st),into:()=>true,out:st=>st.depth<d||this.hitBp(st)}[k];
  if(k!=='resume')track('step');this.advance(f)},
 pauseDom({node,type}){if(this.state)return;this.state={file:'cart.js',line:30,depth:0,dom:true,scope:{n:cart.items.reduce((a,i)=>a+i.qty,0)},inline:{},reason:`Paused on ${type}: ${nodeLabel(node)}`,stack:[['renderCart','cart.js:30'],['addToCart','cart.js:25'],['(anonymous)','cart.js:42']]};if(!ST.open)toggleDevtools(true);setPanel('sources');SRC.cur='cart.js';SRC.render();showPauseBar(true);track('dom-bp-hit')}};
function showPauseBar(on){$$('.pausebar,.pausedim').forEach(x=>x.remove());if(!on)return;const pa=$('#pagearea');pa.appendChild(h('<div class="pausedim"></div>'));const bar=h(`<div class="pausebar">Paused in debugger <button title="Resume (F8)">${IC.resume}</button><button title="Step over (F10)">${IC.over}</button></div>`);const [r,o]=$$('button',bar);r.onclick=()=>DBG.cmd('resume');o.onclick=()=>DBG.cmd('over');pa.appendChild(bar)}
