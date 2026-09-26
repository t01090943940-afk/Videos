# supercut · 源码文件索引（自动生成）

> AI-Coding SuperVideos 合集总片（28 部代码视频的预告片）。原目录 `00-supercut-trailer/`。
> 源码已原样解压在 **`assets/cases/supercut/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show supercut <路径>`；拷出来改：`python3 scripts/casebook.py copy supercut <目标目录>`。

来源档案：

- `00-supercut-trailer` · dir · 882.7 MB

收录：文本 17 个（529.6 KB）· 二进制 7 个（650.8 KB，字体/小图）· 未收录 441 个（881.5 MB）

目录：文本文件 · 随附二进制（原样） · 未收录（视频 / 音频 / 大字体 / QA 图）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `README.md` | 62 | 4.2 KB | 00-supercut-trailer · AI-Coding SuperVideos 合集总片 V2 |
| `STORYBOARD.md` | 71 | 7.0 KB | STORYBOARD · AI-CODING SUPERVIDEOS 总片 V2（120s @150BPM · 4K120） |
| `_survey/index.txt` | 28 | 2.0 KB |  |
| `assets/vendor/gsap.min.js` | 11 | 71.2 KB | GSAP 3.15.0 |
| `audio/score.py` | 490 | 21.0 KB | 时变截止的低通：按 2048 样本分块，块内按中心频率滤波、跨块续状态。 |
| `index.html` | 2458 | 203.2 KB | AI-Coding SuperVideos · 通通开源 |
| `package-lock.json` | 2017 | 63.0 KB |  |
| `package.json` | 19 | 0.8 KB | npm scripts: prep, build, score, check, snapshot, render, ship |
| `src/catalog.mjs` | 141 | 9.8 KB | CATALOG · 合集里的 28 部代码视频（唯一真相源之一） |
| `src/code-lines.mjs` | 39 | 4.6 KB | 真实代码行 · 全部摘自合集里各作品的源码包 / CoExp 复盘中的代码片段（未改动一个字符，只截取单行） |
| `src/edl.mjs` | 399 | 23.1 KB | EDL · 整支片子的"乐谱"（唯一真相源）— V2 · 300 拍 / 120 s / 4K·120fps |
| `src/runtime.js` | 1077 | 54.0 KB | runtime.js · 整支片子 = 一个函数 render(t) |
| `src/style.css` | 373 | 32.6 KB | SUPERCUT · 视觉系统 |
| `tools/build.mjs` | 408 | 20.9 KB | build.mjs · EDL + 目录 → 静态 index.html（HyperFrames 合成）+ build/cues.json（配乐用） |
| `tools/dbg_probe.mjs` | 26 | 1.3 KB |  |
| `tools/prep_media.mjs` | 162 | 8.7 KB | prep_media.mjs · 把 28 部原片切成本片要用的代理素材 |
| `tools/qa_probe.mjs` | 31 | 2.3 KB | qa_probe.mjs · 用 Playwright 加载 index.html，抓 JS 错误/控制台，并按时刻渲染自查 |

## 随附二进制（原样）

| 路径 | 类型 | 大小 |
|---|---|---:|
| `assets/fonts/Barlow-600.ttf` | font | 83.9 KB |
| `assets/fonts/Barlow-800.ttf` | font | 85.5 KB |
| `assets/fonts/Barlow-900.ttf` | font | 86.5 KB |
| `assets/fonts/IBMPlexMono-500.ttf` | font | 126.9 KB |
| `assets/img/qr.png` | image | 2.6 KB |
| `assets/img/share-card.png` | image | 213.2 KB |
| `audio/__pycache__/score.cpython-314.pyc` | binary | 52.2 KB |

## 未收录（视频 / 音频 / 大字体 / QA 图）

