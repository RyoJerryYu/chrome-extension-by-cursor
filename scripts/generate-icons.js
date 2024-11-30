const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [16, 32, 48, 128];
const iconDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  // Ensure icons directory exists
  await fs.mkdir(iconDir, { recursive: true });
  
  // Generate each size
  for (const size of sizes) {
    await sharp(path.join(__dirname, '../public/icons/icon.svg'))
      .resize(size, size)
      .png()
      .toFile(path.join(iconDir, `icon${size}.png`));
  }
}

generateIcons().catch(console.error); 