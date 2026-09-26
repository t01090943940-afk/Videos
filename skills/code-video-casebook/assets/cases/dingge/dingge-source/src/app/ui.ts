import type { Quality } from '../core/engine';

// Sandbox UI: floating right-side dock (mode, shots, viewpoints, settings), bottom shot-segmented scrubber,
// small HUD. Same palette as the film's MG layer.

interface UIOpts {
  shots: { id: string; title: string; start: number; dur: number }[];
  total: number; presets: string[]; quality: Quality;
  onMode(m: 'explore' | 'film'): void; onPreset(n: string): void; onSeek(t: number): void; onPlay(p: boolean): void;
  onTake(t: 'good' | 'bad'): void; onSun(elev: number, az: number): void; onQuality(q: Quality): void;
}

const CSS = `
:root{--ink:#111418;--ink2:#1b2027;--line:#2c333c;--paper:#F4F1EA;--mute:#9AA3AD;--y:#FFC400;--r:#E53935;--g:#2EAD5B}
.ui{position:fixed;inset:0;pointer-events:none;font-family:"Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif;color:var(--paper);z-index:5}
.ui *{box-sizing:border-box}
.hud{position:absolute;left:16px;top:14px;display:flex;gap:10px;align-items:center;pointer-events:none}
.hud .t{background:var(--ink);border:1px solid var(--line);padding:8px 12px;border-radius:10px;font-weight:900;letter-spacing:.04em}
.hud .t b{color:var(--y)}
.hud .m{background:rgba(17,20,24,.72);padding:6px 10px;border-radius:8px;font:600 12px/1.2 ui-monospace,monospace;color:var(--mute)}
.dock{position:absolute;right:16px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:6px;background:rgba(17,20,24,.88);border:1px solid var(--line);border-radius:18px;padding:8px;pointer-events:auto;backdrop-filter:blur(6px)}
.dock button{all:unset;cursor:pointer;width:64px;padding:9px 0 7px;border-radius:12px;text-align:center;font-size:12px;font-weight:700;color:var(--mute);display:flex;flex-direction:column;align-items:center;gap:4px}
.dock button svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2}
.dock button:hover{background:var(--ink2);color:var(--paper)}
.dock button.on{background:var(--y);color:var(--ink)}
.dock hr{border:0;border-top:1px solid var(--line);margin:2px 6px}
.panel{position:absolute;right:100px;top:50%;transform:translateY(-50%);width:min(340px,calc(100vw - 132px));max-height:78vh;overflow:auto;background:rgba(17,20,24,.94);border:1px solid var(--line);border-radius:16px;padding:14px;pointer-events:auto;display:none}
.panel.show{display:block}
.panel h3{margin:2px 0 10px;font-size:14px;color:var(--y);letter-spacing:.06em}
.panel .row{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;cursor:pointer;font-size:14px}
.panel .row:hover{background:var(--ink2)}
.panel .row.cur{background:#2a2410;outline:1px solid var(--y)}
.panel .row .id{font:700 12px ui-monospace,monospace;color:var(--y);width:34px}
.panel .row .d{margin-left:auto;color:var(--mute);font:600 12px ui-monospace,monospace}
.panel label{display:block;font-size:13px;color:var(--mute);margin:12px 2px 6px}
.panel input[type=range]{width:100%;accent-color:var(--y)}
.seg{display:flex;gap:6px}.seg button{all:unset;cursor:pointer;flex:1;text-align:center;padding:8px;border-radius:9px;border:1px solid var(--line);font-size:13px;font-weight:700}
.seg button.on{background:var(--y);color:var(--ink);border-color:var(--y)}
.bar{position:absolute;left:16px;right:100px;bottom:14px;display:none;align-items:center;gap:10px;pointer-events:auto}
.bar.show{display:flex}
.bar .pp{all:unset;cursor:pointer;width:40px;height:40px;border-radius:50%;background:var(--y);color:var(--ink);display:grid;place-items:center;flex:none}
.bar .pp svg{width:18px;height:18px;fill:currentColor}
.track{position:relative;flex:1;height:40px;background:rgba(17,20,24,.85);border:1px solid var(--line);border-radius:10px;overflow:hidden;cursor:pointer}
.track .s{position:absolute;top:0;bottom:0;border-right:1px solid var(--line);font:700 10px ui-monospace,monospace;color:var(--mute);padding:4px 5px;white-space:nowrap;overflow:hidden}
.track .s.cur{background:rgba(255,196,0,.14);color:var(--y)}
.track .ph{position:absolute;top:0;bottom:0;width:2px;background:var(--r)}
.bar .tc{font:700 13px ui-monospace,monospace;color:var(--paper);background:rgba(17,20,24,.85);padding:10px;border-radius:10px;flex:none}
.toast{position:absolute;left:50%;top:18px;transform:translateX(-50%);background:var(--ink);border:1px solid var(--y);padding:8px 14px;border-radius:10px;font-size:13px;opacity:0;transition:opacity .3s}
.toast.show{opacity:1}
.help{font-size:12px;color:var(--mute);line-height:1.6;margin-top:8px}
@media (max-width:720px){.dock{top:auto;bottom:70px;transform:none;right:10px}.dock button{width:52px;font-size:11px}.panel{right:74px;top:auto;bottom:70px;transform:none}.bar{right:74px;left:10px}.hud .m{display:none}}
`;

const ICON = {
  explore: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
  film: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M3 15h18M8 5v4M16 5v4M8 15v4M16 15v4"/></svg>',
  shots: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  views: '<svg viewBox="0 0 24 24"><path d="M3 18l6-6 4 4 8-8"/><path d="M15 8h6v6"/></svg>',
  set: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
};

