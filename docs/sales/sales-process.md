# Sales Process — Operação Aprovação

> Processo comercial unificado: Inside Sales (Auto-serviço + Assistido Leve) + High Touch (Mentoria/Turma VIP)
> Foco: **Receita Recorrente (MRR/ARR)** — LTV > CAC é a regra absoluta.
> Integração total com Marketing (MQL/SQL shared definition) + Produto (Health Score triggers).

---

## 1. Pipeline & Stages (CRM)

| Stage | Nome CRM | Definição Precisa | Critério Entrada | Critério Saída (Próximo) | SLA Máx | Owner |
|-------|----------|-------------------|------------------|--------------------------|---------|-------|
| **1** | `New Lead` | Lead capturado (LM, Quiz, VSL, Checkout Abandonado) | `CompleteRegistration` / `Lead` event | Score ≥ 20 OU 24h sem ação | 24h | Auto (CRM) |
| **2** | `Engaged` | Lead interagiu: abriu 2+ emails, clicou link VSL/Checkout, visitou pricing, tempo site > 2min | Score ≥ 20 | Score ≥ 50 OU 7d no stage | 7d | Auto (CRM) |
| **3** | `MQL` (Marketing Qualified) | Lead qualificado marketing: Score ≥ 50 (abriu 3+ emails, clicou VSL, visitou checkout, tempo > 3min) | Score ≥ 50 | Score ≥ 70 OU WhatsApp outreach iniciado | 48h | Marketing → SDR |
| **4** | `SQL` (Sales Qualified) | Lead qualificado vendas: Score ≥ 70 + WhatsApp outreach RESPONDIDO OU Call agendada | Score ≥ 70 + Resposta WA / Call agendada | Call realizada + BANT qualificado | 2h (WA) / 48h (Call) | SDR |
| **5** | `Qualified Opportunity` | BANT confirmado: Budget (pode pagar), Authority (decide), Need (dor clara), Timing (agora/30d) | Call 15-20min + BANT OK | Proposta enviada / Link Checkout personalizado | 24h pós-call | Closer |
| **6** | `Proposal Sent` | Link Checkout personalizado (Turma/Mentoria) OU Proposta PDF Notion enviada | Proposta enviada (WhatsApp/Email) | Pagamento confirmado OU Follow-up 3x sem resposta | 48h | Closer |
| **7** | `Closed Won` | Pagamento confirmado (Stripe/MP `payment_intent.succeeded`) | `Purchase` event | Onboarding iniciado | Imediato | Auto (Webhook) |
| **8** | `Closed Lost` | Lead disse "não" explícito OU 3 follow-ups sem resposta OU Score < 20 por 30d | Decisão explícita / Timeout | Arquivado (pode reativar win-back) | Imediato | SDR/Closer |

---

## 2. Lead Scoring Model (Dinâmico — Atualizado Tempo Real)

| Ação | Pontos | Decaimento | Notas |
|------|--------|------------|-------|
| Baixou Lead Magnet (LM) | +10 | -1/dia após 7d | Tag `lm_[slug]` |
| Abriu Email (onboarding/reengajamento) | +3 | -1/dia | Máx +15/dia |
| Clicou Link Email (VSL, Checkout, Blog) | +8 | -2/dia | UTM tracked |
| Visitou Página Checkout | +25 | -5/dia | `ViewContent /checkout` |
| Iniciou Checkout (`InitiateCheckout`) | +50 | -10/dia | High intent |
| Assistiu VSL 50%+ | +15 | -3/dia | `VideoPlay 50%` |
| Assistiu VSL 75%+ | +25 | -3/dia | `VideoPlay 75%` |
| Assistiu VSL 95%+ | +35 | -3/dia | `VideoPlay 95%` |
| Fez Quiz Diagnóstico | +20 | -2/dia | `quiz_completed` |
| Respondeu Email (Reply) | +30 | Sem decaimento | High signal |
| Respondeu WhatsApp (Inbound) | +40 | Sem decaimento | Highest signal |
| Agendou Call (Calendly) | +50 | Sem decaimento | `meeting_scheduled` |
| Participou Call (Compareceu) | +60 | Sem decaimento | `meeting_completed` |
| NPS ≥ 9 (Promotor) | +20 | Sem decaimento | Advocate |
| Comprou (Purchase) | RESET → Customer | — | Novo ciclo: Onboarding Score |

