"use server";

import { ok, type ActionResult } from "@/contracts/common";
import { getRankingInputSchema } from "@/contracts/ranking";
import { toActionError } from "@/server/errors";
import { getRanking, type RankingReadResult } from "@/server/services/gamification";
import { parseInput } from "@/server/validation";

/**
 * Server Action fina (docs/ARCHITECTURE.md §6, mesmo padrão de `@/server/actions/gamification`):
 * valida a entrada (Zod) e repassa ao serviço de leitura (Fase 9). Nunca aceita `userId` do
 * cliente — a posição do usuário atual vem sempre da sessão real, dentro de `getRanking`.
 */
export async function getRankingAction(rawInput: unknown): Promise<ActionResult<RankingReadResult>> {
  try {
    const input = parseInput(getRankingInputSchema, rawInput);
    const result = await getRanking({
      periodType: input.periodType,
      scopeType: input.scopeType,
      scopeKeyRaw: input.scopeKey,
      page: input.page,
    });
    return ok(result);
  } catch (error) {
    return toActionError(error, "Não foi possível carregar o ranking.");
  }
}
