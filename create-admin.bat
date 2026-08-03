@echo off
echo ========================================
echo   CRIAR ADMINISTRADOR - REFIT
echo ========================================
echo.

cd backend
echo Executando script...
echo.

npx tsx src/scripts/createAdmin.ts

echo.
echo ========================================
echo   Processo concluido!
echo ========================================
echo.
pause
