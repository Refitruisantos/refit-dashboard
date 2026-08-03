# 📱 API MOBILE REFIT - DOCUMENTAÇÃO

## 🔐 AUTENTICAÇÃO E GDPR

### Visão Geral

A API Mobile REFIT permite que clientes:
- Criem conta na aplicação mobile
- Façam login seguro
- Acedam aos seus dados (GDPR)
- Eliminem a sua conta (GDPR - Direito ao Esquecimento)

---

## 🔑 ENDPOINTS DE AUTENTICAÇÃO

### 1. Registar Novo Cliente

**POST** `/api/auth/register`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "+351 912 345 678",
  "birthDate": "1990-05-15",
  "address": "Rua Example, 123, Lisboa",
  "gdprConsent": {
    "dataProcessing": true,
    "marketing": false,
    "dataSharing": false
  }
}
```

**Response (201):**
```json
{
  "message": "Cliente registado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "clxxx123",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+351 912 345 678"
  }
}
```

**Validações:**
- ✅ Nome mínimo 2 caracteres
- ✅ Email válido
- ✅ Senha mínimo 6 caracteres
- ✅ Consentimento GDPR obrigatório (`dataProcessing: true`)

---

### 2. Login de Cliente

**POST** `/api/auth/login/client`

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "message": "Login efetuado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "clxxx123",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+351 912 345 678",
    "status": "active"
  }
}
```

---

### 3. Login de Admin (Dashboard Web)

**POST** `/api/auth/login/admin`

**Body:**
```json
{
  "email": "admin@refit.pt",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login efetuado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr123",
    "name": "Administrador",
    "email": "admin@refit.pt",
    "role": "admin"
  }
}
```

---

## 🔒 ENDPOINTS PROTEGIDOS (Requerem Token)

### 4. Obter Dados GDPR do Cliente

**GET** `/api/auth/gdpr/:clientId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "personalData": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+351 912 345 678",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "address": "Rua Example, 123, Lisboa",
    "joinedAt": "2026-01-15T10:30:00.000Z"
  },
  "subscriptions": [...],
  "payments": [...],
  "appointments": [...],
  "attendances": [...],
  "assessments": [...],
  "goals": [...],
  "gdprConsent": {
    "dataProcessing": true,
    "marketing": false,
    "dataSharing": false,
    "consentDate": "2026-01-15T10:30:00.000Z"
  }
}
```

**Direito GDPR:** Direito de Acesso aos Dados

---

### 5. Eliminar Conta do Cliente

**DELETE** `/api/auth/account/:clientId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**
```json
{
  "confirmation": "DELETE"
}
```

**Response (200):**
```json
{
  "message": "Conta eliminada com sucesso"
}
```

**Direito GDPR:** Direito ao Esquecimento

**Nota:** Os dados são **anonimizados** em vez de eliminados para manter histórico financeiro. O cliente fica como "Cliente Eliminado" e o email é alterado para `deleted_xxx@refit.local`.

---

## 🛡️ SEGURANÇA E GDPR

### Proteção de Dados Implementada

1. **Autenticação JWT**
   - Tokens expiram em 7 dias
   - Tokens assinados com chave secreta
   - Middleware de autenticação em rotas protegidas

2. **Senhas Seguras**
   - Hash com bcrypt (10 rounds)
   - Nunca retornadas nas respostas
   - Validação mínima de 6 caracteres

3. **Consentimentos GDPR**
   - `dataProcessing`: Obrigatório (processamento de dados)
   - `marketing`: Opcional (comunicações de marketing)
   - `dataSharing`: Opcional (partilha com terceiros)
   - Data de consentimento registada

4. **Direitos GDPR Implementados**
   - ✅ Direito de Acesso (GET /gdpr/:clientId)
   - ✅ Direito ao Esquecimento (DELETE /account/:clientId)
   - ✅ Direito à Portabilidade (dados em JSON)
   - ✅ Direito de Retificação (via update client)

5. **Anonimização de Dados**
   - Dados pessoais substituídos por genéricos
   - Email alterado para evitar reutilização
   - Histórico financeiro mantido (obrigação legal)

---

## 📱 EXEMPLO DE USO EM APP MOBILE

### React Native / Flutter

```javascript
// 1. Registar
const response = await fetch('http://api.refit.pt/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    gdprConsent: {
      dataProcessing: true,
      marketing: false,
      dataSharing: false
    }
  })
});

const { token, client } = await response.json();

// Guardar token localmente
await AsyncStorage.setItem('token', token);

// 2. Fazer pedidos autenticados
const paymentsResponse = await fetch('http://api.refit.pt/api/payments', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔐 CONFIGURAÇÃO DE SEGURANÇA

### Variáveis de Ambiente (.env)

```env
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PORT=4000
```

**IMPORTANTE:** Altere `JWT_SECRET` em produção!

---

## 📊 CORS PARA MOBILE

O CORS já está configurado no servidor. Para apps mobile, pode ser necessário adicionar:

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'capacitor://localhost', 'http://localhost'],
  credentials: true,
}));
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

**Backend:**
- ✅ Middleware de autenticação criado
- ✅ Controller de autenticação criado
- ✅ Rotas de autenticação criadas
- ✅ Rotas registadas no server
- ✅ Validações com Zod
- ✅ Hash de senhas com bcrypt
- ✅ Tokens JWT implementados
- ✅ Consentimentos GDPR obrigatórios
- ✅ Direito de acesso implementado
- ✅ Direito ao esquecimento implementado

**Próximos Passos:**
- [ ] Criar app mobile (React Native / Flutter)
- [ ] Implementar refresh tokens
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Implementar rate limiting
- [ ] Adicionar logs de auditoria GDPR
- [ ] Criar política de privacidade
- [ ] Criar termos de serviço

---

## 🎯 ENDPOINTS DISPONÍVEIS

**Públicos:**
- `POST /api/auth/register` - Registar cliente
- `POST /api/auth/login/client` - Login cliente
- `POST /api/auth/login/admin` - Login admin

**Protegidos (Cliente):**
- `GET /api/auth/gdpr/:clientId` - Obter dados GDPR
- `DELETE /api/auth/account/:clientId` - Eliminar conta

**Protegidos (Admin):**
- Todos os endpoints existentes do dashboard

---

## 📞 SUPORTE

Para questões sobre GDPR ou segurança:
- Email: privacy@refit.pt
- DPO (Data Protection Officer): dpo@refit.pt

---

**Desenvolvido com segurança e conformidade GDPR em mente.** 🔐
