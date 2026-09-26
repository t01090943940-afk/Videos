# 着色与后期

从 GPU 材质到图像合成与镜头转场。

## 先辨别这类能力

检查编译、长宽比、颜色空间、设备支持、内存和上下文丢失。

## 成片时间与导出

显式时间 uniform；反馈效果需保存状态或预计算。framebuffer/Canvas → 序列或编码。

## 反平庸提醒

全屏炫光会遮蔽主体；转场必须有方向或形状联系。

## 资源索引

- [WebGL](../libraries/webgl/README.md)：浏览器 GPU 图形接口，可绘制自定义二维或三维效果。
- [WebGPU](../libraries/webgpu/README.md)：现代 GPU 渲染与计算接口，可支持更广的并行运算。
- [TypeGPU](../libraries/typegpu/README.md)：在 TypeScript 工作流中组织 WebGPU 数据和着色逻辑。
- [postprocessing](../libraries/postprocessing/README.md)：为 Three.js 提供组合后期效果的工具。
- [GL Transitions](../libraries/gl-transitions/README.md)：以两张纹理和进度参数描述可复用 GLSL 转场。
- [PixiJS Filters](../libraries/pixi-filters/README.md)：为 Pixi 场景提供一组 GPU 视觉滤镜。
