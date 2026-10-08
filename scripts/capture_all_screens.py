import subprocess
import os
from PIL import Image

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

screens = [
    {
        "name": "screen_2_library.png",
        "file": "marketing/screen_2_library.html"
    },
    {
        "name": "screen_4_settings.png",
        "file": "marketing/screen_4_settings.html"
    }
]

for s in screens:
    in_html = os.path.abspath(s["file"])
    out_file = os.path.abspath(os.path.join("marketing", s["name"]))
    print(f"Capturing {s['name']} from {in_html}...")
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=430,932",
        "--force-device-scale-factor=3",
        f"--screenshot={out_file}",
        f"file:///{in_html}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file):
        img = Image.open(out_file)
        print(f"Success: {s['name']} -> {img.size}")
    else:
        print(f"Failed {s['name']}: {res.stderr}")

print("Capture completed!")
