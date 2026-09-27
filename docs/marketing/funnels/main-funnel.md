# Funil Principal — Operação Aprovação

> Funil completo: Lead Magnet → Email Sequence → VSL/Webinar → Oferta → Checkout → Onboarding
> Integrado com Meta Ads (TOFU/MOFU) + Email CRM + Sales (WhatsApp para leads quentes)

---

## 1. Visão Geral do Funil

```
META ADS (TOFU)                    CRM (EMAIL/WHATSAPP)              SITE/APP                    SALES
─────────────────                  ─────────────────────             ─────────                    ─────
                                                                               
   │                                     │                              │                           │
   ▼                                     │                              │                           │
┌─────────┐                              │                              │                           │
│  AD     │ ───Clique (UTM)────────────▶ │                              │                           │
│ (Creative)                             │                              │                           │
└─────────┘                              │                              │                           │
   │                                     │                              │                           │
   ▼                                     │                              │                           │
┌─────────────────┐                      │                              │                           │
│ LANDING PAGE    │                      │                              │                           │
│ LEAD MAGNET     │                      │                              │                           │
│ (Opt-in)        │                      │                              │                           │
└────────┬────────┘                      │                              │                           │
         │ Lead (email/WhatsApp)         │                              │                           │
         ▼                               │                              │                           │
    ┌─────────┐                          │                              │                           │
    │ THANK   │                          │                              │                           │
    │ YOU PAGE│                          │                              │                           │
    │ + Pixel │                          │                              │                           │
    └────┬────┘                          │                              │                           │
         │                               │                              │                           │
         ▼                               ▼                              │                           │
    ┌─────────────────────────────────────────────┐                     │                           │
    │           EMAIL SEQUENCE (5-7 dias)         │                     │                           │
    │  Dia 0: Entrega Lead Magnet                 │                     │                           │
    │  Dia 1: Educação (Por que 78% erram)        │                     │                           │
    │  Dia 2: Prova Social (Case Carlos)          │                     │                           │
    │  Dia 3: Mecanismo (Tempo Real + Ranking)    │                     │                           │
    │  Dia 4: Oferta Suave (VSL/Webinar)          │                     │                           │
    │  Dia 5: Urgência (Bônus expira)             │                     │                           │
    │  Dia 7: Última chance / Downsell            │                     │                           │
    └─────────────────────┬───────────────────────┘                     │                           │
                          │                                             │                           │
         ┌────────────────┼────────────────┐                            │                           │
         ▼                ▼                ▼                            ▼                           │
   ┌─────────┐      ┌──────────┐    ┌──────────┐               ┌──────────┐                          │
   │ ABRIU   │      │ CLICOU   │    │ NÃO ABRIU│               │ WHATSAPP │ (Score > 50)             │
   │ EMAIL   │      │ VSL LINK │    │ 3+ EMAILS│               │ OUTREACH │                          │
   └────┬────┘      └────┬─────┘    └────┬─────┘               └────┬─────┘                          │
        │                │               │                          │                                  │
        ▼                ▼               ▼                          ▼                                  │
   ┌─────────┐      ┌──────────┐    ┌──────────┐            ┌──────────┐                            │
   │ SCORE   │      │ SCORE    │    │ REENGAGE │            │ QUALIFY  │                            │
   │ +10     │      │ +25      │    │ SEQUENCE │            │ CALL     │                            │
   └────┬────┘      └────┬─────┘    └────┬─────┘            └────┬─────┘                            │
        │                │               │                          │                                  │
        ▼                ▼               ▼                          ▼                                  │
        │         ┌──────────────┐       │                  ┌──────────────┐                         │
        └────────▶│  VSL PAGE    │◀──────┘                  │  SALES CALL  │                         │
                  │  (3-5 min)   │                          │  (15-20 min)│                         │
                  └──────┬───────┘                          └──────┬───────┘                         │
                         │                                         │                                  │
                         ▼                                         ▼                                  │
                  ┌──────────────┐                          ┌──────────────┐                         │
                  │ CHECKOUT     │                          │ CHECKOUT     │                         │
                  │ (Auto-serviço)│                         │ (Assistido)  │                         │
                  └──────┬───────┘                          └──────┬───────┘                         │
                         │                                         │                                  │
                         └─────────────────┬─────────────────────┘                                  │
                                           ▼                                                          │
                                  ┌──────────────────┐                                               │
                                  │   PURCHASE       │                                               │
                                  │   (Pixel + CRM)  │                                               │
                                  └────────┬─────────┘                                               │
                                           │                                                          │
                                           ▼                                                          │
                                  ┌──────────────────┐                                               │
                                  │ ONBOARDING       │                                               │
                                  │ (Email 30 dias)  │                                               │
                                  └──────────────────┘                                               │
```

