# 🚀 COMO PAREAR O CELULAR

## ❌ ERROS COMUNS

### ERRO 1: Acessar http://192.168.15.4:3002 para parear
- ❌ **ERRADO!** Porta 3002 é o dashboard (só para ver dados)
- ✅ **CERTO:** Pareie NO APP DO CELULAR

### ERRO 2: Digitar código no navegador
- ❌ **ERRADO!** Não digite código em site algum
- ✅ **CERTO:** Digite no APP instalado no celular

### ERRO 3: Usar código antigo
- ❌ **ERRADO!** Código muda a cada 5 minutos
- ✅ **CERTO:** Veja código ATUAL no terminal

---

## ✅ PASSO A PASSO CORRETO

### 1️⃣ Iniciar Servidores
```
Clique duplo em: C:\Users\felli\Desktop\aegis\INICIAR-TUDO.bat
```

Vão abrir 2 janelas:
- ✅ **"Pairing Server"** - mostra o código
- ✅ **"Dashboard"** - interface visual

### 2️⃣ Ver Código Atual
Na janela **"Pairing Server"**, procure:
```
🔑 Código de pareamento inicial: 123456
```

**ANOTE este código!**

### 3️⃣ Abrir App no Celular
- Procure **"Aegis Prime"**
- Toque para abrir
- Se já estava aberto, **FECHE e abra de novo**

### 4️⃣ Digite Código NO APP
- Campo **"CÓDIGO DE PAREAMENTO"**: digite `123456`
- Toque em **"CONNECT"**
- Aguarde mensagem de sucesso

### 5️⃣ Verificar Dashboard
Após parear, abra no navegador:
```
http://192.168.15.4:3002
```

Deve mostrar:
- ✅ Seu dispositivo online
- ✅ Localização no mapa
- ✅ Dados em tempo real

---

## 🔍 PORTAS - ENTENDA A DIFERENÇA

| Porta | O que é | Quando usar |
|-------|---------|-------------|
| **3001** | API Pareamento | O APP se conecta aqui (você não acessa) |
| **3002** | Dashboard Visual | Você acessa no NAVEGADOR DEPOIS de parear |

**RESUMO:**
- **3001:** O celular usa (invisível para você)
- **3002:** Você vê no navegador do PC

---

## ⚠️ SE DER ERRO

### "deviceId está NULL"
**Causa:** Servidor caiu
**Solução:**
1. Feche todas as janelas de terminal
2. Execute: `INICIAR-TUDO.bat`
3. Veja o código novo
4. Use no app

### "Código inválido"
**Causa:** Código expirou (muda a cada 5 min)
**Solução:**
1. Veja janela "Pairing Server" no PC
2. Procure: `"🔑 Código de pareamento: XXXXXX"`
3. Use o NOVO código no app

### App trava na tela de pareamento
**Causa:** Servidor não está rodando
**Solução:**
1. Execute: `INICIAR-TUDO.bat`
2. Aguarde 5 segundos
3. Tente parear de novo

---

## 📱 RESUMO VISUAL

```
┌─────────────────────┐
│   1. Execute        │
│ INICIAR-TUDO.bat    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Veja código no   │
│ terminal "Pairing"  │
│   Código: 123456    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  3. Abra APP no     │
│     celular         │
│  (Aegis Prime)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. Digite código    │
│     NO APP          │
│  (não no browser!)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  5. Toque CONNECT   │
│     no app          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 6. SUCESSO! ✅       │
│ Veja dashboard em:  │
│ :3002               │
└─────────────────────┘
```

---

## 🎯 CHECKLIST RÁPIDO

Antes de parear, confirme:
- [ ] `INICIAR-TUDO.bat` executado
- [ ] 2 janelas de terminal abertas
- [ ] Código anotado do terminal "Pairing Server"
- [ ] App aberto no celular
- [ ] Código digitado NO APP (não no navegador)
- [ ] Botão CONNECT clicado
- [ ] Aguardando mensagem de sucesso

---

**Boa sorte! Se seguir esses passos, vai funcionar! 🚀**
