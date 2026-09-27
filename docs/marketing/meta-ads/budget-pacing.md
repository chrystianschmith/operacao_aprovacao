# Budget Pacing & Metas — Meta Ads Operação Aprovação

> Orçamento sugerido, metas por fase, regras de escala/corte, projeções financeiras.
> Base: Ticket médio R$ 150 (primeira compra), LTV 12m R$ 800, Margem 80%.

---

## 1. Orçamento Inicial Sugerido (Mês 1-3)

| Fase | Período | Orçamento Diário | Orçamento Mensal | Foco | Meta Principal |
|------|---------|------------------|------------------|------|----------------|
| **Validação** | Semanas 1-2 | R$ 150/dia | R$ 4.500 | TOFU 60% / MOFU 25% / BOFU 15% | CPL < R$ 30, CTR > 1%, Pixel populado |
| **Otimização** | Semanas 3-6 | R$ 300/dia | R$ 9.000 | TOFU 50% / MOFU 30% / BOFU 20% | CAC < R$ 200, ROAS 7d > 2.5 |
| **Escala Inicial** | Mês 2 | R$ 500/dia | R$ 15.000 | TOFU 40% / MOFU 30% / BOFU 30% | CAC < R$ 180, ROAS 7d > 3.0 |
| **Escala Acelerada** | Mês 3 | R$ 800-1.000/dia | R$ 24-30k | TOFU 30% / MOFU 30% / BOFU 40% | CAC < R$ 160, ROAS 7d > 4.0 |
| **Sazonal (Pré-Edital)** | 30d antes edital | +50-100% topo | Variável | Campanhas específicas "Edital X" | Maximizar volume leads quentes |

**Total Mês 1-3**: ~R$ 30-45k investimento | Meta: 150-250 assinaturas pagas | CAC Blended < R$ 200

---

## 2. Distribuição por Funil (Regras de Ouro)

| Funil | % Budget | Objetivo Otimização | Evento Pixel | Janela Atribuição |
|-------|----------|---------------------|--------------|-------------------|
| **TOFU** | 30-50% | Tráfego / Envolvimento / Cadastros | Lead / CompleteRegistration / VideoPlay | 1d click / 1d view |
| **MOFU** | 25-35% | Tráfego / Cadastros | Lead / ViewContent (VSL) / InitiateCheckout | 7d click / 1d view |
| **BOFU** | 25-40% | Conversões / Valor (ROAS) | Purchase / InitiateCheckout | 7d click / 1d view |

**Regra**: BOFU **sempre** otimiza para `Purchase` (valor) após 50+ compras/pixel. Antes: `InitiateCheckout`.

---

## 3. Metas por Métrica (Benchmarks Nicho Educação/Concursos)

| Métrica | Validação (Sem 1-2) | Otimização (Sem 3-6) | Escala (Mês 2+) | Maduro (Mês 6+) | Fonte Benchmark |
|---------|---------------------|----------------------|-----------------|-----------------|-----------------|
| **CPL (TOFU)** | < R$ 35 | < R$ 25 | < R$ 20 | < R$ 15 | Meta Ads Educação |
| **CPC (Link)** | < R$ 3.00 | < R$ 2.00 | < R$ 1.50 | < R$ 1.00 | — |
| **CTR (Link)** | > 0.8% | > 1.2% | > 1.5% | > 2.0% | — |
| **CAC Blended** | < R$ 300 | < R$ 200 | < R$ 180 | < R$ 150 | LTV 3-6x CAC |
| **ROAS 7d** | > 1.5 | > 2.5 | > 3.0 | > 4.0 | — |
| **ROAS 30d** | > 2.0 | > 3.0 | > 4.0 | > 5.0 | — |
| **Taxa Checkout** | > 1.5% | > 2.5% | > 3.5% | > 5.0% | — |
| **Lead → Compra (7d)** | > 0.5% | > 1.5% | > 2.5% | > 4.0% | — |
| **Lead → Compra (30d)** | > 2% | > 4% | > 6% | > 8% | — |
| **Frequência TOFU** | < 2.5 | < 3.0 | < 3.5 | < 4.0 | Fadiga criativo |
| **Frequência BOFU** | < 4.0 | < 5.0 | < 6.0 | < 7.0 | Retargeting tolera mais |

---

## 4. Projeção Financeira (Cenários)

### Cenário Base (Meta Mês 3)
| Métrica | Valor |
|---------|-------|
| Investimento Mês 3 | R$ 24.000 |
| CAC Blended | R$ 180 |
| Novas Assinaturas | 133 |
| Ticket Médio 1º pedido | R$ 150 |
| Receita 1º Mês (New) | R$ 19.950 |
| LTV 12m Estimado | R$ 800 |
| Receita Futura (Cohort) | R$ 106.400 |
| **ROI 12m (Cohort)** | **4.4x** |
| Payback CAC | Mês 2-3 |

