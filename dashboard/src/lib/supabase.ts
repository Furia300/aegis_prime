import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Device = {
  id: string
  device_id: string

  // Device information
  model: string
  manufacturer: string
  brand: string
  device_name: string
  hardware: string

  // Operating system
  os_version: string
  sdk_version: number

  // Connectivity
  wifi_ssid: string
  carrier: string

  // Status
  battery_level: number
  signal_strength: number
  is_online: boolean
  last_seen: string

  // GPS
  latitude?: number
  longitude?: number

  // User
  user_id?: string

  // Metadata
  created_at?: string
}

export type Alert = {
  id: string
  device_id: string
  type: 'geofence' | 'biometric_anomaly' | 'sim_swap' | 'panic_button'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  created_at: string
}
