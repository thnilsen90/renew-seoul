import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Truck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, img } from "@/data/catalog";
import { productById } from "@/data/products";
import { routinePath, type Routine } from "@/data/routines";
import { productPath } from "@/lib/nav";
import { Button, cx, kr } from "@/lib/ui";

/** One pick per step; optional steps start skipped. Resets when the routine changes. */
export function useRoutinePicks(routine: Routine) {
  const initial = useMemo(() => routine.steps.map((s) => (s.optional ? null : s.options[0])), [routine]);
  const [picks, setPicks] = useState<(string | null)[]>(initial);
  useEffect(() => setPicks(initial), [initial]);

  const setPick = (step: number, id: string | null) =>
    setPicks((prev) => prev.map((x, i) => (i === step ? id : x)));
  const chosen = picks.filter((x): x is string => Boolean(x));
  const total = chosen.reduce((n, id) => n + productById[id].price, 0);
  return { picks, setPick, chosen, total };
}

export function StepOptions({
  routine,
  index,
  picks,
  onPick,
  compactLegend = false,
}: {
  routine: Routine;
  index: number;
  picks: (string | null)[];
  onPick: (step: number, id: string | null) => void;
  compactLegend?: boolean;
}) {
  const s = routine.steps[index];
  return (
    <fieldset className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      {!compactLegend && (
        <legend className="flex w-full items-baseline gap-4 border-b border-line pb-3">
          <span className="font-serif text-2xl font-light text-slate tabular-nums">0{index + 1}</span>
          <span className="font-serif text-2xl font-light">{s.title}</span>
          <span className="ml-auto hidden text-xs text-slate sm:block">{s.why}</span>
        </legend>
      )}
      {compactLegend && <legend className="sr-only">{s.title}</legend>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {s.optional && (
          <Option selected={picks[index] === null} onSelect={() => onPick(index, null)} label="Skip this step">
            <span className="grid size-16 shrink-0 place-items-center rounded-sm bg-mist text-xs text-slate">—</span>
            <span className="min-w-0">
              <span className="block text-sm">Skip this step</span>
              <span className="mt-1 block text-xs text-slate">Optional — add it when skin wants more.</span>
            </span>
          </Option>
        )}
        {s.options.map((id) => {
          const p = productById[id];
          return (
            <Option
              key={id}
              selected={picks[index] === id}
              onSelect={() => onPick(index, id)}
              label={`${p.brand} ${p.name}, ${kr(p.price)}`}
              href={productPath(id)}
            >
              <img
                src={img(p.image, 200)}
                alt=""
                loading="lazy"
                className="size-16 shrink-0 rounded-sm bg-mist object-contain p-1 mix-blend-multiply"
              />
              <span className="min-w-0">
                <span className="label block text-[9px] text-slate">{p.brand}</span>
                <span className="mt-1 block text-sm leading-snug">{p.name}</span>
                <span className="mt-1 block text-xs text-slate tabular-nums">
                  {kr(p.price)} · {p.size}
                </span>
                {p.goodFor && (
                  <span className="mt-2 line-clamp-2 block text-xs leading-relaxed text-ink/60">If {p.goodFor}.</span>
                )}
              </span>
            </Option>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Selectable card. The whole surface selects; a separate corner link opens the product page
 * (kept outside the button so the markup stays valid).
 */
function Option({
  selected,
  onSelect,
  label,
  href,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "relative rounded-sm border transition-all duration-300",
        selected ? "border-ink bg-white shadow-[0_1px_0_0_var(--color-ink)]" : "border-line hover:border-ink/30",
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={label}
        onClick={onSelect}
        className="absolute inset-0 z-0 rounded-sm"
      />
      <div className="pointer-events-none relative flex items-start gap-4 p-3 pr-10">{children}</div>
      <span
        aria-hidden
        className={cx(
          "pointer-events-none absolute top-3 right-3 grid size-5 place-items-center rounded-full border transition-colors",
          selected ? "border-ink bg-ink text-paper" : "border-line",
        )}
      >
        {selected && <Check className="size-3" strokeWidth={2.5} />}
      </span>
      {href && (
        <Link
          to={href}
          className="absolute right-2 bottom-2 z-10 grid size-7 place-items-center rounded-full text-slate transition-colors hover:bg-mist hover:text-ink"
          aria-label="View product details"
        >
          <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}

export function RoutineSummary({
  routine,
  picks,
  total,
  onAdd,
  showGuideLink = false,
}: {
  routine: Routine;
  picks: (string | null)[];
  total: number;
  onAdd: () => void;
  showGuideLink?: boolean;
}) {
  const count = picks.filter(Boolean).length;
  const freeShip = total >= FREE_SHIPPING_THRESHOLD;
  return (
    <div className="rounded-sm bg-ink p-6 text-paper">
      <p className="label text-paper/50">Your routine</p>
      <p className="mt-3 font-serif text-3xl font-light">{routine.name}</p>
      <ul className="mt-6 grid grid-cols-1 gap-3">
        {routine.steps.map((s, i) => {
          const id = picks[i];
          const p = id ? productById[id] : null;
          return (
            <li key={s.title} className="flex items-center gap-3 text-sm">
              <span className="w-5 text-xs text-paper/40 tabular-nums">0{i + 1}</span>
              {p ? (
                <>
                  <img src={img(p.image, 96)} alt="" className="size-9 rounded-sm bg-mist object-contain" />
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-paper/60 tabular-nums">{kr(p.price)}</span>
                </>
              ) : (
                <span className="text-paper/40">Skipped</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex items-baseline justify-between border-t border-white/10 pt-5">
        <span className="text-sm text-paper/60">
          {count} product{count === 1 ? "" : "s"}
        </span>
        <span className="font-serif text-3xl font-light tabular-nums">{kr(total)}</span>
      </div>
      <p className={cx("mt-3 flex items-center gap-2 text-xs", freeShip ? "text-fire-soft" : "text-paper/50")}>
        <Truck className="size-3.5" strokeWidth={1.5} />
        {freeShip ? "Ships free within Norway" : `${kr(FREE_SHIPPING_THRESHOLD - total)} from free shipping`}
      </p>
      <Button variant="light" className="mt-6 w-full" onClick={onAdd} disabled={!count}>
        Add routine to bag
      </Button>
      {showGuideLink && (
        <Link
          to={routinePath(routine)}
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-paper/60 hover:text-paper"
        >
          Read the full routine guide <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
