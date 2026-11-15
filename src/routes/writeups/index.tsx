import { createFileRoute } from "@tanstack/react-router";
import { WriteupsIndex } from "@/components/features/writeups/WriteupsIndex";
import { validateWriteupsSearch } from "@/components/features/writeups/writeupCategories";
import { SITE } from "@/data/site";

const TITLE = `Writeups | ${SITE.author}`;
const DESCRIPTION =
  "Writeups de laboratorios DFIR, threat hunting y análisis de malware: metodología, hallazgos e IOCs.";
const URL = `${SITE.url}writeups/`;

export const Route = createFileRoute("/writeups/")({
  validateSearch: validateWriteupsSearch,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: WriteupsIndexPage,
});

function WriteupsIndexPage() {
  const { cat } = Route.useSearch();
  return <WriteupsIndex cat={cat} />;
}
