import { SCORING_CITATIONS, useLifestyle, type MetricBreakdown } from "@/lib/lifestyle-context";

const METRIC_META: Record<
  "air" | "water" | "bio",
  { title: string; subtitle: string; gradient: string; ring: string }
> = {
  air: {
    title: "Air Quality Legacy",
    subtitle: "PM2.5 · NOx · CO₂e drivers",
    gradient: "from-cyan-400 to-emerald-400",
    ring: "ring-cyan-400/30",
  },
  water: {
    title: "Water System Legacy",
    subtitle: "Freshwater withdrawal & pollution",
    gradient: "from-sky-400 to-cyan-400",
    ring: "ring-sky-400/30",
  },
  bio: {
    title: "Biodiversity Legacy",
    subtitle: "Land-use & species pressure",
    gradient: "from-emerald-400 to-lime-400",
    ring: "ring-emerald-400/30",
  },
};

function MetricCard({ b }: { b: MetricBreakdown }) {
  const meta = METRIC_META[b.metric];
  const visible = b.contributions.filter((c) => c.points > 0).slice(0, 5);
  const maxPts = Math.max(...visible.map((c) => c.points), 1);

  return (
    <div className={`glass rounded-3xl p-6 relative overflow-hidden ring-1 ${meta.ring}`}>
      <div
        className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${meta.gradient} opacity-10 blur-2xl`}
      />
      <div className="relative">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {meta.subtitle}
            </div>
            <div className="font-display text-lg mt-0.5">{meta.title}</div>
          </div>
          <div
            className={`font-display text-3xl font-semibold bg-gradient-to-br ${meta.gradient} bg-clip-text text-transparent`}
          >
            {b.score}
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {visible.map((c) => (
            <div key={c.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="font-medium truncate">{c.label}</span>
                  <span className="text-muted-foreground truncate">· {c.detail}</span>
                </div>
                <span className="font-mono text-muted-foreground tabular-nums shrink-0">
                  −{c.points.toFixed(1)} pts · {c.sharePct}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} animate-meter`}
                  style={{ width: `${Math.min(100, (c.points / maxPts) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="text-xs text-muted-foreground italic">
              No measurable pressure on this system from your current profile.
            </div>
          )}
        </div>

        {b.topDriver && b.topDriver.points > 0 && (
          <div className="mt-5 text-xs glass rounded-xl px-3 py-2">
            <span className="text-muted-foreground">Top driver: </span>
            <span className="font-medium">{b.topDriver.label}</span>
            <span className="text-muted-foreground"> — change this first.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function LegacyBreakdown() {
  const { impact } = useLifestyle();

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Per-metric input attribution
          </div>
          <h3 className="font-display text-2xl mt-1">Which of your habits drove each score?</h3>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          Annual footprint · <span className="text-foreground">{impact.annualTCO2e} tCO₂e</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <MetricCard b={impact.breakdown.air} />
        <MetricCard b={impact.breakdown.water} />
        <MetricCard b={impact.breakdown.bio} />
      </div>

      <details className="glass rounded-3xl p-5 group">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Methodology
            </div>
            <div className="font-display text-base mt-0.5">Assumptions & citations</div>
          </div>
          <span className="text-xs font-mono text-muted-foreground group-open:rotate-180 transition-transform">
            ▾
          </span>
        </summary>
        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs">
          {SCORING_CITATIONS.map((c) => (
            <div key={c.label} className="glass rounded-xl p-3">
              <div className="font-medium">{c.label}</div>
              <div className="text-muted-foreground mt-0.5">{c.source}</div>
              <div className="text-foreground/80 mt-1.5 leading-relaxed">{c.note}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
          Scores are deterministic deductions on a 0–100 scale per metric. Per-input harm
          weights are tuned so a global-average lifestyle lands near a balanced grade and a
          1.5°C-aligned profile lands in A-range. CO₂e estimates are lifecycle averages — your
          local grid mix, vehicle, and diet specifics may vary by ±20%.
        </p>
      </details>
    </div>
  );
}
