import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));

vi.mock("@/server/auth", () => ({
  auth: authMock,
}));

const { createAttemptAction, submitAttemptAction } = await import("@/server/actions/simulations");
const { getRepositories } = await import("@/server/repositories");
const { MOCK_EXAM_IDS } = await import("@/mocks");
const { GAMIFICATION_REWARDS } = await import("@/config/business");
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
const { __resetSimulationsRateLimitStore } = await import("@/server/services/simulations");

function fakeSession(role: NextAuthSession["user"]["role"], id: string): NextAuthSession {
  ensureAuthenticatedUser(id, role);
  return {
    user: { id, role, name: "Teste", email: "teste@example.com" },
    expires: new Date(Date.now() + 60_000).toISOString(),
  } as NextAuthSession;
}

/**
 * Fluxo CRÍTICO "pontuação nunca é duplicada" (CLAUDE.md §25 "mesma aula não pode gerar pontos
 * duas vezes", §15 "toda recompensa idempotente") na FRONTEIRA de Server Actions: após finalizar,
 * qualquer segunda finalização da mesma tentativa é rejeitada com CONFLICT E o ledger de pontos
 * continua exatamente igual. Complementa `simulations-service.test.ts`, que já prova o mesmo no
 * nível de service com corrida concorrente.
 */
describe("actions/simulations — pontuação idempotente e anti dupla-finalização", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamStore();
    __resetMockMockExamAttemptStore();
    __resetMockQuestionAttemptStore();
    __resetMockQuestionFavoriteStore();
    __resetMockGamificationEventStore();
    __resetMockPointTransactionStore();
    __resetSimulationsRateLimitStore();
  });

  it("segunda finalização da mesma tentativa é rejeitada e NÃO credita pontos duas vezes", async () => {
    const userId = "idem-action-user";
    authMock.mockResolvedValue(fakeSession("aluno", userId));

    const created = await createAttemptAction({ mockExamId: MOCK_EXAM_IDS.direitoPenal });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    // Respostas 100% corretas (gabarito real do repositório — nunca do DTO).
    const repos = getRepositories();
    const answers = await Promise.all(
      created.data.questions.map(async (q) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const correct = options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: correct.id };
      }),
    );

    const first = await submitAttemptAction({ attemptId: created.data.id, answers });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const pointsAfterFirst = (await repos.pointTransactions.sumByUserId(userId)).points;
    expect(pointsAfterFirst).toBeGreaterThan(0);

    // Mesmas respostas de novo → CONFLICT, não um novo "acerto".
    __resetSimulationsRateLimitStore();
    const second = await submitAttemptAction({ attemptId: created.data.id, answers });
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("CONFLICT");

    const pointsAfterSecond = (await repos.pointTransactions.sumByUserId(userId)).points;
    expect(pointsAfterSecond).toBe(pointsAfterFirst);

    // E não há mais de um evento de conclusão para a mesma tentativa.
    const events = await repos.gamificationEvents.listByUserId(userId);
    const completed = events.filter((event) => event.type === "MOCK_EXAM_COMPLETED");
    expect(completed).toHaveLength(1);
  });

  it("payload com pontos forjados não altera o ledger (pontos vêm sempre do backend)", async () => {
    const userId = "idem-action-forge";
    authMock.mockResolvedValue(fakeSession("aluno", userId));

    const created = await createAttemptAction({ mockExamId: MOCK_EXAM_IDS.direitoPenal });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const forged = {
      attemptId: created.data.id,
      answers: created.data.questions.map((q) => ({ questionId: q.questionId, selectedOptionId: null })),
      points: 999_999,
      scorePercent: 100,
    };

    const result = await submitAttemptAction(forged as never);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.scorePercent).toBe(0);
      // O "999999" forjado não entrou: para um gabarito 100% em branco, o ÚNICO crédito é o
      // de simulado concluído (backend), nunca o valor inventado no payload.
      expect(result.data.points).toBe(GAMIFICATION_REWARDS.MOCK_EXAM_COMPLETED.points);
    }
    const { points } = await getRepositories().pointTransactions.sumByUserId(userId);
    expect(points).toBe(GAMIFICATION_REWARDS.MOCK_EXAM_COMPLETED.points);
  });
});