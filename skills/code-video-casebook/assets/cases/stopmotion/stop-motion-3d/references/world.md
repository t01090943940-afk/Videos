# World：持久的 3D 沙盒世界

## 目录
1. 世界由什么组成
2. world.json 字段
3. 道具契约（PropBuild）与锚点
4. 语义材质与 Prims
5. 布景：墙、窗、远景、wild walls
6. 灯光句柄契约（画风依赖它）
7. 可持有物与世界状态
8. 命名机位的摆法
9. WorldHooks：世界和 runtime 的胶水
10. 在 sandbox 查看器里检查世界
11. 新世界的步骤（例：工地、教室）
12. 系列复用的规则

---

## 1. 世界由什么组成

| 部件 | 在哪里 | 说明 |
|---|---|---|
| 调色板 | `src/world/palette.ts` | 语义色名 → 颜色（`wood`、`plaster`、`skin`…），画风会再调色 |
| 道具库 | `src/world/props.ts` | 可复用的道具生成函数，返回 group + 锚点 |
| 布景构建 | `src/world/studio.ts` | 房间、墙、窗、远景、灯、粒子；按 manifest 摆桌子、椅子、木偶 |
| 远景画布 | `src/world/backdrop.ts` | 画出来的城市天际线（日/夜），电视 logo |
| 清单 | `src/world/world.json` | 桌子/道具摆放、角色、标记点、机位、状态、变体 |
| 姿态库 | `src/world/poses.json` | 角色姿态（跟着世界走，因为锚点是世界的） |
| 胶水 | `src/world/hooks.ts` | 告诉 runtime 如何 build/update/beforeRender 这个世界 |

单位：米。地面 y=0，+y 向上，镜头默认从 +z 看向 −z（后墙在 z=−5）。

## 2. world.json 字段

```jsonc
{
  "id": "studio", "title": "Dev loft",
  "variants": ["day", "night"],                    // 画风选择 variant；也可在 shot 上覆盖
  "state": { "hold.mug": "home", "rin.pour": false, "plant.watered": false },
  "holdables": { "mug": {"desk": "desk2", "home": "mug_home"} },
  "desks": {
    "desk2": { "x": -3.3, "z": 0.4, "actor": "mia", "chair": "#b5652b",
      "items": [ {"type": "desk", "at": [0, 0]},
                 {"type": "keyboard", "at": [0, -0.23]},
                 {"type": "mug", "at": [0.42, -0.14], "params": {"color": "#e0663f", "holdable": true}},
                 {"type": "plant", "at": [-0.6, 0.05], "y": 0.75, "params": {"size": 0.9, "seed": 5}} ] } },
  "marks":   { "desk2.seat": {"pos": [-3.3, 0, -0.16], "yaw": 0} },
  "cameras": [ {"id": "CAM_MIA_FRONT", "role": "character", "fov": 38,
                "from": {"pos": [-1.15, 1.72, 1.55], "target": [-3.38, 1.12, -0.12]},
                "to":   {"pos": [-1.5, 1.62, 1.28],  "target": [-3.38, 1.12, -0.12]}, "ease": "inOut"} ],
  "actors":  { "mia": {"name": "米娅 Mia", "mark": "desk2.seat", "desk": "desk2", "seated": true, "ambient": "typing",
               "costume": {"skin": "#f0c29c", "hair": "#e3a33a", "top": "#f2e2c4", "bottom": "#5a4636",
                           "hairStyle": "bun", "glasses": false, "headphones": false}} }
}
```

要点：
- 桌面道具坐标 `at: [x, z]` 是**相对桌子**的，`y` 省略时为 0（道具自己知道放在桌面高度）；放在桌面上的"落地型"道具（植物）要写 `"y": 0.75`。
- `marks` 是角色站位。角色的 `seated: true` 会根据椅子座面高度自动求髋部高度。
- `state` 里每个键都必须**先声明初值**，episode 事件只能改已声明的键（validate.py 会查）。

## 3. 道具契约（PropBuild）与锚点

