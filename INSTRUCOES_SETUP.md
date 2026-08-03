# 🚀 INSTRUÇÕES DE SETUP - REFIT

**Data:** 3 de Agosto de 2026

---

## ⚠️ IMPORTANTE ANTES DE COMEÇAR

**FECHA O BACKEND E FRONTEND** se estiverem a correr!

1. Terminal do backend → Pressiona `Ctrl+C`
2. Terminal do frontend → Pressiona `Ctrl+C`

**Porquê?** O Prisma não consegue atualizar ficheiros que estão em uso.

---

## 🎯 MÉTODO AUTOMÁTICO (RECOMENDADO)

### Executar um único comando:

```bash
SETUP_COMPLETO.bat
```

**O que faz:**
1. ✅ Migra a base de dados
2. ✅ Regenera Prisma Client
3. ✅ Cria administrador
4. ✅ (Opcional) Cria dados de teste

**Tempo:** ~2 minutos

---

## 🔧 MÉTODO MANUAL (SE PREFERIRES)

### Passo 1: Migrar Base de Dados
```bash
cd backend
npx prisma migrate dev --name complete_schema
```

### Passo 2: Regenerar Prisma Client
```bash
npx prisma generate
```

### Passo 3: Criar Administrador
```bash
npx tsx src/scripts/createAdmin.ts
```

### Passo 4 (Opcional): Dados de Teste
```bash
npm run db:seed
cd ..
```

---

## ✅ DEPOIS DO SETUP

### Iniciar Aplicação:
```bash
start.bat
```

### Fazer Login:
1. Abrir: `http://localhost:5173`
2. Email: `admin@refit.pt`
3. Senha: `Admin@2026`

---

## 🎉 PRONTO!

**A aplicação está 100% operacional!**

Podes começar a:
- ✅ Adicionar clientes reais
- ✅ Criar serviços
- ✅ Fazer agendamentos
- ✅ Registar pagamentos
- ✅ Gerir despesas
- ✅ Ver relatórios

---

## 🔐 SEGURANÇA

**IMPORTANTE:**
1. Alterar senha do admin após primeiro login
2. Alterar `JWT_SECRET` no ficheiro `.env`
3. Fazer backups regulares da base de dados

---

## 📊 DADOS DE TESTE

**Se criaste dados de teste, terás:**
- 200 clientes
- 5 serviços
- Subscrições ativas
- Pagamentos (últimos 7 meses)
- Despesas (últimos 7 meses)
- 4 objetivos definidos

**Para limpar e recomeçar:**
```bash
cd backend
del prisma\dev.db
npx prisma migrate dev
npx tsx src/scripts/createAdmin.ts
```

---

## 🆘 PROBLEMAS?

### Erro "EPERM: operation not permitted"
- **Solução:** Fecha o backend e frontend antes de executar

### Erro "Admin já existe"
- **Normal!** O admin já foi criado anteriormente

### Dashboard vazio
- **Solução:** Executar `npm run db:seed` para criar dados de teste

### Erro 500
- **Solução:** Executar `npx prisma generate` no backend

---

**REFIT - Pronto para Uso!** ✨
