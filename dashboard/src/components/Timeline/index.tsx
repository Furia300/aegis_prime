import React, { useState, useEffect } from 'react';
import { Clock, Loader, Smartphone, Battery, Wifi, Lock, AppWindow, Power, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Timeline = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  useEffect(() => {
    const fetchDeviceAndEvents = async () => {
      const savedDeviceId = localStorage.getItem('selectedDeviceId');

      const { data: devices } = await supabase
        .from('devices')
        .select('*')
        .order('last_seen', { ascending: false });

      if (devices && devices.length > 0) {
        const device = savedDeviceId
          ? devices.find(d => d.id === savedDeviceId) || devices[0]
          : devices[0];
        setSelectedDevice(device);
      }
    };

    fetchDeviceAndEvents();
  }, []);

  useEffect(() => {
    if (!selectedDevice?.id) {
      setLoading(false);
      return;
    }

    fetchEvents();

    // Realtime subscription
    const channel = supabase
      .channel(`timeline-${selectedDevice.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'device_activities',
        filter: `device_id=eq.${selectedDevice.id}`
      }, (payload) => {
        setEvents(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDevice]);

  const fetchEvents = async () => {
    if (!selectedDevice?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('device_activities')
        .select('*')
        .eq('device_id', selectedDevice.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (!error && data) {
        setEvents(data);
      }
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (activityType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      app_opened: <AppWindow size={16} />,
      screen_lock: <Lock size={16} />,
      screen_unlock: <Lock size={16} />,
      battery_low: <Battery size={16} />,
      wifi_connected: <Wifi size={16} />,
      wifi_disconnected: <Wifi size={16} />,
      device_boot: <Power size={16} />,
      app_installed: <AppWindow size={16} />,
      app_uninstalled: <AppWindow size={16} />,
      alert: <AlertCircle size={16} />
    };

    return iconMap[activityType] || <Smartphone size={16} />;
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <Clock className="animate-pulse" />
            LINHA DO TEMPO
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Registro cronológico de todas as atividades do dispositivo
          </p>
        </div>
        <button
          onClick={fetchEvents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 border border-accent-blue text-accent-blue rounded hover:bg-accent-blue/30 transition-colors text-xs font-bold font-tactical disabled:opacity-50"
        >
          {loading ? <Loader size={14} className="animate-spin" /> : <Clock size={14} />}
          ATUALIZAR
        </button>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color overflow-hidden flex-1 p-6 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="text-sm text-text-secondary font-mono flex items-center justify-center gap-2 h-full">
            <Loader className="animate-spin" size={16} />
            Carregando atividades...
          </div>
        ) : events.length === 0 ? (
          <div className="text-sm text-text-secondary font-mono text-center">
            Sem eventos registrados ainda. O agente começará a registrar atividades automaticamente.
          </div>
        ) : (
          <div className="relative border-l-2 border-border-color ml-3 space-y-8">
            {events.map((event, index) => {
              const timestamp = new Date(event.timestamp);
              const time = timestamp.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={event.id} className="relative pl-8 group">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-bg-secondary flex items-center justify-center ${
                      index === 0 ? 'bg-accent-blue animate-pulse' : 'bg-bg-tertiary'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-text-muted'}`}></div>
                  </div>

                  {/* Content */}
                  <div className="bg-bg-tertiary p-4 rounded border border-border-color hover:border-accent-blue transition-colors relative">
                    <div className="absolute top-4 right-4 text-xs font-mono text-text-muted bg-bg-primary px-2 py-1 rounded border border-border-color">
                      {time}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded bg-bg-primary text-accent-blue border border-border-color">
                        {getEventIcon(event.activity_type)}
                      </div>
                      <h3 className="text-sm font-bold text-text-primary">
                        {event.activity_title || event.activity_type.replace(/_/g, ' ').toUpperCase()}
                      </h3>
                    </div>

                    <p className="text-sm text-text-secondary pl-11">
                      {event.activity_description || 'Atividade registrada pelo agente'}
                    </p>

                    {event.activity_data && Object.keys(event.activity_data).length > 0 && (
                      <div className="mt-2 pl-11">
                        <pre className="text-xs font-mono text-text-muted bg-bg-primary p-2 rounded border border-border-color overflow-x-auto">
                          {JSON.stringify(event.activity_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
