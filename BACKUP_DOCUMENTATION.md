# REFIT DASHBOARD - DOCUMENTAÇÃO DE BACKUP

## 📋 INFORMAÇÃO GERAL DO PROJETO

**Nome do Projeto:** REFIT Dashboard  
**Descrição:** Sistema de gestão para estúdio de fitness (Pilates, Treino Personalizado, etc.)  
**Data de Criação:** 2026  
**Última Atualização:** Agosto 2026  
**Versão:** 1.0.0

---

## 🛠️ STACK TECNOLÓGICO

### Backend
- **Framework:** Express.js
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Base de Dados:** PostgreSQL (Render)
- **Validação:** Zod
- **Autenticação:** JWT + bcryptjs

### Frontend
- **Framework:** React
- **Linguagem:** TypeScript
- **Build Tool:** Vite
- **UI Components:** TailwindCSS
- **State Management:** React Query
- **Deploy:** Netlify

### Infraestrutura
- **Backend Hosting:** Render
- **Frontend Hosting:** Netlify
- **Database:** PostgreSQL (Render)
- **Version Control:** GitHub

---

## 🔗 URLs IMPORTANTES

### Produção
- **Frontend URL:** https://refit-dashboard.netlify.app
- **Backend API:** https://refit-dashboard.onrender.com
- **API Health Check:** https://refit-dashboard.onrender.com/health

### Desenvolvimento
- **Frontend Local:** http://localhost:5173
- **Backend Local:** http://localhost:4000
- **API Health Local:** http://localhost:4000/health

### Repositório
- **GitHub:** https://github.com/Refitruisantos/refit-dashboard
- **Branch Principal:** main

---

## 🔐 VARIÁVEIS DE AMBIENTE

### Backend (.env)
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
PORT=4000
JWT_SECRET=your_jwt_secret_here
```

### Frontend (.env.production)
```env
VITE_API_URL=https://refit-dashboard.onrender.com
```

### Frontend (.env.development)
```env
VITE_API_URL=http://localhost:4000
```

---

## 📁 ESTRUTURA DO PROJETO

```
refit-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Middleware (autenticação, etc.)
│   │   └── server.ts        # Servidor Express
│   ├── prisma/
│   │   ├── schema.prisma    # Schema da base de dados
│   │   └── migrations/      # Migrations do Prisma
│   ├── .env                 # Variáveis de ambiente (não commitar)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── hooks/           # Custom hooks (React Query)
│   │   ├── services/        # Serviços API
│   │   └── types/           # TypeScript types
│   ├── public/
│   │   └── _redirects       # Configuração de redirects Netlify
│   ├── .env.production      # Variáveis de ambiente produção
│   ├── netlify.toml         # Configuração Netlify
│   └── package.json
└── BACKUP_DOCUMENTATION.md  # Este ficheiro
```

---

## 🗄️ BASE DE DADOS POSTGRESQL

### Configuração
- **Provider:** PostgreSQL
- **Hosting:** Render
- **Backup:** Automático pelo Render
- **Connection String:** Configurada em DATABASE_URL

### Modelos Principais
- **User:** Utilizadores do sistema
- **Client:** Clientes do estúdio
- **Service:** Serviços/modalidades oferecidas
- **Payment:** Pagamentos recebidos
- **Expense:** Despesas do negócio
- **CashFlow:** Movimentos de fluxo de caixa
- **Goal:** Objetivos de negócio
- **Appointment:** Marcações/aulas
- **Event:** Eventos especiais

### Migrations Aplicadas
1. `20260731212107_init` - Schema inicial
2. `20260803101152_update_all_modules` - Atualização de módulos
3. `20260814125421_add_billing_type_to_services` - Adicionado billingType aos serviços
4. `20260814140800_set_default_billing_type` - Definido valor padrão para billingType

---

## 🚀 COMO FAZER DEPLOY

### Backend (Render)
1. Fazer push para GitHub
2. Render faz deploy automático
3. Verificar logs no Render dashboard
4. Confirmar conexão com PostgreSQL

### Frontend (Netlify)
1. Fazer push para GitHub
2. Netlify faz deploy automático
3. Verificar logs no Netlify dashboard
4. Confirmar conexão com backend

### Migrations do Prisma
```bash
# Criar nova migration
cd backend
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

