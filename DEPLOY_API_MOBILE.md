# 📱 DEPLOY API PARA MOBILE - REFIT

**Data:** 3 de Agosto de 2026  
**Objetivo:** Disponibilizar API para acesso via dispositivos móveis

---

## 🎯 OPÇÕES DE DEPLOY

### ✅ OPÇÃO 1: RENDER (RECOMENDADO - GRÁTIS)

**Vantagens:**
- ✅ 100% Grátis
- ✅ Deploy automático via GitHub
- ✅ HTTPS incluído
- ✅ Fácil de configurar
- ✅ Suporta Node.js + SQLite
- ✅ URL pública automática

**Desvantagens:**
- ⚠️ Dorme após 15min inatividade (plano grátis)
- ⚠️ Primeiro pedido pode demorar ~30s

**Ideal para:** Testes, MVP, desenvolvimento

---

### ✅ OPÇÃO 2: RAILWAY (GRÁTIS COM LIMITES)

**Vantagens:**
- ✅ $5 grátis/mês
- ✅ Deploy via GitHub
- ✅ Não dorme
- ✅ HTTPS incluído
- ✅ Mais rápido que Render

**Desvantagens:**
- ⚠️ Limite de $5/mês (depois paga)
- ⚠️ Requer cartão de crédito

**Ideal para:** Produção pequena/média

---

### ✅ OPÇÃO 3: FLY.IO (GRÁTIS COM LIMITES)

**Vantagens:**
- ✅ Grátis até 3 apps
- ✅ Não dorme
- ✅ Muito rápido
- ✅ HTTPS incluído

**Desvantagens:**
- ⚠️ Requer cartão de crédito
- ⚠️ Configuração mais técnica

**Ideal para:** Produção

---

### ✅ OPÇÃO 4: NGROK (DESENVOLVIMENTO)

**Vantagens:**
- ✅ Instantâneo
- ✅ Sem deploy
- ✅ Grátis
- ✅ Perfeito para testes

**Desvantagens:**
- ❌ Não é permanente
- ❌ URL muda a cada reinício
- ❌ Só para desenvolvimento

**Ideal para:** Testes rápidos, desenvolvimento

---

## 🚀 MÉTODO RECOMENDADO: RENDER + GITHUB

### Por que Render?
1. ✅ Completamente grátis
2. ✅ Deploy automático
3. ✅ HTTPS incluído
4. ✅ Fácil de usar
5. ✅ Perfeito para começar

---

## 📋 PASSO A PASSO - RENDER

### PASSO 1: Preparar Código

#### 1.1 Criar `.gitignore`
```
node_modules/
.env
*.db
*.db-journal
.DS_Store
dist/
```

#### 1.2 Criar `render.yaml` (opcional)
```yaml
services:
  - type: web
    name: refit-api
    env: node
    buildCommand: cd backend && npm install && npx prisma generate
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: DATABASE_URL
        value: file:./prod.db
```

#### 1.3 Atualizar `package.json` do backend
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "tsx watch src/server.ts",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx src/seed.ts"
  }
}
```

---

### PASSO 2: Subir para GitHub

#### 2.1 Criar Repositório no GitHub
1. Ir a: https://github.com/new
2. Nome: `refit-dashboard`
3. Privado ou Público (tua escolha)
4. Criar repositório

#### 2.2 Fazer Push do Código
```bash
# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os ficheiros
git add .

# Fazer commit
git commit -m "Initial commit - REFIT Dashboard"

# Adicionar remote
git remote add origin https://github.com/SEU_USERNAME/refit-dashboard.git

