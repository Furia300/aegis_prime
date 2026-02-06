import React from 'react';
import { Device } from '../lib/supabase';
import { Smartphone, Battery, Signal, Wifi, WifiOff, Clock } from 'lucide-react';

interface DeviceListProps {
  devices: Device[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices, selectedId, onSelect }) => {
  return (
    <div className="bg-aegis-800 border-r border-gray-800 w-80 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="text-aegis-accent" />
          AEGIS PRIME
        </h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">War Room Dashboard v2.0</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {devices.map(device => (
          <div
            key={device.id}
            onClick={() => onSelect(device.id)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-all
              ${selectedId === device.id 
                ? 'bg-aegis-700 border-aegis-accent shadow-lg shadow-red-900/20' 
                : 'bg-aegis-900/50 border-gray-800 hover:bg-aegis-700'}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium flex items-center gap-2">
                <Smartphone size={16} className="text-gray-400" />
                {device.model}
              </span>
              {device.is_online ? (
                <Wifi size={14} className="text-green-500" />
              ) : (
                <WifiOff size={14} className="text-red-500" />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Battery size={12} />
                <span className={device.battery_level < 20 ? 'text-red-400' : ''}>
                  {device.battery_level}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Signal size={12} />
                <span>{device.signal_strength}%</span>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-700/50 flex items-center gap-1 text-[10px] text-gray-500">
              <Clock size={10} />
              {new Date(device.last_seen).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700 bg-aegis-900/50">
        <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          Protocolo Pânico Global
        </button>
      </div>
    </div>
  );
};

import { Shield, AlertTriangle } from 'lucide-react';
