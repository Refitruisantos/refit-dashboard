# Guia de Implementação Completa - REFIT Dashboard

## 📋 Visão Geral

Este guia detalha todos os passos necessários para transformar a aplicação REFIT Dashboard numa solução totalmente funcional e persistente com PostgreSQL.

## ✅ Progresso Atual

### Concluído:
1. ✅ Schema Prisma atualizado com:
   - Client (expandido com birthDate, address, notes)
   - Assessment (avaliações físicas)
   - ClientGoal (objetivos dos clientes)
   - Service, Subscription, Payment, Expense, Attendance, Goal

2. ✅ Controller CRUD completo para Clientes (`clientController.ts`)
3. ✅ Rotas para Clientes (`clientRoutes.ts`)

## 🚀 Próximos Passos

### 1. Migrar Base de Dados

```bash
cd backend
npx prisma migrate dev --name add_client_fields_and_assessments
npx prisma generate
```

### 2. Registar Rotas no Express

Editar `backend/src/index.ts`:

```typescript
import clientRoutes from './routes/clientRoutes';

// Adicionar após as rotas existentes
app.use('/api/clients', authMiddleware, clientRoutes);
```

### 3. Criar Controllers CRUD Restantes

#### A. Payment Controller (`paymentController.ts`)
- GET /api/payments
- GET /api/payments/:id
- POST /api/payments
- PUT /api/payments/:id
- DELETE /api/payments/:id
- PATCH /api/payments/:id/status (marcar como pago)

#### B. Expense Controller (`expenseController.ts`)
- GET /api/expenses
- GET /api/expenses/:id
- POST /api/expenses
- PUT /api/expenses/:id
- DELETE /api/expenses/:id
- PATCH /api/expenses/:id/pay (marcar como pago)

#### C. Service Controller (`serviceController.ts`)
- GET /api/services
- GET /api/services/:id
- POST /api/services
- PUT /api/services/:id
- DELETE /api/services/:id
- PATCH /api/services/:id/toggle (ativar/desativar)

#### D. Goal Controller (`goalController.ts`)
- GET /api/goals
- GET /api/goals/:id
- POST /api/goals
- PUT /api/goals/:id
- DELETE /api/goals/:id

#### E. Assessment Controller (`assessmentController.ts`)
- GET /api/clients/:clientId/assessments
- POST /api/clients/:clientId/assessments
- PUT /api/assessments/:id
- DELETE /api/assessments/:id

#### F. ClientGoal Controller (`clientGoalController.ts`)
- GET /api/clients/:clientId/goals
- POST /api/clients/:clientId/goals
- PUT /api/client-goals/:id
- DELETE /api/client-goals/:id
- PATCH /api/client-goals/:id/status

### 4. Atualizar Dashboard Controller

Modificar `dashboardController.ts` para calcular KPIs a partir de dados reais:

```typescript
// Exemplo de cálculo de KPIs reais
const activeClients = await prisma.client.count({
  where: {
    status: 'active',
    lastVisit: {
      gte: thirtyDaysAgo,
    },
  },
});

const revenue = await prisma.payment.aggregate({
  where: {
    status: 'paid',
    paidAt: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
  _sum: {
    amount: true,
  },
});
```

### 5. Frontend - Hooks Personalizados

#### A. `useClients.ts`
```typescript
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await fetch('/api/clients');
      return res.json();
    },
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateClientData) => {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

#### B. Hooks similares para:
- `usePayments.ts`
- `useExpenses.ts`
- `useServices.ts`
- `useGoals.ts`
- `useAssessments.ts`

### 6. Frontend - Formulários

#### A. ClientForm Component
```typescript
<Dialog>
  <DialogContent>
    <form onSubmit={handleSubmit}>
      <Input name="name" label="Nome" required />
      <Input name="email" type="email" label="Email" required />
      <Input name="phone" label="Telefone" />
      <Input name="birthDate" type="date" label="Data de Nascimento" />
      <Input name="address" label="Morada" />
      <Textarea name="notes" label="Observações" />
      <Select name="status" label="Estado">
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
      </Select>
      <Button type="submit">Guardar</Button>
    </form>
  </DialogContent>
