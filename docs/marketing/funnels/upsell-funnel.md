# Funil de Upsell / Expansão (Pós-Compra) — Operação Aprovação

> Maximiza LTV via Order Bumps, Upsells One-Click, Downsells, Cross-sells e Renovações.
> Foco: NRR > 120%, Payback CAC < 2 meses.

---

## 1. Oportunidades de Expansão (Mapa de Valor)

| Momento | Produto | Ticket | Tipo | Conversão Alvo |
|---------|---------|--------|------|----------------|
| **Checkout** | Mentoria Planejamento 30min | R$ 97 | Order Bump | 15-20% |
| **Thank You Page (0-15min)** | Turma VIP (Cronograma + Acompanhamento) | R$ 1.997 → R$ 997 (50% off) | Upsell One-Click | 5-8% |
| **Dia 7-14 (Onboarding)** | Material Impresso (Apostilas + Caderno) | R$ 297 | Cross-sell Email | 10-15% |
| **Dia 30-60 (Engajado)** | Mentoria 1:1 Mensal | R$ 500-1.500/mês | High-Touch Sales | 3-5% |
| **Dia 60-90 (Avançado)** | Turma VIP Próxima Etapa | R$ 2.000-4.000 | High-Touch Sales | 2-4% |
| **Mês 2-3 (Renovação)** | Upgrade Anual (20% off) | Δ R$ 1.000+ | Renovação Assistida | 40-50% |
| **Churn Risk** | Pausa/Plano Leve / Win-back | Variável | Retenção | 20-30% save |

---

## 2. Checkout — Order Bump (Baixa Fricção)

### Produto: **Mentoria Planejamento 30min** (R$ 97)
**Posicionamento**: "Seu cronograma personalizado feito por quem passa — em 30min ao vivo."

**Checkbox no Checkout** (abaixo seleção plano):
```
[ ] Adicionar Mentoria Planejamento 30min — R$ 97 (R$ 297 valor normal)
    ✅ Call 30min Zoom/WhatsApp (agenda na hora)
    ✅ Diagnóstico gaps + Cronograma semanal personalizado
    ✅ Gravação da call + Plano no Notion
    ✅ Garantia: Se não gostar, devolvemos R$ 97 na hora
```

**Copy Micro**:
> "Alunos com mentoria inicial têm 2.3x mais chance de manter streak 30+. Invista 30min agora, economize meses de tentativa/erro."

**Técnico**: 
- Stripe: `payment_intent` + `metadata.upsell_mentoria=true`
- Se marcado → Cria agendamento Calendly automático pós-pagamento
- Email confirmação: "Sua mentoria foi agendada! Link Calendly: [link]"

---

## 3. Thank You Page — Upsell One-Click (Alta Urgência)

### Produto: **Turma VIP — "Sua Trilha com Acompanhamento"** (R$ 1.997 → R$ 997)

**Timer Real**: 15 minutos (cookie + server) — não reseta no refresh.

**Estrutura Página**:
```
┌────────────────────────────────────────────────────────────┐
│  🎉 COMPRA APROVADA! Acesso liberado.                      │
│  [Botão] ENTRAR NA PLATAFORMA AGORA                        │
├────────────────────────────────────────────────────────────┤
│  ⏰ OFERTA EXCLUSIVA PARA NOVOS ALUNOS (15:00)            │
│                                                            │
│  🎯 TURMA VIP — "Não estude sozinho. Estude CERTO."       │
│                                                            │
│  O que inclui:                                             │
│  ✅ Cronograma semanal personalizado (atualizado toda 2ª)  │
│  ✅ Acompanhamento semanal 15min (WhatsApp/Zoom)           │
│  ✅ Simulados comentados AO VIVO (professor)               │
│  ✅ Grupo VIP WhatsApp (aprovados + mentores)              │
│  ✅ Revisão de Véspera TODO edital do seu concurso         │
│  ✅ Material impresso entregue em casa                     │
│                                                            │
│  💰 De R$ 1.997 → R$ 997 (50% OFF — SÓ AGORA)             │
│  💳 1 clique — usa mesmo pagamento aprovado               │
│                                                            │
│  [BOTÃO VERDE GRANDE] QUERO MINHA VAGA NA TURMA VIP       │
│  [Link pequeno] "Não, obrigado. Entrar na plataforma."    │
├────────────────────────────────────────────────────────────┤
│  ⚠️ Esta oferta expira em 15min e não reaparece.          │
│  Garantia 30 dias: Se não valer a pena, devolvemos.       │
└────────────────────────────────────────────────────────────┘
```

