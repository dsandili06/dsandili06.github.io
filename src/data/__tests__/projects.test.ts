import { describe, it, expect } from "vitest";
import { PROJECTS } from "@/data/projects";

describe("PROJECTS data integrity", () => {
  it("should have at least 2 projects", () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(2);
  });

  it("each project should have required fields", () => {
    for (const p of PROJECTS) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.href).toMatch(/^https?:\/\//);
      expect(p.label).toBeTruthy();
    }
  });

  it("all links should point to GitHub", () => {
    for (const p of PROJECTS) {
      expect(p.href).toContain("github.com/dsandili06");
    }
  });
});
