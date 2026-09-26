---
compositionId: bgm
duration_s: 51.293
canvas: { w: 1920, h: 1080, fps: 30 }
mode: autonomous
style:
  font: "Barlow / IBM Plex Mono / Noto Sans SC"
  palette: ["#111111", "#E85D26", "#F0ECE5", "#888880", "#1A1A18"]
assets: false
build_notes: ["one paused timeline per frame", "no remote assets", "152BPM beat grid is real (rolls + dense phases) — hard cuts on beats", "track window 46.324–97.617 of the source, analysis windowed from the full-track map"]
avoid: ["generic slideshow", "tiny unreadable hero text", "任何画面重叠/空白", "uppercase Barlow display (brand rule: lowercase 900)"]
---

## Frame 1 — f1-boot

- src: compositions/frames/01-f1-boot.html
- duration: 4.644s
- span_sec: [0.0, 4.644]
- pacing: beat_cut
- mood: [dark, tense, glitch]
- feel: cold open — medium-energy onset stream (hihat ticks, kicks at 2.42/2.81) straight out of silence, a terminal waking up

### Groups

- **g1** — template: `typewriter-phrase-keyword-shuffle`
  - span_sec: [0.0, 4.644]
  - params: { bgColor: "#111111", textColor: "#F0ECE5", accentColor: "#E85D26", lead1: "$ boot --year 2017", lead2: "// the paper that changed everything", lead3: "", keyword: "transformer", periodChar: "_" }
  - role_bindings: { type_onsets: [0.14, 0.53, 1.11, 1.51, 1.86, 2.09, 2.23, 2.42, 2.81, 3.23], shuffle_hits: [3.81, 4.23, 4.57] }
  - copy: phrase "attention is all you need"（逐词打出），keyword "transformer" 在尾部三次击中切换字体

## Frame 2 — f2-title

- src: compositions/frames/02-f2-title.html
- duration: 6.269s
- span_sec: [4.644, 10.913]
- pacing: beat_cut
- mood: [hype, aggressive]
- feel: SURGE at 4.676 (e=0.93) — the door kicks open; snare stream 4.78–9.24 drives word-by-word reveals, kick 9.59 lands the climax

### Groups

- **g1** — template: `intro-kinetic-cascade`
  - span_sec: [4.644, 10.913]
  - params: { theme: "dark", icon: "sparkle", phrases: "[{\"words\":[\"机器\"],\"hero\":\"机器\"},{\"words\":[\"学会了\"],\"hero\":\"学会\"},{\"words\":[\"思考\"],\"hero\":\"思考\"}]", climax: "{\"word\":\"ai 觉醒\",\"kicker\":\"the awakening · 智能觉醒\"}" }
  - role_bindings: { phrase: { times: [4.97, 6.55, 7.85] }, climax: { in: 9.59, iconAt: 10.17 } }
  - copy: 机器 / 学会了 / 思考 → climax "ai 觉醒"

## Frame 3 — f3-montage

- src: compositions/frames/03-f3-montage.html
- duration: 11.749s
- span_sec: [10.913, 22.662]
- pacing: beat_cut
- mood: [hype, dark]
- feel: dense kick stream builds (11.6–22.6), kick-roll at 12.4 recolors the wall, second roll 21.8–22.6 accelerates into the DROP

### Groups

- **g1** — template: `poster-tile-mosaic`
  - span_sec: [10.913, 17.229]
  - params: { bgColor: "#111111", tiles: "12 mixed-size sharp-rect tiles", bands: "['#1A1A18','#282826','#E85D26']", gap: "6", showText: true, labels: "['2016 alphago','2017 transformer','2022 chatgpt','2023 gpt-4','2024 sora','2025 agents']", program: "accumulate on kicks → locked global recolor on roll 12.399–12.910 → snake-fill to 17.2" }
  - role_bindings: { accumulate: [11.63, 11.91, 12.91, 13.21, 13.47, 13.72], recolor_roll: [12.399, 12.910], snake_fill: [14.07, 14.35, 14.98, 15.19, 15.90, 16.25, 16.42, 17.14] }
  - copy: AI 编年史瓷砖墙（milestone 年份+事件）
- **g2** — template: `card-flyby`
  - span_sec: [17.229, 22.662]
  - params: { theme: "dark", bgColor: "#111111", cards: "['chatgpt','gpt-4','claude','kimi','sora','agent 时代']", landings: "[17.58, 18.60, 19.39, 20.27, 20.94, 22.43]", yaw: "18" }
  - role_bindings: { landings: [17.58, 18.60, 19.39, 20.27, 20.94, 22.43], accel_roll: [21.803, 22.616] }
  - copy: 产品卡纵深飞来，一张一个 kick，最后一张 "agent 时代" 停在 DROP 前一瞬

## Frame 4 — f4-drop

