# ⚡ DEPLOY RÁPIDO - 5 MINUTOS

---

## 📋 COMANDOS PARA COPIAR E COLAR

### 1️⃣ SUBIR PARA GITHUB

```bash
# Navegar para o projeto
cd c:\Users\sorai\CascadeProjects\refit-dashboard

# Inicializar Git
git init

# Adicionar ficheiros
git add .

# Commit
git commit -m "REFIT Dashboard - Production Ready"

# SUBSTITUIR "SEU_USERNAME" pelo teu username do GitHub!
git remote add origin https://github.com/SEU_USERNAME/refit-dashboard.git

# Push
git branch -M main
git push -u origin main
```

---

### 2️⃣ CRIAR REPOSITÓRIO GITHUB

1. Ir a: **https://github.com/new**
2. Nome: `refit-dashboard`
3. Private ✅
4. Create repository

---

### 3️⃣ DEPLOY NO RENDER

1. Ir a: **https://render.com**
2. Sign up with GitHub
3. New + → Web Service
4. Conectar `refit-dashboard`
5. Configurar:

```
Name: refit-api
Region: Frankfurt
Root Directory: backend
Build Command: npm install && npx prisma generate && npm run build
Start Command: npx prisma migrate deploy && npm start
```

**Environment Variables:**
```
NODE_ENV = production
PORT = 4000
JWT_SECRET = [Generate]
DATABASE_URL = file:./prod.db
```

6. Create Web Service
7. Aguardar 5-10 minutos

---

### 4️⃣ CRIAR ADMIN

No Render:
1. Service → Shell → Launch Shell
2. Executar:

```bash
npx tsx src/scripts/createAdmin.ts
```

---

## ✅ PRONTO!

**URL da API:**
```
https://refit-api.onrender.com/api
```

**Testar:**
```bash
curl https://refit-api.onrender.com/api/auth/login/admin
```

---

## 📱 USAR NA APP

```javascript
const API_URL = 'https://refit-api.onrender.com/api';
```

**FIM! 🚀**
