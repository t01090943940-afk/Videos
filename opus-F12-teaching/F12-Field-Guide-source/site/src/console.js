/* ================= Console ================= */
let EVAL_OK=true;try{EVAL_OK=new Function('return 7')()===7}catch{EVAL_OK=false}
const CONSOLE_VARS={};const selHist=[];bus.on('select',n=>{if(selHist[0]!==n){selHist.unshift(n);selHist.length=Math.min(selHist.length,5)}});
const CSET={levels:{verbose:false,info:true,warn:true,error:true},filter:'',preserve:false,group:true,hideNet:false,eager:true};
const DOC=new Proxy({},{get(t,k){switch(k){case'title':return HEAD.querySelector('title').textContent;case'body':return BODY;case'head':return HEAD;case'documentElement':return HTML;
 case'querySelector':return s=>HTML.querySelector(s);case'querySelectorAll':return s=>HTML.querySelectorAll(s);case'getElementById':return id=>HTML.querySelector('#'+CSS.escape(id));case'getElementsByClassName':return c=>HTML.getElementsByClassName(c);case'getElementsByTagName':return tg=>HTML.getElementsByTagName(tg);
 case'cookie':return COOKIES.filter(c=>!c.httpOnly).map(c=>c.name+'='+c.value).join('; ');case'URL':return'https://driftwood.coffee/shop';case'location':return LOC;case'readyState':return'complete';case'images':return BODY.querySelectorAll('img');case'forms':return BODY.querySelectorAll('form');case'links':return BODY.querySelectorAll('a');
 case'addEventListener':return(...a)=>BODY.addEventListener(...a);case Symbol.toStringTag:return'HTMLDocument'}const v=document[k];return typeof v==='function'?v.bind(document):v},
 set(t,k,v){if(k==='title'){HEAD.querySelector('title').textContent=v;$('#tabTitle').textContent=v;return true}if(k==='cookie'){const [nv]=String(v).split(';');const [n,...val]=nv.split('=');const c=COOKIES.find(c=>c.name===n.trim());if(c)c.value=val.join('=');else COOKIES.push({name:n.trim(),value:val.join('='),domain:'driftwood.coffee',path:'/',expires:'Session',httpOnly:false,secure:false,sameSite:'Lax',priority:'Medium'});bus.emit('storage');return true}return true},has(){return true}});
const LOC={href:'https://driftwood.coffee/shop',origin:'https://driftwood.coffee',hostname:'driftwood.coffee',pathname:'/shop',protocol:'https:',search:'',hash:'',reload:()=>reloadPage(),toString(){return this.href}};
const mkStorage=(M,name)=>new Proxy({},{get(t,k){if(k==='getItem')return x=>M.has(String(x))?M.get(String(x)):null;if(k==='setItem')return(x,v)=>{M.set(String(x),String(v));bus.emit('storage');if(String(x)==='theme')setTheme(String(v))};if(k==='removeItem')return x=>{M.delete(String(x));bus.emit('storage')};if(k==='clear')return()=>{M.clear();bus.emit('storage')};if(k==='key')return i=>[...M.keys()][i]??null;if(k==='length')return M.size;if(k===Symbol.toStringTag)return'Storage';if(typeof k==='string'&&M.has(k))return M.get(k);return undefined},
 set(t,k,v){M.set(String(k),String(v));bus.emit('storage');return true},ownKeys(){return[...M.keys()]},getOwnPropertyDescriptor(t,k){return M.has(k)?{enumerable:true,configurable:true,value:M.get(k)}:undefined}});
