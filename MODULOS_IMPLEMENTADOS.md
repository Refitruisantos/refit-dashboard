# 📋 Módulos Implementados - REFIT Dashboard

## ✅ Módulos Completos

### 1. Dashboard
- KPIs com cores semânticas (verde/vermelho/azul)
- Gráficos e métricas financeiras
- Resumo executivo
- Design System aplicado

### 2. Clientes
- CRUD completo de clientes
- Formulário com dados pessoais
- Seleção de serviço e frequência semanal
- Cálculo automático de mensalidade
- Integração com subscrições

### 3. Serviços
- CRUD completo de serviços
- Gestão de preços e durações
- Exemplos de mensalidade
- Ativar/desativar serviços
- Seed inicial (Pilates, Hybrid, Treino Personalizado)

### 4. Agenda (Backend Completo)
**Treinos/Marcações (Appointments)**
- Cliente, Serviço, Personal Trainer
- Data, hora, duração
- Status: scheduled, confirmed, completed, cancelled, no-show
- Observações

**Eventos REFIT (Events)**
- Nome, categoria, descrição
- Data início/fim, hora, local
- Responsável, participantes
- Orçamento previsto/real
- Status: idea, planned, confirmed, completed, cancelled
- Duplicar eventos
- Observações

### 5. Pagamentos (Completo)
**Backend**
- CRUD completo
- Resumo mensal (total recebido, pendente, em atraso)
- Filtros (cliente, status, período)
- Métodos: MB Way, Transferência, Numerário, Cartão, Outro
- Status: Pago, Pendente, Em Atraso, Cancelado

**Frontend**
- PaymentForm com auto-preenchimento
- PagamentosPage com resumo e tabela
- Filtros e pesquisa
- Cores semânticas (verde=pago, vermelho=atraso, amarelo=pendente)

## 🎨 Design System

### Paleta de Cores
- **Azul-marinho** (`primary`): Menu lateral, botões principais, ícones
- **Branco** (`card`): Cards, formulários
- **Verde** (`success`): Receitas, lucros, pagamentos recebidos
- **Vermelho** (`destructive`): Despesas, atrasos, ações destrutivas
- **Amarelo** (`warning`): Avisos, pendências
- **Cinza** (`muted`): Texto secundário, bordas

### Componentes
- Sidebar azul-marinho
- Cards brancos com sombras suaves
- Botões com variantes (primary, success, destructive)
- Formulários consistentes
- KPIs com cores semânticas

## 🗄️ Base de Dados

### Models Prisma
1. **User** - Utilizadores do sistema
2. **Client** - Clientes
3. **Service** - Serviços (Pilates, Hybrid, etc.)
4. **Subscription** - Subscrições ativas
5. **Payment** - Pagamentos (mensalidades previstas e recebidas)
6. **Expense** - Despesas
7. **Attendance** - Presenças
8. **Assessment** - Avaliações físicas
9. **ClientGoal** - Objetivos dos clientes
10. **Goal** - Metas do negócio
11. **Appointment** - Agenda de treinos
12. **Event** - Planeamento REFIT

### Conceito: Mensalidade Prevista vs Recebida
- **Subscription.price** = Mensalidade prevista (€100/mês)
- **Payment** = Pagamento efetivo
  - `status: pending` = A receber (não conta para receita)
  - `status: paid` = Recebido (conta para receita)
  - `status: overdue` = Em atraso
  - `status: cancelled` = Cancelado

## 🔌 API Endpoints

### Clientes
- `GET /api/clients` - Listar
- `POST /api/clients` - Criar (com subscrição automática)
- `PUT /api/clients/:id` - Atualizar
- `DELETE /api/clients/:id` - Eliminar

### Serviços
- `GET /api/services` - Listar
- `POST /api/services` - Criar
- `PUT /api/services/:id` - Atualizar
- `DELETE /api/services/:id` - Eliminar
- `PATCH /api/services/:id/toggle` - Ativar/Desativar

### Pagamentos
- `GET /api/payments` - Listar (com filtros)
- `GET /api/payments/summary` - Resumo mensal
- `POST /api/payments` - Criar
- `PUT /api/payments/:id` - Atualizar
- `DELETE /api/payments/:id` - Eliminar
- `PATCH /api/payments/:id/mark-paid` - Marcar como pago

### Agenda
- `GET /api/appointments` - Listar treinos
- `POST /api/appointments` - Criar treino
- `PUT /api/appointments/:id` - Atualizar
- `DELETE /api/appointments/:id` - Eliminar
- `PATCH /api/appointments/:id/status` - Atualizar status

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `PUT /api/events/:id` - Atualizar
- `DELETE /api/events/:id` - Eliminar
- `POST /api/events/:id/duplicate` - Duplicar

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
start.bat              # Inicia backend + frontend
setup-db.bat          # Configura base de dados
reset-db.bat          # Reseta base de dados
migrate-db.bat        # Aplica novas migrações
seed-services.bat     # Popula serviços iniciais
```

### Ordem de Execução (Primeira Vez)
1. `setup-db.bat` - Criar base de dados
2. `seed-services.bat` - Adicionar serviços
3. `start.bat` - Iniciar aplicação

### Após Alterações no Schema
1. `migrate-db.bat` - Aplicar migrações
2. Reiniciar backend

## 🚀 Próximos Módulos

### Pendentes de Implementação
1. **Agenda (Frontend)** - Interface de calendário
2. **Despesas** - Gestão de custos
3. **Fluxo de Caixa** - Projeções financeiras
4. **Relatórios** - Exportação e análises
5. **Objetivos** - Metas e KPIs
6. **Configurações** - Preferências do sistema

## 🔄 Integrações

### Dashboard Automático
- Pagamentos alimentam receita
- Despesas alimentam custos
- Lucro calculado automaticamente
- KPIs atualizados em tempo real

### Validações
- Email único por cliente
- Serviço único por nome
- Valores positivos
- Datas válidas

## 📝 Notas Importantes

1. **Todos os dados são persistentes** - Nada é fixo no código
2. **API REST completa** - CRUD em todos os módulos
3. **Design System consistente** - Cores e componentes padronizados
4. **Invalidação automática** - React Query atualiza dados
5. **Filtros e pesquisa** - Em todas as listagens
6. **Formulários inteligentes** - Auto-preenchimento quando possível

## 🎯 Status Atual

- ✅ Backend: 100% funcional
- ✅ Frontend: Clientes, Serviços, Pagamentos
- ⏳ Frontend: Agenda (pendente)
- ⏳ Outros módulos: Pendentes

**Aplicação pronta para uso em produção nos módulos implementados!**
