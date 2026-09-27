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
import { getDashboardAction } from "@/server/actions/dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DIAGNÓSTICO TEMPORÁRIO (remover após medir) — timings por seção, autenticado. */
export async function GET() {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthenticated" }, { status: 401 });
  const userId = session.userId;
  const marks: Record<string, unknown> = { userId };

  const rawErrors: string[] = [];
  const rawTry = async (label: string, fn: () => Promise<unknown>) => {
    const start = performance.now();
    try {
      const value = await fn();
      marks[label] = `OK ${Math.round(performance.now() - start)}ms`;
      return value;
    } catch (error) {
      const e = error as { name?: string; code?: string; message?: string };
      marks[label] = `ERRO ${Math.round(performance.now() - start)}ms`;
      rawErrors.push(`${label}: name=${e.name} code=${e.code} msg=${e.message}`);
      return null;
    }
  };

  await rawTry("getStudentDashboard (raw)", () => getStudentDashboard(userId));

  await rawTry("Promise.all x3 getDashboardAction", () =>
    Promise.all([getDashboardAction(), getDashboardAction(), getDashboardAction()]),
  );

  await rawTry("getPersistentDashboardData", () => getPersistentDashboardData(userId));
  await rawTry("getTrackingOverview", () => getTrackingOverview(userId, new Date()));
  await rawTry("getUserGamification", () => getUserGamification(userId));
  await rawTry("listUserActivitySamples", () => listUserActivitySamples(userId));
  await rawTry("recalculateStreak", () => recalculateStreak(userId, new Date()));
  await rawTry("recalculateDailyGoal", () => recalculateDailyGoal(userId, new Date()));
  await rawTry("recalculateWeeklyGoal", () => recalculateWeeklyGoal(userId, new Date()));
  await rawTry("getPlan", () => getPlan(userId));

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
  marks.rawErrors = rawErrors;

  return Response.json(marks);
}