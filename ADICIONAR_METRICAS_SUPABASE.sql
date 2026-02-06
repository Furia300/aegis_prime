-- ========================================
-- AEGIS PRIME - MÉTRICAS DETALHADAS
-- ========================================
--
-- Execute este SQL no Supabase para adicionar:
-- 1. Apps Usage (apps usados recentemente)
-- 2. Timeline (atividades por hora)
-- 3. Notifications (notificações recebidas)
-- 4. Screen Time (tempo de tela por app)
--
-- ========================================

-- 1. APPS USAGE - Rastreia apps usados
CREATE TABLE IF NOT EXISTS public.apps_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    app_package TEXT NOT NULL,
    app_name TEXT,
    usage_time_minutes INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    launch_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(device_id, app_package)
);

CREATE INDEX IF NOT EXISTS idx_apps_usage_device_id ON public.apps_usage(device_id);
CREATE INDEX IF NOT EXISTS idx_apps_usage_last_used ON public.apps_usage(last_used_at DESC);

-- 2. TIMELINE - Atividades cronológicas
CREATE TABLE IF NOT EXISTS public.timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'app_opened', 'call_made', 'sms_sent', 'website_visited', etc
    activity_title TEXT NOT NULL,
    activity_description TEXT,
    activity_metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timeline_device_id ON public.timeline(device_id);
CREATE INDEX IF NOT EXISTS idx_timeline_timestamp ON public.timeline(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_type ON public.timeline(activity_type);

-- 3. NOTIFICATIONS - Notificações recebidas
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    app_package TEXT NOT NULL,
    app_name TEXT,
    title TEXT,
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_device_id ON public.notifications(device_id);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON public.notifications(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(is_read) WHERE is_read = false;

-- 4. SCREEN TIME - Tempo de uso por app
CREATE TABLE IF NOT EXISTS public.screen_time (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    app_package TEXT NOT NULL,
    app_name TEXT,
    total_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(device_id, date, app_package)
);

CREATE INDEX IF NOT EXISTS idx_screen_time_device_id ON public.idx_screen_time_device_id(device_id);
CREATE INDEX IF NOT EXISTS idx_screen_time_date ON public.screen_time(date DESC);

-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('apps_usage', 'timeline', 'notifications', 'screen_time')
ORDER BY table_name;

-- ========================================
-- RESULTADO ESPERADO:
-- Você deve ver 4 tabelas listadas:
-- - apps_usage
-- - notifications
-- - screen_time
-- - timeline
-- ========================================
