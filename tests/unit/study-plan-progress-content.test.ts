import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";
import type { GeneratePlanInput } from "@/contracts/study-plan";

/**
 * Progresso do plano de estudos (CLAUDE.md §31 item 13): `computeProgress` distingue
 * DONE/PENDING/SKIPPED corretamente (SKIPPED não vira conclusão nem atraso), a regeneração
 * substitui itens e zera o progresso (conteúdo mudou), e renomear uma matéria via admin se
 * reflete no plano lido por `getPlan` (o DTO resolve os NOMES ao vivo, ADR-0003).
 */
const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));
vi.mock("@/server/auth", () => ({ auth: authMock }));

const { generatePlan, getPlan, updatePlanItem } = await import("@/server/services/study-plan");
const { updateSubjectForAdmin } = await import("@/server/services/admin/subject-service");
const { __resetMockStudyPlanStore } = await import("@/server/repositories/mock/study-plan-repository");
const { __resetMockStudyPlanItemStore } = await import(
  "@/server/repositories/mock/study-plan-item-repository"
);
const { __resetMockSubjectStore } = await import("@/server/repositories/mock/subject-repository");
const { SUBJECT_IDS } = await import("@/mocks");

function studentSession(id: string): NextAuthSession {
  ensureAuthenticatedUser(id);
  return {
    user: { id, role: "aluno", name: "Teste", email: "teste@example.com" },
    expires: new Date(Date.now() + 60_000).toISOString(),
  } as NextAuthSession;
}

function adminSession(): NextAuthSession {
  return {
    user: { id: "user-4", role: "admin", name: "Admin", email: "admin@example.com" },
    expires: new Date(Date.now() + 60_000).toISOString(),
  } as NextAuthSession;
}

const BASE_INPUT: Omit<GeneratePlanInput, "subjectWeights"> = {
  examDate: "2026-07-27T00:00:00.000Z",
  startDate: "2026-07-06T00:00:00.000Z",
  daysPerWeek: 6,
  hoursPerDay: 1,
  includeReviews: true,
  includeMockExams: true,
};

const FIXED_NOW = new Date("2026-07-06T08:00:00.000Z");
const LATER_NOW = new Date("2026-07-10T08:00:00.000Z");

function matInput() {
  return { ...BASE_INPUT, subjectWeights: [{ subjectId: SUBJECT_IDS.matematica, weight: 1 }] };
}

const round2 = (value: number) => Math.round(value * 10_000) / 100;

describe("services/study-plan — progresso reflete conteúdo e muda quando o conteúdo muda", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockStudyPlanStore();
    __resetMockStudyPlanItemStore();
    __resetMockSubjectStore();
  });

  it("concluir um item incrementa doneItems/progressPercent; desmarcar reverte", async () => {
    const userId = "plan-progress-toggle";
    authMock.mockResolvedValue(studentSession(userId));

    const plan = await generatePlan(userId, matInput(), FIXED_NOW);
    expect(plan.progress.doneItems).toBe(0);
    expect(plan.progress.progressPercent).toBe(0);

    const first = plan.items[0]!;
    await updatePlanItem(userId, { planId: plan.id, itemId: first.id, status: "DONE" });

    const after = await getPlan(userId, FIXED_NOW);
    expect(after!.progress.doneItems).toBe(1);
    expect(after!.progress.progressPercent).toBe(round2(1 / after!.progress.totalItems));

    // Desmarcar (voltar para PENDING) limpa `completedAt` e reverte o progresso.
    await updatePlanItem(userId, { planId: plan.id, itemId: first.id, status: "PENDING" });
    const undone = await getPlan(userId, FIXED_NOW);
    expect(undone!.progress.doneItems).toBe(0);
    expect(undone!.items.find((item) => item.id === first.id)!.completedAt).toBeNull();
  });

  it("SKIPPED não conta como concluído e deixa de contar como atraso", async () => {
    const userId = "plan-progress-skip";
    authMock.mockResolvedValue(studentSession(userId));

    // `LATER_NOW` está 4 dias após o start: itens PENDING dos dias 07-06..07-09 ficam ATRASADOS.
    const plan = await generatePlan(userId, matInput(), LATER_NOW);
    expect(plan.progress.overdueItems).toBeGreaterThan(0);

    const overdueItem = plan.items.find(
      (item) =>
        item.status === "PENDING" &&
        item.targetDate !== null &&
        item.targetDate < "2026-07-10T00:00:00.000Z",
    )!;
    expect(overdueItem).toBeDefined();

    await updatePlanItem(userId, { planId: plan.id, itemId: overdueItem.id, status: "SKIPPED" });
    const after = await getPlan(userId, LATER_NOW);

    // Saiu da contagem de atraso SEM ter virado conclusão.
    expect(after!.progress.overdueItems).toBe(plan.progress.overdueItems - 1);
    expect(after!.progress.doneItems).toBe(0);
  });

  it("regeneração substitui os itens e ZERA o progresso (conteúdo mudou)", async () => {
    const userId = "plan-progress-regen";
    authMock.mockResolvedValue(studentSession(userId));

    const plan = await generatePlan(userId, matInput(), FIXED_NOW);
    await updatePlanItem(userId, { planId: plan.id, itemId: plan.items[0]!.id, status: "DONE" });

    const regenerated = await generatePlan(userId, matInput(), FIXED_NOW);
    expect(regenerated.items.length).toBe(plan.items.length);
    expect(regenerated.progress.doneItems).toBe(0);
    // O item recém-criado voltou a PENDING e sem completedAt.
    expect(regenerated.items.every((item) => item.status === "PENDING")).toBe(true);
  });

  it("renomear a matéria via admin se reflete no plano (nomes resolvidos ao vivo)", async () => {
    const userId = "plan-progress-rename";
    authMock.mockResolvedValue(studentSession(userId));

    const plan = await generatePlan(userId, matInput(), FIXED_NOW);
    const mathItem = plan.items.find((item) => item.subjectId === SUBJECT_IDS.matematica)!;
    expect(mathItem.subjectName).toBe("Matemática");

    // Admin renomeia a matéria.
    authMock.mockResolvedValue(adminSession());
    await updateSubjectForAdmin({ id: SUBJECT_IDS.matematica, name: "Matemática — Edital 2026" }, FIXED_NOW);

    // O plano continua íntegro e passa a exibir o novo nome (sem regenerar).
    authMock.mockResolvedValue(studentSession(userId));
    const refreshed = await getPlan(userId, FIXED_NOW);
    expect(refreshed!.items.find((item) => item.subjectId === SUBJECT_IDS.matematica)!.subjectName).toBe(
      "Matemática — Edital 2026",
    );
    const weight = refreshed!.subjectWeights.find((entry) => entry.subjectId === SUBJECT_IDS.matematica)!;
    expect(weight.subjectName).toBe("Matemática — Edital 2026");
    expect(weight.weight).toBeGreaterThan(0);
  });
});