**Lógica One-Click**:
- Stripe: `SetupIntent` salvo no checkout original → `PaymentMethod` reutilizável
- POST `/api/upsell/turma-vip` → Cobra `payment_method` salvo → Cria assinatura turma
- Se falha → "Pagamento não aprovado. Tente cartão diferente." → Fallback checkout normal

---

## 4. Cross-sell Email (Dia 7-14) — Material Impresso

### Produto: **Kit Físico "Operação Aprovação"** (R$ 297)
**Conteúdo**: Apostilas impressas (matérias base) + Caderno Inteligente (pautado, índice, bolsos) + Flashcards físicos 100 cards + Caneta + Marcador.

**Email Dia 10** (Se abriu emails + login app > 3x):
```
Assunto: Seu kit físico chegou? 📦 (Opcional, mas recomendado)

[Nome],

Você tá no app, vendo seu tempo real, streak subindo, ranking melhorando.
Mas tem algo que 78% dos aprovados pediram: MATERIAL FÍSICO.

Por que? 
• Estuda no ônibus sem internet? ✅
• Quer anotar à mão (fixa mais)? ✅  
• Gosta de ver o progresso físico na estante? ✅

Montamos o **Kit Operação Aprovação**:
📚 Apostilas impressas (Direito Penal, Admin, Constitucional, Legislação)
📓 Caderno Inteligente (seu "segundo cérebro" — índice, bolsos, reposicionável)
🃏 100 Flashcards físicos (matérias que MAIS caem)
✍️ Caneta + Marcador texto

R$ 297 à vista ou 3x R$ 99. Frete grátis. Entrega 7-10 dias úteis.

[BOTÃO] QUERO MEU KIT FÍSICO

P.S.: Assinante ativo tem 20% off vitalício em materiais. Seu cupom: KIT20-[USER_ID]
```

---

## 5. High-Touch Sales — Mentoria 1:1 / Turma VIP (Dia 30-90)

### Qualificação (Lead Score + Comportamento)
| Critério | Peso | Threshold Mentoria | Threshold Turma VIP |
|----------|------|-------------------|---------------------|
| Dias ativos/30 | 25% | > 20 | > 25 |
| Streak atual | 20% | > 14 | > 21 |
| % Curso concluído | 20% | > 30% | > 50% |
| Simulados feitos | 15% | > 5 | > 10 |
| NPS / Feedback | 10% | > 8 | > 9 |
| Ticket suporte (negativo) | 10% | = 0 | = 0 |
| **Score Total** | 100% | **> 75** | **> 85** |

### Outreach Automatizado (Quando Score Atinge Threshold)

**Dia 30-45 (Mentoria)**:
```
WhatsApp SDR: "Oi [Nome], parabéns pela streak de [X] dias! 🎖️
Vi que você tá mandando bem nos simulados (média [Y]%).
Quer levar pro próximo nível? Tenho vaga pra **Mentoria 1:1** esse mês:
• 4 calls/mês (30min) + WhatsApp ilimitado
• Plano personalizado + Revisão simulados + Mindset
• R$ [500-1.500]/mês (conforme professor)
Só 5 vagas/mês. Quer que eu mande detalhes?"
```

**Dia 60-90 (Turma VIP)**:
```
Email Fundador: "Assunto: Convite: Turma VIP [CONCURSO] - Próxima etapa

[Nome],

Você completou [X]% do curso, streak [Y] dias, ranking top [Z]%.
Tá na hora de ir pro nível que separa aprovados de 'quase'.

Abri **Turma VIP [CONCURSO] - Turma [MÊS]** (15 vagas):
• Cronograma semanal FEITO PRA VOCÊ (atualizado toda 2ª)
• Acompanhamento 15min/semana (Zoom/WhatsApp)
• Simulados comentados AO VIVO (professor da banca)
• Grupo WhatsApp: aprovados + mentores + você
• Revisão de Véspera CADA edital
• Material impresso incluso

Investimento: R$ [2.000-4.000] (parcelado 6x sem juros)
Garantia: 30 dias. Se não ver evolução, devolvemos.

Responda este email com 'QUERO' que te mando o link de aplicação.
Só 15 vagas. 8 já preenchidas.

— [Fundador]"
```

