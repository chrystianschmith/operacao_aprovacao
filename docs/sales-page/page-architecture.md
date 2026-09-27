# Sales Page — Arquitetura (Long-form VSL) — Operação Aprovação

> Wireframe textual e fluxo de seções da página de vendas principal.
> Copy-first, design-depois. Mobile-first. Testável (experimentos em `ab-test/`).

---

## 0. Resumo Executivo

| Item | Definição |
|------|-----------|
| **Rota** | `/sales` (long-form principal) + variantes `/sales/short`, `/sales/vsl`, `/sales/quiz` |
| **Objetivo** | Converter tráfego frio/morno (Meta Ads, email, retargeting) em assinantes |
| **Oferta principal** | Teste 7 dias → Plano anual R$ 1.997 (≈ R$ 166/mês) |
| **Device** | Mobile-first (70%+ do tráfego) |
| **Stack** | Next.js App Router (Server Components) + Tailwind + Shadcn/Radix |
| **Acessibilidade** | AAA auditável (foco visível, ARIA, contraste AA, `prefers-reduced-motion`) |

---

## 1. Estrutura da Página (Long-form) — 13 Seções

```
┌──────────────────────────────────────────────────────────┐
│ 0. STICKY TOP BAR (reduzida após scroll)                 │
│    Logo | [Link "Entrar"] | [CTA: Teste 7 dias grátis]   │
├──────────────────────────────────────────────────────────┤
│ 1. HERO (acima da dobra)                                 │
│    Kicker bancas → HEADLINE H1 → Subheadline → CTA prim. │
│    Prova social imediata (números) + selo de segurança   │
│    Video/gif curto de fundo (mute, lazy)                 │
├──────────────────────────────────────────────────────────┤
│ 2. PROBLEMA/AGITAÇÃO ("Você estuda e não avança?")       │
│    3 dores → custo da inação em cards                    │
├──────────────────────────────────────────────────────────┤
│ 3. SOLUÇÃO ("O sistema, não mais um cursinho")           │
│    O "veículo": plano + vídeos + simulados + flashcards  │
├──────────────────────────────────────────────────────────┤
│ 4. DIFERENCIAIS (USP Grid) — 6 cards                    │
│    Tempo válido real | Gamificação arcade | Ranking      │
│    Brainstorm | Modo foco | IA no plano                  │
├──────────────────────────────────────────────────────────┤
│ 5. PROVA SOCIAL — números + depoimentos (carrossel)      │
├──────────────────────────────────────────────────────────┤
│ 6. DEMO/WALKTHROUGH — GIFs curtas do produto            │
├──────────────────────────────────────────────────────────┤
│ 7. PARA QUEM NÃO É (qualificação negativa)               │
├──────────────────────────────────────────────────────────┤
│ 8. OFERTA + STACK DE VALOR — tabela comparativa          │
│    Mensal vs Anual vs Concorrente + Bônus                │
├──────────────────────────────────────────────────────────┤
│ 9. GARANTIA (7d Lei + 30d "estude ou devolvemos")        │
├──────────────────────────────────────────────────────────┤
│ 10. FAQ (8-12 objeções)                                  │
├──────────────────────────────────────────────────────────┤
│ 11. CTA FINAL (sticky móvel) + timer urgência real       │
├──────────────────────────────────────────────────────────┤
│ 12. RODAPÉ LEGAL — Termos, Privacidade, CNPJ, LGPD       │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Modelos de Tráfego × Seções Priorizadas

| Tráfego | Seções obrigatórias (prioridade) | CTA dominante |
|---------|----------------------------------|----------------|
| **Meta Ads (frio)** | 1 → 2 → 3 → 4 → 8 → 9 → 11 | "Teste 7 dias grátis" |
| **Email morno/quente** | 1 → 8 → 9 → 11 | "Começar agora" |
| **Retargeting** | 1 → 8 → 11 | "Continuar inscrição" |
| **Orgânico (SEO)** | 1 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 | Scroll natural |

---

## 3. Fluxo de Conversão (Micro→Macro)

```
Hero → Scroll Depth 25% → 50% → 75% → 100%
   ↓
CTA "Quero ver meu plano grátis" (micro)
   ↓
