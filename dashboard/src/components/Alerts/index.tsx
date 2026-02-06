import React, { useEffect, useMemo, useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTime = useMemo(() => {
    return (ts: string) => {
      const d = new Date(ts);
      if (Number.isNaN(d.getTime())) return ts;
      return d.toLocaleString();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (cancelled) return;
      if (error) {
        setAlerts([]);
      } else {
        setAlerts(data || []);
      }
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-red flex items-center gap-2">
            <Bell className="animate-pulse" />
            ALERTAS DO SISTEMA
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Notificações de segurança e eventos críticos
          </p>
        </div>
        <button className="px-4 py-2 bg-bg-tertiary border border-border-color rounded hover:bg-bg-secondary transition-colors text-xs font-bold font-tactical text-text-secondary">
          MARCAR TODOS COMO LIDOS
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
        {loading ? (
          <div className="p-6 text-sm text-text-secondary font-mono">
            Carregando...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-6 text-sm text-text-secondary font-mono">
            Sem dados recebidos.
          </div>
        ) : alerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded border-l-4 ${
            alert.severity === 'critical' ? 'bg-red-900/10 border-l-red-500 border-y border-r border-border-color' :
            alert.severity === 'high' ? 'bg-orange-900/10 border-l-orange-500 border-y border-r border-border-color' :
            alert.severity === 'medium' ? 'bg-yellow-900/10 border-l-yellow-500 border-y border-r border-border-color' :
            'bg-bg-tertiary border-l-blue-500 border-y border-r border-border-color'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`p-2 rounded-full h-fit ${
                  alert.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                  alert.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {alert.severity === 'critical' || alert.severity === 'high' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${
                     alert.severity === 'critical' ? 'text-red-500' :
                     alert.severity === 'high' ? 'text-orange-500' :
                     alert.severity === 'medium' ? 'text-yellow-500' :
                     'text-blue-500'
                  }`}>
                    {alert.alert_title}
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">{alert.alert_message}</p>
                  <p className="text-text-muted text-xs mt-2 font-mono">{formatTime(alert.timestamp)}</p>
                </div>
              </div>
              
              {!alert.is_acknowledged && (
                <button className="text-accent-blue hover:text-white transition-colors" title="Marcar como lido">
                  <CheckCircle size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
