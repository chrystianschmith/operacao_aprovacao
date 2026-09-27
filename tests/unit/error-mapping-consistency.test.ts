import { describe, expect, it } from "vitest";
import {
  ConflictError,
  NotFoundError,
  toActionError,
  ValidationError,
} from "@/server/errors";

/**
 * Garante a consistência do ÚNICO mapeador erros→ActionResult do projeto
 * (`toActionError` em `@/server/errors` — ver relatório do agente Qualidade:
 * as antigas cópias locais por Server Action foram consolidadas aqui).
 * Cobra o contrato de segurança (CLAUDE.md §9/§24): erros de domínio preservam
 * código/mensagem/fieldErrors; qualquer outra exceção vira `INTERNAL_ERROR`
 * sem vazar stack trace ao usuário.
 */
describe("toActionError (único mapeador erros→ActionResult)", () => {
  it("preserva código e mensagem segura de um erro de domínio", () => {
    const result = toActionError(new NotFoundError("Curso não encontrado."));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
      expect(result.error.message).toBe("Curso não encontrado.");
    }
  });

  it("repassa fieldErrors de um ValidationError para o formulário associado", () => {
    const result = toActionError(
      new ValidationError("Dados inválidos.", { name: ["Obrigatório."] }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.fieldErrors).toEqual({ name: ["Obrigatório."] });
    }
  });

  it("sobrescreve fieldErrors quando o erro de domínio não é ValidationError", () => {
    const result = toActionError(new ConflictError("Item duplicado."));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.fieldErrors).toBeUndefined();
    }
  });

  it("nunca vaza stack trace: erro inesperado vira INTERNAL_ERROR genérico", () => {
    const result = toActionError(new Error("segredo interno: conexão com hash vazou"));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INTERNAL_ERROR");
      expect(result.error.message).toBe("Não foi possível processar a solicitação.");
      expect(result.error.message).not.toContain("segredo");
      expect(result.error.message).not.toContain("hash");
    }
  });

  it("aceita mensagem de fallback específica da fronteira (ex.: dashboard/ranking)", () => {
    const result = toActionError(new Error("boom"), "Não foi possível carregar o ranking.");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("Não foi possível carregar o ranking.");
    }
  });

  it("valores não-erro (null/string) caem no fallback seguro, sem crash", () => {
    for (const odd of [null, "string cru", { ok: true }] as const) {
      const result = toActionError(odd);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INTERNAL_ERROR");
      }
    }
  });
});