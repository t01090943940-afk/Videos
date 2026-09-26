# gpt-autumn · SOURCE bundle（claude.ai 精简版）

> claude.ai 网页端限制一个 Skill 最多 200 个文件，所以这一版把本案例的源码树打成这一个文本文件。
> 文本文件逐字节收录（>= 4 KB 的内嵌 base64 媒体替换为标记）；二进制未收录，清单见 references/cases/<id>/FILES.md。
> 读单个文件：`python3 scripts/casebook.py show gpt-autumn <路径>`；还原成真实目录：`python3 scripts/casebook.py copy gpt-autumn <目标>`。

| # | 文件 | 行数 | L |
|---|---|---:|---:|
| 1 | `MidAutumn_60s_Final/README.md` | 51 | 29 |
| 2 | `MidAutumn_60s_Final/SOURCES_AND_ASSETS.md` | 28 | 85 |
| 3 | `MidAutumn_60s_Final/assets/audio_cues.json` | 207 | 118 |
| 4 | `MidAutumn_60s_Final/build.py` | 35 | 330 |
| 5 | `MidAutumn_60s_Final/chapters.ffmeta` | 109 | 370 |
| 6 | `MidAutumn_60s_Final/manifest.json` | 14 | 484 |
| 7 | `MidAutumn_60s_Final/qa/audio_first_pass.json` | 12 | 503 |
| 8 | `MidAutumn_60s_Final/qa/audio_second_pass.txt` | 31 | 520 |
| 9 | `MidAutumn_60s_Final/qa/delivery_report.json` | 29 | 556 |
| 10 | `MidAutumn_60s_Final/requirements.txt` | 5 | 590 |
| 11 | `MidAutumn_60s_Final/screenplay_zh.txt` | 83 | 600 |
| 12 | `MidAutumn_60s_Final/src/artwork.py` | 356 | 688 |
| 13 | `MidAutumn_60s_Final/src/film60.py` | 756 | 1049 |
| 14 | `MidAutumn_60s_Final/src/master_audio.py` | 19 | 1810 |
| 15 | `MidAutumn_60s_Final/src/music60.py` | 194 | 1834 |
| 16 | `MidAutumn_60s_Final/subtitles_zh.srt` | 101 | 2033 |
| 17 | `MidAutumn_60s_Final/timeline.json` | 211 | 2139 |

---

### 1/17 · `MidAutumn_60s_Final/README.md`
<!-- casebook-file {"path": "MidAutumn_60s_Final/README.md", "lines": 51, "final_newline": false, "sha256": "50f34939f5c550cd56e0edaee60d633a71862255cab9e7ffcebc56bc1e291f5d", "original_sha256": "50f34939f5c550cd56e0edaee60d633a71862255cab9e7ffcebc56bc1e291f5d"} -->
````markdown
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
````

### 2/17 · `MidAutumn_60s_Final/SOURCES_AND_ASSETS.md`
<!-- casebook-file {"path": "MidAutumn_60s_Final/SOURCES_AND_ASSETS.md", "lines": 28, "final_newline": true, "sha256": "6c8de080a6aca2e45dc3fd97137e94092201b3e8e83e24da47e9f562aabb8d88", "original_sha256": "6c8de080a6aca2e45dc3fd97137e94092201b3e8e83e24da47e9f562aabb8d88"} -->
```markdown
# Research and asset notes

## Historical content
The film describes broad historical development rather than claiming one exact year in which the Mid-Autumn Festival was invented. The early scene refers to autumn offerings and moon worship as antecedents. Tang moon appreciation, Song festival life, and Ming-Qing mooncake/reunion symbolism are treated as distinct stages. Mythology is not presented as documented history.

- Hong Kong Observatory, *Moon-watching tips for Mid-Autumn Festival 2026*, 15 September 2026. Confirms that the 2026 festival falls on 25 September. The astronomical full moon is not necessarily on the festival date; the film's moon is a symbolic illustration.
  https://www.hko.gov.hk/en/Press-Releases/110730/Moon-watching-tips-for-Mid-Autumn-Festival-2026
- China News Service / Xinhua client, *The origins and customs of the Mid-Autumn Festival*, 14 September 2024. Used for broad historical stages and reunion symbolism. No claim about a specific Tang mooncake origin is taken from this article.
  https://app.xinhuanet.com/news/article.html?articleId=596ecbe5-ea04-41e3-beba-989116fa714a
- China.org.cn reproduction of the same historical article; includes the Ming-era association of gifting mooncakes with reunion and Qing family moon-viewing customs.
  https://ccpd.china.com.cn/2024-09/14/content_42917459.html

The ten-character classical verse in the Song sequence is from Su Shi's *Shui Diao Ge Tou*, a public-domain classical work. The other narrative and blessing text is newly written for this film. Blessings are wishes, not promises of exam or research outcomes.

## Visual and audio assets
- All visuals are constructed in Python/Cairo: no stock video, photograph, or generated-image asset is used.
- The moon surface, ink landscape, paper grain, plants, city, engraved mooncake, illustrations, devices, perspective text cloud and particles are procedural.
- The people are stylized fictional illustrations, not depictions of identified people.
- The score is newly sequenced for this film. The Foley consists of programmatically synthesized noise, pulses and resonances. No voiceover is included.
- Score renderer: locally available FluidSynth with TimGM6mb.sf2 (Tim Brechbill / David Bolton; installed package license GPL-2). The sound-bank file is NOT distributed with this project. Its license and the rights applicable to any replacement bank should be reviewed before redistribution of a bank.
- Fonts used locally: Noto Serif CJK SC / Noto Sans CJK SC. Font files are NOT distributed. Set MOON_SERIF, MOON_SANS and MOON_BOLD to your own installed font paths when needed.
- This is a 2D/2.5D illustration and motion-design film, not photorealistic cinema or a full 3D simulation.

## Method reference
Motion Library Atlas was used as a planning reference for fixed-seed linework, a shared deterministic timeline, separate audio materials, and readability checks. The implementation itself uses Cairo/Pillow/NumPy rather than claiming to run Rough.js, Two.js or an AE project.

## 60-second final revision
The existing historical outline is retained. The new version removes the mistaken electronic-walk sequence entirely. It has 21 shots, 3600 video frames at 60 fps, and a newly sequenced 120-bpm arrangement. The call includes newly drawn close-up characters raising and biting mooncakes. No voiceover, stock footage, photographs, fonts or sound-bank files are distributed. All identified people are fictional stylized artwork.
```

### 3/17 · `MidAutumn_60s_Final/assets/audio_cues.json`
<!-- casebook-file {"path": "MidAutumn_60s_Final/assets/audio_cues.json", "lines": 207, "final_newline": false, "sha256": "df6d1be3e38a34c542ac71cc0f0fbb504b4468f48d6dcc50e86aa347f445d66d", "original_sha256": "df6d1be3e38a34c542ac71cc0f0fbb504b4468f48d6dcc50e86aa347f445d66d"} -->
```json
{
  "duration": 60,
  "bpm": 120,
  "editorial_silence": [
    5.5,
    6.0
  ],
  "cuts": [
    2,
    7,
    9.5,
    11,
    13.5,
    16,
    19,
    21.5,
    24,
    27,
    30,
    33.5,
    36,
    39,
    42,
    45,
    48,
    52,
    55.5
  ],
  "bars": [
    [
      0,
      2,
      "D",
      "intro"
    ],
    [
      2,
      2,
      "Bm",
      "busy"
    ],
    [
      4,
      1.5,
      "A",
      "busy"
    ],
    [
      6,
      2,
      "Bm",
      "memory"
    ],
    [
      8,
      1.5,
      "G",
      "memory"
    ],
    [
      9.5,
      1.5,
      "A",
      "rewind"
    ],
    [
      11.0,
      2,
      "D",
      "history"
    ],
    [
      13.0,
      2,
      "G",
      "history"
    ],
    [
      15.0,
      2,
      "Bm",
      "history"
    ],
    [
      17.0,
      2,
      "A",
      "history"
    ],
    [
      19.0,
      2,
      "D",
      "history"
    ],
    [
      21.0,
      2,
      "G",
      "history"
    ],
    [
      23.0,
      1,
      "A",
      "history"
    ],
    [
      24.0,
      2,
      "D",
      "present"
    ],
    [
      26.0,
      2,
      "G",
      "present"
    ],
    [
      28.0,
      2,
      "Bm",
      "present"
    ],
    [
      30.0,
      2,
      "A",
      "present"
    ],
    [
      32.0,
      2,
      "G",
      "present"
    ],
    [
      34.0,
      2,
      "A",
      "present"
    ],
    [
      36,
      2,
      "Bm",
      "heart"
    ],
    [
      38,
      2,
      "G",
      "heart"
    ],
    [
      40,
      2,
      "A",
      "heart"
    ],
    [
      42.0,
      2,
      "D",
      "wishes"
    ],
    [
      44.0,
      2,
      "G",
      "wishes"
    ],
    [
      46.0,
      2,
      "Bm",
      "wishes"
    ],
    [
      48.0,
      2,
      "Em",
      "wishes"
    ],
    [
      50.0,
      2,
      "A",
      "wishes"
    ],
    [
      52,
      2,
      "D",
      "invitation"
    ],
    [
      54,
      1.5,
      "A",
      "invitation"
    ]
  ],
  "events": 1840,
  "narration": false
}
```

### 4/17 · `MidAutumn_60s_Final/build.py`
<!-- casebook-file {"path": "MidAutumn_60s_Final/build.py", "lines": 35, "final_newline": true, "sha256": "8deb16277261e9333ede4fc4f7e23b506ecc892adb5dbf3b48166820ed55fea7", "original_sha256": "8deb16277261e9333ede4fc4f7e23b506ecc892adb5dbf3b48166820ed55fea7"} -->
```python
#!/usr/bin/env python3
"""Build the delivered film using the included mastered soundtrack."""
import argparse, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def run(args):
 subprocess.run([str(x) for x in args],check=True)

def main():
 p=argparse.ArgumentParser()
 p.add_argument('--workers',type=int,default=3)
 p.add_argument('--out',default=str(ROOT/'MidAutumn_Final_60s_1080p60.mp4'))
 p.add_argument('--rebuild-audio',action='store_true')
 a=p.parse_args()
 if a.rebuild_audio:
  run([sys.executable,ROOT/'src'/'music60.py'])
  run([sys.executable,ROOT/'src'/'master_audio.py'])
 audio=ROOT/'assets'/'score60_master.flac'
 if not audio.is_file():raise FileNotFoundError(audio)
 out=ROOT/'render';out.mkdir(exist_ok=True)
 spans=[(0,16),(16,30),(30,45),(45,60)]
 def part(item):
  i,(start,end)=item
  path=out/f'part{i}.mp4'
  run([sys.executable,ROOT/'src'/'film60.py','--start',start,'--end',end,'--out',path])
  return path
 with ThreadPoolExecutor(max_workers=max(1,min(4,a.workers))) as pool:
  paths=list(pool.map(part,enumerate(spans)))
 listing=out/'concat.txt'
 listing.write_text(''.join("file '"+x.as_posix().replace("'","'\\''")+"'\n" for x in paths))
 run(['ffmpeg','-hide_banner','-y','-f','concat','-safe','0','-i',listing,'-i',audio,'-i',ROOT/'chapters.ffmeta','-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-c:v','copy','-c:a','aac','-b:a','256k','-t','60','-movflags','+faststart',a.out])
 print(a.out)
if __name__=='__main__':main()
```

### 5/17 · `MidAutumn_60s_Final/chapters.ffmeta`
<!-- casebook-file {"path": "MidAutumn_60s_Final/chapters.ffmeta", "lines": 109, "final_newline": true, "sha256": "db2cbee815a99c2083348690e7c839a2255cc325bcdbe0db9b1f91c607cc0a8b", "original_sha256": "db2cbee815a99c2083348690e7c839a2255cc325bcdbe0db9b1f91c607cc0a8b"} -->
```
;FFMETADATA1
title=把日子，慢慢过圆
artist=Original procedural code film
comment=60-second final edit; original music and synthesized Foley; no narration
[CHAPTER]
TIMEBASE=1/1000
START=0
END=2000
title=今夜月圆
[CHAPTER]
TIMEBASE=1/1000
START=2000
END=5500
title=忙碌的现在
[CHAPTER]
TIMEBASE=1/1000
START=5500
END=7000
title=骤停与回望
[CHAPTER]
TIMEBASE=1/1000
START=7000
END=9500
title=分着吃的月饼
[CHAPTER]
TIMEBASE=1/1000
START=9500
END=11000
title=时间倒流
[CHAPTER]
TIMEBASE=1/1000
START=11000
END=13500
title=祭月与谢秋
[CHAPTER]
TIMEBASE=1/1000
START=13500
END=16000
title=唐代赏月
[CHAPTER]
TIMEBASE=1/1000
START=16000
END=19000
title=宋代佳节
[CHAPTER]
TIMEBASE=1/1000
START=19000
END=21500
title=明清团圆
[CHAPTER]
TIMEBASE=1/1000
START=21500
END=24000
title=千年风格汇聚
[CHAPTER]
TIMEBASE=1/1000
START=24000
END=27000
title=回到今天
[CHAPTER]
TIMEBASE=1/1000
START=27000
END=30000
title=万里同屏
[CHAPTER]
TIMEBASE=1/1000
START=30000
END=33500
title=隔屏吃月饼
[CHAPTER]
TIMEBASE=1/1000
START=33500
END=36000
title=同一份牵挂
[CHAPTER]
TIMEBASE=1/1000
START=36000
END=39000
title=团圆不等于圆满
[CHAPTER]
TIMEBASE=1/1000
START=39000
END=42000
title=有人惦念你
[CHAPTER]
TIMEBASE=1/1000
START=42000
END=45000
title=祝福学子
[CHAPTER]
TIMEBASE=1/1000
START=45000
END=48000
title=祝福求索者
[CHAPTER]
TIMEBASE=1/1000
START=48000
END=52000
title=祝福诗云
[CHAPTER]
TIMEBASE=1/1000
START=52000
END=55500
title=今晚一起吃月饼
[CHAPTER]
TIMEBASE=1/1000
START=55500
END=60000
title=团团圆圆
```

### 6/17 · `MidAutumn_60s_Final/manifest.json`
<!-- casebook-file {"path": "MidAutumn_60s_Final/manifest.json", "lines": 14, "final_newline": false, "sha256": "2a9502fbf6c42b4a4b2a1637949d1c2a42759f3ccfddf5d30741c62c861d9b66", "original_sha256": "2a9502fbf6c42b4a4b2a1637949d1c2a42759f3ccfddf5d30741c62c861d9b66"} -->
```json
{
  "file": "MidAutumn_Final_60s_1080p60.mp4",
  "duration_seconds": 60.0,
  "dimensions": [
    1920,
    1080
  ],
  "fps": 60,
  "video_frames": 3600,
  "audio_sample_rate": 48000,
  "audio_channels": 2,
  "shots": 21,
  "narration": false
}
```