**Thresholds**:
- **< 20**: `Cold` (Nurturing automático)
- **20-49**: `Engaged` (Email sequence ativo)
- **50-69**: `MQL` (Marketing nutre + SDR monitora)
- **70-89**: `SQL` (SDR outreach ativo WhatsApp/Call)
- **≥ 90**: `Hot` (Closer priority imediato)

**Decaimento Diário**: Job CRM 02h — subtrai pontos por inatividade. Mínimo 0.

---

## 3. SLA de Follow-up (Regras de Ouro)

| Trigger | Canal | Tempo Máximo | Template | Escalação Se Sem Resposta |
|---------|-------|--------------|----------|---------------------------|
| **Iniciou Checkout** (Abandono) | WhatsApp (se opt-in) | **15 min** | `recovery_abandoned_15min` | Email 30min + WA 2h |
| **Iniciou Checkout** | Email | **30 min** | `recovery_abandoned_email` | WA 2h + Email 24h |
| **Visitou Checkout** (Não iniciou) | Email | **2h** | `recovery_visit_checkout` | WA 4h (se opt-in) |
| **Lead Quente (Score ≥ 70)** | WhatsApp | **2h (úteis 9-18h)** / **4h (fora)** | `sdr_outreach_hot` | Call agendada 24h |
| **Lead Quente (Score ≥ 70)** | Email | **4h** | `sdr_outreach_email` | WA 24h |
| **Resposta Lead (Inbound WA/Email)** | Mesmo canal | **15 min** | Humano personalizado | — |
| **Agendou Call** | WhatsApp + Email | **Imediato** | Confirmação + Lembrete 24h/1h | — |
| **Pós-Call (Proposta Enviada)** | WhatsApp | **30 min** | `proposal_sent_wa` | Email 2h |
| **Follow-up Proposta (Dia 1, 3, 7, 14)** | WhatsApp + Email | **9h (Dia 1/3/7) / 14h (Dia 14)** | `followup_proposal_d1/d3/d7/d14` | Call 14h (Dia 14) |
| **Pagamento Falhou** | WhatsApp + Email | **Imediato** | `payment_failed_immediate` | Call 2h (se valor > R$ 500) |
| **Cancelamento Solicitado** | WhatsApp (Fundador) | **30 min** | `winback_founder_wa` | Email Fundador 2h |
| **Churn Risk (Score < 40)** | WhatsApp (SDR) | **4h** | `retention_risk_wa` | Call 24h |
| **Inativo 7d (Assinante)** | Push + Email | **Imediato** | `inactivity_nudge` | WA SDR 48h |

---

## 4. Qualification Framework (BANT Adaptado — Call 15-20min)

| Dimensão | Perguntas-Chave | Sinais Positivos | Sinais Negativos | Score (0-10) |
|----------|-----------------|------------------|------------------|--------------|
| **Budget** | "Qual seu orçamento mensal pra estudos?" / "Já investiu em cursinho? Quanto?" | Já pagou cursinho > R$ 200/mês / Tem cartão/PIX pronto / "Invisto no que funciona" | "Não tenho dinheiro" / "Só gratuito" / "Vou pedir pro pai/mãe" (sem autonomia) | |
| **Authority** | "Quem decide essa compra?" / "Precisa alinhar com alguém?" | "Eu decido" / "Converso com cônjuge mas decido junto" (agenda call conjunta) | "Preciso pedir pro chefe/pai/mãe" (sem call conjunta agendada) | |
| **Need** | "Qual sua maior trava hoje?" / "Já fez simulado? Qual nota?" / "Qual concurso? Quando prova?" | Dor clara (tempo, organização, ansiedade, reprovação) / Concurso definido / Data prova | "Só curiosidade" / "Não sei qual concurso" / "Vou ver depois" | |
| **Timing** | "Quando quer começar?" / "Edital sai quando?" / "Tem urgência?" | "Agora" / "Edital em 60d" / "Quero streak antes da prova" | "Daqui 6 meses" / "Só ano que vem" / "Sem pressa" | |
| **Fit (Extra)** | "Tempo disponível/dia?" / "Já usa app/anKi/planilha?" / "Conhece nossa plataforma?" | 45min+ dia / Já tentou ferramentas / Conhece features | "Tenho 10min/semana" / "Nunca organizou" / "Não sabe o que é streak" | |

**Regra**: Score BANT ≥ 25/40 = `Qualified Opportunity` → Envia Proposta/Link Checkout. < 25 = Nutre mais / Agenda follow-up 14d.

