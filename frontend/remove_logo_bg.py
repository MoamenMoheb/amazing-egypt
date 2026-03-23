from PIL import Image

def remove_bg(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    # getting the background color from the corners
    bg_color = data[0] 
    
    newData = []
    thresh = 40  # tolerance
    
    for item in data:
        # Check distance from background color
        diff = abs(item[0] - bg_color[0]) + abs(item[1] - bg_color[1]) + abs(item[2] - bg_color[2])
        if diff < thresh:
            newData.append((255, 255, 255, 0))
        else:
            # Maybe soften edges? For now just hard threshold
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")

if __name__ == "__main__":
    remove_bg(r"e:\Codes\GM\amazing-egypt\frontend\public\logo.png", r"e:\Codes\GM\amazing-egypt\frontend\public\logo.png")
    print("Background removed successfully.")
