// Script para adicionar colunas faltantes na tabela devices do Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hacxikpmgeataaoppsnf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhY3hpa3BtZ2VhdGFhb3Bwc25mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg2NzQ3MSwiZXhwIjoyMDg1NDQzNDcxfQ.u8n4Fb14Gd5_CtiOj154KZniD70Pq92CLcqoZA00F-U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addColumns() {
  console.log('🔧 Adicionando colunas faltantes na tabela devices...\n');

  const sql = `
    -- Adicionar colunas faltantes
    ALTER TABLE public.devices
    ADD COLUMN IF NOT EXISTS manufacturer TEXT,
    ADD COLUMN IF NOT EXISTS brand TEXT,
    ADD COLUMN IF NOT EXISTS device_name TEXT,
    ADD COLUMN IF NOT EXISTS hardware TEXT,
    ADD COLUMN IF NOT EXISTS os_version TEXT,
    ADD COLUMN IF NOT EXISTS sdk_version INTEGER,
    ADD COLUMN IF NOT EXISTS wifi_ssid TEXT,
    ADD COLUMN IF NOT EXISTS carrier TEXT,
    ADD COLUMN IF NOT EXISTS user_id TEXT;

    -- Criar índices
    CREATE INDEX IF NOT EXISTS idx_devices_manufacturer ON public.devices(manufacturer);
    CREATE INDEX IF NOT EXISTS idx_devices_brand ON public.devices(brand);
    CREATE INDEX IF NOT EXISTS idx_devices_user_id ON public.devices(user_id);
  `;

  try {
    // Executar cada comando ALTER TABLE separadamente
    const commands = [
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS manufacturer TEXT",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS brand TEXT",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS device_name TEXT",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS hardware TEXT",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS os_version TEXT",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS sdk_version INTEGER",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS wifi_ssid TEXT",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS carrier TEXT",
      "ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS user_id TEXT",
      "CREATE INDEX IF NOT EXISTS idx_devices_manufacturer ON public.devices(manufacturer)",
      "CREATE INDEX IF NOT EXISTS idx_devices_brand ON public.devices(brand)",
      "CREATE INDEX IF NOT EXISTS idx_devices_user_id ON public.devices(user_id)"
    ];

    for (const cmd of commands) {
      const { error } = await supabase.rpc('exec', { query: cmd });
      if (error) {
        console.log(`⚠️  ${cmd.substring(0, 50)}... - ${error.message}`);
      } else {
        console.log(`✅ ${cmd.substring(0, 50)}...`);
      }
    }

    // Verificar colunas
    console.log('\n📋 Verificando colunas criadas...');
    const { data: devices, error: devError } = await supabase
      .from('devices')
      .select('*')
      .limit(1);

    if (devError) {
      console.error('❌ Erro ao verificar:', devError.message);
    } else if (devices && devices.length > 0) {
      const device = devices[0];
      console.log('\n✅ Colunas disponíveis:');
      Object.keys(device).forEach(key => {
        console.log(`   - ${key}`);
      });
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

addColumns();
