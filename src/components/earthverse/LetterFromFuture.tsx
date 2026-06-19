import { useMemo, useState } from "react";
import { generateLetter, useLifestyle } from "@/lib/lifestyle-context";
import { SectionHeader } from "./ClimateLegacyScore";

async function downloadLetterPdf(opts: {
  letter: ReturnType<typeof generateLetter>;
  grade: string;
  overall: number;
  annualTCO2e: number;
  tone: string;
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;

  // Deep space background
  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, W, H, "F");
  // Aurora accent band
  doc.setFillColor(40, 80, 140);
  doc.rect(0, 0, W, 6, "F");
  doc.setFillColor(120, 70, 200);
  doc.rect(0, 6, W, 2, "F");

  // Header chip
  doc.setTextColor(160, 180, 210);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text("EARTHVERSE AI · TEMPORAL DELIVERY · CLASSIFIED", M, M);

  // Title
  doc.setTextColor(245, 248, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(opts.letter.headline, W - M * 2);
  doc.text(titleLines, M, M + 28);
  let y = M + 28 + titleLines.length * 24;

  // Meta block
  doc.setDrawColor(60, 78, 110);
  doc.setLineWidth(0.5);
  doc.line(M, y + 6, W - M, y + 6);
  y += 22;
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(160, 180, 210);
  const meta = [
    ["From", opts.letter.from],
    ["Sent", "April 14, 2050"],
    ["Trajectory", opts.letter.trajectory],
    ["Confidence", opts.letter.confidence],
    ["Profile grade", `${opts.grade} · ${opts.overall}/100`],
    ["Annual footprint", `${opts.annualTCO2e} tCO₂e`],
  ];
  meta.forEach(([k, v]) => {
    doc.setTextColor(140, 160, 190);
    doc.text(String(k).toUpperCase(), M, y);
    doc.setTextColor(235, 240, 250);
    doc.text(String(v), M + 110, y);
    y += 14;
  });
  y += 8;
  doc.line(M, y, W - M, y);
  y += 20;

  // Body
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.setTextColor(235, 240, 250);
  const bodyLines = doc.splitTextToSize(opts.letter.body, W - M * 2);
  const lineH = 17;
  for (const line of bodyLines) {
    if (y > H - M - 60) {
      doc.addPage();
      doc.setFillColor(10, 14, 26);
      doc.rect(0, 0, W, H, "F");
      doc.setFillColor(40, 80, 140);
      doc.rect(0, 0, W, 6, "F");
      y = M;
    }
    doc.text(line, M, y);
    y += lineH;
  }

  // Footer signature band
  const footY = H - M - 30;
  doc.setDrawColor(60, 78, 110);
  doc.line(M, footY, W - M, footY);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 160, 190);
  doc.text(
    `Signed via temporal cryptography · tone:${opts.tone} · earthverse.ai`,
    M,
    footY + 14,
  );
  doc.text(`Generated ${new Date().toLocaleString()}`, M, footY + 26);

  doc.save(`letter-from-2050-${opts.tone}-${opts.overall}.pdf`);
}



export function LetterFromFuture() {
  const { lifestyle, impact } = useLifestyle();
  const [override, setOverride] = useState<"auto" | "positive" | "negative">("auto");

  const letter = useMemo(() => {
    if (override === "auto") return generateLetter(lifestyle, impact);
    // Force a tone by temporarily swapping the computed tone
    const forced = { ...impact, tone: override } as typeof impact;
    return generateLetter(lifestyle, forced);
  }, [lifestyle, impact, override]);

  const activeTone = override === "auto" ? impact.tone : override;

  return (
    <section id="letter" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Feature 02 · AI Future Letter Generator"
          title={<>A letter, hand-written from <span className="text-aurora">2050</span>.</>}
          desc="Composed live from your lifestyle profile. The author, tone, and details all shift with your choices above."
        />

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {([
            { v: "auto", label: "✨ From your timeline" },
            { v: "positive", label: "Regenerative branch" },
            { v: "negative", label: "Cautionary branch" },
          ] as const).map((t) => (
            <button
              key={t.v}
              onClick={() => setOverride(t.v)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                override === t.v
                  ? "bg-[var(--gradient-cyber)] text-primary-foreground glow-ring"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Regenerated for profile · {Math.round(impact.overall)}/100
          </div>
        </div>

        <div className="mt-6 glass-strong rounded-3xl overflow-hidden relative">
          <div className="flex items-center gap-3 px-6 py-3 border-b border-white/10 bg-white/5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="font-mono text-xs text-muted-foreground truncate">
              earthverse://archive/letters/{activeTone}/profile-{impact.overall}.2050.txt
            </div>
            <div className="ml-auto text-[10px] font-mono uppercase tracking-wider text-muted-foreground hidden sm:block">
              CLASSIFIED · TEMPORAL DELIVERY
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
            <div className="p-7 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02]">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                From
              </div>
              <div className="mt-1 font-display text-lg">{letter.from}</div>

              <div className="mt-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Subject
              </div>
              <div
                key={letter.headline}
                className="mt-1 font-display text-xl leading-snug text-aurora animate-meter"
              >
                {letter.headline}
              </div>

              <div className="mt-8 space-y-3 text-xs">
                {[
                  ["Sent from", "April 14, 2050"],
                  ["Delivered to", "Today"],
                  ["Trajectory", letter.trajectory],
                  ["Confidence", letter.confidence],
                  ["Profile grade", impact.grade],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2 font-mono">
                    <span className="text-muted-foreground">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-7 sm:p-10 max-h-[560px] overflow-y-auto relative">
              <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-card to-transparent pointer-events-none" />
              <article
                key={letter.body}
                className="font-sans text-[15px] leading-[1.85] text-foreground/90 whitespace-pre-wrap animate-meter"
                style={{ animationDuration: "0.8s" }}
              >
                {letter.body}
              </article>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeTone === "positive"
                      ? "bg-emerald-400"
                      : activeTone === "negative"
                        ? "bg-rose-400"
                        : "bg-amber-400"
                  } animate-pulse`}
                />
                Signed via temporal cryptography · verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
