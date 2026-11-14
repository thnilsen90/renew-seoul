import { products } from "./products";

const productPrice = Object.fromEntries(products.map((p) => [p.id, p.price])) as Record<string, number>;

export interface RoutineStep {
  title: string;
  why: string;
  /** Product ids that fit this step; the first is the default pick. */
  options: string[];
  optional?: boolean;
}

export interface Routine {
  id: string;
  /** Matches the live store's page handle: /pages/<slug>. */
  slug: string;
  name: string;
  korean: string;
  focus: string;
  question: string;
  summary: string;
  image: string;
  steps: RoutineStep[];
  note?: string;
}

const CLEANSERS = [
  "soonjung-foam-cleanser-23ad-150ml",
  "no-3-rice-enzyme-skin-softening-cleansing-foam",
  "balanceful-cica-pore-control-pack-cleanser",
];

export const routines: Routine[] = [
  {
    id: "essential",
    slug: "the-essential-routine",
    name: "The Essential Routine",
    korean: "기본",
    focus: "Cleansing, moisturising, daily SPF",
    question: "How few products do you actually need for balanced, healthy skin?",
    summary:
      "Three fundamental steps — cleanse, moisturise, protect. Consistency over complexity, without overloading skin with actives it doesn't need.",
    image: "RS_People_10_3.png",
    steps: [
      {
        title: "Water-based cleanser",
        why: "Clears daily impurities without stripping natural lipids.",
        options: CLEANSERS,
      },
      {
        title: "Hydrating moisturiser",
        why: "Restores moisture and supports barrier function.",
        options: [
          "soon-jung-hydro-barrier-cream",
          "birch-juice-moisturizing-cream",
          "extreme-cream-light",
          "extreme-cream-50ml",
        ],
      },
      {
        title: "Daily sun protection",
        why: "Shields skin against UV exposure and environmental stress.",
        options: [
          "birch-juice-moisturizing-sun-cream-spf50-pa-50ml",
          "green-tea-fresh-sunscreen-spf50-pa-45ml",
          "aqua-glowing-sunscreen-45ml",
        ],
      },
    ],
    note: "Optional add-ons: a cleansing oil for evening double cleansing, or a hydrating toner when skin wants more.",
  },
  {
    id: "barrier",
    slug: "the-barrier-reset",
    name: "The Barrier Reset",
    korean: "장벽",
    focus: "Soothing care, hydration, barrier support",
    question: "Skin tight, reactive, red or uncomfortably dry? Help it recover first.",
    summary:
      "Mild cleansing, deep soothing layers, moisture replenishment and daily SPF — no aggressive actives while skin finds its footing again.",
    image: "RS_People_4.jpg",
    steps: [
      {
        title: "Gentle cleansing",
        why: "Clears impurities while maintaining natural moisture.",
        options: ["soonjung-foam-cleanser-23ad-150ml"],
      },
      {
        title: "Hydrating or soothing layer",
        why: "Focused relief from a single toner, serum or pad.",
        options: [
          "extreme-panthenol-toner-pad-150-ml-80pads",
          "1025-dokdo-toner-200ml",
          "no-1-pantothenic-b5-active-sooting-serum",
          "birch-70-moisture-boosting-serum",
        ],
      },
      {
        title: "Barrier moisturiser",
        why: "Locks in hydration and reinforces a weakened barrier.",
        options: ["extreme-cream-50ml", "soon-jung-hydro-barrier-cream", "extreme-cream-light"],
      },
      {
        title: "Daily sun protection",
        why: "Shields fragile skin from UV-induced irritation.",
        options: [
          "birch-juice-moisturizing-sun-cream-spf50-pa-50ml",
          "green-tea-fresh-sunscreen-spf50-pa-45ml",
        ],
      },
    ],
  },
  {
    id: "glow",
    slug: "the-glow-routine",
    name: "The Glow Routine",
    korean: "광채",
    focus: "Hydration, radiance, brighter-looking skin",
    question: "Looking dull, flat or tired? Radiance comes from hydration, not harshness.",
    summary:
      "Deep hydration, gentle vitamin C or PDRN, and a glow-focused sunscreen — a natural, dewy bounce without overworking skin.",
    image: "RS_Skincare_6_1.png",
    steps: [
      {
        title: "Gentle cleanser",
        why: "Clears buildup without stripping surface moisture.",
        options: CLEANSERS,
      },
      {
        title: "Glow prep toner or pad",
        why: "Preps skin with a first layer of hydration.",
        options: [
          "no-4-hydrating-glow-mineral-toner-200ml",
          "1025-dokdo-toner-200ml",
          "collagen-gel-toner-pads-140g-60pads",
        ],
      },
      {
        title: "Targeted radiance serum",
        why: "Concentrated vitamin C, moisture boosters or PDRN.",
        options: [
          "gentle-vitamin-c-serum-30ml",
          "pdrn-pink-peptide-serum-30ml",
          "no-6-deep-sleep-mask-serum-50ml",
        ],
      },
      {
        title: "Hydrating moisturiser",
        why: "Locks in moisture for a fresh, supple finish.",
        options: ["birch-juice-moisturizing-cream", "soon-jung-hydro-barrier-cream"],
      },
      {
        title: "Glow-enhancing sunscreen",
        why: "Protects while giving a luminous morning base.",
        options: ["aqua-glowing-sunscreen-45ml", "birch-juice-moisturizing-sun-cream-spf50-pa-50ml"],
      },
    ],
    note: "Feeling warm, flaky or irritated? Pause actives and start with The Barrier Reset — dullness from a compromised barrier isn't fixed by adding more.",
  },
  {
    id: "pore",
    slug: "the-pore-routine",
    name: "The Pore Routine",
    korean: "모공",
    focus: "Pore care, oil balance, smoother texture",
    question: "Clogged, shiny or bumpy? Clarify without the tightness.",
    summary:
      "Decongest pores, smooth rough texture and regulate oil while keeping the barrier calm. Targeted refinement, lightweight hydration — no harsh scrubs.",
    image: "RS_Nature_3_3.png",
    steps: [
      {
        title: "Clarifying cleanser",
        why: "Sweeps away oil and buildup without stripping.",
        options: [
          "balanceful-cica-pore-control-pack-cleanser",
          "no-3-rice-enzyme-skin-softening-cleansing-foam",
        ],
      },
      {
        title: "Texture or calming layer",
        why: "Refine pores or calm inflammation, one focus at a time.",
        options: [
          "no-4-pore-zero-peeled-egg-toner-pad-190ml-70pads",
          "no-1-pantothenic-b5-active-sooting-serum",
          "black-rice-night-knight-retinol-serum-20ml",
        ],
      },
      {
        title: "Lightweight moisturiser",
        why: "Restores hydration without clogging pores.",
        options: ["extreme-cream-light", "no-1-pantothenic-b5-active-soothing-cream"],
      },
      {
        title: "Fresh sunscreen",
        why: "Non-shiny morning UV defence.",
        options: ["green-tea-fresh-sunscreen-spf50-pa-45ml"],
      },
    ],
    note: "Evening essential: double cleanse with an oil to dissolve deep-seated sebum.",
  },
  {
    id: "dark-spot",
    slug: "the-dark-spot-routine",
    name: "The Dark Spot Routine",
    korean: "잡티",
    focus: "Dark spots, even-looking skin, daily SPF",
    question: "Post-acne marks or sun spots? Patience, consistency — and SPF.",
    summary:
      "Even out tone and gradually fade visible marks with focused brightening actives, supportive hydration and strict morning SPF.",
    image: "Frame_2147239156.png",
    steps: [
      {
        title: "Gentle cleanser",
        why: "Keeps skin balanced so actives absorb well.",
        options: CLEANSERS,
      },
      {
        title: "Hydrating toner",
        why: "Restores moisture before serums.",
        options: ["1025-dokdo-toner-200ml", "no-4-hydrating-glow-mineral-toner-200ml"],
        optional: true,
      },
      {
        title: "Targeted brightening",
        why: "Vitamin C, niacinamide and tranexamic acid.",
        options: ["niacinamide-10-tranexamin-txa-acid-4-serum", "gentle-vitamin-c-serum-30ml"],
      },
      {
        title: "Supportive moisturiser",
        why: "Locks in hydration and supports the barrier.",
        options: ["birch-juice-moisturizing-cream", "soon-jung-hydro-barrier-cream"],
      },
      {
        title: "Daily SPF",
        why: "The non-negotiable step that stops marks darkening.",
        options: [
          "birch-juice-moisturizing-sun-cream-spf50-pa-50ml",
          "green-tea-fresh-sunscreen-spf50-pa-45ml",
        ],
      },
    ],
    note: "Stinging or flaky right now? Restore with The Barrier Reset first — brightening actives work best on calm skin.",
  },
];

