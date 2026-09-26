#!/usr/bin/env bash
# 半分辨率全片预览 + 带时间标注的拼图（补全：制作时是对话里的内联命令，按记录整理成脚本）
#
#   bash tools/preview.sh            # 每 4 帧取 1（6 fps）：168 帧，2 核 CPU 约 5 分钟 -> out/qc/strip_*.jpg
#   STEP=2 bash tools/preview.sh     # 12 fps，更细
#
# 输出 960x540、3D 画面 800x450（四分之一像素，约 1.8 s/帧）。用来审运动、转场和节奏，
# 质感和细节要用全分辨率静帧看：node scripts/capture.mjs --frames 0,84,132 --out out/stills
set -euo pipefail
cd "$(dirname "$0")/.."
STEP="${STEP:-4}"
OUT="${OUT:-out/preview}"
TOTAL=$(python3 -c "import json; print(json.load(open('out/meta.json'))['total'])" 2>/dev/null || echo 672)
frames=$(python3 -c "print(','.join(str(f) for f in range(0, $TOTAL, $STEP)))")
mkdir -p "$OUT" out/qc
node scripts/capture.mjs --page "film.html?w=960&h=540&pw=800&ph=450" --frames "$frames" --out "$OUT"
python3 tools/preview_strips.py "$OUT" --out-prefix out/qc/strip
