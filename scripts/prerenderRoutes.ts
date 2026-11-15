/**
 * Build-time prerender of the static SPA routes for GitHub Pages.
 *
 * GitHub Pages serves a real file per URL, so each /writeups route gets its own
 * copy of the built `index.html` with route-specific head metadata. The SPA
 * still hydrates client-side; this only makes titles, descriptions and
 * canonical URLs correct for crawlers and link previews, and rewrites the sitemap.
 *
 * Relative imports only: this file is loaded by `vite.config.ts`, where the
 * `@/` alias is not available.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { INVESTIGATIONS } from "../src/data/investigations";
import { SITE } from "../src/data/site";
import { WRITEUPS_INDEX_META, writeupMeta, type PageMeta } from "../src/data/writeupMeta";

export type RouteMeta = {
  title: string;
  description: string;
  canonical: string;
  ogUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceTagAttribute(
  html: string,
  tagPattern: RegExp,
  attribute: "content" | "href",
  value: string,
  label: string,
): string {
  if (!tagPattern.test(html)) throw new Error(`prerender: missing ${label} in base HTML`);
  const attributePattern = new RegExp(`${attribute}="[^"]*"`);
  return html.replace(tagPattern, (tag) =>
    tag.replace(attributePattern, () => `${attribute}="${escapeHtml(value)}"`),
  );
}

function metaTag(key: "name" | "property", value: string): RegExp {
  return new RegExp(`<meta\\b[^>]*\\b${key}="${escapeRegExp(value)}"[^>]*>`);
}

/** Returns `baseHtml` with the route-specific title, description and canonical metadata. */
export function renderRouteHtml(baseHtml: string, meta: RouteMeta): string {
  if (!/<title>[\s\S]*?<\/title>/.test(baseHtml)) throw new Error("prerender: missing <title>");
  let html = baseHtml.replace(
    /<title>[\s\S]*?<\/title>/,
    () => `<title>${escapeHtml(meta.title)}</title>`,
  );
  html = replaceTagAttribute(
    html,
    metaTag("name", "description"),
    "content",
    meta.description,
    "meta description",
  );
  html = replaceTagAttribute(
    html,
    metaTag("property", "og:title"),
    "content",
    meta.title,
    "og:title",
  );
  html = replaceTagAttribute(
    html,
    metaTag("property", "og:description"),
    "content",
    meta.description,
    "og:description",
  );
  html = replaceTagAttribute(html, metaTag("property", "og:url"), "content", meta.ogUrl, "og:url");
  html = replaceTagAttribute(
    html,
    metaTag("name", "twitter:title"),
    "content",
    meta.title,
    "twitter:title",
  );
  html = replaceTagAttribute(
    html,
    metaTag("name", "twitter:description"),
    "content",
    meta.description,
    "twitter:description",
  );
  html = replaceTagAttribute(
    html,
    /<link\b[^>]*\brel="canonical"[^>]*>/,
    "href",
    meta.canonical,
    "canonical link",
  );
  return html;
}

/** Builds a sitemap.xml document listing `urls` in order. */
export function buildSitemap(
  urls: string[],
  lastmod: string = new Date().toISOString().slice(0, 10),
): string {
  const entries = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${escapeHtml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function toRouteMeta(meta: PageMeta): RouteMeta {
  return { ...meta, ogUrl: meta.canonical };
}

/** Every prerendered page: output path (relative to dist) plus its metadata. */
export function listPrerenderPages(): { file: string; meta: RouteMeta }[] {
  return [
    { file: "writeups/index.html", meta: toRouteMeta(WRITEUPS_INDEX_META) },
    ...INVESTIGATIONS.map((investigation) => ({
      file: `writeups/${investigation.slug}/index.html`,
      meta: toRouteMeta(writeupMeta(investigation)),
    })),
  ];
}

/** Vite plugin: writes per-route HTML files and the sitemap into the build output. */
export function prerenderRoutesPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "prerender-routes",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const baseHtml = readFileSync(path.join(outDir, "index.html"), "utf8");
      const pages = listPrerenderPages();
      for (const page of pages) {
        const target = path.join(outDir, page.file);
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, renderRouteHtml(baseHtml, page.meta), "utf8");
      }
      const urls = [SITE.url, ...pages.map((page) => page.meta.canonical)];
      writeFileSync(path.join(outDir, "sitemap.xml"), buildSitemap(urls), "utf8");
    },
  };
}
