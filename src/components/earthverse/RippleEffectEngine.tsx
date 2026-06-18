import { RIPPLES } from "@/lib/earthverse-data";
import { SectionHeader } from "./ClimateLegacyScore";

export function RippleEffectEngine() {
  return (
    <section id="ripple" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Feature 03 · Climate Ripple Effect Engine"
          title={<>One choice. <span className="text-aurora">Five generations</span> of consequence.</>}
          desc="Every act cascades. We trace it forward — physically, socially, generationally."
        />

        <div className="mt-12 grid lg:grid-cols-3 gap-5">
          {RIPPLES.map((r, ri) => (
            <div key={r.title} className="glass rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[var(--gradient-cyber)] opacity-10 blur-3xl group-hover:opacity-25 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Simulation #{String(ri + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-1 font-display text-xl font-semibold">{r.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-lg text-aurora font-semibold">
                      −{r.impactKg}kg
                    </div>
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">
                      over {r.horizon}
                    </div>
                  </div>
                </div>

                <ol className="mt-6 relative space-y-3">
                  {r.chain.map((step, si) => (
                    <li
                      key={step}
                      className="relative pl-9 animate-meter"
                      style={{ animationDelay: `${si * 120}ms`, animationDuration: "0.6s" }}
                    >
                      {/* connector line */}
                      {si < r.chain.length - 1 && (
                        <span className="absolute left-[14px] top-7 bottom-[-12px] w-px bg-gradient-to-b from-cyan-400/60 to-violet-400/20" />
                      )}
                      {/* node */}
                      <span className="absolute left-0 top-0.5 h-7 w-7 rounded-full glass-strong grid place-items-center text-[10px] font-mono">
                        <span className={`h-2 w-2 rounded-full ${
                          si === 0 ? "bg-cyan-400" :
                          si === r.chain.length - 1 ? "bg-emerald-400 animate-pulse" :
                          "bg-violet-400/70"
                        }`} />
                      </span>
                      <div className="text-sm">
                        <div className="font-medium">{step}</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                          {si === 0 ? "Action" :
                           si === r.chain.length - 1 ? "Legacy" :
                           `Cascade ${si}`}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 flex items-center gap-2 text-xs">
                  <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 shimmer" />
                  </div>
                  <span className="font-mono text-muted-foreground">live trace</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
