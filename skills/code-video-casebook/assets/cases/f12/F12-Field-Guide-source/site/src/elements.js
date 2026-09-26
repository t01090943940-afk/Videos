/* ================= Elements panel ================= */
const EL={opened:new WeakSet(),rows:[],flashNodes:new Set(),grids:new Set(),domBps:new Map(),undo:[],sub:'styles'};
const VOID=new Set(['meta','link','img','br','input','hr','source']);
const HIDE_CLS='__web-inspector-hide-shortcut__';
[HTML,BODY,PAGE.q('.hero'),PAGE.q('.hero > div'),PAGE.q('.cards')].forEach(n=>EL.opened.add(n));

function nodeLabel(n){if(!n||n.nodeType!==1)return'';const cls=[...n.classList].filter(c=>c!=='__hov'&&c!==HIDE_CLS);return n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+(cls.length?'.'+cls.join('.'):'')}
function attrsHTML(n){return [...n.attributes].map(a=>{let v=a.value;if(a.name==='class')v=v.split(/\s+/).filter(c=>c!=='__hov').join(' ');if(a.name==='class'&&!v)return'';return ` <span class="an" data-attr="${esc(a.name)}">${esc(a.name)}</span>${v!==''||a.name!=='hidden'?`=<span class="av" data-attr-v="${esc(a.name)}">"${esc(v)}"</span>`:''}`}).join('')}

function buildElements(p){
 p.innerHTML=`<div class="split adapt" style="flex:1;min-height:0">
 <div class="a"><div class="tree scroll" id="tree" tabindex="0" data-hs="el-tree" aria-label="DOM tree"></div><div class="crumbs" id="crumbs" data-hs="el-crumbs"></div></div>
 <div class="b"><div class="subt" id="elSub" data-hs="el-sub">${[['styles','Styles'],['computed','Computed'],['layout','Layout'],['listeners','Event Listeners'],['a11y','Accessibility']].map(([k,l])=>`<button data-k="${k}" aria-selected="${k==='styles'}">${l}</button>`).join('')}</div>
  <div id="elView" class="scroll" style="flex:1;min-height:0"></div></div></div>`;
 const tree=$('#tree');
 tree.addEventListener('mouseover',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];if(n&&n.nodeType===1){highlight(n);track('hover-node')}});
 tree.addEventListener('mouseleave',()=>{if(!ST.inspecting)clearHL()});
 tree.addEventListener('click',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];
  if(e.target.classList.contains('lbadge')){toggleGrid(n);return}
  if(e.target.classList.contains('tw')){if(EL.opened.has(n))EL.opened.delete(n);else EL.opened.add(n);if(e.altKey)n.querySelectorAll('*').forEach(c=>EL.opened.add(c));renderTree();return}
  if(n&&n.nodeType===1)select(n);else if(n&&n.parentNode)select(n.parentNode)});
 tree.addEventListener('dblclick',e=>{const r=e.target.closest('.tr');if(!r)return;const n=EL.rows[+r.dataset.i];
  const av=e.target.closest('[data-attr-v]');if(av){editInline(av,av.textContent.replace(/^"|"$/g,''),v=>{n.setAttribute(av.dataset.attrV,v);track('edit-dom')});return}
  const tx=e.target.closest('.tx');if(tx){const tn=[...n.childNodes].find(c=>c.nodeType===3&&c.textContent.trim())||n;editInline(tx,tn.textContent.trim(),v=>{if(tn.nodeType===3)tn.textContent=v;else n.textContent=v;track('edit-dom')});return}});
 tree.addEventListener('contextmenu',e=>{const r=e.target.closest('.tr');if(!r)return;e.preventDefault();const n=EL.rows[+r.dataset.i];if(!n||n.nodeType!==1)return;select(n);elMenu(n,e.clientX,e.clientY)});
 tree.addEventListener('keydown',treeKeys);
 $('#elSub').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;EL.sub=b.dataset.k;$$('#elSub button').forEach(x=>x.setAttribute('aria-selected',x===b));renderSide();if(EL.sub==='computed')track('computed')});
 new MutationObserver(ms=>{let domBp=null;ms.forEach(m=>{const t=m.type==='characterData'?m.target.parentNode:m.target;if(t&&t.nodeType===1&&!(m.type==='attributes'&&m.attributeName==='class'&&String(m.oldValue||'').includes('__hov')!==(t.className||'').includes('__hov')&&false)){EL.flashNodes.add(t)}
   for(const [bn,types] of EL.domBps){if(types.has('subtree')&&bn!==t&&bn.contains(t)&&m.type!=='attributes')domBp={node:bn,type:'subtree modifications'};if(types.has('attributes')&&bn===t&&m.type==='attributes'&&!m.attributeName.startsWith('__'))domBp={node:bn,type:'attribute modifications'}}});
  scheduleTree();if(domBp)DBG.pauseDom(domBp)}).observe(HTML,{subtree:true,childList:true,attributes:true,characterData:true,attributeOldValue:true});
 renderTree();select(PAGE.q('.btn.cta'),true);
}
let treeT;function scheduleTree(){clearTimeout(treeT);treeT=setTimeout(()=>{if(P.elements.built){renderTree();if(EL.sub!=='styles'||!document.activeElement||!document.activeElement.closest('#elView'))renderSide()}},30)}

