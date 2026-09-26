# 物理与约束

为运动提供碰撞、重量与接触逻辑。

## 先辨别这类能力

验证碰撞体、CCD、关节范围、接触容差；烘焙不代表网格绝不会交叠。

## 成片时间与导出

固定 dt 与初始状态，离线模拟并采样；不要把求解器当随机 seek。物理状态 → 渲染器 → 视频。

## 反平庸提醒

偶然翻滚不是角色表演；物理可信和叙事清楚要同时检查。

## 资源索引

- [Rapier](../libraries/rapier/README.md)：提供二维与三维刚体、碰撞体和约束模拟。
- [Matter.js](../libraries/matter/README.md)：为二维刚体、碰撞与约束提供成熟模型。
- [cannon-es](../libraries/cannon/README.md)：Cannon 的 ES 模块化分支，提供刚体动力学。
- [Planck.js](../libraries/planck/README.md)：JavaScript 二维物理引擎，延续 Box2D 的概念模型。
