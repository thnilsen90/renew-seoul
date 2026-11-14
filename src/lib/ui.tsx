import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { logoPaths, LOGO_VIEWBOX, tigerPaths, TIGER_VIEWBOX } from "./brand-paths";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const kr = (n: number) => `${new Intl.NumberFormat("nb-NO").format(n)} kr`;

export function Logo({ className, accent = true }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} role="img" aria-label="Renew Seoul">
      {logoPaths.map((p, i) => (
        <path key={i} d={p.d} fill={p.accent && accent ? "var(--color-fire)" : "currentColor"} />
      ))}
    </svg>
  );
}

export function Tiger({ className }: { className?: string }) {
  return (
    <svg viewBox={TIGER_VIEWBOX} className={className} aria-hidden>
      {tigerPaths.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Fades children up once they scroll into view. */
export function Reveal<T extends ElementType = "div">({
  as,
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: T;
  delay?: number;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={cx("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionLabel({
  children,
  korean,
  className,
}: {
  children: ReactNode;
  korean?: string;
  className?: string;
}) {
  return (
    <p className={cx("label flex items-center gap-3", className)}>
      <span className="inline-block h-px w-6 bg-current opacity-50" />
      <span>{children}</span>
      {korean && (
        <span lang="ko" className="font-kr tracking-normal normal-case opacity-60">
          {korean}
        </span>
      )}
    </p>
  );
}

type ButtonVariant = "solid" | "outline" | "light" | "ghost";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  light: "bg-paper text-ink hover:bg-white",
  ghost: "border border-white/40 text-white hover:bg-white hover:text-ink",
};

export function Button<T extends ElementType = "button">({
  as,
  variant = "solid",
  className,
  children,
  ...rest
}: {
  as?: T;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">) {
  const Tag = (as ?? "button") as ElementType;
  return (
    <Tag
      className={cx(
        "group/btn inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium tracking-tight whitespace-nowrap transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Lock page scroll while an overlay is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onEscape();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [active, onEscape]);
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
