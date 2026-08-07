# 📱 CRIAR APP iOS NATIVA - REFIT DASHBOARD

**Status:** Capacitor instalado e configurado ✅

---

## 🎯 O QUE VAMOS FAZER

Converter o PWA existente numa app nativa iOS usando Capacitor.

**Resultado:**
- ✅ App nativa iOS
- ✅ Publicável na App Store
- ✅ Usa o código que já tens
- ✅ Performance nativa

---

## 📋 PRÉ-REQUISITOS

### No Mac (obrigatório para iOS):
- ✅ macOS (Ventura ou superior)
- ✅ Xcode 14+ (grátis na App Store)
- ✅ Conta Apple Developer (já tens!)
- ✅ CocoaPods (`sudo gem install cocoapods`)

### No PC Windows (preparação):
- ✅ Código pronto ✅ (já está!)
- ✅ Build do frontend
- ✅ Transferir para Mac

---

## 🚀 PASSOS COMPLETOS

### PASSO 1: BUILD DO FRONTEND (NO PC)

```bash
cd c:\Users\sorai\CascadeProjects\refit-dashboard\frontend
npm run build
```

**Resultado:** Pasta `dist/` com a app compilada

---

### PASSO 2: ADICIONAR PLATAFORMA iOS (NO PC)

```bash
npx cap add ios
```

**Resultado:** Pasta `ios/` criada com projeto Xcode

---

### PASSO 3: SINCRONIZAR CÓDIGO (NO PC)

```bash
npx cap sync ios
```

**Resultado:** Código web copiado para projeto iOS

---

### PASSO 4: TRANSFERIR PARA MAC

**Opções:**
- GitHub (recomendado)
- USB/AirDrop
- Cloud (OneDrive, Google Drive)

**Ficheiros necessários:**
- Todo o projeto `refit-dashboard/`
- Especialmente: `frontend/ios/`

---

### PASSO 5: ABRIR NO XCODE (NO MAC)

```bash
cd frontend
npx cap open ios
```

Ou:
- Abre Xcode
- File → Open
- Seleciona: `frontend/ios/App/App.xcworkspace`

---

### PASSO 6: CONFIGURAR NO XCODE

#### 6.1 Bundle Identifier
- Seleciona projeto "App" no navegador
- Target: App
- General → Identity
- Bundle Identifier: `com.refit.dashboard`

#### 6.2 Team de Desenvolvimento
- Signing & Capabilities
- Team: Seleciona tua conta Apple Developer
- ✅ Automatically manage signing

#### 6.3 Ícone da App
- Assets.xcassets → AppIcon
- Arrasta ícones (precisas de várias resoluções)
- Usa: https://www.appicon.co para gerar

#### 6.4 Nome da App
- Info.plist
- Bundle display name: "REFIT"

---

### PASSO 7: TESTAR NO SIMULADOR

1. Seleciona simulador (ex: iPhone 15 Pro)
2. Clica em ▶️ (Run)
3. Aguarda build
4. App abre no simulador!

---

### PASSO 8: TESTAR NO IPHONE REAL

1. Liga iPhone ao Mac (USB)
2. Desbloqueia iPhone
3. Confia no computador
4. Xcode: Seleciona teu iPhone
5. Clica em ▶️ (Run)
6. No iPhone: Settings → General → VPN & Device Management
7. Confia no certificado de desenvolvedor
8. Abre app!

---

### PASSO 9: PREPARAR PARA APP STORE

#### 9.1 Criar App no App Store Connect
1. Vai a: https://appstoreconnect.apple.com
2. My Apps → ➕
3. Nome: "REFIT Dashboard"
4. Bundle ID: `com.refit.dashboard`
5. SKU: `refit-dashboard-001`

