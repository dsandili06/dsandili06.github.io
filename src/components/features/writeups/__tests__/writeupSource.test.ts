import { describe, expect, it } from "vitest";
import { INVESTIGATIONS } from "@/data/investigations";
import {
  getWriteupCacheKey,
  investigationById,
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
});
