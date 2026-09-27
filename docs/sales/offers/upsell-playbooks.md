# Upsell Playbooks — Operação Aprovação

> Playbooks de upsell/cross-sell por momento da jornada. Cada playbook: Trigger → Segmento → Oferta → Script → Métrica.
> Regra: **Upsell só se agrega valor real** — nunca empurrar produto que não serve.

---

## 1. Playbook: Order Bump (Checkout)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | Checkout iniciado (qualquer plano) |
| **Oferta** | Mentoria Planejamento 30min — R$ 97 (valor R$ 297) |
| **Posição** | Checkbox abaixo do pagamento, acima do botão final |
| **Copy** | "🎁 Adicionar Mentoria Planejamento 30min — R$ 97\n✅ Call 30min + Diagnóstico + Cronograma Notion + Gravação\n✅ Garantia: Se não gostar, devolvemos R$ 97 na hora" |
| **Take Rate Meta** | > 15% |
| **Regra** | Só aparece se plano = Anual OU Mensal (não em Trial grátis) |
| **Entrega** | Imediata: Link Calendly + Notion template no Thank You Page |

---

## 2. Playbook: Thank You Page Upsell (One-Click)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | Purchase confirmado (Stripe/MP webhook) |
| **Janela** | 15min countdown real (server-side) |
| **Oferta** | **Turma VIP** — R$ 1.997 (20% off, de R$ 2.497) |
| **Copy** | Timer 15:00 + "Oferta exclusiva novos alunos\n🎯 Turma VIP — Cronograma semanal + Acompanhamento 15min/sem + Simulados AO VIVO + Grupo VIP + Revisão Véspera + Material impresso\n💰 De R$ 2.497 → R$ 1.997 (SÓ AGORA)\n💳 1 clique — usa mesmo pagamento aprovado" |
| **Take Rate Meta** | > 8% novos alunos |
| **Entrega** | Imediata: Acesso grupo VIP + Convite Calendly + Endereço envio material |
| **Regra** | Só 1x por cliente. Se recusar, não reaparece por 90d. |

---

## 3. Playbook: Upgrade Mensal → Anual (In-App)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | Usuário Mensal ativo + 30 dias de assinatura OU Streak ≥ 30 |
| **Canal** | In-app banner + Push + Email + WhatsApp (se opt-in) |
| **Oferta** | Upgrade Anual = Trava preço vitalício + Economia R$ 367/ano + Mentoria 30min grátis |
| **Copy In-App** | "🎖️ Parabéns pela streak 30 dias! Trava seu preço AGORA: Anual R$ 1.997 (R$ 166/mês) + Mentoria 30min GRÁTIS. PIX 10% off = R$ 1.797. [Upgrade 1 clique]" |
| **Copy Email** | Assunto: "Sua streak 30d merece recompensa 🎁" + Benefícios + Link direto checkout `?upgrade=annual&bonus=mentoria` |
| **Copy WA** | "Oi [Nome], 30 dias de streak! 🎉 Trava seu preço: Anual R$ 1.997 + Mentoria grátis. Link: [link]. Bora?" |
| **Meta Conversão** | > 40% base Mensal ativa 90d |
| **Regra** | Não mostrar se já viu 3x e não clicou (frequency cap) |

---

## 4. Playbook: Turma VIP (Cross-sell Pós-Ativação)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | Usuário Anual ativo + Streak ≥ 14 OU Simulados ≥ 3 + Nota média ≥ 60% |
| **Canal** | Email (Fundador) + WhatsApp (SDR) + In-app modal |
| **Oferta** | Turma VIP — R$ 1.997 (único) — Cronograma semanal + Acompanhamento 15min/sem + Simulados AO VIVO + Grupo VIP + Revisão Véspera + Material impresso |
| **Copy Email (Fundador)** | "Oi [Nome], vi sua streak [X] e notas [Y]%. Você tá no caminho. Quer acelerar? Tenho vaga na Turma VIP: cronograma semanal personalizado, acompanhamento 15min/semana, simulados comentados ao vivo, grupo VIP com aprovados. R$ 1.997 único. 10 vagas/mês. [Quero minha vaga]" |
| **Copy WA (SDR)** | "Oi [Nome], parabéns pela streak [X]! Vi que mandou bem nos simulados. Tenho vaga na Turma VIP essa mês: cronograma semanal + acompanhamento + simulados AO VIVO + grupo VIP. R$ 1.997. Só 10 vagas. Mando detalhes?" |
| **Meta Take Rate** | > 15% base elegível |
| **Entrega** | Imediata: Grupo WhatsApp + Calendly acompanhamento + Endereço material |

---

## 5. Playbook: Mentoria 1:1 (High Touch)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | Usuário Turma VIP ativo 60d + Streak ≥ 60 + Nota simulados ≥ 70% + NPS ≥ 9 |
| **Canal** | Call SDR (15min diagnóstico) → Proposta Notion → Closer |
| **Oferta** | Mentoria 1:1 — R$ 997-1.497/mês (3m mín) — 4 calls/mês + WhatsApp ilimitado + Professor especialista + Plano Notion vivo |
| **Qualificação Call** | BANT + "Qual sua meta específica? (Nomeação X / Nota Y / Tempo Z)" |
| **Proposta** | PDF/Notion personalizado: Diagnóstico + Plano + Metodologia + Professor + Investimento + Garantia 30d |
| **Meta Take Rate** | > 3% base Turma VIP elegível |
| **Entrega** | Contrato DocuSign + Link Checkout Mentoria + Call Boas-vindas agendada |

