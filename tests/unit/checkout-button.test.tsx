import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: routerRefreshMock }),
}));

const { checkoutAction, billingPortalAction, reconcileBillingAction } = vi.hoisted(() => ({
  checkoutAction: vi.fn(),
  billingPortalAction: vi.fn(),
  reconcileBillingAction: vi.fn(),
}));

const routerRefreshMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/actions/billing", () => ({
  checkoutAction,
  billingPortalAction,
  reconcileBillingAction,
}));

const { CheckoutButton, RefreshBillingButton } = await import(
  "@/app/(student)/assinatura/checkout-button"
);

beforeEach(() => {
  checkoutAction.mockReset();
  billingPortalAction.mockReset();
  reconcileBillingAction.mockReset();
  routerRefreshMock.mockClear();
});

/**
 * Flujo 4/5 (UI de assinatura): o botão de checkout NUCA mostra estado de erro confidencial ao
 * usuário na falha, redireciona só no sucesso, e o refresh dispara `router.refresh()` apenas com
 * `ok` (nunca em falha). O `role="alert"` garante acessibilidade (CLAUDE.md §22).
 */
describe("assinatura/checkout-button — UI de pagamento", () => {
  it("sucesso chama a ação de checkout e redireciona para a URL segura", async () => {
    checkoutAction.mockResolvedValue({ ok: true, data: { url: "https://checkout.stripe.com/c/pay/abc" } });
    const assign = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, assign },
    });

    render(<CheckoutButton />);
    fireEvent.click(screen.getByRole("button", { name: "Continuar para pagamento" }));

    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/abc"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("falha da ação mostra o erro no role=alert e NÃO redireciona", async () => {
    checkoutAction.mockResolvedValue({
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Não foi possível iniciar o pagamento." },
    });
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign },
    });

    render(<CheckoutButton />);
    fireEvent.click(screen.getByRole("button", { name: "Continuar para pagamento" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível iniciar o pagamento.");
    expect(assign).not.toHaveBeenCalled();
  });

  it("modal portal: clique chama billingPortalAction e redireciona em sucesso", async () => {
    billingPortalAction.mockResolvedValue({ ok: true, data: { url: "https://billing.stripe.com/session/x" } });
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign },
    });

    render(<CheckoutButton portal />);
    fireEvent.click(screen.getByRole("button", { name: "Gerenciar assinatura" }));

    await waitFor(() => expect(billingPortalAction).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://billing.stripe.com/session/x"));
  });

  it("RefreshBillingButton: ok dispara router.refresh; falha mostra erro e NÃO chama refresh", async () => {
    reconcileBillingAction.mockResolvedValue({ ok: true, data: { refreshed: true } });

    render(<RefreshBillingButton />);
    fireEvent.click(screen.getByRole("button", { name: "Atualizar situação do pagamento" }));

    await waitFor(() => expect(routerRefreshMock).toHaveBeenCalledTimes(1));

    reconcileBillingAction.mockResolvedValue({
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Serviço indisponível." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Atualizar situação do pagamento" }));

    expect(await screen.findByText("Serviço indisponível.")).toBeInTheDocument();
    expect(routerRefreshMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert")).toHaveTextContent("Serviço indisponível.");
  });
});