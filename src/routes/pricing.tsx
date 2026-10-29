import { createFileRoute } from "@tanstack/react-router";
import { getPublicCollection } from "@/lib/content-functions";
import { PricingPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/pricing")({
  loader: async () => {
    const [items, faqs] = await Promise.all([
      getPublicCollection({ data: { collection: "pricing" } }),
      getPublicCollection({ data: { collection: "faqs" } }),
    ]);
    return { items, faqs };
  },
  component: PricingRoute,
  head: () => ({
    meta: [
      { title: "Pricing | Trivon Digital Agency" },
      {
        name: "description",
        content: "Explore web design, development, and growth plans from Trivon Digital Agency.",
      },
    ],
  }),
});

function PricingRoute() {
  const { items, faqs } = Route.useLoaderData();
  return <PricingPage items={items} faqs={faqs} />;
}
