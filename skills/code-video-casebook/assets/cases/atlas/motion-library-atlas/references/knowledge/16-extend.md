# 如何扩充这本词典

数据结构只管理资源知识，不定义统一的视频格式。一个资源可以有多个案例；一个案例也可以指向多个候选库，但实际 renderer 必须单独记录。

## 添加资源

编辑 content/registry.seed.txt：每行包含固定的资源 ID、名称、分类、类型、定位、能力、边界、使用建议、两个实验方向和两个来源入口。复杂补充写入 content/deep-dives.json。执行生成脚本后，会更新 JSON、每库 Markdown 与分类目录。

```bash
python scripts/generate_content.py
python scripts/generate_knowledge.py
npm run build
```

## 添加动态案例

在 src/demos 创建一个独立 TypeScript 文件，遵守现有 Demo 接口。提供显式时间绘制函数、DOM seek 适配器或预渲染视频。填写真实技术、来源与限制。然后运行 scripts/register_demos.py 并重新构建。

所有场景都可以继续使用自己的内部技术；Demo 接口只是工作台预览接入，不是要求生产视频遵守新标准。

## 更新证据

来源变更时记录日期和变化，不默默把旧测评套到新版本。实际测试应留下代码、版本、截图/视频和范围。把未测字段保留为空，比填一个漂亮分数更有价值。

打包 Skill 时只带需要检索的资料与可读脚本，不必把视频和庞大运行时塞进去。