import { cache } from "react";
import { listUserActivitySamples } from "@/server/services/study-tracking/activity-samples";
import { inRepositoryTransaction } from "@/server/repositories/transaction";
import { getEffectiveBusinessConfig } from "@/server/services/admin/effective-config";
import { eventBus } from "@/server/events";
import { getRepositories } from "@/server/repositories";
import { addDaysIso, weekStartIso } from "@/server/services/study-plan/date-utils";
import {
  buildIdempotencyKey,
  registerGamificationEventHandlers,
  type DailyGoalCompletedPayload,
  type PointsAwardedPayload,
  type WeeklyGoalCompletedPayload,
} from "@/server/services/gamification";
import { DEFAULT_TIMEZONE, sumValidSecondsByDate, toCalendarDateIso } from "./activity-days";

/** Mesmo padrão de `./streak.ts` — idempotente, seguro com múltiplos imports/hot-reload. */
registerGamificationEventHandlers();

/**
 * Assinatura do recalc-on-write (Fase 12): quando `PointsAwarded` é emitido pelo motor de
 * recompensa (award REAL criado), re-materializa as metas diária/semanal do usuário. ANTES
 * este recálculo acontecia em TODA leitura de acompanhamento/dashboard (`tracking-overview`
 * recalcula/upsert a cada visita); AGORA só acontece neste gancho, no refresh diário do
 * heartbeat (`./record-heartbeat.ts`) e no fechamento diário (`./daily-close.ts`) — leituras
 * passam a usar `getDailyGoalView`/`getWeeklyGoalView` (SOMENTE-leitura).
 *
 * O handler fica AQUI (não em `register-gamification.ts`) para evitar ciclo de imports:
 * `goals.ts` já importa o barrel de gamificação (`registerGamificationEventHandlers`), e o
 * barrel não pode importar `goals.ts` de volta. `engine.ts` só conhece o tipo do payload
 * (`events.ts`); a assinatura é resolvida no processo que carregar este módulo.
 *
 * Idempotente por natureza (upsert + conclusão única por `(userId, date)`/`(userId, weekStart)`);
 * a flag `pointsAwardedSubscribed` apenas evita reinscrição dentro do MESMO lifecycle de módulo.
 */
let pointsAwardedSubscribed = false;
function subscribeToPointsAwarded(): void {
  if (pointsAwardedSubscribed) return;
  pointsAwardedSubscribed = true;
  eventBus.subscribe<PointsAwardedPayload>("PointsAwarded", async ({ payload, occurredAt }) => {
    const { userId } = payload;
    await Promise.all([
      recalculateDailyGoal(userId, occurredAt),
      recalculateWeeklyGoal(userId, occurredAt),
    ]);
  });
}
subscribeToPointsAwarded();

export interface GoalView {
  targetMinutes: number | null;
  targetPoints: number | null;
  progressMinutes: number;
  progressPoints: number;
  achieved: boolean;
  achievedAt: string | null;
}

export interface DailyGoalView extends GoalView {
  date: string;
}

export interface WeeklyGoalView extends GoalView {
  weekStart: string;
}

/**
 * Critério de conclusão da meta — PURO: uma meta sem NENHUM alvo definido nunca é considerada
 * concluída (evita "meta vazia" auto-completar); quando há alvo de pontos e/ou minutos, TODOS
 * os alvos definidos precisam ser atingidos (semântica E, não OU) — decisão documentada aqui
 * porque CLAUDE.md só diz "meta diária (ex.: X pontos/minutos no dia)" sem detalhar a
 * combinação dos dois.
 */
export function isGoalAchieved(input: {
  targetPoints: number | null;
  targetMinutes: number | null;
  progressPoints: number;
  progressMinutes: number;
}): boolean {
  const hasAnyTarget = input.targetPoints !== null || input.targetMinutes !== null;
  if (!hasAnyTarget) return false;

  const pointsOk = input.targetPoints === null || input.progressPoints >= input.targetPoints;
  const minutesOk = input.targetMinutes === null || input.progressMinutes >= input.targetMinutes;
  return pointsOk && minutesOk;
}

