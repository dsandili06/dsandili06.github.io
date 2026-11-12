import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_DIR = join(process.cwd(), "src");
const TINY_TEXT = /text-\[(8|9|10|11)px\]/;

function collectTsx(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : collectTsx(full);
    return full.endsWith(".tsx") ? [full] : [];
  });
}

describe("tipografía", () => {
  it("no usa tamaños de texto menores a 12px; usar text-label o text-meta", () => {
    const offenders = collectTsx(SRC_DIR).filter((file) =>
      TINY_TEXT.test(readFileSync(file, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
