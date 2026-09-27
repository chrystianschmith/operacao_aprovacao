/** Entidade de domínio de matéria (`Subject`, docs/DATA-MODEL.md). */
export interface SubjectEntity {
  id: string;
  name: string;
  /** Fase 17 (admin) — soft-delete (`Subject.deletedAt`). ISO 8601, ou `null` quando ativa. */
  deletedAt: string | null;
}

/** Entrada de criação administrativa (Fase 17 — "Matérias: cadastrar"). PENDÊNCIA: `Subject`
 *  tem `slug` único no schema Prisma (docs/DATA-MODEL.md); `SubjectEntity` ainda não o modela
 *  (nenhum consumidor atual precisa dele — Fase 6/10 sempre navegam por `id`) — quando a
 *  implementação Prisma real chegar, derivar o slug a partir do nome ou exigi-lo aqui. */
export interface SubjectCreateInput {
  name: string;
  now: Date;
}

export interface SubjectUpdateInput {
  id: string;
  name?: string;
  now: Date;
}

/** Abstração de persistência para matérias (ADR-0002). */
export interface SubjectRepository {
  findById(id: string): Promise<SubjectEntity | null>;
  /** Só matérias ativas (`deletedAt: null`). */
  list(): Promise<SubjectEntity[]>;
  /**
   * BATCH (performance) — matérias ativas por id, em UMA consulta `WHERE id IN (...)`.
   * Usado para resolver nomes de matéria em listagens agregadas (simulados/questões) sem N+1.
   * Ordenação preservada pela ordem de `ids` (mapa id->matéria, não depende do banco).
   */
  listByIds(ids: string[]): Promise<SubjectEntity[]>;
  /** Fase 17 (admin) — TODAS as matérias, incluindo soft-deleted. */
  listForAdmin(): Promise<SubjectEntity[]>;
  create(input: SubjectCreateInput): Promise<SubjectEntity>;
  update(input: SubjectUpdateInput): Promise<SubjectEntity>;
  /** Soft-delete — operação destrutiva; o service exige `confirm: true`. */
  softDelete(id: string, now: Date): Promise<SubjectEntity>;
}
