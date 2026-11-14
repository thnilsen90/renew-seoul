import { routines, routineById } from "@/data/routines";
import { useStore } from "@/lib/store";
import { Reveal, SectionLabel, cx } from "@/lib/ui";
import { RoutineSummary, StepOptions, useRoutinePicks } from "./RoutinePicker";

/** Pick one product per step, see the total, add the lot. */
export function RoutineBuilder() {
  const { routineId, setRoutineId, add } = useStore();
  const routine = routineById[routineId];
  const { picks, setPick, chosen, total } = useRoutinePicks(routine);

  return (
    <section id="builder" className="scroll-mt-16 py-20 md:py-32">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel korean="단계" className="text-slate">
              Build your own
            </SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.75rem,6vw,5.5rem)]">
              Your skin, <em>your essentials.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="md:col-span-5">
            <p className="max-w-md text-[15px] leading-relaxed text-slate">
              Start from a routine, then swap any step for the formula that suits you. Each option
              says who it’s for — no guesswork.
            </p>
          </Reveal>
        </div>

        {/* Routine tabs */}
        <div className="no-scrollbar -mx-4 mt-12 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist">
          {routines.map((r) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={r.id === routineId}
              onClick={() => setRoutineId(r.id)}
              className={cx(
                "h-10 shrink-0 rounded-full border px-5 text-sm transition-colors",
                r.id === routineId ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/40",
              )}
            >
              {r.name.replace("The ", "")}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-10">
            {routine.steps.map((s, i) => (
              <StepOptions key={`${routine.id}-${s.title}`} routine={routine} index={i} picks={picks} onPick={setPick} />
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <RoutineSummary routine={routine} picks={picks} total={total} onAdd={() => add(chosen)} showGuideLink />
          </aside>
        </div>
      </div>
    </section>
  );
}
