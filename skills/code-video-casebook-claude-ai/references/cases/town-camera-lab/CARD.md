---
id: "town-camera-lab"
title: "小镇片场：摄影与运镜实验室（单文件交互 HTML）"
model: "不详"
folder: "（仓库根目录）town-camera-lab.html"
spec: "单文件交互网页（2177 行，223 KB）；实时预览 + 离线逐帧渲染镜头 / 延时 / 定格序列，可导出"
stack: ["Three.js r128（cdnjs）", "自写 HDR 渲染管线（expose 多子帧积分 + develop 显影着色器）", "32×24 对数测光读回", "Canvas 程序化贴图", "MediaRecorder / captureStream 录制 webm"]
genre: ["摄影 / 运镜教学", "虚拟摄影棚", "交互工具"]
look: ["欧洲小镇（钟楼、喷泉、面包店、环形路、邮差骑车）", "一天中任意时刻的日光与夜景", "相机取景器 HUD"]
techniques: ["世界动画是时间的纯函数 setWorldTime(t", "tod)", "手持微抖是时间的确定函数（曝光可积分）", "13 种运镜（推/拉/变焦推/摇/俯仰/移/跟/升降/环绕/希区柯克变焦/甩/荷兰角/移焦）每种一句\"本质区别\"", "景别与角度一键到位 + 自动识别景别", "物理相机：焦距/光圈/快门/ISO/白平衡/测光模式/照片风格", "景深 CoC 公式按真实传感器与焦距计算", "快门时间内多子帧积分 = 真实运动模糊", "自动对焦射线探测 + 人脸", "色温 Kelvin→RGB", "太阳高度角驱动光照与环境亮度", "定格动画模式 + 洋葱皮", "离线序列渲染（每帧先测光再曝光）", "静态网格合批"]
---

# 小镇片场 · 一个能"拿相机去拍"的 3D 小镇（摄影与运镜实验室）

> **一句话**：一个单文件 HTML：程序化生成的欧洲小镇（钟楼、喷泉、面包店、环形路、行人阿禾、骑车的邮差），你手里拿着一台**行为像真实无反相机**（Z50 式：AUTO/P/S/A/M、ISO 100–204800、白平衡、测光、照片风格、AF-S/AF-C/MF、连拍、自拍）的虚拟相机，能**一键演示 13 种运镜**（每种配一句本质说明，例如"变焦推：机位不动只改焦距，前后景比例不变——和推镜头的本质区别"），切景别与角度，调一天中的时刻，拍照片、录视频、做**延时与定格动画**（带洋葱皮）。

| 项 | 值 |
|---|---|
| 原位置 | 仓库根目录 `town-camera-lab.html`（无 CoExp、无源码包；本文件即全部源码） |
| 收录 | 源码 `assets/cases/town-camera-lab/town-camera-lab.html`（原样）· `FILES.md`；无预览图（交互页面，不是成片） |
| 依赖 | Three.js r128 走 cdnjs、字体走 Google Fonts；离线使用需改成本地文件 |

## 什么时候抄它

- 要在代码视频里**做"真实摄影机"的质感**：物理景深（按焦距/光圈/对焦距离算 CoC）、快门时间内的运动模糊、按测光自动曝光、色温白平衡、ISO 噪点——而不是贴一个 blur 滤镜。
- 要**讲解 / 演示运镜与景别**（教学片、拍摄指南、分镜预演），或需要 13 种运镜的**参数化实现**（`MOVES` + `buildMove(id, target)`）。
- 要一个**虚拟摄影棚**：先有可信的空间，再决定机位（与 atlas `knowledge/07-virtual-studio.md` 同一思路）。
- 要做**延时 / 定格**：`renderSequence({n, fps, setup})` 离线逐帧、`STOP` 定格模式与洋葱皮。

## 文件地图（`town-camera-lab.html` 行号）

| 行 | 模块 |
|---|---|
| L204–L262 | 依赖、常量（快门档位、`ISOS`、`LENSES`、传感器 23.5×15.7 mm / 1.5× 裁切、`MODES`、`PCS` 照片风格、`WBS`、`METERS`、`AFMODES`）、渲染器（HalfFloat HDR 目标） |
| L266–L352 | 程序化贴图（`buildTextures`、`signTex` 招牌、`stripeTex` 遮阳棚）与材质缓存、`boxM`/`planeM` 米制 UV |
| L354–L615 | 世界：地形 `terrainH`、环形路 `roadAt(s)`、房屋 `makeHouse`、窗户夜灯、钟楼、喷泉、道具、树、远景 |
| L616–L737 | 角色 `makePerson`（肢体枢轴）与 **`setWorldTime(t, tod)`：世界动画是时间的纯函数** |
| L746–L837 | 天空、太阳 `sunInfo(tod)`、`kelvinRGB(K)`、`ambientLog`、`applyTimeOfDay` |
| L839–L881 | `bakeStatic()` 静态网格合批 |
| L882–L1035 | 后期管线：`fsq`/`sMat`、**`developFrag`**（深度 → CoC 景深、ACES、白平衡、饱和/对比、单色、ISO 噪点、暗角、峰值对焦、斑马纹）、测光 `meterScene` / `meterRead` / `meterAWB` |
| L1037–L1095 | 相机机身：`lensAt(f)`、**`resolveExposure()`**（按模式从测光 EV 选光圈/快门/ISO） |
| L1096–L1150 | 操作者：碰撞、`shakeAt(t)` 手持微抖（确定性）、`poseSensor(t)`、三脚架/稳定器/手持 |
| L1151–L1237 | 自动对焦（射线探测 + 人脸）与第一人称手持相机模型 |
| L1238–L1303 | 实时渲染、多机位监视器、直方图 |
| L1304–L1366 | 快门、`frameTimes(t0,t,K)`（快门内 K 个子帧）、曝光任务队列、照片元数据 |
| L1367–L1403 | **定格动画 `STOP`（洋葱皮）** 与 **离线序列渲染 `renderSequence`**（每帧：定世界时间 → 测光 → 对焦 → 曝光积分 → 显影 → 读回 → JPEG） |
| L1404–L1426 | 实时录像（MediaRecorder / webm） |
| L1427–L1497 | **导演：`TARGETS` + `MOVES`（13 种运镜，含一句话原理）+ `buildMove`** |
| L1498–L1543 | 景别 `goShotSize` / 角度 `goAngle` / 自动识别景别 `detectShotSize` |

## 最值得抄的做法

1. **一切时间相关的东西都是时间的函数**：世界（行人、邮差、喷泉、钟）用 `setWorldTime(t)`，手持抖动也是 `shakeAt(t)`，所以同一帧可以在快门时间内取多个子时刻积分出真实运动模糊。
2. **相机按物理量工作**：景深 CoC = `A·f·|S−D| / (D·(S−f))` 换算到像素；曝光从测光 EV 反解；色温走 Kelvin→RGB；这些让"电影感"来自原理而不是滤镜。
3. **每种运镜配一句"本质区别"**（推 vs 变焦推、摇 vs 移、希区柯克变焦），适合直接做教学字幕。
4. **离线序列和实时预览共用同一管线**，离线时每帧重新测光、对焦——延时摄影里天色变化时曝光自然跟随。

## 注意

- 这是交互工具不是成片：要出视频，用 `renderSequence` 的思路（或 Playwright 驱动它）逐帧导出后交给 ffmpeg。
- Three.js r128 较旧（`outputEncoding`/`sRGBEncoding` 等 API 在新版已改名）；移植到新版需要改色彩空间相关代码。
