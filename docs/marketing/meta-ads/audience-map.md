# Audience Map — Meta Ads Operação Aprovação

> Segmentações detalhadas, exclusões, lookalikes, expansões.
> Atualizar semanalmente com learnings de performance.

---

## 1. Públicos Frios (TOFU) — Interest/Behavior Targeting

### 1.1 Conjunto: `CONCURSEIROS_GERAL` (Prioridade Alta)

| Nível | Interesses (Meta) | Comportamentos | Tamanho Estimado BR |
|-------|-------------------|----------------|---------------------|
| Core | "Concursos públicos", "Preparação para concurso", "Estudo para concurso", "Videoaula para concurso", "Apostila concurso" | Dispositivo: Mobile (iOS + Android), Wi-Fi + 4G | 8-12M |
| Expansão | "Ensino à distância", "Educação online", "Cursos preparatórios", "Material de estudo", "Questões de concurso" | — | +5-8M |
| Nicho | "Técnicas de estudo", "Memorização", "Mapas mentais", "Resumos para concurso", "Cronograma de estudos" | — | +2-3M |

**Idade**: 18-35 | **Gênero**: Todos | **Geo**: Brasil (excluir exterior exceto campanhas específicas)

---

### 1.2 Conjunto: `SEGURANCA_PUBLICA` (Prioridade Alta — Mais Qualificado)

| Categoria | Interesses Específicos | Tamanho Estimado |
|-----------|------------------------|------------------|
| **Polícia Militar** | "Polícia Militar", "Concurso PM", "PM [ESTADO]" (SP, RJ, MG, RS, PR, SC, BA, GO, DF, etc), "Soldado PM", "Oficial PM", "CFSd", "CFO PM" | 2-4M |
| **Guarda Civil Municipal** | "Guarda Municipal", "Concurso GCM", "GCM [CIDADE]", "Guarda Civil", "Concurso Guarda" | 500k-1.5M |
| **Polícia Penal** | "Polícia Penal", "Agente Penitenciário", "Concurso Polícia Penal", "Concurso Agente Penitenciário", "Depen", "Sistema prisional" | 300k-800k |
| **Bombeiro Militar** | "Bombeiro Militar", "Concurso Bombeiro", "CBM [ESTADO]", "Soldado Bombeiro", "Oficial Bombeiro" | 300k-800k |
| **Bancas Examinadoras** | "CESPE", "Cebraspe", "FGV", "VUNESP", "IBFC", "Instituto Acesso", "Consulplan", "Quadrix" | 1-2M |

**Idade**: 18-35 | **Gênero**: Todos (testar Homens 70% / Mulheres 30% separado) | **Geo**: Brasil

---

### 1.3 Conjunto: `ESTUDO_PRODUTIVIDADE` (Prioridade Média — Topo Funil Largo)

| Interesses | Racional |
|------------|----------|
| "Técnica Pomodoro", "Gestão de tempo", "Produtividade pessoal", "Organização pessoal", "Hábitos", "Rotina matinal", "Anki", "Flashcards", "Repetição espaçada", "Leitura rápida", "Mapas mentais", "Método Cornell", "Sistema GTD" | Público que JÁ busca eficiência — mais propenso a pagar por sistema |

**Idade**: 18-32 | **Gênero**: Todos | **Geo**: Brasil

---

### 1.4 Conjunto: `EDUCACAO_ONLINE` (Prioridade Baixa — Awareness)

| Interesses | Notas |
|------------|-------|
| "Ensino à distância", "Plataforma de cursos", "Educação online", "Cursos online", "Aplicativo de estudo", "EdTech" | CTR baixo, CPL alto — usar só para brand awareness + vídeo views para popular LAL |

---

## 2. Públicos Personalizados (MOFU/BOFU) — Pixel + CRM

### 2.1 Baseados em Pixel (Eventos Site/App)

| Nome Público | Evento Fonte | Janela | Descrição | Uso |
|--------------|--------------|--------|-----------|-----|
| `SITE_30D` | PageView | 30 dias | Qualquer visita | MOFU amplo |
| `SITE_14D` | PageView | 14 dias | Visita recente | MOFU quente |
| `SITE_7D` | PageView | 7 dias | Muito recente | BOFU |
| `LANDING_VSL_30D` | ViewContent (URL contém /vsl ou /aula-gratis) | 30 dias | Assistiu landing VSL | MOFU |
| `CHECKOUT_VISIT_14D` | ViewContent (URL /checkout) | 14 dias | Veio até checkout | BOFU |
| `CHECKOUT_START_7D` | InitiateCheckout | 7 dias | Começou pagar | BOFU URGENTE |
| `PURCHASE_180D` | Purchase | 180 dias | Compradores | LAL Source + Exclusão BOFU |
| `LEAD_MAGNET_60D` | CompleteRegistration (Lead Magnet) | 60 dias | Baixou material | MOFU |
| `VIDEO_50_30D` | VideoPlay (50%+) | 30 dias | Engajou vídeo | MOFU |
| `VIDEO_75_30D` | VideoPlay (75%+) | 30 dias | Alto engajamento | MOFU/BOFU |
| `VIDEO_95_30D` | VideoPlay (95%+) | 30 dias | Assistiu quase tudo | BOFU |

