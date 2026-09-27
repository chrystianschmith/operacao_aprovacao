import Link from "next/link";
import { Check, X, Crown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING } from "@/config/business";
import { cn } from "@/lib/utils";

const features = [
  "Plano de estudo IA",
  "Videoaulas completas",
  "Simulados ilimitados + correção",
  "Flashcards de repetição espaçada",
  "Ranking por cidade e concurso",
  "Modo foco / Pomodoro nativo",
];

export function PricingTable() {
  const monthly = PRICING.monthly;
  const annual = PRICING.annual;

  return (
    <section id="oferta" className="py-12 sm:py-16" aria-labelledby="oferta-heading">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 id="oferta-heading" className="text-balance text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Escolha seu ritmo
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
          Teste 7 dias grátis em qualquer plano. Cancele quando quiser, em 1 clique.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Anual — destaque */}
          <div className="relative flex flex-col rounded-xl border-2 border-primary bg-background p-6 sm:p-8">
            <Badge className="absolute -top-2.5 left-1/2 h-auto -translate-x-1/2 px-3 py-1">
              <Crown className="size-3" aria-hidden="true" />
              Mais escolhido
            </Badge>

            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">{annual.label}</h3>
              <span className="text-sm text-success">{PRICING.annualDiscountPercent}% off</span>
            </div>

            <p className="mt-4 text-4xl font-extrabold tracking-tight">
              {annual.priceLabel}
            </p>
            <p className="text-sm text-muted-foreground">
              ≈ R$ {PRICING.annualMonthlyEquivalentCents / 100}/mês · pago à vista ou PIX com desconto
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm">
                  <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                  {feature}
                </li>
              ))}
              <li className="flex items-center gap-2.5 text-sm font-medium">
                <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                Bônus: {PRICING.founderBonusLabel}
              </li>
            </ul>

            <Link
              href="/cadastro?utm_source=sales&utm_medium=site&plano=anual"
              className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 text-base")}
            >
              Começar teste de 7 dias
            </Link>
          </div>

          {/* Mensal */}
          <div className="flex flex-col rounded-xl border bg-background p-6 sm:p-8">
            <h3 className="font-semibold">{monthly.label}</h3>
            <p className="mt-4 text-4xl font-extrabold tracking-tight">{monthly.priceLabel}</p>
            <p className="text-sm text-muted-foreground">Sem fidelidade · cancele quando quiser</p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm">
                  <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                  {feature}
                </li>
              ))}
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <X className="size-4 shrink-0" aria-hidden="true" />
                Bônus do plano anual
              </li>
            </ul>

            <Link
              href="/cadastro?utm_source=sales&utm_medium=site&plano=mensal"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 h-12 text-base")}
            >
              Começar teste de 7 dias
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
          Garantia de {PRICING.guaranteeDays} dias &quot;estude ou devolvemos&quot; — por lei você
          tem 7 dias; a gente te dá {PRICING.guaranteeDays}. Formas de pagamento: PIX, cartão em até 12x.
        </p>
      </div>
    </section>
  );
}