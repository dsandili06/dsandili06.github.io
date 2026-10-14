import { describe, expect, it } from "vitest";
import { resolveWriteupImageUri, safeMarkdownUrl } from "@/components/writeupMarkdownPolicy";

describe("writeupMarkdownPolicy", () => {
  it("allows small raster data images only as image sources", () => {
    const dataImage = "data:image/png;base64,iVBORw0KGgo=";

    expect(safeMarkdownUrl(dataImage, "src")).toBe(dataImage);
    expect(safeMarkdownUrl(dataImage, "href")).toBeUndefined();
  });

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
});
