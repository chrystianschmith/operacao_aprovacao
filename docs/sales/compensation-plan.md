# Compensation Plan — Comissão e Bônus — Operação Aprovação

> Modelo de remuneração variável para SDRs e Closers + promoção de expansão (NRR) para CS.
> Objetivo: **vender certo, não vender mais** — recompensar LTV, não apenas primeira venda.

---

## 1. Papéis e Alinhamento (O Quarteto de Receita)

| Papel | Foco KR | Modelo |
|-------|---------|--------|
| **SDR** (qualificação/outreach) | SQL gerados, pipeline criado | Base + comissão por SQL atingido + bônus Qualif.→Opp |
| **Closer** (fechamento) | Revenue fechado, Ticket, Upsell | Base + comissão por receita recebida + bônus Upsell |
| **CS/Success** (pós-venda) | Health, NRR, Win-back | Base + bônus por NRR + Retenção |
| **Sales Head** (gestão) | MRR total, NRR, disciplina | Base + bônus em MRR gated por NRR |

> Toda comissão referenciada com base na receita **líquida recebida** (não "booked") e **comissionável só após primeiro pagamento efetivado + período de cancelamento de 30d** (evita churn-fraude e comissão de estorno).

---

## 2. Comissão Fixa (Closer) — Base da Receita

| Item vendido | Comissão |
|--------------|----------|
| Plano Mensal (R$ 197) | 10% do 1º pagamento, PAGO na 2ª mensalidade |
| Plano Anual (R$ 1.997) | 15% (R$ 299) — pago após 30d sem cancelamento |
| Turma VIP (R$ 1.997) | 20% (R$ 399) |
| Mentoria (R$ 997/mês) | 25% por mensalidade M1+M2 (+ bônus se M3+) |
| B2B/Indicado (custom) | 12-20% conforme margem |

**Regras**:
- Comissão paga em ciclo mensal consolidado (D+30).
- Reembolso/chargeback → estorno da comissão.
- Multiplos de venda p/ mesmo lead com upgrade: comissão cheia apenas na diferença (upgrade).

---

## 3. Bônus por Atividade (SDR)

> SDR recebe para **gerar pipeline** (não vender): foco na saúde do funil.

| Trigger | Bônus |
|---------|-------|
| SQL qualificado (BANT ok, call agendada) | R$ 20 |
| SQL → Opp (após call 60%+ duração) | R$ 35 |
| Opp → **Proposta enviada** | R$ 15 |
| Proposta → **Fechada** (Closer) | R$ 25 (partilha de conversão) |
| **Win-back** (reativação de churned ≥ 30d) | R$ 50 |
| **Mensal → Anual (upgrade tracking)** | R$ 30 |

---

## 4. Bônus de Expansão (CS / Success)

| Ação | Bônus |
|------|-------|
| Churn Risk salvo (Score < 40 → recuperado 30d) | R$ 30 |
| Upgrade Mensal→Anual (cadência ativa CS) | R$ 60 |
| Upgrade → Turma VIP | R$ 120 |
| Upgrade → Mentoria | R$ 200 |
| Win-back 30d pós-cancelamento | R$ 50 |
| **Referral program** (fechado com código Indicador) | R$ 15 p/ Indicador + R$ 5 CS |

---

## 5. Bônus de Performance (Tier por Resultado)

> Bônus trimestral sobre MRR incremental da equipe (gate: NRR > meta e CAC no verde).

| Tier | Resultado trimestral (MRR incremental) | Bônus SDR | Bônus Closer |
|------|----------------------------------------|-----------|--------------|
| Base | ≥ 75% da meta | 0,3x salário base | 0,5x salário base |
| On Target (100%) | ≥ 100% da meta | 0,5x salário base | 1,0x salário base |
| Overdrive (120%+) | ≥ 120% da meta | 0,8x salário base | 1,5x salário base |

> Gate técnico: **NRR ≥ 120%** + **CAC Blended < R$ 180** + **Churn < 5%** para liberar Overdrive.

---

## 6. Árvore de Partilha (Multi-seller)

Quando venda passa por > 1 pessoa (ex: SDR gerou via WA, Closer fechou call):

| Etapa | Quem | % da comissão |
|-------|------|---------------|
| Qualificação/outreach | SDR (genérico) | 30% |
| Qualificação/call | SDR original (tracking UTM) | 40% |
| Fechamento/checkout assistido | Closer | 60% |