const SCOPE={document:DOC,window:new Proxy(globalThis,{get(t,k){if(k==='document')return DOC;if(k==='location')return LOC;if(k==='localStorage')return SCOPE.localStorage;const v=t[k];return typeof v==='function'&&!/^[A-Z]/.test(String(k))?v.bind(t):v}}),location:LOC,
 localStorage:mkStorage(LS),sessionStorage:mkStorage(SS),console:pageConsole,fetch:(u,o={})=>simFetch(u,{...o,initiator:'VM'+(CON.vm||1)+':1'}),
 $:(s,root)=>(root||HTML).querySelector(s),$$:(s,root)=>[...(root||HTML).querySelectorAll(s)],$x:(xp)=>{const r=[];const it=document.evaluate(xp,BODY,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(let i=0;i<it.snapshotLength;i++)r.push(it.snapshotItem(i));return r},
 copy:v=>{copyText(typeof v==='string'?v:v&&v.nodeType?v.outerHTML:JSON.stringify(v,null,2));track('copy')},clear:()=>pageConsole.clear(),inspect:n=>{if(n&&n.nodeType===1){setPanel('elements');select(n)}},keys:Object.keys,values:Object.values,dir:o=>pageConsole.dir(o),
 getEventListeners:n=>{const o={};LISTENERS.filter(l=>l.el===n&&!l.removed).forEach(l=>(o[l.type]=o[l.type]||[]).push({listener:l.fn,once:false,passive:false,type:l.type,useCapture:false}));return o},
 monitorEvents:(n,types)=>{[].concat(types||['click']).forEach(t=>n.addEventListener(t,e=>CON.add({type:'log',args:[t,e],src:''})));},
 queryObjects:c=>{const map={Promise:0,HTMLDivElement:toastCache.length};CON.add({type:'log',args:[`Array(${map[c&&c.name]||0})`],plain:true,src:''})},
 cart,orders,products:PRODUCTS,addToCart,checkout,calcTotal,renderCart,toastCache,setTheme};
Object.defineProperty(SCOPE,'$0',{get:()=>ST.sel,enumerable:true});[1,2,3,4].forEach(i=>Object.defineProperty(SCOPE,'$'+i,{get:()=>selHist[i],enumerable:true}));SCOPE.$_=undefined;
const scopeP=new Proxy({},{has:(t,k)=>typeof k==='string'&&!k.startsWith('__')&&(k in CONSOLE_VARS||k in SCOPE),get:(t,k)=>k===Symbol.unscopables?undefined:k in CONSOLE_VARS?CONSOLE_VARS[k]:SCOPE[k],set:(t,k,v)=>{if(k in SCOPE&&k!=='$_'&&typeof SCOPE[k]!=='object'){SCOPE[k]=v;return true}CONSOLE_VARS[k]=v;return true}});
function runCode(code){CON.vm=(CON.vm||200)+1;let src=code.trim();
 src=src.replace(/^(?:let|const|var)\s+([A-Za-z_$][\w$]*)\s*=/gm,(m,n)=>{CONSOLE_VARS[n]=undefined;return n+' ='}).replace(/^(async\s+)?function\s+([A-Za-z_$][\w$]*)/gm,(m,a,n)=>{CONSOLE_VARS[n]=undefined;return n+' = '+(a||'')+'function '+n});
 if(/\bawait\b/.test(src)){try{return new Function('__s',`with(__s){return (async()=>(${src}\n))()}`)(scopeP)}catch(e){if(!(e instanceof SyntaxError))throw e;return new Function('__s',`with(__s){return (async()=>{${src}\n})()}`)(scopeP)}}
 if(/^\{/.test(src)&&!/;\s*$/.test(src))src='('+src+')';
 return new Function('__s','__c','with(__s){return eval(__c)}')(scopeP,src)}
const CANNED={"document.title":()=>DOC.title,"$0":()=>ST.sel,"$$('.card').length":()=>PAGE.qa('.card').length,"console.table(orders)":()=>{pageConsole.table(orders)},"cart.items":()=>cart.items,"localStorage.getItem('theme')":()=>LS.get('theme'),
 "await fetch('/api/cart', {method:'POST'})":()=>simFetch('/api/cart',{method:'POST',initiator:'VM1:1'}),"document.body.dataset.theme = 'dark'":()=>{setTheme('dark');return'dark'},"$0.style.outline = '3px solid red'":()=>{ST.sel.style.outline='3px solid red';return'3px solid red'},"copy($0.outerHTML)":()=>{SCOPE.copy(ST.sel.outerHTML)},
 "console.time('t'); calcTotal(cart.items); console.timeEnd('t')":()=>{pageConsole.time('t');calcTotal(cart.items);pageConsole.timeEnd('t')},"getEventListeners($0)":()=>SCOPE.getEventListeners(ST.sel)};
const hist=store.get('hist',[]);
async function evaluate(code){code=code.trim();if(!code)return;CON.add({type:'input',args:[code]});hist.push(code);if(hist.length>60)hist.shift();store.set('hist',hist);
 let r,threw=false;try{if(EVAL_OK)r=runCode(code);else if(CANNED[code])r=CANNED[code]();else throw new EvalError('This page blocks eval, so only the example chips run here.');
  if(r&&typeof r.then==='function'&&/\bawait\b/.test(code))r=await r}
 catch(e){threw=true;CON.add({type:'error',args:[`Uncaught ${e&&e.name?`${e.name}: ${e.message}`:fmtPlain(e)}`],src:'VM'+(CON.vm||1)+':1',stack:'    at <anonymous>:1:1'})}
 if(!threw){SCOPE.$_=r;CON.add({type:'result',args:[r]})}
 track('console-eval');if(/\$0/.test(code))track('console-$0');if(/table\(/.test(code))track('console-table');if(/fetch\(/.test(code))track('console-fetch')}
function fmtPlain(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch{return String(v)}}

/* ---------- value rendering ---------- */
function typeName(v){if(v===null)return'null';const t=Object.prototype.toString.call(v).slice(8,-1);if(v&&v[Symbol.toStringTag])return v[Symbol.toStringTag];if(v&&v.constructor&&v.constructor.name&&v.constructor!==Object)return v.constructor.name;return t}
function prevShort(v,d=0){if(v===null)return'<span class="ov-null">null</span>';if(v===undefined)return'<span class="ov-null">undefined</span>';const t=typeof v;
 if(t==='string')return`<span class="ov-str">'${esc(v.length>60?v.slice(0,60)+'…':v)}'</span>`;if(t==='number'||t==='bigint')return`<span class="ov-num">${String(v)}</span>`;if(t==='boolean')return`<span class="ov-kw">${v}</span>`;if(t==='function')return`<span class="ov-fn">ƒ</span>`;if(t==='symbol')return`<span class="ov-str">${esc(String(v))}</span>`;
 if(v.nodeType===1)return`<span class="ov-kw">${esc(nodeLabel(v))}</span>`;if(v.nodeType)return`<span class="ov-dim">#${esc(v.nodeName)}</span>`;
 if(Array.isArray(v))return d>0?`Array(${v.length})`:`(${v.length}) [${v.slice(0,6).map(x=>prevShort(x,d+1)).join(', ')}${v.length>6?', …':''}]`;
 if(v instanceof Map)return`Map(${v.size})`;if(v instanceof Set)return`Set(${v.size})`;if(v instanceof Promise)return'Promise';if(v instanceof Error)return`<span class="r">${esc(v.name)}</span>`;
 const tn=typeName(v);if(d>0)return tn==='Object'?'{…}':tn;const ks=safeKeys(v).slice(0,5);return`${tn==='Object'?'':esc(tn)+' '}{${ks.map(k=>`<span class="ov-key">${esc(k)}</span>: ${prevShort(safeGet(v,k),d+1)}`).join(', ')}${safeKeys(v).length>5?', …':''}}`}
function safeKeys(v){try{return Object.keys(v)}catch{return[]}}
function safeGet(v,k){try{return v[k]}catch(e){return'(…)'}}
function renderVal(v,top,asResult){if(v===null||v===undefined||typeof v!=='object'&&typeof v!=='function'){if(typeof v==='string'&&!asResult&&top)return h(`<span>${esc(v)}</span>`);return h(`<span>${prevShort(v)}</span>`)}
 if(typeof v==='function')return h(`<span class="ov-fn">ƒ ${esc(v.name||'anonymous')}(${esc(String(v).match(/\(([^)]*)\)/)?.[1]||'')})</span>`);
 if(v.nodeType===1){const s=h(`<span class="nodeprev">&lt;${esc(v.tagName.toLowerCase())}${[...v.attributes].filter(a=>a.name!=='style'||true).slice(0,3).map(a=>` <span class="an" style="color:var(--an)">${esc(a.name)}</span>=<span style="color:var(--av)">"${esc(a.value.replace(/\s*__hov/,'').slice(0,40))}"</span>`).join('')}&gt;${v.children.length?'…':esc(v.textContent.trim().slice(0,30))}&lt;/${esc(v.tagName.toLowerCase())}&gt;</span>`);
  s.onmouseenter=()=>highlight(v);s.onmouseleave=clearHL;s.onclick=()=>{setPanel('elements');select(v);track('console-node')};s.title='Click to reveal in Elements panel';return s}
 if(v instanceof Promise){const s=h('<span>Promise {<span class="ov-dim">&lt;pending&gt;</span>}</span>');return s}
 if(v instanceof Error){return h(`<span class="r">${esc(v.stack||v.name+': '+v.message)}</span>`)}
 const o=h(`<span class="obj"><span class="hd">${prevShort(v)}</span><span class="kids"></span></span>`);let built=false;
 o.querySelector('.hd').onclick=e=>{e.stopPropagation();o.classList.toggle('open');if(!built){built=true;const kids=o.querySelector('.kids');let entries=[];
   if(v instanceof Map)entries=[...v.entries()].map(([k,x],i)=>[i,{key:k,value:x}]);else if(v instanceof Set)entries=[...v].map((x,i)=>[i,x]);else{const own=Array.isArray(v)?[...v.keys()].map(String):Object.getOwnPropertyNames(v);entries=own.slice(0,120).map(k=>[k,safeGet(v,k)]);if(v.nodeType||own.length===0&&typeName(v)!=='Object'){entries=[];for(const k in v){entries.push([k,safeGet(v,k)]);if(entries.length>80)break}}}
   if(Array.isArray(v))entries.push(['length',v.length]);entries.forEach(([k,x])=>{const r=h(`<div><span class="ov-key">${esc(String(k))}</span>: </div>`);r.appendChild(renderVal(x,false,true));kids.appendChild(r)});
   kids.appendChild(h(`<div><span class="ov-dim">[[Prototype]]</span>: <span class="ov-dim">${Array.isArray(v)?'Array(0)':esc(typeName(Object.getPrototypeOf(v)||{})||'Object')}</span></div>`))}};return o}

/* ---------- console view (panel + drawer share this) ---------- */
function makeConsole(root,compact){root.innerHTML=`<div class="tb" data-hs="con-tb"><button class="tbb" data-a="clear" title="Clear console (Ctrl+L)">${IC.clear}</button><span class="pill" title="JavaScript context">top ▾</span><button class="tbb" data-a="live" title="Create live expression">${IC.eye}</button><input class="inp" data-a="filter" placeholder="Filter" value="${esc(CSET.filter)}" style="flex:1;min-width:80px" data-hs="con-filter"><button class="pill" data-a="levels" data-hs="con-levels">Default levels ▾</button><button class="tbb" data-a="settings" title="Console settings">${IC.gear}</button></div>
 <div class="settings" hidden style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;font:400 12px var(--body)"><label class="ck"><input type="checkbox" data-s="hideNet">Hide network</label><label class="ck"><input type="checkbox" data-s="preserve">Preserve log</label><label class="ck"><input type="checkbox" data-s="group" checked>Group similar messages</label><label class="ck"><input type="checkbox" data-s="eager" checked>Eager evaluation</label></div>
 <div class="liveb"></div><div class="con scroll" data-hs="con-log"></div><div class="cprompt" data-hs="con-prompt"><span class="ic">›</span><div style="flex:1;position:relative"><textarea spellcheck="false" aria-label="Console prompt" rows="1"></textarea><div class="ghost" style="position:absolute;left:0;top:0;pointer-events:none;font:400 12.5px/18px var(--mono);color:#6E7379;white-space:pre"></div><div class="eager" style="font:400 12px/16px var(--mono);color:#9AA0A6;min-height:0"></div></div></div>
 ${compact?'':`<div class="chips" data-hs="con-chips"><small>Try:</small>${Object.keys(CANNED).map(c=>`<button data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>`}`;
 const log=$('.con',root),ta=$('textarea',root),ghost=$('.ghost',root),eager=$('.eager',root);let hi=hist.length;
 const visible=m=>{if(m.type==='input'||m.type==='result')return !CSET.filter||match(m);const lv=m.type==='log'?'info':m.type;if(CSET.levels[lv]===false)return false;if(CSET.hideNet&&m.net)return false;return !CSET.filter||match(m)};
 const match=m=>{const txt=m.args.map(a=>typeof a==='string'?a:fmtPlain(a)).join(' ')+' '+(m.src||'');const f=CSET.filter;if(/^\/.+\/$/.test(f)){try{return new RegExp(f.slice(1,-1),'i').test(txt)}catch{return true}}return f.split(/\s+/).every(w=>w.startsWith('-')?!txt.toLowerCase().includes(w.slice(1).toLowerCase()):txt.toLowerCase().includes(w.toLowerCase()))};
 const row=m=>{const d=h(`<div class="cm ${m.type==='log'?'':m.type}${m.group?' group':''}" data-id="${m.id}"><span class="ic">${({input:'›',result:'←',warn:'▲',error:'✕',info:'ⓘ'})[m.type]||''}</span></div>`);
  if(m.count>1)d.appendChild(h(`<span class="cnt">${m.count}</span>`));
  if(m.src){const s=h(`<span class="src">${esc(m.src)}</span>`);s.onclick=()=>{const [f,l]=m.src.split(':');if(SRC.files[f])SRC.open(f,+l||1);else if(f==='shop')setPanel('network')};d.appendChild(s)}
  if(m.table){d.appendChild(tableEl(m.table))}else if(m.type==='input'){d.appendChild(h(`<span style="color:#C7D7F8">${esc(m.args[0])}</span>`))}
  else m.args.forEach((a,i)=>{if(i)d.appendChild(document.createTextNode(' '));d.appendChild(renderVal(a,true,m.type==='result'))});
  if(m.stack)d.appendChild(h(`<div style="color:inherit;opacity:.8">${esc(m.stack)}</div>`));return d};
 const redraw=()=>{log.innerHTML='';CON.msgs.filter(visible).forEach(m=>log.appendChild(row(m)));log.scrollTop=1e9};
 const lis=(ev,m)=>{if(!root.isConnected){CON.listeners.splice(CON.listeners.indexOf(lis),1);return}if(ev==='clear'){log.innerHTML='';return}if(ev==='update'){const old=$(`[data-id="${m.id}"]`,log);if(old&&visible(m))old.replaceWith(row(m));return}if(visible(m)){const stick=log.scrollTop+log.clientHeight>=log.scrollHeight-30;log.appendChild(row(m));if(stick||m.type==='input'||m.type==='result')log.scrollTop=1e9}};CON.listeners.push(lis);
 bus.on('console-redraw',()=>{if(root.isConnected)redraw()});redraw();
 root.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
  if(k==='clear'){CON.clear();track('console-clear')}
  if(k==='levels'){const r=a.getBoundingClientRect();openMenu(r.left,r.bottom+2,[['verbose','Verbose'],['info','Info'],['warn','Warnings'],['error','Errors']].map(([lv,l])=>({label:(CSET.levels[lv]?'✓ ':'   ')+l,act:()=>{CSET.levels[lv]=!CSET.levels[lv];bus.emit('console-redraw');track('console-levels')}})))}
  if(k==='settings'){const s=$('.settings',root);s.hidden=!s.hidden}
  if(k==='live'){LIVE.push({expr:'',edit:true});renderLive()}});
 $('[data-a="filter"]',root).oninput=e=>{CSET.filter=e.target.value;bus.emit('console-redraw');$$('[data-a="filter"]').forEach(x=>{if(x!==e.target)x.value=CSET.filter});track('console-filter')};
 $$('[data-s]',root).forEach(c=>{c.checked=CSET[c.dataset.s];c.onchange=()=>{CSET[c.dataset.s]=c.checked;bus.emit('console-redraw')}});
 $$('.chips button',root).forEach(b=>b.onclick=()=>{ta.value=b.dataset.c;ta.focus();autosize();onType()});
 const autosize=()=>{ta.style.height='18px';ta.style.height=Math.min(120,ta.scrollHeight)+'px'};
 let sugg=[],si=0;
 const onType=()=>{autosize();ghost.textContent='';eager.textContent='';sugg=[];const v=ta.value;if(!EVAL_OK||!v||v.includes('\n'))return;
  const m=v.match(/([\w$]+(?:\.[\w$]+)*)\.([\w$]*)$/);try{if(m){const obj=runSafe(m[1]);if(obj!=null){const ks=new Set();let o=obj;let depth=0;while(o&&depth<4){Object.getOwnPropertyNames(o).forEach(k=>ks.add(k));o=Object.getPrototypeOf(o);depth++}if(obj===DOC)['title','body','head','querySelector','querySelectorAll','getElementById','cookie','documentElement','location','images','links'].forEach(k=>ks.add(k));sugg=[...ks].filter(k=>k.startsWith(m[2])&&k!==m[2]&&!/^__|^constructor$/.test(k)).sort().slice(0,8);if(sugg[0])ghost.innerHTML=`<span style="visibility:hidden">${esc(v)}</span>${esc(sugg[0].slice(m[2].length))}`}}
   else{const w=(v.match(/([\w$]+)$/)||[])[1];if(w&&w.length>=2){sugg=[...Object.keys(SCOPE),...Object.keys(CONSOLE_VARS),'document','window','JSON','Math','Object','Array','performance'].filter(k=>k.startsWith(w)&&k!==w).slice(0,8);if(sugg[0])ghost.innerHTML=`<span style="visibility:hidden">${esc(v)}</span>${esc(sugg[0].slice(w.length))}`}}}catch{}
  if(CSET.eager&&isSafe(v)){try{const r=runSafe(v);if(r!==undefined){const el=renderVal(r,false,true);eager.innerHTML='';eager.appendChild(el)}}catch{}}};
 ta.addEventListener('input',onType);
 ta.addEventListener('keydown',e=>{e.stopPropagation();
  if((e.key==='Tab'||e.key==='ArrowRight'&&ta.selectionStart===ta.value.length)&&sugg[0]){const m=ta.value.match(/([\w$]+)$/)||[''];const part=(ta.value.match(/\.([\w$]*)$/)||ta.value.match(/([\w$]*)$/))[1];ta.value=ta.value.slice(0,ta.value.length-part.length)+sugg[0];e.preventDefault();onType();return}
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();const c=ta.value;ta.value='';ghost.textContent='';eager.textContent='';autosize();hi=hist.length+1;evaluate(c);return}
  if(e.key==='ArrowUp'&&!ta.value.includes('\n')&&hist.length){e.preventDefault();hi=Math.max(0,Math.min(hi,hist.length)-1);ta.value=hist[hi]||'';onType()}
  if(e.key==='ArrowDown'&&!ta.value.includes('\n')){e.preventDefault();hi=Math.min(hist.length,hi+1);ta.value=hist[hi]||'';onType()}
  if(e.key==='l'&&(e.ctrlKey||e.metaKey)){e.preventDefault();CON.clear()}});
 log.addEventListener('click',e=>{if(e.target===log)ta.focus()});
 const liveb=$('.liveb',root);root._live=liveb;renderLive();return{root,ta}}
function runSafe(expr){return runCode(expr)}
function isSafe(v){if(/[=;]|\+\+|--|\bawait\b|\bnew\b|\bdelete\b/.test(v.replace(/[=!]==?|[<>]=/g,'')))return false;const calls=v.match(/([\w$.]+)\s*\(/g)||[];return calls.every(c=>/^(\$|\$\$|\$x|Object\.keys|Object\.values|JSON\.stringify|Math\.\w+|[\w$.]*\.(toFixed|toUpperCase|toLowerCase|slice|includes|matches|getAttribute|querySelector|querySelectorAll|getItem|map|filter|join|at))\s*\($/.test(c.trim()))}
function tableEl(data){const rows=Array.isArray(data)?data:Object.entries(data).map(([k,v])=>Object.assign({__k:k},v));const keys=[...new Set(rows.flatMap(r=>typeof r==='object'&&r?Object.keys(r).filter(k=>k!=='__k'):['Value']))].slice(0,7);
 const t=h(`<div><table class="ctab"><tr><th>(index)</th>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr>${rows.map((r,i)=>`<tr><td>${esc(r&&r.__k!==undefined?r.__k:i)}</td>${keys.map(k=>`<td>${typeof r==='object'&&r?prevShort(r[k],1):k==='Value'?prevShort(r,1):''}</td>`).join('')}</tr>`).join('')}</table><span class="ov-dim">${Array.isArray(data)?`Array(${data.length})`:'Object'}</span></div>`);return t}
const LIVE=[];
function renderLive(){$$('.liveb').forEach(b=>{b.className='liveb'+(LIVE.length?' live':'');b.innerHTML=LIVE.map((l,i)=>l.edit?`<div class="le"><span style="color:#9AA0A6">⊙</span><input class="inp" data-li="${i}" placeholder="Expression, e.g. performance.now()" style="flex:1"></div>`:`<div class="le" data-hs="con-live"><span style="color:#9AA0A6">⊙</span><b>${esc(l.expr)}</b><button data-rm="${i}" title="Remove">✕</button></div><div class="lv" data-lv="${i}" style="padding-left:20px"></div>`).join('');
  $$('[data-li]',b).forEach(inp=>{inp.focus();inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){const v=inp.value.trim();const L=LIVE[+inp.dataset.li];if(v){L.expr=v;L.edit=false;track('live-expr')}else LIVE.splice(+inp.dataset.li,1);renderLive()}if(e.key==='Escape'){LIVE.splice(+inp.dataset.li,1);renderLive()}}});
  $$('[data-rm]',b).forEach(x=>x.onclick=()=>{LIVE.splice(+x.dataset.rm,1);renderLive()})})}
setInterval(()=>{if(!LIVE.length)return;LIVE.forEach((l,i)=>{if(l.edit)return;let out;try{out=EVAL_OK?runCode(l.expr):'(eval blocked)'}catch(e){out=e.name+': '+e.message}$$(`[data-lv="${i}"]`).forEach(d=>{d.innerHTML='';d.appendChild(renderVal(out,false,true))})})},250);
bus.on('reload',()=>{if(!CSET.preserve)CON.clear();else CON.add({type:'info',args:['Navigated to https://driftwood.coffee/shop'],src:''})});
bus.on('console-count',()=>{let e=0,w=0;CON.msgs.forEach(m=>{if(m.type==='error')e+=m.count||1;if(m.type==='warn')w+=m.count||1});const eb=$('#errBdg'),wb=$('#warnBdg');eb.querySelector('span').textContent=e;wb.querySelector('span').textContent=w;eb.hidden=!e;wb.hidden=!w});
