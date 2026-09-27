# Compliance Checklist — Sales Page — Operação Aprovação

> Checklist legal/regulatório antes de publicar a página de vendas. Os compliance + LGPD não é opcional.

---

## 1. LGPD / Privacidade

- [ ] Política de Privacidade publicada e acessível no rodapé (link).
- [ ] **Cookie banner**: consentimento explícito p/ cookies não-essenciais (analytics/pixel).
- [ ] Base legal registrada (consentimento casual) p/ coleta de dados.
- [ ] **Opt-out WhatsApp/e-mail** visível (conforme `crm-setup.md` §5.2).
- [ ] Dados pessoais só em server (não em params de eventos — ver `analytics-events.md` §6).
- [ ] Encargo de **DPO** nomeado (mesmo freestyle) + canal de contato.
- [ ] Formulários com `checkbox de consentimento` e link à política.

---

## 2. Consumer Law (CDC + publicidade)

- [ ] **Garantia legal de 7 dias** sempre citada para compras online (direito do consumidor).
- [ ] Garantia estendida descrita com **prazo e condições reais** (30 dias).
- [ ] **Proibido**: "aprovação garantida", "passe sem estudar", "resultado garantido".
- [ ] Valores reais: preços com ICMS/frete explícitos; PIX/cartão 12x com juros indicados.
- [ ] Renovação automática: **aviso com 7 dias de antecedência** claro.
- [ ] Cancelamento possibilitado (no app e no site) — sem "vínculo indissolúvel".
- [ ] Termos de Uso publicados (uso, assinatura, reembolso, propriedade).

---

## 3. Meta/Google Policies (Ads)

- [ ] Sem conteúdo "polêmico/por assunto sensível" — Educação OK.
- [ ] Sem gatilho de "ganho financeiro"; posicionar produto como curso (não "enriquecimento").
- [ ] Uso de "governo/concurso": sem promessa de cargo, citação a concursos é permitida se factual.
- [ ] Pop-up legal de consentimento configurado p/ Pixel/EU (GDPR) — e p/ BR LGPD (cookie).
- [ ] Eventos CAPI com `event_id` para dedupe; sem PII.

---

## 4. Pagamentos

- [ ] Checkout com HTTPS e selo SSL.
- [ ] Gateway compliant (Stripe/Mercado Pago) com DPA assinado.
- [ ] Preço e período de trial claros (7 dias **direto**, sem cobrança escondida).
- [ ] Política de reembolso clara (30 dias) na página da Checkout.
- [ ] PIX: chave e regra de identificação confirmadas.
- [ ] Recibo/NFe (quando aplicável) para valores de assinatura.

---

## 5. Conteúdo & Prova Social

- [ ] Depoimentos: **autorizado por escrito** (consentimento de depoimento real).
- [ ] Números (12.847 alunos, 2,4M horas) **fact-checked** — sem inflar métricas.
- [ ] Nomes de bancas citadas corretamente (CESPE/FGV/Cebraspe/VUNESP) — sem "selo oficial" inexistente.
- [ ] Comparativos de "concorrente" sempre genéricos (sem nomes).

---

## 6. Acessibilidade Legal (Brasil)

- [ ] WCAG AA: contraste, foco visível, labels, alt text.
- [ ] Conteúdo navegável por teclado (accordions, carousel).
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Nenhuma informação essencial dependente apenas de cor (dica: **verde/vermelho** acompanham texto).

---

## 7. Técnico/Segurança

- [ ] Sem expor segredos no client (pricing é público intencional).
- [ ] Server-side validação (sempre server actions/RH, nunca só client).
- [ ] Sem rate `log` de dados sensíveis.
- [ ] CSP/headers de segurança ativos (ver `next.config.ts` + `src/proxy.ts`).

---

## 8. Assinaturas/Responsáveis (pré-publicação)

| Item | Responsável | Assinado |
|------|-------------|----------|
| Copy final aprovada | Fundador + Advogado | ☐ |
| Consenso de preço/campanha | Marketing + Sales | ☐ |
| Política de privacidade redigida | Advogado | ☐ |
| Test items 3.1-3.3 check | Compliance interno | ☐ |
| Revisão de segurança | `security` | ☐ |

---

*Fim do agente `sales-page` (docs). Próximo: implementação em `src/app/(marketing)/sales/`.*