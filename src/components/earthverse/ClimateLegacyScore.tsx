import { LEGACY_SCORES, LEGACY_RATING } from "@/lib/earthverse-data";

export function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
        {eyebrow}
      </div>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
        {title}
      </h2>
      {desc && <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}

export function ClimateLegacyScore() {
  return (
    <section id="legacy" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Feature 01 · Climate Legacy Score"
          title={<>What your habits leave for <span className="text-aurora">2050</span>.</>}
          desc="A projection of how your present-day environmental behavior shapes the air, water, and biodiversity available to future generations."
        />

        <div className="mt-12 grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {LEGACY_SCORES.map((s) => (
              <div key={s.label} className="glass rounded-3xl p-6 relative overflow-hidden group">
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                <div className="relative">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className={`font-display text-5xl font-semibold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>
                      {s.value}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <div className="text-xs text-foreground/70 mt-1">{s.unit}</div>

                  <div className="mt-5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.color} animate-meter`}
                      style={{ width: `${s.value}%` }}
                    />
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 text-[10px] font-mono text-emerald-400">
                    ▲ {s.delta}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--gradient-aurora)] opacity-10" />
            <div className="relative">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Climate Legacy Rating
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <div className="font-display text-7xl font-bold text-aurora leading-none">
                  {LEGACY_RATING.grade}
                </div>
                <div className="text-sm font-medium">{LEGACY_RATING.label}</div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-foreground/85">
                "{LEGACY_RATING.summary}"
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
                <div className="glass rounded-xl p-3">
                  <div className="font-mono text-muted-foreground">Projection</div>
                  <div className="font-display text-lg mt-1">2026 → 2050</div>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="font-mono text-muted-foreground">Confidence</div>
                  <div className="font-display text-lg mt-1">87%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
