import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";

const scenes = {
  hero: lazy(() => import("./HeroScene")),
  particles: lazy(() => import("./Particles")),
};

function canRender3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Mounts a 3D scene client-side, only when near the viewport; otherwise shows `fallback`. */
export function LazyCanvas({ scene, fallback, className }: { scene: keyof typeof scenes; fallback: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "3d" | "static">("idle");
  useEffect(() => {
    if (!canRender3D()) return setMode("static");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setMode("3d");
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const Scene = scenes[scene];
  return (
    <div ref={ref} className={className}>
      {mode === "3d" ? (
        <Suspense fallback={fallback}>
          <Scene />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
