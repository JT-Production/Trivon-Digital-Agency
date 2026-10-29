import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPublicCollection, getPublicRecord } from "@/lib/content-functions";
import { ArticleDetailPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const [item, allArticles] = await Promise.all([
      getPublicRecord({ data: { collection: "articles", slug: params.slug } }),
      getPublicCollection({ data: { collection: "articles" } }),
    ]);
    if (!item) throw notFound();
    return { item, related: allArticles.filter((entry) => entry.slug !== params.slug).slice(0, 3) };
  },
  component: ArticleDetailRoute,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.item.data["seoTitle"] ?? loaderData?.item.title ?? "Article"} | Trivon Insights`,
      },
      {
        name: "description",
        content:
          typeof loaderData?.item.data["seoDescription"] === "string"
            ? loaderData.item.data["seoDescription"]
            : typeof loaderData?.item.data["excerpt"] === "string"
              ? loaderData.item.data["excerpt"]
              : "",
      },
    ],
  }),
});

function ArticleDetailRoute() {
  const { item, related } = Route.useLoaderData();
  return <ArticleDetailPage item={item} related={related} />;
}
