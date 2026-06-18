import { useState } from "react";
import { MENTORS } from "@/lib/earthverse-data";
import { SectionHeader } from "./ClimateLegacyScore";

export function MentorHub() {
  const [activeId, setActiveId] = useState<string>(MENTORS[0].id);
  const active = MENTORS.find((m) => m.id === activeId)!;

  return (
    <section id="mentors" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Feature 04 · AI Climate Mentor Hub"
          title={<>Three intelligences. <span className="text-aurora">One conversation</span>.</>}
          desc="Switch between the planet, the scientist, and a citizen from 2050 — each tuned to your carbon footprint profile."
        />

        <div className="mt-12 grid lg:grid-cols-[1fr_1.6fr] gap-6">
          {/* Mentor selector cards */}
          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {MENTORS.map((m) => {
              const isActive = m.id === activeId;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveId(m.id)}
                  className={`text-left glass rounded-2xl p-5 transition-all relative overflow-hidden group ${
                    isActive ? "glow-ring scale-[1.01]" : "hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-10`} />
                  )}
                  <div className="relative flex items-start gap-3">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${m.accent} grid place-items-center text-2xl shrink-0`}>
                      {m.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {m.role}
                      </div>
                      <div className="font-display text-lg font-semibold truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.tagline}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active mentor panel */}
          <div className="glass-strong rounded-3xl p-7 relative overflow-hidden">
            <div className={`absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${active.accent} opacity-20 blur-3xl`} />
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${active.accent} grid place-items-center text-3xl animate-float-slow`}>
                  {active.avatar}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Speaking now · {active.role}
                  </div>
                  <h3 className="font-display text-2xl font-semibold">{active.name}</h3>
                </div>
              </div>

              <div className="mt-6 relative glass rounded-2xl p-5 border-l-2 border-cyan-400/50">
                <div className="absolute -left-1 top-4 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-[15px] leading-relaxed text-foreground/90 italic">
                  "{active.message}"
                </p>
              </div>

              <div className="mt-6">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Personalized for your profile
                </div>
                <ul className="space-y-2">
                  {active.advice.map((tip, i) => (
                    <li key={i} className="glass rounded-xl px-4 py-3 flex items-start gap-3 group hover:bg-white/5 transition-colors">
                      <span className={`h-6 w-6 rounded-lg bg-gradient-to-br ${active.accent} grid place-items-center text-[10px] font-mono shrink-0`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