export function buildUI(o: UIOpts) {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const root = document.createElement('div'); root.className = 'ui';
  root.innerHTML = `
    <div class="hud"><div class="t">定格 · <b>工地沙盒</b></div><div class="m" id="hm">—</div></div>
    <div class="toast" id="toast"></div>
    <nav class="dock">
      <button data-m="explore" class="on">${ICON.explore}漫游</button>
      <button data-m="film">${ICON.film}影片</button>
      <hr>
      <button data-p="shots">${ICON.shots}镜头</button>
      <button data-p="views">${ICON.views}机位</button>
      <button data-p="set">${ICON.set}设置</button>
    </nav>
    <div class="panel" id="p-shots"><h3>分镜 · ${o.shots.length} 个镜头</h3>${o.shots.map((s, i) => `<div class="row" data-i="${i}"><span class="id">${s.id}</span><span>${s.title}</span><span class="d">${s.dur.toFixed(1)}s</span></div>`).join('')}</div>
    <div class="panel" id="p-views"><h3>机位预设</h3>${o.presets.map(p => `<div class="row" data-v="${p}">${p}</div>`).join('')}<div class="help">左键旋转 · 右键平移 · 滚轮推拉</div></div>
    <div class="panel" id="p-set"><h3>设置</h3>
      <label>漫游时的表演</label><div class="seg" id="take"><button data-t="good" class="on">正确做法</button><button data-t="bad">事故版</button></div>
      <label>画质</label><div class="seg" id="q"><button data-q="low">流畅</button><button data-q="high">高</button><button data-q="film">成片</button></div>
      <label>太阳高度 <span id="se">38°</span></label><input type="range" id="elev" min="8" max="75" value="38">
      <label>太阳方位 <span id="sa">128°</span></label><input type="range" id="az" min="60" max="300" value="128">
      <div class="help">上午 9:40 前后：高度 35–40°，方位 东南（120–135°）。</div>
    </div>
    <div class="bar" id="bar"><button class="pp" id="pp"></button><div class="track" id="track">${o.shots.map((s, i) => `<div class="s" data-i="${i}" style="left:${s.start / o.total * 100}%;width:${s.dur / o.total * 100}%">${s.id}</div>`).join('')}<div class="ph" id="ph"></div></div><div class="tc" id="tc">00:00</div></div>`;
  document.body.appendChild(root);
  const $ = (s: string) => root.querySelector(s) as HTMLElement;
  const $$ = (s: string) => [...root.querySelectorAll(s)] as HTMLElement[];
  const PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>', PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  let playing = true;
  const setPlaying = (p: boolean) => { playing = p; $('#pp').innerHTML = p ? PAUSE : PLAY; };
  setPlaying(true);
  const setMode = (m: 'explore' | 'film') => {
    $$('.dock [data-m]').forEach(b => b.classList.toggle('on', b.dataset.m === m));
    $('#bar').classList.toggle('show', m === 'film');
    o.onMode(m);
  };
  $$('.dock [data-m]').forEach(b => b.onclick = () => setMode(b.dataset.m as 'explore' | 'film'));
  $$('.dock [data-p]').forEach(b => b.onclick = () => {
    const id = 'p-' + b.dataset.p, show = !$('#' + id).classList.contains('show');
    $$('.panel').forEach(p => p.classList.remove('show')); $$('.dock [data-p]').forEach(x => x.classList.remove('on'));
    if (show) { $('#' + id).classList.add('show'); b.classList.add('on'); }
  });
  $$('#p-shots .row').forEach(r => r.onclick = () => o.onSeek(o.shots[+r.dataset.i!].start + 0.001));
  $$('#p-views .row').forEach(r => r.onclick = () => o.onPreset(r.dataset.v!));
  $$('#take button').forEach(b => b.onclick = () => { $$('#take button').forEach(x => x.classList.toggle('on', x === b)); o.onTake(b.dataset.t as 'good' | 'bad'); });
  $$('#q button').forEach(b => { b.classList.toggle('on', b.dataset.q === o.quality); b.onclick = () => o.onQuality(b.dataset.q as Quality); });
  const sun = () => { const e = +($('#elev') as HTMLInputElement).value, a = +($('#az') as HTMLInputElement).value; $('#se').textContent = e + '°'; $('#sa').textContent = a + '°'; o.onSun(e, a); };
  ($('#elev') as HTMLInputElement).onchange = sun; ($('#az') as HTMLInputElement).onchange = sun;
  $('#pp').onclick = () => { setPlaying(!playing); o.onPlay(playing); };
  $('#track').onclick = e => { const r = $('#track').getBoundingClientRect(); o.onSeek((e.clientX - r.left) / r.width * o.total); };
  let tt = 0;
  return {
    setMode, setPlaying,
    toast(msg: string) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = window.setTimeout(() => t.classList.remove('show'), 1800); },
    fps(v: number, s: { drawables: number; triangles: number }) { $('#hm').textContent = `${v.toFixed(0)} fps · ${s.drawables} meshes · ${(s.triangles / 1e6).toFixed(2)}M tris`; },
    clock(t: number) { void t; },
    progress(t: number, shot: number) {
      $('#ph').style.left = (t / o.total * 100) + '%';
      $('#tc').textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(1).padStart(4, '0')}`;
      $$('#track .s').forEach((s, i) => s.classList.toggle('cur', i === shot));
      $$('#p-shots .row').forEach((s, i) => s.classList.toggle('cur', i === shot));
    },
  };
}
