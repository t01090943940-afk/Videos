---
name: motion-library-atlas
description: "Research and choose code-video libraries, animation capabilities, creative references, and existing agent skills. Use when exploring VIBEMOTION, code-generated video, MG, 3D virtual sets, typography, SVG, shaders, audio, capture, or the boundaries of an AI model with a library. Consult an evidence-labelled Chinese encyclopedia of 111 resources; retrieve progressively rather than loading all files. Do not invent benchmark scores or claim untested runtimes were executed."
---

# Motion Library Atlas · 代码动画能力词典

把这个 Skill 当作可检索参考资料，不是新的统一视频框架，不要求改写用户工程。

## 使用顺序

1. 从用户的视觉目标、已有栈和交付形式确定检索词。先允许多种候选，不默认推荐供应商。
2. 读取 `references/catalog-index.json` 的相关项，或用 `scripts/search_atlas.py` 检索；不要加载全部 111 个条目。
3. 只读取命中的 `references/libraries/<id>/README.md`。需要构思时读取该目录 `examples/01.md` 和 `02.md`。
4. 遇到时间、重叠、定格、资产或声音问题，按下面目录读取一到两个主题。外部 Skills 入口见 `references/external-skills.json`，其内容不是本包已执行脚本。
5. 对用户报告：能力依据、能省掉什么工作、不能保证什么、建议的小样验证。需要创作时才选择执行工具。

## 证据约束

- 本包是资料核对的词典；库的模型成功率、视觉质量分和跨库接入实测均没有自动取得。未测保持未知。
- 每库两个案例是原创实验提案，不是已经复现的第三方获奖作品。
- 工作站独立提供 28 个动态案例；大多数是原生 Canvas 的原理演示。不是将它们冒称为对应库的运行测试。
- 来源状态区分官方能力页与未逐作品审阅的案例导航。项目许可、资产许可、Skills 文本许可要分别检查。
- 对当前版本、服务价格、仓库变更、支持矩阵作出结论前，重新核对链接。快照是 2026-09-24，不是永久事实。

## 渐进式披露

把词典藏在参考文件，不把百科全文塞进对话。把检索结果缩小到 3–6 个候选；只在问题需要时展开 API、最佳实践和反例。

```bash
python scripts/search_atlas.py "形变 地图"
python scripts/search_atlas.py "穿模" --limit 6
python scripts/search_atlas.py --id pretext
```

该脚本只读取本地资料，不联网、不安装包、不执行词条中的命令。ChatGPT 也可直接阅读 Markdown，脚本不是硬性依赖。

## 不要替审美拍板

不要把复杂、快节奏或大量转场等同于有创意。静止可以支持阅读；有意遮挡不等于错误重叠；摄像机移动应改变理解。给出可观察的判断理由，再由用户根据作品目标选择。

## 具名案例入口

读取 `references/published-examples.json` 查看 14 个官方或作者发布的具名案例。它们的条目区分页面核对、代码阅读与未运行状态，不冒称逐作品审美鉴定。

## 直接参考目录

- [先区分能力，再选择工具](references/knowledge/01-orientation.md)
- [证据等级：别把想象写成实测](references/knowledge/02-evidence.md)
- [MG 与“AE 级”到底在比较什么](references/knowledge/03-motion-meaning.md)
- [节奏：不是越快越好](references/knowledge/04-pacing.md)
- [重叠、越界与漏检](references/knowledge/05-layout-safety.md)
- [统一时间，不必统一所有代码](references/knowledge/06-time-and-render.md)
- [虚拟摄影棚：先有可信的空间](references/knowledge/07-virtual-studio.md)
- [定格风格，不只是降帧](references/knowledge/08-stop-motion.md)
- [从拉片反查组件](references/knowledge/09-reference-reading.md)
- [组合库之前，先检查接口边界](references/knowledge/10-combinations.md)
- [阅读现成 Skills，但不盲信](references/knowledge/11-skills-audit.md)
- [声音的四种材料](references/knowledge/12-audio.md)
- [怎样逐步摸边界，而不先造一个大基准](references/knowledge/13-experiments.md)
- [渐进式披露：一次只读够用的知识](references/knowledge/14-retrieval.md)
- [能看到，不等于能打包再分发](references/knowledge/15-licensing-and-safety.md)
- [如何扩充这本词典](references/knowledge/16-extend.md)
- [从真实发布的案例继续挖掘](references/knowledge/17-published-examples.md)
- [声音与节拍](references/categories/audio.md)
- [二维场景](references/categories/canvas.md)
- [生成艺术](references/categories/creative.md)
- [数据与图解](references/categories/data.md)
- [捕获与导出](references/categories/export.md)
- [地图与空间数据](references/categories/geo.md)
- [着色与后期](references/categories/gpu.md)
- [物理与约束](references/categories/physics.md)
- [角色与动画资产](references/categories/playback.md)
- [专业工具与资产](references/categories/studio.md)
- [三维与摄影](references/categories/three.md)
- [时间与编排](references/categories/timeline.md)
- [文字与排版](references/categories/type.md)
- [前端视觉与调参](references/categories/ui.md)
- [矢量与手绘](references/categories/vector.md)
- [视频框架](references/categories/video.md)
