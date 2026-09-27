"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "Quanto custa?",
    answer:
      "R$ 197/mês ou R$ 1.997/ano (≈ R$ 166/mês). No anual entra o bônus de mentoria de planejamento no 1º mês. Aceitamos PIX e cartão em até 12x. Tudo incluso, sem custo extra por módulo.",
  },
  {
    question: "Funciona para o meu concurso?",
    answer:
      "Sim. Suportamos concursos de segurança pública: PM, GCM, Polícia Penal e Bombeiros, com simulados no estilo CESPE, FGV, VUNESP e AOCP. O plano prioriza as matérias da sua banca.",
  },
  {
    question: "Não tenho tempo de estudar.",
    answer:
      "O plano mínimo é de 15 min/dia. A constância vale mais que horas: nosso modo foco de 15 min acumula streak e XP. O sistema se ajusta ao seu tempo, não o contrário.",
  },
  {
    question: "Já tenho outro curso.",
    answer:
      "Se o que te faltou foi organização, correção ou progresso real, esse é o nosso foco. Não empilhamos aula: medimos e organizamos seu estudo.",
  },
  {
    question: "Como funciona o teste de 7 dias?",
    answer:
      "7 dias sem cobrança de cartão. Cria sua conta, monta o plano e usa tudo. Ao final, você decide: assina ou sai. Se assinar, seu progresso fica salvo.",
  },
  {
    question: "Como você mede o tempo de estudo?",
    answer:
      "Usamos heartbeat real: vídeo ativo + aba visível + interação recente. Só conta o que é sinal de estudo válido. Relatórios honestos por matéria e período.",
  },
  {
    question: "E se eu não gostar?",
    answer:
      "Garantia de 30 dias 'estude ou devolvemos'. Cancelamento em 1 clique, sem formulário.",
  },
  {
    question: "Vocês garantem aprovação?",
    answer:
      "Não — e desconfie de quem garante. Nossa promessa é eficiência: plano, correção e progresso real. Aprovação é resultado do seu empenho somado ao método.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 sm:py-16" aria-labelledby="faq-heading">
      <div className="mx-auto w-full max-w-3xl px-4">
        <h2 id="faq-heading" className="text-balance text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Perguntas frequentes
        </h2>

        <div className="mt-8 flex flex-col gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="rounded-xl border bg-background">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
                  >
                    {item.question}
                    <ChevronDown
                      className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  hidden={!isOpen}
                  className="px-5 pb-4"
                >
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}