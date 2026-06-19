import { useState } from "react";
import {
  useLifestyle,
  type DietType,
  type EnergyMix,
  type HomeEfficiency,
  type TransportMode,
} from "@/lib/lifestyle-context";
import { SectionHeader } from "./ClimateLegacyScore";

const TRANSPORT: { v: TransportMode; label: string; icon: string }[] = [
  { v: "car", label: "Mostly car", icon: "🚗" },
  { v: "mixed", label: "Mixed", icon: "🚙" },
  { v: "transit", label: "Transit & rail", icon: "🚊" },
  { v: "active", label: "Walk / cycle", icon: "🚴" },
];
const DIET: { v: DietType; label: string; icon: string }[] = [
  { v: "meat-heavy", label: "Meat-heavy", icon: "🥩" },
  { v: "mixed", label: "Mixed", icon: "🍱" },
  { v: "plant-forward", label: "Plant-forward", icon: "🥗" },
  { v: "vegan", label: "Vegan", icon: "🌱" },
];
const ENERGY: { v: EnergyMix; label: string; icon: string }[] = [
  { v: "grid", label: "Standard grid", icon: "🏭" },
  { v: "mixed", label: "Partial green", icon: "🔌" },
  { v: "renewable", label: "100% renewable", icon: "☀️" },
];
const HOME: { v: HomeEfficiency; label: string; icon: string }[] = [
  { v: "low", label: "Low efficiency", icon: "🪟" },
  { v: "medium", label: "Average", icon: "🏠" },
  { v: "high", label: "Insulated + smart", icon: "🌿" },
];

interface PillGroupProps<T extends string> {
  label: string;
  options: { v: T; label: string; icon: string }[];
  value: T;
  onChange: (v: T) => void;
}

function PillGroup<T extends string>({ label, options, value, onChange }: PillGroupProps<T>) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o.v === value;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange(o.v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                active
                  ? "bg-[var(--gradient-cyber)] text-primary-foreground glow-ring"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <span aria-hidden>{o.icon}</span>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LifestyleInputs() {
  const { lifestyle, setLifestyle, impact, reset, profiles, saveProfile, loadProfile, deleteProfile } =
    useLifestyle();
  const [profileName, setProfileName] = useState("");

  // Validation — bound numeric inputs to safe ranges (security: never trust raw input)
  const setFlights = (n: number) =>
    setLifestyle({ flightsPerYear: Math.max(0, Math.min(20, Math.round(n))) });
  const setShopping = (n: number) =>
    setLifestyle({ shoppingNewItemsPerMonth: Math.max(0, Math.min(30, Math.round(n))) });

  return (
    <section id="profile" className="relative py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Your Lifestyle Profile"
          title={
            <>
              Tell EarthVerse how you live. <span className="text-aurora">The future updates.</span>
            </>
          }
          desc="Every score, letter, and ripple downstream is recomputed live from these signals."
        />

        <div className="mt-10 grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="glass-strong rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute -top-32 -right-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
            <div className="relative grid sm:grid-cols-2 gap-6">
              <PillGroup
                label="Daily transport"
                options={TRANSPORT}
                value={lifestyle.transport}
                onChange={(v) => setLifestyle({ transport: v })}
              />
              <PillGroup
                label="Diet pattern"
                options={DIET}
                value={lifestyle.diet}
                onChange={(v) => setLifestyle({ diet: v })}
              />
              <PillGroup
                label="Home energy source"
                options={ENERGY}
                value={lifestyle.energy}
                onChange={(v) => setLifestyle({ energy: v })}
              />
              <PillGroup
                label="Home efficiency"
                options={HOME}
                value={lifestyle.homeEfficiency}
                onChange={(v) => setLifestyle({ homeEfficiency: v })}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Flights per year
                  </span>
                  <span className="font-mono text-sm">{lifestyle.flightsPerYear}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={lifestyle.flightsPerYear}
                  onChange={(e) => setFlights(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                  aria-label="Flights per year"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    New items bought / month
                  </span>
                  <span className="font-mono text-sm">{lifestyle.shoppingNewItemsPerMonth}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={lifestyle.shoppingNewItemsPerMonth}
                  onChange={(e) => setShopping(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                  aria-label="New items per month"
                />
              </div>
            </div>

            <div className="relative mt-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value.slice(0, 40))}
                  placeholder="Name this profile (e.g. Weekday me)"
                  className="flex-1 min-w-[200px] px-3 py-2 rounded-full glass text-xs bg-white/[0.03] border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 placeholder:text-muted-foreground"
                  aria-label="Profile name"
                />
                <button
                  onClick={() => {
                    if (profileName.trim()) {
                      saveProfile(profileName);
                      setProfileName("");
                    }
                  }}
                  disabled={!profileName.trim()}
                  className="px-3 py-2 rounded-full text-xs font-medium bg-[var(--gradient-cyber)] text-primary-foreground glow-ring disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  💾 Save profile
                </button>
                <button
                  onClick={reset}
                  className="px-3 py-2 rounded-full text-xs glass hover:bg-white/5 transition-colors"
                >
                  ↺ Reset
                </button>
              </div>

              {profiles.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
                    Saved
                  </span>
                  {profiles.map((p) => (
                    <span
                      key={p.name}
                      className="inline-flex items-center gap-1 rounded-full glass text-xs pl-3 pr-1 py-1 ring-1 ring-white/5"
                    >
                      <button
                        onClick={() => loadProfile(p.name)}
                        className="hover:text-aurora transition-colors"
                        title={`Load · saved ${new Date(p.savedAt).toLocaleDateString()}`}
                      >
                        {p.name}
                      </button>
                      <button
                        onClick={() => deleteProfile(p.name)}
                        className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-rose-400/20 text-muted-foreground hover:text-rose-300 transition"
                        aria-label={`Delete ${p.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[11px] font-mono text-muted-foreground">
                Active profile autosaves locally · Legacy Score & Letter persist across sessions
              </div>
            </div>
          </div>

          {/* Live preview card */}
          <div className="glass-strong rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--gradient-aurora)] opacity-10" />
            <div className="relative">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Live legacy preview
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <div className="font-display text-6xl font-bold text-aurora leading-none">
                  {impact.grade}
                </div>
                <div className="text-sm font-medium">{impact.ratingLabel}</div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { l: "Air", v: impact.airScore, c: "from-cyan-400 to-emerald-400" },
                  { l: "Water", v: impact.waterScore, c: "from-sky-400 to-cyan-400" },
                  { l: "Bio", v: impact.bioScore, c: "from-emerald-400 to-lime-400" },
                ].map((m) => (
                  <div key={m.l} className="glass rounded-xl p-3">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">{m.l}</div>
                    <div
                      className={`font-display text-2xl font-semibold bg-gradient-to-br ${m.c} bg-clip-text text-transparent`}
                    >
                      {m.v}
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        key={m.v}
                        className={`h-full rounded-full bg-gradient-to-r ${m.c} animate-meter`}
                        style={{ width: `${m.v}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="glass rounded-xl p-3">
                  <div className="font-mono text-muted-foreground">Weekly CO₂</div>
                  <div className="font-display text-lg mt-0.5">{impact.weeklyCO2Kg} kg</div>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="font-mono text-muted-foreground">Pathway</div>
                  <div className="font-display text-lg mt-0.5">
                    +{impact.trajectoryC.toFixed(1)}°C
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-foreground/80">
                Scroll down — the <span className="text-aurora">Legacy Score</span> and{" "}
                <span className="text-aurora">Letter From The Future</span> are now written for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
