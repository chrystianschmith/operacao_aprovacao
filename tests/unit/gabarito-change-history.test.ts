import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

/**
 * Contrato crítico (CLAUDE.md §18/§25, "mudar gabarito não pode invalidar silenciosamente o
 * histórico de quem respondeu", documentado em `@/contracts/simulations`): a correção de uma
 * tentativa é um SNAPSHOT gravado em `QuestionAttempt` no momento da resposta
 * (`selectedOptionId`/`isCorrect`) e os contadores/nota são congelados na tentativa
 * (`correctCount`/`wrongCount`/`blankCount`/`scorePercent`). Uma mudança de gabarito pelo admin
 * DEPOIS da prova não reescreve nada: o acerto antigo continua acerto, o erro antigo continua
 * erro, e a nota não se move.
 */
const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));
vi.mock("@/server/auth", () => ({ auth: authMock }));

const { createAttempt, submitAndFinalize, getResult } = await import("@/server/services/simulations");
const { getRepositories } = await import("@/server/repositories");
const { updateQuestionForAdmin } = await import("@/server/services/admin/question-service");
const { mockExamConfigInputSchema } = await import("@/contracts/simulations");
const { MOCK_EXAM_IDS } = await import("@/mocks");
const { __resetMockMockExamAttemptStore } = await import(
  "@/server/repositories/mock/mock-exam-attempt-repository"
);
const { __resetMockQuestionAttemptStore } = await import(
  "@/server/repositories/mock/question-attempt-repository"
);
const { __resetMockQuestionStore } = await import("@/server/repositories/mock/question-repository");
const { __resetMockQuestionOptionStore } = await import(
  "@/server/repositories/mock/question-option-repository"
);
const { __resetMockGamificationEventStore } = await import(
  "@/server/repositories/mock/gamification-event-repository"
);
const { __resetMockPointTransactionStore } = await import(
  "@/server/repositories/mock/point-transaction-repository"
);

function fakeSession(id: string, role: NextAuthSession["user"]["role"]): NextAuthSession {
  return {
    user: { id, role, name: "Teste", email: "teste@example.com" },
    expires: new Date(Date.now() + 60_000).toISOString(),
  } as NextAuthSession;
}

function cfg(partial: Parameters<typeof mockExamConfigInputSchema.parse>[0]) {
  return mockExamConfigInputSchema.parse(partial);
}

const BASE_TIME = Date.parse("2026-07-13T10:00:00.000Z");

describe("services/simulations — mudança de gabarito NÃO reescreve o histórico", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamAttemptStore();
    __resetMockQuestionAttemptStore();
    __resetMockQuestionStore();
    __resetMockQuestionOptionStore();
    __resetMockGamificationEventStore();
    __resetMockPointTransactionStore();
    vi.useFakeTimers();
    vi.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Troca o gabarito vigente de uma questão (a resposta correta passa a ser `targetLabel`),
   *  pelo caminho público de admin (`updateQuestionForAdmin` → `replaceForQuestion`). */
  async function moveCorrectOption(questionId: string, targetLabel: string, now: Date) {
    const repos = getRepositories();
    const current = await repos.questionOptions.listByQuestionId(questionId);
    const options = current.map((option) => ({
      label: option.label,
      text: option.text,
      isCorrect: option.label === targetLabel,
    }));
    authMock.mockResolvedValue(fakeSession("user-4", "admin"));
    await updateQuestionForAdmin({ id: questionId, options }, now);
  }

  it("acerto antigo permanece acerto após mudar o gabarito; nota congelada", async () => {
    const userId = "gabarito-acerto";
    // Fase aluno: responder + finalizar.
    authMock.mockResolvedValue(fakeSession(userId, "aluno"));
    ensureAuthenticatedUser(userId);

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const repos = getRepositories();
    const answers = await Promise.all(
      attempt.questions.map(async (q) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        const correct = options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: correct.id };
      }),
    );
    vi.setSystemTime(BASE_TIME + 60_000);
    const result = await submitAndFinalize(userId, { attemptId: attempt.id, answers });
    expect(result.correctCount).toBe(5);
    expect(result.scorePercent).toBe(100);

    // Fase admin: gabarito da 1ª questão muda (correta vira "D").
    await moveCorrectOption("question-penal-01", "D", new Date(BASE_TIME + 120_000));

    // Releitura pós-fato: histórico preservado (sessão volta a ser do aluno).
    authMock.mockResolvedValue(fakeSession(userId, "aluno"));
    const reread = await getResult(userId, attempt.id);
    expect(reread.correctCount).toBe(5);
    expect(reread.wrongCount).toBe(0);
    expect(reread.scorePercent).toBe(100);

    const reviewed = reread.questions.find((q) => q.questionId === "question-penal-01")!;
    // SNAPSHOT da resposta: continuou marcada como acerto e com a alternativa original.
    expect(reviewed.isCorrect).toBe(true);
    expect(reviewed.selectedOptionId).toBe("question-penal-01-opt-A");
    // O GABARITO EXIBIDO é o atual ("como está correto hoje") — isso não move a nota/histórico.
    const currentCorrect = reviewed.options.find((option) => option.isCorrect)!;
    expect(currentCorrect.label).toBe("D");
    expect(currentCorrect.id).not.toBe(reviewed.selectedOptionId);
  });

  it("erro antigo NÃO vira acerto mesmo quando o gabarito novo coincide com a escolha do aluno", async () => {
    const userId = "gabarito-erro";
    ensureAuthenticatedUser(userId);
    authMock.mockResolvedValue(fakeSession(userId, "aluno"));

    const attempt = await createAttempt(userId, cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal }));
    const repos = getRepositories();
    const answers = await Promise.all(
      attempt.questions.map(async (q, index) => {
        const options = await repos.questionOptions.listByQuestionId(q.questionId);
        // 1ª questão: o aluno marca "B" achando ser a certa (gabarito atual = "A").
        const target = index === 0 ? options.find((o) => o.label === "B")! : options.find((o) => o.isCorrect)!;
        return { questionId: q.questionId, selectedOptionId: target.id };
      }),
    );
    vi.setSystemTime(BASE_TIME + 60_000);
    const result = await submitAndFinalize(userId, { attemptId: attempt.id, answers });
    expect(result.correctCount).toBe(4);
    expect(result.wrongCount).toBe(1);
    expect(result.scorePercent).toBe(80);

    // Admin muda o gabarito da 1ª questão para "B" — exatamente a que o aluno marcou.
    await moveCorrectOption("question-penal-01", "B", new Date(BASE_TIME + 120_000));

    authMock.mockResolvedValue(fakeSession(userId, "aluno"));
    const reread = await getResult(userId, attempt.id);
    // A nota e os contadores NÃO mudaram: o erro antigo continua erro.
    expect(reread.correctCount).toBe(4);
    expect(reread.wrongCount).toBe(1);
    expect(reread.scorePercent).toBe(80);

    const reviewed = reread.questions.find((q) => q.questionId === "question-penal-01")!;
    expect(reviewed.isCorrect).toBe(false);
    expect(reviewed.selectedOptionId).toBe("question-penal-01-opt-B");
    expect(reviewed.options.find((option) => option.isCorrect)!.label).toBe("B");
  });
});