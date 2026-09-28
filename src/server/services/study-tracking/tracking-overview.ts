import type { StudyActivitySample } from "@/server/services/study-tracking/activity-samples";
import { listUserActivitySamples } from "@/server/services/study-tracking/activity-samples";
import { STUDY_TRACKING_OVERVIEW } from "@/config/business";
import type { SubjectPerformanceDTO, TopicPerformanceDTO } from "@/contracts/simulations";
import type { StudyPlanDTO } from "@/contracts/study-plan";
import type {
  TrackingConsistencyDTO,
  TrackingExamProgressDTO,
  TrackingHoursSummaryDTO,
  TrackingMonthlyPointDTO,
  TrackingOverdueReviewDTO,
  TrackingOverviewDTO,
  TrackingPendingContentDTO,
  TrackingQuestionsSummaryDTO,
  TrackingTimeDistributionEntryDTO,
  TrackingWeakContentDTO,
  TrackingWeeklyPointDTO,
} from "@/contracts/tracking";
import { assertOwnership, requireUser } from "@/server/authorization";
import { getRepositories } from "@/server/repositories";
import { computePerformance } from "@/server/services/simulations";
import { getPlan } from "@/server/services/study-plan";
import {
  addDaysIso,
  diffDaysIso,
  monthKeyIso,
  weekStartIso,
} from "@/server/services/study-plan/date-utils";
import {
  DEFAULT_TIMEZONE,
  sumValidSecondsByDate,
  toActivityDates,
  toCalendarDateIso,
} from "./activity-days";
import { getDailyGoalView, getWeeklyGoalView } from "./goals";
import { getUserStreak } from "./streak";

/**
 * Serviço de acompanhamento (Fase 12 — agente `study-tracking`, CLAUDE.md §14/§31). Agrega
 * MÉTRICAS REAIS de domínios já existentes — nunca recalcula regras que já são de outra fase:
 *
 * - tempo válido: soma de `StudySession.validSeconds` (Fase 7 — heartbeat/tempo válido, NÃO
 *   reimplementado aqui, só agregado via `./activity-days.ts`);
 * - aulas concluídas: `LessonProgressRepository` (Fase 7/6);
 * - questões/aproveitamento: `QuestionAttemptRepository` (Fase 10 — simulados), reaproveitando
 *   `computePerformance` (`@/server/services/simulations`) para bySubject/byTopic;
 * - revisões atrasadas/progresso até a prova: `getPlan` (Fase 11 — plano de estudos, mesmo
 *   agente `study-tracking`);
 * - sequência/metas: `getUserStreak`/`getDailyGoalView`/`getWeeklyGoalView`
 *   (`./streak.ts`/`./goals.ts`, Fase 12) — leituras SOMENTE-leitura de caches materializados;
 *   NENHUM recálculo/upsert nesta chamada (antes `recalculate*` rodava a cada visita).
 *
 * Recalc-on-write (Fase 12): streak/metas só são re-materializados em
 *   (a) `PointsAwarded` (motor de recompensa emitindo em todo award REAL, `./goals.ts`),
 *   (b) refresh diário-único no heartbeat com atividade válida (`./record-heartbeat.ts`),
 *   (c) cron de fechamento diário (`./daily-close.ts`, rota `/api/cron/daily-close`).
 * O progresso exposto aqui é sempre AO VIVO (calculado do ledger/`StudySession` no read) —
 * apenas `achieved`/`achievedAt`/streak refletem a última materialização.
 *
 * Autorização (ADR-0006): `requireUser` + `assertOwnership` na fronteira; `getPlan` também
 * reaplica internamente (redundante, mas seguro e barato — mesmo padrão de
 * `@/server/services/dashboard-service`).
 */

const WEEKLY_EVOLUTION_WEEKS = 8;
const MONTHLY_EVOLUTION_MONTHS = 6;

