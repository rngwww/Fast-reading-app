import subprocess
import os
import time

ffmpeg_path = r"C:\Users\knerl\AppData\Roaming\Python\Python314\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"

images = [
    os.path.abspath("marketing/app_store_screenshot_1_speed.png"),
    os.path.abspath("marketing/app_store_screenshot_2_library.png"),
    os.path.abspath("marketing/app_store_screenshot_3_themes.png"),
    os.path.abspath("marketing/app_store_screenshot_4_audio.png"),
    os.path.abspath("marketing/scene_5_outro.png"),
]

audio_path = os.path.abspath("marketing/audio/demo_soundtrack.wav")
os.makedirs("marketing/video_parts", exist_ok=True)

# Scene configs:
# Scene 1: 0.0s - 4.8s (zoom in center 1.0 -> 1.05)
# Scene 2: 0.0s - 4.8s (zoom in center 1.0 -> 1.04)
# Scene 3: 0.0s - 4.8s (zoom in center 1.0 -> 1.05)
# Scene 4: 0.0s - 4.8s (zoom in center 1.0 -> 1.04)
# Scene 5: 0.0s - 5.8s (gentle breathe 1.0 -> 1.03)

print("Step 1: Rendering individual cinematic scene clips...")
clip_files = []

durations = [4.8, 4.8, 4.8, 4.8, 5.8]
zooms = [
    "min(zoom+0.00035,1.05)",
    "min(zoom+0.00030,1.04)",
    "min(zoom+0.00035,1.05)",
    "min(zoom+0.00030,1.04)",
    "min(zoom+0.00020,1.03)",
]

for idx, (img, dur, z_expr) in enumerate(zip(images, durations, zooms)):
    out_clip = os.path.abspath(f"marketing/video_parts/clip_{idx+1}.mp4")
    num_frames = int(dur * 30)
    print(f"Rendering Clip {idx+1} ({dur}s)...")
    
    # We apply subtle zoompan
    filter_expr = f"zoompan=z='{z_expr}':d={num_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1290x2796:fps=30"
    
    cmd = [
        ffmpeg_path,
        "-y",
        "-loop", "1", "-i", img,
        "-filter_complex", filter_expr,
        "-t", str(dur),
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        out_clip
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error rendering clip {idx+1}: {res.stderr}")
        exit(1)
    clip_files.append(out_clip)

print("Step 2: Chaining scenes with smooth crossfades and muxing luxury soundtrack...")
# Scene transitions:
# Clip 1 starts at 0.0, dur 4.8
# Transition 1: offset = 4.2, dur = 0.6 -> clip 2 ends at 4.2 + 4.8 = 9.0
# Transition 2: offset = 8.4, dur = 0.6 -> clip 3 ends at 8.4 + 4.8 = 13.2
# Transition 3: offset = 12.6, dur = 0.6 -> clip 4 ends at 12.6 + 4.8 = 17.4
# Transition 4: offset = 16.8, dur = 0.6 -> clip 5 ends at 16.8 + 5.8 = 22.6, trimmed to 22.0

filter_complex = (
    "[0:v][1:v]xfade=transition=fade:duration=0.6:offset=4.2[v01];"
    "[v01][2:v]xfade=transition=fade:duration=0.6:offset=8.4[v02];"
    "[v02][3:v]xfade=transition=fade:duration=0.6:offset=12.6[v03];"
    "[v03][4:v]xfade=transition=fade:duration=0.6:offset=16.8[v_out];"
    "[v_out]fade=t=out:st=21.2:d=0.8[v_final]"
)

out_1290 = os.path.abspath("tachyon_app_preview_1290x2796.mp4")
out_1080 = os.path.abspath("tachyon_app_preview_1080x1920.mp4")
marketing_out = os.path.abspath("marketing/tachyon_demo_video.mp4")

cmd_stitch = [
    ffmpeg_path,
    "-y",
    "-i", clip_files[0],
    "-i", clip_files[1],
    "-i", clip_files[2],
    "-i", clip_files[3],
    "-i", clip_files[4],
    "-i", audio_path,
    "-filter_complex", filter_complex,
    "-map", "[v_final]",
    "-map", "5:a",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "17",
    "-c:a", "aac",
    "-b:a", "256k",
    "-ar", "48000",
    "-pix_fmt", "yuv420p",
    "-t", "22.0",
    "-movflags", "+faststart",
    out_1290
]

print("Rendering full resolution 1290x2796 master...")
t0 = time.time()
res = subprocess.run(cmd_stitch, capture_output=True, text=True)
if res.returncode != 0:
    print(f"Error stitching: {res.stderr}")
    exit(1)
print(f"Master rendered in {time.time() - t0:.2f}s -> {out_1290} ({os.path.getsize(out_1290)} bytes)")

# Also create standard 1080x1920 portrait format for universal App Store preview compatibility
print("Rendering standard 1080x1920 App Store version...")
cmd_1080 = [
    ffmpeg_path,
    "-y",
    "-i", out_1290,
    "-vf", "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=#F7F6F2",
    "-c:v", "libx264",
    "-crf", "17",
    "-c:a", "copy",
    "-movflags", "+faststart",
    out_1080
]
res_1080 = subprocess.run(cmd_1080, capture_output=True, text=True)
if res_1080.returncode == 0:
    print(f"1080x1920 version rendered: {out_1080} ({os.path.getsize(out_1080)} bytes)")

# Copy master to marketing folder as well
import shutil
shutil.copy2(out_1290, marketing_out)
print(f"Saved copy to {marketing_out}")

print("All demo video renders completed successfully!")
