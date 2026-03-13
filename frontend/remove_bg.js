import Jimp from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, "public", "logo.png");

Jimp.read(logoPath)
  .then((image) => {
    const targetColor = image.getPixelColor(1, 1); 
    const threshold = 50; 

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const current = {
        r: this.bitmap.data[idx + 0],
        g: this.bitmap.data[idx + 1],
        b: this.bitmap.data[idx + 2],
      };
      const bg = Jimp.intToRGBA(targetColor);
      
      const diff = Math.abs(current.r - bg.r) + Math.abs(current.g - bg.g) + Math.abs(current.b - bg.b);
      
      if (diff < threshold) {
        this.bitmap.data[idx + 3] = 0; // alpha to 0
      }
    });

    return image.writeAsync(logoPath);
  })
  .then(() => {
    console.log("Background removed successfully.");
  })
  .catch((err) => {
    console.error("Error processing image:", err);
  });
