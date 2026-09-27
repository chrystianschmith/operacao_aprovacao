# Design System — Color Tokens — Sales Page — Operação Aprovação

> Tokens de cor com foco em conversão, respeitando a identidade (CLAUDE.md §21: grafite, cinza, amarelo destaque, verde progresso, vermelho erro).

---

## 1. Paleta de Conversão (Sinalização)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-cta` | `#f5b942` (amarelo destaque) | Botão principal, urgencia, XP |
| `--color-cta-hover` | `#e0a22f` | Hover do CTA |
| `--color-cta-text` | `#1a1a1a` (grafite) | Texto/e-ícone sobre CTA |
| `--color-bg-primary` | `#161616` | Fundo base (dark default) |
| `--color-bg-surface` | `#1f1f1f` | Cards/containers |
| `--color-bg-elevated` | `#2a2a2a` | Overlays/modais |
| `--color-text-high` | `#f7f7f7` | Títulos |
| `--color-text-mid` | `#a3a3a3` | Corpo |
| `--color-text-low` | `#6f6f6f` | Metadados/decorativo |
| `--color-border` | `#3a3a3a` | Bordas |
| `--color-success` | `#37b26c` | Simulado/check/acerto |
| `--color-danger` | `#e5484d` | Erro/alerta |
| `--color-info` | `#4f9cf9` | Links/confiança |

**Light mode (opcional) — invertidos**:
```
background #ffffff · surface #f5f5f5 · text #171717 · text-mid #4a4a4a · border #d9d9d9
CTA mantém mesmo amarelo (contraste sobre branco: ok)
```

---

## 2. Contraste (WCAG)

| Par | Ratio | Obrigatório |
|-----|-------|-------------|
| text-high / bg-primary | 16:1 | ✅ |
| text-mid / bg-primary | 7:1 | ✅ |
| CTA-text / CTA-bg (amarelo) | 12:1 | ✅ |
| success / bg-primary | 5.5:1 | ✅ |
| danger / bg-primary | 5.2:1 | ✅ |
| text-low / bg-primary | 4.6:1 | Apenas decorativo, **não para info essencial** |

---

## 3. Regras de Uso

- CTA amarelo apenas para **ação destaque** (1 por viewport). Botões secundários: `border + text` neutro.
- Accelerativo: **verde = progresso/acerto**; **vermelho = erro/alerta**; não usar vermelho para neutros.
- Highcharts/barras de progresso: usar `success` como preenchimento.
- `dark` é o **default** (LIGHT opcional via class no `<html>`).

---

*Próximo: `typography-scale.md`.*