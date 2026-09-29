# supercut · 源码文件索引（自动生成）

> AI-Coding SuperVideos 合集总片（28 部代码视频的预告片）。原目录 `00-supercut-trailer/`。
> 源码已原样解压在 **`assets/cases/supercut/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show supercut <路径>`；拷出来改：`python3 scripts/casebook.py copy supercut <目标目录>`。

来源档案：

- `00-supercut-trailer` · dir · 160.7 MB

收录：文本 16 个（448.9 KB）· 二进制 6 个（598.6 KB，字体/小图）· 未收录 179 个（159.7 MB）

目录：文本文件 · 随附二进制（原样） · 未收录（视频 / 音频 / 大字体 / QA 图）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `README.md` | 47 | 2.7 KB | 00-supercut-trailer · AI-Coding SuperVideos 合集总片 |
| `STORYBOARD.md` | 52 | 4.3 KB | STORYBOARD · AI-CODING SUPERVIDEOS 总片（62.4s @150BPM） |
| `_survey/index.txt` | 28 | 2.0 KB |  |
| `assets/vendor/gsap.min.js` | 11 | 71.2 KB | GSAP 3.15.0 |
| `audio/score.py` | 449 | 18.4 KB | 时变截止的低通：按 2048 样本分块，块内按中心频率滤波、跨块续状态。 |
| `index.html` | 1994 | 159.5 KB | AI-Coding SuperVideos · 通通开源 |
| `package-lock.json` | 2017 | 63.0 KB |  |
| `package.json` | 19 | 0.8 KB | npm scripts: prep, build, score, check, snapshot, render, ship |
| `src/catalog.mjs` | 141 | 9.8 KB | CATALOG · 合集里的 28 部代码视频（唯一真相源之一） |
| `src/code-lines.mjs` | 39 | 4.6 KB | 真实代码行 · 全部摘自合集里各作品的源码包 / CoExp 复盘中的代码片段（未改动一个字符，只截取单行） |
| `src/edl.mjs` | 286 | 15.3 KB | EDL · 整支片子的"乐谱"（唯一真相源） |
| `src/runtime.js` | 900 | 44.1 KB | runtime.js · 整支片子 = 一个函数 render(t) |
| `src/style.css` | 293 | 25.2 KB | SUPERCUT · 视觉系统 |
| `tools/build.mjs` | 368 | 17.8 KB | build.mjs · EDL + 目录 → 静态 index.html（HyperFrames 合成）+ build/cues.json（配乐用） |
| `tools/prep_media.mjs` | 160 | 8.4 KB | prep_media.mjs · 把 28 部原片切成本片要用的代理素材 |
| `tools/qa_probe.mjs` | 30 | 2.0 KB | qa_probe.mjs · 用 Playwright 加载 index.html，抓 JS 错误/控制台，并按时刻渲染自查 |

## 随附二进制（原样）

