import { useState } from "react";
import { Link, NavLink, useParams } from "react-router";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import { img } from "@/data/catalog";
import { routineBySlug, routinePath, routineTotal, routines, defaultPicks, type Routine } from "@/data/routines";
import { useStore } from "@/lib/store";
import { useTitle } from "@/lib/nav";
import { Button, Reveal, SectionLabel, cx, kr, scrollToId } from "@/lib/ui";
import { RoutineSummary, StepOptions, useRoutinePicks } from "@/components/RoutinePicker";
import { NotFound } from "./NotFound";

export function RoutinePage() {
  const { slug } = useParams();
  const routine = slug ? routineBySlug[slug] : undefined;
  if (!routine) return <NotFound />;
  return <RoutineView key={routine.id} routine={routine} />;
}

/** "The Barrier Reset" → ["The Barrier", "Reset"] so the last word can go italic. */
function splitName(name: string) {
  const words = name.split(" ");
  return [words.slice(0, -1).join(" "), words.at(-1)!];
}

function RoutineView({ routine }: { routine: Routine }) {
  const { add } = useStore();
  const { picks, setPick, chosen, total } = useRoutinePicks(routine);
  const [loaded, setLoaded] = useState(false);
  const index = routines.indexOf(routine);
  const next = routines[(index + 1) % routines.length];
  const others = routines.filter((r) => r.id !== routine.id);
  const [lead, last] = splitName(routine.name);
  const required = routine.steps.filter((s) => !s.optional).length;

  useTitle(`${routine.name} — ${routine.focus} | Renew Seoul`);

  return (
    <>
      {/* Hero */}
      <section data-header-theme="dark" className="relative h-[88svh] min-h-[620px] overflow-hidden bg-ink text-white">
        <img
          src={img(routine.image, 2000)}
          alt=""
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          className={cx(
            "absolute inset-0 size-full object-cover transition-[opacity,transform] ease-[var(--ease-out-soft)] [transition-duration:1.2s,8s]",
            loaded ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/40" />
        <p
          lang="ko"
          aria-hidden
          className="absolute top-28 right-4 font-kr text-[clamp(5rem,14vw,13rem)] leading-none text-white/80 mix-blend-overlay md:right-8 xl:right-12"
        >
          {routine.korean}
        </p>

        <div className="absolute inset-0">
          <div className="container-x flex h-full flex-col justify-end pb-10 md:pb-14">
            <p className="label animate-fade-up opacity-80">
              Routine {String(index + 1).padStart(2, "0")} / {String(routines.length).padStart(2, "0")}
            </p>
            <h1 className="display mt-5 animate-fade-up text-[clamp(3.25rem,10vw,9rem)] [animation-delay:150ms]">
              {lead} <em>{last}</em>
            </h1>
            <div className="mt-8 grid animate-fade-up items-end gap-8 border-t border-white/20 pt-6 md:grid-cols-12 [animation-delay:350ms]">
              <p className="font-serif text-2xl leading-snug font-light italic text-white/90 md:col-span-6 md:text-3xl">
                {routine.question}
              </p>
              <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
                <Button variant="light" onClick={() => add(defaultPicks(routine))}>
                  Add routine · {kr(routineTotal(routine))}
                  <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
                <Button variant="ghost" onClick={() => scrollToId("choose")}>
                  <ArrowDown className="size-4" strokeWidth={1.5} /> Choose your products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Routine switcher */}
      <nav
        aria-label="Routines"
        className="sticky top-16 z-30 border-b border-line bg-paper/90 backdrop-blur-xl"
      >
        <div className="container-x no-scrollbar flex gap-2 overflow-x-auto py-3">
          {routines.map((r) => (
            <NavLink
              key={r.id}
              to={routinePath(r)}
              className={({ isActive }) =>
                cx(
                  "flex h-9 shrink-0 items-center rounded-full border px-4 text-[13px] transition-colors",
                  isActive ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/40",
                )
              }
            >
              {r.name.replace("The ", "")}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* What is it */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <SectionLabel korean="루틴" className="text-slate">
              What is it?
            </SectionLabel>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-line md:grid-cols-1">
              <div className="bg-paper py-4 md:pr-6">
                <dt className="label text-[10px] text-slate">Steps</dt>
                <dd className="mt-2 font-serif text-3xl font-light tabular-nums">
                  {required}
                  {required !== routine.steps.length && (
                    <span className="ml-2 text-sm text-slate">+{routine.steps.length - required} optional</span>
                  )}
                </dd>
              </div>
              <div className="bg-paper py-4 pl-4 md:pl-0">
                <dt className="label text-[10px] text-slate">From</dt>
                <dd className="mt-2 font-serif text-3xl font-light tabular-nums">{kr(routineTotal(routine))}</dd>
              </div>
              <div className="col-span-2 bg-paper py-4 md:col-span-1">
                <dt className="label text-[10px] text-slate">Focus</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {routine.focus.split(", ").map((f) => (
                    <span key={f} className="rounded-full border border-line px-3 py-1.5 text-xs first-letter:uppercase">
                      {f}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
          <div className="md:col-span-8">
            {/* React Bits · BlurText — the summary resolves word by word as it scrolls in. */}
            <BlurText
              text={routine.summary}
              animateBy="words"
              delay={28}
              stepDuration={0.4}
              blur={8}
              distance={12}
              threshold={0.3}
              className="display text-[clamp(1.875rem,3.4vw,3.25rem)] leading-[1.12] text-balance"
            />
            {routine.note && (
              <Reveal delay={200} className="mt-10 max-w-xl border-l-2 border-fire pl-5">
                <p className="label text-[10px] text-fire">Good to know</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{routine.note}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Steps + picker */}
      <section id="choose" className="scroll-mt-32 border-t border-line pt-20 pb-0 md:pt-28 lg:pb-28">
        <div className="container-x">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel korean="단계" className="text-slate">
                Step by step
              </SectionLabel>
              <h2 className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
                Choose one <em>for each step.</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate">
              We’ve picked a starting point. Swap any step for the formula that suits your skin.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px]">
            <ol className="grid gap-16">
              {routine.steps.map((s, i) => (
                <li key={s.title} className="grid gap-6 md:grid-cols-[7rem_1fr]">
                  <div className="flex items-baseline gap-4 md:block">
                    <p className="font-serif text-6xl font-extralight tabular-nums md:text-7xl">0{i + 1}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-line pb-4">
                      <h3 className="font-serif text-3xl font-light">{s.title}</h3>
                      {s.optional && <span className="label rounded-full bg-mist px-2.5 py-1.5 text-[9px] text-slate">Optional</span>}
                      <p className="w-full text-sm text-slate">{s.why}</p>
                    </div>
                    <StepOptions routine={routine} index={i} picks={picks} onPick={setPick} compactLegend />
                  </div>
                </li>
              ))}
            </ol>
            <aside className="hidden lg:sticky lg:top-36 lg:block lg:self-start">
              <RoutineSummary routine={routine} picks={picks} total={total} onAdd={() => add(chosen)} />
            </aside>
          </div>
        </div>

        {/* Phone/tablet: sticky total */}
        <div className="sticky bottom-0 z-20 mt-16 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate">
                {chosen.length} products · {routine.name.replace("The ", "")}
              </p>
              <p className="font-serif text-2xl font-light tabular-nums">{kr(total)}</p>
            </div>
            <Button onClick={() => add(chosen)} disabled={!chosen.length}>
              Add routine
            </Button>
          </div>
        </div>
      </section>

      {/* Other routines */}
      <section className="bg-mist py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionLabel className="text-slate">Other routines</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
              Different skin, <em>different needs.</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <Link to={routinePath(r)} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-fog">
                    <img
                      src={img(r.image, 800)}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-105"
                    />
                    <span lang="ko" aria-hidden className="absolute top-4 left-4 font-kr text-4xl text-white/85 mix-blend-overlay">
                      {r.korean}
                    </span>
                  </div>
                  <p className="mt-4 font-serif text-2xl font-light">{r.name}</p>
                  <p className="mt-1 text-xs text-slate">{r.focus}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Next routine */}
      <Link to={routinePath(next)} data-header-theme="dark" className="group relative block overflow-hidden bg-ink text-paper">
        <img
          src={img(next.image, 1600)}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-30 transition-[opacity,transform] duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-105 group-hover:opacity-45"
        />
        <div className="container-x relative flex items-end justify-between gap-6 py-20 md:py-28">
          <div>
            <p className="label text-paper/60">Next routine</p>
            <p className="display mt-5 text-[clamp(2.75rem,8vw,7.5rem)]">{next.name}</p>
            <p className="mt-3 text-sm text-paper/60">{next.focus}</p>
          </div>
          <span className="grid size-14 shrink-0 place-items-center rounded-full border border-white/40 transition-colors group-hover:bg-paper group-hover:text-ink md:size-20">
            <ArrowUpRight className="size-6" strokeWidth={1.25} />
          </span>
        </div>
      </Link>
    </>
  );
}
