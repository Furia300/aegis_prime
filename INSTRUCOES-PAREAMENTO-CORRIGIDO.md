# ✅ AEGIS PRIME - INSTRUÇÕES DE PAREAMENTO (CORRIGIDO)

## ⚠️ IP CORRETO DO SERVIDOR

```
┌─────────────────────────────────────────────┐
│  URL CORRETA:                               │
│  http://192.168.15.5:3001                   │
│                                             │
│  ❌ ERRADO: 192.168.15.4 (IP do celular)   │
│  ✅ CERTO:  192.168.15.5 (IP do PC)        │
└─────────────────────────────────────────────┘
```

## 📱 PASSO A PASSO COMPLETO

### 1️⃣ Abrir Dashboard no PC
```
http://192.168.15.5:3003/
```

### 2️⃣ Clicar em "ADICIONAR NOVO DISPOSITIVO"
Procure botão na sidebar ou no centro da tela

### 3️⃣ Clicar na tab "CÓDIGO MANUAL"
Vai aparecer um modal com 2 tabs

### 4️⃣ Copiar código de 6 dígitos
Exemplo: 763092

Se o código não aparecer:
- Abra DevTools (F12)
- Tab Console - veja se tem erros
- Tab Network - veja se `/api/new-pairing` foi chamado

### 5️⃣ Abrir App no Celular
- Procure "Aegis Prime"
- Se já estava aberto: FECHE completamente e abra de novo

### 6️⃣ Preencher campos NO APP:
```
URL DO DASHBOARD: http://192.168.15.5:3001
                  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                  ATENÇÃO: .5 NÃO .4 !!!
```

```
CÓDIGO DE PAREAMENTO: 763092
```

### 7️⃣ Clicar CONNECT

### 8️⃣ Aguardar sucesso!
- Mensagem: "✓ PAREAMENTO CONCLUÍDO!"
- App avança para tela principal

---

## 🔍 TROUBLESHOOTING

### Erro: "Failed to connect to / 192.168.15.4:3001"
❌ **Problema**: Você digitou IP `.4` (celular) em vez de `.5` (PC)
✅ **Solução**: Corrija para: `http://192.168.15.5:3001`

### Erro: "Cannot GET /"
❌ **Isso é NORMAL!** Servidor API não tem página raiz
✅ **Solução**: Use a URL completa no app conforme instruções acima

### Erro: "Código inválido"
❌ **Problema**: Código expirou (mudam a cada 5 minutos)
✅ **Solução**: Pegue código novo no dashboard

### Erro: "Failed to connect" ou timeout
❌ **Problema**: Servidores não estão rodando
✅ **Solução**: Veja seção "Reiniciar Servidores" abaixo

### Dashboard não mostra código
❌ **Problema**: API `/api/new-pairing` não foi chamada
✅ **Solução**:
1. F12 → Console → veja erros JavaScript
2. F12 → Network → veja se `/api/new-pairing` foi chamado
3. Teste manual: `curl http://192.168.15.5:3003/api/new-pairing?user_id=test`

---

## 🔧 REINICIAR SERVIDORES

Se os servidores caíram ou não estão respondendo:

### Verificar se estão rodando:
```bash
# Testar Pairing Server
curl http://192.168.15.5:3001/api/pairing-code

# Testar Dashboard
curl http://192.168.15.5:3003
```

### Se NÃO responderem, reinicie:
```bash
# Terminal 1: Pairing Server
cd C:\Users\felli\Desktop\aegis
node pairing-server.js

# Terminal 2: Dashboard
cd C:\Users\felli\Desktop\aegis\dashboard
npm run dev
```

**Deixe ambos terminais abertos!**

---

## 📊 RESUMO TÉCNICO

| Dispositivo | IP | Porta | Função |
|-------------|-----|-------|---------|
| Celular | 192.168.15.4 | - | Roda o app |
| PC | 192.168.15.5 | - | Roda os servidores |
| Pairing API | 192.168.15.5 | 3001 | App conecta aqui |
| Dashboard | 192.168.15.5 | 3003 | Navegador acessa aqui |

---

## 🎯 CÓDIGO ATUAL

**Código de pareamento agora:**
```
763092
```

Para ver código atualizado:
```bash
curl http://192.168.15.5:3001/api/pairing-code
```

---

## ✅ CHECKLIST

Antes de tentar parear, confirme:

- [ ] Pairing server rodando (porta 3001)
- [ ] Dashboard rodando (porta 3003)
- [ ] Código atual copiado do dashboard
- [ ] URL no app: `http://192.168.15.5:3001` (com `.5` não `.4`)
- [ ] Código digitado no app
- [ ] Botão CONNECT clicado
- [ ] Aguardando 10 segundos para resposta

---

## 📱 EXEMPLO VISUAL

**Tela do App (correto):**
```
┌─────────────────────────────────────┐
│  AEGIS PRIME                        │
│                                     │
│  URL DO DASHBOARD                   │
│  ┌───────────────────────────────┐ │
│  │ http://192.168.15.5:3001      │ │
│  └───────────────────────────────┘ │
│                                     │
│  CÓDIGO DE PAREAMENTO               │
│  ┌───────────────────────────────┐ │
│  │ 763092                        │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │         CONNECT               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🚨 ERROS ANTERIORES

### O que você estava fazendo errado:
1. ❌ URL: `http://192.168.15.4:3001`
   - IP `.4` é do CELULAR
   - Celular tentava conectar a si mesmo
   - Resultado: "Failed to connect"

2. ❌ Acessando `http://192.168.15.5:3001/` no navegador
   - Servidor API não tem página raiz
   - Resultado: "Cannot GET /"
   - **Isso é normal!** Não é erro real

### O que você deve fazer agora:
1. ✅ URL: `http://192.168.15.5:3001`
   - IP `.5` é do PC
   - É onde o servidor está rodando
   - App vai conseguir conectar

2. ✅ Código: pegar do dashboard em `http://192.168.15.5:3003/`
   - Dashboard tem interface visual
   - Mostra código de 6 dígitos
   - Use esse código no app

---

## 💡 DICAS IMPORTANTES

1. **Códigos expiram**: Mudam a cada 5 minutos por segurança
2. **Servidores devem estar rodando**: Deixe terminais abertos
3. **WiFi na mesma rede**: Celular e PC devem estar na mesma rede 192.168.15.x
4. **IP correto**: SEMPRE `.5` para servidor, NUNCA `.4`

---

## 📞 SE AINDA NÃO FUNCIONAR

Envie os seguintes logs:

### Logs do Android:
```bash
adb logcat -s Aegis:D AegisPrime:D *:S
```

### Logs do Pairing Server:
Copie o que aparece no terminal onde rodou `node pairing-server.js`

### Teste de Rede:
```bash
# Do celular, tente:
ping 192.168.15.5

# Se ping não funcionar: problema de rede/firewall
```

---

**Data:** 03/02/2026
**Código atual:** 763092
**Servidores:** ✅ Rodando
**Status:** ✅ PRONTO PARA PAREAR

**Agora é só seguir o passo a passo acima! 🚀**
