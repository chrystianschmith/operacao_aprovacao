import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guarda estrutural contra REGRESSÃO da deduplicação do mapeador de erros
 * (relatório do agente Qualidade — tarefa 1 "Duplicação de lógica"): antes,
 * 9 Server Actions de aluno + 1 do admin cada uma definia o MESMO
 * `function toActionError(...)` local. Consolidado em `src/server/errors`
 * (ponto único) + wrapper de mensagem do admin em `admin/shared.ts`.
 * Estes testes falham se alguém reintroduzir uma cópia local.
 */

const actionsDir = path.resolve(process.cwd(), "src", "server", "actions");

function listTsFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listTsFiles(full);
    return entry.name.endsWith(".ts") ? [full] : [];
  });
}

const ALLOWED_IMPORTS = [
  'from "@/server/errors"',
  'from "./shared"',
  'from "@/server/actions/admin/shared"',
];

describe("Deduplicação do mapeador de erros (toActionError)", () => {
  const files = listTsFiles(actionsDir);

  it("nenhuma Server Action define um toActionError local (exceto o wrapper admin)", () => {
    for (const file of files) {
      const rel = path.relative(actionsDir, file);
      if (rel === "admin/shared.ts") {
        // Wrapper intencional: delega ao helper único, só troca a mensagem de fallback.
        continue;
      }
      const source = readFileSync(file, "utf8");
      expect(source, rel).not.toMatch(/function\s+toActionError\b/);
    }
  });

  it("todo uso de toActionError importa de um ponto único (@/server/errors ou admin/shared)", () => {
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      if (!/\btoActionError\b/.test(source)) continue;
      const rel = path.relative(actionsDir, file);
      expect(
        ALLOWED_IMPORTS.some((imp) => source.includes(imp)),
        `import de toActionError ausente ou fora do padrão em ${rel}`,
      ).toBe(true);
    }
  });

  it("a mensagem de fallback padrão do helper existe uma única vez (em @/server/errors)", () => {
    const errorsSource = readFileSync(
      path.resolve(process.cwd(), "src", "server", "errors", "index.ts"),
      "utf8",
    );
    expect(errorsSource).toContain('"Não foi possível processar a solicitação."');

    for (const file of files) {
      const rel = path.relative(actionsDir, file);
      if (rel === "admin/shared.ts") continue;
      const source = readFileSync(file, "utf8");
      expect(source, rel).not.toContain('"Não foi possível processar a solicitação."');
    }
  });
});