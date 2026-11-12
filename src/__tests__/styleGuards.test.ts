import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_DIR = join(process.cwd(), "src");

function collect(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "__tests__" ? [] : collect(full, ext);
    return full.endsWith(ext) ? [full] : [];
  });
}

describe("guardas de estilo", () => {
  it("no usa transition-all; declarar solo las propiedades que se animan", () => {
    const offenders = collect(SRC_DIR, ".tsx").filter((file) =>
      readFileSync(file, "utf8").includes("transition-all"),
    );
    expect(offenders).toEqual([]);
  });

  it("no usa transition: all en CSS", () => {
    const css = readFileSync(join(SRC_DIR, "styles.css"), "utf8");
    expect(css).not.toMatch(/transition:\s*all\b/);
  });
});
