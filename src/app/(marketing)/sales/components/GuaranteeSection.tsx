import Link from "next/link";
import { BadgeCheck, Undo2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PRICING } from "@/config/business";
import { cn } from "@/lib/utils";

export function GuaranteeSection() {
  return (
    <section className="bg-muted/40 py-12 sm:py-16" aria-labelledby="garantia-heading">
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="flex flex-col items-center gap-6 rounded-xl border bg-background p-6 text-center sm:p-10">
          <Undo2 className="size-10 text-success" aria-hidden="true" />
          <h2 id="garantia-heading" className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Estude {PRICING.guaranteeDays} dias. Se não gostar, devolvemos 100%.
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Entre, monte seu plano, faça simulados, use o modo foco. Se em {PRICING.guaranteeDays}{" "}
            dias você não sentir que a plataforma te deixa mais perto da prova, cancele no próprio
            app com 1 clique — devolvemos tudo, sem formulário, sem perguntas.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-success" aria-hidden="true" />
              Cancelamento em 1 clique
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-success" aria-hidden="true" />
              7 dias de garantia legal (CDC)
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-success" aria-hidden="true" />
              PIX: estorno em até 1 dia útil
            </li>
          </ul>
          <Link
            href="/cadastro?utm_source=sales&utm_medium=site&plano=teste7d"
            className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}
          >
            Começar teste de 7 dias grátis
          </Link>
        </div>
      </div>
    </section>
  );
}