import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionLabel, SplitText, Petal } from "@/components/site/primitives";
import type { CmsItem } from "@/lib/cms-types";

export function FAQ({ items }: { items: CmsItem[] }) {
  return (
    <section id="faq" aria-labelledby="faq-h" className="on-light pb-24 md:pb-36">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel>FAQ</SectionLabel>
          <SplitText
            text={"Questions,\nanswered."}
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] md:text-6xl"
          />
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((f, i) => (
            <AccordionItem
              key={f.slug}
              value={`q${i}`}
              className="rounded-2xl border-none bg-card px-6 data-[state=open]:bg-sage-strong"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold hover:no-underline">
                {f.title}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {typeof f.data["answer"] === "string" ? f.data["answer"] : ""}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const thumbs = [
  "bg-forest text-lime",
  "bg-lime text-forest",
  "bg-ink text-trivon",
  "bg-trivon text-ink",
];

export function Insights({ items }: { items: CmsItem[] }) {
  return (
    <section
      id="insights"
      aria-labelledby="ins-h"
      className="on-light border-t border-border py-24 md:py-36"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel>Insights</SectionLabel>
          <SplitText
            text={"Latest insights\nand guides."}
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] md:text-6xl"
          />
          <p className="mt-5 max-w-sm text-muted-foreground">
            Practical advice on SEO, AI search and websites that convert. No fluff.
          </p>
        </div>
        {/* PLACEHOLDER articles */}
        <ul className="space-y-4">
          {items.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 0.06}>
                <a
                  href={`/insights/${encodeURIComponent(p.slug)}`}
                  className="group flex items-center gap-5 rounded-2xl bg-card p-3 pr-6 transition-colors duration-500 hover:bg-sage-strong"
                >
                  <span
                    aria-hidden
                    className={`relative flex aspect-[4/3] w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:w-40 ${thumbs[i]}`}
                  >
                    <Petal className="h-16 w-10 rotate-[20deg] transition-transform duration-700 group-hover:rotate-[60deg] group-hover:scale-125" />
                  </span>
                  <span className="flex-1">
                    <span className="label-mono text-forest">
                      {typeof p.data["date"] === "string" ? p.data["date"] : ""} ·{" "}
                      {typeof p.data["category"] === "string" ? p.data["category"] : "Insights"}
                    </span>
                    <span className="mt-2 block font-display text-lg font-semibold leading-snug md:text-xl">
                      {p.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="hidden size-6 shrink-0 transition-transform duration-500 group-hover:rotate-45 sm:block"
                    strokeWidth={2}
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
