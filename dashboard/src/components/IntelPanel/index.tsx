import React, { useState, useEffect } from 'react';
import { AlertTriangle, Globe, Phone, Battery, Signal, Wifi, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '../../lib/supabase';
import DetailedMetrics from '../DetailedMetrics';

const IntelPanel: React.FC<{ selectedDevice: any }> = ({ selectedDevice }) => {
  const [websiteData, setWebsiteData] = useState<any[]>([]);
  const [topContacts, setTopContacts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDevice?.device_id) {
      setLoading(false);
      return;
    }

    fetchIntelData();

    // Realtime subscription for updates
    const channel = supabase
      .channel(`intel-${selectedDevice.device_id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'browser_history',
        filter: `device_id=eq.${selectedDevice.device_id}`
      }, () => fetchIntelData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'calls',
        filter: `device_id=eq.${selectedDevice.device_id}`
      }, () => fetchIntelData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts',
        filter: `device_id=eq.${selectedDevice.device_id}`
      }, () => fetchIntelData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDevice]);

  const fetchIntelData = async () => {
    if (!selectedDevice?.device_id) return;

    setLoading(true);
    const deviceId = selectedDevice.device_id;

    // Fetch top websites
    const { data: websites } = await supabase
      .from('browser_history')
      .select('url, title, visit_count')
      .eq('device_id', deviceId)
      .order('visit_count', { ascending: false })
      .limit(4);

    if (websites && websites.length > 0) {
      setWebsiteData(websites.map(w => ({
        name: w.title || new URL(w.url).hostname,
        visits: w.visit_count
      })));
    }

    // Fetch top contacts (aggregate by contact_name)
    const { data: calls } = await supabase
      .from('calls')
      .select('contact_name, contact_number')
      .eq('device_id', deviceId)
      .not('contact_name', 'is', null);

    if (calls && calls.length > 0) {
      // Count occurrences
      const contactCounts: Record<string, number> = {};
      calls.forEach(call => {
        const name = call.contact_name;
        contactCounts[name] = (contactCounts[name] || 0) + 1;
      });

      const sorted = Object.entries(contactCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setTopContacts(sorted);
    }

    // Fetch alerts
    const { data: alertsData } = await supabase
      .from('alerts')
      .select('*')
      .eq('device_id', deviceId)
      .eq('is_acknowledged', false)
      .order('timestamp', { ascending: false })
      .limit(5);

    if (alertsData) {
      setAlerts(alertsData);
    }

    setLoading(false);
  };
  if (!selectedDevice) {
    return (
      <div className="h-full flex flex-col bg-bg-secondary overflow-y-auto custom-scrollbar border-l border-border-color">
        <div className="p-4 border-b border-border-color">
          <h3 className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-widest flex items-center gap-2 font-tactical">
            <Signal size={14} /> Device Telemetry
          </h3>
          <div className="bg-bg-tertiary p-4 rounded border border-border-color shadow-lg">
            <div className="text-xs font-mono text-text-secondary">
              Nenhum dispositivo conectado.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const device = selectedDevice;

  return (
    <div className="h-full flex flex-col bg-bg-secondary overflow-y-auto custom-scrollbar border-l border-border-color">
        {/* Section 1: Telemetry */}
        <div className="p-4 border-b border-border-color">
            <h3 className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-widest flex items-center gap-2 font-tactical">
                <Signal size={14} /> Device Telemetry
            </h3>
            
            <div className="bg-bg-tertiary p-4 rounded border border-border-color mb-4 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-text-primary font-tactical tracking-wide">
                          {device.manufacturer} {device.brand} {device.model}
                        </h2>
                        <span className="text-xs text-text-secondary font-mono">
                          {device.os_version} {device.sdk_version ? `(SDK ${device.sdk_version})` : ''}
                        </span>
                    </div>
                    {device.is_online ? (
                        <span className="text-[10px] font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded border border-accent-green/20 animate-pulse">ACTIVE</span>
                    ) : (
                        <span className="text-[10px] font-bold text-text-muted bg-bg-primary px-2 py-1 rounded border border-border-color">OFFLINE</span>
                    )}
                </div>

                {device.hardware && (
                  <div className="mb-3 text-xs text-text-secondary">
                    <span className="font-bold">Hardware:</span> <span className="font-mono">{device.hardware}</span>
                  </div>
                )}

                <div className="space-y-4">
                    <TelemetryBar label="Battery" value={device.battery_level} icon={<Battery size={14} />} color={device.battery_level < 20 ? "bg-accent-red" : "bg-accent-green"} />
                    <TelemetryBar label="Signal" value={device.signal_strength} icon={<Signal size={14} />} color="bg-accent-blue" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-bg-primary p-2 rounded border border-border-color flex items-center gap-2">
                        <Wifi size={14} className="text-accent-blue" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-text-muted uppercase font-bold">Network (WiFi)</span>
                            <span className="text-xs font-mono text-accent-blue">{device.wifi_ssid || 'Not connected'}</span>
                        </div>
                    </div>
                    <div className="bg-bg-primary p-2 rounded border border-border-color flex items-center gap-2">
                        <Lock size={14} className="text-accent-green" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-text-muted uppercase font-bold">Carrier</span>
                            <span className="text-xs font-mono text-accent-green">{device.carrier || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 2: Alerts */}
        <div className="p-4 border-b border-border-color">
            <h3 className="text-xs font-bold text-accent-red mb-3 uppercase tracking-widest flex items-center gap-2 font-tactical">
                <AlertTriangle size={14} /> Critical Alerts ({alerts.length})
            </h3>
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div key={alert.id} className={`bg-accent-${alert.severity === 'critical' ? 'red' : 'yellow'}/10 border border-accent-${alert.severity === 'critical' ? 'red' : 'yellow'}/30 p-3 rounded backdrop-blur-sm mb-2`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-bold text-accent-${alert.severity === 'critical' ? 'red' : 'yellow'} font-mono`}>{alert.alert_title}</span>
                    <span className={`text-accent-${alert.severity === 'critical' ? 'red' : 'yellow'}/70 font-mono`}>
                      {new Date(alert.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-text-primary font-mono mb-2">{alert.alert_message}</p>
                  <div className="flex gap-2">
                    <button
                      className={`text-[10px] bg-accent-${alert.severity === 'critical' ? 'red' : 'yellow'} text-bg-primary px-2 py-1 rounded font-bold hover:opacity-80 transition-colors uppercase tracking-wider`}
                      onClick={async () => {
                        await supabase.from('alerts').update({ is_acknowledged: true }).eq('id', alert.id);
                        fetchIntelData();
                      }}
                    >
                      Acknowledge
                    </button>
                    <button className={`text-[10px] border border-accent-${alert.severity === 'critical' ? 'red' : 'yellow'} text-accent-${alert.severity === 'critical' ? 'red' : 'yellow'} px-2 py-1 rounded hover:bg-accent-${alert.severity === 'critical' ? 'red' : 'yellow'}/10 transition-colors uppercase tracking-wider`}>
                      Locate
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-bg-tertiary border border-border-color p-3 rounded">
                <p className="text-xs text-text-secondary font-mono">Nenhum alerta ativo no momento.</p>
              </div>
            )}
        </div>

        {/* Section 3: Detailed Metrics */}
        <div className="p-4 border-b border-border-color">
            <DetailedMetrics deviceId={device.device_id} />
        </div>

        {/* Section 4: Intel */}
        <div className="p-4 flex-1">
             <h3 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-widest flex items-center gap-2 font-tactical">
                <Globe size={14} /> Top Visited Websites (24h)
            </h3>
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <span className="text-xs text-text-secondary font-mono">Carregando...</span>
              </div>
            ) : websiteData.length > 0 ? (
              <div className="h-40 w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={websiteData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={70} tick={{fill: '#8892a6', fontSize: 10, fontFamily: 'Roboto Mono'}} />
                          <Tooltip
                              contentStyle={{backgroundColor: '#1a1f2e', borderColor: '#2d3748', color: '#e0e6ed', fontSize: '12px', fontFamily: 'Roboto Mono'}}
                              itemStyle={{color: '#00d4ff'}}
                              cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          />
                          <Bar dataKey="visits" barSize={12} radius={[0, 4, 4, 0]}>
                              {websiteData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#00d4ff', '#00ff88', '#ffbb00', '#ff3366'][index % 4]} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center mb-6 bg-bg-tertiary rounded border border-border-color">
                <span className="text-xs text-text-secondary font-mono">Sem histórico de navegação ainda</span>
              </div>
            )}

            <div className="space-y-2">
                 <h3 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-widest flex items-center gap-2 font-tactical">
                    <Phone size={14} /> Top Contacts
                </h3>
                {loading ? (
                  <div className="p-4 bg-bg-tertiary rounded border border-border-color">
                    <span className="text-xs text-text-secondary font-mono">Carregando...</span>
                  </div>
                ) : topContacts.length > 0 ? (
                  topContacts.map((contact, idx) => (
                    <ContactItem key={idx} name={contact.name} count={contact.count} type="calls" />
                  ))
                ) : (
                  <div className="p-4 bg-bg-tertiary rounded border border-border-color">
                    <span className="text-xs text-text-secondary font-mono">Sem chamadas registradas ainda</span>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
};

const TelemetryBar: React.FC<{ label: string, value: number, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs text-text-secondary font-mono">
            <span className="flex items-center gap-1">{icon} {label}</span>
            <span className={value < 20 ? 'text-accent-red font-bold' : 'text-accent-green'}>{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-bg-primary rounded overflow-hidden border border-border-color/50">
            <div className={`h-full ${color} transition-all duration-500 shadow-[0_0_10px_currentColor]`} style={{ width: `${value}%` }} />
        </div>
    </div>
);

const ContactItem: React.FC<{ name: string, count: number, type: string }> = ({ name, count, type }) => (
    <div className="flex items-center justify-between p-2 bg-bg-tertiary rounded border border-border-color hover:border-accent-blue/30 transition-colors cursor-default group">
        <span className="text-xs text-text-primary font-mono group-hover:text-accent-blue transition-colors">{name}</span>
        <span className="text-xs text-text-secondary font-bold font-mono">{count} <span className="text-[10px] uppercase font-normal">{type}</span></span>
    </div>
);

export default IntelPanel;
