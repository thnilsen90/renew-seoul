import type { StepId } from "./products";

export const CDN = "https://cdn.shopify.com/s/files/1/0732/0590/7643/files/";

/** Shopify CDN image with on-the-fly resizing. */
export function img(file: string, width = 800) {
  return `${CDN}${file}?width=${width}`;
}

export function srcSet(file: string, widths = [400, 700, 1000, 1400]) {
  return widths.map((w) => `${img(file, w)} ${w}w`).join(", ");
}

export interface Step {
  id: StepId;
  number: number | null;
  label: string;
  short: string;
  what: string;
  essential?: boolean;
}

/** The classic Korean routine order. Only three are essential. */
export const steps: Step[] = [
  {
    id: "oil-cleanser",
    number: 1,
    label: "Oil cleanser",
    short: "Cleanse",
    what: "Melts sunscreen and makeup in the evening — the first half of a double cleanse.",
  },
  {
    id: "cleanser",
    number: 2,
    label: "Water-based cleanser",
    short: "Cleanse",
    what: "Clears the day without stripping. The one cleanser everyone needs.",
    essential: true,
  },
  {
    id: "toner",
    number: 3,
    label: "Toner & pads",
    short: "Tone",
    what: "A first layer of hydration, or a targeted swipe for texture and calm.",
  },
  {
    id: "serum",
    number: 4,
    label: "Serum & treatment",
    short: "Treat",
    what: "Concentrated care for one concern at a time — spots, glow, pores or calm.",
  },
  {
    id: "eye",
    number: 5,
    label: "Eye cream",
    short: "Eyes",
    what: "Lightweight care for the thinner skin around the eyes.",
  },
  {
    id: "moisturiser",
    number: 6,
    label: "Moisturiser",
    short: "Moisturise",
    what: "Seals everything in and keeps the barrier comfortable.",
    essential: true,
  },
  {
    id: "sunscreen",
    number: 7,
    label: "Sunscreen",
    short: "Protect",
    what: "Every morning, even in an Oslo November. The step that protects all the others.",
    essential: true,
  },
];

export const extras: Step[] = [
  {
    id: "mask",
    number: null,
    label: "Sheet masks",
    short: "Masks",
    what: "A weekly reset. Hydrogel, cream and sheet masks for when skin needs more.",
  },
  {
    id: "eye-patch",
    number: null,
    label: "Eye patches",
    short: "Eyes",
    what: "Ten minutes of cooling, hydrating under-eye care.",
  },
];

export const stepById = Object.fromEntries(
  [...steps, ...extras].map((s) => [s.id, s]),
) as Record<StepId, Step>;

export interface ShopFilter {
  id: string;
  label: string;
  steps: StepId[] | null;
}

export const shopFilters: ShopFilter[] = [
  { id: "all", label: "All", steps: null },
  { id: "cleanse", label: "Cleanse", steps: ["oil-cleanser", "cleanser"] },
  { id: "tone", label: "Tone", steps: ["toner"] },
  { id: "treat", label: "Treat", steps: ["serum"] },
  { id: "moisturise", label: "Moisturise", steps: ["moisturiser"] },
  { id: "protect", label: "Protect", steps: ["sunscreen"] },
  { id: "eyes", label: "Eyes", steps: ["eye", "eye-patch"] },
  { id: "masks", label: "Masks", steps: ["mask"] },
];

export const filterForStep = (step: StepId) =>
  shopFilters.find((f) => f.steps?.includes(step))?.id ?? "all";

export const brands = [
  "Anua",
  "Biodance",
  "Dr. Althea",
  "Etude House",
  "Haruharu Wonder",
  "Medicube",
  "Medi-Peel",
  "Numbuzin",
  "Real Barrier",
  "Round Lab",
  "Tocobo",
  "Torriden",
  "VT Cosmetics",
];

