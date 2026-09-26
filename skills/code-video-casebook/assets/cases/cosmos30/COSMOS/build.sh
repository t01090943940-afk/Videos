#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"
export OPENBLAS_NUM_THREADS=1
export LP_NUM_THREADS=3
python render.py
python score.py
python master_audio.py
python assemble.py
