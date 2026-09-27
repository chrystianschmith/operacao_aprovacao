import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AttemptDTO } from "@/contracts/simulations";

const { pushMock, submitAttemptActionMock, toggleFavoriteActionMock, toastSuccessMock, toastErrorMock } =
  vi.hoisted(() => ({
    pushMock: vi.fn(),
    submitAttemptActionMock: vi.fn(),
    toggleFavoriteActionMock: vi.fn(),
    toastSuccessMock: vi.fn(),
    toastErrorMock: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccessMock, error: toastErrorMock },
}));

vi.mock("@/server/actions/simulations", () => ({
  submitAttemptAction: submitAttemptActionMock,
  toggleFavoriteAction: toggleFavoriteActionMock,
}));

const { AttemptRunner } = await import("@/components/simulations/attempt-runner");

function makeAttempt(): AttemptDTO {
  return {
    id: "attempt-1",
    mockExamId: "exam-1",
    mockExamTitle: "Simulado de Teste",
    status: "IN_PROGRESS",
    startedAt: "2026-07-13T10:00:00.000Z",
    timeLimitSeconds: 600,
    remainingSeconds: 300,
    questions: [
      {
        questionId: "q1",
        statement: "Qual a capital do Brasil?",
        subjectName: "Geografia",
        topicName: null,
        board: null,
        difficulty: "EASY",
        options: [
          { id: "q1-a", label: "A", text: "Rio de Janeiro" },
          { id: "q1-b", label: "B", text: "Brasília" },
        ],
      },
      {
        questionId: "q2",
        statement: "Quanto é 2 + 2?",
        subjectName: "Matemática",
        topicName: null,
        board: null,
        difficulty: "EASY",
        options: [
          { id: "q2-a", label: "A", text: "3" },
          { id: "q2-b", label: "B", text: "4" },
        ],
      },
    ],
  };
}

describe("AttemptRunner — a11y durante a navegação do simulado", () => {
  beforeEach(() => {
    pushMock.mockReset();
    submitAttemptActionMock.mockReset();
    toggleFavoriteActionMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("mantém o cronômetro em uma barra fixa (sticky) sempre visível durante a resolução", () => {
    render(<AttemptRunner attempt={makeAttempt()} initialFavoriteQuestionIds={[]} />);

    const statusBar = screen.getByTestId("attempt-status-bar");
    expect(statusBar.className).toContain("sticky");
    expect(statusBar.className).toContain("top-16");
    expect(statusBar.getAttribute("data-testid")).toBe("attempt-status-bar");

    const timerInside = statusBar.querySelector('[role="timer"]');
    expect(timerInside).toBeTruthy();
    expect(screen.getByRole("timer")).toBeTruthy();
  });

  it("ao avançar para a próxima questão, move o foco para o novo rótulo da questão", async () => {
    const user = userEvent.setup();
    render(<AttemptRunner attempt={makeAttempt()} initialFavoriteQuestionIds={[]} />);

    await user.click(screen.getByRole("button", { name: "Próxima" }));

    const active = document.activeElement as HTMLElement | null;
    expect(active?.textContent).toContain("Questão 2 de 2");
  });

  it("ao voltar para a questão anterior, move o foco para o rótulo dela", async () => {
    const user = userEvent.setup();
    render(<AttemptRunner attempt={makeAttempt()} initialFavoriteQuestionIds={[]} />);

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect((document.activeElement as HTMLElement).textContent).toContain("Questão 2 de 2");

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect((document.activeElement as HTMLElement).textContent).toContain("Questão 1 de 2");
  });

  it("anuncia a mudança de questão via aria-live (região sr-only)", async () => {
    const user = userEvent.setup();
    const { container } = render(<AttemptRunner attempt={makeAttempt()} initialFavoriteQuestionIds={[]} />);

    await user.click(screen.getByRole("button", { name: "Próxima" }));

    const liveRegion = container.querySelector('[data-testid="attempt-question-announcement"]');
    expect(liveRegion).toBeTruthy();
    await waitFor(() => expect(liveRegion?.textContent).toContain("Questão 2 de 2"));
  });

  it("desabilita Anterior na primeira questão e Próxima na última", async () => {
    const user = userEvent.setup();
    render(<AttemptRunner attempt={makeAttempt()} initialFavoriteQuestionIds={[]} />);

    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Próxima" }));

    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeEnabled();
  });
});