Preço/Stack visto (micro)
   ↓
CTA "Começar teste de 7 dias" (macro)
   ↓
InitiateCheckout → Purchase (acompanha em `analytics-events.md`)
```

**Regra**: CTAs duplicados no mobile sempre sticky bottom (não só no final).

---

## 4. Componentes (Reuso nos dashboard/features)

| Componente | Local | Responsabilidade |
|------------|-------|------------------|
| `Hero.tsx` | `sales/components` | Headline + sub + prova social + CTAs |
| `ProblemAgitation.tsx` | `sales/components` | 3 dores + custo da inação |
| `SolutionShowcase.tsx` | `sales/components` | O sistema completo (com gifs) |
| `USPGrid.tsx` | `sales/components` | 6 cards de diferenciais |
| `TestimonialCarousel.tsx` | `sales/components` | Depoimentos (com ARIA role=region) |
| `ProductDemo.tsx` | `sales/components` | Walkthrough com tabs |
| `PricingTable.tsx` | `sales/components` | Comparativo (reuso em pricing) |
| `GuaranteeSection.tsx` | `sales/components` | Selo + copy garantia |
| `FAQAccordion.tsx` | `sales/components` | Acordeão acessível (Radix) |
| `StickyCTA.tsx` | `sales/components` | Barra fixa mobile/desktop |
| `CountdownTimer.tsx` | `sales/components` | Timer de bônus (server-sync) |
| `TrustBadges.tsx` | `sales/components` | PIX, SSL, LGPD, bancas |

---

## 5. Dados Dinâmicos (Server Components)

- **Depoimentos/números**: vindos da UI de `src/server/services/admin` futuramente; para v1, de `src/mocks/data/` (centralizado, tipado — respeita CLAUDE.md §23).
- **Preço/bônus**: `src/config/business.ts` (fonte única com pricing; mantém coerência com `docs/sales/offers/pricing-strategy.md`).
- **Timer**: valor de bônus vem de cookie/`serverAction` (não só cliente) — anti-fraude.

---

## 6. Performance

- Imagens `.webp`/`avif`, `loading="lazy"` abaixo do fold, `fetchpriority="high"` no hero.
- `preconnect` para checkout e analytics.
- Font `font-display: swap`.
- LCP < 2,5s mobile (budget: 200KB JS inicial, split por seção).
- Botão slot para `CountdownTimer` (isola mesmo com JS desabilitado).

---

## 7. Testes A/B (Bucketing)

- Middleware (`ab-test/middleware.ts`) atribui bucket por cookie `_oa_ab` (hash do usuário + experimento).
- `ab-test/config.ts` centraliza experimentos ativos (flag + porcentagem + variantes).
- Nos experimentos: manter SEO canônico na variante controle (evita duplicated content).

---

## 8. Roteiro de SEO

- `metadata` completo: title, description, OG, Twitter, canonical.
- `schema.org` Course/Product JSON-LD.
- Sitemap: `/sales`, `/sales/short`.
- Noindex nas variantes de teste (short/vsl/quiz) ou erro na canonica.

---

## 9. Acessibilidade (Checklist por seção)

- Headings hierárquicos (1 h1 por página).
- `aria-expanded`/`aria-controls` nos accordions; botões com labels claros.
- Carrossel com `aria-roledescription="carousel"` + `aria-live="polite"`.
- Foco visível e `:focus-visible` em todos os botões.
- Contraste AA (ver `design-system/color-tokens.md`).
- Respeitar `prefers-reduced-motion` (confetti/timer sem animação forçada).

---

## 10. Dependências para publicação

- [ ] Copy aprovada (fundador + advogado) — `compliance-checklist.md`
- [ ] Eventos analytics configurados — `analytics-events.md`
- [ ] Pixel/CAPI + UTM no checkout — `../marketing/kpi-dashboard.md`
- [ ] Timer de bônus síncrono com servidor (Stripe/MP) — `checkout-optimization.md`
- [ ] LGPD: cookie banner + política — `compliance-checklist.md`

---

*Próximo: `copy/` → `design-system/` → `cro-plan.md` → `analytics-events.md` → `compliance-checklist.md`.*