</Dialog>
```

#### B. Formulários similares para:
- PaymentForm
- ExpenseForm
- ServiceForm
- GoalForm
- AssessmentForm

### 7. Atualizar ClientesPage

Substituir `mockClients` por dados reais:

```typescript
export function ClientesPage() {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  // Remover mockClients
  // Usar clients do hook
}
```

### 8. Remover Modo Demo

#### A. Remover `demoData.ts`
```bash
rm backend/src/data/demoData.ts
```

#### B. Atualizar `dashboardController.ts`
- Remover lógica de demo
- Usar apenas dados reais do Prisma

#### C. Atualizar `DashboardHeader.tsx`
- Remover prop `source`
- Remover badge "Demo"

### 9. Validações e Tratamento de Erros

#### A. Backend
- ✅ Zod schemas já implementados
- Adicionar middleware de validação global
- Logging de erros com Winston ou similar

#### B. Frontend
- Toast notifications para sucesso/erro
- Loading states
- Error boundaries

### 10. Auto-refresh do Dashboard

```typescript
// Em DashboardPage.tsx
const { refetch } = useDashboard({ month, year });

// Após qualquer mutação bem-sucedida
queryClient.invalidateQueries({ queryKey: ['dashboard'] });
```

### 11. Seed Database (Opcional)

Criar `prisma/seed.ts` com dados iniciais:

```typescript
async function main() {
  // Criar serviços padrão
  await prisma.service.createMany({
    data: [
      { name: 'Personal Training', price: 89.90, duration: 60 },
      { name: 'Plano Básico', price: 49.90, duration: 0 },
    ],
  });

  // Criar metas padrão
  await prisma.goal.createMany({
    data: [
      { metric: 'Receita Mensal', target: 10000, unit: '€', color: 'chart-1' },
    ],
  });
}
```

## 📝 Checklist Final

- [ ] Migrar base de dados
- [ ] Criar todos os controllers CRUD
- [ ] Criar todas as rotas
- [ ] Registar rotas no Express
- [ ] Criar hooks personalizados no frontend
- [ ] Criar formulários de criação/edição
- [ ] Atualizar todas as páginas para usar API real
- [ ] Remover dados mock
- [ ] Remover modo demo
- [ ] Implementar validações
- [ ] Implementar tratamento de erros
- [ ] Implementar auto-refresh
- [ ] Testar CRUD completo de cada módulo
- [ ] Testar atualização automática do dashboard
- [ ] Deploy em produção

## 🔧 Comandos Úteis

```bash
# Migrar base de dados
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate

# Ver base de dados
npx prisma studio

# Seed database
npx prisma db seed

# Build backend
npm run build

# Start backend
npm start

# Build frontend
npm run build

# Preview frontend
npm run preview
```

## 📚 Estrutura de Ficheiros Final

```
backend/
├── src/
│   ├── controllers/
│   │   ├── clientController.ts ✅
│   │   ├── paymentController.ts
│   │   ├── expenseController.ts
│   │   ├── serviceController.ts
│   │   ├── goalController.ts
│   │   ├── assessmentController.ts
│   │   └── clientGoalController.ts
│   ├── routes/
│   │   ├── clientRoutes.ts ✅
│   │   ├── paymentRoutes.ts
│   │   ├── expenseRoutes.ts
│   │   ├── serviceRoutes.ts
│   │   ├── goalRoutes.ts
│   │   ├── assessmentRoutes.ts
│   │   └── clientGoalRoutes.ts
│   └── index.ts
├── prisma/
│   ├── schema.prisma ✅
│   ├── seed.ts
│   └── migrations/

frontend/
├── src/
│   ├── hooks/
│   │   ├── useClients.ts
│   │   ├── usePayments.ts
│   │   ├── useExpenses.ts
│   │   ├── useServices.ts
│   │   └── useGoals.ts
│   ├── components/
│   │   ├── forms/
│   │   │   ├── ClientForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   └── ServiceForm.tsx
│   └── pages/
│       ├── ClientesPage.tsx ✅
│       ├── PagamentosPage.tsx
│       ├── DespesasPage.tsx
│       └── ServicosPage.tsx
```

## ⚠️ Notas Importantes

1. **Backup**: Fazer backup da base de dados antes de migrações
2. **Ambiente**: Configurar variáveis de ambiente (.env)
3. **Segurança**: Validar todos os inputs
4. **Performance**: Adicionar índices nas queries frequentes
5. **Testing**: Testar cada endpoint antes de integrar no frontend

## 🎯 Resultado Final

Aplicação totalmente funcional com:
- ✅ Persistência permanente em PostgreSQL
- ✅ CRUD completo para todos os módulos
- ✅ Validações e tratamento de erros
- ✅ Auto-refresh do dashboard
- ✅ Interface premium e responsiva
- ✅ Sem dados de demonstração
- ✅ Pronta para produção
