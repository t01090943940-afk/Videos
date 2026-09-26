# 三维与摄影

让场景成为可以反复拍摄的虚拟片场。

## 先辨别这类能力

分清米制尺寸、坐标朝向、碰撞体和可见网格；检查镜头穿物与近裁剪。

## 成片时间与导出

相机、姿态与灯光都受显式 t 驱动；模拟提前烘焙。WebGL 帧或 DCC 渲染序列 → 合成。

## 反平庸提醒

推拉摇移应改变理解；不停绕场不等于电影感。

## 资源索引

- [Three.js](../libraries/three/README.md)：以场景、相机、光照和材质组织 Web 3D。
- [React Three Fiber](../libraries/r3f/README.md)：用 React 组织 Three.js 场景与生命周期。
- [Drei](../libraries/drei/README.md)：提供 React Three Fiber 常用场景、控制器与视觉辅助。
- [Babylon.js](../libraries/babylon/README.md)：较完整的 Web 3D 引擎与工具生态。
- [PlayCanvas](../libraries/playcanvas/README.md)：提供 Web 3D 引擎和编辑器工作方式。
- [<model-viewer>](../libraries/model-viewer/README.md)：以较少代码展示 glTF/GLB 模型，适合产品与展示页面。
- [vtk.js](../libraries/vtk/README.md)：面向科学与工程数据的 Web 三维可视化。
