import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import symbol from "@/assets/trivon-symbol.png.asset.json";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { Pill, SplitText } from "@/components/site/primitives";
import { NAV_LINKS } from "@/content/site";
import { useRouterState } from "@tanstack/react-router";
import { Modal } from "@/components/site/Modal";
import { InquiryForm } from "@/components/site/InquiryForm";

export function FinalCta() {
  const [bookCallOpen, setBookCallOpen] = useState(false);

  return (
    <section
      aria-labelledby="cta-h"
      className="relative isolate overflow-hidden bg-cta py-32 text-center text-on-dark md:py-44"
    >
      <LazyCanvas scene="particles" className="absolute inset-0 -z-10 opacity-80" fallback={null} />
      <div aria-hidden className="grain absolute inset-0 -z-10" />
      <div className="container-x">
        <SplitText
          text={"Ready to grow\nyour business?"}
          className="mx-auto font-display text-5xl font-semibold leading-[1.02] md:text-7xl"
        />
        <p className="mx-auto mt-6 max-w-md text-on-dark-muted">
          Tell us where you want to be in a year. We'll show you how we'd get you there.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Pill type="button" onClick={() => setBookCallOpen(true)} variant="ghostDark" size="lg">
            Book a Call
          </Pill>
          <Pill href="#audit" variant="lime" size="lg">
            Get a Free Audit <ArrowRight className="size-4" strokeWidth={2} />
          </Pill>
        </div>
      </div>
      <Modal
        open={bookCallOpen}
        onOpenChange={setBookCallOpen}
        title="Book a call"
        description="Tell us a little about your goals and we’ll be in touch to arrange a time."
      >
        <InquiryForm initialPlan="Book a call" />
      </Modal>
    </section>
  );
}

const cols = [
  { title: "Explore", links: NAV_LINKS.map((l) => ({ label: l.label, href: l.href })) },
  {
    title: "Services",
    links: [
      { label: "Web Design", href: "#services" },
      { label: "Web Development", href: "#services" },
      { label: "SEO", href: "#services" },
      { label: "AI Search Ranking", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Trivon", href: "#about" },
      { label: "Case studies", href: "#results" },
      { label: "FAQ", href: "#faq" },
      { label: "Free audit", href: "#audit" },
    ],
  },
];

// PLACEHOLDER social URLs
const socials = [
  { icon: Linkedin, label: "Trivon on LinkedIn", href: "#" },
  { icon: Twitter, label: "Trivon on X", href: "#" },
  { icon: Instagram, label: "Trivon on Instagram", href: "#" },
  { icon: Github, label: "Trivon on GitHub", href: "#" },
];

export function Footer() {
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const onHome = pathname === "/";
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);
  return (
    <footer className="overflow-hidden bg-ink text-on-dark">
      <div className="container-x grid gap-12 pt-20 md:grid-cols-[1.2fr_2fr]">
        <div>
          <img
            src={symbol.url}
            alt="Trivon symbol"
            width={48}
            height={53}
            loading="lazy"
            className="w-12"
          />
          <p className="mt-5 max-w-xs text-on-dark-muted">
            Strategy. Design. Development. Websites that get found and grow your business.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = new FormData(form).get("email");
              setNewsletterBusy(true);
              setNewsletterMessage("");
              try {
                const response = await fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                const result = (await response.json()) as { error?: string };
                if (!response.ok)
                  throw new Error(result.error ?? "Could not subscribe. Please try again.");
                setNewsletterMessage("Thanks — you’re on the list.");
                form.reset();
              } catch (error) {
                setNewsletterMessage(
                  error instanceof Error ? error.message : "Could not subscribe. Please try again.",
                );
              } finally {
                setNewsletterBusy(false);
              }
            }}
            className="mt-8 max-w-sm"
          >
            <label htmlFor="news" className="text-sm font-semibold">
              Monthly growth notes
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="news"
                name="email"
                type="email"
                required
                maxLength={254}
                placeholder="you@company.com"
                className="h-12 min-w-0 flex-1 rounded-full border border-line-dark bg-ivory/5 px-4 placeholder:text-on-dark-muted focus:border-lime focus:outline-none"
              />
              <button
                disabled={newsletterBusy}
                aria-label="Subscribe"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lime text-ink disabled:opacity-60"
              >
                <ArrowRight className="size-5" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-2 text-xs text-on-dark-muted" aria-live="polite">
              {newsletterMessage}
            </p>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="label-mono text-lime">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href.startsWith("#") && !onHome ? `/${l.href}` : l.href}
                      className="text-sm text-on-dark-muted transition-colors hover:text-lime"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 flex gap-2 sm:col-span-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-11 items-center justify-center rounded-full border border-line-dark transition-colors hover:bg-lime hover:text-ink"
              >
                <Icon className="size-4" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-x mt-16 flex flex-wrap justify-between gap-2 border-t border-line-dark py-6 text-xs text-on-dark-muted">
        <p>© {new Date().getFullYear()} Trivon Digital Agency. All rights reserved.</p>
        <p>Serving the US, UK, Canada & Germany</p>
      </div>
      <div ref={ref} aria-hidden className="select-none overflow-hidden">
        <motion.p
          style={{ y, clipPath: clip }}
          className="text-center font-display text-[27vw] font-bold leading-[0.78] tracking-[-0.06em] text-lime"
        >
          Trivon
        </motion.p>
      </div>
    </footer>
  );
}
