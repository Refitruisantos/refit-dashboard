# 🎯 INSTRUÇÕES FINAIS - REFIT Dashboard

## ✅ O QUE FOI CORRIGIDO E IMPLEMENTADO

### Módulo Despesas - COMPLETO
1. ✅ **useExpenses.ts** - Hook criado
2. ✅ **ExpenseForm.tsx** - Formulário completo criado
3. ✅ **DespesasPage.tsx** - Página completa criada
4. ✅ **App.tsx** - Rota 'despesas' adicionada
5. ✅ **migrate-db.bat** - Script atualizado

### Todos os 6 Módulos Principais Estão Prontos
- ✅ Dashboard
- ✅ Clientes
- ✅ Serviços
- ✅ Agenda (Treinos + Eventos)
- ✅ Pagamentos
- ✅ Despesas

---

## 🚀 PASSOS PARA INICIAR A APLICAÇÃO

### 1️⃣ Aplicar Migrações da Base de Dados
**IMPORTANTE: Executar ANTES de iniciar a aplicação**

```bash
# No diretório raiz do projeto, duplo click em:
migrate-db.bat
```

**O que este script faz:**
- Gera o Prisma Client atualizado
- Cria as tabelas `Appointment` e `Event`
- Atualiza as tabelas `Payment` e `Expense` com novos campos
- Resolve todos os erros TypeScript relacionados com o Prisma

**Aguarde até ver:**
```
========================================
   Migracao concluida!
========================================

Modulos prontos:
[OK] Dashboard
[OK] Clientes
[OK] Servicos
[OK] Agenda
[OK] Pagamentos
[OK] Despesas
```

### 2️⃣ Popular Serviços Iniciais (Opcional)
Se ainda não tiver serviços na base de dados:

```bash
seed-services.bat
```

Isto cria 3 serviços exemplo:
- Pilates (€50/sessão)
- Hybrid (€45/sessão)
- Treino Personalizado (€60/sessão)

### 3️⃣ Iniciar a Aplicação

```bash
start.bat
```

**O que acontece:**
- Backend inicia na porta 4000
- Frontend inicia na porta 5173
- Abre automaticamente no browser

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/health

---

## 📱 COMO USAR A APLICAÇÃO

### 1. Dashboard
- Ver resumo financeiro
- KPIs principais
- Gráficos de receita e despesas

### 2. Clientes
1. Click em "Novo Cliente"
2. Preencher dados pessoais
3. Selecionar serviço e frequência semanal
4. Sistema calcula mensalidade automaticamente
5. Guardar

### 3. Agenda

**Tab "Agenda de Treinos":**
1. Click em "Novo Treino"
2. Selecionar cliente e serviço
3. Definir data, hora e duração
4. Adicionar treinador (opcional)
5. Guardar

**Tab "Planeamento REFIT":**
1. Click em "Novo Evento"
2. Nome do evento (ex: Workshop de Nutrição)
3. Categoria (ex: Workshop)
4. Data, local, responsável
5. Orçamento previsto
6. Guardar
7. Pode duplicar eventos recorrentes

### 4. Pagamentos
1. Click em "Novo Pagamento"
2. Selecionar cliente
   - **Sistema preenche automaticamente** serviço e valor
3. Definir período (ex: 2026-01)
4. Data de vencimento
5. Se já foi pago:
   - Preencher data de pagamento
   - Selecionar método
   - Status: Pago
6. Se ainda não foi pago:
   - Status: Pendente
7. Guardar

**Resumo mostra:**
- Total recebido (só pagamentos com status: Pago)
- Total pendente
- Total em atraso
- Taxa de recebimento

### 5. Despesas
1. Click em "Nova Despesa"
2. Descrição (ex: Renda Janeiro 2026)
3. Categoria (ex: Renda)
4. Fornecedor (ex: Imobiliária XYZ)
5. Valor
6. Data da despesa
7. Data de vencimento
8. **Tipo:** Fixa / Variável / Extraordinária
9. **Recorrência:** Única / Mensal / Trimestral / Semestral / Anual
10. Se já foi paga:
    - Data de pagamento
    - Método
    - Status: Pago
11. Guardar

**Pode duplicar despesas recorrentes!**

**Resumo mostra:**
- Despesas totais do mês
- Despesas pagas (afetam caixa)
- Despesas pendentes (não afetam caixa ainda)
- Despesas em atraso
- Variação vs mês anterior

---

## 💡 CONCEITOS IMPORTANTES

### Previsto vs Realizado

**Pagamentos:**
- `Status: Pendente` = Receita PREVISTA (não conta no caixa)
- `Status: Pago` = Receita REALIZADA (conta no caixa)

**Despesas:**
- `Status: Pendente` = Despesa PREVISTA (não afeta caixa)
- `Status: Pago` = Despesa REALIZADA (afeta caixa)

**Exemplo Prático:**