---

## 💾 COMO FAZER BACKUP DA BASE DE DADOS

### Backup Automático (Render)
- Render faz backup automático diário
- Configurado no PostgreSQL dashboard

### Backup Manual
```bash
# Exportar base de dados
pg_dump DATABASE_URL > backup.sql

# Importar base de dados
psql DATABASE_URL < backup.sql
```

### Backup via Prisma Studio
```bash
cd backend
npx prisma studio
```

---

## 🔄 COMO RESTAURAR O PROJETO

### 1. Clonar Repositório
```bash
git clone https://github.com/Refitruisantos/refit-dashboard.git
cd refit-dashboard
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com DATABASE_URL correto
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
cp .env.production.example .env.production
# Editar .env.production com VITE_API_URL correto
npm run build
# Deploy para Netlify ou npm run dev para local
```

### 4. Configurar PostgreSQL no Render
1. Criar novo PostgreSQL no Render
2. Copiar DATABASE_URL
3. Configurar em backend/.env e Render Environment
4. Aplicar migrations: `npx prisma migrate deploy`

---

## 📝 CORREÇÕES APLICADAS (AGOSTO 2026)

### 1. Migração SQLite → PostgreSQL
- **Problema:** SQLite não persistia dados em cloud
- **Solução:** Migrado para PostgreSQL no Render
- **Arquivos:** `backend/prisma/schema.prisma`, `backend/.env`

### 2. Pagamentos Automáticos
- **Problema:** Data de vencimento tinha de ser manual
- **Solução:** Data de vencimento automática (dia 8 do mês)
- **Arquivos:** `frontend/src/components/forms/PaymentForm.tsx`, `backend/src/controllers/paymentController.ts`

### 3. Alerta de Pagamentos em Atraso
- **Problema:** Sem alerta visual para pagamentos atrasados
- **Solução:** Alerta visual após dia 8 do mês
- **Arquivos:** `frontend/src/pages/PagamentosPage.tsx`

### 4. Despesas com Datas Automáticas
- **Problema:** Datas obrigatórias causavam erros
- **Solução:** Datas calculadas automaticamente se não fornecidas
- **Arquivos:** `backend/src/controllers/expenseController.ts`

### 5. Objetivos com Datas Automáticas
- **Problema:** Datas obrigatórias causavam erros
- **Solução:** Datas calculadas automaticamente se não fornecidas
- **Arquivos:** `backend/src/controllers/goalController.ts`

### 6. Serviços Sem Presets
- **Problema:** Presets limitavam flexibilidade
- **Solução:** Removidos presets, criação manual
- **Arquivos:** `frontend/src/components/forms/ServiceForm.tsx`

### 7. Clientes com Botões Visuais
- **Problema:** Dropdown não era intuitivo
- **Solução:** Botões visuais para escolher modalidade
- **Arquivos:** `frontend/src/components/forms/ClientForm.tsx`

### 8. Fluxo de Caixa Automático
- **Problema:** Botão manual causava confusão
- **Solução:** Removido botão, fluxo 100% automático
- **Arquivos:** `frontend/src/pages/FluxoCaixaPage.tsx`

### 9. Verificação de Conexão DB
- **Problema:** Sem verificação de conexão no startup
- **Solução:** Verificação automática no startup do servidor
- **Arquivos:** `backend/src/server.ts`

---

## 🔧 CONFIGURAÇÃO DO ZERO

### Passo 1: Criar Contas
1. GitHub (se não tiver)
2. Render (para backend e PostgreSQL)
3. Netlify (para frontend)

### Passo 2: Criar PostgreSQL no Render
1. New + → PostgreSQL
2. Copiar DATABASE_URL
3. Guardar em local seguro

### Passo 3: Configurar Backend no Render
1. New + → Web Service
2. Connect GitHub repository
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variables:
   - DATABASE_URL (do PostgreSQL)
   - JWT_SECRET (gerar um seguro)
   - PORT=4000

