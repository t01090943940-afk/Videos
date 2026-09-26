import subprocess, multiprocessing as mp
from scenes import render_frame
from lib import W, H, FPS
NF = 30 * FPS
def job(i):
    return bytes(render_frame(i / FPS).get_data())
if __name__ == "__main__":
    out = "/mnt/user-data/outputs/嘟嘟追风筝_30s.mp4"
    p = subprocess.Popen(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgr0", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", "audio.wav", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    with mp.Pool(2) as pool:
        for i, fr in enumerate(pool.imap(job, range(NF), chunksize=8)):
            p.stdin.write(fr)
            if i % 150 == 0: print(i, flush=True)
    p.stdin.close(); p.wait(); print("done", p.returncode)
