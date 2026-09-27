/**
 * Build de validação local em modo demo (CLAUDE.md §26).
 *
 * `next build` roda com `NODE_ENV=production`, o que ativa os gates de produção do
 * `src/config/env.ts` (segredos reais, `DATA_SOURCE=prisma`, HTTPS, MFA). Para validar o
 * bundle localmente sem credenciais de cloud, usamos `APP_ENV=demo` — o próprio contrato de
 * ambiente trata `demo` como "não deploy" e mantém os gates de produção intactos para os
 * ambientes reais (staging/production). Os segredos injetados aqui são placeholders longos
 * (≥32 chars) apenas para satisfazer o schema; nunca devem ser usados fora desta validação.
 */
import { spawn } from "node:child_process";

const env = {
  ...process.env,
  NODE_ENV: "production",
  APP_ENV: "demo",
  DATA_SOURCE: "mock",
  AUTH_SECRET:
    process.env.AUTH_SECRET ?? "demo-build-secret-not-for-deployment-0000000000000001",
  CRON_SECRET:
    process.env.CRON_SECRET ?? "demo-build-cron-secret-not-for-deployment-0000000000000002",
};

const child = spawn("node_modules/.bin/next", ["build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env,
});

child.on("exit", (code) => process.exit(code ?? 1));