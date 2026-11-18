import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { INVESTIGATIONS } from "@/data/investigations";

const DIR = path.resolve(__dirname, "../writeups");
const files = readdirSync(DIR).filter((name) => name.endsWith(".md"));

describe("writeups content", () => {
  it("has exactly one markdown file per investigation slug", () => {
    const names = files.map((f) => f.replace(/\.md$/, "")).sort();
    const slugs = INVESTIGATIONS.map((i) => i.slug).sort();
    expect(names).toEqual(slugs);
  });

  describe.each(files)("%s", (file) => {
    const text = readFileSync(path.join(DIR, file), "utf8");
    const lines = text.split(/\r?\n/);

    it("has no H1", () => {
      expect(lines.filter((l) => l.startsWith("# "))).toEqual([]);
    });
    it("has no raw img tags", () => {
      // `<img>` as inline code is prose about the HTML element, not a raw tag.
      expect(text.replace(/`[^`\n]*`/g, "")).not.toContain("<img");
    });
    it("has no horizontal rules or front matter", () => {
      expect(lines.filter((l) => l.trim() === "---")).toEqual([]);
    });
    it("has no heading level 4 or deeper", () => {
      expect(lines.filter((l) => /^#{4,}\s/.test(l))).toEqual([]);
    });
    it("starts with a lede paragraph, not a heading", () => {
      const first = lines.find((l) => l.trim() !== "") ?? "";
      expect(first.startsWith("#")).toBe(false);
    });
    it("contains sections", () => {
      expect(text).toContain("## ");
    });
  });
});
