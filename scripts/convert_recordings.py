import os
import subprocess
import glob

ffmpeg_bin = r"C:\Users\knerl\AppData\Roaming\Python\Python314\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
rec_dir = os.path.abspath("tachyon-promo/public/recordings")

webms = glob.glob(os.path.join(rec_dir, "*.webm"))
print(f"Found {len(webms)} WebM recordings")

for w in webms:
    mp4_out = os.path.splitext(w)[0] + ".mp4"
    cmd = [
        ffmpeg_bin,
        "-y",
        "-i", w,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "fast",
        mp4_out
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(mp4_out):
        sz = os.path.getsize(mp4_out)
        print(f"Converted {os.path.basename(mp4_out)} ({sz} bytes)")
    else:
        print(f"Error converting {w}: {res.stderr}")

print("All recordings converted to MP4 successfully!")
