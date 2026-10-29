import { createFileRoute } from "@tanstack/react-router";
import { getPublicCollection } from "@/lib/content-functions";
import { ServicesPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/services")({
  loader: () => getPublicCollection({ data: { collection: "services" } }),
  component: ServicesRoute,
  head: () => ({
    meta: [
      { title: "Services | Trivon Digital Agency" },
      {
        name: "description",
        content:
          "Website design, development, SEO, and AI search services built to help your business grow.",
      },
    ],
  }),
});

function ServicesRoute() {
  return <ServicesPage items={Route.useLoaderData()} />;
}
