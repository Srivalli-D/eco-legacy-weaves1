import { INNOVATIONS } from "@/lib/earthverse-data";
import { SectionHeader } from "./ClimateLegacyScore";

export function InnovationCenter() {
  return (
    <section id="innovation" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Feature 07 · EarthVerse Innovation Center"
          title={<>The engines behind <span className="text-aurora">the verse</span>.</>}
          desc="Six proprietary systems that turn ordinary climate data into a temporal intelligence platform."
        />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INNOVATIONS.map((it, i) => (
            <div
              key={it.title}
              className="glass rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[var(--gradient-aurora)] opacity-10 blur-3xl group-hover:opacity-25 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-14 w-14 rounded-2xl glass-strong grid place-items-center text-3xl">
                    {it.icon}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full glass">
                    {it.tag}
                  </div>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold leading-snug">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {it.desc}
                </p>
                <div className="mt-5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">SYS-{String(i + 1).padStart(3, "0")}</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Operational
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative py-12 mt-10 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass-strong rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-aurora)] opacity-5" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[var(--gradient-cyber)] grid place-items-center text-xs">🜨</div>
              <div className="font-display text-lg">
                <span className="text-aurora font-semibold">EarthVerse</span>
                <span className="text-muted-foreground font-mono text-xs ml-1.5">AI</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              A futuristic climate intelligence system — built to make tomorrow visible today.
            </p>
          </div>
          <div className="relative text-xs font-mono text-muted-foreground">
            © 2026 EarthVerse · Temporal data licensed under Earth Commons 2.0
          </div>
        </div>
      </div>
    </footer>
  );
}
