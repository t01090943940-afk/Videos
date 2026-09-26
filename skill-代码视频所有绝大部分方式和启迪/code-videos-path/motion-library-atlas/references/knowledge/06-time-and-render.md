# 统一时间，不必统一所有代码

把显式时间看作集成边界，而不是要求所有库改写成新的框架。最简单的几何可以由 t 直接求值；状态机、粒子模拟和视频解码通常需要额外管理。

## 三类状态

直接求值：位置、颜色和几何由时间与输入得到。

可重放状态：从固定初态和事件序列重建。求解次数、输入与随机种子都必须一致。

预计算状态：把物理或昂贵演出先烘焙成样本，拍摄时查表或插值。定格可选择性量化姿态采样，而不改变物理求解精度。

## 不要误禁所有 requestAnimationFrame

它可以驱动工作台的实时预览时钟。需要避免的是让最终画面依赖不可控的真实播放历史。这个工作站用 RAF 预览，但 Canvas 画面从明确的时间参数计算。

## 视频和音频另有时钟

图像、字体、模型必须先加载；视频 seek 后可能还需要等待解码完成。音频设备播放延迟和最终导出时基不同。显式时间并不自动带来跨 GPU、跨字体像素完全一致。

验证方式：同一时间从头求值、跳转求值、回退求值，分别对比。对有历史状态的系统，先问能否复位或读取缓存。

[WAAPI 当前时间](https://developer.mozilla.org/en-US/docs/Web/API/Animation/currentTime)、[WebCodecs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)、[HyperFrames 架构](https://www.heygen.com/research/html-to-video)。
