import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { PageSkeleton } from "@/components/shared/page-skeleton";

describe("PageSkeleton — feedback de carregamento acessível", () => {
  it("anuncia 'Carregando' via role=status/aria-live sem expor os placeholders", () => {
    render(<PageSkeleton rows={2} />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("aria-live", "polite");

    const announcement = screen.getByText(/carregando conteúdo/i);
    expect(announcement).toHaveClass("sr-only");
    expect(announcement.closest("[aria-hidden='true']")).toBeNull();
  });

  it("mantém os skeletons invisíveis para leitores de tela (aria-hidden)", () => {
    const { container } = render(<PageSkeleton rows={1} />);

    const skeletonRegion = container.querySelector("[aria-hidden='true']");
    expect(skeletonRegion).toBeTruthy();
    expect(skeletonRegion?.classList.contains("space-y-6")).toBe(true);
  });
});