### Cenário Otimista (CAC R$ 150, ROAS 5x)
| Métrica | Valor |
|---------|-------|
| Investimento Mês 3 | R$ 30.000 |
| Novas Assinaturas | 200 |
| Receita 1º Mês | R$ 30.000 |
| Receita Futura Cohort | R$ 160.000 |
| **ROI 12m** | **5.3x** |

### Cenário Conservador (CAC R$ 250, ROAS 2x)
| Métrica | Valor |
|---------|-------|
| Investimento Mês 3 | R$ 15.000 |
| Novas Assinaturas | 60 |
| Receita 1º Mês | R$ 9.000 |
| Receita Futura Cohort | R$ 48.000 |
| **ROI 12m** | **3.2x** |

---

## 5. Regras de Pacing (Automação Diária)

### 5.1 Regras de Aumento (Scale Up)
| Condição | Ação | Limite |
|----------|------|--------|
| ROAS 7d > 4.0 **E** CAC < R$ 160 **E** Frequência < 3 | +20% orçamento diário conjunto | Máx +50%/semana por conjunto |
| ROAS 7d > 5.0 **E** CAC < R$ 140 | +30% orçamento + duplicar conjunto (novo ID) | Máx 3 duplicatas/conjunto |
| CTR > 2% **E** CPL < R$ 15 (TOFU) | +15% orçamento TOFU | — |

### 5.2 Regras de Redução/Corte (Scale Down / Kill)
| Condição | Ação | Prazo |
|----------|------|-------|
| CAC > R$ 300 por 3 dias consecutivos | -30% orçamento conjunto | Imediato |
| CAC > R$ 400 por 5 dias | Pausar conjunto | Imediato |
| ROAS 7d < 1.5 por 7 dias | Pausar conjunto | Imediato |
| Frequência > 5 (TOFU) / > 7 (BOFU) | Trocar criativo OU -20% orçamento | 24h |
| CTR < 0.5% por 3 dias | Pausar criativo | Imediato |
| Gasto > 120% orçamento diário | Verificar bug / pausar se erro | Imediato |

### 5.3 Regras de Proteção (Safety)
- **Cap diário por conta**: R$ 5.000/dia (evita gasto runaway)
- **Cap por conjunto**: 30% orçamento diário total
- **Horário**: 6h-23h (pausar 23h-6h se CTR noturno < 50% diurno)
- **Fim de semana**: +20% orçamento Sáb/Dom (concurseiro estuda mais)

---

## 6. Alocação por Campanha (Exemplo Mês 2 - R$ 15k/mês)

| Campanha | Tipo | Orçamento Diário | % Total | Meta CAC | Meta ROAS |
|----------|------|------------------|---------|----------|-----------|
| `OA_TOFU_TRÁFEGO_FRIO_INTEREST_*` | TOFU Interest | R$ 75 | 15% | CPL < R$ 20 | — |
| `OA_TOFU_CADASTROS_LAL1_*` | TOFU LAL 1% | R$ 75 | 15% | CPL < R$ 25 | — |
| `OA_TOFU_CADASTROS_LAL3_*` | TOFU LAL 3% | R$ 50 | 10% | CPL < R$ 30 | — |
| `OA_MOFU_TRÁFEGO_ENG_*_VSL_*` | MOFU Retarget | R$ 75 | 15% | CAC < R$ 200 | ROAS > 2.5 |
| `OA_MOFU_CADASTROS_WEBINAR_*` | MOFU Webinar | R$ 25 | 5% | CPL < R$ 40 | — |
| `OA_BOFU_CONV_CHECKOUT_*` | BOFU Retarget | R$ 150 | 30% | CAC < R$ 150 | ROAS > 4.0 |
| `OA_BOFU_VALOR_LAL1_UPSELL_*` | BOFU Upsell | R$ 50 | 10% | CAC < R$ 100 | ROAS > 5.0 |
| **TOTAL** | | **R$ 500/dia** | **100%** | **Blended < R$ 180** | **Blended > 3.5** |

---

## 7. Pacing Semanal (Template Acompanhamento)

| Semana | Investimento Acumulado | CAC Blended (7d) | ROAS 7d | Novas Assinaturas | LTV Estimado Cohort | Ação |
|--------|------------------------|------------------|---------|-------------------|---------------------|------|
| 1 | R$ 1.050 | — | — | — | — | Validar pixel, criativos |
| 2 | R$ 2.100 | R$ 280 | 1.8x | 8 | R$ 6.4k | Otimizar TOFU |
| 3 | R$ 4.200 | R$ 220 | 2.4x | 19 | R$ 15.2k | Escalar LAL 1% |
| 4 | R$ 6.300 | R$ 190 | 2.8x | 33 | R$ 26.4k | Aumentar BOFU |
| 5 | R$ 9.000 | R$ 175 | 3.2x | 51 | R$ 40.8k | Testar Broad |
| 6 | R$ 11.700 | R$ 165 | 3.5x | 71 | R$ 56.8k | Estabilizar |
| 7 | R$ 15.000 | R$ 160 | 3.8x | 94 | R$ 75.2k | Preparar Mês 3 |
| 8 | R$ 19.500 | R$ 155 | 4.0x | 126 | R$ 100.8k | Escala Mês 3 |

