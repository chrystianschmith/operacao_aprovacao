# KPI Dashboard — Marketing + Sales + Produto (Unificado)

> Fonte única de verdade para decisões semanais/quinzenais/mensais.
> Cada métrica: Definição + Fonte + Frequência + Meta + Alerta + Responsável.
> Revisão: **Segunda 9h (Semanal) | Último dia mês (Mensal) | Trimestral (Estratégico)**

---

## 1. Métricas de Aquisição (Marketing — Topo/Medio Funil)

| Métrica | Definição | Fonte | Freq | Meta (Escala) | Alerta Se | Responsável |
|---------|-----------|-------|------|---------------|-----------|-------------|
| **Gasto Total (Ad Spend)** | Investimento total Meta Ads (Bruto) | Meta Ads Manager | Diário | Conforme Budget Pacing | > 120% orçamento diário | Tráfego |
| **CPL (Cost Per Lead)** | Gasto / Leads (CompleteRegistration + Lead) | Meta Ads + CRM | Diário | < R$ 20 (TOFU) / < R$ 35 (MOFU) | > R$ 30 (TOFU) 3d consecutivos | Tráfego |
| **CAC Blended (Marketing)** | Gasto Total Marketing / Novas Assinaturas (atribuição 30d) | Financeiro + CRM + Attribution | Semanal | < R$ 180 | > R$ 220 | Marketing Head |
| **CAC por Canal** | CAC segregado: Meta, Orgânico, Email, Indicação, Afiliado | CRM (UTM/Source) | Semanal | Meta < R$ 180 / Org < R$ 50 / Email < R$ 80 / Ind < R$ 30 | Qualquer > 1.5x meta | Marketing Head |
| **ROAS 7d (Return on Ad Spend)** | Receita (30d attribution) / Gasto 7d | Meta Ads + Stripe | Semanal | > 4.0x | < 3.0x | Tráfego |
| **ROAS 30d** | Receita 30d / Gasto 30d | Financeiro + Meta | Mensal | > 5.0x | < 4.0x | Marketing Head |
| **CTR Link (Click-Through Rate)** | Cliques Link / Impressões | Meta Ads | Semanal | > 1.5% | < 1.0% | Tráfego |
| **Frequência Média** | Impressões / Alcance | Meta Ads | Semanal | TOFU < 3.5 / BOFU < 6.0 | TOFU > 4.0 | Tráfego |
| **CPM (Cost Per Mille)** | Gasto / (Impressões/1000) | Meta Ads | Semanal | < R$ 25 | > R$ 35 | Tráfego |
| **CPC (Cost Per Click)** | Gasto / Cliques Link | Meta Ads | Semanal | < R$ 1.50 | > R$ 2.50 | Tráfego |
| **Leads Qualificados (MQL)** | Leads com Score > 50 (abriu 3+ emails, clicou VSL, visitou pricing) | CRM | Semanal | > 500/semana | < 300 | Marketing Ops |
| **MQL → SQL Rate** | SQL (Score > 70 + WhatsApp outreach) / MQL | CRM | Semanal | > 15% | < 10% | SDR Lead |
| **Lead → Purchase (7d/30d)** | Compras dentro de 7d/30d após lead capture | CRM + Pixel | Semanal | 7d > 1.5% / 30d > 4% | 30d < 3% | Marketing Head |

---

## 2. Métricas de Conversão (Sales — Fundo Funil)