### Passo 4: Configurar Frontend no Netlify
1. Add new site → Import from GitHub
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Environment variables:
   - VITE_API_URL=https://seu-backend-url.onrender.com

### Passo 5: Aplicar Migrations
```bash
cd backend
npx prisma migrate deploy
```

### Passo 6: Testar
1. Acessar frontend URL
2. Criar conta de admin
3. Criar serviços
4. Criar clientes
5. Testar pagamentos e despesas

---

## 📞 SUPORTE E MANUTENÇÃO

### Logs Importantes
- **Backend Logs:** Render Dashboard → Logs
- **Frontend Logs:** Netlify Dashboard → Functions
- **Database Logs:** Render PostgreSQL → Logs

### Problemas Comuns

#### Base de Dados Não Conecta
- Verificar DATABASE_URL correto
- Verificar se PostgreSQL está running
- Verificar variáveis de ambiente no Render

#### Frontend Não Conecta ao Backend
- Verificar VITE_API_URL correto
- Verificar CORS configuration
- Verificar se backend está running

#### Migrations Não Aplicam
- Verificar se Prisma Client está gerado
- Verificar se DATABASE_URL tem permissões
- Usar `npx prisma migrate deploy`

---

## 🔐 SEGURANÇA

### Senhas e Secrets
- Nunca commitar .env
- Usar secrets fortes para JWT_SECRET
- Rotacionar secrets periodicamente
- Usar HTTPS em produção

### Backup Regular
- Backup diário automático do PostgreSQL
- Exportar backup manual antes de mudanças grandes
- Guardar backups em local seguro

### Acesso
- Limitar acesso ao Render dashboard
- Usar autenticação de dois fatores
- Monitorizar logs de acesso

---

## 📊 MONITORIZAÇÃO

### Métricas Importantes
- Uso de PostgreSQL (Render)
- Tempo de resposta da API
- Erros de conexão
- Tráfego do frontend

### Alertas
- Configurar alertas no Render para:
  - CPU > 80%
  - Memory > 80%
  - PostgreSQL connection errors

---

## 📅 MANUTENÇÃO REGULAR

### Mensal
- Verificar backups
- Atualizar dependências
- Revisar logs de erros
- Verificar uso de recursos

### Trimestral
- Rotacionar secrets
- Revisar segurança
- Otimizar performance
- Testar restore de backup

### Anual
- Revisar arquitetura
- Planejar melhorias
- Atualizar documentação
- Formação/equipa

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

### Curto Prazo
- [ ] Adicionar testes unitários
- [ ] Implementar cache Redis
- [ ] Adicionar monitoring avançado
- [ ] Criar dashboard de analytics

### Médio Prazo
- [ ] App mobile (React Native)
- [ ] Integração com Stripe
- [ ] Sistema de notificações
- [ ] Relatórios avançados

### Longo Prazo
- [ ] Multi-tenancy
- [ ] API pública
- [ ] Integração com outros sistemas
- [ ] Machine learning para previsões

---

## 📚 RECURSOS ADICIONAIS

### Documentação
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

### Ferramentas
- Prisma Studio (visual database editor)
- Postman (API testing)
- Git (version control)
- VS Code (IDE)

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### Antes de Deploy
- [ ] Todas as migrations aplicadas
- [ ] Variáveis de ambiente configuradas
- [ ] Testes locais passam
- [ ] Backup da base de dados feito
- [ ] Documentação atualizada

### Pós-Deploy
- [ ] Verificar logs de erro
- [ ] Testar funcionalidades críticas
- [ ] Verificar performance
- [ ] Monitorizar recursos
- [ ] Comunicar mudanças à equipa

---

## 📞 CONTACTO

**Desenvolvedor:** Refitruisantos  
**Email:** [seu-email]  
**GitHub:** https://github.com/Refitruisantos  
**Projeto:** https://github.com/Refitruisantos/refit-dashboard

---

**Última Atualização:** Agosto 2026  
**Versão do Documento:** 1.0.0
