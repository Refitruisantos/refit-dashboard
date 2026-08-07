# 🚀 IONIC APPFLOW - BUILD iOS SEM MAC

**Guia completo para compilar app iOS usando Ionic Appflow**

---

## 📋 PRÉ-REQUISITOS

- ✅ Conta Apple Developer (já tens!)
- ✅ Repositório GitHub (já tens!)
- ✅ App Capacitor configurada (já tens!)
- ⏳ Conta Ionic Appflow (vamos criar)

---

## 🎯 PASSO A PASSO

### PASSO 1: CRIAR CONTA IONIC APPFLOW

1. **Vai a:** https://ionic.io/appflow
2. **Clica:** "Get Started Free"
3. **Regista:**
   - Email
   - Password
   - Nome da empresa: "REFIT"
4. **Verifica email**

---

### PASSO 2: CRIAR APP NO APPFLOW

1. **Dashboard Appflow** → "New App"
2. **Nome:** "REFIT Dashboard"
3. **Conectar GitHub:**
   - Clica "Connect to GitHub"
   - Autoriza Ionic
   - Seleciona: `Refitruisantos/refit-dashboard`
   - Branch: `main`
4. **Clica:** "Create App"

---

### PASSO 3: CONFIGURAR BUILD

#### 3.1 Configurar Ambiente

1. **No Appflow**, vai a **Settings** → **Build Configuration**
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Node Version:** `20.x`

#### 3.2 Adicionar Certificados iOS

**Precisas de:**
- Certificado de Desenvolvimento (.p12)
- Provisioning Profile (.mobileprovision)

**Como obter (precisa Mac ou acesso temporário):**

**OPÇÃO A: Usar Mac temporário**
1. Xcode → Preferences → Accounts
2. Adiciona conta Apple Developer
3. Manage Certificates → + → iOS Development
4. Export certificado (.p12)
5. Download Provisioning Profile

**OPÇÃO B: App Store Connect**
1. https://developer.apple.com/account
2. Certificates, IDs & Profiles
3. Certificates → + → iOS Development
4. Gera CSR (Certificate Signing Request)
5. Upload e download certificado
6. Provisioning Profiles → + → iOS App Development
7. Seleciona App ID: `com.refit.dashboard`
8. Download profile

#### 3.3 Upload Certificados no Appflow

1. **Appflow** → **Settings** → **Certificates**
2. **iOS Certificate:**
   - Upload ficheiro .p12
   - Password do certificado
3. **Provisioning Profile:**
   - Upload ficheiro .mobileprovision

---

### PASSO 4: FAZER BUILD

1. **Appflow** → **Builds**
2. **Clica:** "New Build"
3. **Configuração:**
   - Platform: **iOS**
   - Build Type: **Development** (para testar) ou **Release** (para App Store)
   - Target: **Device**
   - Commit: Latest
4. **Clica:** "Start Build"
5. **Aguarda:** 5-15 minutos

---

### PASSO 5: DOWNLOAD OU DEPLOY

#### Opção A: Download IPA (Testar)

1. Build completo → **Download**
2. Ficheiro `.ipa` descarregado
3. Instala no iPhone via:
   - Xcode (precisa Mac)
   - TestFlight
   - Diawi (https://www.diawi.com)

#### Opção B: Deploy Direto (App Store)

1. **Appflow** → **Deploy**
2. **Conectar App Store Connect:**
   - App Store Connect API Key
   - Issuer ID
   - Key ID
3. **Deploy automático** para TestFlight/App Store

---

## 🔑 OBTER CERTIFICADOS SEM MAC

### MÉTODO 1: Usar Serviço Online

**Fastlane Match** (recomendado):
```bash
# No PC com Ruby instalado
gem install fastlane
cd frontend
fastlane match init
fastlane match development
```

### MÉTODO 2: Pedir a Amigo com Mac

1. Amigo abre Xcode
2. Preferences → Accounts → Tua conta
3. Manage Certificates → Export
4. Envia-te ficheiros .p12 e .mobileprovision

### MÉTODO 3: Usar Mac na Cloud (1 hora)

1. Aluga Mac: https://www.macincloud.com
2. Acede remotamente
3. Gera certificados
4. Download
5. Cancela subscrição

---

## 📱 ALTERNATIVA: USAR TESTFLIGHT SEM CERTIFICADOS

**Ionic Appflow Live Updates:**
1. Não precisa certificados
2. Atualiza app sem rebuild
3. Ideal para testes

---

## 💰 PREÇOS IONIC APPFLOW

### Plano Grátis (Starter)
- ✅ 500 builds/mês
- ✅ 1 app
- ✅ Builds iOS + Android
- ✅ Suficiente para começar!

### Plano Pago (Growth)
- $29/mês
- Builds ilimitados
- Múltiplas apps
- Deploy automático

---

## 🔄 WORKFLOW COMPLETO

```
1. Código no PC (Windows)
   ↓
2. Git push para GitHub
   ↓
3. Ionic Appflow detecta
   ↓
4. Build automático iOS (cloud)
   ↓
5. Deploy para TestFlight/App Store
   ↓
6. Utilizadores recebem atualização
```

---

## 🐛 TROUBLESHOOTING

### Build Falha: "Missing Certificates"
**Solução:** Upload certificados em Settings → Certificates

### Build Falha: "Invalid Provisioning Profile"
**Solução:** Provisioning profile deve incluir Bundle ID correto

### Build Falha: "Node modules not found"
**Solução:** Verifica Root Directory = `frontend`

### Não consigo gerar certificados
**Solução:** Usa Mac temporário ou serviço online

---

## 📚 RECURSOS

- **Appflow Docs:** https://ionic.io/docs/appflow
- **Certificados iOS:** https://developer.apple.com/account
- **Fastlane:** https://fastlane.tools
- **Mac na Cloud:** https://www.macincloud.com

---

## ✅ CHECKLIST

- [ ] Conta Ionic Appflow criada
- [ ] GitHub conectado
- [ ] App criada no Appflow
- [ ] Root directory configurado (`frontend`)
- [ ] Certificados iOS obtidos
- [ ] Certificados uploaded no Appflow
- [ ] Primeiro build executado
- [ ] IPA descarregado ou deployed
- [ ] App testada no iPhone
- [ ] Publicada na App Store

---

## 🎯 PRÓXIMOS PASSOS

1. **Cria conta Appflow** (5 min)
2. **Conecta GitHub** (2 min)
3. **Configura app** (5 min)
4. **Obtém certificados** (30 min - 2h dependendo método)
5. **Primeiro build** (10 min)
6. **Testa no iPhone** (15 min)
7. **Publica App Store** (1h + 1-3 dias aprovação)

**Total:** ~1 dia de trabalho + aprovação Apple

---

**Vamos começar! Cria conta no Ionic Appflow!** 🚀
