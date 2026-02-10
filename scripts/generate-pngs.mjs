/**
 * One-off script: convert public/images/*.svg to PNG.
 * Run: node scripts/generate-pngs.mjs
 * Requires: npm install sharp
 */

import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_IMAGES = join(__dirname, "..", "public", "images");

const CONFIG = [
  { svg: "landing-hero.svg", png: "landing-hero.png", width: 600, height: 400 },
  { svg: "quiz-illustration.svg", pngBase: "quiz-s%d.png", width: 800, height: 450, count: 10 },
];

async function convertOne(svgPath, pngPath, width, height) {
  const svg = readFileSync(svgPath);
  await sharp(svg)
    .resize(width, height)
    .png()
    .toFile(pngPath);
  console.log("  →", pngPath);
}

async function main() {
  console.log("Generating PNGs in public/images/ ...\n");

  for (const c of CONFIG) {
    const svgPath = join(PUBLIC_IMAGES, c.svg);
    if (!existsSync(svgPath)) {
      console.warn("Skip (missing):", c.svg);
      continue;
    }

    if (c.png) {
      await convertOne(svgPath, join(PUBLIC_IMAGES, c.png), c.width, c.height);
    } else if (c.pngBase && c.count) {
      const svg = readFileSync(svgPath);
      const buf = await sharp(svg).resize(c.width, c.height).png().toBuffer();
      for (let i = 1; i <= c.count; i++) {
        const pngPath = join(PUBLIC_IMAGES, c.pngBase.replace("%d", String(i)));
        await sharp(buf).toFile(pngPath);
        console.log("  →", pngPath);
      }
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
