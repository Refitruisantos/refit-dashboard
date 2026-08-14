# 🔄 APLICAR MIGRATION NO RENDER

**Data:** 14 Agosto 2026, 13:54

---

## 🐛 PROBLEMA

**Erro 500** ao aceder ao dashboard porque:
- ✅ Código tem campo `billingType` no schema
- ❌ Base de dados no Render NÃO tem esse campo
- ❌ Backend crasha ao tentar ler o campo inexistente

---

## ✅ SOLUÇÃO

Aplicar migration na base de dados do Render.

---

## 📋 PASSO A PASSO

### OPÇÃO 1: RENDER FAZ AUTOMATICAMENTE (RECOMENDADO)

O Render **deve** aplicar migrations automaticamente no próximo deploy.

**Aguarda 5-10 minutos:**
1. Render detecta novo código
2. Faz build do backend
3. **Aplica migrations automaticamente**
4. Reinicia backend
5. ✅ Tudo funciona!

**Depois:**
- Aguarda 10 minutos
- Recarrega dashboard
- Deve funcionar!

---

### OPÇÃO 2: APLICAR MANUALMENTE (SE NÃO FUNCIONAR)

**Se após 10 minutos ainda der erro 500:**

1. **Vai ao Render:**
   - https://dashboard.render.com
   - Teu serviço backend

2. **Vai a "Shell"** (menu lateral)

3. **Executa comando:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Aguarda terminar**
   - Deve mostrar: "Migration applied successfully"

5. **Reinicia serviço:**
   - Vai a "Settings"
   - Clica "Manual Deploy" → "Deploy latest commit"

6. **Aguarda 2-3 minutos**

7. **Testa dashboard**
   - Recarrega página
   - Deve funcionar! ✅

---

## 🔍 VERIFICAR SE MIGRATION FOI APLICADA

**No Render Shell, executa:**
```bash
npx prisma migrate status
```

**Resultado esperado:**
```
Database schema is up to date!
```

---

## ⏰ TIMELINE

**Agora (13:54):**
- ✅ Migration criada localmente
- ✅ Código enviado para GitHub
- ⏳ Render a processar

**Em 5-10 minutos (14:00-14:05):**
- ✅ Render aplica migration
- ✅ Backend reinicia
- ✅ Dashboard funciona!

---

## 🎯 PRÓXIMO PASSO

**AGUARDA 10 MINUTOS** e depois:

1. **Recarrega dashboard:** Ctrl + Shift + R
2. **Testa criar serviço**
3. **Se funcionar:** ✅ Pronto!
4. **Se ainda der erro 500:** Aplica manualmente (Opção 2)

---

**Aguarda 10 minutos!** ⏳

O Render deve aplicar a migration automaticamente! 🚀
