import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, RotateCcw, X } from "lucide-react";
import { img } from "@/data/catalog";
import { productById, type StepId } from "@/data/products";
import { routineById, routinePath, type Routine } from "@/data/routines";
import { useStore } from "@/lib/store";
import { Button, cx, kr } from "@/lib/ui";
import { Overlay } from "./Overlay";

type Answer = string;

const questions: {
  id: string;
  title: string;
  hint: string;
  options: { value: Answer; label: string; sub?: string }[];
}[] = [
  {
    id: "focus",
    title: "What would you most like to change?",
    hint: "Pick the one that matters most right now — one focus at a time works best.",
    options: [
      { value: "barrier", label: "Tight, red or reactive skin", sub: "It feels uncomfortable more often than not" },
      { value: "pore", label: "Shine, clogged pores or texture", sub: "Bumps, congestion, oil by lunchtime" },
      { value: "glow", label: "Dullness", sub: "It looks flat or tired" },
      { value: "dark-spot", label: "Dark spots or uneven tone", sub: "Post-blemish marks, sun spots" },
      { value: "essential", label: "Nothing in particular", sub: "I just want a simple routine that works" },
    ],
  },
  {
    id: "type",
    title: "By midday, your skin feels…",
    hint: "This tunes your moisturiser and sunscreen.",
    options: [
      { value: "dry", label: "Tight or dry" },
      { value: "combo", label: "Shiny in the T-zone, normal elsewhere" },
      { value: "oily", label: "Oily all over" },
      { value: "normal", label: "Comfortable" },
    ],
  },
  {
    id: "irritated",
    title: "Is anything stinging, flaking or irritated right now?",
    hint: "Honest answers only — this changes what we recommend.",
    options: [
      { value: "yes", label: "Yes, a little" },
      { value: "no", label: "No, it feels calm" },
    ],
  },
  {
    id: "steps",
    title: "How many steps will you realistically keep up?",
    hint: "The best routine is the one you actually do.",
    options: [
      { value: "3", label: "Three. Keep it simple.", sub: "Cleanse, moisturise, protect" },
      { value: "5", label: "Four or five is fine", sub: "Add a targeted step or two" },
    ],
  },
];

const PREF: Partial<Record<StepId, Record<string, string[]>>> = {
  moisturiser: {
    dry: ["extreme-cream-50ml", "birch-juice-moisturizing-cream", "soon-jung-hydro-barrier-cream"],
    combo: ["extreme-cream-light", "birch-juice-moisturizing-cream"],
    oily: ["no-1-pantothenic-b5-active-soothing-cream", "extreme-cream-light"],
  },
  sunscreen: {
    dry: ["birch-juice-moisturizing-sun-cream-spf50-pa-50ml", "aqua-glowing-sunscreen-45ml"],
    combo: ["green-tea-fresh-sunscreen-spf50-pa-45ml"],
    oily: ["green-tea-fresh-sunscreen-spf50-pa-45ml"],
  },
};

function recommend(a: Record<string, Answer>): { routine: Routine; picks: string[]; reason: string } {
  let id = a.focus;
  let reason = "";
  if (a.irritated === "yes" && id !== "essential" && id !== "barrier") {
    reason = "Because your skin is irritated right now, we’d calm it first — targeted actives work best on comfortable skin.";
    id = "barrier";
  }
  const routine = routineById[id];
  const simple = a.steps === "3";
  const picks: string[] = [];
  for (const s of routine.steps) {
    if (s.optional) continue;
    const step = productById[s.options[0]].step;
    if (simple && !["cleanser", "moisturiser", "sunscreen"].includes(step)) continue;
    const prefs = PREF[step]?.[a.type] ?? [];
    const pick = prefs.find((p) => s.options.includes(p)) ?? s.options[0];
    picks.push(pick);
  }
  if (!reason) {
    reason = {
      barrier: "Gentle, soothing and barrier-first — no aggressive actives while your skin recovers.",
      pore: "Clarifying without stripping, with lightweight hydration that won’t clog.",
      glow: "Radiance through hydration and gentle actives, not harsh exfoliation.",
      "dark-spot": "Focused brightening plus the non-negotiable: daily SPF.",
      essential: "Three fundamentals, chosen for how your skin feels by midday.",
    }[id]!;
  }
  return { routine, picks, reason };
}

