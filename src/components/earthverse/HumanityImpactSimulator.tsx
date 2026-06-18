import { useState } from "react";
import { SIMULATIONS, simulateAt } from "@/lib/earthverse-data";
import { SectionHeader } from "./ClimateLegacyScore";

function fmt(n: number, digits = 1) {
  if (n >= 1000) return `${(n / 1000).toFixed(digits)}k`;
  return n.toFixed(digits);
}

export function HumanityImpactSimulator() {
  const [idx, setIdx] = useState(2);
  const current = SIMULATIONS[idx];
  const result = simulateAt(current.people);

  const metrics = [
    {
      label: "CO₂ Avoided",
      value: `${fmt(result.co2SavedTonnes, 1)} t`,
      sub: "per year",
      color: "from-cyan-400 to-emerald-400",
      max: 1_872_000,
      raw: result.co2SavedTonnes * 1000,
    },
    {
      label: "Air Quality Lift",
      value: `+${result.aqiImprovement.toFixed(2)}`,
      sub: "AQI units",
      color: "from-sky-400 to-cyan-400",
      max: 38,
      raw: result.aqiImprovement,
    },
    {
      label: "Temperature Δ",
      value: `−${result.tempReductionC.toFixed(3)}°C`,
      sub: "by 2050",
      color: "from-violet-400 to-fuchsia-400",
      max: 1.6,
      raw: result.tempReductionC,
    },
    {
      label: "Green Cover",
      value: `${fmt(result.greenCoverHa, 1)} ha`,
      sub: "restored",
      color: "from-emerald-400 to-lime-400",
      max: 14_000,
      raw: result.greenCoverHa,
    },
    {
      label: "Water Saved",
      value: `${result.waterSavedGl.toFixed(2)} GL`,
      sub: "per year",
      color: "from-sky-400 to-indigo-400",
      max: 32,
      raw: result.waterSavedGl,
    },
  ];

  return (
    <section id="simulator" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Feature 06 · Humanity Impact Simulator"
          title={<>What if <span className="text-aurora">everyone</span> behaved like you?</>}
          desc="Scale your weekly habits across populations. The simulator projects emissions, air, temperature, green cover, and water — based on your real footprint vs the global mean."
        />

        <div className="mt-12 glass-strong rounded-3xl p-7 sm:p-9 relative overflow-hidden">
          <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Population scenario
                </div>
                <div className="mt-1 font-display text-4xl sm:text-5xl font-semibold text-aurora">
                  {current.people.toLocaleString()} <span className="text-base text-muted-foreground font-sans">people</span>
                </div>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                modeled vs global avg · 30-yr horizon
              </div>
            </div>

            {/* Scale selector */}
            <div className="mt-6 grid grid-cols-5 gap-2">
              {SIMULATIONS.map((s, i) => (
                <button
                  key={s.people}
                  onClick={() => setIdx(i)}
                  className={`relative px-2 py-3 rounded-xl text-xs font-mono transition-all ${
                    idx === i
                      ? "bg-[var(--gradient-cyber)] text-primary-foreground"
                      : "glass hover:bg-white/5 text-muted-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min={0}
              max={SIMULATIONS.length - 1}
              value={idx}
              onChange={(e) => setIdx(Number(e.target.value))}
              className="mt-5 w-full accent-cyan-400"
              aria-label="Population scale"
            />

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {metrics.map((m) => {
                const pct = Math.min(100, (m.raw / m.max) * 100);
                return (
                  <div key={m.label} className="glass rounded-2xl p-5 relative overflow-hidden">
                    <div className={`absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${m.color} opacity-15 blur-2xl`} />
                    <div className="relative">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {m.label}
                      </div>
                      <div className={`mt-2 font-display text-2xl font-semibold bg-gradient-to-br ${m.color} bg-clip-text text-transparent`}>
                        {m.value}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{m.sub}</div>
                      <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          key={pct}
                          className={`h-full rounded-full bg-gradient-to-r ${m.color} animate-meter`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 glass rounded-2xl p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-[var(--gradient-cyber)] grid place-items-center text-base shrink-0">
                💡
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">
                If {current.people.toLocaleString()} people lived like you for one year, the planet would avoid{" "}
                <span className="text-aurora font-semibold">{fmt(result.co2SavedTonnes, 1)} tonnes</span> of CO₂ and restore{" "}
                <span className="text-aurora font-semibold">{fmt(result.greenCoverHa, 1)} hectares</span> of green cover — enough to
                {current.people >= 100_000 ? " visibly shift regional climate models." : " offset an entire small town's footprint."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
