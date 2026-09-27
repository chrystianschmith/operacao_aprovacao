import { Timer, Trophy, MapPin, Lightbulb, Focus, Sparkles } from "lucide-react";

const usps = [
  {
    icon: Timer,
    title: "Tempo válido real",
    text: "Heartbeat + vídeo + interação = só o que conta. Adeus '12h que viraram 3h'.",
  },
  {
    icon: Trophy,
    title: "Gamificação arcade",
    text: "XP, níveis e conquistas sem cara de colégio — a constância vira jogo.",
  },
  {
    icon: MapPin,
    title: "Ranking por cidade e concurso",
    text: "Você vê sua posição real entre os candidatos do seu edital.",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm",
    text: "Organize dúvidas e ideias de estudo como cartões — transforme em flashcard.",
  },
  {
    icon: Focus,
    title: "Modo foco / Pomodoro nativo",
    text: "15 min de foco puro, com timer e sem distração. Seu hábito diário pronto.",
  },
  {
    icon: Sparkles,
    title: "Plano com IA",
    text: "Ajusta sua rotina quando sua vida muda — sem recomeçar do zero.",
  },
];

export function USPGrid() {
  return (
    <section className="bg-muted/40 py-12 sm:py-16" aria-labelledby="usp-heading">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 id="usp-heading" className="text-balance text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Seus diferenciais, direto ao ponto
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {usps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3 rounded-xl border bg-background p-6">
              <Icon className="size-6 text-primary" aria-hidden="true" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}