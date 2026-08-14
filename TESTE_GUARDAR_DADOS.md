# ✅ TESTE DE GUARDAR DADOS - REFIT DASHBOARD

**Data:** 14 Agosto 2026

---

## 🎯 OBJETIVO

Verificar se **TODOS** os dados ficam guardados permanentemente quando criados no dashboard online.

---

## 📋 CHECKLIST DE TESTES

### ✅ PREPARAÇÃO

1. **Abre o dashboard:**
   - URL: https://refit-dashboard.netlify.app
   - **Faz hard refresh:** Ctrl+Shift+R

2. **Faz login:**
   - Email: `admin@refit.pt`
   - Senha: `Admin@2026`

---

## 🧪 TESTES A REALIZAR

### 1️⃣ TESTE: CRIAR SERVIÇO

**Passos:**
1. Vai a **Serviços** (menu lateral)
2. Clica **"Novo Serviço"**
3. Preenche:
   - Nome: `Pilates 1x`
   - Descrição: `Aula de Pilates`
   - Preço Mensal: `30`
   - Duração: `60`
   - Estado: `Ativo`
4. Clica **"Criar Serviço"**

**Verificação:**
- ✅ Serviço aparece na lista?
- ✅ Recarrega página (F5) - serviço continua lá?
- ✅ Fecha browser e abre novamente - serviço continua lá?

**Status:** [ ] Passou ✅ / [ ] Falhou ❌

---

### 2️⃣ TESTE: CRIAR CLIENTE

**Passos:**
1. Vai a **Clientes**
2. Clica **"Novo Cliente"**
3. Preenche:
   - Nome: `João Silva`
   - Email: `joao@teste.pt`
   - Telefone: `912345678`
   - Data Nascimento: `01/01/1990`
4. Clica **"Criar Cliente"**

**Verificação:**
- ✅ Cliente aparece na lista?
- ✅ Recarrega página (F5) - cliente continua lá?
- ✅ Fecha browser e abre novamente - cliente continua lá?

**Status:** [ ] Passou ✅ / [ ] Falhou ❌

---

### 3️⃣ TESTE: CRIAR PAGAMENTO

**Passos:**
1. Vai a **Pagamentos**
2. Clica **"Novo Pagamento"**
3. Preenche:
   - Cliente: Seleciona o cliente criado
   - Serviço: Seleciona o serviço criado
   - Valor: `30`
   - Data Vencimento: Hoje
   - Método: `MBWay`
4. Clica **"Criar Pagamento"**

**Verificação:**
- ✅ Pagamento aparece na lista?
- ✅ Recarrega página (F5) - pagamento continua lá?
- ✅ Fecha browser e abre novamente - pagamento continua lá?

**Status:** [ ] Passou ✅ / [ ] Falhou ❌

---

### 4️⃣ TESTE: CRIAR AGENDAMENTO

**Passos:**
1. Vai a **Agendamentos**
2. Clica **"Novo Agendamento"**
3. Preenche:
   - Cliente: Seleciona cliente
   - Serviço: Seleciona serviço
   - Data: Amanhã
   - Hora: `10:00`
4. Clica **"Criar Agendamento"**

**Verificação:**
- ✅ Agendamento aparece na lista?
- ✅ Recarrega página (F5) - agendamento continua lá?

**Status:** [ ] Passou ✅ / [ ] Falhou ❌

---

### 5️⃣ TESTE: CRIAR DESPESA

**Passos:**
1. Vai a **Despesas**
2. Clica **"Nova Despesa"**
3. Preenche:
   - Descrição: `Renda do ginásio`
   - Categoria: `Instalações`
   - Valor: `500`
   - Data: Hoje
4. Clica **"Criar Despesa"**

**Verificação:**
- ✅ Despesa aparece na lista?
- ✅ Recarrega página (F5) - despesa continua lá?

**Status:** [ ] Passou ✅ / [ ] Falhou ❌

---

### 6️⃣ TESTE: CRIAR EVENTO

**Passos:**
1. Vai a **Eventos**
2. Clica **"Novo Evento"**
3. Preenche:
   - Nome: `Workshop de Pilates`
   - Categoria: `Workshop`
   - Data Início: Próxima semana
4. Clica **"Criar Evento"**

**Verificação:**
- ✅ Evento aparece na lista?
- ✅ Recarrega página (F5) - evento continua lá?

**Status:** [ ] Passou ✅ / [ ] Falhou ❌

---

## 🔍 VERIFICAÇÃO FINAL

### TESTE DE PERSISTÊNCIA (IMPORTANTE!)

1. **Cria 1 item de cada tipo** (serviço, cliente, pagamento)
2. **Fecha completamente o browser**
3. **Aguarda 5 minutos**
4. **Abre novamente:** https://refit-dashboard.netlify.app
5. **Faz login**
6. **Verifica se TODOS os dados continuam lá**

**Resultado:** [ ] Todos os dados persistiram ✅ / [ ] Alguns dados perderam-se ❌

---

## 🐛 SE ALGO FALHAR

### Erro: "Dados não aparecem após recarregar"

**Possíveis causas:**
1. ❌ Backend no Render está "dormindo"
2. ❌ Base de dados não está a guardar
3. ❌ Problema de conexão

**Solução:**
1. Aguarda 30 segundos (backend acordar)
2. Recarrega página
3. Se persistir, avisa-me!

---

### Erro: "Falha ao contactar a API (404)"

**Causa:** Frontend não está a conectar ao backend

**Solução:**
1. Hard refresh: Ctrl+Shift+R
2. Limpa cache do browser
3. Se persistir, avisa-me!

---

## ✅ RESULTADO ESPERADO

**Todos os testes devem passar!**

Se **TODOS** os dados ficarem guardados após:
- ✅ Recarregar página
- ✅ Fechar e abrir browser
- ✅ Aguardar 5 minutos

**Então está 100% operacional!** 🎉

---

## 📊 ONDE OS DADOS SÃO GUARDADOS

**Base de dados:** PostgreSQL no Render
- **URL:** Configurada no backend
- **Persistente:** Sim, dados nunca se perdem
- **Backup:** Automático pelo Render

**Importante:**
- ✅ Dados guardados são **permanentes**
- ✅ Mesmo que backend "durma", dados ficam guardados
- ✅ Quando backend acorda, dados continuam lá

---

## 🎯 PRÓXIMOS PASSOS

**Depois de confirmar que tudo guarda:**

1. ✅ Criar serviços reais (Pilates, Hybrid, etc.)
2. ✅ Adicionar clientes reais
3. ✅ Registar pagamentos
4. ✅ Agendar sessões
5. ✅ Usar dashboard diariamente!

---

**Faz os testes e avisa-me o resultado!** 🚀
