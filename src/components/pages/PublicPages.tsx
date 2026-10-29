import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Code2,
  PenTool,
  Search,
  Sparkles,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/sections/FinalCta";
import { Cursor, ScrollProgress, SmoothScroll, StickyCTA } from "@/components/site/effects";
import { SectionLabel, Pill, Reveal } from "@/components/site/primitives";
import { Modal } from "@/components/site/Modal";
import { InquiryForm } from "@/components/site/InquiryForm";
import { cn } from "@/lib/utils";
import type { CmsItem } from "@/lib/cms-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const serviceIcons = { design: PenTool, dev: Code2, seo: Search, geo: Bot };
const toneClasses: Record<string, string> = {
  forest: "bg-forest text-lime",
  lime: "bg-lime text-ink",
  ink: "bg-ink text-on-dark",
  trivon: "bg-trivon text-ink",
  sage: "bg-sage-strong text-ink",
};

const readString = (item: CmsItem, key: string, fallback = ""): string => {
  const value = item.data[key];
  return typeof value === "string" ? value : fallback;
};
const readStrings = (item: CmsItem, key: string): string[] => {
  const value = item.data[key];
  return Array.isArray(value)
    ? value.filter((part): part is string => typeof part === "string")
    : [];
};

export function InnerPage({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main className="min-h-screen pt-28">{children}</main>
      <Footer />
      <StickyCTA />
    </>
  );
}

function PageIntro({
  label,
  title,
  copy,
  dark = false,
}: {
  label: string;
  title: string;
  copy: string;
  dark?: boolean;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden py-20 md:py-28",
        dark ? "bg-hero text-on-dark" : "on-light",
      )}
    >
      <div aria-hidden className="grain absolute inset-0 opacity-50" />
      <div className="container-x relative">
        <SectionLabel dark={dark}>{label}</SectionLabel>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] md:text-7xl">
          {title}
        </h1>
        <p
          className={cn(
            "mt-6 max-w-2xl text-lg leading-relaxed",
            dark ? "text-on-dark-muted" : "text-muted-foreground",
          )}
        >
          {copy}
        </p>
      </div>
    </header>
  );
}

export function ServicesPage({ items }: { items: CmsItem[] }) {
  return (
    <InnerPage>
      <PageIntro
        label="Services"
        title="Everything you need to grow online."
        copy="From a clearer website to search visibility that compounds, our services are built around measurable business outcomes."
        dark
      />
      <section className="container-x py-16 md:py-24">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = serviceIcons[item.slug as keyof typeof serviceIcons] ?? Sparkles;
            return (
              <li key={item.slug}>
                <Reveal delay={index * 0.06}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: item.slug }}
                    className="group flex min-h-72 flex-col rounded-2xl border border-ink/5 bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-ink hover:text-on-dark hover:shadow-card"
                  >
                    <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-lime transition-transform group-hover:rotate-[-8deg] group-hover:bg-lime group-hover:text-ink">
                      <Icon className="size-5" />
                    </span>
                    <h2 className="mt-10 font-display text-2xl font-semibold">{item.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-hover:text-on-dark-muted">
                      {readString(
                        item,
                        "body",
                        readString(
                          item,
                          "description",
                          "A practical service designed around your goals.",
                        ),
                      )}
                    </p>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold">
                      Explore service{" "}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
        <ProcessSection />
      </section>
      <Callout
        title="Not sure where to start?"
        text="Tell us what you want to improve. We’ll recommend the right next step."
      />
    </InnerPage>
  );
}

