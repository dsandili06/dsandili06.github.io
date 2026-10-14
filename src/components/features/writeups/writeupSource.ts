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

/** Session storage key used to cache a fetched writeup. */
export function getWriteupCacheKey(id: string): string {
  return `writeup-${id}`;
}
