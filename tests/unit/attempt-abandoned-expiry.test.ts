import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));

vi.mock("@/server/auth", () => ({
  auth: authMock,
}));

// Importados após o mock de "@/server/auth". Reaproveita os mesmos resets dos demais testes
// de simulations (stores mock são globais ao processo — testes compartilham estado).
const {
  createAttempt,
  getAttemptForTaking,
  getAttemptStatus,
} = await import("@/server/services/simulations");
const { getRepositories } = await import("@/server/repositories");
const { getAuditRecords } = await import("@/server/audit");
const { mockExamConfigInputSchema } = await import("@/contracts/simulations");
const { MOCK_EXAM_IDS, SUBJECT_IDS } = await import("@/mocks");
const { __resetMockMockExamStore } = await import("@/server/repositories/mock/mock-exam-repository");
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

/**
 * Fluxo de BORDA "simulado abandonado no meio" (CLAUDE.md §25, teste mínimo) — regressão do
 * achado de QA: uma tentativa com cronômetro abandonada (nunca submetida) ficava `IN_PROGRESS`
 * para sempre. Ao reabrir a tela, o servidor devolvia `remainingSeconds: 0` e o cliente
 * disparava um auto-envio imediato EM VEZ de a página expor o estado terminal. Agora a expiração
 * é LAZY nas leituras (`getAttemptForTaking`/`getAttemptStatus`), com a mesma tolerância e a
 * mesma guarda CAS/auditoria da expiração por submissão.
 */
describe("services/simulations — tentativa abandonada expira de forma consistente", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamStore();
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

  it("tentativa DESISTIDA sem submissão deixa de reportar IN_PROGRESS após o tempo + tolerância", async () => {
    const userId = "abandon-user-1";
    authMock.mockResolvedValue(fakeSession(userId));

    // Limite explícito de 1 min (tolerância de 30s ⇒ expira após 90s).
    const attempt = await createAttempt(
      userId,
      cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal, timeLimitMinutes: 1 }),
    );
    expect(attempt.status).toBe("IN_PROGRESS");

    // Usuário começa a responder mas abandona no meio: nunca chama submit. Passa o tempo.
    vi.setSystemTime(BASE_TIME + 100_000);

    // ANTES da correção: o status ainda era IN_PROGRESS (tentativa "morta" no histórico e o
    // cliente reabria com 0s, provocando auto-envio surpresa). AGORA: EXPIRED determinístico.
    const status = await getAttemptStatus(userId, attempt.id);
    expect(status.status).toBe("EXPIRED");
    expect(status.finishedAt).not.toBeNull();

    // A resolução rejeita a tentativa expirada (a tela roteia para o estado terminal).
    await expect(getAttemptForTaking(userId, attempt.id)).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("não gera pontos indevidos para a tentativa abandonada expirada", async () => {
    const userId = "abandon-user-2";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(
      userId,
      cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal, timeLimitMinutes: 1 }),
    );
    vi.setSystemTime(BASE_TIME + 100_000);

    await expect(getAttemptForTaking(userId, attempt.id)).rejects.toMatchObject({ code: "CONFLICT" });

    const repos = getRepositories();
    const { points } = await repos.pointTransactions.sumByUserId(userId);
    expect(points).toBe(0);
    const events = await repos.gamificationEvents.listByUserId(userId);
    expect(events.filter((event) => event.type === "MOCK_EXAM_COMPLETED")).toHaveLength(0);
    // Nenhuma `QuestionAttempt` gravada para a tentativa abandonada.
    const attempts = await repos.questionAttempts.listByUserId(userId);
    expect(attempts).toHaveLength(0);
  });

  it("expiração lazy audita 'attempt-expired' exatamente uma vez", async () => {
    const userId = "abandon-user-3";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(
      userId,
      cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal, timeLimitMinutes: 1 }),
    );
    const expiredAuditsFor = () =>
      getAuditRecords().filter(
        (record) => record.operation === "simulations.attempt-expired" && record.entityId === attempt.id,
      );
    const before = expiredAuditsFor().length;

    vi.setSystemTime(BASE_TIME + 100_000);
    await getAttemptStatus(userId, attempt.id);
    // Leitura repetida não duplica a auditoria nem a transição (CAS já venceu na 1ª).
    await getAttemptStatus(userId, attempt.id);
    await expect(getAttemptForTaking(userId, attempt.id)).rejects.toMatchObject({ code: "CONFLICT" });

    const after = expiredAuditsFor();
    expect(after.length - before).toBe(1);
    expect(after[after.length - 1]?.result).toBe("success");
  });

  it("tentativa sem limite de tempo NUNCA é expirada (fica IN_PROGRESS para continuar depois)", async () => {
    const userId = "abandon-user-4";
    authMock.mockResolvedValue(fakeSession(userId));

    // Simulado personalizado SEM cronômetro (`timeLimitMinutes` não informado ⇒ null).
    const attempt = await createAttempt(
      userId,
      cfg({ subjectId: SUBJECT_IDS.direitoPenal, quantity: 3 }),
    );
    expect(attempt.timeLimitSeconds).toBeNull();

    // Muito depois do tempo "natural" do exame de catálogo, a tentativa continua válida.
    vi.setSystemTime(BASE_TIME + 1000 * 60 * 60 * 24 * 3);
    const status = await getAttemptStatus(userId, attempt.id);
    expect(status.status).toBe("IN_PROGRESS");
    const resumed = await getAttemptForTaking(userId, attempt.id);
    expect(resumed.status).toBe("IN_PROGRESS");
  });

  it("dentro da tolerância de tempo a tentativa continua IN_PROGRESS (não trava quem está respondendo)", async () => {
    const userId = "abandon-user-5";
    authMock.mockResolvedValue(fakeSession(userId));

    const attempt = await createAttempt(
      userId,
      cfg({ mockExamId: MOCK_EXAM_IDS.direitoPenal, timeLimitMinutes: 1 }),
    );

    // 70s: acima do limite (60s) mas DENTRO da tolerância (90s) — leitura não expira.
    vi.setSystemTime(BASE_TIME + 70_000);
    expect((await getAttemptStatus(userId, attempt.id)).status).toBe("IN_PROGRESS");
    expect((await getAttemptForTaking(userId, attempt.id)).status).toBe("IN_PROGRESS");
  });
});