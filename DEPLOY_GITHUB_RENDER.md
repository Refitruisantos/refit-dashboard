# 🚀 DEPLOY GITHUB + RENDER - GUIA COMPLETO

**Data:** 3 de Agosto de 2026  
**Tempo estimado:** 15-20 minutos

---

## ✅ PRÉ-REQUISITOS

- [x] Código preparado (já está!)
- [ ] Conta GitHub (criar se não tiver)
- [ ] Conta Render (criar durante o processo)

---

## 📋 PASSO A PASSO

### PASSO 1: CRIAR REPOSITÓRIO NO GITHUB

#### 1.1 Criar Conta GitHub (se não tiver)
- Ir a: https://github.com/signup
- Seguir instruções

#### 1.2 Criar Novo Repositório
1. Ir a: https://github.com/new
2. **Repository name:** `refit-dashboard`
3. **Description:** `REFIT - Dashboard de Gestão de Fitness Studio`
4. **Visibilidade:** 
   - ✅ **Private** (recomendado - só tu vês)
   - ⬜ Public (qualquer pessoa vê)
5. **NÃO marcar:**
   - ❌ Add README
   - ❌ Add .gitignore
   - ❌ Choose license
6. Clicar em **"Create repository"**

---

### PASSO 2: SUBIR CÓDIGO PARA GITHUB

#### 2.1 Abrir Terminal no Projeto
```bash
# Navegar para a pasta do projeto
cd c:\Users\sorai\CascadeProjects\refit-dashboard
```

#### 2.2 Inicializar Git (se ainda não foi feito)
```bash
git init
```

#### 2.3 Adicionar Todos os Ficheiros
```bash
git add .
```

#### 2.4 Fazer Primeiro Commit
```bash
git commit -m "Initial commit - REFIT Dashboard ready for production"
```

#### 2.5 Conectar ao GitHub
```bash
# SUBSTITUIR "SEU_USERNAME" pelo teu username do GitHub!
git remote add origin https://github.com/SEU_USERNAME/refit-dashboard.git
```

**Exemplo:**
```bash
# Se o teu username for "joaosilva":
git remote add origin https://github.com/joaosilva/refit-dashboard.git
```

#### 2.6 Fazer Push
```bash
git branch -M main
git push -u origin main
```

**Se pedir credenciais:**
- Username: (teu username do GitHub)
- Password: (usar Personal Access Token, não a senha)

**Como criar Personal Access Token:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Marcar: `repo` (full control)
5. Copiar token e usar como password

---

### PASSO 3: CRIAR CONTA NO RENDER

#### 3.1 Ir ao Render
- URL: https://render.com

#### 3.2 Criar Conta
- Clicar em **"Get Started"**
- **Opção recomendada:** "Sign up with GitHub"
- Autorizar Render a aceder ao GitHub

---

### PASSO 4: DEPLOY NO RENDER

#### 4.1 Criar Web Service
1. No dashboard do Render, clicar em **"New +"**
2. Selecionar **"Web Service"**

#### 4.2 Conectar Repositório
1. Procurar por `refit-dashboard`
2. Clicar em **"Connect"**

#### 4.3 Configurar Service

**Configurações Básicas:**
```
Name: refit-api
Region: Frankfurt (mais perto de Portugal)
Branch: main
Runtime: Node
```

**Build & Deploy:**
```
Root Directory: backend
Build Command: npm install && npx prisma generate && npm run build
Start Command: npx prisma migrate deploy && npm start
```

**Instance Type:**
```
Free (0€/mês)
```

#### 4.4 Variáveis de Ambiente (Environment Variables)

Clicar em **"Advanced"** e adicionar:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `JWT_SECRET` | `[clicar em "Generate" para criar chave aleatória]` |
| `DATABASE_URL` | `file:./prod.db` |

#### 4.5 Criar Service
- Clicar em **"Create Web Service"**
- Aguardar deploy (~5-10 minutos)

---

### PASSO 5: VERIFICAR DEPLOY

#### 5.1 Aguardar Build
- Ver logs em tempo real
- Aguardar mensagem: **"Your service is live 🎉"**

#### 5.2 Obter URL da API
```
https://refit-api.onrender.com
```

**Nota:** O nome pode ser diferente se "refit-api" já estiver ocupado.

#### 5.3 Testar API

