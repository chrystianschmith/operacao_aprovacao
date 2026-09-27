import { CalendarX2, Clock3, CircleAlert } from "lucide-react";

const pains = [
  {
    icon: CalendarX2,
    title: "Desorganização",
    text: "Você assiste uma aula aqui, um PDF ali, e no fim da semana não sabe nem o que revisar. Cada semana parece recomeçar do zero.",
  },
  {
    icon: Clock3,
    title: "Tempo desperdiçado",
    text: "3 horas de 'estudo' que viram 40 minutos de aprendizado de verdade — entre um vídeo pulado e outro, você perdeu 2 horas.",
  },
  {
    icon: CircleAlert,
    title: "Sem feedback",
    text: "Você faz questões, mas não sabe se está no caminho certo. O simulador da banca chega daqui a pouco e a insegurança grita.",
  },
];

export function ProblemAgitation() {
  return (
    <section className="bg-muted/40 py-12 sm:py-16" aria-labelledby="problema-heading">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 id="problema-heading" className="text-balance text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Você estuda, estuda... e sente que não avança?
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {pains.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3 rounded-xl border bg-background p-6">
              <Icon className="size-6 text-destructive" aria-hidden="true" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-muted-foreground">
          Edital publicado. Você até se inscreve. Mas sem organização, sem medição e sem
          constância, adivinha quem sai aprovado?
        </p>
      </div>
    </section>
  );
}