import { USER_PROFILE } from "@/lib/earthverse-data";

export function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-[var(--gradient-aurora)] opacity-20 blur-3xl animate-float-slow pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              CLIMATE INTELLIGENCE · v2.50
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              The climate is{" "}
              <span className="text-aurora">writing back</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              EarthVerse AI is a futuristic intelligence system that turns your daily
              choices into legacy scores, ripple chains, and letters from 2050.
              Not a calculator — a conversation with your future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#legacy"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--gradient-cyber)] text-primary-foreground font-medium glow-ring hover:scale-[1.02] transition-transform"
              >
                See my legacy score
                <span aria-hidden>→</span>
              </a>
              <a
                href="#letter"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-white/5 transition-colors"
              >
                Read my future letter
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
              {[
                { v: USER_PROFILE.carbonSavedKg.toLocaleString(), l: "kg CO₂ saved", u: "lifetime" },
                { v: "46%", l: "below global avg", u: "weekly" },
                { v: USER_PROFILE.level, l: USER_PROFILE.levelTitle, u: "current rank" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-2xl p-4">
                  <div className="font-display text-2xl text-aurora font-semibold">{s.v}</div>
                  <div className="text-xs text-foreground/80 mt-1">{s.l}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">{s.u}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Earth visual */}
          <div className="relative aspect-square max-w-md mx-auto w-full">
            <div className="absolute inset-0 rounded-full bg-[var(--gradient-aurora)] opacity-20 blur-2xl animate-pulse-glow" />
            <div className="absolute inset-6 rounded-full border border-white/10 animate-rotate-slow" />
            <div className="absolute inset-12 rounded-full border border-cyan-400/20 animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "40s" }} />
            <div className="absolute inset-20 rounded-full border border-violet-400/20 animate-rotate-slow" style={{ animationDuration: "50s" }} />
            <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-cyan-400/40 via-emerald-400/30 to-violet-500/40 shadow-[0_0_80px_rgba(34,211,238,0.4)] grid place-items-center text-7xl animate-float-slow">
              🌍
            </div>
            {/* Orbiting badges */}
            {[
              { t: "AQI +12%", a: 0, color: "from-cyan-400 to-emerald-400" },
              { t: "H₂O +8%", a: 120, color: "from-sky-400 to-cyan-400" },
              { t: "BIO +9%", a: 240, color: "from-emerald-400 to-lime-400" },
            ].map((b) => {
              const r = 42; // percent radius
              const x = 50 + r * Math.cos((b.a * Math.PI) / 180);
              const y = 50 + r * Math.sin((b.a * Math.PI) / 180);
              return (
                <div
                  key={b.t}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className={`glass-strong rounded-full px-3 py-1.5 text-xs font-mono bg-gradient-to-r ${b.color} bg-clip-text text-transparent border-white/20`}>
                    {b.t}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
