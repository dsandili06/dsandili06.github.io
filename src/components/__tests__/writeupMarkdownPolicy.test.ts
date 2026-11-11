import { describe, expect, it } from "vitest";
import {
  resolveWriteupImageUri,
  safeMarkdownUrl,
} from "@/components/features/writeups/writeupMarkdownPolicy";

describe("writeupMarkdownPolicy", () => {
  it("allows small raster data images only as image sources", () => {
    const dataImage = "data:image/png;base64,iVBORw0KGgo=";

    expect(safeMarkdownUrl(dataImage, "src")).toBe(dataImage);
    expect(safeMarkdownUrl(dataImage, "href")).toBeUndefined();
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "vbscript:msgbox(1)",
    "java	script:alert(1)",
    "//evil.example/x",
    "/\\evil.example/x",
  ])("rejects unsafe or protocol-relative url %j for href and src", (value) => {
    expect(safeMarkdownUrl(value, "href")).toBeUndefined();
    expect(safeMarkdownUrl(value, "src")).toBeUndefined();
  });

  it.each(["#seccion", "/certs/a.webp", "./img.png", "https://example.com/", "mailto:a@b.co"])(
    "keeps safe href %j unchanged",
    (value) => {
      expect(safeMarkdownUrl(value, "href")).toBe(value);
    },
  );

  it("rejects oversized inline images", () => {
    const oversized = `data:image/png;base64,${"A".repeat(1_398_104)}`;

    expect(safeMarkdownUrl(oversized, "src")).toBeUndefined();
    expect(resolveWriteupImageUri(oversized, "https://github.com/user/repo/blob/main/lab.md")).toBe(
      "",
    );
  });

  it("preserves trusted hosts and resolves repository-relative images", () => {
    expect(
      resolveWriteupImageUri(
        "https://user-attachments.githubusercontent.com/123/evidence.png",
        "https://github.com/user/repo/blob/main/lab.md",
      ),
    ).toBe("https://user-attachments.githubusercontent.com/123/evidence.png");
    expect(
      resolveWriteupImageUri(
        "images/evidence.png",
        "https://github.com/user/repo/blob/main/lab.md",
      ),
    ).toBe("https://raw.githubusercontent.com/user/repo/main/images/evidence.png");
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    " javascript:alert(1)",
    "java	script:alert(1)",
    "vbscript:msgbox(1)",
    "data:text/html,<script>alert(1)</script>",
  ])("rejects script-capable scheme %j for href and src", (value) => {
    expect(safeMarkdownUrl(value, "href")).toBeUndefined();
    expect(safeMarkdownUrl(value, "src")).toBeUndefined();
  });
});
