import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { GuaranteeSection } from "../../components/GuaranteeSection";
import { PricingTable } from "../../components/PricingTable";
import { FAQAccordion } from "../../components/FAQAccordion";
import { StickyCTA } from "../../components/StickyCTA";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Saiba como funciona",
  description: "Como o sistema da Operação Aprovação organiza, corrige e mede o seu estudo para concursos.",
};

export default function VslSalesPage() {
  return (
    <>
      <section
        className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16"
        aria-labelledby="vsl-heading"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 id="vsl-heading" className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            O problema não é o quanto você estuda.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            É a organização, a correção e a constância. A Operação Aprovação resolve os três —
            em um único sistema no seu celular.
          </p>

          {/* Reservado para o player VSL (vídeo). */}
          <div
            className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-dashed bg-muted/40"
            aria-hidden="true"
          >
            <span className="text-sm text-muted-foreground">
              Player de vídeo VSL (reservado para produção)
            </span>
          </div>

          <Link href="/cadastro?utm_source=sales&utm_medium=site&plano=teste7d" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
            Começar teste de 7 dias grátis
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <PricingTable />
      <GuaranteeSection />
      <FAQAccordion />
      <StickyCTA />
    </>
  );
}