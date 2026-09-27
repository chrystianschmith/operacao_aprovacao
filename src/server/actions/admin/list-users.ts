"use server";

import { listUsersForAdmin } from "@/server/services/admin/list-users-service";
import { ok, type ActionResult } from "@/contracts/common";
import { toActionError } from "./shared";
import type { AdminUserDTO } from "@/contracts/admin-users";

/**
 * Server Action fina (docs/ARCHITECTURE.md §6): repassa para o serviço, que já envolve
 * `requireRole` + `auditLog` via `withAdminAudit`. Trata erros de domínio na fronteira
 * (mesmo padrão de `loginAction`), retornando `ActionResult` em vez de deixar
 * `ForbiddenError`/`AuthError` propagarem crus — nunca vaza stack trace ao cliente.
 * Ver `@/server/services/admin/list-users-service.ts`.
 */
export async function listUsersForAdminAction(): Promise<ActionResult<AdminUserDTO[]>> {
  try {
    const users = await listUsersForAdmin();
    return ok(users);
  } catch (error) {
    return toActionError(error);
  }
}
