@echo off
chcp 65001 >nul
color 0A
cls

echo ========================================
echo    AEGIS PRIME - DASHBOARD LAUNCHER
echo ========================================
echo.
echo [1/3] Navegando para pasta do dashboard...
cd /d "%~dp0dashboard"

echo [2/3] Verificando dependências...
if not exist "node_modules" (
    echo.
    echo AVISO: Dependências não instaladas!
    echo Instalando agora... (pode demorar alguns minutos)
    echo.
    call npm install
    echo.
    echo Dependências instaladas com sucesso!
    echo.
)

echo [3/3] Iniciando servidor de desenvolvimento...
echo.
echo ========================================
echo   DASHBOARD INICIANDO...
echo ========================================
echo.
echo O dashboard abrirá automaticamente no navegador.
echo.
echo Para parar o servidor: Pressione Ctrl+C
echo.
echo ========================================
echo.

start "" "http://localhost:5173"

call npm run dev

pause
