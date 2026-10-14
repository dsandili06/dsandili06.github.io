import { describe, expect, it } from "vitest";
import {
  parseToc,
  TOC_VISIBLE_THRESHOLD,
  WRITEUP_HEADING_ID_PREFIX,
} from "@/components/features/writeups/writeupToc";

describe("parseToc", () => {
  it("keeps document order and only h2/h3 entries", () => {
    const md = ["# Title", "## First", "### Nested", "#### Too deep", "## Second"].join("\n");

    expect(parseToc(md)).toEqual([
      { depth: 2, text: "First", id: `${WRITEUP_HEADING_ID_PREFIX}first` },
      { depth: 3, text: "Nested", id: `${WRITEUP_HEADING_ID_PREFIX}nested` },
      { depth: 2, text: "Second", id: `${WRITEUP_HEADING_ID_PREFIX}second` },
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

    expect(parseToc(md).map((entry) => entry.id)).toEqual([
      `${WRITEUP_HEADING_ID_PREFIX}análisis`,
      `${WRITEUP_HEADING_ID_PREFIX}análisis-1`,
      `${WRITEUP_HEADING_ID_PREFIX}análisis-2`,
    ]);
  });

  it("exposes the visibility threshold used by the index", () => {
    expect(TOC_VISIBLE_THRESHOLD).toBe(4);
  });
});
