import type { ModuleEntity } from "@/server/repositories/contracts/module-repository";
import type { LessonEntity } from "@/server/repositories/contracts/lesson-repository";
import { SUBJECT_IDS } from "./subjects";

/**
 * Mocks centralizados e tipados (ADR-0011, CLAUDE.md §23) — módulos e aulas dos 3 cursos
 * (Fase 6), em ORDEM CRONOLÓGICA (`order` crescente, único por curso/módulo).
 *
 * `buildModule` só monta os objetos a partir de um seed compacto para reduzir repetição —
 * não contém regra de negócio (liberação/progresso ficam em
 * `src/server/services/courses/progress.ts`).
 */

interface LessonSeed {
  title: string;
  durationMinutes: number;
}

interface ModuleSeed {
  slug: string;
  title: string;
  subjectId: string;
  lessons: LessonSeed[];
}

interface BuiltModule {
  module: ModuleEntity;
  lessons: LessonEntity[];
}

function buildModule(courseId: string, order: number, seed: ModuleSeed): BuiltModule {
  const moduleId = `${courseId}-m${order}`;
  const moduleEntity: ModuleEntity = {
    id: moduleId,
    courseId,
    subjectId: seed.subjectId,
    order,
    slug: seed.slug,
    title: seed.title,
    description: null,
    teacherId: null,
    status: "PUBLISHED",
    deletedAt: null,
  };
  const lessons: LessonEntity[] = seed.lessons.map((lessonSeed, index) => ({
    id: `${moduleId}-l${index + 1}`,
    moduleId,
    order: index + 1,
    title: lessonSeed.title,
    durationMinutes: lessonSeed.durationMinutes,
    requiresLessonId: null,
    videoUrl: null,
    teacherId: null,
    status: "PUBLISHED",
    deletedAt: null,
  }));
  return { module: moduleEntity, lessons };
}

function buildCourseModules(courseId: string, seeds: ModuleSeed[]): BuiltModule[] {
  return seeds.map((seed, index) => buildModule(courseId, index + 1, seed));
}

const COURSE_1_MODULES: ModuleSeed[] = [
  {
    slug: "lingua-portuguesa",
    title: "Língua Portuguesa",
    subjectId: SUBJECT_IDS.linguaPortuguesa,
    lessons: [
      { title: "Interpretação de texto", durationMinutes: 30 },
      { title: "Ortografia e acentuação", durationMinutes: 25 },
      { title: "Classes gramaticais", durationMinutes: 35 },
      { title: "Concordância verbal e nominal", durationMinutes: 30 },
    ],
  },
  {
    slug: "raciocinio-logico",
    title: "Raciocínio Lógico",
    subjectId: SUBJECT_IDS.raciocinioLogico,
    lessons: [
      { title: "Estruturas lógicas e proposições", durationMinutes: 30 },
      { title: "Lógica de argumentação", durationMinutes: 30 },
      { title: "Sequências e padrões numéricos", durationMinutes: 25 },
      { title: "Problemas de raciocínio aplicados", durationMinutes: 35 },
    ],
  },
  {
    slug: "direito-constitucional",
    title: "Direito Constitucional",
    subjectId: SUBJECT_IDS.direitoConstitucional,
    lessons: [
      { title: "Princípios fundamentais da Constituição", durationMinutes: 40 },
      { title: "Direitos e garantias fundamentais", durationMinutes: 45 },
      { title: "Organização do Estado", durationMinutes: 35 },
      { title: "Segurança pública na Constituição", durationMinutes: 30 },
    ],
  },
  {
    slug: "direito-administrativo",
    title: "Direito Administrativo",
    subjectId: SUBJECT_IDS.direitoAdministrativo,
    lessons: [
      { title: "Princípios da administração pública", durationMinutes: 30 },
      { title: "Poderes administrativos", durationMinutes: 35 },
      { title: "Atos administrativos", durationMinutes: 30 },
      { title: "Responsabilidade civil do Estado", durationMinutes: 30 },
    ],
  },
  {
    slug: "direitos-humanos",
    title: "Direitos Humanos",
    subjectId: SUBJECT_IDS.direitosHumanos,
    lessons: [
      { title: "Fundamentos dos direitos humanos", durationMinutes: 25 },
      { title: "Direitos humanos e atuação policial", durationMinutes: 30 },
      { title: "Uso da força e direitos humanos", durationMinutes: 30 },
      { title: "Casos práticos e jurisprudência", durationMinutes: 25 },
    ],
  },
  {
    slug: "atualidades",
    title: "Atualidades",
    subjectId: SUBJECT_IDS.atualidades,
    lessons: [
      { title: "Panorama de segurança pública no Brasil", durationMinutes: 20 },
      { title: "Atualidades em políticas públicas", durationMinutes: 20 },
      { title: "Temas emergentes e debates", durationMinutes: 20 },
      { title: "Revisão de atualidades", durationMinutes: 20 },
    ],
  },
  {
    slug: "redacao",
    title: "Redação",
    subjectId: SUBJECT_IDS.redacao,
    lessons: [
      { title: "Estrutura da redação dissertativa", durationMinutes: 30 },
      { title: "Coesão e coerência textual", durationMinutes: 30 },
      { title: "Erros comuns e como evitá-los", durationMinutes: 25 },
      { title: "Prática de redação com correção", durationMinutes: 40 },
    ],
  },
];

