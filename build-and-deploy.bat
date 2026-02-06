@echo off
echo ========================================
echo    AEGIS PRIME - BUILD E DEPLOY
echo ========================================
echo.

cd C:\Users\felli\StudioProjects\aegis_prime

echo [1/5] Limpando projeto...
call gradlew.bat clean
if errorlevel 1 goto error

echo.
echo [2/5] Compilando APK Release...
call gradlew.bat assembleRelease
if errorlevel 1 goto error

echo.
echo [3/5] Copiando APK para area de trabalho...
mkdir "C:\Users\felli\Desktop\aegis\android-nativo\outputs\apk\release" 2>nul
copy /Y "app\build\outputs\apk\release\app-release.apk" "C:\Users\felli\Desktop\aegis\android-nativo\outputs\apk\release\"
if errorlevel 1 goto error

echo.
echo [4/5] Assinando APK...
cd C:\Users\felli\Desktop\aegis\android-nativo\outputs\apk\release
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore C:\Users\felli\aegis-keystore.jks -storepass aegisprime2026 -keypass aegisprime2026 app-release.apk aegis-key
if errorlevel 1 goto error

echo.
echo [5/5] Otimizando com zipalign...
C:\Users\felli\AppData\Local\Android\Sdk\build-tools\30.0.3\zipalign.exe -f 4 app-release.apk aegis-prime-FINAL.apk
if errorlevel 1 goto error

echo.
echo [6/6] Copiando para frontend...
copy /Y aegis-prime-FINAL.apk C:\Users\felli\Desktop\aegis\frontend\public\aegis-prime.apk
if errorlevel 1 goto error

echo.
echo ========================================
echo  BUILD CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo APK final: C:\Users\felli\Desktop\aegis\android-nativo\outputs\apk\release\aegis-prime-FINAL.apk
echo Tamanho:
dir /b /s aegis-prime-FINAL.apk | findstr "aegis-prime-FINAL.apk"
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo  ERRO NA COMPILACAO!
echo ========================================
echo.
pause
exit /b 1
