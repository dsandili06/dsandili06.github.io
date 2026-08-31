import { describe, it, expect } from "vitest";
import { INVESTIGATIONS } from "@/data/investigations";

describe("INVESTIGATIONS data integrity", () => {
  it("should have at least 15 investigations", () => {
    expect(INVESTIGATIONS.length).toBeGreaterThanOrEqual(15);
  });

  it("should have unique IDs", () => {
    const ids = INVESTIGATIONS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each investigation should have valid fields", () => {
    for (const i of INVESTIGATIONS) {
      expect(i.title).toBeTruthy();
      expect(i.platform).toBeTruthy();
      expect(i.summary).toBeTruthy();
      expect(i.categories.length).toBeGreaterThanOrEqual(1);
      expect(i.href).toMatch(/^https?:\/\//);
    }
  });

  it("all hrefs should point to GitHub with valid paths", () => {
    for (const i of INVESTIGATIONS) {
      expect(i.href).toContain("github.com");
    }
  });
});