function renderTree(){const tree=$('#tree');if(!tree)return;const st=tree.scrollTop;EL.rows=[];let html='';
 const row=(n,d,inner,cls='')=>{const i=EL.rows.push(n)-1;const flash=EL.flashNodes.has(n)?' flash':'';html+=`<div class="tr${n===ST.sel?' sel':''}${cls}${flash}" data-i="${i}" style="padding-left:${d*14+6}px">${inner}</div>`};
 html+=`<div class="tr" data-i="-1" style="padding-left:6px"><span class="tw"></span><span class="cm">&lt;!DOCTYPE html&gt;</span></div>`;
 const walk=(n,d)=>{if(n.nodeType===3){const t=n.textContent.trim();if(t)row(n,d,`<span class="tw"></span><span class="tx">"${esc(t.length>80?t.slice(0,80)+'…':t)}"</span>`);return}
  if(n.nodeType===8){row(n,d,`<span class="tw"></span><span class="cm">&lt;!--${esc(n.textContent)}--&gt;</span>`);return}
  if(n.nodeType!==1)return;const tag=n.tagName.toLowerCase();const kids=[...n.childNodes].filter(c=>c.nodeType===1||c.nodeType===8||(c.nodeType===3&&c.textContent.trim()));
  const hid=n.classList.contains(HIDE_CLS)?' hid':'';let badge='';if(n.nodeType===1&&n.isConnected&&n!==HTML&&n!==HEAD&&!HEAD.contains(n)){const dsp=getComputedStyle(n).display;if(/grid/.test(dsp))badge=`<span class="lbadge${EL.grids.has(n)?' on':''}" title="Toggle grid overlay">grid</span>`;else if(/flex/.test(dsp))badge=`<span class="lbadge${EL.grids.has(n)?' on':''}" title="Toggle flexbox overlay">flex</span>`}
  const eq=n===ST.sel?'<span class="eq">== $0</span>':'';const open=`<span class="tg">&lt;${tag}</span>${attrsHTML(n)}<span class="tg">&gt;</span>`;const close=`<span class="tg">&lt;/${tag}&gt;</span>`;
  if(VOID.has(tag)){row(n,d,`<span class="tw"></span>${open}${badge}${eq}`,hid);return}
  if(!kids.length){row(n,d,`<span class="tw"></span>${open}${close}${badge}${eq}`,hid);return}
  if(kids.length===1&&kids[0].nodeType===3&&kids[0].textContent.trim().length<70){row(n,d,`<span class="tw"></span>${open}<span class="tx">${esc(kids[0].textContent.trim())}</span>${close}${badge}${eq}`,hid);return}
  const isOpen=EL.opened.has(n);
  if(!isOpen){row(n,d,`<span class="tw">▸</span>${open}…${close}${badge}${eq}`,hid);return}
  row(n,d,`<span class="tw">▾</span>${open}${badge}${eq}`,hid);kids.forEach(k=>walk(k,d+1));const ci=EL.rows.push(n)-1;html+=`<div class="tr${n===ST.sel?' sel':''}" data-i="${ci}" style="padding-left:${d*14+6}px"><span class="tw"></span>${close}</div>`};
 walk(HTML,0);tree.innerHTML=html;tree.scrollTop=st;EL.flashNodes.clear();renderCrumbs()}
function renderCrumbs(){const c=$('#crumbs');if(!c)return;const chain=[];let n=ST.sel;while(n&&n.nodeType===1){chain.unshift(n);if(n===HTML)break;n=n.parentNode}
 c.innerHTML='';chain.forEach(x=>{const b=h(`<button class="${x===ST.sel?'on':''}">${esc(nodeLabel(x))}</button>`);b.onclick=()=>select(x);b.onmouseenter=()=>highlight(x);b.onmouseleave=clearHL;c.appendChild(b)})}
function select(n,quiet){if(!n||n.nodeType!==1)return;ST.sel=n;let p=n.parentNode;while(p&&p.nodeType===1){EL.opened.add(p);p=p.parentNode}
 window.$0=n;if(P.elements.built){renderTree();renderSide();const r=$('#tree .tr.sel');if(r&&!quiet){const tr=$('#tree');const rt=r.offsetTop;if(rt<tr.scrollTop||rt>tr.scrollTop+tr.clientHeight-30)tr.scrollTop=rt-tr.clientHeight/3}}
 if(!quiet)track('select-node');bus.emit('select',n)}
function editInline(span,val,commit){const e=h(`<span class="edit" contenteditable="true" spellcheck="false"></span>`);e.textContent=val;span.replaceWith(e);e.focus();document.getSelection().selectAllChildren(e);
 let done=false;const fin=ok=>{if(done)return;done=true;const v=e.textContent;if(ok&&v!==val)commit(v);renderTree()};
 e.addEventListener('keydown',ev=>{ev.stopPropagation();if(ev.key==='Enter'){ev.preventDefault();fin(true)}if(ev.key==='Escape')fin(false)});e.addEventListener('blur',()=>fin(true))}
function treeKeys(e){const n=ST.sel;if(!n)return;const els=EL.rows.filter((x,i,a)=>x&&x.nodeType===1&&a.indexOf(x)===i);const i=els.indexOf(n);
 if(e.key==='ArrowDown'){e.preventDefault();select(els[Math.min(els.length-1,i+1)])}
 else if(e.key==='ArrowUp'){e.preventDefault();select(els[Math.max(0,i-1)])}
 else if(e.key==='ArrowRight'){e.preventDefault();if(!EL.opened.has(n)&&n.children.length){EL.opened.add(n);renderTree()}else if(n.firstElementChild)select(n.firstElementChild)}
 else if(e.key==='ArrowLeft'){e.preventDefault();if(EL.opened.has(n)){EL.opened.delete(n);renderTree()}else if(n.parentNode&&n.parentNode.nodeType===1)select(n.parentNode)}
 else if(e.key==='h'||e.key==='H'){if(BODY.contains(n)&&n!==BODY){n.classList.toggle(HIDE_CLS);track('hide-node')}}
 else if(e.key==='Delete'||e.key==='Backspace'){if(BODY.contains(n)&&n!==BODY){e.preventDefault();removeNode(n)}}
 else if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();const u=EL.undo.pop();if(u){u.parent.insertBefore(u.node,u.next);select(u.node);toast('Undo: node restored')}}}
