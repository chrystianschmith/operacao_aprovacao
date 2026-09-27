import { describe, expect, it } from "vitest";
import {
  computeBucket,
  getVariantIds,
  resolveVariant,
  type AbExperimentId,
} from "@/app/(marketing)/sales/ab-test/lib";
import { AB_TEST_CONFIG } from "@/config/business";

/**
 * Testes do A/B de vendas (agente sales-page):
 * - bucket determinístico e bem distribuído;
 * - variante de controle quando experimento desabilitado;
 * - resolução sempre dentro das variantes válidas de cada experimento.
 */
describe("ab-test/lib (bucketing)", () => {
  it("produz um bucket estável 0-99 para a mesma chave", () => {
    const key = "203.0.113.5|Mozilla/5.0 (X11; Linux)";
    expect(computeBucket(key)).toBe(computeBucket(key));
    expect(computeBucket(key)).toBeGreaterThanOrEqual(0);
    expect(computeBucket(key)).toBeLessThan(100);
  });

  it("distribui 1000 chaves em buckets com cobertura razoável", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i += 1) {
      seen.add(computeBucket(`visitor-${i}`));
    }
    expect(seen.size).toBeGreaterThan(80);
  });

  it("resolve sempre para a variante de controle quando o experimento está desabilitado", () => {
    const experiments = Object.keys(AB_TEST_CONFIG.experiments) as AbExperimentId[];
    const disabled = experiments.find((id) => AB_TEST_CONFIG.experiments[id].enabled === false);

    if (!disabled) {
      return;
    }

    const controlId = getVariantIds(disabled)[0];
    for (let bucket = 0; bucket < 100; bucket += 1) {
      expect(resolveVariant(disabled, bucket)).toBe(controlId);
    }
  });

  it("permanece dentro das variantes válidas para todos os experimentos em todos os buckets", () => {
    const experiments = Object.keys(AB_TEST_CONFIG.experiments) as AbExperimentId[];
    expect(experiments.length).toBeGreaterThan(0);

    for (const id of experiments) {
      const ids = getVariantIds(id);
      expect(ids.length).toBeGreaterThan(0);

      for (let bucket = 0; bucket < 100; bucket += 1) {
        expect(ids).toContain(resolveVariant(id, bucket));
      }
    }
  });

  it("tolera experimento inexistente retornando controle", () => {
    // Um id inválido em runtime (ex.: cookie/env malformada) não deve quebrar a resolução.
    const unknown = "nao_existe" as AbExperimentId;
    expect(getVariantIds(unknown)).toEqual([]);
    expect(resolveVariant(unknown, 42)).toBe("control");
  });
});