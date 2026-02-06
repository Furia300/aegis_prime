const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Código de pareamento atual
let currentPairingCode = generatePairingCode();
console.log(`\n🔑 Código de pareamento inicial: ${currentPairingCode}\n`);

// Regenerar código a cada 5 minutos
setInterval(() => {
    currentPairingCode = generatePairingCode();
    console.log(`\n🔄 Novo código de pareamento: ${currentPairingCode}\n`);
}, 5 * 60 * 1000);

function generatePairingCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateDeviceId() {
    return crypto.randomUUID();
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// API: Obter código de pareamento atual
app.get('/api/pairing-code', (req, res) => {
    console.log('GET /api/pairing-code');
    res.json({ code: currentPairingCode });
});

// API: Parear dispositivo
app.get('/api/pairing', (req, res) => {
    const { code } = req.query;

    console.log(`\n═══ TENTATIVA DE PAREAMENTO ═══`);
    console.log(`Código recebido: ${code}`);
    console.log(`Código esperado: ${currentPairingCode}`);

    if (code !== currentPairingCode) {
        console.log(`❌ CÓDIGO INVÁLIDO`);
        return res.status(401).json({
            success: false,
            message: 'Código de pareamento inválido'
        });
    }

    const deviceId = generateDeviceId();
    const token = generateToken();
    const apiUrl = 'http://192.168.15.5:3001';

    console.log(`✅ PAREAMENTO APROVADO`);
    console.log(`Device ID: ${deviceId}`);
    console.log(`Token: ${token.substring(0, 16)}...`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`═══════════════════════════════\n`);

    res.json({
        success: true,
        deviceId: deviceId,
        token: token,
        apiUrl: apiUrl,
        userId: null
    });
});

// API: Notificação de dispositivo conectado
app.post('/api/device-connected', (req, res) => {
    const deviceInfo = req.body;
    console.log(`\n📱 DISPOSITIVO CONECTADO:`);
    console.log(JSON.stringify(deviceInfo, null, 2));
    console.log('');

    res.json({ success: true });
});

// API: Receber dados do dispositivo
app.post('/api/device-data', (req, res) => {
    const data = req.body;
    console.log(`\n📊 DADOS RECEBIDOS (${data.dataType}):`);
    console.log(JSON.stringify(data, null, 2));
    console.log('');

    res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         🛡️  AEGIS PRIME - PAIRING SERVER v1.0              ║
╚══════════════════════════════════════════════════════════════╝

✅ Servidor: http://192.168.15.5:${PORT}
✅ API Pareamento: http://192.168.15.5:${PORT}/api/pairing
✅ Código atual: ${currentPairingCode}
✅ Supabase: hacxikpmgeataaoppsnf.supabase.co

═══════════════════════════════════════════════════════════════

Digite o código no app: ${currentPairingCode}

Pressione Ctrl+C para parar
    `);
});
