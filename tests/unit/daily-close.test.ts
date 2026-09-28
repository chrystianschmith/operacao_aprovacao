import { beforeEach, describe, expect, it, vi } from "vitest";

// `daily-close.ts`/`goals.ts` importam `@/server/services/gamification`, que depende
// transitivamente de `@/server/auth` — mockar ANTES de importar os módulos sob teste (mesmo
// padrão de `tests/unit/gamification-engine.test.ts`).
vi.mock("@/server/auth", () => ({ auth: vi.fn() }));

const { closeDailyStudyMetrics } = await import("@/server/services/study-tracking/daily-close");
const { getDailyGoalView, getWeeklyGoalView } = await import(
  "@/server/services/study-tracking/goals"
);
const { awardGamificationEvent } = await import("@/server/services/gamification");
const { getRepositories } = await import("@/server/repositories");
const { __resetMockStudySessionStore } = await import("@/server/repositories/mock/study-session-repository");
const { __resetMockLessonProgressStore } = await import("@/server/repositories/mock/lesson-progress-repository");
const { __resetMockGamificationEventStore } = await import(
  "@/server/repositories/mock/gamification-event-repository"
);
const { __resetMockPointTransactionStore } = await import(
  "@/server/repositories/mock/point-transaction-repository"
);
const { __resetMockUserAchievementStore } = await import("@/server/repositories/mock/user-achievement-repository");
const { __resetMockUserStreakStore } = await import("@/server/repositories/mock/user-streak-repository");
const { __resetMockDailyGoalStore } = await import("@/server/repositories/mock/daily-goal-repository");
const { __resetMockWeeklyGoalStore } = await import("@/server/repositories/mock/weekly-goal-repository");
const { __resetHeartbeatRateLimitStore } = await import("@/server/services/study-tracking/rate-limit");

/**
 * Testes do recalc-on-write + fechamento diário (Fase 12 — CLAUDE.md §14/§15/§25):
 * - getters `getDailyGoalView`/`getWeeklyGoalView` são SOMENTE-leitura e progresso ao vivo;
 * - `closeDailyStudyMetrics` materializa streak/metas de um dia FECHADO, de forma idempotente;
 * - descoberta de usuários (`listUserIdsWithActivitySince`, mock) cruza atividade + cache;
 * - award REAL via motor (`PointsAwarded`) re-materializa a meta diária no ato do crédito.
 */

function resetAllStores(): void {
  __resetMockStudySessionStore();
  __resetMockLessonProgressStore();
  __resetMockGamificationEventStore();
  __resetMockPointTransactionStore();
  __resetMockUserAchievementStore();
  __resetMockUserStreakStore();
  __resetMockDailyGoalStore();
  __resetMockWeeklyGoalStore();
  __resetHeartbeatRateLimitStore();
}

describe("study-tracking/daily-close — getters SOMENTE-leitura (Fase 12)", () => {
  beforeEach(resetAllStores);

  it("getDailyGoalView/getWeeklyGoalView NÃO persistem nada e expõem progresso ao vivo", async () => {
    const userId = "readonly-goals";
    const repos = getRepositories();
    const DAY = new Date("2026-07-13T12:00:00.000Z");
    await repos.pointTransactions.create({
      userId,
      gamificationEventId: null,
      idempotencyKey: `seed:${userId}:r`,
      type: "EARN",
      points: 160,
      xp: 160,
      reason: "seed",
      now: DAY,
    });

    const daily = await getDailyGoalView(userId, "2026-07-13T00:00:00.000Z");
    const weekly = await getWeeklyGoalView(userId, "2026-07-13T00:00:00.000Z");

    expect(daily.progressPoints).toBe(160);
    expect(daily.achieved).toBe(false); // materialização ainda não aconteceu (sem PointsAwarded)
    expect(weekly.progressPoints).toBe(160);
    expect(weekly.achieved).toBe(false);

    // Nenhum upsert aconteceu na leitura.
    expect(await repos.dailyGoals.findByUserIdAndDate(userId, "2026-07-13T00:00:00.000Z")).toBeNull();
    expect(await repos.weeklyGoals.findByUserIdAndWeekStart(userId, "2026-07-13T00:00:00.000Z")).toBeNull();
  });
});

