// API Route: /api/devices
// Returns all connected devices from Supabase

import { supabase } from '../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching devices:', error);
      return Response.json({ devices: [], error: error.message }, { status: 500 });
    }

    return Response.json({ devices: data || [] });
  } catch (err) {
    console.error('Fatal error:', err);
    return Response.json({ devices: [], error: String(err) }, { status: 500 });
  }
}
