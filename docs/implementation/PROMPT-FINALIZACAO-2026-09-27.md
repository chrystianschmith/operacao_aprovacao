# Prompt de Finalização — Status e Próximos Passos (2026-09-27)

> Prompt mestre gerado para consolidar todas as pendências recomendadas e executá-las até a
> finalização. Base auditada: `f3ef189`. **Calibrado à realidade do código**, não aos docs de
> produção que ficaram defasados (CURRENT_STATE.md / PRODUCTION_ROADMAP.md descrevem um estado
> antigo — 34 repos "stub", 741 testes — que **não** corresponde ao atual: 44 repos Prisma
> implementados, 979 testes unit, CI completo, MFA, billing, e-mail, storage e auth de
> registro/recuperação entregues nas revalidações de 13 e 14/09).

---

## Contexto verificado (não presumido)

Fonte: auditoria direta do repositório em 27/09/2026.

| Área | Estado real no código |
|---|---|
| Repos Prisma | **44 arquivos em `src/server/repositories/prisma/`, zero `"not implemented"`** |
| `src/server/db` | Existe (`prisma.ts`, singleton + adapter pg) |
| Migrations | `0000_init` … `0013_add_performance_indexes` (RLS em `0012`) |
| `src/config/env.ts` | Zod cobre `DATABASE_URL`, `SUPABASE_URL/KEY/BUCKET*`, `RESEND_*`, `EMAIL_FROM`, `ACCOUNT_EMAIL_ENCRYPTION_KEY`, `MFA_ENCRYPTION_KEY`, `STRIPE_*`, `AUTH_SECRET`, `CRON_SECRET`; exige HTTPS/`DATA_SOURCE=prisma`/MFA quando `deployed`; documenta `APP_ENV=demo` p/ demo |
| Auth | Rotas `login`, `cadastro`, `recuperar-senha`, `redefinir-senha`, `verificar-email` existem; MFA em `/seguranca`; MFA obrigatório em prod (bootstrap) |
| API | `auth`, `cron/{account-emails,billing,ranking-recalc}`, `billing/webhook`, `focus/heartbeat`, `health`, `materials/[id]`, `ops/metrics`, `progress/heartbeat` |
| Auditoria | `src/server/audit/log.ts` grava `AuditLog` no Prisma quando `DATA_SOURCE=prisma` |
| Rate-limit | `consumeLoginAttempt`: PostgreSQL em prisma; memória em mock |
| Security headers | CSP com nonce + `strict-dynamic` em `src/proxy.ts` (Next 16) |
| CI | `.github/workflows/ci.yml` com Postgres 18, migrate, seed, lint, typecheck, unit, integração, restore+reintegração, `npm audit`, build, smoke HTTP |
| Google (Professor RS) | Docs/scripts em `scripts/professor-rs`, testes revalidados |
| Sales / Sales-page | Docs completos + página `/sales` com variantes `short`/`vsl`/`quiz`, A/B determinístico via `src/proxy.ts` (cookie `_oa_ab`), pricing em `src/config/business.ts`; experimentos `enabled:false` (decisão explícita) |

## Pendências reais encontradas (e ações)

1. **`npm run build` local falhava** por exigir segredos reais quando `deployed`.
   → **Corrigido/descoberto:** `NODE_ENV=production APP_ENV=demo DATA_SOURCE=mock` + segredos de teste (≥32 chars) executa o build; `deployed=false` preserva o gate de produção real. Documentar como comando.
2. **Docs de produção defasados** (`docs/production/CURRENT_STATE.md`, `PRODUCTION_ROADMAP.md`, `GO_LIVE_CHECKLIST.md`, `docs/implementation/STATUS.md`) descrevem stubs/741 testes.
   → **Ação:** reconciliar o "estado atual" com a realidade: marcar seção como histórico/estado auditado, apontar para `docs/implementation/STATUS.md`/`REVALIDACAO-2026-09-14.md` como verdades vigentes; **não** apagar decisões históricas.
3. **Testes de integração (11 arquivos)** dependem de `TEST_DATABASE_URL`/Postgres; sem Docker/psql local o gate é o CI.
   → Registrado como dependência do ambiente; roda no CI.
4. **Sales-page:** CTA aponta para `/cadastro` — **rota existe** (`src/app/(auth)/cadastro`). Sem pendência de código bloqueante.
5. Experimentos A/B de vendas `enabled:false` — comportamento intencional (gate de produto), já integrado.

## Ordens de execução (nesta sessão)

1. Executar a tríade completa de validação com env compatível:
   `npm run lint && npm run typecheck && npm run test && (npm run build com APP_ENV=demo)`.
2. Registrar o comando de build local no `package.json` (ex.: `build:demo`) e na documentação de operação.
3. Reconciliar docs de produção defasados (marcar como auditoria histórica; manter referência ao estado real).
4. Consolidar relatório final §28/§29 listando o que está entregue vs. o que depende de credenciais/cloud externa.

## Impossível de executar nesta sessão (depende de conta/credenciais humanas)

Provisionamento cloud real (Supabase/Vercel/Cloudflare), domínio, Resend/Stripe de produção,
administrador de bootstrap com segredo real, teste de envio real (e-mail) e cobrança externa.
Também inviável sem Postgres local: rodar a suíte de integração fora do CI.

## Critérios de aceite

- [x] `npm run lint` verde
- [x] `npm run typecheck` verde
- [x] `npm run test` verde (979)
- [x] `npm run build` verde com env demo/teste
- [x] Docs reconciliados apontando para o estado real
- [x] Nenhuma alteração fora do escopo da finalização

## Conclusão (27/09/2026)

Executado até a finalização. `npm run build:demo` documentado em `package.json`,
`scripts/build-demo.mjs` e `docs/implementation/OPERACAO.md`. Docs de produção marcados como
histórico apontando para o estado vigente. Pendências restantes são exclusivamente operacionais
(cloud/credenciais) e dependem de conta humana — listadas na seção acima.