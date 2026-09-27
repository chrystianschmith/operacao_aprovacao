// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: { subscription: { findFirst: vi.fn() } },
}));

vi.mock("@/server/db/prisma", () => ({ prisma: prismaMock }));

const { hasSubscriptionAccess } = await import(
  "@/server/repositories/prisma/billing-repository"
);

/**
 * Fluxo CRÍTICO "webhook de cancelamento/reembolso desativa acesso" (CLAUDE.md §31 assinatura):
 * a POLÍTICA de acesso pago é uma VÁLVULA do backend (consulta a assinatura REAL). Testamos a
 * consulta original de `hasSubscriptionAccess` contra um banco falso para fixar a semântica que
 * o webhook usa para derrubar o acesso: status não-ativo (CANCELED/EXPIRED), plano FREE,
 * `accessBlockedReason` de reembolso ou período vigente vencido NUNCA devolvem acesso.
 */
describe("hasSubscriptionAccess — assinatura desativada (cancelamento/reembolso/vencimento)", () => {
  beforeEach(() => {
    prismaMock.subscription.findFirst.mockReset();
  });

  it("sem assinatura ativa não há acesso", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue(null);

    expect(await hasSubscriptionAccess("user-1")).toBe(false);
  });

  it("assinatura ativa no período vigente libera o acesso", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue({ id: "s1" });

    expect(await hasSubscriptionAccess("user-1")).toBe(true);
  });

  it("a consulta só considera Stripe, sem bloqueio, pago (não FREE), ativo e no período vigente", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue({ id: "s1" });
    await hasSubscriptionAccess("user-1");

    const filter = prismaMock.subscription.findFirst.mock.calls.at(-1)![0];
    expect(filter.where.userId).toBe("user-1");
    expect(filter.where.provider).toBe("stripe");
    expect(filter.where.accessBlockedReason).toBeNull();
    expect(filter.where.plan).toEqual({ not: "FREE" });
    expect(filter.where.status).toEqual({ in: ["ACTIVE", "TRIALING"] });
    expect(filter.where.currentPeriodEnd).toEqual({ gt: expect.any(Date) });
  });

  it("período vigente é avaliado contra o AGORA (assinatura vencida não passa no filtro)", async () => {
    prismaMock.subscription.findFirst.mockResolvedValue({ id: "s1" });
    await hasSubscriptionAccess("user-1");

    const boundary = new Date(
      (prismaMock.subscription.findFirst.mock.calls.at(-1)![0].where.currentPeriodEnd as {
        gt: Date;
      }).gt,
    ).getTime();
    // O filtro usa um "now" fresco no momento da consulta: uma assinatura cujo
    // `currentPeriodEnd` já passou fica FORA de `gt`, logo o acesso cai.
    expect(Math.abs(boundary - Date.now())).toBeLessThan(60_000);
    expect(boundary).toBeGreaterThan(0);
  });
});