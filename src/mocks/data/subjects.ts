import type { SubjectEntity } from "@/server/repositories/contracts/subject-repository";

/**
 * Mocks centralizados e tipados (ADR-0011, CLAUDE.md §23). Matérias distribuídas entre os
 * 3 cursos mock (Fase 6 — `src/mocks/data/{modules,lessons}.ts`).
 */

/** Ids estáveis, referenciados por `ModuleEntity.subjectId` em `modules.ts`. */
export const SUBJECT_IDS = {
  linguaPortuguesa: "subject-lingua-portuguesa",
  matematica: "subject-matematica",
  raciocinioLogico: "subject-raciocinio-logico",
  informatica: "subject-informatica",
  direitoConstitucional: "subject-direito-constitucional",
  direitoAdministrativo: "subject-direito-administrativo",
  direitoPenal: "subject-direito-penal",
  direitoProcessualPenal: "subject-direito-processual-penal",
  direitosHumanos: "subject-direitos-humanos",
  legislacaoEspecial: "subject-legislacao-especial",
  criminologia: "subject-criminologia",
  administracaoPublica: "subject-administracao-publica",
  eticaServicoPublico: "subject-etica-servico-publico",
  legislacaoTransito: "subject-legislacao-transito",
  atualidades: "subject-atualidades",
  redacao: "subject-redacao",
  conhecimentosGerais: "subject-conhecimentos-gerais",
  legislacaoInstitucional: "subject-legislacao-institucional",
  sistemaPrisional: "subject-sistema-prisional",
  historia: "subject-historia",
  geografia: "subject-geografia",
  fisica: "subject-fisica",
  quimica: "subject-quimica",
  primeirosSocorros: "subject-primeiros-socorros",
  segurancaIncendio: "subject-seguranca-incendio",
  dirPenalMilitar: "subject-dir-penal-militar",
  eca: "subject-eca",
} as const;

/** Seed compacto (id/name) — `deletedAt` (Fase 17) é aplicado uniformemente abaixo. */
const SUBJECT_SEEDS: ReadonlyArray<Pick<SubjectEntity, "id" | "name">> = [
  { id: SUBJECT_IDS.linguaPortuguesa, name: "Língua Portuguesa" },
  { id: SUBJECT_IDS.matematica, name: "Matemática" },
  { id: SUBJECT_IDS.raciocinioLogico, name: "Raciocínio Lógico" },
  { id: SUBJECT_IDS.informatica, name: "Informática" },
  { id: SUBJECT_IDS.direitoConstitucional, name: "Direito Constitucional" },
  { id: SUBJECT_IDS.direitoAdministrativo, name: "Direito Administrativo" },
  { id: SUBJECT_IDS.direitoPenal, name: "Direito Penal" },
  { id: SUBJECT_IDS.direitoProcessualPenal, name: "Direito Processual Penal" },
  { id: SUBJECT_IDS.direitosHumanos, name: "Direitos Humanos" },
  { id: SUBJECT_IDS.legislacaoEspecial, name: "Legislação Especial" },
  { id: SUBJECT_IDS.criminologia, name: "Criminologia" },
  { id: SUBJECT_IDS.administracaoPublica, name: "Administração Pública" },
  { id: SUBJECT_IDS.eticaServicoPublico, name: "Ética no Serviço Público" },
  { id: SUBJECT_IDS.legislacaoTransito, name: "Legislação de Trânsito" },
  { id: SUBJECT_IDS.atualidades, name: "Atualidades" },
  { id: SUBJECT_IDS.redacao, name: "Redação" },
  { id: SUBJECT_IDS.conhecimentosGerais, name: "Conhecimentos Gerais e Atualidades" },
  { id: SUBJECT_IDS.legislacaoInstitucional, name: "Legislação Institucional" },
  { id: SUBJECT_IDS.sistemaPrisional, name: "Sistema Prisional e Execução Penal" },
  { id: SUBJECT_IDS.historia, name: "História do Brasil e do Estado" },
  { id: SUBJECT_IDS.geografia, name: "Geografia do Brasil e do Estado" },
  { id: SUBJECT_IDS.fisica, name: "Física" },
  { id: SUBJECT_IDS.quimica, name: "Química" },
  { id: SUBJECT_IDS.primeirosSocorros, name: "Primeiros Socorros" },
  { id: SUBJECT_IDS.segurancaIncendio, name: "Segurança, Incêndio e Combate" },
  { id: SUBJECT_IDS.dirPenalMilitar, name: "Direito Penal Militar" },
  { id: SUBJECT_IDS.eca, name: "Estatuto da Criança e do Adolescente" },
];

export const mockSubjects: SubjectEntity[] = SUBJECT_SEEDS.map((seed) => ({ ...seed, deletedAt: null }));
