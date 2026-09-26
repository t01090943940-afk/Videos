# Acting：木偶、姿态、IK、连续性

## 目录
1. 木偶结构
2. poses.json
3. IK：三种接触
4. 表演轨：关键帧与循环
5. 时钟与步进
6. 连续性：状态与事件
7. inspect 探针与数字化验收
8. 扩展（站立、行走、口型）

---

## 1. 木偶结构（`runtime/rig.ts`）

6 块刚体，单位 PX = 0.055 m（像素比例的方头人偶）：

| 部件 | 尺寸 (PX) | 说明 |
|---|---|---|
| 腿 ×2 | 4×10×4 + 鞋 | 坐姿时屈膝 |
| 身体 | 8×12×4 | torso 旋转 [x,y,z]° |
| 头 | 8×8×8 | 眼、嘴、发型（beanie/bun/spiky/long…）、眼镜、耳机 |
| 手臂 ×2 | 4×7.5×4 | 肩关节旋转，末端手 3.6×3×3.6 |

- 手里有 **socket**（肩下 8.5PX）：可持有物挂在这里。socket 的四元数 = inv(身体·手臂) · Rx(tilt)，所以杯子不随手臂歪，`tiltR` 只做有意的倾斜（喝水 −25°，倒水 38°）。
- 坐姿髋高 = 椅面 + 2PX。
- 刚体 + 步进 = 定格感；不要加蒙皮，也不要把关节插值做得过于平滑。

## 2. poses.json

```jsonc
"hit_enter": {
  "base": "seated",                 // 继承
  "torso": [6, -4, 0], "head": [20, -6, 0],     // 度
  "handL": {"reach": "keyboard", "offset": [-0.1, 0, 0.02]},   // surface：落在键盘面上
  "handR": {"reach": "enter", "exact": true}                  // exact：指尖到回车键
},
"sip": { "base": "seated", "torso": [-6,0,0], "head": [-14,0,0],
  "handR": {"reach": "mouth", "offset": [0.05, -0.13, 0.03]}, "tiltR": -25 }
```

- `reach`：道具锚点名（在角色**自己的桌子**上查找）或 `mouth`。
- `offset`：相对锚点的米制偏移（左右手在键盘上分开 ±0.1）。
- `armL/armR` 直接给角度时不走 IK（挥手、欢呼）。
- 姿态库跟世界走（锚点是世界的词汇）；新世界要新锚点，就加新姿态。

样片用到的 34 个姿态：seated, seated_idle, seated_breathe, type_a/b, look_screen, anticipate_enter, hit_enter, cheer, cheer_b, reach_mug, hold_mug, sip, content, reach_sheet, show_sheet, study_sheet, point_up, draw_a/b/c, think, tap, lean_back, nod_a/b, point_screen, fist_pump, reach_can, lift_can, pour, admire, admire_can。

## 3. IK：三种接触

| 模式 | 用在 | 求解 |
|---|---|---|
| `surface` | 手放在桌面/键盘上 | 手的最低点落在目标平面上：对"肩为圆心、臂长为半径的圆"与平面求交；4 轮迭代，累积补偿 `(目标y − 手最低y)`，抵消手块四角下沉 |
| `exact` | 按键、握杯、拿纸 | 指尖（HAND_TIP = 8.5PX）精确到点：身体偏航 = atan2(局部x − 侧偏, z)×0.55，然后对手臂俯仰在 [−30°, 45°] 二分 |
| `free` | 到嘴边、举高、`lift` | 不约束支撑面 |

验收数字（样片实测）：surface 接触深度 ≥ −1.7mm；exact 误差 ≤ 2.5cm；穿插 0。

踩过的坑：把"指尖到目标的距离"当 exact 的指标会误导（手块是有体积的）→ 改用 `handDistance`（点到手的 OBB 的距离）。

## 4. 表演轨（`runtime/acting.ts`）

关键帧：`{actor, at, pose, ease}`，ease ∈ linear/inOut/in/out/**hold**（保持上一姿态直到这个时刻，再跳）。

循环：`{actor, loop, from, to, rate?}`，展开成关键帧：

| loop | 姿态 | 频率 | ease |
|---|---|---|---|
| typing | type_a, type_b | 3/s | hold |
| draw | draw_a, b, c, b | 4/s | hold |
| nod | nod_a, nod_b | 2.2/s | inOut |
| idle | seated_idle, seated_breathe | 0.8/s | inOut |

每个有意义的动作写成四段：
```
预备 anticipate (0.2–0.4s) → 动作 action (0.2–0.5s) → 反应 reaction → 停顿 hold (≥ 0.3s)
```
样片的"按回车"：look_screen → anticipate_enter（抬手、身体后仰）→ hit_enter（exact 到键，键帽按下）→ cheer / cheer_b 交替。

伸手拿东西：`reach_x`（inOut 到位）→ 同一姿态 `hold` 到事件时刻 → 事件把道具挂到手上 → `hold_x`。**拿起的那一帧，手必须已经在道具上**（inspect 验证）。

## 5. 时钟与步进

- `poseT = floor(t × poseFps + 1e-6) / poseFps`；姿态在 poseT 上采样，所以 12fps 画风每姿态 2 帧、8fps 3 帧。
- 同一帧的 IK 结果在所有画风之间共享（pose cache），分屏和 wipe 时不重复求解。
- 动作时长要是 hold 的整数倍才干净：8fps 下 0.375s = 3 张。
- `finalize.py` 的 stepping 检查：每个镜头内 poseT 的连续段长度必须一致（样片：12fps 画风全是 2，8fps 全是 3）。

## 6. 连续性：状态与事件

- 所有"世界里变了的东西"都是 `world.state` 的键；事件 `{t, set}` 在 `poseT ≥ t` 时生效。
- 状态逐镜累积：S04 拿起杯子 → S05 开始时杯子仍在手里 → S05 放回。validate 会模拟整条状态链，检查"一只手两件东西"和"从别人手里拿"。
- 派生优于存储：回车键按下 = 指尖距离 < 3.5cm；植物挺立动画 = 从 `plant.watered` 事件起算的时间（`sinceEvent`）。
- 声音读同一份事件：拿杯 = 瓷器轻碰，放下 = 碰 + 闷响（sound.md）。

## 7. inspect 探针

```bash
node scripts/capture.mjs --inspect 0:1440 --out out/qc/inspect.json
```
每帧一行：`{frame, shot, look, localFrame, poseT, sig{actor:"a>b@u"}, contacts[{actor, hand, mode, pose, gap, surface}], penetration[]}`。

- `sig` 的 `a>b@u`：当前在关键帧 a 和 b 之间，进度 u。`a == b` 表示"到位并保持"——音频用它派生打字声。
- 看表：`python3 -c` 读 json，筛 `penetration` 非空的帧、`surface < -0.01` 的接触、`exact` 且 `gap > 0.03` 的接触。

## 8. 扩展

- **站立/行走**：`seated:false` 站在 mark；行走 = 在 acting 里给 actor 位移关键帧（在 Puppet 根节点上插值位置，腿用 walk_a/b 姿态循环 on twos），脚步声在姿态到位帧派生。
- **口型**：头上已有 mouth 锚点；可加 mouth_open/closed 部件，按 VO 能量包络量化到 poseFps 切换。
- **表情**：眼睛是独立小块，可以按状态换形（眨眼 = 1 张 hold 的压扁）。
