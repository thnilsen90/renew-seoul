import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { scrollToId } from "./ui";

/** Scroll to a home-page section, navigating home first when on another page. */
export function useGoToSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(
    (id: string) => {
      if (pathname === "/") scrollToId(id);
      else navigate(`/#${id}`);
    },
    [navigate, pathname],
  );
}

export const productPath = (id: string) => `/products/${id}`;

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
