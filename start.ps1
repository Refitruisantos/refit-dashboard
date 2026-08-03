# Script PowerShell para iniciar REFIT Dashboard automaticamente

Write-Host "🚀 Iniciando REFIT Dashboard..." -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Por favor, instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se PostgreSQL está a correr
Write-Host "📊 Verificando PostgreSQL..." -ForegroundColor Cyan
$pgRunning = Get-Process postgres -ErrorAction SilentlyContinue
if (-not $pgRunning) {
    Write-Host "⚠️  PostgreSQL não está a correr. Por favor, inicie o PostgreSQL." -ForegroundColor Yellow
}

# Navegar para o backend
Write-Host "🔧 Iniciando Backend (API)..." -ForegroundColor Cyan
Set-Location backend

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    npm install
}

# Verificar se Prisma está configurado
if (-not (Test-Path "node_modules/.prisma")) {
    Write-Host "🔄 Gerando Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
}

# Iniciar backend em nova janela
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🔧 Backend API - http://localhost:3000' -ForegroundColor Green; npm run dev"

# Aguardar backend iniciar
Write-Host "⏳ Aguardando backend iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Navegar para o frontend
Set-Location ../frontend

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
    npm install
}

# Verificar se .env existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:3000" | Out-File -FilePath ".env" -Encoding UTF8
}

# Iniciar frontend em nova janela
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🎨 Frontend - http://localhost:5173' -ForegroundColor Green; npm run dev"

# Aguardar frontend iniciar
Write-Host "⏳ Aguardando frontend iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Abrir browser automaticamente
Write-Host "🌐 Abrindo browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ REFIT Dashboard iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para parar os servidores, feche as janelas do PowerShell." -ForegroundColor Yellow
Write-Host ""

# Voltar ao diretório raiz
Set-Location ..
