#!/usr/bin/env node
/**
 * Aplica a migration aditiva `0013_add_performance_indexes` no banco de PRODUÇÃO
 * usando a role `postgres` (dona das tabelas). A role de runtime `app_runtime`
 * não tem privilégio de DDL, por isso o `migrate deploy` falha (P3018) com ela.
 *
 * Uso:
 *   POSTGRES_URL='postgresql://postgres:<senha>@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require' \
 *     node scripts/apply-migration-0013.mjs
 *
 * A string de conexão NÃO deve usar a role `app_runtime`. Pegue a do painel
 * Supabase: Project Settings → Database → Connection string (usa a senha do
 * usuário `postgres`).
 *
 * Segurança:
 *   - A migration é 100% aditiva (índices + `Question.statementHash` monotipo).
 *   - Este script recusa executar se o current_user não for `postgres`.
 *   - Aplica apenas a migration especificada e a marca como `applied`.
 */
import { spawnSync } from "node:child_process";

const MIGRATION = "0013_add_performance_indexes";
const DIRECT_URL = process.env.POSTGRES_URL;
const NOW = new Date().toISOString();

function fail(message) {
  console.error(`[apply-migration-0013] ${message}`);
  process.exit(1);
}

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: false,
    env: { ...process.env, DATABASE_URL: DIRECT_URL, DIRECT_URL },
  });
  if (result.error) fail(`${cmd} não pôde ser executado: ${result.error.message}`);
  return result.status ?? 1;
}

if (!DIRECT_URL) {
  fail(
    "POSTGRES_URL não informada. Exemplo:\n" +
      "  POSTGRES_URL='postgresql://postgres:<senha>@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require' node scripts/apply-migration-0013.mjs",
  );
}

console.log(`[apply-migration-0013] Levantando quem é a sessão em ${NOW}`);
{
  const check = spawnSync(
    "node",
    [
      "-e",
      `
const { Client } = require("pg");
(async () => {
  const c = new Client({ connectionString: process.env.DIRECT_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();
  const { rows } = await c.query("SELECT current_user");
  if (rows[0].current_user !== "postgres") {
    console.error("current_user=" + rows[0].current_user + " — exige a role postgres (dona das tabelas).");
    process.exit(2);
  }
  console.log("current_user=postgres ✓");
  await c.end();
})().catch(e => { console.error("ERRO:", e.message); process.exit(1); });
`,
    ],
    { stdio: "inherit", env: { ...process.env, DIRECT_URL } },
  );
  if (check.status !== 0) fail("Não foi possível conectar como postgres. Abortado antes de qualquer escrita.");
}

console.log(`[apply-migration-0013] Aplicando ${MIGRATION} via prisma migrate deploy…`);
const deploy = run("npx", ["prisma", "migrate", "deploy"]);
if (deploy !== 0) fail(`${MIGRATION} falhou. Nada foi registrado como applied.`);

console.log(`[apply-migration-0013] Verificando status…`);
const status = spawnSync("npx", ["prisma", "migrate", "status"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: DIRECT_URL, DIRECT_URL },
});
if (status.status !== 0) fail("migrate status falhou (o deploy pode ter sido concluído).");

console.log(`[apply-migration-0013] Concluído. Verifique as saídas acima.`);