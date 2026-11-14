import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, PackageCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import {
  CONTACT_EMAIL,
  DISPATCH_TIME,
  FREE_SHIPPING_THRESHOLD,
  RETURN_DAYS,
  RETURN_POLICY_URL,
  SHIPPING_COST,
  SHIPPING_POLICY_URL,
} from "@/data/catalog";
import { Reveal, SectionLabel, cx, kr } from "@/lib/ui";

interface Assurance {
  icon: LucideIcon;
  title: string;
  body: string;
  short: string;
  link?: { label: string; href: string };
}

/** Every line here is taken from the store's published shipping and return policies. */
const promises: Assurance[] = [
  {
    icon: Truck,
    title: `Free shipping over ${kr(FREE_SHIPPING_THRESHOLD)}`,
    body: `Otherwise a flat ${kr(SHIPPING_COST)} per order. We ship within Norway.`,
    short: `Free shipping over ${kr(FREE_SHIPPING_THRESHOLD)}`,
    link: { label: "Shipping policy", href: SHIPPING_POLICY_URL },
  },
  {
    icon: PackageCheck,
    title: "Packed in Oslo",
    body: `Orders leave our Oslo storage within ${DISPATCH_TIME}, with tracking where available.`,
    short: `Ships from Oslo in ${DISPATCH_TIME}`,
  },
  {
    icon: RotateCcw,
    title: `${RETURN_DAYS}-day returns`,
    body: `Changed your mind? Unopened products can be returned within ${RETURN_DAYS} days — just email us first.`,
    short: `${RETURN_DAYS}-day returns on unopened products`,
    link: { label: "Return policy", href: RETURN_POLICY_URL },
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    body: "Payment happens in Shopify’s encrypted checkout. Questions before you buy? We’re a message away.",
    short: "Secure Shopify checkout",
    link: { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  },
];

/** Homepage strip — four short promises (after Square's "A little peace of mind" on Mobbin). */
export function AssuranceStrip() {
  return (
    <section aria-labelledby="assurance-title" className="border-t border-line py-20 md:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel className="text-slate">Shopping with us</SectionLabel>
            <h2 id="assurance-title" className="display mt-6 text-[clamp(2.25rem,4.5vw,4rem)]">
              Simple, <em>like the routine.</em>
            </h2>
          </div>
        </Reveal>
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 md:mt-12 lg:grid-cols-4">
          {promises.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80} className="flex flex-col border-t border-ink/15 pt-6">
              <p.icon className="size-6 text-fire" strokeWidth={1.25} aria-hidden />
              <h3 className="mt-4 font-serif text-xl leading-tight font-light md:mt-5 md:text-2xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{p.body}</p>
              {p.link && (
                <a
                  href={p.link.href}
                  target={p.link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 self-start border-b border-ink/25 pb-0.5 text-xs transition-colors hover:border-ink"
                >
                  {p.link.label} <ArrowUpRight className="size-3" strokeWidth={1.75} />
                </a>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Compact list for the product page, under "Add to bag". The shipping line there is dynamic, so it's skipped here. */
export function AssuranceInline({ className }: { className?: string }) {
  return (
    <ul className={cx("grid gap-2.5 text-xs text-slate", className)}>
      {promises.slice(1).map((p) => (
        <li key={p.title} className="flex items-center gap-2.5">
          <p.icon className="size-4 shrink-0 text-ink/60" strokeWidth={1.5} aria-hidden />
          {p.short}
        </li>
      ))}
    </ul>
  );
}
