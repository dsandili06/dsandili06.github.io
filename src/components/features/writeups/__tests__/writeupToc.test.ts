import { describe, expect, it } from "vitest";
import { parseToc, TOC_VISIBLE_THRESHOLD } from "@/components/features/writeups/writeupToc";

describe("parseToc", () => {
  it("keeps document order and only h2/h3 entries", () => {
    const md = ["# Title", "## First", "### Nested", "#### Too deep", "## Second"].join("\n");

    expect(parseToc(md)).toEqual([
      { depth: 2, text: "First", id: "first" },
      { depth: 3, text: "Nested", id: "nested" },
      { depth: 2, text: "Second", id: "second" },
    ]);
  });

  it("ignores headings inside code fences and strips inline markers", () => {
    const md = [
      "## **Bold** `heading`",
      "```",
      "## Not a heading",
      "```",
      "~~~ts",
      "## Also not a heading",
      "~~~",
      "## After fences",
    ].join("\n");

    expect(parseToc(md).map((entry) => entry.text)).toEqual(["Bold heading", "After fences"]);
  });

  it("suffixes duplicated headings the way rehype-slug does", () => {
    const md = ["## Análisis", "## Análisis", "## Análisis"].join("\n");

    expect(parseToc(md).map((entry) => entry.id)).toEqual(["análisis", "análisis-1", "análisis-2"]);
  });

  it("exposes the visibility threshold used by the index", () => {
    expect(TOC_VISIBLE_THRESHOLD).toBe(4);
  });
});
