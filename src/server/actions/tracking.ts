"use server";

import { ok, type ActionResult } from "@/contracts/common";
import type { DiagnosisDTO, TrackingOverviewDTO } from "@/contracts/tracking";
import { requireUser } from "@/server/authorization";
import { toActionError } from "@/server/errors";
import { computeDiagnosis } from "@/server/services/study-tracking/diagnosis";
import { getTrackingOverview } from "@/server/services/study-tracking/tracking-overview";

/**
 * Server Actions finas (docs/ARCHITECTURE.md §6) de acompanhamento/diagnóstico (Fase 12 —
 * agente `study-tracking`): resolvem o usuário autenticado a partir da sessão real do Auth.js
 * (nunca de um `userId` vindo do cliente) e repassam para o serviço. Mesmo padrão de
 * `@/server/actions/dashboard.ts`/`@/server/actions/study-plan.ts`.
 */

/** Lê o acompanhamento agregado (horas, aulas, questões, metas, sequência, plano) do aluno
 *  autenticado — também recalcula/persiste sequência e metas diária/semanal desta chamada. */
export async function getTrackingOverviewAction(): Promise<ActionResult<TrackingOverviewDTO>> {
  try {
    const session = await requireUser();
    const overview = await getTrackingOverview(session.userId, new Date());
    return ok(overview);
  } catch (error) {
    return toActionError(error);
  }
}

/** Lê o diagnóstico de preparação do aluno autenticado — heurística pura sobre o mesmo
 *  `TrackingOverviewDTO` de `getTrackingOverviewAction` (`@/server/services/study-tracking/diagnosis`). */
export async function getDiagnosisAction(): Promise<ActionResult<DiagnosisDTO>> {
  try {
    const session = await requireUser();
    const overview = await getTrackingOverview(session.userId, new Date());
    const diagnosis = computeDiagnosis(overview);
    return ok(diagnosis);
  } catch (error) {
    return toActionError(error);
  }
}
