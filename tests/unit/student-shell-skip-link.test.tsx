import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/layout/sidebar", () => ({
  Sidebar: () => null,
}));

vi.mock("@/components/layout/topbar", () => ({
  Topbar: () => null,
}));

const { StudentShell } = await import("@/components/layout/student-shell");

describe("StudentShell — navegação por teclado (skip-link)", () => {
  it("expõe um skip-link que aponta para o conteúdo principal, como PRIMEIRO alvo de tabulação", async () => {
    const user = userEvent.setup();
    render(
      <StudentShell>
        <p>Conteúdo da página</p>
      </StudentShell>,
    );

    const skipLink = screen.getByRole("link", { name: /pular para o conteúdo principal/i });
    const main = screen.getByRole("main");

    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");

    await user.tab();
    expect(skipLink).toHaveFocus();
  });

  it("foca o conteúdo ao ativar o skip-link (mesma página, âncora presente)", () => {
    render(<StudentShell>Conteúdo</StudentShell>);

    const main = screen.getByRole("main");
    main.focus();

    expect(main).toHaveFocus();
    expect(main).toHaveTextContent("Conteúdo");
  });
});