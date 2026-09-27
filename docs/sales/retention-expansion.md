# Retention & Expansion — Operação Aprovação

> Estratégia de retenção (redução churn) + expansão (upsell/cross-sell) baseada em **Health Score** + **Cohort Analysis** + **Jobs-to-be-Done**.
> Norte: **NRR > 120%** — expansão da base existente > nova aquisição.

---

## 1. Health Score Model (0-100, Atualizado Diário 03h)

| Componente | Peso | Cálculo | Fonte |
|------------|------|---------|-------|
| **Atividade Recente** | 30% | `min(1, dias_ativos_7d / 7) * 30` | App (heartbeat válido) |
| **Streak Atual** | 20% | `min(1, streak / 30) * 20` | App (streak dias) |
| **Progresso Curso** | 15% | `% curso_concluido * 15` | App (módulos/aulas) |
| **Desempenho Simulados** | 15% | `min(1, media_notas_30d / 70) * 15` | App (simulados finalizados) |
| **NPS / Satisfação** | 10% | `(nps_score / 10) * 10` | Survey (último 90d) |
| **Pagamento em Dia** | 10% | `1 se em_dia else 0` * 10 | Stripe/MP (status) |

**Classificação**:
- **80-100**: 🟢 **Champion** — Advocate, candidato Mentoria/VIP
- **60-79**: 🟡 **Healthy** — Engajado, risco baixo
- **40-59**: 🟠 **At Risk** — SDR outreach + Reengajamento
- **20-39**: 🔴 **Critical** — CS/Founder call imediato
- **0-19**: ⚫ **Churn Imminent** — Win-back sequence automática

---

## 2. Retenção — Playbooks por Health Score

### 2.1 🟢 Champion (80-100) — Expansão
| Ação | Trigger | Canal | Responsável |
|------|---------|-------|-------------|
| Convite Mentoria 1:1 | Score ≥ 85 + Streak 60+ + NPS 9+ | Email Fundador + WA SDR | SDR → Closer |
| Convite Turma VIP | Score ≥ 80 + Streak 30+ | Email + WA | SDR |
| Programa Indicação | NPS ≥ 9 | In-app + Email | Marketing |
| Case Study / Depoimento | NPS 10 | Email Fundador | Founder/Marketing |

### 2.2 🟡 Healthy (60-79) — Consolidação
| Ação | Trigger | Canal | Responsável |
|------|---------|-------|-------------|
| Upgrade Anual (se Mensal) | 30d assinatura + Streak 14+ | In-app + Email + WA | Auto + SDR |
| Turma VIP | Streak 30+ + Simulados 5+ | Email + WA | SDR |
| Flashcard Challenge | Inativo Flashcards 7d | Push + Email | Auto |
| Simulado Semanal | 0 simulados 14d | Email + WA | Auto |

### 2.3 🟠 At Risk (40-59) — Reengajamento
| Ação | Trigger | Canal | Responsável |
|------|---------|-------|-------------|
| Plano Recuperação 7d | Score cai 40-59 | WA SDR (Template D) | SDR |
| Call 15min "Como vai?" | Score 45-55 por 7d | WA → Agenda Call | SDR |
| Ajuste Plano IA | Tempo disponível mudou | In-app + Email | Auto |
| Suporte Proativo | Ticket aberto / NPS < 7 | WA CS | CS |

### 2.4 🔴 Critical (20-39) — Intervenção Direta
| Ação | Trigger | Canal | Responsável |
|------|---------|-------|-------------|
| Call Fundador/CS | Score < 40 por 3d | WA Fundador/CS | Founder/CS |
| Pausa Cobrança (Grace) | Score < 30 + Pagamento falhou | Stripe/MP Pause + WA | Billing + CS |
| Plano Mínimo 15min | Tempo real < 15min/dia | In-app + WA | Auto + SDR |
| Oferta Downgrade/ Pausa | Insistência cancelamento | WA Fundador | Founder |

### 2.5 ⚫ Churn Imminent (0-19) — Última Tentativa
| Ação | Trigger | Canal | Responsável |
|------|---------|-------|-------------|
| Email Fundador "Última chance" | Score < 20 por 7d | Email Fundador | Founder |
| Oferta 50% + Mentoria | Score < 15 | Email + WA | Founder/SDR |
| Pausa Assinatura (Retenção) | Pedido cancelamento | Stripe Pause + WA | Billing |
| Exit Survey Obrigatório | Cancelamento confirmado | In-app modal | Auto |

---

## 3. Churn Prevention — Automações Baseadas em Eventos