---

## 5. Scripts — WhatsApp Outreach (Primeira Mensagem)

### Template A: Lead Quente (Score ≥ 70 — Abriu VSL / Visitou Checkout)
> "Oi [Nome], vi que você [assistiu a aula grátis / visitou nosso checkout / baixou o cronograma]. Tudo bem?\n\nSou [Nome SDR] da Operação Aprovação. Queria saber: **qual seu concurso alvo e quanto tempo você tem pra estudar por dia?**\n\nPosso te mandar um **diagnóstico rápido dos seus gaps (grátis)** e ver se nosso sistema faz sentido pra você. Sem compromisso.\n\nPode me dizer?"

### Template B: Lead MQL (Score 50-69 — Engajado Email/Conteúdo)
> "Oi [Nome], passando rapidinho: vi que você abriu nossos emails sobre [tempo real / streak / simulados]. Faz sentido pra sua rotina?\n\nSe quiser, mando um **plano 45min/dia adaptado pro seu horário** (grátis, PDF + Notion). Bora?\n\nResponde 'SIM' que te mando aqui."

### Template C: Checkout Abandonado (15min — Se Opt-in WA)
> "Oi [Nome], vi que começou o checkout mas não finalizou. Tudo bem? Posso ajudar em algo?\n\nO desconto PIX 10% expira em 2h. Garantia 30 dias. Cancel 1 clique.\n\nQualquer dúvida, tô aqui."

### Template D: Churn Risk (Score < 40 — Inativo 7d)
> "Oi [Nome], sou [Nome SDR] da Operação Aprovação. Vi que seu acesso tá paradinho há uns dias. Seu concurso [CONCURSO_ALVO] não espera.\n\nPosso te mandar um **plano de recuperação 7 dias** (grátis) adaptado pro seu horário atual?\n\nÉ só me dizer: quantos minutos você consegue hoje? 15? 30? 45?\n\nMonto e te mando aqui. Sem custo. Bora?"

---

## 6. Scripts — Call Qualificação (15-20min — Estrutura)

```
0:00-1:00  | RAPPORT + CONTEXT
           "Oi [Nome], tudo bem? Sou [Nome] da Operação Aprovação.
           Vi que você [contexto: assistiu aula / visitou checkout / baixou cronograma].
           Tenho uns 15min aqui. Posso fazer umas perguntas rápidas pra ver se a gente faz sentido?"

1:00-5:00  | NEED (DOR + CONTEXTO)
           "Me conta: qual seu concurso alvo? Quando a prova?
           Qual sua rotina hoje? Trabalha? Estuda quanto por dia?
           Qual sua MAIOR trava hoje? (Tempo? Organização? Ansiedade? Matéria específica? Simulado?)
           Já fez simulado recente? Qual nota? Onde errou mais?
           Já tentou cursinho/app/anKi? O que faltou?"

5:00-10:00 | SOLUTION FIT (APRESENTAÇÃO CONSULTIVA)
           "Entendi. [Nome], pelo que você me contou, seu perfil é [Trabalhador 45min / Reprovado gaps / Iniciante ansioso].
           Nosso sistema resolve exatamente isso:
           • Tempo Válido Real: Heartbeat mede seu FOCO, não 'aba aberta'.
           • Plano IA: Gera seu dia em 30s adaptado pros seus [X]min.
           • Simulados [BANCA]: Correção auto + Caderno erros vira Flashcard SM-2.
           • Ranking [CIDADE]: Você vê sua posição real. 'Se ele consegue, eu também'.
           • Streak + XP: Gamificação que te faz voltar TODO dia.
           Isso faria sentido pra sua rotina?"

10:00-15:00 | BANT + OBJECTIONS
           "Pra gente avançar: qual seu orçamento mensal pra estudos? (Já investiu antes?)
           Quem decide? (Você / Cônjuge / Pai) — Se não você, bora call a 3?
           Quando você quer começar? (Agora / Próxima semana / Quando edital sair)
           Alguma trava? (Preço? Tempo? Confiança? 'Já comprei e não usei?')
           
           [TRATA OBJEÇÃO - Vê seção 7]"

15:00-18:00 | NEXT STEPS
           "Perfeito. Vou te mandar no WhatsApp:
           1. Link checkout personalizado (Anual R$ 1.997 + Mentoria 30min grátis essa semana)
           2. Ou se preferir mensal: R$ 197/mês (cancele quando quiser)
           3. Diagnóstico gaps grátis (PDF) — já mando agora.
           
           Qual prefere? Anual (trava preço) ou Mensal (flexibilidade)?
           Bora fechar hoje pra você já gerar seu plano?"
```

