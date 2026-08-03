@echo off
title Reset Database - REFIT
color 0C

echo.
echo ========================================
echo    REFIT - Reset Base de Dados
echo ========================================
echo.
echo AVISO: Isto vai apagar todos os dados!
echo.
pause

cd backend

echo.
echo [1/4] Apagando base de dados antiga...
if exist "prisma\dev.db" del /F /Q "prisma\dev.db"
if exist "prisma\dev.db-journal" del /F /Q "prisma\dev.db-journal"

echo [2/4] Executando migracoes...
call npx prisma migrate deploy

echo.
echo [3/4] Gerando Prisma Client...
call npx prisma generate

echo.
echo [4/4] Base de dados criada com sucesso!
echo.
echo Arquivo: backend\prisma\dev.db
echo.
echo Agora pode executar start.bat
echo.
pause
