export { recordHeartbeat } from "./record-heartbeat";
export { getLessonView } from "./lesson-view";
export {
  evaluateHeartbeat,
  mergeIntervals,
  sumIntervalSeconds,
  type EvaluateHeartbeatInput,
  type HeartbeatEvaluation,
  type HeartbeatSignal,
} from "./heartbeat-evaluator";
export {
  checkHeartbeatRateLimit,
  heartbeatRateLimitKey,
  __resetHeartbeatRateLimitStore,
} from "./rate-limit";

// Fase 12 — acompanhamento: calendário de atividade + sequência (puro).
export {
  DEFAULT_TIMEZONE,
  computeStreak,
  isFirstWeekFullyActive,
  sumValidSecondsByDate,
  toActivityDates,
  toCalendarDateIso,
  type StreakComputation,
} from "./activity-days";

// Fase 12 — sequência (I/O + eventos de gamificação).
export { recalculateStreak, getUserStreak, type UserStreakView } from "./streak";

// Fase 12 — metas diária/semanal (I/O + eventos de gamificação). Leituras read-only num
// recalc-on-write: `getDailyGoalView`/`getWeeklyGoalView` NUNCA recalcula/persiste (só o
// recálculo via `PointsAwarded`/heartbeat-diário/fechamento diário escreve).
export {
  isGoalAchieved,
  recalculateDailyGoal,
  recalculateWeeklyGoal,
  getDailyGoalView,
  getWeeklyGoalView,
  type DailyGoalView,
  type GoalView,
  type WeeklyGoalView,
} from "./goals";

// Fase 12 — fechamento diário (cron `/api/cron/daily-close`, recalc-on-write).
export { closeDailyStudyMetrics, type DailyCloseInput, type DailyCloseResult } from "./daily-close";

// Fase 12 — diagnóstico de preparação (puro).
export { computeDiagnosis } from "./diagnosis";

// Fase 12 — serviço de acompanhamento (agregação).
export { getTrackingOverview } from "./tracking-overview";
