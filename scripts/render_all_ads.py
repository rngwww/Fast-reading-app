import subprocess
import os
from PIL import Image

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

ads = [
    {"src": "marketing/ad_1.html", "dst": "marketing/app_store_screenshot_1_speed.png"},
    {"src": "marketing/ad_2.html", "dst": "marketing/app_store_screenshot_2_library.png"},
    {"src": "marketing/ad_3.html", "dst": "marketing/app_store_screenshot_3_themes.png"},
    {"src": "marketing/ad_4.html", "dst": "marketing/app_store_screenshot_4_audio.png"},
]

for ad in ads:
    src_abs = os.path.abspath(ad["src"])
    dst_abs = os.path.abspath(ad["dst"])
    print(f"Rendering {ad['dst']}...")
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1290,2796",
        f"--screenshot={dst_abs}",
        f"file:///{src_abs}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(dst_abs):
        img = Image.open(dst_abs)
        print(f"Success: {ad['dst']} -> {img.size}")
    else:
        print(f"Failed {ad['dst']}: {res.stderr}")

print("All 4 App Store marketing images rendered successfully!")
