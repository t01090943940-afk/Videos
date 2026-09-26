#!/usr/bin/env bash
# [补全] Concat segments + mux audio -> 1080p60 master, then a <30 MB 720p60 share cut, then the SRT.
set -euo pipefail
cd "$(dirname "$0")/.."
BUILD=${AOI_BUILD:-build}
cd "$BUILD"
ffmpeg -loglevel error -y -f concat -safe 0 -i list.txt -i master.wav -map 0:v -map 1:a \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 -r 60 \
  -af "volume=-2dB" -c:a aac -b:a 320k -ar 48000 -movflags +faststart \
  -metadata title="The Age of Intelligence" -shortest AGE_OF_INTELLIGENCE_1080p60.mp4
V="hqdn3d=2.5:2.5:5:5,scale=1280:720:flags=lanczos"
ffmpeg -loglevel error -y -i AGE_OF_INTELLIGENCE_1080p60.mp4 -vf "$V" -c:v libx264 -preset slow \
  -b:v 2350k -maxrate 4000k -bufsize 6000k -pass 1 -passlogfile p720 -an -f null /dev/null
ffmpeg -loglevel error -y -i AGE_OF_INTELLIGENCE_1080p60.mp4 -vf "$V" -c:v libx264 -preset slow \
  -b:v 2350k -maxrate 4000k -bufsize 6000k -pass 2 -passlogfile p720 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart AGE_OF_INTELLIGENCE_720p60_share.mp4
cd - > /dev/null
python3 src/make_srt.py
ls -la "$BUILD"/*.mp4 "$BUILD"/*.srt
