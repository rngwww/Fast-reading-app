from PIL import Image

img = Image.open("marketing/app_store_screenshot_3_themes.png").convert('RGB')
w, h = img.size
y = 1200 # middle of phone
row = [img.getpixel((x, y)) for x in range(w)]
bg = row[0]

# Find non-background pixels corresponding to both phone stages
phones = [x for x, p in enumerate(row) if abs(p[0]-bg[0]) > 15 or abs(p[1]-bg[1]) > 15 or abs(p[2]-bg[2]) > 15]
if phones:
    print(f"Overall dual phones bounds: min_x={phones[0]}, max_x={phones[-1]}")
    print(f"Left margin: {phones[0]}, Right margin: {w - 1 - phones[-1]}")
    print(f"Difference: {abs(phones[0] - (w - 1 - phones[-1]))}")
