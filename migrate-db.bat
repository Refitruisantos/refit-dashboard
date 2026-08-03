@echo off
title Migrate Database - REFIT
color 0A

echo.
echo ========================================
echo    REFIT - Migrar Base de Dados
echo ========================================
echo.

cd backend

echo [INFO] Gerando Prisma Client...
call npx prisma generate

echo.
echo [INFO] Aplicando migracoes...
call npx prisma migrate dev --name update_all_modules

echo.
echo ========================================
echo    Migracao concluida!
echo ========================================
echo.
echo A base de dados foi atualizada com:
echo - Pagamentos (serviceId, period, notes)
echo - Appointments (Agenda de Treinos)
echo - Events (Planeamento REFIT)
echo - Expenses (supplier, expenseDate, method, type, recurrence, notes)
echo.
echo Modulos prontos:
echo [OK] Dashboard
echo [OK] Clientes
echo [OK] Servicos
echo [OK] Agenda
echo [OK] Pagamentos
echo [OK] Despesas
echo.
pause
