# Looks：画风 = 一整条渲染管线

## 目录
1. LookDef 契约
2. 共享基础设施（G-buffer、GLSL 公共库、特殊材质）
3. 七个内置配方
4. 选型决策表（问用户时怎么推荐）
5. 加一个新画风（步骤 + 检查）
6. 各画风专属失败检查
7. 调参速查

---

## 1. LookDef 契约（`src/looks/types.ts`）

```ts
interface LookDef {
  id: string; label: string; zh: string; blurb: string; tags: string;
  poseFps: number;          // 木偶节奏：12 = on twos，8 = on threes
  cameraOnTwos?: boolean;   // 手绘/剪纸类：相机也步进
  variant: "day" | "night"; // 这个画风用世界的哪个变体
  accent: string;           // 转场边缘、chip、UI 强调色
  uvUnit: number;           // 多少米一块纹理（世界空间 UV）
  material(sem: Sem): THREE.Material;             // 语义材质 → 真材质（必须缓存/复用）
  geometry?: { box?, cyl?, sphere? };             // 几何处理（方块化、圆角化）
  setup(scene, ctx): void;                        // 布光、背景、雾、隐藏尘埃
  update?(scene, ctx, time): void;                // 每帧（闪烁等）
  post(c: PostCtx): void;                         // 全屏 pass：读 G-buffer，写输出
}
```

一个画风必须能碰到"识别特征"所在的全部五层：几何 / 着色 / 光 / 屏幕空间 / 节奏（原因见 first-principles §4）。

## 2. 共享基础设施

- **GBuffer**（`runtime/post.ts`）：颜色 = MSAA4 HalfFloat 线性；法线 + 深度 = 另一张目标（`scene.userData.noOutline` 里的物体不画进去，比如玻璃、光柱、粒子）。
- **输出是 display-referred**：renderer 设 `LinearSRGBColorSpace + NoToneMapping`，ACES 和 sRGB 在 post 的 GLSL 里做（`aces()`、`toSRGB()`），这样所有画风在同一处控制色调映射。
- **GLSL_COMMON** 提供：`hash12 / vnoise / fbm`（确定性噪声）、`luma`、`aces`、`toSRGB/fromSRGB`、`linDepth`、`nrm`（解包法线）、`isSky`、`edgeDN(uv, r, dThr, nThr, jitter)`（深度+法线描边）、`edgeC`（颜色描边）、`vignette`。
- **fsPass(frag, uniforms)** 建全屏 pass；`bindCommon(pass, c)` 绑定 tColor/tNormal/tDepth/uRes/uTime/uStep。`uStep = floor(poseT*poseFps)` 用来让噪声"按张"变化（线条抖动）。
- **specialMaterial**（`looks/common.ts`）统一处理 screen/tv（实时缩略图纹理）、backdrop、glass、neon（夜间×2.4）、glow。每个画风先调它，返回 null 再走自己的材质。
- **standardLights(ctx, o)**：日/夜通用布光；夜景只开实景灯。
- **grade(hex, {sat, light, hue, mulS, mulL})**：HSL 调色；**toonRamp(levels)**：toon 渐变贴图。
- **TEX**（`looks/tex.ts`）：确定性画布纹理：planks、brick、plaster、fabric、pixel(family)、clayBump、paper。

## 3. 七个内置配方

### diorama 微缩沙盘（中性基准画风）
- 几何：RoundedBox 1.2cm 倒角，边缘抓光。
- 着色：MeshStandard + 程序纹理（木纹、砖、灰泥、织物），ROUGH/METAL 表。
- 光：sun 3.4 / hemi .85 / bounce .95 / 光柱 .09；不用 PMREM。
- 后期：8 采样深度 AO → ACES → 暗角 → 细颗粒。
- 用途：判断**世界本身**有没有问题（布景的 look-lock 用它），开场和结尾用它。

### block 方块世界（MC 式，原创贴图）
- 几何：圆柱和球全部变长方体（`geometry.cyl/sphere → BoxGeometry`）。
- 着色：Lambert + 16px 像素纹理（按材质族生成），`NearestFilter`，uvUnit .48 → 1 texel ≈ 3cm。
- 光：sun 3.0，硬一点的阴影。后期：ACES + 饱和度 + 暗角，**不描边**。
- 禁止使用任何官方游戏素材；纹理全部程序生成。

### clay 黏土定格
- 几何：圆角团块，半径 = min(.07, 最小边×.32)。
- 着色：Standard + 指纹 bump（clayBump），饱和度×1.05，背景暖米色 #e9dccb。
- 光：暖色 key（#ffe6c8），sun 2.4 / hemi 1.25。
- 后期：8 采样景深，`coc = clamp(|d−focus|/d × 4) × 3`，焦点 = 相机到 target 的距离（`cam.userData.focus`）+ 暖色 grade。
- 节奏 8fps（on threes）——黏土片的手感一半来自这里。

### vox 纸片拼贴（Vox Media 解释视频风格）
- 着色：MeshToon 2 阶 + EDITORIAL 编辑部配色表（奶油底、砖红、墨蓝、草绿），饱和×1.35。
- 光：平，背景 #f0e2c6，关闭尘埃。
- 后期（顺序重要）：
  1. 撕纸边抖动（fbm 偏移，**固定不随帧变**：剪纸不会"沸腾"）
  2. 明度 3 阶海报化（保留色相）
  3. 纸层投影：左上更近的纸在右下投 9px 影，×0.58
  4. 白色切边（上层纸露出纸芯）
  5. 45° 网点印在暗部
  6. 墨线 + 红版错位 1–2px
  7. 纤维纸纹理