| Métrica | Definição | Fonte | Freq | Meta | Alerta Se | Responsável |
|---------|-----------|-------|------|------|-----------|-------------|
| **Taxa Checkout → Purchase** | Compras / Iniciou Checkout | Stripe/MP + GA4 | Semanal | > 4% | < 3% | CRO / Dev |
| **Taxa Abandono Checkout** | Iniciou Checkout / Não completou (24h) | Stripe/MP | Diário | < 60% | > 70% | CRO |
| **Receita Recuperada (Abandono)** | Receita de carrinhos recuperados (email/WhatsApp) | CRM + Stripe | Semanal | > R$ 15k/mês | < R$ 10k | Email Mkt / SDR |
| **Ticket Médio 1º Pedido** | Receita 1º mês / Novos Clientes | Financeiro | Mensal | > R$ 250 | < R$ 200 | Sales Head |
| **LTV 12m (Cohort)** | Receita acumulada 12m / Clientes cohort | Financeiro | Mensal (Cohort) | > R$ 1.000 | < R$ 800 | Financeiro |
| **Churn Mensal (Logo)** | % Assinantes que cancelam no mês | Stripe/CRM | Mensal | < 5% | > 8% | CS / Sales |
| **Churn Mensal (Revenue)** | MRR Perdido / MRR Início Mês | Stripe | Mensal | < 3% | > 5% | Financeiro |
| **NRR (Net Revenue Retention)** | (MRR Início + Expansão - Churn - Contraction) / MRR Início | Financeiro | Mensal | > 120% | < 105% | Financeiro |
| **Upgrade Anual Rate** | Mensais que viram Anuais / Total Mensais Ativos | Stripe/CRM | Mensal | > 40% | < 30% | Sales / Email |
| **Cross-sell Take Rate** | Kit Físico / Turma VIP / Mentoria comprados / Base Elegível | CRM | Mensal | Kit > 15% / Turma > 4% / Mentoria > 3% | Qualquer < 50% meta | Sales |
| **Payback CAC (Meses)** | CAC / (Ticket Médio × Margem × Retenção Mês) | Financeiro | Mensal | < 2 meses | > 3 meses | Financeiro |

---

## 3. Métricas de Produto & Engajamento (Retenção & Valor)

| Métrica | Definição | Fonte | Freq | Meta | Alerta Se | Responsável |
|---------|-----------|-------|------|------|-----------|-------------|
| **MAU / DAU** | Usuários Ativos Mensais / Diários (Login + Ação) | App Analytics | Diário | MAU > 60% base / DAU/MAU > 25% | DAU/MAU < 20% | Produto |
| **Tempo Válido Médio/Dia** | Média tempo válido (heartbeat) por usuário ativo/dia | App DB | Diário | > 60 min | < 40 min | Produto |
| **Streak Média (Ativos)** | Média dias streak consecutivos (usuários ativos 7d) | App DB | Semanal | > 14 dias | < 7 dias | Produto |
| **Streak 30+ Rate** | % Usuários ativos com streak ≥ 30 dias | App DB | Mensal | > 25% | < 15% | Produto |
| **Simulados/Usuario/Mês** | Média simulados finalizados por usuário ativo | App DB | Mensal | > 3 | < 1.5 | Produto |
| **Flashcards Revisados/Usu/Dia** | Média cards revisados (SM-2) por usuário ativo/dia | App DB | Semanal | > 20 | < 10 | Produto |
| **Aulas Concluídas/Usuario** | Média módulos/aulas completados por usuário | App DB | Mensal | > 2 módulos/mês | < 1 | Produto |
| **NPS (Net Promoter Score)** | Pesquisa 30d pós-compra + 90d recorrente | Survey Tool | Mensal | > 50 | < 30 | CS / Fundador |
| **Health Score Médio** | Média score (0-100: Atividade + Streak + Progresso + NPS + Pagamento) | CRM + App | Semanal | > 70 | < 50 | CS |
| **Churn Risk (Score < 40)** | % Base com Health Score < 40 | CRM | Semanal | < 10% | > 20% | CS / SDR |
| **Suporte Tickets/Usuário** | Tickets abertos / Usuários ativos | Helpdesk | Mensal | < 0.2 | > 0.5 | CS |
| **Tempo Resposta Suporte** | Tempo médio 1ª resposta (WhatsApp/Email) | Helpdesk | Semanal | < 2h (úteis) | > 4h | CS |

---

