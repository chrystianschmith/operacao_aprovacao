import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthError, ForbiddenError } from "@/server/errors";

const { createCheckout, createBillingPortal, reconcileOwnSubscription } = vi.hoisted(() => ({
  createCheckout: vi.fn(),
  createBillingPortal: vi.fn(),
  reconcileOwnSubscription: vi.fn(),
}));

vi.mock("@/server/billing/service", () => ({
  createCheckout,
  createBillingPortal,
  reconcileOwnSubscription,
}));

const { checkoutAction, billingPortalAction, reconcileBillingAction } = await import(
  "@/server/actions/billing"
);

/**
 * Fluxo CRÍTICO de billing (CLAUDE.md §31 "assinatura") na fronteira das Server Actions:
 * erros de domínio são mapeados para `ActionResult` com o código estável, falhas inesperadas
 * viram INTERNAL_ERROR sem vazar detalhes internos/segrados, e o sucesso devolve a URL segura
 * (checkout/portal Stripe) ou o sinal de refresh.
 */
describe("actions/billing — fronteira (ActionResult)", () => {
  beforeEach(() => {
    createCheckout.mockReset();
    createBillingPortal.mockReset();
    reconcileOwnSubscription.mockReset();
  });

  it("checkoutAction: sucesso devolve a URL do checkout", async () => {
    createCheckout.mockResolvedValue("https://checkout.stripe.com/c/pay/xyz");

    const result = await checkoutAction();

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.url).toBe("https://checkout.stripe.com/c/pay/xyz");
  });

  it("checkoutAction: sem sessão (AuthError do serviço) mapeia para UNAUTHENTICATED", async () => {
    createCheckout.mockRejectedValue(new AuthError());

    const result = await checkoutAction();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("UNAUTHENTICATED");
  });

  it("checkoutAction: falha inesperada vira INTERNAL_ERROR sem vazar o erro interno", async () => {
    createCheckout.mockRejectedValue(new Error("sk_live_THIS_SECRET_MUST_NOT_LEAK"));

    const result = await checkoutAction();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INTERNAL_ERROR");
      expect(result.error.message).not.toContain("sk_live");
    }
  });

  it("billingPortalAction: sem assinatura existente mapeia erro de domínio (FORBIDDEN)", async () => {
    createBillingPortal.mockRejectedValue(new ForbiddenError("Nenhuma assinatura encontrada."));

    const result = await billingPortalAction();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("FORBIDDEN");
      expect(result.error.message).toBe("Nenhuma assinatura encontrada.");
    }
  });

  it("billingPortalAction: sucesso devolve a URL do portal", async () => {
    createBillingPortal.mockResolvedValue("https://billing.stripe.com/session/abc");

    const result = await billingPortalAction();

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.url).toBe("https://billing.stripe.com/session/abc");
  });

  it("reconcileBillingAction: sucesso sinaliza atualização e falha vira erro seguro", async () => {
    reconcileOwnSubscription.mockResolvedValue(undefined);
    const okResult = await reconcileBillingAction();
    expect(okResult.ok).toBe(true);
    if (okResult.ok) expect(okResult.data).toEqual({ refreshed: true });

    reconcileOwnSubscription.mockRejectedValue(new Error("stripe offline"));
    const failResult = await reconcileBillingAction();
    expect(failResult.ok).toBe(false);
    if (!failResult.ok) {
      expect(failResult.error.code).toBe("INTERNAL_ERROR");
      expect(failResult.error.message).not.toContain("stripe");
    }
  });
});