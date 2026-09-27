# Pricing Strategy — Operação Aprovação

> Estratégia de precificação baseada em **Value-Based Pricing** + **Price Anchoring** + **Tiered Value Ladder**.
> Objetivo: Maximizar LTV mantendo CAC < R$ 180 e Payback < 2 meses.

---

## 1. Price Architecture (Escada de Valor)

| Tier | Produto | Preço | Valor Entregue | Target | Margem |
|------|---------|-------|----------------|--------|--------|
| **Free** | Lead Magnets / Trial 7d | R$ 0 | Diagnóstico + Plano 45min + 1 Simulado | Aquisição (CPL < R$ 20) | N/A |
| **Entry** | Assinatura Mensal | R$ 197/mês | Plataforma completa + Cancel 1 clique | Conversão Trial → Pago (15%) | 85% |
| **Core** | Assinatura Anual | R$ 1.997/ano (R$ 166/mês) | **Mensal + Trava preço vitalício + Mentoria 30min grátis** | **Core Offer (60% mix)** | 92% |
| **Growth** | Turma VIP | R$ 1.997 (único) | Cronograma semanal + Acompanhamento 15min/sem + Simulados AO VIVO + Grupo VIP + Revisão Véspera | Upsell 15% base anual | 78% |
| **Scale** | Mentoria 1:1 | R$ 997-1.497/mês (3m mín) | 4 calls/mês + WhatsApp ilimitado + Professor especialista + Plano Notion vivo | High Touch 2% base | 65% |
| **Enterprise** | B2B / Instituições | Sob consulta | Multi-seat + Dashboard gestor + API + SLA | Órgãos/Escolas | 70% |

---

## 2. Price Points & Psicologia

| Preço | Psicologia | Uso |
|-------|------------|-----|
| **R$ 197** | "Menos de R$ 7/dia" — baixo compromisso | Mensal / Downsell |
| **R$ 1.997** | "R$ 5,50/dia" — investimento sério, não "gasto" | Anual (Core) |
| **R$ 1.797** | PIX 10% off — "Economizei R$ 200" | Checkout PIX |
| **R$ 1.497** | Black Friday / Early Bird — "Quase R$ 1.500" | Promoções sazonais |
| **R$ 97** | Order Bump — "Café por dia" | Mentoria 30min checkout |
| **R$ 49,25** | Win-back 50% off — "Quase grátis" | Reativação 30d |

---

## 3. Discounting Rules (Governança)

| Regra | Detalhe | Exceção (Aprovação Fundador) |
|-------|---------|-------------------------------|
| **Sem desconto no Anual standard** | R$ 1.997 é preço de lista | — |
| **PIX 10% off sempre** | Anual R$ 1.797 / Mensal R$ 177 | Automático no checkout |
| **Early Bird Mentoria** | 3 primeiros meses R$ 797 vs R$ 997 | Limitado 5 vagas/mês |
| **Black Friday** | Anual R$ 1.497 (25% off) + Kit físico | 1 semana/ano |
| **Win-back 30d** | 50% off 1º mês + Mentoria 30min grátis | 1x por cliente / 20 vagas/mês |
| **Indicação (Afiliado)** | 20% comissão recorrente / 30% 1º pagamento | Pago após 30d cliente ativo |
| **B2B Volume** | 10+ seats: 15% off / 50+: 25% off | Contrato 12m + SLA |

**Proibido**: Desconto "só pra você" no chat, cupom genérico no site, desconto cumulativo.

---

## 4. Value Ladder & Upsell Logic

```
FREE (Lead Magnet)
    ↓ 15% convert
TRIAL 7d (Sem cartão)
    ↓ 40% convert
MENSAL R$ 197
    ↓ 40% upgrade (mês 1-3)
ANUAL R$ 1.997  ← CORE (60% receita)
    ↓ 15% upsell (mês 2-6)
TURMA VIP R$ 1.997 (único)
    ↓ 3% upsell (top performers)
MENTORIA 1:1 R$ 997-1.497/mês
```

**Trigger de Upgrade Anual**: 
- Trial D5: "Upgrade agora = 7d grátis contam no anual"
- Mensal D30: "Já pagou R$ 197. Upgrade anual = só R$ 1.800 mais (trava preço + mentoria)"
- In-app banner: "Sua streak 30 dias! Trava preço vitalício + mentoria grátis"

---

## 5. Competitive Positioning

