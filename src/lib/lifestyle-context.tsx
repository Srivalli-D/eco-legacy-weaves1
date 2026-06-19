import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

// ─────────────────────────────────────────────────────────────
// Realistic CO₂e calibration (annual tonnes per person)
// Anchored to published per-capita lifecycle estimates so the
// weekly footprint matches credible reality, not a vibe.
// ─────────────────────────────────────────────────────────────
const TRANSPORT_TCO2: Record<TransportMode, number> = {
  car: 3.5, // ~15,000 km/yr ICE, EPA 2023
  mixed: 2.0,
  transit: 0.8, // bus/rail commuter, IEA 2022
  active: 0.2,
};
const DIET_TCO2: Record<DietType, number> = {
  "meat-heavy": 3.3, // Poore & Nemecek, Science 2018
  mixed: 2.5,
  "plant-forward": 1.7,
  vegan: 1.0,
};
const ENERGY_TCO2: Record<EnergyMix, number> = {
  grid: 5.0, // avg residential, EIA 2023
  mixed: 2.5,
  renewable: 0.5,
};
const HOME_MULT: Record<HomeEfficiency, number> = {
  low: 1.15,
  medium: 1.0,
  high: 0.78,
};
const PER_FLIGHT_TCO2 = 0.25; // mixed short+long-haul, ICAO 2022
const PER_NEW_ITEM_TCO2 = 0.05; // per item (apparel/electronics blend), Ellen MacArthur 2021

// ─────────────────────────────────────────────────────────────
// Per-metric harm tables (deduction points, 0..100 scale)
// Each metric has different sensitivities to the same inputs.
// ─────────────────────────────────────────────────────────────
type MetricKey = "air" | "water" | "bio";

interface HarmTable {
  transport: Record<TransportMode, number>;
  diet: Record<DietType, number>;
  energy: Record<EnergyMix, number>;
  homeMult: Record<HomeEfficiency, number>;
  perFlight: number;
  perShoppingItem: number;
}