```ts
type Build = (P: Prims, params: Record<string, any>) => PropBuild;
interface PropBuild {
  root: THREE.Group;
  anchors: Record<string, THREE.Object3D>;   // IK 目标、可持有物的家
  holdables?: Record<string, THREE.Object3D>;// 可以被拿起的物件
  parts?: Record<string, THREE.Object3D>;    // 被状态驱动的部件（叶子、键帽、灯）
}
```

写道具的规则：
1. **只用 `P.box / P.cyl / P.sphere / P.plane`** 和语义材质字符串。不要 `new MeshStandardMaterial`——那样画风就管不到它。
2. 需要被手碰到的地方放**锚点**（`keyboard`、`enter`、`mug_home`、`mug_grip`、`stack`、`tablet`、`plant`、`spout`）。锚点名是姿态库的词汇表。
3. 需要做穿插检查的面加 `{collider: true}`（桌面、键盘、显示器、座面、平板）。
4. 会动的部件加 `{dynamic: true}`，否则会被 `bakeStatic` 合批后无法移动。
5. 道具内的随机只用 `rng(params.seed)`。

内置道具：desk, chair, monitor(screen N), keyboard(可按下的回车键), mouse, mug(可持有), lamp(点光), plant(浇水后挺立), cubeToy, paperStack(可持有的纸), tablet(+stylus), wateringCan(可持有, spout 锚点), neonSign, can, speaker, brushJar, stickyNotes。

## 4. 语义材质与 Prims

世界说"这是什么"，画风决定"长什么样"：

| 写法 | 含义 |
|---|---|
| `"wood"` | 调色板里的 wood 色 + 木头类材质 |
| `"cloth:#e0663f"` | 布料类，指定颜色 |
| `"screen:2"` | 第 2 块屏幕（显示 episode.screens["2"] 那个画风的实时缩略图） |
| `"neon:#ff3fa4"` | 自发光，夜间增强 |
| `"glow"`, `"backdrop"`, `"sky"`, `"tv"`, `"glass"` | 特殊材质，由 `looks/common.ts` 的 `specialMaterial` 统一处理 |

`makePrims(look, palette, registry)` 为每个画风生成一套 Prims：画风可以覆盖几何（方块化、圆角化），并按世界尺寸生成 UV（`uvUnit` 米一块纹理），所以一块 3m 的墙和一块 0.3m 的盒子纹理密度一致。

## 5. 布景：墙、窗、远景、wild walls

- **远景是画的**：`cityBackdrop(day|night)` 生成 2048×768 画布，挂在后窗外 z=−22 的平面上。永远不要建模"无限远"。
- **窗**：墙上开洞 + 竖梃 + 半透明玻璃。阳光从窗射入，配合"光柱"平面（beams，加法混合）和尘埃粒子。
- **wild walls**：电影棚里可拆的墙。相机在墙外（例如结尾拉远到 z=12）时，这面墙和天花板自动隐藏（`updateWildWalls` 按相机位置和墙的法线判断）。这样一个封闭的房间也能拍外部全景。
- 前墙挂 6 张风格海报和白板，左墙有电视和书架——角色特写的反打镜头里都有东西可看。

## 6. 灯光句柄契约（画风依赖它）

画风的 `setup()` 通过 `ctx.handles` 调光，所以**任何世界都必须提供同名句柄**：

```ts
sun: DirectionalLight          // 主光（投影 2048）
hemi: HemisphereLight          // 天空/地面环境光
bounce: DirectionalLight       // 反弹补光
beams: Object3D[]              // 光柱平面（ShaderMaterial，uniform uStrength）
practicals: { lamps, neon, pendants: PointLight[] }   // 实景灯：夜景开，白天 visible=false
dust: Points                   // 尘埃（2D 画风会隐藏）
```

`standardLights(ctx, {sun, hemi, bounce, beams, warm})` 是日/夜的通用布光；各画风在它之上微调。新世界如果没有台灯，就给空数组，不要删字段。

## 7. 可持有物与世界状态