### Processo Venda Assistida (High-Touch)

| Etapa | Ação | Ferramenta | SLA |
|-------|------|------------|-----|
| 1. Qualificação | SDR aplica BANT (Budget, Authority, Need, Timing) | CRM + Call 10min | < 2h após trigger |
| 2. Diagnóstico | Call 30min: Gaps + Objetivos + Rotina + Orçamento | Zoom + Notion Template | Agendada < 48h |
| 3. Proposta | PDF/Notion personalizado: Plano + Cronograma + Professor + Investimento | Proposify/Notion | Enviada < 24h pós-call |
| 4. Follow-up | Dia 1, 3, 7, 14 — Multi-canal (WA + Email + Call) | CRM Sequência | Automatizado |
| 5. Fechamento | Link checkout personalizado (Turma/Mentoria) + Contract DocuSign | Stripe + DocuSign | Imediato aceitação |
| 6. Onboarding VIP | Call boas-vindas + Acesso grupo + Cronograma Semana 1 | Zoom + WhatsApp Group | < 24h pós-pagamento |

---

## 6. Renovação / Upgrade Anual (Mês 2-3)

### Trigger: Assinante Mensal Ativo (Status=active, Streak > 7, Login > 10d/30)

**Email Mês 2 (Dia 45)**:
```
Assunto: Como economizar R$ 1.000/ano no seu acesso 💰

[Nome],

Você tá no mensal (R$ 197/mês = R$ 2.364/ano).
Pode pagar R$ 1.997/ano (R$ 166/mês) = **R$ 367 de economia**.

Mesmos benefícios. Mesma garantia. Mesmo cancelamento 1 clique.
Diferença: Você trava o preço atual PRA SEMPRE (enquanto assinante ativo).
Preço sobe pra novos alunos em [DATA].

[BOTÃO] UPGRADE PARA ANUAL - ECONOMIZAR R$ 367/ANO

P.S.: Se upgrade hoje, ganha Mentoria Planejamento 30min (R$ 97) de brinde.
```

**Email Mês 3 (Dia 75 — Se não upgrade)**:
```
Assunto: Última chance: Preço fundador expira em 7 dias

[Nome],

Em 7 dias, o plano anual sobe de R$ 1.997 → R$ 2.497.
Quem upgrade AGORA trava R$ 1.997 vitalício.

Seu streak: [X] dias. Ranking: #[Y]. Você tá no caminho certo.
Não deixe o preço te parar.

[BOTÃO] TRAVAR PREÇO FUNDADOR (R$ 1.997/ANO)

— [Fundador]
```

**Técnico**: 
- Stripe: `Subscription.update` → `items[0].price=price_anual` + `proration_behavior=create_prorations`
- Aplica cupom `FOUNDER_LOCK` (desconto vitalício enquanto ativo)

---

## 7. Downsell / Retenção (Churn Prevention)

### Cenário: Solicita Cancelamento / Pagamento Falha Recorrente

**Fluxo Cancelamento (App → Botão "Cancelar")**:
```
1. Modal: "Tem certeza? Perde: Streak [X], XP [Y], Ranking #[Z], Progresso [W]%"
2. Opção A: "Pausar 30 dias (grátis) — Volta quando quiser, progresso salvo"
3. Opção B: "Plano Leve R$ 47/mês — Só flashcards + simulados (sem cursos/vídeo)"
4. Opção C: "Falar com humano (WhatsApp) — A gente resolve"
5. Opção D: "Confirmar cancelamento — Progresso salvo 1 ano"
```

