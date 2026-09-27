import { ContentStatus, type PrismaClient } from "../src/generated/prisma/client";

/**
 * Seed de conteúdo editorial — Operação Aprovação.
 *
 * Estrutura "completa" de catálogo para os concurso de segurança pública dos estados
 * RS, SC, PR e SP, com base nos editais reais verificados (banca, vagas e disciplinas):
 *
 *  - RS: Brigada Militar Soldado 2025 (FUNDATEC), CBMRS Soldado (FUNDATEC),
 *        Polícia Penal RS 01/2026 (FUNDATEC);
 *  - SC: CBMSC CFP 001-2026 (IDIB), PMSC Soldado 2026 (AOCP);
 *  - PR: PMPR Soldado 2025 (IBFC), CBMPR Soldado (IBFC);
 *  - SP: PMSP Soldado 2026 (VUNESP).
 *
 * Idempotente (upsert com `id`s determinísticos), na mesma convenção de `prisma/seed.ts`.
 * Aulas iniciais por disciplina: cada curso possui Bloco 1 (Conhecimentos Gerais) e
 * Bloco 2 (Conhecimentos Específicos/Legislação). `videoUrl` usa placeholder mock na mesma
 * convenção do seed base — a curadoria de vídeos reais (YouTube) é etapa posterior.
 */
const PUBLISHED_AT = new Date("2026-06-01T00:00:00.000Z");

/** Matérias adicionais dos editais estaduais (complementam os 6 subjects do seed base). */
const STATE_SUBJECTS: Array<{ id: string; name: string; topics: string[] }> = [
  {
    id: "subject-direitos-humanos",
    name: "Direitos Humanos",
    topics: [
      "Fundamentos e Declaração Universal dos Direitos Humanos",
      "Direitos Humanos e Segurança Pública",
    ],
  },
  {
    id: "subject-conhecimentos-gerais",
    name: "Conhecimentos Gerais e Atualidades",
    topics: ["Atualidades", "Realidade social, política e econômica"],
  },
  {
    id: "subject-legislacao-institucional",
    name: "Legislação Institucional",
    topics: ["Estatuto e disciplina", "Organização e funcionamento"],
  },
  {
    id: "subject-sistema-prisional",
    name: "Sistema Prisional e Execução Penal",
    topics: ["Lei de Execução Penal", "Direitos do preso e remição"],
  },
  {
    id: "subject-historia",
    name: "História do Brasil e do Estado",
    topics: ["História do Brasil", "História do Estado"],
  },
  {
    id: "subject-geografia",
    name: "Geografia do Brasil e do Estado",
    topics: ["Geografia do Brasil", "Geografia do Estado"],
  },
  {
    id: "subject-fisica",
    name: "Física",
    topics: ["Mecânica", "Hidrostática e termologia"],
  },
  {
    id: "subject-quimica",
    name: "Química",
    topics: ["Química geral", "Reações e estequiometria"],
  },
  {
    id: "subject-primeiros-socorros",
    name: "Primeiros Socorros",
    topics: ["Urgências clínicas", "Trauma e suporte básico de vida"],
  },
  {
    id: "subject-seguranca-incendio",
    name: "Segurança, Incêndio e Combate",
    topics: ["Dinâmica do fogo", "Prevenção e combate a incêndio"],
  },
  {
    id: "subject-legislacao-transito",
    name: "Legislação de Trânsito",
    topics: ["CTB e normas de trânsito", "Infrações e penalidades"],
  },
  {
    id: "subject-dir-processual-penal",
    name: "Direito Processual Penal",
    topics: ["Inquérito policial", "Processo penal e garantias"],
  },
  {
    id: "subject-dir-penal-militar",
    name: "Direito Penal Militar",
    topics: ["Crimes militares", "Código Penal Militar"],
  },
  {
    id: "subject-legislacao-especial",
    name: "Legislação Especial",
    topics: ["Lei de Drogas e Lei Maria da Penha", "Estatuto do desarmamento"],
  },
  {
    id: "subject-adm-publica",
    name: "Noções de Administração Pública",
    topics: ["Princípios da Administração Pública", "Servidores públicos"],
  },
  {
    id: "subject-eca",
    name: "Estatuto da Criança e do Adolescente",
    topics: ["Direitos fundamentais da criança e do adolescente", "Atos infracionais"],
  },
];

