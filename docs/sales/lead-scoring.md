# Lead Scoring — Operação Aprovação

> Modelo de pontuação de leads alimentado por eventos do site, app, e-mail e WhatsApp.
> Definição compartilhada com Marketing (acordo MQL/SQL) — consulte `../marketing/kpi-dashboard.md` e `sales-process.md`.

---

## 1. Filosofia

- **Score 0-100**, atualizado em tempo real via webhooks de eventos (site/app) e integrações (CRM/email/WHATSAPP).
- **Decaimento natural** (leads esfriam) — não apenas reward, também *decay*.
- **Sem score bloquear venda** — score é *priorização*, não gate absoluto.
- **Rastreável** — toda mudança de score gera log (motivo, delta, timestamp).
- **Compartilhado** — Marketing e Sales leem os MESMOS thresholds.

---

## 2. Eventos e Pontuação

### 2.1 Eventos de Website/App (via CAPI/Pixel + server-side)
| Evento | Pontos | Notas |
|--------|--------|-------|
| `add_to_cart` / visitou `/checkout` | +30 | Segundo maior sinal de intenção |
| `initiate_checkout` | +50 | Máximo sinal comportamental |
| `complete_registration` (Lead Magnet) | +15 | —
| `lead` (Meta Lead Form) | +15 | —
| Time no site > 2min (em `/sales`, `/pricing`, `/checkout`) | +5 | Vários buckets limitados |
| Assistiu VSL ≥ 25% | +10 | Replay contado 1x por dia |
| Assistiu VSL ≥ 50% | +15 | —
| Assistiu VSL ≥ 75% | +20 | —
| Assistiu VSL até o fim | +30 | +
| Clicou em "Começar teste 7 dias" | +20 | Micro-compromisso |
| Visualizou página de vendas | +5 | —
| Acessou via retargeting (BAU) | 0 | Não pontua, usa para status quente |

### 2.2 Eventos de E-mail
| Evento | Pontos |
|--------|--------|
| `email_open` | +3 (cap 1x/6h) |
| `email_click` (link VSL/checkout/pricing) | +8 |
| `email_click` (outros) | +4 |
| `unsubscribe` | -15 |

### 2.3 Eventos de WhatsApp
| Evento | Pontos |
|--------|--------|
| `wa_inbound_message` | +40 |
| `wa_inbound` foto/áudio/PDF | +50 |
| Respondeu template SDR | +35 |
| Opt-out | -50 |

### 2.4 Eventos de Call
| Evento | Pontos |
|--------|--------|
| `meeting_scheduled` | +20 |
| `meeting_attended` | +60 |
| `meeting_no_show` | -25 |

### 2.5 Eventos de Compra/Histórico (pós-venda NÃO pontua lead — vira Customer, reset)
| Evento | Ação |
|--------|------|
| Purchase | Reset score → **Customer**. Novos scores de expansão em outro modelo (`retention-expansion.md`) |
| Cancelou pós-compra | `Churned`. Score para win-back separado |

---

## 3. Decaimento (Decay)

Leads esfriam se não reagirem. Decaimento **diário**:

| Perfil | Decay/dia (após 7d de inatividade) |
|--------|-------------------------------------|
| Cold (score < 50) | -2/dia |
| Warm (score 50-69) | -3/dia |
| Hot (score 70+) | -4/dia |
| Compra iniciada (80+) | -5/dia |
| Respondeu WA/Call na última semana | 0 (reseta contador) |

- Decay inicia somente após **7 dias sem nenhum evento**.
- **Cap mínimo**: 0.
- **Cap máximo de ganho/dia**: +50 (evita farm por automação).

---

## 4. Thresholds e Ações Automáticas

| Score | Label | Ação automática |
|-------|-------|-----------------|
| 0-19 | Cold (Frio) | Nurture passivo (email automático semanal) |
| 20-49 | Engaged | Vira `New Lead` → `Engaged`. Nurture ativo (email D1-D7) |
| 50-69 | MQL | Move p/ `MQL`. Notifica SDR via Slack #sales-mql. Entra sequência "Nurture + VSL" |
| 70-89 | SQL | Move p/ `SQL`. Cria Task SDR "Outreach WA 2h". Cria task Call em 48h se não responder |
| 90-100 | Hot | Alerta Closer "Hot Lead Priority". Closer contata em < 15min (SLA §5) |

**Regras de transição:**
- Upgrade de stage é instantâneo quando cruza threshold.
- **Downgrade** só ocorre após decay sustentado: 48h com score abaixo do threshold → move back.

---

## 5. SLA de Engajamento por Score

| Score | Canal | SLA |
|-------|-------|-----|
| 80+ (Hot) | WA (SDR) + Email | **< 15 min** |
| 70-79 (SQL) | WA (SDR) | **< 2h (úteis)** / 4h fora |
| 50-69 (MQL) | Email sequence automática | Imediato (auto) |
| 20-49 | Nurture email | 24h |
| < 20 | Nurture semanal | 7d |

---

## 6. Tratamento de Casos Especiais

### 6.1 Anti-fraude / Prevenção de Score Farm
- **Rate limit**: máx X eventos de um tipo por janela (ex: `email_open` 4/dia, VSL progress 1/dia).
- **Aba inativa**: eventos de `scroll`/`time` só contam se tab visível + heartbeat válido (reusa validadores de tempo do `study-tracking`).
- **IP suspeito / data center**: reduz ganho de eventos em 50%.
- **Mesmo dispositivo**: dedup por `device_id`+evento.

### 6.2 Priorização por mix de concursos (vertical)
- Seed de concurso: ao capturar lead de **PM-SP (edital vivo + próximo da prova)**, multiplicador **1.3x** no score.
- Concurso sem edital (longo): 1.0x.
- Concurso tipo "Polícia Penal" com edital próximo: 1.2x.
- Modificador aplicado somente para priorização (guardado como `Pb` — prioridade efetiva, não o raw).

### 6.3 Score de indicação (Referral)
- Indicação tem score base **40** + bonus de 10 por etapa do indicador.
- Referral é tratado como "warm" por default (vem de confiança).

---

## 7. Modelo de Decisão (Fórmula Final)

```
score_final = clamp(raw_score + concurso_mult, 0, 100)
raw_score  = soma eventos ponderados + decaimento acumulado
lead_temperature = f(score_final)   // cold/warm/hot
prioridade = score_final * peso_sla
```

---

## 8. Configuração no CRM

- Ver `crm-setup.md` → Campos `lead_score`, `lead_temperature`, `lead_stage`.
- Triggers: toda mudança de score ≥ 5 pontos dispara log + possível stage change.
- Dashboard: Lead Aging (leads > 7d sem toque), Score Distribution, Conversion por Band.

---

## 9. Métricas de Efetividade (Score)

| Métrica | Definição | Meta |
|---------|-----------|------|
| **Precisão do score** (SQL→Won) | Deve concentrar compras nas bandas altas | Band 90-100 > 60% do revenue |
| **Tempo SQL→Won** por banda | Ciclo médio | Hot < 7d |
| **Radar de leads quentes perdidos** | Hot que esfriam < 60 em 14d | < 5% |
| **Score farm** | Leads com pico anômalo suspeito | 0 |

---

*Próximo: `scripts/whatsapp-approach.md` → `scripts/qualification-call.md` → `compensation-plan.md`.*