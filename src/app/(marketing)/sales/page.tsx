import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AB_COOKIE_NAME, getAbVariant } from "./ab-test/server";
import { Hero } from "./components/Hero";
import { ProblemAgitation } from "./components/ProblemAgitation";
import { SolutionShowcase } from "./components/SolutionShowcase";
import { USPGrid } from "./components/USPGrid";
import { TestimonialCarousel } from "./components/TestimonialCarousel";
import { ProductDemo } from "./components/ProductDemo";
import { PricingTable } from "./components/PricingTable";
import { GuaranteeSection } from "./components/GuaranteeSection";
import { FAQAccordion } from "./components/FAQAccordion";
import { CountdownTimer } from "./components/CountdownTimer";
import { StickyCTA } from "./components/StickyCTA";

export const metadata: Metadata = {
  title: "Estude com sistema, não com sorte",
  description:
    "Plataforma de cursos preparatórios para concursos de segurança pública: plano de estudo com IA, simulados corrigidos automaticamente, flashcards e gamificação. Teste 7 dias grátis.",
  openGraph: {
    title: "Operação Aprovação — Estude com sistema, não com sorte",
    description:
      "Plano de estudo, simulados corrigidos, flashcards e gamificação para concursos de segurança pública. Teste grátis por 7 dias.",
    type: "website",
  },
};

export default async function SalesPage() {
  const nextCookies = await cookies();
  const bucketCookie = nextCookies.get(AB_COOKIE_NAME)?.value ?? null;

  const headlineVariant = getAbVariant("hero_headline", bucketCookie);
  const ctaVariant = getAbVariant("hero_cta", bucketCookie);

  return (
    <>
      <Hero headlineVariant={headlineVariant} ctaVariant={ctaVariant} />
      <ProblemAgitation />
      <SolutionShowcase />
      <USPGrid />
      <ProductDemo />
      <TestimonialCarousel />
      <PricingTable />
      <GuaranteeSection />
      <FAQAccordion />

      <section className="px-4 pb-6 text-center" aria-label="Fechamento">
        <CountdownTimer />
      </section>

      <StickyCTA />
    </>
  );
}