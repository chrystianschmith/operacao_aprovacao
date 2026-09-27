/**
 * Cálculo CENTRAL de nota de simulado (Fase 10 — agente `simulations`, CLAUDE.md §18/§25).
 *
 * ANTES havia uma fórmula inline em `submit-and-finalize` (`correctCount / totalQuestions`),
 * sem ponto único de teste e sem suporte a penalidade por erro ("pontuação negativa", comum em
 * concursos tipo CESPE). Esta função é a única fonte da nota percentual de uma tentativa
 * (`scorePercent`, escala 0–100, docs/DATA-MODEL.md) — o chamador injeta a penalidade
 * configurável (`SIMULATIONS.negativeMarkingPerWrong`) e o resultado é sempre limitado a
 * `[0, 100]` (nunca negativo mesmo com erros demais).
 *
 * REGRA: resposta em branco é NEUTRA (soma nem subtrai); resposta errada anula
 * `negativeMarkingPerWrong` acertos; a nota jamais fica negativa (floor em 0).
 */
export interface ScorePercentInput {
  correctCount: number;
  wrongCount: number;
  /** Documentada para clareza da assinatura (em branco é NEUTRA): conta apenas no denominador.
   *  Não entra na fórmula — somar nem subtrair. */
  blankCount?: number;
  totalQuestions: number;
  /** Quantas respostas certas cada resposta errada anula (padrão 0 = sem penalidade). */
  negativeMarkingPerWrong?: number;
}

export function computeScorePercent({
  correctCount,
  wrongCount,
  totalQuestions,
  negativeMarkingPerWrong = 0,
}: ScorePercentInput): number {
  if (totalQuestions <= 0) {
    return 0;
  }
  const penaltyPerWrong = Math.max(0, negativeMarkingPerWrong);
  const adjustedCorrect = Math.max(0, correctCount - wrongCount * penaltyPerWrong);
  return Math.round((adjustedCorrect / totalQuestions) * 10000) / 100;
}