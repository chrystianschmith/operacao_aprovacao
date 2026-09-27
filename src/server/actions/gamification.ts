"use server";

import { ok, type ActionResult } from "@/contracts/common";
import { requireUser } from "@/server/authorization";
import { toActionError } from "@/server/errors";
import { getUserGamification, type UserGamificationView } from "@/server/services/gamification";

/**
 * Server Action fina (docs/ARCHITECTURE.md §6, mesmo padrão de `@/server/actions/dashboard`):
 * resolve o usuário autenticado a partir da sessão real do Auth.js (nunca de um `userId` vindo
 * do cliente) e repassa para o serviço de leitura de gamificação (Fase 8).
 */
export async function getUserGamificationAction(): Promise<ActionResult<UserGamificationView>> {
  try {
    const session = await requireUser();
    const gamification = await getUserGamification(session.userId);
    return ok(gamification);
  } catch (error) {
    return toActionError(error, "Não foi possível carregar a gamificação.");
  }
}
