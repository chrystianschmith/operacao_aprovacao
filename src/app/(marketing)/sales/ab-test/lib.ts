import { AB_TEST_CONFIG } from "@/config/business";

export type AbExperimentId = keyof typeof AB_TEST_CONFIG.experiments;

export interface AbVariant {
  id: string;
  label: string;
}

export interface AbExperiment {
  enabled: boolean;
  trafficBias: number;
  variants: readonly AbVariant[];
}

export function getExperiment(experimentId: AbExperimentId): AbExperiment | undefined {
  return AB_TEST_CONFIG.experiments[experimentId];
}

export function getVariantIds(experimentId: AbExperimentId): readonly string[] {
  const experiment = getExperiment(experimentId);
  return experiment ? experiment.variants.map((v) => v.id) : [];
}

/**
 * Seleciona uma variante determinística para um visitante a partir de um bucket 0-99.
 * `trafficBias` limita a fração de tráfego participante (padrão 1 = 100%).
 * Quando o experimento está desabilitado ou fora do bias, retorna a variante de controle.
 */
export function resolveVariant(experimentId: AbExperimentId, bucket: number): string {
  const experiment = getExperiment(experimentId);
  if (!experiment || !experiment.enabled || experiment.variants.length === 0) {
    return experiment?.variants[0]?.id ?? "control";
  }

  const safeBucket = ((bucket % 100) + 100) % 100;

  if (safeBucket >= Math.min(100, Math.max(0, experiment.trafficBias * 100))) {
    return experiment.variants[0]?.id ?? "control";
  }

  const variantIndex = Math.floor((safeBucket * experiment.variants.length) / Math.max(1, experiment.trafficBias * 100));
  const clamped = Math.min(experiment.variants.length - 1, Math.max(0, variantIndex));
  return experiment.variants[clamped]?.id ?? "control";
}

/** Bucket determinístico 0-99 a partir de um hash simples (FNV-1a) da chave do visitante. */
export function computeBucket(visitorKey: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < visitorKey.length; i += 1) {
    hash ^= visitorKey.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % 100;
}