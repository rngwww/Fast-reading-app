from PIL import Image

for name in ['app_store_screenshot_1_speed.png', 'app_store_screenshot_2_library.png', 'app_store_screenshot_3_themes.png', 'app_store_screenshot_4_audio.png']:
    path = f'marketing/{name}'
    img = Image.open(path)
    rgb = img.convert('RGB')
    width, height = img.size
    
    y = 1200
    dark_x = []
    for x in range(width):
        r, g, b = rgb.getpixel((x, y))
        if r < 50 and g < 50 and b < 50:
            dark_x.append(x)
            
    if dark_x:
        left = dark_x[0]
        right = dark_x[-1]
        phone_width = right - left + 1
        center = (left + right) / 2.0
        img_center = width / 2.0
        shift = center - img_center
        left_margin = left
        right_margin = width - 1 - right
        print(f"{name}:")
        print(f"  Phone: Left={left}, Right={right}, Width={phone_width}")
        print(f"  Margins: LeftMargin={left_margin}, RightMargin={right_margin}, Diff(Right-Left)={right_margin - left_margin}")
        print(f"  Center={center}, ImgCenter={img_center}, Shift={shift}px\n")
