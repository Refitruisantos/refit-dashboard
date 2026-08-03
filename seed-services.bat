@echo off
title Seed Services - REFIT
color 0A

echo.
echo ========================================
echo    REFIT - Popular Servicos
echo ========================================
echo.

cd backend

echo [INFO] Criando servicos iniciais...
echo.
echo - Pilates (€15/sessao)
echo - Hybrid (€20/sessao)
echo - Treino Personalizado (€35/sessao)
echo.

call npx tsx prisma/seed-services.ts

echo.
echo ========================================
echo    Servicos criados com sucesso!
echo ========================================
echo.
echo Agora pode criar clientes e selecionar
echo o servico pretendido.
echo.
pause