const COURSE_2_MODULES: ModuleSeed[] = [
  {
    slug: "lingua-portuguesa",
    title: "Língua Portuguesa",
    subjectId: SUBJECT_IDS.linguaPortuguesa,
    lessons: [
      { title: "Interpretação de texto", durationMinutes: 30 },
      { title: "Ortografia e acentuação", durationMinutes: 25 },
      { title: "Concordância e regência", durationMinutes: 30 },
      { title: "Redação oficial básica", durationMinutes: 25 },
    ],
  },
  {
    slug: "matematica",
    title: "Matemática",
    subjectId: SUBJECT_IDS.matematica,
    lessons: [
      { title: "Operações fundamentais", durationMinutes: 25 },
      { title: "Razão e proporção", durationMinutes: 25 },
      { title: "Porcentagem e juros simples", durationMinutes: 30 },
      { title: "Resolução de problemas", durationMinutes: 30 },
    ],
  },
  {
    slug: "legislacao-guardas",
    title: "Legislação Especial",
    subjectId: SUBJECT_IDS.legislacaoEspecial,
    lessons: [
      { title: "Estatuto Geral das Guardas Municipais", durationMinutes: 35 },
      { title: "Atribuições da Guarda Civil Municipal", durationMinutes: 30 },
      { title: "Uso de força e algemas", durationMinutes: 30 },
      { title: "Cooperação com a segurança pública", durationMinutes: 25 },
    ],
  },
  {
    slug: "direito-administrativo",
    title: "Direito Administrativo",
    subjectId: SUBJECT_IDS.direitoAdministrativo,
    lessons: [
      { title: "Princípios da administração pública", durationMinutes: 30 },
      { title: "Poderes administrativos", durationMinutes: 35 },
      { title: "Atos administrativos municipais", durationMinutes: 30 },
      { title: "Licitações e contratos (noções)", durationMinutes: 25 },
    ],
  },
  {
    slug: "direitos-humanos",
    title: "Direitos Humanos",
    subjectId: SUBJECT_IDS.direitosHumanos,
    lessons: [
      { title: "Fundamentos dos direitos humanos", durationMinutes: 25 },
      { title: "Abordagem policial e direitos humanos", durationMinutes: 30 },
      { title: "Grupos vulneráveis", durationMinutes: 25 },
      { title: "Casos práticos municipais", durationMinutes: 25 },
    ],
  },
  {
    slug: "legislacao-transito",
    title: "Legislação de Trânsito",
    subjectId: SUBJECT_IDS.legislacaoTransito,
    lessons: [
      { title: "Código de Trânsito Brasileiro — princípios", durationMinutes: 30 },
      { title: "Infrações e penalidades", durationMinutes: 30 },
      { title: "Sinalização viária", durationMinutes: 25 },
      { title: "Fiscalização de trânsito municipal", durationMinutes: 25 },
    ],
  },
  {
    slug: "administracao-publica",
    title: "Administração Pública",
    subjectId: SUBJECT_IDS.administracaoPublica,
    lessons: [
      { title: "Organização administrativa", durationMinutes: 25 },
      { title: "Administração direta e indireta", durationMinutes: 25 },
      { title: "Princípios da gestão pública", durationMinutes: 25 },
      { title: "Controle da administração pública", durationMinutes: 25 },
    ],
  },
];

