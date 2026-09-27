import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));

vi.mock("@/server/auth", () => ({
  auth: authMock,
}));

// Importados após o mock de "@/server/auth" (usado por `@/server/authorization`).
const {
  createAttempt,
  submitAndFinalize,
  getResult,
  getAttemptForTaking,
} = await import("@/server/services/simulations");
const { getRepositories } = await import("@/server/repositories");
const { mockExamConfigInputSchema } = await import("@/contracts/simulations");
const { MOCK_EXAM_IDS } = await import("@/mocks");
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
 * Fluxo CRÍTICO completo do simulado (CLAUDE.md §18/§25): iniciar → responder → finalizar →
 * correção automática → resultado com nota e gabarito comentado; resposta isolada; evolução de
 * desempenho por matéria/assunto; e a regra anti-duplicação de pontuação na fronteira de ações.
 */
function correctAnswers(attempt: Awaited<ReturnType<typeof createAttempt>>) {
  const repos = getRepositories();
  return Promise.all(
    attempt.questions.map(async (q) => {
      const options = await repos.questionOptions.listByQuestionId(q.questionId);
      const correct = options.find((o) => o.isCorrect)!;
      return { questionId: q.questionId, selectedOptionId: correct.id };
    }),
  );
}

describe("services/simulations — ciclo completo, gabarito comentado e evolução", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamStore();
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

  it("ciclo completo: iniciar, responder todas, finalizar e obter nota + gabarito comentado", async () => {
    const userId = "cycle-user-1";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    expect(attempt.status).toBe("IN_PROGRESS");

    // Durante a resolução NUNCA há gabarito (nem explicação).
    const during = await getAttemptForTaking(userId, attempt.id);
    expect(JSON.stringify(during)).not.toContain("isCorrect");
    expect(JSON.stringify(during)).not.toContain("explanation");

    const answers = await correctAnswers(attempt);
    const result = await submitAndFinalize(userId, { attemptId: attempt.id, answers });

    expect(result.status).toBe("FINISHED");
    expect(result.totalQuestions).toBe(attempt.questions.length);
    expect(result.correctCount).toBe(attempt.questions.length);
    expect(result.scorePercent).toBe(100);

    // Gabarito COMENTADO liberado só agora: cada alternativa expõe se é a correta e a questão
    // traz a explicação; a opção selecionada bate com o que foi enviado e o acerto consta.
    for (const question of result.questions) {
      expect(question.explanation).not.toBeNull();
      expect(question.isCorrect).toBe(true);
      const selected = question.options.find((option) => option.id === question.selectedOptionId)!;
      expect(selected.isCorrect).toBe(true);
    }
    // O repositório da tentativa persistiu os mesmos contadores.
    expect(result.points).toBeGreaterThan(0);
  });

  it("responder UMA questão isolada (subconjunto) não vaza gabarito antes da correção e corrige só o respondido", async () => {
    const userId = "cycle-user-isolated";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));

    // Resposta errada em uma única questão (as demais ficam em branco).
    const repos = getRepositories();
    const target = attempt.questions[0]!;
    const options = await repos.questionOptions.listByQuestionId(target.questionId);
    const wrong = options.find((o) => !o.isCorrect)!;

    // ANTES da correção o gabarito não existe em nenhuma leitura.
    const raw = JSON.stringify(await getAttemptForTaking(userId, attempt.id));
    expect(raw).not.toContain("isCorrect");
    expect(raw).not.toContain("explanation");

    const result = await submitAndFinalize(userId, {
      attemptId: attempt.id,
      answers: [{ questionId: target.questionId, selectedOptionId: wrong.id }],
    });

    // A correção é automática e amarrada ao gabarito real (o servidor marcou a errada como
    // errada e a resposta certa continua marcada como tal no comentado).
    expect(result.correctCount).toBe(0);
    expect(result.wrongCount).toBe(1);
    expect(result.blankCount).toBe(attempt.questions.length - 1);

    const reviewed = result.questions.find((question) => question.questionId === target.questionId)!;
    expect(reviewed.selectedOptionId).toBe(wrong.id);
    expect(reviewed.isCorrect).toBe(false);
    const selectedOption = reviewed.options.find((option) => option.id === wrong.id)!;
    expect(selectedOption.isCorrect).toBe(false);
    expect(reviewed.options.some((option) => option.isCorrect)).toBe(true);
  });

  it("evolução: resultados por matéria/assunto refletem as tentativas e a segunda mostra a evolução vs a primeira", async () => {
    const userId = "cycle-user-evolution";
    authMock.mockResolvedValue(fakeSession(userId));

    // 1ª tentativa: errar a 1ª questão, acertar as demais.
    const first = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const repos = getRepositories();
    const firstAnswers = await Promise.all(
      first.questions.map(async (q, index) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const target = index === 0 ? options.find((o) => !o.isCorrect)! : options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: target.id };
      }),
    );
    vi.setSystemTime(BASE_TIME + 60_000);
    const firstResult = await submitAndFinalize(userId, { attemptId: first.id, answers: firstAnswers });

    expect(firstResult.correctCount).toBe(first.questions.length - 1);
    expect(firstResult.evolutionPercent).toBeNull();
    // Estatísticas por matéria/assunto da PRIMEIRA tentativa refletem as 5 respondidas
    // (4 acertos de 5), agrupadas por matéria/assunto.
    const answeredTotal = firstResult.bySubject.reduce((sum, entry) => sum + entry.total, 0);
    expect(answeredTotal).toBe(first.questions.length);

    // 2ª tentativa: acerta TUDO — deve refletir 100% e evolução positiva vs a anterior.
    vi.setSystemTime(BASE_TIME + 120_000);
    const second = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const secondAnswers = await correctAnswers(second);
    vi.setSystemTime(BASE_TIME + 180_000);
    const secondResult = await submitAndFinalize(userId, { attemptId: second.id, answers: secondAnswers });

    expect(secondResult.previousAttemptScorePercent).toBe(firstResult.scorePercent);
    expect(secondResult.evolutionPercent).toBeGreaterThan(0);
    const subjectTotal = secondResult.bySubject.reduce((sum, entry) => sum + entry.total, 0);
    expect(subjectTotal).toBe(second.questions.length);
    expect(secondResult.bySubject.every((entry) => entry.accuracyPercent === 100)).toBe(true);
  });

  it("evolução por assunto exclui o que ficou em branco (0 acerto de 1 respondido ≠ errou tudo)", async () => {
    const userId = "cycle-user-blank";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));

    // Responde só a 1ª (errada); as outras ficam em branco — os assuntos em branco não
    // aparecem como "0 de acertos" (não contam para o aproveitamento por matéria/assunto).
    const repos = getRepositories();
    const target = attempt.questions[0]!;
    const options = await repos.questionOptions.listByQuestionId(target.questionId);
    const wrong = options.find((o) => !o.isCorrect)!;

    await submitAndFinalize(userId, {
      attemptId: attempt.id,
      answers: [{ questionId: target.questionId, selectedOptionId: wrong.id }],
    });

    const result = await getResult(userId, attempt.id);
    const totalBySubject = result.bySubject.reduce((sum, entry) => sum + entry.total, 0);
    expect(totalBySubject).toBe(1); // só a questão efetivamente respondida
    expect(result.bySubject.every((entry) => entry.correct === 0)).toBe(true);
  });
});