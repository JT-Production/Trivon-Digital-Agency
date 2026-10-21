import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { PROCESS } from "@/content/site";
import { SectionLabel, Petal } from "@/components/site/primitives";

/** Pinned section: 5 viewport-heights of scroll drive 5 steps. */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(PROCESS.length - 1, Math.floor(v * PROCESS.length))));
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const s = PROCESS[step]!;

  return (
    <section ref={ref} id="process" aria-labelledby="process-h" className="relative bg-ink text-on-dark" style={{ height: `${PROCESS.length * 90}vh` }}>
      <div className="sticky top-0 grid h-[100svh] overflow-hidden lg:grid-cols-2">
        <div className="container-x flex flex-col justify-between py-24 lg:py-28 lg:pl-10">
          <div>
            <SectionLabel dark>How we work</SectionLabel>
            <h2 id="process-h" className="sr-only">
              How we work: {PROCESS.map((p) => p.title).join(", ")}
            </h2>
          </div>
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-none text-lime">{s.title}</p>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-on-dark-muted">{s.body}</p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-10 flex gap-2" aria-label="Steps">
              {PROCESS.map((p, i) => (
                <li key={p.title} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-lime" : "bg-line-dark"}`}>
                  <span className="sr-only">{p.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="relative hidden bg-forest lg:block">
          <motion.div aria-hidden style={{ height: bar }} className="absolute left-0 top-0 w-1 bg-lime" />
          <p className="absolute right-10 top-28 font-display text-4xl font-semibold text-lime tabular-nums">
            {step + 1}/{PROCESS.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <StepVisual step={step} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="absolute right-5 top-24 font-display text-2xl font-semibold text-lime lg:hidden">
          {step + 1}/{PROCESS.length}
        </p>
      </div>
    </section>
  );
}

function StepVisual({ step }: { step: number }) {
  const card = "rounded-2xl bg-ink/70 p-6 text-on-dark shadow-card backdrop-blur";
  switch (step) {
    case 0:
      return (
        <div className={`${card} w-80`}>
          <p className="label-mono text-lime">Site audit</p>
          {["Page speed", "Indexing", "Schema", "AI visibility"].map((l, i) => (
            <div key={l} className="mt-4">
              <div className="flex justify-between text-sm">
                <span>{l}</span>
                <span className="text-on-dark-muted">{[62, 78, 34, 21][i]}</span>
              </div>
              <motion.div initial={{ width: 0 }} animate={{ width: `${[62, 78, 34, 21][i]}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }} className="mt-1.5 h-1.5 rounded-full bg-lime" />
            </div>
          ))}
        </div>
      );
    case 1:
      return (
        <div className="relative size-80">
          {[0, 1, 2].map((r) => (
            <motion.span key={r} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: r * 0.12, duration: 0.8 }} className="absolute inset-0 m-auto rounded-full border-2 border-lime/60" style={{ width: `${100 - r * 28}%`, height: `${100 - r * 28}%` }} />
          ))}
          <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-lime font-display font-semibold text-ink">Goal</span>
        </div>
      );
    case 2:
      return (
        <div className="grid w-96 grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`rounded-xl ${i === 0 ? "col-span-3 h-24 bg-lime" : i === 4 ? "col-span-2 h-24 bg-ivory" : "h-24 bg-ink/70"}`} />
          ))}
        </div>
      );
    case 3:
      return (
        <pre className={`${card} w-96 font-mono text-sm leading-7`}>
          <code>
            <span className="text-lime">{"<script type=\"application/ld+json\">"}</span>
            {"\n  \"@type\": \"Organization\",\n  \"name\": \"Your Business\",\n  \"sameAs\": [...]\n"}
            <span className="text-lime">{"</script>"}</span>
          </code>
        </pre>
      );
    default:
      return (
        <div className="relative">
          <Petal className="h-64 w-40 rotate-12 text-lime" />
          <div className={`${card} absolute -left-24 bottom-6 w-56`}>
            <p className="text-xs text-on-dark-muted">Position</p>
            <p className="font-display text-4xl font-semibold">#1</p>
          </div>
        </div>
      );
  }
}
