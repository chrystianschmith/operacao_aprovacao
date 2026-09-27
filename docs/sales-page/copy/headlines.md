# Headlines — 5+ Variações Testáveis — Operação Aprovação

> Framework de headlines para a página de vendas. 5 arquétipos testáveis + critérios de decisão.
> Regra: 1 teste por vez em `ab-test/config.ts`.

---

## 1. Variações (por arquétipo)

### V1 — **Big Promise** (Promessa grande)
```
PARA VOCÊ QUE VAI SER APROVADO EM PM SP: ESTUDE COM SISTEMA, NÃO COM SORTE.
```
**Sub**: "O método que organiza seu plano, simula CESPE/FGV e mede seu progresso real — em 30 min/dia."
**CTA**: Quero ver meu plano grátis →

### V2 — **Mecanismo Único** (sistema/diferencial)
```
A ÚNICA PLATAFORMA QUE MONTA SEU PLANO DE ESTUDO E **CORRIGE SEUS SIMULADOS** AUTOMÁTICAMENTE.
```
**Sub**: "Enquanto outros cursos empilham videoaulas, a Operação Aprovação vira seu sistema de preparação — do plano diário ao ranking da turma."
**CTA**: Começar teste de 7 dias →

### V3 — **Prova Social** (números)
```
12.847 CONCURSEIROS DE SEGURANÇA PÚBLICA JÁ ESTUDAM COM SISTEMA. E VOCÊ?
```
**Sub**: "2,4 milhões de horas válidas de estudo medidas. 94% renovam após o teste."
**CTA**: Entrar pra próxima turma →

### V4 — **Negativa** (para quem não é)
```
SE VOCÊ SÓ QUER "MARRAR" VIDEOAULA DE CURSO GRÁTIS, NÃO É PRA VOCÊ.
```
**Sub**: "Mas se você quer organização + constância + correção real, continua lendo."
**CTA**: Quero saber se é pra mim →

### V5 — **Curiosidade** (gap emocional)
```
A DIFERENÇA ENTRE QUEM PASSA E QUEM "ESTUDA HÁ TRÊS ANOS" NÃO É INTELIGÊNCIA.
```
**Sub**: "É planejamento. E ele se constrói em 30 segundos, no seu celular."
**CTA**: Ver como funciona →

---

## 2. Headlines de Apoio (variantes internas)

### 2.1 Para tráfego quente (email/retargeting)
```
SEU PLANO PRA [PM-SP 2026] JÁ ESTÁ PRONTO.
```
```
TESTE 7 DIAS GRÁTIS: VEJA O QUE VOCÊ IA FAZER HOJE À NOITE.
```

### 2.2 Angular por dor
```
CANSADO DE COMEÇAR TODO MÊS E NÃO CHEGAR NA PROVA?
```
```
SEU CONCORRENTE ESTUDA COM CORREÇÃO AUTOMÁTICA. E VOCÊ?
```

### 2.3 Pós-edital (urgência)
```
EDITAL [PM SP] PUBLICADO. O QUE VOCÊ FAZ NAS PRÓXIMAS 24H DEFINE STATUS.

```

---

## 3. Critérios de Teste (A/B)

| Critério | Métrica de sucesso | Quando vencer |
|----------|--------------------|---------------|
| V1 (Big Promise) | CTR hero → scroll + conversão fria | +15% fração fria |
| V2 (Mecanismo) | Tempo na página + Início teste | +10% iniciar_teste |
| V3 (Prova social) | Confiança early scroll | +5% scroll depth |
| V4 (Negativa) | Conversão de tráfego quente | +8% checkout |
| V5 (Curiosidade) | Scroll depth ≥ 75% | +10% depth |

**Levantar** (95% confiança, 2 semanas, mínimo 2k sessões/var): Variação vencedora vira base; compõe com a 2ª melhor em teste como combinação (ex: V2 headline + V3 no sub).

---

## 4. Regras de Ouro

- 1 H1 por página; demais headers hierárquicos.
- Headline sempre visível acima da dobra (mobile).
- Nunca headline com promessa que o produto não entrega (check compliance).
- Teste com `utm_campaign` idêntico; só variável de experimento muda.

---

*Próximo: `body-sections.md` → `bullets-usps.md` → `cta-library.md` → `guarantee-copy.md` → `objection-faq.md`.*