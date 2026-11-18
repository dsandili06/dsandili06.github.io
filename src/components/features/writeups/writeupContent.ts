// Lazy glob: one chunk per writeup, loaded only when the article is opened.
const loaders = import.meta.glob<string>("/src/data/writeups/*.md", {
  query: "?raw",
  import: "default",
});

const WORDS_PER_MINUTE = 220;

function pathFor(slug: string) {
  return `/src/data/writeups/${slug}.md`;
}

export function hasWriteupContent(slug: string): boolean {
  return pathFor(slug) in loaders;
}

export async function loadWriteupMarkdown(slug: string): Promise<string> {
  const loader = loaders[pathFor(slug)];
  if (!loader) throw new Error(`Writeup not found: ${slug}`);
  return loader();
}

/** Estimated reading time; code blocks, images and URLs are excluded from the word count. */
export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
