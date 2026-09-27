# Email Sequence — Pós-Compra Onboarding (30 Dias)

> Gatilho: `Purchase` event (qualquer plano)
> Objetivo: Ativação imediata → Primeira vitória → Streak 7 → Streak 14 → Diagnóstico → Renovação/Upgrade
> Paralelo: Automações comportamentais (inatividade, conquistas, progresso)

---

## Dia 0 (Imediato — Pós-Compra) — Boas-vindas + Primeira Ação

**Trigger**: Imediato após `Purchase` confirmado (Webhook Stripe/MP → CRM)
**Assunto**: Bem-vindo à Operação Aprovação! 🎖️ Seu acesso está liberado.
**Pré-header**: Sua missão: Gerar seu primeiro plano (leva 30s) → Primeira aula (15min)

```html
<!-- Template: post_purchase_dia0.html -->
[Nome],

**Compra aprovada!** ✅ Bem-vindo à Operação Aprovação.

Seu acesso: **[PLANO ESCOLHIDO]** — Liberado agora.
Login: [EMAIL] | Senha temporária: [TEMP_PASSWORD] (troque no 1º acesso)

[BOTÃO VERDE GRANDE] ENTRAR NA PLATAFORMA AGORA

---

### 🎯 **Sua missão de hoje (leva 5 min):**

1. **Entre no app** → Troque sua senha
2. **Clique "Gerar meu plano"** (30 segundos) → IA cria seu cronograma semanal
3. **Inicie "Modo Foco 15min"** → Faça sua 1ª aula ou 15 flashcards
4. **Ganha +100 XP** + **Streak Dia 1** 🎖️

---

### 📱 **Atalhos úteis:**
• **App Mobile**: Baixe "Operação Aprovação" (iOS/Android) — sincroniza tudo
• **WhatsApp Suporte**: wa.me/5511999999999 (humano, 9h-18h úteis)
• **Comunidade VIP**: [Link Grupo WhatsApp/Telegram] — Aprovados + Mentores
• **Cancelamento**: 1 clique no painel "Minha Conta" → Sem justificativa

---

### 🛡️ **Sua Garantia (leia agora, guarde pra sempre):**
**30 dias "Estude ou Devolvemos"**: Use TUDO. Simulados, cursos, flashcards, plano, ranking.
Se não ver evolução REAL no seu tempo válido, ranking e simulados → Devolvemos 100%.
Sem formulário. Sem "por que?". Email suporte@ → Resolvido em 48h.

---

**Dúvida agora?** Responde este email. Eu (fundador) leio nos primeiros 30 dias de todo aluno.

Bora começar. Sua streak te espera.

— [Fundador] & Time Operação Aprovação
```

**CTA Principal**: Entrar na Plataforma (Deep Link + Auto-login Token)
**Métricas**: Open > 50% | Login Day 0 > 80% | Plano Gerado Day 0 > 40% | Primeira Ação (Aula/Flashcard/Foco) Day 0 > 30%

---

## Dia 1 — Check-in + Primeira Vitória

**Trigger**: 24h após Dia 0 (se não gerou plano OU não fez 1ª ação)
**Assunto**: Gerou seu plano? Primeira vitória = +100 XP 🏅
**Pré-header**: 30 segundos pro plano. 15min pra primeira aula. Streak Dia 1.

