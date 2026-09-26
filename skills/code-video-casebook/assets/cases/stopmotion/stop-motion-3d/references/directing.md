# Directing：剧集、节拍、机位、转场、MG

## 目录
1. episode.json 完整字段
2. 8 节拍与时长缩放
3. 戏剧句与英雄道具
4. 镜头语法（机位、运动、轴线）
5. 转场：cut / wipe / bands
6. MG 图层（定格表演，MG 解释）
7. 片型模板：宣传混剪 / 知识讲解 / 剧情短片与漫剧 / 公益提示
8. 写镜头表的顺序

---

## 1. episode.json 完整字段

```jsonc
{
  "title": "stop-motion-3d · skill intro",
  "world": "studio",            // 必须等于 world.json 的 id
  "fps": 24, "width": 1280, "height": 720,
  "screens": {"1": "block", "2": "clay"},   // 显示器 N 显示哪个画风的缩略图（0 号 = 电视 logo）
  "shots": [ Shot, ... ]
}
```

Shot：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✓ | `S01`… 唯一 |
| `beat` | ✓ | world / character / problem / opportunity / decision / work / turn / result / echo |
| `story_function` | ✓ | 一句话：这个镜头为什么存在。写不出来就删掉这个镜头 |
| `duration` | ✓ | 秒；帧数 = round(duration × fps) |
| `camera` | ✓ | world.cameras 的 id |
| `look` | ✓ | 画风 id |
| `variant` |  | 覆盖画风默认的 day/night |
| `transition` |  | `{type:"wipe", from:<上一镜画风>, frames:14}`；缺省 = 硬切 |
| `acting` |  | 关键帧 `{actor, at, pose, ease?}` 或循环 `{actor, loop, from, to, rate?}` |
| `events` |  | `{t, set:{state:value}}`，在步进时钟上触发 |
| `state` |  | 本镜头开始时强制设置的状态（续集/跳切用） |
| `mg` |  | MG 条目，见 §6 |
| `bands` |  | `{looks:[...], start, stagger}` 分屏并列多画风 |

没有写 acting 的角色会自动得到"环境表演"（按种子错开的打字循环），背景永远是活的。

## 2. 8 节拍与时长缩放

```
world → character → problem/opportunity → decision → work → turn → result → echo
0-7s     7-14        14-22                 22-30       30-38   38-46   46-54    54-60
```

- 15s：world + (decision+work) + result，3–4 镜。
- 30s：5–6 镜，character 和 turn 可合并。
- 60s：8–14 镜，**最稳的档位**。
- 90–180s：把节拍**展开成更多镜头**（12–17 镜），不是拉长静帧。每个节拍演完后的无台词静止预算 ≤ 3 帧；后期再砍是反面教材（有片子事后从 184s 砍到 104s）。

结尾与开头押韵：空→满、暗→亮、一个→全部、静→动。样片：开头"一间房、六台显示器各显示一种风格"，结尾"同一间房拉远，分成六条画风并列"。

## 3. 戏剧句与英雄道具

写镜头表之前先写两句：
```
情绪句：看完观众应该感到 ___，因为 ___ 变了。
戏剧句：[角色] 想要 [具体目标]，但是 [阻碍]，于是 [这个媒介特有的动作]，导致 [可见变化]，留下 [情绪结果]。
```
英雄道具 = 世界逻辑 + 视觉焦点 + 情绪符号，早引入、结尾改变状态（样片里：琳的植物，浇水后挺立）。

## 4. 镜头语法

- **机位**全部来自 world.json；每个角色至少 FRONT（3/4 正面，看脸和手）+ OTS（过肩，看屏幕）。
- **运动**只做缓推、缓拉、平移、微摇；`from == to` 是固定机位。禁止恒速环绕、无动机变焦、自由飞行。
- **轴线**：全片守同一侧；角色在画面的左右不变；视线匹配。
- **景深层次**：前景遮挡物（桌角、植物）– 主体 – 背景（墙、窗、远景）。
- 镜头时长：动作镜 3–5s；信息镜（有 lower third）≥ 4s，字幕在屏 ≥ 1.2s（validate 会警告）；全景 5s 左右。
- 一个镜头只讲一件事：一个动作 + 一条信息。

