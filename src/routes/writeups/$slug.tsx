import { createFileRoute, notFound } from "@tanstack/react-router";
import { WriteupArticle } from "@/components/features/writeups/WriteupArticle";
import { investigationBySlug } from "@/components/features/writeups/writeupSource";
import { writeupMeta } from "@/data/writeupMeta";

export const Route = createFileRoute("/writeups/$slug")({
  beforeLoad: ({ params }) => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router control-flow helper
    if (!investigationBySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const investigation = investigationBySlug(params.slug);
    if (!investigation) return {};
    const meta = writeupMeta(investigation);
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
        { property: "og:url", content: meta.canonical },
      ],
      links: [{ rel: "canonical", href: meta.canonical }],
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
