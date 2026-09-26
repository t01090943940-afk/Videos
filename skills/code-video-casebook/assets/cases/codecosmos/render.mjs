import { chromium } from 'playwright';
import fs from 'fs';
import http from 'http';
import path from 'path';
const root = path.resolve('web');
const types = { '.js':'text/javascript', '.html':'text/html', '.json':'application/json' };
const srv = http.createServer((q,r)=>{ let f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f+='index.html';
  fs.readFile(f,(e,d)=>{ if(e){r.writeHead(404);r.end();return;} r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'}); r.end(d); }); }).listen(8765);
const args = process.argv.slice(2);
const outDir = args[0]; const frames = args[1] ? args[1].split(',').flatMap(s=>{ if(s.includes('-')){const [a,b]=s.split('-').map(Number); return Array.from({length:b-a+1},(_,i)=>a+i);} return [Number(s)]; }) : null;
fs.mkdirSync(outDir,{recursive:true});
const b = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p = await b.newPage({viewport:{width:1920,height:1080}});
p.on('console', m=>{ if(m.type()==='error') console.log('console:', m.text()); });
p.on('pageerror', e=>console.log('pageerror:', e.message));
await p.goto('http://localhost:8765/index.html');
await p.waitForFunction(()=>window.READY||window.ERR, null, {timeout:60000});
const err = await p.evaluate(()=>window.ERR); if (err) { console.log('ERR', err); process.exit(1); }
await p.evaluate(()=>document.fonts.ready);
const total = await p.evaluate(()=>window.TOTAL_FRAMES);
const list = frames || Array.from({length: total}, (_,i)=>i);
const t0 = Date.now(); let n=0;
for (const f of list) {
  const url = await p.evaluate((f)=>{ window.renderFrame(f); return document.getElementById('out').toDataURL('image/jpeg', 0.93); }, f);
  fs.writeFileSync(`${outDir}/f${String(f).padStart(5,'0')}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  n++; if (n % 50 === 0) console.log(`${n}/${list.length}  ${((Date.now()-t0)/n).toFixed(0)} ms/f`);
}
console.log('done', n, ((Date.now()-t0)/n).toFixed(0), 'ms/f');
await b.close(); srv.close();
