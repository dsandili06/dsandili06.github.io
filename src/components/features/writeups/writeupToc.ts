import GithubSlugger from "github-slugger";

export type TocEntry = { depth: number; text: string; id: string };

/** Minimum number of headings before the writeup index becomes visible. */
export const TOC_VISIBLE_THRESHOLD = 4;

/**
 * Extracts h2/h3 entries from the raw markdown, skipping content inside code fences.
 * Uses the same github-slugger over ALL headings (in document order) as rehype-slug does, so ids match.
 */
export function parseToc(md: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    // Track code fences (``` or ~~~)
    if (/^```/.test(line) || /^~~~/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!m) continue;
    const depth = m[1].length;
    const raw = m[2].replace(/[*_`~]/g, "").trim();
    const id = slugger.slug(raw);
    if (depth === 2 || depth === 3) toc.push({ depth, text: raw, id });
  }
  return toc;
}
