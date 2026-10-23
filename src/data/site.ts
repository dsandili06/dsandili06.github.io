/**
 * Canonical metadata for the portfolio.
 *
 * `index.html` carries a static copy of these values so the document is
 * correct before hydration; `src/data/__tests__/site.test.ts` asserts both
 * stay in sync.
 */
export const SITE = {
  /** Full document title, also used as the page title once hydrated. */
  title: "Santiago Daniel Sandili — SECURITY ANALYST L1 / Blue Team",
  /** Long description used as the meta description. */
  description:
    "Portfolio de Santiago Daniel Sandili — Analista de Seguridad L1 / Blue Team. DFIR, threat hunting, malware analysis y automatización defensiva.",
  /** Short tagline used for Open Graph and Twitter cards. */
  tagline: "DFIR · Threat Hunting · Malware Analysis · Blue Team Automation.",
  /** Public root URL of the deployed site. */
  url: "https://dsandili06.github.io/",
  /** Open Graph preview image. */
  image: "https://dsandili06.github.io/og-image.png",
  imageWidth: "1200",
  imageHeight: "630",
  locale: "es_AR",
  author: "Santiago Daniel Sandili",
  themeColor: "#080A0E",
  role: "SECURITY ANALYST L1 / Blue Team",
} as const;