| Evento | Ação Imediata | SLA | Canal |
|--------|---------------|-----|-------|
| **Streak Quebrado (0 após ≥ 7)** | WA "Sua streak quebrou. Bora recomeçar? 15min agora." | 1h | WA |
| **Inativo 7d (App)** | Push + Email "Seu plano tá te esperando" | Imediato | Push/Email |
| **Inativo 14d** | WA SDR "Plano recuperação 7d grátis" | 4h | WA SDR |
| **Pagamento Falhou** | WA + Email imediato "Tenta PIX?" | Imediato | WA/Email |
| **2º Pagamento Falhou** | Call SDR "Resolvemos agora" | 2h | Call |
| **NPS ≤ 6 (Detrator)** | Email Fundador "Me conta" | 24h | Email Fundador |
| **Cancelamento Solicitado** | WA Fundador 30min | 30min | WA Fundador |
| **Cancelamento Efetivado** | Win-back Sequence (D1, D7, D30) | Auto | Email/WA |

---

## 4. Expansão — Upsell/Cross-sell Sistemático

### 4.1 Matriz de Expansão por Cohort

| Cohort | Mês 1 | Mês 2 | Mês 3 | Mês 6 | Mês 12 |
|--------|-------|-------|-------|-------|--------|
| **Mensal → Anual** | 15% | 30% | 40% | 50% | 60% |
| **Anual → Turma VIP** | 5% | 12% | 18% | 25% | 30% |
| **Turma VIP → Mentoria** | 2% | 5% | 8% | 12% | 15% |
| **Kit Físico (Anual)** | 10% | 15% | 20% | 25% | 30% |
| **Indicação (Referral)** | 5% | 10% | 15% | 20% | 25% |

### 4.2 Triggers de Expansão (Automatizados)

| Expansão | Trigger | Canal | Oferta |
|----------|---------|-------|--------|
| **Mensal → Anual** | 30d ativo + Streak ≥ 14 | In-app + Email + WA | Anual R$ 1.997 + Mentoria grátis |
| **Anual → Turma VIP** | Streak 30+ + Simulados ≥ 5 + Nota ≥ 60% | Email Fundador + WA SDR | VIP R$ 1.997 (20% off) |
| **Turma VIP → Mentoria** | 60d VIP + Streak 60+ + Nota ≥ 70% + NPS ≥ 9 | Call SDR → Proposta | Mentoria R$ 997/mês |
| **Kit Físico** | Anual ativo 90d + Não tem kit | Email + WA | Kit R$ 97 (custo) / Grátis BF |
| **Referral** | NPS ≥ 9 | In-app + Email | 10% off amigo + 1 mês grátis você |

---

## 5. Cohort Analysis (Retenção por Cohort Mensal)

### 5.1 Métricas por Cohort (Mensal)
| Métrica | Definição | Meta |
|---------|-----------|------|
| **Month 1 Retention** | % Ativos Mês 1 / Início Mês | > 85% |
| **Month 3 Retention** | % Ativos Mês 3 / Início Mês | > 70% |
| **Month 6 Retention** | % Ativos Mês 6 / Início Mês | > 55% |
| **Month 12 Retention** | % Ativos Mês 12 / Início Mês | > 40% |
| **LTV 12m (Cohort)** | Receita acumulada 12m / Usuários Cohort | > R$ 1.000 |
| **Expansion Revenue (Cohort)** | Upgrades + Cross-sell / Receita Inicial | > 30% |

### 5.2 Análise de Churn por Motivo (Exit Survey + Fundador)
| Motivo | % Total Churn | Ação Corretiva |
|--------|---------------|----------------|
| **Preço** | 35% | Parcelamento 12x comunicado + Win-back 50% |
| **Tempo** | 25% | Plano 15min + Modo Foco + Offline |
| **Falta de Resultado** | 20% | Plano recuperação + Mentoria grátis trial |
| **Produto/UX** | 10% | Roadmap prioritário + Beta access |
| **Suporte** | 5% | SLA 2h + Fundador lê tickets |
| **Outro/Mudança Vida** | 5% | Pausa 90d + Porta aberta |

---

## 6. Net Revenue Retention (NRR) — Cálculo & Metas

### 6.1 Fórmula
```
NRR = (MRR Início + Expansão - Churn - Contraction) / MRR Início
```

### 6.2 Componentes Mensais (Metas)
| Componente | Meta Mensal | Cálculo |
|------------|-------------|---------|
| **Starting MRR** | — | MRR 1º dia mês |
| **New MRR** | R$ 150k | Novas assinaturas (Anual/Mensal) |
| **Expansion MRR** | R$ 45k | Upgrades (Mensal→Anual, VIP, Mentoria) |
| **Reactivation MRR** | R$ 10k | Win-backs |
| **Contraction MRR** | < R$ 8k | Downgrades (Anual→Mensal, Pausas) |
| **Churn MRR** | < R$ 12k | Cancelamentos efetivos |
| **Net New MRR** | > R$ 185k | Soma acima |
| **Ending MRR** | Starting + Net New | — |
| **NRR** | **> 120%** | (Starting + Expansion - Churn - Contraction) / Starting |

