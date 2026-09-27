# Onboarding Flow — Operação Aprovação

> Fluxo completo do momento `Purchase` (Closed Won) até `Activated User` (Streak 7d + Plano Gerado + 1º Simulado).
> Objetivo: **Time-to-Value < 10 min** — usuário gera plano e inicia 1ª aula na 1ª sessão.

---

## 1. Definições de Sucesso (Onboarding Milestones)

| Milestone | Definição | Tempo Alvo | Métrica Sucesso |
|-----------|-----------|------------|-----------------|
| **M0: Purchase** | Pagamento confirmado (Stripe/MP) | T=0 | 100% |
| **M1: Account Ready** | Senha definida + Login app | < 2 min | > 95% |
| **M2: Plano Gerado** | Clicou "Gerar meu plano" + Plano salvo | < 5 min | > 85% |
| **M3: 1ª Ação Estudo** | Modo Foco 15min iniciado OU Flashcards 10+ | < 10 min | > 75% |
| **M4: Streak Dia 1** | XP ganho + Streak = 1 | Fim Dia 1 | > 70% |
| **M5: 1º Simulado** | Simulado completo (qualquer qtd questões) | < 7 dias | > 40% |
| **M6: Activated User** | Streak 7d + Plano ativo + 1 Simulado | < 14 dias | > 50% |

---

## 2. Fluxo Técnico (Backend → Frontend)

### 2.1 Webhook `checkout.session.completed` / `payment_intent.succeeded`
```mermaid
sequence
    Stripe/MP --> Webhook: payment_intent.succeeded
    Webhook --> CRM: Create/Update Contact (status=Active, plano, datas)
    Webhook --> App: Create Subscription (Prisma) + Grant Access
    Webhook --> Email/WA: Trigger "Onboarding Sequence" (D0)
    Webhook --> App: Generate Deep Link `opapp://onboarding?session_id=xxx`
    Webhook --> Thank You Page: Redirect com Deep Link + Upsell Timer
```

### 2.2 Thank You Page (TY Page) — Single Page App
**Componentes (Ordem Visual):**
1. **Celebração**: "🎉 MISSÃO ACEITA!" + Confetti animation (respeita `prefers-reduced-motion`)
2. **Próximos Passos (Checklist Visual)**:
   - [ ] 1. Entre no app → Troque senha
   - [ ] 2. Clique "Gerar meu plano" (30s)
   - [ ] 3. Inicie "Modo Foco 15min" → 1ª aula/Flashcards
   - [ ] 4. Ganhe +100 XP + Streak Dia 1 🎖️
3. **Botão Principal (Sticky Bottom)**: "🚀 ENTRAR NA PLATAFORMA AGORA" → Deep Link App
4. **Upsell One-Click (Timer 15min)**: Turma VIP R$ 1.997 (20% off) — 1 clique
5. **Suporte**: "Dúvidas? WhatsApp: wa.me/5511999999999 | Email: suporte@"

### 2.3 Deep Link Handling (App)
- **iOS**: Universal Links `https://app.operacaoaprovacao.com/onboarding?session_id=xxx`
- **Android**: App Links + Intent Filter
- **Fallback Web**: PWA `/onboarding?session_id=xxx` (funciona no browser)
- **Parâmetros**: `session_id`, `plan`, `utm_*`, `upsell_accepted` (bool)

---

## 3. Onboarding In-App (First Session)

### 3.1 Tela 1: Boas-vindas + Troca Senha (Obrigatório)
- **Título**: "Bem-vindo à Operação Aprovação, [Nome]!"
- **Ação**: Input nova senha + Confirmação + "Continuar"
- **Validação**: Mín 8 chars, 1 maiúscula, 1 número, 1 especial
- **Skip**: Não permitido (segurança)
- **Tempo**: < 60s

### 3.2 Tela 2: Diagnóstico Rápido (Opcional — 30s)
- **Perguntas** (Chips/Toggles):
  - Concurso alvo: [Dropdown: PM-SP, GCM-RJ, Policial Penal-MG, Bombeiro-RJ, Outro...]
  - Tempo/dia: [15min, 30min, 45min, 1h, 1.5h, 2h+]
  - Maior trava: [Tempo, Organização, Ansiedade, Matéria específica, Simulados]
  - Nível atual: [Iniciante, Intermediário, Avançado, Reprovado]