const COURSE_3_MODULES: ModuleSeed[] = [
  {
    slug: "lingua-portuguesa",
    title: "Língua Portuguesa",
    subjectId: SUBJECT_IDS.linguaPortuguesa,
    lessons: [
      { title: "Interpretação de texto", durationMinutes: 30 },
      { title: "Ortografia e acentuação", durationMinutes: 25 },
      { title: "Classes gramaticais", durationMinutes: 30 },
      { title: "Concordância verbal e nominal", durationMinutes: 30 },
    ],
  },
  {
    slug: "informatica",
    title: "Informática",
    subjectId: SUBJECT_IDS.informatica,
    lessons: [
      { title: "Conceitos básicos de hardware e software", durationMinutes: 25 },
      { title: "Sistemas operacionais", durationMinutes: 25 },
      { title: "Segurança da informação", durationMinutes: 30 },
      { title: "Ferramentas de escritório", durationMinutes: 25 },
    ],
  },
  {
    slug: "direito-penal",
    title: "Direito Penal",
    subjectId: SUBJECT_IDS.direitoPenal,
    lessons: [
      { title: "Teoria geral do crime", durationMinutes: 40 },
      { title: "Crimes contra a pessoa", durationMinutes: 35 },
      { title: "Crimes contra a administração pública", durationMinutes: 35 },
      { title: "Execução penal — noções gerais", durationMinutes: 40 },
    ],
  },
  {
    slug: "direito-processual-penal",
    title: "Direito Processual Penal",
    subjectId: SUBJECT_IDS.direitoProcessualPenal,
    lessons: [
      { title: "Princípios do processo penal", durationMinutes: 30 },
      { title: "Inquérito policial", durationMinutes: 30 },
      { title: "Prisões e medidas cautelares", durationMinutes: 35 },
      { title: "Execução penal e processo", durationMinutes: 30 },
    ],
  },
  {
    slug: "criminologia",
    title: "Criminologia",
    subjectId: SUBJECT_IDS.criminologia,
    lessons: [
      { title: "Introdução à criminologia", durationMinutes: 25 },
      { title: "Teorias da criminalidade", durationMinutes: 30 },
      { title: "Criminologia e sistema prisional", durationMinutes: 30 },
      { title: "Prevenção e ressocialização", durationMinutes: 25 },
    ],
  },
  {
    slug: "etica-servico-publico",
    title: "Ética no Serviço Público",
    subjectId: SUBJECT_IDS.eticaServicoPublico,
    lessons: [
      { title: "Ética e conduta do agente público", durationMinutes: 25 },
      { title: "Código de ética do servidor", durationMinutes: 25 },
      { title: "Regime disciplinar", durationMinutes: 30 },
      { title: "Responsabilização do agente público", durationMinutes: 25 },
    ],
  },
];

const built = [
  ...buildCourseModules("course-1", COURSE_1_MODULES),
  ...buildCourseModules("course-2", COURSE_2_MODULES),
  ...buildCourseModules("course-3", COURSE_3_MODULES),
];

