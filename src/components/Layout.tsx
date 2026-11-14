import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { Quiz } from "./Quiz";
import { SearchDialog } from "./SearchDialog";

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  // New page → start at the top. Back/forward and reloads ("POP") keep the browser's own
  // scroll restoration; #section links are handled by the home page.
  useLayoutEffect(() => {
    if (navigationType === "POP" || hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Header onSearch={() => setSearchOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Quiz />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