### 7/17 · `MidAutumn_60s_Final/qa/audio_first_pass.json`
<!-- casebook-file {"path": "MidAutumn_60s_Final/qa/audio_first_pass.json", "lines": 12, "final_newline": false, "sha256": "30ce912427ae2482c26263aa0c4e68352647b3c6df2318618ba54bcb2a47a1ad", "original_sha256": "30ce912427ae2482c26263aa0c4e68352647b3c6df2318618ba54bcb2a47a1ad"} -->
```json
{
  "input_i": "-31.44",
  "input_tp": "-15.58",
  "input_lra": "5.70",
  "input_thresh": "-41.59",
  "output_i": "-14.96",
  "output_tp": "-1.30",
  "output_lra": "4.30",
  "output_thresh": "-25.08",
  "normalization_type": "dynamic",
  "target_offset": "-1.04"
}
```

### 8/17 · `MidAutumn_60s_Final/qa/audio_second_pass.txt`
<!-- casebook-file {"path": "MidAutumn_60s_Final/qa/audio_second_pass.txt", "lines": 31, "final_newline": true, "sha256": "84a6066d72fa186c3bd436e9aaf9681427812f32e991a602d7184cf8244102be", "original_sha256": "84a6066d72fa186c3bd436e9aaf9681427812f32e991a602d7184cf8244102be"} -->
```text
[aist#0:0/pcm_s24le @ 0x5603793c5f80] Guessed Channel Layout: stereo
Input #0, wav, from '/mnt/data/moon60/final_project/assets/score60_raw.wav':
  Duration: 00:01:00.00, bitrate: 2116 kb/s
  Stream #0:0: Audio: pcm_s24le ([1][0][0][0] / 0x0001), 44100 Hz, stereo, s32 (24 bit), 2116 kb/s
Stream mapping:
  Stream #0:0 -> #0:0 (pcm_s24le (native) -> pcm_s24le (native))
Press [q] to stop, [?] for help
Output #0, wav, to '/mnt/data/moon60/final_project/assets/score60_master_tmp.wav':
  Metadata:
    ISFT            : Lavf61.7.103
  Stream #0:0: Audio: pcm_s24le ([1][0][0][0] / 0x0001), 48000 Hz, stereo, s32 (24 bit), 2304 kb/s
      Metadata:
        encoder         : Lavc61.19.101 pcm_s24le
size=    4864KiB time=00:00:17.89 bitrate=2226.1kbits/s speed=35.8x    
size=   10240KiB time=00:00:36.79 bitrate=2279.5kbits/s speed=36.8x    
size=   15360KiB time=00:00:55.59 bitrate=2263.1kbits/s speed=37.1x    
[Parsed_loudnorm_0 @ 0x7fdd4c002ec0] 
{
	"input_i" : "-31.44",
	"input_tp" : "-15.58",
	"input_lra" : "5.70",
	"input_thresh" : "-41.59",
	"output_i" : "-15.99",
	"output_tp" : "-1.30",
	"output_lra" : "4.30",
	"output_thresh" : "-26.11",
	"normalization_type" : "dynamic",
	"target_offset" : "-0.01"
}
[out#0/wav @ 0x5603793c6140] video:0KiB audio:16875KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: 0.000590%
size=   16875KiB time=00:01:00.00 bitrate=2304.0kbits/s speed=37.5x    
```

### 9/17 · `MidAutumn_60s_Final/qa/delivery_report.json`
<!-- casebook-file {"path": "MidAutumn_60s_Final/qa/delivery_report.json", "lines": 29, "final_newline": false, "sha256": "2d9b2f0970fc8817d50346632f30cfde316a0adb13e3c8a32a3871b952c8ed90", "original_sha256": "2d9b2f0970fc8817d50346632f30cfde316a0adb13e3c8a32a3871b952c8ed90"} -->
```json
{
  "file": "MidAutumn_Final_60s_1080p60.mp4",
  "duration_seconds": 60.0,
  "dimensions": [
    1920,
    1080
  ],
  "fps": 60,
  "video_frames": 3600,
  "audio_sample_rate": 48000,
  "audio_channels": 2,
  "file_bytes": 29332124,
  "shots": 21,
  "full_decode_passed": true,
  "blank_sample_times_seconds": [],
  "identical_consecutive_quarter_second_samples": [],
  "sampled_min_luma": 28.39891975308642,
  "sampled_min_luma_std": 16.118771294692472,
  "median_quarter_second_frame_change": 1.9562654495239258,
  "silence_checked_interval": [
    5.54,
    5.96
  ],
  "silence_peak": 0.0,
  "decoded_audio_peak": 0.8536791801452637,
  "sha256": "cf9d9c078a67ef0f15f94f3e4d01a3243f317ece73d8fcddcc672f05b74b8c30",
  "narration": false,
  "notes": "Technical checks do not constitute a guarantee of aesthetic quality. The 5.5-6.0 second music stop is intentional. Core AAC silence is checked clear of codec edge ringing."
}
```

### 10/17 · `MidAutumn_60s_Final/requirements.txt`
<!-- casebook-file {"path": "MidAutumn_60s_Final/requirements.txt", "lines": 5, "final_newline": true, "sha256": "c100cd159917a922f77ea9f430b4d118a6234c4a0bc9cfb4d295b7b8d540b242", "original_sha256": "c100cd159917a922f77ea9f430b4d118a6234c4a0bc9cfb4d295b7b8d540b242"} -->
```text
numpy
Pillow
scipy
pycairo
soundfile
```

### 11/17 · `MidAutumn_60s_Final/screenplay_zh.txt`
<!-- casebook-file {"path": "MidAutumn_60s_Final/screenplay_zh.txt", "lines": 83, "final_newline": false, "sha256": "77d63a5640789daeb0e4bd38d0e3e1d39785d231f378ec73ab30f0e42a2a6986", "original_sha256": "77d63a5640789daeb0e4bd38d0e3e1d39785d231f378ec73ab30f0e42a2a6986"} -->
```text
00.0-02.0  今夜月圆
今晚，月亮又圆了。
八月十五 · 中秋

02.0-05.5  忙碌的现在
可生活，越走越快。
忙到忘了，为什么过中秋。

05.5-07.0  骤停与回望
你还记得
中秋吗？

07.0-09.5  分着吃的月饼
小时候，一块月饼，
总要分着吃。

09.5-11.0  时间倒流
把时间，往回拨。
一轮月，照过千年。

11.0-13.5  祭月与谢秋
从祭月、谢秋的习俗走来。
祭月 · 谢秋

13.5-16.0  唐代赏月
明月入诗，也入思念。
唐 · 赏月

16.0-19.0  宋代佳节
但愿人长久，千里共婵娟。
宋 · 佳节

19.0-21.5  明清团圆
把团圆，分进一块月饼。
明清 · 团圆

21.5-24.0  千年风格汇聚
千年变的，是过节的方式。
不变的，是想见你。

24.0-27.0  回到今天
不变的，是想见你。
今天 · 相连

27.0-30.0  万里同屏
相隔万里，也能同屏。
家那一端 · 你这一端

30.0-33.5  隔屏吃月饼
你吃一口，我也吃一口。
一起吃月饼

33.5-36.0  同一份牵挂
不在同一张桌，
也在彼此心里。

36.0-39.0  团圆不等于圆满
后来才懂，
团圆，不是一切都圆满。

39.0-42.0  有人惦念你
是还没圆满时，
也有人惦念你。

42.0-45.0  祝福学子
愿高考、考研的你，
落笔生花，走向天光。

45.0-48.0  祝福求索者
愿做科研的你，
长夜求索，终有回响。

48.0-52.0  祝福诗云
愿所有奔赴，都有回响。
也愿你，好好照顾自己。

52.0-55.5  今晚一起吃月饼
今晚，和惦念的人，
一起吃块月饼吧。

55.5-60.0  团团圆圆
中秋快乐
愿你所念皆安，团团圆圆。
```