```html
<!-- Template: post_purchase_dia1.html -->
[Nome],

Vi que você [entrou / não entrou] ontem. Sem pressão — só lembrete:

**Sua streak começa AGORA.** 🔥

---

### ✅ **Checklist 5 min (faça agora):**
[ ] Entrar no app
[ ] Clicar "Gerar plano de hoje" (30s)
[ ] Iniciar "Modo Foco 15min" 
[ ] Fazer 1 aula OU 15 flashcards OU 1 simulado 10q
[ ] Ver: **+100 XP** | **Streak: 1 dia** | **Ranking atualizado**

---

### 💡 **Dica de ouro (dos aprovados):**
> "Não pense 'vou estudar 2h'. Pense 'vou fazer 15min modo foco'.
> 15min vira 30. 30 vira 1h. Streak não quebra se você fez 15min."
> — Ana, GCM RJ (45min/dia, 14 meses, APROVADA)

---

**Travou em algo?**
• "Não sei meu concurso" → Perfil → "Concurso Alvo" → Salva → Plano regenera
• "Vídeo não carrega" → Config → "Qualidade Baixa" / Baixa offline
• "Quer plano impresso" → Perfil → "Exportar PDF" → Imprime

---

[CONTINUAR MINHA MISSÃO →] (Deep Link: `operacaoaprovacao://plano-hoje`)

---

Bons 15min de foco real.
[Fundador]
```

**CTA**: Continuar Minha Missão
**Métricas**: Open > 40% | Plano Gerado Day 1 > 60% | Primeira Ação Day 1 > 45% | Streak 1 > 50%

---

## Dia 3 — Primeira Conquista Desbloqueada 🏅

**Trigger**: 72h após Dia 0 (se fez 1ª aula/conquista)
**Assunto**: Primeira conquista desbloqueada! 🏅 +100 XP | Streak: 3 dias
**Pré-header**: Recruta → Aspirante. Seu ranking subiu. Veja sua posição.

```html
<!-- Template: post_purchase_dia3.html -->
[Nome],

**CONQUISTA DESBLOQUEADA: "Primeira Aula" 🏅**

+100 XP | Streak: 3 dias | Nível: **ASPIRANTE** (subiu de Recruta!)

---

### 📊 **Seu snapshot hoje:**
• **Tempo válido total**: [X]h [Y]min
• **Streak atual**: 3 dias 🔥
• **XP total**: [X.XXX]
• **Ranking [CONCURSO] - [CIDADE]**: # [POSIÇÃO] de [TOTAL]
• **Próximo nível**: Combatente (5.000 XP) — Faltam [X] XP

---

### 🎯 **O que vem agora (Missão Dias 4-7):**
1. **Complete seu 1º Módulo** → +500 XP | Conquista "Módulo Completo"
2. **Faça 1 Simulado 20q** → Correção automática → Caderno erros auto
3. **Revise 20 Flashcards** → SM-2 agenda próxima revisão
4. **Mantenha Streak 7** → Conquista "Semana de Ferro" + 200 XP

---

### 💬 **Comunidade te espera:**
Grupo VIP WhatsApp: [Link] — Posta sua conquista lá!
"Aspirante [Nome] — 3 dias streak — PM SP Capital — Bora!" 🎖️

---

[VER MEU DASHBOARD COMPLETO →] (Deep Link: `operacaoaprovacao://dashboard`)

---

Continue assim. Consistência > Intensidade.
[Fundador]
```

**CTA**: Ver Dashboard Completo
**Métricas**: Open > 45% | Dashboard Views > 60% | Conquista Compartilhada > 10% | Streak 7 Projected > 40%

---

## Dia 7 — Streak 7 = Recruta → Aspirante → **Combatente?** 🎖️

**Trigger**: Dia 7 (se streak >= 7)
**Assunto**: Streak de 7 dias = 3.2x mais chance de aprovação 📈
**Pré-header**: Sua posição no ranking: #[POS]. Top 10% estuda 3h42min/dia.

```html
<!-- Template: post_purchase_dia7.html -->
[Nome],

**STREAK 7 DIAS!** 🔥🔥🔥🔥🔥🔥🔥

Dados internos (12.847 alunos): **Quem mantém streak 30+ tem 3.2x mais chance de aprovação.**
Você tá no caminho. 7 dias = base sólida.

---

### 📈 **Seu Ranking Atualizado:**
**Concurso**: [CONCURSO] | **Cidade**: [CIDADE]
**Sua posição**: # [POSIÇÃO] de [TOTAL]
**Tempo válido médio (últimos 7d)**: [X]h [Y]min/dia
**Top 10% média**: 3h42min/dia
**Seu gap pro top 10%**: [X]h [Y]min/dia