- 可持有物在 `world.holdables` 登记：属于哪张桌子、家锚点是谁。
- 它挂在哪**只由状态决定**：`hold.mug = "home"` → 挂回家锚点；`"mia.R"` → 挂到 mia 右手的 socket。
- 手里的朝向由 `HOLD` 表的偏移/旋转决定（studio.ts）。socket 的四元数会抵消手臂旋转，所以杯子始终直立，纸始终朝向镜头，不会侧着变成一条线。
- 其他状态：`plant.watered`（叶子挺立的动画从事件时刻开始算）、`rin.pour`（水滴粒子）。回车键被按下不是状态，而是从指尖到键的距离 < 3.5cm 派生出来的——能派生的就不要存。

## 8. 命名机位的摆法

每个角色至少两台机：
- `CAM_<ACTOR>_FRONT`：斜前方 3/4 正面，fov 38，从 (x+2.15, 1.72, 1.55) 看 (x−0.08, 1.12, −0.12)，缓推到 (x+1.8, 1.62, 1.28)。看脸和手。
- `CAM_<ACTOR>_OTS`：右后方过肩，fov 40，从 (x+1.4, 1.78, −1.7) 看 (x+0.2, 1.0, 0.58)。看屏幕上的画风缩略图——**这是"这个角色在用这个画风"的证据镜头**。

另有 `CAM_EST`（开场全景，从右后上方）、`CAM_END`（结尾从前方拉远到墙外）、`CAM_THUMB`（role=`monitor-content`，只用来渲染显示器里的缩略图，不拍正片）。

规则：机位 = 世界的一部分，不在 episode 里临时造。要新角度就在 world.json 加一台并起名。`from`/`to` 相同就是固定机位。

## 9. WorldHooks：世界和 runtime 的胶水

```ts
interface WorldHooks<H> {
  build(P, variant, registry): H;                 // 每个画风调用一次，造一份世界副本
  update(h, state, shot, time): void;             // 每帧：按状态挂道具、驱动部件、粒子
  beforeRender(h, camera): void;                  // 每帧：wild walls、按相机的可见性
}
```

runtime 为每个用到的画风各 build 一份世界（材质不同），所以 update 必须是**纯状态驱动**，不能依赖上一帧。

## 10. 在 sandbox 查看器里检查世界

```bash
npm run build && python3 -m http.server -d web 8080   # 打开 http://localhost:8080/sandbox.html
```
- 鼠标环绕真实布景；切换 7 个画风；显示所有机位视锥和标记点；
- 切到 shot 模式按镜头看；拖动时间轴，右侧面板显示此刻世界状态；
- 和成片同一个 runtime，看到的就是会渲染的。

## 11. 新世界的步骤（例：工地安全宣传片、教室、厨房）

1. 复制 `src/world/` 为新目录或直接改：
   - `palette.ts` 加新语义色（`concrete`、`steel`、`hivis`、`soil`…）。
   - `props.ts` 加新道具（脚手架、安全帽、吊车钩、护栏…），遵守 §3 规则，放好锚点和 collider。
   - `studio.ts` 改房间：室外场景就不要墙，改地面 + 远景画布（`backdrop.ts` 画工地天际线）+ 太阳角度。
2. 保留 §6 的灯光句柄名（没有的给空）。
3. 写 world.json：摆放、角色、标记、每个角色两台机 + 开场/结尾机、状态初值。
4. 姿态：新动作（戴安全帽、扶栏杆、指向）加进 poses.json，`reach` 指向新锚点。
5. 在 sandbox 里环绕检查；`validate.py` 通过；每台机抽一帧看构图。
6. 7 个画风自动可用；只有需要夜景或特殊天气时才动画风参数。

角色不是必须坐着：`seated: false` 时站在 mark 上；行走需要在 acting 里给 mark 间的位移（扩展方法见 acting.md）。

## 12. 系列复用的规则

- 世界的**名字是 API**：机位 id、锚点名、状态键、道具 type 一旦被剧集引用就不改名；要改就加新的、旧的留着。
- 改了共享道具后做视觉回归：旧版本抽帧 → 改 → 同帧重渲 → `compare_frames.py before after --threshold 0.5`。
- 每条剧集的开头状态来自 `world.state`；续集要从上集结尾状态开始，就在新 episode 的第一个镜头 t=0 放事件设置状态。
- 人物外观（costume）是世界的一部分，剧集里不改；需要换装就定义新 actor 或加状态驱动的配件。
