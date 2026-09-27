import { requireUser } from "@/server/authorization";
import { getRepositories } from "@/server/repositories";
import type { ModuleEntity } from "@/server/repositories/contracts/module-repository";
import type { LessonEntity } from "@/server/repositories/contracts/lesson-repository";
import { buildLessonHref } from "@/lib/routes";
export interface SearchEntryDTO {
  id: string;
  kind: "Curso" | "Aula" | "Flashcard";
  title: string;
  href: string;
}
export interface SearchPageDTO {
  items: SearchEntryDTO[];
  total: number;
  page: number;
  query: string;
}
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
export async function searchMyContent(query: string, page: number): Promise<SearchPageDTO> {
  const { userId } = await requireUser();
  const repos = getRepositories();
  const term = normalize(query.trim());
  const results: SearchEntryDTO[] = [];
  const courses = (await repos.courses.list()).filter(
    (course) => course.status === "PUBLISHED" && !course.deletedAt,
  );
  const enrolled = new Set(
    (await repos.enrollments.listByUserId(userId))
      .filter((row) => row.status !== "cancelled")
      .map((row) => row.courseId),
  );
  const enrolledCourses = courses.filter((course) => enrolled.has(course.id));
  // BATCH (performance): UMA consulta `WHERE courseId IN (...)` + UMA `WHERE moduleId IN (...)`,
  // eliminando o N+1 de módulos/aulas por curso (curso → módulo → aula da versão anterior).
  const modulesByCourse = new Map<string, ModuleEntity[]>();
  for (const courseModule of await repos.modules.listByCourseIds(
    enrolledCourses.map((course) => course.id),
  ))
    (modulesByCourse.get(courseModule.courseId) ??
      modulesByCourse.set(courseModule.courseId, []).get(courseModule.courseId)!)
      .push(courseModule);
  const wantedModules = [...modulesByCourse.values()]
    .flat()
    .filter((courseModule) => courseModule.status === "PUBLISHED" && !courseModule.deletedAt);
  const lessonsByModule = new Map<string, LessonEntity[]>();
  for (const lesson of await repos.lessons.listByModuleIds(
    wantedModules.map((courseModule) => courseModule.id),
  ))
    (lessonsByModule.get(lesson.moduleId) ??
      lessonsByModule.set(lesson.moduleId, []).get(lesson.moduleId)!)
      .push(lesson);

  for (const course of courses) {
    if (normalize(course.title).includes(term))
      results.push({
        id: course.id,
        kind: "Curso",
        title: course.title,
        href: `/cursos/${encodeURIComponent(course.slug)}`,
      });
    const courseModules = modulesByCourse.get(course.id) ?? [];
    for (const courseModule of courseModules) {
      if (courseModule.status !== "PUBLISHED" || courseModule.deletedAt) continue;
      for (const lesson of lessonsByModule.get(courseModule.id) ?? []) {
        if (
          lesson.status === "PUBLISHED" &&
          !lesson.deletedAt &&
          normalize(lesson.title).includes(term)
        )
          results.push({
            id: lesson.id,
            kind: "Aula",
            title: lesson.title,
            href: buildLessonHref({
              courseSlug: course.slug,
              moduleSlug: courseModule.slug,
              lessonId: lesson.id,
            }),
          });
      }
    }
  }
  const decks = [
    ...(await repos.flashcardDecks.listSystemDecks()),
    ...(await repos.flashcardDecks.listByUserId(userId)),
  ].filter((deck) => deck.userId === userId || (deck.userId === null && deck.isPublic));
  const cards = await repos.flashcards.listByDeckIds([...new Set(decks.map((deck) => deck.id))]);
  const deckIds = new Set(decks.map((deck) => deck.id));
  for (const card of cards) {
    if (
      deckIds.has(card.deckId) &&
      card.status === "PUBLISHED" &&
      !card.deletedAt &&
      normalize(card.question).includes(term)
    )
      results.push({
        id: card.id,
        kind: "Flashcard",
        title: card.question,
        href: `/flashcards/revisar?deckId=${encodeURIComponent(card.deckId)}`,
      });
  }
  return { query, page, total: results.length, items: results.slice((page - 1) * 20, page * 20) };
}
