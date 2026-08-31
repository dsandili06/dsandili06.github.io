import { describe, it, expect } from "vitest";
import { CERTIFICATIONS } from "@/data/certifications";

describe("CERTIFICATIONS data integrity", () => {
  it("should have 2 certifications (Google Cybersecurity was removed)", () => {
    expect(CERTIFICATIONS).toHaveLength(2);
  });

  it("should NOT contain Google Cybersecurity Certificate", () => {
    const google = CERTIFICATIONS.find((c) => c.title === "GOOGLE CYBERSECURITY CERTIFICATE");
    expect(google).toBeUndefined();
  });

  it("should contain Security Analyst L1", () => {
    const sal1 = CERTIFICATIONS.find((c) => c.code === "SAL1");
    expect(sal1).toBeDefined();
    expect(sal1?.status).toBe("OBTENIDA");
  });

  it("should contain CompTIA Security+ as EN PREPARACIÓN", () => {
    const comptia = CERTIFICATIONS.find((c) => c.code === "SY0-701");
    expect(comptia).toBeDefined();
    expect(comptia?.status).toBe("EN PREPARACIÓN");
  });

  it("each certification should have required fields", () => {
    for (const c of CERTIFICATIONS) {
      expect(c.code).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.org).toBeTruthy();
      expect(c.year).toBeTruthy();
      expect(["OBTENIDA", "EN PREPARACIÓN"]).toContain(c.status);
    }
  });
});
