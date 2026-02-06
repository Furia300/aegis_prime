@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║    🚀 AEGIS PRIME - PREPARAÇÃO AUTOMÁTICA PARA PRODUÇÃO     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM =============================================================
REM ETAPA 1: VERIFICAR DEPENDÊNCIAS
REM =============================================================
echo [1/7] Verificando dependências...
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado!
    echo    Instale: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

REM Verificar Gradle
where gradle >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Gradle não encontrado globalmente, usando gradlew
) else (
    echo ✅ Gradle encontrado
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM =============================================================
REM ETAPA 2: COMPILAR APK DE PRODUÇÃO
REM =============================================================
echo [2/7] Compilando APK de produção...
echo.

cd /d C:\Users\felli\StudioProjects\aegis_prime

echo Limpando build anterior...
call gradlew.bat clean

echo Compilando APK Release...
call gradlew.bat assembleRelease

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao compilar APK!
    pause
    exit /b 1
)

echo ✅ APK compilado com sucesso!

REM Copiar APK para pasta aegis
echo Copiando APK...
copy /Y "app\build\outputs\apk\release\app-release.apk" "C:\Users\felli\Desktop\aegis\aegis-prime-PRODUCAO.apk"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao copiar APK!
    pause
    exit /b 1
)

echo ✅ APK copiado para: C:\Users\felli\Desktop\aegis\aegis-prime-PRODUCAO.apk

REM Obter tamanho do APK
for %%A in ("C:\Users\felli\Desktop\aegis\aegis-prime-PRODUCAO.apk") do set APK_SIZE=%%~zA
set /A APK_SIZE_MB=%APK_SIZE% / 1048576
echo    Tamanho: %APK_SIZE_MB% MB

echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM =============================================================
REM ETAPA 3: INSTALAR DEPENDÊNCIAS DO DASHBOARD
REM =============================================================
echo [3/7] Preparando Dashboard Trae...
echo.

cd /d C:\Users\felli\Desktop\aegis\dashboard

if not exist "node_modules" (
    echo Instalando dependências do dashboard...
    call npm install

    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas
) else (
    echo ✅ Dependências já instaladas
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM =============================================================
REM ETAPA 4: VERIFICAR CONFIGURAÇÃO
REM =============================================================
echo [4/7] Verificando configurações...
echo.

REM Verificar .env
if not exist ".env" (
    echo ⚠️ Arquivo .env não encontrado!
    echo    Criando .env de exemplo...

    (
        echo VITE_SUPABASE_URL=https://hacxikpmgeataaoppsnf.supabase.co
        echo VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
        echo VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN_HERE
    ) > .env

    echo ✅ .env criado! IMPORTANTE: Edite e adicione suas chaves!
    echo    Arquivo: C:\Users\felli\Desktop\aegis\dashboard\.env
) else (
    echo ✅ .env encontrado
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM =============================================================
REM ETAPA 5: BUILD DO DASHBOARD
REM =============================================================
echo [5/7] Fazendo build do dashboard...
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Erro ao fazer build do dashboard
    echo    Isso pode ser normal se as chaves do .env não estiverem configuradas
) else (
    echo ✅ Dashboard compilado com sucesso!
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM =============================================================
REM ETAPA 6: VERIFICAR DISPOSITIVO CONECTADO
REM =============================================================
echo [6/7] Verificando dispositivo Android...
echo.

REM Procurar ADB
set ADB_PATH=

if exist "C:\platform-tools\adb.exe" (
    set ADB_PATH=C:\platform-tools\adb.exe
) else if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools\adb.exe" (
    set ADB_PATH=C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools\adb.exe
) else (
    echo ⚠️ ADB não encontrado!
    echo    Você precisará instalar o APK manualmente
    goto :skip_install
)

echo ✅ ADB encontrado: %ADB_PATH%
echo.

echo Dispositivos conectados:
"%ADB_PATH%" devices
echo.

REM Contar dispositivos
for /f "skip=1" %%A in ('"%ADB_PATH%" devices ^| find /c /v ""') do set DEVICE_COUNT=%%A

if %DEVICE_COUNT% EQU 0 (
    echo ⚠️ Nenhum dispositivo conectado!
    echo    Conecte o dispositivo via USB e habilite USB Debugging
    goto :skip_install
)

echo ✅ Dispositivo conectado!
echo.

REM =============================================================
REM ETAPA 7: INSTALAR APK
REM =============================================================
echo [7/7] Instalando APK no dispositivo...
echo.

cd /d C:\Users\felli\Desktop\aegis

"%ADB_PATH%" install -r -d aegis-prime-PRODUCAO.apk

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar APK!
    echo.
    echo Soluções:
    echo 1. Desinstale a versão antiga manualmente
    echo 2. Desabilite Device Admin
    echo 3. Tente novamente
    pause
    exit /b 1
)

echo ✅ APK instalado com sucesso!

goto :done

:skip_install
echo.
echo ⚠️ Instalação do APK pulada
echo.

:done
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 🎉 PREPARAÇÃO CONCLUÍDA!
echo.
echo 📱 APK de Produção: C:\Users\felli\Desktop\aegis\aegis-prime-PRODUCAO.apk
echo    Tamanho: %APK_SIZE_MB% MB
echo.
echo 🌐 Dashboard: C:\Users\felli\Desktop\aegis\dashboard
echo    Para iniciar: npm run dev
echo.
echo 📝 Documentação:
echo    - PREPARAR-PRODUCAO.md
echo    - SUPABASE-SCHEMA.sql
echo.
echo 🚀 PRÓXIMOS PASSOS:
echo.
echo 1. Execute o SQL no Supabase:
echo    Dashboard → SQL Editor → Copie SUPABASE-SCHEMA.sql
echo.
echo 2. Configure o .env do dashboard:
echo    dashboard\.env → Adicione SUPABASE_ANON_KEY e MAPBOX_TOKEN
echo.
echo 3. Inicie o dashboard:
echo    cd dashboard
echo    npm run dev
echo.
echo 4. Abra o app no celular:
echo    - Conceda TODAS as permissões
echo    - Pareie com o servidor
echo.
echo 5. Verifique dados no Supabase:
echo    Table Editor → Veja locations, keylogs, etc.
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