### 12/17 · `MidAutumn_60s_Final/src/artwork.py`
<!-- casebook-file {"path": "MidAutumn_60s_Final/src/artwork.py", "lines": 356, "final_newline": true, "sha256": "cf944fa4db827a18c1a16c01d27b5ae2f11a5be0af579bdff5ef631b07081afa", "original_sha256": "cf944fa4db827a18c1a16c01d27b5ae2f11a5be0af579bdff5ef631b07081afa"} -->
```python
#!/usr/bin/env python3
"""Deterministic, layered Cairo code-film. No video footage or generative images."""
from __future__ import annotations
import os, sys, math, json, time, subprocess, argparse
from pathlib import Path
from functools import lru_cache
import numpy as np
import cairo
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter

ROOT=Path(__file__).resolve().parents[1]
W,H=1920,1080
FPS=60
DURATION=60
PI=math.pi
TAU=2*PI
rng=np.random.default_rng(9252026)
SERIF=os.environ.get('MOON_SERIF','/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc')
SANS=os.environ.get('MOON_SANS','/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
BOLD=os.environ.get('MOON_BOLD','/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc')
INK='#283a3d'; CREAM='#f3ead5'; GOLD='#e5bc76'; MUTED='#9cacae'; NIGHT='#08131f'
TEXT={'reunion':'\u56e2\u5706'}
def clamp(x,a=0.,b=1.): return max(a,min(b,x))
def smooth(x): x=clamp(x); return x*x*(3-2*x)
def ease(x): return 1-(1-clamp(x))**3
def lerp(a,b,t): return a+(b-a)*t
def rgb(c):
 if isinstance(c,tuple): return tuple(v/255 if v>1 else v for v in c)
 c=c.lstrip('#'); return tuple(int(c[i:i+2],16)/255 for i in (0,2,4))
def col(ctx,c,a=1): ctx.set_source_rgba(*rgb(c),clamp(a))
def rect(ctx,x,y,w,h,c,a=1): col(ctx,c,a); ctx.rectangle(x,y,w,h); ctx.fill()
def line(ctx,pts,c=CREAM,width=2,a=1,close=False):
 if len(pts)<2:return
 ctx.new_path(); ctx.move_to(*pts[0])
 for p in pts[1:]:ctx.line_to(*p)
 if close:ctx.close_path()
 col(ctx,c,a); ctx.set_line_width(width);ctx.set_line_cap(cairo.LINE_CAP_ROUND);ctx.set_line_join(cairo.LINE_JOIN_ROUND);ctx.stroke()
def poly(ctx,pts,c,a=1):
 ctx.new_path();ctx.move_to(*pts[0])
 for p in pts[1:]:ctx.line_to(*p)
 ctx.close_path();col(ctx,c,a);ctx.fill()
def circle(ctx,x,y,r,c,a=1,stroke=0):
 if r<=0:return
 ctx.new_path();ctx.arc(x,y,r,0,TAU);col(ctx,c,a)
 if stroke:ctx.set_line_width(stroke);ctx.stroke()
 else:ctx.fill()
def ellipse(ctx,x,y,rx,ry,c,a=1,stroke=0):
 ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);circle(ctx,0,0,1,c,a,stroke/max(rx,ry));ctx.restore()
def rr(ctx,x,y,w,h,r,c,a=1,stroke=0):
 ctx.new_path();r=min(r,w/2,h/2)
 for xx,yy,start in [(x+w-r,y+r,-PI/2),(x+w-r,y+h-r,0),(x+r,y+h-r,PI/2),(x+r,y+r,PI)]:
  ctx.arc(xx,yy,r,start,start+PI/2)
 ctx.close_path();col(ctx,c,a)
 if stroke:ctx.set_line_width(stroke);ctx.stroke()
 else:ctx.fill()
def glow(ctx,x,y,r,c=GOLD,a=.25):
 grad=cairo.RadialGradient(x,y,0,x,y,r);cr=rgb(c)
 grad.add_color_stop_rgba(0,*cr,a);grad.add_color_stop_rgba(.28,*cr,a*.45);grad.add_color_stop_rgba(1,*cr,0)
 ctx.set_source(grad);ctx.rectangle(x-r,y-r,2*r,2*r);ctx.fill()
def arc(ctx,x,y,r,start,end,c=GOLD,width=2,a=1):
 ctx.new_path();ctx.arc(x,y,r,start,end);col(ctx,c,a);ctx.set_line_width(width);ctx.set_line_cap(cairo.LINE_CAP_ROUND);ctx.stroke()
def curve(ctx,p,c,width=2,a=1):
 ctx.new_path();ctx.move_to(*p[0]);ctx.curve_to(*(p[1]+p[2]+p[3]));col(ctx,c,a);ctx.set_line_width(width);ctx.set_line_cap(cairo.LINE_CAP_ROUND);ctx.stroke()

def surface_from_pil(im):
 im=im.convert('RGBA');arr=np.array(im,dtype=np.uint8)
 alpha=arr[:,:,3:4].astype(np.uint16)
 arr[:,:,:3]=(arr[:,:,:3].astype(np.uint16)*alpha//255).astype(np.uint8)
 bgra=np.ascontiguousarray(arr[:,:,[2,1,0,3]])
 return cairo.ImageSurface.create_for_data(bgra,cairo.FORMAT_ARGB32,im.width,im.height)

def paint(ctx,s,x=0,y=0,w=None,h=None,a=1):
 if a<=0:return
 ctx.save();ctx.translate(x,y)
 if w is not None:ctx.scale(w/s.get_width(), (h if h is not None else w*s.get_height()/s.get_width())/s.get_height())
 ctx.set_source_surface(s);ctx.paint_with_alpha(clamp(a));ctx.restore()

@lru_cache(maxsize=1024)
def text_surface(txt,size,color=CREAM,font='serif',tracking=0):
 path={'serif':SERIF,'sans':SANS,'bold':BOLD}.get(font,SANS)
 idx=2 if path.endswith('.ttc') else 0
 f=ImageFont.truetype(path,int(size),index=idx)
 width=math.ceil(f.getlength(txt)+max(0,len(txt)-1)*tracking)+12
 im=Image.new('RGBA',(max(width,1),int(size*1.7)+10))
 d=ImageDraw.Draw(im)
 if tracking:
  pos=6
  for ch in txt:d.text((pos,5),ch,font=f,fill=color,anchor='lt');pos+=f.getlength(ch)+tracking
 else:d.text((6,5),txt,font=f,fill=color,anchor='lt')
 box=im.getbbox()
 if box:im=im.crop((0,0,im.width,max(box[3]+6,int(size*1.05))))
 return surface_from_pil(im)

def text(ctx,txt,x,y,size=50,c=CREAM,font='serif',a=1,align='left',tracking=0,scale=1):
 s=text_surface(txt,int(size),c,font,tracking);w=s.get_width()*scale
 if align=='center':x-=w/2
 if align=='right':x-=w
 paint(ctx,s,x,y,w,s.get_height()*scale,a)
 return w

def caption(ctx,lines,u,bright=False,y=836,size=49,x=960,delay=.12,align='center'):
 alpha=smooth((u-delay)/.34)
 c=INK if bright else CREAM
 # Deliberate lower-third typography, not a subtitle box.
 for i,txt in enumerate(lines):
  text(ctx,txt,x,y+i*(size+20)+(1-ease((u-delay)/.6))*15,size,c,a=alpha,align=align)

def eyebrow(ctx,txt,bright=False,x=130,y=136):
 c=INK if bright else GOLD
 line(ctx,[(x,y+13),(x+36,y+13)],c,2,.65)
 text(ctx,txt,x+52,y,21,c,'sans',tracking=1)

def footer(ctx,idx,bright=False):
 c=INK if bright else CREAM
 text(ctx,'MOON / A SHARED NIGHT',130,1001,16,c,'sans',a=.45,tracking=2)
 text(ctx,f'{idx+1:02d} / 20',1790,1001,16,c,'sans',a=.4,align='right',tracking=1)

class Assets:
 def __init__(self):
  self.paper=self.make_paper();self.night=self.make_night();self.moon=self.make_moon();self.grain=self.make_grain()
  self.hills=[self.make_hill(i) for i in range(4)]
  self.stars=np.column_stack((rng.uniform(40,W-40,230),rng.uniform(70,800,230),rng.uniform(.65,1.9,230),rng.uniform(0,TAU,230)))
  self.dust=np.column_stack((rng.uniform(0,W,80),rng.uniform(0,H,80),rng.uniform(.6,2.3,80),rng.uniform(0,TAU,80)))
  self.city=self.make_city();self.cake=self.make_cake();self.branch=self.make_branch()
 def make_paper(self):
  n=rng.normal(0,1,(H,W)).astype(np.float32)
  n=n*1.1+gaussian_filter(n,11)*7
  y,x=np.mgrid[:H,:W];v=-4*((x-W*.48)**2/(W*.8)**2+(y-H*.45)**2/H**2)
  a=np.stack([np.clip(base+n+v,0,255) for base in (239,235,221)],-1).astype(np.uint8)
  return surface_from_pil(Image.fromarray(a))
 def make_night(self):
  y,x=np.mgrid[:H,:W];haze=np.exp(-((y-H*.88)/(H*.38))**2-((x-W*.55)/(W*.8))**2)
  n=rng.normal(0,.65,(H,W));v=((x-W/2)/(W/2))**2+((y-H/2)/H)**2
  a=np.stack([np.clip(b+k*haze+n-4*v,0,255) for b,k in [(8,14),(19,23),(32,26)]],-1).astype(np.uint8)
  return surface_from_pil(Image.fromarray(a))
 def make_grain(self):
  a=rng.integers(0,255,(270,480),dtype=np.uint8)
  im=Image.fromarray(a).convert('RGBA');im.putalpha(Image.new('L',im.size,14));return surface_from_pil(im)
 def make_moon(self):
  n=900;y,x=np.mgrid[:n,:n];xx=(x-n/2)/(n*.492);yy=(y-n/2)/(n*.492);rrr=xx*xx+yy*yy
  mask=rrr<=1
  noise=np.zeros((n,n),np.float32)
  for sigma,amp in [(35,13),(12,7),(3,3),(1,.9)]:
   k=gaussian_filter(rng.normal(0,1,(n,n)).astype(np.float32),sigma)
   noise+=k/(k.std()+1e-5)*amp
  for cx,cy,r,amp in [(-.34,-.2,.27,-28),(.22,-.39,.27,-24),(.08,.03,.3,-25),(-.5,.37,.22,-20),(.38,.35,.2,-12)]:
   noise+=amp*np.exp(-((xx-cx)**2+(yy-cy)**2)/(r*r))
  for i in range(65):
   cx,cy=rng.uniform(-.9,.9,2);r=rng.uniform(.008,.065);d=np.sqrt((xx-cx)**2+(yy-cy)**2)
   noise+=8*np.exp(-((d-r)/(r*.18))**2)-9*np.exp(-(d/(r*.85))**4)
  shade=np.sqrt(np.clip(1-rrr,0,1));lum=np.clip(211+noise+shade*21-xx*12-yy*8,70,251)
  a=np.zeros((n,n,4),np.uint8)
  for k,f in enumerate([1,.93,.78]):a[:,:,k]=(lum*f).astype(np.uint8)
  a[:,:,3]=(np.clip((1-np.sqrt(rrr))*n*.5,0,1)*255).astype(np.uint8)
  return surface_from_pil(Image.fromarray(a))
 def make_hill(self,j):
  ww,hh=2400,850;im=Image.new('RGBA',(ww,hh));d=ImageDraw.Draw(im)
  rs=np.random.default_rng(725+j);xx=np.arange(ww);wave=np.zeros(ww)
  for freq,amp in [(420,80),(130,37),(45,11)]:
   q=gaussian_filter(rs.normal(size=ww),freq/4);wave+=q/q.std()*amp
  wave+=100*np.sin(xx/ww*PI*2+j)
  raw=220+wave+j*50
  yy=100+(raw-raw.min())/(raw.max()-raw.min())*405
  color=[(90,125,122,60),(73,107,103,82),(39,82,77,120),(30,60,56,210)][j]
  pts=list(zip(xx.tolist(),yy.tolist()))+[(ww,hh),(0,hh)];d.polygon(pts,fill=color)
  # Subtle ink fibres stay fixed between frames.
  arr=np.array(im);grain=gaussian_filter(rs.random((hh,ww)).astype(np.float32),2)
  depth=np.clip(np.arange(hh)[:,None]-yy[None,:],0,None)
  decay=np.exp(-depth/183)
  opacity=gaussian_filter(arr[:,:,3].astype(np.float32),1.0)
  arr[:,:,3]=(opacity*(.58+.65*grain)*decay).clip(0,255).astype(np.uint8)
  return surface_from_pil(Image.fromarray(arr))
 def make_city(self):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,2400,900);c=cairo.Context(s);rs=np.random.default_rng(48)
  for layer in range(3):
   n=28 if layer==0 else 21
   for i in range(n):
    x=i*2400/n+rs.uniform(-20,20);ww=rs.uniform(48,115);hh=rs.uniform(130,420)*(1+layer*.15);y=820-hh+layer*28;dd=14+layer*7
    front=['#263b4c','#192d3d','#101e2a'][layer];side=['#334853','#243943','#172b34'][layer]
    poly(c,[(x,y),(x+ww,y),(x+ww,y+hh),(x,y+hh)],front)
    poly(c,[(x+ww,y),(x+ww+dd,y-dd),(x+ww+dd,y+hh-dd),(x+ww,y+hh)],side)
    poly(c,[(x,y),(x+dd,y-dd),(x+ww+dd,y-dd),(x+ww,y)],'#3a4850',.6)
    for iy in range(int(hh/23)-1):
     for ix in range(int(ww/17)-1):
      if rs.random()<.40:
       rect(c,x+10+ix*17,y+12+iy*23,5,8,'#e8bd79',rs.uniform(.18,.82))
    if i%7==0:line(c,[(x+ww/2,y),(x+ww/2,y-44)],'#617177',1,.7)
  return s
 def make_cake(self):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,600,600);c=cairo.Context(s)
  for i in range(24):
   a=i*TAU/24;circle(c,300+218*math.cos(a),300+218*math.sin(a),39,'#a56f36')
  circle(c,300,300,230,'#c9924f');circle(c,300,292,216,'#d9ac68');circle(c,300,292,199,'#b47b3a',1,5)
  circle(c,300,292,182,'#ead097',.6,3)
  for i in range(16):
   a=i*TAU/16
   c.save();c.translate(300,292);c.rotate(a)
   c.new_path();c.move_to(88,0);c.curve_to(146,-38,188,-25,169,0);c.curve_to(188,25,146,38,88,0);col(c,'#a97132',.85);c.set_line_width(4);c.stroke();c.restore()
  circle(c,300,292,88,'#ae7131',1,5);circle(c,300,292,77,'#edcc89',.7,3)
  text(c,TEXT['reunion'],300,256,56,'#925c29','bold',align='center')
  return s
 def make_branch(self):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,750,900);c=cairo.Context(s);rs=np.random.default_rng(5)
  def branch(x,y,l,a,depth):
   ex=x+l*math.cos(a);ey=y+l*math.sin(a)
   curve(c,[(x,y),(lerp(x,ex,.45)-10,y-10),(lerp(x,ex,.75),lerp(y,ey,.75)),(ex,ey)],'#796548',max(1,depth*1.5),.85)
   if depth:
    for k in range(2):branch(ex,ey,l*.66,a+(-.58 if k==0 else .54)+rs.uniform(-.12,.12),depth-1)
   else:
    for i in range(5):
     xx=ex+rs.uniform(-20,20);yy=ey+rs.uniform(-20,20)
     for a2 in range(4):circle(c,xx+4*math.cos(a2*PI/2),yy+4*math.sin(a2*PI/2),3.5,'#e2bd70',.7)
    c.save();c.translate(ex,ey);c.rotate(a);ellipse(c,-12,-14,22,6,'#7c8c68',.72);c.restore()
  branch(750,40,215,PI*.84,5)
  return s
A=None

def background(ctx,bright=False): paint(ctx,A.paper if bright else A.night)
def stars(ctx,t,a=1):
 for x,y,r,ph in A.stars:circle(ctx,x,y,r,CREAM,a*(.22+.25*(.5+.5*math.sin(t*.6+ph))))
def dust(ctx,t,a=.4,color=GOLD):
 for x,y,r,ph in A.dust:
  xx=(x+math.sin(t*.18+ph)*30+t*2)%W;yy=(y-t*(3+r))%H
  circle(ctx,xx,yy,r,color,a*(.3+.5*(math.sin(ph+t*.24)*.5+.5)))
def moon(ctx,x,y,r,a=1,halo=True):
 if halo:glow(ctx,x,y,r*2.7,GOLD,.17*a)
 paint(ctx,A.moon,x-r,y-r,2*r,2*r,a)
def ruled(ctx,c=INK,a=.11):
 for y in range(200,950,54):line(ctx,[(80,y),(1840,y)],c,1,a)
def pencil(ctx,pts,width=2,a=1,c=INK,close=False):
 line(ctx,pts,c,width,a,close)
 pts2=[(x+math.sin(i*2.2+x*.01)*2.2,y+math.cos(i*1.4+y*.01)*1.7) for i,(x,y) in enumerate(pts)]
 line(ctx,pts2,c,max(.7,width*.48),a*.3,close)
def tree(ctx,x,y,s=1,ink=False):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 c='#263e39' if ink else '#52665a'
 curve(ctx,[(0,0),(25,-95),(-20,-240),(40,-340)],c,15,.8)
 for k in range(9):
  yy=-90-k*25;xx=math.sin(k*1.7)*25;sgn=(-1)**k
  curve(ctx,[(xx,yy),(xx+sgn*45,yy-15),(sgn*70,yy-55),(sgn*(95+k*3),yy-70)],c,max(1,5-k*.3),.7)
  for j in range(6):
   cx=sgn*(60+j*13)+xx*.2;cy=yy-50+math.sin(j*2+k)*24
   ellipse(ctx,cx,cy,34,16,c,.20 if ink else .12)
 ctx.restore()
def roof(ctx,x,y,w,h,c,fill=True,a=1):
 ctx.new_path();ctx.move_to(x,y);ctx.curve_to(x+w*.22,y+h*.24,x+w*.4,y-h*.7,x+w*.5,y-h)
 ctx.curve_to(x+w*.6,y-h*.7,x+w*.78,y+h*.24,x+w,y)
 ctx.curve_to(x+w*.83,y+h*.37,x+w*.65,y+h*.33,x+w*.5,y+h*.28)
 ctx.curve_to(x+w*.35,y+h*.33,x+w*.17,y+h*.37,x,y);ctx.close_path();col(ctx,c,a)
 if fill:ctx.fill()
 else:ctx.set_line_width(2);ctx.stroke()
 for k in range(1,13):
  xx=x+w*k/13;line(ctx,[(xx,y+6),(lerp(xx,x+w/2,.11),y-10-h*(1-abs(k/6.5-1))*.7)],c,1,a*.42)
def pavilion(ctx,x,y,s=1,c=INK,filled=False):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 roof(ctx,-185,-200,370,80,c,filled)
 for xx in [-130,130]:
  if filled:rect(ctx,xx-6,-183,12,177,c,.88)
  else:pencil(ctx,[(xx-6,-183),(xx+6,-183),(xx+6,-8),(xx-6,-8)],1.7,.8,c,True)
 line(ctx,[(-155,0),(155,0)],c,5,.8)
 line(ctx,[(-150,-55),(150,-55)],c,2,.75)
 for xx in range(-145,150,30):line(ctx,[(xx,-53),(xx,-6)],c,1.5,.7)
 for k in range(3):line(ctx,[(-165-k*14,k*9),(165+k*14,k*9)],c,2,.65)
 ctx.restore()
def lantern(ctx,x,y,s=1,t=0,a=1):
 ctx.save();ctx.translate(x,y);ctx.rotate(math.sin(t*1.7+x)*.045);ctx.scale(s,s)
 line(ctx,[(0,-35),(0,-5)],GOLD,1,.7*a);glow(ctx,0,20,85,'#ebb876',.18*a)
 ellipse(ctx,0,20,26,35,'#d89a5b',.82*a)
 for xx in [-13,0,13]:ellipse(ctx,xx*.35,20,22-abs(xx)*.5,34,'#ffe4ad',.23*a,1)
 line(ctx,[(-15,-14),(15,-14)],'#6b4b31',4,a);line(ctx,[(-15,54),(15,54)],'#6b4b31',4,a)
 line(ctx,[(0,54),(0,77)],GOLD,2,.8*a);ctx.restore()
def person(ctx,x,y,s=1,c='#273c3c',pose='stand',t=0):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 bob=math.sin(t*2)*1.3
 ellipse(ctx,0,-115+bob,16,19,c)
 ctx.new_path();ctx.move_to(-13,-92+bob);ctx.curve_to(-29,-79,-31,-43,-25,-24);ctx.curve_to(-10,-18,10,-19,25,-24);ctx.curve_to(30,-45,22,-88,10,-92+bob);ctx.close_path();col(ctx,c);ctx.fill()
 if pose=='sit':
  curve(ctx,[(-15,-26),(-10,-6),(18,-8),(28,0)],c,12)
  line(ctx,[(26,0),(26,41)],c,11)
  curve(ctx,[(18,-72),(43,-55),(43,-52),(63,-61)],c,9)
 elif pose=='walk':
  a=math.sin(t*5)*18
  line(ctx,[(-12,-24),(-10+a,17),(-19+a,53)],c,11)
  line(ctx,[(12,-24),(10-a,17),(22-a,53)],c,11)
  line(ctx,[(-20,-80),(-37-a*.4,-40)],c,8)
  line(ctx,[(20,-80),(37+a*.4,-40)],c,8)
 elif pose=='phone':
  line(ctx,[(-10,-24),(-12,42)],c,12);line(ctx,[(12,-24),(14,42)],c,12)
  curve(ctx,[(20,-80),(34,-62),(36,-54),(47,-78)],c,8)
  rr(ctx,39,-96,17,29,3,GOLD,.8)
 else:
  line(ctx,[(-10,-24),(-12,42)],c,12);line(ctx,[(12,-24),(14,42)],c,12)
  line(ctx,[(-19,-80),(-32,-37)],c,8);line(ctx,[(19,-80),(34,-44)],c,8)
 ctx.restore()
def small_cake(ctx,x,y,r=34):paint(ctx,A.cake,x-r,y-r,r*2,r*2)
def table(ctx,x,y,s=1,bright=False):
 ctx.save();ctx.translate(x,y);ctx.scale(s,s)
 c='#997546' if bright else '#8d6641'
 line(ctx,[(-132,5),(-144,162)],c,13);line(ctx,[(132,5),(146,162)],c,13)
 ellipse(ctx,0,5,208,57,'#533e2e',.5);ellipse(ctx,0,-4,210,56,c)
 ellipse(ctx,0,-12,199,48,'#b18b57' if bright else '#ba9660')
 ellipse(ctx,8,-19,73,23,'#e5d6b6');small_cake(ctx,-10,-23,24);small_cake(ctx,34,-23,20)
 for xx in [-123,122]:
  ellipse(ctx,xx,-18,18,8,'#e9dfc6');rect(ctx,xx-15,-19,30,22,'#d6ccb6');ellipse(ctx,xx,2,15,6,'#c8bda5')
 ctx.restore()
def window(ctx,x,y,w,h,lit=True):
 rr(ctx,x,y,w,h,w*.48,'#b99968' if lit else '#263642',.78)
 rr(ctx,x+13,y+13,w-26,h-26,w*.43,'#20323c',1)
 if lit:
  g=cairo.LinearGradient(0,y,0,y+h);g.add_color_stop_rgb(0,.06,.15,.20);g.add_color_stop_rgb(1,.40,.33,.22)
  ctx.save();rr(ctx,x+13,y+13,w-26,h-26,w*.43,'#20323c');ctx.restore()
 line(ctx,[(x+w/2,y+16),(x+w/2,y+h)],'#7e6d52',6,.9)
 line(ctx,[(x+15,y+h*.55),(x+w-15,y+h*.55)],'#7e6d52',6,.9)


def town(ctx,t,xoff=0,ybase=741,scale=1,ink=True):
 ctx.save();ctx.translate(xoff,ybase);ctx.scale(scale,scale)
 c='#28534f' if ink else GOLD
 for i in range(9):
  x=135+i*170;h=70+(i%3)*17
  rect(ctx,x,-h,132,h,c,.75)
  roof(ctx,x-15,-h-5,163,47,c,True,.85)
  for k in range(3):
   rect(ctx,x+19+k*31,-h+21,13,24,'#eedeb1',.57)
   line(ctx,[(x+25+k*31,-h+21),(x+25+k*31,-h+45)],c,1,.75)
  if i%2==0:lantern(ctx,x+134,-h+20,.33,t,.7)
  if i%3==1:
   rect(ctx,x+21,-h-52,88,46,c,.82)
   roof(ctx,x+5,-h-55,119,34,c,True,.9)
   for k in range(3):rect(ctx,x+32+k*24,-h-37,11,17,'#eedeb1',.57)
   line(ctx,[(x+8,-h+2),(x+122,-h+2)],c,4,.8)
 # Arched stone bridge and river boat.
 ctx.new_path();ctx.move_to(657,23);ctx.curve_to(730,-82,842,-82,922,23);ctx.line_to(883,23);ctx.curve_to(824,-40,749,-40,696,23);ctx.close_path();col(ctx,c,.86);ctx.fill()
 for xx in range(682,900,26):
  yy=-math.sin((xx-658)/265*PI)*66+10;line(ctx,[(xx,yy),(xx,yy-20)],c,2,.65)
 curve(ctx,[(676,-4),(730,-90),(849,-90),(905,-4)],c,2,.8)
 ctx.restore()


def history_tile(ctx,k,x,y,w,h,t):
 ctx.save();rr(ctx,x,y,w,h,8,CREAM if k<2 else '#16303b');ctx.rectangle(x+3,y+3,w-6,h-6);ctx.clip()
 ctx.translate(x,y);ctx.scale(w/480,h/300)
 if k==0:
  circle(ctx,355,92,45,INK,.55,2)
  for j in range(12):line(ctx,[(25+j*13,275),(27+j*13,195+math.sin(j)*25)],INK,1,.6)
  pavilion(ctx,210,256,.45,INK,False)
 elif k==1:
  for j in range(3):paint(ctx,A.hills[j],-160,-20+j*27,720,400,.6)
  circle(ctx,353,85,43,'#d9c799',.6);pavilion(ctx,195,244,.42,INK,True)
 elif k==2:
  circle(ctx,350,84,42,GOLD,.8,1);pavilion(ctx,195,247,.5,GOLD,False)
 else:
  paint(ctx,A.city,-70,0,670,315,.8);circle(ctx,350,82,40,GOLD,.9)
 ctx.restore()

```

