import { createFileRoute } from "@tanstack/react-router";
import { getPublicCollection } from "@/lib/content-functions";
import { InsightsPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/insights")({
  loader: () => getPublicCollection({ data: { collection: "articles" } }),
  component: InsightsRoute,
  head: () => ({
    meta: [
      { title: "Insights | Trivon Digital Agency" },
      {
        name: "description",
        content: "Practical ideas on websites, search, and digital growth from the Trivon team.",
      },
    ],
  }),
});

function InsightsRoute() {
  return <InsightsPage items={Route.useLoaderData()} />;
}
