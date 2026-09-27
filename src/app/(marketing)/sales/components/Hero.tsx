import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { socialProofNumbers } from "@/mocks/data/sales-page";
import { TrustBadges } from "./TrustBadges";
import { cn } from "@/lib/utils";

interface HeroProps {
  headlineVariant: string;
  ctaVariant: string;
}

interface HeadlineCopy {
  kicker: string;
  title: string;
}

interface CtaCopy {
  label: string;
  href: string;
}

const HEADLINE_COPY: Record<string, HeadlineCopy> = {
  control: {
    kicker: "Para você que vai ser aprovado",
    title: "Estude com sistema, não com sorte.",
  },
  mechanism: {
    kicker: "O sistema que organiza, corrige e mede seu estudo",
    title: "Plano de estudo, simulados corrigidos e ranking — no celular.",
  },
};

const CTA_COPY: Record<string, CtaCopy> = {
  trial: {
    label: "Quero ver meu plano grátis",
    href: "/cadastro?utm_source=sales&utm_medium=site&plano=teste7d",
  },
  plan: {
    label: "Ver planos e preços",
    href: "#oferta",
  },
};

export function Hero({ headlineVariant, ctaVariant }: HeroProps) {
  const headline: HeadlineCopy = HEADLINE_COPY[headlineVariant] ?? HEADLINE_COPY.control!;
  const cta: CtaCopy = CTA_COPY[ctaVariant] ?? CTA_COPY.trial!;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-12 pb-10 sm:pt-16" aria-labelledby="hero-heading">
      <div className="flex flex-col items-center gap-6 text-center">
        <Badge variant="outline" className="h-auto px-3 py-1 text-xs">
          CESPE · FGV · VUNESP · AOCP — PM · GCM · Polícia Penal · Bombeiros
        </Badge>

        <h1
          id="hero-heading"
          className="max-w-3xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {headline.kicker}: {headline.title}
        </h1>

        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          O método que organiza seu plano de estudo, corrige seus simulados no estilo da sua
          banca e mede seu progresso real — tudo isso em 15 a 60 minutos por dia.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={cta.href}
            className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}
          >
            {cta.label}
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
          <Link
            href="#oferta"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-6 text-base")}
          >
            Ver preços e prazos
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          ⭐ 4,9/5 · {socialProofNumbers.activeStudents} concurseiros ativos em segurança pública
        </p>

        <TrustBadges />
      </div>
    </section>
  );
}