**Email Fundador Pós-Cancelamento (Dia 1)**:
```
Assunto: Sinto que vai embora, [Nome]

Não quero ser chato, mas quero entender: 
Foi preço? Tempo? Produto? Suporte? Falta de resultado?

Responde este email. Eu (fundador) leio TODOS.
Se for preço → Tenho opção.
Se for tempo → Tenho plano 15min.
Se for produto → Quero melhorar.
Se for resultado → Me mostra seus dados, eu analiso grátis.

A porta fica aberta. Seu progresso salvo 1 ano.
Volta quando quiser.

— [Fundador]
```

**Win-back Dia 30 Pós-Cancelamento**:
```
Assunto: Volta? 50% off no 1º mês + Mentoria 30min grátis 🎁

[Nome],

Faz 30 dias. Seu concurso [ALVO] ainda tá no radar?
Melhoramos muito: Novo modo foco, Simulados [BANCA NOVA], Ranking por cidade.

Volta com a gente:
✅ 50% off no 1º mês (R$ 98,50 → R$ 49,25)
✅ Mentoria Planejamento 30min grátis (R$ 97)
✅ Seu progresso TUDO restaurado (streak, XP, ranking, anotações)

Só 20 vagas/mês pra retorno. 12 preenchidas.

[BOTÃO] VOLTAR COM 50% OFF + MENTORIA

Válido 7 dias. Depois preço normal.

— Time Operação Aprovação
```

---

## 8. Métricas de Expansão (Dashboard Mensal)

| Métrica | Meta Mês 3 | Meta Mês 6 | Meta Mês 12 |
|---------|------------|------------|-------------|
| **Order Bump Take Rate** | 15% | 20% | 25% |
| **Upsell TY Page Take Rate** | 5% | 8% | 10% |
| **Cross-sell Kit Físico** | 10% | 15% | 20% |
| **Mentoria 1:1 Conversão** | 3% | 5% | 8% |
| **Turma VIP Conversão** | 2% | 4% | 6% |
| **Upgrade Anual (Mensais)** | 40% | 50% | 60% |
| **Churn Save Rate** | 20% | 30% | 40% |
| **NRR (Net Revenue Retention)** | 110% | 120% | 130% |
| **LTV 12m** | R$ 800 | R$ 1.200 | R$ 1.800 |
| **Expansão Revenue / Mês** | R$ 15k | R$ 50k | R$ 150k |

---

## 9. Atribuição e Comissão (Sales Team)

| Produto | Comissão SDR (Qualificação) | Comissão Closer (Fechamento) | Bônus MRR/Trimestre |
|---------|----------------------------|------------------------------|---------------------|
| Order Bump | — (Automático) | — | — |
| Upsell TY Page | — (Automático) | — | — |
| Kit Físico | — (Email Auto) | — | — |
| Mentoria 1:1 | R$ 50 | 15% valor 1º mês | R$ 500 se > 5 vendas/mês |
| Turma VIP | R$ 100 | 10% valor total | R$ 1.000 se > 3 vendas/mês |
| Upgrade Anual | R$ 20 | 5% Δ valor | R$ 300 se > 10 upgrades/mês |
| Win-back | R$ 30 | 10% 1º mês retorno | R$ 200 se > 5 wins/mês |

---

## 10. Checklist Implementação

- [ ] Checkout: Order Bump Mentoria (Stripe Metadata + Calendly Auto)
- [ ] Thank You Page: Upsell Turma VIP (Timer 15min Real + One-Click Stripe)
- [ ] Email Cross-sell Kit Físico (Trigger: Login > 3x + Dia 10)
- [ ] CRM: Health Score Diário + Automações Score Thresholds
- [ ] SDR Playbook: Qualificação BANT + Diagnóstico Template + Proposta Template
- [ ] WhatsApp Templates: Mentoria, Turma VIP, Win-back, Churn Risk
- [ ] Stripe: Upgrade Anual Prorrata + Cupom Founder Lock
- [ ] Cancel Flow: Modal Pausa/Plano Leve/Humano/Confirmar
- [ ] Dashboard Expansão: NRR, LTV, Take Rates, Revenue/Produto
- [ ] Testes A/B: Order Bump Preço (R$ 67 vs 97 vs 147), Upsell Timer (10 vs 15 vs 30min), Email Subject Cross-sell

---

*Próximo: `email/sequences/` — Detalhar cada sequência (onboarding, reengajamento, win-back, upsell).*