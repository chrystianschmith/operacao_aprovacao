import { ensureAuthenticatedUser } from "../helpers/authenticated-user";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session as NextAuthSession } from "next-auth";

const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));

vi.mock("@/server/auth", () => ({
  auth: authMock,
}));

const { listMockExamCatalogAction } = await import("@/server/actions/simulations");
const { getRepositories } = await import("@/server/repositories");
const { __resetMockMockExamStore } = await import("@/server/repositories/mock/mock-exam-repository");

function fakeSession(role: NextAuthSession["user"]["role"], id: string): NextAuthSession {
  ensureAuthenticatedUser(id, role);
  return {
    user: { id, role, name: "Teste", email: "teste@example.com" },
    expires: new Date(Date.now() + 60_000).toISOString(),
  } as NextAuthSession;
}

/**
 * Fluxo CRÍTICO "assinatura não bloqueia conteúdo gratuito/privado em navegação" (CLAUDE.md §31
 * assinatura): a LISTAGEM do catálogo de simulados publicados é sempre visível para qualquer
 * aluno logado — o gate de conteúdo pago vive no BACKEND, apenas na hora de iniciar a tentativa
 * (matrícula/assinatura), nunca na interface de navegação.
 */
describe("actions/simulations — catálogo gratuito jamais barrado por assinatura", () => {
  beforeEach(() => {
    authMock.mockReset();
    __resetMockMockExamStore();
  });

  it("listagem de simulados publicados está disponível para aluno comum", async () => {
    const userId = "catalog-free-user";
    authMock.mockResolvedValue(fakeSession("aluno", userId));

    const result = await listMockExamCatalogAction();

    expect(result.ok).toBe(true);
    if (result.ok) {
      // O catálogo traz EXATAMENTE os simulados publicados do repositório (mesma política que
      // o backend usa para o acesso real) — nunca vaza rascunho/pessoal.
      const published = await getRepositories().mockExams.list();
      expect(result.data).toHaveLength(published.length);
      expect(result.data.map((e) => e.id).sort()).toEqual(published.map((e) => e.id).sort());
    }
  });

  it("o catálogo não exige assinatura: a listagem não consulta nenhuma capacidade do usuário", async () => {
    const userId = "catalog-free-user";
    authMock.mockResolvedValue(fakeSession("aluno", userId));

    const result = await listMockExamCatalogAction();

    expect(result.ok).toBe(true);
    if (result.ok) {
      for (const exam of result.data) {
        expect(exam).not.toHaveProperty("hasAccess");
      }
    }
  });
});