---

### 2.2 Baseados em CRM (Upload Lista / API Conversions)

| Nome Público | Fonte | Critério | Tamanho Mín | Atualização |
|--------------|-------|----------|-------------|-------------|
| `CRM_LEADS_QUENTES` | ActiveCampaign/HubSpot | Score > 50 (abriu 3+ emails, clicou VSL, visitou pricing) | 1.000 | Diária (API) |
| `CRM_LEADS_MORNOS` | CRM | Score 20-50 (abriu 1-2 emails, visitou blog) | 5.000 | Diária |
| `CRM_LEADS_FRIOS` | CRM | Score < 20 (só baixou lead magnet) | 10.000 | Semanal |
| `CRM_COMPRADORES_ATIVOS` | CRM + Stripe | Assinatura ativa (status=active/trialing) | 500+ | Diária |
| `CRM_CHURN_RISK` | CRM | Assinante inativo 7d (streak 0, login 0) | 200+ | Diária |
| `CRM_UPSELL_MENTORIA` | CRM | Comprador ativo + NÃO tem mentoria + streak 14+ | 100+ | Semanal |
| `CRM_UPSELL_TURMA` | CRM | Comprador ativo + NÃO tem turma + NPS > 8 | 200+ | Semanal |

---

## 3. Lookalike Audiences (LAL) — Estrutura Progressiva

### 3.1 Fontes (Seed) — Ordem de Qualidade

| Prioridade | Fonte | Evento | Janela | Tamanho Mín | Qualidade Esperada |
|------------|-------|--------|--------|-------------|-------------------|
| 1 | `CRM_COMPRADORES_ATIVOS` | Purchase (valor > 0) | 180d | 500 | ⭐⭐⭐⭐⭐ (Melhor) |
| 2 | `PURCHASE_180D` (Pixel) | Purchase | 180d | 1.000 | ⭐⭐⭐⭐ |
| 3 | `CRM_LEADS_QUENTES` | Lead (score > 50) | 90d | 1.000 | ⭐⭐⭐ |
| 4 | `VIDEO_75_30D` | Video 75%+ | 30d | 5.000 | ⭐⭐ |
| 5 | `LEAD_MAGNET_60D` | CompleteRegistration | 60d | 2.000 | ⭐⭐ |

---

### 3.2 Matriz LAL por Campanha

| Campanha | Fonte LAL | % | Nome Conjunto | Orçamento % |
|----------|-----------|---|---------------|-------------|
| `OA_TOFU_CADASTROS_LAL1` | Compradores CRM | 1% | `LAL_COMPRADORES_1` | 40% |
| | Compradores Pixel | 1% | `LAL_COMPRADORES_PIXEL_1` | 30% |
| | Leads Quentes CRM | 1% | `LAL_LEADS_QUENTES_1` | 20% |
| | Video 75% | 1% | `LAL_VIDEO_75_1` | 10% |
| `OA_TOFU_CADASTROS_LAL3` | Compradores CRM | 3% | `LAL_COMPRADORES_3` | 50% |
| | Compradores Pixel | 3% | `LAL_COMPRADORES_PIXEL_3` | 30% |
| | Leads Quentes | 3% | `LAL_LEADS_QUENTES_3` | 20% |
| `OA_BOFU_VALOR_LAL1_UPSELL` | Compradores CRM | 1% | `LAL_COMPRADORES_UPSELL_1` | 100% |

**Regra**: Sempre excluir fonte original do LAL (ex: `LAL_COMPRADORES_1` EXCLUI `CRM_COMPRADORES_ATIVOS`)

---

## 4. Públicos de Retargeting (BOFU) — Camadas de Intenção

### 4.1 Pirâmide de Intenção (Da mais quente para menos)

```
CAMADA 1 (MAIS QUENTE) → BOFU Direto + Urgência
├── CHECKOUT_START_7D (Iniciou checkout, não completou)
├── CHECKOUT_VISIT_3D (Visitou checkout 3d)
└── CRM_LEADS_QUENTES (Score > 70)

CAMADA 2 → BOFU Oferta Direta
├── CHECKOUT_VISIT_14D
├── VIDEO_95_30D (Assistiu VSL quase toda)
├── LANDING_VSL_7D
└── CRM_LEADS_QUENTES (Score 50-70)

CAMADA 3 → MOFU VSL / Demo
├── VIDEO_75_30D
├── SITE_14D
├── LEAD_MAGNET_30D
└── CRM_LEADS_MORNOS

CAMADA 4 (MAIS FRIA RETARGET) → MOFU Conteúdo
├── VIDEO_50_30D
├── SITE_30D
├── LEAD_MAGNET_60D
└── CRM_LEADS_FRIOS
```

### 4.2 Frequência e Orçamento por Camada

