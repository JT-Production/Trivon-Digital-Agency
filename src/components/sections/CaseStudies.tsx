import { CASE_STUDIES } from "@/content/site";
import { CountUp, Reveal, SectionLabel, SplitText } from "@/components/site/primitives";

export function CaseStudies() {
  return (
    <section id="results" aria-labelledby="cs-h" className="on-light py-24 md:py-36">
      <div className="container-x">
        <SectionLabel>Case studies</SectionLabel>
        <SplitText text={"Real problems.\nMeasurable results."} className="mt-6 font-display text-4xl font-semibold leading-[1.05] md:text-6xl" />
        <p className="label-mono mt-4 text-muted-foreground">* Placeholder data</p>
        <ul className="mt-14 grid gap-4 lg:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <li key={c.client}>
              <Reveal delay={i * 0.1} className="h-full">
                <article className="group flex h-full flex-col rounded-2xl bg-card p-7 transition-shadow duration-500 hover:shadow-card">
                  <p className="label-mono text-forest">{c.client}</p>
                  <p className="mt-8 font-display text-7xl font-semibold leading-none tracking-tight">
                    <CountUp to={c.metric.value} decimals={(c.metric as { decimals?: number }).decimals} prefix="+" suffix={c.metric.suffix} />
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{c.metric.label}</p>
                  <dl className="mt-8 space-y-4 border-t border-border pt-6 text-sm">
                    <div>
                      <dt className="font-semibold">The problem</dt>
                      <dd className="mt-1 text-muted-foreground">{c.problem}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">What we did</dt>
                      <dd className="mt-1 text-muted-foreground">{c.did}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-8">
                    {c.sub.map((s) => (
                      <div key={s.label} className="rounded-xl bg-ivory p-3 transition-colors group-hover:bg-lime">
                        <p className="font-display text-2xl font-semibold">
                          <CountUp to={s.value} decimals={(s as { decimals?: number }).decimals} suffix={s.suffix} />
                        </p>
                        <p className="text-xs">{s.label}</p>
                      </div>
                    ))}
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
