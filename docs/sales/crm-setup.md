# CRM Setup — Operação Aprovação

> Configuração do CRM (ActiveCampaign / HubSpot) para operar o processo comercial end-to-end.
> Integração nativa: Site (forms, tracking), App (eventos), Stripe/MP (billing), WhatsApp (Zenvia/Twilio).

---

## 1. Arquitetura de Dados (Custom Fields)

### 1.1 Contact Fields (Lead/Aluno)
| Field Name | Tipo | Fonte | Descrição |
|------------|------|-------|-----------|
| `lead_score` | Number | CRM (automático) | Score dinâmico 0-100 |
| `lead_stage` | Dropdown | CRM (Pipeline) | New Lead / Engaged / MQL / SQL / Opp / Won / Lost |
| `utm_source` | Text | Form / Cookie | Meta, Google, Email, Organic, Referral, Affiliate |
| `utm_medium` | Text | Form / Cookie | paid_social, email, organic, referral |
| `utm_campaign` | Text | Form / Cookie | Nome padronizado campanha |
| `utm_content` | Text | Form / Cookie | Conjunto|Anúncio (ex: SEGURANCA_PUBLICA\|ranking-v1) |
| `utm_term` | Text | Form / Cookie | Placement|Idade|Genero |
| `concurso_alvo` | Text | Quiz / Form / App | Ex: PM-SP, GCM-RJ, Policial Penal-MG |
| `tempo_disponivel_dia` | Number | Quiz / Onboarding | Minutos/dia declarados |
| `data_prova_alvo` | Date | Quiz / Form | Data estimada edital/prova |
| `assinatura_status` | Dropdown | Stripe/MP Webhook | Active / Trialing / Past_Due / Canceled / Incomplete |
| `plano_atual` | Dropdown | Stripe/MP | Free / Monthly / Annual / VIP / Mentoria |
| `data_inicio_assinatura` | Date | Stripe/MP | Início período pago |
| `data_proxima_cobranca` | Date | Stripe/MP | Próximo renewal |
| `health_score` | Number | App (diário) | 0-100 (Atividade + Streak + Progresso + NPS + Pagamento) |
| `streak_atual` | Number | App (diário) | Dias consecutivos ativos |
| `simulados_feitos_30d` | Number | App (diário) | Contagem últimos 30d |
| `nps_score` | Number | Survey | 0-10 (último respondido) |
| `ultima_atividade_app` | DateTime | App (evento) | Last seen com heartbeat válido |
| `whatsapp_optin` | Boolean | Form / App | True se autorizou WA marketing |
| `whatsapp_number` | Text | Form / App | Número validado (E.164) |
| `origem_lead` | Dropdown | CRM (auto) | LM_Quiz / LM_Cronograma / LM_Simulado / VSL / Checkout_Abandonado / Organico / Indicacao / Afiliado |
| `lead_temperature` | Dropdown | CRM (auto) | Cold / Warm / Hot / Customer |
| `assigned_sdr` | User | CRM (auto) | SDR responsável (round-robin) |
| `assigned_closer` | User | CRM (manual) | Closer para High Touch |
| `data_ultimo_contato` | DateTime | CRM (auto) | Último touch (WA/Email/Call) |
| `contagem_tentativas_contato` | Number | CRM (auto) | Tentativas sequenciais sem resposta |

### 1.2 Deal Fields (Oportunidade)
| Field Name | Tipo | Descrição |
|------------|------|-----------|
| `deal_value` | Currency | Valor estimado (Anual R$ 1.997 / VIP R$ 1.997 / Mentoria R$ 1.200/m) |
| `deal_stage` | Dropdown | Qualified / Proposal / Negotiation / Won / Lost |
| `produto_interesse` | Dropdown | Anual / VIP / Mentoria / B2B |
| `bant_score` | Number | 0-40 (soma B+A+N+T) |
| `objeção_principal` | Dropdown | Preco / Tempo / Confianca / Ja_Comprei / Decisor / Outro |
| `data_proposta_enviada` | DateTime | Quando link/PDF enviado |
| `contagem_followup` | Number | Follow-ups enviados pós-proposta |

---

## 2. Pipelines

### 2.1 Pipeline Principal (Inside Sales)
```
New Lead (1) → Engaged (2) → MQL (3) → SQL (4) → Qualified Opp (5) → Proposal Sent (6) → Closed Won (7) / Closed Lost (8)
```