---

## 5. Playbook: Kit Físico (Cross-sell Black Friday / Lançamento)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | Campanha Black Friday / Lançamento Edital / Aniversário Plataforma |
| **Oferta** | Kit Físico: Caderno Inteligente + Caneta + Post-its + planners semanais impressos + Card "Missão" |
| **Preço** | R$ 197 (custo ~R$ 60) — Oferta: **Grátis** no Anual BF / R$ 97 avulso |
| **Logística** | Print-on-demand (Printful/Printi) — Envio 5-7 dias úteis — Rastreio no painel |
| **Meta** | 200 kits BF / 50 kits/mês lançamento |
| **Regra** | Estoque limitado comunicado (escassez real) |

---

## 6. Playbook: Win-back (Reativação Churn)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | Cancelamento confirmado (webhook Stripe/MP `customer.subscription.deleted`) |
| **Dia 1** | Email Fundador: "Sinto que vai embora. Foi preço? Tempo? Produto? Responde que eu leio." |
| **Dia 7** | Email: "Melhoramos: Novo modo foco, Simulados [BANCA], Ranking cidade. Volta?" |
| **Dia 30** | **Oferta Win-back**: 50% off 1º mês (R$ 98,50 → R$ 49,25) + Mentoria 30min grátis (R$ 97) + Progresso 100% restaurado |
| **Copy** | "Volta? 50% off + Mentoria grátis. Seu progresso TUDO restaurado (streak, XP, ranking, anotações). Só 20 vagas/mês. [Voltar com 50% OFF]" |
| **Meta Reativação** | > 20% (30d) / > 10% (90d) |
| **Regra** | 1x por cliente. Se reativou e cancelou de novo → sem nova oferta 180d. |

---

## 7. Playbook: Indicação / Afiliado (Viral Loop)

| Elemento | Detalhe |
|----------|---------|
| **Trigger** | NPS ≥ 9 (Promotor) OU Compra Anual concluída |
| **Oferta** | **Indique & Ganhe**: Amigo ganha 10% off + Você ganha R$ 50 crédito (ou 1 mês grátis) |
| **Mecânica** | Link único `/ref/[user_id]` → Rastreamento cookie 30d + UTM `utm_source=referral&utm_medium=affiliate` |
| **Pagamento** | Crédito liberado 30d após amigo confirmar pagamento (anti-fraude) |
| **Dashboard Afiliado** | Painel: Cliques, Trials, Conversões, Créditos pendentes, Pagos |
| **Meta** | 15% novos clientes via indicação / CAC Referral < R$ 30 |

---

## 8. Matriz de Priorização (Qual Upsell Quando)

| Momento Jornada | 1ª Prioridade | 2ª Prioridade | 3ª Prioridade |
|-----------------|---------------|---------------|---------------|
| **Checkout** | Order Bump (Mentoria 30min) | — | — |
| **Thank You Page (0-15min)** | Turma VIP (One-click) | — | — |
| **Dia 1-7 (Onboarding)** | Upgrade Anual (se Mensal) | Turma VIP (se Anual + streak 14+) | Kit Físico (se campanha) |
| **Dia 30 (Streak 30)** | Upgrade Anual (Mensal) | Turma VIP (Anual) | Mentoria (Top performers) |
| **Dia 60-90 (Power User)** | Mentoria 1:1 | Turma VIP (se não tem) | Indicação (NPS 9+) |
| **Cancelamento (Dia 1)** | Email Fundador (Diagnóstico) | — | — |
| **Pós-Cancelamento (Dia 30)** | Win-back 50% + Mentoria | — | — |
| **Black Friday / Lançamento** | Anual BF R$ 1.497 + Kit Grátis | Turma VIP + Kit | Mentoria Early Bird |

---

## 9. Métricas por Playbook (Dashboard Semanal)

| Playbook | Métrica Principal | Meta | Alerta Se |
|----------|-------------------|------|-----------|
| Order Bump | Take Rate | > 15% | < 10% |
| TY Page Upsell | Take Rate | > 8% | < 5% |
| Upgrade Mensal→Anual | Taxa Conversão 90d | > 40% | < 30% |
| Turma VIP | Take Rate Elegíveis | > 15% | < 10% |
| Mentoria 1:1 | Take Rate Elegíveis | > 3% | < 1% |
| Win-back | Taxa Reativação 30d | > 20% | < 10% |
| Indicação | % Novos Clientes | > 15% | < 8% |

---

## 10. Regras de Ouro (Governança)

1. **Nunca** ofereça upsell se Health Score < 50 (risco churn)
2. **Nunca** mostre > 1 upsell simultâneo na mesma tela
3. **Sempre** comunique valor antes de preço ("Você ganha X" não "Custa Y")
3. **Sempre** inclua garantia/baixo risco ("Cancela 1 clique", "30 dias grátis")
4. **Frequency Cap**: Máx 3 impressões/upsell por usuário por 30d
5. **Segmentação Obrigatória**: Só oferta para elegíveis (critérios acima)
6. **A/B Test Obrigatório**: Toda nova copy/oferta testa vs control 50/50 por 2 semanas
7. **Attribution**: Todo upsell tagga `upsell_type` no CRM + `utm_campaign=upsell_[type]`

---

*Próximo: `crm-setup.md` → `onboarding-flow.md` → `retention-expansion.md` → `kpi-targets.md` → `compensation-plan.md`.*