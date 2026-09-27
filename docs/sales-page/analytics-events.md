# Analytics Events — Sales Page — Operação Aprovação

> Eventos padronizados para GA4 + Meta Pixel/CAPI + CRM (site → leads). Alinhado com `../marketing/kpi-dashboard.md` e `lead-scoring.md`.

---

## 1. Eventos de Página (Auto/Config)

| Evento | Trigger | Params |
|--------|---------|--------|
| `page_view` | Auto GA4 | `page_location: /sales*`, `page_referrer`, `utm_*` |
| `page_view_with_ab` | Hero/teste | `experiment_id`, `variant`, `utm_campaign` |
| `scroll_25` / `scroll_50` / `scroll_75` / `scroll_100` | Scroll depth | `page`, `section` |

---

## 2. Eventos de Interação (Manuais)

| Evento | Trigger | Params obrigatórios |
|--------|---------|---------------------|
| `click_cta` | Qualquer CTA | `cta_id` (CTA-1..CTA-10), `variant`, `page` |
| `view_pricing` | Tabela/plano visível | `plan_viewed` (annual/mensal) |
| `view_guarantee` | Seção garantia visível | — |
| `view_faq` | FAQ aberta | `faq_question_id` (Q1..Q12) |
| `video_watch` | VSL/hero video | `progress` (25/50/75/95) |
| `testimonial_view` | Card depoimento visível | `testimonial_id` |
| `chat_or_whatsapp` | Clique WhatsApp | `context` (hero/faq/sticky) |
| `timer_expired` | Bônus expira | `plan`, `campaign` |

---

## 3. Eventos de Micro-conversão

| Evento | Trigger | Param |
|--------|---------|-------|
| `start_test_intent` | Clique "7 dias grátis" | `plan` |
| `initiate_checkout` | Click em link checkout | `plan`, `price`, `currency` |
| `add_to_cart` | Se adicionar bump | `bump_id` |
| `checkout_abandoned` | Saída sem conclusão (30min) | `plan` |

---

## 4. Eventos de Conversão (não conectar à página — seg)

> **Resposta crítica**: eventos de compra vão via **CAPI/Server-side** (não só via browser). Inibir duplicidade (dedupe `transaction_id`).

| Evento | Trigger | Param |
|--------|---------|-------|
| `purchase` | CAPI (webhook checkout) | `value`, `currency`, `transaction_id`, `plan` |
| `refund` | CAPI (reembolso) | `transaction_id`, `amount` |
| `subscription_canceled` | CAPI | `plan`, `reason` |

---

## 5. Eventos de Retenção/Produto (para CRM)

| Evento | Trigger | Param |
|--------|---------|-------|
| `test_activated` | 1ª sessão ativa (login+heartbeat) | `user_id` |
| `streak_started` | 1º dia de streak | `user_id` |
| `module_completed` | Módulo 100% | `course`, `module` |

> Esses alimentam `health_score` e `lead-scoring` — ver `retention-expansion.md`.

---

## 6. Naming Convention

- All lowercase, snake_case.
- Préifixo por domínio: `click_`, `view_`, `start_`, `initiate_`, `purchase_`.
- Sem PII em params (email, telefone, CPF são proibidos em events GA4/Pixel).
- IDs sempre `snake_case` (CTA-1 → `cta_primary_hero`).

---

## 7. Implementação Referência (DataLayer)

```js
// composição expira apenas quando test ativo
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: 'click_cta',
  cta_id: 'cta_primary_hero',
  variant: 'v1_big_promise',
  page: '/sales',
  utm_campaign: window.__UTM?.campaign ?? null,
});
```

> Ligar via helper `trackSection(event, params)` em `src/lib/analytics.ts` (não importar GA4 hard de cada componente).

---

## 8. Qualidade

- Teste de events via console + GA4 DebugView.
- Verifique `experiment_id` em todos os páginas de teste.
- Relatório semanal: % eventos attrited, duplicates, missing UTM.
- Meta CAPI: dedupe por `event_id` (DoubleClickId/Pixel) — sem duplicação `purchase`.

---

*Último: `compliance-checklist.md`.*