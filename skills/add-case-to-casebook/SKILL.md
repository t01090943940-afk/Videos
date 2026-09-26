---
name: add-case-to-casebook
description: 把一个新的代码视频案例整合进 AI-Coding-SuperVideos 仓库的 code-video-casebook Skill。当拿到新视频的 CoExp 复盘 md 和源码包（zip / tgz / 目录 / 单个 html；可附成片 mp4 仅用于生成预览图），并被要求"新增案例 / 收录进案例库 / 整合进 code-video-casebook / add a case to the casebook"时使用。内含完整 SOP：登记 CASES、生成 20 帧预览图、写 CARD.md、更新 catalog / pipelines / techniques / playbook 汇总索引、一致性校验、重新打包两个 .skill 分发包。
---

# 任务：把一个新的代码视频案例整合进 code-video-casebook Skill

你在仓库 AI-Coding-SuperVideos 里工作。仓库里的 `skills/code-video-casebook/` 是一个 Agent Skill（Anthropic 标准结构），已经收录 31 个代码视频案例。现在要把一个新视频整合进去。我会提供：
- 新视频的 **CoExp 复盘文件**（.md）；
- 新视频的 **源代码**（zip / tgz / 目录 / 单个 html 都可能）；
- 可能还有成片 mp4，只用来生成预览图，**不收录进 Skill**。

**路径约定**：本文件所有路径都是**相对仓库根目录**的相对路径；`references/`、`assets/`、`scripts/` 单独出现时，指 `skills/code-video-casebook/` 内部。脚本一律由 `__file__` 定位仓库，不使用绝对路径，换机器、换环境都能跑。

**环境依赖**：`python3`（无第三方包）；有成片时需要 `ffmpeg` / `ffprobe`。

## 最高原则（任何一步都不能违反）
1. **CoExp 必须原封不动**：不改一个字，不改编码，不改换行。只允许由脚本逐字节复制。
2. **源码必须原样解压**：由 `tools/build_casebook.py` 解压，逐字节等于原档案，sha256 记录进 `references/index.json`。不许手动复制、格式化或删改源码。
3. **不收录视频和音频**。超过 1 MB 的二进制文件、QA 截图由脚本自动排除，并写进 FILES.md 的"未收录"表。
4. **手写文件只有这些**：新案例的 `CARD.md`，以及 `SKILL.md` 和 `references/{catalog,pipelines,techniques,playbook}.md` 里的新增条目。其余文件全部由脚本生成，不要手改（`CoExp.md`、`FILES.md`、`preview.jpg`、`index.json`、`inventory.md`、`assets/cases/**`）。
5. **不许编造**：CARD 里写的每个事实、参数、文件路径、行号，都必须能在 CoExp 或源码里找到。不确定就不写。
6. **不要改动其他 31 个案例**的任何文件。

## SOP

### 第 0 步：了解现状（只读）
- [ ] 读 `skills/README.md`、`skills/code-video-casebook/SKILL.md`，以及 `tools/build_casebook.py` 顶部说明和 `CASES` 列表。
- [ ] 至少读两张现有卡片当范本，推荐 `references/cases/protocom/CARD.md`（有源码）和 `references/cases/studysolo/CARD.md`（只有 CoExp）。
- [ ] 运行 `python3 skills/code-video-casebook/scripts/casebook.py verify`，确认基线显示 OK。

### 第 1 步：把原始文件放进仓库
- [ ] 在仓库根目录新建案例文件夹，命名沿用现有规则：`<模型前缀>-<英文短名>`，例如 `opus-xxx`、`gpt-xxx`、`kimi-xxx`、`swe-xxx`。
- [ ] 把 CoExp（.md）和源码档案原样放进去，**文件名保持原样**（中文名可以）。
- [ ] 成片 mp4 如果有，也可以放进去：`.gitignore` 已经忽略 `*.mp4`，不会被提交。

### 第 2 步：生成预览图（20 帧联系表）
- [ ] 如果有成片，从中均匀抽 20 帧，拼成 5 列 × 4 行，存为 `<案例文件夹>/preview-sheet.jpg`（这个 jpg 要提交）：
  ```bash
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 成片.mp4)
  ffmpeg -y -i 成片.mp4 -vf "fps=20/$D,scale=384:-2,tile=5x4:padding=0" -frames:v 1 -q:v 3 <案例文件夹>/preview-sheet.jpg
  ```
