import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/trivon-logo.png";
import { NAV_LINKS } from "@/content/site";
import { useRouterState } from "@tanstack/react-router";
import { Pill } from "./primitives";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const onHome = pathname === "/";
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 24)), [scrollY]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-[60] px-3 md:top-5">
      <nav
        aria-label="Main"
        className={cn(
          "on-light mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-all duration-500",
          scrolled ? "glass-light shadow-card" : "bg-ivory",
        )}
      >
        <a
          href={onHome ? "#top" : "/"}
          aria-label="Trivon Digital Agency, home"
          className="shrink-0"
        >
          <img
            src={logo}
            alt="Trivon"
            width={1000}
            height={1000}
            className="h-10 w-full object-fill"
          />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={
                  onHome
                    ? l.href
                    : l.label === "Process"
                      ? "/services#process"
                      : `/${l.label.toLowerCase()}`
                }
                className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-sage hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Pill href={onHome ? "#audit" : "/#audit"} variant="ink">
              Get a Free Audit{" "}
              <ArrowRight
                className="size-4 transition-transform group-hover/pill:translate-x-0.5"
                strokeWidth={2}
              />
            </Pill>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex size-11 items-center justify-center rounded-full bg-ink text-ivory lg:hidden"
          >
            <Menu className="size-5" strokeWidth={2} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink px-6 pb-10 pt-6 text-on-dark"
          >
            <div className="flex justify-end">
              <button
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-12 items-center justify-center rounded-full bg-lime text-ink"
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>
            <ul className="mt-10 flex flex-1 flex-col gap-2">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={
                      onHome
                        ? l.href
                        : l.label === "Process"
                          ? "/services#process"
                          : `/${l.label.toLowerCase()}`
                    }
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 font-display text-5xl font-semibold tracking-tight"
                  >
                    <span className="label-mono text-lime">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <Pill
              href={onHome ? "#audit" : "/#audit"}
              variant="lime"
              size="lg"
              onClick={() => setOpen(false)}
            >
              Get a Free Audit
            </Pill>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
