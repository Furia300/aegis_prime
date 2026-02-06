import React, { useState, useEffect } from 'react';
import { Clock, Smartphone, Bell, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DetailedMetricsProps {
  deviceId: string;
}

interface AppUsage {
  app_name: string;
  app_package: string;
  usage_time_minutes: number;
  launch_count: number;
  last_used_at: string;
}

interface TimelineActivity {
  activity_type: string;
  activity_title: string;
  activity_description: string;
  timestamp: string;
}

interface Notification {
  app_name: string;
  title: string;
  content: string;
  timestamp: string;
}

export const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ deviceId }) => {
  const [appsUsage, setAppsUsage] = useState<AppUsage[]>([]);
  const [timeline, setTimeline] = useState<TimelineActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;

    fetchMetrics();

    // Realtime subscriptions
    const appsChannel = supabase
      .channel(`apps-${deviceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'apps_usage',
        filter: `device_id=eq.${deviceId}`
      }, fetchMetrics)
      .subscribe();

    const timelineChannel = supabase
      .channel(`timeline-${deviceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'timeline',
        filter: `device_id=eq.${deviceId}`
      }, fetchMetrics)
      .subscribe();

    const notifChannel = supabase
      .channel(`notif-${deviceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `device_id=eq.${deviceId}`
      }, fetchMetrics)
      .subscribe();

    return () => {
      supabase.removeChannel(appsChannel);
      supabase.removeChannel(timelineChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [deviceId]);

  const fetchMetrics = async () => {
    if (!deviceId) return;

    setLoading(true);

    // Fetch top apps
    const { data: apps } = await supabase
      .from('apps_usage')
      .select('*')
      .eq('device_id', deviceId)
      .order('last_used_at', { ascending: false })
      .limit(5);

    if (apps) setAppsUsage(apps);

    // Fetch recent timeline
    const { data: timelineData } = await supabase
      .from('timeline')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (timelineData) setTimeline(timelineData);

    // Fetch recent notifications
    const { data: notifData } = await supabase
      .from('notifications')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(5);

    if (notifData) setNotifications(notifData);

    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-xs text-text-secondary font-mono">Carregando métricas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Apps Mais Usados */}
      <div className="bg-bg-tertiary border border-border-color rounded-lg p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Smartphone size={14} className="text-accent-blue" />
          Apps Mais Usados (24h)
        </h4>
        {appsUsage.length > 0 ? (
          <div className="space-y-2">
            {appsUsage.map((app, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-bg-primary rounded hover:bg-bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-accent-blue/20 text-accent-blue' :
                    idx === 1 ? 'bg-accent-green/20 text-accent-green' :
                    'bg-text-muted/20 text-text-muted'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">{app.app_name || app.app_package}</p>
                    <p className="text-[10px] text-text-secondary">{formatTime(app.last_used_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-accent-blue">{formatDuration(app.usage_time_minutes)}</p>
                  <p className="text-[10px] text-text-secondary">{app.launch_count} aberturas</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary font-mono text-center py-4">Nenhum dado de apps ainda</p>
        )}
      </div>

      {/* Timeline de Atividades */}
      <div className="bg-bg-tertiary border border-border-color rounded-lg p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Activity size={14} className="text-accent-green" />
          Timeline Recente
        </h4>
        {timeline.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-2 p-2 bg-bg-primary rounded hover:bg-bg-secondary transition-colors">
                <div className="w-1 bg-accent-green rounded" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-text-primary">{item.activity_title}</p>
                    <span className="text-[10px] text-text-secondary">{formatTime(item.timestamp)}</span>
                  </div>
                  {item.activity_description && (
                    <p className="text-[10px] text-text-secondary">{item.activity_description}</p>
                  )}
                  <span className="text-[9px] text-accent-green uppercase font-bold">{item.activity_type}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary font-mono text-center py-4">Nenhuma atividade registrada ainda</p>
        )}
      </div>

      {/* Notificações Recentes */}
      <div className="bg-bg-tertiary border border-border-color rounded-lg p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Bell size={14} className="text-accent-yellow" />
          Notificações Recentes
        </h4>
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notif, idx) => (
              <div key={idx} className="flex gap-2 p-2 bg-bg-primary rounded hover:bg-bg-secondary transition-colors border-l-2 border-accent-yellow">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-text-primary">{notif.app_name}</p>
                    <span className="text-[10px] text-text-secondary">{formatTime(notif.timestamp)}</span>
                  </div>
                  {notif.title && (
                    <p className="text-[11px] text-accent-yellow font-bold mb-1">{notif.title}</p>
                  )}
                  {notif.content && (
                    <p className="text-[10px] text-text-secondary line-clamp-2">{notif.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-secondary font-mono text-center py-4">Nenhuma notificação ainda</p>
        )}
      </div>

    </div>
  );
};

export default DetailedMetrics;
