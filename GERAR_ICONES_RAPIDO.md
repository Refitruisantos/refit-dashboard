# ⚡ GERAR ÍCONES - RÁPIDO

---

## 🎨 MÉTODO 1: USAR FICHEIRO HTML (MAIS FÁCIL)

### Passo 1: Abrir Gerador
1. Abre o ficheiro: `create-icons.html` (duplo clique)
2. Abre no browser (Chrome/Edge/Firefox)

### Passo 2: Download dos Ícones
1. Clica em **"📥 Download icon-192.png"**
2. Guarda em: `frontend/public/icon-192.png`
3. Clica em **"📥 Download icon-512.png"**
4. Guarda em: `frontend/public/icon-512.png`

### Passo 3: Fazer Deploy
```bash
git add frontend/public/icon-192.png frontend/public/icon-512.png
git commit -m "Add app icons"
git push
```

**Pronto! Netlify faz deploy automático!** ✅

---

## 🎨 MÉTODO 2: USAR FERRAMENTA ONLINE

### Opção A: PWA Builder (Recomendado)
1. Vai a: https://www.pwabuilder.com/imageGenerator
2. Upload uma imagem (logo, foto, qualquer coisa)
3. Download os ícones gerados
4. Renomeia para `icon-192.png` e `icon-512.png`
5. Coloca em `frontend/public/`

### Opção B: Canva
1. Vai a: https://www.canva.com
2. Cria design 512x512
3. Adiciona texto "REFIT"
4. Fundo azul escuro (#0f172a)
5. Download como PNG
6. Redimensiona para 192x192 (segunda versão)

---

## ✅ VERIFICAR SE FUNCIONOU

Depois do deploy:
1. Abre: `https://refit-dashboard.netlify.app`
2. No telemóvel: Adicionar ao ecrã principal
3. Deve aparecer o ícone REFIT! 🎉

---

**Usa o MÉTODO 1 (ficheiro HTML) - é o mais rápido!** ⚡