- **Botão**: "Gerar meu plano personalizado" / "Pular (configuro depois)"
- **Analytics**: `onboarding_diagnostic_completed` + respostas

### 3.3 Tela 3: Geração de Plano (IA — < 30s)
- **Loading State**: Skeleton + "Montando seu cronograma..." + Dicas rotativas
- **Resultado**: Cards por dia da semana (Seg-Sex: 45min, Sáb: 2h, Dom: 1h revisão)
- **Ações**: "Salvar plano" (default) / "Ajustar manualmente" / "Regenerar"
- **Sucesso**: Toast "Plano salvo! +100 XP" + Animação XP bar

### 3.4 Tela 4: Modo Foco — 1ª Sessão (Call to Action Imediato)
- **Card**: "Sua 1ª missão: 15min de foco puro"
- **Opções**: 
  - "Flashcards do dia" (10 cards SM-2)
  - "Aula recomendada" (Baseada no plano)
  - "Simulado rápido" (10 questões)
- **Botão**: "Iniciar Modo Foco 15min" → Abre `AttemptRunner` com timer
- **Gamificação**: "Complete 15min = +50 XP + Streak Dia 1 🎖️"

---

## 4. Sequência de Comunicação (D0 a D30)

| Dia | Canal | Template | Objetivo | CTA |
|-----|-------|----------|----------|-----|
| **D0 (Imediato)** | Email + WA | "Bem-vindo! Seu acesso liberado. Link app: [deep link]. 1º passo: troque senha + gere plano (30s)." | Login + Plano | Deep Link App |
| **D0 (+2h)** | WA (se opt-in) | "Oi [Nome], conseguiu entrar? Gerou seu plano? Qualquer coisa, responde aqui." | Suporte proativo | Reply WA |
| **D1 (9h)** | Email | "Dia 1: Sua streak começa hoje. Dica: Modo Foco 15min antes do café. [Link app]" | Streak Dia 1 | Link App |
| **D1 (18h)** | WA (se streak=0) | "Vi que não iniciou ainda. Quer ajuda? Mando seu plano 45min pro seu horário. Responde 'SIM'." | Recuperação Dia 1 | Reply WA |
| **D3** | Email | "3 dias de streak? 🎖️ Dica: Flashcards no ônibus = 20 cards/dia. [Link Flashcards]" | Hábito Flashcards | Link App |
| **D7** | Email + WA | "🎉 7 DIAS DE STREAK! Parabéns! Seu 1º simulado tá liberado. Faz agora? [Link Simulado]" | 1º Simulado | Link Simulado |
| **D14** | Email | "2 semanas! Seu plano IA já se adaptou. Quer upgrade Anual + Mentoria grátis? [Link]" | Upgrade Anual | Link Upgrade |
| **D30** | Email (Fundador) | "30 dias! Como tá a preparação pro [CONCURSO]? Responde que eu leio." | NPS / Retenção | Reply Email |

---

## 5. Segmentação de Onboarding (Personalização)

| Segmento | Adaptação no Fluxo |
|----------|-------------------|
| **Trial 7d (Sem cartão)** | TY Page: "7 dias grátis — sem cartão. Cancele 1 clique." + Urgência D5/D6 |
| **Mensal (Cartão)** | Upgrade Anual banner D3/D7/D14 + Mentoria grátis destaque |
| **Anual (PIX)** | Turma VIP TY Page + Convite VIP D7 + Mentoria D30 |
| **Turma VIP** | Onboarding VIP: Call Boas-vindas agendada D1 + Grupo WhatsApp D0 |
| **Mentoria 1:1** | Call Diagnóstico agendada D0 + Notion Template compartilhado D0 |
| **Reativado (Win-back)** | "Bem-vindo de volta! Progresso restaurado. Seu plano atualizado: [Link]" |

---

## 6. Métricas & Alertas (Onboarding Dashboard)

