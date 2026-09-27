# CTA Library — 10+ CTAs por Etapa do Funil — Operação Aprovação

> Biblioteca de call-to-actions mapeada por etapa do funil e tom. Reutilizada em `page.tsx`, email, WhatsApp, quiz.
> Regra: **micro-compromissos → macro-compromisso**. Sempre com destino/evento `analytics-events.md`.

---

## 1. CTAs Primários (macro — checkout)

| Nome | Copy | Uso (etapa) | Evento |
|------|------|-------------|--------|
| CTA-1 | `COMEÇAR TESTE DE 7 DIAS GRÁTIS` | Hero, seções 8-11, sticky | `click_cta_primary` |
| CTA-2 | `QUERO VER MEU PLANO GRÁTIS` | Hero (morno/quente, email) | `click_cta_plan` |
| CTA-3 | `CONTINUAR INSCRIÇÃO` | Retargeting quente | `click_cta_resume` |
| CTA-4 | `COMEÇAR AGORA` | Email quente, variante short | `click_cta_now` |
| CTA-5 | `ENTRAR PRA PRÓXIMA TURMA` | Prova social / ranking | `click_cta_turma` |

---

## 2. CTAs Secundários (micro — quebra de barreira)

| Nome | Copy | Uso | Evento |
|------|------|-----|--------|
| CTA-6 | `Ver como funciona ↓` | Hero → demo | `click_cta_how` |
| CTA-7 | `Ver plano[ário]` (anchor) | Navegação / tabela | `click_cta_plan_link` |
| CTA-8 | `Ver depoimentos` | Prova social | `click_cta_testimonials` |
| CTA-9 | `Falar no WhatsApp` | Suporte/objeção | `click_cta_wa` |
| CTA-10 | `Ler FAQ` | Início seção FAQ | `click_cta_faq` |

---

## 3. CTAs por Etapa do Funil

| Etapa | CTA dominante | Alternativo | Nota |
|-------|---------------|-------------|------|
| Frio (Meta Ads) | CTA-1 | CTA-6 | Primeiro tenta reduzir fricção → gera `initiate_checkout` |
| Morno (email) | CTA-2 | CTA-7 | Docs/plano como isca suave |
| Quente (retargeting/checkout) | CTA-3 | CTA-4 | Já tem intenção; somente reforçar |
| Pós-demo | CTA-1 | CTA-2 | Depois do walkthrough sempre há CTA macro |
| Pós-garantia | CTA-1 | CTA-9 | Garantia reduz risco → CTA macro |
| Final | CTA-4 | CTA-1 | Reforço da urgência sem duplicar botão 2x na mesma dobra |

---

## 4. CTAs pelo tom/contexto

| Contexto | Copy | Emoji/Cíunice |
|----------|------|---------------|
| Autoridade | `Ver meu plano personalizado` | — |
| Urgência | `Garantir vaga antes de [DD/MM]` | 🔒 (discreto) |
| Risco zero | `Começar grátis — cancele quando quiser` | — |
| Confiança social | `Entrar pra próxima turma` | — |
| Recuperação | `Retomar minha inscrição` | — |

---

## 5. Regras de Implementação (Letra de CTA)

1. **1 CTA principal por dobra**; no máximo 2 no geral (primário + secundário).
2. Botão primário: `font-semibold`, min-height 48px, `aria-label` explícito.
3. Sticky CTA mobile: sempre visível após 30% scroll, com `prefers-reduced-motion` respeitado.
4. CTAs de teste (morno) SEMPRE apontam para link com `utm_campaign` próprio.
5. Evento `analytics` atribuído por CTA (id único nos data-attributes).

---

## 6. Variações para A/B (primeiros 90 dias)

| Experimento | Variação A (controle) | Variação B | Métrica |
|-------------|----------------------|------------|---------|
| Hero CTA | CTA-1 "teste de 7 dias" | CTA-2 "ver meu plano" | CTR + iniciar_teste |
| Sticky CTA | "Começar agora" | "Continuar inscrição" | Resumption rate |
| Urgência | Timer de bônus visível | Sem timer (controle) | Checkout rate |
| CTA final | "Começar agora" | "Quero ver meu plano" | Final scroll conv. |
| Micro-CTA | "Ver como funciona" | "Ver preço" | Scroll depth |

---

*Próximo: `guarantee-copy.md` → `objection-faq.md`.*