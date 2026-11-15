import { createFileRoute } from "@tanstack/react-router";
import { WriteupsIndex } from "@/components/features/writeups/WriteupsIndex";
import { validateWriteupsSearch } from "@/components/features/writeups/writeupCategories";
import { WRITEUPS_INDEX_META } from "@/data/writeupMeta";

export const Route = createFileRoute("/writeups/")({
  validateSearch: validateWriteupsSearch,
  head: () => ({
    meta: [
      { title: WRITEUPS_INDEX_META.title },
      { name: "description", content: WRITEUPS_INDEX_META.description },
      { property: "og:title", content: WRITEUPS_INDEX_META.title },
      { property: "og:description", content: WRITEUPS_INDEX_META.description },
      { property: "og:url", content: WRITEUPS_INDEX_META.canonical },
    ],
    links: [{ rel: "canonical", href: WRITEUPS_INDEX_META.canonical }],
  }),
  component: WriteupsIndexPage,
});

function WriteupsIndexPage() {
  const { cat } = Route.useSearch();
  return <WriteupsIndex cat={cat} />;
}
