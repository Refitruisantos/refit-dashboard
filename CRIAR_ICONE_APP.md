# 📱 CRIAR ÍCONE DA APP NO TELEMÓVEL

---

## 🎨 PASSO 1: CRIAR ÍCONES (OBRIGATÓRIO)

Precisas de criar 2 imagens com o logo REFIT:

### Opção A: Usar Ferramenta Online (Mais Fácil)

1. **Vai a:** https://www.pwabuilder.com/imageGenerator
2. **Upload** uma imagem do logo REFIT (qualquer tamanho)
3. **Download** os ícones gerados
4. **Renomeia** para:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
5. **Coloca** em: `frontend/public/`

### Opção B: Criar Manualmente

**Requisitos:**
- **icon-192.png**: 192x192 pixels
- **icon-512.png**: 512x512 pixels
- Fundo: Azul escuro (#0f172a) ou transparente
- Logo: Branco ou azul claro

**Ferramentas:**
- Canva: https://www.canva.com
- Photopea: https://www.photopea.com
- Figma: https://www.figma.com

---

## 📤 PASSO 2: FAZER DEPLOY

Depois de criar os ícones:

```bash
# Adicionar ficheiros
git add frontend/public/manifest.json
git add frontend/public/icon-192.png
git add frontend/public/icon-512.png
git add frontend/index.html

# Commit
git commit -m "Add PWA support with app icons"

# Push
git push
```

**Netlify faz deploy automático!** ✅

---

## 📱 PASSO 3: ADICIONAR AO TELEMÓVEL

### iOS (iPhone/iPad)

1. Abre **Safari**
2. Vai a: `https://refit-dashboard.netlify.app`
3. Clica no botão **Partilhar** (⬆️)
4. Scroll → **"Adicionar ao Ecrã Principal"**
5. Nome: **"REFIT"**
6. Clica **"Adicionar"**

**Resultado:** Ícone com logo REFIT no ecrã principal! 🎉

### Android

1. Abre **Chrome**
2. Vai a: `https://refit-dashboard.netlify.app`
3. Menu (⋮) → **"Adicionar ao ecrã principal"**
4. Nome: **"REFIT"**
5. Clica **"Adicionar"**

**Resultado:** Ícone com logo REFIT no ecrã principal! 🎉

---

## 👥 PASSO 4: PARTILHAR COM OUTRAS PESSOAS

### Método 1: Partilhar URL

**Envia por WhatsApp/Email:**
```
🏋️ REFIT Dashboard

Acede ao sistema REFIT:
https://refit-dashboard.netlify.app

📱 Para adicionar ao telemóvel:
1. Abre o link no Safari/Chrome
2. Faz login
3. Menu → Adicionar ao ecrã principal

Login:
Email: [email do utilizador]
Senha: [senha do utilizador]
```

### Método 2: QR Code

1. **Gera QR Code:** https://www.qr-code-generator.com
2. **URL:** `https://refit-dashboard.netlify.app`
3. **Download** e partilha a imagem
4. Pessoas fazem scan → Abre automaticamente

---

## 🎯 FUNCIONALIDADES PWA

Depois de adicionar ao ecrã principal:

✅ **Ícone personalizado** com logo REFIT
✅ **Abre em ecrã completo** (sem barra do browser)
✅ **Parece app nativa**
✅ **Funciona offline** (cache automático)
✅ **Rápido** (carrega instantaneamente)
✅ **Notificações** (se configurares depois)

---

## 🔐 GESTÃO DE UTILIZADORES

### Criar Novos Utilizadores

**Para outras pessoas usarem, precisas criar contas:**

1. **Clientes** (acesso limitado):
   - Dashboard → Clientes → Adicionar Cliente
   - Cada cliente tem login próprio
   - Vê apenas os seus dados

2. **Administradores** (acesso total):
   - Usar script `createAdmin.ts`
   - Acesso completo ao sistema

---

## 📊 EXEMPLO DE USO

**Cenário: Ginásio com 50 clientes**

1. **Tu (Admin):**
   - URL: `https://refit-dashboard.netlify.app`
   - Login: `admin@refit.pt`
   - Acesso: Total

2. **Clientes:**
   - URL: Mesma (`https://refit-dashboard.netlify.app`)
   - Login: Email próprio
   - Acesso: Apenas seus dados (pagamentos, treinos, etc.)

3. **Todos:**
   - Adicionam ícone ao telemóvel
   - Usam como app nativa
   - Acesso em qualquer lugar

---

## 🎨 PERSONALIZAR AINDA MAIS

### Mudar Cores

Edita `frontend/public/manifest.json`:
```json
{
  "background_color": "#SUA_COR",
  "theme_color": "#SUA_COR"
}
```

### Mudar Nome

Edita `frontend/public/manifest.json`:
```json
{
  "name": "Nome Completo",
  "short_name": "Nome Curto"
}
```

---

## ✅ CHECKLIST FINAL

- [ ] Criar `icon-192.png` e `icon-512.png`
- [ ] Colocar em `frontend/public/`
- [ ] Fazer commit e push
- [ ] Aguardar deploy Netlify
- [ ] Testar no telemóvel
- [ ] Adicionar ao ecrã principal
- [ ] Partilhar URL com outras pessoas

---

**Pronto! Agora tens uma app profissional no telemóvel!** 🎉📱
