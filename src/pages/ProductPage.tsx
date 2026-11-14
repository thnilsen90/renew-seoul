import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowUpRight, Check, ChevronDown, Minus, Plus, RotateCcw, Truck } from "lucide-react";
import {
  CONTACT_EMAIL,
  DISPATCH_TIME,
  FREE_SHIPPING_THRESHOLD,
  RETURN_DAYS,
  RETURN_POLICY_URL,
  SHIPPING_COST,
  SHIPPING_POLICY_URL,
  filterForStep,
  howTo,
  img,
  srcSet,
  stepById,
  steps,
} from "@/data/catalog";
import { AssuranceInline } from "@/components/Assurance";
import { productById, products, type Product } from "@/data/products";
import { routinePath, routinesForProduct } from "@/data/routines";
import { useStore } from "@/lib/store";
import { useTitle } from "@/lib/nav";
import { shopPath } from "@/data/shop";
import { Button, Reveal, SectionLabel, cx, kr } from "@/lib/ui";
import { ProductCard } from "@/components/ProductCard";
import { NotFound } from "./NotFound";

export function ProductPage() {
  const { handle } = useParams();
  const product = handle ? productById[handle] : undefined;
  if (!product) return <NotFound />;
  return <ProductView key={product.id} product={product} />;
}

const ESSENTIAL_STEPS = ["cleanser", "moisturiser", "sunscreen", "toner", "serum"];

/** Other steps from the routines this product belongs to, then essentials it doesn't cover. */
function pairsFor(p: Product): Product[] {
  const out = new Map<string, Product>();
  for (const r of routinesForProduct(p.id)) {
    for (const s of r.steps) {
      const cand = productById[s.options[0]];
      if (cand.step !== p.step && !out.has(cand.id)) out.set(cand.id, cand);
    }
  }
  for (const step of ESSENTIAL_STEPS) {
    if (out.size >= 4) break;
    if (step === p.step || [...out.values()].some((x) => x.step === step)) continue;
    const cand = products.find((x) => x.step === step && x.bestseller) ?? products.find((x) => x.step === step);
    if (cand) out.set(cand.id, cand);
  }
  return [...out.values()].slice(0, 4);
}

