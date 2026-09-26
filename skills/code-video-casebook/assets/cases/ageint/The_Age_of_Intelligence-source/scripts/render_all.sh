#!/usr/bin/env bash
# [补全] Full pipeline up to the intermediate video segments (session ran these steps by hand).
# usage: JOBS=2 bash scripts/render_all.sh
set -euo pipefail
cd "$(dirname "$0")/.."
JOBS=${JOBS:-2}
BUILD=${AOI_BUILD:-build}; mkdir -p "$BUILD"
PY=python3

echo "[1/5] validate timeline";      $PY src/timeline.py
echo "[2/5] synthesize music + sfx"; $PY src/music.py
if [[ "${SKIP_CHECKS:-0}" != 1 ]]; then
  echo "[3/5] smoke test (first/mid/last frame of all 108 shots)"; $PY src/smoke.py
  echo "[4/5] blank-frame check";      $PY src/qa_frames.py
fi
echo "[5/5] render $JOBS segments in parallel"
N=${AOI_FRAMES:-$($PY -c "import sys; sys.path.insert(0,'src'); import timeline as T; print(T.N_FRAMES)")}   # AOI_FRAMES=120 for a quick test
STEP=$(( (N + JOBS - 1) / JOBS ))
: > "$BUILD/list.txt"
pids=()
for ((i=0; i<JOBS; i++)); do
  s=$(( i * STEP )); e=$(( s + STEP )); (( e > N )) && e=$N
  (( s >= e )) && continue
  $PY src/render.py --start $s --end $e --out "$BUILD/seg$i.mp4" > "$BUILD/log$i.txt" 2>&1 &
  pids+=($!)
  echo "file 'seg$i.mp4'" >> "$BUILD/list.txt"
done
for p in "${pids[@]}"; do wait "$p"; done
tail -n 1 "$BUILD"/log*.txt
echo "segments ready -> run: bash scripts/encode.sh"
