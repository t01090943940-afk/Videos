# WebCodecs

> 类型：浏览器 API · 分类：捕获与导出 · 研究快照：2026-09-24
> 证据：官方资料核对核心定位。本条不包含跨模型成绩；关联原理演示不视为该库实测。

## 它增加了什么能力

直接操作音视频帧与编解码器的底层 Web 接口。

- VideoFrame
- VideoEncoder
- AudioData
- 时间戳

## 值得尝试的表达

以下是原创实验建议，不是声称已找到或复刻的官方获奖作品。

- [实验方向 01](./examples/01.md)：为确定帧序列构建浏览器编码输出。
- [实验方向 02](./examples/02.md)：把 GPU 绘制结果压成预览文件并记录精确时间戳。

## 能力边界

编码器不等于 MP4 muxer；编解码支持和安全上下文需检测。

## 使用建议（本词典编辑性判断）

- 检测支持；及时 close 帧；处理背压；用独立封装器写容器。
- 检查首尾帧、时长、可解码性与音画同步；成功退出不等于质量达标。

## 时间线与输出

明确视频时基与帧序号；录屏与逐帧渲染分开记录。

记录容器、codec、fps、采样率和像素格式。

## 组合候选

[ffmpeg](../ffmpeg/README.md), [playwright](../playwright/README.md), [mediabunny](../mediabunny/README.md)。组合关系仅是研究候选，不代表已验证兼容。

## 常见平庸与失败模式

- 浏览器实时 60fps 不证明最终视频不掉帧或逐帧确定。

## 进一步辨别

### 编码与封装是两步

VideoEncoder 输出编码数据并不意味着已经得到能直接打开的 MP4。还需要管理时间戳、音轨、容器和封装。Mediabunny 等更高层工具值得一起研究。

导出时及时关闭不再需要的帧，观察 encodeQueueSize 等背压信息，按环境检测编解码支持。不要用‘我的浏览器能播’替代元数据与跨播放器验证。

[WebCodecs 文档](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)、[Mediabunny](https://mediabunny.dev/)。本工作站提供 PNG 导出和可选实时 WebM 草稿；没有伪装成完整 WebCodecs MP4 导出器。

## 来源与案例导航

- [官方文档 / 作者仓库](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) — 核心定位已核对
- [官方案例 / 扩展资料入口](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API/Using_the_WebCodecs_API) — 导航入口；未逐作审美鉴定

运行库、官方示例、素材与网站服务条款须分别核对。此词典不转授第三方许可证。

## 通用镜头提示词

```text
你正在制作一个代码视频镜头，而不是普通网页。请围绕「WebCodecs」研究 VideoFrame, VideoEncoder, AudioData 的表达可能。

创作输入：主题=[填写]；目标观众=[填写]；时长=[填写]；画幅=[填写]；旁白/素材=[填写]；参考画面=[填写]。

先读取该库官方文档：https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API。确认版本，必要时只加载相关 Skill，不要盲目复制过时 API。
提出 2 个不同的视觉解释方案，说明每个动作承担的意义。优先考虑：为确定帧序列构建浏览器编码输出。
选择方案后写出明确的时间点、主体、焦点和前后状态。不要默认把全部对象设置成缓慢淡入；阅读停留需有目的，运动节奏服从信息理解。
技术边界：编码器不等于 MP4 muxer；编解码支持和安全上下文需检测。
接入建议：明确视频时基与帧序号；录屏与逐帧渲染分开记录。组合候选：ffmpeg, playwright, mediabunny，尚未验证，先小样确认。
先输出可运行的代表镜头，再渲染检查首帧、动作中间、转场两侧和尾帧。检测文字越界、非意图遮挡、资源缺失与不同步；3D 另检镜头及可见网格穿透。
交付源代码、运行方式、素材及版本清单、实际预览与已知限制。把“官方能力”“自己的设计建议”“实际测试结果”分开报告。不要虚构质量分、模型成功率或测试截图。
```

## 验证记录

模型测试：未开展。首次成功率、视觉评分、成本与复现次数：未知。
本地关联案例：暂无。请查看案例的实际 renderer 与证据标签，不能用原理演示证明本库已运行。