---

### 🎯 **Missão Semana 2 (Dias 8-14):**
✅ **Complete 1 Módulo inteiro** → +500 XP | Conquista "Módulo Completo"
✅ **Faça 2 Simulados 20q** (dias alternados) → Identifica gaps reais
✅ **Revise Flashcards TODOS OS DIAS** (15min) → SM-2 faz o resto
✅ **Streak 14** → Conquista "Duas Semanas de Ferro" + 500 XP | Nível: **COMBATENTE**

---

### 💡 **Dica da semana (do mentor):**
> "Não tente 'estudar mais'. Tente 'errar menos no simulado'.
> Cada erro = flashcard = revisão = acerto na prova. Matemática pura."

---

**Quer ajuda pra planejar a semana?** 
Responde: "Quero plano semana 2" → Eu monto e te mando grátis.
Ou agenda call 15min diagnóstica: [LINK CALENDLY]

---

[VER RANKING DETALHADO →] (Deep Link: `operacaoaprovacao://ranking`)

---

Sete dias de foco real. Isso é disciplina. Isso é método. Isso passa.
[Fundador]
```

**CTA**: Ver Ranking Detalhado
**Métricas**: Open > 40% | Ranking Views > 50% | Streak 14 Projected > 35% | Agendamento Call > 5%

---

## Dia 14 — Diagnóstico Grátis (Gaps + Plano Ajustado)

**Trigger**: Dia 14 (marco meio do onboarding)
**Assunto**: Metade do caminho: Diagnóstico grátis dos seus gaps 🎯
**Pré-header**: Agende call 15min: aponto seus gaps + ajusto seu plano + recomendo simulados

```html
<!-- Template: post_purchase_dia14.html -->
[Nome],

**14 dias de plataforma. Metade do onboarding.** ⚔️

Hora de calibrar a mira. Você já tem dados: tempo válido, simulados, flashcards, ranking.
Vou analisar **grátis** e te devolver um plano ajustado.

---

### 🎯 **Call Diagnóstica 15min (Grátis — Valor R$ 297):**
O que vamos fazer:
1. **Analiso seus dados**: Tempo válido, simulados (acertos/erros), flashcards, ranking
2. **Identifico 3 gaps prioritários**: "Você erra 70% em Direito Penal - Prisão. Foque aí."
3. **Ajusto seu plano IA**: Prioriza gaps + mantém streaks + equilibra revisão
4. **Recomendo simulados específicos**: "Faça simulado FGV Penal 40q — sua banca."
5. **Defino metas Semana 3-4**: Tempo válido alvo, Streak alvo, Ranking alvo

---

**Só 10 vagas/semana pra call grátis. 6 preenchidas.**

[AGENDAR MINHA CALL 15MIN GRÁTIS →] (Link Calendly com UTM: `utm_source=email&utm_medium=onboarding&utm_campaign=dia14_diagnostico`)

---

**Não quer call? Sem problema.**
Faça o **Diagnóstico Automático** no app: Perfil → "Diagnóstico Gaps" → 10 perguntas → PDF na hora.
Mesma lógica. Zero custo. Zero agendamento.

[FAZER DIAGNÓSTICO AUTOMÁTICO →] (Deep Link: `operacaoaprovacao://diagnostico`)

---

Bons ajustes. Semana 3-4 é onde a aprovação se constrói.
[Fundador]
```

**CTA**: Agendar Call 15min Grátis | Diagnóstico Automático
**Métricas**: Open > 35% | Agendamento Call > 15% | Diagnóstico Auto > 30% | Plano Ajustado > 50%

---

## Dia 21 — Progresso Visível (Ranking Subiu)

**Trigger**: Dia 21
**Assunto**: 21 dias. Seu ranking subiu: #[ANTIGO] → #[NOVO] 📈
**Pré-header**: Tempo válido médio: [X]h/dia. Streak: [Y] dias. XP: [Z]. Veja o gráfico.

```html
<!-- Template: post_purchase_dia21.html -->
[Nome],

