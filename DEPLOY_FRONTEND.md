# 🌐 DEPLOY DO FRONTEND (DASHBOARD WEB)

**Data:** 5 de Agosto de 2026  
**Plataforma:** Netlify (Grátis)  
**Tempo:** 10 minutos

---

## ✅ PRÉ-REQUISITOS

- [x] Backend já está online: `https://refit-dashboard.onrender.com/api` ✅
- [x] Código no GitHub ✅
- [ ] Conta Netlify (criar agora)

---

## 🚀 PASSO A PASSO

### PASSO 1: CRIAR CONTA NO NETLIFY

#### 1.1 Ir ao Netlify
👉 **https://www.netlify.com**

#### 1.2 Criar Conta
- Clicar em **"Sign up"**
- **Opção recomendada:** "Sign up with GitHub"
- Autorizar Netlify a aceder ao GitHub

---

### PASSO 2: FAZER DEPLOY

#### 2.1 Importar do GitHub
1. No dashboard do Netlify, clicar em **"Add new site"**
2. Selecionar **"Import an existing project"**
3. Escolher **"Deploy with GitHub"**
4. Procurar por **"refit-dashboard"**
5. Clicar no repositório

#### 2.2 Configurar Build
**O Netlify vai detectar automaticamente o `netlify.toml`!**

Verifica se está assim:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

#### 2.3 Deploy!
- Clicar em **"Deploy refit-dashboard"**
- Aguardar 3-5 minutos

---

### PASSO 3: OBTER URL

Quando terminar, vais ter uma URL tipo:
```
https://refit-dashboard-abc123.netlify.app
```

**Podes personalizar:**
1. Site settings → Domain management
2. Change site name
3. Escolher: `refit-dashboard` (se disponível)
4. URL final: `https://refit-dashboard.netlify.app`

---

## 🔐 FAZER LOGIN

**Abrir a URL no browser e fazer login:**

**Admin:**
- Email: `admin@refit.pt`
- Senha: `Admin@2026`

---

## 📊 RESULTADO FINAL

**Terás 2 URLs:**

### 🔧 Backend (API)
```
https://refit-dashboard.onrender.com/api
```
- Para apps mobile
- Endpoints REST

### 💻 Frontend (Dashboard Web)
```
https://refit-dashboard.netlify.app
```
- Dashboard administrativo
- Gestão completa
- Acesso de qualquer lugar

---

## 🔄 ATUALIZAÇÕES AUTOMÁTICAS

**Quando fizeres alterações:**

```bash
git add .
git commit -m "Descrição"
git push
```

**Netlify faz deploy automático!** 🎉

---

## ⚙️ CONFIGURAÇÕES ADICIONAIS (OPCIONAL)

### Custom Domain
Se tiveres domínio próprio:
1. Site settings → Domain management
2. Add custom domain
3. Seguir instruções DNS

### HTTPS
✅ Já está ativo automaticamente!

### Password Protection
Se quiseres proteger o site:
1. Site settings → Access control
2. Enable password protection

---

## 🆘 PROBLEMAS COMUNS

### Build Failed
**Erro:** `npm install failed`
**Solução:** Verificar `package.json` no frontend

### API não responde
**Erro:** `Failed to fetch`
**Solução:** Verificar se backend está online

### Página em branco
**Erro:** Routing não funciona
**Solução:** `netlify.toml` já tem redirects configurados ✅

---

## 📱 USAR EM MOBILE

**Podes usar tanto a API direta quanto o dashboard web:**

### API (Recomendado para apps)
```javascript
const API_URL = 'https://refit-dashboard.onrender.com/api';
```

### Dashboard Web (Para gestão)
```
https://refit-dashboard.netlify.app
```

---

## 🎉 CONCLUSÃO

**Depois destes passos, terás:**
- ✅ Backend API online (Render)
- ✅ Frontend Dashboard online (Netlify)
- ✅ Deploy automático via GitHub
- ✅ HTTPS em ambos
- ✅ 100% grátis
- ✅ Acessível de qualquer lugar

---

**Pronto para começar! 🚀**
