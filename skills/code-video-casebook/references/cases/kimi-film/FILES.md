# kimi-film · 源码文件索引（自动生成）

> 月之暗面 · KIMI · numpy 逐像素六幕。原目录 `swe-kimi-source-intro/`。
> 源码已原样解压在 **`assets/cases/kimi-film/`**（逐字节等于原档案，sha256 见 `references/index.json`）。
> 读文件：`python3 scripts/casebook.py show kimi-film <路径>`；拷出来改：`python3 scripts/casebook.py copy kimi-film <目标目录>`。

来源档案：

- `swe-kimi-source-intro/kimi_film_source.zip` · zip · 20.6 KB · sha256 `9aba80bab140744c…`

收录：文本 6 个（51.9 KB）· 二进制 0 个（0.0 KB，字体/小图）· 未收录 0 个（0.0 KB）

## 文本文件

| 路径 | 行数 | 大小 | 摘要（文件首个标题/注释） |
|---|---:|---:|---|
| `README.md` | 37 | 1.7 KB | 月之暗面 · KIMI — 纯代码动画短片 |
| `film.py` | 38 | 1.4 KB | Driver: render frames -> x264 -> mux score. |
| `film_par.py` | 51 | 2.0 KB | Parallel render: N chunks -> per-chunk mp4 -> concat -> mux score. |
| `kit.py` | 293 | 10.1 KB | Render toolkit for the Kimi film — pure numpy/PIL, no image assets. |
| `scenes.py` | 627 | 26.5 KB | Six acts of the Kimi film. Each returns float32 RGB (H,W,3) at local time t. |
| `score.py` | 286 | 10.1 KB | Procedural score — every era gets its own instrumentation and groove. |
