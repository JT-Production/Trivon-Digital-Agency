import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages/PublicPages";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact | Trivon Digital Agency" },
      {
        name: "description",
        content:
          "Get in touch with Trivon to discuss your website, SEO, AI search, or digital growth goals.",
      },
    ],
  }),
});
