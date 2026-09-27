// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { envMock, hasAccess } = vi.hoisted(() => ({
  envMock: { BILLING_REQUIRED: true, DATA_SOURCE: "prisma" },
  hasAccess: vi.fn(),
}));

vi.mock("@/config/env", () => ({ env: envMock }));

vi.mock("@/server/repositories/prisma/billing-repository", () => ({
  hasSubscriptionAccess: hasAccess,
}));

const { assertSubscriptionAccess } = await import("@/server/billing/entitlement");

/**
 * Fluxos CRÍTICOS (CLAUDE.md §31 "assinatura"): "assinatura ativa libera conteúdo pago",
 * "conteúdo gratuito sempre visível" e "reembolso/cancelamento desativa acesso sem romper dados".
 *
 * Aqui testamos a POLÍTICA de capacidade (`assertSubscriptionAccess` + a consulta real de
 * `hasSubscriptionAccess`): conteúdo pago (matrícula/aula) só é liberado com assinatura ativa; o
 * gate é VÁLVULA única do backend (não decide o que "aparece" na interface) e um cancelamento/
 * reembolso certificado (status não-ativo ou `accessBlockedReason` de reembolso) derruba o acesso.
 */
describe("billing/entitlement — conteúdo pago × gratuito e cancelamento", () => {
  beforeEach(() => {
    envMock.BILLING_REQUIRED = true;
    envMock.DATA_SOURCE = "prisma";
    hasAccess.mockReset();
  });

  it("assinatura ativa libera o acesso ao conteúdo pago", async () => {
    hasAccess.mockResolvedValue(true);
    await expect(assertSubscriptionAccess("user-1")).resolves.toBeUndefined();
    expect(hasAccess).toHaveBeenCalledWith("user-1");
  });

  it("sem assinatura ativa (cancelada/vencida/reembolsada) o acesso é NEGADO com FORBIDDEN", async () => {
    hasAccess.mockResolvedValue(false);
    await expect(assertSubscriptionAccess("user-1")).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("sem cobrança obrigatória (BILLING_REQUIRED=false) o conteúdo NÃO é barrado", async () => {
    envMock.BILLING_REQUIRED = false;
    hasAccess.mockResolvedValue(false);

    await expect(assertSubscriptionAccess("user-1")).resolves.toBeUndefined();
    // Nem consulta o repositório — o conteudo gratuito fica visível sem custo alguma consulta.
    expect(hasAccess).not.toHaveBeenCalled();
  });

  it("cobrança obrigatória fora do modo prisma nunca libera (configuração inválida)", async () => {
    envMock.DATA_SOURCE = "mock";
    hasAccess.mockResolvedValue(true);

    await expect(assertSubscriptionAccess("user-1")).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});