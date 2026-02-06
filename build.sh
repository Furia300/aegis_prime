#!/bin/bash

echo "========================================"
echo "   AEGIS PRIME - BUILD E DEPLOY"
echo "========================================"
echo ""

cd /c/Users/felli/StudioProjects/aegis_prime

echo "[1/5] Compilando APK Release..."
./gradlew assembleRelease || exit 1

echo ""
echo "[2/5] Copiando APK..."
mkdir -p /c/Users/felli/Desktop/aegis/android-nativo/outputs/apk/release
cp app/build/outputs/apk/release/app-release.apk /c/Users/felli/Desktop/aegis/android-nativo/outputs/apk/release/

echo ""
echo "[3/5] Assinando APK..."
cd /c/Users/felli/Desktop/aegis/android-nativo/outputs/apk/release
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore /c/Users/felli/aegis-keystore.jks \
  -storepass aegisprime2026 -keypass aegisprime2026 \
  app-release.apk aegis-key

echo ""
echo "[4/5] Otimizando com zipalign..."
/c/Users/felli/AppData/Local/Android/Sdk/build-tools/30.0.3/zipalign.exe -f 4 \
  app-release.apk aegis-prime-FINAL.apk

echo ""
echo "[5/5] Copiando para frontend..."
cp aegis-prime-FINAL.apk /c/Users/felli/Desktop/aegis/frontend/public/aegis-prime.apk

echo ""
echo "========================================"
echo " ✅ BUILD CONCLUÍDO COM SUCESSO!"
echo "========================================"
echo ""
echo "APK: C:\Users\felli\Desktop\aegis\android-nativo\outputs\apk\release\aegis-prime-FINAL.apk"
ls -lh aegis-prime-FINAL.apk
echo ""