describe("study-tracking/daily-close — fechamento diário (Fase 12)", () => {
  beforeEach(resetAllStores);

  async function seedPoints(userId: string, points: number, suffix: string, when: Date): Promise<void> {
    await getRepositories().pointTransactions.create({
      userId,
      gamificationEventId: null,
      idempotencyKey: `seed:${userId}:${suffix}`,
      type: "EARN",
      points,
      xp: points,
      reason: "seed",
      now: when,
    });
  }

  it("fecha o dia-alvo e materializa streak+metas de forma idempotente", async () => {
    const userId = "close-user";
    const TARGET = "2026-07-13T00:00:00.000Z";
    await seedPoints(userId, 300, "a", new Date("2026-07-13T12:00:00.000Z"));
    const repos = getRepositories();

    const result = await closeDailyStudyMetrics({
      date: "2026-07-13",
      now: new Date("2026-07-14T00:00:00.000Z"),
    });
    expect(result.date).toBe("2026-07-13");
    expect(result.userIds).toContain(userId);

    // UserStreak materializado (0 — nenhuma sessão), DailyGoal alcançado (300 >= 150),
    // WeeklyGoal não alcançado (300 < 500).
    const streak = await repos.userStreaks.findByUserId(userId);
    expect(streak).not.toBeNull();
    expect(streak?.currentStreak).toBe(0);
    const daily = await repos.dailyGoals.findByUserIdAndDate(userId, TARGET);
    expect(daily?.achieved).toBe(true);
    const weekly = await repos.weeklyGoals.findByUserIdAndWeekStart(userId, TARGET);
    expect(weekly?.achieved).toBe(false);

    // Bônus de meta diária concedido UMA vez (160 seed + 150 = 310 → 310+150).
    expect((await repos.pointTransactions.sumByUserId(userId)).points).toBe(300 + 150);
    const dailyEvents = (await repos.gamificationEvents.listByUserId(userId)).filter(
      (event) => event.type === "DAILY_GOAL_COMPLETED",
    );
    expect(dailyEvents).toHaveLength(1);

    // Re-executar o fechamento do MESMO dia: idempotente, nada duplica.
    const second = await closeDailyStudyMetrics({
      date: "2026-07-13",
      now: new Date("2026-07-14T00:00:00.000Z"),
    });
    expect(second.usersClosed).toBe(result.usersClosed);
    expect((await repos.pointTransactions.sumByUserId(userId)).points).toBe(300 + 150);
    expect(
      (await repos.gamificationEvents.listByUserId(userId)).filter(
        (event) => event.type === "DAILY_GOAL_COMPLETED",
      ),
    ).toHaveLength(1);
  });

  it("sem corpo fecha ONTEM (UTC) e rejeita data futura/malformada", async () => {
    const result = await closeDailyStudyMetrics({ now: new Date("2026-07-14T10:00:00.000Z") });
    expect(result.date).toBe("2026-07-13");
    expect(result.usersClosed).toBe(0);

    await expect(
      closeDailyStudyMetrics({ date: "2026-07-15", now: new Date("2026-07-14T10:00:00.000Z") }),
    ).rejects.toThrow();
    await expect(closeDailyStudyMetrics({ date: "12/07/2026" })).rejects.toThrow();
  });

  it("descobre usuários por atividade no período E pelos caches materializados (distintos)", async () => {
    const repos = getRepositories();
    const recent = new Date("2026-07-13T09:00:00.000Z");
    const old = new Date("2026-07-01T09:00:00.000Z");

    await seedPoints("u-recent", 10, "r", recent);
    await seedPoints("u-old", 10, "o", old); // fora da janela de 7 dias
    await repos.userStreaks.upsert({
      userId: "u-streak",
      currentStreak: 2,
      longestStreak: 2,
      lastActiveDate: "2026-07-12T00:00:00.000Z",
      freezesAvailable: 0,
      now: recent,
    });

    const ids = await repos.studySessions.listUserIdsWithActivitySince(
      new Date("2026-07-06T00:00:00.000Z").toISOString(),
    );
    expect(ids).toContain("u-recent");
    expect(ids).toContain("u-streak"); // cache materializado entra mesmo sem atividade recente
    expect(ids).not.toContain("u-old");
    expect(new Set(ids).size).toBe(ids.length); // distintos (UNION/Set)
  });
});

describe("study-tracking/daily-close — recalc-on-write via PointsAwarded (Fase 12)", () => {
  beforeEach(resetAllStores);

  it("award REAL no motor re-materializa a meta diária no ato do crédito (2ª aula cruza 150)", async () => {
    const userId = "points-awarded-user";
    const repos = getRepositories();
    const now = new Date("2026-07-13T12:00:00.000Z");

    await awardGamificationEvent({
      userId,
      type: "LESSON_COMPLETED",
      sourceType: "lesson",
      sourceId: "l1",
      idempotencyKey: "test:lesson:awarded:l1",
      reason: "aula",
      now,
    });
    // 100 < 150 → meta NÃO cruzada ainda.
    const dailyBefore = await repos.dailyGoals.findByUserIdAndDate(userId, "2026-07-13T00:00:00.000Z");
    expect(dailyBefore?.achieved).toBe(false);

    await awardGamificationEvent({
      userId,
      type: "LESSON_COMPLETED",
      sourceType: "lesson",
      sourceId: "l2",
      idempotencyKey: "test:lesson:awarded:l2",
      reason: "aula",
      now,
    });

    // 200 >= 150 → o subscriber de `PointsAwarded` (em `goals.ts`) materializou a meta
    // DENTRO do mesmo fluxo do award — sem nenhuma leitura de página.
    const daily = await repos.dailyGoals.findByUserIdAndDate(userId, "2026-07-13T00:00:00.000Z");
    expect(daily?.achieved).toBe(true);
    expect(daily?.achievedAt).not.toBeNull();

    const { points } = await repos.pointTransactions.sumByUserId(userId);
    expect(points).toBe(200 + 150); // 2 aulas (100 cada) + bônus de meta diária (150)
    const dailyEvents = (await repos.gamificationEvents.listByUserId(userId)).filter(
      (event) => event.type === "DAILY_GOAL_COMPLETED",
    );
    expect(dailyEvents).toHaveLength(1);
  });
});