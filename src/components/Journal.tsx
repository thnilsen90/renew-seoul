import { ArrowUpRight } from "lucide-react";
import { STORE_URL, img } from "@/data/catalog";
import { journal } from "@/data/routines";
import { Reveal, SectionLabel } from "@/lib/ui";

export function Journal() {
  return (
    <section id="journal" className="scroll-mt-16 py-20 md:py-32">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <SectionLabel korean="읽기" className="text-slate">
              Journal
            </SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.75rem,6vw,5.5rem)]">
              Understand <em>your skin.</em>
            </h2>
          </Reveal>
          <a
            href={`${STORE_URL}/blogs/articles`}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 items-center gap-2 border-b border-ink/30 pb-1 text-sm hover:border-ink md:inline-flex"
          >
            All articles <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 md:scroll-px-8 md:gap-5 md:px-8 xl:scroll-px-12 xl:px-12">
        {journal.map((a, i) => (
          <Reveal
            as="a"
            key={a.slug}
            delay={i * 80}
            href={`${STORE_URL}/blogs/articles/${a.slug}`}
            target="_blank"
            rel="noreferrer"
            className="group w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[calc((100%-4*1.25rem)/4.3)]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-mist">
              <img
                src={img(a.image, 900)}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-paper/0 text-paper opacity-0 transition-all duration-500 group-hover:bg-paper group-hover:text-ink group-hover:opacity-100">
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </span>
            </div>
            <p className="label mt-5 text-[10px] text-slate">
              {String(i + 1).padStart(2, "0")} · {a.kicker}
            </p>
            <h3 className="mt-3 font-serif text-3xl font-light">{a.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate">{a.excerpt}</p>
          </Reveal>
        ))}
        <span className="w-px shrink-0" aria-hidden />
      </div>
    </section>
  );
}