---

## 6.3 LTV & Payback por Canal

| Canal | CAC | LTV 12m | LTV/CAC | Payback (meses) | Meta LTV 12m |
|-------|-----|---------|---------|-----------------|--------------|
| **Meta Ads (Paid)** | R$ 180 | R$ 800 | 4.4x | 1.8 | > R$ 1.000 |
| **Orgânico/SEO** | R$ 50 | R$ 1.200 | 24x | 0.5 | > R$ 1.500 |
| **Email/Referral** | R$ 30 | R$ 1.000 | 33x | 0.3 | > R$ 1.200 |
| **Afiliados** | R$ 80 | R$ 900 | 11x | 0.8 | > R$ 1.000 |
| **Blended** | **< R$ 180** | **R$ 1.000** | **> 5.5x** | **< 2m** | **> R$ 1.200** |

---

## 7. Programas Especiais de Retenção

### 7.1 "Streak Guard" — Proteção de Streak
- **Mecânica**: Se usuário ativo (Health > 60) perde streak por falha técnica/bug → Streak restaurado + 500 XP bônus
- **Comunicação**: "Detectamos um problema. Sua streak de [X] dias foi restaurada! +500 XP de bônus."
- **Frequência**: Máx 1x/trimestre por usuário

### 7.2 "Vacation Mode" — Pausa Planejada
- **Mecânica**: Usuário avisa "Vou viajar 10 dias" → Pausa streak expectations + Plano leve (5min/dia) + Sem notificações de cobrança
- **Ativação**: Botão "Modo Férias" no perfil (máx 30d/ano)
- **Retorno**: "Bem-vindo de volta! Seu plano tá pronto. Streak continua de onde parou."

### 7.3 "Study Buddy" — Accountability Social
- **Mecânica**: Match automático (mesmo concurso, tempo similar, horário compatível) → Grupo WhatsApp 2-3 pessoas + Check-in semanal
- **Trigger**: Opt-in "Quero parceiro" + Streak ≥ 7
- **Facilitação**: SDR modera 1ª semana → Depois autônomo

### 7.4 "Comeback Campaign" — Reativação Em Massa
- **Frequência**: Trimestral (Jan, Abr, Jul, Out)
- **Target**: Inativos 60-180d (Health < 30, não churned)
- **Oferta**: 50% off 1º mês + Mentoria 30min grátis + Progresso restaurado
- **Canais**: Email (Fundador) + WA (SDR) + Push + Retargeting Ads
- **Meta**: Reativar 15% target list

---

## 8. Métricas de Retenção & Expansão (Dashboard Semanal)

| Métrica | Meta | Alerta Se | Fonte |
|---------|------|-----------|-------|
| **Churn Mensal (Logo)** | < 5% | > 8% | Stripe/CRM |
| **Churn Mensal (Revenue)** | < 3% | > 5% | Stripe |
| **NRR** | > 120% | < 105% | Financeiro |
| **Month 1 Retention** | > 85% | < 80% | Cohort App |
| **Month 3 Retention** | > 70% | < 65% | Cohort App |
| **Month 12 Retention** | > 40% | < 35% | Cohort App |
| **LTV 12m (Blended)** | > R$ 1.000 | < R$ 800 | Financeiro |
| **Upgrade Mensal→Anual Rate** | > 40% (90d) | < 30% | CRM |
| **Turma VIP Take Rate** | > 15% elegíveis | < 10% | CRM |
| **Mentoria Take Rate** | > 3% elegíveis | < 1% | CRM |
| **Win-back Rate 30d** | > 20% | < 10% | CRM |
| **Referral % Novos Clientes** | > 15% | < 8% | CRM |
| **Health Score Médio** | > 70 | < 50 | App |
| **Churn Risk (Score < 40)** | < 10% base | > 20% | App |

---

## 9. Feedback Loop (Voz do Cliente → Produto)

| Canal | Frequência | Processamento | Ação |
|-------|------------|---------------|------|
| **NPS Survey** | 30d pós-compra + 90d recorrente | Análise temática detratores (semanal) | Roadmap prioridade |
| **Cancelamento Exit Survey** | 100% cancelamentos | Categorização automática + Fundador lê | Win-back + Roadmap |
| **Support Tickets** | Tempo real | Tagging automático + Weekly review CS | Bug fixes + UX improvements |
| **App Store Reviews** | Semanal | Sentiment analysis + Resposta pública | Reputation + Bug fixes |
| **Community/WA Groups** | Diário (SDR monitora) | Insights qualitativos + Feature requests | Product discovery |

---

*Próximo: `kpi-targets.md` → `compensation-plan.md`.*