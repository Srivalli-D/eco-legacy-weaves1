import { USER_PROFILE, BADGES } from "@/lib/earthverse-data";
import { SectionHeader } from "./ClimateLegacyScore";

const RARITY_STYLES: Record<string, string> = {
  common: "from-slate-400/40 to-slate-500/30",
  rare: "from-cyan-400/60 to-sky-500/40",
  epic: "from-violet-400/70 to-fuchsia-500/40",
  legendary: "from-amber-300/80 to-rose-400/50",
};

export function ClimatePassport() {
  const progress = (USER_PROFILE.missionsCompleted / USER_PROFILE.totalMissions) * 100;

  return (
    <section id="passport" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Feature 05 · Climate Passport"
          title={<>Your <span className="text-aurora">sustainability identity</span>, sealed.</>}
          desc="A gamified digital passport that travels with you across cities, missions, and decades."
        />

        <div className="mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-6">
          {/* Passport card */}
          <div className="glass-strong rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[var(--gradient-aurora)] opacity-10" />
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative p-7 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                    EarthVerse · Climate Passport
                  </div>
                  <div className="mt-1 font-display text-3xl font-semibold">
                    {USER_PROFILE.name}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    ID · EVA-2026-{Math.floor(Math.random() * 9000 + 1000)}-AKR
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    EcoDNA Type
                  </div>
                  <div className="mt-1 font-display text-lg text-aurora font-semibold">
                    {USER_PROFILE.ecoDnaType}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { l: "Earth Points", v: USER_PROFILE.earthPoints.toLocaleString(), s: "🪐" },
                  { l: "Level", v: `${USER_PROFILE.level}`, s: USER_PROFILE.levelTitle },
                  { l: "Carbon Saved", v: `${USER_PROFILE.carbonSavedKg.toLocaleString()}kg`, s: "lifetime" },
                  { l: "Missions", v: `${USER_PROFILE.missionsCompleted}/${USER_PROFILE.totalMissions}`, s: "completed" },
                ].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {s.l}
                    </div>
                    <div className="mt-1 font-display text-xl font-semibold">{s.v}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{s.s}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-muted-foreground">Sustainability progression</span>
                  <span>{Math.round(progress)}% to next rank</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-[var(--gradient-cyber)] animate-meter"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Issued · 2026 · Earth Climate Authority
                </div>
                <div className="glass rounded-2xl px-3 py-2 grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-1 rounded-full ${
                        Math.random() > 0.4 ? "bg-cyan-400/80" : "bg-violet-400/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Achievement Badges
              </div>
              <div className="text-xs font-mono">
                {BADGES.filter((b) => b.earned).length}/{BADGES.length}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BADGES.map((b) => (
                <div
                  key={b.name}
                  className={`relative rounded-2xl p-3 text-center transition-all ${
                    b.earned ? "glass hover:scale-105" : "glass opacity-40"
                  }`}
                >
                  <div className={`mx-auto h-14 w-14 rounded-2xl grid place-items-center text-3xl bg-gradient-to-br ${RARITY_STYLES[b.rarity]} ${b.earned ? "" : "grayscale"}`}>
                    {b.icon}
                  </div>
                  <div className="mt-2 text-[11px] font-medium leading-tight">{b.name}</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                    {b.rarity}
                  </div>
                  {!b.earned && (
                    <div className="absolute top-2 right-2 text-[9px] font-mono">🔒</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