function removeNode(n){const u={node:n,parent:n.parentNode,next:n.nextSibling};const nx=n.nextElementSibling||n.previousElementSibling||n.parentNode;n.remove();EL.undo.push(u);select(nx);toast('Deleted — Ctrl+Z in the tree restores it');track('delete-node')}
function cssPath(n){const parts=[];while(n&&n.nodeType===1&&n!==BODY){let s=n.tagName.toLowerCase();if(n.id){parts.unshift('#'+n.id);break}const cls=[...n.classList].filter(c=>!c.startsWith('__'));if(cls.length)s+='.'+cls.join('.');const sib=[...n.parentNode.children].filter(c=>c.tagName===n.tagName);if(sib.length>1)s+=`:nth-of-type(${sib.indexOf(n)+1})`;parts.unshift(s);n=n.parentNode}return (parts[0]&&parts[0].startsWith('#')?'':'body > ')+parts.join(' > ')}
function elMenu(n,x,y){const bps=EL.domBps.get(n)||new Set();const tog=t=>{if(bps.has(t))bps.delete(t);else bps.add(t);EL.domBps.set(n,bps);toast(bps.has(t)?`DOM breakpoint set: ${t==='subtree'?'subtree modifications':'attribute modifications'}`:'DOM breakpoint removed');track('dom-bp')};
 openMenu(x,y,[{label:'Add attribute',act:()=>{const at='data-note';n.setAttribute(at,'');renderTree()}},{label:'Edit as HTML',act:()=>editAsHTML(n)},'-',
  {label:ST.forceHover.has(n)?'✓ Force state :hover':'Force state :hover',act:()=>setForceHover(n,!ST.forceHover.has(n))},{label:n.classList.contains(HIDE_CLS)?'Show element':'Hide element',hint:'H',act:()=>{n.classList.toggle(HIDE_CLS);track('hide-node')}},{label:'Delete element',hint:'Del',act:()=>removeNode(n)},'-',
  {label:'Copy selector',act:()=>copyText(cssPath(n))},{label:'Copy JS path',act:()=>copyText(`document.querySelector("${cssPath(n)}")`)},{label:'Copy outerHTML',act:()=>copyText(n.outerHTML)},'-',
  {head:'Break on…'},{label:(bps.has('subtree')?'✓ ':'')+'subtree modifications',act:()=>tog('subtree')},{label:(bps.has('attributes')?'✓ ':'')+'attribute modifications',act:()=>tog('attributes')},'-',
  {label:'Store as global variable',act:()=>{let k=1;while(CONSOLE_VARS['temp'+k])k++;CONSOLE_VARS['temp'+k]=n;CON.add({type:'input',args:['temp'+k]});CON.add({type:'result',args:[n]});setPanel('console')}},{label:'Scroll into view',act:()=>n.scrollIntoView({block:'center',behavior:'smooth'})}])}
function editAsHTML(n){const r=[...$$('#tree .tr')].find(x=>EL.rows[+x.dataset.i]===n);if(!r)return;const ta=h('<textarea spellcheck="false" style="width:calc(100% - 20px);margin:2px 10px;height:120px;background:#17181A;color:#E3E3E3;border:1px solid #8AB4F8;font:400 12px/1.5 var(--mono);outline:none"></textarea>');ta.value=n.outerHTML;r.replaceWith(ta);ta.focus();
 const fin=()=>{try{const t=document.createElement('template');t.innerHTML=ta.value;const nn=t.content.firstElementChild;if(nn&&nn.outerHTML!==n.outerHTML){n.replaceWith(nn);select(nn);toast('Replaced — listeners on the old node are gone');track('edit-dom')}else renderTree()}catch{renderTree()}};ta.addEventListener('blur',fin);ta.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&(e.ctrlKey||e.metaKey))ta.blur();if(e.key==='Escape'){ta.value=n.outerHTML;ta.blur()}})}
function setForceHover(n,on){if(on){ST.forceHover.add(n);n.classList.add('__hov')}else{ST.forceHover.delete(n);n.classList.remove('__hov')}renderSide();track('force-hover')}

