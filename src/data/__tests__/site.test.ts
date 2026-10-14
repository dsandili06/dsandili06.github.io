import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE } from "@/data/site";

const indexHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

function metaContent(attribute: "name" | "property", key: string): string | null {
  const match = indexHtml.match(
    new RegExp(`<meta[^>]*${attribute}="${key}"[^>]*content="([^"]*)"`, "i"),
  );
  return match?.[1] ?? null;
}

describe("site metadata", () => {
  it("keeps the static document title in sync with the canonical title", () => {
    expect(indexHtml).toContain(`<title>${SITE.title}</title>`);
  });

  it("keeps the static description and Open Graph values in sync", () => {
    expect(metaContent("name", "description")).toBe(SITE.description);
    expect(metaContent("property", "og:title")).toBe(SITE.title);
    expect(metaContent("property", "og:description")).toBe(SITE.tagline);
    expect(metaContent("name", "twitter:title")).toBe(SITE.title);
    expect(metaContent("name", "twitter:description")).toBe(SITE.tagline);
  });

  it("keeps the canonical URL, preview image and social graph in sync", () => {
    expect(metaContent("property", "og:url")).toBe(SITE.url);
    expect(metaContent("property", "og:image")).toBe(SITE.image);
    expect(metaContent("property", "og:image:width")).toBe(SITE.imageWidth);
    expect(metaContent("property", "og:image:height")).toBe(SITE.imageHeight);
    expect(metaContent("property", "og:locale")).toBe(SITE.locale);
    expect(indexHtml).toContain(`<link rel="canonical" href="${SITE.url}"`);
    expect(metaContent("name", "theme-color")).toBe(SITE.themeColor);
  });

  it("keeps the structured data aligned with the canonical role", () => {
    expect(indexHtml).toContain(`"jobTitle": "${SITE.role}"`);
  });
});