// ===========================================================================
// Cursos estaduais (RS/SC/PR/SP) — espelham `prisma/conteudo-estados.ts`
// para a demo (`DATA_SOURCE=mock`) exibir o mesmo catálogo do seed.
// ===========================================================================
const COURSE_STATE_MODULES: Array<{ courseId: string; seeds: ModuleSeed[] }> = [
  {
    courseId: "course-rs-bm-soldado",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: interpretação e compreensão de texto", durationMinutes: 40 },
          { title: "Matemática: operações básicas e resolução de problemas", durationMinutes: 40 },
          { title: "Informática: sistemas operacionais e internet", durationMinutes: 30 },
          { title: "Direitos Humanos na atividade policial", durationMinutes: 30 },
          { title: "Conhecimentos Gerais e atualidades do Rio Grande do Sul", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-legislacao",
        title: "Bloco 2 — Legislação",
        subjectId: SUBJECT_IDS.legislacaoInstitucional,
        lessons: [
          { title: "Legislação da Brigada Militar: estatuto, disciplina e ética", durationMinutes: 40 },
          { title: "Revisão comentada — Bloco Brigada Militar", durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    courseId: "course-rs-cbmrs-soldado",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: interpretação de texto", durationMinutes: 40 },
          { title: "Matemática e raciocínio lógico", durationMinutes: 40 },
          { title: "Informática: noções de segurança da informação", durationMinutes: 30 },
          { title: "Direitos Humanos e proteção da vida", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-conhecimentos-especificos",
        title: "Bloco 2 — Conhecimentos Específicos",
        subjectId: SUBJECT_IDS.legislacaoInstitucional,
        lessons: [
          { title: "Legislação do CBMRS: estatuto e código disciplinar", durationMinutes: 40 },
          { title: "Noções de segurança, incêndio e salvamento", durationMinutes: 40 },
        ],
      },
    ],
  },
  {
    courseId: "course-rs-policia-penal",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: compreensão e interpretação de texto", durationMinutes: 40 },
          { title: "Raciocínio Lógico e Matemático", durationMinutes: 40 },
          { title: "Informática aplicada à Administração Pública", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-legislacao-sistema-prisional",
        title: "Bloco 2 — Legislação e Sistema Prisional",
        subjectId: SUBJECT_IDS.legislacaoInstitucional,
        lessons: [
          { title: "Legislação da Polícia Penal RS", durationMinutes: 40 },
          { title: "Lei de Execução Penal e direitos do preso", durationMinutes: 40 },
          { title: "Sistema prisional, remição e assistências", durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    courseId: "course-sc-cbmsc-soldado",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: interpretação e gramática aplicada", durationMinutes: 40 },
          { title: "Matemática e raciocínio lógico-matemático", durationMinutes: 40 },
          { title: "História do Brasil e de Santa Catarina", durationMinutes: 30 },
          { title: "Geografia do Brasil e de Santa Catarina", durationMinutes: 30 },
          { title: "Informática: noções gerais", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-conhecimentos-especificos",
        title: "Bloco 2 — Conhecimentos Específicos",
        subjectId: SUBJECT_IDS.fisica,
        lessons: [
          { title: "Física: mecânica, hidrostática e termologia", durationMinutes: 40 },
          { title: "Química: estrutura da matéria e reações", durationMinutes: 40 },
          { title: "Legislação Institucional do CBMSC", durationMinutes: 40 },
          { title: "Primeiros Socorros: urgências e traumas", durationMinutes: 40 },
          { title: "Segurança e combate a incêndio", durationMinutes: 40 },
        ],
      },
    ],
  },
  {
    courseId: "course-sc-pmsc-soldado",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: interpretação e domínio gramatical", durationMinutes: 40 },
          { title: "Informática: noções de sistemas, redes e segurança", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-conhecimentos-especificos",
        title: "Bloco 2 — Conhecimentos Específicos",
        subjectId: SUBJECT_IDS.legislacaoInstitucional,
        lessons: [
          { title: "Legislação Institucional da PMSC", durationMinutes: 40 },
          { title: "Direito Constitucional: direitos e garantias fundamentais", durationMinutes: 40 },
          { title: "Direito Penal: teoria do crime e crimes em espécie", durationMinutes: 40 },
          { title: "Direito Processual Penal: inquérito e garantias", durationMinutes: 40 },
          { title: "Direito Penal Militar: noções do CPM", durationMinutes: 40 },
          { title: "Legislação Especial: drogas, Maria da Penha e desarmamento", durationMinutes: 30 },
          { title: "Legislação de Trânsito (CTB)", durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    courseId: "course-pr-pmpr-soldado",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: interpretação e norma culta", durationMinutes: 40 },
          { title: "Raciocínio Lógico e Matemático", durationMinutes: 40 },
          { title: "Informática: Windows, internet e pacote Office", durationMinutes: 30 },
          { title: "História do Brasil e do Paraná", durationMinutes: 30 },
          { title: "Geografia do Brasil e do Paraná", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-conhecimentos-especificos",
        title: "Bloco 2 — Conhecimentos Específicos",
        subjectId: SUBJECT_IDS.direitoConstitucional,
        lessons: [
          { title: "Direito Constitucional: Constituição Federal e DH", durationMinutes: 40 },
          { title: "Direitos Humanos e princípios de segurança pública", durationMinutes: 30 },
          { title: "Direito Penal: teoria do crime e crimes em espécie", durationMinutes: 40 },
          { title: "Legislação da PMPR: estatuto, disciplina e ética", durationMinutes: 40 },
        ],
      },
    ],
  },
  {
    courseId: "course-pr-cbmpr-soldado",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: interpretação e gramática", durationMinutes: 40 },
          { title: "Raciocínio Lógico e Matemático", durationMinutes: 40 },
          { title: "História do Brasil e do Paraná", durationMinutes: 30 },
          { title: "Geografia do Brasil e do Paraná", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-conhecimentos-especificos",
        title: "Bloco 2 — Conhecimentos Específicos",
        subjectId: SUBJECT_IDS.fisica,
        lessons: [
          { title: "Física: mecânica, hidrostática e termologia", durationMinutes: 40 },
          { title: "Química: estrutura da matéria e reações", durationMinutes: 40 },
          { title: "Primeiros Socorros: urgências e traumas", durationMinutes: 40 },
          { title: "Legislação do CBMPR", durationMinutes: 40 },
          { title: "Estatuto da Criança e do Adolescente", durationMinutes: 30 },
        ],
      },
    ],
  },
  {
    courseId: "course-sp-pmsp-soldado",
    seeds: [
      {
        slug: "bloco-1-conhecimentos-gerais",
        title: "Bloco 1 — Conhecimentos Gerais",
        subjectId: SUBJECT_IDS.linguaPortuguesa,
        lessons: [
          { title: "Português: interpretação, norma culta e ortografia", durationMinutes: 40 },
          { title: "Matemática: operações, porcentagem e problemas", durationMinutes: 40 },
          { title: "Conhecimentos Gerais: história e atualidades de São Paulo", durationMinutes: 30 },
          { title: "Informática: noções de sistemas e pacote Office", durationMinutes: 30 },
        ],
      },
      {
        slug: "bloco-2-administracao-publica",
        title: "Bloco 2 — Administração Pública e Redação",
        subjectId: SUBJECT_IDS.administracaoPublica,
        lessons: [
          { title: "Noções de Administração Pública", durationMinutes: 30 },
          { title: "Legislação e organização da Polícia Militar de SP", durationMinutes: 40 },
          { title: "Redação oficial e argumentação", durationMinutes: 30 },
        ],
      },
    ],
  },
];

const stateBuilt = COURSE_STATE_MODULES.flatMap(({ courseId, seeds }) =>
  buildCourseModules(courseId, seeds),
);

export const mockModules: ModuleEntity[] = built.map((item) => item.module);
export const mockLessons: LessonEntity[] = built.flatMap((item) => item.lessons);

export const stateMockModules: ModuleEntity[] = stateBuilt.map((item) => item.module);
export const stateMockLessons: LessonEntity[] = stateBuilt.flatMap((item) => item.lessons);

export const allMockModules: ModuleEntity[] = [...mockModules, ...stateMockModules];
export const allMockLessons: LessonEntity[] = [...mockLessons, ...stateMockLessons];
