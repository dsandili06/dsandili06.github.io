import { describe, expect, it } from "vitest";
import { INVESTIGATIONS } from "@/data/investigations";
import {
  getWriteupCacheKey,
  investigationById,
  investigationBySlug,
  toRawUrl,
} from "@/components/features/writeups/writeupSource";

describe("writeupSource", () => {
  it("converts GitHub blob URLs to raw URLs", () => {
    expect(toRawUrl("https://github.com/dsandili06/repo/blob/main/Writeups/Lab.md")).toBe(
      "https://raw.githubusercontent.com/dsandili06/repo/main/Writeups/Lab.md",
    );
  });

  it("leaves already-raw URLs untouched", () => {
    const raw = "https://raw.githubusercontent.com/dsandili06/repo/main/Writeups/Lab.md";
    expect(toRawUrl(raw)).toBe(raw);
  });

  it("resolves a known investigation and returns undefined for an unknown id", () => {
    const first = INVESTIGATIONS[0];
    expect(investigationById(first.id)).toEqual(first);
    expect(investigationById("LAB_999")).toBeUndefined();
  });

  it("keeps the writeup cache key stable", () => {
    expect(getWriteupCacheKey("LAB_001")).toBe("writeup-LAB_001");
  });

  it("has unique kebab-case slugs", () => {
    const slugs = INVESTIGATIONS.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("resolves investigations by slug", () => {
    expect(investigationBySlug("fakegpt")?.id).toBe("LAB_001");
    expect(investigationBySlug("nope")).toBeUndefined();
  });
});
