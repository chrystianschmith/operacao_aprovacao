import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PricingTable } from "../../components/PricingTable";
import { FAQAccordion } from "../../components/FAQAccordion";
import { StickyCTA } from "../../components/StickyCTA";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Começar agora",
  description: "Teste grátis por 7 dias da Operação Aprovação — plano de estudo, simulados e flashcards.",
};

const bullets = [
  "Plano de estudo gerado em 30 segundos",
  "Simulados corrigidos automaticamente (CESPE/FGV)",
  "15 min/dia já criam constância (modo foco)",
];

export default function ShortSalesPage() {
  return (
    <>
      <section className="py-12 sm:py-16" aria-labelledby="short-heading">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 text-center">
          <h1 id="short-heading" className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Seu plano pra passar já está pronto.
          </h1>
          <p className="text-muted-foreground">
            Teste 7 dias grátis e veja o sistema da Operação Aprovação na prática.
          </p>

          <ul className="flex w-full max-w-md flex-col gap-3 rounded-xl border bg-background p-6 text-left">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>

          <Link href="/cadastro?utm_source=sales&utm_medium=site&plano=teste7d" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
            Começar teste de 7 dias
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <PricingTable />
      <FAQAccordion />
      <StickyCTA />
    </>
  );
}