type LessonSeed = {
  id: string;
  title: string;
  subjectId: string;
  durationSeconds: number;
};

type ModuleSeed = {
  id: string;
  title: string;
  description: string;
  subjectId?: string;
  lessons: LessonSeed[];
};

type EditalSeed = {
  contestId: string;
  contestSlug: string;
  contestName: string;
  organizingBoard: string;
  contestDescription: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseDescription: string;
  modules: ModuleSeed[];
};

const EDITAIS: EditalSeed[] = [
  // ===========================================================================
  // RS — Brigada Militar Soldado 2025 (FUNDATEC: LP, Legislação, CG, Mat, DH, Info)
  // ===========================================================================
  {
    contestId: "contest-rs-bm-soldado",
    contestSlug: "rs-bm-soldado",
    contestName: "Brigada Militar RS — Soldado 2025",
    organizingBoard: "FUNDATEC",
    contestDescription:
      "Concurso da Brigada Militar do Rio Grande do Sul para o cargo de Soldado (1.200 vagas no edital de 2025).",
    courseId: "course-rs-bm-soldado",
    courseSlug: "rs-bm-soldado",
    courseTitle: "Curso Completo — Brigada Militar RS Soldado",
    courseDescription:
      "Trilha completa para o concurso da Brigada Militar RS: Língua Portuguesa, Matemática, Direitos Humanos, Informática, Conhecimentos Gerais e Legislação da BM.",
    modules: [
      {
        id: "module-rs-bm-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português, Matemática, Informática, Direitos Humanos e Conhecimentos Gerais.",
        lessons: [
          {
            id: "lesson-rs-bm-01",
            title: "Português: interpretação e compreensão de texto",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-bm-02",
            title: "Matemática: operações básicas e resolução de problemas",
            subjectId: "subject-matematica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-bm-03",
            title: "Informática: sistemas operacionais e internet",
            subjectId: "subject-informatica",
            durationSeconds: 1800,
          },
          {
            id: "lesson-rs-bm-04",
            title: "Direitos Humanos na atividade policial",
            subjectId: "subject-direitos-humanos",
            durationSeconds: 1800,
          },
          {
            id: "lesson-rs-bm-05",
            title: "Conhecimentos Gerais e atualidades do Rio Grande do Sul",
            subjectId: "subject-conhecimentos-gerais",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-rs-bm-b2",
        title: "Bloco 2 — Legislação",
        description: "Legislação institucional da Brigada Militar.",
        subjectId: "subject-legislacao-institucional",
        lessons: [
          {
            id: "lesson-rs-bm-06",
            title: "Legislação da Brigada Militar: estatuto, disciplina e ética",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-bm-07",
            title: "Revisão comentada — Bloco Brigada Militar",
            subjectId: "subject-matematica",
            durationSeconds: 1800,
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // RS — CBMRS Soldado (FUNDATEC, 400 vagas)
  // ===========================================================================
  {
    contestId: "contest-rs-cbmrs-soldado",
    contestSlug: "rs-cbmrs-soldado",
    contestName: "CBMRS — Soldado",
    organizingBoard: "FUNDATEC",
    contestDescription:
      "Concurso do Corpo de Bombeiros Militar do Rio Grande do Sul para o cargo de Soldado (400 vagas).",
    courseId: "course-rs-cbmrs-soldado",
    courseSlug: "rs-cbmrs-soldado",
    courseTitle: "Curso Completo — CBMRS Soldado",
    courseDescription:
      "Trilha completa para o concurso do Corpo de Bombeiros Militar RS: Português, Matemática, Informática, Direitos Humanos, Legislação e noções de segurança e incêndio.",
    modules: [
      {
        id: "module-rs-cbmrs-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português, Matemática, Informática e Direitos Humanos.",
        lessons: [
          {
            id: "lesson-rs-cbmrs-01",
            title: "Português: interpretação de texto",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-cbmrs-02",
            title: "Matemática e raciocínio lógico",
            subjectId: "subject-matematica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-cbmrs-03",
            title: "Informática: noções de segurança da informação",
            subjectId: "subject-informatica",
            durationSeconds: 1800,
          },
          {
            id: "lesson-rs-cbmrs-04",
            title: "Direitos Humanos e proteção da vida",
            subjectId: "subject-direitos-humanos",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-rs-cbmrs-b2",
        title: "Bloco 2 — Conhecimentos Específicos",
        description: "Legislação, segurança e combate a incêndio.",
        subjectId: "subject-legislacao-institucional",
        lessons: [
          {
            id: "lesson-rs-cbmrs-05",
            title: "Legislação do CBMRS: estatuto e código disciplinar",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-cbmrs-06",
            title: "Noções de segurança, incêndio e salvamento",
            subjectId: "subject-seguranca-incendio",
            durationSeconds: 2400,
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // RS — Polícia Penal RS 01/2026 (FUNDATEC, 213 vagas: LP, Info, RLM, Legislação, Sistema prisional)
  // ===========================================================================
  {
    contestId: "contest-rs-policia-penal",
    contestSlug: "rs-policia-penal",
    contestName: "Polícia Penal RS — Edital 01/2026",
    organizingBoard: "FUNDATEC",
    contestDescription:
      "Concurso da Polícia Penal do Rio Grande do Sul (213 vagas, 80 questões: Língua Portuguesa, Legislação, Informática, Raciocínio Lógico e Conhecimentos Gerais do sistema prisional).",
    courseId: "course-rs-policia-penal",
    courseSlug: "rs-policia-penal",
    courseTitle: "Curso Completo — Polícia Penal RS",
    courseDescription:
      "Trilha completa para a Polícia Penal RS: Português, Raciocínio Lógico, Informática, Legislação da Polícia Penal e sistema prisional.",
    modules: [
      {
        id: "module-rs-pp-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português, Raciocínio Lógico e Informática.",
        lessons: [
          {
            id: "lesson-rs-pp-01",
            title: "Português: compreensão e interpretação de texto",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-pp-02",
            title: "Raciocínio Lógico e Matemático",
            subjectId: "subject-matematica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-pp-03",
            title: "Informática aplicada à Administração Pública",
            subjectId: "subject-informatica",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-rs-pp-b2",
        title: "Bloco 2 — Legislação e Sistema Prisional",
        description: "Legislação da Polícia Penal e Lei de Execução Penal.",
        subjectId: "subject-legislacao-institucional",
        lessons: [
          {
            id: "lesson-rs-pp-04",
            title: "Legislação da Polícia Penal RS",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-pp-05",
            title: "Lei de Execução Penal e direitos do preso",
            subjectId: "subject-sistema-prisional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-rs-pp-06",
            title: "Sistema prisional, remição e assistências",
            subjectId: "subject-sistema-prisional",
            durationSeconds: 1800,
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SC — CBMSC CFP 001-2026 (IDIB: LP, História, Geografia, Mat, Física, Química, Info, Legislação, Primeiros Socorros, Incêndio)
  // ===========================================================================
  {
    contestId: "contest-sc-cbmsc-soldado",
    contestSlug: "sc-cbmsc-soldado",
    contestName: "CBMSC — Soldado CFP 001-2026",
    organizingBoard: "IDIB",
    contestDescription:
      "Concurso do Corpo de Bombeiros Militar de Santa Catarina para Soldado (prova em 29/03/2026, 100+10 vagas).",
    courseId: "course-sc-cbmsc-soldado",
    courseSlug: "sc-cbmsc-soldado",
    courseTitle: "Curso Completo — CBMSC Soldado",
    courseDescription:
      "Trilha completa para o CBMSC: Português, História, Geografia, Matemática, Física, Química, Informática, Legislação, Primeiros Socorros e Incêndio.",
    modules: [
      {
        id: "module-sc-cbmsc-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português, História, Geografia, Matemática e Informática.",
        lessons: [
          {
            id: "lesson-sc-cbmsc-01",
            title: "Português: interpretação e gramática aplicada",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-cbmsc-02",
            title: "Matemática e raciocínio lógico-matemático",
            subjectId: "subject-matematica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-cbmsc-03",
            title: "História do Brasil e de Santa Catarina",
            subjectId: "subject-historia",
            durationSeconds: 1800,
          },
          {
            id: "lesson-sc-cbmsc-04",
            title: "Geografia do Brasil e de Santa Catarina",
            subjectId: "subject-geografia",
            durationSeconds: 1800,
          },
          {
            id: "lesson-sc-cbmsc-05",
            title: "Informática: noções gerais",
            subjectId: "subject-informatica",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-sc-cbmsc-b2",
        title: "Bloco 2 — Conhecimentos Específicos",
        description: "Física, Química, Legislação, Primeiros Socorros e Incêndio.",
        lessons: [
          {
            id: "lesson-sc-cbmsc-06",
            title: "Física: mecânica, hidrostática e termologia",
            subjectId: "subject-fisica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-cbmsc-07",
            title: "Química: estrutura da matéria e reações",
            subjectId: "subject-quimica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-cbmsc-08",
            title: "Legislação Institucional do CBMSC",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-cbmsc-09",
            title: "Primeiros Socorros: urgências e traumas",
            subjectId: "subject-primeiros-socorros",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-cbmsc-10",
            title: "Segurança e combate a incêndio",
            subjectId: "subject-seguranca-incendio",
            durationSeconds: 2400,
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SC — PMSC Soldado 2026 (AOCP: Legislação 10, Const 8, LP 8, Penal 6, Proc Penal 6, Penal Militar 6, Leg. Especial 6, Trânsito 5, Info 5)
  // ===========================================================================
  {
    contestId: "contest-sc-pmsc-soldado",
    contestSlug: "sc-pmsc-soldado",
    contestName: "PMSC — Soldado 2026",
    organizingBoard: "AOCP",
    contestDescription:
      "Concurso da Polícia Militar de Santa Catarina para Soldado (edital 2026, ~500 vagas, 60 questões).",
    courseId: "course-sc-pmsc-soldado",
    courseSlug: "sc-pmsc-soldado",
    courseTitle: "Curso Completo — PMSC Soldado",
    courseDescription:
      "Trilha completa para a PMSC: Português, Informática, Legislação Institucional, Direito Constitucional, Penal, Processual Penal, Penal Militar, Legislação Especial e Trânsito.",
    modules: [
      {
        id: "module-sc-pmsc-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português e Informática.",
        lessons: [
          {
            id: "lesson-sc-pmsc-01",
            title: "Português: interpretação e domínio gramatical",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-pmsc-02",
            title: "Informática: noções de sistemas, redes e segurança",
            subjectId: "subject-informatica",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-sc-pmsc-b2",
        title: "Bloco 2 — Conhecimentos Específicos",
        description: "Legislação institucional e matérias jurídicas.",
        subjectId: "subject-legislacao-institucional",
        lessons: [
          {
            id: "lesson-sc-pmsc-03",
            title: "Legislação Institucional da PMSC",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-pmsc-04",
            title: "Direito Constitucional: direitos e garantias fundamentais",
            subjectId: "subject-dir-constitucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-pmsc-05",
            title: "Direito Penal: teoria do crime e crimes em espécie",
            subjectId: "subject-dir-penal",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-pmsc-06",
            title: "Direito Processual Penal: inquérito e garantias",
            subjectId: "subject-dir-processual-penal",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-pmsc-07",
            title: "Direito Penal Militar: noções do CPM",
            subjectId: "subject-dir-penal-militar",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sc-pmsc-08",
            title: "Legislação Especial: drogas, Maria da Penha e desarmamento",
            subjectId: "subject-legislacao-especial",
            durationSeconds: 1800,
          },
          {
            id: "lesson-sc-pmsc-09",
            title: "Legislação de Trânsito (CTB)",
            subjectId: "subject-legislacao-transito",
            durationSeconds: 1800,
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // PR — PMPR Soldado 2025 (IBFC, 2.000 vagas: LP, RLM, Info, História, Geografia; CF, DH, Penal, Legislação)
  // ===========================================================================
  {
    contestId: "contest-pr-pmpr-soldado",
    contestSlug: "pr-pmpr-soldado",
    contestName: "PMPR — Soldado 2025",
    organizingBoard: "IBFC",
    contestDescription:
      "Concurso da Polícia Militar do Paraná para Soldado (2.000 vagas, 60 questões).",
    courseId: "course-pr-pmpr-soldado",
    courseSlug: "pr-pmpr-soldado",
    courseTitle: "Curso Completo — PMPR Soldado",
    courseDescription:
      "Trilha completa para a PMPR: Português, Raciocínio Lógico, Informática, História, Geografia, Direito Constitucional, Direitos Humanos, Direito Penal e Legislação.",
    modules: [
      {
        id: "module-pr-pmpr-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português, Raciocínio Lógico, Informática, História e Geografia.",
        lessons: [
          {
            id: "lesson-pr-pmpr-01",
            title: "Português: interpretação e norma culta",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-pmpr-02",
            title: "Raciocínio Lógico e Matemático",
            subjectId: "subject-matematica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-pmpr-03",
            title: "Informática: Windows, internet e pacote Office",
            subjectId: "subject-informatica",
            durationSeconds: 1800,
          },
          {
            id: "lesson-pr-pmpr-04",
            title: "História do Brasil e do Paraná",
            subjectId: "subject-historia",
            durationSeconds: 1800,
          },
          {
            id: "lesson-pr-pmpr-05",
            title: "Geografia do Brasil e do Paraná",
            subjectId: "subject-geografia",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-pr-pmpr-b2",
        title: "Bloco 2 — Conhecimentos Específicos",
        description: "Matérias jurídicas e legislação da PMPR.",
        subjectId: "subject-dir-constitucional",
        lessons: [
          {
            id: "lesson-pr-pmpr-06",
            title: "Direito Constitucional: Constituição Federal e DH",
            subjectId: "subject-dir-constitucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-pmpr-07",
            title: "Direitos Humanos e princípios de segurança pública",
            subjectId: "subject-direitos-humanos",
            durationSeconds: 1800,
          },
          {
            id: "lesson-pr-pmpr-08",
            title: "Direito Penal: teoria do crime e crimes em espécie",
            subjectId: "subject-dir-penal",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-pmpr-09",
            title: "Legislação da PMPR: estatuto, disciplina e ética",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // PR — CBMPR Soldado (IBFC, 600 vagas: LP, RLM, Física, Química, História, Geografia, Primeiros Socorros, Incêndio, ECA)
  // ===========================================================================
  {
    contestId: "contest-pr-cbmpr-soldado",
    contestSlug: "pr-cbmpr-soldado",
    contestName: "CBMPR — Soldado",
    organizingBoard: "IBFC",
    contestDescription:
      "Concurso do Corpo de Bombeiros Militar do Paraná para Soldado (600 vagas, 70 questões).",
    courseId: "course-pr-cbmpr-soldado",
    courseSlug: "pr-cbmpr-soldado",
    courseTitle: "Curso Completo — CBMPR Soldado",
    courseDescription:
      "Trilha completa para o CBMPR: Português, Raciocínio Lógico, História, Geografia, Física, Química, Primeiros Socorros, Incêndio, ECA e Legislação.",
    modules: [
      {
        id: "module-pr-cbmpr-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português, Raciocínio Lógico, História e Geografia.",
        lessons: [
          {
            id: "lesson-pr-cbmpr-01",
            title: "Português: interpretação e gramática",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-cbmpr-02",
            title: "Raciocínio Lógico e Matemático",
            subjectId: "subject-matematica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-cbmpr-03",
            title: "História do Brasil e do Paraná",
            subjectId: "subject-historia",
            durationSeconds: 1800,
          },
          {
            id: "lesson-pr-cbmpr-04",
            title: "Geografia do Brasil e do Paraná",
            subjectId: "subject-geografia",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-pr-cbmpr-b2",
        title: "Bloco 2 — Conhecimentos Específicos",
        description: "Física, Química, Primeiros Socorros, Incêndio, ECA e Legislação.",
        lessons: [
          {
            id: "lesson-pr-cbmpr-05",
            title: "Física: mecânica, hidrostática e termologia",
            subjectId: "subject-fisica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-cbmpr-06",
            title: "Química: estrutura da matéria e reações",
            subjectId: "subject-quimica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-cbmpr-07",
            title: "Primeiros Socorros: urgências e traumas",
            subjectId: "subject-primeiros-socorros",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-cbmpr-08",
            title: "Segurança e combate a incêndio",
            subjectId: "subject-seguranca-incendio",
            durationSeconds: 2400,
          },
          {
            id: "lesson-pr-cbmpr-09",
            title: "Estatuto da Criança e do Adolescente",
            subjectId: "subject-eca",
            durationSeconds: 1800,
          },
          {
            id: "lesson-pr-cbmpr-10",
            title: "Legislação do CBMPR",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // SP — PMSP Soldado 2026 (VUNESP: LP, Mat, CG, Info, Adm Pública — sem Direito no Anexo B)
  // ===========================================================================
  {
    contestId: "contest-sp-pmsp-soldado",
    contestSlug: "sp-pmsp-soldado",
    contestName: "PMSP — Soldado 2026",
    organizingBoard: "VUNESP",
    contestDescription:
      "Concurso da Polícia Militar do Estado de São Paulo para Soldado (edital DP-1/321/26, 60 questões + redação, sem Direito no Anexo B).",
    courseId: "course-sp-pmsp-soldado",
    courseSlug: "sp-pmsp-soldado",
    courseTitle: "Curso Completo — PMSP Soldado",
    courseDescription:
      "Trilha completa para a PMSP: Português, Matemática, Conhecimentos Gerais, Informática, Noções de Administração Pública e redação.",
    modules: [
      {
        id: "module-sp-pmsp-b1",
        title: "Bloco 1 — Conhecimentos Gerais",
        description: "Português, Matemática, Conhecimentos Gerais e Informática.",
        lessons: [
          {
            id: "lesson-sp-pmsp-01",
            title: "Português: interpretação, norma culta e ortografia",
            subjectId: "subject-portugues",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sp-pmsp-02",
            title: "Matemática: operações, porcentagem e problemas",
            subjectId: "subject-matematica",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sp-pmsp-03",
            title: "Conhecimentos Gerais: história e atualidades de São Paulo",
            subjectId: "subject-conhecimentos-gerais",
            durationSeconds: 1800,
          },
          {
            id: "lesson-sp-pmsp-04",
            title: "Informática: noções de sistemas e pacote Office",
            subjectId: "subject-informatica",
            durationSeconds: 1800,
          },
        ],
      },
      {
        id: "module-sp-pmsp-b2",
        title: "Bloco 2 — Administração Pública e Redação",
        description: "Noções de Administração Pública, legislação da PMSP e redação.",
        subjectId: "subject-adm-publica",
        lessons: [
          {
            id: "lesson-sp-pmsp-05",
            title: "Noções de Administração Pública",
            subjectId: "subject-adm-publica",
            durationSeconds: 1800,
          },
          {
            id: "lesson-sp-pmsp-06",
            title: "Legislação e organização da Polícia Militar de SP",
            subjectId: "subject-legislacao-institucional",
            durationSeconds: 2400,
          },
          {
            id: "lesson-sp-pmsp-07",
            title: "Redação oficial e argumentação",
            subjectId: "subject-portugues",
            durationSeconds: 1800,
          },
        ],
      },
    ],
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export async function seedConteudoEstados(prisma: PrismaClient): Promise<void> {
  // Professores das novas disciplinas (sem login; apenas atribuição de crédito).
  const novosProfessores = [
    {
      id: "teacher-03",
      name: "Prof. Carlos Henrique",
      bio: "Professor de Legislação, Direitos Humanos e Conhecimentos Gerais para carreiras de segurança pública.",
    },
    {
      id: "teacher-04",
      name: "Profa. Larissa Freitas",
      bio: "Professora de Física, Química e Primeiros Socorros para concursos de bombeiro militar.",
    },
  ];
  for (const p of novosProfessores) {
    await prisma.teacher.upsert({ where: { id: p.id }, update: {}, create: p });
  }

  // Matérias e assuntos adicionais.
  for (const s of STATE_SUBJECTS) {
    await prisma.subject.upsert({
      where: { id: s.id },
      update: {},
      create: { id: s.id, slug: slugify(s.name), name: s.name },
    });
    for (let i = 0; i < s.topics.length; i++) {
      const topicSlug = slugify(s.topics[i]!);
      await prisma.topic.upsert({
        where: { id: `${s.id}-topic-${i + 1}` },
        update: { name: s.topics[i]! },
        create: {
          id: `${s.id}-topic-${i + 1}`,
          subjectId: s.id,
          slug: topicSlug,
          name: s.topics[i]!,
        },
      });
    }
  }

  // Concursos, cursos, módulos e aulas.
  for (const edital of EDITAIS) {
    await prisma.contest.upsert({
      where: { id: edital.contestId },
      update: {},
      create: {
        id: edital.contestId,
        slug: edital.contestSlug,
        name: edital.contestName,
        organizingBoard: edital.organizingBoard,
        description: edital.contestDescription,
      },
    });

    await prisma.course.upsert({
      where: { id: edital.courseId },
      update: {},
      create: {
        id: edital.courseId,
        slug: edital.courseSlug,
        title: edital.courseTitle,
        description: edital.courseDescription,
        status: ContentStatus.PUBLISHED,
        contestId: edital.contestId,
        createdById: "user-admin",
      },
    });

    for (let mIndex = 0; mIndex < edital.modules.length; mIndex++) {
      const moduleSeed = edital.modules[mIndex]!;
      const moduleOrder = mIndex + 1;
      await prisma.module.upsert({
        where: { id: moduleSeed.id },
        update: {},
        create: {
          id: moduleSeed.id,
          courseId: edital.courseId,
          title: moduleSeed.title,
          description: moduleSeed.description,
          order: moduleOrder,
          subjectId: moduleSeed.subjectId ?? moduleSeed.lessons[0]?.subjectId ?? null,
          teacherId: "teacher-03",
          status: ContentStatus.PUBLISHED,
        },
      });

      for (let lIndex = 0; lIndex < moduleSeed.lessons.length; lIndex++) {
        const lessonSeed = moduleSeed.lessons[lIndex]!;
        const lessonOrder = lIndex + 1;
        const teacherId =
          lessonSeed.subjectId === "subject-portugues" ||
          lessonSeed.subjectId === "subject-matematica" ||
          lessonSeed.subjectId === "subject-informatica"
            ? "teacher-02"
            : lessonSeed.subjectId === "subject-fisica" ||
                lessonSeed.subjectId === "subject-quimica" ||
                lessonSeed.subjectId === "subject-primeiros-socorros" ||
                lessonSeed.subjectId === "subject-seguranca-incendio"
              ? "teacher-04"
              : "teacher-03";

        await prisma.lesson.upsert({
          where: { id: lessonSeed.id },
          update: {},
          create: {
            id: lessonSeed.id,
            moduleId: moduleSeed.id,
            title: lessonSeed.title,
            description: `Aula sobre ${lessonSeed.title.toLowerCase()} conforme o edital atual.`,
            order: lessonOrder,
            durationSeconds: lessonSeed.durationSeconds,
            videoUrl: `https://videos.mock.operacaoaprovacao.local/${lessonSeed.id}.m3u8`,
            videoProvider: "mock",
            teacherId,
            status: ContentStatus.PUBLISHED,
            publishedAt: PUBLISHED_AT,
          },
        });
      }
    }
  }
}
