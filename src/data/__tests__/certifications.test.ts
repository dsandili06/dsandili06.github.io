import { describe, it, expect } from "vitest";
import { CERTIFICATIONS } from "@/data/certifications";

describe("CERTIFICATIONS data integrity", () => {
  it("should have unique, non-empty certifications", () => {
    expect(CERTIFICATIONS.length).toBeGreaterThan(0);
    const titles = CERTIFICATIONS.map((c) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
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
    expect(sal1?.href).toBe("/certs/THM-SAL1-Certificate.webp");
    expect(sal1?.review).toBe("sal1");
  });

  it("should contain the obtained CompTIA Security+ certificate", () => {
    const comptia = CERTIFICATIONS.find((c) => c.code === "SY0-701");
    expect(comptia).toBeDefined();
    expect(comptia?.status).toBe("OBTENIDA");
    expect(comptia?.year).toBe("20/10/2026");
    expect(comptia?.score).toBe("791 / 900");
    expect(comptia?.note).toBeUndefined();
    expect(comptia?.href).toBe("/certs/comptia-security-plus-sy0-701.webp");
    expect("mockExams" in comptia!).toBe(false);
  });

  it("should list CompTIA Security+ before the other certifications", () => {
    expect(CERTIFICATIONS.map((certification) => certification.code)).toEqual([
      "SY0-701",
      "SAL1",
      "GOOGLE",
    ]);
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
