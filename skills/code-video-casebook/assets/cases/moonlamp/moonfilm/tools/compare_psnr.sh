#!/usr/bin/env bash
# 两个版本的逐帧 PSNR 对比（补全：制作时是对话里的内联命令）
# 用途：为了微信约 25 MB 的直发上限把 CRF 18 压到 CRF 20 时，证明画质没有明显损失
# （当时的结果：逐帧 PSNR 最低 45.5 dB，肉眼看不出差别）。
#
#   bash tools/compare_psnr.sh out/final_crf20.mp4 out/final_crf18.mp4
set -euo pipefail
A="${1:?usage: compare_psnr.sh <candidate.mp4> <reference.mp4>}"
B="${2:?usage: compare_psnr.sh <candidate.mp4> <reference.mp4>}"
echo "overall:"
ffmpeg -hide_banner -i "$A" -i "$B" -lavfi "[0:v][1:v]psnr" -f null - 2>&1 | grep -E "PSNR" | tail -1
echo "worst 3 frames (psnr_avg, dB):"
ffmpeg -v error -i "$A" -i "$B" -lavfi "[0:v][1:v]psnr=stats_file=-" -f null - 2>/dev/null \
  | awk '{print $6}' | sed 's/psnr_avg://' | sort -n | head -3
for f in "$A" "$B"; do python3 -c "import os,sys; print(f'{sys.argv[1]}  {os.path.getsize(sys.argv[1])/1e6:.1f} MB')" "$f"; done