**21 dias. 3 semanas de foco real.** 📊

---

### 📈 **Seu Progresso (Dia 1 → Dia 21):**
| Métrica | Dia 1 | Dia 21 | Δ |
|---------|-------|--------|---|
| Tempo válido/dia | [X]min | [Y]min | **+[Z]%** |
| Streak | 1 | [Y] | +[Y-1] |
| XP Total | [XXX] | [X.XXX] | **+[Z]%** |
| Ranking [CIDADE] | #[A] | #[B] | **Subiu [A-B] posições** |
| Simulados feitos | 0 | [N] | — |
| Flashcards revisados | 0 | [M] | — |
| Módulos completos | 0 | [K] | — |

---

### 🎖️ **Conquistas Desbloqueadas:**
✅ Primeira Aula | ✅ Semana de Ferro (7d) | ✅ Duas Semanas (14d) | ✅ [Módulo 1 Completo] | ✅ Primeiro Simulado

---

### 🎯 **Semana 4 (Dias 22-30) — Reta Final Onboarding:**
1. **Complete 2º Módulo** → +500 XP
2. **Simulado Completo 60q** (estilo prova real) → Treino tempo + gabarito
3. **Streak 30** → Conquista "Mês de Ferro" + 1.000 XP | Nível: **ESPECIALISTA**
4. **Diagnóstico Final** → Plano Pós-Onboarding (Mês 2+)

---

### 💰 **Lembrete: Seu Plano Atual**
**[PLANO]** • Próxima cobrança: [DATA] • Valor: R$ [X] / [mês/ano]
• **Upgrade Anual**: Trava preço R$ 1.997 vitalício + Economia R$ 367/ano
• **Cancel 1 clique**: Painel "Minha Conta" → Sem burocracia

---

[VER GRÁFICO PROGRESSO COMPLETO →] (Deep Link: `operacaoaprovacao://progresso`)

---

Três semanas de consistência. Isso não é sorte. É sistema.
[Fundador]
```

**CTA**: Ver Gráfico Progresso Completo
**Métricas**: Open > 35% | Progresso Views > 45% | Upgrade Click > 5% | Streak 30 Projected > 25%

---

## Dia 30 — 30 Dias / NPS / Renovação / Upgrade

**Trigger**: Dia 30 (fim onboarding formal)
**Assunto**: 30 dias de Operação Aprovação. Como foi? 📝 (NPS 0-10)
**Pré-header**: Seu feedback molda o produto. Responde? Leva 15 segundos.

```html
<!-- Template: post_purchase_dia30.html -->
[Nome],

**30 dias. Um mês de foco real.** 🎖️

---

### 🏆 **Seu Resumo do Mês:**
• **Tempo válido total**: [X]h [Y]min
• **Streak máxima**: [Z] dias
• **XP acumulado**: [X.XXX] | Nível: **[NÍVEL ATUAL]**
• **Ranking [CIDADE]**: # [POS] (Top [Y]%)
• **Simulados**: [N] feitos | Média: [X]% | Melhor: [Y]%
• **Flashcards**: [M] revisados | Taxa acerto: [Z]%
• **Módulos completos**: [K]
• **Conquistas**: [LISTA]

---

### 📝 **NPS — Sua opinião molda o produto (15 seg):**
**De 0 a 10, o quanto você recomendaria a Operação Aprovação pra um amigo concurseiro?**

[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]  (Botões clicáveis → Registra NPS + Abre feedback opcional)

---

### 💰 **Seu Plano / Próximos Passos:**

**Se você tá no MENSAL (R$ 197/mês):**
→ **Upgrade Anual R$ 1.997** = Trava preço vitalício + Economia R$ 367/ano + Mentoria 30min grátis
[UPGRADE ANUAL COM BÔNUS →] (Link Checkout Upgrade)

