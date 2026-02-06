# ✅ AEGIS PRIME - TUDO PRONTO PARA PAREAR!

## 🎉 SERVIDORES RODANDO

| Servidor | Status | URL | Para que serve |
|----------|--------|-----|----------------|
| **Pairing API** | ✅ RODANDO | http://192.168.15.5:3001 | APP se conecta aqui |
| **Dashboard** | ✅ RODANDO | http://192.168.15.5:3003 | Ver dados no navegador |

---

## 🔑 CÓDIGO ATUAL DE PAREAMENTO

```
╔═══════════════════════════╗
║   CÓDIGO: 979962          ║
║   Válido até: ~03:43      ║
╚═══════════════════════════╝
```

**Este código muda a cada 5 minutos!**

Se expirou, execute:
```bash
curl http://192.168.15.5:3001/api/pairing-code
```

---

## 📱 VOCÊ NÃO PRECISA DESINSTALAR O APP!

**IMPORTANTE:** O app já está instalado e funcionando perfeitamente no seu celular.

**O que você precisa fazer:**

### 1️⃣ Abrir o App
- Procure "Aegis Prime" no celular
- Toque para abrir
- Se já estava aberto, **FECHE completamente** e abra de novo

### 2️⃣ Atualizar URL no App

**PROBLEMA ANTERIOR:** O app estava tentando conectar em `192.168.15.4:3001` (IP do celular)

**SOLUÇÃO:** Mudar para o IP do PC: `192.168.15.5:3001`

**Como fazer:**
- No campo **"URL do Servidor"** ou **"Server URL"**:
  - Apague: `http://192.168.15.4:3001`
  - Digite: `http://192.168.15.5:3001`

### 3️⃣ Digitar Código
- Campo **"CÓDIGO DE PAREAMENTO"**: `979962`
- (Se expirou, veja código atual executando `curl` acima)

### 4️⃣ Conectar
- Toque em **"CONNECT"** ou **"PAREAR"**
- Aguarde mensagem de sucesso

---

## 🔧 O QUE FOI CORRIGIDO

1. ✅ **Servidor de pareamento rodando** na porta 3001
2. ✅ **Dashboard rodando** na porta 3003
3. ✅ **IP corrigido**: 192.168.15.4 → **192.168.15.5** (IP do PC)
4. ✅ **Conflito de portas resolvido**: Vite estava tentando usar 3001
5. ✅ **Código atual disponível**: 979962

---

## 🌐 LINKS PARA TESTAR

### Testar API de Pareamento
```
http://192.168.15.5:3001/api/pairing-code
```
Deve retornar: `{"code":"979962"}`

### Acessar Dashboard no Navegador
```
http://192.168.15.5:3003
```
Deve mostrar: Interface "Aegis Prime v2.0 - War Room"

---

## 📊 APÓS PAREAR COM SUCESSO

1. **Ver dados no Supabase**:
   - https://supabase.com/dashboard/project/hacxikpmgeataaoppsnf
   - Table Editor → devices
   - Seu celular deve aparecer!

2. **Ver dashboard visual**:
   - http://192.168.15.5:3003
   - Mapa com sua localização
   - Dados em tempo real

---

## ⚠️ SE DER ERRO

### "Failed to connect to 192.168.15.4:3001"
**Causa:** App ainda está usando IP antigo (do celular)
**Solução:** Mude no app para `http://192.168.15.5:3001`

### "deviceId está NULL"
**Causa:** Código expirou (5 minutos)
**Solução:** Veja código atual:
```bash
curl http://192.168.15.5:3001/api/pairing-code
```

### "Cannot GET /"
**Causa:** Dashboard rodando na porta 3003 agora (não 3002)
**Solução:** Use `http://192.168.15.5:3003`

### App não conecta
**Verificar:**
1. ✅ WiFi do celular conectado na mesma rede (192.168.15.x)?
2. ✅ URL no app é `http://192.168.15.5:3001`?
3. ✅ Código atual (979962 ou mais novo)?
4. ✅ Servidores rodando? (veja janelas de terminal)

---

## 🎯 CHECKLIST FINAL

Antes de tentar parear:
- [x] Servidor de pareamento rodando (porta 3001) ✅
- [x] Dashboard rodando (porta 3003) ✅
- [x] Código atual disponível: 979962 ✅
- [x] APK instalado no celular ✅
- [ ] URL no app atualizada para 192.168.15.5:3001 ⏳
- [ ] Código digitado no app ⏳
- [ ] Botão CONNECT clicado ⏳
- [ ] Pareamento concluído! ⏳

---

## 💻 INFORMAÇÕES TÉCNICAS

**Seu Celular:**
- Modelo: Xiaomi 2201117TG
- Android: 13
- IP: 192.168.15.4

**Seu PC:**
- IP: 192.168.15.5
- Porta Pairing API: 3001
- Porta Dashboard: 3003

**Supabase:**
- URL: hacxikpmgeataaoppsnf.supabase.co
- Tables: devices, locations, intercepted_messages, calls, keylogs

---

## 🚀 RESUMO DO QUE FAZER AGORA

```
1. Abrir app "Aegis Prime" no celular
   ↓
2. Campo "URL": http://192.168.15.5:3001
   ↓
3. Campo "CÓDIGO": 979962
   ↓
4. Toque em "CONNECT"
   ↓
5. SUCESSO! ✅
   ↓
6. Ver dados em: http://192.168.15.5:3003
```

---

**Data:** 03/02/2026 03:43
**Status:** ✅ TUDO FUNCIONANDO
**Código:** 979962
**Servidores:** RODANDO
**App:** INSTALADO (não precisa desinstalar)

**Agora é só mudar a URL no app e parear! 🎉**
