#!/usr/bin/env bash
# 从零渲染《月光替你亮着灯》成片（源码包新增的一键脚本；每一步也可以单独运行，见 README）
#
#   bash scripts/render_all.sh                          # -> out/final.mp4（CRF 20，约 21.8 MB）
#   CRF=18 OUT=out/final_crf18.mp4 bash scripts/render_all.sh   # 高码率母版（约 29 MB）
#
# 断点续渲：out/frames 里已有的帧会被跳过。改过画面代码后，删掉 out/frames，
# 或者只对受影响的帧段重渲：node scripts/capture.mjs --page "$PAGE" --range 600:642 --out out/frames --force
set -euo pipefail
cd "$(dirname "$0")/.."

PAGE="film.html?w=1920&h=1080&pw=1600&ph=900"   # 输出 1920x1080，3D 画面 1600x900
FRAMES=672                                       # 28.0 s x 24 fps（与 src/timeline.ts 一致）
CRF="${CRF:-20}"
OUT="${OUT:-out/final.mp4}"
mkdir -p out/logs out/qc

step() { printf '\n==> %s\n' "$*"; }
# capture.mjs 在页面报错（比如 GLSL 编译失败）时只打印 "page errors"，退出码仍是 0，所以要自己查
check_page() { if grep -q "page errors" "$1"; then echo "!! page errors, see $1"; exit 1; fi; }

step "1/7 构建（esbuild）+ 类型检查"
npm run -s build
npx tsc -p .

step "2/7 导出 meta.json（时间轴上的全部 cue，配乐脚本从这里读时间）"
node scripts/capture.mjs --page "$PAGE" --meta --out out/meta.json 2>&1 | tee out/logs/meta.log
check_page out/logs/meta.log
python3 -c "import json,sys; m=json.load(open('out/meta.json')); sys.exit(0 if m.get('fontsOk') else '!! fonts not loaded: check web/fonts/*.otf')"

step "3/7 配乐与音效（numpy/scipy 合成，约 10 秒）"
python3 audio/score.py --meta out/meta.json --out out/audio

step "4/7 QC 探针（接触、穿插、镜头避让；不出像素）"
node scripts/capture.mjs --page "$PAGE" --inspect "0:$FRAMES" --out out/qc/inspect.json 2>&1 | tee out/logs/inspect.log
check_page out/logs/inspect.log

step "5/7 渲染 $FRAMES 帧（可断点续渲；2 核 CPU + SwiftShader 约 55 分钟）"
node scripts/capture.mjs --page "$PAGE" --range "0:$FRAMES" --out out/frames 2>&1 | tee out/logs/render.log
check_page out/logs/render.log

step "6/7 封装 H.264 + AAC，并跑 13 项 QC"
python3 scripts/kit/finalize.py . --frames out/frames --audio out/audio/mix.wav --out "$OUT" \
  --meta out/meta.json --inspect out/qc/inspect.json --crf "$CRF"

step "7/7 独立校验：从 MP4 里解码每句字幕的画面，拼成 out/qc/verify_sheet.jpg"
python3 scripts/verify_mp4.py "$OUT"
python3 tools/check_repro.py || true   # 与原始渲染逐字节比对（仅供参考，不同平台会有像素级差异）

echo
echo "完成 -> $OUT   （QC 报告：out/qc/qc-report.md）"
