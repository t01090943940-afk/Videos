"""Driver: render frames -> x264 -> mux score."""
import subprocess, sys, time
import numpy as np
from scenes import SCENES, TOTAL
from kit import W, H, FPS

def main():
    n_frames = int(TOTAL * FPS)
    vpipe = subprocess.Popen(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         "out/video_silent.mp4"],
        stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    t0 = time.time()
    for f in range(n_frames):
        gt = f / FPS
        sc = [s for s in SCENES if s[0] <= gt < s[1]] or [SCENES[-1]]
        fr = sc[0][2](gt - sc[0][0])
        if fr.dtype != np.uint8:
            fr = np.clip(fr, 0, 255).astype(np.uint8)
        vpipe.stdin.write(fr.tobytes())
        if f % 60 == 0:
            el = time.time() - t0
            eta = el / (f + 1) * (n_frames - f - 1)
            print(f"frame {f}/{n_frames}  {el:.0f}s elapsed  eta {eta:.0f}s",
                  flush=True)
    vpipe.stdin.close(); vpipe.wait()
    print("video done, muxing…")
    subprocess.run(
        ["ffmpeg", "-y", "-i", "out/video_silent.mp4", "-i", "out/score.wav",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
         "-movflags", "+faststart", "out/kimi_film.mp4"], check=True)
    print("DONE -> out/kimi_film.mp4")

if __name__ == "__main__":
    main()
