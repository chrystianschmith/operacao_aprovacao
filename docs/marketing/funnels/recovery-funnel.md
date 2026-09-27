# Funil de Recuperação (Carrinho Abandonado + Inativos) — Operação Aprovação

> Recupera receita perdida em 3 frentes: Checkout Abandonado, Leads Frios, Assinantes Inativos (Churn Risk)

---

## 1. Visão Geral — 3 Pilares

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUNIL DE RECUPERAÇÃO (REVENUE RECOVERY)                  │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│   CHECKOUT          │   LEADS             │   ASSINANTES                    │
│   ABANDONADO        │   FRIOS/INATIVOS    │   CHURN RISK                    │
│   (BOFU - Horas)    │   (MOFU - Dias)     │   (RETENÇÃO - Semanas)          │
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│ • 30 min: Email+WA  │ • Dia 7: Reengage   │ • Dia 7 inativo: Push           │
│ • 2h: Email+Oferta  │ • Dia 14: Valor     │ • Dia 14: Email "Streak risco"  │
│ • 24h: Email+Suporte│ • Dia 30: Downsell  │ • Dia 30: Call/WA "Diagnóstico" │
│ • 3d: Email+Urgência│ • Dia 60: Última    │ • Dia 60: Win-back oferta       │
│ • 7d: Downsell      │   chance            │ • Dia 90: Cancelamento gracioso │
└─────────────────────┴─────────────────────┴─────────────────────────────────┘
```

---

## 2. Pilar 1 — Checkout Abandonado (Tempo Real)

### Gatilhos (Pixel/Server-Side)
| Evento | Definição | Prioridade |
|--------|-----------|------------|
| `InitiateCheckout` | Clicou "Finalizar compra", preencheu email, não pagou | 🔴 CRÍTICA (30 min) |
| `ViewContent` (URL `/checkout`) | Visitou página checkout, não iniciou | 🟡 ALTA (2h) |
| `AddPaymentInfo` | Selecionou PIX/Cartão, não confirmou | 🔴 CRÍTICA (15 min) |

### Sequência Multicanal

| Tempo | Canal | Template | Oferta/Incentivo | Automação |
|-------|-------|----------|------------------|-----------|
| **15 min** | WhatsApp (se opt-in) | "Oi [Nome], vi que começou o checkout mas não finalizou. Tudo bem? Posso ajudar em algo? O desconto PIX 10% expira em 2h." | PIX 10% off + Suporte humano | Trigger: `AddPaymentInfo` + `phone` exists |
| **30 min** | Email #1 | Assunto: "Seu acesso expira em 2h ⏰" | "Seu desconto PIX 10% (R$ 197 → R$ 177 no mensal / R$ 1.997 → R$ 1.797 no anual) expira às [HORA]. Garantia 30 dias. Cancel 1 clique." + Link direto checkout pré-preenchido | Trigger: `InitiateCheckout` |
| **2h** | Email #2 | Assunto: "Ainda em dúvida? Garantia 30 dias + Bônus" | "Muita gente travou aqui. A garantia 30 dias 'estude ou devolvemos' tira o risco. + Bônus 'Revisão de Véspera' se entrar hoje." + Depoimento curto | Delay: 2h após Email #1 |
| **24h** | Email #3 | Assunto: "Posso te ajudar? (Responda este email)" | "Vi que não completou. Qual a dúvida? Preço? Tempo? Confiança? Responde aqui que eu (fundador) te respondo pessoalmente." | Delay: 24h | Resposta → CRM tag `needs_sales_call` |
| **3d** | Email #4 | Assunto: "Último aviso: Seu desconto expira hoje" | Timer real (cookie + server) — "Seu desconto PIX 10% + Bônus Mentoria 30min expiram à meia-noite. Depois volta preço cheio." | Delay: 3d | Urgência real |
| **7d** | Email #5 | Assunto: "Teste 7 dias grátis sem cartão (sem compromisso)" | Downsell: "Não quer compromisso anual? Teste mensal R$ 197/mês. Cancele quando quiser. 7 dias grátis. Sem cartão." | Delay: 7d | Link: `/checkout?plan=monthly&trial=7` |
| **14d** | WhatsApp (se não converteu) | "Oi [Nome], tudo bem? O desconto expirou, mas a vaga no [CONCURSO ALVO] não. Ainda quer passar esse ano? Posso mandar um diagnóstico grátis dos seus gaps." | Diagnóstico grátis + Call 15min | Delay: 14d | Manual SDR |

### Regras Técnicas
- **Deduplicação**: Um usuário só entra na sequência 1x a cada 30 dias (evita spam se abandona múltiplas vezes)
- **Cancelamento Sequência**: Se `Purchase` event → Para TODOS os fluxos abandonados imediatamente
- **WhatsApp Opt-in**: Checkbox checkout "Receber atualizações no WhatsApp" (LGPD compliant)
- **Link Direto Checkout**: `/checkout?session_id={recovery_token}&prefill=email` — restaura carrinho

---

## 3. Pilar 2 — Leads Frios / Inativos (Nutrição Longa)

### Definição Lead Frio
| Critério | Tag CRM |
|----------|---------|
| Baixou lead magnet, não abriu 3+ emails | `lead_cold` |
| Score < 20 após 14 dias | `lead_cold` |
| Não clicou nenhum link VSL/Checkout | `lead_cold` |
| Inscrito > 30 dias, score < 30 | `lead_dormant` |

### Sequência Reengajamento (21 Dias)

| Dia | Canal | Assunto / Hook | Conteúdo Chave | CTA | Objetivo |
|-----|-------|----------------|----------------|-----|----------|
| 7 | Email | "Sua streak sente sua falta 😢" | "Faz 7 dias que seu tempo válido não sobe. Bora resolver? 15min modo foco = streak salva." | "Voltar pro app" | Reativar uso |
| 10 | WhatsApp (se opt-in) | "Oi [Nome], sumiu! Seu concurso [ALVO] não espera. Quer que eu te mande um plano 45min/dia adaptado pro seu horário?" | Plano personalizado grátis | "Quero plano" | Conversa humana |
| 14 | Email | "O que os aprovados fazem diferente (não é estudar mais)" | 3 bullets: Tempo real + Ranking + Simulados bancas. Case Ana (GCM 45min/dia). | "Ver método da Ana" | Educação + Prova |
| 21 | Email | "Última chance: Diagnóstico grátis dos seus gaps" | "Responda 10 perguntas → Recebo PDF com suas 3 matérias prioritárias + plano 30 dias. Grátis." | "Fazer diagnóstico" | Lead Magnet 2 (Qualificação) |
| 30 | Email | "Vou arquivar seu contato (mas a porta fica aberta)" | "Não quero encher sua caixa. Se quiser voltar, link aqui. Seu desconto fundador (R$ 1.997/anual) fica guardado pra você." | "Manter meu desconto" | Downsell suave / Arquivar |
| 60 | Email | "Ainda sonha com a farda? Edital [NOVO] saiu." | Edital relevante + "Quem começou hoje tem 60 dias vantagem." | "Ver edital + plano" | Reativação sazonal |

---

## 4. Pilar 3 — Assinantes Churn Risk (Retenção / Win-Back)

### Health Score (Calculado Diariamente)
| Fator | Peso | Fonte |
|-------|------|-------|
| Dias ativos últimos 30 | 30% | App (login + heartbeat) |
| Streak atual | 20% | App |
| % Curso concluído | 15% | App |
| NPS / Feedback | 10% | Survey |
| Tickets suporte (negativo) | 10% | Helpdesk |
| Pagamento em dia | 15% | Stripe/MP |

**Classificação**:
- **Saudável**: Score > 70
- **Atenção**: 40-70
- **Risco Alto**: 20-40
- **Crítico**: < 20

### Automações por Score

| Score | Trigger | Ação | Canal | Responsável |
|-------|---------|------|-------|-------------|
| **< 70 (queda > 15pts)** | Daily cron | "Sua streak tá em risco! 15min modo foco salva." | Push + Email | Automático |
| **< 50** | Daily cron | Email: "Vi que tá difícil manter constância. Quer ajuda? Responde que agendo call 15min grátis." | Email | CS/SDR |
| **< 40** | Daily cron | WhatsApp SDR: "Oi [Nome], seu acesso tá parado. Posso te mandar um plano de recuperação 7 dias? Sem custo." | WhatsApp | SDR |
| **< 30** | Weekly cron | Call agendada (Calendly link no email/WhatsApp) — "Diagnóstico 15min: gaps + plano ajustado." | Call (15min) | CS/Sales |
| **Pagamento falhou** | Stripe webhook | Email + WhatsApp imediato: "Pagamento não aprovado. Atualiza aqui: [Link]. Sem interrupção se resolver em 3 dias." | Email + WA | Automático |
| **Cancelamento solicitado** | App/Stripe | Email fundador: "Sinto que vai embora. Posso saber o motivo? Se for preço, tenho opção. Se for tempo, tenho plano 15min. Se for produto, quero melhorar." | Email (fundador) | Founder/CS |
| **Pós-cancelamento (Dia 7)** | Cron | "A porta fica aberta. Seu progresso (streak, XP, ranking) fica salvo por 1 ano. Volta quando quiser." | Email | Automático |
| **Pós-cancelamento (Dia 30)** | Cron | Win-back: "Voltou? 50% off no 1º mês retorno + mentoria 30min grátis. Link: [Único]." | Email + WA | Automático |

---

## 5. Métricas de Recuperação (Dashboard Semanal)

| Pilar | Métrica | Meta | Ferramenta |
|-------|---------|------|------------|
| **Checkout Abandonado** | Taxa Recuperação (7d) | > 15% | CRM + Stripe |
| | Receita Recuperada/Mês | > R$ 15.000 | Financeiro |
| | CAC Recuperação | < R$ 50 | CRM |
| **Leads Frios** | Taxa Reativação (30d) | > 8% | CRM |
| | Leads → SQL (Reativados) | > 5% | CRM |
| **Churn Risk** | Churn Prevenido (Score < 40) | > 30% | App + CRM |
| | Churn Mensal Líquido | < 5% | Stripe |
| | NRR (Net Revenue Retention) | > 110% | Financeiro |

---

## 6. Templates Prontos (Copiar/Colar)

### Email Checkout Abandonado #1 (30 min)
```
Assunto: Seu acesso expira em 2h ⏰

