import { describe, it, expect } from "vitest";
import { STACK_GROUPS } from "@/data/stack";

describe("STACK_GROUPS data integrity", () => {
  it("should have 4 groups", () => {
    expect(STACK_GROUPS).toHaveLength(4);
  });

  it("each group should have a title and items", () => {
    for (const g of STACK_GROUPS) {
      expect(g.title).toBeTruthy();
      expect(g.items.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("should contain all expected categories", () => {
    const titles = STACK_GROUPS.map((g) => g.title);
    expect(titles).toContain("FORENSE & TRIAGE");
    expect(titles).toContain("MALWARE ANALYSIS");
    expect(titles).toContain("SIEM & NETWORK");
    expect(titles).toContain("SCRIPTING & OSINT");
  });

  it("should have no duplicate items across groups", () => {
    const allItems = STACK_GROUPS.flatMap((g) => g.items);
    expect(new Set(allItems).size).toBe(allItems.length);
  });
});