export const FREE_SHIPPING_THRESHOLD = 600;
/**
 * The Shopify store that handles cart, checkout, policies and the blog.
 * Set VITE_SHOPIFY_STORE_URL when this site takes over renewseoul.com and
 * Shopify moves to a subdomain (e.g. https://shop.renewseoul.com).
 */
export const STORE_URL = (import.meta.env.VITE_SHOPIFY_STORE_URL || "https://renewseoul.com").replace(/\/+$/, "");

/** From renewseoul.com/policies/shipping-policy and /refund-policy. */
export const SHIPPING_COST = 69;
export const DISPATCH_TIME = "3–5 business days";
export const RETURN_DAYS = 14;
export const CONTACT_EMAIL = "info@renewseoul.com";
export const SHIPPING_POLICY_URL = `${STORE_URL}/policies/shipping-policy`;
export const RETURN_POLICY_URL = `${STORE_URL}/policies/refund-policy`;

export interface HowToStep {
  title: string;
  body: string;
}

/** General application guidance by step. Always follow the instructions on the pack. */
export const howTo: Record<StepId, HowToStep[]> = {
  "oil-cleanser": [
    { title: "Dry hands, dry face", body: "Massage one or two pumps over dry skin to melt sunscreen and makeup." },
    { title: "Emulsify", body: "Add a splash of lukewarm water — the oil turns milky — then rinse thoroughly." },
    { title: "Follow with", body: "Your water-based cleanser to complete the double cleanse." },
  ],
  cleanser: [
    { title: "Lather", body: "Work a small amount into a soft foam with lukewarm water." },
    { title: "Massage", body: "Spread over damp skin for 30–60 seconds, avoiding the eye area." },
    { title: "Rinse & pat", body: "Rinse well and pat dry. Skin should feel clean, never tight." },
  ],
  toner: [
    { title: "Prepare", body: "Apply to freshly cleansed skin, morning and/or evening." },
    { title: "Pat or sweep", body: "Press liquid toner in with your palms, or sweep a pad gently outwards — no rubbing." },
    { title: "Layer", body: "Move on to serum or moisturiser while skin is still slightly damp." },
  ],
  serum: [
    { title: "Prepare", body: "Apply to clean skin after toner." },
    { title: "Dispense & press", body: "Press a few drops over face and neck until absorbed. One targeted serum at a time is plenty." },
    { title: "Seal in", body: "Follow with moisturiser — and SPF in the morning, especially with brightening or retinol serums." },
  ],
  eye: [
    { title: "Take a little", body: "A rice-grain amount is enough for both eyes." },
    { title: "Tap, don’t rub", body: "Tap gently along the orbital bone with your ring finger." },
    { title: "Then", body: "Continue with moisturiser and, in the morning, sunscreen." },
  ],
  moisturiser: [
    { title: "Prepare", body: "Apply after toner and serum, morning and evening." },
    { title: "Warm & press", body: "Warm a small amount between fingertips and press over face and neck." },
    { title: "Finish", body: "The last step at night; in the morning, follow with sunscreen." },
  ],
  sunscreen: [
    { title: "Last step, every morning", body: "Apply after moisturiser, even on grey days." },
    { title: "Be generous", body: "About two finger-lengths covers face and neck." },
    { title: "Reapply", body: "Top up when you’re outdoors for long stretches." },
  ],
  mask: [
    { title: "Prepare", body: "Cleanse and tone, then unfold the mask over your face." },
    { title: "Rest", body: "Leave on for the time stated on the pack — usually 15–20 minutes; some hydrogels are made for overnight." },
    { title: "Pat in", body: "Remove and press any remaining essence into the skin. One to three times a week." },
  ],
  "eye-patch": [
    { title: "Prepare", body: "Place on clean, dry skin under the eyes." },
    { title: "Rest", body: "Leave for 15–20 minutes while the patches cool and hydrate." },
    { title: "Pat in", body: "Remove and tap the remaining essence in." },
  ],
  other: [],
};
