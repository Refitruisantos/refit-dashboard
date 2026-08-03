@echo off
echo ========================================
echo   SETUP COMPLETO - REFIT
echo ========================================
echo.
echo IMPORTANTE: Fecha o backend antes de continuar!
echo Pressiona Ctrl+C no terminal do backend.
echo.
pause
echo.

echo ========================================
echo   PASSO 1: MIGRAR BASE DE DADOS
echo ========================================
echo.
cd backend
call npx prisma migrate dev --name complete_schema
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Migração falhou!
    echo Certifica-te que o backend está fechado.
    pause
    exit /b 1
)
echo.
echo ✅ Base de dados migrada com sucesso!
echo.

echo ========================================
echo   PASSO 2: REGENERAR PRISMA CLIENT
echo ========================================
echo.
call npx prisma generate
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Geração do Prisma Client falhou!
    pause
    exit /b 1
)
echo.
echo ✅ Prisma Client regenerado com sucesso!
echo.

echo ========================================
echo   PASSO 3: CRIAR ADMINISTRADOR
echo ========================================
echo.
call npx tsx src/scripts/createAdmin.ts
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Criação do admin falhou!
    pause
    exit /b 1
)
echo.
echo ✅ Administrador criado com sucesso!
echo.

cd ..

echo ========================================
echo   PASSO 4 (OPCIONAL): DADOS DE TESTE
echo ========================================
echo.
echo Queres criar dados de teste? (200 clientes, serviços, etc.)
echo.
choice /C SN /M "Criar dados de teste"
if %errorlevel% equ 1 (
    echo.
    echo Criando dados de teste...
    cd backend
    call npm run db:seed
    cd ..
    echo.
    echo ✅ Dados de teste criados!
) else (
    echo.
    echo ⏭️  Dados de teste ignorados.
)

echo.
echo ========================================
echo   ✅ SETUP COMPLETO!
echo ========================================
echo.
echo A aplicação está pronta para usar!
echo.
echo CREDENCIAIS DE ACESSO:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📧 Email:    admin@refit.pt
echo 🔑 Senha:    Admin@2026
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo PRÓXIMOS PASSOS:
echo 1. Executar: start.bat
echo 2. Abrir: http://localhost:5173
echo 3. Fazer login com as credenciais acima
echo.
echo ⚠️  IMPORTANTE: Altere a senha após o primeiro login!
echo.
pause
