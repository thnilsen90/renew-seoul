import { Link } from "react-router";
import { img } from "@/data/catalog";
import { productById } from "@/data/products";
import { defaultPicks, routineById, routineTotal } from "@/data/routines";
import { productPath } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { Button, Reveal, SectionLabel, kr } from "@/lib/ui";

/** The classic ten-step routine, in order. */
const TEN: { id: string; name: string }[] = [
  { id: "1025-dokdo-cleansing-oil", name: "Oil cleanser" },
  { id: "soonjung-foam-cleanser-23ad-150ml", name: "Cleanser" },
  { id: "no-4-pore-zero-peeled-egg-toner-pad-190ml-70pads", name: "Exfoliator" },
  { id: "1025-dokdo-toner-200ml", name: "Toner" },
  { id: "no-4-hydrating-glow-mineral-toner-200ml", name: "Essence" },
  { id: "niacinamide-10-tranexamin-txa-acid-4-serum", name: "Serum" },
  { id: "refreshing-sea-kelp-real-deep-mask-1-box", name: "Sheet mask" },
  { id: "collagen-brightening-eye-gel-cream", name: "Eye cream" },
  { id: "soon-jung-hydro-barrier-cream", name: "Moisturiser" },
  { id: "birch-juice-moisturizing-sun-cream-spf50-pa-50ml", name: "Sunscreen" },
];

const LABELS = ["Cleanse", "Moisturise", "Protect"];

/**
 * "Before / after" comparison (after V7's pattern on Mobbin): the famous ten-step routine
 * beside the three essentials. Static — the contrast does the work.
 */
export function TenToThree() {
  const { add, setQuizOpen } = useStore();
  const essential = routineById.essential;
  const three = defaultPicks(essential);
  const tenTotal = TEN.reduce((n, t) => n + productById[t.id].price, 0);

  return (
    <section id="ten-to-three" className="scroll-mt-16 py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel korean="철학" className="text-slate">
              Our philosophy
            </SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.75rem,6vw,5.5rem)]">
              Ten steps? You probably <em>need three.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="md:col-span-5">
            <p className="max-w-md text-[15px] leading-relaxed text-slate">
              The Korean routine is famous for its steps. We see them as a menu, not a rulebook —
              start with the essentials, and add a step only when your skin asks for it.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {/* Before */}
          <Reveal className="flex flex-col rounded-2xl bg-mist p-5 md:p-8">
            <p className="flex items-center gap-2 text-xs text-slate">
              <span className="size-2 rounded-full border border-slate" /> The famous ten-step routine
            </p>
            <p className="mt-4 max-w-sm font-serif text-2xl leading-snug font-light text-ink/50 md:text-3xl">
              Ten products, two cleanses and a lot of guesswork.
            </p>
            <ol className="mt-8 grid grid-cols-5 gap-x-2 gap-y-5 md:gap-x-3">
              {TEN.map((t, i) => (
                <li key={t.id} className="text-center">
                  <div className="grid aspect-square place-items-center rounded-lg bg-paper p-[14%]">
                    <img
                      src={img(productById[t.id].image, 240)}
                      alt=""
                      loading="lazy"
                      className="size-full object-contain opacity-70 mix-blend-multiply grayscale"
                    />
                  </div>
                  <p className="mt-2 text-[9px] text-ink/35 tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-[10px] leading-tight text-ink/55 md:text-[11px]">{t.name}</p>
                </li>
              ))}
            </ol>
            <dl className="mt-auto flex gap-10 border-t border-ink/10 pt-5 text-ink/50">
              <Stat label="Products" value="10" />
              <Stat label="Together" value={kr(tenTotal)} />
            </dl>
          </Reveal>

          {/* After */}
          <Reveal delay={120} className="flex flex-col rounded-2xl bg-ink p-5 text-paper md:p-8">
            <p className="flex items-center gap-2 text-xs text-paper/60">
              <span className="size-2 rounded-full bg-fire" /> The Renew Seoul way
            </p>
            <p className="mt-4 max-w-sm font-serif text-2xl leading-snug font-light md:text-3xl">
              Three essentials, chosen for your skin.
            </p>
            <ol className="mt-8 grid grid-cols-3 gap-3 md:gap-4">
              {three.map((id, i) => {
                const p = productById[id];
                return (
                  <li key={id}>
                    <Link to={productPath(id)} className="group block">
                      <div className="grid aspect-square place-items-center rounded-xl bg-mist p-[14%]">
                        <img
                          src={img(p.image, 400)}
                          alt={`${p.brand}, ${p.name}`}
                          loading="lazy"
                          className="size-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-3 font-serif text-xl font-light md:text-2xl">{LABELS[i]}</p>
                      <p className="mt-0.5 truncate text-[11px] text-paper/55">{p.name}</p>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <dl className="mt-8 flex gap-10 border-t border-white/10 pt-5">
              <Stat label="Products" value="3" />
              <Stat label="Together" value={kr(routineTotal(essential))} />
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="light" onClick={() => add(three)}>
                Shop the Essential Routine
              </Button>
              <Button variant="ghost" onClick={() => setQuizOpen(true)}>
                Find your three
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label text-[10px] opacity-70">{label}</dt>
      <dd className="mt-2 font-serif text-3xl font-light tabular-nums">{value}</dd>
    </div>
  );
}
