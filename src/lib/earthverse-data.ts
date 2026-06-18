// Centralized data for EarthVerse AI demo
export const USER_PROFILE = {
  name: "Aarav",
  ecoDnaType: "Verdant Architect",
  carbonSavedKg: 1247,
  earthPoints: 8420,
  level: 7,
  levelTitle: "Climate Guardian",
  missionsCompleted: 23,
  totalMissions: 30,
  weeklyCO2Kg: 42,
  globalAvgCO2Kg: 78,
};

export const LEGACY_SCORES = [
  {
    label: "Future Air Quality",
    value: 84,
    unit: "AQI Index",
    delta: "+12% by 2050",
    color: "from-cyan-400 to-emerald-400",
    icon: "wind",
    detail: "Your low-emission commute reduces PM2.5 exposure for 14,000 future neighbors.",
  },
  {
    label: "Future Water Availability",
    value: 71,
    unit: "Reserve Index",
    delta: "+8% reserves",
    color: "from-sky-400 to-cyan-400",
    icon: "droplet",
    detail: "Your conservation habits preserve 3.2M liters across a 30-year horizon.",
  },
  {
    label: "Future Biodiversity",
    value: 77,
    unit: "Species Resilience",
    delta: "+9% richness",
    color: "from-emerald-400 to-lime-400",
    icon: "leaf",
    detail: "Plant-forward choices help protect 47 local species from habitat loss.",
  },
] as const;

export const LEGACY_RATING = {
  grade: "A−",
  label: "Regenerative Legacy",
  summary:
    "Your current habits could contribute to cleaner air, healthier ecosystems, and a more resilient climate for future generations. Sustain this trajectory and you'll leave a measurably regenerative footprint by 2050.",
};

export const RIPPLES = [
  {
    title: "Public Transit Choice",
    chain: [
      "Used Public Transport",
      "Reduced CO₂ by 4.6 kg",
      "Cleaner Urban Air",
      "Healthier Communities",
      "More Walkable Cities by 2050",
    ],
    impactKg: 4.6,
    horizon: "30 yrs",
  },
  {
    title: "Plant-Forward Meal",
    chain: [
      "Chose Plant-Based Lunch",
      "Saved 2,100 L Water",
      "Lower Methane Emissions",
      "Restored Soil Networks",
      "Resilient Food Systems",
    ],
    impactKg: 3.1,
    horizon: "30 yrs",
  },
  {
    title: "Energy-Smart Home",
    chain: [
      "Switched to LED + Smart Thermostat",
      "Cut Grid Demand 18%",
      "Less Fossil Generation",
      "Cleaner Power Grid",
      "Net-Zero Neighborhood",
    ],
    impactKg: 6.2,
    horizon: "30 yrs",
  },
];

export const MENTORS = [
  {
    id: "earth",
    name: "Gaia",
    role: "Earth AI",
    tagline: "The voice of the planet",
    accent: "from-emerald-400 to-cyan-400",
    avatar: "🌍",
    message:
      "I feel your footprint, Aarav. The choices you made this week — 3 plant-based meals, transit over driving — let my forests breathe a little deeper. Keep walking softly. The rivers remember.",
    advice: [
      "Plant something native this month — even one pot counts.",
      "Cold showers save 18 L per use. The oceans will thank you.",
      "Join a local cleanup; my coastlines need hands like yours.",
    ],
  },
  {
    id: "scientist",
    name: "Dr. Helix",
    role: "Scientist AI",
    tagline: "Evidence-based climate reasoning",
    accent: "from-cyan-400 to-violet-400",
    avatar: "🔬",
    message:
      "Your weekly footprint of 42 kg CO₂e is 46% below the global mean. Modeled across a lifetime, that's ~38 tonnes avoided — equivalent to preserving 1.6 hectares of mature forest.",
    advice: [
      "Switch to a green energy tariff: −1.2 t CO₂/yr at zero behavior cost.",
      "Replace one weekly flight with rail to save 220 kg CO₂.",
      "Heat-pump retrofit pays back in 6.3 years at your usage rate.",
    ],
  },
  {
    id: "future",
    name: "Kira-7",
    role: "Future Citizen AI",
    tagline: "Reporting from the year 2050",
    accent: "from-violet-400 to-fuchsia-400",
    avatar: "🛰️",
    message:
      "From where I stand in 2050, your generation's small refusals — the flight you skipped, the meal you swapped — built the climate corridors I now walk through. Thank you for not waiting.",
    advice: [
      "Vote climate in every local election. We feel the policy from here.",
      "Teach one person what you know. Knowledge compounds across decades.",
      "Share repair, not replace. My cities are built on what yours kept.",
    ],
  },
] as const;

