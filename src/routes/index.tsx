import { createFileRoute } from "@tanstack/react-router";
import { LifestyleProvider } from "@/lib/lifestyle-context";
import { TopNav } from "@/components/earthverse/TopNav";
import { Hero } from "@/components/earthverse/Hero";
import { LifestyleInputs } from "@/components/earthverse/LifestyleInputs";
import { ClimateLegacyScore } from "@/components/earthverse/ClimateLegacyScore";
import { LetterFromFuture } from "@/components/earthverse/LetterFromFuture";
import { RippleEffectEngine } from "@/components/earthverse/RippleEffectEngine";
import { MentorHub } from "@/components/earthverse/MentorHub";
import { ClimatePassport } from "@/components/earthverse/ClimatePassport";
import { HumanityImpactSimulator } from "@/components/earthverse/HumanityImpactSimulator";
import { InnovationCenter, Footer } from "@/components/earthverse/InnovationCenter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EarthVerse AI — Futuristic Climate Intelligence" },
      {
        name: "description",
        content:
          "Personalized climate intelligence: legacy scores, letters from 2050, ripple chains, AI mentors, and humanity-scale simulators driven by your real lifestyle.",
      },
      { property: "og:title", content: "EarthVerse AI — Climate Intelligence From The Future" },
      {
        property: "og:description",
        content: "Not a carbon calculator. A conversation with your future.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LifestyleProvider>
      <div className="relative min-h-screen">
        <TopNav />
        <main>
          <Hero />
          <LifestyleInputs />
          <ClimateLegacyScore />
          <LetterFromFuture />
          <RippleEffectEngine />
          <MentorHub />
          <ClimatePassport />
          <HumanityImpactSimulator />
          <InnovationCenter />
        </main>
        <Footer />
      </div>
    </LifestyleProvider>
  );
}
