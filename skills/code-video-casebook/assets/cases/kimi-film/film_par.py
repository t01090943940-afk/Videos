"""Parallel render: N chunks -> per-chunk mp4 -> concat -> mux score."""
import subprocess, time, os
import multiprocessing as mp
import numpy as np
from scenes import SCENES, TOTAL
from kit import W, H, FPS

N_JOBS = 8

def render_range(f0, f1, path):
    vpipe = subprocess.Popen(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-pix_fmt", "yuv420p", path],
        stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    for f in range(f0, f1):
        gt = f / FPS
        sc = [s for s in SCENES if s[0] <= gt < s[1]] or [SCENES[-1]]
        fr = sc[0][2](gt - sc[0][0])
        if fr.dtype != np.uint8:
            fr = np.clip(fr, 0, 255).astype(np.uint8)
        vpipe.stdin.write(fr.tobytes())
    vpipe.stdin.close(); vpipe.wait()
    return path

def main():
    n = int(TOTAL * FPS)
    edges = np.linspace(0, n, N_JOBS + 1).astype(int)
    chunks = [(int(edges[i]), int(edges[i + 1])) for i in range(N_JOBS)]
    print("chunks:", chunks, flush=True)
    t0 = time.time()
    with mp.Pool(N_JOBS) as pool:
        res = [pool.apply_async(render_range, (a, b, f"out/chunk_{i:02d}.mp4"))
               for i, (a, b) in enumerate(chunks)]
        for r in res: r.get()
    print(f"render {time.time() - t0:.0f}s", flush=True)
    with open("out/concat.txt", "w") as fh:
        for i in range(len(chunks)):
            fh.write(f"file chunk_{i:02d}.mp4\n")
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0",
                    "-i", "out/concat.txt", "-c", "copy",
                    "out/video_silent.mp4"], check=True)
    subprocess.run(
        ["ffmpeg", "-y", "-i", "out/video_silent.mp4", "-i", "out/score.wav",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
         "-movflags", "+faststart", "out/kimi_film.mp4"], check=True)
    print("DONE -> out/kimi_film.mp4")

if __name__ == "__main__":
    main()
