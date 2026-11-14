import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { shopFilters } from "@/data/catalog";
import {
  concerns,
  filterProducts,
  priceRanges,
  shopBrands,
  sortOptions,
  sortProducts,
  type ShopQuery,
  type SortId,
} from "@/data/shop";
import { useTitle } from "@/lib/nav";
import { Button, cx } from "@/lib/ui";
import { ProductCard } from "@/components/ProductCard";
import { Overlay } from "@/components/Overlay";

const TITLES: Record<string, { title: string; line: string }> = {
  all: { title: "All products", line: "Every formula we stock — chosen to earn a place in a real routine." },
  cleanse: { title: "Cleansers", line: "Oil and water-based cleansers. Clean skin without the tight feeling." },
  tone: { title: "Toners & pads", line: "A first layer of hydration, or a targeted swipe for texture and calm." },
  treat: { title: "Serums & treatments", line: "Concentrated care for one concern at a time." },
  moisturise: { title: "Moisturisers", line: "Seal everything in and keep the barrier comfortable." },
  protect: { title: "Sunscreens", line: "Daily SPF50+. The step that protects all the others." },
  eyes: { title: "Eye care", line: "Creams and patches for the thinner skin around the eyes." },
  masks: { title: "Masks", line: "Hydrogel, cream and sheet masks for a weekly reset." },
};

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const query: ShopQuery = {
    step: shopFilters.some((f) => f.id === params.get("step")) ? params.get("step")! : "all",
    concerns: list(params.get("concern")).filter((c) => concerns.some((x) => x.id === c)),
    brands: list(params.get("brand")).filter((b) => shopBrands.includes(b)),
    price: priceRanges.some((r) => r.id === params.get("price")) ? params.get("price") : null,
    sort: (sortOptions.some((s) => s.id === params.get("sort")) ? params.get("sort") : "featured") as SortId,
  };
  const key = params.toString();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const results = useMemo(() => sortProducts(filterProducts(query), query.sort), [key]);

  const heading = TITLES[query.step] ?? TITLES.all;
  useTitle(`${heading.title} — Shop | Renew Seoul`);

  /** Update one URL param; filters replace history so Back leaves the shop instead of undoing ticks. */
  const update = (name: string, value: string | string[] | null) => {
    const next = new URLSearchParams(params);
    const v = Array.isArray(value) ? value.join(",") : value;
    if (!v || v === "all" || (name === "sort" && v === "featured")) next.delete(name);
    else next.set(name, v);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const toggle = (name: "concern" | "brand", current: string[], value: string) =>
    update(name, current.includes(value) ? current.filter((x) => x !== value) : [...current, value]);
  const clearFilters = () => {
    const next = new URLSearchParams();
    if (query.step !== "all") next.set("step", query.step);
    if (query.sort !== "featured") next.set("sort", query.sort);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const active = [
    ...query.concerns.map((c) => ({
      key: `c-${c}`,
      label: concerns.find((x) => x.id === c)!.label,
      remove: () => toggle("concern", query.concerns, c),
    })),
    ...query.brands.map((b) => ({ key: `b-${b}`, label: b, remove: () => toggle("brand", query.brands, b) })),
    ...(query.price
      ? [{ key: "p", label: priceRanges.find((r) => r.id === query.price)!.label, remove: () => update("price", null) }]
      : []),
  ];

  const filters = (
    <FilterGroups query={query} onToggle={toggle} onPrice={(id) => update("price", id === query.price ? null : id)} />
  );

  return (
    <div className="pt-24 pb-24 md:pt-28">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden>/</span>
          {query.step === "all" ? (
            <span className="text-ink" aria-current="page">
              Shop
            </span>
          ) : (
            <>
              <Link to="/shop" className="hover:text-ink">
                Shop
              </Link>
              <span aria-hidden>/</span>
              <span className="text-ink" aria-current="page">
                {heading.title}
              </span>
            </>
          )}
        </nav>

        <header className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1 className="display text-[clamp(3rem,7vw,6rem)]">{heading.title}</h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-slate md:pb-3">{heading.line}</p>
        </header>

        {/* Toolbar: step tabs · filter · sort */}
        <div className="sticky top-16 z-20 -mx-4 mt-10 border-b border-line bg-paper/90 px-4 backdrop-blur-xl md:mx-0 md:px-0">
          <div className="flex items-center gap-3 py-3">
            <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto" role="tablist" aria-label="Product type">
              {shopFilters.map((f) => (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={query.step === f.id}
                  onClick={() => update("step", f.id)}
                  className={cx(
                    "h-9 shrink-0 rounded-full border px-4 text-[13px] transition-colors",
                    query.step === f.id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/40",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDrawer(true)}
              className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-[13px] hover:border-ink/40 lg:hidden"
            >
              <SlidersHorizontal className="size-3.5" strokeWidth={1.75} />
              Filter{active.length > 0 && <span className="tabular-nums">({active.length})</span>}
            </button>
            <label className="relative hidden shrink-0 items-center gap-2 text-[13px] sm:flex">
              <span className="text-slate">Sort</span>
              <select
                value={query.sort}
                onChange={(e) => update("sort", e.target.value)}
                className="h-9 cursor-pointer appearance-none rounded-full border border-line bg-transparent pr-8 pl-4 hover:border-ink/40 focus:outline-none"
              >
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-3 text-[10px]">
                ▾
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[230px_1fr] xl:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">{filters}</div>
          </aside>

          <section aria-label="Products">
            <div className="flex min-h-9 flex-wrap items-center gap-2">
              <p className="mr-2 text-sm text-slate" aria-live="polite">
                <span className="text-ink tabular-nums">{results.length}</span> product{results.length === 1 ? "" : "s"}
              </p>
              {active.map((a) => (
                <button
                  key={a.key}
                  onClick={a.remove}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-mist pr-2.5 pl-3 text-xs transition-colors hover:bg-fog"
                  aria-label={`Remove filter: ${a.label}`}
                >
                  {a.label}
                  <X className="size-3" strokeWidth={2} />
                </button>
              ))}
              {active.length > 0 && (
                <button onClick={clearFilters} className="ml-1 text-xs underline underline-offset-4 hover:text-slate">
                  Clear all
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-5">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-16 flex flex-col items-center rounded-2xl bg-mist px-6 py-20 text-center">
                <p className="font-serif text-3xl font-light">Nothing matches — yet.</p>
                <p className="mt-3 max-w-sm text-sm text-slate">
                  Try removing a filter, or let the routine finder pick for you.
                </p>
                <Button className="mt-8" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Below lg: the same filters in a drawer */}
      <Overlay open={drawer} onClose={() => setDrawer(false)} label="Filters" side="right">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
          <p className="font-serif text-2xl font-light">Filter</p>
          <button onClick={() => setDrawer(false)} className="-mr-2 grid size-10 place-items-center" aria-label="Close filters" data-autofocus>
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-8 sm:hidden">
            <p className="label mb-4 text-[10px] text-slate">Sort</p>
            <div className="grid gap-1">
              {sortOptions.map((s) => (
                <OptionRow key={s.id} checked={query.sort === s.id} round onClick={() => update("sort", s.id)}>
                  {s.label}
                </OptionRow>
              ))}
            </div>
          </div>
          {filters}
        </div>
        <div className="flex gap-3 border-t border-line px-6 pt-4 pb-6">
          <Button variant="outline" className="flex-1" onClick={clearFilters} disabled={!active.length}>
            Clear all
          </Button>
          <Button className="flex-1" onClick={() => setDrawer(false)}>
            Show {results.length}
          </Button>
        </div>
      </Overlay>
    </div>
  );
}

/** ZARA-style numbered filter groups, with live counts for each option. */
function FilterGroups({
  query,
  onToggle,
  onPrice,
}: {
  query: ShopQuery;
  onToggle: (name: "concern" | "brand", current: string[], value: string) => void;
  onPrice: (id: string) => void;
}) {
  // Count = products matching every other active filter plus this one option.
  const count = (q: ShopQuery) => filterProducts(q).length;
  return (
    <div className="grid gap-9">
      <Group n="01" title="Skin concern">
        {concerns.map((c) => {
          const n = count({ ...query, concerns: [c.id] });
          return (
            <OptionRow
              key={c.id}
              checked={query.concerns.includes(c.id)}
              disabled={n === 0 && !query.concerns.includes(c.id)}
              count={n}
              onClick={() => onToggle("concern", query.concerns, c.id)}
            >
              {c.label}
            </OptionRow>
          );
        })}
      </Group>
      <Group n="02" title="Brand">
        {shopBrands.map((b) => {
          const n = count({ ...query, brands: [b] });
          return (
            <OptionRow
              key={b}
              checked={query.brands.includes(b)}
              disabled={n === 0 && !query.brands.includes(b)}
              count={n}
              onClick={() => onToggle("brand", query.brands, b)}
            >
              {b}
            </OptionRow>
          );
        })}
      </Group>
      <Group n="03" title="Price">
        {priceRanges.map((r) => {
          const n = count({ ...query, price: r.id });
          return (
            <OptionRow
              key={r.id}
              round
              checked={query.price === r.id}
              disabled={n === 0 && query.price !== r.id}
              count={n}
              onClick={() => onPrice(r.id)}
            >
              {r.label}
            </OptionRow>
          );
        })}
      </Group>
    </div>
  );
}

function Group({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="label mb-4 flex items-center gap-3 text-[10px] text-slate">
        <span className="tabular-nums">[{n}]</span> {title}
      </legend>
      <div className="grid gap-0.5">{children}</div>
    </fieldset>
  );
}

function OptionRow({
  checked,
  disabled,
  count,
  round,
  onClick,
  children,
}: {
  checked: boolean;
  disabled?: boolean;
  count?: number;
  round?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role={round ? "radio" : "checkbox"}
      aria-checked={checked}
      disabled={disabled}
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-md py-1.5 text-left text-sm transition-colors disabled:opacity-35"
    >
      <span
        className={cx(
          "grid size-4 shrink-0 place-items-center border transition-colors",
          round ? "rounded-full" : "rounded-[4px]",
          checked ? "border-ink bg-ink text-paper" : "border-ink/30 group-hover:border-ink/60",
        )}
      >
        {checked && (round ? <span className="size-1.5 rounded-full bg-paper" /> : <Check className="size-3" strokeWidth={3} />)}
      </span>
      <span className="flex-1">{children}</span>
      {count !== undefined && <span className="text-xs text-slate tabular-nums">{count}</span>}
    </button>
  );
}
