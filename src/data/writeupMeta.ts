import type { Investigation } from "../types";
import { SITE } from "./site";

/**
 * Document metadata for the /writeups pages. Shared by the route `head()`
 * functions and the build-time prerender so both stay identical.
 * Relative imports only: `vite.config.ts` loads this through the prerender plugin.
 */
export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
};

export const WRITEUPS_INDEX_META: PageMeta = {
  title: `Writeups | ${SITE.author}`,
  description:
    "Writeups de laboratorios DFIR, threat hunting y análisis de malware: metodología, hallazgos e IOCs.",
  canonical: `${SITE.url}writeups/`,
};

export function writeupMeta(
  investigation: Pick<Investigation, "title" | "slug" | "summary">,
): PageMeta {
  return {
    title: `${investigation.title} · Writeup | ${SITE.author}`,
    description: investigation.summary,
    canonical: `${SITE.url}writeups/${investigation.slug}/`,
  };
}