---

## 7. Objeções Mapeadas — Respostas Prontas (WhatsApp/Call/Email)

| Objeção | Raiz | Resposta Curta (WA) | Resposta Completa (Call/Email) |
|---------|------|---------------------|--------------------------------|
| **"Caro / Sem dinheiro"** | Prioridade / Caixa | "R$ 6,50/dia (anual). Salário PM = 1.000x ROI. Parcelamento 12x. Garantia 30d." | "Entendo. Pense no custo de NÃO passar: mais 1 ano estudando, editais passando, salário R$ 5-10k/mês não entrando. Nossa garantia 30 dias tira o risco: use tudo, se não ver evolução real no tempo válido/ranking/simulados, devolvemos 100%. Parcelamento 12x sem juros. PIX 10% off." |
| **"YouTube / Grátis / Sozinho"** | Subestima sistema | "YouTube = conteúdo. Nós = SISTEMA: curadoria + mensuração + revisão + benchmark. Economiza 10h/semana." | "YouTube é ótimo P/ CONTEÚDO. Nós somos o SISTEMA: curadoria (o que cai), mensuração (tempo real), repetição espaçada (flashcards), benchmark (ranking), constância (streak). Você economiza 10h/semana de organização. Suas 10h viram 10h de ESTUDO PURO." |
| **"Vou esperar edital"** | Procrastinação | "Quem começa AGORA tem 3-6 meses vantagem. Edital = 90d. Bônus 'Revisão de Véspera' só pra quem entra ANTES." | "O edital é o GATILHO, não o INÍCIO. Quem estuda ANTES: (1) Já tem base, (2) Só revisa o que cai, (3) Faz simulados enquanto outros aprendem matéria nova. Nosso bônus 'Revisão de Véspera' só libera pra quem entrou ANTES do edital." |
| **"Pouco tempo / Trabalho 8h"** | Crença limitante | "Modo Foco 15min + Plano IA adaptativo. Alunos com 45min/dia passam. Consistência > Intensidade." | "A consistência vence intensidade. Nosso Plano IA gera cronograma baseado no SEU tempo real (1h? 45min? 30min?). Modo Foco 15min cabe em qualquer intervalo. Flashcards offline no ônibus. Streak não quebra se fez 15min. O sistema se adapta a VOCÊ." |
| **"Já comprei e não usei"** | Trauma compra passada | "Aqui não é 'acesso'. É SISTEMA que te cobra (streak), ranqueia, dá XP. Se não entra, te avisa." | "Cursinho = biblioteca passiva. Operação Aprovação = SISTEMA ATIVO. Você ganha XP por aula, streak por dia, ranking por desempenho. Se não entra no app, recebe notificação: 'Sua streak tá em risco'. Isso cria accountability real. Teste 7 dias e vê se sente diferença." |
| **"Não confio / Golpe"** | Mercado saturado | "CNPJ ativo, 12k+ alunos, garantia 30d real, cancel 1 clique, suporte WhatsApp humano." | "CNPJ: 45.123.456/0001-78. Endereço: Av. Paulista, 1000 - SP. Reclame Aqui: RA1000. 12.847 alunos ativos. Depoimentos com @instagram verificável. Garantia 30 dias: usa tudo, não gostou, email suporte@ → devolução em 48h. Cancelamento: 1 clique no dashboard, sem ligar pra ninguém. Teste 7 dias grátis sem cartão." |
| **"Preciso falar com esposo/a"** | Decisor compartilhado | "Perfeito. Mando material pro decisor + agendo call a 3 (15min). Qual melhor horário pros 2?" | "Mando por WhatsApp/Email: PDF 'Para o Decisor' (ROI, Garantia, Cases, Cancel 1 clique). Agendamos call 15min a 3 (você + decisor + eu). Tiramos dúvidas na hora. Qual melhor horário pros 2?" |

---

## 8. High Touch Sales — Mentoria 1:1 / Turma VIP (Playbook)

