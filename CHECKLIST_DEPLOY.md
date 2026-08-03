# ✅ CHECKLIST DE DEPLOY

---

## 📋 ANTES DE COMEÇAR

- [ ] Código está a funcionar localmente
- [ ] Executaste `SETUP_COMPLETO.bat`
- [ ] Backend e frontend estão fechados

---

## 🔐 CONTAS NECESSÁRIAS

- [ ] Conta GitHub (https://github.com/signup)
- [ ] Conta Render (https://render.com - usar GitHub)

---

## 📤 GITHUB

- [ ] Criar repositório: https://github.com/new
  - Nome: `refit-dashboard`
  - Private: ✅
  - Não adicionar README/gitignore

- [ ] Subir código:
  ```bash
  git init
  git add .
  git commit -m "Production ready"
  git remote add origin https://github.com/SEU_USERNAME/refit-dashboard.git
  git push -u origin main
  ```

---

## 🚀 RENDER

- [ ] Criar conta: https://render.com (Sign up with GitHub)

- [ ] Criar Web Service:
  - New + → Web Service
  - Conectar repositório `refit-dashboard`

- [ ] Configurar:
  - Name: `refit-api`
  - Region: `Frankfurt`
  - Root Directory: `backend`
  - Build: `npm install && npx prisma generate && npm run build`
  - Start: `npx prisma migrate deploy && npm start`

- [ ] Environment Variables:
  - `NODE_ENV` = `production`
  - `PORT` = `4000`
  - `JWT_SECRET` = [Generate]
  - `DATABASE_URL` = `file:./prod.db`

- [ ] Create Web Service

- [ ] Aguardar deploy (~5-10 min)

---

## 👤 CRIAR ADMIN

- [ ] Render → Service → Shell → Launch Shell
- [ ] Executar: `npx tsx src/scripts/createAdmin.ts`
- [ ] Verificar credenciais:
  - Email: `admin@refit.pt`
  - Senha: `Admin@2026`

---

## ✅ TESTAR

- [ ] Abrir URL: `https://refit-api.onrender.com`
- [ ] Testar endpoint:
  ```bash
  curl https://refit-api.onrender.com/api/auth/login/admin
  ```

---

## 📱 CONFIGURAR APP MOBILE

- [ ] Atualizar URL da API:
  ```javascript
  const API_URL = 'https://refit-api.onrender.com/api';
  ```

- [ ] Testar registro:
  ```javascript
  fetch(`${API_URL}/auth/register`, {...})
  ```

- [ ] Testar login:
  ```javascript
  fetch(`${API_URL}/auth/login/client`, {...})
  ```

---

## 🎉 CONCLUÍDO!

- [ ] API pública funcionando
- [ ] HTTPS ativo
- [ ] Admin criado
- [ ] Pronta para mobile

---

**URL FINAL:** `https://refit-api.onrender.com/api`

**Data de deploy:** ___/___/______

**Notas:**
_________________________________
_________________________________
_________________________________