export const BADGES = [
  { name: "First Green Week", icon: "🌱", earned: true, rarity: "common" },
  { name: "Energy Saver", icon: "⚡", earned: true, rarity: "common" },
  { name: "Public Transport Hero", icon: "🚊", earned: true, rarity: "rare" },
  { name: "Climate Guardian", icon: "🛡️", earned: true, rarity: "epic" },
  { name: "Earth Protector", icon: "🌍", earned: true, rarity: "legendary" },
  { name: "Ocean Ally", icon: "🌊", earned: false, rarity: "rare" },
  { name: "Forest Keeper", icon: "🌳", earned: true, rarity: "epic" },
  { name: "Zero-Waste Week", icon: "♻️", earned: false, rarity: "rare" },
];

export const SIMULATIONS = [
  { people: 100, label: "100 People" },
  { people: 1_000, label: "1,000" },
  { people: 10_000, label: "10K" },
  { people: 100_000, label: "100K" },
  { people: 1_000_000, label: "1 Million" },
];

// Per-person yearly deltas vs global average
const PER_PERSON = {
  co2SavedKg: 1872, // (78-42)*52
  aqiImprovement: 0.0008,
  tempReductionC: 0.0000019,
  greenCoverM2: 14,
  waterSavedL: 32_000,
};

export function simulateAt(people: number) {
  return {
    co2SavedTonnes: (PER_PERSON.co2SavedKg * people) / 1000,
    aqiImprovement: Math.min(38, PER_PERSON.aqiImprovement * people),
    tempReductionC: Math.min(1.6, PER_PERSON.tempReductionC * people * 1000),
    greenCoverHa: (PER_PERSON.greenCoverM2 * people) / 10_000,
    waterSavedGl: (PER_PERSON.waterSavedL * people) / 1_000_000_000,
  };
}

export const INNOVATIONS = [
  {
    title: "Parallel Timeline Technology",
    desc: "Render two climate futures side-by-side, branched from today's choices.",
    icon: "⏳",
    tag: "Core Engine",
  },
  {
    title: "EcoDNA Intelligence Engine",
    desc: "Classifies every user into one of 12 sustainability archetypes from behavioral signals.",
    icon: "🧬",
    tag: "AI Model",
  },
  {
    title: "Earth Court AI",
    desc: "A simulated jury of future citizens that judges your weekly carbon verdict.",
    icon: "⚖️",
    tag: "Simulation",
  },
  {
    title: "Future Newspaper Generator",
    desc: "Generates a 2050 headline customized to the trajectory of your habits.",
    icon: "📰",
    tag: "Generative",
  },
  {
    title: "Climate Ripple Engine",
    desc: "Traces a single act forward through 5 generations of environmental cascade.",
    icon: "🌊",
    tag: "Visualization",
  },
  {
    title: "Humanity Impact Simulator",
    desc: "Projects what happens if 1 million people lived exactly like you.",
    icon: "🌐",
    tag: "Projection",
  },
];

export const LETTERS = {
  positive: {
    from: "Maya Okonkwo — Citizen, New Lagos 2050",
    headline: "Thank you for refusing to wait.",
    body: `Dear Aarav,

I am writing to you from a Thursday in spring, 2050. The air here is clean enough to taste — sharp like rain on cedar. My daughter has never seen a smog advisory. She thinks they are something from old films.

I want you to know that this morning, on my walk through the restored mangroves of the Lagos coast, I thought of you. Not you specifically — but everyone who, in your decade, made the small refusals. The flight skipped. The meal swapped. The thermostat nudged. The vote cast.

You did not see the results. That is the hardest part of what you did, and the most generous. You planted shade for a tree you would never sit under.

The climate corridors that thread through our cities — the ones the children play in — were funded by the policies your generation pushed through in the late 2020s. The coral nurseries that brought back the reef were seeded by scientists who got their first grants while you were still figuring out your career.

I do not know if you ever felt certain that it would work. I suspect you did not. But it did. We are here. We are okay. We are even, on some days, hopeful.

Thank you for not waiting until it was easy. Thank you for being one of the people who made my ordinary morning possible.

With love across the years,
Maya`,
  },
  negative: {
    from: "Archive Letter — Unsent Draft, 2050",
    headline: "We needed you to choose differently.",
    body: `Dear Aarav,

I am writing this letter knowing you may never read it. I am writing it anyway, because the heat outside is 47°C and my city has rationed water until October, and I need someone to understand.

We lost the reefs in 2034. We lost the glaciers a few years after. The migrations started — not the future kind from old documentaries, but real ones, with neighbors and grandparents and children carrying what they could.

I do not blame you alone. No single person caused this. But I want you to know what it was like to watch the window close, year after year, while the world kept choosing the easier path.

If this letter reaches you in any timeline where the choice is still open — please choose differently. Skip the flight. Eat the lentils. Vote like it matters, because from here, it mattered more than anything.

We are still here. We are adapting. But we are tired, and we wish you had not made us be this brave.

— A citizen of 2050`,
  },
};
