import { createFileRoute, notFound } from "@tanstack/react-router";
import { getPublicCollection, getPublicRecord } from "@/lib/content-functions";
import { ServiceDetailPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const [item, projects] = await Promise.all([
      getPublicRecord({ data: { collection: "services", slug: params.slug } }),
      getPublicCollection({ data: { collection: "projects" } }),
    ]);
    if (!item) throw notFound();
    return { item, projects };
  },
  component: ServiceDetailRoute,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.item.data["seoTitle"] ?? loaderData?.item.title ?? "Service"} | Trivon`,
      },
      {
        name: "description",
        content:
          typeof loaderData?.item.data["seoDescription"] === "string"
            ? loaderData.item.data["seoDescription"]
            : typeof loaderData?.item.data["body"] === "string"
              ? loaderData.item.data["body"]
              : "",
      },
    ],
  }),
});

function ServiceDetailRoute() {
  const { item, projects } = Route.useLoaderData();
  return <ServiceDetailPage item={item} projects={projects} />;
}
