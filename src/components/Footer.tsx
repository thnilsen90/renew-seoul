import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { STORE_URL, filterForStep, steps } from "@/data/catalog";
import { shopPath } from "@/data/shop";
import { routinePath, routines } from "@/data/routines";
import { Logo } from "@/lib/ui";

export function Footer() {
  const [joined, setJoined] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prototype: no newsletter backend is wired up yet.
    setJoined(true);
  };

  return (
    <footer data-header-theme="dark" className="bg-ink text-paper">
      <div className="container-x grid gap-16 pt-20 pb-10 md:grid-cols-12 md:pt-28">
        <div className="md:col-span-5">
          <p className="label text-paper/50">Newsletter</p>
          <p className="display mt-5 text-5xl md:text-6xl">
            Notes from Seoul, <em>in your inbox.</em>
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/60">
            New arrivals, routine guides and the occasional quiet offer. Once or twice a month.
          </p>
          {joined ? (
            <p className="mt-8 flex h-14 items-center gap-3 text-sm text-paper/80">
              <Check className="size-4 text-fire" /> Thank you — you’re on the list.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 flex max-w-md items-center border-b border-white/30 focus-within:border-white">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Email address"
                className="h-14 flex-1 bg-transparent text-sm placeholder:text-paper/40 focus:outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="grid size-10 place-items-center">
                <ArrowRight className="size-5" strokeWidth={1.25} />
              </button>
            </form>
          )}
        </div>

        <nav className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 md:col-span-6 md:col-start-7" aria-label="Footer">
          <div>
            <p className="label mb-5 text-paper/40">Shop</p>
            <ul className="grid gap-3">
              {steps.map((s) => (
                <li key={s.id}>
                  <Link to={shopPath({ step: filterForStep(s.id) })} className="text-paper/75 hover:text-paper">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-5 text-paper/40">Routines</p>
            <ul className="grid gap-3">
              {routines.map((r) => (
                <li key={r.id}>
                  <Link to={routinePath(r)} className="text-paper/75 hover:text-paper">
                    {r.name.replace("The ", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-5 text-paper/40">Help</p>
            <ul className="grid gap-3">
              {[
                ["FAQ", `${STORE_URL}/pages/faq`],
                ["Shipping", `${STORE_URL}/policies/shipping-policy`],
                ["Returns", `${STORE_URL}/policies/refund-policy`],
                ["Instagram", "https://www.instagram.com/renewseoul/"],
                ["Email us", "mailto:info@renewseoul.com"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className="text-paper/75 hover:text-paper">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="container-x">
        <Logo className="w-full text-paper" />
        <div className="flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-xs text-paper/40 md:flex-row">
          <p>© 2026 Renew Seoul · Oslo, Norway</p>
          <p className="flex gap-5">
            <a href={`${STORE_URL}/policies/privacy-policy`} target="_blank" rel="noreferrer" className="hover:text-paper">
              Privacy
            </a>
            <a href={`${STORE_URL}/policies/terms-of-service`} target="_blank" rel="noreferrer" className="hover:text-paper">
              Terms
            </a>
            <span lang="ko" className="font-kr">
              서울 → 오슬로
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