function buildHoursSummary(
  secondsByDate: ReadonlyMap<string, number>,
  today: string,
): TrackingHoursSummaryDTO {
  const weekStart = weekStartIso(today);
  const weekEndExclusive = addDaysIso(weekStart, 7);
  const monthKey = monthKeyIso(today);

  let weekSeconds = 0;
  let monthSeconds = 0;
  for (const [date, seconds] of secondsByDate) {
    if (date >= weekStart && date < weekEndExclusive) weekSeconds += seconds;
    if (monthKeyIso(date) === monthKey) monthSeconds += seconds;
  }

  return {
    todayMinutes: Math.floor((secondsByDate.get(today) ?? 0) / 60),
    weekMinutes: Math.floor(weekSeconds / 60),
    monthMinutes: Math.floor(monthSeconds / 60),
  };
}

/** Últimas `WEEKLY_EVOLUTION_WEEKS` semanas (incluindo a atual), com zero para semanas sem atividade. */
function buildWeeklyEvolution(
  secondsByDate: ReadonlyMap<string, number>,
  today: string,
): TrackingWeeklyPointDTO[] {
  const currentWeekStart = weekStartIso(today);
  const points: TrackingWeeklyPointDTO[] = [];

  for (let i = WEEKLY_EVOLUTION_WEEKS - 1; i >= 0; i -= 1) {
    const weekStart = addDaysIso(currentWeekStart, -7 * i);
    const weekEndExclusive = addDaysIso(weekStart, 7);
    let seconds = 0;
    for (const [date, value] of secondsByDate) {
      if (date >= weekStart && date < weekEndExclusive) seconds += value;
    }
    points.push({ weekStart, minutes: Math.floor(seconds / 60) });
  }
  return points;
}

/** Últimos `MONTHLY_EVOLUTION_MONTHS` meses (incluindo o atual), com zero para meses sem atividade. */
function buildMonthlyEvolution(
  secondsByDate: ReadonlyMap<string, number>,
  today: string,
): TrackingMonthlyPointDTO[] {
  const points: TrackingMonthlyPointDTO[] = [];
  const todayDate = new Date(today);

  for (let i = MONTHLY_EVOLUTION_MONTHS - 1; i >= 0; i -= 1) {
    const monthDate = new Date(
      Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth() - i, 1),
    );
    const monthKey = monthKeyIso(monthDate.toISOString());
    let seconds = 0;
    for (const [date, value] of secondsByDate) {
      if (monthKeyIso(date) === monthKey) seconds += value;
    }
    points.push({ month: monthKey, minutes: Math.floor(seconds / 60) });
  }
  return points;
}

function buildConsistency(activeDates: readonly string[], today: string): TrackingConsistencyDTO {
  const windowDays = STUDY_TRACKING_OVERVIEW.consistencyWindowDays;
  const windowStart = addDaysIso(today, -(windowDays - 1));
  const activeSet = new Set(activeDates);

  let activeDaysCount = 0;
  for (let cursor = windowStart; cursor <= today; cursor = addDaysIso(cursor, 1)) {
    if (activeSet.has(cursor)) activeDaysCount += 1;
  }

  return {
    windowDays,
    activeDays: activeDaysCount,
    consistencyPercent: Math.round((activeDaysCount / windowDays) * 10_000) / 100,
  };
}

interface PerformanceEntry {
  subjectId: string;
  subjectName: string;
  topicId: string | null;
  topicName: string | null;
  isCorrect: boolean | null;
}

interface QuestionsAggregation {
  questions: TrackingQuestionsSummaryDTO;
  subjectNameById: Map<string, string>;
  bySubject: SubjectPerformanceDTO[];
  byTopic: TopicPerformanceDTO[];
}

/** Agrega TODO o histórico de `QuestionAttempt` do usuário (simulados + qualquer prática já
 *  registrada) — reaproveita `computePerformance` (Fase 10) para bySubject/byTopic.
 *
 *  BATCH (performance): em vez de resolver questão/matéria/assunto por tentativa (N+1 — 3
 *  consultas × N tentativas), resolve tudo em 3 consultas (`questions.findByIds` +
 *  `subjects.listByIds` + `topics.listByIds`) e agrega por mapa. */
