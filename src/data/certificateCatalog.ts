import { CERTIFICATIONS } from "@/data/certifications";
import { COURSES } from "@/data/courses";
import type { CertificateEntry } from "@/types";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Every certificate the modal can open, derived from the editorial data.
 * Ids are stable and URL-safe so they can live in the `?cert=` search param.
 */
export const CERTIFICATES: CertificateEntry[] = [
  ...CERTIFICATIONS.flatMap((c) =>
    c.href ? [{ id: slugify(c.code), src: c.href, title: c.title, review: c.review }] : [],
  ),
  ...COURSES.flatMap((c) => (c.cert ? [{ id: `curso-${c.n}`, src: c.cert, title: c.title }] : [])),
];

export function certificateById(id: string): CertificateEntry | undefined {
  return CERTIFICATES.find((c) => c.id === id);
}

export function certificateBySrc(src: string): CertificateEntry | undefined {
  return CERTIFICATES.find((c) => c.src === src);
}
