import { createFileRoute } from "@tanstack/react-router";
import { getPublicCollection } from "@/lib/content-functions";
import { WorkPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/work")({
  loader: () => getPublicCollection({ data: { collection: "projects" } }),
  component: WorkRoute,
  head: () => ({
    meta: [
      { title: "Selected Work | Trivon Digital Agency" },
      {
        name: "description",
        content:
          "Explore digital projects shaped by strategy, thoughtful design, and the details that make a website work.",
      },
    ],
  }),
});

function WorkRoute() {
  return <WorkPage items={Route.useLoaderData()} />;
}