/** Soma de `PointTransaction.points` (ledger real da Fase 8 — nunca um valor do cliente),
 *  agrupada por dia civil na timezone informada. Embrulhado em `cache()` (React) porque as metas
 *  diária e semanal somam o MESMO ledger na mesma request — 1 consulta em vez de 2 (idempotente /
 *  read-only; deduplicado apenas por request RSC, inofensivo fora dele). */
const sumPointsByDate = cache(
  async (userId: string, timezone: string): Promise<Map<string, number>> => {
    const rows = await getRepositories().pointTransactions.sumPointsByDate(userId, timezone);
    const byDate = new Map<string, number>();
    for (const row of rows) {
      byDate.set(row.date, (byDate.get(row.date) ?? 0) + row.points);
    }
    return byDate;
  },
);
export { sumPointsByDate };

/**
 * Leitura SOMENTE-leitura da meta DIÁRIA (Fase 12 — recalc-on-write): NÃO recalcula, NÃO
 * persiste, NÃO emite nada. Índole: `Date` alvo, `target*` da linha persistida ou default
 * vigente (mesma regra do recalc), `progress*` SEMPRE ao vivo a partir do ledger de pontos
 * (`sumPointsByDate`) e do tempo válido (`sumValidSecondsByDate`) — nunca valor cacheado;
 * `achieved`/`achievedAt` são a decisão MATERIALIZADA no último recálculo. Em steady-state o
 * recalc roda no MESMO instante do award/heartbeat que altera o resultado (e é `await`ado antes
 * da resposta ao cliente), então a leitura está em dia sem custos de reescrita por página.
 */
export async function getDailyGoalView(
  userId: string,
  date: string,
  timezone: string = DEFAULT_TIMEZONE,
): Promise<DailyGoalView> {
  const repos = getRepositories();
  const existing = await repos.dailyGoals.findByUserIdAndDate(userId, date);

  const targetPoints =
    existing?.targetPoints ?? (await getEffectiveBusinessConfig()).dailyGoalTargetPoints;
  const targetMinutes = existing?.targetMinutes ?? null;

  const [pointsByDate, sessions] = await Promise.all([
    sumPointsByDate(userId, timezone),
    listUserActivitySamples(userId),
  ]);
  const secondsByDate = sumValidSecondsByDate(sessions, timezone);

  return {
    date,
    targetMinutes,
    targetPoints,
    progressMinutes: Math.floor((secondsByDate.get(date) ?? 0) / 60),
    progressPoints: pointsByDate.get(date) ?? 0,
    achieved: existing?.achieved ?? false,
    achievedAt: existing?.achievedAt ?? null,
  };
}

/**
 * Leitura SOMENTE-leitura da meta SEMANAL (semana civil `weekStartIso` — segunda a domingo,
 * mesmo agrupamento do plano de estudos). Mesmas garantias de `getDailyGoalView`: nunca
 * recalcula/upsert; progresso ao vivo somando os 7 dias da semana; `achieved`/`achievedAt`
 * refletem a última materialização do recalc-on-write.
 */
export async function getWeeklyGoalView(
  userId: string,
  weekStart: string,
  timezone: string = DEFAULT_TIMEZONE,
): Promise<WeeklyGoalView> {
  const repos = getRepositories();
  const existing = await repos.weeklyGoals.findByUserIdAndWeekStart(userId, weekStart);

  const targetPoints =
    existing?.targetPoints ?? (await getEffectiveBusinessConfig()).weeklyGoalTargetPoints;
  const targetMinutes = existing?.targetMinutes ?? null;

  const [pointsByDate, sessions] = await Promise.all([
    sumPointsByDate(userId, timezone),
    listUserActivitySamples(userId),
  ]);
  const secondsByDate = sumValidSecondsByDate(sessions, timezone);

  const weekEndExclusive = addDaysIso(weekStart, 7);
  let progressPoints = 0;
  let progressSeconds = 0;
  for (let cursor = weekStart; cursor < weekEndExclusive; cursor = addDaysIso(cursor, 1)) {
    progressPoints += pointsByDate.get(cursor) ?? 0;
    progressSeconds += secondsByDate.get(cursor) ?? 0;
  }

  return {
    weekStart,
    targetMinutes,
    targetPoints,
    progressMinutes: Math.floor(progressSeconds / 60),
    progressPoints,
    achieved: existing?.achieved ?? false,
    achievedAt: existing?.achievedAt ?? null,
  };
}

