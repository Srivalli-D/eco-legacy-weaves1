import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type TransportMode = "car" | "mixed" | "transit" | "active";
export type DietType = "meat-heavy" | "mixed" | "plant-forward" | "vegan";
export type EnergyMix = "grid" | "mixed" | "renewable";
export type HomeEfficiency = "low" | "medium" | "high";

export interface Lifestyle {
  transport: TransportMode;
  diet: DietType;
  energy: EnergyMix;
  homeEfficiency: HomeEfficiency;
  flightsPerYear: number; // 0..20
  shoppingNewItemsPerMonth: number; // 0..30
}

const DEFAULT_LIFESTYLE: Lifestyle = {
  transport: "transit",
  diet: "plant-forward",
  energy: "renewable",
  homeEfficiency: "high",
  flightsPerYear: 1,
  shoppingNewItemsPerMonth: 4,
};

// Scoring weights — higher individual sub-score = greener
const TRANSPORT_SCORE: Record<TransportMode, number> = {
  car: 25,
  mixed: 55,
  transit: 82,
  active: 95,
};
const DIET_SCORE: Record<DietType, number> = {
  "meat-heavy": 22,
  mixed: 50,
  "plant-forward": 80,
  vegan: 94,
};
const ENERGY_SCORE: Record<EnergyMix, number> = {
  grid: 28,
  mixed: 60,
  renewable: 92,
};
const HOME_SCORE: Record<HomeEfficiency, number> = {
  low: 30,
  medium: 60,
  high: 90,
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export interface ComputedImpact {
  overall: number; // 0..100
  airScore: number;
  waterScore: number;
  bioScore: number;
  grade: string;
  ratingLabel: string;
  weeklyCO2Kg: number; // estimate
  trajectoryC: number; // global temp pathway anchor for this profile
  tone: "positive" | "balanced" | "negative";
  summary: string;
}

export function computeImpact(l: Lifestyle): ComputedImpact {
  const flightsPenalty = clamp(l.flightsPerYear * 4, 0, 70);
  const shoppingPenalty = clamp(l.shoppingNewItemsPerMonth * 1.4, 0, 35);

  const transport = TRANSPORT_SCORE[l.transport];
  const diet = DIET_SCORE[l.diet];
  const energy = ENERGY_SCORE[l.energy];
  const home = HOME_SCORE[l.homeEfficiency];

  // Base scores (each subscore is themed but pulls from related inputs)
  const airScore = clamp(
    transport * 0.55 + energy * 0.35 + home * 0.1 - flightsPenalty * 0.4,
  );
  const waterScore = clamp(
    diet * 0.6 + home * 0.25 + energy * 0.15 - shoppingPenalty * 0.25,
  );
  const bioScore = clamp(
    diet * 0.5 + transport * 0.25 + energy * 0.15 + home * 0.1 - shoppingPenalty * 0.3,
  );

  const overall = clamp((airScore + waterScore + bioScore) / 3);

  // Weekly CO2 estimate (kg). Baseline ~78 for global avg.
  const weeklyCO2Kg = clamp(
    140 -
      transport * 0.45 -
      diet * 0.35 -
      energy * 0.3 -
      home * 0.15 +
      flightsPenalty * 0.5 +
      shoppingPenalty * 0.4,
    8,
    180,
  );

  // Trajectory mapped to overall: A+ → 1.4°C path; F → 3.2°C path
  const trajectoryC = +(3.2 - (overall / 100) * 1.8).toFixed(1);

  let grade = "F";
  if (overall >= 90) grade = "A+";
  else if (overall >= 82) grade = "A";
  else if (overall >= 75) grade = "A−";
  else if (overall >= 68) grade = "B+";
  else if (overall >= 60) grade = "B";
  else if (overall >= 52) grade = "B−";
  else if (overall >= 45) grade = "C+";
  else if (overall >= 38) grade = "C";
  else if (overall >= 30) grade = "C−";
  else if (overall >= 22) grade = "D";

  let tone: ComputedImpact["tone"] = "balanced";
  let ratingLabel = "Balanced Footprint";
  let summary =
    "Your habits sit near the global middle. Small, consistent shifts in transport, energy or diet could move you into a clearly regenerative trajectory.";

  if (overall >= 75) {
    tone = "positive";
    ratingLabel = "Regenerative Legacy";
    summary =
      "Your current habits could contribute to cleaner air, healthier ecosystems, and a more resilient climate for future generations. Sustain this trajectory and you'll leave a measurably regenerative footprint by 2050.";
  } else if (overall < 45) {
    tone = "negative";
    ratingLabel = "Strained Legacy";
    summary =
      "Your current habits add measurable pressure to air, water, and biodiversity systems. Shifting transport, diet, or energy choices would meaningfully change the future your generation leaves behind.";
  }

  return {
    overall: Math.round(overall),
    airScore: Math.round(airScore),
    waterScore: Math.round(waterScore),
    bioScore: Math.round(bioScore),
    grade,
    ratingLabel,
    weeklyCO2Kg: Math.round(weeklyCO2Kg),
    trajectoryC,
    tone,
    summary,
  };
}

interface Ctx {
  lifestyle: Lifestyle;
  setLifestyle: (patch: Partial<Lifestyle>) => void;
  impact: ComputedImpact;
  reset: () => void;
}

const LifestyleCtx = createContext<Ctx | null>(null);

export function LifestyleProvider({ children }: { children: ReactNode }) {
  const [lifestyle, setState] = useState<Lifestyle>(DEFAULT_LIFESTYLE);
  const impact = useMemo(() => computeImpact(lifestyle), [lifestyle]);
  const value = useMemo<Ctx>(
    () => ({
      lifestyle,
      setLifestyle: (patch) => setState((s) => ({ ...s, ...patch })),
      impact,
      reset: () => setState(DEFAULT_LIFESTYLE),
    }),
    [lifestyle, impact],
  );
  return <LifestyleCtx.Provider value={value}>{children}</LifestyleCtx.Provider>;
}

export function useLifestyle() {
  const ctx = useContext(LifestyleCtx);
  if (!ctx) throw new Error("useLifestyle must be used within LifestyleProvider");
  return ctx;
}

// Letter generator — composes a personalized 2050 letter based on the user's
// inputs and the computed impact tone.
export function generateLetter(l: Lifestyle, impact: ComputedImpact) {
  const transportLine: Record<TransportMode, string> = {
    car: "the cars you kept driving",
    mixed: "the times you split your commute between car and transit",
    transit: "the buses and trains you chose over the easy drive",
    active: "the mornings you walked or cycled when no one was watching",
  };
  const dietLine: Record<DietType, string> = {
    "meat-heavy": "the meat-heavy meals that quietly drained the rivers",
    mixed: "the meals you balanced between meat and plants",
    "plant-forward": "the plant-forward dinners you cooked on quiet weeknights",
    vegan: "the fully plant-based kitchen you stubbornly kept",
  };
  const energyLine: Record<EnergyMix, string> = {
    grid: "the unchanged fossil grid you stayed plugged into",
    mixed: "the partial steps you took to clean up your energy",
    renewable: "the renewable tariff you switched to without fanfare",
  };

  if (impact.tone === "positive") {
    return {
      from: "Maya Okonkwo — Citizen, New Lagos 2050",
      headline: "Thank you for refusing to wait.",
      trajectory: `+${impact.trajectoryC.toFixed(1)}°C stabilized`,
      confidence: `${Math.min(94, 70 + Math.round(impact.overall / 5))}%`,
      body: `Dear friend,

I am writing to you from a Thursday in spring, 2050. The air here is clean enough to taste. My daughter has never seen a smog advisory.

I want you to know that this morning, walking through the restored mangroves of the coast, I thought about ${transportLine[l.transport]}, ${dietLine[l.diet]}, and ${energyLine[l.energy]}. They sound small written down. They were not small.

The climate models you trusted are the ones we live inside now. Your weekly footprint of about ${impact.weeklyCO2Kg} kg CO₂ — well under the global mean of your decade — was one of the signals that gave policymakers permission to be ambitious.

You did not see the results from where you stood. That is the hardest part of what you did, and the most generous. You planted shade for a tree you would never sit under.

Thank you for being one of the people who made my ordinary morning possible.

With love across the years,
Maya`,
    };
  }

  if (impact.tone === "negative") {
    return {
      from: "Archive Letter — Unsent Draft, 2050",
      headline: "We needed you to choose differently.",
      trajectory: `+${impact.trajectoryC.toFixed(1)}°C overshoot`,
      confidence: `${Math.max(58, 80 - Math.round((100 - impact.overall) / 5))}%`,
      body: `Dear friend,

I am writing this knowing you may never read it. The heat outside is 47°C and my city has rationed water until October.

I do not blame you alone. But the models from your decade are precise, and they remember ${transportLine[l.transport]}, ${dietLine[l.diet]}, and ${energyLine[l.energy]}. Your weekly footprint of around ${impact.weeklyCO2Kg} kg CO₂ — above what the planet could metabolize — was a small line in a very long ledger.

We lost the reefs in 2034. The migrations started a few years after. Neighbors, grandparents, children, carrying what they could.

If this letter reaches you in any timeline where the choice is still open — please choose differently. Skip the flight. Eat the lentils. Switch the tariff. Vote like it matters, because from here, it mattered more than anything.

— A citizen of 2050`,
    };
  }

  return {
    from: "Eli Tanaka — Climate Historian, Kyoto 2050",
    headline: "You stood at the hinge.",
    trajectory: `+${impact.trajectoryC.toFixed(1)}°C contested`,
    confidence: `${65 + Math.round(impact.overall / 8)}%`,
    body: `Dear friend,

I write to you as a historian, not a citizen of either future. From where I sit in 2050, your generation's record is mixed — and your choices specifically sit at the hinge.

I see ${transportLine[l.transport]}. I see ${dietLine[l.diet]}. I see ${energyLine[l.energy]}. None of these were catastrophic. None of these were transformative. They were honest, and they were unfinished.

Your weekly footprint of about ${impact.weeklyCO2Kg} kg CO₂ kept the planet on a contested trajectory — neither the regenerative future some of your peers earned, nor the cascading one others authored. There is still a decade in your present where the verdict could tip either way.

Make it tip. The history I am writing has a chapter waiting for what you do next.

— Eli`,
  };
}
