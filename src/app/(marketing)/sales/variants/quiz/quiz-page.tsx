"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizOption {
  id: string;
  label: string;
}

interface QuizQuestion {
  key: string;
  title: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    key: "concurso",
    title: "Qual concurso você tá mirando?",
    options: [
      { id: "pm", label: "Polícia Militar" },
      { id: "gcm", label: "Guarda Civil Municipal" },
      { id: "rp", label: "Polícia Penal" },
      { id: "bm", label: "Bombeiro Militar" },
      { id: "outro", label: "Outro / ainda decidindo" },
    ],
  },
  {
    key: "tempo",
    title: "Quanto tempo por dia você consegue estudar?",
    options: [
      { id: "15", label: "15 min" },
      { id: "30", label: "30 min" },
      { id: "45", label: "45 min" },
      { id: "60", label: "1 hora" },
      { id: "90", label: "1h30 ou mais" },
    ],
  },
  {
    key: "bloqueio",
    title: "O que mais te trava hoje?",
    options: [
      { id: "tempo", label: "Falta de tempo" },
      { id: "org", label: "Desorganização / não sei o que estudar" },
      { id: "ansia", label: "Ansiedade / insegurança" },
      { id: "materia", label: "Matéria específica difícil" },
      { id: "simulados", label: "Não sei corrigir meus simulados" },
    ],
  },
];

function ResultPanel({ answers }: { answers: Record<string, string> }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <h2 className="text-2xl font-bold tracking-tight">Seu ponto de partida identificado.</h2>
      <p className="max-w-md text-muted-foreground">
        Você tem {answers.tempo === "15" ? "pouco" : "um bom"} tempo e o principal bloqueio em{" "}
        <span className="font-semibold text-foreground">
          {QUESTIONS.find((q) => q.key === "bloqueio")?.options.find((o) => o.id === answers.bloqueio)?.label ?? "…"}
        </span>
        . A plataforma monta seu plano e corrige seus simulados exatamente nesse ponto.
      </p>
      <Link
        href="/cadastro?utm_source=sales&utm_medium=site&plano=quiz"
        className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}
      >
        Começar teste de 7 dias grátis
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (step >= QUESTIONS.length) {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-16">
        <ResultPanel answers={answers} />
      </section>
    );
  }

  const question: QuizQuestion = QUESTIONS[step]!;

  const select = (optionId: string) => {
    setAnswers((current) => ({ ...current, [question.key]: optionId }));
    setStep((current) => current + 1);
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16" aria-labelledby="quiz-heading">
      <h1 id="quiz-heading" className="text-2xl font-extrabold tracking-tight">
        {question.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pergunta {step + 1} de {QUESTIONS.length}
      </p>

      <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label={question.title}>
        {question.options.map((option) => {
          const selected = answers[question.key] === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => select(option.id)}
              className={cn(
                "rounded-xl border bg-background px-5 py-4 text-left font-medium transition-colors",
                selected ? "border-primary bg-primary/10" : "hover:bg-muted",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Responda para receber uma oferta e um plano mais aderentes — sem compromisso.
      </p>
    </section>
  );
}