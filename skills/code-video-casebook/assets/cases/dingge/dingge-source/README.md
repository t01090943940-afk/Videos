# 定格 · 工地沙盒 + 定格动画短片（TypeScript / Three.js）

## 运行
```bash
npm i
npm run dev            # 沙盒：漫游(60fps) / 影片播放 / 镜头跳转 / 机位预设 / 太阳与画质
npm run check          # 全片逐帧穿模检查 → out/collision-report.json
npm run render         # 离线逐帧渲染 + 合成音轨 + ffmpeg → out/dingge_1080p.mp4（可断点续渲）
node scripts/render.mjs --stills        # 每个镜头一张审片图
```

## 架构（场地 / 表演 / 镜头 三层分离）
```
src/core        math(确定性随机、缓动、关键帧) · engine(渲染器+后期：GTAO/Bokeh/调色/颗粒)
src/materials   程序化 PBR 贴图(混凝土、覆膜板、钢筋网、锈钢、安全网、标牌文字) · 材质库
src/world       layout(全部尺寸唯一来源) · building · crane · props · city · sky · site(静态几何按材质合批)
src/characters  rig(木偶骨架+全套劳保) · poses(姿势库/步态) · actor(表演：关键姿势+步态+地面吸附+安全绳)
src/film        stage(Take=连续表演，含接触求解) · shots(22 个镜头=纯数据) · timeline(on twos 量化/boil/复用) · mg(MG 图层)
src/audio       sfx(可复用合成音效) · score(环境声+音效提示+配乐，离线渲 WAV)
docs/DIRECTOR.md  导演稿：调研依据、文稿、导演阐述、分镜表、速度与防穿模规范
```
拍新片：保留 world/ 与 characters/，新写一份 Take（stage.ts）和 shots.ts 即可。

## 定格规则如何落地
- 时间按镜头 step 量化：2 = 每秒 12 张（on twos），冲击动作用 1。
- 只有木偶真的被“重新摆过”的帧才 boil（关节 ±0.35°、主光 ±1.5%），定格帧与环绕机位不抖。
- 未变化的 3D 画面直接复用，只重绘 MG。

## 已知限制
- 人物是“可摆拍木偶”风格（真实比例 + 全套 PPE），不是写实数字人。
- 无配音：云端无法访问 TTS，字幕与 MG 承担信息；`docs/DIRECTOR.md` 文稿可直接用于后期配音。
