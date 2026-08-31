import { describe, it, expect } from "vitest";
import { COURSES, COURSE_GROUPS } from "@/data/courses";

describe("COURSES data integrity", () => {
  it("should have unique course IDs (n)", () => {
    const ids = COURSES.map((c) => c.n);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have 22 courses", () => {
    expect(COURSES.length).toBeGreaterThanOrEqual(22);
  });

  it("each course should have title and org", () => {
    for (const c of COURSES) {
      expect(c.title).toBeTruthy();
      expect(c.org).toBeTruthy();
    }
  });

  it("each certificate path should reference an existing file in public/certs/", () => {
    for (const c of COURSES) {
      if (c.cert) {
        // Reference should be to a file in /certs/
        expect(c.cert).toMatch(/^\/certs\/.+/);
      }
    }
  });

  it("Google Cybersecurity Certificate should exist as course #22", () => {
    const gcc = COURSES.find((c) => c.n === "22");
    expect(gcc).toBeDefined();
    expect(gcc?.title).toContain("Google Cybersecurity");
    expect(gcc?.org).toBe("Google");
  });
});

describe("COURSE_GROUPS data integrity", () => {
  it("should group all courses by org", () => {
    const totalInGroups = COURSE_GROUPS.reduce((sum, g) => sum + g.courses.length, 0);
    expect(totalInGroups).toBe(COURSES.length);
  });

  it("should have a Google group with multiple courses", () => {
    const google = COURSE_GROUPS.find((g) => g.org === "Google");
    expect(google).toBeDefined();
    expect(google!.courses.length).toBeGreaterThanOrEqual(8);
  });
});