### 13/17 · `MidAutumn_60s_Final/src/film60.py`
<!-- casebook-file {"path": "MidAutumn_60s_Final/src/film60.py", "lines": 756, "final_newline": true, "sha256": "a2d7c62833e4fc0e39620ced0a37c02a10217d11fc78b580f95435377435dada", "original_sha256": "a2d7c62833e4fc0e39620ced0a37c02a10217d11fc78b580f95435377435dada"} -->
```python
#!/usr/bin/env python3
"""60-second, deterministic 2D/2.5D code film; all artwork is procedural.
Run --stills for the shot sheet or --render for the final 60 fps picture.
"""
from __future__ import annotations
import os, math, json, sys, time, argparse, subprocess
from pathlib import Path
from functools import lru_cache
import numpy as np
import cairo
from PIL import Image, ImageDraw, ImageFont
import artwork as V
from artwork import (W,H,PI,TAU,INK,CREAM,GOLD,NIGHT,clamp,smooth,ease,lerp,
                     rect,line,poly,circle,ellipse,rr,glow,arc,curve,paint,text,
                     text_surface,col,pencil,roof,pavilion,lantern,person,table,
                     window,small_cake,tree,moon,background,stars,dust,town)
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'timeline.json').read_text())
SC=DATA['scenes']; TX=DATA['words']; WISHES=DATA['wishes']
FPS=60; DURATION=60; A=None
BRIGHT={3,4,5,7,8}
INK2='#42605a'; TEAL='#8cc4c5'; ROSE='#cc8c6b'

def init():
 global A
 if A is None:
  ts=time.time(); A=V.Assets(); V.A=A
  print('Artwork initialized %.2fs'%(time.time()-ts),file=sys.stderr,flush=True)

def tag(c,label,bright=False):
 co=INK if bright else GOLD
 line(c,[(112,97),(158,97)],co,2,.78)
 text(c,label,174,77,25,co,'sans',tracking=1,a=.90)

def reveal(c,s,x,y,size=70,color=CREAM,font='bold',u=1,delay=0,align='left'):
 # 8-14-frame entrances rather than long empty fades.
 q=clamp((u-delay+.06)/.24); dy=(1-ease(q))*27
 alpha=.30+.70*smooth(q)
 return text(c,s,x,y+dy,size,color,font,a=alpha,align=align)

def caption(c,s,u,bright=False,y=895,size=58):
 if not bright:
  g=cairo.LinearGradient(0,y-74,0,H)
  g.add_color_stop_rgba(0,.02,.055,.075,0)
  g.add_color_stop_rgba(.53,.02,.055,.075,.70)
  g.add_color_stop_rgba(1,.02,.055,.075,.88)
  c.set_source(g);c.rectangle(0,y-74,W,H-y+74);c.fill()
 reveal(c,s,W/2,y,size,INK if bright else CREAM,'serif',u,align='center')

def flakes(c,t,amount=45,bright=False):
 co=INK if bright else GOLD
 for i in range(amount):
  x=(i*173.73+t*(24+(i%5)*7))%(W+120)-60
  y=(i*101.91-t*(13+i%13))%(H+60)-30
  a=.12+.18*(.5+.5*math.sin(i+t*1.5))
  if i%6==0:
   c.save();c.translate(x,y);c.rotate(t*.6+i)
   ellipse(c,0,0,5.5,2,co,a);c.restore()
  else:circle(c,x,y,1.2+i%3*.5,co,a)

def rim(c,t,bright=False):
 co=INK if bright else GOLD
 line(c,[(80,106),(80,52),(139,52)],co,1,.32)
 line(c,[(1780,1025),(1840,1025),(1840,970)],co,1,.32)
 line(c,[(113,1030),(1762,1030)],co,1,.12)
 line(c,[(113,1030),(113+1649*clamp(t/60),1030)],co,2,.65)
 text(c,TX['footer'],114,985,18,co,'sans',a=.6,tracking=1)
 text(c,'A SHARED MOON  /  60',1787,985,16,co,'sans',align='right',a=.53,tracking=1)

def cam(c,cx,cy,zoom,dx=0,dy=0):
 c.translate(cx+dx,cy+dy);c.scale(zoom,zoom);c.translate(-cx,-cy)

def steam(c,x,y,t,s=1):
 for j in range(3):
  q=(t*.48+j/3)%1;xx=x+(j-1)*14*s;yy=y-q*100*s
  curve(c,[(xx,yy),(xx-25*s,yy-30*s),(xx+24*s,yy-60*s),(xx+3*s,yy-94*s)],CREAM,2*s,.18*math.sin(q*PI))

def room(c,t,u,final=False):
 background(c);stars(c,t,.85)
 c.save();cam(c,1030,500,1.04+.20*(1-ease(u/(2.1 if not final else 4.5))),-u*3,0)
 moon(c,1435+math.sin(t*.35)*9,309,215,1)
 paint(c,A.city,-185-u*11,207,2290,915,.68)
 for k in range(16):
  yy=678+k*17;xx=(k*173+t*63)%2000
  line(c,[(xx,yy),(xx+34,yy-2)],GOLD,1.5,.13)
 rect(c,0,0,140,H,'#151e22',.96)
 rect(c,1735,0,185,H,'#131e25',.93)
 rect(c,135,0,27,998,'#9e7b4b',.95)
 rect(c,1736,0,22,999,'#886b46',.9)
 rect(c,153,703,1600,18,'#ad8a56',.8)
 rect(c,156,969,1604,27,'#977040',.95)
 for x in [660,1155]:rect(c,x,0,9,708,'#a7b9b3',.34)
 glow(c,460,890,730,'#efba72',.26)
 poly(c,[(0,882),(690,752),(1210,1080),(0,1080)],'#805b39')
 line(c,[(0,882),(690,752),(1210,1080)],'#d4a970',3,.7)
 ellipse(c,340,904,194,48,'#282c28',.4)
 ellipse(c,333,881,190,52,'#e1d2b5')
 c.save();c.translate(333,852);c.rotate(-.04+math.sin(u*.4)*.015)
 paint(c,A.cake,-154,-154,308,308);c.restore()
 ellipse(c,677,907,72,19,'#293227',.45)
 rr(c,628,799,99,95,17,'#d5cfb5');ellipse(c,678,800,49,14,'#f3e7cd')
 ellipse(c,678,800,39,9,'#7c5d3c');ellipse(c,737,841,26,29,'#d5cfb5',1,10)
 steam(c,680,779,t,1.4)
 c.save();c.translate(1780,100);c.rotate(math.sin(t*.7)*.013);paint(c,A.branch,-417,-136,674,840,.82);c.restore()
 flakes(c,t,34)
 c.restore()

def intro(c,t,u):
 room(c,t,u)
 tag(c,SC[0]['sub'])
 reveal(c,SC[0]['top'][:3],224,350,77,u=u)
 reveal(c,SC[0]['top'][3:],210,467,108,u=u,delay=.08)
 text(c,'THE MOON RETURNS. SO DO OUR THOUGHTS.',225,635,20,GOLD,'sans',tracking=1.1,a=.8)

def busy(c,t,u):
 background(c);stars(c,t,.4)
 moon(c,1540,269,185,.78)
 paint(c,A.city,-250-(u*104)%520,170,2610,990,.84)
 paint(c,A.city,-130+(u*66)%300,438,2130,790,.20)
 for i in range(65):
  yy=235+i*11;xx=(i*137-u*(380+i*31))%2650-370
  line(c,[(xx,yy),(xx+78+i*3,yy-10)],GOLD,1.4+i%3,.10+(i%6)*.035)
 for i in range(5):
  x=95+i*360-u*(12+i*4);y=189+55*math.sin(i*1.3+u*1.6)
  c.save();c.translate(x,y);c.transform(cairo.Matrix(1,.038*(-1)**i,-.12,1,0,0))
  rr(c,0,0,310,162,16,'#263e4e',.93);rr(c,0,0,310,162,16,TEAL,.48,1.5)
  labels=['08:30','10:45','14:00','18:20','23:59']
  text(c,labels[i],22,18,49,CREAM,'sans')
  for j in range(3):rect(c,23,99+j*13,245-j*48,3,TEAL,.3)
  circle(c,279,28,5,GOLD,.9);c.restore()
 cx,cy=960,583;r=211
 glow(c,cx,cy,380,TEAL,.15)
 for j in range(60):
  a=j*TAU/60;rrr=r+(j%5==0)*12
  line(c,[(cx+math.cos(a)*r,cy+math.sin(a)*r),(cx+math.cos(a)*(rrr+5),cy+math.sin(a)*(rrr+5))],CREAM,2,.55)
 arc(c,cx,cy,r-15,-PI/2,-PI/2+TAU*((u*.74)%1),GOLD,6,.92)
 for length,speed in [(170,5.8),(107,2.1)]:
  aa=u*speed
  line(c,[(cx,cy),(cx+math.sin(aa)*length,cy-math.cos(aa)*length)],GOLD,5,.9)
 circle(c,cx,cy,9,CREAM)
 caption(c,SC[1]['top'] if u<1.65 else SC[1]['sub'],u if u<1.65 else u-1.65,size=65)
 tag(c,'NOW / 24 HOURS, ALWAYS RUNNING')

def question(c,t,u):
 background(c);paint(c,A.city,-125,496,2100,670,.18)
 moon(c,1405,498,296,.59)
 for k in range(3):
  r=296+(u*95+k*56)%190
  circle(c,1405,498,r,GOLD,max(0,.32-(r-296)/700),1.3)
 reveal(c,SC[2]['top'],161,297,97,u=u)
 reveal(c,SC[2]['sub'],148,449,159,u=u,delay=.08)
 line(c,[(174,708),(727,708)],GOLD,2,.8)
 text(c,'DO YOU REMEMBER?',173,746,24,GOLD,'sans',tracking=3,a=.84)
 tag(c,TX['pause'])
 flakes(c,t,28)

def courtyard_art(c,t,u):
 c.save();cam(c,930,495,1.16,-u*12,-20)
 pencil(c,[(251,770),(251,245),(1110,245),(1110,775)],2.8,.7)
 roof(c,160,253,1048,185,INK,False,.83)
 for k in range(4):
  x=312+k*82;pencil(c,[(x,340),(x,706)],1.2,.36)
 for k in range(6):pencil(c,[(312,354+k*65),(597,354+k*65)],1.2,.36)
 window(c,719,336,282,318,False)
 circle(c,861,431,83,'#d8bb80',.63)
 table(c,798,714,1.22,True)
 person(c,546,713,1.0,'#52695e','sit',u*2.5)
 c.save();c.translate(1034,713);c.scale(-1,1);person(c,0,0,1.0,'#8c7b64','sit',u*2.5+.4);c.restore()
 person(c,795,834,.68,'#b49972','stand',u*3)
 q=(u*.56)%1;xx=lerp(639,927,q);yy=675-56*math.sin(q*PI)
 small_cake(c,xx,yy,28)
 curve(c,[(634,707),(686,667),(708,668),(738+q*60,668)],'#52695e',7,.6)
 tree(c,1375,817,1.40,True)
 for k in range(9):pencil(c,[(70,845+k*4),(1770,845+k*4)],.8,.16)
 lantern(c,1103,297,.94,u*2,.86)
 paint(c,A.branch,1240,20,690,818,.88)
 c.restore()

def memory(c,t,u):
 background(c,True);courtyard_art(c,t,u)
 tag(c,TX['remember']+' / A MOONCAKE TO SHARE',True)
 s=SC[3]['top']+SC[3]['sub']
 caption(c,s,u,True,899,58)
 flakes(c,t,20,True)

def cake_sectors(c,x,y,r,spread,rotation=0,alpha=1):
 for k in range(4):
  a=k*PI/2+rotation;mid=a+PI/4
  c.save();c.translate(x+math.cos(mid)*spread,y+math.sin(mid)*spread);c.rotate(rotation)
  c.new_path();c.move_to(0,0);c.arc(0,0,r*1.05,k*PI/2,(k+1)*PI/2);c.close_path();c.clip()
  paint(c,A.cake,-r,-r,r*2,r*2,alpha);c.restore()

def rewind(c,t,u):
 background(c,True)
 cx,cy=1300,465;r=260+u*42
 c.save();c.translate(cx,cy);c.rotate(-u*2.2);paint(c,A.cake,-r,-r,r*2,r*2);c.restore()
 for j in range(4):
  rr0=315+j*31;rot=-u*(1.8+j*.23)
  arc(c,cx,cy,rr0,rot+j,rot+j+4.55,INK,1.4,.35)
  for k in range(16):
   aa=k*TAU/16+rot
   line(c,[(cx+math.cos(aa)*rr0,cy+math.sin(aa)*rr0),(cx+math.cos(aa)*(rr0+9),cy+math.sin(aa)*(rr0+9))],INK,1.2,.35)
 labels=[TX['today'],TX['ming'],TX['song'],TX['tang'],TX['ancient']]
 for k,ss in enumerate(labels):
  aa=-.7+k*TAU/5-u*1.6
  xx=cx+math.cos(aa)*426;yy=cy+math.sin(aa)*426
  text(c,ss,xx,yy,28,INK,'sans',align='center',a=.82)
 reveal(c,SC[4]['top'],138,357,75,INK,u=u)
 reveal(c,SC[4]['sub'],144,486,48,INK,'serif',u=u,delay=.06)
 tag(c,'REWIND / '+TX['thousand'],True)
 line(c,[(145,650),(775,650)],INK,2,.25)
 for k in range(15):circle(c,150+k*43,650,3+(k==int(u*9)%15)*4,INK,.65)

def ancient(c,t,u):
 background(c,True)
 c.save();cam(c,1050,525,1.08,-u*14,0)
 circle(c,1450,355,206,'#d9c596',.47)
 arc(c,1450,355,212,-PI/2,-PI/2+TAU*min(1,.25+u*1.8),INK,2,.72)
 for j in range(6):
  yy=600+j*37
  pencil(c,[(x,yy+math.sin(x/230+j+u*.6)*19) for x in range(0,1980,27)],1,.18)
 for i in range(48):
  x=30+i*17.5;y=805;hh=98+68*(.5+.5*math.sin(i*2.3));sw=math.sin(t*2+i*.35)*13
  curve(c,[(x,y),(x-9,y-hh*.4),(x+sw,y-hh*.8),(x+sw+9,y-hh)],INK,1.6,.63)
  for k in range(6):
   yy=y-hh+k*10
   pencil(c,[(x+sw+8,yy),(x+sw-10,yy-14)],1.2,.55)
   pencil(c,[(x+sw+8,yy),(x+sw+25,yy-16)],1.2,.55)
 pencil(c,[(1010,661),(1475,661),(1500,685),(986,685),(1010,661)],2.5,.83)
 for x in [1025,1434]:pencil(c,[(x,685),(x-8,810)],3,.75)
 for xx in [1120,1380]:
  ellipse(c,xx,643,60,15,INK,.6,2)
  for j in range(3):circle(c,xx-29+j*28,630-(j%2)*12,17,INK,.7,1.5)
 pencil(c,[(1250,640),(1250,541)],1.6,.8)
 curve(c,[(1250,543),(1230+math.sin(t*3)*10,513),(1280,489),(1254,464)],INK,1.3,.45)
 person(c,906,755,1.15,'#6c7b69','stand',u*2)
 c.restore()
 tag(c,SC[5]['sub'],True)
 reveal(c,SC[5]['sub'],148,200,94,INK,u=u)
 text(c,'AUTUMN OFFERINGS / THE ROOTS OF A FESTIVAL',157,337,19,INK,'sans',a=.55,tracking=1)
 for k in range(6):
  x=183+k*85;y=453
  circle(c,x,y,24,INK,.12)
  arc(c,x,y,26,-PI/2,-PI/2+TAU*clamp((u+.10-k*.13)/.30),INK,1.5,.48)
  circle(c,x,y,3,INK,.16)
  if k<5:line(c,[(x+31,y),(x+53,y)],INK,1,.23)
 circle(c,183+clamp(u/2.3)*425,453,5,'#ad8950',.85)
 caption(c,SC[5]['top'],u,True,900,60)
 flakes(c,t,20,True)

def tang(c,t,u):
 background(c);stars(c,t,.9)
 c.save();cam(c,1030,500,1.06,-u*14,0)
 moon(c,1470,337,232)
 # Stable full silhouette underneath a fast metallic tracing pass.
 c.save();c.push_group();pavilion(c,627,731,1.95,GOLD,False);pp=c.pop_group();c.set_source(pp);c.paint_with_alpha(.28);c.restore()
 c.save();c.rectangle(100,120,1100*ease((u+.06)/.90),780);c.clip();pavilion(c,627,731,1.95,GOLD,False);c.restore()
 for k in range(22):
  xx=170+k*44;line(c,[(xx,766),(xx,834)],GOLD,1.5,.44)
 line(c,[(147,764),(1170,764)],GOLD,3,.7)
 line(c,[(147,835),(1170,835)],GOLD,3,.7)
 person(c,737,733,.88,'#e1cc99','stand',u*2)
 lantern(c,371,406,1.12,u*2);lantern(c,885,406,1.12,u*2+.6)
 tree(c,1780,841,1.3)
 for k in range(12):
  x=55+k*159+math.sin(k+u)*20;y=110+(k*113)%628-u*43
  lantern(c,x,y,.16+(k%3)*.06,u,.42)
 for k in range(8):
  y=791+k*15
  curve(c,[(1070,y),(1370,y-32+math.sin(u*2)*15),(1690,y+10),(1960,y-13)],TEAL,1,.16)
 c.restore()
 tag(c,SC[6]['sub'])
 reveal(c,TX['tang'],134,189,91,GOLD,u=u)
 caption(c,SC[6]['top'],u,False,899,63)
 flakes(c,t,42)

def song(c,t,u):
 background(c,True)
 moon(c,1490-u*11,310,199,.72,False)
 for j in range(4):
  paint(c,A.hills[j],-295-u*(42+j*27),290+j*15,2620,891,.66+j*.07)
 town(c,t*2,-88-u*26,736,1.16,True)
 for i in range(40):
  xx=(i*129-u*(27+i%7*6))%2050-90;yy=775+(i%8)*13
  line(c,[(xx,yy),(xx+62+(i%3)*24,yy)],INK2,1.2,.23)
 bx=1350-u*61
 poly(c,[(bx,861),(bx+142,861),(bx+113,882),(bx+28,882)],'#285148',.95)
 curve(c,[(bx+22,859),(bx+34,808),(bx+97,808),(bx+112,859)],'#285148',4,.85)
 person(c,bx+120,843,.3,'#29473f','stand',t*2)
 line(c,[(bx+126,818),(bx+160+math.sin(u*4)*14,879)],'#29473f',2,.8)
 tag(c,SC[7]['sub'],True)
 reveal(c,SC[7]['top'][:6],148,189,74,INK,'serif',u=u)
 reveal(c,SC[7]['top'][6:],148,302,84,INK,'serif',u=u,delay=.08)
 text(c,SC[7]['note'],158,427,29,INK,'sans',a=.87)
 text(c,'A WISH THAT CROSSED A THOUSAND YEARS',159,483,18,INK,'sans',a=.54,tracking=1)


def ming(c,t,u):
 background(c,True)
 for j in range(3):paint(c,A.hills[j],-150-u*(5+j*5),340+j*40,2250,805,.20)
 paint(c,A.branch,1380-u*10,-30,710,850,.80)
 x,y=1280,480;r=298
 ellipse(c,x,y+235,419,64,INK,.11)
 ellipse(c,x,y+70,360,315,'#aab498',.33)
 ellipse(c,x,y+28,346,294,'#f1e6ce')
 for j in range(3):circle(c,x,y,331+j*16,'#b59a68',.3,1.5)
 spread=59*smooth((u-.55)/1.4)
 cake_sectors(c,x,y,r,spread,-.10+u*.21)
 for k in range(24):
  aa=k*TAU/24+u*.2
  circle(c,x+math.cos(aa)*395,y+math.sin(aa)*341,2+(k%4==0)*2,'#b29661',.44)
 reveal(c,TX['reunion'],134,291,182,INK,u=u)
 reveal(c,SC[8]['sub'],152,529,41,INK,'serif',u=u)
 text(c,'A CIRCLE, SHARED.',156,609,22,INK,'sans',a=.6,tracking=2.5)
 tag(c,SC[8]['sub'],True)
 caption(c,SC[8]['top'],u,True,902,57)
 flakes(c,t,24,True)

def mosaic(c,t,u):
 background(c);stars(c,t,.7)
 join=smooth((u-1.13)/1.27)
 for k in range(4):
  bx=252+(k%2)*730;by=139+(k//2)*362
  sc=1-.88*join;ww=686*sc;hh=331*sc
  x=lerp(bx,960-ww/2,join);y=lerp(by,450-hh/2,join)
  c.save();c.translate(x+ww/2,y+hh/2);c.rotate((1-join)*math.sin(u*1.4+k)*.028)
  V.history_tile(c,k,-ww/2,-hh/2,ww,hh,t*2)
  rr(c,-ww/2,-hh/2,ww,hh,8,GOLD,.75,2);c.restore()
 if join>.12:moon(c,960,455,295,clamp((join-.12)/.70))
 arc(c,960,456,369,-u*1.6,-u*1.6+PI*1.55,GOLD,3,.54)
 caption(c,SC[9]['top'],u,False,903,59)
 tag(c,'FOUR MATERIALS / ONE THOUSAND YEARS')
 flakes(c,t,40)

def windows_moon(c,t,u):
 background(c);stars(c,t,.95)
 mx=lerp(960,1380,ease(u/.7));my=465;r=312+u*6
 moon(c,mx,my,r,.87)
 c.save();circle(c,mx,my,r-8,CREAM,0);c.arc(mx,my,r-10,0,TAU);c.clip()
 for j in range(23):
  for k in range(29):
   xx=mx+(k-14)*23;yy=my+(j-11)*26
   a=.18+.46*(.5+.5*math.sin(j*1.6+k*2.4+u*3.7))
   rr(c,xx-5,yy-8,10,16,1,'#fff2cb',a)
 c.restore()
 paint(c,A.city,-170-u*28,573,2360,620,.64)
 for j in range(3):
  aa=u*.55+j*2.1;arc(c,mx,my,r+35+j*20,aa,aa+2.0,GOLD,1.4,.35)
 reveal(c,SC[10]['top'][:5],137,330,80,u=u)
 reveal(c,SC[10]['top'][5:],132,451,117,u=u,delay=.08)
 text(c,'THE WAY WE MEET CHANGES. THE WISH DOES NOT.',146,631,18,GOLD,'sans',a=.8,tracking=.7)
 tag(c,SC[10]['sub'])
 flakes(c,t,62)

def bitten_cake(c,x,y,r,bite=False,rotation=0):
 c.save();c.translate(x,y);c.rotate(rotation)
 if bite:
  c.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
  c.rectangle(-r*1.1,-r*1.1,r*2.2,r*2.2)
  c.new_sub_path();c.arc(r*.68,-r*.63,r*.47,0,TAU);c.clip()
 paint(c,A.cake,-r,-r,r*2,r*2)
 c.restore()

def avatar(c,x,y,s,t,older=False,eating=True,phase=0):
 c.save();c.translate(x,y);c.scale(s,s)
 bob=math.sin(t*3+phase)*2.7;c.translate(0,bob)
 skin='#e4bb90' if not older else '#d9ae84'
 hair='#303332' if not older else '#7c8173'
 shirt='#47656b' if not older else '#a66550'
 # Soft shadow, cloth seam, collar, ear and hair details.
 ellipse(c,7,237,109,35,'#1b3034',.16)
 rr(c,-86,74,173,212,47,shirt)
 curve(c,[(-72,110),(-58,184),(-71,229),(-73,281)],'#cfb792',2,.3)
 poly(c,[(-33,80),(0,112),(34,80),(22,69),(-22,69)],'#efe0c5',.96)
 rr(c,-21,41,42,46,14,skin)
 ellipse(c,-57,6,15,22,skin);ellipse(c,57,6,15,22,skin)
 ellipse(c,0,-1,62,77,hair)
 ellipse(c,0,7,55,64,skin)
 # A swept fringe rather than a featureless silhouette.
 c.new_path();c.move_to(-57,-12);c.curve_to(-68,-90,70,-85,59,-1)
 c.curve_to(41,-6,24,-40,4,-45);c.curve_to(-9,-13,-42,-8,-57,-12);col(c,hair);c.fill()
 if older:
  for j in range(4):curve(c,[(-42+j*18,-38),(-33+j*15,-53),(-12+j*12,-54),(5+j*11,-39)],'#c1c2aa',2,.65)
 cycle=(t*.50+phase)%1
 reach=smooth(cycle/.25)*(1-smooth((cycle-.47)/.28)) if eating else .08
 chew=reach>.70
 for xx in [-22,23]:
  if chew:
   curve(c,[(xx-8,1),(xx-4,-5),(xx+5,-5),(xx+8,1)],'#343c37',3.3,.9)
  else:
   ellipse(c,xx,-1,3.2,4.7,'#343c37')
   curve(c,[(xx-8,-14),(xx-2,-17),(xx+4,-17),(xx+8,-14)],hair,2,.7)
 curve(c,[(-3,5),(-5,13),(-1,17),(5,16)],'#b88664',2,.7)
 curve(c,[(-12,29),(-6,35),(7,35),(13,28)],'#8e5848',2.5,.95)
 ellipse(c,-32,20,12,5,'#d8967d',.4);ellipse(c,33,20,12,5,'#d8967d',.4)
 # Left arm rests on the table; right hand raises a real cake to the mouth.
 curve(c,[(-66,109),(-103,158),(-105,205),(-50,219)],shirt,33)
 circle(c,-47,219,16,skin)
 hx=lerp(87,25,reach);hy=lerp(173,32,reach)
 curve(c,[(70,109),(116,132),(119,193),(hx,hy)],shirt,31)
 circle(c,hx,hy,17,skin)
 bitten_cake(c,hx-5,hy-8,31,cycle>.36,.08-reach*.35)
 line(c,[(hx+8,hy+8),(hx+15,hy)],'#c38e6c',2,.65)
 c.restore()

def screen_content(c,w,h,t,kind=0,eating=True):
 warm=kind==0
 rect(c,0,0,w,h,'#bc9a68' if warm else '#304b5e')
 if warm:
  # Warm living room with moonlit window and plant.
  rect(c,0,h*.72,w,h*.28,'#877257')
  window(c,w*.68,73,w*.25,h*.37,True)
  moon(c,w*.805,h*.24,w*.062,.83,False)
  tree(c,w*.10,h*.66,w/920,True)
  rect(c,0,62,w,5,'#ddc697',.5)
 else:
  moon(c,w*.79,h*.25,w*.105,.95)
  for k in range(6):
   xx=k*w/5;hh=95+(k%3)*48
   rect(c,xx,h*.69-hh,w*.16,hh,'#1c3547',.9)
   for j in range(3):rect(c,xx+15+j*15,h*.69-hh+24,6,11,GOLD,.65)
  line(c,[(0,h*.53),(w,h*.53)],TEAL,2,.35)
 if warm:
  avatar(c,w*.31,h*.355,w/610*.78,t,True,eating,.0)
  avatar(c,w*.69,h*.37,w/610*.74,t+.10,False,eating,.09)
 else:avatar(c,w*.49,h*.37,w/610*1.01,t,False,eating,.08)
 # Both cakes remain grounded in visible hands and plates.
 ellipse(c,w*.5,h*.87,w*.57,h*.15,'#ae8658')
 ellipse(c,w*.5,h*.84,w*.56,h*.12,'#dfbd87')
 for xx in [.24,.75]:
  ellipse(c,w*xx,h*.835,w*.10,h*.023,'#f0dfbe')
  small_cake(c,w*xx,h*.816,w*.047)
 steam(c,w*.18,h*.74,t,.65)
 rect(c,0,0,w,64,NIGHT,.15)
 circle(c,26,30,5,'#baddba')
 text(c,TX['call'],43,15,21,CREAM,'sans',a=.96)
 text(c,TX['home'] if warm else TX['here'],w-25,16,21,CREAM,'sans',align='right',a=.92)
 rect(c,0,h-55,w,55,NIGHT,.75)
 for j in range(3):circle(c,w*.5+(j-1)*59,h-29,17,'#bd7963' if j==1 else '#c5cbb9',.95)
 curve(c,[(w/2-7,h-29),(w/2-3,h-34),(w/2+4,h-34),(w/2+8,h-29)],CREAM,3,.96)


def video_card(c,x,y,w,h,t,kind=0,tilt=0,scale=1,eating=True):
 c.save();c.translate(x+w/2,y+h/2);c.rotate(tilt);c.transform(cairo.Matrix(scale,0,-tilt*.5,scale,0,0));c.translate(-w/2,-h/2)
 glow(c,w*.5,h*.5,w*.88,TEAL if kind else GOLD,.13)
 rr(c,11,15,w,h,28,'#040c11',.75)
 rr(c,0,0,w,h,28,'#6f8b90');rr(c,3,3,w-6,h-6,27,'#112736')
 c.save()
 c.new_path()
 for xx,yy,a in [(w-31,31,-PI/2),(w-31,h-31,0),(31,h-31,PI/2),(31,31,PI)]:c.arc(xx,yy,22,a,a+PI/2)
 c.close_path();c.clip();c.translate(9,9);screen_content(c,w-18,h-18,t,kind,eating);c.restore()
 rr(c,0,0,w,h,28,CREAM,.38,1.7)
 c.restore()

def connection(c,t,x1,y1,x2,y2):
 p=[(x1,y1),(x1+(x2-x1)*.28,y1-110),(x1+(x2-x1)*.7,y2-90),(x2,y2)]
 curve(c,p,GOLD,2,.55)
 for k in range(14):
  a=(t*.50+k/14)%1
  xx=(1-a)**3*p[0][0]+3*(1-a)**2*a*p[1][0]+3*(1-a)*a*a*p[2][0]+a**3*p[3][0]
  yy=(1-a)**3*p[0][1]+3*(1-a)**2*a*p[1][1]+3*(1-a)*a*a*p[2][1]+a**3*p[3][1]
  circle(c,xx,yy,3+(k%3==0),GOLD,.9)


def call_scene(c,t,u,eat=False):
 background(c);stars(c,t,.7)
 moon(c,960,286,191,.49)
 for j in range(5):ellipse(c,960,880+j*15,825+j*25,76+j*11,TEAL,.11,1.4)
 b=math.sin(u*1.9)*10;openq=ease(u/.5)
 video_card(c,145-(1-openq)*110,196+b,682,628,t,0,-.045+.018*math.sin(u*1.2),1,True)
 video_card(c,1093+(1-openq)*110,193-b,682,628,t+.16,1,.045-.018*math.sin(u*1.2),1,True)
 connection(c,t,826,449,1098,449)
 for j in range(3):
  circle(c,960,488,42+j*11+10*math.sin(u*2),GOLD,.15,1)
 small_cake(c,960,488,45)
 tag(c,TX['share'] if eat else 'NOW / SAME MOON, SAME MOMENT')
 caption(c,SC[12 if eat else 11]['top'],u,False,901,62)
 flakes(c,t,35)


def eat_macro(c,t,u):
 background(c);stars(c,t,.6)
 moon(c,960,238,176,.5)
 # A motivated close-up: from the whole call to the shared act of eating.
 for k in range(2):
  x=74 if k==0 else 995
  c.save();c.rectangle(x,173,850,658);c.clip()
  rect(c,x,173,850,658,'#b7976c' if k==0 else '#304b5c')
  if k==0:
   window(c,x+590,205,179,254,True)
   moon(c,x+680,287,48,.75,False)
   tree(c,x+99,695,.8,True)
  else:
   moon(c,x+663,278,86,.9)
   for j in range(5):
    xx=x+j*186;hh=152+(j%3)*54
    rect(c,xx,692-hh,137,hh,'#213744',.88)
    for jj in range(3):rect(c,xx+27+jj*27,720-hh,8,15,GOLD,.55)
  avatar(c,x+419,392,1.77,t+(k*.16),k==0,True,.04*k)
  ellipse(c,x+425,838,560,116,'#ac8459')
  ellipse(c,x+425,817,554,98,'#d8b780')
  for xx in [x+194,x+646]:
   ellipse(c,xx,805,94,24,'#f3e2bd');small_cake(c,xx,785,48)
  c.restore()
  rr(c,x,173,850,658,18,GOLD if k==0 else TEAL,.67,2)
  text(c,TX['home'] if k==0 else TX['here'],x+32,197,25,CREAM,'sans',a=.98)
  circle(c,x+813,215,6,'#b7dfbe')
 glow(c,960,504,114,GOLD,.2)
 connection(c,t,926,515,993,515)
 tag(c,TX['share'])
 caption(c,SC[12]['top'],u,False,903,67)
 flakes(c,t,22)


def shared(c,t,u):
 background(c);stars(c,t,.8)
 moon(c,960,487,243,.32)
 video_card(c,162-u*7,309,574,487,t,0,-.04)
 video_card(c,1185+u*7,309,574,487,t+.12,1,.04)
 connection(c,t,735,535,1187,535)
 ellipse(c,960,840,966,151,'#8a6444',.70)
 ellipse(c,960,814,937,140,'#c5a06b',.92)
 for xx in [565,1340]:
  ellipse(c,xx,801,117,28,'#eee0bc');small_cake(c,xx,773,65)
 circle(c,957,810,118,'#e9d7af',.85)
 cake_sectors(c,957,800,85,16+5*math.sin(u*2),u*.15)
 reveal(c,SC[13]['top'],960,121,72,u=u,align='center')
 reveal(c,SC[13]['sub'],960,215,83,u=u,delay=.05,align='center')
 flakes(c,t,40)


def night_windows(c,t,u):
 background(c);stars(c,t,.8)
 paint(c,A.city,-240-u*22,517,2440,675,.38)
 for k in range(46):
  xx=(k*139+t*12)%1940;yy=146+(k*83)%650
  rr(c,xx,yy,8+(k%4)*3,13+(k%3)*4,1,GOLD,.04+.05*math.sin(t*1.7+k)**2)


def heart(c,t,u,warm=False):
 night_windows(c,t,u);mx,my=1380,485;r=292
 glow(c,mx,my,598,GOLD,.25 if warm else .15)
 start=-PI*.37;end=PI*1.34
 arc(c,mx,my,r,start,end,GOLD,4,.88)
 arc(c,mx,my,r+17,start+.12,end-.1,TEAL,1,.33)
 aa=u*.55
 arc(c,mx,my,r+42,aa,aa+1.55,GOLD,1.5,.36)
 if not warm:
  moon(c,mx,my,r-16,.28,False)
  person(c,mx-160,my+132,.55,'#e0c898','phone',t*2)
  person(c,mx+162,my+131,.55,'#e0c898','phone',t*2+.5)
  reveal(c,SC[14]['top'],145,259,67,u=u)
  reveal(c,TX['reunion'],129,379,140,u=u,delay=.06)
  reveal(c,SC[14]['sub'][3:],145,582,73,u=u,delay=.1)
 else:
  reveal(c,SC[15]['top'],145,287,69,u=u)
  reveal(c,SC[15]['sub'],130,434,112,u=u,delay=.08)
  text(c,TX['hold'],150,632,31,GOLD,'serif',a=.85)
  target=-PI*.51;px=mx+r*math.cos(target);py=my+r*math.sin(target)
  for j in range(78):
   aa=j*2.39996+u*.22;rr0=47+math.sqrt(j)*27
   q=(u*.30+j*.037)%1
   x=lerp(mx+math.cos(aa)*rr0,px,q);y=lerp(my+math.sin(aa)*rr0*.84,py,q)
   circle(c,x,y,1.7+(j%3)*.7,GOLD,.2+.55*q)
   if j%7==0:curve(c,[(mx+math.cos(aa)*r,my+math.sin(aa)*r),(mx-70,my-120),(mx+40,my-130),(px,py)],GOLD,1,.11)
  glow(c,px,py,120,GOLD,.61);circle(c,px,py,7,'#fff2c8')
  person(c,mx-96,my+167,.68,'#dcca9c','phone',t*2)
  person(c,mx+90,my+167,.68,'#dcca9c','phone',t*2+.5)
  line(c,[(mx-46,my+125),(mx+40,my+124)],GOLD,2,.53)
 tag(c,'WHAT REUNION REALLY MEANS')
 flakes(c,t,48)


def study(c,t,u):
 night_windows(c,t,u)
 moon(c,1502,230,155,.94)
 for j in range(22):
  en=ease((u+.15-j*.035)/.44)
  x=834+j*35+(1-en)*210;y=870-j*28+(1-en)*100
  w=207
  poly(c,[(x,y),(x+w,y-26),(x+w+58,y+9),(x+58,y+35)],'#ede3c9',.45+j*.021)
  poly(c,[(x+58,y+35),(x+w+58,y+9),(x+w+58,y+23),(x+58,y+49)],'#93aeb0',.43)
  line(c,[(x+12,y+1),(x+175,y-19)],CREAM,1.4,.40)
  if j%3==0:line(c,[(x+53,y+8),(x+173,y-7)],INK,1,.28)
 st=4+u*4.8;xx=834+st*35+127;yy=870-st*28-14
 person(c,xx,yy,.56,'#243b45','walk',t*3)
 for j in range(18):
  q=(u*.43+j*.14)%1;x=875+j*43+60*math.sin(q*PI);y=735-j*24-q*195
  c.save();c.translate(x,y);c.rotate(-.18+math.sin(u*1.8+j)*.29)
  poly(c,[(-17,-27),(20,-27),(24,29),(-17,29)],CREAM,.22+j*.019)
  for k in range(3):line(c,[(-10,-9+k*8),(12,-9+k*8)],INK,1.2,.45)
  c.restore()
 reveal(c,SC[16]['top'],139,320,68,u=u)
 reveal(c,SC[16]['sub'][:5],139,447,87,u=u,delay=.05)
 reveal(c,SC[16]['sub'][5:],139,562,87,u=u,delay=.1)
 tag(c,TX['exam'])
 text(c,'TO EVERY STUDENT / KEEP YOUR LIGHT',151,713,20,GOLD,'sans',a=.82,tracking=1)
 flakes(c,t,39)


def science(c,t,u):
 night_windows(c,t,u);cx,cy=1390,490
 for j in range(5):
  c.save();c.translate(cx,cy);c.rotate(-.83+j*.59+u*.19);c.scale(1,.38+j*.045)
  arc(c,0,0,245+j*23,0,TAU,TEAL,2,.45)
  for k in range(4):
   aa=u*(1.5+j*.11)+k*TAU/4+j
   circle(c,math.cos(aa)*(245+j*23),math.sin(aa)*(245+j*23),5,GOLD,.92)
  c.restore()
 glow(c,cx,cy,246,GOLD,.31);circle(c,cx,cy,30,CREAM,.91)
 pts=[]
 for j in range(67):
  aa=j*2.399+u*.25;rr0=25+math.sqrt(j)*24
  xx=cx+math.cos(aa)*rr0;yy=cy+math.sin(aa)*rr0*.78
  pts.append((xx,yy));circle(c,xx,yy,2+(j%3)*.6,CREAM,.63)
  if j>0 and j%2:line(c,[pts[j-1],pts[j]],TEAL,1.3,.29)
 for k in range(24):
  xx=1040+k*31;line(c,[(xx,824),(xx,814-(k%4==0)*12)],TEAL,1.3,.6)
 reveal(c,SC[17]['top'],139,330,74,u=u)
 reveal(c,SC[17]['sub'][:5],139,463,87,u=u,delay=.05)
 reveal(c,SC[17]['sub'][5:],139,578,87,u=u,delay=.1)
 tag(c,'TO EVERY RESEARCHER / FOLLOW THE QUESTION')
 text(c,TX['research'],cx,868,26,GOLD,'sans',a=.83,align='center')
 flakes(c,t,40)


def poetry(c,t,u):
 background(c);stars(c,t,.9)
 moon(c,960,494,251,.36);glow(c,960,510,810,GOLD,.18)
 # A moving perspective wall. Rows use fixed lanes, avoiding popping labels.
 for row in range(10):
  y=115+row*86+9*math.sin(u*.8+row*.7)
  front=(row%3)/2;sz=26+int(front*10)
  speed=(32+row%4*11)*(-1 if row%2 else 1)
  for k in range(8):
   idx=(row*7+k)%len(WISHES);s=WISHES[idx]
   x=((k*335+row*127+u*speed)%2680)-320
   a=(.31+front*.48)*clamp((x+120)/180)*clamp((1940-x)/180)
   # Preserve the central reading aperture, while allowing text to pass behind it.
   if 366<y<654:
    dist=abs(x-960)
    a*=smooth((dist-400)/190)
   if a>.015:
    text(c,s,x,y,sz,GOLD if (k+row)%4==0 else CREAM,'sans',a=a,align='center')
 for j in range(4):ellipse(c,960,510,813+j*43,342+j*26,GOLD,.055,1.3)
 first=u<2.0;txt=SC[18]['top'] if first else SC[18]['sub']
 uu=u if first else u-2
 reveal(c,txt,960,453,76,u=uu,align='center')
 text(c,TX['bless'],960,356,42,GOLD,'serif',align='center',a=.94)
 text(c,'MAY EVERY JOURNEY FIND ITS LIGHT',960,595,21,GOLD,'sans',a=.84,align='center',tracking=2)
 flakes(c,t,62)


def invitation(c,t,u):
 background(c);stars(c,t,.8);moon(c,964,341,217,.40)
 video_card(c,224,128,600,576,t,0,-.038+u*.006)
 video_card(c,1098,128,600,576,t+.12,1,.038-u*.006)
 connection(c,t,825,409,1100,409)
 small_cake(c,963,456,67+math.sin(u*2)*3)
 reveal(c,SC[19]['top'],960,760,72,u=u,align='center')
 reveal(c,SC[19]['sub'],960,856,88,u=u,delay=.06,align='center')
 flakes(c,t,40)


def finale(c,t,u):
 room(c,t,u,True)
 # A luminous arc completes its movement; the text remains until frame 3599.
 arc(c,1435,309,244,-PI/2,-PI/2+TAU*clamp(.35+u*.30),GOLD,2,.75)
 for k in range(42):
  aa=k*2.399;rr0=230+(u*37+k*11)%226
  x=1435+math.cos(aa+u*.12)*rr0;y=309+math.sin(aa+u*.12)*rr0*.85
  circle(c,x,y,1.4+(k%3)*.7,GOLD,.36*(1-(rr0-230)/250))
 reveal(c,SC[20]['top'],223,320,151,u=u)
 reveal(c,SC[20]['sub'],229,534,56,u=u,delay=.06)
 text(c,TX['final'],234,639,40,GOLD,'serif',a=.93)
 tag(c,'TONIGHT / WE SHARE THE SAME MOON')
 text(c,DATA['title'],1470,886,28,CREAM,'serif',align='center',a=.94)

FUNCS=[intro,busy,question,memory,rewind,ancient,tang,song,ming,mosaic,windows_moon,
       lambda c,t,u:call_scene(c,t,u,False),eat_macro,shared,
       lambda c,t,u:heart(c,t,u,False),lambda c,t,u:heart(c,t,u,True),study,science,poetry,invitation,finale]


def scene_index(t):
 for i,s in enumerate(SC):
  if s['start']<=t<s['end']:return i
 return len(SC)-1

def plain(c,t,i=None):
 if i is None:i=scene_index(t)
 FUNCS[i](c,t,t-SC[i]['start'])
 rim(c,t,i in BRIGHT)

@lru_cache(maxsize=24)
def previous(i):
 s=cairo.ImageSurface(cairo.FORMAT_ARGB32,W,H);c=cairo.Context(s)
 plain(c,SC[i]['start']-1/FPS,i-1)
 return s

# Fast material wipes, not a dissolve between two simultaneously legible captions.
WIPES={3:'diagonal',4:'radial',5:'diagonal',6:'diagonal',7:'diagonal',8:'radial',9:'diagonal',10:'radial',13:'radial',16:'diagonal',17:'diagonal',18:'radial',19:'diagonal',20:'radial'}

def render_frame(c,t):
 i=scene_index(t);u=t-SC[i]['start'];d=.22 if i not in [4,8,10,20] else .27
 if i in WIPES and u<d:
  paint(c,previous(i));p=ease(u/d)
  c.save()
  if WIPES[i]=='radial':
   c.arc(1120,500,15+p*2250,0,TAU);c.clip()
  else:
   edge=-550+p*3100
   c.move_to(-100,-100);c.line_to(edge+350,-100);c.line_to(edge-150,H+100);c.line_to(-100,H+100);c.close_path();c.clip()
  plain(c,t,i);c.restore()
 else:plain(c,t,i)


def stills():
 init();qs=ROOT/'qa';qs.mkdir(exist_ok=True)
 times=[s['start']+min((s['end']-s['start'])*.53,1.8) for s in SC]
 thumbs=[]
 font=ImageFont.truetype(V.SANS,24,index=2)
 for i,t in enumerate(times):
  s=cairo.ImageSurface(cairo.FORMAT_ARGB32,W,H);c=cairo.Context(s);render_frame(c,t)
  fp=qs/f'shot_{i+1:02d}.png';s.write_to_png(str(fp))
  im=Image.open(fp).convert('RGB');im.thumbnail((640,360))
  card=Image.new('RGB',(640,399),'#091825');card.paste(im,(0,0))
  dr=ImageDraw.Draw(card);dr.text((12,367),f'{i+1:02d}  '+SC[i]['name'],font=font,fill='#edd3a4')
  thumbs.append(card)
 sheet=Image.new('RGB',(1920,399*7),'#091825')
 for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*640,(i//3)*399))
 sheet.save(qs/'storyboard_60s.jpg',quality=92)
 print('Stills complete',flush=True)


def render(start,end,out,crf=18):
 init();out=Path(out);out.parent.mkdir(parents=True,exist_ok=True)
 s=cairo.ImageSurface(cairo.FORMAT_ARGB32,W,H);c=cairo.Context(s)
 c.set_antialias(cairo.ANTIALIAS_BEST)
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','bgra','-video_size','1920x1080','-framerate',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf',str(crf),'-pix_fmt','yuv420p','-threads','1','-g','120','-movflags','+faststart',str(out)]
 p=subprocess.Popen(cmd,stdin=subprocess.PIPE);ts=time.time()
 a=round(start*FPS);b=round(end*FPS)
 try:
  for n in range(a,b):
   render_frame(c,n/FPS);s.flush();p.stdin.write(s.get_data())
   if (n-a)%240==0:print('%s %.2f/%.2fs | %.1f fps'%(out.name,n/FPS,end,(n-a+1)/(time.time()-ts)),file=sys.stderr,flush=True)
  p.stdin.close();ret=p.wait()
  if ret:raise RuntimeError('Encoder failed: %s'%ret)
 except BaseException:
  p.kill();raise
 print('COMPLETE',out,'in',round(time.time()-ts,1),'seconds',file=sys.stderr,flush=True)

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--stills',action='store_true');p.add_argument('--start',type=float,default=0);p.add_argument('--end',type=float,default=60);p.add_argument('--out',default=str(ROOT/'render'/'picture.mp4'));p.add_argument('--crf',type=int,default=18)
 args=p.parse_args()
 if args.stills:stills()
 else:render(args.start,args.end,args.out,args.crf)
```

