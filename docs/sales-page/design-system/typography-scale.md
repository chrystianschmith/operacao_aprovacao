# Design System — Typography Scale — Sales Page — Operação Aprovação

> Escala tipográfica mobile-first, legível e de hierarquia clara para a página de vendas.
> Fonte: system stack (sans-serif) com fallback; usa `font-display: swap`.

---

## 1. Escala (Desktop → Mobile)

| Papel | Tamanho | Line-height | Weight | Uso |
|-------|---------|-------------|--------|-----|
| H1 (Hero) | clamp(2rem, 5vw, 3.5rem) | 1.1 | 800 | Headline única |
| H2 (Seção) | clamp(1.5rem, 3vw, 2.25rem) | 1.2 | 700 | Título seção |
| H3 (Card) | 1.125-1.375rem | 1.3 | 700 | Card/título bloco |
| Subhead | 1rem-1.25rem | 1.5 | 500 | Subheadline hero |
| Body | 1rem | 1.6 | 400 | Texto corrente |
| CTA Button | 1rem-1.125rem | 1 | 700 | Botões |
| Small/Label | 0.75-0.875rem | 1.45 | 500 | Chips, metadados, selos |
| Micro | 0.6875rem | 1.4 | 400 | Notas legais rodapé |

---

## 2. Mobile (Default) — Valores base

- `font-size: 16px` no `<html>` (evita zoom iOS).
- Body mobile: `16px/1.6`.
- H1 mobile: `clamp` min 2rem (32px).
- Não usar font-size < 12px para texto funcional.

---

## 3. Hierarquia Visual (Título → Silêncio)

```
H1 — maior contraste, espaçamento após 0.75em
H2 — 0.5em acima/abaixo
H3 — 0.25em acima
Body — quebras generosas (1.6)
CTA — caps lock opcional, 1.125rem, letter-spacing 0.01em
```

**Regra**: nunca 2 elementos de mesma hierarquia numa mesma dobra (ex: 2 H1).

---

## 4. Short Forms (variantes)

- Short-form mobile: H1 1.75rem, CTAs mais espaçados (thumb reach).
- VSL page: headline acima do vídeo (H2) + captions sync.

---

## 5. Acessibilidade Tipográfica

- Contraste AA (§color 2).
- `text-wrap: balance` para H1/H2.
- Sem `font-feature-settings` com impacto em leitura.
- `letter-spacing` moderado; evitar caps lock longos (>10 palavras).

---

*Próximo: `spacing-rhythm.md`.*