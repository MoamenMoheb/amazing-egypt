import os
import shutil
import re
from PIL import Image

MD_FILE = r'C:\Users\mahmo\.gemini\antigravity\brain\ea187c48-8ae1-4423-ac22-8414a7c6bd83\character_animation_frames.md'
DEST_DIR = r'frontend\public\character-cyber'

os.makedirs(DEST_DIR, exist_ok=True)

with open(MD_FILE, 'r', encoding='utf-8') as f:
    content = f.read()
    paths = re.findall(r'!\[.*?\]\((C:\\.*?)\)', content)

mapping = {
    'pharaoh_neutral_idle': 'normal',
    'pharaoh_half_blink': 'eyes-half',
    'pharaoh_full_blink': 'blink',
    'pharaoh_talk_small': 'talk-mid',
    'pharaoh_talk_wide': 'talking',
    'pharaoh_talk_smile': 'excited',
    'pharaoh_wave_tilt_left': 'wave-down',
    'pharaoh_wave_tilt_right': 'point',
    'WhatsApp Image': 'wave-middle', 
}

def remove_white_bg(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    # We will do a flood fill from the corners, or just replace near-white.
    # The image might have a slight gradient or shadows. 
    # Let's replace anything > 240,240,240 with transparent.
    newData = []
    for item in datas:
        # Check if near white
        if item[0] > 235 and item[1] > 235 and item[2] > 235:
            # Check edge case: don't remove if it's the eyes (cyan is like 0, 255, 255)
            # pure white has high R, G, B
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(out_path, "PNG")

for path in set(paths):
    name = os.path.basename(path)
    base_name = ''
    for key, mapped in mapping.items():
        if key in name:
            base_name = mapped
            break
    
    if not base_name:
        base_name = name.split('_17')[0]
    
    dest_path = os.path.join(DEST_DIR, f"{base_name}.png")
    
    print(f"Removing white bg for {name} -> {base_name}.png")
    try:
        remove_white_bg(path, dest_path)
    except Exception as e:
        print("Failed, copying instead:", e)
        shutil.copyfile(path, dest_path)

print("Done processing images with PIL.")
