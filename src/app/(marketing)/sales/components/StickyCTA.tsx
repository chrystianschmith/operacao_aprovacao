"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/** Botão fixo na parte inferior (mobile-first), visível após rolar ~30% da página. */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const threshold = Math.round(window.innerHeight * 0.3);

    const onMediaChange = () => setReducedMotion(media.matches);
    onMediaChange();
    media.addEventListener("change", onMediaChange);

    const update = () => setVisible(window.scrollY > threshold);
    update();

    window.addEventListener("scroll", update, { passive: true });
    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur supports-[safe-area-inset-bottom]:pb-[calc(env(safe-area-inset-bottom)+var(--spacing-3))]",
        reducedMotion ? "transition-none" : "transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
        <div className="hidden text-sm text-muted-foreground sm:block">
          Teste 7 dias grátis · cancele quando quiser
        </div>
        <Link
          href="/cadastro?utm_source=sales&utm_medium=site&plano=teste7d"
          tabIndex={visible ? 0 : -1}
          className={cn(buttonVariants({ size: "lg", variant: "default" }), "w-full sm:w-auto")}
        >
          Começar teste de 7 dias
        </Link>
      </div>
    </div>
  );
}