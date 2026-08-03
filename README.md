# 🏋️ REFIT Dashboard

Dashboard financeiro premium para gestão completa de estúdio de fitness.

## 🚀 Início Rápido (Duplo Click)

**Basta fazer duplo click no arquivo:**

```
start.bat
```

Isto irá:
- ✅ Verificar dependências
- ✅ Instalar pacotes (se necessário)
- ✅ Gerar Prisma Client
- ✅ Criar arquivo .env automaticamente
- ✅ Iniciar Backend em janela separada
- ✅ Iniciar Frontend em janela separada
- ✅ Abrir browser automaticamente em http://localhost:5173

**Alternativa PowerShell:**
```powershell
.\start.ps1
```

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (autenticação)
- **bcryptjs** (hashing)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clonar e instalar dependências

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configurar base de dados

```bash
cd backend
cp .env.example .env
```

Editar `.env` com as credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/refit_db?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=4000
```

### 3. Inicializar base de dados

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Executar em desenvolvimento

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Aceder a **http://localhost:5173**

## 🎯 Funcionalidades

### KPIs
- Clientes ativos
- Receita do mês
- Despesas
- Lucro
- Pagamentos pendentes
- Despesas pendentes

### Gráficos
- **Receita por serviço** (barras)
- **Clientes ativos/inativos** (donut)
- **Receita mensal** (área com tendência)
- **Despesas por categoria** (barras horizontais)
- **Fluxo financeiro** (áreas múltiplas + tabela)

### Alertas Automáticos
- Pagamentos em atraso
- Despesas pendentes
- Meta de receita
- Clientes ativos
- Fluxo de caixa
- Lucro negativo

### Métricas Calculadas
- MRR / ARR
- Margem líquida / bruta
- EBITDA
- Ticket médio
- Churn / Retenção
- LTV / CAC
- ROI
- Burn rate
- Ponto de equilíbrio

### Exportação
- **PDF** (relatório completo)
- **Excel** (dados tabulares)
- **Impressão** (otimizada)

### UX
- Dark mode
- Loading skeletons
- Empty states
- Error states
- Tooltips
- Pesquisa em tempo real
- Atualização automática (60s)
- Totalmente responsivo

## 🗂️ Estrutura

```
refit-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/    # Componentes do dashboard
│   │   │   └── ui/            # Primitivas UI
│   │   ├── context/           # React Context
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilitários
│   │   ├── pages/             # Páginas
│   │   ├── services/          # API + mock data
│   │   └── types/             # TypeScript types
│   └── package.json
└── backend/
    ├── prisma/
    │   └── schema.prisma      # Modelos de dados
    ├── src/
    │   ├── lib/               # Database client
    │   ├── routes/            # Endpoints API
    │   ├── services/          # Lógica de negócio
    │   ├── seed.ts            # Dados de demonstração
    │   └── server.ts          # Express server
    └── package.json
```

## 🔐 Autenticação

Login de demonstração:
- **Email:** `admin@refit.pt`
- **Password:** `admin123`

## 📊 Endpoints API

- `GET /api/dashboard?month=7&year=2026` - Dashboard completo
- `GET /api/finance` - Métricas financeiras
- `GET /api/expenses` - Despesas
- `GET /api/payments` - Pagamentos
- `GET /api/clients` - Clientes
- `GET /api/reports` - Relatórios
- `GET /api/cashflow` - Fluxo de caixa
- `GET /api/goals` - Objetivos
- `GET /api/alerts` - Alertas

## 🎨 Design

- Fundo branco / escuro
- Header preto
- Cards com cantos arredondados
- Sombras suaves
- Espaçamento consistente
- Layout em grid responsivo
- Paleta: Verde, Vermelho, Azul, Laranja, Roxo

## 📝 Scripts

### Frontend
```bash
npm run dev       # Desenvolvimento
npm run build     # Build produção
npm run preview   # Preview build
npm run lint      # ESLint
npm run format    # Prettier
```

### Backend
```bash
npm run dev         # Desenvolvimento (watch mode)
npm run build       # Build produção
npm start           # Executar build
npm run db:generate # Gerar Prisma Client
npm run db:push     # Sincronizar schema
npm run db:seed     # Popular dados
npm run db:studio   # Prisma Studio
```

## 🚢 Deploy

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy pasta dist/
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Configurar DATABASE_URL e JWT_SECRET
npm start
```

## 📄 Licença

Projeto desenvolvido para REFIT Studio.

---

**Desenvolvido com React 19, TypeScript, TailwindCSS e Prisma**
