# Objection FAQ — 12 Perguntas + Respostas — Operação Aprovação

> FAQ da página de vendas cobrindo as principais objeções. Reutilizar bullets de `bullets-usps.md`.
> Responsável: Mkt/Sales (conteúdo) + Product (fatos do produto).

---

## 1. As 12 Perguntas (ordem de exibição)

### Q1 — "Quanto custa?"
> "R$ 197/mês ou R$ 1.997/ano (≈ R$ 166/mês — 15% off). No anual, entra o bônus de **mentoria de planejamento no 1º mês**. Aceitamos PIX (10% off) e cartão em até 12x. Sem surpresa: TUDO incluso (sem custo extra por módulo)."

### Q2 — "Funciona para o meu concurso?"
> "Sim. Suportamos os concursos de segurança pública: **PM, GCM, Polícia Penal e Bombeiros**, com simulados no estilo **CESPE, FGV, VUNESP e AOCP**. O plano prioriza as matérias da sua banca; simulados configuráveis por banca."

### Q3 — "Não tenho tempo de estudar."
> "O plano mínimo é de **15 min/dia**. A constância vale mais que horas: nosso modo foco 15min acumula streak e XP. Se você pode 30 min, ótimo; o sistema se ajusta ao SEU tempo, não o contrário."

### Q4 — "Já tenho curso de outra plataforma."
> "O que te faltou no anterior? Se foi organização, correção ou progresso real, esse é o nosso foco — a operação não empilha aula, ela **mede e organiza**. Sobrepor os dois costuma deixar a eficiência maior que trocar por outro curso fechado."

### Q5 — "Consigo estudar de graça no YouTube."
> "Dá pra começar, sim. Mas corrigir simulado à mão, manter ranking real e ter plano que se adapta custam horas — aqui você **economiza 3-5x tempo**. Se o YouTube já resolve, ótimo; se não resolve a organização, é daqui que você vem."

### Q6 — "É seguro / vou ser cobrado sem querer?"
> "Sim e 100% transparente: cancelamento em **1 clique** no app, renovação avisada 7 dias antes, garantia de 30 dias sem burocracia. SSL + PIX/Cartão gerenciados por Stripe/Mercado Pago."

### Q7 — "Como funciona o teste de 7 dias?"
> "7 dias sem cobrança de cartão (trial limpo). Cria sua conta, monta o plano e usa tudo. Ao final, decide: assina ou sai. Se assinar depois, seu progresso fica salvo."

### Q8 — "Vou esperar sair o edital."
> "Quem se organiza **antes** do edital leva vantagem clara. E o preço fundador trava o valor atual; para novos ele sobe em [DD/MM]. Planejar não é esperar — é ganhar tempo no que o edital aprovado vai exigir."

### Q9 — "Como mede o tempo? Não da pra 'enrolar'?"
> "A medição usa **heartbeat real** (vídeo ativo + tab visível + interação recente). Só conta o que é sinal de estudo válido. Relatórios honestos por matéria, dia e período."

### Q10 — "E se eu não gostar?"
> "Garantia de **30 dias 'estude ou devolvemos'** — devolvemos 100%. Sem formulários, sem perguntas. Cancelamento em 1 clique."

### Q11 — "Preciso de material impresso / mentoria."
> "O plano anual + bônus cobre mentoria de planejamento no 1º mês. Material impresso e mentoria 1:1 são oferecidos como **planos VIP/Mentoria** separados (não estão no plano básico) — fale no WhatsApp para avaliar."

### Q12 — "Vocês garantem aprovação?"
> "Não. E desconfie de quem garante. Nossa promessa é **eficiência**: plano, correção, constância e progresso real. Aprovação é resultado do seu empenho + método — nosso lado é o método."

---

## 2. Modelo Acordeão (ARIA)

- `role="region"` + `aria-labelledby` da pergunta em `<summary>`/`button`.
- `aria-expanded` no botão; `aria-controls` ligado ao painel.
- Navegável por teclado (`Enter`/`Space`).
- Comportamento: **um aberto por vez** (accordion simple) para não sobrecarregar.

---

## 3. Ordem e Exposição

| Tráfego | Ordem recomendada |
|---------|-------------------|
| Frio | Q2 → Q6 → Q3 → Q7 → Q9 ↓ ... |
| Morno | Q1 → Q6 → Q7 → Q10 ↓ ... |
| Quente | Q6 → Q7 → Q10 → Q11 ↓ ... |
| Email | Q8 (urgência edital) primeiro |

---

## 4. Regras

- Nunca prometer aprovação; nunca dizer "100% eficaz"; nunca menosprezar concorrente nominalmente.
- Responder com fato do produto (link para docs/features se necessário).
- Manter tom conversacional (mentor), não defensivo.

---

*Próximo: `design-system/*`.*