function ProductView({ product: p }: { product: Product }) {
  const { add, subtotal } = useStore();
  const step = stepById[p.step];
  const inRoutines = routinesForProduct(p.id);
  const pairs = useMemo(() => pairsFor(p), [p]);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const buyRef = useRef<HTMLDivElement>(null);
  const [buyVisible, setBuyVisible] = useState(true);

  useTitle(`${p.name} — ${p.brand} | Renew Seoul`);

  // Show the phone sticky bar once the main add button has scrolled above the viewport.
  // (A scroll check rather than IntersectionObserver: fast flings can jump past the button
  // without ever "crossing" an edge, so the observer would never fire.)
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = buyRef.current;
      if (el) setBuyVisible(el.getBoundingClientRect().bottom > 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const after = subtotal + p.price * qty;
  const toFree = Math.max(0, FREE_SHIPPING_THRESHOLD - after);
  const title = p.name;

  const gallery: { src: string; kind: "pack" | "life" }[] = [
    { src: p.image, kind: "pack" },
    ...(p.image2 ? [{ src: p.image2, kind: "life" as const }] : []),
  ];

  return (
    <>
      <div className="pt-24 md:pt-28">
        <div className="container-x">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-hidden text-xs text-slate">
            <Link to="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link to={shopPath({ step: filterForStep(p.step) })} className="whitespace-nowrap hover:text-ink">
              {step.label}
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate text-ink" aria-current="page">
              {p.brand} {title}
            </span>
          </nav>

          <div className="mt-6 grid gap-10 md:grid-cols-12 lg:gap-16">
            {/* Gallery: swipeable on phones, stacked on larger screens */}
            <div className="md:col-span-7">
              <div
                className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto md:mx-0 md:grid md:gap-3 md:overflow-visible"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  setSlide(Math.round(el.scrollLeft / el.clientWidth));
                }}
              >
                {gallery.map((g, i) => (
                  <div key={g.src} className="relative aspect-[4/5] w-full shrink-0 snap-start overflow-hidden bg-mist">
                    <img
                      src={img(g.src, 1200)}
                      srcSet={srcSet(g.src, [700, 1000, 1400, 1800])}
                      sizes="(min-width: 768px) 58vw, 100vw"
                      alt={i === 0 ? `${p.brand}, ${p.name}` : ""}
                      fetchPriority={i === 0 ? "high" : undefined}
                      className={cx(
                        "absolute inset-0 size-full",
                        g.kind === "pack" ? "object-contain p-[12%] mix-blend-multiply" : "object-cover",
                      )}
                    />
                  </div>
                ))}
                {/* Typographic tile — gives single-image products the same rhythm */}
                <div className="relative hidden aspect-[4/5] w-full shrink-0 snap-start flex-col justify-between overflow-hidden bg-sky p-8 md:flex lg:p-12">
                  <span className="label text-ink/50">
                    {step.number ? `Step 0${step.number} · ${step.label}` : step.label}
                  </span>
                  {p.does && (
                    <p className="display text-[clamp(2rem,3.4vw,3.5rem)] leading-[1.02]">
                      Made to {p.does}.
                    </p>
                  )}
                  <span className="font-serif text-[9rem] leading-none font-extralight text-ink/10 tabular-nums">
                    {step.number ? `0${step.number}` : "+"}
                  </span>
                </div>
              </div>
              {gallery.length > 1 && (
                <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
                  {gallery.map((g, i) => (
                    <span key={g.src} className={cx("h-1 rounded-full transition-all", i === slide ? "w-6 bg-ink" : "w-1.5 bg-ink/20")} />
                  ))}
                </div>
              )}
            </div>

            {/* Buy box */}
            <div className="md:col-span-5">
              <div className="md:sticky md:top-24">
                <div className="flex items-center gap-3">
                  <p className="label text-slate">{p.brand}</p>
                  {p.bestseller && (
                    <span className="label rounded-full bg-ink px-2.5 py-1.5 text-[9px] text-paper">Bestseller</span>
                  )}
                </div>
                <h1 className="display mt-4 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1.02] text-balance">{title}</h1>
                <p className="mt-4 flex items-baseline gap-3 text-sm text-slate">
                  <span className="font-serif text-2xl font-light text-ink tabular-nums">{kr(p.price)}</span>
                  <span>{p.size}</span>
                </p>

                <p className="mt-6 text-[15px] leading-relaxed">{p.description}</p>

                {p.goodFor && (
                  <div className="mt-6 flex gap-3 rounded-sm bg-mist p-4">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-paper">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium">Choose it if </span>
                      {p.goodFor}.
                    </p>
                  </div>
                )}

                <div ref={buyRef} className="mt-8 flex gap-3">
                  <div className="flex h-12 items-center rounded-full border border-line">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-12 place-items-center" aria-label="Decrease quantity">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                      {qty}
                    </span>
                    <button onClick={() => setQty((q) => Math.min(20, q + 1))} className="grid size-12 place-items-center" aria-label="Increase quantity">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <Button className="flex-1" onClick={() => add(p.id, qty)}>
                    Add to bag · {kr(p.price * qty)}
                  </Button>
                </div>

                <p className="mt-4 flex items-center gap-2 text-xs text-slate">
                  <Truck className="size-3.5 shrink-0" strokeWidth={1.5} />
                  {toFree > 0 ? (
                    <span>
                      Add <span className="text-ink tabular-nums">{kr(toFree)}</span> more for free shipping in Norway
                    </span>
                  ) : (
                    <span className="text-ink">This order ships free within Norway</span>
                  )}
                </p>
                <AssuranceInline className="mt-3" />

                <div className="mt-8 border-t border-line">
                  {p.ingredients.length > 0 && (
                    <Accordion title="Key ingredients" defaultOpen>
                      <ul className="flex flex-wrap gap-2">
                        {p.ingredients.map((x) => (
                          <li key={x} className="rounded-full border border-line px-3 py-1.5 text-xs first-letter:uppercase">
                            {x}
                          </li>
                        ))}
                      </ul>
                    </Accordion>
                  )}
                  <Accordion title="How to use">
                    <ol className="grid gap-3">
                      {howTo[p.step].map((h, i) => (
                        <li key={h.title} className="flex gap-3 text-sm leading-relaxed">
                          <span className="text-xs text-slate tabular-nums">0{i + 1}</span>
                          <span>
                            <span className="font-medium">{h.title}.</span> <span className="text-ink/70">{h.body}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </Accordion>
                  <Accordion title="Delivery & returns">
                    <ul className="grid gap-3 text-sm leading-relaxed text-ink/70">
                      <li className="flex gap-2">
                        <Truck className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                        <span>
                          Shipping within Norway: {kr(SHIPPING_COST)}, free over {kr(FREE_SHIPPING_THRESHOLD)}. Orders
                          are packed in Oslo and leave within {DISPATCH_TIME}.{" "}
                          <a className="underline" href={SHIPPING_POLICY_URL} target="_blank" rel="noreferrer">
                            Shipping policy
                          </a>
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <RotateCcw className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                        <span>
                          Return unopened products within {RETURN_DAYS} days — email{" "}
                          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
                            {CONTACT_EMAIL}
                          </a>{" "}
                          first. Return shipping is paid by the customer.{" "}
                          <a className="underline" href={RETURN_POLICY_URL} target="_blank" rel="noreferrer">
                            Return policy
                          </a>
                        </span>
                      </li>
                    </ul>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Where it fits */}
      <section className="mt-24 bg-mist py-20 md:mt-32 md:py-28">
        <div className="container-x">
          <Reveal className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <SectionLabel korean="단계" className="text-slate">
                Where it fits
              </SectionLabel>
              <h2 className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
                {step.number ? (
                  <>
                    Step {step.number} <em>of seven.</em>
                  </>
                ) : (
                  <>
                    A weekly <em>extra.</em>
                  </>
                )}
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-slate md:col-span-5">{step.what}</p>
          </Reveal>

          <ol className="mt-12 grid grid-cols-7 gap-1 md:gap-2" aria-label="The seven steps">
            {steps.map((s) => {
              const here = s.id === p.step;
              return (
                <li key={s.id}>
                  <div
                    className={cx(
                      "flex h-full flex-col justify-between rounded-sm p-2 transition-colors md:min-h-36 md:p-4",
                      here ? "bg-ink text-paper" : "bg-paper/60 text-ink/50",
                    )}
                    aria-current={here ? "step" : undefined}
                  >
                    <span className="font-serif text-lg font-light tabular-nums md:text-3xl">0{s.number}</span>
                    <span className="mt-6 hidden text-xs leading-snug md:block">{s.label}</span>
                    {s.essential && (
                      <span className={cx("mt-2 size-1.5 rounded-full md:mt-3", here ? "bg-fire" : "bg-fire/60")} title="Essential" />
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate">
            <span className="size-1.5 rounded-full bg-fire" /> Essential steps — everything else is optional.
          </p>
        </div>
      </section>

      {/* How to use — three numbered columns */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionLabel className="text-slate">How to use</SectionLabel>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
            {howTo[p.step].map((h, i) => (
              <Reveal key={h.title} delay={i * 100} className="border-t border-ink pt-6">
                <p className="font-serif text-6xl font-extralight tabular-nums">0{i + 1}</p>
                <p className="label mt-6">{h.title}</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate">{h.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Routines it belongs to */}
      {inRoutines.length > 0 && (
        <section data-header-theme="dark" className="bg-ink py-20 text-paper md:py-28">
          <div className="container-x">
            <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <SectionLabel korean="루틴" className="text-paper/60">
                  Found in {inRoutines.length === 1 ? "this routine" : `${inRoutines.length} routines`}
                </SectionLabel>
                <h2 className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
                  Better <em>together.</em>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-paper/60">
                Every product here earns its place in at least one routine. See where this one fits.
              </p>
            </Reveal>
            <div className={cx("mt-12 grid gap-4 sm:grid-cols-2", inRoutines.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
              {inRoutines.map((r, i) => (
                <Reveal key={r.id} delay={i * 80}>
                  <Link to={routinePath(r)} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft">
                      <img
                        src={img(r.image, 800)}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover opacity-90 transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-105"
                      />
                      <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-white/40 transition-colors group-hover:bg-paper group-hover:text-ink">
                        <ArrowUpRight className="size-4" strokeWidth={1.5} />
                      </span>
                    </div>
                    <p className="mt-4 font-serif text-2xl font-light">{r.name}</p>
                    <p className="mt-1 text-xs text-paper/50">{r.focus}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pairs well with */}
      {pairs.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <Reveal>
              <SectionLabel className="text-slate">Pairs well with</SectionLabel>
              <h2 className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
                Complete <em>the routine.</em>
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 lg:grid-cols-4">
              {pairs.map((x) => (
                <ProductCard key={x.id} product={x} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Phone: sticky add-to-bag once the main button scrolls away */}
      <div
        className={cx(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-out-soft)] md:hidden",
          buyVisible ? "translate-y-full" : "translate-y-0",
        )}
        aria-hidden={buyVisible}
      >
        <div className="flex items-center gap-3">
          <img src={img(p.image, 120)} alt="" className="size-11 shrink-0 bg-mist object-contain mix-blend-multiply" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{p.name}</p>
            <p className="text-xs text-slate tabular-nums">{kr(p.price)}</p>
          </div>
          <Button className="h-11 px-5" onClick={() => add(p.id, qty)} tabIndex={buyVisible ? -1 : 0}>
            Add
          </Button>
        </div>
      </div>
    </>
  );
}

function Accordion({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}
