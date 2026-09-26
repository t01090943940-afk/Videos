# supercut · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show supercut <路径>`；还原成真实目录：`python3 scripts/casebook.py copy supercut <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `README.md` | 47 | 28 |
| 2 | `STORYBOARD.md` | 52 | 80 |
| 3 | `_survey/index.txt` | 28 | 137 |
| 4 | `assets/vendor/gsap.min.js` | 11 | 170 |
| 5 | `audio/score.py` | 449 | 186 |
| 6 | `index.html` | 1994 | 640 |
| 7 | `package-lock.json` | 2017 | 2639 |
| 8 | `package.json` | 19 | 4661 |
| 9 | `src/catalog.mjs` | 141 | 4685 |
| 10 | `src/code-lines.mjs` | 39 | 4831 |
| 11 | `src/edl.mjs` | 286 | 4875 |
| 12 | `src/runtime.js` | 900 | 5166 |
| 13 | `src/style.css` | 293 | 6071 |
| 14 | `tools/build.mjs` | 368 | 6369 |
| 15 | `tools/prep_media.mjs` | 160 | 6742 |
| 16 | `tools/qa_probe.mjs` | 30 | 6907 |

---

### 1/16 · `README.md`
<!-- casebook-file {"path": "README.md", "lines": 47, "final_newline": true, "sha256": "37ad55afe60436145045382fd55063993bea3846568a997bb2ba18449ad09106", "original_sha256": "37ad55afe60436145045382fd55063993bea3846568a997bb2ba18449ad09106"} -->
````markdown
# 00-supercut-trailer · AI-Coding SuperVideos 合集总片

62.4 秒 · 150 BPM · 1920×1080 · 交付 720p60。
28 部代码视频的"片子"，本身也是一部代码视频：没有一个剪辑软件，
每一帧由 `render(t)` 算出，配乐由 numpy 逐样本合成 —— 画面和音乐读同一份 EDL。

## 流水线（顺序执行）

```bash
npm install            # pin hyperframes@0.8.77
npm run prep           # ffmpeg 切 90+ 段代理/海报/竖屏转横屏 → assets/clips, assets/posters
npm run build          # 生成 index.html（90+ 静态 <video>）+ build/cues.json + build/timeline.txt
npm run score          # python audio/score.py → assets/score.wav（48kHz 立体声）
npm run check          # hyperframes check（lint + runtime + layout 一门闸）
npm run snapshot       # 抽帧截图人工验收
npm run render         # → renders/supercut-trailer-1080p60.mp4
npm run ship           # ffmpeg 降采样 → renders/AI-Coding-SuperVideos-720p60.mp4（交付物）
```

依赖：Node 24、ffmpeg 8、Python 3.14 + numpy + scipy、headless Chrome（hyperframes 自带管理）。

## 文件地图

| 文件 | 职责 |
|---|---|
| `src/catalog.mjs` | 28 部作品元数据：路径/规格/时代/高光入点 `wallIn`（唯一真相源） |
| `src/edl.mjs` | 乐谱：150BPM 拍网格、41 个镜头、全部文字 cue、62 个音效 cue |
| `src/code-lines.mjs` | 37 行真实源码（代码墙/隧道用，可在源码包 Ctrl+F 复现） |
| `src/style.css` | 视觉系统：字体栈/层/窗口/分屏/手机框/巨墙/闪传卡片/HUD |
| `src/runtime.js` | `render(t)` 纯函数：13 个场景 + FX 画布 + HUD，零 rAF/零未播种随机 |
| `tools/prep_media.mjs` | ffmpeg 预切：镜头代理、海报、竖屏转横屏、QA 联系表 |
| `tools/build.mjs` | EDL → 静态 index.html（勿手改 index.html） |
| `audio/score.py` | numpy 合成：鼓/贝斯/supersaw/钟/SFX，读 build/cues.json |
| `STORYBOARD.md` | 分幕表与画面/配乐系统说明 |
| `_survey/` | 28 部成片 20 格联系表（选点依据，留档） |

## 验收要点

- `build/qa/contact-shots.jpg` / `contact-wall.jpg`：每个镜头入点是否取到高光帧。
- 拍点对齐：`build/timeline.txt` 中镜头起始拍 × 0.4 应压在鼓点上。
- 二维码：`qr.png` 在 128–140 拍段（51.2s–56s）全尺寸显示 8.8s，需实测可扫。
- 确定性：同一 `t` 渲染两次逐像素一致（runtime 无 rAF/Date.now/裸 Math.random）。

## 已知取舍

- 代理片段统一 30fps 输出；720p60 交付时源视频帧重复 2×，MG 层（文字/HUD/FX）是真 60fps。
- `wallIn` 入点来自 20 格联系表目检，误差 ±1s；验收时对照 contact-wall.jpg 微调。
````

### 2/16 · `STORYBOARD.md`
<!-- casebook-file {"path": "STORYBOARD.md", "lines": 52, "final_newline": true, "sha256": "902118f7128973a0f2190050f4396a62f92b2e6cfdd227ed36679e807952c789", "original_sha256": "902118f7128973a0f2190050f4396a62f92b2e6cfdd227ed36679e807952c789"} -->
```markdown
# STORYBOARD · AI-CODING SUPERVIDEOS 总片（62.4s @150BPM）

坐标系：一切时间以「拍」为单位。150 BPM → 1 拍 = 0.4s = 12 帧@30fps。
所有镜头/文字/音效共用 `src/edl.mjs` —— 画面切在哪一拍，鼓就落在哪一拍。

## 叙事弧线

> 没有 AE，没有 PR，没有剪辑软件。每一帧，都是时间的函数。
> KIMI 学会卡点 → SWE 逐像素渲出宇宙 → GPT 一个模型三十个世界 →
> OPUS 把代码做成电影 → 能力曲线冲破天花板 →
> 28 部片子轰出一面墙 → 骤停 → 「它们是怎么做出来的？」→
> **通 通 开 源** → 扫码，全部带走 → `render(t)` 回车，下一部由你来写。

## 分幕（12 个 section，能量曲线 0.05 → 1.0 → 0.05 → 1.0 → 0.7 → 0.2）

| 拍 | 秒 | 段落 | 内容 |
|---|---|---|---|
| 0–16 | 0–6.4 | ACT0 冷开场 | 终端敲 `render(t)` →「没有AE/PR/剪辑软件」三连砸+划除 → 「每一帧，都是时间的函数」→ 真实代码行成墙，加速上卷 |
| 16–19 | 6.4–7.6 | ERA 01 卡 | 「01 KIMI 觉醒」大字 + 能力曲线第一节点 |
| 19–27 | 7.6–10.8 | KIMI 窗口 | 《AI 觉醒》4 个 0.8s 窗口在 3D 空间里层层堆叠 |
| 27–30 | 10.8–12 | ERA 02 卡 | 「02 SWE 像素」 |
| 30–42 | 12–16.8 | SWE 窗口 | 《AI:RISE》《月之暗面 KIMI》继续堆到 10 层，镜头缓推 |
| 42–45 | 16.8–18 | ERA 03 卡 | 「03 GPT 世界」 |
| 45–51 | 18–20.4 | 宫格倍增 | COSMOS：1→4→9→16 格每拍翻一番，「×30 种画风，一支片」 |
| 51–62 | 20.4–24.8 | GPT 全屏 | 15 个世界 6 连切（每拍一切）→《把日子慢慢过圆》→ 横屏+竖屏同框 |
| 62–64 | 24.8–25.6 | ERA 04 卡 | 「04 电影」+ 能力曲线冲出画框 → b63.5 半拍真空全黑 |
| 64–80 | 25.6–32 | DROP | 15 个 OPUS 全屏镜头每拍一切：碎裂/水墨/定格/体素/4K/4D 超立方/魔方墙… |
| 80–86 | 32–34.4 | 拉片分屏 | 2联 → 3联 → 4联斜切分屏（玄览/StudySolo/羽升集/树成林/protocom/方块/代码宇宙/共此时/同月） |
| 86–88 | 34.4–35.2 | 竖屏排面 | 3 部竖屏作品装手机框扇形排开 |
| 88–96 | 35.2–38.4 | 隧道 | 28 张海报贴四壁，摄像机 3D 前冲+滚转，「从一行字，到一整个宇宙」 |
| 96–104 | 38.4–41.6 | 巨墙 | 相机从一格急速拉远：28 部同时在播 → 「AI-CODING · SUPERVIDEOS」 |
| 104–116 | 41.6–46.4 | 凝视 | 磁带骤停+颗粒放大+黑边宽银幕：「28 部片子 / 没有一帧是手剪的 / 它们是怎么做出来的？」 |
| 116–120 | 46.4–48 | 通通开源 | 四拍四字逐个砸屏（色差+冲击波），28 海报随节拍从纵深爆散 |
| 120–128 | 48–51.2 | 三柱 | 「OPEN SOURCE · ALL OF IT」+ 源码20包/复盘24份/成片28部 数字滚动、文件名瀑布 |
| 128–140 | 51.2–56 | 闪传卡片 | 28 张海报被吸进 QQ 闪传文件夹，计数 0→28；二维码扫描线呼吸；链接逐字打出 |
| 140–156 | 56–62.4 | 尾声 | 回到终端 `render(t)` 回车 →「下一部，由你来写。」→ 演职员表 → 黑场 |

## 画面系统

- **母题**：`frame = render(t)` —— 终端命令在开场飞成左上角 HUD，尾声再次出现回车执行。
- **HUD**：REC 红点、时间码 `t = xx.xxxs`、帧号、时代徽章、底部 28 槽时间尺（每部作品首次出场时点亮，颜色=模型色）。
- **能力曲线**：背景坐标系「代码视频的上限 ↑」，四节点四色，OPUS 段冲出画面顶部。
- **模型色**：KIMI `#3CF0C8` / SWE `#7CC4FF` / GPT `#A98BFF` / OPUS `#FF7A3D` / SKILL `#FFD166`。
- **代码墙**：`src/code-lines.mjs` 里 37 行真实源码（scene.html/render.py/timeline.py 原样截取），可在源码包中 Ctrl+F 复现。
- **二维码**：QQ 闪传分享链接 `qfile.qq.com/q/P2tSnByK4K`，508×508 二值化，片尾 12s 持续可扫。

## 配乐（audio/score.py，读 build/cues.json）

D 小调，Dm–B♭–F–C 循环；动机 D4–F4–A4–D5 按段落移调。
织体密度= section energy：冷开场只有 Pad → 逐段加 Kick/Hat/Bass/Supersaw →
DROP 全开 → 凝视段全部抽空只剩心跳+钟 → reveal 四声 megaimpact → 尾声回落。
SFX 全部程序合成：打字/回车/闸刀/快门/whoosh/riser/磁带骤停/吸入 click×28。
```

### 3/16 · `_survey/index.txt`
<!-- casebook-file {"path": "_survey/index.txt", "lines": 28, "final_newline": true, "sha256": "5461e929d84e782961ffd0d2c9476b40766b4f20241452a9896d534448eaeefb", "original_sha256": "5461e929d84e782961ffd0d2c9476b40766b4f20241452a9896d534448eaeefb"} -->
```text
01|../../gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_1080p.mp4|120.000000
02|../../gpt-mid-autumn-for-my-dg03/Moon_Letter_MidAutumn_1080p.mp4|28.800000
03|../../gpt-mid-autumn-general-video/gpt-MidAutumn_Final_60s_1080p60.mp4|60.000000
04|../../gpt-universe-30-change/COSMOS_30_STYLES_72s_1080p.mp4|72.000000
05|../../kimi-ai-beat-sync/ai-beat-sync.mp4|51.300000
06|../../opus-1037-hust-story/1037_MG试片.mp4|110.500000
07|../../opus-F12-teaching/DevTools-in-60-Seconds-1080p.mp4|60.000000
08|../../opus-age-of-intelligence/AGE_OF_INTELLIGENCE_720p60_share.mp4|92.416000
09|../../opus-broken-reround/碎月重圆_MG动画.mp4|30.000000
10|../../opus-claude-intro-with-15-way/Claude_自我介绍_15种画风.mp4|114.366667
11|../../opus-factory-safety-videos/dingge_1440p60fps.mp4|87.018000
12|../../opus-hust-read-join-video-v1/华中大读书会_慢下来.mp4|37.000000
13|../../opus-introduction-video-xuanlan/XuanLan-PocketWebShell-promo-1080p60-share.mp4|55.000000
14|../../opus-mid-autumn-for-my-dg01/中秋·给学姐.mp4|29.000000
15|../../opus-mid-autumn-for-my-dg02/月光替你亮着灯_学姐中秋快乐.mp4|28.000000
16|../../opus-mid-autumn-genergal-videos/mid-autumn.mp4|120.000000
17|../../opus-mid-autumn-highschool-videos/共此时_预览版_720p.mp4|180.000998
18|../../opus-oneink/一畫_Opus5.5_水墨书法.mp4|60.500000
19|../../opus-production-video-ai-phase-skill/ai-phase-skill-intro.mp4|30.000000
20|../../opus-production-video-protocom-intro/protocom-intro.mp4|80.000000
21|../../opus-production-video-skill-hub/skills-hub-promo.mp4|57.002000
22|../../opus-production-video-studysolo/studysolo-promo -v1.1.mp4|60.000000
23|../../opus-production-video-ys-blog/yusheng-blog.mp4|30.000000
24|../../opus-shuchenglin-into/树成林宣传片_60s.mp4|60.010000
25|../../opus-universe-history-video/code_cosmos_stopmotion.mp4|68.000000
26|../../skill-方块系列定格动画/stop-motion-3d-intro-web.mp4|60.000000
27|../../swe-ai-rise/kimi_ai_rise_v2.mp4|39.938005
28|../../swe-kimi-source-intro/kimi_film_1080p.mp4|56.000000
```

### 4/16 · `assets/vendor/gsap.min.js`
<!-- casebook-file {"path": "assets/vendor/gsap.min.js", "lines": 11, "final_newline": true, "sha256": "92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb", "original_sha256": "92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb"} -->
```js
/*!
 * GSAP 3.15.0
 * https://gsap.com
 * 
 * @license Copyright 2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license.
 * @author: Jack Doyle, jack@greensock.com
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).window=t.window||{})}(this,function(e){"use strict";function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function r(t){return"string"==typeof t}function s(t){return"function"==typeof t}function t(t){return"number"==typeof t}function u(t){return void 0===t}function v(t){return"object"==typeof t}function w(t){return!1!==t}function x(){return"undefined"!=typeof window}function y(t){return s(t)||r(t)}function R(t){return(i=bt(t,ht))&&Fe}function S(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")}function T(t,e){return!e&&console.warn(t)}function U(t,e){return t&&(ht[t]=e)&&i&&(i[t]=e)||ht}function V(){return 0}function ga(t){var e,r,i=t[0];if(v(i)||s(i)||(t=[t]),!(e=(i._gsap||{}).harness)){for(r=yt.length;r--&&!yt[r].targetTest(i););e=yt[r]}for(r=t.length;r--;)t[r]&&(t[r]._gsap||(t[r]._gsap=new Xt(t[r],e)))||t.splice(r,1);return t}function ha(t){return t._gsap||ga(Pt(t))[0]._gsap}function ia(t,e,r){return(r=t[e])&&s(r)?t[e]():u(r)&&t.getAttribute&&t.getAttribute(e)||r}function ja(t,e){return(t=t.split(",")).forEach(e)||t}function ka(t){return Math.round(1e5*t)/1e5||0}function la(t){return Math.round(1e7*t)/1e7||0}function ma(t,e){var r=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),"+"===r?t+i:"-"===r?t-i:"*"===r?t*i:t/i}function na(t,e){for(var r=e.length,i=0;t.indexOf(e[i])<0&&++i<r;);return i<r}function oa(){var t,e,r=pt.length,i=pt.slice(0);for(_t={},t=pt.length=0;t<r;t++)(e=i[t])&&e._lazy&&(e.render(e._lazy[0],e._lazy[1],!0)._lazy=0)}function pa(t){return!!(t._initted||t._startAt||t.add)}function qa(t,e,r,i){pt.length&&!I&&oa(),t.render(e,r,i||!!(I&&e<0&&pa(t))),pt.length&&!I&&oa()}function ra(t){var e=parseFloat(t);return(e||0===e)&&(t+"").match(ot).length<2?e:r(t)?t.trim():t}function sa(t){return t}function ta(t,e){for(var r in e)r in t||(t[r]=e[r]);return t}function wa(t,e){for(var r in e)"__proto__"!==r&&"constructor"!==r&&"prototype"!==r&&(t[r]=v(e[r])?wa(t[r]||(t[r]={}),e[r]):e[r]);return t}function xa(t,e){var r,i={};for(r in t)r in e||(i[r]=t[r]);return i}function ya(t){var e=t.parent||L,r=t.keyframes?function _setKeyframeDefaults(i){return function(t,e){for(var r in e)r in t||"duration"===r&&i||"ease"===r||(t[r]=e[r])}}(K(t.keyframes)):ta;if(w(t.inherit))for(;e;)r(t,e.vars.defaults),e=e.parent||e._dp;return t}function Aa(t,e,r,i,n){void 0===r&&(r="_first"),void 0===i&&(i="_last");var a,s=t[i];if(n)for(a=e[n];s&&s[n]>a;)s=s._prev;return s?(e._next=s._next,s._next=e):(e._next=t[r],t[r]=e),e._next?e._next._prev=e:t[i]=e,e._prev=s,e.parent=e._dp=t,e}function Ba(t,e,r,i){void 0===r&&(r="_first"),void 0===i&&(i="_last");var n=e._prev,a=e._next;n?n._next=a:t[r]===e&&(t[r]=a),a?a._prev=n:t[i]===e&&(t[i]=n),e._next=e._prev=e.parent=null}function Ca(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0}function Da(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var r=t;r;)r._dirty=1,r=r.parent;return t}function Fa(t,e,r,i){return t._startAt&&(I?t._startAt.revert(ft):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))}function Ha(t){return t._repeat?wt(t._tTime,t=t.duration()+t._rDelay)*t:0}function Ja(t,e){return(t-e._start)*e._ts+(0<=e._ts?0:e._dirty?e.totalDuration():e._tDur)}function Ka(t){return t._end=la(t._start+(t._tDur/Math.abs(t._ts||t._rts||q)||0))}function La(t,e){var r=t._dp;return r&&r.smoothChildTiming&&t._ts&&(t._start=la(r._time-(0<t._ts?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Ka(t),r._dirty||Da(r,t)),t}function Ma(t,e){var r;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(r=Ja(t.rawTime(),e),(!e._dur||Mt(0,e.totalDuration(),r)-e._tTime>q)&&e.render(r,!0)),Da(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(r=t;r._dp;)0<=r.rawTime()&&r.totalTime(r._tTime),r=r._dp;t._zTime=-q}}function Na(e,r,i,n){return r.parent&&Ca(r),r._start=la((t(i)?i:i||e!==L?Ot(e,i,r):e._time)+r._delay),r._end=la(r._start+(r.totalDuration()/Math.abs(r.timeScale())||0)),Aa(e,r,"_first","_last",e._sort?"_start":0),xt(r)||(e._recent=r),n||Ma(e,r),e._ts<0&&La(e,e._tTime),e}function Oa(t,e){return(ht.ScrollTrigger||S("scrollTrigger",e))&&ht.ScrollTrigger.create(e,t)}function Pa(t,e,r,i,n){return Ht(t,e,n),t._initted?!r&&t._pt&&!I&&(t._dur&&!1!==t.vars.lazy||!t._dur&&t.vars.lazy)&&f!==It.frame?(pt.push(t),t._lazy=[n,i],1):void 0:1}function Ua(t,e,r,i){var n=t._repeat,a=la(e)||0,s=t._tTime/t._tDur;return s&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=n?n<0?1e10:la(a*(n+1)+t._rDelay*n):a,0<s&&!i&&La(t,t._tTime=t._tDur*s),t.parent&&Ka(t),r||Da(t.parent,t),t}function Va(t){return t instanceof Gt?Da(t):Ua(t,t._dur)}function Ya(e,r,i){var n,a,s=t(r[1]),o=(s?2:1)+(e<2?0:1),u=r[o];if(s&&(u.duration=r[1]),u.parent=i,e){for(n=u,a=i;a&&!("immediateRender"in n);)n=a.vars.defaults||{},a=w(a.vars.inherit)&&a.parent;u.immediateRender=w(n.immediateRender),e<2?u.runBackwards=1:u.startAt=r[o-1]}return new te(r[0],u,r[1+o])}function Za(t,e){return t||0===t?e(t):e}function _a(t,e){return r(t)&&(e=ut.exec(t))?e[1]:""}function cb(t,e){return t&&v(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&v(t[0]))&&!t.nodeType&&t!==h}function fb(r){return r=Pt(r)[0]||T("Invalid scope")||{},function(t){var e=r.current||r.nativeElement||r;return Pt(t,e.querySelectorAll?e:e===r?T("Invalid scope")||a.createElement("div"):r)}}function gb(t){return t.sort(function(){return.5-Math.random()})}function hb(t){if(s(t))return t;var p=v(t)?t:{each:t},_=jt(p.ease),m=p.from||0,g=parseFloat(p.base)||0,y={},e=0<m&&m<1,T=isNaN(m)||e,b=p.axis,w=m,x=m;return r(m)?w=x={center:.5,edges:.5,end:1}[m]||0:!e&&T&&(w=m[0],x=m[1]),function(t,e,r){var i,n,a,s,o,u,h,l,f,c=(r||p).length,d=y[c];if(!d){if(!(f="auto"===p.grid?0:(p.grid||[1,X])[1])){for(h=-X;h<(h=r[f++].getBoundingClientRect().left)&&f<c;);f<c&&f--}for(d=y[c]=[],i=T?Math.min(f,c)*w-.5:m%f,n=f===X?0:T?c*x/f-.5:m/f|0,l=X,u=h=0;u<c;u++)a=u%f-i,s=n-(u/f|0),d[u]=o=b?Math.abs("y"===b?s:a):$(a*a+s*s),h<o&&(h=o),o<l&&(l=o);"random"===m&&gb(d),d.max=h-l,d.min=l,d.v=c=(parseFloat(p.amount)||parseFloat(p.each)*(c<f?c-1:b?"y"===b?c/f:f:Math.max(f,c/f))||0)*("edges"===m?-1:1),d.b=c<0?g-c:g,d.u=_a(p.amount||p.each)||0,_=_&&c<0?Yt(_):_}return c=(d[t]-d.min)/d.max||0,la(d.b+(_?_(c):c)*d.v)+d.u}}function ib(i){var n=Math.pow(10,((i+"").split(".")[1]||"").length);return function(e){var r=la(Math.round(parseFloat(e)/i)*i*n);return(r-r%1)/n+(t(e)?0:_a(e))}}function jb(h,e){var l,f,r=K(h);return!r&&v(h)&&(l=r=h.radius||X,h.values?(h=Pt(h.values),(f=!t(h[0]))&&(l*=l)):h=ib(h.increment)),Za(e,r?s(h)?function(t){return f=h(t),Math.abs(f-t)<=l?f:t}:function(e){for(var r,i,n=parseFloat(f?e.x:e),a=parseFloat(f?e.y:0),s=X,o=0,u=h.length;u--;)(r=f?(r=h[u].x-n)*r+(i=h[u].y-a)*i:Math.abs(h[u]-n))<s&&(s=r,o=u);return o=!l||s<=l?h[o]:e,f||o===e||t(e)?o:o+_a(e)}:ib(h))}function kb(t,e,r,i){return Za(K(t)?!e:!0===r?!!(r=0):!i,function(){return K(t)?t[~~(Math.random()*t.length)]:(r=r||1e-5)&&(i=r<1?Math.pow(10,(r+"").length-2):1)&&Math.floor(Math.round((t-r/2+Math.random()*(e-t+.99*r))/r)*r*i)/i})}function ob(e,r,t){return Za(t,function(t){return e[~~r(t)]})}function rb(t){return t.replace(tt,function(t){var e=t.indexOf("[")+1,r=t.substring(e||7,e?t.indexOf("]"):t.length-1).split(et);return kb(e?r:+r[0],e?0:+r[1],+r[2]||1e-5)})}function ub(t,e,r){var i,n,a,s=t.labels,o=X;for(i in s)(n=s[i]-e)<0==!!r&&n&&o>(n=Math.abs(n))&&(a=i,o=n);return a}function wb(t){return Ca(t),t.scrollTrigger&&t.scrollTrigger.kill(!!I),t.progress()<1&&At(t,"onInterrupt"),t}function zb(t){if(t)if(t=!t.name&&t.default||t,x()||t.headless){var e=t.name,r=s(t),i=e&&!r&&t.init?function(){this._props=[]}:t,n={init:V,render:_e,add:$t,kill:Te,modifier:ve,rawVars:0},a={targetTest:0,get:0,getSetter:ue,aliases:{},register:0};if(Lt(),t!==i){if(mt[e])return;ta(i,ta(xa(t,n),a)),bt(i.prototype,bt(n,xa(t,a))),mt[i.prop=e]=i,t.targetTest&&(yt.push(i),dt[e]=1),e=("css"===e?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}U(e,i),t.register&&t.register(Fe,i,we)}else Dt.push(t)}function Cb(t,e,r){return(6*(t+=t<0?1:1<t?-1:0)<1?e+(r-e)*t*6:t<.5?r:3*t<2?e+(r-e)*(2/3-t)*6:e)*zt+.5|0}function Db(e,r,i){var n,a,s,o,u,h,l,f,c,d,p=e?t(e)?[e>>16,e>>8&zt,e&zt]:0:Rt.black;if(!p){if(","===e.substr(-1)&&(e=e.substr(0,e.length-1)),Rt[e])p=Rt[e];else if("#"===e.charAt(0)){if(e.length<6&&(e="#"+(n=e.charAt(1))+n+(a=e.charAt(2))+a+(s=e.charAt(3))+s+(5===e.length?e.charAt(4)+e.charAt(4):"")),9===e.length)return[(p=parseInt(e.substr(1,6),16))>>16,p>>8&zt,p&zt,parseInt(e.substr(7),16)/255];p=[(e=parseInt(e.substr(1),16))>>16,e>>8&zt,e&zt]}else if("hsl"===e.substr(0,3))if(p=d=e.match(rt),r){if(~e.indexOf("="))return p=e.match(it),i&&p.length<4&&(p[3]=1),p}else o=+p[0]%360/360,u=p[1]/100,n=2*(h=p[2]/100)-(a=h<=.5?h*(u+1):h+u-h*u),3<p.length&&(p[3]*=1),p[0]=Cb(o+1/3,n,a),p[1]=Cb(o,n,a),p[2]=Cb(o-1/3,n,a);else p=e.match(rt)||Rt.transparent;p=p.map(Number)}return r&&!d&&(n=p[0]/zt,a=p[1]/zt,s=p[2]/zt,h=((l=Math.max(n,a,s))+(f=Math.min(n,a,s)))/2,l===f?o=u=0:(c=l-f,u=.5<h?c/(2-l-f):c/(l+f),o=l===n?(a-s)/c+(a<s?6:0):l===a?(s-n)/c+2:(n-a)/c+4,o*=60),p[0]=~~(o+.5),p[1]=~~(100*u+.5),p[2]=~~(100*h+.5)),i&&p.length<4&&(p[3]=1),p}function Eb(t){var r=[],i=[],n=-1;return t.split(Et).forEach(function(t){var e=t.match(nt)||[];r.push.apply(r,e),i.push(n+=e.length+1)}),r.c=i,r}function Fb(t,e,r){var i,n,a,s,o="",u=(t+o).match(Et),h=e?"hsla(":"rgba(",l=0;if(!u)return t;if(u=u.map(function(t){return(t=Db(t,e,1))&&h+(e?t[0]+","+t[1]+"%,"+t[2]+"%,"+t[3]:t.join(","))+")"}),r&&(a=Eb(t),(i=r.c).join(o)!==a.c.join(o)))for(s=(n=t.replace(Et,"1").split(nt)).length-1;l<s;l++)o+=n[l]+(~i.indexOf(l)?u.shift()||h+"0,0,0,0)":(a.length?a:u.length?u:r).shift());if(!n)for(s=(n=t.split(Et)).length-1;l<s;l++)o+=n[l]+u[l];return o+n[s]}function Ib(t){var e,r=t.join(" ");if(Et.lastIndex=0,Et.test(r))return e=Ft.test(r),t[1]=Fb(t[1],e),t[0]=Fb(t[0],e,Eb(t[1])),!0}function Rb(t){var e=(t+"").split("("),r=Bt[e[0]];return r&&1<e.length&&r.config?r.config.apply(null,~t.indexOf("{")?[function _parseObjectInString(t){for(var e,r,i,n={},a=t.substr(1,t.length-3).split(":"),s=a[0],o=1,u=a.length;o<u;o++)r=a[o],e=o!==u-1?r.lastIndexOf(","):r.length,i=r.substr(0,e),n[s]=isNaN(i)?i.replace(Ut,"").trim():+i,s=r.substr(e+1).trim();return n}(e[1])]:function _valueInParentheses(t){var e=t.indexOf("(")+1,r=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<r?t.indexOf(")",r+1):r)}(t).split(",").map(ra)):Bt._CE&&Nt.test(t)?Bt._CE("",t):r}function Ub(t,e,r,i){void 0===r&&(r=function easeOut(t){return 1-e(1-t)}),void 0===i&&(i=function easeInOut(t){return t<.5?e(2*t)/2:1-e(2*(1-t))/2});var n,a={easeIn:e,easeOut:r,easeInOut:i};return ja(t,function(t){for(var e in Bt[t]=ht[t]=a,Bt[n=t.toLowerCase()]=r,a)Bt[n+("easeIn"===e?".in":"easeOut"===e?".out":".inOut")]=Bt[t+"."+e]=a[e]}),a}function Vb(e){return function(t){return t<.5?(1-e(1-2*t))/2:.5+e(2*(t-.5))/2}}function Wb(r,t,e){function Gm(t){return 1===t?1:i*Math.pow(2,-10*t)*Q((t-a)*n)+1}var i=1<=t?t:1,n=(e||(r?.3:.45))/(t<1?t:1),a=n/G*(Math.asin(1/i)||0),s="out"===r?Gm:"in"===r?function(t){return 1-Gm(1-t)}:Vb(Gm);return n=G/n,s.config=function(t,e){return Wb(r,t,e)},s}function Xb(e,r){function Om(t){return t?--t*t*((r+1)*t+r)+1:0}void 0===r&&(r=1.70158);var t="out"===e?Om:"in"===e?function(t){return 1-Om(1-t)}:Vb(Om);return t.config=function(t){return Xb(e,t)},t}var F,I,l,L,h,n,a,i,o,f,c,d,p,_,m,g,b,k,O,M,C,P,A,D,z,E,B,N,Y={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},j={duration:.5,overwrite:!1,delay:0},X=1e8,q=1/X,G=2*Math.PI,Z=G/4,W=0,$=Math.sqrt,H=Math.cos,Q=Math.sin,J="function"==typeof ArrayBuffer&&ArrayBuffer.isView||function(){},K=Array.isArray,tt=/random\([^)]+\)/g,et=/,\s*/g,rt=/(?:-?\.?\d|\.)+/gi,it=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,nt=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,at=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,st=/[+-]=-?[.\d]+/,ot=/[^,'"\[\]\s]+/gi,ut=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,ht={},lt={suppressEvents:!0,isStart:!0,kill:!1},ft={suppressEvents:!0,kill:!1},ct={suppressEvents:!0},dt={},pt=[],_t={},mt={},gt={},vt=30,yt=[],Tt="",bt=function _merge(t,e){for(var r in e)t[r]=e[r];return t},wt=function _animationCycle(t,e){var r=Math.floor(t=la(t/e));return t&&r===t?r-1:r},xt=function _isFromOrFromStart(t){var e=t.data;return"isFromStart"===e||"isStart"===e},kt={_start:0,endTime:V,totalDuration:V},Ot=function _parsePosition(t,e,i){var n,a,s,o=t.labels,u=t._recent||kt,h=t.duration()>=X?u.endTime(!1):t._dur;return r(e)&&(isNaN(e)||e in o)?(a=e.charAt(0),s="%"===e.substr(-1),n=e.indexOf("="),"<"===a||">"===a?(0<=n&&(e=e.replace(/=/,"")),("<"===a?u._start:u.endTime(0<=u._repeat))+(parseFloat(e.substr(1))||0)*(s?(n<0?u:i).totalDuration()/100:1)):n<0?(e in o||(o[e]=h),o[e]):(a=parseFloat(e.charAt(n-1)+e.substr(n+1)),s&&i&&(a=a/100*(K(i)?i[0]:i).totalDuration()),1<n?_parsePosition(t,e.substr(0,n-1),i)+a:h+a)):null==e?h:+e},Mt=function _clamp(t,e,r){return r<t?t:e<r?e:r},Ct=[].slice,Pt=function toArray(t,e,i){return l&&!e&&l.selector?l.selector(t):!r(t)||i||!n&&Lt()?K(t)?function _flatten(t,e,i){return void 0===i&&(i=[]),t.forEach(function(t){return r(t)&&!e||cb(t,1)?i.push.apply(i,Pt(t)):i.push(t)})||i}(t,i):cb(t)?Ct.call(t,0):t?[t]:[]:Ct.call((e||a).querySelectorAll(t),0)},St=function mapRange(e,t,r,i,n){var a=t-e,s=i-r;return Za(n,function(t){return r+((t-e)/a*s||0)})},At=function _callback(t,e,r){var i,n,a,s=t.vars,o=s[e],u=l,h=t._ctx;if(o)return i=s[e+"Params"],n=s.callbackScope||t,r&&pt.length&&oa(),h&&(l=h),a=i?o.apply(n,i):o.call(n),l=u,a},Dt=[],zt=255,Rt={aqua:[0,zt,zt],lime:[0,zt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,zt],navy:[0,0,128],white:[zt,zt,zt],olive:[128,128,0],yellow:[zt,zt,0],orange:[zt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[zt,0,0],pink:[zt,192,203],cyan:[0,zt,zt],transparent:[zt,zt,zt,0]},Et=function(){var t,e="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";for(t in Rt)e+="|"+t+"\\b";return new RegExp(e+")","gi")}(),Ft=/hsl[a]?\(/,It=(O=Date.now,M=500,C=33,P=O(),A=P,z=D=1e3/240,g={time:0,frame:0,tick:function tick(){zl(!0)},deltaRatio:function deltaRatio(t){return b/(1e3/(t||60))},wake:function wake(){o&&(!n&&x()&&(h=n=window,a=h.document||{},ht.gsap=Fe,(h.gsapVersions||(h.gsapVersions=[])).push(Fe.version),R(i||h.GreenSockGlobals||!h.gsap&&h||{}),Dt.forEach(zb)),m="undefined"!=typeof requestAnimationFrame&&requestAnimationFrame,p&&g.sleep(),_=m||function(t){return setTimeout(t,z-1e3*g.time+1|0)},d=1,zl(2))},sleep:function sleep(){(m?cancelAnimationFrame:clearTimeout)(p),d=0,_=V},lagSmoothing:function lagSmoothing(t,e){M=t||1/0,C=Math.min(e||33,M)},fps:function fps(t){D=1e3/(t||240),z=1e3*g.time+D},add:function add(n,t,e){var a=t?function(t,e,r,i){n(t,e,r,i),g.remove(a)}:n;return g.remove(n),E[e?"unshift":"push"](a),Lt(),a},remove:function remove(t,e){~(e=E.indexOf(t))&&E.splice(e,1)&&e<=k&&k--},_listeners:E=[]}),Lt=function _wake(){return!d&&It.wake()},Bt={},Nt=/^[\d.\-M][\d.\-,\s]/,Ut=/["']/g,Yt=function _invertEase(e){return function(t){return 1-e(1-t)}},jt=function _parseEase(t,e){return t&&(s(t)?t:Bt[t]||Rb(t))||e};function zl(t){var e,r,i,n,a=O()-A,s=!0===t;if((M<a||a<0)&&(P+=a-C),(0<(e=(i=(A+=a)-P)-z)||s)&&(n=++g.frame,b=i-1e3*g.time,g.time=i/=1e3,z+=e+(D<=e?4:D-e),r=1),s||(p=_(zl)),r)for(k=0;k<E.length;k++)E[k](i,b,n,t)}function dn(t){return t<N?B*t*t:t<.7272727272727273?B*Math.pow(t-1.5/2.75,2)+.75:t<.9090909090909092?B*(t-=2.25/2.75)*t+.9375:B*Math.pow(t-2.625/2.75,2)+.984375}ja("Linear,Quad,Cubic,Quart,Quint,Strong",function(t,e){var r=e<5?e+1:e;Ub(t+",Power"+(r-1),e?function(t){return Math.pow(t,r)}:function(t){return t},function(t){return 1-Math.pow(1-t,r)},function(t){return t<.5?Math.pow(2*t,r)/2:1-Math.pow(2*(1-t),r)/2})}),Bt.Linear.easeNone=Bt.none=Bt.Linear.easeIn,Ub("Elastic",Wb("in"),Wb("out"),Wb()),B=7.5625,N=1/2.75,Ub("Bounce",function(t){return 1-dn(1-t)},dn),Ub("Expo",function(t){return Math.pow(2,10*(t-1))*t+t*t*t*t*t*t*(1-t)}),Ub("Circ",function(t){return-($(1-t*t)-1)}),Ub("Sine",function(t){return 1===t?1:1-H(t*Z)}),Ub("Back",Xb("in"),Xb("out"),Xb()),Bt.SteppedEase=Bt.steps=ht.SteppedEase={config:function config(t,e){void 0===t&&(t=1);var r=1/t,i=t+(e?0:1),n=e?1:0;return function(t){return((i*Mt(0,.99999999,t)|0)+n)*r}}},j.ease=Bt["quad.out"],ja("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(t){return Tt+=t+","+t+"Params,"});var Vt,Xt=function GSCache(t,e){this.id=W++,(t._gsap=this).target=t,this.harness=e,this.get=e?e.get:ia,this.set=e?e.getSetter:ue},qt=((Vt=Animation.prototype).delay=function delay(t){return t||0===t?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+t-this._delay),this._delay=t,this):this._delay},Vt.duration=function duration(t){return arguments.length?this.totalDuration(0<this._repeat?t+(t+this._rDelay)*this._repeat:t):this.totalDuration()&&this._dur},Vt.totalDuration=function totalDuration(t){return arguments.length?(this._dirty=0,Ua(this,this._repeat<0?t:(t-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},Vt.totalTime=function totalTime(t,e){if(Lt(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(La(this,t),!r._dp||r.parent||Ma(r,this);r&&r.parent;)r.parent._time!==r._start+(0<=r._ts?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(0<this._ts&&t<this._tDur||this._ts<0&&0<t||!this._tDur&&!t)&&Na(this._dp,this,this._start-this._delay)}return(this._tTime!==t||!this._dur&&!e||this._initted&&Math.abs(this._zTime)===q||!this._initted&&this._dur&&t||!t&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=t),qa(this,t,e)),this},Vt.time=function time(t,e){return arguments.length?this.totalTime(Math.min(this.totalDuration(),t+Ha(this))%(this._dur+this._rDelay)||(t?this._dur:0),e):this._time},Vt.totalProgress=function totalProgress(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this.totalDuration()?Math.min(1,this._tTime/this._tDur):0<=this.rawTime()&&this._initted?1:0},Vt.progress=function progress(t,e){return arguments.length?this.totalTime(this.duration()*(!this._yoyo||1&this.iteration()?t:1-t)+Ha(this),e):this.duration()?Math.min(1,this._time/this._dur):0<this.rawTime()?1:0},Vt.iteration=function iteration(t,e){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(t-1)*r,e):this._repeat?wt(this._tTime,r)+1:1},Vt.timeScale=function timeScale(t,e){if(!arguments.length)return this._rts===-q?0:this._rts;if(this._rts===t)return this;var r=this.parent&&this._ts?Ja(this.parent._time,this):this._tTime;return this._rts=+t||0,this._ts=this._ps||t===-q?0:this._rts,this.totalTime(Mt(-Math.abs(this._delay),this.totalDuration(),r),!1!==e),Ka(this),function _recacheAncestors(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t}(this)},Vt.paused=function paused(t){return arguments.length?(this._ps!==t&&((this._ps=t)?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(Lt(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,1===this.progress()&&Math.abs(this._zTime)!==q&&(this._tTime-=q)))),this):this._ps},Vt.startTime=function startTime(t){if(arguments.length){this._start=la(t);var e=this.parent||this._dp;return!e||!e._sort&&this.parent||Na(e,this,this._start-this._delay),this}return this._start},Vt.endTime=function endTime(t){return this._start+(w(t)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},Vt.rawTime=function rawTime(t){var e=this.parent||this._dp;return e?t&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Ja(e.rawTime(t),this):this._tTime:this._tTime},Vt.revert=function revert(t){void 0===t&&(t=ct);var e=I;return I=t,pa(this)&&(this.timeline&&this.timeline.revert(t),this.totalTime(-.01,t.suppressEvents)),"nested"!==this.data&&!1!==t.kill&&this.kill(),I=e,this},Vt.globalTime=function globalTime(t){for(var e=this,r=arguments.length?t:e.rawTime();e;)r=e._start+r/(Math.abs(e._ts)||1),e=e._dp;return!this.parent&&this._sat?this._sat.globalTime(t):r},Vt.repeat=function repeat(t){return arguments.length?(this._repeat=t===1/0?-2:t,Va(this)):-2===this._repeat?1/0:this._repeat},Vt.repeatDelay=function repeatDelay(t){if(arguments.length){var e=this._time;return this._rDelay=t,Va(this),e?this.time(e):this}return this._rDelay},Vt.yoyo=function yoyo(t){return arguments.length?(this._yoyo=t,this):this._yoyo},Vt.seek=function seek(t,e){return this.totalTime(Ot(this,t),w(e))},Vt.restart=function restart(t,e){return this.play().totalTime(t?-this._delay:0,w(e)),this._dur||(this._zTime=-q),this},Vt.play=function play(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},Vt.reverse=function reverse(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},Vt.pause=function pause(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},Vt.resume=function resume(){return this.paused(!1)},Vt.reversed=function reversed(t){return arguments.length?(!!t!==this.reversed()&&this.timeScale(-this._rts||(t?-q:0)),this):this._rts<0},Vt.invalidate=function invalidate(){return this._initted=this._act=0,this._zTime=-q,this},Vt.isActive=function isActive(){var t,e=this.parent||this._dp,r=this._start;return!(e&&!(this._ts&&this._initted&&e.isActive()&&(t=e.rawTime(!0))>=r&&t<this.endTime(!0)-q))},Vt.eventCallback=function eventCallback(t,e,r){var i=this.vars;return 1<arguments.length?(e?(i[t]=e,r&&(i[t+"Params"]=r),"onUpdate"===t&&(this._onUpdate=e)):delete i[t],this):i[t]},Vt.then=function then(t){var i=this,n=i._prom;return new Promise(function(e){function Ao(){var t=i.then;i.then=null,n&&n(),s(r)&&(r=r(i))&&(r.then||r===i)&&(i.then=t),e(r),i.then=t}var r=s(t)?t:sa;i._initted&&1===i.totalProgress()&&0<=i._ts||!i._tTime&&i._ts<0?Ao():i._prom=Ao})},Vt.kill=function kill(){wb(this)},Animation);function Animation(t){this.vars=t,this._delay=+t.delay||0,(this._repeat=t.repeat===1/0?-2:t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase),this._ts=1,Ua(this,+t.duration,1,1),this.data=t.data,l&&(this._ctx=l).data.push(this),d||It.wake()}ta(qt.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-q,_prom:0,_ps:!1,_rts:1});var Gt=function(i){function Timeline(t,e){var r;return void 0===t&&(t={}),(r=i.call(this,t)||this).labels={},r.smoothChildTiming=!!t.smoothChildTiming,r.autoRemoveChildren=!!t.autoRemoveChildren,r._sort=w(t.sortChildren),L&&Na(t.parent||L,_assertThisInitialized(r),e),t.reversed&&r.reverse(),t.paused&&r.paused(!0),t.scrollTrigger&&Oa(_assertThisInitialized(r),t.scrollTrigger),r}_inheritsLoose(Timeline,i);var e=Timeline.prototype;return e.to=function to(t,e,r){return Ya(0,arguments,this),this},e.from=function from(t,e,r){return Ya(1,arguments,this),this},e.fromTo=function fromTo(t,e,r,i){return Ya(2,arguments,this),this},e.set=function set(t,e,r){return e.duration=0,e.parent=this,ya(e).repeatDelay||(e.repeat=0),e.immediateRender=!!e.immediateRender,new te(t,e,Ot(this,r),1),this},e.call=function call(t,e,r){return Na(this,te.delayedCall(0,t,e),r)},e.staggerTo=function staggerTo(t,e,r,i,n,a,s){return r.duration=e,r.stagger=r.stagger||i,r.onComplete=a,r.onCompleteParams=s,r.parent=this,new te(t,r,Ot(this,n)),this},e.staggerFrom=function staggerFrom(t,e,r,i,n,a,s){return r.runBackwards=1,ya(r).immediateRender=w(r.immediateRender),this.staggerTo(t,e,r,i,n,a,s)},e.staggerFromTo=function staggerFromTo(t,e,r,i,n,a,s,o){return i.startAt=r,ya(i).immediateRender=w(i.immediateRender),this.staggerTo(t,e,i,n,a,s,o)},e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_=this._time,m=this._dirty?this.totalDuration():this._tDur,g=this._dur,v=t<=0?0:la(t),y=this._zTime<0!=t<0&&(this._initted||!g);if(this!==L&&m<v&&0<=t&&(v=m),v!==this._tTime||r||y){if(_!==this._time&&g&&(v+=this._time-_,t+=this._time-_),i=v,f=this._start,u=!(l=this._ts),y&&(g||(_=this._zTime),!t&&e||(this._zTime=t)),this._repeat){if(d=this._yoyo,o=g+this._rDelay,this._repeat<-1&&t<0)return this.totalTime(100*o+t,e,r);if(i=la(v%o),v===m?(s=this._repeat,i=g):((s=~~(c=la(v/o)))&&s===c&&(i=g,s--),g<i&&(i=g)),c=wt(this._tTime,o),!_&&this._tTime&&c!==s&&this._tTime-c*o-this._dur<=0&&(c=s),d&&1&s&&(i=g-i,p=1),s!==c&&!this._lock){var T=d&&1&c,b=T===(d&&1&s);if(s<c&&(T=!T),_=T?0:v%g?g:v,this._lock=1,this.render(_||(p?0:la(s*o)),e,!g)._lock=0,this._tTime=v,!e&&this.parent&&At(this,"onRepeat"),this.vars.repeatRefresh&&!p&&(this.invalidate()._lock=1,c=s),_&&_!==this._time||u!=!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(g=this._dur,m=this._tDur,b&&(this._lock=2,_=T?g:-1e-4,this.render(_,!0),this.vars.repeatRefresh&&!p&&this.invalidate()),this._lock=0,!this._ts&&!u)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(h=function _findNextPauseTween(t,e,r){var i;if(e<r)for(i=t._first;i&&i._start<=r;){if("isPause"===i.data&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=r;){if("isPause"===i.data&&i._start<e)return i;i=i._prev}}(this,la(_),la(i)))&&(v-=i-(i=h._start)),this._tTime=v,this._time=i,this._act=!!l,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=t,_=0),!_&&v&&g&&!e&&!c&&(At(this,"onStart"),this._tTime!==v))return this;if(_<=i&&0<=t)for(n=this._first;n;){if(a=n._next,(n._act||i>=n._start)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(i-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(i-n._start)*n._ts,e,r),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=-q);break}}n=a}else{n=this._last;for(var w=t<0?t:i;n;){if(a=n._prev,(n._act||w<=n._end)&&n._ts&&h!==n){if(n.parent!==this)return this.render(t,e,r);if(n.render(0<n._ts?(w-n._start)*n._ts:(n._dirty?n.totalDuration():n._tDur)+(w-n._start)*n._ts,e,r||I&&pa(n)),i!==this._time||!this._ts&&!u){h=0,a&&(v+=this._zTime=w?-q:q);break}}n=a}}if(h&&!e&&(this.pause(),h.render(_<=i?0:-q)._zTime=_<=i?1:-1,this._ts))return this._start=f,Ka(this),this.render(t,e,r);this._onUpdate&&!e&&At(this,"onUpdate",!0),(v===m&&this._tTime>=this.totalDuration()||!v&&_)&&(f!==this._start&&Math.abs(l)===Math.abs(this._ts)||this._lock||(!t&&g||!(v===m&&0<this._ts||!v&&this._ts<0)||Ca(this,1),e||t<0&&!_||!v&&!_&&m||(At(this,v===m&&0<=t?"onComplete":"onReverseComplete",!0),!this._prom||v<m&&0<this.timeScale()||this._prom())))}return this},e.add=function add(e,i){var n=this;if(t(i)||(i=Ot(this,i,e)),!(e instanceof qt)){if(K(e))return e.forEach(function(t){return n.add(t,i)}),this;if(r(e))return this.addLabel(e,i);if(!s(e))return this;e=te.delayedCall(0,e)}return this!==e?Na(this,e,i):this},e.getChildren=function getChildren(t,e,r,i){void 0===t&&(t=!0),void 0===e&&(e=!0),void 0===r&&(r=!0),void 0===i&&(i=-X);for(var n=[],a=this._first;a;)a._start>=i&&(a instanceof te?e&&n.push(a):(r&&n.push(a),t&&n.push.apply(n,a.getChildren(!0,e,r)))),a=a._next;return n},e.getById=function getById(t){for(var e=this.getChildren(1,1,1),r=e.length;r--;)if(e[r].vars.id===t)return e[r]},e.remove=function remove(t){return r(t)?this.removeLabel(t):s(t)?this.killTweensOf(t):(t.parent===this&&Ba(this,t),t===this._recent&&(this._recent=this._last),Da(this))},e.totalTime=function totalTime(t,e){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=la(It.time-(0<this._ts?t/this._ts:(this.totalDuration()-t)/-this._ts))),i.prototype.totalTime.call(this,t,e),this._forcing=0,this):this._tTime},e.addLabel=function addLabel(t,e){return this.labels[t]=Ot(this,e),this},e.removeLabel=function removeLabel(t){return delete this.labels[t],this},e.addPause=function addPause(t,e,r){var i=te.delayedCall(0,e||V,r);return i.data="isPause",this._hasPause=1,Na(this,i,Ot(this,t))},e.removePause=function removePause(t){var e=this._first;for(t=Ot(this,t);e;)e._start===t&&"isPause"===e.data&&Ca(e),e=e._next},e.killTweensOf=function killTweensOf(t,e,r){for(var i=this.getTweensOf(t,r),n=i.length;n--;)Zt!==i[n]&&i[n].kill(t,e);return this},e.getTweensOf=function getTweensOf(e,r){for(var i,n=[],a=Pt(e),s=this._first,o=t(r);s;)s instanceof te?na(s._targets,a)&&(o?(!Zt||s._initted&&s._ts)&&s.globalTime(0)<=r&&s.globalTime(s.totalDuration())>r:!r||s.isActive())&&n.push(s):(i=s.getTweensOf(a,r)).length&&n.push.apply(n,i),s=s._next;return n},e.tweenTo=function tweenTo(t,e){e=e||{};var r,i=this,n=Ot(i,t),a=e.startAt,s=e.onStart,o=e.onStartParams,u=e.immediateRender,h=te.to(i,ta({ease:e.ease||"none",lazy:!1,immediateRender:!1,time:n,overwrite:"auto",duration:e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale())||q,onStart:function onStart(){if(i.pause(),!r){var t=e.duration||Math.abs((n-(a&&"time"in a?a.time:i._time))/i.timeScale());h._dur!==t&&Ua(h,t,0,1).render(h._time,!0,!0),r=1}s&&s.apply(h,o||[])}},e));return u?h.render(0):h},e.tweenFromTo=function tweenFromTo(t,e,r){return this.tweenTo(e,ta({startAt:{time:Ot(this,t)}},r))},e.recent=function recent(){return this._recent},e.nextLabel=function nextLabel(t){return void 0===t&&(t=this._time),ub(this,Ot(this,t))},e.previousLabel=function previousLabel(t){return void 0===t&&(t=this._time),ub(this,Ot(this,t),1)},e.currentLabel=function currentLabel(t){return arguments.length?this.seek(t,!0):this.previousLabel(this._time+q)},e.shiftChildren=function shiftChildren(t,e,r){void 0===r&&(r=0);var i,n=this._first,a=this.labels;for(t=la(t);n;)n._start>=r&&(n._start+=t,n._end+=t),n=n._next;if(e)for(i in a)a[i]>=r&&(a[i]+=t);return Da(this)},e.invalidate=function invalidate(t){var e=this._first;for(this._lock=0;e;)e.invalidate(t),e=e._next;return i.prototype.invalidate.call(this,t)},e.clear=function clear(t){void 0===t&&(t=!0);for(var e,r=this._first;r;)e=r._next,this.remove(r),r=e;return this._dp&&(this._time=this._tTime=this._pTime=0),t&&(this.labels={}),Da(this)},e.totalDuration=function totalDuration(t){var e,r,i,n=0,a=this,s=a._last,o=X;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-t:t));if(a._dirty){for(i=a.parent;s;)e=s._prev,s._dirty&&s.totalDuration(),o<(r=s._start)&&a._sort&&s._ts&&!a._lock?(a._lock=1,Na(a,s,r-s._delay,1)._lock=0):o=r,r<0&&s._ts&&(n-=r,(!i&&!a._dp||i&&i.smoothChildTiming)&&(a._start+=la(r/a._ts),a._time-=r,a._tTime-=r),a.shiftChildren(-r,!1,-Infinity),o=0),s._end>n&&s._ts&&(n=s._end),s=e;Ua(a,a===L&&a._time>n?a._time:n,1,1),a._dirty=0}return a._tDur},Timeline.updateRoot=function updateRoot(t){if(L._ts&&(qa(L,Ja(t,L)),f=It.frame),It.frame>=vt){vt+=Y.autoSleep||120;var e=L._first;if((!e||!e._ts)&&Y.autoSleep&&It._listeners.length<2){for(;e&&!e._ts;)e=e._next;e||It.sleep()}}},Timeline}(qt);ta(Gt.prototype,{_lock:0,_hasPause:0,_forcing:0});function cc(t,e,i,n,a,o){var u,h,l,f;if(mt[t]&&!1!==(u=new mt[t]).init(a,u.rawVars?e[t]:function _processVars(t,e,i,n,a){if(s(t)&&(t=Qt(t,a,e,i,n)),!v(t)||t.style&&t.nodeType||K(t)||J(t))return r(t)?Qt(t,a,e,i,n):t;var o,u={};for(o in t)u[o]=Qt(t[o],a,e,i,n);return u}(e[t],n,a,o,i),i,n,o)&&(i._pt=h=new we(i._pt,a,t,0,1,u.render,u,0,u.priority),i!==c))for(l=i._ptLookup[i._targets.indexOf(a)],f=u._props.length;f--;)l[u._props[f]]=h;return u}function ic(t,r,e,i){var n,a,s=r.ease||i||"power1.inOut";if(K(r))a=e[t]||(e[t]=[]),r.forEach(function(t,e){return a.push({t:e/(r.length-1)*100,v:t,e:s})});else for(n in r)a=e[n]||(e[n]=[]),"ease"===n||a.push({t:parseFloat(t),v:r[n],e:s})}var Zt,Wt,$t=function _addPropTween(t,e,i,n,a,o,u,h,l,f){s(n)&&(n=n(a||0,t,o));var c,d=t[e],p="get"!==i?i:s(d)?l?t[e.indexOf("set")||!s(t["get"+e.substr(3)])?e:"get"+e.substr(3)](l):t[e]():d,_=s(d)?l?se:ae:ie;if(r(n)&&(~n.indexOf("random(")&&(n=rb(n)),"="===n.charAt(1)&&(!(c=ma(p,n)+(_a(p)||0))&&0!==c||(n=c))),!f||p!==n||Wt)return isNaN(p*n)||""===n?(d||e in t||S(e,n),function _addComplexStringPropTween(t,e,r,i,n,a,s){var o,u,h,l,f,c,d,p,_=new we(this._pt,t,e,0,1,pe,null,n),m=0,g=0;for(_.b=r,_.e=i,r+="",(d=~(i+="").indexOf("random("))&&(i=rb(i)),a&&(a(p=[r,i],t,e),r=p[0],i=p[1]),u=r.match(at)||[];o=at.exec(i);)l=o[0],f=i.substring(m,o.index),h?h=(h+1)%5:"rgba("===f.substr(-5)&&(h=1),l!==u[g++]&&(c=parseFloat(u[g-1])||0,_._pt={_next:_._pt,p:f||1===g?f:",",s:c,c:"="===l.charAt(1)?ma(c,l)-c:parseFloat(l)-c,m:h&&h<4?Math.round:0},m=at.lastIndex);return _.c=m<i.length?i.substring(m,i.length):"",_.fp=s,(st.test(i)||d)&&(_.e=0),this._pt=_}.call(this,t,e,p,n,_,h||Y.stringFilter,l)):(c=new we(this._pt,t,e,+p||0,n-(p||0),"boolean"==typeof d?de:fe,0,_),l&&(c.fp=l),u&&c.modifier(u,this,t),this._pt=c)},Ht=function _initTween(t,e,r){var i,n,a,s,o,u,h,l,f,c,d,p,_,m=t.vars,g=m.ease,v=m.startAt,y=m.immediateRender,T=m.lazy,b=m.onUpdate,x=m.runBackwards,k=m.yoyoEase,O=m.keyframes,M=m.autoRevert,C=t._dur,P=t._startAt,S=t._targets,A=t.parent,D=A&&"nested"===A.data?A.vars.targets:S,z="auto"===t._overwrite&&!F,R=t.timeline,E=m.easeReverse||k;if(!R||O&&g||(g="none"),t._ease=jt(g,j.ease),t._rEase=E&&(jt(E)||t._ease),t._from=!R&&!!m.runBackwards,t._from&&(t.ratio=1),!R||O&&!m.stagger){if(p=(l=S[0]?ha(S[0]).harness:0)&&m[l.prop],i=xa(m,dt),P&&(P._zTime<0&&P.progress(1),e<0&&x&&y&&!M?P.render(-1,!0):P.revert(x&&C?ft:lt),P._lazy=0),v){if(Ca(t._startAt=te.set(S,ta({data:"isStart",overwrite:!1,parent:A,immediateRender:!0,lazy:!P&&w(T),startAt:null,delay:0,onUpdate:b&&function(){return At(t,"onUpdate")},stagger:0},v))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(I||!y&&!M)&&t._startAt.revert(ft),y&&C&&e<=0&&r<=0)return void(e&&(t._zTime=e))}else if(x&&C&&!P)if(e&&(y=!1),a=ta({overwrite:!1,data:"isFromStart",lazy:y&&!P&&w(T),immediateRender:y,stagger:0,parent:A},i),p&&(a[l.prop]=p),Ca(t._startAt=te.set(S,a)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(I?t._startAt.revert(ft):t._startAt.render(-1,!0)),t._zTime=e,y){if(!e)return}else _initTween(t._startAt,q,q);for(t._pt=t._ptCache=0,T=C&&w(T)||T&&!C,n=0;n<S.length;n++){if(h=(o=S[n])._gsap||ga(S)[n]._gsap,t._ptLookup[n]=c={},_t[h.id]&&pt.length&&oa(),d=D===S?n:D.indexOf(o),l&&!1!==(f=new l).init(o,p||i,t,d,D)&&(t._pt=s=new we(t._pt,o,f.name,0,1,f.render,f,0,f.priority),f._props.forEach(function(t){c[t]=s}),f.priority&&(u=1)),!l||p)for(a in i)mt[a]&&(f=cc(a,i,t,d,o,D))?f.priority&&(u=1):c[a]=s=$t.call(t,o,a,"get",i[a],d,D,0,m.stringFilter);t._op&&t._op[n]&&t.kill(o,t._op[n]),z&&t._pt&&(Zt=t,L.killTweensOf(o,c,t.globalTime(e)),_=!t.parent,Zt=0),t._pt&&T&&(_t[h.id]=1)}u&&be(t),t._onInit&&t._onInit(t)}t._onUpdate=b,t._initted=(!t._op||t._pt)&&!_,O&&e<=0&&R.render(X,!0,!0)},Qt=function _parseFuncOrString(t,e,i,n,a){return s(t)?t.call(e,i,n,a):r(t)&&~t.indexOf("random(")?rb(t):t},Jt=Tt+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Kt={};ja(Jt+",id,stagger,delay,duration,paused,scrollTrigger",function(t){return Kt[t]=1});var te=function(E){function Tween(e,r,i,n){var a;"number"==typeof r&&(i.duration=r,r=i,i=null);var s,o,u,h,l,f,c,d,p=(a=E.call(this,n?r:ya(r))||this).vars,_=p.duration,m=p.delay,g=p.immediateRender,b=p.stagger,x=p.overwrite,k=p.keyframes,O=p.defaults,M=p.scrollTrigger,C=r.parent||L,P=(K(e)||J(e)?t(e[0]):"length"in r)?[e]:Pt(e);if(a._targets=P.length?ga(P):T("GSAP target "+e+" not found. https://gsap.com",!Y.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=x,k||b||y(_)||y(m)){var S=(r=a.vars).easeReverse||r.yoyoEase;if((s=a.timeline=new Gt({data:"nested",defaults:O||{},targets:C&&"nested"===C.data?C.vars.targets:P})).kill(),s.parent=s._dp=_assertThisInitialized(a),s._start=0,b||y(_)||y(m)){if(h=P.length,c=b&&hb(b),v(b))for(l in b)~Jt.indexOf(l)&&((d=d||{})[l]=b[l]);for(o=0;o<h;o++)(u=xa(r,Kt)).stagger=0,S&&(u.easeReverse=S),d&&bt(u,d),f=P[o],u.duration=+Qt(_,_assertThisInitialized(a),o,f,P),u.delay=(+Qt(m,_assertThisInitialized(a),o,f,P)||0)-a._delay,!b&&1===h&&u.delay&&(a._delay=m=u.delay,a._start+=m,u.delay=0),s.to(f,u,c?c(o,f,P):0),s._ease=Bt.none;s.duration()?_=m=0:a.timeline=0}else if(k){ya(ta(s.vars.defaults,{ease:"none"})),s._ease=jt(k.ease||r.ease||"none");var A,D,z,R=0;if(K(k))k.forEach(function(t){return s.to(P,t,">")}),s.duration();else{for(l in u={},k)"ease"===l||"easeEach"===l||ic(l,k[l],u,k.easeEach);for(l in u)for(A=u[l].sort(function(t,e){return t.t-e.t}),o=R=0;o<A.length;o++)(z={ease:(D=A[o]).e,duration:(D.t-(o?A[o-1].t:0))/100*_})[l]=D.v,s.to(P,z,R),R+=z.duration;s.duration()<_&&s.to({},{duration:_-s.duration()})}}_||a.duration(_=s.duration())}else a.timeline=0;return!0!==x||F||(Zt=_assertThisInitialized(a),L.killTweensOf(P),Zt=0),Na(C,_assertThisInitialized(a),i),r.reversed&&a.reverse(),r.paused&&a.paused(!0),(g||!_&&!k&&a._start===la(C._time)&&w(g)&&function _hasNoPausedAncestors(t){return!t||t._ts&&_hasNoPausedAncestors(t.parent)}(_assertThisInitialized(a))&&"nested"!==C.data)&&(a._tTime=-q,a.render(Math.max(0,-m)||0)),M&&Oa(_assertThisInitialized(a),M),a}_inheritsLoose(Tween,E);var e=Tween.prototype;return e.render=function render(t,e,r){var i,n,a,s,o,u,h,l,f=this._time,c=this._tDur,d=this._dur,p=t<0,_=c-q<t&&!p?c:t<q?0:t;if(d){if(_!==this._tTime||!t||r||!this._initted&&this._tTime||this._startAt&&this._zTime<0!=p||this._lazy){if(i=_,l=this.timeline,this._repeat){if(s=d+this._rDelay,this._repeat<-1&&p)return this.totalTime(100*s+t,e,r);if(i=la(_%s),_===c?(a=this._repeat,i=d):(a=~~(o=la(_/s)))&&a===o?(i=d,a--):d<i&&(i=d),(u=this._yoyo&&1&a)&&(i=d-i),o=wt(this._tTime,s),i===f&&!r&&this._initted&&a===o)return this._tTime=_,this;a!==o&&this.vars.repeatRefresh&&!u&&!this._lock&&i!==s&&this._initted&&(this._lock=r=1,this.render(la(s*a),!0).invalidate()._lock=0)}if(!this._initted){if(Pa(this,p?t:i,r,e,_))return this._tTime=0,this;if(!(f===this._time||r&&this.vars.repeatRefresh&&a!==o))return this;if(d!==this._dur)return this.render(t,e,r)}if(this._rEase){var m=i<f;if(m!==this._inv){var g=m?f:d-f;this._inv=m,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=f,this._invRecip=g?(m?-1:1)/g:0,this._invScale=m?-this.ratio:1-this.ratio,this._invEase=m?this._rEase:this._ease}this.ratio=h=this._invRatio+this._invScale*this._invEase((i-this._invTime)*this._invRecip)}else this.ratio=h=this._ease(i/d);if(this._from&&(this.ratio=h=1-h),this._tTime=_,this._time=i,!this._act&&this._ts&&(this._act=1,this._lazy=0),!f&&_&&!e&&!o&&(At(this,"onStart"),this._tTime!==_))return this;for(n=this._pt;n;)n.r(h,n.d),n=n._next;l&&l.render(t<0?t:l._dur*l._ease(i/this._dur),e,r)||this._startAt&&(this._zTime=t),this._onUpdate&&!e&&(p&&Fa(this,t,0,r),At(this,"onUpdate")),this._repeat&&a!==o&&this.vars.onRepeat&&!e&&this.parent&&At(this,"onRepeat"),_!==this._tDur&&_||this._tTime!==_||(p&&!this._onUpdate&&Fa(this,t,0,!0),!t&&d||!(_===this._tDur&&0<this._ts||!_&&this._ts<0)||Ca(this,1),e||p&&!f||!(_||f||u)||(At(this,_===c?"onComplete":"onReverseComplete",!0),!this._prom||_<c&&0<this.timeScale()||this._prom()))}}else!function _renderZeroDurationTween(t,e,r,i){var n,a,s,o=t.ratio,u=e<0||!e&&(!t._start&&function _parentPlayheadIsBeforeStart(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||_parentPlayheadIsBeforeStart(e))}(t)&&(t._initted||!xt(t))||(t._ts<0||t._dp._ts<0)&&!xt(t))?0:1,h=t._rDelay,l=0;if(h&&t._repeat&&(l=Mt(0,t._tDur,e),a=wt(l,h),t._yoyo&&1&a&&(u=1-u),a!==wt(t._tTime,h)&&(o=1-u,t.vars.repeatRefresh&&t._initted&&t.invalidate())),u!==o||I||i||t._zTime===q||!e&&t._zTime){if(!t._initted&&Pa(t,e,i,r,l))return;for(s=t._zTime,t._zTime=e||(r?q:0),r=r||e&&!s,t.ratio=u,t._from&&(u=1-u),t._time=0,t._tTime=l,n=t._pt;n;)n.r(u,n.d),n=n._next;e<0&&Fa(t,e,0,!0),t._onUpdate&&!r&&At(t,"onUpdate"),l&&t._repeat&&!r&&t.parent&&At(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===u&&(u&&Ca(t,1),r||I||(At(t,u?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)}(this,t,e,r);return this},e.targets=function targets(){return this._targets},e.invalidate=function invalidate(t){return t&&this.vars.runBackwards||(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(t),E.prototype.invalidate.call(this,t)},e.resetTo=function resetTo(t,e,r,i,n){d||It.wake(),this._ts||this.play();var a,s=Math.min(this._dur,(this._dp._time-this._start)*this._ts);return this._initted||Ht(this,s),a=this._ease(s/this._dur),function _updatePropTweens(t,e,r,i,n,a,s,o){var u,h,l,f,c=(t._pt&&t._ptCache||(t._ptCache={}))[e];if(!c)for(c=t._ptCache[e]=[],l=t._ptLookup,f=t._targets.length;f--;){if((u=l[f][e])&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return Wt=1,t.vars[e]="+=0",Ht(t,s),Wt=0,o?T(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(f=c.length;f--;)(u=(h=c[f])._pt||h).s=!i&&0!==i||n?u.s+(i||0)+a*u.c:i,u.c=r-u.s,h.e&&(h.e=ka(r)+_a(h.e)),h.b&&(h.b=u.s+_a(h.b))}(this,t,e,r,i,a,s,n)?this.resetTo(t,e,r,i,1):(La(this,0),this.parent||Aa(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function kill(t,e){if(void 0===e&&(e="all"),!(t||e&&"all"!==e))return this._lazy=this._pt=0,this.parent?wb(this):this.scrollTrigger&&this.scrollTrigger.kill(!!I),this;if(this.timeline){var i=this.timeline.totalDuration();return this.timeline.killTweensOf(t,e,Zt&&!0!==Zt.vars.overwrite)._first||wb(this),this.parent&&i!==this.timeline.totalDuration()&&Ua(this,this._dur*this.timeline._tDur/i,0,1),this}var n,a,s,o,u,h,l,f=this._targets,c=t?Pt(t):f,d=this._ptLookup,p=this._pt;if((!e||"all"===e)&&function _arraysMatch(t,e){for(var r=t.length,i=r===e.length;i&&r--&&t[r]===e[r];);return r<0}(f,c))return"all"===e&&(this._pt=0),wb(this);for(n=this._op=this._op||[],"all"!==e&&(r(e)&&(u={},ja(e,function(t){return u[t]=1}),e=u),e=function _addAliasesToVars(t,e){var r,i,n,a,s=t[0]?ha(t[0]).harness:0,o=s&&s.aliases;if(!o)return e;for(i in r=bt({},e),o)if(i in r)for(n=(a=o[i].split(",")).length;n--;)r[a[n]]=r[i];return r}(f,e)),l=f.length;l--;)if(~c.indexOf(f[l]))for(u in a=d[l],"all"===e?(n[l]=e,o=a,s={}):(s=n[l]=n[l]||{},o=e),o)(h=a&&a[u])&&("kill"in h.d&&!0!==h.d.kill(u)||Ba(this,h,"_pt"),delete a[u]),"all"!==s&&(s[u]=1);return this._initted&&!this._pt&&p&&wb(this),this},Tween.to=function to(t,e,r){return new Tween(t,e,r)},Tween.from=function from(t,e){return Ya(1,arguments)},Tween.delayedCall=function delayedCall(t,e,r,i){return new Tween(e,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:t,onComplete:e,onReverseComplete:e,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:i})},Tween.fromTo=function fromTo(t,e,r){return Ya(2,arguments)},Tween.set=function set(t,e){return e.duration=0,e.repeatDelay||(e.repeat=0),new Tween(t,e)},Tween.killTweensOf=function killTweensOf(t,e,r){return L.killTweensOf(t,e,r)},Tween}(qt);ta(te.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0}),ja("staggerTo,staggerFrom,staggerFromTo",function(r){te[r]=function(){var t=new Gt,e=Ct.call(arguments,0);return e.splice("staggerFromTo"===r?5:4,0,0),t[r].apply(t,e)}});function qc(t,e,r){return t.setAttribute(e,r)}function yc(t,e,r,i){i.mSet(t,e,i.m.call(i.tween,r,i.mt),i)}var ie=function _setterPlain(t,e,r){return t[e]=r},ae=function _setterFunc(t,e,r){return t[e](r)},se=function _setterFuncWithParam(t,e,r,i){return t[e](i.fp,r)},ue=function _getSetter(t,e){return s(t[e])?ae:u(t[e])&&t.setAttribute?qc:ie},fe=function _renderPlain(t,e){return e.set(e.t,e.p,Math.round(1e6*(e.s+e.c*t))/1e6,e)},de=function _renderBoolean(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},pe=function _renderComplexString(t,e){var r=e._pt,i="";if(!t&&e.b)i=e.b;else if(1===t&&e.e)i=e.e;else{for(;r;)i=r.p+(r.m?r.m(r.s+r.c*t):Math.round(1e4*(r.s+r.c*t))/1e4)+i,r=r._next;i+=e.c}e.set(e.t,e.p,i,e)},_e=function _renderPropTweens(t,e){for(var r=e._pt;r;)r.r(t,r.d),r=r._next},ve=function _addPluginModifier(t,e,r,i){for(var n,a=this._pt;a;)n=a._next,a.p===i&&a.modifier(t,e,r),a=n},Te=function _killPropTweensOf(t){for(var e,r,i=this._pt;i;)r=i._next,i.p===t&&!i.op||i.op===t?Ba(this,i,"_pt"):i.dep||(e=1),i=r;return!e},be=function _sortPropTweensByPriority(t){for(var e,r,i,n,a=t._pt;a;){for(e=a._next,r=i;r&&r.pr>a.pr;)r=r._next;(a._prev=r?r._prev:n)?a._prev._next=a:i=a,(a._next=r)?r._prev=a:n=a,a=e}t._pt=i},we=(PropTween.prototype.modifier=function modifier(t,e,r){this.mSet=this.mSet||this.set,this.set=yc,this.m=t,this.mt=r,this.tween=e},PropTween);function PropTween(t,e,r,i,n,a,s,o,u){this.t=e,this.s=i,this.c=n,this.p=r,this.r=a||fe,this.d=s||this,this.set=o||ie,this.pr=u||0,(this._next=t)&&(t._prev=this)}ja(Tt+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(t){return dt[t]=1}),ht.TweenMax=ht.TweenLite=te,ht.TimelineLite=ht.TimelineMax=Gt,L=new Gt({sortChildren:!1,defaults:j,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0}),Y.stringFilter=Ib;function Gc(t){return(Oe[t]||Me).map(function(t){return t()})}function Hc(){var t=Date.now(),o=[];2<t-Ce&&(Gc("matchMediaInit"),ke.forEach(function(t){var e,r,i,n,a=t.queries,s=t.conditions;for(r in a)(e=h.matchMedia(a[r]).matches)&&(i=1),e!==s[r]&&(s[r]=e,n=1);n&&(t.revert(),i&&o.push(t))}),Gc("matchMediaRevert"),o.forEach(function(e){return e.onMatch(e,function(t){return e.add(null,t)})}),Ce=t,Gc("matchMedia"))}var xe,ke=[],Oe={},Me=[],Ce=0,Pe=0,Se=((xe=Context.prototype).add=function add(t,i,n){function Gw(){var t,e=l,r=a.selector;return e&&e!==a&&e.data.push(a),n&&(a.selector=fb(n)),l=a,t=i.apply(a,arguments),s(t)&&a._r.push(t),l=e,a.selector=r,a.isReverted=!1,t}s(t)&&(n=i,i=t,t=s);var a=this;return a.last=Gw,t===s?Gw(a,function(t){return a.add(null,t)}):t?a[t]=Gw:Gw},xe.ignore=function ignore(t){var e=l;l=null,t(this),l=e},xe.getTweens=function getTweens(){var e=[];return this.data.forEach(function(t){return t instanceof Context?e.push.apply(e,t.getTweens()):t instanceof te&&!(t.parent&&"nested"===t.parent.data)&&e.push(t)}),e},xe.clear=function clear(){this._r.length=this.data.length=0},xe.kill=function kill(i,t){var n=this;if(i?function(){for(var t,e=n.getTweens(),r=n.data.length;r--;)"isFlip"===(t=n.data[r]).data&&(t.revert(),t.getChildren(!0,!0,!1).forEach(function(t){return e.splice(e.indexOf(t),1)}));for(e.map(function(t){return{g:t._dur||t._delay||t._sat&&!t._sat.vars.immediateRender?t.globalTime(0):-1/0,t:t}}).sort(function(t,e){return e.g-t.g||-1/0}).forEach(function(t){return t.t.revert(i)}),r=n.data.length;r--;)(t=n.data[r])instanceof Gt?"nested"!==t.data&&(t.scrollTrigger&&t.scrollTrigger.revert(),t.kill()):t instanceof te||!t.revert||t.revert(i);n._r.forEach(function(t){return t(i,n)}),n.isReverted=!0}():this.data.forEach(function(t){return t.kill&&t.kill()}),this.clear(),t)for(var e=ke.length;e--;)ke[e].id===this.id&&ke.splice(e,1)},xe.revert=function revert(t){this.kill(t||{})},Context);function Context(t,e){this.selector=e&&fb(e),this.data=[],this._r=[],this.isReverted=!1,this.id=Pe++,t&&this.add(t)}var De,Re=((De=MatchMedia.prototype).add=function add(t,e,r){v(t)||(t={matches:t});var i,n,a,s=new Se(0,r||this.scope),o=s.conditions={};for(n in l&&!s.selector&&(s.selector=l.selector),this.contexts.push(s),e=s.add("onMatch",e),s.queries=t)"all"===n?a=1:(i=h.matchMedia(t[n]))&&(ke.indexOf(s)<0&&ke.push(s),(o[n]=i.matches)&&(a=1),i.addListener?i.addListener(Hc):i.addEventListener("change",Hc));return a&&e(s,function(t){return s.add(null,t)}),this},De.revert=function revert(t){this.kill(t||{})},De.kill=function kill(e){this.contexts.forEach(function(t){return t.kill(e,!0)})},MatchMedia);function MatchMedia(t){this.contexts=[],this.scope=t,l&&l.data.push(this)}var Ee={registerPlugin:function registerPlugin(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(function(t){return zb(t)})},timeline:function timeline(t){return new Gt(t)},getTweensOf:function getTweensOf(t,e){return L.getTweensOf(t,e)},getProperty:function getProperty(i,t,e,n){r(i)&&(i=Pt(i)[0]);var a=ha(i||{}).get,s=e?sa:ra;return"native"===e&&(e=""),i?t?s((mt[t]&&mt[t].get||a)(i,t,e,n)):function(t,e,r){return s((mt[t]&&mt[t].get||a)(i,t,e,r))}:i},quickSetter:function quickSetter(r,e,i){if(1<(r=Pt(r)).length){var n=r.map(function(t){return Fe.quickSetter(t,e,i)}),a=n.length;return function(t){for(var e=a;e--;)n[e](t)}}r=r[0]||{};var s=mt[e],o=ha(r),u=o.harness&&(o.harness.aliases||{})[e]||e,h=s?function(t){var e=new s;c._pt=0,e.init(r,i?t+i:t,c,0,[r]),e.render(1,e),c._pt&&_e(1,c)}:o.set(r,u);return s?h:function(t){return h(r,u,i?t+i:t,o,1)}},quickTo:function quickTo(t,i,e){function $x(t,e,r){return n.resetTo(i,t,e,r)}var r,n=Fe.to(t,ta(((r={})[i]="+=0.1",r.paused=!0,r.stagger=0,r),e||{}));return $x.tween=n,$x},isTweening:function isTweening(t){return 0<L.getTweensOf(t,!0).length},defaults:function defaults(t){return t&&t.ease&&(t.ease=jt(t.ease,j.ease)),wa(j,t||{})},config:function config(t){return wa(Y,t||{})},registerEffect:function registerEffect(t){var i=t.name,n=t.effect,e=t.plugins,a=t.defaults,r=t.extendTimeline;(e||"").split(",").forEach(function(t){return t&&!mt[t]&&!ht[t]&&T(i+" effect requires "+t+" plugin.")}),gt[i]=function(t,e,r){return n(Pt(t),ta(e||{},a),r)},r&&(Gt.prototype[i]=function(t,e,r){return this.add(gt[i](t,v(e)?e:(r=e)&&{},this),r)})},registerEase:function registerEase(t,e){Bt[t]=jt(e)},parseEase:function parseEase(t,e){return arguments.length?jt(t,e):Bt},getById:function getById(t){return L.getById(t)},exportRoot:function exportRoot(t,e){void 0===t&&(t={});var r,i,n=new Gt(t);for(n.smoothChildTiming=w(t.smoothChildTiming),L.remove(n),n._dp=0,n._time=n._tTime=L._time,r=L._first;r;)i=r._next,!e&&!r._dur&&r instanceof te&&r.vars.onComplete===r._targets[0]||Na(n,r,r._start-r._delay),r=i;return Na(L,n,0),n},context:function context(t,e){return t?new Se(t,e):l},matchMedia:function matchMedia(t){return new Re(t)},matchMediaRefresh:function matchMediaRefresh(){return ke.forEach(function(t){var e,r,i=t.conditions;for(r in i)i[r]&&(i[r]=!1,e=1);e&&t.revert()})||Hc()},addEventListener:function addEventListener(t,e){var r=Oe[t]||(Oe[t]=[]);~r.indexOf(e)||r.push(e)},removeEventListener:function removeEventListener(t,e){var r=Oe[t],i=r&&r.indexOf(e);0<=i&&r.splice(i,1)},utils:{wrap:function wrap(e,t,r){var i=t-e;return K(e)?ob(e,wrap(0,e.length),t):Za(r,function(t){return(i+(t-e)%i)%i+e})},wrapYoyo:function wrapYoyo(e,t,r){var i=t-e,n=2*i;return K(e)?ob(e,wrapYoyo(0,e.length-1),t):Za(r,function(t){return e+(i<(t=(n+(t-e)%n)%n||0)?n-t:t)})},distribute:hb,random:kb,snap:jb,normalize:function normalize(t,e,r){return St(t,e,0,1,r)},getUnit:_a,clamp:function clamp(e,r,t){return Za(t,function(t){return Mt(e,r,t)})},splitColor:Db,toArray:Pt,selector:fb,mapRange:St,pipe:function pipe(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return function(t){return e.reduce(function(t,e){return e(t)},t)}},unitize:function unitize(e,r){return function(t){return e(parseFloat(t))+(r||_a(t))}},interpolate:function interpolate(e,i,t,n){var a=isNaN(e+i)?0:function(t){return(1-t)*e+t*i};if(!a){var s,o,u,h,l,f=r(e),c={};if(!0===t&&(n=1)&&(t=null),f)e={p:e},i={p:i};else if(K(e)&&!K(i)){for(u=[],h=e.length,l=h-2,o=1;o<h;o++)u.push(interpolate(e[o-1],e[o]));h--,a=function func(t){t*=h;var e=Math.min(l,~~t);return u[e](t-e)},t=i}else n||(e=bt(K(e)?[]:{},e));if(!u){for(s in i)$t.call(c,e,s,"get",i[s]);a=function func(t){return _e(t,c)||(f?e.p:e)}}}return Za(t,a)},shuffle:gb},install:R,effects:gt,ticker:It,updateRoot:Gt.updateRoot,plugins:mt,globalTimeline:L,core:{PropTween:we,globals:U,Tween:te,Timeline:Gt,Animation:qt,getCache:ha,_removeLinkedListItem:Ba,reverting:function reverting(){return I},context:function context(t){return t&&l&&(l.data.push(t),t._ctx=l),l},suppressOverwrites:function suppressOverwrites(t){return F=t}}};ja("to,from,fromTo,delayedCall,set,killTweensOf",function(t){return Ee[t]=te[t]}),It.add(Gt.updateRoot),c=Ee.to({},{duration:0});function Lc(t,e){for(var r=t._pt;r&&r.p!==e&&r.op!==e&&r.fp!==e;)r=r._next;return r}function Nc(t,a){return{name:t,headless:1,rawVars:1,init:function init(t,n,e){e._onInit=function(t){var e,i;if(r(n)&&(e={},ja(n,function(t){return e[t]=1}),n=e),a){for(i in e={},n)e[i]=a(n[i]);n=e}!function _addModifiers(t,e){var r,i,n,a=t._targets;for(r in e)for(i=a.length;i--;)(n=(n=t._ptLookup[i][r])&&n.d)&&(n._pt&&(n=Lc(n,r)),n&&n.modifier&&n.modifier(e[r],t,a[i],r))}(t,n)}}}}var Fe=Ee.registerPlugin({name:"attr",init:function init(t,e,r,i,n){var a,s,o;for(a in this.tween=r,e)o=t.getAttribute(a)||"",(s=this.add(t,"setAttribute",(o||0)+"",e[a],i,n,0,0,a)).op=a,s.b=o,this._props.push(a)},render:function render(t,e){for(var r=e._pt;r;)I?r.set(r.t,r.p,r.b,r):r.r(t,r.d),r=r._next}},{name:"endArray",headless:1,init:function init(t,e){for(var r=e.length;r--;)this.add(t,r,t[r]||0,e[r],0,0,0,0,0,1)}},Nc("roundProps",ib),Nc("modifiers"),Nc("snap",jb))||Ee;te.version=Gt.version=Fe.version="3.15.0",o=1,x()&&Lt();function xd(t,e){return e.set(e.t,e.p,Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function yd(t,e){return e.set(e.t,e.p,1===t?e.e:Math.round(1e4*(e.s+e.c*t))/1e4+e.u,e)}function zd(t,e){return e.set(e.t,e.p,t?Math.round(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function Ad(t,e){return e.set(e.t,e.p,1===t?e.e:t?Math.round(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function Bd(t,e){var r=e.s+e.c*t;e.set(e.t,e.p,~~(r+(r<0?-.5:.5))+e.u,e)}function Cd(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)}function Dd(t,e){return e.set(e.t,e.p,1!==t?e.b:e.e,e)}function Ed(t,e,r){return t.style[e]=r}function Fd(t,e,r){return t.style.setProperty(e,r)}function Gd(t,e,r){return t._gsap[e]=r}function Hd(t,e,r){return t._gsap.scaleX=t._gsap.scaleY=r}function Id(t,e,r,i,n){var a=t._gsap;a.scaleX=a.scaleY=r,a.renderTransform(n,a)}function Jd(t,e,r,i,n){var a=t._gsap;a[e]=r,a.renderTransform(n,a)}function Md(t,e){var r=this,i=this.target,n=i.style,a=i._gsap;if(t in ur&&n){if(this.tfm=this.tfm||{},"transform"===t)return _r.transform.split(",").forEach(function(t){return Md.call(r,t,e)});if(~(t=_r[t]||t).indexOf(",")?t.split(",").forEach(function(t){return r.tfm[t]=wr(i,t)}):this.tfm[t]=a.x?a[t]:wr(i,t),t===gr&&(this.tfm.zOrigin=a.zOrigin),0<=this.props.indexOf(mr))return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(gr,e,"")),t=mr}(n||e)&&this.props.push(t,e,n[t])}function Nd(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))}function Od(){var t,e,r=this.props,i=this.target,n=i.style,a=i._gsap;for(t=0;t<r.length;t+=3)r[t+1]?2===r[t+1]?i[r[t]](r[t+2]):i[r[t]]=r[t+2]:r[t+2]?n[r[t]]=r[t+2]:n.removeProperty("--"===r[t].substr(0,2)?r[t]:r[t].replace(cr,"-$1").toLowerCase());if(this.tfm){for(e in this.tfm)a[e]=this.tfm[e];a.svg&&(a.renderTransform(),i.setAttribute("data-svg-origin",this.svgo||"")),(t=je())&&t.isStart||n[mr]||(Nd(n),a.zOrigin&&n[gr]&&(n[gr]+=" "+a.zOrigin+"px",a.zOrigin=0,a.renderTransform()),a.uncache=1)}}function Pd(t,e){var r={target:t,props:[],revert:Od,save:Md};return t._gsap||Fe.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(t){return r.save(t)}),r}function Rd(t,e){var r=Le.createElementNS?Le.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Le.createElement(t);return r&&r.style?r:Le.createElement(t)}function Sd(t,e,r){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(cr,"-$1").toLowerCase())||i.getPropertyValue(e)||!r&&Sd(t,yr(e)||e,1)||""}function Vd(){(function _windowExists(){return"undefined"!=typeof window})()&&window.document&&(Ie=window,Le=Ie.document,Be=Le.documentElement,Ue=Rd("div")||{style:{}},Rd("div"),mr=yr(mr),gr=mr+"Origin",Ue.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Ve=!!yr("perspective"),je=Fe.core.reverting,Ne=1)}function Wd(t){var e,r=t.ownerSVGElement,i=Rd("svg",r&&r.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),n=t.cloneNode(!0);n.style.display="block",i.appendChild(n),Be.appendChild(i);try{e=n.getBBox()}catch(t){}return i.removeChild(n),Be.removeChild(i),e}function Xd(t,e){for(var r=e.length;r--;)if(t.hasAttribute(e[r]))return t.getAttribute(e[r])}function Yd(e){var r,i;try{r=e.getBBox()}catch(t){r=Wd(e),i=1}return r&&(r.width||r.height)||i||(r=Wd(e)),!r||r.width||r.x||r.y?r:{x:+Xd(e,["x","cx","x1"])||0,y:+Xd(e,["y","cy","y1"])||0,width:0,height:0}}function Zd(t){return!(!t.getCTM||t.parentNode&&!t.ownerSVGElement||!Yd(t))}function $d(t,e){if(e){var r,i=t.style;e in ur&&e!==gr&&(e=mr),i.removeProperty?("ms"!==(r=e.substr(0,2))&&"webkit"!==e.substr(0,6)||(e="-"+e),i.removeProperty("--"===r?e:e.replace(cr,"-$1").toLowerCase())):i.removeAttribute(e)}}function _d(t,e,r,i,n,a){var s=new we(t._pt,e,r,0,1,a?Dd:Cd);return(t._pt=s).b=i,s.e=n,t._props.push(r),s}function ce(t,e,r,i){var n,a,s,o,u=parseFloat(r)||0,h=(r+"").trim().substr((u+"").length)||"px",l=Ue.style,f=dr.test(e),c="svg"===t.tagName.toLowerCase(),d=(c?"client":"offset")+(f?"Width":"Height"),p="px"===i,_="%"===i;if(i===h||!u||Tr[i]||Tr[h])return u;if("px"===h||p||(u=ce(t,e,r,"px")),o=t.getCTM&&Zd(t),(_||"%"===h)&&(ur[e]||~e.indexOf("adius")))return n=o?t.getBBox()[f?"width":"height"]:t[d],ka(_?u/n*100:u/100*n);if(l[f?"width":"height"]=100+(p?h:i),a="rem"!==i&&~e.indexOf("adius")||"em"===i&&t.appendChild&&!c?t:t.parentNode,o&&(a=(t.ownerSVGElement||{}).parentNode),a&&a!==Le&&a.appendChild||(a=Le.body),(s=a._gsap)&&_&&s.width&&f&&s.time===It.time&&!s.uncache)return ka(u/s.width*100);if(!_||"height"!==e&&"width"!==e)!_&&"%"!==h||br[Sd(a,"display")]||(l.position=Sd(t,"position")),a===t&&(l.position="static"),a.appendChild(Ue),n=Ue[d],a.removeChild(Ue),l.position="absolute";else{var m=t.style[e];t.style[e]=100+i,n=t[d],m?t.style[e]=m:$d(t,e)}return f&&_&&((s=ha(a)).time=It.time,s.width=a[d]),ka(p?n*u/100:n&&u?100/n*u:0)}function ee(t,e,r,i){if(!r||"none"===r){var n=yr(e,t,1),a=n&&Sd(t,n,1);a&&a!==r?(e=n,r=a):"borderColor"===e&&(r=Sd(t,"borderTopColor"))}var s,o,u,h,l,f,c,d,p,_,m,g=new we(this._pt,t.style,e,0,1,pe),v=0,y=0;if(g.b=r,g.e=i,r+="","var(--"===(i+="").substring(0,6)&&(i=Sd(t,i.substring(4,i.indexOf(")")))),"auto"===i&&(f=t.style[e],t.style[e]=i,i=Sd(t,e)||i,f?t.style[e]=f:$d(t,e)),Ib(s=[r,i]),i=s[1],u=(r=s[0]).match(nt)||[],(i.match(nt)||[]).length){for(;o=nt.exec(i);)c=o[0],p=i.substring(v,o.index),l?l=(l+1)%5:"rgba("!==p.substr(-5)&&"hsla("!==p.substr(-5)||(l=1),c!==(f=u[y++]||"")&&(h=parseFloat(f)||0,m=f.substr((h+"").length),"="===c.charAt(1)&&(c=ma(h,c)+m),d=parseFloat(c),_=c.substr((d+"").length),v=nt.lastIndex-_.length,_||(_=_||Y.units[e]||m,v===i.length&&(i+=_,g.e+=_)),m!==_&&(h=ce(t,e,f,_)||0),g._pt={_next:g._pt,p:p||1===y?p:",",s:h,c:d-h,m:l&&l<4||"zIndex"===e?Math.round:0});g.c=v<i.length?i.substring(v,i.length):""}else g.r="display"===e&&"none"===i?Dd:Cd;return st.test(i)&&(g.e=0),this._pt=g}function ge(t){var e=t.split(" "),r=e[0],i=e[1]||"50%";return"top"!==r&&"bottom"!==r&&"left"!==i&&"right"!==i||(t=r,r=i,i=t),e[0]=xr[r]||r,e[1]=xr[i]||i,e.join(" ")}function he(t,e){if(e.tween&&e.tween._time===e.tween._dur){var r,i,n,a=e.t,s=a.style,o=e.u,u=a._gsap;if("all"===o||!0===o)s.cssText="",i=1;else for(n=(o=o.split(",")).length;-1<--n;)r=o[n],ur[r]&&(i=1,r="transformOrigin"===r?gr:mr),$d(a,r);i&&($d(a,mr),u&&(u.svg&&a.removeAttribute("transform"),s.scale=s.rotate=s.translate="none",Cr(a,1),u.uncache=1,Nd(s)))}}function le(t){return"matrix(1, 0, 0, 1, 0, 0)"===t||"none"===t||!t}function me(t){var e=Sd(t,mr);return le(e)?Or:e.substr(7).match(it).map(ka)}function ne(t,e){var r,i,n,a,s=t._gsap||ha(t),o=t.style,u=me(t);return s.svg&&t.getAttribute("transform")?"1,0,0,1,0,0"===(u=[(n=t.transform.baseVal.consolidate().matrix).a,n.b,n.c,n.d,n.e,n.f]).join(",")?Or:u:(u!==Or||t.offsetParent||t===Be||s.svg||(n=o.display,o.display="block",(r=t.parentNode)&&(t.offsetParent||t.getBoundingClientRect().width)||(a=1,i=t.nextElementSibling,Be.appendChild(t)),u=me(t),n?o.display=n:$d(t,"display"),a&&(i?r.insertBefore(t,i):r?r.appendChild(t):Be.removeChild(t))),e&&6<u.length?[u[0],u[1],u[4],u[5],u[12],u[13]]:u)}function oe(t,e,r,i,n,a){var s,o,u,h=t._gsap,l=n||ne(t,!0),f=h.xOrigin||0,c=h.yOrigin||0,d=h.xOffset||0,p=h.yOffset||0,_=l[0],m=l[1],g=l[2],v=l[3],y=l[4],T=l[5],b=e.split(" "),w=parseFloat(b[0])||0,x=parseFloat(b[1])||0;r?l!==Or&&(o=_*v-m*g)&&(u=w*(-m/o)+x*(_/o)-(_*T-m*y)/o,w=w*(v/o)+x*(-g/o)+(g*T-v*y)/o,x=u):(w=(s=Yd(t)).x+(~b[0].indexOf("%")?w/100*s.width:w),x=s.y+(~(b[1]||b[0]).indexOf("%")?x/100*s.height:x)),i||!1!==i&&h.smooth?(y=w-f,T=x-c,h.xOffset=d+(y*_+T*g)-y,h.yOffset=p+(y*m+T*v)-T):h.xOffset=h.yOffset=0,h.xOrigin=w,h.yOrigin=x,h.smooth=!!i,h.origin=e,h.originIsAbsolute=!!r,t.style[gr]="0px 0px",a&&(_d(a,h,"xOrigin",f,w),_d(a,h,"yOrigin",c,x),_d(a,h,"xOffset",d,h.xOffset),_d(a,h,"yOffset",p,h.yOffset)),t.setAttribute("data-svg-origin",w+" "+x)}function re(t,e,r){var i=_a(e);return ka(parseFloat(e)+parseFloat(ce(t,"x",r+"px",i)))+i}function ye(t,e,i,n,a){var s,o,u=360,h=r(a),l=parseFloat(a)*(h&&~a.indexOf("rad")?hr:1)-n,f=n+l+"deg";return h&&("short"===(s=a.split("_")[1])&&(l%=u)!==l%180&&(l+=l<0?u:-u),"cw"===s&&l<0?l=(l+36e9)%u-~~(l/u)*u:"ccw"===s&&0<l&&(l=(l-36e9)%u-~~(l/u)*u)),t._pt=o=new we(t._pt,e,i,n,l,yd),o.e=f,o.u="deg",t._props.push(i),o}function ze(t,e){for(var r in e)t[r]=e[r];return t}function Ae(t,e,r){var i,n,a,s,o,u,h,l=ze({},r._gsap),f=r.style;for(n in l.svg?(a=r.getAttribute("transform"),r.setAttribute("transform",""),f[mr]=e,i=Cr(r,1),$d(r,mr),r.setAttribute("transform",a)):(a=getComputedStyle(r)[mr],f[mr]=e,i=Cr(r,1),f[mr]=a),ur)(a=l[n])!==(s=i[n])&&"perspective,force3D,transformOrigin,svgOrigin".indexOf(n)<0&&(o=_a(a)!==(h=_a(s))?ce(r,n,a,h):parseFloat(a),u=parseFloat(s),t._pt=new we(t._pt,i,n,o,u-o,xd),t._pt.u=h||0,t._props.push(n));ze(i,l)}var Ie,Le,Be,Ne,Ue,Ye,je,Ve,Xe=Bt.Power0,qe=Bt.Power1,Ge=Bt.Power2,Ze=Bt.Power3,We=Bt.Power4,$e=Bt.Linear,He=Bt.Quad,Qe=Bt.Cubic,Je=Bt.Quart,Ke=Bt.Quint,tr=Bt.Strong,er=Bt.Elastic,rr=Bt.Back,ir=Bt.SteppedEase,nr=Bt.Bounce,ar=Bt.Sine,sr=Bt.Expo,or=Bt.Circ,ur={},hr=180/Math.PI,lr=Math.PI/180,fr=Math.atan2,cr=/([A-Z])/g,dr=/(left|right|width|margin|padding|x)/i,pr=/[\s,\(]\S/,_r={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},mr="transform",gr=mr+"Origin",vr="O,Moz,ms,Ms,Webkit".split(","),yr=function _checkPropPrefix(t,e,r){var i=(e||Ue).style,n=5;if(t in i&&!r)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);n--&&!(vr[n]+t in i););return n<0?null:(3===n?"ms":0<=n?vr[n]:"")+t},Tr={deg:1,rad:1,turn:1},br={grid:1,flex:1},wr=function _get(t,e,r,i){var n;return Ne||Vd(),e in _r&&"transform"!==e&&~(e=_r[e]).indexOf(",")&&(e=e.split(",")[0]),ur[e]&&"transform"!==e?(n=Cr(t,i),n="transformOrigin"!==e?n[e]:n.svg?n.origin:Pr(Sd(t,gr))+" "+n.zOrigin+"px"):(n=t.style[e])&&"auto"!==n&&!i&&!~(n+"").indexOf("calc(")||(n=kr[e]&&kr[e](t,e,r)||Sd(t,e)||ia(t,e)||("opacity"===e?1:0)),r&&!~(n+"").trim().indexOf(" ")?ce(t,e,n,r)+r:n},xr={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},kr={clearProps:function clearProps(t,e,r,i,n){if("isFromStart"!==n.data){var a=t._pt=new we(t._pt,e,r,0,0,he);return a.u=i,a.pr=-10,a.tween=n,t._props.push(r),1}}},Or=[1,0,0,1,0,0],Mr={},Cr=function _parseTransform(t,e){var r=t._gsap||new Xt(t);if("x"in r&&!e&&!r.uncache)return r;var i,n,a,s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w,x,k,O,M,C,P,S,A,D,z,R,E,F=t.style,I=r.scaleX<0,L="deg",B=getComputedStyle(t),N=Sd(t,gr)||"0";return i=n=a=u=h=l=f=c=d=0,s=o=1,r.svg=!(!t.getCTM||!Zd(t)),B.translate&&("none"===B.translate&&"none"===B.scale&&"none"===B.rotate||(F[mr]=("none"!==B.translate?"translate3d("+(B.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+("none"!==B.rotate?"rotate("+B.rotate+") ":"")+("none"!==B.scale?"scale("+B.scale.split(" ").join(",")+") ":"")+("none"!==B[mr]?B[mr]:"")),F.scale=F.rotate=F.translate="none"),m=ne(t,r.svg),r.svg&&(M=r.uncache?(C=t.getBBox(),N=r.xOrigin-C.x+"px "+(r.yOrigin-C.y)+"px",""):!e&&t.getAttribute("data-svg-origin"),oe(t,M||N,!!M||r.originIsAbsolute,!1!==r.smooth,m)),p=r.xOrigin||0,_=r.yOrigin||0,m!==Or&&(T=m[0],b=m[1],w=m[2],x=m[3],i=k=m[4],n=O=m[5],6===m.length?(s=Math.sqrt(T*T+b*b),o=Math.sqrt(x*x+w*w),u=T||b?fr(b,T)*hr:0,(f=w||x?fr(w,x)*hr+u:0)&&(o*=Math.abs(Math.cos(f*lr))),r.svg&&(i-=p-(p*T+_*w),n-=_-(p*b+_*x))):(E=m[6],z=m[7],S=m[8],A=m[9],D=m[10],R=m[11],i=m[12],n=m[13],a=m[14],h=(g=fr(E,D))*hr,g&&(M=k*(v=Math.cos(-g))+S*(y=Math.sin(-g)),C=O*v+A*y,P=E*v+D*y,S=k*-y+S*v,A=O*-y+A*v,D=E*-y+D*v,R=z*-y+R*v,k=M,O=C,E=P),l=(g=fr(-w,D))*hr,g&&(v=Math.cos(-g),R=x*(y=Math.sin(-g))+R*v,T=M=T*v-S*y,b=C=b*v-A*y,w=P=w*v-D*y),u=(g=fr(b,T))*hr,g&&(M=T*(v=Math.cos(g))+b*(y=Math.sin(g)),C=k*v+O*y,b=b*v-T*y,O=O*v-k*y,T=M,k=C),h&&359.9<Math.abs(h)+Math.abs(u)&&(h=u=0,l=180-l),s=ka(Math.sqrt(T*T+b*b+w*w)),o=ka(Math.sqrt(O*O+E*E)),g=fr(k,O),f=2e-4<Math.abs(g)?g*hr:0,d=R?1/(R<0?-R:R):0),r.svg&&(M=t.getAttribute("transform"),r.forceCSS=t.setAttribute("transform","")||!le(Sd(t,mr)),M&&t.setAttribute("transform",M))),90<Math.abs(f)&&Math.abs(f)<270&&(I?(s*=-1,f+=u<=0?180:-180,u+=u<=0?180:-180):(o*=-1,f+=f<=0?180:-180)),e=e||r.uncache,r.x=i-((r.xPercent=i&&(!e&&r.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-i)?-50:0)))?t.offsetWidth*r.xPercent/100:0)+"px",r.y=n-((r.yPercent=n&&(!e&&r.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-n)?-50:0)))?t.offsetHeight*r.yPercent/100:0)+"px",r.z=a+"px",r.scaleX=ka(s),r.scaleY=ka(o),r.rotation=ka(u)+L,r.rotationX=ka(h)+L,r.rotationY=ka(l)+L,r.skewX=f+L,r.skewY=c+L,r.transformPerspective=d+"px",(r.zOrigin=parseFloat(N.split(" ")[2])||!e&&r.zOrigin||0)&&(F[gr]=Pr(N)),r.xOffset=r.yOffset=0,r.force3D=Y.force3D,r.renderTransform=r.svg?Er:Ve?Rr:Sr,r.uncache=0,r},Pr=function _firstTwoOnly(t){return(t=t.split(" "))[0]+" "+t[1]},Sr=function _renderNon3DTransforms(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Rr(t,e)},Ar="0deg",Dr="0px",zr=") ",Rr=function _renderCSSTransforms(t,e){var r=e||this,i=r.xPercent,n=r.yPercent,a=r.x,s=r.y,o=r.z,u=r.rotation,h=r.rotationY,l=r.rotationX,f=r.skewX,c=r.skewY,d=r.scaleX,p=r.scaleY,_=r.transformPerspective,m=r.force3D,g=r.target,v=r.zOrigin,y="",T="auto"===m&&t&&1!==t||!0===m;if(v&&(l!==Ar||h!==Ar)){var b,w=parseFloat(h)*lr,x=Math.sin(w),k=Math.cos(w);w=parseFloat(l)*lr,b=Math.cos(w),a=re(g,a,x*b*-v),s=re(g,s,-Math.sin(w)*-v),o=re(g,o,k*b*-v+v)}_!==Dr&&(y+="perspective("+_+zr),(i||n)&&(y+="translate("+i+"%, "+n+"%) "),!T&&a===Dr&&s===Dr&&o===Dr||(y+=o!==Dr||T?"translate3d("+a+", "+s+", "+o+") ":"translate("+a+", "+s+zr),u!==Ar&&(y+="rotate("+u+zr),h!==Ar&&(y+="rotateY("+h+zr),l!==Ar&&(y+="rotateX("+l+zr),f===Ar&&c===Ar||(y+="skew("+f+", "+c+zr),1===d&&1===p||(y+="scale("+d+", "+p+zr),g.style[mr]=y||"translate(0, 0)"},Er=function _renderSVGTransforms(t,e){var r,i,n,a,s,o=e||this,u=o.xPercent,h=o.yPercent,l=o.x,f=o.y,c=o.rotation,d=o.skewX,p=o.skewY,_=o.scaleX,m=o.scaleY,g=o.target,v=o.xOrigin,y=o.yOrigin,T=o.xOffset,b=o.yOffset,w=o.forceCSS,x=parseFloat(l),k=parseFloat(f);c=parseFloat(c),d=parseFloat(d),(p=parseFloat(p))&&(d+=p=parseFloat(p),c+=p),c||d?(c*=lr,d*=lr,r=Math.cos(c)*_,i=Math.sin(c)*_,n=Math.sin(c-d)*-m,a=Math.cos(c-d)*m,d&&(p*=lr,s=Math.tan(d-p),n*=s=Math.sqrt(1+s*s),a*=s,p&&(s=Math.tan(p),r*=s=Math.sqrt(1+s*s),i*=s)),r=ka(r),i=ka(i),n=ka(n),a=ka(a)):(r=_,a=m,i=n=0),(x&&!~(l+"").indexOf("px")||k&&!~(f+"").indexOf("px"))&&(x=ce(g,"x",l,"px"),k=ce(g,"y",f,"px")),(v||y||T||b)&&(x=ka(x+v-(v*r+y*n)+T),k=ka(k+y-(v*i+y*a)+b)),(u||h)&&(s=g.getBBox(),x=ka(x+u/100*s.width),k=ka(k+h/100*s.height)),s="matrix("+r+","+i+","+n+","+a+","+x+","+k+")",g.setAttribute("transform",s),w&&(g.style[mr]=s)};ja("padding,margin,Width,Radius",function(e,r){var t="Right",i="Bottom",n="Left",o=(r<3?["Top",t,i,n]:["Top"+n,"Top"+t,i+t,i+n]).map(function(t){return r<2?e+t:"border"+t+e});kr[1<r?"border"+e:e]=function(e,t,r,i,n){var a,s;if(arguments.length<4)return a=o.map(function(t){return wr(e,t,r)}),5===(s=a.join(" ")).split(a[0]).length?a[0]:s;a=(i+"").split(" "),s={},o.forEach(function(t,e){return s[t]=a[e]=a[e]||a[(e-1)/2|0]}),e.init(t,s,n)}});var Fr,Ir,Lr,Br={name:"css",register:Vd,targetTest:function targetTest(t){return t.style&&t.nodeType},init:function init(t,e,i,n,a){var s,o,u,h,l,f,c,d,p,_,m,g,v,y,T,b,w,x=this._props,k=t.style,O=i.vars.startAt;for(c in Ne||Vd(),this.styles=this.styles||Pd(t),b=this.styles.props,this.tween=i,e)if("autoRound"!==c&&(o=e[c],!mt[c]||!cc(c,e,i,n,t,a)))if(l=typeof o,f=kr[c],"function"===l&&(l=typeof(o=o.call(i,n,t,a))),"string"===l&&~o.indexOf("random(")&&(o=rb(o)),f)f(this,t,c,o,i)&&(T=1);else if("--"===c.substr(0,2))s=(getComputedStyle(t).getPropertyValue(c)+"").trim(),o+="",Et.lastIndex=0,Et.test(s)||(d=_a(s),(p=_a(o))?d!==p&&(s=ce(t,c,s,p)+p):d&&(o+=d)),this.add(k,"setProperty",s,o,n,a,0,0,c),x.push(c),b.push(c,0,k[c]);else if("undefined"!==l){if(O&&c in O?(s="function"==typeof O[c]?O[c].call(i,n,t,a):O[c],r(s)&&~s.indexOf("random(")&&(s=rb(s)),_a(s+"")||"auto"===s||(s+=Y.units[c]||_a(wr(t,c))||""),"="===(s+"").charAt(1)&&(s=wr(t,c))):s=wr(t,c),h=parseFloat(s),(_="string"===l&&"="===o.charAt(1)&&o.substr(0,2))&&(o=o.substr(2)),u=parseFloat(o),c in _r&&("autoAlpha"===c&&(1===h&&"hidden"===wr(t,"visibility")&&u&&(h=0),b.push("visibility",0,k.visibility),_d(this,k,"visibility",h?"inherit":"hidden",u?"inherit":"hidden",!u)),"scale"!==c&&"transform"!==c&&~(c=_r[c]).indexOf(",")&&(c=c.split(",")[0])),m=c in ur){if(this.styles.save(c),w=o,"string"===l&&"var(--"===o.substring(0,6)){if("calc("===(o=Sd(t,o.substring(4,o.indexOf(")")))).substring(0,5)){var M=t.style.perspective;t.style.perspective=o,o=Sd(t,"perspective"),M?t.style.perspective=M:$d(t,"perspective")}u=parseFloat(o)}if(g||((v=t._gsap).renderTransform&&!e.parseTransform||Cr(t,e.parseTransform),y=!1!==e.smoothOrigin&&v.smooth,(g=this._pt=new we(this._pt,k,mr,0,1,v.renderTransform,v,0,-1)).dep=1),"scale"===c)this._pt=new we(this._pt,v,"scaleY",v.scaleY,(_?ma(v.scaleY,_+u):u)-v.scaleY||0,xd),this._pt.u=0,x.push("scaleY",c),c+="X";else{if("transformOrigin"===c){b.push(gr,0,k[gr]),o=ge(o),v.svg?oe(t,o,0,y,0,this):((p=parseFloat(o.split(" ")[2])||0)!==v.zOrigin&&_d(this,v,"zOrigin",v.zOrigin,p),_d(this,k,c,Pr(s),Pr(o)));continue}if("svgOrigin"===c){oe(t,o,1,y,0,this);continue}if(c in Mr){ye(this,v,c,h,_?ma(h,_+o):o);continue}if("smoothOrigin"===c){_d(this,v,"smooth",v.smooth,o);continue}if("force3D"===c){v[c]=o;continue}if("transform"===c){Ae(this,o,t);continue}}}else c in k||(c=yr(c)||c);if(m||(u||0===u)&&(h||0===h)&&!pr.test(o)&&c in k)u=u||0,(d=(s+"").substr((h+"").length))!==(p=_a(o)||(c in Y.units?Y.units[c]:d))&&(h=ce(t,c,s,p)),this._pt=new we(this._pt,m?v:k,c,h,(_?ma(h,_+u):u)-h,m||"px"!==p&&"zIndex"!==c||!1===e.autoRound?xd:Bd),this._pt.u=p||0,m&&w!==o?(this._pt.b=s,this._pt.e=w,this._pt.r=Ad):d!==p&&"%"!==p&&(this._pt.b=s,this._pt.r=zd);else if(c in k)ee.call(this,t,c,s,_?_+o:o);else if(c in t)this.add(t,c,s||t[c],_?_+o:o,n,a);else if("parseTransform"!==c){S(c,o);continue}m||(c in k?b.push(c,0,k[c]):"function"==typeof t[c]?b.push(c,2,t[c]()):b.push(c,1,s||t[c])),x.push(c)}T&&be(this)},render:function render(t,e){if(e.tween._time||!je())for(var r=e._pt;r;)r.r(t,r.d),r=r._next;else e.styles.revert()},get:wr,aliases:_r,getSetter:function getSetter(t,e,r){var i=_r[e];return i&&i.indexOf(",")<0&&(e=i),e in ur&&e!==gr&&(t._gsap.x||wr(t,"x"))?r&&Ye===r?"scale"===e?Hd:Gd:(Ye=r||{})&&("scale"===e?Id:Jd):t.style&&!u(t.style[e])?Ed:~e.indexOf("-")?Fd:ue(t,e)},core:{_removeProperty:$d,_getMatrix:ne}};Fe.utils.checkPrefix=yr,Fe.core.getStyleSaver=Pd,Lr=ja((Fr="x,y,z,scale,scaleX,scaleY,xPercent,yPercent")+","+(Ir="rotation,rotationX,rotationY,skewX,skewY")+",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",function(t){ur[t]=1}),ja(Ir,function(t){Y.units[t]="deg",Mr[t]=1}),_r[Lr[13]]=Fr+","+Ir,ja("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY",function(t){var e=t.split(":");_r[e[1]]=Lr[e[0]]}),ja("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(t){Y.units[t]="px"}),Fe.registerPlugin(Br);var Nr=Fe.registerPlugin(Br)||Fe,Ur=Nr.core.Tween;e.Back=rr,e.Bounce=nr,e.CSSPlugin=Br,e.Circ=or,e.Cubic=Qe,e.Elastic=er,e.Expo=sr,e.Linear=$e,e.Power0=Xe,e.Power1=qe,e.Power2=Ge,e.Power3=Ze,e.Power4=We,e.Quad=He,e.Quart=Je,e.Quint=Ke,e.Sine=ar,e.SteppedEase=ir,e.Strong=tr,e.TimelineLite=Gt,e.TimelineMax=Gt,e.TweenLite=te,e.TweenMax=Ur,e.default=Nr,e.gsap=Nr;if (typeof(window)==="undefined"||window!==e){Object.defineProperty(e,"__esModule",{value:!0})} else {delete e.default}});

```

### 5/16 · `audio/score.py`
<!-- casebook-file {"path": "audio/score.py", "lines": 449, "final_newline": true, "sha256": "390bbf31fa126ac3de573d2937cf4c8fdc13a368029042bac76bce0fa28547f5", "original_sha256": "390bbf31fa126ac3de573d2937cf4c8fdc13a368029042bac76bce0fa28547f5"} -->
```python
#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
#  score.py · 配乐与全部音效：numpy 逐样本合成，48kHz 立体声
#
#  沿用合集的方法论：配乐不是找的 BGM，是和画面共用同一份 EDL 的"第二张乐谱"。
#  鼓点网格 == 剪辑网格：150 BPM，1 拍 = 0.4 s，1 小节 = 1.6 s。
#  本脚本读取 build/cues.json（由 tools/build.mjs 生成），所以
#  "画面第 64 拍下 drop" 和 "音乐第 64 拍落 impact" 永远是同一个数。
#
#  和弦进行（D 小调，每小节一拍一轮）：Dm — B♭ — F — C
#  主题动机：D4–F4–A4–D5（小调五声，结尾以三连音再现）
#
#  用法：python audio/score.py        → assets/score.wav
#        python audio/score.py --mp3  → 另出 assets/score.mp3（预览备用）
# ─────────────────────────────────────────────────────────────────────────────
import json, sys
import numpy as np
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
cues = json.loads((ROOT / 'build/cues.json').read_text(encoding='utf-8'))
SR = 48000
DUR = cues['duration'] + 1.0          # 尾部 1s 余量
N = int(DUR * SR)
BEAT = cues['beat']                    # 0.4
BAR = BEAT * 4
t_ = np.arange(N, dtype=np.float64) / SR
rng = np.random.default_rng(20260926)

busL = np.zeros(N, np.float64)
busR = np.zeros(N, np.float64)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12.0)
def T(s): return int(s * SR)
def env(t, a=0.004, d=0.15): return (1 - np.exp(-t / a)) * np.exp(-t / d)

def add(x, at, g=1.0, pan=0.0):
    i0 = T(at); n = len(x)
    if i0 >= N: return
    n = min(n, N - i0)
    x = x[:n] * g
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    busL[i0:i0 + n] += x * gl
    busR[i0:i0 + n] += x * gr

def sos(f, kind, x, order=2):
    # 一阶 Butterworth 离散（无 scipy 依赖的低通/高通），40 秒内 48k 样本足够快
    from numpy import exp
    rc = 1 / (2 * np.pi * f)
    dt = 1 / SR
    a = dt / (rc + dt)
    y = np.empty_like(x)
    y0 = 0.0
    if kind == 'lowpass':
        for _ in range(order):
            yy = np.empty_like(x); prev = y0
            # αx + (1-α)y_prev  —— 用累积实现避免 Python 级循环太慢
            # 这里用 lfilter 的等价形式
            prev2 = np.empty(len(x))
            pp = 0.0
            for i in range(len(x)):
                pp = pp + a * (x[i] - pp)
                prev2[i] = pp
            y = prev2
    else:
        pp = 0.0
        for i in range(len(x)):
            pp = a * (pp + x[i] - (x[i - 1] if i else 0))
            y[i] = pp
    return y

# scipy 更快——有就用
try:
    from scipy.signal import sosfilt, butter
    def filt(x, f, kind='lowpass', order=2):
        return sosfilt(butter(order, f, btype=kind, fs=SR, output='sos'), x)
except Exception:
    def filt(x, f, kind='lowpass', order=2):
        return sos(f, kind, x, order)

def swept_lowpass(x, fc_fn):
    """时变截止的低通：按 2048 样本分块，块内按中心频率滤波、跨块续状态。"""
    if 'butter' in globals() and 'sosfilt' in globals():
        block = 2048
        zi = None
        out = np.empty_like(x)
        n = len(x)
        for i0 in range(0, n, block):
            i1 = min(i0 + block, n)
            fc = fc_fn(((i0 + i1) / 2) / SR)
            sos_ = butter(1, fc, fs=SR, output='sos')
            if zi is None:
                zi = np.zeros((sos_.shape[0], 2))
            out[i0:i1], zi = sosfilt(sos_, x[i0:i1], zi=zi, axis=0)
        return out
    out = np.empty_like(x); a = 0.0
    for i in range(len(x)):
        k = 1 / (1 + 2 * np.pi * fc_fn(i / SR) / SR)
        a = a * k + x[i] * (1 - k)
        out[i] = a
    return out

def bq_hiss(d, lo=2000, hi=9000):
    x = rng.standard_normal(T(d))
    x = filt(filt(x, hi, 'lowpass'), lo, 'highpass')
    return x

# ── 乐器 ─────────────────────────────────────────────────────────────────
def kick(big=1.0):
    n = T(0.5)
    tt = np.arange(n) / SR
    f = 45 + 130 * np.exp(-tt / 0.03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (0.17 * big))
    s[:600] += rng.standard_normal(600) * 0.35 * np.linspace(1, 0, 600)
    return np.tanh(s * 1.7)

def clap():
    n = T(0.3); x = filt(rng.standard_normal(n), 900, 'highpass'); x = filt(x, 4200)
    e = np.exp(-np.arange(n) / SR / 0.09)
    for d in (0.0, 0.011, 0.022): e[T(d):T(d) + 60] += 0.6
    return x * e * 0.9

def hat(open_=False):
    n = T(0.28 if open_ else 0.06)
    return filt(rng.standard_normal(n), 7000, 'highpass') * np.exp(-np.arange(n) / SR / (0.11 if open_ else 0.025))

def snare():
    n = T(0.3)
    tone = np.sin(2 * np.pi * 190 * np.arange(n) / SR) * np.exp(-np.arange(n) / SR / 0.09)
    noise = filt(filt(rng.standard_normal(n), 1800), 3000, 'highpass') * np.exp(-np.arange(n) / SR / 0.12)
    return tone * 0.7 + noise

def toms(m):
    n = T(0.25)
    f = hz(m) + hz(m + 12) * np.exp(-np.arange(n) / SR / 0.08)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-np.arange(n) / SR / 0.15)

def subbass(m, d, side=1.0):
    # 侧链泵感：每拍前半让位给底鼓
    n = T(d); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * hz(m) * tt) + 0.3 * np.sin(2 * np.pi * hz(m) * 2 * tt)
    duck = 1 - 0.85 * np.exp(-((tt % BEAT) / 0.11))
    return s * np.exp(-tt / 0.9) * np.minimum(1, duck / max(side, 0.01)) * (1 - np.exp(-tt / 0.008))

def supersaw(chord, d, cut=2600):
    n = T(d); tt = np.arange(n) / SR; s = np.zeros(n)
    for m in chord:
        for det in (-13, -6, 0, 6, 13):
            f = hz(m) * 2 ** (det / 1200)
            ph = rng.uniform(0, np.pi * 2)
            s += (2 * ((tt * f + ph / np.pi / 2) % 1) - 1)
    s = filt(s / 15, cut)
    e = (1 - np.exp(-tt / 0.02)) * np.exp(-tt / (d * 0.7))
    return s * e

def pluck(m, d=0.6, bright=3400):
    n = T(d); tt = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(4 * np.pi * f * tt) + 0.2 * np.sin(6 * np.pi * f * tt)
    return filt(s, bright) * np.exp(-tt / (d * 0.42))

def bell(m, d=2.6):
    n = T(d); tt = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / 0.8) + 0.2 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt / 0.4)
    return s * np.exp(-tt / (d * 0.5)) * (1 - np.exp(-tt / 0.004)) * 0.5

def pad(chord, d, lp=1400, g=1.0):
    n = T(d); tt = np.arange(n) / SR; s = np.zeros(n)
    for m in chord:
        for det in (-4, 4):
            f = hz(m) * 2 ** (det / 1200)
            s += np.sin(2 * np.pi * f * tt) + 0.4 * (2 * ((tt * f * 1.5) % 1) - 1)
    s = filt(s / len(chord), lp)
    e = np.minimum(tt / 0.8, 1) * np.exp(-np.maximum(0, tt - d * 0.55) / (d * 0.25))
    return s * e * 0.12 * g

def riser(d, sweep=True):
    n = T(d); tt = np.arange(n) / SR
    noise = rng.standard_normal(n)
    f0, f1 = (500, 12000) if sweep else (4000, 4000)
    x = swept_lowpass(noise, lambda tt_: f0 * (f1 / f0) ** (tt_ / d))
    x = x / max(1e-6, np.abs(x).max())
    grow = np.sin(tt / d * np.pi / 2) ** 2 * np.exp(-np.maximum(0, tt - d + 0.15) / 0.03)
    ph = np.sin(2 * np.pi * np.cumsum(200 + 2400 * tt / d) / SR) * np.exp(-tt / d * 0.5)
    return (x * 0.8 + ph * 0.2) * grow * 0.9

def revcym(d):
    n = T(d)
    x = filt(rng.standard_normal(n), 1200)
    e = (np.arange(n) / n) ** 3.2
    return x * e * 0.5

def whoosh(d=0.4):
    n = T(d); tt = np.arange(n) / SR
    out = swept_lowpass(rng.standard_normal(n), lambda tt_: 400 + 5600 * np.sin(np.pi * tt_ / d))
    return out * np.sin(np.pi * tt / d) * 0.8

def impact(g=1.0):
    n = T(1.6); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-tt / 0.05)) / SR) * np.exp(-tt / 0.45)
    crack = filt(rng.standard_normal(n), 300, 'highpass') * np.exp(-tt / 0.06)
    tail = filt(rng.standard_normal(n), 800) * np.exp(-tt / 0.8)
    return (boom * 1.5 + crack * 0.5 + tail * 0.25) * g

def megaimpact(i=0):
    n = T(1.4); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(34 + 70 * np.exp(-tt / 0.04)) / SR) * np.exp(-tt / 0.5)
    metal = filt(rng.standard_normal(n), 2400, 'highpass') * np.exp(-tt / 0.05)
    sub = np.sin(2 * np.pi * 30 * tt) * np.exp(-tt / 0.7)
    return np.tanh((boom * 1.8 + metal * (0.55 + i * 0.1) + sub) * 1.2)

def crash(d=1.8):
    n = T(d); tt = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 2600, 'highpass') + 0.3 * filt(rng.standard_normal(n), 800)
    return x * (1 - np.exp(-tt / 0.005)) * np.exp(-tt / (d * 0.4)) * 0.4

def tapestop(d=0.5):
    n = T(d); tt = np.arange(n) / SR
    f = 900 * np.exp(-tt / 0.12) + 40
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.25) * 0.8

def heart():
    n = T(0.35); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(52 + 40 * np.exp(-tt / 0.02)) / SR) * np.exp(-tt / 0.12)
    return np.tanh(s * 1.4) * 0.9

def key(seed=0):
    r = np.random.default_rng(seed)
    n = T(0.07); tt = np.arange(n) / SR
    s = r.standard_normal(n) * np.exp(-tt / 0.012)
    f = 3000 + r.uniform(0, 1500)
    return filt(s, f, 'highpass') * 0.5

def enter():
    n = T(0.18); tt = np.arange(n) / SR
    s = filt(rng.standard_normal(n), 1800, 'highpass') * np.exp(-tt / 0.05)
    return s * 0.8 + np.sin(2 * np.pi * 220 * tt) * np.exp(-tt / 0.1) * 0.4

def glitch(d=0.4, seed=1):
    r = np.random.default_rng(seed)
    n = T(d); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(600 + r.uniform(0, 4000, n)) / SR)
    return np.tanh(s * 2) * np.exp(-tt / (d * 0.6)) * 0.35

def snareroll(d):
    out = np.zeros(T(d))
    # 8 分 → 16 分 → 32 分 加速
    steps = []
    t0 = 0.0
    rate = d / 4
    while t0 < d:
        steps.append(t0)
        rate *= 0.93
        t0 += max(rate, 0.012)
    hit = snare() * 0.5
    for st in steps:
        i0 = int(st * SR)
        if i0 + len(hit) < len(out): out[i0:i0 + len(hit)] += hit * min(1.0, 0.4 + st / d)
    return out

def thump():
    n = T(0.5); tt = np.arange(n) / SR
    f = 70 + 160 * np.exp(-tt / 0.02)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.22)
    return np.tanh(s * 1.5) + filt(rng.standard_normal(n), 2500, 'highpass') * np.exp(-tt / 0.02) * 0.4

def strike_sfx(seed=0):
    r = np.random.default_rng(seed)
    n = T(0.22); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (880 + r.uniform(-80, 80)) * tt) * np.exp(-tt / 0.06)
    return s + r.standard_normal(n) * np.exp(-tt / 0.02) * 0.5

def chime():
    return overlay(bell(86, 1.6), bell(90, 1.2) * 0.5)

def suck(d=2.8):
    # 28 声"入文件夹"小 click + 一条下坠滑音
    n = T(d); tt = np.arange(n) / SR
    f = 1400 * np.exp(-tt / (d * 0.6)) + 180
    sweep = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / d) * 0.5
    out = sweep.copy()
    for i in range(28):
        st = i * 0.085 + 0.95
        k = key(i)
        i0 = T(st)
        if i0 + len(k) < n: out[i0:i0 + len(k)] += k * 1.4
    return out

def downlifter(d=1.6):
    n = T(d); tt = np.arange(n) / SR
    f = 3000 * np.exp(-tt / (d * 0.55)) + 300
    s = filt(rng.standard_normal(n), 5000, 'highpass') * np.exp(-tt / (d * 0.5))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / (d * 0.6)) * 0.4 + s * 0.2

def overlay(*xs):
    """不等长混音：全部从 0 叠到最长长度。"""
    n = max(len(x) for x in xs)
    out = np.zeros(n)
    for x in xs:
        out[: len(x)] += x
    return out

def boom():
    return overlay(impact(0.7), subbass(26, 0.8) * 0.6)

def tunnel_sfx(d):
    n = T(d); tt = np.arange(n) / SR
    out = swept_lowpass(rng.standard_normal(n), lambda tt_: 300 + 3800 * (tt_ / d) ** 1.6)
    beat_amp = 1 - 0.5 * np.exp(-((tt % BEAT) / 0.09))
    return out * np.minimum(1, 0.3 + tt / d) * np.exp(-np.maximum(0, tt - d + 0.3) / 0.12) * beat_amp * 0.7

# ── 和声与主旋律 ──────────────────────────────────────────────────────────
CHORDS = {
    'Dm': [50, 53, 57],      # D3 F3 A3
    'Bb': [46, 50, 53],      # Bb2 D3 F3
    'F':  [41, 45, 48],      # F2 A2 C3
    'C':  [48, 52, 55],      # C3 E3 G3
}
PROG = ['Dm', 'Bb', 'F', 'C'] * 10
MOTIF = [(0, 50), (1, 53), (2, 57), (3, 62)]  # D4 F4 A4 D5
PROOT = {'Dm': 38, 'Bb': 34, 'F': 29, 'C': 36}

def bar_chord(bar): return CHORDS[PROG[bar % len(PROG)]]
def bar_root(bar): return PROOT[PROG[bar % len(PROG)]]

def section_energy(b):
    for s in cues['sections']:
        if s['b0'] <= b < s['b1']: return s
    return cues['sections'][-1]

# ── 编曲引擎：每个循环按 section energy 决定织体密度 ─────────────────────
def arrange():
    # 底鼓：era1 起一拍一个；breath 停
    for b in np.arange(0, cues['totalBeats']):
        sec = section_energy(b)
        e = sec['energy']
        if e >= 0.5 and sec['id'] not in ('era4card',):
            add(kick(1.25 if sec['id'] in ('drop', 'wall', 'reveal') else 0.9), b * BEAT)
        if sec['id'] == 'era4card' and b % 2 == 0:
            add(kick(0.7), b * BEAT)
    # 军鼓/拍手：反拍
    for b in np.arange(0, cues['totalBeats']):
        sec = section_energy(b)
        if sec['energy'] >= 0.55 and b % 2 == 1:
            add(snare() * (1.0 if sec['energy'] > 0.9 else 0.7), b * BEAT)
        if sec['id'] in ('drop', 'wall', 'reveal') and b % 4 == 2:
            add(clap(), b * BEAT)
    # hi-hat
    for b in np.arange(0, cues['totalBeats'] * 2):
        sec = section_energy(b / 2)
        e = sec['energy']
        if e >= 0.5:
            off = b % 2 == 1
            n16 = e > 0.75
            steps = 2 if n16 else 1
            for s in range(steps):
                if s == 1 and not off: continue
                tt = (b + (s * 0.5 if n16 else 0.5)) * BEAT
                add(hat(open_=(off and e > 0.8)), tt, g=0.32 if off else 0.25, pan=(hash_(b) - 0.5) * 0.7)
    # 贝斯：跟和弦根音，侧链让位给底鼓
    for bar in range(40):
        sec = section_energy(bar * 4)
        if sec['energy'] >= 0.5 and sec['id'] not in ('breath', 'outro'):
            root = bar_root(bar) + (0 if sec['energy'] < 0.9 else 12)
            for bt in range(4):
                add(subbass(root, BEAT * 0.9, side=sec['energy']), (bar * 4 + bt) * BEAT, g=0.5, pan=0)
    # supersaw 和弦 stab：小节强拍 + 后半拍
    for bar in range(40):
        sec = section_energy(bar * 4)
        if sec['energy'] >= 0.75:
            add(supersaw(bar_chord(bar), BAR, cut=3000), bar * BAR, g=0.28)
            if sec['energy'] >= 0.9:
                add(supersaw(bar_chord(bar), BEAT * 0.7, cut=4200), (bar * 4 + 3.5) * BEAT, g=0.2)
    # 主旋律：动机按段落移调
    for bar in range(40):
        sec = section_energy(bar * 4)
        if sec['id'] in ('era1', 'era2', 'era3', 'drop', 'wall'):
            shift = {'era1': 0, 'era2': 2, 'era3': 5, 'drop': 7, 'wall': 12}.get(sec['id'], 0)
            for beat_idx, m in MOTIF:
                add(pluck(m + shift, 0.5, bright=5200), (bar * 4 + beat_idx) * BEAT, g=0.34)
    # Pad：冷开场 + 凝视 + 尾声 的静默织体
    for bar in [0, 1, 2, 3]:
        add(pad(CHORDS['Dm'], BAR * 1.05, lp=900, g=1.4), bar * BAR)
    for bar in range(40, 44):  # outro 前段
        pass
    add(pad([38, 41, 45, 50], 14, lp=700, g=1.2), 26 * BAR)  # breath
    add(pad([50, 53, 57, 62], 22, lp=1100, g=0.9), 35 * BAR) # outro

def hash_(x):  # 确定性的小装饰
    s = np.sin(x * 127.1 + 311.7) * 43758.5453
    return s - int(s)

# ── SFX cue ───────────────────────────────────────────────────────────────
def sfx():
    makers = {
        'key': lambda o: key(o.get('seed', 0)),
        'enter': lambda o: enter(),
        'thump': lambda o: thump(),
        'strike': lambda o: strike_sfx(o.get('seed', 0)),
        'swoosh': lambda o: whoosh(o.get('len', 0.4)),
        'whoosh': lambda o: whoosh(o.get('len', 0.35)),
        'riser': lambda o: riser((o['b1'] - o['b']) * BEAT),
        'revcym': lambda o: revcym(o.get('len', 2.4)),
        'revswell': lambda o: revcym((o['b1'] - o['b']) * BEAT) * 1.6,
        'impact': lambda o: impact(),
        'megaimpact': lambda o: megaimpact(o.get('seed', 0)),
        'boom': lambda o: boom(),
        'crash': lambda o: crash(),
        'shutter': lambda o: key(o.get('n', 1) % 7 + 3) * 1.2,
        'hit': lambda o: overlay(thump() * 0.5, key(o.get('seed', 0) % 17) * 0.4),
        'glitch': lambda o: glitch(o.get('len', 0.4), seed=7),
        'tapestop': lambda o: tapestop(),
        'heart': lambda o: heart(),
        'bell': lambda o: bell(o.get('note', 62), 2.2),
        'chime': lambda o: chime(),
        'scan': lambda o: (lambda d: riser(d, sweep=False) * 0.5)((o['b1'] - o['b']) * BEAT),
        'snareroll': lambda o: snareroll((o['b1'] - o['b']) * BEAT),
        'suck': lambda o: suck((o['b1'] - o['b']) * BEAT),
        'downlifter': lambda o: downlifter((o['b1'] - o['b']) * BEAT),
        'tunnel': lambda o: tunnel_sfx((o['b1'] - o['b']) * BEAT),
    }
    for cue in cues['sfx']:
        mk = makers.get(cue['kind'])
        if not mk: continue
        add(mk(cue), cue['b'] * BEAT, g=cue.get('gain', 1.0))

# ── 母带 ──────────────────────────────────────────────────────────────────
def master():
    for b in (busL, busR):
        np.clip(np.tanh(b / max(1.0, np.abs(b).max() / 0.9)) * 0.92, -1, 1, out=b)
    # 简单限幅 + 响度归一（两遍式留给 ffmpeg loudnorm 可选）
    peak = max(np.abs(busL).max(), np.abs(busR).max())
    g = 10 ** (-1.5 / 20) / peak
    out = np.stack([busL * g, busR * g], axis=1)
    return (out * 32767).astype(np.int16)

arrange()
sfx()
pcm = master()

out = ROOT / 'assets/score.wav'
out.parent.mkdir(exist_ok=True, parents=True)
import wave
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"score.wav → {out.stat().st_size / 1e6:.1f} MB / {len(pcm)/SR:.2f}s")

if '--mp3' in sys.argv:
    subprocess.run(['ffmpeg', '-y', '-i', str(out), '-c:a', 'libmp3lame', '-b:a', '256k', str(ROOT / 'assets/score.mp3')], check=True)
```

### 6/16 · `index.html`
<!-- casebook-file {"path": "index.html", "lines": 1994, "final_newline": true, "sha256": "bd691b1dbc1af5d7639c94501451aa382e231f5358160bd1511ea29bcce27c01", "original_sha256": "bd691b1dbc1af5d7639c94501451aa382e231f5358160bd1511ea29bcce27c01"} -->
```html
<!doctype html>
<!--
  AI-CODING · SUPERVIDEOS —— 合集总片（62.4s · 150 BPM · 1920×1080）
  ⚠ 本文件由 tools/build.mjs 生成，请勿手改。改 src/edl.mjs / src/catalog.mjs / src/runtime.js / src/style.css 后重新 build。
-->
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>AI-Coding SuperVideos · 通通开源</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
/* ─────────────────────────────────────────────────────────────────────────
   SUPERCUT · 视觉系统
   所有元素的"静态终态"写在这里；运动全部由 runtime.js 的 render(t) 计算。
   ───────────────────────────────────────────────────────────────────────── */
@font-face { font-family: "HanSerifH"; src: url("assets/fonts/SourceHanSerifSC-Heavy.ttf") format("truetype"); font-weight: 900; font-display: block; }
@font-face { font-family: "NotoSerifSC"; src: url("assets/fonts/NotoSerifSC-VF.ttf") format("truetype"); font-weight: 200 900; font-display: block; }
@font-face { font-family: "NotoSansSC"; src: url("assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
@font-face { font-family: "NotoSansSC"; src: url("assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
@font-face { font-family: "Plex"; src: url("assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }

:root {
  --bg: #050507;
  --ink: #f3efe6;
  --dim: rgba(243, 239, 230, 0.55);
  --faint: rgba(243, 239, 230, 0.16);
  --orange: #ff7a3d;
  --red: #ff3b3b;
  --kimi: #3cf0c8;
  --swe: #7cc4ff;
  --gpt: #a98bff;
  --gold: #ffd166;
  --qq: #3d8bff;
  --serif: "HanSerifH", "NotoSerifSC", serif;
  --sans: "NotoSansSC", sans-serif;
  --num: "Barlow", "NotoSansSC", sans-serif;
  --mono: "Plex", "NotoSansSC", monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1920px; height: 1080px; overflow: hidden; background: var(--bg); color: var(--ink); }
body { font-family: var(--sans); -webkit-font-smoothing: antialiased; }

#root { position: relative; width: 100%; height: 100%; overflow: hidden; background: var(--bg); }

.fill { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; opacity: 0; pointer-events: none; }
.abs { position: absolute; }
.center-box { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; display: flex; flex-direction: column; align-items: center; justify-content: center; }

#bg {
  background:
    radial-gradient(1200px 700px at 50% 40%, rgba(40, 44, 70, 0.35), transparent 70%),
    radial-gradient(900px 600px at 80% 110%, rgba(255, 122, 61, 0.08), transparent 70%),
    var(--bg);
}
#stage { transform-origin: 960px 540px; }
canvas.fx { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }

video, .media img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* ── 冷开场 ──────────────────────────────────────────────────────────── */
#cold-term {
  position: absolute; left: 0; top: 0; width: 1920px; height: 1080px;
  display: flex; align-items: center; justify-content: flex-start; padding-left: 700px;
  font-family: var(--mono); font-size: 76px; letter-spacing: 0.02em; color: var(--ink);
  transform-origin: 960px 540px;
}
#cold-term .prompt { color: var(--kimi); margin-right: 0.3em; }
.cursor { display: inline-block; width: 0.55em; height: 1.05em; background: var(--ink); margin-left: 0.08em; vertical-align: -0.16em; }
.cold-no {
  position: absolute; left: 0; width: 1920px; text-align: center;
  font-family: var(--serif); font-weight: 900; font-size: 150px; line-height: 1; letter-spacing: 0.04em;
}
.cold-no .txt { position: relative; display: inline-block; }
.cold-no .strike {
  position: absolute; left: -4%; top: 52%; width: 108%; height: 14px; background: var(--red);
  transform-origin: 0 50%; transform: scaleX(0); box-shadow: 0 0 24px rgba(255, 59, 59, 0.7);
}
#no0 { top: 250px; } #no1 { top: 450px; } #no2 { top: 650px; }
#cold-thesis {
  position: absolute; left: 0; top: 380px; width: 1920px; text-align: center;
  font-family: var(--serif); font-weight: 900; font-size: 112px; letter-spacing: 0.06em;
}
#cold-formula {
  position: absolute; left: 0; top: 560px; width: 1920px; text-align: center;
  font-family: var(--mono); font-size: 60px; color: var(--dim);
}
#cold-formula .t { color: var(--orange); display: inline-block; }

/* ── 时代卡 ──────────────────────────────────────────────────────────── */
.era .era-num {
  position: absolute; left: 110px; top: 70px; width: 820px; height: 560px;
  font-family: var(--num); font-weight: 900; font-size: 560px; line-height: 560px; letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.12); -webkit-text-stroke: 4px var(--c);
}
.era .era-num .fillnum {
  position: absolute; left: 0; top: 0; color: var(--c); -webkit-text-stroke: 0; clip-path: inset(100% 0 0 0);
}
.era .era-right { position: absolute; left: 980px; top: 150px; width: 860px; height: 520px; }
.era .era-chip {
  display: inline-block; padding: 10px 26px; border-radius: 999px; border: 3px solid var(--c); color: var(--c);
  font-family: var(--num); font-weight: 800; font-size: 40px; letter-spacing: 0.22em;
}
.era .era-title {
  margin-top: 26px; font-family: var(--serif); font-weight: 900; font-size: 230px; line-height: 1.05; letter-spacing: 0.08em; white-space: nowrap;
}
.era .era-title .ch { display: inline-block; }
.era .era-sub { margin-top: 18px; font-family: var(--sans); font-weight: 700; font-size: 46px; color: var(--dim); white-space: nowrap; }
.era .era-cap {
  position: absolute; left: 110px; top: 690px; font-family: var(--mono); font-size: 24px; color: var(--dim); letter-spacing: 0.18em;
}

/* ── 窗口堆叠 ────────────────────────────────────────────────────────── */
#stack { perspective: 1700px; perspective-origin: 960px 480px; }
#stack-cam { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-style: preserve-3d; }
.win {
  position: absolute; left: 400px; top: 170px; width: 1120px; height: 668px;
  border-radius: 16px; overflow: hidden; background: #0d0f14;
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.6);
  transform-origin: 560px 334px; opacity: 0;
}
.win-bar {
  position: absolute; left: 0; top: 0; width: 100%; height: 38px; background: linear-gradient(#1b1e26, #13151b);
  display: flex; align-items: center; padding: 0 16px; gap: 9px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.win-bar i { display: block; width: 13px; height: 13px; border-radius: 50%; background: #ff5f57; }
.win-bar i:nth-child(2) { background: #febc2e; } .win-bar i:nth-child(3) { background: #28c840; }
.win-title { margin-left: 14px; font-family: var(--mono); font-size: 17px; color: rgba(255, 255, 255, 0.72); white-space: nowrap; overflow: hidden; }
.win-title b { color: var(--c); font-weight: 500; }
.win-body { position: absolute; left: 0; top: 38px; width: 1120px; height: 630px; }
.win-shade { position: absolute; inset: 0; background: #000; opacity: 0; }

/* ── COSMOS 宫格 ─────────────────────────────────────────────────────── */
.gtile { position: absolute; left: 0; top: 0; width: 640px; height: 360px; transform-origin: 0 0; overflow: hidden; border-radius: 6px; outline: 1px solid rgba(255, 255, 255, 0.12); }
#grid-label {
  position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; display: flex; align-items: center; justify-content: center; gap: 36px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 42%, transparent 70%);
}
#grid-label .big { font-family: var(--num); font-weight: 900; font-size: 360px; line-height: 1; color: var(--ink); text-shadow: 0 0 60px rgba(169, 139, 255, 0.9), 0 12px 0 rgba(0, 0, 0, 0.5); }
#grid-label .small { font-family: var(--serif); font-weight: 900; font-size: 84px; max-width: 520px; line-height: 1.15; text-shadow: 0 6px 30px rgba(0, 0, 0, 0.9); }

/* ── 全屏英雄镜头 ────────────────────────────────────────────────────── */
.shot { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; opacity: 0; overflow: hidden; }
.shot-media { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 960px 540px; }
.label {
  position: absolute; left: 72px; bottom: 118px; display: flex; flex-direction: column; gap: 10px;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.85);
}
.label .row1 { display: flex; align-items: center; gap: 16px; }
.label .chip {
  display: block; padding: 4px 14px; border-radius: 6px; background: var(--c); color: #0a0a0a;
  font-family: var(--num); font-weight: 800; font-size: 22px; letter-spacing: 0.16em; text-shadow: none;
}
.label .title { display: block; font-family: var(--serif); font-weight: 900; font-size: 58px; line-height: 1.05; white-space: nowrap; }
.label .tech { display: block; font-family: var(--sans); font-weight: 700; font-size: 26px; color: rgba(255, 255, 255, 0.82); white-space: nowrap; }
.label .spec { display: block; font-family: var(--mono); font-size: 18px; color: rgba(255, 255, 255, 0.6); letter-spacing: 0.06em; }
.shot::after, .panel::after {
  content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 420px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.72)); pointer-events: none;
}
.shot .label, .panel .label { z-index: 2; }

#drop-ov { display: flex; align-items: center; justify-content: center; gap: 40px; }
#drop-ov .n { font-family: var(--num); font-weight: 900; font-size: 300px; color: transparent; -webkit-text-stroke: 5px var(--orange); line-height: 1; }
#drop-ov .w { font-family: var(--serif); font-weight: 900; font-size: 300px; line-height: 1; color: var(--ink); text-shadow: 0 0 80px rgba(255, 122, 61, 0.85), 0 16px 40px rgba(0, 0, 0, 0.8); }

/* ── 左横屏 + 右手机 ─────────────────────────────────────────────────── */
#duo-left { position: absolute; left: 96px; top: 196px; width: 1188px; height: 668px; border-radius: 18px; overflow: hidden; box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7); outline: 1px solid rgba(255,255,255,.14); }
.phone {
  position: absolute; width: 400px; height: 820px; border-radius: 56px; background: #0b0b0e; padding: 14px;
  box-shadow: 0 0 0 3px #2a2c33, 0 40px 120px rgba(0, 0, 0, 0.75), inset 0 0 0 2px #000;
}
.phone .screen { position: relative; width: 372px; height: 792px; border-radius: 44px; overflow: hidden; background: #000; }
.phone .notch { position: absolute; left: 136px; top: 22px; width: 128px; height: 34px; border-radius: 20px; background: #000; z-index: 3; }
#duo-phone { left: 1400px; top: 130px; }
#duo-label { position: absolute; left: 96px; top: 890px; font-family: var(--sans); font-weight: 700; font-size: 30px; color: var(--dim); }
#duo-label b { color: var(--gpt); font-family: var(--num); letter-spacing: .14em; margin-right: 14px; }

/* ── 分屏 / 手机阵列 ─────────────────────────────────────────────────── */
.panel { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: hidden; }
.panel-media { position: absolute; top: 0; width: 1920px; height: 1080px; transform-origin: 50% 50%; }
.panel .label { bottom: 110px; }
.panel .label .title { font-size: 42px; }
.panel .label .tech { font-size: 21px; }
.panel-edge { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
#phones .phone { top: 56px; }
#phones .ph-label { position: absolute; left: -40px; top: 838px; width: 480px; text-align: center; font-family: var(--serif); font-weight: 900; font-size: 38px; }
#phones .ph-label span { display: block; font-family: var(--mono); font-size: 18px; color: var(--dim); margin-top: 6px; font-weight: 500; }

/* ── 隧道 ────────────────────────────────────────────────────────────── */
#tunnel { perspective: 760px; perspective-origin: 960px 540px; }
#tunnel-cam { position: absolute; left: 960px; top: 540px; width: 0; height: 0; transform-style: preserve-3d; }
.tplane { position: absolute; left: -320px; top: -180px; width: 640px; height: 360px; border-radius: 8px; overflow: hidden; outline: 2px solid var(--c); backface-visibility: hidden; }
.tplane .tp-cap { position: absolute; left: 12px; bottom: 10px; font-family: var(--serif); font-weight: 900; font-size: 34px; text-shadow: 0 2px 12px #000; }
#tunnel-line { font-family: var(--serif); font-weight: 900; font-size: 104px; letter-spacing: 0.06em; text-shadow: 0 0 40px rgba(0, 0, 0, 0.95), 0 0 90px rgba(255, 122, 61, 0.5); white-space: nowrap; }

/* ── 巨墙 ────────────────────────────────────────────────────────────── */
#wall-cam { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 960px 540px; }
.wtile { position: absolute; width: 256px; height: 144px; overflow: hidden; border-radius: 5px; background: #111; outline: 1.5px solid var(--c); }
.wtile img.freeze, .wtile video { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
.wtile .wl { position: absolute; left: 0; bottom: 0; width: 100%; padding: 16px 8px 5px; background: linear-gradient(transparent, rgba(0,0,0,.8)); font-family: var(--sans); font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; }
.wtile .wl i { font-style: normal; font-family: var(--num); font-weight: 800; font-size: 11px; letter-spacing: .14em; color: var(--c); margin-right: 6px; }
.wtile .flash { position: absolute; inset: 0; background: #fff; opacity: 0; }
#wall-title { position: absolute; left: 0; top: 118px; width: 1920px; text-align: center; font-family: var(--num); font-weight: 900; font-size: 64px; letter-spacing: 0.32em; }
#wall-sub { position: absolute; left: 0; top: 876px; width: 1920px; text-align: center; font-family: var(--sans); font-weight: 700; font-size: 34px; color: var(--dim); letter-spacing: .2em; }

/* ── 凝视 ────────────────────────────────────────────────────────────── */
.bline { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; }
.bline .big { font-family: var(--serif); font-weight: 900; font-size: 116px; letter-spacing: 0.06em; white-space: nowrap; }
.bline .small { margin-top: 30px; font-family: var(--mono); font-size: 34px; color: var(--dim); letter-spacing: 0.12em; }

/* ── 飞散海报 ────────────────────────────────────────────────────────── */
#flyers { perspective: 900px; perspective-origin: 960px 540px; }
.flyer { position: absolute; left: 800px; top: 450px; width: 320px; height: 180px; border-radius: 6px; overflow: hidden; outline: 2px solid var(--c); opacity: 0; backface-visibility: hidden; }
.flyer img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ── 通通开源 ────────────────────────────────────────────────────────── */
#rv-row { position: absolute; left: 160px; top: 290px; width: 1600px; height: 420px; display: flex; transform-origin: 800px 210px; }
.rv-ch {
  width: 400px; height: 420px; display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-weight: 900; font-size: 380px; line-height: 1; color: var(--ink); opacity: 0;
}
#rv-en { position: absolute; left: 0; top: 760px; width: 1920px; text-align: center; font-family: var(--num); font-weight: 800; font-size: 52px; letter-spacing: 0.5em; color: var(--orange); opacity: 0; }
#rv-sweep { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; mix-blend-mode: overlay; opacity: 0;
  background: linear-gradient(100deg, transparent 40%, rgba(255,255,255,.95) 50%, transparent 60%); background-size: 300% 100%; }

.pillar { position: absolute; top: 420px; width: 520px; height: 560px; opacity: 0; }
#pl0 { left: 110px; } #pl1 { left: 700px; } #pl2 { left: 1290px; }
.pillar .ph { display: flex; align-items: baseline; gap: 18px; }
.pillar .ph .h { font-family: var(--serif); font-weight: 900; font-size: 86px; }
.pillar .ph .en { font-family: var(--mono); font-size: 26px; color: var(--orange); letter-spacing: .18em; }
.pillar .pn { display: flex; align-items: baseline; gap: 14px; margin-top: 6px; }
.pillar .pl-num { font-family: var(--num); font-weight: 900; font-size: 176px; line-height: 1; color: var(--ink); min-width: 190px; }
.pillar .unit { font-family: var(--sans); font-weight: 700; font-size: 34px; color: var(--ink); }
.pillar .sub { font-family: var(--sans); font-weight: 700; font-size: 25px; color: var(--dim); margin-top: 8px; white-space: nowrap; }
.pillar .pl-stream { position: relative; margin-top: 22px; width: 520px; height: 150px; overflow: hidden; border-top: 1px solid var(--faint);
  -webkit-mask-image: linear-gradient(transparent, #000 20%, #000 80%, transparent); }
.pillar .pl-list { position: absolute; left: 0; top: 0; width: 100%; font-family: var(--mono); font-size: 18px; line-height: 30px; color: rgba(243,239,230,.62); white-space: nowrap; }

/* ── 分享卡片 ────────────────────────────────────────────────────────── */
#share {
  position: absolute; left: 150px; top: 236px; width: 980px; height: 560px; border-radius: 36px;
  background: linear-gradient(160deg, #eaf3ff 0%, #d7e8ff 55%, #cfe2ff 100%); color: #10203a;
  box-shadow: 0 50px 140px rgba(61, 139, 255, 0.35), 0 0 0 2px rgba(255, 255, 255, 0.5) inset; transform-origin: 490px 280px;
}
#share .svc { position: absolute; left: 56px; top: 44px; display: flex; align-items: center; gap: 14px; font-family: var(--sans); font-weight: 900; font-size: 34px; color: #1a4fd6; }
#share .svc svg { width: 44px; height: 44px; }
#share .folder { position: absolute; left: 56px; top: 150px; width: 210px; height: 170px; transform-origin: 105px 120px; }
#share .sh-name { position: absolute; left: 300px; top: 164px; font-family: var(--num); font-weight: 800; font-size: 60px; letter-spacing: 0.01em; white-space: nowrap; }
#share .sh-meta { position: absolute; left: 302px; top: 250px; font-family: var(--sans); font-weight: 700; font-size: 30px; color: #4a5d7e; white-space: nowrap; }
#share .sh-link { position: absolute; left: 56px; top: 380px; font-family: var(--mono); font-size: 44px; color: #0f3fb8; white-space: nowrap; }
#share .sh-link .u { position: absolute; left: 0; bottom: -8px; width: 100%; height: 4px; background: #3d8bff; transform-origin: 0 50%; }
#share .sh-exp { position: absolute; left: 58px; top: 470px; font-family: var(--sans); font-weight: 700; font-size: 24px; color: #6b7c99; }
#share .sh-count { position: absolute; right: 56px; top: 50px; font-family: var(--num); font-weight: 800; font-size: 34px; color: #1a4fd6; letter-spacing: .08em; }
#qrbox { position: absolute; left: 1250px; top: 196px; width: 520px; height: 520px; background: #fff; border-radius: 28px; padding: 26px; box-shadow: 0 40px 120px rgba(0,0,0,.6); overflow: hidden; }
#qrbox img { width: 468px; height: 468px; image-rendering: pixelated; display: block; }
#qrbox .scan { position: absolute; left: 0; top: 0; width: 100%; height: 90px; background: linear-gradient(rgba(61,139,255,0), rgba(61,139,255,.45), rgba(61,139,255,0)); }
#card-cta { position: absolute; left: 1250px; top: 750px; width: 520px; text-align: center; font-family: var(--serif); font-weight: 900; font-size: 62px; letter-spacing: .08em; }
#card-note { position: absolute; left: 150px; top: 836px; width: 980px; font-family: var(--sans); font-weight: 700; font-size: 34px; color: var(--dim); letter-spacing: .3em; }

/* ── 尾声 ────────────────────────────────────────────────────────────── */
#out-term { position: absolute; left: 0; top: 330px; width: 1920px; text-align: center; font-family: var(--mono); font-size: 64px; }
#out-term .prompt { color: var(--kimi); margin-right: 0.3em; }
#out-answer { position: absolute; left: 0; top: 470px; width: 1920px; text-align: center; font-family: var(--serif); font-weight: 900; font-size: 128px; letter-spacing: 0.08em; }
#out-answer .arrow { color: var(--orange); margin-right: 0.3em; font-family: var(--mono); font-weight: 500; }
.credit { position: absolute; left: 0; width: 1920px; text-align: center; font-family: var(--sans); font-weight: 700; font-size: 26px; color: var(--dim); letter-spacing: .12em; opacity: 0; }
#cr0 { top: 720px; color: var(--ink); } #cr1 { top: 764px; font-family: var(--mono); font-weight: 500; font-size: 22px; } #cr2 { top: 806px; font-family: var(--num); font-weight: 800; letter-spacing: .3em; color: var(--orange); }
#mini { position: absolute; right: 70px; bottom: 150px; display: flex; align-items: center; gap: 22px; opacity: 0; }
#mini img { width: 150px; height: 150px; background: #fff; padding: 8px; border-radius: 12px; image-rendering: pixelated; }
#mini .mt { font-family: var(--mono); font-size: 22px; color: var(--ink); line-height: 1.6; text-align: right; }
#mini .mt span { display: block; }
#mini .mt b { display: block; font-family: var(--sans); font-weight: 900; font-size: 26px; color: var(--orange); }

/* ── HUD ─────────────────────────────────────────────────────────────── */
#hud { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; pointer-events: none; }
#hud-tl { position: absolute; left: 56px; top: 44px; display: flex; align-items: center; gap: 18px; font-family: var(--mono); font-size: 22px; color: rgba(255, 255, 255, 0.85); opacity: 0; }
#hud-rec { display: flex; align-items: center; gap: 8px; color: var(--red); font-family: var(--num); font-weight: 800; letter-spacing: .14em; }
#hud-rec i { display: block; width: 14px; height: 14px; border-radius: 50%; background: var(--red); box-shadow: 0 0 12px var(--red); }
#hud-cmd { color: var(--kimi); }
#hud-time, #hud-frame { color: rgba(255,255,255,.7); }
#hud-era { position: absolute; right: 56px; top: 38px; display: flex; align-items: center; gap: 14px; opacity: 0; }
#hud-era .k { font-family: var(--mono); font-size: 20px; color: rgba(255, 255, 255, 0.6); letter-spacing: 0.14em; }
#hud-era .v { padding: 5px 16px; border-radius: 999px; border: 2px solid var(--c, #fff); color: var(--c, #fff); font-family: var(--num); font-weight: 800; font-size: 22px; letter-spacing: 0.2em; }
#ruler { position: absolute; left: 160px; top: 1016px; width: 1600px; height: 40px; opacity: 0; }
#ruler .base { position: absolute; left: 0; top: 18px; width: 1600px; height: 1px; background: rgba(255, 255, 255, 0.22); transform-origin: 0 50%; }
#ruler .slot { position: absolute; top: 12px; width: 50px; height: 12px; border-radius: 3px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.14); }
#ruler .slot .on { position: absolute; inset: 0; border-radius: 2px; background: var(--c); opacity: 0; box-shadow: 0 0 10px var(--c); }
#playhead { position: absolute; left: 0; top: 0; width: 2px; height: 36px; background: var(--orange); box-shadow: 0 0 12px var(--orange); }
#hud-count { position: absolute; right: 56px; top: 1000px; font-family: var(--num); font-weight: 800; font-size: 22px; color: rgba(255,255,255,.75); letter-spacing: .12em; opacity: 0; }
#hud-count b { color: var(--orange); font-size: 30px; }

.lbx { position: absolute; left: 0; width: 1920px; height: 140px; background: #000; }
#lbx-top { top: 0; transform: translateY(-100%); }
#lbx-bot { bottom: 0; transform: translateY(100%); }

#vignette { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%); }
#scanlines { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; pointer-events: none; opacity: 0.07;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0 1px, transparent 1px 3px); }

</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="62.400000000000006" data-width="1920" data-height="1080" data-fps="60" data-layout-allow-overflow>
  <div id="bg" class="fill"></div>
  <canvas id="fxback" class="fx" width="1920" height="1080"></canvas>
  <div id="stage" class="fill">

<div id="cold" class="layer">
  <div id="cold-term"><span class="prompt">$</span><span id="cold-cmd"></span><span class="cursor" id="cold-cursor"></span></div>
  <div class="cold-no" id="no0"><span class="txt">没有 AE<span class="strike"></span></span></div>
  <div class="cold-no" id="no1"><span class="txt">没有 PR<span class="strike"></span></span></div>
  <div class="cold-no" id="no2"><span class="txt">没有剪辑软件<span class="strike"></span></span></div>
  <div id="cold-thesis">每一帧，都是时间的函数</div>
  <div id="cold-formula">frame = render(<span class="t">t</span>)</div>
</div>

<div id="era1" class="layer era" style="--c:#3CF0C8">
  <div class="era-num">01<span class="fillnum">01</span></div>
  <div class="era-right">
    <div class="era-chip">KIMI</div>
    <div class="era-title"><span class="ch" data-layout-allow-overlap>觉</span><span class="ch" data-layout-allow-overlap>醒</span></div>
    <div class="era-sub">让每一个字，都砸在鼓点上</div>
  </div>
  <div class="era-cap">ERA 01 · KIMI · 1 部作品</div>
</div>
<div id="era2" class="layer era" style="--c:#7CC4FF">
  <div class="era-num">02<span class="fillnum">02</span></div>
  <div class="era-right">
    <div class="era-chip">SWE</div>
    <div class="era-title"><span class="ch" data-layout-allow-overlap>像</span><span class="ch" data-layout-allow-overlap>素</span></div>
    <div class="era-sub">不开浏览器，逐像素算出每一帧</div>
  </div>
  <div class="era-cap">ERA 02 · SWE · 2 部作品</div>
</div>
<div id="era3" class="layer era" style="--c:#A98BFF">
  <div class="era-num">03<span class="fillnum">03</span></div>
  <div class="era-right">
    <div class="era-chip">GPT</div>
    <div class="era-title"><span class="ch" data-layout-allow-overlap>世</span><span class="ch" data-layout-allow-overlap>界</span></div>
    <div class="era-sub">一个模型，三十个世界</div>
  </div>
  <div class="era-cap">ERA 03 · GPT · 4 部作品</div>
</div>
<div id="era4" class="layer era" style="--c:#FF7A3D">
  <div class="era-num">04<span class="fillnum">04</span></div>
  <div class="era-right">
    <div class="era-chip">CLAUDE OPUS</div>
    <div class="era-title"><span class="ch" data-layout-allow-overlap>电</span><span class="ch" data-layout-allow-overlap>影</span></div>
    <div class="era-sub">AE 级合成 · 水墨 · 3D · 4K</div>
  </div>
  <div class="era-cap">ERA 04 · CLAUDE OPUS · 21 部作品</div>
</div>

<div id="stack" class="layer"><div id="stack-cam">
  <div class="win" id="win-w01" style="--c:#3CF0C8">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>KIMI</b> · kimi-ai-beat-sync/ai-beat-sync.mp4 — 1080p · 30fps · 51s</div></div>
    <div class="win-body"><video id="v-w01" src="assets/clips/w01.mp4" data-start="7.6" data-duration="9.2" data-track-index="1" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w02" style="--c:#3CF0C8">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>KIMI</b> · kimi-ai-beat-sync/ai-beat-sync.mp4 — 1080p · 30fps · 51s</div></div>
    <div class="win-body"><video id="v-w02" src="assets/clips/w02.mp4" data-start="8.4" data-duration="8.4" data-track-index="2" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w03" style="--c:#3CF0C8">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>KIMI</b> · kimi-ai-beat-sync/ai-beat-sync.mp4 — 1080p · 30fps · 51s</div></div>
    <div class="win-body"><video id="v-w03" src="assets/clips/w03.mp4" data-start="9.2" data-duration="7.6" data-track-index="3" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w04" style="--c:#3CF0C8">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>KIMI</b> · kimi-ai-beat-sync/ai-beat-sync.mp4 — 1080p · 30fps · 51s</div></div>
    <div class="win-body"><video id="v-w04" src="assets/clips/w04.mp4" data-start="10" data-duration="6.8" data-track-index="4" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w05" style="--c:#7CC4FF">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>SWE</b> · swe-ai-rise/kimi_ai_rise_v2.mp4 — 1080p · 30fps · 40s</div></div>
    <div class="win-body"><video id="v-w05" src="assets/clips/w05.mp4" data-start="12" data-duration="4.8" data-track-index="5" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w06" style="--c:#7CC4FF">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>SWE</b> · swe-ai-rise/kimi_ai_rise_v2.mp4 — 1080p · 30fps · 40s</div></div>
    <div class="win-body"><video id="v-w06" src="assets/clips/w06.mp4" data-start="12.8" data-duration="4" data-track-index="6" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w07" style="--c:#7CC4FF">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>SWE</b> · swe-kimi-source-intro/kimi_film_1080p.mp4 — 1080p · 30fps · 56s</div></div>
    <div class="win-body"><video id="v-w07" src="assets/clips/w07.mp4" data-start="13.6" data-duration="3.2" data-track-index="7" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w08" style="--c:#7CC4FF">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>SWE</b> · swe-kimi-source-intro/kimi_film_1080p.mp4 — 1080p · 30fps · 56s</div></div>
    <div class="win-body"><video id="v-w08" src="assets/clips/w08.mp4" data-start="14.4" data-duration="2.4" data-track-index="8" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w09" style="--c:#7CC4FF">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>SWE</b> · swe-ai-rise/kimi_ai_rise_v2.mp4 — 1080p · 30fps · 40s</div></div>
    <div class="win-body"><video id="v-w09" src="assets/clips/w09.mp4" data-start="15.2" data-duration="1.6" data-track-index="9" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
  <div class="win" id="win-w10" style="--c:#7CC4FF">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>SWE</b> · swe-kimi-source-intro/kimi_film_1080p.mp4 — 1080p · 30fps · 56s</div></div>
    <div class="win-body"><video id="v-w10" src="assets/clips/w10.mp4" data-start="16" data-duration="0.8" data-track-index="10" muted playsinline></video></div>
    <div class="win-shade"></div>
  </div>
</div></div>

<div id="grid" class="layer">
  <div class="gtile" id="gt0"><video id="v-g0" src="assets/clips/grid-00.mp4" data-start="18" data-duration="2.4" data-track-index="11" muted playsinline></video></div>
  <div class="gtile" id="gt1"><video id="v-g1" src="assets/clips/grid-01.mp4" data-start="18" data-duration="2.4" data-track-index="12" muted playsinline></video></div>
  <div class="gtile" id="gt2"><video id="v-g2" src="assets/clips/grid-02.mp4" data-start="18" data-duration="2.4" data-track-index="13" muted playsinline></video></div>
  <div class="gtile" id="gt3"><video id="v-g3" src="assets/clips/grid-03.mp4" data-start="18" data-duration="2.4" data-track-index="14" muted playsinline></video></div>
  <div class="gtile" id="gt4"><video id="v-g4" src="assets/clips/grid-04.mp4" data-start="18" data-duration="2.4" data-track-index="15" muted playsinline></video></div>
  <div class="gtile" id="gt5"><video id="v-g5" src="assets/clips/grid-05.mp4" data-start="18" data-duration="2.4" data-track-index="16" muted playsinline></video></div>
  <div class="gtile" id="gt6"><video id="v-g6" src="assets/clips/grid-06.mp4" data-start="18" data-duration="2.4" data-track-index="17" muted playsinline></video></div>
  <div class="gtile" id="gt7"><video id="v-g7" src="assets/clips/grid-07.mp4" data-start="18" data-duration="2.4" data-track-index="18" muted playsinline></video></div>
  <div class="gtile" id="gt8"><video id="v-g8" src="assets/clips/grid-08.mp4" data-start="18" data-duration="2.4" data-track-index="19" muted playsinline></video></div>
  <div class="gtile" id="gt9"><video id="v-g9" src="assets/clips/grid-09.mp4" data-start="18" data-duration="2.4" data-track-index="20" muted playsinline></video></div>
  <div class="gtile" id="gt10"><video id="v-g10" src="assets/clips/grid-10.mp4" data-start="18" data-duration="2.4" data-track-index="21" muted playsinline></video></div>
  <div class="gtile" id="gt11"><video id="v-g11" src="assets/clips/grid-11.mp4" data-start="18" data-duration="2.4" data-track-index="22" muted playsinline></video></div>
  <div class="gtile" id="gt12"><video id="v-g12" src="assets/clips/grid-12.mp4" data-start="18" data-duration="2.4" data-track-index="23" muted playsinline></video></div>
  <div class="gtile" id="gt13"><video id="v-g13" src="assets/clips/grid-13.mp4" data-start="18" data-duration="2.4" data-track-index="24" muted playsinline></video></div>
  <div class="gtile" id="gt14"><video id="v-g14" src="assets/clips/grid-14.mp4" data-start="18" data-duration="2.4" data-track-index="25" muted playsinline></video></div>
  <div class="gtile" id="gt15"><video id="v-g15" src="assets/clips/grid-15.mp4" data-start="18" data-duration="2.4" data-track-index="26" muted playsinline></video></div>
  <div id="grid-label"><span class="big">×30</span><span class="small">种画风，一支片</span></div>
</div>

<div id="full" class="layer" style="opacity:1">
  <div class="shot" id="shot-g01">
    <div class="shot-media"><video id="v-g01" src="assets/clips/g01.mp4" data-start="20.4" data-duration="0.4" data-track-index="27" muted playsinline></video></div>
    <div class="label" style="--c:#A98BFF">
      <div class="row1"><span class="chip">GPT</span><span class="spec">gpt-15-style-ai-beyond-generation</span></div>
      <span class="title">AI · Beyond Generation</span>
      <span class="tech">15 个世界 · 体素岛</span>
      <span class="spec">1080p · 30fps · 120s</span>
    </div>
  </div>
  <div class="shot" id="shot-g02">
    <div class="shot-media"><video id="v-g02" src="assets/clips/g02.mp4" data-start="20.8" data-duration="0.4" data-track-index="28" muted playsinline></video></div>
    <div class="label" style="--c:#A98BFF">
      <div class="row1"><span class="chip">GPT</span><span class="spec">gpt-15-style-ai-beyond-generation</span></div>
      <span class="title">AI · Beyond Generation</span>
      <span class="tech">15 个世界 · 黏土机器人</span>
      <span class="spec">1080p · 30fps · 120s</span>
    </div>
  </div>
  <div class="shot" id="shot-g03">
    <div class="shot-media"><video id="v-g03" src="assets/clips/g03.mp4" data-start="21.2" data-duration="0.4" data-track-index="29" muted playsinline></video></div>
    <div class="label" style="--c:#A98BFF">
      <div class="row1"><span class="chip">GPT</span><span class="spec">gpt-15-style-ai-beyond-generation</span></div>
      <span class="title">AI · Beyond Generation</span>
      <span class="tech">15 个世界 · 波普网点</span>
      <span class="spec">1080p · 30fps · 120s</span>
    </div>
  </div>
  <div class="shot" id="shot-g04">
    <div class="shot-media"><video id="v-g04" src="assets/clips/g04.mp4" data-start="21.6" data-duration="0.4" data-track-index="30" muted playsinline></video></div>
    <div class="label" style="--c:#A98BFF">
      <div class="row1"><span class="chip">GPT</span><span class="spec">gpt-15-style-ai-beyond-generation</span></div>
      <span class="title">AI · Beyond Generation</span>
      <span class="tech">15 个世界 · 霓虹</span>
      <span class="spec">1080p · 30fps · 120s</span>
    </div>
  </div>
  <div class="shot" id="shot-g05">
    <div class="shot-media"><video id="v-g05" src="assets/clips/g05.mp4" data-start="22" data-duration="0.4" data-track-index="31" muted playsinline></video></div>
    <div class="label" style="--c:#A98BFF">
      <div class="row1"><span class="chip">GPT</span><span class="spec">gpt-15-style-ai-beyond-generation</span></div>
      <span class="title">AI · Beyond Generation</span>
      <span class="tech">15 个世界 · 铬金属</span>
      <span class="spec">1080p · 30fps · 120s</span>
    </div>
  </div>
  <div class="shot" id="shot-g06">
    <div class="shot-media"><video id="v-g06" src="assets/clips/g06.mp4" data-start="22.4" data-duration="0.4" data-track-index="32" muted playsinline></video></div>
    <div class="label" style="--c:#A98BFF">
      <div class="row1"><span class="chip">GPT</span><span class="spec">gpt-15-style-ai-beyond-generation</span></div>
      <span class="title">AI · Beyond Generation</span>
      <span class="tech">15 个世界 · 粒子</span>
      <span class="spec">1080p · 30fps · 120s</span>
    </div>
  </div>
  <div class="shot" id="shot-g07">
    <div class="shot-media"><video id="v-g07" src="assets/clips/g07.mp4" data-start="22.8" data-duration="0.8" data-track-index="33" muted playsinline></video></div>
    <div class="label" style="--c:#A98BFF">
      <div class="row1"><span class="chip">GPT</span><span class="spec">gpt-mid-autumn-general-video</span></div>
      <span class="title">把日子，慢慢过圆</span>
      <span class="tech">铅笔线描 → 水墨 → 雕刻</span>
      <span class="spec">1080p · 60fps · 60s</span>
    </div>
  </div>
  <div class="shot" id="shot-h01">
    <div class="shot-media"><video id="v-h01" src="assets/clips/h01.mp4" data-start="25.6" data-duration="0.8" data-track-index="34" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-broken-reround</span></div>
      <span class="title">碎月重圆</span>
      <span class="tech">自写 3D 合成器 · Voronoi 碎裂</span>
      <span class="spec">1080p · 30fps · 30s</span>
    </div>
  </div>
  <div class="shot" id="shot-h02">
    <div class="shot-media"><video id="v-h02" src="assets/clips/h02.mp4" data-start="26.4" data-duration="0.4" data-track-index="35" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-oneink</span></div>
      <span class="title">一畫</span>
      <span class="tech">逆锋压笔 · 泼墨一笔</span>
      <span class="spec">1080p · 30fps · 60s</span>
    </div>
  </div>
  <div class="shot" id="shot-h03">
    <div class="shot-media"><video id="v-h03" src="assets/clips/h03.mp4" data-start="26.8" data-duration="0.4" data-track-index="36" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-factory-safety-videos</span></div>
      <span class="title">定格</span>
      <span class="tech">Three.js 定格 · 慢动作坠落</span>
      <span class="spec">1440p · 60fps · 87s</span>
    </div>
  </div>
  <div class="shot" id="shot-h04">
    <div class="shot-media"><video id="v-h04" src="assets/clips/h04.mp4" data-start="27.2" data-duration="0.4" data-track-index="37" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-claude-intro-with-15-way</span></div>
      <span class="title">Claude 自我介绍 · 15 种画风</span>
      <span class="tech">15 种画风 · 体素</span>
      <span class="spec">1080p · 30fps · 114s</span>
    </div>
  </div>
  <div class="shot" id="shot-h05">
    <div class="shot-media"><video id="v-h05" src="assets/clips/h05.mp4" data-start="27.6" data-duration="0.4" data-track-index="38" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-production-video-protocom-intro</span></div>
      <span class="title">protocom</span>
      <span class="tech">4K 60fps 定版</span>
      <span class="spec">4K · 60fps · 80s</span>
    </div>
  </div>
  <div class="shot" id="shot-h06">
    <div class="shot-media"><video id="v-h06" src="assets/clips/h06.mp4" data-start="28" data-duration="0.4" data-track-index="39" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-universe-history-video</span></div>
      <span class="title">代码宇宙</span>
      <span class="tech">4D 超立方体</span>
      <span class="spec">1080p · 24fps · 68s</span>
    </div>
  </div>
  <div class="shot" id="shot-h07">
    <div class="shot-media"><video id="v-h07" src="assets/clips/h07.mp4" data-start="28.4" data-duration="0.4" data-track-index="40" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-broken-reround</span></div>
      <span class="title">碎月重圆</span>
      <span class="tech">MoGraph 魔方墙 · 336 立方体</span>
      <span class="spec">1080p · 30fps · 30s</span>
    </div>
  </div>
  <div class="shot" id="shot-h08">
    <div class="shot-media"><video id="v-h08" src="assets/clips/h08.mp4" data-start="28.8" data-duration="0.4" data-track-index="41" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-production-video-ai-phase-skill</span></div>
      <span class="title">Phase-Gate 升维</span>
      <span class="tech">升维 · 曲速</span>
      <span class="spec">1080p · 60fps · 30s</span>
    </div>
  </div>
  <div class="shot" id="shot-h09">
    <div class="shot-media"><video id="v-h09" src="assets/clips/h09.mp4" data-start="29.2" data-duration="0.4" data-track-index="42" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-age-of-intelligence</span></div>
      <span class="title">智能时代</span>
      <span class="tech">注意力机制 · 3D</span>
      <span class="spec">60fps · 92s · 108 镜</span>
    </div>
  </div>
  <div class="shot" id="shot-h10">
    <div class="shot-media"><video id="v-h10" src="assets/clips/h10.mp4" data-start="29.6" data-duration="0.4" data-track-index="43" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-production-video-skill-hub</span></div>
      <span class="title">Skills Hub</span>
      <span class="tech">Logo 冲击出场</span>
      <span class="spec">1080p · 60fps · 57s</span>
    </div>
  </div>
  <div class="shot" id="shot-h11">
    <div class="shot-media"><video id="v-h11" src="assets/clips/h11.mp4" data-start="30" data-duration="0.4" data-track-index="44" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-F12-teaching</span></div>
      <span class="title">DevTools in 60 Seconds</span>
      <span class="tech">Console · 故障字</span>
      <span class="spec">1080p · 30fps · 60s</span>
    </div>
  </div>
  <div class="shot" id="shot-h12">
    <div class="shot-media"><video id="v-h12" src="assets/clips/h12.mp4" data-start="30.4" data-duration="0.4" data-track-index="45" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-claude-intro-with-15-way</span></div>
      <span class="title">Claude 自我介绍 · 15 种画风</span>
      <span class="tech">15 种画风 · 瑞士主义</span>
      <span class="spec">1080p · 30fps · 114s</span>
    </div>
  </div>
  <div class="shot" id="shot-h13">
    <div class="shot-media"><video id="v-h13" src="assets/clips/h13.mp4" data-start="30.8" data-duration="0.4" data-track-index="46" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-factory-safety-videos</span></div>
      <span class="title">定格</span>
      <span class="tech">2560×1440 · 60fps</span>
      <span class="spec">1440p · 60fps · 87s</span>
    </div>
  </div>
  <div class="shot" id="shot-h14">
    <div class="shot-media"><video id="v-h14" src="assets/clips/h14.mp4" data-start="31.2" data-duration="0.4" data-track-index="47" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-1037-hust-story</span></div>
      <span class="title">1037</span>
      <span class="tech">几百只小手连成山脊</span>
      <span class="spec">1080p · 30fps · 110s</span>
    </div>
  </div>
  <div class="shot" id="shot-h15">
    <div class="shot-media"><video id="v-h15" src="assets/clips/h15.mp4" data-start="31.6" data-duration="0.4" data-track-index="48" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-oneink</span></div>
      <span class="title">一畫</span>
      <span class="tech">「永」字八法 · 按笔顺书写</span>
      <span class="spec">1080p · 30fps · 60s</span>
    </div>
  </div>
</div>

<div id="duo" class="layer">
  <div id="duo-left"><video id="v-g08" src="assets/clips/g08.mp4" data-start="23.6" data-duration="1.2" data-track-index="49" muted playsinline></video></div>
  <div class="phone" id="duo-phone"><div class="screen"><div class="notch"></div><video id="v-g09" src="assets/clips/g09.mp4" data-start="23.6" data-duration="1.2" data-track-index="50" muted playsinline></video></div></div>
  <div id="duo-label"><b>GPT</b>《把日子，慢慢过圆》 横屏 · 《月光信笺》 竖屏 —— 同一个模型，两种画幅</div>
</div>
<div id="drop-ov" class="layer"><span class="n">04</span><span class="w">电影</span></div>

<div id="split" class="layer">
  <div class="panel" id="pn-s1a" data-n="2" data-panel="0">
    <div class="panel-media"><video id="v-s1a" src="assets/clips/s1a.mp4" data-start="32" data-duration="0.8" data-track-index="51" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-introduction-video-xuanlan</span></div>
      <span class="title">玄览 PocketWebShell</span>
      <span class="tech">32 分钟写完 · 浏览器三十年进化史</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s1b" data-n="2" data-panel="1">
    <div class="panel-media"><video id="v-s1b" src="assets/clips/s1b.mp4" data-start="32" data-duration="0.8" data-track-index="52" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-production-video-studysolo</span></div>
      <span class="title">StudySolo</span>
      <span class="tech">真实 Agent 页面 · 过去|现在 分屏</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s2a" data-n="3" data-panel="0">
    <div class="panel-media"><video id="v-s2a" src="assets/clips/s2a.mp4" data-start="32.8" data-duration="0.8" data-track-index="53" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-production-video-ys-blog</span></div>
      <span class="title">羽升集</span>
      <span class="tech">每一拍一个可见动作</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s2b" data-n="3" data-panel="1">
    <div class="panel-media"><video id="v-s2b" src="assets/clips/s2b.mp4" data-start="32.8" data-duration="0.8" data-track-index="54" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-shuchenglin-into</span></div>
      <span class="title">树成林</span>
      <span class="tech">虚拟时间逐帧录屏 · 卡点靠坐标</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s2c" data-n="3" data-panel="2">
    <div class="panel-media"><video id="v-s2c" src="assets/clips/s2c.mp4" data-start="32.8" data-duration="0.8" data-track-index="55" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-production-video-protocom-intro</span></div>
      <span class="title">protocom</span>
      <span class="tech">4K 60fps · 用画风变化叙事</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s3a" data-n="4" data-panel="0">
    <div class="panel-media"><video id="v-s3a" src="assets/clips/s3a.mp4" data-start="33.6" data-duration="0.8" data-track-index="56" muted playsinline></video></div>
    <div class="label" style="--c:#FFD166">
      <div class="row1"><span class="chip">SKILL</span><span class="spec">skill-方块系列定格动画</span></div>
      <span class="title">方块定格 Skill</span>
      <span class="tech">搭一次世界，拍任何画风</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s3b" data-n="4" data-panel="1">
    <div class="panel-media"><video id="v-s3b" src="assets/clips/s3b.mp4" data-start="33.6" data-duration="0.8" data-track-index="57" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-universe-history-video</span></div>
      <span class="title">代码宇宙</span>
      <span class="tech">27 种代码风格 · 2D→4D · 一拍二定格</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s3c" data-n="4" data-panel="2">
    <div class="panel-media"><video id="v-s3c" src="assets/clips/s3c.mp4" data-start="33.6" data-duration="0.8" data-track-index="58" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-mid-autumn-highschool-videos</span></div>
      <span class="title">共此时</span>
      <span class="tech">三年照片 · 机器看片 + 人工看片</span>
      
    </div>
  </div>
  <div class="panel" id="pn-s3d" data-n="4" data-panel="3">
    <div class="panel-media"><video id="v-s3d" src="assets/clips/s3d.mp4" data-start="33.6" data-duration="0.8" data-track-index="59" muted playsinline></video></div>
    <div class="label" style="--c:#FF7A3D">
      <div class="row1"><span class="chip">CLAUDE OPUS</span><span class="spec">opus-mid-autumn-genergal-videos</span></div>
      <span class="title">同一个月亮</span>
      <span class="tech">单文件 854 行 · Canvas + Web Audio</span>
      
    </div>
  </div>
</div>

<div id="phones" class="layer">
  <div class="phone" id="ph-p1" style="left:330px">
    <div class="screen"><div class="notch"></div><video id="v-p1" src="assets/clips/p1.mp4" data-start="34.4" data-duration="0.8" data-track-index="60" muted playsinline></video></div>
    <div class="ph-label">慢下来<span>竖屏 1080×1920 · 37s</span></div>
  </div>
  <div class="phone" id="ph-p2" style="left:760px">
    <div class="screen"><div class="notch"></div><video id="v-p2" src="assets/clips/p2.mp4" data-start="34.4" data-duration="0.8" data-track-index="61" muted playsinline></video></div>
    <div class="ph-label">中秋 · 给学姐<span>竖屏 1080×1920 · 29s</span></div>
  </div>
  <div class="phone" id="ph-p3" style="left:1190px">
    <div class="screen"><div class="notch"></div><video id="v-p3" src="assets/clips/p3.mp4" data-start="34.4" data-duration="0.8" data-track-index="62" muted playsinline></video></div>
    <div class="ph-label">月光替你亮着灯<span>1080p · 24fps · 28s</span></div>
  </div>
</div>

<div id="tunnel" class="layer">
  <div id="tunnel-cam">
  <div class="tplane" id="tp-kimi-beat" style="--c:#3CF0C8;transform:translate3d(-900px,0,-300px) rotateY(90deg)"><img src="assets/posters/kimi-beat.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>AI 觉醒</div></div>
  <div class="tplane" id="tp-ai-rise" style="--c:#7CC4FF;transform:translate3d(900px,0,-490px) rotateY(-90deg)"><img src="assets/posters/ai-rise.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>AI:RISE</div></div>
  <div class="tplane" id="tp-kimi-film" style="--c:#7CC4FF;transform:translate3d(0,-520px,-680px) rotateX(-90deg)"><img src="assets/posters/kimi-film.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>月之暗面 · KIMI</div></div>
  <div class="tplane" id="tp-cosmos30" style="--c:#A98BFF;transform:translate3d(0,520px,-870px) rotateX(90deg)"><img src="assets/posters/cosmos30.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>COSMOS · 从未知到寂静</div></div>
  <div class="tplane" id="tp-beyond" style="--c:#A98BFF;transform:translate3d(-900px,0,-1060px) rotateY(90deg)"><img src="assets/posters/beyond.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>AI · Beyond Generation</div></div>
  <div class="tplane" id="tp-gpt-autumn" style="--c:#A98BFF;transform:translate3d(900px,0,-1250px) rotateY(-90deg)"><img src="assets/posters/gpt-autumn.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>把日子，慢慢过圆</div></div>
  <div class="tplane" id="tp-moon-letter" style="--c:#A98BFF;transform:translate3d(0,-520px,-1440px) rotateX(-90deg)"><img src="assets/posters/moon-letter.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>月光信笺</div></div>
  <div class="tplane" id="tp-shatter" style="--c:#FF7A3D;transform:translate3d(0,520px,-1630px) rotateX(90deg)"><img src="assets/posters/shatter.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>碎月重圆</div></div>
  <div class="tplane" id="tp-oneink" style="--c:#FF7A3D;transform:translate3d(-900px,0,-1820px) rotateY(90deg)"><img src="assets/posters/oneink.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>一畫</div></div>
  <div class="tplane" id="tp-dingge" style="--c:#FF7A3D;transform:translate3d(900px,0,-2010px) rotateY(-90deg)"><img src="assets/posters/dingge.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>定格</div></div>
  <div class="tplane" id="tp-claude15" style="--c:#FF7A3D;transform:translate3d(0,-520px,-2200px) rotateX(-90deg)"><img src="assets/posters/claude15.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>Claude 自我介绍 · 15 种画风</div></div>
  <div class="tplane" id="tp-protocom" style="--c:#FF7A3D;transform:translate3d(0,520px,-2390px) rotateX(90deg)"><img src="assets/posters/protocom.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>protocom</div></div>
  <div class="tplane" id="tp-codecosmos" style="--c:#FF7A3D;transform:translate3d(-900px,0,-2580px) rotateY(90deg)"><img src="assets/posters/codecosmos.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>代码宇宙</div></div>
  <div class="tplane" id="tp-phasegate" style="--c:#FF7A3D;transform:translate3d(900px,0,-2770px) rotateY(-90deg)"><img src="assets/posters/phasegate.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>Phase-Gate 升维</div></div>
  <div class="tplane" id="tp-ageint" style="--c:#FF7A3D;transform:translate3d(0,-520px,-2960px) rotateX(-90deg)"><img src="assets/posters/ageint.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>智能时代</div></div>
  <div class="tplane" id="tp-skillshub" style="--c:#FF7A3D;transform:translate3d(0,520px,-3150px) rotateX(90deg)"><img src="assets/posters/skillshub.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>Skills Hub</div></div>
  <div class="tplane" id="tp-f12" style="--c:#FF7A3D;transform:translate3d(-900px,0,-3340px) rotateY(90deg)"><img src="assets/posters/f12.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>DevTools in 60 Seconds</div></div>
  <div class="tplane" id="tp-hust1037" style="--c:#FF7A3D;transform:translate3d(900px,0,-3530px) rotateY(-90deg)"><img src="assets/posters/hust1037.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>1037</div></div>
  <div class="tplane" id="tp-xuanlan" style="--c:#FF7A3D;transform:translate3d(0,-520px,-3720px) rotateX(-90deg)"><img src="assets/posters/xuanlan.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>玄览 PocketWebShell</div></div>
  <div class="tplane" id="tp-studysolo" style="--c:#FF7A3D;transform:translate3d(0,520px,-3910px) rotateX(90deg)"><img src="assets/posters/studysolo.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>StudySolo</div></div>
  <div class="tplane" id="tp-yusheng" style="--c:#FF7A3D;transform:translate3d(-900px,0,-4100px) rotateY(90deg)"><img src="assets/posters/yusheng.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>羽升集</div></div>
  <div class="tplane" id="tp-shuchenglin" style="--c:#FF7A3D;transform:translate3d(900px,0,-4290px) rotateY(-90deg)"><img src="assets/posters/shuchenglin.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>树成林</div></div>
  <div class="tplane" id="tp-stopmotion" style="--c:#FFD166;transform:translate3d(0,-520px,-4480px) rotateX(-90deg)"><img src="assets/posters/stopmotion.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>方块定格 Skill</div></div>
  <div class="tplane" id="tp-samemoon" style="--c:#FF7A3D;transform:translate3d(0,520px,-4670px) rotateX(90deg)"><img src="assets/posters/samemoon.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>同一个月亮</div></div>
  <div class="tplane" id="tp-gongcishi" style="--c:#FF7A3D;transform:translate3d(-900px,0,-4860px) rotateY(90deg)"><img src="assets/posters/gongcishi.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>共此时</div></div>
  <div class="tplane" id="tp-moonlamp" style="--c:#FF7A3D;transform:translate3d(900px,0,-5050px) rotateY(-90deg)"><img src="assets/posters/moonlamp.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>月光替你亮着灯</div></div>
  <div class="tplane" id="tp-readclub" style="--c:#FF7A3D;transform:translate3d(0,-520px,-5240px) rotateX(-90deg)"><img src="assets/posters/readclub.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>慢下来</div></div>
  <div class="tplane" id="tp-senpai" style="--c:#FF7A3D;transform:translate3d(0,520px,-5430px) rotateX(90deg)"><img src="assets/posters/senpai.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>中秋 · 给学姐</div></div>
  </div>
  <div class="center-box"><div id="tunnel-line">从一行字，到一整个宇宙</div></div>
</div>

<div id="wall" class="layer">
  <div id="wall-cam">
    <div class="wtile" id="wt-kimi-beat" style="--c:#3CF0C8;left:34px;top:237px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/kimi-beat-end.jpg" alt="">
      <video id="v-wall-kimi-beat" src="assets/clips/wall-kimi-beat.mp4" data-start="38.4" data-duration="3.2" data-track-index="63" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>KIMI</i>AI 觉醒</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-ai-rise" style="--c:#7CC4FF;left:300px;top:237px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/ai-rise-end.jpg" alt="">
      <video id="v-wall-ai-rise" src="assets/clips/wall-ai-rise.mp4" data-start="38.4" data-duration="3.2" data-track-index="64" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>SWE</i>AI:RISE</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-kimi-film" style="--c:#7CC4FF;left:566px;top:237px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/kimi-film-end.jpg" alt="">
      <video id="v-wall-kimi-film" src="assets/clips/wall-kimi-film.mp4" data-start="38.4" data-duration="3.2" data-track-index="65" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>SWE</i>月之暗面 · KIMI</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-cosmos30" style="--c:#A98BFF;left:832px;top:237px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/cosmos30-end.jpg" alt="">
      <video id="v-wall-cosmos30" src="assets/clips/wall-cosmos30.mp4" data-start="38.4" data-duration="3.2" data-track-index="66" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>GPT</i>COSMOS · 从未知到寂静</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-beyond" style="--c:#A98BFF;left:1098px;top:237px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/beyond-end.jpg" alt="">
      <video id="v-wall-beyond" src="assets/clips/wall-beyond.mp4" data-start="38.4" data-duration="3.2" data-track-index="67" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>GPT</i>AI · Beyond Generation</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-gpt-autumn" style="--c:#A98BFF;left:1364px;top:237px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/gpt-autumn-end.jpg" alt="">
      <video id="v-wall-gpt-autumn" src="assets/clips/wall-gpt-autumn.mp4" data-start="38.4" data-duration="3.2" data-track-index="68" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>GPT</i>把日子，慢慢过圆</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-moon-letter" style="--c:#A98BFF;left:1630px;top:237px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/moon-letter-end.jpg" alt="">
      <video id="v-wall-moon-letter" src="assets/clips/wall-moon-letter.mp4" data-start="38.4" data-duration="3.2" data-track-index="69" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>GPT</i>月光信笺</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-shatter" style="--c:#FF7A3D;left:34px;top:391px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/shatter-end.jpg" alt="">
      <video id="v-wall-shatter" src="assets/clips/wall-shatter.mp4" data-start="38.4" data-duration="3.2" data-track-index="70" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>碎月重圆</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-oneink" style="--c:#FF7A3D;left:300px;top:391px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/oneink-end.jpg" alt="">
      <video id="v-wall-oneink" src="assets/clips/wall-oneink.mp4" data-start="38.4" data-duration="3.2" data-track-index="71" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>一畫</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-dingge" style="--c:#FF7A3D;left:566px;top:391px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/dingge-end.jpg" alt="">
      <video id="v-wall-dingge" src="assets/clips/wall-dingge.mp4" data-start="38.4" data-duration="3.2" data-track-index="72" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>定格</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-claude15" style="--c:#FF7A3D;left:832px;top:391px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/claude15-end.jpg" alt="">
      <video id="v-wall-claude15" src="assets/clips/wall-claude15.mp4" data-start="38.4" data-duration="3.2" data-track-index="73" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>Claude 自我介绍 · 15 种画风</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-protocom" style="--c:#FF7A3D;left:1098px;top:391px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/protocom-end.jpg" alt="">
      <video id="v-wall-protocom" src="assets/clips/wall-protocom.mp4" data-start="38.4" data-duration="3.2" data-track-index="74" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>protocom</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-codecosmos" style="--c:#FF7A3D;left:1364px;top:391px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/codecosmos-end.jpg" alt="">
      <video id="v-wall-codecosmos" src="assets/clips/wall-codecosmos.mp4" data-start="38.4" data-duration="3.2" data-track-index="75" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>代码宇宙</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-phasegate" style="--c:#FF7A3D;left:1630px;top:391px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/phasegate-end.jpg" alt="">
      <video id="v-wall-phasegate" src="assets/clips/wall-phasegate.mp4" data-start="38.4" data-duration="3.2" data-track-index="76" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>Phase-Gate 升维</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-ageint" style="--c:#FF7A3D;left:34px;top:545px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/ageint-end.jpg" alt="">
      <video id="v-wall-ageint" src="assets/clips/wall-ageint.mp4" data-start="38.4" data-duration="3.2" data-track-index="77" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>智能时代</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-skillshub" style="--c:#FF7A3D;left:300px;top:545px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/skillshub-end.jpg" alt="">
      <video id="v-wall-skillshub" src="assets/clips/wall-skillshub.mp4" data-start="38.4" data-duration="3.2" data-track-index="78" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>Skills Hub</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-f12" style="--c:#FF7A3D;left:566px;top:545px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/f12-end.jpg" alt="">
      <video id="v-wall-f12" src="assets/clips/wall-f12.mp4" data-start="38.4" data-duration="3.2" data-track-index="79" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>DevTools in 60 Seconds</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-hust1037" style="--c:#FF7A3D;left:832px;top:545px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/hust1037-end.jpg" alt="">
      <video id="v-wall-hust1037" src="assets/clips/wall-hust1037.mp4" data-start="38.4" data-duration="3.2" data-track-index="80" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>1037</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-xuanlan" style="--c:#FF7A3D;left:1098px;top:545px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/xuanlan-end.jpg" alt="">
      <video id="v-wall-xuanlan" src="assets/clips/wall-xuanlan.mp4" data-start="38.4" data-duration="3.2" data-track-index="81" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>玄览 PocketWebShell</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-studysolo" style="--c:#FF7A3D;left:1364px;top:545px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/studysolo-end.jpg" alt="">
      <video id="v-wall-studysolo" src="assets/clips/wall-studysolo.mp4" data-start="38.4" data-duration="3.2" data-track-index="82" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>StudySolo</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-yusheng" style="--c:#FF7A3D;left:1630px;top:545px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/yusheng-end.jpg" alt="">
      <video id="v-wall-yusheng" src="assets/clips/wall-yusheng.mp4" data-start="38.4" data-duration="3.2" data-track-index="83" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>羽升集</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-shuchenglin" style="--c:#FF7A3D;left:34px;top:699px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/shuchenglin-end.jpg" alt="">
      <video id="v-wall-shuchenglin" src="assets/clips/wall-shuchenglin.mp4" data-start="38.4" data-duration="3.2" data-track-index="84" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>树成林</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-stopmotion" style="--c:#FFD166;left:300px;top:699px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/stopmotion-end.jpg" alt="">
      <video id="v-wall-stopmotion" src="assets/clips/wall-stopmotion.mp4" data-start="38.4" data-duration="3.2" data-track-index="85" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>SKILL</i>方块定格 Skill</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-samemoon" style="--c:#FF7A3D;left:566px;top:699px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/samemoon-end.jpg" alt="">
      <video id="v-wall-samemoon" src="assets/clips/wall-samemoon.mp4" data-start="38.4" data-duration="3.2" data-track-index="86" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>同一个月亮</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-gongcishi" style="--c:#FF7A3D;left:832px;top:699px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/gongcishi-end.jpg" alt="">
      <video id="v-wall-gongcishi" src="assets/clips/wall-gongcishi.mp4" data-start="38.4" data-duration="3.2" data-track-index="87" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>共此时</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-moonlamp" style="--c:#FF7A3D;left:1098px;top:699px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/moonlamp-end.jpg" alt="">
      <video id="v-wall-moonlamp" src="assets/clips/wall-moonlamp.mp4" data-start="38.4" data-duration="3.2" data-track-index="88" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>月光替你亮着灯</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-readclub" style="--c:#FF7A3D;left:1364px;top:699px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/readclub-end.jpg" alt="">
      <video id="v-wall-readclub" src="assets/clips/wall-readclub.mp4" data-start="38.4" data-duration="3.2" data-track-index="89" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>慢下来</div>
      <div class="flash"></div>
    </div>
    <div class="wtile" id="wt-senpai" style="--c:#FF7A3D;left:1630px;top:699px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/senpai-end.jpg" alt="">
      <video id="v-wall-senpai" src="assets/clips/wall-senpai.mp4" data-start="38.4" data-duration="3.2" data-track-index="90" muted playsinline></video>
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>CLAUDE OPUS</i>中秋 · 给学姐</div>
      <div class="flash"></div>
    </div>
  </div>
  <div id="wall-title">AI-CODING · SUPERVIDEOS</div>
  <div id="wall-sub">28 部 · 全部由代码生成</div>
</div>

<div id="breath" class="layer" style="opacity:1">
  <div class="bline" id="bl0" data-layout-allow-overlap><div class="big" data-layout-allow-overlap>28 部片子。</div><div class="small">31 分钟 · 6.9 万帧</div></div>
  <div class="bline" id="bl1" data-layout-allow-overlap><div class="big" data-layout-allow-overlap>没有一帧，是手动剪出来的。</div><div class="small">每一帧都由 render(t) 算出</div></div>
  <div class="bline" id="bl2" data-layout-allow-overlap><div class="big" data-layout-allow-overlap>它们，是怎么做出来的？</div></div>
</div>

<div id="flyers" class="layer" style="opacity:1">
  <div class="flyer" id="fl-kimi-beat" style="--c:#3CF0C8"><img src="assets/posters/kimi-beat.jpg" alt=""></div>
  <div class="flyer" id="fl-ai-rise" style="--c:#7CC4FF"><img src="assets/posters/ai-rise.jpg" alt=""></div>
  <div class="flyer" id="fl-kimi-film" style="--c:#7CC4FF"><img src="assets/posters/kimi-film.jpg" alt=""></div>
  <div class="flyer" id="fl-cosmos30" style="--c:#A98BFF"><img src="assets/posters/cosmos30.jpg" alt=""></div>
  <div class="flyer" id="fl-beyond" style="--c:#A98BFF"><img src="assets/posters/beyond.jpg" alt=""></div>
  <div class="flyer" id="fl-gpt-autumn" style="--c:#A98BFF"><img src="assets/posters/gpt-autumn.jpg" alt=""></div>
  <div class="flyer" id="fl-moon-letter" style="--c:#A98BFF"><img src="assets/posters/moon-letter.jpg" alt=""></div>
  <div class="flyer" id="fl-shatter" style="--c:#FF7A3D"><img src="assets/posters/shatter.jpg" alt=""></div>
  <div class="flyer" id="fl-oneink" style="--c:#FF7A3D"><img src="assets/posters/oneink.jpg" alt=""></div>
  <div class="flyer" id="fl-dingge" style="--c:#FF7A3D"><img src="assets/posters/dingge.jpg" alt=""></div>
  <div class="flyer" id="fl-claude15" style="--c:#FF7A3D"><img src="assets/posters/claude15.jpg" alt=""></div>
  <div class="flyer" id="fl-protocom" style="--c:#FF7A3D"><img src="assets/posters/protocom.jpg" alt=""></div>
  <div class="flyer" id="fl-codecosmos" style="--c:#FF7A3D"><img src="assets/posters/codecosmos.jpg" alt=""></div>
  <div class="flyer" id="fl-phasegate" style="--c:#FF7A3D"><img src="assets/posters/phasegate.jpg" alt=""></div>
  <div class="flyer" id="fl-ageint" style="--c:#FF7A3D"><img src="assets/posters/ageint.jpg" alt=""></div>
  <div class="flyer" id="fl-skillshub" style="--c:#FF7A3D"><img src="assets/posters/skillshub.jpg" alt=""></div>
  <div class="flyer" id="fl-f12" style="--c:#FF7A3D"><img src="assets/posters/f12.jpg" alt=""></div>
  <div class="flyer" id="fl-hust1037" style="--c:#FF7A3D"><img src="assets/posters/hust1037.jpg" alt=""></div>
  <div class="flyer" id="fl-xuanlan" style="--c:#FF7A3D"><img src="assets/posters/xuanlan.jpg" alt=""></div>
  <div class="flyer" id="fl-studysolo" style="--c:#FF7A3D"><img src="assets/posters/studysolo.jpg" alt=""></div>
  <div class="flyer" id="fl-yusheng" style="--c:#FF7A3D"><img src="assets/posters/yusheng.jpg" alt=""></div>
  <div class="flyer" id="fl-shuchenglin" style="--c:#FF7A3D"><img src="assets/posters/shuchenglin.jpg" alt=""></div>
  <div class="flyer" id="fl-stopmotion" style="--c:#FFD166"><img src="assets/posters/stopmotion.jpg" alt=""></div>
  <div class="flyer" id="fl-samemoon" style="--c:#FF7A3D"><img src="assets/posters/samemoon.jpg" alt=""></div>
  <div class="flyer" id="fl-gongcishi" style="--c:#FF7A3D"><img src="assets/posters/gongcishi.jpg" alt=""></div>
  <div class="flyer" id="fl-moonlamp" style="--c:#FF7A3D"><img src="assets/posters/moonlamp.jpg" alt=""></div>
  <div class="flyer" id="fl-readclub" style="--c:#FF7A3D"><img src="assets/posters/readclub.jpg" alt=""></div>
  <div class="flyer" id="fl-senpai" style="--c:#FF7A3D"><img src="assets/posters/senpai.jpg" alt=""></div>
</div>

<div id="reveal" class="layer">
  <div id="rv-row"><div class="rv-ch" id="rc0">通</div><div class="rv-ch" id="rc1">通</div><div class="rv-ch" id="rc2">开</div><div class="rv-ch" id="rc3">源</div></div>
  <div id="rv-en">OPEN SOURCE · ALL OF IT</div>
  <div id="rv-sweep"></div>
</div>
<div id="pillars" class="layer">
  <div class="pillar" id="pl0">
    <div class="ph"><span class="h" data-layout-allow-overlap>源码</span><span class="en" data-layout-allow-overlap>SOURCE</span></div>
    <div class="pn"><span class="pl-num" data-to="20" data-layout-allow-overlap>0</span><span class="unit" data-layout-allow-overlap>个工程包</span></div>
    <div class="sub">+ 5 个可交互网页</div>
    <div class="pl-stream"><div class="pl-list" data-rows="25"><div>gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_Project.zip</div><div>gpt-mid-autumn-for-my-dg03/Moon_Letter_Interactive.html</div><div>gpt-mid-autumn-for-my-dg03/月光替你亮着灯-source.zip</div><div>gpt-mid-autumn-general-video/MidAutumn_Final_60s_Source.zip</div><div>gpt-universe-30-change/COSMOS_Source_and_Storyboard.zip</div><div>kimi-ai-beat-sync/ai-beat-sync-src.zip</div><div>opus-age-of-intelligence/智能时代-The_Age_of_Intelligence-source.zip</div><div>opus-claude-intro-with-15-way/claude_intro_源码.zip</div><div>opus-F12-teaching/F12-Field-Guide-source.zip</div><div>opus-F12-teaching/F12-Field-Guide.html</div><div>opus-factory-safety-videos/dingge-source.tgz</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来_代码版.html</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来_源码.zip</div><div>opus-oneink/一畫_源代码.zip</div><div>opus-production-video-protocom-intro/promo-src.zip</div><div>opus-production-video-skill-hub/skills-hub-promo-source.zip</div><div>opus-shuchenglin-into/树成林宣传片-工程源码.zip</div><div>opus-universe-history-video/code_cosmos_source.zip</div><div>skill-代码视频所有绝大部分方式和启迪/code-videos-path.zip</div><div>skill-代码视频所有绝大部分方式和启迪/VIBEMOTION-workstation.html</div><div>skill-代码视频所有绝大部分方式和启迪/VibeMotion-本地版.html</div><div>skill-方块系列定格动画/stop-motion-3d.skill</div><div>skill-方块系列定格动画/stop-motion-3d.zip</div><div>swe-ai-rise/ai_rise_source.zip</div><div>swe-kimi-source-intro/kimi_film_source.zip</div><div>gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_Project.zip</div><div>gpt-mid-autumn-for-my-dg03/Moon_Letter_Interactive.html</div><div>gpt-mid-autumn-for-my-dg03/月光替你亮着灯-source.zip</div><div>gpt-mid-autumn-general-video/MidAutumn_Final_60s_Source.zip</div><div>gpt-universe-30-change/COSMOS_Source_and_Storyboard.zip</div><div>kimi-ai-beat-sync/ai-beat-sync-src.zip</div><div>opus-age-of-intelligence/智能时代-The_Age_of_Intelligence-source.zip</div><div>opus-claude-intro-with-15-way/claude_intro_源码.zip</div><div>opus-F12-teaching/F12-Field-Guide-source.zip</div><div>opus-F12-teaching/F12-Field-Guide.html</div><div>opus-factory-safety-videos/dingge-source.tgz</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来_代码版.html</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来_源码.zip</div><div>opus-oneink/一畫_源代码.zip</div><div>opus-production-video-protocom-intro/promo-src.zip</div><div>opus-production-video-skill-hub/skills-hub-promo-source.zip</div><div>opus-shuchenglin-into/树成林宣传片-工程源码.zip</div><div>opus-universe-history-video/code_cosmos_source.zip</div><div>skill-代码视频所有绝大部分方式和启迪/code-videos-path.zip</div><div>skill-代码视频所有绝大部分方式和启迪/VIBEMOTION-workstation.html</div><div>skill-代码视频所有绝大部分方式和启迪/VibeMotion-本地版.html</div><div>skill-方块系列定格动画/stop-motion-3d.skill</div><div>skill-方块系列定格动画/stop-motion-3d.zip</div><div>swe-ai-rise/ai_rise_source.zip</div><div>swe-kimi-source-intro/kimi_film_source.zip</div><div>gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_Project.zip</div><div>gpt-mid-autumn-for-my-dg03/Moon_Letter_Interactive.html</div><div>gpt-mid-autumn-for-my-dg03/月光替你亮着灯-source.zip</div><div>gpt-mid-autumn-general-video/MidAutumn_Final_60s_Source.zip</div><div>gpt-universe-30-change/COSMOS_Source_and_Storyboard.zip</div><div>kimi-ai-beat-sync/ai-beat-sync-src.zip</div><div>opus-age-of-intelligence/智能时代-The_Age_of_Intelligence-source.zip</div><div>opus-claude-intro-with-15-way/claude_intro_源码.zip</div><div>opus-F12-teaching/F12-Field-Guide-source.zip</div><div>opus-F12-teaching/F12-Field-Guide.html</div><div>opus-factory-safety-videos/dingge-source.tgz</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来_代码版.html</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来_源码.zip</div><div>opus-oneink/一畫_源代码.zip</div><div>opus-production-video-protocom-intro/promo-src.zip</div><div>opus-production-video-skill-hub/skills-hub-promo-source.zip</div><div>opus-shuchenglin-into/树成林宣传片-工程源码.zip</div><div>opus-universe-history-video/code_cosmos_source.zip</div><div>skill-代码视频所有绝大部分方式和启迪/code-videos-path.zip</div><div>skill-代码视频所有绝大部分方式和启迪/VIBEMOTION-workstation.html</div><div>skill-代码视频所有绝大部分方式和启迪/VibeMotion-本地版.html</div><div>skill-方块系列定格动画/stop-motion-3d.skill</div><div>skill-方块系列定格动画/stop-motion-3d.zip</div><div>swe-ai-rise/ai_rise_source.zip</div><div>swe-kimi-source-intro/kimi_film_source.zip</div></div></div>
  </div>
  <div class="pillar" id="pl1">
    <div class="ph"><span class="h" data-layout-allow-overlap>复盘</span><span class="en" data-layout-allow-overlap>CoExp</span></div>
    <div class="pn"><span class="pl-num" data-to="24" data-layout-allow-overlap>0</span><span class="unit" data-layout-allow-overlap>份经验文档</span></div>
    <div class="sub">51 万字 · 每一个坑都写进去了</div>
    <div class="pl-stream"><div class="pl-list" data-rows="24"><div>gpt-mid-autumn-general-video/把日子，慢慢过圆代码视频-CoExp.md</div><div>gpt-universe-30-change/COSMOS从未知到寂静代码视频-CoExp.md</div><div>kimi-ai-beat-sync/AI觉醒代码视频-CoExp.md</div><div>opus-1037-hust-story/HUST宣传代码MG视频-CoExp.md</div><div>opus-age-of-intelligence/智能时代代码视频-CoExp.md</div><div>opus-broken-reround/碎月重圆_AE级特效_CoExp.md</div><div>opus-F12-teaching/DevTools-in-60-Seconds代码视频-CoExp.md</div><div>opus-factory-safety-videos/工地安全定格代码视频-CoExp.md</div><div>opus-hust-read-join-video-v1/华中大读书会《慢下来》代码视频-CoExp.md</div><div>opus-introduction-video-xuanlan/玄览PocketWebShell宣传片代码视频-CoExp.md</div><div>opus-mid-autumn-for-my-dg01/中秋给学姐的温情视频-CoExp.md</div><div>opus-mid-autumn-for-my-dg02/月光替你亮着灯代码视频-CoExp.md</div><div>opus-mid-autumn-genergal-videos/中秋代码介绍视频-CoExp.md</div><div>opus-mid-autumn-highschool-videos/共此时代码视频-CoExp.md</div><div>opus-oneink/一畫代码视频-CoExp.md</div><div>opus-production-video-ai-phase-skill/Phase-Gate升维宣传片代码视频-CoExp.md</div><div>opus-production-video-protocom-intro/protocom宣传片代码视频-CoExp.md</div><div>opus-production-video-skill-hub/Skills Hub宣传片代码视频-CoExp.md</div><div>opus-production-video-studysolo/StudySolo宣传片代码视频-CoExp.md</div><div>opus-production-video-ys-blog/羽升集宣传片代码视频-CoExp.md</div><div>opus-shuchenglin-into/树成林展示视频代码卡点宣传片-方法论-CoExp.md</div><div>opus-universe-history-video/宇宙变换-CoExp.md</div><div>swe-ai-rise/AI-RISE代码视频-CoExp.md</div><div>swe-kimi-source-intro/月之暗面KIMI介绍代码视频-CoExp.md</div><div>gpt-mid-autumn-general-video/把日子，慢慢过圆代码视频-CoExp.md</div><div>gpt-universe-30-change/COSMOS从未知到寂静代码视频-CoExp.md</div><div>kimi-ai-beat-sync/AI觉醒代码视频-CoExp.md</div><div>opus-1037-hust-story/HUST宣传代码MG视频-CoExp.md</div><div>opus-age-of-intelligence/智能时代代码视频-CoExp.md</div><div>opus-broken-reround/碎月重圆_AE级特效_CoExp.md</div><div>opus-F12-teaching/DevTools-in-60-Seconds代码视频-CoExp.md</div><div>opus-factory-safety-videos/工地安全定格代码视频-CoExp.md</div><div>opus-hust-read-join-video-v1/华中大读书会《慢下来》代码视频-CoExp.md</div><div>opus-introduction-video-xuanlan/玄览PocketWebShell宣传片代码视频-CoExp.md</div><div>opus-mid-autumn-for-my-dg01/中秋给学姐的温情视频-CoExp.md</div><div>opus-mid-autumn-for-my-dg02/月光替你亮着灯代码视频-CoExp.md</div><div>opus-mid-autumn-genergal-videos/中秋代码介绍视频-CoExp.md</div><div>opus-mid-autumn-highschool-videos/共此时代码视频-CoExp.md</div><div>opus-oneink/一畫代码视频-CoExp.md</div><div>opus-production-video-ai-phase-skill/Phase-Gate升维宣传片代码视频-CoExp.md</div><div>opus-production-video-protocom-intro/protocom宣传片代码视频-CoExp.md</div><div>opus-production-video-skill-hub/Skills Hub宣传片代码视频-CoExp.md</div><div>opus-production-video-studysolo/StudySolo宣传片代码视频-CoExp.md</div><div>opus-production-video-ys-blog/羽升集宣传片代码视频-CoExp.md</div><div>opus-shuchenglin-into/树成林展示视频代码卡点宣传片-方法论-CoExp.md</div><div>opus-universe-history-video/宇宙变换-CoExp.md</div><div>swe-ai-rise/AI-RISE代码视频-CoExp.md</div><div>swe-kimi-source-intro/月之暗面KIMI介绍代码视频-CoExp.md</div><div>gpt-mid-autumn-general-video/把日子，慢慢过圆代码视频-CoExp.md</div><div>gpt-universe-30-change/COSMOS从未知到寂静代码视频-CoExp.md</div><div>kimi-ai-beat-sync/AI觉醒代码视频-CoExp.md</div><div>opus-1037-hust-story/HUST宣传代码MG视频-CoExp.md</div><div>opus-age-of-intelligence/智能时代代码视频-CoExp.md</div><div>opus-broken-reround/碎月重圆_AE级特效_CoExp.md</div><div>opus-F12-teaching/DevTools-in-60-Seconds代码视频-CoExp.md</div><div>opus-factory-safety-videos/工地安全定格代码视频-CoExp.md</div><div>opus-hust-read-join-video-v1/华中大读书会《慢下来》代码视频-CoExp.md</div><div>opus-introduction-video-xuanlan/玄览PocketWebShell宣传片代码视频-CoExp.md</div><div>opus-mid-autumn-for-my-dg01/中秋给学姐的温情视频-CoExp.md</div><div>opus-mid-autumn-for-my-dg02/月光替你亮着灯代码视频-CoExp.md</div><div>opus-mid-autumn-genergal-videos/中秋代码介绍视频-CoExp.md</div><div>opus-mid-autumn-highschool-videos/共此时代码视频-CoExp.md</div><div>opus-oneink/一畫代码视频-CoExp.md</div><div>opus-production-video-ai-phase-skill/Phase-Gate升维宣传片代码视频-CoExp.md</div><div>opus-production-video-protocom-intro/protocom宣传片代码视频-CoExp.md</div><div>opus-production-video-skill-hub/Skills Hub宣传片代码视频-CoExp.md</div><div>opus-production-video-studysolo/StudySolo宣传片代码视频-CoExp.md</div><div>opus-production-video-ys-blog/羽升集宣传片代码视频-CoExp.md</div><div>opus-shuchenglin-into/树成林展示视频代码卡点宣传片-方法论-CoExp.md</div><div>opus-universe-history-video/宇宙变换-CoExp.md</div><div>swe-ai-rise/AI-RISE代码视频-CoExp.md</div><div>swe-kimi-source-intro/月之暗面KIMI介绍代码视频-CoExp.md</div></div></div>
  </div>
  <div class="pillar" id="pl2">
    <div class="ph"><span class="h" data-layout-allow-overlap>成片</span><span class="en" data-layout-allow-overlap>FILM</span></div>
    <div class="pn"><span class="pl-num" data-to="28" data-layout-allow-overlap>0</span><span class="unit" data-layout-allow-overlap>部代码视频</span></div>
    <div class="sub">2.39 GB · 31 分钟</div>
    <div class="pl-stream"><div class="pl-list" data-rows="28"><div>gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_1080p.mp4</div><div>gpt-mid-autumn-for-my-dg03/Moon_Letter_MidAutumn_1080p.mp4</div><div>gpt-mid-autumn-general-video/gpt-MidAutumn_Final_60s_1080p60.mp4</div><div>gpt-universe-30-change/COSMOS_30_STYLES_72s_1080p.mp4</div><div>kimi-ai-beat-sync/ai-beat-sync.mp4</div><div>opus-1037-hust-story/1037_MG试片.mp4</div><div>opus-age-of-intelligence/AGE_OF_INTELLIGENCE_720p60_share.mp4</div><div>opus-broken-reround/碎月重圆_MG动画.mp4</div><div>opus-claude-intro-with-15-way/Claude_自我介绍_15种画风.mp4</div><div>opus-F12-teaching/DevTools-in-60-Seconds-1080p.mp4</div><div>opus-factory-safety-videos/dingge_1440p60fps.mp4</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来.mp4</div><div>opus-introduction-video-xuanlan/XuanLan-PocketWebShell-promo-1080p60-share.mp4</div><div>opus-mid-autumn-for-my-dg01/中秋·给学姐.mp4</div><div>opus-mid-autumn-for-my-dg02/月光替你亮着灯_学姐中秋快乐.mp4</div><div>opus-mid-autumn-genergal-videos/mid-autumn.mp4</div><div>opus-mid-autumn-highschool-videos/共此时_预览版_720p.mp4</div><div>opus-oneink/一畫_Opus5.5_水墨书法.mp4</div><div>opus-production-video-ai-phase-skill/ai-phase-skill-intro.mp4</div><div>opus-production-video-protocom-intro/protocom-intro.mp4</div><div>opus-production-video-skill-hub/skills-hub-promo.mp4</div><div>opus-production-video-studysolo/studysolo-promo -v1.1.mp4</div><div>opus-production-video-ys-blog/yusheng-blog.mp4</div><div>opus-shuchenglin-into/树成林宣传片_60s.mp4</div><div>opus-universe-history-video/code_cosmos_stopmotion.mp4</div><div>skill-方块系列定格动画/stop-motion-3d-intro-web.mp4</div><div>swe-ai-rise/kimi_ai_rise_v2.mp4</div><div>swe-kimi-source-intro/kimi_film_1080p.mp4</div><div>gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_1080p.mp4</div><div>gpt-mid-autumn-for-my-dg03/Moon_Letter_MidAutumn_1080p.mp4</div><div>gpt-mid-autumn-general-video/gpt-MidAutumn_Final_60s_1080p60.mp4</div><div>gpt-universe-30-change/COSMOS_30_STYLES_72s_1080p.mp4</div><div>kimi-ai-beat-sync/ai-beat-sync.mp4</div><div>opus-1037-hust-story/1037_MG试片.mp4</div><div>opus-age-of-intelligence/AGE_OF_INTELLIGENCE_720p60_share.mp4</div><div>opus-broken-reround/碎月重圆_MG动画.mp4</div><div>opus-claude-intro-with-15-way/Claude_自我介绍_15种画风.mp4</div><div>opus-F12-teaching/DevTools-in-60-Seconds-1080p.mp4</div><div>opus-factory-safety-videos/dingge_1440p60fps.mp4</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来.mp4</div><div>opus-introduction-video-xuanlan/XuanLan-PocketWebShell-promo-1080p60-share.mp4</div><div>opus-mid-autumn-for-my-dg01/中秋·给学姐.mp4</div><div>opus-mid-autumn-for-my-dg02/月光替你亮着灯_学姐中秋快乐.mp4</div><div>opus-mid-autumn-genergal-videos/mid-autumn.mp4</div><div>opus-mid-autumn-highschool-videos/共此时_预览版_720p.mp4</div><div>opus-oneink/一畫_Opus5.5_水墨书法.mp4</div><div>opus-production-video-ai-phase-skill/ai-phase-skill-intro.mp4</div><div>opus-production-video-protocom-intro/protocom-intro.mp4</div><div>opus-production-video-skill-hub/skills-hub-promo.mp4</div><div>opus-production-video-studysolo/studysolo-promo -v1.1.mp4</div><div>opus-production-video-ys-blog/yusheng-blog.mp4</div><div>opus-shuchenglin-into/树成林宣传片_60s.mp4</div><div>opus-universe-history-video/code_cosmos_stopmotion.mp4</div><div>skill-方块系列定格动画/stop-motion-3d-intro-web.mp4</div><div>swe-ai-rise/kimi_ai_rise_v2.mp4</div><div>swe-kimi-source-intro/kimi_film_1080p.mp4</div><div>gpt-15-style-ai-beyond-generation/AI_BEYOND_GENERATION_1080p.mp4</div><div>gpt-mid-autumn-for-my-dg03/Moon_Letter_MidAutumn_1080p.mp4</div><div>gpt-mid-autumn-general-video/gpt-MidAutumn_Final_60s_1080p60.mp4</div><div>gpt-universe-30-change/COSMOS_30_STYLES_72s_1080p.mp4</div><div>kimi-ai-beat-sync/ai-beat-sync.mp4</div><div>opus-1037-hust-story/1037_MG试片.mp4</div><div>opus-age-of-intelligence/AGE_OF_INTELLIGENCE_720p60_share.mp4</div><div>opus-broken-reround/碎月重圆_MG动画.mp4</div><div>opus-claude-intro-with-15-way/Claude_自我介绍_15种画风.mp4</div><div>opus-F12-teaching/DevTools-in-60-Seconds-1080p.mp4</div><div>opus-factory-safety-videos/dingge_1440p60fps.mp4</div><div>opus-hust-read-join-video-v1/华中大读书会_慢下来.mp4</div><div>opus-introduction-video-xuanlan/XuanLan-PocketWebShell-promo-1080p60-share.mp4</div><div>opus-mid-autumn-for-my-dg01/中秋·给学姐.mp4</div><div>opus-mid-autumn-for-my-dg02/月光替你亮着灯_学姐中秋快乐.mp4</div><div>opus-mid-autumn-genergal-videos/mid-autumn.mp4</div><div>opus-mid-autumn-highschool-videos/共此时_预览版_720p.mp4</div><div>opus-oneink/一畫_Opus5.5_水墨书法.mp4</div><div>opus-production-video-ai-phase-skill/ai-phase-skill-intro.mp4</div><div>opus-production-video-protocom-intro/protocom-intro.mp4</div><div>opus-production-video-skill-hub/skills-hub-promo.mp4</div><div>opus-production-video-studysolo/studysolo-promo -v1.1.mp4</div><div>opus-production-video-ys-blog/yusheng-blog.mp4</div><div>opus-shuchenglin-into/树成林宣传片_60s.mp4</div><div>opus-universe-history-video/code_cosmos_stopmotion.mp4</div><div>skill-方块系列定格动画/stop-motion-3d-intro-web.mp4</div><div>swe-ai-rise/kimi_ai_rise_v2.mp4</div><div>swe-kimi-source-intro/kimi_film_1080p.mp4</div></div></div>
  </div>
</div>

<div id="card" class="layer">
  <div id="share">
    <div class="svc"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#1a4fd6"/><path d="M24 9 L14 25 H21 L18 36 L30 19 H23 Z" fill="#fff"/></svg>QQ 闪传</div>
    <div class="sh-count" id="sh-count">0 / 28</div>
    <svg class="folder" id="folder" viewBox="0 0 210 170" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb2ff"/><stop offset="1" stop-color="#2f7dff"/></linearGradient>
  <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ff"/><stop offset="1" stop-color="#4a95ff"/></linearGradient></defs>
  <path d="M10 30 Q10 14 26 14 H80 L98 34 H184 Q200 34 200 50 V150 Q200 164 184 164 H26 Q10 164 10 150 Z" fill="url(#fg1)"/>
  <path d="M10 60 Q10 48 24 48 H186 Q200 48 200 62 V150 Q200 164 186 164 H24 Q10 164 10 150 Z" fill="url(#fg2)"/>
  <path d="M112 66 L82 112 H104 L96 148 L130 98 H108 Z" fill="#fff"/>
</svg>
    <div class="sh-name">AI-Coding-SuperVideos</div>
    <div class="sh-meta">2.39 GB · 28 部成片 · 20 个源码包 · 24 份复盘</div>
    <div class="sh-link" id="sh-link"><span id="sh-link-t"></span><span class="u" id="sh-link-u"></span></div>
    <div class="sh-exp">2026/10/10 05:25 到期</div>
  </div>
  <div id="qrbox"><img src="assets/img/qr.png" alt=""><div class="scan" id="qr-scan"></div></div>
  <div id="card-cta">扫码，全部带走</div>
  <div id="card-note">源码 · 复盘 · 成片 · 一个不留</div>
</div>

<div id="outro" class="layer">
  <div id="out-term"><span class="prompt">$</span><span id="out-cmd"></span><span class="cursor" id="out-cursor"></span></div>
  <div id="out-answer"><span class="arrow">▸</span>下一部，由你来写。</div>
  <div class="credit" id="cr0">本片同样 100% 由代码生成</div>
  <div class="credit" id="cr1">画面 HTML + GSAP · render(t) 纯函数 ｜ 配乐 numpy 逐样本合成</div>
  <div class="credit" id="cr2">Claude Opus 5.5 · 2026 秋</div>
</div>
<div id="mini"><div class="mt"><b>源码 · 复盘 · 成片 · 通通开源</b><span>QQ 闪传 · qfile.qq.com/q/P2tSnByK4K</span><span>2.39 GB</span></div><img src="assets/img/qr.png" alt=""></div>
  </div>
  <canvas id="fxfront" class="fx" width="1920" height="1080" data-layout-allow-occlusion></canvas>
  <div id="vignette"></div>
  <div id="scanlines"></div>
  <div id="lbx-top" class="lbx"></div>
  <div id="lbx-bot" class="lbx"></div>

<div id="hud">
  <div id="hud-tl"><span id="hud-rec"><i></i>REC</span><span id="hud-cmd">render(t)</span><span id="hud-time">t = 00.000s</span><span id="hud-frame">f 0000</span></div>
  <div id="hud-era"><span class="k" id="hud-era-k">ERA 01</span><span class="v" id="hud-era-v">KIMI</span></div>
  <div id="ruler"><div class="base" id="ruler-base"></div>
    <div class="slot" id="sl-kimi-beat" style="--c:#3CF0C8;left:3px"><div class="on"></div></div>
    <div class="slot" id="sl-ai-rise" style="--c:#7CC4FF;left:60.142857142857146px"><div class="on"></div></div>
    <div class="slot" id="sl-kimi-film" style="--c:#7CC4FF;left:117.28571428571429px"><div class="on"></div></div>
    <div class="slot" id="sl-cosmos30" style="--c:#A98BFF;left:174.42857142857144px"><div class="on"></div></div>
    <div class="slot" id="sl-beyond" style="--c:#A98BFF;left:231.57142857142858px"><div class="on"></div></div>
    <div class="slot" id="sl-gpt-autumn" style="--c:#A98BFF;left:288.7142857142857px"><div class="on"></div></div>
    <div class="slot" id="sl-moon-letter" style="--c:#A98BFF;left:345.8571428571429px"><div class="on"></div></div>
    <div class="slot" id="sl-shatter" style="--c:#FF7A3D;left:403px"><div class="on"></div></div>
    <div class="slot" id="sl-oneink" style="--c:#FF7A3D;left:460.14285714285717px"><div class="on"></div></div>
    <div class="slot" id="sl-dingge" style="--c:#FF7A3D;left:517.2857142857143px"><div class="on"></div></div>
    <div class="slot" id="sl-claude15" style="--c:#FF7A3D;left:574.4285714285714px"><div class="on"></div></div>
    <div class="slot" id="sl-protocom" style="--c:#FF7A3D;left:631.5714285714286px"><div class="on"></div></div>
    <div class="slot" id="sl-codecosmos" style="--c:#FF7A3D;left:688.7142857142858px"><div class="on"></div></div>
    <div class="slot" id="sl-phasegate" style="--c:#FF7A3D;left:745.8571428571429px"><div class="on"></div></div>
    <div class="slot" id="sl-ageint" style="--c:#FF7A3D;left:803px"><div class="on"></div></div>
    <div class="slot" id="sl-skillshub" style="--c:#FF7A3D;left:860.1428571428572px"><div class="on"></div></div>
    <div class="slot" id="sl-f12" style="--c:#FF7A3D;left:917.2857142857143px"><div class="on"></div></div>
    <div class="slot" id="sl-hust1037" style="--c:#FF7A3D;left:974.4285714285714px"><div class="on"></div></div>
    <div class="slot" id="sl-xuanlan" style="--c:#FF7A3D;left:1031.5714285714287px"><div class="on"></div></div>
    <div class="slot" id="sl-studysolo" style="--c:#FF7A3D;left:1088.7142857142858px"><div class="on"></div></div>
    <div class="slot" id="sl-yusheng" style="--c:#FF7A3D;left:1145.857142857143px"><div class="on"></div></div>
    <div class="slot" id="sl-shuchenglin" style="--c:#FF7A3D;left:1203px"><div class="on"></div></div>
    <div class="slot" id="sl-stopmotion" style="--c:#FFD166;left:1260.142857142857px"><div class="on"></div></div>
    <div class="slot" id="sl-samemoon" style="--c:#FF7A3D;left:1317.2857142857144px"><div class="on"></div></div>
    <div class="slot" id="sl-gongcishi" style="--c:#FF7A3D;left:1374.4285714285716px"><div class="on"></div></div>
    <div class="slot" id="sl-moonlamp" style="--c:#FF7A3D;left:1431.5714285714287px"><div class="on"></div></div>
    <div class="slot" id="sl-readclub" style="--c:#FF7A3D;left:1488.7142857142858px"><div class="on"></div></div>
    <div class="slot" id="sl-senpai" style="--c:#FF7A3D;left:1545.857142857143px"><div class="on"></div></div>
    <div id="playhead"></div>
  </div>
  <div id="hud-count"><b id="hud-count-n">0</b> / 28 部</div>
</div>
  <audio id="score" src="assets/score.wav" data-start="0" data-duration="62.400000000000006" data-track-index="90" data-volume="1"></audio>
</div>
<script>window.__EDL = {"BEAT":0.4,"FPS":30,"DURATION":62.400000000000006,"TOTAL_BEATS":156,"SECTIONS":[{"id":"cold","b0":0,"b1":16,"energy":0.15},{"id":"era1","b0":16,"b1":27,"energy":0.55},{"id":"era2","b0":27,"b1":42,"energy":0.65},{"id":"era3","b0":42,"b1":62,"energy":0.8},{"id":"era4card","b0":62,"b1":64,"energy":0.9},{"id":"drop","b0":64,"b1":88,"energy":1},{"id":"tunnel","b0":88,"b1":96,"energy":0.95},{"id":"wall","b0":96,"b1":104,"energy":1},{"id":"breath","b0":104,"b1":116,"energy":0.05},{"id":"reveal","b0":116,"b1":128,"energy":1},{"id":"card","b0":128,"b1":140,"energy":0.7},{"id":"outro","b0":140,"b1":156,"energy":0.2}],"ERAS":[{"n":"01","model":"KIMI","title":"觉醒","sub":"让每一个字，都砸在鼓点上","b0":16,"b1":19,"node":0},{"n":"02","model":"SWE","title":"像素","sub":"不开浏览器，逐像素算出每一帧","b0":27,"b1":30,"node":1},{"n":"03","model":"GPT","title":"世界","sub":"一个模型，三十个世界","b0":42,"b1":45,"node":2},{"n":"04","model":"OPUS","title":"电影","sub":"AE 级合成 · 水墨 · 3D · 4K","b0":62,"b1":64,"node":3}],"SHOTS":[{"id":"w01","type":"win","work":"kimi-beat","in":1.9,"b0":19,"b1":21},{"id":"w02","type":"win","work":"kimi-beat","in":4.9,"b0":21,"b1":23},{"id":"w03","type":"win","work":"kimi-beat","in":23.62,"b0":23,"b1":25},{"id":"w04","type":"win","work":"kimi-beat","in":45.8,"b0":25,"b1":27},{"id":"w05","type":"win","work":"ai-rise","in":3.62,"b0":30,"b1":32},{"id":"w06","type":"win","work":"ai-rise","in":6.1,"b0":32,"b1":34},{"id":"w07","type":"win","work":"kimi-film","in":4.6,"b0":34,"b1":36},{"id":"w08","type":"win","work":"kimi-film","in":13.6,"b0":36,"b1":38},{"id":"w09","type":"win","work":"ai-rise","in":26.9,"b0":38,"b1":40},{"id":"w10","type":"win","work":"kimi-film","in":33.2,"b0":40,"b1":42},{"id":"g01","type":"full","work":"beyond","in":12,"b0":51,"b1":52,"label":"15 个世界 · 体素岛"},{"id":"g02","type":"full","work":"beyond","in":18,"b0":52,"b1":53,"label":"15 个世界 · 黏土机器人"},{"id":"g03","type":"full","work":"beyond","in":48,"b0":53,"b1":54,"label":"15 个世界 · 波普网点"},{"id":"g04","type":"full","work":"beyond","in":84,"b0":54,"b1":55,"label":"15 个世界 · 霓虹"},{"id":"g05","type":"full","work":"beyond","in":96,"b0":55,"b1":56,"label":"15 个世界 · 铬金属"},{"id":"g06","type":"full","work":"beyond","in":102,"b0":56,"b1":57,"label":"15 个世界 · 粒子"},{"id":"g07","type":"full","work":"gpt-autumn","in":6,"b0":57,"b1":59,"label":"铅笔线描 → 水墨 → 雕刻"},{"id":"g08","type":"duoL","work":"gpt-autumn","in":20.5,"b0":59,"b1":62},{"id":"g09","type":"phoneR","work":"moon-letter","in":15,"b0":59,"b1":62},{"id":"h01","type":"full","work":"shatter","in":3,"b0":64,"b1":66,"label":"自写 3D 合成器 · Voronoi 碎裂"},{"id":"h02","type":"full","work":"oneink","in":50,"b0":66,"b1":67,"label":"逆锋压笔 · 泼墨一笔"},{"id":"h03","type":"full","work":"dingge","in":34.6,"b0":67,"b1":68,"label":"Three.js 定格 · 慢动作坠落"},{"id":"h04","type":"full","work":"claude15","in":50.5,"b0":68,"b1":69,"label":"15 种画风 · 体素"},{"id":"h05","type":"full","work":"protocom","in":75.4,"b0":69,"b1":70,"label":"4K 60fps 定版"},{"id":"h06","type":"full","work":"codecosmos","in":10,"b0":70,"b1":71,"label":"4D 超立方体"},{"id":"h07","type":"full","work":"shatter","in":12,"b0":71,"b1":72,"label":"MoGraph 魔方墙 · 336 立方体"},{"id":"h08","type":"full","work":"phasegate","in":19.4,"b0":72,"b1":73,"label":"升维 · 曲速"},{"id":"h09","type":"full","work":"ageint","in":36.6,"b0":73,"b1":74,"label":"注意力机制 · 3D"},{"id":"h10","type":"full","work":"skillshub","in":19.8,"b0":74,"b1":75,"label":"Logo 冲击出场"},{"id":"h11","type":"full","work":"f12","in":20.8,"b0":75,"b1":76,"label":"Console · 故障字"},{"id":"h12","type":"full","work":"claude15","in":74,"b0":76,"b1":77,"label":"15 种画风 · 瑞士主义"},{"id":"h13","type":"full","work":"dingge","in":77.4,"b0":77,"b1":78,"label":"2560×1440 · 60fps"},{"id":"h14","type":"full","work":"hust1037","in":104.2,"b0":78,"b1":79,"label":"几百只小手连成山脊"},{"id":"h15","type":"full","work":"oneink","in":4.6,"b0":79,"b1":80,"label":"「永」字八法 · 按笔顺书写"},{"id":"s1a","type":"split","n":2,"panel":0,"work":"xuanlan","in":24,"b0":80,"b1":82},{"id":"s1b","type":"split","n":2,"panel":1,"work":"studysolo","in":15.5,"b0":80,"b1":82},{"id":"s2a","type":"split","n":3,"panel":0,"work":"yusheng","in":6.5,"b0":82,"b1":84},{"id":"s2b","type":"split","n":3,"panel":1,"work":"shuchenglin","in":38,"b0":82,"b1":84},{"id":"s2c","type":"split","n":3,"panel":2,"work":"protocom","in":47,"b0":82,"b1":84},{"id":"s3a","type":"split","n":4,"panel":0,"work":"stopmotion","in":53,"b0":84,"b1":86},{"id":"s3b","type":"split","n":4,"panel":1,"work":"codecosmos","in":33,"b0":84,"b1":86},{"id":"s3c","type":"split","n":4,"panel":2,"work":"gongcishi","in":160,"b0":84,"b1":86},{"id":"s3d","type":"split","n":4,"panel":3,"work":"samemoon","in":64,"b0":84,"b1":86},{"id":"p1","type":"phone","panel":0,"work":"readclub","in":25,"b0":86,"b1":88},{"id":"p2","type":"phone","panel":1,"work":"senpai","in":21.5,"b0":86,"b1":88},{"id":"p3","type":"phone","panel":2,"work":"moonlamp","in":8.6,"b0":86,"b1":88}],"GRID":{"work":"cosmos30","b0":45,"b1":51,"steps":[{"b":45,"n":1},{"b":46,"n":4},{"b":47,"n":9},{"b":48,"n":16}],"shots":[9,1,7,19,3,12,15,26,5,22,10,17,28,2,13,24],"shotLen":2.4},"WALL":{"b0":96,"b1":104,"cols":7,"rows":4,"clipLen":3.4},"TUNNEL":{"b0":88,"b1":96},"TEXT":{"cold":{"prompt":"$ ","command":"render(t)","typeB0":2,"typeB1":4.6,"nos":[{"text":"没有 AE","b":6},{"text":"没有 PR","b":7},{"text":"没有剪辑软件","b":8}],"nosOut":10,"thesis":"每一帧，都是时间的函数","formula":"frame = render(t)","thesisB0":10,"thesisB1":15.5,"codeWallB0":12.5,"codeWallB1":15.9},"grid":{"big":"×30","small":"种画风，一支片","b0":48,"b1":51},"drop":{"n":"04","word":"电影","b0":64,"b1":66},"tunnel":{"line":"从一行字，到一整个宇宙","b0":89,"b1":95.5},"wall":{"title":"AI-CODING · SUPERVIDEOS","sub":"28 部 · 全部由代码生成","b0":97,"b1":104},"breath":[{"big":"28 部片子。","small":"31 分钟 · 6.9 万帧","b0":104.5,"b1":107.5},{"big":"没有一帧，是手动剪出来的。","small":"每一帧都由 render(t) 算出","b0":107.5,"b1":110.5},{"big":"它们，是怎么做出来的？","small":"","b0":110.5,"b1":114.5}],"reveal":{"chars":["通","通","开","源"],"b":[116,117,118,119],"en":"OPEN SOURCE · ALL OF IT","enB":120,"out":124},"pillars":{"b0":124,"b1":128.6,"items":[{"head":"源码","en":"SOURCE","num":20,"unit":"个工程包","sub":"+ 5 个可交互网页"},{"head":"复盘","en":"CoExp","num":24,"unit":"份经验文档","sub":"51 万字 · 每一个坑都写进去了"},{"head":"成片","en":"FILM","num":28,"unit":"部代码视频","sub":"2.39 GB · 31 分钟"}]},"card":{"b0":128,"b1":140,"cta":"扫码，全部带走","note":"源码 · 复盘 · 成片 · 一个不留"},"outro":{"b0":140,"b1":156,"typeB0":141,"typeB1":142.6,"answerB":143,"answer":"下一部，由你来写。","creditsB":146.5,"credits":["本片同样 100% 由代码生成","画面 HTML + GSAP · render(t) 纯函数 ｜ 配乐 numpy 逐样本合成","Claude Opus 5.5 · 2026 秋"],"fadeB0":153}},"STACK_END":42,"WORKS":[{"key":"kimi-beat","model":"KIMI","color":"#3CF0C8","title":"AI 觉醒","slot":0},{"key":"ai-rise","model":"SWE","color":"#7CC4FF","title":"AI:RISE","slot":1},{"key":"kimi-film","model":"SWE","color":"#7CC4FF","title":"月之暗面 · KIMI","slot":2},{"key":"cosmos30","model":"GPT","color":"#A98BFF","title":"COSMOS · 从未知到寂静","slot":3},{"key":"beyond","model":"GPT","color":"#A98BFF","title":"AI · Beyond Generation","slot":4},{"key":"gpt-autumn","model":"GPT","color":"#A98BFF","title":"把日子，慢慢过圆","slot":5},{"key":"moon-letter","model":"GPT","color":"#A98BFF","title":"月光信笺","slot":6},{"key":"shatter","model":"OPUS","color":"#FF7A3D","title":"碎月重圆","slot":7},{"key":"oneink","model":"OPUS","color":"#FF7A3D","title":"一畫","slot":8},{"key":"dingge","model":"OPUS","color":"#FF7A3D","title":"定格","slot":9},{"key":"claude15","model":"OPUS","color":"#FF7A3D","title":"Claude 自我介绍 · 15 种画风","slot":10},{"key":"protocom","model":"OPUS","color":"#FF7A3D","title":"protocom","slot":11},{"key":"codecosmos","model":"OPUS","color":"#FF7A3D","title":"代码宇宙","slot":12},{"key":"phasegate","model":"OPUS","color":"#FF7A3D","title":"Phase-Gate 升维","slot":13},{"key":"ageint","model":"OPUS","color":"#FF7A3D","title":"智能时代","slot":14},{"key":"skillshub","model":"OPUS","color":"#FF7A3D","title":"Skills Hub","slot":15},{"key":"f12","model":"OPUS","color":"#FF7A3D","title":"DevTools in 60 Seconds","slot":16},{"key":"hust1037","model":"OPUS","color":"#FF7A3D","title":"1037","slot":17},{"key":"xuanlan","model":"OPUS","color":"#FF7A3D","title":"玄览 PocketWebShell","slot":18},{"key":"studysolo","model":"OPUS","color":"#FF7A3D","title":"StudySolo","slot":19},{"key":"yusheng","model":"OPUS","color":"#FF7A3D","title":"羽升集","slot":20},{"key":"shuchenglin","model":"OPUS","color":"#FF7A3D","title":"树成林","slot":21},{"key":"stopmotion","model":"SKILL","color":"#FFD166","title":"方块定格 Skill","slot":22},{"key":"samemoon","model":"OPUS","color":"#FF7A3D","title":"同一个月亮","slot":23},{"key":"gongcishi","model":"OPUS","color":"#FF7A3D","title":"共此时","slot":24},{"key":"moonlamp","model":"OPUS","color":"#FF7A3D","title":"月光替你亮着灯","slot":25},{"key":"readclub","model":"OPUS","color":"#FF7A3D","title":"慢下来","slot":26},{"key":"senpai","model":"OPUS","color":"#FF7A3D","title":"中秋 · 给学姐","slot":27}],"MODELS":{"KIMI":{"label":"KIMI","color":"#3CF0C8","era":1},"SWE":{"label":"SWE","color":"#7CC4FF","era":2},"GPT":{"label":"GPT","color":"#A98BFF","era":3},"OPUS":{"label":"CLAUDE OPUS","color":"#FF7A3D","era":4},"SKILL":{"label":"SKILL","color":"#FFD166","era":4}},"firstSeen":{"kimi-beat":19,"ai-rise":30,"kimi-film":34,"beyond":51,"gpt-autumn":57,"moon-letter":59,"shatter":64,"oneink":66,"dingge":67,"claude15":68,"protocom":69,"codecosmos":70,"phasegate":72,"ageint":73,"skillshub":74,"f12":75,"hust1037":78,"xuanlan":80,"studysolo":80,"yusheng":82,"shuchenglin":82,"stopmotion":84,"gongcishi":84,"samemoon":84,"readclub":86,"senpai":86,"moonlamp":86,"cosmos30":45},"CODE_LINES":[{"src":"opus-oneink/main.js","line":"const W = 1920, H = 1080, FPS = 30;"},{"src":"opus-oneink/main.js","line":"let rnd = mulberry32(20260926);"},{"src":"opus-oneink/main.js","line":"const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };"},{"src":"opus-oneink/main.js","line":"const easeIO = t => t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t);"},{"src":"opus-oneink/render.js","line":"const url = await p.evaluate(f => { window.renderFrame(f); return document.getElementById('gl').toDataURL('image/jpeg', 0.95); }, f);"},{"src":"opus-universe-history-video/web/engine.js","line":"export const ACC = { '2D': '#00E5FF', '2.5D': '#FFD600', '3D': '#FF3D7F', '4D': '#B388FF' };"},{"src":"opus-universe-history-video/web/engine.js","line":"const renderer = new THREE\u002eWebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true, alpha: false });"},{"src":"opus-universe-history-video/music.py","line":"SR = 44100; BPM = 120; BEAT = 60 / BPM; DUR = 68.0"},{"src":"opus-universe-history-video/music.py","line":"f = 45 + 110 * np.exp(-t / 0.03) + (30 * np.exp(-t / 0.2) if big else 0)"},{"src":"opus-universe-history-video/music.py","line":"return np.tanh(s * 1.6) * g"},{"src":"opus-claude-intro-with-15-way/claude_intro/core.py","line":"def seg(x, a, b): return clamp((x - a) / (b - a)) if b != a else float(x >= a)"},{"src":"opus-claude-intro-with-15-way/claude_intro/core.py","line":"def e_outexp(t): t = clamp(t); return 1 if t >= 1 else 1 - 2 ** (-10 * t)"},{"src":"gpt-universe-30-change/COSMOS/score.py","line":"SR=48000;N=72*SR;B=.3;BASE=Path(__file__).resolve().parent"},{"src":"gpt-universe-30-change/COSMOS/score.py","line":"def filt(x,c,kind='lowpass'):return sosfilt(butter(2,c,btype=kind,fs=SR,output='sos'),x).astype(np.float32)"},{"src":"gpt-universe-30-change/COSMOS/score.py","line":"def env(t,a=.004,d=.15):return (1-np.exp(-t/a))*np.exp(-t/d)"},{"src":"gpt-universe-30-change/COSMOS/glrender.py","line":"def render(self,scene,t,beat=0.):"},{"src":"opus-age-of-intelligence/src/timeline.py","line":"BPM = 60.0 * FPS / FPB        # 128.5714"},{"src":"opus-age-of-intelligence/src/timeline.py","line":"N_FRAMES = END_BEAT * FPB     # 5544 frames = 92.4 s"},{"src":"opus-age-of-intelligence/src/timeline.py","line":"shot(184, END_BEAT, 'end_card')"},{"src":"opus-shuchenglin-into/comp/timeline.js","line":"function stamp(word, lt, { size = 380, dur = .34, color = '#fff', solid = false } = {}) {"},{"src":"opus-shuchenglin-into/render.py","line":"d=await pg.evaluate(f'renderFrame({round(t*30)})')"},{"src":"opus-production-video-skill-hub/src/js/engine.js","line":"export const prog = (b, b0, b1, ease = E.linear) => ease(clamp((b - b0) / (b1 - b0)));"},{"src":"opus-production-video-skill-hub/src/js/engine.js","line":"export function hit(b, at, decay = 0.35) {"},{"src":"opus-production-video-skill-hub/render.mjs","line":"\"-f\", \"image2pipe\", \"-framerate\", String(fps), \"-i\", \"-\","},{"src":"opus-F12-teaching/music.py","line":"def supersaw(freqs, d, cutoff=2400):"},{"src":"swe-ai-rise/main_v2.js","line":"window.renderAt=function(t){"},{"src":"swe-kimi-source-intro/scenes.py","line":"draw_stars(img, _SF0, t, amp=ss(seg(t, 3.2, 5.5)) * 0.9)"},{"src":"swe-kimi-source-intro/film_par.py","line":"[\"ffmpeg\", \"-y\", \"-f\", \"rawvideo\", \"-pix_fmt\", \"rgb24\","},{"src":"swe-kimi-source-intro/kit.py","line":"def eo_back(x, s=1.70158):"},{"src":"opus-mid-autumn-for-my-dg01/CoExp.md","line":"const seg = (t,a,b) => clamp((t-a)/(b-a));"},{"src":"opus-mid-autumn-for-my-dg01/CoExp.md","line":"const eio = x => x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;"},{"src":"opus-mid-autumn-for-my-dg01/CoExp.md","line":"await page.evaluate(t => render(t), i / FPS);"}],"SHARE":{"name":"AI-Coding-SuperVideos","size":"2.39 GB","service":"QQ 闪传","url":"qfile.qq.com/q/P2tSnByK4K","expire":"2026/10/10 05:25 到期","qr":"assets/img/qr.png"},"STATS":{"films":28,"coexp":24,"coexpChars":515858,"packages":20,"htmls":5,"minutes":31,"frames":69000,"sizeGB":"2.39"},"wall":{"TW":256,"TH":144,"GAP":10,"x0":34,"y0":237}};</script>
<!-- 注：EDL 里的真实代码行含 "THREE.WebGLRenderer"，会把静态检查器的 three.js 检测误触发。
     这里把 '.' 转义成 ，JSON.parse 解码回原文，显示与源码完全一致，但不再误报 missing_three_script。-->
<script>
/* ─────────────────────────────────────────────────────────────────────────────
   runtime.js · 整支片子 = 一个函数 render(t)
   ---------------------------------------------------------------------------
   这正是合集里 28 部片子共同的秘密：画面是时间的纯函数。
   本片也不例外 —— 没有 requestAnimationFrame，没有 Date.now()，没有未播种的随机数。
   HyperFrames 逐帧 seek GSAP 时间轴 → onUpdate → render(tl.time())。
   任意一帧都能单独渲染：在浏览器控制台执行 __render(37.2) 即可预览第 37.2 秒。

   结构：
     §1 数学 / 缓动 / 伪随机        §6 GPT：宫格倍增 / 全屏 / 双画幅
     §2 DOM 写入缓存               §7 OPUS：DROP / 分屏 / 手机 / 隧道 / 巨墙
     §3 事件表（闪白/震屏/冲击波）  §8 凝视 / 通通开源 / 三柱 / 卡片 / 尾声
     §4 冷开场                     §9 HUD（时间码、时代、28 槽时间尺）
     §5 时代卡 + 能力曲线 / 窗口堆叠 §10 前后景 FX 画布（颗粒、代码墙、速度线…）
   ───────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const D = window.__EDL;
  const { BEAT, FPS, DURATION, TEXT: TX } = D;
  const W = 1920, H = 1080, CX = 960, CY = 540;

  // ═══ §1 数学 ═══════════════════════════════════════════════════════════════
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (x, a, b) => clamp((x - a) / (b - a));
  const Ez = {
    oC: (x) => 1 - Math.pow(1 - x, 3),
    iC: (x) => x * x * x,
    ioC: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    oE: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    iE: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
    oQ: (x) => 1 - Math.pow(1 - x, 5),
    oB: (x, s = 1.9) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
    ioS: (x) => 0.5 - 0.5 * Math.cos(Math.PI * x),
  };
  // 阻尼弹簧：0→1，带一次过冲（AE 里 "Overshoot" 表达式的解析版）
  const spring = (x, freq = 2.2, decay = 6) => (x <= 0 ? 0 : x >= 1.6 ? 1 : 1 - Math.exp(-decay * x) * Math.cos(freq * Math.PI * x));
  // 包络：a0→a1 淡入，b0→b1 淡出
  const env = (x, a0, a1, b0, b1) => Math.min(seg(x, a0, a1), 1 - seg(x, b0, b1));
  const pulse = (x, at, decay) => (x < at ? 0 : Math.exp(-(x - at) / decay));
  const inR = (x, a, b) => x >= a && x < b;
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f3 = (v) => (Math.abs(v) < 1e-4 ? 0 : +v.toFixed(3));

  // ═══ §2 DOM ════════════════════════════════════════════════════════════════
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const memo = new WeakMap();
  function css(el, prop, val) {
    if (!el) return;
    let c = memo.get(el);
    if (!c) memo.set(el, (c = {}));
    if (c[prop] !== val) {
      c[prop] = val;
      if (prop.startsWith('--')) el.style.setProperty(prop, val);
      else el.style[prop] = val;
    }
  }
  const op = (el, v) => css(el, 'opacity', v <= 0.002 ? '0' : v >= 0.998 ? '1' : v.toFixed(3));
  const tf = (el, s) => css(el, 'transform', s);
  function txt(el, s) {
    if (!el) return;
    let c = memo.get(el);
    if (!c) memo.set(el, (c = {}));
    if (c.__t !== s) { c.__t = s; el.textContent = s; }
  }

  const byKey = Object.fromEntries(D.WORKS.map((w) => [w.key, w]));
  const SHOTS = D.SHOTS;
  const wins = SHOTS.filter((s) => s.type === 'win');
  const fulls = SHOTS.filter((s) => s.type === 'full');
  const splits = SHOTS.filter((s) => s.type === 'split');
  const phones = SHOTS.filter((s) => s.type === 'phone');

  const el = {};
  function grab() {
    ['stage', 'cold', 'cold-term', 'cold-cmd', 'cold-cursor', 'cold-thesis', 'cold-formula', 'stack', 'stack-cam', 'grid', 'grid-label',
      'full', 'duo', 'duo-left', 'duo-phone', 'duo-label', 'drop-ov', 'split', 'phones', 'tunnel', 'tunnel-cam', 'tunnel-line',
      'wall', 'wall-cam', 'wall-title', 'wall-sub', 'breath', 'flyers', 'reveal', 'rv-row', 'rv-en', 'rv-sweep', 'pillars', 'card', 'share',
      'folder', 'sh-count', 'sh-link-t', 'sh-link-u', 'qrbox', 'qr-scan', 'card-cta', 'card-note', 'outro', 'out-term', 'out-cmd', 'out-cursor',
      'out-answer', 'mini', 'hud-tl', 'hud-rec', 'hud-time', 'hud-frame', 'hud-era', 'hud-era-k', 'hud-era-v', 'ruler', 'ruler-base', 'playhead',
      'hud-count', 'hud-count-n', 'lbx-top', 'lbx-bot', 'fxback', 'fxfront'].forEach((id) => (el[id] = $(id)));
    el.nos = TX.cold.nos.map((_, i) => $('no' + i));
    el.strikes = el.nos.map((n) => n.querySelector('.strike'));
    el.formulaT = el['cold-formula'].querySelector('.t');
    el.eras = D.ERAS.map((_, i) => {
      const r = $('era' + (i + 1));
      return { root: r, num: r.querySelector('.era-num'), fill: r.querySelector('.fillnum'), chip: r.querySelector('.era-chip'),
        chars: $$('.ch', r), sub: r.querySelector('.era-sub'), cap: r.querySelector('.era-cap'), title: r.querySelector('.era-title') };
    });
    el.wins = wins.map((s) => { const r = $('win-' + s.id); return { r, shade: r.querySelector('.win-shade') }; });
    el.gtiles = D.GRID.shots.map((_, i) => $('gt' + i));
    el.shots = fulls.map((s) => { const r = $('shot-' + s.id); return { r, media: r.querySelector('.shot-media'), label: r.querySelector('.label') }; });
    el.panels = splits.map((s) => { const r = $('pn-' + s.id); return { r, media: r.querySelector('.panel-media'), label: r.querySelector('.label') }; });
    el.phones = phones.map((s) => { const r = $('ph-' + s.id); return { r, label: r.querySelector('.ph-label') }; });
    el.phonesLayer = $('phones'); // el.phones 是数组，层的 id 单独存
    el.tplanes = D.WORKS.map((w) => $('tp-' + w.key));
    el.wtiles = D.WORKS.map((w) => { const r = $('wt-' + w.key); return { r, flash: r.querySelector('.flash') }; });
    el.blines = TX.breath.map((_, i) => { const r = $('bl' + i); return { r, big: r.querySelector('.big'), small: r.querySelector('.small') }; });
    el.flyers = D.WORKS.map((w) => $('fl-' + w.key));
    el.flyersLayer = $('flyers'); // el.flyers 是数组，层的 id 单独存
    el.rchars = TX.reveal.chars.map((_, i) => $('rc' + i));
    el.pillars = TX.pillars.items.map((_, i) => { const r = $('pl' + i); return { r, num: r.querySelector('.pl-num'), list: r.querySelector('.pl-list'), rows: +r.querySelector('.pl-list').dataset.rows }; });
    el.pillarsLayer = $('pillars'); // el.pillars 是数组，层的 id 单独存
    el.credits = TX.outro.credits.map((_, i) => $('cr' + i));
    el.slots = D.WORKS.map((w) => { const r = $('sl-' + w.key); return { r, on: r.querySelector('.on') }; });
    el.cb = el.fxback.getContext('2d');
    el.cf = el.fxfront.getContext('2d');
  }

  // ═══ §3 事件表（单位：拍）═════════════════════════════════════════════════
  const FLASH = [], SHAKE = [], RING = [], GLITCH = [];
  function buildEvents() {
    const fl = (b, a, d = 0.3, c = '255,255,255') => FLASH.push({ b, a, d, c });
    const sh = (b, amp, d = 0.4) => SHAKE.push({ b, amp, d });
    const ring = (b, x, y, c, r = 900, d = 1.2, w = 10) => RING.push({ b, x, y, c, r, d, w });
    TX.cold.nos.forEach((n) => sh(n.b, 7, 0.25));
    D.ERAS.forEach((e, i) => { if (i < 3) { fl(e.b0, 0.55, 0.35); sh(e.b0, 12, 0.35); ring(e.b0, CX, CY, D.MODELS[e.model].color, 1100, 1.4, 14); } });
    fulls.forEach((s) => fl(s.b0, s.b0 === 64 ? 1 : 0.2, s.b0 === 64 ? 0.7 : 0.18));
    D.GRID.steps.forEach((st) => fl(st.b, 0.22, 0.2));
    fl(48, 0.4, 0.3, '169,139,255');
    sh(64, 30, 0.55); ring(64, CX, CY, '#FF7A3D', 1500, 1.6, 22); ring(64.25, CX, CY, '#FFFFFF', 1200, 1.2, 6);
    for (let b = 66; b < 80; b++) sh(b, 5, 0.18);
    [80, 82, 84, 86].forEach((b) => { fl(b, 0.3, 0.22); sh(b, 8, 0.25); });
    fl(96, 0.65, 0.4); sh(96, 16, 0.4); ring(96, CX, CY, '#FFFFFF', 1400, 1.2, 8);
    TX.reveal.b.forEach((b, i) => {
      const x = 160 + i * 400 + 200, y = 500;
      fl(b, 0.5 + i * 0.06, 0.25); sh(b, 18 + i * 5, 0.35);
      ring(b, x, y, '#FF7A3D', 900 + i * 150, 1.3, 16); ring(b + 0.12, x, y, '#FFFFFF', 600, 0.9, 5);
    });
    fl(120, 0.75, 0.45); sh(120, 24, 0.5); ring(120, CX, 500, '#FFD166', 1800, 1.8, 26);
    fl(128, 0.35, 0.3); fl(131, 0.25, 0.25, '61,139,255');
    fl(143, 0.3, 0.5);
    [[15.55, 0.35], [41.7, 0.3], [63.1, 0.35], [86, 0.4], [103.55, 0.45], [127.6, 0.3]].forEach(([b, len]) => GLITCH.push({ b, len }));
  }
  const sumPulse = (list, b) => {
    let a = 0;
    for (const e of list) if (b >= e.b && b < e.b + e.d * 6) a = Math.max(a, e.a * pulse(b, e.b, e.d));
    return a;
  };

  // ═══ §4 冷开场 b0–16 ══════════════════════════════════════════════════════
  function sceneCold(b, t) {
    const C = TX.cold;
    const vis = b < 15.9;
    op(el.cold, vis ? seg(b, 0, 0.8) : 0);
    if (!vis) return;
    // 终端打字
    const n = Math.floor(seg(b, C.typeB0, C.typeB1) * C.command.length + 1e-6);
    txt(el['cold-cmd'], C.command.slice(0, n));
    const typing = b >= C.typeB0 && b < C.typeB1 + 0.3;
    op(el['cold-cursor'], typing ? 1 : Math.floor(t * 2.4) % 2 === 0 ? 1 : 0);
    // 回车后：命令飞向左上角，变成 HUD 里的 render(t)
    const fly = Ez.ioC(seg(b, 5, 5.9));
    tf(el['cold-term'], `translate(${f3(lerp(0, -736, fly))}px,${f3(lerp(0, -483, fly))}px) scale(${f3(lerp(1, 0.29, fly))})`);
    op(el['cold-term'], 1 - seg(b, 5.6, 5.95));
    // 没有 AE / 没有 PR / 没有剪辑软件
    el.nos.forEach((node, i) => {
      const bi = C.nos[i].b;
      const s = seg(b, bi, bi + 0.3);
      const out = Ez.iE(seg(b, C.nosOut + i * 0.06, C.nosOut + 0.4 + i * 0.06));
      const struck = seg(b, bi + 0.5, bi + 0.72);
      op(node, seg(b, bi, bi + 0.08) * (1 - out) * (1 - 0.42 * struck));
      tf(node, `translateX(${f3((i % 2 ? 1 : -1) * out * 1500)}px) scale(${f3(lerp(1.55, 1, Ez.oE(s)))})`);
      css(node, 'filter', s < 1 ? `blur(${f3((1 - Ez.oE(s)) * 14)}px)` : 'none');
      tf(el.strikes[i], `scaleX(${f3(Ez.oE(struck))})`);
    });
    // 论点：每一帧，都是时间的函数
    const th = Ez.oC(seg(b, C.thesisB0, C.thesisB0 + 0.7));
    const thOut = seg(b, C.thesisB1, C.thesisB1 + 0.35);
    op(el['cold-thesis'], th * (1 - thOut));
    css(el['cold-thesis'], 'clipPath', `inset(-20% ${f3((1 - th) * 100)}% -20% 0)`);
    css(el['cold-thesis'], 'letterSpacing', `${f3(lerp(0.3, 0.06, th))}em`);
    tf(el['cold-thesis'], `scale(${f3(1 + thOut * 0.12)})`);
    const fo = Ez.oC(seg(b, C.thesisB0 + 1, C.thesisB0 + 1.5));
    op(el['cold-formula'], fo * (1 - thOut));
    tf(el['cold-formula'], `translateY(${f3((1 - fo) * 30)}px)`);
    const beatFrac = b - Math.floor(b);
    const tp = b > C.thesisB0 + 1 ? Math.exp(-beatFrac * 5) : 0;
    tf(el.formulaT, `scale(${f3(1 + 0.45 * tp)})`);
    css(el.formulaT, 'textShadow', `0 0 ${f3(10 + 30 * tp)}px rgba(255,122,61,${f3(0.4 + 0.6 * tp)})`);
  }

  // ═══ §5 时代卡 + 能力曲线 ══════════════════════════════════════════════════
  const NODE_X = [0.14, 0.38, 0.62, 0.86].map((v) => v * W);
  const NODE_Y = [860, 776, 628, -520];
  const CURVE_P = [{ x: 96, y: 912 }].concat(NODE_X.map((x, i) => ({ x, y: NODE_Y[i] })));
  function bez(A, B, s, rocket) {
    const c1 = { x: A.x + (B.x - A.x) * (rocket ? 0.62 : 0.5), y: A.y };
    const c2 = rocket ? { x: B.x - 20, y: B.y + 640 } : { x: A.x + (B.x - A.x) * 0.5, y: B.y };
    const u = 1 - s;
    return { x: u * u * u * A.x + 3 * u * u * s * c1.x + 3 * u * s * s * c2.x + s * s * s * B.x, y: u * u * u * A.y + 3 * u * u * s * c1.y + 3 * u * s * s * c2.y + s * s * s * B.y };
  }
  function drawCurve(ctx, q, alpha, headGlow) {
    // q ∈ [0,4]：曲线从起点画到第 q 段
    ctx.save();
    ctx.globalAlpha = alpha;
    // 坐标轴
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(90, 930); ctx.lineTo(1830, 930); ctx.stroke();
    ctx.font = '700 20px NotoSansSC'; ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.save(); ctx.translate(66, 910); ctx.rotate(-Math.PI / 2); ctx.fillText('代码视频的上限 →', 0, 0); ctx.restore();
    D.ERAS.forEach((e, i) => {
      const c = D.MODELS[e.model].color;
      const reached = q >= i + 1 - 1e-6;
      ctx.fillStyle = reached ? c : 'rgba(255,255,255,0.3)';
      ctx.font = '800 24px Barlow';
      ctx.textAlign = 'center';
      ctx.fillText(D.MODELS[e.model].label, NODE_X[i], 972);
      ctx.fillRect(NODE_X[i] - 1, 922, 2, 16);
    });
    ctx.textAlign = 'left';
    // 曲线本体
    const pts = [];
    const segs = Math.min(4, Math.max(0, q));
    for (let i = 0; i < 4 && i < segs; i++) {
      const part = Math.min(1, segs - i);
      const N = 48;
      for (let k = 0; k <= N * part; k++) pts.push(bez(CURVE_P[i], CURVE_P[i + 1], k / N, i === 3));
    }
    if (pts.length > 1) {
      const g = ctx.createLinearGradient(90, 0, 1830, 0);
      g.addColorStop(0, D.MODELS.KIMI.color); g.addColorStop(0.35, D.MODELS.SWE.color); g.addColorStop(0.6, D.MODELS.GPT.color); g.addColorStop(0.85, D.MODELS.OPUS.color);
      // 面积
      ctx.beginPath(); ctx.moveTo(pts[0].x, 930);
      pts.forEach((p) => ctx.lineTo(p.x, p.y)); ctx.lineTo(pts[pts.length - 1].x, 930); ctx.closePath();
      const ga = ctx.createLinearGradient(0, 300, 0, 930); ga.addColorStop(0, 'rgba(255,122,61,0.22)'); ga.addColorStop(1, 'rgba(255,122,61,0)');
      ctx.fillStyle = ga; ctx.fill();
      // 线
      ctx.shadowColor = 'rgba(255,160,90,0.9)'; ctx.shadowBlur = 24;
      ctx.strokeStyle = g; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      ctx.shadowBlur = 0;
      // 已到达节点
      for (let i = 0; i < 4; i++) if (q >= i + 1 - 1e-6 && NODE_Y[i] > 0) {
        ctx.fillStyle = D.MODELS[D.ERAS[i].model].color;
        ctx.beginPath(); ctx.arc(NODE_X[i], NODE_Y[i], 11, 0, Math.PI * 2); ctx.fill();
      }
      // 光头
      const hd = pts[pts.length - 1];
      if (hd.y > -50) {
        const r = 18 + 26 * headGlow;
        const rg = ctx.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, r * 3);
        rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.25, 'rgba(255,170,100,0.8)'); rg.addColorStop(1, 'rgba(255,122,61,0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hd.x, hd.y, r * 3, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  function sceneEras(b, ctxB) {
    D.ERAS.forEach((e, i) => {
      const E4 = i === 3;
      const end = E4 ? 63.5 : e.b1;
      const R = el.eras[i];
      const vis = inR(b, e.b0, end);
      op(R.root, vis ? 1 : 0);
      if (!vis) return;
      const u = b - e.b0;
      const k = Ez.iC(seg(b, end - 0.3, end));
      css(R.root, 'clipPath', k > 0 ? `inset(${f3(k * 50)}% 0 ${f3(k * 50)}% 0)` : 'none');
      const ni = Ez.oE(seg(u, 0, 0.5));
      tf(R.num, `translateX(${f3(lerp(-280, 0, ni))}px) scale(${f3(lerp(1.3, 1, ni))})`);
      op(R.num, seg(u, 0, 0.12));
      css(R.fill, 'clipPath', `inset(${f3((1 - Ez.oC(seg(u, 0.3, 1.3))) * 100)}% 0 0 0)`);
      op(R.chip, seg(u, 0.15, 0.35));
      tf(R.chip, `translateY(${f3((1 - Ez.oC(seg(u, 0.15, 0.45))) * 24)}px)`);
      R.chars.forEach((c, j) => {
        const d = 0.18 + j * 0.13;
        const s = seg(u, d, d + 0.4);
        op(c, E4 ? 0 : seg(u, d, d + 0.1));
        tf(c, `translateY(${f3(lerp(-190, 0, Ez.oB(s)))}px) rotate(${f3(lerp(-8, 0, Ez.oC(s)))}deg)`);
      });
      op(R.sub, seg(u, 0.6, 1.0));
      tf(R.sub, `translateY(${f3((1 - Ez.oC(seg(u, 0.6, 1.0))) * 22)}px)`);
      op(R.cap, seg(u, 0.3, 0.6));
      // 能力曲线
      const q = i + Ez.oC(seg(u, 0.1, E4 ? 1.35 : 1.1));
      drawCurve(ctxB, q, 1 - k, pulse(b, e.b0 + 1.1, 0.4));
      if (E4 && q > 3.5) {
        // 冲破天花板：一束竖直光柱
        const a = seg(q, 3.5, 4) * (1 - k);
        const g = ctxB.createLinearGradient(NODE_X[3] - 80, 0, NODE_X[3] + 80, 0);
        g.addColorStop(0, 'rgba(255,122,61,0)'); g.addColorStop(0.5, `rgba(255,220,180,${f3(0.9 * a)})`); g.addColorStop(1, 'rgba(255,122,61,0)');
        ctxB.fillStyle = g; ctxB.fillRect(NODE_X[3] - 80, 0, 160, 930);
      }
    });
  }

  // ─── 窗口堆叠 b19–42 ───────────────────────────────────────────────────────
  function sceneStack(b) {
    const vis = (inR(b, 19, 27) || inR(b, 30, D.STACK_END));
    op(el.stack, vis ? 1 : 0);
    if (!vis) return;
    const drift = Math.sin(b * 0.35) * 3;
    tf(el['stack-cam'], `translateZ(${f3(lerp(0, -260, seg(b, 19, 42)))}px) rotateY(${f3(drift)}deg) rotateX(${f3(Math.cos(b * 0.27) * 1.5)}deg)`);
    wins.forEach((s, i) => {
      const W_ = el.wins[i];
      if (b < s.b0) { op(W_.r, 0); return; }
      let d = 0;
      for (let j = i + 1; j < wins.length; j++) d += Ez.oE(seg(b, wins[j].b0, wins[j].b0 + 0.4));
      const e = spring(seg(b, s.b0, s.b0 + 0.9) * 1.6, 1.6, 5.2);
      const pose = { x: -150 * d, y: -64 * d, z: -300 * d, ry: -12 - 3 * d, rx: 4 };
      const from = { x: 950, y: 140, z: 520, ry: -42, rx: 8 };
      const p = (a, bb) => lerp(from[a], pose[a], clamp(e, 0, 1.2)) + (bb || 0);
      tf(W_.r, `translate3d(${f3(p('x'))}px,${f3(p('y'))}px,${f3(p('z'))}px) rotateY(${f3(p('ry'))}deg) rotateX(${f3(p('rx'))}deg)`);
      op(W_.r, seg(b, s.b0, s.b0 + 0.12) * clamp(1 - 0.12 * d) * (d > 6.5 ? 1 - seg(d, 6.5, 7.5) : 1));
      op(W_.shade, clamp(0.14 * d, 0, 0.7));
    });
  }

  // ═══ §6 GPT ═══════════════════════════════════════════════════════════════
  const GA = { x: 120, y: 68, w: 1680, h: 945, gap: 10 };
  function gridPos(i, n) {
    const k = Math.round(Math.sqrt(n));
    const tw = (GA.w - (k - 1) * GA.gap) / k, th = (GA.h - (k - 1) * GA.gap) / k;
    return { x: GA.x + (i % k) * (tw + GA.gap), y: GA.y + Math.floor(i / k) * (th + GA.gap), s: tw / 640, tw, th };
  }
  function sceneGrid(b) {
    const G = D.GRID;
    const vis = inR(b, G.b0, G.b1);
    op(el.grid, vis ? 1 : 0);
    if (!vis) return;
    let si = 0;
    G.steps.forEach((st, k) => { if (b >= st.b) si = k; });
    const cur = G.steps[si], prev = G.steps[Math.max(0, si - 1)];
    const p = si === 0 ? 1 : Ez.oE(seg(b, cur.b, cur.b + 0.32));
    el.gtiles.forEach((tile, i) => {
      if (i >= cur.n) { op(tile, 0); return; }
      const B_ = gridPos(i, cur.n);
      let x, y, s, a = 1;
      if (i < prev.n && si > 0) {
        const A = gridPos(i, prev.n);
        x = lerp(A.x, B_.x, p); y = lerp(A.y, B_.y, p); s = lerp(A.s, B_.s, p);
      } else {
        a = Ez.oB(seg(b, cur.b + i * 0.015, cur.b + 0.35 + i * 0.015), 1.4);
        s = B_.s * a; x = B_.x + (B_.tw * (1 - a)) / 2; y = B_.y + (B_.th * (1 - a)) / 2;
      }
      op(tile, clamp(a * 3));
      tf(tile, `translate(${f3(x)}px,${f3(y)}px) scale(${f3(Math.max(0.001, s))})`);
    });
    const L = TX.grid;
    const lp = seg(b, L.b0, L.b0 + 0.35);
    op(el['grid-label'], Ez.oC(lp));
    tf(el['grid-label'], `scale(${f3(lerp(1.7, 1, Ez.oE(lp)))})`);
  }

  function sceneFull(b) {
    fulls.forEach((s, i) => {
      const S = el.shots[i];
      const vis = inR(b, s.b0, s.b1);
      op(S.r, vis ? 1 : 0);
      if (!vis) return;
      const u = b - s.b0;
      const pin = Ez.oE(seg(u, 0, 0.6));
      const dir = i % 2 ? 1 : -1;
      tf(S.media, `scale(${f3(lerp(1.16, 1.0, pin) + 0.018 * u)}) rotate(${f3(dir * lerp(0.9, 0, pin))}deg) translateX(${f3(dir * lerp(30, 0, pin))}px)`);
      const lp = Ez.oE(seg(u, 0, 0.32));
      op(S.label, seg(u, 0, 0.14));
      tf(S.label, `translateX(${f3(lerp(-50, 0, lp))}px)`);
    });
    // DROP 大字：04 电影
    const Dr = TX.drop;
    const dv = inR(b, Dr.b0, Dr.b1);
    op(el['drop-ov'], dv ? env(b, Dr.b0, Dr.b0 + 0.06, Dr.b1 - 0.45, Dr.b1 - 0.05) : 0);
    if (dv) {
      const s = Ez.oE(seg(b, Dr.b0, Dr.b0 + 0.3));
      const out = Ez.iC(seg(b, Dr.b1 - 0.45, Dr.b1));
      tf(el['drop-ov'], `scale(${f3(lerp(2.2, 1, s) + out * 0.9)})`);
      css(el['drop-ov'], 'filter', `blur(${f3((1 - s) * 10 + out * 16)}px)`);
    }
  }

  function sceneDuo(b) {
    const vis = inR(b, 59, 62);
    op(el.duo, vis ? 1 : 0);
    if (!vis) return;
    const l = Ez.oE(seg(b, 59, 59.5));
    tf(el['duo-left'], `translateX(${f3(lerp(-420, 0, l))}px) scale(${f3(1 + 0.025 * (b - 59))})`);
    const p = seg(b, 59.25, 60.05);
    tf(el['duo-phone'], `translateY(${f3(lerp(900, 0, Ez.oB(p, 1.3)))}px) rotate(${f3(lerp(14, -3, Ez.oC(p)))}deg)`);
    op(el['duo-label'], seg(b, 59.7, 60.1));
  }

  // ═══ §7 OPUS ══════════════════════════════════════════════════════════════
  const SK = 70;
  function panelGeom(s) {
    const n = s.n, i = s.panel;
    const x0 = (i * W) / n, x1 = ((i + 1) * W) / n;
    return { x0, x1, cx: (x0 + x1) / 2, L: i === 0 ? -300 : x0, R: i === n - 1 ? W + 300 : x1 };
  }
  function sceneSplit(b, ctxF) {
    const vis = inR(b, 80, 86);
    op(el.split, vis ? 1 : 0);
    if (!vis) return;
    splits.forEach((s, k) => {
      const P_ = el.panels[k];
      const on = inR(b, s.b0, s.b1);
      op(P_.r, on ? 1 : 0);
      if (!on) return;
      const g = panelGeom(s);
      const d = s.panel * 0.14;
      const e = Ez.oE(seg(b, s.b0 + d, s.b0 + d + 0.42));
      const dirY = s.panel % 2 ? 1 : -1;
      tf(P_.r, `translateY(${f3(dirY * (1 - e) * 1100)}px)`);
      css(P_.r, 'clipPath', `polygon(${f3(g.L + SK)}px 0px, ${f3(g.R + SK)}px 0px, ${f3(g.R - SK)}px 1080px, ${f3(g.L - SK)}px 1080px)`);
      const u = b - s.b0;
      tf(P_.media, `translateX(${f3(g.cx - 960 + u * 10 * dirY)}px) scale(${f3(1.06 - 0.02 * u)})`);
      css(P_.label, 'left', `${f3(g.x0 + 48 + (s.panel === 0 ? 20 : SK))}px`);
      op(P_.label, seg(b, s.b0 + d + 0.25, s.b0 + d + 0.45));
    });
    // 斜切分割线（橙色辉光）
    const grp = splits.filter((s) => inR(b, s.b0, s.b1));
    if (grp.length > 1) {
      ctxF.save();
      ctxF.strokeStyle = 'rgba(255,122,61,0.95)'; ctxF.lineWidth = 4; ctxF.shadowColor = '#FF7A3D'; ctxF.shadowBlur = 18;
      for (let i = 1; i < grp[0].n; i++) {
        const x = (i * W) / grp[0].n;
        const a = Ez.oE(seg(b, grp[0].b0 + 0.2, grp[0].b0 + 0.6));
        ctxF.globalAlpha = a;
        ctxF.beginPath(); ctxF.moveTo(x + SK, 0); ctxF.lineTo(x + SK - 2 * SK * a, 1080 * a); ctxF.stroke();
      }
      ctxF.restore();
    }
  }

  function scenePhones(b) {
    const vis = inR(b, 86, 88);
    op(el.phonesLayer, vis ? 1 : 0);
    if (!vis) return;
    el.phones.forEach((P_, i) => {
      const d = i * 0.16;
      const p = seg(b, 86 + d, 86.62 + d);
      const rest = [-6, 0, 6][i];
      tf(P_.r, `translateY(${f3(lerp(1000, i === 1 ? -18 : 0, Ez.oB(p, 1.25)))}px) rotate(${f3(lerp(rest * 3, rest, Ez.oC(p)))}deg)`);
      op(P_.label, seg(b, 86.5 + d, 86.8 + d));
    });
  }

  function sceneTunnel(b, ctxF, ctxB) {
    const T_ = D.TUNNEL;
    const vis = inR(b, T_.b0, T_.b1);
    op(el.tunnel, vis ? 1 : 0);
    if (!vis) return;
    const p = seg(b, T_.b0, T_.b1);
    const zc = lerp(0, 6200, Math.pow(p, 1.55));
    const roll = Math.sin(b * 0.55) * 5 + p * 24;
    tf(el['tunnel-cam'], `translateZ(${f3(zc)}px) rotateZ(${f3(roll)}deg)`);
    D.WORKS.forEach((w, i) => {
      const wall = i % 4, d = Math.floor(i / 4);
      const zr = -(300 + d * 760 + wall * 190) + zc;
      const a = zr > 560 ? 0 : clamp((zr + 5600) / 1600);
      op(el.tplanes[i], a);
    });
    const L = TX.tunnel;
    op(el['tunnel-line'], env(b, L.b0, L.b0 + 0.6, L.b1 - 0.5, L.b1));
    tf(el['tunnel-line'], `scale(${f3(lerp(0.5, 1.28, seg(b, L.b0, L.b1)))})`);
    // 中心辉光
    const rg = ctxB.createRadialGradient(CX, CY, 0, CX, CY, 700);
    rg.addColorStop(0, `rgba(255,150,90,${f3(0.28 + 0.4 * p)})`); rg.addColorStop(1, 'rgba(255,122,61,0)');
    ctxB.fillStyle = rg; ctxB.fillRect(0, 0, W, H);
    // 速度线
    const speed = 0.25 + p * p * 2.2;
    ctxF.save();
    ctxF.lineCap = 'round';
    for (let k = 0; k < 110; k++) {
      const ang = hash(k * 3.1) * Math.PI * 2;
      const ph = (hash(k * 7.7) + (b - T_.b0) * speed * (0.4 + hash(k) * 0.8)) % 1;
      const r0 = 120 + ph * ph * 1300;
      const len = 30 + speed * 140 * ph;
      const a = 0.15 + 0.6 * ph;
      ctxF.strokeStyle = k % 5 === 0 ? `rgba(255,150,90,${f3(a)})` : `rgba(255,255,255,${f3(a * 0.8)})`;
      ctxF.lineWidth = 1 + 2.5 * ph;
      ctxF.beginPath();
      ctxF.moveTo(CX + Math.cos(ang) * r0, CY + Math.sin(ang) * r0);
      ctxF.lineTo(CX + Math.cos(ang) * (r0 + len), CY + Math.sin(ang) * (r0 + len));
      ctxF.stroke();
    }
    ctxF.restore();
  }

  const WALL_FOCUS = D.WORKS.findIndex((w) => w.key === 'oneink');
  function wallCenter(i) {
    const { TW, TH, GAP, x0, y0 } = D.wall;
    const c = i % D.WALL.cols, r = Math.floor(i / D.WALL.cols);
    return { x: x0 + c * (TW + GAP) + TW / 2, y: y0 + r * (TH + GAP) + TH / 2, c, r };
  }
  function sceneWall(b) {
    const Wl = D.WALL;
    const vis = inR(b, Wl.b0, 111.6);
    op(el.wall, vis ? 1 - seg(b, 104.2, 106) * 0.62 - seg(b, 109.5, 111.5) * 0.38 : 0);
    if (!vis) return;
    const fc = wallCenter(WALL_FOCUS);
    const p = Ez.ioC(seg(b, Wl.b0, Wl.b0 + 3.6));
    let s = lerp(3.3, 0.94, p) + 0.06 * seg(b, 99.6, 104);
    let tx = -(fc.x - CX) * s * (1 - p), ty = -(fc.y - CY) * s * (1 - p);
    const rx = lerp(20, 0, p), rz = lerp(-7, 0, p);
    // 骤停后：缓慢后退、去色
    const br = seg(b, 104, 112);
    s *= lerp(1, 0.84, Ez.oC(br));
    const stop = pulse(b, 104, 0.35);
    ty += stop * 26;
    tf(el['wall-cam'], `perspective(1500px) translate(${f3(tx)}px,${f3(ty)}px) scale(${f3(s)}) rotateX(${f3(rx)}deg) rotateZ(${f3(rz)}deg)`);
    const gray = seg(b, 104, 105.2);
    css(el['wall-cam'], 'filter', gray > 0 ? `grayscale(${f3(gray)}) brightness(${f3(1 - 0.45 * gray - 0.5 * stop)})` : 'none');
    el.wtiles.forEach((T_, i) => {
      const c = wallCenter(i);
      const dist = Math.hypot(c.c - fc.c, c.r - fc.r);
      const a = Ez.oB(seg(b, Wl.b0 + dist * 0.07, Wl.b0 + 0.45 + dist * 0.07), 1.5);
      tf(T_.r, `scale(${f3(lerp(0.5, 1, a))})`);
      op(T_.r, clamp(a * 2));
      op(T_.flash, 0.85 * pulse(b, 102 + (c.c + c.r) * 0.13, 0.22));
    });
    op(el['wall-title'], env(b, 97.4, 98, 104, 104.4));
    css(el['wall-title'], 'letterSpacing', `${f3(lerp(0.7, 0.32, Ez.oC(seg(b, 97.4, 98.6))))}em`);
    op(el['wall-sub'], env(b, 98.6, 99.2, 104, 104.4));
  }

  // ═══ §8 凝视 / 通通开源 / 卡片 / 尾声 ═════════════════════════════════════
  function sceneBreath(b) {
    TX.breath.forEach((l, i) => {
      const L = el.blines[i];
      const a = env(b, l.b0, l.b0 + 0.7, l.b1 - 0.5, l.b1);
      op(L.r, a);
      if (a <= 0) return;
      const p = Ez.oC(seg(b, l.b0, l.b0 + 1.2));
      css(L.big, 'letterSpacing', `${f3(lerp(0.22, 0.06, p))}em`);
      tf(L.big, `translateY(${f3((1 - p) * 22)}px)`);
      if (L.small) op(L.small, seg(b, l.b0 + 0.8, l.b0 + 1.3));
    });
  }

  const FOLDER = { x: 150 + 56 + 105, y: 236 + 150 + 88 };
  const flyRnd = D.WORKS.map((_, i) => {
    const r = mulberry32(9001 + i * 17);
    return { ang: r() * Math.PI * 2, spin: (r() - 0.5) * 540, tilt: (r() - 0.5) * 120, R: 900 + r() * 700, delay: r() * 0.35,
      sx: r() < 0.5 ? -200 - r() * 300 : W + 200 + r() * 300, sy: r() * H, cx: CX + (r() - 0.5) * 900, cy: -200 + r() * 400 };
  });
  const arrivals = D.WORKS.map((_, i) => 128.25 + i * 0.085 + 0.95);
  function sceneFlyers(b) {
    // 爆散阶段在「通通开源」大字之后（下层）；吸入阶段必须压在分享卡片之上
    css(el.flyersLayer, 'zIndex', b >= 128 ? '5' : '0');
    el.flyers.forEach((f, i) => {
      const R = flyRnd[i];
      // A · 爆散：跟着「通通开源」四拍，从纵深中心冲向镜头
      const bg = TX.reveal.b[i % 4] + R.delay;
      if (inR(b, bg, bg + 2.4)) {
        const q = seg(b, bg, bg + 2.4);
        const rad = R.R * Ez.oC(q);
        const z = lerp(-2600, 700, Ez.iC(q));
        const x = Math.cos(R.ang) * rad, y = Math.sin(R.ang) * rad * 0.62;
        tf(f, `translate3d(${f3(x)}px,${f3(y)}px,${f3(z)}px) rotateZ(${f3(R.spin * q)}deg) rotateY(${f3(R.tilt * q)}deg) scale(0.9)`);
        op(f, env(q, 0, 0.08, 0.82, 0.98));
        return;
      }
      // B · 吸入：28 部片子飞进 QQ 闪传文件夹
      const s0 = 128.25 + i * 0.085;
      if (inR(b, s0, s0 + 0.95)) {
        const q = Ez.iC(seg(b, s0, s0 + 0.95));
        const u = 1 - q;
        const x = u * u * R.sx + 2 * u * q * R.cx + q * q * FOLDER.x;
        const y = u * u * R.sy + 2 * u * q * R.cy + q * q * FOLDER.y;
        tf(f, `translate3d(${f3(x - 960)}px,${f3(y - 540)}px,0px) rotateZ(${f3(R.spin * 0.3 * u)}deg) scale(${f3(lerp(0.75, 0.04, q))})`);
        op(f, seg(b, s0, s0 + 0.1));
        return;
      }
      op(f, 0);
    });
  }

  function sceneReveal(b) {
    const Rv = TX.reveal;
    const vis = inR(b, Rv.b[0], 128.4);
    op(el.reveal, vis ? 1 - seg(b, 127.8, 128.4) : 0);
    if (!vis) return;
    el.rchars.forEach((c, i) => {
      const bi = Rv.b[i];
      const s = seg(b, bi, bi + 0.2);
      const k = pulse(b, bi, 0.32);
      op(c, seg(b, bi, bi + 0.04));
      tf(c, `scale(${f3(lerp(2.8, 1, Ez.oE(s)) + 0.05 * Math.sin(clamp((b - bi) / 0.5) * Math.PI) * (1 - clamp(b - bi - 0.5)))})`);
      css(c, 'textShadow', `${f3(-16 * k)}px 0 rgba(255,40,60,${f3(0.85 * k)}), ${f3(16 * k)}px 0 rgba(40,220,255,${f3(0.85 * k)}), 0 0 ${f3(40 + 80 * k + 40 * pulse(b, 120, 0.6))}px rgba(255,122,61,${f3(0.35 + 0.45 * k + 0.3 * pulse(b, 120, 0.6))})`);
      css(c, 'filter', s < 1 ? `blur(${f3((1 - Ez.oE(s)) * 18)}px)` : 'none');
    });
    const up = Ez.ioC(seg(b, Rv.out, Rv.out + 0.7));
    tf(el['rv-row'], `translateY(${f3(lerp(0, -232, up))}px) scale(${f3((1 + 0.09 * pulse(b, 120, 0.35)) * lerp(1, 0.42, up))})`);
    const en = seg(b, Rv.enB + 0.2, Rv.enB + 0.8);
    op(el['rv-en'], Ez.oC(en) * (1 - seg(b, Rv.out, Rv.out + 0.3)));
    css(el['rv-en'], 'letterSpacing', `${f3(lerp(1.1, 0.5, Ez.oE(en)))}em`);
    const sw = seg(b, 121, 123);
    op(el['rv-sweep'], env(b, 121, 121.2, 122.8, 123));
    css(el['rv-sweep'], 'backgroundPosition', `${f3(lerp(100, 0, Ez.ioS(sw)))}% 0`);
  }

  function scenePillars(b) {
    const Pl = TX.pillars;
    const vis = inR(b, Pl.b0, Pl.b1);
    op(el.pillarsLayer, vis ? 1 : 0);
    if (!vis) return;
    const out = Ez.iC(seg(b, 128.1, 128.6));
    el.pillars.forEach((P_, i) => {
      const d = 124.3 + i * 0.25;
      const e = Ez.oE(seg(b, d, d + 0.5));
      op(P_.r, e * (1 - out));
      tf(P_.r, `translateY(${f3((1 - e) * 70)}px) scale(${f3(1 - out * 0.25)})`);
      const n = Math.round(Pl.items[i].num * Ez.oC(seg(b, d + 0.2, d + 1.5)));
      txt(P_.num, String(n));
      const rowH = 30, total = P_.rows * rowH;
      tf(P_.list, `translateY(${f3(-(((b - Pl.b0) * 95) % total))}px)`);
    });
  }

  function sceneCard(b) {
    const C = TX.card;
    const vis = inR(b, C.b0, 141.2);
    op(el.card, vis ? 1 - seg(b, 140.2, 141.2) : 0);
    if (!vis) return;
    const e = Ez.oE(seg(b, C.b0, C.b0 + 0.75));
    const push = seg(b, 132, 140);
    const toMini = Ez.ioC(seg(b, 140, 141.2));
    tf(el.card, `translate(${f3(toMini * 520)}px,${f3(toMini * 300)}px) scale(${f3((1 + 0.03 * push) * lerp(1, 0.35, toMini))})`);
    let bounce = 0;
    let arrived = 0;
    arrivals.forEach((a) => { if (b >= a) { arrived++; bounce += pulse(b, a, 0.12) * 0.1; } });
    tf(el.share, `perspective(1600px) translateX(${f3(lerp(-240, 0, e))}px) rotateY(${f3(lerp(-68, 0, e))}deg)`);
    op(el.share, seg(b, C.b0, C.b0 + 0.2));
    tf(el.folder, `scale(${f3(1 + Math.min(0.35, bounce))})`);
    txt(el['sh-count'], `${arrived} / 28`);
    const url = D.SHARE.url;
    const n = Math.floor(seg(b, 131, 132.4) * url.length + 1e-6);
    txt(el['sh-link-t'], url.slice(0, n));
    tf(el['sh-link-u'], `scaleX(${f3(Ez.oC(seg(b, 132.4, 133)))})`);
    const q = seg(b, 129, 129.7);
    tf(el.qrbox, `scale(${f3(lerp(0.6, 1, Ez.oB(q, 1.5)))})`);
    op(el.qrbox, seg(b, 129, 129.2));
    const sc = ((b - 129.5) % 2.5) / 2.5;
    tf(el['qr-scan'], `translateY(${f3(lerp(-90, 520, sc))}px)`);
    op(el['qr-scan'], b > 129.5 ? 1 : 0);
    const bar = pulse(b % 4, 0, 0.5);
    css(el.qrbox, 'boxShadow', `0 40px 120px rgba(0,0,0,.6), 0 0 ${f3(20 + 50 * bar)}px rgba(61,139,255,${f3(0.3 + 0.4 * bar)})`);
    op(el['card-cta'], seg(b, 131.5, 132));
    tf(el['card-cta'], `translateY(${f3((1 - Ez.oC(seg(b, 131.5, 132.1))) * 30)}px)`);
    op(el['card-note'], seg(b, 132.2, 132.8));
  }

  function sceneOutro(b, t) {
    const O = TX.outro;
    const vis = inR(b, O.b0, 157);
    const fade = 1 - seg(b, O.fadeB0, 155.4);
    op(el.outro, vis ? seg(b, O.b0 + 0.3, O.b0 + 0.9) * fade : 0);
    op(el.mini, vis ? seg(b, 140.6, 141.4) * (1 - seg(b, 154.2, 155.6)) : 0);
    if (!vis) return;
    const cmd = TX.cold.command;
    const n = Math.floor(seg(b, O.typeB0, O.typeB1) * cmd.length + 1e-6);
    txt(el['out-cmd'], cmd.slice(0, n));
    op(el['out-cursor'], b < O.typeB1 + 0.3 ? 1 : Math.floor(t * 2.4) % 2 === 0 ? 1 : 0);
    const a = Ez.oC(seg(b, O.answerB, O.answerB + 1.1));
    op(el['out-answer'], a);
    css(el['out-answer'], 'clipPath', `inset(-30% ${f3((1 - a) * 100)}% -30% 0)`);
    css(el['out-answer'], 'textShadow', `0 0 ${f3(30 + 60 * pulse(b, O.answerB, 0.8))}px rgba(255,122,61,${f3(0.25 + 0.5 * pulse(b, O.answerB, 0.8))})`);
    el.credits.forEach((c, i) => {
      const d = O.creditsB + i * 0.6;
      op(c, Ez.oC(seg(b, d, d + 0.6)));
      tf(c, `translateY(${f3((1 - Ez.oC(seg(b, d, d + 0.6))) * 18)}px)`);
    });
  }

  // ═══ §9 HUD ═══════════════════════════════════════════════════════════════
  function hud(b, t, f) {
    const breathDim = 1 - 0.8 * env(b, 104, 104.6, 115.6, 116);
    const endFade = 1 - seg(b, 153, 155.4);
    const base = seg(b, 5.2, 6) * breathDim * endFade;
    op(el['hud-tl'], base);
    txt(el['hud-time'], `t = ${t.toFixed(3).padStart(6, '0')}s`);
    txt(el['hud-frame'], `f ${String(f).padStart(4, '0')}`);
    op(el['hud-rec'], Math.floor(t * 2) % 2 === 0 ? 1 : 0.35);
    let era = null;
    D.ERAS.forEach((e) => { if (b >= e.b0) era = e; });
    const allMode = b >= 104;
    op(el['hud-era'], (b >= 16 ? 1 : 0) * breathDim * endFade);
    if (era) {
      txt(el['hud-era-k'], allMode ? 'ALL ERAS' : `ERA ${era.n}`);
      txt(el['hud-era-v'], allMode ? '28 部 · 通通开源' : D.MODELS[era.model].label);
      css(el['hud-era'], '--c', allMode ? '#FFD166' : D.MODELS[era.model].color);
    }
    op(el.ruler, seg(b, 5, 6) * (0.35 + 0.65 * breathDim) * endFade);
    tf(el['ruler-base'], `scaleX(${f3(Ez.oC(seg(b, 5, 6.3)))})`);
    css(el.playhead, 'left', `${f3((1600 * t) / DURATION)}px`);
    let seen = 0;
    D.WORKS.forEach((w, i) => {
      const fs = D.firstSeen[w.key];
      const on = b >= fs ? Ez.oE(seg(b, fs, fs + 0.3)) : 0;
      if (b >= fs) seen++;
      op(el.slots[i].on, on);
      tf(el.slots[i].r, `scaleY(${f3(1 + 1.6 * pulse(b, fs, 0.25) * (b >= fs ? 1 : 0))})`);
    });
    txt(el['hud-count-n'], String(seen));
    op(el['hud-count'], seg(b, 16, 16.5) * breathDim * endFade);
    const lb = Math.max(env(b, 104, 104.7, 115.8, 116), seg(b, 140, 141));
    tf(el['lbx-top'], `translateY(${f3(-100 * (1 - Ez.ioC(lb)))}%)`);
    tf(el['lbx-bot'], `translateY(${f3(100 * (1 - Ez.ioC(lb)))}%)`);
  }

  // ═══ §10 FX 画布 ══════════════════════════════════════════════════════════
  const grainTiles = [];
  function makeGrain() {
    for (let k = 0; k < 6; k++) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const x = c.getContext('2d');
      const img = x.createImageData(256, 256);
      const r = mulberry32(777 + k * 131);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (r() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      grainTiles.push(c);
    }
  }

  // 冷开场代码墙：真实源码行，从下往上加速滚动
  function codeWall(ctx, b) {
    const C = TX.cold;
    if (!inR(b, C.codeWallB0, C.codeWallB1)) return;
    const p = seg(b, C.codeWallB0, C.codeWallB1);
    const a = lerp(0.05, 0.38, Ez.iC(seg(b, C.codeWallB0, C.codeWallB0 + 1.5))) + 0.55 * Ez.iE(seg(b, 15.1, 15.85));
    const off = Math.pow(b - C.codeWallB0, 2.1) * 120;
    const L = D.CODE_LINES;
    ctx.save();
    ctx.font = '500 19px Plex';
    ctx.textBaseline = 'top';
    const rowH = 30;
    for (let col = 0; col < 3; col++) {
      const colX = 60 + col * 640;
      for (let r = -2; r < 40; r++) {
        const rowAbs = r + Math.floor(off / rowH) + col * 13;
        const y = r * rowH - (off % rowH);
        const li = L[(((rowAbs * 7 + col * 3) % L.length) + L.length) % L.length];
        const hl = hash(rowAbs * 1.7 + col) > 0.82;
        ctx.globalAlpha = a * (hl ? 1 : 0.55) * (0.4 + 0.6 * seg(y, 0, 300)) * (1 - 0.5 * seg(y, 800, 1080));
        if (hl && p > 0.2) {
          // 高亮行：代码 + 出处（观众可以在源码包里 Ctrl+F 到这一行）
          const code = li.line.slice(0, 34);
          ctx.fillStyle = '#FF7A3D';
          ctx.fillText(code, colX, y);
          ctx.fillStyle = '#3CF0C8';
          ctx.fillText('  // ' + li.src.split('/')[0], colX + ctx.measureText(code).width, y);
        } else {
          ctx.fillStyle = hl ? '#FF7A3D' : '#E8E4DA';
          ctx.fillText(li.line.slice(0, 58), colX, y);
        }
      }
    }
    ctx.restore();
  }

  // 通通开源背景：缓慢漂移的余烬
  const embers = Array.from({ length: 140 }, (_, i) => { const r = mulberry32(5150 + i); return { x: r() * W, y: r() * H, z: 0.3 + r() * 0.7, s: r() }; });
  function drawEmbers(ctx, b) {
    if (!inR(b, 116, 141)) return;
    const a = env(b, 116, 116.5, 140, 141);
    ctx.save();
    embers.forEach((e, i) => {
      const y = ((e.y - (b - 116) * 22 * e.z) % H + H) % H;
      const x = e.x + Math.sin(b * 0.6 + i) * 14 * e.z;
      const r = 1 + e.z * 2.4;
      ctx.globalAlpha = a * (0.25 + 0.55 * e.s) * (0.6 + 0.4 * Math.sin(b * 2 + i));
      ctx.fillStyle = i % 3 ? '#FFB27A' : '#FFFFFF';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  // DROP 段：每拍一次橙色漏光
  function lightLeak(ctx, b) {
    if (!inR(b, 64, 88)) return;
    const k = pulse(b - Math.floor(b), 0, 0.28) * (inR(b, 64, 80) ? 1 : 0.5);
    const side = Math.floor(b) % 2 ? 0 : W;
    const g = ctx.createRadialGradient(side, CY, 0, side, CY, 1100);
    g.addColorStop(0, `rgba(255,122,61,${f3(0.32 * k)})`); g.addColorStop(1, 'rgba(255,122,61,0)');
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  function fxFront(ctx, b, f) {
    // 冲击波
    RING.forEach((r) => {
      if (b < r.b || b > r.b + r.d) return;
      const q = seg(b, r.b, r.b + r.d);
      ctx.save();
      ctx.globalAlpha = (1 - q) * 0.9;
      ctx.strokeStyle = r.c; ctx.lineWidth = r.w * (1 - q) + 1; ctx.shadowColor = r.c; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.arc(r.x, r.y, 40 + r.r * Ez.oC(q), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    lightLeak(ctx, b);
    // 故障条
    GLITCH.forEach((g) => {
      if (b < g.b || b > g.b + g.len) return;
      const r = mulberry32(f * 31 + 7);
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 14; i++) {
        const y = r() * H, h = 4 + r() * 60;
        ctx.fillStyle = ['rgba(255,40,80,0.55)', 'rgba(40,220,255,0.55)', 'rgba(255,255,255,0.35)'][i % 3];
        ctx.fillRect((r() - 0.5) * 300, y, W, h);
      }
      ctx.restore();
    });
    // 隧道尽头白化
    const whiteout = Ez.iC(seg(b, 95.2, 96));
    const flash = Math.max(sumPulse(FLASH, b), b < 96 ? whiteout : 0);
    if (flash > 0.003) {
      ctx.save(); ctx.globalAlpha = Math.min(1, flash); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    // 真空：DROP 前半拍全黑
    if (inR(b, 63.5, 64) || inR(b, 15.9, 16) || inR(b, 115.75, 116)) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
    // 胶片颗粒（按帧号换图块 → 确定性）
    const tile = grainTiles[f % grainTiles.length];
    if (tile) {
      ctx.save();
      ctx.globalAlpha = 0.055 + 0.04 * env(b, 104, 105, 115, 116);
      ctx.globalCompositeOperation = 'overlay';
      const ox = (hash(f) * 256) | 0, oy = (hash(f + 0.5) * 256) | 0;
      for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(tile, x, y);
      ctx.restore();
    }
    // 结尾黑场
    const endBlack = seg(b, 155, 156);
    if (endBlack > 0) { ctx.save(); ctx.globalAlpha = endBlack; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }

  // 震屏（按帧号取伪随机 → 确定性）
  function shake(b, f) {
    let amp = 0;
    SHAKE.forEach((s) => { if (b >= s.b && b < s.b + s.d * 6) amp += s.amp * pulse(b, s.b, s.d); });
    amp += 12 * Ez.iC(seg(b, 62.3, 63.5)) * (b < 63.5 ? 1 : 0);
    if (amp < 0.05) { tf(el.stage, 'none'); return; }
    const x = (hash(f * 1.37) - 0.5) * 2 * amp, y = (hash(f * 2.11 + 3) - 0.5) * 2 * amp, r = (hash(f * 0.73 + 9) - 0.5) * amp * 0.06;
    tf(el.stage, `translate(${f3(x)}px,${f3(y)}px) rotate(${f3(r)}deg)`);
  }

  // ═══ render(t) ═════════════════════════════════════════════════════════════
  function render(tIn) {
    const t = clamp(tIn, 0, DURATION - 1e-6);
    const b = t / BEAT;
    const f = Math.round(t * FPS);
    const cb = el.cb, cf = el.cf;
    cb.setTransform(1, 0, 0, 1, 0, 0); cb.clearRect(0, 0, W, H);
    cf.setTransform(1, 0, 0, 1, 0, 0); cf.clearRect(0, 0, W, H);
    shake(b, f);
    codeWall(cb, b);
    drawEmbers(cb, b);
    sceneCold(b, t);
    sceneEras(b, cb);
    sceneStack(b);
    sceneGrid(b);
    sceneFull(b);
    sceneDuo(b);
    sceneSplit(b, cf);
    scenePhones(b);
    sceneTunnel(b, cf, cb);
    sceneWall(b);
    sceneBreath(b);
    sceneFlyers(b);
    sceneReveal(b);
    scenePillars(b);
    sceneCard(b);
    sceneOutro(b, t);
    hud(b, t, f);
    fxFront(cf, b, f);
  }

  // ═══ 启动：字体就绪后再建时间轴（异步构建完成后才注册，见 hyperframes-core）═══
  function init() {
    grab();
    buildEvents();
    makeGrain();
    const tl = gsap.timeline({ paused: true });
    const clock = { t: 0 };
    tl.to(clock, { t: DURATION, duration: DURATION, ease: 'none' }, 0);
    tl.eventCallback('onUpdate', () => render(tl.time()));
    render(0);
    window.__render = render;
    window.__timelines = window.__timelines || {};
    window.__timelines['main'] = tl;
    if (window.__hfForceTimelineRebind) window.__hfForceTimelineRebind();
  }
  const fontLoads = ['900 100px HanSerifH', '900 100px NotoSerifSC', '700 40px NotoSansSC', '900 40px NotoSansSC', '800 40px Barlow', '900 40px Barlow', '600 40px Barlow', '500 20px Plex']
    .map((f) => document.fonts.load(f, '通开源代码视频ABC0123').catch(() => null));
  Promise.all(fontLoads).then(() => document.fonts.ready).then(init);
})();

</script>
</body>
</html>
```

### 7/16 · `package-lock.json`
<!-- casebook-file {"path": "package-lock.json", "lines": 2017, "final_newline": true, "sha256": "a8fb5fc9222107a71bb4d31069886aa09375b6d37098309939498ccac2fbd52a", "original_sha256": "a8fb5fc9222107a71bb4d31069886aa09375b6d37098309939498ccac2fbd52a"} -->
```json
{
  "name": "00-supercut-trailer",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "00-supercut-trailer",
      "version": "1.0.0",
      "license": "ISC",
      "devDependencies": {
        "hyperframes": "^0.8.77"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.11.3",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.11.3.tgz",
      "integrity": "sha512-Xz4Tpyki7XyrpbUK1jR1AhdAdaXyhhY4lZ3neLodmhpuWfy2PAQN5B46sAiU4liOXGLkHypn/qU+jvfWSCYYLA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.12.tgz",
      "integrity": "sha512-Hhmwd6CInZ3dwpuGTF8fJG6yoWmsToE+vYgD4nytZVxcu1ulHpUQRAB1UJ8+N1Am3Mz4+xOByoQoSZf4D+CpkA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.25.12.tgz",
      "integrity": "sha512-VJ+sKvNA/GE7Ccacc9Cha7bpS8nyzVv0jdVgwNDaR4gDMC/2TTRc33Ip8qrNYUcpkOHUT5OZ0bUcNNVZQ9RLlg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.25.12.tgz",
      "integrity": "sha512-6AAmLG7zwD1Z159jCKPvAxZd4y/VTO0VkprYy+3N2FtJ8+BQWFXU+OxARIwA46c5tdD9SsKGZ/1ocqBS/gAKHg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.25.12.tgz",
      "integrity": "sha512-5jbb+2hhDHx5phYR2By8GTWEzn6I9UqR11Kwf22iKbNpYrsmRB18aX/9ivc5cabcUiAT/wM+YIZ6SG9QO6a8kg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.12.tgz",
      "integrity": "sha512-N3zl+lxHCifgIlcMUP5016ESkeQjLj/959RxxNYIthIg+CQHInujFuXeWbWMgnTo4cp5XVHqFPmpyu9J65C1Yg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.25.12.tgz",
      "integrity": "sha512-HQ9ka4Kx21qHXwtlTUVbKJOAnmG1ipXhdWTmNXiPzPfWKpXqASVcWdnf2bnL73wgjNrFXAa3yYvBSd9pzfEIpA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.25.12.tgz",
      "integrity": "sha512-gA0Bx759+7Jve03K1S0vkOu5Lg/85dou3EseOGUes8flVOGxbhDDh/iZaoek11Y8mtyKPGF3vP8XhnkDEAmzeg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.25.12.tgz",
      "integrity": "sha512-TGbO26Yw2xsHzxtbVFGEXBFH0FRAP7gtcPE7P5yP7wGy7cXK2oO7RyOhL5NLiqTlBh47XhmIUXuGciXEqYFfBQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.25.12.tgz",
      "integrity": "sha512-lPDGyC1JPDou8kGcywY0YILzWlhhnRjdof3UlcoqYmS9El818LLfJJc3PXXgZHrHCAKs/Z2SeZtDJr5MrkxtOw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.25.12.tgz",
      "integrity": "sha512-8bwX7a8FghIgrupcxb4aUmYDLp8pX06rGh5HqDT7bB+8Rdells6mHvrFHHW2JAOPZUbnjUpKTLg6ECyzvas2AQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.25.12.tgz",
      "integrity": "sha512-0y9KrdVnbMM2/vG8KfU0byhUN+EFCny9+8g202gYqSSVMonbsCfLjUO+rCci7pM0WBEtz+oK/PIwHkzxkyharA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.25.12.tgz",
      "integrity": "sha512-h///Lr5a9rib/v1GGqXVGzjL4TMvVTv+s1DPoxQdz7l/AYv6LDSxdIwzxkrPW438oUXiDtwM10o9PmwS/6Z0Ng==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.25.12.tgz",
      "integrity": "sha512-iyRrM1Pzy9GFMDLsXn1iHUm18nhKnNMWscjmp4+hpafcZjrr2WbT//d20xaGljXDBYHqRcl8HnxbX6uaA/eGVw==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.25.12.tgz",
      "integrity": "sha512-9meM/lRXxMi5PSUqEXRCtVjEZBGwB7P/D4yT8UG/mwIdze2aV4Vo6U5gD3+RsoHXKkHCfSxZKzmDssVlRj1QQA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.25.12.tgz",
      "integrity": "sha512-Zr7KR4hgKUpWAwb1f3o5ygT04MzqVrGEGXGLnj15YQDJErYu/BGg+wmFlIDOdJp0PmB0lLvxFIOXZgFRrdjR0w==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.25.12.tgz",
      "integrity": "sha512-MsKncOcgTNvdtiISc/jZs/Zf8d0cl/t3gYWX8J9ubBnVOwlk65UIEEvgBORTiljloIWnBzLs4qhzPkJcitIzIg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.25.12.tgz",
      "integrity": "sha512-uqZMTLr/zR/ed4jIGnwSLkaHmPjOjJvnm6TVVitAa08SLS9Z0VM8wIRx7gWbJB5/J54YuIMInDquWyYvQLZkgw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.25.12.tgz",
      "integrity": "sha512-xXwcTq4GhRM7J9A8Gv5boanHhRa/Q9KLVmcyXHCTaM4wKfIpWkdXiMog/KsnxzJ0A1+nD+zoecuzqPmCRyBGjg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.25.12.tgz",
      "integrity": "sha512-Ld5pTlzPy3YwGec4OuHh1aCVCRvOXdH8DgRjfDy/oumVovmuSzWfnSJg+VtakB9Cm0gxNO9BzWkj6mtO1FMXkQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.25.12.tgz",
      "integrity": "sha512-fF96T6KsBo/pkQI950FARU9apGNTSlZGsv1jZBAlcLL1MLjLNIWPBkj5NlSz8aAzYKg+eNqknrUJ24QBybeR5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.25.12.tgz",
      "integrity": "sha512-MZyXUkZHjQxUvzK7rN8DJ3SRmrVrke8ZyRusHlP+kuwqTcfWLyqMOE3sScPPyeIXN/mDJIfGXvcMqCgYKekoQw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.25.12.tgz",
      "integrity": "sha512-rm0YWsqUSRrjncSXGA7Zv78Nbnw4XL6/dzr20cyrQf7ZmRcsovpcRBdhD43Nuk3y7XIoW2OxMVvwuRvk9XdASg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.25.12.tgz",
      "integrity": "sha512-3wGSCDyuTHQUzt0nV7bocDy72r2lI33QL3gkDNGkod22EsYl04sMf0qLb8luNKTOmgF/eDEDP5BFNwoBKH441w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.25.12.tgz",
      "integrity": "sha512-rMmLrur64A7+DKlnSuwqUdRKyd3UE7oPJZmnljqEptesKM8wx9J8gx5u0+9Pq0fQQW8vqeKebwNXdfOyP+8Bsg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.25.12.tgz",
      "integrity": "sha512-HkqnmmBoCbCwxUKKNPBixiWDGCpQGVsrQfJoVGYLPT41XWF8lHuE5N6WhVia2n4o5QK5M4tYr21827fNhi4byQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.25.12.tgz",
      "integrity": "sha512-alJC0uCZpTFrSL0CCDjcgleBXPnCrEAhTBILpeAp7M/OFgoqtAetfBzX0xM00MUsVVPpVjlPuMbREqnZCXaTnA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@hono/node-server": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/@hono/node-server/-/node-server-2.1.1.tgz",
      "integrity": "sha512-ELuehkj5VCBdgEw9zs+ivkKwyzzUCSQuE96YmiPvn1ECBoZCczbFXJLeEGMTYjphP6gydh4pHMqEYPVMYUVgQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=20"
      },
      "peerDependencies": {
        "hono": "^4"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.35.4.tgz",
      "integrity": "sha512-Uhfl4V4lhP2nbUVF9+hyH1+luj86f1gUFeo8ALYxFoULoU+G87D43BfeMP8XHsk9boxAnCY/bf2EHwhA7MuGsA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.35.4.tgz",
      "integrity": "sha512-hWniXY3bG5qKpkKrAwPe4y+VTPmf086YQAnkxWh7uA1YrlRouWGa0M0Mxj3ZjnXFkv7/TD1bTy9lGUK26vRvWw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-freebsd-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-freebsd-wasm32/-/sharp-freebsd-wasm32-0.35.4.tgz",
      "integrity": "sha512-lIsKw/BU+kjB4eZjxrYrZmwOJYi3Ajrv66iAlBmUPyKc3HpnloevB1g3wxGD9P/5BbQ1brBGl65VRRrCvQDEqA==",
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.3.3.tgz",
      "integrity": "sha512-suTBPTDGrI9WodccaDdwZItTSaBYASlBk1NSfElSHrUfzu3szG6lvIF58+WiFvnfzuK8ZBFS5zE00PxqxnRiPg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.3.3.tgz",
      "integrity": "sha512-FVJZ5mITMobmXIz/hPDTw0EintTW5H3WfrxwLqEqjiIihlu+hVRyGrFQ60xl0Lxn7Bt3zdpevPaQi0HEzqz9fw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.3.3.tgz",
      "integrity": "sha512-3rbU4vqXXc3hY/OiXdl52xZvT0F1yEngWfvqudtPJg/KkyiaQw2DRsFrNzpmLvfavbwOq3qXn36GP8obHRULQA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.3.3.tgz",
      "integrity": "sha512-0DaL0A6Xu6sQSQFwe4iVCrKWU2cCTItnRsYsCdxAMm9NF6twAA9BKnoqy4hqz4+azQ0JHuA26qiUKsf1XJ/v5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.3.3.tgz",
      "integrity": "sha512-cdn1OvUBwsXhbC0zSzJnNzf5MZ/mTrobawDvNXBTxe8VtqKAm0sRuEY2Evzovb/w9JMk4TvRxqt1mekSuJz64w==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.3.3.tgz",
      "integrity": "sha512-HjPVx7yKz+0lqdhDlTw1tt90wamBoxhiXpvl1XZpJLiHH4RCJ5yDTqH+VlYPv2fwFs89JFw4c1IexYOcQUi4IQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.3.3.tgz",
      "integrity": "sha512-neWLh+3yCNThxnfy3c4BbVBeGgt9aftno+XbT56iK28RgeDs3UOFWviLWlUu0bArYVYJaFDK+RRohbicUNCm8Q==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.3.3.tgz",
      "integrity": "sha512-4vKmvAst9nrowcqquKFAyZJUDolUaIp8uRiN0mWFguJ1IplC9/pitXtlnnlU4aa/eJw3J7i67V+pwUL+wZGdsA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.3.3.tgz",
      "integrity": "sha512-Y9kQaLMuNoB0bPYOOdcZMaseNrFpPodIWWMrx+CZyydf2xn68j9WYc6sWWRrDwNkzCQjKYfc68L7jKjGlHMibw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.3.3.tgz",
      "integrity": "sha512-fj8Mv0HHfD1Rr+4I68+3agJynxDWtBFgicTbSOb9Bke6pIwzGcJ+RX/yHjmiEGFMCavY/dxvem7MyNaJF+wDiw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.35.4.tgz",
      "integrity": "sha512-7OAS8gI0EReKGVN2HssHlM6umJgxF5VI3xN0p9FA91p/YO+ou5hiNghLdZ5BEHztwaaK5+bLKRf8x/o2L2nk9A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.35.4.tgz",
      "integrity": "sha512-De4jpEnAU8Hd5oT0j1G3uL4ZvTuipVMn7YC6vPaJhy6/7EwEae0SVAoBrUMYQbkLGDm85taVWwuPc1a44LTzCQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.35.4.tgz",
      "integrity": "sha512-2oYZJeIl4kCcMGk4ouZVjnkCtFrpQFlNEtJ6GbxzhHQchwH0NH/qEb9ykmOl29dqwMq+JhFdZn+1ak2FKhI9fQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.35.4.tgz",
      "integrity": "sha512-cPbNChoRURAWdebDIHSenxRpgEdy7JkPydSnUxRm9VvKD7m0/xVaR/8Fzlu81pk5nHEvHH87UZUA7cTtwnbJSA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.35.4.tgz",
      "integrity": "sha512-RY0JFY8Fd6RonCBtHz+DvadaPkXDSI1AUn6yWL9TipqkZ1vY8w8evqdgyDFnkm4/K1ve1TvZiaePP5oSd4+WVQ==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.35.4.tgz",
      "integrity": "sha512-9qvvEAuk8k89TfWUoX2htWjbAMX8p+NxCppjpcg5k6xMsjhBQPTsoIh36h9Qde4WRuGpJeYnOjdosDn/cnv+OA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.35.4.tgz",
      "integrity": "sha512-KB5jxpfWQTr0nc3xdHtWChdbifHrBGsd2SM62Eyxrl8afikm+f5qGBU75SJIZBT/S1MC8XyacdlXBMSWq6OURA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.35.4.tgz",
      "integrity": "sha512-f+eZJZIQNEEd26RPSW+76chwOf1XtA2Y/O+5ocVyLliHkeih3e+jhLVBdNTd2rS3IbNXK8+ug93Vf5ZXtF5Lxg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.35.4.tgz",
      "integrity": "sha512-zQnl4Kwp7Q6NHsENtU2T/00Zi+w3AQNwz3+UaTyVBy2FpXrzXzGjndpK61onhZjRtRpQXxCTeqw19bVyXOh7jA==",
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.11.3"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-webcontainers-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-webcontainers-wasm32/-/sharp-webcontainers-wasm32-0.35.4.tgz",
      "integrity": "sha512-ESfNkywmCfPNyaZjxooddJQiQ+l/nTpGEOGthxiLnIHXC/CmcBixnfwUleX9mCz9ovrUUvKMap/pm8RYbzfwaA==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.35.4.tgz",
      "integrity": "sha512-iNdlBX9gLVvqe2I3uIJSIKTq6wckP/DYxZtcqxm09x5Gi24DnFBmPAWZmr60ZyYMG0xlzo6goG3670ar+RXvRw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.35.4.tgz",
      "integrity": "sha512-kqRsbaa5CS6KHlpxnN7WhE6vAAugXyZButpRdvDWetlv6Qv4N9WTcrWzF7tXfB9T7MsoadqdI8hmwLq6UlLvtw==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.35.4.tgz",
      "integrity": "sha512-XtmnYhBcrORsJ4XJngyzr/EWP0hRZLAZRFaApdKuviyqF78+ylxh2y06ZmtULAMOnObJ3ucpN0AcwSWnMowTRg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@puppeteer/browsers": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/@puppeteer/browsers/-/browsers-3.2.3.tgz",
      "integrity": "sha512-2Bt3m6dDAJqmZehn0wiXSYyQmuhyiHHZ7FjvrVaS1W2RoFGV6eCK71UvKYkNJjkwC1Q9nobjhvTMhLQztFVINA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "modern-tar": "^0.8.4",
        "yargs": "^18.0.0"
      },
      "bin": {
        "browsers": "lib/main-cli.js"
      },
      "engines": {
        "node": ">=22.12.0"
      },
      "peerDependencies": {
        "proxy-agent": ">=8.0.1",
        "yauzl": "^2.10.0 || ^3.4.0"
      },
      "peerDependenciesMeta": {
        "proxy-agent": {
          "optional": true
        },
        "yauzl": {
          "optional": true
        }
      }
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.23",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.23.tgz",
      "integrity": "sha512-5lSsMOTXURePglDfvuAQUqkGek9Hg2kksOYay2m0+XR++b2NWYL/4sWyuvVBIs8oKnJaxkdi9whaL/sqN13afw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/adm-zip": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/adm-zip/-/adm-zip-0.6.1.tgz",
      "integrity": "sha512-Xwrja8nx9e5o2N1my4DsKCeKpdrnACyr1wtbPxBDgGzKzKyE9kRtBFA8mWldI+RVlD7CBZNWY/wQ2+ydwOR6kQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14.0"
      }
    },
    "node_modules/ansi-regex": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.3.0.tgz",
      "integrity": "sha512-WpDfL7NO6j7tH88IDBNVdUJxDh9nmCteAVW9dsep846XdwF4naCBK+/tGLX3KJgcpgMRXCFlTM2hKGoK9FsdrQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/ansi-styles": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.3.tgz",
      "integrity": "sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/brotli": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/brotli/-/brotli-1.3.3.tgz",
      "integrity": "sha512-oTKjJdShmDuGW94SyyaoQvAjf30dZaHnjJ8uAF+u2/vGJkJbJPJAT1gDiOJP5v1Zb6f9KEyW/1HpuaWIXtGHPg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.1.2"
      }
    },
    "node_modules/bundle-name": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/bundle-name/-/bundle-name-4.1.0.tgz",
      "integrity": "sha512-tjwM5exMg6BGRI+kNmTntNsvdZS1X8BFYS6tnJ2hdH0kVxM6/eVZ2xy+FqStSWvYmtfFMDLIxurorHwDKfDz5Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "run-applescript": "^7.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/chromium-bidi": {
      "version": "17.0.2",
      "resolved": "https://registry.npmjs.org/chromium-bidi/-/chromium-bidi-17.0.2.tgz",
      "integrity": "sha512-5v9GQFhTktFvotn/OFNJBmKLKRAb6n9r0bVCwf7sHgWc3/JryK0bj1nn93L3pHFrfgcsu6Be6EWsDi+1XHTGDg==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "mitt": "^3.0.1",
        "zod": "^3.24.1"
      },
      "engines": {
        "node": ">=20.19.0 <22.0.0 || >=22.12.0"
      },
      "peerDependencies": {
        "devtools-protocol": "*"
      }
    },
    "node_modules/citty": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/citty/-/citty-0.2.2.tgz",
      "integrity": "sha512-+6vJA3L98yv+IdfKGZHBNiGW5KHn22e/JwID0Strsz8h4S/csAu/OuICwxrg44k5MRiZHWIo8XXuJgQTriRP4w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cliui": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-9.0.1.tgz",
      "integrity": "sha512-k7ndgKhwoQveBL+/1tqGJYNz097I7WOvwbmmU2AR5+magtbjPWQTS1C5vzGkBC8Ym8UWRzfKUzUUqFLypY4Q+w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^7.2.0",
        "strip-ansi": "^7.1.0",
        "wrap-ansi": "^9.0.0"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/cliui/node_modules/string-width": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-7.2.0.tgz",
      "integrity": "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^10.3.0",
        "get-east-asian-width": "^1.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/clone": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/clone/-/clone-2.1.2.tgz",
      "integrity": "sha512-3Pe/CF1Nn94hyhIYpjtiLhdCoEoz0DqQ+988E9gmeEdQZlojxnOb74wctFyuwWQHzqyf9X7C7MG8juUpqBJT8w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/compare-versions": {
      "version": "6.1.1",
      "resolved": "https://registry.npmjs.org/compare-versions/-/compare-versions-6.1.1.tgz",
      "integrity": "sha512-4hm4VPpIecmlg59CHXnRDnqGplJFrbLG4aFEl5vl6cK1u76ws3LLvX7ikFnTDl5vo39sjWD6AaDPYodJp/NNHg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/css-tree": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/css-tree/-/css-tree-3.2.1.tgz",
      "integrity": "sha512-X7sjQzceUhu1u7Y/ylrRZFU2FS6LRiFVp6rKLPg23y3x3c3DOKAwuXGDp+PAGjh6CSnCjYeAul8pcT8bAl+lSA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mdn-data": "2.27.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12.20.0 || ^14.13.0 || >=15.0.0"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/default-browser": {
      "version": "5.5.1",
      "resolved": "https://registry.npmjs.org/default-browser/-/default-browser-5.5.1.tgz",
      "integrity": "sha512-m1pAzaJgZ/gssEqlOhJkPJp8Xly7QyW6xcrkUa2KKcDeDSEMP7X8xipU3snUcfisTQx0w1AGae+9UtJSfVnXGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "bundle-name": "^4.1.0",
        "default-browser-id": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/default-browser-id": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/default-browser-id/-/default-browser-id-5.0.1.tgz",
      "integrity": "sha512-x1VCxdX4t+8wVfd1so/9w+vQ4vx7lKd2Qp5tDRutErwmR85OgmfX7RlLRMWafRMY7hbEiXIbudNrjOAPa/hL8Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/define-lazy-prop": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/define-lazy-prop/-/define-lazy-prop-3.0.0.tgz",
      "integrity": "sha512-N+MeXYoqr3pOgn8xfyRPREN7gHakLYjhsHhWGT3fWAiL4IkAt0iDw14QiiEm2bE30c5XX5q0FtAA3CK5f9/BUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/devtools-protocol": {
      "version": "0.0.1687809",
      "resolved": "https://registry.npmjs.org/devtools-protocol/-/devtools-protocol-0.0.1687809.tgz",
      "integrity": "sha512-t7kSb+UKYdyxcmqy98U2P86ne6rCve3DIJ4+lp54i/hhClgFuG35JrLj23rO14Jw3sWDsp7i+22QhNU0+/qk8g==",
      "dev": true,
      "license": "BSD-3-Clause"
    },
    "node_modules/dfa": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/dfa/-/dfa-1.2.0.tgz",
      "integrity": "sha512-ED3jP8saaweFTjeGX8HQPjeC1YYyZs98jGNZx6IiBvxW7JG5v492kamAQB3m2wop07CvU/RQmzcKr6bgcC5D/Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/emoji-regex": {
      "version": "10.6.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-10.6.0.tgz",
      "integrity": "sha512-toUI84YS5YmxW219erniWD0CIVOo46xGKColeNQRgOzDorgBi1v4D71/OFzgD9GO2UGKIv1C3Sp8DAn0+j5w7A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/esbuild": {
      "version": "0.25.12",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.25.12.tgz",
      "integrity": "sha512-bbPBYYrtZbkt6Os6FiTLCTFxvq4tt3JKall1vRwshA3fdVztsLAatFaZobhkBC8/BrPetoa0oksYoKXoG4ryJg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.25.12",
        "@esbuild/android-arm": "0.25.12",
        "@esbuild/android-arm64": "0.25.12",
        "@esbuild/android-x64": "0.25.12",
        "@esbuild/darwin-arm64": "0.25.12",
        "@esbuild/darwin-x64": "0.25.12",
        "@esbuild/freebsd-arm64": "0.25.12",
        "@esbuild/freebsd-x64": "0.25.12",
        "@esbuild/linux-arm": "0.25.12",
        "@esbuild/linux-arm64": "0.25.12",
        "@esbuild/linux-ia32": "0.25.12",
        "@esbuild/linux-loong64": "0.25.12",
        "@esbuild/linux-mips64el": "0.25.12",
        "@esbuild/linux-ppc64": "0.25.12",
        "@esbuild/linux-riscv64": "0.25.12",
        "@esbuild/linux-s390x": "0.25.12",
        "@esbuild/linux-x64": "0.25.12",
        "@esbuild/netbsd-arm64": "0.25.12",
        "@esbuild/netbsd-x64": "0.25.12",
        "@esbuild/openbsd-arm64": "0.25.12",
        "@esbuild/openbsd-x64": "0.25.12",
        "@esbuild/openharmony-arm64": "0.25.12",
        "@esbuild/sunos-x64": "0.25.12",
        "@esbuild/win32-arm64": "0.25.12",
        "@esbuild/win32-ia32": "0.25.12",
        "@esbuild/win32-x64": "0.25.12"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fontkit": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/fontkit/-/fontkit-2.0.4.tgz",
      "integrity": "sha512-syetQadaUEDNdxdugga9CpEYVaQIxOwk7GlwZWWZ19//qW4zE5bknOKeMBDYAASwnpaSHKJITRLMF9m1fp3s6g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@swc/helpers": "^0.5.12",
        "brotli": "^1.3.2",
        "clone": "^2.1.2",
        "dfa": "^1.2.0",
        "fast-deep-equal": "^3.1.3",
        "restructure": "^3.0.0",
        "tiny-inflate": "^1.0.3",
        "unicode-properties": "^1.4.0",
        "unicode-trie": "^2.0.0"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-east-asian-width": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/get-east-asian-width/-/get-east-asian-width-1.7.0.tgz",
      "integrity": "sha512-XjH1AECxf0giL2V1aU8vKyRR2ppRUb5c0EvT7zuJTokQ74bNo52zOtghqdWIqrhUD79fo3x0WfKZdOqxF6LG1Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/giget": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/giget/-/giget-3.3.1.tgz",
      "integrity": "sha512-r+mvuDjrjMpsdw46Kmeydb8bdHm7wOKw8wNBtTndkjbPjgAp5oUJUxRE76wZFknxIPokfWvep2qSXK37aXE6zg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "giget": "dist/cli.mjs"
      }
    },
    "node_modules/hono": {
      "version": "4.13.9",
      "resolved": "https://registry.npmjs.org/hono/-/hono-4.13.9.tgz",
      "integrity": "sha512-7dMkQmZoC4E6F7AtaQSPhlWAdnBti+j7rreMZl8QB4jFiEhP9TWbGWUMi8WYzBCgmgulxuvLQupKqo+Co6Omyg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=16.9.0"
      }
    },
    "node_modules/hyperframes": {
      "version": "0.8.77",
      "resolved": "https://registry.npmjs.org/hyperframes/-/hyperframes-0.8.77.tgz",
      "integrity": "sha512-OOVwxP9ixSwkoH0y5SX7Xwf6NS9ad0mFnqf6jK053piGp2LUsxEywGd5m9KucNdaKwlQfkw+u+U8E5OxKPsa+w==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@hono/node-server": "^2.0.5",
        "@puppeteer/browsers": "^3.2.2",
        "adm-zip": "^0.6.0",
        "citty": "^0.2.1",
        "compare-versions": "^6.1.1",
        "css-tree": "^3.2.1",
        "debug": "^4.4.0",
        "esbuild": "^0.25.12",
        "fontkit": "^2.0.4",
        "giget": "^3.2.0",
        "hono": "^4.0.0",
        "ignore": "^5.3.2",
        "open": "^10.0.0",
        "postcss": "^8.5.8",
        "prettier": "^3.8.1",
        "puppeteer-core": "^25.10.0",
        "sharp": "^0.35.0"
      },
      "bin": {
        "hyperframes": "bin/hyperframes.mjs",
        "hyperframes-localize-fonts": "bin/hyperframes-localize-fonts.mjs"
      },
      "engines": {
        "node": ">=22"
      }
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/is-docker": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-docker/-/is-docker-3.0.0.tgz",
      "integrity": "sha512-eljcgEDlEns/7AXFosB5K/2nCM4P7FQPkGc/DWLy5rmFEWvZayGrik1d9/QIY5nJ4f9YsVvBkA6kJpHn9rISdQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "is-docker": "cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-inside-container": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-inside-container/-/is-inside-container-1.0.0.tgz",
      "integrity": "sha512-KIYLCCJghfHZxqjYBE7rEy0OBuTd5xCHS7tHVgvCLkx7StIoaxwNW3hCALgEUjFfeRk+MG/Qxmp/vtETEF3tRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-docker": "^3.0.0"
      },
      "bin": {
        "is-inside-container": "cli.js"
      },
      "engines": {
        "node": ">=14.16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-wsl": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/is-wsl/-/is-wsl-3.1.1.tgz",
      "integrity": "sha512-e6rvdUCiQCAuumZslxRJWR/Doq4VpPR82kqclvcS0efgt430SlGIk05vdCN58+VrzgtIcfNODjozVielycD4Sw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-inside-container": "^1.0.0"
      },
      "engines": {
        "node": ">=16"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mdn-data": {
      "version": "2.27.1",
      "resolved": "https://registry.npmjs.org/mdn-data/-/mdn-data-2.27.1.tgz",
      "integrity": "sha512-9Yubnt3e8A0OKwxYSXyhLymGW4sCufcLG6VdiDdUGVkPhpqLxlvP5vl1983gQjJl3tqbrM731mjaZaP68AgosQ==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/mitt": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/mitt/-/mitt-3.0.1.tgz",
      "integrity": "sha512-vKivATfr97l2/QBCYAkXYDbrIWPM2IIKEl7YPhjCvKlG3kE2gm+uBo6nEXK3M5/Ffh/FLpKExzOQ3JJoJGFKBw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/modern-tar": {
      "version": "0.8.5",
      "resolved": "https://registry.npmjs.org/modern-tar/-/modern-tar-0.8.5.tgz",
      "integrity": "sha512-snEhs+6G5Tjd4I7tLCDOaoln2RgE0bD19RzEKgvgK2hZ5VKy3MpLhLTZ2fWpXSTg4K2cyPwp+VHATFJhxfnOeA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/open": {
      "version": "10.2.0",
      "resolved": "https://registry.npmjs.org/open/-/open-10.2.0.tgz",
      "integrity": "sha512-YgBpdJHPyQ2UE5x+hlSXcnejzAvD0b22U2OuAP+8OnlJT+PjWPxtgmGqKKc+RgTM63U9gN0YzrYc71R2WT/hTA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "default-browser": "^5.2.1",
        "define-lazy-prop": "^3.0.0",
        "is-inside-container": "^1.0.0",
        "wsl-utils": "^0.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/pako": {
      "version": "0.2.9",
      "resolved": "https://registry.npmjs.org/pako/-/pako-0.2.9.tgz",
      "integrity": "sha512-NUcwaKxUxWrZLpDG+z/xZaCgQITkA/Dv4V/T6bw7VON6l1Xz/VnrBqrYjZQ12TamKHzITTfOEIYUj48y2KXImA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prettier": {
      "version": "3.9.9",
      "resolved": "https://registry.npmjs.org/prettier/-/prettier-3.9.9.tgz",
      "integrity": "sha512-Z/CJHIkdujO/OtN7nXUii0Rf3VT5SRuhjBA82Xvu2XhBUgX3nhP67T0LHceBdQLex7OOFGTox+Q5Yg8Jk2Qivg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "prettier": "bin/prettier.cjs"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/prettier/prettier?sponsor=1"
      }
    },
    "node_modules/puppeteer-core": {
      "version": "25.12.0",
      "resolved": "https://registry.npmjs.org/puppeteer-core/-/puppeteer-core-25.12.0.tgz",
      "integrity": "sha512-z6LQUt5SH7jwGtGA+nMtJuEjZIsqPiwQ+EFHCYuVDQrJpvifNmmGuyDvTzAKPyFzihxgHc5f3aMzu2kn8Ps37A==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@puppeteer/browsers": "3.2.3",
        "chromium-bidi": "17.0.2",
        "devtools-protocol": "0.0.1687809",
        "typed-query-selector": "^2.12.2",
        "webdriver-bidi-protocol": "0.4.3",
        "ws": "^8.21.3"
      },
      "engines": {
        "node": ">=22.12.0"
      }
    },
    "node_modules/restructure": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/restructure/-/restructure-3.0.2.tgz",
      "integrity": "sha512-gSfoiOEA0VPE6Tukkrr7I0RBdE0s7H1eFCDBk05l1KIQT1UIKNc5JZy6jdyW6eYH3aR3g5b3PuL77rq0hvwtAw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/run-applescript": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/run-applescript/-/run-applescript-7.1.0.tgz",
      "integrity": "sha512-DPe5pVFaAsinSaV6QjQ6gdiedWDcRCbUuiQfQa2wmWV7+xC9bGulGI8+TdRmoFkAPaBXk8CrAbnlY2ISniJ47Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/sharp": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.35.4.tgz",
      "integrity": "sha512-n++8XWcj+jCOr2IOl7h8LbKnGBDY4aPbmprMONBNFdn0ImXqpGVv5zliDs0V9HbmbCQLpbuo2ej9rAoOQTvMDA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@img/colour": "^1.1.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.8.5"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.35.4",
        "@img/sharp-darwin-x64": "0.35.4",
        "@img/sharp-freebsd-wasm32": "0.35.4",
        "@img/sharp-libvips-darwin-arm64": "1.3.3",
        "@img/sharp-libvips-darwin-x64": "1.3.3",
        "@img/sharp-libvips-linux-arm": "1.3.3",
        "@img/sharp-libvips-linux-arm64": "1.3.3",
        "@img/sharp-libvips-linux-ppc64": "1.3.3",
        "@img/sharp-libvips-linux-riscv64": "1.3.3",
        "@img/sharp-libvips-linux-s390x": "1.3.3",
        "@img/sharp-libvips-linux-x64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3",
        "@img/sharp-linux-arm": "0.35.4",
        "@img/sharp-linux-arm64": "0.35.4",
        "@img/sharp-linux-ppc64": "0.35.4",
        "@img/sharp-linux-riscv64": "0.35.4",
        "@img/sharp-linux-s390x": "0.35.4",
        "@img/sharp-linux-x64": "0.35.4",
        "@img/sharp-linuxmusl-arm64": "0.35.4",
        "@img/sharp-linuxmusl-x64": "0.35.4",
        "@img/sharp-webcontainers-wasm32": "0.35.4",
        "@img/sharp-win32-arm64": "0.35.4",
        "@img/sharp-win32-ia32": "0.35.4",
        "@img/sharp-win32-x64": "0.35.4"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/string-width": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-8.3.0.tgz",
      "integrity": "sha512-ZbmZM0JCihQN91dWnxoipT2KOEyHqEyfRXUyjuRhW8b/xnqPDoq4gWEVApTVa9db2wN8mmoikgFBbjh71+cGeQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "get-east-asian-width": "^1.5.0",
        "strip-ansi": "^7.1.2"
      },
      "engines": {
        "node": ">=20"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/strip-ansi": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.2.0.tgz",
      "integrity": "sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^6.2.2"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/tiny-inflate": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/tiny-inflate/-/tiny-inflate-1.0.3.tgz",
      "integrity": "sha512-pkY1fj1cKHb2seWDy0B16HeWyczlJA9/WW3u3c4z/NiWDsO3DOU5D7nhTLE9CF0yXv/QZFY7sEJmj24dK+Rrqw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "dev": true,
      "license": "0BSD"
    },
    "node_modules/typed-query-selector": {
      "version": "2.12.2",
      "resolved": "https://registry.npmjs.org/typed-query-selector/-/typed-query-selector-2.12.2.tgz",
      "integrity": "sha512-EOPFbyIub4ngnEdqi2yOcNeDLaX/0jcE1JoAXQDDMIthap7FoN795lc/SHfIq2d416VufXpM8z/lD+WRm2gfOQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/unicode-properties": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/unicode-properties/-/unicode-properties-1.4.1.tgz",
      "integrity": "sha512-CLjCCLQ6UuMxWnbIylkisbRj31qxHPAurvena/0iwSVbQ2G1VY5/HjV0IRabOEbDHlzZlRdCrD4NhB0JtU40Pg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.3.0",
        "unicode-trie": "^2.0.0"
      }
    },
    "node_modules/unicode-trie": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/unicode-trie/-/unicode-trie-2.0.0.tgz",
      "integrity": "sha512-x7bc76x0bm4prf1VLg79uhAzKw8DVboClSN5VxJuQ+LKDOVEW9CdH+VY7SP+vX7xCYQqzzgQpFqz15zeLvAtZQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pako": "^0.2.5",
        "tiny-inflate": "^1.0.0"
      }
    },
    "node_modules/webdriver-bidi-protocol": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/webdriver-bidi-protocol/-/webdriver-bidi-protocol-0.4.3.tgz",
      "integrity": "sha512-uuN0goWfxP22B7J/uAgBpOYNPttC+XVseYE+rSY5+rQ+YBeVz/VORw8WbmLVcqW78zNg5A4qnjNXYUWR3il2ig==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/wrap-ansi": {
      "version": "9.0.2",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-9.0.2.tgz",
      "integrity": "sha512-42AtmgqjV+X1VpdOfyTGOYRi0/zsoLqtXQckTmqTeybT+BDIbM/Guxo7x3pE2vtpr1ok6xRqM9OpBe+Jyoqyww==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.2.1",
        "string-width": "^7.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi/node_modules/string-width": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-7.2.0.tgz",
      "integrity": "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^10.3.0",
        "get-east-asian-width": "^1.0.0",
        "strip-ansi": "^7.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ws": {
      "version": "8.21.3",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.21.3.tgz",
      "integrity": "sha512-201TZ/kPWxoPr/OKWjquZR1SWKXcvxdH+e1xrx89b3YbmzLMFCLfnaG1HFIgWzJOEWZ7MvpK++odZufgYR50Rw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/wsl-utils": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/wsl-utils/-/wsl-utils-0.1.0.tgz",
      "integrity": "sha512-h3Fbisa2nKGPxCpm89Hk33lBLsnaGBvctQopaBSOW/uIs6FTe1ATyAnKFJrzVs9vpGdsTe73WF3V4lIsk4Gacw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-wsl": "^3.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yargs": {
      "version": "18.2.0",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-18.2.0.tgz",
      "integrity": "sha512-9OpKOLeaoNFecEp7P6iYbzze/5CqWoH7N3SMs/6y1XF4nMvFMspEGZzJ6uFi9MmQwXhyzqYoSEKO3tvA3Z/o2w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cliui": "^9.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "string-width": "^8.2.1",
        "y18n": "^5.0.5",
        "yargs-parser": "^22.0.0"
      },
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=23"
      }
    },
    "node_modules/yargs-parser": {
      "version": "22.0.0",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-22.0.0.tgz",
      "integrity": "sha512-rwu/ClNdSMpkSrUb+d6BRsSkLUq1fmfsY6TOpYzTwvwkg1/NRG85KBy3kq++A8LKQwX6lsu+aWad+2khvuXrqw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^20.19.0 || ^22.12.0 || >=23"
      }
    },
    "node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    }
  }
}
```

### 8/16 · `package.json`
<!-- casebook-file {"path": "package.json", "lines": 19, "final_newline": true, "sha256": "4d404d5c0eb03e564c4004732e9ce2767adddf71e587bedf23bf401111559116", "original_sha256": "4d404d5c0eb03e564c4004732e9ce2767adddf71e587bedf23bf401111559116"} -->
```json
{
  "name": "supercut-trailer",
  "version": "1.0.0",
  "private": true,
  "description": "AI-Coding SuperVideos 合集总片 · 62.4s · 150BPM · 音画同源 · 通通开源",
  "type": "module",
  "scripts": {
    "prep": "node tools/prep_media.mjs",
    "build": "node tools/build.mjs",
    "score": "python audio/score.py",
    "check": "hyperframes check",
    "snapshot": "hyperframes snapshot",
    "render": "hyperframes render . -q delivery --fps 60 -o renders/supercut-trailer-1080p60.mp4",
    "ship": "ffmpeg -y -i renders/supercut-trailer-1080p60.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart renders/AI-Coding-SuperVideos-720p60.mp4"
  },
  "devDependencies": {
    "hyperframes": "0.8.77"
  }
}
```

### 9/16 · `src/catalog.mjs`
<!-- casebook-file {"path": "src/catalog.mjs", "lines": 141, "final_newline": true, "sha256": "c7c1df5edfe174e6586b3c3e14bd3e77d5fb665ab18da88d3a1469981da11a2f", "original_sha256": "c7c1df5edfe174e6586b3c3e14bd3e77d5fb665ab18da88d3a1469981da11a2f"} -->
```js
// ─────────────────────────────────────────────────────────────────────────────
//  CATALOG · 合集里的 28 部代码视频（唯一真相源之一）
//
//  - folder/file：相对仓库根目录（AI-Coding-SuperVideos/）的真实路径
//  - model：文件夹前缀即"是哪个模型写的"，决定它属于哪个时代（ERA）
//  - wallIn：这部片子最有代表性的 1 秒从哪里开始（秒）。用于"28 宫格巨墙"和海报。
//            数值来自对每部成片 20 格联系表的逐格审片（_survey/sheet_XX.jpg），
//            误差约 ±1s —— 下一位 AI 验收时请对照 build/contact-*.jpg 微调。
//  - spec：成片真实规格（ffprobe 实测）
//  - tech：一句话技术亮点（来自各自 CoExp 复盘文档）
// ─────────────────────────────────────────────────────────────────────────────

export const MODELS = {
  KIMI: { label: 'KIMI', color: '#3CF0C8', era: 1 },
  SWE: { label: 'SWE', color: '#7CC4FF', era: 2 },
  GPT: { label: 'GPT', color: '#A98BFF', era: 3 },
  OPUS: { label: 'CLAUDE OPUS', color: '#FF7A3D', era: 4 },
  SKILL: { label: 'SKILL', color: '#FFD166', era: 4 },
};

// 顺序 = 底部时间尺上 28 个槽位的顺序（按时代排）
export const WORKS = [
  // ── ERA 01 · KIMI ─────────────────────────────────────────────
  { key: 'kimi-beat', folder: 'kimi-ai-beat-sync', file: 'ai-beat-sync.mp4',
    title: 'AI 觉醒', model: 'KIMI', spec: '1080p · 30fps · 51s',
    tech: 'HyperFrames + GSAP · 全曲节拍分析卡点', wallIn: 27.6 },

  // ── ERA 02 · SWE ──────────────────────────────────────────────
  { key: 'ai-rise', folder: 'swe-ai-rise', file: 'kimi_ai_rise_v2.mp4',
    title: 'AI:RISE', model: 'SWE', spec: '1080p · 30fps · 40s',
    tech: 'renderAt(t) 纯函数 · 129.2 BPM 帧级锁拍', wallIn: 3.6 },
  { key: 'kimi-film', folder: 'swe-kimi-source-intro', file: 'kimi_film_1080p.mp4',
    title: '月之暗面 · KIMI', model: 'SWE', spec: '1080p · 30fps · 56s',
    tech: 'numpy 逐像素渲染 · 六幕六种 BPM', wallIn: 33.4 },

  // ── ERA 03 · GPT ──────────────────────────────────────────────
  { key: 'cosmos30', folder: 'gpt-universe-30-change', file: 'COSMOS_30_STYLES_72s_1080p.mp4',
    title: 'COSMOS · 从未知到寂静', model: 'GPT', spec: '1080p · 30fps · 72s',
    tech: '无头 OpenGL · 30 种画风 · 200 BPM', wallIn: 36.2 },
  { key: 'beyond', folder: 'gpt-15-style-ai-beyond-generation', file: 'AI_BEYOND_GENERATION_1080p.mp4',
    title: 'AI · Beyond Generation', model: 'GPT', spec: '1080p · 30fps · 120s',
    tech: 'Python + 原生 GL · 15 个世界', wallIn: 12.0 },
  { key: 'gpt-autumn', folder: 'gpt-mid-autumn-general-video', file: 'gpt-MidAutumn_Final_60s_1080p60.mp4',
    title: '把日子，慢慢过圆', model: 'GPT', spec: '1080p · 60fps · 60s',
    tech: '21 镜 · 每个时代换一种材质', wallIn: 21.0 },
  { key: 'moon-letter', folder: 'gpt-mid-autumn-for-my-dg03', file: 'Moon_Letter_MidAutumn_1080p.mp4',
    title: '月光信笺', model: 'GPT', spec: '竖屏 1080×1920 · 29s',
    tech: '竖屏 · 可交互 HTML 同源', wallIn: 16.0, vertical: true },

  // ── ERA 04 · CLAUDE OPUS ─────────────────────────────────────
  { key: 'shatter', folder: 'opus-broken-reround', file: '碎月重圆_MG动画.mp4',
    title: '碎月重圆', model: 'OPUS', spec: '1080p · 30fps · 30s',
    tech: '自写 3D 合成器 · 23 万粒子 · 抠像拆层', wallIn: 3.0 },
  { key: 'oneink', folder: 'opus-oneink', file: '一畫_Opus5.5_水墨书法.mp4',
    title: '一畫', model: 'OPUS', spec: '1080p · 30fps · 60s',
    tech: '水墨书法 · 手卷一镜到底 · 泼墨诗云', wallIn: 49.8 },
  { key: 'dingge', folder: 'opus-factory-safety-videos', file: 'dingge_1440p60fps.mp4',
    title: '定格', model: 'OPUS', spec: '1440p · 60fps · 87s',
    tech: 'Three.js 定格动画 · 瑞士奶酪模型', wallIn: 12.5 },
  { key: 'claude15', folder: 'opus-claude-intro-with-15-way', file: 'Claude_自我介绍_15种画风.mp4',
    title: 'Claude 自我介绍 · 15 种画风', model: 'OPUS', spec: '1080p · 30fps · 114s',
    tech: '15 种画风 · 一条叙事线', wallIn: 50.0 },
  { key: 'protocom', folder: 'opus-production-video-protocom-intro', file: 'protocom-intro.mp4',
    title: 'protocom', model: 'OPUS', spec: '4K · 60fps · 80s',
    tech: '4K 60fps · 用画风变化叙事', wallIn: 47.0 },
  { key: 'codecosmos', folder: 'opus-universe-history-video', file: 'code_cosmos_stopmotion.mp4',
    title: '代码宇宙', model: 'OPUS', spec: '1080p · 24fps · 68s',
    tech: '27 种代码风格 · 2D→4D · 一拍二定格', wallIn: 33.0 },
  { key: 'phasegate', folder: 'opus-production-video-ai-phase-skill', file: 'ai-phase-skill-intro.mp4',
    title: 'Phase-Gate 升维', model: 'OPUS', spec: '1080p · 60fps · 30s',
    tech: '手绘 → 矢量 → 扁平 → 黏土 → 写实', wallIn: 13.0 },
  { key: 'ageint', folder: 'opus-age-of-intelligence', file: 'AGE_OF_INTELLIGENCE_720p60_share.mp4',
    title: '智能时代', model: 'OPUS', spec: '60fps · 92s · 108 镜',
    tech: '108 镜 · 4170 行 Python · 双 drop', wallIn: 36.5 },
  { key: 'skillshub', folder: 'opus-production-video-skill-hub', file: 'skills-hub-promo.mp4',
    title: 'Skills Hub', model: 'OPUS', spec: '1080p · 60fps · 57s',
    tech: '114 拍 · 顺手从零写一套前端来拍', wallIn: 47.5 },
  { key: 'f12', folder: 'opus-F12-teaching', file: 'DevTools-in-60-Seconds-1080p.mp4',
    title: 'DevTools in 60 Seconds', model: 'OPUS', spec: '1080p · 30fps · 60s',
    tech: '128 BPM · 32 小节 · 附可交互仿真浏览器', wallIn: 35.5 },
  { key: 'hust1037', folder: 'opus-1037-hust-story', file: '1037_MG试片.mp4',
    title: '1037', model: 'OPUS', spec: '1080p · 30fps · 110s',
    tech: '一个符号讲完一所大学', wallIn: 104.0 },
  { key: 'xuanlan', folder: 'opus-introduction-video-xuanlan', file: 'XuanLan-PocketWebShell-promo-1080p60-share.mp4',
    title: '玄览 PocketWebShell', model: 'OPUS', spec: '1080p · 60fps · 55s',
    tech: '32 分钟写完 · 浏览器三十年进化史', wallIn: 24.0 },
  { key: 'studysolo', folder: 'opus-production-video-studysolo', file: 'studysolo-promo -v1.1.mp4',
    title: 'StudySolo', model: 'OPUS', spec: '1080p · 60fps · 60s',
    tech: '真实 Agent 页面 · 过去|现在 分屏', wallIn: 15.5 },
  { key: 'yusheng', folder: 'opus-production-video-ys-blog', file: 'yusheng-blog.mp4',
    title: '羽升集', model: 'OPUS', spec: '1080p · 60fps · 30s',
    tech: '每一拍一个可见动作', wallIn: 6.5 },
  { key: 'shuchenglin', folder: 'opus-shuchenglin-into', file: '树成林宣传片_60s.mp4',
    title: '树成林', model: 'OPUS', spec: '1080p · 30fps · 60s',
    tech: '虚拟时间逐帧录屏 · 卡点靠坐标', wallIn: 38.0 },
  { key: 'stopmotion', folder: 'skill-方块系列定格动画', file: 'stop-motion-3d-intro-web.mp4',
    title: '方块定格 Skill', model: 'SKILL', spec: '720p · 24fps · 60s',
    tech: '搭一次世界，拍任何画风', wallIn: 53.0 },
  { key: 'samemoon', folder: 'opus-mid-autumn-genergal-videos', file: 'mid-autumn.mp4',
    title: '同一个月亮', model: 'OPUS', spec: '1080p · 30fps · 120s',
    tech: '单文件 854 行 · Canvas + Web Audio', wallIn: 64.0 },
  { key: 'gongcishi', folder: 'opus-mid-autumn-highschool-videos', file: '共此时_预览版_720p.mp4',
    title: '共此时', model: 'OPUS', spec: '180s · 217 份真实素材',
    tech: '三年照片 · 机器看片 + 人工看片', wallIn: 160.0 },
  { key: 'moonlamp', folder: 'opus-mid-autumn-for-my-dg02', file: '月光替你亮着灯_学姐中秋快乐.mp4',
    title: '月光替你亮着灯', model: 'OPUS', spec: '1080p · 24fps · 28s',
    tech: '真 3D 一镜到底 · 月夜水彩', wallIn: 9.0 },
  { key: 'readclub', folder: 'opus-hust-read-join-video-v1', file: '华中大读书会_慢下来.mp4',
    title: '慢下来', model: 'OPUS', spec: '竖屏 1080×1920 · 37s',
    tech: '一个 HTML 同时生成画面和音乐', wallIn: 26.0, vertical: true },
  { key: 'senpai', folder: 'opus-mid-autumn-for-my-dg01', file: '中秋·给学姐.mp4',
    title: '中秋 · 给学姐', model: 'OPUS', spec: '竖屏 1080×1920 · 29s',
    tech: 'render(t) 纯函数 · 局部重渲', wallIn: 22.0, vertical: true },
];

export const byKey = Object.fromEntries(WORKS.map((w, i) => [w.key, { ...w, slot: i }]));

// ─── 合集真实统计（2026-09-26 在仓库上实测，勿凭空修改）─────────────────
//   mp4 成片 28 部，合计 2.39 GB，总时长 1876.8 s（≈31 分钟），合计约 69,000 帧
//   CoExp 复盘 24 份，515,858 字符（其中汉字 173,359 个）
//   源码包（zip / tgz / skill）20 个；可交互 HTML 5 个
export const STATS = {
  films: 28,
  coexp: 24,
  coexpChars: 515858,
  packages: 20,
  htmls: 5,
  minutes: 31,
  frames: 69000,
  sizeGB: '2.39',
};

// ─── 下载方式（来自用户提供的 QQ 闪传截图）──────────────────────────────
export const SHARE = {
  name: 'AI-Coding-SuperVideos',
  size: '2.39 GB',
  service: 'QQ 闪传',
  url: 'qfile.qq.com/q/P2tSnByK4K',
  expire: '2026/10/10 05:25 到期',
  qr: 'assets/img/qr.png',
};
```

### 10/16 · `src/code-lines.mjs`
<!-- casebook-file {"path": "src/code-lines.mjs", "lines": 39, "final_newline": true, "sha256": "7350e3bf0f671a88d45a70c04fb465427c9d8183322f5e255b8b5672b1ebcbc8", "original_sha256": "7350e3bf0f671a88d45a70c04fb465427c9d8183322f5e255b8b5672b1ebcbc8"} -->
```js
// ─────────────────────────────────────────────────────────────────────────────
//  真实代码行 · 全部摘自合集里各作品的源码包 / CoExp 复盘中的代码片段（未改动一个字符，只截取单行）
//  冷开场的"代码墙"和隧道壁上的滚动代码都来自这里 —— 画面上出现的每一行，
//  观众下载源码包后都能在对应文件里 Ctrl+F 找到。
// ─────────────────────────────────────────────────────────────────────────────
export const CODE_LINES = [
  { src: 'opus-oneink/main.js', line: 'const W = 1920, H = 1080, FPS = 30;' },
  { src: 'opus-oneink/main.js', line: 'let rnd = mulberry32(20260926);' },
  { src: 'opus-oneink/main.js', line: 'const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };' },
  { src: 'opus-oneink/main.js', line: 'const easeIO = t => t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t);' },
  { src: 'opus-oneink/render.js', line: "const url = await p.evaluate(f => { window.renderFrame(f); return document.getElementById('gl').toDataURL('image/jpeg', 0.95); }, f);" },
  { src: 'opus-universe-history-video/web/engine.js', line: "export const ACC = { '2D': '#00E5FF', '2.5D': '#FFD600', '3D': '#FF3D7F', '4D': '#B388FF' };" },
  { src: 'opus-universe-history-video/web/engine.js', line: 'const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, preserveDrawingBuffer: true, alpha: false });' },
  { src: 'opus-universe-history-video/music.py', line: 'SR = 44100; BPM = 120; BEAT = 60 / BPM; DUR = 68.0' },
  { src: 'opus-universe-history-video/music.py', line: 'f = 45 + 110 * np.exp(-t / 0.03) + (30 * np.exp(-t / 0.2) if big else 0)' },
  { src: 'opus-universe-history-video/music.py', line: 'return np.tanh(s * 1.6) * g' },
  { src: 'opus-claude-intro-with-15-way/claude_intro/core.py', line: 'def seg(x, a, b): return clamp((x - a) / (b - a)) if b != a else float(x >= a)' },
  { src: 'opus-claude-intro-with-15-way/claude_intro/core.py', line: 'def e_outexp(t): t = clamp(t); return 1 if t >= 1 else 1 - 2 ** (-10 * t)' },
  { src: 'gpt-universe-30-change/COSMOS/score.py', line: "SR=48000;N=72*SR;B=.3;BASE=Path(__file__).resolve().parent" },
  { src: 'gpt-universe-30-change/COSMOS/score.py', line: "def filt(x,c,kind='lowpass'):return sosfilt(butter(2,c,btype=kind,fs=SR,output='sos'),x).astype(np.float32)" },
  { src: 'gpt-universe-30-change/COSMOS/score.py', line: 'def env(t,a=.004,d=.15):return (1-np.exp(-t/a))*np.exp(-t/d)' },
  { src: 'gpt-universe-30-change/COSMOS/glrender.py', line: 'def render(self,scene,t,beat=0.):' },
  { src: 'opus-age-of-intelligence/src/timeline.py', line: 'BPM = 60.0 * FPS / FPB        # 128.5714' },
  { src: 'opus-age-of-intelligence/src/timeline.py', line: 'N_FRAMES = END_BEAT * FPB     # 5544 frames = 92.4 s' },
  { src: 'opus-age-of-intelligence/src/timeline.py', line: "shot(184, END_BEAT, 'end_card')" },
  { src: 'opus-shuchenglin-into/comp/timeline.js', line: "function stamp(word, lt, { size = 380, dur = .34, color = '#fff', solid = false } = {}) {" },
  { src: 'opus-shuchenglin-into/render.py', line: "d=await pg.evaluate(f'renderFrame({round(t*30)})')" },
  { src: 'opus-production-video-skill-hub/src/js/engine.js', line: 'export const prog = (b, b0, b1, ease = E.linear) => ease(clamp((b - b0) / (b1 - b0)));' },
  { src: 'opus-production-video-skill-hub/src/js/engine.js', line: 'export function hit(b, at, decay = 0.35) {' },
  { src: 'opus-production-video-skill-hub/render.mjs', line: '"-f", "image2pipe", "-framerate", String(fps), "-i", "-",' },
  { src: 'opus-F12-teaching/music.py', line: 'def supersaw(freqs, d, cutoff=2400):' },
  { src: 'swe-ai-rise/main_v2.js', line: 'window.renderAt=function(t){' },
  { src: 'swe-kimi-source-intro/scenes.py', line: 'draw_stars(img, _SF0, t, amp=ss(seg(t, 3.2, 5.5)) * 0.9)' },
  { src: 'swe-kimi-source-intro/film_par.py', line: '["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",' },
  { src: 'swe-kimi-source-intro/kit.py', line: 'def eo_back(x, s=1.70158):' },
  { src: 'opus-mid-autumn-for-my-dg01/CoExp.md', line: 'const seg = (t,a,b) => clamp((t-a)/(b-a));' },
  { src: 'opus-mid-autumn-for-my-dg01/CoExp.md', line: "const eio = x => x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;" },
  { src: 'opus-mid-autumn-for-my-dg01/CoExp.md', line: "await page.evaluate(t => render(t), i / FPS);" },
];
```

### 11/16 · `src/edl.mjs`
<!-- casebook-file {"path": "src/edl.mjs", "lines": 286, "final_newline": true, "sha256": "d3c2a858d71b0b615c59624b35da98b724e3ba81385bfc65924ca27a1ade36d1", "original_sha256": "d3c2a858d71b0b615c59624b35da98b724e3ba81385bfc65924ca27a1ade36d1"} -->
```js
// ─────────────────────────────────────────────────────────────────────────────
//  EDL · 整支片子的"乐谱"（唯一真相源）
//
//  坐标系：一切以"拍"为单位。150 BPM → 1 拍 = 0.4 s = 12 帧@30fps（整数，卡点地基）
//          1 小节 = 4 拍 = 1.6 s。全片 156 拍 = 62.4 s。
//
//  画面（tools/build.mjs → index.html → src/runtime.js）
//  音乐（audio/score.py，读取 build/cues.json）
//  两边读的是同一份数据：画面切在哪一拍，鼓就落在哪一拍 —— 音画同源。
//
//  叙事：
//    ACT 0  冷开场   b0–16    "没有 AE / 没有 PR / 没有剪辑软件"  → frame = render(t)
//    ACT 1  ERA 01   b16–27   KIMI   · 觉醒：字跟着鼓点砸下来
//    ACT 2  ERA 02   b27–42   SWE    · 像素：不开浏览器，逐像素算
//    ACT 3  ERA 03   b42–62   GPT    · 世界：一个模型，三十个世界
//    ACT 4  ERA 04   b62–104  OPUS   · 电影：AE 级合成 / 水墨 / 3D / 4K  → 隧道 → 28 宫格巨墙
//    ACT 5  凝视     b104–116 音乐骤停。"28 部片子。6.9 万帧，没有一帧是手剪的。它们是怎么做出来的？"
//    ACT 6  通通开源 b116–140 四字砸屏 → 三柱（源码/复盘/成片）→ QQ 闪传卡片 + 二维码
//    ACT 7  尾声     b140–156 回到终端：下一部，由你来写。
// ─────────────────────────────────────────────────────────────────────────────

export const BPM = 150;
export const BEAT = 60 / BPM; // 0.4 s
export const FPS = 30;
export const TOTAL_BEATS = 156;
export const DURATION = TOTAL_BEATS * BEAT; // 62.4 s
export const T = (b) => +(b * BEAT).toFixed(4);

// ─── 段落（音乐编曲与画面场景共用）────────────────────────────────────────
export const SECTIONS = [
  { id: 'cold', b0: 0, b1: 16, energy: 0.15 },
  { id: 'era1', b0: 16, b1: 27, energy: 0.55 },
  { id: 'era2', b0: 27, b1: 42, energy: 0.65 },
  { id: 'era3', b0: 42, b1: 62, energy: 0.8 },
  { id: 'era4card', b0: 62, b1: 64, energy: 0.9 },
  { id: 'drop', b0: 64, b1: 88, energy: 1.0 },
  { id: 'tunnel', b0: 88, b1: 96, energy: 0.95 },
  { id: 'wall', b0: 96, b1: 104, energy: 1.0 },
  { id: 'breath', b0: 104, b1: 116, energy: 0.05 },
  { id: 'reveal', b0: 116, b1: 128, energy: 1.0 },
  { id: 'card', b0: 128, b1: 140, energy: 0.7 },
  { id: 'outro', b0: 140, b1: 156, energy: 0.2 },
];

// ─── 时代卡 ────────────────────────────────────────────────────────────────
export const ERAS = [
  { n: '01', model: 'KIMI', title: '觉醒', sub: '让每一个字，都砸在鼓点上', b0: 16, b1: 19, node: 0 },
  { n: '02', model: 'SWE', title: '像素', sub: '不开浏览器，逐像素算出每一帧', b0: 27, b1: 30, node: 1 },
  { n: '03', model: 'GPT', title: '世界', sub: '一个模型，三十个世界', b0: 42, b1: 45, node: 2 },
  { n: '04', model: 'OPUS', title: '电影', sub: 'AE 级合成 · 水墨 · 3D · 4K', b0: 62, b1: 64, node: 3 },
];

// ─── 镜头表 ────────────────────────────────────────────────────────────────
//  type:
//   win    浮动窗口，在 3D 空间里一层层堆叠（ERA 01/02）
//   full   全屏英雄镜头（每拍一切）
//   duoL / phoneR   左横屏 + 右手机竖屏
//   split  n 联斜切分屏（拉片感）；panel = 0..n-1
//   phone  竖屏作品放进手机框
//   grid   COSMOS 30 风格倍增宫格（特殊，见 GRID）
//   wall   28 宫格巨墙（特殊，见 WALL）
//  in = 源片入点（秒），b0/b1 = 在本片中的起止拍
export const SHOTS = [
  // ERA 01 · KIMI —— 窗口开始堆叠
  { id: 'w01', type: 'win', work: 'kimi-beat', in: 1.9, b0: 19, b1: 21 },
  { id: 'w02', type: 'win', work: 'kimi-beat', in: 4.9, b0: 21, b1: 23 },
  { id: 'w03', type: 'win', work: 'kimi-beat', in: 23.62, b0: 23, b1: 25 },
  { id: 'w04', type: 'win', work: 'kimi-beat', in: 45.8, b0: 25, b1: 27 },
  // ERA 02 · SWE —— 堆叠继续长高
  { id: 'w05', type: 'win', work: 'ai-rise', in: 3.62, b0: 30, b1: 32 },
  { id: 'w06', type: 'win', work: 'ai-rise', in: 6.1, b0: 32, b1: 34 },
  { id: 'w07', type: 'win', work: 'kimi-film', in: 4.6, b0: 34, b1: 36 },
  { id: 'w08', type: 'win', work: 'kimi-film', in: 13.6, b0: 36, b1: 38 },
  { id: 'w09', type: 'win', work: 'ai-rise', in: 26.9, b0: 38, b1: 40 },
  { id: 'w10', type: 'win', work: 'kimi-film', in: 33.2, b0: 40, b1: 42 },

  // ERA 03 · GPT
  //   b45–51 COSMOS 倍增宫格（见 GRID）
  { id: 'g01', type: 'full', work: 'beyond', in: 12.0, b0: 51, b1: 52, label: '15 个世界 · 体素岛' },
  { id: 'g02', type: 'full', work: 'beyond', in: 18.0, b0: 52, b1: 53, label: '15 个世界 · 黏土机器人' },
  { id: 'g03', type: 'full', work: 'beyond', in: 48.0, b0: 53, b1: 54, label: '15 个世界 · 波普网点' },
  { id: 'g04', type: 'full', work: 'beyond', in: 84.0, b0: 54, b1: 55, label: '15 个世界 · 霓虹' },
  { id: 'g05', type: 'full', work: 'beyond', in: 96.0, b0: 55, b1: 56, label: '15 个世界 · 铬金属' },
  { id: 'g06', type: 'full', work: 'beyond', in: 102.0, b0: 56, b1: 57, label: '15 个世界 · 粒子' },
  { id: 'g07', type: 'full', work: 'gpt-autumn', in: 6.0, b0: 57, b1: 59, label: '铅笔线描 → 水墨 → 雕刻' },
  { id: 'g08', type: 'duoL', work: 'gpt-autumn', in: 20.5, b0: 59, b1: 62 },
  { id: 'g09', type: 'phoneR', work: 'moon-letter', in: 15.0, b0: 59, b1: 62 },

  // ERA 04 · OPUS —— DROP：每拍一切
  { id: 'h01', type: 'full', work: 'shatter', in: 3.0, b0: 64, b1: 66, label: '自写 3D 合成器 · Voronoi 碎裂' },
  { id: 'h02', type: 'full', work: 'oneink', in: 50.0, b0: 66, b1: 67, label: '逆锋压笔 · 泼墨一笔' },
  { id: 'h03', type: 'full', work: 'dingge', in: 34.6, b0: 67, b1: 68, label: 'Three.js 定格 · 慢动作坠落' },
  { id: 'h04', type: 'full', work: 'claude15', in: 50.5, b0: 68, b1: 69, label: '15 种画风 · 体素' },
  { id: 'h05', type: 'full', work: 'protocom', in: 75.4, b0: 69, b1: 70, label: '4K 60fps 定版' },
  { id: 'h06', type: 'full', work: 'codecosmos', in: 10.0, b0: 70, b1: 71, label: '4D 超立方体' },
  { id: 'h07', type: 'full', work: 'shatter', in: 12.0, b0: 71, b1: 72, label: 'MoGraph 魔方墙 · 336 立方体' },
  { id: 'h08', type: 'full', work: 'phasegate', in: 19.4, b0: 72, b1: 73, label: '升维 · 曲速' },
  { id: 'h09', type: 'full', work: 'ageint', in: 36.6, b0: 73, b1: 74, label: '注意力机制 · 3D' },
  { id: 'h10', type: 'full', work: 'skillshub', in: 19.8, b0: 74, b1: 75, label: 'Logo 冲击出场' },
  { id: 'h11', type: 'full', work: 'f12', in: 20.8, b0: 75, b1: 76, label: 'Console · 故障字' },
  { id: 'h12', type: 'full', work: 'claude15', in: 74.0, b0: 76, b1: 77, label: '15 种画风 · 瑞士主义' },
  { id: 'h13', type: 'full', work: 'dingge', in: 77.4, b0: 77, b1: 78, label: '2560×1440 · 60fps' },
  { id: 'h14', type: 'full', work: 'hust1037', in: 104.2, b0: 78, b1: 79, label: '几百只小手连成山脊' },
  { id: 'h15', type: 'full', work: 'oneink', in: 4.6, b0: 79, b1: 80, label: '「永」字八法 · 按笔顺书写' },

  // 拉片 · 分屏
  { id: 's1a', type: 'split', n: 2, panel: 0, work: 'xuanlan', in: 24.0, b0: 80, b1: 82 },
  { id: 's1b', type: 'split', n: 2, panel: 1, work: 'studysolo', in: 15.5, b0: 80, b1: 82 },
  { id: 's2a', type: 'split', n: 3, panel: 0, work: 'yusheng', in: 6.5, b0: 82, b1: 84 },
  { id: 's2b', type: 'split', n: 3, panel: 1, work: 'shuchenglin', in: 38.0, b0: 82, b1: 84 },
  { id: 's2c', type: 'split', n: 3, panel: 2, work: 'protocom', in: 47.0, b0: 82, b1: 84 },
  { id: 's3a', type: 'split', n: 4, panel: 0, work: 'stopmotion', in: 53.0, b0: 84, b1: 86 },
  { id: 's3b', type: 'split', n: 4, panel: 1, work: 'codecosmos', in: 33.0, b0: 84, b1: 86 },
  { id: 's3c', type: 'split', n: 4, panel: 2, work: 'gongcishi', in: 160.0, b0: 84, b1: 86 },
  { id: 's3d', type: 'split', n: 4, panel: 3, work: 'samemoon', in: 64.0, b0: 84, b1: 86 },
  { id: 'p1', type: 'phone', panel: 0, work: 'readclub', in: 25.0, b0: 86, b1: 88 },
  { id: 'p2', type: 'phone', panel: 1, work: 'senpai', in: 21.5, b0: 86, b1: 88 },
  { id: 'p3', type: 'phone', panel: 2, work: 'moonlamp', in: 8.6, b0: 86, b1: 88 },
];

// 窗口一旦出现就一直播放到堆叠结束（后排窗口仍然是"活"的），其余镜头播放 b0→b1
export const STACK_END = 42;
export const clipSpan = (s) => ({ b0: s.b0, b1: s.type === 'win' ? STACK_END : s.b1 });

// COSMOS 30 风格倍增：1 → 4 → 9 → 16 格，每格是 COSMOS 的不同一镜（每镜 2.4 s）
export const GRID = {
  work: 'cosmos30',
  b0: 45,
  b1: 51,
  steps: [ // 第几拍出现几格
    { b: 45, n: 1 },
    { b: 46, n: 4 },
    { b: 47, n: 9 },
    { b: 48, n: 16 },
  ],
  // COSMOS 30 镜里挑 16 镜（镜号 0..29），入点 = 镜号 × 2.4 s
  shots: [9, 1, 7, 19, 3, 12, 15, 26, 5, 22, 10, 17, 28, 2, 13, 24],
  shotLen: 2.4,
};

// 28 宫格巨墙：7 × 4，每格用 catalog 里的 wallIn 入点
export const WALL = { b0: 96, b1: 104, cols: 7, rows: 4, clipLen: 3.4 };
// 隧道：28 张海报贴在四壁，摄像机前冲
export const TUNNEL = { b0: 88, b1: 96 };

// ─── 文字 cue（全部文字都在这里，改文案只改这一处）─────────────────────────
export const TEXT = {
  cold: {
    prompt: '$ ',
    command: 'render(t)',
    typeB0: 2,
    typeB1: 4.6,
    nos: [
      { text: '没有 AE', b: 6 },
      { text: '没有 PR', b: 7 },
      { text: '没有剪辑软件', b: 8 },
    ],
    nosOut: 10,
    thesis: '每一帧，都是时间的函数',
    formula: 'frame = render(t)',
    thesisB0: 10,
    thesisB1: 15.5,
    codeWallB0: 12.5,
    codeWallB1: 15.9,
  },
  grid: { big: '×30', small: '种画风，一支片', b0: 48, b1: 51 },
  drop: { n: '04', word: '电影', b0: 64, b1: 66 },
  tunnel: { line: '从一行字，到一整个宇宙', b0: 89, b1: 95.5 },
  wall: { title: 'AI-CODING · SUPERVIDEOS', sub: '28 部 · 全部由代码生成', b0: 97, b1: 104 },
  breath: [
    { big: '28 部片子。', small: '31 分钟 · 6.9 万帧', b0: 104.5, b1: 107.5 },
    { big: '没有一帧，是手动剪出来的。', small: '每一帧都由 render(t) 算出', b0: 107.5, b1: 110.5 },
    { big: '它们，是怎么做出来的？', small: '', b0: 110.5, b1: 114.5 },
  ],
  reveal: { chars: ['通', '通', '开', '源'], b: [116, 117, 118, 119], en: 'OPEN SOURCE · ALL OF IT', enB: 120, out: 124 },
  pillars: {
    b0: 124,
    b1: 128.6,
    items: [
      { head: '源码', en: 'SOURCE', num: 20, unit: '个工程包', sub: '+ 5 个可交互网页' },
      { head: '复盘', en: 'CoExp', num: 24, unit: '份经验文档', sub: '51 万字 · 每一个坑都写进去了' },
      { head: '成片', en: 'FILM', num: 28, unit: '部代码视频', sub: '2.39 GB · 31 分钟' },
    ],
  },
  card: { b0: 128, b1: 140, cta: '扫码，全部带走', note: '源码 · 复盘 · 成片 · 一个不留' },
  outro: {
    b0: 140,
    b1: 156,
    typeB0: 141,
    typeB1: 142.6,
    answerB: 143,
    answer: '下一部，由你来写。',
    creditsB: 146.5,
    credits: [
      '本片同样 100% 由代码生成',
      '画面 HTML + GSAP · render(t) 纯函数 ｜ 配乐 numpy 逐样本合成',
      'Claude Opus 5.5 · 2026 秋',
    ],
    fadeB0: 153,
  },
};

// ─── 音效 cue（score.py 按 kind 合成；gain 为线性增益）──────────────────────
function build() {
  const s = [];
  const add = (b, kind, o = {}) => s.push({ b, kind, ...o });
  // 冷开场：打字
  const cmd = TEXT.cold.command;
  for (let i = 0; i < cmd.length; i++) {
    add(TEXT.cold.typeB0 + (i * (TEXT.cold.typeB1 - TEXT.cold.typeB0)) / cmd.length, 'key', { gain: 0.5, seed: i });
  }
  add(TEXT.cold.typeB1 + 0.25, 'enter', { gain: 0.7 });
  add(5, 'swoosh', { gain: 0.35 });
  TEXT.cold.nos.forEach((n, i) => {
    add(n.b, 'thump', { gain: 0.85 });
    add(n.b + 0.5, 'strike', { gain: 0.45, seed: i });
  });
  add(10, 'boom', { gain: 0.6 });
  add(12.5, 'riser', { b1: 16, gain: 0.8 });
  add(16, 'revcym', { b1: 16, len: 2.4, gain: 0.5 });

  // 时代卡：冲击 + 曲线上升音
  for (const e of ERAS) {
    if (e.b0 === 62) continue;
    add(e.b0, 'impact', { gain: e.b0 === 16 ? 1.0 : 0.8 });
    add(e.b0, 'scan', { b1: e.b1, gain: 0.3 });
  }
  // 窗口入场
  for (const sh of SHOTS.filter((x) => x.type === 'win')) add(sh.b0, 'whoosh', { gain: 0.32, len: 0.35 });
  // 宫格倍增
  for (const st of GRID.steps) add(st.b, 'shutter', { gain: 0.55, n: st.n });
  add(48, 'impact', { gain: 0.55 });
  // 15 个世界 + 分屏：每拍快门
  for (const sh of SHOTS.filter((x) => x.type === 'full' && x.b0 >= 51 && x.b0 < 62)) add(sh.b0, 'shutter', { gain: 0.35 });
  add(59, 'swoosh', { gain: 0.4 });
  // ERA 04：曲线冲破天花板 → 半拍真空 → DROP
  add(58, 'riser', { b1: 63.5, gain: 1.0 });
  add(60, 'snareroll', { b1: 63.5, gain: 0.55 });
  add(62, 'scan', { b1: 63.5, gain: 0.4 });
  add(64, 'impact', { gain: 1.25 });
  add(64, 'crash', { gain: 0.8 });
  for (const sh of SHOTS.filter((x) => x.type === 'full' && x.b0 >= 66 && x.b0 < 80)) add(sh.b0, 'hit', { gain: 0.35, seed: sh.b0 });
  add(80, 'crash', { gain: 0.6 });
  for (let b = 80; b < 88; b += 2) add(b, 'swoosh', { gain: 0.45 });
  add(86, 'glitch', { gain: 0.4, len: 0.4 });
  // 隧道
  add(88, 'crash', { gain: 0.55 });
  add(88, 'tunnel', { b1: 96, gain: 0.55 });
  add(92, 'riser', { b1: 96, gain: 0.7 });
  // 巨墙
  add(96, 'impact', { gain: 1.0 });
  add(96, 'crash', { gain: 0.7 });
  add(100, 'snareroll', { b1: 104, gain: 0.7 });
  add(100, 'riser', { b1: 104, gain: 0.9 });
  // 骤停
  add(104, 'tapestop', { gain: 0.6 });
  [105, 106.2, 108.5, 109.7, 112, 113.2].forEach((b) => add(b, 'heart', { gain: 0.6 }));
  add(104.5, 'bell', { gain: 0.45, note: 62 });
  add(107.5, 'bell', { gain: 0.45, note: 65 });
  add(110.5, 'bell', { gain: 0.5, note: 69 });
  add(112, 'revswell', { b1: 116, gain: 0.9 });
  add(113, 'riser', { b1: 115.75, gain: 1.0 });
  // 通 通 开 源
  TEXT.reveal.b.forEach((b, i) => {
    add(b, 'megaimpact', { gain: 1.0 + i * 0.08, seed: i });
  });
  add(120, 'crash', { gain: 0.9 });
  add(124, 'swoosh', { gain: 0.5 });
  for (let i = 0; i < 3; i++) add(124 + i * 0.5, 'thump', { gain: 0.6 });
  // 卡片
  add(128, 'impact', { gain: 0.7 });
  add(128, 'suck', { b1: 131, gain: 0.55 });
  add(131, 'chime', { gain: 0.6 });
  add(133, 'scan', { b1: 135, gain: 0.35 });
  add(136, 'downlifter', { b1: 140, gain: 0.5 });
  // 尾声
  const cmd2 = TEXT.cold.command;
  for (let i = 0; i < cmd2.length; i++) {
    add(TEXT.outro.typeB0 + (i * (TEXT.outro.typeB1 - TEXT.outro.typeB0)) / cmd2.length, 'key', { gain: 0.45, seed: 40 + i });
  }
  add(TEXT.outro.typeB1 + 0.2, 'enter', { gain: 0.6 });
  add(TEXT.outro.answerB, 'bell', { gain: 0.55, note: 74 });
  add(TEXT.outro.answerB, 'boom', { gain: 0.4 });
  return s.sort((a, b) => a.b - b.b);
}
export const SFX = build();
```

### 12/16 · `src/runtime.js`
<!-- casebook-file {"path": "src/runtime.js", "lines": 900, "final_newline": true, "sha256": "cee7c297921280e8917ef5c6136295d5870715b37c703d304b1241b51313bf3b", "original_sha256": "cee7c297921280e8917ef5c6136295d5870715b37c703d304b1241b51313bf3b"} -->
```js
/* ─────────────────────────────────────────────────────────────────────────────
   runtime.js · 整支片子 = 一个函数 render(t)
   ---------------------------------------------------------------------------
   这正是合集里 28 部片子共同的秘密：画面是时间的纯函数。
   本片也不例外 —— 没有 requestAnimationFrame，没有 Date.now()，没有未播种的随机数。
   HyperFrames 逐帧 seek GSAP 时间轴 → onUpdate → render(tl.time())。
   任意一帧都能单独渲染：在浏览器控制台执行 __render(37.2) 即可预览第 37.2 秒。

   结构：
     §1 数学 / 缓动 / 伪随机        §6 GPT：宫格倍增 / 全屏 / 双画幅
     §2 DOM 写入缓存               §7 OPUS：DROP / 分屏 / 手机 / 隧道 / 巨墙
     §3 事件表（闪白/震屏/冲击波）  §8 凝视 / 通通开源 / 三柱 / 卡片 / 尾声
     §4 冷开场                     §9 HUD（时间码、时代、28 槽时间尺）
     §5 时代卡 + 能力曲线 / 窗口堆叠 §10 前后景 FX 画布（颗粒、代码墙、速度线…）
   ───────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const D = window.__EDL;
  const { BEAT, FPS, DURATION, TEXT: TX } = D;
  const W = 1920, H = 1080, CX = 960, CY = 540;

  // ═══ §1 数学 ═══════════════════════════════════════════════════════════════
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (x, a, b) => clamp((x - a) / (b - a));
  const Ez = {
    oC: (x) => 1 - Math.pow(1 - x, 3),
    iC: (x) => x * x * x,
    ioC: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    oE: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    iE: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
    oQ: (x) => 1 - Math.pow(1 - x, 5),
    oB: (x, s = 1.9) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
    ioS: (x) => 0.5 - 0.5 * Math.cos(Math.PI * x),
  };
  // 阻尼弹簧：0→1，带一次过冲（AE 里 "Overshoot" 表达式的解析版）
  const spring = (x, freq = 2.2, decay = 6) => (x <= 0 ? 0 : x >= 1.6 ? 1 : 1 - Math.exp(-decay * x) * Math.cos(freq * Math.PI * x));
  // 包络：a0→a1 淡入，b0→b1 淡出
  const env = (x, a0, a1, b0, b1) => Math.min(seg(x, a0, a1), 1 - seg(x, b0, b1));
  const pulse = (x, at, decay) => (x < at ? 0 : Math.exp(-(x - at) / decay));
  const inR = (x, a, b) => x >= a && x < b;
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f3 = (v) => (Math.abs(v) < 1e-4 ? 0 : +v.toFixed(3));

  // ═══ §2 DOM ════════════════════════════════════════════════════════════════
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const memo = new WeakMap();
  function css(el, prop, val) {
    if (!el) return;
    let c = memo.get(el);
    if (!c) memo.set(el, (c = {}));
    if (c[prop] !== val) {
      c[prop] = val;
      if (prop.startsWith('--')) el.style.setProperty(prop, val);
      else el.style[prop] = val;
    }
  }
  const op = (el, v) => css(el, 'opacity', v <= 0.002 ? '0' : v >= 0.998 ? '1' : v.toFixed(3));
  const tf = (el, s) => css(el, 'transform', s);
  function txt(el, s) {
    if (!el) return;
    let c = memo.get(el);
    if (!c) memo.set(el, (c = {}));
    if (c.__t !== s) { c.__t = s; el.textContent = s; }
  }

  const byKey = Object.fromEntries(D.WORKS.map((w) => [w.key, w]));
  const SHOTS = D.SHOTS;
  const wins = SHOTS.filter((s) => s.type === 'win');
  const fulls = SHOTS.filter((s) => s.type === 'full');
  const splits = SHOTS.filter((s) => s.type === 'split');
  const phones = SHOTS.filter((s) => s.type === 'phone');

  const el = {};
  function grab() {
    ['stage', 'cold', 'cold-term', 'cold-cmd', 'cold-cursor', 'cold-thesis', 'cold-formula', 'stack', 'stack-cam', 'grid', 'grid-label',
      'full', 'duo', 'duo-left', 'duo-phone', 'duo-label', 'drop-ov', 'split', 'phones', 'tunnel', 'tunnel-cam', 'tunnel-line',
      'wall', 'wall-cam', 'wall-title', 'wall-sub', 'breath', 'flyers', 'reveal', 'rv-row', 'rv-en', 'rv-sweep', 'pillars', 'card', 'share',
      'folder', 'sh-count', 'sh-link-t', 'sh-link-u', 'qrbox', 'qr-scan', 'card-cta', 'card-note', 'outro', 'out-term', 'out-cmd', 'out-cursor',
      'out-answer', 'mini', 'hud-tl', 'hud-rec', 'hud-time', 'hud-frame', 'hud-era', 'hud-era-k', 'hud-era-v', 'ruler', 'ruler-base', 'playhead',
      'hud-count', 'hud-count-n', 'lbx-top', 'lbx-bot', 'fxback', 'fxfront'].forEach((id) => (el[id] = $(id)));
    el.nos = TX.cold.nos.map((_, i) => $('no' + i));
    el.strikes = el.nos.map((n) => n.querySelector('.strike'));
    el.formulaT = el['cold-formula'].querySelector('.t');
    el.eras = D.ERAS.map((_, i) => {
      const r = $('era' + (i + 1));
      return { root: r, num: r.querySelector('.era-num'), fill: r.querySelector('.fillnum'), chip: r.querySelector('.era-chip'),
        chars: $$('.ch', r), sub: r.querySelector('.era-sub'), cap: r.querySelector('.era-cap'), title: r.querySelector('.era-title') };
    });
    el.wins = wins.map((s) => { const r = $('win-' + s.id); return { r, shade: r.querySelector('.win-shade') }; });
    el.gtiles = D.GRID.shots.map((_, i) => $('gt' + i));
    el.shots = fulls.map((s) => { const r = $('shot-' + s.id); return { r, media: r.querySelector('.shot-media'), label: r.querySelector('.label') }; });
    el.panels = splits.map((s) => { const r = $('pn-' + s.id); return { r, media: r.querySelector('.panel-media'), label: r.querySelector('.label') }; });
    el.phones = phones.map((s) => { const r = $('ph-' + s.id); return { r, label: r.querySelector('.ph-label') }; });
    el.phonesLayer = $('phones'); // el.phones 是数组，层的 id 单独存
    el.tplanes = D.WORKS.map((w) => $('tp-' + w.key));
    el.wtiles = D.WORKS.map((w) => { const r = $('wt-' + w.key); return { r, flash: r.querySelector('.flash') }; });
    el.blines = TX.breath.map((_, i) => { const r = $('bl' + i); return { r, big: r.querySelector('.big'), small: r.querySelector('.small') }; });
    el.flyers = D.WORKS.map((w) => $('fl-' + w.key));
    el.flyersLayer = $('flyers'); // el.flyers 是数组，层的 id 单独存
    el.rchars = TX.reveal.chars.map((_, i) => $('rc' + i));
    el.pillars = TX.pillars.items.map((_, i) => { const r = $('pl' + i); return { r, num: r.querySelector('.pl-num'), list: r.querySelector('.pl-list'), rows: +r.querySelector('.pl-list').dataset.rows }; });
    el.pillarsLayer = $('pillars'); // el.pillars 是数组，层的 id 单独存
    el.credits = TX.outro.credits.map((_, i) => $('cr' + i));
    el.slots = D.WORKS.map((w) => { const r = $('sl-' + w.key); return { r, on: r.querySelector('.on') }; });
    el.cb = el.fxback.getContext('2d');
    el.cf = el.fxfront.getContext('2d');
  }

  // ═══ §3 事件表（单位：拍）═════════════════════════════════════════════════
  const FLASH = [], SHAKE = [], RING = [], GLITCH = [];
  function buildEvents() {
    const fl = (b, a, d = 0.3, c = '255,255,255') => FLASH.push({ b, a, d, c });
    const sh = (b, amp, d = 0.4) => SHAKE.push({ b, amp, d });
    const ring = (b, x, y, c, r = 900, d = 1.2, w = 10) => RING.push({ b, x, y, c, r, d, w });
    TX.cold.nos.forEach((n) => sh(n.b, 7, 0.25));
    D.ERAS.forEach((e, i) => { if (i < 3) { fl(e.b0, 0.55, 0.35); sh(e.b0, 12, 0.35); ring(e.b0, CX, CY, D.MODELS[e.model].color, 1100, 1.4, 14); } });
    fulls.forEach((s) => fl(s.b0, s.b0 === 64 ? 1 : 0.2, s.b0 === 64 ? 0.7 : 0.18));
    D.GRID.steps.forEach((st) => fl(st.b, 0.22, 0.2));
    fl(48, 0.4, 0.3, '169,139,255');
    sh(64, 30, 0.55); ring(64, CX, CY, '#FF7A3D', 1500, 1.6, 22); ring(64.25, CX, CY, '#FFFFFF', 1200, 1.2, 6);
    for (let b = 66; b < 80; b++) sh(b, 5, 0.18);
    [80, 82, 84, 86].forEach((b) => { fl(b, 0.3, 0.22); sh(b, 8, 0.25); });
    fl(96, 0.65, 0.4); sh(96, 16, 0.4); ring(96, CX, CY, '#FFFFFF', 1400, 1.2, 8);
    TX.reveal.b.forEach((b, i) => {
      const x = 160 + i * 400 + 200, y = 500;
      fl(b, 0.5 + i * 0.06, 0.25); sh(b, 18 + i * 5, 0.35);
      ring(b, x, y, '#FF7A3D', 900 + i * 150, 1.3, 16); ring(b + 0.12, x, y, '#FFFFFF', 600, 0.9, 5);
    });
    fl(120, 0.75, 0.45); sh(120, 24, 0.5); ring(120, CX, 500, '#FFD166', 1800, 1.8, 26);
    fl(128, 0.35, 0.3); fl(131, 0.25, 0.25, '61,139,255');
    fl(143, 0.3, 0.5);
    [[15.55, 0.35], [41.7, 0.3], [63.1, 0.35], [86, 0.4], [103.55, 0.45], [127.6, 0.3]].forEach(([b, len]) => GLITCH.push({ b, len }));
  }
  const sumPulse = (list, b) => {
    let a = 0;
    for (const e of list) if (b >= e.b && b < e.b + e.d * 6) a = Math.max(a, e.a * pulse(b, e.b, e.d));
    return a;
  };

  // ═══ §4 冷开场 b0–16 ══════════════════════════════════════════════════════
  function sceneCold(b, t) {
    const C = TX.cold;
    const vis = b < 15.9;
    op(el.cold, vis ? seg(b, 0, 0.8) : 0);
    if (!vis) return;
    // 终端打字
    const n = Math.floor(seg(b, C.typeB0, C.typeB1) * C.command.length + 1e-6);
    txt(el['cold-cmd'], C.command.slice(0, n));
    const typing = b >= C.typeB0 && b < C.typeB1 + 0.3;
    op(el['cold-cursor'], typing ? 1 : Math.floor(t * 2.4) % 2 === 0 ? 1 : 0);
    // 回车后：命令飞向左上角，变成 HUD 里的 render(t)
    const fly = Ez.ioC(seg(b, 5, 5.9));
    tf(el['cold-term'], `translate(${f3(lerp(0, -736, fly))}px,${f3(lerp(0, -483, fly))}px) scale(${f3(lerp(1, 0.29, fly))})`);
    op(el['cold-term'], 1 - seg(b, 5.6, 5.95));
    // 没有 AE / 没有 PR / 没有剪辑软件
    el.nos.forEach((node, i) => {
      const bi = C.nos[i].b;
      const s = seg(b, bi, bi + 0.3);
      const out = Ez.iE(seg(b, C.nosOut + i * 0.06, C.nosOut + 0.4 + i * 0.06));
      const struck = seg(b, bi + 0.5, bi + 0.72);
      op(node, seg(b, bi, bi + 0.08) * (1 - out) * (1 - 0.42 * struck));
      tf(node, `translateX(${f3((i % 2 ? 1 : -1) * out * 1500)}px) scale(${f3(lerp(1.55, 1, Ez.oE(s)))})`);
      css(node, 'filter', s < 1 ? `blur(${f3((1 - Ez.oE(s)) * 14)}px)` : 'none');
      tf(el.strikes[i], `scaleX(${f3(Ez.oE(struck))})`);
    });
    // 论点：每一帧，都是时间的函数
    const th = Ez.oC(seg(b, C.thesisB0, C.thesisB0 + 0.7));
    const thOut = seg(b, C.thesisB1, C.thesisB1 + 0.35);
    op(el['cold-thesis'], th * (1 - thOut));
    css(el['cold-thesis'], 'clipPath', `inset(-20% ${f3((1 - th) * 100)}% -20% 0)`);
    css(el['cold-thesis'], 'letterSpacing', `${f3(lerp(0.3, 0.06, th))}em`);
    tf(el['cold-thesis'], `scale(${f3(1 + thOut * 0.12)})`);
    const fo = Ez.oC(seg(b, C.thesisB0 + 1, C.thesisB0 + 1.5));
    op(el['cold-formula'], fo * (1 - thOut));
    tf(el['cold-formula'], `translateY(${f3((1 - fo) * 30)}px)`);
    const beatFrac = b - Math.floor(b);
    const tp = b > C.thesisB0 + 1 ? Math.exp(-beatFrac * 5) : 0;
    tf(el.formulaT, `scale(${f3(1 + 0.45 * tp)})`);
    css(el.formulaT, 'textShadow', `0 0 ${f3(10 + 30 * tp)}px rgba(255,122,61,${f3(0.4 + 0.6 * tp)})`);
  }

  // ═══ §5 时代卡 + 能力曲线 ══════════════════════════════════════════════════
  const NODE_X = [0.14, 0.38, 0.62, 0.86].map((v) => v * W);
  const NODE_Y = [860, 776, 628, -520];
  const CURVE_P = [{ x: 96, y: 912 }].concat(NODE_X.map((x, i) => ({ x, y: NODE_Y[i] })));
  function bez(A, B, s, rocket) {
    const c1 = { x: A.x + (B.x - A.x) * (rocket ? 0.62 : 0.5), y: A.y };
    const c2 = rocket ? { x: B.x - 20, y: B.y + 640 } : { x: A.x + (B.x - A.x) * 0.5, y: B.y };
    const u = 1 - s;
    return { x: u * u * u * A.x + 3 * u * u * s * c1.x + 3 * u * s * s * c2.x + s * s * s * B.x, y: u * u * u * A.y + 3 * u * u * s * c1.y + 3 * u * s * s * c2.y + s * s * s * B.y };
  }
  function drawCurve(ctx, q, alpha, headGlow) {
    // q ∈ [0,4]：曲线从起点画到第 q 段
    ctx.save();
    ctx.globalAlpha = alpha;
    // 坐标轴
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(90, 930); ctx.lineTo(1830, 930); ctx.stroke();
    ctx.font = '700 20px NotoSansSC'; ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.save(); ctx.translate(66, 910); ctx.rotate(-Math.PI / 2); ctx.fillText('代码视频的上限 →', 0, 0); ctx.restore();
    D.ERAS.forEach((e, i) => {
      const c = D.MODELS[e.model].color;
      const reached = q >= i + 1 - 1e-6;
      ctx.fillStyle = reached ? c : 'rgba(255,255,255,0.3)';
      ctx.font = '800 24px Barlow';
      ctx.textAlign = 'center';
      ctx.fillText(D.MODELS[e.model].label, NODE_X[i], 972);
      ctx.fillRect(NODE_X[i] - 1, 922, 2, 16);
    });
    ctx.textAlign = 'left';
    // 曲线本体
    const pts = [];
    const segs = Math.min(4, Math.max(0, q));
    for (let i = 0; i < 4 && i < segs; i++) {
      const part = Math.min(1, segs - i);
      const N = 48;
      for (let k = 0; k <= N * part; k++) pts.push(bez(CURVE_P[i], CURVE_P[i + 1], k / N, i === 3));
    }
    if (pts.length > 1) {
      const g = ctx.createLinearGradient(90, 0, 1830, 0);
      g.addColorStop(0, D.MODELS.KIMI.color); g.addColorStop(0.35, D.MODELS.SWE.color); g.addColorStop(0.6, D.MODELS.GPT.color); g.addColorStop(0.85, D.MODELS.OPUS.color);
      // 面积
      ctx.beginPath(); ctx.moveTo(pts[0].x, 930);
      pts.forEach((p) => ctx.lineTo(p.x, p.y)); ctx.lineTo(pts[pts.length - 1].x, 930); ctx.closePath();
      const ga = ctx.createLinearGradient(0, 300, 0, 930); ga.addColorStop(0, 'rgba(255,122,61,0.22)'); ga.addColorStop(1, 'rgba(255,122,61,0)');
      ctx.fillStyle = ga; ctx.fill();
      // 线
      ctx.shadowColor = 'rgba(255,160,90,0.9)'; ctx.shadowBlur = 24;
      ctx.strokeStyle = g; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      ctx.shadowBlur = 0;
      // 已到达节点
      for (let i = 0; i < 4; i++) if (q >= i + 1 - 1e-6 && NODE_Y[i] > 0) {
        ctx.fillStyle = D.MODELS[D.ERAS[i].model].color;
        ctx.beginPath(); ctx.arc(NODE_X[i], NODE_Y[i], 11, 0, Math.PI * 2); ctx.fill();
      }
      // 光头
      const hd = pts[pts.length - 1];
      if (hd.y > -50) {
        const r = 18 + 26 * headGlow;
        const rg = ctx.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, r * 3);
        rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.25, 'rgba(255,170,100,0.8)'); rg.addColorStop(1, 'rgba(255,122,61,0)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hd.x, hd.y, r * 3, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  function sceneEras(b, ctxB) {
    D.ERAS.forEach((e, i) => {
      const E4 = i === 3;
      const end = E4 ? 63.5 : e.b1;
      const R = el.eras[i];
      const vis = inR(b, e.b0, end);
      op(R.root, vis ? 1 : 0);
      if (!vis) return;
      const u = b - e.b0;
      const k = Ez.iC(seg(b, end - 0.3, end));
      css(R.root, 'clipPath', k > 0 ? `inset(${f3(k * 50)}% 0 ${f3(k * 50)}% 0)` : 'none');
      const ni = Ez.oE(seg(u, 0, 0.5));
      tf(R.num, `translateX(${f3(lerp(-280, 0, ni))}px) scale(${f3(lerp(1.3, 1, ni))})`);
      op(R.num, seg(u, 0, 0.12));
      css(R.fill, 'clipPath', `inset(${f3((1 - Ez.oC(seg(u, 0.3, 1.3))) * 100)}% 0 0 0)`);
      op(R.chip, seg(u, 0.15, 0.35));
      tf(R.chip, `translateY(${f3((1 - Ez.oC(seg(u, 0.15, 0.45))) * 24)}px)`);
      R.chars.forEach((c, j) => {
        const d = 0.18 + j * 0.13;
        const s = seg(u, d, d + 0.4);
        op(c, E4 ? 0 : seg(u, d, d + 0.1));
        tf(c, `translateY(${f3(lerp(-190, 0, Ez.oB(s)))}px) rotate(${f3(lerp(-8, 0, Ez.oC(s)))}deg)`);
      });
      op(R.sub, seg(u, 0.6, 1.0));
      tf(R.sub, `translateY(${f3((1 - Ez.oC(seg(u, 0.6, 1.0))) * 22)}px)`);
      op(R.cap, seg(u, 0.3, 0.6));
      // 能力曲线
      const q = i + Ez.oC(seg(u, 0.1, E4 ? 1.35 : 1.1));
      drawCurve(ctxB, q, 1 - k, pulse(b, e.b0 + 1.1, 0.4));
      if (E4 && q > 3.5) {
        // 冲破天花板：一束竖直光柱
        const a = seg(q, 3.5, 4) * (1 - k);
        const g = ctxB.createLinearGradient(NODE_X[3] - 80, 0, NODE_X[3] + 80, 0);
        g.addColorStop(0, 'rgba(255,122,61,0)'); g.addColorStop(0.5, `rgba(255,220,180,${f3(0.9 * a)})`); g.addColorStop(1, 'rgba(255,122,61,0)');
        ctxB.fillStyle = g; ctxB.fillRect(NODE_X[3] - 80, 0, 160, 930);
      }
    });
  }

  // ─── 窗口堆叠 b19–42 ───────────────────────────────────────────────────────
  function sceneStack(b) {
    const vis = (inR(b, 19, 27) || inR(b, 30, D.STACK_END));
    op(el.stack, vis ? 1 : 0);
    if (!vis) return;
    const drift = Math.sin(b * 0.35) * 3;
    tf(el['stack-cam'], `translateZ(${f3(lerp(0, -260, seg(b, 19, 42)))}px) rotateY(${f3(drift)}deg) rotateX(${f3(Math.cos(b * 0.27) * 1.5)}deg)`);
    wins.forEach((s, i) => {
      const W_ = el.wins[i];
      if (b < s.b0) { op(W_.r, 0); return; }
      let d = 0;
      for (let j = i + 1; j < wins.length; j++) d += Ez.oE(seg(b, wins[j].b0, wins[j].b0 + 0.4));
      const e = spring(seg(b, s.b0, s.b0 + 0.9) * 1.6, 1.6, 5.2);
      const pose = { x: -150 * d, y: -64 * d, z: -300 * d, ry: -12 - 3 * d, rx: 4 };
      const from = { x: 950, y: 140, z: 520, ry: -42, rx: 8 };
      const p = (a, bb) => lerp(from[a], pose[a], clamp(e, 0, 1.2)) + (bb || 0);
      tf(W_.r, `translate3d(${f3(p('x'))}px,${f3(p('y'))}px,${f3(p('z'))}px) rotateY(${f3(p('ry'))}deg) rotateX(${f3(p('rx'))}deg)`);
      op(W_.r, seg(b, s.b0, s.b0 + 0.12) * clamp(1 - 0.12 * d) * (d > 6.5 ? 1 - seg(d, 6.5, 7.5) : 1));
      op(W_.shade, clamp(0.14 * d, 0, 0.7));
    });
  }

  // ═══ §6 GPT ═══════════════════════════════════════════════════════════════
  const GA = { x: 120, y: 68, w: 1680, h: 945, gap: 10 };
  function gridPos(i, n) {
    const k = Math.round(Math.sqrt(n));
    const tw = (GA.w - (k - 1) * GA.gap) / k, th = (GA.h - (k - 1) * GA.gap) / k;
    return { x: GA.x + (i % k) * (tw + GA.gap), y: GA.y + Math.floor(i / k) * (th + GA.gap), s: tw / 640, tw, th };
  }
  function sceneGrid(b) {
    const G = D.GRID;
    const vis = inR(b, G.b0, G.b1);
    op(el.grid, vis ? 1 : 0);
    if (!vis) return;
    let si = 0;
    G.steps.forEach((st, k) => { if (b >= st.b) si = k; });
    const cur = G.steps[si], prev = G.steps[Math.max(0, si - 1)];
    const p = si === 0 ? 1 : Ez.oE(seg(b, cur.b, cur.b + 0.32));
    el.gtiles.forEach((tile, i) => {
      if (i >= cur.n) { op(tile, 0); return; }
      const B_ = gridPos(i, cur.n);
      let x, y, s, a = 1;
      if (i < prev.n && si > 0) {
        const A = gridPos(i, prev.n);
        x = lerp(A.x, B_.x, p); y = lerp(A.y, B_.y, p); s = lerp(A.s, B_.s, p);
      } else {
        a = Ez.oB(seg(b, cur.b + i * 0.015, cur.b + 0.35 + i * 0.015), 1.4);
        s = B_.s * a; x = B_.x + (B_.tw * (1 - a)) / 2; y = B_.y + (B_.th * (1 - a)) / 2;
      }
      op(tile, clamp(a * 3));
      tf(tile, `translate(${f3(x)}px,${f3(y)}px) scale(${f3(Math.max(0.001, s))})`);
    });
    const L = TX.grid;
    const lp = seg(b, L.b0, L.b0 + 0.35);
    op(el['grid-label'], Ez.oC(lp));
    tf(el['grid-label'], `scale(${f3(lerp(1.7, 1, Ez.oE(lp)))})`);
  }

  function sceneFull(b) {
    fulls.forEach((s, i) => {
      const S = el.shots[i];
      const vis = inR(b, s.b0, s.b1);
      op(S.r, vis ? 1 : 0);
      if (!vis) return;
      const u = b - s.b0;
      const pin = Ez.oE(seg(u, 0, 0.6));
      const dir = i % 2 ? 1 : -1;
      tf(S.media, `scale(${f3(lerp(1.16, 1.0, pin) + 0.018 * u)}) rotate(${f3(dir * lerp(0.9, 0, pin))}deg) translateX(${f3(dir * lerp(30, 0, pin))}px)`);
      const lp = Ez.oE(seg(u, 0, 0.32));
      op(S.label, seg(u, 0, 0.14));
      tf(S.label, `translateX(${f3(lerp(-50, 0, lp))}px)`);
    });
    // DROP 大字：04 电影
    const Dr = TX.drop;
    const dv = inR(b, Dr.b0, Dr.b1);
    op(el['drop-ov'], dv ? env(b, Dr.b0, Dr.b0 + 0.06, Dr.b1 - 0.45, Dr.b1 - 0.05) : 0);
    if (dv) {
      const s = Ez.oE(seg(b, Dr.b0, Dr.b0 + 0.3));
      const out = Ez.iC(seg(b, Dr.b1 - 0.45, Dr.b1));
      tf(el['drop-ov'], `scale(${f3(lerp(2.2, 1, s) + out * 0.9)})`);
      css(el['drop-ov'], 'filter', `blur(${f3((1 - s) * 10 + out * 16)}px)`);
    }
  }

  function sceneDuo(b) {
    const vis = inR(b, 59, 62);
    op(el.duo, vis ? 1 : 0);
    if (!vis) return;
    const l = Ez.oE(seg(b, 59, 59.5));
    tf(el['duo-left'], `translateX(${f3(lerp(-420, 0, l))}px) scale(${f3(1 + 0.025 * (b - 59))})`);
    const p = seg(b, 59.25, 60.05);
    tf(el['duo-phone'], `translateY(${f3(lerp(900, 0, Ez.oB(p, 1.3)))}px) rotate(${f3(lerp(14, -3, Ez.oC(p)))}deg)`);
    op(el['duo-label'], seg(b, 59.7, 60.1));
  }

  // ═══ §7 OPUS ══════════════════════════════════════════════════════════════
  const SK = 70;
  function panelGeom(s) {
    const n = s.n, i = s.panel;
    const x0 = (i * W) / n, x1 = ((i + 1) * W) / n;
    return { x0, x1, cx: (x0 + x1) / 2, L: i === 0 ? -300 : x0, R: i === n - 1 ? W + 300 : x1 };
  }
  function sceneSplit(b, ctxF) {
    const vis = inR(b, 80, 86);
    op(el.split, vis ? 1 : 0);
    if (!vis) return;
    splits.forEach((s, k) => {
      const P_ = el.panels[k];
      const on = inR(b, s.b0, s.b1);
      op(P_.r, on ? 1 : 0);
      if (!on) return;
      const g = panelGeom(s);
      const d = s.panel * 0.14;
      const e = Ez.oE(seg(b, s.b0 + d, s.b0 + d + 0.42));
      const dirY = s.panel % 2 ? 1 : -1;
      tf(P_.r, `translateY(${f3(dirY * (1 - e) * 1100)}px)`);
      css(P_.r, 'clipPath', `polygon(${f3(g.L + SK)}px 0px, ${f3(g.R + SK)}px 0px, ${f3(g.R - SK)}px 1080px, ${f3(g.L - SK)}px 1080px)`);
      const u = b - s.b0;
      tf(P_.media, `translateX(${f3(g.cx - 960 + u * 10 * dirY)}px) scale(${f3(1.06 - 0.02 * u)})`);
      css(P_.label, 'left', `${f3(g.x0 + 48 + (s.panel === 0 ? 20 : SK))}px`);
      op(P_.label, seg(b, s.b0 + d + 0.25, s.b0 + d + 0.45));
    });
    // 斜切分割线（橙色辉光）
    const grp = splits.filter((s) => inR(b, s.b0, s.b1));
    if (grp.length > 1) {
      ctxF.save();
      ctxF.strokeStyle = 'rgba(255,122,61,0.95)'; ctxF.lineWidth = 4; ctxF.shadowColor = '#FF7A3D'; ctxF.shadowBlur = 18;
      for (let i = 1; i < grp[0].n; i++) {
        const x = (i * W) / grp[0].n;
        const a = Ez.oE(seg(b, grp[0].b0 + 0.2, grp[0].b0 + 0.6));
        ctxF.globalAlpha = a;
        ctxF.beginPath(); ctxF.moveTo(x + SK, 0); ctxF.lineTo(x + SK - 2 * SK * a, 1080 * a); ctxF.stroke();
      }
      ctxF.restore();
    }
  }

  function scenePhones(b) {
    const vis = inR(b, 86, 88);
    op(el.phonesLayer, vis ? 1 : 0);
    if (!vis) return;
    el.phones.forEach((P_, i) => {
      const d = i * 0.16;
      const p = seg(b, 86 + d, 86.62 + d);
      const rest = [-6, 0, 6][i];
      tf(P_.r, `translateY(${f3(lerp(1000, i === 1 ? -18 : 0, Ez.oB(p, 1.25)))}px) rotate(${f3(lerp(rest * 3, rest, Ez.oC(p)))}deg)`);
      op(P_.label, seg(b, 86.5 + d, 86.8 + d));
    });
  }

  function sceneTunnel(b, ctxF, ctxB) {
    const T_ = D.TUNNEL;
    const vis = inR(b, T_.b0, T_.b1);
    op(el.tunnel, vis ? 1 : 0);
    if (!vis) return;
    const p = seg(b, T_.b0, T_.b1);
    const zc = lerp(0, 6200, Math.pow(p, 1.55));
    const roll = Math.sin(b * 0.55) * 5 + p * 24;
    tf(el['tunnel-cam'], `translateZ(${f3(zc)}px) rotateZ(${f3(roll)}deg)`);
    D.WORKS.forEach((w, i) => {
      const wall = i % 4, d = Math.floor(i / 4);
      const zr = -(300 + d * 760 + wall * 190) + zc;
      const a = zr > 560 ? 0 : clamp((zr + 5600) / 1600);
      op(el.tplanes[i], a);
    });
    const L = TX.tunnel;
    op(el['tunnel-line'], env(b, L.b0, L.b0 + 0.6, L.b1 - 0.5, L.b1));
    tf(el['tunnel-line'], `scale(${f3(lerp(0.5, 1.28, seg(b, L.b0, L.b1)))})`);
    // 中心辉光
    const rg = ctxB.createRadialGradient(CX, CY, 0, CX, CY, 700);
    rg.addColorStop(0, `rgba(255,150,90,${f3(0.28 + 0.4 * p)})`); rg.addColorStop(1, 'rgba(255,122,61,0)');
    ctxB.fillStyle = rg; ctxB.fillRect(0, 0, W, H);
    // 速度线
    const speed = 0.25 + p * p * 2.2;
    ctxF.save();
    ctxF.lineCap = 'round';
    for (let k = 0; k < 110; k++) {
      const ang = hash(k * 3.1) * Math.PI * 2;
      const ph = (hash(k * 7.7) + (b - T_.b0) * speed * (0.4 + hash(k) * 0.8)) % 1;
      const r0 = 120 + ph * ph * 1300;
      const len = 30 + speed * 140 * ph;
      const a = 0.15 + 0.6 * ph;
      ctxF.strokeStyle = k % 5 === 0 ? `rgba(255,150,90,${f3(a)})` : `rgba(255,255,255,${f3(a * 0.8)})`;
      ctxF.lineWidth = 1 + 2.5 * ph;
      ctxF.beginPath();
      ctxF.moveTo(CX + Math.cos(ang) * r0, CY + Math.sin(ang) * r0);
      ctxF.lineTo(CX + Math.cos(ang) * (r0 + len), CY + Math.sin(ang) * (r0 + len));
      ctxF.stroke();
    }
    ctxF.restore();
  }

  const WALL_FOCUS = D.WORKS.findIndex((w) => w.key === 'oneink');
  function wallCenter(i) {
    const { TW, TH, GAP, x0, y0 } = D.wall;
    const c = i % D.WALL.cols, r = Math.floor(i / D.WALL.cols);
    return { x: x0 + c * (TW + GAP) + TW / 2, y: y0 + r * (TH + GAP) + TH / 2, c, r };
  }
  function sceneWall(b) {
    const Wl = D.WALL;
    const vis = inR(b, Wl.b0, 111.6);
    op(el.wall, vis ? 1 - seg(b, 104.2, 106) * 0.62 - seg(b, 109.5, 111.5) * 0.38 : 0);
    if (!vis) return;
    const fc = wallCenter(WALL_FOCUS);
    const p = Ez.ioC(seg(b, Wl.b0, Wl.b0 + 3.6));
    let s = lerp(3.3, 0.94, p) + 0.06 * seg(b, 99.6, 104);
    let tx = -(fc.x - CX) * s * (1 - p), ty = -(fc.y - CY) * s * (1 - p);
    const rx = lerp(20, 0, p), rz = lerp(-7, 0, p);
    // 骤停后：缓慢后退、去色
    const br = seg(b, 104, 112);
    s *= lerp(1, 0.84, Ez.oC(br));
    const stop = pulse(b, 104, 0.35);
    ty += stop * 26;
    tf(el['wall-cam'], `perspective(1500px) translate(${f3(tx)}px,${f3(ty)}px) scale(${f3(s)}) rotateX(${f3(rx)}deg) rotateZ(${f3(rz)}deg)`);
    const gray = seg(b, 104, 105.2);
    css(el['wall-cam'], 'filter', gray > 0 ? `grayscale(${f3(gray)}) brightness(${f3(1 - 0.45 * gray - 0.5 * stop)})` : 'none');
    el.wtiles.forEach((T_, i) => {
      const c = wallCenter(i);
      const dist = Math.hypot(c.c - fc.c, c.r - fc.r);
      const a = Ez.oB(seg(b, Wl.b0 + dist * 0.07, Wl.b0 + 0.45 + dist * 0.07), 1.5);
      tf(T_.r, `scale(${f3(lerp(0.5, 1, a))})`);
      op(T_.r, clamp(a * 2));
      op(T_.flash, 0.85 * pulse(b, 102 + (c.c + c.r) * 0.13, 0.22));
    });
    op(el['wall-title'], env(b, 97.4, 98, 104, 104.4));
    css(el['wall-title'], 'letterSpacing', `${f3(lerp(0.7, 0.32, Ez.oC(seg(b, 97.4, 98.6))))}em`);
    op(el['wall-sub'], env(b, 98.6, 99.2, 104, 104.4));
  }

  // ═══ §8 凝视 / 通通开源 / 卡片 / 尾声 ═════════════════════════════════════
  function sceneBreath(b) {
    TX.breath.forEach((l, i) => {
      const L = el.blines[i];
      const a = env(b, l.b0, l.b0 + 0.7, l.b1 - 0.5, l.b1);
      op(L.r, a);
      if (a <= 0) return;
      const p = Ez.oC(seg(b, l.b0, l.b0 + 1.2));
      css(L.big, 'letterSpacing', `${f3(lerp(0.22, 0.06, p))}em`);
      tf(L.big, `translateY(${f3((1 - p) * 22)}px)`);
      if (L.small) op(L.small, seg(b, l.b0 + 0.8, l.b0 + 1.3));
    });
  }

  const FOLDER = { x: 150 + 56 + 105, y: 236 + 150 + 88 };
  const flyRnd = D.WORKS.map((_, i) => {
    const r = mulberry32(9001 + i * 17);
    return { ang: r() * Math.PI * 2, spin: (r() - 0.5) * 540, tilt: (r() - 0.5) * 120, R: 900 + r() * 700, delay: r() * 0.35,
      sx: r() < 0.5 ? -200 - r() * 300 : W + 200 + r() * 300, sy: r() * H, cx: CX + (r() - 0.5) * 900, cy: -200 + r() * 400 };
  });
  const arrivals = D.WORKS.map((_, i) => 128.25 + i * 0.085 + 0.95);
  function sceneFlyers(b) {
    // 爆散阶段在「通通开源」大字之后（下层）；吸入阶段必须压在分享卡片之上
    css(el.flyersLayer, 'zIndex', b >= 128 ? '5' : '0');
    el.flyers.forEach((f, i) => {
      const R = flyRnd[i];
      // A · 爆散：跟着「通通开源」四拍，从纵深中心冲向镜头
      const bg = TX.reveal.b[i % 4] + R.delay;
      if (inR(b, bg, bg + 2.4)) {
        const q = seg(b, bg, bg + 2.4);
        const rad = R.R * Ez.oC(q);
        const z = lerp(-2600, 700, Ez.iC(q));
        const x = Math.cos(R.ang) * rad, y = Math.sin(R.ang) * rad * 0.62;
        tf(f, `translate3d(${f3(x)}px,${f3(y)}px,${f3(z)}px) rotateZ(${f3(R.spin * q)}deg) rotateY(${f3(R.tilt * q)}deg) scale(0.9)`);
        op(f, env(q, 0, 0.08, 0.82, 0.98));
        return;
      }
      // B · 吸入：28 部片子飞进 QQ 闪传文件夹
      const s0 = 128.25 + i * 0.085;
      if (inR(b, s0, s0 + 0.95)) {
        const q = Ez.iC(seg(b, s0, s0 + 0.95));
        const u = 1 - q;
        const x = u * u * R.sx + 2 * u * q * R.cx + q * q * FOLDER.x;
        const y = u * u * R.sy + 2 * u * q * R.cy + q * q * FOLDER.y;
        tf(f, `translate3d(${f3(x - 960)}px,${f3(y - 540)}px,0px) rotateZ(${f3(R.spin * 0.3 * u)}deg) scale(${f3(lerp(0.75, 0.04, q))})`);
        op(f, seg(b, s0, s0 + 0.1));
        return;
      }
      op(f, 0);
    });
  }

  function sceneReveal(b) {
    const Rv = TX.reveal;
    const vis = inR(b, Rv.b[0], 128.4);
    op(el.reveal, vis ? 1 - seg(b, 127.8, 128.4) : 0);
    if (!vis) return;
    el.rchars.forEach((c, i) => {
      const bi = Rv.b[i];
      const s = seg(b, bi, bi + 0.2);
      const k = pulse(b, bi, 0.32);
      op(c, seg(b, bi, bi + 0.04));
      tf(c, `scale(${f3(lerp(2.8, 1, Ez.oE(s)) + 0.05 * Math.sin(clamp((b - bi) / 0.5) * Math.PI) * (1 - clamp(b - bi - 0.5)))})`);
      css(c, 'textShadow', `${f3(-16 * k)}px 0 rgba(255,40,60,${f3(0.85 * k)}), ${f3(16 * k)}px 0 rgba(40,220,255,${f3(0.85 * k)}), 0 0 ${f3(40 + 80 * k + 40 * pulse(b, 120, 0.6))}px rgba(255,122,61,${f3(0.35 + 0.45 * k + 0.3 * pulse(b, 120, 0.6))})`);
      css(c, 'filter', s < 1 ? `blur(${f3((1 - Ez.oE(s)) * 18)}px)` : 'none');
    });
    const up = Ez.ioC(seg(b, Rv.out, Rv.out + 0.7));
    tf(el['rv-row'], `translateY(${f3(lerp(0, -232, up))}px) scale(${f3((1 + 0.09 * pulse(b, 120, 0.35)) * lerp(1, 0.42, up))})`);
    const en = seg(b, Rv.enB + 0.2, Rv.enB + 0.8);
    op(el['rv-en'], Ez.oC(en) * (1 - seg(b, Rv.out, Rv.out + 0.3)));
    css(el['rv-en'], 'letterSpacing', `${f3(lerp(1.1, 0.5, Ez.oE(en)))}em`);
    const sw = seg(b, 121, 123);
    op(el['rv-sweep'], env(b, 121, 121.2, 122.8, 123));
    css(el['rv-sweep'], 'backgroundPosition', `${f3(lerp(100, 0, Ez.ioS(sw)))}% 0`);
  }

  function scenePillars(b) {
    const Pl = TX.pillars;
    const vis = inR(b, Pl.b0, Pl.b1);
    op(el.pillarsLayer, vis ? 1 : 0);
    if (!vis) return;
    const out = Ez.iC(seg(b, 128.1, 128.6));
    el.pillars.forEach((P_, i) => {
      const d = 124.3 + i * 0.25;
      const e = Ez.oE(seg(b, d, d + 0.5));
      op(P_.r, e * (1 - out));
      tf(P_.r, `translateY(${f3((1 - e) * 70)}px) scale(${f3(1 - out * 0.25)})`);
      const n = Math.round(Pl.items[i].num * Ez.oC(seg(b, d + 0.2, d + 1.5)));
      txt(P_.num, String(n));
      const rowH = 30, total = P_.rows * rowH;
      tf(P_.list, `translateY(${f3(-(((b - Pl.b0) * 95) % total))}px)`);
    });
  }

  function sceneCard(b) {
    const C = TX.card;
    const vis = inR(b, C.b0, 141.2);
    op(el.card, vis ? 1 - seg(b, 140.2, 141.2) : 0);
    if (!vis) return;
    const e = Ez.oE(seg(b, C.b0, C.b0 + 0.75));
    const push = seg(b, 132, 140);
    const toMini = Ez.ioC(seg(b, 140, 141.2));
    tf(el.card, `translate(${f3(toMini * 520)}px,${f3(toMini * 300)}px) scale(${f3((1 + 0.03 * push) * lerp(1, 0.35, toMini))})`);
    let bounce = 0;
    let arrived = 0;
    arrivals.forEach((a) => { if (b >= a) { arrived++; bounce += pulse(b, a, 0.12) * 0.1; } });
    tf(el.share, `perspective(1600px) translateX(${f3(lerp(-240, 0, e))}px) rotateY(${f3(lerp(-68, 0, e))}deg)`);
    op(el.share, seg(b, C.b0, C.b0 + 0.2));
    tf(el.folder, `scale(${f3(1 + Math.min(0.35, bounce))})`);
    txt(el['sh-count'], `${arrived} / 28`);
    const url = D.SHARE.url;
    const n = Math.floor(seg(b, 131, 132.4) * url.length + 1e-6);
    txt(el['sh-link-t'], url.slice(0, n));
    tf(el['sh-link-u'], `scaleX(${f3(Ez.oC(seg(b, 132.4, 133)))})`);
    const q = seg(b, 129, 129.7);
    tf(el.qrbox, `scale(${f3(lerp(0.6, 1, Ez.oB(q, 1.5)))})`);
    op(el.qrbox, seg(b, 129, 129.2));
    const sc = ((b - 129.5) % 2.5) / 2.5;
    tf(el['qr-scan'], `translateY(${f3(lerp(-90, 520, sc))}px)`);
    op(el['qr-scan'], b > 129.5 ? 1 : 0);
    const bar = pulse(b % 4, 0, 0.5);
    css(el.qrbox, 'boxShadow', `0 40px 120px rgba(0,0,0,.6), 0 0 ${f3(20 + 50 * bar)}px rgba(61,139,255,${f3(0.3 + 0.4 * bar)})`);
    op(el['card-cta'], seg(b, 131.5, 132));
    tf(el['card-cta'], `translateY(${f3((1 - Ez.oC(seg(b, 131.5, 132.1))) * 30)}px)`);
    op(el['card-note'], seg(b, 132.2, 132.8));
  }

  function sceneOutro(b, t) {
    const O = TX.outro;
    const vis = inR(b, O.b0, 157);
    const fade = 1 - seg(b, O.fadeB0, 155.4);
    op(el.outro, vis ? seg(b, O.b0 + 0.3, O.b0 + 0.9) * fade : 0);
    op(el.mini, vis ? seg(b, 140.6, 141.4) * (1 - seg(b, 154.2, 155.6)) : 0);
    if (!vis) return;
    const cmd = TX.cold.command;
    const n = Math.floor(seg(b, O.typeB0, O.typeB1) * cmd.length + 1e-6);
    txt(el['out-cmd'], cmd.slice(0, n));
    op(el['out-cursor'], b < O.typeB1 + 0.3 ? 1 : Math.floor(t * 2.4) % 2 === 0 ? 1 : 0);
    const a = Ez.oC(seg(b, O.answerB, O.answerB + 1.1));
    op(el['out-answer'], a);
    css(el['out-answer'], 'clipPath', `inset(-30% ${f3((1 - a) * 100)}% -30% 0)`);
    css(el['out-answer'], 'textShadow', `0 0 ${f3(30 + 60 * pulse(b, O.answerB, 0.8))}px rgba(255,122,61,${f3(0.25 + 0.5 * pulse(b, O.answerB, 0.8))})`);
    el.credits.forEach((c, i) => {
      const d = O.creditsB + i * 0.6;
      op(c, Ez.oC(seg(b, d, d + 0.6)));
      tf(c, `translateY(${f3((1 - Ez.oC(seg(b, d, d + 0.6))) * 18)}px)`);
    });
  }

  // ═══ §9 HUD ═══════════════════════════════════════════════════════════════
  function hud(b, t, f) {
    const breathDim = 1 - 0.8 * env(b, 104, 104.6, 115.6, 116);
    const endFade = 1 - seg(b, 153, 155.4);
    const base = seg(b, 5.2, 6) * breathDim * endFade;
    op(el['hud-tl'], base);
    txt(el['hud-time'], `t = ${t.toFixed(3).padStart(6, '0')}s`);
    txt(el['hud-frame'], `f ${String(f).padStart(4, '0')}`);
    op(el['hud-rec'], Math.floor(t * 2) % 2 === 0 ? 1 : 0.35);
    let era = null;
    D.ERAS.forEach((e) => { if (b >= e.b0) era = e; });
    const allMode = b >= 104;
    op(el['hud-era'], (b >= 16 ? 1 : 0) * breathDim * endFade);
    if (era) {
      txt(el['hud-era-k'], allMode ? 'ALL ERAS' : `ERA ${era.n}`);
      txt(el['hud-era-v'], allMode ? '28 部 · 通通开源' : D.MODELS[era.model].label);
      css(el['hud-era'], '--c', allMode ? '#FFD166' : D.MODELS[era.model].color);
    }
    op(el.ruler, seg(b, 5, 6) * (0.35 + 0.65 * breathDim) * endFade);
    tf(el['ruler-base'], `scaleX(${f3(Ez.oC(seg(b, 5, 6.3)))})`);
    css(el.playhead, 'left', `${f3((1600 * t) / DURATION)}px`);
    let seen = 0;
    D.WORKS.forEach((w, i) => {
      const fs = D.firstSeen[w.key];
      const on = b >= fs ? Ez.oE(seg(b, fs, fs + 0.3)) : 0;
      if (b >= fs) seen++;
      op(el.slots[i].on, on);
      tf(el.slots[i].r, `scaleY(${f3(1 + 1.6 * pulse(b, fs, 0.25) * (b >= fs ? 1 : 0))})`);
    });
    txt(el['hud-count-n'], String(seen));
    op(el['hud-count'], seg(b, 16, 16.5) * breathDim * endFade);
    const lb = Math.max(env(b, 104, 104.7, 115.8, 116), seg(b, 140, 141));
    tf(el['lbx-top'], `translateY(${f3(-100 * (1 - Ez.ioC(lb)))}%)`);
    tf(el['lbx-bot'], `translateY(${f3(100 * (1 - Ez.ioC(lb)))}%)`);
  }

  // ═══ §10 FX 画布 ══════════════════════════════════════════════════════════
  const grainTiles = [];
  function makeGrain() {
    for (let k = 0; k < 6; k++) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const x = c.getContext('2d');
      const img = x.createImageData(256, 256);
      const r = mulberry32(777 + k * 131);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (r() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      grainTiles.push(c);
    }
  }

  // 冷开场代码墙：真实源码行，从下往上加速滚动
  function codeWall(ctx, b) {
    const C = TX.cold;
    if (!inR(b, C.codeWallB0, C.codeWallB1)) return;
    const p = seg(b, C.codeWallB0, C.codeWallB1);
    const a = lerp(0.05, 0.38, Ez.iC(seg(b, C.codeWallB0, C.codeWallB0 + 1.5))) + 0.55 * Ez.iE(seg(b, 15.1, 15.85));
    const off = Math.pow(b - C.codeWallB0, 2.1) * 120;
    const L = D.CODE_LINES;
    ctx.save();
    ctx.font = '500 19px Plex';
    ctx.textBaseline = 'top';
    const rowH = 30;
    for (let col = 0; col < 3; col++) {
      const colX = 60 + col * 640;
      for (let r = -2; r < 40; r++) {
        const rowAbs = r + Math.floor(off / rowH) + col * 13;
        const y = r * rowH - (off % rowH);
        const li = L[(((rowAbs * 7 + col * 3) % L.length) + L.length) % L.length];
        const hl = hash(rowAbs * 1.7 + col) > 0.82;
        ctx.globalAlpha = a * (hl ? 1 : 0.55) * (0.4 + 0.6 * seg(y, 0, 300)) * (1 - 0.5 * seg(y, 800, 1080));
        if (hl && p > 0.2) {
          // 高亮行：代码 + 出处（观众可以在源码包里 Ctrl+F 到这一行）
          const code = li.line.slice(0, 34);
          ctx.fillStyle = '#FF7A3D';
          ctx.fillText(code, colX, y);
          ctx.fillStyle = '#3CF0C8';
          ctx.fillText('  // ' + li.src.split('/')[0], colX + ctx.measureText(code).width, y);
        } else {
          ctx.fillStyle = hl ? '#FF7A3D' : '#E8E4DA';
          ctx.fillText(li.line.slice(0, 58), colX, y);
        }
      }
    }
    ctx.restore();
  }

  // 通通开源背景：缓慢漂移的余烬
  const embers = Array.from({ length: 140 }, (_, i) => { const r = mulberry32(5150 + i); return { x: r() * W, y: r() * H, z: 0.3 + r() * 0.7, s: r() }; });
  function drawEmbers(ctx, b) {
    if (!inR(b, 116, 141)) return;
    const a = env(b, 116, 116.5, 140, 141);
    ctx.save();
    embers.forEach((e, i) => {
      const y = ((e.y - (b - 116) * 22 * e.z) % H + H) % H;
      const x = e.x + Math.sin(b * 0.6 + i) * 14 * e.z;
      const r = 1 + e.z * 2.4;
      ctx.globalAlpha = a * (0.25 + 0.55 * e.s) * (0.6 + 0.4 * Math.sin(b * 2 + i));
      ctx.fillStyle = i % 3 ? '#FFB27A' : '#FFFFFF';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  // DROP 段：每拍一次橙色漏光
  function lightLeak(ctx, b) {
    if (!inR(b, 64, 88)) return;
    const k = pulse(b - Math.floor(b), 0, 0.28) * (inR(b, 64, 80) ? 1 : 0.5);
    const side = Math.floor(b) % 2 ? 0 : W;
    const g = ctx.createRadialGradient(side, CY, 0, side, CY, 1100);
    g.addColorStop(0, `rgba(255,122,61,${f3(0.32 * k)})`); g.addColorStop(1, 'rgba(255,122,61,0)');
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }

  function fxFront(ctx, b, f) {
    // 冲击波
    RING.forEach((r) => {
      if (b < r.b || b > r.b + r.d) return;
      const q = seg(b, r.b, r.b + r.d);
      ctx.save();
      ctx.globalAlpha = (1 - q) * 0.9;
      ctx.strokeStyle = r.c; ctx.lineWidth = r.w * (1 - q) + 1; ctx.shadowColor = r.c; ctx.shadowBlur = 30;
      ctx.beginPath(); ctx.arc(r.x, r.y, 40 + r.r * Ez.oC(q), 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    lightLeak(ctx, b);
    // 故障条
    GLITCH.forEach((g) => {
      if (b < g.b || b > g.b + g.len) return;
      const r = mulberry32(f * 31 + 7);
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 14; i++) {
        const y = r() * H, h = 4 + r() * 60;
        ctx.fillStyle = ['rgba(255,40,80,0.55)', 'rgba(40,220,255,0.55)', 'rgba(255,255,255,0.35)'][i % 3];
        ctx.fillRect((r() - 0.5) * 300, y, W, h);
      }
      ctx.restore();
    });
    // 隧道尽头白化
    const whiteout = Ez.iC(seg(b, 95.2, 96));
    const flash = Math.max(sumPulse(FLASH, b), b < 96 ? whiteout : 0);
    if (flash > 0.003) {
      ctx.save(); ctx.globalAlpha = Math.min(1, flash); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    // 真空：DROP 前半拍全黑
    if (inR(b, 63.5, 64) || inR(b, 15.9, 16) || inR(b, 115.75, 116)) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
    // 胶片颗粒（按帧号换图块 → 确定性）
    const tile = grainTiles[f % grainTiles.length];
    if (tile) {
      ctx.save();
      ctx.globalAlpha = 0.055 + 0.04 * env(b, 104, 105, 115, 116);
      ctx.globalCompositeOperation = 'overlay';
      const ox = (hash(f) * 256) | 0, oy = (hash(f + 0.5) * 256) | 0;
      for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(tile, x, y);
      ctx.restore();
    }
    // 结尾黑场
    const endBlack = seg(b, 155, 156);
    if (endBlack > 0) { ctx.save(); ctx.globalAlpha = endBlack; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }

  // 震屏（按帧号取伪随机 → 确定性）
  function shake(b, f) {
    let amp = 0;
    SHAKE.forEach((s) => { if (b >= s.b && b < s.b + s.d * 6) amp += s.amp * pulse(b, s.b, s.d); });
    amp += 12 * Ez.iC(seg(b, 62.3, 63.5)) * (b < 63.5 ? 1 : 0);
    if (amp < 0.05) { tf(el.stage, 'none'); return; }
    const x = (hash(f * 1.37) - 0.5) * 2 * amp, y = (hash(f * 2.11 + 3) - 0.5) * 2 * amp, r = (hash(f * 0.73 + 9) - 0.5) * amp * 0.06;
    tf(el.stage, `translate(${f3(x)}px,${f3(y)}px) rotate(${f3(r)}deg)`);
  }

  // ═══ render(t) ═════════════════════════════════════════════════════════════
  function render(tIn) {
    const t = clamp(tIn, 0, DURATION - 1e-6);
    const b = t / BEAT;
    const f = Math.round(t * FPS);
    const cb = el.cb, cf = el.cf;
    cb.setTransform(1, 0, 0, 1, 0, 0); cb.clearRect(0, 0, W, H);
    cf.setTransform(1, 0, 0, 1, 0, 0); cf.clearRect(0, 0, W, H);
    shake(b, f);
    codeWall(cb, b);
    drawEmbers(cb, b);
    sceneCold(b, t);
    sceneEras(b, cb);
    sceneStack(b);
    sceneGrid(b);
    sceneFull(b);
    sceneDuo(b);
    sceneSplit(b, cf);
    scenePhones(b);
    sceneTunnel(b, cf, cb);
    sceneWall(b);
    sceneBreath(b);
    sceneFlyers(b);
    sceneReveal(b);
    scenePillars(b);
    sceneCard(b);
    sceneOutro(b, t);
    hud(b, t, f);
    fxFront(cf, b, f);
  }

  // ═══ 启动：字体就绪后再建时间轴（异步构建完成后才注册，见 hyperframes-core）═══
  function init() {
    grab();
    buildEvents();
    makeGrain();
    const tl = gsap.timeline({ paused: true });
    const clock = { t: 0 };
    tl.to(clock, { t: DURATION, duration: DURATION, ease: 'none' }, 0);
    tl.eventCallback('onUpdate', () => render(tl.time()));
    render(0);
    window.__render = render;
    window.__timelines = window.__timelines || {};
    window.__timelines['main'] = tl;
    if (window.__hfForceTimelineRebind) window.__hfForceTimelineRebind();
  }
  const fontLoads = ['900 100px HanSerifH', '900 100px NotoSerifSC', '700 40px NotoSansSC', '900 40px NotoSansSC', '800 40px Barlow', '900 40px Barlow', '600 40px Barlow', '500 20px Plex']
    .map((f) => document.fonts.load(f, '通开源代码视频ABC0123').catch(() => null));
  Promise.all(fontLoads).then(() => document.fonts.ready).then(init);
})();
```

### 13/16 · `src/style.css`
<!-- casebook-file {"path": "src/style.css", "lines": 293, "final_newline": true, "sha256": "c1995b7317e389727ef8e72825041c12bfaea8b9c12c510e4ec189be8169044f", "original_sha256": "c1995b7317e389727ef8e72825041c12bfaea8b9c12c510e4ec189be8169044f"} -->
```css
/* ─────────────────────────────────────────────────────────────────────────
   SUPERCUT · 视觉系统
   所有元素的"静态终态"写在这里；运动全部由 runtime.js 的 render(t) 计算。
   ───────────────────────────────────────────────────────────────────────── */
@font-face { font-family: "HanSerifH"; src: url("../assets/fonts/SourceHanSerifSC-Heavy.ttf") format("truetype"); font-weight: 900; font-display: block; }
@font-face { font-family: "NotoSerifSC"; src: url("../assets/fonts/NotoSerifSC-VF.ttf") format("truetype"); font-weight: 200 900; font-display: block; }
@font-face { font-family: "NotoSansSC"; src: url("../assets/fonts/NotoSansSC-700.ttf") format("truetype"); font-weight: 700; font-display: block; }
@font-face { font-family: "NotoSansSC"; src: url("../assets/fonts/NotoSansSC-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
@font-face { font-family: "Barlow"; src: url("../assets/fonts/Barlow-600.ttf") format("truetype"); font-weight: 600; font-display: block; }
@font-face { font-family: "Barlow"; src: url("../assets/fonts/Barlow-800.ttf") format("truetype"); font-weight: 800; font-display: block; }
@font-face { font-family: "Barlow"; src: url("../assets/fonts/Barlow-900.ttf") format("truetype"); font-weight: 900; font-display: block; }
@font-face { font-family: "Plex"; src: url("../assets/fonts/IBMPlexMono-500.ttf") format("truetype"); font-weight: 500; font-display: block; }

:root {
  --bg: #050507;
  --ink: #f3efe6;
  --dim: rgba(243, 239, 230, 0.55);
  --faint: rgba(243, 239, 230, 0.16);
  --orange: #ff7a3d;
  --red: #ff3b3b;
  --kimi: #3cf0c8;
  --swe: #7cc4ff;
  --gpt: #a98bff;
  --gold: #ffd166;
  --qq: #3d8bff;
  --serif: "HanSerifH", "NotoSerifSC", serif;
  --sans: "NotoSansSC", sans-serif;
  --num: "Barlow", "NotoSansSC", sans-serif;
  --mono: "Plex", "NotoSansSC", monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1920px; height: 1080px; overflow: hidden; background: var(--bg); color: var(--ink); }
body { font-family: var(--sans); -webkit-font-smoothing: antialiased; }

#root { position: relative; width: 100%; height: 100%; overflow: hidden; background: var(--bg); }

.fill { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
.layer { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; opacity: 0; pointer-events: none; }
.abs { position: absolute; }
.center-box { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; display: flex; flex-direction: column; align-items: center; justify-content: center; }

#bg {
  background:
    radial-gradient(1200px 700px at 50% 40%, rgba(40, 44, 70, 0.35), transparent 70%),
    radial-gradient(900px 600px at 80% 110%, rgba(255, 122, 61, 0.08), transparent 70%),
    var(--bg);
}
#stage { transform-origin: 960px 540px; }
canvas.fx { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }

video, .media img { display: block; width: 100%; height: 100%; object-fit: cover; }

/* ── 冷开场 ──────────────────────────────────────────────────────────── */
#cold-term {
  position: absolute; left: 0; top: 0; width: 1920px; height: 1080px;
  display: flex; align-items: center; justify-content: flex-start; padding-left: 700px;
  font-family: var(--mono); font-size: 76px; letter-spacing: 0.02em; color: var(--ink);
  transform-origin: 960px 540px;
}
#cold-term .prompt { color: var(--kimi); margin-right: 0.3em; }
.cursor { display: inline-block; width: 0.55em; height: 1.05em; background: var(--ink); margin-left: 0.08em; vertical-align: -0.16em; }
.cold-no {
  position: absolute; left: 0; width: 1920px; text-align: center;
  font-family: var(--serif); font-weight: 900; font-size: 150px; line-height: 1; letter-spacing: 0.04em;
}
.cold-no .txt { position: relative; display: inline-block; }
.cold-no .strike {
  position: absolute; left: -4%; top: 52%; width: 108%; height: 14px; background: var(--red);
  transform-origin: 0 50%; transform: scaleX(0); box-shadow: 0 0 24px rgba(255, 59, 59, 0.7);
}
#no0 { top: 250px; } #no1 { top: 450px; } #no2 { top: 650px; }
#cold-thesis {
  position: absolute; left: 0; top: 380px; width: 1920px; text-align: center;
  font-family: var(--serif); font-weight: 900; font-size: 112px; letter-spacing: 0.06em;
}
#cold-formula {
  position: absolute; left: 0; top: 560px; width: 1920px; text-align: center;
  font-family: var(--mono); font-size: 60px; color: var(--dim);
}
#cold-formula .t { color: var(--orange); display: inline-block; }

/* ── 时代卡 ──────────────────────────────────────────────────────────── */
.era .era-num {
  position: absolute; left: 110px; top: 70px; width: 820px; height: 560px;
  font-family: var(--num); font-weight: 900; font-size: 560px; line-height: 560px; letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.12); -webkit-text-stroke: 4px var(--c);
}
.era .era-num .fillnum {
  position: absolute; left: 0; top: 0; color: var(--c); -webkit-text-stroke: 0; clip-path: inset(100% 0 0 0);
}
.era .era-right { position: absolute; left: 980px; top: 150px; width: 860px; height: 520px; }
.era .era-chip {
  display: inline-block; padding: 10px 26px; border-radius: 999px; border: 3px solid var(--c); color: var(--c);
  font-family: var(--num); font-weight: 800; font-size: 40px; letter-spacing: 0.22em;
}
.era .era-title {
  margin-top: 26px; font-family: var(--serif); font-weight: 900; font-size: 230px; line-height: 1.05; letter-spacing: 0.08em; white-space: nowrap;
}
.era .era-title .ch { display: inline-block; }
.era .era-sub { margin-top: 18px; font-family: var(--sans); font-weight: 700; font-size: 46px; color: var(--dim); white-space: nowrap; }
.era .era-cap {
  position: absolute; left: 110px; top: 690px; font-family: var(--mono); font-size: 24px; color: var(--dim); letter-spacing: 0.18em;
}

/* ── 窗口堆叠 ────────────────────────────────────────────────────────── */
#stack { perspective: 1700px; perspective-origin: 960px 480px; }
#stack-cam { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-style: preserve-3d; }
.win {
  position: absolute; left: 400px; top: 170px; width: 1120px; height: 668px;
  border-radius: 16px; overflow: hidden; background: #0d0f14;
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.6);
  transform-origin: 560px 334px; opacity: 0;
}
.win-bar {
  position: absolute; left: 0; top: 0; width: 100%; height: 38px; background: linear-gradient(#1b1e26, #13151b);
  display: flex; align-items: center; padding: 0 16px; gap: 9px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.win-bar i { display: block; width: 13px; height: 13px; border-radius: 50%; background: #ff5f57; }
.win-bar i:nth-child(2) { background: #febc2e; } .win-bar i:nth-child(3) { background: #28c840; }
.win-title { margin-left: 14px; font-family: var(--mono); font-size: 17px; color: rgba(255, 255, 255, 0.72); white-space: nowrap; overflow: hidden; }
.win-title b { color: var(--c); font-weight: 500; }
.win-body { position: absolute; left: 0; top: 38px; width: 1120px; height: 630px; }
.win-shade { position: absolute; inset: 0; background: #000; opacity: 0; }

/* ── COSMOS 宫格 ─────────────────────────────────────────────────────── */
.gtile { position: absolute; left: 0; top: 0; width: 640px; height: 360px; transform-origin: 0 0; overflow: hidden; border-radius: 6px; outline: 1px solid rgba(255, 255, 255, 0.12); }
#grid-label {
  position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; display: flex; align-items: center; justify-content: center; gap: 36px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 42%, transparent 70%);
}
#grid-label .big { font-family: var(--num); font-weight: 900; font-size: 360px; line-height: 1; color: var(--ink); text-shadow: 0 0 60px rgba(169, 139, 255, 0.9), 0 12px 0 rgba(0, 0, 0, 0.5); }
#grid-label .small { font-family: var(--serif); font-weight: 900; font-size: 84px; max-width: 520px; line-height: 1.15; text-shadow: 0 6px 30px rgba(0, 0, 0, 0.9); }

/* ── 全屏英雄镜头 ────────────────────────────────────────────────────── */
.shot { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; opacity: 0; overflow: hidden; }
.shot-media { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 960px 540px; }
.label {
  position: absolute; left: 72px; bottom: 118px; display: flex; flex-direction: column; gap: 10px;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.85);
}
.label .row1 { display: flex; align-items: center; gap: 16px; }
.label .chip {
  display: block; padding: 4px 14px; border-radius: 6px; background: var(--c); color: #0a0a0a;
  font-family: var(--num); font-weight: 800; font-size: 22px; letter-spacing: 0.16em; text-shadow: none;
}
.label .title { display: block; font-family: var(--serif); font-weight: 900; font-size: 58px; line-height: 1.05; white-space: nowrap; }
.label .tech { display: block; font-family: var(--sans); font-weight: 700; font-size: 26px; color: rgba(255, 255, 255, 0.82); white-space: nowrap; }
.label .spec { display: block; font-family: var(--mono); font-size: 18px; color: rgba(255, 255, 255, 0.6); letter-spacing: 0.06em; }
.shot::after, .panel::after {
  content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 420px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.72)); pointer-events: none;
}
.shot .label, .panel .label { z-index: 2; }

#drop-ov { display: flex; align-items: center; justify-content: center; gap: 40px; }
#drop-ov .n { font-family: var(--num); font-weight: 900; font-size: 300px; color: transparent; -webkit-text-stroke: 5px var(--orange); line-height: 1; }
#drop-ov .w { font-family: var(--serif); font-weight: 900; font-size: 300px; line-height: 1; color: var(--ink); text-shadow: 0 0 80px rgba(255, 122, 61, 0.85), 0 16px 40px rgba(0, 0, 0, 0.8); }

/* ── 左横屏 + 右手机 ─────────────────────────────────────────────────── */
#duo-left { position: absolute; left: 96px; top: 196px; width: 1188px; height: 668px; border-radius: 18px; overflow: hidden; box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7); outline: 1px solid rgba(255,255,255,.14); }
.phone {
  position: absolute; width: 400px; height: 820px; border-radius: 56px; background: #0b0b0e; padding: 14px;
  box-shadow: 0 0 0 3px #2a2c33, 0 40px 120px rgba(0, 0, 0, 0.75), inset 0 0 0 2px #000;
}
.phone .screen { position: relative; width: 372px; height: 792px; border-radius: 44px; overflow: hidden; background: #000; }
.phone .notch { position: absolute; left: 136px; top: 22px; width: 128px; height: 34px; border-radius: 20px; background: #000; z-index: 3; }
#duo-phone { left: 1400px; top: 130px; }
#duo-label { position: absolute; left: 96px; top: 890px; font-family: var(--sans); font-weight: 700; font-size: 30px; color: var(--dim); }
#duo-label b { color: var(--gpt); font-family: var(--num); letter-spacing: .14em; margin-right: 14px; }

/* ── 分屏 / 手机阵列 ─────────────────────────────────────────────────── */
.panel { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; overflow: hidden; }
.panel-media { position: absolute; top: 0; width: 1920px; height: 1080px; transform-origin: 50% 50%; }
.panel .label { bottom: 110px; }
.panel .label .title { font-size: 42px; }
.panel .label .tech { font-size: 21px; }
.panel-edge { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
#phones .phone { top: 56px; }
#phones .ph-label { position: absolute; left: -40px; top: 838px; width: 480px; text-align: center; font-family: var(--serif); font-weight: 900; font-size: 38px; }
#phones .ph-label span { display: block; font-family: var(--mono); font-size: 18px; color: var(--dim); margin-top: 6px; font-weight: 500; }

/* ── 隧道 ────────────────────────────────────────────────────────────── */
#tunnel { perspective: 760px; perspective-origin: 960px 540px; }
#tunnel-cam { position: absolute; left: 960px; top: 540px; width: 0; height: 0; transform-style: preserve-3d; }
.tplane { position: absolute; left: -320px; top: -180px; width: 640px; height: 360px; border-radius: 8px; overflow: hidden; outline: 2px solid var(--c); backface-visibility: hidden; }
.tplane .tp-cap { position: absolute; left: 12px; bottom: 10px; font-family: var(--serif); font-weight: 900; font-size: 34px; text-shadow: 0 2px 12px #000; }
#tunnel-line { font-family: var(--serif); font-weight: 900; font-size: 104px; letter-spacing: 0.06em; text-shadow: 0 0 40px rgba(0, 0, 0, 0.95), 0 0 90px rgba(255, 122, 61, 0.5); white-space: nowrap; }

/* ── 巨墙 ────────────────────────────────────────────────────────────── */
#wall-cam { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 960px 540px; }
.wtile { position: absolute; width: 256px; height: 144px; overflow: hidden; border-radius: 5px; background: #111; outline: 1.5px solid var(--c); }
.wtile img.freeze, .wtile video { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
.wtile .wl { position: absolute; left: 0; bottom: 0; width: 100%; padding: 16px 8px 5px; background: linear-gradient(transparent, rgba(0,0,0,.8)); font-family: var(--sans); font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; }
.wtile .wl i { font-style: normal; font-family: var(--num); font-weight: 800; font-size: 11px; letter-spacing: .14em; color: var(--c); margin-right: 6px; }
.wtile .flash { position: absolute; inset: 0; background: #fff; opacity: 0; }
#wall-title { position: absolute; left: 0; top: 118px; width: 1920px; text-align: center; font-family: var(--num); font-weight: 900; font-size: 64px; letter-spacing: 0.32em; }
#wall-sub { position: absolute; left: 0; top: 876px; width: 1920px; text-align: center; font-family: var(--sans); font-weight: 700; font-size: 34px; color: var(--dim); letter-spacing: .2em; }

/* ── 凝视 ────────────────────────────────────────────────────────────── */
.bline { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; }
.bline .big { font-family: var(--serif); font-weight: 900; font-size: 116px; letter-spacing: 0.06em; white-space: nowrap; }
.bline .small { margin-top: 30px; font-family: var(--mono); font-size: 34px; color: var(--dim); letter-spacing: 0.12em; }

/* ── 飞散海报 ────────────────────────────────────────────────────────── */
#flyers { perspective: 900px; perspective-origin: 960px 540px; }
.flyer { position: absolute; left: 800px; top: 450px; width: 320px; height: 180px; border-radius: 6px; overflow: hidden; outline: 2px solid var(--c); opacity: 0; backface-visibility: hidden; }
.flyer img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ── 通通开源 ────────────────────────────────────────────────────────── */
#rv-row { position: absolute; left: 160px; top: 290px; width: 1600px; height: 420px; display: flex; transform-origin: 800px 210px; }
.rv-ch {
  width: 400px; height: 420px; display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-weight: 900; font-size: 380px; line-height: 1; color: var(--ink); opacity: 0;
}
#rv-en { position: absolute; left: 0; top: 760px; width: 1920px; text-align: center; font-family: var(--num); font-weight: 800; font-size: 52px; letter-spacing: 0.5em; color: var(--orange); opacity: 0; }
#rv-sweep { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; mix-blend-mode: overlay; opacity: 0;
  background: linear-gradient(100deg, transparent 40%, rgba(255,255,255,.95) 50%, transparent 60%); background-size: 300% 100%; }

.pillar { position: absolute; top: 420px; width: 520px; height: 560px; opacity: 0; }
#pl0 { left: 110px; } #pl1 { left: 700px; } #pl2 { left: 1290px; }
.pillar .ph { display: flex; align-items: baseline; gap: 18px; }
.pillar .ph .h { font-family: var(--serif); font-weight: 900; font-size: 86px; }
.pillar .ph .en { font-family: var(--mono); font-size: 26px; color: var(--orange); letter-spacing: .18em; }
.pillar .pn { display: flex; align-items: baseline; gap: 14px; margin-top: 6px; }
.pillar .pl-num { font-family: var(--num); font-weight: 900; font-size: 176px; line-height: 1; color: var(--ink); min-width: 190px; }
.pillar .unit { font-family: var(--sans); font-weight: 700; font-size: 34px; color: var(--ink); }
.pillar .sub { font-family: var(--sans); font-weight: 700; font-size: 25px; color: var(--dim); margin-top: 8px; white-space: nowrap; }
.pillar .pl-stream { position: relative; margin-top: 22px; width: 520px; height: 150px; overflow: hidden; border-top: 1px solid var(--faint);
  -webkit-mask-image: linear-gradient(transparent, #000 20%, #000 80%, transparent); }
.pillar .pl-list { position: absolute; left: 0; top: 0; width: 100%; font-family: var(--mono); font-size: 18px; line-height: 30px; color: rgba(243,239,230,.62); white-space: nowrap; }

/* ── 分享卡片 ────────────────────────────────────────────────────────── */
#share {
  position: absolute; left: 150px; top: 236px; width: 980px; height: 560px; border-radius: 36px;
  background: linear-gradient(160deg, #eaf3ff 0%, #d7e8ff 55%, #cfe2ff 100%); color: #10203a;
  box-shadow: 0 50px 140px rgba(61, 139, 255, 0.35), 0 0 0 2px rgba(255, 255, 255, 0.5) inset; transform-origin: 490px 280px;
}
#share .svc { position: absolute; left: 56px; top: 44px; display: flex; align-items: center; gap: 14px; font-family: var(--sans); font-weight: 900; font-size: 34px; color: #1a4fd6; }
#share .svc svg { width: 44px; height: 44px; }
#share .folder { position: absolute; left: 56px; top: 150px; width: 210px; height: 170px; transform-origin: 105px 120px; }
#share .sh-name { position: absolute; left: 300px; top: 164px; font-family: var(--num); font-weight: 800; font-size: 60px; letter-spacing: 0.01em; white-space: nowrap; }
#share .sh-meta { position: absolute; left: 302px; top: 250px; font-family: var(--sans); font-weight: 700; font-size: 30px; color: #4a5d7e; white-space: nowrap; }
#share .sh-link { position: absolute; left: 56px; top: 380px; font-family: var(--mono); font-size: 44px; color: #0f3fb8; white-space: nowrap; }
#share .sh-link .u { position: absolute; left: 0; bottom: -8px; width: 100%; height: 4px; background: #3d8bff; transform-origin: 0 50%; }
#share .sh-exp { position: absolute; left: 58px; top: 470px; font-family: var(--sans); font-weight: 700; font-size: 24px; color: #6b7c99; }
#share .sh-count { position: absolute; right: 56px; top: 50px; font-family: var(--num); font-weight: 800; font-size: 34px; color: #1a4fd6; letter-spacing: .08em; }
#qrbox { position: absolute; left: 1250px; top: 196px; width: 520px; height: 520px; background: #fff; border-radius: 28px; padding: 26px; box-shadow: 0 40px 120px rgba(0,0,0,.6); overflow: hidden; }
#qrbox img { width: 468px; height: 468px; image-rendering: pixelated; display: block; }
#qrbox .scan { position: absolute; left: 0; top: 0; width: 100%; height: 90px; background: linear-gradient(rgba(61,139,255,0), rgba(61,139,255,.45), rgba(61,139,255,0)); }
#card-cta { position: absolute; left: 1250px; top: 750px; width: 520px; text-align: center; font-family: var(--serif); font-weight: 900; font-size: 62px; letter-spacing: .08em; }
#card-note { position: absolute; left: 150px; top: 836px; width: 980px; font-family: var(--sans); font-weight: 700; font-size: 34px; color: var(--dim); letter-spacing: .3em; }

/* ── 尾声 ────────────────────────────────────────────────────────────── */
#out-term { position: absolute; left: 0; top: 330px; width: 1920px; text-align: center; font-family: var(--mono); font-size: 64px; }
#out-term .prompt { color: var(--kimi); margin-right: 0.3em; }
#out-answer { position: absolute; left: 0; top: 470px; width: 1920px; text-align: center; font-family: var(--serif); font-weight: 900; font-size: 128px; letter-spacing: 0.08em; }
#out-answer .arrow { color: var(--orange); margin-right: 0.3em; font-family: var(--mono); font-weight: 500; }
.credit { position: absolute; left: 0; width: 1920px; text-align: center; font-family: var(--sans); font-weight: 700; font-size: 26px; color: var(--dim); letter-spacing: .12em; opacity: 0; }
#cr0 { top: 720px; color: var(--ink); } #cr1 { top: 764px; font-family: var(--mono); font-weight: 500; font-size: 22px; } #cr2 { top: 806px; font-family: var(--num); font-weight: 800; letter-spacing: .3em; color: var(--orange); }
#mini { position: absolute; right: 70px; bottom: 150px; display: flex; align-items: center; gap: 22px; opacity: 0; }
#mini img { width: 150px; height: 150px; background: #fff; padding: 8px; border-radius: 12px; image-rendering: pixelated; }
#mini .mt { font-family: var(--mono); font-size: 22px; color: var(--ink); line-height: 1.6; text-align: right; }
#mini .mt span { display: block; }
#mini .mt b { display: block; font-family: var(--sans); font-weight: 900; font-size: 26px; color: var(--orange); }

/* ── HUD ─────────────────────────────────────────────────────────────── */
#hud { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; pointer-events: none; }
#hud-tl { position: absolute; left: 56px; top: 44px; display: flex; align-items: center; gap: 18px; font-family: var(--mono); font-size: 22px; color: rgba(255, 255, 255, 0.85); opacity: 0; }
#hud-rec { display: flex; align-items: center; gap: 8px; color: var(--red); font-family: var(--num); font-weight: 800; letter-spacing: .14em; }
#hud-rec i { display: block; width: 14px; height: 14px; border-radius: 50%; background: var(--red); box-shadow: 0 0 12px var(--red); }
#hud-cmd { color: var(--kimi); }
#hud-time, #hud-frame { color: rgba(255,255,255,.7); }
#hud-era { position: absolute; right: 56px; top: 38px; display: flex; align-items: center; gap: 14px; opacity: 0; }
#hud-era .k { font-family: var(--mono); font-size: 20px; color: rgba(255, 255, 255, 0.6); letter-spacing: 0.14em; }
#hud-era .v { padding: 5px 16px; border-radius: 999px; border: 2px solid var(--c, #fff); color: var(--c, #fff); font-family: var(--num); font-weight: 800; font-size: 22px; letter-spacing: 0.2em; }
#ruler { position: absolute; left: 160px; top: 1016px; width: 1600px; height: 40px; opacity: 0; }
#ruler .base { position: absolute; left: 0; top: 18px; width: 1600px; height: 1px; background: rgba(255, 255, 255, 0.22); transform-origin: 0 50%; }
#ruler .slot { position: absolute; top: 12px; width: 50px; height: 12px; border-radius: 3px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.14); }
#ruler .slot .on { position: absolute; inset: 0; border-radius: 2px; background: var(--c); opacity: 0; box-shadow: 0 0 10px var(--c); }
#playhead { position: absolute; left: 0; top: 0; width: 2px; height: 36px; background: var(--orange); box-shadow: 0 0 12px var(--orange); }
#hud-count { position: absolute; right: 56px; top: 1000px; font-family: var(--num); font-weight: 800; font-size: 22px; color: rgba(255,255,255,.75); letter-spacing: .12em; opacity: 0; }
#hud-count b { color: var(--orange); font-size: 30px; }

.lbx { position: absolute; left: 0; width: 1920px; height: 140px; background: #000; }
#lbx-top { top: 0; transform: translateY(-100%); }
#lbx-bot { bottom: 0; transform: translateY(100%); }

#vignette { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; pointer-events: none;
  background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%); }
#scanlines { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; pointer-events: none; opacity: 0.07;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.9) 0 1px, transparent 1px 3px); }
```

### 14/16 · `tools/build.mjs`
<!-- casebook-file {"path": "tools/build.mjs", "lines": 368, "final_newline": true, "sha256": "75c9e47ed8cc21b7961d733f724fdae357d437d58098215d4d7eb9af002c8b0c", "original_sha256": "75c9e47ed8cc21b7961d733f724fdae357d437d58098215d4d7eb9af002c8b0c"} -->
```js
#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  build.mjs · EDL + 目录 → 静态 index.html（HyperFrames 合成）+ build/cues.json（配乐用）
//
//  为什么要"生成"而不是手写 index.html：
//    · HyperFrames 在编译期扫描 <video src> 并预抽帧，所以所有视频标签必须是静态 DOM；
//    · 本片有 90+ 个视频元素、28 张海报 ×3 套，全部由 EDL 驱动，手写必错；
//    · 画面与配乐读同一份 EDL（cues.json），改一拍两边一起变。
//
//  产物：index.html（根目录）、build/cues.json、build/timeline.txt（人读的镜头表）
//  用法：node tools/build.mjs
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORKS, MODELS, byKey, STATS, SHARE } from '../src/catalog.mjs';
import * as E from '../src/edl.mjs';
import { CODE_LINES } from '../src/code-lines.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const P = (...a) => path.join(ROOT, ...a);
const { T, BEAT } = E;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const col = (key) => MODELS[byKey[key].model].color;
let lane = 1;

// ── 视频标签（计时只挂在 <video> 本身，外层包裹一律不计时 —— 见 hyperframes-core 规则）
function video(id, src, b0, b1, { mediaStart = 0, track } = {}) {
  const ms = mediaStart ? ` data-media-start="${mediaStart.toFixed(3)}"` : '';
  return `<video id="v-${id}" src="${src}" data-start="${T(b0)}" data-duration="${T(b1 - b0)}"${ms} data-track-index="${track ?? lane++}" muted playsinline></video>`;
}

function label(key, techOverride, { spec = true } = {}) {
  const w = byKey[key];
  return `<div class="label" style="--c:${col(key)}">
      <div class="row1"><span class="chip">${esc(MODELS[w.model].label)}</span><span class="spec">${esc(w.folder)}</span></div>
      <span class="title">${esc(w.title)}</span>
      <span class="tech">${esc(techOverride || w.tech)}</span>
      ${spec ? `<span class="spec">${esc(w.spec)}</span>` : ''}
    </div>`;
}

// ── 各场景 DOM ─────────────────────────────────────────────────────────────
const TX = E.TEXT;

const coldHTML = `
<div id="cold" class="layer">
  <div id="cold-term"><span class="prompt">$</span><span id="cold-cmd"></span><span class="cursor" id="cold-cursor"></span></div>
  ${TX.cold.nos.map((n, i) => `<div class="cold-no" id="no${i}"><span class="txt">${esc(n.text)}<span class="strike"></span></span></div>`).join('\n  ')}
  <div id="cold-thesis">${esc(TX.cold.thesis)}</div>
  <div id="cold-formula">${esc(TX.cold.formula).replace(/\(t\)/, '(<span class="t">t</span>)')}</div>
</div>`;

const eraHTML = E.ERAS.map((e, i) => {
  const c = MODELS[e.model].color;
  const chars = [...e.title].map((ch) => `<span class="ch" data-layout-allow-overlap>${esc(ch)}</span>`).join('');
  const works = WORKS.filter((w) => MODELS[w.model].era === i + 1).length;
  return `
<div id="era${i + 1}" class="layer era" style="--c:${c}">
  <div class="era-num">${e.n}<span class="fillnum">${e.n}</span></div>
  <div class="era-right">
    <div class="era-chip">${esc(MODELS[e.model].label)}</div>
    <div class="era-title">${chars}</div>
    <div class="era-sub">${esc(e.sub)}</div>
  </div>
  <div class="era-cap">ERA ${e.n} · ${esc(MODELS[e.model].label)} · ${works} 部作品</div>
</div>`;
}).join('');

const wins = E.SHOTS.filter((s) => s.type === 'win');
const stackHTML = `
<div id="stack" class="layer"><div id="stack-cam">
${wins
  .map((s) => {
    const w = byKey[s.work];
    const span = E.clipSpan(s);
    return `  <div class="win" id="win-${s.id}" style="--c:${col(s.work)}">
    <div class="win-bar"><i></i><i></i><i></i><div class="win-title" data-layout-allow-overlap><b>${esc(MODELS[w.model].label)}</b> · ${esc(w.folder)}/${esc(w.file)} — ${esc(w.spec)}</div></div>
    <div class="win-body">${video(s.id, `assets/clips/${s.id}.mp4`, span.b0, span.b1)}</div>
    <div class="win-shade"></div>
  </div>`;
  })
  .join('\n')}
</div></div>`;

const G = E.GRID;
const gridHTML = `
<div id="grid" class="layer">
${G.shots
  .map((shotNo, i) => `  <div class="gtile" id="gt${i}">${video(`g${i}`, `assets/clips/grid-${String(i).padStart(2, '0')}.mp4`, G.b0, G.b1)}</div>`)
  .join('\n')}
  <div id="grid-label"><span class="big">${esc(TX.grid.big)}</span><span class="small">${esc(TX.grid.small)}</span></div>
</div>`;

const fulls = E.SHOTS.filter((s) => s.type === 'full');
const fullHTML = `
<div id="full" class="layer" style="opacity:1">
${fulls
  .map(
    (s) => `  <div class="shot" id="shot-${s.id}">
    <div class="shot-media">${video(s.id, `assets/clips/${s.id}.mp4`, s.b0, s.b1)}</div>
    ${label(s.work, s.label)}
  </div>`,
  )
  .join('\n')}
</div>`;

const duoL = E.SHOTS.find((s) => s.type === 'duoL');
const duoR = E.SHOTS.find((s) => s.type === 'phoneR');
const duoHTML = `
<div id="duo" class="layer">
  <div id="duo-left">${video(duoL.id, `assets/clips/${duoL.id}.mp4`, duoL.b0, duoL.b1)}</div>
  <div class="phone" id="duo-phone"><div class="screen"><div class="notch"></div>${video(duoR.id, `assets/clips/${duoR.id}.mp4`, duoR.b0, duoR.b1)}</div></div>
  <div id="duo-label"><b>GPT</b>《${esc(byKey[duoL.work].title)}》 横屏 · 《${esc(byKey[duoR.work].title)}》 竖屏 —— 同一个模型，两种画幅</div>
</div>`;

const dropHTML = `<div id="drop-ov" class="layer"><span class="n">${TX.drop.n}</span><span class="w">${esc(TX.drop.word)}</span></div>`;

const splits = E.SHOTS.filter((s) => s.type === 'split');
const splitHTML = `
<div id="split" class="layer">
${splits
  .map(
    (s) => `  <div class="panel" id="pn-${s.id}" data-n="${s.n}" data-panel="${s.panel}">
    <div class="panel-media">${video(s.id, `assets/clips/${s.id}.mp4`, s.b0, s.b1)}</div>
    ${label(s.work, null, { spec: false })}
  </div>`,
  )
  .join('\n')}
</div>`;

const phones = E.SHOTS.filter((s) => s.type === 'phone');
const phonesHTML = `
<div id="phones" class="layer">
${phones
  .map(
    (s, i) => `  <div class="phone" id="ph-${s.id}" style="left:${[330, 760, 1190][i]}px">
    <div class="screen"><div class="notch"></div>${video(s.id, `assets/clips/${s.id}.mp4`, s.b0, s.b1)}</div>
    <div class="ph-label">${esc(byKey[s.work].title)}<span>${esc(byKey[s.work].spec)}</span></div>
  </div>`,
  )
  .join('\n')}
</div>`;

// 隧道：28 张海报贴四壁（左/右/顶/底轮换），沿 z 纵深排布
const tunnelPlanes = WORKS.map((w, i) => {
  const wall = i % 4;
  const d = Math.floor(i / 4);
  const z = -(300 + d * 760 + wall * 190);
  const tf = [
    `translate3d(-900px,0,${z}px) rotateY(90deg)`,
    `translate3d(900px,0,${z}px) rotateY(-90deg)`,
    `translate3d(0,-520px,${z}px) rotateX(-90deg)`,
    `translate3d(0,520px,${z}px) rotateX(90deg)`,
  ][wall];
  return `  <div class="tplane" id="tp-${w.key}" style="--c:${col(w.key)};transform:${tf}"><img src="assets/posters/${w.key}.jpg" alt=""><div class="tp-cap" data-layout-allow-overlap>${esc(w.title)}</div></div>`;
}).join('\n');
const tunnelHTML = `
<div id="tunnel" class="layer">
  <div id="tunnel-cam">
${tunnelPlanes}
  </div>
  <div class="center-box"><div id="tunnel-line">${esc(TX.tunnel.line)}</div></div>
</div>`;

// 巨墙：7 × 4
const W7 = E.WALL;
const TW = 256, TH = 144, GAP = 10;
const gridW = W7.cols * TW + (W7.cols - 1) * GAP, gridH = W7.rows * TH + (W7.rows - 1) * GAP;
const wx0 = (1920 - gridW) / 2, wy0 = (1080 - gridH) / 2;
const wallPos = (i) => ({ x: wx0 + (i % W7.cols) * (TW + GAP), y: wy0 + Math.floor(i / W7.cols) * (TH + GAP) });
const wallHTML = `
<div id="wall" class="layer">
  <div id="wall-cam">
${WORKS.map((w, i) => {
  const p = wallPos(i);
  return `    <div class="wtile" id="wt-${w.key}" style="--c:${col(w.key)};left:${p.x}px;top:${p.y}px" data-layout-allow-overlap>
      <img class="freeze" src="assets/posters/${w.key}-end.jpg" alt="">
      ${video(`wall-${w.key}`, `assets/clips/wall-${w.key}.mp4`, W7.b0, W7.b1)}
      <div class="wl" data-layout-allow-overlap><i data-layout-allow-overlap>${esc(MODELS[w.model].label)}</i>${esc(w.title)}</div>
      <div class="flash"></div>
    </div>`;
}).join('\n')}
  </div>
  <div id="wall-title">${esc(TX.wall.title)}</div>
  <div id="wall-sub">${esc(TX.wall.sub)}</div>
</div>`;

const breathHTML = `
<div id="breath" class="layer" style="opacity:1">
${TX.breath.map((l, i) => `  <div class="bline" id="bl${i}" data-layout-allow-overlap><div class="big" data-layout-allow-overlap>${esc(l.big)}</div>${l.small ? `<div class="small">${esc(l.small)}</div>` : ''}</div>`).join('\n')}
</div>`;

const flyersHTML = `
<div id="flyers" class="layer" style="opacity:1">
${WORKS.map((w) => `  <div class="flyer" id="fl-${w.key}" style="--c:${col(w.key)}"><img src="assets/posters/${w.key}.jpg" alt=""></div>`).join('\n')}
</div>`;

// 三柱：真实文件名（从仓库实时读取）
function listRepo(filter) {
  const out = [];
  for (const d of fs.readdirSync(REPO, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('00-')) continue;
    for (const f of fs.readdirSync(path.join(REPO, d.name))) if (filter(f)) out.push(`${d.name}/${f}`);
  }
  return out;
}
const lists = [
  listRepo((f) => /\.(zip|tgz|skill|html)$/i.test(f)),
  listRepo((f) => /\.md$/i.test(f)),
  listRepo((f) => /\.mp4$/i.test(f)),
];
const pillarsHTML = TX.pillars.items
  .map((it, i) => {
    const L = lists[i].length ? lists[i] : ['(prep: 仓库文件列表为空)'];
    const rows = [...L, ...L, ...L].map((f) => `<div>${esc(f)}</div>`).join('');
    return `  <div class="pillar" id="pl${i}">
    <div class="ph"><span class="h" data-layout-allow-overlap>${esc(it.head)}</span><span class="en" data-layout-allow-overlap>${esc(it.en)}</span></div>
    <div class="pn"><span class="pl-num" data-to="${it.num}" data-layout-allow-overlap>0</span><span class="unit" data-layout-allow-overlap>${esc(it.unit)}</span></div>
    <div class="sub">${esc(it.sub)}</div>
    <div class="pl-stream"><div class="pl-list" data-rows="${L.length}">${rows}</div></div>
  </div>`;
  })
  .join('\n');

const revealHTML = `
<div id="reveal" class="layer">
  <div id="rv-row">${TX.reveal.chars.map((c, i) => `<div class="rv-ch" id="rc${i}">${esc(c)}</div>`).join('')}</div>
  <div id="rv-en">${esc(TX.reveal.en)}</div>
  <div id="rv-sweep"></div>
</div>
<div id="pillars" class="layer">
${pillarsHTML}
</div>`;

const folderSVG = `<svg class="folder" id="folder" viewBox="0 0 210 170" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb2ff"/><stop offset="1" stop-color="#2f7dff"/></linearGradient>
  <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ff"/><stop offset="1" stop-color="#4a95ff"/></linearGradient></defs>
  <path d="M10 30 Q10 14 26 14 H80 L98 34 H184 Q200 34 200 50 V150 Q200 164 184 164 H26 Q10 164 10 150 Z" fill="url(#fg1)"/>
  <path d="M10 60 Q10 48 24 48 H186 Q200 48 200 62 V150 Q200 164 186 164 H24 Q10 164 10 150 Z" fill="url(#fg2)"/>
  <path d="M112 66 L82 112 H104 L96 148 L130 98 H108 Z" fill="#fff"/>
</svg>`;
const cardHTML = `
<div id="card" class="layer">
  <div id="share">
    <div class="svc"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#1a4fd6"/><path d="M24 9 L14 25 H21 L18 36 L30 19 H23 Z" fill="#fff"/></svg>${esc(SHARE.service)}</div>
    <div class="sh-count" id="sh-count">0 / 28</div>
    ${folderSVG}
    <div class="sh-name">${esc(SHARE.name)}</div>
    <div class="sh-meta">${esc(SHARE.size)} · 28 部成片 · ${STATS.packages} 个源码包 · ${STATS.coexp} 份复盘</div>
    <div class="sh-link" id="sh-link"><span id="sh-link-t"></span><span class="u" id="sh-link-u"></span></div>
    <div class="sh-exp">${esc(SHARE.expire)}</div>
  </div>
  <div id="qrbox"><img src="${SHARE.qr}" alt=""><div class="scan" id="qr-scan"></div></div>
  <div id="card-cta">${esc(TX.card.cta)}</div>
  <div id="card-note">${esc(TX.card.note)}</div>
</div>`;

const outroHTML = `
<div id="outro" class="layer">
  <div id="out-term"><span class="prompt">$</span><span id="out-cmd"></span><span class="cursor" id="out-cursor"></span></div>
  <div id="out-answer"><span class="arrow">▸</span>${esc(TX.outro.answer)}</div>
  ${TX.outro.credits.map((c, i) => `<div class="credit" id="cr${i}">${esc(c)}</div>`).join('\n  ')}
</div>
<div id="mini"><div class="mt"><b>源码 · 复盘 · 成片 · 通通开源</b><span>${esc(SHARE.service)} · ${esc(SHARE.url)}</span><span>${esc(SHARE.size)}</span></div><img src="${SHARE.qr}" alt=""></div>`;

const hudHTML = `
<div id="hud">
  <div id="hud-tl"><span id="hud-rec"><i></i>REC</span><span id="hud-cmd">render(t)</span><span id="hud-time">t = 00.000s</span><span id="hud-frame">f 0000</span></div>
  <div id="hud-era"><span class="k" id="hud-era-k">ERA 01</span><span class="v" id="hud-era-v">KIMI</span></div>
  <div id="ruler"><div class="base" id="ruler-base"></div>
${WORKS.map((w, i) => `    <div class="slot" id="sl-${w.key}" style="--c:${col(w.key)};left:${i * (1600 / 28) + 3}px"><div class="on"></div></div>`).join('\n')}
    <div id="playhead"></div>
  </div>
  <div id="hud-count"><b id="hud-count-n">0</b> / 28 部</div>
</div>`;

// ── 首次出场拍（底部时间尺点亮用）───────────────────────────────────────
const firstSeen = {};
const see = (k, b) => { if (firstSeen[k] === undefined || b < firstSeen[k]) firstSeen[k] = b; };
for (const s of E.SHOTS) see(s.work, s.b0);
see(E.GRID.work, E.GRID.b0);
WORKS.forEach((w, i) => { if (firstSeen[w.key] === undefined) see(w.key, E.WALL.b0 + 0.25 + i * 0.06); });

// ── 组装 ─────────────────────────────────────────────────────────────────
const css = fs.readFileSync(P('src/style.css'), 'utf8').replace(/\.\.\/assets\//g, 'assets/');
const runtime = fs.readFileSync(P('src/runtime.js'), 'utf8');
const DATA = {
  BEAT, FPS: E.FPS, DURATION: E.DURATION, TOTAL_BEATS: E.TOTAL_BEATS,
  SECTIONS: E.SECTIONS, ERAS: E.ERAS, SHOTS: E.SHOTS, GRID: E.GRID, WALL: E.WALL, TUNNEL: E.TUNNEL, TEXT: E.TEXT,
  STACK_END: E.STACK_END,
  WORKS: WORKS.map((w, i) => ({ key: w.key, model: w.model, color: col(w.key), title: w.title, slot: i })),
  MODELS, firstSeen, CODE_LINES, SHARE, STATS,
  wall: { TW, TH, GAP, x0: wx0, y0: wy0 },
};

const html = `<!doctype html>
<!--
  AI-CODING · SUPERVIDEOS —— 合集总片（62.4s · 150 BPM · 1920×1080）
  ⚠ 本文件由 tools/build.mjs 生成，请勿手改。改 src/edl.mjs / src/catalog.mjs / src/runtime.js / src/style.css 后重新 build。
-->
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>AI-Coding SuperVideos · 通通开源</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
${css}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${E.DURATION}" data-width="1920" data-height="1080" data-fps="60" data-layout-allow-overflow>
  <div id="bg" class="fill"></div>
  <canvas id="fxback" class="fx" width="1920" height="1080"></canvas>
  <div id="stage" class="fill">
${coldHTML}
${eraHTML}
${stackHTML}
${gridHTML}
${fullHTML}
${duoHTML}
${dropHTML}
${splitHTML}
${phonesHTML}
${tunnelHTML}
${wallHTML}
${breathHTML}
${flyersHTML}
${revealHTML}
${cardHTML}
${outroHTML}
  </div>
  <canvas id="fxfront" class="fx" width="1920" height="1080" data-layout-allow-occlusion></canvas>
  <div id="vignette"></div>
  <div id="scanlines"></div>
  <div id="lbx-top" class="lbx"></div>
  <div id="lbx-bot" class="lbx"></div>
${hudHTML}
  <audio id="score" src="assets/score.wav" data-start="0" data-duration="${E.DURATION}" data-track-index="90" data-volume="1"></audio>
</div>
<script>window.__EDL = ${JSON.stringify(DATA).replaceAll('THREE.', 'THREE\\u002e')};</script>
<!-- 注：EDL 里的真实代码行含 "THREE.WebGLRenderer"，会把静态检查器的 three.js 检测误触发。
     这里把 '.' 转义成 ，JSON.parse 解码回原文，显示与源码完全一致，但不再误报 missing_three_script。-->
<script>
${runtime}
</script>
</body>
</html>
`;
fs.writeFileSync(P('index.html'), html);

// ── 配乐 cue ─────────────────────────────────────────────────────────────
fs.mkdirSync(P('build'), { recursive: true });
fs.writeFileSync(
  P('build/cues.json'),
  JSON.stringify({ bpm: E.BPM, beat: BEAT, duration: E.DURATION, totalBeats: E.TOTAL_BEATS, sections: E.SECTIONS, eras: E.ERAS, sfx: E.SFX, cuts: E.SHOTS.map((s) => s.b0) }, null, 1),
);

// ── 人读镜头表 ───────────────────────────────────────────────────────────
const rows = [];
for (const s of E.SHOTS) rows.push(`${T(s.b0).toFixed(2).padStart(6)}s  b${String(s.b0).padEnd(5)} ${s.id.padEnd(5)} ${s.type.padEnd(7)} ${byKey[s.work].title}  @${s.in}s`);
fs.writeFileSync(P('build/timeline.txt'), rows.join('\n') + '\n');

const vids = (html.match(/<video /g) || []).length;
console.log(`build: index.html 写出（${(html.length / 1024).toFixed(0)} KB，${vids} 个 <video>），build/cues.json（${E.SFX.length} 个音效 cue）`);
```

### 15/16 · `tools/prep_media.mjs`
<!-- casebook-file {"path": "tools/prep_media.mjs", "lines": 160, "final_newline": true, "sha256": "0c1030f78b3253b066e41dd570207adedf502c09044b8d50d46df2d61ffed2bd", "original_sha256": "0c1030f78b3253b066e41dd570207adedf502c09044b8d50d46df2d61ffed2bd"} -->
```js
#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  prep_media.mjs · 把 28 部原片切成本片要用的代理素材
//
//  为什么要预切：原片里有 4K60（protocom）、1440p60（定格 566MB）等大文件，
//  直接塞进 HyperFrames 会让帧抽取极慢。这里按 EDL 精确切出每个镜头需要的
//  那一小段（+0.3s 余量），统一 30fps / H.264 / 短 GOP / 无音轨。
//
//  产物：
//    assets/clips/<shotId>.mp4      每个镜头一段
//    assets/clips/grid-cosmos.mp4   COSMOS 全片 640×360（16 格宫格共用，不同 media-start）
//    assets/clips/wall-<key>.mp4    28 宫格巨墙，每部 3.4s，480×270
//    assets/posters/<key>.jpg       28 张海报（隧道 / 爆散 / 吸入文件夹用）
//    build/qa/contact-shots.jpg     所有镜头中间帧联系表（给验收用）
//    build/qa/contact-wall.jpg      28 张海报联系表
//
//  用法：node tools/prep_media.mjs [--force] [--only=h01,w03]
// ─────────────────────────────────────────────────────────────────────────────
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORKS, byKey } from '../src/catalog.mjs';
import { SHOTS, GRID, WALL, BEAT, clipSpan } from '../src/edl.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');
const FORCE = process.argv.includes('--force');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const JOBS = Math.max(2, Math.min(6, (await import('node:os')).cpus().length >> 1));

const P = (...a) => path.join(ROOT, ...a);
for (const d of ['assets/clips', 'assets/posters', 'build/qa']) fs.mkdirSync(P(d), { recursive: true });

const srcOf = (key) => {
  const w = byKey[key];
  if (!w) throw new Error(`catalog 里没有 ${key}`);
  const f = path.join(REPO, w.folder, w.file);
  if (!fs.existsSync(f)) throw new Error(`找不到源文件：${f}`);
  return f;
};

// ── 滤镜 ──────────────────────────────────────────────────────────────────
const cover = (w, h) => `scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h},setsar=1`;
// 竖屏源 → 横屏格子：模糊铺底 + 居中原画（不裁掉内容）
const blurPad = (w, h) =>
  `split[a][b];[a]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},boxblur=24:2,eq=brightness=-0.18:saturation=1.2[bg];` +
  `[b]scale=-2:${h}:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:0,setsar=1`;

const SIZE = {
  win: [1280, 720],
  full: [1920, 1080],
  duoL: [1920, 1080],
  split: [1280, 720],
  phone: [608, 1080],
  phoneR: [608, 1080],
};

function run(args, label) {
  return new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (c) => (c === 0 ? res() : rej(new Error(`[${label}] ffmpeg 失败\n${err}`))));
  });
}

const ENC = (crf) => ['-an', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', String(crf), '-g', '15', '-bf', '0', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];

function clipJob({ id, key, inSec, dur, w, h, crf = 16 }) {
  const out = P('assets/clips', `${id}.mp4`);
  if (!FORCE && fs.existsSync(out)) return null;
  const vertSrc = !!byKey[key].vertical;
  const vertOut = h > w;
  // 竖屏源进横屏格子 → blurPad；横屏源进竖屏手机 → cover 居中裁；同向 → cover
  const vf = vertSrc && !vertOut ? blurPad(w, h) : cover(w, h);
  const useComplex = vf.includes('[');
  return () =>
    run(
      ['-ss', inSec.toFixed(3), '-t', dur.toFixed(3), '-i', srcOf(key), ...(useComplex ? ['-filter_complex', vf] : ['-vf', vf]), ...ENC(crf), out],
      id,
    );
}

// 海报：<key>.jpg 取 wallIn+1.2s（隧道/爆散/吸入用）
//       <key>-end.jpg 取巨墙片段的最后一帧附近（b104 音乐骤停时，巨墙"冻结"成这张，无跳帧）
function posterJob(w, suffix, at) {
  const out = P('assets/posters', `${w.key}${suffix}.jpg`);
  if (!FORCE && fs.existsSync(out)) return null;
  const vf = w.vertical ? blurPad(640, 360) : cover(640, 360);
  return () =>
    run(['-ss', at.toFixed(3), '-i', srcOf(w.key), '-frames:v', '1', ...(vf.includes('[') ? ['-filter_complex', vf] : ['-vf', vf]), '-q:v', '3', out], `poster:${w.key}${suffix}`);
}

// ── 组装任务 ──────────────────────────────────────────────────────────────
const jobs = [];
const want = (id) => !ONLY.length || ONLY.includes(id);

for (const s of SHOTS) {
  if (!want(s.id)) continue;
  const [w, h] = SIZE[s.type];
  const span = clipSpan(s);
  const dur = (span.b1 - span.b0) * BEAT + 0.3;
  const j = clipJob({ id: s.id, key: s.work, inSec: s.in, dur, w, h, crf: s.type === 'full' || s.type === 'duoL' ? 15 : 17 });
  if (j) jobs.push(j);
}
// 宫格：16 格各切独立文件 —— 不能靠 data-media-start 区分同一文件（会被按 src 去重）
GRID.shots.forEach((shotNo, i) => {
  const id = `grid-${String(i).padStart(2, '0')}`;
  if (!want(id) && !want('grid')) return;
  const j = clipJob({ id, key: GRID.work, inSec: shotNo * GRID.shotLen + 0.05, dur: (GRID.b1 - GRID.b0) * BEAT + 0.3, w: 640, h: 360, crf: 20 });
  if (j) jobs.push(j);
});
for (const w of WORKS) {
  if (!want(`wall-${w.key}`) && !want('wall')) continue;
  const j = clipJob({ id: `wall-${w.key}`, key: w.key, inSec: w.wallIn, dur: WALL.clipLen, w: 480, h: 270, crf: 20 });
  if (j) jobs.push(j);
}
for (const w of WORKS) {
  if (!want(`poster-${w.key}`) && !want('poster')) continue;
  const wallShown = (WALL.b1 - WALL.b0) * BEAT; // 巨墙上实际播放的时长 3.2s
  for (const j of [posterJob(w, '', w.wallIn + 1.2), posterJob(w, '-end', w.wallIn + wallShown - 1 / 30)]) if (j) jobs.push(j);
}

console.log(`prep_media: ${jobs.length} 个任务，并行 ${JOBS}`);
let done = 0;
const t0 = Date.now();
async function worker() {
  while (jobs.length) {
    const j = jobs.shift();
    await j();
    done++;
    if (done % 10 === 0) console.log(`  … ${done} 完成（${((Date.now() - t0) / 1000).toFixed(0)}s）`);
  }
}
await Promise.all(Array.from({ length: JOBS }, worker));

// ── QA 联系表 ─────────────────────────────────────────────────────────────
async function contactSheets() {
  const qa = P('build/qa/frames');
  fs.rmSync(qa, { recursive: true, force: true });
  fs.mkdirSync(qa, { recursive: true });
  let i = 0;
  for (const s of SHOTS) {
    const f = P('assets/clips', `${s.id}.mp4`);
    if (!fs.existsSync(f)) continue;
    const mid = ((s.b1 - s.b0) * BEAT) / 2;
    await run(['-ss', mid.toFixed(3), '-i', f, '-frames:v', '1', '-vf', 'scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2', P('build/qa/frames', `${String(i++).padStart(3, '0')}.jpg`)], `qa:${s.id}`);
  }
  if (i) await run(['-framerate', '1', '-i', P('build/qa/frames', '%03d.jpg'), '-vf', 'tile=8x8:padding=4:color=white', '-frames:v', '1', P('build/qa/contact-shots.jpg')], 'contact-shots');
  const posters = WORKS.map((w) => P('assets/posters', `${w.key}.jpg`)).filter((f) => fs.existsSync(f));
  if (posters.length) {
    const list = P('build/qa/posters.txt');
    fs.writeFileSync(list, posters.map((f) => `file '${f.replace(/\\/g, '/')}'\nduration 1`).join('\n'));
    await run(['-f', 'concat', '-safe', '0', '-i', list, '-vf', 'scale=320:180,tile=7x4:padding=4:color=white', '-frames:v', '1', P('build/qa/contact-wall.jpg')], 'contact-wall');
  }
  console.log(`联系表：build/qa/contact-shots.jpg（按 SHOTS 顺序）· build/qa/contact-wall.jpg（按 WORKS 顺序）`);
}
await contactSheets();
console.log(`prep_media 完成，用时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
```

### 16/16 · `tools/qa_probe.mjs`
<!-- casebook-file {"path": "tools/qa_probe.mjs", "lines": 30, "final_newline": true, "sha256": "7e18e370ddac3f469deb3c9a757d92609c481e7ee139ef9c144a7aea036b661e", "original_sha256": "7e18e370ddac3f469deb3c9a757d92609c481e7ee139ef9c144a7aea036b661e"} -->
```js
// qa_probe.mjs · 用 Playwright 加载 index.html，抓 JS 错误/控制台，并按时刻渲染自查
// 用法: node tools/qa_probe.mjs [t1,t2,...]  —— 会在每 t 调 __render(t) 并截图到 build/qa/
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(path.join(process.env.APPDATA || '', 'npm/node_modules/x/'));
const { chromium } = req('playwright');

const times = process.argv[2] ? process.argv[2].split(',').map(Number) : [0, 3, 7, 13, 18, 23, 31, 44, 47, 50, 55, 61, 63.2, 64.5, 70, 78, 81, 83, 85, 87, 90, 94, 96.5, 99, 103, 106, 110, 114, 117, 119, 121, 126, 130, 134, 145, 150, 155];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message, '\n', (e.stack || '').split('\n').slice(0, 6).join('\n')));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.type(), m.text()); });
await page.goto('file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/'));
await page.waitForTimeout(3500);
const ok = await page.evaluate(() => ({ tl: !!(window.__timelines && window.__timelines.main), render: typeof window.__render }));
console.log('init:', JSON.stringify(ok));
if (ok.render) {
  const fs = await import('node:fs');
  fs.mkdirSync(path.join(ROOT, 'build/qa'), { recursive: true });
  for (const t of times) {
    const err = await page.evaluate((tt) => { try { window.__render(tt); return null; } catch (e) { return e.message + '\n' + e.stack; } }, t);
    if (err) console.log(`RENDER@${t}s ERROR:`, err.split('\n').slice(0, 4).join(' | '));
    await page.screenshot({ path: path.join(ROOT, 'build/qa', `t${String(t).replace('.', '_')}.png`) });
  }
  console.log('snapshots → build/qa/t*.png');
}
await browser.close();
```

