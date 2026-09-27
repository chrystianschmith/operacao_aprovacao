# Design System — Spacing & Rhythm — Sales Page — Operação Aprovação

> Hierarquia vertical (whitespace) que guia o scroll e a conversão.

---

## 1. Sistema de Espaçamento (4px base)

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Ícone/linhas internas |
| `--space-2` | 8px | Gap entre elementos inline |
| `--space-3` | 12px | Padding interno de chips |
| `--space-4` | 16px | Padding interno cards |
| `--space-6` | 24px | Entre label e bloco |
| `--space-8` | 32px | Entre cards em grid |
| `--space-12` | 48px | Entre seções (mobile) |
| `--space-16` | 64px | Entre seções (desktop) |
| `--space-20` | 80px | Seções de destaque / breaks |

---

## 2. Ritmo Vertical por Seção

| Seção | Padding top/bottom (mobile) | Desktop |
|-------|------------------------------|---------|
| Hero | 64px t / 32px b | 96px / 48px |
| Problema | 48px / 48px | 80px / 80px |
| Solução/Demo | 48px / 48px | 80px / 80px |
| USP/Prova | 56px | 96px |
| Oferta | 64px | 96px |
| Garantia | 48px | 80px |
| FAQ | 48px | 80px |
| CTA Final / Rodapé | 64px | 96px |

**Regra**: seções com CTA recebem maior respiro (60% mais espaço que seções textuais).

---

## 3. Ritmo Interno (Molecular)

- Cards: `padding 16-24px`, `gap 12-16px`, radius `12px`.
- Bullets grid: `gap 16px`, 1 col mobile → 2 col tablet → 3 col desktop.
- CTA duplo no hero: `gap 16px`.

---

## 4. Mobile Usability (Thumb)

- Botões: `min-height 48px`, margem inferior de miss `8px`.
- Sticky CTA bottom: `padding 12px 16px + safe-area inset`.
- Estrutura de 1 col sempre (cards empilham).

---

*Próximo: `component-specs.md`.*