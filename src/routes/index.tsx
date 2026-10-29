import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/HomePage";
import { getHomeContent } from "@/lib/content-functions";

const title = "Trivon Digital Agency — Websites That Rank on Google & AI";
const description =
  "Trivon designs and builds high-performing websites and web apps that rank on Google and get cited in ChatGPT, Perplexity and AI Overviews.";

export const Route = createFileRoute("/")({
  loader: () => getHomeContent(),
  component: HomeRoute,
  head: ({ loaderData }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Trivon Digital Agency",
            areaServed: ["US", "GB", "CA", "DE"],
          },
          ...(loaderData?.services ?? []).map((s) => ({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: typeof s.data["body"] === "string" ? s.data["body"] : "",
            provider: { "@type": "Organization", name: "Trivon Digital Agency" },
          })),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: (loaderData?.faqs ?? []).map((f) => ({
              "@type": "Question",
              name: f.title,
              acceptedAnswer: {
                "@type": "Answer",
                text: typeof f.data["answer"] === "string" ? f.data["answer"] : "",
              },
            })),
          },
        ]),
      },
    ],
  }),
});

function HomeRoute() {
  const content = Route.useLoaderData();
  return <HomePage content={content} />;
}
