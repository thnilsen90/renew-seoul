import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import CodeSlots, { type CodeSlotsStatus } from "@/components/reactbits/CodeSlots";
import Silk from "@/components/reactbits/Silk";
import { CONTACT_EMAIL, STORE_URL } from "@/data/catalog";
import { checkPin, PIN_LENGTH, rememberAccess } from "@/lib/access";
import { Logo } from "@/lib/ui";

const EASE = [0.22, 1, 0.36, 1] as const;
const GAP = 10;

/**
 * Full-screen PIN screen shown before the site while it's in private preview.
 * React Bits: Silk (background), BlurText (headline), CodeSlots (PIN input).
 */
export default function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<CodeSlotsStatus>("idle");
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [secondLine, setSecondLine] = useState(false);
  const [row, animate] = useAnimate<HTMLDivElement>();
  const slotSize = useSlotSize(PIN_LENGTH);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    const t = window.setTimeout(() => setSecondLine(true), 280);
    const pending = timers.current;
    return () => {
      window.clearTimeout(t);
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const submit = async (code: string) => {
    let ok: boolean;
    try {
      ok = await checkPin(code);
    } catch {
      setMessage({ text: "This page needs a secure (https) connection.", error: true });
      return;
    }
    if (ok) {
      setStatus("success");
      setMessage({ text: "Welcome in." });
      rememberAccess();
      later(onUnlock, reduce ? 200 : 750);
      return;
    }
    setStatus("error");
    setMessage({ text: "That code didn't work. Try again.", error: true });
    if (!reduce && row.current) animate(row.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.45 });
  };

  const onChange = (code: string) => {
    // First digit of a new attempt clears the error state.
    if (code && status === "error") {
      setStatus("idle");
      setMessage(null);
    }
  };

  const shopHost = new URL(STORE_URL).host;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-[100] overflow-y-auto bg-ink text-white"
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03, filter: "blur(10px)" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <Silk
          color="#2b4951"
          sheenColor="#cfe3ea"
          speed={2.5}
          scale={1.1}
          rotation={0.35}
          noiseIntensity={1.1}
          sheen={0.4}
          depth={0.55}
          glow={0.25}
          interactionStrength={0.6}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/65" />
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col py-6 md:py-8">
        <header className="flex items-center justify-between gap-4">
          <Logo className="h-4 w-auto text-white md:h-5" />
          <a
            href={STORE_URL}
            className="group inline-flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-white"
          >
            Shop at {shopHost}
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </a>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <motion.p
            className="label text-white/65"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
          >
            Private preview
          </motion.p>

          <h1 id="gate-title" className="display mt-6 text-[clamp(2.75rem,8vw,6.5rem)]">
            <BlurText as="span" text="Korean skincare," trigger="load" delay={90} blur={12} distance={20} className="justify-center" />
            {/* Second line mounts a beat later so the headline reads in order; the placeholder holds its space. */}
            {secondLine ? (
              <BlurText as="span" text="simplified." trigger="load" blur={12} distance={20} className="justify-center italic" />
            ) : (
              <span className="invisible block italic" aria-hidden>
                simplified.
              </span>
            )}
          </h1>

          <motion.p
            className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/75"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
          >
            The new Renew Seoul is almost ready. Enter the access code to take a look.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
          >
            <div ref={row}>
              <CodeSlots
                length={PIN_LENGTH}
                mask
                autoFocus
                status={status}
                onChange={onChange}
                onComplete={submit}
                slotSize={slotSize}
                gap={GAP}
                radius={14}
                accentColor="#f8fbfc"
                inkColor="#f8fbfc"
                digitColor="#021115"
                slotColor="rgba(248, 251, 252, 0.1)"
                dangerColor="#e56a36"
                ariaLabel="Access code"
              />
            </div>
            <p role="status" className={`mt-5 min-h-5 text-sm ${message?.error ? "text-fire" : "text-white/70"}`}>
              {message?.text}
            </p>
          </motion.div>
        </div>

        <p className="text-center text-xs text-white/45">
          Need a code?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-white/25 underline-offset-4 hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </motion.div>
  );
}

/** Slots as large as fit: up to 60px, shrinking on narrow phones for longer PINs. */
function useSlotSize(count: number) {
  const calc = () => {
    const room = Math.min(window.innerWidth - 32, 420);
    return Math.max(36, Math.min(60, Math.floor((room - GAP * (count - 1)) / count)));
  };
  const [size, setSize] = useState(calc);
  useEffect(() => {
    const onResize = () => setSize(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  return size;
}
