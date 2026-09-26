# Claude 自我介绍 · 纯代码视频

依赖：pip install skia-python numpy scipy ；系统需 ffmpeg、Noto CJK / AR PL UKai / Unifont 字体

    python3 music.py music.wav                 # 合成 128 BPM 配乐
    mkdir -p segs sheets
    python3 render.py sheet 4                  # 某镜头的 6 帧联系表（拉片检查）
    python3 render.py shots 0 1 2 ... 14       # 逐镜头编码
    python3 render.py final out.mp4            # 拼接 + 混音

plan.py 是拉片表：每个镜头 16 拍，改这里就能重排镜头和转场。
