/**
 * Copies Next static export (`out/`) to `itch-build/` for itch.io upload.
 * Run after `ITCH_HTML_EXPORT=1 next build` (see npm run build:itch).
 */

import { cpSync, existsSync, rmSync } from "fs";
import { join } from "path";

const root = process.cwd();
const outDir = join(root, "out");
const dest = join(root, "itch-build");

if (!existsSync(outDir)) {
  console.error("Missing out/ — run next build first.");
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(outDir, dest, { recursive: true });
console.log(`✓ itch-build ← ${outDir}`);