---

## 2. Lead Magnets (TOFU → Entrada Funil)

| Lead Magnet | Avatar | Formato | Promessa | Página | Meta Conversão |
|-------------|--------|---------|----------|--------|----------------|
| **LM-01: Cronograma 30 Dias PM** | Iniciante | PDF + Notion Template | "Seu plano dia a dia pro concurso PM — gera em 30s na plataforma" | `/lm/cronograma-pm` | 25% |
| **LM-02: Diagnóstico Gaps Simulado** | Recomeçando | Quiz + PDF Personalizado | "Descubra exatamente quais matérias você erra — em 10 min" | `/lm/diagnostico-gaps` | 20% |
| **LM-03: Plano 45min/Dia Trabalhador** | Trabalhador | PDF + Planilha | "Rotina real de quem trabalha 8h e passa — adapta pro seu horário" | `/lm/plano-45min` | 22% |
| **LM-04: Kit Flashcards Essenciais** | Todos | PDF 50 cards + Deck App | "50 flashcards das matérias que MAIS caem (CESPE/FGV)" | `/lm/flashcards-essenciais` | 18% |
| **LM-05: Aula Grátis: "Como Passar com 1h"** | Todos | Vídeo 15min + PDF Resumo | "Método completo: Foco real + Plano IA + Simulados de banca" | `/lm/aula-gratis` | 15% |

**Tecnologia**: Landing Pages Next.js (Server Components) + Formulário React Hook Form + Zod → API Route → CRM (ActiveCampaign/HubSpot) + Pixel `CompleteRegistration` + `Lead` event.

---

## 3. Thank You Page (Imediato Pós-Optin)

**Elementos Obrigatórios**:
1. **Entrega Imediata**: Botão "Baixar Agora" / "Acessar Notion" / "Ver Vídeo"
2. **Próximo Passo Claro**: "Assista à aula grátis de 15min: 'Como passar estudando 1h/dia'" → Link VSL
3. **Prova Social Mini**: "12.847 concurseiros já baixaram. 94% renovam."
4. **Convite WhatsApp**: "Quer ajuda pra montar seu plano? Fala com nosso time no WhatsApp" → `wa.me/5511999999999?text=Olá,+baixei+o+[LEAD_MAGNET]`
5. **Pixel Events**: `ViewContent` (Thank You), `Lead` (já no optin), `InitiateCheckout` (se clicar VSL)

---

## 4. Email Sequence (5-7 Dias) — Detalhamento

### Dia 0 (Imediato) — Entrega + Boas-vindas
- **Assunto**: "Seu [NOME LEAD MAGNET] chegou 📅" (Taxa abertura > 45%)
- **Pré-header**: "Seu plano personalizado + bônus surpresa dentro"
- **Corpo**: 
  - Link direto download/acesso
  - "Responde este email: Qual seu maior desafio hoje? (Leio todos)"
  - P.S.: "Preparei uma aula grátis de 15min mostrando o método completo. [Link VSL]"
- **CTA Principal**: Baixar/Acessar Lead Magnet
- **CTA Secundário**: Ver aula grátis

### Dia 1 — Educação / Agitação Dor
- **Assunto**: "Por que 78% dos concurseiros estudam errado (não é preguiça)"
- **Hook**: "Você senta, abre o PDF, 10 min depois tá no Instagram. Fecha. Abre vídeo. 5 min depois WhatsApp. Fim do dia: 'Estudei 3h'. Realidade: 42min foco."
- **Conteúdo**: Explicação gap "tempo gasto vs tempo válido" + intro heartbeat technology
- **Prova**: Print dashboard tempo real vs chute
- **CTA**: "Ver meu tempo real de foco (teste 7 dias grátis)"

