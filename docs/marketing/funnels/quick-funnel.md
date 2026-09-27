# Funil Rápido (Direct Response) — Operação Aprovação

> Anúncio direto para Página de Vendas (BOFU) → Checkout
> Para tráfego quente (retargeting, LAL 1%, leads quentes) e testes de oferta direta.

---

## 1. Estrutura Simplificada

```
META AD (BOFU)                    SALES PAGE                    CHECKOUT
─────────────────                 ─────────────                 ─────────
                                                                               
   │                                     │                              │
   ▼                                     │                              │
┌─────────┐                              │                              │
│  AD     │ ───Clique (UTM:              │                              │
│ (Offer) │     campaign=BOFU_...) ────▶ │                              │
└─────────┘                              │                              │
                                         ▼                              │
                                  ┌─────────────┐                       │
                                  │  SALES PAGE │                       │
                                  │  (Long-form │                       │
                                  │   ou VSL)   │                       │
                                  └──────┬──────┘                       │
                                         │                              │
                                         ▼                              ▼
                                  ┌─────────────┐                ┌─────────────┐
                                  │  CHECKOUT   │ ───Compra────▶ │ THANK YOU   │
                                  │  (Stripe/MP)│                │  PAGE +     │
                                  └─────────────┘                │ ONBOARDING  │
                                                                 └─────────────┘
```

---

## 2. Quando Usar

| Cenário | Público | Objetivo |
|---------|---------|----------|
| **Retargeting Quente** | `CHECKOUT_START_7D`, `CHECKOUT_VISIT_3D`, `VIDEO_95_30D` | Recuperar quase-compradores |
| **LAL 1% Compradores** | `LAL_COMPRADORES_1` | Aquisição direta (alta intenção) |
| **Leads Quentes CRM** | `CRM_LEADS_QUENTES` (Score > 70) | Conversão direta sem email sequence |
| **Teste Oferta Nova** | Qualquer | Validar preço/stack/bônus rápido |
| **Sazonal (Pré-Edital)** | Broad + Interest + LAL | Volume máximo janela curta |

---

## 3. Página de Vendas Otimizada para Funil Rápido

**Diferenças vs. Funil Principal**:
- **Hero**: Oferta direta no headline ("Teste 7 dias grátis — Garantia 30d")
- **Prova Social**: No topo (acima da dobra) — números + 1 case curto
- **Demo**: GIFs auto-play (não vídeo longo) — 3 features principais
- **Oferta**: Tabela comparativa Anual vs Mensal vs Concorrente — destaque Anual
- **Garantia**: Box destacado + "Cancel 1 clique" + "Sem cartão no teste"
- **CTA Sticky**: Fixo no mobile — "Começar teste 7 dias grátis"
- **FAQ**: Só 6 objeções top (preço, tempo, confiança, garantia, suporte, "já comprei")
- **Removido**: Problema/agitação longo, histórias longas, multiple CTAs

**Wireframe Mobile (Acima da Dobra)**:
```
[LOGO]                    [X] Fechar
┌─────────────────────────────────────┐
│  TESTE 7 DIAS GRÁTIS                │  ← Headline + Benefício
│  Plataforma completa: Cursos +      │  ← Subheadline (3 bullets)
│  Simulados + Flashcards + Ranking   │
│  ✅ 12.847 ativos  ✅ 94% renovam   │  ← Prova social mini
│  ✅ Garantia 30 dias  ✅ Cancel 1cl │
├─────────────────────────────────────┤
│  [DEMO GIF: Plano IA → Player →     │  ← Auto-play loop
│   Flashcard → Ranking]              │
├─────────────────────────────────────┤
│  🎁 BÔNUS HOJE: Mentoria 30min +    │  ← Urgência real
│  Revisão de Véspera PM SP           │
│  ⏰ Expira em 23:45:12              │
├─────────────────────────────────────┤
│  [BOTÃO AMARELO FIXO]               │  ← Sticky CTA
│  COMEÇAR TESTE 7 DIAS GRÁTIS        │
└─────────────────────────────────────┘
```

---

## 4. Criativos para Funil Rápido (BOFU)

### Estático "Oferta Direta"
| Elemento | Copy |
|----------|------|
| Headline | "Teste 7 dias grátis. Garantia 30 dias. Cancel 1 clique." |
| Subheadline | "Plataforma completa: Cursos curados + Simulados CESPE/FGV + Flashcards IA + Ranking na sua cidade." |
| Visual | Dashboard print (streak, ranking, XP) + Badge "Teste grátis" + Badge "Garantia 30d" |
| CTA | "Começar teste grátis" |

### Reels "Demo Rápida 15s"
| Tempo | Visual | Legenda |
|-------|--------|---------|
| 0-2s | Tela: Botão "Gerar plano" → Plano aparece | "Plano em 30s." |
| 2-5s | Player vídeo: Barra tempo real sobe | "Tempo VÁLIDO real." |
| 5-8s | Flashcard swipe: Acerta → XP sobe | "Flashcard espaçado." |
| 8-11s | Ranking: "PM SP • Você #247" | "Ranking na sua cidade." |
| 11-15s | Botão "Teste 7 dias grátis" + Logo | "Link na bio. Risco zero." |

---

## 5. Métricas Específicas Funil Rápido

| Métrica | Meta | Alerta Se |
|---------|------|-----------|
| **CTR Ad → Sales Page** | > 2.0% | < 1.0% |
| **Taxa Sales Page → Checkout** | > 5% | < 3% |
| **Taxa Checkout → Purchase** | > 4% | < 2.5% |
| **CAC Funil Rápido** | < R$ 150 | > R$ 200 |
| **ROAS 7d** | > 4.0x | < 3.0x |
| **% Compras PIX** | > 60% | < 40% |

---

## 6. Otimizações Específicas

1. **Pré-carregamento Checkout**: Link ad → `?preload=checkout` → Service Worker pré-carrega Stripe/MP JS
2. **UTM Persistente**: `localStorage.setItem('utm', params)` → Recupera no checkout se navegar
3. **Popup Saída (Exit Intent)**: "Espera! Teste 7 dias sem cartão. [Botão]" — só desktop
4. **Timer Real**: Cookie `offer_expires` + Servidor — não reseta no refresh
5. **WhatsApp Float**: Botão flutuante "Dúvida? Fala no WhatsApp" — 10s após scroll 50%

---

## 7. Orçamento Sugerido (Porcentagem Total)

| Fase | % Budget Total | Observação |
|------|----------------|------------|
| Validação | 15% | Testar oferta direta vs funil principal |
| Otimização | 25% | Retargeting quente + LAL 1% |
| Escala | 35-40% | BOFU vira motor principal de volume |
| Sazonal | 50%+ | Janela curta, oferta agressiva |

---

*Documento complementar ao `main-funnel.md`. Usar em conjunto.*