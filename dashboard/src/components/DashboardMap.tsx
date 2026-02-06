import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { Device } from '../lib/supabase';
import { Shield, Battery, Signal, Smartphone, AlertTriangle } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbHR4eX..."'; // Placeholder

interface DashboardMapProps {
  devices: Device[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const DashboardMap: React.FC<DashboardMapProps> = ({ devices, selectedId, onSelect }) => {
  const [viewState, setViewState] = useState({
    latitude: -23.550520,
    longitude: -46.633308,
    zoom: 12
  });

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        
        {devices.map(device => (
          device.latitude && device.longitude && (
            <Marker 
              key={device.id} 
              latitude={device.latitude} 
              longitude={device.longitude}
              onClick={e => {
                e.originalEvent.stopPropagation();
                onSelect(device.id);
              }}
            >
              <div className={`
                relative flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${device.is_online ? 'border-green-500 bg-green-500/20' : 'border-gray-500 bg-gray-500/20'}
                cursor-pointer transition-transform hover:scale-110
              `}>
                <Shield className="w-5 h-5 text-white" />
                {/* Pulse effect for online devices */}
                {device.is_online && (
                  <span className="absolute w-full h-full rounded-full animate-ping bg-green-500 opacity-20"></span>
                )}
              </div>
            </Marker>
          )
        ))}

        {selectedId && (() => {
          const device = devices.find(d => d.id === selectedId);
          if (!device || !device.latitude || !device.longitude) return null;
          
          return (
            <Popup
              latitude={device.latitude}
              longitude={device.longitude}
              onClose={() => onSelect(null)}
              closeButton={true}
              closeOnClick={false}
              anchor="bottom"
              offset={20}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <Smartphone size={16} /> {device.model}
                </h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Battery size={14}/> Bateria</span>
                    <span className={device.battery_level < 20 ? 'text-red-500' : 'text-green-500'}>
                      {device.battery_level}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><Signal size={14}/> Sinal</span>
                    <span>{device.signal_strength}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Última vez visto: {new Date(device.last_seen).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </Popup>
          );
        })()}
      </Map>
      
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur p-2 rounded border border-gray-700">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Status do Sistema</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-mono text-green-400">ATIVO - MONITORANDO</span>
        </div>
      </div>
    </div>
  );
};