### 14/17 · `MidAutumn_60s_Final/src/master_audio.py`
<!-- casebook-file {"path": "MidAutumn_60s_Final/src/master_audio.py", "lines": 19, "final_newline": true, "sha256": "a30488ea7ce75faa372ecdcc684739bc5c0c7a02db3e9abbec074b1b2b837e1f", "original_sha256": "a30488ea7ce75faa372ecdcc684739bc5c0c7a02db3e9abbec074b1b2b837e1f"} -->
```python
import subprocess,json,re
from pathlib import Path
import soundfile as sf
import numpy as np
p=Path(__file__).resolve().parents[1]
src=p/'assets'/'score60_raw.wav'
cmd=['ffmpeg','-hide_banner','-i',str(src),'-af','loudnorm=I=-16:TP=-1.3:LRA=9:print_format=json','-f','null','-']
r=subprocess.run(cmd,capture_output=True,text=True,check=True)
report=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0]
(p/'qa'/'audio_first_pass.json').write_text(json.dumps(report,indent=2))
a='loudnorm=I=-16:TP=-1.3:LRA=9:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}:linear=true:print_format=json'.format(**report)
tmp=p/'assets'/'score60_master_tmp.wav'
r=subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(src),'-af',a,'-ar','48000','-c:a','pcm_s24le',str(tmp)],capture_output=True,text=True,check=True)
(p/'qa'/'audio_second_pass.txt').write_text(r.stderr)
z,sr=sf.read(tmp,dtype='float32',always_2d=True)
z=z[:60*sr];z[int(5.5*sr):int(6*sr)]=0
sf.write(p/'assets'/'score60_master.flac',z,sr,subtype='PCM_24')
print('Mastered frames',len(z),'SR',sr,'peak',float(np.max(np.abs(z))))
tmp.unlink()
```