const HARM: Record<MetricKey, HarmTable> = {
  air: {
    transport: { car: 32, mixed: 20, transit: 8, active: 2 },
    energy: { grid: 25, mixed: 12, renewable: 2 },
    homeMult: { low: 1.15, medium: 1.0, high: 0.8 },
    diet: { "meat-heavy": 6, mixed: 4, "plant-forward": 2, vegan: 1 },
    perFlight: 1.6,
    perShoppingItem: 0.3,
  },
  water: {
    transport: { car: 6, mixed: 4, transit: 2, active: 1 },
    energy: { grid: 12, mixed: 7, renewable: 2 },
    homeMult: { low: 1.2, medium: 1.0, high: 0.8 },
    diet: { "meat-heavy": 38, mixed: 24, "plant-forward": 12, vegan: 6 },
    perFlight: 0.3,
    perShoppingItem: 0.7,
  },
  bio: {
    transport: { car: 12, mixed: 8, transit: 4, active: 1 },
    energy: { grid: 10, mixed: 6, renewable: 2 },
    homeMult: { low: 1.1, medium: 1.0, high: 0.85 },
    diet: { "meat-heavy": 30, mixed: 20, "plant-forward": 9, vegan: 4 },
    perFlight: 1.0,
    perShoppingItem: 0.9,
  },
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export interface InputContribution {
  key: "transport" | "diet" | "energy" | "home" | "flights" | "shopping";
  label: string;
  detail: string;
  points: number; // deduction points subtracted from this metric
  sharePct: number; // share of total deductions for this metric
}

export interface MetricBreakdown {
  metric: MetricKey;
  score: number;
  totalDeduction: number;
  contributions: InputContribution[];
  topDriver: InputContribution | null;
}

export interface ComputedImpact {
  overall: number;
  airScore: number;
  waterScore: number;
  bioScore: number;
  grade: string;
  ratingLabel: string;
  weeklyCO2Kg: number;
  annualTCO2e: number;
  trajectoryC: number;
  tone: "positive" | "balanced" | "negative";
  summary: string;
  breakdown: Record<MetricKey, MetricBreakdown>;
}

const LABELS = {
  transport: {
    car: "Mostly car",
    mixed: "Mixed commute",
    transit: "Transit & rail",
    active: "Walk / cycle",
  } as Record<TransportMode, string>,
  diet: {
    "meat-heavy": "Meat-heavy diet",
    mixed: "Mixed diet",
    "plant-forward": "Plant-forward diet",
    vegan: "Vegan diet",
  } as Record<DietType, string>,
  energy: {
    grid: "Standard grid",
    mixed: "Partial green",
    renewable: "100% renewable",
  } as Record<EnergyMix, string>,
  home: {
    low: "Low-efficiency home",
    medium: "Average efficiency",
    high: "Insulated + smart",
  } as Record<HomeEfficiency, string>,
};

function buildBreakdown(metric: MetricKey, l: Lifestyle): MetricBreakdown {
  const h = HARM[metric];
  const energyBase = h.energy[l.energy];
  const homeMult = h.homeMult[l.homeEfficiency];
  const energyPts = energyBase * homeMult;
  const homePts = energyBase * (homeMult - 1); // attributable to efficiency choice
  const transportPts = h.transport[l.transport];
  const dietPts = h.diet[l.diet];
  const flightPts = h.perFlight * l.flightsPerYear;
  const shopPts = h.perShoppingItem * l.shoppingNewItemsPerMonth;

  // Treat home as contribution from efficiency only (signed). For breakdown
  // visualisation we collapse to absolute values, but flag direction in detail.
  const raw: InputContribution[] = [
    {
      key: "transport",
      label: "Transport",
      detail: LABELS.transport[l.transport],
      points: transportPts,
      sharePct: 0,
    },
    {
      key: "diet",
      label: "Diet",
      detail: LABELS.diet[l.diet],
      points: dietPts,
      sharePct: 0,
    },
    {
      key: "energy",
      label: "Home energy",
      detail: LABELS.energy[l.energy],
      points: energyBase, // base energy harm
      sharePct: 0,
    },
    {
      key: "home",
      label: "Home efficiency",
      detail:
        homeMult === 1
          ? "Average efficiency (neutral)"
          : `${LABELS.home[l.homeEfficiency]} (${homeMult > 1 ? "+" : ""}${Math.round((homeMult - 1) * 100)}% on energy harm)`,
      points: Math.max(0, homePts), // only positive deductions
      sharePct: 0,
    },
    {
      key: "flights",
      label: "Flights",
      detail: `${l.flightsPerYear} flight${l.flightsPerYear === 1 ? "" : "s"} / year`,
      points: flightPts,
      sharePct: 0,
    },
    {
      key: "shopping",
      label: "New goods",
      detail: `${l.shoppingNewItemsPerMonth} new items / month`,
      points: shopPts,
      sharePct: 0,
    },
  ];

  const totalDeduction =
    transportPts + dietPts + energyPts + flightPts + shopPts;
  const score = clamp(100 - totalDeduction);

  const total = raw.reduce((s, c) => s + c.points, 0) || 1;
  const contributions = raw
    .map((c) => ({ ...c, sharePct: Math.round((c.points / total) * 100) }))
    .sort((a, b) => b.points - a.points);

  return {
    metric,
    score: Math.round(score),
    totalDeduction: +totalDeduction.toFixed(1),
    contributions,
    topDriver: contributions[0] ?? null,
  };
}

export function computeImpact(l: Lifestyle): ComputedImpact {
  const air = buildBreakdown("air", l);
  const water = buildBreakdown("water", l);
  const bio = buildBreakdown("bio", l);

  const overall = clamp((air.score + water.score + bio.score) / 3);

  const annualTCO2e =
    TRANSPORT_TCO2[l.transport] +
    DIET_TCO2[l.diet] +
    ENERGY_TCO2[l.energy] * HOME_MULT[l.homeEfficiency] +
    l.flightsPerYear * PER_FLIGHT_TCO2 +
    l.shoppingNewItemsPerMonth * 12 * PER_NEW_ITEM_TCO2;

  const weeklyCO2Kg = Math.round((annualTCO2e * 1000) / 52);

  // 1.5°C global pathway ≈ 2 t/yr/person by 2030 (IPCC AR6). 4°C path ≈ 12 t.
  // Map overall 0..100 → 3.2°C..1.4°C, anchored loosely to footprint too.
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
      "Your habits track close to the IPCC 1.5°C pathway. Sustain this trajectory and you'll leave a measurably regenerative footprint by 2050.";
  } else if (overall < 45) {
    tone = "negative";
    ratingLabel = "Strained Legacy";
    summary =
      "Your habits exceed what current planetary boundaries can metabolise. Shifting transport, diet, or energy would meaningfully change the future your generation leaves behind.";
  }

  return {
    overall: Math.round(overall),
    airScore: air.score,
    waterScore: water.score,
    bioScore: bio.score,
    grade,
    ratingLabel,
    weeklyCO2Kg,
    annualTCO2e: +annualTCO2e.toFixed(2),
    trajectoryC,
    tone,
    summary,
    breakdown: { air, water, bio },
  };
}

// ─────────────────────────────────────────────────────────────
// Citations / assumptions surfaced in the UI
// ─────────────────────────────────────────────────────────────
export const SCORING_CITATIONS = [
  {
    label: "Diet CO₂e ranges",
    source: "Poore & Nemecek, Science 2018 — Reducing food's environmental impacts",
    note: "Meat-heavy ≈3.3 tCO₂e/yr vs vegan ≈1.0 tCO₂e/yr per person.",
  },
  {
    label: "Transport CO₂e",
    source: "US EPA 2023 + IEA Transport 2022",
    note: "ICE car @15,000 km/yr ≈3.5 tCO₂e; bus/rail commuter ≈0.8 tCO₂e.",
  },
  {
    label: "Home energy CO₂e",
    source: "US EIA Residential Energy 2023",
    note: "Avg residential grid ≈5 tCO₂e/yr; 100% renewable tariff ≈0.5 tCO₂e/yr.",
  },
  {
    label: "Aviation",
    source: "ICAO Carbon Emissions Calculator 2022",
    note: "Mixed short+long-haul flight ≈0.25 tCO₂e per one-way trip.",
  },
  {
    label: "Consumption",
    source: "Ellen MacArthur Foundation 2021",
    note: "New apparel/electronics item ≈0.05 tCO₂e lifecycle average.",
  },
  {
    label: "Temperature pathway",
    source: "IPCC AR6 WG3 (2022)",
    note: "≈2 tCO₂e/person/yr by 2030 aligns with the 1.5°C pathway.",
  },
];

