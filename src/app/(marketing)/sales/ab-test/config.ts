/**
 * Configuração de experimentos A/B da página de vendas.
 * O bucketing determinístico é feito no proxy (cookie `_oa_ab`); aqui expomos apenas a
 * leitura para a UI. Experimentos são declarados em `src/config/business.ts` (AB_TEST_CONFIG).
 */
import { AB_TEST_CONFIG } from "@/config/business";
import { getVariantIds, getExperiment, resolveVariant, type AbExperimentId } from "./lib";

export type { AbExperimentId, AbVariant, AbExperiment } from "./lib";

/** Lista dos ids de experimento declarados (fonte: config central de negócio). */
export const activeExperiments: readonly AbExperimentId[] = Object.keys(
  AB_TEST_CONFIG.experiments,
) as AbExperimentId[];

export function isExperimentEnabled(experimentId: AbExperimentId): boolean {
  return getExperiment(experimentId)?.enabled ?? false;
}

export { getVariantIds, getExperiment, resolveVariant };