export function Quiz() {
  const { quizOpen, setQuizOpen, add, setRoutineId } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  useEffect(() => {
    if (quizOpen) {
      setStep(0);
      setAnswers({});
    }
  }, [quizOpen]);

  const done = step >= questions.length;
  const result = useMemo(() => (done ? recommend(answers) : null), [done, answers]);
  const total = result?.picks.reduce((n, id) => n + productById[id].price, 0) ?? 0;
  const close = () => setQuizOpen(false);
  const q = questions[Math.min(step, questions.length - 1)];

  return (
    <Overlay open={quizOpen} onClose={close} label="Routine finder">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
        <div className="flex items-center gap-4">
          {step > 0 && !done && (
            <button onClick={() => setStep((s) => s - 1)} className="-ml-2 grid size-9 place-items-center" aria-label="Previous question">
              <ArrowLeft className="size-4" />
            </button>
          )}
          <p className="label text-slate">Routine finder</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden gap-1.5 sm:flex" aria-hidden>
            {questions.map((_, i) => (
              <span key={i} className={cx("h-1 w-8 rounded-full transition-colors duration-500", i < step || done ? "bg-ink" : i === step ? "bg-ink/40" : "bg-line")} />
            ))}
          </div>
          <button onClick={close} className="-mr-2 grid size-10 place-items-center" aria-label="Close routine finder" data-autofocus>
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!done ? (
          <div key={q.id} className="mx-auto max-w-2xl animate-fade-up px-6 py-10 md:py-16">
            <p className="text-xs text-slate tabular-nums">
              {step + 1} of {questions.length}
            </p>
            <h2 className="display mt-4 text-4xl leading-[1.05] md:text-5xl">{q.title}</h2>
            <p className="mt-3 text-sm text-slate">{q.hint}</p>
            <div className="mt-8 grid gap-2" role="radiogroup" aria-label={q.title}>
              {q.options.map((o) => {
                const selected = answers[q.id] === o.value;
                return (
                  <button
                    key={o.value}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [q.id]: o.value }));
                      setTimeout(() => setStep((s) => s + 1), 180);
                    }}
                    className={cx(
                      "group flex items-center justify-between gap-4 rounded-sm border px-5 py-4 text-left transition-all duration-300",
                      selected ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/40 hover:bg-white",
                    )}
                  >
                    <span>
                      <span className="block text-[15px]">{o.label}</span>
                      {o.sub && <span className={cx("mt-1 block text-xs", selected ? "text-paper/60" : "text-slate")}>{o.sub}</span>}
                    </span>
                    <ArrowRight className="size-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          result && (
            <div className="grid animate-fade-up md:grid-cols-[1fr_1.1fr]">
              <div className="relative min-h-[260px] bg-ink md:min-h-[560px]">
                <img src={img(result.routine.image, 1200)} alt="" className="absolute inset-0 size-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 text-paper">
                  <p className="label opacity-70">Your match</p>
                  <p className="display mt-3 text-5xl">{result.routine.name}</p>
                  <p className="mt-2 text-sm text-paper/70">{result.routine.focus}</p>
                </div>
              </div>
              <div className="p-6 md:p-10">
                <p className="text-[15px] leading-relaxed">{result.reason}</p>
                <ol className="mt-8 grid grid-cols-1 gap-3">
                  {result.picks.map((id, i) => {
                    const p = productById[id];
                    return (
                      <li key={id} className="flex items-center gap-4 border-b border-line pb-3">
                        <span className="w-5 text-xs text-slate tabular-nums">0{i + 1}</span>
                        <img src={img(p.image, 140)} alt="" className="size-14 shrink-0 bg-mist object-contain p-1 mix-blend-multiply" />
                        <span className="min-w-0 flex-1">
                          <span className="label block text-[9px] text-slate">{p.brand}</span>
                          <span className="mt-1 block truncate text-sm">{p.name}</span>
                        </span>
                        <span className="text-sm tabular-nums">{kr(p.price)}</span>
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      close();
                      add(result.picks);
                    }}
                  >
                    Add all · {kr(total)}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRoutineId(result.routine.id);
                      close();
                      navigate(routinePath(result.routine));
                    }}
                  >
                    See the routine
                  </Button>
                </div>
                <button onClick={() => { setStep(0); setAnswers({}); }} className="mt-6 inline-flex items-center gap-2 text-xs text-slate hover:text-ink">
                  <RotateCcw className="size-3.5" /> Start over
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </Overlay>
  );
}
