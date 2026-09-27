"use client";

import { useState } from "react";
import { MonitorPlay, LayoutDashboard, FileCheck2, Layers, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const demoTabs = [
  {
    id: "player",
    icon: MonitorPlay,
    label: "Player de aula",
    text: "Assista com barra de progresso real e +100 XP ao concluir a aula (80% ou mais do vídeo).",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    text: "Streak, XP, próximas aulas e metas — seu plano de hoje pronto em um só lugar.",
  },
  {
    id: "simulado",
    icon: FileCheck2,
    label: "Simulado",
    text: "Questões no estilo CESPE/FGV com correção automática ao final. Você sabe onde erra.",
  },
  {
    id: "flashcard",
    icon: Layers,
    label: "Flashcards",
    text: "Repetição espaçada (SM-2): Fácil, Médio, Difícil ou Errei — sua revisão se organiza sozinha.",
  },
  {
    id: "ranking",
    icon: Trophy,
    label: "Ranking",
    text: "Posição real entre candidatos do seu edital, com fórmula transparente e privacidade.",
  },
] as const;

type DemoTabId = (typeof demoTabs)[number]["id"];

export function ProductDemo() {
  const [activeTab, setActiveTab] = useState<DemoTabId>(demoTabs[0].id);
  const active = demoTabs.find((tab) => tab.id === activeTab) ?? demoTabs[0];

  return (
    <section className="bg-muted/40 py-12 sm:py-16" aria-labelledby="demo-heading">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 id="demo-heading" className="text-balance text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Veja o sistema em ação
        </h2>

        <div className="mt-8 rounded-xl border bg-background p-6">
          <div
            role="tablist"
            aria-label="Demonstração do produto"
            className="flex flex-wrap gap-2"
          >
            {demoTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`demo-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`demo-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <tab.icon className="size-4" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>

          <div
            key={active.id}
            id={`demo-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`demo-tab-${active.id}`}
            className="mt-6 rounded-xl border border-dashed p-8 text-center"
          >
            <active.icon className="mx-auto size-10 text-primary" aria-hidden="true" />
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">{active.text}</p>
            <p className="mt-3 text-xs text-muted-foreground/70">
              Protótipo de demonstração — retângulo reservado para GIF/print em produção.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}