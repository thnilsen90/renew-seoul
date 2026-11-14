import { Link } from "react-router";
import { Plus } from "lucide-react";
import { img, srcSet, stepById } from "@/data/catalog";
import type { Product } from "@/data/products";
import { useStore } from "@/lib/store";
import { cx, kr } from "@/lib/ui";
import { productPath } from "@/lib/nav";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { add } = useStore();
  const step = stepById[product.step];

  return (
    <article className={cx("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <Link
          to={productPath(product.id)}
          className="absolute inset-0 block"
          aria-label={`${product.brand} ${product.name}`}
          tabIndex={-1}
        >
          <img
            src={img(product.image, 700)}
            srcSet={srcSet(product.image, [400, 700, 1000])}
            sizes="(min-width: 1024px) 25vw, 50vw"
            alt={`${product.brand}, ${product.name}`}
            loading="lazy"
            className={cx(
              "absolute inset-0 size-full object-contain p-[8%] mix-blend-multiply transition-[transform,opacity] duration-700 ease-[var(--ease-out-soft)]",
              product.image2 ? "group-hover:opacity-0" : "group-hover:scale-[1.04]",
            )}
          />
          {product.image2 && (
            <img
              src={img(product.image2, 700)}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full scale-[1.04] object-cover opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-out-soft)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="label rounded-full bg-paper/85 px-2.5 py-1.5 text-[9px] whitespace-nowrap text-ink/70 backdrop-blur">
            {step.number ? `Step 0${step.number}` : step.short}
          </span>
          {product.bestseller && (
            <span className="label rounded-full bg-ink px-2.5 py-1.5 text-[9px] whitespace-nowrap text-paper">Bestseller</span>
          )}
        </div>

        {/* Quick add */}
        <button
          onClick={() => add(product.id)}
          className="absolute right-3 bottom-3 flex h-10 items-center gap-2 overflow-hidden rounded-full bg-ink pr-3 pl-3 text-paper shadow-lg shadow-ink/10 transition-all duration-500 ease-[var(--ease-out-soft)] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus className="size-4" strokeWidth={1.75} />
          <span className="hidden text-xs font-medium md:inline">Add</span>
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="label text-[10px] text-slate">{product.brand}</p>
          <h3 className="mt-2 text-[15px] leading-snug text-pretty">
            <Link to={productPath(product.id)} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-slate">{product.size}</p>
        </div>
        <p className="text-sm tabular-nums sm:shrink-0">{kr(product.price)}</p>
      </div>
    </article>
  );
}