### 15/17 · `MidAutumn_60s_Final/src/music60.py`
<!-- casebook-file {"path": "MidAutumn_60s_Final/src/music60.py", "lines": 194, "final_newline": true, "sha256": "e50b270a9d79d54a0d011a0c5484f148deb0039c15af3c4af28a57b12898e5cb", "original_sha256": "e50b270a9d79d54a0d011a0c5484f148deb0039c15af3c4af28a57b12898e5cb"} -->
```python
#!/usr/bin/env python3
"""Original time-coded chamber score and synthetic Foley, rendered offline.
The locally installed TimGM6mb sample bank is not included in the project.
No copied song, copyrighted composition, or voice recording is used.
"""
from __future__ import annotations
import ctypes as C, ctypes.util, math, json, struct, os
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import butter,sosfilt

ROOT=Path(__file__).resolve().parents[1];SR=44100;DUR=60;N=SR*DUR
rng=np.random.default_rng(925)
lib=C.CDLL(ctypes.util.find_library('fluidsynth'))
def fn(name,restype,args):
 f=getattr(lib,name);f.restype=restype;f.argtypes=args;return f
ptr=C.c_void_p;I=C.c_int;F=C.c_float;D=C.c_double;S=C.c_char_p
settings=fn('new_fluid_settings',ptr,[])()
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.sample-rate',SR)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.gain',.52)
fn('fluid_settings_setint',I,[ptr,S,I])(settings,b'synth.polyphony',256)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.room-size',.72)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.damp',.48)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.width',76)
fn('fluid_settings_setnum',I,[ptr,S,D])(settings,b'synth.reverb.level',.27)
synth=fn('new_fluid_synth',ptr,[ptr])(settings)
bank=os.environ.get('MOON_SOUNDFONT','/usr/share/sounds/sf2/TimGM6mb.sf2')
loaded=fn('fluid_synth_sfload',I,[ptr,S,I])(synth,bank.encode(),1)
if loaded<0:raise RuntimeError('Unable to load sound bank: '+bank)
program=fn('fluid_synth_program_change',I,[ptr,I,I]);cc=fn('fluid_synth_cc',I,[ptr,I,I,I])
on=fn('fluid_synth_noteon',I,[ptr,I,I,I]);off=fn('fluid_synth_noteoff',I,[ptr,I,I])
write=fn('fluid_synth_write_float',I,[ptr,I,ptr,I,I,ptr,I,I])
programs={0:0,1:46,2:48,3:42,4:73,5:8,6:89,7:107,8:43,10:11}
for ch,p in programs.items():
 program(synth,ch,p);cc(synth,ch,7,{0:102,1:75,2:70,3:67,4:45,5:65,6:35,7:72,8:69,10:48}[ch]);cc(synth,ch,10,{0:57,1:40,2:76,3:45,4:79,5:73,6:64,7:36,8:62,10:85}[ch])
 cc(synth,ch,91,43 if ch in [0,1,5,7] else 29)
# New 120-bpm arrangement. Shared motif, new structure; no sped-up master audio.
PI=math.pi;TAU=2*PI
events=[]
def ev(t,kind,*args):
 if 0<=t<DUR:events.append((float(t),kind,*args))
def note(ch,n,t,d,vel=64):
 if t>=DUR:return
 ev(t,'on',ch,int(n),int(np.clip(vel,1,113)))
 ev(min(t+d,DUR-.012),'off',ch,int(n))
def ctrl(t,ch,num,val):ev(t,'cc',ch,num,int(np.clip(val,0,127)))
chords={'D':[38,50,57,62,66,69,76], 'G':[43,55,59,62,66,69,74],
        'Bm':[35,47,54,59,62,66,73], 'A':[33,45,57,61,64,69,74],
        'Em':[40,52,55,59,62,66,74]}
theme=[[(74,0,.70),(78,1,.70),(81,2,1.45)],[(78,0,.8),(76,1.5,.65),(74,2.5,1.1)],
       [(71,0,.7),(74,1.2,.7),(78,2.5,1.1)],[(76,0,1.2),(73,1.6,.6),(69,2.7,1)],
       [(74,0,.9),(76,1,.75),(78,2.5,1)],[(81,0,.65),(83,1,.7),(81,2.2,1.4)]]
# Exact editorial intervals, with a 0.5-second beat within each interval.
bars=[(0,2,'D','intro'),(2,2,'Bm','busy'),(4,1.5,'A','busy'),
      (6,2,'Bm','memory'),(8,1.5,'G','memory'),(9.5,1.5,'A','rewind')]
for i,t in enumerate(np.arange(11,24,2)):
 bars.append((float(t),min(2,24-t),['D','G','Bm','A','D','G','A'][i],'history'))
for i,t in enumerate(np.arange(24,36,2)):
 bars.append((float(t),2,['D','G','Bm','A','G','A'][i],'present'))
bars.extend([(36,2,'Bm','heart'),(38,2,'G','heart'),(40,2,'A','heart')])
for i,t in enumerate(np.arange(42,52,2)):
 bars.append((float(t),2,['D','G','Bm','Em','A'][i],'wishes'))
bars.extend([(52,2,'D','invitation'),(54,1.5,'A','invitation')])
for bi,(t0,dur,key,style) in enumerate(bars):
 ch=chords[key];beat=.5
 energy={'intro':.56,'busy':.72,'memory':.50,'rewind':.70,'history':.76,'present':.77,'heart':.60,'wishes':.96,'invitation':.80}[style]
 note(0,ch[1],t0,dur*.88,44+energy*26)
 note(0,ch[2],t0+.027,dur*.80,34+energy*24)
 if style in ['history','present','wishes','invitation']:
  note(3,ch[1],t0+.05,dur-.07,40+energy*25)
  note(8,ch[0],t0,dur*.94,35+energy*18)
 # A clear eighth-note ostinato, leaving gaps in the reflective phrase.
 if style in ['memory','heart','intro']:
  positions=[.25,.9,1.45]
 else:positions=list(np.arange(.0,dur-.01,.25))
 for j,pos in enumerate(positions):
  if pos>=dur-.1:continue
  pitch=ch[3+j%4]+(12 if j%6==4 else 0)
  lead=7 if style in ['history','rewind'] else 1
  note(lead,pitch,t0+pos+.014, .24 if style not in ['heart','memory'] else .51,34+energy*21+(j%3)*3)
  if style=='wishes' and j%2==0:note(0,pitch+12,t0+pos+.019,.44,42)
 # Recurrent pentatonic melody, played rather than resampled.
 for n,pos,d in theme[bi%len(theme)]:
  when=t0+pos*beat+.035
  if when<t0+dur-.08:
   note(7 if style=='history' and bi<12 else 0,n,when,min(d*beat,t0+dur-when+.15),51+energy*24)
   if style in ['wishes','invitation']:note(5,n+12,when+.009,.8,40)
 # Bowed inner voices swell across the bar.
 if style not in ['intro','busy','memory']:
  for n in ch[3:6]:note(2,n,t0+.025,dur+.08,40+energy*30)
  for k in range(10):ctrl(t0+k*dur/10,2,11,54+math.sin(k/10*PI)*(22+energy*18))
  if style in ['heart','wishes','present','invitation']:
   for n in ch[3:5]:note(6,n+12,t0+.06,dur+.15,32+energy*10)
 # Percussion stays below the tune: pulse rather than trailer explosions.
 if style in ['busy','history','present','wishes']:
  for pos in [0,1.0]:
   if pos<dur:note(9,36,t0+pos,.16,40+energy*17)
  for pos in [.5,1.5]:
   if pos<dur:note(9,37,t0+pos,.1,29+energy*12)
  for j,pos in enumerate(np.arange(0,dur,.25)):
   note(9,42,t0+float(pos),.055,18+(j%2)*7+energy*6)
 if style=='history':
  note(4,ch[5]+12,t0+.8,min(.85,dur-.5),38)
 if style=='wishes':
  for n in ch[3:6]:note(2,n+12,t0+.2,dur-.05,46)
  note(10,ch[5]+12,t0+.02,1.0,37)
# A warm resolved D(add9) conclusion with an audible descending motif.
for n in [38,50,57,62,66,69,76]:note(0,n,55.5+(n%4)*.018,3.65,66 if n>57 else 52)
for n in [50,62,66,69,74]:note(2,n,55.54,3.05,60)
for n,t in [(81,55.65),(78,56.4),(76,57.18),(74,58.08)]:note(0,n,t,1.8,70)
note(5,86,55.54,2.9,43)
for ch in programs:ctrl(5.5,ch,120,0)
events.sort(key=lambda x:(x[0],0 if x[1] in ['off','cc'] else 1))
out=np.zeros((N,2),np.float32);last=0
for j,e in enumerate(events+[(DUR,'end')]):
 target=min(N,round(e[0]*SR))
 while last<target:
  count=min(16384,target-last);left=np.empty(count,np.float32);right=np.empty(count,np.float32)
  write(synth,count,left.ctypes.data,0,1,right.ctypes.data,0,1)
  out[last:last+count,0]=left;out[last:last+count,1]=right;last+=count
 if e[1]=='on':on(synth,*e[2:])
 elif e[1]=='off':off(synth,*e[2:])
 elif e[1]=='cc':cc(synth,*e[2:])
 if j%650==0:print('Music event',j,'/',len(events),flush=True)
fx=np.zeros_like(out)
def add(sig,t,amp=.04,pan=.5):
 at=int(t*SR);nn=min(len(sig),N-at)
 if nn<=0:return
 fx[at:at+nn,0]+=sig[:nn]*amp*math.sqrt(1-pan)
 fx[at:at+nn,1]+=sig[:nn]*amp*math.sqrt(pan)
def bell(t,f=880,amp=.03):
 tt=np.arange(int(1.7*SR))/SR
 sig=(np.sin(TAU*f*tt)*np.exp(-tt*3.2)+.24*np.sin(TAU*f*2.76*tt)*np.exp(-tt*6))*(1-np.exp(-tt*160))
 add(sig,t,amp,.58)
def whoosh(t,d=.28,amp=.044,pan=.5):
 tt=np.arange(int(d*SR))/SR
 z=sosfilt(butter(2,[420,6000],btype='bandpass',fs=SR,output='sos'),rng.normal(size=len(tt)))
 env=np.sin(PI*tt/d)**1.8
 add(z*env,t,amp,pan)
def click(t,amp=.025):
 tt=np.arange(int(.045*SR))/SR;z=rng.normal(size=len(tt))*np.exp(-tt*140)
 add(z,t,amp,.3+.4*((t*5)%1))
def thump(t,amp=.065):
 tt=np.arange(int(.36*SR))/SR;phase=TAU*(70*tt+35*(1-np.exp(-tt*20))/20)
 sig=np.sin(phase)*np.exp(-tt*12)*(1-np.exp(-tt*400))
 add(sig,t,amp,.5)
PI=math.pi;TAU=PI*2
cuts=[2,7,9.5,11,13.5,16,19,21.5,24,27,30,33.5,36,39,42,45,48,52,55.5]
for i,cut in enumerate(cuts):
 whoosh(max(0,cut-.14),.28,.035 if cut<36 else .045,.25+.5*(i%2))
for tt in np.arange(2.1,5.48,.20):click(float(tt),.029+(tt-2)*.003)
for tt in [11,16,24,36,42,48,55.5]:thump(tt,.057 if tt<42 else .075)
for tt in [6.0,13.5,19,39,42,55.5]:bell(tt,880 if tt<24 else 1108.73,.025)
bell(27.06,659.25,.024);bell(27.22,880,.024)
for tt in [30.72,32.72,53.02]:
 z=rng.normal(size=int(.085*SR));z=sosfilt(butter(2,[900,3500],btype='bandpass',fs=SR,output='sos'),z)
 z*=np.exp(-np.arange(len(z))/SR*65);add(z,tt,.017,.5)
for tt in [7,9.5,11,16,19,42]:
 d=.15;ttt=np.arange(int(d*SR))/SR
 z=sosfilt(butter(2,3500,fs=SR,output='sos'),rng.normal(size=len(ttt)))
 add(z*np.sin(PI*ttt/d)**2,tt,.028,.4)
# Subtle stereo air and natural tails; no narrator is synthesized.
for delay,gain in [(.10,.10),(.22,.06)]:
 n=int(delay*SR);fx[n:]+=fx[:-n,::-1]*gain
mix=out+fx
mix[int(5.5*SR):int(6*SR)]=0
n=int(.005*SR);mix[int(5.5*SR)-n:int(5.5*SR)]*=np.linspace(1,0,n)[:,None]
mix[int(6*SR):int(6*SR)+n]*=np.linspace(0,1,n)[:,None]
mix[:int(.07*SR)]*=np.linspace(0,1,int(.07*SR))[:,None]
n=int(.82*SR);mix[-n:]*=np.linspace(1,0,n)[:,None]**1.3
peak=float(np.abs(mix).max());mix*=.88/max(.88,peak)
(ROOT/'assets').mkdir(exist_ok=True)
sf.write(ROOT/'assets'/'score60_raw.wav',mix,SR,subtype='PCM_24')
# Standard MIDI file, editable without any instrument bank being distributed.
def vlq(v):
 a=[v&127];v>>=7
 while v:a.append((v&127)|128);v>>=7
 return bytes(reversed(a))
me=[]
for ch,p in programs.items():me.append((0,bytes([0xc0+ch,p])))
for e in events:
 tt=round(e[0]*960)
 if e[1]=='on':msg=bytes([0x90+e[2],e[3],e[4]])
 elif e[1]=='off':msg=bytes([0x80+e[2],e[3],0])
 else:msg=bytes([0xb0+e[2],e[3],e[4]])
 me.append((tt,msg))
me.sort(key=lambda x:x[0]);track=b'\x00\xff\x51\x03\x07\xa1\x20';prev=0
for tt,msg in me:track+=vlq(tt-prev)+msg;prev=tt
track+=b'\x00\xff\x2f\x00'
(ROOT/'assets'/'score60.mid').write_bytes(b'MThd'+struct.pack('>IHHH',6,0,1,480)+b'MTrk'+struct.pack('>I',len(track))+track)
(ROOT/'assets'/'audio_cues.json').write_text(json.dumps({'duration':60,'bpm':120,'editorial_silence':[5.5,6.0],'cuts':cuts,'bars':bars,'events':len(events),'narration':False},indent=2,default=lambda x: x.item()))
fn('delete_fluid_synth',None,[ptr])(synth);fn('delete_fluid_settings',None,[ptr])(settings)
print('New 60s score rendered. Peak before scaling:',peak,flush=True)
```

