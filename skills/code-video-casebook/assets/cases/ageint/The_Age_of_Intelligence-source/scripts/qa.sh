#!/usr/bin/env bash
# [补全] Delivery QA: frame count/duration, black/freeze/silence scan, loudness, per-cut contact sheets.
set -euo pipefail
cd "$(dirname "$0")/.."
F=${1:-${AOI_BUILD:-build}/AGE_OF_INTELLIGENCE_1080p60.mp4}
ffprobe -v error -count_frames -show_entries stream=codec_name,nb_read_frames,duration,width,height,r_frame_rate -of compact "$F"
ffmpeg -hide_banner -nostats -i "$F" \
  -vf "blackdetect=d=0.01:pix_th=0.06:picture_black_ratio_th=0.98,freezedetect=n=0.0008:d=0.15" \
  -af "silencedetect=n=-50dB:d=0.3,ebur128=peak=true" -f null - 2> "${F%.mp4}_qa.txt"
echo "--- issues (empty = clean):"
grep -E "black_start|freeze_start|silence_start" "${F%.mp4}_qa.txt" | sed 's/.*\] //' || true
grep -E "^\s+I:|^\s+Peak:" "${F%.mp4}_qa.txt" | tail -2
python3 src/cut_sheets.py "$F"
