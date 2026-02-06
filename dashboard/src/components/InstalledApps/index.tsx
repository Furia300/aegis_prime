import React, { useState, useEffect } from 'react';
import { AppWindow, Shield, AlertTriangle, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const InstalledApps = () => {
  const [apps, setApps] = useState<Array<{ id: string; name: string; version: string; installDate: string; size: string; type: string; risk?: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();

    const channel = supabase
      .channel('apps-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'installed_apps'
      }, () => {
        fetchApps();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchApps = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('installed_apps')
      .select('*')
      .order('installed_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching installed apps:', error);
      setApps([]);
    } else {
      console.log('✅ Fetched', data?.length || 0, 'installed apps');
      const formatted = (data || []).map(app => ({
        id: app.id,
        name: app.app_name,
        version: app.version || 'N/A',
        installDate: app.installed_at ? new Date(app.installed_at).toLocaleDateString('pt-BR') : 'N/A',
        size: 'N/A', // Não temos esse campo no banco
        type: app.package_name?.split('.')[0] || 'app',
        risk: false // Podemos adicionar lógica de detecção futuramente
      }));
      setApps(formatted);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <AppWindow className="animate-pulse" />
            APPS INSTALADOS
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Inventário de aplicativos e detecção de riscos
          </p>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color overflow-hidden flex-1">
        <div className="grid grid-cols-12 gap-4 p-4 bg-bg-tertiary border-b border-border-color text-xs font-bold text-text-secondary uppercase tracking-wider">
           <div className="col-span-4">Aplicativo</div>
           <div className="col-span-2">Versão</div>
           <div className="col-span-2">Instalado em</div>
           <div className="col-span-2">Package</div>
           <div className="col-span-2 text-right">Status</div>
         </div>

         <div className="overflow-y-auto custom-scrollbar h-full">
           {loading ? (
             <div className="p-6 text-sm text-text-secondary font-mono animate-pulse">
               ⏳ Carregando dados...
             </div>
           ) : apps.length === 0 ? (
             <div className="p-6 text-sm text-text-secondary font-mono">
               Sem dados recebidos.
             </div>
           ) : apps.map(app => (
             <div key={app.id} className={`grid grid-cols-12 gap-4 p-4 border-b border-border-color hover:bg-bg-tertiary/30 transition-colors items-center text-sm ${app.risk ? 'bg-accent-red/5' : ''}`}>
               <div className="col-span-4 flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-bg-tertiary border border-border-color flex items-center justify-center">
                   <AppWindow size={16} className={app.risk ? 'text-accent-red' : 'text-text-secondary'} />
                 </div>
                 <div>
                   <p className="font-bold text-text-primary">{app.name}</p>
                   <p className="text-[10px] text-text-muted uppercase">{app.type}</p>
                 </div>
               </div>
               <div className="col-span-2 text-text-secondary font-mono">{app.version}</div>
               <div className="col-span-2 text-text-secondary font-mono flex items-center gap-1">
                 <Calendar size={12} />
                 {app.installDate}
               </div>
               <div className="col-span-2 text-text-secondary font-mono text-xs truncate">{app.type}</div>
               <div className="col-span-2 text-right">
                 {app.risk ? (
                   <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-red border border-accent-red px-2 py-0.5 rounded bg-accent-red/10">
                     <AlertTriangle size={10} />
                     SUSPEITO
                   </span>
                 ) : (
                   <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-green border border-accent-green px-2 py-0.5 rounded bg-accent-green/10">
                     <Shield size={10} />
                     SEGURO
                   </span>
                 )}
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default InstalledApps;
