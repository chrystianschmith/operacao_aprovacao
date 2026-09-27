# Estrutura de Campanhas Meta Ads — Operação Aprovação

> Baseado em posicionamento definido em `positioning.md`.
> Orçamento inicial sugerido: R$ 5.000-10.000/mês (escala progressiva).

---

## 1. Arquitetura de Funil (3 Camadas)

```
┌─────────────────────────────────────────────────────────────────┐
│                        TOFU (Topo)                              │
│  Objetivo: Tráfego / Envolvimento / Cadastros (Lead Magnet)    │
│  Público: Frio + Lookalike 1% (Compradores/Leads)              │
│  KPI: CPL < R$ 25 | CTR > 1.2% | Frequência < 3               │
├─────────────────────────────────────────────────────────────────┤
│                        MOFU (Meio)                              │
│  Objetivo: Tráfego (VSL/Página) / Cadastros (Webinar)          │
│  Público: Engajados (Vídeo 50%+, Site 30d, Lead Magnet)        │
│  KPI: CPC < R$ 2.50 | Taxa Landing > 25% | CPL < R$ 40        │
├─────────────────────────────────────────────────────────────────┤
│                        BOFU (Fundo)                             │
│  Objetivo: Conversões (Checkout) / Valor (ROAS)                │
│  Público: Carrinho Abandonado 7d, Visitou Checkout 14d,        │
│           Leads Quentes (abriu 3+ emails, clicou VSL)          │
│  KPI: ROAS > 3.0 | CAC < R$ 200 | Taxa Checkout > 3%           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Estrutura de Campanhas (Naming Convention)

```
OA_[FUNIL]_[OBJETIVO]_[PÚBLICO]_[FORMATO]_[TESTE]

