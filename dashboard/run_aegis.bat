@echo off
TITLE AEGIS PRIME - SYSTEM INITIALIZATION
COLOR 0A
CLS

ECHO ===================================================
ECHO      AEGIS PRIME v2.0 - TACTICAL DASHBOARD
ECHO ===================================================
ECHO.
ECHO [SYSTEM] Verificando ambiente...

WHERE npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO [CRITICAL ERROR] Node.js/NPM nao encontrado!
    ECHO Por favor, instale o Node.js para prosseguir.
    PAUSE
    EXIT
)

ECHO [SYSTEM] Instalando dependencias (Isso pode demorar)...
call npm install
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO [ERROR] Falha na instalacao de dependencias.
    PAUSE
    EXIT
)

ECHO [SYSTEM] Compilando modulos de producao (BUILD)...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO [ERROR] Falha na compilacao. Verifique os erros acima.
    PAUSE
    EXIT
)

ECHO.
ECHO [SUCCESS] Sistema pronto.
ECHO [SYSTEM] Iniciando servidor seguro...
ECHO.
ECHO Acesse no navegador: http://localhost:4173
ECHO.
ECHO Pressione CTRL+C para encerrar.
ECHO.

call npm run preview
PAUSE