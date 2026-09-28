import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";
import { fail, ok } from "@/contracts/common";
import { auditLog } from "@/server/audit";
import { closeDailyStudyMetrics } from "@/server/services/study-tracking/daily-close";

/**
 * Route Handler protegido de cron (ADR-0009, mesmo padrão de
 * `/api/cron/ranking-recalc`) — fecha sequência/metas do dia (recalc-on-write, Fase 12).
 * Sem processo residente: um scheduler externo (ou disparo manual) chama este endpoint; a
 * autenticação NÃO é de usuário — é o segredo compartilhado `CRON_SECRET` via
 * `Authorization: Bearer <segredo>` ou header `x-cron-secret`.
 *
 * IDEMPOTENTE: re-executar para o MESMO dia (default: ontem, UTC) apenas re-upserta os mesmos
 * valores de `UserStreak`/`DailyGoal`/`WeeklyGoal` — nunca duplica pontos (emissões de
 * conclusão usam `idempotencyKey` própria; `computeStreak` é determinístico).
 *
 * Corpo opcional (JSON) — `{ date: "YYYY-MM-DD" }` para fechar um dia específico (passado ou
 * hoje). Sem corpo (ou corpo vazio), fecha ONTEM. Recomendação de agendamento: diariamente à
 * 00:15 UTC (Vercel Cron / qualquer scheduler externo) — o arquivo `vercel.json` é mantido
 * vazio de propósito (mesmo padrão do `ranking-recalc`); documentar no scheduler.
 */
/** Comparação em tempo constante — evita vazar o segredo por timing side-channel. */
function secretsMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const bearerSecret = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;
  const customHeaderSecret = request.headers.get("x-cron-secret");
  const provided = bearerSecret ?? customHeaderSecret;
  return provided !== null && secretsMatch(provided, env.CRON_SECRET);
}

const dailyCloseBodySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD.").optional(),
});

async function handleDailyClose(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    await auditLog({
      operation: "study-tracking.daily-close.unauthorized",
      entity: "UserStreak",
      result: "failure",
      correlationId: "cron:daily-close",
    });
    return NextResponse.json(fail("UNAUTHENTICATED", "Segredo de cron inválido ou ausente."), {
      status: 401,
    });
  }

  const rawBody: unknown = await request.json().catch(() => null);
  const parsedBody = dailyCloseBodySchema.safeParse(rawBody ?? {});

  if (!parsedBody.success) {
    await auditLog({
      operation: "study-tracking.daily-close.invalid_body",
      entity: "UserStreak",
      result: "failure",
      correlationId: "cron:daily-close",
    });
    return NextResponse.json(
      fail(
        "VALIDATION_ERROR",
        "Corpo da requisição inválido para o fechamento diário.",
        parsedBody.error.flatten().fieldErrors,
      ),
      { status: 400 },
    );
  }

  const { date } = parsedBody.data;

  try {
    const result = await closeDailyStudyMetrics({ date, now: new Date() });
    return NextResponse.json(ok({ ...result }));
  } catch (error) {
    await auditLog({
      operation: "study-tracking.daily-close.failed",
      entity: "UserStreak",
      result: "failure",
      correlationId: "cron:daily-close",
      metadata: { date: date ?? null, error: error instanceof Error ? error.message : String(error) },
    });
    return NextResponse.json(fail("INTERNAL_ERROR", "Falha ao fechar as métricas do dia."), {
      status: 500,
    });
  }
}

/** Schedulers (ex.: Vercel Cron) disparam via GET por padrão. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleDailyClose(request);
}

/** Disparo manual/local (ex.: `curl -X POST`) — mesmo handler do GET. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleDailyClose(request);
}