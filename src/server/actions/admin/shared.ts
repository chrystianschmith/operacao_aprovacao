import { type ActionResult } from "@/contracts/common";
import { toActionError as toActionErrorFromErrors } from "@/server/errors";

/**
 * Helper compartilhado entre as Server Actions administrativas (`server/actions/admin/*`,
 * Fase 17). Antes havia uma cópia local de `toActionError` por domínio — consolidada em
 * `@/server/errors` (CLAUDE.md §9). Este arquivo preserva o fallback específico do admin
 * ("solicitação administrativa") sem duplicar o corpo do mapeamento. Nunca vaza stack trace —
 * erros de domínio viram `ActionResult.error`.
 */
export function toActionError(error: unknown): ActionResult<never> {
  return toActionErrorFromErrors(error, "Não foi possível processar a solicitação administrativa.");
}