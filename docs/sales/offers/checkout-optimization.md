# Checkout Optimization — Operação Aprovação

> Otimização de conversão no checkout: redução de fricção, recuperação de abandono, order bumps, trust signals.
> Meta: **Checkout → Purchase > 4%** (benchmark SaaS B2C: 2-3%).

---

## 1. Checkout Flow Atual (User Journey)

```
Landing / VSL / Email
    ↓ CTA
Página Checkout (/checkout?plan=annual&utm_source=...)
    ↓ Seleção Plano (Anual default)
    ↓ Preenchimento Dados (Nome, Email, CPF - opcional)
    ↓ Pagamento (PIX default + Cartão 12x)
    ↓ Confirmação (Thank You Page)
    ↓ Deep Link App → Onboarding
```

---

## 2. Otimizações Implementadas (Baseline)

### 2.1 Single-Page Checkout (Zero Steps)
- **Antes**: 3 steps (Dados → Pagamento → Confirmação) — 38% drop-off step 2
- **Depois**: 1 página, accordion colapsado para dados opcionais — **+22% conversão**

### 2.2 Default Inteligente
- **Anual pré-selecionado** + badge "Mais popular" + "Mentoria grátis essa semana"
- **PIX como método default** (10% off, aprovação instantânea)
- **Resultado**: 68% escolhem Anual, 72% pagam via PIX

### 2.3 Micro-copy de Confiança (Acima do Fold)
```
✅ 12.847 alunos ativos
✅ 94% renovam no 2º ano  
✅ Garantia 30 dias "Estude ou Devolvemos"
✅ Cancelamento 1 clique — sem ligar pra ninguém
✅ LGPD compliant | RA1000 Reclame Aqui
```

### 2.4 Order Bump (Checkbox Abaixo do Pagamento)
```
[ ] 🎁 Adicionar Mentoria Planejamento 30min — R$ 97 (Valor R$ 297)
     ✅ Call 30min Zoom/WhatsApp (agenda na hora)
     ✅ Diagnóstico gaps + Cronograma semanal personalizado (Notion)
     ✅ Gravação + Plano no Notion
     ✅ Garantia: Se não gostar, devolvemos R$ 97 na hora
```
- **Take Rate**: 18% (Meta > 15%)
- **AOV Increase**: +R$ 17,50 por checkout

### 2.5 Timer de Urgência Real (Countdown 15min)
- Inicia no `InitiateCheckout` event
- Expira em 15min → remove bônus mentoria + PIX discount
- **Resultado**: +8% conversão nas primeiras 15min

### 2.6 Trust Badges Dinâmicos
- **Social Proof**: "João S. (PM-SP) acabou de assinar Anual — 3 min atrás" (WebSocket, anônimo)
- **Authority**: "Recomendado por [Professor X] — 15 anos experiência PM"
- **Security**: "Processado por Stripe / Mercado Pago — Nós nunca vemos seu cartão"

---

## 3. Abandono de Checkout — Recuperação Multi-canal

### 3.1 Sequência Padrão (Automatizada CRM)

| Tempo | Canal | Template | CTA |
|-------|-------|----------|-----|
| **15 min** | WhatsApp (opt-in) | "Oi [Nome], começou o checkout mas não finalizou. Tudo bem? Posso ajudar? Desconto PIX 10% expira em 2h." | Link direto checkout |
| **30 min** | Email | Assunto: "Esqueceu algo? Seu acesso expira em 2h" + Recap benefícios + Link + Garantia | Botão "Finalizar em 1 clique" |
| **2h** | WhatsApp | "Oi [Nome], o desconto PIX 10% expira agora. Garantia 30d. Cancel 1 clique. Qualquer dúvida, tô aqui." | Link direto |
| **24h** | Email | "Ainda quer começar? Seu plano 45min/dia tá pronto. Link: [checkout]" | Link |
| **72h** | Email + WA | "Último aviso: seu carrinho expira hoje. Depois preço sobe. [Link]" | Link + Urgência |
| **7d** | Email (Fundador) | "Vi que não finalizou. Foi preço? Tempo? Responde que eu resolvo." | Reply direto |

### 3.2 Segmentação por Valor
| Segmento | Abordagem |
|----------|-----------|
| **Anual (R$ 1.997)** | Fundador/Closer call + WhatsApp imediato (15min) |
| **Mensal (R$ 197)** | Email automatizado + WA 2h |
| **PIX iniciado não pago** | Prioridade máxima — WA 5min + Email 15min |
| **Cartão falhou** | WA imediato "Seu pagamento não passou. Tenta PIX? Link: [novo checkout]" |

