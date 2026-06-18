import { Link } from "@tanstack/react-router";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "profile", label: "Profile" },
  { id: "legacy", label: "Legacy Score" },
  { id: "letter", label: "Future Letter" },
  { id: "ripple", label: "Ripple" },
  { id: "mentors", label: "Mentors" },
  { id: "passport", label: "Passport" },
  { id: "simulator", label: "Simulator" },
  { id: "innovation", label: "Innovation" },
];

export function TopNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="glass-strong rounded-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-[var(--gradient-cyber)] animate-pulse-glow" />
              <div className="absolute inset-[3px] rounded-full bg-background grid place-items-center text-sm">🜨</div>
            </div>
            <div className="font-display font-semibold tracking-tight">
              <span className="text-aurora">EarthVerse</span>
              <span className="text-muted-foreground/80 text-xs ml-1.5 font-mono">AI</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-white/5 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-muted-foreground">Live · 2026</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