**Teste 1: Health Check**
```bash
curl https://refit-api.onrender.com/api/dashboard?month=8&year=2026
```

**Teste 2: Registar Cliente**
```bash
curl -X POST https://refit-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Mobile",
    "email": "teste@mobile.com",
    "password": "senha123",
    "gdprConsent": {
      "dataProcessing": true
    }
  }'
```

---

### PASSO 6: CRIAR ADMIN NA PRODUÇÃO

#### 6.1 Aceder ao Shell do Render
1. No dashboard do Render
2. Ir ao service `refit-api`
3. Tab **"Shell"**
4. Clicar em **"Launch Shell"**

#### 6.2 Criar Admin
```bash
npx tsx src/scripts/createAdmin.ts
```

**Credenciais criadas:**
- Email: `admin@refit.pt`
- Senha: `Admin@2026`

---

## 📱 USAR NA APP MOBILE

### Configuração da App

**URL da API:**
```javascript
const API_URL = 'https://refit-api.onrender.com/api';
```

### Exemplo React Native

```javascript
// services/api.js
const API_URL = 'https://refit-api.onrender.com/api';

export async function registerClient(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
      gdprConsent: {
        dataProcessing: true,
        marketing: false
      }
    })
  });
  
  if (!response.ok) {
    throw new Error('Erro ao registar');
  }
  
  return await response.json();
}

export async function loginClient(email, password) {
  const response = await fetch(`${API_URL}/auth/login/client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Credenciais inválidas');
  }
  
  return await response.json();
}

export async function getClientData(token, clientId) {
  const response = await fetch(`${API_URL}/auth/gdpr/${clientId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```

---

## 🔄 ATUALIZAÇÕES FUTURAS

### Fazer Deploy de Alterações

```bash
# 1. Fazer alterações no código
# 2. Commit
git add .
git commit -m "Descrição das alterações"

# 3. Push
git push

# 4. Render faz deploy automático! 🎉
```

---

## ⚙️ CONFIGURAÇÕES ADICIONAIS

### CORS para Mobile

Já está configurado no código para aceitar:
- ✅ `capacitor://localhost` (Capacitor/Ionic)
- ✅ `http://localhost` (React Native)
- ✅ Qualquer origem (desenvolvimento)

### Rate Limiting

Recomendado adicionar no futuro:
```bash
npm install express-rate-limit
```

### Monitorização

Render fornece:
- ✅ Logs em tempo real
- ✅ Métricas de uso
- ✅ Alertas de erro

---

## 🆘 PROBLEMAS COMUNS

### Build Failed
**Erro:** `npm install failed`
**Solução:** Verificar `package.json` e dependências

### Service Offline
**Erro:** `Service is sleeping`
**Solução:** Normal no plano grátis. Primeiro pedido acorda (30s)

### Database Error
**Erro:** `Can't reach database`
**Solução:** Executar `npx prisma migrate deploy` no Shell

### CORS Error
**Erro:** `Access-Control-Allow-Origin`
**Solução:** Verificar configuração CORS no `server.ts`

---

## 📊 LIMITES DO PLANO GRÁTIS

**Render Free Tier:**
- ✅ 750 horas/mês (suficiente para 1 app)
- ✅ Dorme após 15min inatividade
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ 100GB bandwidth/mês

**Suficiente para:**
- ✅ Desenvolvimento
- ✅ MVP
- ✅ Testes
- ✅ Pequena produção (<100 utilizadores)

---

## 🎉 CONCLUSÃO

**Depois destes passos, terás:**
- ✅ API pública e acessível
- ✅ HTTPS automático
- ✅ Deploy automático via GitHub
- ✅ Pronta para app mobile
- ✅ 100% grátis

**URL da tua API:**
```
https://refit-api.onrender.com/api
```

**Endpoints disponíveis:**
- `POST /auth/register` - Registar cliente
- `POST /auth/login/client` - Login cliente
- `POST /auth/login/admin` - Login admin
- `POST /auth/refresh` - Renovar token
- `GET /auth/gdpr/:clientId` - Dados GDPR
- `DELETE /auth/account/:clientId` - Eliminar conta
- `GET /dashboard` - Dashboard data
- `GET /clients` - Lista de clientes
- E todos os outros endpoints!

---

**Pronto para começar! Qualquer dúvida, estou aqui! 🚀**
