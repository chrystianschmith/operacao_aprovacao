import { cache } from "react";
import { env } from "@/config/env";
import { getRepositories } from "@/server/repositories";
import {
  listPrismaStudyActivitySamples,
  type StudyActivitySample,
} from "@/server/repositories/prisma/study-activity-repository";
export type { StudyActivitySample };
/** Production metrics use accepted activity deltas from video AND focus, not mutable session totals.
 *
 *  Embrulhado em `cache()` (React) para deduplicar POR REQUEST — numa página de dashboard o
 *  mesmo usuário disparava ~7 consultas idênticas (streak + metas diária/semanal + overview +
 *  gamificação + persistência); dentro do escopo de uma renderização RSC/Action o resultado é
 *  consultado UMA vez e reutilizado (SSR-only, per-request — nunca compartilhado entre requests;
 *  fora de escopo React a função se comporta normalmente, ex.: testes vitest). */
export const listUserActivitySamples = cache(
  async (userId: string): Promise<StudyActivitySample[]> => {
    if (env.DATA_SOURCE === "prisma") return listPrismaStudyActivitySamples(userId);
    return (
      await getRepositories().studySessions.listRecentSessionsByUserId(
        userId,
        new Date(0).toISOString(),
      )
    ).map((row) => ({ ...row, subjectId: null }));
  },
);
