-- CORREÇÃO: A coluna "paired_at" não existe
-- Usar "created_at" em vez de "paired_at"

-- 1. Ver todos os dispositivos (corrigido)
SELECT
    device_id,
    model,
    os_version,
    is_online,
    last_seen,
    created_at  -- ✅ CORRIGIDO: usar created_at em vez de paired_at
FROM public.devices
ORDER BY created_at DESC;

-- 2. Deletar dados mock (manter só o seu dispositivo)
DELETE FROM public.devices
WHERE device_id != 'ed78d115-6437-455a-8ffc-1c20dcec6ff0';

-- 3. Atualizar seu dispositivo para online
UPDATE public.devices
SET
    is_online = true,
    last_seen = NOW()
WHERE device_id = 'ed78d115-6437-455a-8ffc-1c20dcec6ff0';

-- 4. Verificar resultado final
SELECT * FROM public.devices;

-- 5. [OPCIONAL] Adicionar coluna paired_at se quiser usá-la no futuro
ALTER TABLE public.devices
ADD COLUMN IF NOT EXISTS paired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 6. [OPCIONAL] Atualizar paired_at com o valor de created_at para registros existentes
UPDATE public.devices
SET paired_at = created_at
WHERE paired_at IS NULL;
