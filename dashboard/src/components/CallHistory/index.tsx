import React, { useState, useEffect } from 'react';
import { PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Play, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const CallHistory = () => {
  const [calls, setCalls] = useState<Array<{ id: string; contact: string; number: string; type: string; duration: string; time: string; hasAudio: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();

    const channel = supabase
      .channel('calls-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'calls'
      }, () => {
        fetchCalls();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCalls = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      console.error('❌ Error fetching calls:', error);
      setCalls([]);
    } else {
      console.log('✅ Fetched', data?.length || 0, 'call records');
      const formatted = (data || []).map(call => ({
        id: call.id,
        contact: call.contact_name || 'Desconhecido',
        number: call.contact_number,
        type: call.call_type,
        duration: formatDuration(call.duration),
        time: formatDateTime(call.timestamp),
        hasAudio: false
      }));
      setCalls(formatted);
    }

    setLoading(false);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <PhoneCall className="animate-pulse" />
            HISTÓRICO DE CHAMADAS
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Registro de chamadas recebidas, efetuadas e perdidas
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 border border-accent-blue text-accent-blue rounded hover:bg-accent-blue/30 transition-colors text-xs font-bold font-tactical">
            <Download size={14} /> EXPORTAR CSV
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color overflow-hidden flex-1">
         <div className="grid grid-cols-12 gap-4 p-4 bg-bg-tertiary border-b border-border-color text-xs font-bold text-text-secondary uppercase tracking-wider">
           <div className="col-span-1">Tipo</div>
           <div className="col-span-3">Contato</div>
           <div className="col-span-3">Número</div>
           <div className="col-span-2">Duração</div>
           <div className="col-span-2">Data/Hora</div>
           <div className="col-span-1 text-right">Áudio</div>
         </div>

         <div className="overflow-y-auto custom-scrollbar h-full">
            {loading ? (
              <div className="p-6 text-sm text-text-secondary font-mono animate-pulse">
                ⏳ Carregando dados...
              </div>
            ) : calls.length === 0 ? (
              <div className="p-6 text-sm text-text-secondary font-mono">
                Sem dados recebidos.
              </div>
            ) : calls.map(call => (
              <div key={call.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border-color hover:bg-bg-tertiary/30 transition-colors items-center text-sm">
                <div className="col-span-1">
                   {call.type === 'incoming' && <PhoneIncoming size={16} className="text-accent-green" />}
                   {call.type === 'outgoing' && <PhoneOutgoing size={16} className="text-accent-blue" />}
                   {call.type === 'missed' && <PhoneMissed size={16} className="text-accent-red" />}
                </div>
                <div className="col-span-3 font-bold text-text-primary">{call.contact}</div>
                <div className="col-span-3 text-text-secondary font-mono">{call.number}</div>
                <div className="col-span-2 text-text-muted font-mono">{call.duration}</div>
                <div className="col-span-2 text-text-muted text-xs">{call.time}</div>
                <div className="col-span-1 text-right flex justify-end gap-2">
                  {call.hasAudio && (
                    <>
                      <button className="p-1 hover:text-accent-green transition-colors" title="Reproduzir">
                        <Play size={14} />
                      </button>
                      <button className="p-1 hover:text-accent-blue transition-colors" title="Baixar">
                        <Download size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default CallHistory;
