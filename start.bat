@echo off
title REFIT Dashboard Launcher
color 0A

echo.
echo ========================================
echo    REFIT Dashboard - Auto Start
echo ========================================
echo.

:: Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js nao encontrado!
    echo Por favor, instale Node.js primeiro.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
echo.

:: Criar .env no frontend se nao existir
if not exist "frontend\.env" (
    echo [INFO] Criando frontend\.env...
    echo VITE_API_URL=http://localhost:4000 > frontend\.env
)

:: Instalar dependencias do backend se necessario
if not exist "backend\node_modules" (
    echo [INFO] Instalando dependencias do backend...
    cd backend
    call npm install
    cd ..
)

:: Verificar se Prisma está configurado
if not exist "backend\node_modules\.prisma" (
    echo [INFO] Gerando Prisma Client...
    cd backend
    call npx prisma generate
    cd ..
)

:: Verificar se base de dados existe
if not exist "backend\prisma\dev.db" (
    echo [INFO] Criando base de dados SQLite...
    cd backend
    call npx prisma migrate deploy
    cd ..
)

:: Instalar dependencias do frontend se necessario
if not exist "frontend\node_modules" (
    echo [INFO] Instalando dependencias do frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ========================================
echo    Iniciando Servidores...
echo ========================================
echo.

:: Iniciar Backend em nova janela
echo [1/2] Iniciando Backend API (porta 3000)...
start "REFIT Backend API" cmd /k "cd backend && npm run dev"

:: Aguardar 3 segundos
timeout /t 3 /nobreak >nul

:: Iniciar Frontend em nova janela
echo [2/2] Iniciando Frontend (porta 5173)...
start "REFIT Frontend" cmd /k "cd frontend && npm run dev"

:: Aguardar 5 segundos
timeout /t 5 /nobreak >nul

:: Abrir browser
echo.
echo [INFO] Abrindo browser...
start http://localhost:5173

echo.
echo ========================================
echo    REFIT Dashboard Iniciado!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo.
echo Para parar os servidores, feche as janelas
echo "REFIT Backend API" e "REFIT Frontend"
echo.
pause
