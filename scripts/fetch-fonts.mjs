/**
 * One-time script: self-host Google Fonts.
 * Downloads latin woff2 subsets for the families/weights the app uses,
 * saves them to public/fonts/, and prints the @font-face CSS to stdout.
 *
 * Usage: node scripts/fetch-fonts.mjs
 */
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "fonts");
mkdirSync(OUT_DIR, { recursive: true });

const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

// Chrome UA -> response contains woff2 URLs split by unicode-range subsets
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();

// Split into comment-labeled blocks; keep only the `/* latin */` subset
const blocks = [...css.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)].filter(
  ([, subset]) => subset === "latin",
);

const faces = [];
for (const [, , face] of blocks) {
  const family = face.match(/font-family:\s*'([^']+)'/)?.[1];
  const weight = face.match(/font-weight:\s*(\d+)/)?.[1];
  const url = face.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  const unicodeRange = face.match(/unicode-range:\s*([^;]+);/)?.[1];
  if (!family || !weight || !url || !unicodeRange) continue;

  const slug = family.toLowerCase().replace(/\s+/g, "-");
  const fileName = `${slug}-${weight}.woff2`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ Failed to download ${url}`);
    continue;
  }
  writeFileSync(join(OUT_DIR, fileName), Buffer.from(await res.arrayBuffer()));
  console.log(`✅ ${fileName}`);

  faces.push({ family, weight, fileName, unicodeRange: unicodeRange.trim() });
}

const cssOut = faces
  .map(
    ({ family, weight, fileName, unicodeRange }) => `@font-face {
  font-family: "${family}";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("/fonts/${fileName}") format("woff2");
  unicode-range: ${unicodeRange};
}`,
  )
  .join("\n\n");

writeFileSync(join(OUT_DIR, "_font-face.css"), cssOut + "\n");
console.log(`\n🎯 ${faces.length} faces written. @font-face CSS -> public/fonts/_font-face.css`);