function ProcessSection() {
  const steps = [
    ["01", "Understand", "We learn about your audience, goals, and current growth bottlenecks."],
    ["02", "Plan", "We prioritize the work that will make the biggest difference."],
    ["03", "Build", "We design, develop, and launch with clear feedback at every stage."],
    ["04", "Improve", "We measure real outcomes and keep improving what matters."],
  ];
  return (
    <section id="process" className="mt-24 border-t border-border pt-14">
      <SectionLabel>How we work</SectionLabel>
      <h2 className="mt-5 font-display text-4xl font-semibold">
        A clear path from idea to impact.
      </h2>
      <ol className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map(([number, title, body]) => (
          <li key={number} className="rounded-2xl bg-sage p-6">
            <p className="label-mono text-forest">{number}</p>
            <h3 className="mt-8 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ServiceDetailPage({ item, projects }: { item: CmsItem; projects: CmsItem[] }) {
  return (
    <InnerPage>
      <PageIntro
        label="Service"
        title={item.title}
        copy={readString(
          item,
          "body",
          readString(item, "description", "A practical service designed around your goals."),
        )}
        dark
      />
      <section className="container-x grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div>
          <SectionLabel>What’s included</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-semibold">
            A considered approach, built around your business.
          </h2>
          <ul className="mt-8 space-y-3">
            {(readStrings(item, "points").length
              ? readStrings(item, "points")
              : [
                  "Discovery and strategy",
                  "Design and implementation",
                  "Measurement and ongoing improvements",
                ]
            ).map((point) => (
              <li key={point} className="rounded-xl bg-card p-4">
                {point}
              </li>
            ))}
          </ul>
          <h2 className="mt-12 font-display text-2xl font-semibold">Our process</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {readString(
              item,
              "process",
              "We start with a focused audit, agree on the priorities, then work in clear, reviewable stages through launch and ongoing improvements.",
            )}
          </p>
        </div>
        <aside className="rounded-2xl bg-ink p-8 text-on-dark">
          <SectionLabel dark>Tools and delivery</SectionLabel>
          <p className="mt-5 text-on-dark-muted">
            {readStrings(item, "tools").join(" · ") ||
              "Modern, accessible, and performance-focused tools selected to fit your project."}
          </p>
          <Pill href="/contact" className="mt-8" variant="lime">
            Talk about this service <ArrowRight className="size-4" />
          </Pill>
        </aside>
      </section>
      {projects.length > 0 && (
        <RelatedItems title="Related work" items={projects.slice(0, 3)} prefix="/work" />
      )}
      <Callout
        title="Ready to make progress?"
        text="Get in touch and we’ll help you identify the right next step."
      />
    </InnerPage>
  );
}

export function WorkPage({ items }: { items: CmsItem[] }) {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...new Set(items.map((item) => readString(item, "category", "Project")))],
    [items],
  );
  const visible =
    filter === "All"
      ? items
      : items.filter((item) => readString(item, "category", "Project") === filter);
  return (
    <InnerPage>
      <PageIntro
        label="Selected work"
        title="Good work, built for growth."
        copy="Explore a selection of projects shaped by clear strategy, thoughtful design, and the details that make a website work."
        dark
      />
      <section className="container-x py-16 md:py-24">
        <div className="flex flex-wrap gap-2" aria-label="Filter projects">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                filter === category
                  ? "border-ink bg-ink text-ivory"
                  : "border-border hover:bg-sage",
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <motion.ul layout className="mt-8 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <ProjectTile key={item.slug} item={item} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>
      <Callout
        title="Have a project in mind?"
        text="Let’s talk about what a more effective digital presence could do for your business."
      />
    </InnerPage>
  );
}

function ProjectTile({ item }: { item: CmsItem }) {
  const image = readString(item, "imageUrl");
  const tone = readString(item, "tone", "forest");
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
    >
      <Link to="/work/$slug" params={{ slug: item.slug }} className="group block">
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-2xl",
            toneClasses[tone] ?? toneClasses["forest"],
          )}
        >
          {image ? (
            <img
              src={image}
              alt={`${item.title} project`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-[8%] rounded-t-2xl bg-ivory p-6 text-ink shadow-card">
              <p className="label-mono text-forest">{readString(item, "category", "Project")}</p>
              <h3 className="mt-6 max-w-sm font-display text-3xl font-semibold">{item.title}</h3>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                {readString(
                  item,
                  "summary",
                  "A thoughtful digital experience for a growing business.",
                )}
              </p>
            </div>
          )}
          <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-ink/90 p-5 text-on-dark transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0">
            <span>
              <span className="block font-display text-xl font-semibold">{item.title}</span>
              <span className="text-sm text-on-dark-muted">
                {readString(item, "category", "Project")}
              </span>
            </span>
            <ArrowUpRight className="size-6" />
          </span>
        </div>
        <div className="mt-4 flex justify-between gap-4">
          <span className="font-semibold">{item.title}</span>
          <span className="text-sm text-muted-foreground">
            {readString(item, "category", "Project")}
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export function ProjectDetailPage({
  item,
  adjacent,
  previous,
  next,
}: {
  item: CmsItem;
  adjacent: CmsItem[];
  previous: CmsItem | null;
  next: CmsItem | null;
}) {
  const image = readString(item, "imageUrl");
  return (
    <InnerPage>
      <PageIntro
        label={readString(item, "category", "Case study")}
        title={item.title}
        copy={readString(
          item,
          "summary",
          "A focused project designed around the customer experience and business goals.",
        )}
        dark
      />
      <section className="container-x py-12 md:py-20">
        <div
          className={cn(
            "relative aspect-[16/8] overflow-hidden rounded-2xl",
            toneClasses[readString(item, "tone", "forest")] ?? toneClasses["forest"],
          )}
        >
          {image ? (
            <img src={image} alt={`${item.title} case study`} className="size-full object-cover" />
          ) : (
            <div className="absolute inset-[10%] rounded-t-2xl bg-ivory p-8 text-ink shadow-card md:p-14">
              <p className="label-mono text-forest">{readString(item, "category", "Case study")}</p>
              <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold md:text-6xl">
                {item.title}
              </h2>
            </div>
          )}
        </div>
        <dl className="grid gap-4 py-8 sm:grid-cols-3">
          {[
            ["Client", readString(item, "client", item.title)],
            ["Role", readString(item, "role", "Strategy, design, development")],
            ["Timeline", readString(item, "timeline", "Project engagement")],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-card p-5">
              <dt className="label-mono text-forest">{label}</dt>
              <dd className="mt-2 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-10 pt-8 md:grid-cols-2">
          <article>
            <SectionLabel>The challenge</SectionLabel>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {readString(
                item,
                "challenge",
                "The business needed a clearer digital presence and a more effective path from search to enquiry.",
              )}
            </p>
          </article>
          <article>
            <SectionLabel>Our approach</SectionLabel>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {readString(
                item,
                "solution",
                "We combined clear messaging, responsive design, and a technical foundation built for discovery.",
              )}
            </p>
          </article>
        </div>
        <article className="mt-12 rounded-2xl bg-ink p-8 text-on-dark md:p-12">
          <SectionLabel dark>Outcome</SectionLabel>
          <p className="mt-5 max-w-3xl font-display text-3xl font-semibold text-lime">
            {readString(
              item,
              "results",
              "A faster, more useful experience built around the needs of its customers.",
            )}
          </p>
        </article>
        {readStrings(item, "gallery").length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {readStrings(item, "gallery").map((src, index) => (
              <li key={`${src}-${index}`}>
                <img
                  src={src}
                  alt={`${item.title} project gallery image ${index + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              </li>
            ))}
          </ul>
        )}
        <nav aria-label="Case study navigation" className="mt-10 flex justify-between gap-4">
          {previous ? (
            <Link
              to="/work/$slug"
              params={{ slug: previous.slug }}
              className="inline-flex items-center gap-2 font-semibold text-forest"
            >
              <ArrowLeft className="size-4" /> Previous project
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/work/$slug"
              params={{ slug: next.slug }}
              className="inline-flex items-center gap-2 font-semibold text-forest"
            >
              Next project <ArrowRight className="size-4" />
            </Link>
          )}
        </nav>
      </section>
      {adjacent.length > 0 && <RelatedItems title="More work" items={adjacent} prefix="/work" />}
      <Callout
        title="Let’s create your next case study."
        text="Tell us about your goals and we’ll help you find a practical way forward."
      />
    </InnerPage>
  );
}

export function PricingPage({ items, faqs }: { items: CmsItem[]; faqs: CmsItem[] }) {
  const [selected, setSelected] = useState<CmsItem | null>(null);
  return (
    <InnerPage>
      <PageIntro
        label="Pricing"
        title="A clear investment in your next stage."
        copy="Choose a starting point, then we’ll scope the work around what will make the most difference for your business."
        dark
      />
      <section className="container-x py-16 md:py-24">
        <ul className="grid items-stretch gap-4 lg:grid-cols-3">
          {items.map((item) => {
            const featured = item.data["featured"] === true;
            return (
              <li
                key={item.slug}
                className={cn(
                  "flex flex-col rounded-2xl p-7",
                  featured ? "bg-lime text-ink shadow-glow lg:-my-4 lg:py-11" : "bg-card",
                )}
              >
                {featured && (
                  <span className="label-mono self-end rounded-full bg-ink px-3 py-1 text-lime">
                    Most popular
                  </span>
                )}
                <p className="label-mono">{item.title} plan</p>
                <p className="mt-4 min-h-14 text-muted-foreground">
                  {readString(
                    item,
                    "description",
                    "A focused plan to help your business move forward.",
                  )}
                </p>
                <p className="mt-7">
                  <span className="font-display text-4xl font-semibold">
                    {readString(item, "price", "Let’s talk")}
                  </span>
                  <span className="ml-1 text-sm opacity-75">{readString(item, "cadence")}</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {readStrings(item, "features").map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden className="text-forest">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelected(item)}
                  className="mt-8 min-h-11 rounded-full bg-ink px-5 font-semibold text-ivory transition-colors hover:bg-forest"
                >
                  Get this package <ArrowRight className="ml-2 inline size-4" />
                </button>
              </li>
            );
          })}
        </ul>
        <Comparison items={items} />
        {faqs.length > 0 && (
          <section className="mt-20">
            <SectionLabel>Pricing FAQ</SectionLabel>
            <h2 className="mt-5 font-display text-3xl font-semibold">A few useful details.</h2>
            <Accordion type="single" collapsible className="mt-7 space-y-3">
              {faqs.slice(0, 6).map((faq, index) => (
                <AccordionItem
                  key={faq.slug}
                  value={`pricing-faq-${index}`}
                  className="rounded-2xl border-none bg-card px-6 data-[state=open]:bg-sage-strong"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold hover:no-underline">
                    {faq.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                    {readString(faq, "answer")}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
      </section>
      <Callout
        title="Questions about scope or pricing?"
        text="Every project is different. Send us a note and we’ll help you find a sensible fit."
      />
      <Modal
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        title={`Ask us about ${selected?.title ?? "a package"}`}
        description="Share a little about your project and we’ll follow up with next steps."
      >
        <InquiryForm initialPlan={selected?.title ?? ""} />
      </Modal>
    </InnerPage>
  );
}

function Comparison({ items }: { items: CmsItem[] }) {
  return (
    <div className="mt-20 overflow-x-auto">
      <h2 className="mb-6 font-display text-3xl font-semibold">Compare plans</h2>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-4 pr-4">Included</th>
            {items.map((item) => (
              <th key={item.slug} className="px-4 py-4">
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...new Set(items.flatMap((item) => readStrings(item, "features")))].map((feature) => (
            <tr key={feature} className="border-b border-border/70">
              <th scope="row" className="py-4 pr-4 font-medium">
                {feature}
              </th>
              {items.map((item) => (
                <td key={item.slug} className="px-4 py-4 text-center">
                  {readStrings(item, "features").includes(feature) ? (
                    <span aria-label="Included" className="text-forest">
                      ✓
                    </span>
                  ) : (
                    <span aria-label="Not included" className="text-muted-foreground">
                      —
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InsightsPage({ items }: { items: CmsItem[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = useMemo(
    () => ["All", ...new Set(items.map((item) => readString(item, "category", "Insights")))],
    [items],
  );
  const visible = items.filter(
    (item) =>
      (category === "All" || readString(item, "category", "Insights") === category) &&
      item.title.toLowerCase().includes(query.toLowerCase()),
  );
  const featured = items[0];
  return (
    <InnerPage>
      <PageIntro
        label="Insights"
        title="Practical ideas for digital growth."
        copy="Clear, useful thinking on websites, search, and the details that turn more of the right visitors into customers."
        dark
      />
      <section className="container-x py-16 md:py-24">
        {featured && (
          <Link
            to="/insights/$slug"
            params={{ slug: featured.slug }}
            className="group mb-12 grid overflow-hidden rounded-2xl bg-ink text-on-dark md:grid-cols-2"
          >
            <div className="flex min-h-64 items-center justify-center bg-forest p-8 text-lime">
              <Sparkles className="size-20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <SectionLabel dark>
                Featured · {readString(featured, "category", "Guide")}
              </SectionLabel>
              <h2 className="mt-5 font-display text-3xl font-semibold md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-on-dark-muted">
                {readString(featured, "excerpt", "A practical guide from the Trivon team.")}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-lime">
                Read article <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        )}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm",
                  category === item
                    ? "border-ink bg-ink text-ivory"
                    : "border-border hover:bg-sage",
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="insights-search">
            Search articles
          </label>
          <input
            id="insights-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search insights"
            className="h-11 rounded-full border border-input bg-background px-5"
          />
        </div>
        {visible.length ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <li key={item.slug}>
                <Reveal>
                  <Link
                    to="/insights/$slug"
                    params={{ slug: item.slug }}
                    className="group block h-full rounded-2xl bg-card p-6 transition-colors hover:bg-sage-strong"
                  >
                    <p className="label-mono text-forest">
                      {readString(item, "date", "Trivon insights")} ·{" "}
                      {readString(item, "category", "Guide")}
                    </p>
                    <h2 className="mt-5 font-display text-xl font-semibold leading-snug">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {readString(item, "excerpt", "A practical guide from the Trivon team.")}
                    </p>
                    <span className="mt-6 flex items-center gap-2 text-sm font-semibold">
                      Read article{" "}
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl bg-card p-8 text-center text-muted-foreground">
            No articles match that search. Try another term or category.
          </p>
        )}
      </section>
      <Newsletter />
    </InnerPage>
  );
}

export function ArticleDetailPage({ item, related }: { item: CmsItem; related: CmsItem[] }) {
  const paragraphs = readString(
    item,
    "content",
    readString(item, "excerpt", "A practical guide from the Trivon team."),
  ).split(/\n{2,}/);
  return (
    <InnerPage>
      <PageIntro
        label={readString(item, "category", "Insights")}
        title={item.title}
        copy={readString(item, "excerpt", "A practical guide from the Trivon team.")}
        dark
      />
      <article className="container-x max-w-4xl py-10 md:py-16">
        <p className="label-mono text-forest">
          {readString(item, "date", "Trivon insights")} ·{" "}
          {readString(item, "readTime", "5 min read")} · By{" "}
          {readString(item, "author", "Trivon team")}
        </p>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          {paragraphs.map((text, index) => (
            <ReactMarkdown
              key={index}
              components={{
                p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
                h2: ({ children }) => (
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {children}
                  </h2>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {text}
            </ReactMarkdown>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Pill href="/insights" variant="ghost">
            <ArrowLeft className="size-4" /> All insights
          </Pill>
          <Pill
            href={`mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(typeof window === "undefined" ? "" : window.location.href)}`}
            variant="ink"
          >
            Share article <ArrowUpRight className="size-4" />
          </Pill>
        </div>
      </article>
      <RelatedItems title="More insights" items={related} prefix="/insights" />
      <Newsletter />
    </InnerPage>
  );
}

export function ContactPage() {
  return (
    <InnerPage>
      <PageIntro
        label="Contact"
        title="Let’s talk about what’s next."
        copy="Tell us a little about your business and what you want to improve. We’ll get back to you with a useful next step."
        dark
      />
      <section className="container-x grid gap-12 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
        <div>
          <SectionLabel>Start a conversation</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-semibold">
            A good first conversation starts with your goals.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Whether you need a new website, better search visibility, or help with an existing
            project, we’re happy to hear from you.
          </p>
          <a
            className="mt-6 inline-block font-semibold text-forest underline underline-offset-4"
            href="mailto:hello@trivon.com"
          >
            hello@trivon.com
          </a>
        </div>
        <div className="rounded-2xl bg-card p-6 md:p-8">
          <InquiryForm showConfirmationModal />
        </div>
      </section>
    </InnerPage>
  );
}

function RelatedItems({
  title,
  items,
  prefix,
}: {
  title: string;
  items: CmsItem[];
  prefix: "/work" | "/insights";
}) {
  if (!items.length) return null;
  return (
    <section className="container-x border-t border-border py-16">
      <SectionLabel>Keep exploring</SectionLabel>
      <h2 className="mt-5 font-display text-3xl font-semibold">{title}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              to={prefix === "/work" ? "/work/$slug" : "/insights/$slug"}
              params={{ slug: item.slug }}
              className="flex h-full flex-col rounded-2xl bg-card p-5 transition-colors hover:bg-sage-strong"
            >
              <span className="label-mono text-forest">
                {readString(item, "category", "Project")}
              </span>
              <span className="mt-4 font-display text-lg font-semibold">{item.title}</span>
              <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold">
                Explore <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Callout({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-cta py-20 text-center text-on-dark">
      <div className="container-x">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-on-dark-muted">{text}</p>
        <Pill href="/contact" variant="lime" size="lg" className="mt-8">
          Get in touch <ArrowRight className="size-4" />
        </Pill>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not subscribe. Please try again.");
      setMessage("Thanks — you’re on the list.");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not subscribe. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="bg-ink py-16 text-on-dark">
      <div className="container-x grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <SectionLabel dark>Monthly notes</SectionLabel>
          <h2 className="mt-4 font-display text-3xl font-semibold">Useful ideas, occasionally.</h2>
          <p className="mt-2 text-on-dark-muted">
            A short email on search, websites, and practical growth.
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="newsletter-email">
            Your email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="h-12 min-w-0 flex-1 rounded-full border border-line-dark bg-ivory/5 px-5 text-on-dark placeholder:text-on-dark-muted"
          />
          <button
            disabled={busy}
            className="h-12 rounded-full bg-lime px-5 font-semibold text-ink disabled:opacity-60"
          >
            {busy ? "Joining…" : "Subscribe"}
          </button>
          <p aria-live="polite" className="w-full text-sm text-on-dark-muted">
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}

export function LoadingState({ label = "Loading content…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="container-x flex min-h-[50vh] items-center justify-center text-muted-foreground"
    >
      <span className="skeleton mr-3 size-3 rounded-full" />
      {label}
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <section className="container-x py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-3 text-muted-foreground">{detail}</p>
      <Pill href="/" variant="ink" className="mt-7">
        Back home <ArrowLeft className="size-4" />
      </Pill>
    </section>
  );
}
