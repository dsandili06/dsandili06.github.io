import { createFileRoute, notFound } from "@tanstack/react-router";
import { WriteupArticle } from "@/components/features/writeups/WriteupArticle";
import { investigationBySlug } from "@/components/features/writeups/writeupSource";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/writeups/$slug")({
  beforeLoad: ({ params }) => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router control-flow helper
    if (!investigationBySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const investigation = investigationBySlug(params.slug);
    if (!investigation) return {};
    const title = `${investigation.title} · Writeup | ${SITE.author}`;
    const url = `${SITE.url}writeups/${investigation.slug}/`;
    return {
      meta: [
        { title },
        { name: "description", content: investigation.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: investigation.summary },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: WriteupDetail,
});

function WriteupDetail() {
  const { slug } = Route.useParams();
  const investigation = investigationBySlug(slug);
  if (!investigation) return null;
  return <WriteupArticle investigation={investigation} />;
}
