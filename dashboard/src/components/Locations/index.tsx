import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Map as MapIcon, Layers } from 'lucide-react';
import TacticalMap from '../TacticalMap';
import { supabase } from '../../lib/supabase';

const Locations = () => {
  const [locations, setLocations] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();

    const channel = supabase
      .channel('locations-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'locations'
      }, () => {
        fetchLocations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLocations = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Error fetching locations:', error);
      setLocations([]);
    } else {
      console.log('✅ Fetched', data?.length || 0, 'location records');
      setLocations(data || []);
    }

    setLoading(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <MapPin className="animate-pulse" />
            LOCALIZAÇÃO & GEO-FENCING
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Rastreamento GPS em tempo real e cercas virtuais
          </p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border-color rounded hover:bg-bg-secondary transition-colors text-xs font-bold font-tactical">
            <Layers size={14} /> CAMADAS
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 border border-accent-blue text-accent-blue rounded hover:bg-accent-blue/30 transition-colors text-xs font-bold font-tactical">
            <Navigation size={14} /> ROTAS
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color flex-1 overflow-hidden relative">
        <TacticalMap />

        {/* Overlay Panel for Locations List */}
        <div className="absolute top-4 right-4 w-80 bg-bg-primary/90 backdrop-blur border border-border-color rounded shadow-lg p-4 max-h-[80%] overflow-y-auto custom-scrollbar">
           <h3 className="text-xs font-bold text-accent-blue uppercase mb-3 flex items-center gap-2">
             <MapIcon size={14} /> Histórico Recente
           </h3>
           <div className="space-y-3">
             {loading ? (
               <div className="text-xs text-text-secondary font-mono animate-pulse">
                 ⏳ Carregando...
               </div>
             ) : locations.length === 0 ? (
               <div className="text-xs text-text-secondary font-mono">
                 Sem dados recebidos.
               </div>
             ) : locations.map((loc, i) => (
               <div key={loc.id} className="flex items-start gap-3 pb-3 border-b border-border-color last:border-0">
                 <div className="mt-1 w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
                 <div>
                   <p className="text-xs font-bold text-text-primary">
                     Lat: {loc.latitude.toFixed(4)} | Long: {loc.longitude.toFixed(4)}
                   </p>
                   <p className="text-[10px] text-text-muted font-mono">
                     Precisão: {loc.accuracy ? `${loc.accuracy}m` : 'N/A'}
                   </p>
                   <p className="text-[10px] text-text-secondary mt-1">{formatTimestamp(loc.timestamp)}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
