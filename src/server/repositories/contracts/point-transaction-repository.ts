/**
 * Ledger IMUTÁVEL de pontos (`PointTransaction`, `prisma/schema.prisma`). Nenhuma linha é
 * atualizada ou removida após criada — correções usam uma nova linha `REVERSAL` apontando
 * para a transação original via `reversedTransactionId` (nunca reescreve o histórico,
 * CLAUDE.md §15/§25). `sumByUserId` soma `points`/`xp` de TODAS as linhas do usuário —
 * por convenção, uma `REVERSAL` é gravada com valores negativos, então a soma simples já
 * neutraliza o estorno sem exigir lógica condicional por `type`.
 */
export type PointTransactionType = "EARN" | "ADJUSTMENT" | "REVERSAL";

export interface PointTransactionEntity {
  id: string;
  userId: string;
  gamificationEventId: string | null;
  idempotencyKey: string;
  type: PointTransactionType;
  points: number;
  xp: number;
  reason: string;
  reversedTransactionId: string | null;
  createdAt: string;
}

export interface PointTransactionCreateInput {
  userId: string;
  gamificationEventId: string | null;
  idempotencyKey: string;
  type: PointTransactionType;
  points: number;
  xp: number;
  reason: string;
  reversedTransactionId?: string | null;
  /** Relógio injetado pelo chamador (engine) — nunca `Date.now()` direto em código puro. */
  now: Date;
}

/** Abstração de persistência do ledger de pontos (ADR-0002). */
export interface PointTransactionRepository {
  findByIdempotencyKey(key: string): Promise<PointTransactionEntity | null>;
  /**
   * Cria a transação. IDEMPOTENTE: se já existir uma linha com a mesma `idempotencyKey`,
   * devolve a existente sem criar (nunca recredita — CLAUDE.md §15).
   */
  create(input: PointTransactionCreateInput): Promise<PointTransactionEntity>;
  listByUserId(userId: string): Promise<PointTransactionEntity[]>;
  /** Saldo total (pontos e XP) do usuário — soma simples de todas as linhas (ver nota acima). */
  sumByUserId(userId: string): Promise<{ points: number; xp: number }>;
  /**
   * Soma de `points` POR DIA CIVIL na `timezone` informada (mesma semântica de
   * `toCalendarDateIso`, `@/server/services/study-tracking/activity-days`): a chave `date` é
   * `YYYY-MM-DDT00:00:00.000Z` (meia-noite UTC do dia calendário local). Agregado NO banco
   * (ex.: `to_char("createdAt" AT TIME ZONE ...)`) em vez de carregar o ledger inteiro — o
   * histórico de pontos cresce sem limite por usuário e o resultado só precisa de um par
   * por dia.
   */
  sumPointsByDate(
    userId: string,
    timezone: string,
  ): Promise<Array<{ date: string; points: number }>>;
}