/**
 * Recalcula a meta DIÁRIA (data = hoje, na timezone informada) a partir do ledger de pontos
 * (Fase 8) e do tempo válido (Fase 7), e persiste o resultado (`DailyGoalRepository` guarda só
 * alvo + `achieved`/`achievedAt` — o progresso é sempre recomputado ao vivo, nunca cacheado;
 * ver nota em `@/server/repositories/contracts/daily-goal-repository`).
 *
 * Emite `DailyGoalCompleted` (idempotente por `<userId>:<data>` — nunca 2x no mesmo dia) só na
 * chamada que CRUZA de não-concluída para concluída; chamadas seguintes no mesmo dia já
 * concluído são no-op (o `wasAchieved` guard evita até tentar reemitir).
 *
 * TODO(MÉDIO — fase de banco): o `upsert` que marca `achieved=true` e o `emit` do award NÃO são
 * atômicos (mesmo caso de `streak.ts` e do TODO de transação única em
 * `@/server/services/gamification/engine.ts`). Um crash entre os dois deixaria a meta marcada
 * concluída sem o award, e o guard `wasAchieved` nunca mais reemitiria — PERDENDO o bônus (não
 * duplica: a `idempotencyKey` barra a duplicação; o risco é perder). Latente hoje (mock
 * single-threaded); no Prisma, upsert + emissão devem partilhar a mesma transação (ou outbox).
 */
async function recalculateDailyGoalInTransaction(
  userId: string,
  now: Date,
  timezone: string = DEFAULT_TIMEZONE,
): Promise<DailyGoalView> {
  const repos = getRepositories();
  const date = toCalendarDateIso(now.toISOString(), timezone);
  const existing = await repos.dailyGoals.findByUserIdAndDate(userId, date);

  const targetPoints =
    existing?.targetPoints ?? (await getEffectiveBusinessConfig()).dailyGoalTargetPoints;
  const targetMinutes = existing?.targetMinutes ?? null;

  const [pointsByDate, sessions] = await Promise.all([
    sumPointsByDate(userId, timezone),
    listUserActivitySamples(userId),
  ]);
  const secondsByDate = sumValidSecondsByDate(sessions, timezone);

  const progressPoints = pointsByDate.get(date) ?? 0;
  const progressMinutes = Math.floor((secondsByDate.get(date) ?? 0) / 60);

  const wasAchieved = existing?.achieved ?? false;
  const achievedNow = isGoalAchieved({
    targetPoints,
    targetMinutes,
    progressPoints,
    progressMinutes,
  });
  const justAchieved = !wasAchieved && achievedNow;
  const achieved = wasAchieved || achievedNow;
  const achievedAt = wasAchieved
    ? (existing?.achievedAt ?? null)
    : achievedNow
      ? now.toISOString()
      : null;

  const updated = await repos.dailyGoals.upsert({
    userId,
    date,
    targetMinutes,
    targetPoints,
    achieved,
    achievedAt,
    now,
  });

  if (justAchieved) {
    await eventBus.emit<DailyGoalCompletedPayload>({
      type: "DailyGoalCompleted",
      payload: { userId, dailyGoalId: updated.id, date },
      idempotencyKey: buildIdempotencyKey("DAILY_GOAL_COMPLETED", userId, date),
      occurredAt: now,
    });
  }

  return {
    date,
    targetMinutes: updated.targetMinutes,
    targetPoints: updated.targetPoints,
    progressMinutes,
    progressPoints,
    achieved: updated.achieved,
    achievedAt: updated.achievedAt,
  };
}

