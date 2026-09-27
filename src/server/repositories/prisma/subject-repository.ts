import type { Subject as Row } from "@/generated/prisma/client";
import type {
  SubjectEntity,
  SubjectRepository,
  SubjectCreateInput,
  SubjectUpdateInput,
} from "../contracts/subject-repository";
import { createTtlCache, cachedLoad } from "@/lib/cache";
import { generateSlug } from "@/lib/slug";

function map(row: Row): SubjectEntity {
  return { id: row.id, name: row.name, deletedAt: row.deletedAt?.toISOString() ?? null };
}


/** Cache TTL em memória do catálogo de matérias (dados ESTÁVEIS — CLAUDE.md §7/§10).
 *  Procura-se NÃO cachear dados sensíveis; matérias são nome público. TTL típico de catálogo
 *  (60s). Escritas abaixo invalidam a chave para nunca servir dado stale (CLAUDE.md §7:
 *  "toda escrita derruba o cache dos repositórios afetados"). */
const SUBJECT_CACHE_TTL_MS = 60_000;
const subjectCache = createTtlCache<Promise<SubjectEntity | null>>(SUBJECT_CACHE_TTL_MS);

function subjectKey(id: string): string {
  return `subject:${id}`;
}
function subjectListKey(): string {
  return "catalog:subject:list";
}
/** Invalida o cache TTL após QUALQUER escrita (criação, edição ou exclusão lógica) — evita
 *  servir dado stale por até `SUBJECT_CACHE_TTL_MS` após uma escritura (CLAUDE.md §7:
 *  "toda escrita derruba o cache dos repositórios afetados"). A chave de lista mantém-se
 *  defensivamente, caso uma futura implementação venha a cachear `list()`. */
function invalidateSubject(id: string): void {
  subjectCache.delete(subjectKey(id));
  subjectCache.delete(subjectListKey());
}

export class PrismaSubjectRepository implements SubjectRepository {
  async findById(id: string) {
    return cachedLoad(subjectCache, subjectKey(id), async () => {
      const { prisma } = await import("@/server/db/prisma");
      const row = await prisma.subject.findUnique({ where: { id } });
      return row ? map(row) : null;
    });
  }
  async list() {
    const { prisma } = await import("@/server/db/prisma");
    return (
      await prisma.subject.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } })
    ).map(map);
  }
  async listByIds(ids: string[]) {
    if (ids.length === 0) return [];
    const { prisma } = await import("@/server/db/prisma");
    const rows = await prisma.subject.findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
    const byId = new Map(rows.map((row) => [row.id, map(row)] as const));
    return ids.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : []));
  }
  
  
  async listForAdmin() {
    const { prisma } = await import("@/server/db/prisma");
    return (await prisma.subject.findMany({ orderBy: { name: "asc" } })).map(map);
  }
  async create(input: SubjectCreateInput) {
    const { prisma } = await import("@/server/db/prisma");
    const { now, ...data } = input;
    const subject = await prisma.subject.create({
      data: {
        ...data,
        slug: generateSlug(input.name),
        createdAt: now,
        updatedAt: now,
      },
    });
    invalidateSubject(subject.id);
    return map(subject);
  }
  async update(input: SubjectUpdateInput) {
    const { prisma } = await import("@/server/db/prisma");
    const { id, now, ...data } = input;
    const subject = await prisma.subject.update({
      where: { id },
      data: { ...data, updatedAt: now },
    });
    invalidateSubject(id);
    return map(subject);
  }
  async softDelete(id: string, now: Date) {
    const { prisma } = await import("@/server/db/prisma");
    const subject = await prisma.subject.update({
      where: { id },
      data: { deletedAt: now, updatedAt: now },
    });
    invalidateSubject(id);
    return map(subject);
  }
}
