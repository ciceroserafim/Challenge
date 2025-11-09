const { join } = require('node:path');
const { mkdirSync, writeFileSync } = require('node:fs');
const { PNG } = require('pngjs');

function createIcon(size, rgba, filename) {
  const png = new PNG({ width: size, height: size });

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const idx = (size * y + x) << 2;
      png.data[idx] = rgba[0];
      png.data[idx + 1] = rgba[1];
      png.data[idx + 2] = rgba[2];
      png.data[idx + 3] = rgba[3];
    }
  }

  const outputDir = join(__dirname, '..', 'assets');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, filename);

  const buffer = PNG.sync.write(png);
  writeFileSync(outputPath, buffer);

  console.log(`Saved ${filename} (${size}x${size})`);
}

function main() {
  const mottuGreen = [46, 125, 50, 255];
  createIcon(1024, mottuGreen, 'icon.png');
  createIcon(1080, mottuGreen, 'adaptive-icon.png');
}

main();
