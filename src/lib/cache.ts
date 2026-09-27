/**
 * Cache em memória com TTL (performance — dados estáveis que mudam pouco: matérias, assuntos,
 * bancas, editais, ranking materializado). Aplicável a respostas de repositório/serviço para
 * reduzir consultas repetidas ao banco.
 *
 * POR QUE ESTE ARQUIVO EXISTE: vários fluxos leem os MESMOS dados estáveis em loop (ex.:
 * `simulations/mappers.ts` resolve `Subject`/`Topic` por questão numa tentativa; o catálogo de
 * simulado lê `subjects.list()` a cada montagem). Um cache com TTL na camada de repositório
 * transforma N leituras repetidas em 1 consulta real + (N-1) hits de memória — elimina o N+1
 * SEM alterar a assinatura consumida pelos services (ADR-0002: o repositório é o único ponto
 * que conhece a origem dos dados; o cache é detalhe de implementação dele).
 *
 * SEGURANÇA/CORREÇÃO (CLAUDE.md §23/§24):
 * - NUNCA cachear dados pessoais/sensíveis (perfis privados, tentativas, pontos) — o cache
 *   deste módulo é exclusivo de catálogo público/lookup (matérias, assuntos, bancas, editais,
 *   ranking materializado público). Aplicações individuais o habilitam caso a caso.
 * - Toda SOMA (create/update/softDelete) deve INVALIDAR as chaves afetadas; sem isso o
 *   catálogo ficaria stale. Os repositórios Prisma que usam cache fazem isso explicitamente.
 * - O cache é local de processo. Em runtime serverless multi-instância ele é um cache L1
 *   (cada instância tem o seu) — correção garantida pela invalidação em escrita + TTL curto;
 *   a durabilidade nunca depende dele.
 *
 * IMPLEMENTAÇÃO: expiração LAZY (sem `setTimeout`/timer). Cada entrada grava
 * `expiresAt`; `get`/`has` descartam entradas vencidas na leitura. Isso é determinístico com
 * o relógio (`Date.now()`), funcional em vitest com `vi.useFakeTimers()` e evita timers
 * soltos que atrasariam o shutdown.
 */

export interface TtlEntry<T> {
  value: T;
  expiresAt: number;
}

export interface TtlCache<T> {
  /** Retorna o valor não-vencido para `key`, ou `undefined` (também remove entradas vencidas). */
  get(key: string): T | undefined;
  /** `true` quando há valor não-vencido para `key`. */
  has(key: string): boolean;
  /** Grava (ou sobrescreve) `value` sob `key` com `ttlMs` (default = TTL da instância). */
  set(key: string, value: T, ttlMs?: number): void;
  /** Remove uma chave. `true` se existia. */
  delete(key: string): boolean;
  /** Esvazia o cache por completo. */
  clear(): void;
  /** Número de entradas vivas (não-vencidas). */
  size(): number;
}

export function createTtlCache<T>(defaultTtlMs: number): TtlCache<T> {
  if (!Number.isFinite(defaultTtlMs) || defaultTtlMs <= 0) {
    throw new RangeError("createTtlCache: defaultTtlMs deve ser um número positivo finito.");
  }
  const store = new Map<string, TtlEntry<T>>();

  function prune(): void {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.expiresAt <= now) store.delete(key);
    }
  }

  return {
    get(key) {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt <= Date.now()) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    has(key) {
      return this.get(key) !== undefined;
    },
    set(key, value, ttlMs = defaultTtlMs) {
      if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
        throw new RangeError("createTtlCache#set: ttlMs deve ser um número positivo finito.");
      }
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
    delete(key) {
      return store.delete(key);
    },
    clear() {
      store.clear();
    },
    size() {
      prune();
      return store.size;
    },
  };
}

/** Cache com promise pending deduplicada (single-flight) — usado por `cachedLoad`. */
export function promiseCache<T>(loader: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => {
    pending ??= loader().finally(() => {
      pending = undefined;
    });
    return pending;
  };
}

/**
 * Carrega `loader()` e cacheia o resultado sob `key` no `cache` com `ttlMs`. Chamadas
 * concorrentes para a MESMA chave compartilham uma única `loader()` em voo (single-flight —
 * evita o "thundering herd" quando o valor expirou e N requisições chegam juntas).
 * `loader` só é invocado em cache miss.
 */
export function cachedLoad<T>(
  cache: TtlCache<Promise<T>>,
  key: string,
  loader: () => Promise<T>,
  ttlMs?: number,
): Promise<T> {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const run = promiseCache(loader)();
  cache.set(key, run, ttlMs);
  return run.catch((error) => {
    // FALHA NÃO É CACHEADA: se o loader rejeitar, não deixa a promise rejeitada viva no cache
    // (senão todo request subsequente no TTL receberia o mesmo erro) — remove e repassa.
    cache.delete(key);
    throw error;
  });
}