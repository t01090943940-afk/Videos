嘟嘟追风筝 · 30s 原创动画源码

依赖：Python 3、pycairo、numpy、scipy、ffmpeg（带 libx264）、Noto Sans CJK 字体
  pip install pycairo numpy scipy

文件：
  lib.py     绘图库（角色嘟嘟、星星风筝、场景元素、镜头、转场、文字）
  scenes.py  8 个分镜 + 合成器 render_frame(t)
  audio.py   合成配乐与音效 -> audio.wav
  render.py  渲染 900 帧并用 ffmpeg 合成 MP4
  still.py   预览工具：python3 still.py out.png 1.0 5.0 9.5  (输出指定时间点的拼图)

运行：
  python3 audio.py
  python3 render.py     # 输出路径在 render.py 里的 out 变量，可自行修改
