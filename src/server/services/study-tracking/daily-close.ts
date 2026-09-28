import { addDaysIso } from "@/server/services/study-plan/date-utils";
import { auditLog } from "@/server/audit";
import { getRepositories } from "@/server/repositories";
import { DEFAULT_TIMEZONE, toCalendarDateIso } from "./activity-days";
import { recalculateDailyGoal, recalculateWeeklyGoal } from "./goals";
import { recalculateStreak } from "./streak";

/**
 * Fechamento DIÁRIO de sequência + metas (recalc-on-write, Fase 12 — rota
 * `/api/cron/daily-close`). Re-materializa `UserStreak`/`DailyGoal`/`WeeklyGoal` dos usuários
 * com atividade num dia ALVO já fechado (default: ontem, dia civil UTC), tornando o recálculo
 * desses caches independente de leitura por página (combinado com os ganchos
 * `PointsAwarded`/refresh-diário do heartbeat — ver `./goals.ts`/`./record-heartbeat.ts`).
 *
 * Por quê fechar um dia ATRASADO em vez de rodar sempre "hoje": o `computeStreak` trata "hoje"
 * como dia EM ABERTO (falta de atividade hoje não quebra a sequência de ontem). O fechamento
 * roda com `now` no dia-alvo já encerrado, então a decisão de streak/metas daquele dia fica
 * DEFINITIVA e idempotente — re-executar o cron para o MESMO dia (ou disparar hoje de novo)
 * re-upserta os mesmos valores sem duplicar nada (as emissões de conclusão usam guard
 * `wasAchieved` + `idempotencyKey` própria; `computeStreak` é determinístico). Este é também o
 * ÚNICO ponto que pode consumir freeze (ver TODO(1) em `./streak.ts`) — removendo o consumo
 * por leitura.
 *
 * Descoberta de usuários: `StudySessionRepository.listUserIdsWithActivitySince` cruza fontes de
 * atividade (sessions/points/focus) com os caches já materializados — cobre também usuários
 * cuja última atividade foi antes da janela mas que ficaram com o dia aberto (ex.: faltou
 * fechar). Freeze está dormente (`freezesAvailable` nasce 0 e nunca é concedido — Fase 12) —
 * sem lógica especial de freeze aqui.
 */

export interface DailyCloseInput {
  /** Data-alvo a fechar (YYYY-MM-DD, dia civil UTC). Default: ontem (UTC). */
  date?: string;
  /** Relógio injetado para testes/determinismo. */
  now?: Date;
  /** `true` quando o fechamento deve reprocessar TODOS os usuários conhecidos, SEM aplicar a
   *  janela de atividade (`listUserIdsWithActivitySince` ainda é consultado — o union já traz
   *  os caches — mas o corte por atividade é ignorado). Uso: reprocessamento administrativo. */
  forceAllUsers?: boolean;
}

export interface DailyCloseResult {
  date: string;
  usersClosed: number;
  userIds: string[];
}

/** Janela de atividade observada para o fechamento (dias antes do alvo). Suficiente para
 *  capturar quem estudou perto do dia a fechar; usuários "antigos" ainda aparecem via
 *  `UserStreak`/`DailyGoal`/`WeeklyGoal` (caches materializados, sempre na lista). */
const CLOSE_ACTIVITY_WINDOW_DAYS = 7;

const DATE_LIKE = /^\d{4}-\d{2}-\d{2}$/;

export async function closeDailyStudyMetrics(input: DailyCloseInput = {}): Promise<DailyCloseResult> {
  const now = input.now ?? new Date();
  const todayIso = toCalendarDateIso(now.toISOString(), DEFAULT_TIMEZONE);
  // `yyyy-mm-dd` puro (sem o sufixo `T00:00:00.000Z`) — formato canônico de data-alvo.
  const today = todayIso.slice(0, 10);

  let targetDate: string;
  if (input.date !== undefined) {
    if (!DATE_LIKE.test(input.date)) {
      throw new Error(`Fechamento diário inválido: data '${input.date}' deve ser YYYY-MM-DD.`);
    }
    if (input.date > today) {
      throw new Error(`Fechamento diário inválido: não se fecha o futuro ('${input.date}' > hoje '${today}').`);
    }
    targetDate = input.date;
  } else {
    targetDate = addDaysIso(`${today}T00:00:00.000Z`, -1).slice(0, 10);
  }

  // Meio-dia (UTC) do dia civil alvo: `toCalendarDateIso` devolve EXATAMENTE `targetDate` nele
  // para a timezone padrão (UTC) e permanece correto para a esmagadora maioria das timezones
  // (assunção documentada; `DEFAULT_TIMEZONE` é UTC). Passar o próprio `targetDate` como `now`
  // dos recálculos é o que faz o streak/metas tratarem aquele dia como FECHADO.
  const closeAt = new Date(`${targetDate}T12:00:00.000Z`);
  const sinceIso = new Date(closeAt.getTime() - CLOSE_ACTIVITY_WINDOW_DAYS * 86_400_000).toISOString();

  const repos = getRepositories();
  const userIds = input.forceAllUsers
    ? await repos.studySessions.listUserIdsWithActivitySince(new Date(0).toISOString())
    : await repos.studySessions.listUserIdsWithActivitySince(sinceIso);

  // `listUserIdsWithActivitySince` já devolve IDs distintos (UNION/Set); a chamada é re-disputada
  // por segurança (idempotente — recalcular de novo apenas re-upserta os mesmos valores).
  for (const userId of userIds) {
    await Promise.all([
      recalculateStreak(userId, closeAt),
      recalculateDailyGoal(userId, closeAt),
      recalculateWeeklyGoal(userId, closeAt),
    ]);
  }

  await auditLog({
    operation: "study-tracking.daily-close",
    entity: "UserStreak",
    result: "success",
    correlationId: `daily-close:${targetDate}`,
    metadata: { targetDate, usersClosed: userIds.length },
  });

  return { date: targetDate, usersClosed: userIds.length, userIds };
}