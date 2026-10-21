import { Check, ArrowRight } from "lucide-react";
import { PLANS } from "@/content/site";
import { Pill, Reveal, SectionLabel, SplitText } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-h" className="bg-ink py-24 text-on-dark md:py-36">
      <div className="container-x">
        <SectionLabel dark>Pricing</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SplitText text="Simple plans that grow with you." className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-lime md:text-6xl" />
          <p className="max-w-sm text-on-dark-muted">No hidden fees, no lock-in. Every plan starts with a free audit. <span className="label-mono">* Placeholder prices</span></p>
        </div>
        <ul className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <li key={p.name}>
              <Reveal delay={i * 0.1} className="h-full">
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl p-7 transition-transform duration-500 hover:-translate-y-1.5",
                    p.featured ? "bg-lime text-ink shadow-glow lg:-my-4 lg:py-11" : "bg-ivory text-ink",
                  )}
                >
                  {p.featured && (
                    <span className="label-mono absolute right-6 top-6 rounded-full bg-ink px-3 py-1 text-lime">Most popular</span>
                  )}
                  <p className="label-mono">{p.name} plan</p>
                  <h3 className="mt-6 font-display text-xl font-semibold leading-snug">{p.for}</h3>
                  <ul className="mt-8 space-y-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className={cn("mt-0.5 flex size-5 items-center justify-center rounded-full", p.featured ? "bg-ink text-lime" : "bg-trivon text-ink")}>
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-10">
                    <p>
                      <span className="font-display text-4xl font-semibold">{p.price}</span>
                      <span className="ml-1 text-sm opacity-75">{p.cadence}</span>
                    </p>
                    <Pill href="#audit" variant="ink" aria-label={`Get started with ${p.name}`}>
                      Get Started <ArrowRight className="size-4" strokeWidth={2} />
                    </Pill>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
