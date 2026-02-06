@echo off
echo.
echo ═══════════════════════════════════════════════
echo    AEGIS PRIME - SISTEMA DE PAREAMENTO
echo ═══════════════════════════════════════════════
echo.

echo [1/2] Iniciando servidor de pareamento...
cd /d C:\Users\felli\Desktop\aegis
start "Pairing Server" cmd /k "node pairing-server.js"

timeout /t 3 /nobreak >nul

echo.
echo [2/2] Iniciando dashboard...
cd /d C:\Users\felli\Desktop\aegis\dashboard
start "Dashboard" cmd /k "npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════
echo  ✅ SERVIDORES INICIADOS!
echo ═══════════════════════════════════════════════
echo.
echo  📱 Servidor Pareamento: http://192.168.15.4:3001
echo  🌐 Dashboard Visual:     http://192.168.15.4:3002
echo.
echo  IMPORTANTE:
echo  1. Veja o código no terminal "Pairing Server"
echo  2. Use o código NO APP DO CELULAR (não no navegador!)
echo  3. Dashboard (3002) é só para VER dados depois
echo.
echo  Pressione qualquer tecla para abrir os servidores no navegador...
pause >nul

start http://192.168.15.4:3001
start http://192.168.15.4:3002

echo.
echo  ✅ Navegadores abertos!
echo.
pause
