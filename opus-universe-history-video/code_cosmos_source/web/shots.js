// 120 BPM · 12 unique fps (stop-motion) · 6 frames per beat
// beats: shot length in beats (4 = 2s, 6 = 3s). Last beat of every shot = FREEZE card (定格).
export const BPM = 120, FPS = 12, FPB = 6;
export const SHOTS = [
  { id:'terminal',  b:6, dim:'2D',   style:'TERMINAL TYPEWRITER', zh:'终端打字机',   ev:'宇宙之前',        t:'t = undefined',     code:'$ ./universe --before-time' },
  { id:'hexdump',   b:6, dim:'2D',   style:'HEX DUMP',            zh:'十六进制内存',  ev:'量子涨落 · 虚空不空', t:'t < 0 ?',          code:'xxd vacuum.bin | grep -v 00' },
  { id:'raymarch',  b:4, dim:'3D',   style:'RAYMARCHING SDF',     zh:'光线步进',     ev:'奇点',            t:'t → 0',             code:'d = length(p) - r(t);' },
  { id:'kinetic',   b:4, dim:'2D',   style:'KINETIC TYPE',        zh:'动态文字',     ev:'大爆炸',          t:'t = 0',             code:'new Universe();' },
  { id:'tesseract', b:6, dim:'4D',   style:'TESSERACT PROJECTION',zh:'四维超立方投影', ev:'暴胀 · 维度展开',   t:'t = 10⁻³⁶ s',        code:'rotate(XW, YW); project(4→3→2)' },
  { id:'plasma',    b:4, dim:'2D',   style:'FRAGMENT SHADER',     zh:'片元着色器',    ev:'夸克-胶子等离子体',  t:'t = 10⁻¹² s',        code:'col = fbm(p + fbm(p + t));' },
  { id:'graph',     b:4, dim:'2D',   style:'FORCE GRAPH',         zh:'力导向图',     ev:'强子形成',         t:'t = 10⁻⁶ s',         code:'link(u, u, d) // proton' },
  { id:'ide',       b:6, dim:'2D',   style:'IDE SYNTAX',          zh:'编辑器语法高亮', ev:'太初核合成',        t:'t = 3 min',          code:'fuse(p, n) → D → He' },
  { id:'pixel',     b:4, dim:'2D',   style:'PIXEL ART',           zh:'像素画',       ev:'复合 · 宇宙微波背景', t:'t = 38 万年',         code:'ctx.fillRect(x*24, y*24, 24, 24)' },
  { id:'ascii',     b:6, dim:'2D',   style:'ASCII RENDER',        zh:'字符画',       ev:'黑暗时代',         t:'t = 1 亿年',          code:'" .:-=+*#%@"[ρ * 9]' },
  { id:'lowpoly',   b:4, dim:'3D',   style:'LOW-POLY',            zh:'低多边形',     ev:'第一代恒星点亮',     t:'t = 1.8 亿年',        code:'new IcosahedronGeometry(1, 1)' },
  { id:'ca',        b:4, dim:'2D',   style:'CELLULAR AUTOMATA',   zh:'元胞自动机',    ev:'再电离',           t:'t = 5 亿年',          code:'if (n > 0 && rnd < p) ion = 1' },
  { id:'pointcloud',b:6, dim:'3D',   style:'POINT CLOUD',         zh:'点云',         ev:'宇宙网 · 暗物质骨架', t:'t = 8 亿年',          code:'new Points(web, 60_000)' },
  { id:'galaxy',    b:4, dim:'3D',   style:'GPU PARTICLES',       zh:'粒子系统',     ev:'星系诞生',         t:'t = 10 亿年',         code:'θ = arm + k·log(r) - ω(r)·t' },
  { id:'spacetime', b:6, dim:'4D',   style:'SPACETIME CURVATURE', zh:'时空曲率网格',  ev:'超大质量黑洞',      t:'t = 12 亿年',         code:'y = -M / √(r² + ε)' },
  { id:'glitch',    b:4, dim:'2D',   style:'GLITCH / DATAMOSH',   zh:'故障艺术',     ev:'超新星 · 锻造重元素', t:'t = 数十亿年',        code:'slice(y).shift(dx); rgbSplit()' },
  { id:'parallax',  b:4, dim:'2.5D', style:'PARALLAX LAYERS',     zh:'多层视差',     ev:'太阳系形成',        t:'t = 92 亿年',         code:'layer.x = cam.x * depth' },
  { id:'voxel',     b:4, dim:'3D',   style:'VOXEL',               zh:'体素',         ev:'地球',            t:'t = 93 亿年',         code:'new InstancedMesh(box, mat, n)' },
  { id:'rain',      b:4, dim:'2D',   style:'CODE RAIN',           zh:'代码雨',       ev:'生命 · DNA',        t:'t = 100 亿年',        code:'"ATCG"[rand() * 4]' },
  { id:'cards',     b:6, dim:'2.5D', style:'3D CARD STACK',       zh:'透视卡片',     ev:'今天 · 你在这里',     t:'t = 138 亿年',        code:'transform: rotateY(θ) translateZ(r)' },
  { id:'dataviz',   b:4, dim:'2D',   style:'DATA VIZ',            zh:'数据可视化',    ev:'暗能量 · 加速膨胀',   t:'t = +100 亿年',       code:'a(t) ∝ sinh^(2/3)(1.5·√ΩΛ·H₀t)' },
  { id:'lightcone', b:4, dim:'4D',   style:'LIGHT CONE (3+1)',    zh:'时空光锥',     ev:'星系逃离视界',       t:'t = +1500 亿年',      code:'x(t) = x₀ · a(t)' },
  { id:'volume',    b:4, dim:'3D',   style:'VOLUMETRIC',          zh:'体积渲染',     ev:'太阳 · 红巨星',      t:'t = +50 亿年 (太阳)',  code:'ρ += fbm(p) * step' },
  { id:'iso',       b:6, dim:'2.5D', style:'ISOMETRIC',           zh:'等距视角',     ev:'恒星时代终结',       t:'t = 10¹⁴ 年',         code:'sx = (x - y) · cos30°' },
  { id:'math',      b:4, dim:'2D',   style:'MATH ANIMATION',      zh:'公式动画',     ev:'简并时代 · 质子衰变?', t:'t = 10³⁴⁺ 年',        code:'N(t) = N₀ · e^(-t/τ)' },
  { id:'scope',     b:6, dim:'2D',   style:'VECTOR SCOPE',        zh:'示波器矢量',    ev:'黑洞蒸发 · 霍金辐射',  t:'t = 10¹⁰⁰ 年',        code:'T = ħc³ / 8πGMk' },
  { id:'tui',       b:6, dim:'2D',   style:'TUI DASHBOARD',       zh:'终端仪表盘',    ev:'热寂 · 熵 = MAX',     t:'t → ∞',              code:'htop --universe' },
  { id:'loop',      b:6, dim:'2D',   style:'TERMINAL · LOOP',     zh:'终端 · 闭环',   ev:'回到之前',          t:'t = undefined',     code:'universe.exit(0); clear' },
];
let acc = 0;
for (const s of SHOTS) { s.start = acc; acc += s.b; }
export const TOTAL_BEATS = acc;
export const TOTAL_FRAMES = acc * FPB;
