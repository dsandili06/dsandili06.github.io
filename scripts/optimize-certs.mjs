import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CERTS_DIR = join(__dirname, "..", "public", "certs");

if (!existsSync(CERTS_DIR)) {
  console.error("❌ public/certs/ not found");
  process.exit(1);
}

const files = readdirSync(CERTS_DIR).filter((f) =>
  [".png", ".jpg", ".jpeg"].includes(extname(f).toLowerCase()),
);

console.log(`📂 Found ${files.length} images to optimize in ${CERTS_DIR}`);

let converted = 0;
let skipped = 0;

for (const file of files) {
  const inputPath = join(CERTS_DIR, file);
  const webpName = file.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  const outputPath = join(CERTS_DIR, webpName);

  // Skip if WebP already exists
  if (existsSync(outputPath)) {
    skipped++;
    continue;
  }

  try {
    await sharp(inputPath).webp({ quality: 80, effort: 4 }).toFile(outputPath);

    console.log(`  ✅ ${file} → ${webpName}`);
    converted++;
  } catch (err) {
    console.error(`  ❌ ${file}: ${err}`);
  }
}

console.log(`\n🎯 Done: ${converted} converted, ${skipped} skipped (already exist)`);
