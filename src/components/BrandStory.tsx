import { ArrowUpRight } from "lucide-react";
import { STORE_URL, brands, img } from "@/data/catalog";
import { Reveal, SectionLabel, Tiger } from "@/lib/ui";
import ScrollVelocity from "@/components/reactbits/ScrollVelocity";
import Stack from "@/components/reactbits/Stack";

/** Polaroid-style photos for the React Bits Stack. */
const snapshots = [
  { image: "RS_Skincare_6_1.png", caption: "Less, but better.", korean: "피부" },
  { image: "RS_Product_6_Real_Barrier_2.png", caption: "Real Barrier, Extreme Cream", korean: "장벽" },
  { image: "RS_Nature_3_3.png", caption: "Clear skies, clear routine.", korean: "모공" },
  { image: "RS_Texture_1_Face_mask_1.png", caption: "The Sunday sheet mask", korean: "광채" },
  { image: "RS_People_10_3.png", caption: "Three steps, every day.", korean: "기본" },
];

const principles = [
  {
    title: "Curated, not crowded",
    body: "A considered selection of formulas that deserve a place in a real routine — not endless shelves.",
  },
  {
    title: "Guided, not guessed",
    body: "We explain where each product belongs, what it does, and when you might not need it.",
  },
  {
    title: "Routines, not trends",
    body: "Built around skin needs. Established favourites and genuine discoveries, translated for life in Norway.",
  },
];

export function BrandStory() {
  return (
    <section id="about" className="relative overflow-hidden bg-sky py-20 md:py-32">
      <div className="container-x grid items-center gap-12 md:grid-cols-12">
        {/* React Bits · Stack — a pile of snapshots to drag, flick or tap through. */}
        <div className="relative md:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] sm:max-w-[380px]">
            <Stack
              layout="pile"
              spread={0.9}
              depth={0.4}
              visible={4}
              radius={6}
              frame={12}
              frameColor="#ffffff"
              tilt={18}
              sendToBackOnClick
              autoplay
              autoplayDelay={3800}
              pauseOnHover
              cards={snapshots.map((s, i) => (
                <figure key={s.image} className="flex size-full flex-col bg-white">
                  <div className="min-h-0 flex-1 overflow-hidden bg-mist">
                    <img src={img(s.image, 800)} alt="" loading="lazy" />
                  </div>
                  <figcaption className="flex h-14 shrink-0 items-center justify-between px-1 text-ink">
                    <span className="font-serif text-lg font-light italic">{s.caption}</span>
                    <span className="flex items-baseline gap-2 text-xs text-ink/40">
                      <span lang="ko" className="font-kr">
                        {s.korean}
                      </span>
                      <span className="tabular-nums">
                        {String(i + 1).padStart(2, "0")}/{String(snapshots.length).padStart(2, "0")}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            />
          </div>
          <p className="label mt-10 text-center text-[10px] text-ink/40">Drag or tap to flip through</p>
        </div>

        <div className="md:col-span-6 md:pl-8">
          <Reveal>
            <SectionLabel korean="소개" className="text-ink/60">
              About Renew Seoul
            </SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.75rem,6vw,5.5rem)]">
              From Seoul <em>to Oslo.</em>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/70">
              Korean skincare has never been more accessible — and choosing has never felt more
              complicated. Based in Oslo and inspired by Seoul, we do the searching, selecting and
              simplifying, so you can build a routine that makes sense for your skin.
            </p>
            <p className="mt-6 font-serif text-2xl font-light italic">Less noise. More intention.</p>
          </Reveal>

          <dl className="mt-12 border-t border-ink/15">
            {principles.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 100}
                className="grid gap-2 border-b border-ink/15 py-5 lg:grid-cols-[minmax(0,12rem)_1fr] lg:gap-6"
              >
                <dt className="font-serif text-xl leading-tight font-light">{p.title}</dt>
                <dd className="text-sm leading-relaxed text-ink/65">{p.body}</dd>
              </Reveal>
            ))}
          </dl>

          <a
            href={`${STORE_URL}/pages/about`}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-sm transition-colors hover:border-ink"
          >
            Read our story <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

/** React Bits · ScrollVelocity — the brand band drifts, then speeds up with your scroll. */
export function BrandMarquee() {
  const row = (
    <span className="inline-flex items-center gap-10 pr-10">
      {brands.map((b) => (
        <span key={b} className="inline-flex items-center gap-10">
          <span>{b}</span>
          <Tiger className="h-[0.42em] w-auto text-fire not-italic" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="border-y border-line bg-paper py-6" aria-label={`Brands we carry: ${brands.join(", ")}`}>
      <ScrollVelocity
        texts={[row]}
        velocity={28}
        numCopies={3}
        fadeEdges
        damping={60}
        stiffness={300}
        velocityMapping={{ input: [0, 1200], output: [0, 4] }}
        fontSize="clamp(1.875rem, 3.4vw, 2.75rem)"
        fontWeight={300}
        scrollerStyle={{ fontFamily: "var(--font-serif)", fontStyle: "italic", filter: "none", letterSpacing: "-0.01em" }}
      />
    </div>
  );
}
