import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Bot, Check, Code2, PenTool, Search, ArrowRight } from "lucide-react";
import { SERVICES } from "@/content/site";
import { Pill, Reveal, SectionLabel, SplitText } from "@/components/site/primitives";

const icons = { design: PenTool, dev: Code2, seo: Search, geo: Bot };

export function Services() {
  return (
    <section id="services" aria-labelledby="services-h" className="on-light pb-24 md:pb-36">
      <div className="container-x">
        <SectionLabel>Services</SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SplitText
            text={"Everything you need\nto be found online."}
            className="font-display text-4xl font-semibold leading-[1.05] md:text-6xl"
          />
          <Reveal>
            <Pill href="#pricing" variant="ink">
              View services <ArrowRight className="size-4" strokeWidth={2} />
            </Pill>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <li key={s.key} className="h-full">
              <Reveal delay={i * 0.08} className="h-full">
                <TiltCard s={s} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TiltCard({ s }: { s: (typeof SERVICES)[number] }) {
  const Icon = icons[s.key];
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      data-cursor="hover"
      className="group flex h-full min-h-80 flex-col rounded-2xl border border-ink/5 bg-card p-6 transition-colors duration-500 hover:bg-ink hover:text-on-dark"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-lime transition-all duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-lime group-hover:text-ink">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <h3 className="mt-auto pt-10 font-display text-xl font-semibold">{s.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-on-dark-muted">{s.body}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {s.points.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <Check className="size-4 text-forest transition-colors group-hover:text-lime" strokeWidth={2} /> {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
