import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pillars = [
  "Seu plano de estudo sai em 30 segundos, ajustado pro seu tempo real por dia.",
  "Cada aula, simulado e flashcard vale XP e alimenta seu ranking — progresso que você vê.",
  "O tempo válido é medido com heartbeat real: só conta o que você realmente estudou.",
  "Simulados no estilo CESPE/FGV com correção automática — você sabe exatamente onde erra antes da prova.",
];

export function SolutionShowcase() {
  return (
    <section className="py-12 sm:py-16" aria-labelledby="solucao-heading">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 id="solucao-heading" className="max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          A Operação Aprovação não é &quot;mais um cursinho&quot;. É o seu sistema de preparação.
        </h2>

        <ul className="mt-8 grid gap-3">
          {pillars.map((pillar) => (
            <li key={pillar} className="flex items-start gap-3 rounded-xl border bg-background p-4">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <p className="text-muted-foreground">{pillar}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link href="/cadastro?utm_source=sales&utm_medium=site&plano=teste7d" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
            Começar teste de 7 dias grátis
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}