- src: compositions/frames/04-f4-drop.html
- duration: 14.304s
- span_sec: [22.662, 36.966]
- pacing: beat_cut
- mood: [aggressive, glitch, hype]
- feel: DROP at 23.676 (e=0.94, the biggest hit of the track) — strobe burst, then a dense code-storm middle, then a held anchor + cycling slot to the next roll

### Groups

- **g1** — template: `held-text-strobe-burst`
  - span_sec: [22.662, 26.099]
  - params: { markText: "爆发", fontStyle: "barlow-900-lower", markScale: "0.9", idleColor: "#111111", idleInk: "#E85D26", frames: "ships texture-mask PNGs", strobePlan: "burst on [22.94, 23.38, 23.66, 24.03, 24.31, 24.47] + ride roll 25.588–26.099", decor: "1px hairlines", duration: "3.437" }
  - copy: "爆发"（DROP 砸下的大字，纹理频闪）
- **g2** — free_design
  - span_sec: [26.099, 30.998]
  - free_design: { dominant_system: "terminal code storm — binary-decrypt rain columns + counting-punch stat cards slamming on kicks", primitives: ["binary-decrypt", "counting-punch", "chromatic-split", "screen-shake"], density_topology: "accumulate" }
  - anchors: [26.10, 26.84, 27.66, 28.03, 29.56, 29.95, 30.23, 30.74]
  - copy: 代码雨 + 三张数据卡（真实数据）："175b parameters · gpt-3" / "100m users · 2 months · chatgpt" / "1 prompt → anything"
- **g3** — template: `split-anchor-word-slot`
  - span_sec: [30.998, 36.966]
  - params: { bgColor: "#111111", anchors: "left column rows: agents / 能做什么", theme: "dark", showText: true, program: "slot cycles on onsets → per-beat jitter over dense run 34.88–36.13 → box-zoom exit wipe on 36.69 kick" }
  - role_bindings: { slot_cycle: [31.25, 31.79, 32.25, 33.06, 34.20, 35.92], jitter_run: [34.88, 36.13], exit_wipe: 36.69 }
  - copy: slot 词组：写代码 / 做设计 / 剪视频 / 做科研 / 开公司

## Frame 5 — f5-finale

- src: compositions/frames/05-f5-finale.html
- duration: 11.633s
- span_sec: [36.966, 48.599]
- pacing: beat_cut
- mood: [hype, aggressive]
- feel: 25-onset dense finale — burst of four kicks at 37.2, roll at 44.2, double roll-kick at 46.6, snare 47.28 is the last real hit before the void

### Groups

- **g1** — free_design
  - span_sec: [36.966, 43.560]
  - free_design: { dominant_system: "per-onset hypercut typography — one slammed word per kick, flash-cut frames, palette-flip on snare", primitives: ["flash-cut", "hypercut-whip", "palette-flip", "screen-shake", "braam-punch"], density_topology: "accumulate" }
  - anchors: [37.17, 37.31, 37.45, 37.55, 38.20, 39.10, 39.75, 40.40, 40.52, 41.08, 42.86]
  - copy: 快切字拳："看懂的人" / "已经" / "上车" / "builders win" / "信息差" / "就是生产力"
- **g2** — template: `held-text-strobe-burst`
  - span_sec: [43.560, 46.951]
  - params: { markText: "all in", fontStyle: "barlow-900-lower", markScale: "1.0", idleColor: "#E85D26", idleInk: "#111111", frames: "ships texture-mask PNGs", strobePlan: "strobe ride roll 44.164–44.605, double-hit 45.33 / 45.56, final flicker 46.60–46.95", decor: "none", duration: "3.391" }
  - copy: "all in"（橙底黑字反色频闪——全片唯一反色帧，制造峰值对比）
- **g3** — free_design
  - span_sec: [46.951, 48.599]
  - free_design: { dominant_system: "crash-zoom final slam — one word punches to full-frame on the last snare", primitives: ["crash-zoom-in", "braam-punch", "chromatic-split"], density_topology: "resolve" }
  - anchors: [46.70, 46.86, 47.28]
  - copy: "未来已来"（47.28 军鼓 = 全片最后一次重击，砸满全屏后 hold 进静场）

## Frame 6 — f6-outro

- src: compositions/frames/06-f6-outro.html
- duration: 2.694s
- span_sec: [48.599, 51.293]
- pacing: phrase_flow
- mood: [dark, cinematic]
- feel: VOID — the music cuts to silence (48.676–50.676), only the audio fade-out tail remains; held lockup breathes and dims

### Groups

- **g1** — free_design
  - span_sec: [48.599, 51.293]
  - free_design: { dominant_system: "held lockup — blur-resolve in from the slam, slow dim with the audio fade", primitives: ["blur-resolve"], density_topology: "resolve" }
  - anchors: [48.676]
  - copy: "ai · 未来已来" + mono credit 行 "music: volatile reaction — kevin macleod (cc by 4.0)"