### Dia 2 — Prova Social / Case
- **Assunto**: "Como Carlos passou na PM com 1h/dia (trabalhando 8h) 🎖️"
- **Story**: Carlos, 28, segurança privada, estuda 45min almoço + 20min ônibus + 25min noite. Streak 87 dias. Aprovado PM SP.
- **Detalhes**: Print aprovação + Print dashboard (streak, ranking, XP)
- **CTA**: "Ver método do Carlos (aula grátis 15min)"

### Dia 3 — Mecanismo Único / Diferenciação
- **Assunto**: "O segredo não é estudar MAIS. É estudar O QUE CAI + medir FOCO."
- **Bullets**: 
  - ✅ Tempo Válido Real (Heartbeat) — não chute
  - ✅ Ranking por concurso + cidade — benchmark real
  - ✅ Simulados CESPE/FGV/VUNESP corrigidos na hora
  - ✅ Flashcards SM-2 — revisão na hora exata
  - ✅ Plano IA — gera cronograma em 30s
  - ✅ Streak + XP + Níveis — dopamina saudável
- **CTA**: "Testar sistema completo 7 dias grátis"

### Dia 4 — Oferta Suave (VSL/Webinar)
- **Assunto**: "Aula grátis: 'Sistema completo pra passar em 2026' 🎬"
- **Conteúdo**: Convite VSL (3-5 min) ou Webinar agendado
- **Stack Valor**: "Na aula você vê: Plano IA ao vivo + Simulado corrigido + Ranking real + Garantia 30d"
- **Urgência Leve**: "Bônus 'Revisão de Véspera' só pra quem assiste hoje"
- **CTA**: "Assistir agora / Reservar vaga"

### Dia 5 — Urgência / Bônus Expira
- **Assunto**: "Últimas horas: Bônus 'Revisão de Véspera' expira à meia-noite ⏰"
- **Conteúdo**: Timer real (cookie + servidor) — bônus expira em 24h
- **Stack**: Anual + Mentoria 30min + Material Impresso + Revisão de Véspera
- **Garantia**: "Testa 7 dias. Se não ver evolução real, devolvemos 100%. Cancel 1 clique."
- **CTA**: "Garantir minha vaga com bônus"

### Dia 7 — Última Chance / Downsell
- **Assunto**: "Ainda em dúvida? Teste mensal por R$ 197 (cancele quando quiser)"
- **Conteúdo**: Downsell para mensal (sem compromisso anual) + Garantia 30d reforçada
- **Prova**: "94% renovam. Mas se você for nos 6%, cancela com 1 clique. Sem risco."
- **CTA**: "Começar teste mensal 7 dias grátis"

---

## 5. VSL Page / Webinar (MOFU → BOFU)

### VSL (Video Sales Letter) — 3-5 min
**Estrutura**:
1. **Hook (0-15s)**: "Para de chutar 'estudei 3h'. Veja seu foco REAL."
2. **Problema (15-45s)**: Gap tempo gasto vs válido + desorganização + ansiedade
3. **Solução (45-90s)**: Demo rápida: Plano IA → Player heartbeat → Flashcard → Ranking → Streak
4. **Prova (90-120s)**: Case Carlos + Ana + Números agregados
5. **Oferta (120-180s)**: Stack valor + Garantia 30d + Bônus urgência
6. **CTA (180s+)**: "Teste 7 dias grátis" → Botão checkout

**Técnico**: Vídeo hospedado (Mux/Cloudflare Stream) + Legendas queimadas + Player custom (controles) + Eventos GA4: `video_start`, `video_progress_25/50/75/100`, `video_complete`, `cta_click`.

### Webinar (Alternativa VSL) — 45-60min Ao Vivo/Gravado
**Título**: "Como montar seu sistema de aprovação em 2026 (mesmo trabalhando)"
**Estrutura**:
- 10min: Apresentação + Dor + Mercado
- 20min: Demo ao vivo plataforma (Plano IA + Simulado + Ranking)
- 10min: Cases aluno + Q&A chat
- 10min: Oferta + Bônus ao vivo (ex: "Quem entra agora ganha mentoria 30min")
- 5min: Fechamento + Link checkout no chat

---

## 6. Checkout (BOFU) — Otimização Conversão

### Fluxo Auto-serviço (Principal)
```
Pricing Page → Seleciona Plano (Anual Destaque) → Checkout Stripe/Mercado Pago
    → Sucesso → Thank You Page (Onboarding imediato) → Email Dia 0
```