async function buildQuestionsData(userId: string): Promise<QuestionsAggregation> {
  const repos = getRepositories();
  const attempts = await repos.questionAttempts.listByUserId(userId);

  const questionIds = [...new Set(attempts.map((attempt) => attempt.questionId))];
  const questionsById = new Map(
    (await repos.questions.findByIds(questionIds)).map((question) => [question.id, question]),
  );
  const subjectIds = [
    ...new Set([...questionsById.values()].map((question) => question.subjectId)),
  ];
  const subjectById = new Map(
    (await repos.subjects.listByIds(subjectIds)).map((subject) => [subject.id, subject]),
  );
  const topicIds = [
    ...new Set(
      [...questionsById.values()]
        .map((question) => question.topicId)
        .filter((id): id is string => id !== null),
    ),
  ];
  const topicById = new Map(
    (await repos.topics.listByIds(topicIds)).map((topic) => [topic.id, topic]),
  );

  const entries: PerformanceEntry[] = [];
  const subjectNameById = new Map<string, string>();
  let totalAnswered = 0;
  let totalCorrect = 0;
  let timeSpentSum = 0;
  let timeSpentCount = 0;

  for (const attempt of attempts) {
    if (attempt.selectedOptionId === null) continue; // em branco não conta como "respondida"
    totalAnswered += 1;
    if (attempt.isCorrect) totalCorrect += 1;
    if (attempt.timeSpentSeconds !== null) {
      timeSpentSum += attempt.timeSpentSeconds;
      timeSpentCount += 1;
    }

    const question = questionsById.get(attempt.questionId);
    if (!question) continue;

    const subjectName = subjectById.get(question.subjectId)?.name ?? "—";
    if (!subjectNameById.has(question.subjectId))
      subjectNameById.set(question.subjectId, subjectName);

    entries.push({
      subjectId: question.subjectId,
      subjectName,
      topicId: question.topicId,
      topicName: question.topicId ? (topicById.get(question.topicId)?.name ?? null) : null,
      isCorrect: attempt.isCorrect,
    });
  }

  const { bySubject, byTopic } = computePerformance(entries);

  return {
    questions: {
      totalAnswered,
      totalCorrect,
      accuracyPercent:
        totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 10_000) / 100 : 0,
      averageSecondsPerQuestion:
        timeSpentCount > 0 ? Math.round((timeSpentSum / timeSpentCount) * 100) / 100 : null,
    },
    subjectNameById,
    bySubject,
    byTopic,
  };
}

/** Distribuição do tempo válido de estudo por matéria — resolve `StudySession.lessonId` até a
 *  matéria via `Lesson.moduleId` → `Module.subjectId` (mesma cadeia usada em outros domínios,
 *  ex.: `@/server/services/study-plan/mappers`).
 *
 *  BATCH (performance): a resolução aula→módulo→matéria (antes `lessons.findById` +
 *  `modules.findById` POR sessão sem `subjectId`) e os nomes de matéria são feitos em lote —
 *  O(1 consulta por entidade) em vez de N+1. */
async function buildTimeDistribution(
  sessions: readonly StudyActivitySample[],
): Promise<TrackingTimeDistributionEntryDTO[]> {
  const repos = getRepositories();

  const pendingLessonIds = [
    ...new Set(
      sessions
        .filter((session) => session.validSeconds > 0 && !session.subjectId && session.lessonId)
        .map((session) => session.lessonId!),
    ),
  ];
  const lessonsById = new Map(
    (await repos.lessons.findByIds(pendingLessonIds)).map((lesson) => [lesson.id, lesson] as const),
  );
  const moduleIds = [...new Set([...lessonsById.values()].map((lesson) => lesson.moduleId))];
  const modulesById = new Map(
    (await repos.modules.findByIds(moduleIds)).map((module) => [module.id, module] as const),
  );

  const secondsBySubject = new Map<string, number>();
  for (const session of sessions) {
    if (session.validSeconds <= 0) continue;

    let subjectId = session.subjectId;
    if (!subjectId && session.lessonId) {
      const lesson = lessonsById.get(session.lessonId);
      const courseModule = lesson ? modulesById.get(lesson.moduleId) : null;
      subjectId = courseModule?.subjectId ?? null;
    }
    if (!subjectId) continue;

    secondsBySubject.set(subjectId, (secondsBySubject.get(subjectId) ?? 0) + session.validSeconds);
  }

  const subjectIds = [...secondsBySubject.keys()];
  const subjectById = new Map(
    (await repos.subjects.listByIds(subjectIds)).map((subject) => [subject.id, subject]),
  );
  const entries: TrackingTimeDistributionEntryDTO[] = [];
  for (const [subjectId, seconds] of secondsBySubject) {
    entries.push({
      subjectId,
      subjectName: subjectById.get(subjectId)?.name ?? "—",
      minutes: Math.floor(seconds / 60),
    });
  }
  return entries.sort((a, b) => b.minutes - a.minutes);
}

