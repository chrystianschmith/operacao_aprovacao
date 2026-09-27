/**
 * Tipos compartilhados entre contratos de repositório de CONTEÚDO ADMINISTRÁVEL (Fase 17 —
 * agente `backend`, administração). Espelha `ContentStatus` do Prisma
 * (`prisma/schema.prisma`) — usado por Course/Module/Lesson/MockExam. `Question` já possui um
 * alias idêntico próprio (`QuestionStatus`, `./question-repository.ts`) — mantido separado de
 * propósito para não alterar um tipo já importado por outros módulos (`mock-exam-repository.ts`).
 */
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Entrada mínima de uma operação DESTRUTIVA administrativa (soft-delete) — exige confirmação
 * explícita do chamador (CLAUDE.md §24/Fase 17: "nunca confiar em UI escondida"). O contrato Zod
 * de cada domínio (`@/contracts/admin-content.ts`) usa `z.literal(true)` para `confirm`, então um
 * payload sem o campo (ou com `confirm: false`) já falha na validação, antes mesmo do serviço.
 */
export interface ConfirmDeleteInput {
  id: string;
  confirm: true;
}

/**
 * Paginação PADRÃO de listagens (performance — página limitada no banco, sem "carregar tudo").
 * Usada nos métodos `list*Page` dos repositórios (contract + mock + prisma), nas actions de
 * ADMIN com input Zod e nos retornos tipados `PageResult<T>`.
 *
 * Invariantes aplicadas por `normalizePageQuery`:
 * - `page` começa em 1 (abaixo é empurrado para 1 — nunca página zero).
 * - `pageSize` fica em `[1, MAX_PAGE_SIZE]` (default `DEFAULT_PAGE_SIZE`).
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export interface PageQuery {
  /** Página baseada em 1 (>= 1). */
  page: number;
  /** Items por página >= 1 e <= MAX_PAGE_SIZE. */
  pageSize: number;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function normalizePageQuery(page: unknown, pageSize: unknown): PageQuery {
  const parsedPage = typeof page === "number" && Number.isFinite(page) ? Math.trunc(page) : 1;
  const parsedSize =
    typeof pageSize === "number" && Number.isFinite(pageSize) ? Math.trunc(pageSize) : DEFAULT_PAGE_SIZE;
  return {
    page: Math.max(0, parsedPage - 1), // 0-based para slice/offset interno
    pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, parsedSize)),
  };
}