**Regras anti-conflito**:
- Ticket gerado no checkout automático (`?utm_content=sdr_outbound`) → atribuído ao SDR do template.
- Call original define o "owner" — não permitido "roubo" por outro closer.
- Escalação para mentor requer confirmação do vendedor original.

---

## 7. Anti-fraude de Comissão

| Fraude/risco | Prevenção |
|--------------|-----------|
| Autocompra fake / cartão próprio | Block de cartão/email/CPF + revisão manual de caso suspeito |
| Comissão antes de pagamento confirmado | Pago apenas D+30 pós 1º pagamento real |
| Venda cancelada em 30d | Estorno automático de comissão |
| Churn até M3 (venda assistida) | Clawback de 30% em M3 se churned (espelho no plano) |
| "Venda" para empresa em falência | B2B exige contrato + validação CNPJ |

---

## 8. Exemplo de Compensação (Cenário Mensal)

**SDR em Mês Bom (target 100%)**:
- Base: R$ 2.500
- SQL (30 × R$ 20) = R$ 600
- Opps (18 × R$ 35) = R$ 630
- Propostas (10 × R$ 15) = R$ 150
- Conversões (6 × R$ 25) = R$ 150
- **Total variável** = R$ 1.530 + base = **R$ 4.030**

**Closer em Mês Bom (target 100%)**:
- Base: R$ 3.500
- Vendas (6 × mix ticket ~R$ 1.600, 17% média) ≈ R$ 1.632
- Upsells (3) + retenção (4) ≈ R$ 300
- Tier (100%) = 1,0x base = R$ 3.500
- **Total mensal** ≈ **R$ 8.932**

---

## 9. Quadro de Comunicação de Comissão

| Item | Frequência |
|------|------------|
| Dashboard individuails (SDR/Closer) | Tempo real, read-only |
| Fechamento mensal (WhatsApp/Email) | D+5 do fechamento |
| Revisão de plano trimestral | 1ª semana do trimestre |
| Auditoria anti-fraude (amostra) | Mensal + alerta automático |

---

## 10. Regras de Bonificação (Leituras Importantes)

1. Comissão paga em **R$**, incentivada pelo resultado **efetivado** (pagamento real).
2. **Sem comissão em venda "a prazo"** sem 1º pagamento.
3. **Clawback** em caso de chargeback em até 30d ou churn M3 (venda assistida).
4. **Teto**: bônus por forma injusta não prevalece sobre política anti-fraude.
5. **Transparência**: plano documentado, aprovado em v1 no fundador; revisado com o time.

---

## 10.1 Metas de referência (Comissão por canal)

> Base para cálculo de quota (ver `kpi-targets.md`).

| Canal | Ticket médio LTV | Meta mensal por Closer (assistido) |
|-------|-------------------|--------------------------------------|
| Plano auto-serviço | R$ 250 → R$ 800 LTV | 18 vendas/auto (sem comissão fixa, só custo variável menor) |
| Plano anual assistido | R$ 1.997 → R$ 2.400 LTV | 10 vendas |
| Turma VIP | R$ 1.997 → R$ 4.000 LTV | 6 turmas/mês (2 semanas) |
| Mentoria | R$ 997/mês → R$ 8.000 LTV | 6 mentores ativos |
| B2B | custom → R$ 20.000 LTV | 2 contratos |

---

## 11. São Migrados ao Payroll (Resumo)

| Papel | Fixo | Variável esperada | Total esperado/mês |
|-------|------|-------------------|--------------------|
| SDR | R$ 2.500 | R$ 800-1.800 | R$ 3.300-4.300 |
| Closer | R$ 3.500 | R$ 3.000-6.000 | R$ 6.500-9.500 |
| CS/Success | R$ 3.500 | R$ 1.000-3.000 | R$ 4.500-6.500 |
| Sales Head | R$ 8.000 | R$ 4.000-8.000 (bonus MRR) | R$ 12.000-16.000 |

---

## 12. Phase-II (Scaling)

- **Remote-first com SLAs** — regimes híbridos quando escalar.
- **Plano de equity/ESOP** para closers top-3 (keep-them).
- **Commission wash-up trimestral** revisitado em Q1 de cada ano.

---

*Fim da trilha `sales`. Agora: `sales-page` (docs + código).*