# 🚀 Guia de Configuração Rápida - REFIT Dashboard

## ✅ Estado Atual

- ✅ Frontend instalado (React 19 + TypeScript + Vite + TailwindCSS)
- ✅ Backend instalado (Node.js + Express + Prisma)
- ✅ Prisma Client gerado
- ⚠️ **Falta:** PostgreSQL configurado

## 📋 Próximos Passos

### 1. Configurar PostgreSQL

Tens 3 opções:

#### Opção A: PostgreSQL Local
```bash
# Instalar PostgreSQL 14+
# Criar base de dados
createdb refit_db
```

#### Opção B: Docker
```bash
docker run --name refit-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=refit_db -p 5432:5432 -d postgres:14
```

#### Opção C: Cloud (Supabase/Neon/Railway)
- Criar projeto gratuito
- Copiar connection string

### 2. Atualizar .env

Editar `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/refit_db?schema=public"
JWT_SECRET="change-this-to-random-secret"
PORT=4000
NODE_ENV=development
```

### 3. Inicializar Base de Dados

```bash
cd backend
npm run db:push      # Criar tabelas
npm run db:seed      # Popular dados de demonstração
```

### 4. Executar Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# 🚀 REFIT API running on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# ➜ Local: http://localhost:5173
```

### 5. Aceder Dashboard

Abrir **http://localhost:5173**

## 🎯 Funcionalidades Disponíveis

### ✅ Implementado

- **6 KPI Cards** com crescimento e tendências
- **Receita por Serviço** (gráfico barras)
- **Clientes Ativos/Inativos** (donut chart)
- **Novos Clientes** com taxa de crescimento
- **Alertas Automáticos** (6 tipos)
- **Receita por Mês** (área + tendência)
- **Despesas por Categoria** (barras horizontais)
- **Objetivos** com barras de progresso
- **Fluxo Financeiro** (gráfico + tabela)
- **Próximas Datas** (eventos agendados)
- **Dark Mode** (toggle automático)
- **Exportação PDF** (jsPDF)
- **Exportação Excel** (xlsx)
- **Impressão** otimizada
- **Pesquisa** em tempo real
- **Atualização automática** (60s)
- **Loading skeletons**
- **Empty states**
- **Error states**
- **Tooltips** informativos
- **Responsivo** (mobile/tablet/desktop)

### 📊 Métricas Calculadas

- MRR / ARR
- Margem líquida / bruta
- EBITDA
- Ticket médio
- Receita por cliente
- Churn / Retenção
- LTV / CAC
- ROI
- Burn rate
- Ponto de equilíbrio
- Cash flow
- Custos fixos/variáveis

### 🎨 Design

- Fundo branco/escuro (dark mode)
- Header preto com logo REFIT
- Cards arredondados com sombras suaves
- Paleta: Verde, Vermelho, Azul, Laranja, Roxo
- Espaçamento consistente
- Animações suaves (fade-up)
- Tipografia Inter

## 🔧 Comandos Úteis

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
npm run dev         # Desenvolvimento (watch)
npm run build       # Build produção
npm start           # Executar build
npm run db:generate # Gerar Prisma Client
npm run db:push     # Sincronizar schema
npm run db:seed     # Popular dados
npm run db:studio   # Prisma Studio (GUI)
```

## 📁 Estrutura do Projeto

```
refit-dashboard/
├── frontend/                    # React 19 + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/      # KPIs, gráficos, alertas
│   │   │   └── ui/             # Card, Button, Badge, etc
│   │   ├── context/            # ThemeContext
│   │   ├── hooks/              # useDashboard
│   │   ├── lib/                # utils, export
│   │   ├── pages/              # DashboardPage
│   │   ├── services/           # API + mockData
│   │   └── types/              # TypeScript types
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── backend/                     # Node.js + Express
    ├── prisma/
    │   └── schema.prisma       # Modelos de dados
    ├── src/
    │   ├── lib/                # db.ts (Prisma client)
    │   ├── routes/             # dashboard.ts
    │   ├── services/           # metricsService, alertsService
    │   ├── seed.ts             # Dados de demonstração
    │   └── server.ts           # Express server
    ├── .env                    # Variáveis de ambiente
    └── package.json
```

## 🌐 Endpoints API

- `GET /api/dashboard?month=7&year=2026` - Dashboard completo
- `GET /health` - Health check

## 🔐 Login (após seed)

- **Email:** `admin@refit.pt`
- **Password:** `admin123`

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verificar se PostgreSQL está a correr
- Confirmar DATABASE_URL no .env
- Testar conexão: `npm run db:studio`

### Erro: "Port 4000 already in use"
- Alterar PORT no backend/.env
- Atualizar proxy no frontend/vite.config.ts

### Frontend não carrega dados
- Verificar se backend está a correr (http://localhost:4000/health)
- Abrir DevTools > Network
- Se API offline, usa dados de demonstração automaticamente

## 📦 Dependências Principais

### Frontend
- react@19.0.0
- typescript@5.7.3
- vite@6.1.0
- tailwindcss@3.4.17
- recharts@2.15.1
- @tanstack/react-query@5.66.0
- lucide-react@0.474.0
- jspdf@2.5.2
- xlsx@0.18.5

### Backend
- express@4.21.2
- @prisma/client@6.2.0
- typescript@5.7.3
- bcryptjs@2.4.3
- jsonwebtoken@9.0.2
- cors@2.8.5

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
# Configurar variáveis de ambiente
npm start
```

## 📝 Notas

- **Modo Demo:** Se a API não estiver disponível, o frontend usa dados de demonstração (mockData.ts)
- **Atualização Automática:** Dashboard atualiza a cada 60 segundos
- **Responsivo:** Testado em mobile, tablet e desktop
- **Dark Mode:** Persiste no localStorage
- **Clean Architecture:** Separação clara entre UI, lógica e dados

---

**Desenvolvido com React 19, TypeScript, TailwindCSS, Prisma e PostgreSQL**
