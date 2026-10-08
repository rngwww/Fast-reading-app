import subprocess
import os
import time
import http.server
import socketserver
import threading
from PIL import Image

PORT = 8095

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

try:
    httpd = socketserver.TCPServer(("", PORT), QuietHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"HTTP server running on port {PORT}")
    time.sleep(1)
except Exception as e:
    print(f"Server start exception (maybe already running): {e}")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

tasks = [
    ("reader", "obsidian", "700", "marketing/screen_1_reader.png"),
    ("library", "obsidian", "350", "marketing/screen_2_library.png"),
    ("themes_dark", "obsidian", "500", "marketing/screen_3_dark.png"),
    ("themes_light", "vellum", "500", "marketing/screen_3_light.png"),
    ("settings", "obsidian", "350", "marketing/screen_4_settings.png"),
]

for screen, theme, wpm, out_path in tasks:
    temp_full = os.path.abspath(f"marketing/temp_capture_{screen}.png")
    url = f"http://localhost:{PORT}/marketing/real_capture_harness.html?screen={screen}&theme={theme}&wpm={wpm}"
    
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=600,1000",
        "--force-device-scale-factor=3",
        "--virtual-time-budget=3500",
        f"--screenshot={temp_full}",
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    if os.path.exists(temp_full):
        full_img = Image.open(temp_full)
        left = 85 * 3
        top = 0
        right = left + (430 * 3)
        bottom = top + (932 * 3)
        cropped = full_img.crop((left, top, right, bottom))
        final_dest = os.path.abspath(out_path)
        cropped.save(final_dest)
        print(f"Captured {screen} ({theme}) -> {out_path} ({cropped.size})")

try:
    httpd.shutdown()
except:
    pass
print("All captures completed.")