## 4. Métricas de Campanhas Específicas (Lançamentos)

| Campanha | Métrica Chave | Meta | Frequência Revisão |
|----------|---------------|------|-------------------|
| **Ano Novo (Jan)** | Vendas Stack Ano Novo | 50 | Diária (15d) |
| **Edital PM (Estado)** | Vendas/Estado | 15 | Diária (30-60d) |
| **Black Friday** | Receita Total Semana | R$ 300k+ | Horária (7d) |
| **Black Friday** | Kits Físicos Vendidos | 200 (estoque) | Horária |
| **Black Friday** | ROAS Semana | > 6x | Diária |
| **Ano Novo 2027** | Vendas Stack Fundador | 80 | Diária (10d) |
| **Win-back 30d** | Taxa Reativação | > 20% | Semanal |
| **Upgrade Anual** | Taxa Conversão Mensal→Anual | > 40% | Mensal |
| **Turma VIP** | Vagas Preenchidas / Turma | 15/15 (100%) | Por Turma |
| **Mentoria 1:1** | Vagas Preenchidas / Mês | 5/5 | Mensal |

---

## 5. Dashboard Executivo (Visão Única — Looker Studio / Metabase)

### Aba 1: **Visão Geral (Executive Summary)**
- Cards Grandes: MRR Atual | Novas Assinaturas (7d/30d) | CAC Blended | ROAS 7d | Churn % | NRR | LTV 12m | Payback
- Gráfico: MRR Evolução (12m) + Novas Assinaturas (barras) + Churn (linha)
- Status Semáforo: 🟢 🟡 🔴 por Pilar (Aquisição, Conversão, Retenção, Expansão)

### Aba 2: **Aquisição (Marketing Deep Dive)**
- Funil: Impressões → Cliques → Leads → MQL → SQL → Compra (Taxas cada etapa)
- Por Canal: Gasto, CPL, CAC, ROAS, Leads, Compras (Tabela + Barras)
- Campanhas: Top 10 por Gasto + ROAS (Bolhas: X=Gasto, Y=ROAS, Tamanho=Compras)
- Criativos: Top 10 por CTR + CAC (Tabela + Imagem miniatura)
- Audiências: LAL 1% vs 3% vs Interest vs Broad (Comparativo)

### Aba 3: **Conversão & Sales (Bottom Funnel)**
- Checkout: Iniciou → Completou → Abandonou → Recuperou (Funil + Taxas)
- Abandono: Recuperação por Hora (0-24h) + Por Canal (Email vs WhatsApp)
- Ticket Médio: Por Plano (Mensal/Anual) + Por Origem (Orgânico/Pago/Email)
- Upsells: Order Bump Take Rate + TY Page Upsell + Cross-sell (Kit/Turma/Mentoria)
- Sales Team: SQLs Atendidos | Calls Agendadas | Propostas Enviadas | Fechadas | Ticket Médio Assistido

### Aba 4: **Retenção & Produto (Engajamento)**
- Cohort Retention: Mês 1, 2, 3, 6, 12 (Heatmap % ativos)
- Engajamento: MAU/DAU, Tempo Válido, Streak, Simulados, Flashcards, Aulas (Linha temporal)
- Health Score: Distribuição (0-20, 21-40, 41-60, 61-80, 81-100) + % Risco
- Churn: Por Cohort + Por Motivo (Preço, Tempo, Produto, Suporte, Resultado)
- NPS: Score + Detratores/Passivos/Promotores + Temas Comentários

### Aba 5: **Financeiro (Unit Economics)**
- MRR: Novo | Expansão | Reativação | Contraction | Churn (Waterfall)
- LTV por Cohort (3/6/12m) + Payback CAC por Cohort
- CAC Payback: Mês 1, 2, 3, 4, 5, 6 (Linha acumulada)
- Margem Líquida: Receita - CAC - Custo Produto - Custo Suporte - Overhead
- Fluxo Caixa: Entradas (Stripe/MP) - Saídas (Ads, Team, Tools, Infra) = Líquido