- [ ] 打开这张图看一眼，确认画面正常、不是黑帧。
- [ ] 如果没有成片：跳过这一步，CARD 里也不要放预览图那一行。

### 第 3 步：在构建脚本里登记案例
在 `tools/build_casebook.py` 的 `CASES` 列表末尾追加一项，参考已有写法：
```python
Case("<id>", "<中文片名（一句话特征）>", "<案例文件夹>",
     coexp="<案例文件夹>/<CoExp 文件名>.md",
     sources=[("zip", "<案例文件夹>/<源码>.zip", {})],   # 类型: zip / tgz / dir / file
     preview_from="<案例文件夹>/preview-sheet.jpg",
     notes={"*audio/*.wav": "配乐：由 xxx.py 生成"}),     # 可选：说明被排除的文件怎么补回
```
- [ ] `id`：只用小写字母、数字、连字符，简短好记，不能和已有 id 重复（`casebook.py list` 可查）。
- [ ] 源码有多个档案时，就在 `sources` 里列多项。
- [ ] 解压路径（mount）：zip 里只有一个顶层目录时默认直接用它；解压后路径奇怪时，用 `{"mount": ""}` 或 `{"mount": "xxx/"}` 调整，参考 `f12`、`oneink`。
- [ ] 没有源码时：不写 `sources`（参考 `phasegate`）。
- [ ] `.skill` 文件本质是 zip，类型按 `zip` 填（参考 `stopmotion`）。

### 第 4 步：生成并检查
- [ ] 运行 `python3 tools/build_casebook.py`，看输出里新案例这一行：`coexp=Y`、`files=N`、`omitted=M`、`preview=Y` 是否符合预期。
- [ ] 打开 `references/cases/<id>/FILES.md`，逐条确认：
  - 该收的源码文件都在；
  - "未收录"里只有视频、音频、大文件或 QA 图，每条都有"如何补回"的说明。缺说明的，回第 3 步补 `notes`。
- [ ] 运行 `python3 skills/code-video-casebook/scripts/casebook.py files <id>`，确认 `show` 和 `search` 能读到新文件。
- [ ] 运行 `cmp` 或 `sha256sum`，确认 `references/cases/<id>/CoExp.md` 与原 CoExp 逐字节一致。

### 第 5 步：认真读完原文
- [ ] **完整读完** CoExp（`casebook.py show <id> CoExp.md --lines a:b`，分段读）。
- [ ] 读源码的入口文件：渲染器、时间线、场景、配乐、构建脚本。
- [ ] 记下这些信息：
  - 规格：分辨率、fps、时长、BPM、体积；
  - 技术栈；
  - 叙事主线与母题；
  - 结构（段落 / 时间表）；
  - 关键技法及其所在文件；
  - 怎么运行；
  - 坑的条数和最重要的几条；
  - CoExp 各主要章节的行号；
  - "流程模板""开工提示词模板"所在的行号。

### 第 6 步：写 `references/cases/<id>/CARD.md`
格式必须与现有卡片一致：
- [ ] **frontmatter**：每个值都用 JSON 写（这样同时是合法 YAML，`casebook.py list` 也能读）：
  ```yaml
  ---
  id: "<id>"
  title: "<片名（一句话特征）>"
  model: "<Claude Opus / GPT / Kimi / SWE / 不详>"
  folder: "<案例文件夹>"
  spec: "1920×1080 · 60fps · 57s（120 BPM）"
  stack: ["...", "..."]
  genre: ["...", "..."]
  look: ["...", "..."]
  techniques: ["...", "..."]
  ---
  ```
- [ ] **正文章节依次为**：
  1. `# 标题`
  2. `![20 帧联系表](preview.jpg)`（仅当有预览图）
  3. `> **一句话**：…`（主线 + 从头到尾的镜头走向）
  4. 信息表：原目录 / 成片 / 制作 / 收录。收录一格写 `CoExp.md（N 行）`，N 取 `references/index.json` 里该案例的 `coexp.lines`。
  5. `## 什么时候抄它`
  6. `## 架构`（有源码时）或 `## 结构`（只有 CoExp 时）
  7. `## 可直接抄的代码`（只有 CoExp 时，指向 CoExp 章节）或 `## 文件地图`（有源码时）
  8. `## 怎么跑`：第一行必须是 `python3 scripts/casebook.py copy <id> work/<id> && cd …`。缺的素材要写明怎么补。
  9. `## 最值得抄的做法`：6–9 条
  10. `## 坑（CoExp §x 共 N 条，节选）`
  11. `## CoExp 导读（行号）`：格式为 `L<行号> 章节名 · …`，行号必须精确指向该章节标题所在行。
