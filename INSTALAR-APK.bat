@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║         🛡️  AEGIS PRIME - INSTALADOR DE APK                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Procurar adb em localizações comuns
set ADB_PATH=

if exist "C:\platform-tools\adb.exe" (
    set ADB_PATH=C:\platform-tools\adb.exe
) else if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools\adb.exe" (
    set ADB_PATH=C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools\adb.exe
) else if exist "C:\Android\sdk\platform-tools\adb.exe" (
    set ADB_PATH=C:\Android\sdk\platform-tools\adb.exe
) else (
    echo ❌ ADB não encontrado!
    echo.
    echo Por favor, instale o ADB ou use a instalação manual:
    echo 1. Copie aegis-prime-SEM-SUPABASE.apk para o celular
    echo 2. Abra o arquivo no celular para instalar
    echo.
    pause
    exit /b 1
)

echo ✅ ADB encontrado: %ADB_PATH%
echo.

REM Verificar se dispositivo está conectado
echo Verificando dispositivos conectados...
"%ADB_PATH%" devices
echo.

REM Instalar APK
echo Instalando APK...
echo.
"%ADB_PATH%" install -r -d "aegis-prime-SEM-SUPABASE.apk"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ APK INSTALADO COM SUCESSO!
    echo.
    echo 📱 Próximos passos:
    echo 1. Abra o app "Aegis Prime" no celular
    echo 2. Insira o código de pareamento
    echo 3. Toque em CONNECT
    echo.
) else (
    echo.
    echo ❌ Erro ao instalar APK!
    echo.
    echo Tente desinstalar a versão antiga primeiro:
    echo Configurações ^> Apps ^> Aegis Prime ^> Desinstalar
    echo.
    echo Ou desabilite Device Admin:
    echo Configurações ^> Segurança ^> Admin do Dispositivo ^> Aegis Prime ^> Desativar
    echo.
)

pause
