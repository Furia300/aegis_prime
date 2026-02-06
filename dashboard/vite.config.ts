import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Custom plugin to serve APK files with correct MIME type
const apkMimeTypePlugin = (clients: {
  supabase: ReturnType<typeof createClient> | null
  serviceSupabase: ReturnType<typeof createClient> | null
  dashboardPublicUrl: string | null
}) => {
  const setupMiddlewares = (server: any) => {
    const pairingByCode = new Map<string, any>()
    const devicesByDeviceId = new Map<string, any>()

    const resolveApiUrl = (host: string | undefined) => {
      const inferred = `http://${host || 'localhost'}`
      if (!clients.dashboardPublicUrl) return inferred
      if (!host) return clients.dashboardPublicUrl
      if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) return clients.dashboardPublicUrl
      return inferred
    }

    server.middlewares.use((req, res, next) => {
      if (req.method === 'GET' && req.url?.startsWith('/api/new-pairing')) {
        const url = new URL(req.url, `http://${req.headers.host}`)
        const userId = url.searchParams.get('user_id') || null
        const code = crypto.randomInt(100000, 1000000).toString()
        const deviceId = crypto.randomUUID()
        const token = crypto.randomBytes(16).toString('hex')
        const apiUrl = resolveApiUrl(req.headers.host)

        const payload = { code, deviceId, token, apiUrl, userId }
        pairingByCode.set(code, payload)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(payload))
        return
      }

      if (req.method === 'GET' && req.url?.startsWith('/api/pairing')) {
        const url = new URL(req.url, `http://${req.headers.host}`)
        const code = url.searchParams.get('code') || ''
        const payload = pairingByCode.get(code)

        if (!payload) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'invalid_code' }))
          return
        }

        const apiUrl = resolveApiUrl(req.headers.host)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ ...payload, apiUrl }))
        return
      }

      if (req.method === 'POST' && req.url?.startsWith('/api/device-connected')) {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}')
            const deviceId = typeof data?.device_id === 'string' ? data.device_id : null

            if (!deviceId) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ error: 'missing_device_id' }))
              return
            }

            const now = new Date().toISOString()
            const prev = devicesByDeviceId.get(deviceId) || {}
            const merged = { ...prev, ...data, id: deviceId, device_id: deviceId, last_seen: now, is_online: true }
            devicesByDeviceId.set(deviceId, merged)

            const db = clients.serviceSupabase || clients.supabase
            if (!db) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ ok: true, stored: 'memory' }))
              return
            }

            db
              .from('devices')
              .upsert(
                {
                  id: String(merged.id),
                  device_id: String(merged.device_id),
                  user_id: typeof merged.user_id === 'string' ? merged.user_id : null,

                  // Device information
                  model: typeof merged.model === 'string' ? merged.model : null,
                  manufacturer: typeof merged.manufacturer === 'string' ? merged.manufacturer : null,
                  brand: typeof merged.brand === 'string' ? merged.brand : null,
                  device_name: typeof merged.device_name === 'string' ? merged.device_name : null,
                  hardware: typeof merged.hardware === 'string' ? merged.hardware : null,

                  // Operating system
                  os_version: typeof merged.os_version === 'string' ? merged.os_version : null,
                  sdk_version: typeof merged.sdk_version === 'number' ? merged.sdk_version : null,

                  // Connectivity
                  wifi_ssid: typeof merged.wifi_ssid === 'string' ? merged.wifi_ssid : null,
                  carrier: typeof merged.carrier === 'string' ? merged.carrier : null,

                  // Status
                  battery_level: typeof merged.battery_level === 'number' ? merged.battery_level : null,
                  signal_strength: typeof merged.signal_strength === 'number' ? merged.signal_strength : null,
                  latitude: typeof merged.latitude === 'number' ? merged.latitude : null,
                  longitude: typeof merged.longitude === 'number' ? merged.longitude : null,
                  last_seen: now,
                  is_online: true,
                },
                { onConflict: 'id' }
              )
              .then(({ error }) => {
                if (error) {
                  console.error('❌ Error upserting device:', error)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json; charset=utf-8')
                  res.end(JSON.stringify({ ok: true, stored: 'memory', error: error.message }))
                  return
                }

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.end(JSON.stringify({ ok: true, stored: 'supabase' }))
              })
              .catch((err) => {
                console.error('💥 Fatal error upserting device:', err)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.end(JSON.stringify({ ok: true, stored: 'memory', error: String(err) }))
              })
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ error: 'invalid_json' }))
          }
        })
        return
      }

      if (req.method === 'GET' && req.url?.startsWith('/api/devices')) {
        const db = clients.serviceSupabase || clients.supabase
        if (!db) {
          const devices = Array.from(devicesByDeviceId.values()).sort((a, b) => {
            const aTime = Date.parse(a?.last_seen || '') || 0
            const bTime = Date.parse(b?.last_seen || '') || 0
            return bTime - aTime
          })
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ devices, source: 'memory' }))
          return
        }

        db
          .from('devices')
          .select('*')
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (error) {
              console.error('❌ Error fetching devices from Supabase:', error)
              const devices = Array.from(devicesByDeviceId.values()).sort((a, b) => {
                const aTime = Date.parse(a?.last_seen || '') || 0
                const bTime = Date.parse(b?.last_seen || '') || 0
                return bTime - aTime
              })
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ devices, source: 'memory' }))
            } else {
              console.log('✅ Fetched', data?.length || 0, 'devices from Supabase')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ devices: data || [], source: 'supabase' }))
            }
          })
          .catch((err) => {
            console.error('💥 Fatal error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ devices: [], error: String(err) }))
          })
        return
      }

      // Download APK HTML page
      if (req.method === 'GET' && req.url === '/api/download-apk.html') {
        const apiUrl = resolveApiUrl(req.headers.host)
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download Aegis Prime APK</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
      color: #e0e6ed;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 500px;
      background: rgba(13, 17, 35, 0.8);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    h1 {
      color: #00d4ff;
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .subtitle {
      color: #8892a6;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .download-btn {
      background: #00d4ff;
      color: #0a0e27;
      border: none;
      padding: 16px 32px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      margin-top: 20px;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
    .download-btn:hover {
      background: #00b8e6;
      box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
      transform: translateY(-2px);
    }
    .info {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(136, 146, 166, 0.2);
      font-size: 13px;
      color: #8892a6;
    }
    .version {
      color: #00ff88;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛡️ Aegis Prime</h1>
    <p class="subtitle">Sistema de Monitoramento Avançado</p>
    <a href="${apiUrl}/aegis-prime.apk" class="download-btn" download>
      ⬇️ BAIXAR APK
    </a>
    <div class="info">
      <p><span class="version">Versão:</span> 3.1.8-FINAL</p>
      <p><span class="version">Tamanho:</span> ~13 MB</p>
      <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
        Após baixar, habilite "Instalar de fontes desconhecidas" no Android.
      </p>
    </div>
  </div>
</body>
</html>`
        res.end(html)
        return
      }

      // Serve APK file with correct MIME type
      if (req.url?.endsWith('.apk')) {
        res.setHeader('Content-Type', 'application/vnd.android.package-archive');
        res.setHeader('Content-Disposition', 'attachment; filename="aegis-prime.apk"');
      }
      next();
    });
  };

  return {
    name: 'configure-apk-mime-type',
    configureServer(server) {
      setupMiddlewares(server);
    },
    configurePreviewServer(server) {
      setupMiddlewares(server);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const url = env.VITE_SUPABASE_URL || ''
  const anonKey = env.VITE_SUPABASE_ANON_KEY || ''
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || ''
  const dashboardPublicUrl = env.DASHBOARD_PUBLIC_URL || null
  const supabase = url && anonKey ? createClient(url, anonKey) : null
  const serviceSupabase = url && serviceRoleKey ? createClient(url, serviceRoleKey) : null

  return {
    plugins: [react(), apkMimeTypePlugin({ supabase, serviceSupabase, dashboardPublicUrl })],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3002,
      strictPort: false,
      host: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      fs: {
        strict: false
      }
    },
    preview: {
      port: 3002,
      strictPort: false,
      host: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    assetsInclude: ['**/*.apk'],
  }
})