[Nome],

Você estava a um clique de acessar o sistema completo que 12.847 concurseiros usam pra passar.

Seu desconto PIX 10% expira às [HORA_EXATA]:
• Mensal: R$ 197 → R$ 177
• Anual: R$ 1.997 → R$ 1.797 (R$ 5,50/dia)

O que você leva:
✅ Cursos curados (PM, GCM, Penal, Bombeiro)
✅ Simulados CESPE/FGV/VUNESP corrigidos na hora
✅ Flashcards com repetição espaçada (SM-2)
✅ Plano de estudos gerado por IA em 30s
✅ Ranking real na sua cidade + Streak + XP
✅ Modo Foco nativo (Pomodoro 15/25/50/90min)

Garantia 30 dias: Use tudo. Se não ver evolução REAL no seu tempo de foco, ranking e simulados, devolvemos 100%. Sem burocracia. Cancelamento 1 clique no painel.

[BOTÃO AMARELO] COMPLETAR COMPRA COM DESCONTO PIX

Dúvida? Responde este email ou chama no WhatsApp: wa.me/5511999999999

— Time Operação Aprovação
```

### WhatsApp Churn Risk (Score < 40)
```
Oi [Nome], tudo bem? Sou [Nome SDR] da Operação Aprovação.

Vi que seu acesso tá paradinho há uns dias. Seu concurso [CONCURSO_ALVO] não espera, e eu não quero que você perca o ritmo.

