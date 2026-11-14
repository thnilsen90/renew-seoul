import { shopFilters } from "./catalog";
import { products, type Product, type StepId } from "./products";

/** Display order for "Featured": bestsellers first, then the routine order. */
export const STEP_ORDER: StepId[] = [
  "oil-cleanser",
  "cleanser",
  "toner",
  "serum",
  "eye",
  "moisturiser",
  "sunscreen",
  "mask",
  "eye-patch",
];

/**
 * Skin concerns. "skin" concerns read the product's "Choose this if…" sentence (which describes
 * the customer's skin); "active" concerns also read the description, where the actives are named.
 */
export const concerns = [
  { id: "hydration", label: "Dryness & dehydration", source: "skin", test: /dehydrat|\bdry\b|tight|thirsty|depleted|lacking elasticity/ },
  { id: "sensitivity", label: "Sensitivity & redness", source: "skin", test: /sensitive|irritat|reactive|redness|overworked|calm|barrier/ },
  { id: "pores", label: "Pores, oil & texture", source: "skin", test: /\bpores?\b|\boil(y)?\b|breakout|blemish|congest|rough|bumpy|blackhead/ },
  { id: "dullness", label: "Dullness & glow", source: "skin", test: /dull|glow|radian|tired|bright/ },
  { id: "spots", label: "Dark spots & uneven tone", source: "active", test: /dark spot|pigment|\buneven\b|post-blemish|even out|even-looking/ },
  { id: "firmness", label: "Fine lines & firmness", source: "active", test: /fine line|firm|elasticity|retinol|sagging|wrinkle|plumper/ },
] as const;

export type ConcernId = (typeof concerns)[number]["id"];

const concernIndex = new Map<string, ConcernId[]>(
  products.map((p) => {
    const skin = p.goodFor.toLowerCase();
    const all = `${p.description} ${p.goodFor}`.toLowerCase();
    return [p.id, concerns.filter((c) => c.test.test(c.source === "skin" ? skin : all)).map((c) => c.id)];
  }),
);
export const concernsFor = (p: Product) => concernIndex.get(p.id) ?? [];

export const shopBrands = [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));

export const priceRanges = [
  { id: "under-250", label: "Under 250 kr", min: 0, max: 249 },
  { id: "250-349", label: "250 – 349 kr", min: 250, max: 349 },
  { id: "350-plus", label: "350 kr and over", min: 350, max: Infinity },
] as const;

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export interface ShopQuery {
  step: string; // shopFilters id
  concerns: string[];
  brands: string[];
  price: string | null;
  sort: SortId;
}

/** Products matching every active filter (options within one group are OR-ed). */
export function filterProducts(q: Omit<ShopQuery, "sort">) {
  const stepFilter = shopFilters.find((f) => f.id === q.step);
  const range = priceRanges.find((r) => r.id === q.price);
  return products.filter((p) => {
    if (stepFilter?.steps && !stepFilter.steps.includes(p.step)) return false;
    if (q.brands.length && !q.brands.includes(p.brand)) return false;
    if (range && (p.price < range.min || p.price > range.max)) return false;
    if (q.concerns.length) {
      const tags = concernsFor(p) as string[];
      if (!q.concerns.some((c) => tags.includes(c))) return false;
    }
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortId) {
  const out = [...list];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "name":
      return out.sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
    default:
      return out.sort((a, b) => {
        if (a.bestseller !== b.bestseller) return a.bestseller ? -1 : 1;
        return STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step);
      });
  }
}

/** Build a /shop link, e.g. shopPath({ step: "cleanse" }) or shopPath({ brand: "Anua" }). */
export function shopPath(opts: { step?: string; brand?: string; concern?: string } = {}) {
  const params = new URLSearchParams();
  if (opts.step && opts.step !== "all") params.set("step", opts.step);
  if (opts.concern) params.set("concern", opts.concern);
  if (opts.brand) params.set("brand", opts.brand);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}
