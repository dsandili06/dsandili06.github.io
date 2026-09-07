import { describe, it, expect } from "vitest";
import { CERTIFICATIONS } from "@/data/certifications";

describe("CERTIFICATIONS data integrity", () => {
  it("should have 3 certifications", () => {
    expect(CERTIFICATIONS).toHaveLength(3);
  });

  it("should contain Google Cybersecurity", () => {
    const google = CERTIFICATIONS.find((c) => c.title === "Google Cybersecurity");
    expect(google).toBeDefined();
    expect(google?.status).toBe("OBTENIDA");
    expect(google?.href).toBeTruthy();
  });

  it("should contain SAL1 (Security Analyst L1)", () => {
    const sal1 = CERTIFICATIONS.find((c) => c.code === "SAL1");
    expect(sal1).toBeDefined();
    expect(sal1?.title).toBe("SAL1 (Security Analyst L1)");
    expect(sal1?.year).toBe("19/03/2026");
    expect(sal1?.status).toBe("OBTENIDA");
  });

  it("should contain CompTIA Security+ with Q3 2026 goal note", () => {
    const comptia = CERTIFICATIONS.find((c) => c.code === "SY0-701");
    expect(comptia).toBeDefined();
    expect(comptia?.status).toBe("EN PREPARACIÓN");
    expect(comptia?.note).toContain("Q3 de 2026");
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
