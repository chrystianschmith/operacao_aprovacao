import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUniqueMock, createMock, updateMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  createMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock("@/server/db/prisma", () => ({
  prisma: { subject: { findUnique: findUniqueMock, create: createMock, update: updateMock } },
}));

const { PrismaSubjectRepository } = await import(
  "@/server/repositories/prisma/subject-repository"
);

/**
 * Verifica o fechamento do cache TTL de `PrismaSubjectRepository` (relatório do agente
 * Qualidade): o helper `invalidateSubject` foi conectado às escritas create/update/softDelete.
 * ANTES, `update`/`softDelete` mantinham o valor antigo cacheado por até 60s (leitura stale
 * pós-escritura). Estes testes provam que, após uma escritura, o `findById` volta ao banco.
 */
describe("PrismaSubjectRepository — invalidação de cache após escrita", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    createMock.mockReset();
    updateMock.mockReset();
  });

  it("update invalida o cache de findById (leitura posterior re-executa a consulta)", async () => {
    const repo = new PrismaSubjectRepository();
    const original = { id: "s1", name: "Direito Constitucional", deletedAt: null };

    findUniqueMock.mockResolvedValue(original);
    await expect(repo.findById("s1")).resolves.toEqual({
      id: "s1",
      name: "Direito Constitucional",
      deletedAt: null,
    });
    expect(findUniqueMock).toHaveBeenCalledTimes(1);

    // Segunda leitura dentro do TTL é servida do cache — NÃO consulta o banco de novo.
    await expect(repo.findById("s1")).resolves.toEqual({
      id: "s1",
      name: "Direito Constitucional",
      deletedAt: null,
    });
    expect(findUniqueMock).toHaveBeenCalledTimes(1);

    // Escritura invalida a chave; a próxima leitura deve ir ao banco e trazer o novo nome.
    updateMock.mockResolvedValue({
      id: "s1",
      name: "Direito Constitucional v2",
      deletedAt: null,
    });
    await repo.update({ id: "s1", name: "Direito Constitucional v2", now: new Date("2026-01-02") });
    expect(updateMock).toHaveBeenCalledTimes(1);

    findUniqueMock.mockResolvedValue({ id: "s1", name: "Direito Constitucional v2", deletedAt: null });
    await expect(repo.findById("s1")).resolves.toMatchObject({ name: "Direito Constitucional v2" });
    expect(findUniqueMock).toHaveBeenCalledTimes(2);
  });

  it("softDelete invalida o cache (matéria excluída não permanece na forma ativa)", async () => {
    const repo = new PrismaSubjectRepository();

    findUniqueMock.mockResolvedValue({ id: "s2", name: "Direito Penal", deletedAt: null });
    await repo.findById("s2");
    expect(findUniqueMock).toHaveBeenCalledTimes(1);

    updateMock.mockResolvedValue({
      id: "s2",
      name: "Direito Penal",
      deletedAt: new Date("2026-03-01T00:00:00Z"),
    });
    await repo.softDelete("s2", new Date("2026-03-01T00:00:00Z"));
    expect(updateMock).toHaveBeenCalledTimes(1);

    // Se a invalidação não existisse, este findById devolveria o objeto ativo do cache.
    findUniqueMock.mockResolvedValue(null);
    await expect(repo.findById("s2")).resolves.toBeNull();
    expect(findUniqueMock).toHaveBeenCalledTimes(2);
  });

  it("create persiste a matéria e devolve a entidade mapeada", async () => {
    const repo = new PrismaSubjectRepository();

    createMock.mockResolvedValue({
      id: "s3",
      name: "Direito Administrativo",
      deletedAt: null,
    });
    const created = await repo.create({ name: "Direito Administrativo", now: new Date("2026-01-01") });

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(created).toEqual({ id: "s3", name: "Direito Administrativo", deletedAt: null });

    // Leitura imediatamente após a criação consulta o banco (chave nunca cacheada).
    findUniqueMock.mockResolvedValue({
      id: "s3",
      name: "Direito Administrativo",
      deletedAt: null,
    });
    await expect(repo.findById("s3")).resolves.toEqual(created);
    expect(findUniqueMock).toHaveBeenCalledTimes(1);
  });
});