# 视频框架

把想法组织成可渲染的视频工程。

## 先辨别这类能力

先确定画幅、帧率与音轨；同一镜头不同时间单独检查。

## 成片时间与导出

显式帧时间或框架官方渲染时间线。使用框架输出，或帧序列 → FFmpeg。

## 反平庸提醒

不要把模板默认淡入当作唯一导演语言。

## 资源索引

- [Remotion](../libraries/remotion/README.md)：把 React 组件按视频帧求值，适合参数化片头、字幕和数据视频。
- [HyperFrames](../libraries/hyperframes/README.md)：HeyGen 的 HTML 代码视频体系，将网页动画放进可定位的合成时间轴。
- [Motion Canvas](../libraries/motion-canvas/README.md)：用 TypeScript 生成器组织说明性矢量动画，并通过编辑器调整时机。
- [Manim Community](../libraries/manim/README.md)：围绕数学对象与变换构建动画，避免逐像素手写公式布局。
- [ManimGL / 3b1b](../libraries/manimgl/README.md)：3Blue1Brown 使用的 Manim 分支，提供面向数学演示的图形工具。
- [MoviePy](../libraries/moviepy/README.md)：在 Python 中组合视频、图片与声音，适合批量生成和后处理。
- [Matplotlib Animation](../libraries/matplotlib/README.md)：让科学绘图逐帧变化，并通过动画 writer 输出文件。
- [Revideo](../libraries/revideo/README.md)：基于代码的视频制作工具，延续 Motion Canvas 相关思路。
