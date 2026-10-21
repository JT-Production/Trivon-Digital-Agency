import { cva, type VariantProps } from "class-variance-authority";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/* ---------- Pill button ---------- */
export const pill = cva(
  "group/pill relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-[background,color,box-shadow,transform] duration-300 active:scale-[0.97] disabled:opacity-60",
  {
    variants: {
      variant: {
        lime: "bg-lime text-ink hover:shadow-glow",
        trivon: "bg-trivon text-ink hover:bg-lime",
        ink: "bg-ink text-ivory hover:bg-forest",
        ghostDark: "border border-line-dark bg-ivory/5 text-on-dark hover:bg-ivory/15",
        ghost: "border border-ink/15 text-ink hover:bg-ink hover:text-ivory",
      },
      size: { md: "", lg: "min-h-13 px-7 text-base" },
    },
    defaultVariants: { variant: "lime", size: "md" },
  },
);

type PillProps = VariantProps<typeof pill> & { href?: string; children: ReactNode; className?: string } & Omit<
    ComponentPropsWithoutRef<"button">,
    "children"
  >;

export function Pill({ href, variant, size, className, children, ...rest }: PillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  const reduce = useReducedMotion();
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const cls = cn(pill({ variant, size }), className);
  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset} className="inline-flex" data-cursor="hover">
      {href ? (
        <a href={href} className={cls} onClick={rest.onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}>
          {children}
        </a>
      ) : (
        <button className={cls} {...rest}>
          {children}
        </button>
      )}
    </motion.div>
  );
}

/* ---------- Section label ("• SERVICES") ---------- */
export function SectionLabel({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={cn("label-mono flex items-center gap-2", dark ? "text-lime" : "text-forest")}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dark ? "bg-lime" : "bg-trivon")} />
      {children}
    </p>
  );
}

/* ---------- Fade + rise on scroll ---------- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Masked word-by-word headline ---------- */
export function SplitText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const lines = text.split("\n");
  let i = 0;
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(" ").map((w, wi) => {
            const idx = i++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "110%" },
                    show: { y: "0%", transition: { duration: 0.9, delay: delay + idx * 0.06, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}

/* ---------- Count-up number ---------- */
export function CountUp({ to, decimals = 0, suffix = "", prefix = "" }: { to: number; decimals?: number | undefined; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, mv]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- Organic shape derived from a single burst ray ---------- */
export function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 160" className={className} aria-hidden fill="currentColor">
      <path d="M38 4c10-6 24-2 30 8l28 118c3 14-6 26-20 28-12 2-22-5-26-16L4 40C0 26 22 12 38 4Z" />
    </svg>
  );
}