/** Conteúdo (matéria ou assunto) com aproveitamento abaixo do limiar configurado, amostra
 *  mínima aplicada (evita classificar com poucos dados — mesmo limiar de `diagnosis.ts`). */
function buildWeakContents(
  bySubject: readonly SubjectPerformanceDTO[],
  byTopic: readonly TopicPerformanceDTO[],
  subjectNameById: ReadonlyMap<string, string>,
): TrackingWeakContentDTO[] {
  const { weakSubjectAccuracyThreshold: threshold, minSampleForPerformance: minSample } =
    STUDY_TRACKING_OVERVIEW;

  const weakSubjects: TrackingWeakContentDTO[] = bySubject
    .filter((entry) => entry.total >= minSample && entry.accuracyPercent < threshold)
    .map((entry) => ({
      subjectId: entry.subjectId,
      subjectName: entry.subjectName,
      topicId: null,
      topicName: null,
      accuracyPercent: entry.accuracyPercent,
      totalAnswered: entry.total,
    }));

  const weakTopics: TrackingWeakContentDTO[] = byTopic
    .filter((entry) => entry.total >= minSample && entry.accuracyPercent < threshold)
    .map((entry) => ({
      subjectId: entry.subjectId,
      subjectName: subjectNameById.get(entry.subjectId) ?? "—",
      topicId: entry.topicId,
      topicName: entry.topicName,
      accuracyPercent: entry.accuracyPercent,
      totalAnswered: entry.total,
    }));

  return [...weakSubjects, ...weakTopics].sort((a, b) => a.accuracyPercent - b.accuracyPercent);
}

/** Matéria sem NENHUM engajamento ainda: nem questão respondida, nem tempo válido de estudo
 *  registrado — heurística simples e documentada (CLAUDE.md — "conteúdos pendentes"). */
async function buildPendingContents(
  bySubject: readonly SubjectPerformanceDTO[],
  timeDistribution: readonly TrackingTimeDistributionEntryDTO[],
): Promise<TrackingPendingContentDTO[]> {
  const repos = getRepositories();
  const allSubjects = await repos.subjects.list();
  const engagedIds = new Set<string>([
    ...bySubject.map((entry) => entry.subjectId),
    ...timeDistribution.filter((entry) => entry.minutes > 0).map((entry) => entry.subjectId),
  ]);

  return allSubjects
    .filter((subject) => !engagedIds.has(subject.id))
    .map((subject) => ({ subjectId: subject.id, subjectName: subject.name }));
}

/** Itens de REVISÃO (`kind === "REVIEW"`) do plano ativo com `targetDate` no passado e status
 *  ainda não terminal — reaproveita a mesma regra de "atrasado" de
 *  `@/server/services/study-plan/mappers#computeProgress`, mas filtrando só revisões (o plano
 *  geral já expõe `overdueItems` para QUALQUER kind em `StudyPlanProgressDTO`). */
function buildOverdueReviews(
  plan: StudyPlanDTO | null,
  todayIso: string,
): TrackingOverdueReviewDTO[] {
  if (!plan) return [];

  return plan.items
    .filter(
      (item): item is typeof item & { targetDate: string } =>
        item.kind === "REVIEW" &&
        item.targetDate !== null &&
        item.targetDate < todayIso &&
        (item.status === "PENDING" || item.status === "IN_PROGRESS"),
    )
    .map((item) => ({
      itemId: item.id,
      title: item.title,
      subjectName: item.subjectName,
      targetDate: item.targetDate,
      daysLate: diffDaysIso(item.targetDate, todayIso),
    }))
    .sort((a, b) => b.daysLate - a.daysLate);
}

/** Progresso REAL (`getPlan`, Fase 11) vs progresso ESPERADO (linear pelo tempo decorrido desde
 *  `startDate` até `examDate`) — usado pelo diagnóstico (`./diagnosis.ts`) para o risco de atraso. */
