import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

/**
 * Desempenho/evolução (CLAUDE.md §17/§18): a "tentativa anterior" usada em
 * `previousAttemptScorePercent`/`evolutionPercent` considera SÓ tentativas FINALIZADAS
 * (`FINISHED`). Uma tentativa abandonada/expirada (`EXPIRED`) nunca entra como "anterior",
 * nunca grava `QuestionAttempt` (portanto não polui caderno de erros nem aproveitamento por
 * matéria/assunto) e continua visível no histórico com status real e nota nula.
 */
const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));
vi.mock("@/server/auth", () => ({ auth: authMock }));

const { createAttempt, submitAndFinalize, getResult, getHistory, getErrorNotebook } = await import(
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
const { __resetMockQuestionFavoriteStore } = await import(
  "@/server/repositories/mock/question-favorite-repository"
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

describe("services/simulations — tentativa abandonada/expirada não afeta desempenho", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamAttemptStore();
    __resetMockQuestionAttemptStore();
    __resetMockQuestionFavoriteStore();
    __resetMockGamificationEventStore();
    __resetMockPointTransactionStore();
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("evolução compara só com FINISHED anteriores; EXPIRED não vira 'anterior' nem pontua", async () => {
    const userId = "abandon-perf-user";
    authMock.mockResolvedValue(fakeSession(userId));
    const repos = getRepositories();

    // 1ª tentativa: 4 corretas + 1 errada → 80%.
    const first = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const firstAnswers = await Promise.all(
      first.questions.map(async (q, index) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const target = index === 0 ? options.find((o) => !o.isCorrect)! : options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: target.id };
      }),
    );
    vi.setSystemTime(BASE_TIME + 60_000);
    const firstResult = await submitAndFinalize(userId, { attemptId: first.id, answers: firstAnswers });
    expect(firstResult.scorePercent).toBe(80);

    // 2ª tentativa: CRIA, mas nunca responde — expira (abandono). Nenhuma `QuestionAttempt` deve
    // ser gravada e o status vira EXPIRED.
    vi.setSystemTime(BASE_TIME + 120_000);
    const abandoned = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const abandonedEntity = await repos.mockExamAttempts.findById(abandoned.id);
    const expired = await repos.mockExamAttempts.expire({
      id: abandonedEntity!.id,
      expectedVersion: abandonedEntity!.version,
      now: new Date(BASE_TIME + 150_000),
    });
    expect(expired!.status).toBe("EXPIRED");

    // 3ª tentativa: todas corretas → 100%.
    vi.setSystemTime(BASE_TIME + 180_000);
    const third = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const thirdAnswers = await Promise.all(
      third.questions.map(async (q) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const correct = options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: correct.id };
      }),
    );
    vi.setSystemTime(BASE_TIME + 240_000);
    const thirdResult = await submitAndFinalize(userId, { attemptId: third.id, answers: thirdAnswers });

    // A "anterior" da 3ª é a 1ª (80%), NUNCA a tentativa EXPIRED.
    expect(thirdResult.previousAttemptScorePercent).toBe(80);
    expect(thirdResult.evolutionPercent).toBe(20);

    // A tentativa abandonada não gravou respostas nem poluiu o aproveitamento.
    expect(await repos.questionAttempts.listByMockExamAttemptId(abandoned.id)).toHaveLength(0);
    const subjectTotal = thirdResult.bySubject.reduce((sum, entry) => sum + entry.total, 0);
    expect(subjectTotal).toBe(third.questions.length);

    // Não pontuou (nenhum QuestionCorrect/MockExamCompleted para ela).
    const history = await getHistory(userId);
    const abandonedItem = history.find((item) => item.attemptId === abandoned.id)!;
    expect(abandonedItem.status).toBe("EXPIRED");
    expect(abandonedItem.scorePercent).toBeNull();
    expect(abandonedItem.correctCount).toBeNull();

    // `getResult` rejeita leitura de gabarito de tentativa não finalizada.
    await expect(getResult(userId, abandoned.id)).rejects.toThrow();
  });

  it("caderno de erros só reflete questões respondidas em tentativas FINALIZADAS", async () => {
    const userId = "abandon-notebook-user";
    authMock.mockResolvedValue(fakeSession(userId));
    const repos = getRepositories();

    // Tentativa abandonada sem respostas.
    const abandoned = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const entity = await repos.mockExamAttempts.findById(abandoned.id);
    await repos.mockExamAttempts.expire({
      id: entity!.id,
      expectedVersion: entity!.version,
      now: new Date(BASE_TIME + 30_000),
    });

    const notebook = await getErrorNotebook(userId);
    // Nenhuma questão do simulado abandonado aparece como erro.
    for (const question of abandoned.questions) {
      expect(notebook.some((item) => item.questionId === question.questionId)).toBe(false);
    }
  });
});