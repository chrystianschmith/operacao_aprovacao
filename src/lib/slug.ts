import { randomUUID } from "node:crypto";

/**
 * Gera slug normalizado a partir de um texto (NFKD, sem diacríticos, minúsculas,
 * alfanumérico + hífen) e sufixa com UUID para garantir unicidade.
 * Usado por repositórios que criam entidades com slug único (Subject, Topic, etc.).
 */
export function generateSlug(base: string): string {
  const normalized = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${normalized}-${randomUUID()}`;
}

/**
 * Normaliza texto para uso em slug/chave (sem UUID): NFKD, sem diacríticos,
 * minúsculas, alfanumérico + hífen, sem hífen nas pontas.
 */
export function normalizeForSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}