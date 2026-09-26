#!/usr/bin/env bash
# [补全] Preview single frames without rendering the film. Beats are prefixed with b.
# usage: bash scripts/stills.sh b64.3,b100,b138   -> build/stills/*.png + build/sheet.png
set -euo pipefail
cd "$(dirname "$0")/.."
python3 src/render.py --stills "${1:-b4,b17.5,b64.3,b100,b138,b188}" --scale 0.5
python3 src/sheet.py build/sheet.png build/stills/*.png
echo "-> build/sheet.png"
