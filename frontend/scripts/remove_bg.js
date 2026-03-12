const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ahmed\\.gemini\\antigravity\\brain\\86b660be-aee3-46a6-9219-4bfbc4e8d314';
const files = fs.readdirSync(dir).filter(f => f.startsWith('mascot_') && f.endsWith('.png') && !f.includes('_transparent'));

(async () => {
    for (const file of files) {
        console.log(`Processing ${file}...`);
        const imagePath = path.join(dir, file);
        try {
            const image = await Jimp.read(imagePath);

            // Remove white or near-white background
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                const r = this.bitmap.data[idx + 0];
                const g = this.bitmap.data[idx + 1];
                const b = this.bitmap.data[idx + 2];
                // If it's pure white, or extremely close to it, make it transparent
                // 3D renders usually have pure white background
                if (r > 240 && g > 240 && b > 240) {
                    this.bitmap.data[idx + 3] = 0;
                }
            });

            const outName = file.replace('.png', '_transparent.png');
            await image.writeAsync(path.join(dir, outName));
            console.log(`Saved transparent version of ${file} as ${outName}`);
        } catch (e) {
            console.error(`Error processing ${file}: `, e);
        }
    }
    console.log("Done processing all images.");
})();
