import type { Metadata } from "next";
import { QuizPage } from "./quiz-page";

export const metadata: Metadata = {
  title: "Descubra seu perfil de concurseiro",
  description:
    "Responda em 30 segundos e receba um plano de estudo alinhado ao seu tempo e maior bloqueio.",
};

export default function QuizVariantPage() {
  return <QuizPage />;
}