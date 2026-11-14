import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { img } from "@/data/catalog";
import { productById } from "@/data/products";
import { defaultPicks, routinePath, routines, routineById } from "@/data/routines";
import { useStore } from "@/lib/store";
import { Button, Reveal, SectionLabel, cx, kr, scrollToId } from "@/lib/ui";

export function RoutineExplorer() {
  const { routineId, setRoutineId, add } = useStore();
  const routine = routineById[routineId];
  const [layers, setLayers] = useState({ current: routineId, previous: routineId });
  useEffect(() => {
    setLayers((l) => (l.current === routineId ? l : { current: routineId, previous: l.current }));
  }, [routineId]);
  const picks = defaultPicks(routine);
  const total = picks.reduce((n, id) => n + productById[id].price, 0);

  return (
    <section id="routines" data-header-theme="dark" className="relative overflow-hidden bg-ink text-paper">
      {/* Image stack — crossfades with the active routine */}
      <div className="relative aspect-[4/5] w-full overflow-hidden md:absolute md:inset-y-0 md:right-0 md:aspect-auto md:w-1/2">
        {routines.map((r) => {
          // The incoming image fades in *over* the outgoing one, which stays opaque
          // underneath — no see-through midpoint, no edge peeking past the gradient.
          const state = r.id === layers.current ? "current" : r.id === layers.previous ? "previous" : "idle";
          return (
            <img
              key={r.id}
              src={img(r.image, 1400)}
              alt=""
              loading="lazy"
              className={cx(
                "absolute inset-0 size-full object-cover",
                state === "current" &&
                  "z-10 scale-100 opacity-100 transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)]",
                state === "previous" && "z-0 scale-100 opacity-100",
                state === "idle" && "z-0 scale-[1.03] opacity-0",
              )}
            />
          );
        })}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink via-transparent to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/10" />
        <p
          lang="ko"
          className="absolute top-6 right-6 z-20 font-kr text-[clamp(4rem,9vw,8rem)] leading-none text-white/85 mix-blend-overlay"
        >
          {routine.korean}
        </p>
      </div>

      <div className="container-x relative py-16 md:min-h-[100svh] md:py-28">
        <div className="md:w-1/2 md:pr-12">
          <Reveal>
            <SectionLabel korean="루틴" className="text-paper/60">
              Routines
            </SectionLabel>
          </Reveal>

          {/* Routine list — Face Formula-style stacked serif */}
          <div
            role="tablist"
            aria-label="Routines"
            className="no-scrollbar -mx-4 mt-8 flex gap-6 overflow-x-auto px-4 md:mx-0 md:mt-12 md:block md:overflow-visible md:px-0"
          >
            {/* Click (or arrow keys) to choose — no hover-switching, so scrolling past the
                list to read never changes the selection. */}
            {routines.map((r, i) => {
              const active = r.id === routineId;
              return (
                <button
                  key={r.id}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={(e) => {
                    setRoutineId(r.id);
                    e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                  }}
                  onKeyDown={(e) => {
                    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                    if (!dir) return;
                    e.preventDefault();
                    const next = routines[(i + dir + routines.length) % routines.length];
                    setRoutineId(next.id);
                    const tabs = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]");
                    tabs?.[routines.indexOf(next)]?.focus();
                  }}
                  className={cx(
                    "group display flex shrink-0 cursor-pointer items-baseline gap-4 py-1 text-left text-[clamp(2rem,5.2vw,5.25rem)] whitespace-nowrap transition-colors duration-500",
                    active ? "text-paper" : "text-paper/30 hover:text-paper/70",
                  )}
                >
                  <span
                    className={cx(
                      "hidden font-sans text-xs tracking-normal tabular-nums transition-opacity md:inline",
                      active ? "opacity-60" : "opacity-0 group-hover:opacity-60",
                    )}
                  >
                    0{i + 1}
                  </span>
                  {active ? (
                    <span>
                      <span className="font-extralight">(</span>
                      <em>{r.name.replace("The ", "")}</em>
                      <span className="font-extralight">)</span>
                    </span>
                  ) : (
                    <span className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-2">
                      {r.name.replace("The ", "")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div key={routine.id} className="mt-10 max-w-xl animate-fade-up md:mt-14">
            <p className="font-serif text-2xl leading-snug font-light italic text-paper/90">
              {routine.question}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-paper/65">{routine.summary}</p>

            <ol className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-white/10">
              {routine.steps.map((s, i) => {
                const p = productById[s.options[0]];
                return (
                  <li key={s.title} className="flex items-center gap-4 bg-ink px-4 py-3">
                    <span className="w-6 text-xs text-paper/40 tabular-nums">0{i + 1}</span>
                    <img
                      src={img(p.image, 120)}
                      alt=""
                      className="size-10 shrink-0 rounded-sm bg-mist object-contain"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm">
                        {s.title}
                        {s.optional && <span className="ml-2 text-xs text-paper/40">optional</span>}
                      </span>
                      <span className="block truncate text-xs text-paper/50">
                        {p.brand} — {p.name}
                      </span>
                    </span>
                    <span className="text-xs text-paper/60 tabular-nums">{kr(p.price)}</span>
                  </li>
                );
              })}
            </ol>
            {routine.note && <p className="mt-4 text-xs leading-relaxed text-paper/45">{routine.note}</p>}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="light" onClick={() => add(picks)}>
                Add routine · {kr(total)}
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
              <Button variant="ghost" onClick={() => scrollToId("builder")}>
                <SlidersHorizontal className="size-4" strokeWidth={1.5} />
                Customise
              </Button>
            </div>
            <Link
              to={routinePath(routine)}
              className="mt-6 inline-flex items-center gap-1.5 border-b border-white/30 pb-1 text-sm text-paper/80 transition-colors hover:border-white hover:text-paper"
            >
              Read the full routine guide <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
