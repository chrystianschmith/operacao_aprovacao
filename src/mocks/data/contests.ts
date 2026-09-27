import type { ContestEntity } from "@/server/repositories/contracts/contest-repository";

/**
 * Mocks centralizados e tipados (ADR-0011, CLAUDE.md §23). Fase 17 — agente `backend` (admin de
 * conteúdo). `id`/`name` coincidem com `mockSelectedContests` (`./dashboard-contest.ts`) e com
 * `CourseEntity.contestId`/`contestName` (`./courses.ts`) para o catálogo administrativo já
 * nascer coerente com os cursos existentes.
 */
export const mockContests: ContestEntity[] = [
  {
    id: "contest-pm-soldado",
    slug: "pm-soldado",
    name: "Polícia Militar — Soldado",
    organizingBoard: null,
    description: "Concurso para o cargo de Soldado da Polícia Militar.",
    deletedAt: null,
  },
  {
    id: "contest-gcm-agente",
    slug: "gcm-agente",
    name: "Guarda Civil Municipal — Agente",
    organizingBoard: null,
    description: "Concurso para o cargo de Agente da Guarda Civil Municipal.",
    deletedAt: null,
  },
  {
    id: "contest-pp-agente",
    slug: "pp-agente",
    name: "Polícia Penal — Agente Penitenciário",
    organizingBoard: null,
    description: "Concurso para o cargo de Agente da Polícia Penal.",
    deletedAt: null,
  },
  {
    id: "contest-rs-bm-soldado",
    slug: "rs-bm-soldado",
    name: "Brigada Militar RS — Soldado 2025",
    organizingBoard: "FUNDATEC",
    description: "Concurso da Brigada Militar do RS para o cargo de Soldado (1.200 vagas).",
    deletedAt: null,
  },
  {
    id: "contest-rs-cbmrs-soldado",
    slug: "rs-cbmrs-soldado",
    name: "CBMRS — Soldado",
    organizingBoard: "FUNDATEC",
    description: "Concurso do Corpo de Bombeiros Militar do RS para Soldado (400 vagas).",
    deletedAt: null,
  },
  {
    id: "contest-rs-policia-penal",
    slug: "rs-policia-penal",
    name: "Polícia Penal RS — Edital 01/2026",
    organizingBoard: "FUNDATEC",
    description: "Concurso da Polícia Penal do RS (213 vagas).",
    deletedAt: null,
  },
  {
    id: "contest-sc-cbmsc-soldado",
    slug: "sc-cbmsc-soldado",
    name: "CBMSC — Soldado CFP 001-2026",
    organizingBoard: "IDIB",
    description: "Concurso do Corpo de Bombeiros Militar de SC para Soldado.",
    deletedAt: null,
  },
  {
    id: "contest-sc-pmsc-soldado",
    slug: "sc-pmsc-soldado",
    name: "PMSC — Soldado 2026",
    organizingBoard: "AOCP",
    description: "Concurso da Polícia Militar de SC para Soldado.",
    deletedAt: null,
  },
  {
    id: "contest-pr-pmpr-soldado",
    slug: "pr-pmpr-soldado",
    name: "PMPR — Soldado 2025",
    organizingBoard: "IBFC",
    description: "Concurso da Polícia Militar do PR para Soldado (2.000 vagas).",
    deletedAt: null,
  },
  {
    id: "contest-pr-cbmpr-soldado",
    slug: "pr-cbmpr-soldado",
    name: "CBMPR — Soldado",
    organizingBoard: "IBFC",
    description: "Concurso do Corpo de Bombeiros Militar do PR para Soldado (600 vagas).",
    deletedAt: null,
  },
  {
    id: "contest-sp-pmsp-soldado",
    slug: "sp-pmsp-soldado",
    name: "PMSP — Soldado 2026",
    organizingBoard: "VUNESP",
    description: "Concurso da Polícia Militar de SP para Soldado.",
    deletedAt: null,
  },
];