**Elementos Checkout**:
- **Order Bump** (Checkbox): "Adicionar Mentoria Planejamento 30min por R$ 97" (Conversão ~15-20%)
- **PIX Destaque**: 10% off + "Aprovação imediata" + QR Code grande
- **Cartão**: 12x sem juros + Apple/Google Pay (1-clique)
- **Garantia Visível**: "30 dias estude ou devolvemos • Cancele 1 clique"
- **Prova Social**: "12.847 ativos • 94% renovam • Nota 4.9/5"
- **Trust Badges**: SSL, LGPD, Reclame Aqui RA1000, CNPJ

### Fluxo Assistido (Leads Quentes Score > 70)
```
Lead Quente → WhatsApp Sales (SDR) → Qualificação 5min → Link Checkout Personalizado
    → Acompanha pagamento → Onboarding assistido
```

**SLA WhatsApp**: < 5 min dia útil | < 30 min fim de semana/noite

---

## 7. Pós-Compra Imediato (Thank You Page + Email)

### Thank You Page (Pós-Purchase)
1. **Confirmação**: "Compra aprovada! Acesso liberado." + Botão "Entrar na Plataforma"
2. **Onboarding Imediato**: "Passo 1: Gere seu plano (30s) → Passo 2: Primeira aula (15min) → Passo 3: Flashcards (10min)"
3. **Upsell One-Click** (Order Bump Pós-Compra): "Quer turma VIP com cronograma + acompanhamento semanal? 50% off só hoje: R$ 1.997 → R$ 997" → Timer 15min
4. **Convite Comunidade**: "Grupo VIP WhatsApp/Telegram (aprovados + mentores)" → Link convite
5. **WhatsApp Suporte**: "Dúvida? Fala comigo: wa.me/5511999999999"

### Email Dia 0 (Pós-Compra)
- **Assunto**: "Bem-vindo à Operação Aprovação! 🎖️ Seu acesso está liberado."
- **Corpo**: Login + Senha temporária + Link "Primeiro acesso" + "Sua missão hoje: Gerar seu plano (leva 30s)" + Link direto dashboard
- **Suporte**: "Responde este email ou WhatsApp se travar em qualquer passo."

---

## 8. Onboarding 30 Dias (Retenção / Ativação)

| Dia | Email / Ação | Objetivo | Métrica Sucesso |
|-----|--------------|----------|-----------------|
| 0 | Email boas-vindas + Login | Ativação imediata | Login Day 0 > 80% |
| 1 | Push/WhatsApp: "Gerou seu plano?" | Primeira ação chave | Plano gerado Day 1 > 60% |
| 3 | Email: "Primeira aula completa = +100 XP" | Primeira vitória | Aula concluída Day 3 > 40% |
| 7 | Email: "Streak 7 dias = Recruta → Aspirante" | Gamificação hook | Streak 7d > 30% |
| 14 | Email: "Diagnóstico grátis: Seus gaps + plano ajustado" | Valor contínuo | Agendamento call > 15% |
| 21 | Email: "Seu ranking subiu: #XXX → #YYY" | Progresso visível | Login Day 21 > 50% |
| 30 | Email: "30 dias de plataforma. NPS: 0-10?" | Feedback + Renovação | NPS > 50 | Resposta > 20% |

**Automações Comportamentais** (Paralelo):
- Inativo 3d → Push: "Sua streak tá em risco! 15min modo foco salva ela."
- Inativo 7d → Email Reengajamento (Sequência 3 emails)
- Concluiu módulo → Email: "Módulo completo! +500 XP. Próximo: [Matéria]"
- Streak quebrado → Email: "Quebrou a streak? Volta com 15min. Não zera o progresso."

---

## 9. Métricas do Funil (Dashboard Semanal)