Posso te mandar um **plano de recuperação 7 dias** (grátis, sem compromisso) adaptado pro seu horário atual? 

É só me dizer: quantos minutos você consegue hoje? 15? 30? 45?

Monto e te mando aqui mesmo. Sem custo. Bora?
```

---

## 7. Integração Técnica (Resumo)

| Sistema | Evento/Webhook | Ação |
|---------|----------------|------|
| **Stripe/MP** | `checkout.session.expired` / `payment_intent.failed` | Trigger sequência abandono |
| **App (Backend)** | `streak_broken` / `inactive_7d` / `health_score_drop` | Trigger retenção |
| **CRM** | Tag `needs_sales_call` / `win_back` | Cria task SDR |
| **WhatsApp API** | Template aprovado `recovery_abandoned`, `retention_risk`, `win_back` | Envio automatizado |
| **GA4** | `recovery_email_sent`, `recovery_whatsapp_sent`, `recovery_converted` | Atribuição |

---

## 8. Checklist Implementação

- [ ] Webhook Stripe/MP → CRM (abandono, falha pagamento, cancelamento)
- [ ] App → CRM (health score diário, streak quebrado, inatividade)
- [ ] WhatsApp Business API: Templates aprovados (3-5 templates)
- [ ] Sequências CRM: 5 emails abandono + 6 emails reengajamento + 5 retenção
- [ ] Links recuperação checkout: Token único + Pré-preenchimento + Timer real
- [ ] Dashboard Recuperação: Looker Studio / Metabase (receita recuperada, taxas, CAC)
- [ ] Testes A/B: Email subject, WhatsApp template, Timer duração, Downsell oferecido

---

*Revisar semanalmente: "Taxa recuperação abandono subiu 3% com WhatsApp 15min → escalar para todos opt-ins".*