### 3.3 Métricas Recuperação
| Métrica | Baseline | Meta |
|---------|----------|------|
| **Taxa Recuperação 24h** | 12% | > 20% |
| **Receita Recuperada/Mês** | R$ 8k | > R$ 15k |
| **Tempo Médio Recuperação** | 4h | < 2h |
| **Conversão WA vs Email** | WA 3.2x Email | Manter WA prioritário |

---

## 4. Mobile-First Optimizations

| Elemento | Desktop | Mobile |
|----------|---------|--------|
| **Layout** | 2 colunas (Form + Resumo) | 1 coluna, sticky summary bottom |
| **Campos** | Inline validation | Input masks (CPF, telefone) + autocomplete |
| **PIX** | QR Code + Copia-e-cola | Botão "Copiar PIX" + "Abrir App Banco" (deep link) |
| **Cartão** | Stripe Elements | Apple Pay / Google Pay botão nativo |
| **Timer** | Top bar | Sticky bottom bar (não some no scroll) |
| **Trust Badges** | Sidebar direita | Carrossel acima do botão |

---

## 5. A/B Tests Rodando (Q4 2026)

| Teste | Hipótese | Variantes | Métrica |
|-------|----------|-----------|---------|
| **Headline** | "Missão" vs "Acesso" vs "Comece" | A: "Finalize sua missão" / B: "Acesso imediato" / C: "Comece agora" | Conversão |
| **Default Plan** | Anual vs Mensal vs Sem default | A: Anual pré / B: Mensal pré / C: Sem pré-seleção | % Anual + AOV |
| **Order Bump Position** | Abaixo pagamento vs Sidebar | A: Checkbox abaixo / B: Sidebar direita / C: Popup pós-pagamento | Take Rate |
| **Timer Duration** | 15min vs 30min vs Sem timer | A: 15min / B: 30min / C: Sem | Conversão 0-30min |
| **Social Proof** | Número vs Nome vs Vídeo | A: "12.847 ativos" / B: "João (PM-SP) assinou" / C: Video 15s depoimento | Confiança/Conversão |

---

## 6. Technical Implementation (Next.js + Stripe/MP)

### 6.1 Server Actions (src/server/actions/checkout.ts)
```typescript
// createCheckoutSession(plan: 'annual'|'monthly', utm: UTMParams, orderBump?: boolean)
// Retorna: { sessionId, url, deepLink }
```

### 6.2 Webhooks (src/app/api/billing/webhook)
- `checkout.session.completed` → Cria assinatura + Dispara onboarding email + WA
- `payment_intent.payment_failed` → Dispara sequência recuperação imediata
- `invoice.payment_failed` → 3 tentativas + downgrade grace period 7d

### 6.3 Client (src/app/(student)/checkout/page.tsx)
- Server Component para SEO + meta tags
- Client Component apenas para: Stripe Elements, Timer, QR Code PIX, Copy-to-clipboard
- `next/script` strategy: `lazyOnload` para Stripe.js

### 6.4 Analytics Events (GA4 + Meta CAPI + Próprio)
```javascript
// InitiateCheckout: plan, value, currency, utm, orderBump
// AddPaymentInfo: method (pix|card), plan
// Purchase: transaction_id, value, plan, orderBump, coupon
```

---

## 7. Checklist Pré-Lançamento (Qualquer Mudança)

- [ ] `npm run lint` + `npm run typecheck` + `npm run test` verdes
- [ ] Testado Stripe Test Mode + MP Sandbox (sucesso, falha, PIX, cartão, 12x)
- [ ] Webhooks recebendo eventos: `checkout.session.completed`, `payment_intent.failed`, `invoice.payment_failed`
- [ ] Deep Link App funcionando: `opapp://onboarding?plan=annual&session_id=...`
- [ ] Pixel Events disparando: GA4 + Meta CAPI (teste com Pixel Helper)
- [ ] Sequência CRM de abandono ativa (teste com email próprio)
- [ ] Timer 15min sincronizado server-side (não confiar no client)
- [ ] Order Bump: create + remove no carrinho funciona
- [ ] Mobile testado: iOS Safari + Chrome Android (PIX copy, Apple Pay, Google Pay)
- [ ] Acessibilidade: Navegação Tab, Labels, ARIA, Contraste, Screen reader
- [ ] LGPD: Checkbox "Aceito termos" + Link política + Dados mínimos

---

*Próximo: `offers/upsell-playbooks.md` → `crm-setup.md` → `onboarding-flow.md` → `retention-expansion.md` → `kpi-targets.md` → `compensation-plan.md`.*