import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { COURSES, COURSE_GROUPS } from "@/data/courses";

describe("COURSES data integrity", () => {
  it("should have unique course IDs (n)", () => {
    const ids = COURSES.map((c) => c.n);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have 21 courses", () => {
    expect(COURSES.length).toBe(21);
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
        expect(c.cert).toMatch(/^\/certs\/.+/);
        const filePath = path.resolve(process.cwd(), "public", c.cert.replace(/^\//, ""));
        expect(fs.existsSync(filePath)).toBe(true);
      }
    }
  });

  it("Coursera/Google individual courses should be present", () => {
    const foundations = COURSES.find((c) => c.title === "Foundations of Cybersecurity");
    expect(foundations).toBeDefined();
    expect(foundations?.org).toBe("Coursera/Google");
  });
});

describe("COURSE_GROUPS data integrity", () => {
  it("should group all courses by org", () => {
    const totalInGroups = COURSE_GROUPS.reduce((sum, g) => sum + g.courses.length, 0);
    expect(totalInGroups).toBe(COURSES.length);
  });

  it("should have a Coursera/Google group with multiple courses", () => {
    const google = COURSE_GROUPS.find((g) => g.org === "Coursera/Google");
    expect(google).toBeDefined();
    expect(google!.courses.length).toBeGreaterThanOrEqual(8);
  });

  it("each group should have valid institution metadata", () => {
    for (const group of COURSE_GROUPS) {
      expect(group.meta).toBeDefined();
      expect(group.meta?.id).toBeTruthy();
      expect(group.meta?.code).toBeTruthy();
      expect(group.meta?.domain).toBeTruthy();
      expect(group.meta?.description).toBeTruthy();
    }
  });

  it("should have exactly 8 verified institutions", () => {
    expect(COURSE_GROUPS.length).toBe(8);
  });

  it("each badge path in metadata should reference an existing file in public/badges/", () => {
    for (const group of COURSE_GROUPS) {
      if (group.meta?.badge) {
        expect(group.meta.badge).toMatch(/^\/badges\/.+/);
        const filePath = path.resolve(process.cwd(), "public", group.meta.badge.replace(/^\//, ""));
        expect(fs.existsSync(filePath)).toBe(true);
      }
    }
  });

  it("each institution code should be an uppercase string of 3 to 4 characters", () => {
    for (const group of COURSE_GROUPS) {
      expect(group.meta?.code).toMatch(/^[A-Z]{3,4}$/);
    }
  });

  it("each course sequence number should be formatted as 2 digits", () => {
    for (const c of COURSES) {
      expect(c.n).toMatch(/^\d{2}$/);
    }
  });

  it("all certificate paths should use webp or png formats", () => {
    for (const c of COURSES) {
      if (c.cert) {
        expect(c.cert).toMatch(/\.(webp|png)$/i);
      }
    }
  });
});