| Etapa | Métrica | Meta | Ferramenta |
|-------|---------|------|------------|
| **Ad → Landing** | CTR Link | > 1.2% | Meta Ads |
| **Landing → Lead** | Taxa Conversão | > 25% | GA4 + CRM |
| **Lead → Email Aberto** | Open Rate (Dia 0) | > 45% | CRM |
| **Lead → Clique VSL** | CTR Email (Dia 1-4) | > 8% | CRM |
| **VSL → Checkout** | Taxa Conversão VSL | > 3% | GA4 |
| **Checkout → Purchase** | Taxa Conversão Checkout | > 3.5% | Stripe/MP + GA4 |
| **Lead → Purchase (7d)** | Conversão Funil Curto | > 1.5% | CRM + Pixel |
| **Lead → Purchase (30d)** | Conversão Funil Longo | > 4% | CRM + Pixel |
| **CAC Blended** | Custo por Assinatura | < R$ 180 | Financeiro |
| **ROAS 30d** | Retorno Investimento | > 4.0x | Meta + CRM |
| **Onboarding Day 7** | % Ativado (streak 7+) | > 30% | App/DB |
| **Churn Mês 1** | Cancelamento 30d | < 8% | Stripe/CRM |

---

## 10. Integração Sales (WhatsApp/Call) — Leads Quentes

### Critério Lead Quente (MQL → SQL)
| Critério | Pontos | Ação |
|----------|--------|------|
| Abriu 3+ emails sequência | +15 | — |
| Clicou link VSL/Checkout | +25 | — |
| Visitou página checkout | +30 | — |
| Iniciou checkout (não completou) | +50 | WhatsApp IMEDIATO |
| Baixou 2+ Lead Magnets | +10 | — |
| Respondeu email ("Qual seu desafio?") | +20 | WhatsApp 2h |
| Score Total > 70 | — | **SQL → WhatsApp Outreach** |

### Script WhatsApp Outreach (Primeira Mensagem)
> "Oi [Nome], vi que você [baixou o cronograma / assistiu a aula / visitou o checkout]. Tudo bem?\n\nSou [Nome] da Operação Aprovação. Queria saber: qual seu concurso alvo e quanto tempo você tem pra estudar por dia?\n\nPosso te mandar um diagnóstico rápido dos seus gaps (grátis) e ver se nosso sistema faz sentido pra você. Sem compromisso.\n\nPode me dizer?"

### Follow-up WhatsApp (Se não responder)
- 30min: "Sem pressa! Quando der, me avisa. O diagnóstico é rapidinho."
- 2h: "Fica à vontade. Se preferir, posso mandar por email também."
- 24h: "Oi [Nome], só passando pra ver se recebeu. Qualquer coisa tô aqui."
- 72h: Move para sequência email reengajamento longo.

---

## 11. Recuperação Carrinho Abandonado (BOFU Paralelo)

| Tempo | Canal | Mensagem | Oferta |
|-------|-------|----------|--------|
| 30 min | Email + WhatsApp (se opt-in) | "Seu carrinho expira em 2h. Garanta seu desconto PIX 10%." | PIX 10% off |
| 2h | Email | "Ainda em dúvida? Garantia 30 dias + Bônus Revisão de Véspera." | Bônus |
| 24h | Email + WhatsApp | "Vi que não completou. Posso te ajudar? Responde aqui." | Suporte |
| 3d | Email | "Último aviso: Seu desconto PIX expira hoje. [Link direto]" | Urgência |
| 7d | Email | "Ainda quer passar no [CONCURSO]? Teste 7 dias grátis sem cartão." | Downsell Teste |

---

## 12. Checklist Implementação Técnica

- [ ] Landing Pages (5 Lead Magnets) — Next.js + RHF + Zod
- [ ] Thank You Pages dinâmicas (entrega imediata + pixel events)
- [ ] CRM Config: ActiveCampaign/HubSpot — Listas, Tags, Scores, Automações
- [ ] Email Sequences (5-7 emails × 5 Lead Magnets = 25-35 emails) — Templates responsivos
- [ ] VSL Page — Player custom + Legendas + Eventos GA4
- [ ] Webinar Setup — Zoom/StreamYard + Landing registro + Lembretes (24h, 1h, 10min)
- [ ] Checkout — Stripe + Mercado Pago + Order Bumps + Upsell Pós-Compra
- [ ] Pixel/CAPI — Events: ViewContent, Lead, InitiateCheckout, Purchase, CompleteRegistration
- [ ] WhatsApp Business API — Templates aprovados + Inbox compartilhado (SDR)
- [ ] Dashboard Funil — GA4 + CRM + Metabase/Looker Studio (visualização única)
- [ ] Testes A/B: Headline Landing, Email Subject, VSL vs Webinar, Checkout 1 vs 2 steps

---

*Próximo: `recovery-funnel.md` (carrinho abandonado detalhado) → `upsell-funnel.md` (pós-compra).*