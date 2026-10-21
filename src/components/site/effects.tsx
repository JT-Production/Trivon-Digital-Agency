import { AnimatePresence, motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import symbol from "@/assets/trivon-symbol.png.asset.json";
import { Pill } from "./primitives";
import { ArrowRight } from "lucide-react";

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lenis smooth scroll + smooth anchor links. Disabled for reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id.length > 1 ? document.querySelector(id) : null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -16 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-lime" />;
}

/** Custom cursor (fine pointers only). Grows on [data-cursor=hover], shows label on [data-cursor-label]. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [state, setState] = useState<{ hover: boolean; label: string | null }>({ hover: false, label: null });
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReduced()) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      const labelEl = t.closest?.("[data-cursor-label]") as HTMLElement | null;
      const hover = !!t.closest?.('a,button,input,[data-cursor="hover"],[role="button"]');
      setState((s) => {
        const label = labelEl?.dataset["cursorLabel"] ?? null;
        return s.hover === hover && s.label === label ? s : { hover, label };
      });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  if (!enabled) return null;
  const size = state.label ? 88 : state.hover ? 44 : 12;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-normal"
    >
      <motion.div
        animate={{ width: size, height: size, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full ${
          state.label ? "bg-lime text-ink" : state.hover ? "border-2 border-lime bg-lime/10" : "bg-lime"
        }`}
      >
        {state.label && (
          <span className="flex items-center gap-1 text-xs font-semibold">
            {state.label} <ArrowRight className="size-3.5 -rotate-45" strokeWidth={2} />
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Page-load intro using the logo symbol. Plays once per session. */
export function Intro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (prefersReduced() || sessionStorage.getItem("trivon-intro")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("trivon-intro", "1");
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
    }, 1500);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src={symbol.url}
            alt=""
            width={96}
            height={105}
            initial={{ scale: 0.4, rotate: -120, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-24"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Sticky CTA after the hero; hides near the footer. */
export function StickyCTA() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useEffect(
    () =>
      scrollY.on("change", (v) => {
        const nearEnd = v + window.innerHeight > document.body.scrollHeight - 900;
        setShow(v > window.innerHeight * 0.9 && !nearEnd);
      }),
    [scrollY],
  );
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <Pill href="#audit" variant="lime" className="shadow-glow">
            Get a Free Audit <ArrowRight className="size-4" strokeWidth={2} />
          </Pill>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