/* ---------- highlight overlay ---------- */
function relRect(n){const pa=$('#pagearea').getBoundingClientRect();const r=n.getBoundingClientRect();return{x:r.left-pa.left,y:r.top-pa.top,w:r.width,h:r.height,pa}}
function highlight(n,inspect){const hl=$('#hl');hl.innerHTML='';if(!n||n.nodeType!==1||!n.isConnected||n===HTML||HEAD.contains(n)||n===HEAD)return;
 const r=relRect(n);if(!r.w&&!r.h&&n!==BODY)return;const cs=getComputedStyle(n);const sc=n.offsetWidth?r.w/n.offsetWidth:1;const px=k=>(parseFloat(cs[k])||0)*sc;
 const m=[px('marginTop'),px('marginRight'),px('marginBottom'),px('marginLeft')],b=[px('borderTopWidth'),px('borderRightWidth'),px('borderBottomWidth'),px('borderLeftWidth')],p=[px('paddingTop'),px('paddingRight'),px('paddingBottom'),px('paddingLeft')];
 const ring=(x,y,w,hh,bw,col,bg)=>{const d=document.createElement('div');d.className='ring';Object.assign(d.style,{left:x+'px',top:y+'px',width:Math.max(0,w)+'px',height:Math.max(0,hh)+'px',borderWidth:bw.map(v=>Math.max(0,v)+'px').join(' '),borderColor:col,background:bg||'transparent'});hl.appendChild(d)};
 ring(r.x-m[3],r.y-m[0],r.w+m[1]+m[3],r.h+m[0]+m[2],m,'rgba(246,178,107,.66)');ring(r.x,r.y,r.w,r.h,b,'rgba(255,229,153,.66)');ring(r.x+b[3],r.y+b[0],r.w-b[1]-b[3],r.h-b[0]-b[2],p,'rgba(147,196,125,.66)');
 ring(r.x+b[3]+p[3],r.y+b[0]+p[0],r.w-b[1]-b[3]-p[1]-p[3],r.h-b[0]-b[2]-p[0]-p[2],[0,0,0,0],'transparent','rgba(111,168,220,.6)');
 const cls=[...n.classList].filter(c=>!c.startsWith('__'));let tip=`<span class="t">${n.tagName.toLowerCase()}</span><span class="c">${n.id?'#'+n.id:''}${cls.length?'.'+cls.join('.'):''}</span><span class="d">${Math.round(n.offsetWidth*100)/100} × ${Math.round(n.offsetHeight*100)/100}</span>`;
 if(inspect){const ct=contrastOf(n);const nm=accName(n);tip+=`<table><tr><td>Color</td><td>${swatchTxt(cs.color)}</td></tr><tr><td>Font</td><td>${esc(cs.fontSize+' '+cs.fontFamily.split(',')[0].replace(/"/g,''))}</td></tr>${effBg(n)?`<tr><td>Background</td><td>${swatchTxt(effBg(n))}</td></tr>`:''}${cs.padding!=='0px'?`<tr><td>Padding</td><td>${cs.padding}</td></tr>`:''}${cs.margin!=='0px'?`<tr><td>Margin</td><td>${cs.margin}</td></tr>`:''}
  <tr><td colspan="2" class="sec">ACCESSIBILITY</td></tr>${ct&&n.textContent.trim()?`<tr><td>Contrast</td><td>Aa ${ct.toFixed(2)} <b style="color:${ct>=4.5?'#188038':'#E37400'}">${ct>=4.5?'✓':'⚠'}</b></td></tr>`:''}<tr><td>Name</td><td>${esc((nm||'').slice(0,26))}</td></tr><tr><td>Role</td><td>${roleOf(n)}</td></tr><tr><td>Keyboard-focusable</td><td>${n.tabIndex>=0?'<b style="color:#188038">✓</b>':'<span style="color:#9AA0A6">⊘</span>'}</td></tr></table>`}
 const t=h(`<div class="hltip">${tip}</div>`);hl.appendChild(t);const pa=r.pa;let ty=r.y+r.h+m[2]+8;if(ty+t.offsetHeight>pa.height-4)ty=Math.max(4,r.y-m[0]-t.offsetHeight-8);let tx=clamp(r.x,4,pa.width-t.offsetWidth-4);t.style.left=tx+'px';t.style.top=ty+'px'}