**Automações por Stage**:
| Stage | Automação |
|-------|-----------|
| New Lead | Tag `new_lead` → Atribui SDR (round-robin) → Inicia Sequence "Welcome + Diagnóstico" |
| Engaged | Score ≥ 20 → Move MQL se Score ≥ 50 |
| MQL | Notifica SDR (Slack #sales-mql) → Inicia Sequence "Nurture + VSL" |
| SQL | SDR Outreach WA (Template A) → Agenda Call se Score ≥ 70 |
| Qualified Opp | Closer assume → Envia Proposta/Link → Inicia Follow-up Sequence |
| Proposal Sent | Follow-up D1/D3/D7/D14 (WA+Email) → Alert Closer se 14d sem resposta |
| Closed Won | Webhook Stripe → Tag `customer` → Inicia Onboarding Sequence → Atribui CS |
| Closed Lost | Tag `lost_[motivo]` → Move para Win-back List (30d) |

### 2.2 Pipeline High Touch (Mentoria/VIP)
```
Qualified (Mentoria) → Diagnóstico Call → Proposta Enviada → Negociação → Fechado Ganho / Perdido
```
- SLA: Diagnóstico em 48h pós-SQL → Proposta 24h pós-call → Follow-up D1/D3/D7

---

## 3. Lead Scoring (Automação CRM)

### 3.1 Regras de Pontuação (Atualização Tempo Real via Webhook/App)
| Evento | Pontos | Decaimento |
|--------|--------|------------|
| Form Submit (LM) | +10 | -1/dia após 7d |
| Email Open | +3 | -1/dia (máx +15/dia) |
| Email Click (VSL/Checkout/Pricing) | +8 | -2/dia |
| Page View: /checkout | +25 | -5/dia |
| InitiateCheckout | +50 | -10/dia |
| Video Play 50%+ | +15 | -3/dia |
| Video Play 75%+ | +25 | -3/dia |
| Video Play 95%+ | +35 | -3/dia |
| Quiz Complete | +20 | -2/dia |
| Email Reply | +30 | Sem decaimento |
| WhatsApp Inbound | +40 | Sem decaimento |
| Meeting Scheduled | +50 | Sem decaimento |
| Meeting Attended | +60 | Sem decaimento |
| NPS ≥ 9 | +20 | Sem decaimento |
| Purchase | RESET → Customer | — |

### 3.2 Thresholds & Ações Automáticas
| Score | Label | Ação CRM |
|-------|-------|----------|
| < 20 | Cold | Nenhuma (nurture passivo) |
| 20-49 | Engaged | Move Stage → Engaged |
| 50-69 | MQL | Move Stage → MQL + Notifica SDR |
| 70-89 | SQL | Move Stage → SQL + Cria Task SDR "Outreach WA 2h" |
| ≥ 90 | Hot | Alerta Closer "Hot Lead - Priority" |

### 3.3 Decaimento Diário (Job 02:00)
- Subtrai pontos por inatividade conforme tabela acima
- Mínimo 0
- Se score cai abaixo threshold → Move stage para trás (ex: SQL→MQL se < 70 por 48h)

---

## 4. Automações de Email (Sequences)

### 4.1 Sequences Ativas
| Sequence | Trigger | Emails | Objetivo |
|----------|---------|--------|----------|
| **Welcome + Diagnóstico** | New Lead (LM) | 5 emails (D0, D1, D3, D5, D7) | Entregar LM + Gerar agendamento call |
| **Nurture + VSL** | MQL (Score ≥ 50) | 7 emails (D0, D1, D2, D4, D6, D9, D14) | Assistir VSL + Visitar Checkout |
| **Reengajamento 30d** | Inativo 30d (Customer) | 4 emails (D0, D3, D7, D14) | Reativar uso app |
| **Reengajamento 90d** | Inativo 90d (Customer) | 3 emails (D0, D7, D14) | Win-back oferta |
| **Onboarding** | Purchase (Won) | 6 emails (D0, D1, D3, D7, D14, D30) | Ativar app + Gerar plano + Streak 7d |
| **Upgrade Anual** | Mensal 30d + Streak 14+ | 4 emails (D0, D3, D7, D14) | Converter Mensal→Anual |
| **Abandono Checkout** | InitiateCheckout sem Purchase | 5 emails (15min, 30min, 2h, 24h, 72h) | Recuperar carrinho |
| **Pagamento Falhou** | Invoice Failed | 3 emails (Imediato, 24h, 72h) | Atualizar pagamento |
| **Cancelamento** | Subscription Canceled | 2 emails (D1 Fundador, D30 Win-back) | Diagnosticar + Reativar |

### 4.2 Templates-Chave (Variáveis Dinâmicas)
```handlebars
// Variáveis disponíveis
{{contact.first_name}} {{contact.concurso_alvo}} {{contact.tempo_disponivel_dia}}
{{contact.streak_atual}} {{contact.health_score}} {{contact.plano_atual}}
{{deal.proposta_link}} {{deal.produto_interesse}} {{contact.assigned_sdr_name}}
```

---

## 5. WhatsApp Integration (Zenvia / Twilio)

### 5.1 Templates Aprovados (Meta Business)
| Template Name | Category | Variáveis | Uso |
|---------------|----------|-----------|-----|
| `sdr_outreach_hot` | Marketing | {{1}}=Nome, {{2}}=Contexto | Outreach SQL |
| `recovery_abandoned_15min` | Utility | {{1}}=Nome | Abandono 15min |
| `recovery_abandoned_email` | Utility | {{1}}=Nome, {{2}}=Link | Abandono Email |
| `proposal_sent_wa` | Utility | {{1}}=Nome, {{2}}=Link | Proposta Enviada |
| `followup_proposal_d1` | Utility | {{1}}=Nome | Follow-up D1 |
| `followup_proposal_d3` | Utility | {{1}}=Nome | Follow-up D3 |
| `followup_proposal_d7` | Utility | {{1}}=Nome | Follow-up D7 |
| `followup_proposal_d14` | Utility | {{1}}=Nome | Follow-up D14 (Final) |
| `payment_failed_immediate` | Utility | {{1}}=Nome, {{2}}=Link | Pagamento Falhou |
| `winback_founder_wa` | Marketing | {{1}}=Nome | Cancelamento Fundador |
| `retention_risk_wa` | Utility | {{1}}=Nome | Churn Risk |
| `inactivity_nudge` | Utility | {{1}}=Nome | Inativo 7d |
| `upgrade_anual_offer` | Marketing | {{1}}=Nome, {{2}}=Link | Upgrade Anual |
| `turma_vip_invite` | Marketing | {{1}}=Nome, {{2}}=Link | Convite Turma VIP |
| `mentoria_invite` | Marketing | {{1}}=Nome | Convite Mentoria |

### 5.2 Regras de Envio
- **Opt-in obrigatório**: Só envia se `whatsapp_optin = true`
- **Horário comercial**: 9h-18h (fuso usuário) — fora horário agenda para 9h próximo dia útil
- **Rate Limit**: Máx 1 msg/hora por contato (exceto transacionais: abandono, pagamento falhou)
- **Opt-out**: "SAIR" → Atualiza `whatsapp_optin = false` + Tag `wa_optout`

---

## 6. Integrações Técnicas

### 6.1 Site → CRM (Forms + Tracking)
- **Forms**: ActiveCampaign Forms / HubSpot Forms embedados (LM, Quiz, Newsletter)
- **Tracking**: `ac_tracking.js` / `hs-analytics.js` + `identify()` no login/app
- **UTM Capture**: Cookie `utm_params` (30d) → Preenche hidden fields nos forms

### 6.2 App → CRM (Eventos Server-Side)
```typescript
// src/server/services/crm/sync.ts
interface CrmEvent {
  event: 'lead_score_update' | 'stage_change' | 'purchase' | 'churn_risk' | 'health_score_update';
  contact_id: string; // CRM contact ID
  payload: Record<string, any>;
}
await crmClient.sync(event);
```
- **Eventos**: `lead_score_update` (tempo real), `health_score_update` (diário batch), `purchase` (webhook), `churn_risk` (score < 40)

### 6.3 Stripe/MP → CRM (Billing Webhooks)
| Evento Webhook | Ação CRM |
|----------------|----------|
| `checkout.session.completed` | Cria/Atualiza Contact → `assinatura_status=Active` + `plano_atual` + `data_inicio` + Tag `customer` |
| `invoice.payment_succeeded` | Atualiza `data_proxima_cobranca` + `assinatura_status=Active` |
| `invoice.payment_failed` | `assinatura_status=Past_Due` + Task SDR "Pagamento Falhou" + Sequence "Pagamento Falhou" |
| `customer.subscription.deleted` | `assinatura_status=Canceled` + Tag `churned` + Sequence "Cancelamento" + Win-back List |
| `customer.subscription.updated` | Atualiza `plano_atual` (upgrade/downgrade) |

### 6.4 WhatsApp → CRM (Inbound)
- Webhook Zenvia/Twilio → Cria/Atualiza Contact → `whatsapp_number` + `whatsapp_optin=true`
- Se mensagem contém "SAIR" → `whatsapp_optin=false` + Tag `wa_optout`
- Se mensagem contém palavras-chave (preço, duvida, cancelar) → Cria Task SDR "Inbound WA - Responder 15min"

---

## 7. Relatórios & Dashboards (CRM)

| Relatório | Frequência | Métricas | Filtros |
|-----------|------------|----------|---------|
| **Pipeline Value** | Diário | Value por Stage, Weighted Pipeline, Win Rate | Por SDR/Closer |
| **MQL → SQL Conversion** | Semanal | MQLs gerados, SQLs convertidos, Tempo MQL→SQL | Por Origem/UTM |
| **SLA Compliance** | Diário | % Follow-up no prazo, Tempo médio 1ª resposta | Por SDR |
| **Lead Aging** | Semanal | Leads > 7d sem toque, > 14d sem proposta | Por Stage |
| **Churn Risk** | Diário | Contacts `health_score < 40`, `streak = 0` 7d | Por CS Owner |
| **Win-back Funnel** | Semanal | Enviados, Abertos, Respondidos, Reativados | Por Cohort |

---

## 8. Limpeza & Higiene (Data Quality)

| Regra | Frequência | Ação |
|-------|------------|------|
| **Deduplicação** | Diária | Merge contacts por email/CPF/WhatsApp (manter mais recente + maior score) |
| **Leads Órfãos** | Semanal | Contacts sem Owner → Reatribui round-robin |
| **Stale Leads** | Semanal | Stage `Engaged` > 14d sem toque → Move `Cold` + Tag `stale` |
| **Bounces/Unsubscribes** | Diário | Hard bounce → `email_invalid=true` | Unsub → `email_optout=true` |
| **WA Opt-outs** | Tempo Real | "SAIR" → `whatsapp_optin=false` + Tag |
| **Enriquecimento** | Mensal | Clearbit/Apollo enriquece `company_size`, `role` para B2B leads |

---

## 9. Permissões & Segurança (RBAC CRM)

| Role | Permissões |
|------|------------|
| **SDR** | View/Edit Own Leads, Create Tasks, Send Sequences, View Own Pipeline |
| **Closer** | View/Edit Assigned Deals, Create Proposals, View All Pipeline, Export Reports |
| **Sales Head** | Full Pipeline, All Reports, User Management, Automation Edit |
| **Marketing** | View Leads (Read Only), Create/Edit Sequences, View Attribution Reports |
| **CS/Success** | View Customers, Edit Health Score, Create Tasks, View Churn Risk |
| **Admin** | Full Access, Integrations, Webhooks, Fields, Pipelines |

---

## 10. Checklist Implementação (Go-Live)

- [ ] Custom Fields criados em todos Contacts/Deals
- [ ] Pipelines configurados com Stages + Automações
- [ ] Lead Scoring rules ativas + Decaimento job agendado
- [ ] 10 Sequences de Email criadas + Testadas (Seed list)
- [ ] 15 WhatsApp Templates aprovados Meta + Zenvia configurado
- [ ] Webhooks: Site Forms, App Events, Stripe/MP, WhatsApp Inbound
- [ ] UTM Capture + Cookie Consent (LGPD)
- [ ] Round-robin SDR ativo + Atribuição automática
- [ ] Dashboards criados + Compartilhados com Heads
- [ ] RBAC configurado + Usuários convidados
- [ ] Testes End-to-End: Form → Lead → Score → Stage → SDR Task → WA → Call → Proposta → Won → Onboarding
- [ ] Backup/Export automático semanal (LGPD compliance)

---

*Próximo: `onboarding-flow.md` → `retention-expansion.md` → `kpi-targets.md` → `compensation-plan.md`.*