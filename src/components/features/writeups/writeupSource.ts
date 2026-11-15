import { INVESTIGATIONS } from "@/data/investigations";
import type { Investigation } from "@/types";

/** Maps a GitHub blob URL to its raw content URL. */
export function toRawUrl(githubUrl: string): string {
  return githubUrl
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
}

/** Resolves a writeup investigation by its id. */
export function investigationById(id: string): Investigation | undefined {
  return INVESTIGATIONS.find((i) => i.id === id);
}

/** Resolves a writeup investigation by its URL slug. */
export function investigationBySlug(slug: string): Investigation | undefined {
  return INVESTIGATIONS.find((i) => i.slug === slug);
}

/**
 * Legacy `/?writeup=LAB_xxx` links: returns the slug of the writeup page they
 * should redirect to, or undefined when the param is missing or unknown.
 */
export function legacyWriteupRedirectSlug(search: Record<string, unknown>): string | undefined {
  const id = search.writeup;
  return typeof id === "string" ? investigationById(id)?.slug : undefined;
}

/** Session storage key used to cache a fetched writeup. */
export function getWriteupCacheKey(id: string): string {
  return `writeup-${id}`;
}
