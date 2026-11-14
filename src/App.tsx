import { lazy, Suspense, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AnimatePresence } from "motion/react";
import { StoreProvider } from "@/lib/store";
import { hasAccess } from "@/lib/access";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // Detail pages load on demand so the home page doesn't carry their code.
      { path: "shop", lazy: () => import("@/pages/ShopPage").then((m) => ({ Component: m.ShopPage })) },
      { path: "products/:handle", lazy: () => import("@/pages/ProductPage").then((m) => ({ Component: m.ProductPage })) },
      { path: "routines/:slug", lazy: () => import("@/pages/RoutinePage").then((m) => ({ Component: m.RoutinePage })) },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

// Private-preview PIN screen. Loaded only while locked, so visitors who are in never download it.
const AccessGate = lazy(() => import("@/components/AccessGate"));

export default function App() {
  const [unlocked, setUnlocked] = useState(hasAccess);
  return (
    <>
      {unlocked && (
        <StoreProvider>
          <RouterProvider router={router} />
        </StoreProvider>
      )}
      {/* The gate fades out over the site as it mounts underneath. */}
      <AnimatePresence>
        {!unlocked && (
          <Suspense key="gate" fallback={<div className="fixed inset-0 z-[100] bg-ink" />}>
            <AccessGate onUnlock={() => setUnlocked(true)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