---

## 6. Alertas Automatizados (Slack / Email / PagerDuty)

| Alerta | Condição | Canal | Severidade | Ação Imediata |
|--------|----------|-------|------------|---------------|
| **Gasto Runaway** | Gasto diário > 130% orçamento | Slack #alerts + SMS Tráfego | 🔴 Crítico | Pausar campanhas / Ver bug |
| **CAC Spike** | CAC 7d > 1.5x meta (3d consec) | Slack #marketing + Email Head | 🟠 Alto | Pausar piores conjuntos / Revisar criativos |
| **ROAS Drop** | ROAS 7d < 2.5x (2d consec) | Slack #marketing | 🟠 Alto | Verificar pixel / Oferta / Checkout |
| **Checkout Error Rate** | Erro 5xx / Falha pagamento > 5% | Slack #dev + #marketing | 🔴 Crítico | Rollback deploy / Contatar Stripe/MP |
| **Churn Spike** | Churn diário > 2x média (2d) | Slack #cs + #sales | 🟠 Alto | Revisar tickets / Health scores / Pagamentos |
| **Pixel/CAPI Failure** | Eventos Purchase 0 por 30min | Slack #dev | 🔴 Crítico | Verificar CAPI / Pixel / Eventos teste |
| **Creative Fatigue** | Frequência > 4 (TOFU) / > 7 (BOFU) + CTR < 0.5% | Slack #creative | 🟡 Médio | Produzir novos criativos / Pausar |
| **Budget Underspend** | Gasto < 70% orçamento (2d) | Slack #marketing | 🟡 Médio | Aumentar bid / Expandir audiências |
| **NPS Drop** | NPS 7d < 30 | Slack #cs + #fundador | 🟠 Alto | Ler comentários detratores / Call sample |
| **Health Score Mass Drop** | > 20% base score < 40 (semanal) | Slack #cs + #produto | 🟠 Alto | Verificar feature break / Bug / Comunicação |

---

## 7. Frequência de Revisão & Rituais

| Ritual | Frequência | Participantes | Duração | Pauta |
|--------|------------|---------------|---------|-------|
| **Daily Standup (Tráfego)** | Diário 9h | Tráfego + Creative + Dev | 15min | Gasto ontem | CAC | ROAS | Alertas | Ações hoje |
| **Weekly Marketing Review** | Segunda 9h | Marketing Head + Tráfego + Creative + Email + SDR + Fundador | 60min | KPIs Aquisição | Top/Flop Criativos | Testes A/B | Campanhas Ativas | Próxima Semana |
| **Weekly Sales Review** | Segunda 10h30 | Sales Head + SDRs + Closer + CS + Fundador | 45min | Pipeline | SQLs | Calls | Propostas | Fechamentos | Upsells | Churn Risks |
| **Weekly Product/CS Review** | Terça 9h | Produto + CS + Fundador | 45min | Health Score | Churn Risks | NPS | Features Adoção | Bugs Críticos | Roadmap |
| **Monthly Business Review** | 1º dia útil mês | Todos Heads + Fundador + Financeiro | 90min | MRR | CAC | LTV | NRR | Payback | Cohorts | Budget Próximo Mês | Decisões Estratégicas |
| **Quarterly Strategy** | Fim trimestre | Fundador + Heads + Advisors | 3h | OKRs Próximo Trimestre | Budget Alocação | Novas Campanhas | Contratações | Tech Debt |

---

## 8. Atribuição & UTM Governance

### UTM Padrão (Obrigatório Todo Link)
```
utm_source=meta|google|email|organic|referral|affiliate|whatsapp|sms|push
utm_medium=paid_social|paid_search|email|organic_social|referral|affiliate|whatsapp|sms|push
utm_campaign=[NOME_CAMPANHA_PADRONIZADO]  // Ex: OA_TOFU_TRAFEGO_FRIO_INTEREST_CARROSSEL_A
utm_content=[CONJUNTO]|[ANUNCIO]  // Ex: SEGURANCA_PUBLICA|ranking-real-pm-sp-v1
utm_term=[PLACEMENT]|[AGE]|[GENDER]  // Ex: feed|25-34|all
```

