import React, { useState, useEffect } from 'react';
import { History, Globe, ExternalLink, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const BrowserHistory = () => {
  const [items, setItems] = useState<Array<{ id: string; title: string; url: string; time: string; visits: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrowserHistory();

    const channel = supabase
      .channel('browser-history-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'browser_history'
      }, () => {
        fetchBrowserHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBrowserHistory = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('browser_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('❌ Error fetching browser history:', error);
      setItems([]);
    } else {
      console.log('✅ Fetched', data?.length || 0, 'browser history items');
      const formatted = (data || []).map(item => ({
        id: item.id,
        title: item.title || new URL(item.url).hostname,
        url: item.url,
        time: new Date(item.timestamp).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        visits: item.visit_count || 1
      }));
      setItems(formatted);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <History className="animate-pulse" />
            HISTÓRICO WEB
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Monitoramento de navegação, favoritos e pesquisas
          </p>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-bg-tertiary border-b border-border-color text-xs font-bold text-text-secondary uppercase tracking-wider">
           <div className="col-span-6">Página / URL</div>
           <div className="col-span-2">Horário</div>
           <div className="col-span-2 text-center">Visitas</div>
           <div className="col-span-2 text-right">Ações</div>
         </div>

         {/* List */}
         <div className="overflow-y-auto custom-scrollbar flex-1">
           {loading ? (
             <div className="p-6 text-sm text-text-secondary font-mono animate-pulse">
               ⏳ Carregando dados...
             </div>
           ) : items.length === 0 ? (
             <div className="p-6 text-sm text-text-secondary font-mono">
               Sem dados recebidos.
             </div>
           ) : items.map(item => (
             <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border-color hover:bg-bg-tertiary/30 transition-colors items-center text-sm">
               <div className="col-span-6 overflow-hidden">
                 <div className="flex items-center gap-2 mb-1">
                   <Globe size={14} className="text-accent-blue" />
                   <span className="font-bold text-text-primary truncate">{item.title}</span>
                 </div>
                 <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-text-muted truncate block hover:text-accent-blue hover:underline font-mono">
                   {item.url}
                 </a>
               </div>
               <div className="col-span-2 text-text-secondary font-mono">{item.time}</div>
               <div className="col-span-2 text-center">
                 <span className="bg-bg-tertiary px-2 py-1 rounded text-xs font-bold text-text-primary border border-border-color">
                   {item.visits}
                 </span>
               </div>
               <div className="col-span-2 text-right flex justify-end gap-2">
                 <button className="p-1 hover:text-accent-blue" title="Abrir" onClick={() => window.open(item.url, '_blank')}>
                   <ExternalLink size={14} />
                 </button>
                 <button className="p-1 hover:text-accent-red" title="Excluir">
                   <Trash2 size={14} />
                 </button>
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default BrowserHistory;