Exemplos:
OA_TOFU_TRÁFEGO_FRIO_INTEREST_CARROSSEL_A
OA_TOFU_CADASTROS_LAL1_LEADMAGNET_REELS_B
OA_MOFU_TRÁFEGO_ENG_VIDEO50_VSL_STATIC_C
OA_BOFU_CONV_CHECKOUT_ABANDON7D_OFFER_CARROSSEL_A
OA_BOFU_VALOR_LAL1_COMPRADORES_UPSELL_VIDEO_D
```

---

## 3. Campanhas TOFU — Aquisição Fria

### 3.1 Campanha: `OA_TOFU_TRÁFEGO_FRIO_INTEREST_*`

| Conjunto de Anúncios | Segmentação (Interesses) | Idade | Gênero | Posicionamentos |
|----------------------|---------------------------|-------|--------|-----------------|
| `CONCURSEIROS_GERAL` | Concursos públicos, Estudo, Preparação para concurso, Apostila, Videoaula | 18-35 | Todos | Feed IG/FB, Reels, Stories |
| `SEGURANCA_PUBLICA` | Polícia Militar, Guarda Municipal, Polícia Penal, Bombeiro Militar, Concurso PM, Concurso GCM | 18-35 | Todos | Feed IG/FB, Reels, Stories |
| `ESTUDO_PRODUTIVIDADE` | Pomodoro, Técnicas de estudo, Organização pessoal, Gestão de tempo, Anki, Flashcards | 18-32 | Todos | Reels, Stories, Feed IG |
| `EDUCACAO_ONLINE` | Ensino à distância, Plataforma de cursos, Educação online, Cursos preparatórios | 18-35 | Todos | Feed FB, IG |

**Exclusões**: Funcionários públicos (já concursados), Idade > 38, Curtidores página (movem para MOFU)

### 3.2 Campanha: `OA_TOFU_CADASTROS_LAL1_LEADMAGNET_*`

| Conjunto | Fonte Lookalike | % | Evento Fonte |
|----------|-----------------|---|--------------|
| `LAL_COMPRADORES` | Compradores (Purchase) | 1% | Purchase (últimos 180d) |
| `LAL_LEADS_QUENTES` | Leads (CompleteRegistration + Lead) | 1% | Lead qualificado (score > 50) |
| `LAL_ENG_VIDEO` | Envolvimento vídeo | 1% | Video 75%+ (últimos 90d) |

---

## 4. Campanhas MOFU — Nutrição e Consideração

### 4.1 Campanha: `OA_MOFU_TRÁFEGO_ENG_*_VSL_*`

| Conjunto | Público Personalizado | Descrição |
|----------|----------------------|-----------|
| `ENG_VIDEO_50` | Video 50%+ (últimos 30d) | Assistiu metade do vídeo TOFU |
| `ENG_VIDEO_75` | Video 75%+ (últimos 30d) | Alto interesse |
| `SITE_30D` | Visitantes site (últimos 30d) | Pixel: PageView |
| `LEAD_MAGNET` | Leads magnet (últimos 60d) | Evento: CompleteRegistration (lead magnet) |
| `EMAIL_CLICK` | Clicaram email (últimos 30d) | UTM source=email + medium=email |

**Criativos**: VSL curta (3-5min) ou Página de Vendas direta
**Oferta MOFU**: "Assista a aula grátis: 'Como passar na PM estudando 1h/dia'"

### 4.2 Campanha: `OA_MOFU_CADASTROS_WEBINAR_*`

| Conjunto | Público | Formato |
|----------|---------|---------|
| `WEBINAR_FRIO_LAL` | LAL 1% Compradores + Leads | Reels/Video curto → Landing Webinar |
| `WEBINAR_RETARGET` | Site 30d + Video 50%+ | Carrossel benefícios + CTA "Reservar vaga" |

---

## 5. Campanhas BOFU — Conversão Direta

### 5.1 Campanha: `OA_BOFU_CONV_CHECKOUT_*`

| Conjunto | Público | Janela | Oferta |
|----------|---------|--------|--------|
| `ABANDONO_7D` | Iniciou checkout / Adicionou pagamento (últimos 7d) | 7 dias | "Seu carrinho expira em 2h" + Cupom 10% (PIX) |
| `ABANDONO_14D` | Visitou página checkout (últimos 14d) | 14 dias | "Ainda em dúvida? Garantia 30 dias + Bônus X" |
| `LEADS_QUENTES` | Score > 70 (abriu 3+ emails, clicou VSL, visitou pricing) | 30 dias | Oferta direta anual + bônus mentoria 30min |

### 5.2 Campanha: `OA_BOFU_VALOR_LAL_COMPRADORES_UPSELL_*`

| Conjunto | Público | Produto | Ticket |
|----------|---------|---------|--------|
| `UPSELL_MENTORIA` | Compradores (últimos 60d) + NÃO compraram mentoria | Mentoria 1:1 | R$ 500-1.500 |
| `UPSELL_TURMA_VIP` | Compradores ativos (streak 14+) | Turma VIP | R$ 2.000-4.000 |
| `RENOVACAO_ANUAL` | Assinantes mensais (mês 2-3) | Upgrade Anual 20% off | R$ 1.997 |

---

## 6. Criativos — Briefings por Formato

### 6.1 Estático (1080x1080 / 1080x1350)

**Estrutura Visual**:
```
[GANCHO VISUAL] → [PROMESSA NUMÉRICA] → [PROVA SOCIAL MINI] → [CTA CLARO]
```

**Templates Testáveis**:

| Template | Headline | Subheadline | Imagem Central | CTA |
|----------|----------|-------------|----------------|-----|
| **A - Ranking** | "Veja seu ranking real na PM SP" | "12.847 concurseiros. Você na posição #___" | Print dashboard ranking (blur nome) | "Ver minha posição" |
| **B - Tempo Real** | "Você estuda 3h. Foca 47min." | "Nossa IA mede seu tempo VÁLIDO. Não chute." | Split screen: "Chute" vs "Real (heartbeat)" | "Testar grátis 7 dias" |
| **C - Streak** | "Streak de 47 dias = 3.2x mais chance" | "Gamificação que faz você voltar todo dia." | Calendário verde estilo GitHub | "Começar minha streak" |
| **D - Aprovação** | "Como o Carlos passou na PM com 1h/dia" | "Plano adaptativo + Simulados CESPE + Foco real" | Foto Carlos + print aprovação | "Ver método dele" |
| **E - Objeção Tempo** | "Trabalha 8h? Estuda 45min. Passa." | "Modo foco 15min + Plano IA + Flashcards no ônibus" | Pessoa no ônibus com celular | "Ver plano 45min" |

### 6.2 Carrossel (1080x1080 - 3 a 5 cards)

| Card | Conteúdo |
|------|----------|
| 1 | **Gancho**: "O que 94% dos aprovados fazem diferente" |
| 2 | **Problema**: "Estudam o que cai + Medem foco real + Revisam erradas" |
| 3 | **Solução**: Print plataforma: "Simulados CESPE/FGV → Correção automática" |
| 4 | **Prova**: "Carlos, 28 anos, PM SP: 'Economizei 10h/semana só de organização'" |
| 5 | **CTA**: "Teste 7 dias grátis → Cancele com 1 clique" |

### 6.3 Reels / Vídeo Curto (9:16 - 15-45s)

**Roteiro Padrão (Hook-Retain-Reward-Action)**:

| Segundo | Visual | Áudio/Legenda |
|---------|--------|---------------|
| 0-3 (Hook) | Pessoal frustrado com pilha de PDF / relógio correndo | "Para de perder tempo organizando. Começa a estudar." |
| 3-10 (Retain) | Demo rápida: Plano IA gera cronograma → Player vídeo → Flashcard → Ranking | "Plano em 30s. Vídeo com tempo real. Flashcard espaçado. Ranking na sua cidade." |
| 10-25 (Reward) | Prints: Aprovação + Dashboard streak + Depoimento 5s | "Carlos passou na PM. Ana na GCM. Você é o próximo." |
| 25-30 (Action) | Tela checkout + "Garantia 30 dias" + Seta "Arrasta pra cima" | "Teste 7 dias grátis. Link na bio / Arrasta pra cima." |

**Variações de Hook (testar 5+)**:
1. Visual: Pilha de papel → Lixo / Digital limpo
2. Visual: Relógio "3h estudadas" → "47min válidos" (choque)
3. Visual: Calendário vazio → Calendário todo verde (streak)
4. Visual: Nota 4.0 simulado → Nota 8.5 após 30d plataforma
5. Visual: "Você estuda sozinho?" → Split: Sozinho (perdido) vs Plataforma (guiado)

### 6.4 UGC-Style (User Generated Content)

**Brief para Criadores (Micro-influencers 5-50k nicho concursos)**:
- **Entregável**: 3 Reels + 3 Stories + 1 Post feed
- **Roteiro livre** mas deve conter: (1) Dor real, (2) Plataforma em uso, (3) Resultado/Progresso, (4) CTA natural
- **Pagamento**: Fixo R$ 300-800 + Afiliado 20% recorrente (tracking link)
- **Perfil**: Concurseiro ativo, já reprovou, estuda 1-3h/dia, engajamento > 3%

---

## 7. Copy Library — Headlines, Bodies, CTAs

### Headlines (Testar 10+ simultâneas)

| Categoria | Headlines |
|-----------|-----------|
| **Dor Direta** | "Estuda muito, passa pouco? O problema não é você." |
| **Mecanismo Único** | "A única plataforma que separa 'assistiu' de 'aprendeu'." |
| **Prova Social** | "12.847 concurseiros usam. 94% renovam. Por quê?" |
| **Negativa** | "Não compre mais cursinho. Compre SISTEMA." |
| **Curiosidade** | "O segredo dos aprovados com 1h/dia (não é inteligência)." |
| **Identidade** | "De Recruta a Comandante. Sua missão: Aprovação." |
| **Urgência/Edital** | "Edital PM SP sai em 90 dias. Você tem 89 de vantagem?" |
| **Custo Oportunidade** | "Cada mês sem sistema = R$ 5.000+ de salário perdido." |
| **Benefício Claro** | "Plano dia a dia + Tempo real + Ranking + Simulados. Um app." |
| **Autoridade** | "Usado por aprovados CESPE, FGV, VUNESP. Valide seu método." |

### Bodies Curtos (Até 125 chars - Mobile)

1. "Seu tempo de foco finally conta. Heartbeat de vídeo + aba visível = tempo REAL. Teste 7 dias grátis."
2. "Para de chutar 'estudei 3h'. Veja exatamente quanto focou. Ranking na sua cidade. Streak que vicia (no bom sentido)."
3. "Plano de estudos gerado por IA em 30s. Simulados CESPE/FGV corrigidos na hora. Flashcards que voltam na hora certa."
4. "Carlos, 28 anos, trabalhava 8h/dia. Passou na PM estudando 45min/noite. Método: Foco real + Plano adaptativo."
5. "Não tem mentoria 1:1. Não tem material impresso grátis. TEM: Sistema que te faz estudar o que cai, todo dia."

### CTAs por Estágio

| Estágio | CTA Botão | Texto Link |
|---------|-----------|------------|
| TOFU | "Saiba mais" / "Ver vídeo" | "Descobrir meu tempo real de foco" |
| MOFU | "Assistir grátis" / "Reservar vaga" | "Ver aula: 'Como passar com 1h/dia'" |
| BOFU | "Começar teste 7 dias" / "Quero minha vaga" | "Garantir acesso + Bônus Revisão de Véspera" |
| Retargeting | "Voltar ao carrinho" / "Completar compra" | "Seu desconto PIX 10% expira em 2h" |

---

## 8. Orçamento e Pacing (Sugestão Inicial)

| Fase | Orçamento Diário | Duração | Meta | Escala |
|------|------------------|---------|------|--------|
| **Validação (Semanas 1-2)** | R$ 150/dia (TOFU 60% / MOFU 25% / BOFU 15%) | 14 dias | CPL < R$ 30, CTR > 1% | Manter se OK |
| **Otimização (Semanas 3-6)** | R$ 300/dia | 28 dias | CAC < R$ 200, ROAS > 2.5 | +20%/semana se ROAS > 3 |
| **Escala (Mês 2+)** | R$ 500-1.000/dia | Contínuo | CAC < R$ 180, ROAS > 4.0 | +30%/semana + novas audiências |
| **Sazonal (Pré-Edital)** | +50-100% budget | 30 dias pré-edital | Maximizar volume | Campanhas específicas "Edital X" |

**Regra de Corte**: Conjunto > 3 dias com CAC 2x meta → Pausar. Criativo > 7 dias sem conversão → Substituir.

---

## 9. Públicos Excluídos (Sempre Ativos)

1. **Compradores ativos** (últimos 30d) — exceto campanhas upsell
2. **Funcionários públicos** (cargo: policial, guarda, bombeiro, agente penitenciário)
3. **Idade > 38** (exceto campanhas segmentadas "transição carreira")
4. **Engajamento negativo**: Ocultaram anúncio, denunciaram, unfollow página
5. **Geolocalização**: Fora do Brasil (exceto brasileiros no exterior — campanhas específicas)

---

## 10. Calendário de Testes A/B (Primeiros 90 Dias)

| Semana | Teste | Variáveis | Critério Vitória |
|--------|-------|-----------|------------------|
| 1-2 | Headlines (5) | Hook visual + headline | CTR > 1.5% |
| 3-4 | Formatos | Estático vs Carrossel vs Reels | CPA menor |
| 5-6 | Ofertas TOFU | Lead Magnet A (Cronograma) vs B (Diagnóstico) vs C (Aula Grátis) | CPL + Qualidade Lead (score) |
| 7-8 | Página Destino | Long-form vs VSL vs Quiz | Taxa conversão Lead→Compra |
| 9-10 | Segmentação | Interest vs LAL 1% vs Broad (sem segmentação) | CAC |
| 11-12 | Criativo Vencedor | Iterar vencedor: nova headline, nova prova, novo CTA | Manter/Superar CAC |

---

## 11. Métricas de Acompanhamento (Dashboard Semanal)

| Métrica | Fonte | Frequência | Alerta Se |
|---------|-------|------------|-----------|
| Gasto Total | Ads Manager | Diário | > 120% orçamento |
| CPL (TOFU) | Ads Manager | Diário | > R$ 35 por 3 dias |
| CAC (Blended) | Ads + CRM | Semanal | > R$ 250 |
| ROAS (7d/30d) | Ads Manager | Semanal | < 2.0 |
| Frequência | Ads Manager | Semanal | > 4.0 (fadiga) |
| CTR Link | Ads Manager | Semanal | < 0.8% |
| Taxa Checkout | GA4 + Pixel | Semanal | < 2% |
| Lead → Compra (7d/30d) | CRM | Semanal | < 1% / < 3% |
| LTV (Cohort 30/90) | CRM | Mensal | Decrescendo |

---

## 12. Compliance Meta (Checklist Pré-Publicação)

- [ ] Sem "garantia de aprovação" / "vaga garantida" / "aprovado ou dinheiro de volta"
- [ ] Sem "ganhe dinheiro" / "renda extra" / "trabalhe em casa"
- [ ] Imagem/texto não promete resultado atípico sem disclaimer ("Resultados não típicos. Depende de dedicação.")
- [ ] Landing page tem: CNPJ, endereço, telefone, email, política privacidade, termos de uso
- [ ] Pixel eventos: ViewContent, Lead, InitiateCheckout, Purchase configurados
- [ ] Domínio verificado no Business Manager
- [ ] Página Facebook/Instagram ativa, com posts recentes, informações completas

---

## 13. Próximos Passos

1. **Criar 20+ criativos estáticos** (5 templates × 4 avatares) + 10 Reels roteirizados
2. **Configurar Pixel + CAPI** (Events API) — prioridade: Purchase, Lead, InitiateCheckout
3. **Criar Lead Magnets** (3 PDFs) + Landing Pages + Automação email
4. **Estruturar campanhas no Ads Manager** seguindo naming convention
5. **Definir UTM parameters** padronizados para atribuição CRM
6. **Agendar revisão semanal** (Segunda 9h) — Marketing + Sales + Produto

---

*Atualizar conforme dados reais. Benchmark nicho educação: CAC R$ 150-300, LTV 3-6x, ROAS 3-5x.*