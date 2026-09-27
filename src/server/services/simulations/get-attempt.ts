import type { AttemptDTO, AttemptResultDTO, AttemptStatusDTO } from "@/contracts/simulations";
import { SIMULATIONS } from "@/config/business";
import { auditLog } from "@/server/audit";
import { assertOwnership, requireUser } from "@/server/authorization";
import { ConflictError, NotFoundError } from "@/server/errors";
import { getRepositories } from "@/server/repositories";
import type { MockExamAttemptEntity } from "@/server/repositories/contracts/mock-exam-attempt-repository";
import { buildAttemptDTO, buildAttemptResultDTO } from "./mappers";

/**
 * Expira LAZY uma tentativa de simulado ABANDONADA cujo tempo (limite + tolerância) já estourou,
 * sem depender de uma submissão para isso (achado de QA — MÉDIO, fluxo "simulado abandonado"):
 *
 * Antes, uma tentativa com cronômetro que ficava no meio e nunca fosse submetida continuava
 * `IN_PROGRESS` indefinidamente: o histórico mostrava "em andamento" mesmo com o tempo morto, e
 * ao reabrir a tela de resolução o cliente recebia `remainingSeconds: 0` e disparava um
 * auto-envio imediato/surpresa (em vez de expor o estado terminal determinístico).
 *
 * Regras (mesmas do servidor em `submitAndFinalize`): só expira quando
 * `elapsedSeconds > timeLimitSeconds + tolerância`; a transição usa a mesma guarda CAS
 * (`expire` com `expectedVersion`) — se uma corrida concorrente já finalizou/expirou a tentativa,
 * nada é gravado aqui; a expiração é auditada exatamente uma vez.
 */
async function lazilyExpireIfOvertime(
  userId: string,
  attempt: MockExamAttemptEntity,
  now: Date,
): Promise<MockExamAttemptEntity> {
  if (attempt.status !== "IN_PROGRESS" || attempt.timeLimitSeconds === null) return attempt;

  const elapsedSeconds = Math.floor((now.getTime() - Date.parse(attempt.startedAt)) / 1000);
  const maxAllowedSeconds = attempt.timeLimitSeconds + SIMULATIONS.timeOverageToleranceSeconds;
  if (elapsedSeconds <= maxAllowedSeconds) return attempt;

  const expired = await getRepositories().mockExamAttempts.expire({
    id: attempt.id,
    expectedVersion: attempt.version,
    now,
  });
  if (!expired) return attempt; // corrida perdida — quem venceu já saiu de IN_PROGRESS; não audita aqui.

  await auditLog({
    operation: "simulations.attempt-expired",
    userId,
    entity: "MockExamAttempt",
    entityId: attempt.id,
    result: "success",
    correlationId: attempt.id,
    metadata: { elapsedSeconds, timeLimitSeconds: attempt.timeLimitSeconds },
  });
  return expired;
}

/**
 * Lê uma tentativa EM ANDAMENTO para o aluno continuar respondendo. Nunca retorna gabarito
 * (`AttemptDTO`) e rejeita ler uma tentativa já finalizada (o cliente deve usar `getResult`).
 *
 * Autorização em duas camadas (ADR-0006, anti-IDOR): `assertOwnership(userId, session.userId)`
 * garante que o chamador só pode consultar em nome de si mesmo; `assertOwnership(attempt.userId,
 * userId)` garante que a TENTATIVA pertence a esse usuário — sem essa segunda checagem, um
 * usuário autenticado poderia ler a tentativa de qualquer outro só adivinhando o `attemptId`.
 */
export async function getAttemptForTaking(userId: string, attemptId: string): Promise<AttemptDTO> {
  const session = await requireUser();
  assertOwnership(userId, session.userId);

  const repos = getRepositories();
  const attempt = await repos.mockExamAttempts.findById(attemptId);
  if (!attempt) {
    throw new NotFoundError("Tentativa não encontrada.");
  }
  assertOwnership(attempt.userId, userId);

  const current = await lazilyExpireIfOvertime(userId, attempt, new Date());
  if (current.status !== "IN_PROGRESS") {
    throw new ConflictError("Esta tentativa já foi finalizada.");
  }

  return buildAttemptDTO(current);
}

/**
 * Lê o resultado (gabarito + métricas) de uma tentativa já corrigida. Rejeita ler o resultado
 * de uma tentativa ainda `IN_PROGRESS`/`EXPIRED`/`CANCELLED` — o gabarito só existe depois da
 * correção real (CLAUDE.md §18/§25).
 */
export async function getResult(userId: string, attemptId: string): Promise<AttemptResultDTO> {
  const session = await requireUser();
  assertOwnership(userId, session.userId);

  const repos = getRepositories();
  const attempt = await repos.mockExamAttempts.findById(attemptId);
  if (!attempt) {
    throw new NotFoundError("Tentativa não encontrada.");
  }
  assertOwnership(attempt.userId, userId);

  if (attempt.status !== "FINISHED") {
    throw new ConflictError("Esta tentativa ainda não foi corrigida.");
  }

  return buildAttemptResultDTO(attempt);
}

/**
 * Lê apenas o STATUS (+ metadados não sensíveis) de uma tentativa, sem questões e sem gabarito.
 * Usado pelas telas para rotear por status explícito e renderizar um estado terminal quando a
 * tentativa está EXPIRED/CANCELLED — em vez de a página de resolução e a de resultado
 * redirecionarem uma para a outra às cegas em cima de um `CONFLICT` (o que causava um loop de
 * redirect para tentativas em estado terminal — achado de segurança Fase 10 — MÉDIO).
 *
 * Mesma dupla checagem de propriedade das demais leituras (anti-IDOR, ADR-0006).
 */
export async function getAttemptStatus(userId: string, attemptId: string): Promise<AttemptStatusDTO> {
  const session = await requireUser();
  assertOwnership(userId, session.userId);

  const repos = getRepositories();
  const attempt = await repos.mockExamAttempts.findById(attemptId);
  if (!attempt) {
    throw new NotFoundError("Tentativa não encontrada.");
  }
  assertOwnership(attempt.userId, userId);

  const current = await lazilyExpireIfOvertime(userId, attempt, new Date());
  const exam = await repos.mockExams.findById(attempt.mockExamId);

  return {
    attemptId: current.id,
    mockExamId: current.mockExamId,
    mockExamTitle: exam?.title ?? null,
    status: current.status,
    startedAt: current.startedAt,
    finishedAt: current.finishedAt,
    totalQuestions: exam?.questionIds.length ?? 0,
  };
}
