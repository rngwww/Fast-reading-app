from PIL import Image, ImageDraw

def create_tachyon_icon(size):
    # App Store strictly requires RGB (no alpha channel)
    img = Image.new("RGB", (size, size), color=(8, 8, 10))
    draw = ImageDraw.Draw(img)
    center = size / 2.0
    
    # 1. Subtle optical reticle lines
    line_color = (138, 138, 150)
    reticle_margin = size * 0.12
    stroke_w = max(1, int(size * 0.009))
    draw.line([(center, reticle_margin), (center, size - reticle_margin)], fill=line_color, width=stroke_w)
    draw.line([(reticle_margin, center), (size - reticle_margin, center)], fill=line_color, width=stroke_w)
    
    # 2. Concentric optical rings
    ring_radius = size * 0.23
    ring_bbox = [center - ring_radius, center - ring_radius, center + ring_radius, center + ring_radius]
    draw.ellipse(ring_bbox, outline=line_color, width=stroke_w)
    
    # 3. Geometric Sharp 'T'
    # Top horizontal bar
    bar_width = size * 0.52
    bar_height = size * 0.105
    bar_x0 = center - (bar_width / 2.0)
    bar_y0 = size * 0.28
    draw.rectangle([bar_x0, bar_y0, bar_x0 + bar_width, bar_y0 + bar_height], fill=(255, 255, 255))
    
    # Vertical stem
    stem_width = size * 0.115
    stem_height = size * 0.38
    stem_x0 = center - (stem_width / 2.0)
    stem_y0 = bar_y0 + bar_height
    draw.rectangle([stem_x0, stem_y0, stem_x0 + stem_width, stem_y0 + stem_height], fill=(255, 255, 255))
    
    # 4. Glowing Crimson Optical Dot at exact center
    dot_radius = size * 0.038
    # Outer subtle glow
    glow_steps = int(dot_radius * 2)
    for g in range(glow_steps, int(dot_radius), -1):
        ratio = (glow_steps - g) / float(glow_steps - dot_radius)
        glow_r = int(8 + (255 - 8) * ratio * 0.4)
        glow_g = int(8 + (42 - 8) * ratio * 0.4)
        glow_b = int(10 + (84 - 10) * ratio * 0.4)
        draw.ellipse([center - g, center - g, center + g, center + g], outline=(glow_r, glow_g, glow_b), width=1)
        
    dot_bbox = [center - dot_radius, center - dot_radius, center + dot_radius, center + dot_radius]
    draw.ellipse(dot_bbox, fill=(255, 42, 84))
    
    return img

if __name__ == "__main__":
    icon1024 = create_tachyon_icon(1024)
    icon1024.save("assets/icons/icon-1024.png", "PNG")
    icon1024.save("assets/icons/apple-touch-icon.png", "PNG")
    
    # Also save to Xcode Assets
    import os
    os.makedirs("ios/TACHYON/App/Assets.xcassets/AppIcon.appiconset", exist_ok=True)
    icon1024.save("ios/TACHYON/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png", "PNG")

    icon512 = create_tachyon_icon(512)
    icon512.save("assets/icons/icon-512.png", "PNG")

    icon192 = create_tachyon_icon(192)
    icon192.save("assets/icons/icon-192.png", "PNG")

    print("All App Store and web app icons generated cleanly!")