| Camada | Frequência Meta | Orçamento % Total | Duração Janela | Criativo |
|--------|-----------------|-------------------|----------------|----------|
| 1 | 2-3/semana | 40% | 7 dias | Urgência real (timer, desconto PIX, bônus expira) |
| 2 | 1-2/semana | 30% | 14 dias | Oferta direta + Garantia + Prova social |
| 3 | 1/semana | 20% | 30 dias | VSL / Demo / Benefícios |
| 4 | 0.5/semana | 10% | 60 dias | Conteúdo educativo / Soft sell |

---

## 5. Exclusões (Sempre Ativas — Negativas)

### 5.1 Exclusões Demográficas/Comportamentais

| Exclusão | Tipo | Racional |
|----------|------|----------|
| Idade > 38 | Demográfico | Fora ICP principal (exceto campanhas "transição carreira") |
| Funcionários públicos (cargo: policial, guarda, bombeiro, agente penitenciário, militar) | Comportamental/Emprego | Já concursados — não compram |
| Curtidores Página Operação Aprovação | Engajamento | Já conhecem — mover para MOFU/BOFU |
| Visitantes Página "Obrigado/Sucesso" (últimos 30d) | Pixel | Compradores recentes — excluir TOFU/MOFU |
| `CRM_COMPRADORES_ATIVOS` | CRM | Compradores atuais — excluir aquisição |
| `PURCHASE_180D` | Pixel | Compradores pixel — excluir aquisição |
| Engajamento Negativo: Ocultou anúncio, Denunciou, "Não é relevante" | Engajamento | Protege relevância / evita ban |
| Dispositivos: Desktop only (para campanhas mobile-first) | Dispositivo | 70%+ tráfego mobile |

### 5.2 Exclusões Geográficas

| Campanha | Excluir |
|----------|---------|
| Todas (Brasil) | Exterior (exceto campanhas "Brasileiros no Exterior") |
| Estaduais (ex: PM SP) | Outros estados (geo-target cidade/estado) |

---

## 6. Expansões e Broad Targeting (Testes Controlados)

| Teste | Configuração | Hipótese | Critério Sucesso |
|-------|--------------|----------|------------------|
| **Broad Sem Segmentação** | Idade 18-35, Geo BR, Sem interesses, Otimização: Purchase/Lead | Algoritmo Meta acha melhor que interest | CAC < Interest × 1.2 |
| **Advantage+ Audience** | Ativar Advantage+ com sugestões: "Concursos", "Segurança Pública" | Meta expande inteligentemente | CPL < Manual × 1.1 |
| **LAL 5% + 10%** | LAL Compradores 5% e 10% (excluindo 1% e 3%) | Escala além 3% | CAC < LAL 3% × 1.3 |
| **Geo Expansão** | Brasil todo vs Top 10 estados (SP, RJ, MG, RS, PR, SC, BA, GO, DF, PE) | Concentrar onde tem mais concursos | CAC estado-alvo < Brasil todo |

---

## 7. Parâmetros UTM Padronizados (Atribuição CRM)

```
utm_source=meta
utm_medium=paid_social
utm_campaign={campaign.name}
utm_content={adset.name}|{ad.name}
utm_term={placement}|{age}|{gender}
```

**Exemplo real**:
`https://operacaoaprovacao.com/landing?utm_source=meta&utm_medium=paid_social&utm_campaign=OA_TOFU_TRÁFEGO_FRIO_INTEREST_CARROSSEL_A&utm_content=SEGURANCA_PUBLICA|ranking-real-pm-sp-v1&utm_term=feed|25-34|all`

**CRM**: Mapear `utm_content` → Conjunto + Criativo → Atribuição exata por peça.

---

## 8. Checklist Setup Inicial (Antes de Ligar)

- [ ] Pixel instalado + CAPI (Events API) configurado no servidor
- [ ] Eventos testados: ViewContent, Lead, InitiateCheckout, Purchase, CompleteRegistration
- [ ] Domínio verificado no Business Manager
- [ ] Página FB/IG ativa com info completa (CNPJ, endereço, site, telefone)
- [ ] Públicos Personalizados criados (Pixel + CRM sync)
- [ ] Lookalikes criados (aguardar 24-48h para popular)
- [ ] Exclusões aplicadas em TODAS campanhas
- [ ] UTM parameters no nível Campanha (não só anúncio)
- [ ] Conversão API redundância: Pixel + CAPI (deduplicação event_id)
- [ ] Catálogo produtos (se usar Dynamic Ads) — opcional fase 2

---

## 9. Auditoria Semanal (Segunda-feira)

| Verificação | Ação Se Fora do Padrão |
|-------------|------------------------|
| Frequência Camada 1 > 3 | Reduzir orçamento ou expandir janela para 14d |
| Frequência Camada 4 > 1 | Pausar Camada 4 ou mudar criativo |
| Overlap entre conjuntos > 30% | Consolidar ou excluir cruzado |
| LAL não populando (> 72h) | Verificar seed size + eventos source |
| CPL Interest > R$ 35 por 3 dias | Pausar piores interesses, testar Broad |
| CTR < 0.8% | Trocar criativos (hook/visual) |

---

*Documento vivo. Atualizar a cada insight: "LAL 1% Compradores CRM superou Interest em 40% CAC — mover 50% budget TOFU para LAL".*