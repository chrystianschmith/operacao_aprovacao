import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

/**
 * Regra de integridade do banco de questões (CLAUDE.md §18/§31 item 20 — "cadastrar/editar"):
 * o enunciado não pode DUPLICAR dentro da mesma matéria. A constraint final será um índice
 * único no schema (`Question.statement` + `subjectId`, pendência de migrations registrada no
 * relatório do agente `database`); este teste cobre a defesa em profundidade no SERVIÇO, com a
 * mesma semântica de arquivamento: um enunciado soft-deletado NÃO bloqueia recadastrar o mesmo.
 * Duplicidade é por matéria (mesmo texto em matérias diferentes é permitido).
 */

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));
vi.mock("@/server/auth", () => ({ auth: authMock }));

const {
  createQuestionForAdmin,
  updateQuestionForAdmin,
  archiveQuestionForAdmin,
} = await import("@/server/services/admin/question-service");
const { __resetMockQuestionStore } = await import("@/server/repositories/mock/question-repository");
const { __resetMockQuestionOptionStore } = await import(
  "@/server/repositories/mock/question-option-repository"
);
const { SUBJECT_IDS } = await import("@/mocks");

function fakeSession(id: string, role: NextAuthSession["user"]["role"]): NextAuthSession {
  return {
    user: { id, role, name: "Teste", email: "teste@example.com" },
    expires: new Date(Date.now() + 60_000).toISOString(),
  } as NextAuthSession;
}

const NOW = new Date("2026-07-14T10:00:00.000Z");

const STATEMENT = "Enunciado único para o banco de questões?";
const OPTIONS = [
  { label: "A", text: "Alternativa A", isCorrect: true },
  { label: "B", text: "Alternativa B", isCorrect: false },
  { label: "C", text: "Alternativa C", isCorrect: false },
  { label: "D", text: "Alternativa D", isCorrect: false },
];

function createInput(overrides: { statement?: string; subjectId?: string } = {}) {
  return {
    statement: overrides.statement ?? STATEMENT,
    subjectId: overrides.subjectId ?? SUBJECT_IDS.matematica,
    difficulty: "EASY" as const,
    options: OPTIONS,
  };
}

describe("services/admin — duplicidade de enunciado de questão", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockQuestionStore();
    __resetMockQuestionOptionStore();
  });

  it("cria uma questão com enunciado novo sem problema", async () => {
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    const created = await createQuestionForAdmin(createInput(), NOW);
    expect(created.statement).toBe(STATEMENT);
  });

  it("rejeita enunciado EXATO duplicado na MESMA matéria", async () => {
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    await createQuestionForAdmin(createInput(), NOW);

    await expect(createQuestionForAdmin(createInput(), NOW)).rejects.toThrow("Enunciado duplicado");
  });

  it("a duplicidade ignora caixa e espaços/acentos repetidos (normalização)", async () => {
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    await createQuestionForAdmin(createInput(), NOW);

    const variant = "   enunciado   ÚNICO  para  o BANCO de questões?    ";
    await expect(
      createQuestionForAdmin(createInput({ statement: variant }), NOW),
    ).rejects.toThrow("Enunciado duplicado");
  });

  it("permite o mesmo enunciado em MATÉRIA diferente", async () => {
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    await createQuestionForAdmin(createInput(), NOW);

    const other = await createQuestionForAdmin(
      createInput({ subjectId: SUBJECT_IDS.direitoConstitucional }),
      NOW,
    );
    expect(other.subjectId).toBe(SUBJECT_IDS.direitoConstitucional);
  });

  it("arquivar (soft-delete) libera o enunciado para recadastro", async () => {
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    const created = await createQuestionForAdmin(createInput(), NOW);
    await archiveQuestionForAdmin(created.id, NOW);

    const recreated = await createQuestionForAdmin(createInput(), NOW);
    expect(recreated.statement).toBe(STATEMENT);
  });

  it("atualizar o enunciado para o de OUTRA questão viva da mesma matéria é rejeitado", async () => {
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    const first = await createQuestionForAdmin(createInput(), NOW);
    await createQuestionForAdmin(createInput({ statement: "Outro enunciado em uso?" }), NOW);

    await expect(
      updateQuestionForAdmin({ id: first.id, statement: "Outro enunciado em uso?" }, NOW),
    ).rejects.toThrow("Enunciado duplicado");
  });

  it("atualizar o próprio enunciado (ou só o status) continua permitido", async () => {
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    const created = await createQuestionForAdmin(createInput(), NOW);

    const renamed = await updateQuestionForAdmin(
      { id: created.id, statement: "Enunciado reformulado?" },
      NOW,
    );
    expect(renamed.statement).toBe("Enunciado reformulado?");

    const published = await updateQuestionForAdmin({ id: created.id, status: "PUBLISHED" }, NOW);
    expect(published.status).toBe("PUBLISHED");
  });
});