| Métrica | Meta | Alerta Se | Fonte |
|---------|------|-----------|-------|
| **M0→M1 (Login Rate)** | > 95% | < 90% | App Analytics |
| **M1→M2 (Plano Rate)** | > 85% | < 75% | App Analytics |
| **M2→M3 (1ª Ação Rate)** | > 75% | < 65% | App Analytics |
| **M3→M4 (Streak D1)** | > 70% | < 60% | App Analytics |
| **M0→M5 (1º Simulado 7d)** | > 40% | < 30% | App Analytics |
| **M0→M6 (Activated 14d)** | > 50% | < 40% | App Analytics |
| **Time-to-Value (M0→M3)** | < 10 min | > 15 min | App Analytics |
| **Drop-off TY Page** | < 10% | > 15% | GA4 / Mixpanel |
| **Deep Link Failure** | < 1% | > 2% | App Analytics |
| **Support Ticket D0-D1** | < 5% | > 10% | Helpdesk |

---

## 7. Tratamento de Falhas (Error Handling)

| Cenário | Detecção | Recuperação Automática | Escalação |
|---------|----------|------------------------|-----------|
| **Webhook Falhou** | Idempotency key duplicada / Timeout | Retry exponencial (1m, 5m, 15m, 1h) + Dead Letter Queue | Alert Slack #billing + Manual replay |
| **Deep Link Falha** | App não abre / Fallback web | Fallback: PWA `/onboarding` + Email com link direto | Alert Slack #mobile |
| **Plano IA Falha** | Timeout > 10s / Erro IA | Fallback: Plano padrão 45min/dia (estático) + Log erro | Alert Slack #ia |
| **Email/WA Não Enviou** | Bounce / Opt-out / Falha API | Retry 3x + Log + Fallback canal alternativo | Alert Slack #comms |
| **Usuário Não Loga D1** | `last_login` null 24h pós-purchase | WA SDR "Oi, conseguiu entrar?" + Email Fundador D2 | Task SDR "Onboarding Stuck" |

---

## 8. Testes de Onboarding (QA Checklist)

| Cenário | Teste | Critério Pass |
|---------|-------|---------------|
| **Happy Path PIX Anual** | Compra PIX → TY Page → Deep Link → App → Senha → Plano → Foco 15min | Todos milestones M0-M4 < 10 min |
| **Happy Path Cartão Mensal** | Cartão 12x → Trial 7d → Onboarding | Trial badge visível + Upgrade banner D3 |
| **Trial 7d Sem Cartão** | Checkout `trial=7` → TY Page "Sem cartão" | Trial badge + Urgência D5/D6 |
| **Upgrade Anual no App** | Mensal → Banner Upgrade → Checkout Anual | Plano atualizado imediato + Mentoria grátis |
| **Reativação Win-back** | Cancelado → Win-back Link → Login | Progresso 100% restaurado (streak, XP, ranking) |
| **Mobile iOS/Android** | Deep Link Universal/App Links | Abre app direto (não browser) |
| **Acessibilidade** | Screen reader (VoiceOver/TalkBack) + Teclado | Todos labels, focus order, aria-live |
| **Falha Webhook** | Stripe Test Mode `payment_intent.succeeded` mock falha | Retry + DLQ + Alert |
| **Falha IA Plano** | Mock IA timeout | Plano padrão carregado < 2s |

---

## 9. Melhorias Contínuas (Roadmap Onboarding)

| Trimestre | Iniciativa | Hipótese | Métrica |
|-----------|------------|----------|---------|
| Q1 2027 | **Video Onboarding** (1min auto-play TY Page) | Video aumenta M1→M2 em 10% | Plano Rate +85% → 93% |
| Q1 2027 | **Progressive Profiling** (Pergunta 1 por login) | Reduz fricção inicial | M1→M2 +5% |
| Q2 2027 | **Buddy System** (Par com aluno similar) | Social accountability aumenta Streak D7 | Streak D7 +70% → 80% |
| Q2 2027 | **AI Coach Chat** (WhatsApp bot no onboarding) | Suporte 24/7 reduz tickets D0-D1 | Tickets D0-D1 -50% |
| Q3 2027 | **Gamified Onboarding** (Missões: "Complete perfil", "Faça 1 flashcard") | Dopamina inicial aumenta ativação | Activated 14d 50% → 60% |

---

*Próximo: `retention-expansion.md` → `kpi-targets.md` → `compensation-plan.md`.*