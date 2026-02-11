/**
 * Generate a placeholder OG image (1200×630) for social sharing.
 * Replace public/images/og-image.png with your own image when ready.
 * Run: node scripts/generate-og-image.mjs
 * Requires: npm install sharp
 */

import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "images", "og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  const buffer = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: { r: 240, g: 240, b: 242 },
    },
  })
    .png()
    .toBuffer();

  await sharp(buffer).toFile(outPath);
  console.log("Created:", outPath);
  console.log("Replace this file with your own 1200×630 image when ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