| 路径 | 类型 | 大小 |
|---|---|---:|
| `assets/fonts/Barlow-600.ttf` | font | 83.9 KB |
| `assets/fonts/Barlow-800.ttf` | font | 85.5 KB |
| `assets/fonts/Barlow-900.ttf` | font | 86.5 KB |
| `assets/fonts/IBMPlexMono-500.ttf` | font | 126.9 KB |
| `assets/img/qr.png` | image | 2.6 KB |
| `assets/img/share-card.png` | image | 213.2 KB |

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
| `assets/clips/g01.mp4` | video | 810.0 KB | `77420c4df294` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g02.mp4` | video | 1.1 MB | `81614beaedf0` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g03.mp4` | video | 244.3 KB | `61f323264ce2` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g04.mp4` | video | 1.1 MB | `620386060b6e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g05.mp4` | video | 442.5 KB | `65cd4b0b2472` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g06.mp4` | video | 1.5 MB | `2a244eaebd4c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g07.mp4` | video | 1.1 MB | `fcb11742b356` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g08.mp4` | video | 1.6 MB | `694d8d970076` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/g09.mp4` | video | 589.8 KB | `ed22e504cd30` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
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
| `assets/clips/p1.mp4` | video | 1.4 MB | `961137d4611b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/p2.mp4` | video | 170.8 KB | `df678357e51c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/p3.mp4` | video | 514.0 KB | `fba83bd23a59` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s1a.mp4` | video | 655.4 KB | `1fdcc2dbe6e6` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s1b.mp4` | video | 757.9 KB | `45b88045bd6a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s2a.mp4` | video | 1.2 MB | `28104b48f777` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s2b.mp4` | video | 222.3 KB | `f6300ff9319e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s2c.mp4` | video | 329.9 KB | `876ecaba507c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3a.mp4` | video | 1.1 MB | `0dfc12d9a214` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3b.mp4` | video | 1.0 MB | `654b1e40214e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3c.mp4` | video | 336.3 KB | `1f78a30edd5b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/s3d.mp4` | video | 392.1 KB | `9bd33f273cc5` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w01.mp4` | video | 907.4 KB | `f5d632c4149e` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w02.mp4` | video | 698.5 KB | `9c5da52465ca` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w03.mp4` | video | 2.3 MB | `1817dc1c4162` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w04.mp4` | video | 666.0 KB | `381d468eb254` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w05.mp4` | video | 11.7 MB | `324a93804532` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w06.mp4` | video | 11.0 MB | `593fdb4d4c23` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w07.mp4` | video | 4.4 MB | `558782cd07e4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w08.mp4` | video | 6.7 MB | `80665c879d9f` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w09.mp4` | video | 3.4 MB | `64ce1ccb570c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/w10.mp4` | video | 1.7 MB | `4cf2ad019298` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-ageint.mp4` | video | 249.9 KB | `4babd0e3d517` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-ai-rise.mp4` | video | 360.6 KB | `8739c250b24a` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-beyond.mp4` | video | 229.4 KB | `7663d1c42a74` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-claude15.mp4` | video | 159.5 KB | `bd747f61ef9b` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-codecosmos.mp4` | video | 585.2 KB | `838e13433be6` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-cosmos30.mp4` | video | 260.1 KB | `bb10c6eddc95` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-dingge.mp4` | video | 653.9 KB | `a16b2b2403f8` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-f12.mp4` | video | 252.0 KB | `da4275dcb8d7` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-gpt-autumn.mp4` | video | 204.5 KB | `7273b5dfd26d` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-hust1037.mp4` | video | 80.5 KB | `190b75e51174` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-kimi-beat.mp4` | video | 235.4 KB | `95cc1413784c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-kimi-film.mp4` | video | 156.6 KB | `6594349e4ae5` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-moon-letter.mp4` | video | 72.2 KB | `c74c201b9f99` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-moonlamp.mp4` | video | 266.2 KB | `650df804a0c4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-oneink.mp4` | video | 235.8 KB | `27bff354c885` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-phasegate.mp4` | video | 195.3 KB | `4736e3395f95` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-protocom.mp4` | video | 140.1 KB | `7add92be36e4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-readclub.mp4` | video | 47.9 KB | `8d54599211a0` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-samemoon.mp4` | video | 134.5 KB | `7b2744d43d9c` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-senpai.mp4` | video | 95.0 KB | `f85b19f98fe4` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-shuchenglin.mp4` | video | 155.1 KB | `6d046255dfe5` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-skillshub.mp4` | video | 422.0 KB | `a0ba621c1444` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-stopmotion.mp4` | video | 501.0 KB | `202c10d2e394` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-studysolo.mp4` | video | 236.8 KB | `316054a2e249` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-xuanlan.mp4` | video | 237.7 KB | `98f6e5ab44e1` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/clips/wall-yusheng.mp4` | video | 388.5 KB | `3a3f539df5a7` | 镜头代理：tools/prep_media.mjs 从 28 部成片切出（原视频不收录） |
| `assets/fonts/NotoSansSC-700.ttf` | font | 10.0 MB | `0066a522a1ac` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/fonts/NotoSansSC-900.ttf` | font | 10.0 MB | `f6a468a9a727` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/fonts/NotoSerifSC-VF.ttf` | font | 24.0 MB | `a4aed9985a59` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/fonts/SourceHanSerifSC-Heavy.ttf` | font | 2.4 MB | `152bc1c4535b` | 大字体（OFL/开源）：按文件名找同一字族（Google Fonts / Noto）放回原路径 |
| `assets/posters/ageint-end.jpg` | image | 28.2 KB | `5bdf871a52db` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/ageint.jpg` | image | 18.0 KB | `356b19f49b83` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/ai-rise-end.jpg` | image | 28.3 KB | `e98183e51a2f` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/ai-rise.jpg` | image | 21.4 KB | `3a8fbee5e606` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/beyond-end.jpg` | image | 35.3 KB | `531fdb39d192` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/beyond.jpg` | image | 30.9 KB | `dd250040de3e` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/claude15-end.jpg` | image | 31.1 KB | `5a80914ba314` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/claude15.jpg` | image | 24.7 KB | `bfa7a51dd5f1` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/codecosmos-end.jpg` | image | 61.2 KB | `494f899eaa8b` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/codecosmos.jpg` | image | 62.5 KB | `4602a617e239` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/cosmos30-end.jpg` | image | 76.1 KB | `140bca392c2f` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/cosmos30.jpg` | image | 23.8 KB | `78834436cb0a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/dingge-end.jpg` | image | 57.1 KB | `b511dad0a427` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/dingge.jpg` | image | 53.7 KB | `dcd1a6b09179` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/f12-end.jpg` | image | 39.2 KB | `983cb7550023` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/f12.jpg` | image | 36.8 KB | `2ab593ae0666` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/gpt-autumn-end.jpg` | image | 26.0 KB | `11fffccdc5a9` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/gpt-autumn.jpg` | image | 24.6 KB | `241d9800879c` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/hust1037-end.jpg` | image | 14.6 KB | `de2b4c49bd90` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/hust1037.jpg` | image | 13.3 KB | `3214fb6f5518` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-beat-end.jpg` | image | 21.1 KB | `14dbd8392d1a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-beat.jpg` | image | 20.9 KB | `a95e8be66ba3` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-film-end.jpg` | image | 14.8 KB | `ed75bda3733f` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/kimi-film.jpg` | image | 8.0 KB | `94218e0ab754` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moon-letter-end.jpg` | image | 9.6 KB | `8ad7afa315e3` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moon-letter.jpg` | image | 11.4 KB | `92dce028e394` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moonlamp-end.jpg` | image | 21.5 KB | `7528b77eab47` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/moonlamp.jpg` | image | 20.6 KB | `f3e6489e488d` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/oneink-end.jpg` | image | 26.3 KB | `c7ca129546b5` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/oneink.jpg` | image | 14.6 KB | `e586a6555f09` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/phasegate-end.jpg` | image | 19.6 KB | `023a1d1bb1c4` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/phasegate.jpg` | image | 15.3 KB | `70d1266c9f11` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/protocom-end.jpg` | image | 24.5 KB | `8ba828ca3aaa` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/protocom.jpg` | image | 14.4 KB | `d496aab0b03a` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/readclub-end.jpg` | image | 3.3 KB | `3eaced64b962` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/readclub.jpg` | image | 3.3 KB | `9d860c6b18f5` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/samemoon-end.jpg` | image | 17.0 KB | `771e4a678cb4` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/samemoon.jpg` | image | 16.3 KB | `e681847d2d42` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/senpai-end.jpg` | image | 11.8 KB | `36cae18600fc` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/senpai.jpg` | image | 7.0 KB | `a3c4aaf32f08` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/shuchenglin-end.jpg` | image | 17.3 KB | `946f09597da4` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/shuchenglin.jpg` | image | 11.8 KB | `41b2e2835969` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/skillshub-end.jpg` | image | 22.2 KB | `e40d4f326a69` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/skillshub.jpg` | image | 18.5 KB | `e3a8eec27fb6` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/stopmotion-end.jpg` | image | 45.3 KB | `c472267a7619` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/stopmotion.jpg` | image | 49.7 KB | `8b6692d96d0c` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/studysolo-end.jpg` | image | 28.2 KB | `38f5e717d500` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/studysolo.jpg` | image | 26.0 KB | `b867760735b4` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/xuanlan-end.jpg` | image | 30.3 KB | `8ae079071d7b` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/xuanlan.jpg` | image | 28.9 KB | `d268a1e199ef` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/yusheng-end.jpg` | image | 21.0 KB | `3b3e0d407a25` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/posters/yusheng.jpg` | image | 15.2 KB | `b0559139a9ce` | 海报帧：tools/prep_media.mjs 从成片生成 |
| `assets/score.wav` | audio | 11.6 MB | `fd3664c3faa2` | 配乐：npm run score（audio/score.py）生成 |