export const routineById = Object.fromEntries(routines.map((r) => [r.id, r])) as Record<
  string,
  Routine
>;

export const routineBySlug = Object.fromEntries(routines.map((r) => [r.slug, r])) as Record<
  string,
  Routine
>;

export const routinePath = (r: Routine) => `/routines/${r.slug}`;

export const defaultPicks = (r: Routine) =>
  r.steps.filter((s) => !s.optional).map((s) => s.options[0]);

export const routineTotal = (r: Routine) =>
  defaultPicks(r).reduce((n, id) => n + (productPrice[id] ?? 0), 0);

/** Routines that offer this product in any step. */
export const routinesForProduct = (productId: string) =>
  routines.filter((r) => r.steps.some((s) => s.options.includes(productId)));

export const journal = [
  {
    slug: "barrier-reset",
    title: "The Barrier Duo",
    kicker: "Barrier repair",
    excerpt: "Soothe sensitive skin and strengthen the barrier with lightweight, lasting hydration.",
    image: "RS_Product_6_Real_Barrier_2.png",
  },
  {
    slug: "double-cleanse",
    title: "Double Cleanse",
    kicker: "Method",
    excerpt: "Oil first, then water. Why two cleansers can be gentler than one.",
    image: "RS_Skincare_4_1.png",
  },
  {
    slug: "toner-pads",
    title: "Toner Pads",
    kicker: "Explainer",
    excerpt: "Swipe, press or mask — how to get the most from a jar of pads.",
    image: "RS_Skincare_7_1.png",
  },
  {
    slug: "birch-daily",
    title: "Birch Daily",
    kicker: "Ingredient",
    excerpt: "Birch sap, hydration and an easy everyday routine that sticks.",
    image: "RS_Product_4_Round_Lab_1.png",
  },
  {
    slug: "serum-guide",
    title: "Serum Guide",
    kicker: "Guide",
    excerpt: "One concern at a time: choosing the serum your skin actually needs.",
    image: "RS_Skincare_5_2.png",
  },
];