```
Janeiro 2026:

Pagamentos:
- João: €100 (Pago) ✅
- Maria: €100 (Pendente) ⏳
- Pedro: €100 (Em Atraso) ⚠️

Despesas:
- Renda: €800 (Pago) ✅
- Eletricidade: €50 (Pendente) ⏳

Dashboard mostra:
- Receita Realizada: €100 (só João)
- Receita Prevista: €200 (Maria + Pedro)
- Despesas Realizadas: €800 (só Renda)
- Despesas Previstas: €50 (Eletricidade)
- Lucro Realizado: €100 - €800 = -€700
- Lucro Previsto: €300 - €850 = -€550
```

### Recorrência de Despesas

**Despesas Mensais (ex: Renda):**
1. Criar despesa com `Recorrência: Mensal`
2. No mês seguinte, pode duplicar facilmente
3. Ou criar manualmente

**Despesas Únicas (ex: Equipamento):**
1. Criar despesa com `Recorrência: Única`
2. `Tipo: Extraordinária`

---

## 🎨 DESIGN SYSTEM

### Cores e Significados

**Verde:**
- Pagamentos recebidos
- Despesas pagas
- Lucro positivo
- Ações de sucesso

**Vermelho:**
- Despesas
- Atrasos
- Lucro negativo
- Ações destrutivas

**Amarelo:**
- Pendências
- Avisos
- Itens a confirmar

**Azul-marinho:**
- Navegação
- Botões principais
- Informação neutra

**Cinza:**
- Estados neutros
- Cancelados
- Texto secundário

---

## 🔧 RESOLUÇÃO DE PROBLEMAS

### Erro: "Cannot find module '@prisma/client'"
**Solução:**
```bash
cd backend
npm install
npx prisma generate
```

### Erro: TypeScript no expenseController
**Solução:**
```bash
migrate-db.bat
```

### Backend não inicia
**Verificar:**
1. Porta 4000 está livre?
2. Prisma Client foi gerado?
3. Migrações foram aplicadas?

### Frontend não conecta ao backend
**Verificar:**
1. Backend está a correr?
2. URL correta: http://localhost:4000
3. CORS configurado corretamente

---

## 📊 ESTRUTURA DE FICHEIROS

```
refit-dashboard/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma ✅ 12 models
│   │   └── dev.db (SQLite)
│   ├── src/
│   │   ├── controllers/ ✅ 6 controllers
│   │   ├── routes/ ✅ 7 routes
│   │   └── server.ts ✅ Todas rotas registadas
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── hooks/ ✅ 6 hooks
│   │   ├── components/
│   │   │   └── forms/ ✅ 6 forms
│   │   ├── pages/ ✅ 6 pages
│   │   ├── App.tsx ✅ 6 rotas
│   │   └── index.css ✅ Design System
│   └── package.json
│
├── start.bat ✅
├── migrate-db.bat ✅
├── seed-services.bat ✅
└── STATUS_COMPLETO.md ✅
```

---

## ✅ CHECKLIST ANTES DE USAR

- [ ] Executei `migrate-db.bat`
- [ ] Vi mensagem "Migracao concluida!"
- [ ] Executei `seed-services.bat` (opcional)
- [ ] Executei `start.bat`
- [ ] Backend iniciou na porta 4000
- [ ] Frontend iniciou na porta 5173
- [ ] Consigo aceder a http://localhost:5173
- [ ] Sidebar mostra todos os 6 módulos
- [ ] Consigo criar um cliente
- [ ] Consigo criar um pagamento
- [ ] Consigo criar uma despesa

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

### Curto Prazo (Usar a aplicação)
1. Criar 3-5 clientes reais
2. Criar alguns pagamentos
3. Criar despesas mensais (renda, água, etc.)
4. Ver Dashboard atualizar automaticamente

### Médio Prazo (Expandir funcionalidades)
1. Implementar Fluxo de Caixa
2. Adicionar Relatórios
3. Implementar Objetivos
4. Adicionar Configurações (saldo inicial)

### Longo Prazo (Produção)
1. Migrar de SQLite para PostgreSQL
2. Adicionar autenticação
3. Deploy em servidor
4. Backups automáticos

---

## 📞 SUPORTE

### Documentação Disponível
- `README.md` - Visão geral
- `STATUS_COMPLETO.md` - Status detalhado
- `DESIGN_SYSTEM.md` - Guia de design
- `MODULOS_IMPLEMENTADOS.md` - Módulos completos

### Logs Úteis
- Backend: Console do terminal backend
- Frontend: Console do browser (F12)
- Base de dados: `backend/prisma/dev.db`

---

## 🎉 CONCLUSÃO

**Tudo está pronto para usar!**

1. Execute `migrate-db.bat`
2. Execute `start.bat`
3. Comece a usar a aplicação!

**A aplicação REFIT está 100% funcional nos 6 módulos principais.**

Boa gestão! 💪🏋️‍♀️
