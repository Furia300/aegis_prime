import React from 'react';
import DeviceCard from './DeviceCard';
import { Bot, Brain, Map as MapIcon, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CommandPanelProps {
  devices: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CommandPanel: React.FC<CommandPanelProps> = ({ devices, selectedId, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      <div className="p-4 border-b border-border-color bg-bg-secondary/50">
        <h2 className="text-sm font-tactical font-bold text-text-secondary tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-4 bg-accent-blue rounded-sm"></span>
          {t('command.title')} ({devices.length})
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {devices.map(device => (
          <DeviceCard 
            key={device.id} 
            device={device} 
            isSelected={selectedId === device.id}
            onSelect={() => onSelect(device.id)}
          />
        ))}
        {devices.length === 0 && (
             <div className="p-8 text-center text-text-muted text-sm font-mono flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-2 opacity-50">
                    <Bot size={24} />
                 </div>
                 {t('command.no_assets')}
                 <span className="text-xs opacity-50">{t('command.waiting')}</span>
             </div>
        )}
      </div>

      <div className="p-4 border-t border-border-color bg-bg-tertiary">
        <h3 className="text-xs font-bold text-accent-blue mb-3 uppercase tracking-wider flex items-center gap-2 font-tactical">
            <Bot size={14} />
            {t('command.ai_matrix')}
        </h3>
        <div className="space-y-2">
            <MatrixItem icon={<Brain size={14} />} label={t('command.matrix.sentiment')} active />
            <MatrixItem icon={<MapIcon size={14} />} label={t('command.matrix.geo')} active />
            <MatrixItem icon={<MessageSquare size={14} />} label={t('command.matrix.chatgpt')} active />
        </div>
      </div>
    </div>
  );
};

const MatrixItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
    <div className="flex items-center justify-between text-xs font-mono p-2 bg-bg-primary rounded border border-border-color hover:border-accent-blue/30 transition-colors cursor-default">
        <div className="flex items-center gap-2 text-text-secondary">
            {icon}
            <span>{label}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${active ? 'bg-accent-green animate-pulse shadow-[0_0_5px_#00ff88]' : 'bg-bg-tertiary'}`} />
    </div>
);

export default CommandPanel;