### 16/17 · `MidAutumn_60s_Final/subtitles_zh.srt`
<!-- casebook-file {"path": "MidAutumn_60s_Final/subtitles_zh.srt", "lines": 101, "final_newline": true, "sha256": "c1f81eae91a8f14b61e03b10b43690b5f46a2831f2e98ccf8c372540a69868a9", "original_sha256": "c1f81eae91a8f14b61e03b10b43690b5f46a2831f2e98ccf8c372540a69868a9"} -->
```srt
1
00:00:00,000 --> 00:00:02,000
今晚，月亮又圆了。

2
00:00:02,000 --> 00:00:03,650
可生活，越走越快。

3
00:00:03,650 --> 00:00:05,500
忙到忘了，为什么过中秋。

4
00:00:05,500 --> 00:00:07,000
你还记得
中秋吗？

5
00:00:07,000 --> 00:00:09,500
小时候，一块月饼，
总要分着吃。

6
00:00:09,500 --> 00:00:11,000
把时间，往回拨。
一轮月，照过千年。

7
00:00:11,000 --> 00:00:13,500
从祭月、谢秋的习俗走来。

8
00:00:13,500 --> 00:00:16,000
明月入诗，也入思念。

9
00:00:16,000 --> 00:00:19,000
但愿人长久，千里共婵娟。

10
00:00:19,000 --> 00:00:21,500
把团圆，分进一块月饼。

11
00:00:21,500 --> 00:00:24,000
千年变的，是过节的方式。

12
00:00:24,000 --> 00:00:27,000
不变的，是想见你。

13
00:00:27,000 --> 00:00:30,000
相隔万里，也能同屏。

14
00:00:30,000 --> 00:00:33,500
你吃一口，我也吃一口。

15
00:00:33,500 --> 00:00:36,000
不在同一张桌，
也在彼此心里。

16
00:00:36,000 --> 00:00:39,000
后来才懂，
团圆，不是一切都圆满。

17
00:00:39,000 --> 00:00:42,000
是还没圆满时，
也有人惦念你。

18
00:00:42,000 --> 00:00:45,000
愿高考、考研的你，
落笔生花，走向天光。

19
00:00:45,000 --> 00:00:48,000
愿做科研的你，
长夜求索，终有回响。

20
00:00:48,000 --> 00:00:50,000
愿所有奔赴，都有回响。

21
00:00:50,000 --> 00:00:52,000
也愿你，好好照顾自己。

22
00:00:52,000 --> 00:00:55,500
今晚，和惦念的人，
一起吃块月饼吧。

23
00:00:55,500 --> 00:01:00,000
中秋快乐
愿你所念皆安，团团圆圆。
```

