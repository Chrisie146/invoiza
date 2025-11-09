const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Create a simple blue icon SVG in memory
const iconSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#3B82F6"/>
  <text x="96" y="96" font-size="80" fill="white" text-anchor="middle" dominant-baseline="central" font-weight="bold">I</text>
</svg>
`);

const sizes = [192, 256, 512];

async function generateIcons() {
  console.log('Generating PWA icons...');
  
  for (const size of sizes) {
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(publicDir, filename);
    
    try {
      await sharp(iconSvg)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(filepath);
      
      console.log(`✓ Generated ${filename}`);
    } catch (err) {
      console.error(`✗ Failed to generate ${filename}:`, err.message);
    }
  }
  
  console.log('Icon generation complete!');
}

generateIcons();
