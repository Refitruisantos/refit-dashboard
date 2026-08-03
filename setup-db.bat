@echo off
title Setup Database - REFIT
color 0A

echo.
echo ========================================
echo    REFIT - Setup Base de Dados
echo ========================================
echo.

cd backend

echo [1/3] Criando migracao Prisma...
call npx prisma migrate dev --name init

echo.
echo [2/3] Gerando Prisma Client...
call npx prisma generate

echo.
echo [3/3] Iniciando Backend...
call npm run dev

pause