## 5. 转场

| 类型 | 用在 | 成本 |
|---|---|---|
| 硬切 | 同画风内换机位 | 1× |
| wipe（14 帧，噪声斜边，强调色描边） | 换画风 | 转场期间 2× |
| bands（最多 6 条 + 底图） | 结尾对比、"一种世界多种画风" | 最多 7× |

wipe 期间两个画风渲的是**同一帧同一机位**，所以边界上物体完全对位——这就是"世界在换画风"的观感来源。`from` 必须是上一镜的画风。

bands 从 `start` 秒开始、每 `stagger` 秒揭开一条，配 `bandLabels` MG；结尾标语在所有条揭开之后出。

## 6. MG 图层（`runtime/mg.ts`，连续时钟）

| kind | 位置 | 字段 |
|---|---|---|
| `title` | 居中 | text, sub, size(86), y(.42), panel(半透明底), subSize, subGap, color |
| `chip` | 左上 | text（"03 / 06"），color |
| `lower` | 左下 | text（大字名）、sub（英文行）、tags（小字标签行）、color |
| `note` | 右上 | text、sub（谁在做什么 / 一条原理） |
| `bandLabels` | 各分屏底部 | labels[] |
| `mark` | 右下水印 | text |

所有条目都有 `from/to`（镜头内秒）和 0.35s 淡入淡出（`fade` 可改）。

原则：
- **定格表演，MG 解释**。角色不"讲话"，信息靠 MG；MG 不遮手和脸（lower 在左下，所以角色机位让人物偏右）。
- 字号：主标题 86px、lower 50px、note 22px（1280×720）。浅字加阴影，复杂背景加 panel。
- 中文字体：Noto Sans CJK SC（capture 页面会等字体加载完）。

## 7. 片型模板

### A. Skill / 产品宣传混剪（样片，60s）
| 段 | 时长 | 镜头 |
|---|---|---|
| world | 5s | CAM_EST 全景，title："一个世界，七种画风" |
| 每个角色 × 6 | 7.5s | FRONT 4.5s（wipe 进场；chip + lower + note）→ OTS 3s（note 讲一条原理） |
| echo | 10s | CAM_END 拉远 + bands 六画风 + 标语 + 片尾音乐停顿 |

每个角色在 FRONT 里做一件和画风气质相符的事（按回车欢呼 / 端杯喝 / 抽稿纸 / 画板 / 点头指屏 / 浇花），事件驱动道具。

### B. 知识讲解（60–90s，单画风 vox 或 sketch）
world → 问题（角色卡住，note 写问题）→ 三个步骤（每步一个 OTS，屏幕显示结果，lower 写步骤名）→ turn（关键洞见，title）→ result → echo。节奏更慢，信息镜 5–6s。

### C. 剧情短片 / 漫剧（单集 60–180s）
- 单画风为主（comic、clay、watercolor 常用），画风切换只用于"回忆/幻想/梦"。
- 用 variant 做时间：白天→夜晚。
- 连续性全部写成状态事件；续集第一镜用 `state` 接上集结尾。
- 对白：MG note/字幕 + 头部动作；需要配音时 VO 实测时长写回镜头时长（sound.md）。

### D. 公益 / 安全提示（30–60s）
错误示范（comic 或 block，夜/危险）→ 后果停顿（静默）→ 正确做法（diorama 或 clay，白天）→ 口号 title。新场景（工地等）按 world.md §11 建。

## 8. 写镜头表的顺序

1. 情绪句 + 戏剧句。
2. 节拍表：每个节拍一行，写 story_function。
3. 分配机位（缺机位先去 world.json 加）和画风。
4. 表演：每个镜头一个动作，按 预备→动作→反应→停顿 写关键帧。
5. 事件（道具挂点）和 MG。
6. `validate.py --timeline` 读一遍；`capture.mjs --frames` 抽故事板。
