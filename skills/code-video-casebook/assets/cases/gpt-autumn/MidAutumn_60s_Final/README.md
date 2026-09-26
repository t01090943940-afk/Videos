# 把日子，慢慢过圆 · 60 秒最终剪辑

60 秒 / 1920 × 1080 / 60 fps / 21 个镜头 / 立体声音乐与音效 / 无旁白。

## 本次调整

不是把旧版直接倍速：重新压缩叙事、缩短文字入场、按 120 BPM 重编配乐与音效。保留现在—记忆—历史—现在的叙事，并保留 5.50–6.00 秒的骤停。

删除“电子散步”的误识别内容。视频通话改为一起吃月饼，加入人物抬手、咬月饼的特写。历史段增加快速线绘、水墨视差、月饼分块与四种材质汇聚。祝福诗云持续移动；结尾保持画面到第 3600 帧，不以黑场收尾。

## 文件

- `src/film60.py`：最终画面与转场。
- `src/artwork.py`：程序化纸张、月面、建筑、植物、月饼及绘图函数。
- `src/music60.py`：新编 120 BPM 乐曲、音效与 MIDI 输出。
- `src/master_audio.py`：响度母带及骤停段处理。
- `assets/score60_master.flac`：成片使用的配乐母带。
- `assets/score60.mid`：可编辑的音乐音符。
- `timeline.json`：21 镜头的时间、文案、祝福词。
- `subtitles_zh.srt`：文字稿字幕；MP4 已自带画面文字，无需另外加载。
- `storyboard_60s.jpg`：分镜总览。
- `SOURCES_AND_ASSETS.md`：历史参考与资产来源。
- `qa/delivery_report.json`：交付文件的技术检查结果。

## 重新渲染

需要 Python、Cairo、FFmpeg，以及本机安装的中文字体。

```sh
python -m pip install -r requirements.txt
python build.py --workers 3
```

默认使用项目内已完成的 FLAC 配乐，不需要另装音色库。要重新生成配乐，再安装 FluidSynth 和可用的 SoundFont，然后执行：

```sh
python build.py --workers 3 --rebuild-audio
```

画面预览：

```sh
python src/film60.py --stills
python src/film60.py --start 30 --end 33.5 --out closeup.mp4
```

默认字体路径为 Linux Noto CJK 的安装位置。其他系统请设置 `MOON_SERIF`、`MOON_SANS`、`MOON_BOLD` 为本机字体路径；音色库路径可设置 `MOON_SOUNDFONT`。工程不附带字体或音色库文件。

## 说明

这是可编辑的程序化 2D/2.5D 动画工程，不是 AE 工程，也不是摄影或完整 3D 电影。画面中的人物为虚构插画。祝福不是对考试、科研结果的承诺。中秋历史采用原项目的概括性脉络，不将传说当作确证史实。