import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { productById, type Product } from "@/data/products";
import { STORE_URL } from "@/data/catalog";

export interface CartLine {
  product: Product;
  qty: number;
}

interface StoreState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (ids: string | string[], qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  checkoutUrl: string;
  lastAdded: { ids: string[]; at: number } | null;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  quizOpen: boolean;
  setQuizOpen: (open: boolean) => void;
  shopFilter: string;
  setShopFilter: (id: string) => void;
  routineId: string;
  setRoutineId: (id: string) => void;
}

const StoreContext = createContext<StoreState | null>(null);
const STORAGE_KEY = "renew-seoul-cart";

function readCart(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    return Object.fromEntries(Object.entries(parsed).filter(([id]) => productById[id]));
  } catch {
    return {};
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [shopFilter, setShopFilter] = useState("all");
  const [routineId, setRoutineId] = useState("essential");
  const [lastAdded, setLastAdded] = useState<StoreState["lastAdded"]>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [cart]);

  const add = useCallback((ids: string | string[], qty = 1) => {
    const list = (Array.isArray(ids) ? ids : [ids]).filter((id) => productById[id]);
    if (!list.length) return;
    setCart((c) => {
      const next = { ...c };
      for (const id of list) next[id] = (next[id] ?? 0) + qty;
      return next;
    });
    setLastAdded({ ids: list, at: Date.now() });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 20);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => setQty(id, 0), [setQty]);

  const value = useMemo<StoreState>(() => {
    const lines = Object.entries(cart).map(([id, qty]) => ({ product: productById[id], qty }));
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
    // Shopify cart permalink: hands the bag straight to the live store's checkout.
    const checkoutUrl = lines.length
      ? `${STORE_URL}/cart/${lines.map((l) => `${l.product.variantId}:${l.qty}`).join(",")}`
      : `${STORE_URL}/cart`;
    return {
      lines,
      count,
      subtotal,
      add,
      setQty,
      remove,
      checkoutUrl,
      lastAdded,
      cartOpen,
      setCartOpen,
      quizOpen,
      setQuizOpen,
      shopFilter,
      setShopFilter,
      routineId,
      setRoutineId,
    };
  }, [cart, add, setQty, remove, lastAdded, cartOpen, quizOpen, shopFilter, routineId]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
