import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));

vi.mock("@/server/auth", () => ({
  auth: authMock,
}));

const {
  createAttempt,
  submitAndFinalize,
  getResult,
  getErrorNotebook,
} = await import("@/server/services/simulations");
const { getRepositories } = await import("@/server/repositories");
const {
  mockExamConfigInputSchema,
} = await import("@/contracts/simulations");
const { MOCK_EXAM_IDS, SUBJECT_IDS } = await import("@/mocks");
const { __resetMockMockExamStore } = await import("@/server/repositories/mock/mock-exam-repository");
const { __resetMockMockExamAttemptStore } = await import(
  "@/server/repositories/mock/mock-exam-attempt-repository"
);
const { __resetMockQuestionAttemptStore } = await import(
  "@/server/repositories/mock/question-attempt-repository"
);
const { __resetMockQuestionFavoriteStore } = await import(
  "@/server/repositories/mock/question-favorite-repository"
);
const { __resetMockQuestionStore } = await import("@/server/repositories/mock/question-repository");
const { __resetMockGamificationEventStore } = await import(
  "@/server/repositories/mock/gamification-event-repository"
);
const { __resetMockPointTransactionStore } = await import(
  "@/server/repositories/mock/point-transaction-repository"
);

function fakeSession(id: string): NextAuthSession {
  ensureAuthenticatedUser(id);
  return {
    user: { id, role: "aluno", name: "Teste", email: "teste@example.com" },
    expires: new Date(Date.now() + 60_000).toISOString(),
  } as NextAuthSession;
}

function cfg(partial: Parameters<typeof mockExamConfigInputSchema.parse>[0]) {
  return mockExamConfigInputSchema.parse(partial);
}

const BASE_TIME = Date.parse("2026-07-13T10:00:00.000Z");

/**
 * Fluxo de BORDA "questão anulada/arquivada após respostas" (CLAUDE.md §18": a vida da
 * questão após o simulado). O histórico de quem JÁ respondeu não pode ser invalidado em
 * silêncio: a tentativa finalizada continua exibindo a questão com a alternativa selecionada e o
 * acerto original, e a nota permanece a corrigida. Já tentativas NOVAS não podem mais sortear a
 * questão arquivada (pool só considera PUBLISHED).
 *
 * Obs.: o sistema modela "anulação"/retirada de circulação como `Question.status = ARCHIVED`
 * (CRUD administrativo Fase 17). Sem migration necessária — apenas estado transacional.
 */
describe("services/simulations — questão arquivada após respostas não invalida histórico", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamStore();
    __resetMockMockExamAttemptStore();
    __resetMockQuestionAttemptStore();
    __resetMockQuestionFavoriteStore();
    __resetMockQuestionStore();
    __resetMockGamificationEventStore();
    __resetMockPointTransactionStore();
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("após arquivar a questão, o resultado antigo preserva a alternativa e o acerto originais", async () => {
    const userId = "annul-user-1";
    authMock.mockResolvedValue(fakeSession(userId));
    const repos = getRepositories();

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const archivedQuestionId = attempt.questions[0]!.questionId;

    // Responde as 5 questões, ERRANDO a que será arquivada depois.
    const answers = await Promise.all(
      attempt.questions.map(async (q) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const target =
          q.questionId === archivedQuestionId
            ? options.find((o) => !o.isCorrect)!
            : options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: target.id };
      }),
    );
    const resultBefore = await submitAndFinalize(userId, { attemptId: attempt.id, answers });
    const beforeScore = resultBefore.scorePercent;
    const beforeCorrect = resultBefore.correctCount;

    // Admin arquiva a questão DEPOIS de o aluno ter respondido.
    await repos.questions.update({ id: archivedQuestionId, status: "ARCHIVED", now: new Date() });
    await expect(repos.questions.findById(archivedQuestionId)).resolves.toMatchObject({ status: "ARCHIVED" });

    // O histórico de quem já respondeu NÃO é invalidado silenciosamente: mesmo item, mesma
    // alternativa selecionada, mesmo acerto — e a nota continua a mesma.
    const after = await getResult(userId, attempt.id);
    expect(after.scorePercent).toBe(beforeScore);
    expect(after.correctCount).toBe(beforeCorrect);
    expect(after.totalQuestions).toBe(attempt.questions.length);

    const reviewed = after.questions.find((question) => question.questionId === archivedQuestionId)!;
    expect(reviewed).toBeDefined();
    expect(reviewed.isCorrect).toBe(false);
    expect(reviewed.selectedOptionId).not.toBeNull();
    expect(reviewed.options.some((option) => option.isCorrect)).toBe(true);
  });

  it("questão arquivada não entra em tentativas NOVAS (pool filtra PUBLISHED)", async () => {
    const userId = "annul-user-2";
    authMock.mockResolvedValue(fakeSession(userId));
    const repos = getRepositories();

    const first = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const archivedQuestionId = first.questions[0]!.questionId;
    await repos.questions.update({ id: archivedQuestionId, status: "ARCHIVED", now: new Date() });

    const second = await createAttempt(
      userId,
      cfg({ subjectId: SUBJECT_IDS.direitoPenal, quantity: 10 }),
    );
    expect(second.questions.map((question) => question.questionId)).not.toContain(archivedQuestionId);
    await expect(repos.questions.findById(archivedQuestionId)).resolves.not.toBeNull();
  });

  it("questão errada arquivada continua no caderno de erros (não some do histórico)", async () => {
    const userId = "annul-user-3";
    authMock.mockResolvedValue(fakeSession(userId));
    const repos = getRepositories();

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const archivedQuestionId = attempt.questions[0]!.questionId;
    const answers = await Promise.all(
      attempt.questions.map(async (q) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const wrong = options.find((o) => !o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: wrong.id };
      }),
    );
    await submitAndFinalize(userId, { attemptId: attempt.id, answers });

    await repos.questions.update({ id: archivedQuestionId, status: "ARCHIVED", now: new Date() });

    const notebook = await getErrorNotebook(userId);
    const ids = new Set(notebook.map((item) => item.questionId));
    expect(ids.has(archivedQuestionId)).toBe(true);
  });

  it("soft-delete de questão não esconde a alternativa selecionada no resultado (busca crua)", async () => {
    const userId = "annul-user-4";
    authMock.mockResolvedValue(fakeSession(userId));
    const repos = getRepositories();

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const deletedQuestionId = attempt.questions[0]!.questionId;
    const answers = await Promise.all(
      attempt.questions.map(async (q) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const correct = options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: correct.id };
      }),
    );
    await submitAndFinalize(userId, { attemptId: attempt.id, answers });
    await repos.questions.softDelete(deletedQuestionId, new Date());

    const after = await getResult(userId, attempt.id);
    const reviewed = after.questions.find((question) => question.questionId === deletedQuestionId)!;
    expect(reviewed).toBeDefined();
    expect(reviewed.isCorrect).toBe(true);
  });
});