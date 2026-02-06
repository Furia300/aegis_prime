-- ========================================
-- AEGIS PRIME - ADICIONAR COLUNAS NO SUPABASE
-- ========================================
--
-- INSTRUÇÕES:
-- 1. Abra: https://hacxikpmgeataaoppsnf.supabase.co/project/hacxikpmgeataaoppsnf/sql/new
-- 2. Cole ESTE SQL COMPLETO no editor
-- 3. Clique em RUN (ou Ctrl+Enter)
-- 4. Verifique se não há erros
--
-- ========================================

-- Adicionar 9 colunas faltantes na tabela devices
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

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_devices_manufacturer ON public.devices(manufacturer);
CREATE INDEX IF NOT EXISTS idx_devices_brand ON public.devices(brand);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON public.devices(user_id);

-- Verificar se as colunas foram criadas com sucesso
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'devices'
ORDER BY ordinal_position;

-- ========================================
-- RESULTADO ESPERADO:
-- Você deve ver uma lista com TODAS as colunas incluindo:
-- - manufacturer (TEXT)
-- - brand (TEXT)
-- - device_name (TEXT)
-- - hardware (TEXT)
-- - os_version (TEXT)
-- - sdk_version (INTEGER)
-- - wifi_ssid (TEXT)
-- - carrier (TEXT)
-- - user_id (TEXT)
-- ========================================
