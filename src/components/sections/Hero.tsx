import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Bot, Gauge, TrendingUp } from "lucide-react";
import symbol from "@/assets/trivon-symbol.png.asset.json";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { Pill, SplitText } from "@/components/site/primitives";

const chips = [
  { icon: TrendingUp, label: "Ranking #1", sub: "Google", pos: "left-[2%] top-[18%]", depth: -60 },
  { icon: Bot, label: "Cited by AI", sub: "ChatGPT · Perplexity", pos: "right-[0%] top-[38%]", depth: -110 },
  { icon: Gauge, label: "98 PageSpeed", sub: "Core Web Vitals", pos: "left-[10%] bottom-[12%]", depth: -40 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative isolate overflow-hidden bg-hero text-on-dark">
      <div aria-hidden className="grain absolute inset-0 -z-10 opacity-60" />
      <div className="container-x grid min-h-[100svh] items-center gap-8 pb-16 pt-32 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <motion.div style={{ y: yText, opacity: fade }} className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="label-mono mb-6 inline-flex items-center gap-2 rounded-full border border-line-dark px-3 py-1.5 text-lime"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-lime" /> Web design · SEO · AI search
          </motion.p>
          <SplitText
            as="h1"
            immediate
            delay={0.35}
            text={"More Traffic.\nMore Customers.\nMore Growth."}
            className="font-display text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.98]"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-on-dark-muted"
          >
            We design and build fast, beautiful websites that rank on Google and get your business recommended in AI
            answers from ChatGPT, Perplexity and Google AI Overviews.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Pill href="#audit" variant="lime" size="lg">
              Get a Free Audit <ArrowRight className="size-4 transition-transform group-hover/pill:translate-x-1" strokeWidth={2} />
            </Pill>
            <Pill href="#work" variant="ghostDark" size="lg">
              View Our Work
            </Pill>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <div aria-hidden className="absolute inset-[12%] rounded-full bg-trivon/20 blur-3xl" />
          <LazyCanvas
            scene="hero"
            className="absolute inset-0"
            fallback={
              <img
                src={symbol.url}
                alt=""
                aria-hidden
                width={264}
                height={289}
                className="animate-float absolute left-1/2 top-1/2 w-[45%] -translate-x-1/2 -translate-y-1/2"
              />
            }
          />
          {chips.map((c, i) => (
            <Chip key={c.label} {...c} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Chip({
  icon: Icon,
  label,
  sub,
  pos,
  depth,
  index,
  progress,
}: (typeof chips)[number] & { index: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const y = useTransform(progress, [0, 1], [0, depth * 2]);
  return (
    <motion.div style={{ y }} className={`absolute ${pos}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2 + index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass animate-float flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4"
        style={{ animationDelay: `${index * 1.3}s` }}
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-ink">
          <Icon className="size-4" strokeWidth={2} />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold">{label}</span>
          <span className="block text-xs text-on-dark-muted">{sub}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
