import { describe, it, expect } from "vitest";
import {
  buildSitemap,
  listPrerenderPages,
  renderRouteHtml,
} from "../../../scripts/prerenderRoutes";
import { INVESTIGATIONS } from "@/data/investigations";

const BASE = `<!doctype html>
<html lang="es"><head>
<title>Home</title>
<meta
  name="description"
  content="Home desc"
/>
<link rel="canonical" href="https://example.com/" />
<meta property="og:title" content="Home" />
<meta property="og:description" content="Home og" />
<meta property="og:url" content="https://example.com/" />
<meta name="twitter:title" content="Home" />
<meta name="twitter:description" content="Home og" />
</head><body></body></html>`;

const META = {
  title: 'Fake "GPT" & <co> · Writeup',
  description: 'Desc con $& y <b>html</b> "comillas"',
  canonical: "https://example.com/writeups/fakegpt/",
  ogUrl: "https://example.com/writeups/fakegpt/",
};

describe("renderRouteHtml", () => {
  const html = renderRouteHtml(BASE, META);

  it("replaces title and escapes it", () => {
    expect(html).toContain("<title>Fake &quot;GPT&quot; &amp; &lt;co&gt; · Writeup</title>");
    expect(html).not.toContain("<title>Home</title>");
  });

  it("replaces description, og and twitter metadata with escaped attribute values", () => {
    const escaped = "Desc con $&amp; y &lt;b&gt;html&lt;/b&gt; &quot;comillas&quot;";
    expect(html).toContain(`content="${escaped}"`);
    expect(html).toContain('property="og:url" content="https://example.com/writeups/fakegpt/"');
    expect(html).toMatch(/name="twitter:title" content="Fake &quot;GPT&quot;/);
    expect(html).not.toContain("Home og");
    expect(html).not.toContain("Home desc");
  });

  it("replaces the canonical href", () => {
    expect(html).toContain('<link rel="canonical" href="https://example.com/writeups/fakegpt/" />');
  });

  it("throws when a required tag is missing", () => {
    expect(() => renderRouteHtml("<title>x</title>", META)).toThrow(/meta description/);
  });
});

describe("buildSitemap", () => {
  it("lists every url with lastmod and escapes special characters", () => {
    const xml = buildSitemap(["https://a.test/", "https://a.test/x?a=1&b=2"], "2026-01-02");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain("<loc>https://a.test/</loc>");
    expect(xml).toContain("<loc>https://a.test/x?a=1&amp;b=2</loc>");
    expect(xml.match(/<lastmod>2026-01-02<\/lastmod>/g)).toHaveLength(2);
  });
});

describe("listPrerenderPages", () => {
  it("covers the index and every investigation", () => {
    const files = listPrerenderPages().map((p) => p.file);
    expect(files).toContain("writeups/index.html");
    for (const i of INVESTIGATIONS) expect(files).toContain(`writeups/${i.slug}/index.html`);
    expect(files).toHaveLength(INVESTIGATIONS.length + 1);
  });
});