### 17/17 · `MidAutumn_60s_Final/timeline.json`
<!-- casebook-file {"path": "MidAutumn_60s_Final/timeline.json", "lines": 211, "final_newline": false, "sha256": "b36b4f8c7395e61d8da769d308e7e8e470e5b6d5a3b53c0caa747e4010f4cecc", "original_sha256": "b36b4f8c7395e61d8da769d308e7e8e470e5b6d5a3b53c0caa747e4010f4cecc"} -->
```json
{
  "title": "把日子，慢慢过圆",
  "duration": 60,
  "fps": 60,
  "scenes": [
    {
      "start": 0,
      "end": 2,
      "name": "今夜月圆",
      "top": "今晚，月亮又圆了。",
      "sub": "八月十五 · 中秋"
    },
    {
      "start": 2,
      "end": 5.5,
      "name": "忙碌的现在",
      "top": "可生活，越走越快。",
      "sub": "忙到忘了，为什么过中秋。"
    },
    {
      "start": 5.5,
      "end": 7,
      "name": "骤停与回望",
      "top": "你还记得",
      "sub": "中秋吗？"
    },
    {
      "start": 7,
      "end": 9.5,
      "name": "分着吃的月饼",
      "top": "小时候，一块月饼，",
      "sub": "总要分着吃。"
    },
    {
      "start": 9.5,
      "end": 11,
      "name": "时间倒流",
      "top": "把时间，往回拨。",
      "sub": "一轮月，照过千年。"
    },
    {
      "start": 11,
      "end": 13.5,
      "name": "祭月与谢秋",
      "top": "从祭月、谢秋的习俗走来。",
      "sub": "祭月 · 谢秋"
    },
    {
      "start": 13.5,
      "end": 16,
      "name": "唐代赏月",
      "top": "明月入诗，也入思念。",
      "sub": "唐 · 赏月"
    },
    {
      "start": 16,
      "end": 19,
      "name": "宋代佳节",
      "top": "但愿人长久，千里共婵娟。",
      "sub": "宋 · 佳节",
      "note": "苏轼《水调歌头》"
    },
    {
      "start": 19,
      "end": 21.5,
      "name": "明清团圆",
      "top": "把团圆，分进一块月饼。",
      "sub": "明清 · 团圆"
    },
    {
      "start": 21.5,
      "end": 24,
      "name": "千年风格汇聚",
      "top": "千年变的，是过节的方式。",
      "sub": "不变的，是想见你。"
    },
    {
      "start": 24,
      "end": 27,
      "name": "回到今天",
      "top": "不变的，是想见你。",
      "sub": "今天 · 相连"
    },
    {
      "start": 27,
      "end": 30,
      "name": "万里同屏",
      "top": "相隔万里，也能同屏。",
      "sub": "家那一端 · 你这一端"
    },
    {
      "start": 30,
      "end": 33.5,
      "name": "隔屏吃月饼",
      "top": "你吃一口，我也吃一口。",
      "sub": "一起吃月饼"
    },
    {
      "start": 33.5,
      "end": 36,
      "name": "同一份牵挂",
      "top": "不在同一张桌，",
      "sub": "也在彼此心里。"
    },
    {
      "start": 36,
      "end": 39,
      "name": "团圆不等于圆满",
      "top": "后来才懂，",
      "sub": "团圆，不是一切都圆满。"
    },
    {
      "start": 39,
      "end": 42,
      "name": "有人惦念你",
      "top": "是还没圆满时，",
      "sub": "也有人惦念你。"
    },
    {
      "start": 42,
      "end": 45,
      "name": "祝福学子",
      "top": "愿高考、考研的你，",
      "sub": "落笔生花，走向天光。"
    },
    {
      "start": 45,
      "end": 48,
      "name": "祝福求索者",
      "top": "愿做科研的你，",
      "sub": "长夜求索，终有回响。"
    },
    {
      "start": 48,
      "end": 52,
      "name": "祝福诗云",
      "top": "愿所有奔赴，都有回响。",
      "sub": "也愿你，好好照顾自己。"
    },
    {
      "start": 52,
      "end": 55.5,
      "name": "今晚一起吃月饼",
      "top": "今晚，和惦念的人，",
      "sub": "一起吃块月饼吧。"
    },
    {
      "start": 55.5,
      "end": 60,
      "name": "团团圆圆",
      "top": "中秋快乐",
      "sub": "愿你所念皆安，团团圆圆。"
    }
  ],
  "words": {
    "reunion": "团圆",
    "moon": "月",
    "autumn": "秋",
    "home": "家那一端",
    "here": "你这一端",
    "call": "视频已接通",
    "share": "一起吃月饼",
    "today": "今天",
    "tang": "唐",
    "song": "宋",
    "ming": "明清",
    "ancient": "祭月",
    "exam": "高考 · 考研",
    "research": "提出问题 · 反复验证 · 继续求索",
    "final": "今晚，一起吃月饼。",
    "footer": "同一轮月 · 同一份牵挂",
    "hold": "不用等一切圆满，才值得被爱。",
    "remember": "记忆",
    "time": "时光",
    "thousand": "千年",
    "bless": "愿你",
    "pause": "停一停",
    "hello": "来，吃月饼。",
    "back": "就等你了。"
  },
  "wishes": [
    "所念皆安",
    "所行皆坦",
    "学业有成",
    "求索有光",
    "归途平安",
    "心有所安",
    "与爱重逢",
    "与梦相逢",
    "高考加油",
    "考研加油",
    "致每一位求索者",
    "落笔生花",
    "平安喜乐",
    "今晚好好吃饭",
    "你不必完美",
    "你值得被爱",
    "长夜之后有天光",
    "所有努力都算数",
    "愿你被温柔以待",
    "愿前路不负热爱",
    "愿等候终有回音",
    "愿你心中常有光",
    "团团圆圆",
    "中秋快乐",
    "每次求索都有回响",
    "愿远方的你一切都好",
    "慢慢来，也没关系",
    "今夜共赏一轮月"
  ]
}
```

