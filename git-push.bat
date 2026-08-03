@echo off
echo ========================================
echo   SUBIR CODIGO PARA GITHUB
echo   Username: Refitruisantos
echo ========================================
echo.

echo Inicializando Git...
git init
echo.

echo Adicionando ficheiros...
git add .
echo.

echo Fazendo commit...
git commit -m "REFIT Dashboard - Production Ready"
echo.

echo Conectando ao GitHub...
git remote add origin https://github.com/Refitruisantos/refit-dashboard.git
echo.

echo Fazendo push...
git branch -M main
git push -u origin main
echo.

echo ========================================
echo   CODIGO SUBIDO COM SUCESSO!
echo ========================================
echo.
echo Proximo passo: Deploy no Render
echo.
pause
