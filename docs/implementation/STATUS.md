# Estado da implementação

Atualizado em 27/09/2026. Base auditada: `f3ef189`. Branch: `main`.

Fonte de verdade vigente do estado do projeto (os docs de produção antigos — por exemplo
`docs/production/CURRENT_STATE.md` — são **auditoria histórica de 13/09** e descrevem stubs já
substituídos por implementação real). Validações atuais: 981 testes unit (153 arquivos), lint e
typecheck verdes, `npm run build:demo` (build de validação local) verde, suíte de integração
(11 arquivos) rodada no CI com PostgreSQL 18.

## Entrega local

Os 172 métodos Prisma incompletos foram implementados. Persistência e contratos cobrem conteúdo, matrículas, progresso, simulados, gamificação, estudo, Brainstorm e flashcards. Foram aplicadas migrations de `0000_init` a `0013_add_performance_indexes` (RLS na `0012_enable_rls`) em PostgreSQL nativo isolado.

Corrigidos os bloqueadores de autorização atualizada, revogação de sessões, exclusão lógica, limite atômico no provider Credentials, configuração de produção, publicação de conteúdo, privacidade e gravações parciais. Operações de domínio usam unidade transacional, eventos/auditoria duráveis e controle de concorrência compartilhado.

Também entregues: configuração administrativa versionada, ranking atômico com snapshots vazios, conquistas persistentes, notas com CAS/autosave, favoritos/conversão real de flashcards, busca, notificações, trilhas, missões retomáveis e dashboard com dados reais. Tempo de vídeo/foco é agregado por atividade aceita, incluindo frações e virada do dia em São Paulo.

Cadastro, verificação e recuperação usam tokens de uso único, senha vinculada ao pedido confirmado e fila de e-mail cifrada. Cobrança Stripe é configurável, com webhook assinado/idempotente, portal e reconciliação manual/agendada, além de tratamento de renovação, reembolso integral e disputa. MFA administrativo foi entregue e é exigido pela configuração de produção. PDFs privados e vídeos MP4 privados têm URLs temporárias emitidas após autorização. Serviços externos foram testados com transportes simulados; não houve cobrança nem envio real.

Corrigido em 27/09: os canais de aquisição (`/sales` e variantes) foram adicionados às rotas públicas do `src/proxy.ts` — estavam protegidos por autenticação por engano, bloqueando o acesso anônimo à página de vendas. Cobertura adicionada em `tests/unit/security-headers.test.ts` (regressão de rotas públicas automatizada).

## Produção (deploy de 16/09)

Ambiente Vercel `operacao-aprovacao` está publicado com banco Supabase (`wgbmzbblsigjbxtwqhdm`, plano Free, São Paulo), `APP_ENV=production`, `DATA_SOURCE=prisma`, RLS habilitado, role de runtime `app_runtime` (BYPASSRLS, sem DDL). Em 27/09 a migration `0013_add_performance_indexes` foi **aplicada de fato em produção**: os 10 índices aditivos foram criados via Management API (role `postgres`, dona das tabelas) e a migration foi marcada como `applied` em `_prisma_migrations` — não há mais migrations pendentes e o próximo `prisma migrate deploy` passa. (A coluna `Question.statementHash` não é criada: foi removida do schema e não é usada pelo código.)

`RESEND_API_KEY` e `EMAIL_FROM` **não estão configurados** em produção. Com isso, o envio de e-mail (verificação de cadastro, recuperação de senha, fila de e-mails do cron) degrada com `AccountConfigurationError` ("Envio de e-mail indisponível. Tente novamente mais tarde.") — cadastro externo permanece fechado na prática. Aplique o remetente Resend + chave no ambiente Production da Vercel e religue o cron de e-mail para abrir o fluxo de cadastro.

## Evidências finais

| Verificação                                    | Resultado                                                                                                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unitários                                      | 999 aprovados, 157 arquivos (27/09/2026)                                                                                                                  |
| Integração PostgreSQL                          | 11 arquivos (origem e banco restaurado; executados no CI)                                                                                                |
| ESLint global                                  | Aprovado (27/09/2026)                                                                                                                                      |
| TypeScript / build Next                        | Aprovados; `npm run build:demo` (validação local, `APP_ENV=demo`) verde                                                                                     |
| Diff banco aplicado vs. schema Prisma          | Sem diferenças                                                                                                                                            |
| npm audit                                      | 0 vulnerabilidades conhecidas na árvore verificada                                                                                                    |
| HTTP no aplicativo compilado                   | Login direto, revogação, limite compartilhado, readiness, métricas protegidas, CSP e MFA aprovados                                                    |
| Backup/restauração local                       | 60 tabelas, 273 registros; hashes e contagens iguais ao snapshot; suíte de integração executada sobre o destino                                       |
| Navegador (rodada de 13/09)                    | Login, catálogo, curso, aula, dashboard real e notas aprovados; navegação imediata aguardou gravação e outra aba recuperou o texto; console sem erros |

Os testes de integração incluem rollback após escritas, concorrência, persistência após reconexão, isolamento por usuário, fila/replay, assinatura de webhook e expiração de matrícula. Testes não equivalem a certificação de segurança nem à homologação dos provedores reais.

## Operação externa ainda pendente

A aplicação não foi publicada em uma conta de nuvem nesta execução. Ainda é necessário configurar domínio, banco/armazenamento gerenciado, remetente de e-mail, chave da fila, scheduler e, para cobrança, Stripe. Depois: validar entrega/checkout com o provedor, monitor externo e restauração real de banco e objetos. O workflow inclui ensaio de dump/restore em banco isolado, mas não foi executado no runner nesta sessão.

Limites registrados: troca de dispositivo MFA sob política obrigatória exige operação assistida; vídeos sem transcodificação adaptativa; a política de risco controla acesso sem cancelar/estornar a assinatura externa; conciliação por lotes exige dimensionamento; algumas agregações carregam listas completas e precisam de otimização antes de ampliar capacidade. O modo pago permanece opcional e não é declarado homologado.

Os relatórios em `docs/agents/execucao-2026-09-13` e `docs/auditoria-2026-09-13` preservam o diagnóstico anterior às correções. Não devem ser usados como estado atual. Consulte [operação](OPERACAO.md) e [entrega controlada](../entrega-usuarios/README.md) para implantação e aceite.

A [revalidação de 14/09](REVALIDACAO-2026-09-14.md) detalha as mudanças e os resultados desta continuação.