### Qualificação para Mentoria (Threshold Score > 75 + Comportamento)
| Critério | Mínimo | Verificação |
|----------|--------|-------------|
| Dias ativos/30 | > 20 | App Analytics |
| Streak atual | > 14 | App |
| % Curso concluído | > 30% | App |
| Simulados feitos | > 5 | App |
| NPS / Feedback | > 8 | Survey |
| Pagamento em dia | Sim | Stripe |

### Outreach Mentoria (WhatsApp SDR → Closer)
> "Oi [Nome], parabéns pela streak de [X] dias! 🎖️\nVi que você tá mandando bem nos simulados (média [Y]%).\nQuer levar pro próximo nível? Tenho vaga pra **Mentoria 1:1** esse mês:\n• 4 calls/mês (30min) + WhatsApp ilimitado\n• Plano personalizado + Revisão simulados + Mindset\n• R$ [997-1.497]/mês (conforme professor)\nSó 5 vagas/mês. Quer que eu mande detalhes?"

### Proposta Mentoria (PDF/Notion — Enviada Pós-Call Diagnóstico 30min)
**Estrutura**:
1. **Diagnóstico**: Gaps identificados + Pontos fortes + Estilo aprendizagem
2. **Plano Personalizado**: Cronograma semanal vivo (Notion) + Metas semanais/mensais
3. **Metodologia**: 4 calls/mês (30min) + WhatsApp ilimitado + Revisão simulados gravada
4. **Professor Especialista**: Acesso direto pra dúvidas técnicas (matéria específica)
5. **Investimento**: R$ 997-1.497/mês (3 meses mínimo) | Early Bird 3 primeiros meses: R$ 797
6. **Garantia**: 30 dias — Se não valer, devolve 1º mês
7. **Próximos Passos**: Link Checkout Mentoria + Contrato DocuSign + Agenda Call Boas-vindas

---

## 9. Métricas de Vendas (Dashboard Semanal — Sales Head)

| Métrica | Meta | Fonte | Alerta Se |
|---------|------|-------|-----------|
| **Novas Oportunidades (SQL→Opp)** | > 50/semana | CRM | < 30 |
| **Taxa SQL → Opportunity** | > 40% | CRM | < 25% |
| **Taxa Opportunity → Closed Won** | > 30% | CRM | < 20% |
| **Ciclo Médio (SQL → Won)** | < 14 dias | CRM | > 21 dias |
| **Ticket Médio Fechado** | > R$ 1.500 (inclui upsells) | CRM + Stripe | < R$ 1.000 |
| **Receita High Touch/Mês** | > R$ 100k | CRM + Stripe | < R$ 50k |
| **Follow-up SLA Compliance** | > 95% no prazo | CRM | < 85% |
| **Pipeline Value (Weighted)** | > 3x Meta Mensal | CRM | < 2x |
| **Churn Save Rate** | > 30% (Score < 40) | CRM | < 20% |
| **Win-back Rate (30d/90d)** | 20% / 10% | CRM | < 10% / < 5% |

---

## 10. Integração Marketing ↔ Sales (SLA Bidirecional)

| Marketing Entrega para Sales | Sales Entrega para Marketing |
|------------------------------|------------------------------|
| MQLs com Score ≥ 50 (diário, via CRM) | Feedback qualidade MQL (Semanal: % SQL, % Lost, motivos) |
| Leads com `utm_campaign`, `utm_content`, `lead_source` completos | Motivos Lost detalhados (Preço, Tempo, Confiança, Fit, Timing) |
| Alertas tempo real: `InitiateCheckout`, `Score ≥ 70`, `meeting_scheduled` | Gravações Call (anônimas) para melhorar copy/ads |
| Lead Magnets / Quiz resultados completos no perfil | Objeções novas não mapeadas |
| Calendário campanhas (lançamentos, editais) 30d antecedência | Feedback criativos: "Esse anúncio traz lead qualificado / não qualificado" |

**Reunião Alinhamento**: Segunda 9h (30min) — Marketing Head + Sales Head + Fundador
**Relatório Semanal Compartilhado**: Looker Studio — "Marketing → Sales Funnel" + "Sales → Marketing Feedback"

---

*Próximo: `scripts/closing.md` (Fechamento) → `scripts/objections-handling.md` (Detalhado) → `offers/pricing-strategy.md` → `offers/checkout-optimization.md` → `offers/upsell-playbooks.md` → `crm-setup.md` → `onboarding-flow.md` → `retention-expansion.md` → `kpi-targets.md` → `compensation-plan.md`.*