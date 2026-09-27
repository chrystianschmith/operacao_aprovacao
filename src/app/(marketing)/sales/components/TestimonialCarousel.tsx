"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { testimonials, type Testimonial } from "@/mocks/data/sales-page";
import { Button } from "@/components/ui/button";

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items: Testimonial[] = testimonials;
  const count = items.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [count]);

  const next = () => setActiveIndex((current) => (current + 1) % count);
  const prev = () => setActiveIndex((current) => (current - 1 + count) % count);

  const active: Testimonial = items[activeIndex] ?? items[0]!;

  return (
    <section className="py-12 sm:py-16" aria-labelledby="depoimentos-heading">
      <div className="mx-auto w-full max-w-3xl px-4">
        <h2 id="depoimentos-heading" className="sr-only">
          Depoimentos de alunos
        </h2>

        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de alunos"
          className="relative rounded-xl border bg-background p-6 sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={prev}
              aria-label="Depoimento anterior"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>

            <div
              key={active.id}
              aria-live="polite"
              className="flex-1 text-center"
              tabIndex={0}
            >
              <blockquote className="text-muted-foreground">&ldquo;{active.quote}&rdquo;</blockquote>
              <p className="mt-4 font-semibold">
                {active.name}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {active.role} · {active.concurso}
                </span>
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={next}
              aria-label="Próximo depoimento"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>

          <ol className="mt-6 flex items-center justify-center gap-2" aria-label="Ir para depoimento">
            {items.map((item: Testimonial, index: number) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Depoimento ${index + 1} de ${count}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full transition-colors",
                    index === activeIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70",
                  )}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}