function buildExamProgress(plan: StudyPlanDTO | null, todayIso: string): TrackingExamProgressDTO {
  if (!plan || !plan.examDate) {
    return {
      examDate: null,
      daysUntilExam: plan?.progress.daysUntilExam ?? null,
      planProgressPercent: plan?.progress.progressPercent ?? null,
      expectedProgressPercent: null,
    };
  }

  const totalDays = diffDaysIso(plan.startDate, plan.examDate);
  const elapsedDaysRaw = diffDaysIso(plan.startDate, todayIso);
  const elapsedDays = Math.min(Math.max(elapsedDaysRaw, 0), totalDays);
  const expectedProgressPercent =
    totalDays > 0 ? Math.round(Math.min(100, (elapsedDays / totalDays) * 100) * 100) / 100 : null;

  return {
    examDate: plan.examDate,
    daysUntilExam: plan.progress.daysUntilExam,
    planProgressPercent: plan.progress.progressPercent,
    expectedProgressPercent,
  };
}

/**
 * Agrega o acompanhamento completo do aluno autenticado. SOMENTE-leitura: não recalcula nem
 * persiste sequência/metas (recalc-on-write via `PointsAwarded`/heartbeat-diário/fechamento
 * diário — ver comentário de cabeçalho).
 */
export async function getTrackingOverview(
  userId: string,
  now: Date = new Date(),
  timezone: string = DEFAULT_TIMEZONE,
): Promise<TrackingOverviewDTO> {
  const session = await requireUser();
  assertOwnership(userId, session.userId);

  const repos = getRepositories();
  const today = toCalendarDateIso(now.toISOString(), timezone);
  const weekStart = weekStartIso(today);

  const [
    sessions,
    lessonProgressRows,
    questionsData,
    plan,
    streakView,
    dailyGoalView,
    weeklyGoalView,
  ] = await Promise.all([
    listUserActivitySamples(userId),
    repos.lessonProgress.listByUserId(userId),
    buildQuestionsData(userId),
    getPlan(userId, now),
    getUserStreak(userId),
    getDailyGoalView(userId, today, timezone),
    getWeeklyGoalView(userId, weekStart, timezone),
  ]);

  const secondsByDate = sumValidSecondsByDate(sessions, timezone);
  const activeDates = toActivityDates(sessions, timezone);

  const timeDistribution = await buildTimeDistribution(sessions);
  const pendingContents = await buildPendingContents(questionsData.bySubject, timeDistribution);

  return {
    hours: buildHoursSummary(secondsByDate, today),
    lessonsCompleted: lessonProgressRows.filter((row) => row.status === "completed").length,
    questions: questionsData.questions,
    weeklyEvolution: buildWeeklyEvolution(secondsByDate, today),
    monthlyEvolution: buildMonthlyEvolution(secondsByDate, today),
    subjectPerformance: questionsData.bySubject,
    topicPerformance: questionsData.byTopic,
    timeDistribution,
    weakContents: buildWeakContents(
      questionsData.bySubject,
      questionsData.byTopic,
      questionsData.subjectNameById,
    ),
    pendingContents,
    overdueReviews: buildOverdueReviews(plan, today),
    consistency: buildConsistency(activeDates, today),
    examProgress: buildExamProgress(plan, today),
    streak: {
      currentStreak: streakView?.currentStreak ?? 0,
      longestStreak: streakView?.longestStreak ?? 0,
      lastActiveDate: streakView?.lastActiveDate ?? null,
      freezesAvailable: streakView?.freezesAvailable ?? 0,
    },
    dailyGoal: {
      targetMinutes: dailyGoalView.targetMinutes,
      targetPoints: dailyGoalView.targetPoints,
      progressMinutes: dailyGoalView.progressMinutes,
      progressPoints: dailyGoalView.progressPoints,
      achieved: dailyGoalView.achieved,
      achievedAt: dailyGoalView.achievedAt,
    },
    weeklyGoal: {
      targetMinutes: weeklyGoalView.targetMinutes,
      targetPoints: weeklyGoalView.targetPoints,
      progressMinutes: weeklyGoalView.progressMinutes,
      progressPoints: weeklyGoalView.progressPoints,
      achieved: weeklyGoalView.achieved,
      achievedAt: weeklyGoalView.achievedAt,
    },
  };
}
