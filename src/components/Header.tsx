import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useGoToSection } from "@/lib/nav";
import { Logo, cx, useEscape, useScrollLock } from "@/lib/ui";
import { brands, extras, img, steps, filterForStep } from "@/data/catalog";
import { routinePath, routines } from "@/data/routines";
import { shopPath } from "@/data/shop";
import type { StepId } from "@/data/products";

const announcements = [
  "Free shipping in Norway on orders over 600 kr",
  "Curated in Oslo · Sourced from Seoul",
  "Not sure where to start? Take the 60-second routine finder",
];

type MenuKey = "shop" | "routines" | null;

export function Header({ onSearch }: { onSearch: () => void }) {
  const { count, setCartOpen, setQuizOpen } = useStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const goTo = useGoToSection();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ann, setAnn] = useState(0);

  // Sections marked data-header-theme="dark" (heroes, ink bands, footer) flip the header
  // to white-on-glass while they sit under it.
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const probe = 40;
      setOverDark(
        [...document.querySelectorAll<HTMLElement>("[data-header-theme=dark]")].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= probe && r.bottom > probe;
        }),
      );
    };
    onScroll();
    const t = setTimeout(onScroll, 50); // after the new page has rendered
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const t = setInterval(() => setAnn((a) => (a + 1) % announcements.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useScrollLock(mobileOpen);
  useEscape(mobileOpen || menu !== null, () => {
    setMobileOpen(false);
    setMenu(null);
  });

  // light: paper bar · glass: dark translucent bar · clear: transparent over a dark hero
  const theme = menu !== null || !overDark ? "light" : scrolled ? "glass" : "clear";
  const solid = theme === "light";

  const close = () => {
    setMenu(null);
    setMobileOpen(false);
  };
  const go = (id: string) => {
    close();
    goTo(id);
  };
  const goShop = (to = "/shop") => {
    close();
    navigate(to);
  };
  const goStep = (step: StepId) => goShop(shopPath({ step: filterForStep(step) }));

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-500",
          theme === "light" && "bg-paper/90 text-ink backdrop-blur-xl",
          theme === "glass" && "bg-ink/55 text-white backdrop-blur-xl",
          theme === "clear" && "bg-transparent text-white",
        )}
        onMouseLeave={() => setMenu(null)}
      >
        {/* Announcement */}
        <div
          className={cx(
            "overflow-hidden bg-ink text-paper transition-[height] duration-500",
            scrolled ? "h-0" : "h-8",
          )}
        >
          <div className="relative flex h-8 items-center justify-center">
            {announcements.map((a, i) => (
              <p
                key={a}
                aria-hidden={i !== ann}
                className={cx(
                  "absolute text-[11px] tracking-wide transition-all duration-700",
                  i === ann ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                {a}
              </p>
            ))}
          </div>
        </div>

        <div
          className={cx(
            "container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b transition-colors duration-500",
            solid ? "border-line" : theme === "glass" ? "border-white/10" : "border-white/15",
          )}
        >
          <nav className="flex items-center gap-1" aria-label="Main">
            <button
              className="-ml-2 grid size-10 place-items-center md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
            <div className="hidden items-center gap-1 md:flex">
              {(
                [
                  ["shop", "Shop"],
                  ["routines", "Routines"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onMouseEnter={() => setMenu(key)}
                  onFocus={() => setMenu(key)}
                  onClick={() => (key === "shop" ? goShop() : go(key))}
                  aria-expanded={menu === key}
                  className={cx(
                    "rounded-full px-3 py-2 text-sm transition-opacity",
                    menu && menu !== key ? "opacity-50" : "opacity-100",
                  )}
                >
                  {label}
                </button>
              ))}
              {(
                [
                  ["journal", "Journal"],
                  ["about", "About"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onMouseEnter={() => setMenu(null)}
                  onClick={() => go(key)}
                  className="rounded-full px-3 py-2 text-sm"
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <Link to="/" aria-label="Renew Seoul — home" className="block" onClick={close}>
            <Logo className="h-5 w-auto md:h-6" />
          </Link>

          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setQuizOpen(true)}
              className={cx(
                "mr-2 hidden h-9 items-center gap-1.5 rounded-full border px-4 text-[13px] transition-colors lg:inline-flex",
                solid
                  ? "border-ink/20 hover:bg-ink hover:text-paper"
                  : "border-white/40 hover:bg-white hover:text-ink",
              )}
            >
              Find your routine
            </button>
            <button onClick={onSearch} className="grid size-10 place-items-center" aria-label="Search products">
              <Search className="size-[18px]" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative grid size-10 place-items-center"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute top-1 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-fire px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menus */}
        <div
          className={cx(
            "absolute inset-x-0 top-full hidden overflow-hidden border-b border-line bg-paper text-ink transition-[clip-path,opacity] duration-500 md:block",
            menu ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]",
          )}
        >
          {menu === "shop" && (
            <div className="container-x grid grid-cols-12 gap-8 py-10">
              <div className="col-span-5">
                <p className="label mb-5 text-slate">By step</p>
                <ul className="grid gap-1">
                  {steps.map((s) => (
                    <li key={s.id}>
                      <button onClick={() => goStep(s.id)} className="group flex w-full items-baseline gap-4 py-1.5 text-left">
                        <span className="w-5 text-xs text-slate tabular-nums">0{s.number}</span>
                        <span className="font-serif text-2xl font-light transition-transform duration-300 group-hover:translate-x-1">
                          {s.label}
                        </span>
                        {s.essential && (
                          <span className="label rounded-full bg-mist px-2 py-1 text-[9px] text-slate">Essential</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-3 grid content-start gap-8">
                <div>
                  <p className="label mb-5 text-slate">Weekly extras</p>
                  <ul className="grid gap-2">
                    {extras.map((s) => (
                      <li key={s.id}>
                        <button onClick={() => goStep(s.id)} className="text-sm hover:underline">
                          {s.label}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button onClick={() => goShop()} className="text-sm hover:underline">
                        Shop all products
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="hidden lg:block">
                  <p className="label mb-5 text-slate">Brands</p>
                  <ul className="columns-2 gap-4 text-sm">
                    {brands.map((b) => (
                      <li key={b} className="mb-2">
                        <Link to={shopPath({ brand: b })} onClick={close} className="text-ink/80 hover:text-ink hover:underline">
                          {b}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => go("builder")}
                className="group relative col-span-4 aspect-[4/3] overflow-hidden bg-mist text-left"
              >
                <img
                  src={img("RS_Skincare_3_2.png", 900)}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute inset-x-5 bottom-5 text-white">
                  <span className="label opacity-80">Build your own</span>
                  <span className="mt-2 flex items-end justify-between font-serif text-3xl font-light">
                    The essential three
                    <ArrowUpRight className="size-6" strokeWidth={1.25} />
                  </span>
                </span>
              </button>
            </div>
          )}
          {menu === "routines" && (
            <div className="container-x grid grid-cols-5 gap-4 py-10">
              {routines.map((r) => (
                <Link key={r.id} to={routinePath(r)} onClick={close} className="group text-left">
                  <div className="aspect-[4/5] overflow-hidden bg-mist">
                    <img
                      src={img(r.image, 500)}
                      alt=""
                      className="size-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 font-serif text-xl font-light">{r.name}</p>
                  <p className="mt-1 text-xs text-slate">{r.focus}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cx(
          "fixed inset-0 z-50 bg-paper text-ink transition-[opacity,visibility] duration-300 md:hidden",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="container-x flex h-16 items-center justify-between border-b border-line">
          <Logo className="h-5 w-auto" />
          <button className="-mr-2 grid size-10 place-items-center" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="container-x h-[calc(100dvh-4rem)] overflow-y-auto pb-10">
          <p className="label mt-8 mb-3 text-slate">Shop by step</p>
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => goStep(s.id)}
              className="flex w-full items-baseline gap-3 border-b border-line py-3 text-left"
            >
              <span className="w-5 text-xs text-slate">0{s.number}</span>
              <span className="font-serif text-2xl font-light">{s.label}</span>
            </button>
          ))}
          <p className="label mt-10 mb-3 text-slate">Routines</p>
          {routines.map((r) => (
            <Link key={r.id} to={routinePath(r)} onClick={close} className="block w-full border-b border-line py-3 text-left">
              <span className="font-serif text-2xl font-light">{r.name}</span>
              <span className="block text-xs text-slate">{r.focus}</span>
            </Link>
          ))}
          <div className="mt-10 flex flex-wrap gap-2">
            <button onClick={() => go("journal")} className="rounded-full border border-line px-4 py-2 text-sm">
              Journal
            </button>
            <button onClick={() => go("about")} className="rounded-full border border-line px-4 py-2 text-sm">
              About
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                setQuizOpen(true);
              }}
              className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
            >
              Find your routine
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