- [ ] **路径写法**：源码路径一律写成相对 `assets/cases/<id>/` 的路径，例如 `promo/src/main.js`。

### 第 7 步：更新汇总索引（只增加，不改动已有条目的含义）
- [ ] **`skills/code-video-casebook/SKILL.md`**：
  - 在合适分组的路由表里加一行：`| [<id>](references/cases/<id>/CARD.md) | ✅/📄 | 什么时候抄它 |`；
  - frontmatter 的 description 和正文里的案例总数加 1（`grep -n "31" SKILL.md` 找出所有位置）；
  - description 仍然要 ≤ 1024 字符，不能出现尖括号标签；
  - 正文保持在 500 行以内。
- [ ] **`references/catalog.md`**：
  - 总表加一行；
  - 在"按用途 / 画幅时长 / 技术栈 / 视觉风格 / 素材 / 声音 / 约束"各节中，凡相关的都加上新 id；
  - 把"31 个案例"改成新的总数。
- [ ] **`references/techniques.md`**：新案例里有代表性的技法，加到对应分类里。格式为 `技法 | 案例 | 位置`，位置写 `<id>/路径` 或 `<id> CoExp L行号`。
- [ ] **`references/pipelines.md`**：如果新案例用了已有管线，在该管线表里加一行"要抄的文件"；如果是全新的技术栈，新增一节（骨架 + 文件 + 坑），并更新目录。
- [ ] **`references/playbook.md`**：
  - §9 模板表加一行（流程模板和开工提示词模板的行号）；
  - 如果新 CoExp 的坑印证了 Top 30 里的某一条，就在该条的"出现在"一栏补上 id。
- [ ] **`skills/README.md`**：打包后更新两个包的文件数和体积。
- [ ] **不要修改** `00-supercut-trailer`（合集总片是原作品）。

### 第 8 步：重新打包并全面验证
- [ ] 运行 `python3 tools/build_casebook.py --zip`。
  - claude.ai 版的文件数必须 ≤ 200（超了脚本会报错停下）；
  - 标准版解压后要在 30 MB 以内；
  - 产物在 `skills/dist/`。
- [ ] 运行 `python3 skills/code-video-casebook/scripts/casebook.py verify`，必须全部 OK。
- [ ] 运行一致性检查脚本，必须输出 `ALL OK`：
  ```bash
  python3 skills/add-case-to-casebook/scripts/check_consistency.py
  ```
- [ ] 把 `skills/dist/` 下两个 `.skill` 分别解压到临时目录，在每个里面运行：
  - `list`
  - `search "<新案例里的一个关键词>"`
  - `show <id> CoExp.md --lines 1:5`
  - `copy <id> /tmp/x`
  - `verify`

  两个包都要正常，而且两版拷出来的文件 sha256 必须一致。
- [ ] 执行 `git status`，确认改动只有这些：新案例文件夹（不含 mp4）、`tools/build_casebook.py`、`skills/code-video-casebook/` 下新案例的文件和上述汇总文件、`skills/dist/` 两个包。

### 第 9 步：提交与汇报
- [ ] 按仓库约定的分支提交并推送。提交信息写清：新增了哪个案例、收录了多少文件、哪些文件未收录及原因。
- [ ] 向我汇报以下内容：
  - 新案例 id；
  - 收录 / 未收录的文件数与体积；
  - 两个包新的文件数与体积；
  - 验证结果；
  - 你不确定、需要我确认的地方（例如源码缺文件、CoExp 与源码对不上、事实存疑）。

## 常见错误（别犯）
- 手动把 CoExp 复制进 `references/`，或"顺手修正"CoExp 里的错别字。
- 手写或手改 FILES.md、index.json，或者跳过生成脚本直接往 `assets/cases/` 里拷文件。
- CARD 里的行号是凭记忆写的。必须用 `show … --lines` 核对，确认每个行号都指向章节标题所在行。
- frontmatter 的值没有用 JSON 引号（`@`、`:`、引号会让 YAML 解析失败）。
- 路由表里漏了新案例，或者忘了更新案例总数。
- 把成片、音乐、大字体提交进仓库。
