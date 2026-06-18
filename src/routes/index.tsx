import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/earthverse/TopNav";
import { Hero } from "@/components/earthverse/Hero";
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
          "Legacy scores, letters from 2050, ripple chains, AI mentors, climate passports, and humanity-scale simulators. EarthVerse turns your habits into a temporal climate intelligence system.",
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
    <div className="relative min-h-screen">
      <TopNav />
      <main>
        <Hero />
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
  );
}