---

## 8. Custos Ocultos / Buffer (Incluir no Orçamento Total)

| Item | Custo Estimado | Frequência |
|------|----------------|------------|
| Produção Criativos (Designer/Editor) | R$ 2.000-5.000/mês | Mensal |
| UGC Creators (5-10/mês × R$ 500-1.500) | R$ 3.000-10.000/mês | Mensal |
| Ferramentas (AdEspresso, Revealbot, Notion, CRM) | R$ 500-1.000/mês | Mensal |
| Comissão Afiliados UGC (20% recorrente) | Variável (~5-10% receita) | Contínuo |
| Buffer Teste Novos Formatos (TikTok, Google, Taboola) | 10-15% budget Meta | Trimestral |
| **Total Overhead Estimado** | **R$ 5.500-16.000/mês** | — |

**Orçamento Real Total (Mídia + Overhead)**: Mês 1: ~R$ 10-15k | Mês 3: ~R$ 30-45k

---

## 9. KPIs de Negócio (Além do Ads) — Alinhamento Marketing + Sales

| KPI | Meta Mês 3 | Meta Mês 6 | Responsável | Frequência Revisão |
|-----|------------|------------|-------------|-------------------|
| **MRR Novo (Marketing)** | R$ 20.000 | R$ 60.000 | Marketing | Semanal |
| **CAC Blended (Marketing+Sales)** | < R$ 180 | < R$ 150 | Marketing+Sales | Semanal |
| **LTV 12m** | > R$ 800 | > R$ 1.200 | Sales/CS | Mensal |
| **Churn Mensal** | < 8% | < 5% | Sales/CS | Semanal |
| **NRR (Net Revenue Retention)** | > 100% | > 120% | Sales/CS | Mensal |
| **Payback CAC** | < 3 meses | < 2 meses | Financeiro | Mensal |
| **Leads Qualificados (MQL→SQL)** | 500/mês | 1.500/mês | Marketing | Semanal |
| **Taxa SQL→Fechamento** | > 15% | > 25% | Sales | Semanal |

---

## 10. Calendário Sazonal - Picos de Investimento

| Período | Evento | Aumento Budget | Campanhas Específicas |
|---------|--------|----------------|----------------------|
| Jan-Fev | Ano Novo / "Vou passar esse ano" | +30% | "Sua missão 2026: Aprovação" |
| Mar-Abr | Pós-Carnaval / Editais PM estaduais | +50% | "Edital PM SP/RS/MG sai em 60d" |
| Mai-Jun | Meio de ano / Concursos federais | +20% | "Polícia Penal / PRF / PF" |
| Jul-Ago | Férias / Tempo livre estudo | +30% | "Estude nas férias: 2h/dia = 60h/mês" |
| Set-Out | 2º semestre / Editais GCM | +40% | "GCM [CIDADE] - Última chance 2026" |
| Nov | Black Friday | +100% (1 semana) | "Anual 25% off + Mentoria grátis" |
| Dez | Ano Novo antecipado | +20% | "Comece 2027 na frente" |

---

## 11. Relatório Executivo (Template Mensal)

```
MÊS [MM/AAAA] — META ADS OPERAÇÃO APROVAÇÃO

INVESTIMENTO: R$ XX.XXX (Budget: R$ XX.XXX | Execução: XX%)
CAC BLENDED: R$ XXX (Meta: < R$ XXX | Δ: +XX%)
ROAS 7d: X.Xx (Meta: > X.Xx | Δ: +XX%)
ROAS 30d: X.Xx (Meta: > X.Xx)

NOVAS ASSINATURAS: XXX (Meta: XXX)
MRR NOVO: R$ XX.XXX
LTV COHORT 30d: R$ X.XXX

TOP 3 CRIATIVOS:
1. [Nome] - CTR X.X% | CAC R$ XXX | Gasto R$ X.XXX
2. [Nome] - CTR X.X% | CAC R$ XXX | Gasto R$ X.XXX
3. [Nome] - CTR X.X% | CAC R$ XXX | Gasto R$ X.XXX

PIOR 3 CRIATIVOS (PAUSADOS):
1. [Nome] - CTR X.X% | CAC R$ XXX
2. [Nome] - CTR X.X% | CAC R$ XXX

TESTES CONCLUÍDOS:
- [Teste] → Vencedor: [Variante] → Aplicado em [Campanhas]

PRÓXIMAS SEMANAS:
- [Ação 1]
- [Ação 2]
- [Teste planejado]

RISCOS: [ex: Frequência BOFU subindo, Edital PM SP atrasado, Concorrente agressivo]
```

---

*Atualizar metas a cada mês com dados reais. Benchmark: CAC educação digital BR R$ 150-300. Nosso diferencial (sistema + gamificação) deve nos colocar no terço inferior.*