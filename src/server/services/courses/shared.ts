import { getRepositories } from "@/server/repositories";
import type { CourseEntity } from "@/server/repositories/contracts/course-repository";
import type { LessonProgressEntity } from "@/server/repositories/contracts/lesson-progress-repository";
import type { LessonEntity } from "@/server/repositories/contracts/lesson-repository";
import type { CourseStatus, CourseSummaryDTO } from "@/contracts/courses";
import { computeCourseProgress, type ComputedCourseProgress, type ModuleWithLessons } from "./progress";

/** Carrega os módulos do curso com suas aulas já anexadas, ordenados (I/O via repositórios).
 *  BATCH (performance): as aulas de TODOS os módulos são buscadas de uma vez
 *  (`LessonRepository.listByModuleIds`), eliminando o N+1 de uma aula-por-módulo. Ordenação
 *  final reproduz `listByModuleId` (módulos por `order`, aulas por `order`). */
export async function loadModulesWithLessons(courseId: string): Promise<ModuleWithLessons[]> {
  const repos = getRepositories();
  const modules = await repos.modules.listByCourseId(courseId);
  const lessonsByModule = new Map<string, LessonEntity[]>();
  for (const lesson of await repos.lessons.listByModuleIds(modules.map((module) => module.id)))
    (lessonsByModule.get(lesson.moduleId) ?? lessonsByModule.set(lesson.moduleId, []).get(lesson.moduleId)!)
      .push(lesson);
  return modules.map((module) => ({
    module,
    lessons: lessonsByModule.get(module.id) ?? [],
  }));
}

/** Progresso do usuário restrito às aulas informadas (evita vazar progresso de outros cursos). */
export async function loadProgressMap(
  userId: string,
  lessonIds: ReadonlySet<string>,
): Promise<Map<string, LessonProgressEntity>> {
  const repos = getRepositories();
  const records = await repos.lessonProgress.listByUserId(userId);
  const map = new Map<string, LessonProgressEntity>();
  for (const record of records) {
    if (lessonIds.has(record.lessonId)) {
      map.set(record.lessonId, record);
    }
  }
  return map;
}

/** Combina `loadModulesWithLessons` + `loadProgressMap` + `computeCourseProgress` para um curso/usuário. */
export async function computeProgressForCourse(
  userId: string,
  courseId: string,
): Promise<ComputedCourseProgress> {
  const modulesWithLessons = await loadModulesWithLessons(courseId);
  const lessonIds = new Set(modulesWithLessons.flatMap(({ lessons }) => lessons.map((l) => l.id)));
  const progressMap = await loadProgressMap(userId, lessonIds);
  return computeCourseProgress(modulesWithLessons, progressMap);
}

/** Nomes de matéria (distintos, na ordem dos módulos) cobertos pelo curso. */
/** Nomes de matéria (distintos, na ordem dos módulos) cobertos pelo curso.
 *  BATCH (performance): busca as matérias com UMA consulta `WHERE id IN (...)` via
 *  `SubjectRepository.listByIds`, em vez de uma `findById` por módulo (N+1). */
export async function resolveSubjectNames(modulesWithLessons: ModuleWithLessons[]): Promise<string[]> {
  const repos = getRepositories();
  const wanted = [
    ...new Set(modulesWithLessons.map(({ module }) => module.subjectId).filter(Boolean)),
  ];
  const subjects = await repos.subjects.listByIds(wanted);
  const byId = new Map(subjects.map((subject) => [subject.id, subject.name] as const));
  const names: string[] = [];
  for (const { module } of modulesWithLessons) {
    const name = byId.get(module.subjectId);
    if (name !== undefined && !names.includes(name)) names.push(name);
  }
  return names;
}

/** Status agregado do curso (escala própria — distinta de `LessonStatus`). */
export function computeCourseStatus(progressPercent: number): CourseStatus {
  if (progressPercent >= 100) return "concluido";
  if (progressPercent > 0) return "em_andamento";
  return "nao_iniciado";
}

/**
 * Monta o `CourseSummaryDTO` de um curso para um usuário: matrícula, matérias e progresso
 * agregado (0 quando não matriculado — progresso nunca é lido/computado fora do escopo de
 * uma matrícula ativa).
 */
export async function buildCourseSummary(
  userId: string,
  course: CourseEntity,
): Promise<CourseSummaryDTO> {
  const repos = getRepositories();
  const [enrollment, modulesWithLessons] = await Promise.all([
    repos.enrollments.findByUserAndCourse(userId, course.id),
    loadModulesWithLessons(course.id),
  ]);

  const subjects = await resolveSubjectNames(modulesWithLessons);

  let progressPercent = 0;
  if (enrollment) {
    const computed = await computeProgressForCourse(userId, course.id);
    progressPercent = computed.courseProgressPercent;
  }

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    contestId: course.contestId,
    contestName: course.contestName,
    workloadHours: course.workloadHours,
    teacherName: course.teacherName,
    coverColor: course.coverColor,
    difficulty: course.difficulty,
    subjects,
    progressPercent,
    status: computeCourseStatus(progressPercent),
    enrolled: enrollment !== null,
  };
}
