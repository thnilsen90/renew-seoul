import type { ReactNode } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { img } from "@/data/catalog";
import { routinePath, routines } from "@/data/routines";
import { useStore } from "@/lib/store";
import { Button, cx, scrollToId } from "@/lib/ui";

const DESKTOP = "Frame_2147239150.png";
const MOBILE = "Frame_2147239151.png";
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A plain full-screen hero: photo, headline, two actions and a row of routines to jump into.
 * Everything animates once on load; nothing is tied to scrolling.
 */
export function Hero() {
  const { setQuizOpen } = useStore();

  return (
    <section id="top" data-header-theme="dark" className="relative overflow-hidden bg-ink text-white">
      <picture className="absolute inset-0 block">
        <source media="(max-width: 767px)" srcSet={`${img(MOBILE, 900)} 900w, ${img(MOBILE, 1400)} 1400w`} />
        <motion.img
          src={img(DESKTOP, 2400)}
          srcSet={`${img(DESKTOP, 1400)} 1400w, ${img(DESKTOP, 2000)} 2000w, ${img(DESKTOP, 2880)} 2880w`}
          sizes="100vw"
          alt="Close-up of a woman with wet hair, skin dewy and calm"
          fetchPriority="high"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ scale: { duration: 2.4, ease: EASE }, opacity: { duration: 1 } }}
          className="block size-full object-cover object-[50%_30%] md:object-[22%_30%]"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40" />

      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pt-32 pb-6 md:pb-8">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <MaskLine delay={0.15} className="label mb-6 text-white/75">
              Korean skincare · Oslo
            </MaskLine>
            <h1 className="display text-[clamp(3.25rem,10vw,9.5rem)]">
              <MaskLine delay={0.3}>Korean skincare,</MaskLine>
              <MaskLine delay={0.45}>
                <em>simplified.</em>
              </MaskLine>
            </h1>
          </div>
          <FadeIn delay={0.8} className="md:col-span-4 md:pb-3">
            <p className="max-w-sm text-[15px] leading-relaxed text-white/80">
              Thoughtfully selected products. Clear guidance. Routines that work for your skin — not
              for the algorithm.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="light" onClick={() => setQuizOpen(true)}>
                Find your routine
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
              <Button as={Link} variant="ghost" to="/shop">
                Shop all
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Routines — straight into the five (Hims-style category row) */}
        <FadeIn delay={1.05} className="mt-10 border-t border-white/15 pt-5 md:mt-14">
          <div className="flex items-baseline justify-between">
            <p className="label text-white/60">Shop by routine</p>
            <button
              onClick={() => scrollToId("ten-to-three")}
              className="text-xs text-white/60 transition-colors hover:text-white"
            >
              Why only three steps? ↓
            </button>
          </div>
          <ul className="no-scrollbar -mx-4 mt-4 flex snap-x gap-2.5 overflow-x-auto px-4 md:mx-0 md:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {routines.map((r) => (
              <li key={r.id} className="w-[72vw] max-w-72 shrink-0 snap-start sm:w-auto lg:max-w-none">
                <Link
                  to={routinePath(r)}
                  className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-2 pr-3 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/20"
                >
                  <img
                    src={img(r.image, 160)}
                    alt=""
                    className="size-12 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{r.name.replace("The ", "")}</span>
                    <span className="block truncate text-[11px] text-white/55">{r.focus}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-white/50 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

/** A line of text that slides up out of a mask on load. */
function MaskLine({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <span className={cx("block overflow-hidden pb-[0.08em]", className)}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1.1, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
