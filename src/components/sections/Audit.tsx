import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Globe, Loader2, ArrowRight, Check } from "lucide-react";
import { CountUp, SectionLabel, SplitText } from "@/components/site/primitives";

const urlSchema = z
  .string()
  .trim()
  .min(3)
  .max(200)
  .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
  .pipe(z.string().url());
const emailSchema = z.string().trim().email().max(255);

const steps = ["Fetching your homepage", "Checking Core Web Vitals", "Reading structured data", "Testing AI answer readiness"];

// SAMPLE ONLY — scores are illustrative until a real audit backend is connected.
function sampleScores(url: string) {
  let h = 0;
  for (const c of url) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return [
    { label: "SEO", v: 55 + (h % 30) },
    { label: "Speed", v: 45 + ((h >> 5) % 40) },
    { label: "AI readiness", v: 20 + ((h >> 10) % 35) },
  ];
}

type Phase = "idle" | "scanning" | "done" | "sent";

export function Audit() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepI, setStepI] = useState(0);
  const [host, setHost] = useState("");

  const start = (e: React.FormEvent) => {
    e.preventDefault();
    const r = urlSchema.safeParse(url);
    if (!r.success) return setErr("Enter a valid website, like yourbusiness.com");
    setErr(null);
    setHost(new URL(r.data).hostname);
    setPhase("scanning");
    setStepI(0);
    steps.forEach((_, i) => setTimeout(() => setStepI(i + 1), 700 * (i + 1)));
    setTimeout(() => setPhase("done"), 700 * steps.length + 400);
  };
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success) return setErr("Enter a valid email address");
    setErr(null);
    // TODO: connect to a backend to store the request and email the full report.
    setPhase("sent");
  };

  return (
    <section id="audit" aria-labelledby="audit-h" className="on-light py-24 md:py-36">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-forest p-6 text-on-dark md:p-14">
          <div aria-hidden className="absolute -right-20 -top-20 size-80 rounded-full bg-lime/20 blur-3xl" />
          <div className="relative grid gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel dark>Free AI visibility audit</SectionLabel>
              <SplitText as="h2" text="Can Google and AI find you?" className="mt-6 font-display text-4xl font-semibold leading-[1.05] md:text-5xl" />
              <p className="mt-5 max-w-md text-on-dark-muted">
                Enter your website and get an instant snapshot of your SEO, speed and AI answer readiness. Then we'll send a
                full report with your three biggest wins.
              </p>
              <form onSubmit={start} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
                <label htmlFor="audit-url" className="sr-only">Your website address</label>
                <div className="relative flex-1">
                  <Globe className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-on-dark-muted" strokeWidth={2} />
                  <input
                    id="audit-url"
                    inputMode="url"
                    autoComplete="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yourbusiness.com"
                    aria-invalid={!!err && phase === "idle"}
                    className="h-13 w-full rounded-full border border-line-dark bg-ink/40 pl-12 pr-4 text-on-dark placeholder:text-on-dark-muted focus:border-lime focus:outline-none"
                  />
                </div>
                <button
                  disabled={phase === "scanning"}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-lime px-7 font-semibold text-ink transition-shadow hover:shadow-glow disabled:opacity-70"
                >
                  {phase === "scanning" ? <Loader2 className="size-4 animate-spin" /> : null}
                  {phase === "scanning" ? "Scanning…" : "Run audit"}
                </button>
              </form>
              {err && <p role="alert" className="mt-3 text-sm text-lime">{err}</p>}
            </div>

            <div className="relative min-h-[22rem] rounded-2xl bg-ink/60 p-6" aria-live="polite">
              <AnimatePresence mode="wait">
                {phase === "idle" && (
                  <motion.div key="idle" exit={{ opacity: 0 }} className="space-y-4">
                    <div className="skeleton h-5 w-1/2 rounded opacity-20" />
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="skeleton h-14 rounded-xl opacity-10" />
                    ))}
                    <p className="pt-2 text-sm text-on-dark-muted">Your score card will appear here.</p>
                  </motion.div>
                )}
                {phase === "scanning" && (
                  <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative overflow-hidden">
                    <p className="label-mono text-lime">Scanning {host}</p>
                    <div aria-hidden className="absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-transparent via-lime/25 to-transparent" />
                    <ul className="mt-6 space-y-4">
                      {steps.map((s, i) => (
                        <li key={s} className={`flex items-center gap-3 text-sm transition-opacity ${i <= stepI ? "opacity-100" : "opacity-30"}`}>
                          <span className={`flex size-6 items-center justify-center rounded-full ${i < stepI ? "bg-lime text-ink" : "border border-line-dark"}`}>
                            {i < stepI ? <Check className="size-3.5" strokeWidth={3} /> : i === stepI ? <Loader2 className="size-3.5 animate-spin" /> : null}
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {(phase === "done" || phase === "sent") && (
                  <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between">
                      <p className="label-mono text-lime">{host}</p>
                      <span className="label-mono text-on-dark-muted">Sample score</span>
                    </div>
                    <ul className="mt-5 grid grid-cols-3 gap-3">
                      {sampleScores(host).map((s) => (
                        <li key={s.label} className="rounded-xl bg-forest/70 p-4 text-center">
                          <p className="font-display text-4xl font-semibold text-lime"><CountUp to={s.v} /></p>
                          <p className="mt-1 text-xs text-on-dark-muted">{s.label}</p>
                        </li>
                      ))}
                    </ul>
                    {phase === "done" ? (
                      <form onSubmit={send} className="mt-6" noValidate>
                        <label htmlFor="audit-email" className="text-sm font-medium">Get the full report by email</label>
                        <div className="mt-2 flex gap-2">
                          <input
                            id="audit-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="h-12 min-w-0 flex-1 rounded-full border border-line-dark bg-ink/40 px-4 text-on-dark placeholder:text-on-dark-muted focus:border-lime focus:outline-none"
                          />
                          <button aria-label="Send my report" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                            <ArrowRight className="size-5" strokeWidth={2} />
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="mt-6 rounded-xl bg-lime p-4 text-sm font-medium text-ink">
                        Thanks! This demo doesn't send email yet — connect a backend to deliver real reports.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
