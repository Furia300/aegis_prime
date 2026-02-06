import React from 'react';
import { Terminal, Image, Mic, MapPin, MessageCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const ActivityFeed: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-bg-secondary border-t border-border-color">
      <div className="p-3 border-b border-border-color flex justify-between items-center bg-bg-secondary/80 backdrop-blur sticky top-0 z-10">
        <h3 className="text-sm font-tactical font-bold text-text-primary tracking-widest flex items-center gap-2">
            <Terminal size={14} className="text-accent-yellow" />
            REALTIME ACTIVITY FEED
        </h3>
        <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
            <span className="text-[10px] font-mono text-accent-green">LIVE</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <div className="divide-y divide-border-color/30">
          <div className="p-6 text-xs font-mono text-text-secondary">
            Sem atividades recebidas do dispositivo.
          </div>
        </div>
      </div>
    </div>
  );
};

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'keylogger': return <Terminal size={12} className="text-text-secondary" />;
        case 'screenshot': return <Image size={12} className="text-accent-blue" />;
        case 'audio': return <Mic size={12} className="text-accent-yellow" />;
        case 'geofence': return <MapPin size={12} className="text-accent-red" />;
        case 'message': return <MessageCircle size={12} className="text-accent-green" />;
        default: return <AlertTriangle size={12} className="text-text-muted" />;
    }
};

export default ActivityFeed;
