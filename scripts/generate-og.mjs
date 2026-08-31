import sharp from "sharp";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "og-image.svg");
const pngPath = join(root, "public", "og-image.png");

if (!existsSync(svgPath)) {
  console.error("❌ public/og-image.svg not found");
  process.exit(1);
}

await sharp(svgPath, { density: 96 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(pngPath);

console.log("✅ Generated public/og-image.png (1200x630)");