**Se você tá no ANUAL (R$ 1.997):**
→ **Renovação automática** em [DATA] | Preço travado R$ 1.997 vitalício
→ **Próximo nível**: Turma VIP / Mentoria 1:1 (quando score > 75)

**Se quer PAUSAR / CANCELAR:**
→ Painel "Minha Conta" → 1 clique | Progresso salvo 1 ano | Volta quando quiser

---

### 🎁 **Indique um concurseiro = 1 mês grátis (você) + 50% off 1º mês (ele)**
Link seu: `operacaoaprovacao.com/r/[SEU_CODIGO]` | Afiliado 20% recorrente vitalício

---

Obrigado por confiar no sistema. Seu feedback = nosso roadmap.
Responde este email com qualquer coisa. Eu leio.

— [Fundador]
```

**CTA**: NPS Buttons | Upgrade Anual | Link Indicação
**Métricas**: Open > 30% | NPS Response > 20% | NPS Score > 50 | Upgrade Anual > 15% | Indicações > 5%

---

## Automações Comportamentais (Paralelas — Não Lineares)

| Trigger | Condição | Ação Email/Push | Template |
|---------|----------|-----------------|----------|
| `streak_broken` | Streak zerada (0 dias ativos) | Push + Email: "Sua streak quebrou? 15min modo foco recomeça. Não zera XP." | `streak_recovery` |
| `inactive_3d` | Sem login 3 dias | Push: "Sua streak tá em risco! 15min salva." + Email Dia 4 | `inactivity_nudge` |
| `inactive_7d` | Sem login 7 dias | Email: "Sua streak sente sua falta" (mesmo template reengajamento) | `reengagement_dia0` |
| `lesson_completed` | Concluiu aula | Push: "Aula completa! +100 XP. Streak: [X] dias." | `lesson_victory` |
| `module_completed` | Concluiu módulo | Email: "Módulo completo! +500 XP. Próximo: [Matéria]. Conquista desbloqueada." | `module_victory` |
| `mock_exam_finished` | Finalizou simulado | Email: "Simulado [X]% — Gaps: [Top 3]. Caderno erros atualizado. Próximo simulado recomendado: [Y]." | `mock_exam_result` |
| `level_up` | Subiu de nível | Push + Email: "Subiu de nível! [ANTIGO] → [NOVO]. Benefício: [X]. Compartilha?" | `level_up_victory` |
| `ranking_improved` | Subiu > 10 posições | Push: "Subiu no ranking! #[ANTIGO] → #[NOVO]. Gap pro top 10%: [X]h." | `ranking_victory` |
| `payment_failed` | Pagamento falhou | Email Imediato + WhatsApp: "Pagamento não aprovado. Atualiza aqui: [Link]. 3 dias sem interrupção." | `payment_recovery` |
| `subscription_cancelled` | Cancelou | Email Fundador (template win-back) | `win_back_founder` |

---

## Métricas Consolidadas Onboarding 30 Dias

| Métrica | Meta | Crítica Se |
|---------|------|------------|
| Login Day 0 | > 80% | < 60% |
| Plano Gerado Day 1 | > 60% | < 40% |
| Primeira Ação (Aula/Flashcard/Foco) Day 1 | > 45% | < 30% |
| Streak 7 | > 50% | < 35% |
| Streak 14 | > 35% | < 20% |
| Streak 30 | > 25% | < 15% |
| Simulado Feito (30d) | > 60% | < 40% |
| Flashcards Revisados (30d) | > 200 | < 100 |
| Call Diagnóstica Agendada | > 15% | < 8% |
| NPS Response Rate | > 20% | < 10% |
| NPS Score | > 50 | < 30 |
| Upgrade Anual (Mensais) | > 15% | < 8% |
| Churn Mês 1 | < 8% | > 12% |
| Indicações Geradas | > 5% | < 2% |

---

*Próximo: `win_back.md` (pós-cancelamento) → `upsell_mentoria.md` → `upsell_turma_vip.md` → `newsletter_calendar.md`.*