- 节奏：木偶 8fps + 相机步进。

### sketch 手绘线稿
- 着色：Lambert 淡彩；光平。
- 后期：
  1. **线条沸腾（line boil）**：描边采样坐标用 `hash(floor(uStep*12))` 抖动——每换一张画，线就重新画一遍；
  2. `edgeDN` 半径 1.6/1.1 → 石墨线；
  3. 马克笔淡彩 0.2（故意没对齐线）；
  4. 稀疏排线：亮度 < .42 一层、< .2 两层，间距 10px；
  5. 奶油纸 + 石墨颗粒。
- 节奏：12fps + 相机步进。这是"每一帧都像线画出来的"的关键：连续运动的相机会让线稿看起来像贴图。

### comic 赛博漫画（夜景）
- 用世界的 **night 变体**：只有霓虹、台灯、显示器、吊灯发光；远景换夜城。
- 着色：Toon 3 阶，霓虹增益 3。
- 后期：两圈霓虹辉光 → 靛蓝调色 → 中间调品红/青网点 → 粗墨线（edgeDN r2 + edgeC）→ 暗角。

### watercolor 水彩晕染
- 着色：Lambert，饱和×1.15（后期会冲淡）。
- 后期：UV 漂移（颜料没完全落在线里）→ 7 采样晕染 → 色块交界积色（深边）→ 暗部颗粒 → 冷压纸纹 → 淡铅笔底稿 → 画面边缘露白。

## 4. 选型决策表

| 片子/情绪 | 首选 | 备选 | 理由 |
|---|---|---|---|
| 科技/产品宣传、可信、质感 | diorama | clay | 真实光影 = 可信 |
| 年轻、游戏、搭建感、教程 | block | vox | 方块 = "可以自己搭" |
| 温暖、治愈、儿童、手工 | clay | watercolor | 指纹和暖光 |
| 知识解释、数据、新闻 | vox | sketch | 平面 + 网点 = 编辑部 |
| 创意过程、构思、草图、回忆 | sketch | watercolor | 线条 = 尚未完成 |
| 夜晚、赛博、紧张、黑客 | comic | block(夜) | 霓虹 + 墨线 |
| 抒情、季节、节日（中秋）、诗意 | watercolor | clay | 晕染 = 情绪 |
| 展示"同一件事多种风格" | 混剪 + 结尾 bands | — | 本 skill 样片 |

## 5. 加一个新画风

1. 复制最接近的画风文件，改 `id/label/zh/blurb/tags/accent`。
2. 按五层逐层决定：几何要不要处理？着色模型？布光（改 standardLights 参数还是全新）？后期 pass 列表？poseFps / cameraOnTwos？
3. `material()` 必须按 `sem.key` 缓存；先调 `specialMaterial`。
4. 后期只读 G-buffer 和 uniform；所有随机用 `hash/vnoise(uv, uStep)`，不要用时间以外的状态。
5. 在 `looks/index.ts` 注册；`screens.ts` 里给它一个缩略图；sandbox 查看器自动出现按钮。
6. 验收：sandbox 里 7 个机位各看一眼；抽 3 帧（最暗、最亮、特写）；对比其他画风的同一帧拼成 contact sheet——**如果和某个现有画风只差颜色，就不算新画风**。
7. 性能：单帧超过现有最慢画风 1.5 倍时，先减采样数，再考虑半分辨率 pass。

## 6. 各画风专属失败检查

| 画风 | 典型失败 | 检查 |
|---|---|---|
| diorama | AO 发脏、画面灰 | 暗部仍有细节；AO 只在接触缝 |
| block | 纹理密度不一致；圆的东西没变方 | 近看墙和杯子像素一样大；无圆柱残留 |
| clay | 景深虚掉主体；团块太圆像塑料 | 焦点在角色脸/手；边缘仍有体积 |
| vox | 网点太密变灰；纸边每帧抖（沸腾） | 暗部是清晰圆点；连续两张纸边一致 |
| sketch | 线太密成一团黑；淡彩盖线 | 头发/键盘区域可读；线在彩上面 |
| comic | 夜景太黑看不清人；辉光糊掉字幕 | 脸至少一侧受光；MG 区域无大块辉光 |
| watercolor | 晕染吃掉轮廓；纸边露白挡字幕 | 角色剪影可读；字幕区不在边缘白里 |
| 全部 | 尘埃在 2D 画风里像脏点 | 2D 画风 setup 里 `dust.visible=false` |

## 7. 调参速查

- 画面太灰 → 先查是不是 ACES 前曝光不足（乘 1.1–1.3），再调饱和。
- 描边太粗 → `edgeDN` 的 r 减小或 dThr/nThr 提高。
- 网点太抢 → 只印在 `l < 0.45` 区域，点间距 ≥ 6px。
- 景深太强 → coc 系数从 3 降到 2；焦点跟 camera target 走。
- 夜景太黑 → 给角色附近的台灯 intensity 1.6→2.2，而不是加全局环境光（会破坏夜感）。
