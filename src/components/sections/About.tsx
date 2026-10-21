import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { CountUp, Pill, Reveal, SectionLabel, SplitText } from "@/components/site/primitives";

const bars = [28, 36, 32, 48, 44, 60, 58, 74, 70, 88];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  return (
    <section ref={ref} id="about" aria-labelledby="about-h" className="on-light py-24 md:py-36">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionLabel>About us</SectionLabel>
          <SplitText
            text={"We help businesses\nget found and grow."}
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] md:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Trivon is a small, senior team of designers, developers and search specialists. We combine strategy, design
              and engineering into one process, so your website isn't just good-looking. It brings in the right people
              and turns them into customers.
            </p>
            <div className="mt-8">
              <Pill href="#process" variant="ink">
                Learn more <ArrowUpRight className="size-4" strokeWidth={2} />
              </Pill>
            </div>
          </Reveal>
        </div>

        <motion.div style={{ y }} className="relative mx-auto w-full max-w-md">
          <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-sage" />
          {/* PLACEHOLDER dashboard values */}
          <div className="rounded-2xl bg-ink p-6 text-on-dark shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Organic performance</p>
                <p className="text-xs text-on-dark-muted">Last 90 days · sample data</p>
              </div>
              <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-ink">Live</span>
            </div>
            <p className="mt-6 flex items-end gap-3 font-display text-6xl font-semibold">
              <CountUp to={184} prefix="+" suffix="%" />
              <span className="mb-2 rounded-full bg-trivon/20 px-2 py-0.5 text-xs font-medium text-lime">traffic</span>
            </p>
            <div className="mt-6 flex h-28 items-end gap-1.5" aria-hidden>
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex-1 rounded-t-md ${i === bars.length - 1 ? "bg-lime" : "bg-forest"}`}
                />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
              {["Top 3 keywords: 42", "AI citations: 17", "Leads: +61%"].map((t) => (
                <span key={t} className="rounded-lg border border-line-dark px-2 py-2 text-on-dark-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