| 路径 | 类型 | 大小 | sha256 | 如何补回 |
|---|---|---:|---|---|
| `_survey/sheet_01.jpg` | image | 119.1 KB | `87f71679a2b6` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_02.jpg` | image | 52.2 KB | `45e85e7ee7af` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_03.jpg` | image | 114.3 KB | `64665a6e26bb` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_04.jpg` | image | 107.1 KB | `17d95b492beb` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_05.jpg` | image | 68.1 KB | `23cfa20ec614` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_06.jpg` | image | 57.7 KB | `5e80de99979f` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_07.jpg` | image | 107.3 KB | `fd90207447ac` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_08.jpg` | image | 95.3 KB | `a90cc9620bb5` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_09.jpg` | image | 145.4 KB | `f71188b4fc63` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_10.jpg` | image | 116.4 KB | `330310041505` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_11.jpg` | image | 182.6 KB | `7a005e3f1187` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_12.jpg` | image | 57.9 KB | `8da44edd0e06` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_13.jpg` | image | 87.7 KB | `4130270c4d08` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_14.jpg` | image | 50.4 KB | `a3f133b473b5` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_15.jpg` | image | 103.0 KB | `65473da3860a` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_16.jpg` | image | 82.0 KB | `250b1c4fec61` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_17.jpg` | image | 143.3 KB | `5586c7f0488a` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_18.jpg` | image | 110.4 KB | `4d2df5affa02` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_19.jpg` | image | 101.6 KB | `4e3f17a1d7bb` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_20.jpg` | image | 67.2 KB | `7905acabbc20` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_21.jpg` | image | 62.9 KB | `832eff68ba93` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_22.jpg` | image | 99.7 KB | `9d3816adcc28` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_23.jpg` | image | 93.6 KB | `2a3bdc77f310` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_24.jpg` | image | 94.4 KB | `2c3fbb839ba5` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_25.jpg` | image | 125.3 KB | `2579da418cc1` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_26.jpg` | image | 171.5 KB | `2a4d2923af65` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_27.jpg` | image | 63.3 KB | `9eb0f3fe0ed2` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `_survey/sheet_28.jpg` | image | 70.9 KB | `3a2fe3b18d29` | 28 部成片的 20 格联系表（已缩制为各案例的 preview.jpg） |
| `assets/clips/a0.mp4` | video | 1.2 MB | `9d3cd5b76982` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/a1.mp4` | video | 681.9 KB | `d25829a8a7f8` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/a2.mp4` | video | 1018.0 KB | `902c3e82a0f2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/a3.mp4` | video | 2.6 MB | `b9eb6b15fdc1` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d01.mp4` | video | 945.3 KB | `fee58b7c1706` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d02.mp4` | video | 10.6 MB | `800cf2a30937` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d03.mp4` | video | 1.9 MB | `373966aea110` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d04.mp4` | video | 1.2 MB | `45624dae17d8` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d05.mp4` | video | 294.2 KB | `952865fac43d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d06.mp4` | video | 1.5 MB | `9e34d229b0e3` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d07.mp4` | video | 553.7 KB | `3e927036cf28` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d08.mp4` | video | 1.5 MB | `4143bb9b8804` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d09.mp4` | video | 411.0 KB | `7702cd511a2b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d10.mp4` | video | 265.1 KB | `9556fb488a53` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d11.mp4` | video | 585.0 KB | `5a654c45510b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d12.mp4` | video | 474.0 KB | `8401e7aeee91` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d13.mp4` | video | 715.3 KB | `12f75eee563b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d14.mp4` | video | 1.3 MB | `381f3db4940a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d15.mp4` | video | 1.6 MB | `a1012bd6efa4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d16.mp4` | video | 866.0 KB | `01ee96dfcb05` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d17.mp4` | video | 694.7 KB | `5a4c8a838500` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d18.mp4` | video | 605.8 KB | `6a7a0f0ad278` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d19.mp4` | video | 2.3 MB | `6b9e3d0b3b87` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d20.mp4` | video | 1.2 MB | `bc0480c33c3d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d21.mp4` | video | 671.7 KB | `8d826336def2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d22.mp4` | video | 1.3 MB | `2c30839a19b9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d23.mp4` | video | 5.7 MB | `03280ac8c25b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d24.mp4` | video | 1.3 MB | `250c51c5c8c3` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d25.mp4` | video | 6.7 MB | `2ceb1f35a5b7` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/d26.mp4` | video | 2.4 MB | `7a0291d7979a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/duoA.mp4` | video | 1.9 MB | `12c756a0678d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/duoB.mp4` | video | 789.6 KB | `0cb856620c2a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f01.mp4` | video | 810.0 KB | `77420c4df294` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f02.mp4` | video | 1.1 MB | `81614beaedf0` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f03.mp4` | video | 400.9 KB | `0fed1a14a177` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f04.mp4` | video | 244.3 KB | `61f323264ce2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f05.mp4` | video | 460.7 KB | `0bedb3336156` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f06.mp4` | video | 1.1 MB | `620386060b6e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f07.mp4` | video | 442.5 KB | `65cd4b0b2472` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f08.mp4` | video | 1.5 MB | `2a244eaebd4c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/f09.mp4` | video | 1.1 MB | `fcb11742b356` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g01.mp4` | video | 810.0 KB | `77420c4df294` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g02.mp4` | video | 1.1 MB | `81614beaedf0` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g03.mp4` | video | 244.3 KB | `61f323264ce2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g04.mp4` | video | 1.1 MB | `620386060b6e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g05.mp4` | video | 442.5 KB | `65cd4b0b2472` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g06.mp4` | video | 1.5 MB | `2a244eaebd4c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g07.mp4` | video | 1.1 MB | `fcb11742b356` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g08.mp4` | video | 1.6 MB | `694d8d970076` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g09.mp4` | video | 589.8 KB | `ed22e504cd30` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g10.mp4` | video | 1.9 MB | `12c756a0678d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g11.mp4` | video | 789.6 KB | `0cb856620c2a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-00.mp4` | video | 195.6 KB | `d8b5e303dce5` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-01.mp4` | video | 183.2 KB | `193bdb3a8051` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-02.mp4` | video | 166.1 KB | `f24eb4db8aa4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-03.mp4` | video | 266.5 KB | `1a17811e8034` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-04.mp4` | video | 362.0 KB | `1a11ee74d36b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-05.mp4` | video | 151.7 KB | `acfc9b74a6e9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-06.mp4` | video | 270.7 KB | `a8b2bdf6f17e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-07.mp4` | video | 144.4 KB | `93989bd07a5d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-08.mp4` | video | 269.1 KB | `64cb179d34f9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-09.mp4` | video | 184.6 KB | `f9bfce791b86` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-10.mp4` | video | 102.3 KB | `8f03af8f3122` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-11.mp4` | video | 214.5 KB | `d1f2fdb5e0c3` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-12.mp4` | video | 247.3 KB | `b74287251c3e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-13.mp4` | video | 204.7 KB | `bf19167596d9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-14.mp4` | video | 302.1 KB | `c2c56ca57bd9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/grid-15.mp4` | video | 166.0 KB | `c98a594f7555` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h01.mp4` | video | 1.3 MB | `9b932b566580` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h02.mp4` | video | 671.7 KB | `8d826336def2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h03.mp4` | video | 1.6 MB | `a1012bd6efa4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h04.mp4` | video | 474.0 KB | `8401e7aeee91` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h05.mp4` | video | 1.3 MB | `2c30839a19b9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h06.mp4` | video | 265.1 KB | `9556fb488a53` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h07.mp4` | video | 2.3 MB | `6b9e3d0b3b87` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h08.mp4` | video | 8.7 MB | `653396422103` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h09.mp4` | video | 715.3 KB | `12f75eee563b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h10.mp4` | video | 1.3 MB | `381f3db4940a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h11.mp4` | video | 945.3 KB | `fee58b7c1706` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h12.mp4` | video | 194.9 KB | `5c30c0667af5` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h13.mp4` | video | 5.7 MB | `03280ac8c25b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h14.mp4` | video | 556.2 KB | `500db3955238` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/h15.mp4` | video | 694.7 KB | `5a4c8a838500` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/p1.mp4` | video | 1.5 MB | `2e93b77b6223` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/p2.mp4` | video | 262.8 KB | `94b9dfdc320a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/p3.mp4` | video | 861.8 KB | `86dce40878cc` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s1a.mp4` | video | 655.4 KB | `1fdcc2dbe6e6` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s1b.mp4` | video | 757.9 KB | `45b88045bd6a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s2a.mp4` | video | 1.2 MB | `28104b48f777` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s2b.mp4` | video | 222.3 KB | `f6300ff9319e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s2c.mp4` | video | 329.9 KB | `876ecaba507c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3a.mp4` | video | 1.1 MB | `0dfc12d9a214` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3b.mp4` | video | 1.0 MB | `654b1e40214e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3c.mp4` | video | 336.3 KB | `1f78a30edd5b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3d.mp4` | video | 392.1 KB | `9bd33f273cc5` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w01.mp4` | video | 1.1 MB | `a3c008655229` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w02.mp4` | video | 998.5 KB | `1afc3fbbdec2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w03.mp4` | video | 2.8 MB | `99689498213e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w04.mp4` | video | 666.0 KB | `381d468eb254` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w05.mp4` | video | 688.0 KB | `080f5596fa61` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w06.mp4` | video | 863.6 KB | `303daf4d06b1` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w07.mp4` | video | 20.7 MB | `9ddb881f7678` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w08.mp4` | video | 19.0 MB | `331c8d09b906` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w09.mp4` | video | 12.4 MB | `a1962a8fcb57` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w10.mp4` | video | 15.7 MB | `5df245b3afad` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w11.mp4` | video | 10.0 MB | `2cb9f52d1fa7` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w12.mp4` | video | 6.1 MB | `1715c8d7d186` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w13.mp4` | video | 9.0 MB | `65ef508f4bc0` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w14.mp4` | video | 1.7 MB | `71351cf0eb66` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-ageint.mp4` | video | 330.4 KB | `eeb00843ebb0` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-ai-rise.mp4` | video | 541.6 KB | `ce679cf8cb6e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-beyond.mp4` | video | 310.1 KB | `ce900c42f6a9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-claude15.mp4` | video | 205.3 KB | `3195bb14f6a0` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-codecosmos.mp4` | video | 683.9 KB | `1c5171e0b6f2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-cosmos30.mp4` | video | 373.5 KB | `91cc9d1d5b49` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-dingge.mp4` | video | 821.1 KB | `242d8d4e6339` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-f12.mp4` | video | 327.1 KB | `2e78a600226d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-gongcishi.mp4` | video | 910.4 KB | `9b91c990aa0a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-gpt-autumn.mp4` | video | 271.7 KB | `53204868519e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-hust1037.mp4` | video | 105.6 KB | `94f59ba2b94e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-kimi-beat.mp4` | video | 268.7 KB | `04b7c7b1a7ba` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-kimi-film.mp4` | video | 215.8 KB | `b4e2cc140ce9` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-moon-letter.mp4` | video | 99.9 KB | `14a734830379` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-moonlamp.mp4` | video | 361.2 KB | `f8d3fa9151ab` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-oneink.mp4` | video | 348.1 KB | `836c32fe24fd` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-phasegate.mp4` | video | 317.7 KB | `d0b9860f4955` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-protocom.mp4` | video | 173.8 KB | `57ba1fef3538` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-readclub.mp4` | video | 66.9 KB | `60615a3528dd` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-samemoon.mp4` | video | 174.6 KB | `19bff425b01d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-senpai.mp4` | video | 122.1 KB | `192da6c4a3f4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-shatter.mp4` | video | 629.9 KB | `349fe3851bcb` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-shuchenglin.mp4` | video | 201.9 KB | `1fdd05a4be80` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-skillshub.mp4` | video | 505.2 KB | `d32e9daf58da` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-stopmotion.mp4` | video | 644.1 KB | `7655b59c1693` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-studysolo.mp4` | video | 329.7 KB | `38504f23e987` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-xuanlan.mp4` | video | 287.8 KB | `ac3e9a06b030` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-yusheng.mp4` | video | 498.3 KB | `e37bd44b7c05` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/fonts/NotoSansSC-700.ttf` | font | 10.0 MB | `0066a522a1ac` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/fonts/NotoSansSC-900.ttf` | font | 10.0 MB | `f6a468a9a727` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/fonts/NotoSerifSC-VF.ttf` | font | 24.0 MB | `a4aed9985a59` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/fonts/SourceHanSerifSC-Heavy.ttf` | font | 2.4 MB | `152bc1c4535b` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/posters/ageint-end.jpg` | image | 25.3 KB | `f55239f4bc40` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/ageint.jpg` | image | 18.0 KB | `356b19f49b83` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/ai-rise-end.jpg` | image | 31.1 KB | `30a2f566cd6a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/ai-rise.jpg` | image | 21.4 KB | `3a8fbee5e606` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/beyond-end.jpg` | image | 35.0 KB | `eec4e1d36743` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/beyond.jpg` | image | 30.9 KB | `dd250040de3e` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/claude15-end.jpg` | image | 32.0 KB | `d405498db992` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/claude15.jpg` | image | 24.7 KB | `bfa7a51dd5f1` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/codecosmos-end.jpg` | image | 13.9 KB | `685fa103fd66` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/codecosmos.jpg` | image | 62.5 KB | `4602a617e239` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/cosmos30-end.jpg` | image | 75.4 KB | `df2804cf7d8e` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/cosmos30.jpg` | image | 23.8 KB | `78834436cb0a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/dingge-end.jpg` | image | 57.0 KB | `fab9d3234601` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/dingge.jpg` | image | 53.7 KB | `dcd1a6b09179` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/f12-end.jpg` | image | 23.5 KB | `b560226cfc22` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/f12.jpg` | image | 36.8 KB | `2ab593ae0666` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/gongcishi-end.jpg` | image | 41.1 KB | `2cacd2a26c8d` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/gongcishi.jpg` | image | 28.4 KB | `3a2119d5b9e9` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/gpt-autumn-end.jpg` | image | 26.7 KB | `64a3883ec888` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/gpt-autumn.jpg` | image | 24.6 KB | `241d9800879c` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/hust1037-end.jpg` | image | 14.6 KB | `dd66ff0f663c` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/hust1037.jpg` | image | 13.3 KB | `3214fb6f5518` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-beat-end.jpg` | image | 14.7 KB | `7aac9f92caf4` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-beat.jpg` | image | 20.9 KB | `a95e8be66ba3` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-film-end.jpg` | image | 15.1 KB | `9903a323c646` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-film.jpg` | image | 8.0 KB | `94218e0ab754` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moon-letter-end.jpg` | image | 11.9 KB | `4d9ecdf88df6` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moon-letter.jpg` | image | 11.4 KB | `92dce028e394` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moonlamp-end.jpg` | image | 24.5 KB | `0665206ec031` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moonlamp.jpg` | image | 20.6 KB | `f3e6489e488d` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/oneink-end.jpg` | image | 26.7 KB | `3c944305492a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/oneink.jpg` | image | 14.6 KB | `e586a6555f09` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/phasegate-end.jpg` | image | 33.0 KB | `23d9ecde79ea` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/phasegate.jpg` | image | 15.3 KB | `70d1266c9f11` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/protocom-end.jpg` | image | 24.5 KB | `97692f131092` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/protocom.jpg` | image | 14.4 KB | `d496aab0b03a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/readclub-end.jpg` | image | 9.5 KB | `6a4bebbff640` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/readclub.jpg` | image | 3.3 KB | `9d860c6b18f5` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/samemoon-end.jpg` | image | 17.3 KB | `76092f3626e2` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/samemoon.jpg` | image | 16.3 KB | `e681847d2d42` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/senpai-end.jpg` | image | 12.5 KB | `21ed3cfcb7b1` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/senpai.jpg` | image | 7.0 KB | `a3c4aaf32f08` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/shatter-end.jpg` | image | 37.5 KB | `1a691543ad0a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/shatter.jpg` | image | 20.3 KB | `a81be89f2d59` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/shuchenglin-end.jpg` | image | 16.5 KB | `4c50ce6ec2d0` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/shuchenglin.jpg` | image | 11.8 KB | `41b2e2835969` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/skillshub-end.jpg` | image | 21.0 KB | `cc2147ff1d15` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/skillshub.jpg` | image | 18.5 KB | `e3a8eec27fb6` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/stopmotion-end.jpg` | image | 48.1 KB | `c5b5534560df` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/stopmotion.jpg` | image | 49.7 KB | `8b6692d96d0c` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/studysolo-end.jpg` | image | 31.8 KB | `5864a3a748d9` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/studysolo.jpg` | image | 26.0 KB | `b867760735b4` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/xuanlan-end.jpg` | image | 30.0 KB | `ab63e1e26890` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/xuanlan.jpg` | image | 28.9 KB | `d268a1e199ef` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/yusheng-end.jpg` | image | 27.2 KB | `ccc60e2e5e2d` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/yusheng.jpg` | image | 15.2 KB | `b0559139a9ce` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/score.wav` | audio | 22.2 MB | `33d79b140797` | 配乐：npm run score（audio/score.py）生成 |
| `qa-frames/card.png` | image | 766.1 KB | `6974148f9150` | QA / 审片证据图 |
| `qa-frames/pv-119.3.png` | image | 8.8 KB | `87a9be0f54f4` | QA / 审片证据图 |
| `qa-frames/pv-66.8.png` | image | 250.5 KB | `732783ba43d3` | QA / 审片证据图 |
| `qa-frames/pv-80.6.png` | image | 435.6 KB | `24024e859edc` | QA / 审片证据图 |
| `qa-frames/pv-83.6.png` | image | 456.0 KB | `2e9d927a8778` | QA / 审片证据图 |
| `qa-frames/qr-4k120.png` | image | 2.1 MB | `f8f74f83d178` | QA / 审片证据图 |
| `qa-frames/reveal.png` | image | 273.3 KB | `dc548afd58c4` | QA / 审片证据图 |
| `qa-frames/stack.png` | image | 469.0 KB | `d88d18ab7e97` | QA / 审片证据图 |
| `qa-frames/t0.png` | image | 2.0 MB | `d66675702b68` | QA / 审片证据图 |
| `qa-frames/t1.png` | image | 2.0 MB | `c55ecbb134b6` | QA / 审片证据图 |
| `qa-frames/t100.png` | image | 2.0 MB | `aff2fd9c8443` | QA / 审片证据图 |
| `qa-frames/t101.png` | image | 2.0 MB | `30103f9008f5` | QA / 审片证据图 |
| `qa-frames/t102_5.png` | image | 2.1 MB | `77803dafcadf` | QA / 审片证据图 |
| `qa-frames/t103.png` | image | 1.6 MB | `cd366afcb913` | QA / 审片证据图 |
| `qa-frames/t104.png` | image | 1.6 MB | `1aadef230cc1` | QA / 审片证据图 |
| `qa-frames/t106.png` | image | 1.7 MB | `ca52a8da0441` | QA / 审片证据图 |
| `qa-frames/t109.png` | image | 1.7 MB | `fdeb90396f54` | QA / 审片证据图 |
| `qa-frames/t11.png` | image | 1.7 MB | `dac7274aba77` | QA / 审片证据图 |
| `qa-frames/t110.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t112.png` | image | 1.7 MB | `4a8acd834294` | QA / 审片证据图 |
| `qa-frames/t114.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t114_5.png` | image | 1.7 MB | `090da0d49b68` | QA / 审片证据图 |
| `qa-frames/t115.png` | image | 1.7 MB | `c9ed0f93aac0` | QA / 审片证据图 |
| `qa-frames/t117.png` | image | 1.7 MB | `af09bac6c564` | QA / 审片证据图 |
| `qa-frames/t118_5.png` | image | 1.5 MB | `046d2f8a63b8` | QA / 审片证据图 |
| `qa-frames/t119.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t119_5.png` | image | 8.5 KB | `2d61646dba7b` | QA / 审片证据图 |
| `qa-frames/t11_2.png` | image | 2.5 MB | `b297e9100922` | QA / 审片证据图 |
| `qa-frames/t121.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t124.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t126.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t127.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t12_5.png` | image | 1.7 MB | `14dba802b8b4` | QA / 审片证据图 |
| `qa-frames/t13.png` | image | 1.7 MB | `d6eec40dc150` | QA / 审片证据图 |
| `qa-frames/t130.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t134.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t137.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t139.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t14.png` | image | 2.1 MB | `e55f5e61a4e9` | QA / 审片证据图 |
| `qa-frames/t141.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t144.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t145.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t147.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t149.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t15.png` | image | 2.1 MB | `c5a4f9d026d4` | QA / 审片证据图 |
| `qa-frames/t150.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t151.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t154.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t155.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t157.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t160.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t163.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t167.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t16_5.png` | image | 1.9 MB | `20a6e9c35c17` | QA / 审片证据图 |
| `qa-frames/t170.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t174.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t178.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t17_2.png` | image | 2.5 MB | `ba40899388df` | QA / 审片证据图 |
| `qa-frames/t17_5.png` | image | 2.1 MB | `4653beae2214` | QA / 审片证据图 |
| `qa-frames/t18.png` | image | 2.1 MB | `fafaf15e2f0f` | QA / 审片证据图 |
| `qa-frames/t182.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t186.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t18_6.png` | image | 2.6 MB | `d3595e19d8a1` | QA / 审片证据图 |
| `qa-frames/t19.png` | image | 2.0 MB | `5e4640897d21` | QA / 审片证据图 |
| `qa-frames/t190.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t193.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t197.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t19_2.png` | image | 2.1 MB | `be06ff59655f` | QA / 审片证据图 |
| `qa-frames/t19_5.png` | image | 2.0 MB | `9d8020b62be4` | QA / 审片证据图 |
| `qa-frames/t19_7.png` | image | 2.5 MB | `8285b124567f` | QA / 审片证据图 |
| `qa-frames/t1_2.png` | image | 2.0 MB | `61ecd06759e0` | QA / 审片证据图 |
| `qa-frames/t2.png` | image | 2.0 MB | `c5a59a59cafa` | QA / 审片证据图 |
| `qa-frames/t200.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t203.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t207.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t209_5.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t20_1.png` | image | 2.2 MB | `c2774b01f9a8` | QA / 审片证据图 |
| `qa-frames/t21.png` | image | 2.0 MB | `19edc4b2a414` | QA / 审片证据图 |
| `qa-frames/t211.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t214.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t217.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t221.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t224.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t228.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t22_5.png` | image | 2.0 MB | `1db0e90014e3` | QA / 审片证据图 |
| `qa-frames/t23.png` | image | 2.7 MB | `13a0259ee40c` | QA / 审片证据图 |
| `qa-frames/t233.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t237.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t23_5.png` | image | 2.1 MB | `720f62787158` | QA / 审片证据图 |
| `qa-frames/t24.png` | image | 2.1 MB | `1bfb0f2ff371` | QA / 审片证据图 |
| `qa-frames/t241.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t245.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t24_2.png` | image | 2.7 MB | `9aee9ba8cf2d` | QA / 审片证据图 |
| `qa-frames/t25.png` | image | 2.3 MB | `18e5887b2d60` | QA / 审片证据图 |
| `qa-frames/t250.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t254.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t257.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t259.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t25_2.png` | image | 2.6 MB | `8994c5ea02ce` | QA / 审片证据图 |
| `qa-frames/t25_6.png` | image | 106.9 KB | `9222893c4da6` | QA / 审片证据图 |
| `qa-frames/t26.png` | image | 2.3 MB | `e4f5724e1b06` | QA / 审片证据图 |
| `qa-frames/t261.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t264.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t267.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t26_5.png` | image | 2.6 MB | `1b718805e514` | QA / 审片证据图 |
| `qa-frames/t27.png` | image | 2.3 MB | `e66ffe099bcf` | QA / 审片证据图 |
| `qa-frames/t272.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t28.png` | image | 2.2 MB | `1b420a16a3b3` | QA / 审片证据图 |
| `qa-frames/t280.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t28_5.png` | image | 2.1 MB | `c8bf794d54db` | QA / 审片证据图 |
| `qa-frames/t29.png` | image | 2.2 MB | `4e5d5e31ce90` | QA / 审片证据图 |
| `qa-frames/t290.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t296.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t298.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t299_5.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t3.png` | image | 2.1 MB | `0f7d90e41300` | QA / 审片证据图 |
| `qa-frames/t30.png` | image | 2.1 MB | `d5b777ac0377` | QA / 审片证据图 |
| `qa-frames/t31.png` | image | 2.2 MB | `d9fe12003db9` | QA / 审片证据图 |
| `qa-frames/t31_5.png` | image | 2.4 MB | `eba2b0141d6a` | QA / 审片证据图 |
| `qa-frames/t32_5.png` | image | 2.9 MB | `3577db64be69` | QA / 审片证据图 |
| `qa-frames/t33.png` | image | 2.0 MB | `650d37db7c26` | QA / 审片证据图 |
| `qa-frames/t33_4.png` | image | 2.6 MB | `e43ae696dd9d` | QA / 审片证据图 |
| `qa-frames/t34.png` | image | 2.2 MB | `30d3c1319ec8` | QA / 审片证据图 |
| `qa-frames/t34_2.png` | image | 3.1 MB | `d4efb350cffa` | QA / 审片证据图 |
| `qa-frames/t34_5.png` | image | 2.2 MB | `b69536f69718` | QA / 审片证据图 |
| `qa-frames/t34_9.png` | image | 2.9 MB | `b7528ae19fa3` | QA / 审片证据图 |
| `qa-frames/t35_5.png` | image | 2.1 MB | `7f243087917f` | QA / 审片证据图 |
| `qa-frames/t36.png` | image | 2.5 MB | `213b75906da2` | QA / 审片证据图 |
| `qa-frames/t36_5.png` | image | 2.9 MB | `ed259a2a4e3f` | QA / 审片证据图 |
| `qa-frames/t37.png` | image | 1.9 MB | `69868eb8ea14` | QA / 审片证据图 |
| `qa-frames/t38.png` | image | 2.7 MB | `48f78dde8a76` | QA / 审片证据图 |
| `qa-frames/t38_5.png` | image | 2.0 MB | `1b47c5f28837` | QA / 审片证据图 |
| `qa-frames/t39_5.png` | image | 2.9 MB | `2fe4df04ea73` | QA / 审片证据图 |
| `qa-frames/t3_5.png` | image | 2.1 MB | `77f311ef3e02` | QA / 审片证据图 |
| `qa-frames/t40.png` | image | 2.1 MB | `2030367a6710` | QA / 审片证据图 |
| `qa-frames/t41_5.png` | image | 2.3 MB | `f73106775ec7` | QA / 审片证据图 |
| `qa-frames/t42.png` | image | 1.8 MB | `91eb7192bbf4` | QA / 审片证据图 |
| `qa-frames/t42_5.png` | image | 2.1 MB | `36752953da2b` | QA / 审片证据图 |
| `qa-frames/t43.png` | image | 2.5 MB | `59de3ea2f295` | QA / 审片证据图 |
| `qa-frames/t44.png` | image | 2.1 MB | `f2d85bea98e4` | QA / 审片证据图 |
| `qa-frames/t44_5.png` | image | 2.4 MB | `fa23ed0cfeef` | QA / 审片证据图 |
| `qa-frames/t46.png` | image | 2.5 MB | `050c0c2203c0` | QA / 审片证据图 |
| `qa-frames/t46_6.png` | image | 2.5 MB | `3cfa31d6a486` | QA / 审片证据图 |
| `qa-frames/t47.png` | image | 2.4 MB | `510aebdeb31a` | QA / 审片证据图 |
| `qa-frames/t48_5.png` | image | 2.5 MB | `0f94caac1a30` | QA / 审片证据图 |
| `qa-frames/t4_5.png` | image | 2.2 MB | `83664e1031ff` | QA / 审片证据图 |
| `qa-frames/t50.png` | image | 2.4 MB | `814b7ff66bb6` | QA / 审片证据图 |
| `qa-frames/t50_5.png` | image | 2.6 MB | `939b76ae5201` | QA / 审片证据图 |
| `qa-frames/t51_5.png` | image | 2.6 MB | `390039d820ef` | QA / 审片证据图 |
| `qa-frames/t52_5.png` | image | 2.3 MB | `9dc3b494e7f7` | QA / 审片证据图 |
| `qa-frames/t53.png` | image | 2.5 MB | `bf6054227698` | QA / 审片证据图 |
| `qa-frames/t54.png` | image | 2.5 MB | `630661f2bac3` | QA / 审片证据图 |
| `qa-frames/t55.png` | image | 2.2 MB | `3a4420115608` | QA / 审片证据图 |
| `qa-frames/t56_5.png` | image | 2.4 MB | `bf54659f7a2e` | QA / 审片证据图 |
| `qa-frames/t57.png` | image | 2.4 MB | `ce96350d1faa` | QA / 审片证据图 |
| `qa-frames/t57_5.png` | image | 1.9 MB | `7fba39215f86` | QA / 审片证据图 |
| `qa-frames/t58.png` | image | 2.4 MB | `fb65b77df4a8` | QA / 审片证据图 |
| `qa-frames/t59.png` | image | 2.5 MB | `7c1911092922` | QA / 审片证据图 |
| `qa-frames/t59_3.png` | image | 2.2 MB | `dc34756c9e4c` | QA / 审片证据图 |
| `qa-frames/t59_5.png` | image | 2.4 MB | `c4850a9c5bac` | QA / 审片证据图 |
| `qa-frames/t5_2.png` | image | 2.5 MB | `8d7a5969066d` | QA / 审片证据图 |
| `qa-frames/t5_5.png` | image | 2.1 MB | `662b3cf87e52` | QA / 审片证据图 |
| `qa-frames/t5_9.png` | image | 2.7 MB | `b68042cc3e53` | QA / 审片证据图 |
| `qa-frames/t60.png` | image | 1.9 MB | `f7fe215d32f3` | QA / 审片证据图 |
| `qa-frames/t60_5.png` | image | 1.8 MB | `2c324a887f93` | QA / 审片证据图 |
| `qa-frames/t61.png` | image | 1.8 MB | `fcbaa47afee5` | QA / 审片证据图 |
| `qa-frames/t62.png` | image | 1.8 MB | `8804ab903e01` | QA / 审片证据图 |
| `qa-frames/t63.png` | image | 1.8 MB | `c6a8f7b34563` | QA / 审片证据图 |
| `qa-frames/t63_2.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t64.png` | image | 1.8 MB | `34d7be0f9d1c` | QA / 审片证据图 |
| `qa-frames/t64_5.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t65.png` | image | 1.8 MB | `18aae43d4b01` | QA / 审片证据图 |
| `qa-frames/t66.png` | image | 1.7 MB | `af06173a9902` | QA / 审片证据图 |
| `qa-frames/t66_5.png` | image | 2.0 MB | `d9ef08dc6e2e` | QA / 审片证据图 |
| `qa-frames/t67.png` | image | 2.1 MB | `329970abaa85` | QA / 审片证据图 |
| `qa-frames/t67_5.png` | image | 2.1 MB | `4fa9c8743edf` | QA / 审片证据图 |
| `qa-frames/t69.png` | image | 1.9 MB | `deaaf676c2b7` | QA / 审片证据图 |
| `qa-frames/t6_5.png` | image | 2.5 MB | `8e88e7f2bc43` | QA / 审片证据图 |
| `qa-frames/t7.png` | image | 2.5 MB | `7b05cd06b4c3` | QA / 审片证据图 |
| `qa-frames/t70.png` | image | 2.0 MB | `f0a830929b80` | QA / 审片证据图 |
| `qa-frames/t70_3.png` | image | 1.8 MB | `6d29450a6e7f` | QA / 审片证据图 |
| `qa-frames/t71.png` | image | 1.8 MB | `a2a5c4c8d5b0` | QA / 审片证据图 |
| `qa-frames/t73.png` | image | 1.9 MB | `50254fd3f0b1` | QA / 审片证据图 |
| `qa-frames/t75.png` | image | 1.7 MB | `6abe32892cd0` | QA / 审片证据图 |
| `qa-frames/t77.png` | image | 2.1 MB | `60422610deea` | QA / 审片证据图 |
| `qa-frames/t78.png` | image | 2.0 MB | `85dff346495e` | QA / 审片证据图 |
| `qa-frames/t79.png` | image | 2.2 MB | `6e5eace051f4` | QA / 审片证据图 |
| `qa-frames/t7_8.png` | image | 2.5 MB | `d0d946b06204` | QA / 审片证据图 |
| `qa-frames/t80.png` | image | 2.3 MB | `9dcda512335a` | QA / 审片证据图 |
| `qa-frames/t80_5.png` | image | 2.2 MB | `9e3b0bd0d0ae` | QA / 审片证据图 |
| `qa-frames/t81.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t82.png` | image | 2.2 MB | `250fce2d849c` | QA / 审片证据图 |
| `qa-frames/t83.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t83_5.png` | image | 2.2 MB | `d9a55ebec817` | QA / 审片证据图 |
| `qa-frames/t84.png` | image | 1.1 MB | `130d28ba48ba` | QA / 审片证据图 |
| `qa-frames/t85.png` | image | 2.1 MB | `82b6b8abcc86` | QA / 审片证据图 |
| `qa-frames/t86_5.png` | image | 2.1 MB | `b75d03b31224` | QA / 审片证据图 |
| `qa-frames/t87.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t87_5.png` | image | 2.1 MB | `52416ee31869` | QA / 审片证据图 |
| `qa-frames/t88.png` | image | 2.1 MB | `da467438bb7d` | QA / 审片证据图 |
| `qa-frames/t88_5.png` | image | 2.1 MB | `ab20c2c83dc6` | QA / 审片证据图 |
| `qa-frames/t89_5.png` | image | 2.2 MB | `db97fe8c9027` | QA / 审片证据图 |
| `qa-frames/t8_5.png` | image | 2.2 MB | `40793b07eb82` | QA / 审片证据图 |
| `qa-frames/t9.png` | image | 1.9 MB | `6cffd5ebe715` | QA / 审片证据图 |
| `qa-frames/t90.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t90_5.png` | image | 2.2 MB | `a6ea4c75007c` | QA / 审片证据图 |
| `qa-frames/t91.png` | image | 2.2 MB | `6899340d334e` | QA / 审片证据图 |
| `qa-frames/t93_5.png` | image | 2.2 MB | `98289144038e` | QA / 审片证据图 |
| `qa-frames/t94.png` | image | 1.9 MB | `361c8b52da2f` | QA / 审片证据图 |
| `qa-frames/t95.png` | image | 2.1 MB | `a3ef756fc149` | QA / 审片证据图 |
| `qa-frames/t96_5.png` | image | 8.3 KB | `82a2e41ba517` | QA / 审片证据图 |
| `qa-frames/t97.png` | image | 2.1 MB | `9934eccd874b` | QA / 审片证据图 |
| `qa-frames/t99.png` | image | 2.0 MB | `21d27e981876` | QA / 审片证据图 |
| `qa-frames/t9_5.png` | image | 2.0 MB | `c05e44d671e9` | QA / 审片证据图 |
| `源码.zip` | binary | 282.1 MB | `2b5a357d22d7` |  |
