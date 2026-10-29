import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPublicCollection, getPublicRecord } from "@/lib/content-functions";
import { ProjectDetailPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const [item, allProjects] = await Promise.all([
      getPublicRecord({ data: { collection: "projects", slug: params.slug } }),
      getPublicCollection({ data: { collection: "projects" } }),
    ]);
    if (!item) throw notFound();
    const index = allProjects.findIndex((entry) => entry.slug === params.slug);
    return {
      item,
      adjacent: allProjects.filter((entry) => entry.slug !== params.slug).slice(0, 3),
      previous: index > 0 ? (allProjects[index - 1] ?? null) : null,
      next: index >= 0 ? (allProjects[index + 1] ?? null) : null,
    };
  },
  component: ProjectDetailRoute,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.item.data["seoTitle"] ?? loaderData?.item.title ?? "Case study"} | Trivon Work`,
      },
      {
        name: "description",
        content:
          typeof loaderData?.item.data["seoDescription"] === "string"
            ? loaderData.item.data["seoDescription"]
            : typeof loaderData?.item.data["summary"] === "string"
              ? loaderData.item.data["summary"]
              : "",
      },
    ],
  }),
});

function ProjectDetailRoute() {
  const { item, adjacent, previous, next } = Route.useLoaderData();
  return <ProjectDetailPage item={item} adjacent={adjacent} previous={previous} next={next} />;
}
