# 🔧 HABILITAR ACESSIBILIDADE NO XIAOMI - GUIA DEFINITIVO

## ❌ PROBLEMA IDENTIFICADO

**Logs mostram**:
```
Serviços habilitados: 2
Serviço encontrado: com.aisistem.cloud/.dados.Acessibilidade
Serviço encontrado: com.microsoft.appmanager/...
❌ Serviço de acessibilidade NÃO está ativo
```

**Causa**: O Xiaomi/MIUI **bloqueia habilitação automática via ADB** de serviços de acessibilidade por segurança. Você precisa habilitar manualmente.

---

## ✅ SOLUÇÃO - PASSO A PASSO DETALHADO

### **Método 1: Via Configurações → Acessibilidade (RECOMENDADO)**

1. **No celular, vá em Configurações**
   - Ícone de engrenagem ⚙️

2. **Procure "Acessibilidade"** (pode estar em locais diferentes):
   - **Opção A**: Configurações → **Configurações adicionais** → **Acessibilidade**
   - **Opção B**: Configurações → **Acessibilidade**
   - **Opção C**: Use a busca no topo: digite "Acessibilidade"

3. **Role até "SERVIÇOS INSTALADOS" ou "Serviços baixados"**
   - Vai mostrar uma lista de apps com serviços de acessibilidade

4. **Procure "Aegis Prime"** na lista
   - Deve aparecer com o ícone vermelho do app

5. **Toque em "Aegis Prime"**

6. **Ative o toggle no topo da tela**
   - Toggle vai ficar AZUL/VERDE quando ativo

7. **Vai aparecer um AVISO de segurança**
   ```
   "Este serviço pode capturar tudo que é exibido na tela,
    incluindo informações pessoais como senhas e mensagens..."
   ```
   - Leia o aviso
   - Toque em **"OK"** ou **"PERMITIR"**

8. **Volte para o app Aegis Prime**
   - Pressione o botão voltar ou abra o app novamente
   - O app deve avançar automaticamente para a próxima tela!

---

### **Método 2: Via Notificação do App**

Se o app mostrou uma notificação para habilitar acessibilidade:

1. **Toque na notificação**
2. **Isso vai abrir direto nas configurações de acessibilidade**
3. **Ative o toggle**
4. **Confirme o aviso**
5. **Volte para o app**

---

### **Método 3: Via Botão no App**

Se o app tem um botão "Ativar Acessibilidade" ou "Ir para Configurações":

1. **Toque no botão**
2. **Vai abrir as configurações de acessibilidade**
3. **Procure "Aegis Prime"** na lista
4. **Ative o toggle**
5. **Confirme o aviso**
6. **Pressione voltar** para retornar ao app

---

## 🔍 COMO ENCONTRAR ACESSIBILIDADE NO MIUI 12/13/14

### **MIUI 12/13**:
```
Configurações
└── Configurações adicionais (Additional settings)
    └── Acessibilidade (Accessibility)
        └── Serviços instalados (Installed services)
            └── Aegis Prime
```

### **MIUI 14**:
```
Configurações
└── Acessibilidade (Accessibility)
    └── Serviços baixados (Downloaded services)
        └── Aegis Prime
```

### **Se não encontrar**:
1. Abra **Configurações**
2. Use a **barra de busca no topo** 🔍
3. Digite: **"Acessibilidade"** ou **"Accessibility"**
4. Toque no resultado que aparecer

---

## ⚠️ AVISOS DO XIAOMI

Durante a habilitação, o Xiaomi pode mostrar **VÁRIOS avisos**:

### **Aviso 1: "Este app pode capturar sua tela"**
- ✅ Normal! Confirme com **"OK"**

### **Aviso 2: "Controle total do dispositivo"**
- ✅ Normal! Confirme com **"PERMITIR"**

### **Aviso 3: "Deseja permitir que Aegis Prime observe..."**
- ✅ Normal! Confirme com **"OK"** ou **"PERMITIR"**

**Esses avisos são esperados para serviços de acessibilidade!**

---

## ✅ COMO SABER SE FUNCIONOU

### **No App:**
- ✅ A tela deve **avançar automaticamente**
- ✅ Você verá a próxima tela de permissão (Admin do Dispositivo)
- ✅ No topo pode aparecer "✓ Acessibilidade concedida"

### **Nos Logs (no PC):**
```
✅ SERVIÇO DE ACESSIBILIDADE ATIVO!
✅ TODAS AS PERMISSÕES CONCEDIDAS! Avançando para PAREAMENTO
```

### **Nas Configurações:**
- Configurações → Acessibilidade → Aegis Prime
- Toggle estará **ATIVO (azul/verde)**

---

## 🐛 SE NÃO APARECER "AEGIS PRIME" NA LISTA

Se o app não aparece em "Serviços instalados":

### **1. Verifique se o app está realmente instalado**
```
Configurações → Apps → Gerenciar apps → Procure "Aegis Prime"
```

### **2. Reinicie o celular**
```
Mantenha o botão Power pressionado → Reiniciar
```

### **3. Reinstale o APK**
No PC, execute:
```bash
adb uninstall com.example.aegis_prime
adb install -r -d "C:\Users\felli\Desktop\aegis\aegis-prime-novo.apk"
```

### **4. Verifique permissões do app**
```
Configurações → Apps → Aegis Prime → Permissões
```
- Certifique-se que o app tem permissão para "Exibir sobre outros apps"

---

## 🔒 PROTEÇÃO MIUI - Por que via ADB não funciona?

O Xiaomi/MIUI **bloqueia propositalmente** a habilitação de serviços de acessibilidade via comandos ADB para:
- ✅ Prevenir malware
- ✅ Proteger contra apps maliciosos
- ✅ Garantir que usuário está ciente do que está permitindo

**Isso é NORMAL e esperado!** Você **DEVE** habilitar manualmente.

---

## 📱 PRÓXIMAS TELAS (após habilitar acessibilidade)

Sequência completa do app:

1. ✅ **Acessibilidade** ← Você está aqui!
2. 🔄 **Admin do Dispositivo**
3. 🔄 **Pareamento** (código 6 dígitos)

Cada tela será mostrada automaticamente após a anterior ser concedida!

---

## 💡 DICA PRO

**Mantenha a tela de Configurações de Acessibilidade aberta em uma aba:**

1. Abra Configurações → Acessibilidade
2. Use o botão "Recentes" (quadrado) do Android
3. Alterne entre Aegis Prime e Configurações
4. Facilita voltar rapidamente para habilitar!

---

## 🆘 SE AINDA NÃO FUNCIONAR

**Me envie prints de**:
1. Tela de Configurações → Acessibilidade → Serviços instalados
2. Tela do app Aegis Prime (mostrando a tela de permissão)
3. Qualquer mensagem de erro

**E execute no PC**:
```bash
adb shell dumpsys package com.example.aegis_prime | grep -A 5 "accessibility"
```

Me envie o resultado e vou investigar mais!

---

## ✅ RESUMO RÁPIDO

```
1. Configurações → Acessibilidade
2. Procure "Aegis Prime"
3. Ative o toggle
4. Confirme os avisos
5. Volte para o app
6. App vai avançar sozinho! 🎉
```

**IMPORTANTE**: O MIUI **BLOQUEIA** habilitação via ADB. Você **DEVE** fazer manualmente!

---

**Boa sorte! O resto do fluxo vai funcionar automaticamente após você habilitar! 🚀**
