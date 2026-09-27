# CRO Plan — Roadmap de Testes A/B (90 dias) — Operação Aprovação

> Plano de experimentos priorizados para a página de vendas. Metodologia: 1 teste por vez, 95% confiança, 2 semanas, métrica única.

---

## 1. Princípios CRO

1. **Copy first**: antes de testar layout, testar mensagem (headline, USPs).
2. **Uma variável por teste** — nada de testar headline+cor+preço juntos.
3. **Métrica única por teste** — CTR, checkout, retenção inicial (7d).
4. **Não reinventar**: base em benchmark (landing educacional médio: conversão ~1-2% tráfego frio).
5. **Log reservado**: `utm_content` = experimento p/ atribuição.

---

## 2. Futuro de Testes (90 dias)

### Fase A — Mensagens (semanas 1-4)

| # | Experimento | Variável | H0 (controle) | Variação | Métrica de sucesso | Meta |
|---|-------------|----------|---------------|----------|--------------------|------|
| T1 | Headline Hero | H1 | Big Promise (V1) | Mecanismo (V2) | CTR hero→scroll + iniciar_teste | ≥ +10% |
| T2 | Headline sub | sub | "método ... plano" | "simulados ... correção" | TIME_ON_PAGE | ≥ +15s |
| T3 | CTA hero | botão | "teste de 7 dias" | "ver meu plano" | CTR+iniciar_teste | ≥ +10% |
| T4 | Prova social | top | números (12.847) | depoimento (1 real) | scroll+confiança | ≥ +8% |

### Fase B — Layout/Design (semanas 5-8)

| # | Experimento | Variável | Controle | Variação | Métrica | Meta |
|---|-------------|----------|----------|----------|---------|------|
| T5 | Ordem seções | fluxo | Demo antes de Oferta | Oferta antes de Prova social | checkout | ≥ +8% |
| T6 | Sticky CTA | comportamento | Fade pós 30% scroll | Barra fixa sempre | click_cta | ≥ +15% |
| T7 | Pricing tabela | layout | Tabela em linhas | Cards empilhados | iniciar_checkout | ≥ +10% |
| T8 | Garantia | posição | meio | logo após Hero | scroll depth | ≥ +10% |

### Fase C — Oferta/Urgência (semanas 9-12)

| # | Experimento | Variável | Controle | Variação | Métrica | Meta |
|---|-------------|----------|----------|----------|---------|------|
| T9 | Timer de bônus | urgência | com timer | sem timer | checkout | ≥ +12% |
| T10 | Preço âncora | tabela | Anual 1º | Mensal 1º | ticket+anual conv. | LTV+15% |
| T11 | Trial copy | texto | "7 dias grátis" | "30 dias risco zero" | iniciar_checkout | ≥ +10% |
| T12 | CTA final | copy | "Começar agora" | "Quero ver meu plano" | pós-scroll conv. | ≥ +8% |

---

## 3. Priorização

Peso = (Potencial impacto × Confiança) / Esforço
| Teste | Impacto | Confiança | Esforço | Prioridade |
|-------|---------|-----------|---------|------------|
| T1 | Alto | Alta | Baixo | 🔥 1 |
| T3 | Alto | Alta | Baixo | 🔥 1 |
| T9 | Alto | Média | Médio | 2 |
| T10 | Alto | Média | Baixo | 2 |
| T6 | Médio | Média | Baixo | 3 |
| T5 | Médio | Média | Médio | 3 |
| T7 | Médio | Baixa | Baixo | 4 |
| T8 | Baixo | Média | Baixo | 4 |

---

## 4. Infra (Implementação)

- `ab-test/middleware.ts`: bucketing por cookie `_oa_ab` (hash do usuário/experimento).
- `ab-test/config.ts`: lista de experimentos (ativo, % tráfego, variantes).
- Eventos enviados com `variant` no `analytics-events.md`.
- GA4/DataLayer: `experiment_id` / `variant` / `page` sempre presentes.

---

## 5. Leitura e Decisão

| Resultado | Decisão |
|-----------|---------|
| Variação vence (95%, 2 sem) | Promove → vira controle |
| Empate (no significance) | Mantém controle; 2ª{" "}rodada, senão descarta |
| Variação piora conversão | Reverte para controle, aprende hipótese |

**Regra**: nunca "trapear" com 99% confiança; meta de 95% sob mín 2k sessões por braço; usar CRO semanal para analisar.

---

## 6. Métricas Padrão (Guard-rail)

| Métrica | Função | Sinal alerta |
|---------|--------|--------------|
| CTR por tráfego | Primária | Desvio > 20% entre braços |
| Scroll depth | Secundária | Queda de engajamento |
| CTR de outros CTAs | Guard | Não deve cair com variação |
| Bounce | Guard | +10% = problema |
| Tempo de página | Contexto | Não pode cair |

---

*Próximo: `analytics-events.md`.*