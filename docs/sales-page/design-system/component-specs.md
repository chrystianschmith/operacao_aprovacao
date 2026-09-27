# Design System — Component Specs — Sales Page — Operação Aprovação

> Especificações visuais por componente (alinhamento com `page-architecture.md` e `body-sections.md`).

---

## 1. Button (Primário/CTA)

| Prop | Valor |
|------|-------|
| Filled: `bg cta` + `text cta-text` | amarelo (#f5b942) |
| Padding | 14px 24px |
| Radius | 12px |
| Font | 1rem / 700 |
| Min-height | 48px |
| Hover | bg `cta-hover` + translateY(-1px) |
| Focus | `outline: 2px cta` + offset 2px |
| Disabled | 60% opacidade |
| Loading | spinner 16px + label (aria-live) |

---

## 2. Card (Surface)

| Prop | Valor |
|------|-------|
| bg | `--color-bg-surface` |
| border | 1px `--color-border` |
| radius | 12px |
| padding | 16-24px |
| shadow | 0 1px 2px rgb(0 0 0 / 0.2) |
| Hover (interativo) | border cta + shadow 8px |

---

## 3. USP Grid Item

- Ícone 24px (Lucide) cor `success` (green) ou `cta` (amarelo) quando destaque.
- Título H3 + bullet 1-2 linhas.
- Área de toque separada do texto.

---

## 4. Testimonial (Carousel)

- Card com avatar (40px), nome, concurso-alvo, texto ≤ 3 linhas.
- `role="region"` `aria-roledescription="carrossel"`, `aria-live="polite"`.
- Controles: prev/next (48px targets) + dots.
- `prefers-reduced-motion`: sem autoplay; só navegação manual.

---

## 5. Pricing Table

- Linhas: feature ✅/❌. Destaque coluna **Anual** (borda cta + badge "Mais escolhido").
- Preço: `price` grande + `/mês` com nota `≈ R$ 166/mês`.
- CTA dentro da tabela: primário na coluna destaque, secundário nas demais.
- Mobile: cards empilhados; tabela vira bloco por plano.

---

## 6. Guarantee/TrustBadges

- Ícone 20px + label. Layout flex/wrap.
- Selaria fixa (SSL, PIX, Cartão, LGPD) no hero e na oferta.

---

## 7. Sticky CTA (Mobile)

- Barra fixed bottom: `bg surface/95` + blur + safe-area.
- Só após 30% scroll (IntersectionObserver) — visibilidade controlada por estado client.
- `prefers-reduced-motion`: sem slide, aparece discreto (fade) apenas.

---

## 8. Countdown Timer

- `role="timer"` + `aria-label="Tempo restante: ..."`.
- Não recarregar em cada tick (server-sync de valor no SSG; client decrementa).
- Escondido se JS off (noop fallback server time).
- Cor: amarelo (`cta`) para urgência.

---

## 9. FAQ (Accordion)

- `button` com `aria-expanded`/`aria-controls`.
- Ícone chevron rotaciona; painel max-height animado (reduced-motion: instantâneo).
- Um aberto por vez (uncontrolled interno a `single`).

---

## 10. Acessibilidade Global

- Skip-link `#skip-to-content`.
- `:focus-visible` presente em botões/links/inputs.
- Headings corretos; labels em todos inputs.
- `prefers-reduced-motion` respeitado nas animações.

---

*Próximo: `cro-plan.md` → `analytics-events.md` → `compliance-checklist.md`.*