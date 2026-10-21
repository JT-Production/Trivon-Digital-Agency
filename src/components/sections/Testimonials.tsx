import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "@/content/site";
import { SectionLabel } from "@/components/site/primitives";

export function Testimonials() {
  const [[i, dir], set] = useState<[number, number]>([0, 1]);
  const go = (d: number) => set(([c]) => [(c + d + TESTIMONIALS.length) % TESTIMONIALS.length, d]);
  const t = TESTIMONIALS[i]!;
  return (
    <section aria-labelledby="t-h" className="on-light bg-sage py-24 md:py-36">
      <div className="container-x flex flex-col items-center text-center">
        <SectionLabel>Testimonials</SectionLabel>
        <h2 id="t-h" className="sr-only">What clients say</h2>
        {/* PLACEHOLDER testimonials */}
        <div className="relative mt-10 min-h-[17rem] w-full max-w-4xl md:min-h-[15rem]" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -60, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-display text-2xl font-medium leading-snug md:text-4xl">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <span aria-hidden className="flex size-11 items-center justify-center rounded-full bg-forest font-semibold text-ivory">
                  {t.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <span className="text-left text-sm">
                  <span className="block font-semibold">{t.name}</span>
                  <span className="text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex size-12 items-center justify-center rounded-full bg-ink text-ivory transition-transform hover:-translate-x-0.5">
            <ArrowLeft className="size-5" strokeWidth={2} />
          </button>
          <span className="label-mono w-12 tabular-nums">
            {i + 1}/{TESTIMONIALS.length}
          </span>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="flex size-12 items-center justify-center rounded-full bg-lime text-ink transition-transform hover:translate-x-0.5">
            <ArrowRight className="size-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
