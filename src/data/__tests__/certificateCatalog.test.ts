import { describe, expect, it } from "vitest";
import { CERTIFICATES, certificateById, certificateBySrc } from "@/data/certificateCatalog";
import { CERTIFICATIONS } from "@/data/certifications";

describe("certificate catalog", () => {
  it("has unique, URL-safe ids", () => {
    const ids = CERTIFICATES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("has unique sources", () => {
    const srcs = CERTIFICATES.map((c) => c.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });

  it("includes every certification with a certificate file", () => {
    for (const c of CERTIFICATIONS.filter((c) => c.href)) {
      expect(certificateBySrc(c.href!)?.title).toBe(c.title);
    }
  });

  it("carries the exam review of SAL1 and Security+", () => {
    expect(certificateById("sal1")?.review).toBe("sal1");
    expect(certificateById("sy0-701")?.review).toBe("security-plus");
    expect(certificateById("google")?.review).toBeUndefined();
  });

  it("returns undefined for unknown ids", () => {
    expect(certificateById("nope")).toBeUndefined();
  });
});
