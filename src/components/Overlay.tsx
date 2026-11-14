import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { cx, useEscape, useScrollLock } from "@/lib/ui";

type Side = "right" | "center" | "top";

const EASE = [0.22, 1, 0.36, 1] as const;

function useIsDesktop() {
  const query = "(min-width: 768px)";
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return match;
}

/**
 * Accessible modal shell: backdrop, scroll lock, escape, focus in/out.
 * Mounted only while open; AnimatePresence keeps the whole panel (content included)
 * on screen until its exit animation finishes, so nothing half-hidden is left behind.
 */
export function Overlay({
  open,
  onClose,
  label,
  side = "center",
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: Side;
  className?: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  useScrollLock(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const target = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panel.current;
    target?.focus({ preventScroll: true });
    return () => prev?.focus?.({ preventScroll: true });
  }, [open]);

  const hidden: TargetAndTransition =
    side === "right"
      ? { x: "100%" }
      : side === "top"
        ? { opacity: 0, y: -16 }
        : desktop
          ? { opacity: 0, y: 16, scale: 0.98 }
          : { y: "100%" };
  const shown: TargetAndTransition = { x: 0, y: 0, opacity: 1, scale: 1 };

  const position = {
    right: "inset-y-0 right-0 w-full max-w-[460px]",
    center:
      "inset-x-0 bottom-0 max-h-[92dvh] md:inset-auto md:top-1/2 md:left-1/2 md:max-h-[86vh] md:w-[min(1040px,calc(100vw-4rem))] md:-translate-x-1/2 md:-translate-y-1/2",
    top: "inset-x-0 top-0 md:top-6 md:left-1/2 md:w-[min(720px,calc(100vw-4rem))] md:-translate-x-1/2",
  }[side];

  return (
    <AnimatePresence>
      {open && (
        <div key="overlay" className="fixed inset-0 z-50">
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <div className={cx("absolute", position)}>
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              tabIndex={-1}
              initial={hidden}
              animate={shown}
              exit={hidden}
              transition={{ duration: 0.45, ease: EASE }}
              className={cx(
                "flex h-full max-h-[inherit] flex-col overflow-hidden bg-paper text-ink shadow-2xl shadow-ink/20 focus:outline-none",
                side === "center" && "rounded-t-2xl md:rounded-sm",
                side === "top" && "md:rounded-sm",
                className,
              )}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
