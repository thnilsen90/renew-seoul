import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { img, stepById } from "@/data/catalog";
import { products, type Product } from "@/data/products";
import { productPath } from "@/lib/nav";
import { cx, kr } from "@/lib/ui";
import { Overlay } from "./Overlay";

const suggestions = ["Sunscreen", "Barrier", "Vitamin C", "Toner pad", "Niacinamide", "Mask"];

function matches(p: Product, q: string) {
  const hay = `${p.brand} ${p.name} ${stepById[p.step].label} ${p.description}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (open) {
      setQ("");
      setCursor(0);
    }
  }, [open]);

  const results = useMemo(() => (q.trim() ? products.filter((p) => matches(p, q)).slice(0, 8) : []), [q]);

  const choose = (p: Product) => {
    onClose();
    navigate(productPath(p.id));
  };

  return (
    <Overlay open={open} onClose={onClose} label="Search" side="top">
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Search className="size-5 shrink-0 text-slate" strokeWidth={1.5} />
        <input
          data-autofocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor((c) => Math.min(c + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor((c) => Math.max(c - 1, 0));
            } else if (e.key === "Enter" && results[cursor]) {
              choose(results[cursor]);
            }
          }}
          placeholder="Search products, brands, ingredients…"
          aria-label="Search products"
          className="h-16 flex-1 bg-transparent font-serif text-2xl font-light placeholder:text-ink/30 focus:outline-none"
        />
        <button onClick={onClose} className="grid size-10 place-items-center" aria-label="Close search">
          <X className="size-5" strokeWidth={1.5} />
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-3">
        {!q.trim() ? (
          <div className="p-3">
            <p className="label text-[10px] text-slate">Popular</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQ(s)} className="h-9 rounded-full border border-line px-4 text-sm hover:border-ink/40">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="p-3 text-sm text-slate">No matches for “{q}”. Try a step like “toner” or a brand.</p>
        ) : (
          <ul role="listbox" aria-label="Results">
            {results.map((p, i) => (
              <li key={p.id} role="option" aria-selected={i === cursor}>
                <button
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => choose(p)}
                  className={cx("flex w-full items-center gap-4 rounded-sm p-3 text-left", i === cursor && "bg-mist")}
                >
                  <img src={img(p.image, 120)} alt="" className="size-12 shrink-0 bg-mist object-contain mix-blend-multiply" />
                  <span className="min-w-0 flex-1">
                    <span className="label block text-[9px] text-slate">
                      {p.brand} · {stepById[p.step].label}
                    </span>
                    <span className="mt-1 block truncate text-sm">
                      {p.name} <span className="text-slate">· {p.size}</span>
                    </span>
                  </span>
                  <span className="text-sm text-slate tabular-nums">{kr(p.price)}</span>
                  <ArrowRight className={cx("size-4 transition-opacity", i === cursor ? "opacity-100" : "opacity-0")} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Overlay>
  );
}
