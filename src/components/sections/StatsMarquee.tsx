import { CLIENT_LOGOS, STATS } from "@/content/site";
import { CountUp, Reveal, SectionLabel, SplitText, Petal } from "@/components/site/primitives";

export function Stats() {
  return (
    <section aria-labelledby="stats-h" className="bg-ink text-on-dark">
      <div className="container-x grid gap-10 py-24 md:grid-cols-[0.8fr_1.2fr] md:py-32">
        <SectionLabel dark>Partnership</SectionLabel>
        <div>
          <SplitText
            text="A digital agency built to be found."
            className="font-display text-4xl font-semibold leading-tight text-lime md:text-5xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-on-dark-muted">
              Every site we ship is designed for people, engineered for speed and structured so search engines and AI
              models understand exactly who you help.
            </p>
          </Reveal>
          {/* PLACEHOLDER stats — see STATS in src/content/site.ts */}
          <dl className="mt-12 grid gap-8 border-t border-line-dark pt-10 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-5xl font-semibold">
                  <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
                </dd>
                <p className="mt-2 text-sm text-on-dark-muted">{s.label}</p>
              </Reveal>
            ))}
          </dl>
          <p className="label-mono mt-6 text-on-dark-muted">* Placeholder figures</p>
        </div>
      </div>
    </section>
  );
}

export function LogoMarquee() {
  const row = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <section aria-label="Trusted by businesses in the US, UK, Canada and Germany" className="bg-ink pb-20 text-on-dark">
      <p className="container-x label-mono mb-6 text-center text-on-dark-muted">
        Trusted by businesses in the US, UK, Canada and Germany
      </p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        {/* PLACEHOLDER logos — replace CLIENT_LOGOS with real client marks */}
        <ul className="flex w-max animate-[marquee_40s_linear_infinite] gap-3 group-hover:[animation-duration:90s]">
          {row.map((name, i) => (
            <li
              key={i}
              aria-hidden={i >= CLIENT_LOGOS.length}
              className="flex items-center gap-2 rounded-xl bg-ivory px-6 py-4 font-display text-base font-semibold text-ink"
            >
              <Petal className="h-5 w-4 text-trivon" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