# Fazer push
git push -u origin main
```

---

### PASSO 3: Deploy no Render

#### 3.1 Criar Conta
1. Ir a: https://render.com
2. Criar conta (pode usar GitHub)

#### 3.2 Criar Web Service
1. Dashboard → "New" → "Web Service"
2. Conectar repositório GitHub
3. Selecionar `refit-dashboard`

#### 3.3 Configurar Service
```
Name: refit-api
Environment: Node
Region: Frankfurt (mais perto de Portugal)
Branch: main
Root Directory: backend
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
```

#### 3.4 Variáveis de Ambiente
```
NODE_ENV = production
JWT_SECRET = [gerar chave aleatória segura]
DATABASE_URL = file:./prod.db
PORT = 4000
```

#### 3.5 Deploy
- Clicar em "Create Web Service"
- Aguardar ~5 minutos

---

### PASSO 4: Testar API

**URL da API:**
```
https://refit-api.onrender.com
```

**Testar endpoints:**
```bash
# Registar cliente
curl -X POST https://refit-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "gdprConsent": {
      "dataProcessing": true
    }
  }'

# Login
curl -X POST https://refit-api.onrender.com/api/auth/login/client \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

---

## 📱 USAR NA APP MOBILE

### React Native / Expo

```javascript
// config.js
export const API_URL = 'https://refit-api.onrender.com/api';

// auth.js
import { API_URL } from './config';

async function register(name, email, password) {
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
  
  const data = await response.json();
  return data; // { token, refreshToken, client }
}

async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login/client`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data; // { token, refreshToken, client }
}

async function getProfile(token) {
  const response = await fetch(`${API_URL}/clients/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}
```

### Flutter

```dart
// config.dart
const String API_URL = 'https://refit-api.onrender.com/api';

// auth_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class AuthService {
  Future<Map<String, dynamic>> register(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('$API_URL/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'gdprConsent': {
          'dataProcessing': true,
          'marketing': false
        }
      })
    );
    
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$API_URL/auth/login/client'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password
      })
    );
    
    return jsonDecode(response.body);
  }
}
```

---

## 🔒 SEGURANÇA IMPORTANTE

### 1. CORS
Adicionar no `backend/src/server.ts`:

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://refit-api.onrender.com',
    'capacitor://localhost', // Para apps mobile
    'http://localhost' // Para apps mobile
  ],
  credentials: true
}));
```

### 2. Rate Limiting
Instalar:
```bash
npm install express-rate-limit
```

Adicionar:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 pedidos por IP
});

app.use('/api/', limiter);
```

### 3. Helmet (Segurança Headers)
```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

---

## 🎯 ALTERNATIVA RÁPIDA: NGROK (TESTES)

**Para testes rápidos SEM deploy:**

### 1. Instalar ngrok
```bash
# Download de: https://ngrok.com/download
# Ou via npm:
npm install -g ngrok
```

### 2. Executar
```bash
# Iniciar backend local
cd backend
npm run dev

# Noutra janela:
ngrok http 4000
```

### 3. Usar URL
```
https://abc123.ngrok.io/api
```

**Vantagens:**
- ✅ Instantâneo
- ✅ Sem configuração
- ✅ Perfeito para testes

**Desvantagens:**
- ❌ URL muda sempre
- ❌ Não é permanente

---

## 📊 COMPARAÇÃO FINAL

| Serviço | Grátis | Permanente | Velocidade | Dificuldade |
|---------|--------|------------|------------|-------------|
| **Render** | ✅ | ✅ | ⭐⭐⭐ | ⭐ Fácil |
| **Railway** | ⚠️ $5/mês | ✅ | ⭐⭐⭐⭐ | ⭐ Fácil |
| **Fly.io** | ⚠️ Limites | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐ Médio |
| **ngrok** | ✅ | ❌ | ⭐⭐⭐⭐⭐ | ⭐ Fácil |

---

## 🎉 RECOMENDAÇÃO FINAL

**Para começar:**
1. **Desenvolvimento/Testes:** ngrok
2. **MVP/Produção:** Render (grátis)
3. **Produção Séria:** Railway ou Fly.io

**Melhor fluxo:**
```
Desenvolvimento → ngrok
MVP → Render (grátis)
Produção → Railway/Fly.io (pago)
```

---

## 📱 PRÓXIMOS PASSOS

1. ✅ Subir código para GitHub
2. ✅ Deploy no Render
3. ✅ Testar API mobile
4. ✅ Desenvolver app mobile
5. ✅ Publicar na App Store/Play Store

---

**Queres que te ajude a fazer o deploy no Render?** 🚀