### Regras
- **NUNCA** links sem UTM (exceto navegação interna app)
- **SEMPRE** `utm_campaign` no nível Campanha Meta (não só anúncio)
- **SEMPRE** `utm_content` com Conjunto + Criativo (para atribuição peça)
- CRM: Mapear `utm_source/medium/campaign/content/term` → Fields `utm_*` no Lead/Deal
- Atribuição: **Data-Driven (GA4) + Last Non-Direct (CRM) + 30d Janela**
- Validação: Audit mensal 100 leads aleatórios — UTM presente + Correto > 95%

---

## 9. Definições Padronizadas (Glossário)

| Termo | Definição Precisa |
|-------|-------------------|
| **Lead** | `CompleteRegistration` (Lead Magnet) OU `Lead` (Meta) — Email/Telefone capturado |
| **MQL** | Lead com Score ≥ 50 (abriu 3+ emails, clicou VSL/Checkout, visitou pricing, tempo site > 3min) |
| **SQL** | MQL com Score ≥ 70 + WhatsApp outreach iniciado OU Agendou Call |
| **Assinatura Ativa** | Status `active` ou `trialing` no Stripe/MP + Pagamento confirmado |
| **Churn** | Cancelamento efetivo (fim período) OU Pagamento falhou 3x + 7d grace period |
| **Expansão** | Upgrade Anual + Cross-sell (Kit/Turma/Mentoria) + Reativação Pós-Churn |
| **CAC Blended** | (Gasto Marketing Total) / (Novas Assinaturas Atribuídas 30d) |
| **LTV** | Soma receita líquida (pós-reembolso) por cliente nos primeiros 365 dias |
| **NRR** | (MRR Início + Expansão - Churn - Contraction) / MRR Início |
| **Payback** | Mês em que Receita Acumulada Cliente ≥ CAC Atribuído |

---

## 10. Ferramentas & Stack de Dados

| Camada | Ferramenta | Propósito |
|--------|------------|-----------|
| **Ads** | Meta Ads Manager, Google Ads | Gestão campanhas |
| **Analytics** | GA4 (Data-Driven) + Meta Pixel + CAPI | Atribuição Web |
| **CRM** | ActiveCampaign / HubSpot | Leads, Scores, Automações, Deals, Email |
| **Billing** | Stripe + Mercado Pago | Pagamentos, Assinaturas, Webhooks |
| **App Analytics** | PostHog / Mixpanel / Amplitude | Eventos Produto, Cohorts, Funis App |
| **Data Warehouse** | BigQuery / ClickHouse | Centralização, SQL, Modelagem |
| **BI** | Looker Studio / Metabase / Apache Superset | Dashboards, Alertas, Relatórios |
| **Email** | ActiveCampaign / SendGrid | Transacional + Marketing |
| **WhatsApp** | WhatsApp Business API (Oficial) + Zenvia/Twilio | Broadcast + SDR + Suporte |
| **Helpdesk** | Zendesk / Intercom / Crisp | Tickets, Chat, Base Conhecimento |
| **Survey** | Typeform / SurveyMonkey / NPS.io | NPS, Feedback, Quiz Diagnóstico |
| **Agendamento** | Calendly / HubSpot Meetings | SDR Calls, Mentoria, Diagnóstico |
| **Afiliados** | FirstPromoter / Rewardful / Custom | Tracking, Comissão, Pagamento |
| **Automação** | n8n / Make / Zapier | Integrações, Webhooks, Syncs |

---

*Documento vivo. Atualizar métricas/metas a cada Monthly Business Review. Versão: 1.0 | Setembro 2026.*