/**
 * Mocks da página de vendas (Fase "sales-page"). Centralizados e tipados (CLAUDE.md §23 —
 * nunca embutir em componentes); fáceis de substituir por dados reais do backend
 * (depoimentos virão do admin, números do analytics).
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  concurso: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "d1",
    name: "Ana",
    role: "27, PM-SP",
    concurso: "PM-SP",
    quote:
      "Nunca estudei pra concurso. Em 2 semanas já tinha plano, streak de 9 dias e feito meu primeiro simulado. Me senti no controle pela primeira vez.",
  },
  {
    id: "d2",
    name: "Bruno",
    role: "28, GCM",
    concurso: "GCM-RJ",
    quote:
      "Já tinha reprovado uma vez. O que mudou foi a correção: vi que errava em interpretação, não em conteúdo. Refiz o plano e passei.",
  },
  {
    id: "d3",
    name: "Carla",
    role: "31, Polícia Penal",
    concurso: "Polícia Penal-MG",
    quote:
      "Trabalho e filha pequena. 30 min antes de acordar o bebê era meu horário. O modo foco tornou isso sagrado — 60 dias de streak e aumento 35% nos acertos.",
  },
  {
    id: "d4",
    name: "Diego",
    role: "27, PM-RJ",
    concurso: "PM-RJ",
    quote:
      "Já tinha base, mas o ranking da minha cidade me deu um choque de realismo. Substituí minha desorganização por plano, e em 4 meses fui pra posição 12 do meu edital.",
  },
];

export const socialProofNumbers = {
  activeStudents: "12.847",
  validHours: "2,4 milhões",
  renewalRate: "94%",
} as const;