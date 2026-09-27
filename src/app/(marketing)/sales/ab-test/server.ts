/**
 * Levanta headless do bucketing A/B lido no cliente/estático.
 * O bucket é calculado e persistido no cookie `_oa_ab` pelo `src/proxy.ts`;
 * aqui apenas lemos, sem mutar nada (apresentação consome decisão do servidor).
 */
import { AB_TEST_CONFIG } from "@/config/business";
import { computeBucket, resolveVariant, type AbExperimentId } from "./lib";

export const AB_COOKIE_NAME = AB_TEST_CONFIG.cookieName;

export function readBucket(cookie?: string | null): number {
  if (!cookie) return 0;
  const parsed = Number.parseInt(cookie, 10);
  if (Number.isNaN(parsed)) return 0;
  return ((parsed % 100) + 100) % 100;
}

export function getAbVariant(experimentId: AbExperimentId, cookie?: string | null): string {
  return resolveVariant(experimentId, readBucket(cookie));
}

export function createVisitorKey(ip: string | null, userAgent: string | null): string {
  return `${ip ?? "anonymous"}|${userAgent ?? ""}`;
}

export { computeBucket };