# Render & QC：采集、封装、机器可证的检查

## 目录
1. 采集契约与 capture.mjs
2. 性能与预算
3. 预览关卡（渲染前置门）
4. 封装参数
5. finalize.py 的九项 QC
6. 交付清单
7. 诚实性

---

## 1. 采集契约

页面 `web/film.html` 加载 `dist/film.js`，暴露：
```ts
window.film = {
  ready: Promise<Meta>,              // 字体、世界副本、显示器缩略图都准备好
  frame(f, quality=0.93): Promise<string>,   // JPEG dataURL（3D 底片 + MG 图层）
  inspect(f): Promise<InspectRow>,   // 不出像素
  meta(): Promise<Meta>              // title, fps, width, height, total, shots[{id,start,look,...}], events[{shot,frame,set}]
}
```

`scripts/capture.mjs`（在工程里，依赖工程的 playwright-core）：
```bash
node scripts/capture.mjs --meta --out out/meta.json
node scripts/capture.mjs --frames 0,130,310 --out out/stills
node scripts/capture.mjs --range 0:1440[:step] --out out/frames [--force]
node scripts/capture.mjs --inspect 0:1440:1 --out out/qc/inspect.json
```
- 内置静态服务器（`--root web`，`PORT` 默认 8765）；Chrome 查找顺序：`$CHROME` → `$PLAYWRIGHT_BROWSERS_PATH/chromium-*/…` → playwright 默认。
- 启动参数 `--use-angle=swiftshader --enable-unsafe-swiftshader`：没有 GPU 也能跑；有 GPU 时去掉这两个参数会快很多。
- 一个浏览器、一个页面、串行出帧：小 CPU 机器上并行 headless WebGL 会互相抢。
- 已存在的帧跳过 → 断点续渲。后台运行：`nohup node scripts/capture.mjs --range 0:1440 --out out/frames > out/logs/render.log 2>&1 &`。

## 2. 性能与预算

实测（SwiftShader，2 核，1280×720）：平均 0.7–1.3 s/帧；clay（DOF）和 wipe 帧最慢；分屏结尾 2–4 s/帧。60s 片全片约 25–30 分钟。

优化顺序（每步先测，测法见 first-principles §9）：
1. 关掉的实景灯 `visible=false`；
2. 静态网格按材质合批（`bakeStatic`），动的东西标 `dynamic`；
3. 后期采样数（AO/DOF/晕染 8→6）；
4. 阴影贴图 2048→1024；
5. 最后才降分辨率。

## 3. 预览关卡（渲染前置门）

全片渲染之前必须完成并**真的看过**：
1. `validate.py --timeline` 无 ERROR；
2. 故事板：每镜 1–2 帧的 contact sheet（`contact_sheet.py`）；
3. 画风：每个用到的画风 3 帧；
4. 动作：最难的交互连续渲 3–5s 看节奏；
5. `inspect.json` 通过（穿插 0）。

## 4. 封装参数（finalize.py 内置）

```
ffmpeg -framerate 24 -i out/frames/f%05d.jpg -i out/audio/mix.wav
  -vf scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos,format=yuv420p
  -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0
  -r 24 -fps_mode cfr -g 48 -c:a aac -b:a 192k -ar 48000 -t <dur> -movflags +faststart final.mp4
```
- 浏览器导出的 JPEG 是 **full range**，必须转成 limited（tv）再写 BT.709 标签；只写标签不转换，播放器会把黑位抬灰。
- `h264_metadata` 把颜色信息写进码流本身（VUI），不只是容器。

## 5. finalize.py 的九项 QC

| 检查 | 通过条件 |
|---|---|
| preflight.frames | f00000…f(total−1) 全部存在且 > 1KB |
| preflight.audio | 音频时长 = 画面时长 ±0.05s |
| probe | h264 / yuv420p / 帧数 = total / fps 精确 / range=tv / bt709×3 / 有音轨 |
| faststart | moov 在 mdat 之前 |
| decode | `ffmpeg -xerror` 全解码无错 |
| freeze | freezedetect(n=0.002, d=0.4) 无结果（步进 hold 只有 2–3 帧，超过 0.4s 的冻结是 bug） |
| black | blackdetect 无结果 |
| loudness | MP4 内 AAC：−18 ≤ I ≤ −13 LUFS 且 TP ≤ −1.0 dBTP |
| acting | 穿插帧 0；surface 深度 > −1cm；exact 误差 < 3cm；stepping 段长一致 |

报告先以 `status: running` 落盘，每步更新；最后写 `qc-report.md` 和 `manifest.json`（sha256）。

## 6. 交付清单

- `out/final.mp4`
- `out/qc/qc-report.{json,md}`、`out/manifest.json`
- contact sheet（故事板 + 画风对比）
- `out/audio/mix.wav` + stems + `cues.json` + `loudness.json`
- 工程源码 zip（不含 node_modules、out/frames）

## 7. 诚实性

- 没有人耳试听、没有在真实播放器里 1× 播放过，就写进 limitation。
- QC 有 FAIL 就报告 FAIL 和原因，不说"已完成"。
- 不声称存在没生成的文件；交付前 `ls` 一遍。