// ─────────────────────────────────────────────────────────────
// Persistence — named profiles in localStorage
// ─────────────────────────────────────────────────────────────
const LS_ACTIVE = "earthverse.lifestyle.active";
const LS_PROFILES = "earthverse.lifestyle.profiles";

export interface SavedProfile {
  name: string;
  lifestyle: Lifestyle;
  savedAt: string; // ISO
}

function readActive(): Lifestyle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_ACTIVE);
    return raw ? (JSON.parse(raw) as Lifestyle) : null;
  } catch {
    return null;
  }
}

function readProfiles(): SavedProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_PROFILES);
    return raw ? (JSON.parse(raw) as SavedProfile[]) : [];
  } catch {
    return [];
  }
}

interface Ctx {
  lifestyle: Lifestyle;
  setLifestyle: (patch: Partial<Lifestyle>) => void;
  impact: ComputedImpact;
  reset: () => void;
  profiles: SavedProfile[];
  saveProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
}

const LifestyleCtx = createContext<Ctx | null>(null);

export function LifestyleProvider({ children }: { children: ReactNode }) {
  const [lifestyle, setState] = useState<Lifestyle>(DEFAULT_LIFESTYLE);
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    const active = readActive();
    if (active) setState((s) => ({ ...s, ...active }));
    setProfiles(readProfiles());
    setHydrated(true);
  }, []);

  // Persist active lifestyle after hydration
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(LS_ACTIVE, JSON.stringify(lifestyle));
    } catch {
      /* ignore quota */
    }
  }, [lifestyle, hydrated]);

  const impact = useMemo(() => computeImpact(lifestyle), [lifestyle]);

  const setLifestyle = useCallback(
    (patch: Partial<Lifestyle>) => setState((s) => ({ ...s, ...patch })),
    [],
  );

  const reset = useCallback(() => setState(DEFAULT_LIFESTYLE), []);

  const persistProfiles = useCallback((next: SavedProfile[]) => {
    setProfiles(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LS_PROFILES, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const saveProfile = useCallback(
    (name: string) => {
      const trimmed = name.trim().slice(0, 40);
      if (!trimmed) return;
      const next: SavedProfile = {
        name: trimmed,
        lifestyle,
        savedAt: new Date().toISOString(),
      };
      const without = profiles.filter((p) => p.name !== trimmed);
      persistProfiles([next, ...without].slice(0, 12));
    },
    [lifestyle, profiles, persistProfiles],
  );

  const loadProfile = useCallback(
    (name: string) => {
      const p = profiles.find((x) => x.name === name);
      if (p) setState(p.lifestyle);
    },
    [profiles],
  );

  const deleteProfile = useCallback(
    (name: string) => {
      persistProfiles(profiles.filter((p) => p.name !== name));
    },
    [profiles, persistProfiles],
  );

  const value = useMemo<Ctx>(
    () => ({
      lifestyle,
      setLifestyle,
      impact,
      reset,
      profiles,
      saveProfile,
      loadProfile,
      deleteProfile,
    }),
    [lifestyle, setLifestyle, impact, reset, profiles, saveProfile, loadProfile, deleteProfile],
  );

  return <LifestyleCtx.Provider value={value}>{children}</LifestyleCtx.Provider>;
}

export function useLifestyle() {
  const ctx = useContext(LifestyleCtx);
  if (!ctx) throw new Error("useLifestyle must be used within LifestyleProvider");
  return ctx;
}

// ─────────────────────────────────────────────────────────────
// Letter generator
// ─────────────────────────────────────────────────────────────
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

The climate models you trusted are the ones we live inside now. Your annual footprint of about ${impact.annualTCO2e} tCO₂e — well under the ~4.7 t global mean of your decade — was one of the signals that gave policymakers permission to be ambitious.

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

I do not blame you alone. But the models from your decade are precise, and they remember ${transportLine[l.transport]}, ${dietLine[l.diet]}, and ${energyLine[l.energy]}. Your annual footprint of around ${impact.annualTCO2e} tCO₂e — above the ~2 t/year the planet could metabolise — was a small line in a very long ledger.

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

Your annual footprint of about ${impact.annualTCO2e} tCO₂e kept the planet on a contested trajectory — neither the regenerative future some of your peers earned, nor the cascading one others authored. There is still a decade in your present where the verdict could tip either way.

Make it tip. The history I am writing has a chapter waiting for what you do next.

— Eli`,
  };
}
