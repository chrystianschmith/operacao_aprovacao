import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));

vi.mock("@/server/auth", () => ({
  auth: authMock,
}));

/**
 * Modo de serviço com penalidade ativa NO CONFIG (`negativeMarkingPerWrong: 0.5` — cada erro
 * anula meio acerto). A função pura `computeScorePercent` recebe a penalidade como argumento,
 * então os casos unitários testam os DOIS modos (0 = sem penalidade e valores > 0) sem depender
 * do mock; os casos de serviço provam que `submitAndFinalize` lê a config e aplica de ponta a
 * ponta. CLAUDE.md §18/§25: nota SEMPRE calculada no servidor, nunca aceita do cliente.
 */
vi.mock("@/config/business", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/config/business")>();
  return {
    ...original,
    SIMULATIONS: { ...original.SIMULATIONS, negativeMarkingPerWrong: 0.5 },
  };
});

// Importados após o mock de "@/server/auth" (usado por "@/server/authorization").
const { createAttempt, submitAndFinalize, getResult, computeScorePercent } = await import(
  "@/server/services/simulations"
);
const { getRepositories } = await import("@/server/repositories");
const { mockExamConfigInputSchema } = await import("@/contracts/simulations");
const { MOCK_EXAM_IDS } = await import("@/mocks");
const { __resetMockMockExamAttemptStore } = await import(
  "@/server/repositories/mock/mock-exam-attempt-repository"
);
const { __resetMockQuestionAttemptStore } = await import(
  "@/server/repositories/mock/question-attempt-repository"
);
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

async function wrongFirstThenCorrect(attempt: Awaited<ReturnType<typeof createAttempt>>) {
  const repos = getRepositories();
  return Promise.all(
    attempt.questions.map(async (q, index) => {
      const options = await repos.questionOptions.listByQuestionId(q.questionId);
      const target = index === 0 ? options.find((o) => !o.isCorrect)! : options.find((o) => o.isCorrect)!;
      return { questionId: q.questionId, selectedOptionId: target.id };
    }),
  );
}

describe("simulations — computeScorePercent (nota centralizada, CLAUDE.md §18/§25)", () => {
  describe("sem penalidade (padrão = 0) — mesmo comportamento legado", () => {
    it("nota = acertos / total (2 casas decimais)", () => {
      expect(computeScorePercent({ correctCount: 4, wrongCount: 1, totalQuestions: 5 })).toBe(80);
      expect(computeScorePercent({ correctCount: 5, wrongCount: 0, totalQuestions: 5 })).toBe(100);
      expect(computeScorePercent({ correctCount: 0, wrongCount: 5, totalQuestions: 5 })).toBe(0);
      expect(computeScorePercent({ correctCount: 1, wrongCount: 1, totalQuestions: 3 })).toBe(33.33);
    });

    it("em branco é neutra: conta no denominador, não no numerador", () => {
      expect(computeScorePercent({ correctCount: 2, wrongCount: 0, blankCount: 1, totalQuestions: 3 })).toBe(
        66.67,
      );
    });

    it("lista vazia não divide por zero", () => {
      expect(computeScorePercent({ correctCount: 0, wrongCount: 0, totalQuestions: 0 })).toBe(0);
    });
  });

  describe("com penalidade (negativeMarkingPerWrong > 0) — CESPE-style", () => {
    it("cada erro anula a fração configurada de um acerto", () => {
      // 4 corretas − 1 erro × 0.5 = 3.5 de 5 → 70%.
      expect(
        computeScorePercent({
          correctCount: 4,
          wrongCount: 1,
          totalQuestions: 5,
          negativeMarkingPerWrong: 0.5,
        }),
      ).toBe(70);
      // 5 corretas − 4 erros × 0.5 = 3 de 6 → 50%.
      expect(
        computeScorePercent({
          correctCount: 5,
          wrongCount: 4,
          totalQuestions: 6,
          negativeMarkingPerWrong: 0.5,
        }),
      ).toBe(50);
    });

    it("penalidade 1 = nota max(0, acertos − erros)", () => {
      expect(
        computeScorePercent({
          correctCount: 4,
          wrongCount: 1,
          totalQuestions: 5,
          negativeMarkingPerWrong: 1,
        }),
      ).toBe(60);
    });

    it("nunca retorna nota negativa (floor em 0)", () => {
      expect(
        computeScorePercent({
          correctCount: 1,
          wrongCount: 5,
          totalQuestions: 5,
          negativeMarkingPerWrong: 0.5,
        }),
      ).toBe(0);
      expect(
        computeScorePercent({
          correctCount: 0,
          wrongCount: 5,
          totalQuestions: 5,
          negativeMarkingPerWrong: 1,
        }),
      ).toBe(0);
    });

    it("ignora penalidade negativa (defesa em profundidade)", () => {
      expect(
        computeScorePercent({
          correctCount: 4,
          wrongCount: 1,
          totalQuestions: 5,
          negativeMarkingPerWrong: -0.5,
        }),
      ).toBe(80);
    });
  });
});

describe("services/simulations — submitAndFinalize aplica a penalidade do CONFIG (0.5)", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamAttemptStore();
    __resetMockQuestionAttemptStore();
    __resetMockGamificationEventStore();
    __resetMockPointTransactionStore();
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("4 corretas + 1 errada em 5 questões → 70% (penalidade em vigor)", async () => {
    const userId = "scoring-penalty-mixed";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const answers = await wrongFirstThenCorrect(attempt);

    vi.setSystemTime(BASE_TIME + 60_000);
    const result = await submitAndFinalize(userId, { attemptId: attempt.id, answers });

    expect(result.correctCount).toBe(4);
    expect(result.wrongCount).toBe(1);
    expect(result.blankCount).toBe(0);
    expect(result.scorePercent).toBe(70);
    expect(result.totalQuestions).toBe(5);
    // Persistido de verdade — uma leitura posterior via `getResult` devolve o mesmo valor.
    const reread = await getResult(userId, attempt.id);
    expect(reread.scorePercent).toBe(70);
  });

  it("tudo errado → 0% (nunca negativo), mesmo com penalidade", async () => {
    const userId = "scoring-penalty-all-wrong";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const repos = getRepositories();
    const answers = await Promise.all(
      attempt.questions.map(async (q) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const wrong = options.find((o) => !o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: wrong.id };
      }),
    );

    vi.setSystemTime(BASE_TIME + 60_000);
    const result = await submitAndFinalize(userId, { attemptId: attempt.id, answers });

    expect(result.correctCount).toBe(0);
    expect(result.wrongCount).toBe(5);
    expect(result.scorePercent).toBe(0);
  });

  it("tudo em branco → 0% (em branco é neutra, não desconta)", async () => {
    const userId = "scoring-penalty-blank";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));

    vi.setSystemTime(BASE_TIME + 60_000);
    const result = await submitAndFinalize(userId, { attemptId: attempt.id, answers: [] });

    expect(result.correctCount).toBe(0);
    expect(result.wrongCount).toBe(0);
    expect(result.blankCount).toBe(5);
    expect(result.scorePercent).toBe(0);
    // Nenhuma questão acertada → sem pontos de `QUESTION_CORRECT` (o `MOCK_EXAM_COMPLETED`
    // recompensa a finalização, não o desempenho — valor do ledger de gamificação).
  });
});