#### 9.2 Configurar Informações
- Descrição
- Screenshots (iPhone 6.7", 6.5", 5.5")
- Ícone 1024x1024
- Categoria: Business / Health & Fitness
- Preço: Grátis

#### 9.3 Archive e Upload
1. Xcode: Product → Archive
2. Aguarda build
3. Window → Organizer
4. Seleciona archive
5. Distribute App → App Store Connect
6. Upload
7. Aguarda processamento (15-30 min)

#### 9.4 Submeter para Revisão
1. App Store Connect
2. Seleciona versão
3. Submit for Review
4. Aguarda aprovação (1-3 dias)

---

## 🎨 PERSONALIZAR APP

### Ícones (Obrigatório)

**Precisas de:**
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone)
- 87x87 (iPhone)
- 80x80 (iPad)
- 76x76 (iPad)
- 60x60 (iPhone)
- 58x58 (iPhone)
- 40x40 (iPhone/iPad)
- 29x29 (iPhone/iPad)
- 20x20 (iPhone/iPad)

**Ferramenta:** https://www.appicon.co
- Upload imagem 1024x1024
- Download todos os tamanhos
- Arrasta para AppIcon no Xcode

### Splash Screen

Edita `frontend/ios/App/App/Assets.xcassets/Splash.imageset`

### Cores

Edita `capacitor.config.ts`:
```typescript
{
  ios: {
    backgroundColor: '#0f172a'
  }
}
```

---

## 🔧 CONFIGURAÇÕES AVANÇADAS

### Permissões

Edita `frontend/ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Para tirar fotos de perfil</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Para escolher foto de perfil</string>
```

### Orientação

Xcode → Target → General → Deployment Info:
- ✅ Portrait
- ❌ Landscape (opcional)

---

## 📦 COMANDOS ÚTEIS

```bash
# Build frontend
npm run build

# Sincronizar com iOS
npx cap sync ios

# Abrir Xcode
npx cap open ios

# Atualizar Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/ios@latest

# Ver logs
npx cap run ios --livereload
```

---

## 🐛 PROBLEMAS COMUNS

### Erro: "No provisioning profiles found"
**Solução:** Xcode → Preferences → Accounts → Download Manual Profiles

### Erro: "Code signing failed"
**Solução:** Signing & Capabilities → Team → Seleciona tua conta

### App não abre no iPhone
**Solução:** Settings → General → VPN & Device Management → Confia

### Build falha
**Solução:** 
```bash
cd ios/App
pod install
```

---

## 📊 TIMELINE

**Preparação (PC):** 30 minutos
- ✅ Já feito! Capacitor instalado

**Configuração (Mac):** 2-3 horas
- Xcode setup
- Configurações
- Ícones

**Testes:** 1-2 horas
- Simulador
- iPhone real

**App Store:** 1-2 horas
- Screenshots
- Descrição
- Upload

**Aprovação Apple:** 1-3 dias

**Total:** ~1 semana (incluindo aprovação)

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

### NO PC (AGORA):

1. **Build do frontend:**
   ```bash
   cd c:\Users\sorai\CascadeProjects\refit-dashboard\frontend
   npm run build
   ```

2. **Adicionar plataforma iOS:**
   ```bash
   npx cap add ios
   ```

3. **Sincronizar:**
   ```bash
   npx cap sync ios
   ```

4. **Commit e push:**
   ```bash
   git add -A
   git commit -m "Add iOS app with Capacitor"
   git push
   ```

### NO MAC (DEPOIS):

1. **Clone repositório** ou transfere pasta
2. **Instala dependências:**
   ```bash
   cd frontend
   npm install
   ```
3. **Abre Xcode:**
   ```bash
   npx cap open ios
   ```
4. **Configura Team**
5. **Run!** ▶️

---

## 🎯 RECURSOS

- **Capacitor Docs:** https://capacitorjs.com/docs
- **App Store Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **App Store Connect:** https://appstoreconnect.apple.com
- **Ícones:** https://www.appicon.co
- **Screenshots:** https://www.applaunchpad.com

---

**Vamos começar! Executa os comandos do PASSO 1 no PC!** 🚀