| Concorrente | Modelo | Preço | Nosso Diferencial |
|-------------|--------|-------|-------------------|
| Cursinho Tradicional (Presencial) | Mensalidade + Material | R$ 300-600/mês | **Sistema Ativo vs Biblioteca Passiva** — Nós medimos tempo real, ranqueamos, damos XP |
| Cursinho Online Grande (Ex: Estratégia, Gran) | Assinatura Anual | R$ 1.200-1.800/ano | **Foco Concursos Segurança** — Banco específico, Ranking por cidade, Modo Foco |
| App Genérico (Anki, Notion, Trello) | Freemium / Baixo | R$ 0-50/mês | **Tudo integrado** — Plano IA + Simulados + Flashcards + Ranking num lugar só |
| Mentoria Particular | Hora/Aula | R$ 150-300/h | **Sistema + Mentoria** — Mentoria usa seus dados reais (streak, erros, ranking) |

---

## 6. Price Testing Roadmap

| Hipótese | Teste | Métrica Sucesso | Timeline |
|----------|-------|-----------------|----------|
| Anual R$ 2.197 converte igual? | A/B 50/50 (R$ 1.997 vs R$ 2.197) | Conversão Anual > 35% | Q1 2027 |
| Mensal R$ 229 reduz churn? | A/B (R$ 197 vs R$ 229) | Churn mensal < 4% | Q2 2027 |
| Trial 14d vs 7d aumenta LTV? | A/B (7d vs 14d) | LTV 12m > R$ 1.000 | Q2 2027 |
| Mentoria R$ 797/mês (sem mínimo 3m) | Teste 20 vagas | Take rate > 5% base anual | Q3 2027 |

---

## 7. Unit Economics por Tier

| Tier | Preço | CAC Alocado | Custo Entrega/Mês | LTV 12m | Payback | Margem Líquida |
|------|-------|-------------|-------------------|---------|---------|----------------|
| Mensal | R$ 197 | R$ 180 | R$ 15 | R$ 600 | 1.1m | 72% |
| Anual | R$ 1.997 | R$ 180 | R$ 12 | R$ 1.200 | 0.2m | 88% |
| Turma VIP | R$ 1.997 | R$ 50* | R$ 200 | R$ 1.997 | 0.3m | 68% |
| Mentoria 1:1 | R$ 1.200/m | R$ 200* | R$ 400 | R$ 14.400 | 0.4m | 55% |

*CAC incremental (upsell de base existente)

---

## 8. Price Communication Guidelines

| Canal | Tom | Frases-Chave |
|-------|-----|--------------|
| **Ads** | Direto + Urgência real | "R$ 5,50/dia. Trava preço vitalício. Mentoria grátis essa semana." |
| **Email** | Educativo + Prova | "Veja quanto [Nome] economizou estudando 45min/dia vs cursinho tradicional." |
| **WhatsApp** | Consultivo + Pessoal | "Qual cabe no seu bolso? Anual R$ 166/mês (PIX) ou Mensal R$ 197 (flex)?" |
| **Checkout** | Transparente + Risco Zero | "Garantia 30 dias. Cancel 1 clique. Sem pegadinha." |
| **Pós-venda** | Valor contínuo | "Sua streak 30 dias! Próximo passo: Turma VIP pra acelerar." |

---

## 9. Forecast 2027 (Cenário Base)

| Mês | Novos Anuais | Novos Mensais | Upgrades Anual | Turma VIP | Mentoria | MRR Final |
|-----|--------------|---------------|----------------|-----------|----------|-----------|
| Jan | 80 | 120 | 35 | 8 | 3 | R$ 320k |
| Fev | 70 | 100 | 30 | 6 | 2 | R$ 340k |
| Mar | 90 | 110 | 40 | 10 | 4 | R$ 380k |
| Abr | 85 | 105 | 38 | 8 | 3 | R$ 400k |
| Mai | 95 | 115 | 42 | 12 | 4 | R$ 440k |
| Jun | 110 | 130 | 50 | 15 | 5 | R$ 500k |
| Jul | 100 | 120 | 45 | 12 | 4 | R$ 520k |
| Ago | 120 | 140 | 55 | 18 | 6 | R$ 580k |
| Set | 130 | 150 | 60 | 20 | 7 | R$ 640k |
| Out | 140 | 160 | 65 | 22 | 7 | R$ 700k |
| Nov (BF) | 250 | 80 | 80 | 30 | 5 | R$ 850k |
| Dez | 180 | 100 | 70 | 15 | 5 | R$ 920k |

**ARR Projetado 2027**: ~R$ 6.2M

---

*Próximo: `offers/checkout-optimization.md` → `offers/upsell-playbooks.md` → `crm-setup.md` → `onboarding-flow.md` → `retention-expansion.md` → `kpi-targets.md` → `compensation-plan.md`.*