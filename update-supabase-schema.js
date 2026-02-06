// Script para adicionar colunas faltantes na tabela devices do Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hacxikpmgeataaoppsnf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhY3hpa3BtZ2VhdGFhb3Bwc25mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg2NzQ3MSwiZXhwIjoyMDg1NDQzNDcxfQ.u8n4Fb14Gd5_CtiOj154KZniD70Pq92CLcqoZA00F-U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSchema() {
  console.log('🔧 Iniciando atualização do schema...\n');

  // SQL para adicionar as colunas
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
    // Tentar usar RPC se disponível
    const { data, error } = await supabase.rpc('exec', { query: sql });

    if (error) {
      console.error('❌ Erro ao executar SQL via RPC:', error.message);
      console.log('\n⚠️  A API REST não suporta ALTER TABLE diretamente.');
      console.log('📋 Execute este SQL manualmente no Supabase SQL Editor:\n');
      console.log('https://hacxikpmgeataaoppsnf.supabase.co/project/hacxikpmgeataaoppsnf/sql/new\n');
      console.log(sql);
    } else {
      console.log('✅ Schema atualizado com sucesso!');
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.log('\n📋 Execute este SQL manualmente no Supabase SQL Editor:\n');
    console.log('https://hacxikpmgeataaoppsnf.supabase.co/project/hacxikpmgeataaoppsnf/sql/new\n');
    console.log(sql);
  }

  // Verificar dispositivos atuais
  console.log('\n📱 Verificando dispositivos existentes...');
  const { data: devices, error: devError } = await supabase
    .from('devices')
    .select('*')
    .limit(5);

  if (devError) {
    console.error('❌ Erro ao buscar dispositivos:', devError.message);
  } else {
    console.log(`\n✅ Encontrados ${devices.length} dispositivo(s):`);
    devices.forEach(dev => {
      console.log(`   - ID: ${dev.device_id}`);
      console.log(`     Model: ${dev.model || 'N/A'}`);
      console.log(`     Manufacturer: ${dev.manufacturer || 'N/A'}`);
      console.log(`     Brand: ${dev.brand || 'N/A'}`);
      console.log(`     OS: ${dev.os_version || 'N/A'}`);
      console.log('');
    });
  }
}

updateSchema();
