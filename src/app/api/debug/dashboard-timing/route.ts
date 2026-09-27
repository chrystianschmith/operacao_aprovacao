import { getCurrentSession } from "@/server/authorization";
import { getRepositories } from "@/server/repositories";
import { getStudentDashboard } from "@/server/services/dashboard-service";
import { getPersistentDashboardData } from "@/server/services/dashboard-persistence";
import { getTrackingOverview } from "@/server/services/study-tracking/tracking-overview";
import { listUserActivitySamples } from "@/server/services/study-tracking/activity-samples";
import {
  recalculateDailyGoal,
  recalculateWeeklyGoal,
} from "@/server/services/study-tracking/goals";
import { recalculateStreak } from "@/server/services/study-tracking/streak";
import { getPlan } from "@/server/services/study-plan";
import { getUserGamification } from "@/server/services/gamification";
import { computeProgressForCourse } from "@/server/services/courses/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DIAGNÓSTICO TEMPORÁRIO (remover após medir) — timings por seção, autenticado. */
export async function GET() {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthenticated" }, { status: 401 });
  const userId = session.userId;
  const marks: Record<string, unknown> = { userId };
  const timed = async (label: string, fn: () => Promise<unknown>) => {
    const start = performance.now();
    const result = await fn();
    marks[label] = Math.round(performance.now() - start);
    return result;
  };

  await timed("getStudentDashboard (tudo)", () => getStudentDashboard(userId));
  await timed("getPersistentDashboardData", () => getPersistentDashboardData(userId));
  await timed("getTrackingOverview", () => getTrackingOverview(userId, new Date()));
  await timed("getUserGamification", () => getUserGamification(userId));
  await timed("listUserActivitySamples", () => listUserActivitySamples(userId));
  await timed("recalculateStreak", () => recalculateStreak(userId, new Date()));
  await timed("recalculateDailyGoal", () => recalculateDailyGoal(userId, new Date()));
  await timed("recalculateWeeklyGoal", () => recalculateWeeklyGoal(userId, new Date()));
  await timed("getPlan", () => getPlan(userId));

  const repos = getRepositories();
  const enrollments = await repos.enrollments.listByUserId(userId);
  const progressRows: Record<string, number> = {};
  for (const enrollment of enrollments) {
    if (enrollment.status === "cancelled") continue;
    const start = performance.now();
    const progress = await computeProgressForCourse(userId, enrollment.courseId);
    progressRows[enrollment.courseId] = Math.round(performance.now() - start);
    marks.nextLesson = progress.resumeLesson?.lesson.id ?? null;
  }
  marks.enrollments = enrollments.length;
  marks.computeProgressPerCourse = progressRows;

  return Response.json(marks);
}