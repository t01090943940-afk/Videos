# skills/

## code-video-casebook

本仓库 31 个代码视频案例封装成的 Agent Skill（遵循 Anthropic Agent Skills 结构：`SKILL.md` + `scripts/` + `references/` + `assets/`）。

- 每个案例的 **CoExp 复盘原文**：`code-video-casebook/references/cases/<id>/CoExp.md`（逐字复制）
- 每个案例的 **原始源码（已解压）**：`code-video-casebook/assets/cases/<id>/`（逐字节一致，sha256 见 `references/index.json`）
- 检索卡 `CARD.md`、源码清单 `FILES.md`、20 帧联系表 `preview.jpg`
- 汇总参考：`references/{catalog,pipelines,techniques,playbook,inventory}.md`
- 检索工具：`scripts/casebook.py`（`list / search / where / files / show / copy / verify`）
- 不含原视频、音乐和超过 1 MB 的二进制；未收录的每个文件都在对应 `FILES.md` 里写明了路径、大小、sha256

### 安装

| 平台 | 用哪个 | 怎么装 |
|---|---|---|
| Claude Code | 本目录 | `cp -r skills/code-video-casebook ~/.claude/skills/`（个人）或放到项目的 `.claude/skills/` |
| Claude Agent SDK / Claude API | `dist/code-video-casebook.skill`（zip，960 个文件，解压后约 19.7 MB） | 按平台文档上传或放入 skills 目录 |
| claude.ai 网页 | `dist/code-video-casebook-claude-ai.skill`（145 个文件，解压后约 11 MB） | 在 claude.ai 的 Skills 设置里上传 zip。网页端单个 Skill 最多 200 个文件，所以这一版把每个案例的源码无损打包成 `assets/cases/<id>/SOURCE.md`，二进制（字体/图片）不收录；`casebook.py` 两种布局都能读 |

### 重新生成

源码、CoExp、FILES.md、preview.jpg、index.json、inventory.md 都由脚本从仓库里的原始档案生成；`SKILL.md`、各 `CARD.md` 和汇总参考是手写的，重新生成不会覆盖它们。

```bash
python3 tools/build_casebook.py            # 重新解压全部案例并更新索引
python3 tools/build_casebook.py --zip      # 同时打包 dist/ 下的两个 .skill
python3 skills/code-video-casebook/scripts/casebook.py verify   # 校验 sha256
```

## add-case-to-casebook

仓库维护用的 Agent Skill（Anthropic 标准结构）：把一个新视频案例（CoExp + 源码包 + 可选成片）整合进 `code-video-casebook` 的完整 SOP——登记 `tools/build_casebook.py` 的 `CASES`、生成预览图、写 `CARD.md`、更新汇总索引、一致性校验、重新打包。

- 入口：`add-case-to-casebook/SKILL.md`
- 一致性检查脚本：`add-case-to-casebook/scripts/check_consistency.py`（零依赖，输出 `ALL OK`）
- 所有脚本按 `__file__` 相对定位仓库与 casebook，无绝对路径，可在任意环境运行
- 打包产物：`dist/add-case-to-casebook.skill`（只在有源码/文档改动后重新打包，与 casebook 无关时不随 `--zip` 重建）
