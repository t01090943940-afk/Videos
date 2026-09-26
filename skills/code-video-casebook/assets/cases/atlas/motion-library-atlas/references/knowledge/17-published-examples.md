# 从真实发布的案例继续挖掘

这些是官方或作者发布的**具名案例入口**，不是本站 222 个原创实验提案，也不是 28 个本地演示。选入理由是研究价值，不是已经完成逐帧观看后的“世界最佳”评分。

## 空间与角色

Three.js 官方的 [Additive animation / skinning](https://threejs.org/examples/webgl_animation_skinning_additive_blending.html) 适合研究基础动作与局部姿态分层。[WebGPU procedural terrain](https://threejs.org/examples/webgpu_tsl_procedural_terrain.html) 是研究参数化地形的入口。[GPGPU birds](https://threejs.org/examples/#webgl_gpgpu_birds) 则提示我们大量群体运动可能由规则与 GPU 实例共同完成。当前核对的是页面或官方目录，未在本机运行这些外部工程。

## 精确讲解

[Manim 官方示例集](https://docs.manim.community/en/stable/examples.html) 可检索 MovingFrameBox、FollowingGraphCamera、MovingZoomedSceneAround。前者围绕公式注意力引导，后两者分别涉及相机跟随与局部放大。本站检查了公开代码与说明，但没有安装 Manim，也没有把自写数学 Canvas 案例冒称为 Manim 实测。

## 表达与解释的结合

[Motion Canvas 官方 examples](https://github.com/motion-canvas/examples) 的 README 明确收录 Smooth Parallax、Could This Asset Be Code、Deferred Lights 等作品，并提供相应运行项。作品源码值得按镜头研究；仓库也提醒 MP3 示例音频的同步局限，正式使用应核对音轨。当前未本地运行整套工程。

## 数据变化

[D3 / Mike Bostock 的 Bar Chart Race, Explained](https://observablehq.com/@d3/bar-chart-race-explained) 直接讲解对象身份、排名与插值。抓取时存在数据请求失败，因此把“文章可读”和“在线图表成功播放”分开。[Animated treemap](https://observablehq.com/@d3/animated-treemap) 可以进一步研究面积与位置的稳定性。

[Apache ECharts 的 Bar Racing](https://echarts.apache.org/handbook/en/how-to/chart-types/bar/bar-race/) 是另一种高层表达：排序、标签和坐标轴动画各有配置。不要把实时 setInterval 示例直接当作确定性逐帧渲染方案。

## 动态形变与空间输入

[GSAP Demo Hub 的 Dynamic Morphing](https://demos.gsap.com/demo/dynamic-morphing/) 是形变机制的具名入口，不是泛化的“高级感”标签。[p5 Ray Casting](https://archive.p5js.org/examples/3d-ray-casting.html) 由官方归档保留，说明标注 Jonathan Watson；制作视频时需要把鼠标输入替换成受控轨迹。

## 应如何阅读

先打开作品，记录真正吸引你的 3–10 秒，再回答：什么信息发生了变化？哪些对象身份保持不变？涉及什么库能力？哪些效果来自美术资产而非 API？最后只复现一个代表性片段。

这个步骤还没有在全部 111 个资源上完成。未完成的地方保留为明确研究缺口，不用案例数量制造覆盖全部的错觉。