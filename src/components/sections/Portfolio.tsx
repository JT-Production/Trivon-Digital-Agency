import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel, SplitText, Petal } from "@/components/site/primitives";
import type { CmsItem } from "@/lib/cms-types";

const tones = {
  forest: "bg-forest text-on-dark",
  lime: "bg-lime text-ink",
  ink: "bg-ink-soft text-on-dark",
  trivon: "bg-trivon text-ink",
  sage: "bg-sage-strong text-ink",
} as const;

/** Vertical scroll drives a horizontal gallery on md+; native swipe row on mobile. */
export function Portfolio({ items }: { items: CmsItem[] }) {
  const projects = items.map((item) => ({
    name: item.title,
    slug: item.slug,
    category: typeof item.data["category"] === "string" ? item.data["category"] : "Project",
    tone:
      typeof item.data["tone"] === "string" && item.data["tone"] in tones
        ? (item.data["tone"] as keyof typeof tones)
        : "forest",
    imageUrl: typeof item.data["imageUrl"] === "string" ? item.data["imageUrl"] : "",
  }));
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

  return (
    <section
      ref={ref}
      id="work"
      aria-labelledby="work-h"
      className="on-light relative md:h-[300vh]"
    >
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:justify-center md:overflow-hidden">
        <div className="container-x pt-24 md:pt-0">
          <SectionLabel>Selected work</SectionLabel>
          <SplitText
            text="Websites that work as hard as you do."
            className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] md:text-6xl"
          />
          <p className="label-mono mt-4 text-muted-foreground">
            Project examples from the Trivon CMS
          </p>
        </div>
        <motion.ul
          style={{ x }}
          className="mt-12 hidden gap-5 pl-[max(1.25rem,calc((100vw-1280px)/2+2.5rem))] md:flex"
        >
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} />
          ))}
        </motion.ul>
        <ul className="mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-20 md:hidden">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({
  p,
}: {
  p: { name: string; slug: string; category: string; tone: keyof typeof tones; imageUrl: string };
}) {
  return (
    <li className="w-[82vw] shrink-0 snap-start md:w-[46vw] lg:w-[38vw]">
      <a
        href={`/work/${encodeURIComponent(p.slug)}`}
        data-cursor-label="View"
        aria-label={`${p.name}, ${p.category}`}
        className="group block"
      >
        <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${tones[p.tone]}`}>
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={`${p.name} project`}
              loading="lazy"
              className="size-full object-cover"
            />
          ) : (
            <div className="absolute inset-x-[8%] bottom-0 top-[14%] rounded-t-xl bg-ivory shadow-card transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-3 group-hover:scale-[1.02]">
              <div className="flex gap-1.5 border-b border-border p-3">
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
              </div>
              <div className="grid grid-cols-5 gap-3 p-5">
                <div className="col-span-3 space-y-2">
                  <div className="h-4 w-4/5 rounded bg-ink" />
                  <div className="h-4 w-3/5 rounded bg-ink" />
                  <div className="mt-4 h-2 w-full rounded bg-sage-strong" />
                  <div className="h-2 w-5/6 rounded bg-sage-strong" />
                  <div className="mt-4 h-7 w-24 rounded-full bg-trivon" />
                </div>
                <div className="col-span-2 flex items-center justify-center rounded-lg bg-sage">
                  <Petal className="h-16 w-10 text-forest" />
                </div>
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between bg-ink/90 p-5 text-on-dark transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0">
            <span>
              <span className="block font-display text-xl font-semibold">{p.name}</span>
              <span className="text-sm text-on-dark-muted">{p.category}</span>
            </span>
            <span className="flex size-11 items-center justify-center rounded-full bg-lime text-ink">
              <ArrowUpRight
                className="size-5 transition-transform duration-500 group-hover:rotate-45"
                strokeWidth={2}
              />
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-sm md:hidden">
          <span className="font-semibold">{p.name}</span>
          <span className="text-muted-foreground">{p.category}</span>
        </div>
      </a>
    </li>
  );
}
