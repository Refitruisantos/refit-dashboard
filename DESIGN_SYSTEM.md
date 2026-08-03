# 🎨 REFIT Design System

Design System premium, moderno e elegante para a aplicação REFIT Dashboard.

## Paleta de Cores

### Cores Principais

**Azul-Marinho (Primary)**
- Uso: Menu lateral, botões principais, ícones de destaque, links
- Classes: `bg-primary`, `text-primary`, `border-primary`
- Variações: `navy-50` a `navy-950`

**Branco/Cinza Claro (Background)**
- Uso: Fundo geral, cards, formulários
- Classes: `bg-background`, `bg-card`
- Valor: Branco puro (#FFFFFF) para cards, cinza muito claro para fundo

**Verde (Success)**
- Uso: Receitas, lucros, estados positivos, confirmações
- Classes: `bg-success`, `text-success`
- Aplicação: KPIs de receita, botões de confirmação, indicadores positivos

**Vermelho (Destructive)**
- Uso: Despesas, erros, ações destrutivas, alertas
- Classes: `bg-destructive`, `text-destructive`
- Aplicação: KPIs de despesas, botões de eliminar, mensagens de erro

**Amarelo (Warning)**
- Uso: Avisos, pendências, atenção
- Classes: `bg-warning`, `text-warning`
- Aplicação: Pagamentos pendentes, despesas a liquidar

### Cores Secundárias

**Cinza (Muted)**
- Uso: Texto secundário, fundos discretos, bordas
- Classes: `text-muted-foreground`, `bg-muted`, `border-border`

## Componentes

### Sidebar
- **Fundo**: Azul-marinho escuro (`navy-900`)
- **Logo**: Fundo translúcido branco (`bg-white/10`)
- **Menu Items**: 
  - Normal: `text-navy-300`
  - Hover: `bg-white/5`, `text-white`
  - Ativo: `bg-white/10`, `text-white`, `shadow-lg`

### Buttons
- **Primary**: Azul-marinho com sombra suave
- **Success**: Verde para confirmações
- **Destructive**: Vermelho para ações destrutivas
- **Outline**: Borda discreta, fundo branco
- **Ghost**: Sem borda, hover suave

### Cards
- **Fundo**: Branco (`bg-card`)
- **Borda**: Discreta (`border-border`)
- **Sombra**: Suave (`shadow-sm`), hover (`shadow-md`)
- **Cantos**: Arredondados (`rounded-xl`)

### KPI Cards
- **Clientes**: Azul-marinho (`bg-primary/10`, `text-primary`)
- **Receita**: Verde (`bg-success/10`, `text-success`)
- **Despesas**: Vermelho (`bg-destructive/10`, `text-destructive`)
- **Lucro**: Verde (`bg-success/10`, `text-success`)
- **Pendentes**: Amarelo (`bg-warning/10`, `text-warning`)

### Formulários
- **Header**: Azul-marinho (`bg-navy-900`)
- **Campos**: Fundo branco, bordas discretas
- **Labels**: Cinza médio, uppercase, tracking-wider
- **Focus**: Borda azul-marinho, ring suave
- **Botão Primário**: Azul-marinho
- **Botão Cancelar**: Outline discreto

## Tipografia

### Hierarquia
- **Títulos Principais**: `text-xl font-bold tracking-tight`
- **Subtítulos**: `text-sm text-muted-foreground`
- **Labels**: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`
- **Valores**: `text-3xl font-bold tracking-tight`
- **Descrições**: `text-xs text-muted-foreground`

### Fonte
- **Família**: Inter (system font stack)
- **Peso**: 400 (normal), 600 (semibold), 700 (bold)

## Espaçamentos

### Padding
- **Cards**: `p-6`
- **Headers**: `px-6 py-4`
- **Buttons**: `px-4 py-2`
- **Forms**: `p-6`

### Gap
- **Grid**: `gap-4` (cards), `gap-6` (seções)
- **Flex**: `gap-2` (pequeno), `gap-3` (médio), `gap-4` (grande)

## Sombras

### Níveis
- **Suave**: `shadow-sm` (cards padrão)
- **Média**: `shadow-md` (hover)
- **Forte**: `shadow-lg` (modais, dropdowns)

## Bordas

### Raios
- **Pequeno**: `rounded-lg` (botões, inputs)
- **Médio**: `rounded-xl` (cards)
- **Grande**: `rounded-2xl` (modais - não usado)

### Espessura
- **Padrão**: `border` (1px)
- **Cor**: `border-border` (cinza muito claro)

## Transições

### Duração
- **Rápida**: `duration-200` (hover, focus)
- **Padrão**: `transition-all`

### Propriedades
- **Hover**: Sombra, background, cor
- **Focus**: Borda, ring

## Gráficos

### Cores
- **Receitas/Positivo**: Verde (`#10b981`)
- **Despesas/Negativo**: Vermelho (`#ef4444`)
- **Neutro/Info**: Azul (`#1e40af`)
- **Secundário**: Azul claro (`#0ea5e9`)
- **Aviso**: Amarelo (`#f59e0b`)

## Estados

### Success (Verde)
- Receitas
- Lucros
- Confirmações
- Estados concluídos

### Destructive (Vermelho)
- Despesas
- Erros
- Ações destrutivas
- Atrasos

### Warning (Amarelo)
- Avisos
- Pendências
- Atenção necessária

### Primary (Azul-Marinho)
- Ações principais
- Navegação
- Destaques

## Consistência

### Todas as Páginas
- Header com ícone azul-marinho
- Cards brancos com bordas discretas
- Botões primários em azul-marinho
- Tipografia consistente
- Espaçamentos uniformes

### Formulários
- Header azul-marinho
- Campos brancos
- Labels em cinza
- Botões com cores semânticas

### Listas e Tabelas
- Hover suave
- Bordas discretas
- Espaçamento confortável

## Acessibilidade

- Contraste adequado (WCAG AA)
- Focus visível
- Hover states claros
- Texto legível

## Responsividade

- Mobile-first
- Breakpoints: sm, md, lg, xl
- Grid adaptativo
- Sidebar colapsável (futuro)
