import { describe, beforeEach, expect, it } from "vitest";
import {
  MockPointTransactionRepository,
  __resetMockPointTransactionStore,
} from "@/server/repositories/mock/point-transaction-repository";
import {
  MockGamificationEventRepository,
  __resetMockGamificationEventStore,
} from "@/server/repositories/mock/gamification-event-repository";
import { toCalendarDateIso } from "@/server/services/study-tracking/activity-days";

/**
 * Paridade dos métodos AGREGADOS do mock (`sumPointsByDate`/`countByType`) com a semântica que
 * eles substituem (`listByUserId` + agrupamento em memória). Os serviços dependem do repositório
 * mock em testes/CI padrão — se um dia o mock divergir do prisma, é aqui que aparece.
 */
describe("mock aggregate repository methods match listByUserId grouping", () => {
  beforeEach(() => {
    __resetMockPointTransactionStore();
    __resetMockGamificationEventStore();
  });

  it("sumPointsByDate agrupa o ledger mock exatamente como listByUserId + toCalendarDateIso", async () => {
    const repo = new MockPointTransactionRepository();
    for (const timezone of ["UTC", "America/Sao_Paulo"]) {
      const transactions = await repo.listByUserId("user-1");
      const expected = new Map<string, number>();
      for (const transaction of transactions) {
        const date = toCalendarDateIso(transaction.createdAt, timezone);
        expected.set(date, (expected.get(date) ?? 0) + transaction.points);
      }
      const rows = await repo.sumPointsByDate("user-1", timezone);
      expect(new Map(rows.map((row) => [row.date, row.points]))).toEqual(expected);
      expect(rows.every((row) => row.date.endsWith("T00:00:00.000Z"))).toBe(true);
    }
  });

  it("countByType conta eventos mock exatamente como listByUserId filtrado por tipo", async () => {
    const repo = new MockGamificationEventRepository();
    const events = await repo.listByUserId("user-1");
    const expected = new Map<string, number>();
    for (const event of events) expected.set(event.type, (expected.get(event.type) ?? 0) + 1);
    const rows = await repo.countByType("user-1");
    expect(new Map(rows.map((row) => [row.type, row.count]))).toEqual(expected);
    expect(rows.length).toBeGreaterThan(0);
  });

  it("ambos os agregados ignoram transações/eventos de outros usuários", async () => {
    const pointsRepo = new MockPointTransactionRepository();
    const eventsRepo = new MockGamificationEventRepository();
    const seedUserId = "user-1";
    const points = await pointsRepo.listByUserId(seedUserId);
    const rowsPoints = await pointsRepo.sumPointsByDate(seedUserId, "UTC");
    expect(rowsPoints.reduce((sum, row) => sum + row.points, 0)).toBe(
      points.reduce((sum, transaction) => sum + transaction.points, 0),
    );
    const events = await eventsRepo.listByUserId(seedUserId);
    const rowsEvents = await eventsRepo.countByType(seedUserId);
    expect(rowsEvents.reduce((sum, row) => sum + row.count, 0)).toBe(events.length);
  });
});