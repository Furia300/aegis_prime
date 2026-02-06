import React, { useState } from 'react';
import Map, { Marker, NavigationControl, FullscreenControl, Popup } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Smartphone, Shield } from 'lucide-react';

interface TacticalMapProps {
  devices?: any[];
  onDeviceSelect?: (id: string) => void;
}

const TacticalMap: React.FC<TacticalMapProps> = ({ devices = [], onDeviceSelect }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative bg-bg-tertiary">
      <Map
        initialViewState={{
          longitude: -74.0060,
          latitude: 40.7128,
          zoom: 11,
          pitch: 45,
          bearing: -17.6
        }}
        style={{width: '100%', height: '100%'}}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        mapLib={maplibregl as any}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass showZoom />
        <FullscreenControl position="top-right" />

        {devices.map((device) => (
            device.latitude && device.longitude && (
          <Marker
            key={device.id}
            longitude={device.longitude}
            latitude={device.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedId(device.id);
              onDeviceSelect?.(device.id);
            }}
          >
            <div className={`
              relative flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${device.is_online ? 'border-accent-green bg-accent-green/20' : 'border-text-muted bg-bg-primary/80'}
              cursor-pointer hover:scale-110 transition-transform duration-200
              shadow-[0_0_15px_rgba(0,255,136,0.3)]
            `}>
              <Smartphone size={16} className={device.is_online ? 'text-accent-green' : 'text-text-muted'} />
              {device.battery_level < 20 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-red rounded-full border border-bg-primary flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
                </div>
              )}
            </div>
          </Marker>
            )
        ))}

        {selectedId && (() => {
            const device = devices.find(d => d.id === selectedId);
            if (!device) return null;
            return (
            <Popup
                longitude={device.longitude}
                latitude={device.latitude}
                onClose={() => setSelectedId(null)}
                closeButton={false}
                className="tactical-popup"
                offset={15}
            >
                <div className="p-3 min-w-[200px] bg-bg-tertiary border border-accent-blue/30 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2 border-b border-border-color pb-1">
                        <span className="text-accent-blue font-tactical font-bold text-lg">TARGET LOCKED</span>
                        <Shield size={14} className="text-accent-blue" />
                    </div>
                    <div className="space-y-1 font-mono text-xs text-text-primary">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">DEVICE:</span>
                            <span className="font-bold">{device.model}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">BATTERY:</span>
                            <span className={device.battery_level < 20 ? 'text-accent-red' : 'text-accent-green'}>
                                {device.battery_level}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">STATUS:</span>
                            <span className={device.is_online ? "text-accent-green" : "text-text-muted"}>
                                {device.is_online ? "ONLINE" : "OFFLINE"}
                            </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border-color text-[10px] text-text-muted">
                            COORDS: {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
                        </div>
                    </div>
                </div>
            </Popup>
            );
        })()}
      </Map>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-bg-secondary/90 backdrop-blur border border-border-color p-3 rounded shadow-xl pointer-events-none">
        <h3 className="text-accent-blue font-tactical font-bold tracking-widest text-sm mb-2">TACTICAL OVERLAY</h3>
        <div className="flex flex-col gap-2 text-xs font-mono text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green"></span>
            <span>FRIENDLY UNITS ({devices.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red"></span>
            <span>HOSTILES (0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalMap;