function clearHL(){const hl=$('#hl');if(hl)hl.innerHTML=''}
function swatchTxt(c){const hx=toHex(c);return `<i style="display:inline-block;width:10px;height:10px;border:1px solid #999;background:${c};vertical-align:-1px;margin-right:4px"></i>${hx||c}`}
function parseRGB(c){const m=String(c).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null}
function toHex(c){if(/^#/.test(c))return c.toUpperCase();const v=parseRGB(c);if(!v)return null;return'#'+v.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join('').toUpperCase()}
function effBg(n){let x=n;while(x&&x.nodeType===1){const cs=getComputedStyle(x);const v=parseRGB(cs.backgroundColor);if(v&&v[3]>0.5)return cs.backgroundColor;if(cs.backgroundImage!=='none'){const m=cs.backgroundImage.match(/rgba?\([^)]+\)/);if(m)return m[0]}x=x.parentNode}return 'rgb(244, 239, 232)'}
function lum(v){const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(v[0])+.7152*f(v[1])+.0722*f(v[2])}
function contrast(a,b){const A=lum(a)+.05,B=lum(b)+.05;return Math.max(A,B)/Math.min(A,B)}
function contrastOf(n){const fg=parseRGB(getComputedStyle(n).color),bg=parseRGB(effBg(n));return fg&&bg?contrast(fg,bg):null}
function roleOf(n){const t=n.tagName.toLowerCase();return n.getAttribute('role')||({a:'link',button:'button',h1:'heading',h2:'heading',h3:'heading',nav:'navigation',header:'banner',section:'region',article:'article',aside:'complementary',p:'paragraph',body:'generic',img:'image'})[t]||'generic'}
function accName(n){return n.getAttribute('aria-label')||(/^(a|button|h\d|p|span|b)$/i.test(n.tagName)?n.textContent.trim():'')}

/* ---------- inspect mode ---------- */
function setInspect(on){ST.inspecting=on;$('#inspectBtn').setAttribute('aria-pressed',on);$('#pagearea').style.cursor=on?'crosshair':'';if(!on)clearHL();else{toast('Hover the page, click to select an element')}}
shadow.addEventListener('mousemove',e=>{if(!ST.inspecting)return;const t=e.composedPath()[0];if(t&&t.nodeType===1){highlight(t,true);ST._hov=t}},true);
shadow.addEventListener('click',e=>{if(!ST.inspecting)return;e.preventDefault();e.stopPropagation();const t=e.composedPath()[0];setInspect(false);if(!ST.open)toggleDevtools(true);setPanel('elements');select(t);highlight(t);setTimeout(clearHL,900);track('inspect-pick')},true);
pageHost.addEventListener('mouseleave',()=>{if(ST.inspecting)clearHL()});
pageHost.addEventListener('scroll',()=>{clearHL();drawGrids()},{passive:true});

/* ---------- grid / flex overlays ---------- */
function toggleGrid(n){if(EL.grids.has(n))EL.grids.delete(n);else EL.grids.add(n);renderTree();drawGrids();if(EL.sub==='layout')renderSide();track('grid-overlay')}
function drawGrids(){$$('.gridov').forEach(g=>g.remove());const pa=$('#pagearea');if(!pa)return;EL.grids.forEach(n=>{if(!n.isConnected)return;const r=relRect(n);const cs=getComputedStyle(n);const sc=n.offsetWidth?r.w/n.offsetWidth:1;const isGrid=/grid/.test(cs.display);const col=isGrid?'#C76EDC':'#8AB4F8';
  const g=h(`<div class="gridov" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px"></div>`);let s=`<div style="position:absolute;inset:0;border:2px ${isGrid?'solid':'dashed'} ${col}"></div>`;
  const pl=(parseFloat(cs.paddingLeft)||0)*sc,pt=(parseFloat(cs.paddingTop)||0)*sc,pb=(parseFloat(cs.paddingBottom)||0)*sc;
  if(isGrid){const cols=cs.gridTemplateColumns.split(' ').map(parseFloat).filter(x=>!isNaN(x)).map(x=>x*sc);const gap=(parseFloat(cs.columnGap)||0)*sc;let x=pl;const lines=[x];cols.forEach((w,i)=>{x+=w;lines.push(x);if(i<cols.length-1){s+=`<div style="position:absolute;left:${x}px;width:${gap}px;top:${pt}px;bottom:${pb}px;background:repeating-linear-gradient(45deg,rgba(199,110,220,.45) 0 2px,transparent 2px 6px)"></div>`;x+=gap;lines.push(x)}});
   lines.forEach((lx,i)=>{s+=`<div style="position:absolute;left:${lx}px;top:${pt}px;bottom:${pb}px;border-left:1.5px dashed ${col}"></div>`});
   const starts=[pl];let acc=pl;cols.forEach((w,i)=>{acc+=w+(i<cols.length-1?gap:0);starts.push(acc)});starts.forEach((lx,i)=>s+=`<div style="position:absolute;left:${lx-9}px;top:${Math.max(-18,pt-18)}px;background:${col};color:#fff;font:700 10px/16px var(--mono);padding:0 4px;border-radius:3px">${i+1}</div>`);
   let cx=pl;cols.forEach((w,i)=>{s+=`<div style="position:absolute;left:${cx+w/2-24}px;top:${pt+4}px;background:rgba(255,255,255,.9);color:#6E2B7F;font:600 10px/15px var(--mono);padding:0 4px;border-radius:3px;border:1px solid ${col}">${(w/sc).toFixed(1)}px</div>`;cx+=w+gap})}
  else{[...n.children].forEach(c=>{const cr=relRect(c);s+=`<div style="position:absolute;left:${cr.x-r.x}px;top:${cr.y-r.y}px;width:${cr.w}px;height:${cr.h}px;border:1px dashed ${col};background:rgba(138,180,248,.08)"></div>`})}
  g.innerHTML=s;pa.appendChild(g)})}
bus.on('css',()=>requestAnimationFrame(drawGrids));

/* ---------- side panes ---------- */
const UA={h1:[['display','block'],['font-size','2em'],['margin-block','0.67em'],['font-weight','bold']],h3:[['display','block'],['font-size','1.17em'],['margin-block','1em'],['font-weight','bold']],p:[['display','block'],['margin-block','1em']],a:[['color','-webkit-link'],['cursor','pointer'],['text-decoration','underline']],
 button:[['padding-block','1px'],['padding-inline','6px'],['border','2px outset buttonborder'],['background-color','buttonface'],['font','-webkit-small-control'],['color','buttontext']],nav:[['display','block']],header:[['display','block']],section:[['display','block']],article:[['display','block']],aside:[['display','block']],body:[['display','block'],['margin','8px']],div:[['display','block']]};
const INH=/^(color|font|font-.+|line-height|letter-spacing|text-align|visibility|cursor|white-space|word-spacing|text-transform)$/;
function mediaOk(m){const mm=m.match(/max-width:\s*(\d+)px/);return !mm||pageHost.clientWidth<=+mm[1]}
function matched(el){const res=[];RULES.forEach(r=>{let best=-1;r.sel.split(',').map(s=>s.trim()).forEach(part=>{const hov=/:hover/.test(part);const test=part.replace(/:hover/g,'');try{if(el.matches(test)&&(!hov||ST.forceHover.has(el)))best=Math.max(best,specificity(part))}catch{}});if(best>=0&&(!r.media||mediaOk(r.media)))res.push({r,spec:best})});
 res.sort((a,b)=>b.spec-a.spec||(b.r.media?1:0)-(a.r.media?1:0)||b.r.id-a.r.id);return res}
function inlineDecls(el){const s=el.getAttribute('style')||'';return s.split(';').map(x=>x.trim()).filter(Boolean).filter(x=>!x.startsWith('--art')||el.classList.contains('card')).map(x=>{const i=x.indexOf(':');return{p:x.slice(0,i).trim(),v:x.slice(i+1).trim(),on:true,inline:true}})}
function renderSide(){const v=$('#elView');if(!v)return;const el=ST.sel;if(!el){v.innerHTML='<div class="empty">Select a node</div>';return}
 if(EL.sub==='styles')renderStyles(v,el);else if(EL.sub==='computed')renderComputed(v,el);else if(EL.sub==='layout')renderLayout(v);else if(EL.sub==='listeners')renderListeners(v,el);else renderA11y(v,el)}
function renderStyles(v,el){const flt=(EL.filter||'').toLowerCase();
 v.innerHTML=`<div class="tb" data-hs="el-filter"><input class="inp" id="stFilter" placeholder="Filter" value="${esc(EL.filter||'')}" style="flex:1;min-width:60px"><button class="tbb" id="hovBtn" aria-pressed="${!!EL.hovOpen}" title="Toggle element state">:hov</button><button class="tbb" id="clsBtn" aria-pressed="${!!EL.clsOpen}" title="Element classes">.cls</button></div>
 ${EL.hovOpen?`<div style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;font:400 12px var(--body)"><div style="color:#9AA0A6;margin-bottom:4px">Force element state</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px 8px">${[':active',':hover',':focus',':visited',':focus-within',':focus-visible',':target'].map(s=>`<label class="ck"><input type="checkbox" data-st="${s}" ${s===':hover'&&ST.forceHover.has(el)?'checked':''}>${s}</label>`).join('')}</div></div>`:''}
 ${EL.clsOpen?`<div style="padding:6px 10px;border-bottom:1px solid var(--dtl);background:#232428;font:400 12px var(--body)"><input class="inp" id="addCls" placeholder="Add new class" style="width:100%"><div style="display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:5px">${[...el.classList].filter(c=>!c.startsWith('__')).concat(EL.offCls&&EL.offCls.el===el?EL.offCls.list:[]).map(c=>`<label class="ck"><input type="checkbox" data-cls="${esc(c)}" ${el.classList.contains(c)?'checked':''}>${esc(c)}</label>`).join('')}</div></div>`:''}
 <div class="styles" id="styles" data-hs="el-styles"></div>`;
 const box=$('#styles',v);const winners={};const blocks=[];
 const inl=inlineDecls(el);blocks.push({kind:'inline',decls:inl});
 matched(el).forEach(({r})=>blocks.push({kind:'rule',r,decls:r.d}));
 const ua=UA[el.tagName.toLowerCase()];if(ua)blocks.push({kind:'ua',sel:el.tagName.toLowerCase()==='a'?'a:-webkit-any-link':el.tagName.toLowerCase(),decls:ua.map(([p,v])=>({p,v,on:true}))});
 blocks.forEach(b=>b.decls.forEach(d=>{d._st=!d.on?'off':winners[d.p]?'over':(winners[d.p]=1,'win')}));
 // inherited
 const inh=[];let a=el.parentNode;while(a&&a.nodeType===1&&a!==HTML){const ms=matched(a).map(({r})=>({r,decls:r.d.filter(d=>INH.test(d.p))})).filter(x=>x.decls.length);if(ms.length)inh.push({a,ms});a=a.parentNode}
 inh.forEach(g=>g.ms.forEach(m=>m.decls.forEach(d=>{m._st=m._st||{};m._st[d.p]=!d.on?'off':winners[d.p]?'over':(winners[d.p]=1,'win')})));
 const declHTML=(d,ri,di,st)=>{if(flt&&!(d.p+':'+d.v).toLowerCase().includes(flt))return'';const col=/^(#|rgb|hsl)/i.test(d.v)||/^(color|background|background-color|border-color)$/.test(d.p)&&/#[0-9a-f]{3,8}|rgb/i.test(d.v);const cm=d.v.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/);
  return `<div class="dcl ${st==='over'?'over':st==='off'?'off':''}">${ri!=null?`<input type="checkbox" ${d.on?'checked':''} data-r="${ri}" data-d="${di}" aria-label="Toggle ${esc(d.p)}">`:''}<span class="p">${esc(d.p)}</span>: <span class="v" ${ri!=null?`data-r="${ri}" data-d="${di}"`:''}>${cm&&ri!=null?`<i class="sw" style="background:${esc(cm[0])}" data-r="${ri}" data-d="${di}" title="Open color picker"></i>`:''}${esc(d.v)}</span>;</div>`};
 let out='';
 blocks.forEach(b=>{if(b.kind==='inline'){out+=`<div class="rule"><span>element.style</span> {${b.decls.map((d,i)=>declHTML(d,null,i,d._st)).join('')}<div class="dcl" style="padding-left:20px"><span class="v" id="addInline" style="color:#6E7379;cursor:text">+ add declaration</span></div>}</div>`;return}
  if(b.kind==='ua'){out+=`<div class="rule"><span class="src ua">user agent stylesheet</span><span>${esc(b.sel)}</span> {${b.decls.map((d,i)=>declHTML(d,null,i,d._st)).join('')}}</div>`;return}
  const r=b.r;out+=`<div class="rule">${r.media?`<div class="media">@media ${esc(r.media)}</div>`:''}<button class="src" data-line="${r.line}">app.css:${r.line}</button><span>${esc(r.sel)}</span> {${r.d.map((d,i)=>declHTML(d,r.id,i,d._st)).join('')}}</div>`});
 inh.forEach(g=>{out+=`<div class="inh">Inherited from <span style="color:var(--tag);font-family:var(--mono)">${esc(nodeLabel(g.a))}</span></div>`;g.ms.forEach(m=>{out+=`<div class="rule"><button class="src" data-line="${m.r.line}">app.css:${m.r.line}</button><span>${esc(m.r.sel)}</span> {${m.decls.map(d=>declHTML(d,m.r.id,m.r.d.indexOf(d),m._st[d.p])).join('')}}</div>`})});
 box.innerHTML=out;
 // box model at bottom (like the Computed tab preview)
 box.insertAdjacentHTML('beforeend',boxModelHTML(el));
 const fi=$('#stFilter',v);fi.oninput=()=>{EL.filter=fi.value;renderStyles(v,el);const f2=$('#stFilter',v);f2.focus();f2.setSelectionRange(f2.value.length,f2.value.length)};
 $('#hovBtn',v).onclick=()=>{EL.hovOpen=!EL.hovOpen;renderStyles(v,el)};$('#clsBtn',v).onclick=()=>{EL.clsOpen=!EL.clsOpen;renderStyles(v,el)};
 $$('[data-st]',v).forEach(c=>c.onchange=()=>{if(c.dataset.st===':hover')setForceHover(el,c.checked)});
 $$('[data-cls]',v).forEach(c=>c.onchange=()=>{const k=c.dataset.cls;if(!EL.offCls||EL.offCls.el!==el)EL.offCls={el,list:[]};if(c.checked){el.classList.add(k);EL.offCls.list=EL.offCls.list.filter(x=>x!==k)}else{el.classList.remove(k);EL.offCls.list.push(k)}});
 const ac=$('#addCls',v);if(ac)ac.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'&&ac.value.trim()){el.classList.add(...ac.value.trim().split(/\s+/));ac.value=''}};
 box.onchange=e=>{const c=e.target;if(c.dataset.r==null)return;const d=RULES[+c.dataset.r].d[+c.dataset.d];d.on=c.checked;logChange(RULES[+c.dataset.r],d,c.checked?'enabled':'disabled');applyCSS();renderStyles(v,el);track('toggle-decl')};
 box.onclick=e=>{const sw=e.target.closest('.sw');if(sw){pickColor(sw,el);return}const src=e.target.closest('.src[data-line]');if(src){SRC.open('app.css',+src.dataset.line);return}
  const vv=e.target.closest('.v[data-r]');if(vv){editDecl(vv,el);return}if(e.target.id==='addInline')addInline(e.target,el)}}
function logChange(r,d,what){ST.changes.push({sel:r.sel,p:d.p,from:d.orig,to:d.v,on:d.on,what,t:Date.now()});bus.emit('changes')}
function editDecl(span,el){const d=RULES[+span.dataset.r].d[+span.dataset.d];const r=RULES[+span.dataset.r];const old=d.v;span.innerHTML='';span.textContent=old;span.contentEditable='true';span.classList.add('edit');span.focus();document.getSelection().selectAllChildren(span);
 const apply=v=>{d.v=v;applyCSS()};let done=false;
 span.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();span.blur()}else if(e.key==='Escape'){span.textContent=old;apply(old);done=true;span.blur()}
  else if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();const step=(e.shiftKey?10:e.altKey?0.1:1)*(e.key==='ArrowUp'?1:-1);const t=span.textContent.replace(/-?\d*\.?\d+/,m=>String(Math.round((parseFloat(m)+step)*10)/10));span.textContent=t;apply(t);document.getSelection().selectAllChildren(span);track('nudge-value')}};
 span.oninput=()=>apply(span.textContent);
 span.onblur=()=>{if(!done){d.v=span.textContent.trim()||old;applyCSS();if(d.v!==old){logChange(r,d,'edited');track('edit-value')}}renderStyles($('#elView'),el)}}
function addInline(span,el){const inp=h('<span class="edit" contenteditable="true" spellcheck="false"></span>');span.replaceWith(inp);inp.focus();inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();inp.blur()}if(e.key==='Escape'){inp.textContent='';inp.blur()}};
 inp.onblur=()=>{const t=inp.textContent.trim();if(t.includes(':')){const [p,...rest]=t.split(':');el.style.setProperty(p.trim(),rest.join(':').replace(/;$/,'').trim());track('edit-value');ST.changes.push({sel:'element.style',p:p.trim(),from:'',to:rest.join(':').trim(),what:'added',t:Date.now()});bus.emit('changes')}renderStyles($('#elView'),el)}}
function pickColor(sw,el){const d=RULES[+sw.dataset.r].d[+sw.dataset.d];const r=RULES[+sw.dataset.r];const cur=(d.v.match(/#[0-9a-fA-F]{6}\b/)||[])[0]||toHex(getComputedStyle(el).color)||'#000000';
 const inp=document.createElement('input');inp.type='color';inp.value=cur.length===7?cur:'#000000';inp.style.cssText='position:fixed;left:-100px;top:0;opacity:0';document.body.appendChild(inp);
 inp.oninput=()=>{d.v=d.v.replace(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/,inp.value.toUpperCase());if(!/#|rgb/.test(d.v))d.v=inp.value;applyCSS();sw.style.background=inp.value};
 inp.onchange=()=>{logChange(r,d,'color');track('color-pick');renderStyles($('#elView'),el);inp.remove()};inp.click();setTimeout(()=>{if(document.body.contains(inp)&&!inp.value)inp.remove()},60000)}
function boxModelHTML(el){const cs=getComputedStyle(el);const n=k=>{const v=parseFloat(cs[k])||0;return v?Math.round(v*100)/100:'–'};
 return `<div style="padding:4px 10px 14px"><div class="boxm" data-hs="el-box"><div><span class="lab">margin</span>${n('marginTop')}<div><span class="lab">border</span>${n('borderTopWidth')}<div><span class="lab">padding</span>${n('paddingTop')}<div class="row"><span>${n('paddingLeft')}</span><span class="cbox">${Math.round((el.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0))*100)/100} × ${Math.round((el.clientHeight-(parseFloat(cs.paddingTop)||0)-(parseFloat(cs.paddingBottom)||0))*100)/100}</span><span>${n('paddingRight')}</span></div>${n('paddingBottom')}</div>${n('borderBottomWidth')}</div>${n('marginBottom')}</div></div></div>`}
const COMP=['display','position','box-sizing','width','height','margin','padding','border-radius','color','background-color','background-image','font-family','font-size','font-weight','line-height','letter-spacing','text-decoration','cursor','grid-template-columns','gap','align-items','justify-content','flex-direction','overflow','z-index','transform','box-shadow','transition','visibility','opacity'];
function renderComputed(v,el){const cs=getComputedStyle(el);const all=!!EL.compAll;const props=all?[...cs].sort():COMP;const f=(EL.cfilter||'').toLowerCase();
 v.innerHTML=boxModelHTML(el)+`<div class="tb"><input class="inp" id="cFilter" placeholder="Filter" value="${esc(EL.cfilter||'')}" style="flex:1"><label class="ck"><input type="checkbox" id="cAll" ${all?'checked':''}>Show all</label></div><div class="comp">${props.filter(p=>!f||p.includes(f)).map(p=>`<div><span class="p">${p}</span><span class="v">${/color/.test(p)?swatchTxt(cs.getPropertyValue(p)):esc(cs.getPropertyValue(p))}</span></div>`).join('')}</div>`;
 const fi=$('#cFilter',v);fi.oninput=()=>{EL.cfilter=fi.value;renderComputed(v,el);$('#cFilter',v).focus();$('#cFilter',v).setSelectionRange(99,99)};$('#cAll',v).onchange=e=>{EL.compAll=e.target.checked;renderComputed(v,el)}}
function renderLayout(v){const grids=PAGE.qa('*').filter(n=>/grid/.test(getComputedStyle(n).display));const flexes=PAGE.qa('*').filter(n=>/flex/.test(getComputedStyle(n).display));
 const row=n=>`<label class="ck" style="display:flex;padding:3px 0;font:400 12.5px var(--mono)"><input type="checkbox" data-g="${PAGE.qa('*').indexOf(n)}" ${EL.grids.has(n)?'checked':''}><span style="color:var(--tag)">${esc(nodeLabel(n))}</span></label>`;
 v.innerHTML=`<div style="padding:10px 12px;font:400 12.5px var(--body)"><div style="font-weight:600;margin-bottom:6px">Grid</div><div style="color:#9AA0A6;margin-bottom:6px">Overlay display settings: line numbers · track sizes</div>${grids.map(row).join('')||'<div class="muted">No grid layouts</div>'}
 <div style="font-weight:600;margin:14px 0 6px">Flexbox</div>${flexes.map(row).join('')}</div>`;$$('[data-g]',v).forEach(c=>c.onchange=()=>toggleGrid(PAGE.qa('*')[+c.dataset.g]))}
function renderListeners(v,el){let x=el;const rows=[];while(x&&x!==HTML){LISTENERS.filter(l=>l.el===x&&!l.removed).forEach(l=>rows.push(l));x=x.parentNode}
 const types=[...new Set(rows.map(r=>r.type))];v.innerHTML=`<div class="tb"><button class="tbb" id="lRefresh">${IC.reload}</button><label class="ck"><input type="checkbox" checked disabled>Ancestors</label><span style="color:#9AA0A6">Framework listeners</span></div>`+
  (types.length?types.map(t=>`<div style="padding:4px 10px;font:600 12.5px var(--mono);background:#232428;border-bottom:1px solid #2E3035">▾ ${t}</div>`+rows.filter(r=>r.type===t).map(r=>`<div style="display:flex;gap:10px;padding:3px 10px 3px 26px;font:400 12px var(--mono);border-bottom:1px solid #2A2B2F"><span style="color:var(--tag)">${esc(nodeLabel(r.el))}</span><span style="margin-left:auto;color:#9AA0A6;text-decoration:underline;cursor:pointer" data-src="${r.src}">${r.src}</span><button class="pill" data-rm="${LISTENERS.indexOf(r)}">Remove</button></div>`).join('')).join(''):'<div class="empty">No event listeners on this node or its ancestors.<br>Select a button in the page.</div>');
 $$('[data-rm]',v).forEach(b=>b.onclick=()=>{LISTENERS[+b.dataset.rm].removed=true;toast('Listener removed — clicking it now does nothing');renderListeners(v,el);track('remove-listener')});$$('[data-src]',v).forEach(s=>s.onclick=()=>{const [f,l]=s.dataset.src.split(':');SRC.open(f,+l)})}
function renderA11y(v,el){const chain=[];let x=el;while(x&&x!==HTML){chain.unshift(x);x=x.parentNode}const ct=contrastOf(el);
 v.innerHTML=`<div style="padding:10px 12px;font:400 12.5px/22px var(--body)"><div style="font-weight:600;margin-bottom:4px">Accessibility tree</div><div style="font-family:var(--mono);font-size:12px">RootWebArea "Driftwood — Specialty Coffee"${chain.filter(c=>roleOf(c)!=='generic'||c===el).map((c,i)=>`<div style="padding-left:${(i+1)*12}px;${c===el?'background:var(--dsel)':''}">${roleOf(c)} ${accName(c)?`"${esc(accName(c).slice(0,40))}"`:''}</div>`).join('')}</div>
 <div style="font-weight:600;margin:12px 0 4px">Computed properties</div><div class="kv" style="padding:0"><div><b>Name</b><span>${esc(accName(el)||'""')}</span></div><div><b>Role</b><span>${roleOf(el)}</span></div><div><b>Focusable</b><span>${el.tabIndex>=0}</span></div>${ct?`<div><b>Contrast ratio</b><span class="${ct>=4.5?'g':'o'}">${ct.toFixed(2)} ${ct>=4.5?'✓ AA':'✗ fails AA 4.5'}</span></div>`:''}</div></div>`}
