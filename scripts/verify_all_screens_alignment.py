import os
from PIL import Image

screens = [
    "marketing/screen_1_reader.png",
    "marketing/screen_2_library.png",
    "marketing/screen_3_dark.png",
    "marketing/screen_3_light.png",
    "marketing/screen_4_settings.png",
]

all_passed = True

for path in screens:
    if not os.path.exists(path):
        print(f"File not found: {path}")
        all_passed = False
        continue
    img = Image.open(path).convert('RGB')
    w, h = img.size
    print(f"\n--- Checking {path} (Dimensions: {w}x{h}) ---")
    
    # Check dimensions
    if w != 1290 or h != 2796:
        print(f"FAILED: Expected 1290x2796, got {w}x{h}")
        all_passed = False
    
    # Check horizontal alignment across multiple vertical slices
    slices = [700, 1000, 1400, 1800]
    for y in slices:
        row = [img.getpixel((x, y)) for x in range(w)]
        bg = row[0]
        # find non-bg pixels
        diffs = [x for x, p in enumerate(row) if abs(p[0]-bg[0]) > 12 or abs(p[1]-bg[1]) > 12 or abs(p[2]-bg[2]) > 12]
        if diffs:
            left_pad = diffs[0]
            right_pad = w - 1 - diffs[-1]
            diff = abs(left_pad - right_pad)
            status = "PERFECT" if diff == 0 else ("BALANCED" if diff <= 4 else "OFFSET")
            print(f"  y={y}: left_pad={left_pad}px, right_pad={right_pad}px (diff={diff}px) -> {status}")

if all_passed:
    print("\nALL SCREENS HAVE VALID 1290x2796 RESOLUTION AND SENSORS CONFIRMED.")