/**
 * Recalcula a meta SEMANAL (semana civil — segunda a domingo, `weekStartIso`, mesmo
 * agrupamento do calendário do plano de estudos, Fase 11) somando pontos/minutos de
 * segunda-feira até `now` (semana em andamento soma o que já ocorreu; não espera o domingo
 * fechar para refletir progresso). Mesma semântica de idempotência de `recalculateDailyGoal`
 * (incluindo o mesmo TODO(MÉDIO — fase de banco) de atomicidade upsert+emit descrito lá).
 */
async function recalculateWeeklyGoalInTransaction(
  userId: string,
  now: Date,
  timezone: string = DEFAULT_TIMEZONE,
): Promise<WeeklyGoalView> {
  const repos = getRepositories();
  const today = toCalendarDateIso(now.toISOString(), timezone);
  const weekStart = weekStartIso(today);
  const weekEndExclusive = addDaysIso(weekStart, 7);

  const existing = await repos.weeklyGoals.findByUserIdAndWeekStart(userId, weekStart);
  const targetPoints =
    existing?.targetPoints ?? (await getEffectiveBusinessConfig()).weeklyGoalTargetPoints;
  const targetMinutes = existing?.targetMinutes ?? null;

  const [pointsByDate, sessions] = await Promise.all([
    sumPointsByDate(userId, timezone),
    listUserActivitySamples(userId),
  ]);
  const secondsByDate = sumValidSecondsByDate(sessions, timezone);

  let progressPoints = 0;
  let progressSeconds = 0;
  for (let cursor = weekStart; cursor < weekEndExclusive; cursor = addDaysIso(cursor, 1)) {
    progressPoints += pointsByDate.get(cursor) ?? 0;
    progressSeconds += secondsByDate.get(cursor) ?? 0;
  }
  const progressMinutes = Math.floor(progressSeconds / 60);

  const wasAchieved = existing?.achieved ?? false;
  const achievedNow = isGoalAchieved({
    targetPoints,
    targetMinutes,
    progressPoints,
    progressMinutes,
  });
  const justAchieved = !wasAchieved && achievedNow;
  const achieved = wasAchieved || achievedNow;
  const achievedAt = wasAchieved
    ? (existing?.achievedAt ?? null)
    : achievedNow
      ? now.toISOString()
      : null;

  const updated = await repos.weeklyGoals.upsert({
    userId,
    weekStart,
    targetMinutes,
    targetPoints,
    achieved,
    achievedAt,
    now,
  });

  if (justAchieved) {
    await eventBus.emit<WeeklyGoalCompletedPayload>({
      type: "WeeklyGoalCompleted",
      payload: { userId, weeklyGoalId: updated.id, weekStart },
      idempotencyKey: buildIdempotencyKey("WEEKLY_GOAL_COMPLETED", userId, weekStart),
      occurredAt: now,
    });
  }

  return {
    weekStart,
    targetMinutes: updated.targetMinutes,
    targetPoints: updated.targetPoints,
    progressMinutes,
    progressPoints,
    achieved: updated.achieved,
    achievedAt: updated.achievedAt,
  };
}

export async function recalculateDailyGoal(
  ...args: Parameters<typeof recalculateDailyGoalInTransaction>
): ReturnType<typeof recalculateDailyGoalInTransaction> {
  return inRepositoryTransaction(() => recalculateDailyGoalInTransaction(...args));
}

export async function recalculateWeeklyGoal(
  ...args: Parameters<typeof recalculateWeeklyGoalInTransaction>
): ReturnType<typeof recalculateWeeklyGoalInTransaction> {
  return inRepositoryTransaction(() => recalculateWeeklyGoalInTransaction(...args));
}
