import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Minus, Plus, X } from "lucide-react";
import { DISPATCH_TIME, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, img } from "@/data/catalog";
import { products } from "@/data/products";
import { useStore } from "@/lib/store";
import { Button, Tiger, cx, kr } from "@/lib/ui";
import { productPath } from "@/lib/nav";
import { Overlay } from "./Overlay";

const ESSENTIAL_ORDER = ["sunscreen", "moisturiser", "cleanser", "toner", "serum", "oil-cleanser"];

export function CartDrawer() {
  const { lines, count, subtotal, setQty, remove, add, cartOpen, setCartOpen, checkoutUrl, setQuizOpen, lastAdded } =
    useStore();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  // Suggest bestsellers from steps the bag doesn't cover yet — essentials first.
  const suggestions = useMemo(() => {
    const have = new Set(lines.map((l) => l.product.step));
    const inBag = new Set(lines.map((l) => l.product.id));
    return ESSENTIAL_ORDER.filter((s) => !have.has(s as never))
      .map((s) => products.find((p) => p.step === s && p.bestseller && !inBag.has(p.id)) ?? products.find((p) => p.step === s && !inBag.has(p.id)))
      .filter((p): p is (typeof products)[number] => Boolean(p))
      .slice(0, 3);
  }, [lines]);

  const close = () => setCartOpen(false);
  const navigate = useNavigate();

  return (
    <Overlay open={cartOpen} onClose={close} label="Shopping bag" side="right">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
        <p className="font-serif text-2xl font-light">
          Your bag <span className="text-base text-slate tabular-nums">({count})</span>
        </p>
        <button onClick={close} className="-mr-2 grid size-10 place-items-center" aria-label="Close bag" data-autofocus>
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <Tiger className="w-20 text-fire" />
          <p className="mt-8 font-serif text-3xl font-light">Your bag is empty.</p>
          <p className="mt-3 max-w-xs text-sm text-slate">
            Not sure where to begin? A few questions and we’ll suggest a routine.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => {
                close();
                setQuizOpen(true);
              }}
            >
              Find your routine
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                close();
                navigate("/shop");
              }}
            >
              Shop bestsellers
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Free shipping progress */}
          <div className="border-b border-line px-6 py-4">
            <p className="text-xs">
              {remaining > 0 ? (
                <>
                  You’re <strong className="font-medium tabular-nums">{kr(remaining)}</strong> away from free shipping
                </>
              ) : (
                <>You’ve unlocked free shipping within Norway</>
              )}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-mist">
              <div
                className={cx("h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-soft)]", remaining > 0 ? "bg-ink" : "bg-fire")}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-line px-6">
              {lines.map(({ product: p, qty }) => {
                const fresh = lastAdded?.ids.includes(p.id) && Date.now() - lastAdded.at < 4000;
                return (
                  <li key={p.id} className={cx("flex gap-4 py-5", fresh && "animate-fade-up")}>
                    <img src={img(p.image, 200)} alt="" className="size-24 shrink-0 bg-mist object-contain p-1 mix-blend-multiply" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="label text-[9px] text-slate">{p.brand}</p>
                          <Link to={productPath(p.id)} onClick={close} className="mt-1.5 block text-sm leading-snug hover:underline">
                            {p.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-slate">{p.size}</p>
                        </div>
                        <button onClick={() => remove(p.id)} className="-mt-1 -mr-1 grid size-7 shrink-0 place-items-center text-slate hover:text-ink" aria-label={`Remove ${p.name}`}>
                          <X className="size-3.5" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex h-8 items-center rounded-full border border-line">
                          <button onClick={() => setQty(p.id, qty - 1)} className="grid size-8 place-items-center" aria-label="Decrease quantity">
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-xs tabular-nums" aria-live="polite">
                            {qty}
                          </span>
                          <button onClick={() => setQty(p.id, qty + 1)} className="grid size-8 place-items-center" aria-label="Increase quantity">
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <p className="text-sm tabular-nums">{kr(p.price * qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {suggestions.length > 0 && (
              <div className="mt-2 bg-mist px-6 py-6">
                <p className="label text-[10px] text-slate">Complete your routine</p>
                <ul className="mt-4 grid grid-cols-1 gap-3">
                  {suggestions.map((p) => (
                    <li key={p.id} className="flex items-center gap-3">
                      <img src={img(p.image, 120)} alt="" className="size-14 shrink-0 bg-paper object-contain p-1 mix-blend-multiply" />
                      <div className="min-w-0 flex-1">
                        <Link to={productPath(p.id)} onClick={close} className="block truncate text-sm hover:underline">
                          {p.name}
                        </Link>
                        <p className="text-xs text-slate tabular-nums">{kr(p.price)}</p>
                      </div>
                      <button onClick={() => add(p.id)} className="h-8 rounded-full border border-ink/20 px-3 text-xs hover:bg-ink hover:text-paper">
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="border-t border-line px-6 pt-5 pb-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="font-serif text-2xl font-light tabular-nums">{kr(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-slate">
              Shipping {remaining > 0 ? `${kr(SHIPPING_COST)} (free over ${kr(FREE_SHIPPING_THRESHOLD)})` : "is free"} · Ships from
              Oslo in {DISPATCH_TIME}
            </p>
            <Button as="a" href={checkoutUrl} target="_blank" rel="noreferrer" className="mt-5 w-full">
              <Lock className="size-3.5" strokeWidth={1.75} /> Checkout
            </Button>
          </div>
        </>
      )}
    </Overlay>
  );
}
