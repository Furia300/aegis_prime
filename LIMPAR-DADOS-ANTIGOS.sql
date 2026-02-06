-- LIMPAR DADOS MOCK/ANTIGOS DO SUPABASE
-- Execute no SQL Editor do Supabase

-- 1. Ver dispositivos atuais
SELECT
    device_id,
    model,
    os_version,
    is_online,
    last_seen,
    paired_at
FROM public.devices
ORDER BY paired_at DESC;

-- 2. Manter APENAS o dispositivo que acabou de parear
-- Device ID: ed78d115-6437-455a-8ffc-1c20dcec6ff0
-- Model: 2201117TG

-- 3. DELETAR todos os outros (dados mock)
DELETE FROM public.devices
WHERE device_id != 'ed78d115-6437-455a-8ffc-1c20dcec6ff0';

-- 4. Verificar se ficou só o correto
SELECT * FROM public.devices;

-- 5. Atualizar status do dispositivo correto para online
UPDATE public.devices
SET
    is_online = true,
    last_seen = NOW()
WHERE device_id = 'ed78d115-6437-455a-8ffc-1c20dcec6ff0';
