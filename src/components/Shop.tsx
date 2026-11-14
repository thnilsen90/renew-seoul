import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { img, shopFilters } from "@/data/catalog";
import { products } from "@/data/products";
import { useStore } from "@/lib/store";
import { Button, Reveal, SectionLabel, cx } from "@/lib/ui";
import { ProductCard } from "./ProductCard";
import { productPath } from "@/lib/nav";
import { shopPath, sortProducts } from "@/data/shop";

export function Shop() {
  const { shopFilter, setShopFilter } = useStore();

  const list = useMemo(() => {
    const f = shopFilters.find((x) => x.id === shopFilter);
    const base = f?.steps ? products.filter((p) => f.steps!.includes(p.step)) : products;
    return sortProducts(base, "featured");
  }, [shopFilter]);

  const showFeature = shopFilter === "all";
  // The feature tile spans two columns, so 10 products + tile fill three full rows.
  const initial = showFeature ? 10 : 8;
  const visible = list.slice(0, initial);

  return (
    <section id="shop" className="scroll-mt-16 py-20 md:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <SectionLabel korean="제품" className="text-slate">
              The edit
            </SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.75rem,6vw,5.5rem)]">
              Fewer products,
              <br />
              <em>better chosen.</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-sm text-[15px] leading-relaxed text-slate">
              {products.length} formulas from 13 Korean brands — each one picked because it earns a
              place in a real routine.
            </p>
          </Reveal>
        </div>

        {/* Filter chips */}
        <div
          className="no-scrollbar sticky top-16 z-20 -mx-4 mt-12 flex gap-2 overflow-x-auto bg-paper/90 px-4 py-3 backdrop-blur-xl md:mx-0 md:px-0"
          role="tablist"
          aria-label="Filter by step"
        >
          {shopFilters.map((f) => {
            const n = f.steps ? products.filter((p) => f.steps!.includes(p.step)).length : products.length;
            const active = f.id === shopFilter;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setShopFilter(f.id)}
                className={cx(
                  "flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors",
                  active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/40",
                )}
              >
                {f.label}
                <span className={cx("text-[11px] tabular-nums", active ? "text-paper/60" : "text-slate")}>
                  {n}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 lg:grid-cols-4">
          {visible.flatMap((p, i) => [
            showFeature && i === 2 ? <FeatureTile key="feature" /> : null,
            <ProductCard key={p.id} product={p} />,
          ])}
        </div>

        <div className="mt-16 flex justify-center">
          <Button as={Link} variant="outline" to={shopPath({ step: shopFilter })}>
            {shopFilter === "all" ? `Shop all ${list.length} products` : `View all ${list.length}`}
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeatureTile() {
  return (
    <Link
      to={productPath("extreme-cream-50ml")}
      className="group relative col-span-2 block min-h-[420px] overflow-hidden bg-ink text-left text-white"
    >
      <img
        src={img("Frame_2147239145.png", 1600)}
        alt="Real Barrier Extreme Cream texture"
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-soft)] group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <span className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6">
        <span>
          <span className="label opacity-70">In focus · Real Barrier</span>
          <span className="display mt-3 block text-4xl md:text-5xl">
            Extreme <em>Cream</em>
          </span>
          <span className="mt-3 block max-w-xs text-sm text-white/75">
            Panthenol and nourishing lipids for skin that feels tight, dry or depleted.
          </span>
        </span>
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/40 transition-colors group-hover:bg-white group-hover:text-ink">
          <ArrowUpRight className="size-5" strokeWidth={1.25} />
        </span>
      </span>
    </Link>
  );
}
